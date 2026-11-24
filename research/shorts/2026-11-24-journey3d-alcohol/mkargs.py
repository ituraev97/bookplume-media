import json,re
seg=json.load(open('/home/claude/work/ep/segs.json')); S=lambda i:seg[i]['s']; E=lambda i:seg[i]['e']
ex=json.load(open('/home/claude/bookplume-media/templates/r3d/examples/digestion/args3d.json'))
wp=ex['cfg']['wp']
wp.update({
 "aortaRen":{"p":[0.0,0.296,0.026]},
 "aoTop":{"mesh":15,"sel":[["y","max",0.006]]},
 "renR":{"p":[-0.033,0.296,0.014]},
 "kidR":{"mesh":9,"sel":[]},
 "kidL":{"mesh":3,"sel":[]},
 "siEnd":{"mesh":7,"sel":[],"zfrac":0.3},
 "livC":{"mesh":14,"sel":[],"zfrac":0.55},
 "stomB":{"mesh":6,"sel":[["y","min",0.03]]},
})
G={"15":0.04,"16":0.04,"17":0.04,"8":0.04}
K={"4":0.07,"7":0.07,"6":0.08,"14":0.1,"11":0.08,"5":0.1,"10":0.1,"1":0.1}
B={"4":0.12,"7":0.12,"6":0.15,"14":0.2,"11":0.12,"5":0.15,"10":0.15,"1":0.15,"16":0.3,"17":0.3,"8":0.1}
t=lambda x:round(x,2)
stages=[
 {"key":"stomach","label":"STOMACH","t0":t(S(1)+0.0),"t1":t(S(3)),"light":[6],"focus":[6],"ghost":{"14":0.35,**G},
  "move":{"type":"path","pts":["esoTop","stomC"],"a":t(S(1)+0.1),"b":t(S(1)+1.2)}},
 {"key":"small","label":"SMALL INT.","t0":t(S(3)),"t1":t(S(5)),"light":[7,11],"focus":[7,11],"ghost":{"14":0.35,"6":0.3,**G},
  "move":{"type":"path","pts":["stomC","dTop","dLeft","dBot","@si","siEnd"],"a":t(S(3)+0.1),"b":t(E(4)-0.1),"ease":"linear"}},
 {"key":"liver","label":"LIVER","t0":t(S(5)),"t1":t(S(6)),"light":[14],"focus":[14],"ghost":{"4":0.15,"7":0.15,"6":0.2,**G},
  "move":{"type":"path","pts":["siEnd","livC"],"a":t(S(5)+0.1),"b":t(S(5)+2.0)}},
 {"key":"blood","label":"BLOOD","t0":t(S(6)),"t1":t(S(8)),"light":[15],"focus":[15,14],"ghost":dict(B),
  "move":{"type":"path","pts":["livC","aoTop"],"a":t(S(6)+0.1),"b":t(S(6)+1.8)}},
 {"key":"break","label":"CLEANUP","t0":t(S(8)),"t1":t(S(12)),"light":[14],"focus":[14],"ghost":{"4":0.15,"7":0.15,"6":0.2,**G},
  "move":{"type":"path","pts":["aoTop","livC"],"a":t(S(8)+0.1),"b":t(S(8)+1.6)}},
 {"key":"kid","label":"EXIT","t0":t(S(12)),"t1":t(S(14)-0.15),"light":[3,9],"focus":[3,9,16],"zoom":1.05,"ghost":dict(K),
  "lightAt":[{"t":t(S(13)),"meshes":[8]}],
  "move":{"type":"path","pts":["livC","aortaRen","renR","kidR"],"a":t(S(12)+0.1),"b":t(S(12)+1.8)}},
]
parts=[{"from":"aortaRen","to":"kidL","t0":t(S(12)+0.9),"t1":t(S(13)+1.5),"color":"#FFD23F","n":12}]
colors=[{"t":0,"color":"#F2B84B"},{"t":t(S(6)+0.2),"color":"#FF5A5A"},{"t":t(S(9)),"color":"#F7E27A"},{"t":t(S(12)),"color":"#FFD23F"}]
chips=[
 {"txt":"STOMACH","kind":"n","t0":t(S(1)+0.2),"t1":t(S(3)-0.05)},
 {"txt":"absorbed <em>slowly</em>","kind":"f","t0":t(S(2)),"t1":t(S(3)-0.05)},
 {"txt":"SMALL INTESTINE","kind":"n","t0":t(S(3)+0.2),"t1":t(S(5)-0.05)},
 {"txt":"absorbed <em>faster</em>","kind":"f","t0":t(S(3)+1.2),"t1":t(S(5)-0.05)},
 {"txt":"big surface area","kind":"f","t0":t(S(4)),"t1":t(S(5)-0.05)},
 {"txt":"LIVER","kind":"n","t0":t(S(5)+0.2),"t1":t(S(6)-0.05)},
 {"txt":"via the <em>portal vein</em>","kind":"f","t0":t(S(5)+1.0),"t1":t(S(6)-0.05)},
 {"txt":"BLOODSTREAM","kind":"n","t0":t(S(6)+0.2),"t1":t(S(8)-0.05)},
 {"txt":"spreads through <em>body water</em>","kind":"f","t0":t(S(6)+1.0),"t1":t(S(8)-0.05)},
 {"txt":"⏱ peak ≈ 1 h (empty stomach)","kind":"t","t0":t(S(7)+0.3),"t1":t(S(8)-0.05)},
 {"txt":"LIVER","kind":"n","t0":t(S(8)+0.2),"t1":t(S(12)-0.05)},
 {"txt":"<em>ADH</em> → acetaldehyde","kind":"f","t0":t(S(9)+0.8),"t1":t(S(12)-0.05)},
 {"txt":"<em>ALDH</em> → acetate","kind":"f","t0":t(S(10)+0.2),"t1":t(S(12)-0.05)},
 {"txt":"> 90% broken down here","kind":"t","t0":t(S(11)+0.2),"t1":t(S(12)-0.05)},
 {"txt":"LEAVES UNCHANGED","kind":"n","t0":t(S(12)+0.2),"t1":t(S(14)-0.2)},
 {"txt":"≈ <em>2–5%</em> of the alcohol","kind":"f","t0":t(S(12)+1.2),"t1":t(S(14)-0.2)},
 {"txt":"breath · urine · sweat","kind":"f","t0":t(S(13)),"t1":t(S(14)-0.2)},
]
for c in chips:
    L=len(re.sub('<[^>]+>','',c['txt'])); assert L<=32,(c,L)
final=t(S(14)-0.15); tEnd0=t(E(14)+0.1); END=t(E(14)+1.05)
cfg={"title":["WHERE DOES","<b>ALCOHOL</b> GO?"],"credit":"3D: Digestive System by Focus Medica (Sketchfab, CC BY 4.0)",
 "hide":[0,2,12,13,18],"wp":wp,"meander":ex['cfg']['meander'],"stages":stages,"colors":colors,"particles":parts,"chips":chips,
 "final":final,"tEnd0":tEnd0,"endA":"Save this","endB":"for your next physiology exam 📌","endSpin":0.15,
 "finalGhost":{"15":0.04,"16":0.04,"17":0.04,"8":0.1,"1":0.15,"4":0.2,"5":0.2,"10":0.2,"11":0.5},"finalLight":[6,7,14,3,9],
 "saveMap":{"t0":final,"title":"THE PATH · SAVE THIS 📌","items":[{"n":1,"txt":"Stomach","wp":"stomB"},{"n":2,"txt":"Small intestine","wp":"siEnd"},{"n":3,"txt":"Liver","wp":"livC"},{"n":4,"txt":"Exit routes","wp":"kidL"}]}}
json.dump({"model":"/models/dig_lokesh/model.glb","cfg":cfg},open('/home/claude/work/ep/args3d.json','w'),indent=1,ensure_ascii=False)
print(END,tEnd0,final)
