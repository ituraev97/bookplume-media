import json, re, numpy as np, soundfile as sf, os, sys
from scipy.signal import resample_poly
from pocketsphinx import Decoder, get_model_path
wav, segf, outf = sys.argv[1], sys.argv[2], sys.argv[3]
extra = open(sys.argv[4]).read() if len(sys.argv) > 4 else ""
mp=get_model_path()
base=open(os.path.join(mp,'en-us/cmudict-en-us.dict')).read()
open('full_any.dict','w').write(base+extra)
y,sr=sf.read(wav); y16=resample_poly(y,2,3)
J=json.load(open(segf)); segs=J["segs"] if isinstance(J,dict) else J
def norm(w): return re.sub(r"[^a-z'\-]","",w.lower())
words=[]; fb=0
for sg in segs:
    ws=sg['text'].split(); a=y16[int(sg['s']*16000):int(sg['e']*16000)]
    a=np.concatenate([np.zeros(4800),a,np.zeros(4800)]); pcm=(np.clip(a,-1,1)*32767).astype(np.int16).tobytes()
    ok=False
    try:
        d=Decoder(hmm=os.path.join(mp,'en-us/en-us'),dict='full_any.dict',loglevel='FATAL')
        d.set_align_text(" ".join(norm(w) for w in ws))
        d.start_utt(); d.process_raw(pcm,full_utt=True); d.end_utt(); d.set_alignment(); d.start_utt(); d.process_raw(pcm,full_utt=True); d.end_utt()
        al=[(s.name,s.start,s.duration) for s in d.get_alignment()]
        al=[x for x in al if x[0] not in ('<s>','</s>','<sil>')]
        if len(al)==len(ws):
            for w,(n,st,du) in zip(ws,al): words.append({"w":w,"s":round(sg['s']+st/100-0.3,2),"e":round(sg['s']+(st+du)/100-0.3,2)})
            ok=True
    except Exception as e: pass
    if not ok:
        fb+=1
        L=sum(len(w) for w in ws)+0.0; t=sg['s']; D=sg['e']-sg['s']
        for w in ws: dd=D*len(w)/L; words.append({"w":w,"s":round(t,2),"e":round(t+dd,2)}); t+=dd
json.dump(words,open(outf,'w')); print(len(words),'words, fallbacks',fb)
