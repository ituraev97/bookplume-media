import json
mh=1300; my=520; mw=590*mh/1694; mx=540-mw/2
J=dict(W=1080,H=1920,my=my,mh=mh,t1=290,f1=140,l1="WHAT DOES",t2=440,f2=128,l2="<b>FEMUR</b> MEAN?",
 rx=430,ry=1130,rw=170,rh=260,qx=600,qy=1150,sx=90,sy=1380,sf=78,s="10<br>BONES",out="/home/claude/work/bn/cover.jpg")
print(json.dumps([J]))
