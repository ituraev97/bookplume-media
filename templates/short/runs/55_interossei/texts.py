import json
TEXT = """Which hand muscles spread your fingers apart? Two little words fix it forever: PAD and DAB. ✋

Between your metacarpal bones sit small muscles called the interossei. 2 sets:
PALMAR interossei (palm side) → PAD = Palmar ADduct: pull your fingers together
DORSAL interossei (back of the hand) → DAB = Dorsal ABduct: spread your fingers apart

Every move is measured from the MIDDLE finger. That's why it has no palmar interosseous, but 2 dorsal ones, one on each side.
Both sets: deep branch of the ulnar nerve.

Quick test: you grip a card between 2 fingers. Which interossei hold it? Answer in the video.

Save this for your next anatomy exam.
Study with: Anatomy Flash Cards – Visual Learning Set of the Human Body → bookplume.com
Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume

#anatomy #handanatomy #interossei #anatomymnemonics #nursingschool #nursingstudent #medstudent #studytips #anatomyflashcards #bookplume"""
YT = "Hand Interossei Mnemonic: PAD DAB (Palmar Adduct, Dorsal Abduct) #shorts"
TT = "Which hand muscles spread your fingers? PAD and DAB ✋"
PIN_V = "PAD DAB Interossei Mnemonic | Anatomy Flashcards & Nursing School Study Tips"
PIN_S = "Hand Interossei Cheat Sheet: PAD DAB Mnemonic | Anatomy Flashcards Study Tip"
PIN_DESC_V = "Hand interossei mnemonic for anatomy exams: PAD = Palmar ADduct (pull fingers together), DAB = Dorsal ABduct (spread fingers apart). All movement is measured from the middle finger: it has no palmar interosseous but 2 dorsal ones. Both sets: deep branch of the ulnar nerve. Nursing school study tip. Images: Gray's Anatomy (1918), public domain. #anatomy #nursingschool #studytips"
PIN_DESC_S = "Interossei cheat sheet: PAD = Palmar ADduct, DAB = Dorsal ABduct. Axis = middle finger; nerve = ulnar (deep branch). Quick test: grip a card between 2 fingers, the palmar interossei hold it. Save for your next anatomy exam. Images: Gray's Anatomy (1918), public domain. #anatomy #nursingschool #medstudent #studytips"
TAGS = ["hand interossei","PAD DAB mnemonic","palmar interossei","dorsal interossei","hand muscles anatomy","anatomy mnemonics","nursing school","upper limb anatomy","anatomy flashcards"]
for n,v,lim in [("YT",YT,95),("TT",TT,90),("PIN_V",PIN_V,90),("PIN_S",PIN_S,90),("PIN_DESC_V",PIN_DESC_V,480),("PIN_DESC_S",PIN_DESC_S,480)]:
    print(n,len(v)); assert len(v)<=lim,n
print("TEXT",len(TEXT)); assert len(TEXT)<=2200
assert YT.endswith(" #shorts")
json.dump(dict(TEXT=TEXT,YT=YT,TT=TT,PIN_V=PIN_V,PIN_S=PIN_S,PIN_DESC_V=PIN_DESC_V,PIN_DESC_S=PIN_DESC_S,TAGS=TAGS),open('/home/claude/work/texts.json','w'),ensure_ascii=False,indent=1)
