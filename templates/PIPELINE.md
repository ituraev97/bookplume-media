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

## Performance rules (weekly producer review, last update 2026-11-09 — the weekly producer task updates this section)
Data 2–8 Nov (Tashkent dates; previous week 26 Oct–1 Nov in brackets). Full tables: reviews/2026-11-09.md.
Instagram Reels: 35 reels, median 2,305 views / 53 saves (1,799 / 22), total 123k views (26k). Best: lumbar plexus 18.6k views, 681 saves.
TikTok: 28 videos, median 294 views (306), avg watch 5 s — flat whatever the length or topic; 99–100% For You, ~0% search.
YouTube Shorts (Metricool data only to 4 Nov): mnemonic Shorts median 206 (2–348); last week's surprising facts 820–1,257. Long videos 3–8 views.
Facebook Reels median 166 (132). Threads text median 28 views (17), history-of-medicine posts best (263, 113, 112). Pinterest ~1 impression per pin, but 40 Shopify sessions (26).

- SHORTS LENGTH 20–30 s (script 60–90 words). Cut intros; first spoken sentence = the challenge.
  (Evidence: 26–29 s TikToks kept 17% of the video vs 10% at 44–54 s; views did not change, so length alone does not fix TikTok.)
- FIRST SECOND: huge on-screen challenge text (≤ 7 words, e.g. "Name all 6 in 5 seconds?") + the plate/diagram already visible. No logo intro.
- Mnemonic reveal by second 4–6; quick test in the MIDDLE (~60% mark) with a 3-2-1, answer, then 1-line "save this" — end card ≤ 1.5 s.
- Keywords as on-screen text (TikTok/YouTube search reads it): the structure name + "mnemonic" visible in the first 3 s.
- LIST TOPICS WITH 5–9 ITEMS win saves: 5–9-item lists median 3,540 IG views / 89 saves (n=12) vs 2–4 items 2,724 / 66 (n=10). Saves track views almost 1:1 (r = 0.99).
- NEW 2026-11-09 — TOPIC TYPE: prefer BRANCHES / CONTENTS / MUSCLE-GROUP lists of the limbs, trunk and vessels (nerve plexus branches, artery branches,
  "what passes through X", muscle groups with one shared action): median 4.5k IG views (n=15; lumbar plexus 18.6k, hip rotators 7.9k, axillary 7.5k,
  intertubercular groove 6.6k, diaphragm openings 6.4k, brachial plexus 5.3k). Bone / organ / layer lists median 2.3k (n=7: ribs, ossicles, cranial bones, lung lobes, meninges).
- CHANGED 2026-11-09 — SURPRISING FACTS: the "17:00 and 01:00 = surprising fact" rule is withdrawn for 17:00. Pure facts on Instagram: median 1,804 views /
  11 saves (n=8: alveoli 1.3k/8, babies-300-bones 1.8k/7, hyoid 2.3k/26) vs lists 3,304 / 82 (n=22). The 17:00 slot (Instagram trial reel) with a list gave
  18.6k, 6.4k, 5.3k; with a fact 1.3k, 2.1k, 2.3k. Now: 17:00 = the strongest 5–9-item branches/contents list of the day. 01:00 may stay a surprising fact
  (it helped YouTube Shorts last week: 820–1,257 views vs mnemonics ≤ 470), but frame it as a list with a mnemonic ("3 bones fuse into 1 — name them").
- NEW 2026-11-09 — UTM CHECK: Shopify saw 0 sessions with our utm_campaign values this week (Pinterest/Instagram visits arrive untagged), so tracking is broken.
  Before every createScheduledPost assert in code that pinLink and every YouTube description link contains "utm_source=" AND "utm_campaign=" (format in products.md).
- TOPIC DUPLICATES: before choosing, read topics.md AND getScheduledPosts/analytics texts of the last 30 days; reject any topic whose structure already appeared.
  Short-caption reposts of old topics (aortic arch, vertebrae, epidermis, femoral triangle, cranial nerves) did not beat new lists (median 2,294 vs 3,304) — always make a new topic.
- Instagram CAROUSEL (22:00 run only): render 6 slides 1080x1350 (cover challenge → 4 cheat-sheet slides → "save + bookplume.com" slide) as stills from the same scenes;
  post as Instagram POST with 6 images at 13:00 Tashkent next day. (So far 3 carousels: 792–1,085 views, 4–17 saves — below reels; keep testing, judge at n ≥ 5.)

- NEW 2026-11-14 (owner decisions after the competitor review, approved "да"):
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

### Topic ideas next week (follow the winning pattern; none is in topics.md yet)
1. Anterior leg compartment, front of the ankle ("Tim Has A Very Nasty Dog": tibialis anterior, ext. hallucis longus, anterior tibial artery, ext. digitorum longus, deep fibular nerve, fibularis tertius) — partner of the tarsal tunnel short
2. Muscles supplied by the radial nerve (BEAST: brachioradialis, extensors, abductor pollicis longus, supinator, triceps)
3. Medial thigh / adductor group, 5 muscles + obturator nerve (pectineus, adductor longus, brevis, magnus, gracilis) — follow-up to the lumbar plexus hit
4. Circle of Willis: the 7–9 vessels of the ring
5. 9 layers of the anterior abdominal wall, skin to peritoneum (what a needle passes through)
6. Coronary arteries and their branches (RCA → marginal, PDA; LCA → LAD, circumflex)
7. Branches of the abdominal aorta (paired vs unpaired, top to bottom)
8. Contents of the carotid sheath (common/internal carotid, internal jugular vein, vagus nerve)
9. 8 endocrine glands, head to pelvis
10. 4 paranasal sinuses (frontal, ethmoid, sphenoid, maxillary) — which one drains where (anatomy only, no symptoms)

### Changelog
- 2026-11-06: first rules from the 26 Oct–5 Nov analytics review.
- 2026-11-14: owner-approved changes: long videos → 4/week QUIZ + WHAT HAPPENS formats, quiz hook for shorts, quiz carousels/pins, Threads 3 history posts, Shopify store check; voice "A" confirmed.
- 2026-11-09: producer review — withdrew "17:00 = surprising fact" (facts 1.8k vs lists 3.3k IG views), added branches/contents topic-type rule, added UTM assert; numbers updated.
