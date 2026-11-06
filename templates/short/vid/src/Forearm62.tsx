import React from "react";
import { C, ramp } from "./kit";

/**
 * Our own diagrams (Book Plume) for the palmaris longus short.
 * ForearmDiagram: LEFT forearm, front (anterior) view like Gray's Fig. 414 — medial epicondyle top-left, thumb side right.
 * Native size 800 x 1000.
 */
export type M = "PT" | "FCR" | "PL" | "FDS" | "FCU";
export const MUS: M[] = ["PT", "FCR", "PL", "FDS", "FCU"];
export const MNAME: Record<M, string> = { PT: "Pronator teres", FCR: "Flexor carpi radialis", PL: "Palmaris longus", FDS: "Flexor digitorum superficialis", FCU: "Flexor carpi ulnaris" };
export const FINGER: Record<M, string> = { PT: "Thumb", FCR: "Index", PL: "Middle", FDS: "Ring", FCU: "Pinky" };
export const MCOL: Record<M, string> = { PT: "#E0928A", FCR: "#7FA0CC", PL: "#F2D14E", FDS: "#B59AD8", FCU: "#63B5A3" };
const DARK: Record<M, string> = { PT: "#9C4F45", FCR: "#3F5F8C", PL: "#A88A1C", FDS: "#6E5596", FCU: "#2F7466" };
const RAW = "#D9BBA6", RAWD = "#9C7663";

type P2 = [number, number];
const bez = (p: P2[], t: number): P2 => {
  const u = 1 - t;
  return [
    u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0],
    u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1],
  ];
};
const ss = (a: number, b: number, x: number) => {
  const k = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return k * k * (3 - 2 * k);
};
/** width profile: narrow common tendon at origin, belly, taper to tendon at tb */
const wprof = (t: number, wmax: number, tb: number, tw: number, w0 = 16) => {
  if (t >= tb) return tw;
  const rise = ss(0, tb * 0.35, t), fall = ss(tb * 0.45, tb, t);
  return w0 + (wmax - w0) * rise - (wmax - tw) * fall;
};
const N = 40;
const band = (p: P2[], wmax: number, tb: number, tw: number, t0 = 0, t1 = 1, off = 0) => {
  const L: string[] = [], R: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = t0 + ((t1 - t0) * i) / N;
    const [x, y] = bez(p, t);
    const [x2, y2] = bez(p, Math.min(1, t + 0.01));
    const [x1, y1] = bez(p, Math.max(0, t - 0.01));
    let nx = -(y2 - y1), ny = x2 - x1;
    const l = Math.hypot(nx, ny) || 1;
    nx /= l; ny /= l;
    const w = wprof(t, wmax, tb, tw) / 2;
    L.push(`${(x + nx * (w * (1 + off))).toFixed(1)} ${(y + ny * (w * (1 + off))).toFixed(1)}`);
    R.push(`${(x - nx * (w * (1 - off))).toFixed(1)} ${(y - ny * (w * (1 - off))).toFixed(1)}`);
  }
  return "M" + L.join(" L") + " L" + R.reverse().join(" L") + " Z";
};
/** a line inside the band at relative offset f (-1..1) */
const fiber = (p: P2[], wmax: number, tb: number, tw: number, f: number, t0: number, t1: number) => {
  const pts: string[] = [];
  for (let i = 0; i <= 24; i++) {
    const t = t0 + ((t1 - t0) * i) / 24;
    const [x, y] = bez(p, t);
    const [x2, y2] = bez(p, Math.min(1, t + 0.01));
    const [x1, y1] = bez(p, Math.max(0, t - 0.01));
    let nx = -(y2 - y1), ny = x2 - x1;
    const l = Math.hypot(nx, ny) || 1;
    nx /= l; ny /= l;
    const w = (wprof(t, wmax, tb, tw) / 2) * f;
    pts.push(`${(x + nx * w).toFixed(1)} ${(y + ny * w).toFixed(1)}`);
  }
  return "M" + pts.join(" L");
};

type Spec = { p: P2[]; wmax: number; tb: number; tw: number };
const SPEC: Record<M, Spec> = {
  FDS: { p: [[222, 150], [320, 360], [372, 560], [405, 720]], wmax: 230, tb: 1.0, tw: 120 },
  PT: { p: [[206, 124], [330, 200], [500, 330], [598, 474]], wmax: 96, tb: 0.86, tw: 30 },
  FCR: { p: [[212, 130], [300, 330], [440, 560], [500, 880]], wmax: 86, tb: 0.56, tw: 22 },
  PL: { p: [[204, 134], [246, 300], [326, 500], [402, 850]], wmax: 62, tb: 0.46, tw: 13 },
  FCU: { p: [[194, 128], [168, 400], [214, 650], [268, 848]], wmax: 104, tb: 0.8, tw: 28 },
};
export const MANCHOR: Record<M | "EPI" | "PLT" | "APO", P2> = {
  PT: bez(SPEC.PT.p, 0.55),
  FCR: bez(SPEC.FCR.p, 0.3),
  PL: bez(SPEC.PL.p, 0.25),
  FDS: [392, 660],
  FCU: bez(SPEC.FCU.p, 0.42),
  EPI: [176, 112],
  PLT: bez(SPEC.PL.p, 0.8),
  APO: [404, 920],
};
const FDS_TENDONS: [P2, P2, P2][] = [
  [[350, 700], [338, 860], [318, 1000]],
  [[385, 705], [380, 860], [376, 1000]],
  [[420, 705], [430, 860], [438, 1000]],
  [[452, 700], [478, 860], [496, 1000]],
];

export const ForearmDiagram: React.FC<{
  t: number;
  w: number;
  lit: Partial<Record<M, number>>;
  glow?: M[];
  dim?: number; // 0 = unlit muscles in neutral muscle colour, >0 = fade them out
  id: string;
  ghost?: number; // opacity of unlit muscles
}> = ({ t, w, lit, glow = [], id, ghost = 1 }) => {
  const k = w / 800;
  const on = (m: M) => {
    const t0 = lit[m];
    if (t0 === undefined) return 0;
    return ramp(t, t0 - 0.05, t0 + 0.25);
  };
  const pulse = 0.6 + 0.4 * Math.sin(t * 9);
  const mix = (m: M, c1: string, c2: string) => (on(m) > 0.5 ? c2 : c1);
  const muscle = (m: M) => {
    const s = SPEC[m];
    const o = on(m);
    const g = glow.includes(m);
    const t1 = s.tb;
    return (
      <g key={m} opacity={ghost + (1 - ghost) * o}>
        {g && <path d={band(s.p, s.wmax, s.tb, s.tw)} fill="none" stroke={C.banana} strokeWidth={26} strokeLinejoin="round" opacity={0.75 * pulse} />}
        <path d={band(s.p, s.wmax, s.tb, s.tw)} fill={RAW} stroke={C.forest} strokeWidth={5} strokeLinejoin="round" />
        <path d={band(s.p, s.wmax, s.tb, s.tw)} fill={MCOL[m]} opacity={o} />
        {/* tendon part is lighter */}
        <path d={band(s.p, s.wmax, s.tb, s.tw, Math.min(1, t1 + 0.02), 1)} fill="#FFF8E8" opacity={0.55} />
        {/* fibres */}
        {[-0.62, -0.3, 0, 0.3, 0.62].map((f) => (
          <path key={f} d={fiber(s.p, s.wmax, s.tb, s.tw, f, 0.06, Math.max(0.1, t1 - 0.03))} fill="none" stroke={mix(m, RAWD, DARK[m])} strokeWidth={2.2} opacity={0.5} strokeLinecap="round" />
        ))}
        {/* highlight */}
        <path d={fiber(s.p, s.wmax, s.tb, s.tw, 0.78, 0.1, Math.max(0.12, t1 - 0.08))} fill="none" stroke="#FFFDF2" strokeWidth={5} opacity={0.55} strokeLinecap="round" />
      </g>
    );
  };
  const fds = SPEC.FDS;
  const oF = on("FDS");
  const gF = glow.includes("FDS");
  const oPL = on("PL");
  return (
    <svg width={800 * k} height={1000 * k} viewBox="0 0 800 1000" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={`skin-${id}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#E9C7AA" />
          <stop offset="0.5" stopColor="#F6E0CB" />
          <stop offset="1" stopColor="#E6C2A4" />
        </linearGradient>
        <clipPath id={`arm-${id}`}>
          <path d="M150 40 C140 250 210 600 270 830 L250 1000 L565 1000 L530 830 C590 600 665 280 650 40 Z" />
        </clipPath>
      </defs>
      {/* skin silhouette */}
      <path d="M150 40 C140 250 210 600 270 830 L250 1000 L565 1000 L530 830 C590 600 665 280 650 40 Z" fill={`url(#skin-${id})`} stroke={C.forest} strokeWidth={6} />
      <g clipPath={`url(#arm-${id})`}>
        {/* brachioradialis (context, not part of the five) */}
        <path d={band([[600, 40], [640, 300], [600, 560], [540, 860]], 150, 0.6, 26)} fill="#E8D5C3" stroke={C.forest} strokeWidth={4} opacity={0.9} />
        {/* biceps tendon / aponeurosis hint */}
        <path d="M400 30 L380 150 L420 150 Z" fill="#FFF8E8" stroke={C.forest} strokeWidth={3} opacity={0.8} />
        {/* FDS: deeper, wide, 4 tendons */}
        <g opacity={ghost + (1 - ghost) * oF}>
          {FDS_TENDONS.map(([a, b, c], i) => (
            <path key={i} d={`M${a[0]} ${a[1]} Q${b[0]} ${b[1]} ${c[0]} ${c[1]}`} fill="none" stroke={C.forest} strokeWidth={22} strokeLinecap="round" />
          ))}
          {FDS_TENDONS.map(([a, b, c], i) => (
            <path key={"i" + i} d={`M${a[0]} ${a[1]} Q${b[0]} ${b[1]} ${c[0]} ${c[1]}`} fill="none" stroke={oF > 0.5 ? "#DCCDF0" : "#FFF6E6"} strokeWidth={13} strokeLinecap="round" />
          ))}
          {gF && <path d={band(fds.p, fds.wmax, fds.tb, fds.tw)} fill="none" stroke={C.banana} strokeWidth={26} opacity={0.75 * pulse} />}
          <path d={band(fds.p, fds.wmax, fds.tb, fds.tw)} fill={RAW} stroke={C.forest} strokeWidth={5} />
          <path d={band(fds.p, fds.wmax, fds.tb, fds.tw)} fill={MCOL.FDS} opacity={oF} />
          {[-0.7, -0.4, -0.1, 0.2, 0.5, 0.75].map((f) => (
            <path key={f} d={fiber(fds.p, fds.wmax, fds.tb, fds.tw, f, 0.08, 0.98)} fill="none" stroke={oF > 0.5 ? DARK.FDS : RAWD} strokeWidth={2.2} opacity={0.45} />
          ))}
        </g>
        {muscle("PT")}
        {muscle("FCU")}
        {muscle("FCR")}
        {/* flexor retinaculum (PL passes OVER it) */}
        <rect x={262} y={828} width={276} height={46} rx={18} fill="#FFF8E8" stroke={C.forest} strokeWidth={4} />
        {[290, 330, 370, 410, 450, 490].map((x) => (
          <line key={x} x1={x} y1={834} x2={x + 14} y2={868} stroke={RAWD} strokeWidth={2} opacity={0.45} />
        ))}
        {/* pisiform (FCU insertion) */}
        <ellipse cx={268} cy={852} rx={26} ry={22} fill="#EFE6CC" stroke={C.forest} strokeWidth={4} />
        {/* palm + palmar aponeurosis (PL insertion) */}
        <path d="M402 862 L300 1000 L512 1000 Z" fill={oPL > 0.5 ? "#F8E7A0" : "#FFF3DE"} stroke={C.forest} strokeWidth={4} opacity={ghost + (1 - ghost) * oPL} />
        {[330, 380, 430, 480].map((x) => (
          <line key={x} x1={402} y1={866} x2={x} y2={1000} stroke={oPL > 0.5 ? DARK.PL : RAWD} strokeWidth={2.5} opacity={0.5 * (ghost + (1 - ghost) * oPL)} />
        ))}
        {muscle("PL")}
      </g>
      {/* medial epicondyle (bony knob) */}
      <path d="M150 70 C110 80 108 140 150 152 C190 160 238 150 246 120 C252 92 214 64 150 70 Z" fill="#EFE6CC" stroke={C.forest} strokeWidth={6} />
      <path d="M140 100 C160 92 190 92 214 104" fill="none" stroke={C.forest} strokeWidth={3} opacity={0.35} />
      {/* outline on top for crispness */}
      <path d="M150 40 C140 250 210 600 270 830 L250 1000 M565 1000 L530 830 C590 600 665 280 650 40" fill="none" stroke={C.forest} strokeWidth={6} />
    </svg>
  );
};

/**
 * Our own hand diagram for the palmaris longus test (Schaeffer's test): palm facing the viewer, fingers up, thumb on the right.
 * touch 0..1 = thumb and pinky meet; flex 0..1 = wrist flexion; tendon 0..1 = PL tendon raised in the middle of the wrist.
 * Native size 800 x 1000.
 */
const SK = "#F3D7BE", SKD = "#D9AE8C";
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const lp = (a: P2, b: P2, k: number): P2 => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
export const HandDiagram: React.FC<{ t: number; w: number; touch: number; flex: number; tendon: number; glowThumb?: number; glowPinky?: number; id: string }> = ({ t, w, touch, flex, tendon, glowThumb = 0, glowPinky = 0, id }) => {
  const k = w / 800;
  const pulse = 0.6 + 0.4 * Math.sin(t * 9);
  const Mt: P2 = [402, 392];
  // finger as a thick stroked path with outline
  const finger = (d: string, wd: number, key: string, glow = 0) => (
    <g key={key}>
      {glow > 0 && <path d={d} fill="none" stroke={C.banana} strokeWidth={wd + 34} strokeLinecap="round" opacity={glow * pulse} />}
      <path d={d} fill="none" stroke={C.forest} strokeWidth={wd + 11} strokeLinecap="round" />
      <path d={d} fill="none" stroke={SK} strokeWidth={wd} strokeLinecap="round" />
      <path d={d} fill="none" stroke="#FFF1E2" strokeWidth={wd * 0.22} strokeLinecap="round" opacity={0.6} transform="translate(-9 0)" />
    </g>
  );
  // pinky: straight -> curls toward Mt
  const pB: P2 = [300, 318];
  const pTip = lp([284, 190], [Mt[0] - 8, Mt[1] - 6], touch);
  const pC = lp([292, 254], [312, 214], touch);
  // thumb: base right of palm -> sweeps across to Mt
  const tB: P2 = [532, 520];
  const tTip = lp([655, 360], [Mt[0] + 10, Mt[1] + 4], touch);
  const tC = lp([600, 430], [560, 352], touch);
  const sy = 1 - 0.16 * flex; // foreshortening when the wrist flexes toward the viewer
  const hy = 40 * flex;
  return (
    <svg width={800 * k} height={1000 * k} viewBox="0 0 800 1000" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={`fa-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#E5BE9E" />
          <stop offset="0.5" stopColor="#F6DFC8" />
          <stop offset="1" stopColor="#E2BA99" />
        </linearGradient>
        <radialGradient id={`palm-${id}`} cx="0.5" cy="0.55" r="0.6">
          <stop offset="0" stopColor="#F9E6D3" />
          <stop offset="1" stopColor="#EBC7A8" />
        </radialGradient>
      </defs>
      {/* forearm + wrist */}
      <path d="M268 1000 C276 860 282 720 292 610 L508 610 C518 720 524 860 532 1000 Z" fill={`url(#fa-${id})`} stroke={C.forest} strokeWidth={6} />
      {/* wrist creases */}
      <path d="M300 640 Q400 656 500 640" fill="none" stroke={SKD} strokeWidth={4} opacity={0.7} />
      <path d="M298 668 Q400 680 502 668" fill="none" stroke={SKD} strokeWidth={3} opacity={0.5 + 0.4 * flex} />
      {/* FCR tendon faint beside it */}
      <path d="M452 660 Q446 800 440 930" fill="none" stroke={SKD} strokeWidth={6} opacity={0.25 + 0.35 * flex} strokeLinecap="round" />
      {/* palmaris longus tendon: raised cord in the midline */}
      {tendon > 0 && (
        <g>
          <path d="M402 650 Q400 790 396 940" fill="none" stroke={C.banana} strokeWidth={46} strokeLinecap="round" opacity={0.55 * tendon * pulse} />
          <path d="M410 650 Q408 790 404 940" fill="none" stroke="#B88A68" strokeWidth={14} strokeLinecap="round" opacity={0.6 * tendon} />
          <path d="M398 650 Q396 790 392 940" fill="none" stroke="#FFF6EA" strokeWidth={12 * tendon} strokeLinecap="round" />
          <path d="M398 650 Q396 790 392 940" fill="none" stroke={C.forest} strokeWidth={2.5} strokeLinecap="round" opacity={0.5 * tendon} strokeDasharray="2 10" />
        </g>
      )}
      <g transform={`translate(0 ${hy}) translate(400 610) scale(1 ${sy}) translate(-400 -610)`}>
        {/* ring, middle, index */}
        {finger("M352 312 L350 150", 54, "ring")}
        {finger("M412 306 L414 118", 58, "mid")}
        {finger("M472 314 L484 148", 54, "idx")}
        {/* palm */}
        <path d="M282 330 C276 300 300 286 330 288 L480 290 C512 292 528 312 526 350 L530 520 C534 580 500 616 450 618 L350 618 C300 616 276 580 278 520 Z" fill={`url(#palm-${id})`} stroke={C.forest} strokeWidth={6} />
        {/* thenar bulge + creases */}
        <path d="M520 420 C470 470 452 540 470 612" fill="none" stroke={SKD} strokeWidth={4} opacity={0.8} />
        <path d="M296 420 C360 400 430 412 500 380" fill="none" stroke={SKD} strokeWidth={4} opacity={0.7} />
        <path d="M300 470 C370 450 420 470 470 440" fill="none" stroke={SKD} strokeWidth={3.5} opacity={0.6} />
        {/* pinky + thumb (animated) */}
        {finger(`M${pB[0]} ${pB[1]} Q${pC[0]} ${pC[1]} ${pTip[0]} ${pTip[1]}`, 46, "pinky", glowPinky)}
        {finger(`M${tB[0]} ${tB[1]} Q${tC[0]} ${tC[1]} ${tTip[0]} ${tTip[1]}`, 60, "thumb", glowThumb)}
        {touch > 0.95 && <circle cx={Mt[0] + 2} cy={Mt[1]} r={18 + 30 * (1 - Math.min(1, (touch - 0.95) * 20))} fill="none" stroke={C.banana} strokeWidth={6} opacity={0.9} />}
      </g>
    </svg>
  );
};
