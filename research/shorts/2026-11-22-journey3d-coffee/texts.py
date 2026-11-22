import json
CREDIT="3D: Digestive System by Focus Medica (Sketchfab, CC BY 4.0)"
cap=("What actually happens to your coffee after you drink it? ☕\n"
"Follow the caffeine in 3D: stomach → small intestine → liver → bloodstream → liver again → kidneys.\n"
"• Caffeine makes your stomach release more acid\n"
"• Your small intestine absorbs most of it; almost all is absorbed within about 45 minutes\n"
"• It reaches the liver first through the hepatic portal vein, and most passes right through\n"
"• Your blood carries it to your heart and up to your brain, where it blocks adenosine receptors (adenosine builds sleep pressure)\n"
"• Blood levels peak anywhere from 15 minutes to 2 hours\n"
"• Over the next hours your liver breaks it down with the enzyme CYP1A2, mostly into paraxanthine; on average half is gone in about 4–5 hours\n"
"• Your kidneys filter the leftovers into urine; only about 2–3% leaves unchanged\n"
"Save this for your next physiology exam.\n"
f"{CREDIT}\n"
"Sources: StatPearls — Caffeine; OpenStax Anatomy & Physiology 2e (23.6); CDC Biochemical Indicators — Caffeine; EFSA — Caffeine explained; Harvard T.H. Chan Nutrition Source — Caffeine.\n"
"#anatomy #humanbody #anatomyquiz #nursingschool #medstudent #physiology #caffeine")
yt_title="What Happens to Your Coffee After You Drink It? Caffeine Path in 3D #shorts"
yt_tags=["what happens to caffeine in your body","caffeine metabolism","caffeine half life","adenosine","CYP1A2","hepatic portal vein","physiology","human body 3d animation","nursing school","coffee and your body"]
tt_text="What actually happens to your coffee after you drink it? ☕ Follow the caffeine in 3D, from your stomach to your brain. #anatomy #physiology #nursingschool #medstudent #humanbody"
tt_title="What happens to your coffee after you drink it?"
pin_title_v="What Happens to Caffeine in Your Body? Coffee Path in 3D"
pin_desc=("What happens to coffee after you drink it? Caffeine makes the stomach release more acid, is absorbed mostly in the small intestine within about 45 minutes, passes the liver via the hepatic portal vein, reaches the brain and blocks adenosine receptors, then the liver breaks it down with CYP1A2 (mostly into paraxanthine) and the kidneys filter the leftovers into urine. "+CREDIT+".")
pl_v="https://bookplume.com/collections/anatomy-medical-flash-cards?utm_source=pinterest&utm_medium=social&utm_campaign=what-happens-to-coffee&utm_content=video"
tt_body=tt_text.split(" #")[0]
assert len(yt_title)<=95 and yt_title.endswith(" #shorts"), len(yt_title)
assert len(tt_title)<=90 and len(tt_body)<=150, (len(tt_title),len(tt_body))
assert len(pin_title_v)<=90, len(pin_title_v)
assert len(pin_desc)<=480, len(pin_desc)
assert "utm_source=" in pl_v and "utm_campaign=" in pl_v
for t in (cap,tt_text,pin_desc,yt_title,pin_title_v): assert "bookplume" not in t.lower() and "study with" not in t.lower() and "flashcard" not in t.lower()
json.dump(dict(cap=cap,yt_title=yt_title,yt_tags=yt_tags,tt_text=tt_text,tt_title=tt_title,pin_title_v=pin_title_v,pin_desc=pin_desc,pl_v=pl_v),open('texts.json','w'),ensure_ascii=False,indent=1)
print("ok",len(yt_title),len(tt_title),len(tt_body),len(pin_title_v),len(pin_desc),len(cap))
