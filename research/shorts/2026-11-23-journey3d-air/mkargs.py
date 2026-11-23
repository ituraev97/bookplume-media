import json
seg=json.load(open('/home/claude/work/ep/segs.json')); S=lambda i:seg[i]['s']; E=lambda i:seg[i]['e']
TREE=[2,3,4,6,7,8]
END=round(E(12)+1.05,2); tEnd0=round(E(12)+0.1,2); final=round(S(12)-0.15,2)
st=[
 dict(key="tr",label="TRACHEA",t0=S(1),t1=S(3),light=[5],focus=[5],zoom=1.25,dy=-0.25,ghost={"0":0.12,"1":0.12},
      move=dict(type="path",pts=["trTop","trMid","carina"],a=S(1)+0.3,b=S(3)-0.3)),
 dict(key="br",label="BRONCHI",t0=S(3),t1=S(6),light=[5],focus=[5],zoom=1.15,ghost={"0":0.12,"1":0.12},
      move=dict(type="path",pts=["carina","rBr"],a=S(3)+0.2,b=S(4)+0.6)),
 dict(key="tree",label="BRANCHES",t0=S(6),t1=S(7),light=TREE,focus=[0,1],ghost={"0":0.14,"1":0.14,"5":0.5},
      move=dict(type="path",pts=["rBr","rMid","rDeep"],a=S(6)+0.1,b=E(6)-0.2)),
 dict(key="alv",label="ALVEOLI",t0=S(7),t1=S(8),light=[0,1],focus=[0,1],semi={"0":0.55,"1":0.55},
      move=dict(type="swirl",at="rDeep",r=0.25)),
 dict(key="blood",label="BLOOD",t0=S(8),t1=S(10),light=[0,1],focus=[0,1],semi={"0":0.35,"1":0.35},
      move=dict(type="path",pts=["rDeep","heart"],a=S(9)-0.2,b=S(9)+2.2)),
 dict(key="out",label="OUT",t0=S(10),t1=final,light=[5]+TREE,focus=[0,1],ghost={"0":0.14,"1":0.14},
      move=dict(type="path",pts=["heart","rDeep","rMid","rBr","carina","trMid","trTop"],a=S(10)+0.2,b=E(11)-0.2)),
]
wp={
 "trTop":{"mesh":5,"sel":[["y","max",0.15]]},
 "carina":{"mesh":5,"sel":[["x","abs",0.15],["y","min",0.2]]},
 "trMid":{"lerp":["trTop","carina",0.5]},
 "rBr":{"mesh":5,"sel":[["x","min",0.3]]},
 "lBr":{"mesh":5,"sel":[["x","max",0.3]]},
 "rMid":{"mesh":2,"sel":[]},
 "rDeep":{"mesh":3,"sel":[]},
 "lLung":{"mesh":1,"sel":[]},
 "rLat":{"mesh":0,"sel":[["x","min",0.9]]},
 "lLat":{"mesh":1,"sel":[["x","max",0.9]]},
 "heart":{"p":[0.6,-3.3,0.9]},
}
chips=[
 dict(txt="≈ <em>20,000</em> breaths a day",kind="f",t0=0.4,t1=E(0)+0.2),
 dict(txt="TRACHEA",kind="n",t0=S(1)+0.2,t1=S(3)-0.05),
 dict(txt="16–20 <em>C-shaped</em> cartilage rings",kind="f",t0=S(2),t1=S(3)-0.05),
 dict(txt="MAIN BRONCHI",kind="n",t0=S(3)+0.2,t1=S(6)-0.05),
 dict(txt="right = <em>wider, shorter, steeper</em>",kind="f",t0=S(4),t1=S(6)-0.05),
 dict(txt="adults: objects land <em>right</em>",kind="f",t0=S(5)+0.2,t1=S(6)-0.05),
 dict(txt="BRONCHIAL TREE",kind="n",t0=S(6)+0.2,t1=S(7)-0.05),
 dict(txt="≈ 23 generations (18–30)",kind="f",t0=S(6)+1.6,t1=S(7)-0.05),
 dict(txt="ALVEOLI",kind="n",t0=S(7)+0.2,t1=S(8)-0.05),
 dict(txt="≈ 480 million air sacs",kind="t",t0=S(7)+2.0,t1=S(8)-0.05),
 dict(txt="CAPILLARIES",kind="n",t0=S(8)+0.2,t1=S(10)-0.05),
 dict(txt="O₂ <em>in</em> · CO₂ <em>out</em>",kind="f",t0=S(8)+1.2,t1=S(10)-0.05),
 dict(txt="lungs → <em>left heart</em> → body",kind="f",t0=S(9)+0.2,t1=S(10)-0.05),
 dict(txt="BREATHE OUT",kind="n",t0=S(10)+0.2,t1=final-0.05),
 dict(txt="CO₂ leaves the <em>same tubes</em>",kind="f",t0=S(11)+0.2,t1=final-0.05),
]
particles=[dict(**{"from":"rDeep","to":"heart"},t0=S(8)+0.6,t1=S(10),color="#FF5A5A",n=14),
           dict(**{"from":"lLung","to":"heart"},t0=S(8)+0.6,t1=S(10),color="#FF5A5A",n=14),
           dict(**{"from":"heart","to":"lLung"},t0=S(10),t1=E(10)+0.6,color="#8FB8FF",n=10)]
cfg=dict(title=["WHERE DOES THE AIR","YOU <b>BREATHE</b> GO?"],
 credit="3D: Respiratory System by Vikrama Raghuraman (Sketchfab, CC BY 4.0)",
 hide=[],wp=wp,stages=st,particles=particles,chips=chips,bolusSize=0.13,endSpin=0.15,
 colors=[{"t":0,"color":"#CFEFFF"},{"t":S(8)+0.3,"color":"#FF4D4D"},{"t":S(10)+0.2,"color":"#8FA6D8"}],
 final=final,finalGhost={"0":0.3,"1":0.3},finalLight=[5]+TREE,tEnd0=tEnd0,endA="Save this",endB="for your next physiology exam 📌",
 saveMap=dict(t0=final,title="THE PATH · SAVE THIS 📌",items=[dict(n=1,txt="Trachea",wp="trMid"),dict(n=2,txt="Main bronchi",wp="lBr"),
   dict(n=3,txt="Bronchial tree",wp="rMid"),dict(n=4,txt="Alveoli",wp="lLat"),dict(n=5,txt="Capillaries",wp="rLat")]))
json.dump({"model":"/models/resp_vikrama/model.glb","cfg":cfg},open('/home/claude/work/ep/args3d.json','w'),indent=1)
print(END,tEnd0,final)
