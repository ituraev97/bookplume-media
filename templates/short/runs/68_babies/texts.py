import json
SLUG="babies-300-bones"
COLL="https://bookplume.com/collections/anatomy-medical-flash-cards"
def utm(src,content): return f"{COLL}?utm_source={src}&utm_medium=social&utm_campaign={SLUG}&utm_content={content}"
TAGS="#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #bookplume #skeletalsystem #bodyfacts"
BODY="""Babies are born with about 300 bones. You have 206. Where do they go? 🦴

They don't vanish, they FUSE:
• Skull: the soft spots (fontanelles) are gaps between the bony plates. The biggest, the anterior fontanelle, usually closes by about 18 months to 2 years.
• Hip bone: the ilium, ischium and pubis fuse into ONE hip bone in the late teens, meeting in the hip socket (acetabulum) at a Y-shaped cartilage.
Trick: you SIT on your ISCHIUM (the ischial tuberosity carries your weight when sitting).

Quick test in the video: which 3 bones fuse into one hip bone?

Save this for your next anatomy exam."""
CREDIT="Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume"
SOCIAL=BODY+"\nStudy with: Anatomy Flash Cards – Visual Learning Set of the Human Body → bookplume.com\n"+CREDIT+"\n\n"+TAGS
YT=BODY+"\nStudy with: Anatomy Flash Cards – Visual Learning Set of the Human Body → "+utm("youtube","short")+"\n"+CREDIT+"\n\n"+TAGS+"\n\nSources: OpenStax Anatomy & Physiology 2e, 8.3 The Pelvic Girdle and Pelvis; University Hospitals, Anatomy of the Newborn Skull; Healthline, How Many Bones Does a Baby Have; Gray's Anatomy (1918), Figs. 197 and 237.\nEducational content for anatomy study, not medical advice."
TT_TITLE="Babies have ~300 bones, you have 206. Where do they go? 🦴 #anatomy"
YT_TITLE="Babies Have 300 Bones, Adults 206: Where Do They Go? (Bones Fuse) #shorts"
PIN_V_TITLE="Why Babies Have 300 Bones and Adults 206: Fontanelles and Hip Bone Fusion"
PIN_I_TITLE="Babies 300 Bones vs Adults 206 Cheat Sheet: Fontanelles, Ilium Ischium Pubis"
PIN_V_DESC="Babies are born with about 300 bones, adults have 206: bones fuse. Skull fontanelles (soft spots) close, the anterior fontanelle by about age 2; the ilium, ischium and pubis fuse into one hip bone at the acetabulum in the late teens. Anatomy study tips for nursing and A&P. Images: Gray's Anatomy (1918), public domain. #anatomy #nursingschool #studytips"
PIN_I_DESC="Cheat sheet: newborn about 300 bones vs adult 206. Fontanelles = soft spots between skull plates; anterior fontanelle closes by about age 2. Hip bone = ilium + ischium + pubis, meeting at the acetabulum. Trick: you sit on your ischium. Plates: Gray's 1918 (public domain). #anatomy #medstudent"
YT_TAGS=["how many bones does a baby have","babies have 300 bones","why babies have more bones","fontanelles","anterior fontanelle","hip bone anatomy","ilium ischium pubis","acetabulum","anatomy facts","nursing school"]
assert len(TT_TITLE)<=90 and len(YT_TITLE)<=95 and len(PIN_V_TITLE)<=90 and len(PIN_I_TITLE)<=90 and len(PIN_V_DESC)<=480 and len(PIN_I_DESC)<=480, (len(TT_TITLE),len(YT_TITLE),len(PIN_V_TITLE),len(PIN_I_TITLE),len(PIN_V_DESC),len(PIN_I_DESC))
print(len(TT_TITLE),len(YT_TITLE),len(PIN_V_TITLE),len(PIN_I_TITLE),len(PIN_V_DESC),len(PIN_I_DESC),len(SOCIAL))
json.dump(dict(SOCIAL=SOCIAL,YT=YT),open('texts.json','w'))
print(utm("pinterest","short"))
