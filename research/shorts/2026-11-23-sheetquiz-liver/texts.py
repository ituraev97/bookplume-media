CREDIT="Images: Gray's Anatomy (1918), Fig. 1086, public domain."
CAP=("Liver quiz — can you get 5/5? Comment your score 👇\n\n"
"5 parts of the liver on a Gray's Anatomy plate, from easy to hard. 3 seconds per question. Save the answers for your next anatomy exam.\n\n"
+CREDIT+"\n\n#anatomy #humanbody #anatomyquiz #nursingschool #medstudent #liver #liveranatomy")
TT_TITLE="Liver quiz: can you get 5/5?"
TT_TEXT="Liver quiz: can you get 5/5? 5 parts, 3 seconds each. Comment your score 👇 #anatomy #anatomyquiz #liver #nursingschool #medstudent"
PIN_TITLE_V="Liver Anatomy Quiz: Gallbladder, Right Lobe, Left Lobe, Inferior Vena Cava, Caudate Lobe"
PIN_DESC=("Liver anatomy quiz for nursing and med students: name 5 parts of the liver from below. Answers: 1 gallbladder (stores bile), 2 right lobe (the biggest), 3 left lobe, 4 inferior vena cava, 5 caudate lobe (caudate means tail). "+CREDIT)
LINK_V="https://bookplume.com/collections/anatomy-medical-flash-cards?utm_source=pinterest&utm_medium=social&utm_campaign=liver-quiz&utm_content=video"
CAR=("Liver quiz: can you name all 5? Swipe, then check the answers on the last slide and comment your score.\n\n"
"The liver seen from below, easy → hard.\n\n"+CREDIT+"\n\n#anatomy #humanbody #anatomyquiz #nursingschool #medstudent #liver #liveranatomy")
assert len(TT_TITLE)<=90 and len(PIN_TITLE_V)<=90 and len(PIN_DESC)<=480
assert len(TT_TEXT.split(' #')[0])<=150
assert "utm_source=" in LINK_V and "utm_campaign=" in LINK_V
for t in (CAP,CAR,TT_TEXT,PIN_DESC): assert "bookplume" not in t.lower() and "study with" not in t.lower()
print("ok",len(PIN_TITLE_V),len(PIN_DESC))
