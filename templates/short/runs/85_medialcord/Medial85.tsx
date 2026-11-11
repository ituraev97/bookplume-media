import React from "react";
import { C, FONT, ramp } from "./kit";

/* Book Plume diagram: RIGHT axilla + arm seen from the FRONT, arm abducted toward the lower left (like Gray's Fig. 809).
   Medial cord of the brachial plexus (C8–T1, from the anterior division of the lower trunk; MEDIAL to the 2nd part of the
   axillary artery) and its 5 branches — M4U:
     MP  medial pectoral nerve → pierces pectoralis minor → pectoralis minor + (lower) pectoralis major
     MA  medial cutaneous nerve of the arm → skin of the medial arm
     MF  medial cutaneous nerve of the forearm → skin of the medial forearm
     MR  medial root of the median nerve → joins the lateral root (lateral cord) IN FRONT of the axillary artery
     UL  ulnar nerve → down the medial arm, behind the medial epicondyle ("funny bone")
   Facts: Elsevier "Medial cord of brachial plexus"; Radiopaedia "Brachial plexus"; TeachMeAnatomy "Brachial plexus";
   Gray 1918 p. 931 (cords around the 2nd part of the axillary artery), Figs. 808–809.
   viewBox 900 x 1000. Geometry is built along the artery axis: pt(s, off) = P0 + s·d + off·n (off > 0 = medial side). */

export type B = "MP" | "MA" | "MF" | "MR" | "UL";
export const BORDER: B[] = ["MP", "MA", "MF", "MR", "UL"];
export const BCOL: Record<B, string> = { MP: "#D9708C", MA: "#4F9CC4", MF: "#3FA89A", MR: "#E0A53A", UL: "#7FAE4E" };
export const BLET: Record<B, string> = { MP: "M", MA: "M", MF: "M", MR: "M", UL: "U" };
export const BNUM: Record<B, string> = { MP: "1", MA: "2", MF: "3", MR: "4", UL: "" };

const P0: [number, number] = [760, 130];
const D: [number, number] = [-0.726, 0.687];
const NRM: [number, number] = [0.687, 0.726];
export const pt = (s: number, off: number): [number, number] => [P0[0] + D[0] * s + NRM[0] * off, P0[1] + D[1] * s + NRM[1] * off];

/* Catmull-Rom → cubic bezier through (s, off) points */
const path = (pts: [number, number][], close = false) => {
  const p = pts.map(([s, o]) => pt(s, o));
  if (close) p.push(p[0], p[1]);
  let d = `M ${p[0][0].toFixed(1)} ${p[0][1].toFixed(1)}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[Math.max(0, i - 1)], p1 = p[i], p2 = p[i + 1], p3 = p[Math.min(p.length - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return close ? d + " Z" : d;
};
const poly = (pts: [number, number][]) => "M " + pts.map(([s, o]) => pt(s, o).map((v) => v.toFixed(1)).join(" ")).join(" L ") + " Z";

/* ---------- geometry ---------- */
const ARM = path([[150, -250], [400, -255], [700, -235], [880, -215], [1000, -175], [1200, -150], [1200, 170], [1000, 175], [890, 225], [700, 245], [450, 260], [250, 300]], false) + " L " + pt(150, 400).join(" ") + " L " + pt(-300, 400).join(" ") + " L " + pt(-300, -250).join(" ") + " Z";
const SKIN_ARM = path([[330, 175], [520, 205], [720, 222], [840, 230], [840, 268], [700, 266], [500, 252], [330, 228]], true);
const SKIN_FA = path([[960, 150], [1080, 150], [1200, 150], [1200, 205], [1080, 200], [970, 205]], true);
const HUM = path([[250, -170], [300, -120], [420, -112], [620, -110], [800, -108], [860, -125], [905, -175], [935, -120], [935, -20], [925, 70], [900, 110], [868, 80], [850, 20], [800, -60], [620, -70], [420, -72], [300, -78], [250, -60], [230, -120]], true);
const EPI = pt(905, 95);
const CLAV = path([[-200, -140], [-60, -170], [80, -250], [200, -330]]);
const RIBS = [path([[-40, 380], [60, 480], [120, 620]]), path([[60, 540], [140, 640], [180, 760]]), path([[180, 660], [240, 760], [270, 870]])];
const PMIN = path([[215, -185], [262, -205], [308, -180], [318, 100], [322, 380], [282, 440], [228, 420], [214, 100]], true);
const PMIN_FIB = [path([[230, -150], [235, 120], [240, 410]]), path([[262, -160], [268, 130], [272, 420]]), path([[294, -168], [300, 120], [304, 410]])];
const PMAJ = path([[360, -200], [430, -205], [360, 120], [250, 470], [80, 640], [-120, 600], [-160, 380], [40, 300], [240, 80]], true);
const PMAJ_FIB = [path([[400, -160], [270, 220], [60, 560]]), path([[380, -150], [220, 160], [-60, 470]])];
const ARTERY = path([[-200, 0], [0, 0], [300, 0], [600, 4], [900, 14], [1200, 30]]);
const LC = path([[-200, -100], [0, -80], [200, -65], [330, -58]]);
const MC_ = path([[-200, 95], [0, 82], [200, 66], [320, 60]]);
const PC = path([[-200, -20], [100, -20], [330, -18]]);
const NV: Record<B, string> = {
  MP: path([[200, 66], [215, 120], [245, 210], [265, 300], [262, 380], [250, 470]]),
  MA: path([[250, 72], [330, 130], [450, 185], [600, 220], [760, 240], [830, 250]]),
  MF: path([[300, 70], [380, 100], [500, 125], [700, 135], [880, 150], [1000, 165], [1200, 180]]),
  MR: path([[320, 60], [360, 40], [400, 10], [430, -12], [450, -26]]),
  UL: path([[320, 60], [450, 62], [650, 66], [820, 76], [880, 108], [905, 140]]),
};
const UL_BACK = path([[905, 140], [960, 125], [1060, 115], [1200, 112]]);
const LR = path([[330, -58], [380, -48], [420, -36], [450, -26]]);
const MED = path([[450, -26], [600, -26], [780, -16], [900, 0], [1000, -10], [1200, -30]]);
const MUSC = path([[310, -60], [360, -110], [430, -170], [520, -210]]);
const TWIGS: Record<B, string[]> = {
  MP: [path([[250, 300], [215, 330], [190, 365]]), path([[262, 380], [300, 410], [320, 440]]), path([[250, 470], [210, 520], [200, 570]]), path([[250, 470], [280, 540], [300, 600]])],
  MA: [path([[600, 220], [640, 240], [690, 252]]), path([[760, 240], [790, 256], [830, 264]]), path([[450, 185], [500, 212], [540, 232]])],
  MF: [path([[1000, 165], [1050, 188], [1100, 200]]), path([[880, 150], [930, 175], [980, 190]]), path([[1000, 165], [1060, 150], [1120, 150]])],
  MR: [],
  UL: [],
};
export const ANCHOR: Record<string, [number, number]> = {
  MP: pt(250, 230), MA: pt(560, 211), MF: pt(560, 129), MR: pt(395, 14), UL: pt(700, 70), PMIN: pt(265, -120), PMAJ: pt(170, 300),
  SKA: pt(640, 240), SKF: pt(1080, 180), EPI: pt(905, 95), JN: pt(450, -26), LC: pt(250, -62), ART: pt(560, 3), MED: pt(700, -22),
  CORD: pt(120, 74), LR: pt(390, -46),
};

const mix = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return "#" + pa.map((v, i) => Math.round(v + (pb[i] - v) * Math.max(0, Math.min(1, k))).toString(16).padStart(2, "0")).join("");
};
const NERVE = "#F4E6BE", NERVE_EDGE = "#A88B45";
const MUS = "#E7C3B5", MUS_EDGE = "#B27F6E", MUS_FIB = "#C99A8A";
const WIDTH: Record<B, number> = { MP: 11, MA: 8, MF: 10, MR: 15, UL: 17 };
const LATC = "#B79BD6";

export const Medial: React.FC<{
  t: number;
  w: number;
  id: string;
  lit?: Partial<Record<B, number>>;
  hot?: B[];
  build?: number;
  dimRest?: number;
  skinA?: number;
  skinF?: number;
  pec?: number;
  epi?: number;
  lat?: number; // lateral cord + lateral root lit (purple) at time
  ask?: { t0: number; reveal?: number }; // lateral root drawn as "?" until reveal
  mark?: Partial<Record<B, string>>;
  art?: number;
  showMed?: number;
}> = ({ t, w, id, lit = {}, hot = [], build, dimRest = 0, skinA = 0, skinF = 0, pec = 0, epi = 0, lat, ask, mark, art = 1, showMed = 1 }) => {
  const s = w / 900;
  const on = (b: B) => (lit[b] === undefined ? 0 : ramp(t, (lit[b] as number) - 0.05, (lit[b] as number) + 0.3));
  const pulse = 0.65 + 0.35 * Math.sin(t * 7);
  const drawn = (k: number) => (build === undefined ? 1 : ramp(t, build + k * 0.16, build + k * 0.16 + 0.5));
  const latK = lat === undefined ? 0 : ramp(t, lat - 0.05, lat + 0.3);
  const asking = ask && t >= ask.t0 && (ask.reveal === undefined || t < ask.reveal);

  const nerveStroke = (d: string, col: string, wd: number, k: number, dd: number, key: string, glow: boolean, op = 1) => (
    <g key={key} opacity={op}>
      {glow && <path d={d} fill="none" stroke={C.banana} strokeWidth={wd + 28} strokeLinecap="round" opacity={0.55 * pulse} filter={`url(#gl${id})`} />}
      <path d={d} pathLength={1} strokeDasharray={`${dd} 1`} fill="none" stroke={mix(NERVE_EDGE, "#3B4A26", k * 0.5)} strokeWidth={wd + 6} strokeLinecap="round" />
      <path d={d} pathLength={1} strokeDasharray={`${dd} 1`} fill="none" stroke={col} strokeWidth={wd} strokeLinecap="round" />
      <path d={d} pathLength={1} strokeDasharray={`${dd} 1`} fill="none" stroke="#FFFFFF" strokeWidth={Math.max(2, wd * 0.2)} strokeLinecap="round" opacity={0.5} transform="translate(-2 -3)" />
    </g>
  );
  const branch = (b: B, k0: number) => {
    const k = on(b), dd = drawn(k0);
    if (dd <= 0) return null;
    const isHot = hot.includes(b) && k > 0;
    const dim = 1 - dimRest * (k > 0 ? 0 : 0.7);
    const col = mix(NERVE, BCOL[b], k);
    return (
      <g key={b} opacity={dim}>
        {nerveStroke(NV[b], col, WIDTH[b], k, dd, "n", isHot)}
        {TWIGS[b].map((p, i) => (
          <path key={i} d={p} fill="none" stroke={col} strokeWidth={WIDTH[b] * 0.55} strokeLinecap="round" opacity={dd * (0.5 + 0.5 * k)} />
        ))}
        {b === "UL" && <path d={UL_BACK} fill="none" stroke={col} strokeWidth={WIDTH[b]} strokeDasharray="16 11" opacity={0.85 * dd} />}
      </g>
    );
  };
  const cordD = drawn(0);
  const anyLit = Math.max(...BORDER.map(on));
  const medCol = mix(NERVE, "#C9B57C", 0.35 + 0.4 * anyLit);
  return (
    <svg width={w} height={1000 * s} viewBox="0 0 900 1000" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <filter id={`gl${id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={9} />
        </filter>
        <linearGradient id={`bone${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E9E1C8" />
          <stop offset="0.5" stopColor="#FBF7EA" />
          <stop offset="1" stopColor="#DCD2B4" />
        </linearGradient>
        <linearGradient id={`art${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E58A7C" />
          <stop offset="1" stopColor="#B24A3E" />
        </linearGradient>
        <clipPath id={`cv${id}`}>
          <rect x={-40} y={-40} width={980} height={1080} />
        </clipPath>
      </defs>
      <g clipPath={`url(#cv${id})`}>
        {/* arm + chest silhouette (skin) */}
        <path d={ARM} fill="#F1E3D3" stroke="#DCC6AE" strokeWidth={4} />
        {/* skin zones */}
        <path d={SKIN_ARM} fill={BCOL.MA} opacity={0.5 * skinA} />
        <path d={SKIN_FA} fill={BCOL.MF} opacity={0.5 * skinF} />
        {RIBS.map((r, i) => <path key={i} d={r} fill="none" stroke="#DCCDB0" strokeWidth={22} strokeLinecap="round" opacity={0.7} />)}
        {/* clavicle */}
        <path d={CLAV} fill="none" stroke="#CFC3A4" strokeWidth={40} strokeLinecap="round" />
        <path d={CLAV} fill="none" stroke="#F3EDDA" strokeWidth={28} strokeLinecap="round" />
        {/* humerus */}
        <path d={HUM} fill={`url(#bone${id})`} stroke="#A99B74" strokeWidth={4} />
        {epi > 0 && (
          <g opacity={epi}>
            <circle cx={EPI[0]} cy={EPI[1]} r={44} fill="none" stroke={C.red} strokeWidth={8} strokeDasharray="14 9" />
          </g>
        )}
        {/* pectoralis major (faint, under the nerves: reflected in the dissection) */}
        <path d={PMAJ} fill={mix(MUS, BCOL.MP, 0.75 * pec)} opacity={0.45 + 0.35 * pec} stroke={MUS_EDGE} strokeWidth={3} />
        {PMAJ_FIB.map((f, i) => <path key={i} d={f} fill="none" stroke={MUS_FIB} strokeWidth={2.5} opacity={0.5} />)}
        {/* posterior cord: behind the artery, dashed */}
        <path d={PC} fill="none" stroke="#BFB28A" strokeWidth={16} strokeDasharray="14 10" opacity={0.6 * cordD} />
        {/* lateral cord + musculocutaneous */}
        {(() => {
          const col = mix(NERVE, LATC, latK);
          return (
            <g opacity={1 - dimRest * 0.55 * (1 - latK)}>
              {nerveStroke(MUSC, mix(NERVE, LATC, latK * 0.3), 11, 0, cordD, "mu", false, 0.85)}
              {nerveStroke(LC, col, 24, latK, cordD, "lc", latK > 0.5)}
            </g>
          );
        })()}
        {/* axillary artery → brachial */}
        {art > 0 && (
          <g opacity={art}>
            <path d={ARTERY} fill="none" stroke="#7E2F27" strokeWidth={30} strokeLinecap="round" opacity={0.85} />
            <path d={ARTERY} fill="none" stroke={`url(#art${id})`} strokeWidth={23} strokeLinecap="round" />
            <path d={ARTERY} fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.4} transform="translate(-2 -6)" />
          </g>
        )}
        {/* medial cord (below = medial to the artery) */}
        {nerveStroke(MC_, medCol, 26, anyLit * 0.4, cordD, "mc", false)}
        {branch("UL", 1.0)}
        {branch("MF", 1.4)}
        {branch("MA", 1.8)}
        {branch("MP", 2.2)}
        {/* pectoralis minor crosses IN FRONT of the 2nd part of the artery */}
        <path d={PMIN} fill={mix(MUS, BCOL.MP, 0.8 * pec)} opacity={0.55 + 0.3 * pec} stroke={mix(MUS_EDGE, "#3B2A22", 0.3 * pec)} strokeWidth={4} />
        {PMIN_FIB.map((f, i) => <path key={i} d={f} fill="none" stroke={mix(MUS_FIB, "#FFFFFF", 0.3)} strokeWidth={2.5} opacity={0.55} />)}
        {/* medial pectoral nerve re-drawn where it pierces the muscle */}
        {on("MP") > 0 && <path d={NV.MP} fill="none" stroke={BCOL.MP} strokeWidth={WIDTH.MP} strokeLinecap="round" strokeDasharray="12 10" opacity={0.9 * on("MP")} />}
        {/* median nerve: two roots in FRONT of the artery */}
        {showMed > 0 && (
          <g opacity={showMed * (1 - dimRest * 0.5 * (1 - Math.max(on("MR"), latK)))}>
            {asking ? (
              <g>
                <path d={LR} fill="none" stroke={C.banana} strokeWidth={46} strokeLinecap="round" opacity={0.45 * pulse} filter={`url(#gl${id})`} />
                <path d={LR} fill="none" stroke="#6F7C64" strokeWidth={21} strokeLinecap="round" />
                <path d={LR} fill="none" stroke="#DAD7C3" strokeWidth={15} strokeDasharray="12 9" />
              </g>
            ) : (
              nerveStroke(LR, mix(NERVE, LATC, latK), 15, latK, drawn(2.6), "lr", latK > 0.5 && t < (lat as number) + 2)
            )}
            {branch("MR", 2.6)}
            {nerveStroke(MED, mix(NERVE, "#E8C877", Math.max(on("MR"), latK) * 0.6), 18, 0, drawn(3.0), "md", false)}
            <circle cx={ANCHOR.JN[0]} cy={ANCHOR.JN[1]} r={13 * drawn(3.0)} fill={mix(NERVE, "#E8C877", 0.6)} stroke={NERVE_EDGE} strokeWidth={4} />
          </g>
        )}
        {asking && (
          <g transform={`translate(${ANCHOR.LR[0] - 10} ${ANCHOR.LR[1] - 90}) scale(${1 + 0.07 * Math.sin(t * 6)})`}>
            <circle r={40} fill={C.forest} stroke={C.banana} strokeWidth={6} />
            <text y={17} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={50} fill={C.banana}>?</text>
          </g>
        )}
        {mark &&
          (Object.keys(mark) as B[]).map((b) => {
            const [x, y] = ANCHOR[b];
            return (
              <g key={b} transform={`translate(${x} ${y})`}>
                <circle r={30} fill={BCOL[b]} stroke={C.forest} strokeWidth={5} />
                <text y={12} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={C.forest}>{mark[b]}</text>
              </g>
            );
          })}
      </g>
    </svg>
  );
};
