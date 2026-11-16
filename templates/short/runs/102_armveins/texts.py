import json
B="https://raw.githubusercontent.com/ituraev97/bookplume-media/media-20261116-armveins/v/"
COL="https://bookplume.com/collections/nursing-school-essentials-nclex-prep"
SLUG="superficial-arm-veins"
utm=lambda src,c: f"{COL}?utm_source={src}&utm_medium=social&utm_campaign={SLUG}&utm_content={c}"
TAGS="#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #anatomyquiz #bookplume #armveins #nursingstudent"
BODY="""Superficial veins of the arm = 4:
1. Median cubital: the bridge across the front of the elbow, from the cephalic to the basilic. A common blood-draw (venipuncture) site.
2. Cephalic: runs up the thumb side and climbs to the shoulder, in the groove between the deltoid and pec major, into the axillary vein. Cephalic = "head" (Greek).
3. Basilic: runs up the pinky side, B = Baby finger. It dives deep in the middle of the arm and becomes the axillary vein.
4. Median antebrachial: up the middle of the forearm, into the basilic or median cubital vein."""
ig=f"""Can you name all 4 superficial arm veins? Start with this one in 3 seconds 👀
{BODY}
Quick test: which vein runs between your deltoid and pec? Answer in the video.
Save this for your next anatomy exam.
Study with: Anatomy Flash Cards (visual learning set) → bookplume.com
Images: Gray's Anatomy (1918), Fig. 574, public domain; diagrams: Book Plume
{TAGS}"""
yt=f"""Anatomy quiz: name this arm vein in 3 seconds, then learn all 4 superficial veins of the upper limb on one map: median cubital, cephalic, basilic and median antebrachial.
{BODY}
Quick test: which vein runs between the deltoid and pec major? The cephalic vein.
Study with: Book Plume anatomy & nursing flash cards → {utm('youtube','short')}
Images: Gray's Anatomy (1918), Fig. 574, public domain (1918 names: "vena mediana cubiti" = median cubital, "median antibrachial" = median antebrachial); diagrams: Book Plume
Sources: TeachMeAnatomy, Venous Drainage of the Upper Limb (teachmeanatomy.info/upper-limb/vessels/veins/); StatPearls, Anatomy, Shoulder and Upper Limb, Veins (ncbi.nlm.nih.gov/books/NBK546676/); Gray's Anatomy of the Human Body (1918), Fig. 574.
Study and exam prep only.
{TAGS}"""
yt_title="Name This Vein in 3 Seconds? Arm Veins Quiz: Median Cubital, Cephalic, Basilic #shorts"
yt_tags=["superficial veins of the upper limb","arm veins anatomy","median cubital vein","cephalic vein","basilic vein","median antebrachial vein","venipuncture anatomy","upper limb veins","anatomy quiz","nursing school anatomy"]
tt_title="Name this vein in 3 seconds?"
tt_head="Name this vein in 3 seconds? Nursing students, this one should be easy."
tt=tt_head+"\n#anatomy #anatomyquiz #nursingschool #medstudent #armveins"
pin_v_title="Arm Veins Quiz: Name This Vein in 3 Seconds (Median Cubital, Cephalic, Basilic)"
pin_v_text="Anatomy quiz: name this arm vein in 3 seconds. 4 superficial arm veins on one map: median cubital (the bridge at the elbow, common blood-draw site), cephalic (thumb side → shoulder), basilic (pinky side, B = baby finger), median antebrachial (middle of the forearm). Nursing school study tips from Book Plume. Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume."
pin_s_title="Can You Name This Arm Vein? Superficial Veins Quiz | Nursing School Study Tips"
pin_s_text="Can you name this vein? Anatomy quiz from Gray's Fig. 574: it's one of 4 superficial arm veins (median cubital, cephalic, basilic, median antebrachial). Trick: cephalic = thumb side, B = basilic = baby finger. Nursing school study tips and anatomy flashcards from Book Plume. Images: Gray's Anatomy (1918), Fig. 574, public domain."
car="""How many can you name? 4 superficial arm veins, numbered on Gray's 1918 plate 👀 Swipe for the answers.
1. Median cubital — the bridge across the elbow, a common blood-draw site
2. Cephalic — thumb side → up to the shoulder (deltopectoral groove)
3. Basilic — pinky side: B = Basilic = Baby finger
4. Median antebrachial — up the middle of the forearm
Save this for your next anatomy exam 🔖
Images: Gray's Anatomy (1918), Fig. 574, public domain; diagrams: Book Plume
#anatomy #anatomyquiz #nursingschool #medstudent #studytips #anatomyflashcards #bookplume #armveins"""
assert len(yt_title)<=95 and yt_title.endswith(" #shorts"); assert len(tt_title)<=90; assert len(tt_head)<=150
assert len(pin_v_title)<=90 and len(pin_s_title)<=90 and len(pin_v_text)<=480 and len(pin_s_text)<=480
for l in [utm('youtube','short'),utm('pinterest','short'),utm('pinterest','pin')]: assert "utm_source=" in l and "utm_campaign=" in l
assert "utm_source=" in yt and "utm_campaign=" in yt
assert "bookplume" not in tt.lower()
print(len(yt_title),len(tt_title),len(tt_head),len(pin_v_title),len(pin_s_title),len(pin_v_text),len(pin_s_text),len(yt),len(ig),len(car))
D=dict(B=B,ig=ig,yt=yt,yt_title=yt_title,yt_tags=yt_tags,tt=tt,tt_title=tt_title,pin_v_title=pin_v_title,pin_v_text=pin_v_text,pin_s_title=pin_s_title,pin_s_text=pin_s_text,pl_v=utm('pinterest','short'),pl_s=utm('pinterest','pin'),car=car)
json.dump(D,open('texts.json','w'),indent=1,ensure_ascii=False)
