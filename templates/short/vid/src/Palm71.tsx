import React from "react";
import { C, FONT, ramp } from "./kit";

/**
 * Our own schematic of the intrinsic palm muscles: RIGHT hand, palm towards you, thumb on the LEFT,
 * so the mnemonic A-OF-A-OF-A reads left → right (thumb side → little-finger side).
 * Thenar (green): APB, OP (deep), FPB · Adductor pollicis (banana) · Hypothenar (red): ODM (deep), FDM, ADM.
 * viewBox 800 x 900.
 */
export type M = "APB" | "OP" | "FPB" | "ADP" | "ODM" | "FDM" | "ADM";
export const ORDER: M[] = ["APB", "OP", "FPB", "ADP", "ODM", "FDM", "ADM"];
export const LET: Record<M, string> = { APB: "A", OP: "O", FPB: "F", ADP: "A", ODM: "O", FDM: "F", ADM: "A" };
export const GROUP: Record<M, "th" | "ad" | "hy"> = { APB: "th", OP: "th", FPB: "th", ADP: "ad", ODM: "hy", FDM: "hy", ADM: "hy" };
export const GCOL = { th: "#8FB55A", ad: C.banana, hy: "#E58B7F" };
export const GDARK = { th: "#5C7A2F", ad: "#D9B52E", hy: "#C9483C" };
export const NAME: Record<M, string> = {
  APB: "abductor pollicis brevis",
  OP: "opponens pollicis",
  FPB: "flexor pollicis brevis",
  ADP: "adductor pollicis",
  ODM: "opponens digiti minimi",
  FDM: "flexor digiti minimi",
  ADM: "abductor digiti minimi",
};
type P = [number, number];
const SP: Record<Exclude<M, "ADP">, { p0: P; p1: P; w: number }> = {
  OP: { p0: [262, 800], p1: [142, 640], w: 50 },
  FPB: { p0: [352, 812], p1: [212, 598], w: 60 },
  APB: { p0: [300, 828], p1: [168, 590], w: 68 },
  ODM: { p0: [512, 822], p1: [560, 560], w: 46 },
  FDM: { p0: [540, 832], p1: [584, 530], w: 46 },
  ADM: { p0: [574, 842], p1: [616, 518], w: 54 },
};
/** belly centre of each muscle (diagram coords) — label anchors */
export const ANC: Record<M, P> = {
  APB: [222, 700],
  OP: [168, 676],
  FPB: [292, 716],
  ADP: [330, 600],
  ODM: [529, 730],
  FDM: [566, 651],
  ADM: [610, 567],
};

const spindle = (p0: P, p1: P, w: number) => {
  const len = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]);
  const r = (Math.atan2(p1[1] - p0[1], p1[0] - p0[0]) * 180) / Math.PI;
  const d = `M0 0 Q${len * 0.12} ${-w * 0.42} ${len * 0.42} ${-w * 0.5} Q${len * 0.82} ${-w * 0.46} ${len} 0 Q${len * 0.82} ${w * 0.46} ${len * 0.42} ${w * 0.5} Q${len * 0.12} ${w * 0.42} 0 0 Z`;
  return { len, r, d };
};

export const Palm: React.FC<{
  t: number;
  w?: number;
  id: string;
  lit?: Partial<Record<M, number>>; // time each muscle lights up (undefined = ghost)
  hot?: M | null;
  ghost?: number; // opacity of not-yet-lit muscles
  bones?: number; // metacarpal ghost bones 0..1
  nerve?: { median?: number; ulnar?: number }; // drawing progress 0..1
  letters?: number; // letter tags on muscles 0..1
}> = ({ t, w = 800, id, lit = {}, hot = null, ghost = 0.22, bones = 0.5, nerve = {}, letters = 0 }) => {
  const h = (w * 900) / 800;
  const on = (m: M) => (lit[m] === undefined ? 0 : ramp(t, lit[m]!, lit[m]! + 0.3));
  const fingers: { a: P; b: P; wd: number; joints: number[] }[] = [
    { a: [306, 470], b: [268, 112], wd: 80, joints: [0.42, 0.72] },
    { a: [396, 452], b: [402, 52], wd: 84, joints: [0.42, 0.72] },
    { a: [486, 462], b: [518, 104], wd: 80, joints: [0.42, 0.72] },
    { a: [566, 500], b: [628, 222], wd: 68, joints: [0.45, 0.74] },
  ];
  const thumb: P[] = [[262, 742], [158, 572], [92, 418]];
  const palmD = "M300 900 C 292 860, 262 822, 236 772 C 210 722, 212 640, 248 560 C 262 520, 268 470, 300 440 L 600 470 C 628 520, 640 600, 628 700 C 620 780, 600 840, 566 900 Z";
  const skin = "#F1E7CB";
  const shape = (outline: boolean) => {
    const sw = outline ? 10 : 0;
    const col = outline ? C.forest : skin;
    return (
      <g>
        {fingers.map((f, i) => (
          <line key={i} x1={f.a[0]} y1={f.a[1]} x2={f.b[0]} y2={f.b[1]} stroke={col} strokeWidth={f.wd + sw} strokeLinecap="round" />
        ))}
        <polyline points={thumb.map((p) => p.join(",")).join(" ")} fill="none" stroke={col} strokeWidth={92 + sw} strokeLinecap="round" strokeLinejoin="round" />
        <path d={palmD} fill={col} stroke={col} strokeWidth={sw} strokeLinejoin="round" />
        <rect x={290 - sw / 2} y={860 - sw / 2} width={280 + sw} height={60} fill={col} />
      </g>
    );
  };
  const muscle = (m: M) => {
    const g = GROUP[m];
    const p = on(m);
    const op = ghost + (1 - ghost) * p;
    const isHot = hot === m && p > 0;
    const pulse = isHot ? 0.5 + 0.5 * Math.sin(t * 9) : 0;
    let body: React.ReactNode;
    if (m === "ADP") {
      // fan: apex at the thumb base, wide origin along the 3rd metacarpal
      const d = "M206 604 Q262 530 398 490 Q410 590 404 700 Q300 668 214 628 Z";
      body = (
        <g>
          {isHot && <path d={d} fill="none" stroke={C.banana} strokeWidth={22 + 10 * pulse} opacity={0.55} strokeLinejoin="round" />}
          <path d={d} fill={p > 0 ? `url(#${id}ad)` : "#E9E2C4"} stroke={C.forest} strokeWidth={5} strokeLinejoin="round" />
          {[0.15, 0.32, 0.5, 0.68, 0.85].map((k, i) => {
            const ox = 398 + (404 - 398) * k, oy = 490 + (700 - 490) * k;
            return <line key={i} x1={214} y1={614} x2={ox - 8} y2={oy} stroke={C.forest} strokeWidth={2.5} opacity={0.28} />;
          })}
        </g>
      );
    } else {
      const s = SP[m];
      const sp = spindle(s.p0, s.p1, s.w * (1 + 0.08 * pulse));
      body = (
        <g transform={`translate(${s.p0[0]} ${s.p0[1]}) rotate(${sp.r})`}>
          {isHot && <path d={sp.d} fill="none" stroke={C.banana} strokeWidth={22 + 10 * pulse} opacity={0.55} strokeLinejoin="round" />}
          <path d={sp.d} fill={p > 0 ? `url(#${id}${g})` : "#E9E2C4"} stroke={C.forest} strokeWidth={5} strokeLinejoin="round" />
          {[-0.28, -0.1, 0.08, 0.26].map((k, i) => (
            <path key={i} d={`M${sp.len * 0.08} ${k * s.w * 0.6} Q${sp.len * 0.45} ${k * s.w * 1.2} ${sp.len * 0.92} ${k * s.w * 0.3}`} fill="none" stroke={C.forest} strokeWidth={2.5} opacity={0.3} />
          ))}
          <ellipse cx={sp.len * 0.42} cy={-s.w * 0.2} rx={sp.len * 0.24} ry={s.w * 0.1} fill="#FFFFFF" opacity={0.35 * p} />
        </g>
      );
    }
    return (
      <g key={m} opacity={op}>
        {body}
      </g>
    );
  };
  const nervePath = (d: string, k: number, col: string, key: string) =>
    k > 0 ? (
      <g key={key}>
        <path d={d} fill="none" stroke={C.paper} strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray={`${k} 1`} />
        <path d={d} fill="none" stroke={col} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={`${k} 1`} />
      </g>
    ) : null;
  return (
    <svg width={w} height={h} viewBox="0 0 800 900" style={{ overflow: "visible" }}>
      <defs>
        {(["th", "ad", "hy"] as const).map((g) => (
          <linearGradient key={g} id={`${id}${g}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={GCOL[g]} />
            <stop offset="1" stopColor={GDARK[g]} />
          </linearGradient>
        ))}
      </defs>
      {shape(true)}
      {shape(false)}
      {/* finger creases + nails area */}
      {fingers.map((f, i) =>
        f.joints.map((j, k) => {
          const x = f.a[0] + (f.b[0] - f.a[0]) * j, y = f.a[1] + (f.b[1] - f.a[1]) * j;
          const ang = Math.atan2(f.b[1] - f.a[1], f.b[0] - f.a[0]) + Math.PI / 2;
          const r = f.wd * 0.36;
          return <line key={`${i}${k}`} x1={x - Math.cos(ang) * r} y1={y - Math.sin(ang) * r} x2={x + Math.cos(ang) * r} y2={y + Math.sin(ang) * r} stroke={C.forest} strokeWidth={3} opacity={0.25} strokeLinecap="round" />;
        })
      )}
      {/* metacarpal ghost bones */}
      <g opacity={bones * 0.5}>
        {[[[248, 762], [168, 600]], [[318, 800], [306, 486]], [[392, 800], [396, 468]], [[462, 804], [484, 478]], [[528, 812], [562, 512]]].map((b, i) => (
          <line key={i} x1={b[0][0]} y1={b[0][1]} x2={b[1][0]} y2={b[1][1]} stroke="#D9CFAE" strokeWidth={24} strokeLinecap="round" />
        ))}
      </g>
      {/* flexor retinaculum band */}
      <path d="M300 846 Q430 822 566 850 L 562 884 Q430 858 304 880 Z" fill="#E4DAB8" stroke={C.forest} strokeWidth={3} opacity={0.75} />
      {(["OP", "ADP", "FPB", "APB", "ODM", "FDM", "ADM"] as M[]).map(muscle)}
      {nervePath("M420 900 L 410 846 Q 380 800 330 790 Q 300 786 286 768", nerve.median ?? 0, "#F2D14E", "med")}
      {nervePath("M548 900 L 540 846 Q 520 790 470 740 Q 420 700 360 660", nerve.ulnar ?? 0, "#7FA0CC", "uln")}
      {letters > 0 &&
        ORDER.map((m) => {
          const a = ANC[m];
          const p = on(m) * letters;
          if (p <= 0) return null;
          return (
            <g key={m} transform={`translate(${a[0]} ${a[1]}) scale(${0.6 + 0.4 * p})`} opacity={p}>
              <circle r={25} fill={C.paper} stroke={C.forest} strokeWidth={4} />
              <text y={11} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill={C.forest}>
                {LET[m]}
              </text>
            </g>
          );
        })}
    </svg>
  );
};
