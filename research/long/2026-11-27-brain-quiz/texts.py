import json
TA="Your Brain Has a Part Named After a Seahorse: Can You Find It?"
TB="Brain Parts You Always Mix Up: Anatomy Quiz (23 Questions)"
TC="Brain Anatomy Explained: 23 Parts in 9 Minutes (Quiz)"
for t in (TA,TB,TC): assert len(t)<=70,(t,len(t))
LINK="https://bookplume.com/collections/anatomy-medical-flash-cards?utm_source=youtube&utm_medium=video&utm_campaign=brain-anatomy-quiz&utm_content=description"
assert "utm_source=" in LINK and "utm_campaign=" in LINK
ch=open("chapters.txt").read().strip()
assert ch.startswith("0:00")
DESC=f"""Brain anatomy quiz: can you name all 23 parts of the brain? Test yourself with 4 levels, from the four lobes to the fornix, the olive and the fourth ventricle, with a memory trick after each level.

Keep score and comment your result! (Which level stopped you?)

Chapters
{ch}

What you will take away
- The 4 lobes and what each one does: front moves, top feels, side hears, back sees.
- Motor in front, sensory behind: the precentral and postcentral gyri on either side of the central sulcus.
- The brainstem from top to bottom: midbrain, pons, medulla.
- Old atlas names for the same parts (Sylvian fissure = lateral sulcus, septum lucidum = septum pellucidum).
- How cerebrospinal fluid flows: lateral ventricles, third ventricle, cerebral aqueduct, fourth ventricle.

Study with Book Plume anatomy flash cards: {LINK}

Next video: what happens in your body when you sneeze, second by second.

Image credits: all plates from Gray's Anatomy of the Human Body, 20th US edition, 1918 (Henry Gray; illustrations by Henry Vandyke Carter and others), public domain, via the Internet Archive: https://archive.org/details/anatomyofhumanbo00grayrich (recoloured and cropped by Book Plume). Narration is synthetic text-to-speech.

Sources: Gray's Anatomy (1918), Plates and figures 682, 715, 726, 728, 736.

Educational content for anatomy study, not medical advice.

#anatomy #brainanatomy #anatomyquiz"""
TAGS=["brain anatomy","brain anatomy quiz","anatomy quiz","neuroanatomy","parts of the brain","brain parts quiz","name the parts of the brain","anatomy for nursing students","anatomy for medical students","brainstem","hippocampus","cerebral cortex","lobes of the brain","ventricles of the brain","anatomy and physiology","nursing school"]
assert 12<=len(TAGS)<=18 and len(DESC)<5000
json.dump(dict(TA=TA,TB=TB,TC=TC,DESC=DESC,TAGS=TAGS),open("texts.json","w"))
print(len(TA),len(TB),len(TC),len(DESC))
