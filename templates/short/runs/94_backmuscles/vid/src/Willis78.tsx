import React from "react";
import { C, FONT, ramp } from "./kit";

/* Book Plume diagram: BASE of the brain seen from below (front = top), circle of Willis.
   Ring, front → back: AC anterior communicating · AN anterior cerebral · IC internal carotid · PC posterior communicating · PO posterior cerebral
   + not in the ring: MC middle cerebral, BA basilar, VA vertebrals, SC superior cerebellar.
   viewBox 900 x 1000 */

export type K = "AC" | "AN" | "IC" | "PC" | "PO";
export const ORDER: K[] = ["AC", "AN", "IC", "PC", "PO"];
export const LET: Record<K, string> = { AC: "A", AN: "A", IC: "I", PC: "P", PO: "P" };
export const COL: Record<K, string> = { AC: "#E0644F", AN: "#E89A3C", IC: "#C9483C", PC: "#3E7C93", PO: "#8A5BA8" };
export const MCOL = "#5C7A2F";
const ART = "#B86A60"; // resting artery colour
const ARTD = "#7E3A33";

/* anchors (viewBox units) */
export const ANCHOR = {
  AC: [450, 330] as [number, number],
  ANL: [404, 380] as [number, number],
  ANR: [496, 380] as [number, number],
  ICL: [352, 472] as [number, number],
  ICR: [548, 472] as [number, number],
  PCL: [350, 548] as [number, number],
  PCR: [550, 548] as [number, number],
  POL: [300, 628] as [number, number],
  POR: [600, 628] as [number, number],
  MCL: [228, 448] as [number, number],
  MCR: [672, 448] as [number, number],
  BA: [450, 760] as [number, number],
  RING: [450, 480] as [number, number],
  CHI: [450, 412] as [number, number],
};

/* vessel centre-lines, left + right */
const P: Record<K, string[]> = {
  AC: ["M 424 330 L 476 330"],
  AN: ["M 352 472 C 372 430 408 372 424 330 C 432 290 424 200 408 90", "M 548 472 C 528 430 492 372 476 330 C 468 290 476 200 492 90"],
  IC: ["M 352 472 C 350 474 350 476 352 478", "M 548 472 C 550 474 550 476 548 478"],
  PC: ["M 352 472 C 340 512 342 566 372 618", "M 548 472 C 560 512 558 566 528 618"],
  PO: ["M 450 640 C 420 628 396 620 372 618 C 320 616 270 650 226 712 C 200 750 186 800 180 850", "M 450 640 C 480 628 504 620 528 618 C 580 616 630 650 674 712 C 700 750 714 800 720 850"],
};
const MC = ["M 352 472 C 320 466 280 452 240 446 C 200 440 160 452 120 470", "M 548 472 C 580 466 620 452 660 446 C 700 440 740 452 780 470"];
const MCtw = ["M 240 446 C 220 410 196 390 170 380", "M 200 444 C 186 476 160 500 132 512", "M 660 446 C 680 410 704 390 730 380", "M 700 444 C 714 476 740 500 768 512"];
const BA = "M 450 640 L 450 870";
const VA = ["M 450 870 C 430 900 416 940 408 1010", "M 450 870 C 470 900 484 940 492 1010"];
const SC = ["M 450 676 C 410 676 360 690 316 720 C 290 740 268 770 256 800", "M 450 676 C 490 676 540 690 584 720 C 610 740 632 770 644 800"];
const PONT = [700, 740, 790, 830].map((y) => [`M 450 ${y} C 430 ${y + 2} 410 ${y + 6} 396 ${y + 14}`, `M 450 ${y} C 470 ${y + 2} 490 ${y + 6} 504 ${y + 14}`]).flat();
const W: Record<K, number> = { AC: 15, AN: 17, IC: 0, PC: 12, PO: 18 };

/* brain base silhouette + gyri */
const BRAIN =
  "M 450 40 C 380 18 250 30 180 90 C 110 150 100 250 120 330 C 70 380 52 470 64 560 C 76 660 120 740 190 800 C 230 840 290 860 340 870 C 330 920 330 960 360 985 C 400 1010 500 1010 540 985 C 570 960 570 920 560 870 C 610 860 670 840 710 800 C 780 740 824 660 836 560 C 848 470 830 380 780 330 C 800 250 790 150 720 90 C 650 30 520 18 450 40 Z";
const TEMPORAL_L = "M 120 330 C 160 360 220 380 270 400 C 250 470 248 560 280 640 C 230 660 170 640 120 600";
const TEMPORAL_R = "M 780 330 C 740 360 680 380 630 400 C 650 470 652 560 620 640 C 670 660 730 640 780 600";
const GYRI = [
  "M 200 120 C 250 150 300 140 340 170", "M 160 200 C 220 210 270 240 330 230", "M 150 280 C 200 300 250 290 300 320",
  "M 700 120 C 650 150 600 140 560 170", "M 740 200 C 680 210 630 240 570 230", "M 750 280 C 700 300 650 290 600 320",
  "M 100 450 C 140 470 170 500 210 500", "M 90 540 C 130 560 170 590 220 580", "M 120 640 C 170 660 200 700 250 700",
  "M 800 450 C 760 470 730 500 690 500", "M 810 540 C 770 560 730 590 680 580", "M 780 640 C 730 660 700 700 650 700",
  "M 380 110 C 390 160 380 210 392 260", "M 520 110 C 510 160 520 210 508 260",
];
const CEREB = ["M 210 790 C 280 830 330 850 372 880", "M 690 790 C 620 830 570 850 528 880", "M 240 820 C 300 860 340 880 370 920", "M 660 820 C 600 860 560 880 530 920"];

const Vessel: React.FC<{ d: string; w: number; col: string; draw: number; hi: number; flow?: number; t: number }> = ({ d, w, col, draw, hi, flow = 0, t }) => (
  <g>
    {hi > 0 && <path d={d} stroke={C.banana} strokeWidth={w + 30 * hi} fill="none" strokeLinecap="round" opacity={0.75 * hi} />}
    <path d={d} stroke={C.forest} strokeWidth={w + 7} fill="none" strokeLinecap="round" opacity={0.6} pathLength={1} strokeDasharray={`${draw} 1`} />
    <path d={d} stroke={col} strokeWidth={w} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${draw} 1`} />
    <path d={d} stroke="#ffffff" strokeWidth={w * 0.28} fill="none" strokeLinecap="round" opacity={0.35} pathLength={1} strokeDasharray={`${draw} 1`} transform={`translate(${-w * 0.18} ${-w * 0.18})`} />
    {flow > 0 && <path d={d} stroke={C.paper} strokeWidth={w * 0.32} fill="none" strokeLinecap="round" opacity={0.85 * flow} pathLength={1} strokeDasharray="0.04 0.08" strokeDashoffset={-t * 0.5} />}
  </g>
);

export const Willis: React.FC<{
  t: number;
  w: number;
  id: string;
  lit?: Partial<Record<K, number>>; // key → time it lights (absent = resting colour)
  hot?: K[];
  mc?: number; // 0..1 highlight of middle cerebral
  flow?: number; // 0..1 ring flow dashes
  nums?: number; // 0..1 show the 9 numbered badges (staggered)
  dimBrain?: number;
}> = ({ t, w, id, lit = {}, hot = [], mc = 0, flow = 0, nums = 0, dimBrain = 0 }) => {
  const s = w / 900;
  const state = (k: K) => {
    const t0 = lit[k];
    if (t0 === undefined) return { col: ART, draw: 1, hi: 0 };
    const p = ramp(t, t0 - 0.05, t0 + 0.35);
    return { col: p > 0.02 ? COL[k] : ART, draw: Math.max(0.0001, p), hi: hot.includes(k) ? 0.6 + 0.4 * Math.sin(t * 7) ** 2 : 0, p };
  };
  const ringFlow = flow;
  const badge = [
    [450, 330], [404, 384], [496, 384], [352, 472], [548, 472], [344, 548], [556, 548], [306, 624], [594, 624],
  ];
  return (
    <svg width={w} height={1000 * s} viewBox="0 0 900 1000" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={`br${id}`} cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#F3E6DA" />
          <stop offset="100%" stopColor="#E2CDBF" />
        </radialGradient>
        <radialGradient id={`ic${id}`} cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#F08A7A" />
          <stop offset="100%" stopColor="#9E3128" />
        </radialGradient>
      </defs>
      {/* brain base */}
      <g opacity={1 - 0.45 * dimBrain}>
        <path d={BRAIN} fill={`url(#br${id})`} stroke={C.forest} strokeWidth={5} />
        <path d="M 450 40 L 450 300" stroke={C.forest} strokeWidth={4} opacity={0.55} />
        <path d={TEMPORAL_L} fill="none" stroke={C.forest} strokeWidth={4} opacity={0.45} />
        <path d={TEMPORAL_R} fill="none" stroke={C.forest} strokeWidth={4} opacity={0.45} />
        {GYRI.map((g, i) => <path key={i} d={g} fill="none" stroke="#B89A88" strokeWidth={4} strokeLinecap="round" opacity={0.75} />)}
        {CEREB.map((g, i) => <path key={i} d={g} fill="none" stroke="#B89A88" strokeWidth={4} strokeLinecap="round" opacity={0.75} />)}
        {/* olfactory tracts */}
        <path d="M 400 120 C 396 200 396 250 404 300" stroke="#EFE3B8" strokeWidth={12} strokeLinecap="round" fill="none" opacity={0.9} />
        <path d="M 500 120 C 504 200 504 250 496 300" stroke="#EFE3B8" strokeWidth={12} strokeLinecap="round" fill="none" opacity={0.9} />
        {/* pons + medulla */}
        <path d="M 390 650 C 380 720 384 800 400 860 L 500 860 C 516 800 520 720 510 650 C 480 636 420 636 390 650 Z" fill="#E9D7C8" stroke={C.forest} strokeWidth={4} opacity={0.95} />
        <path d="M 404 860 C 410 910 420 950 430 990 L 470 990 C 480 950 490 910 496 860 Z" fill="#E6D2C2" stroke={C.forest} strokeWidth={4} opacity={0.95} />
        {/* optic chiasm + nerves + tracts */}
        <path d="M 360 330 C 400 370 420 395 450 412 C 480 395 500 370 540 330" stroke="#F2E6A8" strokeWidth={20} fill="none" strokeLinecap="round" />
        <path d="M 450 412 C 420 430 390 450 370 500 M 450 412 C 480 430 510 450 530 500" stroke="#F2E6A8" strokeWidth={18} fill="none" strokeLinecap="round" />
        <path d="M 360 330 C 400 370 420 395 450 412 C 480 395 500 370 540 330" stroke={C.forest} strokeWidth={3} fill="none" opacity={0.4} />
        {/* infundibulum + mammillary bodies */}
        <circle cx={450} cy={470} r={22} fill="#E8C7B8" stroke={C.forest} strokeWidth={4} />
        <circle cx={436} cy={560} r={12} fill="#E9D3C6" stroke={C.forest} strokeWidth={3} />
        <circle cx={464} cy={560} r={12} fill="#E9D3C6" stroke={C.forest} strokeWidth={3} />
      </g>
      {/* non-ring arteries */}
      {VA.map((d, i) => <Vessel key={`va${i}`} d={d} w={16} col={ART} draw={1} hi={0} t={t} />)}
      <Vessel d={BA} w={22} col={ART} draw={1} hi={0} t={t} />
      {PONT.map((d, i) => <path key={`p${i}`} d={d} stroke={ARTD} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.8} />)}
      {SC.map((d, i) => <Vessel key={`sc${i}`} d={d} w={10} col={ART} draw={1} hi={0} t={t} />)}
      {MC.map((d, i) => <Vessel key={`mc${i}`} d={d} w={18} col={mc > 0.02 ? MCOL : ART} draw={1} hi={mc > 0.5 ? 0.55 + 0.45 * Math.sin(t * 7) ** 2 : 0} t={t} />)}
      {MCtw.map((d, i) => <path key={`mt${i}`} d={d} stroke={mc > 0.02 ? MCOL : ART} strokeWidth={8} fill="none" strokeLinecap="round" />)}
      {/* ring */}
      {(["PO", "PC", "AN", "AC"] as K[]).map((k) =>
        P[k].map((d, i) => {
          const st = state(k);
          return <Vessel key={`${k}${i}`} d={d} w={W[k]} col={st.col} draw={st.draw} hi={st.hi} flow={ringFlow} t={t} />;
        })
      )}
      {/* internal carotids: cut ends seen from below */}
      {[ANCHOR.ICL, ANCHOR.ICR].map(([x, y], i) => {
        const st = state("IC");
        const p = lit.IC === undefined ? 1 : ramp(t, lit.IC - 0.05, lit.IC + 0.3);
        return (
          <g key={`ic${i}`}>
            {st.hi > 0 && <circle cx={x} cy={y} r={44} fill={C.banana} opacity={0.7 * st.hi} />}
            <circle cx={x} cy={y} r={28} fill={C.forest} />
            <circle cx={x} cy={y} r={23} fill={p > 0.5 && lit.IC !== undefined ? `url(#ic${id})` : ART} />
            <ellipse cx={x} cy={y} rx={11} ry={9} fill="#5A1E18" opacity={0.85} />
            <circle cx={x - 7} cy={y - 8} r={4} fill="#fff" opacity={0.5} />
          </g>
        );
      })}
      {/* 9 numbered badges */}
      {nums > 0 &&
        badge.map(([x, y], i) => {
          const p = ramp(nums, i / 10, i / 10 + 0.12);
          if (p <= 0) return null;
          return (
            <g key={`b${i}`} transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * p})`} opacity={p}>
              <circle r={25} fill={C.forest} stroke={C.paper} strokeWidth={4} />
              <text y={11} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.banana}>{i + 1}</text>
            </g>
          );
        })}
    </svg>
  );
};
