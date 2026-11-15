import React from "react";
import { C, FONT, ramp } from "./kit";

/* Book Plume's own diagram: simplified cross-section of the back at one vertebra (skin at the TOP, vertebral body at the bottom).
   Each side: erector spinae = 3 columns (iliocostalis lateral, longissimus middle + biggest, spinalis medial)
   and, deeper in the groove between the spinous and transverse processes, the transversospinales
   (semispinalis superficial, multifidus, rotatores deepest). Spinal nerve → posterior ramus (back muscles) + anterior ramus (plexuses).
   viewBox 1000 x 1000; shapes are defined for the viewer's LEFT half and mirrored. */
export type DM = "IL" | "LO" | "SP" | "SS" | "MU" | "RO";
export const DNAME: Record<DM, string> = { IL: "iliocostalis", LO: "longissimus", SP: "spinalis", SS: "semispinalis", MU: "multifidus", RO: "rotatores" };
export const DCOL: Record<DM, string> = { IL: "#C2392B", LO: "#D9822B", SP: "#B8962A", SS: "#3E7CA6", MU: "#2F5E86", RO: "#5B4A9E" };
const HOT: Record<DM, string> = { IL: "#E25C47", LO: "#F0A04B", SP: "#E6C34A", SS: "#5B98C4", MU: "#4479AA", RO: "#7D6BC0" };

/* muscle blobs (cx, cy, rx, ry, rot) */
const SH: Record<DM, [number, number, number, number, number]> = {
  IL: [232, 444, 56, 66, -16],
  LO: [350, 402, 66, 88, -6],
  SP: [458, 322, 25, 46, -4],
  SS: [446, 400, 37, 25, -6],
  MU: [452, 459, 34, 31, 0],
  RO: [462, 513, 24, 16, 8],
};
/* chip anchors in viewBox coords (viewer's left side) */
export const DANCH: Record<DM | "NERVE" | "POST" | "ANT" | "ES" | "TS" | "SPINE" | "TP" | "BODY", [number, number]> = {
  IL: SH.IL.slice(0, 2) as [number, number], LO: SH.LO.slice(0, 2) as [number, number], SP: SH.SP.slice(0, 2) as [number, number],
  SS: SH.SS.slice(0, 2) as [number, number], MU: SH.MU.slice(0, 2) as [number, number], RO: SH.RO.slice(0, 2) as [number, number],
  NERVE: [400, 650], POST: [300, 560], ANT: [215, 760], ES: [350, 380], TS: [448, 450], SPINE: [500, 300], TP: [300, 560], BODY: [500, 805],
};

const SEED: Record<DM, number> = { IL: 0.7, LO: 2.1, SP: 3.3, SS: 4.4, MU: 5.2, RO: 1.4 };
const blobD = (k: DM, grow = 0) => {
  const [cx, cy, rx, ry, r] = SH[k];
  const ph = SEED[k], rr = (r * Math.PI) / 180;
  const pts: string[] = [];
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    const f = 1 + 0.045 * Math.sin(3 * a + ph) + 0.03 * Math.sin(5 * a + 2 * ph);
    const x0 = Math.cos(a) * (rx * f + grow), y0 = Math.sin(a) * (ry * f + grow);
    pts.push(`${(cx + x0 * Math.cos(rr) - y0 * Math.sin(rr)).toFixed(1)} ${(cy + x0 * Math.sin(rr) + y0 * Math.cos(rr)).toFixed(1)}`);
  }
  return "M " + pts.join(" L ") + " Z";
};
const lv = (t: number, t0?: number) => (t0 === undefined ? 0 : ramp(t, t0 - 0.05, t0 + 0.3));

/* left-half bone outlines */
const TP = "M 430 548 C 390 556 340 558 290 556 C 256 554 226 546 206 540 C 192 536 190 566 204 572 C 236 582 282 590 330 592 C 380 594 412 592 436 590 Z";
const LAMINA = "M 500 528 C 480 528 456 536 432 552 L 412 596 C 440 590 470 586 500 586 Z";
const PEDICLE = "M 412 590 C 404 630 404 668 410 708 L 452 708 C 448 668 448 630 454 592 Z";
const SPINOUS = "M 486 528 C 486 450 484 360 488 268 C 490 252 510 252 512 268 C 516 360 514 450 514 528 Z";

export const Deep: React.FC<{
  t: number; w: number; id: string; lit: Partial<Record<DM, number>>; hot?: DM[]; es?: number; ts?: number;
  nerve?: number; post?: number; ant?: number; dimES?: number; groove?: number;
}> = ({ t, w, id, lit, hot = [], es = 0, ts = 0, nerve = 0, post = 0, ant = 0, dimES = 0, groove = 0 }) => {
  const on = (k: DM) => lv(t, lit[k]);
  const H = (k: DM) => hot.includes(k);
  const mir = "translate(1000 0) scale(-1 1)";
  const pulse = (Math.sin(t * 6) + 1) / 2;
  const muscle = (k: DM, side: string) => {
    const o = on(k);
    const isES = k === "IL" || k === "LO" || k === "SP";
    const dim = isES ? dimES : 0;
    return (
      <g key={k + side} opacity={1 - 0.55 * dim}>
        {H(k) && <path d={blobD(k, 10)} fill="none" stroke={C.banana} strokeWidth={12 + 6 * pulse} opacity={0.95} />}
        <path d={blobD(k)} fill="#D99482" stroke={C.forest} strokeWidth={4} />
        {o > 0 && <path d={blobD(k)} fill={HOT[k]} opacity={o} />}
        <path d={blobD(k)} fill={`url(#${id}fasc)`} opacity={0.7} />
        <path d={blobD(k)} fill="none" stroke={H(k) ? C.forest : "rgba(31,42,20,0.85)"} strokeWidth={H(k) ? 6 : 4} />
      </g>
    );
  };
  const half = (side: string) => (
    <g>
      {/* thoracolumbar fascia around the erector spinae */}
      <path d="M 494 268 C 430 270 330 300 230 360 C 166 400 160 500 200 538" fill="none" stroke="rgba(31,42,20,0.45)" strokeWidth={3} strokeDasharray="10 8" />
      {/* bones */}
      <path d={TP} fill="#F3EBD9" stroke={C.forest} strokeWidth={4} />
      <path d={PEDICLE} fill="#F3EBD9" stroke={C.forest} strokeWidth={4} />
      <path d={LAMINA} fill="#F3EBD9" stroke={C.forest} strokeWidth={4} />
      {/* groove highlight between spinous + transverse process */}
      {groove > 0 && <path d="M 486 530 L 486 300 C 440 330 412 380 406 430 C 402 476 418 520 436 550 Z" fill={C.banana} opacity={0.45 * groove} />}
      {es > 0 && (["IL", "LO", "SP"] as DM[]).map((k) => <path key={"es" + k} d={blobD(k, 16)} fill={C.banana} opacity={0.55 * es} />)}
      {ts > 0 && (["SS", "MU", "RO"] as DM[]).map((k) => <path key={"ts" + k} d={blobD(k, 14)} fill="#9CC3E0" opacity={0.6 * ts} />)}
      {(["RO", "MU", "SS", "IL", "LO", "SP"] as DM[]).map((k) => muscle(k, side))}
    </g>
  );
  const nerveLen = (k: number) => ({ strokeDasharray: "600", strokeDashoffset: 600 * (1 - k) });
  return (
    <svg width={w} height={w} viewBox="0 0 1000 1000" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <pattern id={`${id}fasc`} width={26} height={22} patternUnits="userSpaceOnUse">
          <circle cx={7} cy={6} r={6} fill="none" stroke="rgba(110,40,30,0.38)" strokeWidth={1.6} />
          <circle cx={20} cy={8} r={5} fill="none" stroke="rgba(110,40,30,0.32)" strokeWidth={1.4} />
          <circle cx={13} cy={17} r={5.5} fill="none" stroke="rgba(110,40,30,0.35)" strokeWidth={1.5} />
          <circle cx={8} cy={5} r={1.4} fill="rgba(255,240,230,0.6)" />
          <circle cx={19} cy={16} r={1.2} fill="rgba(255,240,230,0.5)" />
        </pattern>
        <pattern id={`${id}spongy`} width={18} height={18} patternUnits="userSpaceOnUse">
          <circle cx={5} cy={6} r={3} fill="none" stroke="rgba(31,42,20,0.22)" strokeWidth={1.6} />
          <circle cx={14} cy={14} r={2.4} fill="none" stroke="rgba(31,42,20,0.18)" strokeWidth={1.4} />
        </pattern>
        <linearGradient id={`${id}skin`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F2DCC8" />
          <stop offset="1" stopColor="#EED6BF" />
        </linearGradient>
      </defs>
      {/* body silhouette: skin + fat (back at the top) */}
      <path d="M 40 300 C 120 210 300 170 470 176 C 485 177 492 190 500 196 C 508 190 515 177 530 176 C 700 170 880 210 960 300 L 960 960 L 40 960 Z" fill={`url(#${id}skin)`} stroke={C.forest} strokeWidth={4} />
      <path d="M 70 318 C 150 240 310 206 470 212 C 486 213 492 224 500 230 C 508 224 514 213 530 212 C 690 206 850 240 930 318 L 930 960 L 70 960 Z" fill="#F6EBD6" stroke="rgba(31,42,20,0.35)" strokeWidth={2.5} />
      {/* superficial back muscles (dim band) */}
      <path d="M 96 334 C 170 268 320 236 486 244 L 486 262 C 330 256 190 288 112 352 Z" fill="#EBD3C8" stroke="rgba(31,42,20,0.55)" strokeWidth={2.5} />
      <path d="M 96 334 C 170 268 320 236 486 244 L 486 262 C 330 256 190 288 112 352 Z" transform={mir} fill="#EBD3C8" stroke="rgba(31,42,20,0.55)" strokeWidth={2.5} />
      {/* vertebral body + canal + cord */}
      <ellipse cx={500} cy={808} rx={150} ry={104} fill="#F3EBD9" stroke={C.forest} strokeWidth={5} />
      <ellipse cx={500} cy={808} rx={132} ry={88} fill={`url(#${id}spongy)`} />
      <circle cx={500} cy={646} r={46} fill="#FBF6EA" stroke={C.forest} strokeWidth={4} />
      <ellipse cx={500} cy={646} rx={31} ry={27} fill="#F2E3A6" stroke="rgba(31,42,20,0.7)" strokeWidth={3} />
      <path d="M 490 640 C 494 650 506 650 510 640" fill="none" stroke="rgba(31,42,20,0.5)" strokeWidth={3} />
      {half("l")}
      <g transform={mir}>{half("r")}</g>
      <path d={SPINOUS} fill="#F3EBD9" stroke={C.forest} strokeWidth={4} />
      {/* spinal nerve (left side): cord → foramen → posterior + anterior rami */}
      {nerve > 0 && (
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 470 648 C 440 650 410 646 380 640" stroke={C.forest} strokeWidth={20} {...nerveLen(nerve)} />
          <path d="M 470 648 C 440 650 410 646 380 640" stroke="#F2D14E" strokeWidth={12} {...nerveLen(nerve)} />
          {post > 0 && (
            <g>
              <path d="M 380 640 C 340 636 300 624 280 606 C 262 590 270 560 296 530 C 310 514 322 500 334 486 M 296 530 C 272 516 254 504 240 494 M 318 506 C 360 492 400 476 430 466" stroke={C.forest} strokeWidth={15} {...nerveLen(post)} />
              <path d="M 380 640 C 340 636 300 624 280 606 C 262 590 270 560 296 530 C 310 514 322 500 334 486 M 296 530 C 272 516 254 504 240 494 M 318 506 C 360 492 400 476 430 466" stroke="#E5251A" strokeWidth={8} {...nerveLen(post)} />
            </g>
          )}
          {ant > 0 && (
            <g>
              <path d="M 380 640 C 340 666 290 700 250 734 C 216 762 180 796 150 826" stroke={C.forest} strokeWidth={15} {...nerveLen(ant)} />
              <path d="M 380 640 C 340 666 290 700 250 734 C 216 762 180 796 150 826" stroke="#9FB7C9" strokeWidth={8} {...nerveLen(ant)} />
            </g>
          )}
        </g>
      )}
      {/* orientation tags */}
      <g fontFamily={FONT} fontWeight={800}>
        <text x={880} y={330} textAnchor="end" fontSize={30} fill={C.matcha}>↑ back</text>
        <text x={500} y={950} textAnchor="middle" fontSize={26} fill="rgba(31,42,20,0.55)">vertebral body · front ↓</text>
      </g>
    </svg>
  );
};
