import json
COL="https://bookplume.com/collections/anatomy-medical-flash-cards"
def utm(src,c): return f"{COL}?utm_source={src}&utm_medium=social&utm_campaign=superior-orbital-fissure-mnemonic&utm_content={c}"
BODY="""Superior orbital fissure mnemonic: two codes, 4 + 4 = 8
Outside the ring: L F T S
L = Lacrimal nerve
F = Frontal nerve
T = Trochlear nerve
S = Superior ophthalmic vein
Inside the ring: S A N I
S = Superior division of the oculomotor nerve
A = Abducens nerve
N = Nasociliary nerve
I = Inferior division of the oculomotor nerve"""
CRED="Images: Gray's Anatomy (1918), Fig. 787, public domain; diagrams: Book Plume"
HT="#anatomy #humanbody #anatomyquiz #nursingschool #medstudent #anatomymnemonics #orbit #cranialnerves"
text=f"""Can you name all 8 structures of the superior orbital fissure? 🧠 L F T S, then S A N I
{BODY}
Quick test: which one of the eight is the vein? Answer in the video.
Save this for your next anatomy exam.
{CRED}
{HT}"""
tt_text="Can you name all 8 structures of the superior orbital fissure? L F T S, then S A N I #anatomy #anatomymnemonics #nursingschool #medstudent #cranialnerves"
tt_title="Name all 8 orbital fissure structures? L F T S, then S A N I"
yt_title="Can You Name All 8 Orbital Fissure Structures? LFTS + SANI Mnemonic #shorts"
pin_title="Superior Orbital Fissure Contents Mnemonic: LFTS and SANI"
pin_desc=f"Superior orbital fissure contents mnemonic for anatomy class: L F T S outside the common tendinous ring (lacrimal nerve, frontal nerve, trochlear nerve, superior ophthalmic vein) and S A N I inside it (superior division of the oculomotor nerve, abducens nerve, nasociliary nerve, inferior division of the oculomotor nerve). {CRED}."
yt_tags=["superior orbital fissure","superior orbital fissure contents","superior orbital fissure mnemonic","orbit anatomy","cranial nerves III IV VI","ophthalmic nerve branches","anatomy mnemonics","head and neck anatomy","nursing school anatomy","anatomy and physiology"]
pin_link=utm('pinterest','video')
assert len(tt_title)<=90 and len(yt_title)<=95 and yt_title.endswith(" #shorts") and len(pin_title)<=90 and len(pin_desc)<=480, (len(tt_title),len(yt_title),len(pin_title),len(pin_desc))
assert len(tt_text.split(" #")[0])<=150, len(tt_text.split(" #")[0])
assert "utm_source=" in pin_link and "utm_campaign=" in pin_link
for s in (text,tt_text,pin_title,pin_desc,yt_title,tt_title): assert "bookplume" not in s.lower() and "Study with" not in s and "flashcard" not in s.lower() and "flash card" not in s.lower()
json.dump(dict(text=text,tt_text=tt_text,tt_title=tt_title,yt_title=yt_title,pin_title=pin_title,pin_desc=pin_desc,yt_tags=yt_tags,pin_link=pin_link),open('texts.json','w'),indent=1,ensure_ascii=False)
print(len(tt_title),len(yt_title),len(pin_title),len(pin_desc),len(text),len(tt_text.split(" #")[0]))
