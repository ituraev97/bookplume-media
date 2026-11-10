import json
COL="https://bookplume.com/collections/anatomy-medical-flash-cards"
def utm(src,c): return f"{COL}?utm_source={src}&utm_medium=social&utm_campaign=tongue-muscles&utm_content={c}"
TAGS="#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #bookplume #tonguemuscles #anatomymnemonics"
BODY="""4 extrinsic muscles MOVE it = Go Have Some Pizza
G = genioglossus (from the chin, sticks the tongue out)
H = hyoglossus (from the hyoid, pulls it down)
S = styloglossus (from the styloid process, pulls it up and back)
P = palatoglossus (from the soft palate, lifts the back)
+ 4 intrinsic muscles change its SHAPE: superior longitudinal, inferior longitudinal, transverse, vertical"""
CRED="Images: Gray's Anatomy (1918), Fig. 1019, public domain; diagrams: Book Plume"
text=f"""Tongue muscles mnemonic: your tongue isn't one muscle, it's 8. Can you name them? 👅
{BODY}
Quick test: which tongue muscle is NOT supplied by the hypoglossal nerve? Answer in the video.
Save this for your next anatomy exam.
Study with: Anatomy Flash Cards (visual learning set) → bookplume.com
{CRED}
{TAGS}"""
yt_desc=f"""Tongue muscles mnemonic: Go Have Some Pizza. Your tongue is 8 muscles, 4 extrinsic + 4 intrinsic.
{BODY}
Quick test: which tongue muscle is NOT supplied by the hypoglossal nerve (CN XII)? Palatoglossus: vagus nerve (CN X).
Save this for your next anatomy exam.
Study with: Anatomy & medical flash cards → {utm('youtube','short')}
{CRED}
Study and exam prep only.
{TAGS}"""
tt_title="Tongue muscles mnemonic 👅 Your tongue is 8 muscles. Can you name them?"
yt_title="Tongue Muscles Mnemonic (Go Have Some Pizza) | Extrinsic Tongue Muscles #shorts"
pin_title="Tongue Muscles Mnemonic: Go Have Some Pizza | Extrinsic + Intrinsic Tongue Muscles"
pin2_title="Muscles of the Tongue Cheat Sheet: 8 Muscles, Go Have Some Pizza Mnemonic"
pin_desc=f"""Your tongue is 8 muscles. Extrinsic = Go Have Some Pizza: genioglossus, hyoglossus, styloglossus, palatoglossus. Intrinsic: superior + inferior longitudinal, transverse, vertical. All CN XII except palatoglossus (vagus). Anatomy flashcards and nursing school study tips from Book Plume. {CRED}. #anatomy #nursingschool #tonguemuscles"""
assert len(tt_title)<=90 and len(yt_title)<=95 and yt_title.endswith("#shorts") and len(pin_title)<=90 and len(pin2_title)<=90 and len(pin_desc)<=480, (len(tt_title),len(yt_title),len(pin_title),len(pin2_title),len(pin_desc))
for l in [utm('youtube','short'),utm('pinterest','short'),utm('pinterest','pin')]: assert "utm_source=" in l and "utm_campaign=" in l
assert utm('youtube','short') in yt_desc
json.dump(dict(text=text,yt_desc=yt_desc,tt_title=tt_title,yt_title=yt_title,pin_title=pin_title,pin2_title=pin2_title,pin_desc=pin_desc,pinlink_v=utm('pinterest','short'),pinlink_i=utm('pinterest','pin')),open('texts.json','w'),indent=1,ensure_ascii=False)
print(len(tt_title),len(yt_title),len(pin_title),len(pin2_title),len(pin_desc),len(text))
