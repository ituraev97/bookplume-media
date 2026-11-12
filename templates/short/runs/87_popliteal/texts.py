import json
COL="https://bookplume.com/collections/anatomy-medical-flash-cards"
def utm(src,c): return f"{COL}?utm_source={src}&utm_medium=social&utm_campaign=popliteal-fossa&utm_content={c}"
TAGS="#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #bookplume #lowerlimb #anatomymnemonics"
BODY="""S = Semimembranosus + Semitendinosus (inner / medial upper border)
A = popliteal Artery (deepest, right on the bone)
V = popliteal Vein
N = tibial Nerve (most superficial)
B = Biceps femoris (outer / lateral upper border)
Below: the 2 heads of gastrocnemius close the diamond. Skin to bone: nerve, vein, artery. The small saphenous vein joins the popliteal vein; the common fibular nerve runs along the biceps."""
CRED="Images: Gray's Anatomy (1918), Fig. 551, public domain; diagrams: Book Plume"
text=f"""Popliteal fossa: can you name all 5 in the back of your knee? Mnemonic: Serve And Volley Next Ball (medial → lateral).
{BODY}
Quick test: which one lies deepest, right on the bone? Answer in the video.
Save this for your next anatomy exam.
Study with: Anatomy Flash Cards (visual learning set) → bookplume.com
{CRED}
{TAGS}"""
yt_desc=f"""Popliteal fossa mnemonic: Serve And Volley Next Ball. The borders and contents of the popliteal fossa (back of the knee) in under 30 seconds.
{BODY}
Quick test: which structure lies deepest in the popliteal fossa? The popliteal artery.
Save this for your next anatomy exam.
Study with: Anatomy & medical flash cards → {utm('youtube','short')}
{CRED}
Sources: Kenhub, Popliteal fossa; Radiopaedia, Popliteal fossa anatomy (mnemonic); Gray's Anatomy (1918), The Popliteal Fossa.
Study and exam prep only.
{TAGS}"""
tt_title="Popliteal fossa: name all 5 behind the knee? Serve And Volley Next Ball"
yt_title="Popliteal Fossa Mnemonic: Serve And Volley Next Ball #shorts"
pin_title="Popliteal Fossa Mnemonic: Serve And Volley Next Ball | Knee Anatomy"
pin2_title="Popliteal Fossa Cheat Sheet: Borders, Artery, Vein, Tibial Nerve"
pin_desc=f"""Popliteal fossa = Serve And Volley Next Ball, medial to lateral: semimembranosus/semitendinosus, popliteal artery, popliteal vein, tibial nerve, biceps femoris. Skin to bone: nerve, vein, artery (artery deepest). Anatomy flashcards and nursing school study tips from Book Plume. {CRED}."""
car=f"""Popliteal fossa cheat sheet 🦵 Serve And Volley Next Ball
S = Semimembranosus + semitendinosus (upper medial border)
A = popliteal Artery (deepest)
V = popliteal Vein
N = tibial Nerve (most superficial)
B = Biceps femoris (upper lateral border)
Below: 2 heads of gastrocnemius → a diamond.
Save this for your next anatomy exam 📌
Study with anatomy flashcards → bookplume.com
{CRED}
{TAGS}"""
yt_tags=["popliteal fossa","popliteal fossa mnemonic","popliteal fossa anatomy","knee anatomy","lower limb anatomy","anatomy mnemonics","nursing school","anatomy and physiology","med school"]
assert len(tt_title)<=90 and len(yt_title)<=95 and len(pin_title)<=90 and len(pin2_title)<=90 and len(pin_desc)<=480, (len(tt_title),len(yt_title),len(pin_title),len(pin2_title),len(pin_desc))
for u in [utm('pinterest','short'),utm('pinterest','pin'),utm('youtube','short')]: assert "utm_source=" in u and "utm_campaign=" in u
assert "utm_source=" in yt_desc and "utm_campaign=" in yt_desc
json.dump(dict(text=text,yt_desc=yt_desc,tt_title=tt_title,yt_title=yt_title,pin_title=pin_title,pin2_title=pin2_title,pin_desc=pin_desc,car=car,yt_tags=yt_tags,pin_link=utm('pinterest','short'),pin2_link=utm('pinterest','pin')),open('texts.json','w'),indent=1)
print(len(tt_title),len(yt_title),len(pin_title),len(pin2_title),len(pin_desc))
