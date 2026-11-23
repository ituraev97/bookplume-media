#!/usr/bin/env python3
"""thumbkit — bright, "illustrated" YouTube thumbnails from REAL frames, without distorting faces.

Only pixel-local filters are used (cut-out, colour grade, edge-preserving smoothing, sharpening, outline,
rim light). Geometry is never changed and no generative model redraws a face, so the person stays
exactly who they are.

  python thumbkit.py spec.json            -> writes spec["out"] (1280x720 JPEG)
  spec.json may also be a LIST of specs (variants A, B, C; default outs thumb.jpg, thumb_B.jpg, thumb_C.jpg)
  needs: pip install pillow numpy opencv-python-headless "rembg[cpu]"   (+ ffmpeg)

spec.json
{
  "out": "thumb.jpg",
  "layout": "solo" | "versus",              # solo: 1 person right, text left. versus: 2 people, text centre
  "people": [                               # 1 (solo) or 2 (versus, left then right)
    {"src": "media/clip.mp4" | "frame.png", "t": 12.4, "crop": [x, y, w, h] | null,
     "yt": "YouTubeID" (optional: grab the frame at t in 1080p from YouTube; crop is then in 1920x1080 coords),
     "tint": "warm" | "cold" | "toxic" | "gold", "flip": false,
     "kind": "person" | "object"}          # object = product, document, car, building... (general cut-out model)
  ],
  "line1": "CEO", "line2": "SNAPS",          # <= 3 big words total; line2 is drawn in the accent colour
  "sticker": "NOT EA",                      # optional small yellow label
  "tag": "THE WARDOGS SAGA",                # optional small caps line
  "brand": {"accent": "#FF4D1F", "sticker": "#E6FF3B", "ink": "#0B0B0F", "logo": "logo.png", "border": true}
}
crop: take a generous box around head + shoulders (face ~35-50 % of the box height). Source frames should
be >= 720p of the PERSON (download 1080p for the thumbnail frame when possible).
"""
import json, os, subprocess, sys, tempfile
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageEnhance, ImageOps

W, H = 1280, 720
HERE = os.path.dirname(os.path.abspath(__file__))
FONT_BIG = os.path.join(HERE, "fonts", "Anton-Regular.ttf")
FONT_SMALL = os.path.join(HERE, "fonts", "Inter-Black.ttf")
TINTS = {"warm": ((255, 60, 40), (255, 150, 60)), "cold": ((40, 120, 255), (90, 220, 255)),
         "toxic": ((90, 255, 60), (230, 255, 60)), "gold": ((255, 170, 30), (255, 230, 120))}

try:
    import cv2
except ImportError:
    cv2 = None


def hexrgb(h):
    h = h.lstrip("#"); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def grab(src, t, tmp, yt=None):
    if yt:  # 1080p frame straight from YouTube (THUMBKIT_YTDLP = yt-dlp command, e.g. /opt/hotfix/bin/ytdl)
        base = os.path.join(tmp, f"yt_{yt}_{int(float(t or 0))}")
        if os.path.exists(base + ".png"):
            return Image.open(base + ".png").convert("RGB")
        cmd = os.environ.get("THUMBKIT_YTDLP", "yt-dlp")
        r = subprocess.run([cmd, "-q", "--no-warnings", "-f", "bv*[height<=1080][ext=mp4]/bv*[height<=1080]/b",
                            "--download-sections", f"*{float(t or 0)}-{float(t or 0) + 2}", "--force-keyframes-at-cuts",
                            "-o", base + ".%(ext)s", f"https://www.youtube.com/watch?v={yt}"])
        got = [f for f in os.listdir(tmp) if f.startswith(os.path.basename(base) + ".") and not f.endswith(".png")]
        if r.returncode == 0 and got:
            out = base + ".png"
            subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", os.path.join(tmp, got[0]), "-frames:v", "1", out], check=True)
            return Image.open(out).convert("RGB")
        print(f"thumbkit: 1080p grab of {yt} failed, using src", file=sys.stderr)
    if src.lower().endswith((".png", ".jpg", ".jpeg", ".webp")):
        return Image.open(src).convert("RGB")
    out = os.path.join(tmp, f"f_{abs(hash((src, t)))}.png")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", str(t or 0), "-i", src, "-frames:v", "1", out], check=True)
    return Image.open(out).convert("RGB")


def upscale(img, target_h):
    """Lanczos only: enlarges without inventing detail (no GAN = no face changes)."""
    if img.height >= target_h:
        return img
    s = target_h / img.height
    return img.resize((round(img.width * s), round(img.height * s)), Image.LANCZOS)


def illustrate(img, target_h=900):
    """Clean, punchy 'painted' look that keeps every feature where it is.
    Denoise at native size, Lanczos up, then gentle edge-preserving smoothing (weaker for tiny sources)."""
    a = np.asarray(img)
    factor = target_h / max(img.height, 1)
    if cv2 is not None:
        bgr = cv2.cvtColor(a, cv2.COLOR_RGB2BGR)
        bgr = cv2.fastNlMeansDenoisingColored(bgr, None, 3, 3, 5, 15)           # remove webcam noise (native res)
        if factor > 1:
            bgr = cv2.resize(bgr, None, fx=factor, fy=factor, interpolation=cv2.INTER_LANCZOS4)
        k = 0.45 if factor <= 1.6 else 0.3 if factor <= 3 else 0.2
        smooth = cv2.edgePreservingFilter(bgr, flags=1, sigma_s=25, sigma_r=0.15)  # flat painted areas, sharp edges
        bgr = cv2.addWeighted(bgr, 1 - k, smooth, k, 0)
        bgr = cv2.detailEnhance(bgr, sigma_s=6, sigma_r=0.08)                     # crisp eyes/hair/beard
        hh, ww = bgr.shape[:2]
        centre = cv2.cvtColor(bgr[hh // 6: hh // 2, ww // 4: 3 * ww // 4], cv2.COLOR_BGR2GRAY).mean()
        if centre < 110:                                                           # lift shadows only on dark faces
            g = 0.75 if centre < 70 else 0.85
            bgr = cv2.LUT(bgr, np.array([((i / 255) ** g) * 255 for i in range(256)], np.uint8))
        lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB)                                # local contrast (CLAHE on L)
        lab[..., 0] = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(6, 6)).apply(lab[..., 0])
        a = cv2.cvtColor(cv2.cvtColor(lab, cv2.COLOR_LAB2BGR), cv2.COLOR_BGR2RGB)
    img = Image.fromarray(a)
    img = ImageOps.autocontrast(img, cutoff=0.5)
    if np.asarray(img.convert("L")).mean() < 120:
        img = ImageEnhance.Brightness(img).enhance(1.1)
    img = ImageEnhance.Color(img).enhance(1.35)
    img = ImageEnhance.Contrast(img).enhance(1.12)
    return img.filter(ImageFilter.UnsharpMask(radius=2, percent=90, threshold=2))


_SESSIONS = {}


def cutout(img, kind="person"):
    """Subject mask (L). rembg if installed (person model or general-object model), else a soft oval."""
    try:
        from rembg import new_session, remove
        model = os.environ.get("THUMBKIT_MODEL") if kind == "person" else None
        model = model or ("u2net_human_seg" if kind == "person" else "isnet-general-use")
        if model not in _SESSIONS:
            _SESSIONS[model] = new_session(model)
        m = remove(img, session=_SESSIONS[model], only_mask=True, post_process_mask=True)
        m = m.convert("L") if isinstance(m, Image.Image) else Image.fromarray(m).convert("L")
    except Exception as e:  # noqa
        print("thumbkit: rembg unavailable, using soft mask:", e, file=sys.stderr)
        m = Image.new("L", img.size, 0)
        ImageDraw.Draw(m).ellipse([img.width * .08, img.height * .02, img.width * .92, img.height * 1.4], fill=255)
        return m.filter(ImageFilter.GaussianBlur(img.width * .06))
    m = m.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.2))
    return m


def background(frame, tint, side):
    """Blurred real background + strong colour wash + vignette + soft smoke."""
    bg = ImageOps.fit(frame, (W, H), Image.LANCZOS).filter(ImageFilter.GaussianBlur(28))
    bg = ImageEnhance.Brightness(bg).enhance(0.45)
    c1, c2 = TINTS.get(tint, TINTS["warm"])
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    cx = W * (0.72 if side == "right" else 0.28 if side == "left" else 0.5)
    d = np.sqrt(((xx - cx) / W) ** 2 + ((yy - H * .45) / H) ** 2)
    glow = np.clip(1 - d * 1.5, 0, 1)[..., None]
    wash = np.array(c1, np.float32) * (1 - glow) * 0.55 + np.array(c2, np.float32) * glow * 0.9
    a = np.asarray(bg, np.float32) * 0.5 + wash * 0.75
    rng = np.random.default_rng(7)                                   # smoke: blurred noise
    smoke = Image.fromarray((rng.random((H // 8, W // 8)) * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)
    smoke = np.asarray(smoke.filter(ImageFilter.GaussianBlur(30)), np.float32)[..., None] / 255
    a = a * (0.85 + smoke * 0.35)
    vig = np.clip(1 - (np.sqrt(((xx - W / 2) / W) ** 2 + ((yy - H / 2) / H) ** 2) - 0.3) * 1.6, 0.25, 1)[..., None]
    return Image.fromarray(np.clip(a * vig, 0, 255).astype(np.uint8))


def place(canvas, person, mask, box, tint, rim_side):
    """Fit person into box (bottom-anchored), add white outline, colour glow and rim light."""
    x0, y0, bw, bh = box
    s = min(bw / person.width, bh / person.height)
    s = max(s, bh / person.height)                                    # fill the height
    size = (round(person.width * s), round(person.height * s))
    p, m = person.resize(size, Image.LANCZOS), mask.resize(size, Image.LANCZOS)
    px, py = x0 + (bw - size[0]) // 2, y0 + bh - size[1]
    c1, c2 = TINTS.get(tint, TINTS["warm"])
    full = Image.new("L", (W, H), 0); full.paste(m, (px, py))
    # outer colour glow
    glow = full.filter(ImageFilter.MaxFilter(31)).filter(ImageFilter.GaussianBlur(22))
    canvas.paste(Image.new("RGB", (W, H), c2), (0, 0), glow.point(lambda v: int(v * .85)))
    # white sticker outline
    ring = full.filter(ImageFilter.MaxFilter(15)).filter(ImageFilter.GaussianBlur(1))
    canvas.paste(Image.new("RGB", (W, H), (255, 255, 255)), (0, 0), ring)
    # rim light on the person (edge band on one side)
    pa = np.asarray(p, np.float32)
    ma = np.asarray(m, np.float32) / 255
    inner = np.asarray(m.filter(ImageFilter.MinFilter(9)).filter(ImageFilter.GaussianBlur(5)), np.float32) / 255
    band = np.clip(ma - inner, 0, 1)
    ramp = np.linspace(0, 1, size[0], dtype=np.float32)[None, :]
    if rim_side == "left":
        ramp = 1 - ramp
    band = (band * np.clip(ramp * 1.6 - .2, 0, 1))[..., None]
    pa = pa * (1 - band * .55) + np.array(c2, np.float32) * band * .55
    p = Image.fromarray(np.clip(pa, 0, 255).astype(np.uint8))
    canvas.paste(p, (px, py), m)
    return (px, py, size[0], size[1])


def _black(f):
    try:
        f.set_variation_by_name("Black")
    except Exception:
        pass
    return f


def fit_font(draw, text, path, max_w, max_h):
    size = int(max_h)
    while size > 20:
        f = ImageFont.truetype(path, size)
        if path == FONT_SMALL:
            _black(f)
        l, t, r, b = draw.textbbox((0, 0), text, font=f)
        if r - l <= max_w and b - t <= max_h:
            return f
        size -= 4
    return ImageFont.truetype(path, 20)


def big_text(canvas, lines, area, colors, align):
    x0, y0, aw, ah = area
    lines = [l for l in lines if l]
    if not lines:
        return
    d = ImageDraw.Draw(canvas)
    lh = ah / len(lines)
    fonts = [fit_font(d, l, FONT_BIG, aw, lh * 1.12) for l in lines]
    fs = min(f.size for f in fonts)
    fonts = [ImageFont.truetype(FONT_BIG, fs) for _ in lines]
    hts = [d.textbbox((0, 0), l, font=f) for l, f in zip(lines, fonts)]
    total = sum(b[3] - b[1] for b in hts) + (len(lines) - 1) * fs * 0.04
    y = y0 + (ah - total) / 2
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sd = ImageDraw.Draw(shadow)
    pos = []
    for l, f, b, col in zip(lines, fonts, hts, colors):
        w = b[2] - b[0]
        x = x0 + (aw - w) / 2 if align == "center" else x0
        pos.append((x - b[0], y - b[1], l, f, col))
        sd.text((x - b[0] + 8, y - b[1] + 10), l, font=f, fill=(0, 0, 0, 230))
        y += (b[3] - b[1]) + fs * 0.04
    canvas.paste(shadow.filter(ImageFilter.GaussianBlur(9)), (0, 0), shadow.filter(ImageFilter.GaussianBlur(9)))
    for x, y, l, f, col in pos:
        d.text((x, y), l, font=f, fill=col, stroke_width=max(4, fs // 22), stroke_fill=(10, 10, 12))


def sticker(canvas, text, xy, color, max_w=430):
    d = ImageDraw.Draw(canvas)
    f = fit_font(d, text, FONT_SMALL, max_w - 50, 56)
    l, t, r, b = d.textbbox((0, 0), text, font=f)
    tile = Image.new("RGBA", (r - l + 50, b - t + 34), color + (255,))
    ImageDraw.Draw(tile).text((25 - l, 17 - t), text, font=f, fill=(10, 10, 12))
    tile = tile.rotate(-3, expand=True, resample=Image.BICUBIC)
    sh = Image.new("RGBA", tile.size, (0, 0, 0, 160)); sh.putalpha(tile.getchannel("A").point(lambda v: v * 0.6))
    canvas.paste(sh.filter(ImageFilter.GaussianBlur(6)), (xy[0] + 6, xy[1] + 8), sh.filter(ImageFilter.GaussianBlur(6)))
    canvas.paste(tile, xy, tile)


def render(spec):
    br = {"accent": "#FF4D1F", "sticker": "#E6FF3B", "ink": "#0B0B0F", "border": True, **spec.get("brand", {})}
    acc, stk = hexrgb(br["accent"]), hexrgb(br["sticker"])
    layout = spec.get("layout", "solo")
    with tempfile.TemporaryDirectory() as tmp:
        prepared = []
        for pp in spec["people"][:2]:
            fr = grab(pp.get("src", ""), pp.get("t"), tmp, pp.get("yt"))
            if pp.get("crop"):
                x, y, w, h = pp["crop"]; fr_c = fr.crop((x, y, x + w, y + h))
            else:
                fr_c = fr
            if pp.get("flip"):
                fr_c = ImageOps.mirror(fr_c)
            if fr_c.height < 360:
                print(f"thumbkit: WARNING person crop only {fr_c.height}px tall - use a 1080p frame", file=sys.stderr)
            art = illustrate(fr_c) if cv2 is not None else illustrate(upscale(fr_c, 900))
            prepared.append((fr, art, cutout(art, pp.get("kind", "person")), pp.get("tint", "warm")))
    if layout == "versus" and len(prepared) == 2:
        left = background(prepared[0][0], prepared[0][3], "left")
        right = background(prepared[1][0], prepared[1][3], "right")
        cut = Image.new("L", (W, H), 0)
        ImageDraw.Draw(cut).polygon([(W * .56, 0), (W, 0), (W, H), (W * .44, H)], fill=255)
        canvas = left.copy(); canvas.paste(right, (0, 0), cut)
        place(canvas, prepared[0][1], prepared[0][2], (-90, 60, 600, H - 60), prepared[0][3], "left")
        place(canvas, prepared[1][1], prepared[1][2], (W - 510, 60, 600, H - 60), prepared[1][3], "right")
        d = ImageDraw.Draw(canvas)
        d.line([(W * .56, 0), (W * .44, H)], fill=stk, width=10)
        big_text(canvas, [spec.get("line1", ""), spec.get("line2", "")], (W * .34, H * .30, W * .32, H * .42),
                 [(255, 255, 255), stk], "center")
        if spec.get("sticker"):
            sticker(canvas, spec["sticker"], (int(W * .36), int(H * .76)), stk, 360)
    else:
        fr, person, mask, tint = prepared[0]
        canvas = background(fr, tint, "right")
        place(canvas, person, mask, (W - 700, 30, 720, H - 30), tint, "left")
        big_text(canvas, [spec.get("line1", ""), spec.get("line2", "")], (48, 60, W * .5, H * .58),
                 [(255, 255, 255), acc], "left")
        if spec.get("sticker"):
            sticker(canvas, spec["sticker"], (52, int(H * .70)), stk)
    if spec.get("tag"):
        d = ImageDraw.Draw(canvas)
        f = _black(ImageFont.truetype(FONT_SMALL, 26))
        x = 60 if layout != "versus" else int((W - d.textlength(spec["tag"], font=f)) / 2)
        y = H - 64 if layout != "versus" else 22
        d.text((x, y), spec["tag"], font=f, fill=(235, 235, 235), stroke_width=3, stroke_fill=(0, 0, 0))
    if br.get("logo") and os.path.exists(br["logo"]):
        lg = Image.open(br["logo"]).convert("RGBA"); lg.thumbnail((70, 70))
        canvas.paste(lg, (W - lg.width - 28, 26), lg)   # top-right: bottom-right = duration badge
    if br.get("border"):
        ImageDraw.Draw(canvas).rectangle([0, 0, W - 1, H - 1], outline=acc, width=10)
    out = spec.get("out", "thumb.jpg")
    canvas.convert("RGB").save(out, quality=92)
    return out


if __name__ == "__main__":
    p = sys.argv[1]
    specs = json.load(open(p))
    base = os.path.dirname(os.path.abspath(p))
    for i, spec in enumerate(specs if isinstance(specs, list) else [specs]):   # a list = variants A, B, C...
        for pp in spec["people"]:
            if pp.get("src") and not os.path.isabs(pp["src"]):
                pp["src"] = os.path.join(base, pp["src"])
        out = spec.get("out") or ("thumb.jpg" if i == 0 else f"thumb_{'ABCDEF'[i]}.jpg")
        spec["out"] = out if os.path.isabs(out) else os.path.join(base, out)
        print(render(spec))
