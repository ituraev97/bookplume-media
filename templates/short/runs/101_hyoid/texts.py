import json
B="https://raw.githubusercontent.com/ituraev97/bookplume-media/media-20261116-hyoid/v/"
COL="https://bookplume.com/collections/anatomy-medical-flash-cards"
SLUG="hyoid-muscles"
utm=lambda src,c: f"{COL}?utm_source={src}&utm_medium=social&utm_campaign={SLUG}&utm_content={c}"
TAGS="#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #anatomyquiz #bookplume #neckmuscles #hyoid"
BODY="""Hyoid muscles = 8: 4 above the hyoid bone, 4 below it.
Above (suprahyoid), Don't Swallow My Gum: Digastric, Stylohyoid, Mylohyoid, Geniohyoid. They lift the hyoid when you swallow.
Below (infrahyoid), TOSS: Thyrohyoid, Omohyoid, Sternothyroid, Sternohyoid. They pull it back down.
Omohyoid: omo = shoulder; its inferior belly starts on the scapula (shoulder blade)."""
ig=f"""Can you name all 8 hyoid muscles? Start with this neck muscle in 3 seconds 👀
{BODY}
Quick test: which one forms the floor of your mouth? Answer in the video.
Save this for your next anatomy exam.
Study with: Anatomy Flash Cards (visual learning set) → bookplume.com
Images: Gray's Anatomy (1918), Fig. 386, public domain; diagrams: Book Plume
{TAGS}"""
yt=f"""Anatomy quiz: name this neck muscle in 3 seconds, then learn all 8 hyoid muscles (suprahyoid + infrahyoid) with 2 tricks: Don't Swallow My Gum and TOSS.
{BODY}
Quick test: which one forms the floor of your mouth? The mylohyoid.
Full video on our channel: What Happens in Your Body When You Swallow (Second by Second).
Study with: Anatomy & medical flash cards → {utm('youtube','short')}
Images: Gray's Anatomy (1918), Fig. 386, public domain; diagrams: Book Plume
Sources: TeachMeAnatomy, The Suprahyoid Muscles (teachmeanatomy.info/neck/muscles/suprahyoid-muscles/) and The Infrahyoid Muscles (teachmeanatomy.info/neck/muscles/infrahyoid/); Gray's Anatomy of the Human Body (1918), Fig. 386.
Study and exam prep only.
{TAGS}"""
yt_title="Name This Neck Muscle in 3 Seconds? Hyoid Muscles Quiz (Suprahyoid + Infrahyoid) #shorts"
yt_tags=["hyoid muscles","suprahyoid muscles","infrahyoid muscles","omohyoid","mylohyoid","neck muscles anatomy","strap muscles","hyoid muscles mnemonic","anatomy quiz","nursing school anatomy"]
tt_title="Name this neck muscle in 3 seconds?"
tt_head="Name this neck muscle in 3 seconds? Hint: its name points to your shoulder."
tt=tt_head+"\n#anatomy #anatomyquiz #nursingschool #medstudent #neckmuscles"
pin_v_title="Hyoid Muscles Quiz: Name This Neck Muscle in 3 Seconds (Suprahyoid + TOSS)"
pin_v_text="Anatomy quiz: name this neck muscle in 3 seconds. 8 hyoid muscles: 4 above (Don't Swallow My Gum: digastric, stylohyoid, mylohyoid, geniohyoid) lift the hyoid; 4 below (TOSS: thyrohyoid, omohyoid, sternothyroid, sternohyoid) pull it down. Anatomy flashcards and nursing school study tips from Book Plume. Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume."
pin_s_title="Can You Name This Neck Muscle? Hyoid Muscles Quiz | Nursing School Study Tips"
pin_s_text="Can you name this neck muscle? Anatomy quiz from Gray's Fig. 386: it's one of 8 hyoid muscles. Tricks: Don't Swallow My Gum (suprahyoid) and TOSS (infrahyoid). Anatomy flashcards and nursing school study tips from Book Plume. Images: Gray's Anatomy (1918), Fig. 386, public domain."
assert len(yt_title)<=95 and yt_title.endswith(" #shorts"); assert len(tt_title)<=90; assert len(tt_head)<=150
assert len(pin_v_title)<=90 and len(pin_s_title)<=90 and len(pin_v_text)<=480 and len(pin_s_text)<=480
for l in [utm('youtube','short'),utm('pinterest','short'),utm('pinterest','pin')]: assert "utm_source=" in l and "utm_campaign=" in l
assert "utm_source=" in yt and "utm_campaign=" in yt
assert "bookplume" not in tt.lower()
print(len(yt_title),len(tt_title),len(tt_head),len(pin_v_title),len(pin_s_title),len(pin_v_text),len(pin_s_text),len(yt),len(ig))
D=dict(B=B,ig=ig,yt=yt,yt_title=yt_title,yt_tags=yt_tags,tt=tt,tt_title=tt_title,pin_v_title=pin_v_title,pin_v_text=pin_v_text,pin_s_title=pin_s_title,pin_s_text=pin_s_text,pl_v=utm('pinterest','short'),pl_s=utm('pinterest','pin'))
json.dump(D,open('texts.json','w'),indent=1,ensure_ascii=False)
