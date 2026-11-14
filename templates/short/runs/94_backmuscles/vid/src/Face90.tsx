import React from "react";
import { C, ramp } from "./kit";

/* Book Plume original schematic: the skull from the FRONT, viewBox 1000 x 1250.
   Layout follows Gray's Anatomy 1918 Fig. 190 (public domain). Patient's right = viewer's left. */

export type FB = "V" | "C" | "N" | "MX" | "MD" | "P" | "Z" | "L";
export const FORDER: FB[] = ["V", "C", "N", "MX", "MD", "P", "Z", "L"];
export const FLETTER: Record<FB, string> = { V: "V", C: "C", N: "N", MX: "M", MD: "M", P: "P", Z: "Z", L: "L" };
export const FWORD: Record<FB, string> = { V: "Virgil", C: "Can", N: "Not", MX: "Make", MD: "My", P: "Pet", Z: "Zebra", L: "Laugh" };
export const FNAME: Record<FB, string> = { V: "Vomer", C: "Inferior nasal conchae", N: "Nasal", MX: "Maxilla", MD: "Mandible", P: "Palatine", Z: "Zygomatic", L: "Lacrimal" };
export const FSHORT: Record<FB, string> = { V: "vomer", C: "inferior nasal\nconcha", N: "nasal", MX: "maxilla", MD: "mandible", P: "palatine\n(hidden: back of\nthe hard palate)", Z: "zygomatic\n(cheekbone)", L: "lacrimal\n(inner orbit wall)" };
export const FCOUNT: Record<FB, 1 | 2> = { V: 1, C: 2, N: 2, MX: 2, MD: 1, P: 2, Z: 2, L: 2 };
export const FCOL: Record<FB, string> = {
  V: "#E8796B",
  C: "#6F9DB3",
  N: "#C98BB9",
  MX: "#8FB55A",
  MD: "#E39A3B",
  P: "#9C7BD0",
  Z: "#F2D14E",
  L: "#3FA89A",
};
/* callout anchors in viewBox units */
export const FANCHOR: Record<FB, [number, number]> = {
  V: [500, 790],
  C: [548, 790],
  N: [515, 575],
  MX: [375, 835],
  MD: [500, 1120],
  P: [470, 912],
  Z: [262, 725],
  L: [580, 600],
};

const mirror = (d: string) => d.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_, x, y) => `${1000 - parseFloat(x)},${y}`);

const SIL = "M500,80 C760,80 885,280 872,520 C868,600 885,640 866,700 C852,760 822,800 800,830 L780,1000 L220,1000 L200,830 C178,800 148,760 134,700 C115,640 132,600 128,520 C115,280 240,80 500,80 Z";
const FRONTAL = "M128,520 C115,280 240,80 500,80 C760,80 885,280 872,520 C840,505 812,500 790,505 C740,470 640,452 570,480 L500,505 L430,480 C360,452 260,470 210,505 C188,500 160,505 128,520 Z";
const MAXILLA = "M298,762 C328,742 348,722 350,700 L418,690 L452,640 L548,640 L582,690 L650,700 C652,722 672,742 702,762 C708,832 692,892 662,932 L338,932 C308,892 292,832 298,762 Z";
const ZYG_R = "M186,612 C176,684 214,766 298,766 C340,766 362,738 352,700 C302,706 252,690 230,616 Z";
const ORBIT_R = "M222,600 C222,520 285,500 338,500 C400,500 446,530 446,605 C446,668 400,700 338,700 C276,700 222,668 222,600 Z";
const LAC_R = "M404,552 L434,560 L440,642 L410,636 Z";
const NASAL = "M468,498 L532,498 L548,640 L500,652 L452,640 Z";
const APERT = "M452,640 C418,702 406,792 438,834 C462,856 538,856 562,834 C594,792 582,702 548,640 C530,654 470,654 452,640 Z";
const CONCHA_R = "M444,756 C466,744 490,764 488,798 C478,816 454,814 444,800 Z";
const VOMER = "M493,706 L507,706 L513,846 L487,846 Z";
const PALATINE = "M410,896 L590,896 L590,926 L410,926 Z";
const MANDIBLE = "M330,1002 L670,1002 C702,1002 722,982 732,952 L792,820 C804,862 804,980 784,1060 C752,1150 652,1186 500,1186 C348,1186 248,1150 216,1060 C196,980 196,862 208,820 L268,952 C278,982 298,1002 330,1002 Z";

export const Face: React.FC<{
  t: number;
  w: number;
  id: string;
  lit?: Partial<Record<FB, number>>; // time at which each bone lights
  hot?: FB[];
  dim?: number; // dims lit bones that are not hot
  open?: number; // jaw opening 0..1
  ghost?: boolean; // show palatine dashed outline even when not lit
}> = ({ t, w, id, lit = {}, hot = [], dim = 0, open = 0, ghost = false }) => {
  const h = (w * 1250) / 1000;
  const BONE = "#ECE5CF";
  const lv = (b: FB) => (lit[b] === undefined ? 0 : ramp(t, lit[b]!, lit[b]! + 0.3));
  const fill = (b: FB) => {
    const k = lv(b);
    if (k <= 0) return BONE;
    return mixHex(BONE, FCOL[b], k * (hot.includes(b) || dim === 0 ? 1 : 1 - 0.55 * dim));
  };
  const pulse = (b: FB) => (hot.includes(b) && lv(b) > 0 ? 6 + 3 * Math.sin(t * 9) : 0);
  const glow = (b: FB, d: string | string[]) => {
    const g = pulse(b);
    if (!g) return null;
    const ds = Array.isArray(d) ? d : [d];
    return ds.map((x, i) => <path key={i} d={x} fill="none" stroke={C.banana} strokeWidth={g * 2.4 + 6} strokeLinejoin="round" opacity={0.85} />);
  };
  const jaw = open * 70;
  const S = { stroke: C.forest, strokeWidth: 6, strokeLinejoin: "round" as const };
  const upperTeeth = Array.from({ length: 10 }, (_, i) => 362 + i * 28);
  const lowerTeeth = Array.from({ length: 10 }, (_, i) => 366 + i * 27.2);
  return (
    <svg width={w} height={h} viewBox="0 0 1000 1250" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <radialGradient id={`sh${id}`} cx="45%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.55} />
          <stop offset="70%" stopColor="#FFFFFF" stopOpacity={0} />
          <stop offset="100%" stopColor="#1F2A14" stopOpacity={0.12} />
        </radialGradient>
        <linearGradient id={`or${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2A2A1E" />
          <stop offset="100%" stopColor="#4A4634" />
        </linearGradient>
        <pattern id={`ht${id}`} width={14} height={14} patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1={0} y1={0} x2={0} y2={14} stroke="#1F2A14" strokeWidth={2} opacity={0.08} />
        </pattern>
      </defs>
      {/* skull silhouette (temporal + sphenoid regions neutral) */}
      <path d={SIL} fill={BONE} {...S} strokeWidth={8} />
      <path d={FRONTAL} fill={BONE} {...S} strokeWidth={4} />
      {/* frontal label hint lines (coronal suture style) */}
      <path d="M210,505 C200,420 220,330 262,250" fill="none" stroke={C.forest} strokeWidth={3} opacity={0.25} strokeDasharray="10 10" />
      <path d="M790,505 C800,420 780,330 738,250" fill="none" stroke={C.forest} strokeWidth={3} opacity={0.25} strokeDasharray="10 10" />
      {/* mouth space (dark, shows when the jaw opens) */}
      <path d="M336,920 L664,920 L676,1080 L324,1080 Z" fill="#3A372A" />
      {/* mandible (moves) */}
      <g transform={`translate(0 ${jaw})`}>
        {glow("MD", MANDIBLE)}
        <path d={MANDIBLE} fill={fill("MD")} {...S} />
        <path d="M500,1110 L500,1180" stroke={C.forest} strokeWidth={3} opacity={0.3} />
        <circle cx={398} cy={1098} r={9} fill={C.forest} opacity={0.55} />
        <circle cx={602} cy={1098} r={9} fill={C.forest} opacity={0.55} />
        {lowerTeeth.map((x, i) => (
          <rect key={i} x={x} y={998} width={23} height={50} rx={9} fill="#FBF8EE" stroke={C.forest} strokeWidth={3.5} />
        ))}
      </g>
      {/* maxilla */}
      {glow("MX", MAXILLA)}
      <path d={MAXILLA} fill={fill("MX")} {...S} />
      <path d="M500,852 L500,932" stroke={C.forest} strokeWidth={3.5} opacity={0.55} />
      <circle cx={392} cy={748} r={10} fill={C.forest} opacity={0.5} />
      <circle cx={608} cy={748} r={10} fill={C.forest} opacity={0.5} />
      {/* palatine: hidden behind, dashed */}
      {(lv("P") > 0 || ghost) && (
        <g opacity={Math.max(lv("P"), ghost ? 0.6 : 0)}>
          {glow("P", PALATINE)}
          <path d={PALATINE} fill={lv("P") > 0 ? fill("P") : "none"} fillOpacity={0.9} stroke={C.forest} strokeWidth={4} strokeDasharray="14 9" />
          <line x1={500} y1={896} x2={500} y2={926} stroke={C.forest} strokeWidth={3} strokeDasharray="6 6" />
        </g>
      )}
      {upperTeeth.map((x, i) => (
        <rect key={i} x={x} y={928} width={24} height={56} rx={9} fill="#FBF8EE" stroke={C.forest} strokeWidth={3.5} />
      ))}
      {/* zygomatic */}
      {glow("Z", [ZYG_R, mirror(ZYG_R)])}
      <path d={ZYG_R} fill={fill("Z")} {...S} />
      <path d={mirror(ZYG_R)} fill={fill("Z")} {...S} />
      {/* orbits */}
      <path d={ORBIT_R} fill={`url(#or${id})`} {...S} />
      <path d={mirror(ORBIT_R)} fill={`url(#or${id})`} {...S} />
      <path d="M262,560 C300,530 360,528 400,548" fill="none" stroke="#6B6650" strokeWidth={5} opacity={0.6} />
      <path d={mirror("M262,560 C300,530 360,528 400,548")} fill="none" stroke="#6B6650" strokeWidth={5} opacity={0.6} />
      <path d="M318,503 C322,492 334,492 338,503" fill="none" stroke={C.forest} strokeWidth={5} />
      <path d={mirror("M318,503 C322,492 334,492 338,503")} fill="none" stroke={C.forest} strokeWidth={5} />
      {/* lacrimal */}
      {glow("L", [LAC_R, mirror(LAC_R)])}
      <path d={LAC_R} fill={lv("L") > 0 ? fill("L") : "#857F66"} {...S} strokeWidth={4} />
      <path d={mirror(LAC_R)} fill={lv("L") > 0 ? fill("L") : "#857F66"} {...S} strokeWidth={4} />
      {/* nasal bones */}
      {glow("N", NASAL)}
      <path d={NASAL} fill={fill("N")} {...S} strokeWidth={5} />
      <line x1={500} y1={498} x2={500} y2={652} stroke={C.forest} strokeWidth={4} />
      {/* nasal aperture */}
      <path d={APERT} fill={`url(#or${id})`} {...S} />
      {/* septum: upper = ethmoid (neutral), lower = vomer */}
      <path d="M494,660 L506,660 L507,706 L493,706 Z" fill="#B9B194" stroke={C.forest} strokeWidth={3} />
      {glow("V", VOMER)}
      <path d={VOMER} fill={lv("V") > 0 ? fill("V") : "#B9B194"} stroke={C.forest} strokeWidth={4} strokeLinejoin="round" />
      <path d="M486,846 L500,826 L514,846 Z" fill={BONE} stroke={C.forest} strokeWidth={3} />
      {/* inferior conchae */}
      {glow("C", [CONCHA_R, mirror(CONCHA_R)])}
      <path d={CONCHA_R} fill={lv("C") > 0 ? fill("C") : "#9A937A"} stroke={C.forest} strokeWidth={4} />
      <path d={mirror(CONCHA_R)} fill={lv("C") > 0 ? fill("C") : "#9A937A"} stroke={C.forest} strokeWidth={4} />
      {/* shading */}
      <path d={SIL} fill={`url(#sh${id})`} />
      <path d={SIL} fill={`url(#ht${id})`} />
    </svg>
  );
};

export function mixHex(a: string, b: string, k: number) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const m = pa.map((v, i) => Math.round(v + (pb[i] - v) * Math.max(0, Math.min(1, k))));
  return `rgb(${m[0]},${m[1]},${m[2]})`;
}
