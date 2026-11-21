import json
COL="https://bookplume.com/collections/anatomy-medical-flash-cards"
def utm(src,c): return f"{COL}?utm_source={src}&utm_medium=social&utm_campaign=carpal-bones-mnemonic&utm_content={c}"
BODY="""Carpal bones mnemonic: Sally Left The Party To Take Cathy Home
S = Scaphoid
L = Lunate
T = Triquetrum
P = Pisiform
(forearm row, thumb side → pinky side)
T = Trapezium
T = Trapezoid
C = Capitate
H = Hamate
(finger row, thumb side → pinky side)"""
CRED="Images: Gray's Anatomy (1918), Fig. 220, public domain; diagrams: Book Plume"
HT="#anatomy #humanbody #anatomyquiz #nursingschool #medstudent #anatomymnemonics #carpalbones #handanatomy"
text=f"""Can you name all 8 wrist bones? One sentence does it ✋
{BODY}
Quick test: trapezium or trapezoid, which one sits under your thumb? Answer in the video.
Save this for your next anatomy exam.
{CRED}
{HT}"""
tt_text="Can you name all 8 wrist bones? One sentence does it ✋ #anatomy #anatomymnemonics #nursingschool #medstudent #carpalbones"
tt_title="Can you name all 8 wrist bones? Carpal bones mnemonic"
yt_title="Can You Name All 8 Wrist Bones? Carpal Bones Mnemonic #shorts"
pin_title="Carpal Bones Mnemonic: Sally Left The Party To Take Cathy Home"
pin_desc=f"Carpal bones mnemonic for anatomy class: Sally Left The Party To Take Cathy Home = scaphoid, lunate, triquetrum, pisiform (forearm row) and trapezium, trapezoid, capitate, hamate (finger row), thumb side first. Trick: the trapezium sits under the thumb. {CRED}."
yt_tags=["carpal bones","carpal bones mnemonic","wrist bones","hand bones anatomy","scaphoid","trapezium vs trapezoid","anatomy mnemonics","anatomy quiz","nursing school anatomy","anatomy and physiology"]
pin_link=utm('pinterest','video')
assert len(tt_title)<=90 and len(yt_title)<=95 and yt_title.endswith(" #shorts") and len(pin_title)<=90 and len(pin_desc)<=480, (len(tt_title),len(yt_title),len(pin_title),len(pin_desc))
assert len(tt_text.split(" #")[0])<=150
assert "utm_source=" in pin_link and "utm_campaign=" in pin_link
for s in (text,tt_text,pin_title,pin_desc,yt_title): assert "bookplume" not in s.lower() and "Study with" not in s and "flashcard" not in s.lower()
json.dump(dict(text=text,tt_text=tt_text,tt_title=tt_title,yt_title=yt_title,pin_title=pin_title,pin_desc=pin_desc,yt_tags=yt_tags,pin_link=pin_link),open('texts.json','w'),indent=1,ensure_ascii=False)
print(len(tt_title),len(yt_title),len(pin_title),len(pin_desc),len(text))
