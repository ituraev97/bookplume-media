import json
CREDIT="3D: Digestive System by Focus Medica (Sketchfab, CC BY 4.0)"
cap=("Where does alcohol go after you drink it? 🧪\n"
"Follow it in 3D: stomach → small intestine → liver → bloodstream → liver again → what leaves unchanged.\n"
"• Absorbed slowly in the stomach, faster in the small intestine (large surface area)\n"
"• Blood from the gut reaches the liver first, through the hepatic portal vein\n"
"• It spreads through the water in your body, including your brain; on an empty stomach blood alcohol typically peaks in about an hour\n"
"• In the liver, ADH turns it into acetaldehyde, then ALDH turns that into acetate; more than 90% of the alcohol is broken down there\n"
"• A small amount (about 2–5%) leaves unchanged in breath, urine and sweat\n"
"Save this for your next physiology exam.\n"
f"{CREDIT}\n"
"Sources: BMJ — Alcohol in the body (Paton, 2005); Duke APEP — How is alcohol eliminated from the body; Physiological Reviews — Recent advances in alcohol metabolism.\n"
"#anatomy #humanbody #anatomyquiz #nursingschool #medstudent #physiology #liver")
yt_title="Where Does Alcohol Go in Your Body? Stomach to Liver in 3D #shorts"
yt_tags=["what happens to alcohol in your body","alcohol metabolism","alcohol dehydrogenase","ADH ALDH","acetaldehyde","hepatic portal vein","liver anatomy","physiology","human body 3d animation","nursing school"]
tt_text="Where does alcohol go after you drink it? 🧪 Follow it in 3D from the stomach to the liver. #anatomy #physiology #nursingschool #medstudent #humanbody"
tt_title="Where does alcohol go after you drink it?"
pin_title_v="What Happens to Alcohol in Your Body? Liver Metabolism in 3D"
pin_desc=("Where does alcohol go after you drink it? It is absorbed slowly in the stomach and faster in the small intestine, blood from the gut reaches the liver first through the hepatic portal vein, the liver enzymes ADH and ALDH turn it into acetaldehyde and then acetate (more than 90% of the alcohol is broken down there), and about 2-5% leaves unchanged in breath, urine and sweat. "+CREDIT+".")
pl_v="https://bookplume.com/collections/anatomy-medical-flash-cards?utm_source=pinterest&utm_medium=social&utm_campaign=where-does-alcohol-go&utm_content=video"
tt_body=tt_text.split(" #")[0]
assert len(yt_title)<=95 and yt_title.endswith(" #shorts"), len(yt_title)
assert len(tt_title)<=90 and len(tt_body)<=150, (len(tt_title),len(tt_body))
assert len(pin_title_v)<=90, len(pin_title_v)
assert len(pin_desc)<=480, len(pin_desc)
assert "utm_source=" in pl_v and "utm_campaign=" in pl_v
for t in (cap,tt_text,pin_desc,yt_title,pin_title_v): assert "bookplume" not in t.lower() and "study with" not in t.lower() and "flashcard" not in t.lower()
json.dump(dict(cap=cap,yt_title=yt_title,yt_tags=yt_tags,tt_text=tt_text,tt_title=tt_title,pin_title_v=pin_title_v,pin_desc=pin_desc,pl_v=pl_v),open('texts.json','w'),ensure_ascii=False,indent=1)
print("ok",len(yt_title),len(tt_title),len(tt_body),len(pin_title_v),len(pin_desc))
