import json
COL="https://bookplume.com/collections/anatomy-medical-flash-cards"
def utm(src,c): return f"{COL}?utm_source={src}&utm_medium=social&utm_campaign=carotid-sheath&utm_content={c}"
TAGS="#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #bookplume #headandneck #anatomymnemonics"
BODY="""I see = Internal carotid artery (up top, above the split)
10 = cranial nerve X, the Vagus nerve (behind, between artery + vein)
CC = Common carotid artery (down low, below the split)
IV = Internal jugular vein (lateral)
Who sits where: artery medial, vein lateral, vagus posterior between them. The external carotid leaves the sheath at the split; deep cervical lymph nodes run along it."""
CRED="Images: Gray's Anatomy (1918), Fig. 384, public domain; diagrams: Book Plume"
text=f"""Carotid sheath: can you name all 4 things inside it? Mnemonic: I see 10 CC's in the IV.
{BODY}
Quick test: is the sympathetic trunk inside the carotid sheath? Answer in the video.
Save this for your next anatomy exam.
Study with: Anatomy Flash Cards (visual learning set) → bookplume.com
{CRED}
{TAGS}"""
yt_desc=f"""Carotid sheath contents mnemonic: I see 10 CC's in the IV. The 4 structures inside the carotid sheath in under 30 seconds.
{BODY}
Quick test: is the sympathetic trunk inside the carotid sheath? No: it lies behind the sheath, in the prevertebral fascia.
Save this for your next anatomy exam.
Study with: Anatomy & medical flash cards → {utm('youtube','short')}
{CRED}
Sources: StatPearls (NCBI Bookshelf), Anatomy, Head and Neck, Carotid Sheath; Kenhub, Carotid sheath; Gray's Anatomy (1918), The Fascia Colli.
Study and exam prep only.
{TAGS}"""
tt_title="Carotid sheath: name all 4 inside? I see 10 CC's in the IV mnemonic"
yt_title="Carotid Sheath Contents Mnemonic: I See 10 CC's in the IV #shorts"
pin_title="Carotid Sheath Contents Mnemonic: I See 10 CC's in the IV | Neck Anatomy"
pin2_title="Carotid Sheath Cheat Sheet: Carotid Arteries, Vagus, Internal Jugular Vein"
pin_desc=f"""Carotid sheath contents = I see 10 CC's in the IV: internal carotid, vagus nerve (CN X), common carotid, internal jugular vein. Artery medial, vein lateral, vagus behind. Sympathetic trunk lies behind the sheath. Anatomy flashcards and nursing school study tips from Book Plume. {CRED}. #anatomy #nursingschool #carotidsheath"""
yt_tags=["carotid sheath","carotid sheath contents","carotid sheath mnemonic","I see 10 CC's in the IV","internal jugular vein","common carotid artery","vagus nerve","neck anatomy","anatomy mnemonics","nursing school anatomy"]
assert len(tt_title)<=90 and len(yt_title)<=95 and yt_title.endswith("#shorts") and len(pin_title)<=90 and len(pin2_title)<=90 and len(pin_desc)<=480, (len(tt_title),len(yt_title),len(pin_title),len(pin2_title),len(pin_desc))
for l in [utm('youtube','short'),utm('pinterest','short'),utm('pinterest','pin')]: assert "utm_source=" in l and "utm_campaign=" in l
assert utm('youtube','short') in yt_desc
json.dump(dict(text=text,yt_desc=yt_desc,tt_title=tt_title,yt_title=yt_title,pin_title=pin_title,pin2_title=pin2_title,pin_desc=pin_desc,yt_tags=yt_tags,pinlink_v=utm('pinterest','short'),pinlink_i=utm('pinterest','pin')),open('texts.json','w'),indent=1,ensure_ascii=False)
print(len(tt_title),len(yt_title),len(pin_title),len(pin2_title),len(pin_desc),len(text),len(yt_desc))
