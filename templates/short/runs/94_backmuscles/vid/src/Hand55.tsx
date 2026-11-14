import React from "react";
import { C, ramp } from "./kit";

/**
 * Our own schematic of the hand interossei (left hand seen from the back: thumb on the left, fingers up).
 * Dorsal interossei (red, bipennate) sit in the gaps between the metacarpals and pull fingers AWAY from the middle finger.
 * Palmar interossei (green, unipennate) lie on the palm side of single metacarpals and pull fingers TOWARD the middle finger.
 * viewBox 800 x 900.
 */
type P = [number, number];
const rotP = (p: P, c: P, deg: number): P => {
  const a = (deg * Math.PI) / 180;
  const dx = p[0] - c[0], dy = p[1] - c[1];
  return [c[0] + dx * Math.cos(a) - dy * Math.sin(a), c[1] + dx * Math.sin(a) + dy * Math.cos(a)];
};

// rays: base of metacarpal, head (MCP joint), fingertip, widths
const RAYS = [
  { id: 1, base: [262, 735] as P, head: [160, 565] as P, tip: [70, 380] as P, wd: 46, segs: 2 }, // thumb
  { id: 2, base: [312, 715] as P, head: [282, 440] as P, tip: [240, 118] as P, wd: 40, segs: 3 }, // index
  { id: 3, base: [392, 712] as P, head: [388, 428] as P, tip: [388, 70] as P, wd: 42, segs: 3 }, // middle
  { id: 4, base: [468, 715] as P, head: [492, 438] as P, tip: [532, 120] as P, wd: 39, segs: 3 }, // ring
  { id: 5, base: [538, 722] as P, head: [588, 462] as P, tip: [652, 228] as P, wd: 35, segs: 3 }, // little
];

export type MuscleId = "D1" | "D2" | "D3" | "D4" | "P1" | "P2" | "P3";
// p0 origin (proximal), p1 distal belly end, ins = insertion on the finger (unrotated coords), ray = finger it moves
const MUS: { id: MuscleId; p0: P; p1: P; w: number; ins: P; ray: number; dorsal: boolean }[] = [
  { id: "D1", p0: [252, 662], p1: [252, 478], w: 60, ins: [262, 405], ray: 2, dorsal: true },
  { id: "D2", p0: [350, 668], p1: [338, 462], w: 52, ins: [366, 392], ray: 3, dorsal: true },
  { id: "D3", p0: [432, 668], p1: [440, 462], w: 52, ins: [410, 392], ray: 3, dorsal: true },
  { id: "D4", p0: [505, 672], p1: [532, 476], w: 50, ins: [512, 404], ray: 4, dorsal: true },
  { id: "P1", p0: [318, 640], p1: [306, 472], w: 26, ins: [300, 405], ray: 2, dorsal: false },
  { id: "P2", p0: [466, 642], p1: [474, 474], w: 26, ins: [476, 404], ray: 4, dorsal: false },
  { id: "P3", p0: [532, 646], p1: [560, 490], w: 24, ins: [566, 430], ray: 5, dorsal: false },
];

export const Hand: React.FC<{
  t: number;
  w?: number;
  spread?: number; // -1 together … 0 neutral … 1 spread
  mid?: number; // middle finger tilt in degrees (− = toward thumb)
  boneLit?: number; // time the metacarpals light up
  dA?: number; // dorsal set opacity 0..1
  pA?: number; // palmar set opacity 0..1
  glow?: Partial<Record<MuscleId, number>>; // glow amount 0..1
  axis?: number; // middle-finger axis line 0..1
  nerve?: number; // ulnar nerve drawing progress 0..1
  arrows?: { dir: "in" | "out"; a: number };
  noPalmar?: number; // "no palmar" cross on the middle finger
  card?: number; // a study card gripped between index and middle finger
  dimBones?: number;
  midArrow?: { dir: -1 | 1; a: number };
}> = ({ t, w = 760, spread = 0, mid = 0, boneLit, dA = 0, pA = 0, glow = {}, axis = 0, nerve = 0, arrows, noPalmar = 0, card = 0, dimBones = 0, midArrow }) => {
  const h = (w * 900) / 800;
  const ang = (id: number) => (id === 1 ? -14 : id === 2 ? -10 : id === 3 ? 0 : id === 4 ? 10 : 15) * spread + (id === 3 ? mid : 0);
  const bl = boneLit === undefined ? 0 : ramp(t, boneLit, boneLit + 0.35);
  const blPulse = boneLit === undefined ? 0 : Math.max(0, 1 - Math.abs(t - boneLit - 0.2) / 0.35);
  const seg = (a: P, b: P, wd: number, key: string, isMeta: boolean) => {
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const r = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;
    const ww = wd * (isMeta ? 1 : 0.86);
    return (
      <g key={key} transform={`translate(${a[0]} ${a[1]}) rotate(${r})`}>
        <path
          d={`M${ww * 0.25} ${-ww * 0.55} Q${len * 0.5} ${-ww * 0.3} ${len - ww * 0.25} ${-ww * 0.5} Q${len + ww * 0.08} 0 ${len - ww * 0.25} ${ww * 0.5} Q${len * 0.5} ${ww * 0.3} ${ww * 0.25} ${ww * 0.55} Q${-ww * 0.1} 0 ${ww * 0.25} ${-ww * 0.55} Z`}
          fill="url(#h55shaft)" stroke={C.forest} strokeWidth={4} strokeLinejoin="round"
        />
        {isMeta && bl > 0 && (
          <path d={`M${ww * 0.25} ${-ww * 0.55} Q${len * 0.5} ${-ww * 0.3} ${len - ww * 0.25} ${-ww * 0.5} Q${len + ww * 0.08} 0 ${len - ww * 0.25} ${ww * 0.5} Q${len * 0.5} ${ww * 0.3} ${ww * 0.25} ${ww * 0.55} Q${-ww * 0.1} 0 ${ww * 0.25} ${-ww * 0.55} Z`} fill="url(#h55lit)" opacity={bl} />
        )}
        <line x1={ww * 0.7} y1={-ww * 0.14} x2={len - ww * 0.8} y2={-ww * 0.1} stroke={C.forest} strokeWidth={2} opacity={0.22} />
        <ellipse cx={len * 0.45} cy={-ww * 0.22} rx={len * 0.22} ry={ww * 0.08} fill="#FFFFFF" opacity={0.5} />
      </g>
    );
  };
  // finger bones (rotated about the MCP head)
  const finger = (r: (typeof RAYS)[number]) => {
    const a = ang(r.id);
    const pts: P[] = [];
    const gap = 10;
    const dx = r.tip[0] - r.head[0], dy = r.tip[1] - r.head[1];
    const L = Math.hypot(dx, dy);
    const ux = dx / L, uy = dy / L;
    const fr = r.segs === 3 ? [0.44, 0.3, 0.26] : [0.56, 0.44];
    let s = 14;
    const segsOut: React.ReactNode[] = [];
    fr.forEach((f, i) => {
      const l = L * f - gap;
      const a0: P = [r.head[0] + ux * s, r.head[1] + uy * s];
      const a1: P = [r.head[0] + ux * (s + l), r.head[1] + uy * (s + l)];
      pts.push(a0, a1);
      segsOut.push(seg(a0, a1, r.wd * (1 - i * 0.1), `f${r.id}${i}`, false));
      s += l + gap;
    });
    return (
      <g key={r.id} transform={`rotate(${a} ${r.head[0]} ${r.head[1]})`}>
        {segsOut}
      </g>
    );
  };
  const skin = (r: (typeof RAYS)[number]) => {
    const a = ang(r.id);
    return (
      <g key={"s" + r.id} transform={`rotate(${a} ${r.head[0]} ${r.head[1]})`}>
        <line x1={r.head[0]} y1={r.head[1]} x2={r.tip[0]} y2={r.tip[1]} stroke="#E9E3C8" strokeWidth={r.wd * 2.15} strokeLinecap="round" />
      </g>
    );
  };
  const spindle = (m: (typeof MUS)[number]) => {
    const op = m.dorsal ? dA : pA;
    if (op <= 0.01) return null;
    const ray = RAYS[m.ray - 1];
    const ins = rotP(m.ins, ray.head, ang(m.ray));
    const len = Math.hypot(m.p1[0] - m.p0[0], m.p1[1] - m.p0[1]);
    const r = (Math.atan2(m.p1[1] - m.p0[1], m.p1[0] - m.p0[0]) * 180) / Math.PI;
    const g = glow[m.id] ?? 0;
    const fill = m.dorsal ? "url(#h55red)" : "url(#h55grn)";
    const ww = m.w * (1 + 0.12 * g);
    const body = `M0 0 Q${len * 0.35} ${-ww * 0.62} ${len * 0.62} ${-ww * 0.45} Q${len * 0.92} ${-ww * 0.22} ${len} 0 Q${len * 0.92} ${ww * 0.22} ${len * 0.62} ${ww * 0.45} Q${len * 0.35} ${ww * 0.62} 0 0 Z`;
    const fibers: React.ReactNode[] = [];
    for (let k = 1; k < 8; k++) {
      const x = (len * k) / 8;
      const half = ww * 0.5 * Math.sin((Math.PI * k) / 8) * 0.85;
      if (m.dorsal) {
        fibers.push(<line key={"a" + k} x1={x} y1={0} x2={x - 16} y2={-half} stroke="#7E2219" strokeWidth={2} opacity={0.5} />);
        fibers.push(<line key={"b" + k} x1={x} y1={0} x2={x - 16} y2={half} stroke="#7E2219" strokeWidth={2} opacity={0.5} />);
      } else {
        fibers.push(<line key={"a" + k} x1={x} y1={half * 0.9} x2={x - 14} y2={-half * 0.8} stroke="#2F4214" strokeWidth={2} opacity={0.45} />);
      }
    }
    return (
      <g key={m.id} opacity={op}>
        {/* tendon to the finger */}
        <line x1={m.p1[0]} y1={m.p1[1]} x2={ins[0]} y2={ins[1]} stroke={C.forest} strokeWidth={9} strokeLinecap="round" />
        <line x1={m.p1[0]} y1={m.p1[1]} x2={ins[0]} y2={ins[1]} stroke="#F4EFD9" strokeWidth={4.5} strokeLinecap="round" />
        <g transform={`translate(${m.p0[0]} ${m.p0[1]}) rotate(${r})`}>
          {g > 0 && <path d={body} fill={C.banana} opacity={0.85 * g} filter="url(#h55glow)" transform="scale(1.15 1.5)" />}
          <path d={body} fill={fill} stroke={C.forest} strokeWidth={4} strokeLinejoin="round" />
          {m.dorsal && <line x1={8} y1={0} x2={len - 8} y2={0} stroke="#F4EFD9" strokeWidth={3} opacity={0.75} />}
          {fibers}
          <ellipse cx={len * 0.4} cy={-ww * 0.2} rx={len * 0.16} ry={ww * 0.07} fill="#FFFFFF" opacity={0.35} />
        </g>
        <circle cx={ins[0]} cy={ins[1]} r={6} fill={C.forest} />
      </g>
    );
  };
  const arrow = (r: (typeof RAYS)[number], dir: "in" | "out", a: number) => {
    if (r.id === 3) return null;
    const angNow = ang(r.id);
    const tip = rotP(r.tip, r.head, angNow);
    const towardMid = tip[0] < 388 ? 1 : -1; // +x if finger is left of the middle line
    const sgn = dir === "in" ? towardMid : -towardMid;
    const y = tip[1] + 10;
    const x0 = tip[0] - sgn * 6, x1 = tip[0] + sgn * 62;
    return (
      <g key={"ar" + r.id} opacity={a}>
        <path d={`M${x0} ${y} L${x1} ${y}`} stroke={C.forest} strokeWidth={12} strokeLinecap="round" />
        <path d={`M${x1 - sgn * 20} ${y - 18} L${x1 + sgn * 4} ${y} L${x1 - sgn * 20} ${y + 18}`} stroke={C.forest} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M${x0} ${y} L${x1} ${y}`} stroke={dir === "in" ? C.matchaLight : C.redLight} strokeWidth={5} strokeLinecap="round" />
        <path d={`M${x1 - sgn * 20} ${y - 18} L${x1 + sgn * 4} ${y} L${x1 - sgn * 20} ${y + 18}`} stroke={dir === "in" ? C.matchaLight : C.redLight} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    );
  };
  const midTip = rotP(RAYS[2].tip, RAYS[2].head, ang(3));
  const NERVE = "M612 900 C610 820 590 770 560 742 C520 706 470 700 420 702 C360 704 300 690 252 662";
  return (
    <svg width={w} height={h} viewBox="0 0 800 900" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="h55shaft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBF6E6" />
          <stop offset="55%" stopColor="#EADFC0" />
          <stop offset="100%" stopColor="#CDBE93" />
        </linearGradient>
        <linearGradient id="h55lit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF4BE" />
          <stop offset="100%" stopColor={C.bananaDark} />
        </linearGradient>
        <radialGradient id="h55red" cx="40%" cy="35%" r="80%">
          <stop offset="0%" stopColor="#EE958A" />
          <stop offset="70%" stopColor="#C9483C" />
          <stop offset="100%" stopColor="#9E3128" />
        </radialGradient>
        <radialGradient id="h55grn" cx="40%" cy="35%" r="80%">
          <stop offset="0%" stopColor="#B5CC8A" />
          <stop offset="70%" stopColor={C.matcha} />
          <stop offset="100%" stopColor={C.matchaDark} />
        </radialGradient>
        <radialGradient id="h55carp" cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#FFFDF4" />
          <stop offset="60%" stopColor="#EFE6CC" />
          <stop offset="100%" stopColor="#D2C39A" />
        </radialGradient>
        <filter id="h55sh" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#1F2A14" floodOpacity="0.18" />
        </filter>
        <filter id="h55glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>
      {/* soft hand silhouette */}
      <g opacity={0.95}>
        <path d="M262 735 L160 565 L282 440 L388 428 L492 438 L588 462 L538 722 L560 860 L300 872 Z" fill="#E9E3C8" stroke="#E9E3C8" strokeWidth={84} strokeLinejoin="round" />
        {RAYS.map(skin)}
      </g>
      {/* study card held between index and middle finger (drawn under the bones so the fingers grip it) */}
      {card > 0 && (
        <g opacity={card} transform={`translate(${(rotP([262, 300], RAYS[1].head, ang(2))[0] + rotP([388, 300], RAYS[2].head, ang(3))[0]) / 2} ${300 - (1 - card) * 60}) rotate(-4)`}>
          <rect x={-62} y={-190} width={124} height={170} rx={14} fill={C.card} stroke={C.forest} strokeWidth={5} />
          <rect x={-44} y={-168} width={62} height={14} rx={7} fill={C.matcha} />
          <rect x={-44} y={-144} width={88} height={10} rx={5} fill={C.line} />
          <rect x={-44} y={-126} width={72} height={10} rx={5} fill={C.line} />
        </g>
      )}
      {/* middle-finger axis */}
      {axis > 0 && (
        <g opacity={axis}>
          <line x1={388} y1={890} x2={388} y2={890 - 860 * axis} stroke={C.forest} strokeWidth={9} strokeDasharray="26 16" strokeLinecap="round" />
          <line x1={388} y1={890} x2={388} y2={890 - 860 * axis} stroke={C.banana} strokeWidth={4} strokeDasharray="26 16" strokeLinecap="round" />
        </g>
      )}
      <g filter="url(#h55sh)" opacity={1 - 0.55 * dimBones}>
        {/* carpals (simplified) */}
        {[[300, 790, 52, 40, -20], [392, 785, 50, 44, 0], [478, 785, 46, 40, 10], [548, 790, 38, 36, 20], [252, 775, 40, 34, -30], [340, 850, 60, 34, -6], [450, 852, 56, 34, 6], [540, 848, 40, 30, 10]].map(([x, y, rx, ry, r], i) => (
          <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} transform={`rotate(${r} ${x} ${y})`} fill="url(#h55carp)" stroke={C.forest} strokeWidth={4} />
        ))}
        {/* metacarpals */}
        {RAYS.map((r) => seg(r.base, r.head, r.wd * (1 + 0.08 * blPulse), "m" + r.id, true))}
        {/* fingers */}
        {RAYS.map(finger)}
      </g>
      {/* muscles: palmar under, dorsal on top */}
      {MUS.filter((m) => !m.dorsal).map(spindle)}
      {MUS.filter((m) => m.dorsal).map(spindle)}
      {/* no palmar on the middle finger */}
      {noPalmar > 0 && (
        <g opacity={noPalmar} transform={`translate(388 560) scale(${0.6 + 0.4 * noPalmar})`}>
          <circle r={40} fill={C.card} stroke={C.forest} strokeWidth={5} />
          <path d="M-18 -18 L18 18 M18 -18 L-18 18" stroke={C.red} strokeWidth={9} strokeLinecap="round" />
        </g>
      )}
      {/* ulnar nerve (deep branch) */}
      {nerve > 0 && (
        <g>
          <path d={NERVE} fill="none" stroke={C.forest} strokeWidth={16} strokeLinecap="round" strokeDasharray="1200" strokeDashoffset={1200 * (1 - nerve)} />
          <path d={NERVE} fill="none" stroke={C.banana} strokeWidth={9} strokeLinecap="round" strokeDasharray="1200" strokeDashoffset={1200 * (1 - nerve)} />
          {[[560, 742], [470, 701], [380, 703], [300, 688]].map(([x, y], i) =>
            nerve > 0.25 + i * 0.18 ? <line key={i} x1={x} y1={y} x2={x - 6} y2={y - 46} stroke={C.bananaDark} strokeWidth={5} strokeLinecap="round" opacity={0.9} /> : null,
          )}
        </g>
      )}
      {/* arrows */}
      {arrows && arrows.a > 0 && RAYS.map((r) => arrow(r, arrows.dir, arrows.a))}
      {midArrow && midArrow.a > 0 && (() => {
        const sg = midArrow.dir;
        const y = midTip[1] + 16, x0 = midTip[0] + sg * 30, x1 = midTip[0] + sg * 96;
        return (
          <g opacity={midArrow.a}>
            {([[C.forest, 12], [C.redLight, 5]] as [string, number][]).map(([col, sw], i) => (
              <g key={i}>
                <path d={`M${x0} ${y} L${x1} ${y}`} stroke={col} strokeWidth={sw} strokeLinecap="round" />
                <path d={`M${x1 - sg * 20} ${y - 18} L${x1 + sg * 4} ${y} L${x1 - sg * 20} ${y + 18}`} stroke={col} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            ))}
          </g>
        );
      })()}
    </svg>
  );
};

/** where a muscle's belly centre sits in diagram units (for pills drawn outside the svg) */
export const musCentre = (id: MuscleId): P => {
  const m = MUS.find((x) => x.id === id)!;
  return [(m.p0[0] + m.p1[0]) / 2, (m.p0[1] + m.p1[1]) / 2];
};
