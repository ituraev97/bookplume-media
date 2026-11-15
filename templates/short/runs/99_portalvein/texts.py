import json
B="https://raw.githubusercontent.com/ituraev97/bookplume-media/media-20261116-portalvein/v/"
COL="https://bookplume.com/collections/anatomy-medical-flash-cards"
SLUG="hepatic-portal-vein"
utm=lambda src,c: f"{COL}?utm_source={src}&utm_medium=social&utm_campaign={SLUG}&utm_content={c}"
TAGS="#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #anatomyquiz #bookplume #portalvein #abdominalanatomy"
BODY="""Hepatic portal vein: blood from your gut goes to the liver first, then to the heart (about 75% of the liver's blood arrives this way).
Trick 2-1-4:
2 build it: splenic vein + superior mesenteric vein (they join behind the neck of the pancreas)
1 joins the splenic: inferior mesenteric vein (usually)
4 drain straight in: left gastric, right gastric, cystic, paraumbilical veins
1918 atlas names: "Lienal" = splenic, "Coronary" = left gastric, "Pyloric" = right gastric."""
ig=f"""Name this vein in 3 seconds? Hepatic portal vein quiz + the 2-1-4 trick for its tributaries.
{BODY}
Quick test: which vein usually empties into the splenic vein? Answer in the video.
Save this for your next anatomy exam.
Study with: Anatomy Flash Cards (visual learning set) → bookplume.com
Images: Gray's Anatomy (1918), Fig. 591, public domain; diagrams: Book Plume
{TAGS}"""
yt=f"""Anatomy quiz: name this vein in 3 seconds, then learn the hepatic portal vein and its 7 tributaries with one trick: 2-1-4.
{BODY}
Quick test: which vein usually empties into the splenic vein? The inferior mesenteric vein.
Save this for your next anatomy exam.
Study with: Anatomy & medical flash cards → {utm('youtube','short')}
Images: Gray's Anatomy (1918), Fig. 591, public domain; diagrams: Book Plume
Sources: TeachMeAnatomy, Venous Drainage of the Abdomen (teachmeanatomy.info/abdomen/vasculature/venous-drainage/); StatPearls, Anatomy, Abdomen and Pelvis, Portal Venous System (NCBI Bookshelf); Gray's Anatomy of the Human Body (1918), The Portal System of Veins.
Study and exam prep only.
{TAGS}"""
yt_title="Name This Vein in 3 Seconds? Hepatic Portal Vein Anatomy Quiz (2-1-4 Trick) #shorts"
yt_tags=["hepatic portal vein","portal vein tributaries","portal venous system","splenic vein","superior mesenteric vein","inferior mesenteric vein","anatomy quiz","anatomy mnemonics","nursing school","abdominal anatomy"]
tt_title="Name this vein in 3 seconds?"
tt_head="Name this vein in 3 seconds? Hint: your gut's blood visits it before your heart."
tt=tt_head+"\n#anatomy #anatomyquiz #nursingschool #medstudent #portalvein"
pin_v_title="Hepatic Portal Vein Quiz: Name This Vein in 3 Seconds (2-1-4 Trick)"
pin_v_text="Anatomy quiz: name this vein in 3 seconds. Hepatic portal vein tributaries trick 2-1-4: splenic + superior mesenteric build it, inferior mesenteric joins the splenic, left + right gastric, cystic and paraumbilical drain straight in. Anatomy flashcards and nursing school study tips from Book Plume. Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume."
pin_s_title="Can You Name This Vein? Hepatic Portal Vein Quiz | Nursing School Study Tips"
pin_s_text="Can you name this vein? Anatomy quiz: the hepatic portal vein carries blood from the gut to the liver. Its tributaries with the 2-1-4 trick: splenic + superior mesenteric, inferior mesenteric, left + right gastric, cystic, paraumbilical. Anatomy flashcards and nursing school study tips from Book Plume. Images: Gray's Anatomy (1918), Fig. 591, public domain."
assert len(yt_title)<=95 and yt_title.endswith(" #shorts"); assert len(tt_title)<=90; assert len(tt_head)<=150
assert len(pin_v_title)<=90 and len(pin_s_title)<=90 and len(pin_v_text)<=480 and len(pin_s_text)<=480
for l in [utm('youtube','short'),utm('pinterest','short'),utm('pinterest','pin')]: assert "utm_source=" in l and "utm_campaign=" in l
assert "utm_source=" in yt and "utm_campaign=" in yt
assert "bookplume" not in tt.lower()
print(len(yt_title),len(tt_title),len(tt_head),len(pin_v_title),len(pin_s_title),len(pin_v_text),len(pin_s_text),len(yt),len(ig))
D=dict(B=B,ig=ig,yt=yt,yt_title=yt_title,yt_tags=yt_tags,tt=tt,tt_title=tt_title,pin_v_title=pin_v_title,pin_v_text=pin_v_text,pin_s_title=pin_s_title,pin_s_text=pin_s_text,pl_v=utm('pinterest','short'),pl_s=utm('pinterest','pin'))
json.dump(D,open('texts.json','w'),indent=1,ensure_ascii=False)
