import json
B="https://raw.githubusercontent.com/ituraev97/bookplume-media/media-20261117-calf/v/"
COL="https://bookplume.com/collections/anatomy-medical-flash-cards"
SLUG="superficial-calf-muscles"
utm=lambda src,c: f"{COL}?utm_source={src}&utm_medium=social&utm_campaign={SLUG}&utm_content={c}"
TAGS="#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #anatomyquiz #bookplume #calfmuscles #lowerlimb"
BODY="""Your calf is a "triceps": triceps surae = 3 heads → 1 tendon.
1–2. Gastrocnemius: 2 heads (medial + lateral) from the femur's condyles, so it crosses the knee AND the ankle.
3. Soleus: the flat muscle underneath, from the tibia + fibula. It starts below the knee, so it only crosses the ankle.
→ All 3 heads pour into the Achilles (calcaneal) tendon on the heel bone: the thickest, strongest tendon in the body.
Bonus: plantaris, a small belly with a long skinny tendon, missing in about 1 in 10 people.
All are supplied by the tibial nerve."""
ig=f"""Can you name this calf muscle in 3 seconds? Then the 2 others that make your Achilles 👀
{BODY}
Quick test: gastrocnemius or soleus, which one crosses the knee? Answer in the video.
Save this for your next anatomy exam.
Study with: Anatomy Flash Cards (visual learning set) → bookplume.com
Images: Gray's Anatomy (1918), Fig. 438, public domain; diagrams: Book Plume
{TAGS}"""
yt=f"""Anatomy quiz: name this calf muscle in 3 seconds, then learn the superficial calf muscles on one map: gastrocnemius (2 heads), soleus, the Achilles tendon and plantaris.
{BODY}
Quick test: gastrocnemius or soleus, which crosses the knee? Gastrocnemius (soleus only crosses the ankle).
Full quiz on our channel: Can You Name These 27 Leg Muscles? (Anatomy Quiz)
Study with: Book Plume anatomy flash cards → {utm('youtube','short')}
Images: Gray's Anatomy (1918), Fig. 438, public domain (1918 name: "tendo calcaneus" = Achilles / calcaneal tendon); diagrams: Book Plume
Sources: Gray's Anatomy of the Human Body (1918), "The Posterior Crural Muscles" (triceps surae, tendo calcaneus = thickest and strongest tendon); TeachMeAnatomy, Muscles of the Posterior Leg (teachmeanatomy.info/lower-limb/muscles/leg/posterior-compartment/); StatPearls, Anatomy, Bony Pelvis and Lower Limb: Achilles Tendon.
Study and exam prep only.
{TAGS}"""
yt_title="Name This Calf Muscle in 3 Seconds? Calf Muscles Quiz: Soleus, Gastrocnemius #shorts"
yt_tags=["calf muscles anatomy","superficial calf muscles","gastrocnemius","soleus","triceps surae","achilles tendon","plantaris","posterior leg muscles","anatomy quiz","lower limb anatomy"]
tt_title="3 calf muscle questions. How many can you get?"
tt_head="3 calf anatomy questions, 2 seconds each. How many can you get?"
tt=tt_head+"\n#anatomy #anatomyquiz #nursingschool #medstudent #calfmuscles"
pin_v_title="Calf Muscles Quiz: Name This Muscle in 3 Seconds (Soleus, Gastrocnemius, Achilles)"
pin_v_text="Anatomy quiz: name this calf muscle in 3 seconds. Triceps surae = 3 heads, 1 tendon: gastrocnemius (2 heads from the femur, crosses the knee + ankle), soleus (from tibia + fibula, ankle only), all into the Achilles tendon. Bonus: plantaris. Anatomy flashcards and study tips from Book Plume. Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume."
pin_s_title="Can You Name This Calf Muscle? Leg Anatomy Quiz | Anatomy Flashcards Study Tips"
pin_s_text="Can you name this calf muscle? Anatomy quiz from Gray's Fig. 438. Your calf is a triceps: 2 gastrocnemius heads + soleus = triceps surae, 1 Achilles tendon (the thickest tendon in the body). Nursing and med school study tips and anatomy flashcards from Book Plume. Images: Gray's Anatomy (1918), Fig. 438, public domain."
assert len(yt_title)<=95 and yt_title.endswith(" #shorts"); assert len(tt_title)<=90; assert len(tt_head)<=150
assert len(pin_v_title)<=90 and len(pin_s_title)<=90 and len(pin_v_text)<=480 and len(pin_s_text)<=480
for l in [utm('youtube','short'),utm('pinterest','short'),utm('pinterest','pin')]: assert "utm_source=" in l and "utm_campaign=" in l
assert "utm_source=" in yt and "utm_campaign=" in yt
assert "bookplume" not in tt.lower()
print(len(yt_title),len(tt_title),len(tt_head),len(pin_v_title),len(pin_s_title),len(pin_v_text),len(pin_s_text),len(yt),len(ig))
D=dict(B=B,ig=ig,yt=yt,yt_title=yt_title,yt_tags=yt_tags,tt=tt,tt_title=tt_title,pin_v_title=pin_v_title,pin_v_text=pin_v_text,pin_s_title=pin_s_title,pin_s_text=pin_s_text,pl_v=utm('pinterest','short'),pl_s=utm('pinterest','pin'))
json.dump(D,open('texts.json','w'),indent=1,ensure_ascii=False)
