import React from "react";
import { C, FONT, ramp } from "./kit";

/* Book Plume diagram: RIGHT shoulder + axilla seen from the FRONT (arm on the screen left, like Gray's Fig. 809).
   Posterior cord of the brachial plexus (behind the axillary artery) and its 5 branches — STAR:
     S  upper subscapular (US) → upper subscapularis; lower subscapular (LS) → lower subscapularis + teres major
     T  thoracodorsal (TD) → latissimus dorsi
     A  axillary (AX) → winds around the surgical neck of the humerus → deltoid + teres minor
     R  radial (RA) → biggest; spirals behind the humerus → triceps / back of the arm (and forearm)
   Facts: TeachMeAnatomy "Brachial plexus"/"Axillary nerve"; Gray 1918 pp. 932–934, Figs. 809–810; Elsevier posterior cord page.
   viewBox 900 x 1000 */

export type N = "US" | "LS" | "TD" | "AX" | "RA";
export type M = "SS" | "TM" | "LD" | "DE" | "TMi" | "TR";
export type L4 = "S" | "T" | "A" | "R";
export const LETTERS: L4[] = ["S", "T", "A", "R"];
export const LCOL: Record<L4, string> = { S: "#D9708C", T: "#4F9CC4", A: "#E0A53A", R: "#7FAE4E" };
export const NL: Record<N, L4> = { US: "S", LS: "S", TD: "T", AX: "A", RA: "R" };
export const NORDER: N[] = ["US", "LS", "TD", "AX", "RA"];

const NERVE = "#F4E6BE", NERVE_EDGE = "#A88B45";
const MUS = "#E7C3B5", MUS_EDGE = "#B27F6E", MUS_FIB = "#C99A8A";

const mix = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return "#" + pa.map((v, i) => Math.round(v + (pb[i] - v) * Math.max(0, Math.min(1, k))).toString(16).padStart(2, "0")).join("");
};

/* anchors for callouts (viewBox units) */
export const ANCHOR = {
  US: [668, 352] as [number, number],
  LS: [596, 470] as [number, number],
  TD: [704, 640] as [number, number],
  AX: [352, 392] as [number, number],
  RA: [330, 600] as [number, number],
  SS: [600, 300] as [number, number],
  TM: [470, 610] as [number, number],
  LD: [640, 860] as [number, number],
  DE: [150, 330] as [number, number],
  TMi: [372, 400] as [number, number],
  TR: [170, 740] as [number, number],
  NECK: [262, 338] as [number, number],
  CORD: [560, 330] as [number, number],
  ART: [700, 238] as [number, number],
};

/* muscles: [fill path, fibre lines] */
const MUSCLE: Record<M, { d: string; fib: string[]; behind?: boolean; l: L4 }> = {
  /* subscapularis on the front (costal) face of the scapula */
  SS: {
    d: "M 340 262 C 420 214 560 186 740 170 C 735 300 690 520 620 770 C 560 640 470 470 352 330 Z",
    fib: ["M 380 280 C 500 240 620 200 726 196", "M 386 312 C 500 290 620 270 716 262", "M 400 352 C 500 350 610 352 702 340", "M 430 400 C 520 420 610 450 684 432", "M 466 452 C 540 490 610 530 664 530", "M 510 520 C 560 560 610 610 642 630"],
    l: "S",
  },
  /* teres major: inferior angle of the scapula → medial lip of the intertubercular groove */
  TM: {
    d: "M 640 700 C 590 690 470 600 300 486 L 290 534 C 450 640 560 742 620 772 Z",
    fib: ["M 620 712 C 540 676 430 600 298 500", "M 616 742 C 530 700 420 624 294 520"],
    l: "S",
  },
  /* latissimus dorsi: broad sheet from the lower back → twists into the groove */
  LD: {
    d: "M 304 470 C 380 520 470 640 560 760 C 640 860 780 910 900 930 L 900 1000 L 470 1000 C 440 860 380 640 300 520 Z",
    fib: ["M 312 486 C 420 600 560 820 900 950", "M 308 500 C 400 640 500 860 700 1000", "M 304 512 C 380 680 440 860 560 1000"],
    l: "T",
  },
  /* deltoid: cap over the shoulder, acromion → deltoid tuberosity */
  DE: {
    d: "M 392 176 C 330 120 220 118 160 178 C 110 230 112 330 150 430 C 176 500 200 550 214 584 C 232 520 250 440 262 380 C 276 300 330 230 392 206 Z",
    fib: ["M 360 172 C 280 176 230 260 214 560", "M 300 150 C 220 190 186 300 210 560", "M 230 150 C 160 220 160 360 212 566"],
    l: "A",
  },
  /* teres minor (posterior: drawn dashed, seen through) */
  TMi: { d: "M 430 446 C 390 404 340 334 306 292 L 290 322 C 330 364 380 434 414 474 Z", fib: [], behind: true, l: "A" },
  /* triceps (back of the arm: drawn dashed, seen through) */
  TR: {
    d: "M 300 400 C 330 520 300 720 266 900 L 226 960 L 150 950 C 150 800 170 600 210 470 Z",
    fib: ["M 280 440 C 290 600 260 800 220 940", "M 230 480 C 200 640 180 820 180 940"],
    behind: true,
    l: "R",
  },
};

/* nerve centre-lines (behind = dashed segments that pass behind bone) */
const NV: Record<N, { d: string; back?: string }> = {
  US: { d: "M 760 288 C 740 310 706 330 668 352 C 646 364 628 380 616 400" },
  LS: { d: "M 690 312 C 660 360 620 420 596 470 C 572 520 560 590 560 650 C 556 680 548 700 540 712" },
  TD: { d: "M 640 322 C 670 420 696 520 704 640 C 712 740 712 830 700 930" },
  AX: { d: "M 470 362 C 430 372 392 384 352 392 C 320 396 300 384 288 372", back: "M 288 372 C 268 356 240 340 214 330 C 196 324 180 316 170 300" },
  RA: { d: "M 470 362 C 420 400 370 470 340 540 C 326 572 314 610 300 650", back: "M 300 650 C 280 700 240 740 210 770 C 190 800 186 860 196 940" },
};
/* the cord itself: from the plexus (upper right) to its split behind the artery */
const CORD = "M 900 236 C 820 262 760 286 700 306 C 620 330 540 346 470 362";
/* little terminal twigs in the deltoid / teres minor */
const AX_TWIGS = ["M 170 300 C 160 270 168 240 190 214", "M 176 306 C 150 330 140 380 150 420", "M 214 330 C 230 300 262 282 300 270"];
/* humerus */
const HUM = "M 260 160 C 300 150 330 180 330 224 C 330 262 312 290 298 316 C 290 340 292 380 292 420 L 286 700 C 284 820 282 900 286 1000 L 222 1000 C 226 900 230 820 232 700 L 236 420 C 236 380 232 346 220 320 C 196 290 186 250 196 210 C 206 176 230 162 260 160 Z";
/* scapula outline (front) */
const SCAP = "M 330 236 C 336 214 356 198 384 196 L 600 176 L 744 160 C 760 190 740 330 700 470 C 676 560 650 680 624 790 C 610 760 560 680 470 560 C 420 490 370 400 340 330 C 330 300 326 260 330 236 Z";
/* clavicle + ribs hint */
const CLAV = "M 360 150 C 460 120 600 132 900 120";
const RIBS = ["M 900 380 C 820 420 780 470 770 540", "M 900 500 C 830 540 800 600 796 680", "M 900 620 C 850 660 826 720 826 800"];
/* axillary artery (in FRONT of the posterior cord) → brachial */
const ART = "M 900 150 C 800 172 700 210 600 246 C 510 280 430 318 380 380 C 336 440 316 540 306 640";

export type Ask = { t0: number; reveal?: number };

export const Cord: React.FC<{
  t: number;
  w: number;
  id: string;
  lit?: Partial<Record<N, number>>;
  mus?: Partial<Record<M, number>>;
  hot?: N[];
  hotM?: M[];
  art?: number; // artery opacity 0..1
  neck?: number; // highlight the surgical neck 0..1
  ask?: Ask; // axillary drawn as "?" until reveal
  build?: number; // draw-on start time
  dimRest?: number; // dims nerves that are not lit/hot
  hideDe?: boolean;
}> = ({ t, w, id, hideDe, lit = {}, mus = {}, hot = [], hotM = [], art = 1, neck = 0, ask, build, dimRest = 0 }) => {
  const s = w / 900;
  const on = (n: N) => (lit[n] === undefined ? 0 : ramp(t, (lit[n] as number) - 0.05, (lit[n] as number) + 0.3));
  const mOn = (m: M) => (mus[m] === undefined ? 0 : ramp(t, (mus[m] as number) - 0.05, (mus[m] as number) + 0.35));
  const pulse = 0.65 + 0.35 * Math.sin(t * 7);
  const drawn = (k: number) => (build === undefined ? 1 : ramp(t, build + k * 0.18, build + k * 0.18 + 0.55));
  const asking = ask && t >= ask.t0 && (ask.reveal === undefined || t < ask.reveal);

  const muscle = (m: M) => {
    const k = mOn(m), mm = MUSCLE[m];
    const col = mix(MUS, LCOL[mm.l], k * 0.85);
    const isHot = hotM.includes(m) && k > 0;
    return (
      <g key={m}>
        {isHot && <path d={mm.d} fill="none" stroke={C.banana} strokeWidth={22} opacity={0.6 * pulse} filter={`url(#gl${id})`} />}
        <path d={mm.d} fill={col} opacity={mm.behind ? 0.55 + 0.35 * k : 0.94} stroke={mix(MUS_EDGE, "#3B2A22", k * 0.4)} strokeWidth={mm.behind ? 3 : 3.5} strokeDasharray={mm.behind ? "12 9" : undefined} />
        {mm.fib.map((f, i) => <path key={i} d={f} fill="none" stroke={mix(MUS_FIB, "#FFFFFF", 0.25 + 0.3 * k)} strokeWidth={2.5} opacity={0.55} strokeDasharray={mm.behind ? "8 10" : undefined} />)}
      </g>
    );
  };
  const nerve = (n: N, k0: number) => {
    const k = on(n), d = drawn(k0);
    if (d <= 0) return null;
    const isAsk = n === "AX" && asking;
    const isHot = hot.includes(n) && k > 0;
    const col = isAsk ? "#DAD7C3" : mix(NERVE, LCOL[NL[n]], k);
    const wdt = 17 + (isHot ? 6 : 0);
    const dim = 1 - dimRest * (k > 0 || isAsk ? 0 : 0.65);
    const segs: [string, boolean][] = [[NV[n].d, false]];
    if (NV[n].back) segs.push([NV[n].back as string, true]);
    return (
      <g key={n} opacity={dim}>
        {isHot && segs.map(([p], i) => <path key={"g" + i} d={p} fill="none" stroke={C.banana} strokeWidth={wdt + 30} strokeLinecap="round" opacity={0.55 * pulse} filter={`url(#gl${id})`} />)}
        {isAsk && segs.map(([p], i) => <path key={"q" + i} d={p} fill="none" stroke={C.banana} strokeWidth={wdt + 30} strokeLinecap="round" opacity={0.45 * pulse} filter={`url(#gl${id})`} />)}
        {segs.map(([p, back], i) => (
          <path key={"o" + i} d={p} pathLength={1} strokeDasharray={back ? undefined : `${d} 1`} fill="none" stroke={isAsk ? "#6F7C64" : mix(NERVE_EDGE, "#3B4A26", k * 0.5)} strokeWidth={wdt + 7} strokeLinecap="round" opacity={back ? 0.55 * d : 1} />
        ))}
        {segs.map(([p, back], i) => (
          <path key={"f" + i} d={p} pathLength={back || isAsk ? undefined : 1} strokeDasharray={isAsk ? "14 10" : back ? "18 12" : `${d} 1`} fill="none" stroke={col} strokeWidth={wdt} strokeLinecap={back ? "butt" : "round"} opacity={back ? 0.8 * d : 1} />
        ))}
        {!isAsk && <path d={NV[n].d} pathLength={1} strokeDasharray={`${d} 1`} fill="none" stroke="#FFFFFF" strokeWidth={3.5} strokeLinecap="round" opacity={0.55} transform="translate(0 -5)" />}
        {n === "AX" && !isAsk && k > 0 && AX_TWIGS.map((p, i) => <path key={"tw" + i} d={p} fill="none" stroke={col} strokeWidth={8} strokeLinecap="round" opacity={0.9 * ramp(t, (lit.AX as number) + 0.2, (lit.AX as number) + 0.6)} />)}
      </g>
    );
  };
  const cordD = drawn(0);
  const cordLit = Math.max(...NORDER.map(on));
  return (
    <svg width={w} height={1000 * s} viewBox="0 0 900 1000" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <filter id={`gl${id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={9} />
        </filter>
        <linearGradient id={`bone${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#E9E1C8" />
          <stop offset="0.5" stopColor="#FBF7EA" />
          <stop offset="1" stopColor="#DCD2B4" />
        </linearGradient>
        <linearGradient id={`art${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E58A7C" />
          <stop offset="1" stopColor="#B24A3E" />
        </linearGradient>
      </defs>
      {/* chest wall hint */}
      {RIBS.map((r, i) => <path key={i} d={r} fill="none" stroke="#D8CDB6" strokeWidth={22} strokeLinecap="round" opacity={0.6} />)}
      <path d={CLAV} fill="none" stroke="#CFC3A4" strokeWidth={34} strokeLinecap="round" />
      <path d={CLAV} fill="none" stroke="#F3EDDA" strokeWidth={24} strokeLinecap="round" />
      {/* behind layer: triceps (dashed) */}
      {muscle("TR")}
      {/* scapula + subscapularis */}
      <path d={SCAP} fill={`url(#bone${id})`} stroke="#B8AB86" strokeWidth={4} />
      {muscle("SS")}
      {muscle("LD")}
      {muscle("TM")}
      {muscle("TMi")}
      {/* humerus */}
      <path d={HUM} fill={`url(#bone${id})`} stroke="#A99B74" strokeWidth={4} />
      <path d="M 300 236 C 296 214 284 196 266 186" fill="none" stroke="#C9BC96" strokeWidth={4} opacity={0.8} />
      {neck > 0 && (
        <g opacity={neck}>
          <path d="M 218 328 C 240 342 280 344 300 330" fill="none" stroke={C.red} strokeWidth={9} strokeLinecap="round" strokeDasharray="14 9" />
        </g>
      )}
      {/* cord (behind the artery) + branches */}
      <path d={CORD} pathLength={1} strokeDasharray={`${cordD} 1`} fill="none" stroke={mix(NERVE_EDGE, "#3B4A26", 0.3 * cordLit)} strokeWidth={30} strokeLinecap="round" />
      <path d={CORD} pathLength={1} strokeDasharray={`${cordD} 1`} fill="none" stroke={mix(NERVE, "#C9B57C", 0.35)} strokeWidth={23} strokeLinecap="round" />
      <path d={CORD} pathLength={1} strokeDasharray={`${cordD} 1`} fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.55} transform="translate(0 -6)" />
      {nerve("TD", 1)}
      {nerve("LS", 1.4)}
      {nerve("US", 1.8)}
      {nerve("RA", 2.2)}
      {nerve("AX", 2.6)}
      {/* deltoid drawn over the axillary nerve's end, translucent */}
      {!hideDe && <g opacity={0.82}>{muscle("DE")}</g>}
      {/* artery in FRONT of the posterior cord */}
      {art > 0 && (
        <g opacity={art * 0.9}>
          <path d={ART} fill="none" stroke="#7E2F27" strokeWidth={24} strokeLinecap="round" opacity={0.85} />
          <path d={ART} fill="none" stroke={`url(#art${id})`} strokeWidth={18} strokeLinecap="round" opacity={0.9} />
          <path d={ART} fill="none" stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.4} transform="translate(0 -6)" />
        </g>
      )}
      {asking && (
        <g transform={`translate(200 250) scale(${1 + 0.07 * Math.sin(t * 6)})`}>
          <circle r={40} fill={C.forest} stroke={C.banana} strokeWidth={6} />
          <text y={17} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={50} fill={C.banana}>?</text>
        </g>
      )}
    </svg>
  );
};
