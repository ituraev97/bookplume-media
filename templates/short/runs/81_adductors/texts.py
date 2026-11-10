import json
COL="https://bookplume.com/collections/anatomy-medical-flash-cards"
def utm(src,c): return f"{COL}?utm_source={src}&utm_medium=social&utm_campaign=adductor-muscles&utm_content={c}"
TAGS="#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #bookplume #adductors #anatomymnemonics"
BODY="""P = Pectineus (up top, from the superior pubic ramus)
L = adductor Longus (longus = long)
B = adductor Brevis (brevis = short; hides under pectineus + longus)
M = adductor Magnus (magnus = big; the deepest and biggest)
G = Gracilis (gracilis = slender; most medial, the only one that crosses the knee)
All 5 adduct the thigh (pull it in). Nerve: obturator (L2–L4); pectineus is mainly femoral."""
CRED="Images: Gray's Anatomy (1918), Figs. 430 + 433, public domain; diagrams: Book Plume"
text=f"""Inner thigh muscles mnemonic: can you name all 5 adductors? 🦵 Please Let Bob Make Gravy.
{BODY}
Quick test: which adductor has TWO nerves? Answer in the video.
Save this for your next anatomy exam.
Study with: Anatomy Flash Cards (visual learning set) → bookplume.com
{CRED}
{TAGS}"""
yt_desc=f"""Adductor muscles mnemonic: Please Let Bob Make Gravy. The 5 muscles of the inner thigh (medial compartment of the thigh).
{BODY}
Quick test: which adductor has two nerves? Adductor magnus: obturator nerve (adductor part) + tibial part of the sciatic nerve (hamstring part).
Save this for your next anatomy exam.
Study with: Anatomy & medical flash cards → {utm('youtube','short')}
{CRED}
Study and exam prep only.
{TAGS}"""
tt_title="Inner thigh muscles mnemonic 🦵 Can you name all 5 adductors?"
yt_title="Adductor Muscles Mnemonic (Please Let Bob Make Gravy) | Inner Thigh Muscles #shorts"
pin_title="Adductor Muscles Mnemonic: Please Let Bob Make Gravy | 5 Inner Thigh Muscles"
pin2_title="Inner Thigh Muscles Cheat Sheet: 5 Adductors + Obturator Nerve | Anatomy Study"
pin_desc=f"""5 inner thigh (adductor) muscles = Please Let Bob Make Gravy: pectineus, adductor longus, adductor brevis, adductor magnus, gracilis. All adduct the thigh; obturator nerve (pectineus mainly femoral; magnus also sciatic). Anatomy flashcards and nursing school study tips from Book Plume. {CRED}. #anatomy #nursingschool #adductors"""
yt_tags=["adductor muscles mnemonic","inner thigh muscles","adductor muscles","medial compartment of thigh","adductor magnus","gracilis muscle","pectineus","obturator nerve","anatomy mnemonics","nursing school anatomy"]
assert len(tt_title)<=90 and len(yt_title)<=95 and yt_title.endswith("#shorts") and len(pin_title)<=90 and len(pin2_title)<=90 and len(pin_desc)<=480, (len(tt_title),len(yt_title),len(pin_title),len(pin2_title),len(pin_desc))
for l in [utm('youtube','short'),utm('pinterest','short'),utm('pinterest','pin')]: assert "utm_source=" in l and "utm_campaign=" in l
assert utm('youtube','short') in yt_desc
json.dump(dict(text=text,yt_desc=yt_desc,tt_title=tt_title,yt_title=yt_title,pin_title=pin_title,pin2_title=pin2_title,pin_desc=pin_desc,yt_tags=yt_tags,pinlink_v=utm('pinterest','short'),pinlink_i=utm('pinterest','pin')),open('texts.json','w'),indent=1,ensure_ascii=False)
print(len(tt_title),len(yt_title),len(pin_title),len(pin2_title),len(pin_desc),len(text),len(yt_desc))
