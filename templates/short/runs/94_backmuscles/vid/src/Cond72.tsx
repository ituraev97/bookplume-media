import React from "react";
import { C, FONT, ramp } from "./kit";

/**
 * Book Plume own diagram: the heart's conduction system (run 72). viewBox 860 x 720, frontal section.
 * Viewer's left = patient's RIGHT (right atrium, right ventricle). Facts: OpenStax Anatomy & Physiology 2e, 19.2
 * (SA node in the superior/posterior wall of the right atrium → internodal pathways → AV node (≈100 ms delay) →
 *  AV bundle (bundle of His) → right + left bundle branches along the interventricular septum → Purkinje fibers).
 */
export const STEP_COL = ["#F2D14E", "#F08F6B", "#E8796B", "#B49BE0", "#7FC3E0"]; // SA, AV, His, branches, Purkinje

const MUS = { fill: "#D9826F", dark: "#A9503F", light: "#F0B2A2" };
const CAV_R = "#B9CBE3", CAV_L = "#F2B3A6";

const OUTER =
  "M262 150 C 168 150 118 228 126 322 C 134 424 200 522 318 612 C 398 672 470 704 540 704 C 604 702 656 650 694 568 C 742 466 762 378 752 298 C 742 210 690 158 612 154 Z";
const RA = "M172 208 C 236 178 374 182 404 232 L 404 344 L 178 344 C 152 312 150 244 172 208 Z";
const LA = "M456 232 C 482 190 640 182 700 212 C 722 252 722 316 702 344 L 456 344 Z";
const RV = "M182 366 L 404 366 L 404 602 C 360 604 262 544 218 474 C 194 436 182 402 182 366 Z";
const LV = "M456 366 L 700 366 C 714 452 690 562 620 640 C 584 672 542 664 522 634 C 482 582 462 500 456 366 Z";
const SVC = "M232 -30 L 238 196";
const AO = "M478 236 C 474 150 478 92 530 62 C 600 24 690 50 712 128";
const PT = "M388 236 C 392 160 380 112 330 86";

// conduction paths
export const P_INTER = ["M252 204 C 300 232 366 288 414 334", "M248 210 C 252 286 330 326 414 338", "M262 198 C 350 168 470 168 566 206"];
export const P_HIS = "M420 342 C 424 362 428 380 430 402";
export const P_RBB = "M428 402 C 414 452 410 520 402 578";
export const P_LBB = "M434 402 C 448 452 456 520 470 590";
export const P_PURK_R = "M402 578 C 366 600 290 552 238 488 C 210 452 196 414 194 382";
export const P_PURK_L = "M470 590 C 500 652 566 664 616 612 C 664 560 692 470 692 398";
const TWIGS_R: [number, number, number, number][] = [[372, 592, 352, 560], [318, 574, 312, 538], [270, 532, 282, 500], [228, 470, 254, 452], [204, 420, 232, 412]];
const TWIGS_L: [number, number, number, number][] = [[496, 638, 506, 600], [548, 662, 548, 622], [600, 628, 584, 596], [640, 580, 612, 562], [672, 520, 642, 512], [688, 450, 656, 448]];

// a dot travelling the whole path (SA → AV → His → LBB → Purkinje)
const FULL: [number, number][] = [
  [252, 204], [300, 236], [360, 286], [414, 334], [420, 342], [428, 380], [432, 402], [448, 452], [456, 520], [470, 590], [500, 650], [566, 664], [616, 612], [664, 560], [692, 470], [692, 398],
];
const along = (k: number) => {
  const segs = FULL.slice(1).map((p, i) => Math.hypot(p[0] - FULL[i][0], p[1] - FULL[i][1]));
  const tot = segs.reduce((a, b) => a + b, 0);
  let d = Math.max(0, Math.min(1, k)) * tot;
  for (let i = 0; i < segs.length; i++) {
    if (d <= segs[i]) {
      const f = d / segs[i];
      return [FULL[i][0] + (FULL[i + 1][0] - FULL[i][0]) * f, FULL[i][1] + (FULL[i + 1][1] - FULL[i][1]) * f];
    }
    d -= segs[i];
  }
  return FULL[FULL.length - 1];
};

export const Conduction: React.FC<{
  t: number;
  w?: number;
  drawn?: number; // heart builds in 0..1
  lit: number[]; // 5 values 0..1: SA, AV, His, branches, Purkinje
  cur?: number;
  pulse?: number; // travelling dot 0..1 (-1 = off)
  atria?: number; // atria contraction flash 0..1
  vent?: number; // ventricles flash 0..1
  tags?: number; // chamber names 0..1
  dim?: number; // dim everything except the conduction system 0..1
}> = ({ t, w = 860, drawn = 1, lit, cur = -1, pulse = -1, atria = 0, vent = 0, tags = 0, dim = 0 }) => {
  const s = w / 860;
  const beat = 1 + 0.01 * Math.max(0, Math.sin(t * 7.2)) ** 6;
  const glow = (i: number) => (i === cur ? 0.7 + 0.3 * Math.sin(t * 9) : 0);
  const Wire: React.FC<{ d: string; i: number; width?: number; key2?: string }> = ({ d, i, width = 9 }) => {
    const p = lit[i] ?? 0;
    return (
      <g>
        <path d={d} fill="none" stroke={C.forest} strokeWidth={width + 7} strokeLinecap="round" opacity={0.35 + 0.65 * Math.min(1, p * 2)} />
        <path d={d} fill="none" stroke="#7A5A50" strokeWidth={width} strokeLinecap="round" />
        {p > 0 && <path d={d} fill="none" stroke={STEP_COL[i]} strokeWidth={width} strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 1`} />}
        {glow(i) > 0 && <path d={d} fill="none" stroke={STEP_COL[i]} strokeWidth={width + 18} strokeLinecap="round" opacity={0.35 * glow(i)} />}
      </g>
    );
  };
  const node = (x: number, y: number, rx: number, ry: number, i: number) => {
    const p = lit[i] ?? 0;
    const g = glow(i);
    return (
      <g>
        {g > 0 && <ellipse cx={x} cy={y} rx={rx + 26 + 8 * Math.sin(t * 9)} ry={ry + 26 + 8 * Math.sin(t * 9)} fill={STEP_COL[i]} opacity={0.35 * g} />}
        <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={p > 0.05 ? STEP_COL[i] : "#8A6458"} stroke={C.forest} strokeWidth={5} />
        <ellipse cx={x - rx * 0.3} cy={y - ry * 0.35} rx={rx * 0.35} ry={ry * 0.25} fill="#FFF8E0" opacity={0.6 * p} />
      </g>
    );
  };
  const tube = (d: string, width: number, fill: string, dark: string) => (
    <g>
      <path d={d} fill="none" stroke={C.forest} strokeWidth={width + 9} strokeLinecap="round" />
      <path d={d} fill="none" stroke={dark} strokeWidth={width} strokeLinecap="round" />
      <path d={d} fill="none" stroke={fill} strokeWidth={width * 0.6} strokeLinecap="round" transform="translate(-3 -2)" />
    </g>
  );
  const op = 1 - 0.45 * dim;
  const [px, py] = pulse >= 0 ? along(pulse) : [0, 0];
  return (
    <svg width={w} height={720 * s} viewBox="0 0 860 720" style={{ overflow: "visible" }}>
      <g opacity={drawn} transform={`translate(${430 * (1 - beat)} ${400 * (1 - beat)}) scale(${beat})`}>
        <g opacity={op}>
          {tube(PT, 70, "#8DB0DA", "#4E79AA")}
          {tube(AO, 78, "#E5786A", "#A73B2E")}
          {tube(SVC, 66, "#8DB0DA", "#4E79AA")}
          <path d={OUTER} fill={MUS.fill} stroke={C.forest} strokeWidth={7} />
          <path d={OUTER} fill="none" stroke={MUS.light} strokeWidth={10} opacity={0.55} transform="translate(-6 -6) scale(1.0)" strokeDasharray="300 2000" />
          {/* myocardium texture */}
          <defs><clipPath id="hc72"><path d={OUTER} /></clipPath></defs>
          <g clipPath="url(#hc72)">{Array.from({ length: 22 }, (_, i) => {
            const a = Math.sin(i * 12.9898) * 43758.5453;
            const r = a - Math.floor(a);
            const b = Math.sin(i * 78.233) * 12345.678;
            const r2 = b - Math.floor(b);
            const x = 160 + r * 560, y = 380 + r2 * 280;
            return <path key={i} d={`M${x} ${y} q 16 -10 32 0`} fill="none" stroke={MUS.dark} strokeWidth={3} opacity={0.35} />;
          })}</g>
          <path d={RA} fill={CAV_R} stroke={C.forest} strokeWidth={5} />
          <path d={LA} fill={CAV_L} stroke={C.forest} strokeWidth={5} />
          <path d={RV} fill={CAV_R} stroke={C.forest} strokeWidth={5} />
          <path d={LV} fill={CAV_L} stroke={C.forest} strokeWidth={5} />
          {/* atrial flash / ventricular flash */}
          {atria > 0 && (
            <g opacity={atria * 0.55}>
              <path d={RA} fill={C.banana} />
              <path d={LA} fill={C.banana} />
            </g>
          )}
          {vent > 0 && (
            <g opacity={vent * 0.55}>
              <path d={RV} fill={C.banana} />
              <path d={LV} fill={C.banana} />
            </g>
          )}
          {/* fibrous AV plane */}
          <rect x={176} y={344} width={528} height={22} rx={8} fill="#EFE6C8" stroke={C.forest} strokeWidth={4} />
          {/* tricuspid + mitral leaflets */}
          {[[230, 300], [330, 400], [490, 560], [600, 680]].map(([a, b], i) => (
            <path key={i} d={`M${a} 366 C ${a + 8} 400 ${(a + b) / 2 - 8} 420 ${(a + b) / 2} 424 C ${(a + b) / 2 + 8} 420 ${b - 8} 400 ${b} 366 Z`} fill="#F7EBDD" stroke={MUS.dark} strokeWidth={3.5} />
          ))}
        </g>
        {/* conduction system */}
        {P_INTER.map((d, i) => (
          <Wire key={i} d={d} i={0} width={i === 2 ? 6 : 7} />
        ))}
        <Wire d={P_HIS} i={2} width={13} />
        <Wire d={P_RBB} i={3} width={10} />
        <Wire d={P_LBB} i={3} width={10} />
        <Wire d={P_PURK_R} i={4} width={8} />
        <Wire d={P_PURK_L} i={4} width={8} />
        {[...TWIGS_R, ...TWIGS_L].map(([x1, y1, x2, y2], i) => {
          const p = lit[4] ?? 0;
          return <line key={i} x1={x1} y1={y1} x2={x1 + (x2 - x1) * Math.min(1, p * 1.4)} y2={y1 + (y2 - y1) * Math.min(1, p * 1.4)} stroke={p > 0 ? STEP_COL[4] : "#7A5A50"} strokeWidth={5} strokeLinecap="round" opacity={0.4 + 0.6 * p} />;
        })}
        {node(252, 202, 26, 18, 0)}
        {node(418, 338, 22, 15, 1)}
        {pulse >= 0 && pulse <= 1 && (
          <g>
            <circle cx={px} cy={py} r={30} fill={C.banana} opacity={0.35} />
            <circle cx={px} cy={py} r={14} fill="#FFFBE6" stroke={C.forest} strokeWidth={4} />
          </g>
        )}
        {tags > 0 && (
          <g opacity={tags} fontFamily={FONT} fontWeight={800} fontSize={25} fill={C.forest} textAnchor="middle" letterSpacing={1}>
            <text x={300} y={322}>RIGHT ATRIUM</text>
            <text x={590} y={300}>LEFT ATRIUM</text>
            <text x={300} y={430}>RV</text>
            <text x={588} y={470}>LV</text>
          </g>
        )}
      </g>
    </svg>
  );
};

/* A small speed dial: needle swings between slower and faster */
export const SpeedDial: React.FC<{ t: number; w?: number; k: number }> = ({ t, w = 360, k }) => {
  const a = -60 + 120 * k + Math.sin(t * 3) * 4;
  return (
    <svg width={w} height={w * 0.66} viewBox="0 0 300 200">
      <path d="M30 170 A 120 120 0 0 1 270 170" fill="none" stroke={C.line} strokeWidth={30} strokeLinecap="round" />
      <path d="M30 170 A 120 120 0 0 1 150 50" fill="none" stroke="#7FC3E0" strokeWidth={30} strokeLinecap="round" />
      <path d="M150 50 A 120 120 0 0 1 270 170" fill="none" stroke={C.red} strokeWidth={30} strokeLinecap="round" />
      <g transform={`rotate(${a} 150 170)`}>
        <path d="M144 170 L 150 70 L 156 170 Z" fill={C.forest} />
      </g>
      <circle cx={150} cy={170} r={16} fill={C.banana} stroke={C.forest} strokeWidth={5} />
      <text x={34} y={198} fontFamily={FONT} fontWeight={800} fontSize={20} fill={C.forest} textAnchor="middle">slower</text>
      <text x={266} y={198} fontFamily={FONT} fontWeight={800} fontSize={20} fill={C.forest} textAnchor="middle">faster</text>
    </svg>
  );
};

/* simple brain outline with a "not needed" slash */
export const BrainNo: React.FC<{ w?: number; slash: number }> = ({ w = 200, slash }) => (
  <svg width={w} height={w * 0.8} viewBox="0 0 250 200">
    <path d="M60 150 C 20 150 10 110 30 90 C 10 60 40 25 75 35 C 90 5 140 5 155 30 C 190 15 230 45 215 80 C 245 100 230 150 190 150 C 180 175 140 178 125 160 C 110 178 70 175 60 150 Z" fill="#F3C9C0" stroke={C.forest} strokeWidth={7} />
    <path d="M75 60 C 95 75 90 95 110 100 M140 50 C 130 75 150 90 170 85 M70 115 C 95 110 110 130 130 125 M160 115 C 175 125 190 120 200 105" fill="none" stroke="#C98F86" strokeWidth={6} strokeLinecap="round" />
    {slash > 0 && (
      <g opacity={slash}>
        <circle cx={125} cy={100} r={92} fill="none" stroke={C.red} strokeWidth={14} />
        <line x1={60} y1={35} x2={60 + 130 * slash} y2={35 + 130 * slash} stroke={C.red} strokeWidth={14} strokeLinecap="round" />
      </g>
    )}
  </svg>
);
