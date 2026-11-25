# Heart anatomy quiz — 27 questions, 4 levels (2026-11-25)
TITLE = "Heart Anatomy Quiz: Can You Name All 27 Parts?"
SERIES = "Anatomy Quiz"
COUNT = 5
RULES = ["5 seconds each", "Keep score", "It gets harder"]

ARCH = {"src": "plates/arch.png", "aspect": 1375 / 2074}
RINT = {"src": "plates/rightint.png", "aspect": 1956 / 1338}
LINT = {"src": "plates/leftint.png", "aspect": 1592 / 1370}
SEPT = {"src": "plates/septum.png", "aspect": 1691 / 1486}
BASE = {"src": "plates/base.png", "aspect": 1888 / 1599}
BUND = {"src": "plates/bundle.png", "aspect": 1577 / 1805}
PULM = {"src": "plates/pulm.png", "aspect": 1984 / 1371}
SIZE = {"arch": (729, 1100), "rint": (1100, 752), "lint": (1100, 946), "sept": (1100, 967), "base": (1100, 932), "bund": (961, 1100), "pulm": (1100, 760)}


def B(p, x0, y0, x1, y1):
    W, H = SIZE[p]
    return [round(x0 / W, 4), round(y0 / H, 4), round((x1 - x0) / W, 4), round((y1 - y0) / H, 4)]


def P(p, x, y):
    W, H = SIZE[p]
    return (round(x / W, 4), round(y / H, 4))


def Zm(p, z, x, y):
    W, H = SIZE[p]
    return (z, round(x / W, 4), round(y / H, 4))


# ---- printed label boxes, px on the 1100/729-wide preview of each plate ----
arch = dict(  # Fig. 505
    RV=[B("arch", 325, 755, 545, 790)], RVAGUS=[B("arch", 92, 35, 212, 60)], REC=[B("arch", 28, 68, 188, 96)],
    THY=[B("arch", 312, 0, 412, 14)], LVAGUS=[B("arch", 600, 35, 700, 60)], LPHR=[B("arch", 600, 62, 718, 84)], TDUCT=[B("arch", 600, 86, 728, 106)],
    RINN=[B("arch", 190, 180, 248, 255)], LINN=[B("arch", 268, 235, 485, 295)], ARCHA=[B("arch", 350, 342, 445, 395)],
    ASC=[B("arch", 278, 425, 335, 530)], LIM=[B("arch", 262, 368, 385, 432)], RAUR=[B("arch", 148, 585, 282, 695)],
    RCA=[B("arch", 212, 695, 285, 860)], PA=[B("arch", 382, 568, 472, 640)], RPA=[B("arch", 368, 478, 432, 512)],
    LPA=[B("arch", 468, 482, 535, 505)], LBR=[B("arch", 488, 548, 532, 578)], LAUR=[B("arch", 580, 614, 718, 640)],
    LCOR=[B("arch", 528, 660, 570, 700), B("arch", 590, 675, 690, 850)], IVC=[B("arch", 205, 948, 268, 1032)],
    TAO=[B("arch", 432, 1008, 492, 1062)], SVC=[B("arch", 178, 330, 226, 480)],
    BRA=[B("arch", 252, 12, 300, 150)], LCC=[B("arch", 448, 18, 485, 172)], TRA=[B("arch", 372, 88, 402, 150)],
    RSUB=[B("arch", 128, 108, 200, 135)], LSUB=[B("arch", 548, 112, 628, 140)], BIT=[B("arch", 258, 188, 330, 262)],
    PL1=[B("arch", 95, 205, 165, 288)], PL2=[B("arch", 588, 190, 658, 245)],
)
rint = dict(  # Fig. 493
    SVC=[B("rint", 295, 65, 420, 112)], RAUR=[B("rint", 385, 85, 500, 135)], OSVC=[B("rint", 10, 222, 240, 268)],
    CRISTA=[B("rint", 50, 272, 238, 298)], AS=[B("rint", 88, 305, 236, 330)], LIMBUS=[B("rint", 22, 345, 238, 372)],
    FOSSA=[B("rint", 340, 380, 420, 425)], OCS=[B("rint", 15, 408, 235, 455)], OIVC=[B("rint", 12, 505, 238, 552)],
    IVC=[B("rint", 262, 560, 350, 615)], VIVC=[B("rint", 170, 660, 420, 690)], VCS=[B("rint", 215, 698, 470, 728)],
    PV=[B("rint", 652, 10, 835, 38)], TV=[B("rint", 838, 172, 1065, 218)], CT=[B("rint", 880, 228, 1065, 255)], PM=[B("rint", 920, 262, 1025, 312)],
)
lint = dict(  # Fig. 496
    PA=[B("lint", 400, 92, 545, 138)], AO=[B("lint", 645, 98, 730, 128)], SVC=[B("lint", 815, 110, 960, 165)],
    LAUR=[B("lint", 298, 212, 398, 268)], RPV=[B("lint", 865, 312, 998, 430)], LA=[B("lint", 590, 385, 740, 510)],
    LV=[B("lint", 275, 490, 445, 650)], BV=[B("lint", 440, 470, 545, 640)], CS=[B("lint", 555, 478, 690, 635)],
    IVC=[B("lint", 770, 695, 925, 745)],
)
sept = dict(  # Fig. 498
    AO=[B("sept", 460, 110, 555, 160)], LAUR=[B("sept", 825, 160, 990, 192)], IVC=[B("sept", 62, 262, 185, 320)],
    AV=[B("sept", 900, 290, 1050, 322)], MS=[B("sept", 28, 342, 190, 398)], MP=[B("sept", 78, 405, 190, 465)],
    BIC=[B("sept", 555, 350, 690, 430)], TRI=[B("sept", 340, 440, 470, 520)], WLV=[B("sept", 850, 368, 897, 474), B("sept", 884, 465, 943, 592), B("sept", 906, 584, 952, 727)],
    PAP=[B("sept", 1000, 495, 1100, 555)], WRV=[B("sept", 300, 562, 372, 643), B("sept", 364, 626, 474, 744), B("sept", 457, 728, 565, 825)], VS=[B("sept", 605, 584, 677, 677), B("sept", 669, 669, 761, 770), B("sept", 745, 745, 808, 812)],
    APM=[B("sept", 240, 935, 560, 965)],
)
base = dict(  # Fig. 491
    AZ=[B("base", 692, 10, 825, 38)], AO=[B("base", 598, 125, 695, 165)], PA=[B("base", 475, 170, 725, 238)], SVC=[B("base", 785, 140, 835, 260)],
    LPV=[B("base", 55, 318, 295, 345)], OB=[B("base", 25, 430, 300, 455)], GC=[B("base", 20, 478, 228, 505)], LM=[B("base", 20, 530, 228, 555)],
    LA=[B("base", 560, 395, 655, 455)], RPV=[B("base", 890, 350, 1078, 395)], RA=[B("base", 780, 562, 855, 612)], IVC=[B("base", 705, 680, 825, 742)],
    LV=[B("base", 300, 605, 505, 690)], CS=[B("base", 545, 590, 660, 700)], RV=[B("base", 465, 775, 650, 860)], SC=[B("base", 710, 830, 920, 855)],
    PVL=[B("base", 50, 873, 375, 898)], MC=[B("base", 388, 905, 610, 930)],
)
pulm = dict(  # Fig. 504
    TR=[B("pulm", 525, 100, 570, 320)], PAR=[B("pulm", 370, 305, 470, 360)], SVC=[B("pulm", 612, 215, 655, 265)],
    BR=[B("pulm", 415, 340, 520, 390), B("pulm", 585, 325, 665, 380)], PVN=[B("pulm", 350, 420, 520, 460), B("pulm", 620, 440, 740, 485)],
    IVC=[B("pulm", 645, 530, 680, 630)], LV=[B("pulm", 350, 740, 465, 760)], LA=[B("pulm", 485, 740, 560, 760)],
    GCV=[B("pulm", 575, 712, 755, 750)], EV=[B("pulm", 960, 258, 1100, 335)],
)


def H(d, target=None, skip=()):
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


INTRO = [
    "Can you name all twenty seven parts of the heart?",
    "You get five seconds for each one. Keep score, and be honest.",
    "Every picture is a plate from Gray's Anatomy, more than a hundred years old. We start with the big chambers. By level four, we're asking which artery feeds what.",
]
LEVELS = [
    ("Warm-up", "Level one. The warm-up. Big chambers and big vessels."),
    ("Medium", "Level two. Coronary arteries, valves, and the back of the heart."),
    ("Hard", "Level three. Now we go inside the heart."),
    ("Expert", "Level four. Expert. Veins, pouches, the conduction system, and which artery feeds what."),
]
Q = [
    # ---------------- level 1 ----------------
    q(0, ARCH, arch, "RV", Zm("arch", 1.2, 420, 800), P("arch", 440, 835), "Name this chamber.",
      ["Right atrium", "Right ventricle", "Left atrium", "Left ventricle"], 1, "Right ventricle",
      "Number {N}. Name this chamber.",
      ["It's the right ventricle.", "It forms most of the front of the heart, and it pumps blood to the lungs."]),
    q(0, ARCH, arch, "PA", Zm("arch", 1.3, 420, 560), P("arch", 415, 605), "Name this vessel.",
      ["Aorta", "Pulmonary artery", "Superior vena cava", "Pulmonary vein"], 1, "Pulmonary artery",
      "Number {N}. Name this vessel.",
      ["It's the pulmonary artery, also called the pulmonary trunk.", "It leaves the right ventricle and carries low oxygen blood toward the lungs."]),
    q(0, ARCH, arch, "SVC", Zm("arch", 1.3, 200, 400), P("arch", 190, 430), "Name this large vein.",
      ["Inferior vena cava", "Superior vena cava", "Brachiocephalic vein", "Azygos vein"], 1, "Superior vena cava",
      "Number {N}. Name this large vein.",
      ["It's the superior vena cava.", "It drains the head, neck, arms and chest into the right atrium."]),
    q(0, ARCH, arch, "ARCHA", Zm("arch", 1.3, 440, 380), P("arch", 470, 395), "Name this part of the aorta.",
      ["Ascending aorta", "Aortic arch", "Thoracic aorta", "Abdominal aorta"], 1, "Aortic arch",
      "Number {N}. Name this part of the aorta.",
      ["It's the aortic arch.", "It curves backward and to the left, and gives off three branches: the brachiocephalic trunk, the left common carotid, and the left subclavian artery."]),
    q(0, ARCH, arch, "RAUR", Zm("arch", 1.3, 200, 620), P("arch", 175, 640), "Name this ear-shaped pouch.",
      ["Right auricle", "Right ventricle", "Left auricle", "Conus arteriosus"], 0, "Right auricle",
      "Number {N}. Name this ear-shaped pouch.",
      ["It's the right auricle.", "Auricle is Latin for little ear. It's a small pouch that belongs to the right atrium."], old="right auricula"),
    q(0, ARCH, arch, "IVC", Zm("arch", 1.3, 260, 960), P("arch", 235, 990), "Name this vein.",
      ["Superior vena cava", "Inferior vena cava", "Hepatic vein", "Coronary sinus"], 1, "Inferior vena cava",
      "Number {N}. Name this vein.",
      ["It's the inferior vena cava.", "It returns blood from everything below the diaphragm to the right atrium."]),
    q(0, ARCH, arch, "TAO", Zm("arch", 1.3, 470, 980), P("arch", 462, 1035), "Name this vessel.",
      ["Pulmonary trunk", "Thoracic aorta", "Abdominal aorta", "Esophagus"], 1, "Thoracic aorta",
      "Number {N}. Name this vessel at the bottom of the picture.",
      ["It's the thoracic aorta, the part of the descending aorta inside the chest.", "It passes through the diaphragm at about the level of the twelfth thoracic vertebra, and becomes the abdominal aorta."]),
    # ---------------- level 2 ----------------
    q(1, ARCH, arch, "RCA", Zm("arch", 1.5, 250, 740), P("arch", 232, 692), "Name this artery.",
      ["Right coronary artery", "Left anterior descending", "Pulmonary artery", "Internal thoracic artery"], 0, "Right coronary artery",
      "Number {N}. Name this artery.",
      ["It's the right coronary artery.", "It arises from the aorta, runs in the groove between the right atrium and right ventricle, and feeds the right side of the heart."]),
    q(1, ARCH, arch, "LCOR", Zm("arch", 1.5, 600, 780), P("arch", 634, 794), "Name this artery.",
      ["Right coronary artery", "Left anterior descending", "Circumflex artery", "Posterior descending artery"], 1, "Left anterior descending",
      "Number {N}. This artery runs toward the apex. Name it.",
      ["It's the left anterior descending artery, a branch of the left coronary.", "It runs in the groove between the two ventricles, and feeds the front of the left ventricle."], old="left coronary"),
    q(1, ARCH, arch, "LINN", Zm("arch", 1.4, 380, 270), P("arch", 400, 258), "Name this vein.",
      ["Left brachiocephalic vein", "Left subclavian vein", "Left jugular vein", "Superior vena cava"], 0, "Left brachiocephalic vein",
      "Number {N}. This vein crosses in front of the arch branches. Name it.",
      ["It's the left brachiocephalic vein.", "This atlas calls it the left innominate vein. It joins the right one to form the superior vena cava."], old="left innominate vein"),
    q(1, BASE, base, "LA", Zm("base", 1.2, 560, 480), P("base", 560, 520), "Which chamber forms most of the back of the heart?",
      ["Right atrium", "Left atrium", "Right ventricle", "Left ventricle"], 1, "Left atrium",
      "Number {N}. Which chamber forms most of the back of the heart?",
      ["It's the left atrium.", "It forms most of the base of the heart, and it receives the four pulmonary veins."]),
    q(1, BASE, base, "CS", Zm("base", 1.5, 600, 650), P("base", 602, 640), "Name this vein on the back of the heart.",
      ["Great cardiac vein", "Coronary sinus", "Small cardiac vein", "Oblique vein"], 1, "Coronary sinus",
      "Number {N}. Name this vein on the back of the heart.",
      ["It's the coronary sinus.", "It collects most of the blood from the heart wall, and it empties into the right atrium."]),
    q(1, SEPT, sept, "TRI", Zm("sept", 1.5, 400, 480), P("sept", 410, 500), "Name this valve.",
      ["Mitral valve", "Tricuspid valve", "Aortic valve", "Pulmonary valve"], 1, "Tricuspid valve",
      "Number {N}. Name this valve.",
      ["It's the tricuspid valve.", "It sits between the right atrium and the right ventricle, and it has three cusps."]),
    q(1, SEPT, sept, "BIC", Zm("sept", 1.5, 640, 460), P("sept", 630, 440), "Name this valve.",
      ["Tricuspid valve", "Mitral valve", "Aortic valve", "Pulmonary valve"], 1, "Mitral valve",
      "Number {N}. And this valve?",
      ["It's the mitral valve, which this atlas calls the bicuspid valve.", "It sits between the left atrium and the left ventricle, and it has two cusps.", "Mitral comes from the bishop's mitre, a hat with two points."], old="bicuspid valve"),
    # ---------------- level 3 ----------------
    q(2, SEPT, sept, "AV", Zm("sept", 1.6, 540, 290), P("sept", 530, 262), "Name this valve.",
      ["Aortic valve", "Pulmonary valve", "Mitral valve", "Tricuspid valve"], 0, "Aortic valve",
      "Number {N}. Name this valve.",
      ["It's the aortic valve.", "It has three semilunar cusps, and it guards the exit of the left ventricle.", "Together with the pulmonary valve, its closing makes the second heart sound."]),
    q(2, SEPT, sept, "VS", Zm("sept", 1.4, 650, 650), P("sept", 665, 665), "This wall separates the two ventricles. Name it.",
      ["Interatrial septum", "Interventricular septum", "Pericardium", "Coronary sulcus"], 1, "Interventricular septum",
      "Number {N}. This wall separates the two ventricles. Name it.",
      ["It's the interventricular septum.", "Most of it is thick muscle. The thin upper part is called the membranous septum."], old="ventricular septum"),
    q(2, SEPT, sept, "PAP", Zm("sept", 1.6, 790, 570), P("sept", 790, 560), "Name these muscular cones inside the left ventricle.",
      ["Papillary muscles", "Trabeculae carneae", "Musculi pectinati", "Chordae tendineae"], 0, "Papillary muscles",
      "Number {N}. Name these muscular cones inside the left ventricle.",
      ["They're the papillary muscles.", "They pull on the chordae tendineae, the heart strings, so the valve cusps don't flip back into the atrium."]),
    q(2, SEPT, sept, "MP", Zm("sept", 1.7, 300, 430), P("sept", 320, 432), "Name these comb-like ridges in the right atrium.",
      ["Pectinate muscles", "Papillary muscles", "Trabeculae carneae", "Moderator band"], 0, "Pectinate muscles",
      "Number {N}. Name these comb-like ridges in the right atrium.",
      ["They're the pectinate muscles.", "Pectinate comes from the Latin word for comb. They line the front wall of the right atrium and the auricle."], old="musculi pectinati"),
    q(2, RINT, rint, "FOSSA", Zm("rint", 1.6, 390, 450), P("rint", 380, 452), "Name this oval depression in the atrial wall.",
      ["Fossa ovalis", "Crista terminalis", "Coronary sinus opening", "Auricle"], 0, "Fossa ovalis",
      "Number {N}. Name this oval depression in the atrial wall.",
      ["It's the fossa ovalis.", "It marks where the foramen ovale was, the opening between the two atria before birth."]),
    q(2, RINT, rint, "CRISTA", Zm("rint", 1.6, 300, 330), P("rint", 296, 300), "Name this muscular ridge.",
      ["Crista terminalis", "Limbus of the fossa ovalis", "Fossa ovalis", "Atrial septum"], 0, "Crista terminalis",
      "Number {N}. Name this muscular ridge.",
      ["It's the crista terminalis.", "It's a ridge inside the right atrium. It separates the smooth back wall from the rough front wall.", "The sinoatrial node sits near its upper end."]),
    q(2, RINT, rint, "PV", Zm("rint", 1.7, 690, 160), P("rint", 690, 150), "Name this valve.",
      ["Pulmonary valve", "Aortic valve", "Tricuspid valve", "Mitral valve"], 0, "Pulmonary valve",
      "Number {N}. Name this valve.",
      ["It's the pulmonary valve.", "It guards the exit of the right ventricle into the pulmonary trunk. Like the aortic valve, it has three semilunar cusps."]),
    # ---------------- level 4 ----------------
    q(3, PULM, pulm, "PVN", Zm("pulm", 1.4, 740, 540), P("pulm", 761, 563), "Name this vessel.",
      ["Pulmonary vein", "Pulmonary artery", "Inferior vena cava", "Bronchial artery"], 0, "Pulmonary vein",
      "Number {N}. Name this vessel.",
      ["It's a pulmonary vein.", "It's drawn red, because it carries oxygen rich blood from the lung to the left atrium.", "It's the exception to the rule that veins carry low oxygen blood."]),
    q(3, BASE, base, "AZ", Zm("base", 1.6, 750, 110), P("base", 750, 106), "This small vein arches over the root of the right lung. Name it.",
      ["Azygos vein", "Hemiazygos vein", "Internal thoracic vein", "Great cardiac vein"], 0, "Azygos vein",
      "Number {N}. This small vein arches over the root of the right lung and drains into the superior vena cava. Name it.",
      ["It's the azygos vein.", "It runs up the right side of the vertebral column, and it brings blood back from the chest wall."]),
    q(3, LINT, lint, "LAUR", Zm("lint", 1.6, 330, 280), P("lint", 345, 305), "Name this pouch.",
      ["Left auricle", "Right auricle", "Coronary sinus", "Conus arteriosus"], 0, "Left auricle",
      "Number {N}. Name this pouch.",
      ["It's the left auricle.", "It's a small pouch of the left atrium. It's longer and narrower than the right one, and it overlaps the root of the pulmonary artery."], old="left auricula"),
    q(3, BUND, {}, None, Zm("bund", 1.4, 500, 760), P("bund", 505, 755), "This red line is a conduction pathway. Name it.",
      ["Bundle of His", "Purkinje fibers", "Sinoatrial node", "Chordae tendineae"], 0, "Bundle of His",
      "Number {N}. This red line is a conduction pathway. Name it.",
      ["It's the atrioventricular bundle, also called the bundle of His.", "It carries the signal from the AV node into the interventricular septum, where it splits into a right and a left branch."]),
    q(3, ARCH, arch, "RV", Zm("arch", 1.2, 420, 820), P("arch", 405, 865), "Which artery mainly supplies this wall?",
      ["Right coronary artery", "Left anterior descending", "Circumflex artery", "Internal thoracic artery"], 0, "Right coronary artery",
      "Number {N}. Which artery mainly supplies this wall?",
      ["The right coronary artery.", "It feeds the right atrium and most of the right ventricle."]),
    q(3, ARCH, arch, "LCOR", Zm("arch", 1.3, 620, 860), P("arch", 650, 905), "Which artery mainly supplies this part of the heart?",
      ["Right coronary artery", "Left anterior descending", "Pulmonary artery", "Coronary sinus"], 1, "Left anterior descending",
      "Number {N}. Last one. Which artery mainly supplies this part of the heart, the apex?",
      ["The left anterior descending artery.", "It's an exam favourite. It feeds the front wall of the left ventricle, the apex, and the front two thirds of the septum."]),
]
CTA_AFTER_LEVEL = 1
CTA = ["Quick break.", "If you want to drill the heart and every other organ, our anatomy flash cards cover them.", "The link is in the description.", "Okay, level three."]
OUTRO = [
    "That's the quiz.",
    "Zero to nine, keep practising. Ten to eighteen, solid. Nineteen to twenty six, strong. Twenty seven out of twenty seven, you know the heart like a pro.",
    "Tell me your score in the comments, and which question got you.",
]
BANDS = [["0–9", "Keep practising"], ["10–18", "Solid"], ["19–26", "Strong"], ["27/27", "Heart pro"]]
THUMB = dict(big="NAME THIS PART?", sub="HEART ANATOMY QUIZ", q=8, zoom=1.6, hl=2, bg="yellow")
INTRO_IMG = "plates/intro.png"
EXTRA_DICT = """auricle AO R IH K AH L
auricula AO R IH K Y AH L AH
brachiocephalic B R EY K IY OW S AH F AE L IH K
innominate IH N AA M AH N AH T
crista K R IH S T AH
terminalis T ER M AH N AE L AH S
fossa F AA S AH
ovalis OW V AE L AH S
tricuspid T R AY K AH S P AH D
mitre M AY T ER
chordae K AO R D IY
tendineae T EH N D IH N IY IY
pectinati P EH K T IH N AA T IY
trabeculae T R AH B EH K Y AH L IY
carneae K AA R N IY IY
sinoatrial S AY N OW EY T R IY AH L
atrioventricular EY T R IY OW V EH N T R IH K Y AH L ER
purkinje P ER K IH N JH IY
semilunar S EH M IY L UW N ER
sulcus S AH L K AH S
vena V IY N AH
cava K EY V AH
azygos AE Z AH G AA S
subclavian S AH B K L EY V IY AH N
interatrial IH N T ER EY T R IY AH L
interventricular IH N T ER V EH N T R IH K Y AH L ER
pulmonary P UH L M AH N EH R IY
practising P R AE K T IH S IH NG
warm-up W AO R M AH P
oxygen AA K S AH JH AH N
"""

NUMW = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty".split() + ["twenty one", "twenty two", "twenty three", "twenty four", "twenty five", "twenty six", "twenty seven"]
for _i, _q in enumerate(Q, 1):
    _q["ask"] = _q["ask"].replace("{N}", NUMW[_i])
assert _i == 27
