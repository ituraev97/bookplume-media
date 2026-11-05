import json
TEXT = """Can you name the 3 muscles that attach to the intertubercular groove? Remember: a Lady between two Majors 🩺

The intertubercular (bicipital) groove sits at the top of the humerus, between the greater and lesser tubercles. The long head of biceps tendon runs through it.
Lady → Latissimus dorsi: the floor of the groove
Major → Pectoralis major: the lateral lip
Major → Teres major: the medial lip
Lateral to medial: major, lady, major. Bonus: all three adduct and medially rotate the arm.

Quick test: which tendon runs inside the groove? Answer in the video.

Save this for your next anatomy exam.
Study with: Anatomy Flash Cards – Visual Learning Set of the Human Body → bookplume.com
Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume

#anatomy #humerus #shoulderanatomy #anatomymnemonics #nursingschool #nursingstudent #medstudent #studytips #anatomyflashcards #bookplume"""
YT = "Intertubercular Groove Mnemonic: A Lady Between Two Majors | Arm Anatomy #shorts"
TT = "3 muscles, 1 groove: a lady between two majors 🩺"
PIN_V = "Intertubercular Groove Mnemonic | Anatomy Flashcards & Nursing School Study Tips"
PIN_S = "A Lady Between Two Majors: Humerus Cheat Sheet | Anatomy Flashcards"
PIN_DESC_V = "Upper limb anatomy mnemonic for exams: a lady between two majors. Latissimus dorsi (the lady) inserts on the floor of the intertubercular groove, between pectoralis major (lateral lip) and teres major (medial lip). The long head of biceps runs in the groove. Images: Gray's Anatomy (1918), public domain. #anatomy #nursingschool #studytips"
PIN_DESC_S = "Intertubercular (bicipital) groove cheat sheet: pectoralis major = lateral lip, latissimus dorsi = floor, teres major = medial lip. Mnemonic: a lady between two majors. The long head of biceps tendon runs inside the groove. Save for your next anatomy exam. Diagram: Book Plume. #anatomy #nursingschool #medstudent #studytips"
TAGS = ["intertubercular groove","bicipital groove","lady between two majors","latissimus dorsi","pectoralis major","teres major","humerus anatomy","anatomy mnemonics","nursing school","anatomy flashcards"]
THREADS = """3 muscles grab one tiny groove on your humerus. Can you name them? 🩺

A Lady between two Majors:
pectoralis MAJOR = lateral lip
LATissimus dorsi = floor
teres MAJOR = medial lip

Full study set: bookplume.com

What's your favorite upper limb mnemonic? #anatomy"""
for n,v,lim in [("YT",YT,95),("TT",TT,90),("PIN_V",PIN_V,90),("PIN_S",PIN_S,90),("PIN_DESC_V",PIN_DESC_V,480),("PIN_DESC_S",PIN_DESC_S,480),("THREADS",THREADS,450)]:
    print(n,len(v)); assert len(v)<=lim,n
print("TEXT",len(TEXT)); assert len(TEXT)<=2200
assert YT.endswith(" #shorts") and THREADS.count('#')<=1 and 6<=len(TAGS)<=10
json.dump(dict(TEXT=TEXT,YT=YT,TT=TT,PIN_V=PIN_V,PIN_S=PIN_S,PIN_DESC_V=PIN_DESC_V,PIN_DESC_S=PIN_DESC_S,TAGS=TAGS,THREADS=THREADS),open('texts.json','w'),ensure_ascii=False,indent=1)
