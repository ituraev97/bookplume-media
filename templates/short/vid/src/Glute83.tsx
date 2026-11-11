import React from "react";
import { C, FONT, ramp } from "./kit";

/* Book Plume diagram: RIGHT gluteal region, BACK view (medial / sacrum = viewer's LEFT, lateral / greater trochanter = viewer's RIGHT,
   same orientation as Gray's Fig. 832). Gluteus maximus removed (can be faded back in). Piriformis runs from the sacrum to the
   greater trochanter and splits the greater sciatic foramen: superior gluteal nerve leaves ABOVE it; inferior gluteal, sciatic,
   posterior femoral cutaneous and pudendal leave BELOW it. Pudendal hooks around the ischial spine back in (lesser sciatic foramen)
   to the perineum. Superior gluteal → gluteus medius + minimus (+ TFL); inferior gluteal → gluteus maximus. viewBox 860 x 900. */

export type N = "SG" | "IG" | "SC" | "PF" | "PU";
export const NS: N[] = ["SG", "IG", "SC", "PF", "PU"];
export const NLET: Record<N, string> = { SG: "S", IG: "I", SC: "S", PF: "P", PU: "P" };
export const NCOL: Record<N, string> = { SG: "#E0644F", IG: "#3E7C93", SC: "#D49A12", PF: "#8E5BA8", PU: "#6E8F35" };
export const NNAME: Record<N, string> = { SG: "Superior gluteal", IG: "Inferior gluteal", SC: "Sciatic", PF: "Posterior femoral cutaneous", PU: "Pudendal" };
export const NSHORT: Record<N, string> = { SG: "Superior gluteal", IG: "Inferior gluteal", SC: "Sciatic", PF: "Post. femoral cutaneous", PU: "Pudendal" };
export const ANCHOR: Record<N | "PIR" | "TROCH" | "TUB" | "MED" | "MAX" | "SPINE" | "SAC", [number, number]> = {
  SG: [520, 232],
  IG: [508, 418],
  SC: [452, 640],
  PF: [384, 700],
  PU: [196, 560],
  PIR: [470, 372],
  TROCH: [716, 430],
  TUB: [292, 590],
  MED: [420, 140],
  MAX: [470, 470],
  SPINE: [262, 450],
  SAC: [120, 250],
};

const SKIN = "M 70 40 C 300 14 600 26 730 80 C 816 190 830 330 792 460 C 760 570 706 720 690 900 L 270 900 C 262 780 206 660 160 580 C 96 470 60 300 70 40 Z";
const SACRUM = "M 40 70 L 214 84 C 226 180 214 280 186 360 C 166 412 136 440 100 452 L 40 452 Z";
const ILIUM = "M 206 96 C 262 52 410 30 548 58 C 634 76 676 128 656 186 C 624 252 540 284 482 300 C 430 312 360 304 300 300 C 258 296 226 266 216 226 Z";
const ISCHIUM = "M 214 418 C 266 426 318 462 336 520 C 350 576 326 616 292 620 C 250 622 226 588 230 548 C 232 510 226 470 214 418 Z";
const FORAMEN = "M 214 296 C 280 306 360 308 432 318 C 432 362 410 404 368 424 C 322 440 262 438 222 424 C 216 380 214 340 214 296 Z";
const FEMUR = "M 620 378 C 660 356 728 366 740 418 C 748 468 712 500 700 524 C 680 644 660 780 650 900 L 566 900 C 576 780 596 644 616 524 C 602 482 590 420 620 378 Z";
const MEDIUS = "M 222 116 C 320 70 520 60 634 120 C 694 170 726 300 716 402 C 640 380 560 336 470 306 C 380 284 290 244 222 116 Z";
const MINIMUS = "M 330 200 C 420 170 560 170 640 230 C 680 280 700 340 704 392 C 640 372 560 340 480 316 C 420 300 360 260 330 200 Z";
const PIR = "M 186 318 C 300 314 450 338 560 366 C 622 382 676 386 708 392 C 700 406 650 414 562 406 C 452 398 300 404 192 402 Z";
const MAXIMUS = "M 196 96 C 290 112 380 172 460 244 C 576 336 714 470 772 566 C 738 642 654 700 568 704 C 458 606 320 528 196 478 C 176 380 172 220 196 96 Z";
const HAM = "M 262 604 C 296 700 324 800 334 900 L 424 900 C 410 800 372 700 320 604 Z";
const QF = "M 336 470 C 420 470 560 470 690 478 L 690 528 C 560 528 420 532 340 540 Z";

export const PATH: Record<N, string> = {
  SG: "M 236 300 C 286 286 324 256 360 244 C 420 222 500 226 584 258",
  IG: "M 246 410 C 300 424 340 430 380 438 C 424 446 462 468 492 502",
  SC: "M 254 404 C 324 420 380 446 412 486 C 444 546 452 626 462 726 C 468 806 472 860 474 900",
  PF: "M 246 416 C 296 446 334 476 352 524 C 372 604 384 704 396 900",
  PU: "M 236 412 C 256 428 270 444 262 458 C 250 476 228 474 216 494 C 202 522 194 556 190 600",
};
const BR: Partial<Record<N, string[]>> = {
  SG: ["M 470 230 C 520 198 586 180 646 188", "M 560 248 C 612 270 660 310 690 360"],
  IG: ["M 398 442 C 430 416 466 404 512 404", "M 450 466 C 490 470 530 486 560 512"],
  SC: [],
  PF: ["M 352 524 C 330 548 300 560 270 566"],
  PU: [],
};
const W: Record<N, number> = { SG: 13, IG: 12, SC: 30, PF: 10, PU: 12 };
const LEN: Record<N, number> = { SG: 420, IG: 300, SC: 560, PF: 540, PU: 260 };
const UNLIT = "#D9AE9C";
const NERVE_OFF = "#D8CDA6";

export const mix = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return "#" + pa.map((v, i) => Math.round(v + (pb[i] - v) * k).toString(16).padStart(2, "0")).join("");
};

export const Glute: React.FC<{
  t: number;
  w: number;
  id: string;
  lit?: Partial<Record<N, number>>; // time each nerve lights up (absent = unlit)
  hot?: N[];
  pir?: number; // 0..1 piriformis highlight
  max?: number; // 0..1 gluteus maximus faded back in
  maxLit?: number; // 0..1 gluteus maximus lit
  med?: number; // 0..1 gluteus medius + minimus lit
  mark?: Partial<Record<N, string>>; // letter badges
  dim?: number; // 0..1 fade nerves that are not hot
  divide?: number; // 0..1 dashed "above / below" line along piriformis
}> = ({ t, w, id, lit = {}, hot = [], pir = 0, max = 0, maxLit = 0, med = 0, mark, dim = 0, divide = 0 }) => {
  const h = (w * 900) / 860;
  const pulse = 0.5 + 0.5 * Math.sin(t * 7);
  const on = (q: N) => (lit[q] === undefined ? 0 : ramp(t, lit[q]!, lit[q]! + 0.35));
  const dash = (len: number, p: number) => ({ strokeDasharray: `${len}`, strokeDashoffset: `${len * (1 - p)}` });
  const nerve = (q: N) => {
    const p = on(q);
    const isHot = hot.includes(q);
    const op = isHot ? 1 : 1 - 0.7 * dim;
    const col = mix(NERVE_OFF, NCOL[q], p);
    const ww = W[q] * (0.75 + 0.25 * p);
    const all = [PATH[q], ...(BR[q] || [])];
    return (
      <g key={q} opacity={op}>
        {isHot && all.map((d, i) => <path key={`h${i}`} d={d} fill="none" stroke={C.banana} strokeWidth={ww + 22 + 8 * pulse} strokeLinecap="round" opacity={0.75} />)}
        {all.map((d, i) => <path key={`o${i}`} d={d} fill="none" stroke={C.forest} strokeWidth={ww + 7} strokeLinecap="round" />)}
        {all.map((d, i) => <path key={`c${i}`} d={d} fill="none" stroke={col} strokeWidth={ww} strokeLinecap="round" />)}
        {p > 0 && p < 1 && <path d={PATH[q]} fill="none" stroke={C.paper} strokeWidth={ww * 0.45} strokeLinecap="round" style={dash(LEN[q], p)} opacity={0.9 * (1 - p)} />}
        {q === "SC" && <path d={PATH.SC} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={6} strokeLinecap="round" transform="translate(-6 0)" />}
      </g>
    );
  };
  const badge = (q: N) => {
    if (!mark || !mark[q]) return null;
    const [x, y] = ANCHOR[q];
    return (
      <g key={`m${q}`}>
        <circle cx={x} cy={y} r={31} fill={NCOL[q]} stroke={C.paper} strokeWidth={6} />
        <circle cx={x} cy={y} r={31} fill="none" stroke={C.forest} strokeWidth={3} />
        <text x={x} y={y + 12} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={C.paper}>{mark[q]}</text>
      </g>
    );
  };
  const muscleFill = (base: string, k: number, col: string) => mix(base, col, k);
  return (
    <svg width={w} height={h} viewBox="0 0 860 900" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <pattern id={`spongy${id}`} width={22} height={22} patternUnits="userSpaceOnUse">
          <circle cx={5} cy={6} r={2.6} fill="#B9A97A" opacity={0.55} />
          <circle cx={15} cy={14} r={2} fill="#B9A97A" opacity={0.5} />
          <circle cx={9} cy={18} r={1.4} fill="#B9A97A" opacity={0.45} />
        </pattern>
        {[["med", 70], ["min", 60], ["pir", 8], ["max", 38], ["ham", 100], ["qf", 2]].map(([k, a]) => (
          <pattern key={k} id={`fib${k}${id}`} width={13} height={13} patternUnits="userSpaceOnUse" patternTransform={`rotate(${a})`}>
            <line x1={0} y1={6.5} x2={13} y2={6.5} stroke="rgba(60,20,14,0.28)" strokeWidth={2.2} />
          </pattern>
        ))}
        <radialGradient id={`skin${id}`} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#FBF1E1" />
          <stop offset="100%" stopColor="#F1E2CB" />
        </radialGradient>
        <linearGradient id={`shade${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity={0.14} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.14} />
        </linearGradient>
      </defs>
      {/* skin silhouette */}
      <path d={SKIN} fill={`url(#skin${id})`} stroke="#D7B8A0" strokeWidth={8} />
      <path d={SKIN} fill="none" stroke={C.forest} strokeWidth={3} opacity={0.3} strokeDasharray="4 10" />
      {/* bones */}
      <path d={ILIUM} fill="#EFE6CC" stroke={C.forest} strokeWidth={5} />
      <path d={ILIUM} fill={`url(#spongy${id})`} />
      <path d="M 214 92 C 300 50 470 30 600 70" fill="none" stroke={C.forest} strokeWidth={3} opacity={0.35} />
      <path d={SACRUM} fill="#EFE6CC" stroke={C.forest} strokeWidth={5} />
      <path d={SACRUM} fill={`url(#spongy${id})`} />
      {[150, 220, 290, 352].map((y, i) => <ellipse key={y} cx={150 - i * 8} cy={y} rx={13} ry={10} fill="#8B8466" stroke={C.forest} strokeWidth={3} />)}
      <path d="M 52 70 L 52 452" stroke={C.forest} strokeWidth={4} strokeDasharray="8 8" opacity={0.5} />
      <path d={FORAMEN} fill="#5E5A44" opacity={0.85} stroke={C.forest} strokeWidth={4} />
      <path d={ISCHIUM} fill="#EFE6CC" stroke={C.forest} strokeWidth={5} />
      <path d={ISCHIUM} fill={`url(#spongy${id})`} />
      <path d={FEMUR} fill="#EFE6CC" stroke={C.forest} strokeWidth={5} />
      <path d={FEMUR} fill={`url(#spongy${id})`} />
      {/* deep muscles */}
      <path d={HAM} fill={UNLIT} stroke={C.forest} strokeWidth={4} />
      <path d={HAM} fill={`url(#fibham${id})`} />
      <path d={QF} fill={UNLIT} stroke={C.forest} strokeWidth={4} />
      <path d={QF} fill={`url(#fibqf${id})`} />
      <g>
        {med > 0 && <path d={MEDIUS} fill="none" stroke={C.banana} strokeWidth={20 + 8 * pulse} strokeLinejoin="round" opacity={0.75 * med} />}
        <path d={MEDIUS} fill={muscleFill(UNLIT, med, "#E0644F")} stroke={C.forest} strokeWidth={4.5} />
        <path d={MEDIUS} fill={`url(#fibmed${id})`} />
        <path d={MEDIUS} fill={`url(#shade${id})`} />
        <path d={MINIMUS} fill={muscleFill("#CF9C88", med, "#B8473A")} stroke={C.forest} strokeWidth={3.5} strokeDasharray="12 8" />
        <path d={MINIMUS} fill={`url(#fibmin${id})`} />
      </g>
      {/* piriformis */}
      {pir > 0 && <path d={PIR} fill="none" stroke={C.banana} strokeWidth={22 + 10 * pulse} strokeLinejoin="round" opacity={0.85 * pir} />}
      <path d={PIR} fill={muscleFill(UNLIT, pir, "#B8473A")} stroke={C.forest} strokeWidth={4.5} />
      <path d={PIR} fill={`url(#fibpir${id})`} />
      {/* greater trochanter bump */}
      <ellipse cx={ANCHOR.TROCH[0] - 10} cy={ANCHOR.TROCH[1] - 4} rx={36} ry={30} fill="#EFE6CC" stroke={C.forest} strokeWidth={4.5} />
      <ellipse cx={ANCHOR.TROCH[0] - 10} cy={ANCHOR.TROCH[1] - 4} rx={36} ry={30} fill={`url(#spongy${id})`} />
      {/* above / below divider */}
      {divide > 0 && (
        <g opacity={divide}>
          <path d="M 120 360 L 800 392" stroke={C.forest} strokeWidth={5} strokeDasharray="16 12" style={{ strokeDashoffset: -t * 40 }} />
        </g>
      )}
      {/* nerves: deep ones first */}
      {nerve("PU")}
      {nerve("PF")}
      {nerve("SC")}
      {nerve("IG")}
      {nerve("SG")}
      {/* pudendal goes back IN (lesser sciatic foramen) to the perineum: dashed arrow */}
      {on("PU") > 0 && (
        <g opacity={on("PU") * (hot.includes("PU") || dim === 0 ? 1 : 0.3)}>
          <path d="M 190 600 C 186 640 172 676 150 706" fill="none" stroke={NCOL.PU} strokeWidth={9} strokeLinecap="round" strokeDasharray="14 10" />
          <path d="M 150 706 l 2 -26 M 150 706 l 24 -10" stroke={NCOL.PU} strokeWidth={9} strokeLinecap="round" />
        </g>
      )}
      {/* gluteus maximus faded back in */}
      {max > 0 && (
        <g opacity={max}>
          {maxLit > 0 && <path d={MAXIMUS} fill="none" stroke={C.banana} strokeWidth={22 + 10 * pulse} strokeLinejoin="round" opacity={0.85 * maxLit} />}
          <path d={MAXIMUS} fill={muscleFill(UNLIT, maxLit, "#3E7C93")} opacity={0.78} stroke={C.forest} strokeWidth={5} />
          <path d={MAXIMUS} fill={`url(#fibmax${id})`} />
          <path d={MAXIMUS} fill={`url(#shade${id})`} />
        </g>
      )}
      {NS.map(badge)}
    </svg>
  );
};
