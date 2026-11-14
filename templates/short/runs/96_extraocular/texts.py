import json
B="https://raw.githubusercontent.com/ituraev97/bookplume-media/media-20261115-extraocular/v/"
COL="https://bookplume.com/collections/anatomy-medical-flash-cards"
SLUG="extraocular-muscles"
utm=lambda src,c: f"{COL}?utm_source={src}&utm_medium=social&utm_campaign={SLUG}&utm_content={c}"
TAGS="#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #anatomyquiz #bookplume #extraocularmuscles #cranialnerves"
BODY="""6 extraocular muscles = 4 recti + 2 obliques
Recti: Superior rectus (eye up), Inferior rectus (eye down), Medial rectus (eye in), Lateral rectus (eye out)
Obliques: Superior oblique (its tendon runs through a pulley, the trochlea), Inferior oblique
Nerves, one trick: LR6 · SO4 · the rest 3
LR6 = Lateral rectus → CN VI, abducens (it ABducts the eye)
SO4 = Superior oblique → CN IV, trochlear (trochlea = pulley)
The other 4 → CN III, oculomotor (it also supplies levator palpebrae superioris, which lifts the upper eyelid)."""
ig=f"""Name this eye muscle in 3 seconds? Extraocular muscles quiz + the LR6 SO4 nerve trick.
{BODY}
Quick test: which nerve moves the superior oblique? Answer in the video.
Save this for your next anatomy exam.
Study with: Anatomy Flash Cards (visual learning set) → bookplume.com
Images: Gray's Anatomy (1918), Figs. 889 + 890, public domain; diagrams: Book Plume
{TAGS}"""
yt=f"""Anatomy quiz: name this eye muscle in 3 seconds, then learn all 6 extraocular muscles and their nerves with one trick: LR6 SO4, the rest 3.
{BODY}
Quick test: which nerve moves the superior oblique? The trochlear nerve, cranial nerve IV. 1918 atlas names: "Rectus lateralis" = lateral rectus, "Abducent nerve" = abducens nerve.
Save this for your next anatomy exam.
Study with: Anatomy & medical flash cards → {utm('youtube','short')}
Images: Gray's Anatomy (1918), Figs. 889 + 890, public domain; diagrams: Book Plume
Sources: TeachMeAnatomy, The Extraocular Muscles (teachmeanatomy.info/head/organs/eye/extraocular-muscles/); Gray's Anatomy (1918), The Accessory Organs of the Eye.
Study and exam prep only.
{TAGS}"""
yt_title="Name This Eye Muscle in 3 Seconds? Extraocular Muscles Quiz (LR6 SO4) #shorts"
yt_tags=["extraocular muscles","eye muscles anatomy","LR6 SO4","lateral rectus","superior oblique","trochlear nerve","abducens nerve","cranial nerves","anatomy quiz","anatomy mnemonics"]
tt_title="Name this eye muscle in 3 seconds?"
tt_head="Name this eye muscle in 3 seconds? Bonus: its nerve is the odd one out."
tt=tt_head+"\n#anatomy #anatomyquiz #nursingschool #medstudent #extraocularmuscles"
pin_v_title="Extraocular Muscles Quiz: Name This Eye Muscle in 3 Seconds (LR6 SO4)"
pin_v_text="Anatomy quiz: name this eye muscle in 3 seconds. 6 extraocular muscles = 4 recti + 2 obliques. Nerve trick LR6 SO4: lateral rectus = abducens (CN VI), superior oblique = trochlear (CN IV), the other 4 = oculomotor (CN III). Anatomy flashcards and nursing school study tips from Book Plume. Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume."
pin_s_title="Can You Name This Eye Muscle? Extraocular Muscles Quiz | LR6 SO4 Nursing School"
pin_s_text="Can you name this eye muscle? Anatomy quiz: 6 extraocular muscles (4 recti + 2 obliques) and the LR6 SO4 nerve trick: lateral rectus CN VI, superior oblique CN IV, the rest CN III. Anatomy flashcards and nursing school study tips from Book Plume. Images: Gray's Anatomy (1918), Fig. 889, public domain."
assert len(yt_title)<=95 and yt_title.endswith(" #shorts"); assert len(tt_title)<=90; assert len(tt_head)<=150
assert len(pin_v_title)<=90 and len(pin_s_title)<=90 and len(pin_v_text)<=480 and len(pin_s_text)<=480
for l in [utm('youtube','short'),utm('pinterest','short'),utm('pinterest','pin')]: assert "utm_source=" in l and "utm_campaign=" in l
assert "utm_source=" in yt and "utm_campaign=" in yt
assert "bookplume" not in tt.lower()
print(len(yt_title),len(tt_title),len(tt_head),len(pin_v_title),len(pin_s_title),len(pin_v_text),len(pin_s_text),len(yt),len(ig))
D=dict(B=B,ig=ig,yt=yt,yt_title=yt_title,yt_tags=yt_tags,tt=tt,tt_title=tt_title,pin_v_title=pin_v_title,pin_v_text=pin_v_text,pin_s_title=pin_s_title,pin_s_text=pin_s_text,pl_v=utm('pinterest','short'),pl_s=utm('pinterest','pin'))
json.dump(D,open('texts.json','w'),indent=1,ensure_ascii=False)
