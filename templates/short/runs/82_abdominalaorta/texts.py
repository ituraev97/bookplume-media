import json
COL="https://bookplume.com/collections/anatomy-medical-flash-cards"
def utm(src,c): return f"{COL}?utm_source={src}&utm_medium=social&utm_campaign=abdominal-aorta-branches&utm_content={c}"
TAGS="#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #bookplume #abdominalaorta #anatomymnemonics"
BODY="""T12 = Celiac trunk (stomach, liver, spleen: foregut)
L1 = Superior mesenteric artery (small intestine: midgut)
L1–L2 = Renal arteries (one to each kidney)
L3 = Inferior mesenteric artery (lower colon + upper rectum: hindgut)
L4 = the aorta splits into the 2 common iliac arteries
Starts at T12 (aortic hiatus of the diaphragm), ends at L4."""
CRED="Images: Gray's Anatomy (1918), Fig. 531, public domain; diagrams: Book Plume"
text=f"""Abdominal aorta branches mnemonic: just count T12 → L4 📌 Can you place all 5?
{BODY}
Quick test: what leaves at L3? Answer in the video.
Save this for your next anatomy exam.
Study with: Anatomy Flash Cards (visual learning set) → bookplume.com
{CRED}
{TAGS}"""
yt_desc=f"""Abdominal aorta branches mnemonic: just count 12, 1, 2, 3, 4 (T12 → L4). The 5 big branches of the abdominal aorta by vertebral level.
{BODY}
Quick test: what leaves the aorta at L3? The inferior mesenteric artery.
Save this for your next anatomy exam.
Study with: Anatomy & medical flash cards → {utm('youtube','short')}
{CRED}
Study and exam prep only.
{TAGS}"""
tt_title="Abdominal aorta branches mnemonic 📌 Can you place all 5 levels?"
yt_title="Abdominal Aorta Branches Mnemonic (Just Count T12 to L4) | Anatomy #shorts"
pin_title="Abdominal Aorta Branches Mnemonic: Just Count T12 to L4 | Anatomy Study Tip"
pin2_title="Abdominal Aorta Cheat Sheet: Celiac, SMA, Renal, IMA, Iliacs by Vertebral Level"
pin_desc=f"""Abdominal aorta branches by vertebral level, just count T12 → L4: celiac trunk T12, superior mesenteric artery L1, renal arteries L1–L2, inferior mesenteric artery L3, splits into the common iliacs at L4. Anatomy flashcards and nursing school study tips from Book Plume. {CRED}. #anatomy #nursingschool #abdominalaorta"""
yt_tags=["abdominal aorta branches","abdominal aorta mnemonic","abdominal aorta anatomy","celiac trunk","superior mesenteric artery","inferior mesenteric artery","renal arteries","vertebral levels anatomy","anatomy mnemonics","nursing school anatomy"]
assert len(tt_title)<=90 and len(yt_title)<=95 and yt_title.endswith("#shorts") and len(pin_title)<=90 and len(pin2_title)<=90 and len(pin_desc)<=480, (len(tt_title),len(yt_title),len(pin_title),len(pin2_title),len(pin_desc))
for l in [utm('youtube','short'),utm('pinterest','short'),utm('pinterest','pin')]: assert "utm_source=" in l and "utm_campaign=" in l
assert utm('youtube','short') in yt_desc
json.dump(dict(text=text,yt_desc=yt_desc,tt_title=tt_title,yt_title=yt_title,pin_title=pin_title,pin2_title=pin2_title,pin_desc=pin_desc,yt_tags=yt_tags,pinlink_v=utm('pinterest','short'),pinlink_i=utm('pinterest','pin')),open('texts.json','w'),indent=1,ensure_ascii=False)
print(len(tt_title),len(yt_title),len(pin_title),len(pin2_title),len(pin_desc),len(text),len(yt_desc))
