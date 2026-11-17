# SHEET QUIZ — "<REGION> QUIZ · Can you get 5/5?" (owner approved 2026-11-18: "квиз на листке супер получился")
Reference video: example/ (skull, Gray's 1918 Fig. 188, 5 questions, 38.6 s). Keep this look and sound exactly.

Look: printed paper sheet on dark Forest background with slight handheld drift; title + "Can you get 5/5?"; progress boxes 1–5;
one Gray's 1918 plate (colour) in a window that zooms to each pin; EVERY printed bone/structure name on the plate is under a yellow "?" sticker
(the asked one flips to a green chip with the modern name at the reveal); red numbered pin; "N. Name this bone" + 3 options a/b/c;
3-2-1 ring; red marker circle around the right answer, wrong ones struck through; end card "How many did you get? Comment your score 👇".
NO store / flashcards / bookplume.com anywhere in the video (owner 2026-11-18: the channel is about anatomy, no flashcard push). store=false (default).

Build (in /home/claude/work, short template vid/ already npm-installed):
1. Plate: tools/gray1918.py search/page → LOOK → crop --color --rights rights.json → vid/public/sq/<name>.png. Draw a fraction grid over the crop and LOOK
   to get: label boxes [x0,y0,x1,y1] of EVERY printed structure name (bone names, not sutures) and the pin point of each asked structure
   (on the structure, NOT on its label — keep pin and sticker apart).
2. script.py like example/script.py: intro "<Region> quiz. Can you get five out of five?", then per question "Number N." (pause 3.2) + "<letter>. The <answer>." (+ optional
   one short true tip), end "How many did you get? Comment your score." → tools/synth_short.py → vo.wav + segs.json (voice A, unchanged).
3. sheetquiz.json like example/sheetquiz.json: q1 tAsk = 0 (frame 0 = cover look), tCount = end of "Number N" + 0.05, tReveal = start of the answer line,
   tNext = start of the next "Number", end = start of the last line, tEnd = last line end + 1.9. Options: 3, same region, exactly one correct, easy → hard.
4. Copy SheetQuiz.tsx + sheetquiz.json into vid/src, register compositions SheetQuiz (main) in Root.tsx (see example below), stills with
   `COMP=SheetQuiz OUT=../stills SC=0.5 node stills.mjs <times>` at 0.3, every tCount+1 and tReveal+1, end+1 — LOOK: stickers hide every name,
   pin on the right structure, revealed chip fully readable, nothing overlaps.
5. Sound: voice loudnorm (PIPELINE §2) → mix.json like example/mix.json (whoosh between questions, pop on pin, tick-tick-tock on the 3-2-1, ding + scribble at the reveal,
   calm music bed "B" at −19 dB) → `python3 mix.py mix.json` → loudnorm −15 → render `npx remotion render src/index.ts SheetQuiz ../video_silent.mp4 --codec h264 --concurrency 2`
   → tools/encode_final.sh. The same file is used for TikTok (35–45 s) — no separate cut.
Root.tsx registration:
  <Composition id="SheetQuiz" component={SheetQuizVideo} durationInFrames={Math.ceil(Q.tEnd*30)} fps={30} width={1080} height={1920} defaultProps={{store:false}} />
