# FORMAT RESTORE 2026-11-24 (owner) — THIS SECTION BEATS EVERYTHING BELOW

Metricool (IG, 25 Oct–24 Nov): "Can you name all N …? + one mnemonic" reels got 9–29K views; since 14 Nov quiz hook / "Name this in 3 s" / 3D journey / sheet quiz got 0.6–3.5K. TikTok flat (300–500) for all formats. IG cheat-sheet carousels 3.7–22K, quiz carousels 0.8–1K.
- ALL short slots (17:00 / 22:00 / 01:00 Tashkent) = MNEMONIC "Can you name all N … / every …". No JOURNEY 3D, SHEET QUIZ, BEAT 3D, quiz hook, quiz carousel/story.
- Carousel (19:31 run) = cheat-sheet carousel, not quiz.
- Instagram only: final_ig.mp4 = final.mp4 + templates/outro/studyduo_outro.mp4 (5.7 s: "1 of 125 cards" → full set + $39.99 → tap on link in bio; tools/add_outro.sh). All other platforms get the clean final.mp4. Exception to "no store in video" applies ONLY to this IG outro.
- Cover style stays BEAST. Note: format and cover changed together on 14 Nov, so the drop is not cleanly attributable to format alone.

# Book Plume video pipeline (for scheduled runs)

Run notes go to RUNBOOK_NOTES.md (append there, never here). Promote a note into a rule section only if it must apply to every future run.

Everything here runs in a fresh cloud container. Work in /home/claude/work.

## Long-video cadence — owner decision 2026-11-23
ONE long YouTube video every 2 days (replaces "4 long videos a week"). Shorts/TikTok/Reels/Pins/Stories cadence is unchanged (only the Shorts hook/cadence rules below apply).
- FIRST step of any run that would make a long video (before research, voice or render): Metricool getScheduledPosts for this brand (blogId 7717100) covering the
  previous and the target US Eastern (ET, America/New_York) day — target = the day of the planned publish time (00:00 Tashkent = 14:00 ET the day before;
  Metricool times are UTC, ET = UTC−5 in winter). If either day already has a long YouTube video (youtube post with type "video", not "short") → skip the
  long video entirely and report one line: "Long video skipped: cadence (last long <date>)". Otherwise make it.
- Format: alternate — the opposite of the last published long video (QUIZ ↔ WHAT HAPPENS, see "LONG FORMATS"; last = latest "long" line in topics.md).

## Long jobs (renders, frame captures, encodes) — never poll
Start every job longer than ~1 min with nohup + a log + a pid file, then wait ONLY with tools/waitfor.sh (one call waits up to 9 min, prints the status + 3 log lines):
```
nohup sh -c 'bash tools/encode_final.sh video_silent.mp4 mix_final.wav final.mp4; echo EXIT $?' > enc.log 2>&1 &  echo $! > enc.pid
bash tools/waitfor.sh enc.log "EXIT [0-9]+|Error|error" 540 $(cat enc.pid)    # repeat while it prints WAITING; DONE/EXITED → check "EXIT 0" and the file
```
Same pattern for `npx remotion render …` (render.log/render.pid), r3d `cap.mjs` frame captures (frames.log/frames.pid) and quiz_build.py.
(tools/ = /home/claude/bookplume-media/templates/tools.) Never cat/tail/sleep-loop a big log; never re-run a job that is still running.

## Lessons from past runs (distilled 2026-11-23)
- Metricool post timestamps are UTC: add 5 h for the Tashkent slot (subtract 5 h for ET).
- Metricool YouTube data lags 2–4 days: don't judge a video (or a hook) before it has data; judge long thumbnails in YouTube Studio Test & Compare.
- Assert every title/pinTitle length in code before createScheduledPost (a ~100-char Pinterest title was rejected with HTTP 400).
- Before trusting any Shopify number, confirm the store is 0g1dsy-3h.myshopify.com; never call switch-shop.
- The cloud sandbox cannot download cdn.shopify.com images (egress 403): use the theme_screenshot workaround in PINS.md.
- Weekly analytics numbers go to reviews/YYYY-MM-DD.md, not into this file; only rules (with a one-line reason) live here.

## CONTENT BRIEF (owner's rules, full text in BRIEF_RU.md — read it; these rules beat anything else in this file)
- Audience: med students, nurses, nursing students, anyone learning anatomy. Content = ANATOMY STUDY: one fact / mnemonic / exam-style question
  per short (how to remember the carpal bones, 12 cranial nerves, pulmonary vs systemic circulation, heart valves, rotator cuff, brachial plexus…).
  Long (one every 2 days — see "Long-video cadence"; two formats — see "LONG FORMATS" below): QUIZ videos ("Can You Name…? Anatomy Quiz", template quiz/)
  and "What Happens in Your Body When…" process stories (template long/). The old dry "Learn <topic> in 10 minutes" lesson format is retired (4–9 views each).
- Images: ONLY public domain / open licence. Default source = Gray's Anatomy 1918 via tools/gray1918.py (reachable + verified PD).
  Other allowed sources (each file's rights field must be read): Wikimedia Commons (PD or CC; often 429 — wait 60 s+ between requests, UA "BookPlumeBot/1.0 (https://bookplume.com)"),
  Internet Archive (PD scans), DVIDS (only "Public Domain"; mp4 links on d34w7g4gy10iej.cloudfront.net) — CDC PHIL, NASA, NIH/NLM/NCI/NIGMS and Flickr are NOT reachable from the container.
  Our own SVG illustrations are always fine. FORBIDDEN: YouTube/TikTok clips, news footage, unlicensed stock, modern atlases/textbooks (Netter, Sobotta, Kenhub…).
- rights.json for EVERY video: {file: {source_page, author, license (verbatim), content}} — gray1918.py crop --rights rights.json writes it.
  Check it before publishing; put the credit line in every description, e.g. "Images: Gray's Anatomy (1918), public domain; illustrations: Book Plume."
- 1918 plates use OLD names (Navicular→Scaphoid, Greater multangular→Trapezium, Lesser multangular→Trapezoid, Triangular→Triquetrum, os magnum→Capitate,
  "internal/external" → medial/lateral, etc.). Put MODERN labels on top (Plate labels) and, when an outdated 1918 name is readable on screen, add a small note card
  "1918 atlas name: greater multangular" (students meet old names too). Do NOT paper-cover or inpaint labels that sit inside the drawing — it leaves white blobs
  (tested: both look bad); covers are only for page text at the crop edges. Find label positions with a fraction grid drawn over the crop, check every label on stills at full size.
- No agency logos/seals (NIH, CDC, NASA, military); never put government footage people next to the product as an "endorsement".
- No blood, open wounds, surgery close-ups, identifiable patients. No medical promises (treat, cure, diagnose, "replaces a doctor"). Study + exam prep only. Every fact checked against a textbook/open source.
- Testimonials/results only real with permission; paid partnerships marked #ad.
- PRODUCT = only our own footage from footage/ (see footage/README.md, clips.json). If footage/clips.json is empty: NO product shots at all
  (no publisher images, no mockups); end card mentions "Book Plume study cards" + link in the description/pin only.
- Music: own synthesized only (audio_example.py), low under the voice. No other platforms' watermarks.
- Platforms: TikTok Shop video 9:16 15–60 s, product in frame in the first 3 s, product link attached (only possible in the TikTok app → see 5.3);
  YouTube Shorts / Reels 9:16 15–60 s; YouTube long 16:9 (quiz 8–11 min, what-happens 6–10 min), chapters, sources in description, not made for kids;
  Pinterest: video pin + a 1000x1500 static pin (Pin composition), keyword title ("anatomy flashcards", "nursing school study tips"), pinLink = matching product from products.md.

## SHORT VIDEO FORMATS — OWNER DECISION 2026-11-18 (replaces the old short format on every platform)
All short videos (Instagram Reels + trial reels, Facebook Reels, YouTube Shorts, TikTok, Pinterest video pins, video Stories) are now made ONLY in these
three formats, one of each per day (the short-video task runs 3 times a day). Static pins and Threads are unchanged.
1. JOURNEY 3D — templates/r3d (journey3d.js), reference templates/r3d/examples/digestion ("Where does your food actually go?").
2. SHEET QUIZ — templates/sheetquiz, reference templates/sheetquiz/example (skull side view, "Can you get 5/5?") — owner: "квиз на листке супер получился".
3. BEAT 3D — templates/r3d (beat3d.js), reference templates/r3d/examples/skeleton ("Every major bone in 20 seconds").
Rules: the channel is about anatomy — NO store / flashcards / bookplume.com in the videos and no "Study with" line in captions; fixed text zones
(templates/r3d/ui.js) so no text ever overlaps; 3D sound = effects + soft pad only (no jokey music). The old "Name this in 3 seconds" short,
its 15–18 s TikTok cut and the rapid-quiz cut are retired; the same final file goes to every platform.

## Shorts: cadence + hook rules — owner decision 2026-11-23
Full text: yt-pilot HOOK_RULES (30 days of Metricool data, 10 channels). Why: our YouTube Shorts median fell 329 → 335 → 65 → 42 per week while we posted
3–4 look-alike Shorts a day — YouTube throttles mass-produced template clones. Applies to YOUTUBE SHORTS ONLY. Nothing is paused: keep making all 3
short videos a day in the 3 formats above; TikTok, Instagram (Reel + trial), Facebook, Pinterest, Stories keep getting every one of them exactly as now.
- CADENCE: max 2 YouTube Shorts per Tashkent day (1 is fine). Each run scores its finished Short (scorecard below) and adds the `youtube` provider to the
  main post ONLY if ALL hold: score ≥ 7/10; getScheduledPosts (blogId 7717100) shows < 2 posts with a youtube short on that Tashkent day; ≥ 6 h from the
  other YouTube Short of that day; a different format (JOURNEY / SHEET QUIZ / BEAT) from the other YouTube Short that day, and preferably not the format of
  yesterday's last YouTube Short. Otherwise create the main post without `youtube` (all other providers unchanged). Append "YT score N/10, youtube yes/no"
  to the topics.md line and say it in the run report.
- QUIZZES (SHEET QUIZ) stay in production and on all other networks, but on our channel "Name This X in 3 Seconds?" / "Anatomy Quiz: 5/5" Shorts got 6–112
  views (Nov 14–19) — a quiz takes a YouTube slot only if it scores ≥ 7, i.e. its first second and YouTube title carry a number or a "Why…?" paradox, not
  just "Can you name…?".
- SCORECARD (publish on YouTube only if ≥ 7/10): Hook 0–4 (the first second has a hard number, a famous name, or a "Why…?" paradox — on screen AND spoken;
  0 = generic "here is the anatomy of…"); Payoff 0–3 (the hook's promise is paid in the last 2–3 s: the reveal, the number, the twist); Freshness 0–2 (new
  topic/angle, not yesterday's format); Clarity 0–1 (understandable with sound off).
- WHAT WINS HERE: "Why do…?" body/science facts — "Why Do We Hiccup? The Weird Reason Starts in the Womb" 1262, "Why Do Fingers Prune in Water? It's Your
  Nerves, Not Water" 1147, goosebumps 825 — and one-number/one-fact Shorts ("The Only Bone That Touches No Other Bone: the Hyoid" 1028, "9 Abdominal Regions in
  1 Trick" 1083). YouTube title formulas: "Why Do We <everyday body thing>? <unexpected cause>"; "[number] + [stakes]" ("The Only Bone That…", "206 Bones…");
  ≤ 60 characters + #shorts (youtubeData.title may differ from the TikTok/IG text). Banned on YouTube: "Name this X in 3 seconds", "Can you get 5/5?" alone,
  "Did you know…", "Here's what happened…".
- HOOK: second 0 = the most surprising sentence, no logo/title card; on-screen hook ≤ 7 words, large, upper third (r3d/ui.js top zone). Length 20–40 s
  (hard cap 50 s); end on the payoff and cut — end card ≤ 1 s; a loopable last line is a plus.
- On a long-video publish day, one of the (max 2) YouTube Shorts should end with "Full video on the channel." pointing to that long video.
- Dead-hook check: a YouTube Short whose average view duration is < 5 s after 48 h (Metricool) = that hook style is dead, don't repeat it.
- WEEKLY (Monday run / weekly producer review): read the last 7 days of YouTube Shorts (views + avg view duration), list top 3 / bottom 3 and add one line
  "what won" here — repeat the winners' hook pattern, drop the losers'.

## 0. Setup (every run)
```
git clone https://github.com/ituraev97/bookplume-media /home/claude/bookplume-media   # after add_repo(owner=ituraev97, repo=bookplume-media, access=push)
pip install --break-system-packages kokoro-onnx soundfile pocketsphinx pyloudnorm scipy numpy
mkdir -p /home/claude/work/m && cd /home/claude/work
curl -sSL -o m/kokoro-v1.0.onnx https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
curl -sSL -o m/voices-v1.0.bin  https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
cp -r /home/claude/bookplume-media/templates/<short|long>/vid ./vid && cd vid && npm install   # registry.npmjs.org works
```
Remotion can't download Chrome: remotion.config.ts and stills.mjs/thumb.mjs already point at
/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell (check it exists: ls /opt/pw-browsers).
Render with `--concurrency 2` (2 CPU cores).

## 1. Facts and script
Research with WebSearch/WebFetch (OpenStax Anatomy & Physiology 2e, NCBI StatPearls/Bookshelf, TeachMeAnatomy, Cleveland Clinic, MedlinePlus). No invented numbers; every anatomical fact checked against a textbook/open source and listed in sources.
Write numbers as words for the voice. Short: hook question in the first second ("Can you name all 8 carpal bones?"), the mnemonic/fact, a quick self-test ("Pause and name the one we skipped"), CTA "Save this for your next exam" + "Follow Book Plume for anatomy you'll actually remember."
Mnemonics: use well-known, clean ones (e.g. "Some Lovers Try Positions That They Can't Handle" is NOT ok — use "Sally Left The Party To Take Cathy Home"). Long: structure per "LONG FORMATS" (QUIZ or WHAT HAPPENS).

## 2. Voice (Kokoro, voice am_michael) — OWNER DECISION 2026-11-14: keep this exact sound ("A": speed 1.15 + atempo 1.08, one sentence per call).
The owner compared it with slower/paragraph versions and chose it. Never change voice, speed or method. tools/tts.py does the same "A" sound for quiz/long scripts
(STYLE "A" is its default) and also writes per-sentence timings — quiz_build.py uses it. Shorts keep synth_short.py, WHAT HAPPENS long videos keep synth_long.py (both unchanged).
Script wording (anti "AI slop"): talk like a tutor, short concrete sentences, contractions; never "Let's dive in", "In today's video", "Buckle up", "Here's the thing",
"fascinating", "mind-blowing", "game-changer", "journey", "delve", "unlock the secrets"; no three-adjective lists; no fake suspense lines.
- Short: script.py with `S=[(sentence, pause), ...]` → `python3 tools/synth_short.py script.py vo.wav segs.json` (speed 1.15 + atempo 1.08).
- Long: script.py with `CH=[chapter titles]` and `S=[(chapter_idx, sentence, pause), ...]` → `python3 tools/synth_long.py script.py vo.wav segs.json` (speed 1.1; writes chapter start times).
- Word timing: `python3 tools/align_any.py vo.wav segs.json words.json extra_dict.txt` (extra_dict lines: `word PH ON EM ES` for unknown words).
- Then write src/words.ts (`export const WORDS = [...]`), turning number-words into digits for display.
- Normalize voice: `ffmpeg -i vo.wav -af "highpass=f=70,acompressor=threshold=-20dB:ratio=2.5:attack=5:release=80,loudnorm=I=-16:TP=-1.5" -ac 1 -ar 44100 voice_final.wav`

## LONG FORMATS (owner decision 2026-11-14, from the YouTube competitor analysis: small anatomy channels break out with quizzes —
## "Can You Pass This Human Body Quiz?" 225k views on a 2.6k channel — and "What happens when…" process videos — "How Digestion Works" 1.3M;
## our "lesson" videos got 4–9 views)
Schedule: one long video every 2 days, alternating QUIZ / WHAT HAPPENS (section "Long-video cadence" — check it first). Publish 00:00 Tashkent next day (US afternoon).
QUIZ (template quiz/vid, data from one quiz.py — example quiz/example_quiz.py, a short 8-question test version):
- 20–28 questions, 3–4 levels that get harder (Warm-up → Medium → Hard → Expert), 8–11 min. One body region or system per video
  (hand & wrist bones, skull bones, heart, brachial plexus, muscles of the arm, cranial nerves, bones of the foot…), not repeated (topics.md).
- Every question = a plate + red pin on ONE structure + 4 options from the same region (plausible distractors) + 5-second countdown + reveal with a
  1–2 sentence explanation that teaches something (function, memory trick, why it matters on exams). Mix "Name this bone/muscle/nerve" with
  "Which nerve supplies the muscle we're pointing at?" style questions. Every fact verified (sources in the description).
- Printed 1918 labels: list EVERY printed name visible in the zoomed frame that could give away this answer or another option in `hide` (tight boxes around the
  name words only — big boxes hide the bones); `open` = the target's own label box(es). Old 1918 names → `old`.
- Build: `python3 tools/quiz_build.py quiz.py vid` (voice + alignment + quizdata.ts + words.ts + timeline.ts + chapters.txt), then stills: for EVERY question
  one still at tCount+1 (stickers must cover the names, pin on the right structure) and one at tReveal+1.5 (label next to the pin, correct option green);
  plus intro, each level card, CTA, outro. Fix and re-check. Thumbnail: `node thumb.mjs ../thumb.jpg` (QuizThumb: zoomed plate + red circle + "?" + 2–4 huge words + "0/N?").
- Sound: `python3 quiz/audio_quiz.py` (all times from quiz.json) → loudnorm → encode_final.sh.
- Title (≤ 70): honest challenge, e.g. "Can You Name All 27 Bones of the Hand? (Anatomy Quiz)", "Anatomy Quiz: Name These 25 Muscles", "Cranial Nerves Quiz — How Many Can You Get?".
  Description: what's covered, chapters (chapters.txt), "Study with: <collection with UTM>", sources, image credits. Pin a comment-style question in the description end: "Comment your score".
WHAT HAPPENS (template long/vid, ScenesCold/IllusCold = the reference — it is already this format):
- "What Happens in Your Body When You <everyday moment>": swallow, sneeze, hold your breath, cut your finger (healing, no gore), break a bone (healing, no wounds),
  run a mile, fall asleep, get goosebumps, eat something spicy, stand up too fast, crack your knuckles, hiccup… 6–10 min, told as a timeline (second by second /
  minute by minute / day by day), each step naming the real structures on plates + our own SVG diagrams. Physiology for study — no advice, no diagnosis.
- Title: "What Happens in Your Body When You <X>" or "What Happens When You <X>? (Second by Second)". Thumbnail: plate/diagram + "WHAT HAPPENS WHEN YOU <X>" + a time stamp.
Both formats: end with the flash-card CTA (voice + card), "comment your score/question", and the next video suggestion line.

## TIKTOK VERSION (owner 2026-11-14 17:02, "делай все" — TikTok was stuck at ~250–310 views, avg watch 3–6 s of 26–30 s, full-watch ≈ 0%)
(The separate 15–18 s TikTok cut was retired by the owner on 2026-11-18: the same final file goes to every platform.)
1. SHORT CAPTION: the hook question + 1 short line + 3–5 hashtags (#anatomy #anatomyquiz #nursingschool #medstudent + 1 topic tag), ≤ 150 characters
   before the hashtags. Do NOT paste the full breakdown (it spoils the answer and kills watch time).
2. PURE EDUCATION, NO PROMO LABEL: no store name, no "bookplume.com", no product mention in the TikTok video or caption, and therefore
   commercialContentOwnBrand false (and commercialContentThirdParty false) — the "Promotional content" label hurt reach. The store stays in the profile and
   the TikTok Shop showcase. If a TikTok video ever does show or name our product, the own-brand toggle MUST be on (TikTok rules) — so keep TikTok product-free.

## STORIES (owner 2026-11-14: "сторисы ставь везде", без ссылок)
Metricool auto-publishes Stories only on Instagram and Facebook (TikTok/YouTube/Pinterest/Threads have no Stories via Metricool). No links/stickers
(Instagram's API can't add link or interactive stickers — owner said: no links). One Metricool post with providers instagram + facebook,
instagramData {type "STORY", isAiGenerated false}, facebookData {type "STORY"}, and NO "text" field (a Story-only post must not carry text).
- Every short run: the finished short mp4 (≤ 60 s) as a Story, 30 min after the main post.
- ~14:31 run also: one QUIZ IMAGE story (templates/story/quiz_story.html + render_story.js, 1080x1920, theme "light" = owner choice 2026-11-14 (clean paper + forest header, NOT the sunburst): 2-line question, plate with red circle
  on one structure, "?" sticker over its printed name, upside-down answer at the bottom) at 20:00 Tashkent the same day. Copy the folder to a temp dir,
  put the plate png next to it, `node render_story.js '<cfg json>' story.jpg`, LOOK at it. Tested 2026-11-14 (Metricool accepted IG + FB story).

## THUMBNAILS & COVERS — "BEAST" STYLE (owner 2026-11-14: "превью максимально яркие" — maximum brightness, act like a view-farming specialist)
Applies to every YouTube long thumbnail, Shorts/Reels/TikTok cover and Pinterest pin. Reference: quiz/vid QuizThumb (render it to see).
- Background: saturated yellow→orange radial gradient with white sunburst rays (or hot red / electric blue for variety — never paper/cream, never dark green).
  The muted brand palette is for the video itself; thumbnails are allowed to scream.
- ONE focal object, huge: the plate crop punched up with CSS filter contrast(1.3–1.4) saturate(1.8–2), black 10 px frame + white rim, slight tilt (−3°),
  the target structure tinted yellow inside a glowing RED circle (16 px, white rims) + a fat red arrow with a black outline pointing at it.
- Text: 2–3 words max, 110–140 px, white fill, 14–16 px black outline (paint-order stroke), hard 8 px black drop shadow; the key word in a red box with a black border.
  Words must be a question or a challenge that matches the title ("NAME THIS BONE?", "WHAT HAPPENS?", "ONLY 3 SECONDS"). Never fake stats ("99% fail") — challenges are fine.
- A red rotated sticker with the score/number ("0/25?", "3 SEC", "STEP 1→6").
- Hide the answer on the thumbnail (sticker or "?"), so the click is the only way to find out.
- Check at 168x94 (YouTube phone list) and 270x480 (TikTok grid): the words and the red circle must still read. Make 2 variants (different words/colour) for Test & Compare.
- Shorts covers: same recipe vertically — the plate with red circle + arrow in the middle third, 2–3 outlined words on top, all inside y 280–1640.
- Pinterest pins: same loud recipe in 1000x1500 (question headline at the top, plate with pin, "Answer + flashcards → bookplume.com" at the bottom).

## 3. Picture
- Short (1080x1920): template short/vid. Chrome.tsx = header + chapter bar + word-by-word subtitles (edit CHAPTERS, END, header subtitle, KEY words). Write a new Scenes file (+ Illus/diagram file) for the topic, import it in Composition.tsx. REFERENCE EXAMPLE for the anatomy format = Scenes14.tsx + Wrist14.tsx (carpal bones: plate push-in hook, own SVG diagram lit word-by-word, mnemonic card, plate with modern label + '1918 atlas name' note, quick-test countdown, answer, save card, end card); its script = example_anatomy_script.py, sound = audio_anatomy_example.py, rights = example_rights.json. Match or beat its quality. Safe zone: content x 70–930, y 470–1410.
- Long (1920x1080): template long/vid. Edit src/meta.ts (SERIES, TOPIC, KEYWORDS) and src/timeline.ts (CHAPTERS from segs.json chapters, END = duration + 0.8). Chrome16.tsx gives Header16, Subs16, ChapterCard (auto at each chapter start), Stage (scene wrapper) and Facts (right-column fact cards). Write new Scenes/Illus files per topic (ScenesCold.tsx / IllusCold.tsx are the example), wire them in Composition.tsx. Thumb composition (1280x720) → `node thumb.mjs ../thumb.jpg`.
- Anatomy plates: `python3 tools/gray1918.py search <words>` → `page <FIG>` → LOOK at the page (Read tool on a downscaled copy) → `crop page.jpg x0 y0 x1 y1 public/plates/<name>.png --color|--duotone --fig N --rights ../rights.json`
  (box = drawing only, no page text, no "FIG." caption). Show them with <Plate> from src/Plates.tsx (slow zoom to the part being named, modern labels timed to the voice, covers for old labels). Mix plates with our own SVG diagrams; something new every 2–3 s.
- Product footage (only if footage/clips.json lists clips): copy the clip to public/footage/ and use <ProductClip>. See 5.3 for the TikTok Shop cut.
- Pinterest still (short template): set the Pin composition defaultProps (plate, keyword title, sub line) → `npx remotion still src/index.ts Pin ../pin.jpg --jpeg-quality 95`, look at it.
- Always render ~15–30 stills first (`node stills.mjs t1 t2 ...` → ../stills/), LOOK at them, fix overlaps / cut-off text, then render:
  `npx remotion render src/index.ts Main ../video_silent.mp4 --codec h264 --concurrency 2`
  (MAX QUALITY: remotion.config.ts already sets jpegQuality 100 + CRF 12 master — do NOT pass --crf or lower these. 30 fps, 1080p.)
  Long renders: run it with nohup + render.log/render.pid and wait with tools/waitfor.sh (section "Long jobs").

## 4. Sound
Copy audio_example.py, set END, the SFX list (whoosh at scene/chapter changes, pop at each card, boom + riser at the twist) and music sections (silence the music ~0.8 s before the twist). It writes mix_pre.wav. Then:
```
ffmpeg -i mix_pre.wav -af "loudnorm=I=-15:TP=-1.0:LRA=11,alimiter=limit=0.89" -ar 48000 mix_final.wav
bash tools/encode_final.sh video_silent.mp4 mix_final.wav final.mp4   # > ~1 min (every long video): nohup + waitfor, section "Long jobs"
```
encode_final.sh = MAX QUALITY for shorts and long videos: x264 CRF 17 preset slower tune animation + AAC 256k; if the result is > 94 MB it automatically re-encodes two-pass at the exact bitrate that fits ~93 MB (GitHub raw file limit 100 MB; releases and LFS are blocked from the container). Never use CRF > 17 or preset faster than slower to save time. A 6-min long video takes ~25–35 min to encode — start it early with nohup + enc.log/enc.pid and wait only with tools/waitfor.sh (section "Long jobs").
Check: ebur128 ≈ -14 LUFS, `python3 tools/still_check.py final.mp4` (no runs of identical frames), size ≤ 94 MB.

## 5. Publish (Metricool, brand blogId 7717100, timezone Asia/Tashkent)
1. Host the files on a temporary orphan branch (keeps the repo small):
   ```
   cd /home/claude/bookplume-media && B=media-YYYYMMDD-slug
   git checkout --orphan $B && git rm -rf --cached . -q && mkdir -p v && cp /path/final.mp4 v/video.mp4 && cp /path/thumb.jpg v/thumb.jpg   # thumb only for long
   git add v && git commit -m "media $B" && git push origin $B && git checkout -f main && rm -rf v
   ```
   Public URLs: https://raw.githubusercontent.com/ituraev97/bookplume-media/$B/v/video.mp4 (and v/thumb.jpg).
   Metricool copies media to its own storage when the post is created (the response shows static.metricool.com URLs). After ALL posts using it are created, delete the branch: `git push origin --delete $B`.
2. Metricool createScheduledPost with media = [that URL]. Date must be in the future.
   - Short: providers tiktok, instagram (REEL, isAiGenerated false), facebook (REEL), youtube ONLY if this Short won a YouTube slot (section "Shorts: cadence + hook rules — owner decision 2026-11-23") (type "short", madeForKids false, isAiGeneratedContent false, category EDUCATION, title ≤ 100 chars ending "#shorts"); tiktokData isAigc false, commercialContentOwnBrand false + commercialContentThirdParty false (see TIKTOK VERSION), title; videoCoverMilliseconds 300.
     Then a SECOND post for pinterest only: video pin (pinterestData boardId "bookplume", pinTitle with keywords, pinLink = matching product URL from products.md, pinNewFormat true, isAiGenerated false) — keep it separate so a Pinterest error can't block the others.
     Then a THIRD post for pinterest only: the 1000x1500 static pin.jpg (host it on the same media branch), same board, keyword title, product pinLink, publish 3+ hours after the video pin.
     Descriptions: hook + what they'll learn (no medical claims) + image/3D credit line + hashtags — no store / "Study with" line on short videos (owner 2026-11-18).
   - Long: provider youtube only (type "video", privacy public, madeForKids false, isAiGeneratedContent false, category EDUCATION, tags list, title ≤ 100 chars), text = full SEO description with chapter timestamps (first one 0:00), videoThumbnailUrl = raw URL of thumb.jpg.
3. TikTok Shop (product link can ONLY be attached in the TikTok app, Metricool/API cannot):
   - If the video uses our product footage: render a second cut final_tiktokshop.mp4 (product clip in the first 3 s, then the lesson, ≤ 60 s). Do NOT post it via Metricool;
     SendUserFile it to the owner with the TikTok caption, hashtags and the exact product to attach, so they post it by hand with the product link. Post 1 then goes to instagram, facebook, youtube only (youtube only if it won a YouTube slot).
   - If there is no product footage: post 1 includes tiktok as before (educational video, no product).
4. Read back with getScheduledPosts after publish time if possible; report links.

## AI labels (owner decision 2026-10-31)
- ALL networks: AI label OFF. youtubeData.isAiGeneratedContent false, tiktokData.isAigc false, instagramData.isAiGenerated false, pinterestData.isAiGenerated false + isAiGeneratedPerson false.
  (Visuals are public-domain plates + our own animation. Owner was told the narration is synthetic TTS and platforms may auto-label; owner decided to post without labels.)

## Length limits (check in code before every createScheduledPost — longer text makes the post fail at publish time)
- Pinterest pinTitle ≤ 90 characters (hard limit 100). YouTube title ≤ 95 (hard 100). TikTok title ≤ 90. Pinterest description ≤ 480.
- Assert len() of every title in your script before posting; shorten by dropping the " | ..." tail first.

## Performance rules (weekly producer review, last update 2026-11-23 — the weekly producer task updates this section: rules only, numbers go to reviews/)
Numbers behind these rules: reviews/YYYY-MM-DD.md (latest reviews/2026-11-23.md).

- SHORTS LENGTH: follow the format specs (BEAT 20–30 s, JOURNEY ≤ 45 s, SHEET QUIZ ≤ 45 s, MNEMONIC ≤ 35 s); YouTube Shorts 20–40 s (owner rule 2026-11-23).
  The old 15–18 s TikTok cut is retired (owner 2026-11-18: the same final file goes everywhere).
- FIRST SECOND: huge on-screen challenge (≤ 7 words) + the plate/model already visible, no logo intro; spoken line 1 = the challenge or a hard number.
- NEW 2026-11-23 — SAVE FRAME IN EVERY FORMAT: the last 1.5–2 s before the end card = ONE complete labelled picture of the whole answer + on-screen "SAVE THIS"
  (JOURNEY: the full path with every stop numbered and named; BEAT: all items labelled at once on the model; SHEET QUIZ: the plate with all 5 answers;
  MNEMONIC: the full map, as now). Evidence: after the switch to the 3D formats IG saves fell 2,541 → 459 (−82%) and shares 1,122 → 178; this week MNEMONIC/list
  reels had a median of 21 saves (wrist bones 51, hyoid 97) vs 6 for JOURNEY and BEAT, which end on a moving model with no "screenshot" frame.
  (Successor of the 2026-11-16 ONE-PICTURE ANSWER rule, which still holds: Circle of Willis 11.8k, carpal tunnel 10.7k, 9 regions 9.5k were all one-picture sets.)
- NEW 2026-11-23 — SHEET QUIZ = FAMOUS REGION + SCORE: SHEET QUIZ is the best new format (IG median 2,020 vs 1,382–1,495 for the 3D formats, avg watch 10.2 s,
  most comments; TikTok best of the week brain quiz 505, pelvis 337). Pick big, famous, high-search regions first (brain, heart, pelvis, skull, spine, femur,
  kidney, lung, scapula) before small structures; caption/TikTok text ends "Comment your score 👇"; cover = the plate with 5 numbered red pins + "0/5?" sticker.
  On YouTube the "5/5" title alone is banned (owner rule 2026-11-23: 6 views) — YouTube title = number + stakes, e.g. "5 Pelvis Parts Every Nursing Student
  Must Know (Quiz)", or a "Why…?" paradox; never a fake stat ("only 1 in 5 get this").
- NEW 2026-11-23 — THREADS HISTORY FORMULA: line 1 = "In <year>, <a person> <did something shocking/absurd>." + the twist + an argument question
  ("Who deserves the credit?", "Genius or reckless?"). Evidence: Threads 21.4k views (+769%); top 3 all this formula — Lister carbolic acid 2,073, Fauchard
  tooth worms 1,812, Lind scurvy trial 1,737; slot medians 04:00 840, 22:00 543, 07:00 fact 406, 18:00 myth 370, 01:00 328. Myths/facts stay (owner rule), but give
  them the same "year/person" opening when the fact has one.
- TOPIC TYPE (holds, 4th week): BRANCHES / CONTENTS / MUSCLE-GROUP lists with 4–9 items + one diagram still win the MNEMONIC slot (wrist bones 2,414 / 51 saves;
  hyoid 8 muscles 3,333 / 97 saves); JOURNEY topics: an everyday thing you swallow (water, poop, coffee, sugar, pill) — "Why is poop brown?" beat the rest (2,470, 27 shares).
- WHAT HAPPENS TITLES + TOPICS (holds): time unit + everyday/extreme moment ("Every Second You Hold Your Breath", "Stay Awake 24 Hours (Hour by Hour)"); thumbnail sticker =
  the time stamp. WHAT HAPPENS long keeps viewers longer than QUIZ long (80 s vs 55 s avg) but both are still at 5–14 views — judge thumbnails in YouTube Studio
  Test & Compare, not in Metricool. Physiology only — no advice, no diagnosis, no "you could die" bait (BRIEF_RU).
- YOUTUBE SEARCH ≈ 10% of channel views: long-video titles = the phrase a student types ("Heart Anatomy Quiz", "Skull Anatomy Quiz") at the start of the title.
- UTM CHECK (keep): assert "utm_source=" AND "utm_campaign=" in every pinLink and YouTube description link before createScheduledPost. ShopifyQL now has
  utm_source/utm_campaign: this week Pinterest utm 1 session → 1 order, ig 12 sessions → 0 carts.
- LENGTH CHECK (keep, it failed once this week): assert len(pinTitle) <= 90 in code — the 20 Nov 02:17 aortic-arch pin (~100 chars) was rejected with 400.
- TOPIC DUPLICATES: read topics.md + pins/pins_log.md + last 30 days of posts; reject any structure already used. Always a new topic.
- Instagram CAROUSEL = QUIZ CAROUSEL (owner rule). 7 quiz carousels: median 925 views, falling daily (1,877 → 675) — judged at n = 13: weaker than the old
  cheat-sheet carousels (median 3,165) → see owner recommendation in reviews/2026-11-23.md; until the owner decides, slide 1 must show the whole plate with numbered pins
  and "0/5?" (as the best carousel, 16 Nov 1,877).
- Retired 2026-11-23 (formats retired by the owner on 2026-11-18): the 1-question "Name this in 3 seconds" hook test and the RAPID-QUIZ TikTok cut test.

- OWNER DECISIONS 2026-11-14 (approved "да"; still in force — the producer may not change them; verbatim original in RUNBOOK_NOTES.md):
  • When a long QUIZ on the same region exists (topics.md "long" lines), the Short's last line + end card say "Full quiz on our channel" (YouTube text also names it).
  • INSTAGRAM CAROUSEL = QUIZ CAROUSEL: slide 1 "Can you name all N?" with numbered pins on the plate, slides 2–5 one structure each with its pin and the answer
    hidden behind a sticker ("swipe for the answer"), slide 6 answers + mnemonic + "Save this · bookplume.com".
  • PINTEREST static pins: quiz style ("Can You Name These 8 Bones?" + numbered pins) with pinLink = the matching COLLECTION page with UTM.
  • THREADS: 3 history-of-medicine posts a day (best format: 244/139/122 views vs ~28 median), 1 myth-buster, 1 anatomy fact.
  • SHOPIFY CHECK: Shopify data is only valid when get-shop-info shows 0g1dsy-3h.myshopify.com (Book Plume). The connector is shared with another store
    (Scroll & Hearth, 4ta1h0-d3); if it shows any other domain, skip Shopify numbers and say so — never call switch-shop.

### Topic ideas next week (none is in topics.md yet; each ends on a SAVE FRAME)
Shorts:
1. SHEET QUIZ — femur 5/5 (head, neck, greater trochanter, lesser trochanter, linea aspera)
2. SHEET QUIZ — kidney section 5/5 (cortex, renal pyramid, minor calyx, renal pelvis, ureter)
3. SHEET QUIZ — scapula 5/5 (acromion, coracoid process, glenoid cavity, spine, inferior angle)
4. JOURNEY — where does the air you breathe go (nose → pharynx → larynx → trachea → bronchi → alveoli → blood → heart)
5. JOURNEY — where does the protein you eat go (stomach pepsin + acid → pancreatic enzymes → small intestine amino acids → liver via portal vein → muscles; urea → kidneys)
6. JOURNEY — what happens to alcohol after you drink it (some absorbed in the stomach → small intestine → liver breaks it down → brain → a little leaves via lungs/kidneys; physiology only)
7. BEAT — your biggest internal organs ranked by weight (liver, brain, lungs, heart, kidneys, spleen, pancreas — numbers from a textbook)
8. BEAT — find your pulse in 7 places, head to foot (carotid, brachial, radial, femoral, popliteal, posterior tibial, dorsalis pedis)
9. MNEMONIC — lateral cord of the brachial plexus (lateral pectoral, lateral root of median, musculocutaneous) — completes the cord series
10. MNEMONIC — intercostal space VAN (vein, artery, nerve under each rib, top → bottom; one cross-section diagram)
Long QUIZ:
11. "Heart Anatomy Quiz: Can You Name All 25?" — chambers, valves, great vessels, coronary branches, conduction (SA/AV node)
12. "Brain Anatomy Quiz: Can You Name All 25?" — lobes, gyri/sulci, cerebellum, brainstem parts, corpus callosum, thalamus, ventricles
Long WHAT HAPPENS:
13. "What Happens to Your Body When You Stay Awake 24 Hours (Hour by Hour)" — circadian clock (SCN), adenosine, cortisol/melatonin, prefrontal cortex, microsleeps
14. "What Happens in Your Body When You Sneeze (Second by Second)" — trigeminal irritation, sneeze center in the medulla, deep breath, glottis closes, soft palate, ~sneeze airflow facts from a source

### Changelog
Append producer-review changelog lines to RUNBOOK_NOTES.md (history up to 2026-11-23 is there).

## Thumbnails v5 — illustrated cut-out from REAL images (owner decision 2026-11-23)
Owner: "bright and illustrated-looking, like the top drama channels — but faces must not be distorted". This section overrides the **thumb_A** part of the earlier thumbnail rules; thumb_B and thumb_C keep the current generator, so YouTube Studio → Test & Compare measures the new style against the old one. All earlier content rules stay in force: lawful image sources, every word true and sourced, fact-check of the thumbnail text, no gore, no victims' faces under crime words, bottom-right corner empty.

- Tool: `templates/tools/thumbkit/thumbkit.py` (header = full spec). Setup once per run: `pip install -q pillow numpy opencv-python-headless "rembg[cpu]"` (downloads a 176 MB cut-out model on first use; if that fails the tool still works with a soft oval mask — say so in the report).
- It cuts the subject out of a real photo or video frame, adds a white sticker outline, a coloured glow and a rim light, washes the background in colour and sets 2–3 huge Anton words + an optional yellow sticker. Only pixel filters — no AI redraw, faces stay exactly as photographed. NEVER feed it an AI-generated image of a real person.
- Spec (`<ep>/thumbkit.json`, a list → thumb.jpg, thumb_B.jpg… — for this channel set "out":"thumb_A.jpg"):
  `[{"out":"thumb_A.jpg","layout":"solo","people":[{"src":"photo_or_clip","t":12.4,"crop":[x,y,w,h],"tint":"warm","kind":"person"}],"line1":"$250M","line2":"VANISHED","sticker":"SMALL FACT","brand":{"accent":"<channel colour>","sticker":"#FFD400","border":false}}]`
  - `layout`: "solo" (subject right, words left) or "versus" (two REAL sides of the same dispute, words centre — never pair people who are not part of the same story).
  - `kind`: "person" or "object" (boat, drug bundle, document, product, building, aircraft…).
  - `crop`: generous box around head + shoulders (face ≈ 35–50 % of its height) in source pixels; the subject must be ≥ 360 px tall in the source (the tool warns otherwise — find a bigger image).
  - `tint`: warm | cold | toxic | gold. `brand.accent` = the channel's main colour from the current generator.
- After rendering, LOOK at thumb_A at 320 px wide: words readable, face not covered, outline clean (no chunks of background). If the cut-out is bad (busy background, hands lost), use the current generator for A and say so in the report.

## Thumbnails v6 — YouTube-AI style: AI picture + real text/documents (owner decision 2026-11-23)
Owner: "make them like the thumbnails YouTube Studio's AI draws — bright, illustrated, with brands". This section overrides the **thumb_A and thumb_B** parts of the earlier thumbnail rules; thumb_C keeps the current generator, so YouTube Studio → Test & Compare measures the new style. Earlier content rules stay: lawful image sources, every word true and sourced, fact-check of thumbnail text, no gore, no victims' faces under crime words, bottom-right corner empty.

1. Read `templates/tools/thumbkit/STYLE.md` — templates learned from YouTube's own AI thumbnails: doc (documentary split), evidence/fraud (object + real document + stamp), ntsb (full-bleed reconstruction + telemetry HUD + red circle), mugshot (real face + seized items, soft seam), versus, solo. Pick the template that fits this channel's examples.
2. AI pictures (free, FLUX.2 klein on the owner's office PC) via Drive "IMG RELAY" — request EARLY in the run (≈ 12 min per picture, longer while the PC voices — at most 3 pictures per run):
   `python3 templates/tools/img_client.py request <ID> plates.json --creds /tmp/drive_creds.json` then later `python3 templates/tools/img_client.py wait <ID> <ep>/plates --creds /tmp/drive_creds.json --timeout 2400`.
   plates.json = `[{"name":"plate_A.png","prompt":"cinematic photo of ..., dramatic side light, dark background, high detail","w":1280,"h":720,"seed":1}, ...]` (max 6). The AI paints ONLY pictures — NEVER ask it for text, documents, logos-as-evidence. Real people: send their REAL lawful photo as `"ref"` (edit mode: "same person, same expression, re-lit with red and blue police lights, sharp, cinematic") — never generate a real person from text.
   No answer in time → build A/B with real frames (thumbkit solo/versus) and say so in the report.
3. Compose with `templates/tools/thumbkit/thumbkit.py <ep>/thumbkit.json` (setup: `pip install -q pillow numpy opencv-python-headless "rembg[cpu]"`; header lists every layout and overlay: tag, ribbon, hud, circle, path, stamp, bignum, pill, label, band). Text, numbers, stamps and the REAL document crop are drawn by thumbkit — documents come only from the real source (PDF page → `doc`, `highlights` boxes in its pixels).
4. LOOK at every thumb at full size and at 320 px: AI picture has no garbage text/extra fingers/melted objects, faces unchanged, words readable. Bad picture → new seed/prompt (one retry), otherwise fall back to the real-frame layout.

- **EMOTION FIRST (owner 2026-11-24):** every thumbnail must show a strong emotion at first glance (rage, shock, fear, disbelief) — never a calm or smiling face. Pick the PEAK real frame/photo, let the AI dramatize light/smoke/contrast while keeping the exact face and expression; if no emotional real frame exists, put the emotion into the scene (fire, sirens, red stamp). Details: STYLE.md "EMOTION FIRST".

## Promise rule (owner decision 2026-11-24)
- The title/hook promise is delivered fast and fully: long videos show the promised thing within the first 60 s and spend >= 25% of the runtime on it; Shorts pay the hook in the last 3 s. Never a title that sells one moment the video barely shows.
- Against the "AI slop" impression: real material first (real photos, pages, footage), clear opinions, no filler or repeated recaps.
