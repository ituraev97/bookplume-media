# Book Plume video pipeline (for scheduled runs)

Everything here runs in a fresh cloud container. Work in /home/claude/work.

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
Research with WebSearch/WebFetch (Cleveland Clinic, NIH/PubMed, university news, NASA, Scientific American). No invented numbers.
Write numbers as words for the voice. Include the line "But that's not even the strangest part." before a twist fact.

## 2. Voice (Kokoro, voice am_michael)
- Short: script.py with `S=[(sentence, pause), ...]` → `python3 tools/synth_short.py script.py vo.wav segs.json` (speed 1.15 + atempo 1.08).
- Long: script.py with `CH=[chapter titles]` and `S=[(chapter_idx, sentence, pause), ...]` → `python3 tools/synth_long.py script.py vo.wav segs.json` (speed 1.1; writes chapter start times).
- Word timing: `python3 tools/align_any.py vo.wav segs.json words.json extra_dict.txt` (extra_dict lines: `word PH ON EM ES` for unknown words).
- Then write src/words.ts (`export const WORDS = [...]`), turning number-words into digits for display.
- Normalize voice: `ffmpeg -i vo.wav -af "highpass=f=70,acompressor=threshold=-20dB:ratio=2.5:attack=5:release=80,loudnorm=I=-16:TP=-1.5" -ac 1 -ar 44100 voice_final.wav`

## 3. Picture
- Short (1080x1920): template short/vid. Chrome.tsx = header + chapter bar + word-by-word subtitles (edit CHAPTERS, END, header subtitle, KEY words). Write a new Scenes file + Illus file for the topic (see Scenes11.tsx / Illus11.tsx as the example), import it in Composition.tsx. Safe zone: content x 70–930, y 470–1410.
- Long (1920x1080): template long/vid. Edit src/meta.ts (SERIES, TOPIC, KEYWORDS) and src/timeline.ts (CHAPTERS from segs.json chapters, END = duration + 0.8). Chrome16.tsx gives Header16, Subs16, ChapterCard (auto at each chapter start), Stage (scene wrapper) and Facts (right-column fact cards). Write new Scenes/Illus files per topic (ScenesCold.tsx / IllusCold.tsx are the example), wire them in Composition.tsx. Thumb composition (1280x720) → `node thumb.mjs ../thumb.jpg`.
- Always render ~15–30 stills first (`node stills.mjs t1 t2 ...` → ../stills/), LOOK at them, fix overlaps / cut-off text, then render:
  `npx remotion render src/index.ts Main ../video_silent.mp4 --codec h264 --crf 20 --concurrency 2`

## 4. Sound
Copy audio_example.py, set END, the SFX list (whoosh at scene/chapter changes, pop at each card, boom + riser at the twist) and music sections (silence the music ~0.8 s before the twist). It writes mix_pre.wav. Then:
```
ffmpeg -i mix_pre.wav -af "loudnorm=I=-15:TP=-1.0:LRA=11,alimiter=limit=0.89" -ar 48000 mix_final.wav
ffmpeg -i video_silent.mp4 -i mix_final.wav -map 0:v -map 1:a -c:v libx264 -crf 20 -preset medium -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart final.mp4
```
Check: ebur128 ≈ -14 LUFS, `python3 tools/still_check.py final.mp4` (no runs of identical frames), size < 50 MB short; long videos must stay < 95 MB (GitHub file limit) — encode long videos with `-c:v libx264 -crf 25 -preset medium -tune animation` (a 6-min video ≈ 60 MB).

## 5. Publish (Metricool, brand blogId 7717100, timezone Asia/Tashkent)
1. Host the files on a temporary orphan branch (keeps the repo small):
   ```
   cd /home/claude/bookplume-media && B=media-YYYYMMDD-slug
   git checkout --orphan $B && git rm -rf --cached . -q && mkdir -p v && cp /path/final.mp4 v/video.mp4 && cp /path/thumb.jpg v/thumb.jpg   # thumb only for long
   git add v && git commit -m "media $B" && git push origin $B && git checkout -f main
   ```
   Public URLs: https://raw.githubusercontent.com/ituraev97/bookplume-media/$B/v/video.mp4 (and v/thumb.jpg).
   Metricool copies media to its own storage when the post is created (the response shows static.metricool.com URLs). After ALL posts using it are created, delete the branch: `git push origin --delete $B`.
2. Metricool createScheduledPost with media = [that URL]. Date must be in the future.
   - Short: providers tiktok, instagram (REEL, isAiGenerated true), facebook (REEL), youtube (type "short", madeForKids false, isAiGeneratedContent true, category EDUCATION, title ≤ 100 chars ending "#shorts"); tiktokData isAigc true, commercialContentOwnBrand true, title; videoCoverMilliseconds 300.
     Then a SECOND post for pinterest only (pinterestData boardId "bookplume", pinTitle, pinLink https://bookplume.com or a matching product URL, pinNewFormat true, isAiGenerated true) — keep it separate so a Pinterest error can't block the others.
   - Long: provider youtube only (type "video", privacy public, madeForKids false, isAiGeneratedContent true, category EDUCATION, tags list, title ≤ 100 chars), text = full SEO description with chapter timestamps (first one 0:00), videoThumbnailUrl = raw URL of thumb.jpg.
3. Read back with getScheduledPosts after publish time if possible; report links.
