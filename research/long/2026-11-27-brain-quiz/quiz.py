# Brain anatomy quiz — 23 questions, 4 levels + 4 memory-trick cards (2026-11-27)
TITLE = "Brain Anatomy Quiz: Can You Name All 23 Parts?"
SERIES = "Anatomy Quiz"
COUNT = 5
RULES = ["5 seconds each", "Keep score", "It gets harder"]

MESAL = {"src": "plates/mesal.png", "aspect": 2215 / 1529}
LOBES = {"src": "plates/lobes.png", "aspect": 1939 / 1248}
GYRI = {"src": "plates/gyri.png", "aspect": 1984 / 1094}
VENS = {"src": "plates/venside.png", "aspect": 1578 / 1048}
STEM = {"src": "plates/stem.png", "aspect": 1758 / 3148}
SIZE = {"mesal": (1100, 759), "lobes": (1100, 708), "gyri": (1100, 607), "vens": (1100, 731), "stem": (614, 1100)}
PL = {"mesal": MESAL, "lobes": LOBES, "gyri": GYRI, "vens": VENS, "stem": STEM}
FW, FH = 1040, 760


def B(p, x0, y0, x1, y1):
    W, H = SIZE[p]
    return [round(x0 / W, 4), round(y0 / H, 4), round((x1 - x0) / W, 4), round((y1 - y0) / H, 4)]


def P(p, x, y):
    W, H = SIZE[p]
    return (round(x / W, 4), round(y / H, 4))


def Zm(p, z, x, y):
    W, H = SIZE[p]
    return (z, round(x / W, 4), round(y / H, 4))


def RB(p, cx, cy, L, T, A):
    """slanted sticker: centre (cx, cy), length L along the text, thickness T, angle A (deg, screen coords) -> [x, y, w, h, angle]"""
    W, H = SIZE[p]
    return [round((cx - L / 2) / W, 4), round((cy - T / 2) / H, 4), round(L / W, 4), round(T / H, 4), A]


def window(p, zm):
    """visible window of the plate frame, as fractions (x0, y0, x1, y1)"""
    asp = PL[p]["aspect"]
    z, fx, fy = zm
    base = max(FW, FH * asp)
    iw = base * z
    ih = iw / asp
    cl = lambda v, lo, hi: max(lo, min(hi, v))
    left = cl(FW / 2 - fx * iw, FW - iw, 0)
    top = cl(FH / 2 - fy * ih, FH - ih, 0)
    return (-left / iw, -top / ih, (-left + FW) / iw, (-top + FH) / ih)


# ---- printed label boxes, px on the preview of each plate (see grids) ----
mesal = dict(  # Gray Fig. 715
    FOR=[B("mesal", 455, 5, 640, 25)], MIDC=[B("mesal", 720, 35, 912, 50)], CHP=[B("mesal", 752, 50, 935, 82)], TAEN=[B("mesal", 800, 83, 948, 98)],
    HAB=[B("mesal", 850, 124, 970, 155)], POSTC=[B("mesal", 888, 180, 1005, 212)], ROST=[B("mesal", 28, 508, 110, 522)], COP=[B("mesal", 78, 525, 145, 540)],
    ANTC=[B("mesal", 88, 543, 178, 573)], LAMT=[B("mesal", 32, 576, 212, 592)], OCH=[B("mesal", 118, 593, 244, 608)], ON=[B("mesal", 222, 610, 278, 640)],
    PIT=[B("mesal", 162, 643, 305, 658)], OCUL=[B("mesal", 370, 635, 492, 666)], CALB=[B("mesal", 348, 668, 495, 684)], TUB=[B("mesal", 302, 686, 460, 702)],
    PINE=[B("mesal", 905, 574, 1022, 590)], QUAD=[B("mesal", 903, 607, 1048, 638)], AQ=[B("mesal", 903, 666, 995, 682)], SMV=[B("mesal", 868, 692, 1018, 724)],
    FOUR=[B("mesal", 836, 724, 935, 752)],
    CC=[B("mesal", 350, 266, 512, 300)], GENU=[B("mesal", 258, 314, 302, 336)], SEPT=[B("mesal", 343, 298, 497, 330)], FORN=[B("mesal", 438, 322, 512, 344)],
    THAL=[B("mesal", 450, 356, 552, 402)], SPLE=[B("mesal", 595, 364, 666, 390)], MID=[B("mesal", 503, 436, 582, 494)], PONS=[B("mesal", 490, 556, 542, 582)],
    OBLO=[B("mesal", 572, 622, 612, 710)], CEREB=[B("mesal", 683, 628, 882, 722)],
)
lobes = dict(  # Gray Fig. 728
    FRONT=[RB("lobes", 177.5, 334, 206, 46, -40.4), RB("lobes", 330, 212, 94, 40, -29)], CENF=[B("lobes", 436, 148, 494, 244)], PARI=[B("lobes", 488, 150, 796, 202)],
    SYLV=[B("lobes", 341, 348, 458, 398)], TEMP=[B("lobes", 336, 405, 600, 508), B("lobes", 640, 395, 768, 432)],
    OCCF=[B("lobes", 932, 205, 1034, 229)], OCCL=[B("lobes", 862, 326, 992, 390)], EXOC=[B("lobes", 842, 325, 954, 414)],
)
gyri = dict(  # Gray Fig. 726 (labels are slanted: stickers follow them)
    ACG=[RB("gyri", 519.5, 272, 106, 24, -60), RB("gyri", 547.5, 161.5, 108, 20, -83), RB("gyri", 577.5, 80, 70, 24, -41)],
    PRE=[RB("gyri", 495.5, 260.5, 128, 20, -64), RB("gyri", 523, 125, 72, 16, -83)],
    CS=[RB("gyri", 562, 200, 78, 16, -84), RB("gyri", 583.5, 115.5, 70, 18, -47.5)],
    PCG=[RB("gyri", 577, 289.5, 68, 20, -54.5), RB("gyri", 609.5, 208, 94, 22, -75), RB("gyri", 646, 119, 74, 24, -50)],
    POS=[RB("gyri", 643, 252.5, 122, 16, -68), RB("gyri", 681, 125, 74, 16, -79)],
)
vens = dict(  # Gray Fig. 736
    IVF=[B("vens", 600, 0, 935, 32)], BODY=[B("vens", 372, 146, 548, 250)], ANTH=[B("vens", 766, 194, 902, 224)], THIRD=[B("vens", 562, 240, 692, 298)],
    POSTH=[B("vens", 108, 266, 252, 326)], ANTC=[B("vens", 828, 322, 1052, 354)], SUPR=[B("vens", 56, 394, 306, 428)], OPT=[B("vens", 828, 400, 988, 432)],
    INFH=[B("vens", 542, 412, 662, 450)], INFD=[B("vens", 750, 460, 942, 494)], AQUE=[B("vens", 70, 474, 306, 510)], FOUR=[B("vens", 336, 518, 450, 562)],
    LAT=[B("vens", 445, 688, 628, 722)],
)
stem = dict(  # Gray Fig. 682
    HIP=[B("stem", 168, 408, 296, 462)], CAU=[B("stem", 416, 256, 492, 296)], EXTC=[B("stem", 245, 180, 378, 280)], ANTC=[B("stem", 298, 262, 415, 345)],
    OPTN=[B("stem", 468, 364, 560, 412)], IIIN=[B("stem", 468, 428, 498, 445)], SUPC=[B("stem", 18, 480, 148, 498)], INFC=[B("stem", 22, 550, 148, 568)],
    VSC=[B("stem", 22, 583, 148, 612)], INFB=[B("stem", 188, 485, 238, 542)], LATL=[B("stem", 248, 508, 322, 592)], CERP=[B("stem", 295, 468, 365, 522)],
    PONS=[B("stem", 473, 532, 502, 586)], VN=[B("stem", 405, 616, 448, 650)], SUPP=[B("stem", 262, 640, 292, 716)], INFP=[B("stem", 228, 742, 300, 800)],
    MIDP=[B("stem", 250, 773, 328, 885)], VIN=[B("stem", 560, 680, 596, 700)], VIIIN=[B("stem", 420, 758, 440, 800)], VIIN=[B("stem", 450, 745, 468, 780)],
    OLV=[B("stem", 476, 838, 498, 896)],
)
D = {"mesal": mesal, "lobes": lobes, "gyri": gyri, "vens": vens, "stem": stem}


def q(level, pname, target, zoom, pin, question, options, a, label, ask, say, old=None, hidemore=()):
    """hide = every label box that touches the visible window (so no printed name in the frame gives the answer away)"""
    x0, y0, x1, y1 = window(pname, zoom)
    hide, op = [], []
    for k, boxes in D[pname].items():
        for b in boxes:
            if b[0] < x1 and b[0] + b[2] > x0 and b[1] < y1 and b[1] + b[3] > y0:
                if k == target:
                    op.append(len(hide))
                hide.append(b)
    x = dict(level=level, plate=PL[pname], zoom=zoom, pin=pin, hide=hide, open=op, q=question, options=options, a=a, label=label, ask=ask, say=say)
    if old:
        x["old"] = old
    return x


INTRO = [
    "Your brain has a part named after a bridge, one named after a seahorse, and one named after a tail.",
    "This brain anatomy quiz has twenty three parts, and you get five seconds for each one.",
    "Keep score, and be honest. Every picture is a plate from Gray's Anatomy, from nineteen eighteen.",
    "Level one is the four lobes. By level four, you'll be naming structures deep inside the brain.",
]
LEVELS = [
    ("Warm-up", "Level one. The warm-up. The four lobes."),
    ("Medium", "Level two. Landmarks, the strips that run your body, and then we cut the brain down the middle."),
    ("Hard", "Level three. The brainstem and the structures deep inside."),
    ("Expert", "Level four. Expert. Deep structures, and the fluid filled spaces."),
]
Q = [
    # ---------------- level 1 ----------------
    q(0, "lobes", "FRONT", Zm("lobes", 1.25, 300, 300), P("lobes", 180, 200), "Which lobe is this?",
      ["Frontal lobe", "Parietal lobe", "Temporal lobe", "Occipital lobe"], 0, "Frontal lobe",
      "Number {N}. Which lobe is this?",
      ["It's the frontal lobe.", "It's the biggest lobe, and it handles voluntary movement, planning, and decision making."]),
    q(0, "lobes", "TEMP", Zm("lobes", 1.25, 520, 450), P("lobes", 610, 350), "Which lobe is this?",
      ["Frontal lobe", "Temporal lobe", "Parietal lobe", "Occipital lobe"], 1, "Temporal lobe",
      "Number {N}. Which lobe is this?",
      ["It's the temporal lobe.", "It sits right beside your ear, and it handles hearing. It's also important for memory."]),
    q(0, "lobes", "PARI", Zm("lobes", 1.25, 680, 200), P("lobes", 680, 250), "Which lobe is this?",
      ["Temporal lobe", "Occipital lobe", "Frontal lobe", "Parietal lobe"], 3, "Parietal lobe",
      "Number {N}. Which lobe is this?",
      ["It's the parietal lobe.", "It's where touch, pressure, and body position are processed."]),
    q(0, "lobes", "OCCL", Zm("lobes", 1.3, 860, 330), P("lobes", 935, 290), "Which lobe is this?",
      ["Occipital lobe", "Parietal lobe", "Temporal lobe", "Frontal lobe"], 0, "Occipital lobe",
      "Number {N}. Which lobe is this?",
      ["It's the occipital lobe.", "It's the smallest of the four lobes, and it's dedicated to vision, at the very back of the head."]),
    q(0, "lobes", None, Zm("lobes", 1.3, 700, 560), P("lobes", 735, 610), "Name this structure, tucked under the back of the brain.",
      ["Pons", "Thalamus", "Cerebellum", "Occipital lobe"], 2, "Cerebellum",
      "Number {N}. Name this structure, tucked under the back of the brain.",
      ["It's the cerebellum, which is Latin for little brain.", "It coordinates movement and balance, and it holds a surprising share of all the neurons in the brain."]),
    # ---------------- level 2 ----------------
    q(1, "lobes", "CENF", Zm("lobes", 1.3, 470, 230), P("lobes", 466, 200), "Which groove separates the frontal lobe from the parietal lobe?",
      ["Lateral sulcus", "Central sulcus", "Calcarine sulcus", "Parieto-occipital sulcus"], 1, "Central sulcus",
      "Number {N}. Which groove separates the frontal lobe from the parietal lobe?",
      ["It's the central sulcus.", "The motor strip sits just in front of it, and the sensory strip just behind it. We'll come back to that."], old="central fissure"),
    q(1, "lobes", "SYLV", Zm("lobes", 1.3, 400, 380), P("lobes", 425, 337), "Which deep groove separates the temporal lobe from the frontal and parietal lobes?",
      ["Central sulcus", "Lateral sulcus", "Longitudinal fissure", "Cingulate sulcus"], 1, "Lateral sulcus",
      "Number {N}. Which deep groove separates the temporal lobe from the frontal and parietal lobes?",
      ["It's the lateral sulcus.", "This 1918 atlas calls it the Sylvian fissure, and you'll still hear that name in lectures. The temporal lobe tucks up underneath it."], old="Sylvian fissure"),
    q(1, "gyri", "ACG", Zm("gyri", 2.6, 545, 190), P("gyri", 545, 185), "This gyrus sits just in front of the central sulcus. Name it.",
      ["Postcentral gyrus", "Precentral gyrus", "Superior frontal gyrus", "Angular gyrus"], 1, "Precentral gyrus",
      "Number {N}. This gyrus sits just in front of the central sulcus. Name it.",
      ["It's the precentral gyrus, the primary motor cortex.", "Its neurons send the signals for voluntary movement. This 1918 atlas calls it the anterior central gyrus."], old="anterior central gyrus"),
    q(1, "gyri", "PCG", Zm("gyri", 2.6, 585, 195), P("gyri", 618, 225), "And this gyrus sits just behind the central sulcus. Name it.",
      ["Precentral gyrus", "Supramarginal gyrus", "Postcentral gyrus", "Inferior frontal gyrus"], 2, "Postcentral gyrus",
      "Number {N}. And this gyrus sits just behind the central sulcus. Name it.",
      ["It's the postcentral gyrus, the primary somatosensory cortex.", "It receives touch, pressure, and position signals, mostly from the opposite side of the body."]),
    q(1, "mesal", "CC", Zm("mesal", 1.5, 440, 300), P("mesal", 400, 279), "Which thick band of white matter connects the two hemispheres?",
      ["Fornix", "Corpus callosum", "Thalamus", "Anterior commissure"], 1, "Corpus callosum",
      "Number {N}. Now the brain is cut down the middle. Which thick band of white matter connects the two hemispheres?",
      ["It's the corpus callosum.", "It's the largest white matter tract in the brain, and it carries signals between the left and right hemispheres."]),
    q(1, "mesal", "THAL", Zm("mesal", 1.6, 520, 400), P("mesal", 540, 392), "This egg shaped mass relays sensory signals to the cortex. Name it.",
      ["Hypothalamus", "Cerebellum", "Pons", "Thalamus"], 3, "Thalamus",
      "Number {N}. This egg shaped mass relays sensory signals to the cortex. Name it.",
      ["It's the thalamus.", "Nearly every sensory pathway stops here on the way to the cortex. Smell is the exception. Hypo means under, so the hypothalamus sits below it."]),
    # ---------------- level 3 ----------------
    q(2, "mesal", "PONS", Zm("mesal", 1.6, 560, 600), P("mesal", 528, 600), "Which part of the brainstem is this bulge?",
      ["Medulla oblongata", "Midbrain", "Pons", "Cerebellum"], 2, "Pons",
      "Number {N}. Which part of the brainstem is this bulge?",
      ["It's the pons, which is Latin for bridge.", "It carries signals between the cerebrum, the cerebellum, and the spinal cord, and it helps control breathing."]),
    q(2, "mesal", "OBLO", Zm("mesal", 1.6, 580, 650), P("mesal", 588, 690), "Which part of the brainstem is this, just above the spinal cord?",
      ["Pons", "Medulla oblongata", "Midbrain", "Thalamus"], 1, "Medulla oblongata",
      "Number {N}. Which part of the brainstem is this, just above the spinal cord?",
      ["It's the medulla oblongata.", "It runs into the spinal cord, and it contains centres that help control heart rate and breathing."]),
    q(2, "mesal", "MID", Zm("mesal", 1.6, 560, 480), P("mesal", 565, 492), "Which part of the brainstem sits at the top, just under the thalamus?",
      ["Midbrain", "Pons", "Medulla oblongata", "Cerebellum"], 0, "Midbrain",
      "Number {N}. Which part of the brainstem sits at the top, just under the thalamus?",
      ["It's the midbrain.", "It sits above the pons, and it holds the colliculi, which handle visual and hearing reflexes."]),
    q(2, "mesal", "FORN", Zm("mesal", 1.7, 470, 335), P("mesal", 505, 335), "This arched tract carries signals out of the hippocampus. Name it.",
      ["Corpus callosum", "Septum pellucidum", "Fornix", "Internal capsule"], 2, "Fornix",
      "Number {N}. This arched tract carries signals out of the hippocampus. Name it.",
      ["It's the fornix.", "It's a C shaped bundle of fibers that's part of the memory circuit. Fornix is Latin for arch."]),
    q(2, "mesal", "SEPT", Zm("mesal", 1.7, 420, 320), P("mesal", 420, 313), "Which thin wall separates the two lateral ventricles?",
      ["Fornix", "Septum pellucidum", "Corpus callosum", "Third ventricle"], 1, "Septum pellucidum",
      "Number {N}. Which thin wall separates the two lateral ventricles?",
      ["It's the septum pellucidum.", "This 1918 atlas calls it the septum lucidum. It hangs like a thin partition below the corpus callosum."], old="septum lucidum"),
    q(2, "mesal", "SPLE", Zm("mesal", 1.7, 600, 360), P("mesal", 640, 372), "The back end of the corpus callosum is thick and rounded. What's it called?",
      ["Genu", "Rostrum", "Splenium", "Fornix"], 2, "Splenium",
      "Number {N}. The back end of the corpus callosum is thick and rounded. What's it called?",
      ["It's the splenium.", "The front end bends like a knee, and genu is Latin for knee. The thick back end is the splenium."]),
    # ---------------- level 4 ----------------
    q(3, "stem", "HIP", Zm("stem", 1.6, 300, 420), P("stem", 372, 422), "This structure is named after a seahorse, and it's vital for forming new memories. Name it.",
      ["Amygdala", "Caudate nucleus", "Hippocampus", "Thalamus"], 2, "Hippocampus",
      "Number {N}. This structure is named after a seahorse, and it's vital for forming new memories. Name it.",
      ["It's the hippocampus. Hippocampus is Greek for seahorse.", "It sits in the temporal lobe, and it's essential for forming new long term memories."]),
    q(3, "stem", "CAU", Zm("stem", 1.6, 400, 300), P("stem", 455, 277), "Name this nucleus, part of the basal ganglia, with a head and a long curving tail.",
      ["Putamen", "Caudate nucleus", "Hippocampus", "Olive"], 1, "Caudate nucleus",
      "Number {N}. Name this nucleus, part of the basal ganglia, with a head and a long curving tail.",
      ["It's the caudate nucleus, and caudate means tailed.", "The basal ganglia help start and smooth out your movements."]),
    q(3, "stem", "OLV", Zm("stem", 1.8, 500, 820), P("stem", 525, 850), "This oval bulge sits on the side of the medulla. Name it.",
      ["Pyramid", "Olive", "Middle cerebellar peduncle", "Pons"], 1, "Olive",
      "Number {N}. This oval bulge sits on the side of the medulla. Name it.",
      ["It's the olive.", "It's an oval bulge on the side of the medulla, and it overlies the inferior olivary nucleus."]),
    q(3, "vens", "INFH", Zm("vens", 1.3, 650, 430), P("vens", 705, 455), "This part of the lateral ventricle curves into the temporal lobe. Name it.",
      ["Anterior horn", "Posterior horn", "Inferior horn", "Fourth ventricle"], 2, "Inferior horn",
      "Number {N}. This part of the lateral ventricle curves into the temporal lobe. Name it.",
      ["It's the inferior horn, also called the temporal horn.", "Each lateral ventricle has a body, plus anterior, posterior, and inferior horns."]),
    q(3, "vens", "AQUE", Zm("vens", 1.5, 480, 420), P("vens", 487, 410), "Which narrow channel links the third ventricle to the fourth?",
      ["Interventricular foramen", "Cerebral aqueduct", "Central canal", "Lateral recess"], 1, "Cerebral aqueduct",
      "Number {N}. Which narrow channel links the third ventricle to the fourth?",
      ["It's the cerebral aqueduct.", "It runs through the midbrain, and it carries cerebrospinal fluid from the third ventricle to the fourth."]),
    q(3, "vens", "FOUR", Zm("vens", 1.5, 440, 540), P("vens", 437, 582), "Which ventricle sits between the pons and the cerebellum?",
      ["Third ventricle", "Fourth ventricle", "Lateral ventricle", "Cerebral aqueduct"], 1, "Fourth ventricle",
      "Number {N}. Last one. Which ventricle sits between the pons and the cerebellum?",
      ["It's the fourth ventricle.", "It lies behind the pons and medulla and in front of the cerebellum. Cerebrospinal fluid leaves the ventricles from here and flows around the brain."]),
]
CTA_AFTER_LEVEL = 1
CTA = ["Quick break.", "If you want to drill the brain and every other organ, our anatomy flash cards cover them.", "The link is in the description.", "Okay, level three."]

MNEMO = [
    dict(after=0, kicker="MEMORY TRICK · NAME ALL 4", title="4 lobes, 4 jobs", plate=LOBES, line="Front moves · top feels · side hears · back sees",
         intro=["Quick memory trick. Four lobes, four jobs."],
         rows=[dict(tag="F", name="Frontal lobe", cue="moves and plans", pin=P("lobes", 180, 200), say="Frontal lobe. It moves you, and it plans."),
               dict(tag="P", name="Parietal lobe", cue="feels touch", pin=P("lobes", 680, 250), dir="r", off=[0, -60], say="Parietal lobe. It feels touch and body position."),
               dict(tag="T", name="Temporal lobe", cue="hears", pin=P("lobes", 610, 350), dir="l", say="Temporal lobe. It hears. Its name comes from your temples, right beside your ears."),
               dict(tag="O", name="Occipital lobe", cue="sees", pin=P("lobes", 935, 290), dir="l", off=[0, 55], say="Occipital lobe. It sees, at the back of the head.")],
         end=["Front moves. Top feels. Side hears. Back sees."]),
    dict(after=1, kicker="MEMORY TRICK · MIX-UP ALERT", title="Motor or sensory?", plate=GYRI, line="M comes before S: Motor in front, Sensory behind",
         intro=["Here's a mix up to avoid. Which strip is motor, and which one is sensory?"],
         rows=[dict(tag="M", name="Precentral gyrus", cue="motor, in front", pin=P("gyri", 543, 150), dir="l", off=[0, -40], say="Precentral gyrus. It's in front of the central sulcus, and it's motor."),
               dict(tag="S", name="Postcentral gyrus", cue="sensory, behind", pin=P("gyri", 620, 250), say="Postcentral gyrus. It's behind the central sulcus, and it's sensory.")],
         end=["M comes before S in the alphabet. Motor comes before sensory, in front of the central sulcus."]),
    dict(after=2, kicker="MEMORY TRICK · NAME ALL 3", title="The brainstem, top to bottom", plate=MESAL, line="M · P · M = Midbrain, Pons, Medulla",
         intro=["The brainstem, from top to bottom."],
         rows=[dict(tag="M", name="Midbrain", cue="on top", pin=P("mesal", 565, 492), say="Midbrain. On top."),
               dict(tag="P", name="Pons", cue="the bridge", pin=P("mesal", 528, 600), say="Pons. The bulge in the middle. Pons means bridge."),
               dict(tag="M", name="Medulla oblongata", cue="joins the spinal cord", pin=P("mesal", 588, 692), say="Medulla oblongata. At the bottom, joining the spinal cord.")],
         end=["M, P, M. Midbrain, pons, medulla. Top to bottom."]),
    dict(after=3, kicker="MEMORY TRICK · NAME ALL 4", title="How the fluid flows", plate=VENS, line="Two, three, aqueduct, four",
         intro=["Last trick. How cerebrospinal fluid flows through the ventricles."],
         rows=[dict(tag="2", name="Lateral ventricles", cue="one in each hemisphere", pin=P("vens", 600, 112), say="Two lateral ventricles, one in each hemisphere."),
               dict(tag="3", name="Third ventricle", cue="in the middle", pin=P("vens", 625, 318), say="They drain into the third ventricle."),
               dict(tag="A", name="Cerebral aqueduct", cue="the narrow channel", pin=P("vens", 487, 410), say="Then the cerebral aqueduct."),
               dict(tag="4", name="Fourth ventricle", cue="behind the pons", pin=P("vens", 437, 582), say="And finally the fourth ventricle.")],
         end=["Two, three, aqueduct, four."]),
]
OUTRO = [
    "That's the quiz.",
    "Zero to seven, keep practising. Eight to fifteen, solid. Sixteen to twenty two, strong. Twenty three out of twenty three, you know the brain like a pro.",
    "Tell me your score in the comments, and which brain part you always mix up.",
    "Next time: what happens inside your body when you sneeze, second by second.",
]
BANDS = [["0–7", "Keep practising"], ["8–15", "Solid"], ["16–22", "Strong"], ["23/23", "Brain pro"]]
HOOK = [("PONS", "bridge"), ("HIPPOCAMPUS", "seahorse"), ("CAUDATE", "tailed", "tail")]
NEXT = "What happens in your body when you sneeze, second by second"
THUMB = dict(big="NAME THIS PART?", sub="BRAIN ANATOMY QUIZ", q=17, zoom=1.8, hl=2, bg="yellow")
INTRO_IMG = "plates/intro.png"
EXTRA_DICT = """sulcus S AH L K AH S
gyrus JH AY R AH S
precentral P R IY S EH N T R AH L
postcentral P OW S T S EH N T R AH L
pellucidum P AH L UW S AH D AH M
lucidum L UW S AH D AH M
oblongata AA B L AO NG G AA T AH
hippocampus HH IH P AH K AE M P AH S
caudate K AO D EY T
splenium S P L IY N IY AH M
genu JH EH N UW
fornix F AO R N IH K S
cerebellum S EH R AH B EH L AH M
cerebrospinal S EH R AH B R OW S P AY N AH L
occipital AA K S IH P AH T AH L
parietal P ER AY AH T AH L
thalamus TH AE L AH M AH S
hypothalamus HH AY P OW TH AE L AH M AH S
sylvian S IH L V IY AH N
colliculi K AH L IH K Y AH L AY
amygdala AH M IH G D AH L AH
putamen P Y UW T EY M AH N
somatosensory S OW M AE T OW S EH N S ER IY
ganglia G AE NG G L IY AH
aqueduct AE K W AH D AH K T
ventricle V EH N T R IH K AH L
ventricles V EH N T R IH K AH L Z
practising P R AE K T IH S IH NG
warm-up W AO R M AH P
nucleus N UW K L IY AH S
olivary AA L AH V EH R IY
medulla M AH D UH L AH
pons P AA N Z
brainstem B R EY N S T EH M
cortex K AO R T EH K S
neurons N UH R AA N Z
rostrum R AA S T R AH M
"""

NUMW = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty".split() + ["twenty one", "twenty two", "twenty three"]
for _i, _q in enumerate(Q, 1):
    _q["ask"] = _q["ask"].replace("{N}", NUMW[_i])
assert _i == 23
