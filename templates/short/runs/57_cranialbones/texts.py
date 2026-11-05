import json
TEXT = """Can you name all 8 cranial bones? One silly sentence does it: Old People From Texas Eat Spiders 🦴

O → Occipital: the back of your skull (the spinal cord exits through its foramen magnum)
P → Parietal: top and sides (a pair)
F → Frontal: your forehead
T → Temporal: right above your ears (a pair)
E → Ethmoid: tucked between your eye sockets
S → Sphenoid: the "keystone" that joins almost every other skull bone
6 names, but parietal and temporal come in pairs = 8 cranial bones.

Quick test: your spinal cord leaves the skull through which bone? Answer in the video.

Save this for your next anatomy exam.
Study with: Anatomy Flash Cards – Visual Learning Set of the Human Body → bookplume.com
Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume

#anatomy #cranialbones #skull #skullanatomy #anatomymnemonics #nursingschool #nursingstudent #medstudent #studytips #anatomyflashcards #bookplume"""
YT = "8 Cranial Bones Mnemonic: Old People From Texas Eat Spiders | Skull Anatomy #shorts"
TT = "Name all 8 cranial bones with one silly sentence 🦴"
PIN_V = "8 Cranial Bones Mnemonic | Anatomy Flashcards & Nursing School Study Tips"
PIN_S = "Cranial Bones Cheat Sheet: Old People From Texas Eat Spiders | Anatomy Flashcards"
PIN_DESC_V = "Skull anatomy mnemonic for exams: Old People From Texas Eat Spiders = occipital, parietal, frontal, temporal, ethmoid, sphenoid. Parietal and temporal are paired, so 6 names = 8 cranial bones. The sphenoid is the keystone bone; the spinal cord exits through the occipital's foramen magnum. Images: Gray's Anatomy (1918), public domain. #anatomy #nursingschool #studytips"
PIN_DESC_S = "Cranial bones cheat sheet: Occipital (back), Parietal x2 (top + sides), Frontal (forehead), Temporal x2 (above the ears), Ethmoid (between the eye sockets), Sphenoid (keystone). Mnemonic: Old People From Texas Eat Spiders. Save for your next anatomy exam. Diagram: Book Plume. #anatomy #nursingschool #medstudent #studytips"
TAGS = ["cranial bones","cranial bones mnemonic","skull anatomy","8 cranial bones","old people from texas eat spiders","sphenoid bone","anatomy mnemonics","nursing school","anatomy flashcards"]
for n,v,lim in [("YT",YT,95),("TT",TT,90),("PIN_V",PIN_V,90),("PIN_S",PIN_S,90),("PIN_DESC_V",PIN_DESC_V,480),("PIN_DESC_S",PIN_DESC_S,480)]:
    print(n,len(v)); assert len(v)<=lim,n
print("TEXT",len(TEXT)); assert len(TEXT)<=2200
assert YT.endswith(" #shorts")
json.dump(dict(TEXT=TEXT,YT=YT,TT=TT,PIN_V=PIN_V,PIN_S=PIN_S,PIN_DESC_V=PIN_DESC_V,PIN_DESC_S=PIN_DESC_S,TAGS=TAGS),open('texts.json','w'),ensure_ascii=False,indent=1)
