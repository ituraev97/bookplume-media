import numpy as np, soundfile as sf, subprocess, pyloudnorm as pyln
from scipy.signal import butter, sosfilt

SR = 44100
END = 53.6
N = int(END * SR)
rng = np.random.default_rng(7)
K = "/home/claude/bookplume-media/templates/sfx/"


def load(path):
    out = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
    return np.frombuffer(out, dtype=np.float32).copy()


def lp(x, f, o=2):
    return sosfilt(butter(o, f, "low", fs=SR, output="sos"), x)


def hp(x, f, o=2):
    return sosfilt(butter(o, f, "high", fs=SR, output="sos"), x)


def db(x):
    return 10 ** (x / 20)


def place(buf, snd, t, gain_db=0.0):
    i = int(t * SR)
    if i >= len(buf):
        return
    s = snd[: len(buf) - i] * db(gain_db)
    buf[i : i + len(s)] += s


def env_ar(n, a, r):
    e = np.ones(n)
    na = int(a * SR)
    nr = int(r * SR)
    e[:na] = np.linspace(0, 1, na)
    e[-nr:] *= np.linspace(1, 0, nr)
    return e


# ---------------- voice ----------------
voice, vsr = sf.read("/home/claude/work/run/voice_final.wav", dtype="float32")
assert vsr == SR
voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]

# ---------------- music ----------------
BPM = 96
beat = 60 / BPM
bar = beat * 4
NOTE = {"C": 0, "C#": 1, "D": 2, "Eb": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "Ab": 8, "A": 9, "Bb": 10, "B": 11}


def hz(name, octv):
    return 440 * 2 ** ((NOTE[name] + 12 * (octv + 1) - 69) / 12)


def chord_notes(root, minor):
    r = NOTE[root]
    ints = [0, 3, 7] if minor else [0, 4, 7]
    return [(r + i) % 12 for i in ints]


def nhz(pc, octv):
    return 440 * 2 ** ((pc + 12 * (octv + 1) - 69) / 12)


PROG_A = [("D", True), ("Bb", False), ("F", False), ("C", False)]  # curious minor
PROG_B = [("F", False), ("C", False), ("D", True), ("Bb", False)]  # bright
PROG_M = [("D", True), ("D", True), ("Bb", False), ("A", False)]  # mystery


def pad_tone(freqs, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = np.zeros(n)
    for f in freqs:
        for det in (-0.12, 0.12):
            ff = f * 2 ** (det / 12)
            for h, a in ((1, 1), (2, 0.35), (3, 0.15), (4, 0.06)):
                x += a * np.sin(2 * np.pi * ff * h * t + rng.uniform(0, 6.28))
    x = lp(x, 1400)
    return x * env_ar(n, min(0.6, dur / 3), min(0.8, dur / 3)) / (len(freqs) * 3)


def pluck(f, dur=1.2):
    n = int(dur * SR)
    p = int(SR / f)
    buf = rng.uniform(-1, 1, p)
    out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = 0.5 * (buf[i % p] + buf[(i + 1) % p]) * 0.996
    return lp(out, 3500) * np.exp(-np.arange(n) / SR * 2.5)


PL = {}


def pl(f):
    k = round(f, 2)
    if k not in PL:
        PL[k] = pluck(f)
    return PL[k]


def kick():
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    f = 50 + 70 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)


def shaker():
    n = int(0.08 * SR)
    return hp(rng.normal(0, 1, n), 6000) * np.exp(-np.arange(n) / SR * 60) * 0.25


KICK, SHK = kick(), shaker()
music = np.zeros(N)


def section(t0, t1, prog, arp=True, drums=True, padg=1.0, arpg=1.0, oct_=4):
    t = t0
    ci = 0
    while t < t1 - 0.05:
        root, minor = prog[ci % len(prog)]
        pcs = chord_notes(root, minor)
        dur = min(bar, t1 - t)
        place(music, pad_tone([nhz(pcs[0], 3), nhz(pcs[1], 3), nhz(pcs[2], 3), nhz(pcs[0], 2)], dur + 0.4), t, 20 * np.log10(padg))
        if arp:
            pattern = [0, 1, 2, 1, 0, 2, 1, 2]
            for k in range(8):
                tt = t + k * beat / 2
                if tt >= t1:
                    break
                o = oct_ + (1 if k in (2, 5) else 0)
                place(music, pl(nhz(pcs[pattern[k]], o)) * 0.22 * arpg, tt)
        if drums:
            for k in range(4):
                tt = t + k * beat
                if tt >= t1:
                    break
                if k in (0, 2):
                    place(music, KICK * 0.35, tt)
                place(music, SHK, tt + beat / 2)
        t += bar
        ci += 1


section(0.0, 40.85, PROG_A, padg=0.9, arpg=0.8)
section(40.85, 44.57, PROG_M, drums=False, arpg=0.5, padg=0.7)
section(44.87, END + 0.5, PROG_B, arpg=0.8)
fade = np.ones(N)
a, b = int(44.27 * SR), int(44.57 * SR)
fade[a:b] = np.linspace(1, 0, b - a)
fade[b : int(44.87 * SR)] = 0
music *= fade
music[-int(0.5 * SR) :] *= np.linspace(1, 0, int(0.5 * SR))

# ---------------- SFX ----------------
sfx = np.zeros(N)


def whoosh(dur=0.5, up=True):
    n = int(dur * SR)
    x = rng.normal(0, 1, n)
    out = np.zeros(n)
    seg = 512
    for i in range(0, n, seg):
        k = i / n
        fc = 300 + 4000 * (k if up else 1 - k)
        out[i : i + seg] = lp(x[i : i + seg], fc)[: len(out[i : i + seg])]
    e = np.sin(np.pi * np.linspace(0, 1, n)) ** 2
    return out * e * 0.5


def riser(dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 120 * 2 ** (t / dur * 3)
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.3
    noise = hp(rng.normal(0, 1, n), 2000) * 0.15
    return (tone + noise) * (t / dur) ** 2


def boom():
    n = int(1.6 * SR)
    t = np.arange(n) / SR
    f = 38 + 90 * np.exp(-t * 12)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.8)
    x += lp(rng.normal(0, 1, n), 900) * np.exp(-t * 8) * 0.4
    return x * 0.9


def beep(f=1000, dur=0.09):
    n = int(dur * SR)
    t = np.arange(n) / SR
    return np.sin(2 * np.pi * f * t) * env_ar(n, 0.005, 0.03) * 0.3


S = {k: load(K + v) for k, v in {
    "click": "kenney_interface-sounds/click_002.ogg",
    "tick": "kenney_interface-sounds/tick_002.ogg",
    "pop": "kenney_interface-sounds/drop_002.ogg",
    "pluck": "kenney_interface-sounds/pluck_001.ogg",
    "ding": "kenney_interface-sounds/confirmation_002.ogg",
    "question": "kenney_interface-sounds/question_001.ogg",
    "scratch": "kenney_interface-sounds/scratch_002.ogg",
    "snap": "kenney_impact-sounds/impactPlank_medium_000.ogg",
    "stamp": "kenney_impact-sounds/impactPunch_heavy_000.ogg",
    "paper": "kenney_impact-sounds/impactSoft_medium_000.ogg",
    "rumble": "kenney_sci-fi-sounds/lowFrequency_explosion_000.ogg",
    "select": "kenney_interface-sounds/select_002.ogg",
    "maximize": "kenney_interface-sounds/maximize_003.ogg",
}.items()}
W, WD, BOOM = whoosh(0.5), whoosh(0.6, False), boom()
SL = whoosh(0.45)
# V1 hook
place(sfx, S["pop"], 0.02, -4)
place(sfx, S["ding"], 0.25, -9)
place(sfx, whoosh(2.4), 0.3, -12)
place(sfx, S["select"], 0.9, -7)
place(sfx, S["pop"], 1.7, -7)
place(sfx, S["stamp"], 2.62, -3)
# V2 mnemonic card
place(sfx, W, 2.8, -4)
place(sfx, S["paper"], 3.02, -6)
for tt in (3.15, 3.39, 3.67, 3.87): place(sfx, S["tick"], tt, -6); place(sfx, S["pop"], tt + 0.02, -9)
for k in range(4): place(sfx, S["pluck"], 4.05 + k * 0.12, -12)
place(sfx, S["ding"], 4.55, -10)
# V3 tricuspid
place(sfx, W, 4.65, -4)
place(sfx, S["paper"], 4.9, -7)
for k in range(5): place(sfx, S["tick"], 4.88 + k * 0.1, -11)
place(sfx, S["select"], 5.32, -5); place(sfx, S["pluck"], 5.37, -10)
for tt in (6.77, 7.67): place(sfx, S["click"], tt, -8); place(sfx, SL, tt - 0.1, -13)
place(sfx, S["maximize"], 8.79, -7); place(sfx, S["pop"], 8.85, -8)
# V4 pulmonary
place(sfx, W, 9.7, -4)
place(sfx, S["select"], 10.41, -5); place(sfx, S["pluck"], 10.46, -10)
place(sfx, SL, 11.75, -11); place(sfx, S["click"], 12.13, -8)
place(sfx, whoosh(0.9), 13.3, -10)
place(sfx, S["pop"], 14.01, -7)
# V5 mitral
place(sfx, W, 14.7, -4)
place(sfx, S["select"], 15.4, -5); place(sfx, S["pluck"], 15.45, -10)
place(sfx, S["click"], 16.41, -8)
place(sfx, S["maximize"], 17.88, -7); place(sfx, S["pop"], 17.95, -8)
place(sfx, S["pop"], 19.66, -7); place(sfx, S["ding"], 19.7, -11)
# V6 aortic
place(sfx, W, 20.35, -4)
place(sfx, S["select"], 21.36, -5); place(sfx, S["pluck"], 21.41, -10)
place(sfx, SL, 22.55, -11); place(sfx, S["click"], 22.72, -8)
place(sfx, whoosh(0.9), 23.6, -10)
place(sfx, S["pop"], 24.46, -7)
# V7 AV + chordae
place(sfx, W, 25.15, -4)
for tt in (25.37, 26.09): place(sfx, S["select"], tt, -6)
place(sfx, S["click"], 27.16, -8)
place(sfx, S["scratch"], 28.75, -9)
place(sfx, S["pop"], 29.49, -8)
place(sfx, S["maximize"], 30.29, -7)
# V7b semilunar
place(sfx, W, 31.45, -4)
place(sfx, S["paper"], 31.7, -6)
for tt in (31.65, 32.43): place(sfx, S["pop"], tt, -6); place(sfx, S["pluck"], tt + 0.25, -11)
place(sfx, S["stamp"], 33.02, -6)
place(sfx, S["maximize"], 34.59, -7)
place(sfx, S["ding"], 34.95, -10)
# V8 plate labels
place(sfx, W, 36.15, -4)
place(sfx, S["paper"], 36.4, -6)
for tt in (36.85, 37.25, 37.65, 38.05): place(sfx, S["pop"], tt, -7)
place(sfx, S["maximize"], 38.9, -8)
place(sfx, S["click"], 39.3, -8)
# V9 test
place(sfx, W, 40.7, -4)
place(sfx, S["paper"], 40.95, -6)
place(sfx, S["question"], 41.61, -6)
for k in range(4): place(sfx, S["tick"], 42.2 + k * 0.12, -8)
for tt in (43.35, 43.85, 44.35): place(sfx, beep(880 if tt < 44.3 else 1320), tt, -4)
place(sfx, riser(0.45), 44.4, -12)
# V10 answer
place(sfx, BOOM * 0.5, 44.87, -8)
place(sfx, S["maximize"], 44.92, -5)
place(sfx, S["pop"], 45.25, -7)
place(sfx, S["pluck"], 45.4, -9)
place(sfx, S["ding"], 46.0, -9)
# V11 save
place(sfx, W, 46.9, -4)
place(sfx, S["paper"], 47.12, -5)
place(sfx, S["stamp"], 47.17, -8)
place(sfx, S["pop"], 48.11, -7)
for k in range(4): place(sfx, S["tick"], 48.5 + k * 0.05, -10)
# V12 end
place(sfx, W, 49.1, -4)
place(sfx, S["maximize"], 49.32, -6)
place(sfx, S["ding"], 49.4, -8)
place(sfx, S["pop"], 50.35, -7)

# ---------------- mix ----------------
meter = pyln.Meter(SR)
vl = meter.integrated_loudness(voice)
ml = meter.integrated_loudness(music)
music *= db((vl - 16.5) - ml)

# sidechain ducking: extra -5 dB when voice is active
venv = np.abs(voice)
venv = lp(venv, 8)
venv = np.clip(venv / (np.percentile(venv, 90) + 1e-9), 0, 1)
duck = db(-5 * venv)
music *= duck

# sfx level: below voice
sl = meter.integrated_loudness(sfx)
sfx *= db((vl - 9) - sl)

mix = voice + music + sfx
mix = np.stack([mix, mix], 1)
# stereo widen music slightly
mus_st = np.stack([music, np.roll(music, 300)], 1) - np.stack([music, music], 1)
mix += mus_st * 0.5
sf.write("/home/claude/work/mix_pre.wav", mix.astype(np.float32), SR)
print("voice LUFS", vl)
