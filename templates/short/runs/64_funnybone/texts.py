U="https://bookplume.com/collections/anatomy-medical-flash-cards?utm_source={}&utm_medium=social&utm_campaign=funny-bone-ulnar-nerve&utm_content={}"
TEXT = """Your funny bone isn't a bone 🤯 It's your ulnar nerve.

Memory trick: it crosses the humerus, and "humerus" sounds like "humorous."
At the elbow, the ulnar nerve slides behind the medial epicondyle of the humerus, with only skin and a little fat on top. Bump it, and the nerve gets squashed against the bone.
That's why the zing shoots into your little finger and half of your ring finger: the ulnar nerve's skin area (roots C8 and T1, from the medial cord of the brachial plexus).

Quick test: which fingers tingle? Answer in the video.

Save this for your next anatomy exam.
Study with: Anatomy Flash Cards – Visual Learning Set of the Human Body → bookplume.com
Images: Gray's Anatomy (1918), public domain; diagrams: Book Plume

#anatomy #nursingschool #medstudent #studytips #anatomyflashcards #bookplume #ulnarnerve #funnybone"""
YT_DESC = TEXT.replace("→ bookplume.com", "→ " + U.format("youtube","short")) + """

Sources: TeachMeAnatomy, The Ulnar Nerve; McGill Office for Science and Society, "The funny bone is not a bone"; Gray's Anatomy (1918), Figs. 207 and 812.
Educational content for anatomy study, not medical advice."""
YT = "Your Funny Bone Isn't a Bone: It's the Ulnar Nerve (Anatomy Fact) #shorts"
TT = "Your funny bone isn't a bone 🤯 it's the ulnar nerve"
PIN_V = "Why Your Funny Bone Isn't a Bone: Ulnar Nerve Anatomy | Nursing School Study Tips"
PIN_S = "Funny Bone = Ulnar Nerve: Elbow Anatomy Cheat Sheet | Anatomy Flashcards"
PIN_DESC_V = "Your funny bone is the ulnar nerve, not a bone. It runs behind the medial epicondyle of the humerus under only skin and a little fat, so a bump squashes it against the bone and the tingle goes to the little finger and half of the ring finger (roots C8, T1). Images: Gray's Anatomy (1918), public domain. #anatomy #nursingschool #studytips"
PIN_DESC_S = "Ulnar nerve cheat sheet: funny bone = ulnar nerve; behind the medial epicondyle; only skin + a little fat; skin area = little finger + half of ring finger; roots C8 and T1 (medial cord). Save for your next anatomy exam. Plate: Gray's Anatomy (1918), public domain; diagram: Book Plume. #anatomy #nursingschool #medstudent"
YT_TAGS = ["funny bone","ulnar nerve","why does hitting your funny bone hurt","funny bone not a bone","medial epicondyle","elbow anatomy","ulnar nerve anatomy","anatomy facts","nursing school","anatomy flashcards"]
for n,v,l in [("YT",YT,95),("TT",TT,90),("PIN_V",PIN_V,90),("PIN_S",PIN_S,90),("PIN_DESC_V",PIN_DESC_V,480),("PIN_DESC_S",PIN_DESC_S,480)]:
    assert len(v)<=l,(n,len(v)); print(n,len(v))
