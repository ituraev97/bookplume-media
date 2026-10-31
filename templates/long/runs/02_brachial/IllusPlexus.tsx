import React from "react";
import { C, FONT, ramp } from "./kit";

/* ===== Book Plume's own brachial plexus illustrations (original schematic artwork) ===== */

export const PC = {
  root: "#9DBB7A",
  trunk: "#E7C35A",
  ant: "#6FA3D2",
  post: "#E39A5B",
  neutral: "#E4DED0",
  artery: "#C9483C",
};

type P = { d: string; col: string; kind: "root" | "trunk" | "div" | "cord" | "br" | "small" };
const X0 = 90, XT = 240, XTE = 370, XC = 520, XCE = 640, XB = 810;
const RY = { R5: 110, R6: 200, R7: 300, R8: 400, R1: 490 } as const;
const TY = { TS: 155, TM: 300, TI: 445 } as const;
const CY = { CL: 150, CM: 330, CP: 530 } as const;
const cub = (x1: number, y1: number, x2: number, y2: number) => {
  const m = (x2 - x1) * 0.5;
  return `M${x1} ${y1} C${x1 + m} ${y1} ${x2 - m} ${y2} ${x2} ${y2}`;
};
export const PATHS: Record<string, P> = {
  R5: { d: cub(X0, RY.R5, XT, TY.TS), col: PC.root, kind: "root" },
  R6: { d: cub(X0, RY.R6, XT, TY.TS), col: PC.root, kind: "root" },
  R7: { d: cub(X0, RY.R7, XT, TY.TM), col: PC.root, kind: "root" },
  R8: { d: cub(X0, RY.R8, XT, TY.TI), col: PC.root, kind: "root" },
  R1: { d: cub(X0, RY.R1, XT, TY.TI), col: PC.root, kind: "root" },
  TS: { d: `M${XT} ${TY.TS} L${XTE} ${TY.TS}`, col: PC.trunk, kind: "trunk" },
  TM: { d: `M${XT} ${TY.TM} L${XTE} ${TY.TM}`, col: PC.trunk, kind: "trunk" },
  TI: { d: `M${XT} ${TY.TI} L${XTE} ${TY.TI}`, col: PC.trunk, kind: "trunk" },
  DSP: { d: cub(XTE, TY.TS, XC, CY.CP), col: PC.post, kind: "div" },
  DMP: { d: cub(XTE, TY.TM, XC, CY.CP), col: PC.post, kind: "div" },
  DIP: { d: cub(XTE, TY.TI, XC, CY.CP), col: PC.post, kind: "div" },
  DSA: { d: cub(XTE, TY.TS, XC, CY.CL), col: PC.ant, kind: "div" },
  DMA: { d: cub(XTE, TY.TM, XC, CY.CL), col: PC.ant, kind: "div" },
  DIA: { d: cub(XTE, TY.TI, XC, CY.CM), col: PC.ant, kind: "div" },
  CP: { d: `M${XC} ${CY.CP} L${XCE} ${CY.CP}`, col: PC.post, kind: "cord" },
  CL: { d: `M${XC} ${CY.CL} L${XCE} ${CY.CL}`, col: PC.ant, kind: "cord" },
  CM: { d: `M${XC} ${CY.CM} L${XCE} ${CY.CM}`, col: PC.ant, kind: "cord" },
  BAX: { d: cub(XCE, CY.CP, XB, 460), col: PC.post, kind: "br" },
  BRA: { d: cub(XCE, CY.CP, XB, 600), col: PC.post, kind: "br" },
  BMC: { d: cub(XCE, CY.CL, XB, 70), col: PC.ant, kind: "br" },
  BML: { d: cub(XCE, CY.CL, 730, 245), col: PC.ant, kind: "br" },
  BMM: { d: cub(XCE, CY.CM, 730, 245), col: PC.ant, kind: "br" },
  BMD: { d: `M730 245 L${XB} 245`, col: PC.ant, kind: "br" },
  BU: { d: cub(XCE, CY.CM, XB, 345), col: PC.ant, kind: "br" },
  DSC: { d: `M140 ${RY.R5 + 4} C150 80 150 60 175 40`, col: PC.root, kind: "small" },
  LT: { d: `M125 ${RY.R5 + 8} C140 260 140 450 175 640 M122 ${RY.R6 + 6} C134 230 136 330 142 360 M124 ${RY.R7 + 5} C132 320 134 340 138 360`, col: PC.root, kind: "small" },
  SS: { d: `M300 ${TY.TS} C310 120 320 90 350 60`, col: PC.trunk, kind: "small" },
};
const ORDER = ["LT", "R5", "R6", "R7", "R8", "R1", "DSC", "SS", "TS", "TM", "TI", "DSP", "DMP", "DIP", "DSA", "DMA", "DIA", "CP", "CL", "CM", "BAX", "BRA", "BMC", "BML", "BMM", "BMD", "BU"];

export const COLX = { roots: (X0 + XT) / 2, trunks: (XT + XTE) / 2, divisions: (XTE + XC) / 2, cords: (XC + XCE) / 2, branches: (XCE + XB) / 2 };

type Lbl = { x: number; y: number; text: string; t: number; color?: string; anchor?: "start" | "middle" | "end"; size?: number };
export const PLX_LABELS = {
  roots: [
    { x: X0 - 24, y: RY.R5 + 11, text: "C5", anchor: "end" as const },
    { x: X0 - 24, y: RY.R6 + 11, text: "C6", anchor: "end" as const },
    { x: X0 - 24, y: RY.R7 + 11, text: "C7", anchor: "end" as const },
    { x: X0 - 24, y: RY.R8 + 11, text: "C8", anchor: "end" as const },
    { x: X0 - 24, y: RY.R1 + 11, text: "T1", anchor: "end" as const },
  ],
};

export const Plexus: React.FC<{
  t: number;
  w?: number;
  lit?: Record<string, number>; // id -> time it lights in its own colour
  hot?: { ids: string[]; a: number; b: number }[]; // banana glow
  dim?: number; // time after which unlit parts dim
  cols?: Partial<Record<keyof typeof COLX, number>>; // column headers lit
  colHot?: { c: keyof typeof COLX; a: number; b: number }[];
  rootLbl?: number;
  labels?: Lbl[];
  artery?: number;
  flow?: number;
  small?: boolean;
  focus?: boolean;
}> = ({ t, w = 1000, lit = {}, hot = [], dim, cols = {}, colHot = [], rootLbl, labels = [], artery, flow, small = false, focus = false }) => {
  const h = w * 0.7;
  const dimK = dim !== undefined ? ramp(t, dim, dim + 0.5) : 0;
  const lerp = (a: string, b: string, k: number) => {
    const p = (x: string) => [1, 3, 5].map((i) => parseInt(x.slice(i, i + 2), 16));
    const A = p(a), B = p(b);
    return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(",")})`;
  };
  const hotK = (id: string) => {
    let k = 0;
    hot.forEach((hh) => {
      if (hh.ids.includes(id)) k = Math.max(k, ramp(t, hh.a, hh.a + 0.3) * (1 - ramp(t, hh.b - 0.2, hh.b + 0.2)));
    });
    return k;
  };
  const artK = artery !== undefined ? ramp(t, artery, artery + 0.5) : 0;
  return (
    <svg width={w} height={h} viewBox="0 0 1000 700" style={{ overflow: "visible" }}>
      <defs>
        <filter id="plxglow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      {/* column bands */}
      {(Object.keys(COLX) as (keyof typeof COLX)[]).map((c) => {
        const on = cols[c] !== undefined ? ramp(t, cols[c]!, cols[c]! + 0.35) : 0;
        let hk = 0;
        colHot.forEach((ch) => { if (ch.c === c) hk = Math.max(hk, ramp(t, ch.a, ch.a + 0.3) * (1 - ramp(t, ch.b - 0.2, ch.b + 0.2))); });
        const span = { roots: [X0 - 70, XT], trunks: [XT, XTE], divisions: [XTE, XC], cords: [XC, XCE], branches: [XCE, XB + 10] }[c];
        return (
          <g key={c} opacity={0.25 + 0.75 * on}>
            <rect x={span[0] + 4} y={20} width={span[1] - span[0] - 8} height={600} rx={22} fill={hk > 0 ? lerp("#FFFEF6", "#F2D14E", hk * 0.55) : "#FFFEF6"} opacity={0.55 + 0.45 * hk} stroke={hk > 0 ? C.bananaDark : C.line} strokeWidth={hk > 0 ? 4 : 2} strokeDasharray={hk > 0 ? "0" : "6 8"} />
            <text x={COLX[c]} y={672} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={22} letterSpacing={1} fill={hk > 0.3 ? C.forest : C.matcha}>{c.toUpperCase()}</text>
          </g>
        );
      })}
      {/* axillary artery (drawn under nerves) */}
      {artK > 0 && (
        <g opacity={artK}>
          <path d={`M${XC - 60} 240 L${XB + 10} 240`} stroke={C.redDark} strokeWidth={40} strokeLinecap="round" />
          <path d={`M${XC - 60} 240 L${XB + 10} 240`} stroke={PC.artery} strokeWidth={32} strokeLinecap="round" />
          <path d={`M${XC - 60} 233 L${XB + 10} 233`} stroke={C.redLight} strokeWidth={6} strokeLinecap="round" opacity={0.7} />
        </g>
      )}
      {ORDER.map((id) => {
        const p = PATHS[id];
        const lt = lit[id];
        const on = lt !== undefined ? ramp(t, lt, lt + 0.4) : 0;
        const hk = hotK(id);
        const sw = p.kind === "small" ? 7 : p.kind === "br" ? 15 : 18;
        const base = lerp(PC.neutral, p.col, on);
        const col = hk > 0 ? lerp(base.startsWith("rgb") ? "#E4DED0" : base, C.banana, hk) : base;
        const op = (p.kind === "small" ? Math.max(on, hk) : 1) * (1 - dimK * (1 - Math.max(focus ? 0 : on, hk)) * 0.7);
        return (
          <g key={id} opacity={op}>
            {hk > 0 && <path d={p.d} stroke={C.banana} strokeWidth={sw + 22} fill="none" strokeLinecap="round" opacity={0.55 * hk} filter="url(#plxglow)" />}
            <path d={p.d} stroke={C.forest} strokeWidth={sw + 7} fill="none" strokeLinecap="round" opacity={0.35 + 0.65 * Math.max(on, hk)} />
            <path d={p.d} stroke={hk > 0 ? lerp(p.col, C.banana, hk) : base} strokeWidth={sw} fill="none" strokeLinecap="round" />
            {p.kind !== "small" && <path d={p.d} stroke="#FFFFFF" strokeWidth={sw * 0.22} fill="none" strokeLinecap="round" opacity={0.35 * on} transform="translate(0 -3)" />}
            {flow !== undefined && t > flow && on > 0.5 && p.kind !== "small" && (
              <path d={p.d} stroke={C.paper} strokeWidth={sw * 0.35} fill="none" strokeLinecap="round" strokeDasharray="4 46" strokeDashoffset={-(t - flow) * 90} opacity={0.9} />
            )}
            {void col}
          </g>
        );
      })}
      {/* root stubs = spinal nerve ends */}
      {(Object.keys(RY) as (keyof typeof RY)[]).map((r) => {
        const lt = lit[r];
        const on = lt !== undefined ? ramp(t, lt, lt + 0.4) : 0;
        return <circle key={r} cx={X0} cy={RY[r]} r={13} fill={lerp(PC.neutral, PC.root, on)} stroke={C.forest} strokeWidth={4} opacity={1 - dimK * (1 - Math.max(focus ? 0 : on, hotK(r))) * 0.7} />;
      })}
      {rootLbl !== undefined &&
        PLX_LABELS.roots.map((l, i) => {
          const p = ramp(t, rootLbl + i * 0.12, rootLbl + i * 0.12 + 0.3);
          return (
            <text key={l.text} x={l.x} y={l.y} textAnchor="end" fontFamily={FONT} fontWeight={800} fontSize={34} fill={C.forest} opacity={p}>{l.text}</text>
          );
        })}
      {labels.map((l, i) => {
        const p = ramp(t, l.t, l.t + 0.3);
        if (p <= 0) return null;
        const fs = l.size || 28;
        const tw = l.text.length * fs * 0.56 + 24;
        const anc = l.anchor || "start";
        const x0 = anc === "start" ? l.x : anc === "end" ? l.x - tw : l.x - tw / 2;
        return (
          <g key={i} opacity={p} transform={`translate(0 ${(1 - p) * 8})`}>
            <rect x={x0} y={l.y - fs - 4} width={tw} height={fs + 18} rx={12} fill={l.color || C.forest} />
            <text x={x0 + tw / 2} y={l.y + 4} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={fs} fill={l.color === C.banana ? C.forest : C.paper}>{l.text}</text>
          </g>
        );
      })}
    </svg>
  );
};

/** Cross-section: the three cords around the axillary artery */
export const CordsXS: React.FC<{ t: number; w?: number; art: number; lat?: number; med?: number; post?: number; hot?: string; hotA?: number }> = ({ t, w = 640, art, lat, med, post, hot, hotA = 0 }) => {
  const k = (v?: number) => (v !== undefined ? ramp(t, v, v + 0.4) : 0);
  const a = k(art);
  const cords: [string, number, number, number | undefined, string][] = [
    ["Lateral", 150, 300, lat, PC.ant],
    ["Medial", 490, 300, med, PC.ant],
    ["Posterior", 320, 462, post, PC.post],
  ];
  const hk = hot ? ramp(t, hotA, hotA + 0.3) : 0;
  return (
    <svg width={w} height={w * 0.9} viewBox="0 0 640 576">
      <rect x={10} y={10} width={620} height={556} rx={40} fill={C.card} stroke={C.line} strokeWidth={4} />
      <text x={320} y={64} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} letterSpacing={3} fill={C.matcha}>CROSS-SECTION · AXILLA</text>
      <text x={40} y={120} fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.matcha} opacity={a}>← toward the arm</text>
      <text x={600} y={120} textAnchor="end" fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.matcha} opacity={a}>toward the chest →</text>
      <text x={320} y={553} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.matcha} opacity={k(post)}>↓ behind (toward the back)</text>
      <g opacity={a} transform={`translate(320 300) scale(${0.7 + 0.3 * a}) translate(-320 -300)`}>
        <circle cx={320} cy={300} r={92} fill={C.redDark} />
        <circle cx={320} cy={300} r={84} fill={PC.artery} />
        
        <ellipse cx={295} cy={270} rx={30} ry={14} fill={C.redLight} opacity={0.6} />
        <text x={320} y={300 + 9} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.paper}>axillary</text><text x={320} y={300 + 36} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.paper}>artery</text>
      </g>
      {cords.map(([n, x, y, tt, col]) => {
        const p = k(tt);
        const isHot = hot === n ? hk : 0;
        return (
          <g key={n} opacity={p} transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * p + 0.12 * isHot * Math.abs(Math.sin(t * 4))}) translate(${-x} ${-y})`}>
            {isHot > 0 && <circle cx={x} cy={y} r={78} fill={C.banana} opacity={0.6 * isHot} />}
            <circle cx={x} cy={y} r={52} fill={col} stroke={C.forest} strokeWidth={6} />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <circle key={i} cx={x + Math.cos(i * 1.05) * 24} cy={y + Math.sin(i * 1.05) * 24} r={11} fill="#FFFFFF" opacity={0.45} />
            ))}
            <rect x={n === "Posterior" ? x + 64 : x - 80} y={n === "Posterior" ? y - 23 : y - 118} width={160} height={46} rx={12} fill={C.forest} />
            <text x={n === "Posterior" ? x + 144 : x} y={n === "Posterior" ? y + 10 : y - 85} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={C.paper}>{n}</text>
          </g>
        );
      })}
    </svg>
  );
};

/** Route of the plexus: neck → behind the clavicle → axilla → arm (schematic, our own drawing) */
export const BodyRoute: React.FC<{ t: number; w?: number; spine?: number; neck?: number; clav?: number; axilla?: number; arm?: number; fingers?: number }> = ({ t, w = 900, spine, neck, clav, axilla, arm, fingers }) => {
  const k = (v?: number) => (v !== undefined ? ramp(t, v, v + 0.5) : 0);
  const sp = k(spine), nk = k(neck), cl = k(clav), ax = k(axilla), am = k(arm), fg = k(fingers);
  const NERVE = "M150 250 C220 262 270 300 330 318 C380 334 420 350 470 380 C520 420 560 520 590 620 C610 690 630 760 650 820";
  const len = 1000;
  const prog = Math.max(nk * 0.3, cl * 0.45, ax * 0.6, am * 1.0);
  const zone = (x: number, y: number, txt: string, p: number) => (
    <g opacity={p} transform={`translate(${x} ${y}) scale(${0.8 + 0.2 * p})`}>
      <rect x={0} y={-36} width={txt.length * 15.6 + 36} height={52} rx={14} fill={C.forest} />
      <text x={18} y={0} fontFamily={FONT} fontWeight={800} fontSize={28} fill={C.paper}>{txt}</text>
    </g>
  );
  return (
    <svg width={w} height={w * 0.8} viewBox="0 0 1000 800" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="skin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F3E3D3" />
          <stop offset="1" stopColor="#E8CFB8" />
        </linearGradient>
      </defs>
      {/* head + neck + torso + arm silhouette */}
      
      <path d="M60 120 L60 260 C60 300 40 330 0 345 L0 800 L560 800 C540 720 520 640 505 560 L480 470 C470 520 460 600 458 800 Z" fill="url(#skin)" stroke="none" />
      <path d="M200 140 C205 200 215 240 240 262 C320 280 400 280 470 300 C540 320 570 380 585 450 L640 690 C650 740 662 780 672 800 L600 800 C590 760 580 720 570 680 L520 500 C505 470 495 450 480 440" fill="url(#skin)" stroke={C.forest} strokeWidth={5} strokeLinejoin="round" />
      <path d="M200 140 C205 200 215 240 240 262 L240 800 L480 800 L480 440 C470 420 460 400 440 380" fill="url(#skin)" stroke="none" />
      <path d="M480 440 C470 520 462 640 458 800" fill="none" stroke={C.forest} strokeWidth={5} opacity={0.6} />
      
      {/* cervical spine */}
      <g opacity={0.35 + 0.65 * sp}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
          const y = 120 + i * 34;
          const isPlx = i >= 3 && i <= 7;
          return (
            <g key={i}>
              <rect x={95} y={y} width={56} height={26} rx={9} fill={isPlx && sp > 0.5 ? PC.root : "#FFFEF6"} stroke={C.forest} strokeWidth={4} />
              {isPlx && <text x={86} y={y + 22} textAnchor="end" fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.forest} opacity={sp}>{["C5", "C6", "C7", "C8", "T1"][i - 3]}</text>}
            </g>
          );
        })}
      </g>
      {/* first rib hint + clavicle */}
      <path d="M150 330 C230 340 320 352 400 372" stroke="#D8C6AE" strokeWidth={14} fill="none" strokeLinecap="round" />
      {/* nerve fan from spine */}
      <g>
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M150 ${235 + i * 34} C200 ${245 + i * 30} 250 ${290 + i * 8} 330 ${318}`} stroke={C.forest} strokeWidth={11} fill="none" strokeLinecap="round" opacity={nk} />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={"c" + i} d={`M150 ${235 + i * 34} C200 ${245 + i * 30} 250 ${290 + i * 8} 330 ${318}`} stroke={C.banana} strokeWidth={6} fill="none" strokeLinecap="round" opacity={nk} />
        ))}
        <path d={NERVE} stroke={C.forest} strokeWidth={20} fill="none" strokeLinecap="round" strokeDasharray={`${prog * len} ${len}`} />
        <path d={NERVE} stroke={C.banana} strokeWidth={13} fill="none" strokeLinecap="round" strokeDasharray={`${prog * len} ${len}`} />
        {/* finger branches */}
        {[-34, -14, 6, 24, 40].map((dx, i) => (
          <path key={i} d={`M648 812 C${650 + dx * 0.5} 830 ${650 + dx} 850 ${652 + dx * 1.3} 880`} stroke={C.banana} strokeWidth={7} strokeLinecap="round" fill="none" opacity={fg} />
        ))}
      </g>
      {/* clavicle drawn over the nerve */}
      <path d="M190 268 C260 292 340 286 420 262 C450 254 480 258 500 270" stroke={C.forest} strokeWidth={34} fill="none" strokeLinecap="round" opacity={0.25 + 0.75 * Math.max(cl, 0.4)} />
      <path d="M190 268 C260 292 340 286 420 262 C450 254 480 258 500 270" stroke="#FFFBEE" strokeWidth={24} fill="none" strokeLinecap="round" opacity={0.95} />
      <text x={345} y={290} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={18} letterSpacing={3} fill={C.matcha}>CLAVICLE</text>
      {zone(150, 205 - 30, "neck", nk)}
      {zone(530, 240, "behind the collarbone", cl)}
      {zone(540, 400, "axilla (armpit)", ax)}
      {zone(700, 640, "down to the fingertips", Math.max(am * 0, fg))}
    </svg>
  );
};

/** simple hand (palm view) with optional highlighted fingers + thumb pad */
export const HandIcon: React.FC<{ t: number; w?: number; ulnar?: number; thenar?: number; zap?: number }> = ({ t, w = 420, ulnar, thenar, zap }) => {
  const u = ulnar !== undefined ? ramp(t, ulnar, ulnar + 0.4) : 0;
  const th = thenar !== undefined ? ramp(t, thenar, thenar + 0.4) : 0;
  const z = zap !== undefined ? ramp(t, zap, zap + 0.3) : 0;
  const fingers: [number, number, number, boolean][] = [
    [130, 60, 150, false],
    [190, 30, 180, false],
    [250, 45, 170, true],
    [305, 85, 135, true],
  ];
  return (
    <svg width={w} height={w * 1.25} viewBox="0 0 420 525">
      <path d="M100 250 L100 420 C100 480 150 520 220 520 C300 520 340 480 345 420 L350 250 Z" fill="#F0DCC8" stroke={C.forest} strokeWidth={6} />
      {fingers.map(([x, y, h, isU], i) => (
        <rect key={i} x={x - 27} y={y + 20} width={54} height={h + 80} rx={27} fill={isU && u > 0 ? `rgba(242,209,78,${0.35 + 0.65 * u})` : "#F0DCC8"} stroke={C.forest} strokeWidth={6} />
      ))}
      <rect x={84} y={240} width={56} height={165} rx={28} fill="#F0DCC8" stroke={C.forest} strokeWidth={6} transform="rotate(-26 112 400)" />
      <path d="M110 300 C120 360 150 400 190 410" fill="none" stroke={C.forest} strokeWidth={4} opacity={0.4} />
      <ellipse cx={150} cy={370} rx={48} ry={60} fill={PC.ant} opacity={0.55 * th} />
      <rect x={130} y={500} width={170} height={25} fill="#F0DCC8" />
      {z > 0 &&
        [0, 1, 2].map((i) => (
          <path key={i} d={`M${345 + i * 4} ${470 - i * 70} l25 -20 l-12 0 l22 -24`} stroke={C.bananaDark} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={z * (0.5 + 0.5 * Math.abs(Math.sin(t * 7 + i)))} />
        ))}
    </svg>
  );
};

/** Plain generic study flashcard (not a product), flips between front and back */
export const StudyCard: React.FC<{ t: number; flip: number; front: string; back: string; w?: number }> = ({ t, flip, front, back, w = 560 }) => {
  const p = ramp(t, flip, flip + 0.6);
  const ang = p * 180;
  const showBack = ang > 90;
  return (
    <div style={{ width: w, height: w * 0.62, perspective: 1600 }}>
      <div style={{ width: "100%", height: "100%", transform: `rotateY(${ang}deg)`, transformStyle: "preserve-3d", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: showBack ? C.forest : C.card, border: `4px solid ${showBack ? C.forest : C.line}`, boxShadow: "0 20px 40px rgba(31,42,20,0.18)", transform: showBack ? "rotateY(180deg)" : "none", display: "flex", alignItems: "center", justifyContent: "center", padding: 40, boxSizing: "border-box", textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: showBack ? 44 : 58, color: showBack ? C.banana : C.forest, lineHeight: 1.15 }}>
          {showBack ? back : front}
        </div>
      </div>
    </div>
  );
};
