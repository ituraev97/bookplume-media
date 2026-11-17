# Book Plume 3D shorts (owner decision 2026-11-18) — two formats on one engine
Engine: three.js r170 rendered frame by frame in headless Chromium (swiftshader), DOM overlay captured with the frame.
Files: page.html (loader), cap.mjs (frame capture), ui.js (FIXED LAYOUT + CSS — shared by both formats), beat3d.js, journey3d.js,
preview.js / zoom.js (model inspection), sfsearch.py / sfdl.py / glbnames.py (Sketchfab), beat_voice.py, mix.py (sound).
Approved/fixed references: examples/skeleton (BEAT 3D, "Every major bone in 20 seconds") and examples/digestion (JOURNEY 3D, "Where does your food actually go?").

## Owner rules (2026-11-18)
- The channel is about ANATOMY. No store, flashcards or bookplume.com anywhere in the video.
- Sound: keep the effects (pop on each label, whoosh between stages, ding on timer facts, confirm on the end card) but NO jokey music:
  only the soft pad (mix.json "music": [[0,END,"A",0,0,0]] — drums 0, arp 0) at music_db −21. If the pad sounds wrong for a topic, use no music at all.
- Text must never overlap: ui.js zones are fixed — TOP 0–430 (title ≤ 2 lines y 200–340, progress/steps row y 352–388, credit y 402),
  MODEL 430–1170 (camera framing keeps the focus box inside), BOTTOM 1170+ (label chip at y 1205, then sub-line/facts, max 3 stacked), end card y 700–1150.
  Keep titles ≤ 2 short lines, chip names ≤ ~18 characters (put long lists in the sub-line: "Hand bones" + "carpals · metacarpals · phalanges"),
  facts ≤ ~32 characters. Check EVERY stage on a contact sheet: nothing cut, nothing on top of another text, model not hidden behind text.

## Setup (once per run)
cp -r templates/r3d /home/claude/work/r3d && cd /home/claude/work/r3d && npm init -y >/dev/null && npm i three@0.170.0 playwright-core@1.49.0
cd /home/claude/work && nohup python3 -m http.server 8765 --bind 127.0.0.1 >/tmp/http.log 2>&1 &     # serves /r3d and /models
Models: the orphan branch bp-models of this repo holds tested models (<slug>/model.glb + CREDITS.json):
  git fetch --depth 1 origin bp-models && git worktree add /home/claude/work/models origin/bp-models   (or git archive)
  skel_polyone  — full skeleton, 20 separate meshes (see examples/skeleton/cfg.json for the mesh → bone map; 10 empty, 20 outline: hide)
  dig_lokesh    — digestive organs (Focus Medica): 4 colon+rectum, 5 pancreas, 6 stomach, 7 small intestine, 10 gallbladder+bile ducts,
                  11 duodenum, 14 liver, 1 spleen, 3/9 kidneys; hide 0,2,8,12,13,15,16,17,18 (18 = logo plane — always hide)
New models: python3 sfsearch.py "<query>" (SFT=<owner Sketchfab token> in the env, never written to files) → ONLY "CC Attribution" or "CC0"
(never NonCommercial/NoDerivs/ShareAlike/Free Standard) → python3 sfdl.py <uid> <slug> → glbnames.py → render preview.js / zoom.js sheets and LOOK
which mesh is which. Only label a mesh when you are sure (mesh names + visual check against a Gray's 1918 plate). Add good models to bp-models.
Credit line in the video (cfg.credit) and in every caption: "3D: <title> by <author> (Sketchfab, CC BY 4.0)".

## BEAT 3D — structures light up and get named on the beat (20–30 s)
script.py: one short line per item + one end line (no spoken hook — the title is the hook); 10–14 items from ONE model/region.
items.json: [{name, plain, meshes:[...], focus?:[...]}] → python3 r3d/beat_voice.py script.py items.json 120 <ep> → timeline.json + vo.wav
cfg.json = examples/skeleton/cfg.json with title (["EVERY MAJOR BONE","IN <b>20 SECONDS</b>"] style, must be true), credit, hide, bpm, items (from timeline),
tEndLine, end, endA/endB ("Save this." / "Then name them<br>without looking 👀"), minDist (≈0.8 × the model's smallest focus size).
args.json = {"model":"/models/<slug>/model.glb","cfg":<cfg>} saved under /home/claude/work/<ep>/ →
stills: SHOT=1 node r3d/cap.mjs /r3d/beat3d.js /tmp/st 30 0 0 1080 1920 @/<ep>/args.json <t1,t2,...>   (one still per item + end)
frames: SHOT=1 node r3d/cap.mjs /r3d/beat3d.js <ep>/frames 30 0 <END> 1080 1920 @/<ep>/args.json   (~0.5–1 s/frame, run in background)

## JOURNEY 3D — a glowing bolus travels through organs, one stage at a time (30–45 s)
"Where does your food go / What happens to a pill / Path of blood through the heart / Where does the air go / How urine is made…"
script.py with one or more lines per stage (synth_short.py, pauses 0.2–0.4) → segs.json → args3d.json like examples/digestion:
stages (label for the steps row ≤ 11 chars, light/focus meshes, ghost/semi opacities, lightAt for helper organs, move: path through named waypoints),
wp = waypoints computed from mesh vertices (sel filters: ["x"|"y"|"z","min"|"max"|"abs",width]), meander for coiled organs, particles for secretions,
chips: kind "n" = organ name chip, "f" = fact, "t" = red timer fact. Facts only from opened sources (Mayo Clinic, NIDDK, OpenStax, StatPearls…).
Stills per stage, LOOK, then frames as above with /r3d/journey3d.js.

## Sound and encode (both formats)
voice: ffmpeg loudnorm chain (PIPELINE §2) → voice_final.wav; mix.json like the example (events: pop at each label / chip, whoosh at stage changes,
ding for timer facts, confirm at the end card; music pad only) → python3 r3d/mix.py mix.json → loudnorm −15 → mix_final.wav
ffmpeg -framerate 30 -i <ep>/frames/f%05d.png -c:v libx264 -crf 12 -preset veryfast -pix_fmt yuv420p video_silent.mp4 → tools/encode_final.sh.
