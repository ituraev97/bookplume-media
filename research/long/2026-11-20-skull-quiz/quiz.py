# Skull anatomy quiz — 27 questions, 4 levels (2026-11-20)
TITLE = "Skull Anatomy Quiz: Can You Score 27/27?"
SERIES = "Anatomy Quiz"
COUNT = 5
RULES = ["5 seconds each", "Keep score", "It gets harder"]

SIDE = {"src": "plates/side.png", "aspect": 1991 / 1845}
FRONT = {"src": "plates/front.png", "aspect": 1933 / 2069}
SAG = {"src": "plates/sagittal.png", "aspect": 2173 / 1443}
BASE = {"src": "plates/base.png", "aspect": 1762 / 2748}
INF = {"src": "plates/infratemporal.png", "aspect": 1590 / 1560}

# ---- printed label boxes [x, y, w, h] (fractions of each plate) ----
side = dict(  # Fig. 188
    FR=[[0.22, 0.178, 0.10, 0.035]], COR=[[0.365, 0.17, 0.06, 0.08], [0.415, 0.095, 0.065, 0.09]],
    PAR=[[0.61, 0.218, 0.11, 0.036]], SQS=[[0.48, 0.313, 0.12, 0.047], [0.595, 0.335, 0.09, 0.042]],
    SPH=[[0.30, 0.403, 0.11, 0.032]], NAS=[[0.065, 0.395, 0.055, 0.05]], LAC=[[0.16, 0.43, 0.09, 0.03]],
    TEM=[[0.50, 0.472, 0.10, 0.032]], LAM=[[0.825, 0.475, 0.08, 0.09], [0.88, 0.385, 0.08, 0.10]],
    ZYG=[[0.20, 0.55, 0.12, 0.035]], OCC=[[0.83, 0.603, 0.11, 0.032]], MAX=[[0.095, 0.645, 0.09, 0.03]],
    MAN=[[0.295, 0.832, 0.10, 0.032]],
)
front = dict(  # Fig. 190
    FR=[[0.315, 0.245, 0.11, 0.03]], COR=[[0.10, 0.075, 0.10, 0.095]], SUT=[[0.565, 0.085, 0.09, 0.085]],
    PAR=[[0.03, 0.18, 0.06, 0.11]], SPHL=[[0.065, 0.355, 0.065, 0.08]], TEML=[[0.035, 0.37, 0.045, 0.10]],
    SPHO=[[0.185, 0.48, 0.09, 0.024]], NAS=[[0.35, 0.5, 0.065, 0.03]], ZYG=[[0.545, 0.558, 0.105, 0.034]],
    MAX=[[0.32, 0.71, 0.105, 0.026]], MAN=[[0.31, 0.913, 0.135, 0.028]],
    SOF=[[0.752, 0.381, 0.22, 0.027]], SUPF=[[0.752, 0.455, 0.235, 0.024]], LAMP=[[0.752, 0.477, 0.248, 0.024]],
    LACR=[[0.752, 0.499, 0.1, 0.023]], IOFI=[[0.752, 0.522, 0.22, 0.023]], ZFF=[[0.752, 0.547, 0.248, 0.023]],
    IOF=[[0.752, 0.584, 0.21, 0.024]], NC=[[0.752, 0.609, 0.11, 0.023]], INC=[[0.752, 0.633, 0.215, 0.025]],
    MEN=[[0.66, 0.891, 0.165, 0.026]],
)
sag = dict(  # Fig. 194
    VOM=[[0.333, 0.783, 0.068, 0.03]], ETH=[[0.276, 0.662, 0.088, 0.033]], SPH=[[0.445, 0.665, 0.10, 0.09]],
    TEM=[[0.555, 0.604, 0.12, 0.038]], NASB=[[0.06, 0.551, 0.108, 0.036]], FPM=[[0.012, 0.706, 0.15, 0.07]],
    INC=[[0.0, 0.77, 0.162, 0.035]], MAX=[[0.25, 0.906, 0.098, 0.033]], PH=[[0.466, 0.928, 0.185, 0.04]],
    FR=[[0.28, 0.12, 0.095, 0.14]], PAR=[[0.735, 0.035, 0.12, 0.105]], OCC=[[0.885, 0.74, 0.095, 0.16]],
)
inf = dict(  # Fig. 189
    EAM=[[0.668, 0.712, 0.3, 0.034]], TYM=[[0.625, 0.76, 0.33, 0.034]], STY=[[0.596, 0.802, 0.185, 0.034]],
    MC=[[0.563, 0.845, 0.225, 0.034]], ZP=[[0.505, 0.882, 0.285, 0.034]], LPP=[[0.453, 0.922, 0.28, 0.034]],
    SQ=[[0.515, 0.155, 0.22, 0.075]],
)
base = dict(  # Fig. 193: one box per printed name in the left column + names inside the drawing that would give answers away
    GSS=[[0.015, 0.051, 0.33, 0.017]], GAM=[[0.0, 0.07, 0.345, 0.016]], FC=[[0.165, 0.088, 0.18, 0.017]], CG=[[0.23, 0.106, 0.115, 0.015]],
    SNN=[[0.105, 0.123, 0.24, 0.014]], GNN=[[0.08, 0.136, 0.265, 0.012]], AEF=[[0.075, 0.148, 0.27, 0.012]],
    OLF=[[0.05, 0.165, 0.295, 0.02]], PE=[[0.04, 0.19, 0.305, 0.019]], ES=[[0.16, 0.221, 0.18, 0.018]], OG=[[0.155, 0.276, 0.185, 0.019]],
    OPT=[[0.18, 0.316, 0.16, 0.018]], CHG=[[0.14, 0.333, 0.2, 0.017]], TS=[[0.15, 0.35, 0.19, 0.017]], ACP=[[0.08, 0.366, 0.26, 0.017]],
    MCP=[[0.095, 0.383, 0.245, 0.016]], PC=[[0.07, 0.413, 0.265, 0.018]], GAN=[[0.055, 0.447, 0.285, 0.017]], FL=[[0.14, 0.465, 0.195, 0.017]],
    OCA=[[0.085, 0.482, 0.25, 0.017]], DSG=[[0.0, 0.498, 0.33, 0.017]], IAM=[[0.09, 0.545, 0.245, 0.014]], SDM=[[0.14, 0.559, 0.19, 0.013]],
    GSP=[[0.01, 0.572, 0.32, 0.014]], JF=[[0.16, 0.586, 0.17, 0.014]], HC=[[0.155, 0.599, 0.18, 0.014]], AV=[[0.125, 0.612, 0.21, 0.015]],
    CF=[[0.145, 0.628, 0.185, 0.015]], MF=[[0.145, 0.675, 0.18, 0.018]], PM=[[0.03, 0.701, 0.3, 0.018]],
    FM=[[0.355, 0.638, 0.18, 0.052]], HYP=[[0.398, 0.39, 0.028, 0.07]],
)


def H(d, target=None, skip=()):
    """all label boxes of a plate; the target's boxes open at the reveal"""
    hide, op = [], []
    for k, boxes in d.items():
        if k in skip:
            continue
        for b in boxes:
            if k == target:
                op.append(len(hide))
            hide.append(b)
    return hide, op


def q(level, plate, d, target, zoom, pin, question, options, a, label, ask, say, old=None, skip=()):
    hide, op = H(d, target, skip)
    x = dict(level=level, plate=plate, zoom=zoom, pin=pin, hide=hide, open=op, q=question, options=options, a=a, label=label, ask=ask, say=say)
    if old:
        x["old"] = old
    return x


NB = "Name this bone."
INTRO = [
    "Can you score twenty seven out of twenty seven on this skull quiz?",
    "You get five seconds for each one. Keep score, and be honest.",
    "We start with the big bones. By level four, we're asking what passes through the holes.",
]
LEVELS = [
    ("Warm-up", "Level one. The warm-up. Quick fact first: the skull has twenty two bones. Eight in the cranium, fourteen in the face."),
    ("Sutures", "Level two. Sutures and small bones."),
    ("Hard", "Level three. Inside the skull, plus the holes on its surface."),
    ("Expert", "Level four. Expert. What passes through these openings?"),
]
Q = [
    # ---- level 1: side view + front view ----
    q(0, SIDE, side, "FR", (1.3, 0.3, 0.3), (0.28, 0.28), NB, ["Parietal", "Frontal", "Temporal", "Sphenoid"], 1, "Frontal bone",
      "Number one. Name this bone.", ["It's the frontal bone.", "It forms your forehead and the roof of each eye socket.", "At birth it's still two halves, joined by the metopic suture."]),
    q(0, SIDE, side, "PAR", (1.3, 0.62, 0.3), (0.7, 0.3), NB, ["Occipital", "Temporal", "Parietal", "Frontal"], 2, "Parietal bone",
      "Number two. Name this bone.", ["It's the parietal bone.", "You have two of them, and they meet at the top of your head, along the sagittal suture."]),
    q(0, SIDE, side, "TEM", (1.3, 0.6, 0.48), (0.66, 0.44), NB, ["Temporal", "Sphenoid", "Parietal", "Zygomatic"], 0, "Temporal bone",
      "Number three. Name this bone.", ["It's the temporal bone.", "It sits at your temple and holds the middle and inner ear.", "Its petrous part is one of the densest bones in the body."]),
    q(0, SIDE, side, "OCC", (1.3, 0.8, 0.6), (0.87, 0.67), NB, ["Parietal", "Temporal", "Sphenoid", "Occipital"], 3, "Occipital bone",
      "Number four. Name this bone.", ["It's the occipital bone.", "It's the back of the skull, and the spinal cord passes through its big opening.", "Its two condyles sit on the atlas, the first vertebra. That joint lets you nod."]),
    q(0, FRONT, front, "MAN", (1.3, 0.38, 0.82), (0.25, 0.85), NB, ["Maxilla", "Mandible", "Zygomatic", "Hyoid"], 1, "Mandible",
      "Number five. Name this bone.", ["It's the mandible, the lower jaw.", "It's the only skull bone that moves.", "It meets the temporal bone at the jaw joint, the T M J."]),
    q(0, FRONT, front, "MAX", (1.3, 0.38, 0.66), (0.27, 0.66), NB, ["Mandible", "Nasal", "Maxilla", "Palatine"], 2, "Maxilla",
      "Number six. Name this bone.", ["It's the maxilla, the upper jaw.", "It holds the upper teeth and forms most of the hard palate.", "Each maxilla also holds the biggest paranasal sinus, the maxillary sinus."]),
    q(0, FRONT, front, "ZYG", (1.4, 0.3, 0.55), (0.13, 0.57), NB, ["Zygomatic", "Temporal", "Maxilla", "Lacrimal"], 0, "Zygomatic bone",
      "Number seven. Name this bone.", ["It's the zygomatic bone, your cheekbone.", "It joins the temporal bone to make the zygomatic arch."]),
    q(0, FRONT, front, "NAS", (1.6, 0.4, 0.5), (0.375, 0.465), "Name this small bone.", ["Lacrimal", "Vomer", "Nasal", "Ethmoid"], 2, "Nasal bone",
      "Number eight. Name this small bone.", ["It's the nasal bone.", "The two nasal bones form the bridge of the nose. The rest of the nose is cartilage."]),
    # ---- level 2: sutures + small bones ----
    q(1, SIDE, side, "COR", (1.4, 0.4, 0.28), (0.39, 0.31), "Name this suture.", ["Sagittal", "Lambdoid", "Squamous", "Coronal"], 3, "Coronal suture",
      "Number nine. Name this suture.", ["It's the coronal suture.", "It joins the frontal bone to the two parietal bones, across the top of the head like a headband."]),
    q(1, SIDE, side, "SQS", (1.4, 0.58, 0.38), (0.57, 0.338), "Name this suture.", ["Squamous", "Coronal", "Lambdoid", "Sagittal"], 0, "Squamous suture",
      "Number ten. Name this suture.", ["It's the squamous suture.", "It joins the temporal bone to the parietal bone. This atlas calls it squamosal."], old="squamosal suture"),
    q(1, SIDE, side, "LAM", (1.4, 0.8, 0.5), (0.815, 0.575), "Name this suture.", ["Coronal", "Lambdoid", "Sagittal", "Squamous"], 1, "Lambdoid suture",
      "Number eleven. Name this suture.", ["It's the lambdoid suture.", "It joins the occipital bone to the parietal bones, and it's shaped like the Greek letter lambda."], old="lambdoidal suture"),
    q(1, SIDE, side, "SPH", (1.5, 0.38, 0.42), (0.42, 0.38), NB, ["Ethmoid", "Temporal", "Sphenoid", "Zygomatic"], 2, "Sphenoid",
      "Number twelve. Name this bone.", ["It's the sphenoid. You're looking at its greater wing.", "It's shaped like a bat, and it touches every other cranial bone."]),
    q(1, SIDE, side, "LAC", (1.8, 0.2, 0.45), (0.175, 0.48), "Name this small bone in the eye socket.", ["Nasal", "Lacrimal", "Palatine", "Vomer"], 1, "Lacrimal bone",
      "Number thirteen. Name this small bone in the eye socket.", ["It's the lacrimal bone, the smallest bone of the face.", "Its groove holds the tear sac, which is why it's named after tears."]),
    q(1, SIDE, side, None, (1.5, 0.46, 0.36), (0.465, 0.355), "Where these four bones meet is called the…", ["Bregma", "Lambda", "Asterion", "Pterion"], 3, "Pterion",
      "Number fourteen. Frontal, parietal, temporal and sphenoid all meet right here. What's this spot called?",
      ["It's the pterion.", "It's the thinnest part of the side of the skull, and the middle meningeal artery runs just underneath it. A classic exam point."]),
    q(1, FRONT, front, "INC", (1.8, 0.57, 0.62), (0.425, 0.635), NB, ["Vomer", "Ethmoid", "Inferior nasal concha", "Palatine"], 2, "Inferior nasal concha",
      "Number fifteen. Name this bone inside the nose.",
      ["It's the inferior nasal concha.", "It's a separate bone, and the largest of the three conchae.", "The superior and middle conchae are parts of the ethmoid."]),
    # ---- level 3: inside the skull + holes on the surface ----
    q(2, SAG, sag, "VOM", (1.6, 0.4, 0.72), (0.39, 0.755), "Name this bone of the nasal septum.", ["Vomer", "Palatine", "Ethmoid", "Nasal"], 0, "Vomer",
      "Number sixteen. Name this bone of the nasal septum.", ["It's the vomer.", "It forms the lower back part of the septum. The name means ploughshare, after its shape.", "In front, cartilage completes the septum."]),
    q(2, SAG, sag, "ETH", (1.6, 0.35, 0.63), (0.33, 0.645), NB, ["Sphenoid", "Ethmoid", "Vomer", "Frontal"], 1, "Ethmoid",
      "Number seventeen. This plate makes the upper part of the nasal septum. Which bone is it part of?",
      ["It's the ethmoid, its perpendicular plate.", "The ethmoid sits between the eye sockets and forms the roof of the nose."]),
    q(2, FRONT, front, "MEN", (1.9, 0.38, 0.88), (0.255, 0.905), "Name this opening.", ["Infraorbital foramen", "Mental foramen", "Supraorbital foramen", "Mandibular foramen"], 1, "Mental foramen",
      "Number eighteen. Name this opening in the mandible.", ["It's the mental foramen.", "The mental nerve comes out here to supply the skin of the chin and lower lip.", "Mental here means chin, not mind."]),
    q(2, FRONT, front, "IOF", (1.9, 0.42, 0.6), (0.525, 0.603), "Name this opening.", ["Supraorbital foramen", "Mental foramen", "Infraorbital foramen", "Optic canal"], 2, "Infraorbital foramen",
      "Number nineteen. Name this opening below the eye.", ["It's the infraorbital foramen.", "The infraorbital nerve, a branch of the maxillary nerve, comes out here."]),
    q(2, INF, inf, "STY", (1.6, 0.62, 0.62), (0.605, 0.64), "Name this pointed process.", ["Mastoid process", "Styloid process", "Coronoid process", "Pterygoid hamulus"], 1, "Styloid process",
      "Number twenty. Name this thin, pointed process.", ["It's the styloid process of the temporal bone.", "Three muscles start here: styloglossus, stylohyoid and stylopharyngeus."]),
    q(2, INF, inf, "EAM", (1.6, 0.52, 0.55), (0.69, 0.45), "Name this opening.", ["Foramen ovale", "Carotid canal", "Jugular foramen", "External acoustic meatus"], 3, "External acoustic meatus",
      "Number twenty one. Name this opening in the temporal bone.", ["It's the external acoustic meatus, the ear canal.", "It leads in to the eardrum.", "Only the inner two thirds of the canal are bone. The outer third is cartilage."]),
    # ---- level 4: foramina of the cranial base ----
    q(3, BASE, base, "FM", (1.5, 0.5, 0.66), (0.45, 0.70), "Name this large opening.", ["Foramen lacerum", "Jugular foramen", "Foramen magnum", "Foramen ovale"], 2, "Foramen magnum",
      "Number twenty two. We're inside the skull now, looking down at its floor. Name this large opening.",
      ["It's the foramen magnum, in the occipital bone.", "The medulla oblongata passes through it and becomes the spinal cord.", "The vertebral arteries pass through it too."]),
    q(3, BASE, base, None, (2.2, 0.514, 0.19), (0.418, 0.19), "Which nerve passes through these tiny holes?", ["Optic nerve", "Olfactory nerve", "Trigeminal nerve", "Vagus nerve"], 1, "Olfactory nerve (CN I)",
      "Number twenty three. This is the cribriform plate of the ethmoid. Which nerve passes through its tiny holes?",
      ["The olfactory nerve, cranial nerve one.", "Its fibres carry smell from the roof of the nose up to the olfactory bulb."]),
    q(3, BASE, base, "HYP", (2.2, 0.528, 0.41), (0.432, 0.42), "What sits in this saddle-shaped pit?", ["Pineal gland", "Optic chiasm", "Pituitary gland", "Pons"], 2, "Pituitary gland",
      "Number twenty four. What sits in this saddle-shaped pit of the sphenoid?",
      ["The pituitary gland.", "This pit is the hypophyseal fossa, the deepest part of the sella turcica, which means Turkish saddle."]),
    q(3, BASE, base, None, (2.2, 0.661, 0.4), (0.565, 0.378), "Which nerve passes through this hole?", ["Mandibular nerve", "Maxillary nerve", "Ophthalmic nerve", "Facial nerve"], 1, "Maxillary nerve (V2)",
      "Number twenty five. This round hole is the foramen rotundum. Which nerve passes through it?",
      ["The maxillary nerve, V two.", "Remember Standing Room Only. Superior orbital fissure, rotundum, ovale. V one, V two, V three."]),
    q(3, BASE, base, None, (2.2, 0.716, 0.44), (0.62, 0.442), "Which nerve passes through this hole?", ["Mandibular nerve", "Maxillary nerve", "Facial nerve", "Vagus nerve"], 0, "Mandibular nerve (V3)",
      "Number twenty six. And this oval hole, the foramen ovale?",
      ["The mandibular nerve, V three.", "It's the only trigeminal branch with motor fibres, for the chewing muscles."]),
    q(3, BASE, base, None, (2.4, 0.764, 0.46), (0.676, 0.476), "What passes through this small hole?", ["Internal carotid artery", "Vertebral artery", "Middle meningeal artery", "Maxillary nerve"], 2, "Middle meningeal artery",
      "Number twenty seven. Last one. What passes through this small hole, the foramen spinosum?",
      ["The middle meningeal artery.", "It's the same artery that runs under the pterion from question fourteen."]),
]
CTA_AFTER_LEVEL = 1
CTA = ["Quick break.", "If you want to drill every skull bone and foramen, our anatomy flash cards cover them.", "The link is in the description.", "Okay, level three."]
OUTRO = [
    "That's the quiz.",
    "Zero to twelve, keep practising. Thirteen to twenty, solid. Twenty one to twenty six, exam ready. Twenty seven out of twenty seven, you know the skull better than most students.",
    "Tell me your score in the comments, and which one got you.",
]
BANDS = [["0–12", "Keep practising"], ["13–20", "Solid"], ["21–26", "Exam ready"], ["27/27", "Skull master"]]
THUMB = dict(big="NAME THIS BONE?", sub="SKULL ANATOMY QUIZ", q=11, zoom=1.6, hl=2, bg="yellow")
INTRO_IMG = "plates/intro.png"
EXTRA_DICT = """mandible M AE N D AH B AH L
maxilla M AE K S IH L AH
zygomatic Z AY G AH M AE T IH K
sphenoid S F IY N OY D
lacrimal L AE K R AH M AH L
lambdoid L AE M D OY D
lambdoidal L AE M D OY D AH L
squamosal S K W AH M OW S AH L
pterion T IH R IY AA N
concha K AA NG K AH
conchae K AA NG K IY
ethmoid EH TH M OY D
vomer V OW M ER
foramen F AO R EY M AH N
foramina F AO R AE M IH N AH
infraorbital IH N F R AH AO R B IH T AH L
styloid S T AY L OY D
styloglossus S T AY L OW G L AA S AH S
stylohyoid S T AY L OW HH AY OY D
stylopharyngeus S T AY L OW F AH R IH N JH IY AH S
meatus M IY EY T AH S
cribriform K R IH B R AH F AO R M
hypophyseal HH AY P AH F IH Z IY AH L
sella S EH L AH
turcica T ER S IH K AH
rotundum R OW T AH N D AH M
ovale OW V AA L IY
spinosum S P AY N OW S AH M
meningeal M AH N IH N JH IY AH L
trigeminal T R AY JH EH M AH N AH L
medulla M AH D UW L AH
oblongata AA B L AO NG G AA T AH
mandibular M AE N D IH B Y AH L ER
practising P R AE K T IH S IH NG
warm-up W AO R M AH P
"""
EXTRA_DICT += """metopic M AH T AA P IH K
petrous P EH T R AH S
condyles K AA N D AY L Z
ploughshare P L AW SH EH R
"""
