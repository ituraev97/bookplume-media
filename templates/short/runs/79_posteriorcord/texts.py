import json
COL="https://bookplume.com/collections/anatomy-medical-flash-cards"
def utm(src,c): return f"{COL}?utm_source={src}&utm_medium=social&utm_campaign=posterior-cord&utm_content={c}"
TAGS="#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #bookplume #brachialplexus #anatomymnemonics"
BODY="""S = upper + lower subscapular (subscapularis, teres major)
T = thoracodorsal (latissimus dorsi)
A = axillary (deltoid, teres minor)
R = radial (the biggest branch; triceps, back of the arm and forearm)"""
CRED="Images: Gray's Anatomy (1918), Figs. 809 + 810, public domain; diagrams: Book Plume"
text=f"""Posterior cord mnemonic: can you name all 5 branches of the brachial plexus posterior cord? 🧠 One word: STAR.
{BODY}
Quick test: which one wraps around the surgical neck of the humerus? Answer in the video.
Save this for your next anatomy exam.
Study with: Anatomy Flashcards (300 anatomically precise drawings) → bookplume.com
{CRED}
{TAGS}"""
yt_desc=f"""Posterior cord of the brachial plexus mnemonic: STAR = 5 branches.
{BODY}
Quick test: which nerve wraps around the surgical neck of the humerus? (axillary)
Save this for your next anatomy exam.
Study with: Anatomy & medical flash cards → {utm('youtube','short')}
{CRED}
Study and exam prep only.
{TAGS}"""
tt_title="Posterior cord mnemonic: STAR 🧠 Can you name all 5 branches?"
yt_title="Posterior Cord Branches Mnemonic (STAR) | Brachial Plexus #shorts"
pin_title="Posterior Cord Branches Mnemonic: STAR | Brachial Plexus Anatomy"
pin2_title="Brachial Plexus Posterior Cord Cheat Sheet: STAR Mnemonic"
pin_desc=f"""Posterior cord of the brachial plexus = STAR: upper + lower subscapular, thoracodorsal, axillary, radial. Anatomy flashcards and nursing school study tips from Book Plume. {CRED}. #anatomy #nursingschool #brachialplexus"""
car=f"""Posterior cord cheat sheet 🧠 The 5 branches = STAR
{BODY}
1918 atlas name: "long subscapular nerve" = thoracodorsal.
Save this for your next anatomy exam 📌
Study with: anatomy flashcards → bookplume.com
{CRED}
{TAGS}"""
assert len(tt_title)<=90 and len(yt_title)<=95 and yt_title.endswith("#shorts") and len(pin_title)<=90 and len(pin2_title)<=90 and len(pin_desc)<=480, (len(tt_title),len(yt_title),len(pin_title),len(pin_desc))
for l in [utm('youtube','short'),utm('pinterest','short'),utm('pinterest','pin')]: assert "utm_source=" in l and "utm_campaign=" in l
json.dump(dict(text=text,yt_desc=yt_desc,tt_title=tt_title,yt_title=yt_title,pin_title=pin_title,pin2_title=pin2_title,pin_desc=pin_desc,car=car,pinlink_v=utm('pinterest','short'),pinlink_i=utm('pinterest','pin')),open('/home/claude/work/run/texts.json','w'),indent=1)
print(len(tt_title),len(yt_title),len(pin_title),len(pin_desc),len(text))
