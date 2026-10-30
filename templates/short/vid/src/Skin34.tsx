import React from "react";
import { C, FONT, ramp } from "./kit";

/** Our own schematic cross-section of THICK skin: 5 epidermal strata + the top of the dermis (Book Plume illustration). */
export type LayerId = "C" | "L" | "G" | "S" | "B";
export const LAYERS: { id: LayerId; name: string; y0: number; y1: number }[] = [
  { id: "C", name: "Corneum", y0: 40, y1: 178 },
  { id: "L", name: "Lucidum", y0: 178, y1: 220 },
  { id: "G", name: "Granulosum", y0: 220, y1: 296 },
  { id: "S", name: "Spinosum", y0: 296, y1: 476 },
  { id: "B", name: "Basale", y0: 476, y1: 548 },
];
const X0 = 120, X1 = 590; // block left/right (viewBox units)
const BM = (x: number) => 548 + 11 * Math.sin((x - X0) / 18.8); // basement membrane (wavy)

// deterministic randomness
const rnd = (() => {
  let a = 1234567;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
})();

/* ---------- geometry built once ---------- */
type Scale = { x: number; y: number; w: number; h: number; r: number; flake: number };
const CORNEUM: Scale[] = [];
for (let r = 0; r < 7; r++) {
  let x = X0 - 40 - rnd() * 40;
  const y = 58 + r * 17.5;
  while (x < X1 + 40) {
    const w = 96 + rnd() * 50;
    CORNEUM.push({ x: x + w / 2, y: y + (rnd() - 0.5) * 4, w, h: 11 + rnd() * 3, r: (rnd() - 0.5) * 3, flake: r === 0 && rnd() > 0.55 ? 1 : 0 });
    x += w * (0.78 + rnd() * 0.12);
  }
}
const LUCID: Scale[] = [];
for (let r = 0; r < 2; r++) {
  let x = X0 - 30 - rnd() * 30;
  while (x < X1 + 30) {
    const w = 110 + rnd() * 40;
    LUCID.push({ x: x + w / 2, y: 189 + r * 16, w, h: 10, r: 0, flake: 0 });
    x += w * 0.85;
  }
}
type Cell = { x: number; y: number; w: number; h: number; r: number; dots: [number, number, number][] };
const GRAN: Cell[] = [];
for (let r = 0; r < 3; r++) {
  let x = X0 - 20 + (r % 2) * 35 - rnd() * 20;
  const y = 236 + r * 23;
  while (x < X1 + 40) {
    const w = 62 + rnd() * 16;
    const dots: [number, number, number][] = [];
    const nd = 7 + Math.floor(rnd() * 6);
    for (let k = 0; k < nd; k++) dots.push([(rnd() - 0.5) * w * 0.7, (rnd() - 0.5) * 10, 1.8 + rnd() * 2.2]);
    GRAN.push({ x: x + w / 2, y, w, h: 24 - r * 2, r: (rnd() - 0.5) * 6, dots });
    x += w + 3;
  }
}
type Poly = { cx: number; cy: number; pts: [number, number][]; nr: number };
const SPIN: Poly[] = [];
for (let r = 0; r < 4; r++) {
  const cy = 322 + r * 44;
  let cx = X0 - 10 + (r % 2) * 26;
  while (cx < X1 + 40) {
    const rad = 25 + rnd() * 4;
    const pts: [number, number][] = [];
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2 + Math.PI / 6 + (rnd() - 0.5) * 0.25;
      const rr = rad * (0.9 + rnd() * 0.18);
      pts.push([Math.cos(a) * rr * 1.06, Math.sin(a) * rr * 0.86]);
    }
    SPIN.push({ cx: cx + (rnd() - 0.5) * 4, cy: cy + (rnd() - 0.5) * 4, pts, nr: 7 + rnd() * 2 });
    cx += 52;
  }
}
type Col = { x: number; w: number; base: number; h: number; mel: boolean };
const BASAL: Col[] = [];
{
  let x = X0 - 10;
  let i = 0;
  while (x < X1 + 20) {
    const w = 25 + rnd() * 5;
    const base = BM(x + w / 2);
    BASAL.push({ x: x + w / 2, w, base, h: 52 + rnd() * 10, mel: i === 6 || i === 15 });
    x += w + 1.5;
    i++;
  }
}
// dermal capillary loops (in the papillae: where the membrane dips is a ridge; loops rise where it's highest)
const LOOPS = [0, 1, 2, 3, 4].map((k) => X0 + 18.8 * (1.5 * Math.PI + 2 * Math.PI * k)).filter((x) => x > X0 + 20 && x < X1 - 14);
const FIBERS: string[] = [];
for (let k = 0; k < 16; k++) {
  const y = 600 + rnd() * 140;
  const x = X0 + rnd() * (X1 - X0 - 120);
  const l = 70 + rnd() * 90;
  FIBERS.push(`M${x} ${y} q${l / 4} ${-8 - rnd() * 8} ${l / 2} 0 t${l / 2} 0`);
}

const memPath = (() => {
  let d = `M${X0 - 20} ${BM(X0 - 20)}`;
  for (let x = X0 - 20; x <= X1 + 20; x += 6) d += ` L${x} ${BM(x)}`;
  return d;
})();

export const Epidermis: React.FC<{
  t: number;
  w?: number;
  lit?: Partial<Record<LayerId, number>>; // time each layer lights up
  focus?: LayerId | null; // currently named layer (others dim)
  focusT?: number;
  overview?: { epi: number; dermis: number; vessels: number; noVessel: number };
  badges?: boolean;
  names?: boolean;
  dermis?: boolean;
}> = ({ t, w = 860, lit = {}, focus = null, focusT = 0, overview, badges = true, names = true, dermis = true }) => {
  const H = dermis ? 780 : 580;
  const h = (w * H) / 860;
  const fade = focus ? ramp(t, focusT, focusT + 0.25) : 0;
  const lp = (id: LayerId) => (lit[id] === undefined ? 0 : ramp(t, lit[id]!, lit[id]! + 0.25));
  const pulse = (id: LayerId) => (lit[id] === undefined ? 0 : Math.max(0, 1 - Math.abs(t - lit[id]! - 0.2) / 0.35));
  const vesselGlow = overview ? ramp(t, overview.vessels, overview.vessels + 0.3) : 0;
  const flow = (t * 60) % 40;
  return (
    <svg width={w} height={h} viewBox={`0 0 860 ${H}`} style={{ overflow: "visible" }}>
      <defs>
        <clipPath id="e34clip">
          <rect x={X0} y={dermis ? 40 : 40} width={X1 - X0} height={dermis ? 720 : 520} rx={28} />
        </clipPath>
        <filter id="e34sh" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#1F2A14" floodOpacity="0.2" />
        </filter>
        <filter id="e34glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <radialGradient id="e34spin" cx="40%" cy="35%" r="80%">
          <stop offset="0%" stopColor="#FCE9DC" />
          <stop offset="100%" stopColor="#EDC6AE" />
        </radialGradient>
        <linearGradient id="e34basal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E9B79A" />
          <stop offset="100%" stopColor="#D49B7E" />
        </linearGradient>
        <linearGradient id="e34corn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F4E7C8" />
          <stop offset="100%" stopColor="#E3CFA4" />
        </linearGradient>
        <linearGradient id="e34derm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F7E6D8" />
          <stop offset="100%" stopColor="#F0D9C6" />
        </linearGradient>
        <linearGradient id="e34shine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0} />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* block */}
      <g filter="url(#e34sh)">
        <rect x={X0} y={40} width={X1 - X0} height={dermis ? 720 : 520} rx={28} fill="#F3E2CF" />
      </g>
      <g clipPath="url(#e34clip)">
        {/* dermis */}
        {dermis && (
          <g>
            <rect x={X0} y={500} width={X1 - X0} height={300} fill="url(#e34derm)" />
            {FIBERS.map((d, i) => (
              <path key={i} d={d} fill="none" stroke="#DDBBA2" strokeWidth={4} strokeLinecap="round" opacity={0.7} />
            ))}
            {/* capillary loops (blood vessels live in the dermis) */}
            {LOOPS.map((x, i) => {
              const top = BM(x) + 14;
              const d = `M${x - 12} 780 C${x - 14} 690 ${x - 16} ${top + 30} ${x - 9} ${top + 10} Q${x} ${top - 6} ${x + 9} ${top + 10} C${x + 16} ${top + 30} ${x + 14} 690 ${x + 12} 780`;
              return (
                <g key={i}>
                  {vesselGlow > 0 && <path d={d} fill="none" stroke={C.red} strokeWidth={26} opacity={0.35 * vesselGlow} filter="url(#e34glow)" />}
                  <path d={d} fill="none" stroke={C.redDark} strokeWidth={13} strokeLinecap="round" />
                  <path d={d} fill="none" stroke={C.red} strokeWidth={8} strokeLinecap="round" />
                  <path d={d} fill="none" stroke={C.redLight} strokeWidth={3} strokeDasharray="6 34" strokeDashoffset={-flow} strokeLinecap="round" />
                </g>
              );
            })}
            {/* a deeper vessel */}
            <path d={`M${X0 - 10} 742 C ${X0 + 120} 724 ${X0 + 260} 760 ${X1 + 10} 736`} fill="none" stroke={C.redDark} strokeWidth={18} />
            <path d={`M${X0 - 10} 742 C ${X0 + 120} 724 ${X0 + 260} 760 ${X1 + 10} 736`} fill="none" stroke={C.red} strokeWidth={12} />
          </g>
        )}
        {/* basement membrane */}
        <path d={memPath} fill="none" stroke="#9C6B57" strokeWidth={4} />
        {/* stratum basale: one row of column cells + melanocytes */}
        {BASAL.map((c, i) => (
          <g key={i}>
            <rect x={c.x - c.w / 2} y={c.base - c.h - 2} width={c.w} height={c.h} rx={9} fill={c.mel ? "#B9846A" : "url(#e34basal)"} stroke="#9C6B57" strokeWidth={2.5} />
            <ellipse cx={c.x} cy={c.base - c.h * 0.42} rx={c.w * 0.28} ry={c.h * 0.22} fill={c.mel ? "#4E2E22" : "#7A4535"} />
            {c.mel && (
              <g stroke="#5C3426" strokeWidth={4} strokeLinecap="round" fill="none">
                <path d={`M${c.x} ${c.base - c.h} q-10 -30 -36 -58`} />
                <path d={`M${c.x} ${c.base - c.h} q8 -34 30 -70`} />
                <path d={`M${c.x + 4} ${c.base - c.h + 6} q26 -14 50 -30`} />
              </g>
            )}
          </g>
        ))}
        {/* stratum spinosum: polygonal cells with spiny bridges */}
        {SPIN.map((p, i) => (
          <g key={i} transform={`translate(${p.cx} ${p.cy})`}>
            {p.pts.map(([x, y], k) => (
              <line key={k} x1={x * 0.92} y1={y * 0.92} x2={x * 1.22} y2={y * 1.22} stroke="#B98A74" strokeWidth={2.4} strokeLinecap="round" />
            ))}
            <polygon points={p.pts.map(([x, y]) => `${x},${y}`).join(" ")} fill="url(#e34spin)" stroke="#B98A74" strokeWidth={2.5} strokeLinejoin="round" />
            {p.pts.map(([x, y], k) => {
              const [x2, y2] = p.pts[(k + 1) % 6];
              const mx = (x + x2) / 2, my = (y + y2) / 2;
              return <line key={"s" + k} x1={mx * 0.9} y1={my * 0.9} x2={mx * 1.18} y2={my * 1.18} stroke="#B98A74" strokeWidth={2} strokeLinecap="round" />;
            })}
            <circle r={p.nr} fill="#9C6B5A" />
            <circle r={p.nr * 0.35} cx={-2} cy={-2} fill="#C4917E" />
          </g>
        ))}
        {/* stratum granulosum: flattened cells packed with dark granules */}
        <rect x={X0} y={220} width={X1 - X0} height={78} fill="#EBCFAE" />
        {GRAN.map((c, i) => (
          <g key={i} transform={`translate(${c.x} ${c.y}) rotate(${c.r})`}>
            <path d={`M${-c.w / 2} 0 Q${-c.w / 4} ${-c.h / 2 - 2} 0 ${-c.h / 2} Q${c.w / 4} ${-c.h / 2 - 2} ${c.w / 2} 0 Q${c.w / 4} ${c.h / 2 + 2} 0 ${c.h / 2} Q${-c.w / 4} ${c.h / 2 + 2} ${-c.w / 2} 0 Z`} fill="#E6C29A" stroke="#A9825E" strokeWidth={2.2} />
            <ellipse rx={7} ry={4} fill="#8C6248" opacity={0.6} />
            {c.dots.map(([x, y, r], k) => (
              <circle key={k} cx={x} cy={y} r={r} fill="#5E3F27" />
            ))}
          </g>
        ))}
        {/* stratum lucidum: clear, glassy band */}
        <rect x={X0} y={178} width={X1 - X0} height={42} fill="#FFFDF6" />
        {LUCID.map((s, i) => (
          <ellipse key={i} cx={s.x} cy={s.y} rx={s.w / 2} ry={s.h / 2} fill="none" stroke="#E2D7BC" strokeWidth={2} />
        ))}
        <rect x={X0} y={186} width={X1 - X0} height={8} fill="url(#e34shine)" opacity={0.8} />
        {/* stratum corneum: stacked flat dead scales */}
        <rect x={X0} y={40} width={X1 - X0} height={140} fill="#EFE0BE" />
        {CORNEUM.map((s, i) => (
          <g key={i} transform={`translate(${s.x} ${s.y - s.flake * 6}) rotate(${s.r - s.flake * 4})`}>
            <path d={`M${-s.w / 2} 0 Q0 ${-s.h} ${s.w / 2} 0 Q0 ${s.h} ${-s.w / 2} 0 Z`} fill="url(#e34corn)" stroke="#B9A274" strokeWidth={2.2} />
          </g>
        ))}
        {/* highlight overlays */}
        {LAYERS.map((L) => {
          const p = lp(L.id);
          const isF = focus === L.id;
          const dimIt = focus && !isF ? 0.5 * fade : 0;
          const y1 = L.id === "B" ? 560 : L.y1;
          return (
            <g key={L.id}>
              {dimIt > 0 && <rect x={X0} y={L.y0} width={X1 - X0} height={y1 - L.y0} fill={C.paper} opacity={dimIt} />}
              {p > 0 && isF && <rect x={X0} y={L.y0} width={X1 - X0} height={y1 - L.y0} fill={C.banana} opacity={0.22 * p + 0.12 * pulse(L.id)} />}
            </g>
          );
        })}
        {dermis && focus && <rect x={X0} y={560} width={X1 - X0} height={220} fill={C.paper} opacity={0.5 * fade} />}
        {/* overview: epidermis vs dermis tint */}
        {overview && overview.epi > 0 && <rect x={X0} y={40} width={X1 - X0} height={515} fill={C.banana} opacity={0.18 * ramp(t, overview.epi, overview.epi + 0.3)} />}
      </g>
      {/* outline of focused layer */}
      {LAYERS.map((L) => {
        const p = lp(L.id);
        if (p <= 0 || focus !== L.id) return null;
        const y1 = L.id === "B" ? 560 : L.y1;
        return <rect key={L.id} x={X0 - 6} y={L.y0 - 3} width={X1 - X0 + 12} height={y1 - L.y0 + 6} rx={12} fill="none" stroke={C.forest} strokeWidth={6} opacity={p} />;
      })}
      {/* left letter badges */}
      {badges &&
        LAYERS.map((L) => {
          const p = lp(L.id);
          if (p <= 0) return null;
          const cy = (L.y0 + (L.id === "B" ? 556 : L.y1)) / 2;
          const isF = focus === L.id;
          const s = 0.6 + 0.4 * p + 0.15 * pulse(L.id);
          return (
            <g key={L.id} transform={`translate(62 ${cy}) scale(${s})`} opacity={p}>
              <circle r={34} fill={isF ? C.banana : C.matcha} stroke={C.forest} strokeWidth={isF ? 5 : 0} />
              <text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={isF ? C.forest : C.paper}>{L.id}</text>
              <line x1={36} y1={0} x2={52} y2={0} stroke={C.forest} strokeWidth={4} strokeLinecap="round" />
            </g>
          );
        })}
      {/* right name tags */}
      {names &&
        LAYERS.map((L) => {
          const p = lp(L.id);
          if (p <= 0) return null;
          const cy = (L.y0 + (L.id === "B" ? 556 : L.y1)) / 2;
          const isF = focus === L.id;
          const wd = L.name.length * 21 + 34;
          return (
            <g key={L.id} transform={`translate(${612 + (1 - p) * 30} ${cy})`} opacity={p * (isF || !focus ? 1 : 0.55)}>
              <line x1={-22} y1={0} x2={-2} y2={0} stroke={C.forest} strokeWidth={4} strokeLinecap="round" />
              <rect x={0} y={-25} width={wd} height={50} rx={14} fill={isF ? C.banana : C.matcha} stroke={C.forest} strokeWidth={isF ? 4 : 0} />
              <text x={wd / 2} y={11} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill={isF ? C.forest : C.paper}>{L.name}</text>
            </g>
          );
        })}
      {/* overview labels */}
      {overview && (
        <g fontFamily={FONT} fontWeight={800}>
          {overview.epi > 0 && (
            <g opacity={ramp(t, overview.epi, overview.epi + 0.3)} transform={`translate(${612 + (1 - ramp(t, overview.epi, overview.epi + 0.3)) * 30} 0)`}>
              <path d="M0 44 Q14 44 14 60 L14 280 Q14 296 28 298 Q14 300 14 316 L14 536 Q14 552 0 552" fill="none" stroke={C.forest} strokeWidth={6} strokeLinecap="round" />
              <rect x={40} y={272} width={196} height={54} rx={16} fill={C.forest} />
              <text x={138} y={310} textAnchor="middle" fontSize={32} fill={C.paper}>EPIDERMIS</text>
            </g>
          )}
          {dermis && overview.dermis > 0 && (
            <g opacity={ramp(t, overview.dermis, overview.dermis + 0.3)}>
              <path d="M612 570 Q626 570 626 584 L626 640 Q626 656 640 658 Q626 660 626 676 L626 740 Q626 754 612 754" fill="none" stroke={C.matcha} strokeWidth={6} strokeLinecap="round" />
              <rect x={652} y={632} width={160} height={54} rx={16} fill={C.matcha} />
              <text x={732} y={670} textAnchor="middle" fontSize={32} fill={C.paper}>DERMIS</text>
            </g>
          )}
          {overview.noVessel > 0 && (
            <g transform={`translate(355 300) scale(${0.7 + 0.3 * ramp(t, overview.noVessel, overview.noVessel + 0.25)})`} opacity={ramp(t, overview.noVessel, overview.noVessel + 0.2)}>
              <rect x={-200} y={-44} width={410} height={88} rx={44} fill={C.card} stroke={C.forest} strokeWidth={5} />
              <circle cx={-150} cy={0} r={26} fill={C.red} />
              <path d="M-162 -12 L-138 12 M-138 -12 L-162 12" stroke={C.paper} strokeWidth={6} strokeLinecap="round" />
              <text x={36} y={13} textAnchor="middle" fontSize={36} fill={C.forest}>no blood vessels</text>
            </g>
          )}
        </g>
      )}
    </svg>
  );
};

/** Two mini columns: thick skin (5 strata, lucidum lit) vs thin skin (4 strata) */
export const ThickThin: React.FC<{ t: number; t0: number; litT: number }> = ({ t, t0, litT }) => {
  const p = ramp(t, t0, t0 + 0.4);
  const lit = ramp(t, litT, litT + 0.3);
  const glow = Math.max(0, 1 - Math.abs(t - litT - 0.3) / 0.6);
  const col = (thick: boolean) => {
    const bands = thick
      ? [["C", 110, "#EFE0BE"], ["L", 44, "#FFFDF6"], ["G", 50, "#E6C29A"], ["S", 110, "#F2D0BA"], ["B", 44, "#D9A486"]]
      : [["C", 44, "#EFE0BE"], ["G", 40, "#E6C29A"], ["S", 90, "#F2D0BA"], ["B", 40, "#D9A486"]];
    let y = 0;
    return (
      <g>
        <rect x={-4} y={-4} width={228} height={(thick ? 358 : 214) + 8} rx={20} fill={C.forest} opacity={0.12} />
        {bands.map(([id, hgt, fill]) => {
          const yy = y;
          y += hgt as number;
          const isL = id === "L";
          return (
            <g key={id as string}>
              <rect x={0} y={yy} width={220} height={hgt as number} fill={fill as string} stroke="#B9A274" strokeWidth={1.5} />
              {isL && <rect x={0} y={yy} width={220} height={hgt as number} fill={C.banana} opacity={0.85 * lit} />}
              {isL && glow > 0 && <rect x={-10} y={yy - 8} width={240} height={(hgt as number) + 16} rx={12} fill="none" stroke={C.red} strokeWidth={6} opacity={glow} />}
              <text x={-18} y={yy + (hgt as number) / 2 + 11} textAnchor="end" fontFamily={FONT} fontWeight={800} fontSize={30} fill={isL ? C.red : C.forest} opacity={isL ? 0.4 + 0.6 * lit : 0.6}>{id as string}</text>
            </g>
          );
        })}
      </g>
    );
  };
  return (
    <svg width={860} height={560} viewBox="0 0 860 560" style={{ overflow: "visible", opacity: p }}>
      <g transform={`translate(110 ${120 + (1 - p) * 30})`}>
        {col(true)}
        <text x={110} y={-56} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill={C.forest}>THICK SKIN</text>
        <text x={110} y={-18} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={26} fill={C.matcha}>palms · soles · 5 layers</text>
      </g>
      <g transform={`translate(530 ${120 + (1 - p) * 30})`}>
        {col(false)}
        <text x={110} y={-56} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill={C.forest}>THIN SKIN</text>
        <text x={110} y={-18} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={26} fill={C.matcha}>most of the body · 4 layers</text>
      </g>
    </svg>
  );
};
