import json
COL="https://bookplume.com/collections/anatomy-medical-flash-cards"
def utm(src,c): return f"{COL}?utm_source={src}&utm_medium=social&utm_campaign=internal-iliac-artery&utm_content={c}"
TAGS="#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #bookplume #internaliliac #anatomymnemonics"
BODY="""Internal iliac artery branches mnemonic: I Love Going Places In My Very Own Underwear
I = Iliolumbar
L = Lateral sacral
G = Gluteal (superior + inferior)
P = internal Pudendal
I = Inferior vesical
M = Middle rectal
V = Vaginal (females; + uterine artery)
O = Obturator
U = Umbilical (gives the superior vesical)
Posterior trunk = the first 3 letters: P.S. I Love You = Superior gluteal, Iliolumbar, Lateral sacral. Everything else = anterior trunk."""
CRED="Images: Gray's Anatomy (1918), Fig. 539, public domain; diagrams: Book Plume"
text=f"""Can you name every internal iliac branch? One sentence does it.
{BODY}
Quick test: which 3 come from the posterior trunk? Answer in the video.
Save this for your next anatomy exam.
Study with: Anatomy Flash Cards (visual learning set) → bookplume.com
{CRED}
{TAGS}"""
yt_desc=f"""Internal iliac artery branches mnemonic: name every branch of the internal iliac artery with one sentence, then sort them into the anterior and posterior trunk.
{BODY}
Quick test: which 3 come from the posterior trunk? The first 3: superior gluteal, iliolumbar, lateral sacral. Gray's 1918 name for the internal iliac: "hypogastric artery".
Save this for your next anatomy exam.
Study with: Anatomy & medical flash cards → {utm('youtube','short')}
{CRED}
Sources: TeachMeAnatomy, Arterial Supply to the Pelvis; Radiopaedia, Branches of internal iliac artery (mnemonic); Gray's Anatomy (1918), The Hypogastric Artery.
Study and exam prep only.
{TAGS}"""
tt_title="Name every internal iliac branch? 1 sentence: I Love Going Places In My Very Own Underwear"
yt_title="Internal Iliac Artery Branches Mnemonic: All 9 in 1 Sentence #shorts"
pin_title="Internal Iliac Artery Branches Mnemonic: I Love Going Places In My Very Own Underwear"
pin2_title="Internal Iliac Artery Cheat Sheet: Anterior vs Posterior Trunk | Nursing School"
pin_desc=f"""Internal iliac artery branches mnemonic: I Love Going Places In My Very Own Underwear = iliolumbar, lateral sacral, gluteal, internal pudendal, inferior vesical, middle rectal, vaginal, obturator, umbilical. Posterior trunk = P.S. I Love You (superior gluteal, iliolumbar, lateral sacral). Anatomy flashcards and nursing school study tips from Book Plume. {CRED}."""
yt_tags=["internal iliac artery","internal iliac artery branches","internal iliac artery mnemonic","pelvic arteries","anterior trunk","posterior trunk","superior gluteal artery","anatomy mnemonics","nursing school anatomy","anatomy and physiology"]
if len(tt_title)>90: tt_title="Name every internal iliac branch? One sentence: I Love Going Places In My..."
assert len(tt_title)<=90 and len(yt_title)<=95 and yt_title.endswith("#shorts") and len(pin_title)<=90 and len(pin2_title)<=90 and len(pin_desc)<=480, (len(tt_title),len(yt_title),len(pin_title),len(pin2_title),len(pin_desc))
for l in [utm('youtube','short'),utm('pinterest','short'),utm('pinterest','pin')]: assert "utm_source=" in l and "utm_campaign=" in l
assert utm('youtube','short') in yt_desc
json.dump(dict(text=text,yt_desc=yt_desc,tt_title=tt_title,yt_title=yt_title,pin_title=pin_title,pin2_title=pin2_title,pin_desc=pin_desc,yt_tags=yt_tags,pinlink_v=utm('pinterest','short'),pinlink_i=utm('pinterest','pin')),open('texts.json','w'),indent=1,ensure_ascii=False)
print(len(tt_title),tt_title,len(yt_title),len(pin_title),len(pin2_title),len(pin_desc),len(text),len(yt_desc))
