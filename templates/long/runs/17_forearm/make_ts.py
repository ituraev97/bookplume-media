import json, re
J=json.load(open('segs.json')); W=json.load(open('words.json'))
U={'two':2,'three':3,'four':4,'five':5,'eight':8,'twelve':12,'twenty':20,'nineteen':19}
def core(w): return re.sub(r"[^A-Za-z']","",w)
out=[]; skip=set()
for i,w in enumerate(W):
    w=dict(w); b=core(w['w']); low=b.lower()
    nxt=core(W[i+1]['w']).lower() if i+1<len(W) else ''
    prv=core(W[i-1]['w']).lower() if i>0 else ''
    if low=='nineteen' and nxt=='eighteen':
        w['w']=w['w'].replace(b,'1918'); w['e']=W[i+1]['e']; skip.add(i+1)
    elif low=='one' and prv not in ('only','the','by','which','that','this') and nxt not in ('by','muscle'):
        w['w']=w['w'].replace(b,'1')
    elif low in U: w['w']=w['w'].replace(b,str(U[low]))
    out.append(w)
disp=[x for i,x in enumerate(out) if i not in skip]
open('vid/src/words.ts','w').write('export const WORDS = '+json.dumps([{'w':x['w'],'s':x['s'],'e':x['e']} for x in disp])+';\n')
cues=[]; wi=0
for s in J['segs']:
    n=len(s['text'].split()); ws=W[wi:wi+n]; wi+=n
    cues.append({'s':round(s['s'],2),'e':round(s['e'],2),'x':s['text'].lower(),'t':[re.sub(r"[^a-z0-9']","",x['w'].lower()) for x in ws],'w':[x['s'] for x in ws]})
assert wi==len(W)
open('vid/src/cues.ts','w').write('export const SEG: {s:number;e:number;x:string;t:string[];w:number[]}[] = '+json.dumps(cues)+';\n')
END=round(J['dur']+0.8,2)
open('vid/src/timeline.ts','w').write('export const CHAPTERS = '+json.dumps(J['chapters'])+';\nexport const END = '+str(END)+';\n')
print('END',END)
print(' | '.join(x['w'] for x in disp if re.search(r'[0-9]',x['w'])))
