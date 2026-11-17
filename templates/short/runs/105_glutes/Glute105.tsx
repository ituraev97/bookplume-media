import React from "react";
import { C, ramp } from "./kit";

/* Book Plume's own diagram: the 4 superficial gluteal muscles of the RIGHT hip seen from BEHIND (posterior view; medial = viewer's LEFT,
   lateral = viewer's RIGHT, as in Gray's Fig. 434). viewBox 700 x 900.
   (TeachMeAnatomy "The Muscles of the Gluteal Region"; StatPearls "Anatomy, Bony Pelvis and Lower Limb, Gluteus Maximus Muscle")
   MIN gluteus minimus: deepest + smallest, outer ilium → front of the greater trochanter — superior gluteal nerve
   MED gluteus medius: middle layer, outer ilium under the crest → lateral greater trochanter — superior gluteal nerve
   MAX gluteus maximus: outermost + biggest glute, sacrum/coccyx/back of ilium → iliotibial band + gluteal tuberosity — inferior gluteal nerve
   TFL tensor fasciae latae: front of the iliac crest (ASIS) → iliotibial band — superior gluteal nerve
   Nerves leave the greater sciatic foramen: superior gluteal ABOVE piriformis, inferior gluteal BELOW it. */
export type GK = "MAX" | "MED" | "MIN" | "TFL";
export const GNAME: Record<GK, string> = { MAX: "gluteus maximus", MED: "gluteus medius", MIN: "gluteus minimus", TFL: "tensor fasciae latae" };
export const GCOL: Record<GK, string> = { MAX: "#B83A26", MED: "#D9821C", MIN: "#2F6FC0", TFL: "#8A3FA0" };
const GHOT: Record<GK, string> = { MAX: "#E5523A", MED: "#F29A2E", MIN: "#4C8EE0", TFL: "#AE5BC6" };
const GBASE: Record<GK, string> = { MAX: "#DDB3A6", MED: "#EFD2AE", MIN: "#BFD0EA", TFL: "#DCC5E6" };
export const NCOL = { SUP: "#E0A800", INF: "#1E8A7A" };

const SKIN = "M 92 250 C 112 140 240 48 420 46 C 562 48 652 118 682 220 C 700 320 692 420 682 520 C 672 700 662 800 654 900 L 440 900 C 430 820 380 770 300 744 C 180 706 96 630 82 490 C 76 410 80 320 92 250 Z";
const PELVIS =
  "M 196 214 C 236 132 330 78 430 80 C 520 82 596 128 626 196 C 640 232 628 268 604 296 C 574 330 556 372 548 420 L 470 452 C 420 420 380 400 330 392 C 300 360 262 330 226 312 C 196 296 182 254 196 214 Z";
const SACRUM = "M 120 250 C 150 236 196 236 222 252 C 236 320 230 400 206 470 C 190 516 166 548 148 560 C 132 548 112 512 104 470 C 92 400 98 320 120 250 Z";
const FEMUR = "M 470 440 C 500 418 548 420 584 444 C 612 466 610 512 590 536 C 578 600 572 720 568 900 L 478 900 C 482 720 488 610 494 560 C 470 540 452 470 470 440 Z";
const ISCHIUM = "M 300 520 C 318 500 352 500 366 520 C 376 540 366 566 340 572 C 316 574 296 552 300 520 Z";
export const GD: Record<GK, string> = {
  MIN: "M 290 250 C 360 190 470 168 560 190 C 600 230 604 320 596 400 C 592 440 584 462 568 466 C 520 440 450 390 400 350 C 350 312 312 284 290 250 Z",
  MED: "M 214 236 C 260 150 360 104 450 104 C 540 106 606 156 620 220 C 626 300 612 380 598 440 C 590 462 570 470 552 462 C 480 420 400 370 330 320 C 280 290 240 266 214 236 Z",
  MAX: "M 196 196 C 232 190 270 204 300 224 C 400 290 520 370 618 436 L 624 640 C 604 700 562 732 518 722 C 420 694 300 644 200 594 C 158 572 128 540 120 498 C 108 420 138 300 196 196 Z",
  TFL: "M 612 186 C 644 196 664 246 666 312 C 668 372 660 420 652 462 L 618 462 C 618 400 612 330 604 270 C 600 236 602 204 612 186 Z",
};
const ITB = "M 618 456 L 654 456 C 656 600 650 760 646 900 L 612 900 C 616 760 618 600 618 456 Z";
const PIRI = "M 214 380 C 290 386 380 400 450 424 C 490 436 530 446 560 452 L 556 470 C 520 466 480 460 440 452 C 370 438 290 426 210 422 Z";
/* nerves exit the greater sciatic foramen at the medial end (x≈250) */
const SGN = "M 250 372 C 300 350 360 330 420 316 M 420 316 C 480 300 540 280 600 250 M 420 316 C 470 340 520 360 566 380 M 600 250 C 620 262 636 290 640 330";
const IGN = "M 250 440 C 280 470 300 500 300 540 M 270 456 C 330 470 390 490 440 520 M 300 470 C 250 500 200 520 160 520";
/* chip anchors (viewBox coords) */
export const GANCH: Record<string, [number, number]> = {
  MAX: [380, 520], MAXt: [300, 480], MED: [430, 150], MEDt: [520, 200], MIN: [470, 300], MINt: [520, 320], TFL: [640, 300], ITB: [632, 760],
  SGN: [470, 300], IGN: [330, 490], PIRI: [330, 404], TROCH: [580, 470], CREST: [420, 82], SAC: [160, 400], ISC: [334, 538],
};

const lv = (t: number, t0?: number) => (t0 === undefined ? 0 : ramp(t, t0 - 0.05, t0 + 0.3));

export const Glute: React.FC<{
  t: number; w: number; id: string; lit: Partial<Record<GK, number>>; hot?: GK[]; dimRest?: number;
  maxA?: number; medA?: number; nerves?: { sup?: number; inf?: number }; piri?: number; bones?: number; nums?: Partial<Record<GK, number>>;
}> = ({ t, w, id, lit, hot = [], dimRest = 0, maxA = 1, medA = 1, nerves = {}, piri = 0, bones = 0.35 }) => {
  const pulse = (Math.sin(t * 6) + 1) / 2;
  const h = (w * 900) / 700;
  const mus = (k: GK, extraOp = 1) => {
    if (extraOp <= 0.001) return null;
    const o = lv(t, lit[k]);
    const H = hot.includes(k);
    const dim = H || !hot.length ? 0 : dimRest;
    return (
      <g key={k} opacity={(1 - 0.6 * dim) * extraOp}>
        {H && <path d={GD[k]} fill="none" stroke={C.banana} strokeWidth={22 + 10 * pulse} strokeLinejoin="round" opacity={0.95} />}
        <path d={GD[k]} fill={GBASE[k]} stroke={C.forest} strokeWidth={6} strokeLinejoin="round" />
        {o > 0 && <path d={GD[k]} fill={H ? GHOT[k] : GCOL[k]} opacity={o} />}
        <path d={GD[k]} fill={`url(#${id}f${k})`} opacity={0.55} />
        <path d={GD[k]} fill={`url(#${id}sh)`} />
        <path d={GD[k]} fill="none" stroke={C.forest} strokeWidth={6} strokeLinejoin="round" />
      </g>
    );
  };
  const nerve = (d: string, col: string, p: number) =>
    p > 0 ? (
      <g opacity={Math.min(1, p * 2)}>
        <path d={d} fill="none" stroke="#111" strokeWidth={17} strokeLinecap="round" strokeDasharray="1400" strokeDashoffset={1400 * (1 - p)} />
        <path d={d} fill="none" stroke={col} strokeWidth={10} strokeLinecap="round" strokeDasharray="1400" strokeDashoffset={1400 * (1 - p)} />
        <circle cx={250} cy={col === NCOL.SUP ? 372 : 440} r={13} fill={col} stroke="#111" strokeWidth={5} />
      </g>
    ) : null;
  // fibre direction per muscle
  const FIB: Record<GK, number> = { MAX: 36, MED: -18, MIN: -30, TFL: 6 };
  return (
    <svg width={w} height={h} viewBox="0 0 700 900" style={{ display: "block", overflow: "visible" }}>
      <defs>
        {(Object.keys(FIB) as GK[]).map((k) => (
          <pattern key={k} id={`${id}f${k}`} width={13} height={13} patternUnits="userSpaceOnUse" patternTransform={`rotate(${FIB[k]})`}>
            <line x1={0} y1={0} x2={0} y2={13} stroke="rgba(31,42,20,0.33)" strokeWidth={2} />
          </pattern>
        ))}
        <radialGradient id={`${id}sh`} cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#fff" stopOpacity={0.22} />
          <stop offset="0.6" stopColor="#fff" stopOpacity={0} />
          <stop offset="1" stopColor="#000" stopOpacity={0.12} />
        </radialGradient>
        <linearGradient id={`${id}skin`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#E9D7C2" />
          <stop offset="0.5" stopColor="#F6EBDD" />
          <stop offset="1" stopColor="#E4CFB8" />
        </linearGradient>
        <pattern id={`${id}itb`} width={9} height={9} patternUnits="userSpaceOnUse">
          <line x1={0} y1={0} x2={0} y2={9} stroke="rgba(255,255,255,0.75)" strokeWidth={2.5} />
        </pattern>
      </defs>
      {/* skin silhouette + gluteal fold */}
      <path d={SKIN} fill={`url(#${id}skin)`} stroke={C.forest} strokeWidth={6} opacity={0.95} />
      <path d="M 300 744 C 360 760 410 770 440 800" fill="none" stroke={C.forest} strokeWidth={4} strokeDasharray="10 8" opacity={0.45} />
      {/* bones */}
      <g fill="#FFFDF3" stroke={C.forest} strokeWidth={5} opacity={0.35 + 0.65 * bones}>
        <path d={PELVIS} />
        <path d={SACRUM} />
        <path d={FEMUR} />
        <path d={ISCHIUM} />
        <path d="M 130 300 L 200 300 M 128 360 L 206 360 M 132 420 L 200 420" stroke={C.forest} strokeWidth={3} opacity={0.5} fill="none" />
      </g>
      {mus("MIN")}
      {mus("MED", medA)}
      {/* piriformis — the landmark between the two gluteal nerves */}
      <g opacity={0.25 + 0.75 * piri}>
        <path d={PIRI} fill="#C9B7A8" stroke={C.forest} strokeWidth={5} />
        <path d={PIRI} fill={`url(#${id}fMAX)`} opacity={0.5} />
      </g>
      {nerve(SGN, NCOL.SUP, nerves.sup ?? 0)}
      {nerve(IGN, NCOL.INF, nerves.inf ?? 0)}
      {mus("MAX", maxA)}
      {/* iliotibial band */}
      <path d={ITB} fill="#EFE3C4" stroke={C.forest} strokeWidth={5} />
      <path d={ITB} fill={`url(#${id}itb)`} opacity={0.7} />
      {mus("TFL")}
      {/* nerves re-drawn faintly on top when the maximus covers them (deep course shown dashed) */}
      {maxA > 0.5 && (nerves.inf ?? 0) > 0 && (
        <path d={IGN} fill="none" stroke={NCOL.INF} strokeWidth={7} strokeDasharray="14 10" strokeLinecap="round" opacity={Math.min(1, (nerves.inf ?? 0) * 2)} />
      )}
      {maxA > 0.5 && (nerves.sup ?? 0) > 0 && (
        <path d={SGN} fill="none" stroke={NCOL.SUP} strokeWidth={7} strokeDasharray="14 10" strokeLinecap="round" opacity={Math.min(1, (nerves.sup ?? 0) * 2)} />
      )}
    </svg>
  );
};
