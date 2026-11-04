import json
TEXT = """Which artery carries oxygen-poor blood? If you said "none," this one's for you. 🫀

Your blood runs in 2 loops:
PULMONARY loop: right ventricle → pulmonary arteries → lungs (pick up O2) → pulmonary veins → left atrium
SYSTEMIC loop: left ventricle → aorta → whole body → venae cavae → right atrium

The trick: Arteries go Away from the heart. A for artery, A for away. It's about DIRECTION, not oxygen.
So the pulmonary arteries carry oxygen-poor blood to the lungs, and the pulmonary veins bring oxygen-rich blood back.

Quick test: which ventricle pumps blood to your whole body? Answer in the video.

Save this for your next anatomy exam.
Study with: Anatomy Flash Cards – Visual Learning Set of the Human Body → bookplume.com
Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume

#anatomy #pulmonarycirculation #cardiovascular #heartanatomy #nursingschool #nursingstudent #medstudent #studytips #anatomyflashcards #bookplume"""
YT = "Pulmonary vs Systemic Circulation: The Artery Trick (Arteries go Away) #shorts"
TT = "Which artery carries oxygen-poor blood? Pulmonary vs systemic 🫀"
PIN_V = "Pulmonary vs Systemic Circulation Trick | Anatomy Flashcards & Nursing School Tips"
PIN_S = "Arteries go Away: Pulmonary vs Systemic Circulation Cheat Sheet | Anatomy Flashcards"
PIN_DESC_V = "Pulmonary vs systemic circulation for anatomy exams: pulmonary loop = right ventricle to lungs to left atrium; systemic loop = left ventricle, aorta, body, right atrium. Trick: Arteries go Away from the heart, so pulmonary arteries carry oxygen-poor blood and pulmonary veins carry oxygen-rich blood. Nursing school study tip. Images: Gray's Anatomy (1918), public domain. #anatomy #nursingschool #studytips"
PIN_DESC_S = "Circulation cheat sheet: Arteries go Away from the heart (direction, not oxygen). Pulmonary arteries = oxygen-poor blood to the lungs; pulmonary veins = oxygen-rich blood back to the left atrium. Left ventricle pumps to the whole body. Save for your next anatomy exam. Images: Gray's Anatomy (1918), public domain. #anatomy #nursingschool #medstudent #studytips"
THREADS = """Which artery carries oxygen-poor blood? Most people say "none."

Trick: Arteries go Away from the heart. It's about direction, not oxygen.
So the pulmonary arteries carry oxygen-poor blood to the lungs 🫀

Full study set: bookplume.com

Did your teacher ever trick you with this one on a test?
#anatomy"""
TAGS = ["pulmonary circulation","systemic circulation","pulmonary vs systemic","pulmonary artery","heart anatomy","cardiovascular system","nursing school","anatomy mnemonics","anatomy flashcards"]
for n,v,lim in [("YT",YT,95),("TT",TT,90),("PIN_V",PIN_V,90),("PIN_S",PIN_S,90),("PIN_DESC_V",PIN_DESC_V,480),("PIN_DESC_S",PIN_DESC_S,480),("THREADS",THREADS,450)]:
    print(n,len(v)); assert len(v)<=lim,n
print("TEXT",len(TEXT)); assert len(TEXT)<=2200
assert YT.endswith(" #shorts")
json.dump(dict(TEXT=TEXT,YT=YT,TT=TT,PIN_V=PIN_V,PIN_S=PIN_S,PIN_DESC_V=PIN_DESC_V,PIN_DESC_S=PIN_DESC_S,THREADS=THREADS,TAGS=TAGS),open('/home/claude/work/texts.json','w'),ensure_ascii=False,indent=1)
