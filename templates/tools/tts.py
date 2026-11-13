# Kokoro narration. OWNER DECISION 2026-11-14: keep STYLE "A" (am_michael, speed 1.15 + atempo 1.08, one sentence per call)
# after listening to samples — do not switch styles without the owner. STYLE "natural" (below) exists only for tests.
#   python3 tts.py script.py out.wav out_segs.json        (run from a dir that has m/kokoro-v1.0.onnx + m/voices-v1.0.bin)
# script.py defines
#   S = [(sentence, pause_after_seconds), ...]                    short
#   S = [(chapter_idx, sentence, pause_after_seconds), ...] + CH  long (chapters)
#   optional VOICE = "am_michael" (see VOICE_DEFAULT), SPEED = 1.0
# STYLE "natural" (tests only): sentences with pause < 0.35 s spoken in one call, speed ≤ 1.05, no atempo.
# Output segs = one entry per call ("sents" lists the sentences inside); align_any.py also writes <words>.sents.json with per-sentence times.
import numpy as np, soundfile as sf, json, sys, random, subprocess
from kokoro_onnx import Kokoro
VOICE_DEFAULT = "am_michael"
exec(open(sys.argv[1]).read())
out_wav, out_segs = sys.argv[2], sys.argv[3]
voice = globals().get("VOICE", VOICE_DEFAULT)
STYLE = globals().get("STYLE", "A")
speed = 1.15 if STYLE == "A" else min(1.05, globals().get("SPEED", 1.0))
lang = "en-gb" if voice[:2] in ("bf", "bm") else "en-us"
long_mode = len(S[0]) == 3
k = Kokoro("m/kokoro-v1.0.onnx", "m/voices-v1.0.bin")
sr = 24000
random.seed(7)
# build breath groups
groups = []  # (chapter, [sentences], pause_after)
for row in S:
    ch, txt, p = (row if long_mode else (0, row[0], row[1]))
    if STYLE != "A" and groups and groups[-1][0] == ch and groups[-1][2] < 0.35 and len(" ".join(groups[-1][1])) + len(txt) < 330:
        groups[-1] = (ch, groups[-1][1] + [txt], p)
    else:
        groups.append((ch, [txt], p))
lead = 0.6 if long_mode else 0.15
out = [np.zeros(int(lead * sr))]; t = lead; segs = []; chs = {}; prev = groups[0][0]
for ch, sents, p in groups:
    if ch != prev:
        out.append(np.zeros(int(0.5 * sr))); t += 0.5; prev = ch
    text = " ".join(sents)
    a, _ = k.create(text, voice=voice, speed=speed, lang=lang)
    nz = np.where(np.abs(a) > 0.008)[0]; a = a[max(0, nz[0] - 240): nz[-1] + 900]
    if STYLE == "A":  # the owner's chosen sound: extra 1.08 tempo
        sf.write("/tmp/_s.wav", a, sr); subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", "/tmp/_s.wav", "-af", "atempo=1.08", "/tmp/_s2.wav"], check=True)
        a, _ = sf.read("/tmp/_s2.wav"); a = a.astype(np.float32)
    fade = int(0.012 * sr); a[:fade] *= np.linspace(0, 1, fade); a[-fade:] *= np.linspace(1, 0, fade)
    chs.setdefault(ch, t)
    segs.append({"text": text, "sents": sents, "s": round(t, 3), "e": round(t + len(a) / sr, 3), "ch": ch})
    out.append(a); t += len(a) / sr
    pp = p if STYLE == "A" else max(0.12, p + (random.uniform(-0.05, 0.05) if p < 1.5 else 0))  # long pauses (countdowns) stay exact
    out.append(np.zeros(int(pp * sr))); t += pp
y = np.concatenate(out); y = y / np.abs(y).max() * 0.9
sf.write(out_wav, y, sr)
res = {"segs": segs, "dur": round(t, 3), "voice": voice}
if long_mode:
    CHT = globals().get("CH", [])
    res["chapters"] = [{"n": i, "title": CHT[i] if i < len(CHT) else str(i), "s": round(chs[i], 2)} for i in sorted(chs)]
json.dump(res, open(out_segs, "w"), indent=1)
print(round(t, 2), "s,", len(segs), "breath groups, voice", voice)
