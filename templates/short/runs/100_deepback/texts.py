import json
B="https://raw.githubusercontent.com/ituraev97/bookplume-media/media-20261116-deepback/v/"
COL="https://bookplume.com/collections/anatomy-medical-flash-cards"
SLUG="deep-back-muscles"
utm=lambda src,c: f"{COL}?utm_source={src}&utm_medium=social&utm_campaign={SLUG}&utm_content={c}"
TAGS="#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #anatomyquiz #bookplume #backmuscles #erectorspinae"
BODY="""Erector spinae = 3 columns, outside to inside: I Love Spaghetti
I = Iliocostalis (most lateral)
L = Longissimus (the middle one, the biggest)
S = Spinalis (most medial, right by the spinous processes)
Deeper, in the groove between the spinous and transverse processes (transversospinales), top to deepest: semispinalis, multifidus, rotatores.
1918 atlas name: "Sacrospinalis" = erector spinae; "... dorsi" = today's "... thoracis"."""
ig=f"""Can you name all 6 deep back muscles? Start with this one in 3 seconds 👀
{BODY}
Quick test: which nerves supply all 6? Answer in the video.
Save this for your next anatomy exam.
Study with: Anatomy Flash Cards (visual learning set) → bookplume.com
Images: Gray's Anatomy (1918), Fig. 389, public domain; diagrams: Book Plume
{TAGS}"""
yt=f"""Anatomy quiz: name this back muscle in 3 seconds, then learn the deep (intrinsic) back muscles with one trick: I Love Spaghetti.
{BODY}
Quick test: which nerves supply all 6? The posterior (dorsal) rami of the spinal nerves, not a plexus.
Save this for your next anatomy exam.
Study with: Anatomy & medical flash cards → {utm('youtube','short')}
Images: Gray's Anatomy (1918), Fig. 389, public domain; diagrams: Book Plume
Sources: TeachMeAnatomy, The Intrinsic Back Muscles (teachmeanatomy.info/back/muscles/intrinsic/); OpenStax Anatomy and Physiology 2e, 11.4 Axial Muscles of the Head, Neck, and Back; Gray's Anatomy of the Human Body (1918), The Deep Muscles of the Back.
Study and exam prep only.
{TAGS}"""
yt_title="Name This Back Muscle in 3 Seconds? Deep Back Muscles Quiz (I Love Spaghetti) #shorts"
yt_tags=["erector spinae","deep back muscles","intrinsic back muscles","erector spinae mnemonic","iliocostalis longissimus spinalis","transversospinales","multifidus","back muscles anatomy","anatomy quiz","nursing school anatomy"]
tt_title="Name this back muscle in 3 seconds?"
tt_head="Name this back muscle in 3 seconds? Hint: it keeps you standing up straight."
tt=tt_head+"\n#anatomy #anatomyquiz #nursingschool #medstudent #backmuscles"
pin_v_title="Deep Back Muscles Quiz: Name This Muscle in 3 Seconds (I Love Spaghetti)"
pin_v_text="Anatomy quiz: name this back muscle in 3 seconds. Erector spinae = 3 columns, outside to inside: I Love Spaghetti (iliocostalis, longissimus, spinalis); deeper: semispinalis, multifidus, rotatores. Anatomy flashcards and nursing school study tips from Book Plume. Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume."
pin_s_title="Can You Name This Back Muscle? Erector Spinae Quiz | Nursing School Study Tips"
pin_s_text="Can you name this back muscle? Anatomy quiz: the erector spinae holds you upright. Its 3 columns with the I Love Spaghetti trick: iliocostalis, longissimus, spinalis. Anatomy flashcards and nursing school study tips from Book Plume. Images: Gray's Anatomy (1918), Fig. 389, public domain."
assert len(yt_title)<=95 and yt_title.endswith(" #shorts"); assert len(tt_title)<=90; assert len(tt_head)<=150
assert len(pin_v_title)<=90 and len(pin_s_title)<=90 and len(pin_v_text)<=480 and len(pin_s_text)<=480
for l in [utm('youtube','short'),utm('pinterest','short'),utm('pinterest','pin')]: assert "utm_source=" in l and "utm_campaign=" in l
assert "utm_source=" in yt and "utm_campaign=" in yt
assert "bookplume" not in tt.lower()
print(len(yt_title),len(tt_title),len(tt_head),len(pin_v_title),len(pin_s_title),len(pin_v_text),len(pin_s_text),len(yt),len(ig))
D=dict(B=B,ig=ig,yt=yt,yt_title=yt_title,yt_tags=yt_tags,tt=tt,tt_title=tt_title,pin_v_title=pin_v_title,pin_v_text=pin_v_text,pin_s_title=pin_s_title,pin_s_text=pin_s_text,pl_v=utm('pinterest','short'),pl_s=utm('pinterest','pin'))
json.dump(D,open('texts.json','w'),indent=1,ensure_ascii=False)
