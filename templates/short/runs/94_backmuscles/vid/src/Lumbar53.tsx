import React from "react";
import { C, FONT, ramp } from "./kit";

/**
 * Book Plume schematic of the RIGHT lumbar plexus, front view (patient's right = viewer's left). viewBox 860 x 620. Not to scale.
 * Facts (TeachMeAnatomy "The Lumbar Plexus"; StatPearls "Anatomy, Back, Lumbar Plexus" NBK545137; Gray 1918 Figs. 822-823):
 *   anterior rami L1-L4 (+ T12 contribution), formed within the psoas major
 *   iliohypogastric L1 (+T12) -> above the iliac crest; ilioinguinal L1 -> inguinal canal
 *   genitofemoral L1-L2 -> pierces / runs on the FRONT of psoas
 *   lateral femoral cutaneous L2-L3 -> lateral border of psoas, near the ASIS under the inguinal ligament -> skin of lateral thigh
 *   femoral L2-L4 (largest) -> between psoas and iliacus, under the inguinal ligament -> anterior thigh
 *   obturator L2-L4 -> MEDIAL border of psoas -> obturator foramen -> medial thigh (adductors)
 */
export type NK = "ih" | "ii" | "gf" | "lfc" | "ob" | "fe";
export const NERVES: { k: NK; L: string; word: string; name: string; roots: string; to: string; color: string }[] = [
  { k: "ih", L: "I", word: "I,", name: "Iliohypogastric", roots: "L1 (+T12)", to: "above the hip bone", color: "#E8B547" },
  { k: "ii", L: "I", word: "I", name: "Ilioinguinal", roots: "L1", to: "groin", color: "#F09A62" },
  { k: "gf", L: "G", word: "Get", name: "Genitofemoral", roots: "L1–L2", to: "front of psoas", color: "#E58BA3" },
  { k: "lfc", L: "L", word: "Leftovers", name: "Lateral femoral cutaneous", roots: "L2–L3", to: "skin, side of thigh", color: "#B49BE0" },
  { k: "ob", L: "O", word: "On", name: "Obturator", roots: "L2–L4", to: "inner thigh", color: "#6FB8DC" },
  { k: "fe", L: "F", word: "Fridays", name: "Femoral", roots: "L2–L4", to: "front of thigh", color: "#8DBE57" },
];
export const NCOL: Record<NK, string> = Object.fromEntries(NERVES.map((n) => [n.k, n.color])) as Record<NK, string>;

/* vertebral levels: centre y of each body, root exit y (foramen below the body) */
const SPX = 640; // spine centre x
export const LEVELS = [
  { id: "T12", y: 44, ry: 74 },
  { id: "L1", y: 102, ry: 132 },
  { id: "L2", y: 160, ry: 190 },
  { id: "L3", y: 218, ry: 248 },
  { id: "L4", y: 276, ry: 306 },
  { id: "L5", y: 334, ry: 364 },
];
const BH = 46; // body height

/* nerve paths (main trunk + small extra twigs) */
const P: Record<NK, { d: string[]; w: number; tag: [number, number]; anchor?: "start" | "middle" | "end" }> = {
  ih: { d: ["M 600 132 C 520 132 420 150 300 186 C 220 210 150 232 70 246", "M 600 74 C 585 90 590 118 600 132"], w: 15, tag: [250, 168] },
  ii: { d: ["M 600 134 C 520 150 430 190 330 240 C 250 280 200 330 236 390 C 262 430 300 450 340 470"], w: 13, tag: [420, 322] },
  gf: { d: ["M 600 190 C 560 200 548 230 540 268 C 528 330 508 400 484 470 C 474 500 470 530 468 560", "M 600 136 C 584 150 578 170 586 192"], w: 13, tag: [470, 432], anchor: "end" },
  lfc: { d: ["M 600 248 C 540 254 470 262 400 286 C 300 320 190 360 150 420 C 128 456 122 520 118 610", "M 600 192 C 580 210 582 236 596 248"], w: 14, tag: [205, 398], anchor: "start" },
  fe: { d: ["M 600 306 C 540 312 470 330 420 370 C 380 404 356 440 344 480 C 336 520 330 560 326 620", "M 600 250 C 576 270 578 292 598 306", "M 596 194 C 572 220 566 268 590 300", "M 344 488 C 320 530 290 570 262 620", "M 346 492 C 372 540 392 580 404 620"], w: 22, tag: [400, 447], anchor: "start" },
  ob: { d: ["M 604 306 C 612 350 612 392 590 430 C 568 470 536 500 518 530 C 504 556 512 590 530 620", "M 600 252 C 612 270 616 290 606 308"], w: 15, tag: [556, 398], anchor: "end" },
};
const ORDER: NK[] = ["ob", "fe", "lfc", "gf", "ii", "ih"];

const mix = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return "#" + pa.map((v, i) => Math.round(v + (pb[i] - v) * Math.max(0, Math.min(1, k))).toString(16).padStart(2, "0")).join("");
};
const NERVE = "#F4E6BE", NERVE_EDGE = "#A88B45";

const Tag: React.FC<{ x: number; y: number; text: string; p: number; hot?: boolean; anchor?: "start" | "middle" | "end"; color?: string; size?: number }> = ({ x, y, text, p, hot, anchor = "middle", color, size = 30 }) => {
  if (p <= 0) return null;
  const w = text.length * size * 0.6 + (color ? 62 : 34);
  const x0 = anchor === "middle" ? -w / 2 : anchor === "end" ? -w : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${0.75 + 0.25 * p})`} opacity={Math.min(1, p * 1.4)}>
      <rect x={x0} y={-size * 0.8} width={w} height={size * 1.6} rx={size * 0.5} fill={hot ? C.banana : C.forest} stroke={C.forest} strokeWidth={3} />
      {color && <circle cx={x0 + 26} cy={0} r={11} fill={color} stroke={hot ? C.forest : C.paper} strokeWidth={3} />}
      <text x={x0 + w / 2 + (color ? 14 : 0)} y={size * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={size} fill={hot ? C.forest : C.paper}>{text}</text>
    </g>
  );
};

export type Win = [number, number?];
const inWin = (t: number, w?: Win) => (w === undefined ? 0 : ramp(t, w[0] - 0.05, w[0] + 0.3) * (w[1] === undefined ? 1 : 1 - ramp(t, w[1], w[1] + 0.3)));

export const Lumbar: React.FC<{
  t: number;
  build?: number;
  lit?: Partial<Record<NK, Win>>;
  dim?: Win; // dim the not-lit nerves in this window
  psoasLit?: Win;
  roots?: Partial<Record<string, Win>>; // highlight root levels (T12, L1..L4)
  tags?: Partial<Record<NK, Win>>;
  extra?: { x: number; y: number; text: string; w: Win; hot?: boolean; anchor?: "start" | "middle" | "end"; size?: number }[];
  regions?: { side?: Win; front?: Win; inner?: Win; crest?: Win; groin?: Win };
  ask?: Win; // obturator drawn as dashed "?" (quick test)
  letters?: number; // show nerve letters at the tags from this time
}> = ({ t, build, lit = {}, dim, psoasLit, roots = {}, tags = {}, extra = [], regions = {}, ask, letters }) => {
  const drawn = (i: number) => (build === undefined ? 1 : ramp(t, build + 0.25 + i * 0.12, build + 0.85 + i * 0.12));
  const base = build === undefined ? 1 : ramp(t, build - 0.1, build + 0.4);
  const dimP = inWin(t, dim);
  const pulse = 0.7 + 0.3 * Math.sin(t * 7);
  const psP = inWin(t, psoasLit);
  const askP = inWin(t, ask);
  const reg = (w?: Win) => inWin(t, w);
  return (
    <svg width={860} height={620} viewBox="0 0 860 620" style={{ display: "block" }}>
      <defs>
        <filter id="gl53" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation={8} /></filter>
        <linearGradient id="bone53" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F3EAD3" />
          <stop offset="0.6" stopColor="#E6D8B6" />
          <stop offset="1" stopColor="#D2C09A" />
        </linearGradient>
        <linearGradient id="vert53" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#D9CBA6" />
          <stop offset="0.45" stopColor="#F6EEDA" />
          <stop offset="1" stopColor="#D2C29C" />
        </linearGradient>
        <linearGradient id="psoas53" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#C2675A" />
          <stop offset="0.5" stopColor="#D98272" />
          <stop offset="1" stopColor="#B65A4D" />
        </linearGradient>
        <linearGradient id="ilia53" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#E7B1A3" />
          <stop offset="1" stopColor="#D99485" />
        </linearGradient>
        <linearGradient id="thigh53" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F2DCCB" />
          <stop offset="1" stopColor="#EBCDB7" />
        </linearGradient>
        <pattern id="fib53" width={10} height={10} patternUnits="userSpaceOnUse" patternTransform="rotate(-62)">
          <line x1={0} y1={5} x2={10} y2={5} stroke="#8F3F35" strokeWidth={1.4} opacity={0.35} />
        </pattern>
        <pattern id="fibI53" width={9} height={9} patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
          <line x1={0} y1={4.5} x2={9} y2={4.5} stroke="#A9564A" strokeWidth={1.2} opacity={0.3} />
        </pattern>
        <clipPath id="clip53"><rect width={860} height={620} /></clipPath>
      </defs>
      <g clipPath="url(#clip53)" opacity={base}>
        {/* thigh (below the inguinal ligament) */}
        <path d="M 60 470 L 104 418 C 250 470 380 500 470 528 L 600 560 L 640 620 L 40 620 Z" fill="url(#thigh53)" />
        {/* thigh regions for the lesson */}
        <path d="M 40 620 L 60 470 L 104 430 C 130 470 150 540 160 620 Z" fill={NCOL.lfc} opacity={0.55 * reg(regions.side)} />
        <path d="M 160 620 C 150 540 140 480 120 440 C 230 478 330 500 420 520 C 420 560 410 590 404 620 Z" fill={NCOL.fe} opacity={0.5 * reg(regions.front)} />
        <path d="M 404 620 C 410 590 420 560 430 524 L 600 560 L 640 620 Z" fill={NCOL.ob} opacity={0.55 * reg(regions.inner)} />
        {/* adductor muscle fibres in the inner thigh */}
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M ${470 + i * 30} ${540 + i * 6} C ${468 + i * 26} 575 ${458 + i * 22} 600 ${452 + i * 20} 625`} stroke="#B8796A" strokeWidth={3} fill="none" opacity={0.35 + 0.4 * reg(regions.inner)} />
        ))}
        {/* hip bone: ilium wing + pubis */}
        <path d="M 600 372 C 560 338 470 300 360 290 C 250 282 140 286 74 318 C 60 352 76 394 104 420 C 150 440 210 446 260 450 C 340 470 410 486 470 498 C 520 508 560 520 600 540 C 615 500 618 430 600 372 Z" fill="url(#bone53)" stroke="#B9A57A" strokeWidth={3} />
        {/* iliac crest highlight */}
        <path d="M 600 372 C 560 338 470 300 360 290 C 250 282 140 286 74 318" fill="none" stroke={C.banana} strokeWidth={12} strokeLinecap="round" opacity={reg(regions.crest)} />
        {/* obturator foramen */}
        <ellipse cx={545} cy={520} rx={34} ry={22} fill="#CDB98F" stroke="#9F8A5E" strokeWidth={3} transform="rotate(-18 545 520)" />
        {/* iliacus (iliac fossa) */}
        <path d="M 560 380 C 520 346 440 318 360 312 C 260 306 160 312 104 336 C 100 370 116 400 150 418 C 230 440 320 452 400 468 C 450 430 520 400 560 380 Z" fill="url(#ilia53)" />
        <path d="M 560 380 C 520 346 440 318 360 312 C 260 306 160 312 104 336 C 100 370 116 400 150 418 C 230 440 320 452 400 468 C 450 430 520 400 560 380 Z" fill="url(#fibI53)" />
        <text x={250} y={402} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={20} fill="#9E5446" opacity={0.75} letterSpacing={2}>ILIACUS</text>
        {/* inguinal ligament ASIS -> pubic tubercle */}
        <path d="M 104 420 C 230 462 360 492 470 520" fill="none" stroke="#F7F1E0" strokeWidth={9} strokeLinecap="round" />
        <path d="M 104 420 C 230 462 360 492 470 520" fill="none" stroke="#B9A57A" strokeWidth={2.5} strokeDasharray="10 7" strokeLinecap="round" />
        <circle cx={104} cy={420} r={9} fill="#E6D8B6" stroke="#9F8A5E" strokeWidth={3} />
        {/* quadratus lumborum hint, ribs */}
        <path d="M 600 60 C 520 60 470 80 430 120 C 410 180 400 240 410 290 L 520 300 Z" fill="#E9C3B5" opacity={0.45} />
        <path d="M 600 40 C 470 40 350 60 240 100" stroke="#D8C8A2" strokeWidth={16} fill="none" strokeLinecap="round" opacity={0.7} />
        {/* vertebral column */}
        {LEVELS.map((L, i) => {
          const r = roots[L.id] === undefined ? 0 : inWin(t, roots[L.id]);
          return (
            <g key={L.id}>
              {/* transverse process */}
              <path d={`M ${SPX - 30} ${L.y - 6} L ${SPX - 76} ${L.y - 12} Q ${SPX - 84} ${L.y} ${SPX - 76} ${L.y + 10} L ${SPX - 30} ${L.y + 8} Z`} fill="#E3D4AE" stroke="#B9A57A" strokeWidth={2.5} />
              <rect x={SPX - 44} y={L.y - BH / 2} width={88} height={BH} rx={12} fill="url(#vert53)" stroke={r > 0 ? mix("#B9A57A", "#1F2A14", r) : "#B9A57A"} strokeWidth={3 + 2 * r} />
              {r > 0 && <rect x={SPX - 44} y={L.y - BH / 2} width={88} height={BH} rx={12} fill={C.banana} opacity={0.75 * r} />}
              <text x={SPX} y={L.y + 9} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill={r > 0.5 ? C.forest : "#9C8A62"}>{L.id}</text>
              {i < LEVELS.length - 1 && <rect x={SPX - 40} y={L.y + BH / 2 + 1} width={80} height={10} rx={5} fill="#CFE0EA" stroke="#A8BFCC" strokeWidth={1.5} />}
            </g>
          );
        })}
        {/* sacrum */}
        <path d={`M ${SPX - 48} 362 L ${SPX + 48} 362 L ${SPX + 30} 470 Q ${SPX} 500 ${SPX - 30} 470 Z`} fill="url(#vert53)" stroke="#B9A57A" strokeWidth={3} />
        <text x={SPX} y={428} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={18} fill="#9C8A62">sacrum</text>
        {/* nerves (drawn under the psoas: they are formed inside it) */}
        {ORDER.map((k, oi) => {
          const n = P[k];
          const k0 = inWin(t, lit[k]);
          const d = drawn(5 - oi);
          if (d <= 0) return null;
          const isAsk = k === "ob" && askP > 0;
          const op = 1 - 0.6 * dimP * (1 - k0);
          const col = isAsk ? mix(NERVE, "#DAD7C3", askP) : mix(NERVE, NCOL[k], k0);
          const w = n.w + 5 * k0;
          return (
            <g key={k} opacity={op}>
              {k0 > 0 && n.d.map((p, i) => <path key={"g" + i} d={p} fill="none" stroke={C.banana} strokeWidth={w + 26} strokeLinecap="round" opacity={0.55 * k0 * pulse} filter="url(#gl53)" />)}
              {n.d.map((p, i) => <path key={"o" + i} d={p} pathLength={1} strokeDasharray={`${d} 1`} fill="none" stroke={isAsk ? "#7D8A72" : mix(NERVE_EDGE, "#3B4A26", k0 * 0.5)} strokeWidth={w + 7} strokeLinecap="round" />)}
              {n.d.map((p, i) => <path key={"f" + i} d={p} pathLength={1} strokeDasharray={isAsk ? "0.03 0.025" : `${d} 1`} fill="none" stroke={col} strokeWidth={w} strokeLinecap="round" />)}
              {!isAsk && n.d.map((p, i) => <path key={"h" + i} d={p} pathLength={1} strokeDasharray={`${d} 1`} fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" opacity={0.55} transform="translate(0 -4)" />)}
            </g>
          );
        })}
        {/* psoas major: semi-transparent over the roots (plexus forms inside it) */}
        <g opacity={0.9}>
          <path d="M 596 52 C 572 110 556 200 540 280 C 524 360 496 430 470 500 C 456 540 440 580 432 620 L 486 620 C 494 580 514 540 534 500 C 566 440 590 380 600 320 C 606 240 606 140 610 56 Z" fill="url(#psoas53)" opacity={0.72} />
          <path d="M 596 52 C 572 110 556 200 540 280 C 524 360 496 430 470 500 C 456 540 440 580 432 620 L 486 620 C 494 580 514 540 534 500 C 566 440 590 380 600 320 C 606 240 606 140 610 56 Z" fill="url(#fib53)" />
          <path d="M 596 52 C 572 110 556 200 540 280 C 524 360 496 430 470 500 C 456 540 440 580 432 620 L 486 620 C 494 580 514 540 534 500 C 566 440 590 380 600 320 C 606 240 606 140 610 56 Z" fill="none" stroke={psP > 0 ? mix("#8F3F35", C.forest, psP) : "#8F3F35"} strokeWidth={3 + 3 * psP} opacity={0.8} />
          {psP > 0 && <path d="M 596 52 C 572 110 556 200 540 280 C 524 360 496 430 470 500 C 456 540 440 580 432 620 L 486 620 C 494 580 514 540 534 500 C 566 440 590 380 600 320 C 606 240 606 140 610 56 Z" fill={C.banana} opacity={0.35 * psP * pulse} />}
        </g>
        {/* genitofemoral runs on the FRONT of psoas: redraw its lower part on top */}
        {(() => {
          const k0 = inWin(t, lit.gf);
          const d = drawn(3);
          if (d < 1) return null;
          const op = 1 - 0.6 * dimP * (1 - k0);
          const seg = "M 540 268 C 528 330 508 400 484 470 C 474 500 470 530 468 560";
          return (
            <g opacity={op}>
              <path d={seg} fill="none" stroke={mix(NERVE_EDGE, "#3B4A26", k0 * 0.5)} strokeWidth={P.gf.w + 5 * k0 + 7} strokeLinecap="round" />
              <path d={seg} fill="none" stroke={mix(NERVE, NCOL.gf, k0)} strokeWidth={P.gf.w + 5 * k0} strokeLinecap="round" />
              <path d={seg} fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" opacity={0.55} transform="translate(0 -4)" />
            </g>
          );
        })()}
        <text x={0} y={0} transform="translate(572 196) rotate(-78)" textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={20} fill="#FFF4EE" opacity={0.9} letterSpacing={2}>PSOAS MAJOR</text>
        {/* thigh word */}
        <text x={300} y={600} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={20} fill="#A9786A" opacity={0.8} letterSpacing={3}>THIGH</text>
        {/* "?" on the obturator in the quick test */}
        {askP > 0 && (
          <g transform={`translate(560 455) scale(${(1 + 0.06 * Math.sin(t * 6)) * askP})`}>
            <circle r={32} fill={C.forest} />
            <text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={C.banana}>?</text>
          </g>
        )}
        {/* nerve name tags */}
        {NERVES.map((n) => {
          const w = tags[n.k];
          if (!w) return null;
          const p = inWin(t, w);
          const hot = inWin(t, lit[n.k]) > 0.5;
          const [x, y] = P[n.k].tag;
          return <Tag key={n.k} x={x} y={y} text={n.name} p={p} hot={hot} anchor={P[n.k].anchor} color={n.color} size={28} />;
        })}
        {/* letters at the nerve ends */}
        {letters !== undefined && NERVES.map((n, i) => {
          const p = ramp(t, letters + i * 0.1, letters + i * 0.1 + 0.25);
          if (p <= 0) return null;
          const at: Record<NK, [number, number]> = { ih: [70, 246], ii: [340, 470], gf: [468, 560], lfc: [118, 560], ob: [530, 600], fe: [326, 560] };
          const [x, y] = at[n.k];
          return (
            <g key={n.k} transform={`translate(${x} ${y}) scale(${p})`}>
              <rect x={-24} y={-26} width={48} height={52} rx={12} fill={n.color} stroke={C.forest} strokeWidth={4} />
              <text y={13} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill={C.forest}>{n.L}</text>
            </g>
          );
        })}
        {extra.map((e, i) => <Tag key={"x" + i} x={e.x} y={e.y} text={e.text} p={inWin(t, e.w)} hot={e.hot} anchor={e.anchor} size={e.size ?? 26} />)}
      </g>
    </svg>
  );
};
