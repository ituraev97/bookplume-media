from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1000, 1500
MATCHA = "#5C7A2F"; BANANA = "#F2D14E"; FOREST = "#1F2A14"; PAPER = "#F7F6EC"
FD = "/usr/share/fonts/truetype/google-fonts/"
def poppins(w, s): return ImageFont.truetype(FD + f"Poppins-{w}.ttf", s)
def lora(s, wght=700):
    f = ImageFont.truetype(FD + "Lora-Variable.ttf", s)
    try: f.set_variation_by_axes([wght])
    except Exception: pass
    return f

def wrap(d, text, font, maxw):
    lines = []
    for para in text.split("\n"):
        cur = ""
        for w in para.split():
            t = (cur + " " + w).strip()
            if d.textlength(t, font=font) <= maxw: cur = t
            else: lines.append(cur); cur = w
        lines.append(cur)
    return lines

def logo(d, x, y, h=56):
    # "Pulled" mark: four book spines, one pulled out and tilted
    sw, gap = h * 0.2, h * 0.07
    for i in range(4):
        sx = x + i * (sw + gap)
        if i == 2:
            spine = Image.new("RGBA", (int(sw * 3), int(h * 1.6)), (0, 0, 0, 0))
            sd = ImageDraw.Draw(spine)
            sd.rounded_rectangle([sw, h * 0.3, sw * 2, h * 1.3], radius=3, fill=BANANA)
            spine = spine.rotate(-14, resample=Image.BICUBIC, center=(sw * 1.5, h * 1.3))
            d._image.paste(spine, (int(sx - sw), int(y - h * 0.42)), spine)
        else:
            d.rounded_rectangle([sx, y, sx + sw, y + h], radius=3, fill=PAPER)
    return x + 4 * (sw + gap)

def pin(fn, tag, headline, stat, stat_note, body, source):
    img = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(img)
    M = 80
    # tag pill
    tf = poppins("Bold", 30)
    tw = d.textlength(tag, font=tf)
    d.rounded_rectangle([M, 90, M + tw + 56, 150], radius=30, fill=MATCHA)
    d.text((M + 28, 120), tag, font=tf, fill=PAPER, anchor="lm")
    # headline
    hf = lora(84)
    y = 200
    for ln in wrap(d, headline, hf, W - 2 * M):
        d.text((M, y), ln, font=hf, fill=FOREST); y += 100
    # stat block
    y += 40
    sf = poppins("Bold", 150 if len(stat) <= 6 else 118)
    bh = 330
    d.rounded_rectangle([M, y, W - M, y + bh], radius=36, fill=BANANA)
    d.text((W / 2, y + 140), stat, font=sf, fill=FOREST, anchor="mm")
    nf = poppins("Medium", 34)
    ny = y + 235
    for ln in wrap(d, stat_note, nf, W - 2 * M - 80):
        d.text((W / 2, ny), ln, font=nf, fill=FOREST, anchor="mm"); ny += 44
    y += bh + 60
    # body
    bf = poppins("Regular", 38)
    for ln in wrap(d, body, bf, W - 2 * M):
        d.text((M, y), ln, font=bf, fill=FOREST); y += 56
    # source
    d.text((M, 1236), source, font=poppins("Regular", 24), fill=MATCHA)
    # footer
    d.rectangle([0, 1290, W, H], fill=FOREST)
    lx = logo(d, M, 1365, 62)
    d.text((lx + 24, 1396), "Book Plume", font=poppins("Bold", 50), fill=PAPER, anchor="lm")
    d.text((W - M, 1396), "bookplume.com", font=poppins("Medium", 32), fill=BANANA, anchor="rm")
    img.save(fn, quality=95)

PINS = [
  ("01-head-heat-myth.png", "BODY MYTH", "You don't lose most of your body heat through your head",
   "~10%", "the head's share of heat loss when your whole body is uncovered",
   "The myth likely came from an old military test where only the head was left uncovered. Any bare skin leaks heat.",
   "Source: Vreeman & Carroll, BMJ, 2008 · Educational content"),
  ("02-knuckle-cracking-myth.png", "BODY MYTH", "Cracking your knuckles probably won't give you arthritis",
   "60 years", "one doctor cracked only one hand, every day",
   "Decades later, neither hand had arthritis. His one-man experiment won an Ig Nobel Prize.",
   "Source: Unger, Arthritis & Rheumatism, 1998 · Educational content"),
  ("03-sleep-deprivation-fact.png", "BODY FACT", "24 hours without sleep hits your brain like alcohol",
   "0.10%", "the blood alcohol level that 24 hours awake performs like",
   "That's above the US legal driving limit. Around 48 hours, microsleeps can start.",
   "Source: Dawson & Reid, Nature, 1997 · Educational content"),
  ("04-pruney-fingers-fact.png", "BODY FACT", "Pruney fingers aren't waterlogged. It's your nerves.",
   "Nerves", "squeeze tiny blood vessels in your fingertips",
   "If a finger's nerves are damaged, it doesn't wrinkle in water. Wrinkly fingers may grip wet things better.",
   "Source: Wilder-Smith & Chow, 2003; Kareklas et al., 2013 · Educational content"),
  ("05-eight-glasses-myth.png", "BODY MYTH", "The \"8 glasses of water a day\" rule has no clear science behind it",
   "8 × 8", "a physiologist searched for the evidence and couldn't find it",
   "Food counts toward your fluids, and so do coffee and tea. Heat, exercise and some conditions change your needs.",
   "Source: Valtin, Am J Physiol, 2002 · Not medical advice"),
  ("06-fetal-hiccups-fact.png", "BODY FACT", "You started hiccupping before you were born",
   "9 weeks", "around when hiccups begin in the womb",
   "Scientists think newborn hiccups may help the brain learn to sense its breathing muscles.",
   "Source: UCL, Clinical Neurophysiology, 2019 · Educational content"),
]
os.makedirs("out", exist_ok=True)
for p in PINS: pin("out/" + p[0], *p[1:])
print("ok")
