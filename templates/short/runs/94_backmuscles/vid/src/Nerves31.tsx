import React from "react";
import { C, FONT, ramp } from "./kit";

/**
 * Our own schematic of the base of the brain (inferior view: front at the top) with the 12 cranial nerve pairs.
 * viewBox 800 x 820, midline x = 400. Left-side nerves carry the Roman-numeral tags.
 */
export type NerveId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
export const NAMES = ["", "Olfactory", "Optic", "Oculomotor", "Trochlear", "Trigeminal", "Abducens", "Facial", "Vestibulocochlear", "Glossopharyngeal", "Vagus", "Accessory", "Hypoglossal"];

type Nerve = { id: NerveId; d: string; w: number; tag: [number, number] };
// paths drawn on the LEFT side, from brain outward; mirrored for the right side
export const NERVES: Nerve[] = [
  { id: 1, d: "M372 318 C368 260 362 200 356 150", w: 15, tag: [318, 118] },
  { id: 2, d: "M392 336 C372 318 340 296 300 282", w: 20, tag: [262, 272] },
  { id: 3, d: "M384 402 C352 398 314 392 272 384", w: 12, tag: [236, 380] },
  { id: 4, d: "M338 432 C312 430 280 428 236 428", w: 6, tag: [200, 428] },
  { id: 5, d: "M322 482 C292 478 254 474 196 474", w: 26, tag: [156, 474] },
  { id: 6, d: "M384 548 C352 540 314 530 262 524", w: 8, tag: [226, 524] },
  { id: 7, d: "M346 552 C312 558 270 566 200 568", w: 11, tag: [162, 570] },
  { id: 8, d: "M342 566 C306 578 262 592 196 606", w: 14, tag: [158, 612] },
  { id: 9, d: "M360 590 C330 604 290 622 226 642", w: 9, tag: [190, 650] },
  { id: 10, d: "M362 606 C334 626 296 650 240 680", w: 12, tag: [206, 692] },
  { id: 11, d: "M374 760 C366 724 344 716 300 724 C276 728 258 734 246 740", w: 9, tag: [210, 748] },
  { id: 12, d: "M378 628 C356 652 330 680 296 770", w: 10, tag: [282, 800] },
];

const Half: React.FC<{ mirror?: boolean; dimA: number }> = ({ mirror, dimA }) => (
  <g transform={mirror ? "translate(800 0) scale(-1 1)" : undefined} opacity={1 - 0.5 * dimA}>
    {/* cerebral hemisphere (inferior surface) */}
    <path
      d="M396 34 C330 26 248 40 188 92 C134 140 112 210 118 286 C120 316 130 338 150 352 C122 392 104 452 108 520 C112 600 140 668 196 722 C250 772 320 796 396 800 Z"
      fill="url(#n31brain)" stroke={C.forest} strokeWidth={5} strokeLinejoin="round"
    />
    {/* frontal lobe orbital gyri */}
    <g fill="none" stroke={C.forest} strokeWidth={2.6} strokeLinecap="round" opacity={0.32}>
      <path d="M352 70 C330 100 320 140 326 190" />
      <path d="M300 64 C280 96 270 140 282 178 C292 206 300 236 296 270" />
      <path d="M236 84 C214 120 206 164 222 204" />
      <path d="M180 140 C200 170 236 186 256 214 C270 236 262 268 240 290" />
      <path d="M150 230 C176 240 200 262 204 296" />
      <path d="M258 110 C240 130 248 150 270 160" />
      <path d="M330 238 C312 256 316 286 340 300" />
    </g>
    {/* lateral sulcus + temporal lobe */}
    <path d="M150 352 C190 340 228 330 262 336 C238 352 230 372 232 396" fill="none" stroke={C.forest} strokeWidth={4} strokeLinecap="round" />
    <path
      d="M262 336 C288 346 300 372 300 410 C300 470 296 520 300 566 C250 600 196 600 156 560 C128 520 124 456 140 410 C156 372 214 336 262 336 Z"
      fill="url(#n31temp)" stroke={C.forest} strokeWidth={4} strokeLinejoin="round"
    />
    <g fill="none" stroke={C.forest} strokeWidth={2.4} strokeLinecap="round" opacity={0.3}>
      <path d="M164 420 C200 430 240 440 284 438" />
      <path d="M150 478 C196 486 244 494 290 492" />
      <path d="M160 532 C200 540 240 546 292 540" />
      <path d="M262 360 C254 380 262 400 286 404" />
      <path d="M200 380 C214 396 216 414 204 430" />
    </g>
    {/* cerebellar hemisphere */}
    <path
      d="M392 612 C356 600 300 596 250 610 C196 626 170 664 178 708 C188 760 250 792 320 796 C356 798 384 790 396 776 Z"
      fill="url(#n31cb)" stroke={C.forest} strokeWidth={4.5} strokeLinejoin="round"
    />
    <g fill="none" stroke={C.forest} strokeWidth={2} strokeLinecap="round" opacity={0.34}>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <path key={i} d={`M${196 + i * 3} ${646 + i * 16} C${250 + i * 2} ${628 + i * 16} ${330} ${634 + i * 15} ${388} ${640 + i * 15}`} />
      ))}
    </g>
  </g>
);

export const BrainBase: React.FC<{
  t: number;
  w?: number;
  lit?: Partial<Record<NerveId, number>>; // time each nerve lights
  only?: NerveId; // dim everything except this nerve
  onlyAt?: number;
  tags?: number; // time the Roman numeral tags appear (sweep)
  allGlow?: number; // time all nerves pulse together
  allGlowEnd?: number;
  arrow?: number; // front-to-back arrow
}> = ({ t, w = 760, lit = {}, only, onlyAt = 0, tags, allGlow, allGlowEnd, arrow }) => {
  const h = (w * 820) / 800;
  const dimA = only ? ramp(t, onlyAt, onlyAt + 0.35) : 0;
  const ag = allGlow !== undefined ? ramp(t, allGlow, allGlow + 0.3) * (allGlowEnd !== undefined ? 1 - ramp(t, allGlowEnd - 0.4, allGlowEnd) : 1) * (0.7 + 0.3 * Math.sin((t - allGlow) * 6)) : 0;
  const arr = arrow !== undefined ? ramp(t, arrow, arrow + 0.9) : 0;
  const nerve = (n: Nerve, side: 0 | 1) => {
    const lt = lit[n.id];
    const p = Math.max(lt === undefined ? 0 : ramp(t, lt, lt + 0.25), ag);
    const pulse = lt === undefined ? 0 : Math.max(0, 1 - Math.abs(t - lt - 0.2) / 0.35);
    const faded = only && only !== n.id ? dimA : 0;
    return (
      <g key={`${n.id}-${side}`} transform={side ? "translate(800 0) scale(-1 1)" : undefined} opacity={1 - 0.75 * faded}>
        {p > 0 && <path d={n.d} stroke={C.banana} strokeWidth={n.w + 26 + 14 * pulse} fill="none" strokeLinecap="round" opacity={0.6 * p} filter="url(#n31glow)" />}
        <path d={n.d} stroke={C.forest} strokeWidth={n.w + 7} fill="none" strokeLinecap="round" />
        <path d={n.d} stroke="url(#n31nerve)" strokeWidth={n.w} fill="none" strokeLinecap="round" />
        <path d={n.d} stroke={C.banana} strokeWidth={n.w} fill="none" strokeLinecap="round" opacity={p} />
        {n.w > 10 && <path d={n.d} stroke="#FFFFFF" strokeWidth={Math.max(2, n.w * 0.18)} fill="none" strokeLinecap="round" opacity={0.45} transform="translate(0 -2)" />}
      </g>
    );
  };
  return (
    <svg width={w} height={h} viewBox="0 0 800 820" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="n31brain" cx="45%" cy="40%" r="75%">
          <stop offset="0%" stopColor="#FBF1E6" />
          <stop offset="70%" stopColor="#EED9C6" />
          <stop offset="100%" stopColor="#D9B9A0" />
        </radialGradient>
        <radialGradient id="n31temp" cx="45%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#F8EADD" />
          <stop offset="100%" stopColor="#E0C2AA" />
        </radialGradient>
        <radialGradient id="n31cb" cx="55%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#F3E2D2" />
          <stop offset="100%" stopColor="#D2AE95" />
        </radialGradient>
        <linearGradient id="n31stem" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#E3CBB6" />
          <stop offset="50%" stopColor="#FFF8EE" />
          <stop offset="100%" stopColor="#E3CBB6" />
        </linearGradient>
        <linearGradient id="n31nerve" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F4EBC8" />
          <stop offset="100%" stopColor="#D9C98E" />
        </linearGradient>
        <filter id="n31glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id="n31sh" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#1F2A14" floodOpacity="0.2" />
        </filter>
      </defs>
      <g filter="url(#n31sh)">
        <Half dimA={dimA} />
        <Half mirror dimA={dimA} />
      </g>
      {/* longitudinal fissure */}
      <path d="M400 36 L400 330" stroke={C.forest} strokeWidth={4} opacity={1 - 0.5 * dimA} />
      {/* brainstem */}
      <g opacity={1 - 0.45 * dimA}>
        {/* spinal cord */}
        <path d="M376 690 L380 820 L420 820 L424 690 Z" fill="url(#n31stem)" stroke={C.forest} strokeWidth={4.5} strokeLinejoin="round" />
        {/* medulla */}
        <path d="M352 560 C350 600 360 650 376 696 L424 696 C440 650 450 600 448 560 Z" fill="url(#n31stem)" stroke={C.forest} strokeWidth={4.5} strokeLinejoin="round" />
        <path d="M400 566 L400 820" stroke={C.forest} strokeWidth={3} opacity={0.55} />
        {/* olives */}
        <ellipse cx={366} cy={612} rx={11} ry={30} fill="#F4E4D4" stroke={C.forest} strokeWidth={3} />
        <ellipse cx={434} cy={612} rx={11} ry={30} fill="#F4E4D4" stroke={C.forest} strokeWidth={3} />
        {/* cerebral peduncles */}
        <path d="M352 420 C344 444 340 462 344 474 L456 474 C460 462 456 444 448 420 C430 408 370 408 352 420 Z" fill="url(#n31stem)" stroke={C.forest} strokeWidth={4} />
        {/* pons */}
        <path d="M310 506 C312 458 352 446 400 446 C448 446 488 458 490 506 C490 548 450 566 400 566 C350 566 310 548 310 506 Z" fill="url(#n31stem)" stroke={C.forest} strokeWidth={5} />
        <g fill="none" stroke={C.forest} strokeWidth={2} opacity={0.28}>
          {[466, 486, 506, 526, 546].map((y) => (
            <path key={y} d={`M${324} ${y} C360 ${y - 8} 440 ${y - 8} 476 ${y}`} />
          ))}
        </g>
        <path d="M400 452 L400 562" stroke={C.forest} strokeWidth={3} opacity={0.4} />
        {/* mammillary bodies + pituitary stalk */}
        <circle cx={388} cy={404} r={10} fill="#F4E4D4" stroke={C.forest} strokeWidth={3} />
        <circle cx={412} cy={404} r={10} fill="#F4E4D4" stroke={C.forest} strokeWidth={3} />
        <ellipse cx={400} cy={368} rx={20} ry={18} fill="#EBCFB9" stroke={C.forest} strokeWidth={3.5} />
        {/* olfactory bulbs */}
        <ellipse cx={354} cy={140} rx={15} ry={30} fill="#F4EBC8" stroke={C.forest} strokeWidth={4} />
        <ellipse cx={446} cy={140} rx={15} ry={30} fill="#F4EBC8" stroke={C.forest} strokeWidth={4} />
      </g>
      {/* optic chiasm */}
      {/* nerves */}
      {NERVES.map((n) => nerve(n, 1))}
      {NERVES.map((n) => nerve(n, 0))}
      {/* optic chiasm cross bar (drawn over both optic nerves) */}
      <path d="M380 340 L420 340" stroke={C.forest} strokeWidth={27} strokeLinecap="round" opacity={1 - 0.75 * (only && only !== 2 ? dimA : 0)} />
      <path d="M380 340 L420 340" stroke={lit[2] !== undefined && t >= lit[2] ? C.banana : "#EADFB4"} strokeWidth={20} strokeLinecap="round" opacity={1 - 0.75 * (only && only !== 2 ? dimA : 0)} />
      {/* Roman numeral tags (left side) */}
      {NERVES.map((n, i) => {
        const lt = lit[n.id];
        const tp = tags !== undefined ? ramp(t, tags + i * 0.06, tags + i * 0.06 + 0.25) : lt !== undefined ? ramp(t, lt, lt + 0.2) : 0;
        if (tp <= 0) return null;
        const on = (lt !== undefined && t >= lt) || ag > 0.3;
        const faded = only && only !== n.id ? dimA : 0;
        const r = ROMAN[n.id].length > 2 ? 29 : 25;
        return (
          <g key={n.id} transform={`translate(${n.tag[0]} ${n.tag[1]}) scale(${0.6 + 0.4 * tp})`} opacity={tp * (1 - 0.8 * faded)}>
            <rect x={-r - 6} y={-21} width={(r + 6) * 2} height={42} rx={21} fill={on ? C.banana : C.forest} stroke={on ? C.forest : C.paper} strokeWidth={3} />
            <text x={0} y={10} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={27} fill={on ? C.forest : C.paper}>{ROMAN[n.id]}</text>
          </g>
        );
      })}
      {/* front -> back arrow */}
      {arr > 0 && (
        <g opacity={Math.min(1, arr * 2)}>
          <path d={`M640 150 L640 ${150 + 560 * arr}`} stroke={C.red} strokeWidth={10} strokeLinecap="round" strokeDasharray="1 22" />
          <path d={`M620 ${130 + 560 * arr} L640 ${160 + 560 * arr} L660 ${130 + 560 * arr}`} stroke={C.red} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <g transform="translate(640 118)">
            <rect x={-72} y={-26} width={144} height={46} rx={23} fill={C.red} />
            <text x={0} y={7} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.paper}>FRONT</text>
          </g>
          <g transform={`translate(640 ${760})`} opacity={ramp(arr, 0.7, 1)}>
            <rect x={-64} y={-26} width={128} height={46} rx={23} fill={C.red} />
            <text x={0} y={7} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.paper}>BACK</text>
          </g>
        </g>
      )}
    </svg>
  );
};

/** Schematic body outline with the vagus "wandering" from the brainstem down to the abdomen (our own drawing). */
export const VagusPath: React.FC<{ t: number; t0: number; t1: number; w?: number }> = ({ t, t0, t1, w = 380 }) => {
  const h = (w * 760) / 400;
  const p = ramp(t, t0, t1);
  const L = 1000;
  const org = (a: number) => ramp(t, t0 + (t1 - t0) * a, t0 + (t1 - t0) * a + 0.3);
  return (
    <svg width={w} height={h} viewBox="0 0 400 760" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="v31body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFEF6" />
          <stop offset="100%" stopColor="#EFE9D2" />
        </linearGradient>
        <filter id="v31glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      {/* body outline */}
      <path
        d="M200 20 C246 20 272 54 272 100 C272 140 252 168 236 178 L238 214 C300 224 340 246 352 290 L362 560 C362 640 330 720 300 740 L100 740 C70 720 38 640 38 560 L48 290 C60 246 100 224 162 214 L164 178 C148 168 128 140 128 100 C128 54 154 20 200 20 Z"
        fill="url(#v31body)" stroke={C.forest} strokeWidth={5} strokeLinejoin="round"
      />
      {/* brain hint */}
      <path d="M150 92 C150 60 176 44 200 44 C226 44 250 60 250 92 C250 112 230 122 200 122 C170 122 150 112 150 92 Z" fill="#EED9C6" stroke={C.forest} strokeWidth={3} opacity={0.9} />
      {/* lungs */}
      <path d="M182 270 C150 270 104 300 98 380 C94 430 120 450 160 440 C182 434 186 410 186 380 Z" fill="#F2DCD2" stroke={C.forest} strokeWidth={3} opacity={0.35 + 0.65 * org(0.45)} />
      <path d="M218 270 C250 270 296 300 302 380 C306 430 280 450 240 440 C218 434 214 410 214 380 Z" fill="#F2DCD2" stroke={C.forest} strokeWidth={3} opacity={0.35 + 0.65 * org(0.45)} />
      {/* heart */}
      <path d="M206 392 C206 372 236 366 240 388 C244 410 222 428 206 444 C196 426 176 412 178 392 C180 372 206 372 206 392 Z" fill={C.red} stroke={C.forest} strokeWidth={3} opacity={0.3 + 0.7 * org(0.6)} />
      {/* stomach */}
      <path d="M210 500 C250 490 290 506 286 548 C282 590 240 610 206 596 C186 588 196 566 214 564 C236 562 246 544 232 530 C222 520 206 524 200 512 Z" fill="#EBC9A8" stroke={C.forest} strokeWidth={3} opacity={0.3 + 0.7 * org(0.85)} />
      {/* intestines hint */}
      <path d="M130 620 C150 600 180 640 200 616 C220 592 250 636 270 612" fill="none" stroke={C.forest} strokeWidth={3} opacity={0.25 + 0.5 * org(0.95)} />
      {/* the vagus: wandering path */}
      <path
        d="M196 118 C188 160 190 200 186 240 C182 280 196 300 190 340 C186 370 200 390 204 410 C210 440 196 470 204 500 C210 520 222 540 232 560"
        pathLength={L} fill="none" stroke={C.banana} strokeWidth={22} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - p)} filter="url(#v31glow)" opacity={0.8}
      />
      <path
        d="M196 118 C188 160 190 200 186 240 C182 280 196 300 190 340 C186 370 200 390 204 410 C210 440 196 470 204 500 C210 520 222 540 232 560"
        pathLength={L} fill="none" stroke={C.forest} strokeWidth={9} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - p)}
      />
      <path
        d="M196 118 C188 160 190 200 186 240 C182 280 196 300 190 340 C186 370 200 390 204 410 C210 440 196 470 204 500 C210 520 222 540 232 560"
        pathLength={L} fill="none" stroke={C.banana} strokeWidth={5} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - p)}
      />
      {/* little branches */}
      {[
        ["M188 310 C170 316 156 330 150 350", 0.45],
        ["M192 336 C214 340 226 352 230 368", 0.55],
        ["M200 400 C220 404 226 410 226 420", 0.65],
      ].map(([d, a], i) => (
        <path key={i} d={d as string} pathLength={100} fill="none" stroke={C.forest} strokeWidth={5} strokeLinecap="round" strokeDasharray={100} strokeDashoffset={100 * (1 - org(a as number))} />
      ))}
      {p > 0.98 && <circle cx={232} cy={560} r={12} fill={C.banana} stroke={C.forest} strokeWidth={4} />}
    </svg>
  );
};
