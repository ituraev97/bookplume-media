import numpy as np, soundfile as sf, subprocess, pyloudnorm as pyln
from scipy.signal import butter, sosfilt

SR = 44100
END = 509.08
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


section(0.00, 30.47, PROG_A, drums=False, arpg=0.58)
section(30.47, 74.71, PROG_B, drums=False, arpg=0.58)
section(74.71, 111.41, PROG_A, drums=False, arpg=0.58)
section(111.41, 166.85, PROG_B, drums=False, arpg=0.58)
section(166.85, 224.03, PROG_A, drums=False, arpg=0.58)
section(224.03, 313.94, PROG_B, drums=False, arpg=0.58)
section(313.94, 351.83, PROG_A, drums=False, arpg=0.58)
section(351.83, 407.34, PROG_B, drums=False, arpg=0.58)
section(407.34, 466.33, PROG_M, drums=False, arpg=0.45)
section(466.33, 509.58, PROG_B, drums=False, arpg=0.58)
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
place(sfx, W, 30.27, -5)
place(sfx, S["maximize"], 30.47, -9)
place(sfx, WD, 32.67, -9)
place(sfx, W, 74.51, -5)
place(sfx, S["maximize"], 74.71, -9)
place(sfx, WD, 76.91, -9)
place(sfx, W, 111.21, -5)
place(sfx, S["maximize"], 111.41, -9)
place(sfx, WD, 113.61, -9)
place(sfx, W, 166.65, -5)
place(sfx, S["maximize"], 166.85, -9)
place(sfx, WD, 169.05, -9)
place(sfx, W, 223.83, -5)
place(sfx, S["maximize"], 224.03, -9)
place(sfx, WD, 226.23, -9)
place(sfx, W, 313.74, -5)
place(sfx, S["maximize"], 313.94, -9)
place(sfx, WD, 316.14, -9)
place(sfx, W, 351.63, -5)
place(sfx, S["maximize"], 351.83, -9)
place(sfx, WD, 354.03, -9)
place(sfx, W, 407.14, -5)
place(sfx, S["maximize"], 407.34, -9)
place(sfx, WD, 409.54, -9)
place(sfx, W, 466.13, -5)
place(sfx, S["maximize"], 466.33, -9)
place(sfx, WD, 468.53, -9)
place(sfx, S["pop"], 0.65, -14)
place(sfx, S["pop"], 5.08, -14)
place(sfx, S["pop"], 8.31, -14)
place(sfx, S["pop"], 13.75, -14)
place(sfx, S["pop"], 16.59, -14)
place(sfx, S["pop"], 26.01, -14)
place(sfx, S["pop"], 30.52, -14)
place(sfx, S["pop"], 32.32, -14)
place(sfx, S["pop"], 35.41, -14)
place(sfx, S["pop"], 37.10, -14)
place(sfx, S["pop"], 42.38, -14)
place(sfx, S["pop"], 45.62, -14)
place(sfx, S["pop"], 49.22, -14)
place(sfx, S["pop"], 53.19, -14)
place(sfx, S["pop"], 55.56, -14)
place(sfx, S["pop"], 60.21, -14)
place(sfx, S["pop"], 63.56, -14)
place(sfx, S["pop"], 67.91, -14)
place(sfx, S["pop"], 70.43, -14)
place(sfx, S["pop"], 72.04, -14)
place(sfx, S["pop"], 74.76, -14)
place(sfx, S["pop"], 78.60, -14)
place(sfx, S["pop"], 81.48, -14)
place(sfx, S["pop"], 88.13, -14)
place(sfx, S["pop"], 89.73, -14)
place(sfx, S["pop"], 93.41, -14)
place(sfx, S["pop"], 96.65, -14)
place(sfx, S["pop"], 99.02, -14)
place(sfx, S["pop"], 105.02, -14)
place(sfx, S["pop"], 107.71, -14)
place(sfx, S["pop"], 111.46, -14)
place(sfx, S["pop"], 115.79, -14)
place(sfx, S["pop"], 118.03, -14)
place(sfx, S["pop"], 121.94, -14)
place(sfx, S["pop"], 126.90, -14)
place(sfx, S["pop"], 131.27, -14)
place(sfx, S["pop"], 136.89, -14)
place(sfx, S["pop"], 143.07, -14)
place(sfx, S["pop"], 147.36, -14)
place(sfx, S["pop"], 153.42, -14)
place(sfx, S["pop"], 158.92, -14)
place(sfx, S["pop"], 161.37, -14)
place(sfx, S["pop"], 163.13, -14)
place(sfx, S["pop"], 166.90, -14)
place(sfx, S["pop"], 169.73, -14)
place(sfx, S["pop"], 174.23, -14)
place(sfx, S["pop"], 178.22, -14)
place(sfx, S["pop"], 182.35, -14)
place(sfx, S["pop"], 185.90, -14)
place(sfx, S["pop"], 189.05, -14)
place(sfx, S["pop"], 193.71, -14)
place(sfx, S["pop"], 197.41, -14)
place(sfx, S["pop"], 200.92, -14)
place(sfx, S["pop"], 206.75, -14)
place(sfx, S["pop"], 209.44, -14)
place(sfx, S["pop"], 211.48, -14)
place(sfx, S["pop"], 216.04, -14)
place(sfx, S["pop"], 217.76, -14)
place(sfx, S["pop"], 224.08, -14)
place(sfx, S["pop"], 227.42, -14)
place(sfx, S["pop"], 229.50, -14)
place(sfx, S["pop"], 231.36, -14)
place(sfx, S["pop"], 234.93, -14)
place(sfx, S["pop"], 236.53, -14)
place(sfx, S["pop"], 239.85, -14)
place(sfx, S["pop"], 242.83, -14)
place(sfx, S["pop"], 246.24, -14)
place(sfx, S["pop"], 250.95, -14)
place(sfx, S["pop"], 255.43, -14)
place(sfx, S["pop"], 258.59, -14)
place(sfx, S["pop"], 261.05, -14)
place(sfx, S["pop"], 265.00, -14)
place(sfx, S["pop"], 269.84, -14)
place(sfx, S["pop"], 273.07, -14)
place(sfx, S["pop"], 280.49, -14)
place(sfx, S["pop"], 283.22, -14)
place(sfx, S["pop"], 286.07, -14)
place(sfx, S["pop"], 293.00, -14)
place(sfx, S["pop"], 300.45, -14)
place(sfx, S["pop"], 303.76, -14)
place(sfx, S["pop"], 306.51, -14)
place(sfx, S["pop"], 310.43, -14)
place(sfx, S["pop"], 313.99, -14)
place(sfx, S["pop"], 317.96, -14)
place(sfx, S["pop"], 320.07, -14)
place(sfx, S["pop"], 322.16, -14)
place(sfx, S["pop"], 326.77, -14)
place(sfx, S["pop"], 330.92, -14)
place(sfx, S["pop"], 335.43, -14)
place(sfx, S["pop"], 338.59, -14)
place(sfx, S["pop"], 341.62, -14)
place(sfx, S["pop"], 345.52, -14)
place(sfx, S["pop"], 351.88, -14)
place(sfx, S["pop"], 355.04, -14)
place(sfx, S["pop"], 357.36, -14)
place(sfx, S["pop"], 361.28, -14)
place(sfx, S["pop"], 371.24, -14)
place(sfx, S["pop"], 374.17, -14)
place(sfx, S["pop"], 378.39, -14)
place(sfx, S["pop"], 382.85, -14)
place(sfx, S["pop"], 385.03, -14)
place(sfx, S["pop"], 388.11, -14)
place(sfx, S["pop"], 395.62, -14)
place(sfx, S["pop"], 397.15, -14)
place(sfx, S["pop"], 407.39, -14)
place(sfx, S["pop"], 462.43, -14)
place(sfx, S["pop"], 466.38, -14)
place(sfx, S["pop"], 471.45, -14)
place(sfx, S["pop"], 475.61, -14)
place(sfx, S["pop"], 480.40, -14)
place(sfx, S["pop"], 486.48, -14)
place(sfx, S["pop"], 489.85, -14)
place(sfx, S["pop"], 494.53, -14)
place(sfx, S["pop"], 499.53, -14)
place(sfx, S["pop"], 504.33, -14)
place(sfx, S["question"], 412.25, -10)
place(sfx, S["tick"], 416.17, -6)
place(sfx, S["tick"], 417.17, -6)
place(sfx, S["tick"], 418.17, -6)
place(sfx, S["ding"], 419.57, -7)
music[int(415.97*SR):int(419.57*SR)] *= 0.6
place(sfx, S["question"], 424.24, -10)
place(sfx, S["tick"], 427.38, -6)
place(sfx, S["tick"], 428.38, -6)
place(sfx, S["tick"], 429.38, -6)
place(sfx, S["ding"], 430.78, -7)
music[int(427.18*SR):int(430.78*SR)] *= 0.6
place(sfx, S["question"], 433.61, -10)
place(sfx, S["tick"], 436.28, -6)
place(sfx, S["tick"], 437.28, -6)
place(sfx, S["tick"], 438.28, -6)
place(sfx, S["ding"], 439.68, -7)
music[int(436.08*SR):int(439.68*SR)] *= 0.6
place(sfx, S["question"], 442.36, -10)
place(sfx, S["tick"], 446.44, -6)
place(sfx, S["tick"], 447.44, -6)
place(sfx, S["tick"], 448.44, -6)
place(sfx, S["ding"], 449.84, -7)
music[int(446.24*SR):int(449.84*SR)] *= 0.6
place(sfx, S["question"], 452.85, -10)
place(sfx, S["tick"], 456.25, -6)
place(sfx, S["tick"], 457.25, -6)
place(sfx, S["tick"], 458.25, -6)
place(sfx, S["ding"], 459.65, -7)
music[int(456.05*SR):int(459.65*SR)] *= 0.6
place(sfx, S["pluck"], 357.31, -15)
place(sfx, S["pluck"], 357.58, -15)
place(sfx, S["pluck"], 357.85, -15)
place(sfx, S["pluck"], 358.12, -15)
place(sfx, S["pluck"], 358.26, -15)
place(sfx, S["pluck"], 358.60, -15)
place(sfx, S["pluck"], 358.80, -15)
place(sfx, S["pluck"], 359.07, -15)
place(sfx, S["pluck"], 359.34, -15)
place(sfx, S["pluck"], 359.61, -15)
place(sfx, S["pluck"], 360.09, -15)
place(sfx, S["pluck"], 360.36, -15)
place(sfx, S["pluck"], 374.13, -15)
place(sfx, S["pluck"], 374.31, -15)
place(sfx, S["pluck"], 374.59, -15)
place(sfx, S["pluck"], 374.94, -15)
place(sfx, S["pluck"], 375.66, -15)
place(sfx, S["pluck"], 375.78, -15)
place(sfx, S["pluck"], 375.97, -15)
place(sfx, S["pluck"], 376.28, -15)
place(sfx, S["pluck"], 376.56, -15)
place(sfx, S["pluck"], 376.81, -15)
place(sfx, S["pluck"], 377.31, -15)
place(sfx, S["pluck"], 377.60, -15)
place(sfx, S["snap"], 385.34, -12)
place(sfx, S["snap"], 386.26, -12)
place(sfx, S["snap"], 386.96, -12)
place(sfx, S["stamp"], 215.99, -13)
place(sfx, S["select"], 500.68, -8)
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
