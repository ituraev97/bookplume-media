import React from "react";
import { C, FONT, ramp } from "./kit";

/**
 * Book Plume own diagrams for the alveoli short (run 70).
 * Facts: OpenStax Anatomy & Physiology 2e, 22.1 Organs and Structures of the Respiratory System
 *   (trachea → right/left main (primary) bronchi → lobar (secondary) → segmental (tertiary) bronchi → bronchioles →
 *    terminal → respiratory bronchioles → alveolar ducts → alveolar sacs → alveoli;
 *    type I alveolar cells = squamous, thin wall for gas exchange, ~97% of the alveolar surface;
 *    type II alveolar cells = secrete pulmonary surfactant, lowers surface tension so alveoli don't collapse)
 * Ochs M et al. 2004, Am J Respir Crit Care Med 169:120 — mean ~480 million alveoli; gas-exchange surface ~70 m².
 * Right main bronchus wider/shorter/more vertical; right lung 3 lobar bronchi, left 2.
 */

export const LV = ["#7FC3E0", "#9CC46A", "#F2D14E", "#E8796B", "#B49BE0", "#F08FB0"]; // level colours: trachea, main, lobar, segmental, bronchioles, alveoli
const EDGE = C.forest;
const BEIGE = "#E9E3C8";
const PINK = "#F3CFC6", PINK_D = "#C98F86";

const mix = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return "#" + pa.map((v, i) => Math.round(v + (pb[i] - v) * Math.max(0, Math.min(1, k))).toString(16).padStart(2, "0")).join("");
};

/* ---------------- bronchial tree (procedural, deterministic) ---------------- */
type Seg = { x1: number; y1: number; x2: number; y2: number; w: number; lv: number; d: number };
type Tip = { x: number; y: number; a: number; d: number };
const DEG = Math.PI / 180;
const build = () => {
  const segs: Seg[] = [];
  const tips: Tip[] = [];
  const go = (x: number, y: number, aDeg: number, len: number, w: number, lv: number, d: number, kids: (x: number, y: number, a: number, len: number, w: number, d: number) => void) => {
    const a = aDeg * DEG;
    const x2 = x + Math.sin(a) * len, y2 = y + Math.cos(a) * len;
    segs.push({ x1: x, y1: y, x2, y2, w, lv, d });
    kids(x2, y2, aDeg, len, w, d + len);
  };
  // bronchioles: 2 generations of forks, then alveolar clusters at the tips
  const bron = (x: number, y: number, a: number, len: number, w: number, d: number, gen: number) => {
    [-24, 22].forEach((da, i) => {
      go(x, y, a + da + (gen === 0 ? (i ? 4 : -3) : 0), len, w, 4, d, (x2, y2, a2, l2, w2, d2) => {
        if (gen < 1) bron(x2, y2, a2, l2 * 0.78, w2 * 0.8, d2, gen + 1);
        else tips.push({ x: x2, y: y2, a: a2, d: d2 });
      });
    });
  };
  const seg = (x: number, y: number, a: number, spread: number[], len: number, w: number, d: number) => {
    spread.forEach((da) => go(x, y, a + da, len, w, 3, d, (x2, y2, a2, l2, w2, d2) => bron(x2, y2, a2, l2 * 0.62, w2 * 0.62, d2, 0)));
  };
  const X0 = 430;
  // trachea
  segs.push({ x1: X0, y1: 0, x2: X0, y2: 175, w: 44, lv: 0, d: 0 });
  // right main bronchus (viewer's left): wider, shorter, more vertical
  go(X0 - 8, 172, -28, 92, 34, 1, 175, (x, y, _a, _l, _w, d) => {
    go(x, y, -122, 70, 22, 2, d, (x2, y2, a2, l2, w2, d2) => seg(x2, y2, a2, [-16, 14, 42], 64, 15, d2)); // upper lobe bronchus
    go(x, y, -52, 82, 20, 2, d, (x2, y2, a2, l2, w2, d2) => seg(x2, y2, a2, [-22, 22], 70, 14, d2)); // middle lobe bronchus
    go(x, y, -6, 150, 23, 2, d, (x2, y2, a2, l2, w2, d2) => seg(x2, y2, a2, [-46, -18, 10], 96, 15, d2)); // lower lobe bronchus
  });
  // left main bronchus: narrower, longer, more horizontal
  go(X0 + 8, 172, 50, 132, 28, 1, 175, (x, y, _a, _l, _w, d) => {
    go(x, y, 120, 80, 20, 2, d, (x2, y2, a2, l2, w2, d2) => seg(x2, y2, a2, [-40, -12, 18], 66, 14, d2)); // upper lobe bronchus
    go(x, y, 12, 140, 21, 2, d, (x2, y2, a2, l2, w2, d2) => seg(x2, y2, a2, [-10, 16, 42], 96, 15, d2)); // lower lobe bronchus
  });
  return { segs, tips };
};
export const TREE = build();
const MAXD = Math.max(...TREE.tips.map((t) => t.d));

const R_LUNG = "M 300 70 C 250 75 160 160 120 270 C 85 365 70 470 72 575 C 72 610 104 620 150 612 C 230 596 320 584 384 604 C 404 610 410 588 405 560 C 395 460 398 335 388 232 C 378 150 346 72 300 70 Z";
const L_LUNG = "M 560 70 C 612 75 700 160 740 270 C 775 365 790 470 788 575 C 788 612 758 622 712 614 C 642 604 572 612 520 606 C 490 602 484 572 500 556 C 532 528 562 512 567 478 C 572 436 546 406 507 378 C 486 360 478 334 478 302 C 478 232 486 150 520 96 C 532 78 545 70 560 70 Z";

/** lit: per level 0..5, a value 0..1 (how strongly coloured); cur = level now being named (pulses); air = 0..1 air particles flowing */
export const BronchialTree: React.FC<{ t: number; drawn: number; lit: number[]; cur: number; air?: number; lungs?: number }> = ({ t, drawn, lit, cur, air = 0, lungs = 1 }) => {
  const pulse = 0.5 + 0.5 * Math.sin(t * 8);
  const reach = drawn * (MAXD + 60);
  const col = (lv: number) => mix(BEIGE, LV[lv], lit[lv] ?? 0);
  return (
    <svg width={860} height={660} viewBox="0 0 860 660" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <defs>
        <pattern id="lobT" width={30} height={26} patternUnits="userSpaceOnUse">
          <path d="M 0 13 L 7 2 L 22 2 L 30 13 L 22 24 L 7 24 Z" fill="none" stroke={PINK_D} strokeWidth={1.2} opacity={0.45} />
        </pattern>
        <radialGradient id="shT" cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#fff" stopOpacity={0.35} />
          <stop offset="1" stopColor="#5a2a20" stopOpacity={0.16} />
        </radialGradient>
        <linearGradient id="trT" x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity={0.12} />
          <stop offset="0.5" stopColor="#fff" stopOpacity={0.35} />
          <stop offset="1" stopColor="#000" stopOpacity={0.12} />
        </linearGradient>
      </defs>
      {/* lung silhouettes */}
      <g opacity={0.9 * lungs} transform="translate(430 330) scale(1.04 1.0) translate(-430 -350)">
        {[R_LUNG, L_LUNG].map((d, i) => (
          <g key={i}>
            <path d={d} fill={PINK} />
            <path d={d} fill="url(#lobT)" />
            <path d={d} fill="url(#shT)" />
            <path d={d} fill="none" stroke={PINK_D} strokeWidth={5} />
          </g>
        ))}
      </g>
      <g transform="translate(430 160) scale(0.92) translate(-430 -172)">
      {/* airway: outline pass then fill pass, so the tree reads as tubes */}
      {[0, 1].map((pass) =>
        TREE.segs.map((s, i) => {
          if (s.d > reach) return null;
          const k = Math.min(1, (reach - s.d) / Math.max(1, Math.hypot(s.x2 - s.x1, s.y2 - s.y1)));
          const x2 = s.x1 + (s.x2 - s.x1) * k, y2 = s.y1 + (s.y2 - s.y1) * k;
          const glow = s.lv === cur ? pulse : 0;
          return (
            <line
              key={`${pass}-${i}`}
              x1={s.x1}
              y1={s.y1}
              x2={x2}
              y2={y2}
              stroke={pass === 0 ? EDGE : mix(col(s.lv), "#ffffff", 0.25 * glow)}
              strokeWidth={pass === 0 ? s.w + 7 + (s.lv === cur ? 6 * pulse : 0) : s.w}
              strokeLinecap="round"
            />
          );
        })
      )}
      {/* tracheal cartilage rings (C-shaped) */}
      {reach > 160 &&
        [16, 38, 60, 82, 104, 126, 148].map((y) => <path key={y} d={`M ${430 - 20} ${y} Q 430 ${y + 9} ${430 + 20} ${y}`} fill="none" stroke={EDGE} strokeWidth={3} opacity={0.45} />)}
      {reach > 160 && <rect x={408} y={0} width={44} height={172} fill="url(#trT)" />}
      {/* alveolar clusters at the tips */}
      {TREE.tips.map((p, i) => {
        if (p.d > reach - 10) return null;
        const g = Math.min(1, (reach - 10 - p.d) / 40);
        const a = p.a * DEG;
        const cx = p.x + Math.sin(a) * 9, cy = p.y + Math.cos(a) * 9;
        const fill = mix("#F6E2DC", LV[5], lit[5] ?? 0);
        const bump = cur === 5 ? 1 + 0.12 * pulse : 1;
        return (
          <g key={i} transform={`translate(${cx} ${cy}) scale(${g * bump})`}>
            {[[0, 0, 9], [-9, -5, 7], [9, -5, 7], [-6, 8, 7], [7, 8, 7]].map(([dx, dy, r], j) => (
              <circle key={j} cx={dx} cy={dy} r={r} fill={fill} stroke={EDGE} strokeWidth={2.5} />
            ))}
          </g>
        );
      })}
      {/* air particles going down the trachea and main bronchi */}
      {air > 0 &&
        Array.from({ length: 14 }).map((_, i) => {
          const ph = (t * 0.9 + i / 14) % 1;
          const path = i % 2 === 0 ? [[430, -10], [430, 172], [380, 262], [330, 360]] : [[430, -10], [430, 172], [530, 255], [600, 330]];
          const seg = ph * 3, si = Math.min(2, Math.floor(seg)), f = seg - si;
          const x = path[si][0] + (path[si + 1][0] - path[si][0]) * f;
          const y = path[si][1] + (path[si + 1][1] - path[si][1]) * f;
          return <circle key={i} cx={x + Math.sin(i * 3.1) * 6} cy={y} r={6} fill="#ffffff" stroke={LV[0]} strokeWidth={3} opacity={air * Math.sin(ph * Math.PI)} />;
        })}
      </g>
    </svg>
  );
};

/* ---------------- alveolar cluster → floor plan (70 m²) ---------------- */
const GRAPES: [number, number, number][] = [
  [0, 0, 46], [-62, -30, 40], [60, -34, 42], [-40, 48, 38], [44, 50, 40], [0, -78, 38], [-92, 34, 32], [94, 26, 32], [-4, 92, 34],
];
export const AlveolarSac: React.FC<{ t: number; w: number; lit?: number }> = ({ t, w, lit = 0 }) => {
  const pulse = 1 + 0.035 * Math.sin(t * 3);
  return (
    <svg width={w} height={w * 1.15} viewBox="-150 -170 300 345" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <path d="M 0 175 L 0 92" stroke={EDGE} strokeWidth={30} strokeLinecap="round" />
      <path d="M 0 175 L 0 92" stroke={LV[4]} strokeWidth={18} strokeLinecap="round" />
      <g transform={`scale(${pulse})`}>
        {GRAPES.map(([x, y, r], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={r} fill={mix("#F6E2DC", LV[5], lit)} stroke={EDGE} strokeWidth={5} />
            <circle cx={x - r * 0.3} cy={y - r * 0.35} r={r * 0.28} fill="#fff" opacity={0.45} />
            {/* capillary net on each sac */}
            <path d={`M ${x - r * 0.8} ${y + r * 0.2} Q ${x - r * 0.2} ${y - r * 0.3} ${x + r * 0.6} ${y + r * 0.35}`} fill="none" stroke={C.red} strokeWidth={3} opacity={0.55} />
            <path d={`M ${x - r * 0.4} ${y + r * 0.75} Q ${x + r * 0.1} ${y + r * 0.2} ${x + r * 0.8} ${y - r * 0.2}`} fill="none" stroke="#5C86C9" strokeWidth={3} opacity={0.55} />
          </g>
        ))}
      </g>
    </svg>
  );
};

/** floor plan of a small one-bedroom (10 × 7 m = 70 m²), tiles fill with p (0..1) */
export const FloorPlan: React.FC<{ w: number; p: number; rooms: number }> = ({ w, p, rooms }) => {
  const cell = w / 10;
  const n = Math.round(p * 70);
  return (
    <svg width={w + 20} height={cell * 7 + 20} viewBox={`-10 -10 ${w + 20} ${cell * 7 + 20}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {Array.from({ length: 70 }).map((_, i) => {
        const r = Math.floor(i / 10), c = i % 10;
        const order = r % 2 === 0 ? c : 9 - c; // snake fill
        const idx = r * 10 + order;
        const on = idx < n;
        return <rect key={i} x={c * cell + 2} y={r * cell + 2} width={cell - 4} height={cell - 4} rx={6} fill={on ? (r * 10 + c) % 7 === 3 ? LV[5] : "#F6D7CF" : "#FFFEF6"} stroke={on ? PINK_D : C.line} strokeWidth={2} />;
      })}
      <g opacity={rooms} fill="none" stroke={EDGE} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round">
        <rect x={0} y={0} width={w} height={cell * 7} rx={4} />
        <path d={`M ${cell * 6} 0 L ${cell * 6} ${cell * 2.4} M ${cell * 6} ${cell * 3.6} L ${cell * 6} ${cell * 7}`} />
        <path d={`M ${cell * 6} ${cell * 4.2} L ${cell * 7.6} ${cell * 4.2} M ${cell * 8.8} ${cell * 4.2} L ${cell * 10} ${cell * 4.2}`} />
        <path d={`M 0 ${cell * 4.5} L ${cell * 1.4} ${cell * 4.5} M ${cell * 2.8} ${cell * 4.5} L ${cell * 3.2} ${cell * 4.5}`} />
      </g>
      <g opacity={rooms} fontFamily={FONT} fontWeight={800} fill={EDGE} textAnchor="middle">
        <text x={cell * 3} y={cell * 2.2} fontSize={cell * 0.62}>living room</text>
        <text x={cell * 8} y={cell * 2.2} fontSize={cell * 0.62}>bedroom</text>
        <text x={cell * 1.6} y={cell * 6} fontSize={cell * 0.55}>kitchen</text>
        <text x={cell * 8} y={cell * 5.9} fontSize={cell * 0.55}>bath</text>
      </g>
    </svg>
  );
};

/* ---------------- one alveolus in section: type I + type II cells, capillary ---------------- */
export const Alveolus: React.FC<{ t: number; w: number; t2: number; t1: number; surf: number; gas: number; cap?: number }> = ({ t, w, t2, t1, surf, gas, cap = 1 }) => {
  const R = 190;
  const pulse = 0.5 + 0.5 * Math.sin(t * 8);
  // type I cells: thin flat cells around the wall; type II at two angles
  const T2 = [212, 328];
  const arcs: [number, number][] = [];
  let a = 0;
  const cuts = [-8, 40, 95, 150, 200, 225, 288, 318, 340, 352];
  for (let i = 0; i < cuts.length - 1; i++) arcs.push([cuts[i], cuts[i + 1]]);
  const P = (deg: number, r: number) => [Math.cos(deg * DEG) * r, Math.sin(deg * DEG) * r];
  const arcPath = (a0: number, a1: number, r: number) => {
    const [x0, y0] = P(a0, r), [x1, y1] = P(a1, r);
    return `M ${x0} ${y0} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
  };
  void a;
  const t1col = mix("#E8DDD0", LV[0], t1);
  return (
    <svg width={w} height={w} viewBox="-300 -300 600 600" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {/* capillary hugging the wall (right side) */}
      <g opacity={cap}>
        <path d={arcPath(-70, 70, R + 52)} fill="none" stroke={EDGE} strokeWidth={62} strokeLinecap="round" />
        <path d={arcPath(-70, 70, R + 52)} fill="none" stroke="#F1B3A8" strokeWidth={52} strokeLinecap="round" />
        {[-58, -38, -18, 2, 22, 42, 62].map((d, i) => {
          const dd = d + ((t * 14) % 20);
          const [x, y] = P(dd, R + 52);
          return <ellipse key={i} cx={x} cy={y} rx={17} ry={11} transform={`rotate(${dd + 90} ${x} ${y})`} fill={C.red} stroke={C.redDark} strokeWidth={3} />;
        })}
      </g>
      {/* alveolar air space */}
      <circle cx={0} cy={0} r={R - 10} fill="#F3FAFD" />
      {/* surfactant lining (thin yellow film) */}
      <circle cx={0} cy={0} r={R - 14} fill="none" stroke={C.banana} strokeWidth={10 * surf} opacity={surf} />
      {/* type I cells: thin flat */}
      {arcs.map(([a0, a1], i) => {
        const mid = (a0 + a1) / 2;
        const [nx, ny] = P(mid, R);
        return (
          <g key={i}>
            <path d={arcPath(a0 + 1.5, a1 - 1.5, R)} fill="none" stroke={EDGE} strokeWidth={17} strokeLinecap="round" />
            <path d={arcPath(a0 + 1.5, a1 - 1.5, R)} fill="none" stroke={t1col} strokeWidth={10} strokeLinecap="round" />
            <ellipse cx={nx} cy={ny} rx={20} ry={8} transform={`rotate(${mid + 90} ${nx} ${ny})`} fill={mix("#B9A99A", "#3F6E8C", t1)} stroke={EDGE} strokeWidth={3} />
          </g>
        );
      })}
      {/* type II cells: plump, cuboidal, with lamellar bodies (surfactant) */}
      {T2.map((deg, i) => {
        const [x, y] = P(deg, R - 2);
        const g = 1 + 0.08 * t2 * pulse;
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${deg - 90}) scale(${1.15 * g})`}>
            <path d="M -32 12 C -36 -10 -22 -32 0 -33 C 22 -32 36 -10 32 12 Q 0 18 -32 12 Z" fill={mix("#E8DDD0", LV[2], t2)} stroke={EDGE} strokeWidth={5} />
            <circle cx={0} cy={2} r={9} fill={mix("#B9A99A", "#7A5A12", t2)} stroke={EDGE} strokeWidth={3} />
            {[[-16, -10], [14, -14], [-2, -24], [21, 0], [-21, 2]].map(([dx, dy], j) => (
              <circle key={j} cx={dx} cy={dy} r={5} fill="#fff" stroke={EDGE} strokeWidth={2} />
            ))}
          </g>
        );
      })}
      {/* gas exchange arrows across the thin wall into / out of the capillary */}
      {gas > 0 && (
        <g opacity={gas} fontFamily={FONT} fontWeight={800}>
          {[
            [4, "O₂", 1],
            [30, "CO₂", -1],
          ].map(([d, lab, dir], i) => {
            const dd = d as number;
            const k = ((t * 0.9 + i * 0.5) % 1);
            const r0 = (dir as number) > 0 ? R - 70 : R + 70, r1 = (dir as number) > 0 ? R + 70 : R - 70;
            const [x0, y0] = P(dd, r0), [x1, y1] = P(dd, r1);
            const [bx, by] = P(dd, r0 + (r1 - r0) * k);
            return (
              <g key={i}>
                <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={EDGE} strokeWidth={6} strokeDasharray="10 10" opacity={0.6} />
                <circle cx={bx} cy={by} r={19} fill={(dir as number) > 0 ? "#7FC3E0" : "#B49BE0"} stroke={EDGE} strokeWidth={4} />
                <text x={bx} y={by + 7} fontSize={17} textAnchor="middle" fill={EDGE}>{lab as string}</text>
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
};
