import json, re
J=json.load(open('segs.json')); W=json.load(open('words.json'))
U={'one':1,'two':2,'three':3,'five':5,'ten':10}
def core(w): return re.sub(r"[^A-Za-z']","",w)
out=[]
for w in W:
    w=dict(w); b=core(w['w']); low=b.lower()
    if low in U: w['w']=w['w'].replace(b, str(U[low]) if b==low else str(U[low]))
    if b=='Vitamin': w['w']=w['w'].replace('Vitamin','VITamin')
    out.append(w)
open('vid/src/words.ts','w').write('export const WORDS = '+json.dumps([{'w':x['w'],'s':x['s'],'e':x['e']} for x in out])+';\n')
cues=[]; wi=0
for s in J['segs']:
    n=len(s['text'].split()); ws=W[wi:wi+n]; wi+=n
    cues.append({'s':round(s['s'],2),'e':round(s['e'],2),'x':s['text'].lower(),'t':[re.sub(r"[^a-z0-9']","",x['w'].lower()) for x in ws],'w':[x['s'] for x in ws]})
assert wi==len(W)
open('vid/src/cues.ts','w').write('export const SEG: {s:number;e:number;x:string;t:string[];w:number[]}[] = '+json.dumps(cues)+';\n')
END=round(J['dur']+0.8,2)
open('vid/src/timeline.ts','w').write('export const CHAPTERS = '+json.dumps(J['chapters'])+';\nexport const END = '+str(END)+';\n')
print('END',END)
print(' | '.join(x['w'] for x in out if re.search(r'[0-9]',x['w'])))
