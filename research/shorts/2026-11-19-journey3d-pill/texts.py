import json
CREDIT="3D: Digestive System by Focus Medica (Sketchfab, CC BY 4.0)"
cap=("What happens to a pill after you swallow it? 💊\n"
"Follow one tablet in 3D: stomach → small intestine → liver → bloodstream → kidneys → ureters.\n"
"• Stomach: acid at pH 1.5–3.5, most tablets start to break apart and dissolve\n"
"• Small intestine: where most drugs are absorbed\n"
"• Liver: the gut wall and liver break down part of the drug first = the first-pass effect\n"
"• Bloodstream: what's left travels via the heart to the whole body\n"
"• Kidneys: filter about 150 quarts of blood a day with about 1 million filters (nephrons) each\n"
"• Ureters: most drugs and their metabolites leave in urine\n"
"Save this for your next pharmacology exam.\n"
f"{CREDIT}\n"
"Sources: Merck Manual (Drug Administration, Drug Elimination); OpenStax Anatomy & Physiology 2e (20.5, 23.4); NIDDK — Your Kidneys & How They Work; StatPearls — First-Pass Effect.\n"
"#anatomy #humanbody #anatomyquiz #nursingschool #medstudent #pharmacology #physiology")
yt_title="What Happens to a Pill You Swallow? Stomach to Kidneys in 3D #shorts"
yt_tags=["what happens to a pill you swallow","what happens when you swallow a tablet","first pass effect","drug absorption","pharmacokinetics","pharmacology for nursing","liver","kidneys","human body 3d animation","nursing school"]
tt_text="What happens to a pill after you swallow it? 💊 6 stops in 3D, from your stomach to your kidneys. #anatomy #pharmacology #nursingschool #medstudent #humanbody"
tt_title="What happens to a pill after you swallow it?"
pin_title_v="What Happens to a Pill You Swallow? First-Pass Effect in 3D | Pharmacology"
pin_title_s="Where Does a Pill Go? 6 Stops From Stomach to Kidneys | Nursing Pharmacology"
pin_desc=("What happens to a pill you swallow? Stomach (acid pH 1.5–3.5) → small intestine (most drugs absorbed) → liver (first-pass effect: gut wall and liver break down part of the drug) → bloodstream → kidneys (filter about 150 quarts of blood a day) → urine. Pharmacology and physiology for nursing and med students. "+CREDIT+".")
base="https://bookplume.com/collections/nursing-school-essentials-nclex-prep?utm_source=pinterest&utm_medium=social&utm_campaign=what-happens-to-a-pill&utm_content="
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
