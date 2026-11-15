import json
B="https://raw.githubusercontent.com/ituraev97/bookplume-media/media-20261115-snuffbox/v/"
COL="https://bookplume.com/collections/anatomy-medical-flash-cards"
SLUG="anatomical-snuffbox"
utm=lambda src,c: f"{COL}?utm_source={src}&utm_medium=social&utm_campaign={SLUG}&utm_content={c}"
TAGS="#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #anatomyquiz #bookplume #anatomicalsnuffbox #handanatomy"
BODY="""Anatomical snuffbox = the hollow on the thumb side of the back of your wrist (it shows when you lift your thumb).
Trick: 2-1-2-1
2 tendons on the thumb side: abductor pollicis longus (APL) + extensor pollicis brevis (EPB)
1 tendon on the other side: extensor pollicis longus (EPL)
2 bones in the floor: scaphoid + trapezium
1 artery inside: the radial artery (you can feel its pulse there)
Proximal border: styloid process of the radius."""
ig=f"""Name this hollow in 3 seconds? Anatomical snuffbox quiz + the 2-1-2-1 trick.
{BODY}
Quick test: which artery crosses the snuffbox floor? Answer in the video.
Save this for your next anatomy exam.
Study with: Anatomy Flash Cards (visual learning set) → bookplume.com
Images: Gray's Anatomy (1918), Figs. 418, 220 + 529, public domain; diagrams: Book Plume
{TAGS}"""
yt=f"""Anatomy quiz: name this hollow in 3 seconds, then learn the anatomical snuffbox with one trick: 2-1-2-1.
{BODY}
Quick test: which artery crosses the floor? The radial artery. 1918 atlas names: "Navicular" = scaphoid, "Greater multangular" = trapezium.
Save this for your next anatomy exam.
Study with: Anatomy & medical flash cards → {utm('youtube','short')}
Images: Gray's Anatomy (1918), Figs. 418, 220 + 529, public domain; diagrams: Book Plume
Sources: TeachMeAnatomy, The Anatomical Snuffbox (teachmeanatomy.info/upper-limb/areas/anatomical-snuffbox/); NCBI StatPearls, Anatomy, Shoulder and Upper Limb: Hand Anatomical Snuff Box (ncbi.nlm.nih.gov/books/NBK482228/).
Study and exam prep only.
{TAGS}"""
yt_title="Name This Hollow in 3 Seconds? Anatomical Snuffbox Quiz (2-1-2-1 Trick) #shorts"
yt_tags=["anatomical snuffbox","snuffbox anatomy","hand anatomy","wrist anatomy","radial artery","scaphoid","extensor pollicis longus","anatomy quiz","anatomy mnemonics","nursing school"]
tt_title="Name this hollow in 3 seconds?"
tt_head="Name this hollow in 3 seconds? Hint: lift your thumb and you'll see it."
tt=tt_head+"\n#anatomy #anatomyquiz #nursingschool #medstudent #handanatomy"
pin_v_title="Anatomical Snuffbox Quiz: Name This Hollow in 3 Seconds (2-1-2-1 Trick)"
pin_v_text="Anatomy quiz: name this hollow in 3 seconds. Anatomical snuffbox trick 2-1-2-1: 2 tendons (abductor pollicis longus + extensor pollicis brevis), 1 tendon (extensor pollicis longus), 2 floor bones (scaphoid + trapezium), 1 artery (radial). Anatomy flashcards and nursing school study tips from Book Plume. Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume."
pin_s_title="Can You Name This Hollow? Anatomical Snuffbox Quiz | Nursing School Study Tips"
pin_s_text="Can you name this hollow at the base of the thumb? Anatomy quiz: the anatomical snuffbox, 2-1-2-1 = 2 tendons, 1 tendon, 2 floor bones (scaphoid, trapezium), 1 artery (radial). Anatomy flashcards and nursing school study tips from Book Plume. Images: Gray's Anatomy (1918), Fig. 418, public domain."
assert len(yt_title)<=95 and yt_title.endswith(" #shorts"); assert len(tt_title)<=90; assert len(tt_head)<=150
assert len(pin_v_title)<=90 and len(pin_s_title)<=90 and len(pin_v_text)<=480 and len(pin_s_text)<=480
for l in [utm('youtube','short'),utm('pinterest','short'),utm('pinterest','pin')]: assert "utm_source=" in l and "utm_campaign=" in l
assert "utm_source=" in yt and "utm_campaign=" in yt
assert "bookplume" not in tt.lower()
print(len(yt_title),len(tt_title),len(tt_head),len(pin_v_title),len(pin_s_title),len(pin_v_text),len(pin_s_text),len(yt),len(ig))
D=dict(B=B,ig=ig,yt=yt,yt_title=yt_title,yt_tags=yt_tags,tt=tt,tt_title=tt_title,pin_v_title=pin_v_title,pin_v_text=pin_v_text,pin_s_title=pin_s_title,pin_s_text=pin_s_text,pl_v=utm('pinterest','short'),pl_s=utm('pinterest','pin'))
json.dump(D,open('texts.json','w'),indent=1,ensure_ascii=False)
