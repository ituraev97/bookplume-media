# Book Plume video pipeline (for scheduled runs)

Everything here runs in a fresh cloud container. Work in /home/claude/work.

## CONTENT BRIEF (owner's rules, full text in BRIEF_RU.md — read it; these rules beat anything else in this file)
- Audience: med students, nurses, nursing students, anyone learning anatomy. Content = ANATOMY STUDY: one fact / mnemonic / exam-style question
  per short (how to remember the carpal bones, 12 cranial nerves, pulmonary vs systemic circulation, heart valves, rotator cuff, brachial plexus…).
  Long (owner decision 2026-11-14: 4 per week, two formats — see "LONG FORMATS" below): QUIZ videos ("Can You Name…? Anatomy Quiz", template quiz/)
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
Mnemonics: use well-known, clean ones (e.g. "Some Lovers Try Positions That They Can't Handle" is NOT ok — use "Sally Left The Party To Take Cathy Home"). Long: lesson structure (what you'll learn → parts → how they connect → memory tricks → 5-question quiz → recap).

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
Schedule: 4 long videos a week. Mon + Fri runs = QUIZ, Wed + Sun runs = WHAT HAPPENS. Publish 00:00 Tashkent next day (US afternoon).
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
TikTok gets its OWN cut and its OWN post (never shared with the Instagram/YouTube post):
1. LENGTH 15–18 s: a separate tiktok script of 35–45 words built from the same scenes: quiz hook (3-2-1) → answer → the ONE key idea
   (mnemonic or the surprise) → "Comment your score / the answer you guessed." No slow middle, no quick-test card. Render as tiktok.mp4 (same components,
   own voice line set via synth_short.py, own audio mix), check 15.0–18.0 s with ffprobe.
2. SHORT CAPTION: the hook question + 1 short line + 3–5 hashtags (#anatomy #anatomyquiz #nursingschool #medstudent + 1 topic tag), ≤ 150 characters
   before the hashtags. Do NOT paste the full breakdown (it spoils the answer and kills watch time).
3. PURE EDUCATION, NO PROMO LABEL: no store name, no "bookplume.com", no product mention in the TikTok video or caption, and therefore
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

## 4. Sound
Copy audio_example.py, set END, the SFX list (whoosh at scene/chapter changes, pop at each card, boom + riser at the twist) and music sections (silence the music ~0.8 s before the twist). It writes mix_pre.wav. Then:
```
ffmpeg -i mix_pre.wav -af "loudnorm=I=-15:TP=-1.0:LRA=11,alimiter=limit=0.89" -ar 48000 mix_final.wav
bash tools/encode_final.sh video_silent.mp4 mix_final.wav final.mp4
```
encode_final.sh = MAX QUALITY for shorts and long videos: x264 CRF 17 preset slower tune animation + AAC 256k; if the result is > 94 MB it automatically re-encodes two-pass at the exact bitrate that fits ~93 MB (GitHub raw file limit 100 MB; releases and LFS are blocked from the container). Never use CRF > 17 or preset faster than slower to save time. A 6-min long video takes ~25–35 min to encode — start it early, run it in the background.
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
   - Short: providers tiktok, instagram (REEL, isAiGenerated false), facebook (REEL), youtube (type "short", madeForKids false, isAiGeneratedContent false, category EDUCATION, title ≤ 100 chars ending "#shorts"); tiktokData isAigc false, commercialContentOwnBrand true, title; videoCoverMilliseconds 300.
     Then a SECOND post for pinterest only: video pin (pinterestData boardId "bookplume", pinTitle with keywords, pinLink = matching product URL from products.md, pinNewFormat true, isAiGenerated false) — keep it separate so a Pinterest error can't block the others.
     Then a THIRD post for pinterest only: the 1000x1500 static pin.jpg (host it on the same media branch), same board, keyword title, product pinLink, publish 3+ hours after the video pin.
     Descriptions everywhere: hook + what they'll learn + "Study with: <product name> → bookplume.com" (no medical claims) + image credit line + hashtags.
   - Long: provider youtube only (type "video", privacy public, madeForKids false, isAiGeneratedContent false, category EDUCATION, tags list, title ≤ 100 chars), text = full SEO description with chapter timestamps (first one 0:00), videoThumbnailUrl = raw URL of thumb.jpg.
3. TikTok Shop (product link can ONLY be attached in the TikTok app, Metricool/API cannot):
   - If the video uses our product footage: render a second cut final_tiktokshop.mp4 (product clip in the first 3 s, then the lesson, ≤ 60 s). Do NOT post it via Metricool;
     SendUserFile it to the owner with the TikTok caption, hashtags and the exact product to attach, so they post it by hand with the product link. Post 1 then goes to instagram, facebook, youtube only.
   - If there is no product footage: post 1 includes tiktok as before (educational video, no product).
4. Read back with getScheduledPosts after publish time if possible; report links.

## AI labels (owner decision 2026-10-31)
- ALL networks: AI label OFF. youtubeData.isAiGeneratedContent false, tiktokData.isAigc false, instagramData.isAiGenerated false, pinterestData.isAiGenerated false + isAiGeneratedPerson false.
  (Visuals are public-domain plates + our own animation. Owner was told the narration is synthetic TTS and platforms may auto-label; owner decided to post without labels.)

## Length limits (check in code before every createScheduledPost — longer text makes the post fail at publish time)
- Pinterest pinTitle ≤ 90 characters (hard limit 100). YouTube title ≤ 95 (hard 100). TikTok title ≤ 90. Pinterest description ≤ 480.
- Assert len() of every title in your script before posting; shorten by dropping the " | ..." tail first.

## Performance rules (weekly producer review, last update 2026-11-16 — the weekly producer task updates this section)
Data 9–15 Nov, Tashkent dates (previous week 2–8 Nov in brackets). Metricool post timestamps are UTC — add 5 h for the Tashkent slot. Full tables: reviews/2026-11-16.md.
Instagram Reels: 27 reels, total 93k views (159k, −41%; 34 reels), median 2,468 (2,628, −6%), saves 2,413 (4,195). Best: Circle of Willis 11.4k / 369 saves.
  Daily IG views fell from 25k/day (9–10 Nov) to 8.7k/day (11–15 Nov) across every format and slot — cause unknown (see review).
TikTok: 27 videos, median 304 views (300), total 8.1k (+2%); avg watch 4 s; 99–100% For You, ~0% search. Flat ~300 for 3 weeks whatever length, hook or topic.
YouTube Shorts (Metricool data only up to 11 Nov 05:00): median 100 (n=10; prev 316, n=27); abdominal regions 1,045. Subscribers +10 in 9–12 Nov (prev week +47).
Facebook Reels median 129 (167). Threads 34 posts, median 41 views (29), total +65%; best 371 / 293 / 244. Pinterest 75 pins, 16 impressions total (120); 0 impressions since 11 Nov.
Shopify (Book Plume, valid): social sessions 63 (81): Instagram 50 (41), Pinterest 8 (39), YouTube 4 (1), Facebook 1; 0 add-to-carts from social in both weeks.

- SHORTS LENGTH 20–30 s main cut (script 60–90 words); TikTok own cut 15–18 s (owner rule). First spoken sentence = the challenge. No intros.
  (Evidence this week: TikTok 15–17 s cuts n=5 median 324 views, watch 20% vs 26–30 s n=22 median 300, watch 16%: shorter = better retention, same reach.)
- FIRST SECOND: huge on-screen challenge text (≤ 7 words) + the plate/diagram already visible. No logo intro. Structure name + "mnemonic"/"quiz" as on-screen text in the first 3 s.
- Mnemonic/answer reveal by second 4–6; quick test at ~60% with 3-2-1; end card ≤ 1.5 s.
- TOPIC TYPE (holds, 3rd week): BRANCHES / CONTENTS / MUSCLE-GROUP lists with 4–9 items win. Lists median 3,338 IG views (n=40, two weeks) vs surprising facts 2,131 (n=7)
  vs one-question quiz-hook reels 1,808 (n=6, young). 01:00 may stay a fact only if framed as a list.
- NEW 2026-11-16 — ONE-PICTURE ANSWER: pick topics whose whole answer fits ONE diagram a student would screenshot (grid, ring, tunnel cross-section, hand/arm map),
  and hold the complete labelled diagram on screen ≥ 1.5 s right after the mnemonic. Evidence: the 4 best reels of the week were all one-picture sets —
  Circle of Willis ring 11.4k, carpal tunnel cross-section 9.9k, 9-region grid 9.2k, BEAST arm map 7.5k — with 112–305 shares each vs a weekly median of 11 shares;
  last week thenar/hypothenar hand map 26k. Sets spread along a long path (abdominal aorta by vertebral level 775, coronary arteries 1.5k, carotid sheath 1.5k) lost.
  For such topics, draw our own SVG map that shows ALL items at once instead of panning along the plate.
- QUIZ HOOK (owner rule 2026-11-14) — UNDER TEST: IG reels with the 1-question hook n=6, median 1,808 vs 2,279 for lists published the same days (11–15 Nov, n=13);
  all are 0–2 days old. Keep it, but the hook must also promise the list on frame 1 ("Name this + 4 more in 3 sec") so the viewer knows the payoff. Judge 23 Nov at n ≥ 14.
- NEW 2026-11-16 — RAPID-QUIZ TIKTOK CUT (test): the 05:00 run's TikTok cut = 3 rapid questions from the same region in 15–18 s (pin → "?" → 2-s countdown → answer
  word, ×3), last line "Comment your score /3". Same caption/no-promo rules. Other runs keep the 1-question cut. Evidence: vidIQ Shorts breakouts for "anatomy quiz"
  are 13–16 s multi-question tests — "Anatomy Test" 350k views on a 6.2k channel (8x), "Anatomy quiz - can you get all right?" 287k / 224k (9–11x); our 1-question
  TikTok cuts did not move views (324 vs 300). Judge at n ≥ 7: if rapid cuts beat 400 median views, extend to all runs.
- NEW 2026-11-16 — WHAT HAPPENS TITLES + TOPICS: use a time unit + an everyday or extreme moment: "What Happens to Your Body Every Second You Hold Your Breath",
  "What Happens in Your Body When You Stay Awake 24 Hours (Hour by Hour)". Thumbnail sticker = the time stamp ("0 → 24 H", "SEC 1→30"). Evidence: vidIQ long breakouts
  ≤ 200k subs: "What Happens to Your Body After Every Hour Without Sleep?" 99.9k on 3.5k subs; "Weird Things Your Body Does Every Day, Explained!" 47.9k on 221 subs (59x);
  "What If You Talk Non-Stop?" 50k (5.7x). Physiology only — no advice, no diagnosis, no "you could die" bait (BRIEF_RU).
- UTM CHECK (keep): assert "utm_source=" AND "utm_campaign=" in every pinLink and YouTube description link before createScheduledPost.
  (ShopifyQL here has no UTM columns, so the producer can only see referrer: Instagram 50, Pinterest 8, YouTube 4 sessions; the 24 orders / $1,000 of the week carry no referrer.)
- TOPIC DUPLICATES: read topics.md + last 30 days of posts; reject any structure already used. Reposts of old topics underperform — always a new topic.
- Instagram CAROUSEL = QUIZ CAROUSEL (owner rule). Old cheat-sheet carousels 9–13 Nov: 17.6k, 3.6k, 3.2k, 1.5k, 2.0k (median 2.6k); first quiz carousel (15 Nov) 1.1k after 1 day — judge at n ≥ 5.
- THREADS: keep 3 history-of-medicine posts/day; the 22:00 and 07:00 Tashkent slots had the best medians (73 and 47 views vs 13 at 04:00).
- SHOPIFY CHECK: only trust Shopify when get-shop-info / query shopDomain = 0g1dsy-3h.myshopify.com (Book Plume); never call switch-shop.

- OWNER DECISIONS 2026-11-14 (after the competitor review, approved "да"; kept verbatim — the producer may not change them):
  • QUIZ HOOK FOR TIKTOK/SHORTS: the first 4 seconds are a one-question quiz — plate with a red pin on ONE structure, huge text "Name this in 3 seconds",
    3-2-1, reveal — then the list/mnemonic. Reason: TikTok viewers leave after 3–8 s whatever the length; a question on frame 1 gives a reason to stay and rewatch.
  • When a long QUIZ on the same region exists (topics.md "long" lines), the Short's last line + end card say "Full quiz on our channel" (YouTube text also names it).
  • INSTAGRAM CAROUSEL = QUIZ CAROUSEL: slide 1 "Can you name all N?" with numbered pins on the plate, slides 2–5 one structure each with its pin and the answer
    hidden behind a sticker ("swipe for the answer"), slide 6 answers + mnemonic + "Save this · bookplume.com".
  • PINTEREST static pins: quiz style ("Can You Name These 8 Bones?" + numbered pins) with pinLink = the matching COLLECTION page with UTM.
  • THREADS: 3 history-of-medicine posts a day (best format: 244/139/122 views vs ~28 median), 1 myth-buster, 1 anatomy fact.
  • SHOPIFY CHECK: Shopify data is only valid when get-shop-info shows 0g1dsy-3h.myshopify.com (Book Plume). The connector is shared with another store
    (Scroll & Hearth, 4ta1h0-d3); if it shows any other domain, skip Shopify numbers and say so — never call switch-shop. (The 2026-11-09 "0 UTM sessions"
    finding may have come from the wrong store — re-check before trusting it.)

### Topic ideas next week (follow the one-picture list pattern; none is in topics.md yet)
Shorts:
1. Superficial calf: gastrocnemius (2 heads) + soleus + plantaris → one Achilles tendon (own SVG back-of-leg map)
2. Pelvic floor: levator ani = puborectalis, pubococcygeus, iliococcygeus + coccygeus (bowl diagram seen from above)
3. Trigeminal nerve: V1/V2/V3 + "Standing Room Only" exits (superior orbital fissure, rotundum, ovale) — face map with 3 zones
4. Branches of the external carotid artery, 8 ("Some Anatomists Like Freaking Out Poor Medical Students") — one tree diagram
5. Lateral cord of the brachial plexus: lateral pectoral, musculocutaneous, lateral root of median — completes the cord series (posterior, medial done)
6. Front of the arm: BBC = biceps, brachialis, coracobrachialis + musculocutaneous nerve (arm map)
7. Superficial veins of the arm: cephalic (thumb side), basilic (pinky side), median cubital (the blood-draw vein) — one arm map
8. Great saphenous vein path: front of the medial malleolus → medial knee → saphenous opening (one leg map)
9. Femoral artery branches: superficial epigastric, superficial circumflex iliac, external pudendals, profunda femoris (+ its perforators)
10. Intercostal space VAN: vein, artery, nerve under each rib, top → bottom (cross-section of one space)
Long QUIZ (Mon + Fri runs):
11. "Can You Name These 22 Skull Bones? (Anatomy Quiz)" — cranial + facial bones, sutures, foramen magnum
12. "Heart Anatomy Quiz: Chambers, Valves & Vessels — How Many Can You Get?" — 4 chambers, 4 valves, great vessels, coronary branches
Long WHAT HAPPENS (Wed + Sun runs):
13. "What Happens in Your Body When You Stand Up Too Fast (Second by Second)" — baroreceptors, venous pooling, heart rate, cerebral blood flow
14. "What Happens in Your Body When You Get Goosebumps (Second by Second)" — sympathetic nerves, arrector pili, hair follicles, adrenal medulla

### Changelog
- 2026-11-06: first rules from the 26 Oct–5 Nov analytics review.
- 2026-11-09: producer review — withdrew "17:00 = surprising fact" (facts 1.8k vs lists 3.3k IG views), added branches/contents topic-type rule, added UTM assert; numbers updated.
- 2026-11-14: owner-approved changes: long videos → 4/week QUIZ + WHAT HAPPENS formats, quiz hook for shorts, quiz carousels/pins, Threads 3 history posts, Shopify store check; voice "A" confirmed.
- 2026-11-16: producer review — added ONE-PICTURE ANSWER topic rule (top-4 reels 7.5–11.4k, 112–305 shares), RAPID-QUIZ TikTok cut test for the 05:00 run (vidIQ 13–16 s quiz breakouts), WHAT HAPPENS title/topic formula (vidIQ); quiz hook marked "under test" (1.8k vs 2.3k) with "+ N more" promise; numbers updated; the 14 Nov owner decisions block is kept verbatim.
