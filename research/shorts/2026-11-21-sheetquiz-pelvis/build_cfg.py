import json
s=json.load(open('segs.json'))
labels=[{"box":[0.195,0.09,0.29,0.17]},           #0 Ilium
 {"box":[0.485,0.34,0.535,0.58]},                 #1 Sacrum
 {"box":[0.255,0.44,0.31,0.57]},                  #2 Arcuate line (upper)
 {"box":[0.305,0.56,0.375,0.69]},                 #3 Arcuate line (lower)
 {"box":[0.485,0.62,0.535,0.74]},                 #4 Coccyx
 {"box":[0.315,0.685,0.395,0.745]},               #5 Pubis
 {"box":[0.25,0.855,0.325,0.975]},                #6 Ischium
 {"box":[0.455,0.855,0.565,0.985]},               #7 Pubic arch
 {"box":[0.62,0.70,0.74,0.745]},                  #8 name tag: obturator foramen (blank paper in the right foramen)
 {"box":[0.30,0.80,0.40,0.84],"chipAt":[0.36,0.82]}, #9 name tag: pubic symphysis (blank paper in the left foramen)
 {"box":[0.85,0.88,0.97,0.93],"chipAt":[0.86,0.97]}] #10 name tag: ischium (blank paper right of it)
Q=[(1,[0.13,0.33],0,["Ischium","Ilium","Pubis"],1,"Ilium",1.5,None),
   (2,[0.42,0.52],1,["Coccyx","Lumbar vertebra","Sacrum"],2,"Sacrum",1.6,[-70,-60]),
   (3,[0.64,0.85],8,["Obturator foramen","Acetabulum","Greater sciatic notch"],0,"Obturator foramen",1.7,None),
   (4,[0.50,0.795],9,["Sacroiliac joint","Pubic symphysis","Hip joint"],1,"Pubic symphysis",1.8,None),
   (5,[0.73,0.90],10,["Pubis","Ilium","Ischium"],2,"Ischium",1.7,None)]
qs=[]
for i,(n,pin,lab,opts,a,name,z,b) in enumerate(Q):
  num=s[1+2*i]; ans=s[2+2*i]; nxt=s[3+2*i]
  q=dict(n=n,pin=pin,label=lab,ask="Name this part",opts=opts,a=a,name=name,zoom=z,
    tAsk=0.0 if i==0 else round(num['s'],2),tCount=round(num['e']+0.05,2),tReveal=round(ans['s'],2),tNext=round(nxt['s'],2))
  if b: q['badge']=b
  qs.append(q)
end=round(s[-1]['s'],2); tEnd=round(s[-1]['e']+1.9,2)
json.dump(dict(title="PELVIS QUIZ",sub="Can you get 5/5?",end=end,tEnd=tEnd,plate=dict(src="sq/pelvis241.png",w=1583,h=1245),labels=labels,qs=qs),open('sheetquiz.json','w'),indent=1)
for q in qs: print(q['n'],q['tAsk'],q['tCount'],q['tReveal'],q['tNext'])
print(end,tEnd)
