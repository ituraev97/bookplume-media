import json
COL="https://bookplume.com/collections/anatomy-medical-flash-cards"
def utm(src,c): return f"{COL}?utm_source={src}&utm_medium=social&utm_campaign=facial-bones&utm_content={c}"
TAGS="#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #bookplume #facialbones #anatomymnemonics"
BODY="""8 names = 14 facial bones. Mnemonic: Virgil Can Not Make My Pet Zebra Laugh
V = Vomer
C = inferior nasal Conchae (x2)
N = Nasal (x2)
M = Maxilla (x2)
M = Mandible
P = Palatine (x2)
Z = Zygomatic (x2)
L = Lacrimal (x2)
6 pairs x 2 + 2 singles = 14."""
CRED="Images: Gray's Anatomy (1918), Fig. 190, public domain; diagrams: Book Plume"
text=f"""Your face has 14 bones and only ONE can move. Facial bones mnemonic in 25 seconds.
{BODY}
Quick test: which 2 facial bones are single? Answer in the video.
Save this for your next anatomy exam.
Study with: Anatomy Flash Cards (visual learning set) → bookplume.com
{CRED}
{TAGS}"""
yt_desc=f"""Facial bones mnemonic: your face has 14 bones and only one of them can move. Learn all 14 facial bones with Virgil Can Not Make My Pet Zebra Laugh.
{BODY}
Quick test: which 2 are single? The vomer (lower part of the nasal septum) and the mandible (lower jaw), the only movable bone of the skull.
Save this for your next anatomy exam.
Study with: Anatomy & medical flash cards → {utm('youtube','short')}
{CRED}
Sources: OpenStax Anatomy & Physiology 2e, 7.2 The Skull (facial bones: 6 paired + 2 unpaired; the mandible is the only moveable bone of the skull); Gray's Anatomy (1918), The Bones of the Face.
Study and exam prep only.
{TAGS}"""
tt_title="Your face has 14 bones. Only 1 moves! Facial bones mnemonic: Virgil Can Not Make..."
yt_title="14 Facial Bones Mnemonic: Only 1 Can Move #shorts"
pin_title="Facial Bones Mnemonic: Virgil Can Not Make My Pet Zebra Laugh | Anatomy Flashcards"
pin2_title="14 Facial Bones Cheat Sheet: 6 Pairs + 2 Singles | Nursing School Anatomy"
pin_desc=f"""Facial bones mnemonic: Virgil Can Not Make My Pet Zebra Laugh = vomer, inferior nasal conchae, nasal, maxilla, mandible, palatine, zygomatic, lacrimal. 8 names, 14 bones: 6 pairs + 2 singles (vomer, mandible). The mandible is the only skull bone that moves. Anatomy flashcards and nursing school study tips from Book Plume. {CRED}. #anatomy #facialbones"""
yt_tags=["facial bones","facial bones mnemonic","14 facial bones","skull bones","mandible","vomer","anatomy mnemonics","nursing school anatomy","anatomy and physiology","skull anatomy"]
carousel=None
assert len(tt_title)<=90 and len(yt_title)<=95 and yt_title.endswith("#shorts") and len(pin_title)<=90 and len(pin2_title)<=90 and len(pin_desc)<=480, (len(tt_title),len(yt_title),len(pin_title),len(pin2_title),len(pin_desc))
for l in [utm('youtube','short'),utm('pinterest','short'),utm('pinterest','pin')]: assert "utm_source=" in l and "utm_campaign=" in l
assert utm('youtube','short') in yt_desc
json.dump(dict(text=text,yt_desc=yt_desc,tt_title=tt_title,yt_title=yt_title,pin_title=pin_title,pin2_title=pin2_title,pin_desc=pin_desc,yt_tags=yt_tags,pinlink_v=utm('pinterest','short'),pinlink_i=utm('pinterest','pin')),open('texts.json','w'),indent=1,ensure_ascii=False)
print(len(tt_title),len(yt_title),len(pin_title),len(pin2_title),len(pin_desc),len(text),len(yt_desc))
