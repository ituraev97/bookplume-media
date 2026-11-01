import json, re
J=json.load(open('segs.json')); W=json.load(open('words.json'))
NUM={'two':'2','three':'3','four':'4','five':'5','ten':'10'}
def core(w): return re.sub(r"[^A-Za-z']","",w)
out=[]; i=0
for i in range(len(W)):
    w=dict(W[i]); b=core(w['w']); low=b.lower()
    prev=core(W[i-1]['w']).lower() if i else ''
    nxt=core(W[i+1]['w']) if i+1<len(W) else ''
    if low in NUM and b==b.lower(): w['w']=w['w'].replace(b,NUM[low])
    elif low=='one' and prev in ('question','number'): w['w']=w['w'].replace(b,'1')
    single=re.fullmatch(r"[A-Z][.,?]?",w['w']) is not None
    isletter = single and (b!='A' or re.fullmatch(r"[A-Z]",nxt) is not None or (out and out[-1].get('L')))
    if isletter and out and out[-1].get('L') and re.fullmatch(r"[A-Z]+",out[-1]['w']):
        out[-1]['w']+=w['w']; out[-1]['e']=w['e']; continue
    if isletter and re.fullmatch(r"[A-Z]",nxt or '-') : w['L']=1
    out.append(w)
open('vid/src/words.ts','w').write('export const WORDS = '+json.dumps([{'w':x['w'],'s':x['s'],'e':x['e']} for x in out])+';\n')
segs=J['segs']; cues=[]; wi=0
for s in segs:
    n=len(s['text'].split()); ws=W[wi:wi+n]; wi+=n
    cues.append({'s':round(s['s'],2),'e':round(s['e'],2),'t':[re.sub(r"[^a-z0-9']","",x['w'].lower()) for x in ws],'w':[x['s'] for x in ws]})
assert wi==len(W),(wi,len(W))
open('vid/src/cues.ts','w').write('export const SEG: {s:number;e:number;t:string[];w:number[]}[] = '+json.dumps(cues)+';\n')
END=round(J['dur']+0.8,2)
open('vid/src/timeline.ts','w').write('export const CHAPTERS = '+json.dumps(J['chapters'])+';\nexport const END = '+str(END)+';\n')
print('END',END)
print(' '.join(x['w'] for x in out if re.search(r'[0-9]|[A-Z]{2}',x['w'])))
