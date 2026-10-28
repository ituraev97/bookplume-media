import React from "react";
import { C, FONT } from "./kit";

const S = C.forest;
const cl = (x: number) => Math.max(0, Math.min(1, x));

/* Person made of cell-dots; a sweep recolors cells (renewal) */
export const DotPerson: React.FC<{ h?: number; sweep: number; t: number; mode?: "all" | "mixed" }> = ({ h = 700, sweep, t, mode = "all" }) => {
  const dots: { x: number; y: number; k: number }[] = [];
  const inside = (x: number, y: number) => {
    if ((x - 200) ** 2 + (y - 70) ** 2 < 52 ** 2) return true;
    if (y > 125 && y < 400 && x > 110 && x < 290) return true; // torso
    if (y > 135 && y < 390 && ((x > 70 && x < 108) || (x > 292 && x < 330))) return true; // arms
    if (y >= 400 && y < 740 && ((x > 120 && x < 192) || (x > 208 && x < 280))) return true; // legs
    return false;
  };
  let k = 0;
  for (let y = 20; y < 740; y += 22)
    for (let x = 60; x < 340; x += 22) {
      const xo = x + ((y / 22) % 2) * 11;
      if (inside(xo, y)) dots.push({ x: xo, y, k: k++ });
    }
  const ages = ["#C9483C", "#5C7A2F", "#F2D14E", "#8FA86A", "#1F2A14"];
  return (
    <svg width={h * 0.54} height={h} viewBox="0 0 400 760">
      {dots.map((d) => {
        const r = (Math.sin(d.k * 12.9898) * 43758.5453) % 1;
        const rr = Math.abs(r);
        let fill: string;
        if (mode === "all") fill = d.y / 760 < sweep ? C.matcha : "#D9D3B5";
        else fill = ages[Math.floor(rr * ages.length)];
        const s = 1 + 0.15 * Math.sin(t * 3 + d.k);
        return <circle key={d.k} cx={d.x} cy={d.y} r={8.5 * s} fill={fill} opacity={mode === "mixed" ? 0.9 : 1} />;
      })}
    </svg>
  );
};

/* A social post card */
export const Post: React.FC<{ w?: number; t: number }> = ({ w = 760, t }) => (
  <div style={{ width: w, background: C.card, borderRadius: 30, border: `3px solid ${C.line}`, boxShadow: "0 18px 40px rgba(31,42,20,0.12)", padding: 30, fontFamily: FONT, boxSizing: "border-box" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 64, height: 64, borderRadius: 32, background: C.matchaLight }} />
      <div>
        <div style={{ width: 200, height: 16, borderRadius: 8, background: C.line }} />
        <div style={{ width: 120, height: 12, borderRadius: 6, background: C.line, marginTop: 10 }} />
      </div>
    </div>
    <div style={{ fontWeight: 800, fontSize: 46, color: S, marginTop: 26, lineHeight: 1.15 }}>"Every 7 years your body replaces every single cell."</div>
    <div style={{ display: "flex", gap: 40, marginTop: 26, fontWeight: 800, fontSize: 34, color: C.red }}>
      <span style={{ transform: `scale(${1 + 0.15 * Math.max(0, Math.sin(t * 8))})`, display: "inline-block" }}>♥ like</span>
      <span style={{ color: C.matcha, transform: `scale(${1 + 0.15 * Math.max(0, Math.sin(t * 8 + 2))})`, display: "inline-block" }}>↗ share</span>
    </div>
  </div>
);

/* Red blood cell */
export const RBC: React.FC<{ size?: number }> = ({ size = 140 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <defs>
      <radialGradient id="rbc" cx="50%" cy="50%">
        <stop offset="0%" stopColor="#9E2A22" />
        <stop offset="45%" stopColor="#C9483C" />
        <stop offset="80%" stopColor="#E06A5C" />
        <stop offset="100%" stopColor="#B53A2E" />
      </radialGradient>
    </defs>
    <circle cx={50} cy={50} r={44} fill="url(#rbc)" stroke="#7E1E18" strokeWidth={3} />
    <circle cx={50} cy={50} r={18} fill="#A8342A" opacity={0.6} />
    <path d="M24 34 C30 24 40 18 52 17" stroke="#F4A397" strokeWidth={5} strokeLinecap="round" fill="none" />
  </svg>
);

/* Gut villi; top cells shed upward (shed: 0..1 looping) */
export const Villi: React.FC<{ w?: number; t: number }> = ({ w = 760, t }) => (
  <svg width={w} height={w * 0.6} viewBox="0 0 600 360" style={{ overflow: "visible" }}>
    <rect x={20} y={280} width={560} height={60} rx={14} fill="#E8A58E" stroke={S} strokeWidth={4} />
    {Array.from({ length: 6 }, (_, i) => {
      const x = 70 + i * 92;
      return (
        <g key={i}>
          <path d={`M${x - 30} 290 L${x - 26} 90 C${x - 24} 50 ${x + 24} 50 ${x + 26} 90 L${x + 30} 290 Z`} fill="#F4C5AE" stroke={S} strokeWidth={4} />
          {Array.from({ length: 6 }, (_, j) => (
            <g key={j}>
              <rect x={x - 26} y={100 + j * 30} width={12} height={26} rx={5} fill="#E8A58E" />
              <rect x={x + 14} y={100 + j * 30} width={12} height={26} rx={5} fill="#E8A58E" />
            </g>
          ))}
          <path d={`M${x} 280 L${x} 110`} stroke={C.red} strokeWidth={3} opacity={0.6} />
          {/* shedding cells */}
          {[0, 0.33, 0.66].map((o) => {
            const ph = (t * 0.6 + o + i * 0.17) % 1;
            return <rect key={o} x={x - 7 + Math.sin(ph * 6 + i) * 10} y={54 - ph * 60} width={14} height={24} rx={6} fill="#E8A58E" opacity={1 - ph} />;
          })}
        </g>
      );
    })}
  </svg>
);

/* Horizontal lifespan bars on a log scale */
export const LifespanBars: React.FC<{ w?: number; items: { label: string; val: string; frac: number; p: number; color: string }[] }> = ({ w = 820, items }) => (
  <div style={{ width: w, fontFamily: FONT }}>
    {items.map((it) => (
      <div key={it.label} style={{ marginBottom: 26, opacity: cl(it.p * 3) }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 36, color: S, marginBottom: 8 }}>
          <span>{it.label}</span>
          <span style={{ color: C.matcha }}>{it.val}</span>
        </div>
        <div style={{ height: 46, borderRadius: 23, background: C.line, overflow: "hidden" }}>
          <div style={{ width: `${it.frac * it.p * 100}%`, height: "100%", background: it.color, borderRadius: 23 }} />
        </div>
      </div>
    ))}
  </div>
);

/* 100-square grid, n highlighted */
export const PctGrid: React.FC<{ size?: number; n: number; color?: string }> = ({ size = 360, n, color = C.red }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    {Array.from({ length: 100 }, (_, i) => (
      <rect key={i} x={(i % 10) * 10 + 1} y={Math.floor(i / 10) * 10 + 1} width={8} height={8} rx={2} fill={i < n ? color : C.line} />
    ))}
  </svg>
);

/* Brain side view with visual cortex at the back */
export const BrainSide: React.FC<{ w?: number; hi: number; t: number }> = ({ w = 640, hi, t }) => (
  <svg width={w} height={w * 0.75} viewBox="0 0 400 300" style={{ overflow: "visible" }}>
    <defs>
      <radialGradient id="bs-g" cx="40%" cy="35%">
        <stop offset="0%" stopColor="#F7C8C8" />
        <stop offset="100%" stopColor="#D98A92" />
      </radialGradient>
    </defs>
    <path d="M60 170 C40 110 80 50 160 40 C240 30 330 50 360 120 C380 170 360 220 310 230 C290 260 250 262 230 245 C200 260 150 255 130 235 C90 235 70 210 60 170 Z" fill="url(#bs-g)" stroke={S} strokeWidth={6} />
    <path d="M120 80 C140 100 130 130 110 140 M180 60 C190 90 175 120 190 150 M240 60 C230 90 250 110 240 140 M300 90 C280 110 300 140 290 170 M150 180 C180 170 210 190 240 180" stroke="#A85A66" strokeWidth={5} fill="none" strokeLinecap="round" />
    <path d="M230 245 C240 262 250 280 245 300" stroke="#D98A92" strokeWidth={22} strokeLinecap="round" />
    <path d="M300 230 C330 240 350 252 340 262 C320 270 290 258 280 244 Z" fill="#E7A4AB" stroke={S} strokeWidth={5} />
    {/* visual cortex (back = right) */}
    <path d="M318 90 C352 112 372 160 352 208 C342 222 326 228 312 228 C330 180 332 130 318 90 Z" fill={C.banana} opacity={hi * (0.75 + 0.25 * Math.sin(t * 5))} stroke={S} strokeWidth={hi > 0 ? 4 : 0} />
  </svg>
);

/* Mushroom cloud (stylized) */
export const Cloud: React.FC<{ w?: number; p: number; t: number }> = ({ w = 520, p, t }) => {
  const h = 60 + 320 * p;
  return (
    <svg width={w} height={w * 1.0} viewBox="0 0 400 400" style={{ overflow: "visible" }}>
      <rect x={0} y={360} width={400} height={40} rx={10} fill="#C9B98A" />
      <path d={`M185 365 C180 ${365 - h * 0.6} 190 ${365 - h * 0.8} 190 ${365 - h * 0.85} L210 ${365 - h * 0.85} C210 ${365 - h * 0.8} 220 ${365 - h * 0.6} 215 365 Z`} fill="#B9AE92" stroke={S} strokeWidth={4} />
      <g transform={`translate(200 ${365 - h * 0.9}) scale(${0.3 + 0.7 * p}) rotate(${Math.sin(t) * 2})`}>
        {[
          [-70, 0, 60],
          [0, -30, 75],
          [70, 0, 60],
          [-35, 25, 55],
          [35, 25, 55],
        ].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y + Math.sin(t * 2 + i) * 4} r={r} fill={i % 2 ? "#E7DCC0" : "#D8CBA8"} stroke={S} strokeWidth={4} />
        ))}
      </g>
      <ellipse cx={200} cy={362} rx={110 * p} ry={14} fill="#D8CBA8" stroke={S} strokeWidth={3} opacity={p} />
    </svg>
  );
};

export const Leaf: React.FC<{ size?: number }> = ({ size = 130 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M20 80 C20 30 60 14 88 12 C86 50 66 86 20 80 Z" fill={C.matcha} stroke={S} strokeWidth={4} />
    <path d="M20 80 C40 60 60 40 80 20" stroke={C.matchaLight} strokeWidth={4} fill="none" />
  </svg>
);
export const Bread: React.FC<{ size?: number }> = ({ size = 130 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M14 46 C10 26 30 16 50 18 C70 16 90 26 86 46 C84 52 80 52 80 56 L80 84 L20 84 L20 56 C20 52 16 52 14 46 Z" fill="#E0A85A" stroke={S} strokeWidth={4} />
    <path d="M30 40 L40 34 M48 38 L58 32 M64 40 L72 34" stroke="#B0742E" strokeWidth={4} strokeLinecap="round" />
  </svg>
);
export const MiniMan: React.FC<{ size?: number }> = ({ size = 130 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx={50} cy={22} r={14} fill="#F2C9B0" stroke={S} strokeWidth={4} />
    <path d="M28 92 L28 54 C28 42 38 38 50 38 C62 38 72 42 72 54 L72 92 Z" fill={C.matcha} stroke={S} strokeWidth={4} />
  </svg>
);
export const Atom: React.FC<{ size?: number; label?: boolean }> = ({ size = 40, label }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={{ overflow: "visible" }}>
    <circle cx={20} cy={20} r={16} fill="#7FC36B" stroke={S} strokeWidth={3} />
    {label && (
      <text x={20} y={25} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={12} fill={S}>
        14C
      </text>
    )}
  </svg>
);

/* DNA helix with C-14 atoms locked in */
export const Helix: React.FC<{ w?: number; t: number; lock: number }> = ({ w = 800, t, lock }) => {
  const N = 16;
  return (
    <svg width={w} height={w * 0.45} viewBox="0 0 800 360" style={{ overflow: "visible" }}>
      {Array.from({ length: N }, (_, i) => {
        const x = 40 + i * 48;
        const ph = i * 0.55 + t * 1.6;
        const y1 = 180 + Math.sin(ph) * 110;
        const y2 = 180 - Math.sin(ph) * 110;
        const front = Math.cos(ph) > 0;
        const marked = i % 4 === 1;
        return (
          <g key={i}>
            <line x1={x} y1={y1} x2={x} y2={y2} stroke={i % 2 ? C.banana : C.matchaLight} strokeWidth={10} strokeLinecap="round" opacity={0.85} />
            <circle cx={x} cy={y1} r={front ? 15 : 11} fill={C.matcha} stroke={S} strokeWidth={3} />
            <circle cx={x} cy={y2} r={front ? 11 : 15} fill={C.red} stroke={S} strokeWidth={3} />
            {marked && <circle cx={x} cy={180} r={14 * lock} fill="#7FC36B" stroke={S} strokeWidth={3} />}
          </g>
        );
      })}
    </svg>
  );
};

/* Eye cross-section with lens */
export const Eye: React.FC<{ w?: number; core: number; t: number }> = ({ w = 700, core, t }) => (
  <svg width={w} height={w * 0.7} viewBox="0 0 500 350" style={{ overflow: "visible" }}>
    <defs>
      <radialGradient id="ey-l">
        <stop offset="0%" stopColor={C.banana} />
        <stop offset="100%" stopColor="#FFF6CF" />
      </radialGradient>
    </defs>
    <circle cx={270} cy={175} r={150} fill="#FFFEF6" stroke={S} strokeWidth={6} />
    <circle cx={270} cy={175} r={138} fill="none" stroke="#E07A6C" strokeWidth={10} opacity={0.6} />
    <path d="M410 140 C440 150 470 160 495 150 M410 210 C440 200 470 190 495 200" stroke="#E7C9A0" strokeWidth={14} strokeLinecap="round" fill="none" />
    {/* cornea + iris */}
    <path d="M124 110 C90 140 90 210 124 240" stroke={S} strokeWidth={6} fill="#DDEBF0" />
    <rect x={130} y={95} width={14} height={60} rx={6} fill="#5C7A9A" />
    <rect x={130} y={195} width={14} height={60} rx={6} fill="#5C7A9A" />
    {/* lens */}
    <ellipse cx={168} cy={175} rx={34} ry={66} fill="#FFF6CF" stroke={S} strokeWidth={5} />
    <ellipse cx={168} cy={175} rx={16 + 2 * Math.sin(t * 4) * core} ry={32} fill="url(#ey-l)" opacity={core} stroke={C.bananaDark} strokeWidth={core > 0 ? 3 : 0} />
  </svg>
);

/* Mirror with floating age tags */
export const Mirror: React.FC<{ h?: number }> = ({ h = 640 }) => (
  <svg width={h * 0.7} height={h} viewBox="0 0 280 400">
    <ellipse cx={140} cy={190} rx={120} ry={170} fill="#5C7A2F" stroke={S} strokeWidth={8} />
    <ellipse cx={140} cy={190} rx={102} ry={152} fill="#DDEBEA" />
    <path d="M80 100 C90 70 110 60 130 56" stroke="#FFFFFF" strokeWidth={10} strokeLinecap="round" opacity={0.7} />
    <circle cx={140} cy={150} r={36} fill="#F2C9B0" stroke={S} strokeWidth={4} />
    <path d="M86 330 L86 260 C86 220 110 206 140 206 C170 206 194 220 194 260 L194 330 Z" fill={C.matchaLight} stroke={S} strokeWidth={4} />
    <rect x={124} y={360} width={32} height={34} rx={6} fill={S} />
  </svg>
);
