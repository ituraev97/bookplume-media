import React from "react";
import { C, FONT } from "./kit";

/* Own diagrams for "What happens when you swallow" — Book Plume illustrations */

export const K = {
  skin: "#F2C9B0",
  tissue: "#EDB4A4",
  tissueD: "#C9837A",
  lumen: "#2E1F1C",
  bone: "#F5EEDA",
  boneD: "#CDBF95",
  air: "#4F8FD8",
  bolus: "#F2A93B",
  bolusD: "#B86E12",
  muscle: "#C65A4E",
  muscleL: "#E58C7E",
  gland: "#E9C25A",
  nerve9: "#E8903A",
  nerve10: "#8D5BC4",
  glow: "#FFE14D",
};
const S = C.forest;
export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

/** pill label drawn inside an SVG */
export const SvgPill: React.FC<{ x: number; y: number; text: string; o?: number; size?: number; hot?: boolean; anchor?: "l" | "r" | "c"; dot?: [number, number] }> = ({
  x, y, text, o = 1, size = 30, hot = false, anchor = "c", dot,
}) => {
  if (o <= 0.001) return null;
  const w = text.length * size * 0.56 + size * 1.0;
  const h = size * 1.5;
  const x0 = anchor === "c" ? x - w / 2 : anchor === "l" ? x : x - w;
  const s = 0.8 + 0.2 * o;
  return (
    <g opacity={o}>
      {dot && (
        <>
          <line x1={dot[0]} y1={dot[1]} x2={anchor === "l" ? x0 : anchor === "r" ? x0 + w : x} y2={y} stroke={S} strokeWidth={4} strokeLinecap="round" />
          <circle cx={dot[0]} cy={dot[1]} r={10} fill={hot ? C.red : K.glow} stroke={S} strokeWidth={4} />
        </>
      )}
      <g transform={`translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`}>
        <rect x={x0} y={y - h / 2} width={w} height={h} rx={h / 2.4} fill={hot ? C.banana : S} stroke={hot ? S : "none"} strokeWidth={hot ? 3 : 0} />
        <text x={x0 + w / 2} y={y + size * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={size} fill={hot ? S : C.paper}>
          {text}
        </text>
      </g>
    </g>
  );
};

/* ---------- path helpers ---------- */
const BPATH: [number, number][] = [
  [585, 372], [500, 370], [432, 392], [388, 440], [352, 500], [332, 568], [330, 640], [330, 700], [330, 760], [330, 900],
];
const segLen = (a: [number, number], b: [number, number]) => Math.hypot(b[0] - a[0], b[1] - a[1]);
const CUM: number[] = [0];
for (let i = 1; i < BPATH.length; i++) CUM.push(CUM[i - 1] + segLen(BPATH[i - 1], BPATH[i]));
const TOTAL = CUM[CUM.length - 1];
export const bolusAt = (b: number): [number, number] => {
  let d = clamp(b) * TOTAL;
  for (let i = 1; i < BPATH.length; i++) {
    const L = segLen(BPATH[i - 1], BPATH[i]);
    if (d <= L) return [lerp(BPATH[i - 1][0], BPATH[i][0], d / L), lerp(BPATH[i - 1][1], BPATH[i][1], d / L)];
    d -= L;
  }
  return BPATH[BPATH.length - 1];
};
const at = (i: number) => CUM[i] / TOTAL;
/* bolus progress landmarks (0..1 along the path) */
export const BP = { mouth: 0, backMouth: at(2), arch: at(3), oro: at(4), laryngo: at(5), low: at(6), ues: at(7), below: at(8), end: 1 };

export type Hl = "" | "palate" | "epi" | "folds" | "hyoid" | "ues" | "tongue" | "arch" | "pharynx" | "nasal" | "larynx" | "esoph" | "oral";

const HEAD = "M140 900 L132 560 C100 420 104 220 160 120 C230 30 420 20 540 50 C610 70 646 130 650 200 L656 236 L724 296 C732 308 724 318 708 320 L664 324 C684 336 690 350 680 360 C690 368 688 378 666 386 C690 394 692 410 680 418 C676 436 676 452 672 470 C664 504 636 522 600 530 C570 538 548 548 532 566 L522 900 Z";

/**
 * Schematic mid-sagittal head & neck (facing right). All motion is parametric so scenes can drive it from the voice timeline.
 */
export const SwallowDiagram: React.FC<{
  w?: number; t: number; b?: number; form?: number; palate?: number; epi?: number; lift?: number; ues?: number; folds?: number;
  air?: number; wave?: number; hl?: Hl; finger?: number; cross?: number;
}> = ({ w = 800, t, b = -1, form = 1, palate = 0, epi = 0, lift = 0, ues = 0, folds = 0, air = 0, wave = 0, hl = "", finger = 0, cross = 0 }) => {
  const lx = 16 * lift, ly = -36 * lift;
  const pAng = lerp(128, 186, palate), pLen = lerp(86, 118, palate);
  const hx = lerp(560, 470, wave), hy = 356;
  const bx = lerp(408, 376, wave), by = 450;
  const [bxp, byp] = bolusAt(b);
  const inEso = b > BP.ues - 0.01;
  const bolusR = 26;
  const glow = 0.75 + 0.25 * Math.sin(t * 6);
  const epiAng = -100 - 84 * epi;
  const uesGap = lerp(2, 40, ues);
  const foldGap = lerp(24, 1, folds);
  return (
    <svg width={w} height={w * 1.125} viewBox="0 0 800 900" style={{ overflow: "visible" }}>
      <defs>
        <clipPath id="swHead">
          <path d={HEAD} />
        </clipPath>
        <filter id="swGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>
      <path d={HEAD} fill={K.skin} />
      <g clipPath="url(#swHead)">
        <path d="M168 200 L700 200 L700 600 L540 600 L520 900 L168 900 Z" fill={K.tissue} />
        {/* skull / brain cap */}
        <path d="M120 60 L660 60 L650 196 C560 206 400 214 170 236 C150 180 140 120 120 60 Z" fill="#E9DCCB" stroke={S} strokeWidth={5} />
        <text x={390} y={140} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={S} opacity={0.32}>brain</text>
        {/* cervical spine */}
        {Array.from({ length: 9 }, (_, i) => (
          <rect key={i} x={190} y={252 + i * 72} width={84} height={56} rx={16} fill={K.bone} stroke={S} strokeWidth={4} />
        ))}
        {/* nasal cavity */}
        <path d="M300 228 C390 214 560 214 640 238 L700 296 L650 312 C590 322 510 326 430 326 L300 326 Z" fill={K.lumen} opacity={0.93} />
        {[252, 280, 306].map((y, i) => (
          <path key={y} d={`M${470 + i * 12} ${y} C${520 + i * 10} ${y - 14} 580 ${y - 10} ${612 - i * 12} ${y + 4}`} stroke={K.tissueD} strokeWidth={10} fill="none" strokeLinecap="round" />
        ))}
        {/* pharynx lumen */}
        <path d={`M300 226 L346 226 L432 330 L${bx + 6} ${by - 56} L${bx - 6} ${by + 40} L${360 + lx} ${562 + ly} L360 690 L300 690 Z`} fill={K.lumen} opacity={0.93} />
        {/* oral cavity lumen (thin gap above tongue) */}
        <path d="M430 340 L652 340 C664 352 666 372 660 386 L620 388 C560 368 480 366 420 392 Z" fill={K.lumen} opacity={0.85} />
        {/* esophagus */}
        <rect x={300} y={690} width={60} height={230} fill={K.tissueD} />
        <rect x={330 - (inEso ? 22 : 3)} y={702} width={inEso ? 44 : 6} height={220} fill={K.lumen} opacity={0.92} rx={3} />
        <circle cx={330 - uesGap / 2 - 17} cy={696} r={18} fill={K.muscle} stroke={S} strokeWidth={4} />
        <circle cx={330 + uesGap / 2 + 17} cy={696} r={18} fill={K.muscle} stroke={S} strokeWidth={4} />
        {/* hard palate */}
        <rect x={428} y={322} width={226} height={18} rx={9} fill={K.bone} stroke={S} strokeWidth={4} />
        {/* soft palate + uvula */}
        <g transform={`translate(432 332) rotate(${pAng})`}>
          <path d={`M0 -12 C${pLen * 0.5} -17 ${pLen * 0.85} -13 ${pLen} -6 L${pLen} 6 C${pLen * 0.85} 13 ${pLen * 0.5} 17 0 12 Z`} fill={K.tissueD} stroke={S} strokeWidth={4} />
          <circle cx={pLen + 5} cy={0} r={10} fill={K.tissueD} stroke={S} strokeWidth={4} />
        </g>
        {/* mandible symphysis + floor of mouth */}
        <path d="M624 408 C650 410 664 430 664 456 C664 486 646 506 618 510 C606 486 604 440 624 408 Z" fill={K.bone} stroke={S} strokeWidth={4} />
        <path d={`M612 500 C570 520 520 534 ${484 + lx} ${548 + ly}`} stroke={K.muscle} strokeWidth={10} fill="none" strokeLinecap="round" />
        {/* tongue */}
        <path d={`M640 392 C632 368 ${hx + 70} ${hy} ${hx} ${hy} C${hx - 70} ${hy} ${bx} ${by - 70} ${bx} ${by} C${bx - 2} 500 ${430 + lx * 0.5} ${528 + ly * 0.5} ${470 + lx} ${540 + ly} C540 524 600 500 620 470 C632 440 646 416 640 392 Z`} fill="#D9736A" stroke={S} strokeWidth={6} />
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M610 ${470 - i * 6} C${560 - i * 20} ${430 - i * 10} ${500 - i * 10} ${400 + i * 6} ${hx - 30 + i * 20} ${hy + 20 + i * 12}`} stroke="#B9554D" strokeWidth={3} fill="none" opacity={0.6} />
        ))}
        {/* teeth */}
        <rect x={640} y={338} width={16} height={22} rx={4} fill="#FFFFFF" stroke={S} strokeWidth={3} />
        <rect x={636} y={392} width={16} height={20} rx={4} fill="#FFFFFF" stroke={S} strokeWidth={3} />
        {/* hyoid + larynx (lift together) */}
        <g transform={`translate(${lx} ${ly})`}>
          <ellipse cx={486} cy={548} rx={26} ry={11} fill={K.bone} stroke={S} strokeWidth={4} />
          <path d="M358 562 L358 940 L444 940 L444 562" fill={K.tissueD} stroke={S} strokeWidth={4} />
          <rect x={372} y={562} width={58} height={380} fill={K.lumen} opacity={0.92} />
          <path d="M444 576 L482 606 L474 664 L444 680" fill={K.bone} stroke={S} strokeWidth={4} />
          {Array.from({ length: 5 }, (_, i) => (
            <rect key={i} x={444} y={730 + i * 34} width={14} height={22} rx={5} fill={K.bone} stroke={S} strokeWidth={3} />
          ))}
          <path d={`M372 628 L${401 - foldGap / 2} 636 L372 646 Z`} fill="#FFF3EA" stroke={S} strokeWidth={3} />
          <path d={`M430 628 L${401 + foldGap / 2} 636 L430 646 Z`} fill="#FFF3EA" stroke={S} strokeWidth={3} />
          <g transform={`translate(440 564) rotate(${epiAng})`}>
            <path d="M0 -9 C30 -12 60 -10 82 -4 C88 0 88 4 82 6 C60 10 30 11 0 9 Z" fill="#F6D6C4" stroke={S} strokeWidth={4} />
          </g>
        </g>
        {air > 0.01 &&
          Array.from({ length: 16 }, (_, i) => {
            const k = (t * 0.45 + i / 16) % 1;
            const pts: [number, number][] = [[712, 306], [560, 270], [420, 280], [330, 330], [336, 440], [350, 530], [401 + lx, 590 + ly], [401 + lx, 900]];
            const d = k * (pts.length - 1);
            const j = Math.floor(d), f = d - j;
            const x = lerp(pts[j][0], pts[Math.min(j + 1, pts.length - 1)][0], f);
            const y = lerp(pts[j][1], pts[Math.min(j + 1, pts.length - 1)][1], f);
            return <circle key={i} cx={x} cy={y} r={9} fill={K.air} stroke="#FFFFFF" strokeWidth={3} opacity={air} />;
          })}
        {cross > 0.01 && (
          <g opacity={cross}>
            <path d="M600 270 C430 262 330 300 340 420 C346 500 390 560 400 640 L400 880" stroke={K.air} strokeWidth={14} fill="none" strokeDasharray="2 24" strokeLinecap="round" />
            <path d="M600 370 C480 366 380 410 352 500 C334 560 330 640 330 860" stroke={K.bolus} strokeWidth={14} fill="none" strokeDasharray="2 24" strokeLinecap="round" />
            <circle cx={352} cy={520} r={52} fill="none" stroke={C.red} strokeWidth={8} />
          </g>
        )}
        {hl && (
          <g filter="url(#swGlow)" opacity={glow * 0.6}>
            {hl === "palate" && <ellipse cx={392} cy={350} rx={70} ry={44} fill={K.glow} />}
            {hl === "epi" && <ellipse cx={412 + lx} cy={540 + ly} rx={58} ry={42} fill={K.glow} />}
            {hl === "folds" && <ellipse cx={401 + lx} cy={636 + ly} rx={46} ry={26} fill={K.glow} />}
            {hl === "hyoid" && <ellipse cx={486 + lx} cy={550 + ly} rx={54} ry={32} fill={K.glow} />}
            {hl === "ues" && <ellipse cx={330} cy={696} rx={66} ry={34} fill={K.glow} />}
            {hl === "tongue" && <ellipse cx={530} cy={430} rx={120} ry={70} fill={K.glow} opacity={0.38} />}
            {hl === "arch" && <circle cx={396} cy={428} r={44} fill={K.glow} />}
            {hl === "pharynx" && <rect x={292} y={230} width={110} height={460} rx={40} fill={K.glow} opacity={0.55} />}
            {hl === "esoph" && <rect x={296} y={690} width={68} height={210} rx={20} fill={K.glow} opacity={0.6} />}
            {hl === "larynx" && <rect x={352 + lx} y={562 + ly} width={110} height={120} rx={30} fill={K.glow} opacity={0.7} />}
            {hl === "oral" && <ellipse cx={540} cy={370} rx={110} ry={34} fill={K.glow} />}
          </g>
        )}
        {b >= 0 && (
          <g transform={`translate(${bxp} ${byp})`}>
            <ellipse cx={0} cy={0} rx={inEso ? 20 : bolusR} ry={inEso ? 32 : bolusR * 0.78} fill={K.bolus} stroke={S} strokeWidth={4} opacity={clamp(form * 1.5)} />
            <ellipse cx={-7} cy={-7} rx={6} ry={4} fill="#FFFFFF" opacity={0.6 * form} />
            {form < 1 &&
              Array.from({ length: 7 }, (_, i) => {
                const a = (i / 7) * Math.PI * 2 + t * 1.5;
                const r = 8 + 46 * (1 - form);
                return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r * 0.35} r={8} fill={K.bolus} stroke={S} strokeWidth={3} opacity={1 - form} />;
              })}
          </g>
        )}
      </g>
      <path d={HEAD} fill="none" stroke={S} strokeWidth={7} strokeLinejoin="round" />
      {finger > 0.01 && (
        <g opacity={finger} transform={`translate(${lx * 0.6 + (1 - finger) * 60} ${ly * 0.6})`}>
          <path d="M790 586 L550 590 C534 591 532 616 550 618 L790 624 Z" fill={K.skin} stroke={S} strokeWidth={6} strokeLinejoin="round" />
          <path d="M790 636 L550 640 C534 641 532 668 550 668 L790 676 Z" fill={K.skin} stroke={S} strokeWidth={6} strokeLinejoin="round" />
          <path d="M560 594 C552 596 552 612 560 614" stroke="#E0A88E" strokeWidth={4} fill="none" />
          <path d="M558 644 C550 646 550 662 558 664" stroke="#E0A88E" strokeWidth={4} fill="none" />
        </g>
      )}
    </svg>
  );
};

/* Side view of jaw: muscles of mastication + salivary glands; hl = list of keys to light */
export const JawGlands: React.FC<{ w?: number; t: number; show: Record<string, number>; chew?: number }> = ({ w = 900, t, show, chew = 0 }) => {
  const open = chew > 0 ? (Math.sin(t * 7) * 0.5 + 0.5) * chew : 0;
  const g = (k: string) => show[k] || 0;
  const mus = (k: string) => (g(k) > 0 ? K.muscle : "#D9A49A");
  return (
    <svg width={w} height={w * 0.8} viewBox="0 0 900 720" style={{ overflow: "visible" }}>
      {/* face */}
      <path d="M150 120 C260 20 520 10 640 120 C690 170 700 230 690 280 L760 360 C770 376 756 388 736 392 L716 396 C730 420 720 446 704 452 C720 476 716 506 698 516 C700 560 690 600 640 620 C560 650 420 650 330 600 L300 700 L150 700 C160 560 120 400 150 120 Z" fill={K.skin} stroke={S} strokeWidth={7} strokeLinejoin="round" />
      {/* skull + cheekbone */}
      <path d="M200 140 C300 60 520 60 610 150 C640 190 650 240 640 280 L520 300 L360 300 C260 300 200 240 200 140 Z" fill={K.bone} stroke={S} strokeWidth={5} opacity={0.95} />
      <rect x={330} y={290} width={230} height={28} rx={14} fill={K.bone} stroke={S} strokeWidth={5} />
      {/* ear */}
      <ellipse cx={270} cy={360} rx={42} ry={66} fill={K.skin} stroke={S} strokeWidth={6} />
      <path d="M262 322 C290 330 290 380 262 392" stroke={S} strokeWidth={5} fill="none" />
      {/* mandible (rotates open a little around TMJ) */}
      <g transform={`rotate(${open * 9} 340 330)`}>
        <path d="M340 330 L360 520 C370 590 420 610 520 600 L650 580 C670 576 676 560 664 548 L560 548 L420 530 L404 400 Z" fill={K.bone} stroke={S} strokeWidth={5} />
        <path d="M404 400 L440 330 L470 336 L440 410 Z" fill={K.bone} stroke={S} strokeWidth={4} />
        {/* masseter */}
        <path d="M370 312 L520 312 L500 560 L380 540 Z" fill={mus("masseter")} stroke={S} strokeWidth={5} opacity={0.94} />
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1={390 + i * 26} y1={318} x2={392 + i * 22} y2={540} stroke={S} strokeWidth={2} opacity={0.35} />
        ))}
        {/* medial pterygoid (deep) */}
        <path d="M430 360 L470 360 L452 540 L406 530 Z" fill={mus("medial")} stroke={S} strokeWidth={4} strokeDasharray="10 8" opacity={g("medial") > 0 ? 0.95 : 0.0} />
        {/* submandibular gland */}
        <ellipse cx={500} cy={610} rx={60} ry={30} fill={g("submandibular") > 0 ? K.gland : "#EAD9A8"} stroke={S} strokeWidth={4} />
        {/* sublingual gland */}
        <ellipse cx={600} cy={540} rx={44} ry={16} fill={g("sublingual") > 0 ? K.gland : "#EAD9A8"} stroke={S} strokeWidth={4} />
      </g>
      {/* temporalis fan */}
      <path d="M300 120 C380 70 520 80 580 150 L480 300 L440 310 Z" fill={mus("temporalis")} stroke={S} strokeWidth={5} opacity={0.94} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line key={i} x1={320 + i * 44} y1={120 - Math.sin((i / 5) * Math.PI) * 30} x2={452 + i * 5} y2={300} stroke={S} strokeWidth={2} opacity={0.35} />
      ))}
      {/* lateral pterygoid (deep, horizontal) */}
      <path d="M352 318 L470 300 L476 330 L360 344 Z" fill={mus("lateral")} stroke={S} strokeWidth={4} strokeDasharray="10 8" opacity={g("lateral") > 0 ? 0.95 : 0} />
      {/* parotid */}
      <path d="M300 300 C340 290 372 310 372 360 C372 420 350 470 320 480 C300 470 296 420 300 300 Z" fill={g("parotid") > 0 ? K.gland : "#EAD9A8"} stroke={S} strokeWidth={4} opacity={0.95} />
      {g("parotid") > 0 && <path d="M372 350 L520 372" stroke={S} strokeWidth={6} strokeLinecap="round" opacity={g("parotid")} />}
      {/* nose + lips */}
      <path d="M690 280 L760 360" stroke={S} strokeWidth={4} />
      {/* saliva drops */}
      {g("saliva") > 0 &&
        Array.from({ length: 8 }, (_, i) => {
          const k = (t * 0.6 + i / 8) % 1;
          return <circle key={i} cx={560 + Math.sin(i * 2.1) * 60} cy={430 + k * 80} r={8} fill="#8EC3F0" stroke={S} strokeWidth={2} opacity={g("saliva") * (1 - k)} />;
        })}
    </svg>
  );
};

/* Brain + brainstem with IX and X sending signals up from the throat */
export const Brainstem: React.FC<{ w?: number; t: number; p: number; center: number }> = ({ w = 900, t, p, center }) => {
  const pulse = (k: number) => (t * 0.7 + k) % 1;
  return (
    <svg width={w} height={w * 0.8} viewBox="0 0 900 720" style={{ overflow: "visible" }}>
      {/* brain */}
      <path d="M150 260 C140 120 300 40 470 50 C650 60 760 160 750 280 C744 360 680 400 600 400 L420 400 C340 420 260 400 200 360 C160 330 150 300 150 260 Z" fill="#F3D9CF" stroke={S} strokeWidth={7} />
      {[[240, 200, 360, 140], [300, 300, 460, 240], [480, 140, 640, 200], [520, 300, 680, 280], [380, 120, 420, 330]].map(([a, b2, c, d], i) => (
        <path key={i} d={`M${a} ${b2} Q${(a + c) / 2} ${b2 - 40} ${c} ${d}`} stroke={K.tissueD} strokeWidth={6} fill="none" strokeLinecap="round" />
      ))}
      {/* cerebellum */}
      <path d="M560 400 C600 390 700 400 700 460 C700 510 600 520 560 490 Z" fill="#EAC2B6" stroke={S} strokeWidth={6} />
      {/* brainstem: midbrain, pons, medulla */}
      <path d="M440 380 L520 380 L530 470 L520 600 L470 600 L456 470 Z" fill="#EBC9BD" stroke={S} strokeWidth={6} />
      <ellipse cx={494} cy={450} rx={46} ry={34} fill="#E3B3A5" stroke={S} strokeWidth={5} />
      <rect x={466} y={500} width={58} height={100} rx={22} fill={center > 0 ? K.glow : "#E3B3A5"} stroke={S} strokeWidth={5} />
      {center > 0 && <circle cx={495} cy={545} r={30 + 8 * Math.sin(t * 8)} fill="none" stroke={C.red} strokeWidth={6} opacity={center} />}
      <rect x={474} y={600} width={42} height={120} fill="#F3D9CF" stroke={S} strokeWidth={5} />
      {/* throat region */}
      <path d="M140 640 C200 600 300 600 360 640 L360 720 L140 720 Z" fill={K.tissue} stroke={S} strokeWidth={5} />
      <text x={250} y={694} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={S}>throat</text>
      {/* nerves IX and X */}
      <path id="n9" d="M260 630 C280 560 380 560 470 540" stroke={K.nerve9} strokeWidth={10} fill="none" strokeLinecap="round" opacity={clamp(p * 3)} />
      <path d="M300 640 C340 600 420 600 470 570" stroke={K.nerve10} strokeWidth={10} fill="none" strokeLinecap="round" opacity={clamp(p * 3 - 0.5)} />
      {p > 0.2 &&
        [0, 0.33, 0.66].map((k, i) => {
          const q = pulse(k);
          const x9 = lerp(260, 470, q), y9 = 630 - Math.sin(q * Math.PI) * 60 - q * 40;
          const x10 = lerp(300, 470, q), y10 = 640 - Math.sin(q * Math.PI) * 40 - q * 50;
          return (
            <g key={i}>
              <circle cx={x9} cy={y9} r={11} fill="#FFFFFF" stroke={K.nerve9} strokeWidth={5} />
              <circle cx={x10} cy={y10} r={11} fill="#FFFFFF" stroke={K.nerve10} strokeWidth={5} opacity={clamp(p * 3 - 0.5)} />
            </g>
          );
        })}
    </svg>
  );
};

/* Top view of the glottis: vocal folds close as c -> 1 */
export const VocalFolds: React.FC<{ w?: number; t: number; c: number }> = ({ w = 700, t, c }) => {
  const g = lerp(150, 0, c); // half-gap at the back, total opening
  const A: [number, number] = [350, 150];
  const L: [number, number] = [350 - g / 2, 520], R: [number, number] = [350 + g / 2, 520];
  const fw = 52;
  return (
    <svg width={w} height={w} viewBox="0 0 700 700" style={{ overflow: "visible" }}>
      <ellipse cx={350} cy={350} rx={300} ry={310} fill="#EEB9A8" stroke={S} strokeWidth={7} />
      <ellipse cx={350} cy={350} rx={225} ry={255} fill="#D98B7D" stroke={S} strokeWidth={4} />
      <text x={350} y={74} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={S}>FRONT</text>
      <text x={350} y={646} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={S}>BACK</text>
      {/* glottis */}
      <path d={`M${A[0]} ${A[1] + 6} L${L[0]} ${L[1]} L${R[0]} ${R[1]} Z`} fill={K.lumen} />
      {/* folds: thin pearly bands */}
      <path d={`M${A[0]} ${A[1]} L${L[0]} ${L[1]} L${L[0] - fw} ${L[1] + 4} L${A[0] - 26} ${A[1] + 10} Z`} fill="#FFF4EC" stroke={S} strokeWidth={5} strokeLinejoin="round" />
      <path d={`M${A[0]} ${A[1]} L${R[0]} ${R[1]} L${R[0] + fw} ${R[1] + 4} L${A[0] + 26} ${A[1] + 10} Z`} fill="#FFF4EC" stroke={S} strokeWidth={5} strokeLinejoin="round" />
      {/* arytenoid cartilages */}
      <path d={`M${L[0] + 4} ${L[1] - 6} L${L[0] - fw - 20} ${L[1] - 10} L${L[0] - fw - 6} ${L[1] + 70} L${L[0] - 6} ${L[1] + 56} Z`} fill={K.bone} stroke={S} strokeWidth={5} strokeLinejoin="round" />
      <path d={`M${R[0] - 4} ${R[1] - 6} L${R[0] + fw + 20} ${R[1] - 10} L${R[0] + fw + 6} ${R[1] + 70} L${R[0] + 6} ${R[1] + 56} Z`} fill={K.bone} stroke={S} strokeWidth={5} strokeLinejoin="round" />
      {/* pull arrows while closing */}
      {c > 0.05 && c < 0.98 && (
        <g opacity={Math.sin(c * Math.PI)}>
          <path d={`M${L[0] - 150} 560 L${L[0] - 90} 560`} stroke={C.red} strokeWidth={10} strokeLinecap="round" />
          <path d={`M${L[0] - 108} 544 L${L[0] - 88} 560 L${L[0] - 108} 576`} stroke={C.red} strokeWidth={10} fill="none" strokeLinecap="round" />
          <path d={`M${R[0] + 150} 560 L${R[0] + 90} 560`} stroke={C.red} strokeWidth={10} strokeLinecap="round" />
          <path d={`M${R[0] + 108} 544 L${R[0] + 88} 560 L${R[0] + 108} 576`} stroke={C.red} strokeWidth={10} fill="none" strokeLinecap="round" />
        </g>
      )}
      {c < 0.6 &&
        [0, 1, 2].map((k) => {
          const q = (t * 0.9 + k / 3) % 1;
          return <circle key={k} cx={350} cy={470 - q * 260} r={14} fill={K.air} stroke="#FFFFFF" strokeWidth={4} opacity={(1 - c / 0.6) * (1 - q)} />;
        })}
      <SvgPill x={350} y={250} text="glottis" o={1 - c} size={28} />
    </svg>
  );
};

/* Horizontal esophagus: thirds, peristalsis wave, LES and stomach. x positions in viewBox 0..1700 */
export const EsoTube: React.FC<{ w?: number; t: number; bx: number; thirds: [number, number, number]; wave?: number; les?: number; inStomach?: number; labels?: number }> = ({
  w = 1700, t, bx, thirds, wave = 0, les = 0, inStomach = 0, labels = 0,
}) => {
  const x0 = 60, x1 = 1240, cy = 300, R = 70;
  const N = 120;
  const pos = lerp(x0, x1, clamp(bx));
  const radius = (x: number) => {
    let r = R;
    if (wave > 0) {
      const d = x - pos;
      if (d < -40 && d > -200) r -= wave * 46 * Math.sin(((d + 200) / 160) * Math.PI); // squeeze behind
      if (d > 40 && d < 220) r += wave * 12 * Math.sin(((d - 40) / 180) * Math.PI); // widen ahead
    }
    if (x > x1 - 60) r = lerp(r, lerp(12, 48, les), clamp((x - (x1 - 60)) / 60));
    return r;
  };
  const top: string[] = [], bot: string[] = [];
  for (let i = 0; i <= N; i++) {
    const x = lerp(x0, x1, i / N);
    top.push(`${x},${cy - radius(x)}`);
    bot.push(`${x},${cy + radius(x)}`);
  }
  const outline = `M${top.join(" L")} L${bot.reverse().join(" L")} Z`;
  const thirdW = (x1 - x0) / 3;
  const cols = ["#C65A4E", "#C97D5E", "#D9A07A"];
  const names = ["upper ⅓ · skeletal", "middle ⅓ · mixed", "lower ⅓ · smooth"];
  const bolusX = inStomach > 0 ? lerp(pos, 1420, inStomach) : pos;
  const bolusY = inStomach > 0 ? lerp(cy, 360, inStomach) : cy;
  return (
    <svg width={w} height={w * (620 / 1700)} viewBox="0 0 1700 620" style={{ overflow: "visible" }}>
      <defs>
        <clipPath id="eso">
          <path d={outline} />
        </clipPath>
      </defs>
      {/* stomach */}
      <path d="M1230 250 C1300 200 1420 170 1530 210 C1640 250 1670 380 1610 470 C1540 570 1380 580 1300 520 C1250 480 1290 420 1250 360 C1236 330 1226 290 1230 250 Z" fill="#E7A99B" stroke={S} strokeWidth={7} />
      <text x={1470} y={430} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill={S}>stomach</text>
      {/* tube body */}
      <g clipPath="url(#eso)">
        {[0, 1, 2].map((i) => (
          <rect key={i} x={x0 + i * thirdW} y={0} width={thirdW + 2} height={620} fill={cols[i]} opacity={0.35 + 0.65 * thirds[i]} />
        ))}
        {Array.from({ length: 40 }, (_, i) => (
          <line key={i} x1={x0 + i * 30} y1={0} x2={x0 + i * 30} y2={620} stroke={S} strokeWidth={2} opacity={0.18} />
        ))}
        <rect x={0} y={cy - 4} width={1700} height={8} fill={K.lumen} opacity={0.6} />
      </g>
      <path d={outline} fill="none" stroke={S} strokeWidth={6} />
      {/* LES ring */}
      <g>
        <ellipse cx={x1 - 30} cy={cy - lerp(12, 48, les) - 10} rx={26} ry={14} fill={les > 0.5 ? K.glow : K.muscle} stroke={S} strokeWidth={4} />
        <ellipse cx={x1 - 30} cy={cy + lerp(12, 48, les) + 10} rx={26} ry={14} fill={les > 0.5 ? K.glow : K.muscle} stroke={S} strokeWidth={4} />
      </g>
      {/* bolus */}
      {bx >= 0 && (
        <g transform={`translate(${bolusX} ${bolusY})`} opacity={1 - clamp((inStomach - 0.85) / 0.15)}>
          <ellipse rx={64} ry={46} fill={K.bolus} stroke={S} strokeWidth={5} />
          <ellipse cx={-18} cy={-14} rx={14} ry={8} fill="#FFFFFF" opacity={0.6} />
        </g>
      )}
      {/* wave arrows */}
      {wave > 0.05 && inStomach < 0.05 && pos > x0 + 200 && (
        <g opacity={wave * clamp((pos - x0 - 200) / 60)}>
          <path d={`M${pos - 130} ${cy - 130} L${pos - 130} ${cy - 80}`} stroke={C.red} strokeWidth={8} markerEnd="" />
          <path d={`M${pos - 145} ${cy - 96} L${pos - 130} ${cy - 76} L${pos - 115} ${cy - 96}`} stroke={C.red} strokeWidth={8} fill="none" strokeLinejoin="round" />
          <path d={`M${pos - 130} ${cy + 130} L${pos - 130} ${cy + 80}`} stroke={C.red} strokeWidth={8} />
          <path d={`M${pos - 145} ${cy + 96} L${pos - 130} ${cy + 76} L${pos - 115} ${cy + 96}`} stroke={C.red} strokeWidth={8} fill="none" strokeLinejoin="round" />
          <path d={`M${pos + 90} ${cy - 110} L${pos + 170} ${cy - 110}`} stroke={C.matchaDark} strokeWidth={7} />
          <path d={`M${pos + 155} ${cy - 124} L${pos + 172} ${cy - 110} L${pos + 155} ${cy - 96}`} stroke={C.matchaDark} strokeWidth={7} fill="none" />
        </g>
      )}
      {/* third labels */}
      {labels > 0 &&
        [0, 1, 2].map((i) => (
          <SvgPill key={i} x={x0 + thirdW * (i + 0.5)} y={cy + 150} text={names[i]} o={thirds[i]} size={32} hot={false} />
        ))}
      <SvgPill x={x1 - 30} y={cy - 170} text="lower esophageal sphincter" o={clamp(les * 3)} size={30} hot />
      <text x={x0} y={cy - 110} fontFamily={FONT} fontWeight={800} fontSize={30} fill={S} opacity={0.6}>from the pharynx</text>
      <text x={0} y={0} />
      {/* subtle motion */}
      <circle cx={-100} cy={-100} r={1 + Math.sin(t)} fill="none" />
    </svg>
  );
};
