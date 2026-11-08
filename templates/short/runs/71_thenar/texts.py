import json
U="https://bookplume.com/collections/anatomy-medical-flash-cards?utm_source={}&utm_medium=social&utm_campaign=thenar-hypothenar-muscles&utm_content={}"
TEXT = """Can you name all 7 palm muscles? Thenar + hypothenar muscles in one mnemonic: A OF A OF A ✋

Thumb side → pinky side:
A → Abductor pollicis brevis (thenar)
O → Opponens pollicis (thenar)
F → Flexor pollicis brevis (thenar)
A → Adductor pollicis (middle)
O → Opponens digiti minimi (hypothenar)
F → Flexor digiti minimi (hypothenar)
A → Abductor digiti minimi (hypothenar)

Quick test: which nerve runs the thenar 3? Answer ↓
Median nerve (recurrent branch) → thenar 3 · ulnar nerve (deep branch) → adductor pollicis + hypothenar 3.

Save this for your next anatomy exam.
Study with: Anatomy Flash Cards – Visual Learning Set of the Human Body → bookplume.com
Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume

#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #bookplume #anatomymnemonics #handanatomy"""
YT_DESC = TEXT.replace("→ bookplume.com", "→ " + U.format("youtube","short")) + """

Sources: TeachMeAnatomy, Recurrent branch of median nerve; Epomedicine, Intrinsic muscles of hand mnemonics; Gray's Anatomy (1918), The Muscles of the Hand, Fig. 427.
Educational content for anatomy study, not medical advice."""
YT = "Thenar & Hypothenar Muscles Mnemonic: A OF A OF A (Hand Anatomy) #shorts"
TT = "Name all 7 palm muscles: thenar + hypothenar mnemonic A OF A OF A ✋ #anatomymnemonics"
PIN_V = "Thenar & Hypothenar Muscles Mnemonic: A OF A OF A | Hand Anatomy Study Tips"
PIN_S = "Hand Muscles Cheat Sheet: Thenar, Hypothenar, Adductor + Nerves | Anatomy"
PIN_DESC_V = "Anatomy mnemonic A OF A OF A for the 7 palm muscles, thumb to pinky: abductor pollicis brevis, opponens pollicis, flexor pollicis brevis, adductor pollicis, opponens, flexor and abductor digiti minimi. Images: Gray's Anatomy (1918), public domain. #anatomy #nursingschool #studytips"
PIN_DESC_S = "Hand muscles cheat sheet: thenar 3 (abductor pollicis brevis, opponens pollicis, flexor pollicis brevis) = median nerve, recurrent branch; adductor pollicis + hypothenar 3 = ulnar nerve, deep branch. Save for your next anatomy exam. Plate: Gray's 1918 (public domain). #anatomy #medstudent"
CAR = """Hand muscles cheat sheet ✋ Swipe →

A OF A OF A = the 7 palm muscles, thumb → pinky:
Thenar 3: Abductor pollicis brevis · Opponens pollicis · Flexor pollicis brevis → median nerve (recurrent branch)
Adductor pollicis → ulnar nerve (deep branch)
Hypothenar 3: Opponens · Flexor · Abductor digiti minimi → ulnar nerve (deep branch)
1918 atlases say "digiti quinti" = digiti minimi.

Save this for your next anatomy exam 📌
Study with our anatomy flash cards → bookplume.com
Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume

#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #bookplume #anatomymnemonics #handanatomy"""
TAGS = ["thenar muscles","hypothenar muscles","thenar muscles mnemonic","hand muscles anatomy","intrinsic muscles of the hand","median nerve recurrent branch","anatomy mnemonics","nursing school","anatomy flashcards"]
for n,v,lim in [("YT",YT,95),("TT",TT,90),("PIN_V",PIN_V,90),("PIN_S",PIN_S,90),("PIN_DESC_V",PIN_DESC_V,480),("PIN_DESC_S",PIN_DESC_S,480)]:
    print(n,len(v)); assert len(v)<=lim,n
for n,v in [("TEXT",TEXT),("YT_DESC",YT_DESC),("CAR",CAR)]:
    print(n,len(v)); assert len(v)<=2200
assert YT.endswith(" #shorts") and YT_DESC.count("utm_source=youtube")==1
json.dump(dict(TEXT=TEXT,YT_DESC=YT_DESC,YT=YT,TT=TT,PIN_V=PIN_V,PIN_S=PIN_S,PIN_DESC_V=PIN_DESC_V,PIN_DESC_S=PIN_DESC_S,CAR=CAR,TAGS=TAGS,PIN_LINK_V=U.format("pinterest","short"),PIN_LINK_S=U.format("pinterest","pin")),open('/home/claude/work/run/texts.json','w'),ensure_ascii=False,indent=1)
