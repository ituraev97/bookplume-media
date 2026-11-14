import React from "react";
import { C, FONT, ramp } from "./kit";

/**
 * Our own schematic of the stomach, small intestine (duodenum, jejunum, ileum) and the start of the large intestine,
 * FRONT view (Book Plume illustration). Viewer's left = patient's RIGHT. viewBox 860 x 900.
 */
export type GutId = "ST" | "DU" | "JE" | "IL" | "LI" | "PA";

const ESO = "M612 0 C612 30 610 60 606 92";
const STOMACH =
  "M606 86 C640 30 740 26 782 96 C818 160 806 250 752 304 C700 352 600 360 520 344 C480 336 450 322 432 310 C440 290 452 282 470 284 C520 292 566 284 590 252 C612 222 610 170 598 128 C594 112 598 98 606 86 Z";
const DU = "M432 304 C392 300 348 302 322 334 C296 368 294 470 314 520 C334 566 420 578 482 562 C524 550 548 516 550 470";
const JE =
  "M550 470 C560 428 640 428 690 448 C760 476 790 520 742 552 C692 584 604 542 562 572 C522 602 558 652 620 642 C690 630 770 612 790 662 C806 706 742 732 682 716 C624 702 574 700 544 722";
const IL =
  "M544 722 C512 762 540 822 482 832 C424 842 410 772 450 742 C490 712 452 652 392 662 C332 672 352 742 312 772 C282 796 322 852 272 852 C238 852 226 812 206 798";
const COLON = "M150 836 C140 760 134 600 140 430";
const FOOD = DU + " " + JE.replace(/^M[\d.]+ [\d.]+ /, "") + " " + IL.replace(/^M[\d.]+ [\d.]+ /, "");
export const PANCREAS =
  "M346 402 C350 362 410 352 448 380 C520 404 620 372 700 360 C752 352 796 372 784 404 C772 434 702 434 622 442 C548 450 506 462 478 500 C448 534 366 528 352 476 C346 452 344 424 346 402 Z";

export const Gut: React.FC<{
  t: number;
  w?: number;
  grow?: Partial<Record<GutId, number>>; // grow-in times (default: shown)
  lit?: Partial<Record<GutId, number>>; // time each part lights
  focus?: GutId | GutId[] | null;
  dimFrom?: number;
  letters?: boolean;
  letterOn?: Partial<Record<"D" | "J" | "I", number>>;
  food?: [number, number]; // a bolus travels D -> J -> I between these times
  valve?: number; // ileocecal valve marker time
  tags?: number; // RIGHT / LEFT tags
}> = ({ t, w = 860, grow, lit = {}, focus = null, dimFrom, letters = false, letterOn = {}, food, valve, tags }) => {
  const s = w / 860;
  const dimP = dimFrom === undefined ? 0 : ramp(t, dimFrom, dimFrom + 0.4);
  const on = (id: GutId) => (lit[id] === undefined ? 0 : ramp(t, lit[id]! - 0.05, lit[id]! + 0.3));
  const fs = focus === null ? [] : Array.isArray(focus) ? focus : [focus];
  const alpha = (id: GutId) => 1 - 0.68 * dimP * (1 - on(id));
  const glow = (id: GutId) => (fs.includes(id) ? on(id) * (0.75 + 0.25 * Math.sin(t * 7)) : 0);
  const gP = (id: GutId, d = 0.9) => (grow && grow[id] !== undefined ? ramp(t, grow[id]!, grow[id]! + d) : 1);

  const Tube: React.FC<{ d: string; width: number; fill: string; dark: string; light?: string; g?: number; glowA?: number; op?: number; folds?: number }> = ({ d, width, fill, dark, light, g = 1, glowA = 0, op = 1, folds }) => {
    if (g <= 0) return null;
    const dash = g >= 1 ? undefined : `${g} 1`;
    const P = (p: React.SVGProps<SVGPathElement>) => <path d={d} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={dash} {...p} />;
    return (
      <g opacity={op}>
        {glowA > 0 && P({ stroke: C.banana, strokeWidth: width + 34, opacity: glowA * 0.9 })}
        {P({ stroke: C.forest, strokeWidth: width + 8 })}
        {P({ stroke: dark, strokeWidth: width })}
        {P({ stroke: fill, strokeWidth: width * 0.7, transform: "translate(-2 -1)" })}
        {folds !== undefined && g >= 1 && (
          <path d={d} fill="none" stroke={dark} strokeWidth={width * 0.62} strokeDasharray={`2.5 ${folds}`} strokeLinecap="round" opacity={0.42} transform="translate(-2 -1)" />
        )}
        {P({ stroke: light ?? "#FFFFFF", strokeWidth: width * 0.14, opacity: 0.55, transform: `translate(${-width * 0.18} ${-width * 0.1})` })}
      </g>
    );
  };
  const SI = { fill: "#EBA493", dark: "#B85F50", light: "#FFE3DA" };
  const DUO = { fill: "#E8B07A", dark: "#B3743C", light: "#FFEBD3" };
  const LI = { fill: "#B8C27A", dark: "#7D8842", light: "#F2F5D9" };

  const badge = (l: "D" | "J" | "I", x: number, y: number) => {
    const tt = letterOn[l];
    const p = tt === undefined ? 0 : ramp(t, tt, tt + 0.3);
    const pulse = p > 0 && p < 1 ? Math.sin(p * Math.PI) : 0;
    return (
      <g key={l} transform={`translate(${x} ${y}) scale(${1 + 0.2 * pulse})`} opacity={0.35 + 0.65 * p}>
        <circle r={36} fill={p > 0.5 ? C.banana : C.paper} stroke={C.forest} strokeWidth={5} />
        <text y={16} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={46} fill={C.forest}>{l}</text>
      </g>
    );
  };

  const stP = gP("ST", 0.6);
  const paP = gP("PA", 0.5);
  return (
    <svg width={860 * s} height={900 * s} viewBox="0 0 860 900" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="gu_st" cx="0.6" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#F2B9A6" />
          <stop offset="0.65" stopColor="#DC8D78" />
          <stop offset="1" stopColor="#B4604E" />
        </radialGradient>
        <linearGradient id="gu_pa" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F6DA9A" />
          <stop offset="1" stopColor="#E2B865" />
        </linearGradient>
        <linearGradient id="gu_fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={0} />
          <stop offset="0.07" stopColor="#fff" stopOpacity={1} />
        </linearGradient>
        <linearGradient id="gu_colfade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.42" stopColor="#fff" stopOpacity={0} />
          <stop offset="0.62" stopColor="#fff" stopOpacity={1} />
        </linearGradient>
        <mask id="gu_topFade" maskUnits="userSpaceOnUse" x={-200} y={0} width={1260} height={900}>
          <rect x={-200} y={0} width={1260} height={900} fill="url(#gu_fade)" />
        </mask>
        <mask id="gu_colMask" maskUnits="userSpaceOnUse" x={0} y={0} width={860} height={900}>
          <rect x={0} y={0} width={860} height={900} fill="url(#gu_colfade)" />
        </mask>
      </defs>

      {/* abdominal cavity, soft backdrop */}
      <path d="M70 60 C60 300 50 600 90 900 L780 900 C820 600 810 300 800 60 Z" fill="#EFEBD6" opacity={0.75 * (1 - 0.3 * dimP)} />

      <g mask="url(#gu_topFade)">
        {/* large intestine: cecum + ascending colon (+ appendix) */}
        <g opacity={gP("LI", 0.5) * alpha("LI")}>
          <g mask="url(#gu_colMask)">
            <Tube d={COLON} width={76} {...LI} glowA={glow("LI")} />
            {[0, 1, 2, 3, 4, 5, 6].map((i) => {
              const y = 470 + i * 50;
              return <path key={i} d={`M${108 - i * 0.6} ${y} Q${141 - i * 0.8} ${y + 14} ${174 - i * 1.0} ${y}`} fill="none" stroke={LI.dark} strokeWidth={5} strokeLinecap="round" opacity={0.75} />;
            })}
          </g>
          {glow("LI") > 0 && <ellipse cx={156} cy={826} rx={74} ry={62} fill={C.banana} opacity={glow("LI") * 0.9} />}
          <path d="M150 870 C152 900 176 916 200 904" fill="none" stroke={C.forest} strokeWidth={22} strokeLinecap="round" />
          <path d="M150 870 C152 900 176 916 200 904" fill="none" stroke={LI.dark} strokeWidth={14} strokeLinecap="round" />
          <ellipse cx={156} cy={826} rx={58} ry={48} fill={LI.fill} stroke={C.forest} strokeWidth={5} />
          <path d="M112 812 C130 800 176 800 200 812" fill="none" stroke={LI.dark} strokeWidth={4} opacity={0.6} />
          <ellipse cx={140} cy={812} rx={18} ry={10} fill="#fff" opacity={0.3} />
        </g>

        {/* esophagus + stomach */}
        <g opacity={stP * alpha("ST")} transform={`translate(0 ${(1 - stP) * -20})`}>
          {glow("ST") > 0 && <path d={STOMACH} fill="none" stroke={C.banana} strokeWidth={40} opacity={glow("ST") * 0.9} />}
          <path d={ESO} fill="none" stroke={C.forest} strokeWidth={42} strokeLinecap="round" />
          <path d={ESO} fill="none" stroke="#C97A68" strokeWidth={32} strokeLinecap="round" />
          <path d={STOMACH} fill="url(#gu_st)" stroke={C.forest} strokeWidth={6} strokeLinejoin="round" />
          {/* rugae hints */}
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M${640 + i * 26} ${120 + i * 8} C${660 + i * 22} ${190 + i * 14} ${640 + i * 12} ${270 - i * 4} ${580 + i * 10} ${300 + i * 4}`} fill="none" stroke="#B4604E" strokeWidth={3} opacity={0.35} />
          ))}
          <ellipse cx={720} cy={110} rx={36} ry={20} fill="#fff" opacity={0.22} transform="rotate(-20 720 110)" />
          {/* pyloric sphincter ring */}
          <rect x={426} y={290} width={14} height={30} rx={6} fill="#9C4C3E" stroke={C.forest} strokeWidth={3} />
        </g>

        {/* pancreas (behind the duodenum, head sits in the C) */}
        <g opacity={paP * alpha("PA")}>
          {glow("PA") > 0 && <path d={PANCREAS} fill="none" stroke={C.banana} strokeWidth={34} opacity={glow("PA") * 0.9} />}
          <path d={PANCREAS} fill="url(#gu_pa)" stroke={C.forest} strokeWidth={5} />
          {Array.from({ length: 22 }, (_, i) => {
            const x = 380 + ((i * 53) % 400), y = 392 + ((i * 37) % 52) - (x > 520 ? 16 : 0);
            return <circle key={i} cx={x} cy={y + (x < 470 ? 40 : 0)} r={7 + (i % 3) * 2} fill="none" stroke="#C59A45" strokeWidth={2.5} opacity={0.55} />;
          })}
        </g>

        {/* duodenum */}
        <Tube d={DU} width={54} {...DUO} g={gP("DU")} op={alpha("DU")} glowA={glow("DU")} folds={16} />
        {/* jejunum: wide, dense folds */}
        <Tube d={JE} width={50} {...SI} g={gP("JE", 1.2)} op={alpha("JE")} glowA={glow("JE")} folds={11} />
        {/* ileum: narrower, sparser folds */}
        <Tube d={IL} width={42} {...SI} g={gP("IL", 1.2)} op={alpha("IL")} glowA={glow("IL")} folds={24} />

        {/* food bolus travelling D -> J -> I */}
        {food && (() => {
          const p = ramp(t, food[0], food[1]);
          const fade = ramp(t, food[0], food[0] + 0.2) * (1 - ramp(t, food[1], food[1] + 0.3));
          if (fade <= 0) return null;
          return (
            <g opacity={fade}>
              <path d={FOOD} fill="none" stroke={C.forest} strokeWidth={34} strokeLinecap="round" pathLength={1} strokeDasharray="0.012 2" strokeDashoffset={-p * 0.988} />
              <path d={FOOD} fill="none" stroke={C.banana} strokeWidth={24} strokeLinecap="round" pathLength={1} strokeDasharray="0.012 2" strokeDashoffset={-p * 0.988} />
            </g>
          );
        })()}

        {/* ileocecal valve */}
        {valve !== undefined && (() => {
          const p = ramp(t, valve, valve + 0.35);
          if (p <= 0) return null;
          const pulse = 1 + 0.12 * Math.sin(t * 8);
          return (
            <g transform={`translate(206 798) scale(${(0.5 + 0.5 * p) * pulse})`} opacity={p}>
              <circle r={30} fill="none" stroke={C.banana} strokeWidth={12} />
              <circle r={30} fill="none" stroke={C.forest} strokeWidth={4} />
              <circle r={42} fill="none" stroke={C.forest} strokeWidth={3} />
            </g>
          );
        })()}
      </g>

      {tags !== undefined && (() => {
        const p = ramp(t, tags, tags + 0.35);
        if (p <= 0) return null;
        const tag = (x: number, txt: string) => (
          <g transform={`translate(${x} 30)`} opacity={p}>
            <rect x={-100} y={-28} width={200} height={54} rx={27} fill={C.forest} />
            <text y={10} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} letterSpacing={3} fill={C.paper}>{txt}</text>
          </g>
        );
        return (
          <>
            {tag(150, "RIGHT")}
            {tag(710, "LEFT")}
          </>
        );
      })()}

      {letters && (
        <>
          {badge("D", 250, 430)}
          {badge("J", 700, 590)}
          {badge("I", 330, 860)}
        </>
      )}
    </svg>
  );
};
