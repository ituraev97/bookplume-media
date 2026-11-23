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
FONT_MONO = os.path.join(HERE, "fonts", "JetBrainsMono.ttf")
FONT_URLS = {FONT_MONO: "https://github.com/google/fonts/raw/main/ofl/jetbrainsmono/JetBrainsMono%5Bwght%5D.ttf",FONT_BIG: "https://github.com/google/fonts/raw/main/ofl/anton/Anton-Regular.ttf",
             FONT_SMALL: "https://github.com/google/fonts/raw/main/ofl/inter/Inter%5Bopsz,wght%5D.ttf"}


def ensure_fonts():
    """Fonts are OFL; fetched from github.com/google/fonts when the fonts/ folder is missing."""
    import urllib.request
    for path, url in FONT_URLS.items():
        if not os.path.exists(path):
            os.makedirs(os.path.dirname(path), exist_ok=True)
            try:
                urllib.request.urlretrieve(url, path)
            except Exception:
                subprocess.run(["curl", "-sL", "-o", path, url], check=True)


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


# ---------- plate templates (AI-painted picture + real text/documents; see STYLE.md) ----------
CREAM, GOLD, RED, YEL = (238, 231, 215), (212, 166, 74), (214, 40, 40), (255, 230, 0)


def _cover(img, w, h, focus=(0.5, 0.5)):
    return ImageOps.fit(img.convert("RGB"), (w, h), Image.LANCZOS, centering=focus)


def _finish(canvas, spec, br):
    if br.get("logo") and os.path.exists(br["logo"]):
        lg = Image.open(br["logo"]).convert("RGBA"); lg.thumbnail((84, 84))
        canvas.paste(lg, (W - lg.width - 26, 24), lg)
    out = spec["out"]
    canvas.convert("RGB").save(out, quality=92)
    return out


def _label(canvas, text, xy, style):
    d = ImageDraw.Draw(canvas)
    f = _black(ImageFont.truetype(FONT_SMALL, 46))
    l, t, r, b = d.textbbox((0, 0), text, font=f)
    bg, fg = ((214, 40, 40), CREAM) if style == "red" else (CREAM, (12, 12, 12))
    d.rectangle([xy[0], xy[1], xy[0] + r - l + 44, xy[1] + b - t + 30], fill=bg)
    d.text((xy[0] + 22 - l, xy[1] + 15 - t), text, font=f, fill=fg)


def render_doc(spec, br):
    """Documentary split: black text panel left, cinematic plate right fading into black."""
    canvas = Image.new("RGB", (W, H), (11, 11, 11))
    plate = Image.open(spec["plate"])
    pw = int(W * .64)
    pl = _cover(plate, pw, H, tuple(spec.get("focus", (0.5, 0.5))))
    if spec.get("bw", False):
        pl = ImageOps.grayscale(pl).convert("RGB")
        pl = ImageEnhance.Contrast(pl).enhance(1.15)
    mask = Image.linear_gradient("L").rotate(90, expand=True).resize((pw, H))   # left 255 -> right 0
    mask = ImageOps.invert(mask).point(lambda v: min(255, int(v * 2.2)))           # fade in over the left 45 %
    canvas.paste(pl, (W - pw, 0), mask)
    lines = spec["lines"]
    acc = hexrgb(spec["accent"]) if spec.get("accent") else GOLD
    k = spec.get("accent_from", len(lines) - 1)
    d = ImageDraw.Draw(canvas)
    area_w, area_h = W * .50, H * (.62 if spec.get("label") else .74)
    lh = area_h / len(lines)
    fs = min(fit_font(d, l, FONT_BIG, area_w, lh * 1.05).size for l in lines)
    f = ImageFont.truetype(FONT_BIG, fs)
    y = H * .10 + (area_h - lh * len(lines)) / 2
    for i, l in enumerate(lines):
        b = d.textbbox((0, 0), l, font=f)
        d.text((48 - b[0], y - b[1]), l, font=f, fill=acc if i >= k else CREAM)
        y += lh
    if spec.get("label"):
        _label(canvas, spec["label"], (48, int(y + 18)), spec.get("label_style", "red"))
    return _finish(canvas, spec, br)


def render_evidence(spec, br):
    """Object under a spotlight (left) + real document with highlights and a red stamp (right)."""
    canvas = Image.new("RGB", (W, H), (10, 14, 30))
    half = W // 2
    canvas.paste(_cover(Image.open(spec["plate"]), half - 3, H, tuple(spec.get("focus", (0.5, 0.5)))), (0, 0))
    right = Image.new("RGB", (W - half - 3, H), (245, 245, 240))
    if spec.get("doc"):
        doc = Image.open(spec["doc"]).convert("RGB")
        hl = spec.get("highlights", [])
        if hl:                                                                    # yellow marker (multiply)
            ov = Image.new("RGB", doc.size, (255, 255, 255)); od = ImageDraw.Draw(ov)
            for x, y, w, h in hl:
                od.rectangle([x, y, x + w, y + h], fill=(255, 236, 60))
            doc = Image.fromarray((np.asarray(doc, np.float32) * np.asarray(ov, np.float32) / 255).astype(np.uint8))
        s = right.width / doc.width
        doc = doc.resize((right.width, int(doc.height * s)), Image.LANCZOS)
        top = int(spec.get("doc_top", 0) * s)
        right.paste(doc.crop((0, top, doc.width, top + H)), (0, 0))
    yy, xx = np.mgrid[0:H, 0:right.width].astype(np.float32)                    # spotlight vignette
    v = np.clip(1.15 - np.sqrt(((xx - right.width * .5) / right.width) ** 2 + ((yy - H * .42) / H) ** 2) * 1.5, .25, 1)
    right = Image.fromarray(np.clip(np.asarray(right, np.float32) * v[..., None], 0, 255).astype(np.uint8))
    canvas.paste(right, (half + 3, 0))
    ImageDraw.Draw(canvas).rectangle([half - 3, 0, half + 3, H], fill=(240, 240, 240))
    if spec.get("stamp"):                                                         # red rubber stamp
        f = ImageFont.truetype(FONT_BIG, 92)
        d0 = ImageDraw.Draw(canvas); l, t, r, b = d0.textbbox((0, 0), spec["stamp"], font=f)
        st = Image.new("RGBA", (r - l + 70, b - t + 56), (0, 0, 0, 0)); sd = ImageDraw.Draw(st)
        sd.rectangle([4, 4, st.width - 5, st.height - 5], outline=(225, 20, 30, 255), width=9, fill=(255, 255, 255, 235))
        sd.text((35 - l, 28 - t), spec["stamp"], font=f, fill=(225, 20, 30, 255))
        st = st.rotate(8, expand=True, resample=Image.BICUBIC)
        canvas.paste(st, (half + (W - half - st.width) // 2 + 20, int(H * .30)), st)
    if spec.get("tag"):                                                           # red slanted tag top-left
        f = _black(ImageFont.truetype(FONT_SMALL, 50))
        d0 = ImageDraw.Draw(canvas); l, t, r, b = d0.textbbox((0, 0), spec["tag"], font=f)
        tw, th = r - l + 70, b - t + 34
        d0.polygon([(0, 22), (tw + 30, 22), (tw, 22 + th), (0, 22 + th)], fill=(220, 25, 35))
        tg = Image.new("RGBA", (r - l + 20, b - t + 10), (0, 0, 0, 0))
        ImageDraw.Draw(tg).text((10 - l, 5 - t), spec["tag"], font=f, fill=(255, 255, 255))
        tg = tg.transform(tg.size, Image.AFFINE, (1, 0.18, -0.09 * tg.height, 0, 1, 0), Image.BICUBIC)   # italic
        canvas.paste(tg, (24, 22 + (th - tg.height) // 2), tg)
    c2 = hexrgb(spec.get("line2_color", "#FFE600"))
    big_text(canvas, [spec.get("line1", ""), spec.get("line2", "")], (40, H * .62, W - 80, H * .36),
             [(255, 255, 255), c2], "center")
    return _finish(canvas, spec, br)


# ---------- generic layouts + overlays (learned from YouTube AI thumbnails, see STYLE.md) ----------
GREEN = (80, 230, 120)
COLORS = {"white": (255, 255, 255), "yellow": YEL, "red": (240, 50, 50), "green": GREEN, "grey": (170, 170, 170),
          "cream": CREAM, "gold": GOLD, "orange": (255, 170, 40)}


def col(c):
    return COLORS.get(c, None) or (hexrgb(c) if isinstance(c, str) and c.startswith("#") else (255, 255, 255))


def _spot(img, cx=.5, cy=.45, k=1.5, floor=.2):
    w, h = img.size
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    v = np.clip(1.15 - np.sqrt(((xx - w * cx) / w) ** 2 + ((yy - h * cy) / h) ** 2) * k, floor, 1)
    return Image.fromarray(np.clip(np.asarray(img.convert("RGB"), np.float32) * v[..., None], 0, 255).astype(np.uint8))


def _doc_panel(d, w, h):
    panel = Image.new("RGB", (w, h), (245, 245, 240))
    doc = Image.open(d["doc"]).convert("RGB")
    if d.get("highlights"):
        ov = Image.new("RGB", doc.size, (255, 255, 255)); od = ImageDraw.Draw(ov)
        for x, y, ww, hh in d["highlights"]:
            od.rectangle([x, y, x + ww, y + hh], fill=(255, 236, 60))
        doc = Image.fromarray((np.asarray(doc, np.float32) * np.asarray(ov, np.float32) / 255).astype(np.uint8))
    s = w * d.get("zoom", 1.0) / doc.width
    doc = doc.resize((int(doc.width * s), int(doc.height * s)), Image.LANCZOS)
    top, left = int(d.get("doc_top", 0) * s), int(d.get("doc_left", 0) * s)
    panel.paste(doc.crop((left, top, left + w, top + h)), (0, 0))
    return _spot(panel, k=1.7, floor=.12) if d.get("spot", True) else panel


def _side(d, w, h):
    if d.get("doc"):
        return _doc_panel(d, w, h)
    if d.get("plate"):
        im = _cover(Image.open(d["plate"]), w, h, tuple(d.get("focus", (0.5, 0.5))))
        if d.get("bw"):
            im = ImageOps.grayscale(im).convert("RGB")
        return _spot(im, k=1.0, floor=.45) if d.get("spot") else im
    c = col(d.get("color", "#0E1A33"))
    g = Image.linear_gradient("L").resize((w, h))                      # top light -> bottom dark
    dark = tuple(int(v * .45) for v in c)
    return Image.composite(Image.new("RGB", (w, h), dark), Image.new("RGB", (w, h), c), g)


def render_full(spec, br):
    canvas = _cover(Image.open(spec["plate"]), W, H, tuple(spec.get("focus", (0.5, 0.5))))
    if spec.get("bw"):
        canvas = ImageOps.grayscale(canvas).convert("RGB")
    sh = Image.linear_gradient("L").resize((W, H)).point(lambda v: max(0, v - 110) * 1.6)   # darken bottom for text
    canvas = Image.composite(Image.new("RGB", (W, H), (0, 0, 0)), canvas, sh.point(lambda v: min(200, int(v))))
    return canvas


def render_split(spec, br):
    canvas = Image.new("RGB", (W, H), (0, 0, 0))
    sx = int(W * spec.get("split", .5))
    if spec.get("blend"):                # soft seam, no divider (mugshot + evidence look)
        bw = int(W * .16)
        lw = sx + bw // 2
        left = _side(spec.get("left", {}), lw, H)
        right = _side(spec.get("right", {}), W - sx + bw // 2, H)
        canvas.paste(right, (sx - bw // 2, 0))
        m = Image.linear_gradient("L").rotate(90, expand=True).resize((lw, H))   # 255 left -> 0 right
        m = m.point(lambda v: 255 if v > 255 * bw / lw else int(v / (bw / lw)))
        canvas.paste(left, (0, 0), m)
        return canvas
    canvas.paste(_side(spec.get("left", {}), sx - 3, H), (0, 0))
    canvas.paste(_side(spec.get("right", {}), W - sx - 3, H), (sx + 3, 0))
    ImageDraw.Draw(canvas).rectangle([sx - 3, 0, sx + 3, H], fill=(240, 240, 240))
    return canvas


def _text_box(d, xy, text, font, fg, bg, pad=(18, 10), outline=None, radius=0):
    l, t, r, b = d.textbbox((0, 0), text, font=font)
    box = [xy[0], xy[1], xy[0] + r - l + pad[0] * 2, xy[1] + b - t + pad[1] * 2]
    if bg is not None:
        d.rounded_rectangle(box, radius=radius, fill=bg, outline=outline, width=3 if outline else 0)
    d.text((xy[0] + pad[0] - l, xy[1] + pad[1] - t), text, font=font, fill=fg)
    return box


def overlay(canvas, o):
    d = ImageDraw.Draw(canvas)
    t = o["type"]
    if t == "tag":                       # red slanted tag, top-left ("NTSB REPORT", "SENTENCED")
        f = _black(ImageFont.truetype(FONT_SMALL, o.get("size", 54)))
        l, tt, r, b = d.textbbox((0, 0), o["text"], font=f)
        tw, th = r - l + 60, b - tt + 34
        d.polygon([(0, 24), (tw + 34, 24), (tw, 24 + th), (0, 24 + th)], fill=col(o.get("color", "#DC1E28")))
        tg = Image.new("RGBA", (r - l + 24, b - tt + 12), (0, 0, 0, 0))
        ImageDraw.Draw(tg).text((12 - l, 6 - tt), o["text"], font=f, fill=(255, 255, 255))
        tg = tg.transform(tg.size, Image.AFFINE, (1, 0.2, -0.1 * tg.height, 0, 1, 0), Image.BICUBIC)
        canvas.paste(tg, (22, 24 + (th - tg.height) // 2), tg)
    elif t == "ribbon":                  # diagonal corner ribbon ("ARRESTED", "JUST IN")
        f = _black(ImageFont.truetype(FONT_SMALL, 52))
        rb = Image.new("RGBA", (760, 92), (0, 0, 0, 0)); rd = ImageDraw.Draw(rb)
        rd.rectangle([0, 0, 760, 92], fill=col(o.get("color", "#DC1E28")) + (255,))
        l, tt, r, b = rd.textbbox((0, 0), o["text"], font=f)
        rd.text(((760 - (r - l)) / 2 - l, (92 - (b - tt)) / 2 - tt), o["text"], font=f, fill=(255, 255, 255))
        rb = rb.rotate(o.get("angle", 25), expand=True, resample=Image.BICUBIC)
        canvas.paste(rb, (-rb.width // 2 + 210, -rb.height // 2 + 95), rb)   # text centred around (210, 95)
    elif t == "hud":                     # dark telemetry panel with mono rows [[label, value, colour], ...]
        f1 = ImageFont.truetype(FONT_MONO, o.get("size", 40)); f2 = ImageFont.truetype(FONT_MONO, int(o.get("size", 40) * .55))
        rows = o["rows"]; x0, y0 = o.get("xy", (W - 470, 40)); w = o.get("w", 430)
        hgt = 26 + sum((int(o.get("size", 40) * 1.25) + (int(o.get("size", 40) * .6) if r[0] else 0)) for r in rows)
        ov = Image.new("RGBA", (W, H), (0, 0, 0, 0)); od = ImageDraw.Draw(ov)
        od.rounded_rectangle([x0, y0, x0 + w, y0 + hgt], radius=10, fill=(14, 18, 22, 215),
                             outline=col(o["border"]) + (255,) if o.get("border") else None, width=3)
        canvas.paste(ov, (0, 0), ov); d = ImageDraw.Draw(canvas)
        y = y0 + 16
        for label, value, c in rows:
            if label:
                d.text((x0 + 22, y), label, font=f2, fill=(160, 165, 170)); y += int(o.get("size", 40) * .6)
            d.text((x0 + 22, y), value, font=f1, fill=col(c)); y += int(o.get("size", 40) * 1.25)
    elif t == "circle":                  # red ring on the key detail + optional callout label
        x, y, r = o["xy"][0], o["xy"][1], o.get("r", 90)
        glow = Image.new("RGBA", (W, H), (0, 0, 0, 0)); gd = ImageDraw.Draw(glow)
        gd.ellipse([x - r, y - r, x + r, y + r], outline=(255, 40, 40, 255), width=18)
        canvas.paste(glow.filter(ImageFilter.GaussianBlur(10)), (0, 0), glow.filter(ImageFilter.GaussianBlur(10)))
        d = ImageDraw.Draw(canvas); d.ellipse([x - r, y - r, x + r, y + r], outline=(235, 30, 35), width=9)
        if o.get("label"):
            lx, ly = o.get("label_xy", (x + r + 80, y + r // 2))
            d.line([(x + int(r * .7), y + int(r * .7)), (lx, ly + 20)], fill=(235, 30, 35), width=4)
            f = ImageFont.truetype(FONT_MONO, 30)
            lines = o["label"].split("\n"); yy = ly
            for ln in lines:
                bx = _text_box(d, (lx, yy), ln, f, (240, 240, 240), (16, 16, 18), pad=(14, 6)); yy = bx[3]
            d.rectangle([lx, ly, lx + 5, yy], fill=(235, 30, 35))
    elif t == "path":                    # glowing flight path / route line
        pts = [tuple(p) for p in o["points"]]
        glow = Image.new("RGBA", (W, H), (0, 0, 0, 0)); ImageDraw.Draw(glow).line(pts, fill=col(o.get("color", "red")) + (255,), width=16, joint="curve")
        canvas.paste(glow.filter(ImageFilter.GaussianBlur(8)), (0, 0), glow.filter(ImageFilter.GaussianBlur(8)))
        ImageDraw.Draw(canvas).line(pts, fill=(255, 120, 120) if o.get("color", "red") == "red" else col(o["color"]), width=5, joint="curve")
        if o.get("arrow"):
            (x1, y1), (x2, y2) = pts[-2], pts[-1]; a = np.arctan2(y2 - y1, x2 - x1)
            pa = [(x2, y2), (x2 - 30 * np.cos(a - .45), y2 - 30 * np.sin(a - .45)), (x2 - 30 * np.cos(a + .45), y2 - 30 * np.sin(a + .45))]
            ImageDraw.Draw(canvas).polygon(pa, fill=col(o.get("color", "red")))
    elif t == "stamp":                   # rubber stamp: "solid" (white fill) or "outline" (ink only, grungy)
        f = ImageFont.truetype(FONT_BIG, o.get("size", 96))
        l, tt, r, b = d.textbbox((0, 0), o["text"], font=f)
        st = Image.new("RGBA", (r - l + 80, b - tt + 60), (0, 0, 0, 0)); sd = ImageDraw.Draw(st)
        red = col(o.get("color", "#E1141E"))
        if o.get("style", "solid") == "solid":
            sd.rectangle([4, 4, st.width - 5, st.height - 5], outline=red + (255,), width=9, fill=(255, 255, 255, 240))
        else:
            sd.rectangle([4, 4, st.width - 5, st.height - 5], outline=red + (255,), width=8)
            sd.rectangle([16, 16, st.width - 17, st.height - 17], outline=red + (255,), width=3)
        sd.text((40 - l, 30 - tt), o["text"], font=f, fill=red + (255,))
        if o.get("style") == "outline":   # ink texture
            rng = np.random.default_rng(3); a = np.asarray(st.getchannel("A"), np.float32)
            a *= (rng.random(a.shape) > .18) * 1.0; st.putalpha(Image.fromarray(a.astype(np.uint8)).filter(ImageFilter.GaussianBlur(.6)))
        st = st.rotate(o.get("angle", 8), expand=True, resample=Image.BICUBIC)
        x, y = o.get("xy", (W * .58, H * .3)); canvas.paste(st, (int(x), int(y)), st)
    elif t == "bignum":                  # huge yellow number + white pill label with red text
        f = ImageFont.truetype(FONT_BIG, o.get("size", 190)); x, y = o.get("xy", (50, 120))
        d.text((x, y), o["text"], font=f, fill=col(o.get("color", "yellow")), stroke_width=7, stroke_fill=(0, 0, 0))
        if o.get("sub"):
            b = d.textbbox((x, y), o["text"], font=f)
            fs = ImageFont.truetype(FONT_BIG, int(o.get("size", 190) * .38))
            _text_box(d, (x + 10, b[3] + 14), o["sub"], fs, col(o.get("sub_color", "red")), (255, 255, 255), pad=(26, 10), radius=14)
    elif t == "pill":                    # small rounded label anywhere
        f = ImageFont.truetype(FONT_BIG if o.get("font") != "mono" else FONT_MONO, o.get("size", 48))
        _text_box(d, tuple(o["xy"]), o["text"], f, col(o.get("fg", "#111111")), col(o.get("bg", "white")),
                  pad=(22, 10), radius=o.get("radius", 10), outline=col(o["outline"]) if o.get("outline") else None)
    elif t == "label":                   # mono callout box ("CLEARED", "DID NOT STOP") with coloured left bar
        f = ImageFont.truetype(FONT_MONO, o.get("size", 40))
        bx = _text_box(d, tuple(o["xy"]), o["text"], f, col(o.get("color", "green")), (14, 18, 22), pad=(20, 10))
        d.rectangle([bx[0], bx[1], bx[0] + 5, bx[3]], fill=col(o.get("color", "green")))
    elif t == "band":                    # dark band behind the bottom text
        ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        ImageDraw.Draw(ov).rectangle([0, int(H * o.get("from", .78)), W, H], fill=(12, 14, 20, o.get("alpha", 252)))
        canvas.paste(ov, (0, 0), ov)


def compose_generic(spec, br):
    canvas = render_full(spec, br) if spec["layout"] == "full" else render_split(spec, br)
    for o in spec.get("overlays", []):
        overlay(canvas, o)
    if spec.get("line1") or spec.get("line2"):
        c2 = col(spec.get("line2_color", "yellow"))
        area = spec.get("text_area", (40, H * .60, W - 80, H * .37))
        big_text(canvas, [spec.get("line1", ""), spec.get("line2", "")], area, [col(spec.get("line1_color", "white")), c2],
                 spec.get("align", "center"))
    return _finish(canvas, spec, br)


def render(spec):
    ensure_fonts()
    br = {"accent": "#FF4D1F", "sticker": "#E6FF3B", "ink": "#0B0B0F", "border": True, **spec.get("brand", {})}
    acc, stk = hexrgb(br["accent"]), hexrgb(br["sticker"])
    layout = spec.get("layout", "solo")
    if layout == "doc":
        return render_doc(spec, br)
    if layout == "evidence":
        return render_evidence(spec, br)
    if layout in ("full", "split"):
        return compose_generic(spec, br)
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
        for pp in spec.get("people", []):
            if pp.get("src") and not os.path.isabs(pp["src"]):
                pp["src"] = os.path.join(base, pp["src"])
        for holder in (spec, spec.get("left", {}), spec.get("right", {})):
            for k in ("plate", "doc"):
                if holder.get(k) and not os.path.isabs(holder[k]):
                    holder[k] = os.path.join(base, holder[k])
        if spec.get("brand", {}).get("logo") and not os.path.isabs(spec["brand"]["logo"]):
            spec["brand"]["logo"] = os.path.join(base, spec["brand"]["logo"])
        out = spec.get("out") or ("thumb.jpg" if i == 0 else f"thumb_{'ABCDEF'[i]}.jpg")
        spec["out"] = out if os.path.isabs(out) else os.path.join(base, out)
        print(render(spec))
