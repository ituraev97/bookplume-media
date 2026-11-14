import json
B="https://raw.githubusercontent.com/ituraev97/bookplume-media/media-20261115-mastication/v/"
COL="https://bookplume.com/collections/anatomy-medical-flash-cards"
SLUG="muscles-of-mastication"
utm=lambda src,c: f"{COL}?utm_source={src}&utm_medium=social&utm_campaign={SLUG}&utm_content={c}"
TAGS="#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #anatomyquiz #bookplume #musclesofmastication #headandneckanatomy"
BODY="""4 muscles of mastication = 3 close + 1 opens
3 CLOSE the jaw: Masseter (the most powerful chewing muscle), Temporalis, Medial pterygoid
1 helps OPEN it: Lateral pterygoid (it also pulls the jaw forward). Trick: Lateral = Lowers.
Nerve: all 4 = mandibular nerve (CN V3), a branch of the trigeminal nerve."""
ig=f"""Name this chewing muscle in 3 seconds? Muscles of mastication quiz + the 3-close-1-opens trick.
{BODY}
Quick test: which one helps you open your mouth? Answer in the video.
Save this for your next anatomy exam.
Study with: Anatomy Flash Cards (visual learning set) → bookplume.com
Images: Gray's Anatomy (1918), Figs. 378, 382, 383, public domain; diagrams: Book Plume
{TAGS}"""
yt=f"""Anatomy quiz: name this chewing muscle in 3 seconds, then learn all 4 muscles of mastication with one trick: 3 close, 1 opens.
{BODY}
Quick test: which one helps you open your mouth? The lateral pterygoid. 1918 atlas names: "Pterygoideus externus" = lateral pterygoid, "Pterygoideus internus" = medial pterygoid.
Save this for your next anatomy exam.
Study with: Anatomy & medical flash cards → {utm('youtube','short')}
Images: Gray's Anatomy (1918), Figs. 378, 382, 383, public domain; diagrams: Book Plume
Sources: TeachMeAnatomy, The Muscles of Mastication (teachmeanatomy.info/head/muscles/mastication/); Gray's Anatomy (1918), The Muscles of Mastication.
Study and exam prep only.
{TAGS}"""
yt_title="Name This Chewing Muscle in 3 Seconds? Muscles of Mastication Quiz #shorts"
yt_tags=["muscles of mastication","chewing muscles","masseter muscle","temporalis muscle","lateral pterygoid","medial pterygoid","anatomy quiz","anatomy mnemonics","head and neck anatomy","nursing school anatomy"]
tt_title="Name this chewing muscle in 3 seconds?"
tt_head="Name this chewing muscle in 3 seconds? Bonus: only one jaw muscle helps you open your mouth."
tt=tt_head+"\n#anatomy #anatomyquiz #nursingschool #medstudent #headandneckanatomy"
pin_v_title="Muscles of Mastication Quiz: Name This Chewing Muscle in 3 Seconds"
pin_v_text="Anatomy quiz: name this chewing muscle in 3 seconds. Muscles of mastication trick: 3 close the jaw (masseter, temporalis, medial pterygoid) + 1 helps open it (lateral pterygoid); all supplied by the mandibular nerve (CN V3). Anatomy flashcards and nursing school study tips from Book Plume. Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume."
pin_s_title="Can You Name the 4 Muscles of Mastication? Anatomy Quiz | Nursing School"
pin_s_text="Can you name all 4 muscles of mastication? Anatomy quiz: 3 close the jaw (masseter, temporalis, medial pterygoid), only the lateral pterygoid helps open it. Anatomy flashcards and nursing school study tips from Book Plume. Images: Gray's Anatomy (1918), Fig. 378, public domain."
assert len(yt_title)<=95 and yt_title.endswith(" #shorts"); assert len(tt_title)<=90; assert len(tt_head)<=150
assert len(pin_v_title)<=90 and len(pin_s_title)<=90 and len(pin_v_text)<=480 and len(pin_s_text)<=480
for l in [utm('youtube','short'),utm('pinterest','short'),utm('pinterest','pin')]: assert "utm_source=" in l and "utm_campaign=" in l
assert "utm_source=" in yt and "utm_campaign=" in yt
assert "bookplume" not in tt.lower()
print(len(yt_title),len(tt_title),len(tt_head),len(pin_v_title),len(pin_s_title),len(pin_v_text),len(pin_s_text),len(yt))
D=dict(B=B,ig=ig,yt=yt,yt_title=yt_title,yt_tags=yt_tags,tt=tt,tt_title=tt_title,pin_v_title=pin_v_title,pin_v_text=pin_v_text,pin_s_title=pin_s_title,pin_s_text=pin_s_text,pl_v=utm('pinterest','short'),pl_s=utm('pinterest','pin'))
json.dump(D,open('texts.json','w'),indent=1,ensure_ascii=False)
