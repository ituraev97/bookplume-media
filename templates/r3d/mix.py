# usage: python3 mix.py config.json  -> writes cfg["out"] (wav 48k, loudnormed later)
# cfg: {voice, end, out, bpm, music:[[t0,t1,prog,drums,arp,gain_db]], events:[[t,type,gain_db]]}
import json,sys,subprocess,numpy as np,soundfile as sf
from scipy.signal import butter,sosfilt
cfg=json.load(open(sys.argv[1])); SR=44100; END=cfg["end"]; N=int(END*SR); rng=np.random.default_rng(3)
K="/home/claude/bookplume-media/templates/sfx/"
def load(p):
    o=subprocess.run(["ffmpeg","-loglevel","error","-i",p,"-ac","1","-ar",str(SR),"-f","f32le","-"],capture_output=True).stdout
    return np.frombuffer(o,dtype=np.float32).copy()
lp=lambda x,f,o=2: sosfilt(butter(o,f,"low",fs=SR,output="sos"),x)
hp=lambda x,f,o=2: sosfilt(butter(o,f,"high",fs=SR,output="sos"),x)
db=lambda x:10**(x/20)
def place(b,s,t,g=0):
    i=int(t*SR)
    if i>=len(b) or i<0: return
    s=s[:len(b)-i]*db(g); b[i:i+len(s)]+=s
def env(n,a,r):
    e=np.ones(n); na=max(1,int(a*SR)); nr=max(1,int(r*SR)); e[:na]=np.linspace(0,1,na); e[-nr:]*=np.linspace(1,0,nr); return e
NOTE={"C":0,"C#":1,"D":2,"Eb":3,"E":4,"F":5,"F#":6,"G":7,"Ab":8,"A":9,"Bb":10,"B":11}
nhz=lambda pc,o:440*2**((pc+12*(o+1)-69)/12)
PROGS={"A":[("D",1),("Bb",0),("F",0),("C",0)],"B":[("F",0),("C",0),("D",1),("Bb",0)],"M":[("D",1),("D",1),("Bb",0),("A",0)],
 "P":[("A",1),("F",0),("C",0),("G",0)]}
def pad(fr,d):
    n=int(d*SR); t=np.arange(n)/SR; x=np.zeros(n)
    for f in fr:
        for dt in (-0.12,0.12):
            ff=f*2**(dt/12)
            for h,a in ((1,1),(2,.35),(3,.15)): x+=a*np.sin(2*np.pi*ff*h*t+rng.uniform(0,6.28))
    return lp(x,1400)*env(n,min(.6,d/3),min(.8,d/3))/(len(fr)*3)
PL={}
def pl(f,d=1.0):
    k=round(f,2)
    if k not in PL:
        n=int(d*SR); p=int(SR/f); b=rng.uniform(-1,1,p); o=np.zeros(n)
        for i in range(n): o[i]=b[i%p]; b[i%p]=.5*(b[i%p]+b[(i+1)%p])*.996
        PL[k]=lp(o,3500)*np.exp(-np.arange(n)/SR*2.5)
    return PL[k]
def kick():
    n=int(.35*SR); t=np.arange(n)/SR; f=50+70*np.exp(-t*30); return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*9)
def snare():
    n=int(.2*SR); t=np.arange(n)/SR; return (hp(rng.normal(0,1,n),1500)*.5+np.sin(2*np.pi*190*t)*.4)*np.exp(-t*22)
def shk():
    n=int(.08*SR); return hp(rng.normal(0,1,n),6000)*np.exp(-np.arange(n)/SR*60)*.25
KI,SN,SH=kick(),snare(),shk()
bpm=cfg.get("bpm",96); beat=60/bpm; bar=beat*4
music=np.zeros(N)
for t0,t1,prog,drums,arp,g in cfg["music"]:
    t=t0; ci=0; P=PROGS[prog]
    while t<t1-.05:
        r,mn=P[ci%4]; pcs=[(NOTE[r]+i)%12 for i in ([0,3,7] if mn else [0,4,7])]
        d=min(bar,t1-t)
        place(music,pad([nhz(pcs[0],3),nhz(pcs[1],3),nhz(pcs[2],3),nhz(pcs[0],2)],d+.4),t,g)
        if arp:
            for k,pi in enumerate([0,1,2,1,0,2,1,2]):
                tt=t+k*beat/2
                if tt<t1: place(music,pl(nhz(pcs[pi],4+(1 if k in(2,5) else 0)))*.22,tt,g)
        if drums:
            for k in range(4):
                tt=t+k*beat
                if tt>=t1: break
                if k in (0,2) or drums==2: place(music,KI*.4,tt,g)
                if k in (1,3) and drums==2: place(music,SN*.35,tt,g)
                place(music,SH,tt+beat/2,g)
        t+=bar; ci+=1
music[-int(.5*SR):]*=np.linspace(1,0,int(.5*SR))
sfx=np.zeros(N)
def beep(f,d=.09):
    n=int(d*SR); t=np.arange(n)/SR; return np.sin(2*np.pi*f*t)*np.exp(-t*30)*.6
def ding():
    n=int(1.0*SR); t=np.arange(n)/SR; return (np.sin(2*np.pi*1320*t)+.5*np.sin(2*np.pi*1980*t)+.3*np.sin(2*np.pi*2640*t))*np.exp(-t*5)*.35
def whoosh(d=.45):
    n=int(d*SR); x=rng.normal(0,1,n); o=np.zeros(n)
    for i in range(0,n,512): o[i:i+512]=lp(x[i:i+512],300+4000*(i/n))[:len(o[i:i+512])]
    return o*np.sin(np.pi*np.linspace(0,1,n))**2*.5
def pop_():
    n=int(.12*SR); t=np.arange(n)/SR; f=900*np.exp(-t*25)+300; return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*30)*.5
def scribble(d=.5):
    n=int(d*SR); x=hp(rng.normal(0,1,n),2500)*(.5+.5*np.abs(np.sin(np.arange(n)/SR*2*np.pi*9))); return x*env(n,.03,.1)*.25
def boom():
    n=int(1.4*SR); t=np.arange(n)/SR; f=38+90*np.exp(-t*12); return (np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*2.8)+lp(rng.normal(0,1,n),900)*np.exp(-t*8)*.4)*.8
def kfile(n): return load(K+n)
LIB={"tick":lambda:beep(1500,.06),"tock":lambda:beep(1000,.06),"ding":ding,"whoosh":whoosh,"pop":pop_,"scribble":scribble,"boom":boom,
     "click":lambda:kfile("kenney_interface-sounds/click_002.ogg"),"confirm":lambda:kfile("kenney_interface-sounds/confirmation_002.ogg"),
     "select":lambda:kfile("kenney_interface-sounds/select_002.ogg")}
C={}
for t,typ,g in cfg["events"]:
    if typ not in C: C[typ]=LIB[typ]()
    place(sfx,C[typ],t,g)
v,vsr=sf.read(cfg["voice"],dtype="float32")
if v.ndim>1: v=v.mean(1)
if vsr!=SR:
    v=load(cfg["voice"])
v=np.pad(v,(0,max(0,N-len(v))))[:N]
# duck music under voice
envv=np.convolve(np.abs(v),np.ones(int(.15*SR))/int(.15*SR),mode="same"); duck=1-.55*np.clip(envv/ (envv.max()*.25+1e-9),0,1)
mix=v*1.0+music*db(cfg.get("music_db",-17))*duck+sfx*db(cfg.get("sfx_db",-6))
mix/=np.abs(mix).max()*1.05
sf.write(cfg["out"],mix,SR); print("ok",END)
