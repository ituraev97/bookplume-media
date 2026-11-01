import json, re
J=json.load(open('segs.json')); W=json.load(open('words.json'))
NUM={'two':'2','three':'3','four':'4','five':'5','six':'6','seven':'7','eight':'8','nine':'9','ten':'10','twelve':'12','fourteen':'14'}
def core(w): return re.sub(r"[^A-Za-z']","",w)
out=[]; i=0
while i<len(W):
    w=dict(W[i]); b=core(w['w']); low=b.lower()
    prev=core(W[i-1]['w']).lower() if i else ''
    nxt=core(W[i+1]['w']).lower() if i+1<len(W) else ''
    if low=='twenty' and nxt=='seven':
        n=dict(W[i+1]); w['w']=n['w'].replace(core(n['w']),'27'); w['e']=n['e']; out.append(w); i+=2; continue
    if low in NUM: w['w']=w['w'].replace(b,NUM[low])
    elif low=='one' and (prev in ('metacarpal','number','question','numbered','just') or nxt=='to'): w['w']=w['w'].replace(b,'1')
    # merge spelled letters: C M C, P I P, U M, O I D
    if re.fullmatch(r"[A-Z][.,?]?",w['w']) and out and re.fullmatch(r"[A-Z]+",out[-1]['w']) and out[-1].get('L'):
        out[-1]['w']+=w['w']; out[-1]['e']=w['e']; i+=1; continue
    if re.fullmatch(r"[A-Z]",w['w']) and w['w'] not in ('A','I') or (w['w'] in('I','A') and prev in ('p','d','o')): w['L']=1
    out.append(w); i+=1
for x in out: x['w']=x['w'].replace("ULNA","ulna")
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
