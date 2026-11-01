import React from "react";
import { C, FONT, ramp } from "./kit";

/**
 * Our own schematic LATERAL view of the right side of the head and neck (Book Plume illustration). viewBox 860 x 680.
 * Face to the viewer's right, back of the head to the left (same orientation as Gray's 1918 Fig. 507).
 * Common carotid splits at the upper border of the thyroid cartilage into internal (back, no neck branches)
 * and external carotid. External carotid branches, bottom-up (SALFOPMS):
 * superior thyroid, ascending pharyngeal, lingual, facial, occipital, posterior auricular, maxillary + superficial temporal (terminal).
 */
export type BId = "st" | "ap" | "li" | "fa" | "oc" | "pa" | "mx" | "sut";
export type PartId = BId | "cca" | "eca" | "ica" | "cart" | "tongue" | "gland" | "ear" | "head" | "split";
export const ORDER: BId[] = ["st", "ap", "li", "fa", "oc", "pa", "mx", "sut"];
export const BR: Record<BId, { letter: string; name: string; word: string }> = {
  st: { letter: "S", name: "Superior thyroid", word: "Some" },
  ap: { letter: "A", name: "Ascending pharyngeal", word: "Anatomists" },
  li: { letter: "L", name: "Lingual", word: "Like" },
  fa: { letter: "F", name: "Facial", word: "Freaking" },
  oc: { letter: "O", name: "Occipital", word: "Out" },
  pa: { letter: "P", name: "Posterior auricular", word: "Poor" },
  mx: { letter: "M", name: "Maxillary", word: "Medical" },
  sut: { letter: "S", name: "Superficial temporal", word: "Students" },
};

const B: [number, number] = [430, 478]; // bifurcation
const CCA = "M 421 720 C 421 640 426 550 430 478";
const ICA = "M 430 478 C 408 440 398 400 396 350 C 394 310 393 282 393 252";
const ICA_SKULL = "M 393 252 C 393 220 396 190 404 160";
const ECA = "M 430 478 C 448 440 453 400 449 350 C 445 300 440 250 436 205";
const PATHS: Record<BId, string> = {
  st: "M 444 462 C 478 462 490 488 494 518 C 498 548 508 572 526 592",
  ap: "M 437 468 C 421 432 418 382 420 336 C 421 304 423 276 427 248",
  li: "M 449 432 C 484 428 500 448 522 440 C 548 430 556 402 580 382 C 598 366 615 352 640 338",
  fa: "M 450 404 C 478 388 492 365 515 372 C 540 380 552 405 576 402 C 596 399 600 380 602 362 C 606 335 640 330 668 312 C 700 292 712 262 724 222",
  oc: "M 447 390 C 410 380 382 352 342 332 C 292 306 244 300 204 270 C 178 252 162 230 150 204",
  pa: "M 441 292 C 412 284 392 270 372 262 C 346 252 318 236 300 196 C 296 186 294 174 294 162",
  mx: "M 436 205 C 470 212 500 224 530 222 C 560 220 590 232 624 238",
  sut: "M 436 205 C 432 160 430 120 432 82 C 434 52 440 28 448 -4",
};
const SUT_FRONTAL = "M 432 98 C 470 78 506 56 540 20";
// width of each vessel (px in viewBox)
const W: Record<BId, number> = { st: 13, ap: 8, li: 14, fa: 14, oc: 13, pa: 10, mx: 15, sut: 14 };
// where each branch's letter badge sits, and its name pill offset
const TAG: Record<BId, { x: number; y: number; dx: number; dy: number }> = {
  st: { x: 526, y: 592, dx: -46, dy: 34 },
  ap: { x: 427, y: 252, dx: -30, dy: -44 },
  li: { x: 640, y: 338, dx: -40, dy: 52 },
  fa: { x: 724, y: 222, dx: -40, dy: -50 },
  oc: { x: 150, y: 204, dx: 30, dy: -56 },
  pa: { x: 294, y: 162, dx: 30, dy: -62 },
  mx: { x: 624, y: 238, dx: -30, dy: 56 },
  sut: { x: 452, y: 40, dx: -30, dy: 34 },
};

const HEAD =
  "M 250 720 C 246 610 236 490 230 425 C 196 384 116 356 106 262 C 96 150 150 30 250 -40 L 700 -40 C 742 20 770 84 764 140 C 774 170 800 192 830 222 C 816 240 802 250 796 262 C 806 276 806 290 799 301 C 807 316 806 331 796 342 C 790 360 800 386 784 410 C 740 432 652 442 602 452 C 586 470 590 490 600 506 C 592 560 588 640 590 720 Z";
const MANDIBLE =
  "M 426 210 C 440 258 450 304 470 332 C 540 352 640 380 744 404 C 750 388 750 372 744 360 C 682 344 602 334 532 320 C 516 290 512 262 506 232 C 490 246 470 252 455 240 C 444 230 434 218 426 210 Z";
const TONGUE = "M 566 330 C 596 300 680 288 758 312 C 768 326 754 338 728 340 C 668 346 608 346 566 330 Z";
const EAR_OUT = "M 384 138 C 344 126 316 166 320 210 C 323 252 350 274 374 264 C 394 256 392 226 396 200 C 400 170 404 146 384 138 Z";
const EAR_IN = "M 376 158 C 352 156 342 186 346 214 C 349 236 362 246 372 238";
const CART = "M 524 470 L 592 478 L 601 506 L 589 540 L 528 534 C 520 512 518 490 524 470 Z";
const HYOID = "M 494 440 C 515 436 540 438 556 444 C 558 450 556 454 552 455 C 536 450 514 449 496 452 C 490 450 489 443 494 440 Z";

export const Neck: React.FC<{
  t: number;
  w?: number;
  lit?: Partial<Record<PartId, number>>; // time each part lights up
  focus?: PartId[]; // parts that get the pulsing banana glow
  dimFrom?: number; // dim everything not lit
  build?: number; // time the trunk starts to draw (undefined = fully drawn)
  grow?: Partial<Record<BId, number>>; // branch draw-in times (undefined = drawn)
  letters?: Partial<Record<BId, number>>;
  names?: Partial<Record<BId, number>>;
  level?: number; // thyroid-cartilage level line
  hideBranches?: boolean;
  vl?: Partial<Record<"cca" | "ica" | "eca", number>>; // vessel name tags
  nameEnd?: Partial<Record<BId, number>>;
}> = ({ t, w = 860, lit = {}, focus = [], dimFrom, build, grow = {}, letters = {}, names = {}, level, hideBranches, vl = {}, nameEnd = {} }) => {
  const s = w / 860;
  const on = (id: PartId) => (lit[id] === undefined ? 0 : ramp(t, (lit[id] as number) - 0.05, (lit[id] as number) + 0.3));
  const dimP = dimFrom === undefined ? 0 : ramp(t, dimFrom, dimFrom + 0.4);
  const op = (id: PartId) => 1 - 0.7 * dimP * (1 - on(id));
  const glow = (id: PartId) => (focus.includes(id) ? on(id) * (0.7 + 0.3 * Math.sin(t * 7)) : 0);
  const bCCA = build === undefined ? 1 : ramp(t, build, build + 0.9);
  const bSplit = build === undefined ? 1 : ramp(t, build + 0.9, build + 1.8);
  const g = (id: BId) => (grow[id] === undefined ? (hideBranches ? 0 : 1) : ramp(t, grow[id] as number, (grow[id] as number) + 0.6));

  const Vessel: React.FC<{ d: string; width: number; id: PartId; p: number; dash?: boolean; color?: string }> = ({ d, width, id, p, dash, color = C.red }) => {
    if (p <= 0.001) return null;
    const gl = glow(id);
    const da = dash ? undefined : `${p} 2`;
    const common = { d, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, pathLength: 1 };
    if (dash)
      return (
        <g opacity={op(id) * p}>
          <path {...common} pathLength={undefined} stroke={color} strokeWidth={width * 0.8} strokeDasharray="6 12" opacity={0.6} />
        </g>
      );
    const lt = on(id);
    return (
      <g opacity={op(id)}>
        {gl > 0 && <path {...common} stroke={C.banana} strokeWidth={width + 22 + 6 * gl} strokeDasharray={da} opacity={0.9 * gl} />}
        <path {...common} stroke={C.forest} strokeWidth={width + 7} strokeDasharray={da} />
        <path {...common} stroke={lt > 0 ? mix(color, "#E0503F", lt) : color} strokeWidth={width} strokeDasharray={da} />
        <path {...common} stroke={C.redLight} strokeWidth={Math.max(2, width * 0.28)} strokeDasharray={da} opacity={0.75} transform="translate(-1.6 -1.6)" />
      </g>
    );
  };

  const cartP = on("cart");
  const tongueP = on("tongue");
  const glandP = on("gland");
  const earP = on("ear");
  const headP = on("head");
  return (
    <svg width={860 * s} height={680 * s} viewBox="0 0 860 680" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="skin41" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F6E9D6" />
          <stop offset="1" stopColor="#EDD9BE" />
        </linearGradient>
        <linearGradient id="bone41" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFBEF" />
          <stop offset="1" stopColor="#EFE6CC" />
        </linearGradient>
        <radialGradient id="gland41" cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#D98A73" />
          <stop offset="1" stopColor="#A9563F" />
        </radialGradient>
      </defs>
      {/* skin silhouette */}
      <path d={HEAD} fill="url(#skin41)" stroke={C.forest} strokeWidth={5} strokeLinejoin="round" opacity={1 - 0.35 * dimP} />
      {/* back-of-head highlight when "back of the head" is said */}
      {headP > 0 && <path d="M 230 425 C 196 384 116 356 106 262 C 98 180 128 100 180 40" fill="none" stroke={C.banana} strokeWidth={26} strokeLinecap="round" opacity={0.85 * headP} />}
      {/* eye + brow */}
      <path d="M 700 150 C 716 140 738 140 752 150" fill="none" stroke={C.forest} strokeWidth={4} strokeLinecap="round" opacity={0.7} />
      <path d="M 704 176 C 718 168 736 168 748 176" fill="none" stroke={C.forest} strokeWidth={4} strokeLinecap="round" opacity={0.7} />
      {/* nostril + lips line */}
      <path d="M 790 238 C 800 240 808 236 812 230" fill="none" stroke={C.forest} strokeWidth={3.5} strokeLinecap="round" opacity={0.6} />
      <path d="M 772 322 C 784 320 792 322 802 322" fill="none" stroke={C.forest} strokeWidth={3.5} strokeLinecap="round" opacity={0.6} />
      {/* tongue */}
      <path d={TONGUE} fill="#E59A8E" stroke={C.forest} strokeWidth={4} opacity={(0.55 + 0.45 * tongueP) * (1 - 0.4 * dimP * (1 - tongueP))} />
      {tongueP > 0 && <path d={TONGUE} fill="none" stroke={C.banana} strokeWidth={14} opacity={0.9 * tongueP} />}
      {/* mandible */}
      <path d={MANDIBLE} fill="url(#bone41)" stroke={C.forest} strokeWidth={4.5} strokeLinejoin="round" opacity={0.8 * (1 - 0.4 * dimP)} />
      {/* ear */}
      {earP > 0 && <path d={EAR_OUT} fill="none" stroke={C.banana} strokeWidth={22} opacity={0.85 * earP} />}
      <path d={EAR_OUT} fill="#F2DCC2" stroke={C.forest} strokeWidth={4.5} />
      <path d={EAR_IN} fill="none" stroke={C.forest} strokeWidth={3.5} strokeLinecap="round" />
      {/* skull base hint (where the internal carotid enters) */}
      <path d="M 360 262 C 380 256 410 256 430 262" fill="none" stroke={C.forest} strokeWidth={3} strokeDasharray="6 8" opacity={0.35} />
      {/* hyoid, thyroid cartilage, trachea, thyroid gland */}
      <path d={HYOID} fill="url(#bone41)" stroke={C.forest} strokeWidth={3.5} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={548} y={552 + i * 24} width={44} height={14} rx={7} fill="#F3EBD3" stroke={C.forest} strokeWidth={3} opacity={0.85} />
      ))}
      <ellipse cx={548} cy={622} rx={36} ry={52} fill="url(#gland41)" stroke={C.forest} strokeWidth={4} opacity={(0.8 + 0.2 * glandP) * (1 - 0.4 * dimP * (1 - glandP))} />
      {glandP > 0 && <ellipse cx={548} cy={622} rx={44} ry={60} fill="none" stroke={C.banana} strokeWidth={10} opacity={0.9 * glandP} />}
      {cartP > 0 && <path d={CART} fill="none" stroke={C.banana} strokeWidth={22} strokeLinejoin="round" opacity={0.9 * cartP} />}
      <path d={CART} fill="#E8E9DC" stroke={C.forest} strokeWidth={4.5} strokeLinejoin="round" />
      <path d="M 560 484 L 586 512" stroke={C.forest} strokeWidth={3} opacity={0.4} />
      {/* thyroid cartilage level line */}
      {level !== undefined && t >= level - 0.05 && (
        <g opacity={ramp(t, level - 0.05, level + 0.3)}>
          <line x1={250} y1={476} x2={250 + 380 * ramp(t, level, level + 0.6)} y2={476} stroke={C.forest} strokeWidth={3} strokeDasharray="10 9" />
          <circle cx={B[0]} cy={B[1]} r={18 + 4 * Math.sin(t * 6)} fill="none" stroke={C.banana} strokeWidth={6} />
        </g>
      )}
      {/* vessels */}
      <Vessel d={CCA} width={26} id="cca" p={bCCA} />
      <Vessel d={ICA} width={20} id="ica" p={bSplit} color="#B44A3E" />
      <Vessel d={ICA_SKULL} width={20} id="ica" p={bSplit} dash color="#B44A3E" />
      {ORDER.map((id) => (id === "mx" || id === "sut" ? null : <Vessel key={id} d={PATHS[id]} width={W[id]} id={id} p={g(id) * bSplit} />))}
      <Vessel d={ECA} width={21} id="eca" p={bSplit} />
      <Vessel d={PATHS.mx} width={W.mx} id="mx" p={g("mx") * bSplit} />
      <Vessel d={SUT_FRONTAL} width={9} id="sut" p={g("sut") * bSplit} />
      <Vessel d={PATHS.sut} width={W.sut} id="sut" p={g("sut") * bSplit} />
      {/* bifurcation dot */}
      {bSplit > 0.5 && <circle cx={B[0]} cy={B[1]} r={7} fill={C.banana} stroke={C.forest} strokeWidth={3} opacity={op("split")} />}
      {/* vessel name tags */}
      {([
        ["cca", "Common carotid", 446, 600, 1, C.forest, C.paper],
        ["ica", "Internal → brain", 392, 330, -1, C.redDark, C.paper],
        ["eca", "External", 452, 330, 1, C.banana, C.forest],
      ] as ["cca" | "ica" | "eca", string, number, number, number, string, string][]).map(([id, txt, x, y, dir, bg, fg]) => {
        const tt = vl[id];
        if (tt === undefined || t < tt - 0.05) return null;
        const p = ramp(t, tt - 0.05, tt + 0.25);
        const ww = txt.length * 16 + 34;
        const x0 = dir > 0 ? x + 18 : x - 18 - ww;
        return (
          <g key={id} opacity={p} transform={`translate(${(1 - p) * 20 * dir} 0)`}>
            <line x1={x} y1={y} x2={dir > 0 ? x0 : x0 + ww} y2={y} stroke={C.forest} strokeWidth={4} strokeLinecap="round" />
            <circle cx={x} cy={y} r={7} fill={C.banana} stroke={C.forest} strokeWidth={3} />
            <rect x={x0} y={y - 24} width={ww} height={48} rx={14} fill={bg} />
            <text x={x0 + ww / 2} y={y + 10} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={fg}>{txt}</text>
          </g>
        );
      })}
      {/* letter badges + names */}
      {ORDER.map((id) => {
        const lt = letters[id];
        if (lt === undefined || t < lt - 0.05) return null;
        const p = ramp(t, lt - 0.05, lt + 0.25);
        const tg = TAG[id];
        const nt = names[id];
        const ne = nameEnd[id];
        const np = (nt === undefined ? 0 : ramp(t, nt - 0.05, nt + 0.25)) * (ne === undefined ? 1 : 1 - ramp(t, ne, ne + 0.25));
        const hot = on(id) > 0.5 && dimFrom !== undefined;
        const nameW = BR[id].name.length * 16 + 36;
        const nx = tg.dx >= 0 ? tg.x + tg.dx : tg.x + tg.dx - nameW;
        return (
          <g key={id} opacity={op(id) < 0.5 ? 0.55 : 1}>
            {np > 0 && (
              <g opacity={np} transform={`translate(${nx} ${tg.y + tg.dy - 24})`}>
                <line x1={tg.dx >= 0 ? 0 : nameW} y1={24} x2={tg.dx >= 0 ? -tg.dx : nameW - tg.dx} y2={24 - tg.dy} stroke={C.forest} strokeWidth={4} strokeLinecap="round" />
                <rect x={0} y={0} width={nameW} height={48} rx={14} fill={hot ? C.banana : C.forest} />
                <text x={nameW / 2} y={34} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={29} fill={hot ? C.forest : C.paper}>{BR[id].name}</text>
              </g>
            )}
            <g transform={`translate(${tg.x} ${tg.y}) scale(${0.6 + 0.4 * p + 0.15 * Math.sin(p * Math.PI)})`} opacity={p}>
              <circle r={27} fill={hot ? C.banana : C.matcha} stroke={C.forest} strokeWidth={4.5} />
              <text y={12} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={hot ? C.forest : C.paper}>{BR[id].letter}</text>
            </g>
          </g>
        );
      })}
    </svg>
  );
};

// simple hex colour mix
const mix = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return "#" + pa.map((v, i) => Math.round(v + (pb[i] - v) * k).toString(16).padStart(2, "0")).join("");
};
