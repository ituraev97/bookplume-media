import React from "react";
import { C, FONT, ramp } from "./kit";

/** Our own side-view schematic of the vertebral column (front = left, back = right, like Gray's FIG. 111). */
export type Reg = "C" | "T" | "L" | "S" | "Co";
type V = { reg: Reg; i: number; y: number; h: number; w: number; cx: number; ang: number };

const VBW = 470;
export const VBH = 1200;
// centreline (posterior edge of the bodies): y -> x control points
const CP: [number, number][] = [[0, 225], [120, 203], [250, 222], [480, 278], [700, 246], [840, 212], [967, 228], [1060, 262], [1140, 286], [1200, 276]];
const xAt = (y: number) => {
  let k = 0;
  while (k < CP.length - 2 && y > CP[k + 1][0]) k++;
  const [y0, x0] = CP[k], [y1, x1] = CP[k + 1];
  const m = (j: number) => {
    const a = CP[Math.max(0, j - 1)], b = CP[Math.min(CP.length - 1, j + 1)];
    return (b[1] - a[1]) / (b[0] - a[0]);
  };
  const u = (y - y0) / (y1 - y0), d = y1 - y0;
  const h00 = 2 * u ** 3 - 3 * u ** 2 + 1, h10 = u ** 3 - 2 * u ** 2 + u, h01 = -2 * u ** 3 + 3 * u ** 2, h11 = u ** 3 - u ** 2;
  return h00 * x0 + h10 * d * m(k) + h01 * x1 + h11 * d * m(k + 1);
};
const angAt = (y: number) => (Math.atan2(xAt(y + 2) - xAt(y - 2), 4) * 180) / Math.PI;

export const VERTS: V[] = (() => {
  const out: V[] = [];
  let y = 34;
  const add = (reg: Reg, n: number, h: number, gap: number, w0: number, w1: number) => {
    for (let i = 0; i < n; i++) {
      const w = w0 + ((w1 - w0) * i) / Math.max(1, n - 1);
      const cy = y + h / 2;
      out.push({ reg, i, y: cy, h, w, cx: xAt(cy), ang: angAt(cy) });
      y += h + gap;
    }
  };
  add("C", 7, 25, 8, 56, 64);
  add("T", 12, 29, 9, 68, 82);
  add("L", 5, 40, 11, 90, 100);
  y += 2;
  add("S", 5, 30, 3, 108, 56);
  y += 4;
  add("Co", 4, 13, 4, 30, 15);
  return out;
})();
export const REGY: Record<Reg, [number, number]> = (() => {
  const r = {} as Record<Reg, [number, number]>;
  (["C", "T", "L", "S", "Co"] as Reg[]).forEach((g) => {
    const vs = VERTS.filter((v) => v.reg === g);
    r[g] = [vs[0].y - vs[0].h / 2, vs[vs.length - 1].y + vs[vs.length - 1].h / 2];
  });
  return r;
})();

export const TINT: Record<Reg, [string, string, string]> = {
  C: ["#FBD9D3", C.redLight, C.red],
  T: ["#E3EDCB", C.matchaLight, C.matcha],
  L: ["#FFF4BE", C.banana, C.bananaDark],
  S: ["#F6E4C6", "#E0B98A", "#A8804E"],
  Co: ["#F6E4C6", "#E0B98A", "#A8804E"],
};
const CASCADE: Record<Reg, number> = { C: 0.07, T: 0.05, L: 0.08, S: 0.06, Co: 0.06 };

export const Spine: React.FC<{
  t: number;
  h?: number;
  lit?: Partial<Record<Reg, number>>;
  ribs?: number; // time ribs glow
  fuse?: number; // time the 5 sacral pieces fuse
  dim?: number;
  brackets?: Partial<Record<Reg, number>>; // time a region bracket appears (diagram-right)
  hideLower?: boolean;
  vb?: [number, number, number, number];
}> = ({ t, h = 920, lit = {}, ribs, fuse, dim = 0, brackets = {}, hideLower = false, vb = [0, 0, VBW, VBH] }) => {
  const w = (h * vb[2]) / vb[3];
  const rb = ribs === undefined ? 0 : ramp(t, ribs, ribs + 0.4);
  const f = fuse === undefined ? 0 : ramp(t, fuse, fuse + 0.5);
  const litP = (v: V) => {
    const t0 = lit[v.reg];
    if (t0 === undefined) return 0;
    return ramp(t, t0 + v.i * CASCADE[v.reg], t0 + v.i * CASCADE[v.reg] + 0.2);
  };
  const pulse = (v: V) => {
    const t0 = lit[v.reg];
    if (t0 === undefined) return 0;
    const tt = t0 + v.i * CASCADE[v.reg];
    return Math.max(0, 1 - Math.abs(t - tt - 0.12) / 0.22);
  };
  // sacrum pieces slide together when fused
  const sacShift = (v: V) => (v.reg === "S" ? -(v.i * 2.5) * f : v.reg === "Co" ? -10 * f : 0);
  const vis = VERTS.filter((v) => !(hideLower && (v.reg === "S" || v.reg === "Co")));
  return (
    <svg width={w} height={h} viewBox={vb.join(" ")} style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="sp33bone" cx="35%" cy="35%" r="80%">
          <stop offset="0%" stopColor="#FFFDF4" />
          <stop offset="60%" stopColor="#EFE6CC" />
          <stop offset="100%" stopColor="#D2C39A" />
        </radialGradient>
        <linearGradient id="sp33proc" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F4ECD6" />
          <stop offset="100%" stopColor="#CDBE93" />
        </linearGradient>
        {(Object.keys(TINT) as Reg[]).map((g) => (
          <radialGradient key={g} id={`sp33lit${g}`} cx="35%" cy="35%" r="80%">
            <stop offset="0%" stopColor={TINT[g][0]} />
            <stop offset="65%" stopColor={TINT[g][1]} />
            <stop offset="100%" stopColor={TINT[g][2]} />
          </radialGradient>
        ))}
        <filter id="sp33sh" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#1F2A14" floodOpacity="0.2" />
        </filter>
        <filter id="sp33glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>
      {/* ribs (behind) */}
      <g opacity={(0.25 + 0.75 * rb) * (1 - dim * 0.7)}>
        {VERTS.filter((v) => v.reg === "T").map((v) => {
          const x = v.cx + 22, y = v.y;
          const k = v.i / 11;
          const d = `M${x} ${y} C${x + 48} ${y + 26}, ${x + 4} ${y + 118 - 20 * k}, ${x - 128 + 40 * k} ${y + 132 - 30 * k}`;
          return (
            <g key={v.i}>
              <path d={d} fill="none" stroke={C.forest} strokeWidth={11} strokeLinecap="round" opacity={0.8} />
              <path d={d} fill="none" stroke={rb > 0 ? C.matchaLight : "#E9E0C4"} strokeWidth={6.5} strokeLinecap="round" />
            </g>
          );
        })}
      </g>
      {/* vertebrae */}
      {vis.map((v, idx) => {
        const p = litP(v);
        const pu = pulse(v);
        const isS = v.reg === "S", isCo = v.reg === "Co";
        const spLen = v.reg === "C" ? (v.i === 6 ? 62 : 36 + v.i * 3) : v.reg === "T" ? 62 : v.reg === "L" ? 52 : 0;
        const spDrop = v.reg === "T" ? 34 + (v.i < 9 ? 6 : -10 * (v.i - 8)) : v.reg === "C" ? 10 : 6;
        const bodyR = isCo ? 5 : 7;
        const dy = sacShift(v);
        return (
          <g key={idx} transform={`translate(${v.cx} ${v.y + dy}) rotate(${-v.ang})`} filter="url(#sp33sh)" opacity={1 - dim * 0.65}>
            {/* disc below (not for sacrum/coccyx) */}
            {!isS && !isCo && !(v.reg === "L" && v.i === 4 && hideLower) && (
              <rect x={-v.w + 3} y={v.h / 2} width={v.w - 6} height={v.reg === "L" ? 11 : v.reg === "T" ? 9 : 8} rx={4} fill="#B9C98F" stroke={C.forest} strokeWidth={2} opacity={0.9} />
            )}
            {/* posterior elements */}
            {spLen > 0 && (
              <g>
                <path
                  d={`M-2 ${-v.h * 0.32} L${spLen * 0.45} ${-v.h * 0.3} Q${spLen} ${spDrop - v.h * 0.35} ${spLen + 6} ${spDrop + 4} Q${spLen - 2} ${spDrop + v.h * 0.45} ${spLen * 0.55} ${v.h * 0.42} L-2 ${v.h * 0.32} Z`}
                  fill="url(#sp33proc)" stroke={C.forest} strokeWidth={3.5} strokeLinejoin="round"
                />
                <ellipse cx={14} cy={-v.h * 0.48} rx={8} ry={6} fill="url(#sp33bone)" stroke={C.forest} strokeWidth={2.5} />
                <circle cx={spLen * 0.32} cy={2} r={v.reg === "T" ? 9 : 7} fill={v.reg === "T" && rb > 0 ? C.matchaLight : "#E2D6B2"} stroke={C.forest} strokeWidth={2.5} />
                {p > 0 && <path d={`M-2 ${-v.h * 0.32} L${spLen * 0.45} ${-v.h * 0.3} Q${spLen} ${spDrop - v.h * 0.35} ${spLen + 6} ${spDrop + 4} Q${spLen - 2} ${spDrop + v.h * 0.45} ${spLen * 0.55} ${v.h * 0.42} L-2 ${v.h * 0.32} Z`} fill={TINT[v.reg][1]} opacity={0.45 * p} />}
              </g>
            )}
            {/* glow */}
            {p > 0 && <rect x={-v.w - 10} y={-v.h / 2 - 10} width={v.w + 20} height={v.h + 20} rx={14} fill={TINT[v.reg][1]} opacity={0.5 * p * (0.6 + 0.4 * pu)} filter="url(#sp33glow)" />}
            {/* body */}
            {isS ? (
              <path
                d={`M${-v.w} ${-v.h / 2 - f * 1.5} L0 ${-v.h / 2 - f * 1.5} L${4} ${v.h / 2 + f * 1.5} L${-v.w * 0.9} ${v.h / 2 + f * 1.5} Z`}
                fill="url(#sp33bone)" stroke={C.forest} strokeWidth={f > 0.5 ? 2 : 3.5} strokeLinejoin="round"
              />
            ) : (
              <rect x={-v.w} y={-v.h / 2} width={v.w} height={v.h} rx={bodyR} fill="url(#sp33bone)" stroke={C.forest} strokeWidth={isCo ? 2.5 : 3.5} />
            )}
            {p > 0 &&
              (isS ? (
                <path d={`M${-v.w} ${-v.h / 2 - f * 1.5} L0 ${-v.h / 2 - f * 1.5} L4 ${v.h / 2 + f * 1.5} L${-v.w * 0.9} ${v.h / 2 + f * 1.5} Z`} fill={`url(#sp33lit${v.reg})`} opacity={p} />
              ) : (
                <rect x={-v.w} y={-v.h / 2} width={v.w} height={v.h} rx={bodyR} fill={`url(#sp33lit${v.reg})`} opacity={p} />
              ))}
            {/* surface detail */}
            {!isCo && <ellipse cx={-v.w * 0.62} cy={-v.h * 0.2} rx={v.w * 0.22} ry={v.h * 0.12} fill="#FFFFFF" opacity={0.45} />}
            {!isCo && !isS && <path d={`M${-v.w + 6} ${v.h * 0.18} Q${-v.w / 2} ${v.h * 0.36} -6 ${v.h * 0.16}`} stroke={C.forest} strokeWidth={1.6} fill="none" opacity={0.3} />}
            {isS && <circle cx={-v.w * 0.32} cy={0} r={Math.max(3, v.h * 0.14)} fill={C.forest} opacity={0.35} />}
            {/* sacral spinous crest */}
            {isS && v.i < 4 && <path d={`M0 ${-v.h * 0.3} Q${16} ${-v.h * 0.1} ${12} ${v.h * 0.4}`} stroke={C.forest} strokeWidth={3} fill="#E2D6B2" />}
            {/* outline of the fused sacrum hides the separations */}
            {isS && f > 0 && (
              <rect x={-v.w + 2} y={-v.h / 2 - 3} width={v.w - 2} height={6} fill={p > 0.5 ? TINT.S[1] : "#EFE6CC"} opacity={v.i === 0 ? 0 : f} />
            )}
          </g>
        );
      })}
      {/* region brackets (right side) */}
      {(Object.keys(brackets) as Reg[]).map((g) => {
        const tt = brackets[g]!;
        const q = ramp(t, tt, tt + 0.3);
        if (q <= 0) return null;
        const [y0, y1] = REGY[g];
        const x = 372;
        return (
          <g key={g} opacity={q}>
            <path d={`M${x - 14} ${y0 + 3} L${x} ${y0 + 3} L${x} ${y0 + 3 + (y1 - y0 - 6) * q} L${x - 14} ${y0 + 3 + (y1 - y0 - 6) * q}`} fill="none" stroke={TINT[g][2]} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      })}
    </svg>
  );
};

/** small analogue clock (own drawing) */
export const Clock: React.FC<{ hour: number; size?: number; p?: number; dark?: boolean }> = ({ hour, size = 90, p = 1, dark = false }) => {
  const ha = ((hour % 12) / 12) * 360 * p;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx={50} cy={50} r={44} fill={dark ? C.paper : C.card} stroke={dark ? C.banana : C.forest} strokeWidth={7} />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <line key={i} x1={50 + Math.sin(a) * 33} y1={50 - Math.cos(a) * 33} x2={50 + Math.sin(a) * 38} y2={50 - Math.cos(a) * 38} stroke={C.forest} strokeWidth={i % 3 === 0 ? 4 : 2} strokeLinecap="round" />;
      })}
      <line x1={50} y1={50} x2={50 + Math.sin((ha * Math.PI) / 180) * 22} y2={50 - Math.cos((ha * Math.PI) / 180) * 22} stroke={C.forest} strokeWidth={7} strokeLinecap="round" />
      <line x1={50} y1={50} x2={50} y2={18} stroke={C.red} strokeWidth={4} strokeLinecap="round" />
      <circle cx={50} cy={50} r={5} fill={C.forest} />
    </svg>
  );
};
export const FONTX = FONT;
