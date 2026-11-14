import json
COL="https://bookplume.com/collections/anatomy-medical-flash-cards"
def utm(src,c): return f"{COL}?utm_source={src}&utm_medium=social&utm_campaign=superior-mesenteric-artery&utm_content={c}"
TAGS="#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #anatomyquiz #bookplume #superiormesentericartery"
BODY="""Superior mesenteric artery (SMA) branches mnemonic: I Just Made Raspberry Ice cream
I = Inferior pancreaticoduodenal (1st branch: pancreas head + duodenum)
J = Jejunal + ileal arteries (lots of them, all to the patient's LEFT, in arcades)
M = Middle colic (transverse colon)
R = Right colic (ascending colon)
I = Ileocolic (the LAST branch: end of the ileum, cecum + appendix)
The SMA leaves the aorta at about L1 and feeds the midgut."""
CRED="Images: Gray's Anatomy (1918), Fig. 534, public domain; diagrams: Book Plume"
text=f"""Name this artery in 3 seconds? SMA quiz + the superior mesenteric artery branches mnemonic.
{BODY}
Quick test: which one is the last branch? Answer in the video.
Save this for your next anatomy exam.
Study with: Anatomy Flash Cards (visual learning set) → bookplume.com
{CRED}
{TAGS}"""
yt_desc=f"""Anatomy quiz: name this artery in 3 seconds, then learn every superior mesenteric artery branch with one mnemonic.
{BODY}
Quick test: which one is the last branch? Ileocolic. 1918 atlas spelling: "cæcum" = cecum.
Save this for your next anatomy exam.
Study with: Anatomy & medical flash cards → {utm('youtube','short')}
{CRED}
Sources: NCBI StatPearls, Anatomy, Abdomen and Pelvis: Superior Mesenteric Artery; Gray's Anatomy (1918), The Superior Mesenteric Artery.
Study and exam prep only.
{TAGS}"""
tt_title="Name this artery in 3 sec? Superior mesenteric artery branches mnemonic"
yt_title="Name This Artery in 3 Seconds? Superior Mesenteric Artery Branches #shorts"
pin_title="Superior Mesenteric Artery Branches Mnemonic: Can You Name This Artery?"
pin2_title="Can You Name This Artery? SMA Anatomy Quiz + 5 Branches | Nursing School"
pin_desc=f"""Anatomy quiz: name this artery in 3 seconds. Superior mesenteric artery branches mnemonic I Just Made Raspberry Ice cream = inferior pancreaticoduodenal, jejunal + ileal, middle colic, right colic, ileocolic (the last). Anatomy flashcards and nursing school study tips from Book Plume. {CRED}."""
yt_tags=["superior mesenteric artery","superior mesenteric artery branches","SMA branches mnemonic","anatomy quiz","ileocolic artery","middle colic artery","midgut blood supply","anatomy mnemonics","nursing school anatomy","anatomy and physiology"]
assert len(tt_title)<=90 and len(yt_title)<=95 and yt_title.endswith("#shorts") and len(pin_title)<=90 and len(pin2_title)<=90 and len(pin_desc)<=480, (len(tt_title),len(yt_title),len(pin_title),len(pin2_title),len(pin_desc))
for l in [utm('youtube','short'),utm('pinterest','short'),utm('pinterest','pin')]: assert "utm_source=" in l and "utm_campaign=" in l
assert utm('youtube','short') in yt_desc
json.dump(dict(text=text,yt_desc=yt_desc,tt_title=tt_title,yt_title=yt_title,pin_title=pin_title,pin2_title=pin2_title,pin_desc=pin_desc,yt_tags=yt_tags,pinlink_v=utm('pinterest','short'),pinlink_i=utm('pinterest','pin')),open('texts.json','w'),indent=1,ensure_ascii=False)
print(len(tt_title),len(yt_title),len(pin_title),len(pin2_title),len(pin_desc),len(text),len(yt_desc))
