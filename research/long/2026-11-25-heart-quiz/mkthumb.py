import re, subprocess, sys, json
vid='/home/claude/work/vid'
def setthumb(d):
    s=open(f'{vid}/src/quizdata.ts').read()
    new=' "thumb": '+json.dumps(d,indent=1).replace('\n','\n ')+',\n'
    s=re.sub(r' "thumb": \{.*?\n \},\n',new,s,flags=re.S)
    open(f'{vid}/src/quizdata.ts','w').write(s)
V={'A':dict(big="NAME THIS PART?",sub="HEART ANATOMY QUIZ",q=8,zoom=1.6,hl=2,bg="yellow"),
   'B':dict(big="ALL 27?",sub="HEART ANATOMY QUIZ",q=8,zoom=1.6,hl=1,bg="yellow"),
   'C':dict(big="NAME THIS PART?",sub="HEART ANATOMY QUIZ",q=8,zoom=1.6,hl=2,bg="blue")}
for k in sys.argv[1:]:
    setthumb(V[k])
    subprocess.run(['nice','-n','5','node','thumb.mjs',f'../thumb_{k}.png'],cwd=vid,check=True)
