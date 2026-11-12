import json
COL="https://bookplume.com/collections/anatomy-medical-flash-cards"
def utm(src,c): return f"{COL}?utm_source={src}&utm_medium=social&utm_campaign=cervical-plexus&utm_content={c}"
TAGS="#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #bookplume #cervicalplexus #anatomymnemonics"
BODY="""4 skin nerves = 2 UP, 1 ACROSS, 1 DOWN (all exit at Erb's point, behind the middle of sternocleidomastoid):
↑ Lesser occipital (C2) → scalp behind the ear
↑ Great auricular (C2–C3) → ear + skin over the angle of the jaw
→ Transverse cervical (C2–C3) → skin of the front of the neck
↓ Supraclavicular (C3–C4) → skin over the collarbone, upper chest + shoulder
+ 2 motor nerves:
Phrenic (C3, C4, C5) → the diaphragm
Ansa cervicalis (C1–C3) → the strap (infrahyoid) muscles"""
CRED="Images: Gray's Anatomy (1918), Figs. 804 + 805, public domain; diagrams: Book Plume"
text=f"""Cervical plexus: can you name all 6 branches? Mnemonic: 2 up, 1 across, 1 down + 2 motor.
{BODY}
Quick test: which branch keeps you breathing? Answer in the video.
Save this for your next anatomy exam.
Study with: Anatomy Flash Cards (visual learning set) → bookplume.com
{CRED}
{TAGS}"""
yt_desc=f"""Cervical plexus branches mnemonic: 2 up, 1 across, 1 down + 2 motor nerves. The 6 branches of the cervical plexus in 30 seconds.
{BODY}
Quick test: which branch keeps you breathing? The phrenic nerve: "C3, 4, 5 keeps the diaphragm alive."
Save this for your next anatomy exam.
Study with: Anatomy & medical flash cards → {utm('youtube','short')}
{CRED}
Sources: TeachMeAnatomy, The Cervical Plexus; Radiopaedia, Cervical plexus; Gray's Anatomy (1918), The Cervical Nerves.
Study and exam prep only.
{TAGS}"""
tt_title="Cervical plexus: name all 6 branches? 2 up, 1 across, 1 down + phrenic C3-4-5"
yt_title="Cervical Plexus Branches Mnemonic | 2 Up, 1 Across, 1 Down #shorts"
pin_title="Cervical Plexus Branches Mnemonic: 2 Up, 1 Across, 1 Down | Anatomy Study Tip"
pin2_title="Cervical Plexus Cheat Sheet: Erb's Point, Phrenic C3-4-5, Ansa Cervicalis"
pin_desc=f"""Cervical plexus = 4 skin nerves at Erb's point (2 up: lesser occipital, great auricular; 1 across: transverse cervical; 1 down: supraclavicular) + 2 motor: phrenic (C3, 4, 5 keeps the diaphragm alive) and ansa cervicalis. Anatomy flashcards and nursing school study tips from Book Plume. {CRED}. #anatomy #nursingschool #cervicalplexus"""
yt_tags=["cervical plexus","cervical plexus branches","cervical plexus mnemonic","phrenic nerve","erb's point","great auricular nerve","ansa cervicalis","anatomy mnemonics","nursing school anatomy","neck anatomy"]
assert len(tt_title)<=90 and len(yt_title)<=95 and yt_title.endswith("#shorts") and len(pin_title)<=90 and len(pin2_title)<=90 and len(pin_desc)<=480, (len(tt_title),len(yt_title),len(pin_title),len(pin2_title),len(pin_desc))
for l in [utm('youtube','short'),utm('pinterest','short'),utm('pinterest','pin')]: assert "utm_source=" in l and "utm_campaign=" in l
assert utm('youtube','short') in yt_desc
json.dump(dict(text=text,yt_desc=yt_desc,tt_title=tt_title,yt_title=yt_title,pin_title=pin_title,pin2_title=pin2_title,pin_desc=pin_desc,yt_tags=yt_tags,pinlink_v=utm('pinterest','short'),pinlink_i=utm('pinterest','pin')),open('texts.json','w'),indent=1,ensure_ascii=False)
print(len(tt_title),len(yt_title),len(pin_title),len(pin2_title),len(pin_desc),len(text),len(yt_desc))
