import React from "react";
import { C, FONT, ramp } from "./kit";

/* Book Plume diagram: STERNUM, ANTERIOR view (viewBox 860 x 920), body midline x = 430.
   Manubrium (jugular notch, clavicular notches, 1st costal cartilage), sternal angle at the manubrium–body joint (2nd costal cartilage),
   body (costal notches 3–7, transverse ridges), xiphoid process. Clavicles + costal cartilages 1–7 + rib stubs both sides.
   "Sword" overlay: handle = manubrium, blade = body, tip = xiphoid. */

export type P = "M" | "B" | "X";
export const PS: P[] = ["M", "B", "X"];
export const PCOL: Record<P, string> = { M: "#B8473A", B: "#3E7C93", X: "#C88A1E" };
export const PNAME: Record<P, string> = { M: "Manubrium", B: "Body", X: "Xiphoid process" };
export const PSWORD: Record<P, string> = { M: "Handle", B: "Blade", X: "Tip" };
export const ANCHOR = {
  M: [430, 210] as [number, number],
  B: [430, 470] as [number, number],
  X: [430, 715] as [number, number],
  ANGLE: [430, 292] as [number, number],
  JUG: [430, 146] as [number, number],
  CLAV: [600, 120] as [number, number],
  R2: [560, 300] as [number, number],
};
const BONE = "#EFE5CB", BONE2 = "#E2D3AE", CART = "#CFDDE0", CART2 = "#A9C2C8";
const CX = 430;

/* smooth closed path through points (quadratic through midpoints) */
const smooth = (pts: [number, number][]) => {
  const n = pts.length;
  const mid = (a: [number, number], b: [number, number]) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  let d = "";
  const m0 = mid(pts[n - 1], pts[0]);
  d += `M ${m0[0]} ${m0[1]} `;
  for (let i = 0; i < n; i++) {
    const p = pts[i], m = mid(p, pts[(i + 1) % n]);
    d += `Q ${p[0]} ${p[1]} ${m[0]} ${m[1]} `;
  }
  return d + "Z";
};
const mirror = (half: [number, number][]) => {
  const right = half;
  const left = [...half].reverse().map(([x, y]) => [2 * CX - x, y] as [number, number]);
  return [...right, ...left];
};

/* outlines (right half listed top→bottom, mirrored) */
const MANU_R: [number, number][] = [[456, 122], [522, 116], [536, 128], [548, 156], [566, 172], [570, 200], [560, 232], [538, 262], [516, 288]];
const BODY_R: [number, number][] = [[508, 298], [506, 330], [510, 372], [516, 414], [522, 456], [526, 496], [528, 532], [522, 568], [512, 596], [496, 624], [474, 646]];
const XIPH_R: [number, number][] = [[462, 652], [462, 676], [456, 704], [448, 734], [438, 768], [431, 790]];
const MANU = (() => {
  const r = MANU_R, l = [...r].reverse().map(([x, y]) => [2 * CX - x, y] as [number, number]);
  /* jugular notch between the two top points */
  return smooth([[CX, 150], ...r, ...l.slice(0, -1), [2 * CX - 456, 122]]);
})();
const BODY = smooth(mirror(BODY_R));
const XIPH = smooth([...XIPH_R.slice(0, -1), [CX + 4, 796], [CX - 4, 796], ...[...XIPH_R.slice(0, -1)].reverse().map(([x, y]) => [2 * CX - x, y] as [number, number])]);

/* costal cartilages: attach y, sternum edge x (right side), outer end, rib bone path continuation */
const CARTS: { n: number; y: number; x0: number; end: [number, number]; c: [number, number]; rib: string; w: number }[] = [
  { n: 1, y: 200, x0: 566, end: [640, 214], c: [600, 200], rib: "M 640 214 C 700 220 760 196 860 150", w: 34 },
  { n: 2, y: 297, x0: 510, end: [618, 312], c: [560, 296], rib: "M 618 312 C 700 318 780 290 880 236", w: 30 },
  { n: 3, y: 380, x0: 512, end: [640, 410], c: [570, 384], rib: "M 640 410 C 720 420 800 400 880 350", w: 28 },
  { n: 4, y: 458, x0: 522, end: [664, 506], c: [590, 462], rib: "M 664 506 C 740 516 820 494 880 456", w: 28 },
  { n: 5, y: 530, x0: 528, end: [690, 602], c: [600, 540], rib: "M 690 602 C 760 610 830 590 880 560", w: 26 },
  { n: 6, y: 592, x0: 514, end: [740, 720], c: [600, 618], rib: "M 740 720 C 800 724 850 700 880 676", w: 24 },
  { n: 7, y: 636, x0: 486, end: [790, 840], c: [600, 700], rib: "M 790 840 C 830 836 860 820 890 800", w: 22 },
];
const mirX = (d: string) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_m, x, y) => `${2 * CX - Number(x)} ${y}`);

export const Sternum: React.FC<{
  t: number;
  w: number;
  id: string;
  lit?: Partial<Record<P, number>>;
  hot?: P[];
  dim?: number;
  sword?: [number, number, number];
  clav?: number;
  rib2?: number;
  angle?: number;
  q?: number;
  mark?: Partial<Record<P, string>>;
  count?: number;
}> = ({ t, w, id, lit = {}, hot = [], dim = 0, sword = [0, 0, 0], clav = 0, rib2 = 0, angle = 0, q = 0, mark = {}, count = 0 }) => {
  const s = w / 860;
  const pulse = 0.5 + 0.5 * Math.sin(t * 7);
  const litP = (p: P) => (lit[p] === undefined ? 0 : ramp(t, lit[p]!, lit[p]! + 0.25));
  const partFill = (p: P) => {
    const k = litP(p);
    return { k, fill: k > 0 ? PCOL[p] : BONE };
  };
  const PART: Record<P, string> = { M: MANU, B: BODY, X: XIPH };
  const cartFill = (n: number) => (n === 2 && rib2 > 0 ? C.banana : CART);
  return (
    <svg width={w} height={920 * s} viewBox="0 0 860 920" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <pattern id={`hatch${id}`} width={9} height={9} patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1={0} y1={0} x2={0} y2={9} stroke={C.forest} strokeWidth={1.3} opacity={0.16} />
        </pattern>
        <pattern id={`dots${id}`} width={12} height={12} patternUnits="userSpaceOnUse">
          <circle cx={3} cy={3} r={1.4} fill={C.forest} opacity={0.14} />
          <circle cx={9} cy={9} r={1.1} fill={C.forest} opacity={0.1} />
        </pattern>
        <linearGradient id={`shade${id}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity={0.12} />
          <stop offset="0.35" stopColor="#000" stopOpacity={0} />
          <stop offset="0.7" stopColor="#fff" stopOpacity={0.12} />
          <stop offset="1" stopColor="#000" stopOpacity={0.1} />
        </linearGradient>
      </defs>
      {/* ribs (bone) + costal cartilages, both sides */}
      {[1, -1].map((side) => (
        <g key={side} opacity={1 - dim * 0.55}>
          {CARTS.map((c) => {
            const rib = side > 0 ? c.rib : mirX(c.rib);
            return (
              <g key={c.n}>
                <path d={rib} fill="none" stroke={C.forest} strokeWidth={c.w + 7} strokeLinecap="round" />
                <path d={rib} fill="none" stroke={BONE2} strokeWidth={c.w} strokeLinecap="round" />
                <path d={rib} fill="none" stroke={`url(#hatch${id})`} strokeWidth={c.w} strokeLinecap="round" />
              </g>
            );
          })}
          {CARTS.map((c) => {
            const x0 = side > 0 ? c.x0 - 12 : 2 * CX - c.x0 + 12;
            const ex = side > 0 ? c.end[0] : 2 * CX - c.end[0];
            const cx = side > 0 ? c.c[0] : 2 * CX - c.c[0];
            const d = `M ${x0} ${c.y} Q ${cx} ${c.c[1]} ${ex} ${c.end[1]}`;
            const hl = c.n === 2 && rib2 > 0;
            return (
              <g key={`c${c.n}`}>
                {hl && <path d={d} fill="none" stroke={C.banana} strokeWidth={c.w + 30 * rib2} strokeLinecap="round" opacity={0.55 + 0.3 * pulse} />}
                <path d={d} fill="none" stroke={C.forest} strokeWidth={c.w + 6} strokeLinecap="round" />
                <path d={d} fill="none" stroke={cartFill(c.n)} strokeWidth={c.w - 1} strokeLinecap="round" />
                <path d={d} fill="none" stroke={CART2} strokeWidth={3} strokeLinecap="round" opacity={hl ? 0 : 0.8} strokeDasharray="2 10" />
                {count > 0 && side > 0 && c.n >= 2 && c.n <= 5 && (
                  <g opacity={ramp(count, c.n - 1.6, c.n - 1.2)}>
                    <circle cx={ex + 30} cy={c.end[1] - 6} r={26} fill={c.n === 2 ? C.red : C.forest} stroke={C.paper} strokeWidth={4} />
                    <text x={ex + 30} y={c.end[1] + 5} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.paper}>{c.n}</text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      ))}
      {/* clavicles */}
      {[1, -1].map((side) => {
        const d = side > 0 ? "M 548 148 C 600 112 660 96 720 92 C 780 88 830 70 880 40" : mirX("M 548 148 C 600 112 660 96 720 92 C 780 88 830 70 880 40");
        return (
          <g key={`cl${side}`} opacity={1 - dim * 0.55}>
            {clav > 0 && <path d={d} fill="none" stroke={C.banana} strokeWidth={46 + 24 * clav} strokeLinecap="round" opacity={(0.5 + 0.3 * pulse) * clav} />}
            <path d={d} fill="none" stroke={C.forest} strokeWidth={50} strokeLinecap="round" />
            <path d={d} fill="none" stroke={clav > 0.5 ? "#E9C77B" : BONE2} strokeWidth={42} strokeLinecap="round" />
            <path d={d} fill="none" stroke={`url(#hatch${id})`} strokeWidth={42} strokeLinecap="round" />
          </g>
        );
      })}
      {/* sternum parts */}
      {PS.map((p) => {
        const { k, fill } = partFill(p);
        const isHot = hot.includes(p);
        const dd = dim > 0 && !isHot && k < 0.5 ? dim : 0;
        return (
          <g key={p} opacity={1 - dd * 0.5}>
            {isHot && <path d={PART[p]} fill="none" stroke={C.banana} strokeWidth={16 + 10 * pulse} strokeLinejoin="round" />}
            <path d={PART[p]} fill={BONE} stroke={C.forest} strokeWidth={6} strokeLinejoin="round" />
            <path d={PART[p]} fill={fill} opacity={k * 0.9} />
            <path d={PART[p]} fill={`url(#dots${id})`} />
            <path d={PART[p]} fill={`url(#shade${id})`} />
            <path d={PART[p]} fill="none" stroke={C.forest} strokeWidth={6} strokeLinejoin="round" />
          </g>
        );
      })}
      {/* surface detail: transverse ridges on the body (fused sternebrae), jugular notch shading */}
      {[378, 456, 530].map((y) => (
        <path key={y} d={`M ${CX - 62} ${y} Q ${CX} ${y + 8} ${CX + 62} ${y}`} fill="none" stroke={C.forest} strokeWidth={3} opacity={0.35} strokeLinecap="round" />
      ))}
      <path d={`M ${CX - 30} 140 Q ${CX} 168 ${CX + 30} 140`} fill="none" stroke={C.forest} strokeWidth={3} opacity={0.35} />
      {/* xiphisternal joint */}
      <path d={`M ${CX - 40} 650 L ${CX + 40} 650`} stroke={C.forest} strokeWidth={4} opacity={0.5} />
      {/* sternal angle ridge */}
      <g opacity={Math.max(angle, q)}>
        <path d={`M ${CX - 96} 293 L ${CX + 96} 293`} stroke={C.forest} strokeWidth={22} strokeLinecap="round" />
        <path d={`M ${CX - 96} 293 L ${CX + 96} 293`} stroke={angle > 0 ? C.banana : C.red} strokeWidth={13} strokeLinecap="round" opacity={0.75 + 0.25 * pulse} />
      </g>
      {q > 0 && (
        <g opacity={q} transform={`translate(${CX} 293) scale(${0.7 + 0.3 * q})`}>
          <circle cx={0} cy={0} r={44} fill={C.red} stroke={C.paper} strokeWidth={6} />
          <text x={0} y={17} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={52} fill={C.paper}>?</text>
        </g>
      )}
      {/* sword overlay (dashed ghost): handle, blade, tip */}
      {sword[0] > 0 && (
        <g opacity={sword[0]}>
          <circle cx={CX} cy={82} r={26} fill="rgba(242,209,78,0.25)" stroke={C.forest} strokeWidth={7} />
          <circle cx={CX} cy={82} r={26} fill="none" stroke={C.banana} strokeWidth={3} />
          <rect x={CX - 20} y={108} width={40} height={140} rx={10} fill="rgba(242,209,78,0.18)" stroke={C.forest} strokeWidth={7} strokeDasharray="14 10" />
          {[130, 160, 190, 220].map((y) => <line key={y} x1={CX - 18} y1={y} x2={CX + 18} y2={y + 12} stroke={C.forest} strokeWidth={4} opacity={0.6} />)}
          <rect x={CX - 118} y={252} width={236} height={26} rx={13} fill="rgba(242,209,78,0.35)" stroke={C.forest} strokeWidth={7} />
        </g>
      )}
      {sword[1] > 0 && (
        <g opacity={sword[1]}>
          <path d={`M ${CX - 46} 290 L ${CX + 46} 290 L ${CX + 52} 640 L ${CX - 52} 640 Z`} fill="rgba(255,255,255,0.18)" stroke={C.forest} strokeWidth={7} strokeDasharray="16 10" strokeLinejoin="round" />
          <line x1={CX} y1={300} x2={CX} y2={636} stroke={C.forest} strokeWidth={4} opacity={0.5} strokeDasharray="10 10" />
        </g>
      )}
      {sword[2] > 0 && (
        <g opacity={sword[2]}>
          <path d={`M ${CX - 52} 644 L ${CX + 52} 644 L ${CX} 820 Z`} fill="rgba(255,255,255,0.18)" stroke={C.forest} strokeWidth={7} strokeDasharray="16 10" strokeLinejoin="round" />
        </g>
      )}
      {/* letter marks */}
      {PS.map((p) =>
        mark[p] ? (
          <g key={`m${p}`} transform={`translate(${ANCHOR[p][0] + (p === "X" ? 0 : 0)} ${ANCHOR[p][1] + (p === "X" ? -10 : 0)})`}>
            <circle r={p === "X" ? 26 : 34} fill={PCOL[p]} stroke={C.paper} strokeWidth={5} />
            <text y={p === "X" ? 10 : 13} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={p === "X" ? 30 : 38} fill={C.paper}>{mark[p]}</text>
          </g>
        ) : null,
      )}
    </svg>
  );
};
