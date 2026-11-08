B="https://raw.githubusercontent.com/ituraev97/bookplume-media/media-20261109-abdominal-regions/v/"
COL="https://bookplume.com/collections/anatomy-medical-flash-cards"
utm=lambda src,c: f"{COL}?utm_source={src}&utm_medium=social&utm_campaign=abdominal-regions&utm_content={c}"
TAGS="#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #bookplume #abdominalregions #anatomymnemonics"
BODY="""Can you name all 9 abdominal regions? 🧠 One tic-tac-toe grid does it.

Draw the grid (R = the patient's right):
• Top: right hypochondriac · epigastric · left hypochondriac
• Middle: right lumbar · umbilical · left lumbar
• Bottom: right iliac · hypogastric · left iliac
Trick: every row reads the same both ways → H-E-H · L-U-L · I-H-I

Quick test in the video: most of your liver sits in which region? (Right hypochondriac. Hypo = below, chondro = cartilage: under the right rib cartilages.)

Save this for your next anatomy exam.
Study with: Anatomy Flash Cards – Visual Learning Set of the Human Body → {LINK}
Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume

"""+TAGS
SOC=BODY.replace("{LINK}","bookplume.com")
YT=BODY.replace("{LINK}",utm("youtube","short"))+"\n\nSources: OpenStax Anatomy & Physiology 2e, 1.6 Anatomical Terminology (Fig. 1.16 Regions and Quadrants of the Peritoneal Cavity); Radiopaedia, Abdominal surface anatomy; Gray's Anatomy (1918), Fig. 1223.\nEducational content for anatomy study, not medical advice."
TT_TITLE="Name all 9 abdominal regions? The tic-tac-toe trick 🧠 #abdominalregions"
YT_TITLE="9 Abdominal Regions in 1 Trick: Tic-Tac-Toe Mnemonic | Anatomy #shorts"
PIN_V="9 Abdominal Regions Mnemonic: the Tic-Tac-Toe Trick | Anatomy Study Tips"
PIN_I="9 Abdominal Regions Cheat Sheet: Hypochondriac, Epigastric, Lumbar, Iliac"
PIN_VD="Name all 9 abdominal regions with one tic-tac-toe grid: hypochondriac, epigastric, hypochondriac / lumbar, umbilical, lumbar / iliac, hypogastric, iliac. Every row reads the same both ways (H-E-H, L-U-L, I-H-I). Liver = mostly right hypochondriac. Anatomy study tips for nursing school and A&P. Images: Gray's Anatomy (1918), public domain. #anatomy #nursingschool #studytips"
PIN_ID="Cheat sheet: 9 abdominal regions. Top: R hypochondriac, epigastric, L hypochondriac. Middle: R lumbar, umbilical, L lumbar. Bottom: R iliac, hypogastric, L iliac. Hypo = below, chondro = cartilage. R = patient's right. Save for your next anatomy exam. Plate: Gray's 1918 (public domain). #anatomy #medstudent"
for n,v,l in [("TT",TT_TITLE,90),("YT",YT_TITLE,95),("PV",PIN_V,90),("PI",PIN_I,90),("PVD",PIN_VD,480),("PID",PIN_ID,480)]:
    assert len(v)<=l,(n,len(v)); print(n,len(v))
