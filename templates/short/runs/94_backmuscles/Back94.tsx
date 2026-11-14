import React from "react";
import { C, FONT, ramp } from "./kit";

/* Book Plume's own diagram of the 5 superficial (extrinsic) back muscles, posterior view like Gray's Fig. 409.
   Viewer's LEFT half = superficial layer (trapezius + latissimus dorsi); viewer's RIGHT half = trapezius can peel away
   to show the deep three: levator scapulae, rhomboid minor, rhomboid major (top to bottom). viewBox 1000 x 1000. */
export type BM = "TR" | "LD" | "LS" | "RMI" | "RMA";
export const BORDER: BM[] = ["TR", "LD", "LS", "RMI", "RMA"];
export const BLETTER: Record<BM, string> = { TR: "T", LD: "L", LS: "L", RMI: "m", RMA: "M" };
export const BNAME: Record<BM, string> = { TR: "Trapezius", LD: "Latissimus dorsi", LS: "Levator scapulae", RMI: "Rhomboid minor", RMA: "Rhomboid major" };
export const BNERVE: Record<BM, string> = { TR: "accessory nerve · CN XI", LD: "thoracodorsal nerve", LS: "dorsal scapular nerve", RMI: "dorsal scapular nerve", RMA: "dorsal scapular nerve" };
export const BCOL = (b: BM) => (b === "TR" ? C.red : b === "LD" ? C.matcha : b === "LS" ? "#B07A1E" : b === "RMI" ? "#3E7CA6" : "#2F5E86");

type P = [number, number];
const lerp = (a: P, b: P, k: number): P => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
const along = (pts: P[], k: number): P => {
  const seg: number[] = [];
  let L = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const d = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
    seg.push(d);
    L += d;
  }
  let r = k * L;
  for (let i = 0; i < seg.length; i++) {
    if (r <= seg[i] || i === seg.length - 1) return lerp(pts[i], pts[i + 1], Math.min(1, r / seg[i]));
    r -= seg[i];
  }
  return pts[pts.length - 1];
};
/* fibre lines from an origin polyline to an insertion polyline */
const fibres = (o: P[], ins: P[], n: number, bow = 0) => {
  const out: string[] = [];
  for (let i = 0; i <= n; i++) {
    const k = i / n;
    const a = along(o, k), b = along(ins, k);
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const L = Math.hypot(dx, dy) || 1;
    out.push(`M ${a[0].toFixed(1)} ${a[1].toFixed(1)} Q ${(mx - (dy / L) * bow).toFixed(1)} ${(my + (dx / L) * bow).toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`);
  }
  return out.join(" ");
};

/* ---- shapes, defined for the viewer's LEFT half (x < 500); the right half uses a mirror transform ---- */
const BODY = "M 500 128 L 458 128 C 456 158 452 180 440 196 C 380 220 300 236 228 252 C 180 262 150 292 146 340 C 140 420 148 520 156 640 L 240 640 C 242 560 248 470 258 410 C 268 520 280 640 290 720 C 280 780 264 830 262 880 C 262 920 268 950 276 984 L 500 984 Z";
const DELT = "M 232 252 C 190 258 160 282 150 330 C 146 380 158 420 192 456 C 210 420 224 380 238 330 C 246 300 246 270 232 252 Z";
const ARMB = "M 160 440 C 170 500 176 560 180 640 L 238 640 C 236 560 240 490 248 430 Z";
const TRAP = "M 500 126 L 462 128 C 458 160 450 182 436 198 C 370 222 300 238 230 256 L 236 274 C 290 288 340 302 386 318 C 420 410 458 530 500 640 Z";
const TRAP_F = fibres([[500, 132], [500, 300], [500, 630]], [[440, 200], [330, 226], [238, 264], [310, 292], [386, 318]], 32, 6);
const LAT = "M 500 452 L 500 900 C 440 904 360 898 300 884 C 286 800 272 640 262 540 C 258 500 252 452 242 424 L 256 404 C 300 430 360 448 420 452 Z";
const LAT_F = fibres([[500, 456], [500, 900], [300, 884]], [[256, 406], [252, 418], [250, 428], [248, 438]], 30, -14);
const FASCIA = "M 500 560 L 500 900 L 392 896 C 412 790 446 670 500 560 Z";
const SCAP = "M 390 262 C 352 256 306 262 266 276 L 248 318 C 288 382 330 442 372 494 C 382 480 386 420 390 340 Z";
const SPINE_SC = "M 390 314 C 330 298 278 282 222 266";
const INFRA = "M 388 330 C 350 322 300 312 258 322 C 290 380 330 440 372 490 C 382 470 386 420 388 330 Z";
const LEV = "M 456 136 C 462 141 474 141 482 138 C 472 190 440 238 412 274 L 388 260 C 418 222 446 184 456 136 Z";
const LEV_F = fibres([[458, 138], [480, 139]], [[380, 264], [398, 274]], 6, 0);
const RMIN = "M 500 194 L 500 234 L 388 320 L 390 290 Z";
const RMIN_F = fibres([[500, 196], [500, 232]], [[390, 292], [388, 318]], 6, 0);
const RMAJ = "M 500 242 L 500 364 L 380 492 L 388 326 Z";
const RMAJ_F = fibres([[500, 244], [500, 362]], [[388, 328], [382, 488]], 14, 0);

const MUSCLE = "#D99482";
const MUSCLE_DIM = "#EBD3C8";
const HOTFILL: Record<BM, string> = { TR: "#E25C47", LD: "#7FA046", LS: "#D79A2E", RMI: "#5B98C4", RMA: "#3F77A6" };

const M: React.FC<{ d: string; f: string; on: number; hot: boolean; k: BM; id: string; dim?: boolean }> = ({ d, f, on, hot, k, id, dim }) => {
  const fill = on > 0 ? HOTFILL[k] : dim ? MUSCLE_DIM : MUSCLE;
  return (
    <g>
      {hot && <path d={d} fill="none" stroke={C.banana} strokeWidth={22} strokeLinejoin="round" opacity={0.9} />}
      <path d={d} fill={dim && on <= 0 ? MUSCLE_DIM : MUSCLE} stroke={C.forest} strokeWidth={4} strokeLinejoin="round" />
      {on > 0 && <path d={d} fill={fill} opacity={on} />}
      <clipPath id={`${id}${k}c`}>
        <path d={d} />
      </clipPath>
      <path d={f} fill="none" stroke={on > 0.5 ? "rgba(255,240,230,0.55)" : "rgba(120,50,40,0.35)"} strokeWidth={2.4} clipPath={`url(#${id}${k}c)`} />
      <path d={d} fill="none" stroke={hot ? C.forest : "rgba(31,42,20,0.85)"} strokeWidth={hot ? 6 : 4} strokeLinejoin="round" />
    </g>
  );
};

const lv = (t: number, t0?: number) => (t0 === undefined ? 0 : ramp(t, t0 - 0.05, t0 + 0.3));

export const Back: React.FC<{
  t: number; w: number; id: string; lit: Partial<Record<BM, number>>; hot?: BM[]; peel?: number; badges?: boolean; dimTop?: number;
}> = ({ t, w, id, lit, hot = [], peel = 0, badges = true, dimTop = 0 }) => {
  const on = (k: BM) => lv(t, lit[k]);
  const H = (k: BM) => hot.includes(k);
  const mir = "translate(1000 0) scale(-1 1)";
  const vert = Array.from({ length: 24 }).map((_, i) => 150 + i * 34);
  const badge = (k: BM, x: number, y: number, ax?: number, ay?: number) => {
    const o = on(k);
    const s = H(k) ? 1.18 : 1;
    return (
      <g key={k}>
      {ax !== undefined && <line x1={ax} y1={ay} x2={x} y2={y} stroke={C.forest} strokeWidth={5} strokeLinecap="round" />}
      {ax !== undefined && <circle cx={ax} cy={ay} r={8} fill={C.forest} />}
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <circle r={34} fill={o > 0.5 ? BCOL(k) : "#fff"} stroke={C.forest} strokeWidth={5} />
        <text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={o > 0.5 ? "#fff" : C.forest}>{BLETTER[k]}</text>
      </g>
      </g>
    );
  };
  return (
    <svg width={w} height={w} viewBox="0 0 1000 1000" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={`${id}skin`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F4E4D6" />
          <stop offset="1" stopColor="#EBD2BF" />
        </linearGradient>
        <radialGradient id={`${id}head`} cx="0.5" cy="0.35" r="0.6">
          <stop offset="0" stopColor="#E9DDC6" />
          <stop offset="1" stopColor="#CFC1A4" />
        </radialGradient>
      </defs>
      {/* head (back view) */}
      <ellipse cx={500} cy={64} rx={74} ry={80} fill={`url(#${id}head)`} stroke={C.forest} strokeWidth={4} />
      <path d="M 446 100 C 470 116 530 116 554 100" fill="none" stroke={C.forest} strokeWidth={3} opacity={0.5} />
      {/* body */}
      <path d={BODY} fill={`url(#${id}skin)`} stroke={C.forest} strokeWidth={4} />
      <path d={BODY} transform={mir} fill={`url(#${id}skin)`} stroke={C.forest} strokeWidth={4} />
      {[DELT, ARMB].map((d, i) => (
        <g key={i}>
          <path d={d} fill={MUSCLE_DIM} stroke={C.forest} strokeWidth={3.5} />
          <path d={d} transform={mir} fill={MUSCLE_DIM} stroke={C.forest} strokeWidth={3.5} />
        </g>
      ))}
      {/* RIGHT half, deep layer: scapula + infraspinatus + the deep three */}
      <g transform={mir}>
        <path d={SCAP} fill="#F3EBD9" stroke={C.forest} strokeWidth={4} />
        <path d={INFRA} fill={MUSCLE_DIM} stroke={C.forest} strokeWidth={3} />
        <path d={SPINE_SC} fill="none" stroke={C.forest} strokeWidth={22} strokeLinecap="round" />
        <path d={SPINE_SC} fill="none" stroke="#F3EBD9" strokeWidth={14} strokeLinecap="round" />
        <M d={LAT} f={LAT_F} on={on("LD")} hot={H("LD")} k="LD" id={id + "r"} />
        <M d={LEV} f={LEV_F} on={on("LS")} hot={H("LS")} k="LS" id={id} />
        <M d={RMIN} f={RMIN_F} on={on("RMI")} hot={H("RMI")} k="RMI" id={id} />
        <M d={RMAJ} f={RMAJ_F} on={on("RMA")} hot={H("RMA")} k="RMA" id={id} />
        {/* right trapezius: peels away to show the deep three */}
        <g opacity={1 - 0.88 * peel} transform={`translate(${-peel * 30} ${-peel * 18})`}>
          <M d={TRAP} f={TRAP_F} on={on("TR") * (1 - peel)} hot={H("TR") && peel < 0.5} k="TR" id={id + "r"} />
        </g>
        {peel > 0.02 && <path d={TRAP} fill="none" stroke={C.forest} strokeWidth={4} strokeDasharray="14 12" opacity={0.3 * peel} />}
      </g>
      {/* LEFT half, superficial layer (scapula region under it, dim) */}
      <path d={SCAP} fill="#F3EBD9" stroke={C.forest} strokeWidth={3} opacity={0.9} />
      <path d={INFRA} fill={MUSCLE_DIM} stroke={C.forest} strokeWidth={3} />
      <path d={SPINE_SC} fill="none" stroke={C.forest} strokeWidth={22} strokeLinecap="round" />
      <path d={SPINE_SC} fill="none" stroke="#F3EBD9" strokeWidth={14} strokeLinecap="round" />
      <g opacity={1 - 0.45 * dimTop}>
        <M d={LAT} f={LAT_F} on={on("LD")} hot={H("LD")} k="LD" id={id} />
        <path d={FASCIA} fill="#F2ECDD" stroke="rgba(31,42,20,0.5)" strokeWidth={2.5} />
        <M d={TRAP} f={TRAP_F} on={on("TR")} hot={H("TR")} k="TR" id={id} />
      </g>
      <path d={FASCIA} transform={mir} fill="#F2ECDD" stroke="rgba(31,42,20,0.5)" strokeWidth={2.5} />
      {/* spinous processes */}
      {vert.map((y, i) => (
        <rect key={i} x={489} y={y} width={22} height={22} rx={8} fill="#F3EBD9" stroke={C.forest} strokeWidth={3} opacity={0.95} />
      ))}
      {badges && (
        <>
          {badge("TR", 400, 260)}
          {badge("LD", 370, 690)}
          {peel > 0.5 && badge("LS", 650, 150, 566, 196)}
          {peel > 0.5 && badge("RMI", 700, 236, 572, 278)}
          {peel > 0.5 && badge("RMA", 690, 430, 568, 380)}
        </>
      )}
    </svg>
  );
};
