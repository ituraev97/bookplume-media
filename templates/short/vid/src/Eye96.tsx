import React from "react";
import { C, FONT } from "./kit";

/* Book Plume's own diagram of the 6 extraocular muscles: RIGHT eye seen from the front (viewer's right = MEDIAL / nose side),
   viewBox 1000 x 1000. Four recti run straight back from the globe; superior oblique runs along the upper medial wall,
   through its pulley (trochlea) and back to the globe; inferior oblique swings under the globe from the medial floor. */
export type EM = "SR" | "IR" | "MR" | "LR" | "SO" | "IO";
export const EORDER: EM[] = ["SR", "IR", "MR", "LR", "SO", "IO"];
export const ENAME: Record<EM, string> = { SR: "Superior rectus", IR: "Inferior rectus", MR: "Medial rectus", LR: "Lateral rectus", SO: "Superior oblique", IO: "Inferior oblique" };
export const ENERVE: Record<EM, 3 | 4 | 6> = { SR: 3, IR: 3, MR: 3, LR: 6, SO: 4, IO: 3 };
export const EACT: Record<EM, string> = { SR: "eye up", IR: "eye down", MR: "eye in", LR: "eye out", SO: "eye down + out", IO: "eye up + out" };
export const NCOL: Record<3 | 4 | 6, string> = { 3: "#5C7A2F", 4: "#E0861A", 6: "#2F7DB8" };
export const NNAME: Record<3 | 4 | 6, string> = { 3: "oculomotor", 4: "trochlear", 6: "abducens" };
export const NROM: Record<3 | 4 | 6, string> = { 3: "III", 4: "IV", 6: "VI" };
const MUS = "#CF5A44";
const MUS_HOT = "#EE6A4E";
const DIM = "#DCCDB6";

type P = [number, number];
const CX = 500, CY = 520, RG = 178;

/* straight tapered band with fibres */
const band = (a: P, b: P, w0: number, w1: number) => {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const L = Math.hypot(dx, dy);
  const nx = -dy / L, ny = dx / L;
  const p = (q: P, w: number, s: number): P => [q[0] + nx * w * s / 2, q[1] + ny * w * s / 2];
  const A1 = p(a, w0, 1), A2 = p(a, w0, -1), B1 = p(b, w1, 1), B2 = p(b, w1, -1);
  const outline = `M ${A1[0]} ${A1[1]} L ${B1[0]} ${B1[1]} Q ${b[0] + (dx / L) * 18} ${b[1] + (dy / L) * 18} ${B2[0]} ${B2[1]} L ${A2[0]} ${A2[1]} Q ${a[0] - (dx / L) * 10} ${a[1] - (dy / L) * 10} ${A1[0]} ${A1[1]} Z`;
  const fib: string[] = [];
  for (let i = 1; i < 8; i++) {
    const s = -1 + (2 * i) / 8;
    const f0 = p(a, w0 * 0.92, s), f1 = p(b, w1 * 0.92, s);
    fib.push(`M ${f0[0].toFixed(1)} ${f0[1].toFixed(1)} L ${f1[0].toFixed(1)} ${f1[1].toFixed(1)}`);
  }
  return { outline, fib: fib.join(" ") };
};

const RECTI: Record<"SR" | "IR" | "MR" | "LR", { a: P; b: P; w0: number; w1: number }> = {
  SR: { a: [CX, CY - RG + 26], b: [CX - 10, CY - RG - 200], w0: 130, w1: 92 },
  IR: { a: [CX, CY + RG - 26], b: [CX + 6, CY + RG + 190], w0: 128, w1: 90 },
  MR: { a: [CX + RG - 26, CY], b: [CX + RG + 196, CY + 6], w0: 136, w1: 96 },
  LR: { a: [CX - RG + 26, CY], b: [CX - RG - 200, CY - 4], w0: 132, w1: 92 },
};
const TROCH: P = [770, 236];
const SO_BELLY = "M 690 430 C 710 360 735 300 758 258";
const SO_TENDON = "M 770 238 C 700 270 600 300 455 352";
const IO_PATH = "M 790 778 C 700 840 560 830 470 770 C 420 735 380 690 352 640";

export const Eye: React.FC<{
  t: number; w: number; id: string;
  lit?: Partial<Record<EM, number>>; hot?: EM[]; nerve?: number; look?: P; labels?: boolean; dim?: number;
}> = ({ t, w, id, lit = {}, hot = [], nerve = 0, look = [0, 0], labels = true, dim = 0 }) => {
  const on = (m: EM) => lit[m] !== undefined && t >= (lit[m] as number) - 0.05;
  const isHot = (m: EM) => hot.includes(m);
  const fill = (m: EM) => {
    if (!on(m)) return DIM;
    if (nerve > 0.5) return NCOL[ENERVE[m]];
    return isHot(m) ? MUS_HOT : MUS;
  };
  const op = (m: EM) => (dim > 0 && !isHot(m) ? 1 - 0.55 * dim : 1);
  const glow = (m: EM) => (isHot(m) ? `url(#glow${id})` : undefined);
  const Rect: React.FC<{ m: "SR" | "IR" | "MR" | "LR" }> = ({ m }) => {
    const r = RECTI[m];
    const bd = band(r.a, r.b, r.w0, r.w1);
    const k = 0.16;
    const tcap = band(r.a, [r.a[0] + (r.b[0] - r.a[0]) * k, r.a[1] + (r.b[1] - r.a[1]) * k], r.w0, r.w0 - (r.w0 - r.w1) * k);
    return (
      <g opacity={op(m)} filter={glow(m)}>
        {isHot(m) && <path d={bd.outline} fill="none" stroke={C.banana} strokeWidth={22} strokeLinejoin="round" />}
        <path d={bd.outline} fill={fill(m)} stroke={C.forest} strokeWidth={6} strokeLinejoin="round" />
        <path d={bd.fib} stroke="rgba(255,255,255,0.35)" strokeWidth={3} fill="none" />
        <path d={bd.fib} stroke="rgba(31,42,20,0.18)" strokeWidth={2} fill="none" transform="translate(4 3)" />
        <path d={tcap.outline} fill="rgba(250,244,228,0.82)" stroke={C.forest} strokeWidth={4} />
      </g>
    );
  };
  const Curve: React.FC<{ m: "SO" | "IO"; d: string; wd: number }> = ({ m, d, wd }) => (
    <g opacity={op(m)} filter={glow(m)}>
      {isHot(m) && <path d={d} fill="none" stroke={C.banana} strokeWidth={wd + 26} strokeLinecap="round" />}
      <path d={d} fill="none" stroke={C.forest} strokeWidth={wd + 12} strokeLinecap="round" />
      <path d={d} fill="none" stroke={fill(m)} strokeWidth={wd} strokeLinecap="round" />
      <path d={d} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={3} strokeDasharray="26 12" strokeLinecap="round" transform="translate(0 -9)" />
      <path d={d} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={3} strokeDasharray="18 14" strokeLinecap="round" transform="translate(0 9)" />
    </g>
  );
  const soTendonCol = on("SO") ? (nerve > 0.5 ? NCOL[4] : "#F2E3C8") : "#EFE6D6";
  const ix = look[0] * 70, iy = look[1] * 70;
  return (
    <svg width={w} height={w} viewBox="0 0 1000 1000" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={`scl${id}`} cx="0.42" cy="0.38" r="0.7">
          <stop offset="0" stopColor="#FFFFFC" />
          <stop offset="0.7" stopColor="#F4F1E4" />
          <stop offset="1" stopColor="#DCD6C0" />
        </radialGradient>
        <radialGradient id={`iris${id}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.35" stopColor="#3F5A22" />
          <stop offset="0.8" stopColor="#6E8F3A" />
          <stop offset="1" stopColor="#2C3F17" />
        </radialGradient>
        <radialGradient id={`fat${id}`} cx="0.5" cy="0.52" r="0.55">
          <stop offset="0" stopColor="#F8EFD8" />
          <stop offset="1" stopColor="#EAD9B4" />
        </radialGradient>
        <filter id={`glow${id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#F2D14E" floodOpacity="0.9" />
        </filter>
      </defs>
      {/* orbit: bony rim + fat */}
      <path d="M 170 300 C 190 170 330 110 500 112 C 690 114 850 170 880 320 C 905 450 900 640 850 770 C 800 890 640 930 500 928 C 330 926 190 880 150 760 C 112 640 140 420 170 300 Z" fill="#EADFC6" stroke={C.forest} strokeWidth={8} />
      <path d="M 210 320 C 228 210 350 160 500 162 C 670 164 805 214 828 330 C 850 450 846 630 802 740 C 760 846 630 878 500 876 C 350 874 230 836 198 736 C 166 630 192 430 210 320 Z" fill={`url(#fat${id})`} stroke="rgba(31,42,20,0.35)" strokeWidth={4} />
      {/* orbital rim shading */}
      <path d="M 180 300 C 200 180 330 124 500 126" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth={10} strokeLinecap="round" />
      <circle cx={CX + 8} cy={CY + 10} r={RG + 40} fill="rgba(110,80,40,0.16)" />
      {/* inferior oblique (under the globe, under the inferior rectus) */}
      <Curve m="IO" d={IO_PATH} wd={58} />
      {/* globe */}
      <circle cx={CX} cy={CY} r={RG} fill={`url(#scl${id})`} stroke={C.forest} strokeWidth={7} />
      <g transform={`translate(${ix} ${iy})`}>
        <circle cx={CX} cy={CY} r={84} fill={`url(#iris${id})`} stroke={C.forest} strokeWidth={5} />
        {Array.from({ length: 28 }).map((_, i) => {
          const a = (i / 28) * Math.PI * 2;
          return <line key={i} x1={CX + Math.cos(a) * 40} y1={CY + Math.sin(a) * 40} x2={CX + Math.cos(a) * 78} y2={CY + Math.sin(a) * 78} stroke="rgba(214,232,160,0.35)" strokeWidth={3} />;
        })}
        <circle cx={CX} cy={CY} r={36} fill="#111" />
        <circle cx={CX - 26} cy={CY - 28} r={14} fill="#fff" opacity={0.9} />
      </g>
      {/* superior oblique tendon: trochlea → back to the globe, passes UNDER the superior rectus */}
      <g opacity={op("SO")}>
        <path d={SO_TENDON} fill="none" stroke={C.forest} strokeWidth={34} strokeLinecap="round" />
        <path d={SO_TENDON} fill="none" stroke={soTendonCol} strokeWidth={22} strokeLinecap="round" />
      </g>
      <Rect m="IR" />
      <Rect m="LR" />
      <Rect m="MR" />
      <Rect m="SR" />
      {/* superior oblique belly along the upper medial wall */}
      <Curve m="SO" d={SO_BELLY} wd={62} />
      {/* trochlea (pulley) */}
      <g>
        <ellipse cx={TROCH[0]} cy={TROCH[1]} rx={34} ry={22} fill="none" stroke={C.forest} strokeWidth={18} transform={`rotate(-38 ${TROCH[0]} ${TROCH[1]})`} />
        <ellipse cx={TROCH[0]} cy={TROCH[1]} rx={34} ry={22} fill="none" stroke={isHot("SO") ? C.banana : "#F7F3E3"} strokeWidth={9} transform={`rotate(-38 ${TROCH[0]} ${TROCH[1]})`} />
      </g>
      {labels && (
        <g fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.forest} opacity={0.75}>
          <text x={70} y={540} textAnchor="middle" transform="rotate(-90 70 540)" letterSpacing={4}>LATERAL</text>
          <text x={940} y={540} textAnchor="middle" transform="rotate(90 940 540)" letterSpacing={4}>MEDIAL · NOSE</text>
        </g>
      )}
    </svg>
  );
};

/* anchor points (viewBox units) for name tags */
export const EANCH: Record<EM, P> = {
  SR: [CX - 6, CY - RG - 120], IR: [CX + 4, CY + RG + 120], MR: [CX + RG + 120, CY + 4], LR: [CX - RG - 120, CY - 2],
  SO: [790, 330], IO: [640, 840],
};
