import json
COL="https://bookplume.com/collections/anatomy-medical-flash-cards"
def utm(src,c): return f"{COL}?utm_source={src}&utm_medium=social&utm_campaign=larynx-cartilages&utm_content={c}"
TAGS="#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #bookplume #larynx #anatomymnemonics"
BODY="""The Adam's apple is the laryngeal prominence of the THYROID CARTILAGE, the biggest of the 9 cartilages of the larynx (voice box).
3 single, top to bottom = E-T-C: Epiglottis, Thyroid, Cricoid
3 pairs = A-C-C: Arytenoid, Corniculate, Cuneiform (x2 each)
3 + 3x2 = 9. Vocal cords run from the thyroid cartilage (front) back to the arytenoids."""
CRED="Images: Gray's Anatomy (1918), Figs. 950 + 951, public domain; diagrams: Book Plume"
text=f"""Your Adam's apple is NOT a bone. Larynx cartilages mnemonic: E-T-C + A-C-C.
{BODY}
Quick test: which cartilage is a complete ring around your airway? Answer in the video.
Save this for your next anatomy exam.
Study with: Anatomy Flash Cards (visual learning set) → bookplume.com
{CRED}
{TAGS}"""
yt_desc=f"""Your Adam's apple is not a bone: it's cartilage. Learn the 9 cartilages of the larynx with one mnemonic: E-T-C (singles) + A-C-C (pairs).
{BODY}
Quick test: which one is a complete ring around your airway? The cricoid cartilage, shaped like a signet ring (tracheal rings are C-shaped, open at the back).
Save this for your next anatomy exam.
Study with: Anatomy & medical flash cards → {utm('youtube','short')}
{CRED}
Sources: StatPearls (NCBI Bookshelf), Anatomy, Head and Neck: Larynx; Gray's Anatomy (1918), The Larynx.
Study and exam prep only.
{TAGS}"""
tt_title="Your Adam's apple is NOT a bone! 9 larynx cartilages mnemonic: E-T-C + A-C-C"
yt_title="Adam's Apple Is Not a Bone: Larynx Cartilages Mnemonic #shorts"
pin_title="Larynx Cartilages Mnemonic: Adam's Apple Is Not a Bone | Anatomy Flashcards"
pin2_title="9 Larynx Cartilages Cheat Sheet: E-T-C + A-C-C | Nursing School Anatomy"
pin_desc=f"""Larynx cartilages mnemonic: the Adam's apple is the thyroid cartilage, not a bone. 3 single E-T-C (epiglottis, thyroid, cricoid) + 3 pairs A-C-C (arytenoid, corniculate, cuneiform) = 9. Cricoid = the only complete ring. Anatomy flashcards and nursing school study tips from Book Plume. {CRED}. #anatomy #nursingschool #larynx"""
yt_tags=["larynx cartilages","larynx anatomy","adam's apple","thyroid cartilage","cricoid cartilage","epiglottis","arytenoid cartilage","anatomy mnemonics","nursing school anatomy","anatomy and physiology"]
assert len(tt_title)<=90 and len(yt_title)<=95 and yt_title.endswith("#shorts") and len(pin_title)<=90 and len(pin2_title)<=90 and len(pin_desc)<=480, (len(tt_title),len(yt_title),len(pin_title),len(pin2_title),len(pin_desc))
for l in [utm('youtube','short'),utm('pinterest','short'),utm('pinterest','pin')]: assert "utm_source=" in l and "utm_campaign=" in l
assert utm('youtube','short') in yt_desc
json.dump(dict(text=text,yt_desc=yt_desc,tt_title=tt_title,yt_title=yt_title,pin_title=pin_title,pin2_title=pin2_title,pin_desc=pin_desc,yt_tags=yt_tags,pinlink_v=utm('pinterest','short'),pinlink_i=utm('pinterest','pin')),open('texts.json','w'),indent=1,ensure_ascii=False)
print(len(tt_title),len(yt_title),len(pin_title),len(pin2_title),len(pin_desc),len(text),len(yt_desc))
