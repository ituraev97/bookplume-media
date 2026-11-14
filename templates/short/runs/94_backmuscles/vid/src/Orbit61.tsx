import React from "react";
import { C, ramp } from "./kit";

/**
 * Our own front-view diagram of the RIGHT bony orbit (viewer's left eye socket; nose side = viewer's right).
 * Native size 800 x 720. Regions are polar wedges between the orbital rim (r = 1) and the apex (r = 0).
 * θ in degrees, y down: 0 = medial (nose), 90 = floor, 180 = lateral, 270 = roof.
 */
export type Part = "FRO" | "SPB" | "SGW" | "SLW" | "ZYG" | "MAX" | "ETH" | "LAC" | "PAL";
export type Bone = "MAX" | "FRO" | "ZYG" | "ETH" | "LAC" | "SPH" | "PAL";
export const BONES: Bone[] = ["MAX", "FRO", "ZYG", "ETH", "LAC", "SPH", "PAL"];
export const BNAME: Record<Bone, string> = { MAX: "Maxilla", FRO: "Frontal", ZYG: "Zygomatic", ETH: "Ethmoid", LAC: "Lacrimal", SPH: "Sphenoid", PAL: "Palatine" };
export const BWORD: Record<Bone, string> = { MAX: "Many", FRO: "Friendly", ZYG: "Zebras", ETH: "Enjoy", LAC: "Lazy", SPH: "Summer", PAL: "Picnics" };
export const BCOL: Record<Bone, string> = {
  MAX: "#E0928A",
  FRO: "#A9C27F",
  ZYG: "#EBA45C",
  ETH: "#B59AD8",
  LAC: "#F2D14E",
  SPH: "#7FA0CC",
  PAL: "#63B5A3",
};
export const PART_BONE: Record<Part, Bone> = { FRO: "FRO", SPB: "SPH", SGW: "SPH", SLW: "SPH", ZYG: "ZYG", MAX: "MAX", ETH: "ETH", LAC: "LAC", PAL: "PAL" };

const CX = 400, CY = 352, RX = 318, RY = 282, N = 2.7;
const AX = 424, AY = 372; // apex (slightly medial and low)
const rim = (deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  const c = Math.cos(a), s = Math.sin(a);
  return [CX + RX * Math.sign(c) * Math.abs(c) ** (2 / N), CY + RY * Math.sign(s) * Math.abs(s) ** (2 / N)];
};
export const P = (deg: number, r: number): [number, number] => {
  const [x, y] = rim(deg);
  return [AX + r * (x - AX), AY + r * (y - AY)];
};
const wedge = (a0: number, a1: number, r0: number, r1: number) => {
  const n = Math.max(6, Math.ceil(Math.abs(a1 - a0) / 3));
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const [x, y] = P(a0 + ((a1 - a0) * i) / n, r1);
    pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  for (let i = n; i >= 0; i--) {
    const [x, y] = P(a0 + ((a1 - a0) * i) / n, r0);
    pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return "M" + pts.join(" L") + " Z";
};
const arcPath = (a0: number, a1: number, r: number) => {
  const n = Math.ceil(Math.abs(a1 - a0) / 3);
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const [x, y] = P(a0 + ((a1 - a0) * i) / n, r);
    pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return "M" + pts.join(" L");
};

/* inside the orbit */
const PARTS: { p: Part; d: string[] }[] = [
  { p: "SPB", d: [wedge(0, 360, 0.11, 0.27)] },
  { p: "MAX", d: [wedge(34, 141, 0.27, 1.0), wedge(-40, 34, 0.86, 1.0)] },
  { p: "ETH", d: [wedge(-40, 36, 0.27, 0.86)] },
  { p: "LAC", d: [wedge(-4, 30, 0.6, 0.86)] },
  { p: "PAL", d: [wedge(40, 96, 0.12, 0.3)] },
  { p: "SGW", d: [wedge(150, 214, 0.2, 0.67)] },
  { p: "SLW", d: [wedge(226, 314, 0.17, 0.43)] },
  { p: "ZYG", d: [wedge(116, 214, 0.67, 1.0)] },
  { p: "FRO", d: [wedge(214, 320, 0.43, 1.0), wedge(214, 226, 0.4, 0.43)] },
];
/* face around the orbit (context, same bones) */
const FACE: { p: Part; d: string }[] = [
  { p: "FRO", d: wedge(196, 344, 1.0, 1.5) },
  { p: "ZYG", d: wedge(104, 196, 1.0, 1.42) },
  { p: "MAX", d: wedge(14, 104, 1.0, 1.42) },
];
export const ANCHOR: Record<Part | "SOF" | "IOF" | "OPT", [number, number]> = {
  FRO: P(268, 0.74),
  SLW: P(270, 0.33),
  SGW: P(182, 0.46),
  SPB: P(0, 0.2),
  ZYG: P(165, 0.84),
  MAX: P(88, 0.68),
  ETH: P(0, 0.46),
  LAC: P(13, 0.74),
  PAL: P(68, 0.21),
  SOF: P(220, 0.32),
  IOF: P(146, 0.45),
  OPT: P(282, 0.25),
};

export const OrbitDiagram: React.FC<{
  t: number;
  w: number;
  lit: Partial<Record<Part, number>>; // part -> time it turns on
  glow?: Part[];
  dim?: number; // opacity of colour for parts not yet lit
  id: string;
  face?: boolean;
  wall?: { a0: number; a1: number; t0: number; label?: string } | null;
}> = ({ t, w, lit, glow = [], dim = 0, id, face = true }) => {
  const k = w / 800;
  const on = (p: Part) => {
    const t0 = lit[p];
    if (t0 === undefined) return dim;
    return dim + (1 - dim) * ramp(t, t0 - 0.05, t0 + 0.25);
  };
  const pulse = 0.65 + 0.35 * Math.sin(t * 9);
  const [sofA, sofB] = [P(214, 0.18), P(226, 0.5)];
  return (
    <svg width={800 * k} height={720 * k} viewBox="0 0 800 720" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <radialGradient id={`deep-${id}`} gradientUnits="userSpaceOnUse" cx={AX} cy={AY} r={330} gradientTransform={`translate(${AX} ${AY}) scale(1 0.9) translate(${-AX} ${-AY})`}>
          <stop offset="0" stopColor="#0E1409" stopOpacity={0.78} />
          <stop offset="0.22" stopColor="#0E1409" stopOpacity={0.5} />
          <stop offset="0.6" stopColor="#0E1409" stopOpacity={0.2} />
          <stop offset="1" stopColor="#0E1409" stopOpacity={0.02} />
        </radialGradient>
        <radialGradient id={`faceSh-${id}`} gradientUnits="userSpaceOnUse" cx={CX} cy={CY} r={480}>
          <stop offset="0.6" stopColor="#0E1409" stopOpacity={0.14} />
          <stop offset="1" stopColor="#0E1409" stopOpacity={0} />
        </radialGradient>
        <pattern id={`hatch-${id}`} width={7} height={7} patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1={0} y1={0} x2={0} y2={7} stroke={C.forest} strokeWidth={1.1} opacity={0.22} />
        </pattern>
        <clipPath id={`rim-${id}`}>
          <path d={wedge(0, 360, 0, 1.0)} />
        </clipPath>
        <clipPath id={`face-${id}`}>
          <rect x={-40} y={-60} width={880} height={820} rx={70} />
        </clipPath>
      </defs>
      {face && (
        <g clipPath={`url(#face-${id})`}>
          {FACE.map((f, i) => (
            <g key={i}>
              <path d={f.d} fill="#E7E3CD" stroke={C.forest} strokeWidth={3} strokeLinejoin="round" />
              <path d={f.d} fill={BCOL[PART_BONE[f.p]]} opacity={on(f.p) * 0.75} />
              <path d={f.d} fill={`url(#hatch-${id})`} opacity={0.6} />
            </g>
          ))}
          {/* nasal bone + frontal process strip (context, not one of the 7 orbit walls) */}
          <path d={wedge(-17, 15, 1.0, 1.42)} fill="#D6D1B8" stroke={C.forest} strokeWidth={3} />
          <path d={wedge(-17, 15, 1.0, 1.42)} fill={`url(#hatch-${id})`} />
          <path d={wedge(196, 344, 1.0, 1.5)} fill={`url(#faceSh-${id})`} />
          {/* supraorbital notch + infraorbital foramen (surface landmarks) */}
          <ellipse cx={P(282, 1.06)[0]} cy={P(282, 1.06)[1]} rx={9} ry={6} fill={C.forest} opacity={0.75} />
          <ellipse cx={P(80, 1.22)[0]} cy={P(80, 1.22)[1]} rx={12} ry={9} fill={C.forest} opacity={0.7} />
        </g>
      )}
      {/* orbit walls */}
      <g>
        {PARTS.map(({ p, d }) => (
          <g key={p}>
            {d.map((dd, j) => (
              <g key={j}>
                <path d={dd} fill="#E4E0C8" />
                <path d={dd} fill={BCOL[PART_BONE[p]]} opacity={on(p)} />
              </g>
            ))}
          </g>
        ))}
        <g clipPath={`url(#rim-${id})`}>
          {/* engraved depth lines running toward the apex */}
          {Array.from({ length: 72 }).map((_, i) => {
            const a = i * 5;
            const [x0, y0] = P(a, 0.98), [x1, y1] = P(a, 0.16);
            return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke={C.forest} strokeWidth={1.2} opacity={0.12} />;
          })}
          {[0.35, 0.55, 0.78].map((r) => (
            <path key={r} d={arcPath(0, 360, r)} fill="none" stroke={C.forest} strokeWidth={1} opacity={0.08} />
          ))}
          <rect x={0} y={0} width={800} height={720} fill={`url(#deep-${id})`} />
        </g>
        {/* sutures */}
        {PARTS.map(({ p, d }) => d.map((dd, j) => <path key={p + j} d={dd} fill="none" stroke={C.forest} strokeWidth={2.6} strokeLinejoin="round" opacity={0.75} />))}
        {/* fissures + optic canal */}
        <path d={wedge(214, 226, 0.17, 0.5)} fill="#2A3320" stroke={C.forest} strokeWidth={2} />
        <path d={wedge(142, 154, 0.22, 0.62)} fill="#2A3320" stroke={C.forest} strokeWidth={2} />
        <ellipse cx={ANCHOR.OPT[0]} cy={ANCHOR.OPT[1]} rx={17} ry={20} fill="#0E1409" stroke={C.paper} strokeWidth={2} opacity={0.95} />
        <ellipse cx={AX} cy={AY} rx={30} ry={26} fill="#0E1409" opacity={0.85} />
        {/* lacrimal fossa groove */}
        <path d={arcPath(2, 28, 0.8)} fill="none" stroke={C.forest} strokeWidth={5} opacity={0.45} strokeLinecap="round" />
        {/* rim highlight */}
        <path d={arcPath(0, 360, 1.0)} fill="none" stroke={C.forest} strokeWidth={7} />
        <path d={arcPath(200, 340, 0.985)} fill="none" stroke="#FFFFF4" strokeWidth={4} opacity={0.6} />
        {sofA && sofB && null}
      </g>
      {/* glow */}
      {glow.map((g) => {
        const e = PARTS.find((x) => x.p === g);
        if (!e) return null;
        return e.d.map((dd, j) => <path key={g + j} d={dd} fill="none" stroke={C.banana} strokeWidth={9} strokeLinejoin="round" opacity={pulse} />);
      })}
    </svg>
  );
};

/** Wall bracket drawn just outside/inside the rim along θ a0..a1 (native coords) */
export const wallArc = (a0: number, a1: number, r = 1.1) => arcPath(a0, a1, r);
