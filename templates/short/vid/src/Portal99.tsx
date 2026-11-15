import React from "react";
import { C, FONT, ramp } from "./kit";

/* Book Plume's own schematic of the hepatic portal system (front view, viewBox 1000 x 1000).
   Patient faces the viewer: liver on the viewer's left, spleen on the right.
   Portal vein = splenic vein + superior mesenteric vein behind the neck of the pancreas;
   inferior mesenteric usually joins the splenic; left + right gastric, cystic, paraumbilical drain straight in.
   Then: liver → hepatic veins → inferior vena cava → heart. */
export type PV = "PV" | "SPL" | "SMV" | "IMV" | "LG" | "RG" | "CY" | "PU" | "IVC";
export const PNAME: Record<PV, string> = {
  PV: "Hepatic portal vein", SPL: "Splenic vein", SMV: "Superior mesenteric vein", IMV: "Inferior mesenteric vein",
  LG: "Left gastric vein", RG: "Right gastric vein", CY: "Cystic vein", PU: "Paraumbilical veins", IVC: "Inferior vena cava",
};
export const PSHORT: Record<PV, string> = { PV: "portal vein", SPL: "splenic", SMV: "superior mesenteric", IMV: "inferior mesenteric", LG: "left gastric", RG: "right gastric", CY: "cystic", PU: "paraumbilical", IVC: "IVC" };
export const PCOL: Record<PV, string> = { PV: "#2F5E9E", SPL: "#7A4FB0", SMV: "#2E8C7A", IMV: "#D9741C", LG: "#C2398A", RG: "#C2398A", CY: "#5C8F2A", PU: "#5C8F2A", IVC: "#4A5A6A" };
type P = [number, number];
export const PANCH: Record<string, P> = {
  PV: [405, 420], SPL: [760, 486], SMV: [462, 770], IMV: [780, 760], LG: [560, 330], RG: [520, 448], CY: [318, 470], PU: [236, 515],
  IVC: [300, 150], LIVER: [235, 230], HEART: [300, 52], GUT: [560, 800], PANC: [700, 540], SPLEEN: [905, 400], STOM: [740, 300], J: [470, 520], GB: [330, 420],
};

const D: Record<PV, string[]> = {
  PV: ["M470 520 C 455 470, 430 420, 410 360", "M410 360 C 380 320, 300 300, 210 288", "M410 360 C 440 320, 500 290, 565 250"],
  SPL: ["M858 430 C 800 470, 720 500, 640 510 C 580 516, 520 520, 470 520"],
  SMV: ["M440 905 C 445 870, 450 840, 455 800 C 470 700, 478 600, 470 520", "M320 705 C 360 662, 420 648, 463 640", "M622 762 C 580 722, 520 700, 467 700", "M300 832 C 350 800, 400 770, 459 760", "M600 882 C 560 852, 510 830, 456 822", "M228 680 C 290 660, 380 668, 465 680"],
  IMV: ["M782 905 C 792 820, 772 720, 722 640 C 692 592, 662 545, 642 511", "M640 950 C 680 920, 720 870, 762 820"],
  LG: ["M648 282 C 590 300, 520 345, 434 410"],
  RG: ["M588 446 C 545 440, 495 452, 450 458"],
  CY: ["M338 386 C 348 360, 362 345, 384 338"],
  PU: ["M196 548 C 262 482, 330 422, 404 366"],
  IVC: ["M300 470 L 300 92", "M232 232 L 298 200", "M372 222 L 302 190"],
};
const W: Record<PV, number> = { PV: 30, SPL: 20, SMV: 20, IMV: 14, LG: 10, RG: 10, CY: 9, PU: 8, IVC: 26 };

const LIVER = "M84 255 C 82 160, 220 104, 420 112 C 560 118, 650 140, 668 196 C 610 262, 526 330, 434 384 C 334 438, 196 446, 126 404 C 92 378, 84 322, 84 255 Z";
const STOM = "M612 176 C 672 130, 790 140, 830 214 C 868 292, 846 402, 764 452 C 694 492, 610 484, 566 446 L 594 420 C 644 444, 718 432, 748 384 C 778 334, 762 258, 704 238 C 664 226, 636 244, 626 262 Z";
const ESO = "M612 176 C 606 150, 604 120, 606 96 L 636 96 C 634 124, 636 150, 640 176 Z";
const PANC = "M430 522 C 470 492, 560 502, 650 497 C 740 492, 820 470, 862 470 C 874 490, 862 522, 832 532 C 742 547, 622 562, 522 572 C 470 577, 430 562, 430 522 Z";
const COLON = "M226 905 L 226 640 C 226 612, 246 602, 276 602 L 760 602 C 790 602, 804 614, 804 642 L 804 880 C 804 930, 700 962, 622 962";
const SI = "M318 650 C 300 700, 300 840, 360 880 C 430 920, 610 910, 680 870 C 740 830, 740 680, 700 650 C 660 628, 360 626, 318 650 Z";
const HEART = "M300 92 C 270 70, 238 72, 238 46 C 238 22, 268 14, 300 40 C 332 14, 362 22, 362 46 C 362 72, 330 70, 300 92 Z";

export const Portal: React.FC<{
  t: number; w: number; id: string;
  lit?: Partial<Record<PV, number>>; hot?: PV[]; dim?: number; flow?: number;
  liver?: number; heart?: number; gut?: number; panc?: number; showIVC?: number; join?: number;
}> = ({ t, w, id, lit = {}, hot = [], dim = 0.28, flow = 0, liver = -1, heart = -1, gut = -1, panc = -1, showIVC = 0, join = -1 }) => {
  const on = (k: PV) => (lit[k] === undefined ? 0 : ramp(t, lit[k]! - 0.05, lit[k]! + 0.45));
  const glow = (t0: number) => (t0 < 0 ? 0 : ramp(t, t0 - 0.05, t0 + 0.3));
  const lg = glow(liver), hg = glow(heart), gg = glow(gut), pg = glow(panc);
  const pulse = (Math.sin(t * 6) + 1) / 2;
  const order: PV[] = ["IVC", "PU", "CY", "LG", "RG", "IMV", "SMV", "SPL", "PV"];
  return (
    <svg width={w} height={w} viewBox="0 0 1000 1000" style={{ overflow: "visible" }}>
      <defs>
        <filter id={`gl${id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <pattern id={`si${id}`} width={44} height={44} patternUnits="userSpaceOnUse">
          <path d="M0 22 C 11 6, 33 6, 44 22 C 33 38, 11 38, 0 22" fill="none" stroke="#C89A7A" strokeWidth={4} />
        </pattern>
      </defs>
      {/* organs */}
      <g>
        <path d={SI} fill="#F3D3BC" stroke="#B9886A" strokeWidth={5} />
        <path d={SI} fill={`url(#si${id})`} opacity={0.8} />
        <path d={COLON} fill="none" stroke="#B9886A" strokeWidth={66} strokeLinecap="round" strokeLinejoin="round" />
        <path d={COLON} fill="none" stroke="#EBC3A6" strokeWidth={54} strokeLinecap="round" strokeLinejoin="round" />
        <path d={COLON} fill="none" stroke="#D8A988" strokeWidth={54} strokeDasharray="6 40" strokeLinejoin="round" />
        {gg > 0 && <path d={SI} fill="#F2D14E" opacity={0.35 * gg} />}
        {gg > 0 && <path d={COLON} fill="none" stroke="#F2D14E" strokeWidth={56} opacity={0.3 * gg} strokeLinecap="round" strokeLinejoin="round" />}
        <path d={ESO} fill="#E7B9A6" stroke="#9E6B58" strokeWidth={5} />
        <path d={STOM} fill="#EFC0AE" stroke="#9E6B58" strokeWidth={6} />
        <ellipse cx={900} cy={400} rx={52} ry={96} transform="rotate(14 900 400)" fill="#A8607E" stroke="#6E3550" strokeWidth={6} />
        <path d={PANC} fill="#EED58E" stroke="#B79A45" strokeWidth={6} />
        {pg > 0 && <path d={PANC} fill="none" stroke="#E5251A" strokeWidth={10} opacity={pg} />}
        <path d={PANC} fill="none" stroke="#C8AE5E" strokeWidth={3} strokeDasharray="10 14" opacity={0.7} />
        {showIVC > 0 && <path d={HEART} fill="#D0473A" stroke="#7A221A" strokeWidth={6} opacity={showIVC} transform={`translate(300 52) scale(${1 + 0.12 * hg * pulse}) translate(-300 -52)`} />}
        {lg > 0 && <path d={LIVER} fill="#F2D14E" filter={`url(#gl${id})`} opacity={0.75 * lg} />}
        <path d={LIVER} fill="#A9583F" stroke="#6B2E1E" strokeWidth={7} />
        <path d="M220 160 C 260 230, 300 300, 330 360 M520 150 C 470 210, 440 270, 420 330" stroke="#8E4632" strokeWidth={5} fill="none" opacity={0.6} />
        {lg > 0 && <path d={LIVER} fill="none" stroke="#F2D14E" strokeWidth={12} opacity={lg} />}
        <ellipse cx={330} cy={420} rx={30} ry={50} transform="rotate(-24 330 420)" fill="#8FB15A" stroke="#4E6E22" strokeWidth={5} />
        <g transform="translate(180 560)">
          <circle r={24} fill="#F3D3BC" stroke="#B9886A" strokeWidth={5} />
          <path d="M-10 0 C -4 -8, 4 -8, 10 0 C 4 8, -4 8, -10 0" fill="none" stroke="#9E6B58" strokeWidth={4} />
        </g>
      </g>
      {/* veins */}
      {order.map((k) => {
        if (k === "IVC" && showIVC <= 0) return null;
        const o = k === "IVC" ? showIVC : on(k);
        const isHot = hot.includes(k);
        const col = PCOL[k];
        return (
          <g key={k}>
            {D[k].map((d, i) => (
              <g key={i}>
                <path d={d} fill="none" stroke="#8C9AA8" strokeWidth={W[k] * (i === 0 ? 1 : 0.6)} strokeLinecap="round" opacity={dim * (1 - o)} strokeDasharray={k === "PU" ? "14 12" : undefined} />
                {o > 0 && isHot && <path d={d} fill="none" stroke="#F2D14E" strokeWidth={W[k] * (i === 0 ? 1 : 0.6) + 22 + 8 * pulse} strokeLinecap="round" opacity={0.85 * o} />}
                {o > 0 && <path d={d} fill="none" stroke="#14202E" strokeWidth={W[k] * (i === 0 ? 1 : 0.6) + 8} strokeLinecap="round" opacity={o} pathLength={1} strokeDasharray={`${o} 1`} />}
                {o > 0 && <path d={d} fill="none" stroke={col} strokeWidth={W[k] * (i === 0 ? 1 : 0.6)} strokeLinecap="round" opacity={o} pathLength={1} strokeDasharray={`${o} 1`} />}
                {o > 0.9 && flow > 0 && (
                  <path d={d} fill="none" stroke="#fff" strokeWidth={Math.max(4, W[k] * 0.3)} strokeLinecap="round" opacity={0.85 * flow} strokeDasharray="2 34" strokeDashoffset={-t * 90} />
                )}
              </g>
            ))}
          </g>
        );
      })}
      {join >= 0 && (() => {
        const j = ramp(t, join - 0.05, join + 0.3);
        return <circle cx={642} cy={511} r={20 + 10 * pulse} fill="none" stroke="#E5251A" strokeWidth={8} opacity={j} />;
      })()}
    </svg>
  );
};

/* chip shown on the diagram */
export const Chip: React.FC<{ x: number; y: number; p: number; col: string; children: React.ReactNode; size?: number }> = ({ x, y, p, col, children, size = 32 }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${0.7 + 0.3 * p})`, opacity: p, background: col, color: C.paper, border: `4px solid ${C.paper}`, boxShadow: "0 6px 0 rgba(31,42,20,0.25)", borderRadius: 16, padding: "4px 14px 7px", fontFamily: FONT, fontWeight: 800, fontSize: size, whiteSpace: "nowrap" }}>
    {children}
  </div>
);
