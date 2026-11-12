import React from "react";
import { C, FONT, ramp } from "./kit";

/* Book Plume diagrams for the larynx cartilages (short 88).
   Facts: StatPearls "Anatomy, Head and Neck: Larynx" (9 cartilages: 3 unpaired = thyroid, cricoid, epiglottis; 3 paired = arytenoid,
   corniculate, cuneiform; thyroid = largest, laminae meet in the laryngeal prominence "Adam's apple"; cricoid = only cartilage that
   completely encircles the airway, at C6; vocal folds attach in front to the thyroid cartilage, behind to the arytenoids; corniculates
   sit on the arytenoid apices; cuneiforms lie in the aryepiglottic folds). Gray 1918 Figs. 950, 951 (shapes).
   FrontLarynx: front view, viewBox 900 x 1000.   Exploded: posterior view, cartilages pulled apart, viewBox 900 x 1100.
   TopView: larynx seen from above (front at the top), viewBox 900 x 900. */

export type K = "EP" | "TH" | "CR" | "AR" | "CO" | "CU";
export const SINGLES: K[] = ["EP", "TH", "CR"];
export const PAIRS: K[] = ["AR", "CO", "CU"];
export const KCOL: Record<K, string> = { EP: "#F2C94C", TH: "#7FA33A", CR: "#C9483C", AR: "#5B86C9", CO: "#E8877A", CU: "#9C7CC8" };
export const KFG: Record<K, string> = { EP: C.forest, TH: C.paper, CR: C.paper, AR: C.paper, CO: C.forest, CU: C.paper };
export const KLET: Record<K, string> = { EP: "E", TH: "T", CR: "C", AR: "A", CO: "C", CU: "C" };
export const KNAME: Record<K, string> = { EP: "Epiglottis", TH: "Thyroid", CR: "Cricoid", AR: "Arytenoid", CO: "Corniculate", CU: "Cuneiform" };

export const mix = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return "#" + pa.map((v, i) => Math.round(v + (pb[i] - v) * Math.max(0, Math.min(1, k))).toString(16).padStart(2, "0")).join("");
};
const sp = (pts: [number, number][], close = false) => {
  const p = [...pts];
  if (close) p.push(p[0], p[1]);
  let d = `M ${p[0][0]} ${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[Math.max(0, i - 1)], p1 = p[i], p2 = p[i + 1], p3 = p[Math.min(p.length - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return close ? d + " Z" : d;
};
const mirror = (pts: [number, number][]) => pts.map(([x, y]) => [900 - x, y] as [number, number]);

type Lit = Partial<Record<string, number>>;
type Common = { t: number; w: number; id: string; lit?: Lit; hot?: string[]; dimRest?: number };
const useOn = (t: number, lit: Lit) => (k: string) => (lit[k] === undefined ? 0 : ramp(t, (lit[k] as number) - 0.05, (lit[k] as number) + 0.3));

const BASE = "#E3EAE2"; // hyaline cartilage, pale
const EDGE = "#4E5E43";

const Defs: React.FC<{ id: string }> = ({ id }) => (
  <defs>
    <filter id={`gl${id}`} x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation={12} />
    </filter>
    <linearGradient id={`cart${id}`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#F4F7F0" />
      <stop offset="0.55" stopColor="#DDE6DB" />
      <stop offset="1" stopColor="#BFCDBC" />
    </linearGradient>
    <linearGradient id={`bone${id}`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#FBF7EA" />
      <stop offset="1" stopColor="#D8CDAE" />
    </linearGradient>
    <linearGradient id={`shade${id}`} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#000" stopOpacity={0.16} />
      <stop offset="0.45" stopColor="#000" stopOpacity={0} />
      <stop offset="0.55" stopColor="#fff" stopOpacity={0.28} />
      <stop offset="1" stopColor="#000" stopOpacity={0.12} />
    </linearGradient>
    <pattern id={`fib${id}`} width={14} height={14} patternUnits="userSpaceOnUse" patternTransform="rotate(80)">
      <line x1={0} y1={0} x2={0} y2={14} stroke="#B7A98A" strokeWidth={2} opacity={0.55} />
    </pattern>
  </defs>
);

/* one cartilage shape that lights up */
const Part: React.FC<{ d: string; k: K | string; on: (k: string) => number; hotK: boolean; dim: number; id: string; base?: string; sw?: number; shade?: boolean; dash?: boolean }> = ({ d, k, on, hotK, dim, id, base, sw = 5, shade = true, dash }) => {
  const o = on(k);
  const col = (KCOL as Record<string, string>)[k] || "#BFCDBC";
  return (
    <g opacity={1 - dim * (1 - o) * (hotK ? 0 : 1)}>
      {hotK && o > 0 && <path d={d} fillRule="evenodd" fill={C.banana} opacity={0.75 * o} filter={`url(#gl${id})`} />}
      <path d={d} fillRule="evenodd" fill={o > 0.01 ? mix(base ? "#D9E2D6" : "#D9E2D6", col, o) : base || `url(#cart${id})`} stroke={EDGE} strokeWidth={sw} strokeLinejoin="round" strokeDasharray={dash ? "14 10" : undefined} />
      {shade && <path d={d} fillRule="evenodd" fill={`url(#shade${id})`} />}
      {hotK && o > 0 && <path d={d} fill="none" stroke={C.forest} strokeWidth={sw + 3} opacity={o} strokeLinejoin="round" />}
    </g>
  );
};

/* ---------- 1. FRONT VIEW ---------- */
const TH_R: [number, number][] = [[450, 318], [420, 270], [360, 250], [298, 256], [266, 206], [252, 188], [262, 222], [280, 276], [290, 380], [302, 470], [312, 536], [316, 600], [330, 566], [350, 548], [400, 552], [450, 570]];
const thyroidFront = sp([...TH_R, ...mirror(TH_R).reverse().slice(1)], true);
const HY = "M 300 168 Q 450 196 600 168 L 690 128 Q 712 122 716 136 Q 712 150 690 156 L 604 204 Q 450 236 296 204 L 210 156 Q 188 150 184 136 Q 188 122 210 128 Z";
const EPI_F = sp([[450, 360], [404, 300], [380, 200], [390, 112], [420, 78], [450, 72], [480, 78], [510, 112], [520, 200], [496, 300]], true);
const CR_ARCH = "M 322 612 Q 450 640 578 612 Q 596 640 588 668 Q 450 712 312 668 Q 304 640 322 612 Z";
const CR_LAM = "M 318 600 L 312 470 Q 450 440 588 470 L 582 600 Q 450 640 318 600 Z";

export const FA: Record<string, [number, number]> = { TH: [360, 430], PROM: [450, 312], NOTCH: [450, 300], CR: [450, 668], EP: [450, 120], HY: [450, 196], TR: [450, 830], CTM: [450, 588] };

export const FrontLarynx: React.FC<Common & { epi?: number; lam?: number }> = ({ t, w, id, lit = {}, hot = [], dimRest = 0, epi = 1, lam = 0 }) => {
  const on = useOn(t, lit);
  const isHot = (k: string) => hot.includes(k);
  const dimOther = (k: string) => (hot.length && !hot.includes(k) ? dimRest : 0);
  const rings = [720, 772, 824, 876, 928, 980];
  return (
    <svg width={w} height={(w * 1000) / 900} viewBox="0 0 900 1000" style={{ display: "block" }}>
      <Defs id={id} />
      {/* trachea */}
      <g opacity={1 - dimOther("TR")}>
        <rect x={336} y={690} width={228} height={330} fill="#C9B9A2" stroke={EDGE} strokeWidth={4} />
        {rings.map((y) => (
          <g key={y}>
            <rect x={330} y={y - 18} width={240} height={34} rx={14} fill={`url(#cart${id})`} stroke={EDGE} strokeWidth={4} />
            <rect x={330} y={y - 18} width={240} height={34} rx={14} fill={`url(#shade${id})`} />
          </g>
        ))}
      </g>
      {/* epiglottis behind (hidden line) */}
      {epi > 0 && (
        <g opacity={epi}>
          <Part d={EPI_F} k="EP" on={on} hotK={isHot("EP")} dim={dimOther("EP")} id={id} dash shade={false} sw={4} />
        </g>
      )}
      {/* cricoid lamina behind the thyroid (shown when asked) */}
      {lam > 0 && <g opacity={lam}><Part d={CR_LAM} k="CR" on={on} hotK={isHot("CR")} dim={dimOther("CR")} id={id} dash shade={false} sw={4} /></g>}
      {/* thyrohyoid membrane */}
      <g opacity={1 - dimOther("TM")}>
        <path d="M 296 200 Q 450 232 604 200 L 620 262 Q 540 250 450 300 Q 360 250 280 262 Z" fill="#E8DDC4" stroke={EDGE} strokeWidth={3} />
        <path d="M 296 200 Q 450 232 604 200 L 620 262 Q 540 250 450 300 Q 360 250 280 262 Z" fill={`url(#fib${id})`} />
      </g>
      {/* hyoid bone */}
      <g opacity={1 - dimOther("HY")}>
        <path d={HY} fill={`url(#bone${id})`} stroke={EDGE} strokeWidth={5} strokeLinejoin="round" />
      </g>
      {/* cricothyroid membrane */}
      <path d="M 392 560 Q 450 572 508 560 L 520 604 Q 450 620 380 604 Z" fill="#E8DDC4" stroke={EDGE} strokeWidth={3} opacity={1 - dimOther("CTM")} />
      {/* cricoid arch */}
      <Part d={CR_ARCH} k="CR" on={on} hotK={isHot("CR")} dim={dimOther("CR")} id={id} />
      {/* thyroid cartilage */}
      <Part d={thyroidFront} k="TH" on={on} hotK={isHot("TH")} dim={dimOther("TH")} id={id} />
      <g opacity={(1 - dimOther("TH")) * 0.9} fill="none" stroke={EDGE} strokeLinecap="round">
        <path d="M 450 304 L 450 560" strokeWidth={4} opacity={0.55} />
        <path d="M 446 306 Q 440 420 446 556" stroke="#fff" strokeWidth={6} opacity={0.5} />
        <path d="M 312 318 Q 340 430 372 548" strokeWidth={3.5} opacity={0.5} />
        <path d="M 588 318 Q 560 430 528 548" strokeWidth={3.5} opacity={0.5} />
      </g>
      {/* the bump: laryngeal prominence */}
      <ellipse cx={450} cy={318} rx={34} ry={22} fill="#fff" opacity={0.45 * (1 - dimOther("TH"))} />
    </svg>
  );
};

/* ---------- 2. EXPLODED, POSTERIOR VIEW ---------- */
const EPI_X = sp([[450, 318], [430, 270], [392, 170], [376, 90], [398, 46], [450, 34], [502, 46], [524, 90], [508, 170], [470, 270]], true);
const TH_X_R: [number, number][] = [[450, 410], [400, 372], [330, 362], [292, 368], [276, 322], [262, 300], [268, 340], [286, 386], [288, 470], [290, 560], [298, 618], [312, 640], [320, 604], [336, 588], [400, 592], [450, 620]];
const thyroidX = sp([...TH_X_R, ...mirror(TH_X_R).reverse().slice(1)], true);
const AR_L = "M 330 676 L 372 702 Q 392 752 404 810 L 360 822 Q 300 820 262 806 Q 296 760 330 676 Z";
const AR_R = "M 570 676 L 528 702 Q 508 752 496 810 L 540 822 Q 600 820 638 806 Q 604 760 570 676 Z";
const CO_L = "M 322 636 Q 340 644 344 676 L 318 680 Q 316 660 322 636 Z";
const CO_R = "M 578 636 Q 560 644 556 676 L 582 680 Q 584 660 578 636 Z";
const CU_L = "M 214 640 Q 232 630 238 650 Q 226 700 230 770 Q 220 776 212 770 Q 206 700 214 640 Z";
const CU_R = "M 686 640 Q 668 630 662 650 Q 674 700 670 770 Q 680 776 688 770 Q 694 700 686 640 Z";
const CR_X_RING = "M 270 990 Q 270 930 450 924 Q 630 930 630 990 Q 630 1056 450 1064 Q 270 1056 270 990 Z M 322 984 Q 326 956 450 952 Q 574 956 578 984 Q 574 1016 450 1020 Q 326 1016 322 984 Z";
const CR_X_HOLE = "M 322 984 Q 326 956 450 952 Q 574 956 578 984 Q 574 1016 450 1020 Q 326 1016 322 984 Z";
const CR_X_LAM = "M 300 972 L 330 860 Q 340 846 362 846 L 538 846 Q 560 846 570 860 L 600 972 Q 450 940 300 972 Z";

export const XA: Record<string, [number, number]> = { EP: [450, 170], TH: [450, 500], AR: [330, 760], AR2: [570, 760], CO: [332, 650], CO2: [568, 650], CU: [222, 700], CU2: [678, 700], CR: [450, 960] };

export const Exploded: React.FC<Common> = ({ t, w, id, lit = {}, hot = [], dimRest = 0 }) => {
  const on = useOn(t, lit);
  const isHot = (k: string) => hot.includes(k);
  const dimOther = (k: string) => (hot.length && !hot.includes(k) ? dimRest : 0);
  const P = (d: string, k: K, extra: Partial<React.ComponentProps<typeof Part>> = {}) => <Part d={d} k={k} on={on} hotK={isHot(k)} dim={dimOther(k)} id={id} {...extra} />;
  return (
    <svg width={w} height={(w * 1100) / 900} viewBox="0 0 900 1100" style={{ display: "block" }}>
      <Defs id={id} />
      {/* guide line: how they stack */}
      <line x1={450} y1={20} x2={450} y2={1080} stroke={C.matcha} strokeWidth={3} strokeDasharray="6 14" opacity={0.35} />
      {P(EPI_X, "EP")}
      <g opacity={(1 - dimOther("EP")) * 0.5} fill={EDGE}>
        {[[430, 110], [470, 130], [418, 170], [480, 190], [450, 230], [440, 80], [492, 96]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={5} />)}
      </g>
      {P(thyroidX, "TH")}
      <path d="M 450 412 L 450 616" stroke={EDGE} strokeWidth={3} opacity={0.4 * (1 - dimOther("TH"))} />
      {P(CU_L, "CU")}
      {P(CU_R, "CU")}
      {P(AR_L, "AR")}
      {P(AR_R, "AR")}
      {P(CO_L, "CO", { sw: 4 })}
      {P(CO_R, "CO", { sw: 4 })}
      {/* cricoid: ring + tall back plate (signet ring) */}
      {P(CR_X_LAM, "CR")}
      <path d={CR_X_HOLE} fill="#3A2C22" opacity={0.8 * (1 - dimOther("CR"))} />
      <g style={{ fillRule: "evenodd" } as React.CSSProperties}>{P(CR_X_RING, "CR")}</g>
    </svg>
  );
};

/* ---------- 3. VIEW FROM ABOVE: vocal cords ---------- */
export const TA: Record<string, [number, number]> = { TH: [450, 200], VF: [418, 440], VF2: [482, 440], AR: [372, 700], AR2: [528, 700], CR: [450, 815], RIMA: [450, 470] };
export const TopView: React.FC<Common & { cords?: number }> = ({ t, w, id, lit = {}, hot = [], dimRest = 0, cords = 1 }) => {
  const on = useOn(t, lit);
  const isHot = (k: string) => hot.includes(k);
  const dimOther = (k: string) => (hot.length && !hot.includes(k) ? dimRest : 0);
  const vf = on("VF");
  const TH_TOP = "M 450 178 L 236 520 L 272 546 L 450 240 L 628 546 L 664 520 Z";
  const CR_TOP = "M 450 330 Q 680 340 690 590 Q 690 800 450 850 Q 210 800 210 590 Q 220 340 450 330 Z M 450 380 Q 260 392 258 590 Q 262 740 450 770 Q 638 740 642 590 Q 640 392 450 380 Z";
  const ARL = "M 330 650 L 392 640 L 414 616 L 420 640 Q 412 700 380 742 Q 340 742 318 708 Z";
  const ARR = "M 570 650 L 508 640 L 486 616 L 480 640 Q 488 700 520 742 Q 560 742 582 708 Z";
  return (
    <svg width={w} height={w} viewBox="0 0 900 900" style={{ display: "block" }}>
      <Defs id={id} />
      <text x={450} y={120} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={C.matcha} letterSpacing={4}>FRONT</text>
      <text x={450} y={895} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={C.matcha} letterSpacing={4}>BACK</text>
      <path d={CR_TOP} fillRule="evenodd" fill={on("CR") > 0.01 ? mix("#D9E2D6", KCOL.CR, on("CR")) : `url(#cart${id})`} stroke={EDGE} strokeWidth={5} opacity={1 - dimOther("CR")} />
      {/* airway opening (rima glottidis) */}
      <path d="M 450 236 L 414 616 Q 450 660 486 616 Z" fill="#3A2C22" opacity={0.85} />
      <Part d={TH_TOP} k="TH" on={on} hotK={isHot("TH")} dim={dimOther("TH")} id={id} />
      <Part d={ARL} k="AR" on={on} hotK={isHot("AR")} dim={dimOther("AR")} id={id} />
      <Part d={ARR} k="AR" on={on} hotK={isHot("AR")} dim={dimOther("AR")} id={id} />
      {/* vocal folds: thyroid angle -> vocal processes of the arytenoids */}
      <g opacity={cords}>
        {isHot("VF") && vf > 0 && (
          <g filter={`url(#gl${id})`} opacity={0.8 * vf}>
            <path d="M 442 244 L 410 620" stroke={C.banana} strokeWidth={46} strokeLinecap="round" />
            <path d="M 458 244 L 490 620" stroke={C.banana} strokeWidth={46} strokeLinecap="round" />
          </g>
        )}
        {[["M 442 244 L 410 620"], ["M 458 244 L 490 620"]].map(([d], i) => (
          <g key={i}>
            <path d={d} stroke={EDGE} strokeWidth={26} strokeLinecap="round" />
            <path d={d} stroke={mix("#FFFDF4", "#FFF3C2", vf)} strokeWidth={18} strokeLinecap="round" />
          </g>
        ))}
      </g>
    </svg>
  );
};

/* cricoid as a signet ring vs a tracheal C-ring, side by side (answer card) */
export const Rings: React.FC<{ t: number; w: number; id: string; t0: number }> = ({ t, w, id, t0 }) => {
  const p = ramp(t, t0, t0 + 0.4);
  const q = ramp(t, t0 + 0.6, t0 + 1.0);
  return (
    <svg width={w} height={(w * 520) / 900} viewBox="0 0 900 520" style={{ display: "block" }}>
      <Defs id={id} />
      {/* cricoid: full ring, tall at the back */}
      <g transform={`translate(240 250) scale(${0.85 + 0.15 * p})`} opacity={p}>
        <path d="M -160 30 L -120 -100 Q -110 -118 -86 -118 L 86 -118 Q 110 -118 120 -100 L 160 30 Q 0 -6 -160 30 Z" fill={KCOL.CR} stroke={EDGE} strokeWidth={6} />
        <path d="M -160 30 L -120 -100 Q -110 -118 -86 -118 L 86 -118 Q 110 -118 120 -100 L 160 30 Q 0 -6 -160 30 Z" fill={`url(#shade${id})`} />
        <path d="M -128 40 Q -124 6 0 2 Q 124 6 128 40 Q 124 78 0 82 Q -124 78 -128 40 Z" fill="#3A2C22" opacity={0.85} />
        <path fillRule="evenodd" d="M -186 46 Q -186 -18 0 -24 Q 186 -18 186 46 Q 186 118 0 126 Q -186 118 -186 46 Z M -128 40 Q -124 6 0 2 Q 124 6 128 40 Q 124 78 0 82 Q -124 78 -128 40 Z" fill={KCOL.CR} stroke={EDGE} strokeWidth={6} />
        <text x={0} y={196} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={C.forest}>cricoid: FULL ring</text>
      </g>
      {/* tracheal ring: C-shaped, open at the back */}
      <g transform={`translate(680 300) scale(${0.85 + 0.15 * q})`} opacity={q}>
        <path d="M -60 -88 Q -150 -60 -150 10 Q -150 90 0 100 Q 150 90 150 10 Q 150 -60 60 -88 L 50 -50 Q 106 -30 106 10 Q 104 58 0 64 Q -104 58 -106 10 Q -106 -30 -50 -50 Z" fill="#D9E2D6" stroke={EDGE} strokeWidth={6} />
        <path d="M -50 -60 Q 0 -78 50 -60" stroke={C.red} strokeWidth={6} strokeDasharray="10 10" fill="none" />
        <text x={0} y={150} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill={C.forest}>trachea: C-ring</text>
        <text x={0} y={-104} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={C.red}>open at the back</text>
      </g>
    </svg>
  );
};
