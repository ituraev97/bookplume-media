from PIL import Image, ImageDraw, ImageFont
import os
G={}; exec(open('quiz.py').read(),G)
im=Image.open('vid/public/plates/arch.png').convert('RGB'); W,H=im.size
d=ImageDraw.Draw(im)
fp='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f=ImageFont.truetype(fp,60) if os.path.exists(fp) else ImageFont.load_default(size=60)
for k,boxes in G['arch'].items():
    for b in boxes:
        x0,y0,x1,y1=b[0]*W,b[1]*H,(b[0]+b[2])*W,(b[1]+b[3])*H
        d.rounded_rectangle([x0,y0,x1,y1],radius=18,fill=(255,224,102),outline=(31,42,20),width=6)
        s=max(20,min(int((y1-y0)*0.8),int((x1-x0)*0.8),70)); ff=ImageFont.truetype(fp,s) if os.path.exists(fp) else f
        d.text(((x0+x1)/2,(y0+y1)/2),"?",fill=(31,42,20),font=ff,anchor='mm')
top=int(0.26*H); S=W
im=im.crop((0,top,W,top+S)).resize((1440,1440),Image.LANCZOS)
im.save('vid/public/plates/intro.png')
