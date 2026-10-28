import React from "react";
import { C, FONT } from "./kit";

const BONE = "#F3E9D2";
const BONE_D = "#D9C8A4";
const INK = C.forest;
const CART = "#9FD3E0";

const Grad: React.FC<{ id: string; a?: string; b?: string; v?: boolean }> = ({ id, a = "#FFF8E6", b = BONE_D, v }) => (
  <linearGradient id={id} x1="0" y1="0" x2={v ? "0" : "1"} y2={v ? "1" : "0"}>
    <stop offset="0%" stopColor={a} />
    <stop offset="55%" stopColor={BONE} />
    <stop offset="100%" stopColor={b} />
  </linearGradient>
);

/* Long bone: ends separated by cartilage plates that fuse (p: 0 = child, 1 = fused) */
export const LongBone: React.FC<{ h?: number; p: number }> = ({ h = 620, p }) => {
  const gap = 26 * (1 - p);
  return (
    <svg width={h * 0.5} height={h} viewBox="0 0 300 600" style={{ overflow: "visible" }}>
      <defs>
        <Grad id="lb-g" />
      </defs>
      <ellipse cx={150} cy={590} rx={110} ry={10} fill={INK} opacity={0.12} />
      {/* shaft */}
      <path d="M118 150 C122 250 122 350 118 450 L182 450 C178 350 178 250 182 150 Z" fill="url(#lb-g)" stroke={INK} strokeWidth={6} />
      <path d="M132 170 L132 430" stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" opacity={0.6} />
      {/* growth plates */}
      <rect x={104} y={150 - gap} width={92} height={gap + 4} fill={CART} opacity={1 - p} stroke={INK} strokeWidth={p < 0.95 ? 3 : 0} />
      <rect x={104} y={446} width={92} height={gap + 4} fill={CART} opacity={1 - p} stroke={INK} strokeWidth={p < 0.95 ? 3 : 0} />
      {/* top end */}
      <g transform={`translate(0 ${-gap})`}>
        <path d="M95 150 C70 140 60 100 80 70 C100 40 140 40 150 60 C165 30 215 35 225 75 C235 110 215 145 200 150 Z" fill="url(#lb-g)" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        <path d="M95 95 C105 70 125 62 142 66" stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" fill="none" opacity={0.6} />
      </g>
      {/* bottom end */}
      <g transform={`translate(0 ${gap})`}>
        <path d="M100 450 C70 470 65 520 90 540 C110 560 135 548 150 535 C165 548 195 560 212 540 C235 520 230 470 200 450 Z" fill="url(#lb-g)" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        <path d="M150 535 L150 505" stroke={INK} strokeWidth={4} opacity={0.4} />
      </g>
    </svg>
  );
};

/* Five vertebrae fuse into the sacrum */
export const Sacrum: React.FC<{ w?: number; p: number }> = ({ w = 520, p }) => {
  const rows = [0, 1, 2, 3, 4];
  return (
    <svg width={w} height={w * 1.1} viewBox="0 0 400 440" style={{ overflow: "visible" }}>
      <defs>
        <Grad id="sc-g" v />
      </defs>
      <ellipse cx={200} cy={430} rx={150} ry={10} fill={INK} opacity={0.12} />
      {rows.map((i) => {
        const fullW = 260 - i * 38;
        const wv = fullW;
        const y = 30 + i * (70 - 8 * p) + 18 * p;
        const gapAlpha = 1 - p;
        return (
          <g key={i}>
            <rect x={200 - wv / 2} y={y} width={wv} height={56} rx={18} fill="url(#sc-g)" stroke={INK} strokeWidth={5} />
            <rect x={200 - wv / 2 + 12} y={y + 8} width={wv - 24} height={8} rx={4} fill="#FFFFFF" opacity={0.55} />
            {/* disc between */}
            {i < 4 && <rect x={200 - (wv - 30) / 2} y={y + 56} width={wv - 30} height={14 - 8 * p} rx={6} fill={CART} opacity={gapAlpha} stroke={INK} strokeWidth={2 * gapAlpha} />}
            {/* sacral foramina */}
            <circle cx={200 - wv / 2 + 30} cy={y + 30} r={7} fill={INK} opacity={0.35 * p} />
            <circle cx={200 + wv / 2 - 30} cy={y + 30} r={7} fill={INK} opacity={0.35 * p} />
          </g>
        );
      })}
      {/* fused outline */}
      <path d="M68 46 L332 46 C320 140 290 260 230 360 C215 385 185 385 170 360 C110 260 80 140 68 46 Z" fill="none" stroke={INK} strokeWidth={8} opacity={p} strokeLinejoin="round" />
    </svg>
  );
};

/* Front skull, colored by bone; jaw opens */
export const SkullFront: React.FC<{ w?: number; color: number; jaw: number; hi?: "cranial" | "facial" | null }> = ({ w = 560, color, jaw, hi }) => {
  const c = (base: string) => (color > 0 ? base : BONE);
  const op = (kind: "cranial" | "facial") => (hi && hi !== kind ? 0.35 : 1);
  return (
    <svg width={w} height={w * 1.2} viewBox="0 0 400 480" style={{ overflow: "visible" }}>
      <defs>
        <Grad id="sk-g" />
        <radialGradient id="sk-o" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#5A4A3A" />
          <stop offset="100%" stopColor="#2A2119" />
        </radialGradient>
      </defs>
      <ellipse cx={200} cy={472} rx={140} ry={10} fill={INK} opacity={0.12} />
      <g opacity={op("cranial")}>
        {/* base cranium */}
        <path d="M200 20 C300 20 360 90 360 190 C360 250 345 290 330 320 L70 320 C55 290 40 250 40 190 C40 90 100 20 200 20 Z" fill="url(#sk-g)" stroke={INK} strokeWidth={6} />
        {/* frontal */}
        <path d="M200 22 C298 22 356 90 357 172 C300 158 260 150 200 150 C140 150 100 158 43 172 C44 90 102 22 200 22 Z" fill={c("#F2D98A")} opacity={color} />
        {/* parietal/temporal sides */}
        <path d="M44 178 C62 174 82 172 96 176 L100 300 L64 300 C50 270 42 230 44 178 Z" fill={c("#B9A6D9")} opacity={color} />
        <path d="M356 178 C338 174 318 172 304 176 L300 300 L336 300 C350 270 358 230 356 178 Z" fill={c("#B9A6D9")} opacity={color} />
        <path d="M200 22 C298 22 356 90 357 172 C300 158 260 150 200 150 C140 150 100 158 43 172" fill="none" stroke={INK} strokeWidth={3} opacity={0.7 * color} />
        <path d="M96 176 L100 300 M304 176 L300 300" stroke={INK} strokeWidth={3} opacity={0.7 * color} />
        <path d="M120 60 C150 40 185 34 210 36" stroke="#FFFFFF" strokeWidth={12} strokeLinecap="round" fill="none" opacity={0.55} />
      </g>
      <g opacity={op("facial")}>
        {/* zygomatic */}
        <path d="M92 250 C120 255 142 262 152 278 C142 298 115 304 90 294 Z" fill={c("#E8907E")} stroke={INK} strokeWidth={4} />
        <path d="M308 250 C280 255 258 262 248 278 C258 298 285 304 310 294 Z" fill={c("#E8907E")} stroke={INK} strokeWidth={4} />
        {/* maxilla */}
        <path d="M120 272 C150 268 175 300 185 306 L215 306 C225 300 250 268 280 272 C286 310 282 336 272 348 L128 348 C118 336 114 310 120 272 Z" fill={c("#F0A868")} stroke={INK} strokeWidth={4} />
        {/* nasal bones */}
        <path d="M190 200 L210 200 L214 246 L186 246 Z" fill={c("#E58FA8")} stroke={INK} strokeWidth={3} />
        {/* upper teeth */}
        {Array.from({ length: 10 }, (_, i) => (
          <rect key={i} x={135 + i * 13.2} y={340} width={12} height={22} rx={4} fill="#FFFDF5" stroke={INK} strokeWidth={2.5} />
        ))}
      </g>
      {/* orbits & nasal cavity */}
      <ellipse cx={140} cy={215} rx={46} ry={40} fill="url(#sk-o)" stroke={INK} strokeWidth={5} />
      <ellipse cx={260} cy={215} rx={46} ry={40} fill="url(#sk-o)" stroke={INK} strokeWidth={5} />
      <path d="M200 252 C214 266 224 292 214 306 L186 306 C176 292 186 266 200 252 Z" fill="url(#sk-o)" stroke={INK} strokeWidth={4} />
      {/* mandible */}
      <g transform={`translate(0 ${jaw * 26}) rotate(${jaw * 2} 200 340)`} opacity={op("facial") === 1 && hi === "cranial" ? 0.35 : 1}>
        <path d="M108 352 L292 352 C302 384 297 422 272 446 C246 468 154 468 128 446 C103 422 98 384 108 352 Z" fill={color > 0 ? "#A9C67E" : "url(#sk-g)"} stroke={INK} strokeWidth={6} />
        {Array.from({ length: 10 }, (_, i) => (
          <rect key={i} x={135 + i * 13.2} y={354} width={12} height={20} rx={4} fill="#FFFDF5" stroke={INK} strokeWidth={2.5} />
        ))}
        <circle cx={150} cy={420} r={4} fill={INK} opacity={0.6} />
        <circle cx={250} cy={420} r={4} fill={INK} opacity={0.6} />
      </g>
    </svg>
  );
};

const zig = (pts: [number, number][], amp = 5, step = 10) => {
  const out: string[] = [];
  for (let k = 0; k < pts.length - 1; k++) {
    const [x1, y1] = pts[k];
    const [x2, y2] = pts[k + 1];
    const len = Math.hypot(x2 - x1, y2 - y1);
    const n = Math.max(2, Math.round(len / step));
    const nx = -(y2 - y1) / len;
    const ny = (x2 - x1) / len;
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const a = i % 2 ? amp : -amp;
      out.push(`${x1 + (x2 - x1) * t + nx * a},${y1 + (y2 - y1) * t + ny * a}`);
    }
  }
  return out.join(" ");
};

/* Top view of skull. gap: plate separation (newborn); font: fontanelle size 0..1; squeeze: 0..1; labels for adult sutures */
export const SkullTop: React.FC<{
  w?: number;
  gap: number;
  font: number;
  squeeze?: number;
  showSut?: { sag?: number; cor?: number; lam?: number };
}> = ({ w = 520, gap, font, squeeze = 0, showSut = {} }) => {
  const g = gap;
  const sx = 1 - 0.12 * squeeze;
  const sut = (v?: number) => (v === undefined ? 0 : v);
  return (
    <svg width={w} height={w * 1.2} viewBox="0 0 400 480" style={{ overflow: "visible" }}>
      <defs>
        <Grad id="st-g" />
        <clipPath id="st-c">
          <ellipse cx={200} cy={240} rx={150} ry={200} />
        </clipPath>
      </defs>
      <ellipse cx={200} cy={466} rx={130} ry={10} fill={INK} opacity={0.12} />
      <text x={200} y={22} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={20} fill={INK} opacity={0.5} letterSpacing={3}>
        FRONT
      </text>
      <g transform={`translate(200 240) scale(${sx} 1) translate(-200 -240)`}>
        {/* membrane */}
        <ellipse cx={200} cy={240} rx={150} ry={200} fill="#F2C2B4" stroke={INK} strokeWidth={6} />
        <g clipPath="url(#st-c)">
          {/* frontal L/R */}
          <polygon points={`40,30 ${200 - g},30 ${200 - g},${160 - g} 40,${150 - g}`} fill="url(#st-g)" />
          <polygon points={`${200 + g},30 360,30 360,${150 - g} ${200 + g},${160 - g}`} fill="url(#st-g)" />
          {/* parietal L/R */}
          <polygon points={`40,${150 + g} ${200 - g},${160 + g} ${200 - g},${375 - g} 40,${330 - g}`} fill="url(#st-g)" />
          <polygon points={`${200 + g},${160 + g} 360,${150 + g} 360,${330 - g} ${200 + g},${375 - g}`} fill="url(#st-g)" />
          {/* occipital */}
          <polygon points={`40,${330 + g} 200,${375 + g} 360,${330 + g} 360,460 40,460`} fill="url(#st-g)" />
          {/* plate edges for newborn */}
          {g > 0.5 && (
            <g fill="none" stroke={INK} strokeWidth={3} opacity={Math.min(1, g / 6)}>
              <polygon points={`40,30 ${200 - g},30 ${200 - g},${160 - g} 40,${150 - g}`} />
              <polygon points={`${200 + g},30 360,30 360,${150 - g} ${200 + g},${160 - g}`} />
              <polygon points={`40,${150 + g} ${200 - g},${160 + g} ${200 - g},${375 - g} 40,${330 - g}`} />
              <polygon points={`${200 + g},${160 + g} 360,${150 + g} 360,${330 - g} ${200 + g},${375 - g}`} />
              <polygon points={`40,${330 + g} 200,${375 + g} 360,${330 + g} 360,460 40,460`} />
            </g>
          )}
          {/* adult sutures */}
          {g < 0.5 && (
            <g fill="none" strokeLinejoin="round">
              <polyline points={zig([[40, 150], [200, 160], [360, 150]])} stroke={sut(showSut.cor) > 0 ? C.matcha : INK} strokeWidth={sut(showSut.cor) > 0 ? 6 : 3} />
              <polyline points={zig([[200, 160], [200, 375]])} stroke={sut(showSut.sag) > 0 ? C.red : INK} strokeWidth={sut(showSut.sag) > 0 ? 7 : 3} />
              <polyline points={zig([[40, 330], [200, 375], [360, 330]])} stroke={sut(showSut.lam) > 0 ? "#4F74B8" : INK} strokeWidth={sut(showSut.lam) > 0 ? 6 : 3} />
            </g>
          )}
          {/* fontanelles */}
          {font > 0 && (
            <g>
              <polygon points={`200,${160 - 46 * font} ${200 + 40 * font},160 200,${160 + 52 * font} ${200 - 40 * font},160`} fill="#F7B7A6" stroke={C.red} strokeWidth={4} strokeDasharray="8 6" />
              <polygon points={`200,${375 - 22 * font} ${200 + 20 * font},${375 + 6 * font} ${200 - 20 * font},${375 + 6 * font}`} fill="#F7B7A6" stroke={C.red} strokeWidth={3} strokeDasharray="6 5" />
            </g>
          )}
          <path d="M90 90 C120 60 160 48 190 46" stroke="#FFFFFF" strokeWidth={12} strokeLinecap="round" fill="none" opacity={0.55} />
        </g>
        <ellipse cx={200} cy={240} rx={150} ry={200} fill="none" stroke={INK} strokeWidth={6} />
      </g>
    </svg>
  );
};

/* Hand skeleton (dorsal view) */
export const HandBones: React.FC<{ w?: number; q: number }> = ({ w = 460, q }) => {
  const fingers = [
    { x: 152, base: 352, len: [54, 34, 26], ang: -8, m: 96 },
    { x: 186, base: 350, len: [60, 38, 28], ang: -2, m: 104 },
    { x: 220, base: 352, len: [56, 36, 26], ang: 4, m: 98 },
    { x: 252, base: 358, len: [44, 28, 22], ang: 10, m: 86 },
  ];
  return (
    <svg width={w} height={w * 1.25} viewBox="0 0 400 500" style={{ overflow: "visible" }}>
      <defs>
        <Grad id="hb-g" />
      </defs>
      <ellipse cx={200} cy={492} rx={130} ry={8} fill={INK} opacity={0.12} />
      {/* forearm bones */}
      <rect x={140} y={430} width={44} height={70} rx={16} fill="url(#hb-g)" stroke={INK} strokeWidth={5} />
      <rect x={196} y={430} width={52} height={70} rx={16} fill="url(#hb-g)" stroke={INK} strokeWidth={5} />
      {/* carpals */}
      {[
        [150, 400], [182, 396], [214, 398], [244, 404],
        [148, 368], [180, 364], [212, 364], [242, 370],
      ].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx={16} ry={14} fill="url(#hb-g)" stroke={INK} strokeWidth={4} />
      ))}
      {/* metacarpals + phalanges */}
      {fingers.map((f, i) => {
        let y = f.base;
        const segs = [{ l: f.m }, ...f.len.map((l) => ({ l }))];
        return (
          <g key={i} transform={`rotate(${f.ang} ${f.x} 360)`}>
            {segs.map((s, k) => {
              const top = y - s.l + (k === 0 ? 0 : 0);
              const el = <rect key={k} x={f.x - 11 + (k ? 1 : 0)} y={top} width={22 - k * 2} height={s.l - 6} rx={10} fill="url(#hb-g)" stroke={INK} strokeWidth={4} />;
              y = top - 4;
              return el;
            })}
          </g>
        );
      })}
      {/* thumb */}
      <g transform="rotate(-38 132 372)">
        {[
          [132, 300, 68],
          [132, 244, 52],
          [132, 200, 40],
        ].map(([x, y, l], k) => (
          <rect key={k} x={x - 12} y={y} width={24 - k * 2} height={l} rx={10} fill="url(#hb-g)" stroke={INK} strokeWidth={4} />
        ))}
      </g>
      <g transform={`translate(320 90) scale(${q})`} opacity={q}>
        <circle r={56} fill={C.banana} stroke={INK} strokeWidth={6} />
        <text y={28} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={80} fill={INK}>
          ?
        </text>
      </g>
    </svg>
  );
};

/* Small icons for variation cards */
export const RibIcon: React.FC<{ s?: number }> = ({ s = 110 }) => (
  <svg width={s} height={s} viewBox="0 0 100 100">
    <rect x={46} y={6} width={8} height={88} rx={4} fill={BONE_D} stroke={INK} strokeWidth={3} />
    {[18, 34, 50, 66].map((y, i) => (
      <g key={y} fill="none" strokeLinecap="round" strokeWidth={6} stroke={i === 0 ? C.red : BONE_D}>
        <path d={`M46 ${y} C25 ${y} 12 ${y + 10} 14 ${y + 22}`} />
        <path d={`M54 ${y} C75 ${y} 88 ${y + 10} 86 ${y + 22}`} />
      </g>
    ))}
  </svg>
);
export const VertIcon: React.FC<{ s?: number }> = ({ s = 110 }) => (
  <svg width={s} height={s} viewBox="0 0 100 100">
    {[8, 30, 52, 74].map((y, i) => (
      <g key={y}>
        <rect x={28} y={y} width={44} height={18} rx={7} fill={i === 3 ? C.banana : BONE} stroke={INK} strokeWidth={3} />
        <rect x={72} y={y + 5} width={16} height={8} rx={4} fill={i === 3 ? C.banana : BONE} stroke={INK} strokeWidth={2.5} />
      </g>
    ))}
  </svg>
);
export const SesamoidIcon: React.FC<{ s?: number }> = ({ s = 110 }) => (
  <svg width={s} height={s} viewBox="0 0 100 100">
    <path d="M50 4 C46 30 46 70 50 96" stroke="#D99A84" strokeWidth={14} fill="none" strokeLinecap="round" />
    <ellipse cx={49} cy={50} rx={11} ry={15} fill={C.banana} stroke={INK} strokeWidth={3} />
  </svg>
);

export const BabyIcon: React.FC<{ s?: number }> = ({ s = 120 }) => (
  <svg width={s} height={s} viewBox="0 0 100 100">
    <circle cx={50} cy={40} r={26} fill="#F2C7A8" stroke={INK} strokeWidth={4} />
    <circle cx={41} cy={40} r={3} fill={INK} />
    <circle cx={59} cy={40} r={3} fill={INK} />
    <path d="M42 52 Q50 58 58 52" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
    <path d="M44 15 C48 8 56 10 54 18" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
    <path d="M26 92 C26 72 74 72 74 92 Z" fill={C.matchaLight} stroke={INK} strokeWidth={4} />
  </svg>
);
export const AdultIcon: React.FC<{ s?: number }> = ({ s = 120 }) => (
  <svg width={s} height={s} viewBox="0 0 100 100">
    <circle cx={50} cy={32} r={20} fill="#E9B595" stroke={INK} strokeWidth={4} />
    <path d="M30 26 C32 8 68 8 70 26 C62 18 40 18 30 26 Z" fill={INK} />
    <path d="M18 96 C18 64 82 64 82 96 Z" fill={C.matcha} stroke={INK} strokeWidth={4} />
  </svg>
);
