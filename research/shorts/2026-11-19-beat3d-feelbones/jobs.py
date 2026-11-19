import json,sys
mh=1300; my=560; mw=590*mh/1694; mx=540-mw/2
J=dict(W=1080,H=1920,my=my,mh=mh,t1=300,f1=150,l1="FEEL YOUR",t2=455,f2=150,l2="<b>BONES?</b>",
 rx=615,ry=915,rw=170,rh=170,qx=800,qy=830,sx=700,sy=1400,sf=84,s="11<br>SPOTS",out="/home/claude/work/cov/cover.jpg")
print(json.dumps([J]))
