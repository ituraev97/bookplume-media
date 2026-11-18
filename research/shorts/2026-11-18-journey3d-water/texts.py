import json
CREDIT="3D: Digestive System by Focus Medica (Sketchfab, CC BY 4.0)"
cap=("Where does the water you drink actually go? 💧\n"
"Follow one sip in 3D: stomach → small intestine → large intestine → blood → kidneys → ureters → bladder.\n"
"• Stomach: very little gets absorbed\n"
"• Small intestine: absorbs about 90% of the water you take in\n"
"• Large intestine: takes most of what's left\n"
"• Kidneys: filter about 150 quarts from your blood every day — only 1–2 quarts become urine\n"
"• Bladder: holds about 1.5–2 cups\n"
"Save this for your next anatomy exam.\n"
f"{CREDIT}\n"
"Sources: OpenStax Anatomy & Physiology 2e (23.4, 23.5); NIDDK — Your Kidneys & How They Work; NIDDK — The Urinary Tract & How It Works.\n"
"#anatomy #humanbody #anatomyquiz #nursingschool #medstudent #physiology #kidneys")
yt_title="Where Does the Water You Drink Go? Stomach to Kidneys in 3D #shorts"
yt_tags=["where does water go in your body","what happens when you drink water","water absorption","small intestine","kidneys","urinary system","digestive system 3d","human body 3d animation","anatomy and physiology","nursing school"]
tt_text="Where does the water you drink actually go? Follow one sip from your stomach to your bladder 💧 #anatomy #humanbody #physiology #nursingschool #medstudent"
tt_title="Where does the water you drink actually go?"
pin_title_v="Where Does the Water You Drink Go? Digestive & Urinary System 3D Anatomy"
pin_title_s="Where Does Water Go in Your Body? 5 Stops From Stomach to Bladder | Anatomy"
pin_desc=("Where does the water you drink go? Stomach (very little absorbed) → small intestine (about 90% of the water) → large intestine (most of the rest) → blood → kidneys (filter about 150 quarts a day, only 1–2 quarts become urine) → ureters → bladder (1.5–2 cups). Anatomy and physiology for nursing and med students. "+CREDIT+".")
base="https://bookplume.com/collections/anatomy-education?utm_source=pinterest&utm_medium=social&utm_campaign=where-does-water-go&utm_content="
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
