#!/usr/bin/env python3
"""usage: master_audio.py mix_pre.wav mix_final.wav   -> about -14 LUFS, true peak <= -1.5 dBTP (owner 2026-11-28)
Gain to -14 LUFS, then alimiter; the limit is lowered until ffmpeg ebur128 true peak <= -1.5. Re-measure after the final AAC encode (must stay <= -1.0)."""
import sys, subprocess, soundfile as sf, pyloudnorm as pyln
src, dst = sys.argv[1], sys.argv[2]
y, sr = sf.read(src); l = pyln.Meter(sr).integrated_loudness(y)
sf.write("/tmp/_m.wav", (y * 10 ** ((-14 - l) / 20)).astype("float32"), sr)
lim = 0.80
for _ in range(8):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", "/tmp/_m.wav", "-af", f"alimiter=limit={lim:.2f}:attack=2:release=50:level=disabled", "-ar", "48000", dst])
    o = subprocess.run(["ffmpeg", "-nostats", "-i", dst, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
    tp = float([x for x in o.splitlines() if "Peak:" in x][-1].split()[1])
    print("limit", round(lim, 2), "true peak", tp)
    if tp <= -1.5: break
    lim -= 0.06
