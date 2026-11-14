import React from "react";
import { C, FONT, ramp } from "./kit";

/* Book Plume diagram: RIGHT side of the neck, head facing right (like Gray's 1918 Fig. 805).
   Cervical plexus (anterior rami C1–C4). The 4 cutaneous branches emerge together at Erb's point
   (nerve point of the neck) = middle of the posterior border of sternocleidomastoid:
     LO  lesser occipital (C2)        → UP + back along the posterior border of SCM → scalp behind the ear
     GA  great auricular (C2–C3)      → UP across SCM → ear + skin over the parotid / angle of the jaw
     TC  transverse cervical (C2–C3)  → ACROSS SCM → skin of the front of the neck
     SC  supraclavicular (C3–C4)      → DOWN (anterior, middle, posterior) → over the clavicle, upper chest + shoulder
   Facts: TeachMeAnatomy "The Cervical Plexus"; Radiopaedia "Cervical plexus"; Gray 1918 pp. 926–928, Figs. 804–805.
   viewBox 900 x 1000. */

export type N = "LO" | "GA" | "TC" | "SC";
export const NORDER: N[] = ["LO", "GA", "TC", "SC"];
export const NCOL: Record<N, string> = { LO: "#4F9CC4", GA: "#D9708C", TC: "#E0A53A", SC: "#7FAE4E" };
export const NARROW: Record<N, string> = { LO: "↑", GA: "↑", TC: "→", SC: "↓" };

export const ERB: [number, number] = [478, 612];
const E = `${ERB[0]} ${ERB[1]}`;
const PATHS: Record<N, string[]> = {
  LO: [`M${E} C 440 560, 405 470, 380 380 C 362 318, 335 262, 300 205`, "M 352 300 C 330 270, 300 262, 268 262", "M 318 232 C 322 200, 336 176, 350 150"],
  GA: [`M${E} C 520 548, 520 470, 492 410 C 478 382, 462 366, 452 352`, "M 488 404 C 520 410, 548 432, 566 458", "M 462 366 C 445 345, 430 330, 418 312"],
  TC: [`M${E} C 540 640, 590 660, 636 664`, "M 626 662 C 646 650, 660 636, 672 620", "M 626 666 C 646 680, 660 700, 676 720"],
  SC: [`M${E} C 430 680, 360 780, 300 900`, `M${E} C 480 700, 480 800, 480 920`, `M${E} C 540 690, 620 790, 660 900`],
};
/* label anchors (viewBox) */
export const ANCHOR = {
  LO: [372, 360] as [number, number],
  GA: [508, 462] as [number, number],
  TC: [590, 656] as [number, number],
  SC: [480, 860] as [number, number],
  SCM: [520, 520] as [number, number],
  CLAV: [300, 822] as [number, number],
  ERB: ERB,
  EAR: [440, 300] as [number, number],
};

const Nerve: React.FC<{ d: string; col: string; p: number; hot: boolean; w: number }> = ({ d, col, p, hot, w }) => p <= 0.01 ? null : (
  <g>
    {hot && <path d={d} fill="none" stroke={C.banana} strokeWidth={w + 18} strokeLinecap="round" opacity={0.85 * p} pathLength={1} strokeDasharray={`${p} 2`} />}
    <path d={d} fill="none" stroke={C.forest} strokeWidth={w + 7} strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 2`} />
    <path d={d} fill="none" stroke={col} strokeWidth={w} strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 2`} />
  </g>
);

export const Neck: React.FC<{
  t: number;
  w: number;
  id: string;
  lit?: Partial<Record<N, number>>;
  hot?: N[];
  ghost?: number;
  erb?: number;
  scm?: number;
  dim?: number;
}> = ({ t, w, id, lit = {}, hot = [], ghost = 0.0, erb = 0, scm = 0, dim = 0 }) => {
  const h = (w * 1000) / 900;
  const muscle = "#E7B7A8", muscleLine = "#C98C7C";
  return (
    <svg width={w} height={h} viewBox="0 0 900 1000" style={{ display: "block" }}>
      <defs>
        <clipPath id={`body${id}`}>
          <path d="M 236 340 C 190 200, 280 36, 452 30 C 606 26, 706 110, 724 222 L 738 300 L 764 360 L 806 438 L 768 462 L 772 500 L 758 540 C 772 584, 752 612, 716 614 C 686 616, 662 622, 648 640 C 660 720, 690 790, 708 846 L 900 900 L 900 1000 L 0 1000 L 0 860 C 150 830, 240 760, 268 650 C 282 540, 262 430, 236 340 Z" />
        </clipPath>
        <pattern id={`stri${id}`} width={14} height={14} patternUnits="userSpaceOnUse" patternTransform="rotate(-62)">
          <line x1={0} y1={0} x2={0} y2={14} stroke={muscleLine} strokeWidth={2.4} opacity={0.55} />
        </pattern>
        <pattern id={`stri2${id}`} width={16} height={16} patternUnits="userSpaceOnUse" patternTransform="rotate(-25)">
          <line x1={0} y1={0} x2={0} y2={16} stroke={muscleLine} strokeWidth={2} opacity={0.45} />
        </pattern>
      </defs>
      {/* skin */}
      <g clipPath={`url(#body${id})`}>
        <rect width={900} height={1000} fill="#F4E3D3" />
        {/* trapezius (back) */}
        <path d="M 0 860 C 130 830, 220 760, 262 640 C 280 560, 270 470, 250 380 L 300 430 C 280 560, 230 700, 190 800 L 120 1000 L 0 1000 Z" fill={muscle} opacity={0.75} />
        <path d="M 0 860 C 130 830, 220 760, 262 640 C 280 560, 270 470, 250 380 L 300 430 C 280 560, 230 700, 190 800 L 120 1000 L 0 1000 Z" fill={`url(#stri2${id})`} />
        {/* posterior triangle floor */}
        <path d="M 300 430 L 400 380 L 600 852 L 190 800 C 230 700, 280 560, 300 430 Z" fill="#EBCDB8" opacity={0.8} />
        {/* SCM */}
        <path d="M 392 368 C 420 352, 448 352, 470 362 L 700 838 L 640 856 L 600 852 C 540 700, 470 540, 392 368 Z" fill={muscle} />
        <path d="M 392 368 C 420 352, 448 352, 470 362 L 700 838 L 640 856 L 600 852 C 540 700, 470 540, 392 368 Z" fill={`url(#stri${id})`} />
        <path d="M 392 368 C 470 540, 540 700, 600 852" fill="none" stroke={scm > 0 ? C.forest : muscleLine} strokeWidth={scm > 0 ? 3 + 5 * scm : 3} strokeDasharray={scm > 0 ? "14 10" : "none"} />
        {/* external jugular vein */}
        <path d="M 498 436 C 500 540, 486 680, 440 812" fill="none" stroke={C.forest} strokeWidth={13} strokeLinecap="round" opacity={0.5} />
        <path d="M 498 436 C 500 540, 486 680, 440 812" fill="none" stroke="#6E8FC7" strokeWidth={8} strokeLinecap="round" opacity={0.8} />
        {/* clavicle */}
        <path d="M 150 812 C 260 790, 420 836, 560 846 C 620 850, 680 846, 760 858" fill="none" stroke={C.forest} strokeWidth={40} strokeLinecap="round" />
        <path d="M 150 812 C 260 790, 420 836, 560 846 C 620 850, 680 846, 760 858" fill="none" stroke="#FFF6DD" strokeWidth={30} strokeLinecap="round" />
        {/* jaw line */}
        <path d="M 468 370 C 476 404, 482 432, 492 452 C 560 560, 650 604, 716 606" fill="none" stroke="#C9A891" strokeWidth={5} strokeLinecap="round" />
        {/* ghost nerves */}
        {ghost > 0 && NORDER.map((k) => PATHS[k].map((d, i) => <path key={k + i} d={d} fill="none" stroke={C.forest} strokeWidth={6} strokeLinecap="round" strokeDasharray="4 12" opacity={ghost} />))}
        {/* nerves */}
        {NORDER.map((k) => {
          const t0 = lit[k];
          if (t0 === undefined) return null;
          const p0 = t0 <= 0 ? 1 : ramp(t, t0, t0 + 0.45);
          const isHot = hot.includes(k);
          const fade = !isHot && hot.length > 0 ? 1 - 0.55 * dim : 1;
          return (
            <g key={k} opacity={fade}>
              {PATHS[k].map((d, i) => (
                <Nerve key={i} d={d} col={NCOL[k]} p={i === 0 ? p0 : t0 <= 0 ? 1 : ramp(t, t0 + 0.3, t0 + 0.6)} hot={isHot} w={i === 0 ? 11 : 8} />
              ))}
            </g>
          );
        })}
      </g>
      {/* outline */}
      <path d="M 236 340 C 190 200, 280 36, 452 30 C 606 26, 706 110, 724 222 L 738 300 L 764 360 L 806 438 L 768 462 L 772 500 L 758 540 C 772 584, 752 612, 716 614 C 686 616, 662 622, 648 640 C 660 720, 690 790, 708 846 L 900 900" fill="none" stroke={C.forest} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" />
      <path d="M 0 860 C 150 830, 240 760, 268 650 C 282 540, 262 430, 236 340" fill="none" stroke={C.forest} strokeWidth={7} strokeLinecap="round" />
      {/* ear */}
      <path d="M 452 352 C 410 360, 396 320, 404 270 C 410 230, 440 220, 468 232 C 492 244, 492 290, 480 320 C 472 340, 470 350, 452 352 Z" fill="#F0D2BE" stroke={C.forest} strokeWidth={6} />
      <path d="M 448 330 C 430 320, 428 280, 440 262 C 452 248, 470 256, 468 282" fill="none" stroke={C.forest} strokeWidth={4} strokeLinecap="round" opacity={0.6} />
      {/* eye */}
      <path d="M 640 290 C 660 278, 690 278, 706 292" fill="none" stroke={C.forest} strokeWidth={6} strokeLinecap="round" />
      {/* Erb's point */}
      {erb > 0 && (
        <g opacity={erb}>
          <circle cx={ERB[0]} cy={ERB[1]} r={26 + 10 * Math.sin(t * 6)} fill="none" stroke={C.red} strokeWidth={5} opacity={0.7} />
          <circle cx={ERB[0]} cy={ERB[1]} r={15} fill={C.red} stroke={C.forest} strokeWidth={5} />
        </g>
      )}
      {erb <= 0 && Object.keys(lit).length > 0 && <circle cx={ERB[0]} cy={ERB[1]} r={11} fill={C.banana} stroke={C.forest} strokeWidth={4} />}
    </svg>
  );
};

/* Phrenic nerve diagram: C3, C4, C5 roots join → down to the diaphragm. viewBox 820 x 760 */
export const Phrenic: React.FC<{ t: number; w: number; r3: number; r4: number; r5: number; down: number; dia: number }> = ({ t, w, r3, r4, r5, down, dia }) => {
  const h = (w * 760) / 820;
  const pr = (t0: number) => ramp(t, t0, t0 + 0.3);
  const vs = [1, 2, 3, 4, 5, 6, 7];
  const vy = (i: number) => 40 + (i - 1) * 62;
  const col = "#9C7BD0";
  const nerve = "M 300 320 C 330 360, 360 420, 380 500 C 395 560, 400 610, 410 660";
  const glow = 0.5 + 0.5 * Math.sin(t * 7);
  return (
    <svg width={w} height={h} viewBox="0 0 820 760" style={{ display: "block" }}>
      {/* spine */}
      {vs.map((i) => (
        <g key={i}>
          <rect x={120} y={vy(i)} width={90} height={48} rx={12} fill="#FFF6DD" stroke={C.forest} strokeWidth={5} />
          <text x={165} y={vy(i) + 33} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.forest} opacity={i >= 3 && i <= 5 ? 1 : 0.45}>C{i}</text>
        </g>
      ))}
      {/* roots */}
      {[3, 4, 5].map((i) => {
        const p = pr(i === 3 ? r3 : i === 4 ? r4 : r5);
        const d = `M 210 ${vy(i) + 24} C 250 ${vy(i) + 24}, 280 ${vy(i) + 40}, 300 320`;
        if (p <= 0.01) return null;
        return (
          <g key={i}>
            <path d={d} fill="none" stroke={C.forest} strokeWidth={17} strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 2`} />
            <path d={d} fill="none" stroke={col} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 2`} />
          </g>
        );
      })}
      {/* diaphragm */}
      <path d="M 120 720 C 160 600, 300 590, 410 660 C 520 590, 690 600, 740 720" fill="none" stroke={C.forest} strokeWidth={30} strokeLinecap="round" />
      <path d="M 120 720 C 160 600, 300 590, 410 660 C 520 590, 690 600, 740 720" fill="none" stroke={dia > 0.3 ? C.banana : "#E7B7A8"} opacity={dia > 0.3 ? 0.85 + 0.15 * glow : 1} strokeWidth={20} strokeLinecap="round" />
      {/* phrenic trunk */}
      {pr(down) > 0.01 && <path d={nerve} fill="none" stroke={C.forest} strokeWidth={19} strokeLinecap="round" pathLength={1} strokeDasharray={`${pr(down)} 2`} />}
      {pr(down) > 0.01 && <path d={nerve} fill="none" stroke={col} strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray={`${pr(down)} 2`} />}
      {pr(down) > 0.95 && (
        <g>
          {[[-60, 20], [-20, 34], [30, 30], [70, 14]].map(([dx, dy], i) => (
            <path key={i} d={`M 410 660 Q ${410 + dx / 2} ${660 + dy / 2} ${410 + dx} ${660 + dy - 30}`} fill="none" stroke={col} strokeWidth={6} strokeLinecap="round" opacity={dia} />
          ))}
        </g>
      )}
    </svg>
  );
};
