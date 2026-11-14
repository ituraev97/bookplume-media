import React from "react";
import { C, FONT, ramp } from "./kit";

/**
 * Our own schematic SIDE view of the head, facing RIGHT (like Gray's Fig. 790). Book Plume illustration. viewBox 860 x 680.
 * Facial nerve (CN VII) leaves the skull at the stylomastoid foramen (just below/behind the ear), runs forward into the
 * parotid gland and splits there into 5 terminal branches (TeachMeAnatomy "The Facial Nerve"; Gray 1918 p. 905):
 *  temporal -> frontalis / forehead, zygomatic -> orbicularis oculi / eye, buccal -> buccinator, cheek, upper lip,
 *  marginal mandibular -> lower lip + chin, along the jaw, cervical -> platysma / neck.
 */
export type BId = "tem" | "zyg" | "buc" | "man" | "cer";
export type FPart = BId | "trunk" | "parotid" | "exit" | "rForehead" | "rEye" | "rCheek" | "rJaw" | "rNeck" | "muscles";
export const BR: { id: BId; letter: string; name: string; word: string; region: string; rid: FPart; color: string }[] = [
  { id: "tem", letter: "T", name: "Temporal", word: "To", region: "forehead", rid: "rForehead", color: "#E07A5F" },
  { id: "zyg", letter: "Z", name: "Zygomatic", word: "Zanzibar", region: "eye", rid: "rEye", color: "#E9B949" },
  { id: "buc", letter: "B", name: "Buccal", word: "By", region: "cheek", rid: "rCheek", color: "#7FB069" },
  { id: "man", letter: "M", name: "Marginal mandibular", word: "Motor", region: "jaw", rid: "rJaw", color: "#4F9DC6" },
  { id: "cer", letter: "C", name: "Cervical", word: "Car", region: "neck", rid: "rNeck", color: "#9D7BC8" },
];

const HEAD =
  "M 168 700 C 176 610 192 548 178 486 C 122 434 96 334 120 244 C 150 122 262 40 392 38 C 522 36 612 100 640 190 C 650 214 650 234 642 250 C 654 272 672 302 692 340 C 700 354 692 364 674 366 C 664 374 670 386 664 394 C 674 402 672 416 660 422 C 670 432 666 446 652 450 C 658 472 652 492 630 504 C 600 522 524 528 474 518 C 452 560 460 630 472 700 Z";
const EAR = "M 352 246 C 318 236 296 262 298 300 C 300 334 312 352 326 368 C 334 378 350 378 356 366 C 362 352 352 340 360 326 C 372 304 380 268 352 246 Z";
const EAR_IN = "M 346 266 C 326 262 316 280 320 302 C 322 322 330 336 340 346";
const PAROTID =
  "M 366 268 C 396 262 418 284 418 316 C 432 344 428 404 408 444 C 398 466 372 474 356 458 C 344 444 346 418 346 396 C 344 360 346 320 352 290 C 354 278 358 270 366 268 Z";
const JAW = "M 360 330 C 360 392 362 446 374 476 C 426 504 540 516 626 500";
const ARCH = "M 372 292 C 430 284 500 288 566 304";
const ORBIT = "M 536 250 C 548 214 610 206 630 242";
const NERVE: Record<BId | "trunk", string> = {
  trunk: "M 318 384 C 336 380 356 376 382 372",
  tem: "M 382 372 C 396 330 412 290 432 250 C 452 206 480 166 520 132",
  zyg: "M 382 372 C 422 346 472 320 530 302 C 556 294 580 292 604 292",
  buc: "M 382 372 C 442 368 502 372 560 380 C 592 384 618 392 642 402",
  man: "M 382 372 C 392 422 412 470 452 490 C 502 506 562 504 612 478",
  cer: "M 382 372 C 386 430 396 480 414 520 C 428 556 434 604 436 660",
};
/** small twigs at each branch end (draw with the branch) */
const TWIGS: Record<BId, string[]> = {
  tem: ["M 486 168 C 500 150 520 150 540 154", "M 504 146 C 508 124 520 108 534 98", "M 458 210 C 480 200 500 204 520 214"],
  zyg: ["M 560 296 C 572 280 584 274 598 270", "M 584 293 C 596 302 608 306 620 306"],
  buc: ["M 590 386 C 604 374 620 370 636 372", "M 600 388 C 610 398 622 404 634 404", "M 520 375 C 532 362 548 356 562 354"],
  man: ["M 574 498 C 586 486 596 470 604 456", "M 594 490 C 606 494 620 494 630 488"],
  cer: ["M 420 534 C 404 556 392 580 386 606", "M 430 590 C 446 606 456 624 460 644"],
};
/** where each label's leader starts (on the nerve) and where its pill sits */
type Lab = { ax: number; ay: number; px: number; py: number; text: string };
export const FLAB: Partial<Record<FPart, Lab>> = {
  tem: { ax: 466, ay: 190, px: 290, py: 140, text: "Temporal" },
  zyg: { ax: 516, ay: 306, px: 744, py: 230, text: "Zygomatic" },
  buc: { ax: 566, ay: 381, px: 772, py: 410, text: "Buccal" },
  man: { ax: 540, ay: 503, px: 660, py: 590, text: "Marginal mandibular" },
  cer: { ax: 428, ay: 570, px: 230, py: 500, text: "Cervical" },
  trunk: { ax: 330, ay: 382, px: 170, py: 460, text: "Facial nerve" },
  exit: { ax: 320, ay: 384, px: 170, py: 470, text: "Exit: below the ear" },
  parotid: { ax: 400, ay: 430, px: 230, py: 560, text: "Parotid gland" },
};
export const REG: Record<string, { cx: number; cy: number; rx: number; ry: number; text: string }> = {
  rForehead: { cx: 540, cy: 140, rx: 92, ry: 58, text: "forehead" },
  rEye: { cx: 588, cy: 252, rx: 62, ry: 46, text: "eye" },
  rCheek: { cx: 560, cy: 392, rx: 70, ry: 46, text: "cheek" },
  rJaw: { cx: 560, cy: 492, rx: 92, ry: 34, text: "jaw" },
  rNeck: { cx: 420, cy: 600, rx: 80, ry: 62, text: "neck" },
};

const mix = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return "#" + pa.map((v, i) => Math.round(v + (pb[i] - v) * k).toString(16).padStart(2, "0")).join("");
};

export const Face: React.FC<{
  t: number;
  w?: number;
  lit?: Partial<Record<FPart, number>>;
  focus?: FPart[];
  dimFrom?: number;
  show?: Partial<Record<FPart, number>>;
  all?: boolean;
  colorAt?: Partial<Record<BId, number>>; // each branch takes its mnemonic colour from this time
}> = ({ t, w = 860, lit = {}, focus = [], dimFrom, show = {}, all, colorAt = {} }) => {
  const s = w / 860;
  const on = (id: FPart) => (lit[id] === undefined ? 0 : ramp(t, (lit[id] as number) - 0.05, (lit[id] as number) + 0.3));
  const dimP = dimFrom === undefined ? 0 : ramp(t, dimFrom, dimFrom + 0.4);
  const op = (id: FPart) => 1 - 0.55 * dimP * (1 - on(id));
  const glow = (id: FPart) => (focus.includes(id) ? on(id) * (0.72 + 0.28 * Math.sin(t * 7)) : 0);
  const drawn = (id: FPart) => {
    const v = show[id];
    if (v === undefined) return all ? 1 : 0;
    return ramp(t, v, v + 0.7);
  };
  const colK = (id: BId) => (colorAt[id] === undefined ? 0 : ramp(t, colorAt[id] as number, (colorAt[id] as number) + 0.4));
  const musc = on("muscles");

  const Nerve: React.FC<{ d: string; width: number; id: FPart; p: number; color: string }> = ({ d, width, id, p, color }) => {
    if (p <= 0.001) return null;
    const gl = glow(id);
    const lt = on(id);
    const common = { d, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, pathLength: 1, strokeDasharray: `${p} 2` };
    return (
      <g opacity={op(id)}>
        {gl > 0 && <path {...common} stroke={C.banana} strokeWidth={width + 26 + 6 * gl} opacity={0.85 * gl} />}
        <path {...common} stroke={C.forest} strokeWidth={width + 6} />
        <path {...common} stroke={lt > 0 ? mix(color, "#FFF6B0", 0.35 * lt) : color} strokeWidth={width} />
        <path {...common} stroke="#FFFBE0" strokeWidth={Math.max(2, width * 0.3)} opacity={0.75} transform="translate(-1.5 -1.5)" />
      </g>
    );
  };

  return (
    <svg width={860 * s} height={680 * s} viewBox="0 0 860 680" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="skin45" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F8E3CF" />
          <stop offset="1" stopColor="#EFCDB1" />
        </linearGradient>
        <radialGradient id="crown45" cx="0.45" cy="0.35" r="0.6">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity={0.35} />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="cheek45" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#E9A48E" stopOpacity={0.55} />
          <stop offset="1" stopColor="#E9A48E" stopOpacity={0} />
        </radialGradient>
        <pattern id="lob45" width={18} height={18} patternUnits="userSpaceOnUse">
          <circle cx={9} cy={9} r={6.5} fill="#F3D9A6" stroke="#C9A866" strokeWidth={1.6} />
        </pattern>
        <pattern id="pla45" width={14} height={14} patternUnits="userSpaceOnUse" patternTransform="rotate(-24)">
          <line x1={0} y1={0} x2={0} y2={14} stroke="#B65F4E" strokeWidth={3} opacity={0.55} />
        </pattern>
        <pattern id="fro45" width={12} height={12} patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
          <line x1={0} y1={0} x2={0} y2={12} stroke="#B65F4E" strokeWidth={3} opacity={0.5} />
        </pattern>
        <clipPath id="clip45">
          <path d={HEAD} />
        </clipPath>
        <filter id="sh45" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx={0} dy={6} stdDeviation={6} floodColor="#1F2A14" floodOpacity={0.22} />
        </filter>
      </defs>
      {/* head + neck silhouette */}
      <g filter="url(#sh45)">
        <path d={HEAD} fill="url(#skin45)" stroke={C.forest} strokeWidth={6} strokeLinejoin="round" opacity={1 - 0.25 * dimP} />
      </g>
      <g clipPath="url(#clip45)" opacity={1 - 0.3 * dimP}>
        {/* hairline / scalp tint */}
        <ellipse cx={330} cy={150} rx={260} ry={150} fill="url(#crown45)" />
        <ellipse cx={560} cy={402} rx={70} ry={40} fill="url(#cheek45)" />
        {/* muscles of facial expression (light up on "muscles") */}
        <g opacity={0.35 + 0.65 * musc}>
          <path d="M 430 96 C 510 70 600 110 632 196 C 600 214 548 212 510 204 C 472 196 446 176 430 150 Z" fill="#D98C78" opacity={0.75} />
          <path d="M 430 96 C 510 70 600 110 632 196 C 600 214 548 212 510 204 C 472 196 446 176 430 150 Z" fill="url(#fro45)" />
          <ellipse cx={588} cy={254} rx={50} ry={36} fill="none" stroke="#D98C78" strokeWidth={18} />
          <path d="M 470 410 C 500 380 560 372 600 388 C 610 410 590 434 556 440 C 520 444 486 432 470 410 Z" fill="#D98C78" opacity={0.8} />
          <ellipse cx={640} cy={424} rx={18} ry={27} fill="none" stroke="#D98C78" strokeWidth={10} />
          <path d="M 590 450 C 612 452 630 466 632 492 C 614 502 594 498 584 480 Z" fill="#D98C78" opacity={0.8} />
          <path d="M 396 506 C 452 522 520 530 562 522 C 520 570 486 626 476 700 L 330 700 C 352 630 374 566 396 506 Z" fill="#D98C78" opacity={0.55} />
          <path d="M 396 506 C 452 522 520 530 562 522 C 520 570 486 626 476 700 L 330 700 C 352 630 374 566 396 506 Z" fill="url(#pla45)" />
        </g>
        {/* bone hints: zygomatic arch, orbit rim, mandible */}
        <path d={ARCH} fill="none" stroke="#B9A57E" strokeWidth={9} strokeLinecap="round" opacity={0.55} />
        <path d={ORBIT} fill="none" stroke="#B9A57E" strokeWidth={7} strokeLinecap="round" opacity={0.55} />
        <path d={JAW} fill="none" stroke="#B9A57E" strokeWidth={10} strokeLinecap="round" opacity={0.6} />
        {/* region highlights */}
        {BR.map((b) => {
          const r = REG[b.rid];
          const p = on(b.rid);
          if (p <= 0) return null;
          return (
            <g key={b.rid} opacity={p * (focus.includes(b.rid) ? 1 : 0.45)}>
              <ellipse cx={r.cx} cy={r.cy} rx={r.rx * (0.8 + 0.2 * p)} ry={r.ry * (0.8 + 0.2 * p)} fill={C.banana} opacity={0.42} />
              <ellipse cx={r.cx} cy={r.cy} rx={r.rx * (0.8 + 0.2 * p)} ry={r.ry * (0.8 + 0.2 * p)} fill="none" stroke={C.forest} strokeWidth={4} strokeDasharray="12 9" />
            </g>
          );
        })}
      </g>
      {/* eye, brow, nostril, lips */}
      <g opacity={1 - 0.25 * dimP}>
        <path d="M 556 252 C 572 236 604 234 622 250 C 604 264 574 266 556 252 Z" fill="#FFFDF6" stroke={C.forest} strokeWidth={4} />
        <circle cx={604} cy={250} r={9} fill={C.forest} />
        <path d="M 546 226 C 572 210 606 208 632 222" fill="none" stroke="#6E5A44" strokeWidth={8} strokeLinecap="round" />
        <path d="M 664 352 C 656 354 650 350 648 344" fill="none" stroke={C.forest} strokeWidth={4} strokeLinecap="round" />
        <path d="M 664 422 C 656 424 646 424 640 420" fill="none" stroke={C.forest} strokeWidth={4} strokeLinecap="round" />
      </g>
      {/* parotid gland */}
      {(() => {
        const p = Math.max(drawn("parotid"), all ? 1 : 0);
        if (p <= 0) return null;
        const lt = on("parotid");
        const gl = glow("parotid");
        return (
          <g opacity={p * op("parotid")}>
            {gl > 0 && <path d={PAROTID} fill="none" stroke={C.banana} strokeWidth={26} opacity={0.8 * gl} />}
            <path d={PAROTID} fill={mix("#F6E0B4", "#FFF0A8", lt)} stroke={C.forest} strokeWidth={5} />
            <path d={PAROTID} fill="url(#lob45)" opacity={0.85} />
            <path d="M 408 420 C 440 418 470 412 500 404" fill="none" stroke={C.forest} strokeWidth={9} strokeLinecap="round" opacity={0.9} />
            <path d="M 408 420 C 440 418 470 412 500 404" fill="none" stroke="#F3D9A6" strokeWidth={5} strokeLinecap="round" />
          </g>
        );
      })()}
      {/* ear */}
      <g opacity={1 - 0.25 * dimP}>
        <path d={EAR} fill="#F2C9AE" stroke={C.forest} strokeWidth={5} strokeLinejoin="round" />
        <path d={EAR_IN} fill="none" stroke="#B9806A" strokeWidth={5} strokeLinecap="round" />
        <ellipse cx={336} cy={318} rx={9} ry={12} fill="#8C5A48" opacity={0.6} />
      </g>
      {/* facial nerve: trunk + 5 branches */}
      <Nerve d={NERVE.trunk} width={14} id="trunk" p={drawn("trunk")} color="#E9C743" />
      {BR.map((b) => {
        const p = drawn(b.id);
        const col = mix("#E9C743", b.color, colK(b.id));
        return (
          <g key={b.id}>
            <Nerve d={NERVE[b.id]} width={10} id={b.id} p={p} color={col} />
            {TWIGS[b.id].map((d, i) => (
              <Nerve key={i} d={d} width={5} id={b.id} p={ramp(p, 0.75, 1)} color={col} />
            ))}
          </g>
        );
      })}
      {/* stylomastoid exit + pes (branching point) */}
      {drawn("trunk") > 0 && (() => {
        const ep = Math.max(on("exit"), 0);
        const pulse = 1 + 0.12 * Math.sin(t * 8);
        return (
          <g>
            <circle cx={318} cy={384} r={11 + 6 * ep * pulse} fill={ep > 0 ? C.banana : "#E9C743"} stroke={C.forest} strokeWidth={4} />
            {ep > 0 && <circle cx={318} cy={384} r={26 * pulse} fill="none" stroke={C.forest} strokeWidth={4} strokeDasharray="7 6" opacity={ep} />}
          </g>
        );
      })()}
      {drawn("tem") > 0.3 && <circle cx={382} cy={372} r={9} fill="#E9C743" stroke={C.forest} strokeWidth={4} />}
    </svg>
  );
};

/** Labels drawn OUTSIDE the zoom layer. map = diagram coords -> screen coords */
export const FaceLabels: React.FC<{
  t: number;
  map: (x: number, y: number) => [number, number];
  lit?: Partial<Record<FPart, number>>;
  focus?: FPart[];
  labels?: Partial<Record<FPart, number>>;
  labelEnd?: Partial<Record<FPart, number>>;
  regions?: Partial<Record<FPart, number>>;
  regionEnd?: Partial<Record<FPart, number>>;
  h?: number;
}> = ({ t, map, lit = {}, focus = [], labels = {}, labelEnd = {}, regions = {}, regionEnd = {}, h = 680 }) => {
  const on = (id: FPart) => (lit[id] === undefined ? 0 : ramp(t, (lit[id] as number) - 0.05, (lit[id] as number) + 0.3));
  return (
    <svg width={860} height={h} viewBox={`0 0 860 ${h}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {(Object.keys(regions) as FPart[]).map((id) => {
        const r = REG[id];
        const rt = regions[id] as number;
        const re = regionEnd[id];
        const p = ramp(t, rt, rt + 0.25) * (re === undefined ? 1 : 1 - ramp(t, re, re + 0.2));
        if (!r || p <= 0) return null;
        const [x, y] = map(r.cx, r.cy);
        const ww = r.text.length * 17 + 40;
        return (
          <g key={id} opacity={p} transform={`translate(${x} ${y}) scale(${0.7 + 0.3 * p})`}>
            <rect x={-ww / 2} y={-27} width={ww} height={54} rx={27} fill={C.banana} stroke={C.forest} strokeWidth={4} />
            <text x={0} y={10} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.forest}>{r.text}</text>
          </g>
        );
      })}
      {(Object.keys(labels) as FPart[]).map((id) => {
        const lb = FLAB[id];
        const lt = labels[id];
        if (!lb || lt === undefined || t < lt - 0.05) return null;
        const le = labelEnd[id];
        const p = ramp(t, lt - 0.05, lt + 0.28) * (le === undefined ? 1 : 1 - ramp(t, le, le + 0.25));
        if (p <= 0) return null;
        const hot = on(id) > 0.5 && focus.includes(id);
        const b0 = BR.some((x) => x.id === id);
        const ww = lb.text.length * 16.8 + 38 + (b0 ? 26 : 0);
        const [ax, ay] = map(lb.ax, lb.ay);
        let px = ax + (lb.px - lb.ax);
        let py = ay + (lb.py - lb.ay);
        px = Math.max(ww / 2 + 14, Math.min(860 - ww / 2 - 14, px));
        py = Math.max(44, Math.min(h - 50, py));
        const lx = ax + (px - ax) * p;
        const ly = ay + (py - ay) * p;
        const b = BR.find((x) => x.id === id);
        return (
          <g key={id} opacity={Math.min(1, p * 1.5)}>
            <line x1={ax} y1={ay} x2={lx} y2={ly} stroke={C.forest} strokeWidth={4.5} strokeLinecap="round" />
            <circle cx={ax} cy={ay} r={10} fill={hot ? C.red : C.banana} stroke={C.forest} strokeWidth={4} />
            <g transform={`translate(${px} ${py}) scale(${0.7 + 0.3 * p})`}>
              <rect x={-ww / 2} y={-27} width={ww} height={54} rx={16} fill={hot ? C.banana : C.forest} stroke={C.forest} strokeWidth={3} />
              {b && <circle cx={-ww / 2 + 22} cy={0} r={9} fill={b.color} stroke={hot ? C.forest : C.paper} strokeWidth={3} />}
              <text x={b ? 12 : 0} y={10} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={hot ? C.forest : C.paper}>{lb.text}</text>
            </g>
          </g>
        );
      })}
    </svg>
  );
};
