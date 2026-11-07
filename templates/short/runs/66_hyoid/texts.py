U="https://bookplume.com/collections/anatomy-medical-flash-cards?utm_source={}&utm_medium=social&utm_campaign=hyoid-bone&utm_content={}"
TEXT = """This bone touches NO other bone 🤯 Meet the hyoid.

The hyoid bone is the only bone in your body that doesn't form a joint with another bone. It sits in the front of your neck at the level of C3, between your jaw (mandible) and your larynx, held up only by muscles and ligaments: suprahyoid muscles above, infrahyoid muscles below, and the stylohyoid ligaments.

Memory trick: "hyoid" means U-shaped, like the Greek letter upsilon.
Parts: 1 body + 2 greater horns + 2 lesser horns (old atlases say "cornu" = horn).

Quick test: what does the hyoid anchor? Answer in the video.

Save this for your next anatomy exam.
Study with: Anatomy Flash Cards – Visual Learning Set of the Human Body → bookplume.com
Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume

#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #bookplume #hyoidbone #headandneck"""
YT_DESC = TEXT.replace("→ bookplume.com", "→ " + U.format("youtube","short")) + """

Sources: TeachMeAnatomy, The Hyoid Bone; Radiopaedia, Hyoid bone; Online Etymology Dictionary, "hyoid"; Gray's Anatomy (1918), Figs. 186, 386 and 1019.
Educational content for anatomy study, not medical advice."""
YT = "The Only Bone That Touches No Other Bone: the Hyoid (Anatomy Fact) #shorts"
TT = "This bone touches NO other bone 🤯 the hyoid bone"
PIN_V = "Hyoid Bone: The Only Bone That Touches No Other Bone | Anatomy Study Tips"
PIN_S = "Hyoid Bone Cheat Sheet: Body, Greater and Lesser Horns, C3 Level | Anatomy Flashcards"
PIN_DESC_V = "The hyoid is the only bone that doesn't form a joint with another bone. U-shaped (Greek upsilon), at C3 between the jaw and the larynx, held only by muscles and ligaments: suprahyoid above, infrahyoid below. Parts: body, 2 greater horns, 2 lesser horns. It anchors the tongue (hyoglossus). Images: Gray's Anatomy (1918), public domain. #anatomy #nursingschool #studytips"
PIN_DESC_S = "Hyoid bone cheat sheet: touches no other bone; U-shaped (upsilon); body + 2 greater + 2 lesser horns; level C3, below the jaw, above the larynx; suprahyoid muscles above, infrahyoid below; anchors the tongue. Save for your next anatomy exam. Plate: Gray's Anatomy (1918), public domain. #anatomy #nursingschool #medstudent"
YT_TAGS = ["hyoid bone","hyoid bone anatomy","only bone not connected to another bone","neck anatomy","head and neck anatomy","suprahyoid muscles","infrahyoid muscles","anatomy facts","nursing school","anatomy flashcards"]
for n,v,l in [("YT",YT,95),("TT",TT,90),("PIN_V",PIN_V,90),("PIN_S",PIN_S,90),("PIN_DESC_V",PIN_DESC_V,480),("PIN_DESC_S",PIN_DESC_S,480)]:
    assert len(v)<=l,(n,len(v)); print(n,len(v))
