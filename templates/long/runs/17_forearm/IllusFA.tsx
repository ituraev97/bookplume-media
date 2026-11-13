import React from "react";
import { C, FONT, ramp } from "./kit";

/* ============ colours ============ */
export const FC: Record<string, string> = {
  pt: "#E8796B", fcr: "#E5A15B", pl: "#F2D14E", fds: "#7CC9B1", fcu: "#86B8D8",
  fdpM: "#5FB3A6", fdpU: "#4F93C9", fpl: "#D98BB0", pq: "#C9B48F",
  br: "#E8796B", ecrl: "#E5A15B", ecrb: "#F0BE85", ed: "#7CC9B1", edm: "#A6DCC8", ecu: "#86B8D8", an: "#C9B48F",
  sup: "#B193D6", apl: "#E8796B", epb: "#7CC9B1", epl: "#86B8D8", ei: "#F2D14E",
};
export const NC = { med: "#F2C200", uln: "#3F86D0", rad: "#9B7FD1" };
const SK = { skin: "#F5E6D3", skinD: "#D9BFA0", bone: "#EDE7D3", boneD: "#B9AE8C", ten: "#FBF7EA", tenD: "#B9AE8C" };
const dk = (hex: string, k = 0.62) => {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * k), g = Math.round(((n >> 8) & 255) * k), b = Math.round((n & 255) * k);
  return `rgb(${r},${g},${b})`;
};
export const NERVE: Record<string, "med" | "uln" | "rad"> = {
  pt: "med", fcr: "med", pl: "med", fds: "med", fdpM: "med", fpl: "med", pq: "med", fcu: "uln", fdpU: "uln",
  br: "rad", ecrl: "rad", ecrb: "rad", ed: "rad", edm: "rad", ecu: "rad", an: "rad", sup: "rad", apl: "rad", epb: "rad", epl: "rad", ei: "rad",
};

/* ============ geometry (FRONT frame: left forearm, ulna/medial on the LEFT, radius/thumb on the RIGHT) ============ */
type P2 = [number, number];
type M = { id: string; pts: [P2, P2, P2]; w0: number; w1: number; ten?: P2[][]; belly?: number };
const FING_X = [360, 420, 480, 540]; // little, ring, middle, index (front frame)
const TIP = (i: number): P2 => [FING_X[i] + (i - 1.5) * 6, 1000];
const MID = (i: number): P2 => [FING_X[i] + (i - 1.5) * 4, 935];
const THUMB_TIP: P2 = [775, 975];

export const FRONT_SUP: M[] = [
  { id: "fds", pts: [[255, 215], [395, 500], [455, 760]], w0: 150, w1: 84, belly: 0.25, ten: [0, 1, 2, 3].map((i) => [[440 + i * 10, 760], [FING_X[i], 860], MID(i)]) },
  { id: "fcu", pts: [[218, 182], [262, 480], [338, 790]], w0: 92, w1: 26, ten: [[[338, 790], [344, 818]]] },
  { id: "pl", pts: [[240, 195], [372, 450], [462, 750]], w0: 54, w1: 14, ten: [[[462, 750], [466, 820], [470, 880]]] },
  { id: "fcr", pts: [[236, 186], [400, 440], [548, 770]], w0: 72, w1: 20, ten: [[[548, 770], [556, 820], [560, 845]]] },
  { id: "pt", pts: [[230, 172], [420, 320], [602, 478]], w0: 80, w1: 40 },
  { id: "br", pts: [[704, 40], [726, 360], [628, 790]], w0: 104, w1: 26, ten: [[[628, 790], [636, 812]]] },
];
export const FRONT_DEEP: M[] = [
  { id: "fdpU", pts: [[325, 250], [372, 520], [418, 770]], w0: 70, w1: 44, ten: [0, 1].map((i) => [[408 + i * 14, 770], [FING_X[i], 870], TIP(i)]) },
  { id: "fdpM", pts: [[385, 290], [428, 530], [470, 770]], w0: 66, w1: 40, ten: [2, 3].map((i) => [[462 + (i - 2) * 16, 770], [FING_X[i], 870], TIP(i)]) },
  { id: "fpl", pts: [[566, 330], [596, 560], [604, 772]], w0: 70, w1: 20, ten: [[[604, 772], [690, 880], THUMB_TIP]] },
  { id: "pq", pts: [[336, 705], [470, 700], [606, 690]], w0: 62, w1: 62, belly: 0 },
];
export const BACK_SUP: M[] = [
  { id: "an", pts: [[672, 150], [560, 190], [430, 225]], w0: 60, w1: 20, belly: 0.1 },
  { id: "ecu", pts: [[612, 182], [400, 450], [342, 790]], w0: 80, w1: 22, ten: [[[342, 790], [350, 842]]] },
  { id: "edm", pts: [[632, 176], [452, 470], [392, 780]], w0: 52, w1: 16, ten: [[[392, 780], [370, 860], TIP(0)]] },
  { id: "ed", pts: [[652, 166], [520, 450], [470, 778]], w0: 112, w1: 62, ten: [0, 1, 2, 3].map((i) => [[446 + i * 16, 778], [FING_X[i], 860], TIP(i)]) },
  { id: "ecrb", pts: [[682, 150], [622, 420], [562, 780]], w0: 68, w1: 18, ten: [[[562, 780], [520, 842]]] },
  { id: "ecrl", pts: [[702, 92], [664, 400], [592, 780]], w0: 72, w1: 18, ten: [[[592, 780], [556, 842]]] },
  { id: "br", pts: [[712, 40], [736, 360], [636, 790]], w0: 98, w1: 24, ten: [[[636, 790], [644, 812]]] },
];
export const BACK_DEEP: M[] = [
  { id: "sup", pts: [[668, 168], [548, 252], [600, 336]], w0: 74, w1: 56, belly: 0.1 },
  { id: "apl", pts: [[430, 390], [566, 572], [650, 790]], w0: 54, w1: 16, ten: [[[650, 790], [700, 858]]] },
  { id: "epb", pts: [[486, 520], [588, 652], [664, 792]], w0: 42, w1: 12, ten: [[[664, 792], [735, 905]]] },
  { id: "epl", pts: [[402, 430], [500, 640], [592, 790]], w0: 46, w1: 12, ten: [[[592, 790], [690, 860], THUMB_TIP]] },
  { id: "ei", pts: [[380, 560], [452, 700], [510, 790]], w0: 36, w1: 10, ten: [[[510, 790], [540, 880], TIP(3)]] },
];
const ALLM: Record<string, M> = {};
[...FRONT_SUP, ...FRONT_DEEP].forEach((m) => (ALLM["f:" + m.id] = m));
[...BACK_SUP, ...BACK_DEEP].forEach((m) => (ALLM["b:" + m.id] = m));

const qp = (p: [P2, P2, P2], u: number): P2 => {
  const c: P2 = [2 * p[1][0] - (p[0][0] + p[2][0]) / 2, 2 * p[1][1] - (p[0][1] + p[2][1]) / 2];
  const a = (1 - u) * (1 - u), b = 2 * (1 - u) * u, d = u * u;
  return [a * p[0][0] + b * c[0] + d * p[2][0], a * p[0][1] + b * c[1] + d * p[2][1]];
};
/** label anchor in viewBox units (back view is mirrored so the radius sits on the left, like Gray's Fig. 418) */
export const anchor = (id: string, view: "front" | "back", u = 0.45): P2 => {
  const m = ALLM[(view === "front" ? "f:" : "b:") + id];
  const p = qp(m.pts, u);
  return view === "back" ? [900 - p[0], p[1]] : p;
};
const bandPath = (m: M) => {
  const N = 26, L: P2[] = [], R: P2[] = [];
  const bel = m.belly ?? 0.35;
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    const p = qp(m.pts, u), q = qp(m.pts, Math.min(1, u + 0.01)), o = qp(m.pts, Math.max(0, u - 0.01));
    let dx = q[0] - o[0], dy = q[1] - o[1];
    const l = Math.hypot(dx, dy) || 1;
    dx /= l; dy /= l;
    const w = (m.w0 + (m.w1 - m.w0) * u) * (1 + bel * Math.sin(Math.PI * u)) / 2;
    L.push([p[0] - dy * w, p[1] + dx * w]);
    R.push([p[0] + dy * w, p[1] - dx * w]);
  }
  const pts = [...L, ...R.reverse()];
  return "M " + pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ") + " Z";
};
const fiber = (m: M, off: number) => {
  const pts: P2[] = [];
  for (let i = 1; i < 24; i++) {
    const u = i / 24;
    const p = qp(m.pts, u), q = qp(m.pts, Math.min(1, u + 0.01));
    let dx = q[0] - p[0], dy = q[1] - p[1];
    const l = Math.hypot(dx, dy) || 1;
    const w = (m.w0 + (m.w1 - m.w0) * u) * (1 + (m.belly ?? 0.35) * Math.sin(Math.PI * u)) / 2;
    pts.push([p[0] - (dy / l) * w * off, p[1] + (dx / l) * w * off]);
  }
  return "M " + pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ");
};
const tenPath = (pts: P2[]) => {
  if (pts.length === 2) return `M ${pts[0][0]} ${pts[0][1]} L ${pts[1][0]} ${pts[1][1]}`;
  return `M ${pts[0][0]} ${pts[0][1]} Q ${pts[1][0]} ${pts[1][1]} ${pts[2][0]} ${pts[2][1]}`;
};

/* ---------- skeleton + skin ---------- */
const Skin: React.FC<{ back: boolean; bones: number }> = ({ back, bones }) => (
  <g>
    {/* arm + forearm + hand outline */}
    <path d="M 200 0 L 710 0 C 740 60 760 140 742 240 C 720 420 690 620 650 790 L 652 812 C 690 840 735 880 770 925 C 795 958 800 990 775 1000 L 330 1000 L 322 830 C 300 700 250 520 214 330 C 196 230 186 120 200 0 Z" fill={SK.skin} stroke={SK.skinD} strokeWidth={4} />
    {/* fingers */}
    {FING_X.map((x, i) => (
      <rect key={i} x={x - 26} y={850} width={52} height={200} rx={26} fill={SK.skin} stroke={SK.skinD} strokeWidth={3} />
    ))}
    <g opacity={bones}>
      {/* humerus end with 2 epicondyles */}
      <path d="M 330 0 L 590 0 L 600 90 C 640 110 690 120 700 150 C 690 182 640 186 600 182 L 330 182 C 280 190 220 182 205 160 C 212 128 270 112 320 92 Z" fill={SK.bone} stroke={SK.boneD} strokeWidth={4} />
      {/* ulna (medial) + radius (lateral) */}
      <path d={back ? "M 360 120 C 330 140 318 190 330 230 C 345 420 352 620 352 790 L 322 800 C 322 640 312 430 300 240 C 290 170 310 128 360 120 Z" : "M 352 178 C 336 210 334 250 340 280 C 350 450 356 640 356 790 L 326 800 C 324 640 316 440 308 280 C 304 230 318 196 352 178 Z"} fill={SK.bone} stroke={SK.boneD} strokeWidth={3} />
      <path d="M 560 190 C 600 186 610 205 596 228 C 586 400 600 620 628 792 L 576 800 C 560 640 548 420 560 228 C 548 210 548 194 560 190 Z" fill={SK.bone} stroke={SK.boneD} strokeWidth={3} />
      {/* carpals + metacarpals hint */}
      <path d="M 330 800 L 640 800 L 650 850 L 322 850 Z" fill={SK.bone} stroke={SK.boneD} strokeWidth={3} opacity={0.8} />
    </g>
  </g>
);

export type FAProps = {
  t: number;
  view: "front" | "back";
  layer?: "sup" | "deep" | "both"; // which muscles to draw
  peel?: number; // 0..1 superficial layer fades out over the deep one
  lit?: Record<string, number>; // id -> time it lights
  dim?: number; // how pale unlit muscles are (0 = all full colour)
  nerve?: number; // time when muscles switch to their NERVE colour
  bones?: number;
  only?: string[]; // draw only these
  handTrick?: { a: number; fingers: number[] }; // overlay of the other hand (palm heel on the medial epicondyle)
  pulse?: string[]; // ids with a pulsing outline
};

const Muscle: React.FC<{ m: M; t: number; on: number; dim: number; col: string; pulse: boolean; op: number }> = ({ m, t, on, dim, col, pulse, op }) => {
  const k = on;
  const fade = 1 - dim * (1 - k);
  const d = bandPath(m);
  return (
    <g opacity={op}>
      {m.ten?.map((tp, i) => (
        <g key={i} opacity={0.5 + 0.5 * fade}>
          <path d={tenPath(tp)} stroke={SK.tenD} strokeWidth={13} fill="none" strokeLinecap="round" />
          <path d={tenPath(tp)} stroke={SK.ten} strokeWidth={7} fill="none" strokeLinecap="round" />
        </g>
      ))}
      <path d={d} fill={col} opacity={0.25 + 0.75 * fade} stroke={dk(col)} strokeWidth={4} strokeLinejoin="round" />
      {[-0.55, -0.15, 0.25, 0.6].map((o) => (
        <path key={o} d={fiber(m, o)} stroke={dk(col, 0.8)} strokeWidth={2.2} fill="none" opacity={0.35 * fade} />
      ))}
      {k > 0 && k < 1 && <path d={d} fill="none" stroke={C.banana} strokeWidth={14 * (1 - k)} opacity={1 - k} />}
      {pulse && <path d={d} fill="none" stroke={C.red} strokeWidth={6 + 3 * Math.sin(t * 7)} opacity={0.9} />}
    </g>
  );
};

export const Forearm: React.FC<FAProps> = ({ t, view, layer = "sup", peel = 0, lit = {}, dim = 0, nerve, bones = 0.6, only, handTrick, pulse = [] }) => {
  const back = view === "back";
  const SUP = back ? BACK_SUP : FRONT_SUP, DEEP = back ? BACK_DEEP : FRONT_DEEP;
  const nk = nerve === undefined ? 0 : ramp(t, nerve, nerve + 0.6);
  const colOf = (id: string) => (nk > 0.5 ? NC[NERVE[id]] : FC[id]);
  const onOf = (id: string) => (lit[id] === undefined ? (Object.keys(lit).length ? 0 : 1) : ramp(t, lit[id], lit[id] + 0.45));
  const draw = (list: M[], op: number) =>
    list.filter((m) => !only || only.includes(m.id)).map((m) => <Muscle key={m.id} m={m} t={t} on={onOf(m.id)} dim={dim} col={colOf(m.id)} pulse={pulse.includes(m.id)} op={op} />);
  return (
    <svg viewBox="0 0 900 1000" width="100%" height="100%" style={{ overflow: "visible" }}>
      <g transform={back ? "translate(900 0) scale(-1 1)" : undefined}>
        <Skin back={back} bones={bones} />
        {(layer === "deep" || layer === "both") && draw(DEEP, 1)}
        {(layer === "sup" || layer === "both") && draw(SUP, layer === "both" ? 1 - peel : 1)}
        {handTrick && <HandTrick t={t} a={handTrick.a} fingers={handTrick.fingers} />}
      </g>
    </svg>
  );
};

/* the other hand: heel on the medial epicondyle, fingers along the 5 superficial flexors */
const HT_ORDER = ["pt", "fcr", "pl", "fds", "fcu"]; // thumb, index, middle, ring, little
const HandTrick: React.FC<{ t: number; a: number; fingers: number[] }> = ({ t, a, fingers }) => {
  const p = ramp(t, a, a + 0.6);
  const heel: P2 = [228, 182];
  return (
    <g opacity={p}>
      <circle cx={heel[0]} cy={heel[1]} r={64} fill="rgba(31,42,20,0.16)" stroke={C.forest} strokeWidth={4} strokeDasharray="10 8" />
      {HT_ORDER.map((id, i) => {
        const m = FRONT_SUP.find((x) => x.id === id)!;
        const end = qp(m.pts, i === 0 ? 0.62 : 0.5);
        const ang = Math.atan2(end[1] - heel[1], end[0] - heel[0]);
        const len = Math.hypot(end[0] - heel[0], end[1] - heel[1]) * (i === 0 ? 0.9 : 1);
        const on = fingers[i] !== undefined ? ramp(t, fingers[i], fingers[i] + 0.3) : 0;
        const x2 = heel[0] + Math.cos(ang) * len * (0.55 + 0.45 * p), y2 = heel[1] + Math.sin(ang) * len * (0.55 + 0.45 * p);
        return (
          <g key={id}>
            <line x1={heel[0]} y1={heel[1]} x2={x2} y2={y2} stroke={C.forest} strokeWidth={i === 0 ? 50 : 42} strokeLinecap="round" opacity={0.22 + 0.25 * on} />
            <line x1={heel[0]} y1={heel[1]} x2={x2} y2={y2} stroke={on ? C.banana : C.paper} strokeWidth={i === 0 ? 34 : 28} strokeLinecap="round" opacity={0.55 + 0.4 * on} />
            <circle cx={x2} cy={y2} r={i === 0 ? 20 : 17} fill={on ? FC[id] : C.paper} stroke={C.forest} strokeWidth={4} />
          </g>
        );
      })}
    </g>
  );
};
export const handTip = (i: number): P2 => {
  const m = FRONT_SUP.find((x) => x.id === HT_ORDER[i])!;
  return qp(m.pts, i === 0 ? 0.62 : 0.5);
};

/* ============ CROSS-SECTION (viewBox 900 x 700): front up, radius on the right ============ */
export const XSec: React.FC<{ t: number; front?: number; back?: number; mem?: number; nerves?: number; bones?: number }> = ({ t, front = 0, back = 0, mem = 0, nerves = 0, bones = 1 }) => {
  const fr = ramp(t, front, front + 0.5) * (front ? 1 : 0), bk = ramp(t, back, back + 0.5) * (back ? 1 : 0);
  const mm = mem ? ramp(t, mem, mem + 0.6) : 0, nv = nerves ? ramp(t, nerves, nerves + 0.5) : 0;
  const outline = "M 450 70 C 680 70 840 180 840 350 C 840 520 680 640 450 640 C 220 640 70 520 70 350 C 70 180 220 70 450 70 Z";
  return (
    <svg viewBox="0 0 900 700" width="100%" height="100%">
      <defs>
        <clipPath id="xsF"><path d="M 0 0 L 900 0 L 900 380 L 640 372 L 300 380 L 0 380 Z" /></clipPath>
        <clipPath id="xsB"><path d="M 0 380 L 300 380 L 640 372 L 900 380 L 900 700 L 0 700 Z" /></clipPath>
      </defs>
      <path d={outline} fill={SK.skin} stroke={SK.skinD} strokeWidth={8} />
      <g clipPath="url(#xsF)">
        <path d={outline} fill="#F3C3B5" transform="translate(450 355) scale(0.9) translate(-450 -355)" opacity={0.6 + 0.4 * fr} />
        <path d={outline} fill={C.red} opacity={0.18 * fr} />
        {[[260, 200, 70], [380, 160, 60], [500, 165, 62], [620, 200, 66], [400, 280, 80], [560, 290, 58]].map(([x, y, r], i) => (
          <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.72} fill="#E8A090" stroke="#B9665A" strokeWidth={3} opacity={0.5 + 0.5 * fr} />
        ))}
      </g>
      <g clipPath="url(#xsB)">
        <path d={outline} fill="#D9C6EC" transform="translate(450 355) scale(0.9) translate(-450 -355)" opacity={0.6 + 0.4 * bk} />
        <path d={outline} fill={NC.rad} opacity={0.2 * bk} />
        {[[280, 480, 66], [420, 530, 64], [560, 520, 60], [680, 450, 56], [470, 440, 48]].map(([x, y, r], i) => (
          <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.72} fill="#BBA4DD" stroke="#7D62AE" strokeWidth={3} opacity={0.5 + 0.5 * bk} />
        ))}
      </g>
      <g opacity={bones}>
        <ellipse cx={300} cy={380} rx={52} ry={46} fill={SK.bone} stroke={SK.boneD} strokeWidth={6} />
        <ellipse cx={640} cy={372} rx={62} ry={48} fill={SK.bone} stroke={SK.boneD} strokeWidth={6} />
        <ellipse cx={300} cy={380} rx={22} ry={18} fill="#F6E7B8" />
        <ellipse cx={640} cy={372} rx={26} ry={18} fill="#F6E7B8" />
      </g>
      <path d="M 350 378 L 580 372" stroke={C.forest} strokeWidth={6 + 6 * mm} strokeDasharray={mm ? "none" : "4 10"} opacity={0.4 + 0.6 * mm} />
      {mm > 0 && <path d="M 350 378 L 580 372" stroke={C.banana} strokeWidth={4} opacity={mm} />}
      <g opacity={nv}>
        {([[450, 250, NC.med], [250, 300, NC.uln], [520, 430, NC.rad], [700, 300, NC.rad]] as [number, number, string][]).map(([x, y, c], i) => (
          <circle key={i} cx={x} cy={y} r={20} fill={c} stroke={C.forest} strokeWidth={4} />
        ))}
      </g>
    </svg>
  );
};

/* ============ FINGER (palm view, viewBox 900 x 1000): FDS splits, FDP passes through ============ */
export const FingerSplit: React.FC<{ t: number; fds?: number; fdp?: number; split?: number; ins?: number }> = ({ t, fds = 0, fdp = 0, split = 0, ins = 0 }) => {
  const a = ramp(t, fds, fds + 0.6), b = ramp(t, fdp, fdp + 0.6), s = split ? ramp(t, split, split + 1.2) : 0, ii = ins ? ramp(t, ins, ins + 0.5) : 0;
  const bones: [number, number, string][] = [[40, 300, "metacarpal"], [350, 230, "proximal"], [590, 150, "middle"], [750, 110, "distal"]];
  return (
    <svg viewBox="0 0 900 1000" width="100%" height="100%">
      {/* finger outline (pointing down) */}
      <path d="M 300 0 L 600 0 L 600 860 C 600 960 300 960 300 860 Z" fill={SK.skin} stroke={SK.skinD} strokeWidth={5} />
      {bones.map(([y, h], i) => (
        <rect key={i} x={360} y={y} width={180} height={h - 16} rx={40} fill={SK.bone} stroke={SK.boneD} strokeWidth={5} opacity={i === 2 ? 0.75 + 0.25 * ii : i === 3 ? 0.75 + 0.25 * ii : 0.75} />
      ))}
      {/* FDP: deep, straight down to the distal phalanx */}
      <g opacity={b}>
        <path d={`M 450 0 L 450 ${720 + 60 * b}`} stroke={dk(FC.fdpU)} strokeWidth={46} strokeLinecap="round" />
        <path d={`M 450 0 L 450 ${720 + 60 * b}`} stroke={FC.fdpU} strokeWidth={34} strokeLinecap="round" />
      </g>
      {/* FDS: superficial, splits into two slips around FDP and inserts on the middle phalanx */}
      <g opacity={a}>
        {[-1, 1].map((sd) => {
          const off = 70 * s;
          const d = `M 450 0 L 450 280 C 450 ${330} ${450 + sd * off} 360 ${450 + sd * off} 430 L ${450 + sd * (off + 10 * s)} ${560 + 40 * s}`;
          return (
            <g key={sd}>
              <path d={d} stroke={dk(FC.fds)} strokeWidth={46 - 14 * s} fill="none" strokeLinecap="round" />
              <path d={d} stroke={FC.fds} strokeWidth={34 - 12 * s} fill="none" strokeLinecap="round" />
            </g>
          );
        })}
      </g>
      {ii > 0 && (
        <g opacity={ii}>
          <circle cx={450 - 80} cy={600} r={18} fill={C.red} stroke={C.paper} strokeWidth={5} />
          <circle cx={450 + 80} cy={600} r={18} fill={C.red} stroke={C.paper} strokeWidth={5} />
          <circle cx={450} cy={780} r={18} fill={C.red} stroke={C.paper} strokeWidth={5} />
        </g>
      )}
    </svg>
  );
};

/* ============ SNUFFBOX (thumb side of the left wrist, thumb pointing up-right, viewBox 900 x 900) ============ */
export const SB_PT: Record<string, [number, number]> = { lat: [470, 600], med: [455, 395], hollow: [560, 505], scaph: [585, 545], art: [470, 690], thumb: [770, 210] };
export const Snuffbox: React.FC<{ t: number; ext?: number; lat?: number; med?: number; floor?: number; art?: number }> = ({ t, ext = 0, lat = 0, med = 0, floor = 0, art = 0 }) => {
  const e = ext ? ramp(t, ext, ext + 1.0) : 0;
  const L = lat ? ramp(t, lat, lat + 0.5) : 0, Md = med ? ramp(t, med, med + 0.5) : 0, F = floor ? ramp(t, floor, floor + 0.5) : 0, A = art ? ramp(t, art, art + 0.5) : 0;
  const ang = 18 - 18 * e; // thumb stretches back
  const tend = (d: string, col: string, w: number, op: number) => (
    <g opacity={op}>
      <path d={d} stroke={dk(col)} strokeWidth={w + 12} fill="none" strokeLinecap="round" />
      <path d={d} stroke={col} strokeWidth={w} fill="none" strokeLinecap="round" />
      <path d={d} stroke="#FFFFFF" strokeWidth={w * 0.25} fill="none" strokeLinecap="round" opacity={0.35} />
    </g>
  );
  return (
    <svg viewBox="0 0 900 900" width="100%" height="100%">
      {/* forearm + hand (radial side view) */}
      <path d="M 0 360 C 200 350 380 360 520 380 C 600 392 660 420 720 470 L 900 560 L 900 900 L 0 900 Z" fill={SK.skin} stroke={SK.skinD} strokeWidth={5} />
      {/* radius end + styloid */}
      <path d="M 0 470 C 200 460 380 470 470 500 C 500 515 500 560 470 575 C 380 600 200 610 0 610 Z" fill={SK.bone} stroke={SK.boneD} strokeWidth={4} opacity={0.85} />
      {/* scaphoid + trapezium in the floor */}
      <ellipse cx={585} cy={545} rx={58} ry={40} fill={F ? "#F6E7B8" : SK.bone} stroke={F ? C.red : SK.boneD} strokeWidth={4 + 5 * F} transform="rotate(-20 585 545)" />
      <ellipse cx={668} cy={500} rx={40} ry={34} fill={SK.bone} stroke={SK.boneD} strokeWidth={4} />
      {/* thumb */}
      <g transform={`rotate(${ang} 690 470)`}>
        <path d="M 640 470 C 650 380 690 290 740 200 C 760 160 800 140 830 160 C 860 180 850 220 830 260 C 790 340 760 420 740 500 Z" fill={SK.skin} stroke={SK.skinD} strokeWidth={5} />
        <path d="M 690 450 L 760 290" stroke={SK.boneD} strokeWidth={46} strokeLinecap="round" opacity={0.6} />
        <path d="M 690 450 L 760 290" stroke={SK.bone} strokeWidth={36} strokeLinecap="round" />
        <path d="M 772 262 L 815 182" stroke={SK.bone} strokeWidth={30} strokeLinecap="round" />
        {tend("M 700 470 C 720 400 750 320 790 230", FC.epl, 16, Md)}
      </g>
      {/* the hollow (anatomical snuffbox) */}
      <path d="M 500 470 C 560 440 620 440 670 470 C 640 520 600 560 545 575 C 515 560 498 510 500 470 Z" fill={C.forest} opacity={0.08 + 0.14 * e + 0.12 * F} />
      {/* radial artery crosses the floor */}
      {A > 0 && (
        <g opacity={A}>
          <path d="M 0 700 C 300 690 470 690 560 600 C 600 560 630 500 700 440" stroke={C.redDark} strokeWidth={20} fill="none" strokeLinecap="round" />
          <path d="M 0 700 C 300 690 470 690 560 600 C 600 560 630 500 700 440" stroke={C.red} strokeWidth={11} fill="none" strokeLinecap="round" />
        </g>
      )}
      {/* palmar/lateral edge: APL + EPB side by side */}
      {tend("M 0 560 C 260 570 450 590 560 580 C 620 570 660 530 690 480", FC.apl, 18, L)}
      {tend("M 0 530 C 260 540 440 560 545 552 C 610 545 650 510 680 470", FC.epb, 12, L)}
      {/* dorsal/medial edge: EPL hooks round the dorsal tubercle */}
      {tend("M 0 420 C 200 415 330 410 420 400 C 520 390 600 410 680 452", FC.epl, 16, Md)}
    </svg>
  );
};

/* ============ ROTATION: pronation / supination (viewBox 900 x 1000) ============ */
const HandIcon: React.FC<{ palm: boolean; flip: number }> = ({ palm, flip }) => (
  <g transform={`scale(${flip} 1)`}>
    <path d="M -120 -60 C -120 -110 120 -110 120 -60 L 120 60 C 120 110 -120 110 -120 60 Z" fill={palm ? "#F3C3B5" : SK.skin} stroke={SK.skinD} strokeWidth={6} />
    {[-90, -30, 30, 90].map((x, i) => <rect key={i} x={x - 24} y={80} width={48} height={i === 1 || i === 2 ? 130 : 110} rx={24} fill={palm ? "#F3C3B5" : SK.skin} stroke={SK.skinD} strokeWidth={5} />)}
    {/* thumb on the radial side */}
    <rect x={118} y={-40} width={46} height={120} rx={23} fill={palm ? "#F3C3B5" : SK.skin} stroke={SK.skinD} strokeWidth={5} transform="rotate(-30 140 20)" />
    {palm ? (
      <g stroke="#C98A7A" strokeWidth={5} fill="none" strokeLinecap="round">
        <path d="M -90 -20 C -30 0 40 -10 100 -40" />
        <path d="M -90 20 C -20 30 40 20 90 0" />
        <path d="M 40 -70 C 20 -10 20 40 40 90" />
      </g>
    ) : (
      <g fill="#FFFFFF" opacity={0.8}>
        {[-90, -30, 30, 90].map((x, i) => <rect key={i} x={x - 14} y={i === 1 || i === 2 ? 178 : 158} width={28} height={24} rx={8} stroke={SK.skinD} strokeWidth={3} />)}
      </g>
    )}
  </g>
);
export const Rotate: React.FC<{ t: number; prone: number; litPro?: number; litSup?: number }> = ({ t, prone, litPro = 0, litSup = 0 }) => {
  const k = prone; // 0 = palm up (bones parallel), 1 = palm down (radius crosses over the ulna)
  const rTopX = 600, rBotX = 600 - 320 * k;
  const pr = litPro ? ramp(t, litPro, litPro + 0.4) : 0, sp = litSup ? ramp(t, litSup, litSup + 0.4) : 0;
  const flip = Math.cos(Math.PI * k);
  return (
    <svg viewBox="0 0 900 1000" width="100%" height="100%">
      <rect x={200} y={20} width={500} height={100} rx={50} fill={SK.bone} stroke={SK.boneD} strokeWidth={5} />
      <text x={450} y={82} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={SK.boneD}>elbow</text>
      {/* ulna (fixed, little-finger side) */}
      <path d="M 280 110 L 330 110 L 336 700 L 296 708 Z" fill={SK.bone} stroke={SK.boneD} strokeWidth={5} />
      <text x={250} y={420} textAnchor="end" fontFamily={FONT} fontWeight={800} fontSize={36} fill={C.forest}>ulna</text>
      {/* radius (rotates around it) */}
      <path d={`M ${rTopX - 30} 120 L ${rTopX + 30} 120 L ${rBotX + 44} 700 L ${rBotX - 44} 700 Z`} fill="#F4EAC8" stroke={SK.boneD} strokeWidth={5} />
      <text x={rTopX + (rBotX - rTopX) * 0.3 + 60} y={330} fontFamily={FONT} fontWeight={800} fontSize={36} fill={C.forest}>radius</text>
      {/* pronator teres + quadratus */}
      <path d={`M 250 150 Q 420 230 ${rTopX + (rBotX - rTopX) * 0.45} 380`} stroke={FC.pt} strokeWidth={38} fill="none" strokeLinecap="round" opacity={0.3 + 0.7 * pr} />
      <path d={`M 320 640 L ${rTopX + (rBotX - rTopX) * 0.9} 640`} stroke={FC.pq} strokeWidth={50} strokeLinecap="round" opacity={0.3 + 0.7 * pr} />
      {/* supinator wraps the top of the radius */}
      <path d={`M 690 120 C 760 170 ${rTopX + 60} 260 ${rTopX + (rBotX - rTopX) * 0.25 - 20} 300`} stroke={FC.sup} strokeWidth={40} fill="none" strokeLinecap="round" opacity={0.3 + 0.7 * sp} />
      {/* the hand */}
      <g transform={`translate(${(316 + rBotX) / 2} 790)`}>
        <HandIcon palm={flip > 0} flip={Math.max(0.12, Math.abs(flip)) * (flip > 0 ? 1 : -1)} />
      </g>
      <rect x={250} y={930} width={400} height={64} rx={32} fill={k < 0.5 ? FC.sup : FC.pt} stroke={C.forest} strokeWidth={4} />
      <text x={450} y={975} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={C.forest}>{k < 0.5 ? "palm UP" : "palm DOWN"}</text>
    </svg>
  );
};

/* ============ WRIST BOX: 4 corners (viewBox 900 x 700) ============ */
export const WristBox: React.FC<{ t: number; rad?: number; uln?: number }> = ({ t, rad = 0, uln = 0 }) => {
  const r = rad ? ramp(t, rad, rad + 0.4) : 0, u = uln ? ramp(t, uln, uln + 0.4) : 0;
  const tilt = -14 * r * (1 - u) + 14 * u;
  const corner = (x: number, y: number, id: string, on: number, txt: string) => (
    <g>
      <circle cx={x} cy={y} r={58} fill={FC[id]} stroke={C.forest} strokeWidth={5} opacity={0.35 + 0.65 * on} />
      <text x={x} y={y + 13} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill={C.forest}>{txt}</text>
    </g>
  );
  return (
    <svg viewBox="0 0 900 700" width="100%" height="100%">
      <g transform={`rotate(${tilt} 450 350)`}>
        <rect x={210} y={150} width={480} height={400} rx={60} fill={C.card} stroke={C.forest} strokeWidth={6} />
        <text x={450} y={120} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={C.matcha}>FRONT · flexors</text>
        <text x={450} y={610} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={C.matcha}>BACK · extensors</text>
        <text x={450} y={330} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill={C.forest}>WRIST</text>
        <text x={450} y={385} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={28} fill={C.matcha}>thumb side ← → little finger side</text>
        {corner(210, 150, "fcr", r, "FCR")}
        {corner(210, 550, "ecrl", r, "ECR")}
        {corner(690, 150, "fcu", u, "FCU")}
        {corner(690, 550, "ecu", u, "ECU")}
      </g>
    </svg>
  );
};
