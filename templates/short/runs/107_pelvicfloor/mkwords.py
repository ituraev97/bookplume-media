import json,re
M={"aini.":"ani.","pubo-rec-tay-lis:":"Puborectalis:","pubo-rec-tay-lis.":"Puborectalis.","pubo-rec-tay-lis,":"Puborectalis,","pubo-cocksidgius:":"Pubococcygeus:","pubo-cocksidgius,":"Pubococcygeus,","ilio-coxidgius:":"Iliococcygeus:","ilio-coxidgius.":"Iliococcygeus.","coxidgius":"coccygeus"}
N={"three":"3","three.":"3.","two.":"2.","one.":"1.","four":"4"}
def conv(f,cd):
  W=json.load(open(f)); out=[]
  for i,w in enumerate(W):
    k=w["w"].lower(); x=M.get(k,w["w"])
    if k in N and (k in("three","four") or cd): x=N[k]
    out.append({"w":x,"s":w["s"],"e":w["e"]})
  return out
W=conv("r107/words.json",True); T=conv("r107/tt_words.json",False)
# don't turn "three" in "Name this muscle in three seconds" - fine as 3
open("vid/src/words107.ts","w").write("export const WORDS = "+json.dumps(W)+";\nexport const TT_WORDS = "+json.dumps(T)+";\n")
print(" ".join(w["w"] for w in W)); print(" ".join(w["w"] for w in T))
