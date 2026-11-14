import React from "react";
import { C, FONT, ramp } from "./kit";

/* Book Plume's own coronary-artery diagram (viewBox 1000 x 1000).
   Front = sternocostal surface (patient's right = viewer's left), Back = diaphragmatic/posterior surface. */
export type HB = "LCA" | "CX" | "LAD" | "RCA" | "RM" | "PDA";
export const HORDER: HB[] = ["CX", "LAD", "RM", "PDA"];
export const HNAME: Record<HB, string> = {
  LCA: "Left coronary artery",
  CX: "Circumflex",
  LAD: "LAD",
  RCA: "Right coronary artery",
  RM: "Right marginal",
  PDA: "Posterior descending",
};
export const HCOL: Record<HB, string> = { LCA: C.red, CX: "#E8796B", LAD: C.red, RCA: C.matcha, RM: "#8FA86A", PDA: C.matcha };
export const HCUE: Record<HB, string> = { LCA: "", CX: "around", LAD: "down", RCA: "", RM: "edge", PDA: "back" };

type V = { k: HB; d: string; w: number; sub?: boolean };
/* ---------- front view ---------- */
const FRONT: V[] = [
  { k: "RCA", d: "M 440 372 C 400 384 345 420 318 488 C 296 548 298 624 312 690 C 318 716 322 738 326 762", w: 17 },
  { k: "RM", d: "M 315 712 C 380 760 470 800 585 836 C 625 848 660 858 690 864", w: 12 },
  { k: "RM", d: "M 420 778 C 430 740 438 705 440 668", w: 6, sub: true },
  { k: "RM", d: "M 510 812 C 525 775 535 742 540 705", w: 6, sub: true },
  { k: "RCA", d: "M 318 520 C 350 515 380 520 405 535", w: 6, sub: true },
  { k: "LCA", d: "M 506 372 C 528 400 562 404 604 394", w: 18 },
  { k: "LAD", d: "M 604 394 C 616 480 640 562 662 650 C 680 726 700 800 724 872", w: 16 },
  { k: "LAD", d: "M 628 515 C 680 535 732 560 782 604", w: 7, sub: true },
  { k: "LAD", d: "M 656 640 C 702 662 742 694 772 738", w: 7, sub: true },
  { k: "LAD", d: "M 618 470 C 590 490 565 505 540 512", w: 6, sub: true },
  { k: "LAD", d: "M 648 600 C 618 622 596 640 575 650", w: 6, sub: true },
  { k: "CX", d: "M 604 394 C 662 406 732 412 790 432 C 820 442 842 456 856 472", w: 15 },
  { k: "CX", d: "M 800 436 C 816 500 830 560 836 622", w: 8, sub: true },
];
/* ---------- back view ---------- */
const BACK: V[] = [
  { k: "RCA", d: "M 820 478 C 740 458 640 452 548 458", w: 17 },
  { k: "PDA", d: "M 548 458 C 528 560 470 690 350 812", w: 15 },
  { k: "PDA", d: "M 515 580 C 560 600 600 630 630 668", w: 6, sub: true },
  { k: "PDA", d: "M 470 680 C 430 690 395 700 360 700", w: 6, sub: true },
  { k: "CX", d: "M 200 476 C 260 462 340 456 425 456", w: 13 },
  { k: "CX", d: "M 285 466 C 275 540 272 600 280 660", w: 7, sub: true },
];

const grow = (t: number, t0?: number) => (t0 === undefined ? 0 : ramp(t, t0, t0 + 0.55));

const Vessels: React.FC<{ vs: V[]; t: number; lit: Partial<Record<HB, number>>; hot: HB[]; ghost?: boolean }> = ({ vs, t, lit, hot, ghost }) => (
  <g>
    {/* base network, always visible */}
    {vs.map((v, i) => (
      <path key={`b${i}`} d={v.d} fill="none" stroke={ghost ? "rgba(31,42,20,0.22)" : "#B4655A"} strokeWidth={v.w * 0.62} strokeLinecap="round" opacity={ghost ? 1 : 0.55} />
    ))}
    {/* banana halo on the hot branch */}
    {vs.map((v, i) => {
      const g = grow(t, lit[v.k]);
      if (!hot.includes(v.k) || g <= 0 || v.sub) return null;
      return <path key={`h${i}`} d={v.d} fill="none" stroke={C.banana} strokeWidth={v.w + 26} strokeLinecap="round" pathLength={1} strokeDasharray={`${g} 1`} opacity={0.95} />;
    })}
    {vs.map((v, i) => {
      const g = grow(t, lit[v.k]);
      if (g <= 0) return null;
      return (
        <g key={`l${i}`}>
          <path d={v.d} fill="none" stroke={C.forest} strokeWidth={v.w + 6} strokeLinecap="round" pathLength={1} strokeDasharray={`${g} 1`} />
          <path d={v.d} fill="none" stroke={C.red} strokeWidth={v.w} strokeLinecap="round" pathLength={1} strokeDasharray={`${g} 1`} />
          <path d={v.d} fill="none" stroke="#F6C1B8" strokeWidth={Math.max(2, v.w * 0.22)} strokeLinecap="round" pathLength={1} strokeDasharray={`${g} 1`} transform="translate(-2 -3)" opacity={0.8} />
        </g>
      );
    })}
  </g>
);

const Hatch: React.FC<{ id: string; clip: string }> = ({ id, clip }) => (
  <g clipPath={`url(#${clip})`} opacity={0.18}>
    {Array.from({ length: 46 }).map((_, i) => (
      <path key={i} d={`M ${-100 + i * 26} 1000 C ${0 + i * 26} 700 ${80 + i * 26} 400 ${260 + i * 26} 200`} fill="none" stroke={C.forest} strokeWidth={1.6} />
    ))}
    <rect id={id} width={0} height={0} />
  </g>
);

const FrontHeart: React.FC<{ t: number; id: string; lit: Partial<Record<HB, number>>; hot: HB[]; ghost?: boolean; labels?: boolean }> = ({ t, id, lit, hot, ghost, labels }) => {
  const body = "M 300 338 C 222 368 192 470 205 560 C 220 652 300 732 420 790 C 540 848 650 892 735 882 C 792 874 832 820 848 740 C 866 630 852 500 802 422 C 762 362 690 334 620 330 C 520 326 380 318 300 338 Z";
  return (
    <g>
      <defs>
        <radialGradient id={`${id}m`} cx="0.42" cy="0.4" r="0.7">
          <stop offset="0" stopColor={ghost ? "#FFFEF6" : "#F2CBB8"} />
          <stop offset="0.65" stopColor={ghost ? "#F3F1E2" : "#DDA28E"} />
          <stop offset="1" stopColor={ghost ? "#E4E2CF" : "#B97A68"} />
        </radialGradient>
        <linearGradient id={`${id}ao`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#D9897C" />
          <stop offset="0.45" stopColor="#F2B6AA" />
          <stop offset="1" stopColor="#C46F62" />
        </linearGradient>
        <linearGradient id={`${id}pt`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8EA2BC" />
          <stop offset="0.5" stopColor="#B9C8DA" />
          <stop offset="1" stopColor="#7F93AD" />
        </linearGradient>
        <clipPath id={`${id}c`}><path d={body} /></clipPath>
      </defs>
      {/* superior vena cava */}
      <path d="M 282 352 L 282 112 Q 282 96 298 96 L 350 96 Q 366 96 366 112 L 366 340 Z" fill={ghost ? "#EDEBDD" : "url(#" + id + "pt)"} stroke={C.forest} strokeWidth={5} />
      <ellipse cx={324} cy={100} rx={42} ry={12} fill={ghost ? "#E4E2CF" : "#5E6F86"} stroke={C.forest} strokeWidth={4} />
      {/* aorta: rises, arches back */}
      <path d="M 432 372 C 426 290 424 214 440 162 C 462 100 540 70 612 84 C 684 100 724 150 728 214 L 664 220 C 660 174 636 148 600 142 C 552 136 512 160 502 212 C 494 262 496 318 508 372 Z" fill={ghost ? "#F3F1E2" : `url(#${id}ao)`} stroke={C.forest} strokeWidth={5} />
      <ellipse cx={696} cy={217} rx={33} ry={10} fill={ghost ? "#E4E2CF" : "#8F3F35"} stroke={C.forest} strokeWidth={4} />
      {[470, 520, 568].map((x, i) => (
        <path key={i} d={`M ${x} ${118 - i * 10} C ${x - 6} ${80 - i * 8} ${x - 4} ${60 - i * 6} ${x + 4} ${44 - i * 4}`} fill="none" stroke={C.forest} strokeWidth={22} strokeLinecap="round" opacity={ghost ? 0.15 : 0.9} />
      ))}
      {[470, 520, 568].map((x, i) => (
        <path key={`i${i}`} d={`M ${x} ${118 - i * 10} C ${x - 6} ${80 - i * 8} ${x - 4} ${60 - i * 6} ${x + 4} ${44 - i * 4}`} fill="none" stroke={ghost ? "#F3F1E2" : "#E7A296"} strokeWidth={13} strokeLinecap="round" />
      ))}
      {/* heart body */}
      <path d={body} fill={`url(#${id}m)`} stroke={C.forest} strokeWidth={6} />
      {!ghost && <Hatch id={`${id}h`} clip={`${id}c`} />}
      {/* right atrium + auricle */}
      <path d="M 372 346 C 300 336 246 366 226 432 C 212 494 226 566 272 618 C 290 606 300 596 306 590 C 292 520 302 430 372 366 Z" fill={ghost ? "#F3F1E2" : "#E4AE9C"} stroke={C.forest} strokeWidth={4} opacity={0.95} />
      <path d="M 366 352 C 398 330 444 338 452 366 C 430 392 386 392 364 376 Z" fill={ghost ? "#EDEBDD" : "#D99886"} stroke={C.forest} strokeWidth={4} />
      {/* aortic root: both coronary arteries start here (aortic sinuses) */}
      <path d="M 428 372 C 430 344 452 332 472 332 C 494 332 512 344 512 372 C 498 384 444 384 428 372 Z" fill={ghost ? "#F3F1E2" : `url(#${id}ao)`} stroke={C.forest} strokeWidth={4} />
      {/* left auricle */}
      <path d="M 640 364 C 682 334 764 334 794 374 C 806 400 774 414 742 410 C 702 404 664 398 640 384 Z" fill={ghost ? "#EDEBDD" : "#D3907E"} stroke={C.forest} strokeWidth={4} />
      {/* pulmonary trunk (in front of the aorta) */}
      <path d="M 522 392 C 526 330 542 266 576 220 C 592 198 622 188 652 192 L 706 206 L 694 254 L 652 244 C 626 244 612 272 606 302 C 600 332 600 364 606 398 Z" fill={ghost ? "#EDEBDD" : `url(#${id}pt)`} stroke={C.forest} strokeWidth={5} />
      <ellipse cx={700} cy={230} rx={11} ry={25} fill={ghost ? "#E4E2CF" : "#4F607A"} stroke={C.forest} strokeWidth={4} />
      {/* grooves */}
      <path d="M 604 400 C 616 482 640 562 662 650 C 680 726 700 800 724 872" fill="none" stroke={C.forest} strokeWidth={3} strokeDasharray="2 12" strokeLinecap="round" opacity={0.45} />
      <Vessels vs={FRONT} t={t} lit={lit} hot={hot} ghost={ghost} />
      {labels && (
        <g fontFamily={FONT} fontWeight={800} fill={C.forest} opacity={0.5}>
          <text x={470} y={640} fontSize={34} textAnchor="middle">RV</text>
          <text x={770} y={790} fontSize={34} textAnchor="middle">LV</text>
          <text x={262} y={500} fontSize={30} textAnchor="middle">RA</text>
          <text x={468} y={300} fontSize={24} textAnchor="middle" fill={C.paper} opacity={0}>aorta</text>
        </g>
      )}
    </g>
  );
};

const BackHeart: React.FC<{ t: number; id: string; lit: Partial<Record<HB, number>>; hot: HB[]; labels?: boolean }> = ({ t, id, lit, hot, labels }) => {
  const body = "M 762 384 C 822 444 834 544 808 632 C 772 732 642 802 472 842 C 402 858 332 852 300 826 C 258 790 218 700 208 600 C 198 500 214 422 270 384 C 400 342 652 342 762 384 Z";
  return (
    <g>
      <defs>
        <radialGradient id={`${id}mb`} cx="0.55" cy="0.45" r="0.7">
          <stop offset="0" stopColor="#EFC4B0" />
          <stop offset="0.65" stopColor="#D69B86" />
          <stop offset="1" stopColor="#AE705F" />
        </radialGradient>
        <clipPath id={`${id}cb`}><path d={body} /></clipPath>
      </defs>
      {/* aorta behind, cut */}
      <path d="M 420 360 L 420 150 Q 420 120 450 120 L 520 120 Q 550 120 550 150 L 550 360 Z" fill="#E7A296" stroke={C.forest} strokeWidth={5} />
      <ellipse cx={485} cy={124} rx={65} ry={16} fill="#8F3F35" stroke={C.forest} strokeWidth={4} />
      {/* SVC */}
      <path d="M 640 372 L 640 170 Q 640 150 660 150 L 712 150 Q 732 150 732 170 L 732 380 Z" fill="#9DB0C7" stroke={C.forest} strokeWidth={5} />
      <ellipse cx={686} cy={154} rx={46} ry={13} fill="#5E6F86" stroke={C.forest} strokeWidth={4} />
      <path d={body} fill={`url(#${id}mb)`} stroke={C.forest} strokeWidth={6} />
      <g clipPath={`url(#${id}cb)`} opacity={0.16}>
        {Array.from({ length: 46 }).map((_, i) => (
          <path key={i} d={`M ${1100 - i * 26} 1000 C ${1000 - i * 26} 700 ${920 - i * 26} 400 ${740 - i * 26} 200`} fill="none" stroke={C.forest} strokeWidth={1.6} />
        ))}
      </g>
      {/* atria above the coronary groove */}
      <path d="M 232 470 C 236 410 300 372 420 362 C 560 354 720 362 790 410 C 812 430 820 452 822 474 C 650 450 380 448 232 470 Z" fill="#E3AC99" stroke={C.forest} strokeWidth={4} />
      {/* pulmonary veins */}
      {[[330, 392], [400, 380], [560, 380], [620, 392]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx={24} ry={17} fill="#8F3F35" stroke={C.forest} strokeWidth={4} />
      ))}
      {/* IVC */}
      <ellipse cx={720} cy={470} rx={36} ry={22} fill="#5E6F86" stroke={C.forest} strokeWidth={4} />
      {/* coronary sinus (vein, under the arteries) */}
      <path d="M 260 482 C 400 470 560 468 690 476" fill="none" stroke="#7F93AD" strokeWidth={22} strokeLinecap="round" opacity={0.85} />
      {/* posterior interventricular groove */}
      <path d="M 548 462 C 528 560 470 690 350 812" fill="none" stroke={C.forest} strokeWidth={3} strokeDasharray="2 12" strokeLinecap="round" opacity={0.45} />
      <Vessels vs={BACK} t={t} lit={lit} hot={hot} />
      {labels && (
        <g fontFamily={FONT} fontWeight={800} fill={C.forest} opacity={0.5}>
          <text x={390} y={650} fontSize={34} textAnchor="middle">LV</text>
          <text x={660} y={640} fontSize={34} textAnchor="middle">RV</text>
          <text x={490} y={420} fontSize={28} textAnchor="middle">LA</text>
        </g>
      )}
    </g>
  );
};

/** back: 0 = front view, 1 = back view (flips around the vertical axis) */
export const Heart: React.FC<{ t: number; w: number; id: string; lit?: Partial<Record<HB, number>>; hot?: HB[]; back?: number; ghost?: boolean; labels?: boolean }> = ({ t, w, id, lit = {}, hot = [], back = 0, ghost, labels = true }) => {
  const sx = Math.max(0.02, Math.abs(Math.cos(Math.PI * back)));
  const showBack = back > 0.5;
  return (
    <svg width={w} height={w} viewBox="0 0 1000 1000" style={{ overflow: "visible" }}>
      <g transform={`translate(500 0) scale(${sx} 1) translate(-500 0)`}>
        {showBack ? <BackHeart t={t} id={id} lit={lit} hot={hot} labels={labels} /> : <FrontHeart t={t} id={id} lit={lit} hot={hot} ghost={ghost} labels={labels} />}
      </g>
    </svg>
  );
};

/* anchor points (viewBox) for callouts */
export const HANCH_F: Partial<Record<HB, [number, number]>> = { LCA: [560, 400], CX: [760, 424], LAD: [672, 690], RCA: [302, 560], RM: [500, 806] };
export const HANCH_B: Partial<Record<HB, [number, number]>> = { RCA: [700, 462], PDA: [470, 690], CX: [330, 460] };
