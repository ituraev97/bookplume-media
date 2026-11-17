import json
B="https://raw.githubusercontent.com/ituraev97/bookplume-media/media-20261118-hamstrings/v/"
COL="https://bookplume.com/collections/anatomy-medical-flash-cards"
SLUG="hamstring-muscles"
utm=lambda src,c: f"{COL}?utm_source={src}&utm_medium=social&utm_campaign={SLUG}&utm_content={c}"
TAGS="#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #anatomyquiz #bookplume #hamstrings #legmuscles"
BODY="""Hamstrings = 3 muscles on the back of the thigh: 2 semis on the inside (medial), biceps on the outside (lateral).
Semitendinosus: on top, named for its long, thin tendon. Trick: T = Top.
Semimembranosus: flat and deep, underneath semitendinosus. M = Membrane.
Biceps femoris: the only one on the outside, with 2 heads (long + short).
Most start at your sit bone (ischial tuberosity) and cross the hip AND the knee: they extend the hip and bend the knee.
One nerve runs them all: the sciatic nerve (tibial part; the short head gets the common fibular part)."""
ig=f"""Can you name this hamstring in 3 seconds? Then the 2 others on the back of your thigh 👀
{BODY}
Quick test: which part does NOT cross the hip? Answer in the video.
Save this for your next anatomy exam.
Study with: Anatomy Flash Cards (visual learning set) → bookplume.com
Images: Gray's Anatomy (1918), Fig. 434, public domain; diagrams: Book Plume
{TAGS}"""
yt=f"""Hamstring muscles quiz: name this muscle in 3 seconds, then learn all 3 hamstrings on one map: semitendinosus, semimembranosus and biceps femoris (long + short head) + the sciatic nerve.
{BODY}
Quick test: which part does not cross the hip? The short head of biceps femoris: it starts on the femur (linea aspera), so it only crosses the knee.
Full quiz on our channel: Can You Name These 27 Leg Muscles? (Anatomy Quiz)
Study with: Book Plume anatomy flash cards → {utm('youtube','short')}
Images: Gray's Anatomy (1918), Fig. 434, public domain; diagrams: Book Plume
Sources: TeachMeAnatomy, The Hamstrings (teachmeanatomy.info/lower-limb/muscles/thigh/hamstrings/); StatPearls, Anatomy, Bony Pelvis and Lower Limb: Thigh Hamstring Muscles; Gray's Anatomy of the Human Body (1918), Fig. 434.
Study and exam prep only.
{TAGS}"""
yt_title="Name This Hamstring in 3 Seconds? Hamstring Muscles Anatomy Quiz #shorts"
yt_tags=["hamstring muscles","hamstrings anatomy","semitendinosus","semimembranosus","biceps femoris","posterior thigh muscles","sciatic nerve","anatomy quiz","lower limb anatomy","anatomy mnemonics"]
tt_title="3 hamstring questions. How many can you get?"
tt_head="3 hamstring anatomy questions, 2 seconds each. How many can you get?"
tt=tt_head+"\n#anatomy #anatomyquiz #nursingschool #medstudent #hamstrings"
pin_v_title="Hamstring Muscles Quiz: Name This Muscle in 3 Seconds (Semitendinosus & More)"
pin_v_text="Anatomy quiz: name this hamstring in 3 seconds. 3 hamstrings: 2 semis inside (semitendinosus on top, semimembranosus underneath), biceps femoris outside (long + short head). One nerve: sciatic. Anatomy flashcards and nursing school study tips from Book Plume. Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume."
pin_s_title="Can You Name This Hamstring? Thigh Muscles Anatomy Quiz | Anatomy Flashcards"
pin_s_text="Can you name this hamstring muscle? Anatomy quiz from Gray's Fig. 434. Semitendinosus = T for Top, semimembranosus underneath, biceps femoris on the outside. Nursing and med school study tips and anatomy flashcards from Book Plume. Images: Gray's Anatomy (1918), Fig. 434, public domain."
assert len(yt_title)<=95 and yt_title.endswith(" #shorts"); assert len(tt_title)<=90; assert len(tt_head)<=150
assert len(pin_v_title)<=90 and len(pin_s_title)<=90 and len(pin_v_text)<=480 and len(pin_s_text)<=480
for l in [utm('youtube','short'),utm('pinterest','short'),utm('pinterest','pin')]: assert "utm_source=" in l and "utm_campaign=" in l
assert "utm_source=" in yt and "utm_campaign=" in yt
assert "bookplume" not in tt.lower()
print(len(yt_title),len(tt_title),len(tt_head),len(pin_v_title),len(pin_s_title),len(pin_v_text),len(pin_s_text),len(yt),len(ig))
D=dict(B=B,ig=ig,yt=yt,yt_title=yt_title,yt_tags=yt_tags,tt=tt,tt_title=tt_title,pin_v_title=pin_v_title,pin_v_text=pin_v_text,pin_s_title=pin_s_title,pin_s_text=pin_s_text,pl_v=utm('pinterest','short'),pl_s=utm('pinterest','pin'))
json.dump(D,open('texts.json','w'),indent=1,ensure_ascii=False)
