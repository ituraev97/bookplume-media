import React from "react";
import { C, FONT, ramp } from "./kit";

/**
 * Book Plume schematic of the RIGHT brachial plexus, roots (spinal cord side, left) -> branches (arm side, right). viewBox 860 x 600.
 * Facts (TeachMeAnatomy "The Brachial Plexus"; OpenAnesthesia "Brachial plexus anatomy"; Gray 1918 Fig. 807 + text p. 930-931):
 *   roots = anterior rami C5, C6, C7, C8, T1
 *   trunks: upper (C5+C6), middle (C7 alone), lower (C8+T1)
 *   divisions: each trunk -> anterior + posterior (6)
 *   cords (named by position around the 2nd part of the axillary artery):
 *     lateral = anterior divisions of upper + middle; medial = anterior division of lower; posterior = all 3 posterior divisions
 *   terminal branches: lateral -> musculocutaneous + lateral root of median; medial -> medial root of median + ulnar;
 *     posterior -> axillary + radial.
 */
export type Part = "roots" | "trunks" | "divs" | "cords" | "branches";
export const PARTS: { id: Part; letter: string; word: string; mn: string; n: number; color: string }[] = [
  { id: "roots", letter: "R", word: "Roots", mn: "Randy", n: 5, color: "#E8B547" },
  { id: "trunks", letter: "T", word: "Trunks", mn: "Travis", n: 3, color: "#7FC3E0" },
  { id: "divs", letter: "D", word: "Divisions", mn: "Drinks", n: 6, color: "#B49BE0" },
  { id: "cords", letter: "C", word: "Cords", mn: "Cold", n: 3, color: "#E58BA3" },
  { id: "branches", letter: "B", word: "Branches", mn: "Beer", n: 5, color: "#9CC46A" },
];
export const PCOL: Record<Part, string> = Object.fromEntries(PARTS.map((p) => [p.id, p.color])) as Record<Part, string>;
const POSTDIV = "#7A5FB8";

type Item = { id: string; part: Part; d: string[]; back?: boolean; tag?: { text: string; x: number; y: number; anchor?: "start" | "middle" | "end" } };
/* local coords: drawn inside <g transform="translate(GX GY) scale(GS)"> */
export const GX = 96, GY = 34, GS = 0.86;
export const ITEMS: Item[] = [
  { id: "C5", part: "roots", d: ["M 0 90 C 90 90 140 118 200 150"], tag: { text: "C5", x: -38, y: 90 } },
  { id: "C6", part: "roots", d: ["M 0 190 C 90 190 140 172 200 150"], tag: { text: "C6", x: -38, y: 190 } },
  { id: "C7", part: "roots", d: ["M 0 280 L 200 280"], tag: { text: "C7", x: -38, y: 280 } },
  { id: "C8", part: "roots", d: ["M 0 370 C 90 370 140 388 200 410"], tag: { text: "C8", x: -38, y: 370 } },
  { id: "T1", part: "roots", d: ["M 0 470 C 90 470 140 432 200 410"], tag: { text: "T1", x: -38, y: 470 } },
  { id: "upper", part: "trunks", d: ["M 200 150 L 320 150"], tag: { text: "Upper", x: 258, y: 112 } },
  { id: "middle", part: "trunks", d: ["M 200 280 L 320 280"], tag: { text: "Middle", x: 258, y: 242 } },
  { id: "lower", part: "trunks", d: ["M 200 410 L 320 410"], tag: { text: "Lower", x: 258, y: 372 } },
  /* posterior divisions first (they pass BEHIND) */
  { id: "uP", part: "divs", back: true, d: ["M 320 150 C 392 160 408 300 470 300"] },
  { id: "mP", part: "divs", back: true, d: ["M 320 280 C 380 285 420 300 470 300"] },
  { id: "lP", part: "divs", back: true, d: ["M 320 410 C 392 400 408 305 470 300"] },
  { id: "uA", part: "divs", d: ["M 320 150 C 380 150 420 170 470 170"] },
  { id: "mA", part: "divs", d: ["M 320 280 C 392 270 408 175 470 170"] },
  { id: "lA", part: "divs", d: ["M 320 410 C 380 410 420 430 470 430"] },
  /* posterior cord + its branches (behind the artery) */
  { id: "post", part: "cords", d: ["M 470 300 L 610 300"], tag: { text: "Posterior", x: 540, y: 262 } },
  { id: "ax", part: "branches", d: ["M 610 300 C 690 300 760 212 850 204"], tag: { text: "Axillary", x: 850, y: 172, anchor: "end" } },
  { id: "rad", part: "branches", d: ["M 610 300 C 700 302 770 292 850 292"], tag: { text: "Radial", x: 850, y: 328, anchor: "end" } },
  { id: "lat", part: "cords", d: ["M 470 170 L 610 170"], tag: { text: "Lateral", x: 540, y: 132 } },
  { id: "med", part: "cords", d: ["M 470 430 L 610 430"], tag: { text: "Medial", x: 540, y: 468 } },
  { id: "mc", part: "branches", d: ["M 610 170 C 690 170 760 82 850 72"], tag: { text: "Musculocutaneous", x: 850, y: 36, anchor: "end" } },
  { id: "mdn", part: "branches", d: ["M 610 170 C 680 172 700 382 752 392", "M 610 430 C 680 430 706 398 752 392", "M 752 392 L 850 392"], tag: { text: "Median", x: 850, y: 428, anchor: "end" } },
  { id: "uln", part: "branches", d: ["M 610 430 C 700 432 770 520 850 522"], tag: { text: "Ulnar", x: 850, y: 558, anchor: "end" } },
];
/* draw-on order for the build (seconds after `build`) */
const BUILD: Record<Part, number> = { roots: 0, trunks: 0.45, divs: 0.8, cords: 1.15, branches: 1.5 };
/* column headers (local coords) */
const HEAD: { part: Part; x: number; text: string }[] = [
  { part: "roots", x: 100, text: "ROOTS" },
  { part: "trunks", x: 255, text: "TRUNKS" },
  { part: "divs", x: 402, text: "DIVISIONS" },
  { part: "cords", x: 540, text: "CORDS" },
  { part: "branches", x: 730, text: "BRANCHES" },
];

const mix = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return "#" + pa.map((v, i) => Math.round(v + (pb[i] - v) * Math.max(0, Math.min(1, k))).toString(16).padStart(2, "0")).join("");
};
const NERVE = "#F4E6BE", NERVE_EDGE = "#A88B45";

/** pill label in local coords; counter-scales nothing (zoom just makes it bigger) */
const Tag: React.FC<{ x: number; y: number; text: string; p: number; hot?: boolean; anchor?: "start" | "middle" | "end"; color?: string; size?: number }> = ({ x, y, text, p, hot, anchor = "middle", color, size = 30 }) => {
  if (p <= 0) return null;
  const w = text.length * size * 0.6 + 34;
  const x0 = anchor === "middle" ? -w / 2 : anchor === "end" ? -w : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${0.75 + 0.25 * p})`} opacity={Math.min(1, p * 1.4)}>
      <rect x={x0} y={-size * 0.78} width={w} height={size * 1.56} rx={size * 0.5} fill={hot ? C.banana : C.forest} />
      {color && <circle cx={x0 + 4} cy={-size * 0.62} r={9} fill={color} stroke={hot ? C.forest : C.paper} strokeWidth={3} />}
      <text x={x0 + w / 2} y={size * 0.35} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={size} fill={hot ? C.forest : C.paper}>{text}</text>
    </g>
  );
};

export const Plexus: React.FC<{
  t: number;
  build?: number; // draw-on start
  lit?: Partial<Record<Part, number>>; // whole part lights up at time
  litItem?: Record<string, number>; // single items light up at time (overrides part)
  focus?: Part[];
  focusItems?: string[];
  dimFrom?: number;
  tags?: Record<string, number>; // item tags shown from time
  tagEnd?: Record<string, number>;
  heads?: Partial<Record<Part, number>>;
  fb?: number; // front/back colouring of divisions
  artery?: number;
  ask?: string; // item id shown as "?" (quick test)
  reveal?: number;
}> = ({ t, build, lit = {}, litItem = {}, focus = [], focusItems = [], dimFrom, tags = {}, tagEnd = {}, heads = {}, fb, artery, ask, reveal }) => {
  const dimP = dimFrom === undefined ? 0 : ramp(t, dimFrom, dimFrom + 0.4);
  const litT = (it: Item) => (litItem[it.id] !== undefined ? litItem[it.id] : lit[it.part]);
  const on = (it: Item) => {
    const v = litT(it);
    return v === undefined ? 0 : ramp(t, v - 0.05, v + 0.3);
  };
  const isFocus = (it: Item) => focusItems.includes(it.id) || focus.includes(it.part) || (focus.length === 0 && focusItems.length === 0);
  const op = (it: Item) => 1 - 0.62 * dimP * (isFocus(it) ? 1 - on(it) : 1);
  const drawn = (it: Item) => (build === undefined ? 1 : ramp(t, build + BUILD[it.part], build + BUILD[it.part] + 0.6));
  const fbP = fb === undefined ? 0 : ramp(t, fb, fb + 0.4);
  const artP = artery === undefined ? 0 : ramp(t, artery, artery + 0.5);
  const asking = (id: string) => ask === id && (reveal === undefined || t < reveal);
  const pulse = 0.7 + 0.3 * Math.sin(t * 7);

  const colorOf = (it: Item) => {
    let c = mix(NERVE, PCOL[it.part], on(it));
    if (it.part === "divs" && it.back) c = mix(c, POSTDIV, fbP * on(it));
    return c;
  };
  const nerve = (it: Item) => {
    const k = on(it), d = drawn(it);
    if (d <= 0) return null;
    const isAsk = asking(it.id);
    const w = 20 + 5 * k * (isFocus(it) ? 1 : 0);
    return (
      <g key={it.id} opacity={op(it)}>
        {isFocus(it) && k > 0 && dimFrom !== undefined && it.d.map((p, i) => <path key={"g" + i} d={p} fill="none" stroke={C.banana} strokeWidth={w + 26} strokeLinecap="round" opacity={0.55 * k * pulse} filter="url(#glBP)" />)}
        {it.d.map((p, i) => <path key={"o" + i} d={p} pathLength={1} strokeDasharray={`${d} 1`} fill="none" stroke={isAsk ? "#7D8A72" : mix(NERVE_EDGE, "#3B4A26", k * 0.5)} strokeWidth={w + 7} strokeLinecap="round" />)}
        {it.d.map((p, i) => <path key={"f" + i} d={p} pathLength={1} strokeDasharray={isAsk ? "0.04 0.03" : `${d} 1`} fill="none" stroke={isAsk ? "#DAD7C3" : colorOf(it)} strokeWidth={w} strokeLinecap="round" />)}
        {/* fascicle highlight: thin light line along the top of the tube */}
        {!isAsk && it.d.map((p, i) => <path key={"h" + i} d={p} pathLength={1} strokeDasharray={`${d} 1`} fill="none" stroke="#FFFFFF" strokeWidth={3.5} strokeLinecap="round" opacity={0.55} transform="translate(0 -5)" />)}
        {!isAsk && it.d.map((p, i) => <path key={"s" + i} d={p} pathLength={1} strokeDasharray={`${d} 1`} fill="none" stroke={NERVE_EDGE} strokeWidth={1.6} strokeLinecap="round" opacity={0.35} transform="translate(0 4)" />)}
      </g>
    );
  };
  const back = ITEMS.filter((i) => ["uP", "mP", "lP", "post", "ax", "rad"].includes(i.id));
  const front = ITEMS.filter((i) => !back.includes(i));
  const spineP = build === undefined ? 1 : ramp(t, build - 0.2, build + 0.3);
  return (
    <svg width={860} height={600} viewBox="0 0 860 600" style={{ display: "block", overflow: "hidden" }}>
      <defs>
        <filter id="glBP" x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur stdDeviation={8} />
        </filter>
        <linearGradient id="cordBP" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#EBD3C8" />
          <stop offset="0.5" stopColor="#F6E6DD" />
          <stop offset="1" stopColor="#E3C3B6" />
        </linearGradient>
        <linearGradient id="artBP" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E58A7C" />
          <stop offset="0.45" stopColor="#D2604F" />
          <stop offset="1" stopColor="#A9443A" />
        </linearGradient>
      </defs>
      <g transform={`translate(${GX} ${GY}) scale(${GS})`}>
        {/* column headers */}
        {HEAD.map((h) => {
          const p = heads[h.part] === undefined ? 0 : ramp(t, heads[h.part] as number, (heads[h.part] as number) + 0.3);
          if (p <= 0) return null;
          const hot = lit[h.part] !== undefined && t >= (lit[h.part] as number) - 0.1;
          return (
            <g key={h.part} opacity={p}>
              <text x={h.x} y={-6} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={22} letterSpacing={1} fill={hot ? mix(PCOL[h.part], "#000000", 0.35) : "#9AA48A"}>{h.text}</text>
            </g>
          );
        })}
        {/* spinal cord column with vertebral levels */}
        <g opacity={spineP}>
          <rect x={-70} y={40} width={64} height={480} rx={30} fill="url(#cordBP)" stroke="#C9A08F" strokeWidth={3} />
          {[90, 190, 280, 370, 470].map((y) => <line key={y} x1={-6} y1={y} x2={6} y2={y} stroke={NERVE_EDGE} strokeWidth={14} strokeLinecap="round" />)}
          <text x={-38} y={556} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={22} fill="#9C7A6C">spinal</text>
          <text x={-38} y={580} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={22} fill="#9C7A6C">cord</text>
        </g>
        {back.map(nerve)}
        {/* axillary artery: the cords are named for where they sit around it (posterior cord = behind it) */}
        {artP > 0 && (
          <g opacity={artP}>
            <rect x={440} y={287} width={(800 - 440) * artP} height={26} rx={13} fill="url(#artBP)" stroke="#7E2F27" strokeWidth={3} opacity={0.82} />
            <path d={`M 452 294 L ${440 + (800 - 440) * artP - 14} 292`} stroke="#FFFFFF" strokeWidth={3} opacity={0.45} strokeLinecap="round" />
          </g>
        )}
        {front.map(nerve)}
        {/* "?" on the asked item */}
        {ask && asking(ask) && (() => {
          const it = ITEMS.find((i) => i.id === ask)!;
          const tx = it.tag ? (it.tag.anchor === "end" ? it.tag.x - 120 : it.tag.x) : 700;
          const ty = it.tag ? it.tag.y + 36 : 300;
          return (
            <g transform={`translate(${tx} ${ty}) scale(${1 + 0.06 * Math.sin(t * 6)})`}>
              <circle r={30} fill={C.forest} />
              <text y={13} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={38} fill={C.banana}>?</text>
            </g>
          );
        })()}
        {/* tags */}
        {ITEMS.filter((it) => it.tag && tags[it.id] !== undefined).map((it) => {
          const t0 = tags[it.id];
          const e = tagEnd[it.id];
          const p = ramp(t, t0 - 0.05, t0 + 0.25) * (e === undefined ? 1 : 1 - ramp(t, e, e + 0.25));
          const tg = it.tag!;
          const hot = (focusItems.includes(it.id) || (focus.includes(it.part) && litItem[it.id] !== undefined)) && t >= t0;
          return <Tag key={it.id} x={tg.x} y={tg.y} text={tg.text} p={p} anchor={tg.anchor} hot={hot} size={it.part === "roots" ? 24 : 30} />;
        })}
        {artP > 0 && tags["artery"] !== undefined && (
          <Tag x={560} y={346} text="Axillary artery" p={ramp(t, tags["artery"], tags["artery"] + 0.25) * (tagEnd["artery"] === undefined ? 1 : 1 - ramp(t, tagEnd["artery"], tagEnd["artery"] + 0.25))} hot size={26} />
        )}
      </g>
    </svg>
  );
};

/** local diagram coords -> stage (860x600) coords */
export const toStage = (x: number, y: number): [number, number] => [GX + x * GS, GY + y * GS];
