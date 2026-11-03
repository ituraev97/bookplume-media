import React from "react";
import { C, FONT, ramp } from "./kit";

/**
 * Book Plume schematic of BOTH lungs, anterior view (patient's RIGHT lung on the viewer's LEFT). viewBox 860 x 620.
 * Facts (StatPearls "Anatomy, Thorax, Lungs" NBK470197; LibreTexts/Boundless A&P 21.4B "Lobes, Fissures and Lobules";
 *        TeachMeAnatomy "The Tracheobronchial Tree"; Gray 1918 p. 1085 + Fig. 490/961):
 *   right lung: 3 lobes (superior, middle, inferior), 2 fissures (oblique, horizontal); middle lobe between them
 *   left lung: 2 lobes (superior, inferior), 1 oblique fissure; cardiac notch on the anterior border; lingula = tongue of the
 *     left superior lobe below the notch, the counterpart of the right middle lobe
 *   right main bronchus: wider, shorter, more vertical than the left (higher incidence of inhaled foreign bodies)
 */
export type Lobe = "rs" | "rm" | "ri" | "ls" | "li";
export const LCOL: Record<Lobe, string> = { rs: "#7FC3E0", rm: "#F2D14E", ri: "#9CC46A", ls: "#7FC3E0", li: "#9CC46A" };
export const LING = "#B49BE0";
const PINK = "#EDC4BC", PINK_D = "#C98F86", EDGE = "#1F2A14";

const R_OUT = "M 300 70 C 250 75 170 160 130 260 C 95 350 80 460 82 560 C 82 592 112 602 152 594 C 232 577 322 566 382 586 C 402 592 408 570 403 545 C 393 450 396 330 386 230 C 376 150 346 72 300 70 Z";
const L_OUT = "M 560 70 C 610 75 690 160 730 260 C 765 350 780 460 778 560 C 778 592 750 604 705 596 C 640 586 572 594 522 588 C 492 584 486 556 504 540 C 534 514 562 500 567 468 C 572 428 546 400 507 372 C 486 355 478 330 478 300 C 478 230 486 150 520 96 C 532 78 545 70 560 70 Z";
const POLY: Record<Lobe, string> = {
  rs: "0,0 430,0 430,330 141,350 10,150 0,150",
  rm: "141,350 430,330 430,640 317,640",
  ri: "0,150 10,150 141,350 317,640 0,640",
  ls: "430,0 860,0 860,100 610,600 600,640 430,640",
  li: "860,100 610,600 600,640 860,640",
};
/* fissure centre lines (clipped to the lungs) */
const FISS = {
  oblR: "M 40 195 L 317 640",
  hor: "M 141 350 C 230 342 330 334 430 330",
  oblL: "M 830 160 L 610 600",
};
const NOTCH = "M 480 318 C 486 356 520 372 548 400 C 572 426 572 470 562 492 C 552 512 530 524 508 540";
const LINGULA = "M 508 540 C 492 556 494 584 522 588 C 548 592 572 590 590 588 C 588 560 580 528 566 500 C 552 516 528 528 508 540 Z";
const HEART = "M 404 352 C 446 324 528 336 562 382 C 596 428 616 520 604 590 C 562 606 470 610 422 600 C 380 592 360 540 364 480 C 368 420 378 372 404 352 Z";

export const LTAG: Record<string, { x: number; y: number; text: string }> = {
  rs: { x: 250, y: 230, text: "Superior" },
  rm: { x: 318, y: 470, text: "Middle" },
  ri: { x: 168, y: 452, text: "Inferior" },
  ls: { x: 660, y: 230, text: "Superior" },
  li: { x: 700, y: 470, text: "Inferior" },
  oblR: { x: 150, y: 400, text: "Oblique" },
  hor: { x: 280, y: 305, text: "Horizontal" },
  oblL: { x: 690, y: 365, text: "Oblique" },
  notch: { x: 655, y: 440, text: "Cardiac notch" },
  ling: { x: 690, y: 520, text: "Lingula" },
  heart: { x: 470, y: 470, text: "Heart" },
};

const mix = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return "#" + pa.map((v, i) => Math.round(v + (pb[i] - v) * Math.max(0, Math.min(1, k))).toString(16).padStart(2, "0")).join("");
};
type Win = [number, number?];
const winAny = (t: number, w?: Win | Win[]) => {
  if (!w) return 0;
  if (Array.isArray(w[0])) return Math.max(...(w as Win[]).map((x) => win(t, x)));
  return win(t, w as Win);
};
const win = (t: number, w?: Win, fade = 0.25) => {
  if (!w) return 0;
  const on = ramp(t, w[0] - 0.08, w[0] + fade);
  const off = w[1] === undefined ? 0 : ramp(t, w[1], w[1] + 0.3);
  return on * (1 - off);
};

export const Tag: React.FC<{ x: number; y: number; text: string; p: number; hot?: boolean; color?: string; size?: number }> = ({ x, y, text, p, hot, color, size = 30 }) => {
  if (p <= 0) return null;
  const w = text.length * size * 0.6 + (color ? 64 : 34);
  return (
    <g transform={`translate(${x} ${y}) scale(${0.75 + 0.25 * p})`} opacity={Math.min(1, p * 1.4)}>
      <rect x={-w / 2} y={-size * 0.8} width={w} height={size * 1.6} rx={size * 0.5} fill={hot ? C.banana : C.forest} stroke={hot ? C.forest : C.paper} strokeWidth={3} />
      {color && <circle cx={-w / 2 + 26} cy={0} r={11} fill={color} stroke={hot ? C.forest : C.paper} strokeWidth={3} />}
      <text x={color ? 15 : 0} y={size * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={size} fill={hot ? C.forest : C.paper}>{text}</text>
    </g>
  );
};

export type LungsProps = {
  t: number;
  build?: number; // outline draw-on start
  lit?: Partial<Record<Lobe, Win | Win[]>>;
  fiss?: Partial<Record<"oblR" | "hor" | "oblL", Win>>;
  heart?: Win; // heart visible (fills in)
  lean?: Win; // "leans left" arrow
  notch?: Win;
  ling?: Win;
  bronchi?: Win; // highlight right vs left main bronchus
  tags?: Record<string, Win>;
  sides?: Win; // RIGHT / LEFT corner labels
};

export const Lungs: React.FC<LungsProps> = ({ t, build = -10, lit = {}, fiss = {}, heart, lean, notch, ling, bronchi, tags = {}, sides }) => {
  const b = ramp(t, build, build + 1.3);
  const hp = heart ? ramp(t, heart[0], heart[0] + 0.5) : 0;
  const np = win(t, notch), lp = win(t, ling), bp = win(t, bronchi);
  const pulse = 0.5 + 0.5 * Math.sin(t * 7);
  const lobeFill = (id: Lobe) => mix(PINK, LCOL[id], 0.92 * winAny(t, lit[id]));
  const fissP = (id: "oblR" | "hor" | "oblL") => win(t, fiss[id]);
  return (
    <svg width={860} height={620} viewBox="0 0 860 620" style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <clipPath id="lr"><path d={R_OUT} /></clipPath>
        <clipPath id="ll"><path d={L_OUT} /></clipPath>
        <pattern id="lob" width={34} height={30} patternUnits="userSpaceOnUse">
          <path d="M 0 15 L 8 2 L 25 2 L 34 15 L 25 28 L 8 28 Z" fill="none" stroke={PINK_D} strokeWidth={1.4} opacity={0.55} />
          <circle cx={17} cy={15} r={2} fill={PINK_D} opacity={0.35} />
        </pattern>
        <radialGradient id="shade" cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#fff" stopOpacity={0.38} />
          <stop offset="0.6" stopColor="#fff" stopOpacity={0} />
          <stop offset="1" stopColor="#5a2a20" stopOpacity={0.22} />
        </radialGradient>
        <radialGradient id="hrt" cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#E8796B" />
          <stop offset="1" stopColor="#9E3A30" />
        </radialGradient>
        <linearGradient id="trach" x1="0" x2="1">
          <stop offset="0" stopColor="#D9D3B8" />
          <stop offset="0.5" stopColor="#FBF8EA" />
          <stop offset="1" stopColor="#D9D3B8" />
        </linearGradient>
      </defs>

      {/* heart (behind the lungs, shows through the cardiac notch) */}
      <g opacity={0.25 + 0.75 * hp} transform={`translate(${(1 - hp) * -20} 0)`}>
        <path d={HEART} fill="url(#hrt)" stroke={EDGE} strokeWidth={4} opacity={b} />
        <path d="M 430 380 C 470 420 500 500 520 590" fill="none" stroke="#7A2A22" strokeWidth={3} opacity={0.5 * b} />
        <path d="M 470 372 C 520 400 560 470 580 560" fill="none" stroke="#F7C9C0" strokeWidth={3} opacity={0.35 * b} />
      </g>

      {/* lungs */}
      {(["r", "l"] as const).map((side) => {
        const out = side === "r" ? R_OUT : L_OUT;
        const ids: Lobe[] = side === "r" ? ["rs", "rm", "ri"] : ["ls", "li"];
        return (
          <g key={side} opacity={b}>
            <g clipPath={`url(#l${side})`}>
              {ids.map((id) => {
                const k = winAny(t, lit[id]);
                return (
                  <g key={id}>
                    <polygon points={POLY[id]} fill={lobeFill(id)} />
                    <polygon points={POLY[id]} fill="url(#lob)" opacity={1 - 0.5 * k} />
                    {k > 0 && <polygon points={POLY[id]} fill="#fff" opacity={0.12 * k * pulse} />}
                  </g>
                );
              })}
              {side === "l" && lp > 0 && <path d={LINGULA} fill={LING} opacity={0.92 * lp} />}
              <rect width={860} height={640} fill="url(#shade)" />
              {/* faint bronchial tree inside the lung */}
              <g stroke={PINK_D} strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.45}>
                {side === "r" ? (
                  <path d="M 372 262 L 330 300 L 270 250 M 330 300 L 300 380 L 230 430 M 300 380 L 330 470 M 300 380 L 220 520 M 270 250 L 240 170" />
                ) : (
                  <path d="M 540 252 L 590 290 L 640 230 M 590 290 L 620 380 L 690 430 M 620 380 L 600 500 M 640 230 L 620 160 M 620 380 L 700 520" />
                )}
              </g>
              {/* fissures */}
              {(side === "r" ? (["oblR", "hor"] as const) : (["oblL"] as const)).map((f) => {
                const k = fissP(f);
                const len = 600;
                return (
                  <g key={f}>
                    <path d={FISS[f]} fill="none" stroke={EDGE} strokeWidth={5} strokeDasharray={`${len * b} ${len}`} opacity={0.85} />
                    {k > 0 && <path d={FISS[f]} fill="none" stroke={C.banana} strokeWidth={14} strokeLinecap="round" strokeDasharray={`${len * k} ${len}`} opacity={0.95} />}
                    {k > 0 && <path d={FISS[f]} fill="none" stroke={EDGE} strokeWidth={5} strokeDasharray={`${len * k} ${len}`} />}
                  </g>
                );
              })}
            </g>
            <path d={out} fill="none" stroke={EDGE} strokeWidth={6} strokeLinejoin="round" strokeDasharray={`${1500 * b} 1500`} />
          </g>
        );
      })}

      {/* cardiac notch glow */}
      {np > 0 && (
        <g opacity={np}>
          <path d={NOTCH} fill="none" stroke={C.banana} strokeWidth={16 + 4 * pulse} strokeLinecap="round" opacity={0.9} />
          <path d={NOTCH} fill="none" stroke={EDGE} strokeWidth={5} strokeLinecap="round" strokeDasharray="12 10" />
        </g>
      )}
      {lp > 0 && <path d={LINGULA} fill="none" stroke={EDGE} strokeWidth={5} opacity={lp} />}

      {/* trachea + main bronchi */}
      <g opacity={b}>
        <path d="M 412 0 L 448 0 L 448 172 L 412 172 Z" fill="url(#trach)" stroke={EDGE} strokeWidth={4} />
        {[14, 36, 58, 80, 102, 124, 146].map((y) => (
          <path key={y} d={`M 414 ${y} Q 430 ${y + 7} 446 ${y}`} fill="none" stroke="#A9A184" strokeWidth={3} />
        ))}
        {/* right main bronchus: wider, shorter, more vertical */}
        <path d="M 412 166 L 432 178 L 388 270 L 356 256 Z" fill={mix("#E9E3C8", C.banana, bp)} stroke={EDGE} strokeWidth={4} strokeLinejoin="round" />
        {/* left main bronchus: narrower, longer, more horizontal */}
        <path d="M 428 178 L 448 166 L 548 238 L 534 258 Z" fill={mix("#E9E3C8", "#B49BE0", bp)} stroke={EDGE} strokeWidth={4} strokeLinejoin="round" />
      </g>

      {/* "heart leans left" arrow (patient's left = viewer's right) */}
      {lean && win(t, lean) > 0 && (
        <g opacity={win(t, lean)} transform={`translate(${12 * Math.sin(t * 6)} 0)`}>
          <path d="M 430 300 L 560 300" stroke={C.forest} strokeWidth={10} strokeLinecap="round" />
          <path d="M 548 282 L 576 300 L 548 318 Z" fill={C.forest} stroke={C.forest} strokeWidth={6} strokeLinejoin="round" />
        </g>
      )}

      {sides && win(t, sides) > 0 && (
        <g opacity={win(t, sides)} fontFamily={FONT} fontWeight={800}>
          <text x={150} y={58} textAnchor="middle" fontSize={26} fill={C.matcha} letterSpacing={3}>RIGHT LUNG</text>
          <text x={710} y={58} textAnchor="middle" fontSize={26} fill={C.matcha} letterSpacing={3}>LEFT LUNG</text>
        </g>
      )}

      {Object.entries(tags).map(([id, w]) => {
        const p = win(t, w, 0.3);
        const tg = LTAG[id];
        if (!tg || p <= 0) return null;
        const col = (LCOL as Record<string, string>)[id] ?? (id === "ling" ? LING : undefined);
        return <Tag key={id} x={tg.x} y={tg.y} text={tg.text} p={p} color={col} hot={id === "notch" || id === "ling"} size={28} />;
      })}
    </svg>
  );
};
