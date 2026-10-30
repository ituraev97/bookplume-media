import numpy as np, soundfile as sf, json, subprocess, sys
from kokoro_onnx import Kokoro
exec(open(sys.argv[1]).read())
FIX={"tˈæləs":"tˈeɪləs","kælkˈænɪəs":"kælkˈeɪniəs","kˈʌneɪfˌɔːɹmz":"kjˈuːniəfˌɔːɹmz","kˈʌneɪfˌɔːɹm":"kjˈuːniəfˌɔːɹm","tˈaɪɡɚɹ ɪz":"tˈaɪɡɚ ɪz"}
k=Kokoro("m/kokoro-v1.0.onnx","m/voices-v1.0.bin")
sr=24000; out=[]; segs=[]; t=0
for txt,p in S:
    ph=k.tokenizer.phonemize(txt,"en-us")
    for a_,b_ in FIX.items(): ph=ph.replace(a_,b_)
    a,_=k.create(ph,voice="am_michael",speed=1.15,lang="en-us",is_phonemes=True)
    nz=np.where(np.abs(a)>0.01)[0]; a=a[max(0,nz[0]-240):nz[-1]+700]
    sf.write("/tmp/s.wav",a,sr); subprocess.run(["ffmpeg","-y","-loglevel","error","-i","/tmp/s.wav","-af","atempo=1.08","/tmp/s2.wav"])
    a,_=sf.read("/tmp/s2.wav")
    segs.append({"text":txt,"s":t,"e":t+len(a)/sr}); out.append(a); t+=len(a)/sr
    out.append(np.zeros(int(p*sr))); t+=p
y=np.concatenate(out); y=y/np.abs(y).max()*0.9
sf.write(sys.argv[2],y,sr); json.dump(segs,open(sys.argv[3],"w"),indent=1); print(t)
