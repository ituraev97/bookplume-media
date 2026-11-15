import React from "react";
import { C, FONT, ramp } from "./kit";

/* Book Plume's own diagrams of the anterior abdominal wall (front view + horizontal section). viewBox 1000 x 1000 / 1000 x 560.
   5 muscles: 3 flat layers outside → in (external oblique ↘ down + in, internal oblique ↗ up + in, transversus abdominis → across)
   + 2 vertical (rectus abdominis with tendinous intersections, pyramidalis). Patient faces the viewer: viewer-left = patient's right. */
export type AM = "EO" | "IO" | "TA" | "RA" | "PY" | "TI";
export const AORDER: AM[] = ["EO", "IO", "TA", "RA", "PY"];
export const ANAME: Record<AM, string> = { EO: "External oblique", IO: "Internal oblique", TA: "Transversus abdominis", RA: "Rectus abdominis", PY: "Pyramidalis", TI: "Tendinous intersections" };
export const ASHORT: Record<AM, string> = { EO: "external oblique", IO: "internal oblique", TA: "transversus", RA: "rectus", PY: "pyramidalis", TI: "intersections" };
export const ACOL: Record<AM, string> = { EO: "#E0861A", IO: "#5C8F2A", TA: "#D93A2B", RA: "#2F72B8", PY: "#8B5BB5", TI: "#F2D14E" };
export const ALET: Record<AM, string> = { EO: "E", IO: "I", TA: "T", RA: "R", PY: "P", TI: "" };

type P = [number, number];
const SKIN = "#F2DCC2";
const DIMM = "#EBDCC8";
const DIML = "rgba(150,110,80,0.22)";
const mx = (d: string) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) => `${(1000 - parseFloat(x)).toFixed(1)} ${y}`);

const OUT = "M 300 40 C 288 200 268 360 272 500 C 276 600 262 680 240 735 C 300 836 410 905 500 930 C 590 905 700 836 760 735 C 738 680 724 600 728 500 C 732 360 712 200 700 40 Z";
const RL = "M 492 110 L 492 905 L 462 905 C 440 760 420 600 408 460 C 400 340 394 220 390 125 Q 440 104 492 110 Z";
const LL = "M 300 40 C 288 200 268 360 272 500 C 276 600 262 680 240 735 C 280 700 310 700 330 712 C 380 790 430 860 462 905 C 440 760 420 600 408 460 C 400 340 394 220 390 125 L 384 40 Z";
const PYL = "M 492 905 L 492 792 L 458 905 Z";
const COSTAL = "M 500 112 C 452 140 366 200 288 330";
const CREST = "M 240 735 C 262 702 300 694 330 712";
const ING = "M 330 712 C 380 790 430 860 470 905";
const TIY = [262, 382, 500];
const tiPath = (y: number) => {
  const lx = y < 300 ? 396 : y < 420 ? 402 : 411;
  return `M ${lx} ${y + 6} Q ${(lx + 492) / 2} ${y - 10} 492 ${y + 2}`;
};

/* tag anchors (viewBox coords) */
export const AANCH: Record<string, P> = { EO: [318, 430], EOR: [682, 430], IO: [690, 520], TA: [690, 600], RA: [448, 330], PY: [478, 868], TI: [440, 382] };

const Fibers: React.FC<{ dir: P; sp: number; clip: string; col: string; w?: number }> = ({ dir, sp, clip, col, w = 5 }) => {
  const [ux, uy] = dir;
  const L = Math.hypot(ux, uy);
  const u: P = [ux / L, uy / L], n: P = [-u[1], u[0]];
  const lines: string[] = [];
  for (let d = -900; d <= 900; d += sp) {
    const cx = 500 + n[0] * d, cy = 500 + n[1] * d;
    lines.push(`M ${(cx - u[0] * 1400).toFixed(1)} ${(cy - u[1] * 1400).toFixed(1)} L ${(cx + u[0] * 1400).toFixed(1)} ${(cy + u[1] * 1400).toFixed(1)}`);
  }
  return (
    <g clipPath={`url(#${clip})`}>
      <path d={lines.join(" ")} stroke={col} strokeWidth={w} fill="none" strokeLinecap="round" />
    </g>
  );
};

/* fat direction arrow */
export const DirArrow: React.FC<{ a: P; b: P; col: string; o: number; w?: number }> = ({ a, b, col, o, w = 22 }) => {
  if (o <= 0) return null;
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const L = Math.hypot(dx, dy);
  const ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
  const k = Math.min(1, o * 1.2);
  const bx = a[0] + dx * k, by = a[1] + dy * k;
  const hl = w * 2.1, hw = w * 1.7;
  const p = [
    [a[0] + nx * w / 2, a[1] + ny * w / 2], [bx - ux * hl + nx * w / 2, by - uy * hl + ny * w / 2], [bx - ux * hl + nx * hw, by - uy * hl + ny * hw], [bx, by],
    [bx - ux * hl - nx * hw, by - uy * hl - ny * hw], [bx - ux * hl - nx * w / 2, by - uy * hl - ny * w / 2], [a[0] - nx * w / 2, a[1] - ny * w / 2],
  ];
  return <path d={"M " + p.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(" L ") + " Z"} fill={col} stroke={C.forest} strokeWidth={7} strokeLinejoin="round" opacity={Math.min(1, o * 2)} />;
};

const FDIR: Record<"EO" | "IO" | "TA", [P, P]> = { EO: [[0.62, 0.78], [-0.62, 0.78]], IO: [[0.72, -0.69], [-0.72, -0.69]], TA: [[1, 0], [1, 0]] };

export const Torso: React.FC<{
  t: number; w: number; id: string;
  lit?: Partial<Record<AM, number>>; hot?: AM[]; dim?: number;
  peelL?: number; peelR?: number;
  arrows?: Partial<Record<"EO" | "IO" | "TA", number>>; arrowSide?: "both" | "R" | "L"; stepR?: boolean; split?: boolean;
}> = ({ t, w, id, lit = {}, hot = [], dim = 0, peelL = 0, peelR = 0, arrows = {}, arrowSide = "both", stepR = false, split = false }) => {
  const on = (m: AM) => lit[m] !== undefined && t >= (lit[m] as number) - 0.05;
  const lk = (m: AM) => (lit[m] === undefined ? 0 : ramp(t, (lit[m] as number) - 0.05, (lit[m] as number) + 0.25));
  const isHot = (m: AM) => hot.includes(m);
  const op = (m: AM) => (dim > 0 && !isHot(m) ? 1 - 0.45 * dim : 1);
  const fill = (m: AM) => (on(m) ? ACOL[m] : DIMM);
  const glow = `url(#ag${id})`;
  const Flat: React.FC<{ m: "EO" | "IO" | "TA"; side: 0 | 1; o: number }> = ({ m, side, o }) => {
    if (o <= 0.001) return null;
    const clip = `${id}${side ? "R" : "L"}`;
    const k = lk(m);
    return (
      <g opacity={o * op(m)}>
        <path d={side ? mx(LL) : LL} fill={fill(m)} />
        <Fibers dir={FDIR[m][side]} sp={m === "TA" ? 22 : 24} clip={clip} col={k > 0 ? "rgba(60,20,10,0.32)" : DIML} w={6} />
        <Fibers dir={FDIR[m][side]} sp={m === "TA" ? 22 : 24} clip={clip} col={k > 0 ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.35)"} w={2} />
      </g>
    );
  };
  const side = (p: number, s: 0 | 1) => {
    if (stepR && s === 1) {
      return (
        <>
          <g clipPath={`url(#${id}s0)`}><Flat m="EO" side={1} o={1} /></g>
          <g clipPath={`url(#${id}s1)`}><Flat m="IO" side={1} o={1} /></g>
          <g clipPath={`url(#${id}s2)`}><Flat m="TA" side={1} o={1} /></g>
          <g clipPath={`url(#${id}R)`}>
            <path d="M 560 340 L 780 340" stroke={C.forest} strokeWidth={6} />
            <path d="M 560 580 L 780 580" stroke={C.forest} strokeWidth={6} />
          </g>
        </>
      );
    }
    const eo = 1 - Math.min(1, Math.max(0, p));
    const io = 1 - Math.min(1, Math.max(0, p - 1));
    return (
      <>
        <Flat m="TA" side={s} o={1} />
        <Flat m="IO" side={s} o={io} />
        <Flat m="EO" side={s} o={eo} />
      </>
    );
  };
  const topL = peelL < 0.5 ? "EO" : peelL < 1.5 ? "IO" : "TA";
  const topR = peelR < 0.5 ? "EO" : peelR < 1.5 ? "IO" : "TA";
  const hotL = isHot(topL as AM), hotR = isHot(topR as AM);
  const ar = (m: "EO" | "IO" | "TA") => arrows[m] ?? 0;
  return (
    <svg width={w} height={w} viewBox="0 0 1000 1000" style={{ overflow: "visible" }}>
      <defs>
        <filter id={`ag${id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <clipPath id={`${id}L`}><path d={LL} /></clipPath>
        <clipPath id={`${id}R`}><path d={mx(LL)} /></clipPath>
        <clipPath id={`${id}s0`}><rect x={500} y={0} width={500} height={340} /></clipPath>
        <clipPath id={`${id}s1`}><rect x={500} y={340} width={500} height={240} /></clipPath>
        <clipPath id={`${id}s2`}><rect x={500} y={580} width={500} height={420} /></clipPath>
        <clipPath id={`${id}RA`}><path d={RL} /><path d={mx(RL)} /></clipPath>
        <linearGradient id={`sh${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="rgba(31,42,20,0.18)" />
          <stop offset="0.2" stopColor="rgba(31,42,20,0)" />
          <stop offset="0.8" stopColor="rgba(31,42,20,0)" />
          <stop offset="1" stopColor="rgba(31,42,20,0.18)" />
        </linearGradient>
      </defs>
      {/* body */}
      <path d={OUT} fill={SKIN} stroke={C.forest} strokeWidth={8} strokeLinejoin="round" />
      {/* flat muscles */}
      {side(peelL, 0)}
      {side(peelR, 1)}
      {/* hot outline on the lateral regions */}
      {hotL && <path d={LL} fill="none" stroke={C.banana} strokeWidth={12} filter={glow} opacity={0.95} />}
      {hotR && <path d={mx(LL)} fill="none" stroke={C.banana} strokeWidth={12} filter={glow} opacity={0.95} />}
      <path d={LL} fill="none" stroke={C.forest} strokeWidth={5} strokeLinejoin="round" />
      <path d={mx(LL)} fill="none" stroke={C.forest} strokeWidth={5} strokeLinejoin="round" />
      {/* rectus abdominis */}
      <g opacity={op("RA")} filter={isHot("RA") ? glow : undefined}>
        {isHot("RA") && <><path d={RL} fill="none" stroke={C.banana} strokeWidth={22} /><path d={mx(RL)} fill="none" stroke={C.banana} strokeWidth={22} /></>}
        <path d={RL} fill={fill("RA")} stroke={C.forest} strokeWidth={6} strokeLinejoin="round" />
        <path d={mx(RL)} fill={fill("RA")} stroke={C.forest} strokeWidth={6} strokeLinejoin="round" />
        <Fibers dir={[0.02, 1]} sp={16} clip={`${id}RA`} col={on("RA") ? "rgba(10,20,50,0.28)" : DIML} w={4} />
        <Fibers dir={[0.02, 1]} sp={16} clip={`${id}RA`} col="rgba(255,255,255,0.25)" w={1.5} />
      </g>
      {/* tendinous intersections */}
      <g filter={isHot("TI") ? glow : undefined}>
        {TIY.map((y) => [tiPath(y), mx(tiPath(y))].map((d, j) => (
          <g key={`${y}${j}`}>
            {on("TI") && <path d={d} stroke={C.forest} strokeWidth={22} fill="none" strokeLinecap="round" />}
            <path d={d} stroke={on("TI") ? C.banana : "rgba(255,255,255,0.75)"} strokeWidth={on("TI") ? 13 : 7} fill="none" strokeLinecap="round" />
          </g>
        )))}
      </g>
      {/* linea alba + umbilicus */}
      <path d="M 500 108 L 500 908" stroke="#FBF6EA" strokeWidth={14} />
      <path d="M 500 108 L 500 908" stroke={C.forest} strokeWidth={3} opacity={0.5} />
      <ellipse cx={500} cy={560} rx={11} ry={14} fill="#C9A27F" stroke={C.forest} strokeWidth={4} />
      {/* pyramidalis */}
      <g opacity={op("PY")} filter={isHot("PY") ? glow : undefined}>
        {isHot("PY") && <><path d={PYL} fill="none" stroke={C.banana} strokeWidth={18} strokeLinejoin="round" /><path d={mx(PYL)} fill="none" stroke={C.banana} strokeWidth={18} strokeLinejoin="round" /></>}
        <path d={PYL} fill={on("PY") ? ACOL.PY : "#E4D2BE"} stroke={C.forest} strokeWidth={5} strokeLinejoin="round" />
        <path d={mx(PYL)} fill={on("PY") ? ACOL.PY : "#E4D2BE"} stroke={C.forest} strokeWidth={5} strokeLinejoin="round" />
      </g>
      {/* bony landmarks */}
      <g fill="none" stroke={C.forest} strokeLinecap="round">
        <path d={COSTAL} strokeWidth={9} stroke="#F7EFD8" />
        <path d={mx(COSTAL)} strokeWidth={9} stroke="#F7EFD8" />
        <path d={COSTAL} strokeWidth={3} opacity={0.7} />
        <path d={mx(COSTAL)} strokeWidth={3} opacity={0.7} />
        <path d={CREST} strokeWidth={12} stroke="#F4EBCF" />
        <path d={mx(CREST)} strokeWidth={12} stroke="#F4EBCF" />
        <path d={CREST} strokeWidth={4} opacity={0.8} />
        <path d={mx(CREST)} strokeWidth={4} opacity={0.8} />
        <path d={ING} strokeWidth={4} opacity={0.6} strokeDasharray="10 8" />
        <path d={mx(ING)} strokeWidth={4} opacity={0.6} strokeDasharray="10 8" />
      </g>
      <path d={OUT} fill={`url(#sh${id})`} stroke="none" />
      <path d={OUT} fill="none" stroke={C.forest} strokeWidth={8} strokeLinejoin="round" />
      {/* direction arrows */}
      {arrowSide !== "R" && <DirArrow a={[262, 300]} b={[372, 438]} col={ACOL.EO} o={ar("EO")} />}
      {arrowSide !== "L" && !split && <DirArrow a={[738, 300]} b={[628, 438]} col={ACOL.EO} o={ar("EO")} />}
      {arrowSide !== "R" && !split && <DirArrow a={[292, 660]} b={[392, 556]} col={ACOL.IO} o={ar("IO")} />}
      {arrowSide !== "L" && <DirArrow a={[708, 660]} b={[608, 556]} col={ACOL.IO} o={ar("IO")} />}
      {arrowSide !== "L" && <DirArrow a={[742, 560]} b={[598, 560]} col={ACOL.TA} o={ar("TA")} />}
      {arrowSide !== "R" && <DirArrow a={[258, 560]} b={[402, 560]} col={ACOL.TA} o={ar("TA")} />}
    </svg>
  );
};

/* horizontal section through the wall (above the arcuate line), skin on top, abdominal cavity below */
const y0 = (x: number) => 70 + 0.00088 * (x - 500) * (x - 500);
const band = (xa: number, xb: number, o1: number, o2: number) => {
  const top: string[] = [], bot: string[] = [];
  for (let x = xa; x <= xb + 0.1; x += 8) {
    top.push(`${x.toFixed(1)} ${(y0(x) + o1).toFixed(1)}`);
    bot.unshift(`${x.toFixed(1)} ${(y0(x) + o2).toFixed(1)}`);
  }
  return `M ${top.join(" L ")} L ${bot.join(" L ")} Z`;
};
const line = (xa: number, xb: number, o: number) => {
  const p: string[] = [];
  for (let x = xa; x <= xb + 0.1; x += 8) p.push(`${x.toFixed(1)} ${(y0(x) + o).toFixed(1)}`);
  return "M " + p.join(" L ");
};
export const LAYO: Record<"EO" | "IO" | "TA", [number, number]> = { EO: [30, 88], IO: [94, 150], TA: [156, 206] };

export const Wall: React.FC<{ t: number; w: number; id: string; lit?: Partial<Record<AM, number>>; hot?: AM[]; inArrow?: number; letters?: number }> = ({ t, w, id, lit = {}, hot = [], inArrow = 0, letters = 0 }) => {
  const on = (m: AM) => lit[m] !== undefined && t >= (lit[m] as number) - 0.05;
  const isHot = (m: AM) => hot.includes(m);
  const fill = (m: AM) => (on(m) ? ACOL[m] : DIMM);
  const XS: [number, number][] = [[30, 282], [718, 970]];
  return (
    <svg width={w} height={w * 0.56} viewBox="0 0 1000 560" style={{ overflow: "visible" }}>
      <defs>
        <filter id={`wg${id}`} x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* cavity */}
      <text x={500} y={y0(500) + 330} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={C.forest} opacity={0.4}>abdominal cavity</text>
      {/* skin + fat */}
      <path d={band(30, 970, -18, 26)} fill={SKIN} stroke={C.forest} strokeWidth={4} />
      {/* flat layers laterally */}
      {(["EO", "IO", "TA"] as const).map((m) => XS.map(([a, b], j) => (
        <g key={m + j} filter={isHot(m) ? `url(#wg${id})` : undefined}>
          {isHot(m) && <path d={band(a, b, LAYO[m][0], LAYO[m][1])} fill="none" stroke={C.banana} strokeWidth={16} />}
          <path d={band(a, b, LAYO[m][0], LAYO[m][1])} fill={fill(m)} stroke={C.forest} strokeWidth={4} />
        </g>
      )))}
      {/* aponeuroses wrapping the rectus */}
      <g fill="none" stroke={C.forest} strokeLinecap="round">
        <path d={line(272, 728, 30)} strokeWidth={8} stroke={on("EO") ? ACOL.EO : "#CDB9A0"} />
        <path d={line(272, 728, 39)} strokeWidth={7} stroke={on("IO") ? ACOL.IO : "#CDB9A0"} />
        <path d={line(272, 728, 198)} strokeWidth={7} stroke={on("IO") ? ACOL.IO : "#CDB9A0"} />
        <path d={line(272, 728, 207)} strokeWidth={8} stroke={on("TA") ? ACOL.TA : "#CDB9A0"} />
      </g>
      {/* rectus pair */}
      {[385, 615].map((cx) => {
        const cy = y0(cx) + 119;
        const ang = (Math.atan(0.00176 * (cx - 500)) * 180) / Math.PI;
        return (
          <g key={cx}>
            {isHot("RA") && <ellipse cx={cx} cy={cy} rx={112} ry={80} transform={`rotate(${ang} ${cx} ${cy})`} fill="none" stroke={C.banana} strokeWidth={16} />}
            <ellipse cx={cx} cy={cy} rx={110} ry={76} transform={`rotate(${ang} ${cx} ${cy})`} fill={fill("RA")} stroke={C.forest} strokeWidth={5} />
          </g>
        );
      })}
      {/* linea alba */}
      <rect x={493} y={y0(500) + 30} width={14} height={178} rx={6} fill="#FBF6EA" stroke={C.forest} strokeWidth={3} />
      {/* peritoneum */}
      <path d={line(30, 970, 224)} fill="none" stroke={C.forest} strokeWidth={3} strokeDasharray="6 8" opacity={0.6} />
      {/* outside → in arrow */}
      {inArrow > 0 && (
        <g opacity={inArrow}>
          <DirArrow a={[150, y0(150) - 120]} b={[150, y0(150) - 120 + 340 * Math.min(1, inArrow)]} col={C.banana} o={1} w={20} />
          <text x={110} y={y0(150) - 140} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill={C.forest}>outside</text>
          <text x={150} y={y0(150) + 262} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill={C.forest} opacity={ramp(inArrow, 0.7, 1)}>in</text>
        </g>
      )}
      {/* letters on the right side */}
      {(["EO", "IO", "TA"] as const).map((m, i) => {
        const k = letters ? ramp(t, (lit[m] ?? 99) - 0.05, (lit[m] ?? 99) + 0.2) : 0;
        if (k <= 0) return null;
        const x = 860, y = y0(x) + (LAYO[m][0] + LAYO[m][1]) / 2;
        return (
          <g key={m} transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * k})`} opacity={k}>
            <circle r={25} fill={ACOL[m]} stroke={C.paper} strokeWidth={5} />
            <circle r={30} fill="none" stroke={C.forest} strokeWidth={4} />
            <text y={12} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={C.paper}>{ALET[m]}</text>
            {i === 0 && null}
          </g>
        );
      })}
    </svg>
  );
};
