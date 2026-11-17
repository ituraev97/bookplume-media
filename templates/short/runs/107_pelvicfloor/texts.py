import json
B="https://raw.githubusercontent.com/ituraev97/bookplume-media/media-20261118-pelvicfloor/v/"
COL="https://bookplume.com/collections/anatomy-medical-flash-cards"
SLUG="pelvic-floor-muscles"
utm=lambda src,c: f"{COL}?utm_source={src}&utm_medium=social&utm_campaign={SLUG}&utm_content={c}"
TAGS="#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #anatomyquiz #bookplume #pelvicfloor #levatorani"
BODY="""Pelvic floor (pelvic diaphragm) = levator ani (3 parts) + coccygeus. The names are the map — FROM → TO:
Puborectalis: back of the pubis → U-shaped sling around the anorectal junction (keeps the anorectal angle → continence).
Pubococcygeus: pubis → coccyx / anococcygeal body. The bulk of levator ani.
Iliococcygeus: side wall (tendinous arch of the obturator fascia + ischial spine) → coccyx / anococcygeal raphe.
Coccygeus: ischial spine → coccyx + lowest sacrum, at the back.
Nerves: levator ani = nerve to levator ani (S4) + pudendal branches; coccygeus = S4–S5."""
ig=f"""Can you name this muscle in 3 seconds? It's the main muscle of your pelvic floor — and it's really 3 muscles in one 👀
{BODY}
Quick test: which one makes the sling? Answer in the video.
Save this for your next anatomy exam.
Study with: Anatomy Flash Cards (visual learning set) → bookplume.com
Images: Gray's Anatomy (1918), Fig. 404, public domain; diagrams: Book Plume
{TAGS}"""
yt=f"""Anatomy quiz: name this pelvic floor muscle in 3 seconds, then learn the pelvic floor muscles — levator ani (puborectalis, pubococcygeus, iliococcygeus) + coccygeus — with one trick: the names are the map.
{BODY}
Quick test: which one makes the sling? Puborectalis.
Study with: Book Plume anatomy flash cards → {utm('youtube','short')}
Images: Gray's Anatomy (1918), Fig. 404 (Left Levator ani from within), public domain; diagrams: Book Plume
Sources: TeachMeAnatomy, The Pelvic Floor (teachmeanatomy.info/pelvis/muscles/pelvic-floor/); Gray's Anatomy of the Human Body (1918), Levator ani + Coccygeus text, Fig. 404.
Study and exam prep only.
{TAGS}"""
yt_title="Name This Muscle in 3 Seconds? Pelvic Floor Muscles: Levator Ani + Coccygeus #shorts"
yt_tags=["pelvic floor muscles","levator ani","puborectalis","pubococcygeus","iliococcygeus","coccygeus","pelvic diaphragm","pelvis anatomy","anatomy mnemonics","anatomy quiz"]
tt_title="Name this pelvic floor muscle in 3 seconds?"
tt_head="Name this pelvic floor muscle in 3 seconds? Hint: it's 3 muscles in one."
tt=tt_head+"\n#anatomy #anatomyquiz #nursingschool #medstudent #pelvicfloor"
pin_v_title="Pelvic Floor Muscles Quiz: Levator Ani Parts + Coccygeus | Anatomy Mnemonic"
pin_v_text="Anatomy quiz: name this pelvic floor muscle in 3 seconds. Levator ani = puborectalis (sling around the rectum), pubococcygeus (pubis → coccyx), iliococcygeus (side wall → coccyx) + coccygeus at the back. The names are the map. Anatomy flashcards and study tips from Book Plume. Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume."
pin_s_title="Can You Name This Muscle? Pelvic Floor Anatomy Quiz | Nursing School Study Tips"
pin_s_text="Can you name this muscle? Anatomy quiz from Gray's Fig. 404: the pelvic floor. Learn levator ani — puborectalis, pubococcygeus, iliococcygeus — and coccygeus with one trick: each name tells you where the muscle runs. Anatomy flashcards from Book Plume. Images: Gray's Anatomy (1918), Fig. 404, public domain."
assert len(yt_title)<=95 and yt_title.endswith(" #shorts"); assert len(tt_title)<=90; assert len(tt_head)<=150
assert len(pin_v_title)<=90 and len(pin_s_title)<=90 and len(pin_v_text)<=480 and len(pin_s_text)<=480
for l in [utm('youtube','short'),utm('pinterest','short'),utm('pinterest','pin')]: assert "utm_source=" in l and "utm_campaign=" in l
assert "utm_source=" in yt and "utm_campaign=" in yt
assert "bookplume" not in tt.lower()
print(len(yt_title),len(tt_title),len(tt_head),len(pin_v_title),len(pin_s_title),len(pin_v_text),len(pin_s_text),len(yt),len(ig))
D=dict(B=B,ig=ig,yt=yt,yt_title=yt_title,yt_tags=yt_tags,tt=tt,tt_title=tt_title,pin_v_title=pin_v_title,pin_v_text=pin_v_text,pin_s_title=pin_s_title,pin_s_text=pin_s_text,pl_v=utm('pinterest','short'),pl_s=utm('pinterest','pin'))
json.dump(D,open('texts.json','w'),indent=1,ensure_ascii=False)
