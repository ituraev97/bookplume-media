import json
SLUG="alveoli-70-square-meters"
COLL="https://bookplume.com/collections/anatomy-medical-flash-cards"
def utm(src,content): return f"{COLL}?utm_source={src}&utm_medium=social&utm_campaign={SLUG}&utm_content={content}"
TAGS="#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #bookplume #lunganatomy #respiratorysystem"
BODY="""Your lungs hide a small apartment 🫁 Flatten every alveolus (air sac) and you'd cover about 70 m² (~750 ft²) of gas-exchange surface.

What you'll learn:
• Alveoli: about 480 million tiny air sacs in two lungs
• The airway tree: trachea → main bronchi → lobar → segmental bronchi → bronchioles → alveoli
• Type II alveolar cells make surfactant (keeps alveoli from collapsing)
• Type I alveolar cells = the paper-thin wall where O₂ and CO₂ are swapped

Quick test in the video: which alveolar cell makes surfactant?

Save this for your next anatomy exam."""
CREDIT="Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume"
SOCIAL=BODY+"\nStudy with: Anatomy Flash Cards – Visual Learning Set of the Human Body → bookplume.com\n"+CREDIT+"\n\n"+TAGS
YT=BODY+"\nStudy with: Anatomy Flash Cards – Visual Learning Set of the Human Body → "+utm("youtube","short")+"\n"+CREDIT+"\n\n"+TAGS+"\n\nSources: OpenStax Anatomy & Physiology 2e, 22.1 Organs and Structures of the Respiratory System; Ochs M et al., The Number of Alveoli in the Human Lung, Am J Respir Crit Care Med 2004 (~480 million); StatPearls (NCBI), alveolar type I and II cells; Gray's Anatomy (1918), Figs. 962 and 975.\nEducational content for anatomy study, not medical advice."
TT_TITLE="Your lungs hide an apartment: 70 m² of alveoli 🫁 #lunganatomy"
YT_TITLE="Your Lungs Hide an Apartment: 480 Million Alveoli (Lung Anatomy Fact) #shorts"
PIN_V_TITLE="Alveoli Facts: 480 Million Air Sacs, 70 m² of Lung Surface | Lung Anatomy"
PIN_I_TITLE="Alveoli Cheat Sheet: Airway Tree, Type I vs Type II Cells | Lung Anatomy"
PIN_V_DESC="Your lungs hold about 480 million alveoli with roughly 70 m² of gas-exchange surface. Airway tree: trachea, main bronchi, lobar, segmental bronchi, bronchioles, alveoli. Type II alveolar cells make surfactant; type I cells form the thin wall for gas exchange. Anatomy study tips for nursing and A&P. Images: Gray's Anatomy (1918), public domain. #anatomy #nursingschool #studytips"
PIN_I_DESC="Cheat sheet: about 480 million alveoli, about 70 m² gas-exchange surface. Trachea → main bronchi → lobar → segmental → bronchioles → alveoli. Type II cells = surfactant; type I = thin gas-exchange wall. Save for your next anatomy exam. Plates: Gray's 1918 (public domain). #anatomy #medstudent"
YT_TAGS=["alveoli","lung anatomy","alveoli surface area","how many alveoli","bronchial tree","type 2 pneumocytes surfactant","respiratory system anatomy","anatomy facts","nursing school","anatomy and physiology"]
L=dict(tt=len(TT_TITLE),yt=len(YT_TITLE),pv=len(PIN_V_TITLE),pi=len(PIN_I_TITLE),pvd=len(PIN_V_DESC),pid=len(PIN_I_DESC),social=len(SOCIAL),ytd=len(YT))
assert L['tt']<=90 and L['yt']<=95 and L['pv']<=90 and L['pi']<=90 and L['pvd']<=480 and L['pid']<=480, L
print(L)
json.dump(dict(SOCIAL=SOCIAL,YT=YT,TT_TITLE=TT_TITLE,YT_TITLE=YT_TITLE,PIN_V_TITLE=PIN_V_TITLE,PIN_I_TITLE=PIN_I_TITLE,PIN_V_DESC=PIN_V_DESC,PIN_I_DESC=PIN_I_DESC,YT_TAGS=YT_TAGS,PIN_V_LINK=utm("pinterest","short"),PIN_I_LINK=utm("pinterest","pin")),open('texts.json','w'),ensure_ascii=False,indent=1)
