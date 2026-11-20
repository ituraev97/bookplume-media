from PIL import Image, ImageDraw, ImageFont
G={}; exec(open('quiz.py').read(),G)
im=Image.open('vid/public/plates/side.png').convert('RGB'); W,H=im.size
d=ImageDraw.Draw(im)
f=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',60) if __import__('os').path.exists('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf') else ImageFont.load_default(size=60)
for k,boxes in G['side'].items():
    for b in boxes:
        x0,y0,x1,y1=b[0]*W,b[1]*H,(b[0]+b[2])*W,(b[1]+b[3])*H
        d.rounded_rectangle([x0,y0,x1,y1],radius=18,fill=(255,224,102),outline=(31,42,20),width=6)
        s=min(int((y1-y0)*0.8),70); ff=f.font_variant(size=s)
        d.text(((x0+x1)/2,(y0+y1)/2),"?",fill=(31,42,20),font=ff,anchor='mm')
S=min(W,H); im.crop((W-S)//2 if W>S else 0,0,0,0) if False else None
im=im.crop(((W-S)//2,(H-S)//2,(W-S)//2+S,(H-S)//2+S)).resize((1440,1440),Image.LANCZOS)
im.save('vid/public/plates/intro.png')
