import React from "react";
import { C } from "./kit";

/* Book Plume illustration: the 5 white blood cells (Wright-stain look, simplified, our own drawing) */
export type Wk = "N" | "L" | "M" | "E" | "B";
export const WBC: { k: Wk; name: string; plural: string; pct: string; mid: number; job: string; group: "granulocyte" | "agranulocyte" }[] = [
  { k: "N", name: "Neutrophil", plural: "Neutrophils", pct: "50–70%", mid: 60, job: "first to hit bacteria", group: "granulocyte" },
  { k: "L", name: "Lymphocyte", plural: "Lymphocytes", pct: "20–30%", mid: 25, job: "B cells · T cells · NK", group: "agranulocyte" },
  { k: "M", name: "Monocyte", plural: "Monocytes", pct: "2–8%", mid: 5, job: "biggest → macrophage", group: "agranulocyte" },
  { k: "E", name: "Eosinophil", plural: "Eosinophils", pct: "2–4%", mid: 3, job: "parasites · allergies", group: "granulocyte" },
  { k: "B", name: "Basophil", plural: "Basophils", pct: "< 1%", mid: 0.7, job: "release histamine", group: "granulocyte" },
];
/** accent colour per cell (letter chips, bars) */
export const WCOL: Record<Wk, string> = { N: "#D9B8E8", L: "#9FC3EA", M: "#B9C7A0", E: "#F09A6E", B: "#B49AD6" };

const rnd = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
};
/** points scattered inside a circle of radius r (deterministic) */
const scatter = (n: number, r: number, seed: number, avoid?: (x: number, y: number) => boolean) => {
  const R = rnd(seed);
  const out: [number, number, number][] = [];
  let guard = 0;
  while (out.length < n && guard < n * 20) {
    guard++;
    const a = R() * Math.PI * 2, d = Math.sqrt(R()) * r;
    const x = Math.cos(a) * d, y = Math.sin(a) * d;
    if (avoid && avoid(x, y)) continue;
    out.push([x, y, R()]);
  }
  return out;
};

type CP = { kind: Wk; size: number; spin?: number; id: string; outline?: boolean };

/** One cell in a 200x200 box (cell radius depends on the type: lymphocyte small, monocyte big) */
export const Cell: React.FC<CP> = ({ kind, size, spin = 0, id, outline = true }) => {
  const R = { N: 78, L: 62, M: 92, E: 80, B: 76 }[kind];
  const g = `g${id}${kind}`;
  const cyto = { N: ["#F6E6EE", "#E2C3D6"], L: ["#D7E7F8", "#9FC0E6"], M: ["#E6E8F0", "#B9BED6"], E: ["#FBE3D6", "#F2B79C"], B: ["#EEE3F3", "#CDB6E0"] }[kind];
  const nuc = { N: "#5B3A8C", L: "#3E2C78", M: "#7C6BB0", E: "#5E3D8E", B: "#4A2D78" }[kind];
  const nucDark = { N: "#3B2363", L: "#271A55", M: "#57488C", E: "#3D2566", B: "#2E1A52" }[kind];
  return (
    <svg width={size} height={size} viewBox="-100 -100 200 200" style={{ overflow: "visible", display: "block" }}>
      <defs>
        <radialGradient id={`${g}c`} cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor={cyto[0]} />
          <stop offset="100%" stopColor={cyto[1]} />
        </radialGradient>
        <radialGradient id={`${g}n`} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor={nuc} />
          <stop offset="100%" stopColor={nucDark} />
        </radialGradient>
        <radialGradient id={`${g}s`} cx="50%" cy="50%" r="50%">
          <stop offset="80%" stopColor="rgba(31,42,20,0.0)" />
          <stop offset="100%" stopColor="rgba(31,42,20,0.16)" />
        </radialGradient>
      </defs>
      <g transform={`rotate(${spin})`}>
        {/* soft shadow + cytoplasm */}
        <ellipse cx={4} cy={8} rx={R + 2} ry={R} fill="rgba(31,42,20,0.12)" />
        <circle r={R} fill={`url(#${g}c)`} stroke={outline ? C.forest : "none"} strokeWidth={4.5} />
        <circle r={R - 2} fill={`url(#${g}s)`} />
        {/* fine granules / texture */}
        {kind === "N" && scatter(140, R - 8, 11).map(([x, y, z], i) => <circle key={i} cx={x} cy={y} r={1.3 + z * 1.2} fill="#B786B5" opacity={0.55} />)}
        {kind === "M" && scatter(70, R - 10, 21).map(([x, y, z], i) => <circle key={i} cx={x} cy={y} r={1 + z} fill="#8E8FB2" opacity={0.45} />)}
        {kind === "M" && [[-38, 40, 9], [44, 46, 7], [-52, -18, 6], [30, -54, 5]].map(([x, y, r], i) => <circle key={`v${i}`} cx={x} cy={y} r={r} fill="#F7F6EC" stroke="#A9AECB" strokeWidth={1.5} />)}
        {/* nuclei */}
        {kind === "N" && (
          <g>
            <path d="M-46 -12 C-40 -40 -14 -44 -8 -26 C-2 -10 -22 2 -34 6 C-50 10 -52 4 -46 -12 Z" fill={`url(#${g}n)`} stroke={nucDark} strokeWidth={2} />
            <path d="M-12 -18 C4 -50 34 -44 34 -24 C34 -6 14 -2 2 -4" fill="none" stroke={nucDark} strokeWidth={4} />
            <path d="M14 -46 C36 -56 52 -36 42 -18 C34 -4 16 -14 14 -24 C12 -34 8 -42 14 -46 Z" fill={`url(#${g}n)`} stroke={nucDark} strokeWidth={2} />
            <path d="M40 -16 C52 6 40 20 30 24" fill="none" stroke={nucDark} strokeWidth={3.5} />
            <path d="M18 14 C34 4 52 18 44 36 C36 54 10 50 6 34 C2 22 8 18 18 14 Z" fill={`url(#${g}n)`} stroke={nucDark} strokeWidth={2} />
            <path d="M-34 6 C-30 24 -14 34 6 32" fill="none" stroke={nucDark} strokeWidth={3.5} />
            <path d="M-30 22 C-20 14 -4 22 -8 36 C-12 50 -34 50 -36 38 C-38 30 -36 26 -30 22 Z" fill={`url(#${g}n)`} stroke={nucDark} strokeWidth={2} />
          </g>
        )}
        {kind === "L" && (
          <g>
            <circle cx={-4} cy={2} r={50} fill={`url(#${g}n)`} stroke={nucDark} strokeWidth={2.5} />
            {scatter(40, 44, 5).map(([x, y, z], i) => <circle key={i} cx={x - 4} cy={y + 2} r={2 + z * 3} fill={nucDark} opacity={0.5} />)}
            <path d="M-34 -24 C-22 -40 0 -44 14 -36" fill="none" stroke="#FFFFFF" strokeWidth={4} opacity={0.25} strokeLinecap="round" />
          </g>
        )}
        {kind === "M" && (
          <g>
            <path d="M-56 -6 C-58 -44 -10 -60 22 -46 C48 -34 58 -6 46 14 C38 28 20 22 8 10 C-4 -2 -18 4 -14 22 C-10 40 -26 50 -40 40 C-52 30 -55 14 -56 -6 Z" fill={`url(#${g}n)`} stroke={nucDark} strokeWidth={2.5} />
            {scatter(30, 30, 9).map(([x, y, z], i) => <circle key={i} cx={x - 10} cy={y - 20} r={1.5 + z * 2} fill={nucDark} opacity={0.45} />)}
          </g>
        )}
        {kind === "E" && (
          <g>
            <path d="M-50 -4 C-52 -34 -20 -38 -14 -16 C-10 -2 -24 14 -34 16 C-46 18 -50 10 -50 -4 Z" fill={`url(#${g}n)`} stroke={nucDark} strokeWidth={2} />
            <path d="M-16 -8 C-4 -18 6 -18 16 -8" fill="none" stroke={nucDark} strokeWidth={4} />
            <path d="M50 -4 C52 -34 20 -38 14 -16 C10 -2 24 14 34 16 C46 18 50 10 50 -4 Z" fill={`url(#${g}n)`} stroke={nucDark} strokeWidth={2} />
            {scatter(120, R - 7, 33, (x, y) => Math.hypot(Math.abs(x) - 32, (y + 8) * 1.1) < 22 || (Math.abs(x) < 18 && y > -20 && y < -4)).map(([x, y, z], i) => (
              <circle key={i} cx={x} cy={y} r={4.2 + z * 1.8} fill={z > 0.5 ? "#E0603E" : "#EE7E52"} stroke="#A9381E" strokeWidth={0.9} opacity={0.92} />
            ))}
          </g>
        )}
        {kind === "B" && (
          <g>
            <path d="M-36 -20 C-20 -46 26 -40 30 -14 C34 10 8 6 2 22 C-6 40 -40 30 -42 8 C-44 -4 -42 -12 -36 -20 Z" fill={`url(#${g}n)`} opacity={0.75} />
            {scatter(95, R - 8, 44).map(([x, y, z], i) => (
              <circle key={i} cx={x} cy={y} r={4 + z * 3.4} fill={z > 0.55 ? "#2E1A52" : "#47307A"} opacity={0.9} />
            ))}
          </g>
        )}
        {/* specular */}
        <path d={`M${-R * 0.62} ${-R * 0.42} A ${R * 0.8} ${R * 0.8} 0 0 1 ${-R * 0.1} ${-R * 0.8}`} fill="none" stroke="#FFFFFF" strokeWidth={5} opacity={0.55} strokeLinecap="round" />
      </g>
    </svg>
  );
};

/** letter chip N / L / M / E / B */
export const WChip: React.FC<{ k: Wk; size?: number; hot?: boolean; on?: number }> = ({ k, size = 54, hot, on = 1 }) => (
  <div style={{ width: size, height: size, flex: `0 0 ${size}px`, borderRadius: size * 0.3, background: on > 0.5 ? WCOL[k] : "rgba(31,42,20,0.08)", border: `4px solid ${C.forest}`, color: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: size * 0.6, transform: `scale(${hot ? 1.12 : 1})`, boxShadow: hot ? `0 0 0 6px ${C.banana}` : "none" }}>
    {k}
  </div>
);
