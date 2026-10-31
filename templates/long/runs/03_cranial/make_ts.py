import json, re
J=json.load(open('segs.json')); W=json.load(open('words.json'))
NUM={'one':'1','two':'2','three':'3','four':'4','five':'5','six':'6','seven':'7','eight':'8','nine':'9','ten':'10','eleven':'11','twelve':'12'}
out=[]
i=0
while i<len(W):
    w=dict(W[i]); base=re.sub(r"[^A-Za-z']","",w['w']); low=base.lower()
    prev=re.sub(r"[^A-Za-z]","",W[i-1]['w']) if i else ''
    nxt=re.sub(r"[^A-Za-z]","",W[i+1]['w']).lower() if i+1<len(W) else ''
    if low=='one' and nxt=='of': out.append(w); i+=1; continue
    if low in NUM and not (low=='one' and prev.lower() in ('every','each','single','this')) and prev.lower() not in ('every',):
        if not (low=='one' and prev.lower() in ('','by')) and not w['w'].lower().startswith('one,'):
            pass
        keep_word = (low=='one' and prev.lower() in ('every','each','by','single'))
        if not keep_word and low!='one' or (low=='one' and prev.lower() in ('nerve','v','numeral','nerves','question','number','to')):
            w['w']=w['w'].replace(base,NUM[low]) if base==low else w['w'].replace(base,NUM[low])
    # merge "V 1" -> "V1"
    if out and out[-1]['w']=='V' and re.match(r'^\d',w['w']):
        out[-1]['w']='V'+w['w']; out[-1]['e']=w['e']; i+=1; continue
    out.append(w); i+=1
open('vid/src/words.ts','w').write('export const WORDS = '+json.dumps([{'w':x['w'],'s':x['s'],'e':x['e']} for x in out])+';\n')
# cues: per sentence lowercase tokens + start times
segs=J['segs']; cues=[]; wi=0
for s in segs:
    n=len(s['text'].split()); ws=W[wi:wi+n]; wi+=n
    cues.append({'s':round(s['s'],2),'e':round(s['e'],2),'t':[re.sub(r"[^a-z0-9']","",x['w'].lower()) for x in ws],'w':[x['s'] for x in ws]})
assert wi==len(W),(wi,len(W))
open('vid/src/cues.ts','w').write('export const SEG: {s:number;e:number;t:string[];w:number[]}[] = '+json.dumps(cues)+';\n')
END=round(J['dur']+0.8,2)
open('vid/src/timeline.ts','w').write('export const CHAPTERS = '+json.dumps(J['chapters'])+';\nexport const END = '+str(END)+';\n')
print('END',END,[ (c['title'],c['s']) for c in J['chapters']])
