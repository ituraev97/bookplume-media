import React from "react";
import { C, FONT } from "./kit";

/* Book Plume original rib-cage diagram (front view). viewBox 680 x 800, centre x = 340. */
type P = [number, number];
const CX = 340;
const BONE = "#EEE6CC", BONE_D = "#D8CDA8", CART = "#CBD9C3", CART_D = "#A9BCA0";
export const GROUP = { T: C.matcha, F: C.banana, FL: C.red };
const GLITE = { T: "#B5CB8E", F: "#F8E7A4", FL: "#EFA197" };

const W = [118, 178, 224, 254, 274, 287, 294, 297, 294, 284, 262, 230];
const DY = [12, 24, 34, 44, 52, 58, 62, 66, 68, 70, 74, 76];
const RW = [17, 19, 20, 21, 22, 22, 22, 21, 20, 19, 17, 14];
const A: P[] = [[106, 140], [138, 198], [160, 253], [176, 308], [186, 362], [184, 414], [170, 462], [206, 516], [228, 562], [244, 604], [246, 676], [206, 712]];
const S: P[] = [[54, 132], [50, 192], [50, 244], [52, 295], [52, 346], [48, 396], [40, 442]];
export const yv = (i: number) => 74 + 50 * (i - 1); // i = 1..12 (vertebral level)

const mix = (a: string, b: string, k: number) => {
  const h = (s: string) => [1, 3, 5].map((j) => parseInt(s.slice(j, j + 2), 16));
  const x = h(a), y = h(b);
  return "#" + x.map((v, j) => Math.round(v + (y[j] - v) * Math.max(0, Math.min(1, k))).toString(16).padStart(2, "0")).join("");
};
const q = (p0: P, c: P, p1: P, u: number): P => [
  (1 - u) ** 2 * p0[0] + 2 * (1 - u) * u * c[0] + u * u * p1[0],
  (1 - u) ** 2 * p0[1] + 2 * (1 - u) * u * c[1] + u * u * p1[1],
];

/* geometry of rib i on side s (s = -1 viewer-left, +1 viewer-right) */
const rib = (i: number, s: number) => {
  const k = i - 1, y = yv(i);
  const P0: P = [CX + s * 30, y];
  const L: P = [CX + s * W[k], y + DY[k]];
  const a: P = [CX + s * A[k][0], A[k][1]];
  const q0: P = P0, q1: P = [CX + s * W[k] * 0.55, y - 34], q2: P = [L[0], L[1] - 74], q3: P = L;
  // split the posterior cubic at u: the last part (lateral bend) is drawn solid with the anterior arc
  const u = i >= 11 ? 0.55 : 0.62;
  const lp = (p: P, r: P, f: number): P => [p[0] + (r[0] - p[0]) * f, p[1] + (r[1] - p[1]) * f];
  const a1 = lp(q0, q1, u), b1 = lp(q1, q2, u), c1 = lp(q2, q3, u), d1 = lp(a1, b1, u), e1 = lp(b1, c1, u), m = lp(d1, e1, u);
  const post = `M${q0[0]} ${q0[1]} C${a1[0]} ${a1[1]} ${d1[0]} ${d1[1]} ${m[0]} ${m[1]}`;
  const dy = Math.max(8, a[1] - L[1]);
  const ant = `M${m[0]} ${m[1]} C${e1[0]} ${e1[1]} ${c1[0]} ${c1[1]} ${L[0]} ${L[1]} C${L[0]} ${L[1] + dy * 0.75} ${CX + s * (A[k][0] + (W[k] - A[k][0]) * 0.5)} ${a[1] + dy * 0.12} ${a[0]} ${a[1]}`;
  return { P0, L, a, post, ant };
};
/* costal cartilage: start, control, end (quadratic) */
const cart = (i: number, s: number): [P, P, P] | null => {
  const k = i - 1;
  const a: P = [CX + s * A[k][0], A[k][1]];
  if (i <= 7) {
    const e: P = [CX + s * S[k][0], S[k][1]];
    const c: P = [CX + s * (S[k][0] + (A[k][0] - S[k][0]) * 0.35), Math.max(a[1], e[1]) + (i >= 5 ? 14 : 4)];
    return [a, c, e];
  }
  if (i <= 10) {
    const above = cart(i - 1, s)!;
    const e = q(above[0], above[1], above[2], i === 8 ? 0.58 : 0.45);
    const c: P = [e[0] + s * 26, a[1] + 4];
    return [a, c, e];
  }
  // floating: short cartilage cap pointing forward/down
  return [a, [a[0] - s * 10, a[1] + 10], [a[0] - s * 22, a[1] + 14]];
};
export const cartPoint = (i: number, s: number, u: number) => {
  const c = cart(i, s)!;
  return q(c[0], c[1], c[2], u);
};
export const ribLateral = (i: number, s: number) => rib(i, s).L;
export const ribFront = (i: number, s: number) => rib(i, s).a;
const grp = (i: number): "T" | "F" | "FL" => (i <= 7 ? "T" : i <= 10 ? "F" : "FL");

export type RibsProps = {
  t: number;
  w?: number;
  build?: number; // 0..12 ribs revealed (fractional = fading in)
  lit?: { T?: number; F?: number; FL?: number };
  dim?: { T?: number; F?: number; FL?: number }; // 0..1 fade a group back
  focus?: number; // rib number to glow
  focusA?: number;
  nums?: number; // 0..1 show rib numbers on viewer-right side
  numsFrom?: number; numsTo?: number;
  spine?: number; // glow the thoracic vertebrae 0..1
  sternum?: number; // glow sternum 0..1
  pulses?: { path: P[]; u: number; color: string }[];
  bob?: number; // floating ribs bob amount
  noFront?: number; // dashed "no front" line + x from floating ribs
  bracket?: { from: number; to: number; text: string; a: number; color: string; side?: number }[];
};

const Path: React.FC<{ d: string; w: number; fill: string; edge: string; op?: number; hi?: boolean }> = ({ d, w, fill, edge, op = 1, hi = true }) => (
  <g opacity={op}>
    <path d={d} fill="none" stroke={edge} strokeWidth={w + 6} strokeLinecap="round" />
    <path d={d} fill="none" stroke={fill} strokeWidth={w} strokeLinecap="round" />
    {hi && <path d={d} fill="none" stroke="#FFFFFF" strokeOpacity={0.4} strokeWidth={w * 0.26} strokeLinecap="round" transform={`translate(0 ${-w * 0.22})`} />}
  </g>
);

export const Ribs: React.FC<RibsProps> = ({ t, w = 680, build = 12, lit = {}, dim = {}, focus, focusA = 0, nums = 0, numsFrom = 1, numsTo = 12, spine = 0, sternum = 0, pulses = [], bob = 0, noFront = 0, bracket = [] }) => {
  const h = (w * 800) / 680;
  const shown = (i: number) => Math.max(0, Math.min(1, build - (i - 1)));
  const col = (i: number) => {
    const g = grp(i);
    const l = lit[g] ?? 0;
    return { bone: mix(BONE, GROUP[g], l), cart: mix(CART, GLITE[g], l), edge: C.forest, l };
  };
  const gop = (i: number) => 1 - 0.72 * (dim[grp(i)] ?? 0);
  const bobY = (i: number) => (i >= 11 ? Math.sin(t * 3.2 + i) * 7 * bob : 0);
  const ribs = Array.from({ length: 12 }, (_, k) => k + 1);
  const sides = [-1, 1];
  const fg = focus ? 0.55 + 0.45 * Math.sin(t * 7) ** 2 : 0;
  return (
    <svg width={w} height={h} viewBox="0 0 680 800" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="st" x1="0" x2="1">
          <stop offset="0" stopColor="#E3D9B8" />
          <stop offset="0.5" stopColor="#F6F0DC" />
          <stop offset="1" stopColor="#E3D9B8" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      {/* vertebral column behind (T1–T12 + L1) */}
      <g>
        {Array.from({ length: 13 }, (_, k) => {
          const y = yv(k + 1) - 2;
          const bw = 40 + k * 2.2, bh = 34 + k * 0.6;
          const g = k < 12 ? spine : 0;
          return (
            <g key={k} opacity={0.62 + 0.38 * g}>
              <rect x={CX - bw / 2} y={y - bh / 2} width={bw} height={bh} rx={9} fill={mix("#E6DEC2", C.banana, g)} stroke={C.forest} strokeWidth={2.5} strokeOpacity={0.55} />
              <rect x={CX - bw / 2 + 4} y={y + bh / 2 + 1} width={bw - 8} height={50 - bh - 2} rx={3} fill={CART} opacity={0.7} />
            </g>
          );
        })}
      </g>
      {/* posterior arcs (behind the cage) */}
      {ribs.map((i) =>
        sides.map((s) => {
          const r = rib(i, s), c = col(i);
          return <Path key={`p${i}${s}`} d={r.post} w={RW[i - 1] * 0.8} fill={mix(BONE_D, GROUP[grp(i)], c.l * 0.6)} edge={C.forest} op={0.5 * shown(i) * gop(i)} hi={false} />;
        })
      )}
      {/* sternum */}
      <g>
        {sternum > 0 && <path d="M300 92 L380 92 L392 130 L372 186 L378 196 L384 430 L366 462 L314 462 L296 430 L302 196 L308 186 L288 130 Z" fill={C.banana} filter="url(#glow)" opacity={sternum} />}
        {/* manubrium */}
        <path d="M300 96 Q340 84 380 96 L392 128 Q374 160 372 188 L308 188 Q306 160 288 128 Z" fill="url(#st)" stroke={C.forest} strokeWidth={4} />
        <path d="M322 96 Q340 108 358 96" fill="none" stroke={C.forest} strokeWidth={3} />
        {/* body */}
        <path d="M306 196 L374 196 Q382 300 384 420 Q376 452 360 462 L320 462 Q304 452 296 420 Q298 300 306 196 Z" fill="url(#st)" stroke={C.forest} strokeWidth={4} />
        {[246, 297, 348, 398].map((y) => (
          <path key={y} d={`M${305} ${y} Q340 ${y + 5} ${375} ${y}`} fill="none" stroke={C.forest} strokeWidth={2} strokeOpacity={0.3} />
        ))}
        <line x1={308} y1={192} x2={372} y2={192} stroke={C.forest} strokeWidth={3} strokeOpacity={0.6} />
        {/* xiphoid */}
        <path d="M326 466 L354 466 Q352 500 340 522 Q328 500 326 466 Z" fill={CART} stroke={C.forest} strokeWidth={3.5} />
      </g>
      {/* anterior arcs + cartilages */}
      {ribs.map((i) =>
        sides.map((s) => {
          const r = rib(i, s), c = col(i), cc = cart(i, s)!;
          const op = shown(i) * gop(i);
          const by = bobY(i);
          const cd = `M${cc[0][0]} ${cc[0][1]} Q${cc[1][0]} ${cc[1][1]} ${cc[2][0]} ${cc[2][1]}`;
          const isF = focus === i;
          return (
            <g key={`a${i}${s}`} transform={`translate(0 ${by + (1 - shown(i)) * 18})`}>
              {isF && <path d={r.ant} stroke={C.banana} strokeWidth={RW[i - 1] + 30} fill="none" strokeLinecap="round" opacity={fg * focusA} filter="url(#glow)" />}
              {isF && <path d={cd} stroke={C.banana} strokeWidth={RW[i - 1] + 28} fill="none" strokeLinecap="round" opacity={fg * focusA} filter="url(#glow)" />}
              <Path d={cd} w={RW[i - 1] * 0.82} fill={c.cart} edge={C.forest} op={op} hi={false} />
              {/* cartilage texture */}
              <path d={cd} fill="none" stroke={C.forest} strokeOpacity={0.18 * op} strokeWidth={2} strokeDasharray="2 7" />
              <Path d={r.ant} w={RW[i - 1]} fill={c.bone} edge={C.forest} op={op} />
            </g>
          );
        })
      )}
      {/* rib numbers, viewer-right */}
      {nums > 0 &&
        ribs.filter((i) => i >= numsFrom && i <= numsTo).map((i) => {
          const L = rib(i, 1).L;
          const g = grp(i);
          const k = Math.max(0, Math.min(1, nums * 12 - (i - numsFrom) * 0.9));
          return (
            <g key={`n${i}`} opacity={k} transform={`translate(${L[0] + 34} ${L[1] - 4 + bobY(i)}) scale(${0.6 + 0.4 * k})`}>
              <circle r={21} fill={(lit[g] ?? 0) > 0.5 ? GROUP[g] : C.forest} stroke={C.paper} strokeWidth={4} />
              <text y={9} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill={(lit[g] ?? 0) > 0.5 && g === "F" ? C.forest : C.paper}>{i}</text>
            </g>
          );
        })}
      {/* no front attachment for floating ribs */}
      {noFront > 0 &&
        sides.map((s) => {
          const a = cart(11, s)![2];
          const e: P = [CX + s * 70, 560];
          const m: P = [a[0] + (e[0] - a[0]) * 0.55, a[1] + (e[1] - a[1]) * 0.55];
          return (
            <g key={`nf${s}`} opacity={noFront}>
              <line x1={a[0]} y1={a[1] + bobY(11)} x2={a[0] + (e[0] - a[0]) * noFront} y2={a[1] + (e[1] - a[1]) * noFront} stroke={C.red} strokeWidth={5} strokeDasharray="10 9" strokeLinecap="round" />
              <g transform={`translate(${m[0]} ${m[1]}) scale(${noFront})`}>
                <circle r={22} fill={C.paper} stroke={C.red} strokeWidth={5} />
                <path d="M-9 -9 L9 9 M9 -9 L-9 9" stroke={C.red} strokeWidth={6} strokeLinecap="round" />
              </g>
            </g>
          );
        })}
      {/* travelling pulses along cartilage */}
      {pulses.map((p, j) => {
        const n = p.path.length - 1;
        if (p.u <= 0 || n < 1) return null;
        const x = Math.min(0.999, p.u) * n, seg = Math.floor(x), f = x - seg;
        const a = p.path[seg], b = p.path[seg + 1];
        const pt: P = [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
        return (
          <g key={`pu${j}`}>
            <polyline points={p.path.slice(0, seg + 1).concat([pt]).map((v) => v.join(",")).join(" ")} fill="none" stroke={p.color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={0.95} />
            <circle cx={pt[0]} cy={pt[1]} r={13} fill={p.color} stroke={C.forest} strokeWidth={4} />
          </g>
        );
      })}
      {/* brackets on the viewer-left */}
      {bracket.map((b, j) => {
        const s = b.side ?? -1;
        const y0 = rib(b.from, s).L[1] - 16, y1 = rib(b.to, s).L[1] + 16;
        const x = CX + s * 318;
        const len = (y1 - y0) * b.a;
        return (
          <g key={`b${j}`} opacity={Math.min(1, b.a * 2)}>
            <path d={`M${x - s * 8} ${y0} L${x} ${y0} L${x} ${y0 + len} ${b.a >= 1 ? `L${x - s * 8} ${y1}` : ""}`} fill="none" stroke={b.color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      })}
    </svg>
  );
};

/* sample points along a cartilage (for pulses) */
export const cartPath = (i: number, s: number, u0 = 0, u1 = 1, n = 14): P[] => Array.from({ length: n + 1 }, (_, k) => cartPoint(i, s, u0 + ((u1 - u0) * k) / n));
