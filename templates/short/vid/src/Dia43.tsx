import React from "react";
import { C, FONT, ramp } from "./kit";

/**
 * Our own schematic SIDE view of the trunk (Book Plume illustration). viewBox 860 x 680. Front (anterior) = viewer's LEFT,
 * back (posterior, spine) = viewer's RIGHT. Diaphragm = dome between chest and abdomen.
 * Openings (Gray 1918 p. 406; Radiopaedia "Diaphragmatic apertures"):
 *  - vena caval foramen: T8, in the central tendon: inferior vena cava (+ branches of right phrenic nerve)
 *  - esophageal hiatus: T10, in the muscular part (right crus): esophagus + vagus nerves
 *  - aortic hiatus: T12, behind the median arcuate ligament, in front of the vertebrae: aorta + thoracic duct (+ azygos)
 * Vertebra level i (T6 = 0): centre y = 98 + 56 i  ->  T8 = 210, T10 = 322, T12 = 434.
 */
export type DId = "ivc" | "eso" | "ao";
export type DPart = DId | "dome" | "tendon" | "vag" | "duct" | "chest" | "abd" | "lv8" | "lv10" | "lv12" | "mal";
export const OPEN: Record<DId, { x: number; y: number; lv: number; level: string }> = {
  ivc: { x: 390, y: 210, lv: 2, level: "T8" },
  eso: { x: 561, y: 320, lv: 4, level: "T10" },
  ao: { x: 640, y: 434, lv: 6, level: "T12" },
};
const VY = (i: number) => 98 + 56 * i;
const VNAME = ["T6", "T7", "T8", "T9", "T10", "T11", "T12", "L1", "L2", "L3", "L4"];

const DIA = "M 92 352 C 140 262 250 212 360 210 C 455 208 525 250 560 318 C 590 378 600 420 606 440";
const CRUS = "M 606 440 C 616 500 640 560 678 612";
const CHEST = "M 104 -40 L 678 -40 L 678 440 L 606 440 C 600 420 590 378 560 318 C 525 250 455 208 360 210 C 250 212 140 262 92 352 L 104 300 Z";
const ABD = "M 92 352 C 140 262 250 212 360 210 C 455 208 525 250 560 318 C 590 378 600 420 606 440 C 616 500 640 560 678 612 L 678 760 L 20 760 L 20 352 Z";
const HEART = "M 214 206 C 196 140 246 76 318 78 C 392 80 442 140 432 206 C 380 214 262 214 214 206 Z";
const LIVER = "M 100 362 C 152 274 258 230 360 230 C 430 230 474 252 494 292 C 474 362 404 432 304 470 C 222 500 142 470 112 430 Z";
const STOMACH = "M 502 402 C 546 392 574 432 562 484 C 548 544 470 562 432 530 C 410 510 430 470 470 452 C 490 442 496 420 502 402 Z";
const STERNUM = "M 66 -40 L 102 -40 L 106 298 L 92 340 L 78 298 Z";
const IVC = "M 392 600 C 392 440 390 300 390 210 C 390 180 384 160 372 140";
const ESO = "M 584 -40 C 580 100 572 220 562 318 C 556 370 530 396 504 410";
const VAG1 = "M 566 -40 C 562 100 555 220 545 316 C 541 350 528 372 512 386";
const VAG2 = "M 602 -40 C 598 100 590 220 579 318 C 574 356 560 380 540 398";
const AO = "M 640 -40 L 640 720";
const DUCT = "M 664 512 C 666 420 662 300 664 -40";
const MAL = "M 604 446 C 618 414 662 414 676 446";

type Lab = { ax: number; ay: number; px: number; py: number; text: string };
export const DLAB: Partial<Record<DPart, Lab>> = {
  dome: { ax: 200, ay: 262, px: 190, py: 150, text: "Diaphragm" },
  tendon: { ax: 315, ay: 212, px: 250, py: 120, text: "Central tendon" },
  ivc: { ax: 392, ay: 440, px: 230, py: 560, text: "Inferior vena cava" },
  eso: { ax: 578, ay: 150, px: 400, py: 110, text: "Esophagus" },
  vag: { ax: 548, ay: 270, px: 360, py: 300, text: "Vagus nerves" },
  ao: { ax: 640, ay: 600, px: 470, py: 630, text: "Aorta" },
  duct: { ax: 664, ay: 470, px: 470, py: 520, text: "Thoracic duct" },
};

const mix = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return "#" + pa.map((v, i) => Math.round(v + (pb[i] - v) * k).toString(16).padStart(2, "0")).join("");
};

export const Dia: React.FC<{
  t: number;
  w?: number;
  lit?: Partial<Record<DPart, number>>;
  focus?: DPart[];
  dimFrom?: number;
  show?: Partial<Record<DPart, number>>; // draw-in times for dome, tubes, level lines; undefined = shown if `all`
  all?: boolean;
}> = ({ t, w = 860, lit = {}, focus = [], dimFrom, show = {}, all }) => {
  const s = w / 860;
  const on = (id: DPart) => (lit[id] === undefined ? 0 : ramp(t, (lit[id] as number) - 0.05, (lit[id] as number) + 0.3));
  const dimP = dimFrom === undefined ? 0 : ramp(t, dimFrom, dimFrom + 0.4);
  const op = (id: DPart) => 1 - 0.5 * dimP * (1 - on(id));
  const glow = (id: DPart) => (focus.includes(id) ? on(id) * (0.72 + 0.28 * Math.sin(t * 7)) : 0);
  const drawn = (id: DPart) => {
    const v = show[id];
    if (v === undefined) return all && !id.startsWith("lv") ? 1 : 0;
    return ramp(t, v, v + 0.7);
  };

  const Tube: React.FC<{ d: string; width: number; id: DPart; p: number; color: string; hi: string; litColor?: string; outline?: number }> = ({ d, width, id, p, color, hi, litColor, outline = 7 }) => {
    if (p <= 0.001) return null;
    const gl = glow(id);
    const lt = on(id);
    const common = { d, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, pathLength: 1, strokeDasharray: `${p} 2` };
    return (
      <g opacity={op(id)}>
        {gl > 0 && <path {...common} stroke={C.banana} strokeWidth={width + 24 + 6 * gl} opacity={0.85 * gl} />}
        <path {...common} stroke={C.forest} strokeWidth={width + outline} />
        <path {...common} stroke={litColor && lt > 0 ? mix(color, litColor, lt) : color} strokeWidth={width} />
        <path {...common} stroke={hi} strokeWidth={Math.max(2, width * 0.28)} opacity={0.8} transform="translate(-2.5 0)" />
      </g>
    );
  };

  const domeP = drawn("dome");
  const domeLit = on("dome");
  const tendonLit = on("tendon");
  const chestP = on("chest");
  const abdP = on("abd");
  const ringFor = (id: DId) => {
    const o = OPEN[id];
    const p = Math.max(on(id), drawn(("lv" + o.level.slice(1)) as DPart));
    return { o, p };
  };

  return (
    <svg width={860 * s} height={680 * s} viewBox="0 0 860 680" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="ch43" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E3ECF3" />
          <stop offset="1" stopColor="#CFDDEA" />
        </linearGradient>
        <linearGradient id="ab43" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F6E5D0" />
          <stop offset="1" stopColor="#EED6BA" />
        </linearGradient>
        <linearGradient id="bone43" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FFFBEF" />
          <stop offset="1" stopColor="#E9DFC2" />
        </linearGradient>
        <pattern id="lung43" width={22} height={22} patternUnits="userSpaceOnUse">
          <circle cx={11} cy={11} r={2.4} fill="#9DB6CC" opacity={0.55} />
        </pattern>
        <filter id="sh43" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx={0} dy={4} stdDeviation={4} floodColor="#1F2A14" floodOpacity={0.28} />
        </filter>
      </defs>
      {/* cavities */}
      <path d={CHEST} fill="url(#ch43)" opacity={1 - 0.35 * dimP} />
      <path d={CHEST} fill="url(#lung43)" opacity={0.9 - 0.4 * dimP} />
      {chestP > 0 && <path d={CHEST} fill={C.banana} opacity={0.3 * chestP * (1 - on("abd"))} />}
      <path d={ABD} fill="url(#ab43)" opacity={1 - 0.35 * dimP} />
      {abdP > 0 && <path d={ABD} fill={C.banana} opacity={0.3 * abdP * (1 - ramp(t, (lit.abd as number) + 0.8, (lit.abd as number) + 1.3))} />}
      {/* organs, faint context */}
      <path d={HEART} fill="#E7A496" stroke="#9C4A3D" strokeWidth={3} opacity={0.55 * (1 - 0.4 * dimP)} />
      <path d="M 300 96 C 290 130 300 170 330 196" fill="none" stroke="#9C4A3D" strokeWidth={3} opacity={0.35 * (1 - 0.4 * dimP)} />
      <path d={LIVER} fill="#C98B6E" stroke="#8A5440" strokeWidth={3} opacity={0.42 * (1 - 0.4 * dimP)} />
      <path d={STOMACH} fill="#E3A796" stroke="#9C5A49" strokeWidth={3} opacity={0.5 * (1 - 0.4 * dimP)} />
      {/* sternum + xiphoid (front) */}
      <path d={STERNUM} fill="url(#bone43)" stroke={C.forest} strokeWidth={4} opacity={0.85 * (1 - 0.3 * dimP)} />
      {/* spine: bodies, discs, spinous processes */}
      <g opacity={1 - 0.3 * dimP}>
        {VNAME.map((n, i) => {
          const y = VY(i);
          const lvId = i === 2 ? "lv8" : i === 4 ? "lv10" : i === 6 ? "lv12" : null;
          const hp = lvId ? drawn(lvId as DPart) : 0;
          return (
            <g key={n}>
              <path d={`M 758 ${y - 14} L 822 ${y + 14} L 826 ${y + 26} L 812 ${y + 28} L 756 ${y + 12} Z`} fill="url(#bone43)" stroke={C.forest} strokeWidth={3} />
              <rect x={678} y={y - 22} width={80} height={44} rx={9} fill={hp > 0 ? mix("#FFFBEF", "#F2D14E", hp) : "url(#bone43)"} stroke={C.forest} strokeWidth={hp > 0 ? 4 + hp : 3.5} />
              <rect x={684} y={y + 23} width={68} height={10} rx={5} fill="#BFD0A0" opacity={0.9} />
              <text x={718} y={y + 9} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={21} fill={C.forest} opacity={0.55 * (1 - ramp(hp, 0.2, 0.5))}>{n}</text>
            </g>
          );
        })}
      </g>
      {/* thoracic duct (behind aorta, in front of spine) */}
      <Tube d={DUCT} width={8} id="duct" p={drawn("duct") || (all ? 1 : drawn("ao"))} color="#F1EBD2" hi="#FFFFFF" litColor="#FFF4B0" outline={5} />
      {(drawn("duct") || drawn("ao") || all) ? <ellipse cx={664} cy={524} rx={10} ry={20} fill="#F1EBD2" stroke={C.forest} strokeWidth={3} opacity={op("duct") * Math.max(drawn("ao"), drawn("duct"), all ? 1 : 0)} /> : null}
      {/* crus: posterior part of the diaphragm, behind the aorta */}
      {domeP > 0 && (
        <g opacity={op("dome")}>
          <path d={CRUS} fill="none" stroke={C.forest} strokeWidth={30} strokeLinecap="round" pathLength={1} strokeDasharray={`${ramp(domeP, 0.75, 1)} 2`} />
          <path d={CRUS} fill="none" stroke="#A9503F" strokeWidth={23} strokeLinecap="round" pathLength={1} strokeDasharray={`${ramp(domeP, 0.75, 1)} 2`} />
        </g>
      )}
      {/* aorta */}
      <Tube d={AO} width={30} id="ao" p={drawn("ao")} color="#C9483C" hi={C.redLight} litColor="#E0503F" />
      {/* diaphragm dome */}
      {domeP > 0 && (
        <g opacity={op("dome") * (1 - 0.0 * dimP)} filter="url(#sh43)">
          {glow("dome") > 0 && <path d={DIA} fill="none" stroke={C.banana} strokeWidth={60 + 8 * glow("dome")} strokeLinecap="round" pathLength={1} strokeDasharray={`${domeP} 2`} opacity={0.8 * glow("dome")} />}
          <path d={DIA} fill="none" stroke={C.forest} strokeWidth={36} strokeLinecap="round" pathLength={1} strokeDasharray={`${domeP} 2`} />
          <path d={DIA} fill="none" stroke={domeLit > 0 ? mix("#B4584A", "#CF6A55", domeLit) : "#B4584A"} strokeWidth={28} strokeLinecap="round" pathLength={1} strokeDasharray={`${domeP} 2`} />
          {/* muscle fibre hatching */}
          <path d={DIA} fill="none" stroke="#8C3A2D" strokeWidth={22} pathLength={1} strokeDasharray={`0.004 0.009`} opacity={0.45 * domeP} />
          <path d={DIA} fill="none" stroke="#E79A88" strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={`${domeP} 2`} transform="translate(0 -7)" opacity={0.75} />
          {/* central tendon segment (pale, fibrous) */}
          {glow("tendon") > 0 && <path d={DIA} fill="none" stroke={C.banana} strokeWidth={58} pathLength={1} strokeDasharray={`0 0.29 0.31 2`} opacity={0.85 * glow("tendon")} />}
          <path d={DIA} fill="none" stroke={C.forest} strokeWidth={36} pathLength={1} strokeDasharray={`0 0.29 ${0.31 * ramp(domeP, 0.3, 0.7)} 2`} />
          <path d={DIA} fill="none" stroke={tendonLit > 0 ? mix("#F1EBD6", "#FFF6C8", tendonLit) : "#F1EBD6"} strokeWidth={28} pathLength={1} strokeDasharray={`0 0.29 ${0.31 * ramp(domeP, 0.3, 0.7)} 2`} />
          <path d={DIA} fill="none" stroke="#C9BE98" strokeWidth={20} pathLength={1} strokeDasharray={`0 0.29 ${0.31 * ramp(domeP, 0.3, 0.7)} 2`} opacity={0.0} />
        </g>
      )}
      {/* vagus nerves on the esophagus + esophagus */}
      <Tube d={ESO} width={28} id="eso" p={drawn("eso")} color="#DA907E" hi="#F6C9BC" litColor="#E9A08D" />
      {drawn("eso") > 0 && (
        <g>
          {[0.18, 0.3, 0.42, 0.54, 0.66].map((k, i) => (
            <path key={i} d={ESO} fill="none" stroke="#B66A58" strokeWidth={22} pathLength={1} strokeDasharray={`0 ${k} 0.006 2`} opacity={0.55 * op("eso") * ramp(drawn("eso"), k, k + 0.1)} />
          ))}
        </g>
      )}
      <Tube d={VAG1} width={7} id="vag" p={drawn("vag") || drawn("eso")} color="#E9C743" hi="#FFF3B8" litColor={C.banana} outline={5} />
      <Tube d={VAG2} width={7} id="vag" p={drawn("vag") || drawn("eso")} color="#E9C743" hi="#FFF3B8" litColor={C.banana} outline={5} />
      {/* IVC through the central tendon into the heart */}
      <Tube d={IVC} width={32} id="ivc" p={drawn("ivc")} color="#3F6CA8" hi="#A9C6EC" litColor="#5E95D6" />
      {/* median arcuate ligament arching in front of the aorta */}
      {domeP > 0.9 && (
        <g opacity={op("dome")}>
          <path d={MAL} fill="none" stroke={C.forest} strokeWidth={14} strokeLinecap="round" />
          <path d={MAL} fill="none" stroke="#EDE3C4" strokeWidth={8} strokeLinecap="round" />
        </g>
      )}
      {/* opening rings + level lines */}
      {(["ivc", "eso", "ao"] as DId[]).map((id) => {
        const { o } = ringFor(id);
        const lvp = drawn(("lv" + o.level.slice(1)) as DPart);
        const rp = Math.max(on(id), lvp);
        if (rp <= 0) return null;
        const pulse = 1 + 0.08 * Math.sin(t * 8);
        return (
          <g key={id}>
            {lvp > 0 && (
              <line x1={o.x + 28} y1={o.y} x2={o.x + 28 + (676 - o.x - 28) * lvp} y2={o.y} stroke={C.forest} strokeWidth={5} strokeDasharray="12 9" strokeLinecap="round" />
            )}
            <ellipse cx={o.x} cy={o.y} rx={30 * pulse} ry={15 * pulse} fill="none" stroke={C.forest} strokeWidth={9} opacity={rp} />
            <ellipse cx={o.x} cy={o.y} rx={30 * pulse} ry={15 * pulse} fill="none" stroke={C.banana} strokeWidth={4.5} opacity={rp} />
          </g>
        );
      })}
    </svg>
  );
};

/** Labels, region tags and level pills drawn OUTSIDE the zoom layer. map = diagram coords -> screen coords */
export const DiaLabels: React.FC<{
  t: number;
  map: (x: number, y: number) => [number, number];
  lit?: Partial<Record<DPart, number>>;
  focus?: DPart[];
  labels?: Partial<Record<DPart, number>>;
  labelEnd?: Partial<Record<DPart, number>>;
  regions?: { chest?: number; abd?: number };
  levels?: Partial<Record<DId, number>>;
  h?: number;
}> = ({ t, map, lit = {}, focus = [], labels = {}, labelEnd = {}, regions = {}, levels = {}, h = 680 }) => {
  const on = (id: DPart) => (lit[id] === undefined ? 0 : ramp(t, (lit[id] as number) - 0.05, (lit[id] as number) + 0.3));
  return (
    <svg width={860} height={h} viewBox={`0 0 860 ${h}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {[
        ["← FRONT", 122, "start"],
        ["BACK →", 664, "end"],
      ].map(([a, x, anc]) => (
        <text key={a as string} x={x as number} y={38} opacity={Math.max(0, 1 - (map(1, 0)[0] - map(0, 0)[0] - 1) * 8)} textAnchor={anc as "start" | "end"} fontFamily={FONT} fontWeight={800} fontSize={22} letterSpacing={3} fill={C.matcha}>{a}</text>
      ))}
      {regions.chest !== undefined && (() => {
        const p = ramp(t, regions.chest, regions.chest + 0.3);
        return (
          <g opacity={p} transform={`translate(450 ${100 + (1 - p) * -20})`}>
            <rect x={0} y={-30} width={190} height={60} rx={18} fill={C.forest} />
            <text x={95} y={11} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} letterSpacing={3} fill={C.paper}>CHEST ↑</text>
          </g>
        );
      })()}
      {regions.abd !== undefined && (() => {
        const p = ramp(t, regions.abd, regions.abd + 0.3);
        return (
          <g opacity={p} transform={`translate(60 ${h - 120 + (1 - p) * 20})`}>
            <rect x={0} y={-30} width={250} height={60} rx={18} fill={C.forest} />
            <text x={125} y={11} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} letterSpacing={3} fill={C.paper}>ABDOMEN ↓</text>
          </g>
        );
      })()}
      {(Object.keys(levels) as DId[]).map((id) => {
        const lt = levels[id] as number;
        const p = ramp(t, lt + 0.08, lt + 0.38);
        if (p <= 0) return null;
        const o = OPEN[id];
        const [sx, sy] = map(790, o.y);
        const x = Math.min(860 - 52, sx);
        return (
          <g key={id} opacity={p} transform={`translate(${x} ${sy}) scale(${0.7 + 0.3 * p})`}>
            <rect x={-48} y={-27} width={96} height={54} rx={16} fill={C.banana} stroke={C.forest} strokeWidth={4} />
            <text x={0} y={11} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill={C.forest}>{o.level}</text>
          </g>
        );
      })}
      {(Object.keys(labels) as DPart[]).map((id) => {
        const lb = DLAB[id];
        const lt = labels[id];
        if (!lb || lt === undefined || t < lt - 0.05) return null;
        const le = labelEnd[id];
        const p = ramp(t, lt - 0.05, lt + 0.28) * (le === undefined ? 1 : 1 - ramp(t, le, le + 0.25));
        if (p <= 0) return null;
        const hot = on(id) > 0.5 && focus.includes(id);
        const ww = lb.text.length * 16.5 + 36;
        const [ax, ay] = map(lb.ax, lb.ay);
        let px = ax + (lb.px - lb.ax);
        let py = ay + (lb.py - lb.ay);
        px = Math.max(ww / 2 + 14, Math.min(860 - ww / 2 - 14, px));
        py = Math.max(50, Math.min(h - 70, py));
        const lx = ax + (px - ax) * p;
        const ly = ay + (py - ay) * p;
        return (
          <g key={id} opacity={Math.min(1, p * 1.5)}>
            <line x1={ax} y1={ay} x2={lx} y2={ly} stroke={C.forest} strokeWidth={4.5} strokeLinecap="round" />
            <circle cx={ax} cy={ay} r={10} fill={hot ? C.red : C.banana} stroke={C.forest} strokeWidth={4} />
            <g transform={`translate(${px} ${py}) scale(${0.7 + 0.3 * p})`}>
              <rect x={-ww / 2} y={-26} width={ww} height={52} rx={16} fill={hot ? C.banana : C.forest} stroke={C.forest} strokeWidth={3} />
              <text x={0} y={10} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={hot ? C.forest : C.paper}>{lb.text}</text>
            </g>
          </g>
        );
      })}
    </svg>
  );
};
