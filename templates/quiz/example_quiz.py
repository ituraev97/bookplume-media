# EXAMPLE long quiz (short test version: 8 questions). Real episodes: 25–35 questions, 3–4 levels, 9–14 minutes.
# Build: python3 tools/quiz_build.py quiz.py vid   (see PIPELINE.md, "Long QUIZ")
# Coordinates are FRACTIONS of the plate image (0..1). Find them on a fraction grid drawn over the plate, then check stills.
# pin  = point on the structure;  zoom = (scale, focusX, focusY) — scale 1 = plate width fills the 1040 px frame
# hide = label boxes [x, y, w, h] covered by "?" stickers during the question (ALL printed names that could give away
#        this or another option); open = indexes in hide that flip open at the reveal (the target's own label)
# old  = 1918 name when it differs from the modern label (shown as "1918 atlas name: ...")
TITLE = "Can You Name the Bones of the Hand?"
SERIES = "Anatomy Quiz"
COUNT = 5
RULES = ["5 seconds each", "Keep score", "It gets harder"]
HAND = {"src": "plates/hand.png", "aspect": 2151 / 2919}
# printed label boxes on hand.png
# tight boxes around the NAME words only (bigger boxes hide the bones themselves)
NAV, LUN, TRI, PIS, GRM, LSM, CAP, HAM = [0.423, 0.035, 0.11, 0.027], [0.545, 0.035, 0.08, 0.026], [0.645, 0.068, 0.05, 0.08], [0.687, 0.075, 0.045, 0.07], [0.283, 0.1, 0.052, 0.085], [0.343, 0.12, 0.12, 0.042], [0.483, 0.143, 0.1, 0.027], [0.588, 0.135, 0.08, 0.032]
CARPALS = [NAV, LUN, TRI, PIS, GRM, LSM, CAP, HAM]
ROWS = [[0.86, 0.475, 0.135, 0.06], [0.895, 0.635, 0.1, 0.03], [0.9, 0.745, 0.095, 0.03], [0.795, 0.28, 0.13, 0.025]]
MC = [[0.465, 0.362, 0.065, 0.042], [0.325, 0.35, 0.045, 0.03], [0.6, 0.355, 0.05, 0.035], [0.755, 0.335, 0.045, 0.03]]

INTRO = [
    "Can you name the bones of the hand?",
    "Here's how it works. You get five seconds for each question.",
    "Keep score, and be honest with yourself.",
    "Level one is a warm-up. Level two is where most people slip.",
]
LEVELS = [("Warm-up", "Level one. The warm-up."), ("Carpal bones", "Level two. The carpal bones. This is where it gets tricky.")]
Q = [
    dict(level=0, plate=HAND, zoom=(1.5, 0.47, 0.74), pin=(0.47, 0.775), hide=ROWS, open=[],
         q="What is this bone called?", options=["Proximal phalanx", "Middle phalanx", "Metacarpal", "Distal phalanx"], a=1, label="Middle phalanx",
         ask="Number one. What is this bone called?",
         say=["It's a middle phalanx.", "Each finger has three phalanges. Proximal, middle, and distal."]),
    dict(level=0, plate=HAND, zoom=(1.5, 0.48, 0.32), pin=(0.465, 0.3), hide=ROWS + MC, open=[],
         q="Which type of bone is this?", options=["Carpal bone", "Proximal phalanx", "Metacarpal", "Radius"], a=2, label="Metacarpal",
         ask="Number two. Which type of bone is this?",
         say=["It's a metacarpal.", "There are five of them, and together they make up the palm."]),
    dict(level=0, plate=HAND, zoom=(1.6, 0.16, 0.45), pin=(0.08, 0.55), hide=ROWS, open=[],
         q="This digit has only two phalanges. Which one is it?", options=["Little finger", "Index finger", "Ring finger", "Thumb"], a=3, label="Thumb",
         ask="Number three. This digit has only two phalanges. Which one is it?",
         say=["It's the thumb.", "The thumb has a proximal and a distal phalanx, but no middle one."]),
    dict(level=0, plate=HAND, zoom=(1.5, 0.55, 0.33), pin=(0.6, 0.3), hide=ROWS + MC, open=[],
         q="Counting from the thumb, which metacarpal is this?", options=["Second", "Third", "Fourth", "Fifth"], a=2, label="4th metacarpal",
         ask="Number four. Counting from the thumb, which metacarpal is this?",
         say=["It's the fourth metacarpal.", "We always count from the thumb side, so the thumb's metacarpal is number one."]),
    dict(level=1, plate=HAND, zoom=(1.7, 0.5, 0.11), pin=(0.47, 0.088), hide=CARPALS, open=[0], old="navicular",
         q="Name this carpal bone.", options=["Lunate", "Scaphoid", "Trapezoid", "Pisiform"], a=1, label="Scaphoid",
         ask="Number five. Name this carpal bone.",
         say=["It's the scaphoid.", "This 1918 atlas calls it the navicular.", "It's the carpal bone people break most often, usually by falling on an outstretched hand."]),
    dict(level=1, plate=HAND, zoom=(1.7, 0.5, 0.11), pin=(0.555, 0.085), hide=CARPALS, open=[1],
         q="Name this carpal bone.", options=["Hamate", "Capitate", "Lunate", "Triquetrum"], a=2, label="Lunate",
         ask="Number six. And this one?",
         say=["It's the lunate, named for its half-moon shape.", "It sits in the middle of the first row, right next to the scaphoid."]),
    dict(level=1, plate=HAND, zoom=(1.7, 0.5, 0.12), pin=(0.515, 0.125), hide=CARPALS, open=[6],
         q="Name this carpal bone.", options=["Trapezium", "Capitate", "Hamate", "Scaphoid"], a=1, label="Capitate",
         ask="Number seven. Name this carpal bone.",
         say=["It's the capitate.", "It's the largest carpal bone, and it sits right in the centre of the wrist."]),
    dict(level=1, plate=HAND, zoom=(1.7, 0.52, 0.12), pin=(0.597, 0.124), hide=CARPALS, open=[7],
         q="Name this carpal bone.", options=["Pisiform", "Trapezoid", "Lunate", "Hamate"], a=3, label="Hamate",
         ask="Number eight. Last one. Name this carpal bone.",
         say=["It's the hamate.", "You can recognise it by the hook on its palm side, the hook of the hamate."]),
]
CTA_AFTER_LEVEL = 0
CTA = ["Quick break.", "If you want to drill these bones, our anatomy flash cards cover every one of them.", "The link is in the description.", "Okay, back to the quiz."]
OUTRO = [
    "That's the quiz.",
    "Zero to four, keep practising. Five to seven, solid. Eight out of eight, you know the hand better than most students.",
    "Tell me your score in the comments, and which one got you.",
]
BANDS = [["0–4", "Keep practising"], ["5–7", "Solid"], ["8/8", "Anatomy pro"]]
THUMB = dict(big="NAME THIS BONE?", sub="HAND ANATOMY QUIZ", q=4, zoom=2.2, hl=2)  # 2–3 words; hl = index of the word in the red box
EXTRA_DICT = """scaphoid S K AE F OY D
lunate L UW N EY T
capitate K AE P AH T EY T
hamate HH AE M EY T
navicular N AH V IH K Y AH L ER
half-moon HH AE F M UW N
practising P R AE K T IH S IH NG
thumb's TH AH M Z
warm-up W AO R M AH P
"""  # pocketsphinx pronunciations for words missing from cmudict (check with the snippet in PIPELINE.md)
