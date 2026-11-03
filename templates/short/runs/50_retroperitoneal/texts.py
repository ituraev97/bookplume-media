import json
TEXT = """Can you name the retroperitoneal organs? One word gets you all of them: SAD PUCKER.

S – Suprarenal (adrenal) glands
A – Aorta + IVC
D – Duodenum
P – Pancreas
U – Ureters
C – Colon (ascending + descending)
K – Kidneys
E – Esophagus
R – Rectum

2 catches: the tail of the pancreas and the first part of the duodenum (duodenal cap) are NOT retroperitoneal.
Quick test: is the stomach retroperitoneal? Answer in the video.

Save this for your next anatomy exam.
Study with: Anatomy Flash Cards – Visual Learning Set → bookplume.com
Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume

#anatomy #retroperitoneal #abdomen #nursingschool #nursingstudent #medstudent #studytips #anatomyflashcards #anatomyandphysiology #bookplume"""
YT = "Retroperitoneal Organs Mnemonic: SAD PUCKER (Anatomy Exam Trick) #shorts"
TT = "Retroperitoneal organs in one word: SAD PUCKER 🧠"
PIN_V = "Retroperitoneal Organs Mnemonic SAD PUCKER | Anatomy Flashcards & Nursing School Tips"
PIN_S = "SAD PUCKER Cheat Sheet: Retroperitoneal Organs | Anatomy Flashcards for Nursing School"
PIN_DESC_V = "Retroperitoneal organs mnemonic for anatomy exams: SAD PUCKER = suprarenal (adrenal) glands, aorta + IVC, duodenum, pancreas, ureters, ascending + descending colon, kidneys, esophagus, rectum. Catches: the tail of the pancreas and the first part of the duodenum are not retroperitoneal. Nursing school and med school study tip. Images: Gray's Anatomy (1918), public domain. #anatomy #nursingschool #studytips"
PIN_DESC_S = "Retroperitoneal organs cheat sheet: SAD PUCKER = suprarenal glands, aorta/IVC, duodenum, pancreas, ureters, colon (ascending + descending), kidneys, esophagus, rectum. The stomach is intraperitoneal. Save for your next anatomy exam. Images: Gray's Anatomy (1918), public domain. #anatomy #nursingschool #medstudent #studytips"
for n,v,lim in [("YT",YT,95),("TT",TT,90),("PIN_V",PIN_V,90),("PIN_S",PIN_S,90),("PIN_DESC_V",PIN_DESC_V,480),("PIN_DESC_S",PIN_DESC_S,480)]:
    print(n,len(v)); assert len(v)<=lim,n
json.dump(dict(TEXT=TEXT,YT=YT,TT=TT,PIN_V=PIN_V,PIN_S=PIN_S,PIN_DESC_V=PIN_DESC_V,PIN_DESC_S=PIN_DESC_S),open('texts.json','w'),ensure_ascii=False,indent=1)
