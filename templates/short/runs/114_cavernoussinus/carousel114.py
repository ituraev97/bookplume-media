import asyncio, base64
from playwright.async_api import async_playwright
F="/home/claude/work/vid/node_modules/@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-%s-normal.woff2"
def b64(p): return base64.b64encode(open(p,'rb').read()).decode()
plate=b64('plate.png')
COL=dict(O="#C9483C",C="#2F6B8F",P="#7B4A9A",A="#D9772B",T="#5C7A2F")
CSS=f"""
@font-face{{font-family:J;font-weight:700;src:url(data:font/woff2;base64,{b64(F%'700')})}}
@font-face{{font-family:J;font-weight:800;src:url(data:font/woff2;base64,{b64(F%'800')})}}
*{{box-sizing:border-box;margin:0}}
body{{width:1080px;height:1350px;background:#F7F6EC;font-family:J,sans-serif;color:#1F2A14;position:relative;overflow:hidden}}
.dots{{position:absolute;inset:0;background-image:radial-gradient(circle,rgba(92,122,47,.13) 2.2px,transparent 2.4px);background-size:54px 54px}}
.top{{position:absolute;left:70px;top:60px;right:70px;display:flex;justify-content:space-between;align-items:center;font-weight:800;font-size:34px}}
.top small{{font-size:26px;color:#5C7A2F;letter-spacing:3px}}
.tile{{display:inline-flex;align-items:center;justify-content:center;border:6px solid #1F2A14;color:#F7F6EC;font-weight:800;border-radius:30px}}
.card{{position:absolute;left:70px;right:70px;background:#1F2A14;color:#F7F6EC;border-radius:48px}}
.ban{{background:#F2D14E;color:#1F2A14;border-radius:22px;padding:2px 14px 6px}}
.g{{color:#B9D27A}}
.foot{{position:absolute;left:70px;right:70px;bottom:44px;font-size:24px;font-weight:700;color:#1F2A14;opacity:.6;display:flex;justify-content:space-between}}
"""
def tiles(sz=150,gap=14):
    return '<div style="display:flex;gap:%dpx;justify-content:center">'%gap+''.join(f'<div class="tile" style="width:{sz}px;height:{int(sz*1.25)}px;font-size:{int(sz*.8)}px;background:{COL[k]}">{l}</div>' for k,l in zip("OCPAT","OCOAT"))+'</div>'
def page(n,body,foot="Gray's Anatomy (1918), Fig. 786 · public domain · Book Plume"):
    return f"<html><head><style>{CSS}</style></head><body><div class='dots'></div><div class='top'><span>Book Plume</span><small>{n} / 6</small></div>{body}<div class='foot'><span>{foot}</span></div></body></html>"
def letter(k,l,title,sub,lines):
    ls=''.join(f'<div style="display:flex;gap:18px;margin-top:26px;font-size:44px;font-weight:700;line-height:1.2"><span class="g" style="font-weight:800">●</span><span>{x}</span></div>' for x in lines)
    return f'''<div class="card" style="top:190px;height:960px;padding:60px 60px">
<div style="display:flex;gap:34px;align-items:center"><div class="tile" style="width:190px;height:230px;font-size:160px;background:{COL[k]};flex:0 0 190px;border-color:#F7F6EC">{l}</div>
<div><div style="font-size:70px;font-weight:800;line-height:1.05">{title}</div><div class="g" style="font-size:38px;font-weight:800;margin-top:12px">{sub}</div></div></div>{ls}</div>'''
def two(a,b):
    def blk(k,l,t,s,lines,top):
        ls='<br>'.join(lines)
        return f'<div style="position:absolute;left:50px;right:50px;top:{top}px;display:flex;gap:30px;align-items:flex-start"><div class="tile" style="width:150px;height:180px;font-size:120px;flex:0 0 150px;background:{COL[k]};border-color:#F7F6EC">{l}</div><div><div style="font-size:54px;font-weight:800;line-height:1.05">{t} <span class="g" style="font-size:36px">{s}</span></div><div style="font-size:36px;font-weight:700;margin-top:14px;line-height:1.25">{ls}</div></div></div>'
    return '<div class="card" style="top:190px;height:960px">'+blk(*a,top=60)+'<div style="position:absolute;left:60px;right:60px;top:480px;height:6px;background:#F7F6EC;opacity:.25;border-radius:3px"></div>'+blk(*b,top=530)+'</div>'
S=[]
S.append(page(1,f'''<div style="position:absolute;left:70px;right:70px;top:170px;text-align:center"><div style="font-size:104px;font-weight:800;line-height:1">CAVERNOUS<br>SINUS</div><div class="ban" style="display:inline-block;margin-top:24px;font-size:66px;font-weight:800">cheat sheet</div></div>
<div style="position:absolute;left:0;right:0;top:600px">{tiles()}</div>
<div style="position:absolute;left:0;right:0;top:850px;text-align:center;font-size:118px;font-weight:800">Oh, <span class="ban">COAT</span></div>
<div style="position:absolute;left:0;right:0;top:1060px;text-align:center;font-size:48px;font-weight:800;color:#5C7A2F">5 main structures · swipe →</div>'''))
S.append(page(2,letter("O","O","Oculomotor nerve","CN III · lateral wall, the highest of the wall nerves",["Moves the eye: superior, medial and inferior rectus + inferior oblique","Lifts the upper eyelid (levator palpebrae superioris)","Parasympathetic fibres: pupil constriction"])))
S.append(page(3,letter("C","C","Internal carotid artery","inside the sinus",["Runs through the sinus itself (cavernous part)","Wrapped in a sympathetic nerve plexus","Neighbour inside the sinus: the abducens nerve"])))
S.append(page(4,letter("P","O","Ophthalmic nerve","V1 · lateral wall, below CN IV",["First division of the trigeminal nerve","Lowest of the three nerves in the lateral wall","Wall order, top to bottom: III, IV, V1"])))
S.append(page(5,two(("A","A","Abducens","CN VI · inside the sinus",["Runs next to the carotid artery","Supplies the lateral rectus: abducts the eye"]),("T","T","Trochlear","CN IV · lateral wall, middle",["Between CN III and V1","Supplies the superior oblique only"]))))
S.append(page(6,f'''<div style="position:absolute;left:70px;right:70px;top:150px;text-align:center"><div style="font-size:92px;font-weight:800;line-height:1">SAVE THIS 📌</div><div style="font-size:42px;font-weight:800;color:#5C7A2F;margin-top:8px">for your next anatomy exam</div></div>
<div style="position:absolute;left:50px;right:50px;top:330px;height:520px;border-radius:34px;background:#F7F6EC;border:4px solid #E4E2CF;overflow:hidden;box-shadow:0 14px 34px rgba(31,42,20,.14)"><img src="data:image/png;base64,{plate}" style="position:absolute;left:0;top:30px;width:980px"></div>
<div class="card" style="top:880px;height:300px;padding:30px 44px;font-size:38px;font-weight:700;line-height:1.3"><div style="font-size:46px;font-weight:800"><span class="g">Oh, COAT</span> = 5 main structures</div>
<div style="margin-top:12px"><span class="g">Wall, top → bottom:</span> O (III) · T (IV) · O (V1)</div>
<div><span class="g">Inside the sinus:</span> C (carotid) · A (CN VI)</div>
<div style="font-size:26px;opacity:.75;margin-top:8px">Maxillary (V2): books differ, some put it just outside the wall.</div></div>'''))
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1080,'height':1350})
        for i,h in enumerate(S,1):
            await pg.set_content(h); await pg.wait_for_timeout(300); await pg.screenshot(path=f's{i}.jpg',type='jpeg',quality=95)
        await b.close()
asyncio.run(main())
from PIL import Image
ims=[Image.open(f's{i}.jpg') for i in range(1,7)]
sh=Image.new('RGB',(540*3,675*2))
for i,im in enumerate(ims): sh.paste(im.resize((540,675)),((i%3)*540,(i//3)*675))
sh.save('/tmp/car.png')
