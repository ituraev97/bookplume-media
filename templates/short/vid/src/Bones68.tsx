import React from "react";
import { C, FONT } from "./kit";

/* Book Plume own diagrams for short 68 (babies ~300 bones → adults 206). */

const BONE = "#EFE7CC";
const BONE_D = "#D9CDA4";
const SOFT = "#F2C0B8";

/** Newborn skull seen from above (front = top). Plates + sutures + fontanelles; each part lights up 0..1. */
export const NewbornSkull: React.FC<{
  w: number; id: string; t: number;
  plates?: number; ant?: number; post?: number; sut?: number; close?: number;
}> = ({ w, id, t, plates = 0, ant = 0, post = 0, sut = 0, close = 0 }) => {
  const h = (w * 760) / 600;
  const clip = `nsk-${id}`;
  // radiating fibres from each plate's ossification centre (like the 1918 engraving)
  const rays = (cx: number, cy: number, n: number, r0: number, r1: number, k: string) =>
    Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 + (i % 3) * 0.05;
      const rr = r1 * (0.75 + 0.25 * Math.sin(i * 2.3));
      return <line key={k + i} x1={cx + Math.cos(a) * r0} y1={cy + Math.sin(a) * r0} x2={cx + Math.cos(a) * rr} y2={cy + Math.sin(a) * rr} stroke={BONE_D} strokeWidth={2.2} strokeLinecap="round" />;
    });
  const pulse = 0.5 + 0.5 * Math.sin(t * 7);
  const fill = (p: number, col: string) => (p > 0 ? col : "none");
  // fontanelle shrink with closure
  const s = 1 - 0.85 * close;
  const ad = (dx: number, dy: number) => `${300 + dx * s},${245 + dy * s}`;
  return (
    <svg width={w} height={h} viewBox="0 0 600 760" style={{ overflow: "visible" }}>
      <defs>
        <clipPath id={clip}>
          <ellipse cx={300} cy={385} rx={238} ry={340} />
        </clipPath>
        <radialGradient id={`g-${id}`} cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#FBF6E4" />
          <stop offset="100%" stopColor={BONE} />
        </radialGradient>
      </defs>
      {/* shadow + skull */}
      <ellipse cx={306} cy={398} rx={238} ry={340} fill="rgba(31,42,20,0.12)" />
      <ellipse cx={300} cy={385} rx={238} ry={340} fill={`url(#g-${id})`} stroke={C.forest} strokeWidth={7} />
      <g clipPath={`url(#${clip})`}>
        {rays(170, 150, 34, 14, 120, "fl")}
        {rays(430, 150, 34, 14, 120, "fr")}
        {rays(150, 440, 46, 16, 190, "pl")}
        {rays(450, 440, 46, 16, 190, "pr")}
        {rays(300, 700, 30, 12, 120, "oc")}
        {/* plates light up */}
        <g opacity={plates * 0.55}>
          <path d="M0 0 H300 V245 Q180 245 60 290 L0 300 Z" fill={fill(plates, C.banana)} />
          <path d="M600 0 H300 V245 Q420 245 540 290 L600 300 Z" fill={fill(plates, C.banana)} />
          <path d="M300 245 Q180 245 60 290 L0 300 L0 700 L120 650 L300 575 Z" fill={fill(plates, C.matchaLight)} />
          <path d="M300 245 Q420 245 540 290 L600 300 L600 700 L480 650 L300 575 Z" fill={fill(plates, C.matchaLight)} />
          <path d="M0 700 L120 650 L300 575 L480 650 L600 700 L600 800 L0 800 Z" fill={fill(plates, C.banana)} />
        </g>
        {/* sutures (gaps between plates) */}
        <g stroke={C.forest} strokeWidth={10 - 6 * close} fill="none" strokeLinecap="round" opacity={0.85}>
          <path d="M60 290 Q300 200 540 290" />
          <path d="M120 650 L300 575 L480 650" />
          <path d="M300 245 L300 575" />
          <path d="M300 40 L300 245" />
        </g>
        <g stroke={C.red} strokeWidth={6} fill="none" strokeLinecap="round" opacity={sut * (1 - close)}>
          <path d="M60 290 Q300 200 540 290" />
          <path d="M120 650 L300 575 L480 650" />
          <path d="M300 245 L300 575" />
          <path d="M300 40 L300 245" />
        </g>
      </g>
      {/* anterior fontanelle (diamond) */}
      <polygon points={`${ad(0, -62)} ${ad(52, 0)} ${ad(0, 70)} ${ad(-52, 0)}`} fill={SOFT} stroke={C.forest} strokeWidth={5} strokeLinejoin="round" />
      {ant > 0 && (
        <polygon points={`${ad(0, -62)} ${ad(52, 0)} ${ad(0, 70)} ${ad(-52, 0)}`} fill={C.red} opacity={ant * (0.55 + 0.25 * pulse)} stroke={C.red} strokeWidth={4 + 4 * pulse} strokeLinejoin="round" />
      )}
      {/* posterior fontanelle (small triangle) */}
      <polygon points={`300,${575 - 26 * s} ${300 + 26 * s},${600} ${300 - 26 * s},${600}`} fill={SOFT} stroke={C.forest} strokeWidth={5} strokeLinejoin="round" />
      {post > 0 && (
        <polygon points={`300,${575 - 26 * s} ${300 + 26 * s},${600} ${300 - 26 * s},${600}`} fill={C.red} opacity={post * (0.55 + 0.25 * pulse)} strokeLinejoin="round" />
      )}
      {/* front marker */}
      <g opacity={0.6}>
        <text x={300} y={-14} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={C.matcha}>FRONT ↑</text>
      </g>
    </svg>
  );
};

/** Right hip bone, lateral view, FRONT = LEFT (same orientation as Gray's Fig. 237): ilium / ischium / pubis meeting at the acetabulum. */
export const HipBone: React.FC<{
  w: number; id: string; t: number;
  il?: number; is?: number; pu?: number; ac?: number; tub?: number; dim?: number;
}> = ({ w, id, t, il = 0, is = 0, pu = 0, ac = 0, tub = 0, dim = 0 }) => {
  const h = (w * 700) / 600;
  const clip = `hip-${id}`;
  const OUT =
    "M 95 235 C 80 140 190 65 330 60 C 470 55 575 120 565 215 L 545 280 C 490 300 455 340 465 420 L 495 445 C 470 465 465 500 480 540 C 500 590 480 640 430 655 C 370 670 300 640 250 610 C 200 590 140 600 100 580 C 80 560 85 500 105 480 C 150 455 195 445 220 430 C 195 400 150 360 150 320 C 125 300 100 275 95 235 Z";
  const pulse = 0.5 + 0.5 * Math.sin(t * 7);
  const zone = (p: number, col: string, d: string) => <path d={d} fill={col} opacity={p * (0.82 - 0.4 * dim)} />;
  return (
    <svg width={w} height={h} viewBox="0 0 600 700" style={{ overflow: "visible" }}>
      <defs>
        <clipPath id={clip}>
          <path d={OUT} />
        </clipPath>
        <radialGradient id={`hg-${id}`} cx="55%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#FBF6E4" />
          <stop offset="100%" stopColor={BONE} />
        </radialGradient>
      </defs>
      <path d={OUT} fill="rgba(31,42,20,0.12)" transform="translate(8 10)" />
      <path d={OUT} fill={`url(#hg-${id})`} />
      <g clipPath={`url(#${clip})`}>
        {zone(il, C.matchaLight, "M0 0 H600 V400 L300 410 L0 380 Z")}
        {zone(pu, C.banana, "M0 380 L300 410 L310 800 L0 800 Z")}
        {zone(is, C.redLight, "M600 400 L300 410 L310 800 L600 800 Z")}
        {Array.from({ length: 19 }, (_, i) => {
          const a = Math.PI * (1.08 + (i / 18) * 0.84);
          return <path key={i} d={`M ${330 + Math.cos(a) * 70} ${330 + Math.sin(a) * 70} Q ${330 + Math.cos(a) * 170} ${300 + Math.sin(a) * 170} ${330 + Math.cos(a) * 270} ${320 + Math.sin(a) * 260}`} stroke={BONE_D} strokeWidth={2.2} fill="none" opacity={0.75} />;
        })}
        <path d="M 200 120 C 300 170 420 170 520 230" stroke={BONE_D} strokeWidth={4} fill="none" />
        <path d="M 175 230 C 280 260 380 250 470 300" stroke={BONE_D} strokeWidth={4} fill="none" />
        <path d="M 95 235 C 80 140 190 65 330 60 C 470 55 575 120 565 215" fill="none" stroke={C.forest} strokeWidth={22} opacity={0.12} />
        <path d="M 545 280 C 490 300 455 340 465 420" fill="none" stroke={C.forest} strokeWidth={26} opacity={0.08} />
        <path d="M 480 540 C 500 590 480 640 430 655" fill="none" stroke={C.forest} strokeWidth={26} opacity={0.1} />
      </g>
      <ellipse cx={250} cy={545} rx={82} ry={48} fill={C.card} stroke={C.forest} strokeWidth={6} transform="rotate(-18 250 545)" />
      <circle cx={300} cy={410} r={84} fill="#E2D6AE" stroke={C.forest} strokeWidth={7} />
      <circle cx={300} cy={418} r={52} fill="#CDBF92" />
      <path d="M 252 470 A 66 66 0 1 1 352 470" fill="none" stroke="#F6EFD8" strokeWidth={15} strokeLinecap="round" opacity={0.9} />
      <g stroke={ac > 0 ? C.forest : "#B9AB7D"} strokeWidth={ac > 0 ? 7 : 4} strokeLinecap="round" opacity={0.5 + 0.5 * ac}>
        <line x1={300} y1={410} x2={218} y2={392} />
        <line x1={300} y1={410} x2={383} y2={402} />
        <line x1={300} y1={410} x2={305} y2={494} />
      </g>
      {ac > 0 && <circle cx={300} cy={410} r={92 + 6 * pulse} fill="none" stroke={C.red} strokeWidth={8} opacity={ac} />}
      {tub > 0 && <ellipse cx={470} cy={598} rx={42 + 4 * pulse} ry={50 + 4 * pulse} fill="none" stroke={C.red} strokeWidth={8} opacity={tub} />}
      <path d={OUT} fill="none" stroke={C.forest} strokeWidth={7} strokeLinejoin="round" />
    </svg>
  );
};

/** Two bone pieces sliding together and fusing (growth cartilage closes). p 0..1 */
export const Fuse: React.FC<{ w: number; p: number; t: number }> = ({ w, p, t }) => {
  const gap = 90 * (1 - p);
  const flash = Math.max(0, 1 - Math.abs(p - 0.92) * 8);
  const h = (w * 360) / 760;
  return (
    <svg width={w} height={h} viewBox="0 0 760 360" style={{ overflow: "visible" }}>
      <g transform={`translate(${-gap / 2} 0)`}>
        <path d="M 40 130 C 20 100 40 60 80 70 C 110 40 150 60 150 95 L 360 110 L 360 250 L 150 265 C 150 300 110 320 80 290 C 40 300 20 260 40 230 C 20 210 20 150 40 130 Z" fill={BONE} stroke={C.forest} strokeWidth={7} strokeLinejoin="round" />
      </g>
      <g transform={`translate(${gap / 2} 0)`}>
        <path d="M 720 130 C 740 100 720 60 680 70 C 650 40 610 60 610 95 L 400 110 L 400 250 L 610 265 C 610 300 650 320 680 290 C 720 300 740 260 720 230 C 740 210 740 150 720 130 Z" fill={BONE} stroke={C.forest} strokeWidth={7} strokeLinejoin="round" />
      </g>
      {/* cartilage bridge, shrinks then disappears */}
      <rect x={360 - gap / 2} y={112} width={40 + gap} height={136} fill={SOFT} opacity={1 - p} stroke={C.forest} strokeWidth={4} />
      {p > 0.9 && <rect x={350} y={110} width={60} height={140} fill={BONE} />}
      {p > 0.9 && <line x1={380} y1={118} x2={380} y2={242} stroke={BONE_D} strokeWidth={5} strokeDasharray="10 10" />}
      {p > 0.9 && <path d="M 344 110.5 L 416 110.5 M 344 249.5 L 416 249.5" stroke={C.forest} strokeWidth={7} />}
      <circle cx={380} cy={180} r={40 + 160 * flash} fill="none" stroke={C.banana} strokeWidth={14 * flash} opacity={flash} />
      <g opacity={0.25 + 0.1 * Math.sin(t * 5)}>
        {p < 0.85 && <text x={380} y={330} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.forest}>cartilage</text>}
      </g>
    </svg>
  );
};
