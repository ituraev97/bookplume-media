import numpy as np, soundfile as sf, subprocess, json
from scipy.signal import butter, sosfilt
SR=44100
J=json.load(open('/home/claude/work/segs.json'))
END=round(J['dur']+0.8,2); N=int(END*SR)
rng=np.random.default_rng(11)
K="/home/claude/bookplume-media/templates/sfx/"
def load(p):
    out=subprocess.run(["ffmpeg","-loglevel","error","-i",p,"-ac","1","-ar",str(SR),"-f","f32le","-"],capture_output=True).stdout
    return np.frombuffer(out,dtype=np.float32).copy()
def lp(x,f,o=2): return sosfilt(butter(o,f,"low",fs=SR,output="sos"),x)
def hp(x,f,o=2): return sosfilt(butter(o,f,"high",fs=SR,output="sos"),x)
def db(x): return 10**(x/20)
def place(buf,snd,t,g=0.0):
    i=int(t*SR)
    if i>=len(buf) or i<0: return
    s=snd[:len(buf)-i]*db(g); buf[i:i+len(s)]+=s
def env_ar(n,a,r):
    e=np.ones(n); na=int(a*SR); nr=int(r*SR); e[:na]=np.linspace(0,1,na); e[-nr:]*=np.linspace(1,0,nr); return e
voice,vsr=sf.read("/home/claude/work/voice_final.wav",dtype="float32"); assert vsr==SR
voice=np.pad(voice,(0,max(0,N-len(voice))))[:N]
BPM=84; beat=60/BPM; bar=beat*4
NOTE={"C":0,"C#":1,"D":2,"Eb":3,"E":4,"F":5,"F#":6,"G":7,"Ab":8,"A":9,"Bb":10,"B":11}
def chord(root,minor): r=NOTE[root]; return [(r+i)%12 for i in ([0,3,7] if minor else [0,4,7])]
def nhz(pc,o): return 440*2**((pc+12*(o+1)-69)/12)
PROG_A=[("C",False),("A",True),("F",False),("G",False)]
PROG_B=[("F",False),("C",False),("A",True),("G",False)]
PROG_Q=[("A",True),("F",False),("C",False),("G",False)]
def pad_tone(fr,dur):
    n=int(dur*SR); t=np.arange(n)/SR; x=np.zeros(n)
    for f in fr:
        for det in (-0.1,0.1):
            ff=f*2**(det/12)
            for h,a in ((1,1),(2,0.3),(3,0.12)): x+=a*np.sin(2*np.pi*ff*h*t+rng.uniform(0,6.28))
    x=lp(x,1200); return x*env_ar(n,min(0.8,dur/3),min(1.0,dur/3))/(len(fr)*3)
def pluck(f,dur=1.4):
    n=int(dur*SR); p=int(SR/f); b=rng.uniform(-1,1,p); out=np.zeros(n)
    for i in range(n): out[i]=b[i%p]; b[i%p]=0.5*(b[i%p]+b[(i+1)%p])*0.996
    return lp(out,3000)*np.exp(-np.arange(n)/SR*2.2)
PL={}
def pl(f):
    k=round(f,2)
    if k not in PL: PL[k]=pluck(f)
    return PL[k]
music=np.zeros(N)
def section(t0,t1,prog,arpg=0.5):
    t=t0; ci=0
    while t<t1-0.05:
        root,minor=prog[ci%len(prog)]; pcs=chord(root,minor); dur=min(bar,t1-t)
        place(music,pad_tone([nhz(pcs[0],3),nhz(pcs[1],3),nhz(pcs[2],3),nhz(pcs[0],2)],dur+0.5),t)
        pat=[0,1,2,1,0,2,1,2]
        for k in range(8):
            tt=t+k*beat/2
            if tt>=t1: break
            if k%2==0 or k in (3,):
                place(music,pl(nhz(pcs[pat[k]],4+(1 if k in (2,5) else 0)))*0.2*arpg,tt)
        t+=bar; ci+=1
ch=[c['s'] for c in J['chapters']]+[END]
for i in range(len(ch)-1):
    prog=PROG_Q if i==8 else (PROG_A if i%2==0 else PROG_B)
    section(ch[i] if i else 0.0, ch[i+1], prog, 0.45 if i==8 else 0.5)
music[-int(2*SR):]*=np.linspace(1,0,int(2*SR))
sfx=np.zeros(N)
def whoosh(dur=0.5,up=True):
    n=int(dur*SR); x=rng.normal(0,1,n); out=np.zeros(n); seg=512
    for i in range(0,n,seg):
        k=i/n; fc=300+4000*(k if up else 1-k); out[i:i+seg]=lp(x[i:i+seg],fc)[:len(out[i:i+seg])]
    return out*np.sin(np.pi*np.linspace(0,1,n))**2*0.5
S={k:load(K+v) for k,v in {"tick":"kenney_interface-sounds/tick_002.ogg","pop":"kenney_interface-sounds/drop_002.ogg","ding":"kenney_interface-sounds/confirmation_002.ogg","question":"kenney_interface-sounds/question_001.ogg","maximize":"kenney_interface-sounds/maximize_003.ogg","select":"kenney_interface-sounds/select_002.ogg","pluck":"kenney_interface-sounds/pluck_001.ogg"}.items()}
W,WD=whoosh(0.5),whoosh(0.6,False)
place(sfx,S["ding"],0.3,-9)
for c in J['chapters'][1:]:
    s=c['s']; place(sfx,W,s-0.2,-6); place(sfx,S["maximize"],s,-10); place(sfx,WD,s+2.2,-10)
segs=J['segs']
quizQ=[106,108,110,112,114]
chst=set(round(c['s'],2) for c in J['chapters'])
for i,sg in enumerate(segs):
    if 105<=i<=115: continue
    if any(abs(sg['s']-c)<0.8 for c in chst): continue
    place(sfx,S["pop"],sg['s']+0.02,-16)
for q in quizQ:
    a=segs[q]; ans=segs[q+1]
    place(sfx,S["question"],a['s'],-11)
    for k in range(3): place(sfx,S["tick"],a['e']+0.2+k,-7)
    place(sfx,S["ding"],ans['s'],-8)
    music[int((a['e']+0.1)*SR):int(ans['s']*SR)]*=0.55
# mnemonic plucks: hand trick (98), 1-2-2-1 (55, 63, 99), 4-4-1-1 (53)
cues=json.load(open('/home/claude/work/words.json'))
def segw(k):
    wi=sum(len(x['text'].split()) for x in segs[:k]); return cues[wi:wi+len(segs[k]['text'].split())]
import re as _re
for k,keys in ((98,{'thumb','index','middle','ring','little'}),(55,{'one','two'}),(63,{'one','two'}),(99,{'one','two'}),(53,{'four','one'})):
    for w in segw(k):
        if _re.sub(r"[^a-z]","",w['w'].lower()) in keys: place(sfx,S["pluck"],w['s'],-15)
# duck music under voice
env=np.abs(voice); env=lp(env,4)*3; env=np.clip(env/ (env.max()+1e-9)*4,0,1)
duck=1-0.45*env
mix=voice*1.0+music*db(-21)*duck+sfx*0.8
mix=mix/np.abs(mix).max()*0.95
sf.write('/home/claude/work/mix_pre.wav',mix.astype(np.float32),SR)
print('END',END)
