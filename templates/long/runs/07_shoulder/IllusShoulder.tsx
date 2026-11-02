import React from "react";
import { C, FONT, ramp } from "./kit";

/* ======================================================================
   Book Plume own illustrations for "Shoulder Anatomy Made Easy".
   All views: the person's MIDLINE is on the LEFT of the drawing, LATERAL (the arm) on the RIGHT.
   ShoulderFront = shoulder girdle from the front (sternum, ribs, clavicle, scapula behind ribs, humerus) + the 4 joints.
   Cuff         = scapula + humerus with the rotator cuff muscles, view "back" (supra, infra, teres minor, teres major dim) or "front" (subscapularis).
   CuffRing     = the cuff seen from the side, wrapped around the humeral head like a cuff (S top, I + T back, S front).
   JointSection = coronal section of the glenohumeral joint (glenoid, labrum, head, capsule, acromion, supraspinatus, bursa, deltoid).
   ArmRaise     = body from behind raising the right arm (abduction 0 -> 180) with the muscle for each range.
   RotateTop    = seen from above: elbow bent, forearm turning out (lateral rotation) or in (medial rotation).
   `lit` maps a part id -> time (s) it lights up, or {a,b} window.
   ====================================================================== */

type Win = { a: number; b?: number };
export type Lit = Record<string, Win | number | undefined>;
export const win = (t: number, w?: Win | number) => {
  if (w === undefined) return 0;
  const a = typeof w === "number" ? w : w.a;
  const b = typeof w === "number" ? undefined : w.b;
  return ramp(t, a, a + 0.3) * (b === undefined ? 1 : 1 - ramp(t, b, b + 0.3));
};
export const mix = (a: string, b: string, k: number) => {
  const p = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const x = p(a), y = p(b);
  return "#" + x.map((v, i) => Math.round(v + (y[i] - v) * Math.max(0, Math.min(1, k))).toString(16).padStart(2, "0")).join("");
};

/* muscle colours, used everywhere (diagrams, cards, mnemonic) */
export const MC: Record<string, string> = { supra: "#EE9C86", infra: "#86BEDA", tmin: "#9FCB8C", subs: "#C2A3DC", delt: "#E7B98F", tmaj: "#CFC8B0", trap: "#B7D3A0", serr: "#F0C987" };
export const MNAME: Record<string, string> = { supra: "Supraspinatus", infra: "Infraspinatus", tmin: "Teres minor", subs: "Subscapularis" };
const BONE = "#F4ECD2", BONE_D = "#D9CBA0", LINE = "#7C6B45";
const MUS_LINE = "#8A4E3E";

const Defs: React.FC<{ id: string }> = ({ id }) => (
  <defs>
    <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#FFF9E8" />
      <stop offset="55%" stopColor={BONE} />
      <stop offset="100%" stopColor={BONE_D} />
    </linearGradient>
    <radialGradient id={`${id}lit`} cx="40%" cy="35%" r="75%">
      <stop offset="0%" stopColor="#FFFAE0" />
      <stop offset="60%" stopColor="#F7E39A" />
      <stop offset="100%" stopColor="#E3C25A" />
    </radialGradient>
    <radialGradient id={`${id}head`} cx="38%" cy="32%" r="80%">
      <stop offset="0%" stopColor="#FFFDF2" />
      <stop offset="60%" stopColor={BONE} />
      <stop offset="100%" stopColor={BONE_D} />
    </radialGradient>
    <pattern id={`${id}fib`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-25)">
      <line x1="0" y1="3" x2="14" y2="3" stroke="#5B2E24" strokeWidth="1.6" opacity="0.22" />
      <line x1="0" y1="10" x2="14" y2="10" stroke="#5B2E24" strokeWidth="1.1" opacity="0.15" />
    </pattern>
    <pattern id={`${id}sp`} width="12" height="12" patternUnits="userSpaceOnUse">
      <circle cx="3" cy="4" r="1.4" fill="#B9A97C" opacity="0.45" />
      <circle cx="9" cy="9" r="1.1" fill="#B9A97C" opacity="0.35" />
    </pattern>
    <filter id={`${id}gl`} x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="9" />
    </filter>
    <filter id={`${id}sh`} x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#1F2A14" floodOpacity="0.18" />
    </filter>
  </defs>
);

/** bone part that glows banana when lit */
const Bone: React.FC<{ id: string; d: string; k: number; dim?: number; sw?: number; fill?: string; dash?: boolean; op?: number }> = ({ id, d, k, dim = 1, sw = 4, fill, dash, op = 1 }) => {
  const kk = Math.max(0, Math.min(1, k));
  return (
    <g opacity={(dim + (1 - dim) * kk) * op}>
      {kk > 0.01 && <path d={d} fill={C.banana} opacity={0.55 * kk} filter={`url(#${id}gl)`} />}
      <path d={d} fill={kk > 0.5 ? `url(#${id}lit)` : fill || `url(#${id}b)`} stroke={mix(LINE, C.forest, kk)} strokeWidth={sw} strokeLinejoin="round" strokeDasharray={dash ? "10 8" : undefined} />
    </g>
  );
};
/** muscle: colour + fibre texture; brightens + glows when lit */
const Muscle: React.FC<{ id: string; d: string; col: string; k: number; dim?: number; base?: number }> = ({ id, d, col, k, dim = 1, base = 0.55 }) => {
  const kk = Math.max(0, Math.min(1, k));
  return (
    <g opacity={dim + (1 - dim) * kk}>
      {kk > 0.01 && <path d={d} fill={col} opacity={0.75 * kk} filter={`url(#${id}gl)`} />}
      <path d={d} fill={mix("#E9DCCB", col, base + (1 - base) * kk)} stroke={mix(MUS_LINE, C.forest, kk)} strokeWidth={kk > 0.5 ? 5 : 3.5} strokeLinejoin="round" />
      <path d={d} fill={`url(#${id}fib)`} />
    </g>
  );
};
/** pulsing ring marker with a number */
const Ring: React.FC<{ x: number; y: number; k: number; n: string; t: number; col?: string }> = ({ x, y, k, n, t, col = C.red }) => {
  if (k <= 0.01) return null;
  const pulse = 1 + 0.12 * Math.sin(t * 5);
  return (
    <g opacity={k} transform={`translate(${x} ${y}) scale(${(0.6 + 0.4 * k) * pulse})`}>
      <circle r={34} fill="none" stroke={col} strokeWidth={7} />
      <circle r={20} fill={col} />
      <text y={9} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={C.paper}>{n}</text>
    </g>
  );
};

/* ------------------------------------------------------------------
   ShoulderFront — viewBox 0 0 900 760 (front view, midline left)
   ------------------------------------------------------------------ */
export const SF: Record<string, [number, number]> = {
  sternum: [105, 330], clav: [360, 214], scap: [430, 470], acro: [640, 150], cora: [548, 245], glen: [588, 300], head: [640, 280],
  gt: [712, 292], lt: [648, 352], groove: [676, 400], hum: [650, 600], jSC: [150, 214], jAC: [585, 170], jGH: [596, 300], jST: [400, 470], rib: [300, 330],
};
export const ShoulderFront: React.FC<{ t: number; w?: number; lit?: Lit; dim?: number; joints?: Lit; draw?: number }> = ({ t, w = 700, lit = {}, dim = 1, joints = {}, draw }) => {
  const id = "sf";
  const L = (p: string) => win(t, lit[p]);
  const all = L("all");
  const d = draw === undefined ? 1 : ramp(t, draw, draw + 0.8);
  const ribs = [
    "M150 262 C 230 250, 330 252, 420 285",
    "M150 330 C 250 316, 360 322, 455 370",
    "M150 400 C 260 390, 380 400, 470 460",
    "M150 470 C 270 466, 390 480, 470 548",
    "M150 535 C 270 540, 380 560, 455 630",
  ];
  return (
    <svg width={w} height={(w * 760) / 900} viewBox="0 0 900 760" style={{ overflow: "visible", opacity: d }}>
      <Defs id={id} />
      {/* ribs (behind) */}
      <g opacity={0.55 + 0.45 * L("rib")}>
        {ribs.map((r, i) => (
          <g key={i}>
            <path d={r} fill="none" stroke={LINE} strokeWidth={30} strokeLinecap="round" />
            <path d={r} fill="none" stroke={L("rib") > 0.5 ? "#F7E39A" : BONE} strokeWidth={23} strokeLinecap="round" />
          </g>
        ))}
      </g>
      {/* scapula, lying BEHIND the ribs */}
      <Bone id={id} d="M330 215 C 400 222, 470 226, 520 232 C 548 240, 566 262, 572 288 C 574 318, 560 340, 548 360 C 520 440, 480 540, 440 640 C 425 660, 405 655, 400 630 C 380 520, 350 380, 330 215 Z" k={Math.max(L("scap"), all)} dim={dim} dash op={0.8} />
      {/* sternum */}
      <Bone id={id} d="M70 170 C 90 160, 130 160, 150 170 C 162 200, 160 240, 150 270 L 148 590 C 140 620, 80 620, 72 590 L 70 270 C 60 240, 58 200, 70 170 Z" k={Math.max(L("sternum"), all)} dim={dim} />
      <path d="M85 172 Q 110 190 135 172" fill="none" stroke={LINE} strokeWidth={4} opacity={0.7} />
      <path d="M72 280 Q 110 290 150 280" fill="none" stroke={LINE} strokeWidth={3} opacity={0.6} />
      {/* humerus shaft + head */}
      <Bone id={id} d="M606 330 C 612 420, 606 560, 604 760 L 690 760 C 688 600, 684 460, 690 360 C 700 330, 730 320, 742 296 C 750 270, 740 246, 722 238 C 700 300, 650 330, 606 330 Z" k={Math.max(L("hum"), all)} dim={dim} />
      <Bone id={id} d="M676 226 C 716 232, 748 262, 746 296 C 744 324, 728 344, 704 352 C 690 320, 690 260, 676 226 Z" k={Math.max(L("gt"), all)} dim={dim} />
      <g>
        {L("head") > 0.01 && <circle cx={640} cy={280} r={66} fill={C.banana} opacity={0.55 * L("head")} filter={`url(#${id}gl)`} />}
        <circle cx={640} cy={280} r={64} fill={L("head") > 0.5 || all > 0.5 ? `url(#${id}lit)` : `url(#${id}head)`} stroke={mix(LINE, C.forest, L("head"))} strokeWidth={4} opacity={dim + (1 - dim) * Math.max(L("head"), all)} />
      </g>
      {/* greater + lesser tubercle, groove */}
      <Bone id={id} d="M626 336 C 640 326, 664 328, 670 344 C 674 362, 660 376, 642 374 C 628 370, 620 352, 626 336 Z" k={Math.max(L("lt"), all)} dim={dim} />
      <path d="M680 336 C 684 380, 680 430, 676 470" fill="none" stroke={mix(LINE, C.red, L("groove"))} strokeWidth={6 + 4 * L("groove")} strokeLinecap="round" />
      {L("biceps") > 0.01 && <path d="M600 262 C 640 250, 676 290, 680 340 C 684 400, 678 470, 674 560" fill="none" stroke={MC.supra} strokeWidth={12} strokeLinecap="round" opacity={L("biceps")} />}
      {/* glenoid rim (socket, edge-on) */}
      <path d="M582 248 C 570 270, 570 320, 584 346" fill="none" stroke={mix(LINE, C.red, L("glen"))} strokeWidth={7 + 5 * L("glen")} strokeLinecap="round" />
      {/* coracoid */}
      <Bone id={id} d="M498 232 C 520 214, 562 216, 582 236 C 590 252, 576 266, 560 258 C 546 250, 524 250, 506 254 Z" k={Math.max(L("cora"), all)} dim={dim} />
      {/* clavicle */}
      <Bone id={id} d="M150 190 C 232 168, 304 222, 392 208 C 470 196, 530 160, 590 154 L 596 182 C 540 188, 478 228, 394 236 C 300 246, 226 198, 152 228 C 140 222, 140 196, 150 190 Z" k={Math.max(L("clav"), all)} dim={dim} />
      {/* acromion */}
      <Bone id={id} d="M570 162 C 600 132, 664 128, 690 154 C 702 172, 680 194, 640 196 C 610 196, 586 190, 570 182 Z" k={Math.max(L("acro"), all)} dim={dim} />
      {/* joint markers */}
      <Ring x={150} y={214} k={win(t, joints.jSC)} n="1" t={t} />
      <Ring x={585} y={170} k={win(t, joints.jAC)} n="2" t={t} />
      <Ring x={400} y={470} k={win(t, joints.jST)} n="3" t={t} col={C.matcha} />
      <Ring x={596} y={300} k={win(t, joints.jGH)} n="4" t={t} />
      {win(t, joints.jST) > 0.01 && (
        <g opacity={win(t, joints.jST)} transform={`translate(0 ${Math.sin(t * 3) * 14})`}>
          <path d="M470 380 L 470 330 M455 345 L 470 325 L 485 345" stroke={C.matcha} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M470 560 L 470 610 M455 595 L 470 615 L 485 595" stroke={C.matcha} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </svg>
  );
};

/* ------------------------------------------------------------------
   Cuff — viewBox 0 0 900 760. view "back": supraspinatus / infraspinatus / teres minor (+ teres major, dim, NOT cuff)
   view "front": subscapularis -> lesser tubercle. Midline left, arm right.
   ------------------------------------------------------------------ */
export const CB: Record<string, [number, number]> = {
  supra: [400, 222], infra: [430, 400], tmin: [560, 420], tmaj: [470, 560], spine: [470, 262], acro: [690, 168], head: [712, 300], gt: [770, 290],
  gtTop: [752, 240], gtMid: [776, 282], gtLow: [772, 322], fossaS: [380, 225], fossaI: [400, 420], lat: [470, 520], med: [235, 400], inf: [345, 680], hum: [715, 600],
  subs: [400, 400], lt: [690, 345], cora: [600, 238], glen: [618, 300], fossaSub: [390, 420],
};
export const Cuff: React.FC<{ t: number; w?: number; view?: "back" | "front"; lit?: Lit; dim?: number; muscles?: number; tmaj?: number; draw?: number; tendons?: number }> = ({ t, w = 700, view = "back", lit = {}, dim = 1, muscles = 1, tmaj = 1, draw, tendons = 0 }) => {
  const id = "cf" + view;
  const L = (p: string) => win(t, lit[p]);
  const d = draw === undefined ? 1 : ramp(t, draw, draw + 0.8);
  const scap = "M232 168 C 330 182, 450 196, 520 205 C 560 212, 592 236, 606 262 C 612 296, 600 318, 584 330 C 540 420, 440 560, 360 688 C 340 704, 320 696, 318 676 C 300 560, 262 380, 232 168 Z";
  const hum = "M676 330 C 684 430, 682 560, 680 760 L 754 760 C 752 600, 748 470, 752 360 C 770 338, 790 318, 792 290 C 794 262, 778 240, 760 232 C 740 296, 712 324, 676 330 Z";
  return (
    <svg width={w} height={(w * 760) / 900} viewBox="0 0 900 760" style={{ overflow: "visible", opacity: d }}>
      <Defs id={id} />
      <Bone id={id} d={scap} k={L("scap")} dim={dim} />
      {view === "back" && (
        <>
          {/* fossa shading + spine of scapula */}
          <path d="M248 300 C 360 280, 520 250, 640 186" fill="none" stroke={LINE} strokeWidth={4} opacity={0.4} />
          {L("fossaS") > 0.01 && <path d="M240 182 C 360 192, 480 205, 560 220 C 520 240, 400 262, 250 292 Z" fill={C.banana} opacity={0.8 * L("fossaS")} />}
          {L("fossaI") > 0.01 && <path d="M252 310 C 380 290, 520 270, 590 290 C 560 380, 460 520, 362 660 C 330 560, 280 420, 252 310 Z" fill={C.banana} opacity={0.8 * L("fossaI")} />}
        </>
      )}
      {view === "front" && L("fossaSub") > 0.01 && <path d={scap} fill={C.banana} opacity={0.8 * L("fossaSub")} />}
      <Bone id={id} d={hum} k={L("hum")} dim={dim} />
      <g>
        {L("head") > 0.01 && <circle cx={712} cy={292} r={64} fill={C.banana} opacity={0.6 * L("head")} filter={`url(#${id}gl)`} />}
        <circle cx={712} cy={292} r={60} fill={L("head") > 0.5 ? `url(#${id}lit)` : `url(#${id}head)`} stroke={LINE} strokeWidth={4} opacity={dim + (1 - dim) * L("head")} />
      </g>
      {view === "back" && <Bone id={id} d="M740 236 C 772 236, 800 262, 798 296 C 796 326, 780 344, 760 350 C 754 310, 748 270, 740 236 Z" k={L("gt")} dim={dim} />}
      {view === "front" && (
        <>
          <Bone id={id} d="M760 244 C 782 252, 794 272, 792 296 C 790 320, 778 336, 764 342 C 770 310, 770 276, 760 244 Z" k={L("gt")} dim={dim} />
          <Bone id={id} d="M672 320 C 686 310, 708 314, 712 332 C 716 352, 700 366, 684 362 C 670 356, 664 336, 672 320 Z" k={L("lt")} dim={dim} />
        </>
      )}
      {/* muscles */}
      <g opacity={muscles}>
        {view === "back" ? (
          <>
            <g opacity={tmaj}>
              <Muscle id={id} d="M322 640 C 400 572, 540 486, 676 420 L 682 462 C 560 512, 430 600, 354 690 Z" col={MC.tmaj} k={L("tmaj")} dim={dim * 0.8} base={0.35} />
            </g>
            <Muscle id={id} d="M250 306 C 380 290, 520 272, 610 270 C 668 268, 724 266, 782 270 L 780 300 C 724 302, 660 306, 612 322 C 530 370, 440 470, 370 600 C 330 560, 280 450, 250 306 Z" col={MC.infra} k={L("infra")} dim={dim} />
            <Muscle id={id} d="M600 328 C 650 314, 724 304, 780 304 L 776 334 C 720 336, 654 350, 606 378 C 540 420, 470 500, 418 568 L 384 548 C 444 466, 522 374, 600 328 Z" col={MC.tmin} k={L("tmin")} dim={dim} />
            <Muscle id={id} d="M240 180 C 360 184, 470 196, 560 214 L 604 230 C 650 224, 706 222, 758 234 L 752 256 C 704 250, 646 256, 596 262 C 480 266, 340 286, 250 300 Z" col={MC.supra} k={L("supra")} dim={dim} />
            {/* spine of scapula (bone ridge over the muscles) */}
            <Bone id={id} d="M246 296 C 360 276, 500 246, 610 196 L 640 176 C 650 196, 640 206, 620 214 C 520 262, 380 296, 256 318 Z" k={L("spine")} dim={dim} />
          </>
        ) : (
          <>
            <Muscle id={id} d="M240 184 C 350 196, 470 208, 560 220 C 600 240, 640 286, 676 318 L 690 352 C 650 372, 610 390, 576 404 C 500 480, 420 590, 364 676 C 330 600, 280 420, 240 184 Z" col={MC.subs} k={L("subs")} dim={dim} />
            {/* coracoid, pointing forward (toward the viewer) */}
            <Bone id={id} d="M540 222 C 566 200, 610 198, 632 216 C 644 232, 632 250, 614 246 C 596 240, 574 244, 556 252 Z" k={L("cora")} dim={dim} />
          </>
        )}
      </g>
      {/* acromion on top: the supraspinatus tendon passes UNDER it */}
      <Bone id={id} d="M600 196 C 630 160, 700 140, 744 160 C 760 176, 744 198, 708 206 C 670 212, 630 214, 604 214 Z" k={L("acro")} dim={dim} />
      {/* insertion dots */}
      {tendons > 0.01 && view === "back" && (
        <g opacity={tendons}>
          {([["gtTop", MC.supra, "S"], ["gtMid", MC.infra, "I"], ["gtLow", MC.tmin, "T"]] as const).map(([p, col, n]) => (
            <g key={p} transform={`translate(${CB[p][0]} ${CB[p][1]})`}>
              <circle r={22} fill={col} stroke={C.forest} strokeWidth={4} />
              <text y={9} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.forest}>{n}</text>
            </g>
          ))}
        </g>
      )}
      {tendons > 0.01 && view === "front" && (
        <g opacity={tendons} transform={`translate(${CB.lt[0]} ${CB.lt[1]})`}>
          <circle r={22} fill={MC.subs} stroke={C.forest} strokeWidth={4} />
          <text y={9} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.forest}>S</text>
        </g>
      )}
    </svg>
  );
};

/* ------------------------------------------------------------------
   CuffRing — viewBox 0 0 700 700, side view of the humeral head wrapped by the 4 tendons
   ------------------------------------------------------------------ */
const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p = (a: number) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
};
export const RING: { id: string; a0: number; a1: number; letter: string }[] = [
  { id: "supra", a0: 236, a1: 304, letter: "S" },
  { id: "infra", a0: 168, a1: 228, letter: "I" },
  { id: "tmin", a0: 122, a1: 160, letter: "T" },
  { id: "subs", a0: -42, a1: 58, letter: "S" },
];
export const ringPt = (id: string, r = 200): [number, number] => {
  const q = RING.find((x) => x.id === id)!;
  const a = (((q.a0 + q.a1) / 2) * Math.PI) / 180;
  return [350 + r * Math.cos(a), 350 + r * Math.sin(a)];
};
export const CuffRing: React.FC<{ t: number; w?: number; lit?: Lit; show?: number; letters?: number; squeeze?: number; dim?: number }> = ({ t, w = 600, lit = {}, show = 1, letters = 0, squeeze = 0, dim = 1 }) => {
  const id = "cr";
  const L = (p: string) => win(t, lit[p]);
  const pull = squeeze * (0.5 + 0.5 * Math.sin(t * 4));
  return (
    <svg width={w} height={w} viewBox="0 0 700 700" style={{ overflow: "visible" }}>
      <Defs id={id} />
      <text x={350} y={40} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={C.matcha} letterSpacing={4}>TOP</text>
      <text x={40} y={360} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={C.matcha} letterSpacing={4} transform="rotate(-90 40 360)">BACK</text>
      <text x={664} y={360} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={C.matcha} letterSpacing={4} transform="rotate(90 664 360)">FRONT</text>
      {/* humeral head */}
      <circle cx={350} cy={350} r={150 - pull * 4} fill={L("head") > 0.5 ? `url(#${id}lit)` : `url(#${id}head)`} stroke={LINE} strokeWidth={5} />
      <circle cx={350} cy={350} r={110} fill="none" stroke={LINE} strokeWidth={2} opacity={0.35} strokeDasharray="6 8" />
      <text x={350} y={345} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.forest} opacity={0.75}>head of</text>
      <text x={350} y={382} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.forest} opacity={0.75}>humerus</text>
      {RING.map((q, i) => {
        const k = L(q.id);
        const s = ramp(show, i * 0.22, i * 0.22 + 0.3);
        if (s <= 0) return null;
        const col = MC[q.id];
        const r = 200 - pull * 10;
        return (
          <g key={q.id} opacity={s * (dim + (1 - dim) * k)}>
            {k > 0.01 && <path d={arc(350, 350, r, q.a0, q.a1)} stroke={col} strokeWidth={110} fill="none" opacity={0.6 * k} filter={`url(#${id}gl)`} />}
            <path d={arc(350, 350, r, q.a0, q.a1)} stroke={C.forest} strokeWidth={86 + 8 * k} fill="none" strokeLinecap="round" />
            <path d={arc(350, 350, r, q.a0, q.a1)} stroke={mix("#E9DCCB", col, 0.6 + 0.4 * k)} strokeWidth={78 + 8 * k} fill="none" strokeLinecap="round" />
            <path d={arc(350, 350, r, q.a0, q.a1)} stroke={`url(#${id}fib)`} strokeWidth={78} fill="none" strokeLinecap="round" />
          </g>
        );
      })}
      {letters > 0.01 &&
        RING.map((q) => {
          const [x, y] = ringPt(q.id, 200 - pull * 10);
          return (
            <g key={q.id} opacity={letters} transform={`translate(${x} ${y})`}>
              <circle r={30} fill={C.forest} />
              <text y={12} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill={C.banana}>{q.letter}</text>
            </g>
          );
        })}
    </svg>
  );
};

/* ------------------------------------------------------------------
   JointSection — viewBox 0 0 900 700 (coronal cut, midline left, lateral right)
   ------------------------------------------------------------------ */
export const JS: Record<string, [number, number]> = {
  glen: [318, 350], lab: [330, 244], labB: [330, 456], head: [470, 350], cap: [430, 545], acro: [470, 128], supra: [200, 196], tendon: [560, 214],
  bursa: [520, 176], delt: [745, 380], gt: [598, 268], scap: [190, 420], cart: [342, 350],
};
export const JointSection: React.FC<{ t: number; w?: number; lit?: Lit; dim?: number; supra?: number; delt?: number; bursa?: number; cap?: number; acro?: number; down?: number; up?: number }> = ({ t, w = 760, lit = {}, dim = 1, supra = 1, delt = 1, bursa = 1, cap = 1, acro = 1, down = 0, up = 0 }) => {
  const id = "js";
  const L = (p: string) => win(t, lit[p]);
  const hy = -up * 40 + down * 0;
  return (
    <svg width={w} height={(w * 700) / 900} viewBox="0 0 900 700" style={{ overflow: "visible" }}>
      <Defs id={id} />
      {/* scapula (neck + glenoid) */}
      <Bone id={id} d="M40 300 C 120 280, 220 250, 300 236 C 318 232, 330 240, 334 250 C 322 290, 322 410, 334 450 C 330 462, 318 468, 300 464 C 220 450, 120 420, 40 400 Z" k={L("scap")} dim={dim} />
      <path d="M332 250 C 322 290, 322 410, 332 450" fill="none" stroke={mix("#9CC3D8", C.red, L("glen"))} strokeWidth={10 + 6 * L("glen")} strokeLinecap="round" opacity={dim + (1 - dim) * L("glen")} />
      {/* glenoid labrum (top + bottom rim) */}
      <g opacity={dim + (1 - dim) * L("lab")}>
        {L("lab") > 0.01 && <g filter={`url(#${id}gl)`} opacity={0.9 * L("lab")}><path d="M318 232 L 362 252 L 330 270 Z" fill={C.banana} /><path d="M318 468 L 362 448 L 330 430 Z" fill={C.banana} /></g>}
        <path d="M316 230 L 364 252 L 332 272 Z" fill={L("lab") > 0.5 ? "#F2D14E" : "#BFD9E6"} stroke={C.forest} strokeWidth={3.5} strokeLinejoin="round" />
        <path d="M316 470 L 364 448 L 332 428 Z" fill={L("lab") > 0.5 ? "#F2D14E" : "#BFD9E6"} stroke={C.forest} strokeWidth={3.5} strokeLinejoin="round" />
      </g>
      {/* humerus: head + shaft */}
      <g transform={`translate(0 ${hy})`}>
        <Bone id={id} d="M440 450 C 470 520, 500 600, 506 700 L 606 700 C 600 600, 596 520, 610 430 C 630 360, 640 300, 620 262 C 600 236, 574 236, 560 250 C 560 330, 520 410, 440 450 Z" k={L("hum")} dim={dim} />
        <g opacity={dim + (1 - dim) * L("head")}>
          {L("head") > 0.01 && <circle cx={470} cy={350} r={124} fill={C.banana} opacity={0.5 * L("head")} filter={`url(#${id}gl)`} />}
          <circle cx={470} cy={350} r={120} fill={L("head") > 0.5 ? `url(#${id}lit)` : `url(#${id}head)`} stroke={LINE} strokeWidth={4} />
          <path d="M352 290 A 120 120 0 0 1 560 260" fill="none" stroke="#9CC3D8" strokeWidth={8} opacity={0.8} />
          <path d="M352 410 A 120 120 0 0 0 440 466" fill="none" stroke="#9CC3D8" strokeWidth={8} opacity={0.8} />
          <path d="M352 290 A 120 120 0 0 0 352 410" fill="none" stroke="#9CC3D8" strokeWidth={8} opacity={0.8} />
          <path d="M470 350 m-80 0 a 80 80 0 1 0 160 0 a 80 80 0 1 0 -160 0" fill={`url(#${id}sp)`} opacity={0.6} />
        </g>
        <Bone id={id} d="M570 246 C 596 232, 628 246, 636 276 C 640 300, 630 318, 616 324 C 604 296, 590 268, 570 246 Z" k={L("gt")} dim={dim} />
      </g>
      {/* joint capsule (loose, with a lower fold) */}
      <g opacity={cap * (dim + (1 - dim) * L("cap"))}>
        {L("cap") > 0.01 && <path d="M326 232 C 380 196, 520 200, 590 240 M326 468 C 340 560, 420 600, 470 560 C 500 530, 500 500, 520 480" stroke={C.banana} strokeWidth={30} fill="none" opacity={0.7 * L("cap")} filter={`url(#${id}gl)`} />}
        <path d="M326 232 C 380 196, 520 200, 590 240" stroke={mix("#7FA7BD", C.forest, L("cap"))} strokeWidth={9} fill="none" strokeLinecap="round" />
        <path d="M326 468 C 340 560, 420 600, 470 560 C 500 530, 500 500, 520 480" stroke={mix("#7FA7BD", C.forest, L("cap"))} strokeWidth={9} fill="none" strokeLinecap="round" />
      </g>
      {/* deltoid (outer layer) */}
      <g opacity={delt}>
        <Muscle id={id} d="M600 90 C 700 90, 790 160, 800 280 C 810 400, 780 520, 700 620 L 660 610 C 700 520, 720 420, 712 320 C 704 230, 680 186, 640 170 Z" col={MC.delt} k={L("delt")} dim={dim} />
      </g>
      {/* supraspinatus muscle + tendon, passing UNDER the acromion */}
      <g opacity={supra}>
        <Muscle id={id} d="M30 160 C 150 150, 300 160, 400 180 C 480 196, 560 206, 620 240 L 604 262 C 560 236, 480 226, 400 222 C 300 222, 150 234, 30 246 Z" col={MC.supra} k={L("supra")} dim={dim} />
      </g>
      {/* subacromial bursa */}
      <g opacity={bursa * (dim + (1 - dim) * L("bursa"))}>
        {L("bursa") > 0.01 && <ellipse cx={520} cy={172} rx={92} ry={18} fill="#7FB7DA" opacity={0.8 * L("bursa")} filter={`url(#${id}gl)`} />}
        <ellipse cx={520} cy={172} rx={86} ry={11 + 3 * L("bursa")} fill={mix("#BFD9E6", "#7FB7DA", L("bursa"))} stroke={C.forest} strokeWidth={3} />
      </g>
      {/* acromion (roof) */}
      <g opacity={acro}>
        <Bone id={id} d="M300 120 C 400 96, 560 100, 650 120 C 672 130, 668 156, 640 160 C 560 162, 420 160, 330 166 C 300 162, 288 134, 300 120 Z" k={L("acro")} dim={dim} />
      </g>
      {down > 0.01 && (
        <g opacity={down} transform={`translate(0 ${Math.sin(t * 5) * 8})`}>
          <path d="M470 300 L 470 360 M446 336 L 470 366 L 494 336" stroke={C.red} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M420 350 L 370 350 M394 326 L 364 350 L 394 374" stroke={C.red} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </svg>
  );
};

/* ------------------------------------------------------------------
   ArmRaise — viewBox 0 0 820 760 (from BEHIND, raising the RIGHT arm on the right side)
   ang: 0 (arm down) .. 170 (arm overhead). hi: which muscle is lit: supra | delt | scap
   ------------------------------------------------------------------ */
export const ArmRaise: React.FC<{ t: number; w?: number; ang: number; hi?: Lit; cuffPull?: number }> = ({ t, w = 700, ang, hi = {}, cuffPull = 0 }) => {
  const id = "ar";
  const H = (p: string) => win(t, hi[p]);
  const sx = 470, sy = 250; // shoulder pivot
  const scapRot = Math.max(0, ang - 90) * 0.45;
  const rad = (ang * Math.PI) / 180;
  const ex = sx + Math.sin(rad) * 300;
  return (
    <svg width={w} height={(w * 900) / 820} viewBox="0 -140 820 900" style={{ overflow: "visible" }}>
      <Defs id={id} />
      {/* body from behind (full torso, left arm hanging) */}
      <rect x={110} y={250} width={64} height={330} rx={32} fill="#EAD2B4" stroke={C.forest} strokeWidth={4} />
      <path d="M150 760 C 160 620, 150 420, 160 300 C 166 250, 200 226, 250 216 C 280 212, 300 196, 300 170 L 340 170 C 340 196, 360 212, 390 216 C 430 222, 462 236, 476 262 C 486 300, 478 420, 488 760 Z" fill="#F2DDC4" stroke={C.forest} strokeWidth={4} />
      <path d="M320 230 L 320 700" stroke="#D9BE9C" strokeWidth={4} strokeDasharray="4 10" />
      <ellipse cx={320} cy={100} rx={60} ry={72} fill="#E9CDA9" stroke={C.forest} strokeWidth={4} />
      {/* trapezius (upper back) */}
      <Muscle id={id} d="M300 172 L 340 172 C 350 200, 410 216, 462 236 C 420 270, 370 330, 320 470 C 270 330, 220 270, 178 236 C 230 216, 290 200, 300 172 Z" col={MC.trap} k={H("trap")} dim={0.75} base={0.25} />
      {/* serratus anterior (side of ribs, peeking) */}
      <Muscle id={id} d="M478 330 C 492 380, 492 450, 484 520 L 456 512 C 462 450, 462 390, 452 340 Z" col={MC.serr} k={H("serr")} dim={0.75} base={0.25} />
      {/* scapula, rotates upward above 90 deg */}
      <g transform={`rotate(${-scapRot} 420 330)`}>
        <Bone id={id} d="M362 250 C 400 252, 436 256, 458 262 C 462 290, 444 360, 418 430 C 408 444, 394 440, 390 426 C 380 360, 372 300, 362 250 Z" k={H("scap")} dim={1} />
        <path d="M356 290 C 390 284, 430 274, 468 258" stroke={LINE} strokeWidth={6} fill="none" />
        <Muscle id={id} d="M356 256 C 390 258, 430 260, 462 262 L 470 276 C 430 280, 392 284, 358 286 Z" col={MC.supra} k={H("supra")} dim={0.85} base={0.5} />
      </g>
      {/* arm */}
      <g transform={`rotate(${-ang} ${sx} ${sy})`}>
        <rect x={sx - 36} y={sy - 10} width={72} height={330} rx={36} fill="#F2DDC4" stroke={C.forest} strokeWidth={4} />
        <rect x={sx - 30} y={sy + 300} width={60} height={70} rx={28} fill="#E9CDA9" stroke={C.forest} strokeWidth={4} />
      </g>
      {/* deltoid: caps the shoulder and moves with the arm */}
      <g transform={`rotate(${-ang} ${sx} ${sy})`}>
        <Muscle id={id} d={`M${sx - 44} ${sy - 6} C ${sx - 40} ${sy - 50}, ${sx + 40} ${sy - 50}, ${sx + 44} ${sy - 6} C ${sx + 46} ${sy + 50}, ${sx + 22} ${sy + 110}, ${sx} ${sy + 150} C ${sx - 22} ${sy + 110}, ${sx - 46} ${sy + 50}, ${sx - 44} ${sy - 6} Z`} col={MC.delt} k={H("delt")} dim={0.85} base={0.45} />
      </g>
      {cuffPull > 0.01 && (
        <g opacity={cuffPull}>
          <circle cx={sx} cy={sy} r={30} fill="none" stroke={C.red} strokeWidth={6} strokeDasharray="8 6" />
        </g>
      )}
      {/* angle arc + readout */}
      <path d={`M${sx} ${sy + 120} A 120 120 0 ${ang > 180 ? 1 : 0} 0 ${sx + Math.sin(rad) * 120} ${sy + Math.cos(rad) * 120}`} fill="none" stroke={C.red} strokeWidth={6} strokeDasharray="10 8" opacity={ang > 2 ? 1 : 0} />
      <g transform={`translate(${ex > 650 ? 640 : 640} 640)`}>
        <rect x={0} y={0} width={170} height={84} rx={20} fill={C.forest} />
        <text x={85} y={58} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={48} fill={C.banana}>{Math.round(ang)}°</text>
      </g>
    </svg>
  );
};

/* ------------------------------------------------------------------
   RotateTop — viewBox 0 0 600 520, seen from ABOVE: body, right arm at the side, elbow bent 90 deg,
   forearm swings OUT (lateral rotation, +) or IN (medial rotation, -). rot in degrees.
   ------------------------------------------------------------------ */
export const RotateTop: React.FC<{ t: number; w?: number; rot: number; mode?: "out" | "in" | "none"; col?: string }> = ({ t, w = 520, rot, mode = "none", col = C.red }) => {
  const ex = 430, ey = 200;
  const r = (rot * Math.PI) / 180;
  const hx = ex + Math.sin(r) * 210, hy = ey + Math.cos(r) * 210;
  return (
    <svg width={w} height={(w * 520) / 600} viewBox="0 0 600 520" style={{ overflow: "visible" }}>
      <text x={300} y={510} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={22} fill={C.matcha} letterSpacing={3}>SEEN FROM ABOVE · FRONT ↓</text>
      {/* body (shoulders) from above */}
      <ellipse cx={250} cy={200} rx={190} ry={70} fill="#F2DDC4" stroke={C.forest} strokeWidth={4} />
      <circle cx={250} cy={200} r={62} fill="#E9CDA9" stroke={C.forest} strokeWidth={4} />
      <path d="M238 262 L 250 282 L 262 262" fill="#E9CDA9" stroke={C.forest} strokeWidth={4} />
      {/* upper arm seen from above (hangs down) */}
      <circle cx={ex} cy={ey} r={44} fill="#F2DDC4" stroke={C.forest} strokeWidth={4} />
      {/* arc */}
      {mode !== "none" && <path d={`M${ex} ${ey + 150} A 150 150 0 0 ${mode === "out" ? 0 : 1} ${ex + (mode === "out" ? 1 : -1) * 150 * Math.sin(1.05)} ${ey + 150 * Math.cos(1.05)}`} fill="none" stroke={col} strokeWidth={8} strokeDasharray="12 9" />}
      {/* forearm */}
      <line x1={ex} y1={ey} x2={hx} y2={hy} stroke={C.forest} strokeWidth={62} strokeLinecap="round" />
      <line x1={ex} y1={ey} x2={hx} y2={hy} stroke="#F2DDC4" strokeWidth={54} strokeLinecap="round" />
      <circle cx={hx} cy={hy} r={34} fill="#E9CDA9" stroke={C.forest} strokeWidth={4} />
    </svg>
  );
};

/** golf ball on a tee: the shallow socket */
export const GolfTee: React.FC<{ w?: number; t: number; t0: number }> = ({ w = 260, t, t0 }) => {
  const p = ramp(t, t0, t0 + 0.4);
  return (
    <svg width={w} height={w * 1.1} viewBox="0 0 200 220" style={{ overflow: "visible", opacity: p }}>
      <defs>
        <radialGradient id="gball" cx="35%" cy="30%" r="75%"><stop offset="0%" stopColor="#FFFFFF" /><stop offset="100%" stopColor="#D8D6C6" /></radialGradient>
      </defs>
      <path d="M70 118 L 130 118 L 112 140 L 106 210 L 94 210 L 88 140 Z" fill="#E8B04A" stroke={C.forest} strokeWidth={4} strokeLinejoin="round" />
      <g transform={`translate(0 ${(1 - p) * -30})`}>
        <circle cx={100} cy={72} r={52} fill="url(#gball)" stroke={C.forest} strokeWidth={4} />
        {[[80, 52], [102, 46], [122, 58], [74, 76], [96, 70], [118, 80], [88, 96], [110, 100]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4} fill="#C9C6B2" />)}
      </g>
    </svg>
  );
};
