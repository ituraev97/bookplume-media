import numpy as np, soundfile as sf, json, subprocess
from kokoro_onnx import Kokoro
k=Kokoro("m/kokoro-v1.0.onnx","m/voices-v1.0.bin")
S=[("Why do you get goosebumps?",0.35),
("Every hair on your body has its own tiny muscle.",0.2),("It's called the arrector pili.",0.35),
("When you're cold,",0.1),("or scared,",0.15),("your nerves tell those muscles to pull.",0.2),("The hair stands up,",0.1),("and the skin around it bumps up.",0.2),("That's a goosebump.",0.4),
("For a furry animal, this is genius.",0.2),("Raised fur traps a thick layer of warm air.",0.2),("A frightened cat puffs up,",0.1),("and looks bigger.",0.35),
("But you don't have much fur left.",0.2),("So for you, it does almost nothing.",0.2),("A leftover from your hairy ancestors.",0.4),
("And yet, you also get them from music.",0.15),("From a movie scene.",0.1),("From a moving speech.",0.2),("Same nerves.",0.1),("Same muscles.",0.45),
("But that's not even the strangest part.",0.6),
("In twenty twenty, Harvard scientists found that the nerve behind goosebumps,",0.1),("also talks to the stem cells that grow hair.",0.3),
("In mice, that nerve and muscle help wake up hair growth.",0.35),
("Goosebumps may be more than a fossil.",0.15),("They may be a hair growth switch.",0.45),
("Follow Book Plume for more body facts you didn't know you needed.",0.3)]
sr=24000; out=[]; segs=[]; t=0
for txt,p in S:
    a,_=k.create(txt,voice="am_michael",speed=1.15,lang="en-us")
    nz=np.where(np.abs(a)>0.01)[0]; a=a[max(0,nz[0]-240):nz[-1]+700]
    sf.write("/tmp/s.wav",a,sr); subprocess.run(["ffmpeg","-y","-loglevel","error","-i","/tmp/s.wav","-af","atempo=1.08","/tmp/s2.wav"])
    a,_=sf.read("/tmp/s2.wav")
    segs.append({"text":txt,"s":t,"e":t+len(a)/sr}); out.append(a); t+=len(a)/sr
    out.append(np.zeros(int(p*sr))); t+=p
y=np.concatenate(out); y=y/np.abs(y).max()*0.9
sf.write("vo11_raw.wav",y,sr); json.dump(segs,open("segs11.json","w"),indent=1); print(t)
