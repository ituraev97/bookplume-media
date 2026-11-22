import React from "react";
import { C, FONT, ramp } from "./kit";

/* Own schematic: LEFT forearm, palm view (medial = left of the picture, like Gray Fig. 414).
   Box 860 x 728. Heel of the other hand on the medial epicondyle, fingers fanned over the 4 superficial flexors. */
export type MId = "PT" | "FCR" | "PL" | "FCU";
export const MCOL: Record<MId, string> = { PT: "#C9483C", FCR: "#5C7A2F", PL: "#C99A12", FCU: "#2F6B8F" };
export const E: [number, number] = [262, 150];
type Mus = { id: MId; belly: [number, number]; tendon?: [number, number]; w: number; tw?: number; lab: [number, number]; name: string };
export const MUS: Mus[] = [
  { id: "PT", belly: [640, 440], w: 62, lab: [0.62, 0], name: "Pronator teres" },
  { id: "FCR", belly: [452, 470], tendon: [522, 708], w: 54, tw: 18, lab: [0.66, 0], name: "Flexor carpi radialis" },
  { id: "FCU", belly: [300, 580], tendon: [338, 708], w: 56, tw: 20, lab: [0.62, 0], name: "Flexor carpi ulnaris" },
  { id: "PL", belly: [352, 380], tendon: [432, 708], w: 40, tw: 11, lab: [0.62, 0], name: "Palmaris longus" },
];
/* finger angle (deg below horizontal, to the right), length */
const FING: { id: MId; tag: string; a: number; L: number }[] = [
  { id: "PT", tag: "index", a: 33, L: 300 },
  { id: "FCR", tag: "middle", a: 52, L: 330 },
  { id: "PL", tag: "ring", a: 69, L: 300 },
  { id: "FCU", tag: "little", a: 86, L: 235 },
];
const LAB: Record<MId, [number, number, number]> = {
  PT: [468, 300, 36],
  FCR: [398, 360, 59],
  PL: [372, 520, 76 - 180],
  FCU: [284, 400, 85 - 180],
};
const H: [number, number] = [262, 168];
const R = (d: number) => (d * Math.PI) / 180;

export const Forearm: React.FC<{
  t: number;
  lit: Record<MId, number>; // time each muscle lights up
  handOn: number; // hand appears
  spread: number; // fingers spread
  handOff: number; // hand fades
  bump: number; // epicondyle glow
  hold: number; // all labels on
  bump2: number; // second glow at "medial epicondyle"
}> = ({ t, lit, handOn, spread, handOff, bump, hold, bump2 }) => {
  const hp = ramp(t, handOn, handOn + 0.35) * (1 - ramp(t, handOff, handOff + 0.4));
  const sp = ramp(t, spread, spread + 0.8);
  const bg = Math.max(ramp(t, bump, bump + 0.2) * (1 - ramp(t, bump + 1.2, bump + 1.6)), ramp(t, bump2, bump2 + 0.25));
  const holdP = ramp(t, hold, hold + 0.35);
  let cur: MId | null = null;
  (Object.keys(lit) as MId[]).forEach((k) => {
    if (t >= lit[k] - 0.05 && t < hold) cur = k;
  });
  const line = (a: [number, number], b: [number, number], w: number, col: string, op = 1) => (
    <>
      <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={C.forest} strokeWidth={w + 9} strokeLinecap="round" opacity={op} />
      <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={col} strokeWidth={w} strokeLinecap="round" opacity={op} />
    </>
  );
  return (
    <svg width={860} height={728} viewBox="0 0 860 728" style={{ position: "absolute", left: 0, top: 0 }}>
      {/* forearm outline */}
      <path d="M196 40 C148 210 228 500 322 712 L572 712 C612 500 730 260 690 40 Z" fill="#F1E5D1" stroke={C.forest} strokeWidth={6} />
      {/* brachioradialis (context, not in the four) */}
      {line([640, 60], [556, 690], 70, "#D8CDB4")}
      <text x={0} y={0} transform="translate(588 590) rotate(-82)" fontFamily={FONT} fontWeight={800} fontSize={22} fill={C.forest} opacity={0.45} textAnchor="middle">brachioradialis</text>
      {/* the 4 muscles */}
      {MUS.map((m) => {
        const on = Math.max(ramp(t, lit[m.id] - 0.05, lit[m.id] + 0.2), holdP);
        const col = on > 0.5 ? m.id && MCOL[m.id] : "#D9CFB8";
        const hot = cur === m.id;
        return (
          <g key={m.id}>
            {hot && <line x1={E[0]} y1={E[1]} x2={m.belly[0]} y2={m.belly[1]} stroke={C.banana} strokeWidth={m.w + 30} strokeLinecap="round" opacity={0.85} />}
            {m.tendon && line(m.belly, m.tendon, m.tw!, on > 0.5 ? "#F7F2E2" : "#EDE6D2")}
            {line(E, m.belly, m.w, col)}
          </g>
        );
      })}
      {/* epicondyle */}
      <circle cx={E[0]} cy={E[1]} r={40 + 14 * bg} fill={C.banana} opacity={0.8 * bg} />
      <circle cx={E[0]} cy={E[1]} r={30} fill="#EDE5CC" stroke={C.forest} strokeWidth={5} />
      {/* ghost hand: heel on the medial epicondyle, fingers fanned */}
      {hp > 0.01 && (
        <>
        <g opacity={hp * 0.58}>
          {FING.map((f, i) => {
            const a = R(f.a * sp + 62 * (1 - sp));
            const L = f.L * (0.55 + 0.45 * sp);
            const s0: [number, number] = [H[0] + Math.cos(a) * 60, H[1] + Math.sin(a) * 60];
            const s1: [number, number] = [H[0] + Math.cos(a) * L, H[1] + Math.sin(a) * L];
            const fh = cur === f.id;
            return (
              <g key={i}>
                <line x1={s0[0]} y1={s0[1]} x2={s1[0]} y2={s1[1]} stroke={fh ? C.banana : C.forest} strokeWidth={fh ? 62 : 54} strokeLinecap="round" />
                <line x1={s0[0]} y1={s0[1]} x2={s1[0]} y2={s1[1]} stroke="#FFFDF5" strokeWidth={46} strokeLinecap="round" />
              </g>
            );
          })}
          <circle cx={H[0]} cy={H[1]} r={92} fill="#FFFDF5" stroke={C.forest} strokeWidth={5} />
        </g>
        <g opacity={hp}>
          <text x={H[0] - 6} y={H[1] - 10} fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.forest} textAnchor="middle">heel of</text>
          <text x={H[0] - 6} y={H[1] + 20} fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.forest} textAnchor="middle">your hand</text>
        </g>
        </>
      )}
      {/* fingertip tags */}
      {hp > 0.01 &&
        FING.map((f, i) => {
          const p = ramp(t, lit[f.id] - 0.1, lit[f.id] + 0.15) * hp;
          if (p <= 0) return null;
          const a = R(f.a);
          const x = H[0] + Math.cos(a) * (f.L + 34), y = H[1] + Math.sin(a) * (f.L + 34);
          return (
            <g key={i} opacity={p}>
              <rect x={x - 52} y={y - 20} width={104} height={40} rx={12} fill={C.forest} />
              <text x={x} y={y + 9} fontFamily={FONT} fontWeight={800} fontSize={25} fill={C.banana} textAnchor="middle">{f.tag}</text>
            </g>
          );
        })}
      {/* hold labels along each muscle */}
      {holdP > 0.01 &&
        MUS.map((m, i) => {
          const [x, y, rot] = LAB[m.id];
          const p = ramp(t, hold + i * 0.06, hold + 0.3 + i * 0.06);
          return (
            <g key={m.id} transform={`translate(${x} ${y}) rotate(${rot}) scale(${0.85 + 0.15 * p})`} opacity={p}>
              <rect x={-m.name.length * 7.6 - 14} y={-21} width={m.name.length * 15.2 + 28} height={42} rx={12} fill={MCOL[m.id]} stroke={C.forest} strokeWidth={4} />
              <text x={0} y={9} fontFamily={FONT} fontWeight={800} fontSize={26} fill="#fff" textAnchor="middle">{m.name}</text>
            </g>
          );
        })}
      {holdP > 0.01 && (
        <g opacity={ramp(t, bump2 - 0.1, bump2 + 0.2)}>
          <line x1={E[0] - 30} y1={E[1]} x2={96} y2={E[1] + 100} stroke={C.forest} strokeWidth={4} />
          <rect x={14} y={E[1] + 100} width={200} height={64} rx={12} fill={C.banana} stroke={C.forest} strokeWidth={4} />
          <text x={114} y={E[1] + 126} fontFamily={FONT} fontWeight={800} fontSize={22} fill={C.forest} textAnchor="middle">medial</text>
          <text x={114} y={E[1] + 152} fontFamily={FONT} fontWeight={800} fontSize={22} fill={C.forest} textAnchor="middle">epicondyle</text>
        </g>
      )}
    </svg>
  );
};
