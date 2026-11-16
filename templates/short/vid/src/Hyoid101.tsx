import React from "react";
import { C, FONT, ramp } from "./kit";

/* Book Plume's own diagram: front view of the neck, hyoid bone in the middle.
   4 suprahyoid muscles (digastric, stylohyoid, mylohyoid, geniohyoid) above it,
   4 infrahyoid muscles (TOSS: thyrohyoid, omohyoid, sternothyroid, sternohyoid) below it.
   viewBox 1000 x 1000. Shapes are drawn for the viewer's LEFT half and mirrored; on the RIGHT half the mylohyoid
   is cut away (like Gray's Fig. 386) so the deeper geniohyoid shows. */
export type HM = "DI" | "ST" | "MY" | "GE" | "TH" | "OM" | "STH" | "SH";
export const HNAME: Record<HM, string> = { DI: "digastric", ST: "stylohyoid", MY: "mylohyoid", GE: "geniohyoid", TH: "thyrohyoid", OM: "omohyoid", STH: "sternothyroid", SH: "sternohyoid" };
export const HCOL: Record<HM, string> = { DI: "#D9741C", ST: "#C2398A", MY: "#C2392B", GE: "#8E4FB0", TH: "#2F7FB8", OM: "#1E9C8A", STH: "#4F5FB0", SH: "#2F4E8E" };
const HOT: Record<HM, string> = { DI: "#F0913A", ST: "#DD5AA8", MY: "#E25C47", GE: "#AA6FCC", TH: "#4F9BD2", OM: "#3BBBA6", STH: "#6E7DCC", SH: "#4A6CB0" };
export const SUPRA: HM[] = ["DI", "ST", "MY", "GE"];
export const INFRA: HM[] = ["TH", "OM", "STH", "SH"];

/* muscle outlines (viewer's left half), fibre angle in degrees */
const SHP: Record<HM, { d: string; ang: number }> = {
  /* digastric: posterior belly (from the mastoid, behind the jaw) + anterior belly (chin) — drawn as one path, tendon added separately */
  DI: { d: "M 140 62 C 160 56 178 66 190 84 C 240 170 300 280 362 352 L 344 372 C 280 300 214 200 146 100 C 136 88 134 72 140 62 Z M 466 244 C 480 250 484 262 478 276 C 456 314 432 346 408 370 L 394 356 C 416 324 440 282 456 250 Z", ang: 52 },
  ST: { d: "M 222 78 C 230 74 240 78 244 86 C 300 180 356 280 404 360 L 392 372 C 330 296 268 196 222 100 C 218 92 216 82 222 78 Z", ang: 55 },
  MY: { d: "M 500 252 C 400 246 300 200 240 140 C 300 236 360 312 402 368 L 500 370 Z", ang: 20 },
  GE: { d: "M 500 256 L 470 256 C 460 300 454 340 452 370 L 500 370 Z", ang: 90 },
  TH: { d: "M 412 402 L 448 402 L 446 476 L 410 470 Z", ang: 90 },
  OM: { d: "M 372 402 L 408 402 C 380 500 350 600 324 690 L 292 678 C 316 590 344 494 372 402 Z M 292 676 L 324 692 C 260 760 180 830 104 902 L 70 880 C 146 812 226 744 292 676 Z", ang: 70 },
  STH: { d: "M 410 476 L 450 482 C 452 600 456 720 462 846 L 412 850 C 408 720 408 600 410 476 Z", ang: 90 },
  SH: { d: "M 448 402 L 484 402 C 484 540 486 700 492 846 L 452 848 C 448 700 446 540 448 402 Z", ang: 90 },
};
/* chip anchors in viewBox coords (viewer's left unless marked) */
export const HANCH: Record<HM | "HY" | "SCAP" | "JAW" | "STER", [number, number]> = {
  DI: [440, 300], ST: [340, 270], MY: [612, 300], GE: [522, 318], TH: [552, 438], OM: [338, 592], STH: [570, 700], SH: [466, 650],
  HY: [500, 386], SCAP: [95, 905], JAW: [500, 230], STER: [500, 900],
};

const lv = (t: number, t0?: number) => (t0 === undefined ? 0 : ramp(t, t0 - 0.05, t0 + 0.3));
const BONE = "#F3EBD9";

/* left-half bones */
const MAND = "M 196 100 L 214 164 C 262 232 380 292 470 300 C 484 304 492 308 500 308 L 500 238 C 392 234 300 192 262 140 L 246 92 Z";
const HORN = "M 430 372 C 400 370 368 362 336 346 C 324 340 322 352 330 360 C 362 380 400 394 430 398 Z";
const SHIELD = "M 500 432 L 488 420 L 416 424 C 410 452 410 478 418 506 C 434 536 466 552 500 562 Z";
const CLAV = "M 470 858 C 400 846 330 856 260 852 C 200 848 140 830 96 820 C 82 818 76 846 90 850 C 140 862 200 884 262 888 C 330 892 400 886 470 892 Z";
const MANU = "M 500 840 L 430 846 C 418 870 414 900 426 1000 L 500 1000 Z";
const SCAP = "M 0 872 C 40 860 90 852 132 858 C 158 862 172 884 162 910 L 120 1000 L 0 1000 Z";

export const Hyoid: React.FC<{
  t: number; w: number; id: string; lit: Partial<Record<HM, number>>; hot?: HM[]; dimSupra?: number; dimInfra?: number;
  up?: number; down?: number; hy?: number; split?: number; sling?: number;
}> = ({ t, w, id, lit, hot = [], dimSupra = 0, dimInfra = 0, up = 0, down = 0, hy = 0, split = 0, sling = 0 }) => {
  const on = (k: HM) => lv(t, lit[k]);
  const H = (k: HM) => hot.includes(k);
  const mir = "translate(1000 0) scale(-1 1)";
  const pulse = (Math.sin(t * 6) + 1) / 2;
  const muscle = (k: HM, side: string, dOverride?: string) => {
    const d = dOverride ?? SHP[k].d;
    const o = on(k);
    const dim = SUPRA.includes(k) ? dimSupra : dimInfra;
    const deep = k === "GE" || k === "STH";
    return (
      <g key={k + side} opacity={1 - 0.6 * dim}>
        {H(k) && <path d={d} fill="none" stroke={C.banana} strokeWidth={22 + 8 * pulse} strokeLinejoin="round" opacity={0.95} />}
        <path d={d} fill="#D99482" />
        {o > 0 && <path d={d} fill={HOT[k]} opacity={o} />}
        <path d={d} fill={`url(#${id}f${k})`} opacity={0.75} />
        <path d={d} fill="none" stroke={H(k) ? C.forest : "rgba(31,42,20,0.85)"} strokeWidth={H(k) ? 5.5 : 3.5} strokeLinejoin="round" strokeDasharray={deep && !H(k) ? "0" : undefined} />
      </g>
    );
  };
  /* right half: mylohyoid cut back to a lateral rim so geniohyoid shows */
  const MY_R = "M 412 250 C 340 226 280 196 240 140 C 300 236 360 322 402 368 L 420 368 C 422 330 418 290 412 250 Z";
  const half = (side: "l" | "r") => (
    <g>
      <path d={SCAP} fill={BONE} stroke={C.forest} strokeWidth={4} />
      {/* thyroid cartilage + horn of the hyoid sit under the muscles */}
      <path d={SHIELD} fill="#E3EAEF" stroke={C.forest} strokeWidth={4} />
      <path d={HORN} fill={BONE} stroke={C.forest} strokeWidth={4} />
      {/* deep first */}
      {side === "r" && muscle("GE", side)}
      {side === "l" ? muscle("MY", side) : muscle("MY", side, MY_R)}
      {muscle("STH", side)}
      {muscle("TH", side)}
      {muscle("ST", side)}
      {muscle("DI", side)}
      {/* digastric intermediate tendon + fibrous sling to the hyoid */}
      <path d="M 352 362 C 370 366 386 364 400 362" fill="none" stroke={C.forest} strokeWidth={15} strokeLinecap="round" />
      <path d="M 352 362 C 370 366 386 364 400 362" fill="none" stroke="#FBF6EA" strokeWidth={9} strokeLinecap="round" />
      {sling > 0 && <path d="M 352 362 C 370 366 386 364 400 362" fill="none" stroke={C.banana} strokeWidth={9} strokeLinecap="round" opacity={sling} />}
      {muscle("SH", side)}
      {muscle("OM", side)}
      {/* omohyoid intermediate tendon */}
      <path d="M 294 678 L 322 692" stroke="#FBF6EA" strokeWidth={14} strokeLinecap="round" />
      <path d={CLAV} fill={BONE} stroke={C.forest} strokeWidth={4} />
      <path d={MANU} fill={BONE} stroke={C.forest} strokeWidth={4} />
      <path d={MAND} transform="translate(0 -50)" fill={BONE} stroke={C.forest} strokeWidth={4.5} />
      <path d="M 236 150 C 290 216 392 266 500 274" transform="translate(0 -50)" fill="none" stroke="rgba(31,42,20,0.22)" strokeWidth={3} />
      {/* mastoid tip peeking out */}
      <ellipse cx={150} cy={52} rx={30} ry={22} fill={BONE} stroke={C.forest} strokeWidth={4} />
    </g>
  );
  const arrow = (y0: number, dir: number, p: number) => {
    if (p <= 0) return null;
    const L = 120 * p;
    return (
      <g opacity={Math.min(1, p * 2)}>
        <path d={`M ${-26} ${y0} L ${-26} ${y0 + dir * (L - 40)} L ${-58} ${y0 + dir * (L - 40)} L 0 ${y0 + dir * L} L 58 ${y0 + dir * (L - 40)} L 26 ${y0 + dir * (L - 40)} L 26 ${y0} Z`} transform="translate(500 0)" fill={dir < 0 ? "#D9741C" : "#2F7FB8"} stroke="#111" strokeWidth={7} strokeLinejoin="round" />
      </g>
    );
  };
  return (
    <svg width={w} height={w} viewBox="0 0 1000 1000" style={{ display: "block", overflow: "visible" }}>
      <defs>
        {(Object.keys(SHP) as HM[]).map((k) => (
          <pattern key={k} id={`${id}f${k}`} width={14} height={14} patternUnits="userSpaceOnUse" patternTransform={`rotate(${SHP[k].ang})`}>
            <line x1={0} y1={3} x2={14} y2={3} stroke="rgba(90,30,20,0.42)" strokeWidth={2} />
            <line x1={0} y1={10} x2={14} y2={10} stroke="rgba(255,235,225,0.35)" strokeWidth={1.4} />
          </pattern>
        ))}
        <linearGradient id={`${id}skin`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F4E6D4" />
          <stop offset="1" stopColor="#EFDCC6" />
        </linearGradient>
      </defs>
      {/* neck silhouette */}
      <path d="M 250 60 C 260 200 280 420 260 640 C 250 720 170 790 30 830 L 30 1000 L 970 1000 L 970 830 C 830 790 750 720 740 640 C 720 420 740 200 750 60 Z" fill={`url(#${id}skin)`} stroke="rgba(31,42,20,0.35)" strokeWidth={3} />
      {/* trachea + cricoid in the midline gap */}
      {[612, 646, 680, 714, 748, 782, 816].map((y) => (
        <rect key={y} x={462} y={y} width={76} height={22} rx={10} fill="#E3EAEF" stroke="rgba(31,42,20,0.6)" strokeWidth={3} />
      ))}
      <rect x={452} y={572} width={96} height={30} rx={12} fill="#E3EAEF" stroke={C.forest} strokeWidth={4} />
      {half("l")}
      <g transform={mir}>{half("r")}</g>
      {/* Adam's apple notch */}
      <path d="M 488 420 L 500 434 L 512 420" fill="none" stroke={C.forest} strokeWidth={4} />
      {/* hyoid body on top */}
      {hy > 0 && <rect x={396} y={356} width={208} height={60} rx={30} fill={C.banana} opacity={0.75 * hy + 0.2 * hy * pulse} />}
      <path d="M 412 372 C 450 362 550 362 588 372 C 598 376 598 400 588 404 C 550 412 450 412 412 404 C 402 400 402 376 412 372 Z" fill={BONE} stroke={C.forest} strokeWidth={5} />
      {/* above / below divider */}
      {split > 0 && (
        <g opacity={split}>
          <line x1={110} y1={386} x2={110 + 780 * split} y2={386} stroke="#111" strokeWidth={5} strokeDasharray="18 12" />
        </g>
      )}
      {arrow(352, -1, up)}
      {arrow(420, 1, down)}
      <g fontFamily={FONT} fontWeight={800}>
        <text x={500} y={170} textAnchor="middle" fontSize={26} fill="rgba(31,42,20,0.55)">jaw</text>
        <text x={500} y={968} textAnchor="middle" fontSize={26} fill="rgba(31,42,20,0.55)">sternum</text>
        <text x={44} y={955} fontSize={24} fill="rgba(31,42,20,0.55)">scapula</text>
      </g>
    </svg>
  );
};
