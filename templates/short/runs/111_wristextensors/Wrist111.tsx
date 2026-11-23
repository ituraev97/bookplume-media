import React from "react";
import { C, FONT, ramp } from "./kit";

/* Own schematic: back of the LEFT hand + wrist (dorsal view, thumb on the RIGHT, like Gray Fig. 1234).
   Box 860 x 728. The 6 extensor compartments (radial -> ulnar = right -> left) light up one by one.
   Tendons: C1 APL+EPB, C2 ECRL+ECRB, C3 EPL, C4 ED+EI, C5 EDM, C6 ECU. Schematic only. */
export type CId = 1 | 2 | 3 | 4 | 5 | 6;
export const CCOL: Record<CId, string> = { 1: "#C9483C", 2: "#5C7A2F", 3: "#C99A12", 4: "#2F6B8F", 5: "#7B4A9A", 6: "#D9772B" };
export const CNAME: Record<CId, string> = { 1: "APL + EPB", 2: "ECRL + ECRB", 3: "EPL", 4: "ED + EI", 5: "EDM", 6: "ECU" };
export const CFULL: Record<CId, string[]> = {
  1: ["Abductor pollicis longus", "Extensor pollicis brevis"],
  2: ["Extensor carpi radialis longus", "Extensor carpi radialis brevis"],
  3: ["Extensor pollicis longus"],
  4: ["Extensor digitorum", "Extensor indicis"],
  5: ["Extensor digiti minimi"],
  6: ["Extensor carpi ulnaris"],
};
export const CCOUNT: Record<CId, number> = { 1: 2, 2: 2, 3: 1, 4: 2, 5: 1, 6: 1 };
type Pt = [number, number];
/* tunnel centre x, width; tendons = polylines from the tunnel upward to the insertion */
const Y0 = 452; // tunnel top
const Y1 = 512; // tunnel bottom
type Comp = { id: CId; x: number; w: number; tend: { pts: Pt[]; w: number }[] };
export const COMPS: Comp[] = [
  { id: 6, x: 168, w: 50, tend: [{ pts: [[168, 740], [168, Y0], [150, 372], [128, 332]], w: 15 }] },
  { id: 5, x: 262, w: 50, tend: [{ pts: [[262, 740], [262, Y0], [214, 350], [150, 260], [132, 76]], w: 12 }] },
  { id: 4, x: 384, w: 120, tend: [
    { pts: [[348, 740], [348, Y0], [250, 300], [262, 84]], w: 11 },
    { pts: [[372, 740], [372, Y0], [372, 300], [384, 66]], w: 11 },
    { pts: [[396, 740], [396, Y0], [462, 300], [494, 84]], w: 11 },
    { pts: [[420, 740], [420, Y0], [470, 330], [500, 250]], w: 9 },
  ] },
  { id: 3, x: 492, w: 46, tend: [{ pts: [[492, 740], [492, Y0], [530, 420], [650, 340], [768, 176]], w: 12 }] },
  { id: 2, x: 590, w: 78, tend: [
    { pts: [[572, 740], [572, Y0], [560, 400], [400, 336]], w: 13 },
    { pts: [[608, 740], [608, Y0], [596, 400], [522, 336]], w: 13 },
  ] },
  { id: 1, x: 690, w: 82, tend: [
    { pts: [[672, 740], [672, Y0], [668, 380], [660, 336]], w: 13 },
    { pts: [[708, 740], [708, Y0], [712, 380], [722, 240]], w: 12 },
  ] },
];
const pstr = (p: Pt[]) => p.map((q) => q.join(",")).join(" ");

export const Wrist: React.FC<{
  t: number;
  lit: Record<CId, number>; // time each compartment lights
  hold: number; // all labels on
  tag?: boolean;
}> = ({ t, lit, hold }) => {
  const holdP = ramp(t, hold, hold + 0.35);
  let cur: CId | null = null;
  (Object.keys(lit) as unknown as CId[]).forEach((k) => {
    if (t >= lit[k] - 0.05 && t < hold) cur = Number(k) as CId;
  });
  return (
    <svg width={860} height={728} viewBox="0 0 860 728" style={{ position: "absolute", left: 0, top: 0 }}>
      {/* forearm */}
      <path d="M118 540 L108 728 L690 728 L700 540 Z" fill="#F1E5D1" stroke={C.forest} strokeWidth={6} />
      {/* back of the hand */}
      <path d="M118 560 C96 470 82 380 100 300 L610 300 C640 380 720 460 706 560 Z" fill="#F1E5D1" stroke={C.forest} strokeWidth={6} />
      {/* fingers */}
      {([[132, 250, 60], [262, 250, 34], [384, 250, 22], [500, 250, 40]] as number[][]).map(([x, y1, y0], i) => (
        <g key={i}>
          <line x1={x} y1={y1 + 40} x2={x} y2={y0} stroke={C.forest} strokeWidth={70} strokeLinecap="round" />
          <line x1={x} y1={y1 + 40} x2={x} y2={y0} stroke="#F1E5D1" strokeWidth={60} strokeLinecap="round" />
        </g>
      ))}
      <line x1={650} y1={330} x2={776} y2={166} stroke={C.forest} strokeWidth={78} strokeLinecap="round" />
      <line x1={650} y1={330} x2={776} y2={166} stroke="#F1E5D1" strokeWidth={68} strokeLinecap="round" />
      {/* wrist band: extensor retinaculum */}
      <rect x={112} y={Y0 - 18} width={594} height={Y1 - Y0 + 36} rx={20} fill="#E3D7BD" stroke={C.forest} strokeWidth={5} opacity={0.9} />
      {COMPS.map((c) => {
        const on = Math.max(ramp(t, lit[c.id] - 0.05, lit[c.id] + 0.2), holdP);
        const col = on > 0.5 ? CCOL[c.id] : "#C9BEA3";
        const hot = cur === c.id;
        return (
          <g key={c.id}>
            {hot && c.tend.map((tn, i) => <polyline key={i} points={pstr(tn.pts)} fill="none" stroke={C.banana} strokeWidth={tn.w + 22} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} />)}
            {c.tend.map((tn, i) => (
              <g key={i}>
                <polyline points={pstr(tn.pts)} fill="none" stroke={C.forest} strokeWidth={tn.w + 6} strokeLinecap="round" strokeLinejoin="round" />
                <polyline points={pstr(tn.pts)} fill="none" stroke={col} strokeWidth={tn.w} strokeLinecap="round" strokeLinejoin="round" />
              </g>
            ))}
            <rect x={c.x - c.w / 2 - 10} y={Y0 - 10} width={c.w + 20} height={Y1 - Y0 + 20} rx={22} fill={hot ? C.banana : "#FFFDF5"} fillOpacity={hot ? 0.6 : 0.5} stroke={col} strokeWidth={hot ? 9 : 6} />
            {c.tend.map((tn, i) => <line key={i} x1={tn.pts[0][0]} y1={Y0 + 4} x2={tn.pts[0][0]} y2={Y1 - 4} stroke={col} strokeWidth={tn.w} strokeLinecap="round" />)}
            {/* number chip under the tunnel */}
            <g transform={`translate(${c.x} ${Y1 + 52}) scale(${hot ? 1.2 : 1})`}>
              <circle r={29} fill={on > 0.5 ? CCOL[c.id] : "#D9CFB8"} stroke={C.forest} strokeWidth={5} />
              <text y={14} fontFamily={FONT} fontWeight={800} fontSize={40} fill={on > 0.5 ? "#fff" : "#8B826A"} textAnchor="middle">{c.id}</text>
            </g>
          </g>
        );
      })}
      {/* side tags */}
      <text x={742} y={Y1 + 100} fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.forest} opacity={0.6} textAnchor="middle">thumb</text>
      <text x={742} y={Y1 + 126} fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.forest} opacity={0.6} textAnchor="middle">side →</text>
      <text x={96} y={Y1 + 100} fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.forest} opacity={0.6} textAnchor="middle">← pinky</text>
      <text x={96} y={Y1 + 126} fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.forest} opacity={0.6} textAnchor="middle">side</text>
      {/* hold labels in two staggered rows under the numbers */}
      {holdP > 0.01 &&
        COMPS.map((c, i) => {
          const row = c.id % 2 === 0 ? 0 : 1;
          const y = Y1 + 128 + row * 56;
          const p = ramp(t, hold + i * 0.06, hold + 0.3 + i * 0.06);
          const wd = CNAME[c.id].length * 15.5 + 30;
          return (
            <g key={c.id} transform={`translate(${c.x} ${y}) scale(${0.85 + 0.15 * p})`} opacity={p}>
              <rect x={-wd / 2} y={-22} width={wd} height={44} rx={12} fill={CCOL[c.id]} stroke={C.forest} strokeWidth={4} />
              <text x={0} y={9} fontFamily={FONT} fontWeight={800} fontSize={25} fill="#fff" textAnchor="middle">{CNAME[c.id]}</text>
            </g>
          );
        })}
    </svg>
  );
};
