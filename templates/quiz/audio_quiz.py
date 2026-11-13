# Sound for a long QUIZ video — fully data-driven, no hand-placed times.
#   cd /home/claude/work && python3 /home/claude/bookplume-media/templates/quiz/audio_quiz.py   (needs voice_final.wav + quiz.json from quiz_build.py)
# Writes mix_pre.wav. Then: ffmpeg loudnorm -> mix_final.wav -> tools/encode_final.sh (PIPELINE.md section 4).
# Music: own synthesized calm bed (pads + soft plucks), lighter under the countdown; SFX (Kenney CC0): question pop, 1 tick per second
# of the countdown (last two higher), "ding" at the reveal, whoosh + maximize at level cards, pop at the CTA/outro.
import json, numpy as np, soundfile as sf, subprocess, pyloudnorm as pyln
from scipy.signal import butter, sosfilt
SR = 44100
Q = json.load(open("quiz.json"))
END = Q["end"]; N = int(END * SR)
rng = np.random.default_rng(11)
K = "/home/claude/bookplume-media/templates/sfx/"
def load(p):
    out = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", p, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
    return np.frombuffer(out, dtype=np.float32).copy()
lp = lambda x, f, o=2: sosfilt(butter(o, f, "low", fs=SR, output="sos"), x)
db = lambda x: 10 ** (x / 20)
def place(buf, snd, t, g=0.0):
    i = int(t * SR)
    if 0 <= i < len(buf):
        s = snd[: len(buf) - i] * db(g); buf[i:i + len(s)] += s
def env(n, a, r):
    e = np.ones(n); na, nr = int(a * SR), int(r * SR); e[:na] = np.linspace(0, 1, na); e[-nr:] *= np.linspace(1, 0, nr); return e
voice, vsr = sf.read("voice_final.wav", dtype="float32"); assert vsr == SR
voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
# ---- music bed ----
NOTE = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "Bb": 10}
nhz = lambda pc, o: 440 * 2 ** ((pc + 12 * (o + 1) - 69) / 12)
PROG = [("F", 0), ("C", 0), ("D", 1), ("Bb", 0)]
def pad(fs, dur):
    n = int(dur * SR); t = np.arange(n) / SR; x = np.zeros(n)
    for f in fs:
        for det in (-0.1, 0.1):
            ff = f * 2 ** (det / 12)
            for h, a in ((1, 1), (2, 0.3), (3, 0.12)):
                x += a * np.sin(2 * np.pi * ff * h * t + rng.uniform(0, 6.28))
    return lp(x, 1200) * env(n, min(0.6, dur / 3), min(0.8, dur / 3)) / (len(fs) * 3)
def pluck(f, dur=1.0):
    n = int(dur * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * np.exp(-t * 4) * env(n, 0.003, 0.2) * 0.5
music = np.zeros(N); bar = 60 / 92 * 4; t = 0; ci = 0
while t < END:
    r, mn = PROG[ci % 4]; pc = NOTE[r]; tri = [pc, (pc + (3 if mn else 4)) % 12, (pc + 7) % 12]
    place(music, pad([nhz(tri[0], 3), nhz(tri[1], 3), nhz(tri[2], 3), nhz(tri[0], 2)], bar + 0.4), t)
    for k, idx in enumerate([0, 1, 2, 1, 2, 1, 0, 2]):
        place(music, pluck(nhz(tri[idx], 4 + (k in (2, 5)))), t + k * bar / 8, -14)
    t += bar; ci += 1
# duck music during each countdown (the ticks carry it) and kill it at the very end
m_env = np.ones(N)
for it in Q["items"]:
    a, b = int(it["tCount"] * SR), int(it["tReveal"] * SR)
    m_env[a:b] = db(-6)
m_env = lp(m_env, 3)
music *= m_env; music[-int(0.6 * SR):] *= np.linspace(1, 0, int(0.6 * SR))
# ---- sfx ----
S = {k: load(K + v) for k, v in {
    "tick": "kenney_interface-sounds/tick_002.ogg", "pop": "kenney_interface-sounds/drop_002.ogg",
    "ding": "kenney_interface-sounds/confirmation_002.ogg", "question": "kenney_interface-sounds/question_001.ogg",
    "maximize": "kenney_interface-sounds/maximize_003.ogg", "select": "kenney_interface-sounds/select_002.ogg",
}.items()}
def whoosh(dur=0.5):
    n = int(dur * SR); x = rng.normal(0, 1, n); out = np.zeros(n)
    for i in range(0, n, 512):
        out[i:i + 512] = lp(x[i:i + 512], 300 + 4000 * i / n)[: len(out[i:i + 512])]
    return out * np.sin(np.pi * np.linspace(0, 1, n)) ** 2 * 0.5
def beep(f, dur=0.07):
    n = int(dur * SR); t = np.arange(n) / SR; return np.sin(2 * np.pi * f * t) * env(n, 0.003, 0.03) * 0.35
sfx = np.zeros(N); W = whoosh()
place(sfx, S["question"], 0.25, -6)
for l in Q["levels"]:
    place(sfx, W, l["s"] - 0.1, -4); place(sfx, S["maximize"], l["s"] + 0.1, -7)
for it in Q["items"]:
    place(sfx, S["pop"], it["tQ"] + 0.25, -9)
    for k in range(Q["count"]):
        tt = it["tCount"] + k
        place(sfx, S["tick"], tt, -4)
        if k >= Q["count"] - 2: place(sfx, beep(1320), tt, -16)
    place(sfx, S["ding"], it["tReveal"], -2)
if Q.get("cta"): place(sfx, S["select"], Q["cta"]["s"] + 0.1, -6)
place(sfx, W, Q["outro"]["s"] - 0.1, -4); place(sfx, S["maximize"], Q["outro"]["s"] + 0.1, -6)
# ---- mix ----
meter = pyln.Meter(SR)
vl = meter.integrated_loudness(voice)
music *= db((vl - 20.0) - meter.integrated_loudness(music))
venv = lp(np.abs(voice), 8); venv = np.clip(venv / (np.percentile(venv, 90) + 1e-9), 0, 1); music *= db(-5 * venv)
sfx *= db((vl - 8) - meter.integrated_loudness(sfx))
mix = voice + music + sfx
st = np.stack([mix, mix], 1) + (np.stack([music, np.roll(music, 300)], 1) - np.stack([music, music], 1)) * 0.5
sf.write("mix_pre.wav", st.astype(np.float32), SR)
print("mix_pre.wav", round(END, 2), "s; voice LUFS", round(vl, 1))
