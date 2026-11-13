import json
COL="https://bookplume.com/collections/anatomy-medical-flash-cards"
def utm(src,c): return f"{COL}?utm_source={src}&utm_medium=social&utm_campaign=coronary-arteries&utm_content={c}"
TAGS="#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #bookplume #coronaryarteries #heartanatomy"
BODY="""Coronary arteries: the first branches of your aorta turn right back to feed the heart muscle.
2 arteries → 4 main branches. Trick: LEFT goes Around + Down, RIGHT goes Edge + Back.
Left coronary → Circumflex (goes AROUND in the left coronary groove) + LAD (left anterior descending, runs DOWN the front)
Right coronary → Right marginal (the EDGE) + Posterior descending (the BACK, in about 80–85% of people)"""
CRED="Images: Gray's Anatomy (1918), Fig. 492, public domain; diagrams: Book Plume"
text=f"""Your heart feeds itself FIRST. Coronary arteries mnemonic in 25 seconds.
{BODY}
Quick test: which branch runs down the front of the heart? Answer in the video.
Save this for your next anatomy exam.
Study with: Anatomy Flash Cards (visual learning set) → bookplume.com
{CRED}
{TAGS}"""
yt_desc=f"""Coronary arteries mnemonic: your aorta's first branches feed your heart itself. Learn the coronary arteries and their 4 main branches with one trick: left goes Around + Down, right goes Edge + Back.
{BODY}
Quick test: which one runs down the front? The LAD, left anterior descending (anterior interventricular artery). Gray's 1918 name: "anterior descending branch of left coronary artery".
Save this for your next anatomy exam.
Study with: Anatomy & medical flash cards → {utm('youtube','short')}
{CRED}
Sources: OpenStax Anatomy & Physiology 2e, 19.1 Heart Anatomy, Coronary Circulation (LibreTexts); TeachMeAnatomy, Arterial Supply to the Heart; Gray's Anatomy (1918), The Heart.
Study and exam prep only.
{TAGS}"""
tt_title="Your heart feeds itself first! Coronary arteries mnemonic: left = around + down"
yt_title="Coronary Arteries Mnemonic: Your Heart Feeds Itself First #shorts"
pin_title="Coronary Arteries Mnemonic: Left = Around + Down, Right = Edge + Back | Heart Anatomy"
pin2_title="Coronary Arteries Cheat Sheet: LAD, Circumflex, Marginal, PDA | Nursing School"
pin_desc=f"""Coronary arteries mnemonic: left coronary goes Around + Down (circumflex, LAD), right coronary goes Edge + Back (right marginal, posterior descending, usually). The coronary arteries are the first branches of the aorta. Anatomy flashcards and nursing school study tips from Book Plume. {CRED}. #anatomy #heartanatomy"""
yt_tags=["coronary arteries","coronary arteries mnemonic","coronary artery anatomy","LAD artery","circumflex artery","heart anatomy","anatomy mnemonics","nursing school anatomy","anatomy and physiology","cardiac anatomy"]
assert len(tt_title)<=90 and len(yt_title)<=95 and yt_title.endswith("#shorts") and len(pin_title)<=90 and len(pin2_title)<=90 and len(pin_desc)<=480, (len(tt_title),len(yt_title),len(pin_title),len(pin2_title),len(pin_desc))
for l in [utm('youtube','short'),utm('pinterest','short'),utm('pinterest','pin')]: assert "utm_source=" in l and "utm_campaign=" in l
assert utm('youtube','short') in yt_desc
json.dump(dict(text=text,yt_desc=yt_desc,tt_title=tt_title,yt_title=yt_title,pin_title=pin_title,pin2_title=pin2_title,pin_desc=pin_desc,yt_tags=yt_tags,pinlink_v=utm('pinterest','short'),pinlink_i=utm('pinterest','pin')),open('texts.json','w'),indent=1,ensure_ascii=False)
print(len(tt_title),len(yt_title),len(pin_title),len(pin2_title),len(pin_desc),len(text),len(yt_desc))
