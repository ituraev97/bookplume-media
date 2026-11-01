import React from "react";
import { C, FONT, ramp } from "./kit";

/**
 * Our own schematic frontal section of the heart (Book Plume illustration). viewBox 860 x 680.
 * Viewer's left = patient's RIGHT side (RA, RV, pulmonary trunk), viewer's right = LEFT side (LA, LV, aorta).
 * Valves: T tricuspid (RA->RV), P pulmonary (RV->pulmonary trunk), M mitral (LA->LV), A aortic (LV->aorta).
 */
export type PartId = "T" | "P" | "M" | "A" | "RA" | "RV" | "LA" | "LV" | "CH";

const ART = { fill: "#D8574B", dark: "#A23125", light: "#FFD9CF", cav: "#F2A497", cavDark: "#E07F70" };
const VEIN = { fill: "#6E9BCB", dark: "#3E6B9A", light: "#E2EEFA", cav: "#A9C6E6", cavDark: "#86ABD6" };
const MUSCLE = { fill: "#C9705F", dark: "#9C4A3B", light: "#E9A08F", fat: "#F1D9A6" };

// chambers
const RA = "M215 158 C 288 158 312 212 308 262 C 304 305 286 330 262 336 L 168 336 C 140 322 126 292 128 252 C 130 200 160 158 215 158 Z";
const LA = "M662 176 C 722 176 748 214 746 258 C 744 300 728 326 708 336 L 606 336 C 586 322 576 296 578 262 C 580 214 606 176 662 176 Z";
const RV = "M150 352 L 412 352 C 420 430 430 520 520 606 C 410 598 280 552 202 478 C 166 440 150 400 150 352 Z";
const LV = "M452 350 L 726 350 C 736 442 708 540 646 616 C 610 646 566 638 546 606 C 474 520 452 430 452 350 Z";
const OUTER =
  "M228 128 C 140 124 96 200 104 290 C 110 380 128 450 196 522 C 280 604 420 650 560 672 C 612 680 650 656 694 604 C 760 520 782 420 772 330 C 764 250 770 168 700 138 C 650 118 600 128 560 150 L 300 150 C 280 136 256 128 228 128 Z";

// vessels (centre lines)
const SVC = "M182 -20 L 186 190";
const IVC = "M176 330 L 170 700";
const PT = "M366 348 C 366 280 364 200 368 132";
const RPA = "M368 132 C 330 96 250 88 160 92 C 110 94 60 98 10 104";
const LPA = "M368 132 C 420 132 520 140 620 142 C 700 144 780 140 870 132";
const AO = "M494 346 C 494 250 488 150 500 100 C 520 30 640 10 740 40 C 800 58 820 110 822 200 L 822 330";
const PV1 = "M744 236 L 860 222";
const PV2 = "M744 288 L 860 300";

export const FLOW_R = "M184 -10 L 186 230 C 200 300 220 330 228 350 C 230 420 260 470 330 470 C 370 466 370 420 366 340 L 368 132 C 330 96 200 88 0 100";
export const FLOW_L = "M860 230 L 680 250 C 660 290 656 320 656 350 C 650 430 640 480 590 500 C 520 500 494 420 494 346 L 496 120 C 520 30 640 10 740 40 C 800 58 822 110 822 330";

const rnd = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

export const Heart: React.FC<{
  t: number;
  w?: number;
  lit?: Partial<Record<PartId, number>>;
  focus?: PartId[];
  dimFrom?: number;
  letters?: Partial<Record<"T" | "P" | "M" | "A", number>>;
  flowR?: [number, number]; // blood flow dots, right side, between these times
  flowL?: [number, number];
  build?: number; // heart builds in
  chordae?: number; // chordae + papillary muscles highlighted from this time
  tags?: number; // chamber names visible from this time
  lungs?: number; // "to lungs" arrows
}> = ({ t, w = 860, lit = {}, focus = [], dimFrom, letters = {}, flowR, flowL, build, chordae, tags = 0, lungs }) => {
  const s = w / 860;
  const dimP = dimFrom === undefined ? 0 : ramp(t, dimFrom, dimFrom + 0.4);
  const on = (id: PartId) => (lit[id] === undefined ? 0 : ramp(t, lit[id]! - 0.05, lit[id]! + 0.3));
  const op = (id: PartId) => 1 - 0.6 * dimP * (1 - on(id));
  const glow = (id: PartId) => (focus.includes(id) ? on(id) * (0.72 + 0.28 * Math.sin(t * 7)) : 0);
  const bP = build === undefined ? 1 : ramp(t, build, build + 0.7);
  const bV = build === undefined ? 1 : ramp(t, build + 0.35, build + 1.1);
  const chP = chordae === undefined ? 0 : ramp(t, chordae, chordae + 0.4);
  const beat = 1 + 0.012 * Math.max(0, Math.sin(t * 7.2)) ** 6;
  const flut = (k: number) => Math.sin(t * 5 + k) * 3;

  const Tube: React.FC<{ d: string; width: number; c: typeof ART; g?: number; o?: number }> = ({ d, width, c, g = 1, o = 1 }) => {
    const veil = 1 - o;
    if (g <= 0) return null;
    const dash = g >= 1 ? undefined : `${g} 1`;
    const P = (p: React.SVGProps<SVGPathElement>) => <path d={d} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={dash} {...p} />;
    return (
      <g>
        {P({ stroke: C.forest, strokeWidth: width + 9 })}
        {P({ stroke: c.dark, strokeWidth: width })}
        {P({ stroke: c.fill, strokeWidth: width * 0.68, transform: "translate(-2 -2)" })}
        {P({ stroke: c.light, strokeWidth: width * 0.14, opacity: 0.6, transform: `translate(${-width * 0.2} ${-width * 0.1})` })}
        {veil > 0.01 && P({ stroke: C.card, strokeWidth: width - 2, opacity: veil * 0.9 })}
      </g>
    );
  };

  // trabeculae / texture lines inside the myocardium
  const fibres = Array.from({ length: 26 }, (_, i) => {
    const x = 140 + rnd(i) * 600;
    const y = 360 + rnd(i + 30) * 280;
    return { x, y, r: 30 + rnd(i + 60) * 40, a: rnd(i + 90) * 3 };
  });

  const glowRing = (id: PartId, cx: number, cy: number, rx: number, ry: number) => {
    const g = glow(id);
    if (g <= 0) return null;
    return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={C.banana} strokeWidth={14} opacity={g} />;
  };
  const chamberGlow = (id: PartId, d: string) => {
    const g = glow(id);
    if (g <= 0) return null;
    return <path d={d} fill="none" stroke={C.banana} strokeWidth={12} opacity={g * 0.9} />;
  };

  // AV leaflet (flap hanging into the ventricle)
  const flap = (x0: number, x1: number, y: number, tipX: number, tipY: number, k: number, fill: string) => (
    <path d={`M${x0} ${y} C ${x0 + 4} ${y + (tipY - y) * 0.55} ${tipX - 14 + flut(k)} ${tipY - 4} ${tipX + flut(k)} ${tipY} C ${tipX + 14 + flut(k)} ${tipY - 4} ${x1 - 4} ${y + (tipY - y) * 0.55} ${x1} ${y} Z`} fill={fill} stroke={MUSCLE.dark} strokeWidth={3.5} strokeLinejoin="round" />
  );
  // papillary muscle mound
  const papilla = (x: number, y: number, h: number, rot: number) => (
    <path d={`M${x - 18} ${y + 14} C ${x - 18} ${y - h * 0.5} ${x - 8} ${y - h} ${x} ${y - h} C ${x + 8} ${y - h} ${x + 18} ${y - h * 0.5} ${x + 18} ${y + 14} Z`} transform={`rotate(${rot} ${x} ${y})`} fill={MUSCLE.fill} stroke={C.forest} strokeWidth={4} />
  );
  const cords = (tips: [number, number][], pap: [number, number][], k: number) => (
    <g stroke={chP > 0 ? C.forest : "#5B3A2E"} strokeWidth={chP > 0 ? 3.2 : 2.2} opacity={0.75 + 0.25 * chP}>
      {tips.map(([tx, ty], i) =>
        pap.map(([px, py], j) => (Math.abs(tx - px) < 110 ? <line key={`${i}-${j}`} x1={tx + flut(k + i)} y1={ty} x2={px} y2={py} /> : null)),
      )}
    </g>
  );
  // semilunar valve in section: three little cups
  const semilunar = (cx: number, y: number, c: typeof ART, k: number) => (
    <g>
      {[-1, 0, 1].map((i) => (
        <path key={i} d={`M${cx + i * 19 - 12} ${y} Q ${cx + i * 19} ${y + 22 + flut(k + i) * 0.6} ${cx + i * 19 + 12} ${y}`} fill={i === 0 ? c.light : "#FFF6EE"} stroke={C.forest} strokeWidth={3.5} />
      ))}
    </g>
  );

  const badge = (l: "T" | "P" | "M" | "A", x: number, y: number) => {
    const tt = letters[l];
    if (tt === undefined) return null;
    const p = ramp(t, tt, tt + 0.3);
    if (p <= 0) return null;
    const pulse = p < 1 ? Math.sin(p * Math.PI) : 0;
    return (
      <g key={l} transform={`translate(${x} ${y}) scale(${(0.6 + 0.4 * p) * (1 + 0.2 * pulse)})`} opacity={p}>
        <circle r={33} fill={C.banana} stroke={C.forest} strokeWidth={5} />
        <text y={15} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={42} fill={C.forest}>{l}</text>
      </g>
    );
  };
  const tag = (txt: string, x: number, y: number, id: PartId) => (
    <text x={x} y={y} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.forest} opacity={ramp(t, tags, tags + 0.4) * (0.45 + 0.55 * op(id))} letterSpacing={1}>{txt}</text>
  );

  const flowDots = (d: string, win: [number, number] | undefined, col: string, key: string) => {
    if (!win) return null;
    const a = ramp(t, win[0], win[0] + 0.3) * (1 - ramp(t, win[1] - 0.3, win[1]));
    if (a <= 0) return null;
    const off = -((t - win[0]) * 0.22) % 1;
    return (
      <g key={key} opacity={a}>
        <path d={d} fill="none" stroke={C.paper} strokeWidth={13} strokeLinecap="round" strokeDasharray="0.012 0.03" pathLength={1} strokeDashoffset={off} opacity={0.9} />
        <path d={d} fill="none" stroke={col} strokeWidth={8} strokeLinecap="round" strokeDasharray="0.012 0.03" pathLength={1} strokeDashoffset={off} />
      </g>
    );
  };

  const lungP = lungs === undefined ? 0 : ramp(t, lungs, lungs + 0.35);

  return (
    <svg width={860 * s} height={680 * s} viewBox="0 0 860 680" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="h39m" cx="45%" cy="40%" r="70%">
          <stop offset="0%" stopColor={MUSCLE.light} />
          <stop offset="60%" stopColor={MUSCLE.fill} />
          <stop offset="100%" stopColor={MUSCLE.dark} />
        </radialGradient>
        <radialGradient id="h39v" cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#D7E6F5" />
          <stop offset="100%" stopColor={VEIN.cavDark} />
        </radialGradient>
        <radialGradient id="h39a" cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#FCD3CB" />
          <stop offset="100%" stopColor={ART.cavDark} />
        </radialGradient>
      </defs>

      {/* vessels behind the heart */}
      <g opacity={bV}>
        <Tube d={IVC} width={44} c={VEIN} o={op("RA")} />
        <Tube d={RPA} width={40} c={VEIN} o={op("P")} />
        <Tube d={LPA} width={40} c={VEIN} o={op("P")} />
        <Tube d={PV1} width={30} c={ART} o={op("LA")} />
        <Tube d={PV2} width={30} c={ART} o={op("LA")} />
      </g>

      <g transform={`translate(430 400) scale(${(0.85 + 0.15 * bP) * beat}) translate(-430 -400)`} opacity={bP}>
        {/* myocardium */}
        <path d={OUTER} fill="url(#h39m)" stroke={C.forest} strokeWidth={7} strokeLinejoin="round" />
        {fibres.map((f, i) => (
          <path key={i} d={`M${f.x} ${f.y} q ${f.r * 0.5} ${-f.r * 0.3} ${f.r} 0`} fill="none" stroke={MUSCLE.dark} strokeWidth={2} opacity={0.35} transform={`rotate(${f.a * 10} ${f.x} ${f.y})`} />
        ))}
        {/* epicardial fat + coronary groove hint */}

        {/* chambers */}
        <path d={RA} fill="url(#h39v)" stroke={C.forest} strokeWidth={5} /><path d={RA} fill={C.card} opacity={(1 - op("RA")) * 1.15} />
        <path d={RV} fill="url(#h39v)" stroke={C.forest} strokeWidth={5} /><path d={RV} fill={C.card} opacity={(1 - op("RV")) * 1.15} />
        <path d={LA} fill="url(#h39a)" stroke={C.forest} strokeWidth={5} /><path d={LA} fill={C.card} opacity={(1 - op("LA")) * 1.15} />
        <path d={LV} fill="url(#h39a)" stroke={C.forest} strokeWidth={5} /><path d={LV} fill={C.card} opacity={(1 - op("LV")) * 1.15} />
        {/* trabeculae carneae hints along ventricle walls */}
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={"rt" + i} d={`M${190 + i * 48} ${540 - i * 6 + (i > 2 ? 20 : 0)} q 12 -18 24 0`} fill="none" stroke={VEIN.dark} strokeWidth={3} opacity={0.5 * op("RV")} />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={"lt" + i} d={`M${520 + i * 34} ${590 - Math.abs(i - 2) * 22} q 12 -18 24 0`} fill="none" stroke={ART.dark} strokeWidth={3} opacity={0.5 * op("LV")} />
        ))}

        {/* papillary muscles + chordae */}
        <g opacity={Math.max(op("T"), op("CH"))}>
          {cords([[178, 410], [228, 424], [282, 412]], [[214, 500], [292, 512]], 0)}
          {papilla(214, 506, 46, 6)}
          {papilla(292, 518, 40, -12)}
        </g>
        <g opacity={Math.max(op("M"), op("CH"))}>
          {cords([[622, 420], [690, 420]], [[606, 528], [696, 524]], 2)}
          {papilla(606, 534, 50, 8)}
          {papilla(696, 530, 46, -10)}
        </g>
        {chP > 0 && (
          <g opacity={chP * (0.6 + 0.4 * Math.sin(t * 7))} fill="none" stroke={C.banana} strokeWidth={10}>
            <ellipse cx={240} cy={470} rx={95} ry={70} />
            <ellipse cx={656} cy={478} rx={88} ry={72} />
          </g>
        )}

        {/* AV valves */}
        <g opacity={op("T")}>
          <ellipse cx={225} cy={344} rx={86} ry={14} fill={MUSCLE.fat} stroke={C.forest} strokeWidth={4} />
          {flap(144, 196, 346, 178, 410, 0, "#F4DCC6")}
          {flap(190, 262, 348, 228, 424, 1, "#F9E8D6")}
          {flap(256, 306, 346, 282, 412, 2, "#F4DCC6")}
        </g>
        <g opacity={op("M")}>
          <ellipse cx={656} cy={344} rx={76} ry={14} fill={MUSCLE.fat} stroke={C.forest} strokeWidth={4} />
          {flap(582, 654, 346, 622, 420, 3, "#F9E8D6")}
          {flap(656, 730, 346, 690, 420, 4, "#F4DCC6")}
        </g>

        {chamberGlow("RA", RA)}
        {chamberGlow("RV", RV)}
        {chamberGlow("LA", LA)}
        {chamberGlow("LV", LV)}
        {glowRing("T", 225, 380, 108, 58)}
        {glowRing("M", 656, 384, 100, 60)}

        {tag("RA", 258, 222, "RA")}
        {tag("RV", 300, 595, "RV")}
        {tag("LA", 662, 240, "LA")}
        {tag("LV", 600, 470, "LV")}
      </g>

      {/* great arteries in front */}
      <g opacity={bV}>
        <Tube d={AO} width={62} c={ART} o={op("A")} />
        <Tube d={PT} width={58} c={VEIN} o={op("P")} />
        <Tube d={SVC} width={46} c={VEIN} o={op("RA")} />
        <g opacity={op("P")}>{semilunar(366, 336, VEIN, 5)}</g>
        <g opacity={op("A")}>{semilunar(494, 334, ART, 6)}</g>
        {glowRing("P", 366, 340, 54, 30)}
        {glowRing("A", 494, 338, 54, 30)}
        <text x={494} y={150} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={22} fill={C.paper} opacity={ramp(t, tags, tags + 0.4) * op("A")} transform="rotate(-88 494 150)">AORTA</text>
        <text x={366} y={250} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={20} fill={C.paper} opacity={ramp(t, tags, tags + 0.4) * op("P")} transform="rotate(-89 366 250)">PULM. TRUNK</text>
      </g>

      {flowDots(FLOW_R, flowR, "#2F5E91", "fr")}
      {flowDots(FLOW_L, flowL, "#8E2318", "fl")}

      {lungP > 0 && (
        <g opacity={lungP} fontFamily={FONT} fontWeight={800} fontSize={26}>
          {[[28, 52, "end"], [832, 92, "start"]].map(([x, y], i) => (
            <g key={i} transform={`translate(${x as number} ${y as number}) scale(${0.7 + 0.3 * lungP})`}>
              <rect x={i === 0 ? -6 : -150} y={-24} width={156} height={44} rx={14} fill={C.forest} />
              <text x={i === 0 ? 72 : -72} y={8} textAnchor="middle" fill={C.paper}>to lungs</text>
            </g>
          ))}
        </g>
      )}

      {badge("T", 225, 290)}
      {badge("P", 296, 286)}
      {badge("M", 656, 290)}
      {badge("A", 566, 286)}
    </svg>
  );
};

/** Valve seen from above: kind "tri" = 3 leaflets (tricuspid), "bi" = 2 (mitral), "semi" = 3 half-moon cusps (Y line). */
export const ValveTop: React.FC<{ t: number; t0: number; kind: "tri" | "bi" | "semi"; size?: number; art?: boolean; label?: string }> = ({ t, t0, kind, size = 200, art, label }) => {
  const p = ramp(t, t0, t0 + 0.45);
  if (p <= 0) return null;
  const c = art ? ART : VEIN;
  const n = kind === "bi" ? 2 : 3;
  const open = 0.5 + 0.5 * Math.sin((t - t0) * 3.2);
  const r = 80;
  return (
    <svg width={size} height={size} viewBox="-100 -100 200 200" style={{ overflow: "visible", opacity: p, transform: `scale(${0.6 + 0.4 * p}) rotate(${(1 - p) * -40}deg)` }}>
      <circle r={94} fill={MUSCLE.fat} stroke={C.forest} strokeWidth={6} />
      <circle r={r} fill={c.cavDark} stroke={C.forest} strokeWidth={4} />
      {kind === "bi" && (() => {
        const g = 4 + open * 10;
        return (
          <g>
            <path d={`M${-Math.sqrt(6400 - (8 - g / 2) ** 2)} ${8 - g / 2} A 80 80 0 1 1 ${Math.sqrt(6400 - (8 - g / 2) ** 2)} ${8 - g / 2} Q 0 ${46 - g} ${-Math.sqrt(6400 - (8 - g / 2) ** 2)} ${8 - g / 2} Z`} fill="#F9E8D6" stroke={C.forest} strokeWidth={4} strokeLinejoin="round" />
            <path d={`M${-Math.sqrt(6400 - (14 + g / 2) ** 2)} ${14 + g / 2} Q 0 ${54 + g} ${Math.sqrt(6400 - (14 + g / 2) ** 2)} ${14 + g / 2} A 80 80 0 0 1 ${-Math.sqrt(6400 - (14 + g / 2) ** 2)} ${14 + g / 2} Z`} fill="#F4DCC6" stroke={C.forest} strokeWidth={4} strokeLinejoin="round" />
            <text x={0} y={-30} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={17} fill={C.forest} opacity={0.6}>ANTERIOR</text>
            <text x={0} y={58} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={17} fill={C.forest} opacity={0.6}>POSTERIOR</text>
          </g>
        );
      })()}
      {kind !== "bi" && Array.from({ length: n }, (_, i) => {
        const a0 = (i / n) * Math.PI * 2 - Math.PI / 2 + (kind === "bi" ? Math.PI / 2 : 0);
        const a1 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2 + (kind === "bi" ? Math.PI / 2 : 0);
        const am = (a0 + a1) / 2;
        const gap = 6 + open * 10;
        const cx = Math.cos(am) * gap, cy = Math.sin(am) * gap;
        const P0 = [Math.cos(a0) * r + cx, Math.sin(a0) * r + cy];
        const P1 = [Math.cos(a1) * r + cx, Math.sin(a1) * r + cy];
        const bulge = kind === "semi" ? 0.25 : 0.1;
        const ctrl = [Math.cos(am) * r * bulge + cx, Math.sin(am) * r * bulge + cy];
        return (
          <path key={i} d={`M${cx} ${cy} L ${P0[0]} ${P0[1]} A ${r} ${r} 0 0 1 ${P1[0]} ${P1[1]} Q ${ctrl[0]} ${ctrl[1]} ${cx} ${cy} Z`} fill={i % 2 ? "#F9E8D6" : "#F4DCC6"} stroke={C.forest} strokeWidth={4} strokeLinejoin="round" />
        );
      })}
      {kind === "semi" && <circle r={5} fill={C.forest} />}
      {label && (
        <text y={130} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.forest}>{label}</text>
      )}
    </svg>
  );
};
