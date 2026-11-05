import React from "react";
import { C, FONT } from "./kit";

/* Book Plume original skull diagram, left lateral view (facing left), viewBox 1000 x 930.
   Proportions traced from the layout of Gray's 1918 Fig. 188 (public domain) so labels match the plate. */
type P = [number, number];
export type Bone = "O" | "P" | "F" | "T" | "E" | "S";
export const BONE_COL: Record<Bone, string> = { O: C.matcha, P: C.banana, F: "#E8796B", T: "#6F9DB3", E: "#C9483C", S: "#E39A3B" };
export const BONE_NAME: Record<Bone, string> = { O: "Occipital", P: "Parietal", F: "Frontal", T: "Temporal", E: "Ethmoid", S: "Sphenoid" };
export const ORDER: Bone[] = ["O", "P", "F", "T", "E", "S"];
const BASE = "#F1EBD3", BASE_D = "#D9CFAC", FACE = "#E7E3D2", FACE_D = "#CFCAB4";

export const mix = (a: string, b: string, k: number) => {
  const h = (s: string) => [1, 3, 5].map((j) => parseInt(s.slice(j, j + 2), 16));
  const x = h(a), y = h(b);
  return "#" + x.map((v, j) => Math.round(v + (y[j] - v) * Math.max(0, Math.min(1, k))).toString(16).padStart(2, "0")).join("");
};

/* Catmull-Rom → cubic Bézier path */
const smooth = (pts: P[], closed = true, tension = 0.5) => {
  const n = pts.length;
  const g = (i: number) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
    const c1: P = [p1[0] + ((p2[0] - p0[0]) * tension) / 3, p1[1] + ((p2[1] - p0[1]) * tension) / 3];
    const c2: P = [p2[0] - ((p3[0] - p1[0]) * tension) / 3, p2[1] - ((p3[1] - p1[1]) * tension) / 3];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + (closed ? " Z" : "");
};
/* jagged suture line along a polyline (deterministic) */
const zig = (pts: P[], amp = 7, step = 11) => {
  const out: P[] = [];
  let k = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const [a, b] = [pts[i], pts[i + 1]];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const nx = -(b[1] - a[1]) / L, ny = (b[0] - a[0]) / L;
    const m = Math.max(1, Math.round(L / step));
    for (let j = 0; j < m; j++) {
      const u = j / m;
      const s = (k++ % 2 ? 1 : -1) * amp * (0.6 + 0.4 * Math.abs(Math.sin(k * 1.7)));
      out.push([a[0] + (b[0] - a[0]) * u + nx * s, a[1] + (b[1] - a[1]) * u + ny * s]);
    }
  }
  out.push(pts[pts.length - 1]);
  return "M" + out.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L");
};

/* ---- key lines (shared borders) ---- */
const N: P = [125, 352];
const FOREHEAD: P[] = [N, [116, 300], [132, 235], [175, 165], [240, 105], [320, 58], [420, 28], [525, 20]];
const COR: P[] = [[525, 20], [505, 70], [470, 120], [440, 162], [412, 210], [397, 262], [388, 325]];
const VAULT: P[] = [[525, 20], [600, 12], [690, 22], [790, 58], [880, 118], [945, 200], [982, 290], [990, 330]];
const LAM: P[] = [[990, 330], [955, 390], [910, 445], [865, 495], [825, 530], [785, 548]];
const SQ: P[] = [[465, 335], [520, 318], [600, 316], [650, 330], [676, 352], [700, 385], [725, 410], [752, 440], [742, 475], [748, 520], [785, 548]];
const BACK: P[] = [[990, 330], [1000, 410], [990, 500], [965, 580], [930, 635], [880, 675], [820, 698], [770, 702]];

const FRONTAL: P[] = [...FOREHEAD, ...COR.slice(1), [330, 338], [300, 370], [292, 410], [270, 420], [258, 385], [228, 352], [188, 337], [150, 340]];
const PARIETAL: P[] = [...VAULT, ...LAM.slice(1), ...[...SQ].reverse().slice(1), [388, 325], ...[...COR].reverse().slice(1, -1)];
const OCCIPITAL: P[] = [...BACK, [735, 690], [728, 660], [730, 612], [765, 580], ...[...LAM].reverse().slice(0, -1)];
const TEMPORAL: P[] = [...SQ, [765, 580], [730, 612], [728, 660], [690, 690], [650, 705], [622, 704], [604, 680], [598, 645], [560, 628], [528, 600], [506, 562], [478, 552], [362, 556], [340, 548], [337, 528], [352, 517], [420, 516], [385, 495], [398, 450], [425, 405]];
const SPHENOID: P[] = [[388, 325], [465, 335], [425, 405], [398, 450], [385, 495], [352, 500], [325, 480], [305, 430], [300, 370], [330, 338]];
const ORBIT: P[] = [[150, 342], [190, 337], [230, 352], [258, 385], [270, 420], [266, 462], [246, 492], [210, 503], [175, 494], [150, 470], [139, 430], [139, 385]];
const ETHMOID: P[] = [[184, 400], [214, 394], [238, 408], [240, 446], [212, 457], [188, 452]];
const LACRIMAL: P[] = [[154, 404], [184, 400], [188, 452], [162, 458]];
const ZYGO: P[] = [[270, 420], [292, 410], [305, 430], [325, 480], [352, 500], [346, 518], [330, 536], [345, 553], [332, 578], [282, 588], [228, 578], [202, 545], [206, 505], [246, 492], [266, 462]];
const NASAL: P[] = [N, [140, 362], [140, 386], [72, 420], [50, 414], [62, 398], [104, 370]];
const MAXILLA: P[] = [[140, 386], [156, 463], [175, 494], [206, 505], [202, 545], [228, 578], [282, 588], [332, 578], [322, 615], [305, 650], [300, 690], [40, 690], [45, 655], [60, 625], [48, 565], [52, 500], [60, 440], [72, 420]];
const MANDIBLE: P[] = [[34, 742], [298, 742], [338, 690], [362, 625], [380, 565], [402, 602], [442, 616], [482, 602], [515, 584], [542, 596], [536, 630], [516, 662], [506, 740], [500, 818], [484, 862], [430, 882], [330, 896], [200, 910], [92, 906], [46, 882], [26, 822]];
const HOLE: P[] = [[350, 556], [480, 556], [502, 600], [470, 640], [408, 632], [368, 602]];

/* centroids / label anchors (diagram coords) */
export const ANCHOR: Record<Bone, P> = { O: [905, 560], P: [690, 200], F: [255, 230], T: [590, 440], E: [211, 427], S: [370, 420] };
export const FM: P = [664, 712]; // foramen magnum (projected, hidden on this view)

const HATCH = (id: string, col: string, ang: number, gap = 7, op = 0.22) => (
  <pattern id={id} width={gap} height={gap} patternUnits="userSpaceOnUse" patternTransform={`rotate(${ang})`}>
    <line x1={0} y1={0} x2={0} y2={gap} stroke={col} strokeWidth={1.4} opacity={op} />
  </pattern>
);
const PATHS: Record<Bone, P[]> = { O: OCCIPITAL, P: PARIETAL, F: FRONTAL, T: TEMPORAL, E: ETHMOID, S: SPHENOID };

export const SkullSide: React.FC<{
  w: number;
  lit?: Partial<Record<Bone, number>>; // 0..1 colour fill
  dimOthers?: number; // 0..1 fade everything that is not lit
  glow?: Partial<Record<Bone, number>>; // pulse ring
  face?: number; // facial bones opacity multiplier
  fm?: number; // foramen magnum + spinal cord reveal 0..1
  orbitZoom?: number;
}> = ({ w, lit = {}, dimOthers = 0, glow = {}, face = 1, fm = 0 }) => {
  const h = (w * 930) / 1000;
  const sw = 4.2;
  const boneFill = (b: Bone) => {
    const L = lit[b] ?? 0;
    return mix(BASE, BONE_COL[b], 0.88 * L);
  };
  const boneOp = (b: Bone) => {
    const L = lit[b] ?? 0;
    return 1 - dimOthers * 0.55 * (1 - L);
  };
  const faceOp = (1 - dimOthers * 0.55) * face;
  const order: Bone[] = ["P", "O", "T", "F", "S"];
  return (
    <svg width={w} height={h} viewBox="0 0 1000 930" style={{ overflow: "visible" }}>
      <defs>
        {HATCH("hB", C.forest, 35, 7, 0.13)}
        {HATCH("hF", C.forest, -30, 8, 0.12)}
        <radialGradient id="shade" cx="38%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#fff" stopOpacity={0.55} />
          <stop offset="55%" stopColor="#fff" stopOpacity={0} />
          <stop offset="100%" stopColor={C.forest} stopOpacity={0.22} />
        </radialGradient>
        <radialGradient id="orb" cx="55%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#0d1309" />
          <stop offset="100%" stopColor="#3a4a2a" />
        </radialGradient>
        <linearGradient id="cord" x1="0" x2="1">
          <stop offset="0%" stopColor="#E9E2C4" />
          <stop offset="50%" stopColor="#FFF9E2" />
          <stop offset="100%" stopColor="#D8CDA8" />
        </linearGradient>
        <clipPath id="skullClip">
          <path d={smooth([...FOREHEAD, ...VAULT.slice(1), ...BACK.slice(1), [735, 690], [650, 705], [540, 600], [345, 553], [332, 578], [300, 690], [40, 690], [48, 565], [60, 440], [50, 414]], true, 0.35)} />
        </clipPath>
      </defs>
      {/* soft drop shadow */}
      <ellipse cx={520} cy={918} rx={430} ry={18} fill={C.forest} opacity={0.12} />
      {/* spinal cord (behind) */}
      {fm > 0 && (
        <g opacity={fm}>
          <rect x={FM[0] - 30} y={FM[1]} width={60} height={240 * fm} rx={28} fill="url(#cord)" stroke={C.forest} strokeWidth={sw} />
          
        </g>
      )}
      {/* infratemporal gap below the zygomatic arch */}
      <path d={smooth(HOLE, true, 0.4)} fill="url(#orb)" stroke={C.forest} strokeWidth={sw} opacity={faceOp} />
      {/* facial skeleton (muted) */}
      <g opacity={faceOp}>
        <path d={smooth(MANDIBLE, true, 0.35)} fill={FACE} stroke={C.forest} strokeWidth={sw} strokeLinejoin="round" />
        <path d={smooth(MANDIBLE, true, 0.35)} fill="url(#hF)" />
        <circle cx={112} cy={852} r={9} fill={C.forest} opacity={0.7} />
        <path d={smooth(MAXILLA, true, 0.3)} fill={FACE} stroke={C.forest} strokeWidth={sw} strokeLinejoin="round" />
        <path d={smooth(MAXILLA, true, 0.3)} fill="url(#hF)" />
        <path d="M58 430 Q86 470 70 520 Q60 548 48 560" fill="none" stroke={C.forest} strokeWidth={3} opacity={0.5} />
        <circle cx={150} cy={520} r={8} fill={C.forest} opacity={0.6} />
        {/* teeth */}
        {Array.from({ length: 9 }).map((_, i) => {
          const x = 44 + i * 28.5, wd = i < 2 ? 22 : i < 4 ? 24 : 27;
          return (
            <g key={i}>
              <path d={`M${x} 682 L${x + wd} 682 L${x + wd - 1} 712 Q${x + wd / 2} 726 ${x + 1} 712 Z`} fill="#FFFDF4" stroke={C.forest} strokeWidth={3} strokeLinejoin="round" />
              <path d={`M${x + 1} 784 L${x + wd - 1} 784 L${x + wd} 752 Q${x + wd / 2} 738 ${x} 752 Z`} fill="#FFFDF4" stroke={C.forest} strokeWidth={3} strokeLinejoin="round" />
            </g>
          );
        })}
        <path d={smooth(NASAL, true, 0.3)} fill={FACE_D} stroke={C.forest} strokeWidth={sw} strokeLinejoin="round" />
        <path d={smooth(ZYGO, true, 0.3)} fill={FACE} stroke={C.forest} strokeWidth={sw} strokeLinejoin="round" />
        <path d={smooth(ZYGO, true, 0.3)} fill="url(#hF)" />
        {/* styloid + mastoid detail */}
        <path d="M560 652 L506 736 L514 738 L568 660 Z" fill={FACE} stroke={C.forest} strokeWidth={3} strokeLinejoin="round" />
      </g>
      {/* cranial bones */}
      {order.map((b) => (
        <g key={b} opacity={boneOp(b)}>
          <path d={smooth(PATHS[b], true, b === "S" ? 0.3 : 0.4)} fill={boneFill(b)} stroke={C.forest} strokeWidth={sw} strokeLinejoin="round" />
          <path d={smooth(PATHS[b], true, b === "S" ? 0.3 : 0.4)} fill="url(#hB)" />
        </g>
      ))}
      {/* orbit + medial wall (lacrimal, ethmoid) */}
      <g>
        <path d={smooth(ORBIT, true, 0.45)} fill="url(#orb)" stroke={C.forest} strokeWidth={sw} />
        <path d={smooth(LACRIMAL, true, 0.2)} fill={mix(FACE_D, "#8d8a78", 0.2)} stroke={C.forest} strokeWidth={3} opacity={faceOp} />
        <g opacity={boneOp("E")}>
          <path d={smooth(ETHMOID, true, 0.2)} fill={mix("#CFC7A6", BONE_COL.E, 0.92 * (lit.E ?? 0))} stroke={C.forest} strokeWidth={3.4} />
          <path d={smooth(ETHMOID, true, 0.2)} fill="url(#hB)" />
        </g>
      </g>
      {/* ear canal */}
      <ellipse cx={575} cy={594} rx={27} ry={31} fill="url(#orb)" stroke={C.forest} strokeWidth={sw} />
      {/* volume shading over the cranium */}
      <path d={smooth([...FOREHEAD, ...VAULT.slice(1), ...BACK.slice(1), [735, 690], [650, 705], [540, 600], [345, 553], [300, 370], [258, 385], [150, 340]], true, 0.35)} fill="url(#shade)" style={{ mixBlendMode: "multiply" }} opacity={0.8} />
      {/* sutures */}
      <g fill="none" stroke={C.forest} strokeWidth={2.6} strokeLinejoin="round" opacity={0.8}>
        <path d={zig(COR, 3.5, 8)} />
        <path d={zig(LAM, 4.5, 9)} />
        <path d={zig(SQ.slice(0, 4), 3, 14)} />
      </g>
      {/* temporal lines */}
      <path d={smooth([[230, 262], [320, 168], [470, 108], [630, 100], [775, 150], [865, 240], [905, 330]], false)} fill="none" stroke={C.forest} strokeWidth={2.5} strokeDasharray="3 9" strokeLinecap="round" opacity={0.45} />
      <path d={smooth([[262, 300], [360, 205], [495, 150], [640, 142], [760, 190], [835, 270], [870, 350]], false)} fill="none" stroke={C.forest} strokeWidth={2.5} strokeDasharray="3 9" strokeLinecap="round" opacity={0.35} />
      {/* glow rings */}
      {ORDER.map((b) => {
        const g = glow[b] ?? 0;
        if (g <= 0) return null;
        return <path key={"g" + b} d={smooth(PATHS[b], true, b === "S" ? 0.3 : 0.4)} fill="none" stroke={BONE_COL[b]} strokeWidth={10 + 16 * g} opacity={0.55 * (1 - g)} strokeLinejoin="round" />;
      })}
      {/* foramen magnum (hidden structure, dashed) */}
      {fm > 0 && (
        <g opacity={fm}>
          <ellipse cx={FM[0]} cy={FM[1]} rx={64} ry={16} fill={C.banana} fillOpacity={0.35} stroke={C.red} strokeWidth={6} strokeDasharray="14 9" />
          <path d={`M${FM[0]} ${FM[1] - 18} L${FM[0]} ${FM[1] - 150}`} stroke={C.red} strokeWidth={5} strokeDasharray="10 10" opacity={0.7} />
        </g>
      )}
    </svg>
  );
};

/* ---- superior view (norma verticalis), front at top, viewBox 520 x 700 ---- */
const TOP: P[] = [[260, 36], [345, 52], [412, 110], [458, 210], [482, 330], [484, 440], [462, 545], [410, 625], [330, 668], [260, 676], [190, 668], [110, 625], [58, 545], [36, 440], [38, 330], [62, 210], [108, 110], [175, 52]];
export const SkullTop: React.FC<{ w: number; litP?: number; litF?: number; litO?: number; split?: number }> = ({ w, litP = 0, litF = 0, litO = 0, split = 0 }) => {
  const h = (w * 700) / 520;
  const sw = 4;
  const bf = (c: string, k: number) => mix(BASE, c, 0.88 * k);
  const outline = smooth(TOP, true, 0.5);
  const s = split * 14; // parietals slide apart a little to show they are 2 bones
  return (
    <svg width={w} height={h} viewBox="0 0 520 700" style={{ overflow: "visible" }}>
      <defs>
        <clipPath id="topClip"><path d={outline} /></clipPath>
        {HATCH("hT", C.forest, 35, 7, 0.13)}
        <radialGradient id="tshade" cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#fff" stopOpacity={0.5} />
          <stop offset="60%" stopColor="#fff" stopOpacity={0} />
          <stop offset="100%" stopColor={C.forest} stopOpacity={0.25} />
        </radialGradient>
      </defs>
      <ellipse cx={260} cy={690} rx={200} ry={14} fill={C.forest} opacity={0.12} />
      <g clipPath="url(#topClip)">
        <rect x={0} y={0} width={520} height={250} fill={bf(BONE_COL.F, litF)} />
        <g transform={`translate(${-s} 0)`}>
          <path d="M0 230 Q130 262 260 250 L260 560 L120 600 L0 640 Z" fill={bf(BONE_COL.P, litP)} />
        </g>
        <g transform={`translate(${s} 0)`}>
          <path d="M520 230 Q390 262 260 250 L260 560 L400 600 L520 640 Z" fill={bf(BONE_COL.P, litP)} />
        </g>
        <path d="M0 640 L120 600 L260 560 L400 600 L520 640 L520 700 L0 700 Z" fill={bf(BONE_COL.O, litO)} />
        <rect x={0} y={0} width={520} height={700} fill="url(#hT)" />
        <rect x={0} y={0} width={520} height={700} fill="url(#tshade)" />
        <g fill="none" stroke={C.forest} strokeWidth={3.2} opacity={0.9}>
          <path d={zig([[20, 236], [130, 258], [260, 250], [390, 258], [500, 236]], 5, 10)} />
          <path d={zig([[260, 252], [260, 400], [260, 560]], 6, 10)} transform={`translate(${-s} 0)`} />
          {split > 0 && <path d={zig([[260, 252], [260, 400], [260, 560]], 6, 10)} transform={`translate(${s} 0)`} />}
          <path d={zig([[30, 645], [120, 602], [260, 562], [400, 602], [490, 645]], 7, 11)} />
        </g>
        {split > 0 && <rect x={260 - s} y={252} width={2 * s} height={310} fill={C.paper} />}
        {/* parietal foramina */}
        <circle cx={240 - s} cy={500} r={4} fill={C.forest} opacity={0.6} />
        <circle cx={280 + s} cy={500} r={4} fill={C.forest} opacity={0.6} />
      </g>
      <path d={outline} fill="none" stroke={C.forest} strokeWidth={sw + 1} />
      <text x={260} y={22} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.forest} opacity={0.6}>▲ FRONT</text>
    </svg>
  );
};
