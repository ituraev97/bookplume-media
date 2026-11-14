import React from "react";
import { C, FONT, ramp } from "./kit";

/* Book Plume diagram: cross-section of the RIGHT wrist at the carpal tunnel, palm side UP, thumb side on the LEFT
   (same orientation as Gray's Fig. 422). viewBox 900 x 640. */

export type K =
  | "S2" | "S3" | "S4" | "S5" // flexor digitorum superficialis tendons (index, middle, ring, little)
  | "P2" | "P3" | "P4" | "P5" // flexor digitorum profundus tendons
  | "FPL" | "MED";
export const GCOL = { S: "#E0644F", P: "#3E7C93", F: "#E89A3C", M: "#F2D14E" };
export const grp = (k: K) => (k[0] === "S" ? "S" : k[0] === "P" ? "P" : k === "FPL" ? "F" : "M") as keyof typeof GCOL;

/* centre + radii of every structure (viewBox units) */
export const POS: Record<K | "FCR" | "PL" | "UA" | "UN", [number, number, number, number]> = {
  S3: [445, 322, 29, 22],
  S4: [507, 325, 28, 21],
  S2: [404, 366, 27, 22],
  S5: [563, 362, 24, 20],
  P2: [396, 414, 27, 22],
  P3: [455, 420, 29, 23],
  P4: [514, 417, 28, 22],
  P5: [568, 405, 23, 20],
  FPL: [320, 372, 25, 23],
  MED: [357, 322, 31, 15],
  FCR: [281, 314, 15, 13],
  PL: [452, 252, 27, 8],
  UA: [697, 300, 15, 15],
  UN: [727, 314, 13, 12],
};
/* order of the running count 1..10 */
export const COUNT: K[] = ["S3", "S4", "S2", "S5", "P2", "P3", "P4", "P5", "FPL", "MED"];
export const ANCHOR = {
  RET: [455, 262] as [number, number],
  FLOOR: [455, 520] as [number, number],
  HOOK: [648, 352] as [number, number],
  TRAP: [225, 430] as [number, number],
  GUYON: [712, 306] as [number, number],
};

const TISSUE = "M 70 330 C 70 215 190 165 330 172 C 420 176 520 168 640 178 C 780 190 852 262 846 352 C 840 470 760 600 600 618 C 470 632 330 630 210 600 C 110 575 70 470 70 330 Z";

const Bone: React.FC<{ d: string; id: string; name?: string; nx?: number; ny?: number; o?: number; fs?: number }> = ({ d, id, name, nx = 0, ny = 0, o = 1, fs = 22 }) => (
  <g opacity={o}>
    <path d={d} fill="#EFE6CC" stroke={C.forest} strokeWidth={5} />
    <path d={d} fill={`url(#spongy${id})`} />
    {name && (
      <text x={nx} y={ny} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={fs} fill={C.forest} opacity={0.62} fontStyle="italic">
        {name}
      </text>
    )}
  </g>
);

export const Tunnel: React.FC<{
  t: number;
  w: number;
  id: string;
  lit?: Partial<Record<K, number>>; // time each structure lights up
  hot?: K[];
  nums?: boolean; // running count badges
  ret?: number; // 0..1 highlight retinaculum (roof)
  floor?: number; // 0..1 highlight carpal bones (floor)
  ulnar?: number; // 0..1 highlight ulnar nerve + artery / Guyon's canal
  boneNames?: number; // 0..1
}> = ({ t, w, id, lit = {}, hot = [], nums, ret = 0, floor = 0, ulnar = 0, boneNames = 0 }) => {
  const h = (w * 640) / 900;
  const on = (k: K) => (lit[k] === undefined ? 0 : ramp(t, lit[k]!, lit[k]! + 0.25));
  const pulse = 0.5 + 0.5 * Math.sin(t * 7);
  const tendon = (k: K) => {
    const [x, y, rx, ry] = POS[k];
    const p = on(k);
    const g = grp(k);
    const col = GCOL[g];
    const isHot = hot.includes(k);
    const s = 1 + 0.12 * p * (1 - ramp(t, (lit[k] ?? 0) + 0.25, (lit[k] ?? 0) + 0.55)) + (isHot ? 0.04 * pulse : 0);
    if (k === "MED") {
      return (
        <g key={k} transform={`translate(${x} ${y}) scale(${s})`}>
          {isHot && <ellipse rx={rx + 14} ry={ry + 12} fill={C.banana} opacity={0.35 + 0.25 * pulse} />}
          <ellipse rx={rx} ry={ry} fill={p > 0 ? col : "#EDE3B8"} stroke={C.forest} strokeWidth={4} />
          {/* nerve fascicles */}
          {[-17, -6, 5, 16].map((dx, i) => (
            <ellipse key={i} cx={dx} cy={i % 2 ? 2 : -2} rx={6} ry={5.5} fill="none" stroke={C.forest} strokeWidth={2} opacity={0.55} />
          ))}
        </g>
      );
    }
    return (
      <g key={k} transform={`translate(${x} ${y}) scale(${s})`}>
        {isHot && <ellipse rx={rx + 12} ry={ry + 12} fill={C.banana} opacity={0.35 + 0.25 * pulse} />}
        {/* synovial sheath */}
        <ellipse rx={rx + 6} ry={ry + 6} fill="#DCEBEF" stroke="#9BB8C0" strokeWidth={2} opacity={0.9} />
        <ellipse rx={rx} ry={ry} fill="#FBF8EE" stroke={C.forest} strokeWidth={4} />
        <ellipse rx={rx} ry={ry} fill={col} opacity={p} stroke={C.forest} strokeWidth={4} />
        {/* collagen fibres */}
        <path d={`M ${-rx * 0.55} ${-ry * 0.2} Q 0 ${-ry * 0.55} ${rx * 0.55} ${-ry * 0.2} M ${-rx * 0.6} ${ry * 0.25} Q 0 ${ry * 0.6} ${rx * 0.6} ${ry * 0.25}`} stroke={p > 0.5 ? "rgba(255,255,255,0.55)" : "rgba(31,42,20,0.18)"} strokeWidth={2.5} fill="none" />
        <ellipse cx={-rx * 0.3} cy={-ry * 0.35} rx={rx * 0.28} ry={ry * 0.18} fill="#fff" opacity={0.45} />
      </g>
    );
  };
  const r = ret, f = floor, u = ulnar;
  return (
    <svg width={w} height={h} viewBox="0 0 900 640" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <pattern id={`spongy${id}`} width={22} height={22} patternUnits="userSpaceOnUse">
          <circle cx={5} cy={6} r={2.6} fill="#B9A97A" opacity={0.55} />
          <circle cx={15} cy={14} r={2} fill="#B9A97A" opacity={0.5} />
          <circle cx={9} cy={18} r={1.4} fill="#B9A97A" opacity={0.45} />
        </pattern>
        <pattern id={`fat${id}`} width={34} height={30} patternUnits="userSpaceOnUse">
          <path d="M 2 15 Q 9 6 17 15 T 32 15" stroke="#D8CDAE" strokeWidth={2} fill="none" />
        </pattern>
        <pattern id={`musc${id}`} width={14} height={14} patternUnits="userSpaceOnUse" patternTransform="rotate(-28)">
          <line x1={0} y1={7} x2={14} y2={7} stroke="#7E2E26" strokeWidth={3} opacity={0.35} />
        </pattern>
        <pattern id={`fib${id}`} width={10} height={10} patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
          <line x1={0} y1={5} x2={10} y2={5} stroke={C.forest} strokeWidth={1.6} opacity={0.35} />
        </pattern>
        <radialGradient id={`tis${id}`} cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#FBF1E1" />
          <stop offset="100%" stopColor="#F0DFC6" />
        </radialGradient>
      </defs>
      {/* soft tissue + skin */}
      <path d={TISSUE} fill={`url(#tis${id})`} stroke="#C79B83" strokeWidth={10} />
      <path d={TISSUE} fill={`url(#fat${id})`} opacity={0.8} />
      <path d={TISSUE} fill="none" stroke={C.forest} strokeWidth={4} />
      {/* thenar + hypothenar muscles */}
      <path d="M 96 300 C 110 230 200 205 262 236 C 300 258 292 318 252 336 C 200 360 120 360 96 300 Z" fill="#C9675B" stroke={C.forest} strokeWidth={4} />
      <path d="M 96 300 C 110 230 200 205 262 236 C 300 258 292 318 252 336 C 200 360 120 360 96 300 Z" fill={`url(#musc${id})`} />
      <path d="M 700 352 C 742 330 812 340 826 392 C 838 446 790 500 742 494 C 700 488 682 420 700 352 Z" fill="#C9675B" stroke={C.forest} strokeWidth={4} />
      <path d="M 700 352 C 742 330 812 340 826 392 C 838 446 790 500 742 494 C 700 488 682 420 700 352 Z" fill={`url(#musc${id})`} />
      {/* floor highlight */}
      {f > 0 && <path d="M 262 420 C 300 470 370 470 455 478 C 540 482 610 470 650 400" stroke={C.banana} strokeWidth={60 * f} strokeLinecap="round" fill="none" opacity={0.55} />}
      {/* carpal bones (distal row) */}
      <Bone id={id} d="M 150 420 C 150 372 196 346 244 336 C 262 318 284 322 282 346 C 300 378 300 440 282 476 C 262 512 186 516 160 486 C 150 470 150 444 150 420 Z" name={boneNames ? "trapezium" : undefined} nx={215} ny={450} />
      <Bone id={id} d="M 286 470 C 288 448 318 440 352 446 C 380 452 392 476 386 506 C 378 540 330 548 302 534 C 286 524 284 496 286 470 Z" name={boneNames ? "trapezoid" : undefined} nx={337} ny={498} fs={17} />
      <Bone id={id} d="M 380 500 C 384 470 420 458 460 460 C 506 462 532 486 530 520 C 528 562 488 586 452 584 C 412 582 378 556 380 500 Z" name={boneNames ? "capitate" : undefined} nx={456} ny={528} />
      <Bone id={id} d="M 528 482 C 540 452 584 440 616 440 C 626 410 632 370 642 344 C 652 330 668 334 668 352 C 668 384 660 420 668 448 C 690 474 690 520 664 546 C 632 572 560 566 538 540 C 524 522 522 500 528 482 Z" name={boneNames ? "hamate" : undefined} nx={606} ny={510} />
      {/* FCR in its own compartment, palmaris longus on top */}
      <ellipse cx={POS.FCR[0]} cy={POS.FCR[1]} rx={POS.FCR[2]} ry={POS.FCR[3]} fill="#FBF8EE" stroke={C.forest} strokeWidth={3} opacity={0.85} />
      {/* flexor retinaculum = roof */}
      {r > 0 && <path d="M 255 336 Q 455 214 662 344" stroke={C.banana} strokeWidth={40 + 16 * r} fill="none" strokeLinecap="round" opacity={0.75 * r} />}
      <path d="M 255 336 Q 455 214 662 344" stroke="#E9DFC8" strokeWidth={26} fill="none" strokeLinecap="round" />
      <path d="M 255 336 Q 455 214 662 344" stroke={`url(#fib${id})`} strokeWidth={26} fill="none" strokeLinecap="round" />
      <path d="M 255 336 Q 455 214 662 344" stroke={C.forest} strokeWidth={26} fill="none" strokeLinecap="round" opacity={0} />
      <path d="M 255 323 Q 455 201 662 331" stroke={C.forest} strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d="M 255 349 Q 455 227 662 357" stroke={C.forest} strokeWidth={4} fill="none" strokeLinecap="round" />
      <ellipse cx={POS.PL[0]} cy={POS.PL[1]} rx={POS.PL[2]} ry={POS.PL[3]} fill="#FBF8EE" stroke={C.forest} strokeWidth={3} opacity={0.85} />
      {/* tunnel contents */}
      {(["P2", "P3", "P4", "P5", "S2", "S5", "S3", "S4", "FPL", "MED"] as K[]).map(tendon)}
      {/* Guyon's canal: ulnar artery + nerve, OUTSIDE the tunnel */}
      {u > 0 && <ellipse cx={ANCHOR.GUYON[0]} cy={ANCHOR.GUYON[1]} rx={58 + 6 * pulse * u} ry={42 + 6 * pulse * u} fill={C.banana} opacity={0.45 * u} />}
      <ellipse cx={ANCHOR.GUYON[0]} cy={ANCHOR.GUYON[1]} rx={52} ry={36} fill="none" stroke={C.forest} strokeWidth={3} strokeDasharray="9 8" opacity={0.35 + 0.65 * u} />
      <circle cx={POS.UA[0]} cy={POS.UA[1]} r={POS.UA[2]} fill="#B33A30" stroke={C.forest} strokeWidth={3.5} />
      <circle cx={POS.UA[0]} cy={POS.UA[1]} r={6} fill="#6E1C16" />
      <ellipse cx={POS.UN[0]} cy={POS.UN[1]} rx={POS.UN[2]} ry={POS.UN[3]} fill={u > 0.3 ? C.banana : "#EDE3B8"} stroke={C.forest} strokeWidth={3.5} />
      {/* running count badges */}
      {nums &&
        COUNT.map((k, i) => {
          const p = on(k);
          if (p <= 0) return null;
          const [x, y, rx, ry] = POS[k];
          const bx = k === "MED" ? x - rx - 4 : k === "FPL" ? x - rx - 6 : x + rx * 0.62, by = k === "MED" ? y - ry - 18 : y - ry - 4;
          return (
            <g key={k} transform={`translate(${bx} ${by}) scale(${0.6 + 0.4 * p})`} opacity={p}>
              <circle r={17} fill={C.forest} stroke={C.paper} strokeWidth={3} />
              <text y={7} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={20} fill={C.paper}>{i + 1}</text>
            </g>
          );
        })}
    </svg>
  );
};
