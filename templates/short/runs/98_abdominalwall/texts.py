import json
B="https://raw.githubusercontent.com/ituraev97/bookplume-media/media-20261115-abdominalwall/v/"
COL="https://bookplume.com/collections/anatomy-medical-flash-cards"
SLUG="abdominal-wall-muscles"
utm=lambda src,c: f"{COL}?utm_source={src}&utm_medium=social&utm_campaign={SLUG}&utm_content={c}"
TAGS="#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #anatomyquiz #bookplume #abdominalmuscles #muscleanatomy"
BODY="""Abdominal wall = 5 muscles: 3 flat layers + 2 vertical.
3 flat layers, outside to in: E-I-T
E = external oblique (outermost, fibers run down and in, like hands in your front pockets)
I = internal oblique (middle, fibers run up and in, at a right angle to the external oblique)
T = transversus abdominis (deepest, fibers run straight across like a corset)
2 vertical: rectus abdominis + pyramidalis (small, triangular, low in front of the rectus)
Six-pack lines = tendinous intersections of the rectus abdominis (1918 atlas name: tendinous inscriptions)."""
ig=f"""Name this muscle in 3 seconds? Abdominal muscles quiz + the E-I-T trick.
{BODY}
Quick test: which layer runs like hands in your pockets? Answer in the video.
Save this for your next anatomy exam.
Study with: Anatomy Flash Cards (visual learning set) → bookplume.com
Images: Gray's Anatomy (1918), Figs. 397 + 395, public domain; diagrams: Book Plume
{TAGS}"""
yt=f"""Anatomy quiz: name this muscle in 3 seconds, then learn all 5 abdominal wall muscles with one trick: E-I-T.
{BODY}
Quick test: which layer runs like hands in your pockets? The external oblique.
Save this for your next anatomy exam.
Study with: Anatomy & medical flash cards → {utm('youtube','short')}
Images: Gray's Anatomy (1918), Figs. 397 + 395, public domain; diagrams: Book Plume
Sources: TeachMeAnatomy, The Anterolateral Abdominal Wall (teachmeanatomy.info/abdomen/muscles/abdominal-wall/); Gray's Anatomy of the Human Body (1918), The Antero-lateral Muscles of the Abdomen.
Study and exam prep only.
{TAGS}"""
yt_title="Name This Muscle in 3 Seconds? Abdominal Muscles Anatomy Quiz (E-I-T Trick) #shorts"
yt_tags=["abdominal muscles","abdominal wall muscles","transversus abdominis","external oblique","internal oblique","rectus abdominis","anatomy quiz","anatomy mnemonics","nursing school","muscle anatomy"]
tt_title="Name this muscle in 3 seconds?"
tt_head="Name this muscle in 3 seconds? Hint: it's the deepest layer of your abs."
tt=tt_head+"\n#anatomy #anatomyquiz #nursingschool #medstudent #abdominalmuscles"
pin_v_title="Abdominal Muscles Quiz: Name This Muscle in 3 Seconds (E-I-T Trick)"
pin_v_text="Anatomy quiz: name this muscle in 3 seconds. Abdominal wall muscles trick E-I-T: external oblique, internal oblique, transversus abdominis (outside to in) + rectus abdominis and pyramidalis. Anatomy flashcards and nursing school study tips from Book Plume. Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume."
pin_s_title="Can You Name This Muscle? Abdominal Muscles Quiz | Nursing School Study Tips"
pin_s_text="Can you name this abdominal muscle? Anatomy quiz: the 5 abdominal wall muscles, 3 flat layers E-I-T (external oblique, internal oblique, transversus abdominis) + rectus abdominis and pyramidalis. Anatomy flashcards and nursing school study tips from Book Plume. Images: Gray's Anatomy (1918), Fig. 397, public domain."
car="""How many can you name? 5 abdominal wall muscles 👀
1 External oblique · 2 Internal oblique · 3 Transversus abdominis · 4 Rectus abdominis · 5 Pyramidalis
Cheat sheet: 3 flat layers outside to in = E-I-T, + 2 vertical. External oblique runs like hands in your front pockets; six-pack lines = tendinous intersections.
Save this for your next anatomy exam. Comment your score!
Study with: Anatomy Flash Cards → bookplume.com
Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume
"""+TAGS
assert len(yt_title)<=95 and yt_title.endswith(" #shorts"); assert len(tt_title)<=90; assert len(tt_head)<=150
assert len(pin_v_title)<=90 and len(pin_s_title)<=90 and len(pin_v_text)<=480 and len(pin_s_text)<=480
for l in [utm('youtube','short'),utm('pinterest','short'),utm('pinterest','pin')]: assert "utm_source=" in l and "utm_campaign=" in l
assert "utm_source=" in yt and "utm_campaign=" in yt
assert "bookplume" not in tt.lower()
print(len(yt_title),len(tt_title),len(tt_head),len(pin_v_title),len(pin_s_title),len(pin_v_text),len(pin_s_text),len(yt),len(ig),len(car))
D=dict(B=B,ig=ig,yt=yt,yt_title=yt_title,yt_tags=yt_tags,tt=tt,tt_title=tt_title,pin_v_title=pin_v_title,pin_v_text=pin_v_text,pin_s_title=pin_s_title,pin_s_text=pin_s_text,pl_v=utm('pinterest','short'),pl_s=utm('pinterest','pin'),car=car)
json.dump(D,open('texts.json','w'),indent=1,ensure_ascii=False)
