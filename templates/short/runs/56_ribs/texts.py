import json
TEXT = """How many of your ribs actually reach your breastbone? Remember 3 numbers: 7, 3, 2. 🦴

You have 12 pairs of ribs, and every one joins a thoracic vertebra at the back.
7 TRUE ribs (1–7) → attach straight to the sternum by their own costal cartilage
3 FALSE ribs (8–10) → join the cartilage of the rib above, so they reach the sternum only indirectly
2 FLOATING ribs (11–12) → don't reach the front at all
Technically floating ribs count as false too, so false = ribs 8–12.

Quick test: rib 9 — true, false or floating? Answer in the video.

Save this for your next anatomy exam.
Study with: Anatomy Flash Cards – Visual Learning Set of the Human Body → bookplume.com
Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume

#anatomy #ribs #ribcage #skeletalsystem #anatomymnemonics #nursingschool #nursingstudent #medstudent #studytips #anatomyflashcards #bookplume"""
YT = "True vs False vs Floating Ribs: Remember 7-3-2 | Rib Cage Anatomy #shorts"
TT = "How many ribs reach your breastbone? Remember 7, 3, 2 🦴"
FB_TITLE = "True, false & floating ribs: 7 · 3 · 2"
PIN_V = "True, False & Floating Ribs (7-3-2) | Anatomy Flashcards & Nursing School Study Tips"
PIN_S = "Rib Cage Cheat Sheet: True, False & Floating Ribs | Anatomy Flashcards Study Tip"
PIN_DESC_V = "Rib cage mnemonic for anatomy exams: 7-3-2. True ribs 1–7 attach directly to the sternum by their own costal cartilage. False ribs 8–10 join the cartilage of the rib above. Floating ribs 11–12 have no front attachment (technically false too: false = 8–12). 12 pairs in total. Images: Gray's Anatomy (1918), public domain. #anatomy #nursingschool #studytips"
PIN_DESC_S = "Ribs cheat sheet: 7 true (1–7, direct to sternum), 3 false (8–10, via the cartilage above), 2 floating (11–12, no front attachment). Floating ribs count as false too. Quick test: rib 9 = false. Save for your next anatomy exam. Diagram: Book Plume. #anatomy #nursingschool #medstudent #studytips"
THREADS = """How many of your ribs actually reach your breastbone? 🦴

Remember 7-3-2:
7 true ribs (1–7) go straight to the sternum. 3 false ribs (8–10) hitch a ride on the cartilage above. 2 floating ribs (11–12) never reach the front.

Full study set: bookplume.com

Quick test: rib 9 — true, false or floating? Answer below 👇 #anatomy"""
TAGS = ["true false floating ribs","rib cage anatomy","ribs mnemonic","floating ribs","costal cartilage","thoracic cage","anatomy mnemonics","nursing school","skeletal system anatomy","anatomy flashcards"]
for n,v,lim in [("YT",YT,95),("TT",TT,90),("PIN_V",PIN_V,90),("PIN_S",PIN_S,90),("PIN_DESC_V",PIN_DESC_V,480),("PIN_DESC_S",PIN_DESC_S,480),("THREADS",THREADS,450)]:
    print(n,len(v)); assert len(v)<=lim,n
print("TEXT",len(TEXT)); assert len(TEXT)<=2200
assert YT.endswith(" #shorts")
json.dump(dict(TEXT=TEXT,YT=YT,TT=TT,FB_TITLE=FB_TITLE,PIN_V=PIN_V,PIN_S=PIN_S,PIN_DESC_V=PIN_DESC_V,PIN_DESC_S=PIN_DESC_S,THREADS=THREADS,TAGS=TAGS),open('/home/claude/work/texts.json','w'),ensure_ascii=False,indent=1)
