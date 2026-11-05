import json
TEXT = """Can you name the 3 branches of the celiac trunk? Remember: Left Hand Side 🩺

The celiac trunk is the first big branch of the abdominal aorta, just below the diaphragm (about T12).
L → Left gastric artery: the smallest, runs along the stomach's lesser curvature
H → Common hepatic artery: heads to the patient's right, to the liver and gallbladder
S → Splenic artery: the biggest, wiggles along the top of the pancreas to the spleen
Together they supply the stomach, liver, spleen, pancreas and the start of the duodenum.

Quick test: which branch is the smallest? Answer in the video.

Save this for your next anatomy exam.
Study with: Anatomy Flash Cards – Visual Learning Set of the Human Body → bookplume.com
Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume

#anatomy #celiactrunk #abdomenanatomy #anatomymnemonics #nursingschool #nursingstudent #medstudent #studytips #anatomyflashcards #bookplume"""
YT = "Celiac Trunk Branches Mnemonic: Left Hand Side | Abdominal Anatomy #shorts"
TT = "Name the 3 branches of the celiac trunk with one easy trick 🩺"
PIN_V = "Celiac Trunk Branches Mnemonic | Anatomy Flashcards & Nursing School Study Tips"
PIN_S = "Celiac Trunk Cheat Sheet: Left Hand Side | Anatomy Flashcards for Nursing School"
PIN_DESC_V = "Abdominal anatomy mnemonic for exams: Left Hand Side = left gastric, common hepatic, splenic. The celiac trunk is the first big branch of the abdominal aorta, just below the diaphragm (about T12). Left gastric is the smallest, splenic the biggest. Images: Gray's Anatomy (1918), public domain. #anatomy #nursingschool #studytips"
PIN_DESC_S = "Celiac trunk cheat sheet: L = left gastric (smallest, lesser curvature of the stomach), H = common hepatic (liver + gallbladder), S = splenic (biggest, along the pancreas to the spleen). Mnemonic: Left Hand Side. Save for your next anatomy exam. Diagram: Book Plume. #anatomy #nursingschool #medstudent #studytips"
TAGS = ["celiac trunk","celiac trunk branches","celiac trunk mnemonic","left hand side mnemonic","abdominal aorta branches","splenic artery","anatomy mnemonics","nursing school","anatomy flashcards"]
THREADS = """Can you name the 3 branches of the celiac trunk? 🩺

Left Hand Side:
L = left gastric (smallest)
H = common hepatic (liver + gallbladder)
S = splenic (biggest, wiggles to the spleen)

Full study set: bookplume.com

Which artery mnemonic saved you on an exam? #anatomy"""
for n,v,lim in [("YT",YT,95),("TT",TT,90),("PIN_V",PIN_V,90),("PIN_S",PIN_S,90),("PIN_DESC_V",PIN_DESC_V,480),("PIN_DESC_S",PIN_DESC_S,480),("THREADS",THREADS,450)]:
    print(n,len(v)); assert len(v)<=lim,n
print("TEXT",len(TEXT)); assert len(TEXT)<=2200
assert YT.endswith(" #shorts") and THREADS.count('#')<=1
json.dump(dict(TEXT=TEXT,YT=YT,TT=TT,PIN_V=PIN_V,PIN_S=PIN_S,PIN_DESC_V=PIN_DESC_V,PIN_DESC_S=PIN_DESC_S,TAGS=TAGS,THREADS=THREADS),open('texts.json','w'),ensure_ascii=False,indent=1)
