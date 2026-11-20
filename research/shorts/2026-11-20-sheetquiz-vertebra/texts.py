CREDIT="Images: Gray's Anatomy (1918), Fig. 82, public domain."
CAP=("Vertebra quiz — can you get 5/5? Comment your score 👇\n\n"
"5 parts of one thoracic vertebra seen from above, on a Gray's Anatomy plate, from easy to hard. 3 seconds per question.\n\n"
+CREDIT+"\n\n#anatomy #humanbody #anatomyquiz #nursingschool #medstudent #spine #vertebra")
YT_TITLE="Vertebra Anatomy Quiz: Can You Get 5/5? #shorts"
YT_TAGS=["vertebra anatomy","vertebra quiz","anatomy quiz","spine anatomy","thoracic vertebra","spinous process","pedicle","lamina","vertebral body","nursing school"]
TT_TITLE="Vertebra quiz: can you get 5/5?"
TT_TEXT="Vertebra quiz: can you get 5/5? 5 parts of one vertebra, 3 seconds each. Comment your score 👇 #anatomy #anatomyquiz #spine #nursingschool #medstudent"
PIN_TITLE_V="Vertebra Anatomy Quiz: Can You Name These 5 Parts of a Vertebra?"
PIN_TITLE_S="Vertebra Anatomy Quiz: Name 5 Parts of a Thoracic Vertebra"
PIN_DESC=("Spine anatomy quiz for nursing and med students: name 5 parts of a thoracic vertebra seen from above. Answers: 1 vertebral body, 2 spinous process, 3 pedicle, 4 lamina, 5 costal facet. "+CREDIT)
BASE="https://bookplume.com/collections/anatomy-medical-flash-cards?utm_source=pinterest&utm_medium=social&utm_campaign=vertebra-quiz&utm_content="
LINK_V=BASE+"video"; LINK_S=BASE+"pin"
CAR=("Vertebra quiz: can you name all 5? 🦴 Swipe for the answers, then comment your score.\n\n"
"A thoracic vertebra from above, easy → hard.\n\n"+CREDIT+"\n\n#anatomy #humanbody #anatomyquiz #nursingschool #medstudent #spine #vertebra")
assert len(YT_TITLE)<=95 and len(TT_TITLE)<=90 and len(PIN_TITLE_V)<=90 and len(PIN_TITLE_S)<=90 and len(PIN_DESC)<=480
assert len(TT_TEXT.split(' #')[0])<=150
for L in (LINK_V,LINK_S): assert "utm_source=" in L and "utm_campaign=" in L
for t in (CAP,CAR,TT_TEXT): assert "bookplume" not in t.lower() and "study with" not in t.lower()
print("ok",len(YT_TITLE),len(PIN_TITLE_V),len(PIN_TITLE_S),len(PIN_DESC))
