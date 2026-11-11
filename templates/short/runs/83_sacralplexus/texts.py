import json
COL="https://bookplume.com/collections/anatomy-medical-flash-cards"
def utm(src,c): return f"{COL}?utm_source={src}&utm_medium=social&utm_campaign=sacral-plexus&utm_content={c}"
TAGS="#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #bookplume #sacralplexus #anatomymnemonics"
BODY="""S = Superior gluteal (leaves ABOVE the piriformis → gluteus medius + minimus)
I = Inferior gluteal (below the piriformis → gluteus maximus)
S = Sciatic (below; the biggest nerve in the body, L4–S3)
P = Posterior femoral cutaneous (below; skin of the back of the thigh)
P = Pudendal (below; hooks around the ischial spine back in to the perineum, S2–S4)
All leave the pelvis through the greater sciatic foramen. Plexus roots: L4–S4."""
CRED="Images: Gray's Anatomy (1918), Figs. 829 + 832, public domain; diagrams: Book Plume"
text=f"""Sacral plexus mnemonic: can you name all 5 big branches? ⚓ Some Irish Sailor Pesters Polly.
{BODY}
Quick test: which nerve powers gluteus maximus? Answer in the video.
Save this for your next anatomy exam.
Study with: Anatomy Flash Cards (visual learning set) → bookplume.com
{CRED}
{TAGS}"""
yt_desc=f"""Sacral plexus mnemonic: Some Irish Sailor Pesters Polly. The 5 big branches of the sacral plexus and the piriformis landmark (1 above, 4 below).
{BODY}
Quick test: which nerve powers gluteus maximus? The inferior gluteal nerve. The superior gluteal nerve supplies gluteus medius and minimus.
Save this for your next anatomy exam.
Study with: Anatomy & medical flash cards → {utm('youtube','short')}
{CRED}
Study and exam prep only.
{TAGS}"""
tt_title="Sacral plexus mnemonic ⚓ Can you name all 5 branches?"
yt_title="Sacral Plexus Mnemonic (Some Irish Sailor Pesters Polly) | 5 Branches #shorts"
pin_title="Sacral Plexus Mnemonic: Some Irish Sailor Pesters Polly | 5 Branches"
pin2_title="Sacral Plexus Cheat Sheet: 5 Nerves Above + Below Piriformis | Anatomy Study"
pin_desc=f"""Sacral plexus 5 branches = Some Irish Sailor Pesters Polly: superior gluteal (above piriformis), inferior gluteal, sciatic, posterior femoral cutaneous, pudendal (below). Gluteus maximus = inferior gluteal. Anatomy flashcards and nursing school study tips from Book Plume. {CRED}. #anatomy #nursingschool #sacralplexus"""
yt_tags=["sacral plexus mnemonic","sacral plexus","sacral plexus branches","sciatic nerve","pudendal nerve","superior gluteal nerve","inferior gluteal nerve","piriformis","anatomy mnemonics","nursing school anatomy"]
car_text=f"""Sacral plexus cheat sheet ⚓ Some Irish Sailor Pesters Polly
{BODY}
Gluteus maximus = inferior gluteal nerve; gluteus medius + minimus = superior gluteal.
Save this for your next anatomy exam 📌
Study with: Anatomy Flash Cards → bookplume.com
{CRED}
{TAGS}"""
assert len(tt_title)<=90 and len(yt_title)<=95 and yt_title.endswith("#shorts") and len(pin_title)<=90 and len(pin2_title)<=90 and len(pin_desc)<=480, (len(tt_title),len(yt_title),len(pin_title),len(pin2_title),len(pin_desc))
for l in [utm('youtube','short'),utm('pinterest','short'),utm('pinterest','pin')]: assert "utm_source=" in l and "utm_campaign=" in l
assert utm('youtube','short') in yt_desc
json.dump(dict(text=text,yt_desc=yt_desc,tt_title=tt_title,yt_title=yt_title,pin_title=pin_title,pin2_title=pin2_title,pin_desc=pin_desc,yt_tags=yt_tags,car_text=car_text,pinlink_v=utm('pinterest','short'),pinlink_i=utm('pinterest','pin')),open('texts.json','w'),indent=1,ensure_ascii=False)
print(len(tt_title),len(yt_title),len(pin_title),len(pin2_title),len(pin_desc),len(text),len(yt_desc),len(car_text))
