import React from "react";
import { C, FONT, ramp } from "./kit";

/* Book Plume's own diagram: the PELVIC FLOOR seen FROM ABOVE (superior view into the pelvic bowl).
   Front (pubic symphysis) at the TOP, back (sacrum + coccyx) at the BOTTOM. viewBox 800 x 900.
   PR puborectalis  – back of the pubis → U-shaped sling behind the anorectal junction (innermost part)
   PC pubococcygeus – back of the pubis → coccyx / anococcygeal body (the bulk of levator ani)
   IC iliococcygeus – tendinous arch of the obturator fascia + ischial spine (side wall) → coccyx / anococcygeal raphe
   CO coccygeus     – ischial spine → side of the coccyx + lowest sacrum (behind levator ani)
   TA tendinous arch (side wall line) */
export type FK = "PR" | "PC" | "IC" | "CO" | "TA";
export const FNAME: Record<FK, string> = { PR: "puborectalis", PC: "pubococcygeus", IC: "iliococcygeus", CO: "coccygeus", TA: "tendinous arch" };
export const FCOL: Record<FK, string> = { PR: "#D2482A", PC: "#1E8C7E", IC: "#7A4FB5", CO: "#2F6FB5", TA: "#B58A00" };
const FHOT: Record<FK, string> = { PR: "#F05A36", PC: "#26B3A0", IC: "#9A6AE0", CO: "#4A8FE0", TA: "#FFD21F" };

export const FANCH: Record<string, [number, number]> = {
  PR: [326, 430], PRR: [474, 430], PRB: [400, 642], PC: [284, 470], PCR: [516, 470], IC: [232, 420], ICR: [568, 420],
  CO: [300, 722], COR: [500, 722], PUB: [400, 112], COC: [400, 812], SP: [190, 575], SPR: [610, 575], REC: [400, 545],
  URE: [400, 300], TA: [206, 360], RAP: [400, 730],
};

const D = {
  IC: "M 330 150 C 262 186 214 290 202 400 C 196 470 192 530 190 575 L 392 790 C 352 748 304 690 280 600 C 256 520 250 420 262 330 C 272 260 300 196 340 156 Z",
  PC: "M 352 140 C 300 196 272 260 262 330 C 250 420 256 520 280 600 C 304 690 352 748 392 790 L 400 790 L 400 674 C 356 672 316 632 306 560 C 296 470 302 330 316 230 C 324 186 342 158 364 138 Z",
  PR: "M 376 136 C 344 220 322 360 324 470 C 326 580 362 640 400 642 C 438 640 474 580 476 470 C 478 360 456 220 424 136",
  CO: "M 190 575 C 250 652 330 742 392 800 L 388 856 C 300 792 222 702 190 575 Z",
  TA: "M 345 140 C 270 170 215 280 202 400 C 196 470 192 530 190 575",
  RING: "M 400 106 C 562 100 700 212 716 384 C 730 528 690 670 598 768 C 560 806 516 832 478 846 L 322 846 C 284 832 240 806 202 768 C 110 670 70 528 84 384 C 100 212 238 100 400 106 Z",
};
const MIR = "translate(800 0) scale(-1 1)";
const lv = (t: number, t0?: number) => (t0 === undefined ? 0 : ramp(t, t0 - 0.05, t0 + 0.3));

export const Floor: React.FC<{
  t: number; w: number; id: string; lit: Partial<Record<FK, number>>; hot?: FK[]; dimRest?: number; arch?: number; openings?: number;
}> = ({ t, w, id, lit, hot = [], dimRest = 0, arch = 0, openings = 1 }) => {
  const pulse = (Math.sin(t * 6) + 1) / 2;
  const h = (w * 900) / 800;
  const op = (k: FK) => (hot.includes(k) || !hot.length ? 1 : 1 - 0.6 * dimRest);
  const Muscle: React.FC<{ k: FK; d: string }> = ({ k, d }) => {
    const o = lv(t, lit[k]);
    const H = hot.includes(k);
    const col = H ? FHOT[k] : FCOL[k];
    const one = (tr?: string) => (
      <g transform={tr}>
        {H && <path d={d} fill="none" stroke={C.banana} strokeWidth={22 + 10 * pulse} strokeLinejoin="round" opacity={0.95} />}
        <path d={d} fill="#D9BCA6" stroke={C.forest} strokeWidth={4.5} strokeLinejoin="round" />
        {o > 0 && <path d={d} fill={col} opacity={o} />}
        <path d={d} fill={`url(#${id}fib${k})`} opacity={0.55} />
        <path d={d} fill="none" stroke={C.forest} strokeWidth={4.5} strokeLinejoin="round" />
      </g>
    );
    return <g opacity={op(k)}>{one()}{one(MIR)}</g>;
  };
  const prO = lv(t, lit.PR);
  const prH = hot.includes("PR");
  return (
    <svg width={w} height={h} viewBox="0 0 800 900" style={{ display: "block", overflow: "visible" }}>
      <defs>
        {(["IC", "PC", "CO", "PR"] as FK[]).map((k, i) => (
          <pattern key={k} id={`${id}fib${k}`} width={13} height={13} patternUnits="userSpaceOnUse" patternTransform={`rotate(${[62, 78, 40, 90][i]})`}>
            <line x1={0} y1={0} x2={0} y2={13} stroke="rgba(255,255,255,0.38)" strokeWidth={2.4} />
          </pattern>
        ))}
        <radialGradient id={`${id}cav`} cx="0.5" cy="0.55" r="0.6">
          <stop offset="0" stopColor="#E3CDB6" />
          <stop offset="1" stopColor="#CDB096" />
        </radialGradient>
      </defs>
      {/* the pelvic bowl: bony rim (hip bones) */}
      <path d={D.RING} fill={`url(#${id}cav)`} stroke="#F3EEDD" strokeWidth={44} strokeLinejoin="round" />
      <path d={D.RING} fill="none" stroke="rgba(31,42,20,0.55)" strokeWidth={3} transform="translate(0 0)" />
      {/* obturator internus side walls (faint) */}
      {[undefined, MIR].map((tr, i) => (
        <path key={i} transform={tr} d="M 150 250 C 112 350 104 470 118 560 L 190 575 C 194 470 210 330 252 238 C 218 222 178 228 150 250 Z" fill="rgba(170,120,100,0.28)" stroke="rgba(31,42,20,0.25)" strokeWidth={3} />
      ))}
      <Muscle k="IC" d={D.IC} />
      <Muscle k="PC" d={D.PC} />
      <Muscle k="CO" d={D.CO} />
      {/* anococcygeal raphe */}
      <path d="M 400 664 L 400 790" stroke="rgba(244,239,226,0.95)" strokeWidth={10} strokeLinecap="round" />
      {/* openings: urethra in the gap at the front, rectum inside the sling */}
      <g opacity={openings}>
        <circle cx={400} cy={300} r={20} fill="#F1E3D3" stroke={C.forest} strokeWidth={4} />
        <circle cx={400} cy={300} r={7} fill="rgba(31,42,20,0.45)" />
        <circle cx={400} cy={545} r={46} fill="#C98F86" stroke={C.forest} strokeWidth={4.5} />
        <circle cx={400} cy={545} r={19} fill="#9E6A63" />
      </g>
      {/* puborectalis sling */}
      <g opacity={op("PR")}>
        {prH && <path d={D.PR} fill="none" stroke={C.banana} strokeWidth={62 + 10 * pulse} strokeLinecap="round" />}
        <path d={D.PR} fill="none" stroke={C.forest} strokeWidth={46} strokeLinecap="round" />
        <path d={D.PR} fill="none" stroke="#D9BCA6" strokeWidth={36} strokeLinecap="round" />
        {prO > 0 && <path d={D.PR} fill="none" stroke={prH ? FHOT.PR : FCOL.PR} strokeWidth={36} strokeLinecap="round" opacity={prO} />}
        <path d={D.PR} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={4} strokeDasharray="3 9" />
      </g>
      {/* tendinous arch = the side-wall origin line of iliococcygeus */}
      {arch > 0 && [undefined, MIR].map((tr, i) => (
        <g key={i} transform={tr}>
          <path d={D.TA} fill="none" stroke={C.forest} strokeWidth={16} strokeLinecap="round" strokeDasharray={`${700 * arch} 700`} />
          <path d={D.TA} fill="none" stroke={hot.includes("TA") ? FHOT.TA : FCOL.TA} strokeWidth={9} strokeLinecap="round" strokeDasharray={`${700 * arch} 700`} />
        </g>
      ))}
      {/* pubic symphysis (front) */}
      <rect x={364} y={86} width={72} height={44} rx={16} fill="#F3EEDD" stroke="rgba(31,42,20,0.6)" strokeWidth={4} />
      <rect x={394} y={88} width={12} height={40} rx={5} fill="#BFD8E0" />
      {/* ischial spines */}
      {[undefined, MIR].map((tr, i) => (
        <path key={i} transform={tr} d="M 96 540 C 130 556 170 566 196 576 C 168 588 128 600 98 604 Z" fill="#F3EEDD" stroke="rgba(31,42,20,0.6)" strokeWidth={4} strokeLinejoin="round" />
      ))}
      {/* sacrum + coccyx (back) */}
      <path d="M 318 846 C 360 836 440 836 482 846 L 492 900 L 308 900 Z" fill="#F3EEDD" stroke="rgba(31,42,20,0.6)" strokeWidth={4} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={384 + i * 2} y={828 - i * 22} width={32 - i * 4} height={20} rx={8} fill="#F3EEDD" stroke="rgba(31,42,20,0.6)" strokeWidth={3.5} />
      ))}
      <g fontFamily={FONT} fontWeight={800} fontSize={24} fill="rgba(31,42,20,0.6)" textAnchor="middle">
        <text x={400} y={70}>FRONT · pubis</text>
        <text x={400} y={890} fill="rgba(31,42,20,0.75)">BACK · coccyx</text>
      </g>
    </svg>
  );
};
