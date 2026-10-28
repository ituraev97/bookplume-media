# usage: python3 synth_short.py script.py out.wav out_segs.json   (run from a dir that has m/kokoro-v1.0.onnx and m/voices-v1.0.bin)
# script.py defines S = [(sentence, pause_after_seconds), ...]
import numpy as np, soundfile as sf, json, subprocess, sys
from kokoro_onnx import Kokoro
exec(open(sys.argv[1]).read())
k=Kokoro("m/kokoro-v1.0.onnx","m/voices-v1.0.bin")
sr=24000; out=[]; segs=[]; t=0
for txt,p in S:
    a,_=k.create(txt,voice="am_michael",speed=1.15,lang="en-us")
    nz=np.where(np.abs(a)>0.01)[0]; a=a[max(0,nz[0]-240):nz[-1]+700]
    sf.write("/tmp/s.wav",a,sr); subprocess.run(["ffmpeg","-y","-loglevel","error","-i","/tmp/s.wav","-af","atempo=1.08","/tmp/s2.wav"])
    a,_=sf.read("/tmp/s2.wav")
    segs.append({"text":txt,"s":t,"e":t+len(a)/sr}); out.append(a); t+=len(a)/sr
    out.append(np.zeros(int(p*sr))); t+=p
y=np.concatenate(out); y=y/np.abs(y).max()*0.9
sf.write(sys.argv[2],y,sr); json.dump(segs,open(sys.argv[3],"w"),indent=1); print(t)
