B="https://raw.githubusercontent.com/ituraev97/bookplume-media/media-20261109-radial-nerve/v/"
COL="https://bookplume.com/collections/anatomy-medical-flash-cards"
utm=lambda src,c: f"{COL}?utm_source={src}&utm_medium=social&utm_campaign=radial-nerve-muscles&utm_content={c}"
TAGS="#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #bookplume #radialnerve #anatomymnemonics"
BODY="""Can you name the muscles your radial nerve supplies? 🧠 One word: BEAST.

• B = Brachioradialis
• E = Extensors of the wrist and fingers (ext. carpi radialis longus + brevis, extensor digitorum, ext. digiti minimi, ext. carpi ulnaris, thumb extensors)
• A = Abductor pollicis longus
• S = Supinator
• T = Triceps (+ anconeus)
Rule: radial nerve = the BACK of the arm and forearm.

Quick test in the video: which BEAST muscle bends your elbow? (Brachioradialis: an elbow flexor, yet it runs on the radial nerve. Classic exam trap.)

Save this for your next anatomy exam.
Study with: Anatomy Flash Cards – Visual Learning Set of the Human Body → {LINK}
Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume

"""+TAGS
SOC=BODY.replace("{LINK}","bookplume.com")
YT=BODY.replace("{LINK}",utm("youtube","short"))+"\n\nSources: StatPearls (NCBI Bookshelf), Radial Nerve Injury (muscles supplied by the radial nerve proper and the posterior interosseous nerve); OpenStax Anatomy & Physiology 2e, 11.5 Muscles of the Pectoral Girdle and Upper Limbs; Gray's Anatomy (1918), Figs. 418 and 818.\nEducational content for anatomy study, not medical advice."
TT_TITLE="Radial nerve muscles in 1 word: BEAST 🧠 #radialnerve #anatomymnemonics"
YT_TITLE="Radial Nerve Muscles Mnemonic: BEAST | Anatomy Study Tip #shorts"
PIN_V="Radial Nerve Muscles Mnemonic: BEAST | Upper Limb Anatomy Study Tips"
PIN_I="Radial Nerve Muscles Cheat Sheet: Brachioradialis, Extensors, Supinator, Triceps"
PIN_VD="Radial nerve muscles in one word, BEAST: brachioradialis, extensors of the wrist and fingers, abductor pollicis longus, supinator, triceps. Rule: radial nerve = back of the arm and forearm. Exam trap: brachioradialis flexes the elbow yet runs on the radial nerve. Anatomy study tips for nursing school and A&P. Images: Gray's Anatomy (1918), public domain. #anatomy #nursingschool #studytips"
PIN_ID="Cheat sheet: radial nerve muscles = BEAST. Brachioradialis, Extensors (wrist + fingers), Abductor pollicis longus, Supinator (deep, wraps the radius), Triceps. Radial nerve = back of the arm + forearm. Save for your next anatomy exam. Plate: Gray's 1918 (public domain). #anatomy #medstudent"
YT_TAGS=["radial nerve","radial nerve muscles","radial nerve mnemonic","beast mnemonic","brachioradialis","posterior forearm muscles","upper limb anatomy","anatomy mnemonics","nursing school","anatomy and physiology"]
for n,v,l in [("TT",TT_TITLE,90),("YT",YT_TITLE,95),("PV",PIN_V,90),("PI",PIN_I,90),("PVD",PIN_VD,480),("PID",PIN_ID,480)]:
    assert len(v)<=l,(n,len(v)); print(n,len(v))
for link in [utm("youtube","short"),utm("pinterest","short"),utm("pinterest","pin")]:
    assert "utm_source=" in link and "utm_campaign=" in link
assert "utm_source=" in YT and "utm_campaign=" in YT
