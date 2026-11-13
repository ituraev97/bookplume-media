# Build a long QUIZ video's voice + data from one file.
#   cd /home/claude/work && python3 /home/claude/bookplume-media/templates/tools/quiz_build.py quiz.py vid
# (work dir must have m/kokoro-v1.0.onnx + m/voices-v1.0.bin; vid = copy of templates/quiz/vid)
# Writes: vo.wav, voice_final.wav (44.1k, normalized), segs.json, words.json, words.sents.json,
#         vid/src/quizdata.ts, vid/src/words.ts, vid/src/timeline.ts, quiz.json (for audio_quiz.py), chapters.txt (YouTube timestamps)
# quiz.py format: see templates/quiz/example_quiz.py
import json, os, re, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
qfile, vid = sys.argv[1], sys.argv[2]
G = {}
exec(open(qfile).read(), G)
COUNT = G.get("COUNT", 5)
rows = []  # (chapter, sentence, pause)
def add(ch, sents, last_pause, mid=0.3):
    idx = []
    for i, s in enumerate(sents):
        idx.append(len(rows)); rows.append((ch, s, last_pause if i == len(sents) - 1 else mid))
    return idx
L = G["LEVELS"]
intro = add(0, G["INTRO"], 0.9, 0.3)
levels, items, cta = [], [], None
qn = 0
for li, (lname, lsay) in enumerate(L):
    ch = li + 1
    lrow = add(ch, [lsay], 0.8)
    levels.append({"n": li + 1, "name": lname, "row": lrow[0]})
    for q in [q for q in G["Q"] if q["level"] == li]:
        qn += 1
        ask = add(ch, [q["ask"]], COUNT + 0.35)
        say = add(ch, q["say"], 1.0, 0.3)
        items.append({**q, "n": qn, "askRow": ask[0], "sayRows": say})
    if G.get("CTA") and G.get("CTA_AFTER_LEVEL") == li:
        cta = add(ch, G["CTA"], 0.9, 0.3)
outro = add(len(L) + 1, G["OUTRO"], 0.8, 0.3)
CH = ["Intro"] + [f"Level {i+1}: {n}" for i, (n, _) in enumerate(L)] + ["Your Score"]
# tts script
open("_quiz_script.py", "w").write("CH=" + json.dumps(CH) + "\nS=" + json.dumps(rows) + "\n" + (f"VOICE={G['VOICE']!r}\n" if "VOICE" in G else ""))
subprocess.run([sys.executable, os.path.join(HERE, "tts.py"), "_quiz_script.py", "vo.wav", "segs.json"], check=True)
extra = G.get("EXTRA_DICT", "")
open("_extra.dict", "w").write(extra)
subprocess.run([sys.executable, os.path.join(HERE, "align_any.py"), "vo.wav", "segs.json", "words.json", "_extra.dict"], check=True)
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", "vo.wav", "-af", "highpass=f=70,acompressor=threshold=-20dB:ratio=2.5:attack=5:release=80,loudnorm=I=-16:TP=-1.5", "-ac", "1", "-ar", "44100", "voice_final.wav"], check=True)
sents = json.load(open("words.sents.json")); segs = json.load(open("segs.json"))
assert len(sents) == len(rows), (len(sents), len(rows))
R = lambda i: sents[i]
for it in items:
    a = R(it["askRow"])
    it["tQ"] = round(a["s"] - 0.35, 2)
    it["tCount"] = round(a["e"] + 0.2, 2)
    it["tReveal"] = round(it["tCount"] + COUNT, 2)
    it["tEnd"] = round(R(it["sayRows"][-1])["e"] + 0.7, 2)
    for k in ("askRow", "sayRows"): it.pop(k)
for l in levels:
    l["s"] = round(R(l.pop("row"))["s"] - 0.4, 2)
end = round(segs["dur"] + 0.8, 2)
data = {
    "title": G["TITLE"], "series": G.get("SERIES", "Anatomy Quiz"), "count": COUNT, "total": len(items),
    "intro": {"s": 0, "e": round(R(intro[-1])["e"] + 0.5, 2)},
    "levels": levels, "items": items,
    "cta": {"s": round(R(cta[0])["s"] - 0.3, 2), "e": round(R(cta[-1])["e"] + 0.5, 2)} if cta else None,
    "outro": {"s": round(R(outro[0])["s"] - 0.4, 2), "e": end},
    "bands": G.get("BANDS", []), "thumb": G.get("THUMB", {}), "rules": G.get("RULES", ["5 seconds each", "Keep score", "It gets harder"]),
    "end": end,
}
os.makedirs(f"{vid}/src", exist_ok=True)
open(f"{vid}/src/quizdata.ts", "w").write("export const QZ = " + json.dumps(data, indent=1) + " as const;\n")
json.dump(data, open("quiz.json", "w"), indent=1)
# words.ts (number words -> digits for display)
NUM = {w: str(i) for i, w in enumerate("zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty".split())}
NUM.update({"thirty": "30", "forty": "40", "fifty": "50"})
words = json.load(open("words.json"))
for w in words:
    m = re.match(r"^([A-Za-z]+)([^A-Za-z]*)$", w["w"])
    if m and m.group(1).lower() in NUM: w["w"] = NUM[m.group(1).lower()] + m.group(2)
open(f"{vid}/src/words.ts", "w").write("export const WORDS = " + json.dumps(words) + ";\n")
chs = [{"n": 0, "title": "Intro", "s": 0}] + [{"n": l["n"], "title": f"Level {l['n']}: {l['name']}", "s": l["s"]} for l in levels] + [{"n": len(levels) + 1, "title": "Your Score", "s": data["outro"]["s"]}]
open(f"{vid}/src/timeline.ts", "w").write("export const CHAPTERS = " + json.dumps(chs) + ";\nexport const END = " + str(end) + ";\n")
def ts(x):
    x = int(x); return f"{x//60}:{x%60:02d}"
open("chapters.txt", "w").write("\n".join(f"{ts(c['s'])} {c['title']}" for c in chs) + "\n")
print("END", end, "s =", ts(end), "| questions", len(items))
print(open("chapters.txt").read())
