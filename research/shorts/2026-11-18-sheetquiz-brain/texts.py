CREDIT="Images: Gray's Anatomy (1918), Fig. 715, public domain."
CAP=("Brain quiz — can you get 5/5? Comment your score 👇\n\n"
"5 parts of the brain on one mid-sagittal section from Gray's Anatomy, from easy to hard. 3 seconds per question.\n\n"
+CREDIT+"\n\n#anatomy #humanbody #anatomyquiz #nursingschool #medstudent #brainanatomy #neuroanatomy")
YT_TITLE="Brain Anatomy Quiz: Can You Get 5/5? #shorts"
YT_TAGS=["brain anatomy","brain quiz","anatomy quiz","neuroanatomy","cerebellum","corpus callosum","pons","medulla oblongata","pituitary gland","nursing school"]
TT_TITLE="Brain quiz: can you get 5/5?"
TT_TEXT="Brain quiz: can you get 5/5? 5 parts, 3 seconds each. Comment your score 👇 #anatomy #anatomyquiz #brainanatomy #nursingschool #medstudent"
PIN_TITLE_V="Brain Anatomy Quiz: Can You Name These 5 Parts of the Brain?"
PIN_TITLE_S="Brain Anatomy Quiz: Name 5 Brain Parts on a Gray's Anatomy Plate"
PIN_DESC=("Brain anatomy quiz for nursing and med students: cerebellum, corpus callosum, pons, medulla oblongata and pituitary gland on a mid-sagittal section. "+CREDIT)
BASE="https://bookplume.com/collections/anatomy-medical-flash-cards?utm_source=pinterest&utm_medium=social&utm_campaign=brain-quiz&utm_content="
LINK_V=BASE+"video"; LINK_S=BASE+"pin"
CAR=("Brain quiz: can you name all 5? 🧠 Swipe for the answers, then comment your score.\n\n"
"Mid-sagittal section of the brain, easy → hard.\n\n"+CREDIT+"\n\n#anatomy #humanbody #anatomyquiz #nursingschool #medstudent #brainanatomy #neuroanatomy")
assert len(YT_TITLE)<=95 and len(TT_TITLE)<=90 and len(PIN_TITLE_V)<=90 and len(PIN_TITLE_S)<=90 and len(PIN_DESC)<=480
assert len(TT_TEXT.split(' #')[0])<=150
for L in (LINK_V,LINK_S): assert "utm_source=" in L and "utm_campaign=" in L
for t in (CAP,CAR,TT_TEXT): assert "bookplume" not in t.lower() and "study with" not in t.lower()
print("ok",len(YT_TITLE),len(PIN_TITLE_V),len(PIN_TITLE_S),len(PIN_DESC))
