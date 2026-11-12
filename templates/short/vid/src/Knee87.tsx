import React from "react";
import { C, ramp } from "./kit";

/* Book Plume diagrams for the popliteal fossa (short 87).
   Facts: Kenhub "Popliteal fossa" (borders: semimembranosus + semitendinosus superomedial, biceps femoris superolateral,
   medial + lateral heads of gastrocnemius inferiorly; floor = femur, knee-joint capsule, popliteus; contents: tibial + common fibular
   nerves, popliteal artery + vein, small saphenous vein, popliteal lymph nodes; superficial → deep: nerve, vein, artery);
   Radiopaedia "Popliteal fossa anatomy (mnemonic)" (Serve And Volley Next Ball, medial → lateral);
   Gray 1918 p. 632 + Fig. 551.
   Knee: RIGHT knee seen from BEHIND (medial = screen left, lateral = screen right). viewBox 900 x 1000.
   SectKnee: transverse section just above the knee joint, seen from below (front at the top, medial = screen left). viewBox 900 x 900. */

export type K = "S" | "A" | "V" | "N" | "B";
export const KORDER: K[] = ["S", "A", "V", "N", "B"];
export const KCOL: Record<K, string> = { S: "#9DBB64", A: "#C9483C", V: "#5B86C9", N: "#F2C94C", B: "#E3956A" };
export const KDARK: Record<K, boolean> = { S: false, A: true, V: true, N: false, B: false };
export const KWORD: Record<K, string> = { S: "Serve", A: "And", V: "Volley", N: "Next", B: "Ball" };

const mix = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return "#" + pa.map((v, i) => Math.round(v + (pb[i] - v) * Math.max(0, Math.min(1, k))).toString(16).padStart(2, "0")).join("");
};
const sp = (pts: [number, number][], close = false) => {
  const n = pts.length;
  const g = (i: number) => (close ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  const segs = close ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return close ? d + " Z" : d;
};

type Lit = Partial<Record<string, number>>;
export type Common = { t: number; w: number; id: string; lit?: Lit; hot?: string[]; dimRest?: number; build?: number };
const useOn = (t: number, lit: Lit) => (k: string) => (lit[k] === undefined ? 0 : ramp(t, (lit[k] as number) - 0.05, (lit[k] as number) + 0.3));

const Defs: React.FC<{ id: string }> = ({ id }) => (
  <defs>
    <filter id={`gl${id}`} x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation={10} />
    </filter>
    <linearGradient id={`bone${id}`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#E9E1C8" />
      <stop offset="0.5" stopColor="#FBF7EA" />
      <stop offset="1" stopColor="#D8CDAE" />
    </linearGradient>
    <linearGradient id={`skin${id}`} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#E7CDB8" />
      <stop offset="0.5" stopColor="#F3E2D2" />
      <stop offset="1" stopColor="#E2C4AD" />
    </linearGradient>
    <radialGradient id={`fat${id}`} cx="0.5" cy="0.45" r="0.6">
      <stop offset="0" stopColor="#FBF0C8" />
      <stop offset="1" stopColor="#EED9A0" />
    </radialGradient>
    {(["m", "S", "B", "G"] as const).map((k) => {
      const base = { m: ["#E0B3A2", "#C98F7B"], S: ["#C6DA9B", "#8FAE55"], B: ["#F2BE9C", "#D98A5E"], G: ["#E7BBAA", "#CD9682"] }[k];
      return (
        <pattern key={k} id={`mus${k}${id}`} width={13} height={13} patternUnits="userSpaceOnUse" patternTransform="rotate(80)">
          <rect width={13} height={13} fill={base[0]} />
          <line x1={0} y1={6.5} x2={13} y2={6.5} stroke={base[1]} strokeWidth={2.4} />
        </pattern>
      );
    })}
  </defs>
);

const Tube: React.FC<{ d: string; w: number; fill: string; edge: string; glow?: number; id: string; op?: number; dd?: number; hl?: boolean }> = ({ d, w, fill, edge, glow = 0, id, op = 1, dd = 1, hl = true }) => (
  <g opacity={op}>
    {glow > 0 && <path d={d} fill="none" stroke={C.banana} strokeWidth={w + 38} strokeLinecap="round" opacity={0.75 * glow} filter={`url(#gl${id})`} />}
    <path d={d} pathLength={1} strokeDasharray={`${dd} 1`} fill="none" stroke={edge} strokeWidth={w + 8} strokeLinecap="round" />
    <path d={d} pathLength={1} strokeDasharray={`${dd} 1`} fill="none" stroke={fill} strokeWidth={w} strokeLinecap="round" />
    {hl && <path d={d} pathLength={1} strokeDasharray={`${dd} 1`} fill="none" stroke="#FFFFFF" strokeWidth={w * 0.22} strokeLinecap="round" opacity={0.35} transform={`translate(${-w * 0.18} 0)`} />}
  </g>
);

/* key points (viewBox units) for callouts */
export const KA: Record<string, [number, number]> = {
  S: [300, 300], ST: [235, 330], A: [428, 420], V: [470, 470], N: [516, 400], B: [640, 300], CF: [600, 470], SSV: [462, 840],
  GM: [330, 720], GL: [585, 720], FL: [450, 520], TOP: [455, 150], BOT: [456, 708], FOSSA: [455, 430],
};

const PATHS = {
  sciatic: sp([[540, -20], [530, 60], [522, 130]]),
  tib: sp([[522, 130], [516, 260], [508, 420], [496, 600], [486, 800], [480, 1020]]),
  cf: sp([[522, 130], [560, 250], [600, 380], [630, 500], [652, 590], [640, 650], [600, 690]]),
  art: sp([[392, -20], [410, 100], [426, 260], [432, 420], [440, 600], [444, 780], [446, 1020]]),
  vein: sp([[430, -20], [452, 110], [468, 260], [474, 430], [470, 600], [466, 790], [470, 1020]]),
  ssv: sp([[470, 1020], [462, 900], [462, 780], [466, 680], [470, 600]]),
};

export const Knee: React.FC<Common & { diamond?: number; ssv?: number; cf?: number; tag?: Partial<Record<K, string>>; depth?: number }> = ({ t, w, id, lit = {}, hot = [], dimRest = 0, build = -99, diamond = 0, ssv = 0, cf = 1, tag, depth = 0 }) => {
  const on = useOn(t, lit);
  const dim = (k: string) => 1 - dimRest * (1 - on(k)) * 0.75;
  const b = (d: number) => ramp(t, build + d, build + d + 0.45);
  const S = { S: on("S"), A: on("A"), V: on("V"), N: on("N"), B: on("B") };
  const musFill = (k: "S" | "B", base: string) => (S[k] > 0.5 ? `url(#mus${k}${id})` : base);
  /* muscles */
  const SM = sp([[200, -20], [330, -20], [390, 120], [360, 260], [320, 400], [290, 520], [262, 600], [232, 560], [226, 420], [214, 240]], true);
  const ST = sp([[150, -20], [205, -20], [214, 200], [222, 380], [240, 520], [262, 640], [244, 650], [212, 540], [182, 380], [160, 180]], true);
  const BF = sp([[560, -20], [740, -20], [742, 200], [720, 380], [690, 520], [668, 620], [640, 600], [628, 480], [580, 300], [520, 140]], true);
  const GM = sp([[282, 452], [372, 456], [418, 575], [450, 700], [452, 860], [432, 1020], [250, 1020], [232, 850], [238, 640], [256, 520]], true);
  const GL = sp([[622, 452], [540, 456], [494, 575], [462, 700], [460, 860], [480, 1020], [652, 1020], [670, 850], [664, 640], [648, 520]], true);
  const g = (k: string) => (hot.includes(k) ? 1 : 0);
  return (
    <svg width={w} height={(w * 1000) / 900} viewBox="0 0 900 1000" style={{ display: "block", overflow: "visible" }}>
      <Defs id={id} />
      {/* skin silhouette */}
      <path d={sp([[130, -40], [770, -40], [775, 200], [755, 420], [728, 560], [740, 720], [722, 900], [700, 1040], [200, 1040], [178, 900], [160, 720], [172, 560], [146, 420], [126, 200]], true)} fill={`url(#skin${id})`} stroke="#C9A58D" strokeWidth={5} opacity={b(0)} />
      {/* floor: femur + condyles, tibia, fibula */}
      <g opacity={b(0.1) * (0.55 + 0.45 * on("FL")) * dim("FL")}>
        <path d={sp([[392, -30], [512, -30], [522, 200], [552, 330], [612, 400], [622, 470], [580, 520], [500, 500], [455, 470], [410, 500], [330, 520], [290, 470], [300, 400], [362, 330], [388, 200]], true)} fill={`url(#bone${id})`} stroke="#B9AC86" strokeWidth={5} />
        <path d={sp([[320, 560], [590, 560], [600, 610], [552, 650], [540, 1030], [372, 1030], [362, 650], [316, 610]], true)} fill={`url(#bone${id})`} stroke="#B9AC86" strokeWidth={5} />
        <path d={sp([[606, 600], [650, 586], [668, 620], [646, 660], [636, 1030], [606, 1030], [612, 660], [596, 630]], true)} fill={`url(#bone${id})`} stroke="#B9AC86" strokeWidth={5} />
        {/* popliteus on the floor */}
        <path d={sp([[600, 548], [560, 580], [440, 640], [360, 700], [356, 650], [430, 600], [560, 548]], true)} fill={`url(#musm${id})`} stroke="#B07A66" strokeWidth={4} opacity={0.85} />
      </g>
      {/* fossa fat */}
      <path d={sp([[455, 140], [322, 452], [456, 708], [594, 452]], true)} fill={`url(#fat${id})`} opacity={0.75 * b(0.2)} />
      {/* hamstrings: S (semimembranosus + semitendinosus) and B (biceps femoris) */}
      <g opacity={b(0.15) * dim("S")}>
        {g("S") > 0 && <path d={SM} fill={C.banana} filter={`url(#gl${id})`} opacity={0.8 * (0.6 + 0.4 * Math.sin(t * 7))} />}
        <path d={SM} fill={musFill("S", `url(#musm${id})`)} stroke={mix("#A9705C", "#5E7A2C", S.S)} strokeWidth={5} />
        <path d={ST} fill={musFill("S", `url(#musm${id})`)} stroke={mix("#A9705C", "#5E7A2C", S.S)} strokeWidth={5} />
        <path d={sp([[236, 470], [252, 560], [262, 640]])} fill="none" stroke="#F7F1E4" strokeWidth={13} strokeLinecap="round" opacity={0.95} />
      </g>
      <g opacity={b(0.2) * dim("B")}>
        {g("B") > 0 && <path d={BF} fill={C.banana} filter={`url(#gl${id})`} opacity={0.8 * (0.6 + 0.4 * Math.sin(t * 7))} />}
        <path d={BF} fill={musFill("B", `url(#musm${id})`)} stroke={mix("#A9705C", "#B3602F", S.B)} strokeWidth={5} />
        <path d={sp([[690, 470], [672, 560], [654, 612]])} fill="none" stroke="#F7F1E4" strokeWidth={13} strokeLinecap="round" opacity={0.95} />
      </g>
      {/* contents: artery (deepest) → vein → nerves (most superficial) */}
      <Tube id={id} d={PATHS.art} w={30} fill={mix("#B8786E", KCOL.A, 0.4 + 0.6 * S.A)} edge="#7E2A22" glow={g("A")} op={b(0.35) * dim("A")} dd={b(0.35)} />
      <Tube id={id} d={PATHS.vein} w={34} fill={mix("#7F93B5", KCOL.V, 0.4 + 0.6 * S.V)} edge="#263F6B" glow={g("V")} op={b(0.45) * dim("V")} dd={b(0.45)} />
      <Tube id={id} d={PATHS.cf} w={18} fill={mix("#E4D59A", KCOL.N, 0.4 + 0.6 * on("CF"))} edge="#8C7418" glow={g("CF")} op={b(0.6) * dim("CF") * cf} dd={b(0.6)} />
      <Tube id={id} d={PATHS.tib} w={24} fill={mix("#E4D59A", KCOL.N, 0.4 + 0.6 * S.N)} edge="#8C7418" glow={g("N")} op={b(0.55) * dim("N")} dd={b(0.55)} />
      <Tube id={id} d={PATHS.sciatic} w={34} fill={mix("#E4D59A", KCOL.N, 0.4 + 0.6 * Math.max(S.N, on("CF")))} edge="#8C7418" op={b(0.5) * Math.max(dim("N"), dim("CF"))} />
      {/* gastrocnemius heads: lower borders, cover the lower vessels */}
      <g opacity={b(0.3) * dim("G")}>
        {g("G") > 0 && <><path d={GM} fill={C.banana} filter={`url(#gl${id})`} opacity={0.7} /><path d={GL} fill={C.banana} filter={`url(#gl${id})`} opacity={0.7} /></>}
        <path d={GM} fill={on("G") > 0.5 ? `url(#musG${id})` : `url(#musm${id})`} stroke="#A9705C" strokeWidth={5} />
        <path d={GL} fill={on("G") > 0.5 ? `url(#musG${id})` : `url(#musm${id})`} stroke="#A9705C" strokeWidth={5} />
        <path d={sp([[456, 770], [458, 900], [458, 1030]])} fill="none" stroke="#A9705C" strokeWidth={4} opacity={0.8} />
      </g>
      {/* small saphenous vein: superficial, between the gastrocnemius heads, joins the popliteal vein */}
      {ssv > 0 && <Tube id={id} d={PATHS.ssv} w={14} fill={KCOL.V} edge="#263F6B" glow={g("SSV")} op={ssv} dd={ssv} hl={false} />}
      {/* the diamond outline */}
      {diamond > 0 && (
        <path d={`M 455 140 L 322 452 L 456 708 L 594 452 Z`} fill="none" stroke={C.forest} strokeWidth={7} strokeDasharray="24 14" strokeLinejoin="round" opacity={diamond} />
      )}
      {/* depth arrows (nerve superficial → artery deep) */}
      {depth > 0 && (
        <g opacity={depth}>
          {[["N", 516, 360], ["V", 472, 430], ["A", 432, 500]].map(([k, x, y]) => (
            <circle key={k as string} cx={x as number} cy={y as number} r={14} fill={C.paper} stroke={C.forest} strokeWidth={4} />
          ))}
        </g>
      )}
      {/* letter tags */}
      {tag &&
        (Object.keys(tag) as K[]).map((k) => {
          const pos: Record<K, [number, number]> = { S: [282, 230], A: [418, 340], V: [474, 300], N: [528, 250], B: [640, 230] };
          const [x, y] = pos[k];
          return (
            <g key={k}>
              <rect x={x - 30} y={y - 30} width={60} height={60} rx={16} fill={KCOL[k]} stroke={C.forest} strokeWidth={5} />
              <text x={x} y={y + 13} textAnchor="middle" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight={800} fontSize={38} fill={KDARK[k] ? C.paper : C.forest}>{tag[k]}</text>
            </g>
          );
        })}
    </svg>
  );
};

/* transverse section just above the knee, seen from below: front at the top, back (skin of the fossa) at the bottom */
export const SA: Record<string, [number, number]> = { A: [452, 470], V: [470, 560], N: [486, 650], FEM: [450, 330], SKIN: [470, 790], SM: [250, 560], BF: [690, 560] };
export const SectKnee: React.FC<Common & { arrow?: number; ask?: boolean }> = ({ t, w, id, lit = {}, hot = [], dimRest = 0, arrow = 0, ask }) => {
  const on = useOn(t, lit);
  const dim = (k: string) => 1 - dimRest * (1 - on(k)) * 0.75;
  const glow = (k: string) => (hot.includes(k) ? <circle cx={SA[k][0]} cy={SA[k][1]} r={70} fill={C.banana} filter={`url(#gl${id})`} opacity={0.6 + 0.4 * Math.sin(t * 7)} /> : null);
  const q = (k: string) => (ask ? 1 : on(k));
  return (
    <svg width={w} height={w} viewBox="0 0 900 900" style={{ display: "block", overflow: "visible" }}>
      <Defs id={id} />
      <path d={sp([[450, 70], [640, 100], [770, 230], [800, 430], [760, 640], [620, 800], [450, 840], [280, 800], [140, 640], [100, 430], [130, 230], [260, 100]], true)} fill={`url(#skin${id})`} stroke="#C9A58D" strokeWidth={6} />
      {/* quadriceps in front */}
      <path d={sp([[450, 110], [620, 140], [720, 250], [700, 330], [560, 270], [450, 250], [340, 270], [200, 330], [180, 250], [280, 140]], true)} fill={`url(#musm${id})`} stroke="#A9705C" strokeWidth={4} opacity={0.9 * dim("Q")} />
      {/* femur (the floor) */}
      <g opacity={dim("FEM")}>
        <path d={sp([[450, 280], [560, 290], [610, 350], [590, 410], [520, 420], [450, 400], [380, 420], [310, 410], [290, 350], [340, 290]], true)} fill={`url(#bone${id})`} stroke="#B9AC86" strokeWidth={6} />
      </g>
      {/* hamstrings at the sides */}
      <path d={sp([[160, 470], [300, 450], [350, 560], [320, 700], [220, 700], [150, 600]], true)} fill={`url(#musS${id})`} stroke="#5E7A2C" strokeWidth={4} opacity={dim("SM")} />
      <path d={sp([[740, 470], [600, 450], [560, 560], [590, 700], [690, 700], [755, 600]], true)} fill={`url(#musB${id})`} stroke="#B3602F" strokeWidth={4} opacity={dim("BF")} />
      {/* fossa fat */}
      <path d={sp([[450, 420], [560, 450], [570, 600], [520, 770], [420, 770], [360, 600], [360, 460]], true)} fill={`url(#fat${id})`} />
      {glow("A")}{glow("V")}{glow("N")}
      <circle cx={SA.A[0]} cy={SA.A[1]} r={34} fill={mix("#B8786E", KCOL.A, q("A"))} stroke="#7E2A22" strokeWidth={6} opacity={dim("A")} />
      <circle cx={SA.A[0]} cy={SA.A[1]} r={14} fill="#F4D2CC" opacity={dim("A") * 0.9} />
      <ellipse cx={SA.V[0]} cy={SA.V[1]} rx={44} ry={34} fill={mix("#7F93B5", KCOL.V, q("V"))} stroke="#263F6B" strokeWidth={6} opacity={dim("V")} />
      <circle cx={SA.N[0]} cy={SA.N[1]} r={30} fill={mix("#E4D59A", KCOL.N, q("N"))} stroke="#8C7418" strokeWidth={6} opacity={dim("N")} />
      {[0, 1, 2].map((i) => <circle key={i} cx={SA.N[0] - 10 + i * 10} cy={SA.N[1] + (i === 1 ? -8 : 6)} r={6} fill="#C9A92A" opacity={dim("N") * 0.7} />)}
      {ask && [SA.A, SA.V, SA.N].map(([x, y], i) => <text key={i} x={x + 62} y={y + 14} fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight={800} fontSize={40} fill={C.forest}>?</text>)}
      {arrow > 0 && (
        <g opacity={arrow}>
          <line x1={392} y1={790} x2={392} y2={440 + (1 - arrow) * 330} stroke={C.forest} strokeWidth={9} strokeLinecap="round" />
          <path d={`M 374 ${462 + (1 - arrow) * 330} L 392 ${432 + (1 - arrow) * 330} L 410 ${462 + (1 - arrow) * 330}`} fill="none" stroke={C.forest} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </svg>
  );
};
