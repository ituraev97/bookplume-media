import json
B="https://raw.githubusercontent.com/ituraev97/bookplume-media/media-20261117-armbbc/v/"
COL="https://bookplume.com/collections/anatomy-medical-flash-cards"
SLUG="arm-muscles-bbc"
utm=lambda src,c: f"{COL}?utm_source={src}&utm_medium=social&utm_campaign={SLUG}&utm_content={c}"
TAGS="#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #anatomyquiz #bookplume #armmuscles #biceps"
BODY="""Front of the arm (anterior compartment) = B · B · C:
Biceps brachii: on top, 2 heads (long head from above the shoulder socket, short head from the coracoid process) → radius. Bends the elbow + turns the palm up (supination).
Brachialis: underneath the biceps, humerus → ulna. A pure elbow flexor.
Coracobrachialis: up high, coracoid process → middle of the humerus. Flexes + adducts the arm at the shoulder.
One nerve supplies all 3: the musculocutaneous nerve (it pierces coracobrachialis)."""
ig=f"""Can you name this arm muscle in 3 seconds? Then the 2 others in the front of your arm + the one nerve that runs all 3 👀
{BODY}
Quick test: which one also turns your palm up? Answer in the video.
Save this for your next anatomy exam.
Study with: Anatomy Flash Cards (visual learning set) → bookplume.com
Images: Gray's Anatomy (1918), Fig. 411, public domain; diagrams: Book Plume
{TAGS}"""
yt=f"""Anatomy quiz: name this arm muscle in 3 seconds, then learn the muscles of the front of the arm with the B·B·C mnemonic — biceps brachii, brachialis, coracobrachialis — and the one nerve that supplies all three (musculocutaneous).
{BODY}
Quick test: which one also turns your palm up? The biceps (supination).
Study with: Book Plume anatomy flash cards → {utm('youtube','short')}
Images: Gray's Anatomy (1918), Fig. 411, public domain; diagrams: Book Plume
Sources: TeachMeAnatomy, Muscles of the Arm (teachmeanatomy.info/upper-limb/muscles/muscles-of-the-arm/); StatPearls, Anatomy, Shoulder and Upper Limb, Brachialis Muscle; Gray's Anatomy of the Human Body (1918), Figs. 411, 413 text.
Study and exam prep only.
{TAGS}"""
yt_title="Name This Arm Muscle in 3 Seconds? Biceps, Brachialis, Coracobrachialis (BBC) #shorts"
yt_tags=["arm muscles anatomy","muscles of the arm","biceps brachii","brachialis","coracobrachialis","musculocutaneous nerve","anterior compartment of arm","upper limb anatomy","anatomy mnemonics","anatomy quiz"]
tt_title="Name this arm muscle in 3 seconds?"
tt_head="Name this arm muscle in 3 seconds? Hint: it's not the biceps."
tt=tt_head+"\n#anatomy #anatomyquiz #nursingschool #medstudent #armmuscles"
pin_v_title="Arm Muscles Quiz: Name This Muscle in 3 Sec + Biceps, Brachialis, Coracobrachialis"
pin_v_text="Anatomy quiz: name this arm muscle in 3 seconds. The front of the arm = B·B·C: biceps brachii (2 heads, on top), brachialis (underneath, pure elbow flexor), coracobrachialis (coracoid → humerus). One nerve supplies all 3: musculocutaneous. Anatomy flashcards and study tips from Book Plume. Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume."
pin_s_title="Can You Name This Arm Muscle? Front of the Arm Quiz | Anatomy Study Tips"
pin_s_text="Can you name this muscle? Anatomy quiz from Gray's Fig. 411: the muscles of the front of the arm. Learn biceps brachii, brachialis and coracobrachialis with the BBC mnemonic + the musculocutaneous nerve that supplies all three. Anatomy flashcards from Book Plume. Images: Gray's Anatomy (1918), Fig. 411, public domain."
car=f"""How many can you name? 4 arm muscle parts, numbered on Gray's 1918 plate 👀 Swipe for the answers.
Cheat sheet — front of the arm = B · B · C:
1 Coracobrachialis: coracoid → middle of the humerus (pierced by the musculocutaneous nerve)
2 Biceps, short head: from the coracoid process
3 Biceps, long head: from above the shoulder socket
4 Brachialis: under the biceps, bends the elbow only
All 3 muscles = musculocutaneous nerve. Biceps also turns the palm up.
Save this for your next anatomy exam 🔖 Comment your score /4.
Study with: Anatomy Flash Cards → bookplume.com
Images: Gray's Anatomy (1918), Fig. 411, public domain
{TAGS}"""
assert len(yt_title)<=95 and yt_title.endswith(" #shorts"); assert len(tt_title)<=90; assert len(tt_head)<=150
assert len(pin_v_title)<=90 and len(pin_s_title)<=90 and len(pin_v_text)<=480 and len(pin_s_text)<=480
for l in [utm('youtube','short'),utm('pinterest','short'),utm('pinterest','pin')]: assert "utm_source=" in l and "utm_campaign=" in l
assert "utm_source=" in yt and "utm_campaign=" in yt
assert "bookplume" not in tt.lower()
print(len(yt_title),len(tt_title),len(tt_head),len(pin_v_title),len(pin_s_title),len(pin_v_text),len(pin_s_text),len(yt),len(ig),len(car))
D=dict(B=B,ig=ig,yt=yt,yt_title=yt_title,yt_tags=yt_tags,tt=tt,tt_title=tt_title,pin_v_title=pin_v_title,pin_v_text=pin_v_text,pin_s_title=pin_s_title,pin_s_text=pin_s_text,pl_v=utm('pinterest','short'),pl_s=utm('pinterest','pin'),car=car)
json.dump(D,open('texts.json','w'),indent=1,ensure_ascii=False)
