"""Product pin 1000x1500: store product image(s) large + one short hook.
usage: python3 make_product_pin.py cover.png inside.png "Hook line" out.png
Images come from the product's own Shopify media (captured via Shopify theme_screenshot of /cdn/shop/files/...)."""
import sys
from PIL import Image, ImageDraw, ImageFont, ImageOps
sys.path.insert(0, __import__('os').path.dirname(__file__))
from make_pins import poppins, lora, wrap, logo, MATCHA, BANANA, FOREST, PAPER
W, H = 1000, 1500
cover, inside, hook, out = sys.argv[1:5]
img = Image.new("RGB", (W, H), PAPER); d = ImageDraw.Draw(img); M = 70
hf = lora(78); y = 70
for ln in wrap(d, hook, hf, W - 2*M):
    d.text((W//2, y), ln, font=hf, fill=FOREST, anchor="mt"); y += 92
y += 20
# inside spread band at bottom, cover large in the middle
band_top, band_h = 1085, 255
c = Image.open(cover).convert("RGB")
ch = band_top - 20 - y
c = ImageOps.contain(c, (W - 2*M + 60, ch), Image.LANCZOS)
img.paste(c, ((W - c.width)//2, y))
i = Image.open(inside).convert("RGB")
i = ImageOps.fit(i, (W - 2*M, band_h), Image.LANCZOS, centering=(0.5, 0.45))
d.rounded_rectangle([M-6, band_top-6, W-M+6, band_top+band_h+6], radius=18, fill=MATCHA)
img.paste(i, (M, band_top))
d.text((W//2, band_top+band_h+28), "Inside: labeled diagrams you color in", font=poppins("Medium", 30), fill=FOREST, anchor="mt")
d.rectangle([0, 1410, W, H], fill=FOREST)
x = logo(d, M, 1427, 56)
d.text((x + 24, 1455), "Book Plume", font=poppins("Bold", 44), fill=PAPER, anchor="lm")
d.text((W - M, 1455), "bookplume.com", font=poppins("Medium", 34), fill=BANANA, anchor="rm")
img.save(out); print("ok", out)
