import json
s=json.load(open('segs.json'))
labels=[{"box":[0.455,0.225,0.575,0.295],"chipAt":[0.5,0.13]},{"box":[0.11,0.30,0.27,0.365]},{"box":[0.025,0.385,0.265,0.485],"chipAt":[0.15,0.44]},
 {"box":[0.205,0.815,0.315,0.875]},{"box":[0.635,0.825,0.975,0.89]},{"box":[0.36,0.905,0.45,0.955],"chipAt":[0.53,0.79]}]
Q=[(1,[0.6,0.15],0,["Spinous process","Vertebral body","Lamina"],1,"Vertebral body",1.5,None),
   (2,[0.49,0.80],5,["Transverse process","Pedicle","Spinous process"],2,"Spinous process",1.6,None),
   (3,[0.615,0.48],2,["Pedicle","Lamina","Costal facet"],0,"Pedicle",1.9,None),
   (4,[0.575,0.665],3,["Transverse process","Lamina","Pedicle"],1,"Lamina",1.9,None),
   (5,[0.645,0.34],1,["Articular process","Transverse process","Costal facet"],2,"Costal facet",1.9,None)]
qs=[]
for i,(n,pin,lab,opts,a,name,z,b) in enumerate(Q):
  num=s[1+2*i]; ans=s[2+2*i]; nxt=s[3+2*i]
  q=dict(n=n,pin=pin,label=lab,ask="Name this part",opts=opts,a=a,name=name,zoom=z,
    tAsk=0.0 if i==0 else round(num['s'],2),tCount=round(num['e']+0.05,2),tReveal=round(ans['s'],2),tNext=round(nxt['s'],2))
  if b: q['badge']=b
  qs.append(q)
end=round(s[-1]['s'],2); tEnd=round(s[-1]['e']+1.9,2)
json.dump(dict(title="VERTEBRA QUIZ",sub="Can you get 5/5?",end=end,tEnd=tEnd,plate=dict(src="sq/vert82.png",w=1585,h=1006),labels=labels,qs=qs),open('sheetquiz.json','w'),indent=1)
for q in qs: print(q['n'],q['tAsk'],q['tCount'],q['tReveal'],q['tNext'])
print(end,tEnd)
