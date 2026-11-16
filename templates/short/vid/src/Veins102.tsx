import React from "react";
import { C, FONT, ramp } from "./kit";

/* Book Plume's own diagram: superficial veins of the RIGHT upper limb, front view (palm forward),
   thumb / lateral side on the viewer's LEFT, body / medial side on the viewer's RIGHT. viewBox 700 x 1500.
   CE cephalic (thumb side → deltopectoral groove), BA basilic (pinky side → dives deep mid-arm),
   MC median cubital (oblique bridge cephalic → basilic in front of the elbow), MA median antebrachial (middle of the forearm). */
export type VK = "CE" | "BA" | "MC" | "MA";
export const VNAME: Record<VK, string> = { CE: "cephalic", BA: "basilic", MC: "median cubital", MA: "median antebrachial" };
export const VCOL: Record<VK, string> = { CE: "#D9741C", BA: "#2F4E8E", MC: "#D42A1E", MA: "#1E9C8A" };
const VHOT: Record<VK, string> = { CE: "#F0913A", BA: "#4A6CC8", MC: "#F0402F", MA: "#2FC0A8" };
export const VORDER: VK[] = ["MC", "CE", "BA", "MA"];

export const VD: Record<VK, string> = {
  CE: "M 252 1196 C 214 1064 196 930 210 826 C 220 764 234 724 232 664 C 228 560 224 420 244 302 C 260 214 296 152 350 104",
  BA: "M 428 1196 C 466 1064 488 934 480 826 C 474 764 464 716 460 662 C 454 572 452 500 450 432",
  MC: "M 234 748 C 300 724 380 694 460 646",
  MA: "M 342 1186 C 346 1056 354 924 352 826 C 351 786 348 748 344 714",
};
/* basilic beyond the deep fascia (dashed) */
const BA_DEEP = "M 450 432 C 448 362 452 300 466 236";
/* chip anchors (viewBox coords) */
export const VANCH: Record<string, [number, number]> = {
  CE: [212, 900], CEarm: [236, 470], CEtop: [300, 170], BA: [482, 900], BAarm: [454, 520], MC: [348, 704], MA: [352, 1000],
  DIVE: [450, 432], THUMB: [118, 1352], PINKY: [500, 1440], SHOULDER: [350, 104], ELBOW: [350, 700],
};

const lv = (t: number, t0?: number) => (t0 === undefined ? 0 : ramp(t, t0 - 0.05, t0 + 0.3));

export const Veins: React.FC<{
  t: number; w: number; id: string; lit: Partial<Record<VK, number>>; hot?: VK[]; dimRest?: number;
  climb?: number; dive?: number; sides?: number; flow?: number; names?: number;
}> = ({ t, w, id, lit, hot = [], dimRest = 0, climb = 0, dive = 0, sides = 0, flow = 0, names = 0 }) => {
  const pulse = (Math.sin(t * 6) + 1) / 2;
  const vein = (k: VK) => {
    const o = lv(t, lit[k]);
    const H = hot.includes(k);
    const dim = H || !hot.length ? 0 : dimRest;
    const wd = k === "MC" ? 30 : k === "MA" ? 22 : 30;
    return (
      <g key={k} opacity={1 - 0.65 * dim}>
        {H && <path d={VD[k]} fill="none" stroke={C.banana} strokeWidth={wd + 26 + 10 * pulse} strokeLinecap="round" strokeLinejoin="round" opacity={0.95} />}
        <path d={VD[k]} fill="none" stroke={C.forest} strokeWidth={wd + 9} strokeLinecap="round" strokeLinejoin="round" />
        <path d={VD[k]} fill="none" stroke="#8FA6C4" strokeWidth={wd} strokeLinecap="round" strokeLinejoin="round" />
        {o > 0 && <path d={VD[k]} fill="none" stroke={H ? VHOT[k] : VCOL[k]} strokeWidth={wd} strokeLinecap="round" strokeLinejoin="round" opacity={o} />}
        {/* highlight streak */}
        <path d={VD[k]} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth={wd * 0.22} strokeLinecap="round" transform="translate(-4 -3)" />
        {/* flow toward the heart (dashes run up the vein) */}
        {flow > 0 && (H || !hot.length) && o > 0 && (
          <path d={VD[k]} fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth={wd * 0.3} strokeLinecap="round" strokeDasharray="2 34" strokeDashoffset={(k === "MC" ? -1 : 1) * t * 90} opacity={flow * o} />
        )}
      </g>
    );
  };
  const order: VK[] = ["MA", "CE", "BA", "MC"];
  const h = (w * 1500) / 700;
  return (
    <svg width={w} height={h} viewBox="0 0 700 1500" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={`${id}skin`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#EED8C0" />
          <stop offset="0.5" stopColor="#F6E6D3" />
          <stop offset="1" stopColor="#ECD3BA" />
        </linearGradient>
      </defs>
      {/* chest edge + pec on the medial (right) side */}
      <path d="M 700 0 L 700 330 C 640 300 560 260 492 236 C 470 170 440 90 420 0 Z" fill="#EBD1B7" stroke="rgba(31,42,20,0.35)" strokeWidth={3} />
      <text x={600} y={120} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill="rgba(31,42,20,0.45)">chest</text>
      {/* hand (palm forward): thumb on the viewer's left */}
      <g fill={`url(#${id}skin)`} stroke="rgba(31,42,20,0.55)" strokeWidth={4} strokeLinejoin="round">
        <path d="M 236 1236 C 206 1262 166 1300 136 1346 C 120 1370 122 1396 140 1402 C 158 1408 176 1390 192 1370 C 214 1342 238 1318 256 1296 Z" />
        <rect x={246} y={1300} width={50} height={172} rx={25} />
        <rect x={302} y={1300} width={52} height={192} rx={26} />
        <rect x={360} y={1300} width={50} height={178} rx={25} />
        <rect x={414} y={1290} width={44} height={150} rx={22} transform="rotate(-6 436 1300)" />
        <path d="M 222 1180 C 220 1240 226 1300 240 1340 C 300 1356 400 1356 456 1332 C 464 1290 460 1230 452 1180 Z" />
      </g>
      {/* finger creases */}
      <path d="M 252 1420 L 290 1420 M 308 1432 L 348 1432 M 366 1422 L 404 1422 M 420 1394 L 452 1390" stroke="rgba(31,42,20,0.2)" strokeWidth={3} />
      {/* arm silhouette */}
      <path
        d="M 206 30 C 160 52 140 110 148 170 C 158 250 176 330 188 430 C 198 520 204 600 196 680 C 190 720 176 760 172 820 C 168 920 196 1060 224 1196
           L 452 1196
           C 486 1060 516 930 512 822 C 510 760 502 720 500 680 C 494 600 488 520 484 440 C 482 360 486 290 494 238
           C 450 200 430 130 420 40 C 360 20 260 14 206 30 Z"
        fill={`url(#${id}skin)`} stroke="rgba(31,42,20,0.55)" strokeWidth={4} strokeLinejoin="round" />
      <path d="M 224 1196 L 452 1196" stroke={`url(#${id}skin)`} strokeWidth={8} />
      {/* small tributaries (unlabelled) */}
      <g fill="none" stroke="#9FB2CB" strokeWidth={9} strokeLinecap="round" opacity={0.85}>
        <path d="M 214 960 C 250 990 290 1010 330 1030" />
        <path d="M 208 860 C 180 900 176 950 186 1000" />
        <path d="M 474 960 C 440 1000 404 1040 360 1070" />
        <path d="M 486 860 C 500 900 502 940 496 980" />
        <path d="M 236 560 C 270 520 300 500 330 480" />
        <path d="M 252 1196 C 280 1240 310 1260 342 1264 C 380 1266 410 1240 428 1196" />
      </g>
      {/* deltoid + deltopectoral groove */}
      <path d="M 206 30 C 160 52 140 110 148 170 C 158 250 180 320 220 360 C 250 300 290 220 330 150 C 360 100 390 60 420 40 C 360 20 260 14 206 30 Z" fill="rgba(200,150,120,0.16)" stroke="rgba(31,42,20,0.22)" strokeWidth={3} />
      <path d="M 420 40 C 380 70 320 150 268 260" fill="none" stroke="rgba(31,42,20,0.3)" strokeWidth={3} strokeDasharray="10 8" />
      {/* biceps belly + elbow crease + forearm muscle hints */}
      <path d="M 300 260 C 380 300 420 420 410 560 C 404 630 384 672 352 690 C 310 668 288 620 282 540 C 276 420 280 320 300 260 Z" fill="rgba(200,150,120,0.14)" stroke="rgba(31,42,20,0.18)" strokeWidth={3} />
      <path d="M 196 704 C 290 690 410 686 500 696" fill="none" stroke="rgba(31,42,20,0.25)" strokeWidth={3} />
      <path d="M 240 1188 C 300 1176 400 1176 446 1188" fill="none" stroke="rgba(31,42,20,0.25)" strokeWidth={3} />
      {/* palm creases */}
      <path d="M 250 1300 C 300 1320 360 1318 440 1290 M 236 1250 C 270 1280 286 1310 290 1340" fill="none" stroke="rgba(31,42,20,0.2)" strokeWidth={3} />
      {/* basilic beyond the deep fascia */}
      <g opacity={lv(t, lit.BA) > 0 ? 0.5 + 0.5 * dive : 0.35}>
        <path d={BA_DEEP} fill="none" stroke={C.forest} strokeWidth={18} strokeLinecap="round" strokeDasharray="12 14" opacity={0.6} />
      </g>
      {order.map(vein)}
      {/* where the basilic dives deep */}
      {dive > 0 && (
        <g opacity={dive}>
          <circle cx={450} cy={432} r={26 + 8 * pulse} fill="none" stroke="#111" strokeWidth={6} />
          <circle cx={450} cy={432} r={10} fill="#111" />
        </g>
      )}
      {/* cephalic climbs to the shoulder: arrow at the top */}
      {climb > 0 && (
        <g opacity={Math.min(1, climb * 2)} transform={`translate(${350 + 6 * climb} ${104 - 30 * climb}) rotate(-50)`}>
          <path d="M -22 30 L -22 0 L -46 0 L 0 -48 L 46 0 L 22 0 L 22 30 Z" fill={VCOL.CE} stroke="#111" strokeWidth={7} strokeLinejoin="round" />
        </g>
      )}
      {sides > 0 && (
        <g fontFamily={FONT} fontWeight={800} opacity={sides}>
          <text x={60} y={1260} fontSize={30} fill={VCOL.CE} stroke="#FFFEF6" strokeWidth={8} paintOrder="stroke">THUMB</text>
          <text x={60} y={1292} fontSize={30} fill={VCOL.CE} stroke="#FFFEF6" strokeWidth={8} paintOrder="stroke">SIDE</text>
          <text x={640} y={1262} textAnchor="end" fontSize={30} fill={VCOL.BA} stroke="#FFFEF6" strokeWidth={8} paintOrder="stroke">PINKY</text>
          <text x={640} y={1294} textAnchor="end" fontSize={30} fill={VCOL.BA} stroke="#FFFEF6" strokeWidth={8} paintOrder="stroke">SIDE</text>
        </g>
      )}
      {names > 0 && (
        <g fontFamily={FONT} fontWeight={800} fontSize={22} fill="rgba(31,42,20,0.5)" opacity={names}>
          <text x={350} y={1300} textAnchor="middle">palm</text>
          <text x={350} y={740} textAnchor="middle" fontSize={20}>elbow crease</text>
        </g>
      )}
    </svg>
  );
};
