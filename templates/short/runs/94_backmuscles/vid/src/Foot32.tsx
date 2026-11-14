import React from "react";
import { C, FONT, ramp } from "./kit";

/** Our own schematic of the bones of the RIGHT foot, seen from above (toes up, heel down, big toe on the left). */
export type TarsId = "T" | "Ca" | "N" | "MC" | "IC" | "LC" | "Cb";
type P = [number, number];
type Bone = { id: TarsId; name: string; letter: string; pts: P[]; lx: number; ly: number; fs: number };

export const TARSALS: Bone[] = [
  { id: "Ca", name: "Calcaneus", letter: "C", pts: [[425, 522], [500, 516], [548, 562], [566, 680], [566, 820], [536, 922], [452, 944], [380, 912], [360, 822], [372, 712], [414, 664], [424, 600]], lx: 482, ly: 830, fs: 64 },
  { id: "T", name: "Talus", letter: "T", pts: [[228, 524], [300, 516], [392, 526], [424, 584], [414, 662], [372, 704], [300, 708], [250, 684], [234, 622], [214, 562]], lx: 322, ly: 618, fs: 64 },
  { id: "N", name: "Navicular", letter: "N", pts: [[192, 468], [232, 456], [300, 452], [378, 458], [414, 472], [410, 506], [360, 500], [300, 498], [240, 506], [198, 512]], lx: 300, ly: 482, fs: 40 },
  { id: "MC", name: "Medial cuneiform", letter: "M", pts: [[192, 346], [262, 340], [272, 400], [264, 446], [198, 450], [184, 400]], lx: 228, ly: 398, fs: 48 },
  { id: "IC", name: "Intermediate cuneiform", letter: "I", pts: [[282, 352], [334, 350], [340, 396], [334, 444], [286, 446], [278, 396]], lx: 309, ly: 400, fs: 44 },
  { id: "LC", name: "Lateral cuneiform", letter: "L", pts: [[352, 354], [412, 358], [420, 406], [412, 450], [358, 448], [348, 400]], lx: 384, ly: 404, fs: 46 },
  { id: "Cb", name: "Cuboid", letter: "C", pts: [[432, 380], [502, 372], [550, 412], [544, 500], [472, 512], [426, 472], [422, 424]], lx: 486, ly: 446, fs: 54 },
];
const DETAIL: Record<TarsId, string[]> = {
  Ca: ["M392 884 Q470 914 540 884", "M384 840 Q470 866 552 836", "M378 752 Q398 716 426 700", "M548 600 Q560 640 556 692", "M434 540 Q482 528 526 552"],
  T: ["M232 560 Q320 572 412 562", "M238 532 Q312 520 390 534", "M326 618 Q322 660 324 696"],
  N: ["M236 474 Q300 464 372 470", "M246 494 Q300 488 360 492"],
  MC: ["M196 362 Q228 352 262 356", "M200 432 Q232 438 262 432"],
  IC: ["M286 364 Q308 358 332 362", "M288 430 Q310 434 332 430"],
  LC: ["M356 368 Q384 362 414 370", "M360 434 Q386 440 412 434"],
  Cb: ["M436 470 Q492 452 542 468", "M440 488 Q494 474 538 484", "M446 392 Q494 386 530 404"],
};
export const centerOf = (id: TarsId): P => {
  const b = TARSALS.find((x) => x.id === id)!;
  const xs = b.pts.map((p) => p[0]), ys = b.pts.map((p) => p[1]);
  return [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
};

/** smooth closed path through points (Catmull-Rom -> cubic Bezier) */
const smooth = (pts: P[]) => {
  const n = pts.length;
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0]} ${p2[1]}`;
  }
  return d + " Z";
};

// long bones: [x1,y1 (base)] -> [x2,y2 (head)], width
const LONG: { a: P; b: P; w: number; mt?: boolean }[] = [
  { a: [228, 338], b: [205, 162], w: 60, mt: true },
  { a: [308, 348], b: [290, 142], w: 42, mt: true },
  { a: [382, 352], b: [370, 152], w: 40, mt: true },
  { a: [458, 376], b: [446, 172], w: 38, mt: true },
  { a: [528, 392], b: [526, 208], w: 38, mt: true },
  { a: [205, 160], b: [196, 84], w: 52 }, { a: [196, 82], b: [191, 22], w: 48 },
  { a: [290, 140], b: [283, 78], w: 34 }, { a: [283, 76], b: [279, 44], w: 30 }, { a: [279, 42], b: [277, 18], w: 28 },
  { a: [370, 150], b: [368, 92], w: 32 }, { a: [368, 90], b: [367, 62], w: 28 }, { a: [367, 60], b: [366, 40], w: 26 },
  { a: [446, 170], b: [451, 118], w: 30 }, { a: [451, 116], b: [453, 90], w: 26 }, { a: [453, 88], b: [454, 70], w: 24 },
  { a: [526, 206], b: [540, 164], w: 30 }, { a: [540, 162], b: [547, 140], w: 26 }, { a: [547, 138], b: [551, 122], w: 22 },
];

export const Foot: React.FC<{
  t: number;
  w?: number;
  lit?: Partial<Record<TarsId, number>>; // time each tarsal lights up
  hot?: Partial<Record<TarsId, number>>; // red "answer" highlight
  region?: number; // time the whole tarsal region glows
  dimFore?: number; // 0..1 dim metatarsals + toes
  letters?: boolean;
  wedges?: number; // time wedge outlines appear on cuneiforms
}> = ({ t, w = 600, lit = {}, hot = {}, region, dimFore = 0, letters = true, wedges }) => {
  const h = (w * 970) / 700;
  const rg = region === undefined ? 0 : ramp(t, region, region + 0.4);
  const wd = wedges === undefined ? 0 : ramp(t, wedges, wedges + 0.35);
  return (
    <svg width={w} height={h} viewBox="40 -10 700 970" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="f32bone" cx="38%" cy="32%" r="80%">
          <stop offset="0%" stopColor="#FFFDF4" />
          <stop offset="55%" stopColor="#EFE6CC" />
          <stop offset="100%" stopColor="#CDBD92" />
        </radialGradient>
        <radialGradient id="f32lit" cx="38%" cy="32%" r="80%">
          <stop offset="0%" stopColor="#FFF4BE" />
          <stop offset="60%" stopColor={C.banana} />
          <stop offset="100%" stopColor={C.bananaDark} />
        </radialGradient>
        <radialGradient id="f32hot" cx="38%" cy="32%" r="80%">
          <stop offset="0%" stopColor="#F4A79C" />
          <stop offset="60%" stopColor={C.redLight} />
          <stop offset="100%" stopColor={C.red} />
        </radialGradient>
        <linearGradient id="f32shaft" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#D6C8A1" />
          <stop offset="45%" stopColor="#FBF6E6" />
          <stop offset="100%" stopColor="#CBBB8F" />
        </linearGradient>
        <filter id="f32sh" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#1F2A14" floodOpacity="0.18" />
        </filter>
        <filter id="f32glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
        <pattern id="f32hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="10" stroke={C.forest} strokeWidth="1.4" opacity="0.13" />
        </pattern>
      </defs>
      {/* soft skin silhouette */}
      <path d={smooth([[150, 120], [190, -6], [300, -8], [420, 30], [520, 80], [600, 150], [612, 360], [600, 560], [604, 760], [580, 930], [450, 975], [340, 930], [300, 800], [190, 640], [150, 470], [140, 300]])} fill={C.matcha} opacity={0.07} />
      {/* tarsal region glow */}
      {rg > 0 && <path d={smooth([[176, 330], [430, 340], [566, 400], [586, 700], [570, 950], [440, 970], [350, 930], [330, 760], [200, 690], [170, 520]])} fill={C.banana} opacity={0.35 * rg} filter="url(#f32glow)" />}
      {rg > 0 && <path d={smooth([[176, 330], [430, 340], [566, 400], [586, 700], [570, 950], [440, 970], [350, 930], [330, 760], [200, 690], [170, 520]])} fill="none" stroke={C.matcha} strokeWidth={7} strokeDasharray="20 13" opacity={rg} />}
      {/* metatarsals + phalanges */}
      <g filter="url(#f32sh)" opacity={1 - dimFore * 0.65}>
        {LONG.map((m, i) => {
          const ang = Math.atan2(m.b[1] - m.a[1], m.b[0] - m.a[0]);
          const len = Math.hypot(m.b[0] - m.a[0], m.b[1] - m.a[1]);
          const q = m.w;
          return (
            <g key={i} transform={`translate(${m.a[0]} ${m.a[1]}) rotate(${(ang * 180) / Math.PI})`}>
              <path d={`M0 ${-q * 0.55} Q${len * 0.25} ${-q * 0.3} ${len * 0.5} ${-q * 0.3} Q${len * 0.78} ${-q * 0.3} ${len - q * 0.25} ${-q * 0.46} L${len - q * 0.25} ${q * 0.46} Q${len * 0.78} ${q * 0.3} ${len * 0.5} ${q * 0.3} Q${len * 0.25} ${q * 0.3} 0 ${q * 0.55} Q${-q * 0.22} 0 0 ${-q * 0.55} Z`} fill="url(#f32shaft)" stroke={C.forest} strokeWidth={3.5} strokeLinejoin="round" />
              <ellipse cx={len - q * 0.12} cy={0} rx={q * 0.42} ry={q * 0.5} fill="url(#f32bone)" stroke={C.forest} strokeWidth={3.5} />
              {m.mt && <line x1={q * 0.7} y1={-q * 0.12} x2={len - q * 0.9} y2={-q * 0.08} stroke={C.forest} strokeWidth={2} opacity={0.22} />}
            </g>
          );
        })}
      </g>
      {/* tarsals */}
      {TARSALS.map((b) => {
        const lt = lit[b.id], ht = hot[b.id];
        const p = lt === undefined ? 0 : ramp(t, lt, lt + 0.25);
        const r = ht === undefined ? 0 : ramp(t, ht, ht + 0.25);
        const pulseT = ht ?? lt;
        const pulse = pulseT === undefined ? 0 : Math.max(0, 1 - Math.abs(t - pulseT - 0.15) / 0.3);
        const [cx, cy] = centerOf(b.id);
        const d = smooth(b.pts);
        return (
          <g key={b.id} transform={`translate(${cx} ${cy}) scale(${1 + 0.08 * pulse}) translate(${-cx} ${-cy})`} filter="url(#f32sh)">
            {(p > 0 || r > 0) && <path d={d} fill={r > 0 ? C.red : C.banana} opacity={0.6 * Math.max(p, r)} filter="url(#f32glow)" transform={`translate(${cx} ${cy}) scale(1.12) translate(${-cx} ${-cy})`} />}
            <path d={d} fill="url(#f32bone)" stroke={C.forest} strokeWidth={4.5} strokeLinejoin="round" />
            <path d={d} fill="url(#f32hatch)" />
            <path d={d} fill="url(#f32lit)" opacity={p * (1 - r)} />
            <path d={d} fill="url(#f32hot)" opacity={r} />
            <path d={d} fill="none" stroke="#FFFFFF" strokeWidth={3} opacity={0.35} transform={`translate(${cx} ${cy}) scale(0.8) translate(${-cx} ${-cy - 6})`} />
            {b.id === "T" && <path d="M248 640 Q322 606 402 634 L394 690 Q322 704 262 684 Z" fill="#FFFFFF" opacity={0.28} stroke={C.forest} strokeWidth={2.5} strokeOpacity={0.35} />}
            {b.id === "N" && <ellipse cx={194} cy={492} rx={18} ry={16} fill="url(#f32bone)" stroke={C.forest} strokeWidth={3.5} />}
            {DETAIL[b.id].map((dd, j) => <path key={j} d={dd} fill="none" stroke={C.forest} strokeWidth={2.4} strokeLinecap="round" opacity={0.3} />)}
          </g>
        );
      })}
      {/* talar trochlea hint + calcaneal tuber line */}
      <path d="M262 600 Q320 572 386 598" stroke={C.forest} strokeWidth={2.5} fill="none" opacity={0.3} />
      <path d="M400 880 Q470 905 530 880" stroke={C.forest} strokeWidth={2.5} fill="none" opacity={0.3} />
      {/* wedge outlines on the cuneiforms */}
      {wd > 0 &&
        (["MC", "IC", "LC"] as TarsId[]).map((id, i) => {
          const [cx, cy] = centerOf(id);
          return (
            <path key={id} d={`M${cx - 26} ${cy - 30} L${cx + 26} ${cy - 30} L${cx} ${cy + 34} Z`} fill="none" stroke={C.red} strokeWidth={6} strokeLinejoin="round" opacity={ramp(t, wedges! + i * 0.15, wedges! + i * 0.15 + 0.25)} />
          );
        })}
      {/* letters */}
      {letters &&
        TARSALS.map((b) => {
          const lt = b.id in hot ? hot[b.id] : lit[b.id];
          const p = lt === undefined ? 0 : ramp(t, lt, lt + 0.2);
          if (p <= 0) return null;
          return (
            <text key={b.id} x={b.lx} y={b.ly + b.fs * 0.35} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={b.fs} fill={C.forest} opacity={p}>
              {b.letter}
            </text>
          );
        })}
    </svg>
  );
};
