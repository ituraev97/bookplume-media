# Places each spoken item on the beat grid for the BEAT 3D format.
# usage (in a dir with m/kokoro-v1.0.onnx): python3 beat_voice.py script.py items.json bpm out_dir
#   script.py: S=[(item line 1,0),...,(item line N,0),(end line,0)]  -- one line per item, then ONE end line
#   items.json: [{name, plain, meshes, focus?}, ...] N entries (same order as the lines)
# writes out_dir/vo.wav and out_dir/timeline.json {items:[...with t0,t1], tEndLine, end, bpm}
import json,math,sys,subprocess,numpy as np,soundfile as sf
script,items_f,bpm,out=sys.argv[1],sys.argv[2],float(sys.argv[3]),sys.argv[4]
T="/home/claude/bookplume-media/templates/tools/synth_short.py"
subprocess.run(["python3",T,script,f"{out}/vo_raw.wav",f"{out}/segs_raw.json"],check=True)
seg=json.load(open(f"{out}/segs_raw.json")); y,sr=sf.read(f"{out}/vo_raw.wav"); items=json.load(open(items_f))
assert len(seg)==len(items)+1, "need one line per item + one end line"
beat=60/bpm; t=0.25; out_a=np.zeros(int(90*sr))
for it,s in zip(items,seg[:-1]):
    a=y[int(s['s']*sr):int(s['e']*sr)]; out_a[int(t*sr):int(t*sr)+len(a)]+=a
    slots=max(2,math.ceil((s['e']-s['s']+0.2)/beat)); it['t0']=round(t,3); it['t1']=round(t+slots*beat,3); t+=slots*beat
te=t+0.25; s=seg[-1]; a=y[int(s['s']*sr):int(s['e']*sr)]; out_a[int(te*sr):int(te*sr)+len(a)]+=a
end=round(te+(s['e']-s['s'])+1.0,2); sf.write(f"{out}/vo.wav",out_a[:int(end*sr)],sr)
json.dump(dict(items=items,tEndLine=round(te,3),end=end,bpm=bpm),open(f"{out}/timeline.json","w"),indent=1); print(end)
