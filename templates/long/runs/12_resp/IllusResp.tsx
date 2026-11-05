import React from "react";
import { C, FONT, ramp } from "./kit";

/* lit: id -> start time, or {a,b} window. A part glows while lit; when anything is lit the rest dims. */
export type Lit = Record<string, number | { a: number; b: number }>;
export const litK = (t: number, v: number | { a: number; b: number } | undefined) => {
  if (v === undefined) return 0;
  if (typeof v === "number") return ramp(t, v - 0.1, v + 0.3);
  return ramp(t, v.a - 0.1, v.a + 0.3) * (1 - ramp(t, v.b - 0.1, v.b + 0.3));
};
const anyLit = (t: number, lit: Lit) => Math.max(0, ...Object.values(lit).map((v) => litK(t, v)));
export const mix = (a: string, b: string, k: number) => {
  const h = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const x = h(a), y = h(b);
  return "#" + x.map((v, i) => Math.round(v + (y[i] - v) * Math.max(0, Math.min(1, k))).toString(16).padStart(2, "0")).join("");
};

/* ---------------- colours ---------------- */
export const RC = {
  mucosa: "#F3B5A8", mucosaDark: "#D9735F", cart: "#E3EEF3", cartLine: "#8EAABA", bone: "#EDE5C8", boneLine: "#CFC39A",
  supL: "#F4B6A6", mid: "#F2D58A", inf: "#B9D3A0", lung: "#F2C2B5", heart: "#C9483C", liver: "#9C5B3F", muscle: "#C97E5A", muscleDark: "#A35E3E",
  air: "#8FD3EA", airDark: "#3F9BB8", o2: "#E0574A", co2: "#3F78B8", mucus: "#EDE39A", cell: "#FBE3D6", nucleus: "#8E5BB0", visc: "#3F9BB8", pari: "#8E5BB0",
  fluid: "#CDEBF5", skin: "#F6D8C2", skinLine: "#D4A98A", food: "#E9A23B", nerve: "#E9C42E", tongue: "#E58C83",
};
export const useGlow = (t: number, lit: Lit, dim: number, groups: Record<string, string> = {}) => {
  const any = anyLit(t, lit) * dim;
  const k = (id: string) => Math.max(litK(t, lit[id]), groups[id] ? litK(t, lit[groups[id]]) : 0);
  const F = (id: string, col: string) => {
    const kk = k(id);
    return { fill: mix(mix(col, "#FFFFFF", any * (1 - kk) * 0.45), "#FFF2A0", kk * 0.22), opacity: 1 - any * (1 - kk) * 0.25 };
  };
  const S = (id: string, w = 2.5) => {
    const kk = k(id);
    return { stroke: C.forest, strokeWidth: w + 1.5 * kk };
  };
  const Halo: React.FC<{ id: string; children: React.ReactElement<any> }> = ({ id, children }) => {
    const kk = k(id);
    if (kk <= 0) return null;
    return React.cloneElement(children, { fill: "none", stroke: C.banana, strokeWidth: (children.props.strokeWidth || 0) + 16 * kk, strokeOpacity: 0.95 * kk, strokeLinejoin: "round", strokeLinecap: "round" });
  };
  return { any, k, F, S, Halo };
};

/* Catmull-Rom → cubic bezier path through points */
export const smooth = (p: [number, number][], closed = false) => {
  const n = p.length;
  const g = (i: number) => (closed ? p[(i + n) % n] : p[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)} `;
  const m = closed ? n : n - 1;
  for (let i = 0; i < m; i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)} `;
  }
  return d + (closed ? "Z" : "");
};
/* sample a Catmull-Rom curve densely (for moving dots) */
export const sampleSmooth = (p: [number, number][], per = 12): [number, number][] => {
  const n = p.length, out: [number, number][] = [];
  const g = (i: number) => p[Math.max(0, Math.min(n - 1, i))];
  for (let i = 0; i < n - 1; i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
    for (let s = 0; s < per; s++) {
      const u = s / per, u2 = u * u, u3 = u2 * u;
      const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u2 + (-a + 3 * b - 3 * c + d) * u3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(p[n - 1]);
  return out;
};
export const ptOn = (pts: [number, number][], u: number): [number, number] => {
  const L = pts.length - 1, f = Math.max(0, Math.min(0.9999, u)) * L, i = Math.floor(f), r = f - i;
  return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * r, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * r];
};
export const Dots: React.FC<{ pts: [number, number][]; t: number; k: number; n?: number; speed?: number; r?: number; col?: string }> = ({ pts, t, k, n = 6, speed = 0.25, r = 7, col = RC.air }) => {
  if (k <= 0) return null;
  return (
    <g opacity={k}>
      {Array.from({ length: n }).map((_, i) => {
        const u = (t * speed + i / n) % 1;
        const [x, y] = ptOn(pts, u);
        const fade = Math.min(1, u * 8, (1 - u) * 8);
        return <circle key={i} cx={x} cy={y} r={r} fill={col} stroke={C.forest} strokeWidth={2} opacity={fade} />;
      })}
    </g>
  );
};
/* double-stroke tube (outline + fill colour) */
export const Tube: React.FC<{ d: string; w: number; col: string; op?: number }> = ({ d, w, col, op = 1 }) => (
  <g opacity={op}>
    <path d={d} fill="none" stroke={C.forest} strokeWidth={w + 6} strokeLinecap="round" strokeLinejoin="round" />
    <path d={d} fill="none" stroke={col} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />

  </g>
);

/* ---------- shared drawing helpers ---------- */
type G = ReturnType<typeof useGlow>;
const mkPart = (g: G) => (id: string, d: string, col: string, sw = 3, extra: React.SVGProps<SVGPathElement> = {}) => (
  <g key={id + d.slice(0, 12)}>
    <g.Halo id={id}><path d={d} strokeWidth={sw} /></g.Halo>
    <path d={d} {...g.F(id, col)} {...g.S(id, sw)} {...extra} />
  </g>
);
const poly = (p: [number, number][]) => "M" + p.map((q) => `${q[0]} ${q[1]}`).join(" L") + " Z";
const rot = (p: [number, number], c: [number, number], deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180, dx = p[0] - c[0], dy = p[1] - c[1];
  return [c[0] + dx * Math.cos(a) - dy * Math.sin(a), c[1] + dx * Math.sin(a) + dy * Math.cos(a)];
};
/* deterministic little branching tree (bronchioles) */
const branches = (x: number, y: number, ang: number, len: number, depth: number, out: { x1: number; y1: number; x2: number; y2: number; d: number }[], spread = 30, d0 = 0) => {
  if (depth <= 0) return;
  const a = (ang * Math.PI) / 180;
  const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len;
  out.push({ x1: x, y1: y, x2, y2, d: d0 });
  branches(x2, y2, ang - spread, len * 0.68, depth - 1, out, spread * 0.92, d0 + 1);
  branches(x2, y2, ang + spread, len * 0.68, depth - 1, out, spread * 0.92, d0 + 1);
};

/* =====================================================================================
   1. AIRWAY MAP — front view schematic, nose → alveoli (viewBox 900 x 700). Patient's right = viewer's left.
   ===================================================================================== */
const LUNG_R: [number, number][] = [[418, 250], [360, 224], [288, 238], [222, 300], [182, 410], [160, 530], [168, 642], [280, 614], [388, 628], [432, 572], [436, 420]];
const LUNG_L: [number, number][] = [[484, 254], [540, 228], [614, 244], [680, 306], [720, 414], [740, 532], [734, 648], [624, 624], [530, 640], [496, 592], [520, 546], [550, 496], [510, 470], [484, 420]];
export const AW_PT: Record<string, [number, number]> = {
  nose: [450, 52], pharynx: [450, 132], larynx: [450, 200], trachea: [450, 285], carina: [450, 338], rmain: [408, 382], lmain: [520, 358],
  bronchioles: [318, 478], alveoli: [352, 548], lungR: [262, 500], lungL: [650, 470], diaphragm: [450, 610], term: [300, 300],
};
const AWG: Record<string, string> = { nose: "conducting", pharynx: "conducting", larynx: "conducting", trachea: "conducting", bronchi: "conducting", bronchioles: "conducting", alveoli: "respiratory" };
const AW_AIR: [number, number][] = [[450, 30], [450, 100], [450, 170], [450, 235], [450, 300], [440, 345], [412, 385], [388, 440], [372, 515]];
export const AirwayMap: React.FC<{ t: number; w: number; lit?: Lit; dim?: number; air?: number; lungs?: number }> = ({ t, w, lit = {}, dim = 1, air = 0, lungs = 1 }) => {
  const g = useGlow(t, lit, dim, AWG);
  const Pt = mkPart(g);
  const tree: { x1: number; y1: number; x2: number; y2: number; d: number }[] = [];
  ([[330, 300, -165, 40], [330, 300, -110, 34], [330, 470, 160, 42], [330, 470, 120, 40], [370, 520, 105, 44], [370, 520, 140, 40], [620, 310, -20, 40], [620, 310, -70, 34], [600, 520, 70, 44], [600, 520, 30, 42], [640, 420, 20, 36]] as [number, number, number, number][]).forEach(([x, y, a, l]) => branches(x, y, a, l, 3, tree, 30));
  const tips = tree.filter((b) => b.d === 2);
  const bk = Math.max(g.k("bronchioles"), g.k("conducting"));
  const ak = Math.max(g.k("alveoli"), g.k("respiratory"));
  const sAir = sampleSmooth(AW_AIR);
  return (
    <svg width={w} height={(w * 700) / 900} viewBox="0 0 900 700" style={{ overflow: "visible" }}>
      {/* lungs (behind the tree) */}
      <g opacity={lungs}>
        {Pt("lungR", smooth(LUNG_R, true), RC.lung, 3)}
        {Pt("lungL", smooth(LUNG_L, true), RC.lung, 3)}
        <path d="M424 440 L266 428 M216 346 L380 608" fill="none" stroke={C.forest} strokeWidth={2} strokeDasharray="7 6" opacity={0.45} />
        <path d="M680 352 L562 620" fill="none" stroke={C.forest} strokeWidth={2} strokeDasharray="7 6" opacity={0.45} />
      </g>
      {/* diaphragm */}
      {Pt("diaphragm", "M160 650 Q290 572 450 612 Q612 586 742 654 L742 668 Q612 604 450 628 Q290 590 160 666 Z", RC.muscle, 2.5)}
      {/* nasal cavity */}
      {Pt("nose", "M398 92 L410 30 Q450 6 490 30 L502 92 Q450 104 398 92 Z", RC.mucosa, 3)}
      <path d="M450 16 L450 96" stroke={C.forest} strokeWidth={3} />
      {[40, 58, 76].map((y, i) => (
        <g key={y} fill="none" stroke={RC.mucosaDark} strokeWidth={4} strokeLinecap="round">
          <path d={`M${414 - i * 3} ${y} q16 -2 22 8`} />
          <path d={`M${486 + i * 3} ${y} q-16 -2 -22 8`} />
        </g>
      ))}
      {/* pharynx */}
      {Pt("pharynx", "M428 92 L472 92 L474 176 L426 176 Z", RC.mucosa, 3)}
      {/* larynx */}
      {Pt("larynx", "M420 174 L480 174 L470 230 L430 230 Z", RC.cart, 3)}
      <path d="M432 178 L450 204 L468 178" fill="none" stroke={RC.cartLine} strokeWidth={3} />
      {/* trachea */}
      {Pt("trachea", "M436 230 L464 230 L464 336 L436 336 Z", RC.cart, 3)}
      {Array.from({ length: 11 }).map((_, i) => <path key={i} d={`M438 ${238 + i * 9} L462 ${238 + i * 9}`} stroke={RC.cartLine} strokeWidth={3} />)}
      {/* main + lobar bronchi */}
      <g.Halo id="bronchi"><path d="M444 334 Q426 362 396 402 M456 334 Q500 348 556 372" strokeWidth={22} /></g.Halo>
      <Tube d="M444 334 Q426 362 396 402" w={22} col={g.F("bronchi", RC.cart).fill} />
      <Tube d="M456 334 Q500 348 556 372" w={17} col={g.F("bronchi", RC.cart).fill} />
      {["M426 362 Q380 330 330 300", "M396 402 Q360 430 330 470", "M396 402 Q380 460 370 520", "M556 372 Q590 340 620 310", "M556 372 Q585 450 600 520"].map((d) => (
        <g key={d}><g.Halo id="bronchi"><path d={d} strokeWidth={12} /></g.Halo><Tube d={d} w={12} col={g.F("bronchi", RC.cart).fill} /></g>
      ))}
      {/* bronchioles */}
      <g>
        {tree.map((b, i) => (
          <line key={i} x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2} stroke={bk > 0.05 ? mix(RC.mucosaDark, C.banana, bk * 0.5) : RC.mucosaDark} strokeWidth={(b.d === 0 ? 6 : b.d === 1 ? 4 : 2.6) + bk * 2} strokeLinecap="round" opacity={1 - g.any * (1 - bk) * 0.5} />
        ))}
      </g>
      {/* alveoli clusters at the tips */}
      <g>
        {tips.map((b, i) => (
          <g key={i} opacity={1 - g.any * (1 - ak) * 0.5}>
            {[0, 1, 2].map((j) => <circle key={j} cx={b.x2 + Math.cos(j * 2.1 + i) * 6} cy={b.y2 + Math.sin(j * 2.1 + i) * 6} r={5 + ak * 2} fill={mix("#F7D0C8", C.banana, ak * 0.6)} stroke={RC.mucosaDark} strokeWidth={1.5} />)}
          </g>
        ))}
      </g>
      <Dots pts={sAir} t={t} k={air} n={7} speed={0.22} r={8} col={RC.air} />
    </svg>
  );
};

/* =====================================================================================
   2. CILIA — airway lining: pseudostratified ciliated columnar epithelium + goblet cells + mucus
   ===================================================================================== */
export const Cilia: React.FC<{ t: number; w: number; lit?: Lit; flow?: number }> = ({ t, w, lit = {}, flow = 1 }) => {
  const g = useGlow(t, lit, 1);
  const Pt = mkPart(g);
  const xs = Array.from({ length: 10 }).map((_, i) => 60 + i * 78);
  const gob = new Set([3, 7]);
  const nucY = [470, 400, 520, 430, 380, 500, 440, 410, 480, 395];
  const ck = g.k("cilia");
  return (
    <svg width={w} height={(w * 700) / 900} viewBox="0 0 900 700" style={{ overflow: "visible" }}>
      <rect x={40} y={556} width={820} height={14} rx={7} fill={RC.boneLine} />
      <rect x={40} y={570} width={820} height={100} rx={20} fill="#F6E7D8" opacity={0.7} />
      {/* basal cells */}
      {[100, 330, 560, 760].map((x) => <path key={x} d={`M${x - 30} 556 Q${x} 500 ${x + 30} 556 Z`} fill={RC.cell} stroke={C.forest} strokeWidth={2} />)}
      {xs.map((x, i) =>
        gob.has(i) ? (
          <g key={i}>
            {Pt("goblet", `M${x + 22} 556 L${x + 30} 430 Q${x - 6} 380 ${x + 8} 270 L${x + 70} 270 Q${x + 84} 380 ${x + 48} 430 L${x + 56} 556 Z`, "#F7F0D2", 2.5)}
            {[0, 1, 2, 3, 4].map((j) => <circle key={j} cx={x + 26 + (j % 2) * 24} cy={300 + j * 22} r={11} fill={RC.mucus} stroke="#C8B860" strokeWidth={2} />)}
            <ellipse cx={x + 39} cy={500} rx={12} ry={9} fill={RC.nucleus} />
          </g>
        ) : (
          <g key={i}>
            {Pt("cells", `M${x + 4} 556 L${x + 4} 280 Q${x + 39} 266 ${x + 74} 280 L${x + 74} 556 Z`, RC.cell, 2.5)}
            <ellipse cx={x + 39} cy={nucY[i]} rx={14} ry={22} fill={RC.nucleus} opacity={0.85} />
            {Array.from({ length: 7 }).map((_, j) => {
              const cx = x + 10 + j * 10;
              const a = Math.sin(t * 9 * flow - cx * 0.045) * 0.55 + 0.25;
              return <line key={j} x1={cx} y1={276} x2={cx + Math.sin(a) * 40} y2={276 - Math.cos(a) * 40} stroke={ck > 0.05 ? mix(C.forest, C.red, ck) : C.forest} strokeWidth={3 + ck * 1.5} strokeLinecap="round" />;
            })}
          </g>
        )
      )}
      {/* mucus layer with trapped dust moving toward the throat */}
      {Pt("mucus", `M40 214 ${Array.from({ length: 17 }).map((_, i) => `Q${65 + i * 50} ${200 + (i % 2) * 18} ${90 + i * 50} 208`).join(" ")} L860 176 Q450 160 40 180 Z`, RC.mucus, 2.5, { opacity: 0.92 })}
      {Array.from({ length: 9 }).map((_, i) => {
        const u = (((t * 0.06 * flow + i / 9) % 1) + 1) % 1;
        const x = 60 + u * 780;
        return <g key={i} opacity={Math.min(1, u * 10, (1 - u) * 10)}><circle cx={x} cy={192 + (i % 3) * 6} r={7 + (i % 3) * 2} fill="#7A6A4A" stroke={C.forest} strokeWidth={1.5} /></g>;
      })}
    </svg>
  );
};

/* =====================================================================================
   3. PHARYNX — sagittal schematic, face to the right (viewBox 900 x 700)
   ===================================================================================== */
export const PH_PT: Record<string, [number, number]> = {
  nasal: [620, 175], conchae: [610, 150], naso: [405, 165], oro: [385, 300], laryngo: [378, 420], larynx: [445, 490], trachea: [440, 620], esoph: [370, 600],
  epiglottis: [432, 372], adenoid: [372, 128], tonsil: [432, 300], tongue: [570, 320], mouth: [700, 290], palate: [600, 236], soft: [452, 260], nares: [800, 210],
};
export const Pharynx: React.FC<{ t: number; w: number; lit?: Lit; swallow?: number; air?: number; bolus?: number }> = ({ t, w, lit = {}, swallow = 0, air = 0, bolus = 0 }) => {
  const g = useGlow(t, lit, 1);
  const Pt = mkPart(g);
  const ep0: [number, number] = [424, 428];
  const epi = [[424, 428], [440, 400], [446, 368], [438, 352], [428, 362], [420, 396], [414, 426]].map((p) => rot(p as [number, number], ep0, -78 * swallow));
  const sp0: [number, number] = [470, 236];
  const soft = [[470, 236], [452, 252], [432, 276], [424, 288], [438, 284], [456, 266], [474, 250]].map((p) => rot(p as [number, number], sp0, 62 * swallow));
  const lift = -14 * swallow;
  const airP = sampleSmooth([[800, 200], [700, 170], [520, 170], [410, 190], [390, 300], [420, 400], [442, 470], [442, 560], [442, 690]]);
  const bolP = sampleSmooth([[640, 300], [500, 310], [400, 330], [372, 420], [370, 520], [370, 690]]);
  return (
    <svg width={w} height={(w * 700) / 900} viewBox="0 0 900 700" style={{ overflow: "visible" }}>
      {/* head & neck outline */}
      <path d="M130 690 L170 440 Q120 300 150 160 Q200 30 420 20 Q640 14 720 80 Q760 120 770 150 L835 205 Q840 222 800 230 L790 262 Q770 272 772 290 Q786 300 774 316 Q790 340 778 372 Q760 420 640 430 Q590 440 560 470 L540 690 Z" fill={RC.skin} stroke={RC.skinLine} strokeWidth={4} opacity={0.75} />
      {/* spine */}
      {Array.from({ length: 7 }).map((_, i) => <rect key={i} x={232} y={150 + i * 76} width={70} height={62} rx={14} fill={RC.bone} stroke={RC.boneLine} strokeWidth={3} />)}
      {/* nasal cavity */}
      {Pt("nasal", "M470 112 Q600 90 720 110 L800 200 L790 232 L470 236 Z", RC.mucosa, 3)}
      {[140, 172, 204].map((y, i) => <g key={y}><g.Halo id="conchae"><path d={`M${700 - i * 20} ${y - 10} Q${600} ${y - 22} ${520 + i * 6} ${y} Q600 ${y - 4} ${690 - i * 20} ${y + 2}`} strokeWidth={10} /></g.Halo><path d={`M${700 - i * 20} ${y - 10} Q${600} ${y - 22} ${520 + i * 6} ${y} Q600 ${y - 4} ${690 - i * 20} ${y + 2}`} fill="none" stroke={g.k("conchae") > 0.05 ? mix(RC.mucosaDark, C.red, g.k("conchae")) : RC.mucosaDark} strokeWidth={10} strokeLinecap="round" /></g>)}
      {/* hard palate */}
      {Pt("palate", "M470 232 L770 232 L768 246 L472 248 Z", RC.bone, 2.5)}
      {/* mouth + tongue */}
      <path d="M470 248 L770 248 Q780 290 760 300 L620 380 L480 400 Z" fill="#F7C9BE" stroke={C.forest} strokeWidth={2} opacity={0.6} />
      {Pt("tongue", "M440 350 Q450 280 540 266 Q680 254 740 290 Q690 330 600 370 Q520 410 460 420 Z", RC.tongue, 3)}
      {/* pharynx regions */}
      {Pt("naso", "M340 104 Q380 92 470 112 L470 236 L432 264 L340 264 Z", mix(RC.mucosa, "#FFFFFF", 0.15), 3)}
      {Pt("oro", "M340 264 L432 264 L452 352 L420 372 L340 372 Z", mix(RC.mucosa, RC.mid, 0.25), 3)}
      {Pt("laryngo", "M340 372 L420 372 L418 432 L404 476 L340 476 Z", mix(RC.mucosa, RC.inf, 0.3), 3)}
      {/* adenoid + palatine tonsil */}
      {Pt("adenoid", "M346 112 Q380 104 406 118 Q400 150 368 152 Q346 146 346 112 Z", "#D98AA8", 2.5)}
      {Pt("tonsil", "M424 286 Q440 280 446 300 Q444 322 428 322 Q418 304 424 286 Z", "#D98AA8", 2.5)}
      {/* soft palate */}
      {Pt("soft", smooth(soft as [number, number][], true), mix(RC.mucosa, RC.mucosaDark, 0.3), 2.5)}
      {/* esophagus behind larynx */}
      {Pt("esoph", "M340 476 L404 476 L398 690 L346 690 Z", "#E6B07A", 3)}
      {/* larynx + trachea (front) */}
      <g transform={`translate(0 ${lift})`}>
        {Pt("larynx", "M418 432 L478 444 L486 540 L420 546 Z", RC.cart, 3)}
        <path d="M424 488 L470 486" stroke={RC.mucosaDark} strokeWidth={5} strokeLinecap="round" />
        {Pt("trachea", "M420 546 L486 540 L480 700 L422 700 Z", RC.cart, 3)}
        {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M460 ${556 + i * 12} L484 ${555 + i * 12}`} stroke={RC.cartLine} strokeWidth={4} />)}
        {Pt("epiglottis", smooth(epi as [number, number][], true), "#F4E3A6", 3)}
      </g>
      <Dots pts={airP} t={t} k={air} n={8} speed={0.2} r={9} col={RC.air} />
      {bolus > 0 && (() => { const [x, y] = ptOn(bolP, Math.min(1, bolus)); return <circle cx={x} cy={y} r={20} fill={RC.food} stroke={C.forest} strokeWidth={3} />; })()}
    </svg>
  );
};

/* =====================================================================================
   4. NASAL CAVITY + SINUSES — front (coronal) schematic
   ===================================================================================== */
export const SI_PT: Record<string, [number, number]> = {
  frontal: [450, 120], ethmoid: [450, 250], maxillary: [610, 430], maxillaryR: [290, 430], sphenoid: [450, 330], septum: [450, 470], conchaS: [412, 356], conchaM: [410, 410], conchaI: [408, 478], meatus: [420, 505], nasal: [450, 540], orbit: [300, 250],
};
export const Sinuses: React.FC<{ t: number; w: number; lit?: Lit }> = ({ t, w, lit = {} }) => {
  const g = useGlow(t, lit, 1, { maxillaryR: "maxillary", frontalR: "frontal" });
  const Pt = mkPart(g);
  const air = "#DDF1F7";
  return (
    <svg width={w} height={(w * 700) / 900} viewBox="0 0 900 700" style={{ overflow: "visible" }}>
      <path d="M450 20 Q700 20 740 260 Q760 420 680 560 Q600 690 450 690 Q300 690 220 560 Q140 420 160 260 Q200 20 450 20 Z" fill={RC.bone} stroke={RC.boneLine} strokeWidth={5} />
      {/* orbits */}
      {[300, 600].map((x) => <ellipse key={x} cx={x} cy={250} rx={95} ry={82} fill="#3B4A2A" opacity={0.85} />)}
      {/* frontal sinuses */}
      {Pt("frontal", "M445 70 Q380 60 360 110 Q372 150 445 156 Z", air, 3)}
      {Pt("frontal", "M455 70 Q520 60 540 110 Q528 150 455 156 Z", air, 3)}
      {/* sphenoid (deep, behind) */}
      <g.Halo id="sphenoid"><ellipse cx={450} cy={318} rx={58} ry={34} strokeWidth={3} /></g.Halo>
      <ellipse cx={450} cy={318} rx={58} ry={34} {...g.F("sphenoid", "#E7DDF3")} stroke={C.forest} strokeWidth={2.5 + 1.5 * g.k("sphenoid")} strokeDasharray="10 7" />
      {/* ethmoid air cells */}
      {[[420, 210], [450, 196], [480, 210], [415, 245], [450, 236], [485, 245], [420, 280], [480, 280]].map(([x, y], i) => (
        <g key={i}><g.Halo id="ethmoid"><circle cx={x} cy={y} r={16} strokeWidth={2} /></g.Halo><circle cx={x} cy={y} r={16} {...g.F("ethmoid", air)} stroke={C.forest} strokeWidth={2 + g.k("ethmoid")} /></g>
      ))}
      {/* maxillary sinuses */}
      {Pt("maxillaryR", "M215 350 L370 345 L372 520 Q300 540 240 500 Q205 440 215 350 Z", air, 3)}
      {Pt("maxillary", "M685 350 L530 345 L528 520 Q600 540 660 500 Q695 440 685 350 Z", air, 3)}
      {/* nasal cavity */}
      {Pt("nasal", "M384 320 L516 320 L520 590 L380 590 Z", RC.mucosa, 3)}
      {Pt("septum", "M444 300 L456 300 L458 592 L442 592 Z", RC.cart, 2.5)}
      {/* conchae: superior, middle, inferior on each lateral wall */}
      {([["conchaS", 352, 26], ["conchaM", 412, 38], ["conchaI", 480, 46]] as [string, number, number][]).map(([id, y, l]) => (
        <g key={id}>
          {Pt(id, `M386 ${y - 14} Q${386 + l} ${y - 16} ${386 + l + 6} ${y + 6} Q${386 + l / 2} ${y + 22} 386 ${y + 12} Z`, RC.mucosaDark, 2.5)}
          {Pt(id, `M514 ${y - 14} Q${514 - l} ${y - 16} ${514 - l - 6} ${y + 6} Q${514 - l / 2} ${y + 22} 514 ${y + 12} Z`, RC.mucosaDark, 2.5)}
        </g>
      ))}
      {/* meatus = air channels under each concha */}
      {[374, 438, 512].map((y) => (
        <g key={y} opacity={g.k("meatus")}>
          <path d={`M392 ${y} Q410 ${y + 8} 430 ${y - 2}`} stroke={RC.airDark} strokeWidth={6} fill="none" strokeLinecap="round" />
          <path d={`M508 ${y} Q490 ${y + 8} 470 ${y - 2}`} stroke={RC.airDark} strokeWidth={6} fill="none" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
};

/* =====================================================================================
   5. NASAL SEPTUM — side view schematic (front to the right)
   ===================================================================================== */
export const SE_PT: Record<string, [number, number]> = { cart: [640, 270], perp: [400, 200], vomer: [420, 380], nasalbone: [670, 110] };
export const Septum: React.FC<{ t: number; w: number; lit?: Lit }> = ({ t, w, lit = {} }) => {
  const g = useGlow(t, lit, 1);
  const Pt = mkPart(g);
  return (
    <svg width={w} height={(w * 700) / 900} viewBox="0 0 900 700" style={{ overflow: "visible" }}>
      <path d="M160 520 L160 120 Q260 60 600 70 Q680 70 700 90 L820 380 Q830 410 790 420 L760 470 L160 520 Z" fill={RC.skin} stroke={RC.skinLine} strokeWidth={4} opacity={0.55} />
      {Pt("nasalbone", "M600 80 L700 92 L726 150 L640 140 Z", RC.bone, 3)}
      {Pt("perp", "M240 110 L600 80 L640 140 L520 330 L250 300 Z", RC.bone, 3)}
      {Pt("vomer", "M250 300 L520 330 L560 450 L240 470 Z", mix(RC.bone, RC.boneLine, 0.4), 3)}
      {Pt("cart", "M640 140 L726 150 L800 390 L720 430 L560 450 L520 330 Z", RC.cart, 3)}
      <path d="M200 476 L770 446" stroke={RC.boneLine} strokeWidth={14} strokeLinecap="round" />
    </svg>
  );
};

/* =====================================================================================
   6. LARYNX — front view schematic (viewBox 900 x 700)
   ===================================================================================== */
export const LX_PT: Record<string, [number, number]> = {
  hyoid: [600, 76], epiglottis: [450, 62], thyroid: [540, 230], prominence: [450, 168], cricoid: [520, 400], arytenoid: [412, 300], arytenoidR: [488, 300], corniculate: [412, 266], cuneiform: [376, 246], trachea: [450, 560], membrane: [450, 356],
};
export const LarynxFront: React.FC<{ t: number; w: number; lit?: Lit; xray?: number }> = ({ t, w, lit = {}, xray = 0 }) => {
  const g = useGlow(t, lit, 1, { arytenoidR: "arytenoid", corniculateR: "corniculate", cuneiformR: "cuneiform" });
  const Pt = mkPart(g);
  const thy = "M300 130 Q380 118 430 134 L450 166 L470 134 Q520 118 600 130 L586 300 Q520 322 450 346 Q380 322 314 300 Z";
  const hid = Math.max(xray, g.k("arytenoid"), g.k("corniculate"), g.k("cuneiform"));
  return (
    <svg width={w} height={(w * 700) / 900} viewBox="0 0 900 700" style={{ overflow: "visible" }}>
      {Pt("epiglottis", "M450 210 Q392 130 414 52 Q450 18 486 52 Q508 130 450 210 Z", "#F4E3A6", 3)}
      <path d="M290 84 Q450 124 610 84" fill="none" stroke={C.forest} strokeWidth={26} strokeLinecap="round" />
      <path d="M290 84 Q450 124 610 84" fill="none" stroke={g.F("hyoid", RC.bone).fill} strokeWidth={20} strokeLinecap="round" />
      <path d="M300 130 L292 90 M600 130 L608 90" stroke={C.forest} strokeWidth={3} />
      <path d="M318 300 L328 372 M582 300 L572 372" stroke={RC.cartLine} strokeWidth={14} strokeLinecap="round" />
      {Pt("thyroid", thy, RC.cart, 3.5)}
      <path d="M450 168 L450 340" stroke={RC.cartLine} strokeWidth={3} strokeDasharray="8 8" />
      <g.Halo id="prominence"><circle cx={450} cy={172} r={22} strokeWidth={3} /></g.Halo>
      <circle cx={450} cy={172} r={20} fill={mix("#FFFFFF", C.banana, g.k("prominence"))} opacity={0.6 + 0.4 * g.k("prominence")} stroke={RC.cartLine} strokeWidth={2} />
      {/* hidden small cartilages (behind the thyroid) — shown x-ray style */}
      <g opacity={0.25 + 0.75 * hid}>
        {([["arytenoid", 412], ["arytenoidR", 488]] as [string, number][]).map(([id, x]) => (
          <g key={id}>{Pt(id, `M${x - 26} 330 L${x} 262 L${x + 26} 330 Z`, "#E7DDF3", 2.5, { strokeDasharray: "7 5" })}</g>
        ))}
        {([["corniculate", 412], ["corniculateR", 488]] as [string, number][]).map(([id, x]) => <g key={id}>{Pt(id, `M${x - 9} 266 L${x} 244 L${x + 9} 266 Z`, "#BFD7EE", 2)}</g>)}
        {([["cuneiform", 376], ["cuneiformR", 524]] as [string, number][]).map(([id, x]) => <g key={id}>{Pt(id, `M${x - 7} 254 Q${x} 226 ${x + 7} 254 Z`, "#BFD7EE", 2)}</g>)}
      </g>
      {Pt("membrane", "M360 352 Q450 380 540 352 L546 374 Q450 400 354 374 Z", "#F7E7B4", 2)}
      {Pt("cricoid", "M350 376 Q450 404 550 376 L544 426 Q450 452 356 426 Z", RC.cart, 3.5)}
      {Pt("trachea", "M372 440 L528 440 L528 700 L372 700 Z", "#F7EBE4", 2)}
      {Array.from({ length: 9 }).map((_, i) => <g key={i}>{Pt("trachea", `M370 ${452 + i * 28} Q450 ${464 + i * 28} 530 ${452 + i * 28} L530 ${470 + i * 28} Q450 ${482 + i * 28} 370 ${470 + i * 28} Z`, RC.cart, 2)}</g>)}
    </svg>
  );
};

/* =====================================================================================
   7. GLOTTIS — looking down into the larynx (front at the top)
   ===================================================================================== */
export const GL_PT: Record<string, [number, number]> = { vocal: [418, 400], vestibular: [330, 360], glottis: [450, 430], thyroid: [600, 260], arytenoid: [380, 580], front: [450, 112] };
export const Glottis: React.FC<{ t: number; w: number; lit?: Lit; open?: number; vib?: number }> = ({ t, w, lit = {}, open = 0.6, vib = 0 }) => {
  const g = useGlow(t, lit, 1, { arytenoidR: "arytenoid" });
  const Pt = mkPart(g);
  const gap = 6 + 58 * open + vib * (4 + 10 * Math.abs(Math.sin(t * 44)));
  return (
    <svg width={w} height={(w * 700) / 900} viewBox="0 0 900 700" style={{ overflow: "visible" }}>
      <path d="M450 110 L200 560 Q450 690 700 560 Z" fill="#E8B3A8" stroke={C.forest} strokeWidth={3} />
      {Pt("thyroid", "M450 96 L180 560 L208 574 L450 140 L692 574 L720 560 Z", RC.cart, 3)}
      {Pt("vestibular", "M450 150 L250 548 L340 556 L446 196 Z", "#E58C83", 2.5)}
      {Pt("vestibular", "M450 150 L650 548 L560 556 L454 196 Z", "#E58C83", 2.5)}
      {/* rima / glottis gap */}
      {Pt("glottis", `M450 160 L${450 - gap} 548 Q450 ${560} ${450 + gap} 548 Z`, "#2A1E1A", 2)}
      {/* true vocal folds */}
      {Pt("vocal", `M448 158 L${450 - gap} 548 L${450 - gap - 70} 552 L440 170 Z`, "#FFF8F0", 2.5)}
      {Pt("vocal", `M452 158 L${450 + gap} 548 L${450 + gap + 70} 552 L460 170 Z`, "#FFF8F0", 2.5)}
      {/* arytenoids at the back */}
      {Pt("arytenoid", `M${450 - gap - 90} 560 L${450 - gap - 10} 548 L${450 - gap - 30} 620 L${450 - gap - 110} 616 Z`, "#E7DDF3", 3)}
      {Pt("arytenoidR", `M${450 + gap + 90} 560 L${450 + gap + 10} 548 L${450 + gap + 30} 620 L${450 + gap + 110} 616 Z`, "#E7DDF3", 3)}
      <path d="M210 610 Q450 690 690 610" fill="none" stroke={RC.cartLine} strokeWidth={16} strokeLinecap="round" />
    </svg>
  );
};

/* =====================================================================================
   8. CRICOID — side view: "signet ring" (wide at the back, narrow at the front)
   ===================================================================================== */
export const Signet: React.FC<{ t: number; w: number; k?: number }> = ({ t, w, k = 1 }) => (
  <svg width={w} height={(w * 700) / 900} viewBox="0 0 900 700" style={{ overflow: "visible" }}>
    <path d="M250 520 L250 700 M650 520 L650 700" stroke={RC.cartLine} strokeWidth={4} strokeDasharray="10 8" />
    <path d="M230 150 Q300 120 380 150 L400 430 Q520 452 680 448 L680 520 Q460 548 230 526 Z" fill={mix(RC.cart, C.banana, 0.25 * k)} stroke={C.forest} strokeWidth={4} />
    <path d="M380 150 L400 430" stroke={RC.cartLine} strokeWidth={3} />
    <ellipse cx={455} cy={490} rx={225} ry={40} fill="none" stroke={RC.cartLine} strokeWidth={3} strokeDasharray="8 7" />
    {/* ring icon */}
    <g transform={`translate(700 150) rotate(${Math.sin(t * 1.5) * 6})`} opacity={k}>
      <circle cx={0} cy={60} r={70} fill="none" stroke={C.bananaDark} strokeWidth={18} />
      <circle cx={0} cy={60} r={70} fill="none" stroke={C.banana} strokeWidth={10} />
      <rect x={-48} y={-36} width={96} height={56} rx={14} fill={C.banana} stroke={C.forest} strokeWidth={4} />
      <rect x={-30} y={-24} width={60} height={32} rx={8} fill={C.bananaDark} />
    </g>
  </svg>
);

/* =====================================================================================
   9. TRACHEA — cross-section (front at the top)
   ===================================================================================== */
export const TX_PT: Record<string, [number, number]> = { ring: [640, 250], trachealis: [450, 535], esoph: [450, 640], lumen: [450, 330], mucosa: [560, 420] };
export const TracheaX: React.FC<{ t: number; w: number; lit?: Lit }> = ({ t, w, lit = {} }) => {
  const g = useGlow(t, lit, 1);
  const Pt = mkPart(g);
  return (
    <svg width={w} height={(w * 700) / 900} viewBox="0 0 900 700" style={{ overflow: "visible" }}>
      {Pt("esoph", "M300 620 Q450 560 600 620 Q620 660 600 680 Q450 700 300 680 Q280 660 300 620 Z", "#E6B07A", 3)}
      <path d="M380 650 Q450 638 520 650" stroke={C.forest} strokeWidth={3} fill="none" opacity={0.6} />
      {Pt("mucosa", "M450 162 A168 168 0 1 1 449 162 Z", RC.mucosa, 2)}
      <circle cx={450} cy={330} r={138} fill="#FDF6EE" stroke={C.forest} strokeWidth={2} />
      {Pt("ring", "M340 520.5 A220 220 0 1 1 560 520.5 L537.5 481.6 A175 175 0 1 0 362.5 481.6 Z", RC.cart, 3.5)}
      {Pt("trachealis", "M336 512 Q450 566 564 512 L556 540 Q450 592 344 540 Z", RC.heart, 3)}
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${370 + i * 40} ${528 + Math.abs(2 - i) * -6} l14 10`} stroke="#F3B5A8" strokeWidth={3} />)}
    </svg>
  );
};

/* =====================================================================================
   10. BRONCHIAL TREE — trachea → carina → main → lobar → segmental → bronchioles
   ===================================================================================== */
export const BT_PT: Record<string, [number, number]> = {
  trachea: [450, 120], carina: [450, 262], rmain: [398, 318], lmain: [560, 300], lobarR: [262, 250], lobarRm: [262, 470], lobarRl: [330, 556], lobarL: [722, 268], lobarLl: [690, 540],
  segmental: [200, 210], bronchioles: [160, 520], terminal: [130, 470],
};
export const BronchTree: React.FC<{ t: number; w: number; lit?: Lit; drop?: number; angles?: number; air?: number }> = ({ t, w, lit = {}, drop = 0, angles = 0, air = 0 }) => {
  const g = useGlow(t, lit, 1, { lobarRm: "lobarR", lobarRl: "lobarR", lobarLl: "lobarL" });
  const lob: [string, string, number][] = [
    ["lobarR", "M396 318 Q330 280 268 252", 24], ["lobarRm", "M352 416 Q310 440 266 468", 22], ["lobarRl", "M352 416 Q342 480 334 556", 24],
    ["lobarL", "M640 345 Q680 306 720 270", 22], ["lobarLl", "M640 345 Q668 440 688 540", 24],
  ];
  const seg: [number, number, number][] = [[268, 252, -150], [268, 252, -100], [266, 468, 170], [266, 468, 130], [334, 556, 120], [334, 556, 80], [720, 270, -40], [720, 270, -80], [688, 540, 60], [688, 540, 100], [334, 556, 160]];
  const tree: { x1: number; y1: number; x2: number; y2: number; d: number }[] = [];
  seg.forEach(([x, y, a]) => branches(x, y, a, 62, 4, tree, 26));
  const sk = g.k("segmental"), bk = g.k("bronchioles"), tk = g.k("terminal");
  const fb = sampleSmooth([[450, 10], [450, 230], [412, 300], [372, 370], [352, 420], [340, 520]]);
  const airP = sampleSmooth([[450, 0], [450, 240], [560, 300], [640, 345], [668, 440], [688, 540]]);
  return (
    <svg width={w} height={(w * 700) / 900} viewBox="0 0 900 700" style={{ overflow: "visible" }}>
      {tree.map((b, i) => {
        const on = b.d === 0 ? sk : b.d === 3 ? Math.max(bk, tk) : bk;
        return <line key={i} x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2} stroke={on > 0.05 ? mix(RC.mucosaDark, C.red, on * 0.7) : RC.mucosaDark} strokeWidth={[14, 9, 6, 4][b.d] + on * 2} strokeLinecap="round" opacity={1 - g.any * (1 - on) * 0.55} />;
      })}
      {tree.filter((b) => b.d === 3).map((b, i) => <circle key={i} cx={b.x2} cy={b.y2} r={5 + tk * 5} fill={tk > 0.05 ? C.banana : "#F7D0C8"} stroke={RC.mucosaDark} strokeWidth={1.5} opacity={0.5 + 0.5 * Math.max(tk, 1 - g.any)} />)}
      {lob.map(([id, d, wd]) => (
        <g key={id}><g.Halo id={id}><path d={d} strokeWidth={wd} /></g.Halo><Tube d={d} w={wd} col={g.F(id, RC.cart).fill} op={g.F(id, RC.cart).opacity} /></g>
      ))}
      <g.Halo id="rmain"><path d="M440 250 Q420 300 352 416" strokeWidth={50} /></g.Halo>
      <Tube d="M440 250 Q420 300 352 416" w={50} col={g.F("rmain", RC.cart).fill} op={g.F("rmain", RC.cart).opacity} />
      <g.Halo id="lmain"><path d="M460 250 Q540 286 640 345" strokeWidth={38} /></g.Halo>
      <Tube d="M460 250 Q540 286 640 345" w={38} col={g.F("lmain", RC.cart).fill} op={g.F("lmain", RC.cart).opacity} />
      <g.Halo id="trachea"><path d="M450 0 L450 250" strokeWidth={66} /></g.Halo>
      <Tube d="M450 0 L450 250" w={66} col={g.F("trachea", RC.cart).fill} op={g.F("trachea", RC.cart).opacity} />
      {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M420 ${14 + i * 26} Q450 ${22 + i * 26} 480 ${14 + i * 26}`} stroke={RC.cartLine} strokeWidth={4} fill="none" />)}
      {[0, 1, 2].map((i) => <path key={"r" + i} d={`M${424 - i * 14} ${290 + i * 34} l38 18`} stroke={RC.cartLine} strokeWidth={4} />)}
      {[0, 1, 2, 3].map((i) => <path key={"l" + i} d={`M${500 + i * 34} ${262 + i * 20} l-10 30`} stroke={RC.cartLine} strokeWidth={4} />)}
      <g.Halo id="carina"><path d="M436 262 Q450 238 464 262" strokeWidth={8} /></g.Halo>
      <path d="M436 262 Q450 238 464 262" fill="none" stroke={g.k("carina") > 0.05 ? C.red : C.forest} strokeWidth={5 + 3 * g.k("carina")} strokeLinecap="round" />
      {angles > 0 && (
        <g opacity={angles}>
          <path d="M450 250 L450 470" stroke={C.forest} strokeWidth={3} strokeDasharray="10 8" />
          <path d="M450 380 Q420 378 392 360" stroke={C.red} strokeWidth={5} fill="none" />
          <path d="M450 330 Q500 336 540 290" stroke={RC.airDark} strokeWidth={5} fill="none" />
        </g>
      )}
      <Dots pts={airP} t={t} k={air} n={6} speed={0.25} r={8} col={RC.air} />
      {drop > 0 && (() => { const [x, y] = ptOn(fb, Math.min(1, drop)); return <g><circle cx={x} cy={y} r={14} fill={C.banana} stroke={C.forest} strokeWidth={3} /><circle cx={x - 4} cy={y - 4} r={4} fill="#FFFFFF" /></g>; })()}
    </svg>
  );
};

/* =====================================================================================
   11. LUNGS — front view with lobes and fissures (patient's right = viewer's left)
   ===================================================================================== */
const LR: [number, number][] = [[330, 72], [290, 60], [238, 92], [190, 172], [160, 282], [140, 400], [130, 520], [140, 612], [220, 586], [330, 562], [410, 576], [420, 470], [416, 300], [396, 180], [370, 112]];
const LL: [number, number][] = [[570, 82], [615, 68], [665, 100], [712, 180], [742, 290], [760, 410], [770, 530], [766, 636], [680, 616], [580, 632], [500, 614], [476, 562], [518, 514], [560, 454], [508, 402], [486, 330], [486, 250], [512, 160], [540, 108]];
export const LU_PT: Record<string, [number, number]> = {
  supR: [290, 230], midR: [340, 470], infR: [190, 520], supL: [600, 260], infL: [690, 540], hfis: [300, 380], ofisR: [232, 460], ofisL: [690, 490],
  notch: [548, 470], lingula: [492, 570], apexR: [292, 62], apexL: [614, 70], base: [300, 600], diaphragm: [450, 640], liver: [240, 670], heart: [470, 470], rib1: [180, 140], hilumR: [410, 330], hilumL: [492, 330],
};
export const LungsFront: React.FC<{ t: number; w: number; lit?: Lit; heart?: number; ribs?: number }> = ({ t, w, lit = {}, heart = 1, ribs = 0 }) => {
  const g = useGlow(t, lit, 1, { lungR: "lungs", lungL: "lungs" });
  const Pt = mkPart(g);
  const id = React.useId().replace(/:/g, "");
  const rr = smooth(LR, true), ll = smooth(LL, true);
  const lobe = (lid: string, p: [number, number][], col: string, clip: string) => (
    <g key={lid}>
      <path d={poly(p)} {...g.F(lid, col)} clipPath={`url(#${clip})`} />
    </g>
  );
  const fis = (fid: string, d: string) => (
    <g key={fid}>
      <g.Halo id={fid}><path d={d} strokeWidth={6} /></g.Halo>
      <path d={d} fill="none" stroke={C.forest} strokeWidth={4 + 3 * g.k(fid)} strokeLinecap="round" />
    </g>
  );
  return (
    <svg width={w} height={(w * 700) / 900} viewBox="0 0 900 700" style={{ overflow: "visible" }}>
      <defs>
        <clipPath id={`cr${id}`}><path d={rr} /></clipPath>
        <clipPath id={`cl${id}`}><path d={ll} /></clipPath>
      </defs>
      {Pt("liver", "M110 660 Q290 566 470 620 Q520 640 540 700 L110 700 Z", RC.liver, 2.5)}
      <g opacity={heart}>{Pt("heart", "M400 380 Q470 340 560 380 Q640 440 600 540 Q560 610 470 600 Q380 590 380 500 Q370 420 400 380 Z", RC.heart, 3)}</g>
      {Pt("diaphragm", "M100 652 Q290 556 460 612 Q630 590 800 666 L800 684 Q630 610 460 630 Q290 576 100 670 Z", RC.muscle, 2.5)}
      {/* right lung lobes */}
      <path d={rr} fill={RC.lung} />
      {lobe("supR", [[100, 0], [450, 0], [450, 380], [179, 380], [148, 330], [100, 250]], RC.supL, `cr${id}`)}
      {lobe("midR", [[179, 380], [450, 380], [450, 700], [318, 700], [300, 572]], RC.mid, `cr${id}`)}
      {lobe("infR", [[100, 250], [148, 330], [300, 572], [318, 700], [100, 700]], RC.inf, `cr${id}`)}
      {/* left lung lobes */}
      <path d={ll} fill={RC.lung} />
      {lobe("supL", [[450, 0], [800, 0], [800, 300], [752, 350], [590, 632], [575, 700], [450, 700]], RC.supL, `cl${id}`)}
      {lobe("infL", [[800, 300], [800, 700], [575, 700], [590, 632], [752, 350]], RC.inf, `cl${id}`)}
      {/* lingula hatch */}
      <g clipPath={`url(#cl${id})`} opacity={0.25 + 0.75 * g.k("lingula")}>
        {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M${440 + i * 12} 640 L${500 + i * 12} 520`} stroke={g.k("lingula") > 0.05 ? C.red : RC.mucosaDark} strokeWidth={3} />)}
      </g>
      {/* outlines */}
      <g.Halo id="lungR"><path d={rr} strokeWidth={4} /></g.Halo>
      <path d={rr} fill="none" stroke={C.forest} strokeWidth={4} />
      <g.Halo id="lungL"><path d={ll} strokeWidth={4} /></g.Halo>
      <path d={ll} fill="none" stroke={C.forest} strokeWidth={4} />
      {/* fissures */}
      {fis("hfis", "M412 380 L182 380")}
      {fis("ofisR", "M150 330 L302 570")}
      {fis("ofisL", "M752 350 L592 630")}
      {/* cardiac notch highlight */}
      <g.Halo id="notch"><path d="M508 402 L560 454 L518 514" strokeWidth={8} /></g.Halo>
      {/* apex markers */}
      {(["apexR", "apexL"] as const).map((a) => g.k(a) > 0.02 || g.k("apex") > 0.02 ? <circle key={a} cx={LU_PT[a][0]} cy={LU_PT[a][1] + 8} r={18} fill="none" stroke={C.banana} strokeWidth={8 * Math.max(g.k(a), g.k("apex"))} /> : null)}
      {/* first rib */}
      <g opacity={Math.max(ribs, g.k("rib1"))}>
        <path d="M120 170 Q260 92 420 128" fill="none" stroke={RC.boneLine} strokeWidth={18} strokeLinecap="round" />
        <path d="M120 170 Q260 92 420 128" fill="none" stroke={RC.bone} strokeWidth={11} strokeLinecap="round" />
        <path d="M780 176 Q640 98 482 132" fill="none" stroke={RC.boneLine} strokeWidth={18} strokeLinecap="round" />
        <path d="M780 176 Q640 98 482 132" fill="none" stroke={RC.bone} strokeWidth={11} strokeLinecap="round" />
      </g>
    </svg>
  );
};

/* =====================================================================================
   12. PLEURA — schematic: visceral on the lung, parietal on the wall, pleural cavity between
   ===================================================================================== */
export const PL_PT: Record<string, [number, number]> = { visc: [560, 300], pari: [150, 300], cavity: [168, 420], lung: [410, 340], wall: [70, 300], medi: [705, 360], diaph: [420, 640], cupula: [420, 52] };
export const Pleura: React.FC<{ t: number; w: number; lit?: Lit; breath?: number }> = ({ t, w, lit = {}, breath = 0 }) => {
  const g = useGlow(t, lit, 1);
  const Pt = mkPart(g);
  const b = breath * (0.5 + 0.5 * Math.sin(t * 1.6));
  const s = 1 + 0.035 * b;
  return (
    <svg width={w} height={(w * 700) / 900} viewBox="0 0 900 700" style={{ overflow: "visible" }}>
      {/* chest wall with ribs */}
      {Pt("wall", "M40 60 L120 40 L120 680 L40 680 Z", "#F1DCC8", 2.5)}
      {[90, 190, 290, 390, 490, 590].map((y) => <ellipse key={y} cx={82} cy={y} rx={30} ry={22} fill={RC.bone} stroke={RC.boneLine} strokeWidth={3} />)}
      {/* mediastinum */}
      {Pt("medi", "M712 40 L860 40 L860 680 L712 680 Z", "#F3E3D3", 2.5)}
      <path d="M786 300 Q840 360 800 460 Q760 520 740 430 Q730 340 786 300 Z" fill={RC.heart} opacity={0.5} />
      {/* diaphragm */}
      {Pt("diaph", "M120 680 L120 650 Q420 570 712 640 L712 680 Z", RC.muscle, 2.5)}
      {/* pleural cavity (fluid) */}
      {Pt("cavity", "M142 640 L142 120 Q420 20 690 110 L690 620 Q420 572 142 640 Z", RC.fluid, 2)}
      {/* parietal pleura line */}
      <g.Halo id="pari"><path d="M142 640 L142 120 Q420 20 690 110 L690 620 Q420 572 142 640 Z" strokeWidth={7} /></g.Halo>
      <path d="M142 640 L142 120 Q420 20 690 110 L690 620 Q420 572 142 640 Z" fill="none" stroke={RC.pari} strokeWidth={7 + 3 * g.k("pari")} />
      {/* lung with visceral pleura */}
      <g transform={`translate(${410 * (1 - s)} ${340 * (1 - s)}) scale(${s})`}>
        {Pt("lung", "M196 150 Q420 66 652 150 L662 560 Q420 520 196 590 Q164 360 196 150 Z", RC.lung, 2)}
        <g opacity={0.25}>{Array.from({ length: 30 }).map((_, i) => <circle key={i} cx={240 + (i * 97) % 380} cy={190 + ((i * 53) % 340)} r={12} fill="none" stroke={RC.mucosaDark} strokeWidth={2} />)}</g>
        <g.Halo id="visc"><path d="M196 150 Q420 66 652 150 L662 560 Q420 520 196 590 Q164 360 196 150 Z" strokeWidth={7} /></g.Halo>
        <path d="M196 150 Q420 66 652 150 L662 560 Q420 520 196 590 Q164 360 196 150 Z" fill="none" stroke={RC.visc} strokeWidth={7 + 3 * g.k("visc")} />
      </g>
    </svg>
  );
};

/* =====================================================================================
   13. ACINUS — terminal bronchiole → respiratory bronchiole → alveolar ducts → alveolar sacs
   ===================================================================================== */
export const AC_PT: Record<string, [number, number]> = { terminal: [150, 150], respb: [330, 278], duct: [500, 330], sacs: [690, 240], sacs2: [660, 530], cap: [700, 560] };
const cluster = (cx: number, cy: number): [number, number, number][] => [[0, 0, 46], [-62, -30, 40], [-10, -74, 40], [58, -46, 42], [70, 22, 40], [20, 70, 42], [-54, 46, 40], [-96, 8, 32]].map(([x, y, r]) => [cx + x, cy + y, r]);
export const Acinus: React.FC<{ t: number; w: number; lit?: Lit; air?: number; cap?: number }> = ({ t, w, lit = {}, air = 0, cap = 0 }) => {
  const g = useGlow(t, lit, 1, { sacs2: "sacs" });
  const c1 = cluster(690, 240), c2 = cluster(660, 520);
  const airP = sampleSmooth([[40, 60], [250, 220], [420, 330], [540, 300], [640, 250]]);
  const airP2 = sampleSmooth([[40, 60], [250, 220], [420, 330], [530, 460], [630, 520]]);
  const sac = (c: [number, number, number][], id: string) => (
    <g>
      {c.map(([x, y, r], i) => <g key={i}><g.Halo id={id}><circle cx={x} cy={y} r={r} strokeWidth={3} /></g.Halo><circle cx={x} cy={y} r={r} {...g.F(id, "#F9D9D0")} stroke={C.forest} strokeWidth={3 + 1.5 * g.k(id)} /></g>)}
    </g>
  );
  return (
    <svg width={w} height={(w * 700) / 900} viewBox="0 0 900 700" style={{ overflow: "visible" }}>
      <g.Halo id="terminal"><path d="M40 60 L250 220" strokeWidth={46} /></g.Halo>
      <Tube d="M40 60 L250 220" w={46} col={g.F("terminal", RC.mucosa).fill} op={g.F("terminal", RC.mucosa).opacity} />
      <g.Halo id="respb"><path d="M250 220 L420 330" strokeWidth={36} /></g.Halo>
      <Tube d="M250 220 L420 330" w={36} col={g.F("respb", "#F7C2B6").fill} op={g.F("respb", RC.mucosa).opacity} />
      {[[300, 228], [355, 300], [395, 290]].map(([x, y], i) => <g key={i}><g.Halo id="respb"><circle cx={x} cy={y} r={20} strokeWidth={3} /></g.Halo><circle cx={x} cy={y} r={20} {...g.F("respb", "#F9D9D0")} stroke={C.forest} strokeWidth={3} /></g>)}
      {["M420 330 L560 290", "M420 330 L560 470"].map((d) => <g key={d}><g.Halo id="duct"><path d={d} strokeWidth={30} /></g.Halo><Tube d={d} w={30} col={g.F("duct", "#F9D0C4").fill} op={g.F("duct", RC.mucosa).opacity} /></g>)}
      {sac(c1, "sacs")}
      {sac(c2, "sacs2")}
      {/* capillary net over the lower sac */}
      <g opacity={cap}>
        {c2.map(([x, y, r], i) => <path key={i} d={`M${x - r} ${y} Q${x} ${y - r * 1.2} ${x + r} ${y} Q${x} ${y + r * 1.2} ${x - r} ${y}`} fill="none" stroke={i % 2 ? RC.o2 : RC.co2} strokeWidth={4} opacity={0.9} />)}
      </g>
      <Dots pts={airP} t={t} k={air} n={6} speed={0.22} r={8} col={RC.air} />
      <Dots pts={airP2} t={t + 1.3} k={air} n={6} speed={0.22} r={8} col={RC.air} />
    </svg>
  );
};

/* =====================================================================================
   14. ALVEOLUS — one alveolus: type I, type II + surfactant, macrophage, capillary, gas exchange
   ===================================================================================== */
export const AL_PT: Record<string, [number, number]> = { type1: [190, 160], type2: [196, 470], surf: [300, 560], macro: [360, 380], cap: [760, 200], membrane: [640, 340], lumen: [400, 300] };
export const Alveolus: React.FC<{ t: number; w: number; lit?: Lit; gas?: number; eat?: number; surf?: number }> = ({ t, w, lit = {}, gas = 0, eat = 0, surf = 0 }) => {
  const g = useGlow(t, lit, 1);
  const Pt = mkPart(g);
  const cx = 400, cy = 340, R = 232;
  const arcPt = (a: number, r = R): [number, number] => [cx + Math.cos((a * Math.PI) / 180) * r, cy + Math.sin((a * Math.PI) / 180) * r];
  const t2 = [135, 250, 60];
  const sk = Math.max(surf, g.k("surf"));
  const mx = 330 + 60 * eat + Math.sin(t * 1.2) * 10, my = 400 - 30 * eat;
  const dust: [number, number][] = [[400, 360], [440, 330], [420, 300]];
  return (
    <svg width={w} height={(w * 700) / 900} viewBox="0 0 900 700" style={{ overflow: "visible" }}>
      {/* capillary */}
      {Pt("cap", "M640 0 Q700 340 640 700 L760 700 Q830 340 760 0 Z", "#F1B7B0", 3)}
      {Array.from({ length: 7 }).map((_, i) => {
        const u = ((t * 0.08 + i / 7) % 1);
        const y = u * 700, x = 700 + Math.sin(u * Math.PI) * 30 - 8;
        return <ellipse key={i} cx={x} cy={y} rx={22} ry={12} fill={mix("#7C4A8A", RC.o2, Math.min(1, u * 1.6) * gas + (1 - gas) * 0.3)} stroke={C.forest} strokeWidth={2} />;
      })}
      {/* alveolar wall: type I cells (thin, flat) */}
      <g.Halo id="type1"><circle cx={cx} cy={cy} r={R} strokeWidth={14} /></g.Halo>
      <circle cx={cx} cy={cy} r={R} fill="#FFF7F2" stroke={g.F("type1", "#F4C5B8").fill} strokeWidth={14} />
      <circle cx={cx} cy={cy} r={R + 7} fill="none" stroke={C.forest} strokeWidth={2} />
      <circle cx={cx} cy={cy} r={R - 7} fill="none" stroke={C.forest} strokeWidth={2} />
      {[20, 95, 170, 210, 300, 335].map((a) => { const [x, y] = arcPt(a); return <ellipse key={a} cx={x} cy={y} rx={16} ry={5} transform={`rotate(${a + 90} ${x} ${y})`} fill={RC.nucleus} />; })}
      {/* surfactant film */}
      <circle cx={cx} cy={cy} r={R - 13} fill="none" stroke={C.banana} strokeWidth={8 * sk} opacity={sk} strokeDasharray="22 6" />
      {/* type II cells (cuboidal, with lamellar bodies) */}
      {t2.map((a) => {
        const [x, y] = arcPt(a, R - 30);
        return (
          <g key={a} transform={`rotate(${a + 90} ${x} ${y})`}>
            {Pt("type2", `M${x - 40} ${y - 26} Q${x} ${y - 44} ${x + 40} ${y - 26} L${x + 38} ${y + 30} L${x - 38} ${y + 30} Z`, "#F7E3A8", 2.5)}
            {[-18, 0, 18].map((d) => <circle key={d} cx={x + d} cy={y - 8} r={7} fill="#FFF6C8" stroke="#C8B860" strokeWidth={2} />)}
            <ellipse cx={x} cy={y + 14} rx={13} ry={10} fill={RC.nucleus} />
          </g>
        );
      })}
      {/* dust + macrophage */}
      {dust.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={9} fill="#7A6A4A" opacity={1 - ramp(eat, i * 0.25, i * 0.25 + 0.3)} />)}
      <g.Halo id="macro"><path d={`M${mx - 60} ${my} Q${mx - 50} ${my - 50} ${mx} ${my - 46} Q${mx + 60} ${my - 40} ${mx + 58} ${my + 4} Q${mx + 54} ${my + 52} ${mx} ${my + 50} Q${mx - 62} ${my + 46} ${mx - 60} ${my} Z`} strokeWidth={3} /></g.Halo>
      <path d={`M${mx - 60} ${my} Q${mx - 50} ${my - 50} ${mx} ${my - 46} Q${mx + 60} ${my - 40} ${mx + 58} ${my + 4} Q${mx + 54} ${my + 52} ${mx} ${my + 50} Q${mx - 62} ${my + 46} ${mx - 60} ${my} Z`} {...g.F("macro", "#B8D7A8")} {...g.S("macro", 3)} />
      <ellipse cx={mx - 6} cy={my + 6} rx={18} ry={14} fill={RC.nucleus} />
      {/* respiratory membrane + gas arrows */}
      <g.Halo id="membrane"><path d="M632 280 L632 400" strokeWidth={14} /></g.Halo>
      <g opacity={gas}>
        {[0, 1, 2].map((i) => {
          const u = (t * 0.6 + i / 3) % 1;
          return (
            <g key={i}>
              <g transform={`translate(${520 + u * 200} ${240 + i * 40})`} opacity={Math.min(1, u * 5, (1 - u) * 5)}>
                <circle r={17} fill={RC.o2} stroke={C.forest} strokeWidth={2} /><text x={0} y={7} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={18} fill="#FFFFFF">O₂</text>
              </g>
              <g transform={`translate(${720 - u * 200} ${400 + i * 40})`} opacity={Math.min(1, u * 5, (1 - u) * 5)}>
                <circle r={19} fill={RC.co2} stroke={C.forest} strokeWidth={2} /><text x={0} y={7} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={16} fill="#FFFFFF">CO₂</text>
              </g>
            </g>
          );
        })}
      </g>
    </svg>
  );
};

/* =====================================================================================
   15. BREATHING — diaphragm + ribs (front view). p: 0 = breathed out, 1 = breathed in
   ===================================================================================== */
export const BR_PT: Record<string, [number, number]> = { diaphragm: [450, 560], intercostals: [214, 330], ribs: [690, 260], lungs: [330, 330], trachea: [450, 40] };
export const Breath: React.FC<{ t: number; w: number; lit?: Lit; p: number; flow?: number }> = ({ t, w, lit = {}, p, flow = 0 }) => {
  const g = useGlow(t, lit, 1, { lungsL: "lungs" });
  const Pt = mkPart(g);
  const ribsY = [130, 200, 270, 340, 410, 470];
  const dy = 470 + 90 * p; // diaphragm dome height: low = flatter
  const lS = 1 + 0.09 * p;
  const ik = g.k("intercostals");
  return (
    <svg width={w} height={(w * 700) / 900} viewBox="0 0 900 700" style={{ overflow: "visible" }}>
      <Tube d="M450 0 L450 150" w={36} col={RC.cart} />
      {/* lungs */}
      <g transform={`translate(${450 * (1 - lS)} ${330 * (1 - lS)}) scale(${lS})`}>
        {Pt("lungs", "M430 160 Q330 110 240 200 Q170 320 190 500 Q300 520 430 520 Z", RC.lung, 3)}
        {Pt("lungsL", "M470 160 Q570 110 660 200 Q730 320 710 500 Q600 520 470 520 Z", RC.lung, 3)}
      </g>
      {/* ribs: lateral ends lift and move out on inspiration */}
      {ribsY.map((y, i) => {
        const out = 18 * p, up = 16 * p;
        const dL = `M450 ${y} Q${300 - out} ${y - 30 - up} ${150 - out + i * 6} ${y + 50 - up}`;
        const dR = `M450 ${y} Q${600 + out} ${y - 30 - up} ${750 + out - i * 6} ${y + 50 - up}`;
        return (
          <g key={y}>
            <g.Halo id="ribs"><path d={dL + " " + dR} strokeWidth={14} /></g.Halo>
            <path d={dL} fill="none" stroke={RC.boneLine} strokeWidth={16} strokeLinecap="round" />
            <path d={dL} fill="none" stroke={RC.bone} strokeWidth={10} strokeLinecap="round" />
            <path d={dR} fill="none" stroke={RC.boneLine} strokeWidth={16} strokeLinecap="round" />
            <path d={dR} fill="none" stroke={RC.bone} strokeWidth={10} strokeLinecap="round" />
            {i < ribsY.length - 1 && ik > 0.02 && (
              <g opacity={ik}>
                {[0, 1, 2, 3].map((j) => <path key={j} d={`M${200 + j * 26 - out} ${y + 52 - up + j * -4} l18 -24`} stroke={C.red} strokeWidth={5} strokeLinecap="round" />)}
                {[0, 1, 2, 3].map((j) => <path key={"r" + j} d={`M${700 - j * 26 + out} ${y + 52 - up + j * -4} l-18 -24`} stroke={C.red} strokeWidth={5} strokeLinecap="round" />)}
              </g>
            )}
          </g>
        );
      })}
      <rect x={430} y={110} width={40} height={360} rx={14} fill={RC.bone} stroke={RC.boneLine} strokeWidth={3} />
      {/* diaphragm */}
      {Pt("diaphragm", `M130 600 Q290 ${dy - 120} 450 ${dy - 30} Q610 ${dy - 110} 770 600 L770 622 Q610 ${dy - 86} 450 ${dy - 8} Q290 ${dy - 96} 130 622 Z`, RC.muscle, 3)}
      {/* air arrows in / out of the trachea */}
      {flow !== 0 && [0, 1, 2].map((i) => {
        const u = ((t * 0.9 + i / 3) % 1);
        const y = flow > 0 ? -40 + u * 170 : 130 - u * 170;
        return <path key={i} d={flow > 0 ? `M450 ${y} l-14 -18 h28 Z` : `M450 ${y} l-14 18 h28 Z`} fill={RC.air} stroke={C.forest} strokeWidth={2} opacity={Math.min(1, u * 5, (1 - u) * 5)} />;
      })}
    </svg>
  );
};

/* =====================================================================================
   16. PHRENIC NERVE — C3, C4, C5 → diaphragm
   ===================================================================================== */
export const PN_PT: Record<string, [number, number]> = { c3: [210, 196], c4: [210, 262], c5: [210, 328], phrenic: [395, 420], diaphragm: [560, 610] };
export const Phrenic: React.FC<{ t: number; w: number; lit?: Lit; signal?: number }> = ({ t, w, lit = {}, signal = 0 }) => {
  const g = useGlow(t, lit, 1, { c3: "roots", c4: "roots", c5: "roots" });
  const Pt = mkPart(g);
  const names = ["C1", "C2", "C3", "C4", "C5", "C6", "C7"];
  const nerve = sampleSmooth([[330, 262], [370, 330], [390, 430], [430, 520], [520, 580]]);
  return (
    <svg width={w} height={(w * 700) / 900} viewBox="0 0 900 700" style={{ overflow: "visible" }}>
      {names.map((n, i) => {
        const y = 40 + i * 66, id = n.toLowerCase();
        const on = g.k(id);
        return (
          <g key={n}>
            <rect x={160} y={y} width={100} height={54} rx={14} fill={mix(RC.bone, C.banana, on * 0.8)} stroke={RC.boneLine} strokeWidth={3} />
            <text x={210} y={y + 37} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={C.forest}>{n}</text>
            <path d={`M260 ${y + 30} L${300 + (i >= 2 && i <= 4 ? 0 : 20)} ${y + 34}`} stroke={i >= 2 && i <= 4 ? mix(RC.nerve, C.red, on * 0.3) : "#D9CFA8"} strokeWidth={i >= 2 && i <= 4 ? 8 + 4 * on : 6} strokeLinecap="round" />
          </g>
        );
      })}
      {/* roots join */}
      {[0, 1, 2].map((i) => <path key={i} d={`M300 ${206 + i * 66} Q320 ${236 + i * 30} 330 262`} fill="none" stroke={RC.nerve} strokeWidth={8} strokeLinecap="round" />)}
      <g.Halo id="phrenic"><path d={smooth([[330, 262], [370, 330], [390, 430], [430, 520], [520, 580]])} strokeWidth={10} /></g.Halo>
      <path d={smooth([[330, 262], [370, 330], [390, 430], [430, 520], [520, 580]])} fill="none" stroke={C.forest} strokeWidth={14} strokeLinecap="round" />
      <path d={smooth([[330, 262], [370, 330], [390, 430], [430, 520], [520, 580]])} fill="none" stroke={RC.nerve} strokeWidth={9} strokeLinecap="round" />
      {Pt("diaphragm", "M120 680 Q330 560 560 590 Q740 600 860 690 L860 700 L120 700 Z", RC.muscle, 3)}
      {signal > 0 && [0, 1].map((i) => { const [x, y] = ptOn(nerve, ((t * 0.5 + i / 2) % 1)); return <circle key={i} cx={x} cy={y} r={12} fill={C.banana} stroke={C.forest} strokeWidth={3} opacity={signal} />; })}
    </svg>
  );
};
