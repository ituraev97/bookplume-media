# Leg muscles quiz — 27 questions, 4 levels (2026-11-16)
TITLE = "Can You Name These 27 Leg Muscles?"
SERIES = "Anatomy Quiz"
COUNT = 5
RULES = ["5 seconds each", "Keep score", "It gets harder"]

TF = {"src": "plates/thigh_front.png", "aspect": 819 / 3295}
GB = {"src": "plates/gluteal_back.png", "aspect": 1171 / 3264}
LF = {"src": "plates/leg_front.png", "aspect": 716 / 3218}
CS = {"src": "plates/calf_superficial.png", "aspect": 853 / 2737}
CD = {"src": "plates/calf_deep.png", "aspect": 796 / 2814}

# ---- printed label boxes [x, y, w, h] (fractions of each plate) ----
# thigh_front (Fig. 430)
tf = dict(
    QL=[[0.345, 0.081, 0.215, 0.057]], PMIN=[[0.553, 0.078, 0.092, 0.082]], ILI=[[0.165, 0.232, 0.215, 0.048]],
    PMAJ=[[0.472, 0.252, 0.06, 0.085]], TFL=[[0.065, 0.387, 0.135, 0.083]],
    SAR=[[0.29, 0.437, 0.115, 0.066], [0.38, 0.495, 0.1, 0.046]], PEC=[[0.445, 0.43, 0.185, 0.04]],
    AL=[[0.535, 0.52, 0.18, 0.048]], GR=[[0.733, 0.488, 0.058, 0.082]], RF=[[0.235, 0.596, 0.23, 0.034]],
    AM=[[0.698, 0.603, 0.034, 0.058]], VL=[[0.198, 0.688, 0.135, 0.05], [0.235, 0.722, 0.15, 0.065]],
    VM=[[0.562, 0.732, 0.175, 0.071]], QT=[[0.435, 0.812, 0.18, 0.045]],
)
# gluteal_back (Fig. 434)
gb = dict(
    GMED=[[0.585, 0.034, 0.14, 0.042], [0.765, 0.03, 0.13, 0.028], [0.832, 0.238, 0.12, 0.064]],
    GMIN=[[0.652, 0.116, 0.125, 0.038], [0.782, 0.11, 0.135, 0.028]],
    GMAX=[[0.357, 0.12, 0.05, 0.062], [0.292, 0.188, 0.055, 0.058], [0.792, 0.352, 0.07, 0.09]],
    PIR=[[0.542, 0.174, 0.13, 0.03]], GSUP=[[0.512, 0.21, 0.245, 0.027]], OI=[[0.557, 0.221, 0.28, 0.03]],
    GINF=[[0.527, 0.24, 0.255, 0.03]], OE=[[0.687, 0.26, 0.115, 0.017]], QF=[[0.562, 0.299, 0.25, 0.019]],
    ADD=[[0.652, 0.353, 0.035, 0.074]], MAG=[[0.337, 0.368, 0.035, 0.064]],
    ST=[[0.42, 0.468, 0.042, 0.135]], SM=[[0.332, 0.503, 0.056, 0.14]], BF=[[0.52, 0.53, 0.17, 0.034]],
    LH=[[0.597, 0.566, 0.056, 0.083]], SH=[[0.582, 0.735, 0.095, 0.068]], VLAT=[[0.818, 0.443, 0.075, 0.145]],
    LEGL=[[0.0, 0.758, 0.275, 0.132]], LEGR=[[0.805, 0.768, 0.19, 0.082]],
)
# leg_front (Fig. 437)
lf = dict(
    PL=[[0.0, 0.258, 0.058, 0.12]], TA=[[0.195, 0.312, 0.265, 0.018], [0.195, 0.345, 0.275, 0.018]],
    EDL=[[0.072, 0.333, 0.145, 0.163]], PB=[[0.042, 0.396, 0.105, 0.108]], PT=[[0.197, 0.506, 0.106, 0.106]],
    EHL=[[0.312, 0.511, 0.106, 0.106]],
)
# calf_superficial (Fig. 438)
cs = dict(
    ST=[[0.345, 0.028, 0.048, 0.1]], SM=[[0.377, 0.048, 0.08, 0.122]], BIC=[[0.652, 0.075, 0.07, 0.072]],
    PLA=[[0.487, 0.307, 0.048, 0.036], [0.535, 0.176, 0.07, 0.045]],
    GAS=[[0.365, 0.232, 0.32, 0.019]], HEADS=[[0.36, 0.25, 0.14, 0.03], [0.55, 0.25, 0.14, 0.03]],
    SOL=[[0.405, 0.497, 0.29, 0.021]],
)
# calf_deep (Fig. 439)
cd = dict(
    POP=[[0.327, 0.27, 0.252, 0.017]], SOL=[[0.612, 0.262, 0.075, 0.056], [0.182, 0.445, 0.066, 0.076]],
    ORI=[[0.617, 0.308, 0.085, 0.115], [0.245, 0.308, 0.19, 0.125]],
    TP=[[0.397, 0.423, 0.218, 0.017], [0.377, 0.465, 0.222, 0.017]], PL=[[0.722, 0.36, 0.06, 0.172]],
    FDL=[[0.272, 0.462, 0.05, 0.205]], FHL=[[0.492, 0.545, 0.106, 0.174]], PB=[[0.632, 0.602, 0.106, 0.142]],
)

def H(d, target=None, skip=()):
    """all label boxes of a plate; returns (hide, open) with the target's boxes opening at the reveal"""
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

NM = "Name this muscle."
INTRO = [
    "Can you name these twenty seven leg muscles?",
    "You get five seconds for each one. Keep score, and be honest.",
    "Level one is a warm-up. By level four, we're asking about nerves.",
]
LEVELS = [
    ("Warm-up", "Level one. The warm-up. The big ones."),
    ("Medium", "Level two. Now it gets a little harder."),
    ("Hard", "Level three. The deep muscles. This is where most people slip."),
    ("Expert: Nerves", "Level four. Expert. Now you tell me which nerve supplies each muscle."),
]
Q = [
    # ---------- LEVEL 1 ----------
    q(0, TF, tf, "SAR", (1.0, 0.45, 0.53), (0.48, 0.57), NM, ["Gracilis", "Sartorius", "Rectus femoris", "Adductor longus"], 1, "Sartorius",
      "Number one. Name this long, strap-like muscle.",
      ["It's the sartorius, the longest muscle in the body.", "It runs from the anterior superior iliac spine, across the front of the thigh, to the inside of the tibia."]),
    q(0, TF, tf, "RF", (1.0, 0.35, 0.63), (0.33, 0.655), NM, ["Vastus lateralis", "Rectus femoris", "Sartorius", "Vastus medialis"], 1, "Rectus femoris",
      "Number two. Name this muscle in the middle of the thigh.",
      ["It's the rectus femoris.", "It's the only quadriceps muscle that crosses both the hip and the knee, so it flexes the hip and extends the knee."]),
    q(0, LF, lf, "TA", (1.0, 0.3, 0.3), (0.33, 0.285), NM, ["Fibularis longus", "Extensor digitorum longus", "Tibialis anterior", "Soleus"], 2, "Tibialis anterior",
      "Number three. Name this muscle on the front of the leg.",
      ["It's the tibialis anterior.", "It sits right next to your shin bone. It lifts the foot up and turns the sole inward. That's dorsiflexion and inversion."]),
    q(0, CS, cs, "GAS", (1.0, 0.5, 0.24), (0.42, 0.215), NM, ["Soleus", "Plantaris", "Gastrocnemius", "Popliteus"], 2, "Gastrocnemius",
      "Number four. This muscle has been cut and folded back. What is it?",
      ["It's the gastrocnemius. This is its medial head.", "It has two heads from the femur, and with the soleus it forms the calcaneal tendon, the Achilles."], skip=("HEADS",)),
    q(0, GB, gb, "BF", (1.0, 0.55, 0.53), (0.6, 0.5), NM, ["Semitendinosus", "Biceps femoris", "Semimembranosus", "Gracilis"], 1, "Biceps femoris",
      "Number five. Name this hamstring on the outer side of the back of the thigh.",
      ["It's the biceps femoris.", "It has a long head and a short head, and its tendon inserts on the head of the fibula."], skip=("LH", "SH")),
    q(0, TF, tf, "VL", (1.0, 0.2, 0.68), (0.15, 0.64), NM, ["Vastus lateralis", "Vastus medialis", "Tensor fasciae latae", "Biceps femoris"], 0, "Vastus lateralis",
      "Number six. Name this muscle on the outer side of the thigh.",
      ["It's the vastus lateralis.", "Lateral means outer side. It's one of the four quadriceps, and all four straighten the knee."]),
    # ---------- LEVEL 2 ----------
    q(1, TF, tf, "VM", (1.0, 0.58, 0.78), (0.607, 0.805), NM, ["Vastus lateralis", "Sartorius", "Vastus medialis", "Gracilis"], 2, "Vastus medialis",
      "Number seven. Name this teardrop-shaped muscle above the knee.",
      ["It's the vastus medialis, on the inner side of the knee.", "Like the other vasti, it extends the knee and helps keep the kneecap stable."]),
    q(1, TF, tf, "AL", (1.0, 0.62, 0.58), (0.684, 0.585), NM, ["Pectineus", "Adductor longus", "Gracilis", "Adductor magnus"], 1, "Adductor longus",
      "Number eight. Name this muscle of the inner thigh.",
      ["It's the adductor longus.", "Remember it for the femoral triangle. It forms the medial border."]),
    q(1, TF, tf, "GR", (1.0, 0.7, 0.6), (0.755, 0.64), NM, ["Gracilis", "Sartorius", "Adductor magnus", "Semitendinosus"], 0, "Gracilis",
      "Number nine. Name this thin muscle on the very inside of the thigh.",
      ["It's the gracilis. Gracilis means slender.", "It's the most superficial and most medial muscle of the inner thigh, and it crosses both the hip and the knee."]),
    q(1, CS, cs, "SOL", (1.0, 0.5, 0.45), (0.6, 0.42), NM, ["Gastrocnemius", "Soleus", "Tibialis posterior", "Plantaris"], 1, "Soleus",
      "Number ten. The gastrocnemius is folded back. Name the muscle underneath.",
      ["It's the soleus.", "It lies beneath the gastrocnemius and doesn't cross the knee, so it plantarflexes the ankle with the knee bent or straight."]),
    q(1, GB, gb, "ST", (1.0, 0.44, 0.6), (0.445, 0.625), NM, ["Semimembranosus", "Semitendinosus", "Biceps femoris", "Gracilis"], 1, "Semitendinosus",
      "Number eleven. Name this hamstring on the inner side.",
      ["It's the semitendinosus.", "Here's the trick. Semitendinosus has a long tendon at the bottom, and it lies on top of the semimembranosus."]),
    q(1, GB, gb, "GMED", (1.0, 0.72, 0.08), (0.75, 0.034), NM, ["Gluteus maximus", "Gluteus minimus", "Gluteus medius", "Piriformis"], 2, "Gluteus medius",
      "Number twelve. The gluteus maximus has been removed. Name the muscle at the top.",
      ["It's the gluteus medius.", "It abducts the hip and keeps your pelvis level every time you stand on one leg."]),
    q(1, LF, lf, "PL", (1.0, 0.15, 0.27), (0.035, 0.235), NM, ["Fibularis longus", "Tibialis anterior", "Extensor digitorum longus", "Soleus"], 0, "Fibularis longus", old="peronaeus longus",
      ask="Number thirteen. Name this muscle on the outer side of the leg.",
      say=["It's the fibularis longus. The 1918 atlas calls it peronaeus longus.", "Its tendon runs behind the lateral malleolus and under the foot. It everts the foot."]),
    # ---------- LEVEL 3 ----------
    q(2, TF, tf, "TFL", (1.0, 0.15, 0.4), (0.1, 0.37), NM, ["Sartorius", "Tensor fasciae latae", "Gluteus medius", "Vastus lateralis"], 1, "Tensor fasciae latae",
      "Number fourteen. Name this small muscle at the front of the hip.",
      ["It's the tensor fasciae latae.", "It tightens the fascia lata through the iliotibial tract, and it's supplied by the superior gluteal nerve, like the gluteus medius."]),
    q(2, TF, tf, "PEC", (1.0, 0.5, 0.42), (0.55, 0.425), NM, ["Adductor longus", "Iliacus", "Pectineus", "Psoas major"], 2, "Pectineus",
      "Number fifteen. Name this flat muscle at the top of the inner thigh.",
      ["It's the pectineus.", "It adducts and flexes the hip, and it forms part of the floor of the femoral triangle."]),
    q(2, TF, tf, "ILI", (1.0, 0.35, 0.27), (0.3, 0.29), NM, ["Psoas major", "Iliacus", "Quadratus lumborum", "Pectineus"], 1, "Iliacus",
      "Number sixteen. Name this muscle filling the inside of the hip bone.",
      ["It's the iliacus, from the iliac fossa.", "It joins the psoas major to make the iliopsoas, which flexes the hip and inserts on the lesser trochanter."]),
    q(2, GB, gb, "PIR", (1.0, 0.65, 0.2), (0.72, 0.192), NM, ["Piriformis", "Gemellus superior", "Obturator internus", "Quadratus femoris"], 0, "Piriformis",
      "Number seventeen. Name this deep hip muscle.",
      ["It's the piriformis.", "It's the key landmark of the buttock. The superior gluteal nerve comes out above it, and the sciatic nerve below it."]),
    q(2, GB, gb, "QF", (1.0, 0.65, 0.3), (0.68, 0.325), NM, ["Gemellus inferior", "Obturator externus", "Quadratus femoris", "Piriformis"], 2, "Quadratus femoris",
      "Number eighteen. Name this square muscle.",
      ["It's the quadratus femoris.", "It's the lowest of the deep lateral rotators of the hip, just below the inferior gemellus."]),
    q(2, GB, gb, "SM", (1.0, 0.36, 0.62), (0.35, 0.652), NM, ["Semitendinosus", "Adductor magnus", "Semimembranosus", "Gracilis"], 2, "Semimembranosus",
      "Number nineteen. Name this hamstring.",
      ["It's the semimembranosus.", "It lies deep to the semitendinosus, and it's named for its flat, membrane-like tendon at the top."]),
    q(2, CD, cd, "POP", (1.0, 0.45, 0.27), (0.45, 0.25), NM, ["Plantaris", "Popliteus", "Soleus", "Tibialis posterior"], 1, "Popliteus",
      "Number twenty. Name this small muscle behind the knee.",
      ["It's the popliteus.", "It's the muscle that unlocks the knee. It rotates the femur on the tibia, so the knee can start to bend."]),
    q(2, CD, cd, "TP", (1.0, 0.48, 0.45), (0.47, 0.45), NM, ["Flexor digitorum longus", "Tibialis posterior", "Flexor hallucis longus", "Soleus"], 1, "Tibialis posterior",
      "Number twenty one. Name the deepest muscle at the back of the leg.",
      ["It's the tibialis posterior.", "It inverts and plantarflexes the foot, and it helps support the medial arch."]),
    # ---------- LEVEL 4: nerves ----------
    q(3, TF, tf, None, (1.0, 0.35, 0.63), (0.33, 0.655), "Which nerve supplies the rectus femoris?", ["Obturator nerve", "Femoral nerve", "Sciatic nerve", "Superior gluteal"], 1, "Femoral nerve",
      "Number twenty two. Which nerve supplies the rectus femoris?",
      ["The femoral nerve.", "It supplies all four quadriceps and the sartorius. The whole front of the thigh."], skip=("RF",)),
    q(3, TF, tf, None, (1.0, 0.62, 0.58), (0.684, 0.585), "Which nerve supplies the adductor longus?", ["Femoral nerve", "Tibial nerve", "Obturator nerve", "Pudendal nerve"], 2, "Obturator nerve",
      "Number twenty three. Which nerve supplies the adductor longus?",
      ["The obturator nerve.", "It runs the inner thigh. Adductor longus, brevis, gracilis, and the adductor part of adductor magnus."], skip=("AL",)),
    q(3, GB, gb, None, (1.0, 0.72, 0.08), (0.75, 0.034), "Which nerve supplies the gluteus medius?", ["Inferior gluteal", "Superior gluteal", "Sciatic nerve", "Femoral nerve"], 1, "Superior gluteal nerve",
      "Number twenty four. Which nerve supplies the gluteus medius?",
      ["The superior gluteal nerve. It also supplies the gluteus minimus and tensor fasciae latae.", "Damage it, and you get a positive Trendelenburg sign. The pelvis drops on the opposite side."], skip=("GMED",)),
    q(3, GB, gb, None, (1.0, 0.55, 0.53), (0.6, 0.5), "Which nerve supplies the long head of biceps femoris?", ["Common fibular", "Femoral nerve", "Sciatic, tibial part", "Inferior gluteal"], 2, "Sciatic (tibial part)",
      "Number twenty five. Which nerve supplies the long head of biceps femoris?",
      ["The tibial part of the sciatic nerve.", "Exam trap. The short head is the only hamstring part supplied by the common fibular part."], skip=("BF", "LH")),
    q(3, LF, lf, None, (1.0, 0.3, 0.3), (0.33, 0.285), "Which nerve supplies the tibialis anterior?", ["Tibial nerve", "Superficial fibular", "Saphenous nerve", "Deep fibular"], 3, "Deep fibular nerve",
      "Number twenty six. Which nerve supplies the tibialis anterior?",
      ["The deep fibular nerve. It supplies the whole front of the leg.", "The superficial fibular nerve supplies the outer side. Fibularis longus and brevis."], skip=("TA",)),
    q(3, CS, cs, None, (1.0, 0.5, 0.45), (0.6, 0.42), "Which nerve supplies the soleus?", ["Tibial nerve", "Deep fibular", "Common fibular", "Obturator nerve"], 0, "Tibial nerve",
      "Number twenty seven. Last one. Which nerve supplies the soleus?",
      ["The tibial nerve.", "It supplies every muscle at the back of the leg. Gastrocnemius, soleus, popliteus, and the deep flexors."], skip=("SOL",)),
]
CTA_AFTER_LEVEL = 1
CTA = ["Quick break.", "If you want to drill these muscles, our anatomy flash cards cover all of them.", "The link is in the description.", "Okay. Level three."]
OUTRO = [
    "That's the quiz.",
    "Zero to twelve, keep practising. Thirteen to twenty one, solid. Twenty two or more, you know the lower limb better than most students.",
    "Comment your score, and tell me which one got you.",
    "Subscribe for the next anatomy quiz.",
]
BANDS = [["0–12", "Keep practising"], ["13–21", "Solid"], ["22–27", "Leg anatomy pro"]]
THUMB = dict(big="NAME THIS MUSCLE?", sub="LEG ANATOMY QUIZ", q=0, zoom=1.7, hl=2, bg="yellow")
EXTRA_DICT = """sartorius S AA R T AO R IY AH S
femoris F EH M ER IH S
gastrocnemius G AE S T R AA K N IY M IY AH S
soleus S OW L IY AH S
semitendinosus S EH M IY T EH N D IH N OW S AH S
semimembranosus S EH M IY M EH M B R AH N OW S AH S
gracilis G R AE S IH L IH S
pectineus P EH K T IH N IY AH S
iliacus IH L AY AH K AH S
iliopsoas IH L IY OW S OW AH S
piriformis P IH R IH F AO R M IH S
quadratus K W AA D R EY T AH S
popliteus P AA P L IH T IY AH S
tibialis T IH B IY AE L IH S
fibularis F IH B Y AH L EH R IH S
peronaeus P EH R AH N IY AH S
fasciae F AE SH IY IY
latae L AA T IY
vastus V AE S T AH S
lateralis L AE T ER AE L IH S
medialis M IY D IY AE L IH S
gluteus G L UW T IY AH S
medius M IY D IY AH S
minimus M IH N IH M AH S
iliotibial IH L IY OW T IH B IY AH L
malleolus M AH L IY AH L AH S
calcaneal K AE L K EY N IY AH L
plantarflexes P L AE N T ER F L EH K S IH Z
plantarflexion P L AE N T ER F L EH K SH AH N
dorsiflexion D AO R S IH F L EH K SH AH N
gemellus JH AH M EH L AH S
lumborum L AH M B AO R AH M
trochanter T R OW K AE N T ER
fibula F IH B Y AH L AH
fibular F IH B Y AH L ER
vasti V AE S T AY
everts IH V ER T S
superficial S UW P ER F IH SH AH L
practising P R AE K T IH S IH NG
warm-up W AO R M AH P
strap-like S T R AE P L AY K
teardrop-shaped T IH R D R AA P SH EY P T
membrane-like M EH M B R EY N L AY K
"""
