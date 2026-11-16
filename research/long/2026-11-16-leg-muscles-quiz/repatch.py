# re-apply quiz.py visual fields (pins, zoom, hide, open, labels, options, thumb) to quiz.json/quizdata.ts without re-running TTS
import json
G={}; exec(open('quiz.py').read(),G)
d=json.load(open('quiz.json'))
assert len(d['items'])==len(G['Q'])
for it,q in zip(d['items'],G['Q']):
    for k in ('plate','zoom','pin','hide','open','q','options','a','label','old'):
        if k in q: it[k]=q[k]
        elif k in it: it.pop(k)
d['thumb']=G['THUMB']; d['bands']=G['BANDS']
json.dump(d,open('quiz.json','w'),indent=1)
open('vid/src/quizdata.ts','w').write("export const QZ = "+json.dumps(d,indent=1)+" as const;\n")
# words.ts: merge "20" + "7" -> "27"
W=json.loads(open('vid/src/words.ts').read().split('=',1)[1].rstrip().rstrip(';'))
out=[]
for w in W:
    if out and out[-1]['w'] in ('20',) and w['w'][:1].isdigit() and w['w'][0]!='0' and len(w['w'].rstrip('.,?!'))==1:
        out[-1]['w']='2'+w['w']; out[-1]['e']=w['e']; continue
    out.append(w)
open('vid/src/words.ts','w').write("export const WORDS = "+json.dumps(out)+";\n")
print('words',len(W),'->',len(out), [w['w'] for w in out if w['w'].startswith('2')][:12])
