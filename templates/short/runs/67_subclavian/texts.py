import json
U="https://bookplume.com/collections/anatomy-medical-flash-cards?utm_source={}&utm_medium=social&utm_campaign=subclavian-artery-branches&utm_content={}"
TEXT = """Can you name all 5 branches of the subclavian artery? One mnemonic: VITamin C & D 💊

V → Vertebral artery (climbs through the neck vertebrae to the brain)
I → Internal thoracic artery (runs down behind the front chest wall)
T → Thyrocervical trunk (inferior thyroid, transverse cervical, suprascapular)
C → Costocervical trunk (behind anterior scalene)
D → Dorsal scapular artery (usually from part 3)

Anterior scalene splits the artery into 3 parts: part 1 gives 3 branches, part 2 gives 1, part 3 gives 1 (3-1-1). At the lateral border of the 1st rib it becomes the axillary artery.

Quick test: which branch climbs through your neck vertebrae to the brain? Answer in the video.

Save this for your next anatomy exam.
Study with: Anatomy Flash Cards – Visual Learning Set of the Human Body → bookplume.com
Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume

#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #bookplume #anatomymnemonics #subclavianartery"""
YT_DESC = TEXT.replace("→ bookplume.com", "→ " + U.format("youtube","short")) + """

Sources: Osmosis, Subclavian artery; Wikipedia, Subclavian artery; Gray's Anatomy (1918), The Subclavian Artery, Fig. 513.
Educational content for anatomy study, not medical advice."""
YT = "Subclavian Artery Branches Mnemonic: VITamin C & D (Anatomy Made Easy) #shorts"
TT = "Name all 5 subclavian artery branches: VITamin C & D 💊 #anatomymnemonics"
PIN_V = "Subclavian Artery Branches Mnemonic: VITamin C & D | Anatomy Study Tips"
PIN_S = "Subclavian Artery Branches Cheat Sheet: VIT C & D, Parts 3-1-1 | Anatomy"
PIN_DESC_V = "Anatomy mnemonic VITamin C & D for the 5 subclavian artery branches: vertebral, internal thoracic, thyrocervical trunk, costocervical trunk, dorsal scapular. Anterior scalene splits it into parts 1-2-3 giving 3-1-1 branches. Images: Gray's Anatomy (1918), public domain. #anatomy #nursingschool #studytips"
PIN_DESC_S = "Subclavian artery cheat sheet: VIT C & D = vertebral, internal thoracic, thyrocervical, costocervical, dorsal scapular. Part 1 (before anterior scalene) 3 branches, part 2 (behind) 1, part 3 (after) 1. Becomes axillary at the 1st rib. Save for your next anatomy exam. Plate: Gray's 1918 (public domain). #anatomy #medstudent"
CAR = """Subclavian artery cheat sheet 🩺 Swipe →

VITamin C & D = the 5 branches:
V Vertebral · I Internal thoracic · T Thyrocervical trunk · C Costocervical trunk · D Dorsal scapular
Part 1 (before anterior scalene): V, I, T
Part 2 (behind it): C
Part 3 (after it): D
→ becomes the axillary artery at the lateral border of the 1st rib

Save this for your next anatomy exam 📌
Study with our anatomy flash cards → bookplume.com
Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume

#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #bookplume #anatomymnemonics #subclavianartery"""
TAGS = ["subclavian artery branches","subclavian artery mnemonic","vitamin c and d mnemonic","vertebral artery","thyrocervical trunk","anatomy mnemonics","nursing school","anatomy flashcards","head and neck anatomy"]
for n,v,lim in [("YT",YT,95),("TT",TT,90),("PIN_V",PIN_V,90),("PIN_S",PIN_S,90),("PIN_DESC_V",PIN_DESC_V,480),("PIN_DESC_S",PIN_DESC_S,480)]:
    print(n,len(v)); assert len(v)<=lim,n
for n,v in [("TEXT",TEXT),("YT_DESC",YT_DESC),("CAR",CAR)]:
    print(n,len(v)); assert len(v)<=2200
assert YT.endswith(" #shorts") and YT_DESC.count("utm_source=youtube")==1
json.dump(dict(TEXT=TEXT,YT_DESC=YT_DESC,YT=YT,TT=TT,PIN_V=PIN_V,PIN_S=PIN_S,PIN_DESC_V=PIN_DESC_V,PIN_DESC_S=PIN_DESC_S,CAR=CAR,TAGS=TAGS,PIN_LINK_V=U.format("pinterest","short"),PIN_LINK_S=U.format("pinterest","pin")),open('/home/claude/work/run/texts.json','w'),ensure_ascii=False,indent=1)
