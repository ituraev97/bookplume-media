import React from "react";
import { C, FONT, ramp } from "./kit";

/* Book Plume diagrams for the carotid sheath (short 86).
   Facts: StatPearls "Anatomy, Head and Neck, Carotid Sheath" (contents: common + internal carotid a., internal jugular v., vagus n.;
   artery medial, vein lateral, vagus posterior; external carotid leaves the sheath at the bifurcation; deep cervical lymph nodes
   along it; ansa cervicalis in its anterior wall); Kenhub "Carotid sheath" + TTUHSC El Paso deep neck (sympathetic trunk lies
   POSTERIOR to the sheath, embedded in the prevertebral fascia); Gray 1918 Fig. 384 (section at C6).
   FrontNeck: RIGHT side of the neck seen from the front (patient's right = screen left, midline = screen right). viewBox 900 x 1000.
   SectNeck: transverse section at about C6, seen from below (front at the top, patient's right = screen left). viewBox 900 x 900. */

export type K = "IC" | "VG" | "CC" | "IV";
export const KORDER: K[] = ["IC", "VG", "CC", "IV"];
export const KCOL: Record<K, string> = { IC: "#E8877A", VG: "#F2C94C", CC: "#C9483C", IV: "#5B86C9" };
export const KLAB: Record<K, string> = { IC: "IC", VG: "10", CC: "CC", IV: "IV" };

const mix = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return "#" + pa.map((v, i) => Math.round(v + (pb[i] - v) * Math.max(0, Math.min(1, k))).toString(16).padStart(2, "0")).join("");
};
/* Catmull-Rom through points */
const sp = (pts: [number, number][], close = false) => {
  const p = [...pts];
  if (close) p.push(p[0], p[1]);
  let d = `M ${p[0][0]} ${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[Math.max(0, i - 1)], p1 = p[i], p2 = p[i + 1], p3 = p[Math.min(p.length - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return close ? d + " Z" : d;
};

type Lit = Partial<Record<string, number>>;
type Common = { t: number; w: number; id: string; lit?: Lit; hot?: string[]; dimRest?: number; build?: number };
const useOn = (t: number, lit: Lit) => (k: string) => (lit[k] === undefined ? 0 : ramp(t, (lit[k] as number) - 0.05, (lit[k] as number) + 0.3));

const Defs: React.FC<{ id: string }> = ({ id }) => (
  <defs>
    <filter id={`gl${id}`} x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation={10} />
    </filter>
    <linearGradient id={`bone${id}`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#E9E1C8" />
      <stop offset="0.5" stopColor="#FBF7EA" />
      <stop offset="1" stopColor="#DCD2B4" />
    </linearGradient>
    <linearGradient id={`art${id}`} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#B4443A" />
      <stop offset="0.45" stopColor="#E3796B" />
      <stop offset="1" stopColor="#A63A31" />
    </linearGradient>
    <linearGradient id={`vein${id}`} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#36598F" />
      <stop offset="0.45" stopColor="#6E95D2" />
      <stop offset="1" stopColor="#2F4F82" />
    </linearGradient>
    <radialGradient id={`rart${id}`} cx="0.4" cy="0.35" r="0.7">
      <stop offset="0" stopColor="#F09A8C" />
      <stop offset="1" stopColor="#A63A31" />
    </radialGradient>
    <radialGradient id={`rvein${id}`} cx="0.4" cy="0.35" r="0.7">
      <stop offset="0" stopColor="#86A8DE" />
      <stop offset="1" stopColor="#2F4F82" />
    </radialGradient>
    <pattern id={`mus${id}`} width={14} height={14} patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
      <rect width={14} height={14} fill="#E3B9A9" />
      <line x1={0} y1={7} x2={14} y2={7} stroke="#CF9C8A" strokeWidth={2.5} />
    </pattern>
  </defs>
);

/* tube stroke helper: outline, fill, highlight */
const Tube: React.FC<{ d: string; w: number; fill: string; edge: string; dd?: number; glow?: boolean; id: string; pulse: number; dash?: string; op?: number }> = ({ d, w, fill, edge, dd = 1, glow, id, pulse, dash, op = 1 }) => (
  <g opacity={op}>
    {glow && <path d={d} fill="none" stroke={C.banana} strokeWidth={w + 34} strokeLinecap="round" opacity={0.6 * pulse} filter={`url(#gl${id})`} />}
    <path d={d} pathLength={1} strokeDasharray={dash ? undefined : `${dd} 1`} fill="none" stroke={edge} strokeWidth={w + 7} strokeLinecap="round" />
    <path d={d} pathLength={dash ? undefined : 1} strokeDasharray={dash ? dash : `${dd} 1`} fill="none" stroke={fill} strokeWidth={w} strokeLinecap="round" />
    {!dash && <path d={d} pathLength={1} strokeDasharray={`${dd} 1`} fill="none" stroke="#FFFFFF" strokeWidth={Math.max(2, w * 0.18)} strokeLinecap="round" opacity={0.45} transform="translate(-3 0)" />}
  </g>
);

/* ---------------- FRONT VIEW geometry ---------------- */
const SHEATH = sp([[330, 95], [345, 300], [338, 560], [326, 940], [604, 945], [606, 640], [598, 380], [592, 95]], false) + " Z";
const IJV = sp([[372, 70], [392, 130], [384, 260], [378, 480], [380, 700], [372, 960]]);
const VAG = sp([[452, 60], [458, 250], [455, 500], [452, 760], [456, 980]]);
const CCA = sp([[530, 1010], [532, 800], [528, 600], [526, 448]]);
const ICA = sp([[524, 452], [516, 395], [506, 300], [500, 180], [496, 60]]);
const BULB = "M 506 450 C 494 420 498 384 512 372 C 528 384 536 420 530 450 Z";
const ECA = sp([[532, 448], [556, 400], [596, 345], [636, 268], [668, 190], [690, 110]]);
const ECA_BR = [sp([[548, 420], [588, 452], [622, 500], [640, 540]]), sp([[600, 338], [646, 326], [700, 322]]), sp([[630, 280], [676, 258], [722, 252]]), sp([[650, 230], [626, 200], [600, 170]])];
const SYM = sp([[548, 60], [552, 300], [550, 600], [548, 980]]);
const NODES: [number, number, number][] = [[338, 250, 16], [346, 470, 19], [334, 700, 15], [342, 860, 17]];
export const FA: Record<string, [number, number]> = {
  IC: [503, 240], ECA: [652, 230], VG: [455, 620], CC: [530, 760], IV: [380, 560], BIF: [528, 446], SH: [600, 640], SY: [550, 300], ND: [346, 470], TC: [760, 400],
};

export const FrontNeck: React.FC<Common & { eca?: number; nodes?: number; sym?: number; sheath?: number; tag?: Partial<Record<K, string>> }> = ({ t, w, id, lit = {}, hot = [], dimRest = 0, build, eca = 1, nodes = 0, sym = 0, sheath = 1, tag }) => {
  const s = w / 900;
  const on = useOn(t, lit);
  const pulse = 0.65 + 0.35 * Math.sin(t * 7);
  const dr = (k: number) => (build === undefined ? 1 : ramp(t, build + k * 0.14, build + k * 0.14 + 0.5));
  const dim = (k: string) => 1 - dimRest * (on(k) > 0 ? 0 : 0.65);
  const glow = (k: string) => hot.includes(k) && on(k) > 0;
  return (
    <svg width={w} height={1000 * s} viewBox="0 0 900 1000" style={{ display: "block", overflow: "visible" }}>
      <Defs id={id} />
      {/* neck silhouette */}
      <path d={sp([[160, -40], [230, 200], [250, 520], [210, 830], [120, 1040], [960, 1040], [960, -40]], false) + " Z"} fill="#F1E3D3" stroke="#DCC6AE" strokeWidth={4} />
      {/* skull base + mastoid */}
      <path d="M 120 -40 L 860 -40 L 860 30 C 700 52 520 60 380 56 C 300 54 250 60 230 96 C 214 122 196 110 190 80 L 120 60 Z" fill={`url(#bone${id})`} stroke="#A99B74" strokeWidth={4} />
      {/* mandible (faint, the dissection sits behind it) */}
      <path d="M 610 -30 C 630 60 640 150 660 210 C 690 280 780 300 920 300 L 920 250 C 800 252 720 240 700 190 C 684 140 680 60 676 -30 Z" fill="#EFE7D2" stroke="#BDAF89" strokeWidth={3} opacity={0.6} />
      {/* larynx + trachea at the midline */}
      <rect x={784} y={244} width={150} height={20} rx={10} fill={`url(#bone${id})`} stroke="#A99B74" strokeWidth={3} />
      <path d="M 720 300 L 940 300 L 940 470 L 770 470 C 740 420 724 360 720 300 Z" fill="#E6E0CB" stroke="#A99B74" strokeWidth={4} />
      <path d="M 760 486 L 940 486 L 940 526 L 770 526 Z" fill="#E6E0CB" stroke="#A99B74" strokeWidth={3} />
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={770} y={548 + i * 38} width={180} height={24} rx={11} fill="#ECE5D0" stroke="#B8AA84" strokeWidth={3} />
      ))}
      {/* thyroid lobe */}
      <path d={sp([[690, 530], [742, 560], [760, 640], [740, 730], [690, 750], [650, 690], [652, 590]], true)} fill="#C98B78" stroke="#9A5E4E" strokeWidth={4} opacity={0.92} />
      {/* clavicle */}
      <path d="M 120 950 C 300 925 520 935 760 975" fill="none" stroke="#CFC3A4" strokeWidth={56} strokeLinecap="round" />
      <path d="M 120 950 C 300 925 520 935 760 975" fill="none" stroke="#F3EDDA" strokeWidth={40} strokeLinecap="round" />
      {/* sympathetic trunk: BEHIND (dashed) */}
      {sym > 0 && (
        <g opacity={sym * dim("SY")}>
          {glow("SY") && <path d={SYM} fill="none" stroke={C.banana} strokeWidth={40} opacity={0.6 * pulse} filter={`url(#gl${id})`} />}
          <path d={SYM} fill="none" stroke="#B49A55" strokeWidth={12} strokeDasharray="18 12" />
          <path d="M 548 150 C 562 180 562 240 548 270 C 536 240 536 180 548 150 Z" fill="#E9D79B" stroke="#9C8443" strokeWidth={3} />
          <ellipse cx={549} cy={610} rx={10} ry={22} fill="#E9D79B" stroke="#9C8443" strokeWidth={3} />
        </g>
      )}
      {/* vagus (between the vessels, behind them) */}
      <g opacity={dim("VG")}>
        <Tube d={VAG} w={14} fill={mix("#F4E6BE", KCOL.VG, on("VG"))} edge={mix("#A88B45", "#3B4A26", on("VG") * 0.5)} dd={dr(1)} glow={glow("VG")} id={id} pulse={pulse} />
      </g>
      {/* internal jugular vein (lateral) */}
      <g opacity={dim("IV")}>
        <Tube d={IJV} w={50} fill={on("IV") > 0.01 ? mix("#5277B3", KCOL.IV, on("IV")) : `url(#vein${id})`} edge="#22385E" dd={dr(0)} glow={glow("IV")} id={id} pulse={pulse} />
        <ellipse cx={384} cy={92} rx={36} ry={30} fill={`url(#vein${id})`} stroke="#22385E" strokeWidth={4} opacity={dr(0)} />
      </g>
      {/* deep cervical lymph nodes along the IJV */}
      {nodes > 0 && NODES.map(([x, y, r], i) => (
        <g key={i} opacity={nodes * ramp(nodes, i * 0.15, i * 0.15 + 0.4)}>
          {glow("ND") && <ellipse cx={x} cy={y} rx={r + 18} ry={r * 1.4 + 18} fill={C.banana} opacity={0.5 * pulse} filter={`url(#gl${id})`} />}
          <ellipse cx={x} cy={y} rx={r} ry={r * 1.4} fill="#9DBB6A" stroke="#4F6B2A" strokeWidth={4} />
        </g>
      ))}
      {/* arteries */}
      <g opacity={dim("CC")}>
        <Tube d={CCA} w={38} fill={on("CC") > 0.01 ? mix("#C9584A", KCOL.CC, on("CC")) : `url(#art${id})`} edge="#7E2F27" dd={dr(2)} glow={glow("CC")} id={id} pulse={pulse} />
      </g>
      <g opacity={dim("ECA") * eca}>
        <Tube d={ECA} w={25} fill={`url(#art${id})`} edge="#7E2F27" dd={dr(3)} glow={glow("ECA")} id={id} pulse={pulse} />
        {ECA_BR.map((b, i) => <path key={i} d={b} fill="none" stroke="#B9584B" strokeWidth={11} strokeLinecap="round" opacity={dr(3.5)} />)}
      </g>
      <g opacity={dim("IC")}>
        <Tube d={ICA} w={32} fill={on("IC") > 0.01 ? mix("#C9584A", KCOL.IC, on("IC")) : `url(#art${id})`} edge="#7E2F27" dd={dr(2.6)} glow={glow("IC")} id={id} pulse={pulse} />
        <path d={BULB} fill={on("IC") > 0.01 ? mix("#C9584A", KCOL.IC, on("IC")) : "#D46B5D"} stroke="#7E2F27" strokeWidth={4} opacity={dr(2.6)} />
      </g>
      {/* the sheath itself: translucent tube around artery + vein + vagus (not around the external carotid) */}
      {sheath > 0 && (
        <g opacity={sheath}>
          {glow("SH") && <path d={SHEATH} fill="none" stroke={C.banana} strokeWidth={30} opacity={0.6 * pulse} filter={`url(#gl${id})`} />}
          <path d={SHEATH} fill={C.matcha} opacity={0.13 + 0.07 * on("SH")} />
          <path d={SHEATH} fill="none" stroke={C.matcha} strokeWidth={6} strokeDasharray="20 12" />
        </g>
      )}
      {tag &&
        (Object.keys(tag) as K[]).map((k) => {
          const [x, y] = FA[k];
          return (
            <g key={k} transform={`translate(${x} ${y})`}>
              <rect x={-38} y={-30} width={76} height={60} rx={18} fill={KCOL[k]} stroke={C.forest} strokeWidth={5} />
              <text y={13} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={C.forest}>{tag[k]}</text>
            </g>
          );
        })}
    </svg>
  );
};

/* ---------------- SECTION VIEW geometry (C6) ---------------- */
export const SA: Record<string, [number, number]> = {
  CC: [292, 322], IV: [190, 318], VG: [244, 376], SY: [318, 420], SH: [170, 270], TR: [450, 205], ES: [450, 318], VB: [450, 445], SCM: [128, 215], PF: [378, 410], TH: [352, 235], LC: [392, 392],
};
const Side: React.FC<{ id: string; t: number; on: (k: string) => number; hot: string[]; dim: (k: string) => number; pulse: number; ask?: boolean; mirror?: boolean; fasc?: number }> = ({ id, t, on, hot, dim, pulse, ask, mirror, fasc = 0 }) => {
  const glow = (k: string) => !mirror && hot.includes(k) && on(k) > 0;
  const G = (k: string, el: React.ReactNode, r: number, x: number, y: number) => (
    <g opacity={dim(k)}>
      {glow(k) && <circle cx={x} cy={y} r={r + 26} fill={C.banana} opacity={0.65 * pulse} filter={`url(#gl${id})`} />}
      {el}
    </g>
  );
  return (
    <g transform={mirror ? "translate(900 0) scale(-1 1)" : undefined}>
      {/* sternocleidomastoid */}
      <ellipse cx={128} cy={215} rx={62} ry={96} transform="rotate(-38 128 215)" fill={`url(#mus${id})`} stroke="#A9705E" strokeWidth={4} />
      {/* prevertebral muscle (longus colli) */}
      <ellipse cx={392} cy={392} rx={40} ry={22} fill={`url(#mus${id})`} stroke="#A9705E" strokeWidth={3} />
      {/* scalene + deep muscles */}
      <ellipse cx={262} cy={500} rx={54} ry={34} transform="rotate(20 262 500)" fill={`url(#mus${id})`} stroke="#A9705E" strokeWidth={3} opacity={0.9} />
      <path d={sp([[160, 600], [260, 590], [370, 640], [420, 760], [330, 820], [200, 740]], true)} fill={`url(#mus${id})`} stroke="#A9705E" strokeWidth={3} opacity={0.75} />
      {/* thyroid lobe */}
      <path d={sp([[392, 168], [372, 228], [352, 292], [318, 296], [300, 240], [330, 178]], true)} fill="#C98B78" stroke="#9A5E4E" strokeWidth={4} />
      {/* prevertebral fascia */}
      <path d="M 200 470 C 240 430 300 420 350 418 C 400 412 430 404 450 404" fill="none" stroke={fasc > 0 ? mix(C.matcha, "#2F4F1A", 0.3) : "#9FAE86"} strokeWidth={fasc > 0 ? 8 : 5} strokeDasharray="14 9" opacity={0.55 + 0.45 * fasc} />
      {fasc > 0 && !mirror && <path d="M 200 470 C 240 430 300 420 350 418 C 400 412 430 404 450 404" fill="none" stroke={C.banana} strokeWidth={30} opacity={0.5 * pulse * fasc} filter={`url(#gl${id})`} />}
      {/* sympathetic trunk: behind the sheath, in the prevertebral fascia */}
      {G("SY", <>
        <circle cx={318} cy={420} r={15} fill={mix("#F4E6BE", "#E9C24A", on("SY"))} stroke="#9C8443" strokeWidth={4} />
        <circle cx={314} cy={416} r={4} fill="#FFFFFF" opacity={0.6} />
      </>, 15, 318, 420)}
      {ask && !mirror && (
        <g transform={`translate(318 420) scale(${1 + 0.08 * Math.sin(t * 6)})`}>
          <circle r={34} fill={C.forest} stroke={C.banana} strokeWidth={6} />
          <text y={15} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill={C.banana}>?</text>
        </g>
      )}
      {/* carotid sheath */}
      <g opacity={dim("SH") < 1 ? 0.55 + 0.45 * dim("SH") : 1}>
        {glow("SH") && <ellipse cx={240} cy={335} rx={118} ry={92} fill="none" stroke={C.banana} strokeWidth={28} opacity={0.6 * pulse} filter={`url(#gl${id})`} />}
        <ellipse cx={240} cy={335} rx={112} ry={86} fill={C.matcha} opacity={0.16} />
        <ellipse cx={240} cy={335} rx={112} ry={86} fill="none" stroke={C.matcha} strokeWidth={6} strokeDasharray="16 10" />
      </g>
      {G("IV", <>
        <ellipse cx={190} cy={318} rx={50} ry={36} fill={on("IV") > 0.01 ? mix("#5277B3", KCOL.IV, on("IV")) : `url(#rvein${id})`} stroke="#22385E" strokeWidth={5} />
        <ellipse cx={176} cy={306} rx={16} ry={8} fill="#FFFFFF" opacity={0.35} />
      </>, 44, 190, 318)}
      {G("CC", <>
        <circle cx={292} cy={322} r={34} fill={on("CC") > 0.01 ? mix("#C9584A", KCOL.CC, on("CC")) : `url(#rart${id})`} stroke="#7E2F27" strokeWidth={6} />
        <circle cx={292} cy={322} r={17} fill="#7E2F27" opacity={0.35} />
      </>, 34, 292, 322)}
      {G("VG", <>
        <circle cx={244} cy={376} r={17} fill={mix("#F4E6BE", KCOL.VG, on("VG"))} stroke="#9C8443" strokeWidth={4} />
        {[[-6, -5], [5, -6], [0, 5], [-7, 6], [7, 4]].map(([dx, dy], i) => <circle key={i} cx={244 + dx} cy={376 + dy} r={3.2} fill="#9C8443" opacity={0.7} />)}
      </>, 17, 244, 376)}
    </g>
  );
};

export const SectNeck: React.FC<Common & { ask?: boolean; fasc?: number; arrows?: number }> = ({ t, w, id, lit = {}, hot = [], dimRest = 0, ask, fasc = 0, arrows = 0 }) => {
  const s = w / 900;
  const on = useOn(t, lit);
  const pulse = 0.65 + 0.35 * Math.sin(t * 7);
  const dim = (k: string) => 1 - dimRest * (on(k) > 0 ? 0 : 0.6);
  return (
    <svg width={w} height={900 * s} viewBox="0 0 900 900" style={{ display: "block", overflow: "visible" }}>
      <Defs id={id} />
      {/* skin */}
      <ellipse cx={450} cy={455} rx={430} ry={390} fill="#F1E3D3" stroke="#DCC6AE" strokeWidth={5} />
      {/* vertebra C6 */}
      <g opacity={1 - dimRest * 0.35}>
        <path d="M 330 440 C 300 420 270 430 262 452 C 256 474 286 486 318 480 L 360 476 Z" fill={`url(#bone${id})`} stroke="#A99B74" strokeWidth={4} />
        <path d="M 570 440 C 600 420 630 430 638 452 C 644 474 614 486 582 480 L 540 476 Z" fill={`url(#bone${id})`} stroke="#A99B74" strokeWidth={4} />
        <ellipse cx={450} cy={452} rx={92} ry={58} fill={`url(#bone${id})`} stroke="#A99B74" strokeWidth={5} />
        <circle cx={322} cy={458} r={13} fill="#E7A396" stroke="#8F4A3E" strokeWidth={3} />
        <circle cx={578} cy={458} r={13} fill="#E7A396" stroke="#8F4A3E" strokeWidth={3} />
        <path d="M 380 500 C 380 600 420 610 450 680 C 480 610 520 600 520 500 Z" fill={`url(#bone${id})`} stroke="#A99B74" strokeWidth={4} />
        <circle cx={450} cy={548} r={42} fill="#F7F1DF" stroke="#A99B74" strokeWidth={4} />
        <ellipse cx={450} cy={548} rx={26} ry={20} fill="#EAD9A6" stroke="#B49A55" strokeWidth={3} />
      </g>
      {/* trachea */}
      <g opacity={1 - dimRest * 0.35}>
        <circle cx={450} cy={205} r={74} fill="#ECE5D0" stroke="#A99B74" strokeWidth={5} />
        <path d="M 400 268 A 64 64 0 1 1 500 268" fill="none" stroke="#F8F3E2" strokeWidth={14} />
        <circle cx={450} cy={205} r={50} fill="#5E4A43" />
        <rect x={404} y={262} width={92} height={18} rx={9} fill="#D9A493" />
        {/* esophagus */}
        <ellipse cx={450} cy={322} rx={62} ry={30} fill="#D9A493" stroke="#9A5E4E" strokeWidth={4} />
        <path d="M 412 322 Q 450 312 488 322" fill="none" stroke="#9A5E4E" strokeWidth={3} />
      </g>
      <g opacity={0.42}>
        <Side id={id} t={t} on={() => 0} hot={[]} dim={() => 1} pulse={pulse} mirror />
      </g>
      <Side id={id} t={t} on={on} hot={hot} dim={dim} pulse={pulse} ask={ask} fasc={fasc} />
      {/* position arrows: medial (toward midline) / lateral / posterior */}
      {arrows > 0 && (
        <g opacity={arrows} fontFamily={FONT} fontWeight={800}>
          <path d="M 380 112 L 444 112" stroke={C.forest} strokeWidth={6} markerEnd="" />
          <path d="M 432 100 L 448 112 L 432 124" fill="none" stroke={C.forest} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
          <text x={372} y={122} textAnchor="end" fontSize={30} fill={C.forest}>midline</text>
        </g>
      )}
    </svg>
  );
};
