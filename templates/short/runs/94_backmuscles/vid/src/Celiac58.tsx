import React from "react";
import { C, ramp } from "./kit";

/**
 * Book Plume original schematic of the celiac trunk and its three branches, FRONT view.
 * Viewer's left = patient's RIGHT (liver side). viewBox 860 x 860.
 * Layout follows Gray's 1918 Fig. 533 (stomach lifted, pancreas below, spleen at the far left of the patient).
 */
export type Part = "AO" | "CT" | "LG" | "CH" | "SP" | "STO" | "LIV" | "GB" | "SPL" | "PAN" | "DUO" | "DIA" | "LC";
type P = [number, number];

/* Catmull-Rom → cubic Bézier */
const smooth = (pts: P[], closed = true, tension = 0.5) => {
  const n = pts.length;
  const g = (i: number) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
    const c1: P = [p1[0] + ((p2[0] - p0[0]) * tension) / 3, p1[1] + ((p2[1] - p0[1]) * tension) / 3];
    const c2: P = [p2[0] - ((p3[0] - p1[0]) * tension) / 3, p2[1] - ((p3[1] - p1[1]) * tension) / 3];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + (closed ? " Z" : "");
};
export const mix = (a: string, b: string, k: number) => {
  const h = (s: string) => [1, 3, 5].map((j) => parseInt(s.slice(j, j + 2), 16));
  const x = h(a), y = h(b);
  return "#" + x.map((v, j) => Math.round(v + (y[j] - v) * Math.max(0, Math.min(1, k))).toString(16).padStart(2, "0")).join("");
};

/* ---------- geometry ---------- */
export const ORIGIN: P = [400, 292]; // where the trunk leaves the aorta
export const TRI: P = [446, 332]; // trifurcation
const AORTA_X = 400;

const LIVER: P[] = [[40, 196], [110, 150], [220, 128], [330, 128], [410, 140], [470, 160], [452, 192], [390, 214], [330, 240], [300, 286], [262, 318], [190, 330], [110, 318], [52, 282], [26, 236]];
const GB: P[] = [[186, 304], [216, 314], [230, 350], [220, 384], [194, 392], [174, 372], [172, 334]];
const STOMACH: P[] = [
  [492, 168], [522, 118], [586, 82], [668, 72], [748, 104], [796, 170], [800, 252], [770, 326], [704, 380], [618, 402], [540, 404], [486, 394], [452, 380],
  [452, 352], [492, 350], [530, 330], [546, 286], [540, 232], [516, 194],
];
// lesser curvature = the inner (viewer-left) edge, from cardia to pylorus
const LESSER: P[] = [[504, 178], [532, 216], [546, 268], [536, 318], [500, 346], [458, 354]];
const ESO = "M474 0 C478 60 484 120 498 172";
const SPLEEN: P[] = [[792, 404], [822, 380], [848, 404], [856, 470], [846, 540], [818, 580], [790, 566], [776, 520], [790, 470], [782, 432]];
const PANC: P[] = [
  [292, 486], [340, 470], [410, 474], [480, 470], [560, 462], [640, 456], [714, 448], [770, 440], [792, 456], [770, 482], [700, 498], [620, 506], [540, 516],
  [470, 524], [420, 534], [390, 566], [372, 616], [330, 640], [286, 626], [266, 580], [270, 520],
];
const DUO: P[] = [[452, 372], [402, 380], [330, 392], [262, 420], [226, 480], [216, 560], [226, 646], [262, 700], [340, 724], [440, 718], [520, 690], [560, 656]];
const DIA_L = "M0 150 C90 70 250 40 372 100";
const DIA_R = "M428 100 C540 34 700 24 860 104";

// arteries
const AORTA = `M${AORTA_X} 70 L${AORTA_X} 860`;
const CT = `M${ORIGIN[0] + 18} ${ORIGIN[1]} C${ORIGIN[0] + 34} ${ORIGIN[1] + 10} ${TRI[0] - 12} ${TRI[1] - 16} ${TRI[0]} ${TRI[1]}`;
const LG = `M${TRI[0]} ${TRI[1]} C${TRI[0] + 2} ${TRI[1] - 50} 452 236 476 200 C484 188 494 184 504 190 C526 214 544 256 542 300 C540 330 522 348 496 356`;
const LGT = ["M522 220 C540 214 556 206 572 196", "M541 262 C560 262 578 258 596 252", "M538 312 C556 318 574 324 590 334", "M486 194 C482 172 482 150 484 126"];
const CH = `M${TRI[0]} ${TRI[1]} C410 362 340 368 286 356`;
const PH = "M286 356 C268 330 256 300 246 262"; // proper hepatic → liver
const CY = "M254 296 C238 302 226 310 216 318"; // cystic → gallbladder
const GD = "M286 356 C294 386 300 420 300 462"; // gastroduodenal → duodenum
const SPpts: P[] = (() => {
  const pts: P[] = [];
  const a: P = TRI, b: P = [800, 446];
  for (let i = 0; i <= 40; i++) {
    const u = i / 40;
    const x = a[0] + (b[0] - a[0]) * u;
    const base = a[1] + (b[1] - a[1]) * Math.pow(u, 0.35);
    const wig = Math.sin(u * Math.PI * 5.2) * 15 * Math.min(1, u * 5) * (1 - 0.3 * u);
    pts.push([x, base + wig]);
  }
  return pts;
})();
const SP = smooth(SPpts, false);
const SHORT_G = "M760 430 C772 400 780 360 782 330"; // short gastric hint
const LGE = "M770 448 C740 430 720 410 700 386"; // left gastro-omental start

export const ANCHOR: Record<string, P> = {
  CT: [430, 312], LG: [510, 214], CH: [352, 360], SP: [640, 452], LC: [546, 280],
  LIV: [150, 230], GB: [200, 360], STO: [680, 220], SPL: [822, 480], PAN: [560, 488], DUO: [228, 580], AO: [400, 720], DIA: [190, 96], T12: [400, 292],
};

export const ART = { fill: "#D8574B", dark: "#A23125", light: "#FFD9CF" };

const Tube: React.FC<{ d: string; width: number; g?: number; glowA?: number; op?: number; col?: typeof ART }> = ({ d, width, g = 1, glowA = 0, op = 1, col = ART }) => {
  if (g <= 0) return null;
  const dash = g >= 1 ? undefined : `${g} 1`;
  const Pth = (p: React.SVGProps<SVGPathElement>) => <path d={d} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={dash} {...p} />;
  return (
    <g opacity={op}>
      {glowA > 0 && Pth({ stroke: C.banana, strokeWidth: width + 30, opacity: glowA * 0.95 })}
      {Pth({ stroke: C.forest, strokeWidth: width + 8 })}
      {Pth({ stroke: col.dark, strokeWidth: width })}
      {Pth({ stroke: col.fill, strokeWidth: width * 0.66, transform: "translate(-1.5 -1)" })}
      {Pth({ stroke: col.light, strokeWidth: Math.max(2, width * 0.16), opacity: 0.6, transform: `translate(${-width * 0.18} ${-width * 0.1})` })}
    </g>
  );
};

const ORG: Record<string, { fill: string; dark: string }> = {
  LIV: { fill: "#C98466", dark: "#8E5136" },
  GB: { fill: "#9DB86A", dark: "#5C7A2F" },
  STO: { fill: "#EDB9A8", dark: "#B97C68" },
  SPL: { fill: "#A6627F", dark: "#6E3651" },
  PAN: { fill: "#F0D490", dark: "#B8974A" },
  DUO: { fill: "#E9C0AE", dark: "#B48672" },
};

export const CeliacDiagram: React.FC<{
  t: number;
  w?: number;
  grow?: Partial<Record<Part, number>>; // grow-in start times
  lit?: Partial<Record<Part, number>>; // times parts light up
  glow?: Part[]; // pulsing banana halo
  dim?: number; // 0..1 how much unlit things fade
  organs?: number; // 0..1 organ visibility
  t12?: number; // 0..1 vertebra marker
  wiggle?: number; // splenic shimmer travelling along it
  hideDia?: boolean;
}> = ({ t, w = 860, grow = {}, lit = {}, glow = [], dim = 0, organs = 1, t12 = 0, wiggle, hideDia }) => {
  const on = (p: Part) => (lit[p] === undefined ? 0 : ramp(t, lit[p]! - 0.05, lit[p]! + 0.3));
  const gp = (p: Part, d = 0.6) => (grow[p] === undefined ? 1 : ramp(t, grow[p]!, grow[p]! + d));
  const a = (p: Part) => 1 - 0.65 * dim * (1 - on(p));
  const halo = (p: Part) => (glow.includes(p) ? on(p) * (0.6 + 0.4 * Math.sin(t * 7)) : 0);
  const organ = (id: "LIV" | "GB" | "STO" | "SPL" | "PAN" | "DUO", pts: P[], closed = true) => {
    const L = on(id);
    const c = ORG[id];
    const fill = mix(mix(c.fill, C.paper, 0.4 + 0.35 * dim), c.fill, L);
    const h = halo(id);
    return (
      <g opacity={organs}>
        {h > 0 && <path d={smooth(pts, closed)} fill="none" stroke={C.banana} strokeWidth={28} strokeLinejoin="round" opacity={h} />}
        <path d={smooth(pts, closed)} fill={fill} stroke={mix(c.dark, C.forest, 0.35)} strokeWidth={5} strokeLinejoin="round" />
        <path d={smooth(pts, closed)} fill="none" stroke="#FFFFFF" strokeWidth={3} opacity={0.35} transform="translate(-3 -3) " strokeDasharray="40 900" />
      </g>
    );
  };
  // pancreas lobules
  const lob: P[] = [];
  for (let i = 0; i < 26; i++) {
    const u = i / 25;
    lob.push([300 + u * 470, 488 + Math.sin(i * 2.3) * 7 + (u < 0.18 ? 40 + 60 * (0.18 - u) : 0) - u * 10]);
  }
  const lcP = on("LC");
  const sh = wiggle === undefined ? -1 : ((t - wiggle) % 1.4) / 1.4;
  return (
    <svg width={w} height={w} viewBox="0 0 860 860" style={{ overflow: "visible", display: "block" }}>
      <defs>
        <radialGradient id="cvert" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFFDF2" />
          <stop offset="100%" stopColor="#E3DBBF" />
        </radialGradient>
      </defs>
      {/* T12 vertebral body behind the aorta */}
      {t12 > 0 && (
        <g opacity={t12}>
          <rect x={AORTA_X - 78} y={ORIGIN[1] - 34} width={156} height={66} rx={16} fill="url(#cvert)" stroke={C.forest} strokeWidth={5} />
          <rect x={AORTA_X - 78} y={ORIGIN[1] - 84} width={156} height={38} rx={12} fill="#EFE8D0" stroke={C.forest} strokeWidth={4} opacity={0.55} />
          <rect x={AORTA_X - 78} y={ORIGIN[1] + 44} width={156} height={38} rx={12} fill="#EFE8D0" stroke={C.forest} strokeWidth={4} opacity={0.55} />
        </g>
      )}
      {/* diaphragm */}
      {!hideDia && (
        <g opacity={organs * a("DIA")}>
          {halo("DIA") > 0 && [DIA_L, DIA_R].map((d, i) => <path key={i} d={d} fill="none" stroke={C.banana} strokeWidth={60} strokeLinecap="round" opacity={halo("DIA")} />)}
          {[DIA_L, DIA_R].map((d, i) => (
            <g key={i}>
              <path d={d} fill="none" stroke={C.forest} strokeWidth={34} strokeLinecap="round" />
              <path d={d} fill="none" stroke={mix("#D99A86", "#E46A55", on("DIA"))} strokeWidth={26} strokeLinecap="round" />
              <path d={d} fill="none" stroke="#FFE7DD" strokeWidth={3} strokeLinecap="round" strokeDasharray="10 14" opacity={0.7} />
            </g>
          ))}
        </g>
      )}
      {/* organs */}
      {/* aorta */}
      <Tube d={AORTA} width={66} g={gp("AO", 1.0)} glowA={halo("AO")} op={a("AO")} />
      {organ("LIV", LIVER)}
      <g opacity={organs}>
        <path d={smooth(DUO, false)} fill="none" stroke={mix(ORG.DUO.dark, C.forest, 0.35)} strokeWidth={62} strokeLinecap="round" strokeLinejoin="round" />
        {halo("DUO") > 0 && <path d={smooth(DUO, false)} fill="none" stroke={C.banana} strokeWidth={80} strokeLinecap="round" opacity={halo("DUO") * 0.6} />}
        <path d={smooth(DUO, false)} fill="none" stroke={mix(mix(ORG.DUO.fill, C.paper, 0.4 + 0.35 * dim), ORG.DUO.fill, on("DUO"))} strokeWidth={52} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {organ("SPL", SPLEEN)}
      {organ("PAN", PANC)}
      <g opacity={organs * 0.5}>
        {lob.map(([x, y], i) => <circle key={i} cx={x} cy={y + 12} r={9 + (i % 3) * 2} fill="none" stroke={ORG.PAN.dark} strokeWidth={2.5} />)}
      </g>
      {organ("STO", STOMACH)}
      {/* esophagus */}
      <g opacity={organs}>
        <path d={ESO} fill="none" stroke={mix(ORG.STO.dark, C.forest, 0.35)} strokeWidth={46} strokeLinecap="round" />
        <path d={ESO} fill="none" stroke={mix(mix(ORG.STO.fill, C.paper, 0.4 + 0.35 * dim), ORG.STO.fill, on("STO"))} strokeWidth={37} strokeLinecap="round" />
      </g>
      {organ("GB", GB)}
      {/* lesser curvature highlight */}
      {lcP > 0 && <path d={smooth(LESSER, false)} fill="none" stroke={C.banana} strokeWidth={22} strokeLinecap="round" strokeDasharray={`${lcP} 1`} pathLength={1} opacity={0.85} />}
      {/* arteries */}
      <Tube d={SHORT_G} width={9} g={gp("SP", 1.6) >= 1 ? 1 : 0} op={a("SP") * 0.9} />
      <Tube d={LGE} width={9} g={gp("SP", 1.6) >= 1 ? 1 : 0} op={a("SP") * 0.9} />
      <Tube d={SP} width={28} g={gp("SP", 1.4)} glowA={halo("SP")} op={a("SP")} />
      {sh >= 0 && on("SP") > 0 && <path d={SP} fill="none" stroke="#FFF6C8" strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray="0.08 1" strokeDashoffset={-sh * 1.08 + 0.08} opacity={0.95} />}
      <Tube d={GD} width={12} g={gp("CH", 1.2) >= 1 ? 1 : 0} op={a("CH")} />
      <Tube d={CY} width={8} g={gp("CH", 1.2) >= 1 ? 1 : 0} op={a("CH")} />
      <Tube d={PH} width={15} g={Math.max(0, (gp("CH", 1.2) - 0.5) * 2)} glowA={halo("CH")} op={a("CH")} />
      <Tube d={CH} width={22} g={Math.min(1, gp("CH", 1.2) * 2)} glowA={halo("CH")} op={a("CH")} />
      {LGT.map((d, i) => <Tube key={i} d={d} width={7} g={Math.max(0, gp("LG", 1.0) * 1.6 - 0.6)} op={a("LG") * 0.95} />)}
      <Tube d={LG} width={15} g={gp("LG", 1.0)} glowA={halo("LG")} op={a("LG")} />
      <Tube d={CT} width={34} g={gp("CT", 0.4)} glowA={halo("CT")} op={a("CT")} />
      {gp("CT", 0.4) >= 1 && <circle cx={TRI[0]} cy={TRI[1]} r={15} fill={ART.fill} stroke={C.forest} strokeWidth={4} opacity={a("CT")} />}
    </svg>
  );
};
