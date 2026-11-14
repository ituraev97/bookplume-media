import json
COL="https://bookplume.com/collections/anatomy-medical-flash-cards"
def utm(src,c): return f"{COL}?utm_source={src}&utm_medium=social&utm_campaign=superficial-back-muscles&utm_content={c}"
TAGS="#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #anatomyquiz #bookplume #backmuscles #latissimusdorsi"
BODY="""Superficial back muscles: 5 = 2 on top + 3 underneath
On top (the big sheets): Trapezius + Latissimus dorsi ("lats")
Under the trapezius, top to bottom: Levator scapulae, Rhomboid minor, Rhomboid major
Nerves: trapezius = accessory nerve (CN XI); latissimus dorsi = thoracodorsal nerve; levator scapulae + both rhomboids = dorsal scapular nerve."""
CRED="Images: Gray's Anatomy (1918), Fig. 409, public domain; diagrams: Book Plume"
text=f"""Name this back muscle in 3 seconds? Back muscles anatomy quiz + the 2-on-top, 3-underneath trick.
{BODY}
Quick test: which one is NOT supplied by the brachial plexus? Answer in the video.
Save this for your next anatomy exam.
Study with: Anatomy Flash Cards (visual learning set) → bookplume.com
{CRED}
{TAGS}"""
yt_desc=f"""Anatomy quiz: name this back muscle in 3 seconds, then learn all 5 superficial back muscles with one trick: 2 on top, 3 underneath.
{BODY}
Quick test: which one is NOT supplied by the brachial plexus? Trapezius (cranial nerve XI, the accessory nerve). 1918 atlas name: "Rhomboideus major" = rhomboid major.
Save this for your next anatomy exam.
Study with: Anatomy & medical flash cards → {utm('youtube','short')}
{CRED}
Sources: TeachMeAnatomy, The Superficial Back Muscles (teachmeanatomy.info/back/muscles/superficial/); Gray's Anatomy (1918), Muscles connecting the upper extremity to the vertebral column.
Study and exam prep only.
{TAGS}"""
tt_title="Name this back muscle in 3 seconds?"
tt_text="""Name this back muscle in 3 seconds? 🤔 Then 4 more are hiding next to it.
#anatomy #anatomyquiz #nursingschool #medstudent #backmuscles"""
yt_title="Name This Back Muscle in 3 Seconds? Superficial Back Muscles Quiz #shorts"
pin_title="Back Muscles Anatomy Quiz: Name This Muscle in 3 Seconds (Lats + Trapezius)"
pin2_title="Can You Name All 5 Superficial Back Muscles? Anatomy Quiz | Nursing School"
pin_desc=f"""Anatomy quiz: name this back muscle in 3 seconds. Superficial back muscles trick: 2 on top (trapezius, latissimus dorsi) + 3 underneath (levator scapulae, rhomboid minor, rhomboid major). Anatomy flashcards and nursing school study tips from Book Plume. {CRED}."""
car_text=f"""How many can you name? 5 superficial back muscles 👀
1 Trapezius · 2 Latissimus dorsi · 3 Levator scapulae · 4 Rhomboid minor · 5 Rhomboid major
Cheat sheet: 2 on top (T L) + 3 under the trapezius (L m M, top to bottom). Odd one out: trapezius is supplied by the accessory nerve (CN XI), the other 4 by brachial plexus branches (thoracodorsal, dorsal scapular).
Save this for your next anatomy exam.
Study with: Anatomy Flash Cards → bookplume.com
{CRED}
{TAGS}"""
yt_tags=["back muscles anatomy","superficial back muscles","latissimus dorsi","trapezius muscle","rhomboid major and minor","levator scapulae","anatomy quiz","anatomy mnemonics","nursing school anatomy","anatomy and physiology"]
assert len(tt_title)<=90 and len(yt_title)<=95 and yt_title.endswith("#shorts") and len(pin_title)<=90 and len(pin2_title)<=90 and len(pin_desc)<=480, (len(tt_title),len(yt_title),len(pin_title),len(pin2_title),len(pin_desc))
assert len(tt_text.split("\n#")[0])<=150 and "bookplume" not in tt_text.lower() and "book plume" not in tt_text.lower()
for l in [utm('youtube','short'),utm('pinterest','short'),utm('pinterest','pin')]: assert "utm_source=" in l and "utm_campaign=" in l
assert utm('youtube','short') in yt_desc
json.dump(dict(text=text,yt_desc=yt_desc,tt_title=tt_title,tt_text=tt_text,yt_title=yt_title,pin_title=pin_title,pin2_title=pin2_title,pin_desc=pin_desc,car_text=car_text,yt_tags=yt_tags,pinlink_v=utm('pinterest','short'),pinlink_i=utm('pinterest','pin')),open('texts.json','w'),indent=1,ensure_ascii=False)
print(len(tt_title),len(yt_title),len(pin_title),len(pin2_title),len(pin_desc),len(text),len(yt_desc))
