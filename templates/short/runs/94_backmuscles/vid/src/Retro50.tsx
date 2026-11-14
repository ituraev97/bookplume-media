import React from "react";
import { C, FONT, ramp } from "./kit";

/**
 * Book Plume schematics for "retroperitoneal organs (SAD PUCKER)". viewBox 860 x 620.
 * Facts (TeachMeAnatomy "The Peritoneum"; StatPearls "Anatomy, Abdomen and Pelvis, Retroperitoneum" NBK549857;
 *        Gray 1918 Fig. 531 + Fig. 1039):
 *   retroperitoneal = behind the parietal peritoneum, on the posterior abdominal wall, covered by peritoneum only anteriorly
 *   SAD PUCKER: Suprarenal (adrenal) glands, Aorta/IVC, Duodenum (except the proximal ~2 cm, the duodenal cap),
 *               Pancreas (except the tail), Ureters, Colon (ascending + descending), Kidneys, Esophagus, Rectum
 *   stomach = intraperitoneal (visceral peritoneum all around)
 * Wall diagram = ANTERIOR view: patient's RIGHT on the viewer's LEFT (same as Gray Fig. 531).
 */
export type Org = "adr" | "aorta" | "ivc" | "duo" | "panc" | "ure" | "colon" | "kid" | "eso" | "rect";
export const OCOL: Record<Org, string> = {
  adr: "#E8A93A",
  aorta: "#C9483C",
  ivc: "#5B82BE",
  duo: "#E7B38E",
  panc: "#E9CF6A",
  ure: "#B49BE0",
  colon: "#D9A07C",
  kid: "#B8695A",
  eso: "#D98A86",
  rect: "#C98C74",
};
export const LETTER: Record<Org, string> = { adr: "S", aorta: "A", ivc: "A", duo: "D", panc: "P", ure: "U", colon: "C", kid: "K", eso: "E", rect: "R" };
const EDGE = "#1F2A14";
const WALL = "#EFE4CE", MUSC = "#E2CBB0", MUSC_D = "#C9AA88";

export const mix = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return "#" + pa.map((v, i) => Math.round(v + (pb[i] - v) * Math.max(0, Math.min(1, k))).toString(16).padStart(2, "0")).join("");
};
export type Win = [number, number?];
export const win = (t: number, w?: Win, fade = 0.25) => {
  if (!w) return 0;
  const on = ramp(t, w[0] - 0.08, w[0] + fade);
  const off = w[1] === undefined ? 0 : ramp(t, w[1], w[1] + 0.3);
  return on * (1 - off);
};

export const Tag: React.FC<{ x: number; y: number; text: string; p: number; hot?: boolean; color?: string; size?: number }> = ({ x, y, text, p, hot, color, size = 28 }) => {
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

/* ---------------- posterior abdominal wall ---------------- */
const bean = "M 0 -80 C 40 -80 54 -42 50 -22 C 32 -14 30 12 50 22 C 54 44 40 80 0 80 C -48 80 -54 32 -54 0 C -54 -32 -48 -80 0 -80 Z";
const KR = { x: 245, y: 272 }, KL = { x: 618, y: 242 };
const ADR_R0 = "M 246 186 C 252 160 268 128 286 116 C 304 132 322 160 330 190 C 312 176 290 172 270 176 C 260 178 252 182 246 186 Z";
const ADR_L0 = "M 534 166 C 538 136 562 112 590 116 C 604 118 612 128 606 138 C 586 140 566 156 556 186 C 546 210 534 200 534 166 Z";
const ADR_R = ADR_R0, ADR_L = ADR_L0;
const IVC = "M 384 24 L 416 24 L 418 470 L 452 600 L 428 606 L 400 500 L 370 606 L 346 600 L 382 470 Z";
const AORTA = "M 452 52 L 476 52 L 478 440 L 520 600 L 498 606 L 465 482 L 432 606 L 410 600 L 450 440 Z";
const DUO = "M 396 200 L 332 206 C 306 208 300 228 300 252 L 300 322 C 300 348 316 356 342 356 L 474 356 C 496 356 504 344 504 324 L 504 296";
const DUO_CAP = "M 396 200 L 350 204";
const PANC = "M 334 244 C 334 228 352 224 372 230 C 402 238 432 242 470 238 C 520 232 572 206 620 192 C 646 186 664 198 654 214 C 634 234 582 248 522 260 C 482 268 452 272 424 288 C 404 322 384 338 354 338 C 332 338 326 312 334 244 Z";
const URE_R = "M 293 286 C 322 340 340 420 352 506 C 360 548 372 584 386 616";
const URE_L = "M 568 260 C 540 320 516 420 506 506 C 496 548 486 584 474 616";
const COL_A = "M 136 556 L 136 266 C 136 238 152 226 184 226";
const COL_D = "M 690 166 C 716 166 740 180 740 208 L 740 486";
const ESO = "M 476 -6 L 504 -6 L 520 62 L 492 70 Z";
const RECT = "M 440 530 L 440 640";

export const WALL_BADGE: Record<Org, [number, number][]> = {
  adr: [[252, 166], [622, 150]],
  aorta: [[512, 420]],
  ivc: [[352, 420]],
  duo: [[268, 330]],
  panc: [[620, 214]],
  ure: [[312, 470], [552, 470]],
  colon: [[100, 400], [778, 340]],
  kid: [[KR.x - 10, KR.y], [KL.x + 10, KL.y]],
  eso: [[556, 92]],
  rect: [[496, 566]],
};

export type WallProps = {
  t: number;
  build?: number;
  lit?: Partial<Record<Org, Win>>;
  dimRest?: Win; // dim the organs that are not lit
  badges?: Partial<Record<Org, Win>>;
  xTail?: Win; // pancreas tail exception
  xCap?: Win; // duodenal cap exception
  tags?: { x: number; y: number; text: string; w: Win; hot?: boolean; color?: string }[];
};

export const Wall: React.FC<WallProps> = ({ t, build = -10, lit = {}, dimRest, badges = {}, xTail, xCap, tags = [] }) => {
  const b = ramp(t, build, build + 1.2);
  const pulse = 0.5 + 0.5 * Math.sin(t * 7);
  const dr = win(t, dimRest);
  const L = (o: Org) => win(t, lit[o]);
  const fill = (o: Org) => {
    const k = L(o);
    const base = mix(OCOL[o], C.paper, 0.38 + 0.4 * dr);
    return mix(base, OCOL[o], k);
  };
  const halo = (o: Org, d: React.ReactNode, sw = 14) => {
    const k = L(o);
    if (k <= 0) return null;
    return <g opacity={k} stroke={C.banana} strokeWidth={sw + 4 * pulse} fill="none" strokeLinejoin="round" strokeLinecap="round">{d}</g>;
  };
  const tp = win(t, xTail), cp = win(t, xCap);
  const Xm: React.FC<{ x: number; y: number; p: number }> = ({ x, y, p }) => (
    <g transform={`translate(${x} ${y}) scale(${0.5 + 0.5 * p + 0.25 * Math.sin(p * Math.PI)})`} opacity={p}>
      <circle r={30} fill={C.red} stroke={C.paper} strokeWidth={5} />
      <path d="M -12 -12 L 12 12 M 12 -12 L -12 12" stroke={C.paper} strokeWidth={7} strokeLinecap="round" />
    </g>
  );
  return (
    <svg width={860} height={620} viewBox="0 0 860 620" style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <pattern id="musc" width={14} height={14} patternUnits="userSpaceOnUse" patternTransform="rotate(-12)">
          <line x1={0} y1={0} x2={0} y2={14} stroke={MUSC_D} strokeWidth={1.6} opacity={0.5} />
        </pattern>
        <radialGradient id="kshade" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#fff" stopOpacity={0.45} />
          <stop offset="0.55" stopColor="#fff" stopOpacity={0} />
          <stop offset="1" stopColor="#3a1a10" stopOpacity={0.25} />
        </radialGradient>
        <linearGradient id="tube" x1="0" x2="1">
          <stop offset="0" stopColor="#000" stopOpacity={0.18} />
          <stop offset="0.45" stopColor="#fff" stopOpacity={0.28} />
          <stop offset="1" stopColor="#000" stopOpacity={0.18} />
        </linearGradient>
        <clipPath id="tailclip"><rect x={588} y={150} width={120} height={120} /></clipPath>
      </defs>

      {/* back wall + muscles */}
      <g opacity={b}>
        <rect x={0} y={0} width={860} height={620} fill={WALL} />
        <path d="M 0 40 Q 430 -40 860 40 L 860 0 L 0 0 Z" fill={MUSC} />
        <path d="M 0 40 Q 430 -40 860 40" fill="none" stroke={MUSC_D} strokeWidth={4} />
        {/* quadratus lumborum + psoas */}
        <path d="M 110 120 L 250 110 L 270 520 L 90 540 Z" fill={MUSC} opacity={0.8} />
        <path d="M 750 120 L 610 110 L 590 520 L 770 540 Z" fill={MUSC} opacity={0.8} />
        <path d="M 110 120 L 250 110 L 270 520 L 90 540 Z" fill="url(#musc)" />
        <path d="M 750 120 L 610 110 L 590 520 L 770 540 Z" fill="url(#musc)" />
        <path d="M 372 230 C 352 330 320 460 300 620 L 360 620 C 372 480 386 360 396 240 Z" fill={MUSC_D} opacity={0.55} />
        <path d="M 488 230 C 508 330 540 460 560 620 L 500 620 C 488 480 474 360 464 240 Z" fill={MUSC_D} opacity={0.55} />
        {/* lumbar vertebral bodies */}
        {[150, 220, 290, 360, 430].map((y) => <rect key={y} x={392} y={y} width={76} height={58} rx={14} fill="#F4EEDC" stroke={MUSC_D} strokeWidth={3} />)}
      </g>

      {/* great vessels */}
      <g opacity={b}>
        {halo("ivc", <path d={IVC} />)}
        <path d={IVC} fill={fill("ivc")} stroke={EDGE} strokeWidth={4} strokeLinejoin="round" />
        <path d="M 392 40 L 392 460" stroke="#fff" strokeOpacity={0.3} strokeWidth={6} />
        {halo("aorta", <path d={AORTA} />)}
        <path d={AORTA} fill={fill("aorta")} stroke={EDGE} strokeWidth={4} strokeLinejoin="round" />
        <path d="M 458 60 L 458 430" stroke="#fff" strokeOpacity={0.3} strokeWidth={5} />
        {/* renal vessels */}
        <path d="M 293 272 L 386 252 M 416 246 L 572 242" stroke={mix(OCOL.ivc, C.paper, 0.3)} strokeWidth={10} strokeLinecap="round" />
        <path d="M 293 284 L 452 264 M 476 260 L 570 256" stroke={mix(OCOL.aorta, C.paper, 0.3)} strokeWidth={7} strokeLinecap="round" />
      </g>

      {/* kidneys + adrenals */}
      <g opacity={b}>
        {halo("kid", <><path d={bean} transform={`translate(${KR.x} ${KR.y})`} /><path d={bean} transform={`translate(${KL.x} ${KL.y}) scale(-1 1)`} /></>)}
        {[KR, KL].map((k, i) => (
          <g key={i} transform={`translate(${k.x} ${k.y}) scale(${i ? -1 : 1} 1)`}>
            <path d={bean} fill={fill("kid")} stroke={EDGE} strokeWidth={4.5} />
            <path d={bean} fill="url(#kshade)" />
            <path d="M 20 -40 C -10 -30 -16 30 20 42" fill="none" stroke={EDGE} strokeOpacity={0.25} strokeWidth={4} />
          </g>
        ))}
        {halo("adr", <><path transform="translate(-37 10)" d={ADR_R} /><path transform="translate(36 10)" d={ADR_L} /></>, 12)}
        <path transform="translate(-37 10)" d={ADR_R} fill={fill("adr")} stroke={EDGE} strokeWidth={4} strokeLinejoin="round" />
        <path transform="translate(36 10)" d={ADR_L} fill={fill("adr")} stroke={EDGE} strokeWidth={4} strokeLinejoin="round" />
        {/* ureters */}
        {halo("ure", <><path d={URE_R} /><path d={URE_L} /></>, 16)}
        <path d={URE_R} fill="none" stroke={EDGE} strokeWidth={15} strokeLinecap="round" />
        <path d={URE_L} fill="none" stroke={EDGE} strokeWidth={15} strokeLinecap="round" />
        <path d={URE_R} fill="none" stroke={fill("ure")} strokeWidth={8} strokeLinecap="round" />
        <path d={URE_L} fill="none" stroke={fill("ure")} strokeWidth={8} strokeLinecap="round" />
      </g>

      {/* esophagus (abdominal part, cut end) */}
      <g opacity={b}>
        {halo("eso", <path d={ESO} />)}
        <path d={ESO} fill={fill("eso")} stroke={EDGE} strokeWidth={4} strokeLinejoin="round" />
        <ellipse cx={506} cy={66} rx={16} ry={7} transform="rotate(-15 506 66)" fill={mix(fill("eso"), EDGE, 0.35)} stroke={EDGE} strokeWidth={3} />
      </g>

      {/* duodenum C-loop + pancreas */}
      <g opacity={b}>
        {halo("duo", <path d={DUO} strokeWidth={50} />, 50)}
        <path d={DUO} fill="none" stroke={EDGE} strokeWidth={40} strokeLinecap="round" strokeLinejoin="round" />
        <path d={DUO} fill="none" stroke={fill("duo")} strokeWidth={32} strokeLinecap="round" strokeLinejoin="round" />
        <path d={DUO} fill="none" stroke="url(#tube)" strokeWidth={32} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
        {/* duodenal cap (first part): grey when it is the exception */}
        {cp > 0 && <path d={DUO_CAP} fill="none" stroke={mix(C.line, C.paper, 0.3)} strokeWidth={32} strokeLinecap="round" opacity={cp} />}
        {cp > 0 && <path d={DUO_CAP} fill="none" stroke={C.red} strokeWidth={6} strokeDasharray="10 9" strokeLinecap="round" opacity={cp} transform="translate(0 -22)" />}
        <ellipse cx={398} cy={200} rx={8} ry={17} fill={mix(fill("duo"), EDGE, 0.3)} stroke={EDGE} strokeWidth={3} />
        {halo("panc", <path d={PANC} />)}
        <path d={PANC} fill={fill("panc")} stroke={EDGE} strokeWidth={4} strokeLinejoin="round" />
        {/* lobulation */}
        <g opacity={0.35} fill="none" stroke={EDGE} strokeWidth={2}>
          {[[360, 290], [390, 262], [440, 258], [500, 248], [550, 232], [600, 212]].map(([x, y], i) => <path key={i} d={`M ${x - 10} ${y} q 10 -9 20 0`} />)}
        </g>
        {tp > 0 && (
          <g clipPath="url(#tailclip)" opacity={tp}>
            <path d={PANC} fill={mix(C.line, C.paper, 0.3)} />
            <path d={PANC} fill="none" stroke={C.red} strokeWidth={6} strokeDasharray="10 9" />
          </g>
        )}
      </g>

      {/* colon */}
      <g opacity={b}>
        {halo("colon", <><path d={COL_A} strokeWidth={60} /><path d={COL_D} strokeWidth={56} /></>, 60)}
        {[[COL_A, 52], [COL_D, 46]].map(([d, w], i) => (
          <g key={i}>
            <path d={d as string} fill="none" stroke={EDGE} strokeWidth={(w as number) + 8} strokeLinecap="round" strokeLinejoin="round" />
            <path d={d as string} fill="none" stroke={fill("colon")} strokeWidth={w as number} strokeLinecap="round" strokeLinejoin="round" />
            <path d={d as string} fill="none" stroke={EDGE} strokeOpacity={0.28} strokeWidth={(w as number) - 4} strokeDasharray="3 30" />
          </g>
        ))}
        {/* rectum */}
        {halo("rect", <path d={RECT} strokeWidth={56} />, 56)}
        <path d={RECT} fill="none" stroke={EDGE} strokeWidth={54} strokeLinecap="round" />
        <path d={RECT} fill="none" stroke={fill("rect")} strokeWidth={46} strokeLinecap="round" />
        <path d="M 440 540 L 440 620" stroke="#fff" strokeOpacity={0.25} strokeWidth={10} />
      </g>

      {/* exception marks */}
      {tp > 0 && <Xm x={640} y={176} p={tp} />}
      {cp > 0 && <Xm x={360} y={160} p={cp} />}

      {/* letter badges */}
      {(Object.keys(badges) as Org[]).map((o) => {
        const p = win(t, badges[o], 0.22);
        if (p <= 0) return null;
        return WALL_BADGE[o].map(([x, y], i) => (
          <g key={o + i} transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * p + 0.25 * Math.sin(p * Math.PI)})`} opacity={Math.min(1, p * 1.5)}>
            <circle r={27} fill={C.banana} stroke={C.forest} strokeWidth={5} />
            <text y={12} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={C.forest}>{LETTER[o]}</text>
          </g>
        ));
      })}
      {tags.map((g, i) => <Tag key={i} x={g.x} y={g.y} text={g.text} p={win(t, g.w, 0.3)} hot={g.hot} color={g.color} />)}
    </svg>
  );
};

/* ---------------- horizontal section: what "retro-peritoneal" means ---------------- */
/* front (anterior) at the top, back at the bottom */
const PERIT = "M 430 352 C 520 354 566 372 624 366 C 704 360 766 330 780 278 C 794 176 642 72 430 72 C 218 72 66 176 80 278 C 94 330 156 360 236 366 C 294 372 340 354 430 352 Z";
const FRONT_R = "M 150 352 C 200 366 270 372 340 358";
const FRONT_L = "M 520 358 C 590 372 660 366 710 352";

export type SecProps = {
  t: number;
  build?: number;
  perit?: Win; // peritoneum draws on
  lining?: Win; // pulse along the lining
  cavity?: Win; // label the cavity
  back?: Win; // shade the retroperitoneal space
  organs?: Win; // light kidneys, aorta, IVC
  front?: Win; // glow: covered only in front
  tags?: { x: number; y: number; text: string; w: Win; hot?: boolean; color?: string }[];
};

export const Section: React.FC<SecProps> = ({ t, build = -10, perit, lining, back, organs, front, tags = [] }) => {
  const b = ramp(t, build, build + 1.0);
  const pp = perit ? ramp(t, perit[0], perit[0] + 0.9) : 0;
  const lp = win(t, lining), bp = win(t, back), op = win(t, organs), fp = win(t, front);
  const pulse = 0.5 + 0.5 * Math.sin(t * 7);
  const kc = mix(mix(OCOL.kid, C.paper, 0.35), OCOL.kid, op);
  return (
    <svg width={860} height={620} viewBox="0 0 860 620" style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <clipPath id="bodyclip"><ellipse cx={430} cy={318} rx={404} ry={282} /></clipPath>
        <radialGradient id="ks2" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#fff" stopOpacity={0.45} />
          <stop offset="1" stopColor="#3a1a10" stopOpacity={0.2} />
        </radialGradient>
      </defs>
      <g opacity={b}>
        <ellipse cx={430} cy={318} rx={404} ry={282} fill="#EAD8BE" stroke={EDGE} strokeWidth={5} />
        <ellipse cx={430} cy={318} rx={372} ry={252} fill={MUSC} />
        {/* back muscles */}
        <g clipPath="url(#bodyclip)">
          <path d="M 250 600 C 270 520 330 480 390 486 L 390 620 Z M 610 600 C 590 520 530 480 470 486 L 470 620 Z" fill={MUSC_D} opacity={0.6} />
        </g>
        {/* retroperitoneal space (behind the peritoneum) */}
        <path d={`${PERIT}`} fill="#FBF7EA" />
        <path d="M 80 278 C 94 330 156 360 236 366 C 294 372 340 354 430 352 C 520 354 566 372 624 366 C 704 360 766 330 780 278 C 790 360 720 470 600 520 C 520 552 340 552 260 520 C 140 470 70 360 80 278 Z" fill={mix(MUSC, C.banana, 0.7 * bp)} opacity={0.9} />
        {/* vertebra */}
        <circle cx={430} cy={468} r={58} fill="#F4EEDC" stroke={EDGE} strokeWidth={4} />
        <path d="M 412 520 L 420 586 L 440 586 L 448 520 Z M 372 492 L 316 520 L 322 534 L 384 512 Z M 488 492 L 544 520 L 538 534 L 476 512 Z" fill="#F4EEDC" stroke={EDGE} strokeWidth={4} strokeLinejoin="round" />
        {/* kidneys, aorta, IVC (behind the peritoneum) */}
        <g transform="translate(250 440) rotate(-32)">
          <ellipse rx={52} ry={74} fill={kc} stroke={EDGE} strokeWidth={4.5} />
          <ellipse rx={52} ry={74} fill="url(#ks2)" />
        </g>
        <g transform="translate(610 440) rotate(32)">
          <ellipse rx={52} ry={74} fill={kc} stroke={EDGE} strokeWidth={4.5} />
          <ellipse rx={52} ry={74} fill="url(#ks2)" />
        </g>
        <circle cx={470} cy={386} r={21} fill={mix(mix(OCOL.aorta, C.paper, 0.35), OCOL.aorta, op)} stroke={EDGE} strokeWidth={4} />
        <ellipse cx={388} cy={388} rx={28} ry={20} fill={mix(mix(OCOL.ivc, C.paper, 0.35), OCOL.ivc, op)} stroke={EDGE} strokeWidth={4} />
        {/* an intraperitoneal loop of gut on a mesentery */}
        <path d="M 422 352 C 420 300 424 270 426 246 M 438 352 C 440 300 436 270 434 246" fill="none" stroke={C.red} strokeWidth={3.5} opacity={0.4 + 0.6 * pp} />
        <ellipse cx={430} cy={196} rx={92} ry={56} fill="#E7B38E" stroke={EDGE} strokeWidth={4} />
        <ellipse cx={430} cy={196} rx={56} ry={24} fill="#C98C74" opacity={0.55} />
        <ellipse cx={430} cy={196} rx={100} ry={63} fill="none" stroke={C.red} strokeWidth={4} opacity={0.4 + 0.6 * pp} />
      </g>
      {/* parietal peritoneum lining the cavity */}
      {perit && (
        <g>
          <path d={PERIT} fill="none" stroke={C.red} strokeWidth={7} strokeDasharray={`${2000 * pp} 2400`} strokeLinejoin="round" />
          {lp > 0 && <path d={PERIT} fill="none" stroke={C.red} strokeWidth={7 + 8 * pulse} opacity={0.35 * lp} />}
        </g>
      )}
      {fp > 0 && (
        <g opacity={fp}>
          {[FRONT_R, FRONT_L].map((d) => (
            <g key={d}>
              <path d={d} fill="none" stroke={C.banana} strokeWidth={20 + 6 * pulse} strokeLinecap="round" />
              <path d={d} fill="none" stroke={C.red} strokeWidth={7} strokeLinecap="round" />
            </g>
          ))}
          {[[245, 300], [615, 300]].map(([x, y]) => (
            <g key={x} transform={`translate(${x} ${y + 8 * Math.sin(t * 6)})`}>
              <path d="M 0 -34 L 0 18" stroke={C.forest} strokeWidth={8} strokeLinecap="round" />
              <path d="M -16 6 L 0 26 L 16 6" fill="none" stroke={C.forest} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          ))}
        </g>
      )}
      <g opacity={b} fontFamily={FONT} fontWeight={800} fontSize={24} letterSpacing={4} fill={C.matcha}>
        <text x={430} y={22} textAnchor="middle">FRONT</text>
        <text x={430} y={614} textAnchor="middle">BACK</text>
      </g>
      {tags.map((g, i) => <Tag key={i} x={g.x} y={g.y} text={g.text} p={win(t, g.w, 0.3)} hot={g.hot} color={g.color} />)}
    </svg>
  );
};
