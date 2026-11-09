import React from "react";
import { C, FONT, ramp } from "./kit";

/* Book Plume diagram: FRONT of the RIGHT ankle + dorsum of the foot (medial / big-toe side on the LEFT).
   The 6 structures crossing the front of the ankle, medial → lateral = left → right:
   T tibialis anterior · H extensor hallucis longus · V anterior tibial vessels · N deep fibular nerve · D extensor digitorum longus · P peroneus (fibularis) tertius
   viewBox 900 x 1100 */

export type K = "T" | "H" | "V" | "N" | "D" | "P";
export const ORDER: K[] = ["T", "H", "V", "N", "D", "P"];
export const COL: Record<K, string> = { T: "#E0644F", H: "#3E7C93", V: "#C9483C", N: "#F2D14E", D: "#8A5BA8", P: "#E89A3C" };
export const VEIN = "#4E6FA8";

/* where each structure crosses the ankle (under the superior extensor retinaculum), viewBox units */
export const AT: Record<K, [number, number]> = { T: [334, 430], H: [410, 432], V: [462, 434], N: [494, 434], D: [548, 432], P: [606, 432] };
/* other anchors */
export const ANCHOR = {
  DP: [392, 742] as [number, number], // dorsalis pedis pulse point
  SER: [450, 352] as [number, number], // superior extensor retinaculum
  IER: [470, 566] as [number, number], // inferior extensor retinaculum
  MM: [250, 470] as [number, number], // medial malleolus
  LM: [656, 520] as [number, number], // lateral malleolus
  BIG: [236, 1010] as [number, number],
  TOES: [500, 1000] as [number, number],
  M5: [690, 760] as [number, number],
  TAIN: [262, 690] as [number, number],
};

/* centre-lines */
const PATH: Record<K, string> = {
  T: "M 372 -40 C 368 120 350 300 334 430 C 322 520 296 600 262 690",
  H: "M 448 90 C 440 240 428 360 410 432 C 388 520 352 640 312 780 C 288 870 256 950 236 1030",
  V: "M 474 -40 C 472 160 470 330 462 434 C 452 540 424 650 392 742 L 372 800",
  N: "M 506 -40 C 504 160 502 330 494 434 C 484 540 452 650 418 742 L 400 790",
  D: "M 552 -40 C 552 160 552 330 548 432 C 546 500 548 560 552 620",
  P: "M 626 120 C 622 260 612 360 606 432 C 604 520 630 640 690 760",
};
/* EDL splits into 4 tendons to toes 2–5 */
const EDL4 = [
  "M 552 620 C 520 700 440 820 352 1022",
  "M 552 620 C 540 720 500 840 452 1032",
  "M 552 620 C 556 720 552 850 540 1016",
  "M 552 620 C 580 710 610 840 616 986",
];
const W: Record<K, number> = { T: 34, H: 22, V: 13, N: 10, D: 26, P: 18 };

const SKIN =
  "M 250 -60 L 650 -60 C 652 120 650 300 640 420 C 676 450 690 500 668 540 C 700 600 740 700 752 820 C 762 900 752 960 720 990 C 700 1010 660 1000 640 985 C 630 1020 600 1040 572 1030 C 560 1060 520 1068 498 1052 C 476 1072 432 1072 414 1050 C 396 1070 356 1070 340 1046 C 320 1080 260 1086 214 1062 C 176 1042 168 990 178 930 C 190 840 210 700 222 600 C 226 540 222 500 234 470 C 222 440 236 410 262 400 C 262 300 258 120 250 -60 Z";

const Band: React.FC<{ d: string; id: string; w: number; hi: number }> = ({ d, id, w, hi }) => (
  <g>
    {hi > 0 && <path d={d} stroke={C.banana} strokeWidth={w + 30 * hi} fill="none" strokeLinecap="round" opacity={0.7 * hi} />}
    <path d={d} stroke={C.forest} strokeWidth={w + 7} fill="none" strokeLinecap="round" opacity={0.55} />
    <path d={d} stroke="#F4EEDC" strokeWidth={w} fill="none" strokeLinecap="round" opacity={0.8} />
    <path d={d} stroke={`url(#fib${id})`} strokeWidth={w} fill="none" strokeLinecap="round" />
  </g>
);

export const Ankle: React.FC<{
  t: number;
  w: number;
  id: string;
  lit?: Partial<Record<K, number>>; // time each structure lights up
  hot?: K[];
  nums?: boolean;
  ret?: number; // highlight retinacula
  pulse?: number; // 0..1 dorsalis pedis pulse ring
  dp?: number; // 0..1 highlight the artery continuing on the foot as dorsalis pedis
}> = ({ t, w, id, lit = {}, hot = [], nums, ret = 0, pulse = 0, dp = 0 }) => {
  const h = (w * 1100) / 900;
  const on = (k: K) => (lit[k] === undefined ? 0 : ramp(t, lit[k]!, lit[k]! + 0.3));
  const beat = 0.5 + 0.5 * Math.sin(t * 7);
  const strand = (k: K) => {
    const p = on(k);
    const isHot = hot.includes(k);
    const col = COL[k];
    const ww = W[k] * (1 + 0.25 * p * (1 - ramp(t, (lit[k] ?? 0) + 0.3, (lit[k] ?? 0) + 0.7)));
    const paths = k === "D" ? [PATH.D, ...EDL4] : [PATH[k]];
    return (
      <g key={k}>
        {isHot && paths.map((d, i) => <path key={"h" + i} d={d} stroke={C.banana} strokeWidth={ww + 26 + 8 * beat} fill="none" strokeLinecap="round" opacity={0.45 + 0.2 * beat} />)}
        {k === "V" && (
          <>
            {/* two venae comitantes */}
            <path d={PATH.V} transform="translate(-11 0)" stroke={C.forest} strokeWidth={9} fill="none" strokeLinecap="round" />
            <path d={PATH.V} transform="translate(-11 0)" stroke={p > 0 ? VEIN : "#D9D2BC"} strokeWidth={5} fill="none" strokeLinecap="round" />
            <path d={PATH.V} transform="translate(11 0)" stroke={C.forest} strokeWidth={9} fill="none" strokeLinecap="round" />
            <path d={PATH.V} transform="translate(11 0)" stroke={p > 0 ? VEIN : "#D9D2BC"} strokeWidth={5} fill="none" strokeLinecap="round" />
          </>
        )}
        {paths.map((d, i) => (
          <g key={i}>
            {/* tendon sheath (synovial) */}
            {(k === "T" || k === "H" || k === "D" || k === "P") && <path d={d} stroke="#CFE2E8" strokeWidth={(i ? 12 : ww) + 12} fill="none" strokeLinecap="round" opacity={0.85} strokeDasharray={i ? "0" : "0"} />}
            <path d={d} stroke={C.forest} strokeWidth={(i ? 12 : ww) + 8} fill="none" strokeLinecap="round" />
            <path d={d} stroke={k === "N" ? "#EFE6C2" : k === "V" ? "#E7C9C0" : "#FBF8EE"} strokeWidth={i ? 12 : ww} fill="none" strokeLinecap="round" />
            <path d={d} stroke={col} strokeWidth={i ? 12 : ww} fill="none" strokeLinecap="round" opacity={p} />
            {/* sheen */}
            <path d={d} transform="translate(-3 0)" stroke="#fff" strokeWidth={(i ? 12 : ww) * 0.22} fill="none" strokeLinecap="round" opacity={k === "V" || k === "N" ? 0.35 : 0.45} />
          </g>
        ))}
      </g>
    );
  };
  return (
    <svg width={w} height={h} viewBox="0 0 900 1100" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <pattern id={`fib${id}`} width={12} height={12} patternUnits="userSpaceOnUse" patternTransform="rotate(-6)">
          <line x1={0} y1={6} x2={12} y2={6} stroke={C.forest} strokeWidth={1.6} opacity={0.32} />
        </pattern>
        <pattern id={`musc${id}`} width={12} height={12} patternUnits="userSpaceOnUse" patternTransform="rotate(84)">
          <line x1={0} y1={6} x2={12} y2={6} stroke="#7E2E26" strokeWidth={2.6} opacity={0.32} />
        </pattern>
        <pattern id={`spongy${id}`} width={22} height={22} patternUnits="userSpaceOnUse">
          <circle cx={5} cy={6} r={2.4} fill="#B9A97A" opacity={0.5} />
          <circle cx={15} cy={14} r={1.8} fill="#B9A97A" opacity={0.45} />
        </pattern>
        <radialGradient id={`skin${id}`} cx="45%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#FBF1E1" />
          <stop offset="100%" stopColor="#EED9BE" />
        </radialGradient>
        <clipPath id={`clip${id}`}>
          <path d={SKIN} />
        </clipPath>
      </defs>
      {/* skin silhouette */}
      <path d={SKIN} fill={`url(#skin${id})`} stroke="#C79B83" strokeWidth={12} />
      {/* toes */}
      {[
        [236, 985, 37, 75],
        [352, 990, 26, 62],
        [454, 998, 25, 62],
        [540, 984, 23, 56],
        [612, 952, 21, 50],
      ].map(([x, y, rx, ry], i) => (
        <ellipse key={"toe" + i} cx={x} cy={y} rx={rx} ry={ry} fill="#F6E6D0" opacity={0.95} stroke={C.forest} strokeWidth={4} />
      ))}
      <g clipPath={`url(#clip${id})`}>
        {/* bones seen through: tibia, fibula, talus, tarsals, metatarsals, phalanges */}
        <g opacity={0.9}>
          <path d="M 286 -60 L 560 -60 C 562 160 566 330 574 420 C 540 446 470 452 400 446 C 330 442 296 452 276 500 C 250 470 262 420 286 400 C 290 260 290 100 286 -60 Z" fill="#EFE6CC" stroke={C.forest} strokeWidth={4} />
          <path d="M 286 -60 L 560 -60 C 562 160 566 330 574 420 C 540 446 470 452 400 446 C 330 442 296 452 276 500 C 250 470 262 420 286 400 C 290 260 290 100 286 -60 Z" fill={`url(#spongy${id})`} />
          <path d="M 588 -60 L 636 -60 C 640 160 640 380 650 470 C 664 510 650 560 626 548 C 606 520 600 420 594 300 C 590 160 588 60 588 -60 Z" fill="#EFE6CC" stroke={C.forest} strokeWidth={4} />
          <path d="M 316 470 C 360 450 520 450 590 480 C 610 520 596 580 560 600 C 490 620 380 616 330 590 C 300 560 296 500 316 470 Z" fill="#EFE6CC" stroke={C.forest} strokeWidth={4} />
          <path d="M 300 610 C 380 630 520 636 640 620 C 676 660 690 700 700 740 C 600 760 420 766 268 744 C 266 700 276 650 300 610 Z" fill="#EFE6CC" stroke={C.forest} strokeWidth={4} opacity={0.9} />
          {[
            [262, 750, 232, 940],
            [330, 760, 336, 960],
            [430, 764, 444, 968],
            [530, 760, 536, 952],
            [640, 748, 616, 922],
          ].map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#E6DCC0" strokeWidth={i === 0 ? 46 : 32} strokeLinecap="round" />
          ))}
        </g>
        {/* muscle bellies in the leg (top) */}
        <path d="M 300 -60 L 420 -60 C 420 60 398 170 372 230 C 348 170 312 60 300 -60 Z" fill="#C9675B" stroke={C.forest} strokeWidth={4} />
        <path d="M 300 -60 L 420 -60 C 420 60 398 170 372 230 C 348 170 312 60 300 -60 Z" fill={`url(#musc${id})`} />
        <path d="M 520 -60 L 648 -60 C 646 80 640 200 622 300 C 600 220 580 200 556 230 C 538 120 526 40 520 -60 Z" fill="#C9675B" stroke={C.forest} strokeWidth={4} />
        <path d="M 520 -60 L 648 -60 C 646 80 640 200 622 300 C 600 220 580 200 556 230 C 538 120 526 40 520 -60 Z" fill={`url(#musc${id})`} />
        <path d="M 432 40 C 458 70 470 120 456 200 C 448 240 440 180 432 40 Z" fill="#C9675B" stroke={C.forest} strokeWidth={3} />
        {/* the 6 structures, lateral first so medial overlaps */}
        {(["P", "D", "N", "V", "H", "T"] as K[]).map(strand)}
        {/* dorsalis pedis highlight on the foot */}
        {dp > 0 && <path d="M 462 434 C 452 540 424 650 392 742 L 372 800" stroke={C.banana} strokeWidth={30 + 10 * beat} fill="none" strokeLinecap="round" opacity={0.55 * dp} />}
        {/* extensor retinacula: superior band + inferior Y */}
        <Band id={id} w={56} hi={ret} d="M 262 352 C 380 340 520 340 642 360" />
        <Band id={id} w={40} hi={ret} d="M 660 570 C 600 562 540 560 480 566 C 400 540 320 500 252 478" />
        <Band id={id} w={34} hi={ret} d="M 480 566 C 400 600 320 640 240 660" />
      </g>
      <path d={SKIN} fill="none" stroke={C.forest} strokeWidth={4} />
      {/* malleoli bumps */}
      <path d="M 236 470 C 222 440 236 410 262 400" stroke={C.forest} strokeWidth={4} fill="none" />
      {/* toenails */}
      {[
        [236, 1030, 24],
        [352, 1032, 16],
        [454, 1040, 15],
        [540, 1022, 14],
        [612, 986, 12],
      ].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.7} fill="#F6E4D6" stroke={C.forest} strokeWidth={3} opacity={0.9} />
      ))}
      {/* dorsalis pedis pulse */}
      {pulse > 0 && (
        <g transform={`translate(${ANCHOR.DP[0]} ${ANCHOR.DP[1]})`} opacity={pulse}>
          {[0, 0.33, 0.66].map((o, i) => {
            const ph = ((t * 1.2 + o) % 1);
            return <circle key={i} r={18 + 70 * ph} fill="none" stroke={C.red} strokeWidth={6} opacity={1 - ph} />;
          })}
          <circle r={16} fill={C.red} stroke={C.forest} strokeWidth={4} />
        </g>
      )}
      {/* running count badges at the ankle line */}
      {nums &&
        ORDER.map((k, i) => {
          const p = on(k);
          if (p <= 0) return null;
          const [x] = AT[k];
          const y = i % 2 ? 252 : 300;
          return (
            <g key={k} transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * p})`} opacity={p}>
              <circle r={22} fill={COL[k]} stroke={C.forest} strokeWidth={4} />
              <text y={9} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={k === "N" ? C.forest : C.paper}>{k}</text>
            </g>
          );
        })}
    </svg>
  );
};
