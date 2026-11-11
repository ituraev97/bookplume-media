import json
COL="https://bookplume.com/collections/anatomy-medical-flash-cards"
def utm(src,c): return f"{COL}?utm_source={src}&utm_medium=social&utm_campaign=medial-cord&utm_content={c}"
TAGS="#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #bookplume #brachialplexus #anatomymnemonics"
BODY="""M = Medial pectoral nerve → pectoralis minor + major
M = Medial cutaneous nerve of the arm → skin of the medial arm
M = Medial cutaneous nerve of the forearm → skin of the medial forearm
M = Median nerve, its medial root (the lateral root comes from the lateral cord)
U = Ulnar nerve → the "funny bone" nerve behind the medial epicondyle
Medial cord: roots C8–T1, lies medial to the axillary artery."""
CRED="Images: Gray's Anatomy (1918), Fig. 809, public domain; diagrams: Book Plume"
text=f"""Medial cord of the brachial plexus: can you name all 5 branches in 10 seconds? Mnemonic: M4U (4 M's + a U).
{BODY}
Quick test: the median nerve has a second root. Which cord gives it? Answer in the video.
Save this for your next anatomy exam.
Study with: Anatomy Flash Cards (visual learning set) → bookplume.com
{CRED}
{TAGS}"""
yt_desc=f"""Medial cord of the brachial plexus mnemonic: M4U = 4 M's + a U. The 5 branches of the medial cord in under 30 seconds.
{BODY}
Quick test: the median nerve has a second root. Which cord gives it? The lateral cord; the two roots join in front of the axillary artery.
Save this for your next anatomy exam.
Study with: Anatomy & medical flash cards → {utm('youtube','short')}
{CRED}
Study and exam prep only.
{TAGS}"""
tt_title="Medial cord: name all 5 branches in 10 seconds? M4U brachial plexus mnemonic"
yt_title="Medial Cord Brachial Plexus Mnemonic (M4U) | 5 Branches in 10 Seconds #shorts"
pin_title="Medial Cord Brachial Plexus Mnemonic: M4U | 5 Branches Anatomy Study Tip"
pin2_title="Medial Cord Cheat Sheet: Pectoral, Cutaneous, Median, Ulnar | Brachial Plexus"
pin_desc=f"""Medial cord of the brachial plexus = M4U: medial pectoral, medial cutaneous nerve of the arm, medial cutaneous nerve of the forearm, median (medial root), ulnar. The median nerve's second root comes from the lateral cord. Anatomy flashcards and nursing school study tips from Book Plume. {CRED}. #anatomy #nursingschool #brachialplexus"""
yt_tags=["medial cord brachial plexus","brachial plexus mnemonic","medial cord branches","M4U mnemonic","ulnar nerve","median nerve","medial pectoral nerve","medial cutaneous nerve","anatomy mnemonics","nursing school anatomy"]
assert len(tt_title)<=90 and len(yt_title)<=95 and yt_title.endswith("#shorts") and len(pin_title)<=90 and len(pin2_title)<=90 and len(pin_desc)<=480, (len(tt_title),len(yt_title),len(pin_title),len(pin2_title),len(pin_desc))
for l in [utm('youtube','short'),utm('pinterest','short'),utm('pinterest','pin')]: assert "utm_source=" in l and "utm_campaign=" in l
assert utm('youtube','short') in yt_desc
json.dump(dict(text=text,yt_desc=yt_desc,tt_title=tt_title,yt_title=yt_title,pin_title=pin_title,pin2_title=pin2_title,pin_desc=pin_desc,yt_tags=yt_tags,pinlink_v=utm('pinterest','short'),pinlink_i=utm('pinterest','pin')),open('texts.json','w'),indent=1,ensure_ascii=False)
print(len(tt_title),len(yt_title),len(pin_title),len(pin2_title),len(pin_desc),len(text),len(yt_desc))
