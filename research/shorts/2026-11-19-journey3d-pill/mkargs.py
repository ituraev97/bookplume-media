import json
ex=json.load(open('/home/claude/bookplume-media/templates/r3d/examples/digestion/args3d.json'))
wp=ex['cfg']['wp']
wp.update({
 "aortaLow":{"p":[0.0,0.185,0.036]},
 "aortaRen":{"p":[0.0,0.296,0.026]},
 "aoTop":{"mesh":15,"sel":[["y","max",0.006]]},
 "renR":{"p":[-0.033,0.296,0.014]},
 "kidR":{"mesh":9,"sel":[]},
 "kidL":{"mesh":3,"sel":[]},
 "pelR":{"p":[-0.044,0.285,0.011]},
 "pelL":{"p":[0.044,0.29,0.011]},
 "ureR":{"p":[-0.036,0.239,0.012]},
 "ureL":{"p":[0.036,0.241,0.012]},
 "siEnd":{"mesh":7,"sel":[],"zfrac":0.3},
 "livC":{"mesh":14,"sel":[],"zfrac":0.55},
})
G={"15":0.04,"16":0.04,"17":0.04,"8":0.04}
K={"4":0.07,"7":0.07,"6":0.08,"14":0.1,"11":0.08,"5":0.1,"10":0.1,"1":0.1,"8":0.25}
stages=[
 {"key":"stomach","label":"STOMACH","t0":2.39,"t1":7.6,"light":[6],"focus":[6],"ghost":{"14":0.35,**G},
  "move":{"type":"path","pts":["esoTop","stomC"],"a":2.5,"b":3.6}},
 {"key":"small","label":"SMALL INT.","t0":7.6,"t1":14.2,"light":[7,11],"focus":[7,11],"ghost":{"14":0.35,**G},
  "move":{"type":"path","pts":["stomC","dTop","dLeft","dBot","@si","siEnd"],"a":7.65,"b":13.9,"ease":"linear"}},
 {"key":"liver","label":"LIVER","t0":14.2,"t1":22.9,"light":[14],"focus":[14],"ghost":{"4":0.15,"7":0.15,"6":0.2,**G},
  "move":{"type":"path","pts":["siEnd","livC"],"a":14.3,"b":15.9}},
 {"key":"blood","label":"BLOOD","t0":22.9,"t1":25.75,"light":[15],"focus":[15],"ghost":dict(K),
  "move":{"type":"path","pts":["livC","aoTop","aortaRen"],"a":22.95,"b":25.0}},
 {"key":"kid","label":"KIDNEYS","t0":25.75,"t1":32.4,"light":[15,16,17],"focus":[3,9,16],"zoom":1.05,"ghost":dict(K),
  "lightAt":[{"t":26.3,"meshes":[3,9]}],
  "move":{"type":"path","pts":["aortaRen","renR","kidR"],"a":25.8,"b":27.2}},
 {"key":"ure","label":"URETERS","t0":32.4,"t1":36.4,"light":[8],"focus":[8,3,9],"zoom":1.0,
  "ghost":{**K,"3":0.45,"9":0.45,"8":1,"15":0.12,"16":0.12,"17":0.12},
  "move":{"type":"path","pts":["kidR","pelR","ureR"],"a":32.5,"b":35.2}},
]
stages[-1]["ghost"].pop("8")
parts=[
 {"from":"aortaRen","to":"kidL","t0":26.3,"t1":32.3,"color":"#8FD3FF","n":12},
 {"from":"pelL","to":"ureL","t0":32.9,"t1":36.3,"color":"#FFE680","n":10},
]
chips=[
 {"txt":"STOMACH","kind":"n","t0":2.6,"t1":7.55},
 {"txt":"acid: <em>pH 1.5–3.5</em>","kind":"f","t0":3.9,"t1":7.55},
 {"txt":"SMALL INTESTINE","kind":"n","t0":7.8,"t1":14.15},
 {"txt":"most drugs <em>absorbed here</em>","kind":"f","t0":9.3,"t1":14.15},
 {"txt":"LIVER","kind":"n","t0":14.4,"t1":22.85},
 {"txt":"gut wall + liver break some down","kind":"f","t0":16.45,"t1":20.95},
 {"txt":"the <em>first-pass effect</em>","kind":"f","t0":21.05,"t1":22.85},
 {"txt":"BLOODSTREAM","kind":"n","t0":23.0,"t1":25.7},
 {"txt":"via the heart → your whole body","kind":"f","t0":23.4,"t1":25.7},
 {"txt":"KIDNEYS","kind":"n","t0":25.9,"t1":32.35},
 {"txt":"filter <em>≈ 150 quarts</em> a day","kind":"f","t0":27.5,"t1":32.35},
 {"txt":"⏱ ≈ 1 million filters per kidney","kind":"t","t0":29.9,"t1":32.35},
 {"txt":"URETERS","kind":"n","t0":32.55,"t1":36.35},
 {"txt":"most drugs leave in <em>urine</em>","kind":"f","t0":33.3,"t1":36.35},
]
cfg={"title":["WHAT HAPPENS TO A","<b>PILL</b> YOU SWALLOW?"],"credit":"3D: Digestive System by Focus Medica (Sketchfab, CC BY 4.0)",
 "hide":[0,2,12,13,18],"wp":wp,"meander":ex['cfg']['meander'],"stages":stages,"particles":parts,"chips":chips,
 "final":36.4,"tEnd0":36.5,"endA":"Save this","endB":"for your next pharmacology exam 📌"}
json.dump({"model":"/models/dig_lokesh/model.glb","cfg":cfg},open('args3d.json','w'),indent=1,ensure_ascii=False)
print("ok")
