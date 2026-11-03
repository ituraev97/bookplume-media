import React from "react";
import { C, FONT, ramp } from "./kit";
import { mix, Tag, win, Win } from "./Retro50";

/**
 * Book Plume schematic: middle ear ossicles, coronal (front) view of the RIGHT ear, viewBox 860 x 620.
 * Facts (AnatomyZone "Ossicles of the Middle Ear"; Wikipedia "Ossicles"; Gray 1918 pp. 1044-1046, Figs. 907, 916-919):
 *   chain lateral -> medial: malleus (hammer) -> incus (anvil) -> stapes (stirrup)
 *   manubrium (handle) of the malleus attached to the tympanic membrane along its lateral margin
 *   incus between malleus and stapes; lenticular process articulates with the head of the stapes
 *   base (footplate) of the stapes fixed in the oval window (fenestra vestibuli); stapes = smallest bone in the body
 *   ossicles transmit vibrations from the eardrum to the fluid-filled inner ear
 * Not to scale.
 */
export type Part = "mal" | "inc" | "sta" | "drum" | "oval" | "inner" | "canal";
export const PCOL = { mal: "#E8A93A", inc: "#4FA39A", sta: "#9C7FD8", drum: "#E58B78", inner: "#7FB0D9" };
const EDGE = "#1F2A14";
const BONE = "#EADCC0", BONE_D = "#D6C29C", AIR = "#FBF6EA", SKIN = "#F2CDB8";

/* geometry */
const CANAL = "M -20 268 C 70 262 160 266 236 250 L 262 440 C 170 432 80 424 -20 428 Z";
const DRUM = "M 236 248 Q 270 346 262 442";
const CAVITY = "M 250 118 C 300 92 470 88 548 128 C 566 200 566 420 550 476 C 470 506 330 500 262 452 L 232 250 Z";
const MAL = "M 296 150 C 310 132 342 136 350 156 C 358 178 346 204 330 210 C 324 232 312 300 298 352 C 292 378 284 396 274 404 C 266 404 264 396 266 386 C 276 340 290 270 300 214 C 284 204 282 168 296 150 Z";
const MAL_LAT = "M 304 226 C 292 226 276 232 262 236 C 262 244 272 246 302 242 Z";
const INC = "M 352 150 C 368 140 398 146 410 160 C 424 166 446 164 462 160 C 466 168 456 178 420 186 C 414 196 410 210 404 228 C 398 262 396 296 396 318 C 404 322 410 330 404 338 C 396 342 386 336 386 326 C 384 296 384 256 388 218 C 372 214 352 200 348 182 C 346 168 346 158 352 150 Z";
const STA_HEAD = "M 404 326 C 412 320 426 322 430 330 C 432 340 424 348 412 346 C 404 344 400 334 404 326 Z";
const STA_CR1 = "M 430 330 C 456 296 504 292 530 306";
const STA_CR2 = "M 430 338 C 456 372 504 376 530 362";
const STA_FOOT = "M 526 298 C 534 294 542 296 544 304 L 546 362 C 544 372 534 374 526 370 C 522 346 522 322 526 298 Z";
const OVAL = { x: 548, y: 334 };

export type EarProps = {
  t: number;
  build?: number;
  lit?: Partial<Record<Part, Win>>;
  dimRest?: Win;
  vib?: [number, number]; // vibration demo window
  waveT?: number; // sound waves start
  pulse?: [number, number]; // pulse travelling along the chain
  innerT?: number; // inner ear lights
  tags?: { x: number; y: number; text: string; w: Win; hot?: boolean; color?: string }[];
};

export const Ear: React.FC<EarProps> = ({ t, build = -10, lit = {}, dimRest, vib, waveT, pulse, innerT, tags = [] }) => {
  const b = ramp(t, build, build + 1.0);
  const pz = 0.5 + 0.5 * Math.sin(t * 7);
  const dr = win(t, dimRest);
  const L = (p: Part) => win(t, lit[p]);
  const col = (p: "mal" | "inc" | "sta") => mix(mix(PCOL[p], C.paper, 0.18 + 0.45 * dr), PCOL[p], L(p));
  const vk = vib ? ramp(t, vib[0], vib[0] + 0.4) * (1 - ramp(t, vib[1] - 0.3, vib[1])) : 0;
  const osc = Math.sin(t * 38) * vk;
  const halo = (p: Part, d: React.ReactNode, sw = 12) => {
    const k = L(p);
    if (k <= 0) return null;
    return <g opacity={k} stroke={C.banana} strokeWidth={sw + 4 * pz} fill={C.banana} strokeLinejoin="round" strokeLinecap="round">{d}</g>;
  };
  const inner = innerT === undefined ? L("inner") : Math.max(L("inner"), ramp(t, innerT, innerT + 0.5));
  // pulse travelling along the chain: eardrum -> malleus -> incus -> stapes -> oval window
  const PTS: [number, number][] = [[262, 330], [292, 300], [318, 178], [380, 172], [392, 300], [418, 334], [540, 334], [600, 334]];
  let pDot: [number, number] | null = null;
  if (pulse && t >= pulse[0] && t <= pulse[1] + 0.2) {
    const k = Math.min(1, (t - pulse[0]) / (pulse[1] - pulse[0])) * (PTS.length - 1);
    const i = Math.min(PTS.length - 2, Math.floor(k)), f = k - i;
    pDot = [PTS[i][0] + (PTS[i + 1][0] - PTS[i][0]) * f, PTS[i][1] + (PTS[i + 1][1] - PTS[i][1]) * f];
  }
  const canal = L("canal"), drum = L("drum"), oval = L("oval");
  return (
    <svg width={860} height={620} viewBox="0 0 860 620" style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <pattern id="bonedots" width={18} height={18} patternUnits="userSpaceOnUse">
          <circle cx={4} cy={5} r={2.2} fill={BONE_D} />
          <circle cx={13} cy={13} r={1.6} fill={BONE_D} />
        </pattern>
        <radialGradient id="ossshade" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#fff" stopOpacity={0.55} />
          <stop offset="0.5" stopColor="#fff" stopOpacity={0} />
          <stop offset="1" stopColor="#2a1a08" stopOpacity={0.28} />
        </radialGradient>
        <radialGradient id="airshade" cx="0.5" cy="0.5" r="0.7">
          <stop offset="0" stopColor="#fff" stopOpacity={0.6} />
          <stop offset="1" stopColor={BONE_D} stopOpacity={0.35} />
        </radialGradient>
        <linearGradient id="canalg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity={0.12} />
          <stop offset="0.5" stopColor="#fff" stopOpacity={0.25} />
          <stop offset="1" stopColor="#000" stopOpacity={0.14} />
        </linearGradient>
      </defs>

      {/* temporal bone */}
      <g opacity={b}>
        <rect x={0} y={0} width={860} height={620} fill={BONE} />
        <rect x={0} y={0} width={860} height={620} fill="url(#bonedots)" opacity={0.6} />
        {/* skin of the ear canal + canal */}
        <path d={CANAL} fill={mix(SKIN, C.banana, canal * 0.5)} stroke={EDGE} strokeWidth={4} strokeLinejoin="round" />
        <path d={CANAL} fill="url(#canalg)" />
        {/* middle ear air space */}
        <path d={CAVITY} fill={AIR} stroke={EDGE} strokeWidth={4} strokeLinejoin="round" />
        <path d={CAVITY} fill="url(#airshade)" />
        {/* auditory tube opening */}
        <path d="M 520 470 C 560 500 600 540 640 620 L 690 620 C 650 530 600 470 552 446 Z" fill={AIR} stroke={EDGE} strokeWidth={4} strokeLinejoin="round" />
      </g>

      {/* inner ear: vestibule, semicircular canals, cochlea */}
      <g opacity={b}>
        <g fill="none" stroke={EDGE} strokeLinecap="round">
          <path d="M 610 300 C 580 220 600 120 670 110 C 740 104 760 190 720 260" strokeWidth={30} />
          <path d="M 640 290 C 660 230 720 200 780 214 C 840 230 840 300 790 320 C 740 336 700 320 670 314" strokeWidth={30} />
        </g>
        <g fill="none" stroke={mix(PCOL.inner, C.paper, 0.55 - 0.55 * inner)} strokeLinecap="round">
          <path d="M 610 300 C 580 220 600 120 670 110 C 740 104 760 190 720 260" strokeWidth={21} />
          <path d="M 640 290 C 660 230 720 200 780 214 C 840 230 840 300 790 320 C 740 336 700 320 670 314" strokeWidth={21} />
        </g>
        <ellipse cx={614} cy={336} rx={58} ry={50} fill={mix(PCOL.inner, C.paper, 0.55 - 0.55 * inner)} stroke={EDGE} strokeWidth={4.5} />
        <ellipse cx={600} cy={322} rx={26} ry={16} fill="#fff" opacity={0.35} />
        {/* cochlea spiral */}
        <g transform="translate(690 456)">
          <path d="M -80 -40 C -40 -80 50 -80 82 -20 C 110 40 60 100 0 100 C -60 100 -90 50 -74 4 C -58 -40 0 -50 30 -24 C 60 2 50 52 12 60 C -24 66 -40 34 -26 12 C -14 -6 12 -6 18 12" fill="none" stroke={EDGE} strokeWidth={32} strokeLinecap="round" />
          <path d="M -80 -40 C -40 -80 50 -80 82 -20 C 110 40 60 100 0 100 C -60 100 -90 50 -74 4 C -58 -40 0 -50 30 -24 C 60 2 50 52 12 60 C -24 66 -40 34 -26 12 C -14 -6 12 -6 18 12" fill="none" stroke={mix(PCOL.inner, C.paper, 0.55 - 0.55 * inner)} strokeWidth={23} strokeLinecap="round" />
        </g>
        {inner > 0 && (
          <g opacity={inner * (0.5 + 0.5 * pz)} fill="none" stroke={C.banana} strokeWidth={5}>
            <circle cx={690} cy={456} r={120 + 10 * pz} />
          </g>
        )}
      </g>

      {/* oval window */}
      <g opacity={b}>
        {oval > 0 && <ellipse cx={OVAL.x} cy={OVAL.y} rx={22 + 6 * pz} ry={48 + 6 * pz} fill="none" stroke={C.banana} strokeWidth={10} opacity={oval} />}
        <ellipse cx={OVAL.x} cy={OVAL.y} rx={10} ry={40} fill={mix(PCOL.inner, C.paper, 0.3)} stroke={EDGE} strokeWidth={4} />
      </g>

      {/* sound waves in the canal */}
      {waveT !== undefined && t >= waveT && (
        <g fill="none" stroke={C.matcha} strokeLinecap="round" opacity={vk || ramp(t, waveT, waveT + 0.3)}>
          {[0, 1, 2, 3].map((i) => {
            const ph = ((t - waveT) * 0.9 + i / 4) % 1;
            const x = -10 + ph * 230;
            return <path key={i} d={`M ${x} 300 Q ${x + 22} 348 ${x} 396`} strokeWidth={8} opacity={Math.sin(ph * Math.PI)} />;
          })}
        </g>
      )}

      {/* eardrum */}
      <g opacity={b} transform={`translate(${osc * 5} 0)`}>
        {drum > 0 && <path d={DRUM} fill="none" stroke={C.banana} strokeWidth={22 + 5 * pz} strokeLinecap="round" opacity={drum} />}
        <path d={DRUM} fill="none" stroke={EDGE} strokeWidth={14} strokeLinecap="round" />
        <path d={DRUM} fill="none" stroke={mix(PCOL.drum, C.paper, 0.15)} strokeWidth={8} strokeLinecap="round" />
      </g>

      {/* ossicles (vibrate with the eardrum) */}
      <g opacity={b}>
        <g transform={`translate(${osc * 4.5} 0)`}>
          {halo("mal", <><path d={MAL} /><path d={MAL_LAT} /></>)}
          <path d={MAL_LAT} fill={col("mal")} stroke={EDGE} strokeWidth={3.5} strokeLinejoin="round" />
          <path d={MAL} fill={col("mal")} stroke={EDGE} strokeWidth={4.5} strokeLinejoin="round" />
          <path d={MAL} fill="url(#ossshade)" />
          <path d="M 304 230 C 296 290 286 350 276 392" fill="none" stroke="#fff" strokeOpacity={0.35} strokeWidth={4} strokeLinecap="round" />
        </g>
        <g transform={`translate(${osc * 3.5} 0)`}>
          {halo("inc", <path d={INC} />)}
          <path d={INC} fill={col("inc")} stroke={EDGE} strokeWidth={4.5} strokeLinejoin="round" />
          <path d={INC} fill="url(#ossshade)" />
          {/* incudomalleolar joint line */}
          <path d="M 350 160 C 344 176 346 196 356 206" fill="none" stroke={EDGE} strokeWidth={3} strokeDasharray="6 5" />
        </g>
        <g transform={`translate(${osc * 2.5} 0)`}>
          {halo("sta", <><path d={STA_HEAD} /><path d={STA_CR1} fill="none" /><path d={STA_CR2} fill="none" /><path d={STA_FOOT} /></>, 12)}
          <path d={STA_CR1} fill="none" stroke={EDGE} strokeWidth={14} strokeLinecap="round" />
          <path d={STA_CR2} fill="none" stroke={EDGE} strokeWidth={14} strokeLinecap="round" />
          <path d={STA_CR1} fill="none" stroke={col("sta")} strokeWidth={7} strokeLinecap="round" />
          <path d={STA_CR2} fill="none" stroke={col("sta")} strokeWidth={7} strokeLinecap="round" />
          <path d={STA_HEAD} fill={col("sta")} stroke={EDGE} strokeWidth={4} />
          <path d={STA_FOOT} fill={col("sta")} stroke={EDGE} strokeWidth={4} />
          <path d={STA_FOOT} fill="url(#ossshade)" />
        </g>
        {pDot && (
          <g transform={`translate(${pDot[0]} ${pDot[1]})`}>
            <circle r={26 + 4 * pz} fill={C.banana} opacity={0.45} />
            <circle r={13} fill={C.banana} stroke={EDGE} strokeWidth={4} />
          </g>
        )}
      </g>

      {/* region captions (small, always visible) */}
      <g opacity={b * 0.8} fontFamily={FONT} fontWeight={800} fontSize={20} fill={EDGE} letterSpacing={2}>
        <text x={40} y={240}>OUTER</text>
        <text x={322} y={458}>MIDDLE EAR</text>
        <text x={770} y={604}>INNER</text>
      </g>

      {tags.map((g, i) => <Tag key={i} x={g.x} y={g.y} text={g.text} p={win(t, g.w)} hot={g.hot} color={g.color} size={30} />)}
    </svg>
  );
};

/* tiny icons for the Latin meanings */
export const Icon: React.FC<{ kind: "hammer" | "anvil" | "stirrup"; size?: number; color?: string }> = ({ kind, size = 120, color = C.banana }) => (
  <svg width={size} height={size} viewBox="0 0 120 120">
    {kind === "hammer" && (
      <g stroke={EDGE} strokeWidth={6} strokeLinejoin="round">
        <rect x={52} y={40} width={16} height={72} rx={6} fill={C.paper} />
        <path d="M 24 16 L 92 16 C 102 16 106 24 106 32 L 106 40 L 24 40 C 18 40 14 34 14 28 C 14 22 18 16 24 16 Z" fill={color} />
      </g>
    )}
    {kind === "anvil" && (
      <g stroke={EDGE} strokeWidth={6} strokeLinejoin="round">
        <path d="M 8 30 L 104 30 L 104 44 C 90 48 82 56 80 66 L 80 80 L 40 80 L 40 66 C 36 54 24 46 8 42 Z" fill={color} />
        <path d="M 30 80 L 90 80 L 98 104 L 22 104 Z" fill={C.paper} />
      </g>
    )}
    {kind === "stirrup" && (
      <g stroke={EDGE} strokeLinejoin="round" strokeLinecap="round">
        <rect x={50} y={6} width={20} height={20} rx={6} fill={C.paper} strokeWidth={6} />
        <path d="M 60 26 C 22 38 18 80 22 100 M 60 26 C 98 38 102 80 98 100" fill="none" stroke={EDGE} strokeWidth={16} />
        <path d="M 60 26 C 22 38 18 80 22 100 M 60 26 C 98 38 102 80 98 100" fill="none" stroke={color} strokeWidth={7} />
        <rect x={12} y={96} width={96} height={16} rx={6} fill={color} strokeWidth={6} stroke={EDGE} />
      </g>
    )}
  </svg>
);
