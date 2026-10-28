import subprocess, numpy as np, sys
f=sys.argv[1]; w,h=108,192
raw=subprocess.run(['ffmpeg','-loglevel','error','-i',f,'-vf',f'scale={w}:{h},format=gray','-f','rawvideo','-'],capture_output=True).stdout
a=np.frombuffer(raw,np.uint8).reshape(-1,h,w).astype(np.float32)
d=np.abs(np.diff(a,axis=0)).mean(axis=(1,2))
for thr in (0.05,0.15,0.3):
    still=d<thr; runs=[];c=0
    for s in still:
        if s: c+=1
        else:
            if c>=2: runs.append(c)
            c=0
    if c>=2: runs.append(c)
    print(f"thr {thr}: frames<thr {still.mean()*100:.1f}%  runs(>=3 identical frames) {len(runs)}  longest {max(runs) if runs else 0} frames")
