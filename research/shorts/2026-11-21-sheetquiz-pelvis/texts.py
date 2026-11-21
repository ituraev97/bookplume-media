CREDIT="Images: Gray's Anatomy (1918), Fig. 241, public domain."
CAP=("Pelvis quiz — can you get 5/5? Comment your score 👇\n\n"
"5 parts of the pelvis on a Gray's Anatomy plate, from easy to hard. 3 seconds per question.\n\n"
+CREDIT+"\n\n#anatomy #humanbody #anatomyquiz #nursingschool #medstudent #pelvis #hipbone")
YT_TITLE="Pelvis Anatomy Quiz: Can You Get 5/5? #shorts"
YT_TAGS=["pelvis anatomy","pelvis quiz","anatomy quiz","hip bone anatomy","ilium ischium pubis","obturator foramen","pubic symphysis","sacrum","nursing school","anatomy and physiology"]
TT_TITLE="Pelvis quiz: can you get 5/5?"
TT_TEXT="Pelvis quiz: can you get 5/5? 5 parts of the pelvis, 3 seconds each. Comment your score 👇 #anatomy #anatomyquiz #pelvis #nursingschool #medstudent"
PIN_TITLE_V="Pelvis Anatomy Quiz: Ilium, Sacrum, Obturator Foramen, Pubic Symphysis, Ischium"
PIN_DESC=("Pelvis anatomy quiz for nursing and med students: name 5 parts of the pelvis seen from the front. Answers: 1 ilium, 2 sacrum, 3 obturator foramen, 4 pubic symphysis, 5 ischium (the bone you sit on). "+CREDIT)
LINK_V="https://bookplume.com/collections/anatomy-medical-flash-cards?utm_source=pinterest&utm_medium=social&utm_campaign=pelvis-quiz&utm_content=video"
CAR=("Pelvis quiz: can you name all 5? 🦴 Swipe for the answers, then comment your score.\n\n"
"The male pelvis from the front, easy → hard.\n\n"+CREDIT+"\n\n#anatomy #humanbody #anatomyquiz #nursingschool #medstudent #pelvis #hipbone")
assert len(YT_TITLE)<=95 and len(TT_TITLE)<=90 and len(PIN_TITLE_V)<=90 and len(PIN_DESC)<=480
assert len(TT_TEXT.split(' #')[0])<=150
assert "utm_source=" in LINK_V and "utm_campaign=" in LINK_V
for t in (CAP,CAR,TT_TEXT,PIN_DESC): assert "bookplume" not in t.lower() and "study with" not in t.lower()
print("ok",len(YT_TITLE),len(PIN_TITLE_V),len(PIN_DESC))
