import React from "react";
import { C, ramp } from "./kit";

/* Book Plume diagram: back of the right arm + forearm (posterior view, lateral/thumb side on the LEFT like Gray's Fig. 418).
   viewBox 800 x 1400. Muscles are built from spines [x, y, half-width] → smooth outline + fibres. */

export type M = "TLO" | "TLA" | "ANC" | "BR" | "ECRL" | "ECRB" | "ED" | "EDM" | "ECU" | "APL" | "EPB" | "SUP";
type Sp = [number, number, number][];

export const SPINE: Record<M, Sp> = {
  TLO: [[482, 50, 68], [474, 200, 84], [455, 355, 74], [436, 470, 44], [428, 548, 20]],
  TLA: [[330, 62, 54], [322, 185, 70], [350, 330, 62], [390, 450, 40], [414, 540, 16]],
  SUP: [[292, 640, 18], [318, 690, 36], [345, 748, 32], [372, 795, 12]],
  ANC: [[318, 588, 12], [385, 626, 32], [440, 676, 12]],
  BR: [[262, 372, 10], [256, 470, 26], [258, 600, 34], [268, 760, 30], [282, 900, 19], [292, 1030, 9], [300, 1192, 6]],
  ECRL: [[284, 478, 9], [286, 560, 21], [297, 700, 24], [308, 840, 14], [318, 960, 7], [333, 1200, 5]],
  ECRB: [[306, 588, 13], [320, 700, 26], [334, 840, 22], [342, 950, 9], [350, 1204, 5]],
  ED: [[348, 604, 15], [368, 720, 38], [387, 860, 40], [396, 980, 26], [400, 1120, 14], [402, 1214, 20]],
  EDM: [[432, 642, 8], [442, 780, 14], [449, 920, 12], [453, 1060, 6], [456, 1214, 5]],
  ECU: [[458, 612, 13], [480, 742, 26], [490, 880, 22], [490, 1020, 12], [490, 1204, 6]],
  APL: [[366, 940, 9], [350, 1010, 17], [324, 1082, 13], [298, 1152, 7], [282, 1212, 5]],
  EPB: [[380, 978, 7], [364, 1038, 12], [338, 1102, 10], [308, 1172, 5], [292, 1226, 4]],
};
/* where the belly turns into tendon (index of spine point) */
const TENDON_FROM: Partial<Record<M, number>> = { BR: 5, ECRL: 4, ECRB: 3, ED: 4, EDM: 3, ECU: 3, APL: 3, EPB: 3, TLO: 4, TLA: 4 };

/* letter groups of BEAST */
export const GROUP: Record<"B" | "E" | "A" | "S" | "T", M[]> = {
  B: ["BR"],
  E: ["ECRL", "ECRB", "ED", "EDM", "ECU", "EPB"],
  A: ["APL"],
  S: ["SUP"],
  T: ["TLO", "TLA"],
};
export const GCOL: Record<"B" | "E" | "A" | "S" | "T", string> = { B: "#E0644F", E: "#C9483C", A: "#E89A3C", S: "#3E7C93", T: "#6E8F3A" };
export const muscleLetter = (m: M) => (Object.keys(GROUP) as (keyof typeof GROUP)[]).find((k) => GROUP[k].includes(m));

/* centripetal Catmull-Rom → cubic bezier path through points */
const smooth = (pts: [number, number][], closed = false) => {
  const P = closed ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < P.length - 2; i++) {
    const [x0, y0] = P[i - 1], [x1, y1] = P[i], [x2, y2] = P[i + 1], [x3, y3] = P[i + 2];
    const c1x = x1 + (x2 - x0) / 6, c1y = y1 + (y2 - y0) / 6, c2x = x2 - (x3 - x1) / 6, c2y = y2 - (y3 - y1) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }
  return closed ? d + " Z" : d;
};
/* densify spine for smooth offsets */
const dense = (sp: Sp, n = 6): Sp => {
  const out: Sp = [];
  for (let i = 0; i < sp.length - 1; i++) {
    for (let k = 0; k < n; k++) {
      const u = k / n;
      out.push([sp[i][0] + (sp[i + 1][0] - sp[i][0]) * u, sp[i][1] + (sp[i + 1][1] - sp[i][1]) * u, sp[i][2] + (sp[i + 1][2] - sp[i][2]) * u]);
    }
  }
  out.push(sp[sp.length - 1]);
  return out;
};
const offsets = (sp: Sp, f: number) => {
  const d = dense(sp);
  return d.map((p, i) => {
    const a = d[Math.max(0, i - 1)], b = d[Math.min(d.length - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
    const nx = -dy / L, ny = dx / L;
    return [p[0] + nx * p[2] * f, p[1] + ny * p[2] * f] as [number, number];
  });
};
const outline = (sp: Sp) => {
  const L = offsets(sp, 1), R = offsets(sp, -1).reverse();
  return smooth([...L, ...R], true);
};
const fibres = (sp: Sp, n: number) => {
  const out: string[] = [];
  for (let i = 1; i < n; i++) {
    const f = -0.85 + (1.7 * i) / n;
    out.push(smooth(offsets(sp, f)));
  }
  return out;
};
export const PRE: Record<M, { o: string; fib: string[]; belly: string; tendon?: string }> = Object.fromEntries(
  (Object.keys(SPINE) as M[]).map((m) => {
    const sp = SPINE[m];
    const tf = TENDON_FROM[m];
    const belly = tf ? sp.slice(0, tf + 1) : sp;
    const tendon = tf ? sp.slice(tf) : undefined;
    return [m, { o: outline(sp), fib: fibres(belly, 6), belly: outline(belly), tendon: tendon ? outline(tendon.map(([x, y, w]) => [x, y, Math.min(w, 7)] as [number, number, number])) : undefined }];
  })
) as Record<M, { o: string; fib: string[]; belly: string; tendon?: string }>;

/** the drawn order (deep first) */
const ORDER: M[] = ["SUP", "TLO", "TLA", "ANC", "ECU", "EDM", "ED", "ECRB", "ECRL", "BR", "APL", "EPB"];

/* skin / limb outline */
const SKIN = smooth([
  [258, 30], [246, 200], [244, 360], [236, 470], [232, 600], [236, 760], [252, 920], [272, 1060], [286, 1180], [286, 1230],
  [512, 1230], [508, 1160], [512, 1040], [530, 900], [548, 760], [566, 620], [560, 520], [556, 400], [566, 220], [570, 30],
], true);
/* radial nerve path: spiral groove → lateral elbow → deep branch through supinator → back of forearm */
const NERVE_MAIN = smooth([[520, 40], [470, 170], [380, 300], [300, 400], [270, 480], [272, 560], [286, 610]]);
const NERVE_DEEP = smooth([[286, 610], [312, 680], [352, 770], [372, 880], [382, 1000], [392, 1110]]);
const NERVE_SUP = smooth([[286, 610], [272, 720], [278, 880], [292, 1040], [300, 1170]]);

export type ArmProps = {
  t: number;
  w: number; // rendered width (px); height = w * 1.75
  id: string;
  lit?: Partial<Record<M, number>>; // time each muscle lights (≤ t → lit)
  hot?: M[]; // glow
  dim?: number; // 0..1 fade unlit muscles
  peel?: number; // 0..1 superficial muscles see-through (show supinator)
  nerve?: number; // 0..1 radial nerve drawn
  deepLabel?: number;
  full?: boolean; // all lit in their letter colour
};

export const Arm: React.FC<ArmProps> = ({ t, w, id, lit = {}, hot = [], dim = 0, peel = 0, nerve = 0, full }) => {
  const h = w * 1.75;
  const nlen = 1400;
  return (
    <svg width={w} height={h} viewBox="0 0 800 1400" style={{ overflow: "visible" }}>
      <defs>
        <clipPath id={`skin${id}`}>
          <path d={SKIN} />
        </clipPath>
        <filter id={`glow${id}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation={9} />
        </filter>
        <linearGradient id={`skinG${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#EED8C8" />
          <stop offset="0.5" stopColor="#F7E7DB" />
          <stop offset="1" stopColor="#EAD2C1" />
        </linearGradient>
      </defs>
      <g transform="translate(400 0) scale(1.2 1) translate(-400 0)">
      {/* hand (dorsum) */}
      <g>
        <path d={smooth([[290, 1222], [508, 1222], [520, 1300], [512, 1330], [300, 1330], [270, 1290]], true)} fill={`url(#skinG${id})`} stroke={C.forest} strokeWidth={5} />
        {[318, 370, 422, 472].map((x, i) => (
          <rect key={x} x={x - 22} y={1310} width={44} height={[78, 92, 86, 66][i]} rx={22} fill={`url(#skinG${id})`} stroke={C.forest} strokeWidth={5} />
        ))}
        <path d={smooth([[296, 1238], [254, 1286], [214, 1336], [200, 1362], [222, 1374], [262, 1336], [300, 1296]], true)} fill={`url(#skinG${id})`} stroke={C.forest} strokeWidth={5} />
        {/* extensor digitorum tendons over the hand */}
        {[318, 370, 422, 472].map((x) => (
          <path key={x} d={smooth([[402, 1214], [(402 + x) / 2, 1268], [x, 1330]])} stroke="#F3EBDD" strokeWidth={9} fill="none" strokeLinecap="round" />
        ))}
      </g>
      {/* limb */}
      <path d={SKIN} fill={`url(#skinG${id})`} stroke={C.forest} strokeWidth={6} />
      <g clipPath={`url(#skin${id})`}>
        {/* bones of the elbow (behind muscles) */}
        <circle cx={262} cy={562} r={18} fill="#F3EBDD" stroke={C.forest} strokeWidth={4} />
        <circle cx={556} cy={570} r={20} fill="#F3EBDD" stroke={C.forest} strokeWidth={4} />
        {ORDER.map((m) => {
          const L = muscleLetter(m)!;
          const on = full ? 1 : lit[m] !== undefined && t >= (lit[m] as number) - 0.05 ? ramp(t, (lit[m] as number) - 0.05, (lit[m] as number) + 0.2) : 0;
          const isHot = hot.includes(m);
          const deep = m === "SUP";
          const supOpacity = deep ? 0.35 + 0.65 * peel : 1;
          const superficialFade = !deep && peel > 0 && !["TLO", "TLA"].includes(m) ? 1 - 0.72 * peel : 1;
          const base = "#E6B7A8";
          const col = GCOL[L];
          const op = (1 - dim * (1 - on)) * supOpacity * superficialFade;
          const P = PRE[m];
          return (
            <g key={m} opacity={op}>
              {isHot && <path d={P.o} fill={C.banana} filter={`url(#glow${id})`} opacity={0.95} transform="scale(1)" />}
              {P.tendon && <path d={P.tendon} fill="#F3EBDD" stroke={C.forest} strokeWidth={3} />}
              <path d={P.belly} fill={base} stroke={C.forest} strokeWidth={deep ? 3 : 4} strokeDasharray={deep && peel < 0.5 ? "10 8" : undefined} />
              <path d={P.belly} fill={col} opacity={on} />
              {P.fib.map((f, i) => (
                <path key={i} d={f} stroke={on > 0.5 ? "rgba(255,240,230,0.55)" : "rgba(143,42,34,0.35)"} strokeWidth={2.4} fill="none" />
              ))}
              {isHot && <path d={P.belly} fill="none" stroke={C.banana} strokeWidth={9} />}
              {isHot && <path d={P.belly} fill="none" stroke={C.forest} strokeWidth={4} />}
            </g>
          );
        })}
        {/* olecranon on top of triceps tendon */}
        <ellipse cx={428} cy={600} rx={34} ry={26} fill="#F3EBDD" stroke={C.forest} strokeWidth={4} />
        {/* radial nerve */}
        {nerve > 0 && (
          <g>
            {[NERVE_MAIN, NERVE_DEEP, NERVE_SUP].map((d, i) => {
              const k = i === 0 ? ramp(nerve, 0, 0.5) : ramp(nerve, 0.5, 1);
              return (
                <g key={i}>
                  <path d={d} stroke={C.forest} strokeWidth={17} fill="none" strokeLinecap="round" strokeDasharray={nlen} strokeDashoffset={nlen * (1 - k)} />
                  <path d={d} stroke="#F2D14E" strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray={nlen} strokeDashoffset={nlen * (1 - k)} />
                </g>
              );
            })}
          </g>
        )}
      </g>
      </g>
    </svg>
  );
};

/** anchor points (viewBox) for callouts */
const A0: Record<M | "NERVE" | "DEEPN", [number, number]> = {
  TLO: [470, 260], TLA: [330, 200], ANC: [390, 630], BR: [258, 640], ECRL: [298, 720], ECRB: [330, 840], ED: [388, 860],
  EDM: [446, 880], ECU: [486, 860], APL: [330, 1070], EPB: [345, 1100], SUP: [330, 720], NERVE: [330, 330], DEEPN: [372, 900],
};
export const ANCHOR = Object.fromEntries(Object.entries(A0).map(([k, [x, y]]) => [k, [400 + (x - 400) * 1.2, y]])) as Record<M | "NERVE" | "DEEPN", [number, number]>;
