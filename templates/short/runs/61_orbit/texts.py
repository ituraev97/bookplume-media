import json
C="https://bookplume.com/collections/anatomy-medical-flash-cards"
U=lambda src,cont: f"{C}?utm_source={src}&utm_medium=social&utm_campaign=orbit-bones&utm_content={cont}"
BODY = """Can you name all 7 bones of the eye socket? Remember: Many Friendly Zebras Enjoy Lazy Summer Picnics 🦓

Maxilla, Frontal, Zygomatic, Ethmoid, Lacrimal, Sphenoid, Palatine.
Lateral wall = zygomatic + greater wing of sphenoid (the strongest wall).
Medial wall = ethmoid (its paper-thin orbital plate, the lamina papyracea) + lacrimal, maxilla, sphenoid: the thinnest wall.
Roof = frontal + lesser wing of sphenoid. Floor = maxilla, zygomatic, palatine.

Quick test: which bone forms most of the roof? Answer in the video.

Save this for your next anatomy exam.
Study with: Anatomy Flash Cards – Visual Learning Set of the Human Body → {LINK}
Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume

#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #bookplume #skullanatomy #anatomymnemonics"""
TEXT = BODY.replace("{LINK}", "bookplume.com")
YT_TEXT = BODY.replace("{LINK}", U("youtube","short"))
YT = "7 Bones of the Orbit Mnemonic: Many Friendly Zebras Enjoy Lazy Summer Picnics #shorts"
TT = "7 eye socket bones in 1 sentence 🦓 orbit mnemonic"
PIN_V = "Bones of the Orbit Mnemonic | Anatomy Flashcards & Nursing School Study Tips"
PIN_S = "7 Bones of the Orbit Cheat Sheet: Many Friendly Zebras | Anatomy Study Tips"
PIN_DESC_V = "Skull anatomy mnemonic for exams: Many Friendly Zebras Enjoy Lazy Summer Picnics = maxilla, frontal, zygomatic, ethmoid, lacrimal, sphenoid, palatine, the 7 bones of the orbit. Lateral wall = strongest, medial wall (ethmoid) = thinnest, roof = frontal + lesser wing of sphenoid. Images: Gray's Anatomy (1918), public domain. #anatomy #nursingschool #studytips"
PIN_DESC_S = "Orbit cheat sheet: 7 bones of the eye socket and their walls. Roof: frontal + lesser wing of sphenoid. Floor: maxilla, zygomatic, palatine. Medial: ethmoid, lacrimal, maxilla, sphenoid. Lateral: zygomatic + greater wing of sphenoid. Mnemonic: Many Friendly Zebras Enjoy Lazy Summer Picnics. Diagram: Book Plume. #anatomy #nursingschool #medstudent #studytips"
TAGS = ["bones of the orbit","orbit bones mnemonic","eye socket anatomy","skull anatomy","many friendly zebras","anatomy mnemonics","nursing school","med student","anatomy flashcards","lamina papyracea"]
PIN_LINK_V = U("pinterest","short"); PIN_LINK_S = U("pinterest","pin")
for n,v,lim in [("YT",YT,95),("TT",TT,90),("PIN_V",PIN_V,90),("PIN_S",PIN_S,90),("PIN_DESC_V",PIN_DESC_V,480),("PIN_DESC_S",PIN_DESC_S,480)]:
    print(n,len(v)); assert len(v)<=lim,n
print("TEXT",len(TEXT),"YT_TEXT",len(YT_TEXT)); assert len(TEXT)<=2200 and len(YT_TEXT)<=5000
assert YT.endswith(" #shorts") and 6<=len(TAGS)<=10 and 5<=TEXT.count('#')<=8
json.dump(dict(TEXT=TEXT,YT_TEXT=YT_TEXT,YT=YT,TT=TT,PIN_V=PIN_V,PIN_S=PIN_S,PIN_DESC_V=PIN_DESC_V,PIN_DESC_S=PIN_DESC_S,TAGS=TAGS,PIN_LINK_V=PIN_LINK_V,PIN_LINK_S=PIN_LINK_S),open('texts.json','w'),ensure_ascii=False,indent=1)
