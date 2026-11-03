import json
TEXT = """Can you name the 3 tiny bones inside your ear? One trick puts them in order: Many Ice Skaters.

M – Malleus (Latin: hammer) – its handle is attached to the eardrum
I – Incus (anvil) – in the middle
S – Stapes (stirrup) – its footplate sits in the oval window

From the eardrum inward: M → I → S. The chain passes sound vibrations from the eardrum to the inner ear. The stapes is the smallest bone in the human body.
Quick test: which ossicle is attached to the eardrum? Answer in the video.

Save this for your next anatomy exam.
Study with: Anatomy Flash Cards – Visual Learning Set → bookplume.com
Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume

#anatomy #earanatomy #ossicles #nursingschool #nursingstudent #medstudent #studytips #anatomyflashcards #anatomyandphysiology #bookplume"""
YT = "Ear Ossicles Mnemonic: Malleus, Incus, Stapes in Order (Anatomy Trick) #shorts"
TT = "3 tiny ear bones in order: Many Ice Skaters 🦴"
PIN_V = "Ear Ossicles Mnemonic: Malleus Incus Stapes | Anatomy Flashcards & Nursing School Tips"
PIN_S = "Many Ice Skaters: Ear Ossicles Cheat Sheet | Anatomy Flashcards for Nursing School"
PIN_DESC_V = "Middle ear ossicles mnemonic for anatomy exams: Many Ice Skaters = malleus (hammer), incus (anvil), stapes (stirrup), in order from the eardrum inward. The malleus handle is attached to the eardrum, the stapes footplate sits in the oval window, and the stapes is the smallest bone in the human body. Nursing school and med school study tip. Images: Gray's Anatomy (1918), public domain. #anatomy #nursingschool #studytips"
PIN_DESC_S = "Ear ossicles cheat sheet: M-I-S, Many Ice Skaters = malleus (hammer), incus (anvil), stapes (stirrup), from the eardrum to the oval window. The stapes is the smallest bone in the body. Save for your next anatomy exam. Images: Gray's Anatomy (1918), public domain. #anatomy #nursingschool #medstudent #studytips"
THREADS = """Can you name the 3 tiny bones in your ear? 👂

Many Ice Skaters: Malleus (hammer), Incus (anvil), Stapes (stirrup), in order from the eardrum inward. The stapes is the smallest bone in your body.

Full study set: bookplume.com

What's the mnemonic that saved you on an anatomy exam?

#anatomy"""
for n,v,lim in [("YT",YT,95),("TT",TT,90),("PIN_V",PIN_V,90),("PIN_S",PIN_S,90),("PIN_DESC_V",PIN_DESC_V,480),("PIN_DESC_S",PIN_DESC_S,480),("THREADS",THREADS,450)]:
    print(n,len(v)); assert len(v)<=lim,n
json.dump(dict(TEXT=TEXT,YT=YT,TT=TT,PIN_V=PIN_V,PIN_S=PIN_S,PIN_DESC_V=PIN_DESC_V,PIN_DESC_S=PIN_DESC_S,THREADS=THREADS),open('texts.json','w'),ensure_ascii=False,indent=1)
