import json
C="https://bookplume.com/collections/anatomy-medical-flash-cards"
U=lambda src,cont: f"{C}?utm_source={src}&utm_medium=social&utm_campaign=palmaris-longus&utm_content={cont}"
BODY = """About 15% of people don't have this forearm muscle. Do you? 💪

Test: touch your thumb to your pinky and flex your wrist. A thin cord in the middle of your wrist = palmaris longus.
It's one of 5 muscles that start at the medial epicondyle (common flexor origin). Hand trick, palm heel on the epicondyle:
Thumb = pronator teres · Index = flexor carpi radialis · Middle = palmaris longus · Ring = flexor digitorum superficialis · Pinky = flexor carpi ulnaris.

Quick test: which muscle is your ring finger? Answer in the video.

Save this for your next anatomy exam.
Study with: Anatomy Flash Cards – Visual Learning Set of the Human Body → {LINK}
Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume

#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #bookplume #palmarislongus #forearmmuscles"""
TEXT = BODY.replace("{LINK}", "bookplume.com")
YT_TEXT = BODY.replace("{LINK}", U("youtube","short"))
YT = "15% of People Don't Have This Muscle: Palmaris Longus Test + Hand Trick #shorts"
TT = "15% of people don't have this muscle 💪 do you? palmaris longus test"
PIN_V = "Palmaris Longus Test: Do You Have This Forearm Muscle? | Anatomy Study Tips"
PIN_S = "Forearm Flexor Muscles Hand Trick + Palmaris Longus Test | Anatomy Cheat Sheet"
PIN_DESC_V = "About 15% of people lack the palmaris longus. Test: touch thumb to pinky and flex the wrist; a cord in the middle of the wrist means you have it. Hand trick for the 5 muscles from the medial epicondyle: thumb pronator teres, index flexor carpi radialis, middle palmaris longus, ring flexor digitorum superficialis, pinky flexor carpi ulnaris. Images: Gray's Anatomy (1918), public domain. #anatomy #nursingschool #studytips"
PIN_DESC_S = "Forearm flexors cheat sheet: palm heel on the medial epicondyle, fingers down the forearm. Thumb = pronator teres, index = flexor carpi radialis, middle = palmaris longus, ring = flexor digitorum superficialis, pinky = flexor carpi ulnaris. Palmaris longus is absent in about 15% of people. Diagram: Book Plume. #anatomy #nursingschool #medstudent #studytips"
TAGS = ["palmaris longus","palmaris longus test","forearm muscles","anterior forearm muscles","forearm flexors mnemonic","medial epicondyle","anatomy mnemonics","nursing school","med student","anatomy flashcards"]
PIN_LINK_V = U("pinterest","short"); PIN_LINK_S = U("pinterest","pin")
for n,v,lim in [("YT",YT,95),("TT",TT,90),("PIN_V",PIN_V,90),("PIN_S",PIN_S,90),("PIN_DESC_V",PIN_DESC_V,480),("PIN_DESC_S",PIN_DESC_S,480)]:
    print(n,len(v)); assert len(v)<=lim,n
print("TEXT",len(TEXT)); assert len(TEXT)<=2200
assert YT.endswith(" #shorts") and 6<=len(TAGS)<=10 and 5<=TEXT.count('#')<=8
json.dump(dict(TEXT=TEXT,YT_TEXT=YT_TEXT,YT=YT,TT=TT,PIN_V=PIN_V,PIN_S=PIN_S,PIN_DESC_V=PIN_DESC_V,PIN_DESC_S=PIN_DESC_S,TAGS=TAGS,PIN_LINK_V=PIN_LINK_V,PIN_LINK_S=PIN_LINK_S),open('texts.json','w'),ensure_ascii=False,indent=1)
