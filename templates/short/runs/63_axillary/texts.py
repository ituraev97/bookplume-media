import json
U="https://bookplume.com/collections/anatomy-medical-flash-cards?utm_source={}&utm_medium=social&utm_campaign=axillary-artery&utm_content={}"
TEXT = """Can you name all 6 branches of the axillary artery? Screw The Lawyer, Save A Patient 🩺

Pectoralis minor splits the axillary artery into 3 parts: part 1 has 1 branch, part 2 has 2, part 3 has 3.
S → Superior thoracic (part 1)
T → Thoracoacromial (part 2)
L → Lateral thoracic (part 2)
S → Subscapular, the biggest branch (part 3)
A → Anterior circumflex humeral (part 3)
P → Posterior circumflex humeral (part 3)
It runs from the 1st rib to the lower border of teres major, then becomes the brachial artery.

Save this for your next anatomy exam.
Study with: Anatomy Flash Cards – Visual Learning Set of the Human Body → bookplume.com
Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume

#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #bookplume #axillaryartery #anatomymnemonics"""
YT_DESC = TEXT.replace("→ bookplume.com", "→ " + U.format("youtube","short")) + """

Sources: StatPearls (NCBI Bookshelf), Anatomy, Shoulder and Upper Limb, Axillary Artery; Radiopaedia, Axillary artery branches (mnemonic); Gray's Anatomy (1918), The Axillary Artery.
Educational content for anatomy study, not medical advice."""
YT = "Axillary Artery Branches Mnemonic: Screw The Lawyer Save A Patient #shorts"
TT = "Name all 6 axillary artery branches with one mnemonic 🩺"
PIN_V = "Axillary Artery Branches Mnemonic | Anatomy Flashcards & Nursing School Study Tips"
PIN_S = "Axillary Artery Cheat Sheet: Screw The Lawyer Save A Patient | Anatomy Study"
PIN_DESC_V = "Upper limb anatomy mnemonic: Screw The Lawyer Save A Patient = superior thoracic, thoracoacromial, lateral thoracic, subscapular, anterior + posterior circumflex humeral. Pectoralis minor splits the axillary artery into 3 parts with 1, 2 and 3 branches. Images: Gray's Anatomy (1918), public domain. #anatomy #nursingschool #studytips"
PIN_DESC_S = "Axillary artery cheat sheet: part 1 superior thoracic; part 2 thoracoacromial + lateral thoracic; part 3 subscapular (biggest), anterior + posterior circumflex humeral. 1st rib to lower border of teres major, then brachial artery. Save for your next anatomy exam. Diagram: Book Plume. #anatomy #nursingschool #medstudent #studytips"
CAROUSEL = """Axillary artery cheat sheet 🩺 Screw The Lawyer, Save A Patient

Pectoralis minor splits it into 3 parts: 1, 2 and 3 branches.
Part 1: superior thoracic
Part 2: thoracoacromial, lateral thoracic
Part 3: subscapular (biggest), anterior + posterior circumflex humeral
From the 1st rib to the lower border of teres major, then it's the brachial artery.

Save this for your next anatomy exam 📌
Study cards: bookplume.com
Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume

#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #bookplume #axillaryartery #anatomymnemonics"""
TAGS = ["axillary artery","axillary artery branches","axillary artery mnemonic","screw the lawyer save a patient","upper limb anatomy","anatomy mnemonics","nursing school","anatomy flashcards"]
for n,v,lim in [("YT",YT,95),("TT",TT,90),("PIN_V",PIN_V,90),("PIN_S",PIN_S,90),("PIN_DESC_V",PIN_DESC_V,480),("PIN_DESC_S",PIN_DESC_S,480)]:
    print(n,len(v)); assert len(v)<=lim,n
for n,v in [("TEXT",TEXT),("YT_DESC",YT_DESC),("CAROUSEL",CAROUSEL)]:
    print(n,len(v)); assert len(v)<=2200
assert YT.endswith(" #shorts") and YT_DESC.count("utm_source=youtube")==1 and "bookplume.com" in TEXT
json.dump(dict(TEXT=TEXT,YT_DESC=YT_DESC,YT=YT,TT=TT,PIN_V=PIN_V,PIN_S=PIN_S,PIN_DESC_V=PIN_DESC_V,PIN_DESC_S=PIN_DESC_S,CAROUSEL=CAROUSEL,TAGS=TAGS,PIN_LINK_V=U.format("pinterest","short"),PIN_LINK_S=U.format("pinterest","pin")),open('/home/claude/work/run/texts.json','w'),ensure_ascii=False,indent=1)
