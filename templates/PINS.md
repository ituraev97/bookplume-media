# Daily static Pinterest pins — 3 a day (Book Plume)

Owner wants 3 static 1000×1500 pins per day on Pinterest, scheduled via Metricool.
Brand: Matcha #5C7A2F, Banana #F2D14E (fill only, never text on Paper), Forest #1F2A14, Paper #F7F6EC.
Rules (content brief): education only, no medical promises/diagnosis/treatment, every number from a real
source named on the pin, no agency logos, no gore, no third-party images (pins are drawn by code).

**RULES 2026-11-21 (owner, overrides the steps below where they differ):** 3 pins/day = 2 EDUCATIONAL (02:17, 06:17; one pin per topic, no topic with a static/video pin in the last 30 days) + 1 PRODUCT pin (21:17: in-stock anatomy/medical product, its own Shopify images large + one short hook in our voice, no people/fake reviews/prices, pinLink = product page + utm_campaign=<product-slug>&utm_content=product-pin, same product max once per 14 days, log it); titles = specific search queries, no repeated tail, assert len(title) <= 90; descriptions 1–3 natural sentences + source, no "Study with" line on educational pins. Note: this sandbox cannot download cdn.shopify.com images (egress 403) — allow that domain or the product pin can't be built.

**RULES 2026-11-22 (owner, confirmed again):** 2 educational (02:17, 06:17) + 1 PRODUCT pin (21:17); one pin per topic, nothing on a topic pinned/videoed in the last 30 days (check getScheduledPosts + pins_log.md); titles = specific search queries, no shared tail, no two pins in a week with the same ending, `assert len(title) <= 90`; descriptions 1–3 sentences + source, no "Study with" line on educational pins; product pins: no people, fake reviews/ratings, prices or discounts; same product max once per 14 days. PRODUCT IMAGES WORKAROUND: Shopify `theme_screenshot` (themeId = MAIN theme) of path `/cdn/shop/files/<file>?v=..&width=1200` (desktop) saves the image as a .webp in the session tool-results folder → crop the screenshot margins → `python3 templates/make_product_pin.py cover.png inside.png "<hook>" out.png`.

## Each run
1. `cd /home/claude && git clone --depth 1 --filter=blob:none --sparse https://github.com/ituraev97/bookplume-media && cd bookplume-media && git sparse-checkout set pins templates`
2. Read `pins/pins_log.md` — never repeat a topic listed there. Also avoid topics already on the account's
   Pinterest (Metricool getScheduledPosts for blogId 7717100, last 14 days).
3. Pick 3 NEW topics people actually search (anatomy/physiology facts, body myths, nursing/A&P study tips,
   mnemonics: cranial nerves, carpal bones, heart flow, etc.). Mix: at least 1 study tip/mnemonic per day.
   NEW 2026-11-14 (owner): 1 of the 3 daily pins is a QUIZ pin — headline is a challenge question people want to test themselves on
   ("Can You Name All 12 Cranial Nerves?", "Which Bone Breaks Most Often in the Wrist?"), body = the answer/mnemonic, tag "ANATOMY QUIZ".
   Verify each fact with WebSearch against a reputable source (journal, NIH/NCBI, Cleveland Clinic, Mayo,
   university). If a fact can't be verified, drop it.
4. Write `/tmp/pins.json` (fields: file, tag, headline, stat ≤9 chars, stat_note, body, source) and run
   `python3 templates/make_pins.py /tmp/pins.json pins/YYYY-MM-DD/`. Read every PNG and check: no cut-off or
   overlapping text, no orphan single words if avoidable. Fix and re-render.
5. Commit + push to main (end commit message with the Co-Authored-By line). Public URL:
   https://raw.githubusercontent.com/ituraev97/bookplume-media/main/pins/YYYY-MM-DD/<file>.png
6. Metricool createScheduledPost, one post per pin, providers [{"network":"pinterest"}], blogId 7717100,
   timezone Asia/Tashkent, times 21:17 (same day), 02:17 and 06:17 (next day) — = US midday/evening.
   pinterestData: boardId "1105563477217137717", pinTitle with search keywords (≤100 chars),
   pinLink = matching COLLECTION landing page from templates/products.md WITH UTM
   (?utm_source=pinterest&utm_medium=social&utm_campaign=<topic-slug>&utm_content=pin — assert in code that it contains
   "utm_source=" and "utm_campaign=" before posting), pinNewFormat true, isAiGenerated false, isAiGeneratedPerson false.
   text: hook question + the fact with source + "Study with: <product> → bookplume.com" + 4–5 hashtags.
   mediaAltText: one plain sentence describing the pin.
7. Append the 3 topics with date to `pins/pins_log.md`, commit + push.
8. Report: the 3 titles and times. If anything failed, say what.
