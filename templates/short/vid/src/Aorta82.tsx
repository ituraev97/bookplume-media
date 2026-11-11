import React from "react";
import { C, FONT, ramp } from "./kit";

/**
 * Our own diagram (Book Plume): abdominal aorta, front view, with the vertebral levels T11–L5 behind it.
 * Native size 860 x 1000. Patient's left = viewer's right (aorta sits slightly to the patient's left).
 */
export type B = "CT" | "SMA" | "REN" | "IMA" | "BIF";
export const BR: B[] = ["CT", "SMA", "REN", "IMA", "BIF"];
export type Lv = "T11" | "T12" | "L1" | "L2" | "L3" | "L4" | "L5";
export const LVS: Lv[] = ["T11", "T12", "L1", "L2", "L3", "L4", "L5"];
export const LY: Record<Lv, number> = { T11: 40, T12: 150, L1: 260, L2: 370, L3: 480, L4: 590, L5: 700 };
export const BNAME: Record<B, string> = { CT: "Celiac trunk", SMA: "Sup. mesenteric a.", REN: "Renal arteries", IMA: "Inf. mesenteric a.", BIF: "Common iliacs" };
export const BLEVEL: Record<B, string> = { CT: "T12", SMA: "L1", REN: "L1–L2", IMA: "L3", BIF: "L4" };
export const BCOL: Record<B, string> = { CT: "#C9483C", SMA: "#D9662F", REN: "#B03A6A", IMA: "#7A4BB0", BIF: "#2F7466" };
export const ANCHOR: Record<B | "AO", [number, number]> = {
  CT: [528, 150],
  SMA: [424, 430],
  REN: [612, 314],
  IMA: [566, 600],
  BIF: [455, 606],
  AO: [455, 80],
};

const X = 455; // aorta centre line
const AO_TOP = -30, AO_END = 600;
const VESSEL: Record<B, { d: string; w: number }[]> = {
  CT: [
    { d: `M ${X + 4} 172 C ${X + 30} 160 ${X + 60} 150 ${X + 78} 140`, w: 30 },
    { d: `M ${X + 78} 140 C ${X + 20} 110 ${X - 120} 100 ${X - 230} 112`, w: 18 }, // common hepatic → liver
    { d: `M ${X + 78} 140 C ${X + 140} 160 ${X + 190} 120 ${X + 250} 140 S ${X + 310} 150 ${X + 330} 132`, w: 18 }, // splenic
    { d: `M ${X + 78} 140 C ${X + 80} 110 ${X + 70} 80 ${X + 86} 50`, w: 13 }, // left gastric
  ],
  SMA: [
    { d: `M ${X - 2} 262 C ${X - 18} 330 ${X - 30} 420 ${X - 80} 560`, w: 26 },
    { d: `M ${X - 22} 380 C ${X + 40} 380 ${X + 90} 400 ${X + 130} 430`, w: 11 },
    { d: `M ${X - 30} 430 C ${X + 30} 440 ${X + 80} 470 ${X + 115} 505`, w: 11 },
    { d: `M ${X - 26} 400 C ${X - 80} 396 ${X - 120} 400 ${X - 160} 420`, w: 11 },
    { d: `M ${X - 54} 500 C ${X - 100} 506 ${X - 140} 520 ${X - 170} 548`, w: 10 },
  ],
  REN: [
    { d: `M ${X - 20} 318 C ${X - 80} 322 ${X - 140} 332 ${X - 205} 342`, w: 24 },
    { d: `M ${X + 20} 314 C ${X + 80} 310 ${X + 140} 310 ${X + 188} 314`, w: 24 },
  ],
  IMA: [
    { d: `M ${X + 10} 488 C ${X + 70} 520 ${X + 110} 570 ${X + 128} 650`, w: 20 },
    { d: `M ${X + 90} 548 C ${X + 140} 540 ${X + 190} 530 ${X + 236} 520`, w: 11 },
    { d: `M ${X + 118} 610 C ${X + 170} 630 ${X + 210} 660 ${X + 230} 700`, w: 10 },
    { d: `M ${X + 128} 650 C ${X + 120} 720 ${X + 90} 790 ${X + 60} 860`, w: 11 },
  ],
  BIF: [
    { d: `M ${X} ${AO_END - 20} C ${X - 20} 680 ${X - 90} 770 ${X - 150} 940`, w: 52 },
    { d: `M ${X} ${AO_END - 20} C ${X + 20} 680 ${X + 90} 770 ${X + 150} 940`, w: 52 },
  ],
};

const Kidney: React.FC<{ cx: number; cy: number; flip?: boolean; on: number }> = ({ cx, cy, flip, on }) => (
  <g transform={`translate(${cx} ${cy}) scale(${flip ? -0.88 : 0.88} 0.88)`}>
    <path d="M 10 -118 C 80 -120 96 -40 90 10 C 84 80 50 124 0 118 C -40 112 -60 80 -50 40 C -44 18 -30 10 -30 -2 C -30 -14 -46 -22 -52 -46 C -62 -90 -36 -116 10 -118 Z" fill="#C98A7A" stroke={C.forest} strokeWidth={5} />
    <path d="M 10 -118 C 80 -120 96 -40 90 10 C 84 80 50 124 0 118 C -40 112 -60 80 -50 40 C -44 18 -30 10 -30 -2 C -30 -14 -46 -22 -52 -46 C -62 -90 -36 -116 10 -118 Z" fill={BCOL.REN} opacity={0.55 * on} />
    <path d="M 40 -90 C 70 -60 74 20 50 70" fill="none" stroke="#FFF2E6" strokeWidth={6} opacity={0.5} strokeLinecap="round" />
  </g>
);

export const AortaDiagram: React.FC<{
  t: number;
  w: number;
  id: string;
  lit?: Partial<Record<B, number>>;
  hot?: B[];
  hide?: B[];
  lv?: Partial<Record<Lv, number>>;
  q?: number; // red "?" at L3
  gut?: number; // lower-gut outline for the IMA answer
  ruler?: boolean;
}> = ({ t, w, id, lit = {}, hot = [], hide = [], lv = {}, q = 0, gut = 0, ruler = true }) => {
  const k = w / 860;
  const on = (b: B) => (lit[b] === undefined ? 0 : ramp(t, lit[b]! - 0.05, lit[b]! + 0.25));
  const pulse = 0.55 + 0.45 * Math.sin(t * 9);
  const lvOn = (l: Lv) => (lv[l] === undefined ? 0 : ramp(t, lv[l]! - 0.05, lv[l]! + 0.2));
  const show = (b: B) => !hide.includes(b);
  const vesselLayer = (b: B, layer: "out" | "fill" | "hi") => {
    const o = on(b);
    const col = o > 0 ? BCOL[b] : "#D9A79F";
    return VESSEL[b].map((v, i) => {
      if (layer === "out") return <path key={i} d={v.d} fill="none" stroke={C.forest} strokeWidth={v.w + 10} strokeLinecap="round" strokeLinejoin="round" />;
      if (layer === "fill")
        return (
          <g key={i}>
            <path d={v.d} fill="none" stroke="#D9A79F" strokeWidth={v.w} strokeLinecap="round" strokeLinejoin="round" />
            <path d={v.d} fill="none" stroke={col} strokeWidth={v.w} strokeLinecap="round" strokeLinejoin="round" opacity={o} />
          </g>
        );
      return <path key={i} d={v.d} fill="none" stroke="#FFF6EE" strokeWidth={Math.max(2.5, v.w * 0.18)} strokeLinecap="round" opacity={0.55} transform={`translate(${-v.w * 0.18} ${-v.w * 0.12})`} />;
    });
  };
  const glow = (b: B) =>
    hot.includes(b) && show(b)
      ? VESSEL[b].map((v, i) => <path key={i} d={v.d} fill="none" stroke={C.banana} strokeWidth={v.w + 34} strokeLinecap="round" strokeLinejoin="round" opacity={0.85 * pulse} />)
      : null;
  // order: iliacs (behind aorta), aorta, then front branches
  const back: B[] = ["BIF"];
  const front: B[] = ["REN", "CT", "IMA", "SMA"];
  const aoHot = hot.length === 0 ? 0 : 0;
  return (
    <svg width={860 * k} height={1000 * k} viewBox="0 0 860 1000" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={`ao-${id}`} gradientUnits="userSpaceOnUse" x1={X - 36} x2={X + 36} y1={0} y2={0}>
          <stop offset="0" stopColor="#9E3229" />
          <stop offset="0.35" stopColor="#D95A4C" />
          <stop offset="0.6" stopColor="#C9483C" />
          <stop offset="1" stopColor="#8F2A22" />
        </linearGradient>
        <linearGradient id={`bone-${id}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#E3D7B8" />
          <stop offset="0.5" stopColor="#F6EFDC" />
          <stop offset="1" stopColor="#E0D3B2" />
        </linearGradient>
      </defs>
      {/* diaphragm dome + aortic hiatus */}
      <path d="M 40 210 C 140 40 330 20 430 60 C 530 20 720 40 820 210" fill="none" stroke="#B9D27A" strokeWidth={28} strokeLinecap="round" opacity={0.55} />
      <path d="M 40 210 C 140 40 330 20 430 60 C 530 20 720 40 820 210" fill="none" stroke={C.matcha} strokeWidth={3} strokeDasharray="10 10" opacity={0.6} />
      {/* vertebral column */}
      {LVS.map((l) => {
        const y = LY[l];
        const o = lvOn(l);
        return (
          <g key={l}>
            <rect x={X - 25 - 82} y={y - 46} width={164} height={92} rx={22} fill={`url(#bone-${id})`} stroke="#9C8F6C" strokeWidth={4} opacity={0.9} />
            <rect x={X - 25 - 82} y={y - 46} width={164} height={92} rx={22} fill={C.banana} opacity={0.55 * o} />
            <rect x={X - 25 - 70} y={y + 50} width={140} height={14} rx={7} fill="#CFC6AE" opacity={0.8} />
          </g>
        );
      })}
      <path d={`M ${X - 25 - 90} 760 L ${X - 25 + 90} 760 L ${X - 25 + 50} 960 L ${X - 25 - 50} 960 Z`} fill={`url(#bone-${id})`} stroke="#9C8F6C" strokeWidth={4} opacity={0.9} />
      {/* level guides */}
      {ruler &&
        LVS.map((l) => {
          const o = lvOn(l);
          if (o <= 0) return null;
          return <line key={l} x1={118} y1={LY[l]} x2={118 + (X - 25 - 82 - 118) * o} y2={LY[l]} stroke={C.forest} strokeWidth={4} strokeDasharray="12 9" opacity={0.7} />;
        })}
      {/* lower gut outline (descending + sigmoid colon) */}
      {gut > 0 && (
        <g opacity={gut}>
          <path d="M 740 420 C 760 520 760 640 740 740 C 720 820 640 830 600 800 C 560 770 520 800 520 880" fill="none" stroke="#E9C9A0" strokeWidth={54} strokeLinecap="round" />
          <path d="M 740 420 C 760 520 760 640 740 740 C 720 820 640 830 600 800 C 560 770 520 800 520 880" fill="none" stroke={C.forest} strokeWidth={4} strokeDasharray="14 10" strokeLinecap="round" />
        </g>
      )}
      {/* kidneys */}
      <Kidney cx={X - 272} cy={350} on={on("REN")} />
      <Kidney cx={X + 250} cy={320} flip on={on("REN")} />
      {/* glows */}
      {back.map((b) => <g key={`g${b}`}>{glow(b)}</g>)}
      {/* back vessels */}
      {back.filter(show).map((b) => <g key={`o${b}`}>{vesselLayer(b, "out")}</g>)}
      {/* aorta outline */}
      <path d={`M ${X} ${AO_TOP} L ${X} ${AO_END}`} stroke={C.forest} strokeWidth={84} strokeLinecap="round" />
      {back.filter(show).map((b) => <g key={`f${b}`}>{vesselLayer(b, "fill")}</g>)}
      <path d={`M ${X} ${AO_TOP} L ${X} ${AO_END}`} stroke={`url(#ao-${id})`} strokeWidth={72} strokeLinecap="round" />
      <path d={`M ${X - 14} ${AO_TOP} L ${X - 14} ${AO_END - 30}`} stroke="#FFE3DA" strokeWidth={6} opacity={0.5} strokeLinecap="round" />
      {back.filter(show).map((b) => <g key={`h${b}`}>{vesselLayer(b, "hi")}</g>)}
      {aoHot ? null : null}
      {/* front branches */}
      {front.map((b) => <g key={`g${b}`}>{glow(b)}</g>)}
      {front.filter(show).map((b) => (
        <g key={b}>
          {vesselLayer(b, "out")}
          {vesselLayer(b, "fill")}
          {vesselLayer(b, "hi")}
        </g>
      ))}
      {/* origin dots */}
      {front.filter(show).map((b) => {
        const v = VESSEL[b][0];
        const m = v.d.match(/^M ([\d.-]+) ([\d.-]+)/)!;
        const o = on(b);
        return <circle key={`d${b}`} cx={+m[1]} cy={+m[2]} r={9 + 3 * o} fill={o > 0.5 ? C.banana : "#F2E3D6"} stroke={C.forest} strokeWidth={4} />;
      })}
      {/* question mark at L3 */}
      {q > 0 && (
        <g transform={`translate(${X + 70} ${LY.L3 + 6}) scale(${0.6 + 0.4 * q + 0.06 * Math.sin(t * 8)})`} opacity={q}>
          <circle r={46} fill={C.red} stroke={C.forest} strokeWidth={6} />
          <text x={0} y={22} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={66} fill={C.paper}>?</text>
        </g>
      )}
      {/* level ruler */}
      {ruler &&
        LVS.map((l) => {
          const o = lvOn(l);
          const red = l === "L3" && q > 0;
          return (
            <g key={`r${l}`} transform={`translate(64 ${LY[l]}) scale(${1 + 0.18 * o * (1 - ramp(t, (lv[l] ?? 0) + 0.25, (lv[l] ?? 0) + 0.6))})`}>
              <rect x={-58} y={-28} width={116} height={56} rx={18} fill={red ? C.red : o > 0.5 ? C.banana : C.card} stroke={o > 0.5 || red ? C.forest : "#B9B39A"} strokeWidth={4} />
              <text x={0} y={13} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill={red ? C.paper : o > 0.5 ? C.forest : "#9C967E"}>{l}</text>
            </g>
          );
        })}
    </svg>
  );
};
