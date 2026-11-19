CREDIT="Images: Gray's Anatomy (1918), Fig. 490, public domain."
CAP=("Heart quiz — can you get 5/5? Comment your score 👇\n\n"
"5 parts of the heart on one front view from Gray's Anatomy, from easy to hard. 3 seconds per question.\n\n"
+CREDIT+"\n\n#anatomy #humanbody #anatomyquiz #nursingschool #medstudent #heartanatomy #cardiology")
YT_TITLE="Heart Anatomy Quiz: Can You Get 5/5? #shorts"
YT_TAGS=["heart anatomy","heart quiz","anatomy quiz","cardiac anatomy","aortic arch","left ventricle","superior vena cava","pulmonary trunk","right ventricle","nursing school"]
TT_TITLE="Heart quiz: can you get 5/5?"
TT_TEXT="Heart quiz: can you get 5/5? 5 parts, 3 seconds each. Comment your score 👇 #anatomy #anatomyquiz #heartanatomy #nursingschool #medstudent"
PIN_TITLE_V="Heart Anatomy Quiz: Can You Name These 5 Parts of the Heart?"
PIN_TITLE_S="Heart Anatomy Quiz: Name 5 Heart Parts on a Gray's Anatomy Plate"
PIN_DESC=("Heart anatomy quiz for nursing and med students: aortic arch, left ventricle, superior vena cava, pulmonary trunk and right ventricle on a front view of the heart. "+CREDIT)
BASE="https://bookplume.com/collections/anatomy-medical-flash-cards?utm_source=pinterest&utm_medium=social&utm_campaign=heart-quiz&utm_content="
LINK_V=BASE+"video"; LINK_S=BASE+"pin"
CAR=("Heart quiz: can you name all 5? ❤️ Swipe for the answers, then comment your score.\n\n"
"Front view of the heart, easy → hard.\n\n"+CREDIT+"\n\n#anatomy #humanbody #anatomyquiz #nursingschool #medstudent #heartanatomy #cardiology")
assert len(YT_TITLE)<=95 and len(TT_TITLE)<=90 and len(PIN_TITLE_V)<=90 and len(PIN_TITLE_S)<=90 and len(PIN_DESC)<=480
assert len(TT_TEXT.split(' #')[0])<=150
for L in (LINK_V,LINK_S): assert "utm_source=" in L and "utm_campaign=" in L
for t in (CAP,CAR,TT_TEXT): assert "bookplume" not in t.lower() and "study with" not in t.lower()
print("ok",len(YT_TITLE),len(PIN_TITLE_V),len(PIN_TITLE_S),len(PIN_DESC))
