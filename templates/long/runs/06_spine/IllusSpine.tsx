import React from "react";
import { C, FONT, ramp } from "./kit";

/* ======================================================================
   Book Plume own illustrations for "Vertebral Column Anatomy Made Easy".
   SpineSide   = whole column from the LEFT side, front (anterior) on the LEFT, back on the right (like Gray FIG. 111).
   VertTop     = one vertebra seen from ABOVE, front (anterior) at the TOP. variant "T" thoracic | "C" cervical | "L" lumbar.
   DiscSide    = sagittal schematic of 2 vertebrae + disc + ligaments, front on the LEFT.
   DiscTop     = intervertebral disc from above (anulus rings + nucleus).
   `lit` maps a part id -> time (s) it lights up, or {a,b} window.
   ====================================================================== */

type Win = { a: number; b?: number };
export type Lit = Record<string, Win | number | undefined>;
export const win = (t: number, w?: Win | number) => {
  if (w === undefined) return 0;
  const a = typeof w === "number" ? w : w.a;
  const b = typeof w === "number" ? undefined : w.b;
  return ramp(t, a, a + 0.3) * (b === undefined ? 1 : 1 - ramp(t, b, b + 0.3));
};
export const mix = (a: string, b: string, k: number) => {
  const p = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const x = p(a), y = p(b);
  return "#" + x.map((v, i) => Math.round(v + (y[i] - v) * Math.max(0, Math.min(1, k))).toString(16).padStart(2, "0")).join("");
};

export const RC: Record<string, string> = { C: "#86BEDA", T: "#EE9C86", L: "#9FCB8C", S: "#EBC560", Co: "#C2A3DC" };
export const RNAME: Record<string, string> = { C: "Cervical", T: "Thoracic", L: "Lumbar", S: "Sacrum", Co: "Coccyx" };
const BONE = "#F4ECD2", BONE_D = "#D9CBA0", LINE = "#7C6B45";

const Defs: React.FC<{ id: string }> = ({ id }) => (
  <defs>
    <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#FFF9E8" />
      <stop offset="55%" stopColor={BONE} />
      <stop offset="100%" stopColor={BONE_D} />
    </linearGradient>
    <radialGradient id={`${id}lit`} cx="40%" cy="35%" r="75%">
      <stop offset="0%" stopColor="#FFFAE0" />
      <stop offset="60%" stopColor="#F7E39A" />
      <stop offset="100%" stopColor="#E3C25A" />
    </radialGradient>
    <pattern id={`${id}sp`} width="12" height="12" patternUnits="userSpaceOnUse">
      <circle cx="3" cy="4" r="1.4" fill="#B9A97C" opacity="0.45" />
      <circle cx="9" cy="9" r="1.1" fill="#B9A97C" opacity="0.35" />
    </pattern>
    <filter id={`${id}gl`} x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="9" />
    </filter>
    <filter id={`${id}sh`} x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#1F2A14" floodOpacity="0.18" />
    </filter>
  </defs>
);

/** a part that glows when lit (k 0..1). col = region colour (else banana) */
const Part: React.FC<{ id: string; d: string; k: number; col?: string; dim?: number; sw?: number; spongy?: boolean; base?: string; line?: string }> = ({ id, d, k, col, dim = 1, sw = 4, spongy, base, line = LINE }) => {
  const kk = Math.max(0, Math.min(1, k));
  const fill = col ? mix(base || BONE, col, kk) : kk > 0.5 ? `url(#${id}lit)` : base || `url(#${id}b)`;
  return (
    <g opacity={dim + (1 - dim) * kk}>
      {kk > 0.01 && <path d={d} fill={col || C.banana} opacity={0.5 * kk} filter={`url(#${id}gl)`} />}
      <path d={d} fill={fill} stroke={mix(line, C.forest, kk)} strokeWidth={sw} strokeLinejoin="round" />
      {spongy && <path d={d} fill={`url(#${id}sp)`} opacity={0.7} />}
    </g>
  );
};

/* ------------------------------------------------------------------
   SpineSide — viewBox 0 0 520 1120
   ------------------------------------------------------------------ */
const CP: [number, number][] = [
  [250, 40], [228, 120], [246, 205], [290, 330], [300, 460], [270, 590], [236, 690], [244, 790], [290, 880], [300, 960], [270, 1040], [250, 1080],
];
// Catmull-Rom sampling
const SAMP: { x: number; y: number; s: number }[] = (() => {
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < CP.length - 1; i++) {
    const p0 = CP[Math.max(0, i - 1)], p1 = CP[i], p2 = CP[i + 1], p3 = CP[Math.min(CP.length - 1, i + 2)];
    for (let j = 0; j < 40; j++) {
      const u = j / 40, u2 = u * u, u3 = u2 * u;
      const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u2 + (-a + 3 * b - 3 * c + d) * u3);
      pts.push({ x: f(p0[0], p1[0], p2[0], p3[0]), y: f(p0[1], p1[1], p2[1], p3[1]) });
    }
  }
  pts.push({ x: CP[CP.length - 1][0], y: CP[CP.length - 1][1] });
  let s = 0;
  return pts.map((p, i) => {
    if (i) s += Math.hypot(p.x - pts[i - 1].x, p.y - pts[i - 1].y);
    return { ...p, s };
  });
})();
const TOTAL = SAMP[SAMP.length - 1].s;
const at = (s: number) => {
  let i = SAMP.findIndex((p) => p.s >= s);
  if (i <= 0) i = 1;
  const a = SAMP[i - 1], b = SAMP[i];
  const k = (s - a.s) / Math.max(0.001, b.s - a.s);
  const ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI - 90;
  return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, ang };
};
type V = { id: string; r: string; h: number; w: number; gap: number; s: number; x: number; y: number; ang: number };
export const VERTS: V[] = (() => {
  const list: { id: string; r: string; h: number; w: number; gap: number }[] = [];
  for (let i = 1; i <= 7; i++) list.push({ id: `C${i}`, r: "C", h: i === 1 ? 16 : 22, w: i < 3 ? 46 : 52 + i * 1.5, gap: i === 1 ? 6 : 8 });
  for (let i = 1; i <= 12; i++) list.push({ id: `T${i}`, r: "T", h: 25 + i * 0.9, w: 62 + i * 1.8, gap: 7 });
  for (let i = 1; i <= 5; i++) list.push({ id: `L${i}`, r: "L", h: 38 + i, w: 96 + i * 2, gap: 12 });
  list.push({ id: "S", r: "S", h: 180, w: 100, gap: -6 });
  list.push({ id: "Co", r: "Co", h: 70, w: 30, gap: 0 });
  const tot = list.reduce((a, v) => a + v.h + v.gap, 0);
  const sc = (TOTAL - 20) / tot;
  let s = 10;
  return list.map((v) => {
    const h = v.h * sc, gap = v.gap * sc;
    const c = at(s + h / 2);
    s += h + gap;
    return { ...v, h, gap, s: s - h / 2 - gap, ...c };
  });
})();
const vPath = (v: V) => {
  const { w, h } = v;
  if (v.r === "S") return `M${-w * 0.55} ${-h / 2} L${w * 0.5} ${-h / 2} C${w * 0.62} ${-h * 0.1} ${w * 0.35} ${h * 0.3} ${w * 0.12} ${h / 2} L${-w * 0.12} ${h / 2} C${-w * 0.3} ${h * 0.2} ${-w * 0.5} ${-h * 0.15} ${-w * 0.55} ${-h / 2} Z`;
  if (v.r === "Co") return `M${-w / 2} ${-h / 2} L${w / 2} ${-h / 2} L${w * 0.15} ${h / 2} L${-w * 0.15} ${h / 2} Z`;
  const r = Math.min(8, h * 0.3);
  return `M${-w / 2 + r} ${-h / 2} L${w / 2 - r} ${-h / 2} Q${w / 2} ${-h / 2} ${w / 2} ${-h / 2 + r} L${w / 2} ${h / 2 - r} Q${w / 2} ${h / 2} ${w / 2 - r} ${h / 2} L${-w / 2 + r} ${h / 2} Q${-w / 2} ${h / 2} ${-w / 2} ${h / 2 - r} L${-w / 2} ${-h / 2 + r} Q${-w / 2} ${-h / 2} ${-w / 2 + r} ${-h / 2} Z`;
};
/** spinous process + arch drawn behind (to the right of) each body, local coords */
const archPath = (v: V) => {
  const { w, h } = v, x0 = w / 2 - 2;
  if (v.r === "C") {
    if (v.id === "C1") return `M${x0} ${-h * 0.4} L${x0 + 30} ${-h * 0.35} L${x0 + 46} ${-h * 0.2} L${x0 + 46} ${h * 0.25} L${x0 + 26} ${h * 0.35} L${x0} ${h * 0.3} Z`;
    const len = v.id === "C7" ? 74 : 40;
    return `M${x0} ${-h * 0.45} L${x0 + 28} ${-h * 0.5} L${x0 + len} ${h * 0.05} L${x0 + len + 4} ${h * 0.5} L${x0 + len - 10} ${h * 0.6} L${x0 + 24} ${h * 0.35} L${x0} ${h * 0.35} Z`;
  }
  if (v.r === "T") return `M${x0} ${-h * 0.45} L${x0 + 36} ${-h * 0.55} L${x0 + 56} ${h * 0.1} L${x0 + 74} ${h * 1.25} L${x0 + 64} ${h * 1.35} L${x0 + 34} ${h * 0.5} L${x0} ${h * 0.35} Z`;
  if (v.r === "L") return `M${x0} ${-h * 0.4} L${x0 + 34} ${-h * 0.42} L${x0 + 78} ${-h * 0.3} C${x0 + 90} ${-h * 0.28} ${x0 + 90} ${h * 0.25} ${x0 + 78} ${h * 0.28} L${x0 + 34} ${h * 0.4} L${x0} ${h * 0.35} Z`;
  if (v.r === "S") return `M${w * 0.45} ${-h * 0.45} L${w * 0.62} ${-h * 0.3} L${w * 0.42} ${h * 0.2} L${w * 0.2} ${h * 0.4} Z`;
  return "";
};

export const SpineSide: React.FC<{
  t: number; w?: number; lit?: Lit; dim?: number; draw?: number; regions?: number; curves?: number; curveLit?: Lit; numbers?: number; discs?: number; showCord?: number; ivf?: number;
}> = ({ t, w = 380, lit = {}, dim = 1, draw, regions = 0, curves = 0, curveLit = {}, numbers = 0, discs = 1, showCord = 0, ivf = 0 }) => {
  const id = "ss";
  const d0 = draw === undefined ? 1 : ramp(t, draw, draw + 1.6);
  const kOf = (v: V) => Math.max(win(t, lit[v.id]), win(t, lit[v.r]), regions);
  // curve arcs (primary = backward bulge: T, S ; secondary = forward bulge: C, L)
  const arcs: { id: string; a: number; b: number; side: 1 | -1; prim: boolean }[] = [
    { id: "C", a: 0, b: 6, side: -1, prim: false },
    { id: "T", a: 7, b: 18, side: 1, prim: true },
    { id: "L", a: 19, b: 23, side: -1, prim: false },
    { id: "S", a: 24, b: 25, side: 1, prim: true },
  ];
  return (
    <svg width={w} height={(w * 1120) / 520} viewBox="0 0 520 1120" style={{ overflow: "visible" }}>
      <Defs id={id} />
      {showCord > 0 && (
        <path d={SAMP.filter((p) => p.s < TOTAL * 0.62).map((p, i) => `${i ? "L" : "M"}${p.x + 70} ${p.y}`).join(" ")} fill="none" stroke="#F3C9A8" strokeWidth={16} strokeLinecap="round" opacity={showCord} />
      )}
      {VERTS.map((v, i) => {
        const vis = ramp(d0, i / VERTS.length * 0.8, i / VERTS.length * 0.8 + 0.2);
        if (vis <= 0) return null;
        const k = kOf(v);
        const col = RC[v.r];
        return (
          <g key={v.id} transform={`translate(${v.x} ${v.y + (1 - vis) * 20}) rotate(${v.ang})`} opacity={vis}>
            {v.r !== "Co" && <Part id={id} d={archPath(v)} k={k} col={col} dim={dim} sw={3} base="#EFE4C4" />}
            <Part id={id} d={vPath(v)} k={k} col={col} dim={dim} sw={3.5} spongy={v.r !== "Co"} />
            {v.r === "S" && [0, 1, 2, 3].map((j) => <line key={j} x1={-v.w * 0.45 + j * 4} y1={-v.h / 2 + (j + 1) * v.h / 5.2} x2={v.w * 0.42 - j * 7} y2={-v.h / 2 + (j + 1) * v.h / 5.2} stroke={LINE} strokeWidth={2} opacity={0.5} strokeDasharray="6 5" />)}
            {v.r === "Co" && [1, 2, 3].map((j) => <line key={j} x1={-v.w * (0.5 - j * 0.09)} y1={-v.h / 2 + j * v.h / 4} x2={v.w * (0.5 - j * 0.09)} y2={-v.h / 2 + j * v.h / 4} stroke={LINE} strokeWidth={2} opacity={0.6} />)}
            {discs > 0 && v.gap > 2 && v.r !== "S" && (
              <rect x={-v.w / 2 + 3} y={v.h / 2 + 1} width={v.w - 6} height={Math.max(2, v.gap - 2)} rx={3} fill={mix("#BFD9E6", "#6FB0CF", win(t, lit.discs))} opacity={discs * (0.85 * dim + 0.15)} stroke="#4E86A0" strokeWidth={1.2} />
            )}
          </g>
        );
      })}
      {/* intervertebral foramen highlight (between L3/L4) */}
      {ivf > 0 && (() => {
        const v = VERTS[21];
        return (
          <g transform={`translate(${v.x} ${v.y}) rotate(${v.ang})`} opacity={ivf}>
            <ellipse cx={v.w / 2 + 14} cy={v.h / 2 + v.gap / 2} rx={13} ry={10} fill="#FFF5C8" stroke={C.red} strokeWidth={4} />
            <path d={`M${v.w / 2 + 14} ${v.h / 2 + v.gap / 2} C${v.w / 2 + 40} ${v.h / 2 + 30} ${v.w / 2 + 70} ${v.h / 2 + 50} ${v.w / 2 + 110} ${v.h / 2 + 50}`} fill="none" stroke="#E9B43C" strokeWidth={7} strokeLinecap="round" strokeDasharray={`${150 * ivf} 200`} />
          </g>
        );
      })()}
      {/* curve arcs: parallel to the column on the side it bulges */}
      {curves > 0 && arcs.map((a) => {
        const k = win(t, curveLit[a.id]);
        const vs = VERTS.slice(a.a, a.b + 1);
        const pts = vs.map((v) => {
          const r = (v.ang * Math.PI) / 180;
          const nx = Math.cos(r), ny = Math.sin(r);
          const off = a.side === 1 ? v.w / 2 + 120 : -(v.w / 2 + 34);
          return [v.x + nx * off, v.y + ny * off];
        });
        const col = a.prim ? C.red : "#3E7FA6";
        const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
        return (
          <g key={a.id} opacity={curves * (0.3 + 0.7 * k)}>
            <path d={d} fill="none" stroke={col} strokeWidth={9 + 5 * k} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      })}
      {numbers > 0 && VERTS.filter((v) => v.r !== "S" && v.r !== "Co").map((v) => (
        <text key={v.id} x={v.x - v.w / 2 - 14} y={v.y + 6} textAnchor="end" fontFamily={FONT} fontWeight={800} fontSize={v.r === "L" ? 22 : 17} fill={C.forest} opacity={numbers * (0.35 + 0.65 * kOf(v))}>{v.id}</text>
      ))}
    </svg>
  );
};
/** point (viewBox coords) of a vertebra centre, optionally pushed towards back (+) or front (-) */
export const SSP = (id: string, dx = 0): [number, number] => {
  const v = VERTS.find((x) => x.id === id)!;
  return [v.x + dx, v.y];
};

/* ------------------------------------------------------------------
   VertTop — viewBox 0 0 800 760, anterior at TOP, patient's left on viewer's right
   ------------------------------------------------------------------ */
type VG = Record<string, string>;
const mirror = (d: string) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_m, x, y) => `${800 - parseFloat(x)} ${y}`);
const sym = (g: VG) => {
  const out: VG = { ...g };
  Object.keys(g).forEach((k) => {
    if (k.endsWith("L")) out[k.slice(0, -1) + "R"] = mirror(g[k]);
  });
  return out;
};
const GEO: Record<string, VG> = {
  T: sym({
    body: "M400 292 C376 278 334 288 296 268 C250 244 240 178 266 132 C296 80 354 58 400 58 C446 58 504 80 534 132 C560 178 550 244 504 268 C466 288 424 278 400 292 Z",
    pedL: "M284 262 L340 276 L338 372 L280 376 Z",
    lamL: "M282 360 L340 352 C352 400 372 438 400 452 L400 520 C346 508 300 466 282 418 Z",
    transL: "M312 366 C260 380 196 410 148 440 C120 458 124 498 152 504 C196 512 262 476 330 440 Z",
    artL: "M266 332 C252 312 268 290 296 294 C324 300 330 328 314 344 C300 356 278 350 266 332 Z",
    spin: "M368 452 L432 452 C428 530 420 610 412 690 C408 714 392 714 388 690 C380 610 372 530 368 452 Z",
    hole: "M400 304 C442 302 468 334 468 378 C468 422 440 452 400 452 C360 452 332 422 332 378 C332 334 358 302 400 304 Z",
    costL: "M134 466 C130 482 138 498 154 498 C168 498 172 482 166 470 C160 458 142 456 134 466 Z",
    cbodL: "M256 218 C246 228 246 248 260 256 C272 262 284 250 282 236 C280 222 266 212 256 218 Z",
  }),
  C: sym({
    body: "M282 110 C320 96 480 96 518 110 C540 118 548 150 540 186 C534 216 512 228 480 230 L320 230 C288 228 266 216 260 186 C252 150 260 118 282 110 Z",
    pedL: "M268 210 L322 220 L312 300 L262 296 Z",
    lamL: "M262 290 L314 290 C336 346 366 392 400 410 L400 452 C344 440 284 386 262 336 Z",
    transL: "M292 190 C254 182 198 184 162 204 C132 222 132 262 158 276 C196 292 254 288 296 278 Z",
    artL: "M232 304 C210 290 214 258 242 252 C274 248 296 270 290 296 C284 318 252 320 232 304 Z",
    spin: "M372 410 L428 410 L456 486 C462 506 444 516 432 500 L400 458 L368 500 C356 516 338 506 344 486 Z",
    hole: "M400 240 C450 240 494 252 494 280 C494 320 446 384 400 398 C354 384 306 320 306 280 C306 252 350 240 400 240 Z",
    tforL: "M198 238 C198 224 210 214 224 214 C238 214 250 224 250 238 C250 252 238 262 224 262 C210 262 198 252 198 238 Z",
  }),
  L: sym({
    body: "M400 316 C366 300 310 316 262 292 C214 268 204 196 232 146 C268 86 340 64 400 64 C460 64 532 86 568 146 C596 196 586 268 538 292 C490 316 434 300 400 316 Z",
    pedL: "M290 286 L348 304 L350 372 L292 382 Z",
    lamL: "M292 372 L348 362 C358 404 376 430 400 444 L400 492 C346 482 304 444 292 404 Z",
    transL: "M300 330 C246 330 170 318 112 314 C92 314 88 344 108 350 C170 362 246 372 304 372 Z",
    artL: "M286 386 C264 370 266 338 292 330 C318 324 340 346 334 372 C328 396 304 398 286 386 Z",
    spin: "M366 440 L434 440 C440 500 446 552 438 600 C432 618 368 618 362 600 C354 552 360 500 366 440 Z",
    hole: "M400 312 C440 312 472 336 472 368 C472 404 436 436 400 452 C364 436 328 404 328 368 C328 336 360 312 400 312 Z",
  }),
};
export const VTP: Record<string, Record<string, [number, number]>> = {
  T: { body: [400, 170], pedL: [306, 318], pedR: [494, 318], lamL: [330, 430], lamR: [470, 430], spin: [400, 620], transL: [180, 460], transR: [620, 460], artL: [292, 322], artR: [508, 322], hole: [400, 378], costL: [150, 482], cbodL: [264, 238] },
  C: { body: [400, 165], pedL: [292, 256], pedR: [508, 256], lamL: [320, 360], lamR: [480, 360], spin: [400, 470], transL: [180, 240], transR: [620, 240], artL: [252, 280], artR: [548, 280], hole: [400, 300], tforL: [224, 238], tforR: [576, 238] },
  L: { body: [400, 190], pedL: [320, 340], pedR: [480, 340], lamL: [342, 420], lamR: [458, 420], spin: [400, 560], transL: [160, 340], transR: [640, 340], artL: [306, 360], artR: [494, 360], hole: [400, 380] },
};
export const VertTop: React.FC<{ t: number; v?: "T" | "C" | "L"; w?: number; lit?: Lit; dim?: number; draw?: number; col?: string; cord?: number; artery?: number }> = ({ t, v = "T", w = 560, lit = {}, dim = 1, draw, col, cord = 0, artery = 0 }) => {
  const id = `vt${v}`;
  const g = GEO[v];
  const k = (p: string) => win(t, lit[p]) || (p.endsWith("L") || p.endsWith("R") ? win(t, lit[p.slice(0, -1)]) : 0) || win(t, lit.all);
  const d0 = draw === undefined ? 1 : ramp(t, draw, draw + 1.0);
  const order = ["transL", "transR", "spin", "lamL", "lamR", "pedL", "pedR", "artL", "artR", "body"];
  const holeK = k("hole");
  return (
    <svg width={w} height={(w * 760) / 800} viewBox="0 0 800 760" style={{ overflow: "visible" }}>
      <Defs id={id} />
      <g opacity={d0} transform={`translate(0 ${(1 - d0) * 30})`} filter={`url(#${id}sh)`}>
        {order.map((p) => g[p] && <Part key={p} id={id} d={g[p]} k={k(p)} col={col} dim={dim} spongy={p === "body"} />)}
        {/* facets for ribs (thoracic) */}
        {v === "T" && ["costL", "costR", "cbodL", "cbodR"].map((p) => {
          const kk = Math.max(k(p), k("cost"));
          return <path key={p} d={g[p]} fill={mix("#E9DDB6", C.red, kk)} stroke={mix(LINE, C.redDark, kk)} strokeWidth={3} opacity={dim + (1 - dim) * kk} />;
        })}
        {/* the vertebral foramen (a hole) */}
        <path d={g.hole} fill={mix(C.paper, "#FFF1B0", holeK)} stroke={mix(LINE, C.forest, holeK)} strokeWidth={4 + 2 * holeK} />
        {holeK > 0.01 && <path d={g.hole} fill={C.banana} opacity={0.35 * holeK} />}
        {cord > 0 && (() => {
          const [cx, cy] = VTP[v].hole;
          return (
            <g opacity={cord}>
              <ellipse cx={cx} cy={cy - 4} rx={v === "C" ? 52 : 44} ry={v === "C" ? 32 : 34} fill="#F3C9A8" stroke="#B9785A" strokeWidth={3} />
              <path d={`M${cx - 26} ${cy - 18} C${cx - 8} ${cy - 2} ${cx - 8} ${cy + 6} ${cx - 22} ${cy + 18} M${cx + 26} ${cy - 18} C${cx + 8} ${cy - 2} ${cx + 8} ${cy + 6} ${cx + 22} ${cy + 18}`} fill="none" stroke="#B9785A" strokeWidth={3} opacity={0.6} />
            </g>
          );
        })()}
        {/* transverse foramina (cervical) */}
        {v === "C" && ["tforL", "tforR"].map((p) => {
          const kk = Math.max(k(p), k("tfor"));
          return (
            <g key={p}>
              <path d={g[p]} fill={mix(C.paper, "#FFF1B0", kk)} stroke={mix(LINE, C.red, kk)} strokeWidth={4 + 2 * kk} />
              {artery > 0 && <circle cx={VTP.C[p][0]} cy={VTP.C[p][1]} r={15} fill={C.red} opacity={artery} stroke={C.redDark} strokeWidth={3} />}
            </g>
          );
        })}
      </g>
    </svg>
  );
};

/* ------------------------------------------------------------------
   DiscSide — viewBox 0 0 900 760, anterior LEFT. Two vertebrae + disc + ligaments, sagittal cut.
   ------------------------------------------------------------------ */
const DS = {
  body1: "M120 60 L420 60 Q440 60 440 80 L440 270 Q440 290 420 290 L120 290 Q100 290 100 270 L100 80 Q100 60 120 60 Z",
  body2: "M120 380 L420 380 Q440 380 440 400 L440 590 Q440 610 420 610 L120 610 Q100 610 100 590 L100 400 Q100 380 120 380 Z",
  anulus: "M104 294 L436 294 Q446 335 436 376 L104 376 Q94 335 104 294 Z",
  nucleus: "M230 304 C270 296 310 296 350 304 C366 320 366 350 350 366 C310 374 270 374 230 366 C214 350 214 320 230 304 Z",
  arch1: "M520 70 L600 70 L640 110 L820 190 Q842 204 826 222 L640 220 L600 280 L520 280 Z",
  arch2: "M520 390 L600 390 L640 430 L820 510 Q842 524 826 542 L640 540 L600 600 L520 600 Z",
  ALL: "M78 40 L98 40 L98 630 L78 630 Z",
  PLL: "M442 40 L458 40 L458 630 L442 630 Z",
  flavum: "M520 280 L560 280 L560 390 L520 390 Z",
  supra: "M836 200 C860 300 860 420 836 520 L826 520 C846 420 846 300 826 200 Z",
  cord: "M466 30 L510 30 L510 640 L466 640 Z",
};
export const DSP: Record<string, [number, number]> = { body1: [270, 170], body2: [270, 500], anulus: [140, 335], nucleus: [290, 335], ALL: [88, 520], PLL: [450, 120], flavum: [540, 335], supra: [850, 360], cord: [488, 200], arch1: [700, 180] };
export const DiscSide: React.FC<{ t: number; w?: number; lit?: Lit; dim?: number; ligs?: number; cord?: number; squash?: number }> = ({ t, w = 700, lit = {}, dim = 1, ligs = 1, cord = 1, squash = 0 }) => {
  const id = "ds";
  const k = (p: string) => win(t, lit[p]);
  const sq = squash; // 0..1 compress the disc
  const dy = 14 * sq;
  return (
    <svg width={w} height={(w * 680) / 900} viewBox="0 0 900 680" style={{ overflow: "visible" }}>
      <Defs id={id} />
      <g transform={`translate(0 ${dy})`}>
        <Part id={id} d={DS.body1} k={k("body")} dim={dim} spongy />
        <Part id={id} d={DS.arch1} k={k("arch")} dim={dim} base="#EFE4C4" />
      </g>
      <Part id={id} d={DS.body2} k={k("body")} dim={dim} spongy />
      <Part id={id} d={DS.arch2} k={k("arch")} dim={dim} base="#EFE4C4" />
      <g transform={`translate(270 335) scale(${1 + 0.04 * sq} ${1 - 0.3 * sq}) translate(-270 -335)`}>
        <Part id={id} d={DS.anulus} k={k("anulus")} col="#6FB0CF" base="#CFE3EC" dim={dim} line="#4E86A0" />
        {[0, 1, 2].map((j) => <path key={j} d={`M${120 + j * 30} 298 Q${110 + j * 30} 335 ${120 + j * 30} 372 M${420 - j * 30} 298 Q${430 - j * 30} 335 ${420 - j * 30} 372`} fill="none" stroke="#4E86A0" strokeWidth={2} opacity={0.5 * dim + 0.2} />)}
        <Part id={id} d={DS.nucleus} k={k("nucleus")} col="#F2D14E" base="#F6E7B8" dim={dim} line="#B08E2E" />
      </g>
      {cord > 0 && <g opacity={cord * (dim + (1 - dim) * k("cord"))}><path d={DS.cord} fill={mix("#F3C9A8", "#F0A878", k("cord"))} stroke="#B9785A" strokeWidth={3} /></g>}
      {ligs > 0 && (
        <g opacity={ligs}>
          {(["ALL", "PLL", "flavum", "supra"] as const).map((p) => {
            const kk = k(p);
            const base = p === "flavum" ? "#EBD47A" : "#D9B48F";
            return (
              <g key={p} opacity={dim + (1 - dim) * kk}>
                {kk > 0.01 && <path d={DS[p]} fill={C.banana} opacity={0.6 * kk} filter={`url(#${id}gl)`} />}
                <path d={DS[p]} fill={mix(base, p === "flavum" ? "#F2C230" : C.red, kk * 0.7)} stroke="#8A6440" strokeWidth={2.5} />
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
};

/** disc from above: anulus rings + nucleus. viewBox 0 0 600 420 */
export const DiscTop: React.FC<{ t: number; w?: number; lit?: Lit; dim?: number; rings?: number }> = ({ t, w = 520, lit = {}, dim = 1, rings = 1 }) => {
  const ka = win(t, lit.anulus), kn = win(t, lit.nucleus);
  const shape = (s: number) => {
    const cx = 300, cy = 210;
    return `M${cx} ${cy + 175 * s} C${cx - 120 * s} ${cy + 182 * s} ${cx - 270 * s} ${cy + 150 * s} ${cx - 270 * s} ${cy} C${cx - 270 * s} ${cy - 160 * s} ${cx - 130 * s} ${cy - 190 * s} ${cx} ${cy - 190 * s} C${cx + 130 * s} ${cy - 190 * s} ${cx + 270 * s} ${cy - 160 * s} ${cx + 270 * s} ${cy} C${cx + 270 * s} ${cy + 150 * s} ${cx + 120 * s} ${cy + 182 * s} ${cx} ${cy + 175 * s} Z`;
  };
  return (
    <svg width={w} height={(w * 420) / 600} viewBox="0 0 600 420" style={{ overflow: "visible" }}>
      <Defs id="dt" />
      <g opacity={dim + (1 - dim) * ka}>
        {ka > 0.01 && <path d={shape(1)} fill="#6FB0CF" opacity={0.45 * ka} filter="url(#dtgl)" />}
        <path d={shape(1)} fill={mix("#CFE3EC", "#8CC2DC", ka)} stroke="#4E86A0" strokeWidth={4} />
        {[0.9, 0.8, 0.7, 0.6, 0.5].map((s, i) => <path key={s} d={shape(s)} fill="none" stroke="#4E86A0" strokeWidth={2.2} opacity={rings * (0.75 - i * 0.08)} strokeDasharray={i % 2 ? "14 6" : "none"} />)}
      </g>
      <g opacity={dim + (1 - dim) * kn}>
        {kn > 0.01 && <ellipse cx={300} cy={214} rx={110} ry={86} fill={C.banana} opacity={0.6 * kn} filter="url(#dtgl)" />}
        <path d="M300 140 C360 136 404 170 404 214 C404 262 360 290 300 288 C240 290 196 262 196 214 C196 170 240 136 300 140 Z" fill={mix("#F6E7B8", "#F2D14E", kn)} stroke="#B08E2E" strokeWidth={4} />
        <path d="M250 190 C270 176 300 180 312 196 M282 244 C304 252 330 246 344 230" fill="none" stroke="#B08E2E" strokeWidth={3} opacity={0.5} />
      </g>
    </svg>
  );
};
