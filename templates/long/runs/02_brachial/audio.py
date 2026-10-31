import numpy as np, soundfile as sf, subprocess, pyloudnorm as pyln
from scipy.signal import butter, sosfilt

SR = 44100
END = 543.55
N = int(END * SR)
rng = np.random.default_rng(7)
K = "/home/claude/bookplume-media/templates/sfx/"  # Kenney CC0 sounds, see sfx/KENNEY_LICENSE.txt


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
voice, vsr = sf.read("/home/claude/work/voice_final.wav", dtype="float32")
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


section(0.0, 86.27, PROG_A, drums=False, arpg=0.6)
section(86.27, 196.20, PROG_B, drums=False, arpg=0.55)
section(196.20, 327.96, PROG_A, drums=False, arpg=0.6)
section(327.96, 390.19, PROG_B, drums=False, arpg=0.55)
section(390.19, 444.21, PROG_B, drums=False, arpg=0.6)
section(444.21, 498.31, PROG_M, drums=False, arpg=0.45)
section(498.31, END + 0.5, PROG_B, drums=False, arpg=0.6)
music[-int(1.5 * SR):] *= np.linspace(1, 0, int(1.5 * SR))
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
place(sfx, S["ding"], 0.3, -8)
place(sfx, W, 35.21, -5)
place(sfx, S["maximize"], 35.41, -9)
place(sfx, WD, 37.61, -9)
place(sfx, W, 86.07, -5)
place(sfx, S["maximize"], 86.27, -9)
place(sfx, WD, 88.47, -9)
place(sfx, W, 160.83, -5)
place(sfx, S["maximize"], 161.03, -9)
place(sfx, WD, 163.23, -9)
place(sfx, W, 196.00, -5)
place(sfx, S["maximize"], 196.20, -9)
place(sfx, WD, 198.40, -9)
place(sfx, W, 243.83, -5)
place(sfx, S["maximize"], 244.03, -9)
place(sfx, WD, 246.23, -9)
place(sfx, W, 327.76, -5)
place(sfx, S["maximize"], 327.96, -9)
place(sfx, WD, 330.16, -9)
place(sfx, W, 389.99, -5)
place(sfx, S["maximize"], 390.19, -9)
place(sfx, WD, 392.39, -9)
place(sfx, W, 444.01, -5)
place(sfx, S["maximize"], 444.21, -9)
place(sfx, WD, 446.41, -9)
place(sfx, W, 498.11, -5)
place(sfx, S["maximize"], 498.31, -9)
place(sfx, WD, 500.51, -9)
place(sfx, S["pop"], 1.28, -13)
place(sfx, S["pop"], 5.45, -13)
place(sfx, S["pop"], 9.44, -13)
place(sfx, S["pop"], 14.19, -13)
place(sfx, S["pop"], 15.15, -13)
place(sfx, S["pop"], 22.89, -13)
place(sfx, S["pop"], 24.63, -13)
place(sfx, S["pop"], 26.82, -13)
place(sfx, S["pop"], 28.89, -13)
place(sfx, S["pop"], 31.77, -13)
place(sfx, S["pop"], 37.21, -13)
place(sfx, S["pop"], 41.44, -13)
place(sfx, S["pop"], 43.50, -13)
place(sfx, S["pop"], 48.09, -13)
place(sfx, S["pop"], 52.72, -13)
place(sfx, S["pop"], 56.02, -13)
place(sfx, S["pop"], 62.37, -13)
place(sfx, S["pop"], 66.26, -13)
place(sfx, S["pop"], 70.82, -13)
place(sfx, S["pop"], 71.15, -13)
place(sfx, S["pop"], 71.59, -13)
place(sfx, S["pop"], 72.24, -13)
place(sfx, S["pop"], 72.82, -13)
place(sfx, S["pop"], 73.72, -13)
place(sfx, S["pop"], 87.64, -13)
place(sfx, S["pop"], 93.52, -13)
place(sfx, S["pop"], 94.88, -13)
place(sfx, S["pop"], 97.43, -13)
place(sfx, S["pop"], 98.85, -13)
place(sfx, S["pop"], 99.95, -13)
place(sfx, S["pop"], 104.60, -13)
place(sfx, S["pop"], 107.52, -13)
place(sfx, S["pop"], 110.73, -13)
place(sfx, S["pop"], 112.71, -13)
place(sfx, S["pop"], 123.34, -13)
place(sfx, S["pop"], 124.73, -13)
place(sfx, S["pop"], 131.69, -13)
place(sfx, S["pop"], 136.99, -13)
place(sfx, S["pop"], 140.25, -13)
place(sfx, S["pop"], 143.64, -13)
place(sfx, S["pop"], 143.94, -13)
place(sfx, S["pop"], 144.25, -13)
place(sfx, S["pop"], 148.14, -13)
place(sfx, S["pop"], 152.84, -13)
place(sfx, S["pop"], 155.42, -13)
place(sfx, S["pop"], 162.61, -13)
place(sfx, S["pop"], 166.42, -13)
place(sfx, S["pop"], 169.79, -13)
place(sfx, S["pop"], 172.62, -13)
place(sfx, S["pop"], 176.33, -13)
place(sfx, S["pop"], 177.82, -13)
place(sfx, S["pop"], 181.82, -13)
place(sfx, S["pop"], 186.18, -13)
place(sfx, S["pop"], 189.20, -13)
place(sfx, S["pop"], 190.31, -13)
place(sfx, S["pop"], 191.27, -13)
place(sfx, S["pop"], 197.83, -13)
place(sfx, S["pop"], 199.61, -13)
place(sfx, S["pop"], 201.43, -13)
place(sfx, S["pop"], 203.86, -13)
place(sfx, S["pop"], 205.55, -13)
place(sfx, S["pop"], 209.10, -13)
place(sfx, S["pop"], 212.09, -13)
place(sfx, S["pop"], 219.04, -13)
place(sfx, S["pop"], 227.73, -13)
place(sfx, S["pop"], 236.42, -13)
place(sfx, S["pop"], 237.64, -13)
place(sfx, S["pop"], 240.50, -13)
place(sfx, S["pop"], 245.64, -13)
place(sfx, S["pop"], 250.23, -13)
place(sfx, S["pop"], 251.98, -13)
place(sfx, S["pop"], 258.52, -13)
place(sfx, S["pop"], 260.07, -13)
place(sfx, S["pop"], 261.36, -13)
place(sfx, S["pop"], 262.92, -13)
place(sfx, S["pop"], 264.66, -13)
place(sfx, S["pop"], 269.30, -13)
place(sfx, S["pop"], 272.18, -13)
place(sfx, S["pop"], 274.27, -13)
place(sfx, S["pop"], 278.38, -13)
place(sfx, S["pop"], 282.50, -13)
place(sfx, S["pop"], 286.55, -13)
place(sfx, S["pop"], 289.83, -13)
place(sfx, S["pop"], 294.80, -13)
place(sfx, S["pop"], 296.53, -13)
place(sfx, S["pop"], 297.64, -13)
place(sfx, S["pop"], 301.19, -13)
place(sfx, S["pop"], 303.56, -13)
place(sfx, S["pop"], 306.37, -13)
place(sfx, S["pop"], 312.25, -13)
place(sfx, S["pop"], 320.67, -13)
place(sfx, S["pop"], 322.85, -13)
place(sfx, S["pop"], 324.47, -13)
place(sfx, S["pop"], 333.79, -13)
place(sfx, S["pop"], 336.80, -13)
place(sfx, S["pop"], 339.35, -13)
place(sfx, S["pop"], 343.67, -13)
place(sfx, S["pop"], 348.64, -13)
place(sfx, S["pop"], 354.76, -13)
place(sfx, S["pop"], 358.73, -13)
place(sfx, S["pop"], 362.26, -13)
place(sfx, S["pop"], 364.52, -13)
place(sfx, S["pop"], 368.38, -13)
place(sfx, S["pop"], 375.94, -13)
place(sfx, S["pop"], 379.92, -13)
place(sfx, S["pop"], 384.19, -13)
place(sfx, S["pop"], 395.58, -13)
place(sfx, S["pop"], 395.85, -13)
place(sfx, S["pop"], 396.58, -13)
place(sfx, S["pop"], 396.86, -13)
place(sfx, S["pop"], 397.24, -13)
place(sfx, S["pop"], 398.07, -13)
place(sfx, S["pop"], 398.39, -13)
place(sfx, S["pop"], 398.79, -13)
place(sfx, S["pop"], 399.32, -13)
place(sfx, S["pop"], 399.79, -13)
place(sfx, S["pop"], 402.62, -13)
place(sfx, S["pop"], 402.88, -13)
place(sfx, S["pop"], 403.15, -13)
place(sfx, S["pop"], 403.46, -13)
place(sfx, S["pop"], 403.72, -13)
place(sfx, S["pop"], 412.64, -13)
place(sfx, S["pop"], 414.58, -13)
place(sfx, S["pop"], 415.76, -13)
place(sfx, S["pop"], 416.78, -13)
place(sfx, S["pop"], 418.25, -13)
place(sfx, S["pop"], 420.55, -13)
place(sfx, S["pop"], 429.61, -13)
place(sfx, S["pop"], 430.93, -13)
place(sfx, S["pop"], 431.94, -13)
place(sfx, S["pop"], 432.77, -13)
place(sfx, S["pop"], 435.13, -13)
place(sfx, S["pop"], 438.12, -13)
place(sfx, S["pop"], 495.61, -13)
place(sfx, S["pop"], 499.35, -13)
place(sfx, S["pop"], 505.13, -13)
place(sfx, S["pop"], 508.56, -13)
place(sfx, S["pop"], 512.23, -13)
place(sfx, S["pop"], 517.48, -13)
place(sfx, S["pop"], 521.52, -13)
place(sfx, S["pluck"], 17.04, -10)
place(sfx, S["pluck"], 25.37, -10)
place(sfx, S["pluck"], 247.70, -10)
place(sfx, S["pluck"], 374.74, -10)
place(sfx, S["stamp"], 322.02, -12)
place(sfx, S["snap"], 419.60, -10)
place(sfx, S["maximize"], 446.51, -7)
place(sfx, S["question"], 449.02, -10)
place(sfx, S["tick"], 453.06, -6)
place(sfx, S["tick"], 454.06, -6)
place(sfx, S["tick"], 455.06, -6)
place(sfx, S["ding"], 456.46, -7)
place(sfx, S["question"], 459.91, -10)
place(sfx, S["tick"], 463.60, -6)
place(sfx, S["tick"], 464.60, -6)
place(sfx, S["tick"], 465.60, -6)
place(sfx, S["ding"], 467.00, -7)
place(sfx, S["question"], 468.27, -10)
place(sfx, S["tick"], 472.73, -6)
place(sfx, S["tick"], 473.73, -6)
place(sfx, S["tick"], 474.73, -6)
place(sfx, S["ding"], 476.13, -7)
place(sfx, S["question"], 477.80, -10)
place(sfx, S["tick"], 481.01, -6)
place(sfx, S["tick"], 482.01, -6)
place(sfx, S["tick"], 483.01, -6)
place(sfx, S["ding"], 484.41, -7)
place(sfx, S["question"], 485.92, -10)
place(sfx, S["tick"], 489.50, -6)
place(sfx, S["tick"], 490.50, -6)
place(sfx, S["tick"], 491.50, -6)
place(sfx, S["ding"], 492.90, -7)
place(sfx, S["select"], 533.84, -8)
for a_, b_ in [(452.86, 456.46), (463.4, 467.0), (472.53, 476.13), (480.81, 484.41), (489.3, 492.9)]:
    i0, i1 = int(a_ * SR), int(b_ * SR)
    music[i0:i1] *= 0.6
# ---------------- mix ----------------
meter = pyln.Meter(SR)
vl = meter.integrated_loudness(voice)
ml = meter.integrated_loudness(music)
music *= db((vl - 19.0) - ml)

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
