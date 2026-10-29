# Daily static Pinterest pins — 3 a day (Book Plume)

Owner wants 3 static 1000×1500 pins per day on Pinterest, scheduled via Metricool.
Brand: Matcha #5C7A2F, Banana #F2D14E (fill only, never text on Paper), Forest #1F2A14, Paper #F7F6EC.
Rules (content brief): education only, no medical promises/diagnosis/treatment, every number from a real
source named on the pin, no agency logos, no gore, no third-party images (pins are drawn by code).

## Each run
1. `cd /home/claude && git clone --depth 1 --filter=blob:none --sparse https://github.com/ituraev97/bookplume-media && cd bookplume-media && git sparse-checkout set pins templates`
2. Read `pins/pins_log.md` — never repeat a topic listed there. Also avoid topics already on the account's
   Pinterest (Metricool getScheduledPosts for blogId 7717100, last 14 days).
3. Pick 3 NEW topics people actually search (anatomy/physiology facts, body myths, nursing/A&P study tips,
   mnemonics: cranial nerves, carpal bones, heart flow, etc.). Mix: at least 1 study tip/mnemonic per day.
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
   pinLink = matching product URL from templates/products.md, pinNewFormat true, isAiGenerated false.
   text: hook question + the fact with source + "Study with: <product> → bookplume.com" + 4–5 hashtags.
   mediaAltText: one plain sentence describing the pin.
7. Append the 3 topics with date to `pins/pins_log.md`, commit + push.
8. Report: the 3 titles and times. If anything failed, say what.
