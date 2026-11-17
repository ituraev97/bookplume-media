import json
B="https://raw.githubusercontent.com/ituraev97/bookplume-media/media-20261117-glutes/v/"
COL="https://bookplume.com/collections/anatomy-medical-flash-cards"
SLUG="gluteal-muscles"
utm=lambda src,c: f"{COL}?utm_source={src}&utm_medium=social&utm_campaign={SLUG}&utm_content={c}"
TAGS="#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #anatomyquiz #bookplume #glutes #musclesanatomy"
BODY="""Superficial gluteal muscles = 4. The 3 glutes stack in layers, outside → in:
Gluteus maximus: top layer, the biggest glute. Inferior gluteal nerve.
Gluteus medius: middle layer. Superior gluteal nerve.
Gluteus minimus: deepest and smallest. Superior gluteal nerve.
+ Tensor fasciae latae (TFL): at the front, pulls on the IT band. Superior gluteal nerve.
Nerve trick: maximus = inferior gluteal nerve (leaves below piriformis); the other 3 = superior gluteal nerve (above piriformis)."""
ig=f"""Can you name this glute muscle in 3 seconds? Then the 3 others + which nerve supplies each 👀
{BODY}
Quick test: which one keeps your hips level when you stand on one leg? Answer in the video.
Save this for your next anatomy exam.
Study with: Anatomy Flash Cards (visual learning set) → bookplume.com
Images: Gray's Anatomy (1918), Fig. 434, public domain; diagrams: Book Plume
{TAGS}"""
yt=f"""Anatomy quiz: name this glute muscle in 3 seconds, then learn the gluteal muscles on one map — gluteus maximus, medius, minimus + tensor fasciae latae — and the nerve trick (inferior vs superior gluteal nerve).
{BODY}
Quick test: which one keeps your hips level on one leg? Gluteus medius (minimus helps).
Full quiz on our channel: Can You Name These 27 Leg Muscles? (Anatomy Quiz)
Study with: Book Plume anatomy flash cards → {utm('youtube','short')}
Images: Gray's Anatomy (1918), Fig. 434, public domain (1918 spelling: "Glutæus"); diagrams: Book Plume
Sources: TeachMeAnatomy, The Muscles of the Gluteal Region (teachmeanatomy.info/lower-limb/muscles/gluteal-region/); StatPearls, Anatomy, Bony Pelvis and Lower Limb, Gluteus Maximus Muscle; Gray's Anatomy of the Human Body (1918), Fig. 434.
Study and exam prep only.
{TAGS}"""
yt_title="Name This Glute Muscle in 3 Seconds? Gluteal Muscles: Maximus, Medius, Minimus #shorts"
yt_tags=["gluteal muscles","glute muscles anatomy","gluteus maximus","gluteus medius","gluteus minimus","tensor fasciae latae","superior gluteal nerve","inferior gluteal nerve","hip muscles anatomy","anatomy quiz"]
tt_title="Name this glute muscle in 3 seconds?"
tt_head="Name this glute muscle in 3 seconds? Hint: it's not the big one."
tt=tt_head+"\n#anatomy #anatomyquiz #nursingschool #medstudent #glutes"
pin_v_title="Glute Muscles Quiz: Name This Muscle in 3 Sec + Maximus, Medius, Minimus"
pin_v_text="Anatomy quiz: name this glute muscle in 3 seconds. The gluteal muscles on one map: gluteus maximus (top, biggest), medius (middle), minimus (deepest) + tensor fasciae latae. Nerve trick: maximus = inferior gluteal nerve, the other 3 = superior gluteal nerve. Anatomy flashcards and study tips from Book Plume. Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume."
pin_s_title="Can You Name This Glute Muscle? Gluteal Muscles Quiz | Anatomy Study Tips"
pin_s_text="Can you name this muscle? Anatomy quiz from Gray's Fig. 434: the gluteal region with gluteus maximus and medius cut back to show the deepest glute. Learn maximus, medius, minimus and tensor fasciae latae + which gluteal nerve supplies each. Anatomy flashcards from Book Plume. Images: Gray's Anatomy (1918), Fig. 434, public domain."
assert len(yt_title)<=95 and yt_title.endswith(" #shorts"); assert len(tt_title)<=90; assert len(tt_head)<=150
assert len(pin_v_title)<=90 and len(pin_s_title)<=90 and len(pin_v_text)<=480 and len(pin_s_text)<=480
for l in [utm('youtube','short'),utm('pinterest','short'),utm('pinterest','pin')]: assert "utm_source=" in l and "utm_campaign=" in l
assert "utm_source=" in yt and "utm_campaign=" in yt
assert "bookplume" not in tt.lower()
print(len(yt_title),len(tt_title),len(tt_head),len(pin_v_title),len(pin_s_title),len(pin_v_text),len(pin_s_text),len(yt),len(ig))
D=dict(B=B,ig=ig,yt=yt,yt_title=yt_title,yt_tags=yt_tags,tt=tt,tt_title=tt_title,pin_v_title=pin_v_title,pin_v_text=pin_v_text,pin_s_title=pin_s_title,pin_s_text=pin_s_text,pl_v=utm('pinterest','short'),pl_s=utm('pinterest','pin'))
json.dump(D,open('texts.json','w'),indent=1,ensure_ascii=False)
