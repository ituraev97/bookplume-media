import json
COL="https://bookplume.com/collections/anatomy-medical-flash-cards"
def utm(src,c): return f"{COL}?utm_source={src}&utm_medium=social&utm_campaign=intercostal-van-mnemonic&utm_content={c}"
BODY="""Intercostal space mnemonic: think of a VAN, top to bottom
V = Vein
A = Artery
N = Nerve
All three tuck into the costal groove along the lower edge of the rib."""
CRED="Images: Gray's Anatomy (1918), Fig. 819, public domain; diagrams: Book Plume"
HT="#anatomy #humanbody #anatomyquiz #nursingschool #medstudent #anatomymnemonics #ribs #thoracicwall"
text=f"""Can you name the 3 things running along the underside of a rib? Think of a VAN 🚐
{BODY}
Quick test: which one sits lowest? Answer in the video.
Save this for your next anatomy exam.
{CRED}
{HT}"""
tt_text="Can you name the 3 things under the edge of a rib? Think of a VAN: V-A-N #anatomy #anatomymnemonics #nursingschool #medstudent #ribs"
tt_title="Name the 3 things under a rib? Think of a VAN: V-A-N"
yt_title="3 Things Under Each Rib: Vein, Artery, Nerve (VAN Mnemonic) #shorts"
pin_title="Intercostal Space Mnemonic: VAN (Vein, Artery, Nerve) Under the Rib"
pin_desc=f"Intercostal space mnemonic for anatomy class: think of a VAN, from the top down. V = vein, A = artery, N = nerve. All three run together in the costal groove along the lower edge of the rib, between the internal and innermost intercostal muscles. {CRED}."
yt_tags=["intercostal space","intercostal neurovascular bundle","VAN mnemonic","costal groove","vein artery nerve mnemonic","anatomy mnemonics","rib anatomy","thoracic wall anatomy","nursing school anatomy","anatomy and physiology"]
pin_link=utm('pinterest','video')
assert len(tt_title)<=90 and len(yt_title)<=95 and yt_title.endswith(" #shorts") and len(pin_title)<=90 and len(pin_desc)<=480, (len(tt_title),len(yt_title),len(pin_title),len(pin_desc))
assert len(tt_text.split(" #")[0])<=150, len(tt_text.split(" #")[0])
assert "utm_source=" in pin_link and "utm_campaign=" in pin_link
for s in (text,tt_text,pin_title,pin_desc,yt_title,tt_title): assert "bookplume" not in s.lower() and "Study with" not in s and "flashcard" not in s.lower()
json.dump(dict(text=text,tt_text=tt_text,tt_title=tt_title,yt_title=yt_title,pin_title=pin_title,pin_desc=pin_desc,yt_tags=yt_tags,pin_link=pin_link),open('texts.json','w'),indent=1,ensure_ascii=False)
print(len(tt_title),len(yt_title),len(pin_title),len(pin_desc),len(text),len(tt_text.split(" #")[0]))
