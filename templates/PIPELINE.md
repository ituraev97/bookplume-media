# Book Plume video pipeline (for scheduled runs)

Everything here runs in a fresh cloud container. Work in /home/claude/work.

## CONTENT BRIEF (owner's rules, full text in BRIEF_RU.md — read it; these rules beat anything else in this file)
- Audience: med students, nurses, nursing students, anyone learning anatomy. Content = ANATOMY STUDY: one fact / mnemonic / exam-style question
  per short (how to remember the carpal bones, 12 cranial nerves, pulmonary vs systemic circulation, heart valves, rotator cuff, brachial plexus…).
  Long = "Learn <topic> in 10 minutes" lessons, 8–12 min, using our study cards as the learning aid.
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
  YouTube Shorts / Reels 9:16 15–60 s; YouTube long 16:9 8–12 min, chapters, sources in description, not made for kids;
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

## 2. Voice (Kokoro, voice am_michael)
- Short: script.py with `S=[(sentence, pause), ...]` → `python3 tools/synth_short.py script.py vo.wav segs.json` (speed 1.15 + atempo 1.08).
- Long: script.py with `CH=[chapter titles]` and `S=[(chapter_idx, sentence, pause), ...]` → `python3 tools/synth_long.py script.py vo.wav segs.json` (speed 1.1; writes chapter start times).
- Word timing: `python3 tools/align_any.py vo.wav segs.json words.json extra_dict.txt` (extra_dict lines: `word PH ON EM ES` for unknown words).
- Then write src/words.ts (`export const WORDS = [...]`), turning number-words into digits for display.
- Normalize voice: `ffmpeg -i vo.wav -af "highpass=f=70,acompressor=threshold=-20dB:ratio=2.5:attack=5:release=80,loudnorm=I=-16:TP=-1.5" -ac 1 -ar 44100 voice_final.wav`

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
   - Short: providers tiktok, instagram (REEL, isAiGenerated true), facebook (REEL), youtube (type "short", madeForKids false, isAiGeneratedContent true, category EDUCATION, title ≤ 100 chars ending "#shorts"); tiktokData isAigc true, commercialContentOwnBrand true, title; videoCoverMilliseconds 300.
     Then a SECOND post for pinterest only: video pin (pinterestData boardId "bookplume", pinTitle with keywords, pinLink = matching product URL from products.md, pinNewFormat true, isAiGenerated true) — keep it separate so a Pinterest error can't block the others.
     Then a THIRD post for pinterest only: the 1000x1500 static pin.jpg (host it on the same media branch), same board, keyword title, product pinLink, publish 3+ hours after the video pin.
     Descriptions everywhere: hook + what they'll learn + "Study with: <product name> → bookplume.com" (no medical claims) + image credit line + hashtags.
   - Long: provider youtube only (type "video", privacy public, madeForKids false, isAiGeneratedContent true, category EDUCATION, tags list, title ≤ 100 chars), text = full SEO description with chapter timestamps (first one 0:00), videoThumbnailUrl = raw URL of thumb.jpg.
3. TikTok Shop (product link can ONLY be attached in the TikTok app, Metricool/API cannot):
   - If the video uses our product footage: render a second cut final_tiktokshop.mp4 (product clip in the first 3 s, then the lesson, ≤ 60 s). Do NOT post it via Metricool;
     SendUserFile it to the owner with the TikTok caption, hashtags and the exact product to attach, so they post it by hand with the product link. Post 1 then goes to instagram, facebook, youtube only.
   - If there is no product footage: post 1 includes tiktok as before (educational video, no product).
4. Read back with getScheduledPosts after publish time if possible; report links.
