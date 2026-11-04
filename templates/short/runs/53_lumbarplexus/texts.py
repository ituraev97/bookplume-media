import json
TEXT = """Can you name the 6 nerves of the lumbar plexus? One silly sentence puts them in order, top to bottom: I, I Get Leftovers On Fridays.

I – Iliohypogastric (L1, +T12)
I – Ilioinguinal (L1) – H comes before I, so hypo goes first
G – Genitofemoral (L1–L2)
L – Lateral femoral cutaneous (L2–L3) – skin on the side of the thigh
O – Obturator (L2–L4) – inner thigh
F – Femoral (L2–L4) – the biggest branch, front of the thigh

The plexus forms inside the psoas major from L1–L4 (+T12). Roots bonus: 2 from 1, 2 from 2, 2 from 3.
Quick test: which nerve supplies the adductors of the inner thigh? Answer in the video.

Save this for your next anatomy exam.
Study with: Anatomy Flashcards – 300 Flashcards with Anatomically Precise Drawings → bookplume.com
Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume

#anatomy #lumbarplexus #neuroanatomy #nursingschool #nursingstudent #medstudent #studytips #anatomyflashcards #anatomyandphysiology #bookplume"""
YT = "Lumbar Plexus Mnemonic: 6 Nerves in Order (I, I Get Leftovers On Fridays) #shorts"
TT = "6 lumbar plexus nerves in order: I, I Get Leftovers On Fridays 🧠"
PIN_V = "Lumbar Plexus Mnemonic: 6 Nerves in Order | Anatomy Flashcards & Nursing School Tips"
PIN_S = "I, I Get Leftovers On Fridays: Lumbar Plexus Cheat Sheet | Anatomy Flashcards"
PIN_DESC_V = "Lumbar plexus mnemonic for anatomy exams: I, I Get Leftovers On Fridays = iliohypogastric, ilioinguinal, genitofemoral, lateral femoral cutaneous, obturator, femoral, top to bottom. Formed inside psoas major from L1-L4 (+T12). Obturator = inner thigh adductors, femoral = biggest branch, front of thigh. Nursing and med school study tip. Images: Gray's Anatomy (1918), public domain. #anatomy #nursingschool #studytips"
PIN_DESC_S = "Lumbar plexus cheat sheet: I, I Get Leftovers On Fridays = iliohypogastric, ilioinguinal, genitofemoral, lateral femoral cutaneous, obturator, femoral. Roots: 2 from 1, 2 from 2, 2 from 3. Save for your next anatomy exam. Images: Gray's Anatomy (1918), public domain. #anatomy #nursingschool #medstudent #studytips"
TAGS = ["lumbar plexus","lumbar plexus mnemonic","anatomy mnemonics","neuroanatomy","nursing school","med student","anatomy flashcards","femoral nerve","obturator nerve"]
for n,v,lim in [("YT",YT,95),("TT",TT,90),("PIN_V",PIN_V,90),("PIN_S",PIN_S,90),("PIN_DESC_V",PIN_DESC_V,480),("PIN_DESC_S",PIN_DESC_S,480)]:
    print(n,len(v)); assert len(v)<=lim,n
print("TEXT",len(TEXT)); assert len(TEXT)<=2200
json.dump(dict(TEXT=TEXT,YT=YT,TT=TT,PIN_V=PIN_V,PIN_S=PIN_S,PIN_DESC_V=PIN_DESC_V,PIN_DESC_S=PIN_DESC_S,TAGS=TAGS),open('/home/claude/work/texts.json','w'),ensure_ascii=False,indent=1)
