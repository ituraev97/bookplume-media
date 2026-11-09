import React from "react";
import { C, FONT, ramp } from "./kit";

/* ---------- colours: one per named artery (used in diagrams, chips, recap) ---------- */
export const AC: Record<string, string> = {
  sub: "#D9483B", // subclavian
  ax: "#E8833A", // axillary
  br: "#C93F78", // brachial
  rad: "#3F8FC4", // radial
  uln: "#8C62C9", // ulnar
  aorta: "#B8372C",
  bct: "#C9483C",
  cca: "#C9483C",
  // subclavian branches
  vert: "#F07A6B", intth: "#F59A8C", tcx: "#E86A5A", ccx: "#F2B1A5", dsc: "#E4877A",
  // axillary branches
  supth: "#F5B271", thac: "#F09A4E", latth: "#F7C38E", subsc: "#E8833A", thd: "#F5B271", ach: "#F7C38E", pch: "#F09A4E",
  // brachial branches
  prof: "#DD6E9C", suc: "#E99BBD", iuc: "#E99BBD",
  // radial / ulnar branches
  rrec: "#7FB7DD", pp: "#7FB7DD", ri: "#7FB7DD", spb: "#7FB7DD",
  urec: "#B69BE0", cio: "#B69BE0", ai: "#B69BE0", pi: "#B69BE0", dpb: "#B69BE0",
  sarch: "#8C62C9", darch: "#3F8FC4", digit: "#B69BE0", meta: "#7FB7DD",
};
export const NERVE = "#E9CF4A";
export type Lit = Record<string, number>;
const glow = (t: number, lit: Lit, k: string) => (lit[k] !== undefined ? ramp(t, lit[k] - 0.1, lit[k] + 0.35) : 0);
const anyLit = (lit: Lit, t: number) => Object.values(lit).some((v) => t >= v - 0.1);

/** one vessel: dark outline, coloured core, highlight; grows in (grow) and glows when lit */
export const Vessel: React.FC<{ d: string; k: string; t: number; lit: Lit; grow?: Lit; w?: number; dim: boolean; col?: string; dash?: boolean }> = ({ d, k, t, lit, grow = {}, w = 16, dim, col, dash }) => {
  const g = glow(t, lit, k);
  const p = grow[k] !== undefined ? ramp(t, grow[k], grow[k] + 1.1) : 1;
  if (p <= 0) return null;
  const c = col || AC[k] || C.red;
  const op = dim && g === 0 ? 0.28 : 1;
  const pulse = g > 0 ? 0.5 + 0.5 * Math.sin(t * 5) : 0;
  const da = dash ? { strokeDasharray: "0.02 0.012" } : { strokeDasharray: 1, strokeDashoffset: 1 - p };
  return (
    <g opacity={op}>
      {g > 0 && <path d={d} fill="none" stroke={C.banana} strokeWidth={w + 18 + 6 * pulse} strokeLinecap="round" strokeLinejoin="round" opacity={0.5 * g} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />}
      <path d={d} fill="none" stroke={C.forest} strokeWidth={w + 6 + 2 * g} strokeLinecap="round" strokeLinejoin="round" pathLength={1} {...da} />
      <path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" pathLength={1} {...da} />
      {!dash && <path d={d} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={Math.max(2, w * 0.22)} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} transform="translate(-1.5 -2)" />}
    </g>
  );
};
const Nv: React.FC<{ d: string; w?: number; op?: number }> = ({ d, w = 9, op = 1 }) => (
  <g opacity={op}>
    <path d={d} fill="none" stroke={C.forest} strokeWidth={w + 5} strokeLinecap="round" />
    <path d={d} fill="none" stroke={NERVE} strokeWidth={w} strokeLinecap="round" />
  </g>
);
const SKIN = "#F1E4CB", SKIN2 = "#E8D6B4", BONE = "#FBF6E6", MUSCLE = "#E9A79A", MUSCLE2 = "#D98C7E", TENDON = "#F4EFE0";

/* =====================================================================
   A. ARM MAP — right upper limb, front view (midline on the right), viewBox 900 x 1600
   ===================================================================== */
export const AM_PT: Record<string, [number, number]> = {
  bct: [770, 320], sub: [600, 222], ax: [395, 360], br: [300, 650], rad: [205, 1050], uln: [302, 1060],
  vert: [648, 90], intth: [662, 470], tcx: [586, 165], ccx: [522, 165], dsc: [360, 212],
  supth: [488, 382], thac: [362, 280], latth: [452, 590], subsc: [402, 560], thd: [436, 660], ach: [300, 408], pch: [288, 428],
  prof: [246, 700], suc: [330, 720], iuc: [304, 840],
  rrec: [215, 848], cio: [248, 985], ai: [230, 1130], pi: [258, 1130], urec: [318, 852],
  sarch: [225, 1352], darch: [215, 1308], pp: [92, 1405], ri: [163, 1430], digit: [262, 1500],
  rib: [445, 300], teres: [330, 442], elbow: [262, 880], scal: [562, 232], pecmin: [395, 360], wrist: [190, 1205], snuff: [140, 1275], clav: [560, 192], hum: [300, 600], aorta: [830, 420],
};
const AM_D: Record<string, string> = {
  aorta: "M790 660 C 776 540 782 410 832 356 C 862 326 902 330 940 362",
  bct: "M818 366 C 792 334 760 292 722 262",
  cca: "M722 262 C 728 190 732 110 736 0",
  sub: "M722 262 C 680 225 600 212 540 226 C 500 236 470 262 445 300",
  ax: "M445 300 C 412 338 372 384 330 440",
  br: "M330 440 C 312 560 290 700 262 880",
  rad: "M262 880 C 232 950 205 1080 188 1205 C 182 1240 160 1262 136 1290",
  uln: "M262 880 C 290 960 306 1080 306 1200 C 306 1240 302 1262 296 1288",
  vert: "M642 220 C 642 170 646 110 650 30",
  intth: "M652 226 C 656 300 660 420 666 580",
  tcx: "M590 216 C 588 195 587 178 586 158 M586 158 C 604 136 626 124 652 116 M586 164 C 548 160 506 164 468 176 M586 172 C 544 186 496 204 440 220",
  ccx: "M548 224 C 540 200 530 178 520 148",
  dsc: "M462 270 C 430 248 384 226 330 206",
  supth: "M434 314 C 456 334 480 360 500 398",
  thac: "M402 352 C 386 322 372 300 362 282 M362 282 C 342 270 320 268 296 276 M362 282 C 374 262 392 254 414 254 M362 282 C 352 260 350 246 352 228",
  latth: "M392 364 C 420 420 446 520 462 650",
  subsc: "M366 402 C 380 450 396 520 406 600",
  thd: "M402 560 C 420 600 432 640 442 690",
  ach: "M344 424 C 328 418 312 412 298 400",
  pch: "M350 432 C 330 448 300 444 280 420",
  prof: "M324 470 C 300 520 270 560 256 620 C 244 680 240 740 238 810",
  suc: "M318 560 C 334 650 338 760 322 850",
  iuc: "M282 770 C 300 800 310 830 306 862",
  rrec: "M248 908 C 226 892 216 870 214 842",
  urec: "M276 906 C 300 892 312 872 314 846",
  cio: "M272 930 C 262 952 252 972 246 992",
  ai: "M246 992 C 238 1060 232 1140 228 1200",
  pi: "M246 992 C 256 1060 260 1140 260 1200",
  spb: "M188 1210 C 176 1250 170 1296 168 1338",
  sarch: "M296 1288 C 286 1346 206 1362 168 1338",
  darch: "M136 1290 C 168 1312 240 1316 292 1300",
  pp: "M140 1294 C 118 1332 100 1372 90 1412",
  ri: "M150 1302 C 156 1360 160 1400 164 1450",
  digit: "M178 1350 C 172 1420 168 1480 166 1540 M218 1358 C 216 1430 216 1500 216 1562 M256 1354 C 260 1430 264 1500 266 1556 M286 1336 C 296 1400 306 1460 314 1520",
};
const ORDER = ["aorta", "bct", "cca", "vert", "intth", "tcx", "ccx", "dsc", "sub", "supth", "thac", "latth", "thd", "subsc", "ach", "pch", "ax", "prof", "suc", "iuc", "br", "rrec", "urec", "ai", "pi", "cio", "darch", "pp", "ri", "rad", "uln", "spb", "digit", "sarch"];
const THIN: Record<string, number> = { vert: 10, intth: 10, tcx: 8, ccx: 8, dsc: 8, supth: 8, thac: 8, latth: 8, thd: 7, subsc: 11, ach: 7, pch: 9, prof: 11, suc: 7, iuc: 7, rrec: 7, urec: 7, cio: 8, ai: 7, pi: 7, spb: 6, sarch: 11, darch: 10, pp: 7, ri: 6, digit: 6, aorta: 30, bct: 20, cca: 14 };

/** landmark bar across the vessel where the name changes */
const Mark: React.FC<{ x: number; y: number; ang: number; on: number; label?: string; lx?: number; ly?: number; t: number }> = ({ x, y, ang, on, label }) => {
  if (on <= 0) return null;
  return (
    <g opacity={on} transform={`translate(${x} ${y}) rotate(${ang})`}>
      <line x1={-46 * on} y1={0} x2={46 * on} y2={0} stroke={C.forest} strokeWidth={14} strokeLinecap="round" />
      <line x1={-46 * on} y1={0} x2={46 * on} y2={0} stroke={C.banana} strokeWidth={7} strokeLinecap="round" strokeDasharray="10 8" />
      {label && <text x={0} y={-2} fontSize={1}>{label}</text>}
    </g>
  );
};

export const ArmMap: React.FC<{
  t: number; lit?: Lit; grow?: Lit; show?: string[]; dimAll?: boolean;
  marks?: { rib?: number; teres?: number; elbow?: number };
  scal?: number; pec?: number; plexus?: number; median?: number; pulses?: { k: string; t0: number }[]; parts?: { kind: "sub" | "ax"; t0: number; which?: number };
}> = ({ t, lit = {}, grow = {}, show, dimAll, marks = {}, scal = 0, pec = 0, plexus = 0, median = 0, pulses = [], parts }) => {
  const dim = dimAll ?? anyLit(lit, t);
  const vis = (k: string) => !show || show.includes(k);
  const mk = (k: "rib" | "teres" | "elbow") => (marks[k] !== undefined ? ramp(t, marks[k]!, marks[k]! + 0.4) : 0);
  const sc = scal ? ramp(t, scal, scal + 0.5) : 0;
  const pm = pec ? ramp(t, pec, pec + 0.5) : 0;
  const bp = plexus ? ramp(t, plexus, plexus + 0.6) : 0;
  const mn = median ? ramp(t, median, median + 0.6) : 0;
  return (
    <svg viewBox="0 0 900 1600" width={900} height={1600} style={{ overflow: "visible" }}>
      {/* body silhouette */}
      <path d="M640 0 L640 170 C 600 205 520 215 430 225 C 330 235 262 262 256 340 C 250 420 240 560 222 700 C 210 790 196 840 192 880 C 180 980 160 1120 146 1222 C 130 1244 112 1262 96 1300 C 80 1340 70 1380 76 1420 C 84 1430 96 1428 104 1410 C 112 1380 122 1356 140 1350 C 146 1420 150 1500 158 1560 C 170 1580 186 1576 186 1556 C 190 1500 196 1440 202 1400 C 206 1470 210 1540 214 1590 C 226 1604 244 1600 244 1584 C 246 1520 248 1460 250 1404 C 256 1470 262 1530 270 1580 C 282 1594 298 1588 296 1570 C 292 1510 288 1450 284 1400 C 294 1450 304 1500 312 1540 C 324 1552 340 1544 336 1528 C 330 1470 322 1400 322 1330 C 330 1290 332 1250 330 1222 C 334 1110 342 990 340 880 C 346 760 368 600 404 460 C 420 420 440 410 470 420 C 492 560 506 720 520 880 C 504 1020 478 1160 470 1300 C 466 1420 468 1520 470 1600 L 900 1600 L 900 0 Z" fill={SKIN} stroke={SKIN2} strokeWidth={6} />
      {/* bones (faint) */}
      <g opacity={0.9}>
        <path d="M430 206 C 500 196 600 200 704 224" fill="none" stroke={C.forest} strokeWidth={30} strokeLinecap="round" opacity={0.25} />
        <path d="M430 206 C 500 196 600 200 704 224" fill="none" stroke={BONE} strokeWidth={22} strokeLinecap="round" />
        <path d="M720 268 C 610 262 492 268 446 312 C 432 330 444 344 470 340" fill="none" stroke={C.forest} strokeWidth={26} strokeLinecap="round" opacity={0.22} />
        <path d="M720 268 C 610 262 492 268 446 312 C 432 330 444 344 470 340" fill="none" stroke={BONE} strokeWidth={18} strokeLinecap="round" />
        <circle cx={318} cy={318} r={46} fill={BONE} stroke="rgba(31,42,20,0.22)" strokeWidth={5} />
        <path d="M312 360 C 300 520 280 700 262 840" fill="none" stroke="rgba(31,42,20,0.22)" strokeWidth={36} strokeLinecap="round" />
        <path d="M312 360 C 300 520 280 700 262 840" fill="none" stroke={BONE} strokeWidth={28} strokeLinecap="round" />
        <path d="M222 852 C 250 836 280 838 304 856" fill="none" stroke={BONE} strokeWidth={30} strokeLinecap="round" />
        <path d="M232 890 C 210 1000 190 1120 178 1216" fill="none" stroke={BONE} strokeWidth={20} strokeLinecap="round" opacity={0.95} />
        <path d="M292 880 C 298 1000 302 1120 300 1216" fill="none" stroke={BONE} strokeWidth={18} strokeLinecap="round" opacity={0.95} />
      </g>
      {/* anterior scalene */}
      {sc > 0 && (
        <g opacity={sc}>
          <path d="M548 110 C 552 160 560 230 572 292" stroke={C.forest} strokeWidth={46} strokeLinecap="round" fill="none" opacity={0.35} />
          <path d="M548 110 C 552 160 560 230 572 292" stroke={MUSCLE} strokeWidth={38} strokeLinecap="round" fill="none" opacity={0.85} />
          <path d="M548 110 C 552 160 560 230 572 292" stroke={MUSCLE2} strokeWidth={3} strokeDasharray="8 10" fill="none" />
        </g>
      )}
      {/* vessels (subclavian passes BEHIND the scalene: drawn under the band below) */}
      {ORDER.filter(vis).filter((k) => k !== "sub").map((k) => (
        <Vessel key={k} d={AM_D[k]} k={k} t={t} lit={lit} grow={grow} dim={dim} w={THIN[k] ?? 18} dash={k === "pi"} />
      ))}
      {vis("sub") && <Vessel d={AM_D.sub} k="sub" t={t} lit={lit} grow={grow} dim={dim} w={20} />}
      {sc > 0 && <path d="M552 150 C 556 190 562 240 570 288" stroke={MUSCLE} strokeWidth={30} strokeLinecap="round" fill="none" opacity={0.75 * sc} />}
      {/* brachial plexus cords around the axillary artery */}
      {bp > 0 && (
        <g opacity={bp}>
          <Nv d="M500 250 C 460 300 420 350 360 420" w={7} />
          <Nv d="M470 238 C 440 300 400 360 342 430" w={7} />
          <Nv d="M520 262 C 480 320 430 370 372 432" w={7} />
          <path d="M452 270 C 420 320 380 380 330 446 L 360 456 C 410 400 450 340 486 290 Z" fill="rgba(255,255,255,0.35)" stroke={C.forest} strokeWidth={2} strokeDasharray="6 6" />
        </g>
      )}
      {/* median nerve along the brachial artery: lateral -> crosses in front -> medial */}
      {mn > 0 && (
        <g opacity={mn}>
          <Nv d="M312 470 C 302 540 298 600 300 650 C 304 720 302 800 298 880" w={7} />
        </g>
      )}
      {/* pectoralis minor crossing in front of the axillary artery */}
      {pm > 0 && (
        <g opacity={pm}>
          <path d="M346 300 C 390 360 440 420 520 500" stroke={C.forest} strokeWidth={60} strokeLinecap="round" fill="none" opacity={0.3} />
          <path d="M346 300 C 390 360 440 420 520 500" stroke={MUSCLE} strokeWidth={52} strokeLinecap="round" fill="none" opacity={0.72} />
          <path d="M350 306 C 394 364 444 424 516 494" stroke={MUSCLE2} strokeWidth={3} strokeDasharray="10 10" fill="none" />
        </g>
      )}
      {/* landmarks where the name changes */}
      <Mark x={445} y={300} ang={45} on={mk("rib")} t={t} />
      <Mark x={330} y={440} ang={15} on={mk("teres")} t={t} />
      <Mark x={262} y={880} ang={0} on={mk("elbow")} t={t} />
      {/* part zones */}
      {parts && <PartsOverlay t={t} kind={parts.kind} t0={parts.t0} which={parts.which} />}
      {/* pulse rings */}
      {pulses.map((p, i) => {
        if (t < p.t0) return null;
        const [x, y] = AM_PT[p.k];
        const o = ramp(t, p.t0, p.t0 + 0.3);
        return (
          <g key={i} opacity={o}>
            {[0, 0.33, 0.66].map((ph) => {
              const k = ((t - p.t0) * 1.2 + ph) % 1;
              return <circle key={ph} cx={x} cy={y} r={14 + 46 * k} fill="none" stroke={C.red} strokeWidth={6 * (1 - k)} opacity={1 - k} />;
            })}
            <circle cx={x} cy={y} r={11} fill={C.red} stroke={C.paper} strokeWidth={4} />
          </g>
        );
      })}
    </svg>
  );
};

const PartsOverlay: React.FC<{ t: number; kind: "sub" | "ax"; t0: number; which?: number }> = ({ t, kind, t0 }) => {
  const P = kind === "sub"
    ? [{ x: 660, y: 196, n: "1" }, { x: 566, y: 194, n: "2" }, { x: 498, y: 216, n: "3" }]
    : [{ x: 470, y: 312, n: "1" }, { x: 432, y: 356, n: "2" }, { x: 390, y: 412, n: "3" }];
  return (
    <g>
      {P.map((p, i) => {
        const o = ramp(t, t0 + i * 0.5, t0 + i * 0.5 + 0.3);
        if (o <= 0) return null;
        return (
          <g key={i} opacity={o} transform={`translate(${p.x} ${p.y}) scale(${0.7 + 0.3 * o})`}>
            <circle r={22} fill={C.forest} stroke={C.paper} strokeWidth={4} />
            <text x={0} y={9} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={C.banana}>{p.n}</text>
          </g>
        );
      })}
    </g>
  );
};

/* =====================================================================
   B. THREE PARTS — straight schematic, viewBox 900 x 600
   ===================================================================== */
export type BranchStub = { x: number; up: boolean; name: string; t0: number; col: string };
export const ThreeParts: React.FC<{ t: number; t0: number; muscle: string; col: string; branches: BranchStub[]; left: string; right: string; counts: string[]; hot?: number }> = ({ t, t0, muscle, col, branches, left, right, counts }) => {
  const p = ramp(t, t0, t0 + 1.0);
  const mo = ramp(t, t0 + 0.6, t0 + 1.0);
  return (
    <svg viewBox="0 0 900 600" width={900} height={600} style={{ overflow: "visible" }}>
      {/* part zones */}
      {[[50, 360, "PART 1"], [360, 540, "PART 2"], [540, 850, "PART 3"]].map(([a, b, n], i) => (
        <g key={i} opacity={ramp(t, t0 + 1 + i * 0.4, t0 + 1.4 + i * 0.4)}>
          <rect x={(a as number) + 6} y={60} width={(b as number) - (a as number) - 12} height={530} rx={26} fill={i % 2 ? "rgba(92,122,47,0.10)" : "rgba(242,209,78,0.16)"} />
          <text x={((a as number) + (b as number)) / 2} y={104} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.matcha} letterSpacing={3}>{n}</text>
          <text x={((a as number) + (b as number)) / 2} y={570} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={48} fill={C.forest}>{counts[i]}</text>
        </g>
      ))}
      {/* main artery */}
      <path d="M40 300 L 860 300" stroke={C.forest} strokeWidth={46} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      <path d="M40 300 L 860 300" stroke={col} strokeWidth={36} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      <path d="M40 294 L 860 294" stroke="rgba(255,255,255,0.45)" strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      {/* the dividing muscle crosses in front */}
      <g opacity={mo}>
        <rect x={370} y={140} width={160} height={290} rx={40} fill={MUSCLE} stroke={C.forest} strokeWidth={5} opacity={0.88} />
        {[0, 1, 2, 3, 4, 5].map((k) => <line key={k} x1={392 + k * 23} y1={160} x2={392 + k * 23} y2={410} stroke={MUSCLE2} strokeWidth={3} />)}
        <g transform="translate(450 285) rotate(-90)">
          <rect x={-140} y={-24} width={280} height={44} rx={14} fill={C.forest} />
          <text x={0} y={8} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={C.paper}>{muscle}</text>
        </g>
      </g>
      {/* branches */}
      {branches.map((b, i) => {
        const g = ramp(t, b.t0 - 0.1, b.t0 + 0.6);
        if (g <= 0) return null;
        const y2 = b.up ? 170 : 430;
        const d = `M${b.x} 300 L${b.x} ${300 + (y2 - 300) * g}`;
        return (
          <g key={i}>
            <path d={d} stroke={C.forest} strokeWidth={20} strokeLinecap="round" />
            <path d={d} stroke={b.col} strokeWidth={13} strokeLinecap="round" />
            {b.name && g > 0.6 && (
              <g opacity={ramp(t, b.t0 + 0.4, b.t0 + 0.7)}>
                <circle cx={b.x} cy={y2 + (b.up ? -26 : 26)} r={26} fill={C.forest} stroke={b.col} strokeWidth={5} />
                <text x={b.x} y={y2 + (b.up ? -26 : 26) + 10} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={C.banana}>{b.name}</text>
              </g>
            )}
          </g>
        );
      })}
      <text x={40} y={256} fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.matcha}>{left}</text>
      <text x={860} y={256} textAnchor="end" fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.matcha}>{right}</text>
    </svg>
  );
};

/* =====================================================================
   C. CUBITAL FOSSA — right elbow, front view, viewBox 900 x 820
   lateral (thumb side) = left
   ===================================================================== */
export const CF_PT: Record<string, [number, number]> = {
  rn: [300, 330], ten: [404, 300], art: [494, 330], mn: [586, 330], br: [150, 470], pt: [760, 470], top: [450, 120], apex: [450, 690], rad: [380, 760], uln: [530, 760], lat: [130, 120], med: [770, 120],
};
export const Cubital: React.FC<{ t: number; lit?: Lit; show?: { borders?: number; rn?: number; ten?: number; art?: number; mn?: number; split?: number; pulse?: number } }> = ({ t, lit = {}, show = {} }) => {
  const o = (k: keyof typeof show) => (show[k] !== undefined ? ramp(t, show[k]!, show[k]! + 0.5) : 0);
  const g = (k: string) => glow(t, lit, k);
  const hl = (k: string, w: number) => g(k) > 0 ? <></> : null;
  void hl;
  const sp = o("split");
  return (
    <svg viewBox="0 0 900 820" width={900} height={820} style={{ overflow: "visible" }}>
      <rect x={20} y={20} width={860} height={780} rx={40} fill={SKIN} />
      {/* humerus end + epicondyles line */}
      <path d="M150 120 C 300 150 600 150 750 120" stroke={C.forest} strokeWidth={6} strokeDasharray="14 12" fill="none" opacity={0.6 + 0.4 * g("top")} />
      <circle cx={140} cy={118} r={22} fill={BONE} stroke={C.forest} strokeWidth={4} />
      <circle cx={760} cy={118} r={22} fill={BONE} stroke={C.forest} strokeWidth={4} />
      {/* brachioradialis (lateral border) */}
      <g opacity={o("borders")}>
        <path d="M60 40 C 120 200 250 420 420 720 L 330 790 C 180 560 70 300 30 120 Z" fill={MUSCLE} stroke={C.forest} strokeWidth={5} />
        {[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M${60 + k * 22} ${80 + k * 6} C ${140 + k * 18} 260 ${260 + k * 10} 480 ${360 + k * 8} 740`} stroke={MUSCLE2} strokeWidth={3} fill="none" />)}
        {/* pronator teres (medial border) */}
        <path d="M840 40 C 780 200 650 420 480 720 L 570 790 C 720 560 830 300 870 120 Z" fill={MUSCLE} stroke={C.forest} strokeWidth={5} />
        {[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M${840 - k * 22} ${80 + k * 6} C ${760 - k * 18} 260 ${640 - k * 10} 480 ${540 - k * 8} 740`} stroke={MUSCLE2} strokeWidth={3} fill="none" />)}
        {g("br") > 0 && <path d="M60 40 C 120 200 250 420 420 720" stroke={C.banana} strokeWidth={16} fill="none" opacity={g("br")} />}
        {g("pt") > 0 && <path d="M840 40 C 780 200 650 420 480 720" stroke={C.banana} strokeWidth={16} fill="none" opacity={g("pt")} />}
      </g>
      {/* floor */}
      <path d="M210 150 L 690 150 L 450 700 Z" fill="rgba(217,140,126,0.25)" />
      {/* contents (lateral -> medial): radial nerve, biceps tendon, brachial artery, median nerve */}
      {o("rn") > 0 && <g opacity={o("rn") * (Object.keys(lit).length && !g("rn") ? 0.45 : 1)}><Nv d="M300 20 C 296 200 300 420 330 640" w={12} /></g>}
      {o("ten") > 0 && (
        <g opacity={o("ten") * (Object.keys(lit).length && !g("ten") ? 0.45 : 1)}>
          {g("ten") > 0 && <path d="M404 20 C 404 200 408 400 420 560" stroke={C.banana} strokeWidth={66} strokeLinecap="round" fill="none" opacity={0.5 * g("ten")} />}
          <path d="M404 20 C 404 200 408 400 420 560" stroke={C.forest} strokeWidth={48} strokeLinecap="round" fill="none" />
          <path d="M404 20 C 404 200 408 400 420 560" stroke={TENDON} strokeWidth={40} strokeLinecap="round" fill="none" />
          {[0, 1, 2].map((k) => <path key={k} d={`M${394 + k * 10} 40 C ${394 + k * 10} 200 ${398 + k * 10} 400 ${410 + k * 10} 540`} stroke="rgba(31,42,20,0.18)" strokeWidth={2} fill="none" />)}
        </g>
      )}
      {o("art") > 0 && (
        <g opacity={o("art") * (Object.keys(lit).length && !g("art") ? 0.45 : 1)}>
          <Vessel d="M494 20 C 494 200 492 420 482 600" k="br" t={t} lit={g("art") ? { br: lit.art } : {}} dim={false} w={30} />
          {sp > 0 && <Vessel d="M482 598 C 460 660 420 720 380 800" k="rad" t={t} lit={{}} grow={{ rad: show.split! }} dim={false} w={22} />}
          {sp > 0 && <Vessel d="M482 598 C 500 660 520 720 540 800" k="uln" t={t} lit={{}} grow={{ uln: show.split! }} dim={false} w={24} />}
        </g>
      )}
      {o("mn") > 0 && <g opacity={o("mn") * (Object.keys(lit).length && !g("mn") ? 0.45 : 1)}>{g("mn") > 0 && <path d="M586 20 C 588 200 590 420 560 700" stroke={C.banana} strokeWidth={40} strokeLinecap="round" fill="none" opacity={0.5 * g("mn")} />}<Nv d="M586 20 C 588 200 590 420 560 700" w={14} /></g>}
      {show.pulse !== undefined && t >= show.pulse && [0, 0.33, 0.66].map((ph) => {
        const k = ((t - show.pulse!) * 1.2 + ph) % 1;
        return <circle key={ph} cx={494} cy={300} r={18 + 60 * k} fill="none" stroke={C.red} strokeWidth={7 * (1 - k)} opacity={1 - k} />;
      })}
    </svg>
  );
};

/* =====================================================================
   D. HAND — right palm, fingers up, thumb on the left. viewBox 900 x 1000
   ===================================================================== */
export const HA_PT: Record<string, [number, number]> = {
  sarch: [470, 470], darch: [470, 582], rad: [262, 900], uln: [650, 900], spb: [300, 700], guyon: [668, 810], ret: [470, 860], digit: [455, 330], meta: [400, 520], line: [180, 470], pp: [220, 560], ri: [330, 470], snuff: [190, 760], ten: [520, 640], apo: [560, 420],
};
export const Hand: React.FC<{ t: number; lit?: Lit; grow?: Lit; layers?: { ten?: number; apo?: number; line?: number; ret?: number; un?: number; guyon?: number }; dimAll?: boolean }> = ({ t, lit = {}, grow = {}, layers = {}, dimAll }) => {
  const dim = dimAll ?? anyLit(lit, t);
  const L = (k: keyof typeof layers) => (layers[k] !== undefined ? ramp(t, layers[k]!, layers[k]! + 0.5) : 0);
  const D: Record<string, string> = {
    rad: "M262 960 C 262 880 250 820 222 780 C 200 748 212 700 250 660 C 280 630 300 610 318 596",
    uln: "M650 960 C 652 880 662 830 668 790 C 670 740 660 700 640 640",
    darch: "M318 596 C 400 578 520 574 640 590",
    dpb: "M664 760 C 660 700 650 640 640 592",
    sarch: "M640 640 C 630 540 560 486 470 476 C 400 470 344 486 316 520",
    spb: "M262 890 C 280 800 300 700 310 600 C 314 570 314 540 316 520",
    digit: "M402 476 C 404 400 406 360 410 320 M410 320 C 396 260 386 200 382 130 M410 320 C 424 260 434 200 440 140 M500 474 C 504 400 506 360 508 320 M508 320 C 494 250 486 180 484 100 M508 320 C 522 250 532 180 536 104 M592 494 C 600 420 606 380 610 340 M610 340 C 596 270 588 200 586 130 M610 340 C 624 280 634 220 640 160",
    meta: "M402 584 C 402 540 402 510 402 478 M500 578 C 500 540 500 510 500 476 M594 584 C 594 550 594 520 594 496",
    pp: "M318 596 C 280 570 240 520 200 470",
    ri: "M330 590 C 340 540 350 480 360 420",
  };
  const ord = ["darch", "meta", "dpb", "rad", "pp", "ri", "uln", "spb", "digit", "sarch"];
  const W: Record<string, number> = { rad: 22, uln: 22, darch: 16, sarch: 18, dpb: 9, spb: 8, digit: 8, meta: 8, pp: 10, ri: 8 };
  const colr: Record<string, string> = { rad: AC.rad, uln: AC.uln, darch: AC.darch, sarch: AC.sarch, dpb: AC.dpb, spb: AC.spb, digit: AC.digit, meta: AC.meta, pp: AC.pp, ri: AC.ri };
  const tenO = L("ten"), apoO = L("apo"), lineO = L("line"), retO = L("ret");
  return (
    <svg viewBox="0 0 900 1000" width={900} height={1000} style={{ overflow: "visible" }}>
      {/* hand outline */}
      <path d="M250 1000 L 250 820 C 230 780 200 760 170 720 C 130 670 90 600 60 530 C 44 494 72 470 100 490 C 140 520 190 580 240 620 C 250 560 260 500 280 470 L 300 300 C 302 260 340 254 352 290 L 372 140 C 376 100 420 100 424 140 L 440 300 L 470 90 C 476 50 530 50 532 92 L 548 300 L 572 130 C 578 90 626 92 626 134 L 632 330 L 664 190 C 674 156 714 162 710 200 L 696 420 C 700 520 700 620 690 700 C 682 760 670 800 660 820 L 660 1000 Z" fill={SKIN} stroke={SKIN2} strokeWidth={8} />
      {/* thumb extended -> Boeckel's line (distal border of the extended thumb) */}
      {lineO > 0 && (
        <g opacity={lineO}>
          <line x1={40} y1={470} x2={720} y2={470} stroke={C.forest} strokeWidth={5} strokeDasharray="16 12" />
          <rect x={30} y={400} width={250} height={46} rx={14} fill={C.forest} />
          <text x={155} y={432} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.banana}>thumb fully extended</text>
        </g>
      )}
      {/* metacarpal bases (faint) */}
      {[380, 480, 580, 660].map((x, i) => <rect key={i} x={x - 14} y={560} width={28} height={140} rx={14} fill={BONE} opacity={0.75} />)}
      {/* deep layer vessels */}
      {ord.slice(0, 6).map((k) => <Vessel key={k} d={D[k]} k={k} t={t} lit={lit} grow={grow} dim={dim} w={W[k]} col={colr[k]} />)}
      {/* flexor tendons between the arches */}
      {tenO > 0 && (
        <g opacity={tenO * 0.92}>
          {[[420, 440], [490, 500], [560, 590], [630, 672]].map(([x1, x2], i) => (
            <path key={i} d={`M${470 + (i - 1.5) * 26} 980 C ${470 + (i - 1.5) * 40} 820 ${x1} 640 ${x2} 360`} stroke={C.forest} strokeWidth={36} strokeLinecap="round" fill="none" opacity={0.25} />
          ))}
          {[[420, 440], [490, 500], [560, 590], [630, 672]].map(([x1, x2], i) => (
            <path key={"b" + i} d={`M${470 + (i - 1.5) * 26} 980 C ${470 + (i - 1.5) * 40} 820 ${x1} 640 ${x2} 360`} stroke={TENDON} strokeWidth={28} strokeLinecap="round" fill="none" />
          ))}
        </g>
      )}
      {/* flexor retinaculum */}
      {retO > 0 && (
        <g opacity={retO}>
          <rect x={300} y={830} width={330} height={60} rx={20} fill="#D8CFB4" stroke={C.forest} strokeWidth={4} />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => <line key={k} x1={320 + k * 40} y1={838} x2={310 + k * 40} y2={882} stroke="rgba(31,42,20,0.2)" strokeWidth={3} />)}
          <circle cx={756} cy={836} r={24} fill={BONE} stroke={C.forest} strokeWidth={4} />
        </g>
      )}
      {/* superficial layer vessels */}
      {ord.slice(6).map((k) => <Vessel key={k} d={D[k]} k={k} t={t} lit={lit} grow={grow} dim={dim} w={W[k]} col={colr[k]} />)}
      {/* ulnar nerve beside the artery (artery on its thumb side) + Guyon's canal */}
      {L("un") > 0 && <g opacity={L("un")}><Nv d="M690 1000 C 692 900 696 840 698 780 C 700 740 694 700 684 660" w={10} /></g>}
      {L("guyon") > 0 && (
        <g opacity={L("guyon")}>
          <rect x={640} y={770} width={86} height={110} rx={30} fill="rgba(242,209,78,0.18)" stroke={C.forest} strokeWidth={5} strokeDasharray="12 9" />
        </g>
      )}
      {/* palmar aponeurosis (veil) */}
      {apoO > 0 && <path d="M450 860 C 420 760 360 600 330 476 C 420 452 560 452 650 476 C 600 600 520 760 486 860 Z" fill="rgba(255,255,255,0.5)" stroke="rgba(31,42,20,0.35)" strokeWidth={3} strokeDasharray="8 8" opacity={apoO} />}
    </svg>
  );
};

/* =====================================================================
   E. MEDIAN NERVE CROSSING — brachial artery, schematic, viewBox 500 x 1000
   ===================================================================== */
export const MedianCross: React.FC<{ t: number; t0: number; t1: number }> = ({ t, t0, t1 }) => {
  const p = ramp(t, t0, t1);
  const nerve = "M150 40 C 170 300 200 440 250 500 C 300 560 330 700 350 960";
  return (
    <svg viewBox="0 0 500 1000" width={500} height={1000} style={{ overflow: "visible" }}>
      <rect x={20} y={20} width={460} height={960} rx={36} fill={SKIN} />
      <Vessel d="M250 30 L 250 970" k="br" t={t} lit={{}} dim={false} w={40} />
      <path d={nerve} fill="none" stroke={C.forest} strokeWidth={22} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      <path d={nerve} fill="none" stroke={NERVE} strokeWidth={15} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />
      <text x={60} y={120} fontFamily={FONT} fontWeight={800} fontSize={28} fill={C.matcha}>lateral</text>
      <text x={440} y={120} textAnchor="end" fontFamily={FONT} fontWeight={800} fontSize={28} fill={C.matcha}>medial</text>
    </svg>
  );
};
