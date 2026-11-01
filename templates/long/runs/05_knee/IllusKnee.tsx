import React from "react";
import { C, FONT, ramp } from "./kit";

/* ======================================================================
   Book Plume own illustrations for "Knee Joint Anatomy Made Easy".
   KneeFront  = RIGHT knee, front view (lateral = viewer's left, medial = right).
   KneeSide   = sagittal schematic, front of the knee on the RIGHT.
   MenisciTop = RIGHT tibial plateau from above, front at the top (medial = left).
   `lit` maps a part id -> time (s) it lights up (or {a,b} window).
   ====================================================================== */

export const KC = {
  bone: "url(#kBone)",
  boneLine: "#7C6B45",
  lig: "#D9B48F",
  ligLine: "#8A6440",
  men: "#9CC6BE",
  menLine: "#3F6F66",
  bursa: "#A9CFE0",
  bursaLine: "#43788F",
  muscle: "#D98C7C",
  muscleLine: "#8F3F33",
};

type Win = { a: number; b?: number };
export type Lit = Record<string, Win | number | undefined>;
export const win = (t: number, w?: Win | number) => {
  if (w === undefined) return 0;
  const a = typeof w === "number" ? w : w.a;
  const b = typeof w === "number" ? undefined : w.b;
  return ramp(t, a, a + 0.3) * (b === undefined ? 1 : 1 - ramp(t, b, b + 0.3));
};
const mix = (a: string, b: string, k: number) => {
  const p = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const x = p(a), y = p(b);
  return "#" + x.map((v, i) => Math.round(v + (y[i] - v) * k).toString(16).padStart(2, "0")).join("");
};

export const KDefs: React.FC = () => (
  <defs>
    <linearGradient id="kBone" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#D6C79E" />
      <stop offset="40%" stopColor="#FBF6E6" />
      <stop offset="100%" stopColor="#CBBB8E" />
    </linearGradient>
    <radialGradient id="kLit" cx="40%" cy="35%" r="75%">
      <stop offset="0%" stopColor="#FFFAE0" />
      <stop offset="60%" stopColor="#F7E39A" />
      <stop offset="100%" stopColor="#E3C25A" />
    </radialGradient>
    <pattern id="kSpongy" width="14" height="14" patternUnits="userSpaceOnUse">
      <circle cx="4" cy="5" r="1.6" fill="#B9A97C" opacity="0.5" />
      <circle cx="11" cy="11" r="1.3" fill="#B9A97C" opacity="0.4" />
    </pattern>
    <pattern id="kFiber" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(80)">
      <line x1="0" y1="0" x2="0" y2="10" stroke="#8A6440" strokeWidth="1.2" opacity="0.35" />
    </pattern>
    <filter id="kSh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#1F2A14" floodOpacity="0.2" />
    </filter>
    <filter id="kGlow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="10" />
    </filter>
  </defs>
);

/** a part that glows banana when lit */
const Part: React.FC<{ d: string; base: string; line: string; k: number; sw?: number; dim?: number; litCol?: string; pattern?: string; op?: number }> = ({ d, base, line, k, sw = 4, dim = 1, litCol, pattern, op = 1 }) => (
  <g opacity={op * (dim + (1 - dim) * Math.max(k, 0))}>
    {k > 0.01 && <path d={d} fill={litCol || C.banana} opacity={0.55 * k} filter="url(#kGlow)" />}
    <path d={d} fill={k > 0.5 && !litCol ? "url(#kLit)" : k > 0 && litCol ? mix(base.startsWith("#") ? base : "#F2EAD0", litCol, k) : base} stroke={k > 0 ? mix(line, C.forest, k) : line} strokeWidth={sw} strokeLinejoin="round" />
    {pattern && <path d={d} fill={pattern} opacity={0.8} />}
  </g>
);

/* ---------------- KneeFront geometry (viewBox 0 0 800 940) ---------------- */
const F_FEMUR = "M318 0 L482 0 L486 250 C490 312 560 332 612 362 C664 394 668 472 642 532 C626 572 586 592 540 592 C490 592 456 562 441 522 L431 474 C424 452 376 452 369 474 L359 522 C344 562 310 592 260 592 C214 592 174 572 158 532 C132 472 136 394 188 362 C240 332 310 312 314 250 Z";
const F_LATC = "M369 474 L359 522 C344 562 310 592 260 592 C214 592 174 572 158 532 C138 476 150 420 192 394 C252 378 330 400 369 474 Z";
const F_MEDC = "M431 474 L441 522 C456 562 490 592 540 592 C586 592 626 572 642 532 C662 476 650 420 608 394 C548 378 470 400 431 474 Z";
const F_TIBIA = "M150 628 C150 606 200 602 260 606 L368 608 L384 588 L396 606 L406 606 L418 586 L432 608 L540 606 C600 602 652 606 652 628 C654 682 622 722 584 750 C544 780 512 812 502 862 L496 940 L330 940 L322 862 C312 812 270 782 226 752 C182 722 150 682 150 628 Z";
const F_FIB = "M118 690 C114 666 142 652 170 660 C194 668 198 692 184 708 L174 724 L170 940 L140 940 L138 724 C124 714 120 702 118 690 Z";
const F_LMEN = "M150 608 L153 566 C176 570 224 584 308 600 L304 607 Z";
const F_MMEN = "M650 608 L647 566 C624 570 576 584 492 600 L496 607 Z";
const F_MCL = "M612 404 L650 398 C664 500 670 600 662 682 L612 792 L586 776 C626 690 632 600 627 500 Z";
const F_LCL = "M152 402 C124 488 114 590 132 668";
const F_ACL = "M420 600 C410 560 392 510 374 478";
const F_PCL = "M384 606 C398 560 414 512 428 478";

export const KneeFront: React.FC<{ t: number; w?: number; lit?: Lit; dim?: number; patella?: number; draw?: number; lclGap?: number; comp?: Lit; ligs?: number; men?: number; capsule?: number; ring?: number }> = ({ t, w = 520, lit = {}, dim = 1, patella = 0, draw, comp = {}, ligs = 1, men = 1, capsule = 0, ring = 0 }) => {
  const k = (id: string) => win(t, lit[id]);
  const d0 = draw === undefined ? 1 : ramp(t, draw, draw + 1.2);
  const cl = win(t, comp.L), cm = win(t, comp.M);
  return (
    <svg width={w} height={(w * 940) / 800} viewBox="0 0 800 940" style={{ overflow: "visible" }}>
      <KDefs />
      <g opacity={d0} transform={`translate(0 ${(1 - d0) * 30})`}>
        <Part d={F_FIB} base={KC.bone} line={KC.boneLine} k={k("fibula")} dim={dim} />
        <Part d={F_TIBIA} base={KC.bone} line={KC.boneLine} k={k("tibia")} dim={dim} />
        <ellipse cx={410} cy={735} rx={30} ry={18} fill="none" stroke={KC.boneLine} strokeWidth={3} opacity={0.5} />
        <Part d={F_FEMUR} base={KC.bone} line={KC.boneLine} k={k("femur")} dim={dim} />
        <g opacity={dim + (1 - dim) * 0.4} fill="none" stroke={KC.boneLine} strokeLinecap="round">
          <path d="M350 20 C346 120 344 200 352 280" strokeWidth={2.5} opacity={0.35} />
          <path d="M452 20 C456 120 458 200 450 280" strokeWidth={2.5} opacity={0.35} />
          <path d="M372 40 C370 140 370 220 376 300" strokeWidth={1.5} opacity={0.25} />
          <path d="M428 40 C430 140 430 220 424 300" strokeWidth={1.5} opacity={0.25} />
          <ellipse cx={176} cy={430} rx={20} ry={26} strokeWidth={2.5} opacity={0.45} />
          <ellipse cx={624} cy={430} rx={20} ry={26} strokeWidth={2.5} opacity={0.45} />
          <path d="M366 950 C362 860 362 800 372 760" strokeWidth={2} opacity={0.3} />
          <path d="M462 950 C468 860 468 800 456 760" strokeWidth={2} opacity={0.3} />
          <path d="M215 650 C260 680 300 700 340 720" strokeWidth={1.8} opacity={0.3} />
          <path d="M590 650 C545 680 505 700 470 720" strokeWidth={1.8} opacity={0.3} />
        </g>
        <path d="M168 548 C188 580 222 590 262 590 C300 590 336 570 356 528" fill="none" stroke="#9ECFE0" strokeWidth={7} strokeLinecap="round" opacity={0.85} />
        <path d="M632 548 C612 580 578 590 538 590 C500 590 464 570 444 528" fill="none" stroke="#9ECFE0" strokeWidth={7} strokeLinecap="round" opacity={0.85} />
        <path d="M160 612 C200 606 300 608 366 610 M434 610 C500 608 600 606 642 612" fill="none" stroke="#9ECFE0" strokeWidth={6} strokeLinecap="round" opacity={0.85} />
        {k("latC") > 0 && <Part d={F_LATC} base="#F2EAD0" line={KC.boneLine} k={k("latC")} dim={1} />}
        {k("medC") > 0 && <Part d={F_MEDC} base="#F2EAD0" line={KC.boneLine} k={k("medC")} dim={1} />}
        {/* compartments */}
        {cl > 0 && <ellipse cx={240} cy={600} rx={150} ry={46} fill={C.red} opacity={0.35 * cl} filter="url(#kGlow)" />}
        {cm > 0 && <ellipse cx={560} cy={600} rx={150} ry={46} fill={C.red} opacity={0.35 * cm} filter="url(#kGlow)" />}
        {capsule > 0 && (
          <g opacity={capsule}>
            <path d="M170 600 C170 520 200 470 250 455 C300 445 345 470 352 520 L352 610 C300 640 210 640 170 600 Z" fill={KC.bursa} opacity={0.55} stroke={KC.bursaLine} strokeWidth={4} />
            <path d="M630 600 C630 520 600 470 550 455 C500 445 455 470 448 520 L448 610 C500 640 590 640 630 600 Z" fill={KC.bursa} opacity={0.55} stroke={KC.bursaLine} strokeWidth={4} />
            <rect x={110} y={400} width={580} height={300} rx={60} fill="none" stroke={C.forest} strokeWidth={7} strokeDasharray="20 14" />
          </g>
        )}
        {/* cruciates (PCL behind, ACL in front) */}
        <g opacity={ligs}>
          {[["pcl", F_PCL, 0.85], ["acl", F_ACL, 1]].map(([id, d, o]) => {
            const kk = k(id as string);
            return (
              <g key={id as string} opacity={(o as number) * (dim + (1 - dim) * kk)}>
                {kk > 0.01 && <path d={d as string} stroke={C.red} strokeWidth={46} fill="none" opacity={0.45 * kk} filter="url(#kGlow)" strokeLinecap="round" />}
                <path d={d as string} stroke={kk > 0 ? mix(KC.ligLine, C.redDark, kk) : KC.ligLine} strokeWidth={30} fill="none" strokeLinecap="round" />
                <path d={d as string} stroke={kk > 0 ? mix(KC.lig, C.red, kk) : KC.lig} strokeWidth={23} fill="none" strokeLinecap="round" />
              </g>
            );
          })}
        </g>
        {/* menisci */}
        <g opacity={men}>
          <Part d={F_LMEN} base={KC.men} line={KC.menLine} k={k("latMen")} dim={dim} sw={3} />
          <Part d={F_MMEN} base={KC.men} line={KC.menLine} k={k("medMen")} dim={dim} sw={3} />
        </g>
        {/* collaterals */}
        <g opacity={ligs}>
          <Part d={F_MCL} base={KC.lig} line={KC.ligLine} k={k("mcl")} dim={dim} litCol={C.red} pattern="url(#kFiber)" sw={3} />
          {(() => {
            const kk = k("lcl");
            return (
              <g opacity={dim + (1 - dim) * kk}>
                {kk > 0.01 && <path d={F_LCL} stroke={C.red} strokeWidth={50} fill="none" opacity={0.45 * kk} filter="url(#kGlow)" strokeLinecap="round" />}
                <path d={F_LCL} stroke={kk > 0 ? mix(KC.ligLine, C.redDark, kk) : KC.ligLine} strokeWidth={24} fill="none" strokeLinecap="round" />
                <path d={F_LCL} stroke={kk > 0 ? mix(KC.lig, C.red, kk) : KC.lig} strokeWidth={17} fill="none" strokeLinecap="round" />
              </g>
            );
          })()}
        </g>
        {ring > 0 && (
          <g opacity={ring}>
            <ellipse cx={400} cy={540} rx={300} ry={170} fill="none" stroke={C.red} strokeWidth={14} strokeDasharray={`${1900 * ring} 2000`} strokeLinecap="round" />
            {[[130, 470], [670, 470], [150, 625], [650, 625]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={14} fill={C.red} stroke={C.paper} strokeWidth={4} opacity={ramp(ring, 0.6, 1)} />
            ))}
            <path d="M400 0 L400 360 M400 720 L400 940" stroke={C.redDark} strokeWidth={12} strokeDasharray="18 14" opacity={0.6 * ramp(ring, 0.3, 0.8)} />
          </g>
        )}
        {/* patella + extensor mechanism (see-through) */}
        {patella > 0 && (
          <g opacity={patella}>
            <path d="M342 0 L458 0 L452 330 L348 330 Z" fill={KC.lig} stroke={KC.ligLine} strokeWidth={3} opacity={0.75} />
            <path d="M378 500 L422 500 L428 730 L392 730 Z" fill={KC.lig} stroke={KC.ligLine} strokeWidth={3} opacity={0.75} />
            <Part d="M400 318 C452 318 482 360 480 420 C478 476 440 516 400 516 C360 516 322 476 320 420 C318 360 348 318 400 318 Z" base={KC.bone} line={KC.boneLine} k={k("patella")} dim={1} op={0.92} />
          </g>
        )}
      </g>
    </svg>
  );
};
/** anchor points of KneeFront parts in viewBox coords (for HTML tags) */
export const FP: Record<string, [number, number]> = {
  femur: [400, 170], latC: [250, 520], medC: [550, 520], tibia: [410, 820], fibula: [155, 830], patella: [400, 418],
  latMen: [200, 590], medMen: [600, 590], mcl: [668, 560], lcl: [118, 560], acl: [398, 540], pcl: [418, 520], tub: [410, 735],
};

/* ---------------- KneeSide (viewBox 0 0 800 940, front = right) ---------------- */
const S_FEMUR = "M300 0 L440 0 L440 420 C470 468 500 520 492 572 C482 620 442 642 392 642 C312 642 234 612 228 546 C222 480 270 450 300 410 Z";
const S_PAT = "M560 392 C590 396 602 440 598 480 C594 525 576 552 556 550 C532 548 520 510 522 468 C524 424 536 390 560 392 Z";
const S_QUAD = "M445 0 L505 0 C520 200 545 320 572 394 L532 400 C508 330 472 200 445 0 Z";
const S_SUPRA = "M470 270 C490 280 500 330 500 380 C490 392 476 388 470 372 C462 340 458 300 470 270 Z";
const S_PRE = "M606 420 C620 440 622 500 610 528 C600 520 598 450 606 420 Z";
const S_INFS = "M586 660 C598 672 600 716 588 734 C578 718 578 676 586 660 Z";
const S_INFD = "M520 680 C532 690 534 720 524 734 C514 724 512 694 520 680 Z";
const S_SEMI = "M206 560 C226 572 230 626 210 652 C192 636 190 584 206 560 Z";

export const KneeSide: React.FC<{ t: number; w?: number; lit?: Lit; dim?: number; slide?: number; cruc?: number; burs?: number; pop?: number; ext?: number; flex?: number }> = ({ t, w = 520, lit = {}, dim = 1, slide = 0, cruc = 0, burs = 0, pop = 0, ext = 1, flex = 0 }) => {
  const k = (id: string) => win(t, lit[id]);
  const fr = (flex * Math.PI) / 180;
  const T = (x: number, y: number) => {
    const dx = x - 390, dy = y - 600;
    return `${390 + dx * Math.cos(fr) - dy * Math.sin(fr) + slide} ${600 + dx * Math.sin(fr) + dy * Math.cos(fr)}`;
  };
  const acl = `M${T(440, 652)} C${T(410, 620)} 360 590 332 560`;
  const pcl = `M${T(286, 662)} C${T(320, 630)} 380 590 420 560`;
  const tib = `M${T(230, 660)} C${T(230, 650)} ${T(300, 648)} ${T(400, 650)} C${T(470, 652)} ${T(520, 655)} ${T(525, 668)} C${T(530, 700)} ${T(515, 720)} ${T(505, 738)} C${T(522, 756)} ${T(512, 780)} ${T(476, 800)} L${T(468, 940)} L${T(330, 940)} L${T(326, 800)} C${T(290, 780)} ${T(240, 740)} ${T(232, 700)} Z`;
  const patLig = `M548 546 L572 548 L${T(522, 760)} L${T(498, 752)} Z`;
  const ligStroke = (d: string, id: string, extraTaut = 0) => {
    const kk = Math.max(k(id), extraTaut);
    return (
      <g opacity={dim + (1 - dim) * kk}>
        {kk > 0.01 && <path d={d} stroke={C.red} strokeWidth={44} fill="none" opacity={0.45 * kk} filter="url(#kGlow)" strokeLinecap="round" />}
        <path d={d} stroke={kk > 0 ? mix(KC.ligLine, C.redDark, kk) : KC.ligLine} strokeWidth={24} fill="none" strokeLinecap="round" />
        <path d={d} stroke={kk > 0 ? mix(KC.lig, C.red, kk) : KC.lig} strokeWidth={17} fill="none" strokeLinecap="round" />
      </g>
    );
  };
  return (
    <svg width={w} height={(w * 940) / 800} viewBox="0 0 800 940" style={{ overflow: "visible" }}>
      <KDefs />
      {/* skin line */}
      <path d="M560 0 C600 200 650 380 640 480 C632 560 600 640 604 760 C606 840 590 900 586 940" fill="none" stroke={C.matchaLight} strokeWidth={4} strokeDasharray="10 12" opacity={0.7} />
      <Part d={tib} base={KC.bone} line={KC.boneLine} k={k("tibia")} dim={dim} />
      <path d={tib} fill="url(#kSpongy)" opacity={0.6} />
      <Part d={S_FEMUR} base={KC.bone} line={KC.boneLine} k={k("femur")} dim={dim} />
      <path d={S_FEMUR} fill="url(#kSpongy)" opacity={0.6} />
      {/* cartilage caps */}
      <path d="M262 600 C300 640 420 648 486 590" fill="none" stroke="#B9D9E8" strokeWidth={9} opacity={0.9} strokeLinecap="round" />
      {k("pfj") > 0 && <ellipse cx={520} cy={470} rx={40} ry={95} fill={C.red} opacity={0.45 * k("pfj")} filter="url(#kGlow)" />}
      {/* meniscus wedges */}
      <path d={`M${T(250, 655)} L${T(300, 636)} L${T(320, 652)} Z`} fill={KC.men} stroke={KC.menLine} strokeWidth={3} opacity={dim} />
      <path d={`M${T(495, 652)} L${T(465, 630)} L${T(440, 650)} Z`} fill={KC.men} stroke={KC.menLine} strokeWidth={3} opacity={dim} />
      {cruc > 0 && <g opacity={cruc}>{ligStroke(pcl, "pcl", slide < -4 ? Math.min(1, -slide / 30) : 0)}{ligStroke(acl, "acl", slide > 4 ? Math.min(1, slide / 30) : 0)}</g>}
      {/* extensor mechanism */}
      <g opacity={ext}>
        <Part d={S_QUAD} base={KC.lig} line={KC.ligLine} k={k("quad")} dim={dim} litCol={C.red} pattern="url(#kFiber)" sw={3} />
        <Part d={patLig} base={KC.lig} line={KC.ligLine} k={k("patlig")} dim={dim} litCol={C.red} pattern="url(#kFiber)" sw={3} />
        <Part d={S_PAT} base={KC.bone} line={KC.boneLine} k={k("patella")} dim={dim} />
      </g>
      {/* popliteus */}
      {pop > 0 && (
        <g opacity={pop}>
          <Part d="M262 560 C240 600 250 640 280 700 C300 740 320 770 340 790 L318 806 C290 780 262 740 246 700 C226 650 224 600 244 552 Z" base={KC.muscle} line={KC.muscleLine} k={k("pop")} dim={1} litCol={C.red} sw={3} />
        </g>
      )}
      {/* bursae */}
      {burs > 0 && (
        <g opacity={burs}>
          {[["supra", S_SUPRA], ["pre", S_PRE], ["infs", S_INFS], ["infd", S_INFD], ["semi", S_SEMI]].map(([id, d]) => (
            <Part key={id} d={d} base={KC.bursa} line={KC.bursaLine} k={k(id)} dim={dim} sw={3} />
          ))}
        </g>
      )}
    </svg>
  );
};
export const SP: Record<string, [number, number]> = {
  femur: [370, 250], tibia: [400, 840], patella: [560, 470], quad: [500, 200], patlig: [540, 650], supra: [485, 330], pre: [612, 470],
  infs: [592, 700], infd: [522, 706], semi: [208, 606], pop: [282, 690], acl: [390, 610], pcl: [350, 610], tub: [512, 760], pfj: [528, 470],
};

/* ---------------- MenisciTop (viewBox 0 0 900 640) ---------------- */
const arcPath = (cx: number, cy: number, rx: number, ry: number, irx: number, iry: number, a1: number, a2: number) => {
  // ring from angle a1 to a2 (deg, going the long way counter-clockwise visually via increasing angle)
  const P = (r1: number, r2: number, a: number) => [cx + r1 * Math.cos((a * Math.PI) / 180), cy + r2 * Math.sin((a * Math.PI) / 180)];
  const span = (((a2 - a1) % 360) + 360) % 360;
  const large = span > 180 ? 1 : 0;
  const [x1, y1] = P(rx, ry, a1), [x2, y2] = P(rx, ry, a2), [x3, y3] = P(irx, iry, a2), [x4, y4] = P(irx, iry, a1);
  return `M${x1} ${y1} A${rx} ${ry} 0 ${large} 1 ${x2} ${y2} Q${(x2 + x3) / 2 + 6} ${(y2 + y3) / 2} ${x3} ${y3} A${irx} ${iry} 0 ${large} 0 ${x4} ${y4} Q${(x1 + x4) / 2 + 6} ${(y1 + y4) / 2} ${x1} ${y1} Z`;
};
// medial (left): C open toward the centre (right) -> from 55deg round through 180 to 305deg
const M_MED = arcPath(300, 320, 190, 215, 118, 148, 52, 308);
const M_MED_RIM = arcPath(300, 320, 190, 215, 164, 188, 52, 308);
// lateral (right): almost an O, small opening toward the centre (left)
const M_LAT = arcPath(615, 318, 150, 160, 88, 96, 196, 164);
const M_LAT_RIM = arcPath(615, 318, 150, 160, 128, 138, 196, 164);

export const MenisciTop: React.FC<{ t: number; w?: number; lit?: Lit; dim?: number; zones?: number; fem?: number; rot?: number; cruc?: number; cols?: number }> = ({ t, w = 760, lit = {}, dim = 1, zones = 0, fem = 0, rot = 0, cruc = 1, cols = 1 }) => {
  const k = (id: string) => win(t, lit[id]);
  return (
    <svg width={w} height={(w * 640) / 900} viewBox="0 0 900 640" style={{ overflow: "visible" }}>
      <KDefs />
      <g filter="url(#kSh)">
        <path d="M96 320 C86 130 290 74 456 110 C620 74 820 130 812 320 C820 500 640 590 456 548 C270 590 86 500 96 320 Z" fill={KC.bone} stroke={KC.boneLine} strokeWidth={4} />
      </g>
      <path d="M150 320 C150 190 300 150 430 190 C440 260 440 380 430 470 C300 500 150 450 150 320 Z" fill="#E9F1F3" opacity={0.5} />
      <path d="M760 320 C760 200 640 150 490 190 C480 260 480 380 490 470 C640 500 760 450 760 320 Z" fill="#E9F1F3" opacity={0.5} />
      {/* intercondylar eminence */}
      <path d="M440 300 L452 268 L462 300 L474 274 L486 306 Z" fill="#E2D5AE" stroke={KC.boneLine} strokeWidth={2} />
      <Part d={M_MED} base={KC.men} line={KC.menLine} k={k("medMen")} dim={dim} sw={3} />
      <Part d={M_LAT} base={KC.men} line={KC.menLine} k={k("latMen")} dim={dim} sw={3} />
      {zones > 0 && (
        <g opacity={zones}>
          <path d={M_MED_RIM} fill={C.red} opacity={0.75} />
          <path d={M_LAT_RIM} fill={C.red} opacity={0.75} />
        </g>
      )}
      {/* cruciate footprints */}
      {cruc > 0 && (
        <g opacity={cruc}>
          {[["acl", 470, 210], ["pcl", 460, 470]].map(([id, x, y]) => {
            const kk = k(id as string);
            return (
              <g key={id as string}>
                {kk > 0 && <ellipse cx={x as number} cy={y as number} rx={48} ry={34} fill={C.red} opacity={0.5 * kk} filter="url(#kGlow)" />}
                <ellipse cx={x as number} cy={y as number} rx={30} ry={20} fill={kk > 0 ? mix(KC.lig, C.red, kk) : KC.lig} stroke={KC.ligLine} strokeWidth={3} />
              </g>
            );
          })}
        </g>
      )}
      {/* collaterals: MCL bonded to the medial meniscus, LCL separate */}
      <g opacity={cols}>
        <Part d="M84 250 L126 248 L128 392 L86 394 Z" base={KC.lig} line={KC.ligLine} k={k("mcl")} dim={dim} litCol={C.red} pattern="url(#kFiber)" sw={3} />
        <Part d="M842 300 C866 300 880 318 880 336 C880 356 866 370 842 370 C820 370 806 356 806 336 C806 318 820 300 842 300 Z" base={KC.lig} line={KC.ligLine} k={k("lcl")} dim={dim} litCol={C.red} sw={3} />
      </g>
      {/* femoral condyles (lock / unlock) */}
      {fem > 0 && (
        <g opacity={fem} transform={`rotate(${rot} 456 320)`}>
          <ellipse cx={300} cy={330} rx={140} ry={185} fill="none" stroke={C.forest} strokeWidth={8} strokeDasharray="22 14" />
          <ellipse cx={612} cy={318} rx={128} ry={170} fill="none" stroke={C.forest} strokeWidth={8} strokeDasharray="22 14" />
          <line x1={300} y1={330} x2={612} y2={318} stroke={C.forest} strokeWidth={5} opacity={0.5} />
        </g>
      )}
    </svg>
  );
};
export const MP: Record<string, [number, number]> = { medMen: [150, 320], latMen: [700, 200], acl: [470, 210], pcl: [460, 470], mcl: [106, 320], lcl: [843, 335] };

/* flip card (same as the hand lesson) */
export const StudyCard: React.FC<{ t: number; flip: number; front: React.ReactNode; back: string; w?: number }> = ({ t, flip, front, back, w = 560 }) => {
  const p = ramp(t, flip, flip + 0.6);
  const ang = p * 180;
  const showBack = ang > 90;
  return (
    <div style={{ width: w, height: w * 0.66, perspective: 1600 }}>
      <div style={{ width: "100%", height: "100%", transform: `rotateY(${ang}deg)`, transformStyle: "preserve-3d", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: showBack ? C.forest : C.card, border: `4px solid ${showBack ? C.forest : C.line}`, boxShadow: "0 20px 40px rgba(31,42,20,0.18)", transform: showBack ? "rotateY(180deg)" : "none", display: "flex", alignItems: "center", justifyContent: "center", padding: 30, boxSizing: "border-box", textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 52, color: showBack ? C.banana : C.forest, lineHeight: 1.15, whiteSpace: "pre-line", overflow: "hidden" }}>
          {showBack ? back : front}
        </div>
      </div>
    </div>
  );
};
