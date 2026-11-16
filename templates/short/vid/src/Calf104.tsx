import React from "react";
import { C, ramp } from "./kit";

/* Book Plume's own diagram: superficial calf muscles of the RIGHT leg seen from BEHIND (posterior view).
   Medial side on the viewer's LEFT, lateral side on the viewer's RIGHT (as in Gray's Fig. 438). viewBox 700 x 1500.
   GM gastrocnemius medial head, GL lateral head (from the femoral condyles), SO soleus (tibia + fibula, under the gastrocnemius),
   AT Achilles = calcaneal tendon (into the calcaneus), PL plantaris (small belly above the lateral condyle, long thin tendon). */
export type CK = "GM" | "GL" | "SO" | "AT" | "PL";
export const CNAME: Record<CK, string> = { GM: "gastrocnemius · medial head", GL: "gastrocnemius · lateral head", SO: "soleus", AT: "Achilles tendon", PL: "plantaris" };
export const CCOL: Record<CK, string> = { GM: "#B83A26", GL: "#B83A26", SO: "#2E8466", AT: "#B8860B", PL: "#7A4FA0" };
const CHOT: Record<CK, string> = { GM: "#E5523A", GL: "#E5523A", SO: "#3FB088", AT: "#E0AA22", PL: "#9C6BCB" };
const CBASE: Record<CK, string> = { GM: "#D9B0A2", GL: "#D9B0A2", SO: "#BCD3C6", AT: "#EFE3C4", PL: "#D6C6E4" };

const SKIN =
  "M 190 0 C 185 150 195 260 200 330 C 160 430 165 560 185 700 C 205 860 270 1050 290 1240 C 282 1330 268 1392 300 1432 L 420 1432 C 446 1384 428 1312 410 1240 C 440 1050 500 860 515 700 C 535 560 540 430 500 330 C 505 260 515 150 510 0 Z";
export const CD: Record<CK, string> = {
  SO: "M 232 432 C 214 520 200 650 216 800 C 236 930 300 1030 326 1086 L 376 1086 C 410 1030 470 930 488 800 C 500 650 486 520 458 432 C 400 402 290 402 232 432 Z",
  GM: "M 285 278 C 224 330 194 450 199 580 C 204 702 250 806 302 864 C 322 876 346 864 350 842 L 350 330 C 340 300 314 278 285 278 Z",
  GL: "M 415 283 C 470 330 502 440 501 560 C 500 672 460 762 410 816 C 390 832 362 836 350 832 L 350 330 C 365 300 390 283 415 283 Z",
  AT: "M 304 838 C 320 950 329 1100 331 1250 C 332 1300 329 1332 324 1352 L 376 1352 C 371 1332 368 1300 369 1250 C 371 1100 381 950 396 828 C 372 850 330 856 304 838 Z",
  PL: "M 441 246 C 457 268 462 330 449 390 C 441 402 430 398 428 386 C 425 330 430 280 441 246 Z",
};
const PL_TENDON = "M 440 392 C 420 500 372 690 334 880 C 318 980 316 1090 326 1190";
/* chip anchors (viewBox coords) */
export const CANCH: Record<string, [number, number]> = {
  GM: [258, 560], GL: [452, 545], SO: [452, 900], SOl: [236, 880], AT: [350, 1160], PL: [444, 318], PLt: [352, 860],
  MCON: [282, 300], LCON: [420, 300], TIB: [292, 690], FIB: [432, 690], CAL: [350, 1388], KNEE: [350, 330],
};

const lv = (t: number, t0?: number) => (t0 === undefined ? 0 : ramp(t, t0 - 0.05, t0 + 0.3));

export const Calf: React.FC<{
  t: number; w: number; id: string; lit: Partial<Record<CK, number>>; hot?: CK[]; dimRest?: number;
  gas?: number; bones?: number; flow?: number;
}> = ({ t, w, id, lit, hot = [], dimRest = 0, gas = 1, bones = 0, flow = 0 }) => {
  const pulse = (Math.sin(t * 6) + 1) / 2;
  const h = (w * 1500) / 700;
  const mus = (k: CK, extraOp = 1) => {
    const o = lv(t, lit[k]);
    const H = hot.includes(k);
    const dim = H || !hot.length ? 0 : dimRest;
    return (
      <g key={k} opacity={(1 - 0.6 * dim) * extraOp}>
        {H && <path d={CD[k]} fill="none" stroke={C.banana} strokeWidth={22 + 10 * pulse} strokeLinejoin="round" opacity={0.95} />}
        <path d={CD[k]} fill={CBASE[k]} stroke={C.forest} strokeWidth={6} strokeLinejoin="round" />
        {o > 0 && <path d={CD[k]} fill={H ? CHOT[k] : CCOL[k]} opacity={o} />}
        {/* muscle fibres */}
        {k !== "AT" && (
          <path d={CD[k]} fill={`url(#${id}fib${k === "SO" ? "s" : ""})`} opacity={0.55} />
        )}
        {k === "AT" && <path d={CD[k]} fill={`url(#${id}ten)`} opacity={0.6} />}
        <path d={CD[k]} fill="none" stroke={C.forest} strokeWidth={6} strokeLinejoin="round" />
      </g>
    );
  };
  const plo = lv(t, lit.PL);
  const plH = hot.includes("PL");
  const plDim = plH || !hot.length ? 0 : dimRest;
  return (
    <svg width={w} height={h} viewBox="0 0 700 1500" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={`${id}skin`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#E9D7C2" />
          <stop offset="0.5" stopColor="#F6EBDD" />
          <stop offset="1" stopColor="#E4CFB8" />
        </linearGradient>
        <pattern id={`${id}fib`} width={14} height={14} patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
          <line x1={0} y1={0} x2={0} y2={14} stroke="rgba(31,42,20,0.35)" strokeWidth={2} />
        </pattern>
        <pattern id={`${id}fibs`} width={12} height={12} patternUnits="userSpaceOnUse" patternTransform="rotate(-6)">
          <line x1={0} y1={0} x2={0} y2={12} stroke="rgba(31,42,20,0.3)" strokeWidth={2} />
        </pattern>
        <pattern id={`${id}ten`} width={10} height={10} patternUnits="userSpaceOnUse">
          <line x1={0} y1={0} x2={0} y2={10} stroke="rgba(255,255,255,0.7)" strokeWidth={2.5} />
        </pattern>
      </defs>
      {/* skin silhouette */}
      <path d={SKIN} fill={`url(#${id}skin)`} stroke={C.forest} strokeWidth={6} opacity={0.95} />
      {/* bones (ghost) */}
      <g opacity={0.22 + 0.6 * bones} fill="#FFFDF3" stroke={C.forest} strokeWidth={5} strokeDasharray={bones > 0.5 ? undefined : "10 8"}>
        <path d="M 312 0 L 312 210 C 260 220 210 260 214 312 C 218 352 262 364 300 352 L 350 342 L 400 352 C 440 364 486 352 488 312 C 490 262 440 220 390 210 L 390 0 Z" />
        <path d="M 236 382 C 236 366 330 360 364 368 C 380 376 380 400 352 420 L 334 432 L 330 1250 C 330 1280 316 1300 288 1300 C 266 1290 262 1270 266 1250 L 268 432 C 248 420 236 404 236 382 Z" />
        <path d="M 412 398 C 424 386 448 388 452 404 L 446 1276 C 446 1296 422 1298 420 1278 L 426 420 Z" />
        <ellipse cx={350} cy={1392} rx={72} ry={44} />
      </g>
      {mus("SO")}
      {mus("AT")}
      {/* plantaris tendon: deep (dashed) under the gastrocnemius, solid below */}
      <g opacity={1 - 0.6 * plDim}>
        {plH && <path d={PL_TENDON} fill="none" stroke={C.banana} strokeWidth={20 + 8 * pulse} strokeLinecap="round" />}
        <path d={PL_TENDON} fill="none" stroke={C.forest} strokeWidth={12} strokeLinecap="round" />
        <path d={PL_TENDON} fill="none" stroke={plo > 0 ? (plH ? CHOT.PL : CCOL.PL) : CBASE.PL} strokeWidth={6} strokeLinecap="round" />
      </g>
      {gas > 0 && (
        <g opacity={gas}>
          {mus("GM")}
          {mus("GL")}
          {/* midline raphe */}
          <path d="M 350 336 L 350 836" stroke={C.forest} strokeWidth={4} strokeDasharray="12 10" opacity={0.6} />
        </g>
      )}
      {mus("PL")}
      {/* bones re-drawn as outlines on top so tibia + fibula read through the muscles */}
      {bones > 0 && (
        <g opacity={0.85 * bones} fill="none" stroke="#FFFDF3" strokeWidth={7} strokeDasharray="14 9">
          <path d="M 268 432 L 266 1250 M 334 432 L 330 1250" />
          <path d="M 426 420 L 420 1278 M 452 404 L 446 1276" />
        </g>
      )}
      {/* flow: arrows down into the tendon */}
      {flow > 0 && (
        <path d="M 350 700 L 350 1300" stroke="rgba(255,255,255,0.95)" strokeWidth={10} strokeLinecap="round" strokeDasharray="4 40" strokeDashoffset={-t * 120} opacity={flow} />
      )}
      {/* heel */}
      <ellipse cx={350} cy={1392} rx={72} ry={44} fill="none" stroke={C.forest} strokeWidth={5} opacity={0.5} />
    </svg>
  );
};
