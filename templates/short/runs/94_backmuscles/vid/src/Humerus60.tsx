import React from "react";
import { C, ramp } from "./kit";

/**
 * Book Plume original schematic: proximal LEFT humerus, ANTERIOR view (same orientation as Gray's 1918 Fig. 207).
 * Viewer's right = LATERAL (greater tubercle), viewer's left = MEDIAL (humeral head, toward the body). viewBox 860 x 860.
 * Insertions: pectoralis major = lateral lip, latissimus dorsi = floor, teres major = medial lip ("a lady between two majors").
 */
export type Part = "HUM" | "HEAD" | "GT" | "LT" | "GRV" | "TEN" | "LIG" | "LAT" | "PEC" | "TER" | "LLIP" | "MLIP";
type P = [number, number];

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
export const mix = (a: string, b: string, k: number) => {
  const h = (s: string) => [1, 3, 5].map((j) => parseInt(s.slice(j, j + 2), 16));
  const x = h(a), y = h(b);
  return "#" + x.map((v, j) => Math.round(v + (y[j] - v) * Math.max(0, Math.min(1, k))).toString(16).padStart(2, "0")).join("");
};

/* ---------- geometry ---------- */
const BONE: P[] = [
  [300, 58], [384, 66], [446, 92], [506, 104], [566, 112], [624, 138], [656, 190], [660, 256], [642, 318], [624, 392], [614, 470], [606, 580], [600, 720], [598, 900],
  [404, 900], [404, 720], [400, 590], [392, 488], [376, 416], [344, 366], [282, 360], [210, 340], [162, 290], [146, 214], [164, 140], [222, 84],
];
const HEAD: P[] = [[300, 58], [384, 66], [436, 92], [420, 160], [384, 230], [334, 292], [270, 334], [208, 330], [164, 286], [148, 214], [166, 140], [222, 84]];
const ANAT_NECK: P[] = [[440, 96], [420, 170], [384, 236], [330, 298], [262, 340], [200, 334]];
const GT: P[] = [[478, 108], [566, 114], [626, 142], [654, 196], [652, 262], [628, 324], [598, 344], [578, 296], [566, 230], [540, 168], [506, 132]];
const LT: P[] = [[428, 196], [462, 182], [490, 206], [496, 254], [484, 302], [458, 318], [430, 296], [418, 248]];
const GROOVE: P[] = [[496, 176], [540, 170], [566, 214], [574, 300], [572, 420], [562, 540], [544, 610], [522, 560], [508, 430], [500, 300]];
const LLIP: P[] = [[586, 330], [584, 420], [578, 520], [568, 630]]; // crest of greater tubercle
const MLIP: P[] = [[492, 316], [484, 420], [476, 530], [468, 640]]; // crest of lesser tubercle
const FOOT: Record<"PEC" | "LAT" | "TER", P[]> = {
  PEC: [[586, 326], [584, 420], [578, 520], [566, 660]],
  LAT: [[534, 330], [532, 410], [528, 490], [524, 560]],
  TER: [[480, 400], [476, 480], [470, 560], [462, 650]],
};
const TENDON = "M228 -40 C330 0 470 70 522 170 C536 200 534 260 534 330 L532 560 C532 640 540 740 548 900";
const LIG = "M484 236 C510 246 548 252 582 246";
const GLENOID: P[] = [[96, 70], [132, 110], [148, 200], [142, 290], [118, 350], [86, 380]];
const SHAFT_HATCH = ["M424 470 C426 560 428 680 430 860", "M444 500 C446 600 448 720 452 860", "M584 640 C584 720 582 800 580 860", "M566 680 C566 760 566 820 564 860"];

export const ANCHOR: Record<string, P> = {
  HEAD: [262, 200], GT: [612, 210], LT: [456, 250], GRV: [536, 250], TEN: [532, 300], LIG: [534, 246], HUM: [500, 720],
  PEC: [580, 480], LAT: [530, 450], TER: [472, 540], LLIP: [584, 420], MLIP: [484, 420], FLOOR: [530, 470],
};

const MUS: Record<"PEC" | "LAT" | "TER", { fill: string; dark: string; light: string }> = {
  PEC: { fill: "#D8574B", dark: "#9C3127", light: "#F4A497" },
  LAT: { fill: "#E0A43A", dark: "#9A6A12", light: "#FFE08F" },
  TER: { fill: "#5E8FB0", dark: "#2F5E7E", light: "#A9D0E8" },
};
export const MCOL = { PEC: MUS.PEC.fill, LAT: MUS.LAT.fill, TER: MUS.TER.fill };

export const HumerusDiagram: React.FC<{
  t: number;
  w?: number;
  lit?: Partial<Record<Part, number>>;
  glow?: Part[];
  dim?: number;
  tendon?: number; // 0..1 tendon opacity
  tendonGrow?: number; // time the tendon slides in
  feet?: number; // 0..1 faint footprints before lit
  lips?: number; // 0..1 lip ridges emphasised
  id?: string;
}> = ({ t, w = 860, lit = {}, glow = [], dim = 0, tendon = 1, tendonGrow, feet = 0, lips = 0, id = "h" }) => {
  const on = (p: Part) => (lit[p] === undefined ? 0 : ramp(t, lit[p]! - 0.05, lit[p]! + 0.3));
  const halo = (p: Part) => (glow.includes(p) ? on(p) * (0.6 + 0.4 * Math.sin(t * 7)) : 0);
  const boneL = Math.max(on("HUM"), 1 - dim);
  const boneFill = mix("#EBE4CC", "#F3E7C4", boneL);
  const tg = tendonGrow === undefined ? 1 : ramp(t, tendonGrow, tendonGrow + 1.1);
  const part = (pid: Part, pts: P[], fill: string, stroke: string, sw = 5) => {
    const L = on(pid), h = halo(pid);
    return (
      <g>
        {h > 0 && <path d={smooth(pts)} fill="none" stroke={C.banana} strokeWidth={26} strokeLinejoin="round" opacity={h} />}
        <path d={smooth(pts)} fill="#A8936A" opacity={0.35} transform="translate(6 8)" />
        <path d={smooth(pts)} fill={`url(#${id}tub)`} stroke={mix("#A08C5E", stroke, 0.2 + 0.5 * L)} strokeWidth={sw * (0.6 + 0.4 * L)} strokeLinejoin="round" />
        {L > 0 && <path d={smooth(pts)} fill={fill} opacity={0.25 * L} />}
      </g>
    );
  };
  const foot = (m: "PEC" | "LAT" | "TER") => {
    const L = on(m);
    const a = Math.max(L, feet * 0.35);
    if (a <= 0) return null;
    const d = smooth(FOOT[m], false);
    const c = MUS[m];
    const h = halo(m);
    // fibres fanning off the footprint (toward the body = medial = viewer's left)
    const fib = FOOT[m].map(([x, y], i) => `M${x} ${y} C${x - 40} ${y + 10} ${x - 90} ${y + 30 + i * 6} ${x - 150 - i * 10} ${y + 70 + i * 10}`);
    return (
      <g opacity={a}>
        {h > 0 && <path d={d} fill="none" stroke={C.banana} strokeWidth={62} strokeLinecap="round" opacity={h} />}
        <path d={d} fill="none" stroke={C.forest} strokeWidth={40} strokeLinecap="round" />
        <path d={d} fill="none" stroke={c.dark} strokeWidth={33} strokeLinecap="round" />
        <path d={d} fill="none" stroke={c.fill} strokeWidth={24} strokeLinecap="round" />
        {[-7, 0, 7].map((o, i) => (
          <path key={i} d={d} fill="none" stroke={c.light} strokeWidth={2.4} strokeLinecap="round" strokeDasharray="14 10" strokeDashoffset={i * 7} transform={`translate(${o} 0)`} opacity={0.75} />
        ))}
        {L > 0 && m !== "PEC" && (
          <g opacity={0.0}>{fib.map((f, i) => <path key={i} d={f} stroke={c.fill} strokeWidth={6} fill="none" />)}</g>
        )}
      </g>
    );
  };
  const lip = (pid: Part, pts: P[]) => {
    const L = Math.max(on(pid), lips);
    if (L <= 0) return null;
    const h = halo(pid);
    return (
      <g>
        {h > 0 && <path d={smooth(pts, false)} fill="none" stroke={C.banana} strokeWidth={30} strokeLinecap="round" opacity={h} />}
        <path d={smooth(pts, false)} fill="none" stroke={C.forest} strokeWidth={7} strokeLinecap="round" strokeDasharray={`${L} 1`} pathLength={1} />
        <path d={smooth(pts, false)} fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" opacity={0.6 * L} transform="translate(-4 0)" />
      </g>
    );
  };
  const tenA = tendon * (1 - 0.0 * dim);
  const tH = halo("TEN");
  return (
    <svg width={w} height={w} viewBox="0 0 860 860" style={{ overflow: "visible", display: "block" }}>
      <defs>
        <radialGradient id={`${id}bone`} cx="40%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#FFFBEA" />
          <stop offset="55%" stopColor={boneFill} />
          <stop offset="100%" stopColor="#CDBB8C" />
        </radialGradient>
        <radialGradient id={`${id}cart`} cx="38%" cy="32%" r="70%">
          <stop offset="0%" stopColor="#FFFFFA" />
          <stop offset="55%" stopColor="#EEF0E2" />
          <stop offset="100%" stopColor="#C9CDB4" />
        </radialGradient>
        <radialGradient id={`${id}tub`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FFFCEE" />
          <stop offset="65%" stopColor="#F1E3BC" />
          <stop offset="100%" stopColor="#D2BE8A" />
        </radialGradient>
        <linearGradient id={`${id}fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.78" stopColor="#fff" stopOpacity={1} />
          <stop offset="1" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <mask id={`${id}mask`} maskUnits="userSpaceOnUse" x={-200} y={-200} width={1260} height={1100}>
          <rect x={-200} y={-200} width={1260} height={1100} fill={`url(#${id}fade)`} />
        </mask>
      </defs>
      <g mask={`url(#${id}mask)`}>
        {/* glenoid cavity hint (scapula) */}
        <g opacity={0.55}>
          <path d={smooth(GLENOID, false)} fill="none" stroke={C.forest} strokeWidth={8} strokeLinecap="round" opacity={0.5} />
          <path d={smooth(GLENOID.map(([x, y]) => [x - 26, y] as P), false)} fill="none" stroke="#CDBB8C" strokeWidth={30} strokeLinecap="round" opacity={0.6} />
        </g>
        {/* bone */}
        {halo("HUM") > 0 && <path d={smooth(BONE)} fill="none" stroke={C.banana} strokeWidth={30} strokeLinejoin="round" opacity={halo("HUM")} />}
        <path d={smooth(BONE)} fill={`url(#${id}bone)`} stroke={C.forest} strokeWidth={7} strokeLinejoin="round" />
        {SHAFT_HATCH.map((d, i) => <path key={i} d={d} fill="none" stroke="#B9A577" strokeWidth={3} strokeLinecap="round" opacity={0.55} />)}
        {/* head + cartilage */}
        {halo("HEAD") > 0 && <path d={smooth(HEAD)} fill="none" stroke={C.banana} strokeWidth={26} opacity={halo("HEAD")} />}
        <path d={smooth(HEAD)} fill={`url(#${id}cart)`} stroke={mix("#9AA184", C.forest, 0.25)} strokeWidth={4} opacity={0.97} />
        <path d="M176 270 C200 318 250 336 300 322" fill="none" stroke="#B6B79A" strokeWidth={10} strokeLinecap="round" opacity={0.35} />
        <path d="M200 120 C230 96 270 84 310 84" fill="none" stroke="#FFFFFF" strokeWidth={10} strokeLinecap="round" opacity={0.7} />
        <path d={smooth(ANAT_NECK, false)} fill="none" stroke={C.forest} strokeWidth={4} strokeDasharray="10 9" opacity={0.55} />
        {/* tubercles */}
        {part("GT", GT, "#F2D14E", C.forest, 5)}
        <path d="M520 140 C560 136 604 152 626 186" fill="none" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={0.7} />
        {part("LT", LT, "#F2D14E", C.forest, 5)}
        <path d="M436 214 C450 200 466 198 478 206" fill="none" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.7} />
        {/* groove */}
        {halo("GRV") > 0 && <path d={smooth(GROOVE)} fill="none" stroke={C.banana} strokeWidth={30} strokeLinejoin="round" opacity={halo("GRV")} />}
        <path d={smooth(GROOVE)} fill={mix("#D9C79A", "#CDB176", on("GRV"))} stroke={mix("#A8936A", C.forest, 0.25)} strokeWidth={3} strokeLinejoin="round" />
        <path d="M500 190 C504 300 508 430 524 566" fill="none" stroke="#9A8455" strokeWidth={9} strokeLinecap="round" opacity={0.45} />
        <path d="M562 216 C570 300 568 430 548 600" fill="none" stroke="#FFF8E0" strokeWidth={6} strokeLinecap="round" opacity={0.7} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M${512 + i * 9} ${200 + i * 4} C${514 + i * 9} ${300} ${514 + i * 8} ${420} ${516 + i * 5} ${540 - Math.abs(i - 2.5) * 14}`} fill="none" stroke="#A89462" strokeWidth={2} opacity={0.45} />
        ))}
        {/* lips */}
        {lip("LLIP", LLIP)}
        {lip("MLIP", MLIP)}
        {/* muscle footprints */}
        {foot("TER")}
        {foot("LAT")}
        {foot("PEC")}
        {/* long head of biceps tendon */}
        {tenA > 0 && tg > 0 && (
          <g opacity={tenA}>
            {tH > 0 && <path d={TENDON} fill="none" stroke={C.banana} strokeWidth={56} strokeLinecap="round" pathLength={1} strokeDasharray={`${tg} 1`} opacity={tH} />}
            <path d={TENDON} fill="none" stroke={C.forest} strokeWidth={30} strokeLinecap="round" pathLength={1} strokeDasharray={`${tg} 1`} />
            <path d={TENDON} fill="none" stroke="#DCE3E6" strokeWidth={22} strokeLinecap="round" pathLength={1} strokeDasharray={`${tg} 1`} />
            <path d={TENDON} fill="none" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={`${tg} 1`} opacity={0.9} transform="translate(-5 0)" />
            <path d={TENDON} fill="none" stroke="#9FB2BA" strokeWidth={2} strokeLinecap="round" pathLength={1} strokeDasharray={`${Math.max(0, tg - 0.02)} 1`} transform="translate(6 0)" />
          </g>
        )}
        {/* transverse humeral ligament */}
        {tenA > 0 && tg >= 1 && (
          <g opacity={tenA * Math.max(on("LIG"), 0.85)}>
            <path d={LIG} fill="none" stroke={C.forest} strokeWidth={22} strokeLinecap="round" />
            <path d={LIG} fill="none" stroke="#C9D6C4" strokeWidth={15} strokeLinecap="round" />
            {[-4, 0, 4].map((o, i) => <path key={i} d={LIG} fill="none" stroke="#FFFFFF" strokeWidth={1.6} strokeDasharray="9 6" transform={`translate(0 ${o})`} opacity={0.8} />)}
          </g>
        )}
      </g>
    </svg>
  );
};
