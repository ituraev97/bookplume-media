import React from "react";
import { C, ramp } from "./kit";

/* Book Plume's own diagram: hamstrings of the RIGHT thigh seen from BEHIND (posterior view), as in Gray's Fig. 434.
   Medial side on the viewer's LEFT, lateral on the RIGHT. viewBox 700 x 1500.
   ST semitendinosus (superficial, medial, long thin tendon), SM semimembranosus (deep, medial, under ST),
   BL biceps femoris long head (lateral), BS biceps femoris short head (from the femur), SN sciatic nerve. */
export type HK = "ST" | "SM" | "BL" | "BS";
export const HCOL: Record<HK, string> = { ST: "#B83A26", SM: "#2E8466", BL: "#6B3FA0", BS: "#B8860B" };
const HHOT: Record<HK, string> = { ST: "#E5523A", SM: "#3FB088", BL: "#8E5CCB", BS: "#E0AA22" };
const HBASE: Record<HK, string> = { ST: "#D9B0A2", SM: "#BCD3C6", BL: "#D2C3E2", BS: "#EFE3C4" };
export const NERVE = "#F2D14E";

const SKIN =
  "M 150 0 C 130 200 135 420 160 640 C 180 840 200 1020 205 1180 C 200 1290 210 1400 225 1500 L 520 1500 C 530 1400 545 1290 545 1180 C 555 1020 580 820 595 620 C 610 400 610 200 590 0 Z";
export const HD: Record<HK, string> = {
  SM: "M 262 205 C 225 330 170 470 158 660 C 148 840 178 1000 222 1100 C 232 1160 240 1210 246 1250 L 282 1250 C 286 1180 296 1110 310 1050 C 330 900 330 650 316 450 C 306 330 292 250 282 205 Z",
  ST: "M 288 196 C 336 262 362 420 358 590 C 354 730 326 820 298 880 L 258 884 C 222 800 206 650 212 510 C 220 380 254 266 288 196 Z",
  BS: "M 486 520 C 540 590 578 750 580 900 C 582 1010 556 1100 518 1165 L 494 1165 C 492 1040 482 880 470 720 C 466 630 472 560 486 520 Z",
  BL: "M 300 200 C 380 280 470 440 505 620 C 532 770 530 930 515 1060 L 504 1170 L 474 1170 C 460 1060 436 940 404 820 C 360 660 316 470 298 240 Z",
};
const ST_TENDON = "M 278 876 C 268 990 256 1120 242 1300";
const BI_TENDON = "M 489 1162 C 500 1210 506 1245 508 1278";
const SN_TRUNK = "M 352 30 C 362 260 378 520 380 900";
const SN_TIB = "M 380 900 C 378 1020 372 1140 368 1300";
const SN_FIB = "M 380 900 C 420 1010 470 1130 512 1262";
/* chip anchors (viewBox coords) */
export const HANCH: Record<string, [number, number]> = {
  ST: [286, 520], SM: [190, 800], STt: [264, 1040], BL: [440, 640], BS: [556, 930], SN: [376, 640], SNt: [372, 1120], SNf: [470, 1130],
  IT: [292, 188], FEM: [462, 600], KNEE: [380, 1190], FIBH: [506, 1268], TIBM: [250, 1262], HIP: [330, 120],
};

const lv = (t: number, t0?: number) => (t0 === undefined ? 0 : ramp(t, t0 - 0.05, t0 + 0.3));

export const Ham: React.FC<{
  t: number; w: number; id: string; lit: Partial<Record<HK, number>>; hot?: HK[]; dimRest?: number;
  st?: number; bones?: number; nerve?: number; it?: number;
}> = ({ t, w, id, lit, hot = [], dimRest = 0, st = 1, bones = 0, nerve = 0, it = 0 }) => {
  const pulse = (Math.sin(t * 6) + 1) / 2;
  const h = (w * 1500) / 700;
  const mus = (k: HK, extraOp = 1, tendon?: string) => {
    const o = lv(t, lit[k]);
    const H = hot.includes(k);
    const dim = H || !hot.length ? 0 : dimRest;
    const fill = o > 0 ? (H ? HHOT[k] : HCOL[k]) : HBASE[k];
    return (
      <g key={k} opacity={(1 - 0.6 * dim) * extraOp}>
        {H && <path d={HD[k]} fill="none" stroke={C.banana} strokeWidth={22 + 10 * pulse} strokeLinejoin="round" opacity={0.95} />}
        {H && tendon && <path d={tendon} fill="none" stroke={C.banana} strokeWidth={30 + 8 * pulse} strokeLinecap="round" />}
        {tendon && <path d={tendon} fill="none" stroke={C.forest} strokeWidth={22} strokeLinecap="round" />}
        {tendon && <path d={tendon} fill="none" stroke="#FBF3DE" strokeWidth={12} strokeLinecap="round" />}
        <path d={HD[k]} fill={HBASE[k]} stroke={C.forest} strokeWidth={6} strokeLinejoin="round" />
        {o > 0 && <path d={HD[k]} fill={fill} opacity={o} />}
        <path d={HD[k]} fill={`url(#${id}fib${k === "BL" || k === "BS" ? "b" : ""})`} opacity={0.55} />
        <path d={HD[k]} fill="none" stroke={C.forest} strokeWidth={6} strokeLinejoin="round" />
      </g>
    );
  };
  const nv = (d: string, o: number) => (
    <g opacity={o}>
      <path d={d} fill="none" stroke={C.forest} strokeWidth={22} strokeLinecap="round" />
      <path d={d} fill="none" stroke={NERVE} strokeWidth={12} strokeLinecap="round" />
      <path d={d} fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth={4} strokeLinecap="round" strokeDasharray="6 26" strokeDashoffset={-t * 90} />
    </g>
  );
  return (
    <svg width={w} height={h} viewBox="0 0 700 1500" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={`${id}skin`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#E9D7C2" />
          <stop offset="0.5" stopColor="#F6EBDD" />
          <stop offset="1" stopColor="#E4CFB8" />
        </linearGradient>
        <pattern id={`${id}fib`} width={14} height={14} patternUnits="userSpaceOnUse" patternTransform="rotate(-6)">
          <line x1={0} y1={0} x2={0} y2={14} stroke="rgba(31,42,20,0.33)" strokeWidth={2} />
        </pattern>
        <pattern id={`${id}fibb`} width={13} height={13} patternUnits="userSpaceOnUse" patternTransform="rotate(-18)">
          <line x1={0} y1={0} x2={0} y2={13} stroke="rgba(31,42,20,0.3)" strokeWidth={2} />
        </pattern>
      </defs>
      <path d={SKIN} fill={`url(#${id}skin)`} stroke={C.forest} strokeWidth={6} opacity={0.95} />
      {/* bones (ghost): hip bone + ischial tuberosity, femur, tibia, fibula */}
      <g opacity={0.25 + 0.55 * Math.max(bones, it)} fill="#FFFDF3" stroke={C.forest} strokeWidth={5} strokeDasharray={bones > 0.5 ? undefined : "10 8"}>
        <path d="M 180 0 C 190 90 230 160 280 185 C 320 205 350 195 355 160 C 360 110 345 50 335 0 Z" />
        <path d="M 455 0 L 545 0 C 560 60 548 120 505 150 L 445 1060 C 500 1075 540 1115 540 1165 C 532 1210 480 1222 420 1218 L 330 1218 C 268 1222 222 1210 215 1165 C 212 1115 260 1078 360 1062 L 430 150 C 428 90 440 40 455 0 Z" />
        <path d="M 235 1240 C 230 1225 400 1225 410 1240 L 395 1290 L 385 1500 L 290 1500 L 280 1290 Z" />
        <path d="M 470 1260 C 480 1240 520 1240 525 1262 C 527 1285 512 1295 505 1300 L 500 1500 L 478 1500 L 482 1300 C 472 1292 466 1278 470 1260 Z" />
      </g>
      {it > 0 && (
        <g opacity={it}>
          <ellipse cx={292} cy={186} rx={56 + 10 * pulse} ry={34 + 6 * pulse} fill="none" stroke={C.banana} strokeWidth={14} />
          <ellipse cx={292} cy={186} rx={46} ry={26} fill="#FFF3B0" stroke={C.forest} strokeWidth={5} />
        </g>
      )}
      {mus("SM")}
      {mus("BS")}
      {mus("BL", 1, BI_TENDON)}
      {st > 0 && mus("ST", st, ST_TENDON)}
      {nerve > 0 && (
        <>
          {nv(SN_TRUNK, nerve)}
          {nv(SN_TIB, nerve)}
          {nv(SN_FIB, nerve)}
        </>
      )}
      {/* femur re-drawn as an outline on top (where the short head starts) */}
      {bones > 0 && (
        <g opacity={0.9 * bones} fill="none" stroke="#FFFDF3" strokeWidth={7} strokeDasharray="14 9">
          <path d="M 430 150 L 360 1062 M 505 150 L 445 1060" />
        </g>
      )}
    </svg>
  );
};
