import asyncio, base64
from playwright.async_api import async_playwright
F="/home/claude/work/vid/node_modules/@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-%s-normal.woff2"
def b64(p): return base64.b64encode(open(p,'rb').read()).decode()
plate=b64('/home/claude/work/vid/public/plates/fem548.png')
COL=dict(DG="#C9483C",PF="#2F6B8F",SE="#7B4A9A",SC="#D9772B",SX="#5C7A2F",DX="#B03A78")
LET=dict(DG="D",PF="P",SE="S",SC="S",SX="S",DX="D")
ORDER=["DG","PF","SE","SC","SX","DX"]
CSS=f"""
@font-face{{font-family:J;font-weight:700;src:url(data:font/woff2;base64,{b64(F%'700')})}}
@font-face{{font-family:J;font-weight:800;src:url(data:font/woff2;base64,{b64(F%'800')})}}
*{{box-sizing:border-box;margin:0}}
body{{width:1080px;height:1350px;background:#F7F6EC;font-family:J,sans-serif;color:#1F2A14;position:relative;overflow:hidden}}
.dots{{position:absolute;inset:0;background-image:radial-gradient(circle,rgba(92,122,47,.13) 2.2px,transparent 2.4px);background-size:54px 54px}}
.top{{position:absolute;left:70px;top:60px;right:70px;display:flex;justify-content:space-between;align-items:center;font-weight:800;font-size:34px}}
.top small{{font-size:26px;color:#5C7A2F;letter-spacing:3px}}
.tile{{display:inline-flex;align-items:center;justify-content:center;border:6px solid #1F2A14;color:#F7F6EC;font-weight:800;border-radius:26px}}
.card{{position:absolute;left:70px;right:70px;background:#1F2A14;color:#F7F6EC;border-radius:48px}}
.ban{{background:#F2D14E;color:#1F2A14;border-radius:22px;padding:2px 14px 6px}}
.g{{color:#B9D27A}}
.foot{{position:absolute;left:70px;right:70px;bottom:44px;font-size:24px;font-weight:700;color:#1F2A14;opacity:.6;display:flex;justify-content:space-between}}
"""
def tiles(sz=110,gap=12):
    return '<div style="display:flex;gap:%dpx;justify-content:center">'%gap+''.join(f'<div class="tile" style="width:{sz}px;height:{int(sz*1.4)}px;font-size:{int(sz*.72)}px;background:{COL[k]}">{LET[k]}</div>' for k in ORDER)+'</div>'
FOOT="Diagram: Book Plume · Gray's Anatomy (1918), Fig. 548, public domain"
def page(n,body,foot=FOOT):
    return f"<html><head><style>{CSS}</style></head><body><div class='dots'></div><div class='top'><span>Book Plume</span><small>{n} / 6</small></div>{body}<div class='foot'><span>{foot}</span></div></body></html>"
def blocks(items):
    n=len(items); h=int(930/n); z=1.25 if n==2 else 1.0
    out=''
    for i,(k,t,s,lines) in enumerate(items):
        ls='<br>'.join(lines)
        out+=f'<div style="position:absolute;left:50px;right:50px;top:{40+i*h}px;display:flex;gap:28px;align-items:flex-start"><div class="tile" style="width:{int(128*z)}px;height:{int(150*z)}px;font-size:{int(100*z)}px;flex:0 0 {int(128*z)}px;background:{COL[k]};border-color:#F7F6EC">{LET[k]}</div><div><div style="font-size:{int(48*z)}px;font-weight:800;line-height:1.05">{t}</div><div class="g" style="font-size:{int(30*z)}px;font-weight:800;margin-top:6px">{s}</div><div style="font-size:{int(31*z)}px;font-weight:700;margin-top:10px;line-height:1.22">{ls}</div></div></div>'
        if i<n-1: out+=f'<div style="position:absolute;left:60px;right:60px;top:{40+(i+1)*h-22}px;height:5px;background:#F7F6EC;opacity:.22;border-radius:3px"></div>'
    return '<div class="card" style="top:170px;height:1010px">'+out+'</div>'
D={
"DG":("DG","Descending genicular","Lowest branch · adductor canal",["Arises just above the adductor opening","Supplies vastus medialis, adductor magnus and skin of the inner thigh"]),
"PF":("PF","Profunda femoris","Largest branch · deep artery of the thigh",["Arises about 3.5 cm below the inguinal ligament","Supplies the muscles that extend, flex and adduct the thigh"]),
"SE":("SE","Superficial epigastric","Femoral triangle · about 1 cm below the ligament",["Runs up over the inguinal ligament toward the navel","Skin, superficial fascia and superficial inguinal nodes"]),
"SC":("SC","Superficial circumflex iliac","Femoral triangle · the smallest branch",["Skin, superficial fascia and superficial inguinal nodes"]),
"SX":("SX","Superficial external pudendal","Femoral triangle",["Lower abdominal skin plus skin of the penis, scrotum or labia"]),
"DX":("DX","Deep external pudendal","Femoral triangle",["Skin of the perineum and of the scrotum or labium majus"]),
}
S=[]
S.append(page(1,f'''<div style="position:absolute;left:70px;right:70px;top:150px;text-align:center"><div style="font-size:92px;font-weight:800;line-height:1">FEMORAL ARTERY<br>BRANCHES</div><div class="ban" style="display:inline-block;margin-top:24px;font-size:62px;font-weight:800">cheat sheet 🧠</div></div>
<div style="position:absolute;left:0;right:0;top:610px">{tiles()}</div>
<div style="position:absolute;left:40px;right:40px;top:830px;text-align:center;font-size:84px;font-weight:800;line-height:1.1"><span class="ban">Do Princesses</span><br>Sew Sweet<br>Superhero Dresses?</div>
<div style="position:absolute;left:0;right:0;top:1160px;text-align:center;font-size:44px;font-weight:800;color:#5C7A2F">6 named branches · swipe →</div>'''))
S.append(page(2,blocks([D["DG"],D["PF"]])))
S.append(page(3,blocks([D["SE"],D["SC"]])))
S.append(page(4,blocks([D["SX"],D["DX"]])))
S.append(page(5,f'''<div class="card" style="top:170px;height:1010px;padding:44px 50px">
<div style="font-size:64px;font-weight:800;line-height:1.05">5 + 1</div>
<div style="font-size:38px;font-weight:800;margin-top:14px;line-height:1.25"><span class="g">Femoral triangle (5):</span> Profunda femoris, Superficial epigastric, Superficial circumflex iliac, Superficial external pudendal, Deep external pudendal</div>
<div style="font-size:38px;font-weight:800;margin-top:22px;line-height:1.25"><span class="g">Adductor canal (1):</span> Descending genicular</div>
<div style="height:5px;background:#F7F6EC;opacity:.22;border-radius:3px;margin:34px 0"></div>
<div style="font-size:50px;font-weight:800;line-height:1.1">Not on the list</div>
<div style="font-size:36px;font-weight:700;margin-top:14px;line-height:1.28">The <span class="g">medial</span> and <span class="g">lateral circumflex femoral</span> arteries and the <span class="g">perforating arteries</span> come off the profunda femoris, not off the femoral artery itself.</div>
</div>'''))
S.append(page(6,f'''<div style="position:absolute;left:70px;right:70px;top:140px;text-align:center"><div style="font-size:92px;font-weight:800;line-height:1">SAVE THIS 📌</div><div style="font-size:42px;font-weight:800;color:#5C7A2F;margin-top:8px">for your next anatomy exam</div></div>
<div style="position:absolute;left:50px;top:330px;width:410px;height:743px;border-radius:34px;background:#F7F6EC;border:4px solid #E4E2CF;overflow:hidden;box-shadow:0 14px 34px rgba(31,42,20,.14)"><img src="data:image/png;base64,{plate}" style="position:absolute;left:0;top:0;width:410px;height:743px"></div>
<div class="card" style="left:490px;top:330px;height:743px;padding:24px 28px;font-size:30px;font-weight:700;line-height:1.25"><div style="font-size:34px;font-weight:800;line-height:1.1"><span class="g">Do Princesses Sew Sweet Superhero Dresses?</span></div>
<div style="margin-top:14px"><span class="g">D</span> Descending genicular</div><div><span class="g">P</span> Profunda femoris</div><div><span class="g">S</span> Superficial epigastric</div><div><span class="g">S</span> Superficial circumflex iliac</div><div><span class="g">S</span> Superficial external pudendal</div><div><span class="g">D</span> Deep external pudendal</div>
<div style="margin-top:14px;font-size:26px;opacity:.85">5 in the femoral triangle, 1 (descending genicular) in the adductor canal</div></div>
<div style="position:absolute;left:50px;right:50px;top:1110px;font-size:30px;font-weight:700;color:#5C7A2F">Mnemonic and branch list: Kenhub, Femoral artery.</div>'''))
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1080,'height':1350})
        for i,h in enumerate(S,1):
            await pg.set_content(h); await pg.wait_for_timeout(400); await pg.screenshot(path=f'/home/claude/work/car_s{i}.jpg',type='jpeg',quality=95)
        await b.close()
asyncio.run(main())
from PIL import Image
ims=[Image.open(f'/home/claude/work/car_s{i}.jpg') for i in range(1,7)]
sh=Image.new('RGB',(540*3,675*2))
for i,im in enumerate(ims): sh.paste(im.resize((540,675)),((i%3)*540,(i//3)*675))
sh.save('/home/claude/work/car_sheet.png')
