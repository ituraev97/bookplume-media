B="https://raw.githubusercontent.com/ituraev97/bookplume-media/media-20261109-carpal-tunnel/v/"
COL="https://bookplume.com/collections/anatomy-medical-flash-cards"
utm=lambda src,c: f"{COL}?utm_source={src}&utm_medium=social&utm_campaign=carpal-tunnel-contents&utm_content={c}"
TAGS="#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #bookplume #carpaltunnel #handanatomy"
BODY="""Can you name all 10 things inside the carpal tunnel? 🧠 Carpal tunnel contents mnemonic: 4-4-1-1.

• 4 = flexor digitorum superficialis tendons (on top)
• 4 = flexor digitorum profundus tendons (underneath)
• 1 = flexor pollicis longus (the thumb tendon)
• 1 = median nerve (the only nerve inside)
Roof: flexor retinaculum (transverse carpal ligament). Floor: the carpal bones.

Quick test in the video: is the ulnar nerve inside? No! The ulnar nerve and artery run outside, through Guyon's canal. Flexor carpi radialis and palmaris longus are not inside either.

Save this for your next anatomy exam.
Study with: Anatomy Flash Cards – Visual Learning Set of the Human Body → {LINK}
Images: Gray's Anatomy (1918), Fig. 422, public domain; diagrams: Book Plume

"""+TAGS
SOC=BODY.replace("{LINK}","bookplume.com")
YT=BODY.replace("{LINK}",utm("youtube","short"))+"\n\nSources: TeachMeAnatomy, The Carpal Tunnel (9 tendons + median nerve; roof = flexor retinaculum, floor = carpal arch); TeachMeAnatomy, The Ulnar Canal (Guyon's canal: ulnar nerve + artery); Radiopaedia, Carpal tunnel (10 structures; FCR and palmaris longus not inside); Gray's Anatomy (1918), Fig. 422.\nEducational content for anatomy study, not medical advice."
TT_TITLE="Carpal tunnel contents in 4 numbers: 4-4-1-1 🧠 #carpaltunnel #anatomymnemonics"
YT_TITLE="Carpal Tunnel Contents Mnemonic: 4-4-1-1 | Wrist Anatomy Study Tip #shorts"
PIN_V="Carpal Tunnel Contents Mnemonic: 4-4-1-1 | Wrist Anatomy Study Tips"
PIN_I="Carpal Tunnel Contents Cheat Sheet: FDS, FDP, FPL Tendons + Median Nerve"
PIN_VD="Carpal tunnel contents in 4 numbers, 4-4-1-1: 4 flexor digitorum superficialis tendons, 4 flexor digitorum profundus tendons, flexor pollicis longus, median nerve. Roof: flexor retinaculum; floor: carpal bones. Exam trap: the ulnar nerve runs outside, in Guyon's canal. Wrist anatomy study tips for nursing school and A&P. Images: Gray's Anatomy (1918), public domain. #anatomy #nursingschool #studytips"
PIN_ID="Cheat sheet: carpal tunnel = 10 structures, 4-4-1-1. FDS x4 (on top), FDP x4 (underneath), flexor pollicis longus, median nerve. Roof flexor retinaculum, floor carpal bones. NOT inside: ulnar nerve (Guyon's canal). Save for your next anatomy exam. #anatomy #medstudent"
CAR="""Carpal tunnel cheat sheet 🧠 What passes through it? 10 structures, 4-4-1-1:

4 flexor digitorum superficialis tendons (on top)
4 flexor digitorum profundus tendons (underneath)
1 flexor pollicis longus (thumb)
1 median nerve (the only nerve inside)

Roof: flexor retinaculum. Floor: carpal bones.
NOT inside: ulnar nerve + artery (Guyon's canal), flexor carpi radialis, palmaris longus.

Save this for your next anatomy exam 📌
Study with: Anatomy Flash Cards → bookplume.com
Images: Gray's Anatomy (1918), Fig. 422, public domain; diagrams: Book Plume

#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #bookplume #carpaltunnel #handanatomy"""
YT_TAGS=["carpal tunnel","carpal tunnel contents","carpal tunnel anatomy","carpal tunnel mnemonic","flexor retinaculum","median nerve","guyon's canal","wrist anatomy","anatomy mnemonics","nursing school"]
for n,v,l in [("TT",TT_TITLE,90),("YT",YT_TITLE,95),("PV",PIN_V,90),("PI",PIN_I,90),("PVD",PIN_VD,480),("PID",PIN_ID,480),("CAR",CAR,2200),("SOC",SOC,2200)]:
    assert len(v)<=l,(n,len(v)); print(n,len(v))
for link in [utm("youtube","short"),utm("pinterest","short"),utm("pinterest","pin")]:
    assert "utm_source=" in link and "utm_campaign=" in link
assert "utm_source=" in YT and "utm_campaign=" in YT
