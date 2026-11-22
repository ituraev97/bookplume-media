import json
COL="https://bookplume.com/collections/anatomy-medical-flash-cards"
def utm(src,c): return f"{COL}?utm_source={src}&utm_medium=social&utm_campaign=forearm-flexors-mnemonic&utm_content={c}"
BODY="""Superficial forearm flexors mnemonic: Pass, Fail, Pass, Fail
P = Pronator teres (index finger)
F = Flexor carpi radialis (middle finger)
P = Palmaris longus (ring finger)
F = Flexor carpi ulnaris (little finger)
(thumb side → pinky side)
Hand trick: put the heel of your other hand on the bony bump inside your elbow (the medial epicondyle) and spread your fingers down your forearm. All four share that starting point."""
CRED="Images: Gray's Anatomy (1918), Fig. 414, public domain; diagrams: Book Plume"
HT="#anatomy #humanbody #anatomyquiz #nursingschool #medstudent #anatomymnemonics #forearmmuscles #upperlimb"
text=f"""Can you name all 4 superficial forearm flexors? One hand does it ✋
{BODY}
Quick test: which one is supplied by the ulnar nerve? Answer in the video.
Save this for your next anatomy exam.
{CRED}
{HT}"""
tt_text="Can you name all 4 superficial forearm flexors? Your own hand is the cheat sheet ✋ #anatomy #anatomymnemonics #nursingschool #medstudent #forearmmuscles"
tt_title="Can you name all 4 forearm flexors? Pass Fail Pass Fail mnemonic"
yt_title="Can You Name All 4 Forearm Flexors? Pass Fail Pass Fail Mnemonic #shorts"
pin_title="Forearm Flexor Muscles Mnemonic: Pass Fail Pass Fail Hand Trick"
pin_desc=f"Superficial forearm flexors mnemonic for anatomy class: Pass, Fail, Pass, Fail = pronator teres, flexor carpi radialis, palmaris longus and flexor carpi ulnaris, thumb side to pinky side. Hand trick: heel of your other hand on the medial epicondyle, fingers spread down the forearm. Only flexor carpi ulnaris gets the ulnar nerve; the other three get the median nerve. {CRED}."
yt_tags=["forearm flexors","forearm muscles","superficial forearm flexors mnemonic","pronator teres","flexor carpi ulnaris","palmaris longus","anatomy mnemonics","upper limb anatomy","nursing school anatomy","anatomy and physiology"]
pin_link=utm('pinterest','video')
assert len(tt_title)<=90 and len(yt_title)<=95 and yt_title.endswith(" #shorts") and len(pin_title)<=90 and len(pin_desc)<=480, (len(tt_title),len(yt_title),len(pin_title),len(pin_desc))
assert len(tt_text.split(" #")[0])<=150
assert "utm_source=" in pin_link and "utm_campaign=" in pin_link
for s in (text,tt_text,pin_title,pin_desc,yt_title): assert "bookplume" not in s.lower() and "Study with" not in s and "flashcard" not in s.lower()
json.dump(dict(text=text,tt_text=tt_text,tt_title=tt_title,yt_title=yt_title,pin_title=pin_title,pin_desc=pin_desc,yt_tags=yt_tags,pin_link=pin_link),open('texts.json','w'),indent=1,ensure_ascii=False)
print(len(tt_title),len(yt_title),len(pin_title),len(pin_desc),len(text))
