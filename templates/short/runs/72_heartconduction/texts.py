import json
SLUG="heart-conduction-system"
COLL="https://bookplume.com/collections/anatomy-medical-flash-cards"
def utm(src,content): return f"{COLL}?utm_source={src}&utm_medium=social&utm_campaign={SLUG}&utm_content={content}"
TAGS="#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #bookplume #heartanatomy #cardiacconduction"
BODY="""Your heart doesn't need your brain to beat ❤️ The heart conduction system starts every beat by itself.

What you'll learn:
• SA node (sinoatrial) = the natural pacemaker, in the wall of the right atrium
• The path: SA node → AV node → bundle of His (AV bundle) → right + left bundle branches → Purkinje fibers
• Nerves and hormones only tune the rate (faster / slower)
• Trick: SPARK (SA) → PAUSE (AV) → SPREAD (His, branches, Purkinje)

Quick test in the video: where does the signal pause so the atria finish emptying first? (The AV node, about 0.1 s.)

Save this for your next anatomy exam."""
CREDIT="Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume"
SOCIAL=BODY+"\nStudy with: Anatomy Flash Cards – Visual Learning Set of the Human Body → bookplume.com\n"+CREDIT+"\n\n"+TAGS
YT=BODY+"\nStudy with: Anatomy Flash Cards – Visual Learning Set of the Human Body → "+utm("youtube","short")+"\n"+CREDIT+"\n\n"+TAGS+"\n\nSources: OpenStax Anatomy & Physiology 2e, 19.2 Cardiac Muscle and Electrical Activity (SA node location, conduction pathway, ~100 ms AV node delay, autorhythmicity); Gray's Anatomy (1918), Figs. 501 and 493.\nEducational content for anatomy study, not medical advice."
TT_TITLE="Your heart doesn't need your brain to beat: the conduction system ❤️ #heartanatomy"
YT_TITLE="Your Heart Doesn't Need Your Brain: Heart Conduction System (SA Node) #shorts"
PIN_V_TITLE="Heart Conduction System: SA Node, AV Node, Bundle of His, Purkinje Fibers"
PIN_I_TITLE="Cardiac Conduction Cheat Sheet: SA Node to Purkinje Fibers | Heart Anatomy"
PIN_V_DESC="Your heart starts every beat by itself. Conduction system: SA node (natural pacemaker, right atrium) → AV node (about 0.1 s pause) → bundle of His → right and left bundle branches → Purkinje fibers. Nerves and hormones tune the rate. Anatomy study tips for nursing and A&P. Images: Gray's Anatomy (1918), public domain. #anatomy #nursingschool #studytips"
PIN_I_DESC="Cheat sheet: SA node = natural pacemaker; AV node = ~0.1 s pause so the atria empty first; bundle of His; right + left bundle branches; Purkinje fibers → ventricles. Trick: spark → pause → spread. Save for your next anatomy exam. Plates: Gray's 1918 (public domain). #anatomy #medstudent"
YT_TAGS=["heart conduction system","cardiac conduction system","sa node","av node","bundle of his","purkinje fibers","heart anatomy","anatomy facts","nursing school","anatomy and physiology"]
L=dict(tt=len(TT_TITLE),yt=len(YT_TITLE),pv=len(PIN_V_TITLE),pi=len(PIN_I_TITLE),pvd=len(PIN_V_DESC),pid=len(PIN_I_DESC),social=len(SOCIAL),ytd=len(YT))
assert L['tt']<=90 and L['yt']<=95 and L['pv']<=90 and L['pi']<=90 and L['pvd']<=480 and L['pid']<=480, L
print(L)
json.dump(dict(SOCIAL=SOCIAL,YT=YT,TT_TITLE=TT_TITLE,YT_TITLE=YT_TITLE,PIN_V_TITLE=PIN_V_TITLE,PIN_I_TITLE=PIN_I_TITLE,PIN_V_DESC=PIN_V_DESC,PIN_I_DESC=PIN_I_DESC,YT_TAGS=YT_TAGS,PIN_V_LINK=utm("pinterest","short"),PIN_I_LINK=utm("pinterest","pin")),open('texts.json','w'),ensure_ascii=False,indent=1)
