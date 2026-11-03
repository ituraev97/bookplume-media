import React from "react";
import { C, FONT, ramp } from "./kit";

/* ======================================================================
   Book Plume own illustrations for "Bones of the Foot and Ankle".
   FootTop   = skeleton of the RIGHT foot from above (toes up, heel down,
               big toe on the left = medial).      viewBox 800 x 1000
   AnkleSide = lateral view of the right ankle, foot can dorsi/plantarflex,
               3 lateral ligaments.                 viewBox 1000 x 700
   AnkleBack = coronal view from behind: mortise, deltoid, subtalar tilt.
                                                    viewBox 800 x 820
   ArchSide  = medial longitudinal arch as a spring. viewBox 1000 x 560
   TransArch = transverse arch cross-section.        viewBox 800 x 420
   ====================================================================== */

export type Lit = Record<string, number | { a: number; b: number }>;
export const litP = (t: number, v?: number | { a: number; b: number }) => {
  if (v === undefined) return 0;
  if (typeof v === "number") return ramp(t, v - 0.05, v + 0.3);
  return ramp(t, v.a - 0.05, v.a + 0.3) * (1 - ramp(t, v.b - 0.1, v.b + 0.3));
};

export const GC = { tarsal: C.banana, meta: "#A9C77A", phal: "#EE9F92", hind: "#F0A868", mid: C.banana, fore: "#9CC3D9" };
export const LIGC = { delt: "#7FB3D5", atfl: C.red, cfl: "#E9A23B", ptfl: "#8E6FB5" };

const Defs: React.FC<{ id: string }> = ({ id }) => (
  <defs>
    <radialGradient id={`${id}Bone`} cx="38%" cy="32%" r="80%">
      <stop offset="0%" stopColor="#FFFDF5" />
      <stop offset="55%" stopColor="#F1E8CF" />
      <stop offset="100%" stopColor="#CDBD92" />
    </radialGradient>
    <linearGradient id={`${id}Shaft`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#D3C59C" />
      <stop offset="42%" stopColor="#FCF8EA" />
      <stop offset="100%" stopColor="#C8B88B" />
    </linearGradient>
    <radialGradient id={`${id}Skin`} cx="50%" cy="45%" r="70%">
      <stop offset="0%" stopColor="#F3E3D3" stopOpacity={0.9} />
      <stop offset="100%" stopColor="#E9D2BE" stopOpacity={0.55} />
    </radialGradient>
    <filter id={`${id}Glow`} x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="7" result="b" />
      <feMerge>
        <feMergeNode in="b" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <pattern id={`${id}Fib`} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
      <line x1="0" y1="0" x2="0" y2="10" stroke="rgba(255,255,255,0.55)" strokeWidth="3" />
    </pattern>
  </defs>
);

/* ---------- foot from above ---------- */
type LB = { id: string; b: [number, number]; h: [number, number]; wb: number; ws: number; wh: number; g: "meta" | "phal" };
const longPath = (L: number, wb: number, ws: number, wh: number) =>
  `M0 ${-wb / 2} Q${L * 0.22} ${-ws / 2} ${L * 0.5} ${-ws / 2} Q${L * 0.8} ${-ws / 2} ${L - wh * 0.5} ${-wh / 2} A${wh / 2} ${wh / 2} 0 0 1 ${L - wh * 0.5} ${wh / 2} Q${L * 0.8} ${ws / 2} ${L * 0.5} ${ws / 2} Q${L * 0.22} ${ws / 2} 0 ${wb / 2} Q${-wb * 0.18} 0 0 ${-wb / 2} Z`;

const META: LB[] = [
  { id: "mt1", b: [266, 436], h: [250, 252], wb: 74, ws: 46, wh: 64, g: "meta" },
  { id: "mt2", b: [335, 466], h: [326, 212], wb: 50, ws: 28, wh: 42, g: "meta" },
  { id: "mt3", b: [398, 456], h: [398, 222], wb: 48, ws: 27, wh: 40, g: "meta" },
  { id: "mt4", b: [460, 503], h: [462, 246], wb: 46, ws: 26, wh: 37, g: "meta" },
  { id: "mt5", b: [516, 500], h: [526, 280], wb: 50, ws: 25, wh: 35, g: "meta" },
];
const TOES: { r: number; L: number[]; w: number[] }[] = [
  { r: 0, L: [104, 80], w: [58, 54] },
  { r: 1, L: [88, 48, 38], w: [36, 31, 30] },
  { r: 2, L: [80, 43, 36], w: [34, 29, 28] },
  { r: 3, L: [72, 38, 33], w: [32, 28, 27] },
  { r: 4, L: [62, 33, 30], w: [30, 26, 26] },
];
const PH: LB[] = (() => {
  const out: LB[] = [];
  TOES.forEach(({ r, L, w }) => {
    const m = META[r];
    const dx = m.h[0] - m.b[0], dy = m.h[1] - m.b[1];
    const n = Math.hypot(dx, dy);
    const ux = dx / n + (r - 2) * 0.03, uy = dy / n;
    const nn = Math.hypot(ux, uy);
    let x = m.h[0] + (ux / nn) * 10, y = m.h[1] + (uy / nn) * 10;
    const kinds = r === 0 ? ["p", "d"] : ["p", "m", "d"];
    L.forEach((len, i) => {
      const ex = x + (ux / nn) * len, ey = y + (uy / nn) * len;
      out.push({ id: `ph${r + 1}${kinds[i]}`, b: [x, y], h: [ex, ey], wb: w[i] * 1.05, ws: w[i] * 0.72, wh: w[i] * (kinds[i] === "d" ? 0.8 : 0.9), g: "phal" });
      x = ex + (ux / nn) * 8;
      y = ey + (uy / nn) * 8;
    });
  });
  return out;
})();

export const TARSAL_PATHS: Record<string, string> = {
  calc: "M362 790 C 332 822, 326 900, 346 950 C 366 992, 470 996, 502 962 C 528 928, 544 862, 548 800 C 550 760, 542 724, 524 704 L 472 708 C 456 742, 420 772, 362 790 Z",
  talus: "M336 806 C 330 770, 332 732, 340 706 C 330 690, 298 680, 284 660 C 270 638, 286 614, 320 612 C 352 610, 386 622, 402 642 C 422 662, 456 682, 470 702 C 478 742, 476 782, 468 810 C 430 826, 372 826, 336 806 Z",
  nav: "M262 600 C 252 576, 270 552, 300 549 L 422 556 C 434 568, 432 592, 418 606 C 384 618, 334 620, 292 614 C 276 611, 266 607, 262 600 Z",
  cub: "M432 508 L 540 497 C 560 560, 566 630, 554 690 L 480 700 C 462 672, 442 642, 434 612 C 429 572, 429 534, 432 508 Z",
  cun1: "M228 543 L 300 548 L 304 444 L 236 434 C 222 468, 220 508, 228 543 Z",
  cun2: "M306 548 L 360 551 L 362 472 L 308 468 Z",
  cun3: "M366 551 L 424 555 L 428 460 L 368 456 Z",
};
const TCENTER: Record<string, [number, number]> = {
  calc: [440, 890], talus: [400, 740], nav: [345, 582], cub: [495, 600], cun1: [264, 490], cun2: [334, 510], cun3: [396, 505],
};
export const TARSALS = ["talus", "calc", "nav", "cun1", "cun2", "cun3", "cub"];
export const FT: Record<string, [number, number]> = (() => {
  const o: Record<string, [number, number]> = { ...TCENTER };
  [...META, ...PH].forEach((b) => (o[b.id] = [(b.b[0] + b.h[0]) / 2, (b.b[1] + b.h[1]) / 2]));
  o.mt5tub = [552, 492];
  o.mt1base = [266, 420]; o.mt1head = [250, 262];
  return o;
})();
export const REGION: Record<string, "hind" | "mid" | "fore"> = { calc: "hind", talus: "hind", nav: "mid", cub: "mid", cun1: "mid", cun2: "mid", cun3: "mid" };
const groupOf = (id: string) => (TARSALS.includes(id) ? "tarsal" : id.startsWith("mt") ? "meta" : "phal");

export const FootTop: React.FC<{
  t: number; w: number; lit?: Lit; col?: Record<string, string>; dim?: number;
  groups?: { tarsal?: number; meta?: number; phal?: number }; // colour whole groups 0..1
  regions?: number; // colour hind / mid / forefoot 0..1
  skin?: number; letters?: number; nums?: number; joints?: { tmt?: number; mtp?: number; imt?: number; row?: number; ip?: number };
}> = ({ t, w, lit = {}, col = {}, dim = 1, groups = {}, regions = 0, skin = 0.6, letters = 0, nums = 0, joints = {} }) => {
  const anyLit = Object.keys(lit).some((k) => litP(t, lit[k]) > 0.01);
  const boneFill = (id: string) => {
    const g = groupOf(id);
    const gp = (groups as any)[g] || 0;
    const reg = id.startsWith("mt") || id.startsWith("ph") ? "fore" : REGION[id];
    return { gp, g, reg };
  };
  const drawBone = (id: string, d: string, transform?: string) => {
    const p = litP(t, lit[id]);
    const { gp, g, reg } = boneFill(id);
    const base = anyLit ? 1 - (1 - dim) * (1 - p) : 1;
    const c = col[id] || C.red;
    return (
      <g key={id} transform={transform} opacity={base}>
        <path d={d} fill="url(#ftBone)" stroke={C.forest} strokeWidth={3.2} strokeLinejoin="round" />
        {gp > 0 && <path d={d} fill={(GC as any)[g]} opacity={0.85 * gp} />}
        {regions > 0 && <path d={d} fill={(GC as any)[reg]} opacity={0.85 * regions} />}
        {p > 0 && <path d={d} fill={c} opacity={0.9 * p} stroke={C.forest} strokeWidth={3.2} filter="url(#ftGlow)" />}
        <path d={d} fill="none" stroke={C.forest} strokeWidth={3.2} strokeLinejoin="round" />
      </g>
    );
  };
  const longBone = (b: LB) => {
    const L = Math.hypot(b.h[0] - b.b[0], b.h[1] - b.b[1]);
    const ang = (Math.atan2(b.h[1] - b.b[1], b.h[0] - b.b[0]) * 180) / Math.PI;
    const d = longPath(L, b.wb, b.ws, b.wh);
    return (
      <g key={b.id}>
        {drawBone(b.id, d, `translate(${b.b[0]} ${b.b[1]}) rotate(${ang})`)}
        {/* shaft shading line */}
        <g transform={`translate(${b.b[0]} ${b.b[1]}) rotate(${ang})`} opacity={0.35}>
          <path d={`M${L * 0.18} ${-b.ws * 0.18} Q${L * 0.5} ${-b.ws * 0.3} ${L * 0.82} ${-b.ws * 0.16}`} fill="none" stroke={C.forest} strokeWidth={1.6} />
        </g>
      </g>
    );
  };
  return (
    <svg width={w} height={w * 1.25} viewBox="0 0 800 1000" style={{ overflow: "visible" }}>
      <Defs id="ft" />
      {skin > 0 && (
        <path opacity={skin} fill="url(#ftSkin)" stroke="#D9BBA2" strokeWidth={4}
          d="M300 985 C 250 960, 214 870, 204 760 C 194 650, 188 520, 190 430 C 192 330, 186 240, 194 150 C 200 70, 232 32, 262 40 C 290 48, 300 90, 304 120 C 306 60, 318 0, 336 4 C 360 8, 362 60, 364 110 C 372 50, 392 26, 410 34 C 428 44, 428 90, 428 130 C 440 82, 462 70, 478 82 C 494 96, 490 140, 488 170 C 500 128, 522 120, 536 134 C 552 150, 548 210, 552 260 C 568 340, 584 420, 590 520 C 598 640, 586 760, 568 860 C 552 950, 500 996, 430 1000 C 380 1002, 330 998, 300 985 Z" />
      )}
      {Object.entries(TARSAL_PATHS).map(([id, d]) => drawBone(id, d))}
      {/* tarsal detail: trochlea of talus + calcaneal tuberosity hatching */}
      <path d="M352 712 Q 400 700 456 712 M350 790 Q 400 804 456 792" fill="none" stroke={C.forest} strokeWidth={1.8} opacity={0.35} />
      <path d="M372 950 Q 440 975 492 946" fill="none" stroke={C.forest} strokeWidth={1.8} opacity={0.35} />
      {META.map(longBone)}
      {/* 5th metatarsal tuberosity */}
      {drawBone("mt5tub", "M528 470 C 552 462, 572 478, 568 500 C 564 520, 540 526, 524 516 Z")}
      {PH.map(longBone)}
      {letters > 0 &&
        ([["T", "talus"], ["C", "calc"], ["N", "nav"], ["M", "cun1"], ["I", "cun2"], ["L", "cun3"], ["C", "cub"]] as [string, string][]).map(([L, id], i) => (
          <text key={i} x={TCENTER[id][0]} y={TCENTER[id][1] + 14} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={id.startsWith("cun") ? 34 : 46} fill={C.forest} opacity={ramp(letters, i / 7, i / 7 + 0.15)}>{L}</text>
        ))}
      {(() => {
        const J = (p: number | undefined, d: string, c = C.red) => {
          const k = p === undefined ? 0 : ramp(t, p, p + 0.6);
          return k > 0 ? <path d={d} fill="none" stroke={c} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="900" strokeDashoffset={900 * (1 - k)} /> : null;
        };
        return (
          <g>
            {J(joints.tmt, "M226 438 L 304 446 L 306 468 L 364 471 L 366 456 L 428 460 L 432 507 L 540 497")}
            {J(joints.mtp, "M216 216 C 260 204, 300 190, 330 184 C 360 186, 390 194, 420 200 C 440 208, 460 220, 480 226 C 500 236, 520 250, 548 262")}
            {J(joints.row, "M222 545 L 302 550 L 362 553 L 426 557 L 436 610 M432 508 L 540 497", "#3E7FA6")}
            {joints.imt !== undefined && [[302, 412], [368, 430], [430, 470], [490, 476]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={13 * ramp(t, joints.imt! + i * 0.15, joints.imt! + i * 0.15 + 0.3)} fill={C.red} stroke={C.paper} strokeWidth={4} />
            ))}
          </g>
        );
      })()}
      {nums > 0 &&
        META.map((m, i) => (
          <g key={m.id} opacity={ramp(nums, i / 5, i / 5 + 0.2)}>
            <circle cx={(m.b[0] + m.h[0]) / 2} cy={(m.b[1] + m.h[1]) / 2} r={21} fill={C.forest} />
            <text x={(m.b[0] + m.h[0]) / 2} y={(m.b[1] + m.h[1]) / 2 + 9} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={C.paper}>{i + 1}</text>
          </g>
        ))}
    </svg>
  );
};

/* ---------- ankle, lateral view (right foot, toes to the right) ---------- */
const rot = (p: [number, number], o: [number, number], deg: number): [number, number] => {
  const r = (deg * Math.PI) / 180, dx = p[0] - o[0], dy = p[1] - o[1];
  return [o[0] + dx * Math.cos(r) - dy * Math.sin(r), o[1] + dx * Math.sin(r) + dy * Math.cos(r)];
};
const PIV: [number, number] = [455, 352];
export const AS: Record<string, [number, number]> = {
  tibia: [450, 140], fibula: [385, 240], latmal: [398, 372], talus: [470, 372], calc: [330, 490], nav: [628, 412], cub: [600, 486], mt: [780, 500], toes: [930, 532],
  atfl: [488, 392], cfl: [392, 452], ptfl: [356, 390], tub: [246, 500], achilles: [262, 300],
};
const LIG_A: Record<string, [[number, number], [number, number]]> = {
  // [fixed end on the lateral malleolus, end on the foot (foot coords)]
  atfl: [[428, 384], [548, 402]],
  cfl: [[404, 408], [380, 500]],
  ptfl: [[378, 384], [334, 398]],
};
export const AnkleSide: React.FC<{ t: number; w: number; ang?: number; lit?: Lit; dim?: number; ligs?: number; skin?: number }> = ({ t, w, ang = 0, lit = {}, dim = 1, ligs = 1, skin = 0.5 }) => {
  const anyLit = Object.keys(lit).some((k) => litP(t, lit[k]) > 0.01);
  const op = (id: string) => (anyLit ? 1 - (1 - dim) * (1 - litP(t, lit[id])) : 1);
  const B = (id: string, d: string, c: string = C.red) => {
    const p = litP(t, lit[id]);
    return (
      <g key={id} opacity={op(id)}>
        <path d={d} fill="url(#asBone)" stroke={C.forest} strokeWidth={3.5} strokeLinejoin="round" />
        {p > 0 && <path d={d} fill={c} opacity={0.88 * p} filter="url(#asGlow)" />}
        <path d={d} fill="none" stroke={C.forest} strokeWidth={3.5} strokeLinejoin="round" />
      </g>
    );
  };
  const lig = (k: "atfl" | "cfl" | "ptfl") => {
    const [a, b0] = LIG_A[k];
    const b = rot(b0, PIV, ang);
    const p = litP(t, lit[k]);
    const c = (LIGC as any)[k];
    const wd = k === "cfl" ? 22 : 26;
    return (
      <g key={k} opacity={ligs * (anyLit ? 1 - (1 - dim) * (1 - p) : 1)}>
        <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={C.forest} strokeWidth={wd + 7} strokeLinecap="round" />
        <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={p > 0 ? c : "#ECE7D3"} strokeWidth={wd} strokeLinecap="round" />
        <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="rgba(255,255,255,0.65)" strokeWidth={3} strokeDasharray="7 7" />
      </g>
    );
  };
  return (
    <svg width={w} height={w * 0.7} viewBox="0 0 1000 700" style={{ overflow: "visible" }}>
      <Defs id="as" />
      {skin > 0 && <path opacity={skin} fill="url(#asSkin)" stroke="#D9BBA2" strokeWidth={4} d="M300 -20 L 560 -20 C 556 100, 552 220, 560 300 L 330 330 C 310 220, 300 100, 300 -20 Z" />}
      {/* FOOT (rotates around the ankle pivot) */}
      <g transform={`rotate(${ang} ${PIV[0]} ${PIV[1]})`}>
        {skin > 0 && <path opacity={skin} fill="url(#asSkin)" stroke="#D9BBA2" strokeWidth={4} d="M330 300 C 250 330, 205 420, 214 500 C 222 560, 270 575, 340 572 L 760 566 C 850 566, 940 560, 975 545 C 1000 530, 994 500, 966 488 C 900 462, 790 430, 700 404 C 640 386, 590 340, 560 290 Z" />}
        {B("calc", "M262 446 C 226 452, 214 500, 226 532 C 236 560, 280 566, 340 556 L 520 532 C 560 520, 574 496, 566 470 C 556 446, 520 436, 488 440 C 450 430, 410 424, 380 430 C 340 434, 300 440, 262 446 Z", GC.hind)}
        <path d="M262 470 C 300 466, 360 470, 400 480" fill="none" stroke={C.forest} strokeWidth={2} opacity={0.3} />
        {B("talus", "M372 380 C 372 330, 412 304, 462 306 C 512 308, 542 338, 548 368 C 572 372, 600 382, 610 400 C 614 424, 596 440, 572 440 C 540 442, 500 446, 462 440 C 420 434, 384 420, 372 400 Z", GC.hind)}
        <path d="M392 352 Q 460 318 528 352" fill="none" stroke={C.forest} strokeWidth={2} opacity={0.35} />
        {B("nav", "M612 390 C 634 380, 660 386, 668 408 C 672 430, 660 448, 638 450 C 620 448, 610 432, 608 414 Z", GC.mid)}
        {B("cun", "M670 396 C 700 390, 726 398, 738 412 L 734 470 C 712 478, 684 476, 664 466 C 660 444, 662 418, 670 396 Z", GC.mid)}
        {B("cub", "M566 470 C 590 458, 630 458, 660 468 C 672 488, 668 514, 650 528 L 572 532 C 562 512, 560 488, 566 470 Z", GC.mid)}
        {B("mt", "M654 518 C 670 494, 720 474, 748 470 L 900 500 C 926 504, 938 518, 930 534 C 922 548, 900 548, 882 542 L 744 526 C 712 532, 676 536, 658 534 Z", GC.meta)}
        <path d="M750 486 L 896 512 M744 504 L 888 528" stroke={C.forest} strokeWidth={2} opacity={0.35} />
        {B("toes", "M934 516 C 954 510, 980 512, 996 520 C 1008 530, 1006 544, 990 548 C 968 552, 946 548, 934 540 Z", GC.phal)}
        {/* Achilles tendon to the calcaneal tuberosity */}
        <path d="M244 470 C 246 330, 270 160, 300 -20" fill="none" stroke="#D9B48A" strokeWidth={30} strokeLinecap="round" opacity={0.85} />
        <path d="M244 470 C 246 330, 270 160, 300 -20" fill="none" stroke={C.forest} strokeWidth={2} opacity={0.35} strokeDasharray="10 10" />
      </g>
      {/* LEG (fixed): tibia in front, fibula behind it, lateral malleolus lowest */}
      {B("tibia", "M400 -20 L 540 -20 C 540 90, 546 200, 556 260 C 566 300, 560 330, 540 340 C 500 330, 450 326, 410 334 C 400 300, 404 240, 406 200 C 410 120, 404 40, 400 -20 Z")}
      {B("fibula", "M350 -20 L 396 -20 C 396 90, 400 200, 410 280 C 430 300, 446 330, 440 372 C 434 404, 414 420, 396 416 C 372 410, 356 384, 358 350 C 360 320, 366 296, 368 270 C 366 180, 356 80, 350 -20 Z", "#E9A23B")}
      {litP(t, lit.latmal) > 0 && <circle cx={400} cy={372} r={52 + 5 * Math.sin(t * 6)} fill="none" stroke={C.red} strokeWidth={7} opacity={litP(t, lit.latmal)} />}
      {ligs > 0 && (["ptfl", "cfl", "atfl"] as const).map(lig)}
    </svg>
  );
};

/* ---------- ankle from behind (coronal): mortise, deltoid, lateral ligament, subtalar tilt ---------- */
export const AB: Record<string, [number, number]> = {
  tibia: [300, 150], fibula: [520, 190], medmal: [228, 440], latmal: [548, 520], talus: [390, 440], calc: [390, 640],
  delt: [222, 520], cfl: [560, 600], mortise: [390, 360], subtalar: [390, 540],
};
export const AnkleBack: React.FC<{ t: number; w: number; lit?: Lit; dim?: number; tilt?: number; mortise?: number; ligs?: number }> = ({ t, w, lit = {}, dim = 1, tilt = 0, mortise = 0, ligs = 1 }) => {
  const anyLit = Object.keys(lit).some((k) => litP(t, lit[k]) > 0.01);
  const op = (id: string) => (anyLit ? 1 - (1 - dim) * (1 - litP(t, lit[id])) : 1);
  const B: React.FC<{ id: string; d: string; c?: string; hatch?: boolean }> = ({ id, d, c = C.red }) => {
    const p = litP(t, lit[id]);
    return (
      <g opacity={op(id)}>
        <path d={d} fill="url(#abBone)" stroke={C.forest} strokeWidth={3.5} strokeLinejoin="round" />
        {p > 0 && <path d={d} fill={c} opacity={0.88 * p} filter="url(#abGlow)" />}
        <path d={d} fill="none" stroke={C.forest} strokeWidth={3.5} strokeLinejoin="round" />
      </g>
    );
  };
  const pivot: [number, number] = [390, 530];
  return (
    <svg width={w} height={w * 1.025} viewBox="0 0 800 820" style={{ overflow: "visible" }}>
      <Defs id="ab" />
      {/* calcaneus tilts under the talus at the subtalar joint */}
      <g transform={`rotate(${tilt} ${pivot[0]} ${pivot[1]})`}>
        <B id="calc" c={GC.hind} d="M270 560 C 262 540, 300 528, 340 534 L 450 534 C 490 530, 520 544, 522 566 C 528 640, 520 720, 480 770 C 440 800, 340 800, 300 768 C 262 730, 258 640, 270 560 Z" />
        <path d="M300 700 Q 390 730 488 700" fill="none" stroke={C.forest} strokeWidth={2} opacity={0.3} />
        {/* sustentaculum-free simple sole pad */}
      </g>
      <B id="talus" c={GC.hind} d="M276 380 C 280 350, 330 336, 390 336 C 450 336, 500 350, 506 380 L 512 470 C 510 500, 480 522, 450 526 L 330 526 C 300 522, 272 500, 270 470 Z" />
      <path d="M300 400 Q 390 380 482 400" fill="none" stroke={C.forest} strokeWidth={2} opacity={0.3} />
      <B id="tibia" d="M180 -20 L 440 -20 C 442 80, 450 200, 470 270 C 480 300, 484 320, 470 336 C 430 330, 360 326, 270 334 L 256 340 C 248 380, 240 430, 228 462 C 214 476, 196 470, 192 450 C 188 380, 184 300, 186 220 C 188 140, 184 60, 180 -20 Z" />
      <B id="fibula" c="#E9A23B" d="M480 -20 L 540 -20 C 540 120, 550 260, 562 360 C 572 440, 580 520, 558 562 C 540 580, 520 570, 516 548 C 514 500, 512 440, 506 380 C 500 300, 490 200, 484 120 C 482 60, 480 20, 480 -20 Z" />
      {/* mortise outline */}
      {mortise > 0 && (
        <path d="M232 456 L 258 340 Q 380 318 476 340 L 518 552" fill="none" stroke={C.red} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1400" strokeDashoffset={1400 * (1 - mortise)} opacity={0.95} />
      )}
      {/* ligaments */}
      {ligs > 0 && (
        <g opacity={ligs}>
          {/* deltoid: fan from the medial malleolus down to the talus and the calcaneus */}
          {(() => {
            const p = litP(t, lit.delt);
            const o = anyLit ? 1 - (1 - dim) * (1 - p) : 1;
            const fill = p > 0 ? LIGC.delt : "#ECE7D3";
            return (
              <g opacity={o}>
                <path d="M196 430 C 196 470, 210 540, 250 600 L 300 604 C 290 560, 280 520, 282 470 C 270 456, 250 446, 232 440 Z" fill={fill} stroke={C.forest} strokeWidth={4} strokeLinejoin="round" />
                <path d="M206 452 L 258 596 M218 450 L 274 598 M232 448 L 288 600 M246 452 L 280 470" stroke="rgba(255,255,255,0.75)" strokeWidth={3} />
              </g>
            );
          })()}
          {(() => {
            const p = litP(t, lit.cfl);
            const o = anyLit ? 1 - (1 - dim) * (1 - p) : 1;
            const b = rot([536, 640], pivot, tilt);
            return (
              <g opacity={o}>
                <line x1={556} y1={548} x2={b[0]} y2={b[1]} stroke={C.forest} strokeWidth={28} strokeLinecap="round" />
                <line x1={556} y1={548} x2={b[0]} y2={b[1]} stroke={p > 0 ? LIGC.cfl : "#E8E4D2"} strokeWidth={21} strokeLinecap="round" />
                <line x1={556} y1={548} x2={b[0]} y2={b[1]} stroke="rgba(255,255,255,0.6)" strokeWidth={3} strokeDasharray="6 7" />
              </g>
            );
          })()}
        </g>
      )}
      {litP(t, lit.subtalar) > 0 && (
        <path d="M300 532 L 480 532" stroke={C.red} strokeWidth={10} strokeLinecap="round" opacity={litP(t, lit.subtalar)} />
      )}
    </svg>
  );
};

/* ---------- medial longitudinal arch as a spring ---------- */
export const ArchSide: React.FC<{ t: number; w: number; squash?: number; arch?: number; fascia?: number; weight?: number; lit?: Lit }> = ({ t, w, squash = 0, arch = 1, fascia = 0, weight = 0, lit = {} }) => {
  const k = 1 - 0.22 * squash;
  const Y = (y: number) => 470 - (470 - y) * k;
  const bones: [string, string, string][] = [
    ["calc", `M80 ${Y(470)} C 60 ${Y(420)}, 90 ${Y(360)}, 160 ${Y(352)} L 300 ${Y(330)} C 330 ${Y(360)}, 310 ${Y(420)}, 260 ${Y(440)} L 140 ${Y(480)} C 110 ${Y(486)}, 88 ${Y(484)}, 80 ${Y(470)} Z`, GC.hind],
    ["talus", `M210 ${Y(330)} C 220 ${Y(270)}, 300 ${Y(250)}, 360 ${Y(268)} C 400 ${Y(280)}, 410 ${Y(300)}, 420 ${Y(306)} L 400 ${Y(340)} C 350 ${Y(346)}, 260 ${Y(350)}, 210 ${Y(330)} Z`, GC.hind],
    ["nav", `M424 ${Y(296)} C 452 ${Y(286)}, 482 ${Y(292)}, 490 ${Y(312)} L 480 ${Y(350)} C 456 ${Y(356)}, 430 ${Y(348)}, 418 ${Y(334)} Z`, GC.mid],
    ["cun", `M496 ${Y(306)} L 572 ${Y(314)} L 566 ${Y(372)} L 486 ${Y(358)} Z`, GC.mid],
    ["mt1", `M578 ${Y(318)} C 640 ${Y(330)}, 760 ${Y(380)}, 840 ${Y(420)} C 866 ${Y(432)}, 872 ${Y(462)}, 846 ${Y(468)} C 760 ${Y(452)}, 640 ${Y(400)}, 572 ${Y(378)} Z`, GC.meta],
    ["ph", `M856 ${Y(424)} C 890 ${Y(430)}, 940 ${Y(444)}, 958 ${Y(456)} C 968 ${Y(470)}, 950 ${Y(482)}, 930 ${Y(478)} L 852 ${Y(470)} Z`, GC.phal],
  ];
  return (
    <svg width={w} height={w * 0.56} viewBox="0 0 1000 560" style={{ overflow: "visible" }}>
      <Defs id="ar" />
      <line x1={20} y1={492} x2={990} y2={492} stroke={C.forest} strokeWidth={4} opacity={0.5} />
      {bones.map(([id, d, c]) => {
        const p = litP(t, lit[id]);
        return (
          <g key={id}>
            <path d={d} fill="url(#arBone)" stroke={C.forest} strokeWidth={3.5} strokeLinejoin="round" />
            {p > 0 && <path d={d} fill={c} opacity={0.85 * p} />}
            <path d={d} fill="none" stroke={C.forest} strokeWidth={3.5} strokeLinejoin="round" />
          </g>
        );
      })}
      {/* the arch line */}
      <path d={`M110 ${Y(486)} Q 470 ${Y(170)} 900 ${Y(476)}`} fill="none" stroke={C.red} strokeWidth={9} strokeDasharray="1200" strokeDashoffset={1200 * (1 - arch)} strokeLinecap="round" />
      {/* plantar aponeurosis = the bowstring */}
      {fascia > 0 && (
        <g opacity={fascia}>
          <path d={`M110 ${Y(484)} Q 500 ${Y(500)} 900 ${Y(480)}`} fill="none" stroke={C.forest} strokeWidth={20} strokeLinecap="round" />
          <path d={`M110 ${Y(484)} Q 500 ${Y(500)} 900 ${Y(480)}`} fill="none" stroke="#7FB3D5" strokeWidth={13} strokeLinecap="round" />
        </g>
      )}
      {weight > 0 && (
        <g opacity={weight} transform={`translate(0 ${squash * 30})`}>
          <path d="M330 40 L 330 170 L 300 170 L 350 230 L 400 170 L 370 170 L 370 40 Z" fill={C.forest} />
          <text x={420} y={120} fontFamily={FONT} fontWeight={800} fontSize={40} fill={C.forest}>body weight</text>
        </g>
      )}
    </svg>
  );
};

/* ---------- transverse arch: cross-section through the cuneiforms + cuboid ---------- */
export const TransArch: React.FC<{ t: number; w: number; p?: number }> = ({ t, w, p = 1 }) => {
  const pieces: [string, string, string][] = [
    ["medial\ncuneiform", "M70 330 L 190 330 L 230 150 L 140 140 Z", GC.mid],
    ["", "M200 330 L 300 300 L 320 120 L 238 150 Z", GC.mid],
    ["", "M310 300 L 420 290 L 430 110 L 328 118 Z", GC.mid],
    ["cuboid", "M430 290 L 640 320 L 640 160 L 440 112 Z", "#F0A868"],
  ];
  return (
    <svg width={w} height={w * 0.525} viewBox="0 0 800 420" style={{ overflow: "visible" }}>
      <Defs id="ta" />
      <line x1={20} y1={360} x2={780} y2={360} stroke={C.forest} strokeWidth={4} opacity={0.5} />
      {pieces.map(([, d, c], i) => (
        <g key={i} opacity={ramp(p, i * 0.15, i * 0.15 + 0.3)}>
          <path d={d} fill="url(#taBone)" stroke={C.forest} strokeWidth={3.5} strokeLinejoin="round" />
          <path d={d} fill={c} opacity={0.75} />
          <path d={d} fill="none" stroke={C.forest} strokeWidth={3.5} strokeLinejoin="round" />
        </g>
      ))}
      <path d="M60 352 Q 360 150 660 352" fill="none" stroke={C.red} strokeWidth={9} strokeDasharray="900" strokeDashoffset={900 * (1 - ramp(p, 0.55, 1))} strokeLinecap="round" />
      <text x={110} y={250} fontFamily={FONT} fontWeight={800} fontSize={26} fill={C.forest} transform="rotate(-8 110 250)">M</text>
      <text x={252} y={230} fontFamily={FONT} fontWeight={800} fontSize={26} fill={C.forest}>I</text>
      <text x={362} y={215} fontFamily={FONT} fontWeight={800} fontSize={26} fill={C.forest}>L</text>
      <text x={510} y={225} fontFamily={FONT} fontWeight={800} fontSize={28} fill={C.forest}>cuboid</text>
    </svg>
  );
};
