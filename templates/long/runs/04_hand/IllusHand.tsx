import React from "react";
import { C, FONT, ramp } from "./kit";
import { BONES, BoneId } from "./WristH";

/* ======================================================================
   Book Plume own illustrations for "Bones of the Hand and Wrist".
   HandSkel = full skeleton of the LEFT hand, back view (thumb on the left,
   fingers up, forearm down). Carpals reuse the WristH geometry (scaled 0.6).
   ====================================================================== */

export const GC = { carpal: C.banana, meta: "#A9C77A", phal: "#EE9F92" };
const WT = { x: 160, y: 560, k: 0.6 }; // wrist geometry → hand coords
const wx = (x: number) => WT.x + WT.k * x;
const wy = (y: number) => WT.y + WT.k * y;

type Ray = { id: number; x: number; y: number; a: number; L: number[]; w: number[] };
const RAYS: Ray[] = [
  { id: 1, x: 248, y: 744, a: -36, L: [150, 118, 92], w: [50, 44, 38] },
  { id: 2, x: 327, y: 737, a: -7, L: [238, 150, 98, 74], w: [44, 39, 34, 30] },
  { id: 3, x: 393, y: 731, a: 0, L: [236, 164, 108, 78], w: [46, 40, 35, 31] },
  { id: 4, x: 456, y: 736, a: 7, L: [216, 154, 102, 76], w: [42, 37, 32, 28] },
  { id: 5, x: 500, y: 744, a: 15, L: [192, 124, 80, 68], w: [39, 34, 30, 27] },
];
const GAP = 9;
export type JointKind = "rc" | "mid" | "cmc" | "mcp" | "pip" | "dip" | "ip";

/** geometry of one ray, optionally with the thumb swung across the palm (sw 0..1) */
const rayGeom = (r: Ray, sw = 0) => {
  const a = r.id === 1 ? -36 + 60 * sw : r.a;
  const ks = r.id === 1 ? 1 - 0.2 * sw : 1;
  const rad = (a * Math.PI) / 180;
  const dx = Math.sin(rad), dy = -Math.cos(rad);
  const segs: { x: number; y: number; ex: number; ey: number; len: number; wd: number; id: string; kind: string }[] = [];
  let x = r.x, y = r.y;
  const kinds = r.id === 1 ? ["mc", "p", "d"] : ["mc", "p", "m", "d"];
  r.L.forEach((L0, i) => {
    const L = L0 * ks;
    const id = i === 0 ? `mc${r.id}` : `p${r.id}${kinds[i]}`;
    segs.push({ x, y, ex: x + dx * L, ey: y + dy * L, len: L, wd: r.w[i], id, kind: kinds[i] });
    x += dx * (L + GAP);
    y += dy * (L + GAP);
  });
  return { a, segs };
};

/** centre of a bone in hand coords (for HTML tags placed over the diagram) */
export const handPt = (id: string, sw = 0): [number, number] => {
  const b = BONES.find((q) => q.id === id);
  if (b) return [wx(b.cx), wy(b.cy)];
  for (const r of RAYS) {
    const g = rayGeom(r, sw);
    for (const s of g.segs) if (s.id === id) return [(s.x + s.ex) / 2, (s.y + s.ey) / 2];
  }
  return [400, 500];
};

export const bonePath = (L: number, w: number, kind: string) => {
  if (kind === "d")
    return `M0 ${-w * 0.52} Q${L * 0.3} ${-w * 0.32} ${L * 0.68} ${-w * 0.26} Q${L} ${-w * 0.36} ${L} 0 Q${L} ${w * 0.36} ${L * 0.68} ${w * 0.26} Q${L * 0.3} ${w * 0.32} 0 ${w * 0.52} Q${-w * 0.22} 0 0 ${-w * 0.52} Z`;
  return `M0 ${-w * 0.56} Q${L * 0.2} ${-w * 0.3} ${L * 0.5} ${-w * 0.3} Q${L * 0.8} ${-w * 0.3} ${L - w * 0.3} ${-w * 0.44} L${L - w * 0.3} ${w * 0.44} Q${L * 0.8} ${w * 0.3} ${L * 0.5} ${w * 0.3} Q${L * 0.2} ${w * 0.3} 0 ${w * 0.56} Q${-w * 0.22} 0 0 ${-w * 0.56} Z`;
};

export const Defs: React.FC = () => (
  <defs>
    <radialGradient id="hsBone" cx="40%" cy="35%" r="75%">
      <stop offset="0%" stopColor="#FFFDF4" />
      <stop offset="60%" stopColor="#EFE6CC" />
      <stop offset="100%" stopColor="#D2C39A" />
    </radialGradient>
    <linearGradient id="hsShaft" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#D8CBA5" />
      <stop offset="45%" stopColor="#FBF6E6" />
      <stop offset="100%" stopColor="#CDBE93" />
    </linearGradient>
    <linearGradient id="hsShaftV" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#D8CBA5" />
      <stop offset="45%" stopColor="#FBF6E6" />
      <stop offset="100%" stopColor="#CDBE93" />
    </linearGradient>
    <radialGradient id="hsLit" cx="40%" cy="35%" r="75%">
      <stop offset="0%" stopColor="#FFF4BE" />
      <stop offset="65%" stopColor={C.banana} />
      <stop offset="100%" stopColor={C.bananaDark} />
    </radialGradient>
    <filter id="hsSh" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#1F2A14" floodOpacity="0.18" />
    </filter>
    <filter id="hsGlow" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="9" />
    </filter>
  </defs>
);

type Win = { a: number; b?: number };
const win = (t: number, w?: Win | number) => {
  if (w === undefined) return 0;
  const a = typeof w === "number" ? w : w.a;
  const b = typeof w === "number" ? undefined : w.b;
  return ramp(t, a, a + 0.3) * (b === undefined ? 1 : 1 - ramp(t, b, b + 0.3));
};

export const HandSkel: React.FC<{
  t: number;
  w?: number; // rendered width (viewBox 800x1000)
  groups?: { carpal?: Win | number; meta?: Win | number; phal?: Win | number };
  lit?: Record<string, number | Win>; // bone ids: mc1..mc5, p2p/p2m/p2d, p1p/p1d, carpal ids S L Tq P Tm Td Cp H
  joints?: Partial<Record<JointKind, Win | number>>;
  nums?: number; // metacarpal numbers appear
  letters?: number; // carpal letters appear
  rows?: { p?: Win | number; d?: Win | number };
  forearm?: number; // radius/ulna labels
  swing?: [number, number, number?]; // thumb swing: start, end, (back)
  hook?: number;
  dim?: number; // 0..1 dims the not-lit bones
  draw?: number; // draw-on: bones appear from wrist to fingertips (time)
}> = ({ t, w = 600, groups = {}, lit = {}, joints = {}, nums, letters, rows = {}, forearm, swing, hook, dim = 0, draw }) => {
  const h = w * 1.25;
  let sw = 0;
  if (swing) {
    sw = ramp(t, swing[0], swing[1]);
    if (swing[2] !== undefined) sw *= 1 - ramp(t, swing[2], swing[2] + (swing[1] - swing[0]));
  }
  const gk = { carpal: win(t, groups.carpal), meta: win(t, groups.meta), phal: win(t, groups.phal) };
  const lk = (id: string) => win(t, lit[id] as any);
  const dr = (order: number) => (draw === undefined ? 1 : ramp(t, draw + order * 0.12, draw + order * 0.12 + 0.35));
  const anyLit = Object.keys(lit).some((k) => lk(k) > 0.01);
  const dimK = dim * (anyLit ? 1 : 0);
  const geoms = RAYS.map((r) => ({ r, g: rayGeom(r, sw) }));
  const jk = (k: JointKind) => win(t, joints[k]);

  const renderBone = (s: ReturnType<typeof rayGeom>["segs"][number], a: number, order: number) => {
    const group = s.kind === "mc" ? gk.meta : gk.phal;
    const gcol = s.kind === "mc" ? GC.meta : GC.phal;
    const l = lk(s.id);
    const pulse = lit[s.id] === undefined ? 0 : Math.max(0, 1 - Math.abs(t - (typeof lit[s.id] === "number" ? (lit[s.id] as number) : (lit[s.id] as Win).a) - 0.15) / 0.3);
    const o = dr(order);
    if (o <= 0) return null;
    return (
      <g key={s.id} transform={`translate(${s.x} ${s.y}) rotate(${-90 + a})`} opacity={o * (1 - dimK * 0.65 * (1 - l))}>
        {l > 0 && <path d={bonePath(s.len, s.wd + 22, s.kind)} transform={`translate(-6 0)`} fill={C.banana} opacity={0.7 * l} filter="url(#hsGlow)" />}
        <g transform={`scale(${1 + 0.06 * pulse})`} filter="url(#hsSh)">
          <path d={bonePath(s.len, s.wd, s.kind)} fill="url(#hsShaft)" stroke={C.forest} strokeWidth={3.5} strokeLinejoin="round" />
          {s.kind !== "d" && <ellipse cx={s.len - s.wd * 0.15} cy={0} rx={s.wd * 0.5} ry={s.wd * 0.56} fill="url(#hsBone)" stroke={C.forest} strokeWidth={3.5} />}
          {group > 0 && <path d={bonePath(s.len, s.wd, s.kind)} fill={gcol} opacity={0.8 * group} />}
          {group > 0 && s.kind !== "d" && <ellipse cx={s.len - s.wd * 0.15} cy={0} rx={s.wd * 0.5} ry={s.wd * 0.56} fill={gcol} opacity={0.8 * group} stroke={C.forest} strokeWidth={3.5} />}
          {l > 0 && <path d={bonePath(s.len, s.wd, s.kind)} fill="url(#hsLit)" opacity={l} />}
          {l > 0 && s.kind !== "d" && <ellipse cx={s.len - s.wd * 0.15} cy={0} rx={s.wd * 0.5} ry={s.wd * 0.56} fill="url(#hsLit)" opacity={l} stroke={C.forest} strokeWidth={3.5} />}
          <line x1={s.wd * 0.5} y1={-s.wd * 0.12} x2={s.len - s.wd * 0.9} y2={-s.wd * 0.1} stroke={C.forest} strokeWidth={1.6} opacity={0.22} />
          <ellipse cx={s.len * 0.42} cy={-s.wd * 0.12} rx={s.len * 0.22} ry={s.wd * 0.07} fill="#FFFFFF" opacity={0.35} />
        </g>
      </g>
    );
  };

  // joint marker positions
  const jointPts: Record<string, [number, number, number][]> = { cmc: [], mcp: [], pip: [], dip: [], ip: [] };
  geoms.forEach(({ r, g }) => {
    const s = g.segs;
    const mid = (i: number): [number, number, number] => [(s[i].ex + s[i + 1].x) / 2, (s[i].ey + s[i + 1].y) / 2, s[i].wd];
    jointPts.cmc.push([s[0].x, s[0].y - 4, s[0].wd]);
    jointPts.mcp.push(mid(0));
    if (r.id === 1) jointPts.ip.push(mid(1));
    else {
      jointPts.pip.push(mid(1));
      jointPts.dip.push(mid(2));
    }
  });

  return (
    <svg width={w} height={h} viewBox="0 0 800 1000" style={{ overflow: "visible" }}>
      <Defs />
      {/* forearm */}
      <g filter="url(#hsSh)" opacity={dr(0) * (1 - dimK * 0.55)}>
        <path d={`M${wx(150)} 1010 L${wx(170)} ${wy(575)} Q${wx(180)} ${wy(548)} ${wx(230)} ${wy(545)} L${wx(410)} ${wy(548)} Q${wx(440)} ${wy(552)} ${wx(440)} ${wy(580)} L${wx(430)} 1010 Z`} fill="url(#hsShaftV)" stroke={C.forest} strokeWidth={3.5} />
        <path d={`M${wx(470)} 1010 L${wx(478)} ${wy(590)} Q${wx(484)} ${wy(562)} ${wx(520)} ${wy(560)} L${wx(585)} ${wy(562)} Q${wx(610)} ${wy(568)} ${wx(606)} ${wy(596)} L${wx(596)} 1010 Z`} fill="url(#hsShaftV)" stroke={C.forest} strokeWidth={3.5} />
        {forearm !== undefined && (
          <g opacity={ramp(t, forearm, forearm + 0.3)}>
            <text x={wx(300)} y={975} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={C.forest}>RADIUS</text>
            <text x={wx(538)} y={975} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={22} fill={C.forest}>ULNA</text>
          </g>
        )}
      </g>
      {/* carpals */}
      <g transform={`translate(${WT.x} ${WT.y}) scale(${WT.k})`}>
        {BONES.map((b, i) => {
          const l = lk(b.id);
          const o = dr(1 + (i % 4) * 0.2);
          return (
            <g key={b.id} transform={`translate(${b.cx} ${b.cy}) rotate(${b.rot})`} filter="url(#hsSh)" opacity={o * (1 - dimK * 0.65 * (1 - l))}>
              {l > 0 && <ellipse rx={b.rx + 16} ry={b.ry + 16} fill={C.banana} opacity={0.6 * l} filter="url(#hsGlow)" />}
              <ellipse rx={b.rx} ry={b.ry} fill="url(#hsBone)" stroke={C.forest} strokeWidth={5.5} />
              {gk.carpal > 0 && <ellipse rx={b.rx} ry={b.ry} fill={GC.carpal} opacity={0.85 * gk.carpal} />}
              {l > 0 && <ellipse rx={b.rx} ry={b.ry} fill="url(#hsLit)" opacity={l} stroke={C.forest} strokeWidth={5.5} />}
              <ellipse cx={-b.rx * 0.25} cy={-b.ry * 0.3} rx={b.rx * 0.35} ry={b.ry * 0.18} fill="#FFFFFF" opacity={0.45} />
            </g>
          );
        })}
        <g transform="translate(540 382)" opacity={dr(1.5)}>
          {hook !== undefined && <circle r={44} fill={C.red} opacity={0.45 * ramp(t, hook, hook + 0.3)} filter="url(#hsGlow)" />}
          <path d="M-18 -10 Q20 -18 26 12 Q28 30 12 34 Q18 14 -6 8 Z" fill={hook !== undefined && t >= hook ? C.red : "url(#hsBone)"} stroke={C.forest} strokeWidth={5} />
        </g>
        {win(t, rows.d) > 0 && <rect x={92} y={262} width={492} height={176} rx={88} fill="none" stroke={C.matcha} strokeWidth={10} strokeDasharray="24 14" opacity={win(t, rows.d)} />}
        {win(t, rows.p) > 0 && <rect x={132} y={400} width={510} height={150} rx={75} fill="none" stroke={C.red} strokeWidth={10} strokeDasharray="24 14" opacity={win(t, rows.p)} />}
        {letters !== undefined &&
          BONES.map((b) => (
            <text key={b.id} x={b.lx} y={b.ly + 15} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={b.id === "P" ? 38 : 48} fill={C.forest} opacity={ramp(t, letters, letters + 0.3)}>
              {b.letter}
            </text>
          ))}
      </g>
      {/* fingers (thumb last when it swings over the palm) */}
      {[...geoms].sort((p, q) => (sw > 0.05 ? (p.r.id === 1 ? 1 : q.r.id === 1 ? -1 : 0) : 0)).map(({ r, g }) => (
        <g key={r.id}>{g.segs.map((s, i) => renderBone(s, g.a, 2 + i + (r.id - 1) * 0.15))}</g>
      ))}
      {/* metacarpal numbers */}
      {nums !== undefined &&
        geoms.map(({ r, g }, i) => {
          const s = g.segs[0];
          const p = ramp(t, nums + i * 0.18, nums + i * 0.18 + 0.25);
          const cx = (s.x + s.ex) / 2, cy = (s.y + s.ey) / 2;
          return (
            <g key={r.id} opacity={p} transform={`translate(${cx} ${cy}) scale(${0.6 + 0.4 * p})`}>
              <circle r={24} fill={C.forest} stroke={C.paper} strokeWidth={4} />
              <text y={10} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={C.banana}>{r.id}</text>
            </g>
          );
        })}
      {/* joints */}
      {jk("rc") > 0 && <path d={`M${wx(185)} ${wy(540)} Q${wx(310)} ${wy(520)} ${wx(445)} ${wy(538)}`} fill="none" stroke={C.red} strokeWidth={9} strokeLinecap="round" opacity={jk("rc")} />}
      {jk("mid") > 0 && <path d={`M${wx(120)} ${wy(420)} Q${wx(230)} ${wy(400)} ${wx(320)} ${wy(420)} Q${wx(420)} ${wy(440)} ${wx(470)} ${wy(405)} Q${wx(540)} ${wy(380)} ${wx(615)} ${wy(400)}`} fill="none" stroke={C.red} strokeWidth={9} strokeLinecap="round" opacity={jk("mid")} />}
      {(["cmc", "mcp", "pip", "dip", "ip"] as JointKind[]).map((k) =>
        jk(k) > 0
          ? jointPts[k].map(([x, y, wd], i) => (
              <g key={k + i} opacity={jk(k)}>
                <circle cx={x} cy={y} r={wd * 0.62 + 6} fill={C.red} opacity={0.35} filter="url(#hsGlow)" />
                <circle cx={x} cy={y} r={wd * 0.5} fill="none" stroke={C.red} strokeWidth={6} />
              </g>
            ))
          : null
      )}
    </svg>
  );
};

/* ---------------- one long bone, big: base · shaft · head ---------------- */
export const LongBone: React.FC<{ t: number; w?: number; base?: number; shaft?: number; head?: number; title?: string; knuckle?: number }> = ({ t, w = 900, base, shaft, head, knuckle }) => {
  const k = (v?: number) => (v === undefined ? 0 : ramp(t, v, v + 0.3));
  const L = 760, wd = 150;
  const tag = (x: number, y: number, txt: string, p: number, col: string) =>
    p > 0 ? (
      <g opacity={p} transform={`translate(${x} ${y + (1 - p) * 20})`}>
        <rect x={-110} y={-36} width={220} height={66} rx={20} fill={col} />
        <text y={12} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill={col === C.forest ? C.paper : C.forest}>{txt}</text>
      </g>
    ) : null;
  return (
    <svg width={w} height={w * 0.42} viewBox="0 0 900 380" style={{ overflow: "visible" }}>
      <Defs />
      <g transform="translate(70 190)">
        {k(base) > 0 && <ellipse cx={30} cy={0} rx={70} ry={100} fill={GC.carpal} opacity={0.7 * k(base)} filter="url(#hsGlow)" />}
        {k(shaft) > 0 && <rect x={140} y={-60} width={420} height={120} rx={60} fill={GC.meta} opacity={0.7 * k(shaft)} filter="url(#hsGlow)" />}
        {k(head) > 0 && <ellipse cx={L - 30} cy={0} rx={95} ry={105} fill={GC.phal} opacity={0.75 * k(head)} filter="url(#hsGlow)" />}
        <g filter="url(#hsSh)">
          <path d={bonePath(L, wd, "mc")} fill="url(#hsShaft)" stroke={C.forest} strokeWidth={5} strokeLinejoin="round" />
          <ellipse cx={L - wd * 0.15} cy={0} rx={wd * 0.5} ry={wd * 0.56} fill="url(#hsBone)" stroke={C.forest} strokeWidth={5} />
          <path d={`M${wd * 0.7} ${-wd * 0.1} Q${L * 0.5} ${-wd * 0.16} ${L - wd * 1.1} ${-wd * 0.08}`} stroke={C.forest} strokeWidth={2.5} fill="none" opacity={0.25} />
          <ellipse cx={L * 0.42} cy={-wd * 0.13} rx={L * 0.2} ry={wd * 0.06} fill="#FFFFFF" opacity={0.4} />
          <path d={`M${-wd * 0.05} ${-wd * 0.4} Q${wd * 0.15} 0 ${-wd * 0.05} ${wd * 0.4}`} stroke={C.forest} strokeWidth={3} fill="none" opacity={0.35} />
        </g>
        {tag(40, -150, "BASE", k(base), C.banana)}
        {tag(L * 0.48, -150, "SHAFT", k(shaft), C.forest)}
        {tag(L - 30, -150, "HEAD", k(head), "#EE9F92")}
        {k(base) > 0 && <path d={`M40 -112 L40 -86`} stroke={C.forest} strokeWidth={5} opacity={k(base)} />}
        {k(shaft) > 0 && <path d={`M${L * 0.48} -112 L${L * 0.48} -62`} stroke={C.forest} strokeWidth={5} opacity={k(shaft)} />}
        {k(head) > 0 && <path d={`M${L - 30} -112 L${L - 30} -90`} stroke={C.forest} strokeWidth={5} opacity={k(head)} />}
        {knuckle !== undefined && (
          <g opacity={ramp(t, knuckle, knuckle + 0.3)}>
            <text x={L - 30} y={150} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={C.red}>= your knuckle</text>
          </g>
        )}
        {base !== undefined && (
          <g opacity={ramp(t, base + 0.4, base + 0.7)}>
            <text x={40} y={150} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.matcha}>meets the carpals</text>
          </g>
        )}
      </g>
    </svg>
  );
};

/* ---------------- carpal tunnel cross-section (palm side up) ---------------- */
export const Tunnel: React.FC<{ t: number; w?: number; arch?: number; ret?: number; tendons?: number; nerve?: number; labels?: boolean }> = ({ t, w = 860, arch, ret, tendons, nerve, labels = true }) => {
  const k = (v?: number) => (v === undefined ? 0 : ramp(t, v, v + 0.35));
  const bones = [
    { x: 120, y: 250, rx: 70, ry: 62, r: -30, n: "trapezium" },
    { x: 255, y: 330, rx: 62, ry: 52, r: -12, n: "trapezoid" },
    { x: 420, y: 352, rx: 92, ry: 66, r: 0, n: "capitate" },
    { x: 600, y: 300, rx: 80, ry: 64, r: 18, n: "hamate" },
  ];
  const tend: [number, number][] = [[250, 205], [320, 215], [390, 220], [460, 218], [530, 205], [285, 270], [360, 280], [440, 280], [515, 262]];
  return (
    <svg width={w} height={w * 0.62} viewBox="0 0 860 530" style={{ overflow: "visible" }}>
      <Defs />
      <text x={430} y={30} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={C.matcha} letterSpacing={4}>PALM SIDE ↑</text>
      <text x={430} y={520} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={C.matcha} letterSpacing={4}>BACK OF THE HAND ↓</text>
      {/* tunnel space */}
      {k(arch) > 0 && <path d="M150 170 Q430 70 700 170 Q640 300 430 300 Q220 300 150 170 Z" fill={C.banana} opacity={0.22 * k(arch)} />}
      {/* bones */}
      <g opacity={1}>
        {bones.map((b, i) => (
          <g key={b.n} transform={`translate(${b.x} ${b.y}) rotate(${b.r})`} filter="url(#hsSh)">
            <ellipse rx={b.rx} ry={b.ry} fill="url(#hsBone)" stroke={C.forest} strokeWidth={4} />
            <ellipse rx={b.rx} ry={b.ry} fill={GC.carpal} opacity={0.75 * k(arch === undefined ? undefined : arch + i * 0.15)} stroke={C.forest} strokeWidth={4} />
            <ellipse cx={-b.rx * 0.25} cy={-b.ry * 0.3} rx={b.rx * 0.35} ry={b.ry * 0.16} fill="#fff" opacity={0.45} />
          </g>
        ))}
        {/* trapezium tubercle + hook of hamate rise toward the palm */}
        <path d="M70 215 Q90 150 140 150 Q170 160 165 200 Z" fill="url(#hsBone)" stroke={C.forest} strokeWidth={4} />
        <path d="M640 250 Q660 170 705 150 Q735 150 730 185 Q700 220 690 275 Z" fill="url(#hsBone)" stroke={C.forest} strokeWidth={4} />
      </g>
      {/* retinaculum */}
      {k(ret) > 0 && (
        <g opacity={k(ret)}>
          <path d="M120 160 Q430 50 735 160" fill="none" stroke={C.matcha} strokeWidth={26} strokeLinecap="round" strokeDasharray={`${900 * k(ret)} 2000`} />
          <path d="M120 160 Q430 50 735 160" fill="none" stroke="#FFFFFF" strokeWidth={3} opacity={0.4} strokeDasharray="10 14" />
        </g>
      )}
      {/* tendons */}
      {tend.map(([x, y], i) => {
        const p = k(tendons === undefined ? undefined : tendons + i * 0.1);
        return p > 0 ? (
          <g key={i} opacity={p} transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * p})`}>
            <circle r={27} fill="#F5EFE0" stroke={C.forest} strokeWidth={3.5} />
            <circle r={18} fill="none" stroke={C.forest} strokeWidth={1.5} opacity={0.3} />
          </g>
        ) : null;
      })}
      {k(nerve) > 0 && (
        <g opacity={k(nerve)} transform={`translate(330 150)`}>
          <circle r={50} fill={C.banana} opacity={0.6} filter="url(#hsGlow)" />
          <ellipse rx={40} ry={26} fill={C.banana} stroke={C.forest} strokeWidth={4} />
          <circle cx={-12} cy={-4} r={6} fill={C.bananaDark} />
          <circle cx={8} cy={6} r={6} fill={C.bananaDark} />
          <circle cx={18} cy={-8} r={5} fill={C.bananaDark} />
        </g>
      )}
      {labels && (
        <g fontFamily={FONT} fontWeight={800}>
          {k(ret) > 0 && <text x={430} y={78} textAnchor="middle" fontSize={30} fill={C.forest} opacity={k(ret)}>flexor retinaculum</text>}
          {k(arch) > 0 && <text x={430} y={465} textAnchor="middle" fontSize={30} fill={C.forest} opacity={k(arch)}>carpal bones (an arch)</text>}
          {k(nerve) > 0 && (
            <g opacity={k(nerve)}>
              <line x1={290} y1={140} x2={160} y2={95} stroke={C.forest} strokeWidth={3} />
              <text x={150} y={88} textAnchor="end" fontSize={30} fill={C.forest}>median nerve</text>
            </g>
          )}
          {k(tendons) > 0 && (
            <g opacity={k(tendons)}>
              <line x1={560} y1={260} x2={760} y2={330} stroke={C.forest} strokeWidth={3} />
              <text x={770} y={340} fontSize={30} fill={C.forest}>9 tendons</text>
            </g>
          )}
        </g>
      )}
    </svg>
  );
};

/* ---------------- flashcard (Book Plume style, our own drawing) ---------------- */
export const StudyCard: React.FC<{ t: number; flip: number; front: React.ReactNode; back: string; w?: number }> = ({ t, flip, front, back, w = 560 }) => {
  const p = ramp(t, flip, flip + 0.6);
  const ang = p * 180;
  const showBack = ang > 90;
  return (
    <div style={{ width: w, height: w * 0.66, perspective: 1600 }}>
      <div style={{ width: "100%", height: "100%", transform: `rotateY(${ang}deg)`, transformStyle: "preserve-3d", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: showBack ? C.forest : C.card, border: `4px solid ${showBack ? C.forest : C.line}`, boxShadow: "0 20px 40px rgba(31,42,20,0.18)", transform: showBack ? "rotateY(180deg)" : "none", display: "flex", alignItems: "center", justifyContent: "center", padding: 30, boxSizing: "border-box", textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 52, color: showBack ? C.banana : C.forest, lineHeight: 1.15, whiteSpace: "pre-line", overflow: "hidden" }}>
          {showBack ? back : front}
        </div>
      </div>
    </div>
  );
};

export type { BoneId };
