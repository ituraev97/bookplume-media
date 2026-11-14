import React from "react";
import { C, ramp } from "./kit";

/**
 * Book Plume original schematic: RIGHT subclavian artery, front view.
 * Viewer's left = lateral (shoulder); viewer's right = medial (midline, cervical spine).
 * Brachiocephalic trunk → subclavian arches over the 1st rib, passes BEHIND anterior scalene (parts 1/2/3)
 * and becomes the axillary artery at the lateral border of the 1st rib. viewBox 860 x 860.
 * Branches: V vertebral (up through transverse foramina C6→C1), I internal thoracic (down),
 * T thyrocervical trunk (3 branches), C costocervical trunk (deep cervical + supreme intercostal), D dorsal scapular.
 */
export type Part = "V" | "I" | "T" | "C" | "D" | "AS" | "P1" | "P2" | "P3" | "R1" | "CC" | "AX" | "FOR";
type P = [number, number];

export const mix = (a: string, b: string, k: number) => {
  const h = (s: string) => [1, 3, 5].map((j) => parseInt(s.slice(j, j + 2), 16));
  const x = h(a), y = h(b);
  return "#" + x.map((v, j) => Math.round(v + (y[j] - v) * Math.max(0, Math.min(1, k))).toString(16).padStart(2, "0")).join("");
};

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
type S = ReturnType<typeof sample>;
const at = (s: S, u: number): P => {
  const d = Math.max(0, Math.min(1, u)) * s.tot;
  let i = 1;
  while (i < s.L.length - 1 && s.L[i] < d) i++;
  const k = (d - s.L[i - 1]) / (s.L[i] - s.L[i - 1] || 1);
  return [s.out[i - 1][0] + (s.out[i][0] - s.out[i - 1][0]) * k, s.out[i - 1][1] + (s.out[i][1] - s.out[i - 1][1]) * k];
};
const sub = (s: S, u0: number, u1: number) => {
  const pts: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const p = at(s, u0 + ((u1 - u0) * i) / 40);
    pts.push(`${p[0].toFixed(1)} ${p[1].toFixed(1)}`);
  }
  return "M" + pts.join(" L");
};
/** u where the curve reaches screen-x = x (curve runs right → left) */
const uAtX = (s: S, x: number) => {
  for (let i = 1; i < s.out.length; i++) if (s.out[i][0] <= x) return s.L[i] / s.tot;
  return 1;
};
const add = (o: P, d: P): P => [o[0] + d[0], o[1] + d[1]];

/* ---------- geometry ---------- */
const B: P = [762, 732]; // brachiocephalic bifurcation
const BCT_PTS: P[] = [[790, 900], [780, 830], [770, 780], B];
const CC_PTS: P[] = [B, [772, 600], [780, 420], [786, 200], [790, -20]];
const ART_PTS: P[] = [B, [700, 690], [600, 664], [490, 654], [390, 662], [290, 688], [190, 732], [90, 786], [-30, 852]];
const ART = sample(ART_PTS);
export const art = (u: number) => at(ART, u);
export const U = {
  V: uAtX(ART, 704), I: uAtX(ART, 640), T: uAtX(ART, 574), as0: uAtX(ART, 512), C: uAtX(ART, 468), as1: uAtX(ART, 424), D: uAtX(ART, 310), r1: uAtX(ART, 118),
};
const oV = art(U.V), oI = art(U.I), oT = art(U.T), oC = art(U.C), oD = art(U.D);
const TS = add(oT, [-4, -92]); // thyrocervical split
const CS = add(oC, [-6, -58]); // costocervical split
const VX = 700; // vertebral artery column x (transverse foramina)
export const VERT_Y = [520, 432, 344, 256, 168, 80]; // C6 → C1 foramina
const BR: Record<string, P[]> = {
  V: [oV, add(oV, [-2, -40]), [VX - 2, 600], [VX, VERT_Y[0] + 30], [VX, 300], [VX, 60], [VX - 14, -30]],
  I: [oI, add(oI, [-4, 50]), add(oI, [-14, 140]), add(oI, [-22, 240])],
  T: [oT, add(oT, [-2, -46]), TS],
  T_it: [TS, add(TS, [16, -60]), add(TS, [60, -120]), add(TS, [140, -150]), add(TS, [200, -140])],
  T_tc: [TS, add(TS, [-60, -50]), add(TS, [-180, -80]), add(TS, [-320, -86]), add(TS, [-470, -70])],
  T_ss: [TS, add(TS, [-60, 8]), add(TS, [-180, 16]), add(TS, [-320, 44]), add(TS, [-450, 92])],
  C: [oC, add(oC, [-2, -30]), CS],
  C_dc: [CS, add(CS, [-8, -70]), add(CS, [-24, -170]), add(CS, [-30, -300])],
  C_si: [CS, add(CS, [-40, 30]), add(CS, [-58, 110]), add(CS, [-66, 230])],
  D: [oD, add(oD, [-20, -50]), add(oD, [-80, -100]), add(oD, [-170, -132]), add(oD, [-300, -148])],
};
export const ANCHOR: Record<string, P> = {
  V: [VX, 300],
  I: add(oI, [-6, 150]),
  T: add(oT, [-3, -50]),
  C: add(oC, [-3, -40]),
  D: add(oD, [-160, -128]),
  P1: art((U.as0 + 0) / 2 + 0.03),
  P2: art((U.as0 + U.as1) / 2),
  P3: art((U.as1 + U.r1) / 2),
  AS: [520, 300],
  R1: [140, 806],
  AX: art(0.93),
  CC: [700, 380],
  B,
  FOR: [VX, VERT_Y[0]],
  TS,
};

/* anterior scalene: transverse processes C3–C6 (top) → scalene tubercle of the 1st rib; IN FRONT of the artery */
const AS_PATH = smooth([[566, 110], [616, 122], [570, 420], [520, 712], [430, 730], [462, 600], [506, 400]], true, 0.4);
const AS_FIB = [0.25, 0.5, 0.75].map((f) => smooth([[574 + f * 34, 124], [520 + f * 44, 420], [448 + f * 64, 720]]));
/* middle scalene: behind the artery, lateral */
const MS_PATH = smooth([[476, 90], [526, 100], [450, 400], [370, 750], [270, 772], [326, 560], [412, 330]], true, 0.4);
/* 1st rib (seen from the front, arching laterally to the lateral border) */
const RIB1 = smooth([[800, 770], [680, 740], [540, 744], [410, 760], [300, 790], [200, 830], [118, 870], [86, 910], [150, 910], [226, 878], [316, 846], [426, 820], [550, 806], [680, 804], [800, 826]], true, 0.45);
const RIB2 = smooth([[760, 870], [600, 850], [420, 872], [240, 930]]);
/* clavicle stub (lateral, faint, in front) */

export const COLS = {
  art: { fill: "#D8574B", dark: "#A23125", light: "#FFD9CF" },
  muscle: { fill: "#D9907E", dark: "#9B5444" },
  bone: { fill: "#F1E8CC", dark: "#B7A577" },
};
export const BCOL: Record<string, string> = { V: "#7FA0CC", I: "#E58B7F", T: "#E8A44E", C: "#B59AD8", D: "#63B5A3" };
export const PCOL: Record<number, string> = { 1: "#F2C9A0", 2: "#CDB8EA", 3: "#A9D6C8" };

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

export const SubDiagram: React.FC<{
  t: number;
  w?: number;
  lit?: Partial<Record<Part, number>>;
  glow?: Part[];
  grow?: number;
  ghost?: number;
  scal?: number; // anterior scalene opacity
  parts?: number;
  flow?: number; // pulse up the vertebral artery from this time
  id?: string;
}> = ({ t, w = 860, lit = {}, glow = [], grow, ghost = 0.35, scal = 1, parts = 0, flow, id = "sc" }) => {
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
        {on(p) > 0 && grown < 1 && <path d={d} fill="none" stroke="#FFF6C8" strokeWidth={width * 0.4} strokeLinecap="round" pathLength={1} strokeDasharray={`0.14 1`} strokeDashoffset={-grown + 0.14} />}
      </g>
    );
  };
  const segBand = (p: "P1" | "P2" | "P3", u0: number, u1: number, col: string) => {
    const a = on(p) * parts;
    if (a <= 0) return null;
    return <path d={sub(ART, u0, u0 + (u1 - u0) * ramp(t, lit[p]! - 0.05, lit[p]! + 0.45))} fill="none" stroke={col} strokeWidth={74} strokeLinecap="round" opacity={0.75 * a} />;
  };
  const asL = on("AS");
  const bone = mix(COLS.bone.dark, C.forest, 0.4);
  const sh = flow === undefined || t < flow ? -1 : ((t - flow) % 1.4) / 1.4;
  const forL = on("FOR");
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
          <rect x={-10} y={-10} width={880} height={880} rx={40} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}clip)`}>
        {/* cervical vertebrae C1–C7 + T1 (bodies medial, transverse processes reaching laterally) */}
        {[...VERT_Y.slice().reverse(), 608, 696].map((y, i) => {
          const isF = i < 6; // C1–C6 carry the vertebral artery
          return (
            <g key={i} opacity={0.95}>
              <rect x={756} y={y - 34} width={150} height={68} rx={16} fill={`url(#${id}bone)`} stroke={bone} strokeWidth={4} />
              <path d={`M762 ${y - 18} L${VX - 34} ${y - 26} Q${VX - 52} ${y} ${VX - 34} ${y + 22} L762 ${y + 16} Z`} fill={`url(#${id}bone)`} stroke={bone} strokeWidth={4} />
              {isF && <ellipse cx={VX} cy={y} rx={17} ry={14} fill={mix("#C9B98E", C.forest, 0.25)} stroke={bone} strokeWidth={3} />}
              {isF && forL > 0 && <ellipse cx={VX} cy={y} rx={27} ry={24} fill="none" stroke={C.banana} strokeWidth={7} opacity={forL} />}
              <rect x={762} y={y + 34} width={138} height={20} rx={8} fill={mix("#CFE0E8", C.paper, 0.3)} stroke={mix(bone, C.paper, 0.4)} strokeWidth={2} />
            </g>
          );
        })}
        {/* middle scalene (behind) */}
        <path d={MS_PATH} fill={mix("#DDA492", C.paper, 0.35)} stroke={mix(COLS.muscle.dark, C.paper, 0.25)} strokeWidth={4} />
        {[0.3, 0.6].map((f, i) => <path key={i} d={smooth([[486 + f * 30, 100], [430 + f * 30, 420], [300 + f * 60, 755]])} fill="none" stroke={COLS.muscle.dark} strokeWidth={2} opacity={0.3} />)}
        {/* costocervical → supreme intercostal runs behind the artery and the 1st rib */}
        {BT("C_si", "C", 12, true)}
        {/* 1st + 2nd rib */}
        <path d={RIB2} fill="none" stroke={mix(COLS.bone.dark, C.paper, 0.2)} strokeWidth={40} strokeLinecap="round" opacity={0.5} />
        <g>
          {on("R1") > 0 && <path d={RIB1} fill="none" stroke={C.banana} strokeWidth={24} opacity={on("R1") * 0.9} />}
          <path d={RIB1} fill={`url(#${id}bone)`} stroke={bone} strokeWidth={5} />
        </g>
        {/* vertebral artery: threads up through the transverse foramina */}
        {BT("V", "V", 20)}
        {[...VERT_Y].map((y, i) => (
          <path key={i} d={`M${VX - 30} ${y + 14} Q${VX} ${y + 24} ${VX + 30} ${y + 14}`} fill="none" stroke={bone} strokeWidth={11} strokeLinecap="round" opacity={0.95} />
        ))}
        {sh >= 0 && <path d={smooth(BR.V)} fill="none" stroke="#FFF6C8" strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray="0.07 1" strokeDashoffset={-sh * 1.07 + 0.07} opacity={0.95} />}
        {/* common carotid (ghost: not a subclavian branch) */}
        <Tube d={smooth(CC_PTS)} width={34} op={0.45 + 0.4 * on("CC")} col={mix(COLS.art.fill, C.paper, 0.5)} />
        {/* part bands under the artery */}
        {segBand("P1", 0.0, U.as0, PCOL[1])}
        {segBand("P2", U.as0, U.as1, PCOL[2])}
        {segBand("P3", U.as1, U.r1, PCOL[3])}
        {/* branches */}
        {BT("I", "I", 17)}
        {BT("T_it", "T", 11)}
        {BT("T_ss", "T", 11)}
        {BT("T_tc", "T", 11)}
        {BT("T", "T", 18)}
        {BT("C_dc", "C", 11, true)}
        {BT("C", "C", 15, true)}
        {BT("D", "D", 14)}
        {/* brachiocephalic + subclavian → axillary */}
        <Tube d={smooth(BCT_PTS)} width={44} g={gA} />
        <Tube d={sub(ART, 0, U.r1)} width={38} g={gA} />
        <Tube d={sub(ART, U.r1, 1)} width={36} g={gA >= 1 ? 1 : 0} glowA={halo("AX")} col={mix(COLS.art.fill, "#E46A55", on("AX"))} />
        {/* lateral border of the 1st rib */}
        {on("R1") > 0 && <line x1={92} y1={730} x2={160} y2={900} stroke={C.forest} strokeWidth={6} strokeDasharray="12 9" opacity={on("R1")} />}
        {/* anterior scalene on top (translucent: part 2 shows through) */}
        <g opacity={scal}>
          {halo("AS") > 0 && <path d={AS_PATH} fill="none" stroke={C.banana} strokeWidth={26} opacity={halo("AS")} />}
          <path d={AS_PATH} fill={`url(#${id}mus)`} opacity={0.55 + 0.15 * asL} />
          {AS_FIB.map((d, i) => <path key={i} d={d} fill="none" stroke="#FFFFFF" strokeWidth={2.5} opacity={0.4} />)}
          <path d={AS_PATH} fill="none" stroke={mix(COLS.muscle.dark, C.forest, 0.35)} strokeWidth={5} />
        </g>
        {/* branch origin dots */}
        {(["V", "I", "T", "C", "D"] as Part[]).map((p) => {
          const o = { V: oV, I: oI, T: oT, C: oC, D: oD }[p as "V"];
          const a = on(p);
          if (a <= 0) return null;
          return <circle key={p} cx={o[0]} cy={o[1]} r={9 + 3 * a} fill={BCOL[p]} stroke={C.forest} strokeWidth={4} opacity={a} />;
        })}
      </g>
    </svg>
  );
};
