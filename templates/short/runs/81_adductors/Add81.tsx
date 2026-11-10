import React from "react";
import { C, FONT, ramp } from "./kit";

/* Book Plume diagram: RIGHT thigh, front view (lateral = viewer's LEFT, medial = viewer's RIGHT, same as Gray's Figs. 430 + 433).
   Medial (adductor) group: pectineus, adductor longus, adductor brevis (deep to pectineus + longus), adductor magnus (deepest, biggest),
   gracilis (most medial, strap to the medial tibia). Obturator nerve leaves the obturator foramen; adductor magnus also gets the
   tibial part of the sciatic nerve (posterior, "hamstring part"). viewBox 860 x 900. */

export type M = "P" | "L" | "B" | "MG" | "G";
export const LETTERS: M[] = ["P", "L", "B", "MG", "G"];
export const LET: Record<M, string> = { P: "P", L: "L", B: "B", MG: "M", G: "G" };
export const MCOL: Record<M, string> = { P: "#E0644F", L: "#3E7C93", B: "#E89A3C", MG: "#6E8F35", G: "#8E5BA8" };
export const MNAME: Record<M, string> = { P: "Pectineus", L: "Adductor longus", B: "Adductor brevis", MG: "Adductor magnus", G: "Gracilis" };
export const ANCHOR: Record<M | "OBT" | "HIP" | "TUB" | "TIB", [number, number]> = {
  P: [578, 278],
  L: [604, 392],
  B: [548, 338],
  MG: [598, 548],
  G: [708, 470],
  OBT: [640, 312],
  HIP: [492, 202],
  TUB: [520, 652],
  TIB: [548, 818],
};

const SKIN = "M 205 70 C 170 210 172 400 218 560 C 250 670 318 740 336 900 L 600 900 C 606 800 660 740 704 640 C 752 524 792 404 794 300 C 796 220 764 168 722 140 Z";
const ILIUM = "M 432 172 C 424 156 420 146 416 138 C 380 128 320 120 270 100 C 236 88 218 72 226 54 C 250 24 340 10 440 14 C 520 18 580 34 604 60 C 620 90 606 130 586 160 C 576 172 566 180 558 186 C 528 150 462 146 432 172 Z";
const PUBIS = "M 552 180 C 600 186 680 196 730 214 C 760 226 768 262 760 300 C 752 330 730 352 700 366 C 668 382 632 394 604 394 C 580 394 568 380 576 362 C 584 344 604 336 626 330 C 600 300 590 262 560 238 Z";
const FORAMEN = "M 604 296 C 600 270 640 258 668 270 C 690 280 696 306 680 322 C 662 338 618 334 604 296 Z";
const FEMUR = "M 330 206 C 318 230 330 262 360 270 C 372 400 388 520 396 640 C 372 664 368 716 392 746 L 512 746 C 538 718 532 664 506 642 C 486 520 468 400 452 262 C 470 250 490 236 500 222 C 470 200 420 206 380 196 C 358 190 338 194 330 206 Z";
const TIBIA = "M 344 776 C 380 758 524 758 562 776 C 572 792 560 816 540 826 C 516 836 500 852 494 900 L 414 900 C 408 852 390 836 366 826 C 346 816 336 792 344 776 Z";

export const SHAPE: Record<M, string> = {
  MG: "M 612 334 C 670 326 730 306 758 304 C 768 336 756 388 728 446 C 686 532 610 610 536 666 L 510 652 C 498 560 480 420 462 300 C 512 318 564 336 612 334 Z",
  B: "M 640 294 C 676 298 712 304 728 314 C 684 362 594 410 478 442 C 472 400 466 350 460 300 C 520 298 584 292 640 294 Z",
  P: "M 566 236 C 604 240 646 248 680 262 C 642 298 542 320 470 332 C 464 312 460 292 456 274 C 494 262 532 248 566 236 Z",
  L: "M 690 264 C 706 266 718 278 716 294 C 662 382 572 482 494 578 C 486 520 478 460 472 404 C 560 360 640 312 690 264 Z",
  G: "M 724 282 C 744 284 758 292 758 310 C 750 440 702 580 614 720 C 592 756 568 790 554 826 L 532 818 C 546 784 562 748 582 712 C 654 580 702 450 724 282 Z",
};
/* the medial "hamstring part" of adductor magnus (tibial nerve) */
const HAM = "M 728 330 C 756 330 764 360 750 400 C 722 482 640 590 540 664 L 524 652 C 612 580 690 470 728 330 Z";
const FANG: Record<M, number> = { P: 162, L: 136, B: 162, MG: 121, G: 110 };
const UNLIT = "#D9AE9C";

export const mix = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return "#" + pa.map((v, i) => Math.round(v + (pb[i] - v) * k).toString(16).padStart(2, "0")).join("");
};

export const Thigh: React.FC<{
  t: number;
  w: number;
  id: string;
  lit?: Partial<Record<M, number>>; // time each muscle lights up (absent = unlit)
  hot?: M[];
  peel?: number; // 0..1 pectineus + adductor longus go see-through → adductor brevis underneath
  nerve?: number; // 0..1 obturator nerve drawn
  sciatic?: number; // 0..1 sciatic (tibial part) to the hamstring part of adductor magnus
  ham?: number; // 0..1 highlight the hamstring part of adductor magnus
  pull?: number; // 0..1 adduction arrows
  mark?: Partial<Record<M, string>>; // letter badges (quiz)
  dimOthers?: number; // 0..1 fade muscles that are not hot
}> = ({ t, w, id, lit = {}, hot = [], peel = 0, nerve = 0, sciatic = 0, ham = 0, pull = 0, mark, dimOthers = 0 }) => {
  const h = (w * 900) / 860;
  const pulse = 0.5 + 0.5 * Math.sin(t * 7);
  const on = (q: M) => (lit[q] === undefined ? 0 : ramp(t, lit[q]!, lit[q]! + 0.3));
  const muscle = (q: M) => {
    const p = on(q);
    const isHot = hot.includes(q);
    const pop = p * (1 - ramp(t, (lit[q] ?? 0) + 0.3, (lit[q] ?? 0) + 0.7));
    const see = q === "P" || q === "L" ? peel : 0;
    const op = (1 - 0.8 * see) * (isHot ? 1 : 1 - 0.55 * dimOthers);
    const fill = mix(UNLIT, MCOL[q], p);
    return (
      <g key={q} opacity={op}>
        {isHot && <path d={SHAPE[q]} fill="none" stroke={C.banana} strokeWidth={24 + 10 * pulse} strokeLinejoin="round" opacity={0.8} />}
        {pop > 0.01 && <path d={SHAPE[q]} fill="none" stroke={C.paper} strokeWidth={28 * pop} strokeLinejoin="round" opacity={0.9} />}
        <path d={SHAPE[q]} fill={fill} />
        <path d={SHAPE[q]} fill={`url(#fib${q}${id})`} />
        <path d={SHAPE[q]} fill={`url(#shade${id})`} />
        <path d={SHAPE[q]} fill="none" stroke={C.forest} strokeWidth={4.5} strokeLinejoin="round" strokeDasharray={see > 0.3 ? "14 10" : undefined} />
      </g>
    );
  };
  const badge = (q: M) => {
    if (!mark || !mark[q]) return null;
    const [x, y] = ANCHOR[q];
    return (
      <g key={`m${q}`}>
        <circle cx={x} cy={y} r={30} fill={MCOL[q]} stroke={C.paper} strokeWidth={6} />
        <circle cx={x} cy={y} r={30} fill="none" stroke={C.forest} strokeWidth={3} />
        <text x={x} y={y + 12} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={C.paper}>{mark[q]}</text>
      </g>
    );
  };
  const dash = (len: number, p: number) => ({ strokeDasharray: `${len}`, strokeDashoffset: `${len * (1 - p)}` });
  return (
    <svg width={w} height={h} viewBox="0 0 860 900" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <pattern id={`spongy${id}`} width={22} height={22} patternUnits="userSpaceOnUse">
          <circle cx={5} cy={6} r={2.6} fill="#B9A97A" opacity={0.55} />
          <circle cx={15} cy={14} r={2} fill="#B9A97A" opacity={0.5} />
          <circle cx={9} cy={18} r={1.4} fill="#B9A97A" opacity={0.45} />
        </pattern>
        {LETTERS.map((q) => (
          <pattern key={q} id={`fib${q}${id}`} width={13} height={13} patternUnits="userSpaceOnUse" patternTransform={`rotate(${FANG[q]})`}>
            <line x1={0} y1={6.5} x2={13} y2={6.5} stroke="rgba(60,20,14,0.30)" strokeWidth={2.2} />
          </pattern>
        ))}
        <linearGradient id={`shade${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity={0.16} />
          <stop offset="45%" stopColor="#fff" stopOpacity={0.12} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.18} />
        </linearGradient>
        <radialGradient id={`skin${id}`} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#FBF1E1" />
          <stop offset="100%" stopColor="#F1E2CB" />
        </radialGradient>
        <marker id={`ah${id}`} viewBox="0 0 10 10" refX={5} refY={5} markerWidth={3.2} markerHeight={3.2} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.forest} />
        </marker>
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
      <path d={FORAMEN} fill="#5E5A44" stroke={C.forest} strokeWidth={4} />
      {/* pubic symphysis (midline) */}
      <path d="M 766 216 L 772 300" stroke={C.forest} strokeWidth={5} strokeDasharray="6 7" opacity={0.6} />
      {/* femur */}
      <path d={FEMUR} fill="#EFE6CC" stroke={C.forest} strokeWidth={5} />
      <path d={FEMUR} fill={`url(#spongy${id})`} />
      <circle cx={ANCHOR.HIP[0]} cy={ANCHOR.HIP[1]} r={50} fill="#EFE6CC" stroke={C.forest} strokeWidth={5} />
      <circle cx={ANCHOR.HIP[0]} cy={ANCHOR.HIP[1]} r={50} fill={`url(#spongy${id})`} />
      <path d="M 432 172 C 462 144 528 144 558 186" fill="none" stroke={C.forest} strokeWidth={7} />
      {/* lesser trochanter */}
      <ellipse cx={462} cy={286} rx={18} ry={14} fill="#E6D9B6" stroke={C.forest} strokeWidth={3.5} />
      {/* tibia */}
      <path d={TIBIA} fill="#EFE6CC" stroke={C.forest} strokeWidth={5} />
      <path d={TIBIA} fill={`url(#spongy${id})`} />
      {/* sciatic nerve: runs BEHIND the femur (dashed = posterior) */}
      {sciatic > 0 && (
        <g opacity={Math.min(1, sciatic * 1.4)}>
          <path d="M 400 150 C 410 300 420 480 430 700" fill="none" stroke={C.paper} strokeWidth={22} strokeLinecap="round" style={dash(560, sciatic)} />
          <path d="M 400 150 C 410 300 420 480 430 700" fill="none" stroke={C.bananaDark} strokeWidth={13} strokeLinecap="round" strokeDasharray="22 12" />
        </g>
      )}
      {/* muscles: deepest first */}
      {muscle("MG")}
      {ham > 0 && <path d={HAM} fill={C.banana} opacity={0.55 * ham + 0.2 * ham * pulse} stroke={C.forest} strokeWidth={3} strokeDasharray="8 8" />}
      {muscle("B")}
      {muscle("P")}
      {muscle("L")}
      {muscle("G")}
      {/* adductor magnus tendon to the adductor tubercle */}
      <path d="M 536 666 C 528 690 522 704 518 716" stroke="#B9AE8E" strokeWidth={9} strokeLinecap="round" fill="none" />
      {/* obturator nerve: out of the obturator foramen, into the adductors */}
      {nerve > 0 && (
        <g>
          {[
            "M 610 110 C 622 190 636 250 646 300",
            "M 646 300 C 640 330 618 360 596 392",
            "M 646 300 C 630 316 596 330 556 340",
            "M 646 300 C 664 360 690 420 708 470",
            "M 646 300 C 650 380 630 470 604 548",
          ].map((d, i) => {
            const p = ramp(nerve, i === 0 ? 0 : 0.45, i === 0 ? 0.5 : 1);
            return (
              <g key={i}>
                <path d={d} fill="none" stroke={C.forest} strokeWidth={17} strokeLinecap="round" style={dash(300, p)} opacity={i === 0 ? 0.45 : 1} />
                <path d={d} fill="none" stroke={C.banana} strokeWidth={10} strokeLinecap="round" style={dash(300, p)} opacity={i === 0 ? 0.6 : 1} />
              </g>
            );
          })}
        </g>
      )}
      {/* branch of the sciatic (tibial part) to the hamstring part of adductor magnus */}
      {sciatic > 0 && (
        <path d="M 424 470 C 520 470 620 440 712 420" fill="none" stroke={C.bananaDark} strokeWidth={10} strokeLinecap="round" strokeDasharray="18 10" opacity={ramp(sciatic, 0.5, 1)} />
      )}
      {/* adduction arrows: pull the thigh IN */}
      {pull > 0 && (
        <g opacity={pull}>
          {[620, 730].map((y, i) => {
            const k = (t * 1.6 + i * 0.3) % 1;
            return (
              <path key={y} d={`M ${250 + 30 * k} ${y} L ${420 + 30 * k} ${y}`} stroke={C.forest} strokeWidth={14} strokeLinecap="round" markerEnd={`url(#ah${id})`} opacity={0.9} />
            );
          })}
        </g>
      )}
      {LETTERS.map(badge)}
    </svg>
  );
};
