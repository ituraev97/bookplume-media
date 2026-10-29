#!/usr/bin/env python3
"""Public-domain anatomy plates from Gray's "Anatomy of the Human Body" (1918, H. Gray, ill. H. V. Carter et al.)
Scan: Internet Archive item anatomyofhumanbo00grayrich (metadata: possible-copyright-status NOT_IN_COPYRIGHT).

  python3 gray1918.py search carpal hand          -> matching figures (fig number, leaf, caption)
  python3 gray1918.py page 220                     -> downloads the page holding FIG. 220 to cache/fig220_page.jpg (w2000), prints path
  python3 gray1918.py crop cache/fig220_page.jpg 0.08 0.10 0.92 0.70 out.png [--duotone|--alpha] [--fig 220] [--rights rights.json]
       crop box = fractions of width/height (x0 y0 x1 y1). LOOK at the page image first (Read tool) and choose the box so it
       holds only the drawing + its labels, NOT the page text or the "FIG. N" caption line.
       --duotone : ink -> Forest #1F2A14, paper -> Paper #F7F6EC (on-brand, best default)
       --alpha   : paper becomes transparent, ink Forest (for placing over brand backgrounds)
       --color   : keeps the plate's red/blue printing, paper -> Paper #F7F6EC (use for coloured plates)
       --rights  : appends the rights record for this file to rights.json (required for publishing)
The OCR caption index (gray1918_figs.json, ~760 of ~1250 figures) sits next to this script.
Labels on the plates are 1918 English/Latin terms: check them against the script before showing them.
"""
import json, os, re, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ITEM = "anatomyofhumanbo00grayrich"
UA = "BookPlumeBot/1.0 (https://bookplume.com)"
FIGS = json.load(open(os.path.join(HERE, "gray1918_figs.json")))
CACHE = "cache"

def search(words):
    ws = [w.lower() for w in words]
    for f in FIGS:
        c = f["caption"].lower()
        if all(w in c for w in ws):
            print(f'FIG. {f["fig"]:4d}  leaf {f["leaf"]:4d}  {f["caption"]}')

def page_for(fig):
    for f in FIGS:
        if f["fig"] == fig:
            return f
    # unknown in OCR index: nearest known figure numbers give the leaf range
    lo = max([f for f in FIGS if f["fig"] < fig], key=lambda f: f["fig"], default=None)
    hi = min([f for f in FIGS if f["fig"] > fig], key=lambda f: f["fig"], default=None)
    print(f"FIG. {fig} not in OCR index; it is between leaf {lo and lo['leaf']} and {hi and hi['leaf']} — use `leaf N`", file=sys.stderr)
    sys.exit(2)

def get_leaf(leaf, name):
    os.makedirs(CACHE, exist_ok=True)
    out = os.path.join(CACHE, name)
    if not os.path.exists(out):
        url = f"https://archive.org/download/{ITEM}/page/n{leaf}_w2000.jpg"
        subprocess.run(["curl", "-sSL", "--retry", "3", "-m", "120", "-A", UA, "-o", out, url], check=True)
    print(out)
    return out

def crop(src, x0, y0, x1, y1, out, mode, fig, rights):
    from PIL import Image, ImageOps, ImageFilter
    rgb = Image.open(src).convert("RGB")
    W, H = rgb.size
    rgb = rgb.crop((int(x0 * W), int(y0 * H), int(x1 * W), int(y1 * H)))
    if mode == "--color":  # keep the plate's own colours (red/blue printing), paper -> Paper #F7F6EC
        import numpy as np
        a = np.asarray(rgb).astype(np.float32)
        paper = np.percentile(a.reshape(-1, 3), 92, axis=0)  # dominant paper tone
        ink = np.percentile(a.reshape(-1, 3), 1, axis=0)
        a = np.clip((a - ink) / np.maximum(paper - ink, 1), 0, 1)
        # kill show-through from the reverse page: lightness above ~0.72 -> clean paper (smooth ramp)
        L = a.mean(axis=2, keepdims=True)
        k = np.clip((L - 0.55) / 0.22, 0, 1); k = k * k * (3 - 2 * k)
        a = a * (1 - k) + 1.0 * k
        tgt_hi, tgt_lo = np.array([0xF7, 0xF6, 0xEC]), np.array([0x1F, 0x2A, 0x14])
        a = tgt_lo + a * (tgt_hi - tgt_lo)
        Image.fromarray(a.astype(np.uint8)).save(out)
        print(out, rgb.size)
        mode_done = True
    else:
        mode_done = False
    im = rgb.convert("L")
    im = ImageOps.autocontrast(im, cutoff=(1, 2))
    im = im.point(lambda v: 255 if v > 196 else (v if v < 140 else int(140 + (v - 140) * 115 / 56)))  # remove show-through
    if mode_done:
        pass
    elif mode == "--alpha":
        ink = ImageOps.invert(im).point(lambda v: 0 if v < 28 else min(255, int((v - 28) * 1.25)))
        rgba = Image.new("RGBA", im.size, (0x1F, 0x2A, 0x14, 0))
        rgba.putalpha(ink)
        rgba.save(out)
    elif mode == "--duotone":
        ImageOps.colorize(im, black="#1F2A14", white="#F7F6EC").save(out)
    else:
        im.save(out)
    if not mode_done:
        print(out, im.size)
    if rights:
        rec = {}
        if os.path.exists(rights):
            rec = json.load(open(rights))
        leaf = re.search(r"leaf(\d+)|fig(\d+)", os.path.basename(src))
        cap = next((f["caption"] for f in FIGS if f["fig"] == fig), "") if fig else ""
        rec[os.path.basename(out)] = {
            "source_page": f"https://archive.org/details/{ITEM}" + (f"/page/n{next(f['leaf'] for f in FIGS if f['fig']==fig)}" if fig and any(f['fig']==fig for f in FIGS) else ""),
            "author": "Henry Gray; illustrations by Henry Vandyke Carter and others (Gray's Anatomy, 20th US edition, 1918, Lea & Febiger)",
            "license": "Public domain (published 1918; Internet Archive: possible-copyright-status NOT_IN_COPYRIGHT)",
            "content": (f"FIG. {fig}: {cap}" if fig else "plate from Gray's Anatomy 1918") + (f" (recoloured {mode[2:]})" if mode else ""),
        }
        json.dump(rec, open(rights, "w"), indent=2, ensure_ascii=False)

if __name__ == "__main__":
    a = sys.argv[1:]
    if not a:
        print(__doc__); sys.exit()
    if a[0] == "search":
        search(a[1:])
    elif a[0] == "page":
        f = page_for(int(a[1])); get_leaf(f["leaf"], f"fig{f['fig']}_page.jpg")
    elif a[0] == "leaf":
        get_leaf(int(a[1]), f"leaf{int(a[1])}_page.jpg")
    elif a[0] == "crop":
        src, x0, y0, x1, y1, out = a[1], *map(float, a[2:6]), a[6]
        mode = next((x for x in a[7:] if x in ("--duotone", "--alpha", "--color")), None)
        fig = int(a[a.index("--fig") + 1]) if "--fig" in a else None
        rights = a[a.index("--rights") + 1] if "--rights" in a else None
        crop(src, x0, y0, x1, y1, out, mode, fig, rights)
