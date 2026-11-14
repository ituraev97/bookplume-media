import React from "react";
import { C, FONT, ramp } from "./kit";

/** Our own schematic of the 8 carpal bones (left hand, back view: thumb on the left, fingers up, forearm down). */
export type BoneId = "S" | "L" | "Tq" | "P" | "Tm" | "Td" | "Cp" | "H";
type Bone = { id: BoneId; name: string; letter: string; cx: number; cy: number; rx: number; ry: number; rot: number; lx: number; ly: number };
export const BONES: Bone[] = [
  { id: "S", name: "Scaphoid", letter: "S", cx: 232, cy: 478, rx: 84, ry: 52, rot: -18, lx: 232, ly: 478 },
  { id: "L", name: "Lunate", letter: "L", cx: 372, cy: 488, rx: 60, ry: 54, rot: 0, lx: 372, ly: 488 },
  { id: "Tq", name: "Triquetrum", letter: "T", cx: 492, cy: 464, rx: 60, ry: 47, rot: 22, lx: 486, ly: 468 },
  { id: "P", name: "Pisiform", letter: "P", cx: 590, cy: 430, rx: 34, ry: 32, rot: 0, lx: 590, ly: 430 },
  { id: "Tm", name: "Trapezium", letter: "T", cx: 168, cy: 348, rx: 62, ry: 54, rot: -24, lx: 168, ly: 350 },
  { id: "Td", name: "Trapezoid", letter: "T", cx: 282, cy: 340, rx: 46, ry: 50, rot: 0, lx: 282, ly: 342 },
  { id: "Cp", name: "Capitate", letter: "C", cx: 388, cy: 352, rx: 58, ry: 72, rot: 0, lx: 388, ly: 352 },
  { id: "H", name: "Hamate", letter: "H", cx: 504, cy: 346, rx: 62, ry: 62, rot: 6, lx: 500, ly: 340 },
];

export const Wrist: React.FC<{
  t: number;
  w?: number;
  lit?: Partial<Record<BoneId, number>>; // time each bone lights up
  rowHi?: { d?: number; p?: number }; // times the rows get outlined
  thumbGlow?: number;
  hookGlow?: number;
  showLetters?: boolean;
  dim?: number;
}> = ({ t, w = 800, lit = {}, rowHi = {}, thumbGlow, hookGlow, showLetters = true, dim = 0 }) => {
  const h = w * 0.875;
  const glowT = thumbGlow !== undefined ? ramp(t, thumbGlow, thumbGlow + 0.3) : 0;
  const hk = hookGlow !== undefined ? ramp(t, hookGlow, hookGlow + 0.3) : 0;
  const row = (tt: number | undefined) => (tt === undefined ? 0 : ramp(t, tt, tt + 0.35));
  const meta = [
    { x1: 150, y1: 300, x2: 70, y2: 120, wd: 52 },
    { x1: 282, y1: 292, x2: 268, y2: 40, wd: 44 },
    { x1: 388, y1: 282, x2: 392, y2: 30, wd: 46 },
    { x1: 492, y1: 290, x2: 506, y2: 48, wd: 42 },
    { x1: 560, y1: 304, x2: 610, y2: 80, wd: 40 },
  ];
  return (
    <svg width={w} height={h} viewBox="0 0 800 700" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="w14bone" cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#FFFDF4" />
          <stop offset="60%" stopColor="#EFE6CC" />
          <stop offset="100%" stopColor="#D2C39A" />
        </radialGradient>
        <radialGradient id="w14lit" cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#FFF4BE" />
          <stop offset="65%" stopColor={C.banana} />
          <stop offset="100%" stopColor={C.bananaDark} />
        </radialGradient>
        <linearGradient id="w14shaft" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#D8CBA5" />
          <stop offset="45%" stopColor="#FBF6E6" />
          <stop offset="100%" stopColor="#CDBE93" />
        </linearGradient>
        <filter id="w14sh" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#1F2A14" floodOpacity="0.18" />
        </filter>
        <filter id="w14glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>
      {/* forearm bones */}
      <g filter="url(#w14sh)" opacity={1 - dim * 0.6}>
        <path d="M150 700 L170 575 Q180 548 230 545 L410 548 Q440 552 440 580 L430 700 Z" fill="url(#w14shaft)" stroke={C.forest} strokeWidth={4} />
        <path d="M470 700 L478 590 Q484 562 520 560 L585 562 Q610 568 606 596 L596 700 Z" fill="url(#w14shaft)" stroke={C.forest} strokeWidth={4} />
        <text x={290} y={650} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.forest} opacity={0.45}>RADIUS</text>
        <text x={538} y={652} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={C.forest} opacity={0.45}>ULNA</text>
      </g>
      {/* metacarpals */}
      <g filter="url(#w14sh)" opacity={1 - dim * 0.6}>
        {meta.map((m, i) => {
          const ang = Math.atan2(m.y2 - m.y1, m.x2 - m.x1);
          const len = Math.hypot(m.x2 - m.x1, m.y2 - m.y1);
          const thumb = i === 0;
          return (
            <g key={i} transform={`translate(${m.x1} ${m.y1}) rotate(${(ang * 180) / Math.PI})`}>
              {thumb && glowT > 0 && <rect x={-10} y={-m.wd / 2 - 12} width={len + 20} height={m.wd + 24} rx={(m.wd + 24) / 2} fill={C.banana} opacity={0.75 * glowT} filter="url(#w14glow)" />}
              <path d={`M0 ${-m.wd * 0.55} Q${len * 0.2} ${-m.wd * 0.3} ${len * 0.5} ${-m.wd * 0.3} Q${len * 0.8} ${-m.wd * 0.3} ${len - m.wd * 0.3} ${-m.wd * 0.45} L${len - m.wd * 0.3} ${m.wd * 0.45} Q${len * 0.8} ${m.wd * 0.3} ${len * 0.5} ${m.wd * 0.3} Q${len * 0.2} ${m.wd * 0.3} 0 ${m.wd * 0.55} Q${-m.wd * 0.2} 0 0 ${-m.wd * 0.55} Z`} fill="url(#w14shaft)" stroke={C.forest} strokeWidth={4} strokeLinejoin="round" />
              <ellipse cx={len - m.wd * 0.15} cy={0} rx={m.wd * 0.5} ry={m.wd * 0.56} fill="url(#w14bone)" stroke={C.forest} strokeWidth={4} />
              <line x1={m.wd * 0.6} y1={-m.wd * 0.18} x2={len - m.wd} y2={-m.wd * 0.12} stroke={C.forest} strokeWidth={2} opacity={0.25} />
            </g>
          );
        })}
      </g>
      {/* row outlines */}
      {row(rowHi.d) > 0 && <rect x={92} y={262} width={492} height={176} rx={88} fill="none" stroke={C.matcha} strokeWidth={8} strokeDasharray="22 14" opacity={row(rowHi.d)} />}
      {row(rowHi.p) > 0 && <rect x={132} y={400} width={510} height={150} rx={75} fill="none" stroke={C.red} strokeWidth={8} strokeDasharray="22 14" opacity={row(rowHi.p)} />}
      {/* carpals */}
      {BONES.map((b) => {
        const lt = lit[b.id];
        const p = lt === undefined ? 0 : ramp(t, lt, lt + 0.25);
        const pulse = lt === undefined ? 0 : Math.max(0, 1 - Math.abs(t - lt - 0.15) / 0.3);
        return (
          <g key={b.id} transform={`translate(${b.cx} ${b.cy}) rotate(${b.rot}) scale(${1 + 0.1 * pulse})`} filter="url(#w14sh)">
            {p > 0 && <ellipse rx={b.rx + 14} ry={b.ry + 14} fill={C.banana} opacity={0.55 * p} filter="url(#w14glow)" />}
            <ellipse rx={b.rx} ry={b.ry} fill="url(#w14bone)" stroke={C.forest} strokeWidth={4.5} />
            <ellipse rx={b.rx} ry={b.ry} fill="url(#w14lit)" opacity={p} />
            <ellipse cx={-b.rx * 0.25} cy={-b.ry * 0.3} rx={b.rx * 0.35} ry={b.ry * 0.18} fill="#FFFFFF" opacity={0.45} />
            <path d={`M${-b.rx * 0.55} ${b.ry * 0.25} Q0 ${b.ry * 0.55} ${b.rx * 0.5} ${b.ry * 0.2}`} stroke={C.forest} strokeWidth={2} fill="none" opacity={0.25} />
          </g>
        );
      })}
      {/* hook of the hamate (palm side) */}
      <g transform="translate(540 382)">
        {hk > 0 && <circle r={42} fill={C.red} opacity={0.4 * hk} filter="url(#w14glow)" />}
        <path d="M-18 -10 Q20 -18 26 12 Q28 30 12 34 Q18 14 -6 8 Z" fill={hk > 0 ? C.red : "url(#w14bone)"} stroke={C.forest} strokeWidth={4} />
      </g>
      {/* letters */}
      {showLetters &&
        BONES.map((b) => {
          const lt = lit[b.id];
          const p = lt === undefined ? 0 : ramp(t, lt, lt + 0.2);
          if (p <= 0) return null;
          return (
            <text key={b.id} x={b.lx} y={b.ly + 15} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={b.id === "P" ? 36 : 46} fill={C.forest} opacity={p}>
              {b.letter}
            </text>
          );
        })}
      {/* thumb tag */}
      {glowT > 0 && (
        <g opacity={glowT} transform={`translate(${-6 + (1 - glowT) * -30} 70)`}>
          <rect x={-10} y={-34} width={196} height={58} rx={29} fill={C.forest} />
          <text x={88} y={6} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.banana}>THUMB</text>
        </g>
      )}
    </svg>
  );
};

/** name tag that pops beside a bone (positions in diagram units, diagram drawn at width w) */
export const BoneTag: React.FC<{ t: number; t0: number; id: BoneId; w: number; side?: "up" | "down"; ox?: number }> = ({ t, t0, id, w, side = "down", ox = 0 }) => {
  const b = BONES.find((x) => x.id === id)!;
  const k = w / 800;
  const p = ramp(t, t0, t0 + 0.22);
  if (p <= 0) return null;
  const y = (side === "down" ? b.cy + b.ry + 26 : b.cy - b.ry - 78) * k;
  return (
    <div style={{ position: "absolute", left: (b.cx + ox) * k, top: y, transform: `translate(-50%, ${(1 - p) * 16}px) scale(${0.8 + 0.2 * p})`, opacity: p, background: C.forest, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 32, padding: "6px 16px 9px", borderRadius: 14, whiteSpace: "nowrap", boxShadow: "0 6px 0 rgba(31,42,20,0.15)" }}>
      {b.name}
    </div>
  );
};
