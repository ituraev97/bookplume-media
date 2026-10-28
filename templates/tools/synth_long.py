import numpy as np, soundfile as sf, json, sys
from kokoro_onnx import Kokoro
exec(open(sys.argv[1]).read())
out_wav, out_segs = sys.argv[2], sys.argv[3]
k=Kokoro("m/kokoro-v1.0.onnx","m/voices-v1.0.bin")
sr=24000; out=[]; segs=[]; t=0.6; out.append(np.zeros(int(0.6*sr)))
chs={}
prev=0
for ch,txt,p in S:
    if ch!=prev: out.append(np.zeros(int(0.5*sr))); t+=0.5; prev=ch
    a,_=k.create(txt,voice="am_michael",speed=1.1,lang="en-us")
    nz=np.where(np.abs(a)>0.01)[0]; a=a[max(0,nz[0]-240):nz[-1]+700]
    chs.setdefault(ch,t)
    segs.append({"text":txt,"s":t,"e":t+len(a)/sr,"ch":ch}); out.append(a); t+=len(a)/sr
    out.append(np.zeros(int(p*sr))); t+=p
y=np.concatenate(out); y=y/np.abs(y).max()*0.9
sf.write(out_wav,y,sr); json.dump({"segs":segs,"chapters":[{"n":i,"title":CH[i],"s":round(chs[i],2)} for i in sorted(chs)],"dur":t},open(out_segs,"w"),indent=1)
print(t, [round(chs[i],1) for i in sorted(chs)])
