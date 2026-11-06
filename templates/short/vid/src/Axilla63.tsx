import React from "react";
import { C, ramp } from "./kit";

/**
 * Book Plume original schematic: RIGHT axilla, front view (like Gray's 1918 Fig. 523).
 * Viewer's left = lateral (arm, humerus); viewer's right = medial (chest wall, ribs).
 * The axillary artery runs from the lateral border of the 1st rib (top right) to the lower border of teres major,
 * where it becomes the brachial artery. Pectoralis minor crosses it → parts 1 / 2 / 3. viewBox 860 x 860.
 */
export type Part = "AX" | "BR" | "PM" | "TM" | "P1" | "P2" | "P3" | "ST" | "TA" | "LT" | "SS" | "PCH" | "ACH" | "R1";
type P = [number, number];

export const mix = (a: string, b: string, k: number) => {
  const h = (s: string) => [1, 3, 5].map((j) => parseInt(s.slice(j, j + 2), 16));
  const x = h(a), y = h(b);
  return "#" + x.map((v, j) => Math.round(v + (y[j] - v) * Math.max(0, Math.min(1, k))).toString(16).padStart(2, "0")).join("");
};

/* Catmull-Rom → cubic Bézier path */
const smooth = (pts: P[], closed = false, tension = 0.5) => {
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
/* dense sampling of the same Catmull-Rom curve, for points at an arc-length fraction */
const sample = (pts: P[], per = 40) => {
  const n = pts.length;
  const g = (i: number) => pts[Math.max(0, Math.min(n - 1, i))];
  const out: P[] = [];
  for (let i = 0; i < n - 1; i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
    const c1: P = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: P = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    for (let k = 0; k < per; k++) {
      const t = k / per, u = 1 - t;
      out.push([
        u * u * u * p1[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p2[0],
        u * u * u * p1[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p2[1],
      ]);
    }
  }
  out.push(pts[n - 1]);
  const L = [0];
  for (let i = 1; i < out.length; i++) L.push(L[i - 1] + Math.hypot(out[i][0] - out[i - 1][0], out[i][1] - out[i - 1][1]));
  return { out, L, tot: L[L.length - 1] };
};
const at = (s: ReturnType<typeof sample>, u: number): P => {
  const d = Math.max(0, Math.min(1, u)) * s.tot;
  let i = 1;
  while (i < s.L.length - 1 && s.L[i] < d) i++;
  const k = (d - s.L[i - 1]) / (s.L[i] - s.L[i - 1] || 1);
  return [s.out[i - 1][0] + (s.out[i][0] - s.out[i - 1][0]) * k, s.out[i - 1][1] + (s.out[i][1] - s.out[i - 1][1]) * k];
};
const sub = (s: ReturnType<typeof sample>, u0: number, u1: number) => {
  const pts: string[] = [];
  for (let i = 0; i <= 30; i++) {
    const p = at(s, u0 + ((u1 - u0) * i) / 30);
    pts.push(`${p[0].toFixed(1)} ${p[1].toFixed(1)}`);
  }
  return "M" + pts.join(" L");
};
const add = (o: P, d: P): P => [o[0] + d[0], o[1] + d[1]];

/* ---------- geometry ---------- */
const ART_PTS: P[] = [[808, 142], [705, 212], [574, 300], [452, 384], [342, 462], [252, 540], [190, 640], [160, 760], [150, 880]];
const ART = sample(ART_PTS);
export const U = { start: 0.035, ST: 0.14, pm0: 0.335, TA: 0.37, LT: 0.46, pm1: 0.5, SS: 0.575, PCH: 0.64, ACH: 0.675, tm: 0.735 };
export const art = (u: number) => at(ART, u);

const oST = art(U.ST), oTA = art(U.TA), oLT = art(U.LT), oSS = art(U.SS), oPCH = art(U.PCH), oACH = art(U.ACH);
const TA_TOP = add(oTA, [8, -96]);
const BR: Record<string, P[]> = {
  ST: [oST, add(oST, [44, 34]), add(oST, [104, 62]), add(oST, [170, 76])],
  ST_t1: [add(oST, [104, 62]), add(oST, [128, 104]), add(oST, [140, 150])],
  TA: [oTA, add(oTA, [-6, -50]), TA_TOP],
  TA_cl: [TA_TOP, add(TA_TOP, [40, -34]), add(TA_TOP, [96, -52])],
  TA_ac: [TA_TOP, add(TA_TOP, [-70, -30]), add(TA_TOP, [-170, -40]), add(TA_TOP, [-260, -36])],
  TA_de: [TA_TOP, add(TA_TOP, [-60, 6]), add(TA_TOP, [-150, 40]), add(TA_TOP, [-215, 86])],
  TA_pe: [TA_TOP, add(TA_TOP, [60, 4]), add(TA_TOP, [130, 34]), add(TA_TOP, [190, 82])],
  LT: [oLT, add(oLT, [36, 80]), add(oLT, [90, 190]), add(oLT, [140, 300]), add(oLT, [176, 392])],
  LT_t: [add(oLT, [90, 190]), add(oLT, [140, 196]), add(oLT, [196, 214])],
  SS: [oSS, add(oSS, [34, 70]), add(oSS, [70, 150]), add(oSS, [86, 196])],
  SS_cs: [add(oSS, [86, 196]), add(oSS, [140, 196]), add(oSS, [196, 176]), add(oSS, [236, 182])],
  SS_td: [add(oSS, [86, 196]), add(oSS, [90, 260]), add(oSS, [104, 330]), add(oSS, [128, 392])],
  PCH: [oPCH, add(oPCH, [-50, -8]), add(oPCH, [-104, -26]), add(oPCH, [-150, -52])],
  ACH: [oACH, add(oACH, [-46, 12]), add(oACH, [-96, 14]), add(oACH, [-132, 4])],
};
/** anchor points (diagram coords) for labels */
export const ANCHOR: Record<string, P> = {
  ST: add(oST, [130, 70]),
  TA: add(oTA, [-2, -60]),
  LT: add(oLT, [104, 230]),
  SS: add(oSS, [60, 130]),
  PCH: add(oPCH, [-120, -40]),
  ACH: add(oACH, [-112, 12]),
  P1: art(0.22),
  P2: art(0.42),
  P3: art(0.64),
  R1: [826, 120],
  TMB: art(U.tm),
  BR: art(0.86),
  PM: [600, 560],
};

/* pectoralis minor: coracoid (top left) → ribs 3–5 (bottom right) */
const PM_A: P = [262, 170], PM_B: P = [770, 708];
const pmBand = (() => {
  const dx = PM_B[0] - PM_A[0], dy = PM_B[1] - PM_A[1];
  const l = Math.hypot(dx, dy);
  const nx = -dy / l, ny = dx / l;
  const w0 = 24, w1 = 104; // half widths at coracoid / at the ribs
  const L: P[] = [], R: P[] = [];
  for (let i = 0; i <= 10; i++) {
    const k = i / 10;
    const w = w0 + (w1 - w0) * Math.pow(k, 0.6);
    const c: P = [PM_A[0] + dx * k, PM_A[1] + dy * k];
    L.push([c[0] + nx * w, c[1] + ny * w]);
    R.push([c[0] - nx * w, c[1] - ny * w]);
  }
  return { L, R, nx, ny, dx, dy };
})();
const PM_PATH = smooth([...pmBand.L, ...pmBand.R.slice().reverse()], true, 0.3);
const PM_FIB = [-0.75, -0.4, 0, 0.4, 0.75].map((f) => {
  const pts: P[] = [];
  for (let i = 1; i <= 9; i++) {
    const k = i / 10;
    const w = (24 + 80 * Math.pow(k, 0.6)) * f;
    pts.push([PM_A[0] + pmBand.dx * k + pmBand.nx * w, PM_A[1] + pmBand.dy * k + pmBand.ny * w]);
  }
  return smooth(pts);
});

/* teres major: lower border passes through the artery at U.tm, muscle above it, from scapula (bottom right) to humerus (left) */
const TMB = art(U.tm);
const TM_DIR: P = [-1, -0.58];
const tmL = (k: number, off: number): P => {
  const l = Math.hypot(TM_DIR[0], TM_DIR[1]);
  const dx = TM_DIR[0] / l, dy = TM_DIR[1] / l;
  return [TMB[0] + dx * k - dy * off, TMB[1] + dy * k + dx * off]; // off > 0 = above the lower border (up-right)
};
const TM_PATH = smooth([tmL(110, 0), tmL(-120, 6), tmL(-330, 30), tmL(-360, 120), tmL(-150, 128), tmL(110, 92)], true, 0.35);
const TM_LOWER = `M${tmL(110, 0).join(" ")} L${tmL(-360, 30).join(" ")}`;

/* bones */
const HUM_SHAFT = smooth([[30, 300], [118, 296], [140, 520], [150, 880], [44, 880], [40, 520]], true, 0.3);
const CLAV = smooth([[0, 70], [140, 50], [330, 76], [520, 58], [700, 44], [860, 60], [860, 104], [700, 92], [520, 104], [330, 120], [140, 96], [0, 112]], true, 0.4);
const CORACOID = smooth([[236, 116], [282, 122], [292, 160], [270, 186], [246, 176], [252, 150], [226, 140]], true, 0.5);
const RIB1 = smooth([[790, 40], [770, 120], [790, 220], [840, 290], [880, 300], [880, 220], [838, 170], [826, 100], [840, 40]], true, 0.5);
const RIBS = [0, 1, 2, 3].map((i) => smooth([[900, 270 + i * 140], [800, 300 + i * 150], [690, 360 + i * 156], [600, 430 + i * 160]]));
const SUBSC = smooth([[300, 640], [380, 560], [500, 540], [590, 600], [620, 760], [600, 900], [330, 900], [300, 780]], true, 0.4);
const SERR = [0, 1, 2, 3].map((i) => smooth([[880, 330 + i * 140], [770, 360 + i * 150], [690, 420 + i * 158], [660, 468 + i * 160], [720, 440 + i * 150], [830, 392 + i * 142], [900, 380 + i * 140]], true, 0.4));

export const COLS = {
  art: { fill: "#D8574B", dark: "#A23125", light: "#FFD9CF" },
  muscle: { fill: "#D9907E", dark: "#9B5444" },
  bone: { fill: "#F1E8CC", dark: "#B7A577" },
};
export const BCOL: Record<string, string> = { ST: "#E58B7F", TA: "#E8A44E", LT: "#7FA0CC", SS: "#B59AD8", PCH: "#63B5A3", ACH: "#9BBE5A" };

const Tube: React.FC<{ d: string; width: number; g?: number; glowA?: number; op?: number; col?: string; behind?: boolean }> = ({ d, width, g = 1, glowA = 0, op = 1, col, behind }) => {
  if (g <= 0) return null;
  const dash = g >= 1 ? undefined : `${g} 1`;
  const c = COLS.art;
  const Pth = (p: React.SVGProps<SVGPathElement>) => <path d={d} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={dash} {...p} />;
  return (
    <g opacity={op}>
      {glowA > 0 && Pth({ stroke: C.banana, strokeWidth: width + 28, opacity: glowA * 0.95 })}
      {Pth({ stroke: C.forest, strokeWidth: width + 8 })}
      {Pth({ stroke: behind ? mix(c.dark, C.paper, 0.35) : c.dark, strokeWidth: width })}
      {Pth({ stroke: col ?? c.fill, strokeWidth: width * 0.62, transform: "translate(-1.2 -1)" })}
      {Pth({ stroke: c.light, strokeWidth: Math.max(2, width * 0.16), opacity: 0.6, transform: `translate(${-width * 0.16} ${-width * 0.1})` })}
    </g>
  );
};

export const AxillaDiagram: React.FC<{
  t: number;
  w?: number;
  lit?: Partial<Record<Part, number>>;
  glow?: Part[];
  grow?: number; // artery grow-in start time
  ghost?: number; // 0..1 visibility of unlit branches
  pm?: number; // 0..1 pectoralis minor opacity
  parts?: number; // part-band highlight visibility
  flow?: number; // pulse travelling down the artery (start time)
  id?: string;
}> = ({ t, w = 860, lit = {}, glow = [], grow, ghost = 0.35, pm = 1, parts = 0, flow, id = "ax" }) => {
  const on = (p: Part) => (lit[p] === undefined ? 0 : ramp(t, lit[p]! - 0.05, lit[p]! + 0.3));
  const halo = (p: Part) => (glow.includes(p) ? on(p) * (0.6 + 0.4 * Math.sin(t * 7)) : 0);
  const gA = grow === undefined ? 1 : ramp(t, grow, grow + 0.9);
  const br = (p: Part) => ghost + (1 - ghost) * on(p);
  const bcol = (p: Part) => mix(mix(COLS.art.fill, C.paper, 0.45), BCOL[p] ?? COLS.art.fill, on(p));
  const BT = (k: string, p: Part, width: number, behind = false) => {
    const d = smooth(BR[k]);
    const grown = ramp(t, (lit[p] ?? -9) - 0.1, (lit[p] ?? -9) + 0.5);
    return (
      <g key={k}>
        <Tube d={d} width={width} op={br(p) * gA} glowA={halo(p)} col={bcol(p)} behind={behind} />
        {on(p) > 0 && grown < 1 && <path d={d} fill="none" stroke="#FFF6C8" strokeWidth={width * 0.4} strokeLinecap="round" pathLength={1} strokeDasharray={`0.12 1`} strokeDashoffset={-grown + 0.12} />}
      </g>
    );
  };
  const pmL = on("PM"), tmL_ = on("TM");
  const segBand = (p: "P1" | "P2" | "P3", u0: number, u1: number, col: string) => {
    const a = on(p) * parts;
    if (a <= 0) return null;
    return <path d={sub(ART, u0, u0 + (u1 - u0) * ramp(t, lit[p]! - 0.05, lit[p]! + 0.45))} fill="none" stroke={col} strokeWidth={66} strokeLinecap="round" opacity={0.55 * a} />;
  };
  const sh = flow === undefined || t < flow ? -1 : ((t - flow) % 1.6) / 1.6;
  return (
    <svg width={w} height={w} viewBox="0 0 860 860" style={{ overflow: "visible", display: "block" }}>
      <defs>
        <linearGradient id={`${id}bone`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFBEA" />
          <stop offset="100%" stopColor="#E6DAB5" />
        </linearGradient>
        <linearGradient id={`${id}mus`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E7A796" />
          <stop offset="100%" stopColor="#C97C69" />
        </linearGradient>
        <clipPath id={`${id}clip`}>
          <rect x={-20} y={-20} width={900} height={900} rx={40} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}clip)`}>
        {/* chest wall: ribs 2–5 + serratus anterior digitations */}
        {RIBS.map((d, i) => (
          <g key={i} opacity={0.75}>
            <path d={d} fill="none" stroke={mix(COLS.bone.dark, C.forest, 0.3)} strokeWidth={46} strokeLinecap="round" />
            <path d={d} fill="none" stroke={`url(#${id}bone)`} strokeWidth={38} strokeLinecap="round" />
          </g>
        ))}
        {SERR.map((d, i) => (
          <path key={i} d={d} fill={mix("#E3AE9F", C.paper, 0.35)} stroke={mix(COLS.muscle.dark, C.paper, 0.3)} strokeWidth={3} opacity={0.8} />
        ))}
        {/* subscapularis (on the front of the scapula, behind the artery) */}
        <path d={SUBSC} fill={mix("#DDA492", C.paper, 0.3)} stroke={mix(COLS.muscle.dark, C.paper, 0.2)} strokeWidth={4} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M${330 + i * 46} ${890} C${350 + i * 40} ${760} ${400 + i * 30} ${650} ${450 + i * 22} ${580}`} fill="none" stroke={COLS.muscle.dark} strokeWidth={2} opacity={0.3} />
        ))}
        {/* teres major */}
        <g>
          {tmL_ > 0 && <path d={TM_PATH} fill="none" stroke={C.banana} strokeWidth={26} opacity={halo("TM") || 0.7 * tmL_} strokeLinejoin="round" />}
          <path d={TM_PATH} fill={mix(mix("#D9907E", C.paper, 0.25), "#E0786A", tmL_)} stroke={mix(COLS.muscle.dark, C.forest, 0.3)} strokeWidth={5} strokeLinejoin="round" />
          {[0.25, 0.5, 0.75].map((f, i) => (
            <path key={i} d={`M${tmL(90, 92 * f).join(" ")} L${tmL(-340, 30 + 95 * f).join(" ")}`} stroke="#FFFFFF" strokeWidth={2} opacity={0.35} />
          ))}
          {tmL_ > 0 && <path d={TM_LOWER} stroke={C.forest} strokeWidth={7} strokeDasharray="14 10" opacity={tmL_} />}
        </g>
        {/* humerus */}
        <path d={HUM_SHAFT} fill={`url(#${id}bone)`} stroke={mix(COLS.bone.dark, C.forest, 0.4)} strokeWidth={5} />
        <circle cx={66} cy={232} r={104} fill={`url(#${id}bone)`} stroke={mix(COLS.bone.dark, C.forest, 0.4)} strokeWidth={5} />
        <path d="M120 152 C150 196 156 250 136 300" fill="none" stroke={mix(COLS.bone.dark, C.forest, 0.2)} strokeWidth={3} opacity={0.6} />
        {/* posterior circumflex humeral passes BEHIND the humerus: drawn under it */}
        {/* clavicle, coracoid, 1st rib */}
        <path d={CLAV} fill={`url(#${id}bone)`} stroke={mix(COLS.bone.dark, C.forest, 0.4)} strokeWidth={5} />
        <path d={CORACOID} fill={`url(#${id}bone)`} stroke={mix(COLS.bone.dark, C.forest, 0.4)} strokeWidth={5} />
        <g>
          {on("R1") > 0 && <path d={RIB1} fill="none" stroke={C.banana} strokeWidth={24} opacity={on("R1") * 0.9} />}
          <path d={RIB1} fill={`url(#${id}bone)`} stroke={mix(COLS.bone.dark, C.forest, 0.4)} strokeWidth={5} />
        </g>
        {/* part highlights under the artery */}
        {segBand("P1", U.start, U.pm0, "#E58B7F")}
        {segBand("P2", U.pm0, U.pm1, "#E8A44E")}
        {segBand("P3", U.pm1, U.tm, "#B59AD8")}
        {/* branches (behind the main trunk) */}
        {BT("PCH", "PCH", 16, true)}
        {BT("ST_t1", "ST", 9)}
        {BT("ST", "ST", 15)}
        {BT("TA_ac", "TA", 11)}
        {BT("TA_de", "TA", 11)}
        {BT("TA_cl", "TA", 9)}
        {BT("TA_pe", "TA", 11)}
        {BT("TA", "TA", 19)}
        {BT("LT_t", "LT", 9)}
        {BT("LT", "LT", 15)}
        {BT("SS_cs", "SS", 15, true)}
        {BT("SS_td", "SS", 17)}
        {BT("SS", "SS", 27)}
        {BT("ACH", "ACH", 13)}
        {/* axillary → brachial artery */}
        <Tube d={sub(ART, U.start - 0.04, U.tm)} width={36} g={gA} glowA={halo("AX")} />
        <Tube d={sub(ART, U.tm, 1)} width={32} g={gA >= 1 ? 1 : 0} glowA={halo("BR")} col={mix(COLS.art.fill, "#E46A55", on("BR"))} />
        {sh >= 0 && <path d={sub(ART, 0, 1)} fill="none" stroke="#FFF6C8" strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray="0.06 1" strokeDashoffset={-sh * 1.06 + 0.06} opacity={0.9} />}
        {/* pectoralis minor on top (translucent so the 2nd part shows through) */}
        <g opacity={pm}>
          {halo("PM") > 0 && <path d={PM_PATH} fill="none" stroke={C.banana} strokeWidth={28} opacity={halo("PM")} />}
          <path d={PM_PATH} fill={`url(#${id}mus)`} opacity={0.5 + 0.12 * pmL} />
          {PM_FIB.map((d, i) => <path key={i} d={d} fill="none" stroke="#FFFFFF" strokeWidth={2.5} opacity={0.4} />)}
          <path d={PM_PATH} fill="none" stroke={mix(COLS.muscle.dark, C.forest, 0.35)} strokeWidth={5} />
        </g>
        {/* branch origin dots */}
        {(["ST", "TA", "LT", "SS", "PCH", "ACH"] as Part[]).map((p) => {
          const o = { ST: oST, TA: oTA, LT: oLT, SS: oSS, PCH: oPCH, ACH: oACH }[p as "ST"];
          const a = on(p);
          if (a <= 0) return null;
          return <circle key={p} cx={o[0]} cy={o[1]} r={9 + 3 * a} fill={BCOL[p]} stroke={C.forest} strokeWidth={4} opacity={a} />;
        })}
      </g>
    </svg>
  );
};
