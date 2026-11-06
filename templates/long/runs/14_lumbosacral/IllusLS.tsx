import React from "react";
import { C, FONT, ramp } from "./kit";

/* ---------- colours: one per nerve, used everywhere (diagrams, chips, recap) ---------- */
export const NC: Record<string, string> = {
  ih: "#F0A35E", // iliohypogastric
  ii: "#F2D14E", // ilioinguinal
  gf: "#A6CF6A", // genitofemoral
  lfc: "#7EC4CF", // lateral femoral cutaneous
  obt: "#B48EDB", // obturator
  fem: "#E8796B", // femoral
  saph: "#F2A397", // saphenous
  lst: "#C9B27A", // lumbosacral trunk
  sg: "#F6A8C0", // superior gluteal
  ig: "#D77FAE", // inferior gluteal
  sci: "#E2B13C", // sciatic
  pfc: "#9FB4E8", // posterior femoral cutaneous
  pud: "#8FA86A", // pudendal
  tib: "#5FA8D3", // tibial
  cf: "#E39B4A", // common fibular
  sf: "#F3C98B", // superficial fibular
  df: "#C9773A", // deep fibular
};
export type Lit = Record<string, number>;
const glow = (t: number, lit: Lit, k: string) => (lit[k] !== undefined ? ramp(t, lit[k] - 0.1, lit[k] + 0.35) : 0);
const anyLit = (lit: Lit, t: number) => Object.values(lit).some((v) => t >= v - 0.1);

/** a nerve path: coloured core with dark outline; grows in (grow time) and glows when lit */
const Nerve: React.FC<{ d: string; k: string; t: number; lit: Lit; grow?: Lit; w?: number; dim: boolean; col?: string }> = ({ d, k, t, lit, grow = {}, w = 14, dim, col }) => {
  const g = glow(t, lit, k);
  const p = grow[k] !== undefined ? ramp(t, grow[k], grow[k] + 1.1) : 1;
  if (p <= 0) return null;
  const c = col || NC[k] || "#E9CF7A";
  const op = dim && g === 0 ? 0.3 : 1;
  const pulse = g > 0 ? 0.5 + 0.5 * Math.sin(t * 5) : 0;
  return (
    <g opacity={op}>
      {g > 0 && <path d={d} fill="none" stroke={C.banana} strokeWidth={w + 18 + 6 * pulse} strokeLinecap="round" strokeLinejoin="round" opacity={0.45 * g} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />}
      <path d={d} fill="none" stroke={C.forest} strokeWidth={w + 6 + 2 * g} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      <path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      <path d={d} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth={Math.max(2, w * 0.22)} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} transform="translate(-1.5 -2)" />
    </g>
  );
};

/* =====================================================================
   A. PLEXUS MAP — schematic, right side, front view (midline on the right)
   viewBox 900 x 1000
   ===================================================================== */
const LV = [
  { n: "T12", y: 70 },
  { n: "L1", y: 150 },
  { n: "L2", y: 230 },
  { n: "L3", y: 310 },
  { n: "L4", y: 390 },
  { n: "L5", y: 470 },
];
const SV = [
  { n: "S1", y: 575 },
  { n: "S2", y: 640 },
  { n: "S3", y: 705 },
  { n: "S4", y: 770 },
];
export const PM_PT: Record<string, [number, number]> = {
  ih: [120, 205], ii: [150, 268], gf: [292, 520], lfc: [112, 440], fem: [196, 930], obt: [418, 905], lst: [548, 520],
  sg: [250, 640], ig: [262, 760], sci: [372, 975], pfc: [452, 975], pud: [586, 960], psoas: [420, 330], pir: [380, 720],
  T12: [700, 70], L1: [700, 150], L2: [700, 230], L3: [700, 310], L4: [700, 390], L5: [700, 470], S1: [700, 575], S2: [700, 640], S3: [700, 705], S4: [700, 770],
  lumbar: [380, 250], sacral: [470, 690],
};
const PM_D: Record<string, string> = {
  // lumbar plexus
  ih: "M600 82 C540 100 500 140 440 160 C330 190 230 195 120 205",
  ii: "M600 150 C545 165 520 180 470 200 C360 240 260 262 150 268",
  gf: "M600 160 C560 190 590 225 600 238 C540 260 470 300 420 360 C370 420 330 470 292 520",
  lfc: "M600 240 C560 270 590 310 600 318 C520 330 440 350 360 380 C270 410 190 430 112 440",
  fem: "M600 245 C555 270 600 318 600 320 C565 345 600 398 600 398 C520 420 440 470 380 540 C310 620 240 700 214 780 C200 840 196 890 196 930",
  obt: "M600 250 C565 290 600 320 600 325 C570 350 600 400 600 402 C560 430 520 470 500 520 C470 600 440 700 430 800 C424 850 420 880 418 905",
  lst: "M600 400 C575 420 560 440 556 470 C560 480 600 480 600 478 M556 470 C552 500 552 540 548 560",
  // sacral plexus
  sacral: "M548 560 C560 580 600 585 600 585 M548 560 C520 600 520 640 500 690 M600 650 C560 660 530 670 500 690 M600 715 C560 715 520 712 500 700 M600 780 C570 770 540 750 500 712",
  sg: "M548 572 C500 600 420 620 330 632 C300 636 270 638 250 640",
  ig: "M505 700 C440 720 380 745 330 755 C300 760 280 760 262 760",
  sci: "M500 700 C470 760 430 820 400 880 C385 915 376 945 372 975",
  pfc: "M520 735 C500 800 480 860 465 910 C458 935 455 955 452 975",
  pud: "M600 745 C590 780 560 820 560 860 C560 900 590 920 586 960",
};
export const PlexusMap: React.FC<{ t: number; w: number; lit?: Lit; grow?: Lit; roots?: number; psoas?: number; pir?: number; split?: number; labels?: Lit; dimAll?: boolean }> = ({ t, w, lit = {}, grow = {}, roots = 1, psoas = 1, pir = 1, split = 0, labels = {}, dimAll = true }) => {
  const dim = dimAll && anyLit(lit, t);
  const order = ["lfc", "fem", "obt", "gf", "ii", "ih", "lst", "sacral", "pfc", "pud", "sg", "ig", "sci"];
  const lumbarLit = glow(t, lit, "lumbar"), sacralLit = glow(t, lit, "sacral");
  return (
    <svg width={w} height={(w * 1000) / 900} viewBox="0 0 900 1000" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="pmPso" x1="0" x2="1">
          <stop offset="0" stopColor="#E6A79B" />
          <stop offset="1" stopColor="#C9786C" />
        </linearGradient>
        <pattern id="pmFib" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-62)">
          <line x1="0" y1="0" x2="0" y2="10" stroke="#9E4F45" strokeWidth={1.4} opacity={0.35} />
        </pattern>
      </defs>
      {/* plexus zones */}
      <rect x={60} y={40} width={820} height={485} rx={40} fill={C.banana} opacity={0.10 + 0.22 * lumbarLit} />
      <rect x={60} y={540} width={820} height={300} rx={40} fill="#9FB4E8" opacity={0.08 + 0.22 * sacralLit} />
      {/* psoas major */}
      <g opacity={psoas}>
        <path d="M640 60 C600 120 560 200 520 300 C480 400 430 500 380 590 C360 630 330 660 310 690 L270 670 C300 620 330 560 360 480 C400 380 450 260 520 140 C545 100 570 70 590 50 Z" fill="url(#pmPso)" stroke={C.forest} strokeWidth={4} opacity={0.55} />
        <path d="M640 60 C600 120 560 200 520 300 C480 400 430 500 380 590 C360 630 330 660 310 690 L270 670 C300 620 330 560 360 480 C400 380 450 260 520 140 C545 100 570 70 590 50 Z" fill="url(#pmFib)" opacity={0.5} />
      </g>
      {/* piriformis */}
      <g opacity={pir}>
        <path d="M640 640 C560 650 470 690 380 720 C330 735 290 745 250 748 L246 790 C300 788 360 776 420 760 C500 740 580 715 640 700 Z" fill="#C9786C" stroke={C.forest} strokeWidth={4} opacity={0.62} />
        <path d="M640 640 C560 650 470 690 380 720 C330 735 290 745 250 748 L246 790 C300 788 360 776 420 760 C500 740 580 715 640 700 Z" fill="url(#pmFib)" opacity={0.45} />
      </g>
      {/* vertebral column (midline side) */}
      {LV.map((v, i) => (
        <g key={v.n} opacity={0.35 + 0.65 * ramp(roots * LV.length, i, i + 1)}>
          <rect x={618} y={v.y - 30} width={150} height={60} rx={16} fill={C.card} stroke={C.forest} strokeWidth={4} />
          <rect x={618} y={v.y + 30} width={150} height={20} rx={6} fill={C.line} stroke={C.forest} strokeWidth={2} opacity={0.8} />
          <text x={693} y={v.y + 12} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill={C.forest}>{v.n}</text>
        </g>
      ))}
      <path d="M620 540 L768 540 L760 600 L745 660 L725 720 L705 780 L690 815 L650 815 L640 780 L630 720 L622 660 Z" fill={C.card} stroke={C.forest} strokeWidth={4} />
      {SV.map((v) => (
        <g key={v.n}>
          <circle cx={640} cy={v.y} r={11} fill={C.line} stroke={C.forest} strokeWidth={3} />
          <text x={700} y={v.y + 11} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={C.forest}>{v.n}</text>
        </g>
      ))}
      <text x={693} y={850} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={22} fill={C.matcha}>sacrum</text>
      {/* root stubs */}
      {[...LV.slice(0, 6), ...SV].map((v) => (
        <path key={v.n} d={`M618 ${v.y} L600 ${v.y + 4}`} stroke={C.forest} strokeWidth={10} strokeLinecap="round" />
      ))}
      {/* nerves */}
      {order.map((k) => (
        <Nerve key={k} k={k} d={PM_D[k]} t={t} lit={lit} grow={grow} dim={dim} w={k === "sci" ? 30 : k === "fem" || k === "obt" || k === "lst" || k === "sacral" ? 17 : 12} col={k === "sacral" ? "#D8C894" : undefined} />
      ))}
      {/* sciatic split hint */}
      {split > 0 && (
        <g opacity={split}>
          <path d="M372 975 C360 990 352 1000 346 1010" stroke={C.forest} strokeWidth={4} fill="none" />
        </g>
      )}
      {/* end labels (small, inside the svg) */}
      {Object.entries(labels).map(([k, tt]) => {
        const p = ramp(t, tt, tt + 0.3);
        if (p <= 0) return null;
        const [x, y] = PM_PT[k];
        return <circle key={k} cx={x} cy={y} r={10 * p} fill={C.forest} stroke={C.paper} strokeWidth={3} />;
      })}
    </svg>
  );
};

/* =====================================================================
   B. LEG MAP — right lower limb, FRONT view (left) and BACK view (right)
   viewBox 900 x 1000. Front view: lateral = viewer's left. Back view: lateral = viewer's right.
   ===================================================================== */
const legOutline = (cx: number, mirror: number) => {
  // mirror = 1 front (lateral on left), -1 back (lateral on right)
  const X = (dx: number) => cx + dx * mirror;
  return `M${X(-120)} 40 C${X(-140)} 120 ${X(-130)} 260 ${X(-95)} 420 C${X(-85)} 470 ${X(-80)} 500 ${X(-78)} 540 C${X(-90)} 600 ${X(-92)} 680 ${X(-70)} 780 C${X(-58)} 840 ${X(-50)} 880 ${X(-46)} 905 C${X(-50)} 940 ${X(-60)} 960 ${X(-62)} 975 L${X(70)} 975 C${X(64)} 950 ${X(52)} 930 ${X(44)} 905 C${X(50)} 870 ${X(66)} 800 ${X(78)} 720 C${X(86)} 660 ${X(80)} 590 ${X(66)} 540 C${X(68)} 500 ${X(76)} 470 ${X(84)} 430 C${X(110)} 300 ${X(120)} 170 ${X(105)} 40 Z`;
};
export const LM_PT: Record<string, [number, number]> = {
  // front view (cx 230)
  fem: [250, 150], saph: [292, 760], obt: [300, 230], lfc: [128, 250], df: [228, 760], sf: [168, 700], thighAnt: [222, 290], thighMed: [300, 330], legAnt: [228, 700], legLat: [165, 640],
  // back view (cx 670)
  sci: [662, 300], tib: [666, 760], cf: [736, 545], sg: [636, 70], ig: [690, 120], pfc: [636, 360], thighPost: [668, 330], legPost: [668, 700], glut: [670, 90],
};
const LM_D: Record<string, string> = {
  fem: "M258 30 C254 80 250 120 250 160 M250 160 C236 200 220 250 212 300 M250 160 C246 210 250 260 246 330 M250 160 C268 210 282 250 286 300",
  saph: "M250 160 C262 260 290 380 302 470 C310 560 300 650 292 760 C288 820 282 860 276 900",
  obt: "M286 30 C292 90 300 150 304 200 M304 200 C312 240 316 290 310 360 M304 200 C292 250 282 300 280 340",
  lfc: "M150 34 C140 80 132 140 128 200 C124 260 120 330 122 400",
  df: "M200 560 C214 600 222 660 226 720 C230 800 232 860 236 920",
  sf: "M186 545 C176 590 166 640 164 700 C164 760 176 830 196 900",
  sci: "M650 120 C656 200 662 300 664 400 C664 440 664 470 664 490",
  tib: "M664 490 C666 560 668 640 668 720 C668 800 664 870 660 930",
  cf: "M664 490 C690 510 716 530 732 548 C744 562 740 575 728 588",
  sg: "M610 52 C640 60 680 62 720 56",
  ig: "M620 110 C650 118 690 120 728 112",
  pfc: "M636 120 C632 220 630 330 634 430 C636 460 640 490 644 520",
};
export const LegMap: React.FC<{ t: number; w: number; lit?: Lit; grow?: Lit; zones?: Lit; show?: string[]; tags?: boolean; dimAll?: boolean }> = ({ t, w, lit = {}, grow = {}, zones = {}, show, tags = true, dimAll = true }) => {
  const dim = dimAll && anyLit(lit, t);
  const z = (k: string) => (zones[k] !== undefined ? ramp(t, zones[k] - 0.1, zones[k] + 0.4) : 0);
  const keys = show || Object.keys(LM_D);
  const zcol: Record<string, string> = { thighAnt: NC.fem, thighMed: NC.obt, thighPost: NC.sci, legAnt: NC.df, legLat: NC.sf, legPost: NC.tib, glut: NC.ig };
  return (
    <svg width={w} height={(w * 1000) / 900} viewBox="0 0 900 1000" style={{ overflow: "visible" }}>
      <defs>
        <clipPath id="lmF"><path d={legOutline(230, 1)} /></clipPath>
        <clipPath id="lmB"><path d={legOutline(670, -1)} /></clipPath>
      </defs>
      {[230, 670].map((cx, i) => (
        <path key={cx} d={legOutline(cx, i === 0 ? 1 : -1)} fill="#F4E3CF" stroke={C.forest} strokeWidth={5} />
      ))}
      {/* compartments (front view) */}
      <g clipPath="url(#lmF)">
        <path d="M100 40 L262 40 L268 520 L120 520 Z" fill={zcol.thighAnt} opacity={0.75 * z("thighAnt")} />
        <path d="M262 40 L360 40 L360 470 L268 470 Z" fill={zcol.thighMed} opacity={0.75 * z("thighMed")} />
        <path d="M195 545 L265 545 L262 980 L200 980 Z" fill={zcol.legAnt} opacity={0.75 * z("legAnt")} />
        <path d="M100 545 L195 545 L200 980 L100 980 Z" fill={zcol.legLat} opacity={0.75 * z("legLat")} />
        {/* knee cap + tibia shaft hint */}
        <ellipse cx={238} cy={512} rx={36} ry={30} fill="#EADBC6" stroke={C.forest} strokeWidth={3} opacity={0.9} />
        <path d="M262 560 C268 700 266 820 258 960" stroke="#D9C6AC" strokeWidth={10} fill="none" />
      </g>
      {/* compartments (back view) */}
      <g clipPath="url(#lmB)">
        <path d="M540 40 L800 40 L800 175 L540 175 Z" fill={zcol.glut} opacity={0.6 * z("glut")} />
        <path d="M540 175 L800 175 L800 520 L540 520 Z" fill={zcol.thighPost} opacity={0.6 * z("thighPost")} />
        <path d="M560 545 L790 545 L790 980 L560 980 Z" fill={zcol.legPost} opacity={0.6 * z("legPost")} />
        <path d="M560 160 C620 185 720 185 790 160" stroke={C.forest} strokeWidth={3} fill="none" opacity={0.5} />
        <path d="M600 470 C640 500 700 500 740 470" stroke={C.forest} strokeWidth={3} fill="none" opacity={0.35} />
      </g>
      {/* nerves */}
      {keys.map((k) => (
        <Nerve key={k} k={k} d={LM_D[k]} t={t} lit={lit} grow={grow} dim={dim} w={k === "sci" ? 22 : k === "tib" || k === "fem" ? 14 : 11} />
      ))}
      {tags && (
        <g fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.matcha} textAnchor="middle">
          <text x={230} y={30} opacity={0}>.</text>
          <text x={230} y={1010}>FRONT</text>
          <text x={670} y={1010}>BACK</text>
          <text x={95} y={1010} fontSize={20}>lateral</text>
          <text x={360} y={1010} fontSize={20}>medial</text>
          <text x={540} y={1010} fontSize={20}>medial</text>
          <text x={805} y={1010} fontSize={20}>lateral</text>
        </g>
      )}
    </svg>
  );
};

/* =====================================================================
   C. THE PIRIFORMIS GATE — greater sciatic foramen, right side, back view (schematic)
   viewBox 900 x 700
   ===================================================================== */
export const GT_PT: Record<string, [number, number]> = {
  pir: [420, 315], sg: [215, 180], ig: [205, 430], sci: [300, 660], pfc: [395, 660], pud: [640, 610], gsf: [470, 140], lsf: [655, 565], spine: [630, 480], sacrum: [800, 200],
};
export const Gate: React.FC<{ t: number; w: number; lit?: Lit; grow?: Lit; pir?: number; hook?: number }> = ({ t, w, lit = {}, grow = {}, pir = 1, hook = 1 }) => {
  const dim = anyLit(lit, t);
  const pud = "M640 260 C630 340 610 420 600 470 C596 500 620 520 660 520 C700 520 720 560 700 640";
  return (
    <svg width={w} height={(w * 700) / 900} viewBox="0 0 900 700" style={{ overflow: "visible" }}>
      <defs>
        <pattern id="gtBone" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx={4} cy={4} r={1.6} fill="#CDB993" />
          <circle cx={11} cy={10} r={1.2} fill="#CDB993" />
        </pattern>
        <pattern id="gtFib" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-18)">
          <line x1="0" y1="0" x2="0" y2="10" stroke="#8F3E35" strokeWidth={1.5} opacity={0.4} />
        </pattern>
      </defs>
      {/* hip bone (ilium + ischium) with the greater and lesser sciatic notches */}
      {[0, 1].map((k) => (
        <path key={k} d="M110 70 C240 10 450 20 560 80 C575 110 572 140 560 160 C470 180 405 255 408 340 C412 415 480 452 590 452 L640 478 L590 494 C560 520 552 575 570 615 C575 665 520 700 450 690 C380 680 330 620 300 560 C250 520 200 470 170 400 C130 300 90 180 110 70 Z" fill={k === 0 ? "#EDE0C4" : "url(#gtBone)"} stroke={k === 0 ? C.forest : "none"} strokeWidth={5} />
      ))}
      <path d="M130 90 C250 50 420 55 520 100" stroke="#CDB993" strokeWidth={8} fill="none" opacity={0.7} />
      {/* femur head in the acetabulum + greater trochanter */}
      <circle cx={250} cy={520} r={62} fill="#F6EDD8" stroke={C.forest} strokeWidth={5} />
      <path d="M200 500 C160 470 140 420 150 360 C170 330 215 335 222 370 C226 410 236 450 262 470 Z" fill="#F6EDD8" stroke={C.forest} strokeWidth={5} />
      <text x={150} y={415} fontFamily={FONT} fontWeight={800} fontSize={18} fill={C.forest} opacity={0.6}>femur</text>
      {/* sacrum with foramina */}
      {[0, 1].map((k) => (
        <path key={k} d="M600 40 C700 26 800 36 865 70 L846 330 C805 400 745 440 700 462 C682 400 662 330 632 262 C612 200 592 120 600 40 Z" fill={k === 0 ? "#EDE0C4" : "url(#gtBone)"} stroke={k === 0 ? C.forest : "none"} strokeWidth={5} />
      ))}
      {[110, 180, 250, 320].map((y, i) => <ellipse key={y} cx={735 + i * 8} cy={y} rx={20} ry={14} fill="#D8C7A0" stroke={C.forest} strokeWidth={3} />)}
      <text x={790} y={420} fontFamily={FONT} fontWeight={800} fontSize={22} fill={C.forest} opacity={0.6}>sacrum</text>
      {/* sacrospinous + sacrotuberous ligaments */}
      <path d="M632 482 C700 470 770 440 830 380" stroke="#B9A57E" strokeWidth={16} fill="none" strokeLinecap="round" />
      <path d="M470 680 C620 600 760 480 845 340" stroke="#B9A57E" strokeWidth={22} fill="none" strokeLinecap="round" opacity={0.9} />
      {/* nerves under the muscle */}
      <Nerve k="sci" d="M600 250 C520 300 420 360 360 430 C320 480 305 560 300 660" t={t} lit={lit} grow={grow} dim={dim} w={40} />
      <Nerve k="pfc" d="M610 270 C540 330 460 400 420 460 C400 520 396 600 395 660" t={t} lit={lit} grow={grow} dim={dim} w={12} />
      <Nerve k="ig" d="M600 240 C520 300 420 360 330 410 C280 430 240 430 205 430" t={t} lit={lit} grow={grow} dim={dim} w={14} />
      {hook > 0 && <Nerve k="pud" d={pud} t={t} lit={lit} grow={grow} dim={dim} w={13} />}
      {/* piriformis */}
      <g opacity={pir}>
        <path d="M720 170 C640 200 560 240 470 270 C400 292 300 300 200 330 L206 372 C320 352 420 342 490 320 C580 292 660 260 740 230 Z" fill="#C9786C" stroke={C.forest} strokeWidth={5} />
        <path d="M720 170 C640 200 560 240 470 270 C400 292 300 300 200 330 L206 372 C320 352 420 342 490 320 C580 292 660 260 740 230 Z" fill="url(#gtFib)" />
      </g>
      {/* superior gluteal above the muscle */}
      <Nerve k="sg" d="M640 160 C560 170 470 190 380 200 C300 205 250 195 210 180" t={t} lit={lit} grow={grow} dim={dim} w={14} />
    </svg>
  );
};

/* =====================================================================
   D. CROSS-SECTIONS — thigh (3 compartments) and leg (3 compartments)
   viewBox 600 x 520
   ===================================================================== */
export const XS_PT: Record<string, [number, number]> = {
  thighAnt: [300, 150], thighMed: [430, 300], thighPost: [260, 400],
  legAnt: [330, 160], legLat: [150, 250], legPost: [300, 390],
};
export const CrossSec: React.FC<{ t: number; w: number; which: "thigh" | "leg"; zones?: Lit; title?: boolean }> = ({ t, w, which, zones = {}, title = true }) => {
  const z = (k: string) => (zones[k] !== undefined ? ramp(t, zones[k] - 0.1, zones[k] + 0.4) : 0);
  const pulse = (k: string) => (zones[k] !== undefined && t >= zones[k] ? 1 + 0.12 * Math.sin((t - zones[k]) * 6) : 1);
  const comp = (k: string, d: string, col: string, nerve: [number, number]) => (
    <g key={k}>
      <path d={d} fill={col} opacity={0.18 + 0.72 * z(k)} stroke={C.forest} strokeWidth={4} />
      <circle cx={nerve[0]} cy={nerve[1]} r={16 * pulse(k)} fill={z(k) > 0 ? col : "#E9CF7A"} stroke={C.forest} strokeWidth={4} />
      <circle cx={nerve[0] - 4} cy={nerve[1] - 5} r={5} fill="rgba(255,255,255,0.7)" />
    </g>
  );
  return (
    <svg width={w} height={(w * 520) / 600} viewBox="0 0 600 520" style={{ overflow: "visible" }}>
      {which === "thigh" ? (
        <g>
          <path d="M300 40 C440 40 560 140 560 270 C560 400 440 490 300 490 C160 490 40 400 40 270 C40 140 160 40 300 40 Z" fill="#F4E3CF" stroke={C.forest} strokeWidth={6} />
          {comp("thighAnt", "M70 230 C80 120 190 52 300 52 C420 52 520 130 545 230 C470 250 390 240 300 240 C220 240 140 250 70 230 Z", NC.fem, [300, 120])}
          {comp("thighMed", "M545 230 C560 300 540 380 480 430 C430 380 380 330 330 290 C390 265 470 250 545 230 Z", NC.obt, [470, 330])}
          {comp("thighPost", "M70 230 C140 250 220 260 330 290 C380 330 430 380 480 430 C420 470 360 480 300 480 C170 480 60 400 70 230 Z", NC.sci, [250, 400])}
          <circle cx={300} cy={262} r={44} fill="#FFFDF2" stroke={C.forest} strokeWidth={6} />
          <circle cx={300} cy={262} r={18} fill="#EBD9A8" />
          <text x={300} y={340} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={22} fill={C.forest}>femur</text>
          {title && <text x={300} y={30} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.matcha}>THIGH · cross-section</text>}
        </g>
      ) : (
        <g>
          <path d="M300 50 C420 50 520 120 530 240 C540 380 430 480 300 480 C170 480 70 390 70 260 C70 140 170 50 300 50 Z" fill="#F4E3CF" stroke={C.forest} strokeWidth={6} />
          {comp("legAnt", "M240 90 C300 60 380 70 440 120 C470 150 480 190 470 220 C420 230 380 225 330 215 C300 180 270 140 240 90 Z", NC.df, [370, 150])}
          {comp("legLat", "M240 90 C270 140 300 180 330 215 C260 230 200 250 150 290 C100 260 80 200 110 150 C140 110 190 90 240 90 Z", NC.sf, [160, 200])}
          {comp("legPost", "M150 290 C200 250 260 230 330 215 C380 225 420 230 470 220 C520 260 520 360 470 420 C420 470 360 478 300 478 C200 478 130 400 150 290 Z", NC.tib, [320, 380])}
          <path d="M340 160 C380 150 420 170 425 200 C430 240 400 262 370 262 C340 262 318 240 318 210 C318 185 325 168 340 160 Z" fill="#FFFDF2" stroke={C.forest} strokeWidth={6} />
          <text x={372} y={300} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={22} fill={C.forest}>tibia</text>
          <circle cx={215} cy={255} r={24} fill="#FFFDF2" stroke={C.forest} strokeWidth={5} />
          <text x={215} y={312} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={22} fill={C.forest}>fibula</text>
          {title && <text x={300} y={30} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.matcha}>LEG · cross-section</text>}
        </g>
      )}
    </svg>
  );
};

/* =====================================================================
   E. FOOT — side view (dorsiflexion / plantarflexion) and front view (eversion / inversion)
   viewBox 500 x 400
   ===================================================================== */
export const FootSide: React.FC<{ w: number; ang: number; col?: string }> = ({ w, ang, col = "#F4E3CF" }) => (
  <svg width={w} height={(w * 400) / 500} viewBox="0 0 500 400" style={{ overflow: "visible" }}>
    <path d="M190 0 L270 0 L276 230 L190 240 Z" fill={col} stroke={C.forest} strokeWidth={5} />
    <g transform={`rotate(${-ang} 232 240)`}>
      <path d="M180 220 C176 270 180 300 200 312 C260 320 360 320 440 330 C470 334 478 300 450 290 C390 268 330 250 284 222 Z" fill={col} stroke={C.forest} strokeWidth={5} />
      <circle cx={232} cy={240} r={10} fill={C.forest} />
    </g>
    <path d="M330 120 A120 120 0 0 1 350 300" stroke={C.matcha} strokeWidth={6} fill="none" strokeDasharray="10 10" opacity={0.6} />
  </svg>
);
export const FootFront: React.FC<{ w: number; ang: number; col?: string }> = ({ w, ang, col = "#F4E3CF" }) => (
  <svg width={w} height={(w * 400) / 500} viewBox="0 0 500 400" style={{ overflow: "visible" }}>
    <path d="M205 0 L295 0 C300 80 302 150 300 210 L200 210 C198 150 200 80 205 0 Z" fill={col} stroke={C.forest} strokeWidth={5} />
    <path d="M250 20 L250 190" stroke="#D9C6AC" strokeWidth={6} />
    <g transform={`rotate(${ang} 250 215)`}>
      <path d="M198 200 C186 250 176 292 192 322 C214 352 288 352 310 322 C326 292 314 250 302 200 Z" fill={col} stroke={C.forest} strokeWidth={5} />
      <path d="M186 344 L314 344" stroke={C.red} strokeWidth={10} strokeLinecap="round" />
      <circle cx={250} cy={215} r={9} fill={C.forest} />
    </g>
    <text x={250} y={395} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={C.forest}>heel from behind · red = sole</text>
  </svg>
);
