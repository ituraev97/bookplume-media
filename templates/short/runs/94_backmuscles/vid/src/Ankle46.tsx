import React from "react";
import { C, FONT, ramp } from "./kit";

/**
 * Our own schematic MEDIAL view of the right ankle + foot (toes to the LEFT, heel to the RIGHT, like Gray's Fig. 442).
 * Book Plume illustration, viewBox 860 x 680.
 * Tarsal tunnel = space posteroinferior to the medial malleolus, roofed by the flexor retinaculum, floored by tibia/talus/calcaneus.
 * Contents anterior -> posterior (StatPearls "Tarsal Tunnel Syndrome"; Radiopaedia "Tarsal tunnel"; Gray 1918 p. 489):
 *   tibialis posterior tendon, flexor digitorum longus tendon, posterior tibial artery, posterior tibial vein, tibial nerve,
 *   flexor hallucis longus tendon. Mnemonic: Tom, Dick, And Very Nervous Harry.
 */
export type SId = "tp" | "fdl" | "art" | "vein" | "nerve" | "fhl";
export type APart = SId | "mall" | "tunnel" | "ret" | "calc" | "tibia";
export const ST: { id: SId; letter: string; word: string; name: string; short: string; kind: string; color: string; w: number }[] = [
  { id: "tp", letter: "T", word: "Tom", name: "Tibialis posterior", short: "Tibialis post.", kind: "tendon", color: "#7FB069", w: 17 },
  { id: "fdl", letter: "D", word: "Dick", name: "Flexor digitorum longus", short: "Flexor dig. longus", kind: "tendon", color: "#3FA7A0", w: 15 },
  { id: "art", letter: "A", word: "And", name: "Posterior tibial artery", short: "Post. tibial artery", kind: "artery", color: "#D9534F", w: 13 },
  { id: "vein", letter: "V", word: "Very", name: "Posterior tibial vein", short: "Post. tibial vein", kind: "vein", color: "#4F7FC6", w: 13 },
  { id: "nerve", letter: "N", word: "Nervous", name: "Tibial nerve", short: "Tibial nerve", kind: "nerve", color: "#E9C743", w: 12 },
  { id: "fhl", letter: "H", word: "Harry", name: "Flexor hallucis longus", short: "Flexor hallucis longus", kind: "tendon", color: "#9D7BC8", w: 17 },
];

/* malleolus centre: the six structures wrap around it at growing radii */
const MX = 548, MY = 300;
const R0 = 62, DR = 21;
const tubePath = (i: number) => {
  const r = R0 + i * DR;
  const top = MX + r;
  // down the back of the leg, around behind + below the malleolus, then forward into the sole
  const by = MY + r;
  const sole = 470 + i * 9;
  return `M ${top + 18 - i * 2} -40 C ${top + 8} 80 ${top} 200 ${top} ${MY} A ${r} ${r} 0 0 1 ${MX} ${by} C ${MX - 120} ${by + 6} ${MX - 230} ${sole - 10} ${MX - 330 - i * 12} ${sole}`;
};
/** point on tube i at the 45 degree spot (inside the tunnel, under the retinaculum) */
export const tubeMid = (i: number, deg = 45): [number, number] => {
  const r = R0 + i * DR;
  const a = (deg * Math.PI) / 180;
  return [MX + r * Math.cos(a), MY + r * Math.sin(a)];
};

const LEG =
  "M 452 -60 L 790 -60 C 780 60 768 220 772 330 C 776 400 812 450 806 520 C 800 566 770 584 724 588 C 560 598 330 594 150 574 C 92 568 52 548 56 516 C 60 494 92 484 130 470 C 230 434 340 400 404 368 C 452 344 470 300 468 240 C 466 140 456 40 452 -60 Z";
const TIBIA = "M 470 -60 L 590 -60 C 590 60 594 170 598 238 C 606 290 590 340 548 352 C 506 358 482 330 484 290 C 488 200 476 60 470 -60 Z";
const TALUS = "M 470 360 C 500 340 580 344 620 372 C 640 392 620 420 580 426 C 530 432 470 420 452 398 C 446 380 456 368 470 360 Z";
const CALC = "M 600 470 C 640 438 740 440 784 470 C 806 494 800 540 770 560 C 720 582 640 578 600 560 C 576 544 576 492 600 470 Z";
const NAVIC = "M 372 400 C 400 384 440 386 452 404 C 458 424 440 440 410 440 C 384 440 366 422 372 400 Z";
const ACHILLES = "M 744 -60 C 752 80 760 240 764 330 C 768 400 780 440 784 470";
const SOLE_LINE = "M 120 540 C 300 566 560 576 760 560";

const mix = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return "#" + pa.map((v, i) => Math.round(v + (pb[i] - v) * k).toString(16).padStart(2, "0")).join("");
};

/* retinaculum strap across the six tubes (radial band at ~35..55 deg) */
const RET = (() => {
  const a0 = (22 * Math.PI) / 180, a1 = (64 * Math.PI) / 180;
  const r0 = 40, r1 = R0 + 5 * DR + 30;
  const p = (r: number, a: number) => `${(MX + r * Math.cos(a)).toFixed(1)} ${(MY + r * Math.sin(a)).toFixed(1)}`;
  return `M ${p(r0, a0)} L ${p(r1, a0)} A ${r1} ${r1} 0 0 1 ${p(r1, a1)} L ${p(r0, a1)} A ${r0} ${r0} 0 0 0 ${p(r0, a0)} Z`;
})();

export const ALAB: Partial<Record<APart, { ax: number; ay: number; px: number; py: number; text: string }>> = {
  mall: { ax: 520, ay: 300, px: 250, py: 250, text: "Medial malleolus" },
  tunnel: { ax: 640, ay: 400, px: 380, py: 610, text: "Tarsal tunnel" },
  ret: { ax: 655, ay: 405, px: 690, py: 150, text: "Flexor retinaculum" },
  calc: { ax: 700, ay: 540, px: 560, py: 640, text: "Heel (calcaneus)" },
};

export const Ankle: React.FC<{
  t: number;
  w?: number;
  lit?: Partial<Record<APart, number>>;
  focus?: APart[];
  dimFrom?: number;
  show?: Partial<Record<APart, number>>;
  all?: boolean;
  retAlpha?: number;
  solo?: boolean;
}> = ({ t, w = 860, lit = {}, focus = [], dimFrom, show = {}, all, retAlpha = 1, solo }) => {
  const s = w / 860;
  const on = (id: APart) => (lit[id] === undefined ? 0 : ramp(t, (lit[id] as number) - 0.05, (lit[id] as number) + 0.3));
  const dimP = dimFrom === undefined ? 0 : ramp(t, dimFrom, dimFrom + 0.4);
  const op = (id: APart) => (solo ? 1 - 0.62 * dimP * (focus.includes(id) ? 1 - on(id) : 1) : 1 - 0.6 * dimP * (1 - on(id)));
  const glow = (id: APart) => (focus.includes(id) ? on(id) * (0.72 + 0.28 * Math.sin(t * 7)) : 0);
  const drawn = (id: APart) => {
    const v = show[id];
    if (v === undefined) return all ? 1 : 0;
    return ramp(t, v, v + 0.8);
  };
  const mallP = on("mall");
  const tunP = on("tunnel");
  const retP = on("ret");
  return (
    <svg width={860 * s} height={680 * s} viewBox="0 0 860 680" style={{ overflow: "hidden" }}>
      <defs>
        <linearGradient id="skin46" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F8E3CF" />
          <stop offset="1" stopColor="#EECBAE" />
        </linearGradient>
        <linearGradient id="bone46" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FBF3DC" />
          <stop offset="1" stopColor="#E6D6AE" />
        </linearGradient>
        <pattern id="fib46" width={10} height={10} patternUnits="userSpaceOnUse" patternTransform="rotate(-44)">
          <line x1={0} y1={0} x2={0} y2={10} stroke="#FFFFFF" strokeWidth={3} opacity={0.55} />
        </pattern>
        <pattern id="ach46" width={9} height={9} patternUnits="userSpaceOnUse" patternTransform="rotate(4)">
          <line x1={0} y1={0} x2={0} y2={9} stroke="#C9B48A" strokeWidth={2} opacity={0.7} />
        </pattern>
        <clipPath id="clip46">
          <path d={LEG} />
        </clipPath>
        <filter id="sh46" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx={0} dy={6} stdDeviation={6} floodColor="#1F2A14" floodOpacity={0.22} />
        </filter>
      </defs>
      <g filter="url(#sh46)">
        <path d={LEG} fill="url(#skin46)" stroke={C.forest} strokeWidth={6} strokeLinejoin="round" opacity={1 - 0.2 * dimP} />
      </g>
      <g clipPath="url(#clip46)">
        {/* bones */}
        <g opacity={1 - 0.35 * dimP}>
          <path d={CALC} fill={mix("#F3E7C6", "#FFF1A8", on("calc"))} stroke="#9C8A62" strokeWidth={4} />
          <path d={TALUS} fill="url(#bone46)" stroke="#9C8A62" strokeWidth={4} />
          <path d={NAVIC} fill="url(#bone46)" stroke="#9C8A62" strokeWidth={4} />
          <path d="M 120 470 C 200 448 300 420 372 410" fill="none" stroke="#C9B48A" strokeWidth={22} strokeLinecap="round" opacity={0.75} />
          <path d={TIBIA} fill="url(#bone46)" stroke="#9C8A62" strokeWidth={4} />
          <path d={ACHILLES} fill="none" stroke="#E9DCC0" strokeWidth={30} strokeLinecap="round" />
          <path d={ACHILLES} fill="none" stroke="url(#ach46)" strokeWidth={30} strokeLinecap="round" />
          <path d={SOLE_LINE} fill="none" stroke="#D9B79A" strokeWidth={6} strokeLinecap="round" opacity={0.7} />
        </g>
        {/* tarsal tunnel zone */}
        {tunP > 0 && (
          <g opacity={tunP}>
            <path d={`M ${MX + 40} ${MY - 20} A 190 190 0 0 1 ${MX - 10} ${MY + 200} L ${MX - 10} ${MY + 40} A 40 40 0 0 0 ${MX + 40} ${MY - 20} Z`} fill={C.banana} opacity={0.33} />
            <path d={`M ${MX + 40} ${MY - 20} A 190 190 0 0 1 ${MX - 10} ${MY + 200}`} fill="none" stroke={C.forest} strokeWidth={4} strokeDasharray="12 9" />
          </g>
        )}
        {/* the six structures */}
        {ST.map((x, i) => {
          const p = drawn(x.id);
          if (p <= 0.001) return null;
          const lt = on(x.id);
          const gl = glow(x.id);
          const d = tubePath(i);
          const common = { d, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, pathLength: 1, strokeDasharray: `${p} 2` };
          return (
            <g key={x.id} opacity={op(x.id)}>
              {gl > 0 && <path {...common} stroke={x.kind === "nerve" ? "#FFFFFF" : C.banana} strokeWidth={x.w + 26 + 6 * gl} opacity={0.9 * gl} />}
              {gl > 0 && <path {...common} stroke={C.forest} strokeWidth={x.w + 14} opacity={gl} />}
              <path {...common} stroke={C.forest} strokeWidth={x.w + 6} />
              <path {...common} stroke={lt > 0 ? mix(x.color, "#FFF6B0", 0.3 * lt) : x.color} strokeWidth={x.w} />
              {x.kind === "tendon" && <path {...common} stroke="#FFFFFF" strokeWidth={x.w * 0.32} opacity={0.6} transform="translate(-2 -1)" />}
              {x.kind === "nerve" && <path {...common} stroke="#FFF7C8" strokeWidth={3} opacity={0.9} strokeDasharray={`0.012 0.012`} />}
            </g>
          );
        })}
        {/* flexor retinaculum strap over the tunnel */}
        {(() => {
          const p = Math.max(drawn("ret"), 0) * retAlpha;
          if (p <= 0) return null;
          const gl = glow("ret");
          return (
            <g opacity={p * (0.92 - 0.25 * dimP * (1 - retP))}>
              {gl > 0 && <path d={RET} fill="none" stroke={C.banana} strokeWidth={22} opacity={0.85 * gl} />}
              <path d={RET} fill={mix("#B9C7D3", "#FFF0A0", 0.55 * retP)} stroke={C.forest} strokeWidth={4.5} opacity={0.88} />
              <path d={RET} fill="url(#fib46)" />
            </g>
          );
        })()}
        {tunP > 0 && (
          <path d={`M ${MX + 40} ${MY - 20} A 190 190 0 0 1 ${MX - 10} ${MY + 200}`} fill="none" stroke={C.forest} strokeWidth={5} strokeDasharray="14 10" opacity={tunP} />
        )}
        {/* medial malleolus bump highlight */}
        {mallP > 0 && (
          <g opacity={mallP}>
            <circle cx={MX - 4} cy={MY + 4} r={52 + 6 * Math.sin(t * 6)} fill="none" stroke={C.forest} strokeWidth={4} strokeDasharray="10 8" />
            <circle cx={MX - 4} cy={MY + 4} r={44} fill={C.banana} opacity={0.35} />
          </g>
        )}
      </g>
      {/* skin outline on top for crispness */}
      <path d={LEG} fill="none" stroke={C.forest} strokeWidth={6} strokeLinejoin="round" opacity={1 - 0.2 * dimP} />
    </svg>
  );
};

/** Labels drawn OUTSIDE the zoom layer. map = diagram coords -> screen coords */
export const AnkleLabels: React.FC<{
  t: number;
  map: (x: number, y: number) => [number, number];
  labels?: Partial<Record<APart, number>>;
  labelEnd?: Partial<Record<APart, number>>;
  hot?: APart[];
  h?: number;
}> = ({ t, map, labels = {}, labelEnd = {}, hot = [], h = 680 }) => (
  <svg width={860} height={h} viewBox={`0 0 860 ${h}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
    {(Object.keys(labels) as APart[]).map((id) => {
      const st = ST.findIndex((x) => x.id === id);
      const lb =
        st >= 0
          ? (() => {
              const [ax, ay] = tubeMid(st, 52);
              return { ax, ay, px: 430, py: 62, text: ST[st].name };
            })()
          : ALAB[id];
      const lt = labels[id];
      if (!lb || lt === undefined || t < lt - 0.05) return null;
      const le = labelEnd[id];
      const p = ramp(t, lt - 0.05, lt + 0.28) * (le === undefined ? 1 : 1 - ramp(t, le, le + 0.25));
      if (p <= 0) return null;
      const isHot = hot.includes(id);
      const b = st >= 0 ? ST[st] : undefined;
      const ww = lb.text.length * 16.8 + 40 + (b ? 26 : 0);
      const [ax, ay] = map(lb.ax, lb.ay);
      let px = lb.px, py = lb.py;
      px = Math.max(ww / 2 + 14, Math.min(860 - ww / 2 - 14, px));
      py = Math.max(44, Math.min(h - 50, py));
      const lx = ax + (px - ax) * p;
      const ly = ay + (py - ay) * p;
      return (
        <g key={id} opacity={Math.min(1, p * 1.5)}>
          <line x1={ax} y1={ay} x2={lx} y2={ly} stroke={C.forest} strokeWidth={4.5} strokeLinecap="round" />
          <circle cx={ax} cy={ay} r={10} fill={isHot ? C.red : C.banana} stroke={C.forest} strokeWidth={4} />
          <g transform={`translate(${px} ${py}) scale(${0.7 + 0.3 * p})`}>
            <rect x={-ww / 2} y={-27} width={ww} height={54} rx={16} fill={isHot ? C.banana : C.forest} stroke={C.forest} strokeWidth={3} />
            {b && <circle cx={-ww / 2 + 22} cy={0} r={9} fill={b.color} stroke={isHot ? C.forest : C.paper} strokeWidth={3} />}
            <text x={b ? 12 : 0} y={10} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={isHot ? C.forest : C.paper}>{lb.text}</text>
          </g>
        </g>
      );
    })}
  </svg>
);

/**
 * Our own cross-section of the tunnel (Book Plume schematic): bony floor below, flexor retinaculum arching over,
 * six structures in a row, front (near the malleolus) on the LEFT -> back (near the heel) on the RIGHT.
 */
export const Section: React.FC<{ t: number; lit?: Partial<Record<SId, number>>; dimFrom?: number; show?: number; group?: { front?: number; mid?: number; back?: number }; ask?: SId; reveal?: number }> = ({ t, lit = {}, dimFrom, show = 0, group = {}, ask, reveal }) => {
  const on = (id: SId) => (lit[id] === undefined ? 0 : ramp(t, (lit[id] as number) - 0.05, (lit[id] as number) + 0.3));
  const dimP = dimFrom === undefined ? 0 : ramp(t, dimFrom, dimFrom + 0.4);
  const X = [128, 236, 352, 450, 548, 680];
  const Y = [300, 312, 318, 322, 316, 304];
  const R = [46, 42, 30, 30, 30, 48];
  const g = (k?: number) => (k === undefined ? 0 : ramp(t, k, k + 0.3));
  return (
    <svg width={860} height={560} viewBox="0 0 860 560">
      <defs>
        <pattern id="fibS46" width={12} height={12} patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
          <line x1={0} y1={0} x2={0} y2={12} stroke="#FFFFFF" strokeWidth={3} opacity={0.5} />
        </pattern>
        <linearGradient id="boneS46" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FBF3DC" />
          <stop offset="1" stopColor="#E2D0A4" />
        </linearGradient>
      </defs>
      {/* bony floor */}
      <path d="M 30 520 L 30 300 C 30 250 70 236 96 260 C 120 290 110 380 200 392 C 320 408 520 404 640 392 C 720 384 760 360 800 380 C 830 396 830 460 830 520 Z" fill="url(#boneS46)" stroke="#9C8A62" strokeWidth={5} />
      <text x={70} y={470} fontFamily={FONT} fontWeight={800} fontSize={26} fill="#8C7A52">malleolus</text>
      <text x={380} y={470} fontFamily={FONT} fontWeight={800} fontSize={26} fill="#8C7A52">talus</text>
      <text x={640} y={470} fontFamily={FONT} fontWeight={800} fontSize={26} fill="#8C7A52">calcaneus</text>
      {/* retinaculum roof */}
      <path d="M 60 262 C 140 150 300 196 400 200 C 520 204 700 150 812 372" fill="none" stroke={C.forest} strokeWidth={30} strokeLinecap="round" />
      <path d="M 60 262 C 140 150 300 196 400 200 C 520 204 700 150 812 372" fill="none" stroke="#B9C7D3" strokeWidth={22} strokeLinecap="round" />
      <path d="M 60 262 C 140 150 300 196 400 200 C 520 204 700 150 812 372" fill="none" stroke="url(#fibS46)" strokeWidth={22} strokeLinecap="round" />
      <text x={430} y={160} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={C.forest}>flexor retinaculum (roof)</text>
      {/* neurovascular bundle sheath */}
      <ellipse cx={450} cy={320} rx={150} ry={56} fill="#F4E9D4" stroke="#B9A57E" strokeWidth={4} strokeDasharray="10 8" opacity={ramp(t, show, show + 0.5)} />
      {/* group highlights */}
      {[
        { k: g(group.front), x0: 70, x1: 290 },
        { k: g(group.mid), x0: 300, x1: 600 },
        { k: g(group.back), x0: 618, x1: 744 },
      ].map((b, i) =>
        b.k > 0 ? (
          <g key={i} opacity={b.k}>
            <rect x={b.x0} y={236} width={b.x1 - b.x0} height={150} rx={40} fill={C.banana} opacity={0.4} />
            <rect x={b.x0} y={236} width={b.x1 - b.x0} height={150} rx={40} fill="none" stroke={C.forest} strokeWidth={4} strokeDasharray="12 9" />
          </g>
        ) : null
      )}
      {ST.map((x, i) => {
        const p = ramp(t, show + 0.1 * i, show + 0.1 * i + 0.35);
        if (p <= 0) return null;
        const lt = on(x.id);
        const isAsk = ask === x.id && (reveal === undefined || t < reveal);
        const o = 1 - 0.6 * dimP * (1 - lt);
        const r = R[i] * (0.6 + 0.4 * p) * (1 + 0.1 * lt * Math.sin(t * 8));
        return (
          <g key={x.id} opacity={p * o}>
            {lt > 0 && <circle cx={X[i]} cy={Y[i]} r={r + 14} fill={C.banana} opacity={0.8 * lt} />}
            <circle cx={X[i]} cy={Y[i]} r={r} fill={isAsk ? C.forest : x.color} stroke={C.forest} strokeWidth={5} />
            {x.kind === "tendon" && !isAsk && <circle cx={X[i] - r * 0.3} cy={Y[i] - r * 0.3} r={r * 0.28} fill="#FFFFFF" opacity={0.45} />}
            <text x={X[i]} y={Y[i] + 13} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={i === 0 || i === 5 ? 40 : 34} fill={isAsk ? C.banana : C.forest}>{isAsk ? "?" : x.letter}</text>
          </g>
        );
      })}
      {/* front -> back arrow */}
      <g opacity={ramp(t, show + 0.5, show + 0.9)}>
        <line x1={150} y1={58} x2={690} y2={58} stroke={C.forest} strokeWidth={6} strokeLinecap="round" />
        <path d="M 690 40 L 722 58 L 690 76 Z" fill={C.forest} />
        <rect x={60} y={36} width={120} height={44} rx={14} fill={C.forest} />
        <text x={120} y={67} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={C.paper}>FRONT</text>
        <rect x={730} y={36} width={110} height={44} rx={14} fill={C.forest} />
        <text x={785} y={67} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={C.paper}>BACK</text>
      </g>
    </svg>
  );
};
