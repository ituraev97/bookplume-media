import React from "react";
import { C, FONT, ramp } from "./kit";

/**
 * Our own schematic of the aortic arch and its three branches, FRONT view (Book Plume illustration).
 * Viewer's left = patient's RIGHT. viewBox 860 x 900.
 */
export type PartId = "AR" | "BT" | "LCC" | "LSA" | "RCC" | "RSA";

// centre lines (drawn from the origin outward so they can "grow")
const ASC = "M352 640 C340 560 334 470 350 400";
const ARCH = "M350 400 C362 300 470 262 560 296 C612 316 640 360 640 420";
const DESC = "M640 420 C642 520 642 700 640 900";
const BT = "M392 318 C380 280 360 240 338 206";
const RCC = "M338 206 C330 150 322 90 318 0";
const RSA = "M338 206 C300 170 240 156 170 166 C120 172 70 190 0 196";
const LCC = "M474 282 C476 210 478 120 482 0";
const LSA = "M560 296 C572 250 586 210 610 186 C660 150 740 150 860 160";
const PULM = "M470 640 C478 590 488 540 500 500";
const PULM_R = "M500 500 C470 470 420 462 380 470";
const PULM_L = "M500 500 C540 470 600 466 680 470";
const SVC = "M276 0 C276 120 280 300 292 640";
const LBV = "M760 120 C640 150 470 200 300 240";

export const PATHS: Record<PartId, string> = { AR: ARCH, BT, LCC, LSA, RCC, RSA };

export const Aorta: React.FC<{
  t: number;
  w?: number;
  draw?: number; // aorta grows from the heart
  grow?: Partial<Record<PartId, number>>; // branch grow-in times (default: shown)
  lit?: Partial<Record<PartId, number>>; // time each part lights
  focus?: PartId | PartId[] | null;
  dimFrom?: number; // unlit parts dim from this time
  hi?: PartId[]; // only these at full strength
  letters?: boolean;
  letterOn?: Partial<Record<"A" | "B" | "C" | "S", number>>;
  arrow?: number; // "back and to the left" arrow time
  sides?: number; // RIGHT / LEFT tags time
  veins?: boolean;
}> = ({ t, w = 860, draw, grow, lit = {}, focus = null, dimFrom, hi, letters = false, letterOn = {}, arrow, sides, veins = true }) => {
  const s = w / 860;
  const dimP = dimFrom === undefined ? 0 : ramp(t, dimFrom, dimFrom + 0.4);
  const on = (id: PartId) => (lit[id] === undefined ? 0 : ramp(t, lit[id]! - 0.05, lit[id]! + 0.3));
  const fs = focus === null ? [] : Array.isArray(focus) ? focus : [focus];
  const alpha = (id: PartId) => {
    if (hi) return hi.includes(id) ? 1 : 0.25;
    return 1 - 0.7 * dimP * (1 - on(id));
  };
  const glow = (id: PartId) => (fs.includes(id) ? on(id) * (0.75 + 0.25 * Math.sin(t * 7)) : 0);
  const gP = (id: PartId) => (grow && grow[id] !== undefined ? ramp(t, grow[id]!, grow[id]! + 0.55) : 1);
  const dP = draw === undefined ? 1 : ramp(t, draw, draw + 1.6);
  // aorta pieces share one grow: asc 0..0.3, arch 0.3..0.75, desc 0.75..1
  const seg = (a: number, b: number) => Math.max(0, Math.min(1, (dP - a) / (b - a)));

  const Tube: React.FC<{ d: string; width: number; fill: string; dark: string; light?: string; g?: number; glowA?: number; op?: number }> = ({ d, width, fill, dark, light, g = 1, glowA = 0, op = 1 }) => {
    if (g <= 0) return null;
    const dash = g >= 1 ? undefined : `${g} 1`;
    const P = (p: React.SVGProps<SVGPathElement>) => <path d={d} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={dash} {...p} />;
    return (
      <g opacity={op}>
        {glowA > 0 && P({ stroke: C.banana, strokeWidth: width + 30, opacity: glowA * 0.9 })}
        {P({ stroke: C.forest, strokeWidth: width + 8 })}
        {P({ stroke: dark, strokeWidth: width })}
        {P({ stroke: fill, strokeWidth: width * 0.66, transform: "translate(-2 -1)" })}
        {P({ stroke: light ?? "#FFFFFF", strokeWidth: width * 0.15, opacity: 0.55, transform: `translate(${-width * 0.2} ${-width * 0.08})` })}
      </g>
    );
  };
  const ART = { fill: "#D8574B", dark: "#A23125", light: "#FFD9CF" };
  const VEIN = { fill: "#6E9BCB", dark: "#3E6B9A", light: "#E2EEFA" };

  const badge = (l: "A" | "B" | "C" | "S", x: number, y: number) => {
    const tt = letterOn[l];
    const p = tt === undefined ? 0 : ramp(t, tt, tt + 0.3);
    const pulse = p > 0 && p < 1 ? Math.sin(p * Math.PI) : 0;
    return (
      <g key={l} transform={`translate(${x} ${y}) scale(${1 + 0.18 * pulse})`} opacity={0.4 + 0.6 * p}>
        <circle r={34} fill={p > 0.5 ? C.banana : C.paper} stroke={C.forest} strokeWidth={5} />
        <text y={15} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill={C.forest}>{l}</text>
      </g>
    );
  };

  return (
    <svg width={860 * s} height={900 * s} viewBox="0 0 860 900" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="ao_heart" cx="0.42" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#E59A8A" />
          <stop offset="0.6" stopColor="#C9675A" />
          <stop offset="1" stopColor="#9C4438" />
        </radialGradient>
        <linearGradient id="ao_fat" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F4E3B8" />
          <stop offset="1" stopColor="#E8CF92" />
        </linearGradient>
        <linearGradient id="ao_trach" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#D9D2BC" />
          <stop offset="0.5" stopColor="#F4F0E2" />
          <stop offset="1" stopColor="#D2CAB2" />
        </linearGradient>
        <linearGradient id="ao_fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={0} />
          <stop offset="0.07" stopColor="#fff" stopOpacity={1} />
        </linearGradient>
        <mask id="ao_topFade" maskUnits="userSpaceOnUse" x={-200} y={0} width={1260} height={900}>
          <rect x={-200} y={0} width={1260} height={900} fill="url(#ao_fade)" />
        </mask>
      </defs>

      <g mask="url(#ao_topFade)">
        {/* trachea behind everything (midline) */}
        <g opacity={0.9 * (1 - 0.4 * dimP)}>
          <rect x={372} y={0} width={70} height={330} rx={30} fill="url(#ao_trach)" stroke={C.forest} strokeWidth={4} />
          {Array.from({ length: 11 }, (_, i) => (
            <path key={i} d={`M376 ${18 + i * 28} Q407 ${30 + i * 28} 438 ${18 + i * 28}`} fill="none" stroke="#B8AE92" strokeWidth={5} strokeLinecap="round" />
          ))}
        </g>

        {/* descending aorta (behind the heart) */}
        <Tube d={DESC} width={60} {...ART} g={seg(0.75, 1)} op={alpha("AR")} glowA={glow("AR")} />

        {/* veins: SVC + left brachiocephalic vein (context, subtle) */}
        {veins && (
          <g opacity={0.5 * (1 - 0.5 * dimP)}>
            <Tube d={SVC} width={50} {...VEIN} />
          </g>
        )}

        {/* branches */}
        <Tube d={RSA} width={34} {...ART} g={gP("BT") > 0.6 ? gP("RSA") : 0} op={alpha("RSA")} glowA={glow("RSA")} />
        <Tube d={RCC} width={32} {...ART} g={gP("BT") > 0.6 ? gP("RCC") : 0} op={alpha("RCC")} glowA={glow("RCC")} />
        <Tube d={BT} width={46} {...ART} g={gP("BT")} op={alpha("BT")} glowA={glow("BT")} />
        <Tube d={LCC} width={32} {...ART} g={gP("LCC")} op={alpha("LCC")} glowA={glow("LCC")} />
        <Tube d={LSA} width={34} {...ART} g={gP("LSA")} op={alpha("LSA")} glowA={glow("LSA")} />

        {/* ascending aorta + arch */}
        <Tube d={ASC} width={74} {...ART} g={seg(0, 0.3)} op={alpha("AR")} glowA={glow("AR")} />
        <Tube d={ARCH} width={72} {...ART} g={seg(0.3, 0.75)} op={alpha("AR")} glowA={glow("AR")} />

        {/* pulmonary trunk + arteries (under the arch) */}
        <g opacity={0.85 * (1 - 0.55 * dimP)}>
          <Tube d={PULM_R} width={34} {...VEIN} />
          <Tube d={PULM_L} width={34} {...VEIN} />
          <Tube d={PULM} width={58} {...VEIN} />
        </g>

        {/* heart */}
        <g opacity={1 - 0.45 * dimP}>
          <path d="M250 640 C230 590 300 560 360 580 C420 560 520 560 560 600 C640 620 700 680 690 760 C680 840 600 900 520 900 L330 900 C260 860 220 760 250 640 Z" fill="url(#ao_heart)" stroke={C.forest} strokeWidth={5} />
          {/* right auricle */}
          <path d="M250 640 C226 620 214 660 232 690 C244 712 262 700 266 680" fill="#D47A6B" stroke={C.forest} strokeWidth={4} />
          {/* fat in the grooves */}
          <path d="M520 600 C500 700 470 800 430 900" fill="none" stroke="url(#ao_fat)" strokeWidth={22} strokeLinecap="round" opacity={0.85} />
          <path d="M520 600 C500 700 470 800 430 900" fill="none" stroke="#B2453A" strokeWidth={5} strokeLinecap="round" />
          <path d="M300 640 C290 720 300 800 330 880" fill="none" stroke="url(#ao_fat)" strokeWidth={16} strokeLinecap="round" opacity={0.75} />
          <path d="M300 640 C290 720 300 800 330 880" fill="none" stroke="#B2453A" strokeWidth={4} strokeLinecap="round" />
          {Array.from({ length: 7 }, (_, i) => (
            <path key={i} d={`M${560 + i * 12} ${640 + i * 18} C${610 + i * 6} ${700 + i * 14} ${600 - i * 4} ${800 + i * 6} ${560 - i * 10} ${880}`} fill="none" stroke="#A8493D" strokeWidth={2} opacity={0.35} />
          ))}
          <ellipse cx={360} cy={700} rx={50} ry={30} fill="#fff" opacity={0.12} />
        </g>
      </g>

      {/* "back and to the left" arrow over the arch */}
      {arrow !== undefined && (() => {
        const p = ramp(t, arrow, arrow + 0.7);
        const fade = 1 - ramp(t, arrow + 2.6, arrow + 3.0);
        if (p <= 0 || fade <= 0) return null;
        return (
          <g opacity={fade}>
            <path d="M330 300 C380 190 540 180 640 280" fill="none" stroke={C.forest} strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 1`} />
            <path d="M330 300 C380 190 540 180 640 280" fill="none" stroke={C.banana} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 1`} />
            {p > 0.95 && <path d="M606 284 L646 288 L640 248" fill="none" stroke={C.forest} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />}
          </g>
        );
      })()}

      {/* patient RIGHT / LEFT tags */}
      {sides !== undefined && (() => {
        const p = ramp(t, sides, sides + 0.35);
        if (p <= 0) return null;
        const tag = (x: number, txt: string) => (
          <g transform={`translate(${x} 868)`} opacity={p}>
            <rect x={-92} y={-30} width={184} height={56} rx={28} fill={C.forest} />
            <text y={10} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} letterSpacing={3} fill={C.paper}>{txt}</text>
          </g>
        );
        return (
          <>
            {tag(110, "RIGHT")}
            {tag(750, "LEFT")}
          </>
        );
      })()}

      {/* mnemonic letters on each part */}
      {letters && (
        <>
          {badge("A", 520, 360)}
          {badge("B", 330, 300)}
          {badge("C", 540, 120)}
          {badge("S", 690, 230)}
        </>
      )}
    </svg>
  );
};
