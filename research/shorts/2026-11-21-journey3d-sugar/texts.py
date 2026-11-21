import json
CREDIT="3D: Digestive System by Focus Medica (Sketchfab, CC BY 4.0)"
cap=("Where does the sugar you eat go? 🍞\n"
"Follow it in 3D, 5 stops: stomach → small intestine → liver → pancreas → kidneys.\n"
"• Starch digestion starts in your mouth (salivary amylase); the stomach does little carb digestion\n"
"• In the small intestine, pancreatic amylase does the heavy lifting and brush border enzymes leave glucose, fructose and galactose\n"
"• These simple sugars enter the capillaries of the villi and go to the liver first, via the hepatic portal vein\n"
"• The liver stores extra glucose as glycogen\n"
"• As blood glucose rises, pancreatic beta cells (about 75% of each islet) release insulin, which helps muscle and fat cells take glucose in\n"
"• The kidneys filter glucose and reabsorb almost all of it in the proximal tubule, so urine normally has very little or no glucose\n"
"Save this for your next physiology exam.\n"
f"{CREDIT}\n"
"Sources: OpenStax Anatomy & Physiology 2e (17.9 The Endocrine Pancreas; 23.7 Chemical Digestion and Absorption; 24.2 Carbohydrate Metabolism; 25.5 Tubular Reabsorption); StatPearls — Physiology, Digestion; MedlinePlus — Glucose in Urine Test.\n"
"#anatomy #humanbody #anatomyquiz #nursingschool #medstudent #physiology #insulin")
yt_title="Where Does the Sugar You Eat Go? Glucose Path in 3D #shorts"
yt_tags=["where does sugar go in your body","glucose metabolism","carbohydrate digestion","insulin","pancreas beta cells","glycogen","hepatic portal vein","physiology","human body 3d animation","nursing school"]
tt_text="Where does the sugar you eat go? 🍞 5 stops in 3D, from your stomach to your kidneys. #anatomy #physiology #nursingschool #medstudent #humanbody"
tt_title="Where does the sugar you eat go?"
pin_title_v="Where Does Sugar Go in Your Body? Glucose Metabolism in 3D"
pin_desc=("Where does the sugar you eat go? Starch digestion starts in the mouth; in the small intestine pancreatic amylase and brush border enzymes leave glucose, fructose and galactose, which enter the villus capillaries and reach the liver via the hepatic portal vein. The liver stores extra glucose as glycogen, pancreatic beta cells release insulin, and the kidneys reabsorb almost all filtered glucose. "+CREDIT+".")
pl_v="https://bookplume.com/collections/anatomy-medical-flash-cards?utm_source=pinterest&utm_medium=social&utm_campaign=where-does-sugar-go&utm_content=video"
tt_body=tt_text.split(" #")[0]
assert len(yt_title)<=95 and yt_title.endswith(" #shorts"), len(yt_title)
assert len(tt_title)<=90 and len(tt_body)<=150, (len(tt_title),len(tt_body))
assert len(pin_title_v)<=90, len(pin_title_v)
assert len(pin_desc)<=480, len(pin_desc)
assert "utm_source=" in pl_v and "utm_campaign=" in pl_v
for t in (cap,tt_text,pin_desc,yt_title,pin_title_v): assert "bookplume" not in t.lower() and "study with" not in t.lower() and "flashcard" not in t.lower()
json.dump(dict(cap=cap,yt_title=yt_title,yt_tags=yt_tags,tt_text=tt_text,tt_title=tt_title,pin_title_v=pin_title_v,pin_desc=pin_desc,pl_v=pl_v),open('texts.json','w'),ensure_ascii=False,indent=1)
print("ok",len(yt_title),len(tt_title),len(tt_body),len(pin_title_v),len(pin_desc),len(cap))
