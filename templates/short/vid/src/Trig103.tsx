import React from "react";
import { C, FONT, ramp } from "./kit";

/* Book Plume's own diagrams for the trigeminal nerve (CN V).
   1) TriFace: the face from the FRONT, viewBox 800 x 1000, skin areas of the 3 divisions on both halves
      (TeachMeAnatomy "The Trigeminal Nerve (CN V)"; StatPearls "Neuroanatomy, Cranial Nerve 5 (Trigeminal)"):
      V1 ophthalmic = forehead/scalp, upper eyelid, bridge of the nose to the tip;
      V2 maxillary  = lower eyelid, cheek, side of the nose, upper lip;
      V3 mandibular = lower lip, chin, over the jaw + a band in front of the ear up to the temple.
      The skin over the ANGLE of the jaw is C2–C3 (great auricular), not CN V — shown grey.
   2) Exits: schematic right middle cranial fossa from above: V1 → superior orbital fissure, V2 → foramen rotundum, V3 → foramen ovale. */
export type TK = "V1" | "V2" | "V3";
export const TNAME: Record<TK, string> = { V1: "ophthalmic", V2: "maxillary", V3: "mandibular" };
export const TCOL: Record<TK, string> = { V1: "#2F6FC0", V2: "#D9821C", V3: "#A8378E" };
const TFILL: Record<TK, string> = { V1: "#8DB6EC", V2: "#F4BE72", V3: "#D995C6" };
export const TEXIT: Record<TK, string> = { V1: "superior orbital fissure", V2: "foramen rotundum", V3: "foramen ovale" };

const HEAD = "M 400 64 C 566 64 668 176 672 356 C 676 470 664 566 638 646 C 606 744 538 846 470 890 C 440 908 360 908 330 890 C 262 846 194 744 162 646 C 136 566 124 470 128 356 C 132 176 234 64 400 64 Z";
/* left half (viewer's left) — mirrored for the right half */
const V1L = "M 0 0 L 400 0 L 400 606 C 386 604 374 596 368 584 C 360 548 352 492 340 436 C 300 446 262 444 232 434 C 206 424 172 410 120 400 L 0 400 Z";
const V2L = "M 120 400 C 172 410 206 424 232 434 C 262 444 300 446 340 436 C 352 492 360 548 368 584 C 374 596 386 604 400 606 L 400 704 L 322 704 C 268 690 214 648 182 588 C 160 546 146 492 138 450 C 134 430 128 412 120 400 Z";
const V3L = "M 0 380 L 400 380 L 400 1000 L 0 1000 Z";
const ANGLE = "M 128 560 C 140 650 170 740 236 830 L 262 800 C 222 740 196 672 186 600 C 176 580 152 566 128 560 Z";
const EYE = "M 232 434 C 262 404 310 404 340 436 C 300 456 262 456 232 434 Z";
const BROW = "M 214 384 C 252 360 312 360 352 380";
const MOUTH = "M 322 704 C 360 696 382 700 400 706";
const LIPS = "M 322 704 C 352 676 380 678 400 686 M 322 704 C 350 740 380 744 400 744";
const NOSE = "M 340 436 C 352 492 360 548 368 584 C 356 598 352 614 366 622 C 380 628 390 624 400 626";
const EAR = "M 130 420 C 102 404 86 432 92 476 C 98 520 112 560 140 572";
const MASSETER = "M 150 520 C 196 520 232 540 244 590 C 254 640 254 700 248 760 C 224 780 196 770 178 740 C 160 690 150 610 150 520 Z";
/* terminal nerve sprays from the 3 face foramina */
const SPRAY: Record<TK, { o: [number, number]; d: string }> = {
  V1: { o: [292, 372], d: "M 292 372 C 286 320 272 250 256 160 M 292 372 C 300 310 312 240 330 150 M 292 372 C 270 330 238 280 196 228" },
  V2: { o: [290, 506], d: "M 290 506 C 270 540 248 580 238 630 M 290 506 C 300 550 314 600 330 660 M 290 506 C 318 520 340 540 352 566 M 290 506 C 262 520 230 534 196 540" },
  V3: { o: [302, 806], d: "M 302 806 C 330 780 360 762 392 752 M 302 806 C 296 840 300 870 318 880 M 302 806 C 270 790 248 770 236 746" },
};

const half = (k: TK) => (k === "V1" ? V1L : k === "V2" ? V2L : V3L);

export const TriFace: React.FC<{
  t: number; w: number; id: string; lit: Partial<Record<TK, number>>; hot?: TK[]; dimRest?: number; chew?: number; spray?: number; angle?: number; faint?: number;
}> = ({ t, w, id, lit, hot = [], dimRest = 0, chew = 0, spray = 1, angle = 0, faint = 0.16 }) => {
  const pulse = (Math.sin(t * 6) + 1) / 2;
  const h = (w * 1000) / 800;
  const zone = (k: TK) => {
    const o = lit[k] === undefined ? 0 : ramp(t, lit[k]! - 0.05, lit[k]! + 0.3);
    const H = hot.includes(k);
    const dim = H || !hot.length ? 0 : dimRest;
    const a = (faint + (1 - faint) * o) * (1 - 0.6 * dim);
    return (
      <g key={k} opacity={a}>
        <path d={half(k)} fill={TFILL[k]} />
        <path d={half(k)} fill={TFILL[k]} transform="translate(800 0) scale(-1 1)" />
        {H && <path d={half(k)} fill="#fff" opacity={0.18 * pulse} />}
        {H && <path d={half(k)} fill="#fff" opacity={0.18 * pulse} transform="translate(800 0) scale(-1 1)" />}
      </g>
    );
  };
  const sprayEl = (k: TK, mir: boolean) => {
    const o = (lit[k] === undefined ? 0 : ramp(t, lit[k]! + 0.1, lit[k]! + 0.6)) * spray;
    if (o <= 0) return null;
    const H = hot.includes(k) || !hot.length;
    const s = SPRAY[k];
    return (
      <g key={k + mir} transform={mir ? "translate(800 0) scale(-1 1)" : undefined} opacity={o * (H ? 1 : 0.5)}>
        <path d={s.d} fill="none" stroke="#5A4A00" strokeWidth={10} strokeLinecap="round" opacity={0.35} />
        <path d={s.d} fill="none" stroke="#FFD43B" strokeWidth={6} strokeLinecap="round" strokeDasharray="900" strokeDashoffset={900 * (1 - o)} />
        <circle cx={s.o[0]} cy={s.o[1]} r={11} fill="#FFD43B" stroke={C.forest} strokeWidth={4} />
      </g>
    );
  };
  return (
    <svg width={w} height={h} viewBox="0 0 800 1000" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <clipPath id={`${id}clip`}><path d={HEAD} /></clipPath>
        <radialGradient id={`${id}skin`} cx="0.5" cy="0.42" r="0.62">
          <stop offset="0" stopColor="#FBEBDA" />
          <stop offset="1" stopColor="#E9CBAE" />
        </radialGradient>
        <pattern id={`${id}hatch`} width={16} height={16} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width={16} height={16} fill="#C9C6B6" />
          <line x1={0} y1={0} x2={0} y2={16} stroke="#A9A592" strokeWidth={6} />
        </pattern>
      </defs>
      {/* neck (C2–C3, not CN V) */}
      <path d="M 300 860 C 300 920 296 960 286 1000 L 514 1000 C 504 960 500 920 500 860 Z" fill="#E2DFD0" stroke="rgba(31,42,20,0.45)" strokeWidth={4} />
      {/* ears */}
      {[false, true].map((m) => (
        <g key={String(m)} transform={m ? "translate(800 0) scale(-1 1)" : undefined}>
          <path d="M 134 410 C 96 390 72 424 80 476 C 88 526 104 566 142 580 Z" fill={`url(#${id}skin)`} stroke="rgba(31,42,20,0.55)" strokeWidth={4} />
          <path d={EAR} fill="none" stroke="rgba(31,42,20,0.3)" strokeWidth={3} transform="translate(12 6) scale(0.94)" />
        </g>
      ))}
      <path d={HEAD} fill={`url(#${id}skin)`} />
      <g clipPath={`url(#${id}clip)`}>
        {(["V3", "V2", "V1"] as TK[]).map(zone)}
        {angle > 0 && (
          <g opacity={angle}>
            <path d={ANGLE} fill={`url(#${id}hatch)`} />
            <path d={ANGLE} fill={`url(#${id}hatch)`} transform="translate(800 0) scale(-1 1)" />
          </g>
        )}
        {chew > 0 && [false, true].map((m) => (
          <g key={"m" + m} transform={m ? "translate(800 0) scale(-1 1)" : undefined} opacity={chew}>
            <path d={MASSETER} fill="#C0392B" opacity={0.55 + 0.25 * pulse} stroke="#7E1E14" strokeWidth={5} />
            {[0, 1, 2, 3, 4].map((i) => (
              <path key={i} d={`M ${162 + i * 16} ${528 + i * 2} C ${176 + i * 14} ${600} ${190 + i * 12} ${680} ${196 + i * 10} ${752 - i * 4}`} fill="none" stroke="#FFD9D2" strokeWidth={3} opacity={0.7} />
            ))}
          </g>
        ))}
      </g>
      {/* outline + features */}
      <path d={HEAD} fill="none" stroke="rgba(31,42,20,0.75)" strokeWidth={6} />
      {[false, true].map((m) => (
        <g key={"f" + m} transform={m ? "translate(800 0) scale(-1 1)" : undefined} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d={BROW} stroke="#4A3A2A" strokeWidth={13} opacity={0.8} />
          <path d={EYE} fill="#FFFDF7" stroke={C.forest} strokeWidth={5} />
          <circle cx={286} cy={432} r={17} fill="#5B4636" />
          <circle cx={286} cy={432} r={8} fill="#1A120C" />
          <circle cx={281} cy={427} r={4} fill="#fff" />
          <path d="M 236 432 C 266 418 308 418 338 436" stroke={C.forest} strokeWidth={3} opacity={0.5} />
          <path d={NOSE} stroke="rgba(31,42,20,0.7)" strokeWidth={5} />
          <path d={LIPS} stroke="rgba(31,42,20,0.7)" strokeWidth={5} />
          <path d={MOUTH} stroke={C.forest} strokeWidth={5} />
        </g>
      ))}
      {[false, true].flatMap((m) => (["V1", "V2", "V3"] as TK[]).map((k) => sprayEl(k, m)))}
      {/* midline tick for the nose tip */}
      <path d="M 384 612 C 392 618 408 618 416 612" fill="none" stroke="rgba(31,42,20,0.5)" strokeWidth={4} />
      <text x={400} y={990} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill="rgba(31,42,20,0.45)">neck</text>
    </svg>
  );
};
/* anchors in the face viewBox (left half, viewer's left) */
export const FANCH: Record<string, [number, number]> = {
  V1: [400, 230], V1lid: [286, 412], V1nose: [388, 540], V2: [232, 540], V2lip: [360, 694], V3: [300, 800], V3chin: [400, 840], V3band: [150, 470],
  CHEW: [200, 650], ANGLE: [190, 720], V1r: [560, 230], V2r: [568, 540], V3r: [500, 800],
};

/* ---------- 2) exits: right middle cranial fossa from above (anterior = up), viewBox 860 x 820 ---------- */
export type EK = "SOF" | "ROT" | "OVA" | "SPI";
const HOLE: Record<EK, { c: [number, number]; d: string; k?: TK }> = {
  SOF: { c: [446, 214], d: "M 560 246 C 520 236 468 220 420 204 C 380 190 346 172 320 150 C 328 168 346 186 372 204 C 418 232 484 252 556 262 Z", k: "V1" },
  ROT: { c: [540, 352], d: "M 540 352 m -30 0 a 30 30 0 1 0 60 0 a 30 30 0 1 0 -60 0", k: "V2" },
  OVA: { c: [440, 470], d: "M 440 470 m -46 0 a 46 30 -25 1 0 92 0 a 46 30 -25 1 0 -92 0", k: "V3" },
  SPI: { c: [372, 548], d: "M 372 548 m -14 0 a 14 14 0 1 0 28 0 a 14 14 0 1 0 -28 0" },
};
export const ENAME: Record<EK, string> = { SOF: "superior orbital fissure", ROT: "foramen rotundum", OVA: "foramen ovale", SPI: "foramen spinosum" };
export const EANCH: Record<string, [number, number]> = { SOF: [446, 214], ROT: [540, 352], OVA: [440, 470], SPI: [372, 548], GANG: [610, 600], SELLA: [770, 380] };
const NPATH: Record<TK, string> = {
  V1: "M 640 588 C 650 500 640 380 600 300 C 584 270 568 258 546 250",
  V2: "M 618 592 C 600 520 572 430 548 368",
  V3: "M 586 620 C 540 580 486 530 452 486",
};
const FLOOR = "M 820 40 L 820 790 C 700 800 560 780 420 730 C 290 684 160 610 100 500 C 50 400 60 280 130 190 C 200 100 300 50 440 40 Z";
const NW: Record<TK, number> = { V1: 20, V2: 22, V3: 32 };

export const Exits: React.FC<{ t: number; w: number; id: string; lit: Partial<Record<TK, number>>; hot?: TK[]; hotHole?: EK[]; flow?: number; spin?: number }> = ({ t, w, id, lit, hot = [], hotHole = [], flow = 1, spin = 1 }) => {
  const pulse = (Math.sin(t * 6) + 1) / 2;
  const h = (w * 820) / 860;
  const lv = (k: TK) => (lit[k] === undefined ? 0 : ramp(t, lit[k]! - 0.05, lit[k]! + 0.35));
  return (
    <svg width={w} height={h} viewBox="0 0 860 820" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <radialGradient id={`${id}bone`} cx="0.45" cy="0.45" r="0.7">
          <stop offset="0" stopColor="#F4EAD2" />
          <stop offset="1" stopColor="#DCCBA6" />
        </radialGradient>
        <clipPath id={`${id}fc`}><path d={FLOOR} /></clipPath>
      </defs>
      {/* floor of the right anterior + middle cranial fossa, schematic */}
      <path d={FLOOR} fill={`url(#${id}bone)`} />
      <g clipPath={`url(#${id}fc)`}>
        {/* lesser wing ridge (front) and petrous ridge (back) */}
        <path d="M 860 236 C 700 236 600 230 520 214 C 420 194 300 150 160 100" fill="none" stroke="rgba(31,42,20,0.3)" strokeWidth={12} strokeLinecap="round" />
        <path d="M 860 560 C 760 610 700 660 640 700 C 560 750 470 770 300 760" fill="none" stroke="rgba(31,42,20,0.3)" strokeWidth={14} strokeLinecap="round" />
        <text x={330} y={110} fontFamily={FONT} fontWeight={800} fontSize={22} fill="rgba(31,42,20,0.45)">lesser wing</text>
        <text x={200} y={420} fontFamily={FONT} fontWeight={800} fontSize={22} fill="rgba(31,42,20,0.45)">middle cranial fossa</text>
      </g>
      <path d={FLOOR} fill="none" stroke="rgba(31,42,20,0.55)" strokeWidth={5} />
      {/* sella turcica on the midline */}
      <path d="M 820 330 C 790 330 760 350 756 388 C 760 426 790 444 820 444" fill="#CDBB94" stroke="rgba(31,42,20,0.5)" strokeWidth={4} />
      <text x={790} y={496} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={22} fill="rgba(31,42,20,0.55)">sella</text>
      {/* holes */}
      {(Object.keys(HOLE) as EK[]).map((e) => {
        const H = hotHole.includes(e);
        return (
          <g key={e}>
            {H && <path d={HOLE[e].d} fill="none" stroke={C.banana} strokeWidth={22 + 12 * pulse} strokeLinejoin="round" />}
            <path d={HOLE[e].d} fill="#2A2116" stroke={H ? "#E5251A" : "rgba(31,42,20,0.8)"} strokeWidth={H ? 7 : 4} />
          </g>
        );
      })}
      {/* trigeminal ganglion (semilunar) + root */}
      <path d="M 700 760 C 690 700 680 660 660 630" fill="none" stroke={C.forest} strokeWidth={42} strokeLinecap="round" />
      <path d="M 700 760 C 690 700 680 660 660 630" fill="none" stroke="#F1C94A" strokeWidth={32} strokeLinecap="round" />
      {(["V1", "V2", "V3"] as TK[]).map((k) => {
        const o = lv(k);
        const H = hot.includes(k);
        const dim = H || !hot.length ? 1 : 0.45;
        return (
          <g key={k} opacity={(0.35 + 0.65 * o) * dim}>
            {H && <path d={NPATH[k]} fill="none" stroke={C.banana} strokeWidth={NW[k] + 24 + 8 * pulse} strokeLinecap="round" />}
            <path d={NPATH[k]} fill="none" stroke={C.forest} strokeWidth={NW[k] + 9} strokeLinecap="round" />
            <path d={NPATH[k]} fill="none" stroke={o > 0 ? TCOL[k] : "#E8D9A0"} strokeWidth={NW[k]} strokeLinecap="round" />
            {flow > 0 && o > 0 && <path d={NPATH[k]} fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth={NW[k] * 0.3} strokeLinecap="round" strokeDasharray="2 30" strokeDashoffset={t * 80} />}
          </g>
        );
      })}
      <path d="M 548 640 C 566 570 640 548 712 572 C 700 604 690 616 676 610 C 640 596 600 612 584 650 C 572 668 552 662 548 640 Z" fill="#F1C94A" stroke={C.forest} strokeWidth={6} />
      <text x={100} y={790} fontFamily={FONT} fontWeight={800} fontSize={24} fill="rgba(31,42,20,0.5)">↑ front · right side, seen from above</text>
      {spin > 0 && null}
    </svg>
  );
};
