import React from "react";
import { C, FONT, ramp } from "./kit";

/** Our own schematic of the two circulations (front view: patient's right = viewer's left).
 *  Heart in the middle, lungs on top (pulmonary loop), body tissues at the bottom (systemic loop). viewBox 800 x 900. */
export const BLUE = "#4F79B0";
export const BLUE_D = "#2E4C78";
export const BLUE_L = "#B9CCE6";
export const RED_L = "#F0B3A9";

type P = [number, number];
// Catmull-Rom → dense smooth polyline
const smooth = (pts: P[], n = 14): P[] => {
  const out: P[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
};
const lens = (pts: P[]) => {
  const L = [0];
  for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return L;
};
const at = (pts: P[], L: number[], f: number): P => {
  const d = f * L[L.length - 1];
  let i = 1;
  while (i < L.length - 1 && L[i] < d) i++;
  const k = (d - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]);
  return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k];
};
const D = (pts: P[]) => "M" + pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L");

export type VesselId = "PA" | "PAL" | "PAR" | "PVL" | "PVR" | "AO" | "VC" | "SVC";
type Vessel = { id: VesselId; pts: P[]; color: string; dark: string; w: number };
const V: Vessel[] = [
  // pulmonary trunk from the right ventricle up, then right / left pulmonary arteries
  { id: "PA", pts: smooth([[352, 560], [362, 470], [392, 372], [400, 318]]), color: BLUE, dark: BLUE_D, w: 34 },
  { id: "PAL", pts: smooth([[400, 318], [350, 296], [282, 262], [226, 222]]), color: BLUE, dark: BLUE_D, w: 26 },
  { id: "PAR", pts: smooth([[400, 318], [452, 292], [520, 258], [574, 222]]), color: BLUE, dark: BLUE_D, w: 26 },
  // pulmonary veins from both lungs into the left atrium
  { id: "PVL", pts: smooth([[240, 300], [300, 338], [380, 382], [458, 410]]), color: C.red, dark: C.redDark, w: 22 },
  { id: "PVR", pts: smooth([[566, 296], [536, 340], [500, 384], [474, 404]]), color: C.red, dark: C.redDark, w: 22 },
  // aorta: from the left ventricle up, arching, then down to the body
  { id: "AO", pts: smooth([[452, 560], [440, 460], [438, 380], [470, 330], [540, 318], [600, 350], [640, 430], [654, 560], [650, 690], [636, 744]]), color: C.red, dark: C.redDark, w: 36 },
  // venae cavae back into the right atrium
  { id: "VC", pts: smooth([[166, 744], [150, 640], [160, 540], [214, 470], [300, 446]]), color: BLUE, dark: BLUE_D, w: 34 },
];
const VL = V.map((v) => lens(v.pts));

/** blood cells flowing along a vessel */
const Flow: React.FC<{ v: number; t: number; p: number; speed?: number; n?: number; color?: string }> = ({ v, t, p, speed = 0.45, n = 6, color }) => {
  if (p <= 0) return null;
  const ves = V[v];
  return (
    <g opacity={p}>
      {Array.from({ length: n }).map((_, i) => {
        const f = (((t * speed * 300) / VL[v][VL[v].length - 1] + i / n) % 1 + 1) % 1;
        const [x, y] = at(ves.pts, VL[v], f);
        return <ellipse key={i} cx={x} cy={y} rx={ves.w * 0.32} ry={ves.w * 0.22} fill={color ?? "#FFFFFF"} opacity={0.85 * Math.sin(Math.PI * f) ** 0.4} />;
      })}
    </g>
  );
};

const lungPath = (side: "l" | "r") =>
  side === "l"
    ? "M300 96 Q250 70 196 104 Q118 156 98 252 Q90 316 128 330 Q200 344 300 312 Q326 300 326 262 L322 140 Q320 108 300 96 Z"
    : "M500 96 Q550 70 604 104 Q682 156 702 252 Q710 316 672 330 Q600 344 500 312 Q474 300 474 262 L478 140 Q480 108 500 96 Z";

/** little capillary net inside a lung / the body, colour goes from a to b with k */
const Net: React.FC<{ x: number; y: number; w: number; h: number; k: number; from: string; to: string; seed: number }> = ({ x, y, w, h, k, from, to, seed }) => {
  const col = k < 0.5 ? from : to;
  const rows = 4, cols = 6;
  const paths: string[] = [];
  for (let r = 0; r < rows; r++) {
    let d = `M${x} ${y + (h * (r + 0.5)) / rows}`;
    for (let c = 1; c <= cols; c++) {
      const xx = x + (w * c) / cols;
      const yy = y + (h * (r + 0.5)) / rows + Math.sin(c * 1.7 + r * 2.3 + seed) * 10;
      d += ` Q${xx - w / cols / 2} ${yy + (c % 2 ? -14 : 14)} ${xx} ${yy}`;
    }
    paths.push(d);
  }
  return (
    <g>
      {paths.map((d, i) => (
        <g key={i}>
          <path d={d} stroke={from} strokeWidth={6} fill="none" strokeLinecap="round" opacity={1 - k} />
          <path d={d} stroke={to} strokeWidth={6} fill="none" strokeLinecap="round" opacity={k} />
        </g>
      ))}
      {col && null}
    </g>
  );
};

export type ChamberId = "RA" | "RV" | "LA" | "LV";
const CH: { id: ChamberId; d: string; tint: string; lx: number; ly: number }[] = [
  { id: "RA", d: "M300 446 Q296 400 338 392 Q380 388 392 420 Q398 452 384 476 L306 486 Q298 470 300 446 Z", tint: BLUE_L, lx: 346, ly: 446 },
  { id: "LA", d: "M410 420 Q420 386 462 390 Q504 396 506 440 Q508 468 498 482 L420 478 Q406 456 410 420 Z", tint: RED_L, lx: 458, ly: 444 },
  { id: "RV", d: "M306 494 L390 486 Q400 520 398 560 Q394 610 382 650 Q330 600 310 556 Q300 524 306 494 Z", tint: BLUE_L, lx: 350, ly: 552 },
  { id: "LV", d: "M406 486 L498 490 Q512 520 506 566 Q494 628 404 676 Q400 640 402 600 Q406 540 406 486 Z", tint: RED_L, lx: 456, ly: 566 },
];

export const Circ: React.FC<{
  t: number;
  w?: number;
  lit?: Partial<Record<ChamberId | VesselId | "lungs" | "body", number>>; // time each part lights up
  flow?: Partial<Record<VesselId, number>>; // time blood starts to flow in a vessel
  oxy?: number; // lungs turn red (gas exchange)
  deoxy?: number; // body turns blue
  loops?: { pul?: number; sys?: number; pulOff?: number; sysOff?: number };
  dimSys?: number; // fade systemic parts (0..1) to focus on the pulmonary loop
  dimPul?: number;
  showLetters?: boolean;
}> = ({ t, w = 700, lit = {}, flow = {}, oxy, deoxy, loops = {}, dimSys = 0, dimPul = 0, showLetters = true }) => {
  const h = (w * 900) / 800;
  const L = (k: keyof NonNullable<typeof lit>) => (lit[k] === undefined ? 0 : ramp(t, lit[k]!, lit[k]! + 0.25));
  const pulse = (k: keyof NonNullable<typeof lit>) => (lit[k] === undefined ? 0 : Math.max(0, 1 - Math.abs(t - lit[k]! - 0.15) / 0.35));
  const ok = oxy === undefined ? 0 : ramp(t, oxy, oxy + 0.6);
  const dk = deoxy === undefined ? 0 : ramp(t, deoxy, deoxy + 0.6);
  const isSys = (id: VesselId) => id === "AO" || id === "VC";
  const loopP = (a?: number, off?: number) => (a === undefined ? 0 : ramp(t, a, a + 0.6) * (off === undefined ? 1 : 1 - ramp(t, off, off + 0.4)));
  const pul = loopP(loops.pul, loops.pulOff), sys = loopP(loops.sys, loops.sysOff);
  return (
    <svg width={w} height={h} viewBox="0 0 800 900" style={{ overflow: "visible" }}>
      <defs>
        <filter id="c54sh" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#1F2A14" floodOpacity="0.18" />
        </filter>
        <filter id="c54glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
        <radialGradient id="c54lung" cx="45%" cy="35%" r="80%">
          <stop offset="0%" stopColor="#FBEFEA" />
          <stop offset="70%" stopColor="#EBD3CB" />
          <stop offset="100%" stopColor="#D9B7AC" />
        </radialGradient>
        <radialGradient id="c54heart" cx="40%" cy="30%" r="85%">
          <stop offset="0%" stopColor="#E9918A" />
          <stop offset="70%" stopColor="#C9584C" />
          <stop offset="100%" stopColor="#9E3A30" />
        </radialGradient>
        <linearGradient id="c54body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFBEA" />
          <stop offset="100%" stopColor="#EFE6CC" />
        </linearGradient>
      </defs>
      {/* loop outlines (dashed) */}
      {pul > 0 && <ellipse cx={400} cy={250} rx={360} ry={200} fill="none" stroke={BLUE} strokeWidth={8} strokeDasharray="24 16" opacity={0.75 * pul} strokeDashoffset={-t * 40} />}
      {sys > 0 && <ellipse cx={400} cy={620} rx={370} ry={250} fill="none" stroke={C.red} strokeWidth={8} strokeDasharray="24 16" opacity={0.75 * sys} strokeDashoffset={t * 40} />}

      {/* lungs */}
      <g opacity={1 - 0.65 * dimPul}>
        {(["l", "r"] as const).map((s) => (
          <g key={s} filter="url(#c54sh)">
            {L("lungs") > 0 && <path d={lungPath(s)} fill={C.banana} opacity={0.7 * L("lungs")} filter="url(#c54glow)" transform="translate(0 0)" />}
            <path d={lungPath(s)} fill="url(#c54lung)" stroke={C.forest} strokeWidth={5} strokeLinejoin="round" />
            <ellipse cx={s === "l" ? 196 : 604} cy={150} rx={44} ry={20} fill="#FFFFFF" opacity={0.45} transform={`rotate(${s === "l" ? -30 : 30} ${s === "l" ? 196 : 604} 150)`} />
          </g>
        ))}
        <Net x={130} y={170} w={170} h={130} k={ok} from={BLUE} to={C.red} seed={1} />
        <Net x={500} y={170} w={170} h={130} k={ok} from={BLUE} to={C.red} seed={4} />
        {/* trachea */}
        <path d="M384 40 L416 40 L416 120 Q416 150 440 168 L436 176 Q400 150 364 176 L360 168 Q384 150 384 120 Z" fill="#F4EEDD" stroke={C.forest} strokeWidth={4} />
        {[56, 76, 96].map((y) => <line key={y} x1={388} y1={y} x2={412} y2={y} stroke={C.forest} strokeWidth={3} opacity={0.5} />)}
        <text x={204} y={150} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.forest} opacity={0.6} letterSpacing={3}>LUNG</text>
        <text x={596} y={150} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.forest} opacity={0.6} letterSpacing={3}>LUNG</text>
        {/* O2 bubbles */}
        {ok > 0 &&
          [[165, 215], [262, 200], [215, 292], [538, 210], [640, 222], [590, 292]].map(([x, y], i) => {
            const p = ramp(t, oxy! + i * 0.08, oxy! + 0.4 + i * 0.08);
            const drift = ((t - oxy!) * 22) % 30;
            return (
              <g key={i} opacity={p * (1 - ramp(t, oxy! + 2.2, oxy! + 2.8))} transform={`translate(${x} ${y - drift})`}>
                <circle r={22} fill="#FFFFFF" stroke={C.matcha} strokeWidth={4} />
                <text y={8} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={22} fill={C.matcha}>O₂</text>
              </g>
            );
          })}
      </g>

      {/* body tissues */}
      <g opacity={1 - 0.65 * dimSys} filter="url(#c54sh)">
        {L("body") > 0 && <rect x={110} y={730} width={580} height={150} rx={60} fill={C.banana} opacity={0.7 * L("body")} filter="url(#c54glow)" />}
        <rect x={110} y={730} width={580} height={150} rx={60} fill="url(#c54body)" stroke={C.forest} strokeWidth={5} />
        <Net x={170} y={752} w={460} h={70} k={dk} from={C.red} to={BLUE} seed={2} />
        <text x={400} y={862} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.forest} opacity={0.6} letterSpacing={3}>BODY TISSUES</text>
      </g>

      {/* vessels */}
      {V.map((v, i) => {
        const dim = isSys(v.id) ? dimSys : dimPul;
        const lp = L(v.id as VesselId);
        return (
          <g key={v.id} opacity={1 - 0.65 * dim}>
            {lp > 0 && <path d={D(v.pts)} stroke={C.banana} strokeWidth={v.w + 30} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.75 * lp} filter="url(#c54glow)" />}
            <path d={D(v.pts)} stroke={C.forest} strokeWidth={v.w + 9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d={D(v.pts)} stroke={v.color} strokeWidth={v.w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d={D(v.pts)} stroke="#FFFFFF" strokeWidth={v.w * 0.22} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.28} transform={`translate(${-v.w * 0.18} ${-v.w * 0.12})`} />
            <Flow v={i} t={t} p={flow[v.id] === undefined ? 0 : ramp(t, flow[v.id]!, flow[v.id]! + 0.4) * (1 - 0.8 * dim)} />
          </g>
        );
      })}

      {/* heart */}
      <g filter="url(#c54sh)">
        <path d="M296 452 Q290 392 340 382 Q384 374 400 404 Q418 374 464 380 Q514 388 514 448 Q520 560 404 690 Q300 590 296 452 Z" fill="url(#c54heart)" stroke={C.forest} strokeWidth={6} strokeLinejoin="round" />
        {CH.map((c) => {
          const p = L(c.id);
          const pu = pulse(c.id);
          const dim = c.id === "RA" || c.id === "LV" ? dimSys * 0.5 : 0;
          return (
            <g key={c.id} transform={`translate(${c.lx} ${c.ly}) scale(${1 + 0.08 * pu}) translate(${-c.lx} ${-c.ly})`} opacity={1 - dim}>
              {p > 0 && <path d={c.d} fill={C.banana} opacity={0.8 * p} filter="url(#c54glow)" />}
              <path d={c.d} fill={c.tint} stroke={C.forest} strokeWidth={4} strokeLinejoin="round" />
              <path d={c.d} fill={C.banana} opacity={0.92 * p} />
              {showLetters && (
                <text x={c.lx} y={c.ly + 12} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill={C.forest}>
                  {c.id}
                </text>
              )}
            </g>
          );
        })}
        <path d="M400 404 L402 680" stroke={C.forest} strokeWidth={4} opacity={0.5} />
      </g>
    </svg>
  );
};
