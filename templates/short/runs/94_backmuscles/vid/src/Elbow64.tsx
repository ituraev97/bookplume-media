import React from "react";
import { C, FONT, ramp } from "./kit";

/** Book Plume's own diagrams for the funny-bone short (ulnar nerve at the elbow). */
export const BONE = "#EFE6CC";
export const BONE_D = "#D9CCA6";
export const NERVE = "#F2D14E";
export const SKIN = "#EBC2A8";
export const SKIN_D = "#C98F72";
export const FAT = "#F7EDCB";
export const MUSCLE = "#C9776A";

const glow = (on: number, col = C.banana) => (on > 0 ? `drop-shadow(0 0 ${10 * on}px ${col}) drop-shadow(0 0 ${4 * on}px ${col})` : "none");

/** Right elbow seen from behind: medial side on the LEFT. viewBox 800 x 900. */
export const ElbowDiagram: React.FC<{
  t: number; w: number; id: string;
  epi?: number; // highlight medial epicondyle 0..1
  nerve?: number; // highlight nerve 0..1
  skin?: number; // highlight skin outline 0..1
  draw?: number; // nerve drawn 0..1 (top to bottom)
  zap?: number; // travelling pulse position 0..1 along the nerve, <0 = off
}> = ({ t, w, id, epi = 0, nerve = 0, skin = 0, draw = 1, zap = -1 }) => {
  const h = (w * 900) / 800;
  // nerve path: down the medial arm, behind the medial epicondyle, into the forearm along the ulna
  const NP = "M 205 -10 C 215 120 228 250 240 360 C 248 420 262 452 268 482 C 274 520 268 560 262 610 C 254 690 252 790 262 910";
  const pulse = Math.sin(t * 6) * 0.5 + 0.5;
  return (
    <svg width={w} height={h} viewBox="0 0 800 900" style={{ overflow: "visible" }}>
      <defs>
        <pattern id={`hatch-${id}`} width={9} height={9} patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1={0} y1={0} x2={0} y2={9} stroke={C.forest} strokeWidth={1.4} opacity={0.18} />
        </pattern>
        <pattern id={`hatch2-${id}`} width={7} height={7} patternUnits="userSpaceOnUse" patternTransform="rotate(-50)">
          <line x1={0} y1={0} x2={0} y2={7} stroke={C.forest} strokeWidth={1.2} opacity={0.14} />
        </pattern>
        <radialGradient id={`skin-${id}`} cx="50%" cy="45%" r="65%">
          <stop offset="0%" stopColor="#F4D6C3" />
          <stop offset="100%" stopColor={SKIN} />
        </radialGradient>
        <linearGradient id={`bone-${id}`} x1="0" x2="1">
          <stop offset="0%" stopColor="#E6DAB8" />
          <stop offset="45%" stopColor="#FAF4E2" />
          <stop offset="100%" stopColor="#DCCDA5" />
        </linearGradient>
      </defs>
      {/* arm silhouette (skin) */}
      <path d="M 150 -20 C 140 150 120 330 112 440 C 104 520 140 590 170 650 C 190 720 200 820 205 930 L 560 930 C 565 820 585 700 600 640 C 640 560 680 470 662 400 C 650 300 640 140 630 -20 Z"
        fill={`url(#skin-${id})`} stroke={SKIN_D} strokeWidth={5} opacity={0.55} />
      <path d="M 150 -20 C 140 150 120 330 112 440 C 104 520 140 590 170 650 C 190 720 200 820 205 930 M 560 930 C 565 820 585 700 600 640 C 640 560 680 470 662 400 C 650 300 640 140 630 -20"
        fill="none" stroke={C.red} strokeWidth={6 + 4 * skin} opacity={skin} strokeLinecap="round" style={{ filter: glow(skin, C.redLight) }} />
      {/* humerus shaft + distal end */}
      <path d="M 320 -20 L 318 250 C 316 320 300 370 262 410 C 228 440 196 452 186 478 C 178 500 200 522 236 522 C 262 522 284 510 300 498 L 330 498 L 500 498 C 520 508 548 516 572 506 C 600 494 606 466 590 444 C 566 412 540 380 520 330 C 506 290 500 250 500 200 L 498 -20 Z"
        fill={`url(#bone-${id})`} stroke={C.forest} strokeWidth={5} strokeLinejoin="round" />
      <path d="M 320 -20 L 318 250 C 316 320 300 370 262 410 C 228 440 196 452 186 478 C 178 500 200 522 236 522 C 262 522 284 510 300 498 L 500 498 C 520 508 548 516 572 506 C 600 494 606 466 590 444 C 566 412 540 380 520 330 C 506 290 500 250 500 200 L 498 -20 Z" fill={`url(#hatch-${id})`} />
      {/* olecranon fossa */}
      <path d="M 352 330 C 360 300 440 300 450 330 C 462 380 450 440 400 448 C 350 440 340 380 352 330 Z" fill={BONE_D} stroke={C.forest} strokeWidth={3} opacity={0.8} />
      {/* medial epicondyle highlight */}
      <path d="M 262 410 C 228 440 196 452 186 478 C 178 500 200 522 236 522 C 262 522 284 510 300 498 C 300 460 290 430 262 410 Z"
        fill={C.banana} opacity={0.75 * epi} stroke={C.red} strokeWidth={6 * epi} style={{ filter: glow(epi) }} />
      {/* ulna with olecranon (centre) */}
      <path d="M 330 470 C 330 410 360 372 400 372 C 446 372 470 410 470 470 C 470 520 452 560 440 600 C 426 680 420 780 420 930 L 340 930 C 336 800 334 690 330 610 C 326 560 330 520 330 470 Z"
        fill={`url(#bone-${id})`} stroke={C.forest} strokeWidth={5} strokeLinejoin="round" />
      <path d="M 330 470 C 330 410 360 372 400 372 C 446 372 470 410 470 470 C 470 520 452 560 440 600 C 426 680 420 780 420 930 L 340 930 C 336 800 334 690 330 610 C 326 560 330 520 330 470 Z" fill={`url(#hatch2-${id})`} />
      {/* radius (lateral, right) */}
      <path d="M 500 520 C 520 512 556 514 566 530 C 572 560 552 580 548 610 C 540 700 540 800 546 930 L 486 930 C 486 800 488 700 494 610 C 494 575 484 540 500 520 Z"
        fill={`url(#bone-${id})`} stroke={C.forest} strokeWidth={5} strokeLinejoin="round" />
      {/* nerve: dark casing + yellow core + fascicle line */}
      <g style={{ filter: glow(nerve) }}>
        <path d={NP} fill="none" stroke={C.forest} strokeWidth={30} strokeLinecap="round" pathLength={1} strokeDasharray={`${draw} 1`} />
        <path d={NP} fill="none" stroke={NERVE} strokeWidth={21} strokeLinecap="round" pathLength={1} strokeDasharray={`${draw} 1`} />
        <path d={NP} fill="none" stroke="#FFF6C8" strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={`${draw} 1`} opacity={0.9} transform="translate(-4 0)" />
      </g>
      {zap >= 0 && (
        <path d={NP} fill="none" stroke="#FFFFFF" strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={`0.07 1`} strokeDashoffset={-zap}
          style={{ filter: `drop-shadow(0 0 12px ${C.banana}) drop-shadow(0 0 4px #FFFFFF)` }} opacity={0.6 + 0.4 * pulse} />
      )}
      {/* small text tags inside the drawing */}
      <text x={400} y={420} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.forest} opacity={0.65}>olecranon</text>
      <text x={410} y={130} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={C.forest} opacity={0.55} transform="rotate(-90 410 130)">humerus</text>
      <text x={380} y={800} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.forest} opacity={0.55} transform="rotate(-90 380 800)">ulna</text>
      <text x={517} y={800} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={22} fill={C.forest} opacity={0.55} transform="rotate(-90 517 800)">radius</text>
    </svg>
  );
};

/** Cross-section through the back of the medial epicondyle: skin, fat, nerve, bone. viewBox 600 x 600 (circle). */
export const CrossSection: React.FC<{
  t: number; w: number; id: string;
  skin?: number; fat?: number; nerve?: number; bone?: number;
  squash?: number; // 0..1 how much the bump presses the nerve flat
  hit?: number; // object coming down 0..1
}> = ({ t, w, id, skin = 0, fat = 0, nerve = 0, bone = 0, squash = 0, hit = 0 }) => {
  const press = 38 * squash;
  const ny = 300 + press * 0.55, rx = 74 + 24 * squash, ry = 62 - 26 * squash;
  const fasc = [[-28, -16], [6, -24], [32, -4], [-10, 14], [22, 22], [-36, 12]];
  const zz = Math.max(0, squash - 0.3);
  return (
    <svg width={w} height={w} viewBox="0 0 600 600" style={{ overflow: "visible" }}>
      <defs>
        <clipPath id={`cc-${id}`}><circle cx={300} cy={300} r={292} /></clipPath>
        <pattern id={`fatdots-${id}`} width={34} height={30} patternUnits="userSpaceOnUse">
          <circle cx={9} cy={9} r={8} fill="none" stroke="#E2CF8F" strokeWidth={2} />
          <circle cx={26} cy={23} r={7} fill="none" stroke="#E2CF8F" strokeWidth={2} />
        </pattern>
        <pattern id={`bh-${id}`} width={10} height={10} patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
          <line x1={0} y1={0} x2={0} y2={10} stroke={C.forest} strokeWidth={1.5} opacity={0.2} />
        </pattern>
      </defs>
      <g clipPath={`url(#cc-${id})`}>
        <rect width={600} height={600} fill={C.paper} />
        {/* bone at the bottom: medial epicondyle */}
        <path d="M -20 420 C 120 360 220 352 300 372 C 380 352 480 360 620 420 L 620 620 L -20 620 Z" fill={BONE} stroke={C.forest} strokeWidth={6} />
        <path d="M -20 420 C 120 360 220 352 300 372 C 380 352 480 360 620 420 L 620 620 L -20 620 Z" fill={`url(#bh-${id})`} />
        <path d="M 230 372 C 260 352 340 352 370 372" fill="none" stroke={C.forest} strokeWidth={4} opacity={0.5} />
        {/* fat layer */}
        <path d={`M -20 ${150 + press} C 150 ${130 + press} 450 ${130 + press} 620 ${150 + press} L 620 420 C 480 360 380 352 300 372 C 220 352 120 360 -20 420 Z`} fill={FAT} />
        <path d={`M -20 ${150 + press} C 150 ${130 + press} 450 ${130 + press} 620 ${150 + press} L 620 420 C 480 360 380 352 300 372 C 220 352 120 360 -20 420 Z`} fill={`url(#fatdots-${id})`} />
        {/* skin */}
        <path d={`M -20 ${90 + press} C 150 ${70 + press * 1.2} 450 ${70 + press * 1.2} 620 ${90 + press} L 620 ${150 + press} C 450 ${130 + press} 150 ${130 + press} -20 ${150 + press} Z`} fill={SKIN} stroke={SKIN_D} strokeWidth={4} />
        {/* nerve */}
        <g style={{ filter: glow(nerve) }}>
          <ellipse cx={300} cy={ny} rx={rx} ry={ry} fill={NERVE} stroke={C.forest} strokeWidth={6} />
          {fasc.map(([dx, dy], i) => (
            <ellipse key={i} cx={300 + dx * (rx / 74)} cy={ny + dy * (ry / 62)} rx={13 * (rx / 74)} ry={11 * (ry / 62)} fill="#FBE79A" stroke={C.forest} strokeWidth={2.5} opacity={0.95} />
          ))}
        </g>
        {/* layer highlights */}
        <path d={`M -20 ${90 + press} C 150 ${70 + press * 1.2} 450 ${70 + press * 1.2} 620 ${90 + press}`} fill="none" stroke={C.red} strokeWidth={10} opacity={skin} style={{ filter: glow(skin, C.redLight) }} />
        <path d={`M -20 ${150 + press} C 150 ${130 + press} 450 ${130 + press} 620 ${150 + press}`} fill="none" stroke={C.bananaDark} strokeWidth={8} opacity={fat} strokeDasharray="18 12" />
        <path d="M -20 420 C 120 360 220 352 300 372 C 380 352 480 360 620 420" fill="none" stroke={C.matcha} strokeWidth={10} opacity={bone} />
        {/* the bump: a table edge pressing down */}
        {hit > 0 && (
          <g transform={`translate(0 ${-230 + 230 * hit + press * 0.9})`}>
            <rect x={120} y={-200} width={360} height={260} rx={26} fill="#8C6A47" stroke={C.forest} strokeWidth={6} />
            <rect x={120} y={-200} width={360} height={260} rx={26} fill="none" stroke="#A9855E" strokeWidth={3} strokeDasharray="60 14" />
          </g>
        )}
        {/* zap sparks */}
        {zz > 0 && [0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2 + t * 2;
          const r1 = 95 + 10 * Math.sin(t * 20 + i), r2 = 150 + 25 * Math.sin(t * 13 + i * 2);
          return <line key={i} x1={300 + Math.cos(a) * r1} y1={ny + Math.sin(a) * r1 * 0.6} x2={300 + Math.cos(a) * r2} y2={ny + Math.sin(a) * r2 * 0.6} stroke={C.banana} strokeWidth={8} strokeLinecap="round" opacity={Math.min(1, zz * 2)} />;
        })}
      </g>
      <circle cx={300} cy={300} r={292} fill="none" stroke={C.forest} strokeWidth={8} />
    </svg>
  );
};

/** Simple palm-up right hand outline (own drawing); fingers can glow. viewBox 500 x 620. */
export const Hand: React.FC<{ w: number; id: string; little?: number; ringHalf?: number; q?: number; t: number }> = ({ w, id, little = 0, ringHalf = 0, q = 0, t }) => {
  const h = (w * 620) / 500;
  // fingers: thumb (left), index, middle, ring, little (right) — palm-up right hand: thumb on the right in reality; we draw a back-of-hand-neutral icon
  const F = [
    { x: 98, top: 120, wd: 66, len: 230 },
    { x: 178, top: 60, wd: 70, len: 290 },
    { x: 262, top: 82, wd: 68, len: 268 },
    { x: 342, top: 150, wd: 60, len: 200 },
  ];
  const pal = "M 70 330 C 70 300 80 290 98 290 L 400 290 C 418 290 420 300 420 330 L 420 470 C 420 560 360 610 250 610 C 140 610 70 560 70 470 Z";
  return (
    <svg width={w} height={h} viewBox="0 0 500 620" style={{ overflow: "visible" }}>
      <defs>
        <clipPath id={`ringR-${id}`}><rect x={262 + 34} y={0} width={200} height={620} /></clipPath>
      </defs>
      {/* thumb */}
      <path d="M 70 420 C 30 400 4 340 10 300 C 16 270 46 266 60 290 C 78 320 92 350 100 380 Z" fill={SKIN} stroke={C.forest} strokeWidth={6} strokeLinejoin="round" />
      {F.map((f, i) => (
        <rect key={i} x={f.x} y={f.top} width={f.wd} height={f.len + 60} rx={f.wd / 2} fill={SKIN} stroke={C.forest} strokeWidth={6} />
      ))}
      {/* little finger glow */}
      <rect x={F[3].x} y={F[3].top} width={F[3].wd} height={F[3].len + 60} rx={F[3].wd / 2} fill="#9CC3E6" opacity={little} stroke={C.forest} strokeWidth={6} />
      {/* half ring finger glow (little-finger side) */}
      <g clipPath={`url(#ringR-${id})`}>
        <rect x={F[2].x} y={F[2].top} width={F[2].wd} height={F[2].len + 60} rx={F[2].wd / 2} fill="#9CC3E6" opacity={ringHalf} stroke={C.forest} strokeWidth={6} />
      </g>
      <path d={pal} fill={SKIN} stroke={C.forest} strokeWidth={6} />
      <path d="M 300 300 L 420 300 L 420 470 C 420 540 390 585 330 602 L 300 602 Z" fill="#9CC3E6" opacity={Math.max(little, ringHalf) * 0.9} />
      <path d={pal} fill="none" stroke={C.forest} strokeWidth={6} />
      {q > 0 && (
        <text x={250} y={490} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={190} fill={C.red} opacity={q} transform={`rotate(${Math.sin(t * 5) * 6} 250 430)`}>?</text>
      )}
    </svg>
  );
};

export const ramp2 = ramp;
