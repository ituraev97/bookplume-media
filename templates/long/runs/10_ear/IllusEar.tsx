import React from "react";
import { C, FONT, ramp } from "./kit";

/* lit: id -> start time, or {a,b} window. A part glows while lit; when anything is lit the rest dims. */
export type Lit = Record<string, number | { a: number; b: number }>;
export const litK = (t: number, v: number | { a: number; b: number } | undefined) => {
  if (v === undefined) return 0;
  if (typeof v === "number") return ramp(t, v - 0.1, v + 0.3);
  return ramp(t, v.a - 0.1, v.a + 0.3) * (1 - ramp(t, v.b - 0.1, v.b + 0.3));
};
const anyLit = (t: number, lit: Lit) => Math.max(0, ...Object.values(lit).map((v) => litK(t, v)));
export const mix = (a: string, b: string, k: number) => {
  const h = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const x = h(a), y = h(b);
  return "#" + x.map((v, i) => Math.round(v + (y[i] - v) * Math.max(0, Math.min(1, k))).toString(16).padStart(2, "0")).join("");
};

/* ---------------- colours ---------------- */
export const AC = {
  skin: "#F2D3B8", skinDark: "#D9A982", cart: "#F8E6D6", bone: "#EDE5C8", boneDot: "#CFC39A", air: "#E3F1F5", drum: "#F4DDB0",
  ossicle: "#FFFDF3", peri: "#BFE3EE", endo: "#F5C766", nerve: "#F2D14E", muscle: "#D9735F", gel: "#DDEBCB", hair: "#E9A23B", oto: "#FFFFFF",
  outer: "#E9A23B", middle: "#5C7A2F", inner: "#3F9BB8",
};

/** shared glow helper: groups map an id to a group id (lit.outer lights every outer-ear part) */
const useGlow = (t: number, lit: Lit, dim: number, groups: Record<string, string> = {}) => {
  const any = anyLit(t, lit) * dim;
  const k = (id: string) => Math.max(litK(t, lit[id]), groups[id] ? litK(t, lit[groups[id]]) : 0);
  const F = (id: string, col: string) => {
    const kk = k(id);
    return { fill: mix(mix(col, "#FFFFFF", any * (1 - kk) * 0.65), "#FFF2A0", kk * 0.3), opacity: 1 - any * (1 - kk) * 0.4 };
  };
  const S = (id: string, w = 2.5) => {
    const kk = k(id);
    return kk > 0 ? { stroke: C.forest, strokeWidth: w + 1.5 * kk } : { stroke: C.forest, strokeWidth: w };
  };
  const Halo: React.FC<{ id: string; children: React.ReactElement<any> }> = ({ id, children }) => {
    const kk = k(id);
    if (kk <= 0) return null;
    return React.cloneElement(children, { fill: "none", stroke: C.banana, strokeWidth: (children.props.strokeWidth || 0) + 14 * kk, strokeOpacity: 0.95 * kk, strokeLinejoin: "round", strokeLinecap: "round" });
  };
  return { any, k, F, S, Halo };
};

/* spiral path (Archimedean), cx,cy, from radius r0 at angle a0 (deg) inward to r1 over `turns` */
const spiral = (cx: number, cy: number, r0: number, r1: number, turns: number, a0 = 180, n = 160) => {
  let d = "";
  for (let i = 0; i <= n; i++) {
    const u = i / n, r = r0 + (r1 - r0) * u, a = ((a0 + 360 * turns * u) * Math.PI) / 180;
    d += `${i ? "L" : "M"}${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)} `;
  }
  return d;
};
const ptOn = (pts: [number, number][], u: number): [number, number] => {
  const L = pts.length - 1, f = Math.max(0, Math.min(0.9999, u)) * L, i = Math.floor(f), r = f - i;
  return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * r, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * r];
};

/* =====================================================================================
   1. EAR OVERVIEW — schematic coronal section of the right ear (viewBox 900 x 700)
   ===================================================================================== */
export const OV_PT: Record<string, [number, number]> = {
  auricle: [92, 250], helix: [70, 170], lobule: [168, 585], canal: [330, 342], cart: [245, 318], bonecanal: [380, 338], drum: [446, 335],
  cavity: [512, 395], malleus: [478, 258], incus: [503, 258], stapes: [532, 330], oval: [552, 326], round: [552, 398], tube: [660, 560],
  vestibule: [604, 322], canals: [612, 150], cochlea: [700, 430], nerve: [850, 338], bone: [800, 130], cerumen: [262, 310], naso: [790, 655],
};
const OVG: Record<string, string> = {
  auricle: "outer", lobule: "outer", canal: "outer", cart: "outer", drum: "outer",
  cavity: "middle", malleus: "middle", incus: "middle", stapes: "middle", tube: "middle",
  vestibule: "inner", canals: "inner", cochlea: "inner", oval: "inner", round: "inner",
};
const SOUND: [number, number][] = [[20, 300], [110, 320], [215, 335], [290, 342], [350, 340], [420, 330], [446, 335], [470, 290], [500, 268], [512, 318], [540, 327], [580, 340], [640, 395], [690, 420], [740, 380], [800, 350], [890, 340]];
export const EarOverview: React.FC<{ t: number; w: number; lit?: Lit; dim?: number; sound?: number; regions?: number; waves?: number }> = ({ t, w, lit = {}, dim = 0.55, sound = 0, regions = 0, waves = 0 }) => {
  const { F, S, Halo, k } = useGlow(t, lit, dim, OVG);
  const h = (w * 700) / 900;
  const canalPath = "M206 336 C 262 310, 300 362, 352 342 S 420 322, 444 334";
  const cartPath = "M206 336 C 236 322, 262 324, 292 340";
  const cochPath = spiral(700, 428, 74, 14, 2.6, 200);
  const tubePath = "M522 432 C 580 480, 680 560, 790 650";
  const vib = sound > 0 && sound < 1 ? Math.sin(t * 40) * 1.6 : 0;
  const [sx, sy] = ptOn(SOUND, sound);
  return (
    <svg width={w} height={h} viewBox="0 0 900 700" style={{ overflow: "visible" }}>
      <defs>
        <pattern id="ovBone" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill={AC.bone} /><circle cx="3" cy="4" r="1.3" fill={AC.boneDot} /><circle cx="10" cy="10" r="1.1" fill={AC.boneDot} /></pattern>
        <linearGradient id="ovSkin" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#F6DCC4" /><stop offset="1" stopColor={AC.skin} /></linearGradient>
      </defs>
      {/* sound waves arriving */}
      {waves > 0 && [0, 1, 2].map((i) => {
        const u = ((t * 0.9 + i / 3) % 1);
        return <path key={i} d={`M${-20 + u * 60} ${250 - 30 * (1 - u)} Q ${10 + u * 60} 320 ${-20 + u * 60} ${390 + 30 * (1 - u)}`} fill="none" stroke={C.matcha} strokeWidth={6} strokeLinecap="round" opacity={waves * Math.sin(u * Math.PI) * 0.8} />;
      })}
      {/* temporal bone */}
      <path d="M262 120 Q 300 96 420 92 L 900 70 L 900 690 L 560 690 Q 360 640 282 500 Q 255 440 258 330 Z" fill="url(#ovBone)" opacity={F("bone", AC.bone).opacity} {...S("bone")} />
      {/* skin / soft tissue of the side of the head */}
      <path d="M198 40 L 262 40 L 262 120 Q 255 220 258 330 Q 255 440 282 500 Q 300 560 300 690 L 198 690 Z" fill="url(#ovSkin)" stroke="none" opacity={0.95} />
      <path d="M198 40 L 198 690" stroke={C.forest} strokeWidth={2.5} />
      {/* auricle */}
      <Halo id="auricle"><path d="M212 110 C 110 70, 36 160, 48 300 C 56 400, 96 470, 118 530 C 128 600, 172 628, 200 596 C 214 576, 206 520, 212 470 Z" strokeWidth={3} /></Halo>
      <path d="M212 110 C 110 70, 36 160, 48 300 C 56 400, 96 470, 118 530 C 128 600, 172 628, 200 596 C 214 576, 206 520, 212 470 Z" {...F("auricle", AC.skin)} {...S("auricle", 3)} />
      {/* elastic cartilage plate inside (not in the lobule) */}
      <path d="M206 132 C 124 102, 70 172, 78 296 C 84 380, 116 440, 140 500 C 156 520, 180 512, 198 480 L 204 360 Z" {...F("cartE", AC.cart)} stroke={C.forest} strokeOpacity={0.45} strokeWidth={2} strokeDasharray="7 6" />
      <path d="M190 150 C 120 130, 92 200, 102 290" fill="none" stroke={C.forest} strokeWidth={3} strokeOpacity={0.55} />
      {/* lobule */}
      <Halo id="lobule"><path d="M120 520 C 128 600, 172 628, 200 596 C 212 578, 206 540, 205 515 C 176 530, 146 534, 120 520 Z" strokeWidth={2} /></Halo>
      <path d="M120 520 C 128 600, 172 628, 200 596 C 212 578, 206 540, 205 515 C 176 530, 146 534, 120 520 Z" {...F("lobule", "#F6C9AE")} stroke={C.forest} strokeOpacity={0.35} strokeWidth={2} />
      {/* concha hollow */}
      <ellipse cx={178} cy={334} rx={34} ry={56} fill={AC.skinDark} opacity={0.55} />
      {/* canal walls: outer third cartilage */}
      <Halo id="cart"><path d={cartPath} strokeWidth={86} /></Halo>
      <path d={cartPath} fill="none" stroke={F("cart", AC.cart).fill} strokeWidth={84} strokeLinecap="round" opacity={F("cart", AC.cart).opacity} />
      <Halo id="bonecanal"><path d="M300 344 C 340 350, 400 322, 444 334" strokeWidth={76} /></Halo>
      {/* canal lumen */}
      <Halo id="canal"><path d={canalPath} strokeWidth={60} /></Halo>
      <path d={canalPath} fill="none" stroke={C.forest} strokeWidth={60} strokeLinecap="round" />
      <path d={canalPath} fill="none" stroke={F("canal", AC.air).fill} strokeWidth={54} strokeLinecap="round" />
      {/* cerumen specks in the outer canal */}
      {[[238, 314], [252, 357], [272, 318], [282, 360]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={7} ry={4} fill="#C98A2E" opacity={0.75 * (1 - 0.6 * (1 - Math.max(k("cerumen"), 0.6)))} />)}
      {/* middle ear cavity */}
      <Halo id="cavity"><path d="M452 290 Q 452 222 500 220 Q 550 220 550 270 L 550 420 Q 524 444 486 432 Q 456 422 452 384 Z" strokeWidth={3} /></Halo>
      <path d="M452 290 Q 452 222 500 220 Q 550 220 550 270 L 550 420 Q 524 444 486 432 Q 456 422 452 384 Z" {...F("cavity", AC.air)} {...S("cavity")} />
      {/* auditory tube */}
      <Halo id="tube"><path d={tubePath} strokeWidth={30} /></Halo>
      <path d={tubePath} fill="none" stroke={C.forest} strokeWidth={30} strokeLinecap="round" />
      <path d={tubePath} fill="none" stroke={F("tube", AC.air).fill} strokeWidth={24} strokeLinecap="round" />
      {/* eardrum */}
      <Halo id="drum"><ellipse cx={446 + vib} cy={335} rx={9} ry={52} transform={`rotate(-14 446 335)`} strokeWidth={3} /></Halo>
      <ellipse cx={446 + vib} cy={335} rx={9} ry={52} transform={`rotate(-14 446 335)`} {...F("drum", AC.drum)} {...S("drum")} />
      {/* ossicles */}
      <g transform={`translate(${vib} 0)`}>
        <Halo id="malleus"><path d="M478 258 L 470 285 L 452 342" strokeWidth={12} /></Halo>
        <path d="M478 258 L 470 285 L 452 342" fill="none" stroke={C.forest} strokeWidth={13} strokeLinecap="round" />
        <path d="M478 258 L 470 285 L 452 342" fill="none" stroke={F("malleus", AC.ossicle).fill} strokeWidth={8} strokeLinecap="round" />
        <circle cx={478} cy={256} r={15} {...F("malleus", AC.ossicle)} {...S("malleus")} />
        {k("malleus") > 0 && <circle cx={478} cy={256} r={22} fill="none" stroke={C.banana} strokeWidth={8 * k("malleus")} />}
        <Halo id="incus"><path d="M504 262 L 512 322" strokeWidth={10} /></Halo>
        <path d="M504 262 L 512 322" fill="none" stroke={C.forest} strokeWidth={11} strokeLinecap="round" />
        <path d="M504 262 L 512 322" fill="none" stroke={F("incus", AC.ossicle).fill} strokeWidth={6} strokeLinecap="round" />
        <ellipse cx={503} cy={257} rx={14} ry={12} {...F("incus", AC.ossicle)} {...S("incus")} />
        {k("incus") > 0 && <ellipse cx={503} cy={257} rx={21} ry={19} fill="none" stroke={C.banana} strokeWidth={8 * k("incus")} />}
        <Halo id="stapes"><path d="M513 326 L 546 316 M513 330 L 546 338" strokeWidth={6} /></Halo>
        <path d="M513 326 Q 528 312 546 314 M513 330 Q 528 344 546 340" fill="none" stroke={C.forest} strokeWidth={4} strokeLinecap="round" />
        <rect x={543} y={311} width={6} height={32} rx={2} {...F("stapes", AC.ossicle)} {...S("stapes", 2)} />
      </g>
      {/* inner ear: semicircular canals, vestibule, cochlea */}
      {[["M590 300 C 540 140, 660 120, 640 300", 0], ["M600 330 C 700 330, 740 210, 640 220", 1], ["M580 320 C 560 250, 660 250, 650 320", 2]].map(([d, i]) => (
        <g key={i as number}>
          <Halo id="canals"><path d={d as string} strokeWidth={22} /></Halo>
          <path d={d as string} fill="none" stroke={C.forest} strokeWidth={22} strokeLinecap="round" />
          <path d={d as string} fill="none" stroke={F("canals", AC.peri).fill} strokeWidth={16} strokeLinecap="round" />
        </g>
      ))}
      <Halo id="cochlea"><path d={cochPath} strokeWidth={24} /></Halo>
      <path d={`M592 352 Q 610 380 640 392 ${cochPath.replace(/^M/, "L")}`} fill="none" stroke={C.forest} strokeWidth={24} strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M592 352 Q 610 380 640 392 ${cochPath.replace(/^M/, "L")}`} fill="none" stroke={F("cochlea", AC.peri).fill} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" />
      <Halo id="vestibule"><ellipse cx={600} cy={326} rx={34} ry={30} strokeWidth={3} /></Halo>
      <ellipse cx={600} cy={326} rx={34} ry={30} {...F("vestibule", AC.peri)} {...S("vestibule")} />
      {/* windows */}
      <ellipse cx={552} cy={326} rx={5} ry={13} fill={k("oval") > 0 ? C.banana : C.forest} />
      <Halo id="round"><circle cx={552} cy={398} r={9} strokeWidth={2} /></Halo>
      <circle cx={552} cy={398} r={9} fill={AC.peri} stroke={C.forest} strokeWidth={2.5} />
      {/* vestibulocochlear nerve */}
      <Halo id="nerve"><path d="M630 318 C 690 320, 730 336, 890 336 M700 428 C 740 410, 760 350, 800 340" strokeWidth={18} /></Halo>
      <path d="M630 318 C 690 320, 730 336, 890 336 M700 428 C 740 410, 760 350, 800 340" fill="none" stroke={C.forest} strokeWidth={18} strokeLinecap="round" />
      <path d="M630 318 C 690 320, 730 336, 890 336 M700 428 C 740 410, 760 350, 800 340" fill="none" stroke={F("nerve", AC.nerve).fill} strokeWidth={12} strokeLinecap="round" />
      {/* nasopharynx hint */}
      <path d="M770 640 Q 800 680 860 670" fill="none" stroke={C.forest} strokeWidth={3} strokeOpacity={0.5} />
      {/* region brackets */}
      {regions > 0 && ([["OUTER", 40, 446, AC.outer, "outer"], ["MIDDLE", 452, 550, AC.middle, "middle"], ["INNER", 556, 790, AC.inner, "inner"]] as [string, number, number, string, string][]).map(([lab, x0, x1, col, id], i) => {
        const p = ramp(regions, i / 3, i / 3 + 0.34);
        const kk = litK(t, lit[id]);
        return (
          <g key={lab} opacity={p}>
            <path d={`M${x0 + 4} 38 L ${x0 + 4} 26 L ${x1 - 4} 26 L ${x1 - 4} 38`} fill="none" stroke={col} strokeWidth={6 + 4 * kk} strokeLinecap="round" />
            <text x={(x0 + x1) / 2} y={14} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={lab === "MIDDLE" ? 22 : 26} fill={col} letterSpacing={2}>{lab}</text>
          </g>
        );
      })}
      {/* travelling sound pulse */}
      {sound > 0 && sound < 1 && (
        <g>
          <circle cx={sx} cy={sy} r={22} fill={C.banana} opacity={0.35} />
          <circle cx={sx} cy={sy} r={11} fill={C.banana} stroke={C.forest} strokeWidth={3} />
        </g>
      )}
    </svg>
  );
};

/* =====================================================================================
   2. OSSICLE CHAIN — zoomed middle ear (viewBox 900 x 700), eardrum left, inner ear right
   ===================================================================================== */
export const OS_PT: Record<string, [number, number]> = {
  drum: [176, 470], umbo: [206, 372], malleus: [298, 170], handle: [252, 300], incus: [398, 176], incusLong: [440, 320], stapes: [570, 372],
  foot: [646, 372], oval: [652, 336], round: [656, 526], tensor: [400, 585], stapedius: [600, 486], tube: [350, 668], vest: [780, 372], recess: [350, 70],
};
export const OssicleChain: React.FC<{ t: number; w: number; lit?: Lit; dim?: number; vib?: number; pull?: number }> = ({ t, w, lit = {}, dim = 0.55, vib = 0, pull = 0 }) => {
  const { F, S, Halo, k } = useGlow(t, lit, dim, { umbo: "drum", handle: "malleus", incusLong: "incus", foot: "stapes" });
  const h = (w * 700) / 900;
  const ph = Math.sin(t * Math.PI * 2 * 2.2) * vib * (1 - 0.7 * pull);
  const dr = 250 + 14 * ph;
  const rot = 3.2 * ph;
  const sx = 7 * ph;
  return (
    <svg width={w} height={h} viewBox="0 0 900 700" style={{ overflow: "visible" }}>
      <defs>
        <pattern id="osBone" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill={AC.bone} /><circle cx="4" cy="4" r="1.5" fill={AC.boneDot} /><circle cx="12" cy="11" r="1.2" fill={AC.boneDot} /></pattern>
        <radialGradient id="osAir" cx="0.45" cy="0.45" r="0.7"><stop offset="0" stopColor="#F3FAFC" /><stop offset="1" stopColor={AC.air} /></radialGradient>
        <radialGradient id="osBoneG" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#EFE8D2" /></radialGradient>
      </defs>
      {/* air space */}
      <rect x={0} y={0} width={900} height={700} fill="url(#osAir)" />
      {/* roof (tegmen) + medial wall with the inner ear */}
      <path d="M0 0 L 900 0 L 900 70 Q 600 100 420 58 Q 250 30 120 70 L 0 90 Z" fill="url(#osBone)" stroke={C.forest} strokeWidth={2.5} />
      <path d="M660 70 L 900 70 L 900 700 L 640 700 Q 668 600 660 460 Q 650 300 660 70 Z" fill="url(#osBone)" stroke={C.forest} strokeWidth={2.5} />
      {/* perilymph space behind the windows (vestibule) */}
      <Halo id="vest"><path d="M676 250 Q 760 220 860 270 L 860 600 Q 760 640 676 590 Q 700 430 676 250 Z" strokeWidth={2} /></Halo>
      <path d="M676 250 Q 760 220 860 270 L 860 600 Q 760 640 676 590 Q 700 430 676 250 Z" {...F("vest", AC.peri)} stroke={C.forest} strokeWidth={2.5} />
      <text x={770} y={210} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.forest} opacity={0.55}>inner ear</text>
      <text x={770} y={440} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={20} fill="#2E7C96" opacity={0.7}>perilymph</text>
      {/* oval window + footplate opening */}
      <Halo id="oval"><ellipse cx={656} cy={372} rx={12} ry={58} strokeWidth={2} /></Halo>
      <ellipse cx={656 - sx * 0.2} cy={372} rx={10} ry={56} fill={AC.peri} stroke={C.forest} strokeWidth={3} />
      {/* round window membrane (bulges opposite to the stapes) */}
      <Halo id="round"><path d={`M660 486 Q ${640 - sx * 2} 526 660 566`} strokeWidth={6} /></Halo>
      <path d={`M660 486 Q ${640 - sx * 2} 526 660 566`} fill={AC.peri} stroke={C.forest} strokeWidth={4} />
      {/* floor + auditory tube opening */}
      <path d="M0 640 Q 200 620 300 650 L 300 700 L 0 700 Z" fill="url(#osBone)" stroke={C.forest} strokeWidth={2.5} />
      <path d="M460 700 Q 470 650 560 640 Q 640 640 660 700 Z" fill="url(#osBone)" stroke={C.forest} strokeWidth={2.5} />
      <Halo id="tube"><path d="M300 650 Q 380 640 460 660 L 460 700 L 300 700 Z" strokeWidth={2} /></Halo>
      <path d="M300 650 Q 380 640 460 660 L 460 700 L 300 700 Z" {...F("tube", "#D2E8EF")} stroke="none" />
      {/* eardrum (cone pointing inward to the umbo) */}
      <path d="M0 100 L 150 100 Q 150 100 150 100 L 150 640 L 0 640 Z" fill={AC.air} opacity={0.6} />
      <Halo id="drum"><path d={`M150 110 Q ${dr} 372 160 640`} strokeWidth={16} /></Halo>
      <path d={`M150 110 Q ${dr} 372 160 640`} fill="none" stroke={C.forest} strokeWidth={18} strokeLinecap="round" />
      <path d={`M150 110 Q ${dr} 372 160 640`} fill="none" stroke={F("drum", AC.drum).fill} strokeWidth={12} strokeLinecap="round" />
      <text x={30} y={380} fontFamily={FONT} fontWeight={800} fontSize={22} fill={C.forest} opacity={0.45}>ear canal</text>
      {/* tensor tympani (from the front wall, tendon to the malleus handle) */}
      <g opacity={F("tensor", AC.muscle).opacity}>
        <Halo id="tensor"><ellipse cx={420} cy={586} rx={128} ry={26} transform="rotate(-8 420 586)" strokeWidth={2} /></Halo>
        <ellipse cx={420} cy={586} rx={128} ry={26} transform="rotate(-8 420 586)" fill={mix(AC.muscle, "#FFFFFF", 0.05)} stroke={C.forest} strokeWidth={2.5} />
        {[-60, -20, 20, 60].map((o) => <line key={o} x1={420 + o - 30} y1={590 - o * 0.14 - 8} x2={420 + o + 30} y2={590 - o * 0.14 - 14} stroke={C.forest} strokeOpacity={0.35} strokeWidth={2} />)}
        <path d={`M300 600 Q 250 470 ${262 - 6 * pull} ${282 + 2 * pull}`} fill="none" stroke={C.forest} strokeWidth={4} strokeDasharray="1 0" />
      </g>
      {/* stapedius (from the pyramid on the back wall, tendon to the stapes neck) */}
      <g opacity={F("stapedius", AC.muscle).opacity}>
        <Halo id="stapedius"><ellipse cx={596} cy={486} rx={54} ry={17} transform="rotate(-30 596 486)" strokeWidth={2} /></Halo>
        <ellipse cx={596} cy={486} rx={54} ry={17} transform="rotate(-30 596 486)" fill={mix(AC.muscle, "#FFFFFF", 0.05)} stroke={C.forest} strokeWidth={2.5} />
        <path d={`M556 504 Q 526 450 ${522 - 3 * pull} 390`} fill="none" stroke={C.forest} strokeWidth={4} />
      </g>
      {/* malleus + incus rock together */}
      <g transform={`rotate(${rot} 340 165)`}>
        {/* malleus: head, neck, handle down the drum to the umbo */}
        <Halo id="malleus"><path d="M298 196 L 282 236 Q 258 300 206 372" strokeWidth={26} /></Halo>
        <path d="M298 196 L 282 236 Q 258 300 206 372" fill="none" stroke={C.forest} strokeWidth={30} strokeLinecap="round" />
        <path d="M298 196 L 282 236 Q 258 300 206 372" fill="none" stroke={F("malleus", AC.ossicle).fill} strokeWidth={23} strokeLinecap="round" />
        <path d="M282 236 L 248 226" fill="none" stroke={C.forest} strokeWidth={18} strokeLinecap="round" />
        <path d="M282 236 L 248 226" fill="none" stroke={F("malleus", AC.ossicle).fill} strokeWidth={12} strokeLinecap="round" />
        <Halo id="malleus"><circle cx={300} cy={160} r={46} strokeWidth={3} /></Halo>
        <circle cx={300} cy={160} r={46} fill={k("malleus") > 0 ? F("malleus", AC.ossicle).fill : "url(#osBoneG)"} opacity={F("malleus", AC.ossicle).opacity} {...S("malleus", 3)} />
        {/* incus: body, short limb back, long limb down */}
        <Halo id="incus"><path d="M410 205 Q 430 280 446 352" strokeWidth={22} /></Halo>
        <path d="M410 205 Q 430 280 446 352" fill="none" stroke={C.forest} strokeWidth={26} strokeLinecap="round" />
        <path d="M410 205 Q 430 280 446 352" fill="none" stroke={F("incus", AC.ossicle).fill} strokeWidth={19} strokeLinecap="round" />
        <path d="M420 150 L 492 118" fill="none" stroke={C.forest} strokeWidth={30} strokeLinecap="round" />
        <path d="M420 150 L 492 118" fill="none" stroke={F("incus", AC.ossicle).fill} strokeWidth={23} strokeLinecap="round" />
        <Halo id="incus"><path d="M352 150 Q 380 112 428 128 Q 452 160 432 200 Q 400 222 360 200 Q 346 178 352 150 Z" strokeWidth={3} /></Halo>
        <path d="M352 150 Q 380 112 428 128 Q 452 160 432 200 Q 400 222 360 200 Q 346 178 352 150 Z" fill={k("incus") > 0 ? F("incus", AC.ossicle).fill : "url(#osBoneG)"} opacity={F("incus", AC.ossicle).opacity} {...S("incus", 3)} />
        <path d="M346 140 Q 352 168 346 196" fill="none" stroke={C.forest} strokeWidth={2.5} strokeOpacity={0.6} />
        <circle cx={450} cy={362} r={13} {...F("incus", AC.ossicle)} {...S("incus", 3)} />
      </g>
      {/* stapes: head, two crura, footplate in the oval window */}
      <g transform={`translate(${sx} 0)`}>
        <Halo id="stapes"><path d="M470 370 L 500 372 Q 560 312 640 326 M500 372 Q 560 432 640 418" strokeWidth={12} /></Halo>
        <path d="M466 368 L 502 372" fill="none" stroke={C.forest} strokeWidth={22} strokeLinecap="round" />
        <path d="M466 368 L 502 372" fill="none" stroke={F("stapes", AC.ossicle).fill} strokeWidth={15} strokeLinecap="round" />
        <path d="M502 372 Q 560 312 640 326 M502 372 Q 560 432 640 418" fill="none" stroke={C.forest} strokeWidth={14} strokeLinecap="round" />
        <path d="M502 372 Q 560 312 640 326 M502 372 Q 560 432 640 418" fill="none" stroke={F("stapes", AC.ossicle).fill} strokeWidth={8} strokeLinecap="round" />
        <rect x={634} y={318} width={18} height={108} rx={6} {...F("stapes", AC.ossicle)} {...S("stapes", 3)} />
      </g>
    </svg>
  );
};

/* =====================================================================================
   3. LABYRINTH — bony (perilymph) vs membranous (endolymph) (viewBox 900 x 700)
   ===================================================================================== */
export const LB_PT: Record<string, [number, number]> = {
  vestibule: [432, 410], utricle: [404, 382], saccule: [470, 458], cochlea: [700, 440], sup: [420, 86], post: [96, 260], lat: [182, 420],
  oval: [420, 496], round: [575, 600], nerve: [820, 190], ampulla: [496, 300], cochduct: [700, 300],
};
const LCAN = ["M372 340 C 300 60, 560 40, 496 318", "M352 372 C 60 380, 70 90, 350 150", "M350 420 C 150 500, 130 330, 340 390"];
export const Labyrinth: React.FC<{ t: number; w: number; lit?: Lit; dim?: number; membr?: number; bony?: number }> = ({ t, w, lit = {}, dim = 0.55, membr = 1, bony = 1 }) => {
  const { F, Halo, k } = useGlow(t, lit, dim, {});
  const h = (w * 700) / 900;
  const coch = spiral(700, 440, 150, 26, 2.45, 180);
  const cochM = spiral(700, 440, 150, 26, 2.45, 180);
  const bk = (id: string) => Math.max(k(id), k("bony"));
  const mk = (id: string) => Math.max(k(id), k("membr"));
  const peri = (id: string) => mix(F(id, AC.peri).fill, "#FFF2A0", bk(id) * 0.3);
  const endo = (id: string) => mix(F(id, AC.endo).fill, "#FFF6C0", mk(id) * 0.35);
  const tube = (d: string, id: string, mid: string, key: number) => (
    <g key={key}>
      {bk(id) > 0 && <path d={d} fill="none" stroke={C.banana} strokeWidth={66 + 10 * bk(id)} strokeLinecap="round" opacity={bk(id)} />}
      <path d={d} fill="none" stroke={C.forest} strokeWidth={56} strokeLinecap="round" opacity={bony} />
      <path d={d} fill="none" stroke={peri(id)} strokeWidth={50} strokeLinecap="round" opacity={bony} />
      <g opacity={membr}>
        {mk(mid) > 0 && <path d={d} fill="none" stroke={C.redLight} strokeWidth={26 + 6 * mk(mid)} strokeLinecap="round" opacity={mk(mid)} />}
        <path d={d} fill="none" stroke="#9A6A1A" strokeWidth={18} strokeLinecap="round" />
        <path d={d} fill="none" stroke={endo(mid)} strokeWidth={13} strokeLinecap="round" />
      </g>
    </g>
  );
  return (
    <svg width={w} height={h} viewBox="0 0 900 700" style={{ overflow: "visible" }}>
      {/* nerve VIII */}
      <Halo id="nerve"><path d="M440 340 C 520 260, 640 200, 890 170 M700 440 C 740 360, 760 260, 800 200" strokeWidth={22} /></Halo>
      <path d="M440 340 C 520 260, 640 200, 890 170 M700 440 C 740 360, 760 260, 800 200" fill="none" stroke={C.forest} strokeWidth={22} strokeLinecap="round" />
      <path d="M440 340 C 520 260, 640 200, 890 170 M700 440 C 740 360, 760 260, 800 200" fill="none" stroke={F("nerve", AC.nerve).fill} strokeWidth={15} strokeLinecap="round" />
      {/* semicircular canals */}
      {LCAN.map((d, i) => tube(d, "canals", "ducts", i))}
      {/* ampullae (bony swellings + membranous) */}
      {([[496, 300], [352, 372], [344, 402]] as [number, number][]).map(([x, y], i) => (
        <g key={i}>
          {Math.max(k("ampulla"), bk("canals")) > 0 && <circle cx={x} cy={y} r={46} fill="none" stroke={C.banana} strokeWidth={12} opacity={Math.max(k("ampulla"), bk("canals"))} />}
          <circle cx={x} cy={y} r={38} fill={peri("canals")} stroke={C.forest} strokeWidth={3} opacity={bony} />
          <circle cx={x} cy={y} r={17} fill={endo("ducts")} stroke="#9A6A1A" strokeWidth={3} opacity={membr} />
        </g>
      ))}
      {/* cochlea */}
      {bk("cochlea") > 0 && <path d={`M520 440 L 550 440 ${coch.replace(/^M/, "L")}`} fill="none" stroke={C.banana} strokeWidth={60 + 10 * bk("cochlea")} strokeLinecap="round" strokeLinejoin="round" opacity={bk("cochlea")} />}
      <path d={`M520 440 L 550 440 ${coch.replace(/^M/, "L")}`} fill="none" stroke={C.forest} strokeWidth={50} strokeLinecap="round" strokeLinejoin="round" opacity={bony} />
      <path d={`M520 440 L 550 440 ${coch.replace(/^M/, "L")}`} fill="none" stroke={peri("cochlea")} strokeWidth={44} strokeLinecap="round" strokeLinejoin="round" opacity={bony} />
      <g opacity={membr}>
        {mk("cochduct") > 0 && <path d={cochM} fill="none" stroke={C.redLight} strokeWidth={24} strokeLinecap="round" opacity={mk("cochduct")} />}
        <path d={cochM} fill="none" stroke="#9A6A1A" strokeWidth={16} strokeLinecap="round" />
        <path d={cochM} fill="none" stroke={endo("cochduct")} strokeWidth={11} strokeLinecap="round" />
      </g>
      {/* vestibule with utricle + saccule */}
      {bk("vestibule") > 0 && <ellipse cx={432} cy={410} rx={128} ry={100} fill="none" stroke={C.banana} strokeWidth={14} opacity={bk("vestibule")} />}
      <ellipse cx={432} cy={410} rx={120} ry={92} fill={peri("vestibule")} stroke={C.forest} strokeWidth={3} opacity={bony} />
      <g opacity={membr}>
        {mk("utricle") > 0 && <ellipse cx={404} cy={382} rx={66} ry={36} fill="none" stroke={C.redLight} strokeWidth={10} opacity={mk("utricle")} />}
        <ellipse cx={404} cy={382} rx={60} ry={30} fill={endo("utricle")} stroke="#9A6A1A" strokeWidth={3} />
        {mk("saccule") > 0 && <circle cx={470} cy={458} r={36} fill="none" stroke={C.redLight} strokeWidth={10} opacity={mk("saccule")} />}
        <circle cx={470} cy={458} r={30} fill={endo("saccule")} stroke="#9A6A1A" strokeWidth={3} />
        <path d="M486 482 Q 520 470 560 446" fill="none" stroke="#9A6A1A" strokeWidth={6} />
      </g>
      {/* windows */}
      <Halo id="oval"><ellipse cx={420} cy={500} rx={44} ry={13} strokeWidth={3} /></Halo>
      <ellipse cx={420} cy={500} rx={44} ry={13} fill={k("oval") > 0 ? C.banana : "#FFFDF3"} stroke={C.forest} strokeWidth={3} opacity={bony} />
      <Halo id="round"><circle cx={575} cy={590} r={22} strokeWidth={3} /></Halo>
      <path d="M552 470 Q 548 540 575 568" fill="none" stroke={C.forest} strokeWidth={24} strokeLinecap="round" opacity={bony} />
      <path d="M552 470 Q 548 540 575 568" fill="none" stroke={peri("cochlea")} strokeWidth={18} strokeLinecap="round" opacity={bony} />
      <circle cx={575} cy={590} r={22} fill={k("round") > 0 ? C.banana : "#FFFDF3"} stroke={C.forest} strokeWidth={3} opacity={bony} />
    </svg>
  );
};

/* =====================================================================================
   4. UNCOILED COCHLEA (viewBox 900 x 520): base on the LEFT (windows), apex on the RIGHT
   ===================================================================================== */
export const UC_PT: Record<string, [number, number]> = {
  sv: [470, 170], duct: [470, 262], st: [470, 372], oval: [96, 170], round: [96, 370], basilar: [470, 304], apex: [840, 270], base: [150, 270], helico: [846, 270],
};
export const Uncoiled: React.FC<{ t: number; w: number; lit?: Lit; dim?: number; wave?: number; place?: number; placeK?: number; grad?: number }> = ({ t, w, lit = {}, dim = 0.55, wave = 0, place = 0.2, placeK = 0, grad = 0 }) => {
  const { F, Halo, k } = useGlow(t, lit, dim, {});
  const h = (w * 520) / 900;
  // pulse position: along top (0..0.5), around the apex, back along the bottom (0.5..1)
  const u = wave;
  const top: [number, number][] = [[120, 170], [820, 170], [856, 270], [820, 372], [120, 372]];
  const [px, py] = ptOn(top, u);
  const bulge = u > 0.82 && u < 1 ? Math.sin(((u - 0.82) / 0.18) * Math.PI) : 0;
  const push = u > 0 && u < 0.12 ? Math.sin((u / 0.12) * Math.PI) : 0;
  // travelling wave on the basilar membrane, peaking at `place` (0 = base, 1 = apex)
  const bm = (x: number) => {
    const xx = (x - 130) / 680;
    const env = Math.exp(-((xx - place) ** 2) / 0.012) * (xx < place ? 0.6 + 0.4 * (xx / Math.max(place, 0.01)) : 1);
    return 304 + placeK * 26 * env * Math.sin(xx * 46 - t * 9);
  };
  let bmPath = "";
  for (let x = 130; x <= 806; x += 6) bmPath += `${x === 130 ? "M" : "L"}${x} ${bm(x).toFixed(1)} `;
  return (
    <svg width={w} height={h} viewBox="0 0 900 520" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="ucGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#3F9BB8" /><stop offset="0.5" stopColor="#8FA86A" /><stop offset="1" stopColor="#E9A23B" /></linearGradient>
      </defs>
      {/* outer bony wall */}
      <path d="M110 110 L 820 110 Q 890 110 890 270 Q 890 432 820 432 L 110 432 Z" fill={AC.bone} stroke={C.forest} strokeWidth={3} />
      {/* scala vestibuli */}
      <Halo id="sv"><path d="M126 124 L 820 124 Q 872 124 874 262 L 820 262 L 820 232 L 126 232 Z" strokeWidth={2} /></Halo>
      <path d="M126 124 L 820 124 Q 872 124 874 262 L 820 262 L 820 232 L 126 232 Z" {...F("sv", AC.peri)} stroke={C.forest} strokeWidth={2.5} />
      {/* scala tympani */}
      <Halo id="st"><path d="M126 312 L 820 312 L 820 280 L 874 280 Q 872 418 820 418 L 126 418 Z" strokeWidth={2} /></Halo>
      <path d="M126 312 L 820 312 L 820 280 L 874 280 Q 872 418 820 418 L 126 418 Z" {...F("st", AC.peri)} stroke={C.forest} strokeWidth={2.5} />
      {/* helicotrema join */}
      <rect x={824} y={258} width={50} height={26} fill={F("sv", AC.peri).fill} />
      {/* cochlear duct (endolymph), blind end before the apex */}
      <Halo id="duct"><path d="M126 232 L 812 232 Q 822 268 812 304 L 126 304 Z" strokeWidth={2} /></Halo>
      <path d="M126 232 L 812 232 Q 822 268 812 304 L 126 304 Z" {...F("duct", AC.endo)} stroke={C.forest} strokeWidth={2.5} />
      {/* organ of Corti bumps on the basilar membrane */}
      {Array.from({ length: 23 }, (_, i) => 150 + i * 28).map((x) => <path key={x} d={`M${x - 9} ${bm(x) - 1} Q ${x} ${bm(x) - 20} ${x + 9} ${bm(x) - 1}`} fill={AC.hair} stroke={C.forest} strokeWidth={1.5} opacity={F("duct", AC.endo).opacity} />)}
      {/* basilar membrane */}
      <Halo id="basilar"><path d={bmPath} strokeWidth={6} /></Halo>
      <path d={bmPath} fill="none" stroke={C.forest} strokeWidth={6} strokeLinecap="round" />
      {k("basilar") > 0 && <path d={bmPath} fill="none" stroke={C.banana} strokeWidth={3} />}
      {/* oval window with the stapes footplate pushing in */}
      <Halo id="oval"><rect x={102} y={136} width={24} height={72} rx={8} strokeWidth={2} /></Halo>
      <rect x={102 + push * 10} y={136} width={24} height={72} rx={8} fill="#FFFDF3" stroke={C.forest} strokeWidth={3} />
      <path d={`M${40 + push * 10} 150 L ${102 + push * 10} 158 M${40 + push * 10} 194 L ${102 + push * 10} 186`} stroke={C.forest} strokeWidth={6} strokeLinecap="round" />
      <text x={20} y={128} fontFamily={FONT} fontWeight={800} fontSize={20} fill={C.forest} opacity={0.55}>stapes</text>
      {/* round window membrane */}
      <Halo id="round"><path d={`M126 330 Q ${110 - bulge * 34} 370 126 410`} strokeWidth={4} /></Halo>
      <path d={`M126 330 Q ${110 - bulge * 34} 370 126 410`} fill={AC.peri} stroke={C.forest} strokeWidth={4} />
      {/* pitch gradient bar */}
      {grad > 0 && (
        <g opacity={grad}>
          <rect x={130} y={456} width={680} height={22} rx={11} fill="url(#ucGrad)" stroke={C.forest} strokeWidth={2} />
          <text x={130} y={510} fontFamily={FONT} fontWeight={800} fontSize={26} fill="#2E7C96">HIGH pitch · base</text>
          <text x={810} y={510} textAnchor="end" fontFamily={FONT} fontWeight={800} fontSize={26} fill="#B77418">apex · LOW pitch</text>
        </g>
      )}
      {/* pulse */}
      {u > 0 && u < 1 && (
        <g>
          <circle cx={px} cy={py} r={24} fill={C.banana} opacity={0.4} />
          <circle cx={px} cy={py} r={12} fill={C.banana} stroke={C.forest} strokeWidth={3} />
          <path d={`M${px + (u < 0.5 ? -40 : 40)} ${py} L ${px + (u < 0.5 ? -20 : 20)} ${py}`} stroke={C.forest} strokeWidth={4} strokeLinecap="round" opacity={0.6} />
        </g>
      )}
    </svg>
  );
};

/* =====================================================================================
   5. ORGAN OF CORTI (viewBox 900 x 600)
   ===================================================================================== */
export const CO_PT: Record<string, [number, number]> = { basilar: [470, 492], outer: [552, 400], inner: [300, 400], stereo: [552, 300], tect: [400, 236], nerve: [190, 560], duct: [760, 120], st: [760, 560] };
export const Corti: React.FC<{ t: number; w: number; lit?: Lit; dim?: number; bend?: number; signal?: number }> = ({ t, w, lit = {}, dim = 0.55, bend = 0, signal = 0 }) => {
  const { F, Halo, k } = useGlow(t, lit, dim, {});
  const h = (w * 600) / 900;
  const osc = Math.sin(t * 7) * bend;
  const lift = -10 * osc;
  const tilt = 16 * osc;
  const cells = [300, 480, 552, 624];
  return (
    <svg width={w} height={h} viewBox="0 0 900 600" style={{ overflow: "visible" }}>
      <rect x={0} y={0} width={900} height={490} fill={mix(AC.endo, "#FFFFFF", 0.62)} />
      <rect x={0} y={490} width={900} height={110} fill={mix(AC.peri, "#FFFFFF", 0.35)} />
      <g transform={`translate(0 ${lift})`}>
        {/* supporting cells */}
        <path d="M120 480 Q 140 420 220 420 L 700 420 Q 780 420 800 480 Z" fill="#F7EBD2" stroke={C.forest} strokeWidth={2} />
        {[400, 440].map((x) => <path key={x} d={`M${x} 480 L ${x + 30} 330 L ${x + 44} 330 L ${x + 20} 480`} fill="#EFDDB8" stroke={C.forest} strokeWidth={2} />)}
        {/* hair cells */}
        {cells.map((x, i) => (
          <g key={x}>
            <Halo id={i === 0 ? "inner" : "outer"}><rect x={x - 26} y={330} width={52} height={i === 0 ? 108 : 96} rx={24} strokeWidth={2} /></Halo>
            <rect x={x - 26} y={330} width={52} height={i === 0 ? 108 : 96} rx={24} {...F(i === 0 ? "inner" : "outer", AC.hair)} stroke={C.forest} strokeWidth={2.5} />
            <circle cx={x} cy={372} r={10} fill={C.forest} opacity={0.5} />
            {/* stereocilia, graded heights */}
            <g transform={`rotate(${tilt} ${x} 330)`}>
              {[-14, 0, 14].map((o, j) => (
                <line key={o} x1={x + o} y1={330} x2={x + o} y2={330 - [22, 34, 46][j]} stroke={k("stereo") > 0 ? C.red : C.forest} strokeWidth={5 + 2 * k("stereo")} strokeLinecap="round" />
              ))}
            </g>
            {/* nerve fibre */}
            <path d={`M${x} ${330 + (i === 0 ? 108 : 96)} Q ${x - 40} 500 ${200 + i * 8} 600`} fill="none" stroke={F("nerve", AC.nerve).fill} strokeWidth={6} />
            {signal > 0 && (() => { const u = (t * 1.6 + i * 0.23) % 1; const yy = 330 + (i === 0 ? 108 : 96) + u * (600 - 438); const xx = x + (200 + i * 8 - x) * u; return <circle cx={xx} cy={yy} r={9} fill={C.banana} stroke={C.forest} strokeWidth={2} opacity={signal} />; })()}
          </g>
        ))}
        {/* basilar membrane */}
        <Halo id="basilar"><rect x={60} y={478} width={780} height={18} rx={9} strokeWidth={2} /></Halo>
        <rect x={60} y={478} width={780} height={18} rx={9} {...F("basilar", "#C9B98A")} stroke={C.forest} strokeWidth={2.5} />
      </g>
      {/* tectorial membrane, anchored on the left */}
      <Halo id="tect"><path d="M40 210 Q 360 200 690 262 Q 700 284 680 288 Q 360 262 40 280 Z" strokeWidth={2} /></Halo>
      <path d="M40 210 Q 360 200 690 262 Q 700 284 680 288 Q 360 262 40 280 Z" {...F("tect", AC.gel)} stroke={C.forest} strokeWidth={2.5} opacity={0.95} />
      <rect x={0} y={190} width={60} height={110} fill={AC.bone} stroke={C.forest} strokeWidth={2.5} />
    </svg>
  );
};

/* =====================================================================================
   6. MACULA (utricle/saccule) and AMPULLA (semicircular canal) — viewBox 600 x 460 each
   ===================================================================================== */
export const Macula: React.FC<{ t: number; w: number; tilt?: number; lit?: Lit; dim?: number }> = ({ t, w, tilt = 0, lit = {}, dim = 0.55 }) => {
  const { F, Halo, k } = useGlow(t, lit, dim, {});
  const h = (w * 460) / 600;
  const sh = 42 * tilt;
  const xs = [110, 190, 270, 350, 430, 510];
  const rng = (i: number) => ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1;
  return (
    <svg width={w} height={h} viewBox="0 0 600 460" style={{ overflow: "visible" }}>
      <rect x={0} y={0} width={600} height={460} rx={0} fill={mix(AC.endo, "#FFFFFF", 0.7)} />
      <rect x={40} y={380} width={520} height={36} rx={10} fill="#F7EBD2" stroke={C.forest} strokeWidth={2.5} />
      {xs.map((x) => (
        <g key={x}>
          <Halo id="hair"><rect x={x - 24} y={290} width={48} height={92} rx={22} strokeWidth={2} /></Halo>
          <rect x={x - 24} y={290} width={48} height={92} rx={22} {...F("hair", AC.hair)} stroke={C.forest} strokeWidth={2.5} />
          <g transform={`rotate(${tilt * 22} ${x} 290)`}>{[-10, 2, 14].map((o, j) => <line key={o} x1={x + o} y1={290} x2={x + o} y2={290 - [26, 38, 52][j]} stroke={C.forest} strokeWidth={5} strokeLinecap="round" />)}</g>
        </g>
      ))}
      <g transform={`translate(${sh} 0)`}>
        <Halo id="gel"><rect x={50} y={190} width={500} height={60} rx={20} strokeWidth={2} /></Halo>
        <rect x={50} y={190} width={500} height={60} rx={20} {...F("gel", AC.gel)} stroke={C.forest} strokeWidth={2.5} opacity={0.92} />
        {Array.from({ length: 34 }, (_, i) => {
          const x = 70 + (i % 17) * 28 + (i >= 17 ? 14 : 0), y = i >= 17 ? 164 : 178, r = rng(i) * 50 - 25;
          return <rect key={i} x={x - 11} y={y - 7} width={22} height={14} rx={3} transform={`rotate(${r} ${x} ${y})`} fill={k("oto") > 0 ? mix(C.banana, "#FFFFFF", 0.4) : AC.oto} stroke={C.forest} strokeWidth={2} />;
        })}
      </g>
    </svg>
  );
};
export const Ampulla: React.FC<{ t: number; w: number; turn?: number; lit?: Lit; dim?: number }> = ({ t, w, turn = 0, lit = {}, dim = 0.55 }) => {
  const { F, Halo } = useGlow(t, lit, dim, {});
  const h = (w * 460) / 600;
  const sk = 26 * turn;
  return (
    <svg width={w} height={h} viewBox="0 0 600 460" style={{ overflow: "visible" }}>
      {/* duct + ampulla swelling */}
      <path d="M20 120 L 180 120 Q 210 120 220 160 Q 250 70 300 70 Q 350 70 380 160 Q 390 120 420 120 L 580 120 L 580 200 L 430 200 Q 420 420 300 420 Q 180 420 170 200 L 20 200 Z" fill={mix(AC.endo, "#FFFFFF", 0.55)} stroke={C.forest} strokeWidth={3} />
      {/* crista with hair cells */}
      <path d="M200 420 Q 300 330 400 420 Z" fill="#F7EBD2" stroke={C.forest} strokeWidth={2.5} />
      {[250, 300, 350].map((x) => (
        <g key={x}>
          <Halo id="hair"><rect x={x - 16} y={348 + Math.abs(x - 300) * 0.5} width={32} height={50} rx={14} strokeWidth={2} /></Halo>
          <rect x={x - 16} y={348 + Math.abs(x - 300) * 0.5} width={32} height={50} rx={14} {...F("hair", AC.hair)} stroke={C.forest} strokeWidth={2} />
        </g>
      ))}
      {/* cupula: gel cap that bends with the fluid */}
      <Halo id="cupula"><path d={`M220 400 Q ${230 + sk} 230 ${300 + sk * 1.6} 120 Q ${370 + sk} 230 380 400 Z`} strokeWidth={2} /></Halo>
      <path d={`M220 400 Q ${230 + sk} 230 ${300 + sk * 1.6} 120 Q ${370 + sk} 230 380 400 Z`} {...F("cupula", AC.gel)} stroke={C.forest} strokeWidth={2.5} opacity={0.85} />
      {/* fluid arrows */}
      {Math.abs(turn) > 0.05 && [60, 480].map((x) => (
        <path key={x} d={`M${x} 160 l ${turn > 0 ? 60 : -60} 0 m ${turn > 0 ? -16 : 16} -12 l ${turn > 0 ? 16 : -16} 12 l ${turn > 0 ? -16 : 16} 12`} fill="none" stroke={C.red} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={Math.min(1, Math.abs(turn) * 2)} />
      ))}
    </svg>
  );
};
