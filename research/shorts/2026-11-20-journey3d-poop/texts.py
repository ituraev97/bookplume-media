import json
CREDIT="3D: Digestive System by Focus Medica (Sketchfab, CC BY 4.0)"
cap=("Why is your poop brown? 💩\n"
"Follow one old red blood cell's pigment in 3D: spleen → liver → gallbladder → duodenum → large intestine (+ kidneys).\n"
"• Red blood cells live up to 120 days; macrophages in the spleen, liver and bone marrow break them down\n"
"• Heme loses its iron → green biliverdin → yellow bilirubin\n"
"• Bilirubin rides albumin in the blood to the liver, which puts it into bile (about 0.5–1 L a day)\n"
"• The gallbladder stores and concentrates bile; when you eat, bile flows into the duodenum and helps break up fats\n"
"• In the large intestine, bacteria turn bilirubin into urobilinogen, then stercobilin = the brown in stool\n"
"• Urobilins, cleared by the kidneys, give urine its yellow color\n"
"Save this for your next physiology exam.\n"
f"{CREDIT}\n"
"Sources: OpenStax Anatomy & Physiology 2e (18.3 Erythrocytes; 23.6 Liver, Pancreas and Gallbladder); StatPearls — Physiology, Bile Secretion; Merck Manual — Overview of Biliary Function.\n"
"#anatomy #humanbody #anatomyquiz #nursingschool #medstudent #physiology #digestivesystem")
yt_title="Why Is Poop Brown? Bilirubin's Path From Spleen to Colon in 3D #shorts"
yt_tags=["why is poop brown","bilirubin","bilirubin metabolism","stercobilin","bile","red blood cell breakdown","digestive system","physiology","human body 3d animation","nursing school"]
tt_text="Why is your poop brown? 💩 Follow one pigment in 3D, from your spleen to your colon. #anatomy #physiology #nursingschool #medstudent #humanbody"
tt_title="Why is your poop brown?"
pin_title_v="Why Is Poop Brown? Bilirubin Metabolism in 3D | Physiology for Nursing Students"
pin_title_s="Why Is Poop Brown? 6 Stops From Spleen to Colon | Bilirubin Physiology"
pin_desc=("Why is poop brown? Old red blood cells (up to 120 days) are broken down by macrophages → heme becomes green biliverdin, then yellow bilirubin → the liver puts it into bile → gallbladder stores it → duodenum → in the large intestine bacteria make urobilinogen, then stercobilin, the brown pigment. Urobilins make urine yellow. Physiology for nursing and med students. "+CREDIT+".")
base="https://bookplume.com/collections/anatomy-medical-flash-cards?utm_source=pinterest&utm_medium=social&utm_campaign=why-is-poop-brown&utm_content="
pl_v=base+"video"; pl_s=base+"pin"
tt_body=tt_text.split(" #")[0]
assert len(yt_title)<=95 and yt_title.endswith(" #shorts"), len(yt_title)
assert len(tt_title)<=90 and len(tt_body)<=150, (len(tt_title),len(tt_body))
assert len(pin_title_v)<=90 and len(pin_title_s)<=90, (len(pin_title_v),len(pin_title_s))
assert len(pin_desc)<=480, len(pin_desc)
for u in (pl_v,pl_s): assert "utm_source=" in u and "utm_campaign=" in u
for t in (cap,tt_text,pin_desc,yt_title): assert "bookplume" not in t.lower() and "study with" not in t.lower() and "flashcard" not in t.lower()
json.dump(dict(cap=cap,yt_title=yt_title,yt_tags=yt_tags,tt_text=tt_text,tt_title=tt_title,pin_title_v=pin_title_v,pin_title_s=pin_title_s,pin_desc=pin_desc,pl_v=pl_v,pl_s=pl_s),open('texts.json','w'),ensure_ascii=False,indent=1)
print("ok",len(yt_title),len(tt_title),len(tt_body),len(pin_title_v),len(pin_title_s),len(pin_desc),len(cap))
