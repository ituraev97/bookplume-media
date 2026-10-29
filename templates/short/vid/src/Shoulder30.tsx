import React from "react";
import { C, ramp } from "./kit";

/**
 * Our own schematic of the LEFT shoulder seen from BEHIND (matches Gray's FIG. 412: humerus on the left, medial border on the right).
 * The "front" side (subscapularis) is drawn in the same frame and shown mirrored by the flip, like turning the scapula over.
 * viewBox 800 x 760.
 */
export type MId = "sup" | "inf" | "tmin" | "tmaj" | "sub";

const P = {
  humerus:
    "M 92 262 Q 70 200 108 160 Q 150 128 196 150 Q 236 172 236 222 Q 236 268 206 296 Q 190 320 186 360 L 178 760 L 92 760 L 98 380 Q 100 320 92 262 Z",
  scap:
    "M 262 205 L 330 186 Q 480 150 640 120 L 668 160 Q 652 420 592 700 Q 572 724 548 700 L 300 332 Q 268 302 256 290 Z",
  sup: "M 640 128 L 662 165 L 658 238 L 320 200 Q 240 194 176 204 Q 122 210 110 190 Q 116 160 178 160 Q 250 160 302 176 Q 460 152 640 128 Z",
  inf: "M 658 264 Q 640 420 602 560 L 330 302 Q 262 272 182 270 Q 112 270 100 248 Q 108 222 176 225 Q 262 222 332 224 Z",
  tmin: "M 602 566 Q 597 600 578 616 L 300 342 Q 240 314 172 316 Q 116 318 104 298 Q 112 276 176 279 Q 252 283 322 306 Z",
  tmaj: "M 592 640 Q 602 700 566 714 L 254 474 Q 220 452 186 456 L 188 412 Q 232 408 284 432 Z",
  sub: "M 640 134 Q 656 400 588 690 L 334 334 Q 266 306 204 304 Q 142 304 128 280 Q 138 252 202 254 Q 272 252 302 232 Q 470 166 640 134 Z",
  spine: "M 664 238 L 662 272 L 330 218 Q 250 204 200 180 Q 150 166 126 146 Q 136 116 182 120 Q 252 138 322 178 Z",
  latBorder: "M 268 300 Q 420 480 566 704",
  coracoid: "M 300 214 Q 268 170 226 160 Q 206 158 204 172 Q 222 178 248 196 Q 270 214 276 230 Z",
};
const ANG: Record<MId, number> = { sup: -8, inf: 24, tmin: 36, tmaj: 38, sub: 22 };

const Muscle: React.FC<{ id: MId; t: number; lit?: number; until?: number; dim?: number; red?: boolean }> = ({ id, t, lit, until = 1e9, dim = 0, red }) => {
  const p = lit === undefined ? 0 : ramp(t, lit, lit + 0.3) * (1 - 0.75 * ramp(t, until, until + 0.3));
  const pulse = lit === undefined ? 0 : Math.max(0, 1 - Math.abs(t - lit - 0.2) / 0.35);
  return (
    <g opacity={1 - dim}>
      {p > 0 && <path d={P[id]} fill={red ? C.red : C.banana} opacity={0.7 * p} filter="url(#s30glow)" transform={`translate(0 0)`} />}
      <path d={P[id]} fill={id === "tmaj" ? "url(#s30mGrey)" : "url(#s30m)"} stroke={C.forest} strokeWidth={4 + 2 * pulse} strokeLinejoin="round" />
      <path d={P[id]} fill={`url(#s30f_${id})`} />
      <path d={P[id]} fill={red ? C.red : "url(#s30lit)"} opacity={0.82 * p} />
      {p > 0 && <path d={P[id]} fill={`url(#s30f_${id})`} opacity={0.6 * p} />}
    </g>
  );
};

const Defs: React.FC = () => (
  <defs>
    <linearGradient id="s30m" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#E59A86" />
      <stop offset="55%" stopColor="#C9675A" />
      <stop offset="100%" stopColor="#A44A3F" />
    </linearGradient>
    <linearGradient id="s30mGrey" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#D9CDBB" />
      <stop offset="100%" stopColor="#B7A994" />
    </linearGradient>
    <linearGradient id="s30lit" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#FFF1A8" />
      <stop offset="60%" stopColor={C.banana} />
      <stop offset="100%" stopColor={C.bananaDark} />
    </linearGradient>
    <linearGradient id="s30bone" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#FFFDF4" />
      <stop offset="60%" stopColor="#EFE6CC" />
      <stop offset="100%" stopColor="#CDBE93" />
    </linearGradient>
    <radialGradient id="s30head" cx="40%" cy="35%" r="70%">
      <stop offset="0%" stopColor="#FFFDF4" />
      <stop offset="70%" stopColor="#EADFC0" />
      <stop offset="100%" stopColor="#C9B98C" />
    </radialGradient>
    {(Object.keys(ANG) as MId[]).map((k) => (
      <pattern key={k} id={`s30f_${k}`} width={13} height={13} patternUnits="userSpaceOnUse" patternTransform={`rotate(${ANG[k]})`}>
        <line x1={0} y1={6.5} x2={13} y2={6.5} stroke="#6E2620" strokeWidth={1.8} opacity={0.32} />
      </pattern>
    ))}
    <filter id="s30sh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#1F2A14" floodOpacity="0.18" />
    </filter>
    <filter id="s30glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="14" />
    </filter>
  </defs>
);

export const Scapula: React.FC<{
  t: number;
  w?: number;
  lit?: Partial<Record<MId, number>>;
  red?: Partial<Record<MId, boolean>>;
  spineGlow?: number;
  edgeGlow?: number;
  flip?: [number, number]; // flip to the front between these times
  showTmaj?: boolean;
  dim?: number;
}> = ({ t, w = 800, lit = {}, red = {}, spineGlow, edgeGlow, flip, showTmaj = true, dim = 0 }) => {
  const h = (w * 760) / 800;
  const fk = flip ? ramp(t, flip[0], flip[1]) : 0;
  const sx = Math.cos(fk * Math.PI);
  const front = sx < 0;
  const sg = spineGlow !== undefined ? ramp(t, spineGlow, spineGlow + 0.3) : 0;
  const eg = edgeGlow !== undefined ? ramp(t, edgeGlow, edgeGlow + 0.3) : 0;
  const times = Object.values(lit).filter((x): x is number => x !== undefined);
  const untilFor = (id: MId) => {
    const lt = lit[id];
    if (lt === undefined) return 1e9;
    const later = times.filter((x) => x > lt);
    return later.length ? Math.min(...later) : 1e9;
  };
  const dimFor = (id: MId) => {
    const anyLit = Object.values(lit).some((x) => x !== undefined && t >= x);
    if (dim <= 0 || !anyLit) return 0;
    const lt = lit[id];
    return lt !== undefined && t >= lt ? 0 : dim;
  };
  return (
    <svg width={w} height={h} viewBox="0 0 800 760" style={{ overflow: "visible" }}>
      <Defs />
      <g transform={`translate(400 0) scale(${Math.max(0.02, Math.abs(sx)) * (front ? -1 : 1)} 1) translate(-400 0)`}>
        {/* humerus */}
        <g filter="url(#s30sh)">
          <path d={P.humerus} fill="url(#s30bone)" stroke={C.forest} strokeWidth={4.5} />
          <ellipse cx={156} cy={204} rx={62} ry={58} fill="url(#s30head)" opacity={0.9} />
          <path d="M 120 330 Q 140 520 132 740" stroke={C.forest} strokeWidth={2} opacity={0.22} fill="none" />
        </g>
        {/* scapula */}
        <g filter="url(#s30sh)">
          <path d={P.scap} fill="url(#s30bone)" stroke={C.forest} strokeWidth={4.5} strokeLinejoin="round" />
          <ellipse cx={246} cy={250} rx={16} ry={48} fill="#E6DAB8" stroke={C.forest} strokeWidth={4} />
        </g>
        {!front && (
          <>
            {showTmaj && <Muscle id="tmaj" t={t} lit={lit.tmaj} until={untilFor("tmaj")} red={red.tmaj} dim={dimFor("tmaj")} />}
            <Muscle id="tmin" t={t} lit={lit.tmin} until={untilFor("tmin")} red={red.tmin} dim={dimFor("tmin")} />
            <Muscle id="inf" t={t} lit={lit.inf} until={untilFor("inf")} red={red.inf} dim={dimFor("inf")} />
            <Muscle id="sup" t={t} lit={lit.sup} until={untilFor("sup")} red={red.sup} dim={dimFor("sup")} />
            {eg > 0 && <path d={P.latBorder} stroke={C.banana} strokeWidth={22} fill="none" strokeLinecap="round" opacity={0.9 * eg} strokeDasharray="900" strokeDashoffset={900 * (1 - eg)} />}
            {eg > 0 && <path d={P.latBorder} stroke={C.forest} strokeWidth={5} fill="none" strokeLinecap="round" strokeDasharray="16 12" opacity={eg} />}
            {/* spine of the scapula + acromion */}
            <g filter="url(#s30sh)">
              {sg > 0 && <path d={P.spine} fill={C.banana} opacity={0.85 * sg} filter="url(#s30glow)" />}
              <path d={P.spine} fill={sg > 0.5 ? "url(#s30lit)" : "url(#s30bone)"} stroke={C.forest} strokeWidth={4.5} strokeLinejoin="round" />
              <path d="M 640 250 Q 480 222 330 200" stroke={C.forest} strokeWidth={2} opacity={0.3} fill="none" />
            </g>
          </>
        )}
        {front && (
          <>
            <Muscle id="sub" t={t} lit={lit.sub} until={untilFor("sub")} red={red.sub} dim={dimFor("sub")} />
            <g filter="url(#s30sh)">
              <path d={P.coracoid} fill="url(#s30bone)" stroke={C.forest} strokeWidth={4} strokeLinejoin="round" />
              <path d="M 330 196 Q 250 170 186 128 Q 150 112 128 130 Q 150 150 200 172 Q 260 196 300 206 Z" fill="url(#s30bone)" stroke={C.forest} strokeWidth={4} strokeLinejoin="round" />
            </g>
          </>
        )}
      </g>
    </svg>
  );
};

/** Ball-and-socket schematic: humeral head in the glenoid, wrapped by a four-part cuff. viewBox 800 x 700 */
export const Joint: React.FC<{ t: number; w?: number; cuffT: number; ballT: number; socketT: number }> = ({ t, w = 800, cuffT, ballT, socketT }) => {
  const h = (w * 700) / 800;
  const cx = 330, cy = 300, r = 128, R = 168;
  const b = ramp(t, ballT, ballT + 0.3);
  const s = ramp(t, socketT, socketT + 0.3);
  const arcs = [
    { a0: -150, a1: -62, col: "#C9675A", d: 0 },
    { a0: -58, a1: 28, col: "#B5574A", d: 0.12 },
    { a0: 32, a1: 100, col: "#A44A3F", d: 0.24 },
    { a0: 104, a1: 200, col: "#D07A69", d: 0.36 },
  ];
  const pt = (a: number, rr: number) => [cx + rr * Math.cos((a * Math.PI) / 180), cy + rr * Math.sin((a * Math.PI) / 180)];
  return (
    <svg width={w} height={h} viewBox="0 0 800 700" style={{ overflow: "visible" }}>
      <Defs />
      {/* scapula edge with glenoid cup (right) */}
      <g filter="url(#s30sh)">
        <path d="M 800 60 L 520 140 Q 486 170 478 220 Q 470 300 478 380 Q 486 430 520 460 L 800 650 Z" fill="url(#s30bone)" stroke={C.forest} strokeWidth={5} strokeLinejoin="round" />
      </g>
      {s > 0 && <path d="M 470 196 Q 440 300 470 404" stroke={C.banana} strokeWidth={40} fill="none" strokeLinecap="round" opacity={0.8 * s} filter="url(#s30glow)" />}
      <path d="M 476 196 Q 446 300 476 404" stroke={s > 0.5 ? C.bananaDark : "#BFAE80"} strokeWidth={14} fill="none" strokeLinecap="round" />
      {/* humerus shaft + head */}
      <g filter="url(#s30sh)">
        <path d="M 250 400 Q 230 520 200 700 L 340 700 Q 350 560 380 420 Z" fill="url(#s30bone)" stroke={C.forest} strokeWidth={5} strokeLinejoin="round" />
        {b > 0 && <circle cx={cx} cy={cy} r={r + 26} fill={C.banana} opacity={0.75 * b} filter="url(#s30glow)" />}
        <circle cx={cx} cy={cy} r={r} fill="url(#s30head)" stroke={C.forest} strokeWidth={5} />
        <circle cx={cx} cy={cy} r={r} fill="url(#s30lit)" opacity={0.85 * b} />
        <ellipse cx={cx - 40} cy={cy - 50} rx={44} ry={22} fill="#FFFFFF" opacity={0.5} />
      </g>
      {/* the cuff: four tendons wrapping the ball */}
      {arcs.map((a, i) => {
        const p = ramp(t, cuffT + a.d, cuffT + a.d + 0.45);
        if (p <= 0) return null;
        const a1 = a.a0 + (a.a1 - a.a0) * p;
        const [x0, y0] = pt(a.a0, R);
        const [x1, y1] = pt(a1, R);
        const large = a1 - a.a0 > 180 ? 1 : 0;
        return (
          <g key={i}>
            <path d={`M ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1}`} stroke={C.forest} strokeWidth={50} fill="none" strokeLinecap="round" />
            <path d={`M ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1}`} stroke={a.col} strokeWidth={40} fill="none" strokeLinecap="round" />
            <path d={`M ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1}`} stroke="#6E2620" strokeWidth={2} fill="none" opacity={0.35} strokeDasharray="3 9" />
          </g>
        );
      })}
    </svg>
  );
};
