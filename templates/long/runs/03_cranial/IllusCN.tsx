import React from "react";
import { C, FONT, ramp } from "./kit";

/* ===== Book Plume's own cranial-nerve illustrations (original schematic artwork) ===== */

export const TC = { S: "#6FA3D2", M: "#E39A5B", B: "#A98BD0" } as const; // sensory / motor / both
export type NT = keyof typeof TC;
export const NERVES: { n: number; r: string; name: string; type: NT; job: string }[] = [
  { n: 1, r: "I", name: "Olfactory", type: "S", job: "smell" },
  { n: 2, r: "II", name: "Optic", type: "S", job: "vision" },
  { n: 3, r: "III", name: "Oculomotor", type: "M", job: "4 eye muscles · eyelid · pupil" },
  { n: 4, r: "IV", name: "Trochlear", type: "M", job: "superior oblique" },
  { n: 5, r: "V", name: "Trigeminal", type: "B", job: "face sensation · chewing" },
  { n: 6, r: "VI", name: "Abducens", type: "M", job: "lateral rectus" },
  { n: 7, r: "VII", name: "Facial", type: "B", job: "facial expression · taste · tears & saliva" },
  { n: 8, r: "VIII", name: "Vestibulocochlear", type: "S", job: "hearing · balance" },
  { n: 9, r: "IX", name: "Glossopharyngeal", type: "B", job: "taste back 1/3 · swallowing" },
  { n: 10, r: "X", name: "Vagus", type: "B", job: "throat · voice · heart, lungs, gut" },
  { n: 11, r: "XI", name: "Accessory", type: "M", job: "SCM + trapezius" },
  { n: 12, r: "XII", name: "Hypoglossal", type: "M", job: "tongue muscles" },
];
export const TYPE_NAME = { S: "Sensory", M: "Motor", B: "Both" } as const;

const k = (t: number, v?: number, d = 0.45) => (v === undefined ? 0 : ramp(t, v, v + d));
const SKIN = "#F1DECB", SKIN2 = "#E6CBB2";

/* ---------------------------------------------------------------------------------------------
 * 1. Underside of the brain + brainstem with the 12 nerve pairs (schematic, ventral view)
 * ------------------------------------------------------------------------------------------- */
// right-side attachment point -> badge point (left side is mirrored)
const BX = 735;
const NP: Record<number, { a: [number, number]; via?: [number, number]; y: number; w: number }> = {
  1: { a: [556, 92], y: 80, w: 9 },
  2: { a: [578, 176], y: 160, w: 12 },
  3: { a: [522, 300], via: [600, 292], y: 255, w: 9 },
  4: { a: [592, 332], via: [640, 330], y: 318, w: 5 },
  5: { a: [636, 392], via: [680, 388], y: 383, w: 15 },
  6: { a: [520, 470], via: [620, 466], y: 446, w: 7 },
  7: { a: [578, 478], via: [650, 500], y: 503, w: 9 },
  8: { a: [600, 488], via: [660, 548], y: 558, w: 9 },
  9: { a: [570, 548], via: [650, 600], y: 610, w: 6 },
  10: { a: [571, 574], via: [650, 650], y: 660, w: 8 },
  12: { a: [532, 590], via: [600, 690], y: 706, w: 6 },
  11: { a: [548, 700], via: [640, 748], y: 752, w: 6 },
};
const npath = (n: number, side: 1 | -1) => {
  const p = NP[n];
  const X = (x: number) => 500 + side * (x - 500);
  const [ax, ay] = p.a;
  const bx = X(BX - 30), by = p.y;
  if (n === 4) return `M${X(ax)} ${ay} C${X(615)} ${ay - 30} ${X(650)} ${by + 10} ${bx} ${by}`;
  if (n === 11) return `M${X(ax)} ${ay} C${X(560)} ${ay - 30} ${X(620)} ${by} ${bx} ${by}`;
  const v = p.via || [(ax + BX) / 2, (ay + by) / 2];
  return `M${X(ax)} ${ay} C${X(v[0])} ${ay} ${X(v[0] + 20)} ${by} ${bx} ${by}`;
};
export const BrainMap: React.FC<{
  t: number; w?: number;
  lit?: Record<number, number>; // nerve -> time it appears
  names?: Record<number, number>; // nerve -> time its name appears
  types?: number; // time the badges switch to type colours
  hot?: { n: number[]; a: number; b: number }[];
  dim?: number; // time from which non-hot nerves dim
  regions?: { fore?: number; mid?: number; pons?: number; med?: number };
  hideRight?: boolean;
}> = ({ t, w = 1000, lit = {}, names = {}, types, hot = [], dim, regions = {} }) => {
  const isHot = (n: number) => hot.some((h) => h.n.includes(n) && t >= h.a && t < h.b + 0.3);
  const hotK = (n: number) => Math.max(0, ...hot.filter((h) => h.n.includes(n)).map((h) => ramp(t, h.a, h.a + 0.35) * (1 - ramp(t, h.b, h.b + 0.3))));
  const anyHot = hot.some((h) => t >= h.a && t < h.b);
  const dimK = dim !== undefined && anyHot ? ramp(t, dim, dim + 0.4) : 0;
  const tk = k(t, types, 0.6);
  const reg = (v: number | undefined, x: number, y: number, txt: string, anchor: "start" | "end" | "middle" = "middle") => {
    const p = k(t, v, 0.35);
    if (p <= 0) return null;
    return (
      <g opacity={p}>
        <text x={x} y={y} textAnchor={anchor} fontFamily={FONT} fontWeight={800} fontSize={22} letterSpacing={2} fill={C.forest} stroke={C.paper} strokeWidth={6} paintOrder="stroke">{txt}</text>
      </g>
    );
  };
  const glow = (on: number) => (on > 0 ? { filter: `drop-shadow(0 0 ${8 * on}px rgba(242,209,78,0.9))` } : {});
  return (
    <svg width={w} height={w * 0.8} viewBox="0 0 1000 800" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="bmPons" cx="0.5" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#FFF8EA" />
          <stop offset="1" stopColor="#EAD9C0" />
        </radialGradient>
        <linearGradient id="bmMed" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F6EAD6" />
          <stop offset="1" stopColor="#E7D3B6" />
        </linearGradient>
        <radialGradient id="bmLobe" cx="0.5" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#F4ECE0" />
          <stop offset="1" stopColor="#E4D8C6" />
        </radialGradient>
      </defs>
      {/* frontal + temporal lobes (faint) */}
      <g opacity={0.9}>
        <path d="M498 18 C430 6 330 20 300 90 C280 140 300 200 330 230 C300 250 270 300 280 360 C290 400 330 420 360 410 C380 360 400 300 430 262 C460 230 480 200 490 150 Z" fill="url(#bmLobe)" stroke="#CDBEA6" strokeWidth={4} />
        <path d="M502 18 C570 6 670 20 700 90 C720 140 700 200 670 230 C700 250 730 300 720 360 C710 400 670 420 640 410 C620 360 600 300 570 262 C540 230 520 200 510 150 Z" fill="url(#bmLobe)" stroke="#CDBEA6" strokeWidth={4} />
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${330 + i * 18} ${70 + i * 46} C${380 + i * 10} ${60 + i * 50} ${420} ${100 + i * 40} ${460} ${90 + i * 46}`} stroke="#D9CBB3" strokeWidth={3} fill="none" />
        ))}
        {[0, 1, 2].map((i) => (
          <path key={"r" + i} d={`M${670 - i * 18} ${70 + i * 46} C${620 - i * 10} ${60 + i * 50} ${580} ${100 + i * 40} ${540} ${90 + i * 46}`} stroke="#D9CBB3" strokeWidth={3} fill="none" />
        ))}
      </g>
      {/* midbrain (cerebral peduncles) */}
      <path d="M432 262 C440 300 446 320 452 336 L548 336 C554 320 560 300 568 262 C540 250 460 250 432 262 Z" fill="url(#bmMed)" stroke={C.forest} strokeWidth={4} />
      <path d="M470 270 L478 334 M530 270 L522 334" stroke="#C9B391" strokeWidth={3} />
      {/* pons */}
      <ellipse cx={500} cy={398} rx={142} ry={76} fill="url(#bmPons)" stroke={C.forest} strokeWidth={4} />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${385 + i * 2} ${360 + i * 18} C440 ${352 + i * 20} 560 ${352 + i * 20} ${615 - i * 2} ${360 + i * 18}`} stroke="#D7C3A2" strokeWidth={2.5} fill="none" />
      ))}
      {/* medulla + spinal cord */}
      <path d="M432 470 C436 540 452 620 462 690 L462 780 L538 780 L538 690 C548 620 564 540 568 470 C540 480 460 480 432 470 Z" fill="url(#bmMed)" stroke={C.forest} strokeWidth={4} />
      <path d="M500 474 L500 780" stroke="#C9B391" strokeWidth={3} />
      <ellipse cx={478} cy={560} rx={9} ry={34} fill="#EBDDC6" stroke="#B9A27F" strokeWidth={2.5} />
      <ellipse cx={522} cy={560} rx={9} ry={34} fill="#EBDDC6" stroke="#B9A27F" strokeWidth={2.5} />
      <ellipse cx={449} cy={566} rx={11} ry={26} fill="#F2E6D2" stroke="#B9A27F" strokeWidth={2.5} />
      <ellipse cx={551} cy={566} rx={11} ry={26} fill="#F2E6D2" stroke="#B9A27F" strokeWidth={2.5} />
      {/* pituitary stalk + mammillary bodies (landmarks) */}
      <circle cx={500} cy={238} r={13} fill="#EED9C0" stroke="#B9A27F" strokeWidth={3} />
      <circle cx={488} cy={262} r={7} fill="#EED9C0" stroke="#B9A27F" strokeWidth={2} />
      <circle cx={512} cy={262} r={7} fill="#EED9C0" stroke="#B9A27F" strokeWidth={2} />

      {/* nerves */}
      {NERVES.map(({ n, r, name, type }) => {
        const p = k(t, lit[n], 0.5);
        if (p <= 0) return null;
        const h = hotK(n);
        const dm = isHot(n) ? 0 : dimK;
        const col = h > 0 ? C.banana : "#F3D98A";
        const sw = NP[n].w;
        const op = p * (1 - 0.72 * dm);
        const L = 900;
        const special = n === 1 || n === 2;
        return (
          <g key={n} opacity={op} style={glow(h)}>
            {special ? (
              n === 1 ? (
                <g>
                  {[-1, 1].map((s) => (
                    <g key={s}>
                      <path d={`M${500 + s * 44} 96 L${500 + s * 36} 206`} stroke={C.forest} strokeWidth={sw + 7} strokeLinecap="round" />
                      <path d={`M${500 + s * 44} 96 L${500 + s * 36} 206`} stroke={col} strokeWidth={sw} strokeLinecap="round" />
                      <ellipse cx={500 + s * 46} cy={82} rx={15} ry={30} fill={col} stroke={C.forest} strokeWidth={4} />
                    </g>
                  ))}
                </g>
              ) : (
                <g>
                  {[-1, 1].map((s) => (
                    <g key={s}>
                      <path d={`M${500 + s * 92} 150 L500 214 L${500 + s * 70} 262`} stroke={C.forest} strokeWidth={sw + 7} strokeLinejoin="round" strokeLinecap="round" fill="none" />
                      <path d={`M${500 + s * 92} 150 L500 214 L${500 + s * 70} 262`} stroke={col} strokeWidth={sw} strokeLinejoin="round" strokeLinecap="round" fill="none" />
                    </g>
                  ))}
                </g>
              )
            ) : null}
            {[-1, 1].map((s) => (
              <g key={s}>
                {!special && <path d={npath(n, s as 1 | -1)} stroke={C.forest} strokeWidth={sw + 7} fill="none" strokeLinecap="round" strokeDasharray={`${p * L} ${L}`} />}
                {!special && <path d={npath(n, s as 1 | -1)} stroke={col} strokeWidth={sw} fill="none" strokeLinecap="round" strokeDasharray={`${p * L} ${L}`} />}
                {special && (
                  <path d={n === 1 ? `M${500 + s * 58} 82 L${500 + s * (BX - 30 - 500)} ${NP[1].y}` : `M${500 + s * 92} 150 L${500 + s * (BX - 30 - 500)} ${NP[2].y}`} stroke={C.forest} strokeWidth={2.5} strokeDasharray="6 7" opacity={0.6} />
                )}
              </g>
            ))}
            {/* badges */}
            {[-1, 1].map((s) => {
              const cx = 500 + s * (BX - 500);
              const fill = tk > 0 ? TC[type] : C.card;
              return (
                <g key={"b" + s} transform={`translate(${cx} ${NP[n].y}) scale(${0.7 + 0.3 * p + 0.15 * h})`}>
                  <circle r={27} fill={h > 0 ? C.banana : fill} stroke={C.forest} strokeWidth={4} />
                  <text y={9} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={r.length > 3 ? 19 : r.length > 2 ? 22 : 25} fill={C.forest}>{r}</text>
                </g>
              );
            })}
            {(() => {
              const q = k(t, names[n], 0.35);
              if (q <= 0) return null;
              return (
                <text x={BX + 40} y={NP[n].y + 10} fontFamily={FONT} fontWeight={800} fontSize={28} fill={C.forest} opacity={q} stroke={C.paper} strokeWidth={6} paintOrder="stroke">{name}</text>
              );
            })()}
          </g>
        );
      })}
      {reg(regions.fore, 500, 132, "FOREBRAIN")}
      {reg(regions.mid, 500, 306, "MIDBRAIN")}
      {reg(regions.pons, 500, 406, "PONS")}
      {reg(regions.med, 500, 650, "MEDULLA")}
    </svg>
  );
};

/* ---------------------------------------------------------------------------------------------
 * 2. Right eye, front view, with its six movers + eyelid lifter, coloured by nerve
 * ------------------------------------------------------------------------------------------- */
export const EyeMovers: React.FC<{
  t: number; w?: number;
  show?: { sr?: number; ir?: number; mr?: number; io?: number; lps?: number; so?: number; lr?: number; pupil?: number };
  groups?: { iii?: number; iv?: number; vi?: number };
  hot?: { ids: string[]; a: number; b: number }[];
  look?: { a: number; dx: number; dy: number }[]; // gaze shifts
}> = ({ t, w = 700, show = {}, groups = {}, hot = [], look = [] }) => {
  const H = (id: string) => Math.max(0, ...hot.filter((h) => h.ids.includes(id)).map((h) => ramp(t, h.a, h.a + 0.3) * (1 - ramp(t, h.b, h.b + 0.3))));
  const g3 = k(t, groups.iii), g4 = k(t, groups.iv), g6 = k(t, groups.vi);
  const col = (id: string) => {
    if (["sr", "ir", "mr", "io", "lps"].includes(id)) return g3 > 0 ? mix(g3, "#D9D2C2", "#8FA86A") : "#D9D2C2";
    if (id === "so") return g4 > 0 ? mix(g4, "#D9D2C2", "#E39A5B") : "#D9D2C2";
    return g6 > 0 ? mix(g6, "#D9D2C2", "#6FA3D2") : "#D9D2C2";
  };
  let gx = 0, gy = 0;
  look.forEach((l) => {
    const p = ramp(t, l.a, l.a + 0.5);
    gx = gx + (l.dx - gx) * p;
    gy = gy + (l.dy - gy) * p;
  });
  const cx = 350, cy = 330;
  // muscles: [id, label, x, y, w, h, rot]
  const M: [string, string, number, number, number, number, number, number, number][] = [
    ["sr", "Superior rectus", cx, cy - 205, 120, 70, 0, cx, cy - 265],
    ["ir", "Inferior rectus", cx, cy + 205, 120, 70, 0, cx, cy + 290],
    ["mr", "Medial rectus", cx + 205, cy, 70, 120, 0, cx + 250, cy + 105],
    ["lr", "Lateral rectus", cx - 205, cy, 70, 120, 0, cx - 250, cy + 105],
  ];
  const lab = (x: number, y: number, txt: string, p: number, h: number, anchor = "middle") => (
    <g opacity={p}>
      <rect x={anchor === "middle" ? x - txt.length * 8.6 - 14 : anchor === "end" ? x - txt.length * 17.2 - 28 : x} y={y - 26} width={txt.length * 17.2 + 28} height={42} rx={12} fill={h > 0 ? C.banana : C.forest} />
      <text x={anchor === "middle" ? x : anchor === "end" ? x - 14 : x + 14} y={y + 3} textAnchor={anchor as any} fontFamily={FONT} fontWeight={800} fontSize={27} fill={h > 0 ? C.forest : C.paper}>{txt}</text>
    </g>
  );
  return (
    <svg width={w} height={w} viewBox="0 0 700 700" style={{ overflow: "visible" }}>
      {/* socket */}
      <ellipse cx={cx} cy={cy} rx={300} ry={290} fill="#EFE6D6" stroke="#D2C3A8" strokeWidth={4} />
      {/* eyelid lifter (levator) */}
      {(() => {
        const p = k(t, show.lps), h = H("lps");
        return (
          <g opacity={p}>
            <path d={`M${cx - 150} ${cy - 120} C${cx - 90} ${cy - 180} ${cx + 90} ${cy - 180} ${cx + 150} ${cy - 120} L${cx + 130} ${cy - 150} C${cx + 70} ${cy - 205} ${cx - 70} ${cy - 205} ${cx - 130} ${cy - 150} Z`} fill={h > 0 ? C.banana : col("lps")} stroke={C.forest} strokeWidth={4} />
            {lab(cx - 235, cy - 190, "Eyelid lifter", p, h)}
          </g>
        );
      })()}
      {M.map(([id, name, x, y, mw, mh, , lx, ly]) => {
        const p = k(t, (show as any)[id]), h = H(id);
        if (p <= 0) return null;
        return (
          <g key={id} opacity={p}>
            <rect x={x - mw / 2} y={y - mh / 2} width={mw} height={mh} rx={22} fill={h > 0 ? C.banana : col(id)} stroke={C.forest} strokeWidth={4} transform={`scale(1)`} />
            {[0, 1, 2].map((i) => (mw > mh ? <line key={i} x1={x - mw / 2 + 18} x2={x + mw / 2 - 18} y1={y - 16 + i * 16} y2={y - 16 + i * 16} stroke="rgba(31,42,20,0.25)" strokeWidth={3} /> : <line key={i} y1={y - mh / 2 + 18} y2={y + mh / 2 - 18} x1={x - 16 + i * 16} x2={x - 16 + i * 16} stroke="rgba(31,42,20,0.25)" strokeWidth={3} />))}
            {lab(lx, ly, name, p, h)}
          </g>
        );
      })}
      {/* obliques */}
      {(() => {
        const p = k(t, show.so), h = H("so");
        return (
          <g opacity={p}>
            <path d={`M${cx + 250} ${cy - 250} L${cx + 140} ${cy - 140}`} stroke={C.forest} strokeWidth={4} strokeDasharray="8 8" />
            <circle cx={cx + 250} cy={cy - 250} r={20} fill="none" stroke={C.forest} strokeWidth={6} />
            <rect x={cx + 80} y={cy - 175} width={110} height={44} rx={20} fill={h > 0 ? C.banana : col("so")} stroke={C.forest} strokeWidth={4} transform={`rotate(-45 ${cx + 135} ${cy - 153})`} />
            {lab(cx + 255, cy - 290, "Superior oblique", p, h, "middle")}
            <text x={cx + 288} y={cy - 238} fontFamily={FONT} fontWeight={800} fontSize={20} fill={C.matcha}>trochlea</text>
          </g>
        );
      })()}
      {(() => {
        const p = k(t, show.io), h = H("io");
        return (
          <g opacity={p}>
            <rect x={cx + 70} y={cy + 140} width={130} height={44} rx={20} fill={h > 0 ? C.banana : col("io")} stroke={C.forest} strokeWidth={4} transform={`rotate(35 ${cx + 135} ${cy + 162})`} />
            {lab(cx + 230, cy + 255, "Inferior oblique", p, h, "middle")}
          </g>
        );
      })()}
      {/* eyeball */}
      <circle cx={cx} cy={cy} r={150} fill="#FFFEF8" stroke={C.forest} strokeWidth={5} />
      <g transform={`translate(${gx * 60} ${gy * 60})`}>
        <circle cx={cx} cy={cy} r={64} fill="#7FA7B8" stroke={C.forest} strokeWidth={4} />
        {[...Array(14)].map((_, i) => (
          <line key={i} x1={cx + Math.cos((i / 14) * 6.283) * 30} y1={cy + Math.sin((i / 14) * 6.283) * 30} x2={cx + Math.cos((i / 14) * 6.283) * 60} y2={cy + Math.sin((i / 14) * 6.283) * 60} stroke="#5E8798" strokeWidth={3} />
        ))}
        <circle cx={cx} cy={cy} r={34 - 14 * k(t, show.pupil, 0.6)} fill={C.forest} />
        <circle cx={cx - 18} cy={cy - 20} r={9} fill="#fff" opacity={0.85} />
      </g>
      <text x={cx + 295} y={cy - 78} textAnchor="end" fontFamily={FONT} fontWeight={800} fontSize={22} fill={C.matcha} opacity={k(t, show.mr)}>nose side →</text>
      <text x={cx - 295} y={cy - 78} fontFamily={FONT} fontWeight={800} fontSize={22} fill={C.matcha} opacity={k(t, show.lr)}>← ear side</text>
    </svg>
  );
};
const mix = (p: number, a: string, b: string) => {
  const ha = parseInt(a.slice(1), 16), hb = parseInt(b.slice(1), 16);
  const ch = (s: number) => Math.round(((ha >> s) & 255) * (1 - p) + ((hb >> s) & 255) * p);
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
};

/* ---------------------------------------------------------------------------------------------
 * 3. Face (front): trigeminal skin zones V1/V2/V3, chewing muscle, or facial-nerve fan + smile
 * ------------------------------------------------------------------------------------------- */
export const Face: React.FC<{
  t: number; w?: number;
  v1?: number; v2?: number; v3?: number; chew?: number; fan?: number; smile?: number; frown?: number; brow?: number; tear?: number; hot?: { id: string; a: number; b: number }[]; zoneLabels?: number;
}> = ({ t, w = 640, v1, v2, v3, chew, fan, smile, frown, brow, tear, hot = [], zoneLabels }) => {
  const H = (id: string) => Math.max(0, ...hot.filter((h) => h.id === id).map((h) => ramp(t, h.a, h.a + 0.3) * (1 - ramp(t, h.b, h.b + 0.3))));
  const z1 = k(t, v1), z2 = k(t, v2), z3 = k(t, v3), ch = k(t, chew), fn = k(t, fan, 0.9);
  const sm = k(t, smile, 0.5) * (1 - k(t, frown, 0.4)), fr = k(t, frown, 0.4) * (1 - k(t, brow, 0.4)), br = k(t, brow, 0.4);
  const zl = k(t, zoneLabels);
  const chewing = ch > 0 ? Math.max(0, Math.sin((t - (chew || 0)) * 9)) * ch : 0;
  const zone = (d: string, p: number, c: string, id: string) => (p > 0 ? <path d={d} fill={c} opacity={(0.5 + 0.35 * H(id)) * p} stroke={H(id) > 0 ? C.forest : "none"} strokeWidth={5} /> : null);
  const mouthY = 505 + chewing * 10;
  const curve = 30 * sm - 22 * fr;
  return (
    <svg width={w} height={w * 1.1} viewBox="0 0 640 704" style={{ overflow: "visible" }}>
      <defs>
        <clipPath id="faceClip">
          <path d="M320 40 C160 40 110 160 112 290 C114 420 150 520 220 590 C260 630 290 650 320 652 C350 650 380 630 420 590 C490 520 526 420 528 290 C530 160 480 40 320 40 Z" />
        </clipPath>
      </defs>
      {/* ears + neck */}
      <ellipse cx={104} cy={330} rx={30} ry={62} fill={SKIN2} stroke={C.forest} strokeWidth={5} />
      <ellipse cx={536} cy={330} rx={30} ry={62} fill={SKIN2} stroke={C.forest} strokeWidth={5} />
      <path d="M230 600 L230 704 L410 704 L410 600" fill={SKIN} stroke={C.forest} strokeWidth={5} />
      <path d="M320 40 C160 40 110 160 112 290 C114 420 150 520 220 590 C260 630 290 650 320 652 C350 650 380 630 420 590 C490 520 526 420 528 290 C530 160 480 40 320 40 Z" fill={SKIN} stroke={C.forest} strokeWidth={6} />
      <g clipPath="url(#faceClip)">
        {zone("M100 30 L540 30 L540 250 C470 250 420 268 380 300 L345 400 L295 400 L260 300 C220 268 170 250 100 250 Z", z1, "#6FA3D2", "v1")}
        {zone("M100 250 C170 250 220 268 260 300 L295 400 L345 400 L380 300 C420 268 470 250 540 250 L540 410 C470 420 420 450 395 478 L245 478 C220 450 170 420 100 410 Z", z2, "#E7C35A", "v2")}
        {zone("M100 410 C170 420 220 450 245 478 L395 478 C420 450 470 420 540 410 L540 700 L100 700 Z", z3, "#E39A5B", "v3")}
        {/* chewing muscle (masseter) on the face's left side */}
        {ch > 0 && <path d="M150 360 C170 350 200 360 210 380 L232 540 C210 556 180 548 168 530 Z" fill={C.red} opacity={0.55 * ch * (0.7 + 0.3 * chewing)} stroke={C.redDark} strokeWidth={4} />}
      </g>
      {/* brows */}
      <path d={`M190 ${232 - 18 * br} Q235 ${212 - 26 * br + 10 * fr} 280 ${228 - 12 * br + 16 * fr}`} stroke={C.forest} strokeWidth={11} fill="none" strokeLinecap="round" />
      <path d={`M360 ${228 - 12 * br + 16 * fr} Q405 ${212 - 26 * br + 10 * fr} 450 ${232 - 18 * br}`} stroke={C.forest} strokeWidth={11} fill="none" strokeLinecap="round" />
      {/* eyes */}
      {[235, 405].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={282} rx={42} ry={22 - 5 * sm} fill="#FFFEF8" stroke={C.forest} strokeWidth={4} />
          <circle cx={x} cy={282} r={14} fill={C.forest} />
        </g>
      ))}
      {tear !== undefined && t > tear && <path d={`M405 ${312 + ((t - tear) * 60) % 90} q-10 18 0 26 q10 -8 0 -26`} fill="#8DC3E8" stroke={C.forest} strokeWidth={2} opacity={k(t, tear)} />}
      {/* nose */}
      <path d="M320 290 L300 395 C310 408 330 408 340 395" stroke={C.forest} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* mouth */}
      <path d={`M255 ${mouthY - curve * 0.3} Q320 ${mouthY + curve} 385 ${mouthY - curve * 0.3}`} stroke={C.forest} strokeWidth={9} fill="none" strokeLinecap="round" />
      {/* facial nerve fan from in front of the ear (right side of the picture = person's left) */}
      {fn > 0 && (
        <g>
          {[
            "M500 360 C470 300 440 240 410 190",
            "M500 360 C470 330 440 300 420 285",
            "M500 360 C470 380 440 410 410 440",
            "M500 360 C480 420 450 480 420 525",
            "M500 360 C495 450 470 540 440 620",
          ].map((d, i) => (
            <g key={i}>
              <path d={d} stroke={C.forest} strokeWidth={13} fill="none" strokeLinecap="round" strokeDasharray={`${fn * 400} 400`} />
              <path d={d} stroke={H("fan") > 0 ? C.banana : "#F3D98A"} strokeWidth={7} fill="none" strokeLinecap="round" strokeDasharray={`${fn * 400} 400`} />
            </g>
          ))}
          <circle cx={500} cy={360} r={13} fill={C.banana} stroke={C.forest} strokeWidth={4} />
        </g>
      )}
      {zl > 0 && (
        <g opacity={zl} fontFamily={FONT} fontWeight={800}>
          {[
            [320, 140, "V1 ophthalmic", z1],
            [440, 372, "V2 maxillary", z2],
            [320, 600, "V3 mandibular", z3],
          ].map(([x, y, s, p]) =>
            (p as number) > 0 ? (
              <g key={s as string} opacity={p as number}>
                <rect x={(x as number) - (s as string).length * 8.4 - 14} y={(y as number) - 27} width={(s as string).length * 16.8 + 28} height={42} rx={12} fill={C.forest} />
                <text x={x as number} y={(y as number) + 2} textAnchor="middle" fontSize={26} fill={C.paper}>{s}</text>
              </g>
            ) : null
          )}
        </g>
      )}
    </svg>
  );
};

/* ---------------------------------------------------------------------------------------------
 * 4. Tongue from above: front two-thirds vs back third (taste), + motor arrows (XII)
 * ------------------------------------------------------------------------------------------- */
export const Tongue: React.FC<{ t: number; w?: number; front?: number; back?: number; motor?: number; hot?: { id: string; a: number; b: number }[] }> = ({ t, w = 560, front, back, motor, hot = [] }) => {
  const H = (id: string) => Math.max(0, ...hot.filter((h) => h.id === id).map((h) => ramp(t, h.a, h.a + 0.3) * (1 - ramp(t, h.b, h.b + 0.3))));
  const f = k(t, front), b = k(t, back), m = k(t, motor);
  const wig = m > 0 ? Math.sin((t - (motor || 0)) * 5) * 10 * m : 0;
  return (
    <svg width={w} height={w * 1.15} viewBox="0 0 560 644" style={{ overflow: "visible" }}>
      <defs>
        <clipPath id="tg">
          <path d="M120 60 C120 40 440 40 440 60 L450 360 C450 520 380 600 280 600 C180 600 110 520 110 360 Z" />
        </clipPath>
      </defs>
      <g transform={`rotate(${wig * 0.4} 280 60)`}>
        <path d="M120 60 C120 40 440 40 440 60 L450 360 C450 520 380 600 280 600 C180 600 110 520 110 360 Z" fill="#E9A2A0" stroke={C.forest} strokeWidth={6} />
        <g clipPath="url(#tg)">
          <rect x={100} y={40} width={360} height={190} fill="#E39A5B" opacity={0.7 * b + 0.2 * H("back")} />
          <rect x={100} y={230} width={360} height={380} fill="#6FA3D2" opacity={0.7 * f + 0.2 * H("front")} />
          {[...Array(40)].map((_, i) => (
            <circle key={i} cx={140 + ((i * 73) % 290)} cy={250 + ((i * 131) % 320)} r={4} fill="rgba(31,42,20,0.18)" />
          ))}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <circle key={"v" + i} cx={200 + i * 27} cy={225 - Math.abs(i - 3) * 20} r={11} fill="#C97C7A" stroke="rgba(31,42,20,0.35)" strokeWidth={3} />
          ))}
        </g>
        <path d="M280 90 L280 560" stroke="rgba(31,42,20,0.3)" strokeWidth={4} />
        <line x1={100} y1={230} x2={460} y2={230} stroke={C.forest} strokeWidth={4} strokeDasharray="10 8" opacity={Math.max(f, b)} />
      </g>
      <g fontFamily={FONT} fontWeight={800}>
        <g opacity={b}><rect x={140} y={110} width={280} height={44} rx={12} fill={C.forest} /><text x={280} y={141} textAnchor="middle" fontSize={26} fill={C.paper}>back 1/3 → IX</text></g>
        <g opacity={f}><rect x={140} y={390} width={280} height={44} rx={12} fill={C.forest} /><text x={280} y={421} textAnchor="middle" fontSize={26} fill={C.paper}>front 2/3 → VII</text></g>
      </g>
      {m > 0 &&
        [-1, 1].map((s) => (
          <g key={s} opacity={m}>
            <path d={`M${280 + s * 230} 420 C${280 + s * 250} 360 ${280 + s * 250} 300 ${280 + s * 220} 250`} stroke={C.matcha} strokeWidth={12} fill="none" strokeLinecap="round" />
            <path d={`M${280 + s * 220} 250 l${s * -6} 34 M${280 + s * 220} 250 l${s * 30} 18`} stroke={C.matcha} strokeWidth={12} strokeLinecap="round" />
          </g>
        ))}
      {m > 0 && (
        <g opacity={m} fontFamily={FONT} fontWeight={800}>
          <rect x={150} y={612} width={260} height={46} rx={14} fill={C.matcha} />
          <text x={280} y={644} textAnchor="middle" fontSize={27} fill={C.paper}>movement → XII</text>
        </g>
      )}
    </svg>
  );
};

/* ---------------------------------------------------------------------------------------------
 * 5. Inner ear: cochlea (hearing) + semicircular canals (balance) and the two nerve parts
 * ------------------------------------------------------------------------------------------- */
export const InnerEar: React.FC<{ t: number; w?: number; nerve?: number; coch?: number; vest?: number }> = ({ t, w = 760, nerve, coch, vest }) => {
  const n = k(t, nerve, 0.6), c = k(t, coch), v = k(t, vest);
  const wave = (t * 3) % 1;
  const spiral = (() => {
    let d = "";
    for (let i = 0; i <= 120; i++) {
      const a = (i / 120) * Math.PI * 5;
      const r = 120 - i * 0.85;
      const x = 520 + Math.cos(a) * r, y = 470 + Math.sin(a) * r * 0.9;
      d += (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
    }
    return d;
  })();
  return (
    <svg width={w} height={w * 0.8} viewBox="0 0 760 608" style={{ overflow: "visible" }}>
      {/* canals */}
      <g opacity={0.45 + 0.55 * Math.max(v, 0.2)}>
        {[
          "M330 300 C250 280 220 140 300 100 C380 60 430 160 400 260",
          "M360 290 C380 200 480 150 530 200 C580 250 520 320 440 310",
          "M320 330 C230 360 180 300 200 240 C220 190 280 200 300 250",
        ].map((d, i) => (
          <g key={i}>
            <path d={d} stroke={C.forest} strokeWidth={34} fill="none" strokeLinecap="round" />
            <path d={d} stroke={v > 0 ? mix(v, "#EDE3D0", "#A98BD0") : "#EDE3D0"} strokeWidth={24} fill="none" strokeLinecap="round" />
          </g>
        ))}
        <ellipse cx={380} cy={330} rx={70} ry={52} fill={v > 0 ? mix(v, "#EDE3D0", "#A98BD0") : "#EDE3D0"} stroke={C.forest} strokeWidth={5} />
      </g>
      {/* cochlea */}
      <path d={spiral} stroke={C.forest} strokeWidth={40} fill="none" strokeLinecap="round" />
      <path d={spiral} stroke={c > 0 ? mix(c, "#EDE3D0", "#6FA3D2") : "#EDE3D0"} strokeWidth={30} fill="none" strokeLinecap="round" />
      {/* nerve to brainstem */}
      {n > 0 && (
        <g>
          <path d="M440 470 C330 500 220 520 60 520" stroke={C.forest} strokeWidth={26} fill="none" strokeLinecap="round" strokeDasharray={`${n * 500} 500`} />
          <path d="M440 470 C330 500 220 520 60 520" stroke={C.banana} strokeWidth={17} fill="none" strokeLinecap="round" strokeDasharray={`${n * 500} 500`} />
          <path d="M370 350 C330 420 260 490 200 512" stroke={C.forest} strokeWidth={20} fill="none" strokeLinecap="round" opacity={n} />
          <path d="M370 350 C330 420 260 490 200 512" stroke={C.banana} strokeWidth={12} fill="none" strokeLinecap="round" opacity={n} />
        </g>
      )}
      {c > 0 && [0, 1, 2].map((i) => <path key={i} d={`M${640 + i * 30 + wave * 30} 420 q14 50 0 100`} stroke={C.forest} strokeWidth={6} fill="none" opacity={c * (1 - (i + wave) / 3)} strokeLinecap="round" />)}
      <g fontFamily={FONT} fontWeight={800}>
        <g opacity={c}><rect x={445} y={590 - 30} width={310} height={46} rx={14} fill="#6FA3D2" stroke={C.forest} strokeWidth={4} /><text x={600} y={592} textAnchor="middle" fontSize={27} fill={C.forest}>cochlear → hearing</text></g>
        <g opacity={v}><rect x={125} y={30} width={340} height={46} rx={14} fill="#A98BD0" stroke={C.forest} strokeWidth={4} /><text x={295} y={62} textAnchor="middle" fontSize={27} fill={C.forest}>vestibular → balance</text></g>
        <g opacity={n}><text x={60} y={570} fontSize={24} fill={C.matcha}>← to the brainstem</text></g>
      </g>
    </svg>
  );
};

/* ---------------------------------------------------------------------------------------------
 * 6. The wandering vagus: head → neck → chest → abdomen
 * ------------------------------------------------------------------------------------------- */
export const VagusBody: React.FC<{ t: number; w?: number; start?: number; neck?: number; chest?: number; abd?: number; throat?: number; heart?: number; lungs?: number; gut?: number }> = ({ t, w = 520, start, neck, chest, abd, throat, heart, lungs, gut }) => {
  const s0 = k(t, start), nk = k(t, neck, 0.8), cs = k(t, chest, 0.8), ab = k(t, abd, 0.9);
  const th = k(t, throat), hr = k(t, heart), lg = k(t, lungs), gt = k(t, gut);
  const prog = Math.max(s0 * 0.08, nk * 0.32, cs * 0.62, ab * 1);
  const beat = hr > 0 ? 1 + 0.06 * Math.max(0, Math.sin(t * 6)) : 1;
  const V = "M300 150 C305 210 290 250 292 300 C294 350 300 380 300 430 C300 480 290 520 296 580 C300 640 310 690 300 760";
  return (
    <svg width={w} height={w * 1.65} viewBox="0 0 600 990" style={{ overflow: "visible" }}>
      {/* silhouette */}
      <circle cx={300} cy={110} r={92} fill={SKIN} stroke={C.forest} strokeWidth={6} />
      <path d="M255 190 L250 260 C170 270 110 300 95 360 L80 990 L520 990 L505 360 C490 300 430 270 350 260 L345 190 Z" fill={SKIN} stroke={C.forest} strokeWidth={6} strokeLinejoin="round" />
      {/* lungs */}
      <g opacity={0.5 + 0.5 * lg}>
        <path d="M280 330 C220 320 160 360 155 450 C150 530 170 600 230 600 C270 600 280 560 282 520 Z" fill={lg > 0 ? mix(lg, "#E9D9C6", "#F2B4AE") : "#E9D9C6"} stroke={C.forest} strokeWidth={4} transform={`translate(${-6 * lg * Math.sin(t * 2.5)} 0)`} />
        <path d="M320 330 C380 320 440 360 445 450 C450 530 430 600 370 600 C330 600 320 560 318 520 Z" fill={lg > 0 ? mix(lg, "#E9D9C6", "#F2B4AE") : "#E9D9C6"} stroke={C.forest} strokeWidth={4} transform={`translate(${6 * lg * Math.sin(t * 2.5)} 0)`} />
      </g>
      {/* heart */}
      <g transform={`translate(320 500) scale(${beat}) translate(-320 -500)`} opacity={0.55 + 0.45 * hr}>
        <path d="M320 560 C260 520 255 470 285 455 C305 445 318 460 322 472 C328 458 345 445 365 455 C392 470 385 520 320 560 Z" fill={hr > 0 ? mix(hr, "#E9D9C6", "#C9483C") : "#E9D9C6"} stroke={C.forest} strokeWidth={4} />
      </g>
      {/* stomach + intestine */}
      <g opacity={0.5 + 0.5 * gt}>
        <path d="M300 640 C350 630 400 650 400 700 C400 750 350 770 310 760 C280 752 290 720 320 715 C340 712 345 690 325 680 C305 672 300 660 300 640 Z" fill={gt > 0 ? mix(gt, "#E9D9C6", "#E7C35A") : "#E9D9C6"} stroke={C.forest} strokeWidth={4} />
        <path d="M200 800 C200 780 400 780 400 800 C400 830 230 830 230 860 C230 890 380 890 380 920 C380 945 220 945 210 930" stroke={gt > 0 ? mix(gt, "#D9C9B2", "#D9B52E") : "#D9C9B2"} strokeWidth={26} fill="none" strokeLinecap="round" />
      </g>
      {/* throat / larynx */}
      <g opacity={0.5 + 0.5 * th}>
        <rect x={282} y={210} width={36} height={60} rx={12} fill={th > 0 ? mix(th, "#E9D9C6", "#8FA86A") : "#E9D9C6"} stroke={C.forest} strokeWidth={4} />
      </g>
      {/* skull base exit */}
      <circle cx={300} cy={150} r={10} fill={C.forest} />
      {/* the nerve */}
      <path d={V} stroke={C.forest} strokeWidth={17} fill="none" strokeLinecap="round" strokeDasharray={`${prog * 700} 700`} />
      <path d={V} stroke={C.banana} strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray={`${prog * 700} 700`} />
      {/* branches */}
      {[
        ["M296 240 C280 236 270 236 262 240", th],
        ["M300 470 C310 480 316 490 320 500", hr],
        ["M296 420 C260 430 230 440 210 450", lg],
        ["M300 420 C340 430 370 440 390 450", lg],
        ["M298 640 C300 660 320 680 340 690", gt],
        ["M300 760 C280 800 260 820 240 840", gt],
      ].map(([d, p], i) => (
        <path key={i} d={d as string} stroke={C.banana} strokeWidth={7} fill="none" strokeLinecap="round" opacity={p as number} style={{ filter: "drop-shadow(0 0 2px #1F2A14)" }} />
      ))}
    </svg>
  );
};

/* ---------------------------------------------------------------------------------------------
 * 7. Head + shoulders: SCM turns the head, trapezius shrugs the shoulders (accessory nerve)
 * ------------------------------------------------------------------------------------------- */
export const Shrug: React.FC<{ t: number; w?: number; scm?: number; trap?: number; turn?: number; shrug?: number }> = ({ t, w = 700, scm, trap, turn, shrug }) => {
  const s = k(t, scm), tr = k(t, trap);
  const tu = turn !== undefined && t > turn ? Math.sin(Math.min(1, (t - turn) / 1.6) * Math.PI) : 0;
  const sh = shrug !== undefined && t > shrug ? Math.max(0, Math.sin(((t - shrug) / 1.1) * Math.PI)) * (t - shrug < 3.3 ? 1 : 0) : 0;
  const up = -34 * sh;
  return (
    <svg width={w} height={w * 0.86} viewBox="0 0 700 600" style={{ overflow: "visible" }}>
      {/* shoulders + trapezius */}
      <path d={`M40 600 C40 520 70 ${440 + up} 160 ${420 + up} L270 ${360 + up * 0.4} L430 ${360 + up * 0.4} L540 ${420 + up} C630 ${440 + up} 660 520 660 600 Z`} fill={SKIN} stroke={C.forest} strokeWidth={6} strokeLinejoin="round" />
      <path d={`M270 ${300} C240 ${360 + up * 0.5} 190 ${400 + up} 110 ${440 + up} L190 ${450 + up} L270 ${400 + up * 0.5} Z`} fill={tr > 0 ? mix(tr, SKIN2, "#E39A5B") : SKIN2} stroke={C.forest} strokeWidth={4} opacity={0.4 + 0.6 * Math.max(tr, 0.3)} />
      <path d={`M430 ${300} C460 ${360 + up * 0.5} 510 ${400 + up} 590 ${440 + up} L510 ${450 + up} L430 ${400 + up * 0.5} Z`} fill={tr > 0 ? mix(tr, SKIN2, "#E39A5B") : SKIN2} stroke={C.forest} strokeWidth={4} opacity={0.4 + 0.6 * Math.max(tr, 0.3)} />
      {/* neck */}
      <rect x={270} y={220} width={160} height={190} fill={SKIN} stroke={C.forest} strokeWidth={6} />
      {/* SCM bands: behind ear -> sternum/clavicle */}
      {[-1, 1].map((sd) => (
        <path key={sd} d={`M${350 + sd * 70} 236 C${350 + sd * 50} 300 ${350 + sd * 25} 360 ${350 + sd * 12} 405`} stroke={s > 0 ? mix(s, SKIN2, "#E39A5B") : SKIN2} strokeWidth={26} strokeLinecap="round" fill="none" opacity={0.4 + 0.6 * Math.max(s, 0.3)} />
      ))}
      {/* head (turns) */}
      <g transform={`translate(350 150) scale(${1 - 0.08 * Math.abs(tu)} 1) translate(-350 -150)`}>
        <ellipse cx={350} cy={140} rx={115} ry={135} fill={SKIN} stroke={C.forest} strokeWidth={6} />
        <g transform={`translate(${tu * 60} 0)`}>
          <ellipse cx={310} cy={130} rx={14} ry={10} fill={C.forest} />
          <ellipse cx={390} cy={130} rx={14} ry={10} fill={C.forest} />
          <path d="M350 140 L340 185 L358 185" stroke={C.forest} strokeWidth={5} fill="none" strokeLinecap="round" />
          <path d="M318 215 Q350 232 382 215" stroke={C.forest} strokeWidth={6} fill="none" strokeLinecap="round" />
        </g>
      </g>
      <g fontFamily={FONT} fontWeight={800}>
        <g opacity={s}><rect x={440} y={240} width={290} height={46} rx={14} fill={C.forest} /><text x={585} y={272} textAnchor="middle" fontSize={25} fill={C.paper}>SCM · turns the head</text></g>
        <g opacity={tr}><rect x={430} y={520} width={260} height={46} rx={14} fill={C.forest} /><text x={560} y={552} textAnchor="middle" fontSize={25} fill={C.paper}>trapezius · shrugs</text></g>
      </g>
    </svg>
  );
};

/** Plain generic study flashcard (not a product), flips between front and back */
export const StudyCard: React.FC<{ t: number; flip: number; front: string; back: string; w?: number }> = ({ t, flip, front, back, w = 560 }) => {
  const p = ramp(t, flip, flip + 0.6);
  const ang = p * 180;
  const showBack = ang > 90;
  return (
    <div style={{ width: w, height: w * 0.62, perspective: 1600 }}>
      <div style={{ width: "100%", height: "100%", transform: `rotateY(${ang}deg)`, transformStyle: "preserve-3d", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: showBack ? C.forest : C.card, border: `4px solid ${showBack ? C.forest : C.line}`, boxShadow: "0 20px 40px rgba(31,42,20,0.18)", transform: showBack ? "rotateY(180deg)" : "none", display: "flex", alignItems: "center", justifyContent: "center", padding: 40, boxSizing: "border-box", textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: showBack ? 44 : 58, color: showBack ? C.banana : C.forest, lineHeight: 1.15, whiteSpace: "pre-line" }}>
          {showBack ? back : front}
        </div>
      </div>
    </div>
  );
};
