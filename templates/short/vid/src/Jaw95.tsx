import React from "react";
import { C, FONT } from "./kit";

/* Book Plume's own diagram of the 4 muscles of mastication, left lateral view of the skull (face to the viewer's LEFT), viewBox 1000 x 1000.
   Masseter + temporalis are superficial; "peel" fades the masseter away and opens a window in the ramus (like Gray's Fig. 383)
   to show the medial + lateral pterygoids. */
export type JM = "MA" | "TE" | "MP" | "LP";
export const JORDER: JM[] = ["MA", "TE", "MP", "LP"];
export const JNAME: Record<JM, string> = { MA: "Masseter", TE: "Temporalis", MP: "Medial pterygoid", LP: "Lateral pterygoid" };
export const JLET: Record<JM, string> = { MA: "M", TE: "T", MP: "M", LP: "L" };
export const JACT: Record<JM, string> = { MA: "closes · most powerful", TE: "closes · pulls jaw back", MP: "closes · inside the ramus", LP: "OPENS · pulls jaw forward" };
export const JCOL = (m: JM) => (m === "MA" ? "#D6452F" : m === "TE" ? "#C98516" : m === "MP" ? "#B4487A" : "#2F7DB8");
const HOT: Record<JM, string> = { MA: "#E4553F", TE: "#E0A030", MP: "#C9628F", LP: "#3D93D1" };

type P = [number, number];
const lerp = (a: P, b: P, k: number): P => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
const along = (pts: P[], k: number): P => {
  const seg: number[] = [];
  let L = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const d = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
    seg.push(d);
    L += d;
  }
  let r = k * L;
  for (let i = 0; i < seg.length; i++) {
    if (r <= seg[i] || i === seg.length - 1) return lerp(pts[i], pts[i + 1], Math.min(1, r / seg[i]));
    r -= seg[i];
  }
  return pts[pts.length - 1];
};
const fibres = (o: P[], ins: P[], n: number, bow = 0) => {
  const out: string[] = [];
  for (let i = 0; i <= n; i++) {
    const k = i / n;
    const a = along(o, k), b = along(ins, k);
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const L = Math.hypot(dx, dy) || 1;
    out.push(`M ${a[0].toFixed(1)} ${a[1].toFixed(1)} Q ${(mx - (dy / L) * bow).toFixed(1)} ${(my + (dx / L) * bow).toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`);
  }
  return out.join(" ");
};

/* ---- bones ---- */
const CRANIUM = "M 262 446 C 232 340 262 232 346 176 C 440 112 590 104 698 150 C 806 196 872 300 874 412 C 876 500 838 566 776 602 C 748 618 726 640 714 676 C 700 642 678 612 646 598 L 560 566 L 336 548 C 302 528 280 490 262 446 Z";
const FACE = "M 262 446 C 252 476 236 500 214 528 C 194 554 176 578 186 596 C 198 612 222 610 238 616 C 236 640 240 662 250 680 L 476 680 C 488 642 504 604 524 572 L 336 548 C 302 528 280 490 262 446 Z";
const SUTURE = "M 470 120 C 476 160 462 200 478 240 C 490 280 470 320 486 360";
const SUTURE2 = "M 700 200 C 730 260 760 300 800 330";
const ORBIT = "M 270 430 C 268 392 300 372 332 376 C 366 380 384 410 380 446 C 376 484 346 500 316 496 C 286 492 272 466 270 430 Z";
const NOSE = "M 220 548 C 210 520 222 500 236 506 C 250 512 254 540 248 566 C 244 584 228 584 220 548 Z";
const EAR_CANAL = "M 700 584 C 700 566 716 556 730 560 C 744 566 746 584 736 594 C 724 604 702 600 700 584 Z";
const MASTOID = "M 726 640 C 732 666 742 690 752 704 C 762 688 764 664 758 640 Z";
const STYLOID = "M 700 640 L 664 728 L 672 730 L 712 646 Z";
const ARCH = "M 326 532 C 420 518 528 522 650 548 L 646 578 C 528 556 424 554 350 566 Z";
const MAND = "M 238 728 L 488 728 C 506 700 516 642 524 568 C 548 602 570 620 594 622 C 614 618 628 594 640 570 C 646 554 670 550 676 568 C 678 586 666 602 658 614 C 642 682 630 762 624 808 C 620 840 598 854 566 854 L 300 860 C 262 862 236 844 230 814 C 226 782 232 752 238 728 Z";
const WINDOW = "M 466 588 C 520 578 610 580 656 592 C 652 670 640 760 630 826 L 524 830 C 498 760 476 680 466 588 Z";
const TEETH_U = Array.from({ length: 9 }, (_, i) => 252 + i * 25);
const TEETH_L = Array.from({ length: 9 }, (_, i) => 252 + i * 25);

/* ---- muscles ---- */
const TEMP = "M 336 300 C 410 214 560 192 684 234 C 772 266 812 344 796 424 C 772 476 690 504 612 524 L 556 606 L 512 606 L 470 528 C 418 482 356 428 336 360 Z";
const TEMP_F = fibres([[338, 330], [380, 250], [500, 206], [640, 222], [760, 290], [800, 400]], [[478, 540], [500, 580], [520, 600], [540, 604], [560, 590], [600, 540]], 30, 4);
const MASS = "M 366 560 L 616 576 C 624 650 620 730 610 806 C 594 828 562 836 520 832 L 476 768 C 432 696 398 622 366 560 Z";
const MASS_F = fibres([[372, 566], [490, 568], [612, 580]], [[480, 772], [560, 830], [612, 804]], 26, -6);
const LPT = "M 466 598 C 530 584 604 588 652 596 L 656 632 C 598 642 530 662 470 680 Z";
const LPT_F = fibres([[468, 602], [470, 676]], [[652, 600], [654, 628]], 11, 0);
const MPT = "M 472 694 C 504 684 540 686 560 698 C 590 746 614 790 622 824 L 588 830 C 546 786 506 744 472 720 Z";
const MPT_F = fibres([[474, 698], [474, 718], [558, 700]], [[590, 828], [604, 826], [620, 820]], 12, 0);

const BONE = "#F4EEDA";
const MUSCLE = "#D99482";

const Mus: React.FC<{ d: string; f: string; on: number; hot: boolean; k: JM; id: string; op?: number }> = ({ d, f, on, hot, k, id, op = 1 }) => (
  <g opacity={op}>
    {hot && <path d={d} fill="none" stroke={C.banana} strokeWidth={24} strokeLinejoin="round" opacity={0.95} />}
    <path d={d} fill={MUSCLE} stroke={C.forest} strokeWidth={4} strokeLinejoin="round" />
    {on > 0 && <path d={d} fill={HOT[k]} opacity={on} />}
    <clipPath id={`${id}${k}c`}>
      <path d={d} />
    </clipPath>
    <path d={f} fill="none" stroke={on > 0.5 ? "rgba(255,240,230,0.6)" : "rgba(120,50,40,0.38)"} strokeWidth={2.6} clipPath={`url(#${id}${k}c)`} />
    <path d={d} fill="none" stroke={C.forest} strokeWidth={hot ? 6 : 4} strokeLinejoin="round" />
  </g>
);

/* fat arrow: from (x,y), direction angle deg, length */
const Arrow: React.FC<{ x: number; y: number; ang: number; len: number; col: string; p: number; label?: string; lx?: number; ly?: number }> = ({ x, y, ang, len, col, p, label, lx = 0, ly = 0 }) => {
  if (p <= 0) return null;
  const L = len * p;
  const a = (ang * Math.PI) / 180;
  const ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux;
  const hw = 30, sw = 12, hl = 46;
  const tx = x + ux * L, ty = y + uy * L;
  const bx = tx - ux * hl, by = ty - uy * hl;
  const pts: P[] = [[x + nx * sw, y + ny * sw], [bx + nx * sw, by + ny * sw], [bx + nx * hw, by + ny * hw], [tx, ty], [bx - nx * hw, by - ny * hw], [bx - nx * sw, by - ny * sw], [x - nx * sw, y - ny * sw]];
  return (
    <g opacity={Math.min(1, p * 2)}>
      <path d={"M " + pts.map((q) => q.join(" ")).join(" L ") + " Z"} fill={col} stroke="#111" strokeWidth={6} strokeLinejoin="round" />
      {label && (
        <g transform={`translate(${tx + lx} ${ty + ly})`}>
          <rect x={-(label.length * 13 + 22)} y={-34} width={label.length * 26 + 44} height={58} rx={16} fill="#111" />
          <text x={0} y={10} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill={col}>{label}</text>
        </g>
      )}
    </g>
  );
};

export const Jaw: React.FC<{
  w: number; id: string; lit: Partial<Record<JM, number>>; t: number; hot?: JM[]; peel?: number;
  up?: number; fwd?: number; open?: number; dimSup?: number;
}> = ({ w, id, lit, t, hot = [], peel = 0, up = 0, fwd = 0, open = 0, dimSup = 0 }) => {
  const on = (k: JM) => {
    const s = lit[k];
    if (s === undefined) return 0;
    return Math.max(0, Math.min(1, (t - s) / 0.25));
  };
  const H = (k: JM) => hot.includes(k);
  const win = Math.max(0, Math.min(1, peel * 1.4 - 0.2));
  return (
    <svg width={w} height={w} viewBox="0 0 1000 1000" style={{ display: "block" }}>
      <defs>
        <clipPath id={`${id}win`}>
          <path d={WINDOW} />
        </clipPath>
        <pattern id={`${id}hatch`} width={14} height={14} patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <rect width={14} height={14} fill="#E8E1C8" />
          <line x1={0} y1={0} x2={0} y2={14} stroke="rgba(31,42,20,0.18)" strokeWidth={4} />
        </pattern>
      </defs>
      {/* skull */}
      <path d={CRANIUM} fill={BONE} stroke={C.forest} strokeWidth={6} strokeLinejoin="round" />
      <path d={SUTURE} fill="none" stroke="rgba(31,42,20,0.45)" strokeWidth={3} strokeDasharray="10 7" />
      <path d={SUTURE2} fill="none" stroke="rgba(31,42,20,0.35)" strokeWidth={3} strokeDasharray="10 7" />
      <path d={FACE} fill={BONE} stroke={C.forest} strokeWidth={6} strokeLinejoin="round" />
      <path d={ORBIT} fill="#2B3420" stroke={C.forest} strokeWidth={5} />
      <path d={NOSE} fill="#2B3420" stroke={C.forest} strokeWidth={4} />
      <path d={EAR_CANAL} fill="#2B3420" />
      <path d={MASTOID} fill={BONE} stroke={C.forest} strokeWidth={4} />
      <path d={STYLOID} fill={BONE} stroke={C.forest} strokeWidth={3} />
      {TEETH_U.map((x) => <rect key={x} x={x} y={676} width={22} height={44} rx={8} fill="#FFFDF4" stroke={C.forest} strokeWidth={3} />)}
      {/* temporalis (superficial, under the arch) */}
      <Mus d={TEMP} f={TEMP_F} on={on("TE")} hot={H("TE")} k="TE" id={id} op={1 - 0.55 * dimSup} />
      {/* mandible */}
      <path d={MAND} fill={BONE} stroke={C.forest} strokeWidth={6} strokeLinejoin="round" />
      {TEETH_L.map((x) => <rect key={x} x={x} y={722} width={22} height={40} rx={8} fill="#FFFDF4" stroke={C.forest} strokeWidth={3} />)}
      <path d="M 300 790 C 360 796 420 794 470 788" fill="none" stroke="rgba(31,42,20,0.25)" strokeWidth={3} />
      {/* window in the ramus showing the deep (pterygoid) muscles */}
      {win > 0 && (
        <g opacity={win}>
          <path d={WINDOW} fill={`url(#${id}hatch)`} />
          <g clipPath={`url(#${id}win)`}>
            <Mus d={LPT} f={LPT_F} on={on("LP")} hot={false} k="LP" id={id} />
            <Mus d={MPT} f={MPT_F} on={on("MP")} hot={false} k="MP" id={id} />
          </g>
          {H("LP") && <path d={LPT} fill="none" stroke={C.banana} strokeWidth={14} opacity={0.95} clipPath={`url(#${id}win)`} />}
          {H("MP") && <path d={MPT} fill="none" stroke={C.banana} strokeWidth={14} opacity={0.95} clipPath={`url(#${id}win)`} />}
          <g clipPath={`url(#${id}win)`}>
            {H("LP") && <path d={LPT} fill="none" stroke={C.forest} strokeWidth={6} />}
            {H("MP") && <path d={MPT} fill="none" stroke={C.forest} strokeWidth={6} />}
          </g>
          <path d={WINDOW} fill="none" stroke={C.forest} strokeWidth={5} strokeDasharray="14 9" />
        </g>
      )}
      {/* zygomatic arch over the temporalis tendon */}
      <path d={ARCH} fill={BONE} stroke={C.forest} strokeWidth={6} strokeLinejoin="round" />
      {/* masseter (superficial), peels down + away */}
      {peel < 1 && (
        <g transform={`translate(${-40 * peel} ${60 * peel})`}>
          <Mus d={MASS} f={MASS_F} on={on("MA")} hot={H("MA")} k="MA" id={id} op={(1 - peel) * (1 - 0.55 * dimSup)} />
        </g>
      )}
      {/* actions */}
      <Arrow x={700} y={880} ang={-90} len={150} col="#7FD06A" p={up} />
      <Arrow x={600} y={330} ang={-90} len={120} col="#7FD06A" p={up} label="CLOSE" lx={0} ly={-50} />
      <Arrow x={480} y={905} ang={180} len={150} col="#63B4F0" p={fwd} label="FORWARD" lx={60} ly={64} />
      <Arrow x={250} y={868} ang={90} len={110} col="#63B4F0" p={open} label="OPEN" lx={-112} ly={-24} />
    </svg>
  );
};
