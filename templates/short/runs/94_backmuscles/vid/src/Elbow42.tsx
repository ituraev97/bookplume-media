import React from "react";
import { C, FONT, ramp } from "./kit";

/**
 * Our own schematic ANTERIOR view of the RIGHT elbow (Book Plume illustration). viewBox 860 x 680.
 * Lateral (thumb side) = viewer's LEFT, medial = viewer's RIGHT (same as Gray's 1918 Figs. 527/528).
 * Cubital fossa: superior border = line between the epicondyles, lateral = medial border of brachioradialis,
 * medial = lateral border of pronator teres. Floor = brachialis (+ supinator). Roof = skin, fascia, bicipital aponeurosis,
 * median cubital vein in the superficial fascia. Contents lateral -> medial: radial nerve, biceps tendon, brachial artery, median nerve.
 */
export type CId = "rn" | "bt" | "ba" | "mn";
export type EPart = CId | "br" | "pt" | "line" | "tri" | "roof" | "mcv" | "veins" | "floor" | "lep" | "mep";
export const CONTENTS: CId[] = ["rn", "bt", "ba", "mn"];
export const CT: Record<CId, { pair: string; words: string; name: string; l1: string; l2: string }> = {
  rn: { pair: "RN", words: "Really Need", name: "Radial nerve", l1: "Radial", l2: "nerve" },
  bt: { pair: "BT", words: "Beer To", name: "Biceps tendon", l1: "Biceps", l2: "tendon" },
  ba: { pair: "BA", words: "Be At", name: "Brachial artery", l1: "Brachial", l2: "artery" },
  mn: { pair: "MN", words: "My Nicest", name: "Median nerve", l1: "Median", l2: "nerve" },
};

const ARM =
  "M 252 -40 C 236 60 214 160 204 232 C 196 256 186 276 194 300 C 204 360 222 450 242 560 C 252 620 262 680 270 720 L 592 720 C 604 640 624 520 640 420 C 652 360 680 320 688 286 C 694 262 676 240 662 214 C 648 150 628 60 612 -40 Z";
const HUMERUS =
  "M 372 -40 L 376 168 C 340 196 276 218 250 246 C 236 260 242 280 260 284 L 334 294 C 384 302 480 302 560 294 L 632 286 C 656 284 668 262 652 246 C 624 218 524 198 492 168 L 490 -40 Z";
const FLOOR = "M 318 150 C 380 130 500 130 560 160 C 590 220 590 300 560 360 C 520 430 460 500 410 560 C 380 520 350 420 336 330 C 326 260 318 200 318 150 Z";
const BICEPS = "M 344 -40 C 330 50 352 140 394 206 L 424 206 C 470 140 512 60 506 -40 Z";
const TENDON = "M 409 200 C 410 260 412 320 414 392";
const APONEUROSIS = "M 414 226 L 566 286 L 552 318 L 412 260 Z";
const BR =
  "M 214 30 C 262 56 300 108 318 168 C 338 236 350 330 368 420 C 384 500 392 560 372 640 C 364 672 356 700 350 720 L 272 720 C 252 620 228 500 212 380 C 198 270 196 150 214 30 Z";
const PT =
  "M 644 248 C 664 272 656 300 636 322 C 576 404 488 520 408 640 L 356 664 C 362 616 382 572 404 540 C 472 442 542 352 600 262 C 612 244 630 238 644 248 Z";
const RN = "M 300 -40 C 318 80 352 200 366 300 C 374 380 370 460 356 560";
const RN_DEEP = "M 352 470 C 340 520 318 560 300 610";
const BA = "M 468 -40 C 466 100 462 250 456 360 C 454 410 452 440 448 470";
const RA = "M 448 470 C 420 520 388 600 372 720";
const UA = "M 448 470 C 470 540 500 620 520 720";
const MN = "M 522 -40 C 520 100 518 250 513 340 C 508 420 482 520 462 720";
const TRI = "M 342 262 L 600 262 L 398 534 Z";
const CEPH = "M 226 720 C 222 560 214 420 210 300 C 208 180 226 60 244 -40";
const BAS = "M 600 720 C 624 560 652 420 662 300 C 668 220 642 120 618 -40";
const MCV = "M 214 430 C 320 392 470 330 660 262";

type Lab = { ax: number; ay: number; px: number; py: number; text: string };
const LAB: Partial<Record<EPart, Lab>> = {
  br: { ax: 262, ay: 470, px: 150, py: 600, text: "Brachioradialis" },
  pt: { ax: 560, ay: 380, px: 700, py: 480, text: "Pronator teres" },
  line: { ax: 470, ay: 262, px: 470, py: 205, text: "Epicondyle line" },
  rn: { ax: 360, ay: 330, px: 150, py: 320, text: "Radial nerve" },
  bt: { ax: 410, ay: 280, px: 240, py: 200, text: "Biceps tendon" },
  ba: { ax: 459, ay: 320, px: 670, py: 160, text: "Brachial artery" },
  mn: { ax: 514, ay: 330, px: 700, py: 330, text: "Median nerve" },
  mcv: { ax: 430, ay: 340, px: 470, py: 600, text: "Median cubital vein" },
  floor: { ax: 520, ay: 200, px: 690, py: 110, text: "Floor: brachialis" },
};

const mix = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return "#" + pa.map((v, i) => Math.round(v + (pb[i] - v) * k).toString(16).padStart(2, "0")).join("");
};

export const Elbow: React.FC<{
  t: number;
  w?: number;
  lit?: Partial<Record<EPart, number>>;
  focus?: EPart[];
  dimFrom?: number;
  show?: Partial<Record<CId | "mcv" | "roof" | "tri" | "line", number>>; // draw-in time; undefined = hidden (contents) / hidden (overlays)
  contentsAll?: boolean; // contents fully drawn from the start
  labels?: Partial<Record<EPart, number>>;
  labelEnd?: Partial<Record<EPart, number>>;
}> = ({ t, w = 860, lit = {}, focus = [], dimFrom, show = {}, contentsAll, labels = {}, labelEnd = {} }) => {
  const s = w / 860;
  const on = (id: EPart) => (lit[id] === undefined ? 0 : ramp(t, (lit[id] as number) - 0.05, (lit[id] as number) + 0.3));
  const dimP = dimFrom === undefined ? 0 : ramp(t, dimFrom, dimFrom + 0.4);
  const op = (id: EPart) => 1 - 0.45 * dimP * (1 - on(id));
  const glow = (id: EPart) => (focus.includes(id) ? on(id) * (0.72 + 0.28 * Math.sin(t * 7)) : 0);
  const drawn = (id: CId | "mcv" | "roof" | "tri" | "line") => {
    if (contentsAll && (CONTENTS as string[]).includes(id)) return 1;
    const v = show[id];
    return v === undefined ? 0 : ramp(t, v, v + 0.7);
  };

  const Tube: React.FC<{ d: string; width: number; id: EPart; p: number; color: string; hi: string; litColor?: string }> = ({ d, width, id, p, color, hi, litColor }) => {
    if (p <= 0.001) return null;
    const gl = glow(id);
    const da = `${p} 2`;
    const lt = on(id);
    const common = { d, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, pathLength: 1, strokeDasharray: da };
    return (
      <g opacity={op(id)}>
        {gl > 0 && <path {...common} stroke={C.banana} strokeWidth={width + 24 + 6 * gl} opacity={0.85 * gl} />}
        <path {...common} stroke={C.forest} strokeWidth={width + 7} />
        <path {...common} stroke={litColor && lt > 0 ? mix(color, litColor, lt) : color} strokeWidth={width} />
        <path {...common} stroke={hi} strokeWidth={Math.max(2, width * 0.3)} opacity={0.8} transform="translate(-1.8 -1.6)" />
      </g>
    );
  };

  const Muscle: React.FC<{ d: string; id: EPart; fid: string; angle: number }> = ({ d, id, fid, angle }) => {
    const lt = on(id);
    const gl = glow(id);
    return (
      <g filter="url(#sh42)">
        {gl > 0 && <path d={d} fill="none" stroke={C.banana} strokeWidth={22 + 6 * gl} strokeLinejoin="round" opacity={0.85 * gl} />}
        <path d={d} fill={`url(#${fid})`} stroke={C.forest} strokeWidth={5} strokeLinejoin="round" />
        <clipPath id={`c${fid}`}>
          <path d={d} />
        </clipPath>
        <g clipPath={`url(#c${fid})`}>
          <rect x={-200} y={-200} width={1300} height={1100} fill="url(#fib42)" transform={`rotate(${angle} 430 340)`} opacity={0.5} />
          {lt > 0 && <path d={d} fill={C.banana} opacity={0.28 * lt} />}
          {dimP > 0 && <path d={d} fill="#F7F6EC" opacity={0.5 * dimP * (1 - lt)} />}
        </g>
      </g>
    );
  };

  const roofP = drawn("roof");
  const mcvP = drawn("mcv");
  const triP = drawn("tri");
  const lineP = drawn("line");
  const lepP = on("lep");
  const mepP = on("mep");

  return (
    <svg width={860 * s} height={680 * s} viewBox="0 0 860 680" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="skin42" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F6E9D6" />
          <stop offset="1" stopColor="#EBD5B8" />
        </linearGradient>
        <linearGradient id="musA42" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E3907F" />
          <stop offset="1" stopColor="#B95A49" />
        </linearGradient>
        <linearGradient id="musB42" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#DE8877" />
          <stop offset="1" stopColor="#B05242" />
        </linearGradient>
        <linearGradient id="musC42" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E59A88" />
          <stop offset="1" stopColor="#C46A57" />
        </linearGradient>
        <linearGradient id="floor42" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E8B3A3" />
          <stop offset="1" stopColor="#D69683" />
        </linearGradient>
        <linearGradient id="bone42" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFBEF" />
          <stop offset="1" stopColor="#EFE6CC" />
        </linearGradient>
        <filter id="sh42" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx={0} dy={4} stdDeviation={4} floodColor="#1F2A14" floodOpacity={0.28} />
        </filter>
        <pattern id="fib42" width={14} height={14} patternUnits="userSpaceOnUse">
          <line x1={0} y1={0} x2={0} y2={14} stroke="#8F3A2C" strokeWidth={2} opacity={0.55} />
        </pattern>
        <pattern id="apo42" width={12} height={12} patternUnits="userSpaceOnUse" patternTransform="rotate(-22)">
          <line x1={0} y1={0} x2={0} y2={12} stroke="#C9B994" strokeWidth={2.5} />
        </pattern>
      </defs>
      {/* skin silhouette */}
      <path d={ARM} fill="url(#skin42)" stroke={C.forest} strokeWidth={5} strokeLinejoin="round" opacity={1 - 0.3 * dimP} />
      {/* humerus (deep, faint) with epicondyles */}
      <path d={HUMERUS} fill="url(#bone42)" stroke={C.forest} strokeWidth={3.5} opacity={0.55 * (1 - 0.4 * dimP)} />
      {/* floor: brachialis */}
      <g>
        <path d={FLOOR} fill="url(#floor42)" stroke={C.forest} strokeWidth={3} opacity={0.9} />
        <clipPath id="cfl42">
          <path d={FLOOR} />
        </clipPath>
        <rect x={300} y={120} width={300} height={460} fill="url(#fib42)" clipPath="url(#cfl42)" opacity={0.35} />
        {dimP > 0 && <path d={FLOOR} fill="#F7F6EC" opacity={0.5 * dimP * (1 - on("floor"))} />}
        {glow("floor") > 0 && <path d={FLOOR} fill="none" stroke={C.banana} strokeWidth={16} opacity={0.8 * glow("floor")} />}
      </g>
      {/* forearm flexor mass (medial, below pronator teres) and extensor mass (lateral, behind brachioradialis) */}
      <path d="M 652 300 C 668 400 646 560 604 720 L 452 720 C 486 600 560 450 652 300 Z" fill="url(#musC42)" stroke={C.forest} strokeWidth={4} opacity={0.55 * (1 - 0.45 * dimP)} />
      <path d="M 200 300 C 196 420 214 560 240 720 L 300 720 C 280 600 262 460 250 300 Z" fill="url(#musA42)" stroke={C.forest} strokeWidth={4} opacity={0.5 * (1 - 0.45 * dimP)} />
      {/* deep vessels / nerves that pass under pronator teres */}
      <Tube d={UA} width={15} id="ba" p={drawn("ba")} color="#B9443A" hi={C.redLight} litColor="#E0503F" />
      <Tube d={MN} width={16} id="mn" p={drawn("mn")} color="#E9C743" hi="#FFF3B8" litColor={C.banana} />
      {/* pronator teres (medial border) */}
      <Muscle d={PT} id="pt" fid="musB42" angle={36} />
      {/* biceps belly + tendon */}
      <Muscle d={BICEPS} id="bt" fid="musC42" angle={0} />
      <Tube d={TENDON} width={24} id="bt" p={drawn("bt") > 0 ? 1 : 1} color="#F3EEDC" hi="#FFFFFF" litColor="#FFF8D6" />
      {/* brachial artery + radial artery */}
      <Tube d={BA} width={20} id="ba" p={drawn("ba")} color="#C9483C" hi={C.redLight} litColor="#E0503F" />
      <Tube d={RA} width={15} id="ba" p={drawn("ba")} color="#C9483C" hi={C.redLight} litColor="#E0503F" />
      {/* radial nerve, emerging at the medial edge of brachioradialis (drawn under it) */}
      <Tube d={RN} width={15} id="rn" p={drawn("rn")} color="#E9C743" hi="#FFF3B8" litColor={C.banana} />
      <Tube d={RN_DEEP} width={9} id="rn" p={drawn("rn")} color="#E9C743" hi="#FFF3B8" litColor={C.banana} />
      {/* brachioradialis (lateral border) */}
      <Muscle d={BR} id="br" fid="musA42" angle={-8} />
      {/* epicondyle bumps */}
      {[
        [250, 264, lepP],
        [646, 262, mepP],
      ].map(([x, y, p], i) => (
        <g key={i}>
          {p > 0 && <circle cx={x} cy={y} r={30} fill="none" stroke={C.banana} strokeWidth={10} opacity={0.9 * p} />}
        </g>
      ))}
      {/* triangle outline */}
      {triP > 0 && (
        <g opacity={triP}>
          <path d={TRI} fill={C.banana} opacity={0.18} />
          <path d={TRI} fill="none" stroke={C.forest} strokeWidth={9} pathLength={1} strokeLinejoin="round" strokeDasharray={`${triP} 2`} />
          <path d={TRI} fill="none" stroke={C.banana} strokeWidth={3} strokeLinejoin="round" pathLength={1} strokeDasharray={`${triP} 2`} />
        </g>
      )}
      {/* epicondyle line (superior border) */}
      {lineP > 0 && (
        <g opacity={Math.min(1, lineP * 2)}>
          <line x1={250} y1={262} x2={250 + 396 * lineP} y2={262} stroke={C.forest} strokeWidth={5} strokeDasharray="14 10" strokeLinecap="round" />
          <circle cx={250} cy={262} r={10} fill={C.banana} stroke={C.forest} strokeWidth={4} />
          {lineP > 0.95 && <circle cx={646} cy={262} r={10} fill={C.banana} stroke={C.forest} strokeWidth={4} />}
        </g>
      )}
      {/* roof: superficial fascia + bicipital aponeurosis + superficial veins */}
      {roofP > 0 && (
        <g opacity={roofP}>
          <path d={TRI} fill="#F6E9D6" opacity={0.55} transform="translate(0 0)" />
          <path d={APONEUROSIS} fill="url(#apo42)" stroke="#B9A57A" strokeWidth={3} opacity={0.9} />
          <path d={APONEUROSIS} fill="#F3EEDC" opacity={0.45} />
        </g>
      )}
      {mcvP > 0 && (
        <g opacity={op("mcv")}>
          {[CEPH, BAS].map((d, i) => (
            <g key={i}>
              <path d={d} fill="none" stroke={C.forest} strokeWidth={19} strokeLinecap="round" pathLength={1} strokeDasharray={`${mcvP} 2`} opacity={0.85} />
              <path d={d} fill="none" stroke="#4F78AE" strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray={`${mcvP} 2`} />
            </g>
          ))}
          {glow("mcv") > 0 && <path d={MCV} fill="none" stroke={C.banana} strokeWidth={40 + 6 * glow("mcv")} strokeLinecap="round" opacity={0.85 * glow("mcv")} />}
          <path d={MCV} fill="none" stroke={C.forest} strokeWidth={23} strokeLinecap="round" pathLength={1} strokeDasharray={`${ramp(mcvP, 0.3, 1)} 2`} />
          <path d={MCV} fill="none" stroke={on("mcv") > 0 ? mix("#4F78AE", "#5E95D6", on("mcv")) : "#4F78AE"} strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray={`${ramp(mcvP, 0.3, 1)} 2`} />
          <path d={MCV} fill="none" stroke="#A9C6EC" strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray={`${ramp(mcvP, 0.3, 1)} 2`} transform="translate(-1.5 -2)" opacity={0.85} />
          {[
            ["Cephalic", 214, 560, -1],
            ["Basilic", 650, 560, 1],
          ].map(([txt, x, y, dir]) => {
            const p = ramp(mcvP, 0.6, 1);
            const ww = (txt as string).length * 15 + 30;
            const x0 = (dir as number) > 0 ? (x as number) + 24 : (x as number) - 24 - ww;
            return (
              <g key={txt as string} opacity={p}>
                <rect x={x0} y={(y as number) - 22} width={ww} height={44} rx={13} fill="#2F4F7A" />
                <text x={x0 + ww / 2} y={(y as number) + 9} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={25} fill={C.paper}>{txt}</text>
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
};


/** Labels + side tags drawn OUTSIDE the zoom layer, so they stay inside the frame. map = diagram coords -> screen coords */
export const ElbowLabels: React.FC<{
  t: number;
  map: (x: number, y: number) => [number, number];
  lit?: Partial<Record<EPart, number>>;
  focus?: EPart[];
  labels?: Partial<Record<EPart, number>>;
  labelEnd?: Partial<Record<EPart, number>>;
  h?: number;
}> = ({ t, map, lit = {}, focus = [], labels = {}, labelEnd = {}, h = 680 }) => {
  const on = (id: EPart) => (lit[id] === undefined ? 0 : ramp(t, (lit[id] as number) - 0.05, (lit[id] as number) + 0.3));
  return (
    <svg width={860} height={h} viewBox={`0 0 860 ${h}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {[
        ["LATERAL", "(thumb side)", 24, "start"],
        ["MEDIAL", "(pinky side)", 836, "end"],
      ].map(([a, b, x, anc]) => (
        <g key={a as string}>
          <text x={x as number} y={44} textAnchor={anc as "start" | "end"} fontFamily={FONT} fontWeight={800} fontSize={24} letterSpacing={3} fill={C.matcha}>{a}</text>
          <text x={x as number} y={70} textAnchor={anc as "start" | "end"} fontFamily={FONT} fontWeight={700} fontSize={19} fill={C.matcha} opacity={0.85}>{b}</text>
        </g>
      ))}
      {(Object.keys(labels) as EPart[]).map((id) => {
        const lb = LAB[id];
        const lt = labels[id];
        if (!lb || lt === undefined || t < lt - 0.05) return null;
        const le = labelEnd[id];
        const p = ramp(t, lt - 0.05, lt + 0.28) * (le === undefined ? 1 : 1 - ramp(t, le, le + 0.25));
        if (p <= 0) return null;
        const hot = on(id) > 0.5 && focus.includes(id);
        const ww = lb.text.length * 16.5 + 36;
        const [ax, ay] = map(lb.ax, lb.ay);
        let px = ax + (lb.px - lb.ax);
        let py = ay + (lb.py - lb.ay);
        px = Math.max(ww / 2 + 14, Math.min(860 - ww / 2 - 14, px));
        py = Math.max(110, Math.min(h - 50, py));
        const lx = ax + (px - ax) * p;
        const ly = ay + (py - ay) * p;
        return (
          <g key={id} opacity={Math.min(1, p * 1.5)}>
            <line x1={ax} y1={ay} x2={lx} y2={ly} stroke={C.forest} strokeWidth={4.5} strokeLinecap="round" />
            <circle cx={ax} cy={ay} r={10} fill={hot ? C.red : C.banana} stroke={C.forest} strokeWidth={4} />
            <g transform={`translate(${px} ${py}) scale(${0.7 + 0.3 * p})`}>
              <rect x={-ww / 2} y={-26} width={ww} height={52} rx={16} fill={hot ? C.banana : C.forest} stroke={C.forest} strokeWidth={3} />
              <text x={0} y={10} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={hot ? C.forest : C.paper}>{lb.text}</text>
            </g>
          </g>
        );
      })}
    </svg>
  );
};
