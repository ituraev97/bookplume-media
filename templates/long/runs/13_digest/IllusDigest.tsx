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
export const mkPart = (g: G) => (id: string, d: string, col: string, sw = 3, extra: React.SVGProps<SVGPathElement> = {}) => (
  <g key={id + d.slice(0, 12)}>
    <g.Halo id={id}><path d={d} strokeWidth={sw} /></g.Halo>
    <path d={d} {...g.F(id, col)} {...g.S(id, sw)} {...extra} />
  </g>
);
export const poly = (p: [number, number][]) => "M" + p.map((q) => `${q[0]} ${q[1]}`).join(" L") + " Z";
export const rot = (p: [number, number], c: [number, number], deg: number): [number, number] => {
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


/* ---------- digestive colours ---------- */
export const DC = {
  skin: "#F6DCC6", skinLine: "#D9B094", tract: "#F2B4A2", tractDark: "#C9715C", stomach: "#EFA08C", liver: "#A7573C", liverLight: "#C27556",
  gall: "#7FA650", bile: "#8CB83E", pancreas: "#F1CF82", pancDark: "#C9A24A", small: "#F4C0A8", colon: "#D9A27A", colonDark: "#A86F48",
  spleen: "#A9708F", muscle: "#C9604A", muscleLight: "#E89A84", food: "#E9A23B", juice: "#9FD4E8", acid: "#E0574A", fat: "#F7E07A",
  mucosa: "#F3A9A0", sub: "#F7DCC4", muscC: "#D9735F", muscL: "#B8553F", serosa: "#E9EEF0", vessel: "#C9483C", vein: "#3F78B8", nerve: "#E9C42E",
  smooth: "#E7A08E", skeletal: "#B5473A", tooth: "#FFFDF4", tongue: "#E58C83", gland: "#F0C48A", parietal: "#B07ACF", chief: "#6FA8DC", mucus: "#EDE39A",
};
/* glow with multi-group membership: groups[id] = list of group keys that also light this part */
export const useGlow2 = (t: number, lit: Lit, dim: number, groups: Record<string, string[]> = {}) => {
  const any = Math.max(0, ...Object.values(lit).map((v) => litK(t, v))) * dim;
  const k = (id: string) => Math.max(litK(t, lit[id]), ...(groups[id] || []).map((gk) => litK(t, lit[gk])));
  const F = (id: string, col: string) => {
    const kk = k(id);
    return { fill: mix(mix(col, "#FFFFFF", any * (1 - kk) * 0.5), "#FFF2A0", kk * 0.22), opacity: 1 - any * (1 - kk) * 0.3 };
  };
  const S = (id: string, w = 2.5) => ({ stroke: C.forest, strokeWidth: w + 1.5 * k(id) });
  const Halo: React.FC<{ id: string; children: React.ReactElement<any> }> = ({ id, children }) => {
    const kk = k(id);
    if (kk <= 0) return null;
    return React.cloneElement(children, { fill: "none", stroke: C.banana, strokeWidth: (children.props.strokeWidth || 0) + 18 * kk, strokeOpacity: 0.95 * kk, strokeLinejoin: "round", strokeLinecap: "round" });
  };
  return { any, k, F, S, Halo };
};
type G2 = ReturnType<typeof useGlow2>;
const part = (g: G2) => (id: string, d: string, col: string, sw = 3, extra: React.SVGProps<SVGPathElement> = {}) => (
  <g key={id + d.slice(0, 14)}>
    <g.Halo id={id}><path d={d} strokeWidth={sw} /></g.Halo>
    <path d={d} {...g.F(id, col)} {...g.S(id, sw)} {...extra} />
  </g>
);
/* lit tube: halo + outline + fill */
const tube = (g: G2) => (id: string, d: string, w: number, col: string) => (
  <g key={id + d.slice(0, 14)}>
    <g.Halo id={id}><path d={d} strokeWidth={w + 6} /></g.Halo>
    <path d={d} fill="none" stroke={C.forest} strokeWidth={w + 6 + 1.5 * g.k(id)} strokeLinecap="round" strokeLinejoin="round" opacity={g.F(id, col).opacity} />
    <path d={d} fill="none" stroke={g.F(id, col).fill} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" opacity={g.F(id, col).opacity} />
  </g>
);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

/* =====================================================================================
   1. GI TRACT MAP — front view schematic (viewBox 900 x 1000). Patient's right = viewer's left.
   ===================================================================================== */
const TRACT = ["mouth", "pharynx", "esoph", "stomach", "duod", "jejunum", "ileum", "cecum", "ascending", "transverse", "descending", "sigmoid", "rectum", "anus"];
const ACC = ["teeth", "tongue", "parotid", "submand", "subling", "liver", "gall", "pancreas"];
const GI_GROUPS: Record<string, string[]> = {};
TRACT.forEach((id) => (GI_GROUPS[id] = ["tract"]));
ACC.forEach((id) => (GI_GROUPS[id] = ["acc"]));
["parotid", "submand", "subling"].forEach((id) => GI_GROUPS[id].push("saliv"));
["duod", "jejunum", "ileum"].forEach((id) => GI_GROUPS[id].push("small"));
["cecum", "appendix", "ascending", "transverse", "descending", "sigmoid", "rectum", "anus"].forEach((id) => (GI_GROUPS[id] = [...(GI_GROUPS[id] || []), "large"]));
["ascending", "transverse", "descending", "sigmoid"].forEach((id) => GI_GROUPS[id].push("colon"));
GI_GROUPS.hflex = ["ascending"]; GI_GROUPS.sflex = ["descending"];
GI_GROUPS.pylorus = ["stomach"];

export const GI_PT: Record<string, [number, number]> = {
  mouth: [450, 166], teeth: [450, 158], tongue: [450, 170], parotid: [376, 128], submand: [402, 196], subling: [433, 180], pharynx: [450, 210],
  esoph: [453, 360], diaphragm: [600, 432], liver: [330, 520], gall: [364, 590], stomach: [585, 545], fundus: [575, 470], pylorus: [460, 640],
  duod: [400, 700], pancreas: [575, 668], spleen: [672, 520], jejunum: [570, 815], ileum: [380, 875], cecum: [288, 884], appendix: [292, 938],
  ascending: [284, 760], hflex: [292, 640], transverse: [450, 790], sflex: [664, 628], descending: [674, 760], sigmoid: [600, 900], rectum: [452, 950], anus: [452, 990],
  papilla: [398, 698], djflex: [522, 720],
};
const P_ESO: [number, number][] = [[450, 236], [451, 300], [454, 380], [462, 440], [492, 486]];
const P_DUO: [number, number][] = [[452, 642], [420, 648], [400, 674], [399, 716], [418, 744], [458, 750], [498, 740], [522, 720]];
const P_JEJ: [number, number][] = [[522, 720], [546, 762], [604, 790], [606, 826], [552, 820], [500, 800], [468, 824], [522, 846], [592, 852], [602, 882], [540, 888]];
const P_ILE: [number, number][] = [[540, 888], [480, 872], [440, 852], [396, 832], [350, 842], [344, 874], [392, 892], [432, 910], [380, 920], [330, 900], [304, 880]];
const P_ASC: [number, number][] = [[288, 862], [284, 780], [284, 700], [292, 646]];
const P_TRA: [number, number][] = [[292, 646], [320, 650], [370, 712], [450, 784], [540, 744], [610, 670], [664, 626]];
const P_DES: [number, number][] = [[664, 626], [676, 680], [676, 780], [674, 858]];
const P_SIG: [number, number][] = [[674, 858], [660, 900], [616, 912], [570, 886], [528, 900], [490, 926], [456, 934]];
const P_REC: [number, number][] = [[456, 934], [452, 952], [452, 978]];
/* the food path (bolus) through the whole tract */
const FOOD: [number, number][] = [[450, 166], [450, 205], ...P_ESO, [540, 520], [570, 580], [530, 628], ...P_DUO, ...P_JEJ.slice(1), ...P_ILE.slice(1), [290, 884], ...P_ASC, ...P_TRA.slice(1), ...P_DES.slice(1), ...P_SIG.slice(1), ...P_REC.slice(1), [452, 992]];
const FOOD_S = sampleSmooth(FOOD, 8);
/* fraction of FOOD_S where each organ starts (for "food at organ X") */
export const foodAt = (pt: [number, number]) => {
  let best = 0, bd = 1e9;
  FOOD_S.forEach((p, i) => { const d = (p[0] - pt[0]) ** 2 + (p[1] - pt[1]) ** 2; if (d < bd) { bd = d; best = i; } });
  return best / (FOOD_S.length - 1);
};
export const GITract: React.FC<{ t: number; w: number; lit?: Lit; dim?: number; food?: number; body?: number; trail?: number }> = ({ t, w, lit = {}, dim = 1, food = -1, body = 1, trail = 0 }) => {
  const g = useGlow2(t, lit, dim, GI_GROUPS);
  const Pt = part(g), Tb = tube(g);
  const fp = food >= 0 ? ptOn(FOOD_S, food) : null;
  const trailPts = food > 0 && trail > 0 ? FOOD_S.slice(Math.max(0, Math.floor((food - trail) * (FOOD_S.length - 1))), Math.floor(food * (FOOD_S.length - 1)) + 1) : [];
  return (
    <svg width={w} height={(w * 1000) / 900} viewBox="0 0 900 1000" style={{ overflow: "visible" }}>
      {/* body silhouette */}
      <g opacity={body}>
        <path d="M410 196 L410 290 Q300 300 236 332 Q214 420 222 560 Q230 660 246 740 Q216 840 222 940 Q330 1000 450 1000 Q570 1000 678 940 Q684 840 654 740 Q670 660 678 560 Q686 420 664 332 Q600 300 490 290 L490 196 Z" fill={DC.skin} stroke={DC.skinLine} strokeWidth={3} opacity={0.55} />
        <ellipse cx={450} cy={104} rx={88} ry={100} fill={DC.skin} stroke={DC.skinLine} strokeWidth={3} />
        <ellipse cx={362} cy={112} rx={12} ry={24} fill={DC.skin} stroke={DC.skinLine} strokeWidth={3} />
        <ellipse cx={538} cy={112} rx={12} ry={24} fill={DC.skin} stroke={DC.skinLine} strokeWidth={3} />
        <path d="M420 92 q12 -8 24 0 M456 92 q12 -8 24 0" fill="none" stroke={DC.skinLine} strokeWidth={4} strokeLinecap="round" />
        <path d="M450 104 l-8 26 l14 0" fill="none" stroke={DC.skinLine} strokeWidth={3} strokeLinejoin="round" />
      </g>
      {/* salivary glands (both sides) */}
      {[[376, 128], [524, 128]].map(([x, y]) => <g key={"p" + x}>{Pt("parotid", smooth([[x - 16, y - 26], [x + 12, y - 22], [x + 18, y + 4], [x + 8, y + 30], [x - 14, y + 26], [x - 20, y]], true), DC.gland, 2.5)}</g>)}
      {[[402, 196], [498, 196]].map(([x, y]) => <g key={"s" + x}>{Pt("submand", smooth([[x - 18, y - 8], [x, y - 14], [x + 18, y - 6], [x + 14, y + 10], [x - 12, y + 12]], true), DC.gland, 2.5)}</g>)}
      {[[433, 182], [467, 182]].map(([x, y]) => <g key={"l" + x}>{Pt("subling", smooth([[x - 12, y - 4], [x, y - 7], [x + 12, y - 3], [x + 8, y + 5], [x - 8, y + 5]], true), DC.gland, 2)}</g>)}
      <path d="M392 132 Q412 150 424 160 M508 132 Q488 150 476 160" fill="none" stroke={DC.pancDark} strokeWidth={2.5} strokeDasharray="5 4" opacity={g.k("parotid") > 0 ? 1 : 0.5} />
      {/* mouth */}
      {Pt("mouth", "M418 160 Q450 146 482 160 Q450 184 418 160 Z", "#B4473B", 2.5)}
      {Pt("tongue", "M430 166 Q450 160 470 166 Q450 178 430 166 Z", DC.tongue, 1.5)}
      {Pt("teeth", "M426 157 L474 157 L472 162 L428 162 Z", DC.tooth, 1.5)}
      {/* pharynx + esophagus */}
      {Tb("pharynx", "M450 172 L450 238", 24, DC.tract)}
      {Tb("esoph", smooth(P_ESO), 16, DC.tract)}
      {/* diaphragm */}
      <g.Halo id="diaphragm"><path d="M236 456 Q340 414 450 444 Q560 410 664 456" strokeWidth={9} /></g.Halo>
      <path d="M236 456 Q340 414 450 444 Q560 410 664 456" fill="none" stroke={g.F("diaphragm", DC.muscle).fill} strokeWidth={9} strokeLinecap="round" opacity={0.85} />
      {/* spleen */}
      {Pt("spleen", smooth([[656, 482], [684, 488], [694, 530], [680, 566], [660, 556], [664, 520]], true), DC.spleen, 2.5)}
      {/* small intestine (behind colon) */}
      {Tb("jejunum", smooth(P_JEJ), 20, DC.small)}
      {Tb("ileum", smooth(P_ILE), 18, DC.small)}
      {/* pancreas + duodenum */}
      {Pt("pancreas", smooth([[418, 694], [436, 676], [500, 672], [560, 656], [622, 640], [652, 630], [658, 650], [624, 668], [560, 688], [500, 702], [452, 716], [426, 714]], true), DC.pancreas, 2.5)}
      {Tb("duod", smooth(P_DUO), 22, DC.small)}
      {/* liver + gallbladder */}
      {Pt("liver", smooth([[232, 470], [320, 450], [420, 454], [502, 466], [548, 488], [506, 520], [424, 550], [340, 584], [280, 604], [244, 588], [226, 530]], true), DC.liver, 3)}
      <path d="M418 458 Q412 500 404 548" fill="none" stroke={C.forest} strokeWidth={2} opacity={0.5} />
      {Pt("gall", smooth([[350, 562], [374, 566], [384, 592], [372, 614], [352, 608], [344, 584]], true), DC.gall, 2.5)}
      {/* stomach */}
      {Pt("stomach", smooth([[488, 482], [512, 456], [560, 446], [606, 466], [630, 512], [628, 575], [604, 628], [556, 656], [500, 662], [462, 650], [454, 632], [472, 620], [516, 624], [558, 600], [576, 556], [566, 514], [536, 496], [506, 502]], true), DC.stomach, 3)}
      {[[520, 520, 548, 586], [540, 500, 590, 560], [596, 500, 606, 590]].map(([a, b, c, d], i) => <path key={i} d={`M${a} ${b} Q${(a + c) / 2 + 12} ${(b + d) / 2} ${c} ${d}`} fill="none" stroke={DC.tractDark} strokeWidth={2.5} opacity={0.5} />)}
      <g.Halo id="pylorus"><circle cx={460} cy={641} r={10} strokeWidth={4} /></g.Halo>
      <circle cx={460} cy={641} r={10} fill={DC.muscle} stroke={C.forest} strokeWidth={2.5} opacity={g.k("pylorus") > 0 ? 1 : 0.8} />
      {/* large intestine */}
      {Tb("ascending", smooth(P_ASC), 30, DC.colon)}
      {Tb("transverse", smooth(P_TRA), 30, DC.colon)}
      {Tb("descending", smooth(P_DES), 30, DC.colon)}
      {Tb("sigmoid", smooth(P_SIG), 26, DC.colon)}
      {Tb("rectum", smooth(P_REC), 26, DC.colon)}
      {Pt("cecum", smooth([[266, 858], [312, 856], [318, 892], [296, 910], [268, 902], [262, 880]], true), DC.colon, 3)}
      {Tb("appendix", "M290 906 Q284 930 300 946", 8, DC.colon)}
      {Pt("anus", "M440 978 L464 978 L460 996 L444 996 Z", DC.colonDark, 2.5)}
      {/* haustra marks */}
      {[...sampleSmooth(P_ASC, 3), ...sampleSmooth(P_TRA, 3), ...sampleSmooth(P_DES, 3)].filter((_, i) => i % 2 === 1).map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={4} fill={DC.colonDark} opacity={0.35} />)}
      {/* flexure markers */}
      {(["hflex", "sflex"] as const).map((id) => g.k(id) > 0 ? <circle key={id} cx={GI_PT[id][0]} cy={GI_PT[id][1]} r={22} fill="none" stroke={C.red} strokeWidth={5} opacity={g.k(id)} /> : null)}
      {/* food trail + bolus */}
      {trailPts.length > 1 && <path d={"M" + trailPts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L")} fill="none" stroke={DC.food} strokeWidth={6} strokeLinecap="round" opacity={0.55} />}
      {fp && <g><circle cx={fp[0]} cy={fp[1]} r={17} fill={C.banana} opacity={0.45} /><circle cx={fp[0]} cy={fp[1]} r={10} fill={DC.food} stroke={C.forest} strokeWidth={3} /></g>}
    </svg>
  );
};

/* =====================================================================================
   2. GUT WALL — cross-section, 4 layers (viewBox 900 x 700)
   ===================================================================================== */
export const WALL_PT: Record<string, [number, number]> = { mucosa: [600, 350], sub: [634, 350], musc: [690, 350], serosa: [740, 350], lumen: [450, 350], vessel: [306, 270] };
export const GutWall: React.FC<{ t: number; w: number; lit?: Lit; squeeze?: number }> = ({ t, w, lit = {}, squeeze = 0 }) => {
  const g = useGlow2(t, lit, 1, { circ: ["musc"], long: ["musc"] });
  const cx = 450, cy = 350;
  const s = 1 - 0.06 * squeeze * (0.5 + 0.5 * Math.sin(t * 3));
  const ring = (r: number) => `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z`;
  const fold = Array.from({ length: 48 }).map((_, i) => { const a = (i / 48) * Math.PI * 2; const r = 122 + (i % 2 ? 22 : 0); return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as [number, number]; });
  return (
    <svg width={w} height={(w * 700) / 900} viewBox="0 0 900 700" style={{ overflow: "visible" }}>
      <g transform={`translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`}>
        <g.Halo id="serosa"><path d={ring(296)} strokeWidth={3} /></g.Halo>
        <path d={ring(296)} {...g.F("serosa", DC.serosa)} {...g.S("serosa", 3)} />
        <g.Halo id="long"><path d={ring(278)} strokeWidth={3} /></g.Halo>
        <path d={ring(278)} {...g.F("long", DC.muscL)} {...g.S("long", 2.5)} />
        {Array.from({ length: 90 }).map((_, i) => { const a = (i / 90) * Math.PI * 2; return <circle key={i} cx={cx + Math.cos(a) * 266} cy={cy + Math.sin(a) * 266} r={3.2} fill="#7E2F22" opacity={0.6 * g.F("long", "#000000").opacity} />; })}
        <g.Halo id="circ"><path d={ring(254)} strokeWidth={3} /></g.Halo>
        <path d={ring(254)} {...g.F("circ", DC.muscC)} {...g.S("circ", 2.5)} />
        {[244, 232, 220].map((r) => <path key={r} d={ring(r)} fill="none" stroke="#8F3E2E" strokeWidth={2} opacity={0.45 * g.F("circ", "#000000").opacity} />)}
        <g.Halo id="sub"><path d={ring(208)} strokeWidth={3} /></g.Halo>
        <path d={ring(208)} {...g.F("sub", DC.sub)} {...g.S("sub", 2.5)} />
        {Array.from({ length: 14 }).map((_, i) => { const a = (i / 14) * Math.PI * 2 + 0.2; const r = 182; return <g key={i} opacity={g.F("sub", "#000000").opacity}><circle cx={cx + Math.cos(a) * r} cy={cy + Math.sin(a) * r} r={7} fill={i % 2 ? DC.vein : DC.vessel} stroke={C.forest} strokeWidth={1.5} /></g>; })}
        <g.Halo id="mucosa"><path d={smooth(fold, true)} strokeWidth={3} /></g.Halo>
        <path d={ring(160)} fill={g.F("mucosa", DC.mucosa).fill} opacity={g.F("mucosa", DC.mucosa).opacity} stroke="none" />
        <path d={smooth(fold, true)} fill="#FFF7EC" stroke={C.forest} strokeWidth={2.5 + 1.5 * g.k("mucosa")} />
        <path d={smooth(fold, true)} fill="none" stroke={g.F("mucosa", DC.mucosa).fill} strokeWidth={10} opacity={0.9} />
        <circle cx={cx} cy={cy} r={42} fill={DC.food} stroke={C.forest} strokeWidth={3} opacity={0.85 * g.F("lumen", "#000000").opacity} />
      </g>
    </svg>
  );
};

/* =====================================================================================
   3. PERISTALSIS — straight tube, a ring of contraction pushes a bolus (viewBox 900 x 300)
   ===================================================================================== */
export const Peristalsis: React.FC<{ t: number; w: number; k: number }> = ({ t, w, k }) => {
  const u = ((t * 0.32) % 1);
  const X = 100 + u * 700;
  const top: [number, number][] = [], bot: [number, number][] = [];
  for (let x = 60; x <= 840; x += 15) {
    const d = x - (X - 70);
    const pinch = k * 46 * Math.exp(-(d * d) / 1400);
    const bulge = k * 18 * Math.exp(-((x - X - 10) ** 2) / 2600);
    top.push([x, 100 + pinch - bulge]);
    bot.push([x, 200 - pinch + bulge]);
  }
  return (
    <svg width={w} height={(w * 300) / 900} viewBox="0 0 900 300" style={{ overflow: "visible" }}>
      <path d={smooth(top) + " L" + [...bot].reverse().map((p) => `${p[0]} ${p[1]}`).join(" L") + " Z"} fill={DC.tract} stroke="none" opacity={0.95} />
      <path d={smooth(top)} fill="none" stroke={C.forest} strokeWidth={4} />
      <path d={smooth(bot)} fill="none" stroke={C.forest} strokeWidth={4} />
      <ellipse cx={X + 10} cy={150} rx={44} ry={36} fill={DC.food} stroke={C.forest} strokeWidth={3} />
      <path d={`M${X - 90} 70 L${X - 70} 98 M${X - 90} 230 L${X - 70} 202`} stroke={C.red} strokeWidth={6} strokeLinecap="round" opacity={k} />
      <path d={`M${X + 70} 150 l40 0 m-14 -14 l14 14 l-14 14`} fill="none" stroke={C.forest} strokeWidth={5} strokeLinecap="round" opacity={k} />
    </svg>
  );
};

/* =====================================================================================
   4. ESOPHAGUS — two sphincters + muscle thirds (viewBox 900 x 700)
   ===================================================================================== */
export const ESO_PT: Record<string, [number, number]> = { ues: [450, 112], les: [470, 560], upper: [450, 210], middle: [452, 340], lower: [458, 470], hiatus: [520, 528], stomach: [560, 630], pharynx: [450, 50], trachea: [380, 220] };
export const Esoph: React.FC<{ t: number; w: number; lit?: Lit; reflux?: number; food?: number }> = ({ t, w, lit = {}, reflux = 0, food = -1 }) => {
  const g = useGlow2(t, lit, 1, { upper: ["thirds"], middle: ["thirds"], lower: ["thirds"] });
  const seg = (id: string, y0: number, y1: number, col: string, x0 = 450, x1 = 450) => (
    <g key={id}>
      <g.Halo id={id}><path d={`M${x0 - 34} ${y0} L${x0 + 34} ${y0} L${x1 + 34} ${y1} L${x1 - 34} ${y1} Z`} strokeWidth={3} /></g.Halo>
      <path d={`M${x0 - 34} ${y0} L${x0 + 34} ${y0} L${x1 + 34} ${y1} L${x1 - 34} ${y1} Z`} {...g.F(id, col)} {...g.S(id, 3)} />
    </g>
  );
  const fy = food >= 0 ? lerp(60, 600, food) : -100;
  return (
    <svg width={w} height={(w * 700) / 900} viewBox="0 0 900 700" style={{ overflow: "visible" }}>
      {/* trachea (in front, faint) */}
      <g opacity={0.35}><rect x={352} y={130} width={44} height={200} rx={16} fill="#E3EEF3" stroke={C.forest} strokeWidth={2} />{Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M354 ${146 + i * 20} L394 ${146 + i * 20}`} stroke="#8EAABA" strokeWidth={3} />)}</g>
      {/* pharynx funnel */}
      {part(g)("pharynx", "M380 20 L520 20 L486 100 L414 100 Z", DC.tract, 3)}
      {seg("upper", 100, 270, DC.skeletal)}
      {seg("middle", 270, 410, "#D27A64", 450, 454)}
      {seg("lower", 410, 545, DC.smooth, 454, 466)}
      {/* striation / smooth texture */}
      {Array.from({ length: 16 }).map((_, i) => <path key={i} d={`M420 ${112 + i * 10} L480 ${112 + i * 10}`} stroke="#7A2A20" strokeWidth={2} opacity={0.45} />)}
      {Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M420 ${282 + i * 18} L452 ${282 + i * 18}`} stroke="#7A2A20" strokeWidth={2} opacity={0.4} />)}
      {/* diaphragm */}
      <g.Halo id="hiatus"><path d="M140 520 Q300 490 410 524 M512 524 Q620 492 760 520" strokeWidth={14} /></g.Halo>
      <path d="M140 520 Q300 490 410 524 M512 524 Q620 492 760 520" fill="none" stroke={DC.muscle} strokeWidth={14} strokeLinecap="round" />
      {/* stomach top */}
      {part(g)("stomach", smooth([[430, 545], [500, 545], [560, 540], [640, 560], [700, 640], [690, 700], [420, 700], [410, 620]], true), DC.stomach, 3)}
      {/* sphincters */}
      {(["ues", "les"] as const).map((id) => { const [x, y] = ESO_PT[id]; return <g key={id}><g.Halo id={id}><ellipse cx={x} cy={y} rx={44} ry={13} strokeWidth={6} /></g.Halo><ellipse cx={x} cy={y} rx={44} ry={13} fill="none" stroke={mix(DC.muscL, C.red, g.k(id))} strokeWidth={10 + 4 * g.k(id)} /></g>; })}
      {/* reflux blocked */}
      {reflux > 0 && <g opacity={reflux}>{[0, 1, 2].map((i) => { const y = 640 - ((t * 60 + i * 30) % 70); return <circle key={i} cx={470 + (i - 1) * 16} cy={y} r={8} fill={DC.acid} stroke={C.forest} strokeWidth={2} />; })}<path d="M500 590 l60 -60 m0 60 l-60 -60" stroke={C.red} strokeWidth={8} strokeLinecap="round" opacity={0} /></g>}
      {food >= 0 && fy > 60 && fy < 600 && <ellipse cx={450 + (fy > 420 ? (fy - 420) * 0.1 : 0)} cy={fy} rx={24} ry={30} fill={DC.food} stroke={C.forest} strokeWidth={3} />}
    </svg>
  );
};

/* =====================================================================================
   5. STOMACH — regions, curvatures, rugae, 3 muscle layers (viewBox 900 x 700)
   ===================================================================================== */
export const ST_PT: Record<string, [number, number]> = { cardia: [470, 168], fundus: [600, 110], body: [600, 330], pylorus: [300, 520], antrum: [380, 500], sphincter: [232, 520], lesser: [440, 330], greater: [770, 400], rugae: [610, 420], esoph: [430, 40], duod: [140, 500], oblique: [520, 260] };
const STO_OUT: [number, number][] = [[400, 132], [470, 104], [560, 60], [660, 60], [740, 120], [780, 230], [780, 380], [740, 500], [640, 590], [520, 620], [400, 604], [300, 570], [240, 548], [240, 490], [300, 474], [400, 490], [470, 470], [520, 400], [520, 280], [490, 200], [440, 160]];
export const Stomach: React.FC<{ t: number; w: number; lit?: Lit; layers?: number; churn?: number; rugae?: number }> = ({ t, w, lit = {}, layers = 0, churn = 0, rugae = 1 }) => {
  const g = useGlow2(t, lit, 1, {});
  const wob = churn * 6 * Math.sin(t * 4);
  const out = STO_OUT.map(([x, y], i) => [x + (i > 3 && i < 12 ? wob * Math.cos(i) : 0), y + (i > 3 && i < 12 ? wob * Math.sin(i) : 0)] as [number, number]);
  const D = smooth(out, true);
  const region = (id: string, clip: string, col: string) => (
    <g key={id}>
      <clipPath id={"cl-" + id}><path d={clip} /></clipPath>
      <path d={D} clipPath={`url(#cl-${id})`} {...g.F(id, col)} stroke="none" />
    </g>
  );
  return (
    <svg width={w} height={(w * 700) / 900} viewBox="0 0 900 700" style={{ overflow: "visible" }}>
      {/* esophagus in, duodenum out */}
      {tube(g)("esoph", "M430 0 Q432 80 452 150", 52, DC.tract)}
      {tube(g)("duod", "M236 520 Q160 520 120 560 Q100 600 110 660", 54, DC.small)}
      <g.Halo id="stomach"><path d={D} strokeWidth={4} /></g.Halo>
      {region("fundus", "M480 0 L900 0 L900 150 L480 150 Z", "#F2AE98")}
      {region("cardia", "M380 90 L520 90 L520 230 L380 230 Z", "#F7C3AE")}
      {region("body", "M480 150 L900 150 L900 700 L480 700 Z M480 230 L520 230 L520 150 L480 150 Z", DC.stomach)}
      {region("pylorus", "M0 380 L480 380 L480 700 L0 700 Z", "#E88E78")}
      {/* region borders (dashed) */}
      <path d="M520 150 L740 120 M520 400 Q600 520 650 590" fill="none" stroke={C.forest} strokeWidth={2.5} strokeDasharray="8 8" opacity={0.55} />
      <path d={D} fill="none" stroke={C.forest} strokeWidth={4 + 1.5 * g.k("stomach")} />
      {/* rugae */}
      <g opacity={rugae * 0.75 * (1 - g.any * (1 - g.k("rugae")) * 0.5)}>
        {[[560, 200, 700, 260], [550, 290, 730, 330], [545, 380, 720, 430], [520, 470, 660, 540], [380, 530, 520, 570], [600, 120, 700, 170]].map(([a, b, c, d], i) => (
          <path key={i} d={`M${a} ${b} Q${(a + c) / 2} ${(b + d) / 2 - 30} ${(a + c) / 2 + 20} ${(b + d) / 2} T${c} ${d}`} fill="none" stroke={g.k("rugae") > 0 ? C.red : "#B4473B"} strokeWidth={5 + 3 * g.k("rugae")} strokeLinecap="round" />
        ))}
      </g>
      {/* curvatures */}
      <g.Halo id="lesser"><path d="M300 474 Q400 494 470 470 Q520 400 520 280 Q500 200 440 160" strokeWidth={6} /></g.Halo>
      <g.Halo id="greater"><path d="M560 60 Q680 50 740 120 Q790 230 780 380 Q740 500 640 590 Q520 630 400 604" strokeWidth={6} /></g.Halo>
      {/* muscle layers (cut-away band along the greater curvature) */}
      <g opacity={layers}>
        <path d="M780 230 Q790 380 740 500" fill="none" stroke={DC.muscL} strokeWidth={30} />
        {Array.from({ length: 10 }).map((_, i) => <path key={"l" + i} d={`M${776 - i * 0} ${236 + i * 26} l8 18`} stroke="#7E2F22" strokeWidth={2.5} />)}
        <path d="M748 236 Q756 380 712 486" fill="none" stroke={DC.muscC} strokeWidth={24} opacity={0.95} />
        <path d="M720 244 Q726 380 688 474" fill="none" stroke="#E7B37A" strokeWidth={20} opacity={0.95} />
      </g>
      {/* pyloric sphincter */}
      <g.Halo id="sphincter"><ellipse cx={240} cy={519} rx={14} ry={34} strokeWidth={6} /></g.Halo>
      <ellipse cx={240} cy={519} rx={14} ry={34} fill={mix(DC.muscL, C.red, g.k("sphincter"))} stroke={C.forest} strokeWidth={3} />
      {/* gastroesophageal (cardiac) opening */}
      <ellipse cx={450} cy={152} rx={30} ry={10} fill="#B4473B" stroke={C.forest} strokeWidth={2.5} opacity={0.8} />
    </svg>
  );
};

/* =====================================================================================
   6. GASTRIC GLAND — pit, parietal + chief cells, acid & pepsinogen (viewBox 900 x 700)
   ===================================================================================== */
export const GL_PT: Record<string, [number, number]> = { pit: [450, 120], parietal: [372, 380], chief: [520, 560], neck: [530, 230], lumen: [450, 40] };
export const Gland: React.FC<{ t: number; w: number; lit?: Lit; acid?: number; pep?: number }> = ({ t, w, lit = {}, acid = 0, pep = 0 }) => {
  const g = useGlow2(t, lit, 1, {});
  const cells: { id: string; x: number; y: number; r: number; col: string }[] = [];
  for (let i = 0; i < 6; i++) { const y = 180 + i * 80; const id = y < 260 ? "neck" : y < 470 ? "parietal" : "chief"; const col = id === "neck" ? DC.mucus : id === "parietal" ? DC.parietal : DC.chief; cells.push({ id, x: 380, y, r: id === "parietal" ? 40 : 32, col }, { id, x: 520, y: y + 30, r: id === "parietal" ? 40 : 32, col }); }
  return (
    <svg width={w} height={(w * 700) / 900} viewBox="0 0 900 700" style={{ overflow: "visible" }}>
      <path d="M60 90 L380 90 L410 140 L410 660 Q450 690 490 660 L490 140 L520 90 L840 90 L840 700 L60 700 Z" fill={DC.sub} stroke={C.forest} strokeWidth={3} />
      <rect x={60} y={20} width={780} height={70} fill="#FFF7EC" opacity={0.6} />
      <g.Halo id="pit"><path d="M380 90 L410 140 L490 140 L520 90" strokeWidth={4} /></g.Halo>
      {cells.map((c, i) => (
        <g key={i}>
          <g.Halo id={c.id}><circle cx={c.x} cy={c.y} r={c.r} strokeWidth={3} /></g.Halo>
          <circle cx={c.x} cy={c.y} r={c.r} {...g.F(c.id, c.col)} {...g.S(c.id, 3)} />
          <circle cx={c.x + (c.x < 450 ? -8 : 8)} cy={c.y} r={10} fill="#5B3A7A" opacity={0.75} />
        </g>
      ))}
      {/* secretions rising up the gland */}
      {acid > 0 && Array.from({ length: 8 }).map((_, i) => { const u = (t * 0.35 + i / 8) % 1; return <text key={"a" + i} x={438 + (i % 2) * 18} y={480 - u * 440} fontFamily={FONT} fontWeight={800} fontSize={26} fill={DC.acid} opacity={acid * Math.min(1, (1 - u) * 4)}>H⁺</text>; })}
      {pep > 0 && Array.from({ length: 6 }).map((_, i) => { const u = (t * 0.3 + i / 6) % 1; return <rect key={"p" + i} x={444 + (i % 2) * 12} y={640 - u * 600} width={16} height={16} rx={4} fill={DC.chief} stroke={C.forest} strokeWidth={2} opacity={pep * Math.min(1, (1 - u) * 4)} />; })}
    </svg>
  );
};

/* =====================================================================================
   7. BILE TREE — liver ducts, gallbladder, pancreas, duodenum, ampulla (viewBox 900 x 700)
   ===================================================================================== */
export const BT_PT: Record<string, [number, number]> = {
  liver: [300, 90], rhep: [372, 190], lhep: [528, 190], chd: [450, 262], gall: [200, 255], cystic: [360, 280], cbd: [405, 448], pancduct: [600, 520], ampulla: [262, 522], papilla: [228, 520], duod: [180, 470], pancreas: [640, 500], panchead: [330, 560], oddi: [262, 522],
};
const DUO_C = "M240 330 Q180 360 180 470 Q180 620 300 650 Q430 670 520 610";
export const BileTree: React.FC<{ t: number; w: number; lit?: Lit; bile?: number; juice?: number }> = ({ t, w, lit = {}, bile = 0, juice = 0 }) => {
  const g = useGlow2(t, lit, 1, { rhep: ["ducts"], lhep: ["ducts"], chd: ["ducts"], cystic: ["ducts"], cbd: ["ducts"], oddi: ["ampulla"] });
  const Pt = part(g), Tb = tube(g);
  const bilePath = sampleSmooth([[372, 170], [400, 230], [450, 262], [448, 330], [440, 430], [380, 495], [300, 516], [262, 522], [226, 520]], 10);
  const juicePath = sampleSmooth([[780, 465], [700, 495], [600, 515], [480, 530], [340, 536], [262, 522], [226, 520]], 10);
  return (
    <svg width={w} height={(w * 700) / 900} viewBox="0 0 900 700" style={{ overflow: "visible" }}>
      {Pt("liver", smooth([[110, 70], [300, 30], [560, 30], [780, 60], [800, 110], [640, 160], [470, 180], [300, 180], [150, 150]], true), DC.liver, 3)}
      <text x={600} y={110} fontFamily={FONT} fontWeight={800} fontSize={30} fill="#FFF2E0" opacity={0.85}>LIVER</text>
      {/* duodenum C */}
      {Tb("duod", DUO_C, 70, DC.small)}
      {/* pancreas */}
      {Pt("pancreas", smooth([[245, 500], [330, 470], [500, 470], [640, 440], [800, 420], [840, 460], [780, 500], [640, 540], [500, 590], [400, 620], [280, 600], [240, 560]], true), DC.pancreas, 3)}
      {/* ducts */}
      {Tb("rhep", "M330 160 Q380 210 450 262", 14, DC.bile)}
      {Tb("lhep", "M580 160 Q520 210 450 262", 14, DC.bile)}
      {Tb("chd", "M450 262 L448 330", 16, DC.bile)}
      {Tb("cystic", "M282 236 Q380 260 448 330", 12, DC.bile)}
      {Tb("cbd", "M448 330 Q450 470 262 522", 16, DC.bile)}
      {Tb("pancduct", "M800 450 Q640 500 480 530 Q340 540 262 522", 12, "#E2B85A")}
      {/* gallbladder */}
      {Pt("gall", smooth([[120, 230], [200, 200], [270, 214], [292, 238], [240, 290], [160, 310], [108, 280]], true), DC.gall, 3)}
      {/* ampulla + sphincter of Oddi + papilla */}
      <g.Halo id="ampulla"><circle cx={262} cy={522} r={18} strokeWidth={4} /></g.Halo>
      <circle cx={262} cy={522} r={18} fill={mix(DC.bile, C.banana, g.k("ampulla") * 0.5)} stroke={C.forest} strokeWidth={3} />
      <g.Halo id="oddi"><circle cx={262} cy={522} r={26} strokeWidth={6} /></g.Halo>
      <circle cx={262} cy={522} r={26} fill="none" stroke={mix(DC.muscL, C.red, g.k("oddi"))} strokeWidth={7} opacity={0.6 + 0.4 * g.k("oddi")} />
      <g.Halo id="papilla"><circle cx={226} cy={520} r={11} strokeWidth={4} /></g.Halo>
      <circle cx={226} cy={520} r={11} fill="#C9604A" stroke={C.forest} strokeWidth={3} />
      {/* flows */}
      {bile > 0 && Array.from({ length: 7 }).map((_, i) => { const u = (t * 0.22 + i / 7) % 1; const [x, y] = ptOn(bilePath, u); return <circle key={"b" + i} cx={x} cy={y} r={8} fill={DC.bile} stroke={C.forest} strokeWidth={2} opacity={bile * Math.min(1, u * 6, (1 - u) * 6)} />; })}
      {juice > 0 && Array.from({ length: 7 }).map((_, i) => { const u = (t * 0.2 + i / 7) % 1; const [x, y] = ptOn(juicePath, u); return <circle key={"j" + i} cx={x} cy={y} r={8} fill={DC.juice} stroke={C.forest} strokeWidth={2} opacity={juice * Math.min(1, u * 6, (1 - u) * 6)} />; })}
    </svg>
  );
};

/* =====================================================================================
   8. SURFACE — circular folds → villi → microvilli (viewBox 900 x 700, three panels)
   ===================================================================================== */
export const Surface: React.FC<{ t: number; w: number; lit?: Lit }> = ({ t, w, lit = {} }) => {
  const g = useGlow2(t, lit, 1, {});
  const box = (id: string, x: number, title: string, children: React.ReactNode) => (
    <g key={id} opacity={g.F(id, "#000000").opacity}>
      <g.Halo id={id}><rect x={x} y={40} width={270} height={560} rx={28} strokeWidth={4} /></g.Halo>
      <rect x={x} y={40} width={270} height={560} rx={28} fill="#FFF7EC" stroke={C.forest} strokeWidth={3 + 1.5 * g.k(id)} />
      <clipPath id={"sf-" + id}><rect x={x} y={40} width={270} height={560} rx={28} /></clipPath>
      <g clipPath={`url(#sf-${id})`}>{children}</g>
      <text x={x + 135} y={650} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill={C.forest}>{title}</text>
    </g>
  );
  const wave = (x: number) => { let d = `M${x} 600 L${x} 380`; for (let i = 0; i < 4; i++) { const xx = x + 12 + i * 64; d += ` L${xx} 380 Q${xx + 26} 150 ${xx + 52} 380`; } return d + ` L${x + 270} 380 L${x + 270} 600 Z`; };
  return (
    <svg width={w} height={(w * 700) / 900} viewBox="0 0 900 700" style={{ overflow: "visible" }}>
      {box("folds", 10, "circular folds", <><path d={wave(10)} fill={DC.mucosa} stroke={C.forest} strokeWidth={3} /><rect x={10} y={520} width={270} height={80} fill={DC.muscC} opacity={0.8} /></>)}
      {box("villi", 315, "villi", <>{Array.from({ length: 6 }).map((_, i) => { const x = 330 + i * 42; const sw = Math.sin(t * 2 + i) * 4; return <path key={i} d={`M${x} 600 L${x} 260 Q${x + 16 + sw} 200 ${x + 32} 260 L${x + 32} 600`} fill={DC.mucosa} stroke={C.forest} strokeWidth={2.5} />; })}{Array.from({ length: 6 }).map((_, i) => <path key={"c" + i} d={`M${346 + i * 42} 580 L${346 + i * 42} 280`} stroke={DC.vessel} strokeWidth={3} opacity={0.6} />)}</>)}
      {box("micro", 620, "microvilli", <><rect x={640} y={300} width={230} height={300} rx={16} fill={DC.mucosa} stroke={C.forest} strokeWidth={3} /><circle cx={755} cy={470} r={34} fill="#8E5BB0" opacity={0.7} />{Array.from({ length: 16 }).map((_, i) => <rect key={i} x={644 + i * 14} y={210 + Math.sin(i) * 4} width={9} height={92} rx={4.5} fill={DC.mucosa} stroke={C.forest} strokeWidth={2} />)}</>)}
      <path d="M284 320 l26 0 m-10 -10 l10 10 l-10 10 M589 320 l26 0 m-10 -10 l10 10 l-10 10" fill="none" stroke={C.forest} strokeWidth={4} strokeLinecap="round" />
    </svg>
  );
};

/* =====================================================================================
   9. COLON SEGMENT — teniae coli, haustra, epiploic appendages (viewBox 900 x 400)
   ===================================================================================== */
export const COL_PT: Record<string, [number, number]> = { teniae: [420, 104], haustra: [300, 200], epiploic: [560, 330] };
export const ColonSeg: React.FC<{ t: number; w: number; lit?: Lit }> = ({ t, w, lit = {} }) => {
  const g = useGlow2(t, lit, 1, {});
  const n = 6, x0 = 60, L = 780, seg = L / n;
  let top = `M${x0} 120`, bot = `M${x0} 290`;
  for (let i = 0; i < n; i++) { const a = x0 + i * seg; top += ` Q${a + seg / 2} 60 ${a + seg} 120`; bot += ` Q${a + seg / 2} 350 ${a + seg} 290`; }
  return (
    <svg width={w} height={(w * 400) / 900} viewBox="0 0 900 400" style={{ overflow: "visible" }}>
      <g.Halo id="haustra"><path d={top + ` L${x0 + L} 290 ` + bot.replace("M", "L").split(" ").join(" ") + " Z"} strokeWidth={3} /></g.Halo>
      <path d={`${top} L${x0 + L} 290 L${x0} 290 Z`} {...g.F("haustra", DC.colon)} stroke="none" />
      <path d={`${bot} L${x0 + L} 120 L${x0} 120 Z`} {...g.F("haustra", DC.colon)} stroke="none" />
      <path d={top} fill="none" stroke={C.forest} strokeWidth={4} />
      <path d={bot} fill="none" stroke={C.forest} strokeWidth={4} />
      {Array.from({ length: n - 1 }).map((_, i) => <path key={i} d={`M${x0 + (i + 1) * seg} 120 Q${x0 + (i + 1) * seg - 14} 205 ${x0 + (i + 1) * seg} 290`} fill="none" stroke={DC.colonDark} strokeWidth={4} opacity={0.8} />)}
      {/* teniae coli bands */}
      {[104, 205].map((y, j) => (
        <g key={y}>
          <g.Halo id="teniae"><path d={`M${x0} ${y + (j ? 0 : 16)} L${x0 + L} ${y + (j ? 0 : 16)}`} strokeWidth={14} /></g.Halo>
          <path d={`M${x0} ${y + (j ? 0 : 16)} L${x0 + L} ${y + (j ? 0 : 16)}`} stroke={mix("#9E6A3E", C.banana, g.k("teniae") * 0.8)} strokeWidth={16} />
          <path d={`M${x0} ${y + (j ? 0 : 16)} L${x0 + L} ${y + (j ? 0 : 16)}`} stroke={C.forest} strokeWidth={2} strokeDasharray="3 12" opacity={0.6} />
        </g>
      ))}
      {/* epiploic appendages */}
      {[180, 330, 480, 630, 780].map((x, i) => (
        <g key={x}>
          <g.Halo id="epiploic"><path d={`M${x} ${300} q-22 30 -6 52 q22 6 22 -22 z`} strokeWidth={3} /></g.Halo>
          <path d={`M${x} ${300} q-22 30 -6 52 q22 6 22 -22 z`} {...g.F("epiploic", DC.fat)} {...g.S("epiploic", 2.5)} transform={`rotate(${Math.sin(t * 2 + i) * 6} ${x} 300)`} />
        </g>
      ))}
    </svg>
  );
};
