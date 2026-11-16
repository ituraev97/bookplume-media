import json
B="https://raw.githubusercontent.com/ituraev97/bookplume-media/media-20261116-trigeminal/v/"
COL="https://bookplume.com/collections/anatomy-medical-flash-cards"
SLUG="trigeminal-nerve"
utm=lambda src,c: f"{COL}?utm_source={src}&utm_medium=social&utm_campaign={SLUG}&utm_content={c}"
TAGS="#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #anatomyquiz #bookplume #cranialnerves #trigeminalnerve"
BODY="""Trigeminal nerve = cranial nerve 5 (CN V). It splits into 3:
V1 ophthalmic: forehead, upper eyelid, bridge of the nose. Exits through the superior orbital fissure.
V2 maxillary: lower eyelid, cheek, upper lip. Exits through the foramen rotundum.
V3 mandibular: chin, lower lip, lower jaw, plus the chewing muscles (the only division with motor fibers). Exits through the foramen ovale.
Exits in order: Standing Room Only = Superior orbital fissure, Rotundum, Ovale.
Exam trap: the skin over the angle of the jaw is not trigeminal (great auricular nerve, C2–C3)."""
ig=f"""Can you name this cranial nerve in 3 seconds? Then V1, V2, V3 + where each one leaves the skull 👀
{BODY}
Quick test: which hole does V2 use? Answer in the video.
Save this for your next anatomy exam.
Study with: Anatomy Flash Cards (visual learning set) → bookplume.com
Images: Gray's Anatomy (1918), Fig. 778, public domain; diagrams: Book Plume
{TAGS}"""
yt=f"""Anatomy quiz: name this cranial nerve in 3 seconds, then learn the trigeminal nerve's 3 divisions on one face map (V1 ophthalmic, V2 maxillary, V3 mandibular) and the Standing Room Only mnemonic for their exits.
{BODY}
Quick test: which hole does V2 maxillary use? Foramen rotundum (R = Room).
Study with: Book Plume anatomy flash cards → {utm('youtube','short')}
Images: Gray's Anatomy (1918), Fig. 778, public domain (1918 name: "semilunar ganglion" = trigeminal ganglion); diagrams: Book Plume
Sources: TeachMeAnatomy, The Trigeminal Nerve (CN V) (teachmeanatomy.info/head/cranial-nerves/trigeminal-nerve/); TeachMeAnatomy, The Cervical Plexus (great auricular nerve); Gray's Anatomy of the Human Body (1918), Fig. 778.
Study and exam prep only.
{TAGS}"""
yt_title="Name This Nerve in 3 Seconds? Trigeminal Nerve V1 V2 V3 Mnemonic (Cranial Nerve 5) #shorts"
yt_tags=["trigeminal nerve","trigeminal nerve branches","cranial nerve 5","V1 V2 V3","standing room only mnemonic","foramen rotundum","foramen ovale","superior orbital fissure","cranial nerves mnemonic","anatomy quiz"]
tt_title="Name this nerve in 3 seconds?"
tt_head="Name this nerve in 3 seconds? Med students, this one's on every head and neck exam."
tt=tt_head+"\n#anatomy #anatomyquiz #nursingschool #medstudent #cranialnerves"
pin_v_title="Trigeminal Nerve Quiz: Name This Nerve in 3 Sec + V1 V2 V3 Mnemonic"
pin_v_text="Anatomy quiz: name this cranial nerve in 3 seconds. The trigeminal nerve (CN V) on one face map: V1 ophthalmic (forehead, upper eyelid), V2 maxillary (cheek, upper lip), V3 mandibular (chin, lower lip, chewing muscles). Exits: Standing Room Only = superior orbital fissure, rotundum, ovale. Anatomy flashcards and study tips from Book Plume. Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume."
pin_s_title="Can You Name This Cranial Nerve? Trigeminal Nerve Quiz | Anatomy Study Tips"
pin_s_text="Can you name this nerve? Anatomy quiz from Gray's Fig. 778: the trigeminal nerve (cranial nerve 5) and its 3 branches V1 ophthalmic, V2 maxillary, V3 mandibular. Exits mnemonic: Standing Room Only (superior orbital fissure, foramen rotundum, foramen ovale). Anatomy flashcards from Book Plume. Images: Gray's Anatomy (1918), Fig. 778, public domain."
assert len(yt_title)<=95 and yt_title.endswith(" #shorts"); assert len(tt_title)<=90; assert len(tt_head)<=150
assert len(pin_v_title)<=90 and len(pin_s_title)<=90 and len(pin_v_text)<=480 and len(pin_s_text)<=480
for l in [utm('youtube','short'),utm('pinterest','short'),utm('pinterest','pin')]: assert "utm_source=" in l and "utm_campaign=" in l
assert "utm_source=" in yt and "utm_campaign=" in yt
assert "bookplume" not in tt.lower()
print(len(yt_title),len(tt_title),len(tt_head),len(pin_v_title),len(pin_s_title),len(pin_v_text),len(pin_s_text),len(yt),len(ig))
D=dict(B=B,ig=ig,yt=yt,yt_title=yt_title,yt_tags=yt_tags,tt=tt,tt_title=tt_title,pin_v_title=pin_v_title,pin_v_text=pin_v_text,pin_s_title=pin_s_title,pin_s_text=pin_s_text,pl_v=utm('pinterest','short'),pl_s=utm('pinterest','pin'))
json.dump(D,open('texts.json','w'),indent=1,ensure_ascii=False)
