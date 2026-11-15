import React from "react";
import { C, FONT } from "./kit";

/* Book Plume's own diagram of the anatomical snuffbox: LEFT hand seen from the back, thumb lifted (extended) to the viewer's right,
   viewBox 1000 x 1000. Borders: APL + EPB on the thumb (radial) side, EPL on the other (ulnar) side; floor: scaphoid + trapezium;
   radial artery crossing the floor deep to the tendons; radial styloid at the proximal end. */
export type SP = "APL" | "EPB" | "EPL" | "SCA" | "TRA" | "RA";
export const SORDER: SP[] = ["APL", "EPB", "EPL", "SCA", "TRA", "RA"];
export const SNAME: Record<SP, string> = { APL: "Abductor pollicis longus", EPB: "Extensor pollicis brevis", EPL: "Extensor pollicis longus", SCA: "Scaphoid", TRA: "Trapezium", RA: "Radial artery" };
export const SSHORT: Record<SP, string> = { APL: "APL", EPB: "EPB", EPL: "EPL", SCA: "scaphoid", TRA: "trapezium", RA: "radial artery" };
/* groups of the 2-1-2-1 trick */
export const GCOL = { g2t: "#5C8F2A", g1t: "#E0861A", g2b: "#C99A12", g1a: "#D93A2B" } as const;
export type G = keyof typeof GCOL;
export const SGROUP: Record<SP, G> = { APL: "g2t", EPB: "g2t", EPL: "g1t", SCA: "g2b", TRA: "g2b", RA: "g1a" };
export const SCOL = (p: SP) => GCOL[SGROUP[p]];

type P = [number, number];
const SKIN = "#F2DCC2";
const SKIN_D = "#E2C3A3";
const DIM_T = "#EDE6D3";
const DIM_B = "#E6DCC3";
const BONE = "#F4EBCF";

/* thumb pivot (base of the 1st metacarpal) */
const PIV: P = [628, 548];
const rot = (q: P, deg: number): P => {
  const a = (deg * Math.PI) / 180;
  const c = Math.cos(a), s = Math.sin(a);
  return [PIV[0] + q[0] * c - q[1] * s, PIV[1] + q[0] * s + q[1] * c];
};
const pt = (q: P) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`;

/* anchors for tags (thumb angle 40) */
export const SANCH: Record<SP, P> = { APL: [868, 940], EPB: [770, 860], EPL: [440, 860], SCA: [630, 720], TRA: [640, 636], RA: [870, 900] };

export const Snuff: React.FC<{
  t: number; w: number; id: string;
  lit?: Partial<Record<SP, number>>; hot?: SP[]; dim?: number; ang?: number; box?: number; pulse?: number; raQ?: boolean;
}> = ({ t, w, id, lit = {}, hot = [], dim = 0, ang = 40, box = 0, pulse = 0, raQ = false }) => {
  const on = (m: SP) => lit[m] !== undefined && t >= (lit[m] as number) - 0.05;
  const isHot = (m: SP) => hot.includes(m);
  const op = (m: SP) => (dim > 0 && !isHot(m) ? 1 - 0.5 * dim : 1);
  const glow = (m: SP) => (isHot(m) ? `url(#sg${id})` : undefined);
  const T = (q: P) => rot(q, ang);

  /* thumb outline in local coords (axis = -y), then rotated */
  const thumbL: P[] = [[-96, -50], [-92, -190], [-84, -240], [-80, -310], [-74, -340], [-70, -392], [-52, -432], [0, -446], [52, -432], [70, -392], [76, -340], [82, -310], [88, -240], [98, -190], [108, -50]];
  const nail = ([[-38, -404], [-34, -430], [0, -437], [34, -430], [38, -404], [0, -394]] as P[]).map((q) => pt(T(q)));
  const tu = T([-96, -50]), tr = T([108, -50]);
  const body = `M 210 1010 C 226 900 244 800 262 700 C 246 600 214 480 206 360 C 200 260 204 140 212 -20 L 548 -20 C 552 120 560 260 ${tu[0] - 30} ${tu[1] - 70} C ${tu[0] - 14} ${tu[1] - 30} ${tu[0] - 6} ${tu[1] - 16} ${tu[0]} ${tu[1]} L ${thumbL.slice(1, -1).map((q) => pt(T(q))).join(" L ")} L ${tr[0]} ${tr[1]} C ${tr[0] - 4} ${tr[1] + 56} 846 660 856 780 C 864 860 872 940 878 1010 Z`;

  /* bones under the skin (faint) */
  const mc1a = T([0, 0]), mc1b = T([0, -220]);
  const pp1a = T([0, -240]), pp1b = T([0, -340]);
  const dp1a = T([0, -356]), dp1b = T([0, -420]);

  /* tendons: proximal (forearm) points fixed, distal on the rotated thumb */
  const aplD = T([84, -10]);
  const epbD = T([44, -240]);
  const eplD = T([-36, -360]);
  const APL = `M 846 1010 C 836 920 822 850 806 790 C 790 730 ${aplD[0] + 34} ${aplD[1] + 60} ${aplD[0]} ${aplD[1]}`;
  const EPB = `M 790 1010 C 778 920 766 850 752 790 C 738 730 ${T([50, -10])[0] + 10} ${T([50, -10])[1] + 40} ${T([48, -70])[0]} ${T([48, -70])[1]} L ${epbD[0]} ${epbD[1]}`;
  const EPL = `M 400 1010 C 416 930 436 860 458 800 C 480 740 510 680 546 630 C 570 596 ${T([-50, -20])[0] - 10} ${T([-50, -20])[1] + 20} ${T([-46, -80])[0]} ${T([-46, -80])[1]} L ${T([-40, -240])[0]} ${T([-40, -240])[1]} L ${eplD[0]} ${eplD[1]}`;

  /* the hollow between the tendons */
  const ap = T([0, -16]);
  const hollow = `M ${ap[0]} ${ap[1]} C ${ap[0] - 60} ${ap[1] + 40} 520 700 506 780 C 580 806 680 806 754 784 C 744 690 ${ap[0] + 50} ${ap[1] + 40} ${ap[0]} ${ap[1]} Z`;

  /* radial artery: from the front (lower right) around the radial edge, across the floor, under EPL into the 1st web space */
  const RA = `M 940 1010 C 910 930 870 860 820 820 C 760 772 700 750 662 700 C 630 656 610 620 584 586 C 560 556 532 530 500 500`;
  const tCol = (m: SP) => (on(m) ? SCOL(m) : DIM_T);
  const Tendon: React.FC<{ m: SP; d: string; wd: number }> = ({ m, d, wd }) => (
    <g opacity={op(m)} filter={glow(m)}>
      {isHot(m) && <path d={d} fill="none" stroke={C.banana} strokeWidth={wd + 26} strokeLinecap="round" strokeLinejoin="round" />}
      <path d={d} fill="none" stroke={C.forest} strokeWidth={wd + 10} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={tCol(m)} strokeWidth={wd} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={wd * 0.22} strokeLinecap="round" strokeDasharray="34 18" transform={`translate(${-wd * 0.18} 0)`} />
    </g>
  );
  const bFill = (m: SP) => (on(m) ? (isHot(m) ? "#FFD84A" : "#F2C94C") : DIM_B);
  const scaC = [632, 722] as P, traC = [640, 640] as P;
  const raOn = on("RA");
  const pr = pulse > 0 ? (Math.sin(t * 9) + 1) / 2 : 0;
  return (
    <svg width={w} height={w} viewBox="0 0 1000 1000" style={{ overflow: "visible" }}>
      <defs>
        <filter id={`sg${id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id={`hol${id}`} cx="0.5" cy="0.55" r="0.6">
          <stop offset="0" stopColor="#B98A63" stopOpacity="0.75" />
          <stop offset="1" stopColor="#D9B08A" stopOpacity="0.15" />
        </radialGradient>
        <clipPath id={`clip${id}`}><path d={body} /></clipPath>
      </defs>
      {/* skin */}
      <path d={body} fill={SKIN} stroke={C.forest} strokeWidth={7} strokeLinejoin="round" />
      <path d={"M " + nail.join(" L ") + " Z"} fill="#F8EEE2" stroke={C.forest} strokeWidth={4} />
      {/* faint skeleton */}
      <g clipPath={`url(#clip${id})`} opacity={0.5}>
        {[[290, 640, 262, 150], [360, 620, 350, 110], [432, 606, 438, 100], [500, 600, 520, 130]].map(([x0, y0, x1, y1], i) => (
          <path key={i} d={`M ${x0} ${y0} L ${x1} ${y1}`} stroke={SKIN_D} strokeWidth={44} strokeLinecap="round" />
        ))}
        {[[mc1a, mc1b], [pp1a, pp1b], [dp1a, dp1b]].map(([a, b], i) => (
          <path key={i} d={`M ${pt(a)} L ${pt(b)}`} stroke={SKIN_D} strokeWidth={48 - i * 8} strokeLinecap="round" />
        ))}
        <path d="M 300 1010 L 316 720" stroke={SKIN_D} strokeWidth={70} strokeLinecap="round" />
        <path d="M 620 1010 C 640 920 660 860 680 820" stroke={SKIN_D} strokeWidth={130} strokeLinecap="round" />
      </g>
      {/* hollow */}
      <path d={hollow} fill={`url(#hol${id})`} opacity={0.55 + 0.45 * box} />
      {box > 0 && <path d={hollow} fill="none" stroke={C.banana} strokeWidth={10} strokeDasharray="18 12" opacity={box} />}
      {/* floor bones */}
      <g opacity={op("SCA")} filter={glow("SCA")}>
        <ellipse cx={scaC[0]} cy={scaC[1]} rx={56} ry={34} transform={`rotate(-30 ${scaC[0]} ${scaC[1]})`} fill={bFill("SCA")} stroke={C.forest} strokeWidth={5} />
        <path d={`M ${scaC[0] - 22} ${scaC[1] + 6} q 20 -16 42 -10`} stroke="rgba(31,42,20,0.3)" strokeWidth={3} fill="none" />
      </g>
      <g opacity={op("TRA")} filter={glow("TRA")}>
        <path d={`M ${traC[0] - 30} ${traC[1] + 6} q 6 -34 38 -34 q 32 4 30 36 q -6 30 -36 30 q -30 -4 -32 -32 Z`} fill={bFill("TRA")} stroke={C.forest} strokeWidth={5} />
      </g>
      {/* radial styloid */}
      <path d="M 600 800 q 70 -26 150 -10" stroke={C.forest} strokeWidth={5} fill="none" opacity={0.6} />
      {/* radial artery (under the tendons) */}
      <g opacity={op("RA")} filter={glow("RA")}>
        {isHot("RA") && <path d={RA} fill="none" stroke={C.banana} strokeWidth={46} strokeLinecap="round" />}
        <path d={RA} fill="none" stroke={C.forest} strokeWidth={28} strokeLinecap="round" />
        <path d={RA} fill="none" stroke={raOn ? GCOL.g1a : "#E7B9AE"} strokeWidth={18 + 6 * pr} strokeLinecap="round" />
        <path d={RA} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={5} strokeLinecap="round" transform="translate(-4 -3)" />
      </g>
      {pulse > 0 && raOn && (
        <g opacity={pulse}>
          {[0, 1].map((k) => {
            const ph = ((t * 1.6 + k * 0.5) % 1);
            return <circle key={k} cx={650} cy={690} r={30 + ph * 90} fill="none" stroke={GCOL.g1a} strokeWidth={8} opacity={(1 - ph) * 0.8} />;
          })}
        </g>
      )}
      {/* tendons over the artery */}
      <Tendon m="EPL" d={EPL} wd={30} />
      <Tendon m="APL" d={APL} wd={32} />
      <Tendon m="EPB" d={EPB} wd={26} />
      {raQ && raOn && (
        <g>
          <circle cx={846} cy={900} r={40} fill={C.banana} stroke={C.forest} strokeWidth={6} />
          <text x={846} y={918} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={52} fill={C.forest}>?</text>
        </g>
      )}
    </svg>
  );
};
