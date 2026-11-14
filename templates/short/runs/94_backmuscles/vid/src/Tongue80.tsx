import React from "react";
import { C, FONT, ramp } from "./kit";

/* Book Plume diagram: tongue seen from the LEFT side (face to the screen left, like Gray's Fig. 1019).
   4 extrinsic muscles — "Go Have Some Pizza":
     G genioglossus  : superior mental spine (genial tubercle) inside the chin → fans into the whole underside of the tongue (+ hyoid) → protrudes ("sticks it out")
     H hyoglossus    : body + greater horn of the hyoid → up into the side of the tongue → depresses (pulls down)
     S styloglossus  : styloid process → down + forward along the side of the tongue → retracts + elevates (up and back)
     P palatoglossus : soft palate (palatine aponeurosis) → side of the tongue → elevates the back of the tongue; vagus nerve (pharyngeal plexus)
   All other tongue muscles: hypoglossal nerve (CN XII). Facts: TeachMeAnatomy "Muscles of the tongue"; Gray 1918 pp. 1129–1130, Figs. 1019–1020.
   viewBox 900 x 1000 */

export type M = "G" | "H" | "S" | "P";
export const LETTERS: M[] = ["G", "H", "S", "P"];
export const LCOL: Record<M, string> = { G: "#D9708C", H: "#E0A53A", S: "#4F9CC4", P: "#7FAE4E" };
export const MNAME: Record<M, string> = { G: "Genioglossus", H: "Hyoglossus", S: "Styloglossus", P: "Palatoglossus" };

const MUS = "#E7C3B5", MUS_EDGE = "#B27F6E", MUS_FIB = "#C99A8A";
const BONE_EDGE = "#9C8A5C";
const MUCO = "#EDB7AB", MUCO_EDGE = "#B9786A";

export const mix = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return "#" + pa.map((v, i) => Math.round(v + (pb[i] - v) * Math.max(0, Math.min(1, k))).toString(16).padStart(2, "0")).join("");
};

/* callout anchors (viewBox units) */
export const ANCHOR = {
  G: [300, 600] as [number, number],
  H: [560, 640] as [number, number],
  S: [640, 400] as [number, number],
  P: [598, 380] as [number, number],
  CHIN: [176, 640] as [number, number],
  HYOID: [440, 792] as [number, number],
  STYLOID: [742, 326] as [number, number],
  PALATE: [585, 300] as [number, number],
  TIP: [150, 420] as [number, number],
  DORSUM: [400, 322] as [number, number],
};

const MARKPOS: Record<M, [number, number]> = { G: [320, 590], H: [560, 650], S: [400, 432], P: [598, 330] };

const TONGUE =
  "M 138 420 C 150 372 236 326 384 316 C 524 306 614 362 654 440 C 684 510 674 592 644 640 C 594 692 502 700 420 680 C 330 656 250 592 200 522 C 172 484 136 462 138 420 Z";

/* genioglossus fan: from the genial tubercle (chin) into the tongue and down to the hyoid */
const G_FAN = "M 176 642 C 196 560 214 494 236 456 C 330 432 470 452 556 560 C 566 600 556 640 540 668 C 500 712 470 744 452 776 L 426 778 C 360 724 272 682 182 656 Z";
const G_FIB: [number, number][] = [[238, 462], [286, 446], [344, 440], [404, 446], [462, 470], [512, 512], [548, 566], [544, 636], [500, 704], [446, 770]];
/* hyoglossus: hyoid body + greater horn → up into the side of the tongue */
const H_D = "M 418 776 L 640 718 L 652 548 C 610 522 540 514 472 530 Z";
const H_FIB = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((k) => {
  const bx = 418 + (640 - 418) * k, by = 776 + (718 - 776) * k;
  const tx = 472 + (652 - 472) * k, ty = 530 + (548 - 530) * k;
  return `M ${bx} ${by - 6} L ${tx} ${ty + 8}`;
});
/* styloglossus: styloid process → along the side of the tongue to the tip */
const S_C = "M 740 330 C 688 378 624 420 540 432 C 440 446 320 428 214 428";
/* palatoglossus: soft palate → side of the tongue */
const P_C = "M 584 298 C 598 344 604 396 592 462";

type Props = {
  t: number;
  w: number;
  id: string;
  lit?: Partial<Record<M, number>>; // time each muscle lights up (undefined = neutral)
  hot?: M[];
  dim?: number; // 0..1 dims the non-lit muscles
  arrows?: Partial<Record<M, number>>; // time each pull arrow appears
  origins?: Partial<Record<"CHIN" | "HYOID" | "STYLOID" | "PALATE", number>>;
  nerve?: number; // 0..1 shows the CN XII / CN X tags
  mark?: Partial<Record<M, string>>;
};

const ARROW: Record<M, { a: [number, number]; b: [number, number]; text: string; tx: number; ty: number }> = {
  G: { a: [214, 368], b: [70, 368], text: "OUT", tx: 120, ty: 320 },
  H: { a: [700, 560], b: [700, 700], text: "DOWN", tx: 760, ty: 640 },
  S: { a: [520, 300], b: [640, 200], text: "UP + BACK", tx: 520, ty: 170 },
  P: { a: [668, 480], b: [668, 380], text: "LIFTS", tx: 780, ty: 420 },
};

export const Tongue: React.FC<Props> = ({ t, w, id, lit = {}, hot = [], dim = 0, arrows = {}, origins = {}, nerve = 0, mark = {} }) => {
  const h = (w * 1000) / 900;
  const st = (m: M) => {
    const t0 = lit[m];
    const on = t0 === undefined ? 0 : ramp(t, t0, t0 + 0.3);
    const isHot = hot.includes(m);
    const fade = on > 0 ? 1 : 1 - 0.65 * dim;
    return { on, isHot, fade, fill: mix(MUS, LCOL[m], on * 0.85), edge: on > 0 ? mix(MUS_EDGE, "#1F2A14", 0.5) : MUS_EDGE, fib: on > 0 ? mix(MUS_FIB, "#1F2A14", 0.25 * on) : MUS_FIB };
  };
  const g = st("G"), hy = st("H"), s = st("S"), p = st("P");
  const glow = (on: boolean) => (on ? `url(#glow${id})` : undefined);
  const pulse = 0.5 + 0.5 * Math.sin(t * 7);
  const Origin: React.FC<{ k: "CHIN" | "HYOID" | "STYLOID" | "PALATE"; label: string; dx: number; dy: number }> = ({ k, label, dx, dy }) => {
    const t0 = origins[k];
    if (t0 === undefined) return null;
    const q = ramp(t, t0, t0 + 0.25);
    if (q <= 0) return null;
    const [x, y] = ANCHOR[k];
    return (
      <g opacity={q}>
        <circle cx={x} cy={y} r={20 + 8 * pulse} fill="none" stroke={C.red} strokeWidth={5} opacity={0.6} />
        <circle cx={x} cy={y} r={12} fill={C.red} stroke={C.paper} strokeWidth={4} />
        <g transform={`translate(${x + dx} ${y + dy}) scale(${0.8 + 0.2 * q})`}>
          <rect x={-label.length * 11 - 18} y={-30} width={label.length * 22 + 36} height={54} rx={16} fill={C.red} />
          <text x={0} y={8} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={C.paper}>{label}</text>
        </g>
      </g>
    );
  };
  return (
    <svg width={w} height={h} viewBox="0 0 900 1000" style={{ overflow: "visible" }}>
      <defs>
        <filter id={`glow${id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feMorphology operator="dilate" radius={6} in="SourceAlpha" result="d" />
          <feFlood floodColor="#F2D14E" />
          <feComposite in2="d" operator="in" result="g" />
          <feGaussianBlur in="g" stdDeviation={3} result="gb" />
          <feMerge><feMergeNode in="gb" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id={`tg${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F3C4B9" />
          <stop offset="1" stopColor="#E3A194" />
        </linearGradient>
        <linearGradient id={`bn${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FBF5E3" />
          <stop offset="1" stopColor="#E6D9B4" />
        </linearGradient>
        <marker id={`ah${id}`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3.2" markerHeight="3.2" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={C.forest} />
        </marker>
        <clipPath id={`tc${id}`}><path d={TONGUE} /></clipPath>
      </defs>

      {/* skull base + styloid process */}
      <path d="M 610 96 L 900 96 L 900 196 L 826 196 C 806 178 784 176 764 186 C 740 176 700 168 664 160 Z" fill={`url(#bn${id})`} stroke={BONE_EDGE} strokeWidth={3} />
      <path d="M 778 186 L 800 192 L 748 330 C 744 338 734 336 736 326 Z" fill={`url(#bn${id})`} stroke={BONE_EDGE} strokeWidth={3} />
      <text x={760} y={140} fontFamily={FONT} fontWeight={700} fontSize={24} fill={C.forest} opacity={0.55}>skull base</text>

      {/* hard palate + upper incisor */}
      <path d="M 120 232 L 504 232 C 512 246 512 262 504 270 L 132 270 C 116 262 114 244 120 232 Z" fill={`url(#bn${id})`} stroke={BONE_EDGE} strokeWidth={3} />
      <path d="M 118 270 L 168 270 L 160 330 C 150 344 132 344 126 330 Z" fill="#FFFDF4" stroke={BONE_EDGE} strokeWidth={3} />
      <text x={250} y={259} fontFamily={FONT} fontWeight={700} fontSize={22} fill={C.forest} opacity={0.55}>hard palate</text>
      {/* soft palate + uvula */}
      <path d="M 500 232 C 566 232 616 270 634 332 C 644 366 634 390 616 388 C 598 386 590 346 562 306 C 542 282 522 272 502 270 Z" fill={MUCO} stroke={MUCO_EDGE} strokeWidth={3} />

      {/* mandible: chin (cut in the midline) + the removed side as a dashed ghost */}
      <path d="M 202 784 C 300 790 470 800 600 770 C 650 752 670 700 676 640 L 706 310" fill="none" stroke={BONE_EDGE} strokeWidth={4} strokeDasharray="14 12" opacity={0.55} />
      <text x={470} y={846} fontFamily={FONT} fontWeight={700} fontSize={22} fill={C.forest} opacity={0.5}>jaw (cut away)</text>
      <path d="M 100 492 C 92 560 94 664 112 734 C 124 776 164 794 204 784 L 218 744 C 194 704 180 646 176 586 C 174 544 172 510 168 488 Z" fill={`url(#bn${id})`} stroke={BONE_EDGE} strokeWidth={3} />
      <path d="M 116 492 L 162 488 L 168 432 C 160 416 128 416 122 432 Z" fill="#FFFDF4" stroke={BONE_EDGE} strokeWidth={3} />

      {/* hyoid: body + greater horn */}
      <path d="M 404 790 C 404 768 478 762 486 784 L 640 724 C 652 720 660 736 648 742 L 482 810 C 470 820 404 818 404 790 Z" fill={`url(#bn${id})`} stroke={BONE_EDGE} strokeWidth={3} />

      {/* tongue body */}
      <path d={TONGUE} fill={`url(#tg${id})`} stroke={MUCO_EDGE} strokeWidth={4} />
      <g clipPath={`url(#tc${id})`} opacity={0.5}>
        {Array.from({ length: 26 }).map((_, i) => {
          const x = 170 + i * 18;
          const y = 330 + Math.pow((x - 400) / 250, 2) * 60 - (x > 560 ? 0 : 0);
          return <circle key={i} cx={x} cy={y + 6} r={4} fill={MUCO_EDGE} />;
        })}
      </g>

      {/* G: genioglossus fan */}
      <g opacity={g.fade} filter={glow(g.isHot)}>
        <path d={G_FAN} fill={g.fill} stroke={g.edge} strokeWidth={3} />
        {G_FIB.map(([x, y], i) => (
          <path key={i} d={`M 178 644 Q ${(178 + x) / 2 + 10} ${(644 + y) / 2 + 20} ${x} ${y}`} stroke={g.fib} strokeWidth={3} fill="none" />
        ))}
      </g>
      {/* H: hyoglossus */}
      <g opacity={hy.fade} filter={glow(hy.isHot)}>
        <path d={H_D} fill={hy.fill} stroke={hy.edge} strokeWidth={3} />
        {H_FIB.map((d, i) => <path key={i} d={d} stroke={hy.fib} strokeWidth={3} />)}
      </g>
      {/* P: palatoglossus (drawn before styloglossus: it lies deeper at the side) */}
      <g opacity={p.fade} filter={glow(p.isHot)}>
        <path d={P_C} stroke={p.edge} strokeWidth={34} strokeLinecap="round" fill="none" />
        <path d={P_C} stroke={p.fill} strokeWidth={27} strokeLinecap="round" fill="none" />
        <path d={P_C} stroke={p.fib} strokeWidth={3} fill="none" transform="translate(-6 0)" />
        <path d={P_C} stroke={p.fib} strokeWidth={3} fill="none" transform="translate(6 0)" />
      </g>
      {/* S: styloglossus */}
      <g opacity={s.fade} filter={glow(s.isHot)}>
        <path d={S_C} stroke={s.edge} strokeWidth={36} strokeLinecap="round" fill="none" />
        <path d={S_C} stroke={s.fill} strokeWidth={29} strokeLinecap="round" fill="none" />
        <path d={S_C} stroke={s.fib} strokeWidth={3} fill="none" transform="translate(0 -7)" />
        <path d={S_C} stroke={s.fib} strokeWidth={3} fill="none" transform="translate(0 7)" />
      </g>

      {/* nerve tags (answer) */}
      {nerve > 0 && (
        <g opacity={nerve}>
          {([["G", 300, 560], ["H", 560, 650], ["S", 380, 430]] as [M, number, number][]).map(([m, x, y]) => (
            <g key={m} transform={`translate(${x} ${y})`}>
              <rect x={-58} y={-24} width={116} height={46} rx={14} fill={C.forest} />
              <text x={0} y={10} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={C.paper}>CN XII</text>
            </g>
          ))}
          <g transform="translate(700 470)">
            <rect x={-82} y={-28} width={164} height={54} rx={16} fill={C.red} stroke={C.banana} strokeWidth={5} />
            <text x={0} y={11} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill={C.paper}>CN X ✓</text>
          </g>
          <path d="M 620 470 L 598 430" stroke={C.red} strokeWidth={6} strokeLinecap="round" />
        </g>
      )}

      {/* pull arrows */}
      {(Object.keys(arrows) as M[]).map((m) => {
        const t0 = arrows[m]!;
        const q = ramp(t, t0, t0 + 0.35);
        if (q <= 0) return null;
        const A = ARROW[m];
        const bx = A.a[0] + (A.b[0] - A.a[0]) * q, by = A.a[1] + (A.b[1] - A.a[1]) * q;
        return (
          <g key={m} opacity={Math.min(1, q * 2)}>
            <line x1={A.a[0]} y1={A.a[1]} x2={bx} y2={by} stroke={C.paper} strokeWidth={30} strokeLinecap="round" />
            <line x1={A.a[0]} y1={A.a[1]} x2={bx} y2={by} stroke={C.forest} strokeWidth={16} strokeLinecap="round" markerEnd={`url(#ah${id})`} />
            <g transform={`translate(${A.tx} ${A.ty})`} opacity={ramp(t, t0 + 0.2, t0 + 0.4)}>
              <rect x={-A.text.length * 12 - 18} y={-32} width={A.text.length * 24 + 36} height={58} rx={18} fill={LCOL[m]} stroke={C.forest} strokeWidth={4} />
              <text x={0} y={10} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill={C.forest}>{A.text}</text>
            </g>
          </g>
        );
      })}

      <Origin k="CHIN" label="chin" dx={-6} dy={110} />
      <Origin k="HYOID" label="hyoid" dx={-150} dy={40} />
      <Origin k="STYLOID" label="styloid" dx={40} dy={80} />
      <Origin k="PALATE" label="soft palate" dx={140} dy={-90} />

      {(Object.keys(mark) as M[]).map((m) => {
        const [x, y] = MARKPOS[m];
        return (
          <g key={m} transform={`translate(${x} ${y})`}>
            <circle r={30} fill={LCOL[m]} stroke={C.forest} strokeWidth={4} />
            <text y={12} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={C.forest}>{mark[m]}</text>
          </g>
        );
      })}
    </svg>
  );
};

/* coronal section of the tongue: the 4 intrinsic muscles. viewBox 900 x 700 */
export type IM = "SL" | "IL" | "TV" | "VE";
export const ICOL: Record<IM, string> = { SL: "#9C7FC6", IL: "#D9708C", TV: "#E0A53A", VE: "#4F9CC4" };
const SEC = "M 140 610 C 104 420 190 172 450 156 C 710 172 796 420 760 610 C 640 650 260 650 140 610 Z";
export const Section: React.FC<{ t: number; w: number; id: string; lit: Partial<Record<IM, number>>; hot?: IM[]; squeeze?: number }> = ({ t, w, id, lit, hot = [], squeeze = 0 }) => {
  const h = (w * 700) / 900;
  const on = (k: IM) => (lit[k] === undefined ? 0 : ramp(t, lit[k]!, lit[k]! + 0.3));
  const col = (k: IM) => mix("#C99A8A", ICOL[k], on(k));
  const op = (k: IM) => 0.35 + 0.65 * on(k);
  const sw = (k: IM) => (hot.includes(k) ? 1.6 : 1);
  return (
    <svg width={w} height={h} viewBox="0 0 900 700" style={{ overflow: "visible" }}>
      <defs>
        <clipPath id={`sc${id}`}><path d={SEC} /></clipPath>
        <linearGradient id={`sg${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F6D5CB" />
          <stop offset="1" stopColor="#EBB9AC" />
        </linearGradient>
      </defs>
      <g transform={`translate(450 400) scale(${1 - 0.12 * squeeze} ${1 + 0.1 * squeeze}) translate(-450 -400)`}>
        <path d={SEC} fill={`url(#sg${id})`} stroke={MUCO_EDGE} strokeWidth={5} />
        <g clipPath={`url(#sc${id})`}>
          {/* vertical fibres */}
          <g opacity={op("VE")}>
            {Array.from({ length: 13 }).map((_, i) => {
              const x = 216 + i * 39;
              if (Math.abs(x - 450) < 14) return null;
              return <line key={i} x1={x} y1={250} x2={x} y2={560} stroke={col("VE")} strokeWidth={7 * sw("VE")} strokeLinecap="round" />;
            })}
          </g>
          {/* transverse fibres */}
          <g opacity={op("TV")}>
            {Array.from({ length: 7 }).map((_, i) => {
              const y = 300 + i * 38;
              return <line key={i} x1={150} y1={y} x2={750} y2={y} stroke={col("TV")} strokeWidth={8 * sw("TV")} strokeLinecap="round" />;
            })}
          </g>
          {/* superior longitudinal: band under the dorsum, fibres cut across = dots */}
          <path d="M 170 330 C 220 210 330 182 450 178 C 570 182 680 210 730 330 L 700 340 C 650 250 560 222 450 220 C 340 222 250 250 200 340 Z" fill={col("SL")} opacity={op("SL")} />
          {Array.from({ length: 15 }).map((_, i) => {
            const a = Math.PI * (0.06 + (i / 14) * 0.88);
            return <circle key={i} cx={450 - Math.cos(a) * 250} cy={330 - Math.sin(a) * 128} r={7 * sw("SL")} fill="#FFFDF4" opacity={op("SL")} />;
          })}
          {/* inferior longitudinal: 2 bundles low on each side */}
          {[300, 600].map((x) => (
            <g key={x} opacity={op("IL")}>
              <ellipse cx={x} cy={548} rx={64 * (hot.includes("IL") ? 1.12 : 1)} ry={40} fill={col("IL")} stroke={C.forest} strokeWidth={3} />
              {[-30, 0, 30].map((dx) => [-12, 12].map((dy) => <circle key={`${dx}${dy}`} cx={x + dx} cy={548 + dy} r={7} fill="#FFFDF4" />))}
            </g>
          ))}
        </g>
        {/* septum */}
        <line x1={450} y1={190} x2={450} y2={620} stroke={C.forest} strokeWidth={6} strokeDasharray="12 10" opacity={0.6} />
      </g>
    </svg>
  );
};
