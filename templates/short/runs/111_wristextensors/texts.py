import json
COL="https://bookplume.com/collections/anatomy-medical-flash-cards"
def utm(src,c): return f"{COL}?utm_source={src}&utm_medium=social&utm_campaign=wrist-extensor-compartments&utm_content={c}"
BODY="""Wrist extensor compartments mnemonic: 2-2-1-2-1-1 = 9 tendons (count them thumb side first)
1 = Abductor pollicis longus + extensor pollicis brevis
2 = Extensor carpi radialis longus + brevis
3 = Extensor pollicis longus
4 = Extensor digitorum + extensor indicis
5 = Extensor digiti minimi
6 = Extensor carpi ulnaris"""
CRED="Images: Gray's Anatomy (1918), Fig. 1234, public domain; diagrams: Book Plume"
HT="#anatomy #humanbody #anatomyquiz #nursingschool #medstudent #anatomymnemonics #wristanatomy #upperlimb"
text=f"""Can you name all 6 wrist extensor compartments? Count the tendons ✋
{BODY}
Quick test: which compartment holds the little finger's own extensor? Answer in the video.
Save this for your next anatomy exam.
{CRED}
{HT}"""
tt_text="Can you name all 6 wrist extensor compartments? Just count the tendons: 2-2-1-2-1-1 #anatomy #anatomymnemonics #nursingschool #medstudent #wristanatomy"
tt_title="Name all 6 wrist extensor compartments? Count: 2-2-1-2-1-1"
yt_title="Can You Name All 6 Wrist Extensor Compartments? 2-2-1-2-1-1 Mnemonic #shorts"
pin_title="Wrist Extensor Compartments Mnemonic: 2-2-1-2-1-1 Tendons"
pin_desc=f"Wrist extensor compartments mnemonic for anatomy class: count the tendons thumb side first, 2-2-1-2-1-1 = 9 tendons. 1 abductor pollicis longus + extensor pollicis brevis, 2 extensor carpi radialis longus + brevis, 3 extensor pollicis longus, 4 extensor digitorum + extensor indicis, 5 extensor digiti minimi, 6 extensor carpi ulnaris. {CRED}."
yt_tags=["wrist extensor compartments","extensor compartments of the wrist","6 extensor compartments mnemonic","extensor digiti minimi","extensor pollicis longus","anatomy mnemonics","wrist anatomy","upper limb anatomy","nursing school anatomy","anatomy and physiology"]
pin_link=utm('pinterest','video')
assert len(tt_title)<=90 and len(yt_title)<=95 and yt_title.endswith(" #shorts") and len(pin_title)<=90 and len(pin_desc)<=480, (len(tt_title),len(yt_title),len(pin_title),len(pin_desc))
assert len(tt_text.split(" #")[0])<=150, len(tt_text.split(" #")[0])
assert "utm_source=" in pin_link and "utm_campaign=" in pin_link
for s in (text,tt_text,pin_title,pin_desc,yt_title,tt_title): assert "bookplume" not in s.lower() and "Study with" not in s and "flashcard" not in s.lower()
json.dump(dict(text=text,tt_text=tt_text,tt_title=tt_title,yt_title=yt_title,pin_title=pin_title,pin_desc=pin_desc,yt_tags=yt_tags,pin_link=pin_link),open('texts.json','w'),indent=1,ensure_ascii=False)
print(len(tt_title),len(yt_title),len(pin_title),len(pin_desc),len(text),len(tt_text.split(" #")[0]))
