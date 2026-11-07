import json
U="https://bookplume.com/collections/anatomy-medical-flash-cards?utm_source={}&utm_medium=social&utm_campaign=white-blood-cells&utm_content={}"
TEXT = """Can you rank all 5 white blood cells, most to least common? One mnemonic: Never Let Monkeys Eat Bananas 🐒🍌

N → Neutrophils (50–70%): the most common, first to hit bacteria
L → Lymphocytes (20–30%): B cells, T cells, NK cells
M → Monocytes (2–8%): the biggest; leave the blood and become macrophages
E → Eosinophils (2–4%): parasites and allergies
B → Basophils (under 1%): the rarest, release histamine

Granulocytes: neutrophils, eosinophils, basophils. Agranulocytes: lymphocytes, monocytes.

Quick test: which one becomes a macrophage? Answer in the video.

Save this for your next anatomy exam.
Study with: Anatomy Flash Cards – Visual Learning Set of the Human Body → bookplume.com
Images: Gray's Anatomy (1918), public domain; cell drawings: Book Plume

#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #bookplume #whitebloodcells #anatomymnemonics"""
YT_DESC = TEXT.replace("→ bookplume.com", "→ " + U.format("youtube","short")) + """

Sources: OpenStax Anatomy & Physiology 2e, 18.4 Leukocytes and Platelets; Gray's Anatomy (1918), Fig. 454 "Varieties of leucocytes" (1918 names: polymorphonuclear = neutrophil, hyaline cell = monocyte).
Educational content for anatomy study, not medical advice."""
YT = "White Blood Cells Mnemonic: Never Let Monkeys Eat Bananas (WBC Types) #shorts"
TT = "Rank all 5 white blood cells: Never Let Monkeys Eat Bananas 🐒 #anatomymnemonics"
PIN_V = "White Blood Cells Mnemonic: Never Let Monkeys Eat Bananas | Nursing Study Tips"
PIN_S = "5 Types of White Blood Cells Cheat Sheet: Most to Least Common | Anatomy"
PIN_DESC_V = "WBC mnemonic Never Let Monkeys Eat Bananas ranks the 5 white blood cells most to least common: neutrophils 50–70%, lymphocytes 20–30%, monocytes 2–8%, eosinophils 2–4%, basophils under 1%. Monocytes become macrophages. Images: Gray's Anatomy (1918), public domain. #anatomy #nursingschool #studytips"
PIN_DESC_S = "White blood cells cheat sheet: neutrophils (first to hit bacteria), lymphocytes (B, T, NK cells), monocytes (biggest, become macrophages), eosinophils (parasites, allergies), basophils (rarest, histamine). Granulocytes: N, E, B. Agranulocytes: L, M. Save for your next anatomy exam. Plate: Gray's 1918 (public domain). #anatomy #medstudent"
TAGS = ["white blood cells mnemonic","types of white blood cells","never let monkeys eat bananas","wbc types","neutrophils lymphocytes monocytes eosinophils basophils","anatomy mnemonics","nursing school","anatomy and physiology","anatomy flashcards"]
for n,v,lim in [("YT",YT,95),("TT",TT,90),("PIN_V",PIN_V,90),("PIN_S",PIN_S,90),("PIN_DESC_V",PIN_DESC_V,480),("PIN_DESC_S",PIN_DESC_S,480)]:
    print(n,len(v)); assert len(v)<=lim,n
for n,v in [("TEXT",TEXT),("YT_DESC",YT_DESC)]:
    print(n,len(v)); assert len(v)<=2200
assert YT.endswith(" #shorts") and YT_DESC.count("utm_source=youtube")==1
json.dump(dict(TEXT=TEXT,YT_DESC=YT_DESC,YT=YT,TT=TT,PIN_V=PIN_V,PIN_S=PIN_S,PIN_DESC_V=PIN_DESC_V,PIN_DESC_S=PIN_DESC_S,TAGS=TAGS,PIN_LINK_V=U.format("pinterest","short"),PIN_LINK_S=U.format("pinterest","pin")),open('texts.json','w'),ensure_ascii=False,indent=1)
