import React from "react";
import { C, FONT, ramp } from "./kit";

/* Book Plume's own diagram: muscles of the FRONT of the RIGHT arm (anterior compartment), palm forward.
   Lateral / thumb side on the viewer's LEFT, medial / body side on the viewer's RIGHT. viewBox 700 x 1100.
   BI biceps brachii (long head from the top of the humeral head / supraglenoid tubercle, short head from the coracoid → radial tuberosity)
   BR brachialis (lower front of the humerus → ulnar tuberosity, deep to the biceps)
   CB coracobrachialis (coracoid process → middle of the medial humerus)
   NV musculocutaneous nerve (pierces coracobrachialis, runs between biceps and brachialis, ends as the lateral cutaneous nerve of the forearm) */
export type MK = "BI" | "BR" | "CB" | "NV";
export const MNAME: Record<MK, string> = { BI: "biceps brachii", BR: "brachialis", CB: "coracobrachialis", NV: "musculocutaneous n." };
export const MCOL: Record<MK, string> = { BI: "#D2482A", BR: "#1E8C7E", CB: "#7A4FB5", NV: "#E8B400" };
const MHOT: Record<MK, string> = { BI: "#F05A36", BR: "#26B3A0", CB: "#9A6AE0", NV: "#FFD21F" };

export const MANCH: Record<string, [number, number]> = {
  BI: [348, 470], BIL: [300, 300], BIS: [380, 300], BR: [404, 690], BRL: [282, 660], CB: [440, 330], COR: [452, 150],
  NV: [256, 760], NVP: [442, 272], HUM: [300, 130], RT: [304, 806], UT: [372, 840], ELB: [345, 740],
};

const D = {
  BR: "M 270 420 C 320 400 400 404 428 436 C 446 520 444 640 424 724 C 408 776 386 810 368 838 C 346 812 300 774 278 726 C 248 640 240 500 270 420 Z",
  CB: "M 446 160 C 474 190 472 262 456 332 C 442 392 412 448 384 482 C 372 478 374 446 382 410 C 396 340 418 250 434 168 Z",
  BI_BELLY: "M 304 250 C 334 236 376 238 398 258 C 414 330 412 470 396 570 C 384 636 362 676 338 690 C 314 678 296 640 288 572 C 276 470 280 330 304 250 Z",
  BI_LONG: "M 292 66 C 270 92 284 150 296 200 C 300 220 302 236 304 252",
  BI_SHORT: "M 444 162 C 428 198 410 230 390 258",
  BI_TEND: "M 338 686 C 330 730 318 770 304 808",
  APON: "M 346 694 C 378 720 410 744 438 780",
  NV: "M 640 160 C 570 186 490 226 446 268 C 400 316 340 390 312 470 C 286 540 266 640 260 730 C 254 820 248 930 240 1060",
};

const lv = (t: number, t0?: number) => (t0 === undefined ? 0 : ramp(t, t0 - 0.05, t0 + 0.3));

export const Arm: React.FC<{
  t: number; w: number; id: string; lit: Partial<Record<MK, number>>; hot?: MK[]; dimRest?: number;
  lift?: number; nerve?: number; heads?: number; bones?: number; supinate?: number;
}> = ({ t, w, id, lit, hot = [], dimRest = 0, lift = 0, nerve = 0, heads = 0, bones = 1, supinate = 0 }) => {
  const pulse = (Math.sin(t * 6) + 1) / 2;
  const h = (w * 1100) / 700;
  const op = (k: MK) => (hot.includes(k) || !hot.length ? 1 : 1 - 0.6 * dimRest);
  const fill = (k: MK) => {
    const o = lv(t, lit[k]);
    return { o, col: hot.includes(k) ? MHOT[k] : MCOL[k] };
  };
  const Muscle: React.FC<{ k: MK; d: string; extra?: number }> = ({ k, d, extra = 1 }) => {
    const { o, col } = fill(k);
    const H = hot.includes(k);
    return (
      <g opacity={op(k) * extra}>
        {H && <path d={d} fill="none" stroke={C.banana} strokeWidth={26 + 10 * pulse} strokeLinejoin="round" opacity={0.95} />}
        <path d={d} fill="#D9BCA6" stroke={C.forest} strokeWidth={5} strokeLinejoin="round" />
        {o > 0 && <path d={d} fill={col} opacity={o} />}
        <path d={d} fill={`url(#${id}fib)`} opacity={0.5} />
        <path d={d} fill="none" stroke={C.forest} strokeWidth={5} strokeLinejoin="round" />
      </g>
    );
  };
  const bi = fill("BI");
  const biH = hot.includes("BI");
  const biOp = op("BI") * (1 - 0.72 * lift);
  const nvL = 1400;
  return (
    <svg width={w} height={h} viewBox="0 0 700 1100" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={`${id}skin`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#EED8C0" />
          <stop offset="0.5" stopColor="#F6E6D3" />
          <stop offset="1" stopColor="#ECD3BA" />
        </linearGradient>
        <pattern id={`${id}fib`} width={14} height={14} patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
          <line x1={0} y1={0} x2={0} y2={14} stroke="rgba(255,255,255,0.35)" strokeWidth={2.5} />
        </pattern>
      </defs>
      {/* chest edge on the medial side */}
      <path d="M 700 0 L 700 300 C 640 270 570 250 510 252 C 500 180 470 90 450 0 Z" fill="#EBD1B7" stroke="rgba(31,42,20,0.35)" strokeWidth={3} />
      <text x={610} y={110} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill="rgba(31,42,20,0.45)">chest</text>
      {/* arm silhouette (shoulder → upper forearm) */}
      <path d="M 210 20 C 150 50 136 130 152 220 C 170 330 196 450 204 560 C 210 640 200 700 206 770 C 214 880 226 990 236 1100 L 470 1100 C 480 990 500 880 506 770 C 510 700 504 640 500 560 C 496 450 494 350 508 254 C 480 190 462 100 452 20 C 380 2 270 2 210 20 Z"
        fill={`url(#${id}skin)`} stroke="rgba(31,42,20,0.55)" strokeWidth={4} strokeLinejoin="round" />
      {/* bones */}
      <g opacity={bones}>
        <path d="M 236 760 C 250 800 262 900 262 1100 L 300 1100 C 300 930 300 830 292 790 Z" fill="#F3EEDD" stroke="rgba(31,42,20,0.5)" strokeWidth={3} />
        <path d="M 372 770 C 380 820 392 940 396 1100 L 436 1100 C 432 940 426 830 420 760 Z" fill="#F3EEDD" stroke="rgba(31,42,20,0.5)" strokeWidth={3} />
        <path d="M 276 160 C 284 300 300 520 312 690 C 270 700 250 720 254 752 C 300 770 400 772 436 750 C 440 716 416 696 380 690 C 370 520 352 300 336 160 Z" fill="#F3EEDD" stroke="rgba(31,42,20,0.5)" strokeWidth={3} />
        <circle cx={300} cy={118} r={64} fill="#F3EEDD" stroke="rgba(31,42,20,0.5)" strokeWidth={3} />
        {/* scapula: coracoid process hooking forward */}
        <path d="M 560 70 C 520 84 470 110 446 136 C 432 152 438 168 456 164 C 486 156 520 142 568 120 Z" fill="#F3EEDD" stroke="rgba(31,42,20,0.6)" strokeWidth={4} />
      </g>
      {/* deltoid (faint, cut) */}
      <path d="M 210 20 C 150 50 136 130 152 220 C 166 290 190 330 214 350 C 230 290 246 210 258 150 C 268 100 260 50 240 18 Z" fill="rgba(200,150,120,0.22)" stroke="rgba(31,42,20,0.25)" strokeWidth={3} />
      <Muscle k="BR" d={D.BR} />
      <Muscle k="CB" d={D.CB} />
      {/* musculocutaneous nerve */}
      {nerve > 0 && (
        <g opacity={hot.length && !hot.includes("NV") ? 1 - 0.5 * dimRest : 1}>
          <path d={D.NV} fill="none" stroke={C.forest} strokeWidth={22} strokeLinecap="round" strokeDasharray={`${nvL * nerve} ${nvL}`} />
          <path d={D.NV} fill="none" stroke={hot.includes("NV") ? MHOT.NV : MCOL.NV} strokeWidth={13} strokeLinecap="round" strokeDasharray={`${nvL * nerve} ${nvL}`} />
          {nerve > 0.2 && <circle cx={442} cy={272} r={22 + 6 * pulse} fill="none" stroke="#111" strokeWidth={5} opacity={ramp(nerve, 0.2, 0.35)} />}
        </g>
      )}
      {/* biceps: long + short head tendons, belly, tendon to the radius, aponeurosis */}
      <g opacity={biOp}>
        {biH && (
          <g fill="none" stroke={C.banana} strokeLinecap="round" strokeLinejoin="round" opacity={0.95}>
            <path d={D.BI_BELLY} strokeWidth={26 + 10 * pulse} />
            <path d={D.BI_LONG} strokeWidth={36 + 10 * pulse} />
            <path d={D.BI_SHORT} strokeWidth={36 + 10 * pulse} />
            <path d={D.BI_TEND} strokeWidth={40 + 10 * pulse} />
          </g>
        )}
        {[D.BI_LONG, D.BI_SHORT, D.BI_TEND].map((d, i) => (
          <g key={i}>
            <path d={d} fill="none" stroke={C.forest} strokeWidth={i === 2 ? 30 : 24} strokeLinecap="round" />
            <path d={d} fill="none" stroke="#F4EFE2" strokeWidth={i === 2 ? 20 : 14} strokeLinecap="round" />
          </g>
        ))}
        <path d={D.APON} fill="none" stroke="rgba(244,239,226,0.9)" strokeWidth={14} strokeLinecap="round" />
        <path d={D.BI_BELLY} fill="#D9BCA6" stroke={C.forest} strokeWidth={5} />
        {bi.o > 0 && <path d={D.BI_BELLY} fill={bi.col} opacity={bi.o} />}
        <path d={D.BI_BELLY} fill={`url(#${id}fib)`} opacity={0.5} />
        {/* line between the two heads */}
        <path d="M 350 252 C 348 340 346 450 342 560" fill="none" stroke="rgba(31,42,20,0.45)" strokeWidth={4} strokeDasharray="12 9" />
        <path d={D.BI_BELLY} fill="none" stroke={C.forest} strokeWidth={5} />
      </g>
      {heads > 0 && (
        <g fontFamily={FONT} fontWeight={800} opacity={heads}>
          <text x={286} y={196} textAnchor="end" fontSize={30} fill="#fff" stroke={C.forest} strokeWidth={8} paintOrder="stroke">LONG</text>
          <text x={404} y={222} textAnchor="end" fontSize={30} fill="#fff" stroke={C.forest} strokeWidth={8} paintOrder="stroke">SHORT</text>
        </g>
      )}
      {supinate > 0 && (
        <g opacity={Math.min(1, supinate * 3)} transform="translate(300 960)">
          <path d={`M -90 0 A 90 40 0 1 0 ${90 * Math.cos(Math.PI * (1 - supinate))} ${-40 * Math.sin(Math.PI * (1 - supinate))}`} fill="none" stroke="#111" strokeWidth={14} strokeLinecap="round" />
          <path d={`M -90 0 A 90 40 0 1 0 ${90 * Math.cos(Math.PI * (1 - supinate))} ${-40 * Math.sin(Math.PI * (1 - supinate))}`} fill="none" stroke={C.banana} strokeWidth={8} strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
};
