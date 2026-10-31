import React from "react";
import { C, FONT, ramp } from "./kit";

/**
 * Our own schematic of the RIGHT femoral triangle, front view (Book Plume illustration).
 * Viewer's left = lateral, viewer's right = medial, so N-A-V-E-L reads left to right.
 * viewBox 860 x 900.
 */
export type PartId = "N" | "A" | "V" | "E";

const ASIS: [number, number] = [170, 170];
const PT: [number, number] = [690, 250];
const CTRL: [number, number] = [430, 300];
const lig = (s: number): [number, number] => [
  ASIS[0] * (1 - s) ** 2 + 2 * CTRL[0] * s * (1 - s) + PT[0] * s * s,
  ASIS[1] * (1 - s) ** 2 + 2 * CTRL[1] * s * (1 - s) + PT[1] * s * s,
];
const APEX: [number, number] = [507, 684];
// sartorius medial border: (215,175) -> (620,880); adductor longus medial border: (700,262) -> (500,700)
const TRI = (() => {
  const pts: [number, number][] = [];
  for (let i = 0; i <= 20; i++) pts.push(lig(0.08 + (0.98 - 0.08) * (i / 20)));
  pts.push([700, 262], APEX);
  return pts;
})();
const poly = (p: [number, number][]) => p.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

// deterministic random
const rnd = (() => {
  let a = 987654;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
})();

// muscle fibre lines for a quad band (p0-p1 top edge, p3-p2 bottom edge)
const fibres = (p0: [number, number], p1: [number, number], p2: [number, number], p3: [number, number], n: number) => {
  const out: string[] = [];
  for (let i = 1; i < n; i++) {
    const u = i / n + (rnd() - 0.5) * 0.02;
    const a = [p0[0] + (p1[0] - p0[0]) * u, p0[1] + (p1[1] - p0[1]) * u];
    const b = [p3[0] + (p2[0] - p3[0]) * u, p3[1] + (p2[1] - p3[1]) * u];
    const mx = (a[0] + b[0]) / 2 + (rnd() - 0.5) * 8, my = (a[1] + b[1]) / 2;
    out.push(`M${a[0].toFixed(1)} ${a[1].toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`);
  }
  return out;
};
const SART: [number, number][] = [[150, 186], [218, 172], [640, 900], [548, 900]];
const SART_F = fibres(SART[0], SART[1], SART[2], SART[3], 11);
const ADD: [number, number][] = [[596, 246], [702, 262], [540, 690], [470, 660]];
const ADD_F = fibres(ADD[0], ADD[1], ADD[2], ADD[3], 9);
const ILIO_F = Array.from({ length: 9 }, (_, i) => {
  const x = 230 + i * 20;
  return `M${x} 200 Q${x + 30} 420 ${x + 110 + i * 6} 640`;
});
const PECT_F = Array.from({ length: 7 }, (_, i) => {
  const x = 470 + i * 26;
  return `M${x} 250 Q${x - 30} 380 ${x - 70} 520`;
});

// vessel centre lines
const NERVE = "M300 70 L304 180 Q310 260 332 330 Q352 390 372 430";
const NERVE_BR = [
  "M372 430 Q392 490 404 548",
  "M372 430 Q420 470 446 540",
  "M372 430 Q430 452 470 496",
  "M352 390 Q352 430 372 470",
];
const ARTERY = "M372 70 L372 200 Q374 300 405 420 Q440 560 500 700";
const PROF = "M394 340 Q382 420 400 500 Q412 560 428 600";
const VEIN = "M444 70 L446 200 Q450 300 466 420 Q492 560 528 705";
const GSV = "M454 330 Q520 330 572 400 Q612 470 632 600 Q642 720 650 900";

export const Thigh: React.FC<{
  t: number;
  w?: number;
  tri?: number; // triangle outline + fill appears
  borders?: { lig: number; sar: number; add: number };
  lit?: Partial<Record<PartId, number>>; // time each content lights
  focus?: PartId | null;
  dimFrom?: number; // contents fade from full to dim at this time (before being lit)
  letters?: boolean;
  dimAll?: number; // 0..1 dim everything except id "hi"
  hi?: PartId;
}> = ({ t, w = 860, tri, borders, lit = {}, focus = null, dimFrom, letters = false, hi }) => {
  const s = w / 860;
  const triP = tri === undefined ? 0 : ramp(t, tri, tri + 0.6);
  const bP = (k: "lig" | "sar" | "add") => (borders ? ramp(t, borders[k], borders[k] + 0.35) : 0);
  const dimP = dimFrom === undefined ? 0 : ramp(t, dimFrom, dimFrom + 0.4);
  const on = (id: PartId) => (lit[id] === undefined ? 0 : ramp(t, lit[id]! - 0.05, lit[id]! + 0.3));
  const alpha = (id: PartId) => {
    if (hi) return id === hi ? 1 : 0.28;
    return 1 - 0.68 * dimP * (1 - on(id));
  };
  const glow = (id: PartId) => (focus === id ? on(id) * (0.75 + 0.25 * Math.sin(t * 7)) : 0);
  const pulse = (k: number) => (k > 0 && k < 1 ? Math.sin(k * Math.PI) : 0);

  const Tube: React.FC<{ d: string; width: number; fill: string; dark: string; id: PartId; light?: string; noGlow?: boolean }> = ({ d, width, fill, dark, id, light, noGlow }) => (
    <g opacity={alpha(id)}>
      {!noGlow && glow(id) > 0 && <path d={d} fill="none" stroke={C.banana} strokeWidth={width + 26} strokeLinecap="round" opacity={glow(id) * 0.9} />}
      <path d={d} fill="none" stroke={C.forest} strokeWidth={width + 7} strokeLinecap="round" />
      <path d={d} fill="none" stroke={dark} strokeWidth={width} strokeLinecap="round" />
      <path d={d} fill="none" stroke={fill} strokeWidth={width * 0.66} strokeLinecap="round" transform="translate(-2 0)" />
      <path d={d} fill="none" stroke={light ?? "#FFFFFF"} strokeWidth={width * 0.16} strokeLinecap="round" opacity={0.55} transform={`translate(${-width * 0.22} 0)`} />
    </g>
  );

  const letterX: Record<string, number> = { N: 300, A: 372, V: 444, E: 516, L: 584 };
  const letterOn = (l: string) => (l === "L" ? (lit.E === undefined ? 0 : ramp(t, lit.E + 0.76, lit.E + 1.0)) : on(l as PartId));

  return (
    <svg width={860 * s} height={900 * s} viewBox="0 0 860 900" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F3E7D6" stopOpacity={0} />
          <stop offset="0.12" stopColor="#F3E7D6" stopOpacity={1} />
          <stop offset="1" stopColor="#EEDDC6" />
        </linearGradient>
        <linearGradient id="musc" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#DCA28C" />
          <stop offset="1" stopColor="#C7836C" />
        </linearGradient>
        <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B9806C" />
          <stop offset="1" stopColor="#9E6655" />
        </linearGradient>
        <linearGradient id="fadeG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.07" stopColor="#fff" stopOpacity={0} />
          <stop offset="0.17" stopColor="#fff" stopOpacity={1} />
        </linearGradient>
        <mask id="topFade" maskUnits="userSpaceOnUse" x={0} y={0} width={860} height={900}>
          <rect x={0} y={0} width={860} height={900} fill="url(#fadeG)" />
        </mask>
        <clipPath id="triClip">
          <polygon points={poly(TRI)} />
        </clipPath>
        <clipPath id="thighClip">
          <path d="M96 40 L790 40 L772 236 C712 460 664 700 660 900 L222 900 C140 700 84 420 96 40 Z" />
        </clipPath>
      </defs>

      {/* thigh silhouette */}
      <path d="M96 40 L790 40 L772 236 C712 460 664 700 660 900 L222 900 C140 700 84 420 96 40 Z" fill="url(#skin)" />
      <path d="M96 120 C84 420 140 700 222 900 M772 236 C712 460 664 700 660 900" fill="none" stroke={C.forest} strokeWidth={5} strokeLinecap="round" opacity={0.75} />

      <g clipPath="url(#thighClip)">
        {/* quadriceps hint lateral to sartorius */}
        <path d="M110 220 C130 480 190 700 260 900 L520 900 C420 700 300 480 175 190 Z" fill="#E9C3AF" opacity={0.55} />
        {Array.from({ length: 6 }, (_, i) => (
          <path key={i} d={`M${150 + i * 18} ${230 + i * 6} C${180 + i * 22} 480 ${240 + i * 30} 700 ${300 + i * 34} 900`} fill="none" stroke="#C99A84" strokeWidth={2.4} opacity={0.5} />
        ))}
        {/* medial thigh (adductors) hint */}
        <path d="M700 262 L770 250 C712 460 664 700 660 900 L600 900 C560 760 540 700 540 690 Z" fill="#E9C3AF" opacity={0.55} />
      </g>

      {/* floor of the triangle: iliopsoas (lateral) + pectineus (medial) */}
      <g clipPath="url(#triClip)">
        <rect x={0} y={0} width={860} height={900} fill="url(#floor)" />
        <path d="M200 160 L470 160 Q470 420 520 700 L200 700 Z" fill="#C48A74" opacity={0.6} />
        {ILIO_F.map((d, i) => <path key={"i" + i} d={d} fill="none" stroke="#8E5747" strokeWidth={2.4} opacity={0.55} />)}
        {PECT_F.map((d, i) => <path key={"p" + i} d={d} fill="none" stroke="#8E5747" strokeWidth={2.4} opacity={0.5} />)}
        {/* fat / connective tissue speckle */}

      </g>

      {/* adductor longus */}
      <g opacity={1}>
        <polygon points={poly(ADD)} fill="url(#musc)" stroke={C.forest} strokeWidth={4} strokeLinejoin="round" />
        {ADD_F.map((d, i) => <path key={i} d={d} fill="none" stroke="#9A5B48" strokeWidth={2.2} opacity={0.6} />)}
        {pulse(bP("add")) > 0 && <polygon points={poly(ADD)} fill={C.banana} opacity={0.45 * pulse(ramp(t, borders!.add, borders!.add + 1.2))} />}
        {bP("add") > 0 && <line x1={700} y1={262} x2={500 + (700 - 500) * (1 - bP("add"))} y2={262 + 438 * bP("add")} stroke={C.banana} strokeWidth={12} strokeLinecap="round" />}
      </g>

      {/* femoral canal (empty space + lymph) */}
      <g opacity={alpha("E")}>
        {glow("E") > 0 && <ellipse cx={512} cy={322} rx={50} ry={74} fill={C.banana} opacity={glow("E") * 0.75} />}
        <ellipse cx={512} cy={322} rx={34} ry={60} fill="#F6EBD0" stroke={C.forest} strokeWidth={4} strokeDasharray="10 8" />
        <ellipse cx={510} cy={304} rx={14} ry={10} fill="#9CB46F" stroke={C.forest} strokeWidth={3} />
        <ellipse cx={516} cy={344} rx={11} ry={8} fill="#9CB46F" stroke={C.forest} strokeWidth={3} />
        <path d="M510 314 Q514 326 516 336" fill="none" stroke="#6E8A44" strokeWidth={3} />
      </g>

      {/* femoral sheath (artery, vein, canal) */}
      <path d="M346 214 Q450 224 552 232 Q552 300 530 360 Q470 392 404 382 Q368 330 346 214 Z" fill="none" stroke={C.forest} strokeWidth={3} strokeDasharray="6 9" opacity={0.35 * (1 - 0.5 * dimP)} />

      {/* vessels + nerve (fade in from above the ligament) */}
      <g mask="url(#topFade)">
      <Tube id="V" d={GSV} width={14} fill="#86AED6" dark="#4C79A8" noGlow />
      <Tube id="A" d={PROF} width={15} fill="#D8625A" dark="#9E3329" />
      <Tube id="V" d={VEIN} width={32} fill="#5D8FC4" dark="#3B6694" />
      <Tube id="A" d={ARTERY} width={26} fill="#D8574B" dark="#A23125" light="#FFD9CF" />
      <g>
        {NERVE_BR.map((d, i) => <Tube key={i} id="N" d={d} width={9} fill="#F2D14E" dark="#C9A92C" light="#FFF6C8" />)}
        <Tube id="N" d={NERVE} width={20} fill="#F2D14E" dark="#C9A92C" light="#FFF6C8" />
      </g>
      </g>

      {/* inguinal ligament (passes in front of the vessels) */}
      <g>
        {(() => {
          const pts: string[] = [];
          for (let i = 0; i <= 30; i++) { const [x, y] = lig(i / 30); pts.push(`${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`); }
          const d = pts.join(" ");
          const lp = bP("lig");
          return (
            <>
              <path d={d} fill="none" stroke={C.forest} strokeWidth={30} strokeLinecap="round" />
              <path d={d} fill="none" stroke="#F1E8D2" strokeWidth={22} strokeLinecap="round" />
              <path d={d} fill="none" stroke="#CDBE9C" strokeWidth={3} strokeDasharray="22 10" strokeLinecap="round" />
              {lp > 0 && <path d={d} fill="none" stroke={C.banana} strokeWidth={22} strokeLinecap="round" pathLength={1} strokeDasharray={`${lp} 1`} />}
            </>
          );
        })()}
        <circle cx={ASIS[0]} cy={ASIS[1]} r={12} fill={C.paper} stroke={C.forest} strokeWidth={5} />
        <circle cx={PT[0]} cy={PT[1]} r={12} fill={C.paper} stroke={C.forest} strokeWidth={5} />
      </g>

      {/* sartorius on top (crosses the apex) */}
      <g>
        <polygon points={poly(SART)} fill="url(#musc)" stroke={C.forest} strokeWidth={4} strokeLinejoin="round" />
        {SART_F.map((d, i) => <path key={i} d={d} fill="none" stroke="#9A5B48" strokeWidth={2.2} opacity={0.6} />)}
        {pulse(ramp(t, borders?.sar ?? 99, (borders?.sar ?? 99) + 1.2)) > 0 && <polygon points={poly(SART)} fill={C.banana} opacity={0.45 * pulse(ramp(t, borders!.sar, borders!.sar + 1.2))} />}
        {bP("sar") > 0 && <line x1={218} y1={172} x2={218 + (507 - 218) * bP("sar")} y2={172 + (684 - 172) * bP("sar")} stroke={C.banana} strokeWidth={12} strokeLinecap="round" />}
      </g>

      {/* triangle outline */}
      {triP > 0 && (
        <g opacity={triP}>
          <polygon points={poly(TRI)} fill={C.banana} opacity={0.18 * (1 - dimP)} />
          <polygon points={poly(TRI)} fill="none" stroke={C.forest} strokeWidth={6} strokeDasharray="18 12" strokeLinejoin="round" pathLength={1} />
        </g>
      )}

      {/* NAVEL letters over each structure */}
      {letters &&
        ["N", "A", "V", "E", "L"].map((l) => {
          const p = letterOn(l);
          const isF = focus === l || (l === "L" && focus === "E" && p > 0);
          return (
            <g key={l} transform={`translate(${letterX[l]} 44)`} opacity={0.35 + 0.65 * p}>
              {l === "L" && <path d="M-34 36 L-34 250" fill="none" stroke={C.forest} strokeWidth={4} strokeDasharray="6 6" opacity={p} />}
              <circle r={30 * (1 + 0.12 * pulse(p))} fill={p > 0.5 ? (isF ? C.banana : C.forest) : C.paper} stroke={C.forest} strokeWidth={5} />
              <text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={p > 0.5 ? (isF ? C.forest : C.paper) : C.forest}>{l}</text>
            </g>
          );
        })}
    </svg>
  );
};
