import React from "react";
import { C, FONT, ramp } from "./kit";

/* Book Plume diagram: RIGHT thigh + knee, front view (lateral = viewer's LEFT, same as Gray's Fig. 430).
   Quadriceps femoris = rectus femoris + vastus lateralis / medialis / intermedius → quadriceps tendon → patella
   (sesamoid bone inside the tendon) → patellar ligament → tibial tuberosity. viewBox 860 x 900. */

export type Q = "RF" | "VL" | "VM" | "VI";
export const QCOL: Record<Q, string> = { RF: "#E0644F", VL: "#3E7C93", VM: "#E89A3C", VI: "#5C7A2F" };
export const ANCHOR = {
  RF: [452, 360] as [number, number],
  VL: [282, 450] as [number, number],
  VM: [566, 575] as [number, number],
  VI: [446, 500] as [number, number],
  QT: [450, 650] as [number, number],
  PAT: [452, 706] as [number, number],
  PLIG: [452, 795] as [number, number],
  TT: [452, 842] as [number, number],
  HIP: [492, 202] as [number, number],
  AIIS: [438, 140] as [number, number],
  KNEE: [452, 752] as [number, number],
};

const SKIN = "M 205 70 C 170 210 172 400 218 560 C 250 670 318 740 336 900 L 578 900 C 584 770 650 700 652 560 C 654 430 650 320 700 250 C 730 205 720 160 690 140 Z";
const ILIUM = "M 432 172 C 424 156 420 146 416 138 C 380 128 320 120 270 100 C 236 88 218 72 226 54 C 250 24 340 10 440 14 C 520 18 580 34 604 60 C 620 90 606 130 586 160 C 576 172 566 180 558 186 C 528 150 462 146 432 172 Z";
const PUBIS = "M 552 180 C 600 186 680 196 730 214 C 760 226 764 262 744 286 C 722 308 688 310 664 296 C 654 268 620 246 560 238 Z";
const FEMUR = "M 330 206 C 318 230 330 262 360 270 C 372 400 388 520 396 640 C 372 664 368 716 392 746 L 512 746 C 538 718 532 664 506 642 C 486 520 468 400 452 262 C 470 250 490 236 500 222 C 470 200 420 206 380 196 C 358 190 338 194 330 206 Z";
const TIBIA = "M 344 776 C 380 758 524 758 562 776 C 572 792 560 816 540 826 C 516 836 500 852 494 900 L 414 900 C 408 852 390 836 366 826 C 346 816 336 792 344 776 Z";
const QT = "M 418 622 C 440 616 470 616 490 624 L 500 676 C 470 668 432 668 404 676 Z";
const PLIG = "M 432 748 C 444 744 462 744 474 748 L 470 836 C 460 840 446 840 436 836 Z";

export const SHAPE: Record<Q, string> = {
  VI: "M 382 262 C 414 250 452 254 470 276 C 486 400 486 520 476 632 L 424 636 C 408 520 394 400 382 262 Z",
  VL: "M 326 222 C 262 290 222 410 238 520 C 252 600 330 640 420 650 L 426 606 C 404 492 392 372 382 252 C 364 236 346 226 326 222 Z",
  VM: "M 468 290 C 512 372 552 460 586 548 C 612 618 586 690 512 696 L 478 652 C 486 530 478 410 468 290 Z",
  RF: "M 432 136 C 456 132 470 146 472 176 C 502 290 508 420 488 548 C 482 586 474 614 466 640 L 430 640 C 420 610 410 560 404 470 C 398 360 412 250 426 180 C 424 160 424 146 432 136 Z",
};
/* direction of the muscle fibres (degrees) */
const FANG: Record<Q, number> = { VI: 86, VL: 70, VM: 112, RF: 92 };
const UNLIT = "#D9AE9C";

const mix = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return "#" + pa.map((v, i) => Math.round(v + (pb[i] - v) * k).toString(16).padStart(2, "0")).join("");
};

export const Quad: React.FC<{
  t: number;
  w: number;
  id: string;
  lit?: Partial<Record<Q, number>>; // time each muscle lights up (absent = unlit)
  hot?: Q[];
  peel?: number; // 0..1 rectus femoris becomes see-through (shows vastus intermedius underneath)
  pat?: number; // 0..1 highlight patella
  tendon?: number; // 0..1 highlight quadriceps tendon + patellar ligament
  hip?: number; // 0..1 highlight hip joint
  knee?: number; // 0..1 highlight knee joint
  dim?: number; // 0..1 fade everything except lit
}> = ({ t, w, id, lit = {}, hot = [], peel = 0, pat = 0, tendon = 0, hip = 0, knee = 0 }) => {
  const h = (w * 900) / 860;
  const pulse = 0.5 + 0.5 * Math.sin(t * 7);
  const on = (q: Q) => (lit[q] === undefined ? 0 : ramp(t, lit[q]!, lit[q]! + 0.3));
  const muscle = (q: Q) => {
    const p = on(q);
    const isHot = hot.includes(q);
    const pop = p * (1 - ramp(t, (lit[q] ?? 0) + 0.3, (lit[q] ?? 0) + 0.7));
    const op = q === "RF" ? 1 - 0.78 * peel : 1;
    const fill = mix(UNLIT, QCOL[q], p);
    return (
      <g key={q} opacity={op}>
        {isHot && <path d={SHAPE[q]} fill="none" stroke={C.banana} strokeWidth={26 + 10 * pulse} strokeLinejoin="round" opacity={0.75} />}
        {pop > 0.01 && <path d={SHAPE[q]} fill="none" stroke={C.paper} strokeWidth={30 * pop} strokeLinejoin="round" opacity={0.9} />}
        <path d={SHAPE[q]} fill={fill} />
        <path d={SHAPE[q]} fill={`url(#fib${q}${id})`} />
        <path d={SHAPE[q]} fill={`url(#shade${id})`} />
        {q === "RF" && (
          /* bipennate: central tendon + feather fibres */
          <g clipPath={`url(#clipRF${id})`}>
            <path d="M 446 160 C 456 300 458 450 448 640" stroke="rgba(255,255,255,0.75)" strokeWidth={7} fill="none" />
            {Array.from({ length: 26 }, (_, i) => {
              const y = 190 + i * 17;
              const cx = 446 + 8 * Math.sin((y - 160) / 160);
              return (
                <g key={i}>
                  <path d={`M ${cx} ${y} Q ${cx - 24} ${y - 14} ${cx - 64} ${y - 40}`} stroke="rgba(60,20,14,0.28)" strokeWidth={2.4} fill="none" />
                  <path d={`M ${cx} ${y} Q ${cx + 24} ${y - 14} ${cx + 64} ${y - 40}`} stroke="rgba(60,20,14,0.28)" strokeWidth={2.4} fill="none" />
                </g>
              );
            })}
          </g>
        )}
        <path d={SHAPE[q]} fill="none" stroke={C.forest} strokeWidth={4.5} strokeLinejoin="round" strokeDasharray={q === "RF" && peel > 0.3 ? "14 10" : undefined} />
      </g>
    );
  };
  return (
    <svg width={w} height={h} viewBox="0 0 860 900" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <pattern id={`spongy${id}`} width={22} height={22} patternUnits="userSpaceOnUse">
          <circle cx={5} cy={6} r={2.6} fill="#B9A97A" opacity={0.55} />
          <circle cx={15} cy={14} r={2} fill="#B9A97A" opacity={0.5} />
          <circle cx={9} cy={18} r={1.4} fill="#B9A97A" opacity={0.45} />
        </pattern>
        {(Object.keys(FANG) as Q[]).map((q) => (
          <pattern key={q} id={`fib${q}${id}`} width={13} height={13} patternUnits="userSpaceOnUse" patternTransform={`rotate(${FANG[q]})`}>
            <line x1={0} y1={6.5} x2={13} y2={6.5} stroke="rgba(60,20,14,0.30)" strokeWidth={2.2} />
          </pattern>
        ))}
        <pattern id={`tfib${id}`} width={9} height={9} patternUnits="userSpaceOnUse" patternTransform="rotate(90)">
          <line x1={0} y1={4.5} x2={9} y2={4.5} stroke="#B9AE8E" strokeWidth={2} />
        </pattern>
        <linearGradient id={`shade${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity={0.16} />
          <stop offset="45%" stopColor="#fff" stopOpacity={0.12} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.18} />
        </linearGradient>
        <radialGradient id={`skin${id}`} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#FBF1E1" />
          <stop offset="100%" stopColor="#F1E2CB" />
        </radialGradient>
        <clipPath id={`clipRF${id}`}>
          <path d={SHAPE.RF} />
        </clipPath>
      </defs>
      {/* skin silhouette */}
      <path d={SKIN} fill={`url(#skin${id})`} stroke="#D7B8A0" strokeWidth={8} />
      <path d={SKIN} fill="none" stroke={C.forest} strokeWidth={3} opacity={0.35} strokeDasharray="4 10" />
      {/* hip bone */}
      <path d={ILIUM} fill="#EFE6CC" stroke={C.forest} strokeWidth={5} />
      <path d={ILIUM} fill={`url(#spongy${id})`} />
      <path d="M 262 74 C 330 56 470 40 590 64 C 600 100 590 140 570 168" fill="none" stroke={C.forest} strokeWidth={3} opacity={0.35} />
      <path d={PUBIS} fill="#EFE6CC" stroke={C.forest} strokeWidth={5} />
      <path d={PUBIS} fill={`url(#spongy${id})`} />
      {/* femur */}
      <path d={FEMUR} fill="#EFE6CC" stroke={C.forest} strokeWidth={5} />
      <path d={FEMUR} fill={`url(#spongy${id})`} />
      {/* femoral head in the acetabulum = hip joint */}
      {hip > 0 && <circle cx={ANCHOR.HIP[0]} cy={ANCHOR.HIP[1]} r={70 + 8 * pulse} fill={C.banana} opacity={0.55 * hip} />}
      <circle cx={ANCHOR.HIP[0]} cy={ANCHOR.HIP[1]} r={50} fill="#EFE6CC" stroke={C.forest} strokeWidth={5} />
      <circle cx={ANCHOR.HIP[0]} cy={ANCHOR.HIP[1]} r={50} fill={`url(#spongy${id})`} />
      <path d="M 432 172 C 462 144 528 144 558 186" fill="none" stroke={C.forest} strokeWidth={7} />
      {/* tibia */}
      {knee > 0 && <ellipse cx={ANCHOR.KNEE[0]} cy={ANCHOR.KNEE[1]} rx={150 + 8 * pulse} ry={48 + 5 * pulse} fill={C.banana} opacity={0.55 * knee} />}
      <path d={TIBIA} fill="#EFE6CC" stroke={C.forest} strokeWidth={5} />
      <path d={TIBIA} fill={`url(#spongy${id})`} />
      <ellipse cx={ANCHOR.TT[0]} cy={ANCHOR.TT[1]} rx={26} ry={14} fill="#E6D9B6" stroke={C.forest} strokeWidth={3.5} />
      {/* muscles: deep first */}
      {muscle("VI")}
      {muscle("VL")}
      {muscle("VM")}
      {muscle("RF")}
      {/* hip joint outline shown THROUGH the rectus femoris (it passes in front of the joint) */}
      {hip > 0 && (
        <g opacity={hip}>
          <circle cx={ANCHOR.HIP[0]} cy={ANCHOR.HIP[1]} r={50} fill="none" stroke={C.forest} strokeWidth={4} strokeDasharray="10 8" />
        </g>
      )}
      {/* quadriceps tendon + patellar ligament */}
      {tendon > 0 && (
        <>
          <path d={QT} fill="none" stroke={C.banana} strokeWidth={30 + 8 * pulse} strokeLinejoin="round" opacity={0.7 * tendon} />
          <path d={PLIG} fill="none" stroke={C.banana} strokeWidth={30 + 8 * pulse} strokeLinejoin="round" opacity={0.7 * tendon} />
        </>
      )}
      <path d={QT} fill="#F3EBD6" stroke={C.forest} strokeWidth={4} />
      <path d={QT} fill={`url(#tfib${id})`} />
      <path d={PLIG} fill="#F3EBD6" stroke={C.forest} strokeWidth={4} />
      <path d={PLIG} fill={`url(#tfib${id})`} />
      {/* patella: sesamoid bone inside the tendon */}
      {pat > 0 && <ellipse cx={ANCHOR.PAT[0]} cy={ANCHOR.PAT[1]} rx={66 + 8 * pulse} ry={74 + 8 * pulse} fill={C.banana} opacity={0.7 * pat} />}
      <path d="M 410 690 C 408 664 430 650 452 650 C 476 650 498 664 496 690 C 494 722 474 752 452 760 C 430 752 412 722 410 690 Z" fill={pat > 0.5 ? "#F7E7A6" : "#EFE6CC"} stroke={C.forest} strokeWidth={5} />
      <path d="M 410 690 C 408 664 430 650 452 650 C 476 650 498 664 496 690 C 494 722 474 752 452 760 C 430 752 412 722 410 690 Z" fill={`url(#spongy${id})`} />
      {/* tendon fibres running OVER the patella (it sits inside the tendon) */}
      <g opacity={0.55}>
        {[-26, -13, 0, 13, 26].map((dx) => (
          <path key={dx} d={`M ${452 + dx} 668 C ${452 + dx * 1.1} 700 ${452 + dx * 1.05} 730 ${452 + dx * 0.6} 756`} stroke="#B9AE8E" strokeWidth={2.4} fill="none" />
        ))}
      </g>
      {pat > 0.5 && (
        <text x={452} y={712} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={20} fill={C.forest} opacity={0.75}>
          patella
        </text>
      )}
    </svg>
  );
};
