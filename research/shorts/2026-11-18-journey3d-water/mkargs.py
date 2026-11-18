import json
ex=json.load(open('/home/claude/bookplume-media/templates/r3d/examples/digestion/args3d.json'))
wp=ex['cfg']['wp']
wp.update({
 "aortaLow":{"p":[0.0,0.185,0.036]},
 "aortaRen":{"p":[0.0,0.296,0.026]},
 "renR":{"p":[-0.033,0.296,0.014]},
 "renL":{"p":[0.033,0.298,0.014]},
 "kidR":{"mesh":9,"sel":[]},
 "kidL":{"mesh":3,"sel":[]},
 "pelR":{"p":[-0.044,0.285,0.011]},
 "pelL":{"p":[0.044,0.29,0.011]},
 "ureR":{"p":[-0.036,0.239,0.012]},
 "ureL":{"p":[0.036,0.241,0.012]},
})
G={"15":0.04,"16":0.04,"17":0.04,"8":0.04}
stages=[
 {"key":"stomach","label":"STOMACH","t0":2.0,"t1":5.3,"light":[6],"focus":[6],"ghost":{"14":0.35,**G},
  "move":{"type":"path","pts":["esoTop","stomC"],"a":2.2,"b":3.3}},
 {"key":"small","label":"SMALL INT.","t0":5.3,"t1":10.0,"light":[7,11],"focus":[7,11],"ghost":dict(G),
  "move":{"type":"path","pts":["stomC","dTop","dLeft","dBot","@si","cecum"],"a":5.35,"b":9.9,"ease":"linear"}},
 {"key":"large","label":"LARGE INT.","t0":10.0,"t1":13.25,"light":[4],"focus":[4],"ghost":dict(G),
  "move":{"type":"path","pts":["cecum","hep","trans","spl","desc"],"a":10.0,"b":13.1}},
 {"key":"kid","label":"KIDNEYS","t0":13.25,"t1":23.1,"light":[15,16,17],"focus":[3,9,16],"zoom":1.05,
  "ghost":{"4":0.07,"7":0.07,"6":0.08,"14":0.1,"11":0.08,"5":0.1,"10":0.1,"1":0.1,"8":0.25},
  "lightAt":[{"t":15.6,"meshes":[3,9]}],
  "move":{"type":"path","pts":["desc","aortaLow","aortaRen","renR","kidR"],"a":13.3,"b":16.2}},
 {"key":"ure","label":"URETERS","t0":23.1,"t1":29.6,"light":[8],"focus":[8,3,9],"zoom":1.0,
  "ghost":{"4":0.07,"7":0.07,"6":0.08,"14":0.1,"11":0.08,"5":0.1,"10":0.1,"1":0.1,"3":0.45,"9":0.45,"15":0.12,"16":0.12,"17":0.12},
  "move":{"type":"path","pts":["kidR","pelR","ureR"],"a":23.3,"b":26.2}},
]
parts=[
 {"from":"aortaRen","to":"kidL","t0":15.6,"t1":23.0,"color":"#8FD3FF","n":12},
 {"from":"pelL","to":"ureL","t0":23.6,"t1":29.5,"color":"#FFE680","n":10},
]
chips=[
 {"txt":"STOMACH","kind":"n","t0":2.4,"t1":5.25},
 {"txt":"very little absorbed here","kind":"f","t0":3.58,"t1":5.25},
 {"txt":"SMALL INTESTINE","kind":"n","t0":5.5,"t1":9.95},
 {"txt":"absorbs <em>≈ 90%</em> of the water","kind":"f","t0":6.93,"t1":9.95},
 {"txt":"LARGE INTESTINE","kind":"n","t0":10.2,"t1":13.2},
 {"txt":"takes most of the rest","kind":"f","t0":10.9,"t1":13.2},
 {"txt":"INTO THE BLOOD","kind":"n","t0":13.4,"t1":15.55},
 {"txt":"KIDNEYS","kind":"n","t0":15.6,"t1":23.05},
 {"txt":"filter <em>≈ 150 quarts</em> a day","kind":"f","t0":17.35,"t1":23.05},
 {"txt":"⏱ only 1–2 quarts → urine","kind":"t","t0":20.98,"t1":23.05},
 {"txt":"URETERS","kind":"n","t0":23.3,"t1":29.55},
 {"txt":"kidneys → <em>bladder</em>","kind":"f","t0":24.4,"t1":29.55},
 {"txt":"⏱ bladder holds 1.5–2 cups","kind":"t","t0":26.74,"t1":29.55},
]
cfg={"title":["WHERE DOES THE","<b>WATER</b> YOU DRINK GO?"],"credit":"3D: Digestive System by Focus Medica (Sketchfab, CC BY 4.0)",
 "hide":[0,2,12,13,18],"wp":wp,"meander":ex['cfg']['meander'],"stages":stages,"particles":parts,"chips":chips,
 "final":29.6,"tEnd0":29.75,"endA":"Save this","endB":"for your next anatomy exam 📌"}
json.dump({"model":"/models/dig_lokesh/model.glb","cfg":cfg},open('args3d.json','w'),indent=1,ensure_ascii=False)
