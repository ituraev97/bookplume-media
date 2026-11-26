import asyncio, base64
from playwright.async_api import async_playwright
F="/home/claude/work/vid/node_modules/@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-%s-normal.woff2"
def b64(p): return base64.b64encode(open(p,'rb').read()).decode()
plate=b64('/home/claude/work/plates/circle519.png')
COL=dict(AC="#C9483C",V="#2F6B8F",I="#7B4A9A",P="#D9772B",S="#5C7A2F",C="#B5476B",O="#2A8C82",MH="#8A5A2B",MC="#3558A8",AA="#B8860B")
LET=dict(AC="A",V="V",I="I",P="P",S="S",C="C",O="O",MH="M",MC="M",AA="A")
ORDER=["AC","V","I","P","S","C","O","MH","MC","AA"]
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
def tiles(sz=84,gap=8):
    return '<div style="display:flex;gap:%dpx;justify-content:center">'%gap+''.join(f'<div class="tile" style="width:{sz}px;height:{int(sz*1.4)}px;font-size:{int(sz*.72)}px;background:{COL[k]}">{LET[k]}</div>' for k in ORDER)+'</div>'
def page(n,body,foot="Diagram: Book Plume · Gray's Anatomy (1918), Fig. 519, public domain"):
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
"AC":("AC","Anterior choroidal","C7 · communicating segment",["Crosses the optic tract, supplies the lateral geniculate body","Enters the lateral ventricle: choroid plexus"]),
"V":("V","Vidian artery","C2 · petrous segment",["Runs in the pterygoid canal with the Vidian nerve","Not present in every person"]),
"I":("I","Inferolateral trunk","C4 · cavernous segment",["Some books list the C4 pair as the meningeal and inferior hypophyseal arteries"]),
"P":("P","Posterior communicating","C7 · communicating segment",["Joins the posterior cerebral artery","Links the carotid and basilar systems: circle of Willis"]),
"S":("S","Superior hypophyseal","C6 · ophthalmic segment",["Supplies the infundibulum, median eminence and pars tuberalis"]),
"C":("C","Caroticotympanic","C2 · petrous segment",["Passes through the tympanic cavity (middle ear)"]),
"O":("O","Ophthalmic","C6 · ophthalmic segment",["Passes through the optic canal into the orbit and supplies its contents"]),
"MH":("MH","Meningohypophyseal trunk","C4 · cavernous segment",["Kenhub lists: meningeal artery (dura of the anterior cranial fossa) + inferior hypophyseal (posterior pituitary)"]),
"MC":("MC","Middle cerebral","Terminal branch · C7",["Lateral cortex and insula, via the lateral fissure","Lenticulostriate branches go deep"]),
"AA":("AA","Anterior cerebral","Terminal branch · C7",["Medial surface of the cortex, via the longitudinal fissure","Joins the other side by the anterior communicating artery"]),
}
S=[]
S.append(page(1,f'''<div style="position:absolute;left:70px;right:70px;top:170px;text-align:center"><div style="font-size:98px;font-weight:800;line-height:1">CAROTID<br>BRANCHES</div><div class="ban" style="display:inline-block;margin-top:24px;font-size:62px;font-weight:800">cheat sheet 🧠</div></div>
<div style="position:absolute;left:0;right:0;top:620px">{tiles()}</div>
<div style="position:absolute;left:0;right:0;top:830px;text-align:center;font-size:124px;font-weight:800"><span class="ban">A VIP's</span> COMMA</div>
<div style="position:absolute;left:0;right:0;top:1080px;text-align:center;font-size:46px;font-weight:800;color:#5C7A2F">10 branches of the internal carotid · swipe →</div>'''))
S.append(page(2,blocks([D["AC"],D["V"],D["I"]])))
S.append(page(3,blocks([D["P"],D["S"],D["C"]])))
S.append(page(4,blocks([D["O"],D["MH"]])))
S.append(page(5,blocks([D["MC"],D["AA"]])))
S.append(page(6,f'''<div style="position:absolute;left:70px;right:70px;top:150px;text-align:center"><div style="font-size:92px;font-weight:800;line-height:1">SAVE THIS 📌</div><div style="font-size:42px;font-weight:800;color:#5C7A2F;margin-top:8px">for your next anatomy exam</div></div>
<div style="position:absolute;left:50px;right:50px;top:330px;height:470px;border-radius:34px;background:#F7F6EC;border:4px solid #E4E2CF;overflow:hidden;box-shadow:0 14px 34px rgba(31,42,20,.14)"><img src="data:image/png;base64,{plate}" style="position:absolute;left:0;top:-6px;width:980px"></div>
<div class="card" style="top:830px;height:350px;padding:26px 44px;font-size:34px;font-weight:700;line-height:1.28"><div style="font-size:46px;font-weight:800"><span class="g">A VIP's COMMA</span> = 10 branches</div>
<div style="margin-top:10px"><span class="g">C2:</span> Vidian · Caroticotympanic &nbsp;<span class="g">C4:</span> Inferolateral · Meningohypophyseal</div>
<div><span class="g">C6:</span> Superior hypophyseal · Ophthalmic</div>
<div><span class="g">C7:</span> Anterior choroidal · Posterior communicating</div>
<div><span class="g">Terminal:</span> Middle + Anterior cerebral</div></div>'''))
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
