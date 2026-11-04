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
export const KC = {
  cortex: "#E2A07C", cortexDark: "#C97E5A", pyramid: "#B4564A", pyrLine: "#8E3B33", sinus: "#F4DFA0", coll: "#FBF3D6", urine: "#F2C94C",
  artery: "#C9483C", vein: "#3F78B8", fat: "#F6E2A6", fascia: "#8FA86A", capsule: "#FFFFFF", adrenal: "#E9A23B", liver: "#9C5B3F",
  bone: "#EDE5C8", boneLine: "#CFC39A", bladder: "#F2C94C", ureter: "#F2C94C", peri: "#F7E7B4", para: "#EFD58C",
  pct: "#E9A23B", loopD: "#8FA86A", loopA: "#5C7A2F", dct: "#3F9BB8", cd: "#B77418", caps: "#DDEBCB", glom: "#C9483C",
};

const useGlow = (t: number, lit: Lit, dim: number, groups: Record<string, string> = {}) => {
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
const sampleSmooth = (p: [number, number][], per = 12): [number, number][] => {
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
const ptOn = (pts: [number, number][], u: number): [number, number] => {
  const L = pts.length - 1, f = Math.max(0, Math.min(0.9999, u)) * L, i = Math.floor(f), r = f - i;
  return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * r, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * r];
};
const Dots: React.FC<{ pts: [number, number][]; t: number; k: number; n?: number; speed?: number; r?: number; col?: string }> = ({ pts, t, k, n = 6, speed = 0.25, r = 7, col = KC.urine }) => {
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
const Tube: React.FC<{ d: string; w: number; col: string; op?: number }> = ({ d, w, col, op = 1 }) => (
  <g opacity={op}>
    <path d={d} fill="none" stroke={C.forest} strokeWidth={w + 6} strokeLinecap="round" strokeLinejoin="round" />
    <path d={d} fill="none" stroke={col} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

/* bean outline in polar form: hilum faces +x (s=1) or -x (s=-1) */
const beanR = (th: number, rx: number, ry: number, dent = 0.3, wd = 0.42) => {
  const re = 1 / Math.sqrt((Math.cos(th) / rx) ** 2 + (Math.sin(th) / ry) ** 2);
  let a = Math.atan2(Math.sin(th), Math.cos(th));
  return re * (1 - dent * Math.exp(-((a / wd) ** 2)));
};
const ellR = (th: number, rx: number, ry: number) => 1 / Math.sqrt((Math.cos(th) / rx) ** 2 + (Math.sin(th) / ry) ** 2);
const P = (cx: number, cy: number, r: number, th: number, s = 1): [number, number] => [cx + s * r * Math.cos(th), cy - r * Math.sin(th)];
const D = (deg: number) => (deg * Math.PI) / 180;
const beanPath = (cx: number, cy: number, rx: number, ry: number, s = 1, scale = 1, dent = 0.3) => {
  const pts: [number, number][] = [];
  for (let i = 0; i < 72; i++) {
    const th = (i / 72) * Math.PI * 2;
    pts.push(P(cx, cy, beanR(th, rx, ry, dent) * scale, th, s));
  }
  return smooth(pts, true);
};

/* =====================================================================================
   1. URINARY OVERVIEW — front view, schematic (viewBox 900 x 700). Patient's right = viewer's left.
   ===================================================================================== */
const KR = { cx: 262, cy: 286, rx: 66, ry: 112 }; // right kidney (lower)
const KL = { cx: 638, cy: 248, rx: 66, ry: 112 }; // left kidney
export const OV_PT: Record<string, [number, number]> = {
  kidneyR: [232, 286], kidneyL: [668, 248], adrenalR: [268, 164], adrenalL: [630, 128], ureterR: [352, 470], ureterL: [548, 470],
  bladder: [450, 612], urethra: [450, 688], aorta: [515, 420], ivc: [385, 420], rartery: [345, 266], rvein: [345, 296], lartery: [565, 262], lvein: [560, 236],
  sma: [506, 228], liver: [200, 92], T12: [450, 130], L3: [450, 316], rib12R: [250, 175], rib12L: [690, 160], hilumL: [593, 248], hilumR: [306, 286],
  upperL: [640, 138], lowerL: [640, 358], latL: [705, 248], medL: [584, 180], spine: [450, 360],
};
const OVG: Record<string, string> = { kidneyR: "kidneys", kidneyL: "kidneys", adrenalR: "adrenal", adrenalL: "adrenal", ureterR: "ureters", ureterL: "ureters", rartery: "renalA", lartery: "renalA", rvein: "renalV", lvein: "renalV" };
export const UrinaryOverview: React.FC<{ t: number; w: number; lit?: Lit; dim?: number; levels?: number; urine?: number; blood?: number; labels?: number }> = ({ t, w, lit = {}, dim = 1, levels = 0, urine = 0, blood = 0, labels = 0 }) => {
  const { F, S, Halo } = useGlow(t, lit, dim, OVG);
  const verts = ["T11", "T12", "L1", "L2", "L3", "L4", "L5"];
  const kid = (k: typeof KR, id: string, s: number) => beanPath(k.cx, k.cy, k.rx, k.ry, s, 1, 0.28);
  const urR: [number, number][] = [[304, 306], [325, 350], [345, 430], [368, 520], [405, 590], [430, 606]];
  const urL: [number, number][] = [[596, 270], [575, 320], [556, 430], [532, 520], [495, 590], [470, 606]];
  const sR = sampleSmooth(urR), sL = sampleSmooth(urL);
  const ra: [number, number][] = [[505, 262], [440, 262], [370, 268], [308, 282]];
  const la: [number, number][] = [[525, 258], [560, 256], [594, 252]];
  return (
    <svg width={w} height={(w * 700) / 900} viewBox="0 0 900 700" style={{ overflow: "visible" }}>
      {/* spine */}
      <g opacity={0.9}>
        {verts.map((v, i) => {
          const y = 40 + i * 62;
          const on = (i >= 1 && i <= 4 ? 1 : 0) * levels;
          return (
            <g key={v}>
              <rect x={418} y={y} width={64} height={54} rx={12} fill={mix(KC.bone, C.banana, on * 0.7)} stroke={KC.boneLine} strokeWidth={3} />
            </g>
          );
        })}
        <path d="M418 476 L482 476 L474 560 Q450 590 426 560 Z" fill={KC.bone} stroke={KC.boneLine} strokeWidth={3} />
      </g>
      {/* ribs 11 + 12 (behind) */}
      {[0, 1].map((r) => (
        <g key={r} opacity={0.75}>
          <Halo id="ribs"><path d={`M418 ${70 + r * 64} Q300 ${78 + r * 64} ${190 + r * 30} ${150 + r * 52}`} strokeWidth={14} /></Halo>
          <path d={`M418 ${70 + r * 64} Q300 ${78 + r * 64} ${190 + r * 30} ${150 + r * 52}`} fill="none" stroke={KC.boneLine} strokeWidth={16} strokeLinecap="round" />
          <path d={`M418 ${70 + r * 64} Q300 ${78 + r * 64} ${190 + r * 30} ${150 + r * 52}`} fill="none" stroke={mix(KC.bone, "#FFFFFF", 0.3)} strokeWidth={10} strokeLinecap="round" />
          <Halo id="ribs"><path d={`M482 ${44 + r * 64} Q600 ${52 + r * 64} ${715 - r * 30} ${118 + r * 52}`} strokeWidth={14} /></Halo>
          <path d={`M482 ${44 + r * 64} Q600 ${52 + r * 64} ${715 - r * 30} ${118 + r * 52}`} fill="none" stroke={KC.boneLine} strokeWidth={16} strokeLinecap="round" />
          <path d={`M482 ${44 + r * 64} Q600 ${52 + r * 64} ${715 - r * 30} ${118 + r * 52}`} fill="none" stroke={mix(KC.bone, "#FFFFFF", 0.3)} strokeWidth={10} strokeLinecap="round" />
        </g>
      ))}
      {/* right renal artery passes BEHIND the IVC: draw before IVC */}
      <Halo id="rartery"><path d={smooth(ra)} strokeWidth={12} /></Halo>
      <Tube d={smooth(ra)} w={12} col={F("rartery", KC.artery).fill} op={F("rartery", KC.artery).opacity} />
      {/* aorta */}
      <Halo id="aorta"><path d="M515 10 L515 560" strokeWidth={30} /></Halo>
      <Tube d="M515 10 L515 470 Q515 520 490 560 M515 470 Q515 520 540 560" w={30} col={F("aorta", KC.artery).fill} op={F("aorta", KC.artery).opacity} />
      {/* SMA stub (front of aorta) */}
      <Halo id="sma"><path d="M515 212 Q492 232 500 262" strokeWidth={10} /></Halo>
      <Tube d="M515 212 Q492 232 500 262" w={9} col={F("sma", "#D9735F").fill} op={F("sma", KC.artery).opacity} />
      <Halo id="lartery"><path d={smooth(la)} strokeWidth={12} /></Halo>
      <Tube d={smooth(la)} w={12} col={F("lartery", KC.artery).fill} op={F("lartery", KC.artery).opacity} />
      {/* IVC */}
      <Halo id="ivc"><path d="M385 10 L385 560" strokeWidth={34} /></Halo>
      <Tube d="M385 10 L385 470 Q385 520 362 560 M385 470 Q385 520 408 560" w={34} col={F("ivc", KC.vein).fill} op={F("ivc", KC.vein).opacity} />
      {/* right renal vein (short) */}
      <Halo id="rvein"><path d="M310 292 Q345 298 380 290" strokeWidth={14} /></Halo>
      <Tube d="M310 292 Q345 298 380 290" w={14} col={F("rvein", KC.vein).fill} op={F("rvein", KC.vein).opacity} />
      {/* kidneys */}
      {([[KR, "kidneyR", 1], [KL, "kidneyL", -1]] as [typeof KR, string, number][]).map(([k, id, s]) => (
        <g key={id}>
          <Halo id={id}><path d={kid(k, id, s)} strokeWidth={4} /></Halo>
          <path d={kid(k, id, s)} {...F(id, KC.cortex)} {...S(id, 3.5)} />
          <path d={beanPath(k.cx - s * 6, k.cy - 8, k.rx * 0.55, k.ry * 0.6, s, 1, 0.1)} fill="#FFFFFF" opacity={0.18} />
        </g>
      ))}
      {/* left renal vein: crosses IN FRONT of the aorta */}
      <Halo id="lvein"><path d="M392 272 Q450 240 515 238 Q560 238 594 242" strokeWidth={14} /></Halo>
      <Tube d="M392 272 Q450 240 515 238 Q560 238 594 242" w={14} col={F("lvein", KC.vein).fill} op={F("lvein", KC.vein).opacity} />
      {/* adrenal glands */}
      <Halo id="adrenalR"><path d="M224 182 Q254 136 292 150 Q310 166 304 186 Q264 172 224 182 Z" strokeWidth={3} /></Halo>
      <path d="M224 182 Q254 136 292 150 Q310 166 304 186 Q264 172 224 182 Z" {...F("adrenalR", KC.adrenal)} {...S("adrenalR", 3)} />
      <Halo id="adrenalL"><path d="M594 166 Q604 114 648 108 Q676 118 672 142 Q628 136 594 166 Z" strokeWidth={3} /></Halo>
      <path d="M594 166 Q604 114 648 108 Q676 118 672 142 Q628 136 594 166 Z" {...F("adrenalL", KC.adrenal)} {...S("adrenalL", 3)} />
      {/* ureters */}
      <Halo id="ureterR"><path d={smooth(urR)} strokeWidth={12} /></Halo>
      <Tube d={smooth(urR)} w={11} col={F("ureterR", KC.ureter).fill} op={F("ureterR", KC.ureter).opacity} />
      <Halo id="ureterL"><path d={smooth(urL)} strokeWidth={12} /></Halo>
      <Tube d={smooth(urL)} w={11} col={F("ureterL", KC.ureter).fill} op={F("ureterL", KC.ureter).opacity} />
      {/* bladder + urethra */}
      <Halo id="bladder"><path d="M380 600 Q380 570 450 570 Q520 570 520 600 Q520 660 450 662 Q380 660 380 600 Z" strokeWidth={4} /></Halo>
      <path d="M380 600 Q380 570 450 570 Q520 570 520 600 Q520 660 450 662 Q380 660 380 600 Z" {...F("bladder", "#F6D98A")} {...S("bladder", 3.5)} />
      <Halo id="urethra"><path d="M450 662 L450 700" strokeWidth={10} /></Halo>
      <Tube d="M450 662 L450 700" w={10} col={F("urethra", KC.ureter).fill} op={F("urethra", KC.ureter).opacity} />
      {/* level band T12–L3 + vertebra labels on top */}
      {levels > 0 && (
        <g opacity={levels}>
          <path d="M150 102 L760 102" stroke={C.forest} strokeWidth={3} strokeDasharray="10 8" />
          <path d="M150 345 L760 345" stroke={C.forest} strokeWidth={3} strokeDasharray="10 8" />
        </g>
      )}
      {verts.map((v, i) => {
        const y = 40 + i * 62; const on = (i >= 1 && i <= 4 ? 1 : 0) * levels;
        return <text key={v} x={450} y={y + 35} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={21} fill={C.forest} opacity={0.45 + 0.55 * Math.max(levels, on)}>{v}</text>;
      })}
      {/* liver (front, translucent) */}
      {(() => {
        const kk = Math.max(litK(t, lit.liver), 0);
        if (kk <= 0) return null;
        return (
          <g opacity={kk}>
            <path d="M40 60 Q120 10 300 20 Q420 26 470 60 Q430 120 340 160 Q240 210 120 210 Q50 200 40 140 Z" fill={KC.liver} fillOpacity={0.55} stroke={C.forest} strokeWidth={3} />
            <text x={200} y={110} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill="#FFFFFF">liver</text>
            <path d="M270 220 L270 250" stroke={C.red} strokeWidth={8} strokeLinecap="round" />
            <path d="M254 238 L270 258 L286 238" fill="none" stroke={C.red} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      })()}
      <Dots pts={sR} t={t} k={urine} />
      <Dots pts={sL} t={t + 0.4} k={urine} />
      <Dots pts={sampleSmooth([[515, 200], [515, 258], ...la.slice(1)] as [number, number][])} t={t} k={blood} col="#FF8A7A" r={6} speed={0.5} />
      <Dots pts={sampleSmooth([[515, 200], [515, 262], ...ra.slice(1)] as [number, number][])} t={t + 0.3} k={blood} col="#FF8A7A" r={6} speed={0.5} />
      {labels > 0 && (
        <g opacity={labels} fontFamily={FONT} fontWeight={800} fontSize={22} fill={C.forest}>
          <text x={30} y={530}>PATIENT'S</text><text x={30} y={556}>RIGHT</text>
          <text x={870} y={556} textAnchor="end">LEFT</text>
        </g>
      )}
    </svg>
  );
};

/* =====================================================================================
   2. KIDNEY SECTION — coronal section, hilum faces right (viewBox 900 x 700)
   ===================================================================================== */
const SC = { cx: 380, cy: 350, rx: 300, ry: 320 };
const PYR = [55, 95, 135, 180, 225, 265, 305]; // pyramid axis angles (deg), hilum = 0
const COLS = [75, 115, 157, 202, 245, 285]; // renal columns between pyramids
const rO = (deg: number) => beanR(D(deg), SC.rx, SC.ry, 0.3);
const rE = (deg: number) => ellR(D(deg), SC.rx, SC.ry);
const sp = (r: number, deg: number) => P(SC.cx, SC.cy, r, D(deg));
const JN: Record<string, [number, number]> = { up: [392, 280], mid: [318, 350], lo: [392, 420] };
const MAJ: Record<string, { pyr: number[]; j: [number, number]; to: [number, number][] }> = {
  up: { pyr: [55, 95, 135], j: JN.up, to: [JN.up, [418, 298], [450, 318]] },
  mid: { pyr: [180], j: JN.mid, to: [JN.mid, [364, 352], [410, 356]] },
  lo: { pyr: [225, 265, 305], j: JN.lo, to: [JN.lo, [418, 402], [450, 384]] },
};
const cupB = (deg: number) => sp(rE(deg) * 0.385, deg);
export const SEC_PT: Record<string, [number, number]> = {
  cortex: sp(rO(160) * 0.9, 160), capsule: sp(rO(200), 200), medulla: sp(rE(135) * 0.62, 135), pyramid: sp(rE(180) * 0.62, 180), papilla: sp(rE(180) * 0.435, 180),
  column: sp(rE(157) * 0.62, 157), minor: sp(rE(225) * 0.39, 225), major: [400, 425], pelvis: [560, 370], ureter: [700, 600], sinus: [470, 290], hilum: [612, 340],
  renalA: [800, 372], renalV: [800, 318], segmental: [520, 300], interlobar: sp(rE(115) * 0.62, 115), arcuate: sp(rO(135) * 0.79, 155), radiate: sp(rO(140) * 0.9, 140),
  lobe: sp(rE(180) * 0.72, 180), afferent: sp(rO(150) * 0.95, 150),
};
export const KidneySection: React.FC<{ t: number; w: number; lit?: Lit; dim?: number; urine?: number; vessels?: number; vlit?: Lit; segTint?: number; flow?: number; showVein?: number }> = ({ t, w, lit = {}, dim = 1, urine = 0, vessels = 0, vlit = {}, segTint = 0, flow = 0, showVein = 1 }) => {
  const { F, Halo, k } = useGlow(t, { ...lit, ...vlit }, dim);
  const out = beanPath(SC.cx, SC.cy, SC.rx, SC.ry, 1, 1, 0.3);
  const sinPts: [number, number][] = [];
  for (let i = 0; i < 60; i++) {
    const deg = (i / 60) * 360, a = D(deg), aa = Math.atan2(Math.sin(a), Math.cos(a));
    sinPts.push(sp(rE(deg) * (0.37 + 0.48 * Math.exp(-((aa / 0.45) ** 2))), deg));
  }
  const sinus = smooth(sinPts, true);
  const pyrPts = (deg: number): [number, number][] => {
    const base: [number, number][] = [];
    for (let i = 0; i <= 6; i++) { const d = deg - 15 + (30 * i) / 6; base.push(sp(rO(d) * 0.79, d)); }
    return [...base, sp(rE(deg + 10) * 0.62, deg + 10), sp(rE(deg + 5.5) * 0.5, deg + 5.5), sp(rE(deg + 2.5) * 0.445, deg + 2.5), sp(rE(deg) * 0.43, deg), sp(rE(deg - 2.5) * 0.445, deg - 2.5), sp(rE(deg - 5.5) * 0.5, deg - 5.5), sp(rE(deg - 10) * 0.62, deg - 10)];
  };
  const pyr = (deg: number) => smooth(pyrPts(deg), true);
  const stri = (deg: number) => {
    const o: string[] = [];
    for (let i = -6; i <= 6; i++) { const d0 = deg + i * 2.3, d1 = deg + i * 0.35; const p0 = sp(rO(d0) * 0.785, d0), p1 = sp(rE(d1) * 0.46, d1); o.push(`M${p0[0].toFixed(1)} ${p0[1].toFixed(1)} L${p1[0].toFixed(1)} ${p1[1].toFixed(1)}`); }
    return o.join(" ");
  };
  const cup = (deg: number) => smooth([sp(rE(deg - 9.5) * 0.5, deg - 9.5), sp(rE(deg - 7) * 0.425, deg - 7), sp(rE(deg) * 0.395, deg), sp(rE(deg + 7) * 0.425, deg + 7), sp(rE(deg + 9.5) * 0.5, deg + 9.5)]);
  const stalk = (deg: number, j: [number, number]) => { const a = cupB(deg); return smooth([a, [(a[0] * 0.55 + j[0] * 0.45), (a[1] * 0.55 + j[1] * 0.45)], j]); };
  const pelvisD = smooth([[430, 304], [500, 318], [580, 338], [644, 350], [644, 376], [580, 388], [500, 404], [430, 418], [404, 388], [408, 356], [404, 326]], true);
  const ureterD = "M632 364 Q690 380 700 450 Q708 560 690 700";
  const route = (deg: number, key: string): [number, number][] => [sp(rE(deg) * 0.44, deg), cupB(deg), MAJ[key].j, MAJ[key].to[1], MAJ[key].to[2], [560, 362], [640, 364], [684, 396], [702, 480], [692, 700]];
  const hil: [number, number] = [604, 356];
  const segEnds = COLS.map((deg) => sp(rE(deg) * 0.42, deg));
  const segCols = ["#F4C7B8", "#F7E3A3", "#CFE3B4", "#BFE0EA", "#E6C9E8"];
  const collCol = F("major", KC.coll).fill;
  return (
    <svg width={w} height={(w * 700) / 900} viewBox="0 0 900 700" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="kcortex" cx="0.45" cy="0.45" r="0.6"><stop offset="0" stopColor="#EDB896" /><stop offset="1" stopColor="#D98E69" /></radialGradient>
      </defs>
      {showVein > 0 && (
        <g opacity={showVein}>
          <Halo id="renalV"><path d="M598 334 Q700 304 900 318" strokeWidth={30} /></Halo>
          <Tube d="M598 334 Q700 304 900 318" w={30} col={F("renalV", KC.vein).fill} />
        </g>
      )}
      <Halo id="renalA"><path d="M600 362 Q700 382 900 372" strokeWidth={22} /></Halo>
      <Tube d="M600 362 Q700 382 900 372" w={22} col={F("renalA", KC.artery).fill} />
      <Halo id="ureter"><path d={ureterD} strokeWidth={34} /></Halo>
      <Tube d={ureterD} w={34} col={F("ureter", KC.coll).fill} />
      {/* kidney body (cortex) */}
      <Halo id="capsule"><path d={out} strokeWidth={6} /></Halo>
      <path d={out} fill={k("cortex") > 0 ? F("cortex", "#E2A07C").fill : "url(#kcortex)"} opacity={F("cortex", "#E2A07C").opacity} stroke={C.forest} strokeWidth={k("capsule") > 0 ? 9 : 5} />
      <path d={out} fill="none" stroke="#FFFFFF" strokeWidth={2.5} opacity={0.7} transform={`translate(${SC.cx * 0.025} ${SC.cy * 0.025}) scale(0.975)`} />
      <g opacity={0.3}>
        {Array.from({ length: 110 }).map((_, i) => { const d = (i * 37.3) % 360; if (Math.abs(((d + 180) % 360) - 180) < 32) return null; const p = sp(rO(d) * (0.82 + ((i * 13) % 11) / 75), d); return <circle key={i} cx={p[0]} cy={p[1]} r={2.6} fill={KC.cortexDark} />; })}
      </g>
      {segTint > 0 && (
        <g opacity={segTint * 0.8}>
          {[[30, 75], [75, 130], [130, 205], [205, 265], [265, 330]].map(([a0, a1], i) => {
            const pts: [number, number][] = [hil];
            for (let d = a0; d <= a1; d += 3) pts.push(sp(rO(d) * 0.99, d));
            return <path key={i} d={`M${pts.map((p) => p.map((v) => v.toFixed(1)).join(" ")).join(" L")} Z`} fill={segCols[i]} stroke="#FFFFFF" strokeWidth={5} />;
          })}
        </g>
      )}
      {(() => {
        const kk = k("lobe"); if (kk <= 0) return null;
        const pts: [number, number][] = [];
        for (let d = 158; d <= 202; d += 4) pts.push(sp(rO(d) * 0.99, d));
        for (let d = 202; d >= 158; d -= 4) pts.push(sp(rE(d) * 0.43, d));
        return <path d={smooth(pts, true)} fill={C.banana} fillOpacity={0.35 * kk} stroke={C.banana} strokeWidth={10 * kk} strokeLinejoin="round" />;
      })()}
      {/* sinus fat */}
      <Halo id="sinus"><path d={sinus} strokeWidth={3} /></Halo>
      <path d={sinus} fill={F("sinus", KC.sinus).fill} stroke={C.forest} strokeWidth={2.5} />
      <g opacity={0.45}>{Array.from({ length: 16 }).map((_, i) => { const d = (i * 61) % 360; const p = sp(rE(d) * (0.2 + ((i * 7) % 5) / 40), d); return <circle key={i} cx={p[0]} cy={p[1]} r={10} fill="#FFFFFF" />; })}</g>
      {/* pyramids */}
      {PYR.map((deg, i) => {
        const id = i === 3 ? "pyramid" : "medulla";
        return (
          <g key={deg}>
            <Halo id={id}><path d={pyr(deg)} strokeWidth={3} /></Halo>
            {i === 3 && k("medulla") > 0 && <path d={pyr(deg)} fill="none" stroke={C.banana} strokeWidth={16 * k("medulla")} strokeOpacity={0.95} />}
            <path d={pyr(deg)} fill={F(id, KC.pyramid).fill} stroke={C.forest} strokeWidth={3} />
            <path d={stri(deg)} stroke={KC.pyrLine} strokeWidth={2.2} opacity={0.55} />
          </g>
        );
      })}
      {(() => { const kk = k("column"); if (kk <= 0) return null; return COLS.slice(1, 3).map((deg) => { const a = sp(rO(deg) * 0.86, deg), b = sp(rE(deg) * 0.45, deg); return <path key={deg} d={`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`} stroke={C.banana} strokeWidth={24 * kk} strokeLinecap="round" opacity={0.85} />; }); })()}
      {(() => { const kk = k("papilla"); if (kk <= 0) return null; return PYR.map((deg) => { const p = sp(rE(deg) * 0.45, deg); return <circle key={deg} cx={p[0]} cy={p[1]} r={17 * kk} fill="none" stroke={C.red} strokeWidth={5} />; }); })()}
      {/* collecting system: stalks + major calyces */}
      {Object.entries(MAJ).map(([key, m]) => (
        <g key={key}>
          {m.pyr.map((deg) => (
            <g key={deg}>
              <Halo id="major"><path d={stalk(deg, m.j)} strokeWidth={20} /></Halo>
              <Tube d={stalk(deg, m.j)} w={18} col={collCol} />
            </g>
          ))}
          <Halo id="major"><path d={smooth(m.to)} strokeWidth={28} /></Halo>
          <Tube d={smooth(m.to)} w={28} col={collCol} />
        </g>
      ))}
      <Halo id="pelvis"><path d={pelvisD} strokeWidth={4} /></Halo>
      <path d={pelvisD} fill={F("pelvis", KC.coll).fill} stroke={C.forest} strokeWidth={4} strokeLinejoin="round" />
      {/* re-fill the joins so tubes read as one lumen */}
      {Object.values(MAJ).map((m, i) => <path key={i} d={smooth(m.to)} fill="none" stroke={collCol} strokeWidth={28} strokeLinecap="round" opacity={0} />)}
      <path d="M612 363 L650 363" stroke={F("pelvis", KC.coll).fill} strokeWidth={22} />
      {/* minor calyces: cups cradling each papilla */}
      {PYR.map((deg) => (
        <g key={"c" + deg}>
          <Halo id="minor"><path d={cup(deg)} strokeWidth={14} /></Halo>
          <Tube d={cup(deg)} w={13} col={F("minor", KC.coll).fill} />
        </g>
      ))}
      {/* vessels */}
      {vessels > 0 && (
        <g opacity={vessels}>
          {segEnds.map((e, i) => {
            const d = smooth([hil, [(hil[0] + e[0]) / 2 + 20, (hil[1] + e[1]) / 2 + (e[1] - hil[1]) * 0.12], e]);
            return <g key={"s" + i}><Halo id="segmental"><path d={d} strokeWidth={9} /></Halo><Tube d={d} w={8} col={F("segmental", KC.artery).fill} /></g>;
          })}
          {COLS.map((deg) => {
            const a = sp(rE(deg) * 0.42, deg), b = sp(rO(deg) * 0.79, deg);
            const d = `M${a[0].toFixed(1)} ${a[1].toFixed(1)} L${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
            return <g key={"i" + deg}><Halo id="interlobar"><path d={d} strokeWidth={8} /></Halo><Tube d={d} w={7} col={F("interlobar", KC.artery).fill} /></g>;
          })}
          {PYR.map((deg) => {
            const pts: [number, number][] = [];
            for (let d = deg - 21; d <= deg + 21; d += 3) pts.push(sp(rO(d) * 0.8, d));
            const d = smooth(pts);
            return <g key={"a" + deg}><Halo id="arcuate"><path d={d} strokeWidth={7} /></Halo><Tube d={d} w={6} col={F("arcuate", KC.artery).fill} /></g>;
          })}
          {Array.from({ length: 27 }).map((_, i) => {
            const deg = 42 + i * 10.5; if (deg > 320) return null;
            const a = sp(rO(deg) * 0.8, deg), b = sp(rO(deg) * 0.95, deg);
            const d = `M${a[0].toFixed(1)} ${a[1].toFixed(1)} L${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
            return <g key={"r" + i}><Halo id="radiate"><path d={d} strokeWidth={5} /></Halo><Tube d={d} w={4} col={F("radiate", KC.artery).fill} />
              {k("afferent") > 0 && <circle cx={b[0]} cy={b[1]} r={7 * k("afferent")} fill={KC.glom} stroke={C.forest} strokeWidth={2} />}</g>;
          })}
          {flow > 0 && segEnds.map((e, i) => {
            const deg = COLS[i];
            const pts = sampleSmooth([[900, 372], [700, 378], hil, e, sp(rO(deg) * 0.8, deg), sp(rO(deg + 9) * 0.8, deg + 9), sp(rO(deg + 9) * 0.95, deg + 9)] as [number, number][], 8);
            return <Dots key={"f" + i} pts={pts} t={t + i * 0.37} k={flow} n={3} speed={0.22} r={6} col="#FF8A7A" />;
          })}
        </g>
      )}
      {[[95, "up"], [180, "mid"], [265, "lo"], [55, "up"], [305, "lo"]].map(([deg, key], i) => <Dots key={i} pts={sampleSmooth(route(deg as number, key as string), 8)} t={t + i * 0.43} k={urine} n={3} speed={0.16} r={7} />)}
    </svg>
  );
};

/* =====================================================================================
   3. COVERINGS — concentric layers (viewBox 900 x 700)
   ===================================================================================== */
export const LY_PT: Record<string, [number, number]> = { kidney: [420, 360], capsule: [338, 236], peri: [271, 433], fascia: [220, 268], para: [241, 548], adrenal: [430, 140] };
export const Layers: React.FC<{ t: number; w: number; lit?: Lit; dim?: number; grow?: number }> = ({ t, w, lit = {}, dim = 0.5, grow = 1 }) => {
  const { F, Halo, k } = useGlow(t, lit, dim);
  const cx = 430, cy = 360, rx = 130, ry = 175;
  const g = (a: number, b: number) => ramp(grow, a, b);
  const L = (sc: number, dent: number) => beanPath(cx, cy, rx * sc, ry * (1 + (sc - 1) * 0.75), 1, 1, dent);
  const blob = (sc: number, n: number, r: number, op: number) => Array.from({ length: n }).map((_, i) => { const a = (i / n) * Math.PI * 2 + 0.2; return <circle key={i} cx={cx + Math.cos(a) * rx * sc} cy={cy - Math.sin(a) * ry * (1 + (sc - 1) * 0.75)} r={r} fill="#FFFFFF" opacity={op} />; });
  return (
    <svg width={w} height={(w * 700) / 900} viewBox="0 0 900 700" style={{ overflow: "visible" }}>
      <g opacity={g(0.75, 1)}>
        <Halo id="para"><path d={L(2.05, 0.18)} strokeWidth={3} /></Halo>
        <path d={L(2.05, 0.18)} fill={F("para", KC.para).fill} stroke={C.forest} strokeWidth={2} strokeDasharray="6 6" />
        {blob(1.9, 36, 9, 0.35)}
      </g>
      <g opacity={g(0.5, 0.75)}>
        <Halo id="fascia"><path d={L(1.72, 0.2)} strokeWidth={14} /></Halo>
        <path d={L(1.72, 0.2)} fill="none" stroke={F("fascia", KC.fascia).fill} strokeWidth={14} />
        <path d={L(1.72, 0.2)} fill="none" stroke={C.forest} strokeWidth={2} />
      </g>
      <g opacity={g(0.25, 0.5)}>
        <Halo id="peri"><path d={L(1.62, 0.22)} strokeWidth={3} /></Halo>
        <path d={L(1.62, 0.22)} fill={F("peri", KC.peri).fill} stroke="none" />
        {blob(1.32, 30, 12, 0.45)}
      </g>
      <g transform="translate(0 30)" opacity={g(0.4, 0.6)}>
        <Halo id="adrenal"><path d="M352 150 Q392 70 452 78 Q500 92 494 136 Q430 120 352 150 Z" strokeWidth={3} /></Halo>
        <path d="M352 150 Q392 70 452 78 Q500 92 494 136 Q430 120 352 150 Z" fill={F("adrenal", KC.adrenal).fill} stroke={C.forest} strokeWidth={3} />
      </g>
      <path d="M520 372 Q650 380 780 372" fill="none" stroke={KC.artery} strokeWidth={14} strokeLinecap="round" />
      <path d="M520 350 Q650 336 780 344" fill="none" stroke={KC.vein} strokeWidth={16} strokeLinecap="round" />
      <path d="M512 394 Q600 440 620 600" fill="none" stroke={KC.ureter} strokeWidth={14} strokeLinecap="round" />
      <Halo id="capsule"><path d={L(1, 0.3)} strokeWidth={8} /></Halo>
      <path d={L(1, 0.3)} fill={F("kidney", KC.cortex).fill} stroke={C.forest} strokeWidth={4} />
      <path d={L(1, 0.3)} fill="none" stroke="#FFFFFF" strokeWidth={6 + 4 * k("capsule")} opacity={0.9} transform={`translate(${cx * 0.04} ${cy * 0.04}) scale(0.96)`} />
      <path d={beanPath(cx - 12, cy - 14, rx * 0.5, ry * 0.55, 1, 1, 0.1)} fill="#FFFFFF" opacity={0.16} />
    </svg>
  );
};

/* =====================================================================================
   4. HILUM — transverse section through the hilum, seen from above (viewBox 900 x 700). Front = top.
   ===================================================================================== */
export const HI_PT: Record<string, [number, number]> = { vein: [560, 250], artery: [560, 360], pelvis: [560, 470], kidney: [280, 360], sinus: [450, 360] };
export const HilumView: React.FC<{ t: number; w: number; lit?: Lit; dim?: number; order?: number }> = ({ t, w, lit = {}, dim = 1, order = 0 }) => {
  const { F, Halo } = useGlow(t, lit, dim);
  const body = "M500 150 Q420 70 280 80 Q110 100 100 360 Q110 620 280 640 Q420 650 500 570 Q440 540 430 470 Q420 360 430 250 Q440 180 500 150 Z";
  return (
    <svg width={w} height={(w * 700) / 900} viewBox="0 0 900 700" style={{ overflow: "visible" }}>
      <Halo id="kidney"><path d={body} strokeWidth={4} /></Halo>
      <path d={body} {...F("kidney", KC.cortex)} stroke={C.forest} strokeWidth={4} />
      <path d="M440 230 Q350 250 330 360 Q350 470 440 490" fill="none" stroke={KC.pyramid} strokeWidth={50} opacity={0.5} strokeLinecap="round" />
      <path d="M430 250 Q470 300 470 360 Q470 420 430 470 Q470 470 520 440 L520 280 Q470 250 430 250 Z" fill={KC.sinus} opacity={0.8} />
      {/* vein (front) */}
      <Halo id="vein"><path d="M520 250 L880 230" strokeWidth={54} /></Halo>
      <Tube d="M470 250 L880 230" w={54} col={F("vein", KC.vein).fill} op={F("vein", KC.vein).opacity} />
      <Halo id="artery"><path d="M520 360 L880 360" strokeWidth={40} /></Halo>
      <Tube d="M470 360 L880 360" w={40} col={F("artery", KC.artery).fill} op={F("artery", KC.artery).opacity} />
      <Halo id="pelvis"><path d="M520 470 Q700 480 760 640" strokeWidth={48} /></Halo>
      <Tube d="M460 470 Q700 480 760 640" w={48} col={F("pelvis", KC.urine).fill} op={F("pelvis", KC.urine).opacity} />
      {/* front/back arrow */}
      <g fontFamily={FONT} fontWeight={800} fontSize={28} fill={C.forest} opacity={0.4 + 0.6 * order}>
        <path d="M60 120 L60 600" stroke={C.forest} strokeWidth={5} />
        <path d="M44 140 L60 110 L76 140" fill="none" stroke={C.forest} strokeWidth={5} strokeLinejoin="round" />
        <text x={30} y={90}>FRONT</text>
        <text x={30} y={640}>BACK</text>
      </g>
      {order > 0 && (
        <g fontFamily={FONT} fontWeight={800} fontSize={44} fill="#FFFFFF" opacity={order} textAnchor="middle">
          <text x={640} y={257}>V</text>
          <text x={640} y={376}>A</text>
          <text x={600} y={490} fill={C.forest}>P</text>
        </g>
      )}
    </svg>
  );
};

/* =====================================================================================
   5. NEPHRON — schematic (viewBox 900 x 700). Cortex top, medulla below y=330.
   ===================================================================================== */
const N_PCT: [number, number][] = [[400, 168], [372, 188], [320, 176], [286, 214], [330, 244], [282, 272], [318, 302], [320, 330]];
const N_DL: [number, number][] = [[320, 330], [320, 470], [322, 610]];
const N_LOOP: [number, number][] = [[322, 610], [340, 652], [372, 652], [390, 610]];
const N_AL: [number, number][] = [[390, 610], [390, 470], [392, 332]];
const N_DCT: [number, number][] = [[392, 332], [440, 318], [480, 280], [446, 246], [494, 212], [470, 170], [478, 116], [452, 76], [432, 54]];
const N_CT: [number, number][] = [[432, 54], [470, 40], [540, 60], [600, 110], [640, 150]];
const N_CD: [number, number][] = [[640, 150], [640, 400], [640, 690]];
export const NE_PT: Record<string, [number, number]> = {
  glom: [400, 112], caps: [446, 120], pct: [300, 230], dl: [320, 470], loop: [356, 652], al: [390, 470], dct: [482, 250], cd: [640, 480], jga: [420, 52],
  aff: [250, 60], eff: [404, 18], peri: [560, 250], vr: [520, 560], radA: [80, 200], cortex: [40, 40], medulla: [40, 360], papilla: [640, 690], podo: [448, 92],
};
export const Nephron: React.FC<{ t: number; w: number; lit?: Lit; dim?: number; flow?: number; filt?: number; caps?: number }> = ({ t, w, lit = {}, dim = 1, flow = 0, filt = 0, caps = 1 }) => {
  const { F, Halo, k } = useGlow(t, lit, dim, { dl: "loop", al: "loop", loopB: "loop" });
  const seg = (id: string, pts: [number, number][], col: string, wd = 18) => (
    <g key={id}>
      <Halo id={id}><path d={smooth(pts)} strokeWidth={wd + 6} /></Halo>
      <Tube d={smooth(pts)} w={wd} col={F(id, col).fill} op={F(id, col).opacity} />
    </g>
  );
  const all = [...N_PCT, ...N_DL.slice(1), ...N_LOOP.slice(1), ...N_AL.slice(1), ...N_DCT.slice(1), ...N_CT.slice(1), ...N_CD.slice(1)];
  const path = sampleSmooth(all, 6);
  // glomerulus tuft
  const tuft: string[] = [];
  for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 2; tuft.push(`M400 70 Q${400 + Math.cos(a) * 46} ${112 + Math.sin(a) * 40} ${400 + Math.cos(a + 0.6) * 22} ${112 + Math.sin(a + 0.6) * 24}`); }
  return (
    <svg width={w} height={(w * 700) / 900} viewBox="0 0 900 700" style={{ overflow: "visible" }}>
      <rect x={0} y={0} width={900} height={330} fill={F("cortex", "#F6E8DA").fill} rx={24} />
      <rect x={0} y={330} width={900} height={370} fill={F("medulla", "#EBCFC6").fill} rx={24} />
      <path d="M0 330 L900 330" stroke={C.forest} strokeWidth={2} strokeDasharray="10 8" opacity={0.5} />
      <g fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.forest} opacity={0.6}>
        <text x={160} y={316}>CORTEX</text>
        <text x={160} y={686}>MEDULLA</text>
      </g>
      {/* cortical radiate artery + vein */}
      <Halo id="radA"><path d="M90 330 L90 10" strokeWidth={16} /></Halo>
      <Tube d="M90 330 L90 10" w={16} col={F("radA", KC.artery).fill} />
      <Tube d="M130 330 L130 10" w={14} col={F("radV", KC.vein).fill} op={0.85} />
      {/* peritubular capillaries + vasa recta (behind tubules) */}
      <g opacity={0.9}>
        <Halo id="peri"><path d="M404 18 L560 18 Q600 60 560 120 Q510 170 560 220 Q600 270 540 300 Q470 320 420 290 Q360 260 250 270 Q200 250 250 200 Q300 160 250 130" strokeWidth={8} /></Halo>
        <path d="M404 18 L560 18 Q600 60 560 120 Q510 170 560 220 Q600 270 540 300 Q470 320 420 290 Q360 260 250 270 Q200 250 250 200 Q300 160 250 130 L135 130" fill="none" stroke={F("peri", "#D9735F").fill} strokeWidth={6} strokeLinecap="round" />
        {[[540, 60, 600, 150], [520, 180, 590, 260], [260, 200, 360, 250], [440, 230, 520, 300]].map(([a, b, c, d], i) => (
          <path key={i} d={`M${a} ${b} Q${(a + c) / 2 + 30} ${(b + d) / 2 - 30} ${c} ${d} M${a} ${d} Q${(a + c) / 2 - 30} ${(b + d) / 2 + 30} ${c} ${b}`} fill="none" stroke={F("peri", "#D9735F").fill} strokeWidth={4} opacity={0.8} />
        ))}
        <Halo id="vr"><path d="M500 310 L500 600 Q520 640 540 600 L540 310" strokeWidth={8} /></Halo>
        <path d="M500 300 L500 600 Q520 640 540 600 L540 300" fill="none" stroke={F("vr", "#D9735F").fill} strokeWidth={7} />
        <path d="M540 300 Q520 290 135 290" fill="none" stroke={mix(KC.vein, "#FFFFFF", 0.3)} strokeWidth={5} opacity={0.7} />
      </g>
      {/* afferent + efferent arterioles */}
      <Halo id="aff"><path d="M90 60 Q250 50 386 70" strokeWidth={14} /></Halo>
      <Tube d="M90 60 Q250 50 386 70" w={14} col={F("aff", KC.artery).fill} />
      <Halo id="eff"><path d="M410 70 L404 18" strokeWidth={10} /></Halo>
      <Tube d="M410 70 L404 18 L560 18" w={9} col={F("eff", "#D9735F").fill} />
      {/* tubule segments */}
      {seg("pct", N_PCT, KC.pct)}
      {seg("dl", N_DL, KC.loopD, 14)}
      {seg("loopB", N_LOOP, KC.loopD, 14)}
      {seg("al", N_AL, KC.loopA, 16)}
      {seg("dct", N_DCT, KC.dct)}
      {seg("cd", [...N_CT], KC.cd, 16)}
      {seg("cd", N_CD, KC.cd, 26)}
      {/* renal corpuscle */}
      {caps > 0 && (
        <g>
          <Halo id="caps"><circle cx={400} cy={114} r={58} strokeWidth={8} /></Halo>
          <circle cx={400} cy={114} r={58} fill={F("caps", KC.caps).fill} stroke={C.forest} strokeWidth={4} />
          <circle cx={400} cy={114} r={46} fill="#FFFDF3" stroke={C.forest} strokeWidth={2} />
          <Halo id="glom"><circle cx={400} cy={112} r={34} strokeWidth={6} /></Halo>
          <g>{tuft.map((d, i) => <path key={i} d={d} fill="none" stroke={F("glom", KC.glom).fill} strokeWidth={7} strokeLinecap="round" />)}</g>
          {k("podo") > 0 && <g opacity={k("podo")}>{Array.from({ length: 10 }).map((_, i) => { const a = (i / 10) * Math.PI * 2; return <circle key={i} cx={400 + Math.cos(a) * 36} cy={112 + Math.sin(a) * 34} r={6} fill="#8FA86A" stroke={C.forest} strokeWidth={2} />; })}</g>}
        </g>
      )}
      {/* JGA */}
      {(() => { const kk = k("jga"); if (kk <= 0) return null; return <g opacity={kk}><circle cx={424} cy={56} r={24} fill="none" stroke={C.red} strokeWidth={5} strokeDasharray="6 5" /><circle cx={436} cy={58} r={6} fill="#3F9BB8" stroke={C.forest} strokeWidth={2} /><circle cx={378} cy={66} r={6} fill="#E8796B" stroke={C.forest} strokeWidth={2} /></g>; })()}
      {/* filtration dots: blood → capsule */}
      {filt > 0 && (
        <g opacity={filt}>
          {Array.from({ length: 10 }).map((_, i) => {
            const u = (t * 0.6 + i / 10) % 1; const a = (i / 10) * Math.PI * 2;
            const r = 20 + u * 22;
            return <circle key={i} cx={400 + Math.cos(a) * r} cy={112 + Math.sin(a) * r} r={4} fill="#3F9BB8" opacity={Math.min(1, (1 - u) * 4)} />;
          })}
        </g>
      )}
      <Dots pts={path} t={t} k={flow} n={14} speed={0.07} r={6} col="#F2D14E" />
    </svg>
  );
};

/* cortical vs juxtamedullary nephron mini diagram (viewBox 900 x 700) */
export const TwoNephrons: React.FC<{ t: number; w: number; a: number }> = ({ t, w, a }) => {
  const one = (x: number, top: number, depth: number, col: string, k: number) => (
    <g opacity={k}>
      <circle cx={x} cy={top} r={30} fill={KC.caps} stroke={C.forest} strokeWidth={3} />
      <circle cx={x} cy={top} r={16} fill={KC.glom} />
      <Tube d={`M${x + 20} ${top + 22} Q${x + 60} ${top + 60} ${x + 40} ${top + 90} L${x + 40} ${depth} Q${x + 60} ${depth + 40} ${x + 80} ${depth} L${x + 80} ${top + 60}`} w={14} col={col} />
    </g>
  );
  return (
    <svg width={w} height={(w * 700) / 900} viewBox="0 0 900 700">
      <rect x={0} y={0} width={900} height={300} fill="#F6E8DA" rx={24} />
      <rect x={0} y={300} width={900} height={400} fill="#EBCFC6" rx={24} />
      <path d="M0 300 L900 300" stroke={C.forest} strokeWidth={2} strokeDasharray="10 8" opacity={0.5} />
      <g fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.forest} opacity={0.6}><text x={20} y={286}>CORTEX</text><text x={160} y={686}>MEDULLA</text></g>
      {one(220, 90, 280, KC.loopD, ramp(t, a, a + 0.4))}
      {one(600, 230, 640, KC.loopA, ramp(t, a + 1.2, a + 1.6))}
    </svg>
  );
};

/* kidney size card: bean with dimension arrows (viewBox 900 x 700) */
export const SizeCard: React.FC<{ t: number; w: number; a: number }> = ({ t, w, a }) => {
  const k1 = ramp(t, a, a + 0.5), k2 = ramp(t, a + 1.2, a + 1.7), k3 = ramp(t, a + 2.4, a + 2.9);
  const out = beanPath(380, 350, 170, 280, 1, 1, 0.3);
  const lab = (x: number, y: number, s: string, k: number) => <text x={x} y={y} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={C.forest} opacity={k}>{s}</text>;
  return (
    <svg width={w} height={(w * 700) / 900} viewBox="0 0 900 700">
      <path d={out} fill={KC.cortex} stroke={C.forest} strokeWidth={5} />
      <path d={beanPath(368, 330, 90, 150, 1, 1, 0.1)} fill="#FFFFFF" opacity={0.18} />
      <g opacity={k1}><path d="M640 70 L640 630" stroke={C.forest} strokeWidth={5} /><path d="M622 92 L640 66 L658 92 M622 608 L640 634 L658 608" fill="none" stroke={C.forest} strokeWidth={5} /></g>
      {lab(770, 365, "11–14 cm", k1)}
      <g opacity={k2}><path d="M212 670 L528 670" stroke={C.forest} strokeWidth={5} /><path d="M234 652 L208 670 L234 688 M506 652 L532 670 L506 688" fill="none" stroke={C.forest} strokeWidth={5} /></g>
      <text x={560} y={684} fontFamily={FONT} fontWeight={800} fontSize={36} fill={C.forest} opacity={k2}>6 cm wide</text>
      {lab(380, 360, "4 cm thick", k3)}
    </svg>
  );
};
