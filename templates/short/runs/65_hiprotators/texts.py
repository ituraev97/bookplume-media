import json
U="https://bookplume.com/collections/anatomy-medical-flash-cards?utm_source={}&utm_medium=social&utm_campaign=deep-hip-rotators&utm_content={}"
TEXT = """Can you name all 6 deep hip rotators? One word does it, top to bottom: P-GO-GO-Q 🍑

P → Piriformis (the top one, from the sacrum)
G → Gemellus superior
O → Obturator internus (its tendon runs between the two gemelli, "little twins")
G → Gemellus inferior
O → Obturator externus (hidden deep, behind quadratus femoris)
Q → Quadratus femoris (the bottom one)
All 6 run to the greater trochanter area of the femur and rotate the thigh outward (lateral rotation).

Quick test: which big nerve exits just below piriformis? Answer in the video.

Save this for your next anatomy exam.
Study with: Anatomy Flash Cards – Visual Learning Set of the Human Body → bookplume.com
Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume

#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #bookplume #hipanatomy #anatomymnemonics"""
YT_DESC = TEXT.replace("→ bookplume.com", "→ " + U.format("youtube","short")) + """

Sources: TeachMeAnatomy, Muscles of the Gluteal Region; Lateral rotator group (Wikipedia, with Gray's Anatomy); epomedicine, Short external rotator muscles of the hip (P-GO-GO-Q); Gray's Anatomy (1918), The Muscles of the Gluteal Region, Fig. 434.
Educational content for anatomy study, not medical advice."""
YT = "6 Deep Hip Rotators Mnemonic: P-GO-GO-Q (Piriformis to Quadratus Femoris) #shorts"
TT = "Name all 6 deep hip rotators with one word: P-GO-GO-Q 🍑"
PIN_V = "Deep Hip Rotators Mnemonic P-GO-GO-Q | Anatomy Flashcards & Nursing Study Tips"
PIN_S = "6 Deep Hip Rotator Muscles Cheat Sheet: P-GO-GO-Q | Anatomy Study Tip"
PIN_DESC_V = "Hip anatomy mnemonic P-GO-GO-Q, top to bottom: piriformis, gemellus superior, obturator internus, gemellus inferior, obturator externus, quadratus femoris. All 6 laterally rotate the thigh; the sciatic nerve exits below piriformis. Images: Gray's Anatomy (1918), public domain. #anatomy #nursingschool #studytips"
PIN_DESC_S = "Deep hip rotators cheat sheet: P-GO-GO-Q = piriformis, gemellus superior, obturator internus, gemellus inferior, obturator externus (deep), quadratus femoris. Lateral rotation of the thigh; sciatic nerve below piriformis. Save for your next anatomy exam. Plate: Gray's 1918 (public domain); diagram: Book Plume. #anatomy #medstudent"
TAGS = ["deep hip rotators","hip external rotators mnemonic","piriformis","lateral rotators of the hip","gluteal region anatomy","anatomy mnemonics","nursing school","anatomy flashcards","quadratus femoris"]
for n,v,lim in [("YT",YT,95),("TT",TT,90),("PIN_V",PIN_V,90),("PIN_S",PIN_S,90),("PIN_DESC_V",PIN_DESC_V,480),("PIN_DESC_S",PIN_DESC_S,480)]:
    print(n,len(v)); assert len(v)<=lim,n
for n,v in [("TEXT",TEXT),("YT_DESC",YT_DESC)]:
    print(n,len(v)); assert len(v)<=2200
assert YT.endswith(" #shorts") and YT_DESC.count("utm_source=youtube")==1
json.dump(dict(TEXT=TEXT,YT_DESC=YT_DESC,YT=YT,TT=TT,PIN_V=PIN_V,PIN_S=PIN_S,PIN_DESC_V=PIN_DESC_V,PIN_DESC_S=PIN_DESC_S,TAGS=TAGS,PIN_LINK_V=U.format("pinterest","short"),PIN_LINK_S=U.format("pinterest","pin")),open('/home/claude/work/run/texts.json','w'),ensure_ascii=False,indent=1)
