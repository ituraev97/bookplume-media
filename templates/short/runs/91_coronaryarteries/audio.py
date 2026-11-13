import numpy as np, soundfile as sf, subprocess, pyloudnorm as pyln
from scipy.signal import butter, sosfilt

SR = 44100
END = 26.0
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
BPM = 100
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





section(0.0, 4.6, PROG_A, padg=0.9, arpg=0.8)
section(4.6, 6.45, PROG_B, padg=0.85, arpg=0.75)
section(6.45, 10.4, PROG_A, padg=0.85, arpg=0.7)
section(10.4, 15.9, PROG_B, padg=0.8, arpg=0.7)
section(15.9, 20.05, PROG_M, drums=False, arpg=0.5, padg=0.7)
section(20.3, END + 0.5, PROG_B, arpg=0.8)
fade = np.ones(N)
a, b = int(19.8 * SR), int(20.05 * SR)
fade[a:b] = np.linspace(1, 0, b - a)
fade[b : int(20.3 * SR)] = 0
music *= fade
music[-int(0.5 * SR) :] *= np.linspace(1, 0, int(0.5 * SR))

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
# V1 hook (Fig. 492 visible from frame 0)
place(sfx, S["stamp"], 0.0, -6); place(sfx, S["pop"], 0.02, -5); place(sfx, whoosh(2.2), 0.1, -13); place(sfx, S["pop"], 0.15, -8)
place(sfx, S["select"], 0.9, -8); place(sfx, S["pop"], 2.6, -7); place(sfx, S["select"], 2.65, -10); place(sfx, S["pop"], 2.95, -7)
place(sfx, S["ding"], 3.65, -10); place(sfx, S["paper"], 3.62, -8)
# V2 trick card
place(sfx, W, 4.5, -4); place(sfx, S["paper"], 4.62, -6); place(sfx, S["pluck"], 4.8, -10); place(sfx, S["pop"], 5.0, -8)
place(sfx, S["pop"], 5.52, -6); place(sfx, S["pop"], 5.96, -6); place(sfx, S["ding"], 6.1, -11)
# V3 left coronary lights
place(sfx, W, 6.35, -4); place(sfx, S["paper"], 6.5, -7)
place(sfx, S["select"], 6.62, -7); place(sfx, whoosh(0.7), 6.62, -11); place(sfx, S["pop"], 7.0, -9); place(sfx, S["pop"], 7.7, -10)
place(sfx, S["select"], 8.68, -7); place(sfx, whoosh(0.8, False), 8.7, -11); place(sfx, S["pop"], 8.95, -8); place(sfx, S["ding"], 9.65, -12)
# V4 right coronary + flip
place(sfx, W, 10.3, -4); place(sfx, S["paper"], 10.45, -6); place(sfx, S["select"], 10.6, -8)
place(sfx, S["pop"], 10.8, -6); place(sfx, S["pop"], 11.1, -6); place(sfx, S["pop"], 11.9, -8); place(sfx, S["select"], 11.95, -9)
place(sfx, whoosh(0.6), 13.25, -6); place(sfx, S["scratch"], 13.35, -14); place(sfx, S["pop"], 13.6, -9)
place(sfx, S["select"], 14.16, -7); place(sfx, S["pop"], 14.4, -8); place(sfx, S["ding"], 15.4, -12)
# V5 quick test
place(sfx, W, 15.8, -4); place(sfx, S["paper"], 15.95, -5); place(sfx, S["question"], 16.1, -7)
place(sfx, S["pop"], 16.2, -9); place(sfx, S["pop"], 16.5, -11)
for i in range(4): place(sfx, S["tick"], 16.8 + i * 0.12, -11)
for tt, f in ((18.41, 880), (19.05, 880), (19.69, 1320)): place(sfx, beep(f), tt, -4)
place(sfx, riser(0.3), 20.0, -12)
# V6 answer on Fig. 492
place(sfx, BOOM * 0.5, 20.3, -8); place(sfx, S["maximize"], 20.35, -5); place(sfx, S["select"], 20.45, -8)
for tt in (20.96, 21.2, 21.73): place(sfx, S["pop"], tt - 0.03, -8)
place(sfx, S["paper"], 21.0, -10)
# V7 save
place(sfx, W, 22.35, -4); place(sfx, S["paper"], 22.5, -5); place(sfx, S["stamp"], 22.55, -8)
for i in range(6): place(sfx, S["tick"], 22.7 + i * 0.08, -11)
# V8 end
place(sfx, W, 24.5, -4); place(sfx, S["maximize"], 24.65, -6); place(sfx, S["ding"], 24.8, -8)


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
