import numpy as np, soundfile as sf, json, sys
from kokoro_onnx import Kokoro
exec(open('script.py').read())
src=open('synth_fix.py').read(); FIX=eval(src[src.index('FIX=')+4:src.index(']\n',src.index('FIX='))+1])
idx=[int(x) for x in sys.argv[1:]]
y,sr=sf.read('vo.wav'); J=json.load(open('segs.json')); segs=J['segs']
k=Kokoro("m/kokoro-v1.0.onnx","m/voices-v1.0.bin")
peak=None
for i in sorted(idx, reverse=True):
    txt=S[i][1]; ph=k.tokenizer.phonemize(txt,"en-us")
    for a_,b_ in FIX: ph=ph.replace(a_,b_)
    a,_=k.create(ph,voice="am_michael",speed=1.1,lang="en-us",is_phonemes=True)
    nz=np.where(np.abs(a)>0.01)[0]; a=a[max(0,nz[0]-240):nz[-1]+700]
    old=y[int(segs[i]['s']*sr):int(segs[i]['e']*sr)]
    a=a/ (np.abs(a).max()+1e-9) * np.abs(old).max()
    s0,e0=int(segs[i]['s']*sr),int(segs[i]['e']*sr)
    y=np.concatenate([y[:s0],a,y[e0:]]); d=(len(a)-(e0-s0))/sr
    segs[i]['text']=txt; segs[i]['e']=segs[i]['s']+len(a)/sr
    for j in range(i+1,len(segs)): segs[j]['s']+=d; segs[j]['e']+=d
    for c in J['chapters']:
        if c['s']>segs[i]['s']+0.01: c['s']=round(c['s']+d,2)
    J['dur']+=d
sf.write('vo.wav',y,sr); json.dump(J,open('segs.json','w'),indent=1); print(J['dur'],[c['s'] for c in J['chapters']])
