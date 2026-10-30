import React from "react";
import { C, FONT, ramp } from "./kit";

/* ===== Book Plume's own brain illustrations (no copied artwork) ===== */

export const LOBE_COL = { F: "#8FB3C9", P: "#F0D27A", T: "#9DBB7A", O: "#D98C8C" } as const;
const NEUTRAL = "#EADBCF";
const NEUTRAL_D = "#D7C2B2";

// deterministic pseudo-random
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** gyri texture: soft squiggles, clipped by the caller */
const Gyri: React.FC<{ seed?: number; x0: number; y0: number; x1: number; y1: number; step?: number; op?: number }> = ({ seed = 1, x0, y0, x1, y1, step = 46, op = 0.42 }) => {
  const paths: string[] = [];
  let i = seed * 100;
  for (let y = y0; y < y1; y += step) {
    for (let x = x0 + ((y / step) % 2) * step * 0.5; x < x1; x += step) {
      i++;
      const a = rnd(i) * Math.PI * 2;
      const L = step * (0.55 + rnd(i + 7) * 0.5);
      const cx = x + rnd(i + 3) * step * 0.4, cy = y + rnd(i + 5) * step * 0.4;
      const dx = Math.cos(a) * L, dy = Math.sin(a) * L;
      const bend = (rnd(i + 9) - 0.5) * L * 1.4;
      paths.push(`M${(cx - dx / 2).toFixed(1)} ${(cy - dy / 2).toFixed(1)} Q${(cx - dy * 0.0 + -dy / L * bend).toFixed(1)} ${(cy + dx / L * bend).toFixed(1)} ${(cx + dx / 2).toFixed(1)} ${(cy + dy / 2).toFixed(1)}`);
      if (rnd(i + 11) > 0.55) {
        const b2 = (rnd(i + 13) - 0.5) * L;
        paths.push(`M${(cx + dx / 2).toFixed(1)} ${(cy + dy / 2).toFixed(1)} q${(dy * 0.3).toFixed(1)} ${(b2).toFixed(1)} ${(dx * 0.35 + dy * 0.2).toFixed(1)} ${(dy * 0.35 - dx * 0.2).toFixed(1)}`);
      }
    }
  }
  return <path d={paths.join(" ")} fill="none" stroke={C.forest} strokeWidth={3.2} strokeLinecap="round" opacity={op} />;
};

const lerpCol = (a: string, b: string, k: number) => {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const A = p(a), B = p(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(",")})`;
};

/* -------- Lateral view brain map (left hemisphere, front = left) -------- */
export type MapRegion = "F" | "P" | "T" | "O" | "CB" | "BS";
export const OUTLINE =
  "M92 392 C78 252 190 118 362 94 C505 72 664 80 784 140 C884 190 934 282 924 382 C918 452 882 502 822 522 C762 534 702 522 652 500 C604 482 566 490 534 520 C474 562 382 562 330 532 C292 508 272 474 266 448 C240 456 200 472 160 470 C112 466 94 432 92 392 Z";
const LOBE_PATH: Record<"F" | "P" | "T" | "O", string> = {
  F: "M0 0 L548 0 L541 84 C521 172 501 252 456 386 L281 433 L0 570 Z",
  P: "M548 0 L812 0 L792 150 L762 332 L602 351 C542 362 492 376 456 386 C501 252 521 172 541 84 Z",
  T: "M0 570 L281 433 L456 386 C492 376 542 362 602 351 L762 332 L746 524 L746 720 L0 720 Z",
  O: "M812 0 L1000 0 L1000 720 L746 720 L746 524 L762 332 L792 150 Z",
};
const CENTRAL = "M541 84 C521 172 501 252 456 386";
const LATERAL = "M281 433 C360 413 420 396 456 386 C520 368 560 356 602 351";
const PRECENTRAL = "M541 84 C521 172 501 252 456 386 L414 398 C460 262 480 172 498 80 Z";
const POSTCENTRAL = "M541 84 C521 172 501 252 456 386 L500 374 C540 254 560 172 586 84 Z";

export const BrainMap: React.FC<{
  t: number;
  w?: number;
  lit?: Partial<Record<MapRegion, number>>; // time each region lights
  dim?: Partial<Record<MapRegion, number>>; // time from which region dims
  hot?: { r: MapRegion; a: number; b: number }[]; // pulse glow
  sulci?: { central?: number; lateral?: number };
  strips?: { pre?: number; post?: number };
  spots?: { id: string; x: number; y: number; t: number; color?: string; r?: number }[];
  labels?: { x: number; y: number; text: string; t: number; color?: string; size?: number }[];
  lobeText?: number; // show lobe names from time
}> = ({ t, w = 1000, lit = {}, dim = {}, hot = [], sulci = {}, strips = {}, spots = [], labels = [], lobeText }) => {
  const h = (w * 720) / 1000;
  const L = (r: MapRegion) => (lit[r] === undefined ? 0 : ramp(t, lit[r]!, lit[r]! + 0.45));
  const D = (r: MapRegion) => (dim[r] === undefined ? 0 : ramp(t, dim[r]!, dim[r]! + 0.4));
  const H = (r: MapRegion) => hot.filter((x) => x.r === r).reduce((m, x) => Math.max(m, ramp(t, x.a, x.a + 0.3) * (1 - ramp(t, x.b - 0.3, x.b))), 0);
  const fillFor = (r: "F" | "P" | "T" | "O") => lerpCol(NEUTRAL, LOBE_COL[r], L(r));
  const pulse = 0.5 + 0.5 * Math.sin(t * 6);
  const cs = sulci.central === undefined ? 0 : ramp(t, sulci.central, sulci.central + 0.6);
  const ls = sulci.lateral === undefined ? 0 : ramp(t, sulci.lateral, sulci.lateral + 0.6);
  const pre = strips.pre === undefined ? 0 : ramp(t, strips.pre, strips.pre + 0.4);
  const post = strips.post === undefined ? 0 : ramp(t, strips.post, strips.post + 0.4);
  const lt = lobeText === undefined ? 0 : ramp(t, lobeText, lobeText + 0.4);
  const cb = L("CB"), bs = L("BS");
  return (
    <svg width={w} height={h} viewBox="0 0 1000 720" style={{ overflow: "visible" }}>
      <defs>
        <clipPath id="bmClip"><path d={OUTLINE} /></clipPath>
        <filter id="bmSh" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#1F2A14" floodOpacity="0.20" />
        </filter>
        <filter id="bmGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9" /></filter>
        <radialGradient id="bmShade" cx="40%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
          <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="100%" stopColor="#1F2A14" stopOpacity="0.18" />
        </radialGradient>
      </defs>
      {/* brainstem (behind) */}
      <g filter="url(#bmSh)" opacity={1 - 0.6 * D("BS")}>
        <path d="M560 470 C556 540 566 600 572 640 C576 680 578 700 580 720 L630 720 C628 690 630 660 634 630 C640 590 648 530 650 470 Z" fill={lerpCol(NEUTRAL_D, "#C9A9D9", bs)} stroke={C.forest} strokeWidth={5} />
        <ellipse cx={604} cy={548} rx={58} ry={52} fill={lerpCol(NEUTRAL_D, "#B98FCC", bs)} stroke={C.forest} strokeWidth={5} />
        {H("BS") > 0 && <path d="M560 470 C556 540 566 600 572 640 C576 680 578 700 580 720 L630 720 C628 690 630 660 634 630 C640 590 648 530 650 470 Z" fill="none" stroke={C.banana} strokeWidth={22} opacity={H("BS") * (0.5 + 0.5 * pulse)} filter="url(#bmGlow)" />}
      </g>
      {/* cerebellum (behind) */}
      <g filter="url(#bmSh)" opacity={1 - 0.6 * D("CB")}>
        <path d="M600 520 C610 470 700 452 790 462 C880 474 914 520 900 566 C884 616 800 640 720 634 C650 628 600 590 600 520 Z" fill={lerpCol(NEUTRAL_D, "#E7A86A", cb)} stroke={C.forest} strokeWidth={5} />
        <clipPath id="bmCb"><path d="M600 520 C610 470 700 452 790 462 C880 474 914 520 900 566 C884 616 800 640 720 634 C650 628 600 590 600 520 Z" /></clipPath>
        <g clipPath="url(#bmCb)" stroke={C.forest} strokeWidth={3} fill="none" opacity={0.5}>
          {Array.from({ length: 11 }).map((_, i) => (
            <path key={i} d={`M590 ${478 + i * 16} C680 ${468 + i * 17} 820 ${476 + i * 15} 920 ${500 + i * 13}`} />
          ))}
        </g>
        {H("CB") > 0 && <path d="M600 520 C610 470 700 452 790 462 C880 474 914 520 900 566 C884 616 800 640 720 634 C650 628 600 590 600 520 Z" fill="none" stroke={C.banana} strokeWidth={22} opacity={H("CB") * (0.5 + 0.5 * pulse)} filter="url(#bmGlow)" />}
      </g>
      {/* cerebrum */}
      <g filter="url(#bmSh)">
        <path d={OUTLINE} fill={NEUTRAL} />
      </g>
      <g clipPath="url(#bmClip)">
        {(["F", "P", "T", "O"] as const).map((r) => (
          <path key={r} d={LOBE_PATH[r]} fill={fillFor(r)} opacity={1 - 0.55 * D(r)} />
        ))}
        {pre > 0 && <path d={PRECENTRAL} fill={C.red} opacity={0.55 * pre} />}
        {post > 0 && <path d={POSTCENTRAL} fill="#3E7CB1" opacity={0.5 * post} />}
        <Gyri x0={60} y0={70} x1={940} y1={570} seed={3} />
        <rect x={0} y={0} width={1000} height={720} fill="url(#bmShade)" />
        {(["F", "P", "T", "O"] as const).map((r) =>
          H(r) > 0 ? <path key={r} d={LOBE_PATH[r]} fill={C.banana} opacity={0.35 * H(r) * (0.6 + 0.4 * pulse)} /> : null
        )}
        {/* lobe borders */}
        <path d="M762 332 L792 150 M762 332 L746 524" stroke={C.forest} strokeWidth={3} strokeDasharray="10 10" opacity={0.45} fill="none" />
        <path d="M602 351 L762 332" stroke={C.forest} strokeWidth={3} strokeDasharray="10 10" opacity={0.45} fill="none" />
      </g>
      {/* sulci */}
      <path d={CENTRAL} stroke={C.forest} strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d={LATERAL} stroke={C.forest} strokeWidth={8} fill="none" strokeLinecap="round" />
      {cs > 0 && <path d={CENTRAL} stroke={C.red} strokeWidth={14} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${cs} 1`} />}
      {ls > 0 && <path d={LATERAL} stroke={C.red} strokeWidth={14} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${ls} 1`} />}
      <path d={OUTLINE} fill="none" stroke={C.forest} strokeWidth={6} />
      {/* spots */}
      {spots.map((s) => {
        const p = ramp(t, s.t, s.t + 0.35);
        if (p <= 0) return null;
        const r = (s.r || 42) * (0.6 + 0.4 * p);
        return (
          <g key={s.id} opacity={p}>
            <circle cx={s.x} cy={s.y} r={r * (1.35 + 0.25 * pulse)} fill={s.color || C.banana} opacity={0.35} />
            <circle cx={s.x} cy={s.y} r={r} fill={s.color || C.banana} stroke={C.forest} strokeWidth={5} />
          </g>
        );
      })}
      {lt > 0 &&
        ([
          ["FRONTAL", 250, 280],
          ["PARIETAL", 660, 220],
          ["TEMPORAL", 520, 470],
          ["OCCIPITAL", 845, 400],
        ] as [string, number, number][]).map(([s, x, y]) => (
          <text key={s} x={x} y={y} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={s === "OCCIPITAL" ? 30 : 40} fill={C.forest} opacity={lt} letterSpacing={3} style={{ paintOrder: "stroke" }} stroke={C.paper} strokeWidth={8}>
            {s}
          </text>
        ))}
      {labels.map((l, i) => {
        const p = ramp(t, l.t, l.t + 0.3);
        if (p <= 0) return null;
        const fs = l.size || 34;
        const wdt = l.text.length * fs * 0.62 + 36;
        return (
          <g key={i} opacity={p} transform={`translate(${l.x} ${l.y}) scale(${0.8 + 0.2 * p})`}>
            <rect x={-wdt / 2} y={-fs * 0.85} width={wdt} height={fs * 1.6} rx={fs * 0.42} fill={l.color || C.forest} />
            <text x={0} y={fs * 0.32} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={fs} fill={l.color === C.banana ? C.forest : C.paper}>
              {l.text}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

/* -------- Mid-sagittal schematic (front = left) -------- */
export type SagRegion = "CR" | "CC" | "TH" | "HY" | "PIT" | "MB" | "PO" | "ME" | "SC" | "CB";
const SAG_COL: Record<SagRegion, string> = {
  CR: "#8FB3C9", CC: "#F7F0DA", TH: "#E9C46A", HY: "#E76F51", PIT: "#E76F51", MB: "#B98FCC", PO: "#9D7CC0", ME: "#7F64A8", SC: "#C9B6DA", CB: "#E7A86A",
};
const SAG: Record<SagRegion, string> = {
  CR: OUTLINE,
  CC: "M300 300 C340 236 470 214 590 224 C680 232 730 262 742 300 C748 322 728 338 700 330 C680 300 620 270 560 266 C470 260 380 282 340 320 C322 336 290 328 300 300 Z",
  TH: "M480 330 C500 300 580 298 606 326 C624 348 604 380 560 384 C514 388 470 364 480 330 Z",
  HY: "M420 372 C440 352 470 352 484 368 L500 420 C486 436 452 438 430 424 C414 410 410 388 420 372 Z",
  PIT: "M440 470 C430 452 452 436 470 446 C486 456 484 478 466 486 C452 492 444 484 440 470 Z",
  MB: "M520 396 C550 388 610 390 630 406 L626 452 C600 464 548 462 528 452 Z",
  PO: "M520 456 C540 446 620 448 636 462 C664 488 664 540 634 562 C610 580 548 580 530 560 C506 534 504 478 520 456 Z",
  ME: "M538 566 C560 576 610 576 628 566 L622 650 C604 662 566 662 552 650 Z",
  SC: "M554 650 C568 660 604 660 620 650 L614 720 L560 720 Z",
  CB: "M650 470 C680 430 790 426 850 452 C910 480 914 560 870 594 C820 630 720 628 676 600 C640 576 632 510 650 470 Z",
};
export const SAG_CENTER: Record<SagRegion, [number, number]> = {
  CR: [320, 170], CC: [520, 236], TH: [544, 342], HY: [455, 400], PIT: [462, 466], MB: [576, 424], PO: [584, 512], ME: [588, 612], SC: [587, 690], CB: [770, 530],
};

export const Sagittal: React.FC<{
  t: number;
  w?: number;
  lit?: Partial<Record<SagRegion, number>>;
  hot?: { r: SagRegion; a: number; b: number }[];
  dimAll?: number; // dim un-lit regions from this time
  labels?: { r: SagRegion; text: string; t: number; dx?: number; dy?: number; color?: string }[];
  paths?: { d: string; a: number; b: number; color: string; out?: number }[]; // animated signal paths
  reticular?: number;
  peduncles?: number[]; // times for sup, mid, inf
}> = ({ t, w = 1000, lit = {}, hot = [], dimAll, labels = [], paths = [], reticular, peduncles = [] }) => {
  const h = (w * 720) / 1000;
  const L = (r: SagRegion) => (lit[r] === undefined ? 0 : ramp(t, lit[r]!, lit[r]! + 0.45));
  const H = (r: SagRegion) => hot.filter((x) => x.r === r).reduce((m, x) => Math.max(m, ramp(t, x.a, x.a + 0.3) * (1 - ramp(t, x.b - 0.3, x.b))), 0);
  const dm = dimAll === undefined ? 0 : ramp(t, dimAll, dimAll + 0.4);
  const pulse = 0.5 + 0.5 * Math.sin(t * 6);
  const order: SagRegion[] = ["CB", "SC", "ME", "PO", "MB", "PIT", "HY", "TH", "CC"];
  const base = (r: SagRegion) => (r === "CC" ? "#F3ECDA" : r === "CB" || r === "SC" || r === "ME" || r === "PO" || r === "MB" ? NEUTRAL_D : "#E2CDBE");
  const rt = reticular === undefined ? 0 : ramp(t, reticular, reticular + 0.6);
  return (
    <svg width={w} height={h} viewBox="0 0 1000 720" style={{ overflow: "visible" }}>
      <defs>
        <clipPath id="sgClip"><path d={OUTLINE} /></clipPath>
        <filter id="sgSh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#1F2A14" floodOpacity="0.2" /></filter>
        <filter id="sgGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8" /></filter>
      </defs>
      {/* cerebellum + stem behind cerebrum outline */}
      <g filter="url(#sgSh)">
        <path d={OUTLINE} fill={lerpCol(NEUTRAL, SAG_COL.CR, L("CR"))} opacity={1 - 0.45 * dm * (1 - L("CR"))} />
      </g>
      <g clipPath="url(#sgClip)">
        <Gyri x0={60} y0={70} x1={940} y1={560} seed={7} op={0.32} />
        {/* inner white matter field to set off the deep parts */}
        <path d="M250 340 C280 230 420 190 560 196 C700 202 790 250 800 330 C806 400 760 450 700 470 L520 470 C400 470 300 440 260 400 Z" fill={C.paper} opacity={0.55} />
      </g>
      <path d={OUTLINE} fill="none" stroke={C.forest} strokeWidth={6} />
      {order.map((r) => {
        const k = L(r);
        const hh = H(r);
        return (
          <g key={r} opacity={1 - 0.5 * dm * (1 - k)}>
            <path d={SAG[r]} fill={lerpCol(base(r).length === 7 ? base(r) : NEUTRAL_D, SAG_COL[r], k)} stroke={C.forest} strokeWidth={5} strokeLinejoin="round" />
            {r === "CB" && (
              <g stroke={C.forest} strokeWidth={4} fill="none" opacity={0.55} strokeLinecap="round">
                <path d="M690 540 C740 530 790 520 846 490 M740 532 C770 500 790 478 806 458 M760 528 C800 540 840 560 868 572 M720 538 C740 570 770 596 800 610 M790 522 C820 470 850 470 880 486" />
              </g>
            )}
            {hh > 0 && <path d={SAG[r]} fill="none" stroke={C.banana} strokeWidth={20} opacity={hh * (0.5 + 0.5 * pulse)} filter="url(#sgGlow)" />}
          </g>
        );
      })}
      {/* peduncles */}
      {peduncles.map((pt, i) => {
        const p = ramp(t, pt, pt + 0.4);
        if (p <= 0) return null;
        const ds = ["M630 420 C650 430 668 450 680 470", "M650 510 C664 512 676 514 690 518", "M624 590 C644 586 668 578 690 570"];
        return <path key={i} d={ds[i]} stroke={C.red} strokeWidth={16} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={`${p} 1`} />;
      })}
      {/* reticular formation: dotted network along the stem */}
      {rt > 0 && (
        <g opacity={rt}>
          {Array.from({ length: 22 }).map((_, i) => {
            const y = 404 + i * 11.5;
            const x = 572 + Math.sin(i * 1.7) * 14 + 6;
            return <circle key={i} cx={x} cy={y} r={5 + 2 * Math.sin(t * 5 + i)} fill={C.banana} stroke={C.forest} strokeWidth={2} />;
          })}
        </g>
      )}
      {/* signal paths */}
      {paths.map((pp, i) => {
        const p = ramp(t, pp.a, pp.b);
        const o = pp.out === undefined ? 1 : 1 - ramp(t, pp.out, pp.out + 0.4);
        if (p <= 0 || o <= 0) return null;
        return (
          <g key={i} opacity={o}>
            <path d={pp.d} stroke={pp.color} strokeWidth={22} opacity={0.25} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 1`} />
            <path d={pp.d} stroke={pp.color} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${p} 1`} />
          </g>
        );
      })}
      {labels.map((l, i) => {
        const p = ramp(t, l.t, l.t + 0.3);
        if (p <= 0) return null;
        const [cx, cy] = SAG_CENTER[l.r];
        const x = cx + (l.dx || 0), y = cy + (l.dy || 0);
        const fs = 32;
        const wdt = l.text.length * fs * 0.6 + 36;
        const bg = l.color || C.forest;
        return (
          <g key={i} opacity={p}>
            {(l.dx || l.dy) && <line x1={cx} y1={cy} x2={x} y2={y} stroke={C.forest} strokeWidth={4} />}
            <circle cx={cx} cy={cy} r={9} fill={C.banana} stroke={C.forest} strokeWidth={4} />
            <g transform={`translate(${x} ${y}) scale(${0.8 + 0.2 * p})`}>
              <rect x={-wdt / 2} y={-fs * 0.85} width={wdt} height={fs * 1.6} rx={14} fill={bg} />
              <text x={0} y={fs * 0.32} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={fs} fill={bg === C.banana ? C.forest : C.paper}>{l.text}</text>
            </g>
          </g>
        );
      })}
    </svg>
  );
};

/* -------- Top view: two hemispheres, fissure, corpus callosum, crossed control -------- */
export const TopView: React.FC<{ t: number; w?: number; hemi?: number; fissure?: number; callosum?: number; cross?: number; crossOnly?: "L" | "R" }> = ({ t, w = 1000, hemi, fissure, callosum, cross, crossOnly }) => {
  const h = (w * 720) / 1000;
  const hm = hemi === undefined ? 0 : ramp(t, hemi, hemi + 0.5);
  const fs = fissure === undefined ? 0 : ramp(t, fissure, fissure + 0.5);
  const cc = callosum === undefined ? 0 : ramp(t, callosum, callosum + 0.6);
  const cr = cross === undefined ? 0 : ramp(t, cross, cross + 1.0);
  const pulse = 0.5 + 0.5 * Math.sin(t * 6);
  const hemiPath = (side: 1 | -1) => {
    const x = (v: number) => 500 + side * v;
    return `M${x(14)} 70 C${x(120)} 50 ${x(260)} 90 ${x(300)} 220 C${x(330)} 320 ${x(320)} 460 ${x(270)} 560 C${x(230)} 640 ${x(120)} 676 ${x(14)} 660 Z`;
  };
  const colL = lerpCol(NEUTRAL, "#8FB3C9", hm), colR = lerpCol(NEUTRAL, "#F0D27A", hm);
  return (
    <svg width={w} height={h} viewBox="0 0 1000 720" style={{ overflow: "visible" }}>
      <defs>
        <clipPath id="tvL"><path d={hemiPath(-1)} /></clipPath>
        <clipPath id="tvR"><path d={hemiPath(1)} /></clipPath>
        <filter id="tvSh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#1F2A14" floodOpacity="0.2" /></filter>
        <marker id="tvArr" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill={C.red} /></marker>
      </defs>
      {/* corpus callosum seen as a bridge deep in the fissure */}
      <rect x={440} y={250} width={120} height={200} rx={30} fill={C.banana} stroke={C.forest} strokeWidth={5} opacity={cc} />
      {cc > 0 && Array.from({ length: 8 }).map((_, i) => <line key={i} x1={446} x2={554} y1={268 + i * 23} y2={268 + i * 23} stroke={C.forest} strokeWidth={3} opacity={0.5 * cc} />)}
      {(["L", "R"] as const).map((s) => (
        <g key={s} filter="url(#tvSh)" transform={`translate(${(s === "L" ? -1 : 1) * 46 * cc} 0)`}>
          <path d={hemiPath(s === "L" ? -1 : 1)} fill={s === "L" ? colL : colR} stroke={C.forest} strokeWidth={6} />
          <g clipPath={`url(#tv${s})`}><Gyri x0={s === "L" ? 160 : 500} y0={60} x1={s === "L" ? 500 : 840} y1={680} seed={s === "L" ? 11 : 12} step={44} op={0.38} /></g>
        </g>
      ))}
      {fs > 0 && <path d="M500 40 L500 690" stroke={C.red} strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray={`${fs} 1`} opacity={0.85 * (1 - 0.75 * cc)} />}
      {hm > 0 && (
        <g opacity={hm} fontFamily={FONT} fontWeight={800}>
          <text x={330} y={380} textAnchor="middle" fontSize={44} fill={C.forest}>LEFT</text>
          <text x={670} y={380} textAnchor="middle" fontSize={44} fill={C.forest}>RIGHT</text>
          <text x={500} y={30} textAnchor="middle" fontSize={26} fill={C.forest} opacity={0.6}>FRONT</text>
        </g>
      )}
      {cr > 0 && (
        <g opacity={Math.min(1, cr * 2)}>
          {(crossOnly === undefined || crossOnly === "L") && <path d="M330 450 C380 600 620 640 760 700" stroke={C.red} strokeWidth={10} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${cr} 1`} markerEnd={cr > 0.95 ? "url(#tvArr)" : undefined} />}
          {(crossOnly === undefined || crossOnly === "R") && <path d="M670 450 C620 600 380 640 240 700" stroke="#3E7CB1" strokeWidth={10} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${cr} 1`} opacity={crossOnly ? 1 : 0.9} />}
          <g transform={`translate(${crossOnly === "R" ? 160 : 760} 690) scale(${0.8 + 0.2 * pulse * cr})`}>
            <Hand />
          </g>
          {crossOnly === undefined && <g transform="translate(160 690) scale(-1 1)"><Hand /></g>}
        </g>
      )}
    </svg>
  );
};

/** simple open hand icon centred on 0,0 (right hand, palm view) */
export const Hand: React.FC = () => (
  <g>
    <path d="M-40 60 L-44 -10 C-46 -26 -26 -28 -24 -12 L-22 -50 C-22 -66 -2 -66 -2 -50 L0 -62 C0 -78 20 -78 20 -62 L22 -50 C22 -64 42 -64 42 -48 L40 0 L56 -24 C66 -38 84 -28 74 -12 L44 50 C36 66 22 72 6 72 L-20 72 C-32 72 -40 68 -40 60 Z" fill="#F3D9C4" stroke={C.forest} strokeWidth={5} strokeLinejoin="round" />
  </g>
);

/* -------- Cortex fold cross-section: gray matter over white matter -------- */
export const Folds: React.FC<{ t: number; w?: number; gray?: number; white?: number; gyrus?: number; sulcus?: number }> = ({ t, w = 1000, gray, white, gyrus, sulcus }) => {
  const h = (w * 600) / 1000;
  const g = gray === undefined ? 1 : ramp(t, gray, gray + 0.5);
  const wh = white === undefined ? 1 : ramp(t, white, white + 0.5);
  const gy = gyrus === undefined ? 0 : ramp(t, gyrus, gyrus + 0.4);
  const su = sulcus === undefined ? 0 : ramp(t, sulcus, sulcus + 0.4);
  // folded surface
  const top = "M40 260 C90 120 190 120 230 250 C250 330 270 470 300 470 C330 470 350 330 370 250 C410 110 530 110 570 250 C590 330 610 470 640 470 C670 470 690 330 710 250 C750 120 860 120 920 250";
  const inner = "M80 300 C110 210 170 210 200 300 C215 380 240 520 300 520 C360 520 385 380 400 300 C430 200 510 200 540 300 C555 380 580 520 640 520 C700 520 725 380 740 300 C770 210 840 210 880 300";
  return (
    <svg width={w} height={h} viewBox="0 0 1000 600" style={{ overflow: "visible" }}>
      <path d={`${top} L960 600 L0 600 Z`} fill={lerpCol(NEUTRAL, "#9A8F86", g)} stroke={C.forest} strokeWidth={6} />
      <path d={`${inner} L920 600 L40 600 Z`} fill={lerpCol(NEUTRAL, "#FBF7EA", wh)} stroke={C.forest} strokeWidth={4} strokeDasharray="12 8" />
      {/* tiny neurons dots in gray */}
      {g > 0.5 && Array.from({ length: 40 }).map((_, i) => {
        const x = 70 + rnd(i) * 840, y = 160 + rnd(i + 50) * 300;
        return <circle key={i} cx={x} cy={y} r={3.5} fill={C.forest} opacity={0.25} />;
      })}
      {gy > 0 && (
        <g opacity={gy}>
          <path d="M370 250 C410 110 530 110 570 250" stroke={C.banana} strokeWidth={22} fill="none" strokeLinecap="round" opacity={0.85} />
          <text x={470} y={92} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={48} fill={C.forest}>GYRUS = ridge</text>
        </g>
      )}
      {su > 0 && (
        <g opacity={su}>
          <path d="M570 250 C590 330 610 470 640 470 C670 470 690 330 710 250" stroke={C.red} strokeWidth={14} fill="none" strokeLinecap="round" />
          <line x1={640} y1={460} x2={760} y2={540} stroke={C.forest} strokeWidth={4} />
          <rect x={620} y={530} width={380} height={70} rx={18} fill={C.red} />
          <text x={810} y={578} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={C.paper}>SULCUS = groove</text>
        </g>
      )}
    </svg>
  );
};

/** Eye icon */
export const Eye: React.FC<{ size?: number }> = ({ size = 120 }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 200 120">
    <path d="M10 60 C50 0 150 0 190 60 C150 120 50 120 10 60 Z" fill={C.card} stroke={C.forest} strokeWidth={8} />
    <circle cx={100} cy={60} r={32} fill="#3E7CB1" stroke={C.forest} strokeWidth={6} />
    <circle cx={100} cy={60} r={14} fill={C.forest} />
    <circle cx={110} cy={50} r={6} fill={C.paper} />
  </svg>
);

/** Ear / sound icon */
export const Sound: React.FC<{ size?: number; t: number }> = ({ size = 120, t }) => (
  <svg width={size} height={size} viewBox="0 0 120 120">
    <path d="M20 45 L45 45 L70 22 L70 98 L45 75 L20 75 Z" fill={C.forest} />
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M${82 + i * 12} ${40 - i * 8} C${96 + i * 14} ${52} ${96 + i * 14} ${68} ${82 + i * 12} ${80 + i * 8}`} stroke={C.matcha} strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.4 + 0.6 * Math.max(0, Math.sin(t * 5 - i))} />
    ))}
  </svg>
);

/** Plain generic study flashcard (not a product), flips between front and back */
export const StudyCard: React.FC<{ t: number; flip: number; front: string; back: string; w?: number }> = ({ t, flip, front, back, w = 560 }) => {
  const p = ramp(t, flip, flip + 0.6);
  const ang = p * 180;
  const showBack = ang > 90;
  return (
    <div style={{ width: w, height: w * 0.62, perspective: 1600 }}>
      <div style={{ width: "100%", height: "100%", transform: `rotateY(${ang}deg)`, transformStyle: "preserve-3d", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: showBack ? C.forest : C.card, border: `4px solid ${showBack ? C.forest : C.line}`, boxShadow: "0 20px 40px rgba(31,42,20,0.18)", transform: showBack ? "rotateY(180deg)" : "none", display: "flex", alignItems: "center", justifyContent: "center", padding: 40, boxSizing: "border-box", textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: showBack ? 46 : 58, color: showBack ? C.banana : C.forest, lineHeight: 1.15 }}>
          {showBack ? back : front}
        </div>
      </div>
    </div>
  );
};
