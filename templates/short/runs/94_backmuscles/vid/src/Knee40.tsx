import React from "react";
import { C, FONT, ramp } from "./kit";

/**
 * Our own schematic MEDIAL view of the right knee (Book Plume illustration). viewBox 860 x 680.
 * Viewer's left = FRONT (patella, tibial tuberosity), viewer's right = BACK.
 * Pes anserinus: S sartorius (front), G gracilis (inner thigh), T semitendinosus (back, hamstring)
 * pass behind the medial femoral condyle and fan forward onto the upper medial tibia (S most anterior).
 */
export type MId = "S" | "G" | "T";

const MUS = {
  S: { fill: "#D06A57", dark: "#97402F", light: "#F0A595", tendon: "#F3E6CF" },
  G: { fill: "#C9604F", dark: "#8E3628", light: "#EC9C8B", tendon: "#F3E6CF" },
  T: { fill: "#B9584A", dark: "#833227", light: "#E28F80", tendon: "#F3E6CF" },
};

type Pt = [number, number];
type Seg = [Pt, Pt, Pt, Pt];
const bez = (s: Seg, u: number): Pt => {
  const v = 1 - u;
  return [
    v * v * v * s[0][0] + 3 * v * v * u * s[1][0] + 3 * v * u * u * s[2][0] + u * u * u * s[3][0],
    v * v * v * s[0][1] + 3 * v * v * u * s[1][1] + 3 * v * u * u * s[2][1] + u * u * u * s[3][1],
  ];
};
const sample = (segs: Seg[], n = 40): Pt[] => {
  const out: Pt[] = [];
  segs.forEach((s, i) => {
    for (let k = i === 0 ? 0 : 1; k <= n; k++) out.push(bez(s, k / n));
  });
  return out;
};
/** tapered ribbon around a centre line; width(u) for u in 0..1; returns closed path + centre points */
const ribbon = (pts: Pt[], width: (u: number) => number, upto = 1) => {
  const m = Math.max(2, Math.floor(pts.length * upto));
  const P = pts.slice(0, m);
  const L: Pt[] = [], R: Pt[] = [];
  P.forEach((p, i) => {
    const a = P[Math.max(0, i - 1)], b = P[Math.min(P.length - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1;
    dx /= l; dy /= l;
    const w = width(i / (pts.length - 1)) / 2;
    L.push([p[0] - dy * w, p[1] + dx * w]);
    R.push([p[0] + dy * w, p[1] - dx * w]);
  });
  const f = (q: Pt) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`;
  return "M" + L.map(f).join(" L") + " L" + R.reverse().map(f).join(" L") + " Z";
};
const polyline = (pts: Pt[]) => "M" + pts.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(" L");

const PATH: Record<MId, Seg[]> = {
  S: [
    [[40, -30], [170, 80], [360, 170], [468, 292]],
    [[468, 292], [522, 352], [514, 410], [452, 448]],
    [[452, 448], [404, 472], [362, 486], [318, 500]],
  ],
  G: [
    [[566, -30], [560, 110], [548, 240], [532, 330]],
    [[532, 330], [522, 400], [494, 448], [444, 476]],
    [[444, 476], [404, 504], [366, 524], [328, 538]],
  ],
  T: [
    [[830, -30], [740, 90], [628, 214], [580, 318]],
    [[580, 318], [552, 392], [524, 454], [462, 492]],
    [[462, 492], [422, 532], [380, 560], [340, 578]],
  ],
};
const PTS: Record<MId, Pt[]> = { S: sample(PATH.S), G: sample(PATH.G), T: sample(PATH.T) };
// width profiles: belly -> tendon -> slightly flattened at insertion
const WID: Record<MId, (u: number) => number> = {
  S: (u) => (u < 0.45 ? 50 - 18 * (u / 0.45) : u < 0.62 ? 32 - 18 * ((u - 0.45) / 0.17) : 14 + 6 * Math.max(0, (u - 0.85) / 0.15)),
  G: (u) => (u < 0.3 ? 30 + 12 * Math.sin((u / 0.3) * Math.PI * 0.5) : u < 0.5 ? 42 - 30 * ((u - 0.3) / 0.2) : 12 + 6 * Math.max(0, (u - 0.85) / 0.15)),
  T: (u) => (u < 0.2 ? 64 - 10 * (u / 0.2) : u < 0.38 ? 54 - 42 * ((u - 0.2) / 0.18) : 12 + 6 * Math.max(0, (u - 0.85) / 0.15)),
};
// where the fleshy belly turns into tendon (fraction of the path)
const TEND: Record<MId, number> = { S: 0.6, G: 0.5, T: 0.36 };

const FEMUR = "M356 -20 L 446 -20 C 446 110 452 210 494 272 C 548 330 540 412 482 428 L 318 428 C 286 410 284 338 328 288 C 358 238 356 110 356 -20 Z";
const TIBIA = "M298 442 L 522 442 C 528 472 508 494 480 507 C 452 540 446 600 450 700 L 364 700 C 362 620 352 562 330 534 C 306 522 292 500 298 470 Z";
const VM = "M330 120 C 300 170 268 240 270 300 C 272 330 300 336 320 312 C 348 280 360 220 360 150 Z"; // vastus medialis (context)
const GAST = "M508 474 C 570 486 612 540 612 610 C 612 650 600 690 590 700 L 474 700 C 470 610 478 530 508 474 Z";
const LEG = "M10 -20 C 80 120 200 240 232 292 C 252 330 262 400 282 470 C 302 540 326 620 336 700 L 640 700 C 652 640 668 560 640 486 C 628 456 616 440 616 430 C 660 330 780 160 860 -20 Z"; // medial head of gastrocnemius (context)
const SM = "M650 120 C 640 200 600 280 570 360 C 556 400 540 420 520 430 L 560 440 C 610 380 660 280 700 150 Z"; // semimembranosus (context, deep)

const rnd = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

export const Knee: React.FC<{
  t: number;
  w?: number;
  lit?: Partial<Record<MId | "web" | "ins", number>>;
  focus?: MId[];
  dimFrom?: number;
  build?: number;
  letters?: Partial<Record<MId, number>>;
  names?: Partial<Record<MId, number>>;
  axes?: number; // FRONT / BACK arrows
  goose?: number; // goose-foot comparison icon
  caption?: boolean;
}> = ({ t, w = 860, lit = {}, focus = [], dimFrom, build, letters = {}, names = {}, axes, goose, caption }) => {
  const s = w / 860;
  const on = (id: string) => ((lit as any)[id] === undefined ? 0 : ramp(t, (lit as any)[id] - 0.05, (lit as any)[id] + 0.3));
  const dimP = dimFrom === undefined ? 0 : ramp(t, dimFrom, dimFrom + 0.4);
  const op = (id: MId) => 1 - 0.62 * dimP * (1 - on(id));
  const glow = (id: MId) => (focus.includes(id) ? on(id) * (0.7 + 0.3 * Math.sin(t * 7)) : 0);
  const bB = build === undefined ? 1 : ramp(t, build, build + 0.6);
  const grow = (id: MId) => (build === undefined ? 1 : ramp(t, build + 0.3 + (id === "S" ? 0 : id === "G" ? 0.25 : 0.5), build + 1.3 + (id === "S" ? 0 : id === "G" ? 0.25 : 0.5)));
  const webP = on("web");
  const insP = on("ins");
  const pulse = 0.5 + 0.5 * Math.sin(t * 6);

  const Muscle: React.FC<{ id: MId }> = ({ id }) => {
    const g = grow(id);
    if (g <= 0.01) return null;
    const pts = PTS[id];
    const c = MUS[id];
    const full = ribbon(pts, WID[id], g);
    const k = TEND[id];
    const belly = ribbon(pts, WID[id], Math.min(g, k + 0.04));
    const hi = ribbon(pts.map(([x, y]) => [x - 4, y - 4] as Pt), (u) => WID[id](u) * 0.22, Math.min(g, k));
    const gl = glow(id);
    // striations along the belly
    const n = Math.floor(pts.length * Math.min(g, k));
    const stri = [-0.3, 0, 0.3].map((f) =>
      polyline(
        pts.slice(2, Math.max(3, n - 2)).map((p, i, arr) => {
          const a = arr[Math.max(0, i - 1)], b = arr[Math.min(arr.length - 1, i + 1)];
          let dx = b[0] - a[0], dy = b[1] - a[1];
          const l = Math.hypot(dx, dy) || 1;
          dx /= l; dy /= l;
          const ww = WID[id]((i + 2) / (pts.length - 1)) * f;
          return [p[0] - dy * ww, p[1] + dx * ww] as Pt;
        })
      )
    );
    return (
      <g opacity={op(id)}>
        {gl > 0 && <path d={full} fill="none" stroke={C.banana} strokeWidth={22 + 6 * gl} strokeLinejoin="round" opacity={0.85 * gl} />}
        <path d={full} fill={c.tendon} stroke={C.forest} strokeWidth={5} strokeLinejoin="round" />
        <path d={belly} fill={c.fill} stroke={C.forest} strokeWidth={5} strokeLinejoin="round" />
        {stri.map((d, i) => <path key={i} d={d} fill="none" stroke={c.dark} strokeWidth={2.4} opacity={0.55} strokeLinecap="round" />)}
        <path d={hi} fill={c.light} opacity={0.55} />
        {/* tendon sheen line */}
        <path d={polyline(pts.slice(Math.floor(pts.length * k) + 2, Math.floor(pts.length * g) - 2))} fill="none" stroke="#FFFFFF" strokeWidth={3} opacity={0.7} strokeLinecap="round" />
      </g>
    );
  };

  const end = (id: MId) => PTS[id][PTS[id].length - 1];
  const badgePos: Record<MId, Pt> = { S: bez(PATH.S[0], 0.42), G: bez(PATH.G[0], 0.42), T: bez(PATH.T[0], 0.4) };
  const nameTag: Record<MId, [string, number, number]> = { S: ["Sartorius", -10, 70], G: ["Gracilis", 40, 10], T: ["Semitendinosus", -150, 80] };
  const axP = axes === undefined ? 0 : ramp(t, axes, axes + 0.4);
  const gooseP = goose === undefined ? 0 : ramp(t, goose, goose + 0.45);

  // goose foot web: between the three tendons near the insertion
  const webPts: Pt[] = [...PTS.S.slice(-34), ...PTS.T.slice(-34).reverse()];
  const web = "M" + webPts.map((q) => `${q[0]} ${q[1]}`).join(" L") + " Z";

  return (
    <svg width={w} height={680 * s} viewBox="0 0 860 680" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="bone40" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FBF6E6" />
          <stop offset="0.6" stopColor="#F1E7C9" />
          <stop offset="1" stopColor="#DFD1A8" />
        </linearGradient>
        <radialGradient id="ctx40" cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#EAC2B6" />
          <stop offset="1" stopColor="#D8A595" />
        </radialGradient>
        <clipPath id="clip40"><rect x={0} y={0} width={860} height={680} /></clipPath>
      </defs>
      <g clipPath="url(#clip40)" opacity={bB}>
        {/* leg outline (skin) */}
        <path d={LEG} fill="#F6E8D8" stroke={C.forest} strokeWidth={3} strokeDasharray="12 9" opacity={0.9} />
        {/* bones */}
        <path d={FEMUR} fill="url(#bone40)" stroke={C.forest} strokeWidth={5} />
        <path d="M330 300 C 360 270 440 266 500 300" fill="none" stroke="#CDBF95" strokeWidth={4} opacity={0.7} />
        <path d={TIBIA} fill="url(#bone40)" stroke={C.forest} strokeWidth={5} />
        {Array.from({ length: 14 }, (_, i) => (
          <circle key={i} cx={380 + rnd(i) * 120} cy={30 + rnd(i + 9) * 230} r={1.6 + rnd(i + 3) * 1.8} fill="#CDBF95" opacity={0.7} />
        ))}
        {/* joint line + meniscus hint */}
        <path d="M306 436 C 380 432 460 432 516 436" fill="none" stroke={C.forest} strokeWidth={3} opacity={0.4} strokeDasharray="10 8" />
        {/* patella + patellar ligament */}
        <path d="M276 392 C 290 440 300 480 312 506" fill="none" stroke={C.forest} strokeWidth={30} strokeLinecap="round" />
        <path d="M276 392 C 290 440 300 480 312 506" fill="none" stroke="#EFE4CB" strokeWidth={22} strokeLinecap="round" />
        <ellipse cx={278} cy={340} rx={30} ry={52} fill="url(#bone40)" stroke={C.forest} strokeWidth={5} />
        {/* context muscles, muted */}
        <path d={VM} fill="url(#ctx40)" stroke={C.forest} strokeWidth={4} opacity={0.75 - 0.35 * dimP} />
        <path d={SM} fill="url(#ctx40)" stroke={C.forest} strokeWidth={4} opacity={0.75 - 0.35 * dimP} />
        <path d={GAST} fill="url(#ctx40)" stroke={C.forest} strokeWidth={4} opacity={0.75 - 0.35 * dimP} />
        {/* goose-foot web */}
        {webP > 0 && <path d={web} fill={C.banana} opacity={0.55 * webP + 0.15 * webP * pulse} stroke={C.bananaDark} strokeWidth={3} />}
        {/* the three muscles (back to front: T deepest, S most superficial) */}
        <Muscle id="T" />
        <Muscle id="G" />
        <Muscle id="S" />
        {/* insertion */}
        {insP > 0 && (
          <g opacity={insP}>
            <ellipse cx={330} cy={540} rx={50 + 8 * pulse} ry={58 + 6 * pulse} fill="none" stroke={C.red} strokeWidth={6} strokeDasharray="14 9" />
            {(["S", "G", "T"] as MId[]).map((id) => (
              <circle key={id} cx={end(id)[0]} cy={end(id)[1]} r={9} fill={C.red} stroke={C.forest} strokeWidth={3} />
            ))}
          </g>
        )}
        {/* letter badges */}
        {(["S", "G", "T"] as MId[]).map((id) => {
          const lt = letters[id];
          if (lt === undefined) return null;
          const p = ramp(t, lt, lt + 0.3);
          if (p <= 0) return null;
          const [x, y] = badgePos[id];
          const hot = on(id) > 0.5 && focus.includes(id);
          return (
            <g key={id} transform={`translate(${x} ${y}) scale(${(0.5 + 0.5 * p) * (1 + 0.15 * Math.sin(p * Math.PI))})`} opacity={p}>
              <circle r={36} fill={hot ? C.banana : C.forest} stroke={C.paper} strokeWidth={6} />
              <text y={15} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={42} fill={hot ? C.forest : C.paper}>{id}</text>
            </g>
          );
        })}
        {/* name tags */}
        {(["S", "G", "T"] as MId[]).map((id) => {
          const nt = names[id];
          if (nt === undefined) return null;
          const p = ramp(t, nt, nt + 0.3);
          if (p <= 0) return null;
          const [x, y] = badgePos[id];
          const [txt, dx, dy] = nameTag[id];
          const wd = txt.length * 19 + 34;
          return (
            <g key={id} transform={`translate(${x + dx} ${y + dy})`} opacity={p}>
              <rect x={-wd / 2} y={-24} width={wd} height={50} rx={14} fill={C.forest} />
              <text y={12} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill={C.paper}>{txt}</text>
            </g>
          );
        })}
      </g>
      {/* FRONT / BACK axis */}
      {axP > 0 && (
        <g opacity={axP} fontFamily={FONT} fontWeight={800}>
          <g transform={`translate(${36 - (1 - axP) * 30} 640)`}>
            <path d="M0 0 L 26 -16 L 26 16 Z" fill={C.matcha} />
            <text x={36} y={12} fontSize={30} fill={C.matcha} letterSpacing={3}>FRONT</text>
          </g>
          <g transform={`translate(${824 + (1 - axP) * 30} 640)`}>
            <path d="M0 0 L -26 -16 L -26 16 Z" fill={C.matcha} />
            <text x={-36} y={12} fontSize={30} fill={C.matcha} letterSpacing={3} textAnchor="end">BACK</text>
          </g>
          {caption && <g transform="translate(430 30)"><rect x={-170} y={-22} width={340} height={40} rx={20} fill={C.paper} opacity={0.92} /><text y={7} fontSize={22} fill={C.forest} opacity={0.75} textAnchor="middle" letterSpacing={2}>RIGHT KNEE · INNER VIEW</text></g>}
        </g>
      )}
      {gooseP > 0 && (
        <g transform={`translate(196 560) scale(${0.6 + 0.4 * gooseP}) rotate(${(1 - gooseP) * -20})`} opacity={gooseP}>
          <GooseFoot size={150} />
        </g>
      )}
    </svg>
  );
};

/** stylised goose foot: three webbed toes (Book Plume drawing) */
export const GooseFoot: React.FC<{ size?: number }> = ({ size = 160 }) => (
  <g transform={`scale(${size / 160}) translate(-80 -80)`}>
    <circle cx={80} cy={80} r={78} fill={C.card} stroke={C.forest} strokeWidth={5} />
    <path d="M80 34 L 80 70 M80 70 L 38 122 M80 70 L 80 132 M80 70 L 122 122" stroke={C.forest} strokeWidth={9} strokeLinecap="round" fill="none" />
    <path d="M38 122 Q 59 112 80 132 Q 101 112 122 122 L 80 70 Z" fill={C.banana} stroke={C.forest} strokeWidth={5} strokeLinejoin="round" />
    <path d="M80 34 L 80 70" stroke="#E79A3C" strokeWidth={14} strokeLinecap="round" />
    {[[38, 122], [80, 132], [122, 122]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={6} fill={C.forest} />)}
  </g>
);
