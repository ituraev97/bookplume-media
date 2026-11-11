import json
COL="https://bookplume.com/collections/anatomy-medical-flash-cards"
def utm(src,c): return f"{COL}?utm_source={src}&utm_medium=social&utm_campaign=sternum-parts&utm_content={c}"
TAGS="#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #bookplume #sternum #anatomymnemonics"
BODY="""H = Handle = Manubrium (Latin "handle"; the clavicles and 1st ribs join it)
B = Blade = Body (1918 name: gladiolus, Latin "little sword"; costal cartilages 2–7 join its sides)
T = Tip = Xiphoid process (Greek xiphos = sword, "sword-shaped")
Sternal angle = where the manubrium meets the body: the 2nd rib joins here (level of the T4/T5 disc), so it's where you start counting ribs."""
CRED="Images: Gray's Anatomy (1918), Figs. 112, 115, 117, public domain; diagrams: Book Plume"
text=f"""Sternum mnemonic: your breastbone is shaped like a sword ⚔️ Can you name its 3 parts? Handle, blade, tip.
{BODY}
Quick test: where the handle meets the blade, which rib joins? Answer in the video.
Save this for your next anatomy exam.
Study with: Anatomy Flash Cards (visual learning set) → bookplume.com
{CRED}
{TAGS}"""
yt_desc=f"""Sternum mnemonic: handle, blade, tip. The 3 parts of the sternum (breastbone) and the sternal angle.
{BODY}
Quick test: where the handle meets the blade, which rib joins? The 2nd rib, at the sternal angle.
Save this for your next anatomy exam.
Study with: Anatomy & medical flash cards → {utm('youtube','short')}
{CRED}
Sources: StatPearls (NCBI Bookshelf), Anatomy, Thorax, Sternum; Gray's Anatomy (1918), The Sternum; Dartmouth Human Anatomy etymology of chest wall terms.
Study and exam prep only.
{TAGS}"""
tt_title="Sternum mnemonic ⚔️ Your breastbone is a sword. Name its 3 parts?"
yt_title="Sternum Parts Mnemonic: Handle, Blade, Tip (Your Breastbone Is a Sword) #shorts"
pin_title="Sternum Parts Mnemonic: Handle, Blade, Tip | Manubrium, Body, Xiphoid"
pin2_title="Sternum Cheat Sheet: Manubrium, Body, Xiphoid + Sternal Angle (2nd Rib)"
pin_desc=f"""Sternum mnemonic: your breastbone is a sword. Handle = manubrium, blade = body (old name gladiolus), tip = xiphoid process. The sternal angle is where the 2nd rib joins. Anatomy flashcards and nursing school study tips from Book Plume. {CRED}. #anatomy #nursingschool #sternum"""
yt_tags=["sternum anatomy","sternum mnemonic","parts of the sternum","manubrium","xiphoid process","sternal angle","angle of Louis","rib counting","anatomy mnemonics","nursing school anatomy"]
assert len(tt_title)<=90 and len(yt_title)<=95 and yt_title.endswith("#shorts") and len(pin_title)<=90 and len(pin2_title)<=90 and len(pin_desc)<=480, (len(tt_title),len(yt_title),len(pin_title),len(pin2_title),len(pin_desc))
for l in [utm('youtube','short'),utm('pinterest','short'),utm('pinterest','pin')]: assert "utm_source=" in l and "utm_campaign=" in l
assert utm('youtube','short') in yt_desc
json.dump(dict(text=text,yt_desc=yt_desc,tt_title=tt_title,yt_title=yt_title,pin_title=pin_title,pin2_title=pin2_title,pin_desc=pin_desc,yt_tags=yt_tags,pinlink_v=utm('pinterest','short'),pinlink_i=utm('pinterest','pin')),open('texts.json','w'),indent=1,ensure_ascii=False)
print(len(tt_title),len(yt_title),len(pin_title),len(pin2_title),len(pin_desc),len(text),len(yt_desc))
