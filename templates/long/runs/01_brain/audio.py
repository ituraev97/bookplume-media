import numpy as np, soundfile as sf, subprocess, pyloudnorm as pyln
from scipy.signal import butter, sosfilt

SR = 44100
END = 513.7
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


section(0.0, 110.0, PROG_A, drums=False, arpg=0.6)
section(110.0, 237.0, PROG_B, drums=False, arpg=0.55)
section(237.0, 367.6, PROG_A, drums=False, arpg=0.6)
section(367.6, 416.1, PROG_B, drums=False, arpg=0.6)
section(416.1, 477.5, PROG_M, drums=False, arpg=0.45)
section(477.5, END + 0.5, PROG_B, drums=False, arpg=0.6)
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
place(sfx, W, 40.75, -5)
place(sfx, S["maximize"], 40.95, -9)
place(sfx, W, 109.96, -5)
place(sfx, S["maximize"], 110.16, -9)
place(sfx, W, 191.71, -5)
place(sfx, S["maximize"], 191.91, -9)
place(sfx, W, 237.03, -5)
place(sfx, S["maximize"], 237.23, -9)
place(sfx, W, 288.55, -5)
place(sfx, S["maximize"], 288.75, -9)
place(sfx, W, 323.50, -5)
place(sfx, S["maximize"], 323.70, -9)
place(sfx, W, 367.53, -5)
place(sfx, S["maximize"], 367.73, -9)
place(sfx, W, 416.03, -5)
place(sfx, S["maximize"], 416.23, -9)
place(sfx, W, 477.45, -5)
place(sfx, S["maximize"], 477.65, -9)
place(sfx, S["pop"], 1.90, -12)
place(sfx, S["pop"], 12.10, -12)
place(sfx, S["pop"], 20.70, -12)
place(sfx, S["pop"], 25.50, -12)
place(sfx, S["pop"], 32.70, -12)
place(sfx, S["pop"], 33.50, -12)
place(sfx, S["pop"], 34.60, -12)
place(sfx, S["pop"], 35.50, -12)
place(sfx, S["pop"], 37.20, -12)
place(sfx, S["pop"], 43.40, -12)
place(sfx, S["pop"], 47.30, -12)
place(sfx, S["pop"], 50.00, -12)
place(sfx, S["pop"], 55.60, -12)
place(sfx, S["pop"], 62.90, -12)
place(sfx, S["pop"], 69.90, -12)
place(sfx, S["pop"], 76.30, -12)
place(sfx, S["pop"], 79.20, -12)
place(sfx, S["pop"], 82.00, -12)
place(sfx, S["pop"], 88.60, -12)
place(sfx, S["pop"], 92.80, -12)
place(sfx, S["pop"], 97.60, -12)
place(sfx, S["pop"], 100.80, -12)
place(sfx, S["pop"], 102.20, -12)
place(sfx, S["pop"], 104.60, -12)
place(sfx, S["pop"], 106.40, -12)
place(sfx, S["pop"], 119.90, -12)
place(sfx, S["pop"], 121.00, -12)
place(sfx, S["pop"], 127.80, -12)
place(sfx, S["pop"], 134.90, -12)
place(sfx, S["pop"], 136.80, -12)
place(sfx, S["pop"], 144.30, -12)
place(sfx, S["pop"], 149.40, -12)
place(sfx, S["pop"], 151.90, -12)
place(sfx, S["pop"], 153.70, -12)
place(sfx, S["pop"], 156.70, -12)
place(sfx, S["pop"], 160.20, -12)
place(sfx, S["pop"], 162.60, -12)
place(sfx, S["pop"], 166.40, -12)
place(sfx, S["pop"], 170.40, -12)
place(sfx, S["pop"], 174.20, -12)
place(sfx, S["pop"], 178.20, -12)
place(sfx, S["pop"], 182.90, -12)
place(sfx, S["pop"], 185.20, -12)
place(sfx, S["pop"], 187.20, -12)
place(sfx, S["pop"], 196.60, -12)
place(sfx, S["pop"], 199.20, -12)
place(sfx, S["pop"], 200.30, -12)
place(sfx, S["pop"], 201.80, -12)
place(sfx, S["pop"], 206.60, -12)
place(sfx, S["pop"], 213.70, -12)
place(sfx, S["pop"], 216.20, -12)
place(sfx, S["pop"], 217.80, -12)
place(sfx, S["pop"], 223.00, -12)
place(sfx, S["pop"], 225.50, -12)
place(sfx, S["pop"], 229.00, -12)
place(sfx, S["pop"], 229.90, -12)
place(sfx, S["pop"], 232.70, -12)
place(sfx, S["pop"], 234.00, -12)
place(sfx, S["pop"], 239.80, -12)
place(sfx, S["pop"], 240.90, -12)
place(sfx, S["pop"], 242.30, -12)
place(sfx, S["pop"], 245.10, -12)
place(sfx, S["pop"], 245.80, -12)
place(sfx, S["pop"], 246.60, -12)
place(sfx, S["pop"], 254.40, -12)
place(sfx, S["pop"], 256.50, -12)
place(sfx, S["pop"], 258.60, -12)
place(sfx, S["pop"], 261.30, -12)
place(sfx, S["pop"], 263.40, -12)
place(sfx, S["pop"], 275.20, -12)
place(sfx, S["pop"], 284.50, -12)
place(sfx, S["pop"], 292.10, -12)
place(sfx, S["pop"], 293.80, -12)
place(sfx, S["pop"], 295.80, -12)
place(sfx, S["pop"], 297.70, -12)
place(sfx, S["pop"], 300.80, -12)
place(sfx, S["pop"], 301.60, -12)
place(sfx, S["pop"], 308.30, -12)
place(sfx, S["pop"], 311.90, -12)
place(sfx, S["pop"], 314.70, -12)
place(sfx, S["pop"], 319.60, -12)
place(sfx, S["pop"], 320.90, -12)
place(sfx, S["pop"], 322.00, -12)
place(sfx, S["pop"], 327.80, -12)
place(sfx, S["pop"], 329.20, -12)
place(sfx, S["pop"], 333.00, -12)
place(sfx, S["pop"], 334.00, -12)
place(sfx, S["pop"], 336.00, -12)
place(sfx, S["pop"], 339.60, -12)
place(sfx, S["pop"], 346.30, -12)
place(sfx, S["pop"], 349.00, -12)
place(sfx, S["pop"], 354.50, -12)
place(sfx, S["pop"], 359.90, -12)
place(sfx, S["pop"], 363.20, -12)
place(sfx, S["pop"], 370.10, -12)
place(sfx, S["pop"], 376.55, -12)
place(sfx, S["pop"], 391.20, -12)
place(sfx, S["pop"], 398.70, -12)
place(sfx, S["pop"], 407.80, -12)
place(sfx, S["pop"], 413.20, -12)
place(sfx, S["pop"], 419.10, -12)
place(sfx, S["pop"], 474.80, -12)
place(sfx, S["tick"], 424.63, -6)
place(sfx, S["tick"], 425.70, -6)
place(sfx, S["tick"], 426.76, -6)
place(sfx, S["ding"], 427.83, -7)
place(sfx, S["tick"], 435.08, -6)
place(sfx, S["tick"], 436.15, -6)
place(sfx, S["tick"], 437.21, -6)
place(sfx, S["ding"], 438.28, -7)
place(sfx, S["tick"], 444.56, -6)
place(sfx, S["tick"], 445.63, -6)
place(sfx, S["tick"], 446.69, -6)
place(sfx, S["ding"], 447.76, -7)
place(sfx, S["tick"], 455.94, -6)
place(sfx, S["tick"], 457.01, -6)
place(sfx, S["tick"], 458.07, -6)
place(sfx, S["ding"], 459.14, -7)
place(sfx, S["tick"], 468.20, -6)
place(sfx, S["tick"], 469.27, -6)
place(sfx, S["tick"], 470.33, -6)
place(sfx, S["ding"], 471.40, -7)
place(sfx, S["question"], 420.77, -10)
place(sfx, S["question"], 430.32, -10)
place(sfx, S["question"], 439.87, -10)
place(sfx, S["question"], 449.67, -10)
place(sfx, S["question"], 460.33, -10)
place(sfx, S["select"], 503.1, -8)
place(sfx, S["maximize"], 418.5, -7)
for a_, b_ in [(424.63, 427.83), (435.08, 438.28), (444.56, 447.76), (455.94, 459.14), (468.2, 471.4)]:
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
