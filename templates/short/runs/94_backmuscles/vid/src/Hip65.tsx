import React from "react";
import { C, ramp } from "./kit";

/**
 * Book Plume original schematic: RIGHT hip from BEHIND (same view as Gray's 1918 Fig. 434).
 * Viewer's left = medial (sacrum, coccyx); viewer's right = lateral (greater trochanter, femur).
 * The 6 deep (short) lateral rotators run from the pelvis to the greater trochanter, top to bottom:
 * piriformis, gemellus superior, obturator internus (tendon between the gemelli), gemellus inferior,
 * obturator externus (deep, mostly hidden behind quadratus femoris), quadratus femoris.
 * Sciatic nerve leaves below piriformis and runs down over the others. viewBox 860 x 860.
 */
export type M = "P" | "GS" | "OI" | "GI" | "OE" | "QF";
type P = [number, number];

export const MCOL: Record<M, string> = {
  P: "#E58B7F",
  GS: "#E8A44E",
  OI: "#B59AD8",
  GI: "#E8A44E",
  OE: "#9CC0E0",
  QF: "#8CC79A",
};
const REST = "#E6D2C4";

export const mix = (a: string, b: string, k: number) => {
  const h = (s: string) => [1, 3, 5].map((j) => parseInt(s.slice(j, j + 2), 16));
  const x = h(a), y = h(b);
  return "#" + x.map((v, j) => Math.round(v + (y[j] - v) * Math.max(0, Math.min(1, k))).toString(16).padStart(2, "0")).join("");
};
const lerp = (a: P, b: P, k: number): P => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];

/* each muscle = upper edge (o1 → i1, cubic a/b) and lower edge (o2 → i2) */
type Band = { o1: P; a1: P; b1: P; i1: P; o2: P; a2: P; b2: P; i2: P; n: number };
const B: Record<M, Band> = {
  P: { o1: [262, 240], a1: [340, 250], b1: [520, 300], i1: [700, 404], o2: [262, 380], a2: [340, 384], b2: [520, 410], i2: [704, 428], n: 11 },
  GS: { o1: [398, 470], a1: [480, 452], b1: [600, 440], i1: [702, 438], o2: [404, 494], a2: [480, 480], b2: [600, 456], i2: [702, 452], n: 4 },
  OI: { o1: [372, 500], a1: [470, 490], b1: [600, 462], i1: [704, 452], o2: [378, 534], a2: [470, 518], b2: [600, 476], i2: [704, 466], n: 5 },
  GI: { o1: [412, 540], a1: [490, 524], b1: [600, 484], i1: [704, 466], o2: [426, 578], a2: [500, 556], b2: [600, 504], i2: [704, 482], n: 5 },
  OE: { o1: [480, 594], a1: [550, 576], b1: [620, 530], i1: [690, 488], o2: [488, 622], a2: [560, 600], b2: [630, 548], i2: [690, 508], n: 4 },
  QF: { o1: [452, 604], a1: [520, 604], b1: [600, 580], i1: [668, 548], o2: [466, 712], a2: [540, 708], b2: [610, 680], i2: [660, 656], n: 12 },
};
/* label anchor (middle of the belly) */
export const ANCHOR: Record<M, P> = {
  P: [440, 336],
  GS: [560, 462],
  OI: [520, 496],
  GI: [560, 522],
  OE: [640, 538],
  QF: [560, 640],
};
const cub = (o: P, a: P, b: P, i: P) => `M${o[0].toFixed(1)} ${o[1].toFixed(1)} C${a[0].toFixed(1)} ${a[1].toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)} ${i[0].toFixed(1)} ${i[1].toFixed(1)}`;
const bandPath = (b: Band) =>
  `${cub(b.o1, b.a1, b.b1, b.i1)} L${b.i2[0]} ${b.i2[1]} C${b.b2[0]} ${b.b2[1]} ${b.a2[0]} ${b.a2[1]} ${b.o2[0]} ${b.o2[1]} Z`;
const fibers = (b: Band) => {
  const out: string[] = [];
  for (let j = 1; j < b.n; j++) {
    const k = j / b.n;
    out.push(cub(lerp(b.o1, b.o2, k), lerp(b.a1, b.a2, k), lerp(b.b1, b.b2, k), lerp(b.i1, b.i2, k)));
  }
  return out;
};

/* sciatic nerve centre line (below piriformis, down between ischial tuberosity and greater trochanter) */
const NERVE: P[] = [[372, 404], [440, 430], [500, 486], [528, 580], [538, 700], [546, 800], [552, 900]];
const nervePath = (() => {
  let d = `M${NERVE[0][0]} ${NERVE[0][1]}`;
  for (let i = 1; i < NERVE.length; i++) {
    const p0 = NERVE[i - 1], p1 = NERVE[i];
    const m: P = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
    d += ` Q${p0[0]} ${p0[1]} ${m[0]} ${m[1]}`;
  }
  return d + ` L${NERVE[NERVE.length - 1][0]} ${NERVE[NERVE.length - 1][1]}`;
})();

export const HipDiagram: React.FC<{
  t: number;
  w: number;
  lit?: Partial<Record<M, number>>; // time each muscle lights up
  glow?: M[];
  nerve?: number; // time the sciatic nerve draws in (-1 = hidden)
  rot?: number; // time the lateral-rotation arrow appears (-1 = hidden)
  id: string;
  grow?: number; // time the bones draw in
}> = ({ t, w, lit = {}, glow = [], nerve = -1, rot = -1, id, grow = -10 }) => {
  const g = ramp(t, grow, grow + 0.6);
  const L = (m: M) => (lit[m] === undefined ? 0 : ramp(t, lit[m]! - 0.05, lit[m]! + 0.25));
  const nv = nerve < 0 ? 0 : ramp(t, nerve, nerve + 0.7);
  const rv = rot < 0 ? 0 : ramp(t, rot, rot + 0.6);
  const bone = "#FBF4E2";
  const ink = C.forest;
  const order: M[] = ["OE", "QF", "GI", "OI", "GS", "P"];
  return (
    <svg width={w} height={w} viewBox="0 0 860 860" style={{ overflow: "visible" }}>
      <defs>
        <filter id={`glow${id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="10" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <pattern id={`hatch${id}`} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="10" stroke={ink} strokeWidth="1.4" opacity="0.18" />
        </pattern>
        <linearGradient id={`shade${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#1F2A14" stopOpacity="0.16" />
        </linearGradient>
        <clipPath id={`clip${id}`}>
          <rect x={-200} y={-200} width={1260} height={200 + 1060 * g} />
        </clipPath>
      </defs>
      <g clipPath={`url(#clip${id})`}>
        {/* ---- sacrotuberous ligament (behind, pale) ---- */}
        <path d="M250 300 C300 420 360 560 430 640 L452 612 C392 540 330 420 296 296 Z" fill="#EFE6CF" stroke={ink} strokeWidth={3} opacity={0.9} />
        {/* ---- hip bone: ilium, greater sciatic notch, ischial spine, lesser notch, ischial tuberosity, ramus ---- */}
        <path
          d="M292 176 C330 104 470 54 600 66 C700 76 790 120 812 196 C826 250 800 300 760 340 C730 370 708 392 700 420
             L612 432 C590 440 572 456 562 476 C540 520 520 560 500 600 C486 630 478 662 476 692 C474 724 452 748 420 744
             C384 740 362 716 352 690 C330 712 300 730 268 738 L256 708 C290 698 330 678 352 650 C366 630 380 606 398 588
             C410 572 412 556 404 542 C396 528 382 514 384 500 L362 498 L392 476 C412 452 424 430 418 408
             C410 386 380 374 350 372 C326 370 308 360 300 340 C288 290 282 220 292 176 Z"
          fill={bone}
          stroke={ink}
          strokeWidth={5}
          strokeLinejoin="round"
        />
        {/* iliac crest */}
        <path d="M292 176 C330 104 470 54 600 66 C700 76 790 120 812 196" fill="none" stroke={ink} strokeWidth={10} strokeLinecap="round" />
        {/* posterior + anterior gluteal lines */}
        <path d="M330 150 C360 230 380 300 372 360" fill="none" stroke={ink} strokeWidth={2.5} opacity={0.35} strokeDasharray="10 8" />
        <path d="M470 90 C520 200 600 280 720 330" fill="none" stroke={ink} strokeWidth={2.5} opacity={0.35} strokeDasharray="10 8" />
        <path d="M600 72 C640 170 700 230 790 260" fill="none" stroke={ink} strokeWidth={2.5} opacity={0.3} strokeDasharray="10 8" />
        {/* bone texture */}
        <path d="M420 160 C470 140 540 130 600 140 M440 220 C500 200 580 200 640 220" fill="none" stroke={ink} strokeWidth={1.6} opacity={0.12} />
        {/* ischial tuberosity (rough area) */}
        <path d="M402 600 C430 590 468 600 476 640 C482 680 470 720 440 734 C410 744 380 726 372 696 C364 660 376 612 402 600 Z" fill={`url(#hatch${id})`} stroke={ink} strokeWidth={3} opacity={0.9} />
        {/* ---- hip joint capsule + femoral neck ---- */}
        <path d="M560 440 C600 410 660 404 700 412 L712 520 C660 540 600 540 570 520 C556 496 552 464 560 440 Z" fill="#F3E9D2" stroke={ink} strokeWidth={4} />
        {/* ---- femur: greater trochanter, intertrochanteric crest, lesser trochanter, shaft ---- */}
        <path
          d="M680 396 C700 372 750 370 784 392 C810 410 818 470 806 530 C798 570 786 600 778 630 C768 700 766 790 770 900 L676 900
             C676 800 672 720 660 676 C652 650 638 644 626 640 C618 630 626 616 640 612 C652 600 660 580 664 560 C664 500 664 440 680 396 Z"
          fill={bone}
          stroke={ink}
          strokeWidth={5}
          strokeLinejoin="round"
        />
        <path d="M700 404 C716 470 704 560 664 624" fill="none" stroke={ink} strokeWidth={5} opacity={0.6} strokeLinecap="round" />
        <path d="M630 620 C610 628 604 650 620 662 C638 672 660 656 660 640" fill={bone} stroke={ink} strokeWidth={4} />
        <path d="M780 470 C790 520 786 570 772 620 M700 700 C704 780 706 840 706 900" fill="none" stroke={ink} strokeWidth={1.8} opacity={0.18} />
        <ellipse cx={686} cy={486} rx={12} ry={28} fill={ink} opacity={0.12} />
      </g>

      {/* ---- the 6 muscles ---- */}
      <g opacity={g}>
        {order.map((m) => {
          const b = B[m];
          const k = L(m);
          const fill = mix(REST, MCOL[m], k);
          const on = glow.includes(m);
          const deep = m === "OE";
          return (
            <g key={m} filter={on ? `url(#glow${id})` : undefined} opacity={deep ? 0.55 + 0.45 * k : 1}>
              <path d={bandPath(b)} fill={fill} stroke={ink} strokeWidth={on ? 6 : 4} strokeLinejoin="round" strokeDasharray={deep ? "14 9" : undefined} />
              <path d={bandPath(b)} fill={`url(#shade${id})`} />
              {fibers(b).map((d, j) => (
                <path key={j} d={d} fill="none" stroke={ink} strokeWidth={1.6} opacity={0.28} />
              ))}
              {/* tendon onto the greater trochanter */}
              <circle cx={(b.i1[0] + b.i2[0]) / 2} cy={(b.i1[1] + b.i2[1]) / 2} r={6} fill={ink} opacity={0.7} />
            </g>
          );
        })}
        {/* obturator internus tendon bends around the lesser sciatic notch */}
        <path d="M372 500 C356 508 356 528 378 534" fill="none" stroke={C.forest} strokeWidth={4} />
      </g>

      <g clipPath={`url(#clip${id})`}>
        {/* ---- sacrum + coccyx ---- */}
        <path
          d="M120 168 C180 140 250 146 300 180 C304 250 300 330 290 400 C280 470 262 528 232 566 C212 590 180 592 166 568 C142 506 126 420 118 340 C112 268 110 210 120 168 Z"
          fill={bone}
          stroke={ink}
          strokeWidth={5}
        />
        {[232, 300, 368, 434].map((y, i) => (
          <g key={y} opacity={0.6}>
            <ellipse cx={176 + i * 3} cy={y} rx={15 - i} ry={11 - i} fill={ink} fillOpacity={0.08} stroke={ink} strokeWidth={3} />
            <ellipse cx={252 - i * 8} cy={y + 6} rx={12 - i} ry={10 - i} fill={ink} fillOpacity={0.08} stroke={ink} strokeWidth={3} />
          </g>
        ))}
        <path d="M150 190 C150 300 170 420 200 520" fill="none" stroke={ink} strokeWidth={2} opacity={0.25} strokeDasharray="6 7" />
        <path d="M194 576 C204 606 200 632 190 652 C182 664 170 656 172 640 C174 618 176 600 170 578" fill={bone} stroke={ink} strokeWidth={4} />
      </g>

      {/* ---- sciatic nerve ---- */}
      {nv > 0 && (
        <g filter={`url(#glow${id})`}>
          <path d={nervePath} fill="none" stroke={ink} strokeWidth={34} strokeLinecap="round" pathLength={1} strokeDasharray={`${nv} 1`} />
          <path d={nervePath} fill="none" stroke={C.banana} strokeWidth={24} strokeLinecap="round" pathLength={1} strokeDasharray={`${nv} 1`} />
          <path d={nervePath} fill="none" stroke={ink} strokeWidth={2} opacity={0.35} strokeDasharray="6 10" />
        </g>
      )}

      {/* ---- lateral rotation arrow around the femur ---- */}
      {rv > 0 && (
        <g opacity={rv}>
          <path
            d="M640 700 C660 770 800 780 834 700"
            fill="none"
            stroke={C.red}
            strokeWidth={12}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={`${rv} 1`}
          />
          {rv > 0.95 && <path d="M814 684 L850 694 L832 728 Z" fill={C.red} stroke={C.red} strokeWidth={6} strokeLinejoin="round" />}
        </g>
      )}
    </svg>
  );
};
