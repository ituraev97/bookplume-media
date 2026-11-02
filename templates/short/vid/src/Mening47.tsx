import React from "react";
import { C, FONT, ramp } from "./kit";

/**
 * Book Plume schematic: CORONAL slice through the top of the head, from scalp down to the cortex (viewBox 860 x 600).
 * Order (StatPearls "Neuroanatomy, Cranial Meninges"; TeachMeAnatomy "The Meninges"; Gray 1918 Fig. 769):
 *   skull -> dura mater (periosteal + meningeal layer) -> [subdural: potential space] -> arachnoid mater
 *   -> subarachnoid space (CSF, crossed by arachnoid trabeculae) -> pia mater (follows every gyrus and sulcus) -> brain.
 * The arachnoid BRIDGES the sulci, the pia DIPS INTO them.
 */
export type MPart = "skull" | "dura" | "arach" | "sas" | "pia" | "brain";
export const LAYERS: { id: "pia" | "arach" | "dura"; letter: string; word: string; name: string; sub: string; color: string }[] = [
  { id: "pia", letter: "P", word: "Pia", name: "Pia mater", sub: "hugs every fold", color: "#E0809A" },
  { id: "arach", letter: "A", word: "Arachnoid", name: "Arachnoid mater", sub: "delicate, web-like", color: "#A98DD6" },
  { id: "dura", letter: "D", word: "Dura", name: "Dura mater", sub: "tough, under skull", color: "#E8B547" },
];
export const COL: Record<MPart, string> = { skull: "#EFE3C2", dura: "#E8B547", arach: "#A98DD6", sas: "#8CCBE6", pia: "#E0809A", brain: "#E9CFC6" };

const Y_SC0 = 34, Y_SC1 = 168, Y_D0 = 168, Y_D1 = 232, Y_AR = 246, CREST = 300, SULC = 470;
const SULCI = [-60, 128, 318, 520, 712, 920];

/* pia / cortex surface: gyri with crests at CREST, narrow sulci down to SULC */
const gyri = (crest: number, sulc: number, inset: number, gap = 9) => {
  let d = `M -80 ${sulc} `;
  for (let i = 0; i < SULCI.length - 1; i++) {
    const s0 = SULCI[i] + gap + inset, s1 = SULCI[i + 1] - gap - inset;
    const m = (s0 + s1) / 2;
    const h = crest + (i % 2 ? 10 : 0);
    d += `L ${s0} ${sulc} C ${s0 - 2} ${h + 70} ${s0 + 34} ${h - 4} ${m} ${h - 4} C ${s1 - 34} ${h - 4} ${s1 + 2} ${h + 70} ${s1} ${sulc} `;
    d += `Q ${SULCI[i + 1]} ${sulc + 18} ${SULCI[i + 1] + gap + inset} ${sulc} `;
  }
  return d;
};
const PIA = gyri(CREST, SULC, 0);
const CORTEX = PIA + ` L 940 ${SULC} L 940 700 L -80 700 Z`;
const WHITE = gyri(CREST + 78, SULC + 55, 30, 9) + ` L 940 700 L -80 700 Z`;

/* arachnoid trabeculae: thin strands from the arachnoid down to the brain surface */
const TRAB: [number, number, number, number][] = (() => {
  const out: [number, number, number, number][] = [];
  for (let x = 20; x < 860; x += 38) {
    // depth to pia: near a sulcus the strand is long
    let dmin = 1e9;
    SULCI.forEach((s) => (dmin = Math.min(dmin, Math.abs(x - s))));
    const yEnd = dmin < 30 ? Y_AR + 110 + (30 - dmin) * 2.5 : CREST + 2 + (dmin < 60 ? 46 : 0);
    const k = ((x * 37) % 23) - 11;
    out.push([x, Y_AR + 4, x + k, Math.min(yEnd, SULC - 20)]);
  }
  return out;
})();

/* diploe dots in the skull (fixed pseudo-random) */
const DOTS = Array.from({ length: 70 }, (_, i) => {
  const x = (i * 97.3) % 880 - 10, y = 74 + ((i * 53.7) % 60), r = 5 + ((i * 13) % 9);
  return [x, y, r, (i * 29) % 360] as const;
});

const mix = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return "#" + pa.map((v, i) => Math.round(v + (pb[i] - v) * k).toString(16).padStart(2, "0")).join("");
};

/* label anchors (diagram coords) and default pill positions */
export const MLAB: Record<MPart, { ax: number; ay: number; px: number; py: number; text: string }> = {
  skull: { ax: 600, ay: 110, px: 640, py: 48, text: "Skull" },
  dura: { ax: 230, ay: 205, px: 190, py: 112, text: "Dura mater" },
  arach: { ax: 600, ay: Y_AR, px: 640, py: 150, text: "Arachnoid mater" },
  sas: { ax: 520, ay: 380, px: 300, py: 470, text: "Subarachnoid space" },
  pia: { ax: 222, ay: CREST - 2, px: 470, py: 552, text: "Pia mater" },
  brain: { ax: 419, ay: 440, px: 640, py: 470, text: "Brain" },
};

export const Meninges: React.FC<{
  t: number;
  lit?: Partial<Record<MPart, number>>;
  focus?: MPart[];
  dimFrom?: number;
  show?: Partial<Record<MPart, number>>;
  csf?: number; // time the CSF starts flowing
  ask?: MPart;
  reveal?: number;
}> = ({ t, lit = {}, focus = [], dimFrom, show = {}, csf, ask, reveal }) => {
  const on = (id: MPart) => (lit[id] === undefined ? 0 : ramp(t, (lit[id] as number) - 0.05, (lit[id] as number) + 0.3));
  const dimP = dimFrom === undefined ? 0 : ramp(t, dimFrom, dimFrom + 0.4);
  const op = (id: MPart) => 1 - 0.55 * dimP * (focus.includes(id) || focus.length === 0 ? 1 - on(id) : 1);
  const glow = (id: MPart) => (focus.includes(id) ? on(id) * (0.7 + 0.3 * Math.sin(t * 7)) : 0);
  const drawn = (id: MPart) => {
    const v = show[id];
    return v === undefined ? 1 : ramp(t, v, v + 0.6);
  };
  const asking = ask && (reveal === undefined || t < reveal);
  const csfP = csf === undefined ? 0 : ramp(t, csf, csf + 0.8);
  const flow = csf === undefined ? 0 : Math.max(0, t - csf) * 60;
  return (
    <svg width={860} height={600} viewBox="0 0 860 600" style={{ overflow: "hidden", display: "block" }}>
      <defs>
        <linearGradient id="bone47" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FBF4DF" />
          <stop offset="1" stopColor="#E9DBB4" />
        </linearGradient>
        <linearGradient id="cortex47" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E6BFB3" />
          <stop offset="1" stopColor="#D3A497" />
        </linearGradient>
        <linearGradient id="sas47" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D6ECF4" />
          <stop offset="1" stopColor="#BFE0EE" />
        </linearGradient>
        <pattern id="fib47" width={12} height={12} patternUnits="userSpaceOnUse" patternTransform="rotate(-8)">
          <line x1={0} y1={6} x2={12} y2={6} stroke="#FFFFFF" strokeWidth={2.2} opacity={0.45} />
        </pattern>
        <pattern id="csf47" width={60} height={60} patternUnits="userSpaceOnUse" patternTransform={`translate(${flow} 0)`}>
          <circle cx={12} cy={14} r={3.2} fill="#FFFFFF" opacity={0.75} />
          <circle cx={42} cy={38} r={2.4} fill="#FFFFFF" opacity={0.6} />
          <circle cx={28} cy={52} r={1.8} fill="#FFFFFF" opacity={0.6} />
        </pattern>
        <pattern id="gm47" width={14} height={14} patternUnits="userSpaceOnUse">
          <circle cx={4} cy={4} r={1.6} fill="#B98C80" opacity={0.45} />
          <circle cx={11} cy={10} r={1.2} fill="#B98C80" opacity={0.35} />
        </pattern>
        <filter id="gl47" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation={7} />
        </filter>
      </defs>

      {/* scalp strip */}
      <rect x={-10} y={0} width={880} height={Y_SC0} fill="#F3D9C4" opacity={op("skull")} />
      <line x1={-10} y1={Y_SC0} x2={870} y2={Y_SC0} stroke="#C9A98E" strokeWidth={3} opacity={op("skull")} />

      {/* skull: outer table, diploe, inner table */}
      <g opacity={op("skull") * drawn("skull")}>
        <rect x={-10} y={Y_SC0} width={880} height={Y_SC1 - Y_SC0} fill={mix("#F1E6C6", "#FFF1A8", on("skull"))} />
        <rect x={-10} y={Y_SC0} width={880} height={30} fill="url(#bone47)" />
        <rect x={-10} y={Y_SC1 - 30} width={880} height={30} fill="url(#bone47)" />
        {DOTS.map(([x, y, r, rot], i) => (
          <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.6} transform={`rotate(${rot} ${x} ${y})`} fill="#C9B386" opacity={0.75} />
        ))}
        <line x1={-10} y1={Y_SC1} x2={870} y2={Y_SC1} stroke="#9C8A62" strokeWidth={4} />
        {glow("skull") > 0 && <rect x={-10} y={Y_SC0} width={880} height={Y_SC1 - Y_SC0} fill="none" stroke={C.banana} strokeWidth={10} opacity={glow("skull")} />}
      </g>

      {/* subarachnoid space (under the arachnoid, down to the pia) */}
      <g opacity={op("sas")}>
        <rect x={-10} y={Y_AR} width={880} height={SULC - Y_AR + 30} fill={mix("#E4F1F5", COL.sas, Math.max(on("sas"), csfP * 0.8))} />
        {csfP > 0 && <rect x={-10} y={Y_AR} width={880} height={SULC - Y_AR + 30} fill="url(#csf47)" opacity={csfP} />}
        {/* trabeculae */}
        {TRAB.map(([x0, y0, x1, y1], i) => (
          <path key={i} d={`M ${x0} ${y0} C ${x0 + 6} ${(y0 + y1) / 2} ${x1 - 6} ${(y0 + y1) / 2} ${x1} ${y1}`} fill="none" stroke={COL.arach} strokeWidth={2.4} opacity={0.55 + 0.45 * on("arach")} />
        ))}
      </g>

      {/* brain: cortex (grey matter) + white matter; opaque base so dimming never shows the CSF through it */}
      <path d={CORTEX} fill={C.card} />
      <g opacity={op("brain")}>
        <path d={CORTEX} fill="url(#cortex47)" />
        <path d={CORTEX} fill="url(#gm47)" />
        <path d={WHITE} fill="#FBF2E8" stroke="#D9B8AA" strokeWidth={2.5} />
      </g>

      {/* pia mater: follows every gyrus into every sulcus */}
      <g opacity={op("pia") * drawn("pia")}>
        {glow("pia") > 0 && <path d={PIA} fill="none" stroke={C.banana} strokeWidth={22} opacity={glow("pia") * 0.8} filter="url(#gl47)" />}
        <path d={PIA} fill="none" stroke={asking && ask === "pia" ? "#7D8A72" : mix(COL.pia, "#C2405F", on("pia"))} strokeWidth={6 + 4 * on("pia")} strokeLinejoin="round" strokeLinecap="round"
          strokeDasharray={asking && ask === "pia" ? "14 10" : undefined} />
      </g>

      {/* dura mater: periosteal + meningeal layers */}
      <g opacity={op("dura") * drawn("dura")}>
        {glow("dura") > 0 && <rect x={-10} y={Y_D0 - 6} width={880} height={Y_D1 - Y_D0 + 12} fill={C.banana} opacity={glow("dura") * 0.7} filter="url(#gl47)" />}
        <rect x={-10} y={Y_D0} width={880} height={Y_D1 - Y_D0} fill={mix(COL.dura, "#F2C94C", on("dura"))} />
        <rect x={-10} y={Y_D0} width={880} height={Y_D1 - Y_D0} fill="url(#fib47)" />
        <line x1={-10} y1={(Y_D0 + Y_D1) / 2} x2={870} y2={(Y_D0 + Y_D1) / 2} stroke="#B8862A" strokeWidth={2} strokeDasharray="10 8" opacity={0.6} />
        <line x1={-10} y1={Y_D1} x2={870} y2={Y_D1} stroke="#9C6F1E" strokeWidth={4} />
      </g>

      {/* arachnoid mater: thin membrane that BRIDGES the sulci */}
      <g opacity={op("arach") * drawn("arach")}>
        {glow("arach") > 0 && <rect x={-10} y={Y_AR - 12} width={880} height={24} fill={C.banana} opacity={glow("arach") * 0.75} filter="url(#gl47)" />}
        <rect x={-10} y={Y_AR - 5} width={880} height={10} rx={5} fill={mix(COL.arach, "#7B52C4", on("arach"))} />
      </g>

      {/* "?" marker for the quick test */}
      {asking && ask === "pia" && (
        <g>
          <circle cx={222} cy={CREST - 2} r={30} fill={C.forest} />
          <text x={222} y={CREST + 11} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={38} fill={C.banana}>?</text>
        </g>
      )}
    </svg>
  );
};

/** callout labels drawn over the (possibly zoomed) diagram; map() converts diagram coords -> screen coords */
export const MLabels: React.FC<{
  t: number;
  labels: Partial<Record<MPart, number>>;
  labelEnd?: Partial<Record<MPart, number>>;
  hot?: MPart[];
  map: (x: number, y: number) => [number, number];
  pos?: Partial<Record<MPart, [number, number]>>;
  w?: number;
  h?: number;
}> = ({ t, labels, labelEnd = {}, hot = [], map, pos = {}, w = 860, h = 600 }) => (
  <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
    {(Object.keys(labels) as MPart[]).map((id) => {
      const t0 = labels[id] as number;
      const e = labelEnd[id];
      const p = ramp(t, t0 - 0.1, t0 + 0.25) * (e === undefined ? 1 : 1 - ramp(t, e, e + 0.25));
      if (p <= 0) return null;
      const L = MLAB[id];
      const [ax, ay] = map(L.ax, L.ay);
      const [px, py] = pos[id] ?? [L.px, L.py];
      const isHot = hot.includes(id);
      const ww = L.text.length * 18.2 + 60;
      return (
        <g key={id} opacity={Math.min(1, p * 1.5)}>
          <line x1={ax} y1={ay} x2={ax + (px - ax) * p} y2={ay + (py - ay) * p} stroke={C.forest} strokeWidth={5} strokeLinecap="round" />
          <circle cx={ax} cy={ay} r={12} fill={isHot ? C.red : C.banana} stroke={C.forest} strokeWidth={4.5} />
          <g transform={`translate(${px} ${py}) scale(${0.8 + 0.2 * p})`}>
            <rect x={-ww / 2} y={-31} width={ww} height={62} rx={18} fill={isHot ? C.banana : C.forest} stroke={C.forest} strokeWidth={3} />
            <circle cx={-ww / 2 + 28} cy={0} r={13} fill={COL[id]} stroke={isHot ? C.forest : C.paper} strokeWidth={3} />
            <text x={14} y={11} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill={isHot ? C.forest : C.paper}>{L.text}</text>
          </g>
        </g>
      );
    })}
  </svg>
);
