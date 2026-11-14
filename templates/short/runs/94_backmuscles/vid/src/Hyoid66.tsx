import React from "react";
import { C, FONT } from "./kit";

/** Book Plume's own diagrams for the hyoid short. */
export const BONE_D = "#D9CCA6";
export const SKIN = "#EBC2A8";
export const SKIN_D = "#C98F72";
export const CART = "#CFE0D8";
export const CART_D = "#7FA596";
export const MUS = "#C9776A";

const glow = (on: number, col = C.banana) => (on > 0 ? `drop-shadow(0 0 ${12 * on}px ${col}) drop-shadow(0 0 ${4 * on}px ${col})` : "none");

const BoneDefs: React.FC<{ id: string }> = ({ id }) => (
  <defs>
    <linearGradient id={`bone-${id}`} x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stopColor="#FBF6E6" />
      <stop offset="55%" stopColor="#EFE4C4" />
      <stop offset="100%" stopColor="#D8C89E" />
    </linearGradient>
    <pattern id={`hatch-${id}`} width={8} height={8} patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
      <line x1={0} y1={0} x2={0} y2={8} stroke={C.forest} strokeWidth={1.3} opacity={0.17} />
    </pattern>
    <pattern id={`mus-${id}`} width={10} height={10} patternUnits="userSpaceOnUse" patternTransform="rotate(80)">
      <line x1={0} y1={0} x2={0} y2={10} stroke={C.redDark} strokeWidth={1.6} opacity={0.35} />
    </pattern>
    <radialGradient id={`skin-${id}`} cx="40%" cy="40%" r="75%">
      <stop offset="0%" stopColor="#F6DCCB" />
      <stop offset="100%" stopColor={SKIN} />
    </radialGradient>
  </defs>
);

/* ---------- 1. Hyoid seen from the front and above: a U. viewBox 800 x 520 ---------- */
const BODY = "M 214 318 C 300 292 500 292 586 318 C 604 352 600 398 584 428 C 500 462 300 462 216 428 C 200 398 196 352 214 318 Z";
const GH_L = "M 226 330 C 190 280 150 210 118 140 C 104 110 88 92 96 74 C 106 54 140 58 150 80 C 160 104 158 124 172 160 C 196 222 236 270 262 312 Z";
const GH_R = "M 574 330 C 610 280 650 210 682 140 C 696 110 712 92 704 74 C 694 54 660 58 650 80 C 640 104 642 124 628 160 C 604 222 564 270 538 312 Z";
const LH_L = "M 236 318 C 228 286 222 258 228 238 C 236 226 252 232 256 246 C 262 268 266 292 270 312 Z";
const LH_R = "M 564 318 C 572 286 578 258 572 238 C 564 226 548 232 544 246 C 538 268 534 292 530 312 Z";
export const U_PATH = "M 122 86 C 170 210 210 330 290 392 C 360 430 440 430 510 392 C 590 330 630 210 678 86";

export const HyoidU: React.FC<{
  w: number; id: string;
  body?: number; greater?: number; lesser?: number; u?: number; dim?: number;
}> = ({ w, id, body = 0, greater = 0, lesser = 0, u = 0, dim = 0 }) => {
  const h = (w * 520) / 800;
  const part = (d: string, on: number) => (
    <g style={{ filter: glow(on) }}>
      <path d={d} fill={`url(#bone-${id})`} stroke={C.forest} strokeWidth={6} strokeLinejoin="round" />
      <path d={d} fill={`url(#hatch-${id})`} />
      <path d={d} fill={C.banana} opacity={0.8 * on} stroke={C.red} strokeWidth={7 * on} strokeLinejoin="round" />
    </g>
  );
  return (
    <svg width={w} height={h} viewBox="0 0 800 520" style={{ overflow: "visible", opacity: 1 - 0.55 * dim }}>
      <BoneDefs id={id} />
      <ellipse cx={400} cy={470} rx={300} ry={26} fill={C.forest} opacity={0.08} />
      {part(GH_L, greater)}
      {part(GH_R, greater)}
      {part(BODY, body)}
      {part(LH_L, lesser)}
      {part(LH_R, lesser)}
      {/* small surface details */}
      <path d="M 250 352 C 330 336 470 336 550 352" fill="none" stroke={C.forest} strokeWidth={3} opacity={0.35} />
      <path d="M 400 330 L 400 440" fill="none" stroke={C.forest} strokeWidth={2.5} opacity={0.25} strokeDasharray="6 6" />
      {u > 0 && (
        <path d={U_PATH} fill="none" stroke={C.red} strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray={`${u} 1`} opacity={0.9} />
      )}
    </svg>
  );
};

/* ---------- 2. Head and neck from the side (face to the LEFT). viewBox 800 x 900 ---------- */
// key points (viewBox units), exported so scenes can place labels
export const NP = {
  hyoid: [300, 447] as [number, number],
  c3: [508, 445] as [number, number],
  jaw: [250, 352] as [number, number],
  larynx: [292, 545] as [number, number],
  styloid: [452, 262] as [number, number],
  tongue: [250, 300] as [number, number],
};
const VERT = [
  { n: "C1", y: 255, h: 42 },
  { n: "C2", y: 305, h: 58 },
  { n: "C3", y: 372, h: 56 },
  { n: "C4", y: 438, h: 56 },
  { n: "C5", y: 504, h: 56 },
  { n: "C6", y: 570, h: 56 },
  { n: "C7", y: 636, h: 58 },
];
const HYOID_SIDE = "M 268 396 C 266 384 280 378 296 380 L 352 372 C 372 366 392 364 402 370 C 410 378 404 388 392 390 L 352 398 C 336 408 316 418 296 420 C 278 420 270 410 268 396 Z";
const THYROID = "M 286 446 L 268 470 C 264 482 268 492 276 500 L 300 556 L 352 556 C 362 520 370 486 372 452 C 340 448 310 446 286 446 Z";
const CRICOID = "M 300 566 L 352 566 C 358 584 356 600 350 612 L 304 612 C 298 600 296 584 300 566 Z";
const MANDIBLE = "M 150 330 C 146 352 156 372 180 376 C 240 382 330 380 404 364 C 430 356 446 336 448 300 C 450 250 452 210 460 184 C 466 172 480 170 484 182 C 480 214 474 250 470 300 C 468 350 450 384 404 398 C 330 412 240 414 186 408 C 150 402 134 372 138 338 Z";

export const NeckSide: React.FC<{
  w: number; id: string; t: number;
  hyoid?: number; c3?: number; jaw?: number; larynx?: number; sling?: number; lig?: number; ring?: number; tongue?: number;
}> = ({ w, id, t, hyoid = 0, c3 = 0, jaw = 0, larynx = 0, sling = 0, lig = 0, ring = 0, tongue = 0 }) => {
  const h = (w * 900) / 800;
  const pulse = 0.5 + 0.5 * Math.sin(t * 6);
  return (
    <svg width={w} height={h} viewBox="0 0 800 900" style={{ overflow: "visible" }}>
      <BoneDefs id={id} />
      {/* skin silhouette */}
      <path
        d="M 210 -20 C 190 40 170 90 150 130 C 120 160 96 176 100 196 C 104 214 126 220 132 236 C 120 252 124 268 140 276 C 132 290 136 304 150 312 C 140 336 140 360 160 380 C 196 404 226 414 238 440 C 242 560 248 720 254 920 L 640 920 C 620 760 600 640 600 540 C 630 470 690 400 700 300 C 712 180 680 60 640 -20 Z"
        fill={`url(#skin-${id})`} stroke={SKIN_D} strokeWidth={5} opacity={0.6}
      />
      {/* skull base hint */}
      <path d="M 300 -20 C 300 60 340 140 420 190 C 470 220 560 230 640 210" fill="none" stroke={C.forest} strokeWidth={4} opacity={0.22} strokeDasharray="10 9" />
      {/* tongue */}
      <path d="M 160 300 C 190 268 260 250 330 262 C 380 272 400 310 392 350 C 384 372 360 380 330 382 C 280 380 230 352 200 330 C 180 318 166 312 160 300 Z"
        fill="#E59A8C" stroke={C.redDark} strokeWidth={4} opacity={0.55 + 0.45 * tongue} style={{ filter: glow(tongue, C.redLight) }} />
      <text x={290} y={312} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.redDark} opacity={0.75}>tongue</text>
      <g transform="translate(0 45)">
      {/* cervical vertebrae */}
      {VERT.map((v) => {
        const on = v.n === "C3" ? c3 : 0;
        return (
          <g key={v.n} style={{ filter: glow(on) }}>
            <rect x={468} y={v.y} width={84} height={v.h} rx={12} fill={`url(#bone-${id})`} stroke={C.forest} strokeWidth={5} />
            <rect x={468} y={v.y} width={84} height={v.h} rx={12} fill={`url(#hatch-${id})`} />
            <path d={`M 552 ${v.y + v.h * 0.35} L 610 ${v.y + v.h * 0.5 + 8} L 604 ${v.y + v.h * 0.85} L 552 ${v.y + v.h * 0.75} Z`} fill={`url(#bone-${id})`} stroke={C.forest} strokeWidth={4} />
            <rect x={468} y={v.y} width={84} height={v.h} rx={12} fill={C.banana} opacity={0.85 * on} stroke={C.red} strokeWidth={6 * on} />
            <text x={510} y={v.y + v.h / 2 + 9} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={C.forest} opacity={0.55 + 0.45 * on}>{v.n}</text>
          </g>
        );
      })}
      {/* C3 level line */}
      {c3 > 0 && <line x1={260 + (1 - c3) * 200} y1={400} x2={466} y2={400} stroke={C.red} strokeWidth={5} strokeDasharray="12 10" opacity={c3} />}
      </g>
      {/* styloid process + stylohyoid ligament */}
      <path d="M 470 214 L 448 270 L 456 272 L 482 220 Z" fill={`url(#bone-${id})`} stroke={C.forest} strokeWidth={4} />
      <path d="M 452 268 C 420 330 384 390 352 425" fill="none" stroke={C.forest} strokeWidth={5} strokeDasharray="10 7" opacity={0.3 + 0.7 * lig} style={{ filter: glow(lig) }} />
      {/* mandible */}
      <g style={{ filter: glow(jaw) }}>
        <path d={MANDIBLE} fill={`url(#bone-${id})`} stroke={C.forest} strokeWidth={5} strokeLinejoin="round" />
        <path d={MANDIBLE} fill={`url(#hatch-${id})`} />
        <path d={MANDIBLE} fill={C.banana} opacity={0.8 * jaw} />
        {[176, 204, 232, 262, 292].map((x) => <rect key={x} x={x} y={336} width={22} height={30} rx={6} fill="#FFFDF4" stroke={C.forest} strokeWidth={3} opacity={0.8} />)}
      </g>
      {/* muscle sling: suprahyoid above, infrahyoid below */}
      <g opacity={sling}>
        <path d="M 190 384 C 230 400 262 430 286 447 L 284 457 C 258 440 226 412 190 396 Z" fill={MUS} stroke={C.redDark} strokeWidth={3} />
        <path d="M 330 431 C 380 370 440 310 520 268 L 528 278 C 450 324 392 382 340 443 Z" fill={MUS} stroke={C.redDark} strokeWidth={3} />
        <path d="M 278 463 C 276 600 282 740 290 900 L 318 900 C 312 740 306 600 304 465 Z" fill={MUS} stroke={C.redDark} strokeWidth={3} />
        <path d="M 360 445 C 380 515 380 565 372 605" fill="none" stroke={MUS} strokeWidth={14} strokeLinecap="round" />
        <path d="M 190 384 C 230 400 262 430 286 447 L 284 457 C 258 440 226 412 190 396 Z M 330 431 C 380 370 440 310 520 268 L 528 278 C 450 324 392 382 340 443 Z M 278 463 C 276 600 282 740 290 900 L 318 900 C 312 740 306 600 304 465 Z" fill={`url(#mus-${id})`} />
      </g>
      <g transform="translate(0 45)">
      {/* larynx: thyroid + cricoid cartilage, trachea rings */}
      <g style={{ filter: glow(larynx, "#9FD4BF") }}>
        <path d={THYROID} fill={CART} stroke={C.forest} strokeWidth={5} strokeLinejoin="round" />
        <path d={CRICOID} fill={CART} stroke={C.forest} strokeWidth={5} />
        {[630, 664, 698, 732, 766, 800, 834, 868].map((y) => <rect key={y} x={302} y={y} width={50} height={22} rx={9} fill={CART} stroke={C.forest} strokeWidth={4} />)}
        <path d={THYROID} fill={C.banana} opacity={0.75 * larynx} />
        {/* thyrohyoid membrane */}
        <path d="M 288 420 L 300 446 L 366 450 L 390 392" fill="none" stroke={CART_D} strokeWidth={4} strokeDasharray="5 5" />
      </g>
      {/* hyoid */}
      <g style={{ filter: glow(hyoid) }}>
        <path d={HYOID_SIDE} fill={`url(#bone-${id})`} stroke={C.forest} strokeWidth={5} strokeLinejoin="round" />
        <path d={HYOID_SIDE} fill={C.banana} opacity={0.9 * hyoid} stroke={C.red} strokeWidth={6 * hyoid} />
      </g>
      {/* 'touches no other bone' ring */}
      {ring > 0 && (
        <g opacity={ring}>
          <circle cx={336} cy={396} r={70 + 6 * pulse} fill="none" stroke={C.red} strokeWidth={6} strokeDasharray="14 10" />
        </g>
      )}
      </g>
    </svg>
  );
};
