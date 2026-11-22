import React from "react";
import { Img, staticFile } from "remotion";
import { C, FONT, ramp, useT } from "./kit";
import { HeartShape, K, SvgPill, clamp, lerp } from "./IllusStand";

/* Own diagrams for "What happens when you hold your breath" — Book Plume illustrations */
const S = C.forest;
export const B = {
  o2: "#2F8F83",
  o2L: "#8FD3C8",
  co2: "#8A8A8A",
  co2D: "#5E5E5E",
  lung: "#F2B6AE",
  lungD: "#D98A80",
  nerve: "#E8B92E",
  air: "#BFE3F2",
};

/* ============ 3D clip: PNG sequence rendered by templates/r3d (plain mode) ============ */
export const Clip3D: React.FC<{ name: string; a: number; b: number; n: number; x?: number; y?: number; w?: number; h?: number; credit: string; speed?: number }> = ({
  name, a, b, n, x = 0, y = 0, w = 1040, h = 700, credit, speed = 1,
}) => {
  const t = useT();
  if (t < a - 0.2 || t > b + 0.5) return null;
  const i = ramp(t, a, a + 0.45), o = ramp(t, b - 0.1, b + 0.35);
  const f = Math.max(0, Math.min(n - 1, Math.floor((t - a) * 30 * speed)));
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: i * (1 - o), transform: `translateY(${(1 - i) * 40}px)`, borderRadius: 36, overflow: "hidden", boxShadow: `0 0 0 4px ${C.line}, 0 18px 40px rgba(31,42,20,0.2)` }}>
      <Img src={staticFile(`f3d/${name}/f${String(f).padStart(5, "0")}.png`)} style={{ width: w, height: h, display: "block" }} />
      <div style={{ position: "absolute", left: 18, top: 14, background: C.banana, color: S, fontFamily: FONT, fontWeight: 800, fontSize: 22, padding: "4px 14px", borderRadius: 12 }}>3D</div>
      <div style={{ position: "absolute", right: 14, bottom: 10, fontFamily: FONT, fontWeight: 700, fontSize: 17, color: "#fff", opacity: 0.85, textShadow: "0 0 6px #000, 0 0 3px #000" }}>{credit}</div>
    </div>
  );
};

/** label pinned onto a 3D clip (px inside the clip box) */
export const Tag3D: React.FC<{ t0: number; t1?: number; x: number; y: number; text: string; hot?: boolean; side?: "l" | "r" }> = ({ t0, t1 = 1e9, x, y, text, hot, side = "r" }) => {
  const t = useT();
  const p = ramp(t, t0 - 0.1, t0 + 0.25) * (1 - ramp(t, t1 - 0.2, t1 + 0.1));
  if (p <= 0) return null;
  const left = side === "l";
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(${left ? "-100%" : "0"}, -50%) scale(${0.85 + 0.15 * p})`, transformOrigin: left ? "100% 50%" : "0% 50%", opacity: p, display: "flex", alignItems: "center", flexDirection: left ? "row-reverse" : "row", gap: 10 }}>
      <div style={{ width: 20, height: 20, borderRadius: 10, background: hot ? C.red : C.banana, boxShadow: `0 0 0 4px #fff` }} />
      <div style={{ width: 40, height: 4, background: "#fff" }} />
      <div style={{ background: hot ? C.banana : C.paper, color: S, fontFamily: FONT, fontWeight: 800, fontSize: 34, padding: "6px 16px 8px", borderRadius: 14, whiteSpace: "nowrap", border: `3px solid ${S}` }}>{text}</div>
    </div>
  );
};

/* ============ HOLD TIMER (viewer's own breath hold) ============ */
export const HoldTimer: React.FC<{ t0: number; t1: number }> = ({ t0, t1 }) => {
  const t = useT();
  const a = ramp(t, t0, t0 + 0.4) * (1 - ramp(t, t1, t1 + 0.5));
  if (a <= 0) return null;
  const s = Math.max(0, Math.min(t, t1) - t0);
  const mm = Math.floor(s / 60), ss = Math.floor(s % 60);
  const late = s > 60;
  return (
    <div style={{ position: "absolute", left: 60, top: 946, opacity: a, transform: `scale(${0.8 + 0.2 * a})`, transformOrigin: "0% 50%", display: "flex", alignItems: "center", gap: 14, background: late ? C.red : C.card, border: `4px solid ${late ? C.red : S}`, borderRadius: 24, padding: "8px 20px 10px", fontFamily: FONT, fontWeight: 800, boxShadow: "0 8px 0 rgba(31,42,20,0.15)" }}>
      <svg width={44} height={44} viewBox="0 0 44 44">
        <circle cx={22} cy={24} r={17} fill="none" stroke={late ? "#fff" : S} strokeWidth={5} />
        <path d={`M22 24 L${22 + 11 * Math.sin((s / 60) * 2 * Math.PI)} ${24 - 11 * Math.cos((s / 60) * 2 * Math.PI)}`} stroke={late ? "#fff" : C.red} strokeWidth={5} strokeLinecap="round" />
        <rect x={18} y={1} width={8} height={6} rx={2} fill={late ? "#fff" : S} />
      </svg>
      <div style={{ lineHeight: 1 }}>
        <div style={{ fontSize: 18, letterSpacing: 2, color: late ? "#FFE3DF" : C.matcha }}>{late ? "BREATHE ANY TIME" : "YOUR HOLD"}</div>
        <div style={{ fontSize: 44, color: late ? "#fff" : S, fontVariantNumeric: "tabular-nums" }}>{mm}:{String(ss).padStart(2, "0")}</div>
      </div>
    </div>
  );
};

/* ============ CHEST (front view): lungs, ribs, diaphragm, phrenic nerve ============ */
/** viewBox 600x660. inh 0..1 = breath in (diaphragm flattens/down, ribs up+out, lungs bigger). lock = airway closed. phrenic = nerve highlight. */
export const Chest: React.FC<{ w: number; t: number; inh: number; flow?: number; lock?: number; phrenic?: number; ribsHl?: number; diaHl?: number; labels?: number }> = ({
  w, t, inh, flow = 0, lock = 0, phrenic = 0, ribsHl = 0, diaHl = 0, labels = 1,
}) => {
  const domeY = lerp(380, 450, inh); // top of dome
  const baseY = 520;
  const sx = 1 + 0.06 * inh;
  const lungRy = lerp(150, 182, inh);
  const lungCy = lerp(300, 318, inh);
  const dots = [];
  if (flow > 0.01) {
    for (let i = 0; i < 5; i++) {
      const p = ((t * 0.9 + i / 5) % 1);
      dots.push(<circle key={i} cx={300} cy={lerp(10, 170, p)} r={9} fill={B.air} stroke={S} strokeWidth={3} opacity={flow * (1 - p * 0.3)} />);
    }
  }
  return (
    <svg width={w} height={(w * 660) / 600} viewBox="0 0 600 660">
      {/* body outline */}
      <path d="M150 40 C150 90 70 110 60 170 C40 300 50 470 90 600 L510 600 C550 470 560 300 540 170 C530 110 450 90 450 40 Z" fill={K.skin} stroke={S} strokeWidth={6} opacity={0.55} />
      {/* lungs */}
      <g transform={`translate(300 0) scale(${sx} 1) translate(-300 0)`}>
        <path d={`M280 ${lungCy - lungRy} C210 ${lungCy - lungRy} 150 ${lungCy - 40} 140 ${lungCy + 60} C135 ${lungCy + lungRy - 20} 170 ${domeY + 20} 280 ${domeY + 10} Z`} fill={B.lung} stroke={S} strokeWidth={5} />
        <path d={`M320 ${lungCy - lungRy} C390 ${lungCy - lungRy} 450 ${lungCy - 40} 460 ${lungCy + 60} C465 ${lungCy + lungRy - 20} 430 ${domeY + 20} 320 ${domeY + 10} C350 ${lungCy + 70} 340 ${lungCy + 30} 320 ${lungCy} Z`} fill={B.lung} stroke={S} strokeWidth={5} />
      </g>
      {/* ribs */}
      {[150, 210, 270, 330, 390].map((y, i) => {
        const lift = 10 * inh * (1 - i * 0.12);
        const hl = ribsHl;
        return (
          <g key={i}>
            <path d={`M296 ${y - 20} C230 ${y - 30 - lift} ${120 - 10 * inh} ${y - lift} ${110 - 12 * inh} ${y + 60 - lift * 0.5}`} stroke={hl > 0.05 ? C.banana : K.bone} strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.95} />
            <path d={`M304 ${y - 20} C370 ${y - 30 - lift} ${480 + 10 * inh} ${y - lift} ${490 + 12 * inh} ${y + 60 - lift * 0.5}`} stroke={hl > 0.05 ? C.banana : K.bone} strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.95} />
            <path d={`M296 ${y - 20} C230 ${y - 30 - lift} ${120 - 10 * inh} ${y - lift} ${110 - 12 * inh} ${y + 60 - lift * 0.5}`} stroke={S} strokeWidth={3} fill="none" opacity={0.35} />
            <path d={`M304 ${y - 20} C370 ${y - 30 - lift} ${480 + 10 * inh} ${y - lift} ${490 + 12 * inh} ${y + 60 - lift * 0.5}`} stroke={S} strokeWidth={3} fill="none" opacity={0.35} />
          </g>
        );
      })}
      {/* sternum */}
      <rect x={286} y={120} width={28} height={250} rx={12} fill={K.bone} stroke={S} strokeWidth={4} />
      {/* trachea + bronchi */}
      <path d="M300 0 L300 190 M300 190 L250 240 M300 190 L350 240" stroke="#F7E3D8" strokeWidth={30} strokeLinecap="round" fill="none" />
      <path d="M300 0 L300 190 M300 190 L250 240 M300 190 L350 240" stroke={S} strokeWidth={4} strokeLinecap="round" fill="none" opacity={0.5} />
      {dots}
      {/* heart */}
      <HeartShape cx={325} cy={lerp(395, 405, inh)} size={95} />
      {/* diaphragm */}
      <path d={`M70 ${baseY} C120 ${domeY - 20} 250 ${domeY - 10} 300 ${domeY + 15} C350 ${domeY - 10} 480 ${domeY - 20} 530 ${baseY}`} stroke={diaHl > 0.05 ? C.red : K.muscle} strokeWidth={diaHl > 0.05 ? 24 : 18} fill="none" strokeLinecap="round" />
      {diaHl > 0.05 && <path d={`M70 ${baseY} C120 ${domeY - 20} 250 ${domeY - 10} 300 ${domeY + 15} C350 ${domeY - 10} 480 ${domeY - 20} 530 ${baseY}`} stroke={K.glow} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.8 * diaHl} />}
      {/* phrenic nerves */}
      {phrenic > 0.01 && (
        <g opacity={phrenic}>
          <path d={`M230 30 C225 120 240 240 235 320 C232 360 210 ${domeY - 10} 200 ${domeY - 4}`} stroke={B.nerve} strokeWidth={8} fill="none" strokeLinecap="round" />
          <path d={`M370 30 C375 120 385 240 390 320 C392 360 400 ${domeY - 10} 410 ${domeY - 4}`} stroke={B.nerve} strokeWidth={8} fill="none" strokeLinecap="round" />
          {[0, 1].map((k) => {
            const p = (t * 0.8 + k * 0.5) % 1;
            return (
              <g key={k}>
                <circle cx={lerp(230, 205, p)} cy={lerp(30, domeY - 6, p)} r={10} fill={K.glow} stroke={S} strokeWidth={3} />
                <circle cx={lerp(370, 405, p)} cy={lerp(30, domeY - 6, p)} r={10} fill={K.glow} stroke={S} strokeWidth={3} />
              </g>
            );
          })}
          <SvgPill x={150} y={40} text="C3–C5" size={28} hot />
        </g>
      )}
      {/* lock at the airway */}
      {lock > 0.01 && (
        <g opacity={lock} transform={`translate(300 80) scale(${0.7 + 0.3 * lock})`}>
          <rect x={-34} y={-14} width={68} height={54} rx={10} fill={C.red} stroke={S} strokeWidth={5} />
          <path d="M-20 -14 L-20 -32 C-20 -54 20 -54 20 -32 L20 -14" stroke={S} strokeWidth={8} fill="none" />
          <circle cx={0} cy={12} r={7} fill="#fff" />
        </g>
      )}
      {labels > 0.01 && (
        <g opacity={labels}>
          <SvgPill x={530} y={600} text={`diaphragm ${inh > 0.5 ? "down ↓" : "up ↑"}`} size={26} bg={K.muscle} anchor="r" />
        </g>
      )}
    </svg>
  );
};

/* ============ ALVEOLUS + CAPILLARY: gas exchange during a hold ============ */
/** viewBox 820x560. hold 0..1 = how far into the hold (O2 in the sac falls, CO2 piles up). */
export const Alveolus: React.FC<{ w: number; t: number; hold: number; o2On?: number; co2On?: number }> = ({ w, t, hold, o2On = 1, co2On = 1 }) => {
  const cx = 300, cy = 250, r = 190;
  const nO2 = Math.round(lerp(16, 7, hold));
  const nCO2 = Math.round(lerp(3, 16, hold));
  const rnd = (i: number, k: number) => {
    const a = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
    return a - Math.floor(a);
  };
  const inside = (i: number, k: number) => {
    const ang = rnd(i, k) * Math.PI * 2 + t * 0.25 * (rnd(i, k + 3) - 0.5);
    const rr = Math.sqrt(rnd(i, k + 1)) * (r - 40);
    return [cx + Math.cos(ang) * rr, cy + Math.sin(ang) * rr * 0.92];
  };
  const o2 = [], co2 = [];
  for (let i = 0; i < nO2; i++) {
    const [x, y] = inside(i, 1);
    o2.push(<g key={i}><circle cx={x} cy={y} r={17} fill={B.o2} stroke={S} strokeWidth={3} /><text x={x} y={y + 6} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={15} fill="#fff">O₂</text></g>);
  }
  for (let i = 0; i < nCO2; i++) {
    const [x, y] = inside(i + 50, 2);
    co2.push(<g key={i}><circle cx={x} cy={y} r={19} fill={B.co2} stroke={S} strokeWidth={3} /><text x={x} y={y + 6} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={13} fill="#fff">CO₂</text></g>);
  }
  // moving molecules across the wall: O2 sac -> blood (down-right), CO2 blood -> sac
  const movers = [];
  for (let i = 0; i < 4; i++) {
    const p = (t * 0.45 + i / 4) % 1;
    const ang = -0.1 + i * 0.32;
    const x0 = cx + Math.cos(ang) * (r - 50), y0 = cy + Math.sin(ang) * (r - 50) * 0.92;
    const x1 = cx + Math.cos(ang) * (r + 75), y1 = cy + Math.sin(ang) * (r + 75) * 0.92;
    if (o2On > 0.01) movers.push(<circle key={"o" + i} cx={lerp(x0, x1, p)} cy={lerp(y0, y1, p)} r={13} fill={B.o2} stroke={S} strokeWidth={3} opacity={o2On} />);
    const q = (t * 0.45 + i / 4 + 0.5) % 1;
    const a2 = ang + 0.16;
    const X0 = cx + Math.cos(a2) * (r + 75), Y0 = cy + Math.sin(a2) * (r + 75) * 0.92;
    const X1 = cx + Math.cos(a2) * (r - 50), Y1 = cy + Math.sin(a2) * (r - 50) * 0.92;
    if (co2On > 0.01) movers.push(<circle key={"c" + i} cx={lerp(X0, X1, q)} cy={lerp(Y0, Y1, q)} r={14} fill={B.co2} stroke={S} strokeWidth={3} opacity={co2On} />);
  }
  // capillary arc
  const arc = `M${cx - 40} ${cy + r + 60} C${cx + 160} ${cy + r + 80} ${cx + r + 110} ${cy + 120} ${cx + r + 80} ${cy - 160}`;
  const cells = [];
  for (let i = 0; i < 6; i++) {
    const p = (t * 0.18 + i / 6) % 1;
    const bx = (1 - p) ** 3 * (cx - 40) + 3 * (1 - p) ** 2 * p * (cx + 160) + 3 * (1 - p) * p * p * (cx + r + 110) + p ** 3 * (cx + r + 80);
    const by = (1 - p) ** 3 * (cy + r + 60) + 3 * (1 - p) ** 2 * p * (cy + r + 80) + 3 * (1 - p) * p * p * (cy + 120) + p ** 3 * (cy - 160);
    cells.push(<ellipse key={i} cx={bx} cy={by} rx={20} ry={13} fill={K.blood} stroke={S} strokeWidth={3} />);
  }
  return (
    <svg width={w} height={(w * 560) / 820} viewBox="0 0 820 560">
      <path d={arc} stroke={K.bloodL} strokeWidth={70} fill="none" strokeLinecap="round" opacity={0.55} />
      <path d={arc} stroke={S} strokeWidth={4} fill="none" strokeDasharray="2 14" strokeLinecap="round" opacity={0.4} />
      {cells}
      <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.92} fill="#EAF6FB" stroke={S} strokeWidth={7} />
      <ellipse cx={cx} cy={cy} rx={r - 8} ry={r * 0.92 - 8} fill="none" stroke={B.lungD} strokeWidth={6} opacity={0.6} />
      {co2}
      {o2}
      {movers}
      <SvgPill x={cx} y={30} text="alveolus (air sac)" size={28} />
      <SvgPill x={700} y={510} text="capillary (blood)" size={28} bg={K.blood} />
    </svg>
  );
};

/* ============ GRAPH: CO2 rises, O2 saturation stays high ============ */
/** viewBox 960x520. cur 0..1 = cursor along the hold. */
export const HoldGraph: React.FC<{ w: number; cur: number; bp?: number }> = ({ w, cur, bp = 0 }) => {
  const X = (k: number) => 110 + k * 780;
  const yCO2 = (v: number) => 400 - (v - 40) * 20; // 40 -> 400, 50 -> 200
  const ptsCO2 = [], ptsO2 = [];
  for (let i = 0; i <= 60; i++) {
    const k = i / 60;
    if (k > cur) break;
    ptsCO2.push(`${X(k)},${yCO2(40 + 10 * Math.pow(k, 0.85))}`);
    ptsO2.push(`${X(k)},${lerp(100, 108, ramp(k, 0.75, 1))}`);
  }
  return (
    <svg width={w} height={(w * 520) / 960} viewBox="0 0 960 520">
      <rect x={110} y={60} width={780} height={400} rx={18} fill={C.card} stroke={C.line} strokeWidth={4} />
      <line x1={110} y1={yCO2(40)} x2={890} y2={yCO2(40)} stroke={C.line} strokeWidth={4} strokeDasharray="10 10" />
      <text x={100} y={yCO2(40) + 10} textAnchor="end" fontFamily={FONT} fontWeight={800} fontSize={28} fill={S}>40</text>
      <text x={100} y={yCO2(50) + 10} textAnchor="end" fontFamily={FONT} fontWeight={800} fontSize={28} fill={C.red}>≈50</text>
      <line x1={110} y1={yCO2(50)} x2={890} y2={yCO2(50)} stroke={C.redLight} strokeWidth={3} strokeDasharray="6 10" />
      <polyline points={ptsCO2.join(" ")} fill="none" stroke={C.red} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={ptsO2.join(" ")} fill="none" stroke={B.o2} strokeWidth={10} strokeLinecap="round" />
      {ptsO2.length > 0 && <SvgPill x={Math.min(X(cur) + 8, 640)} y={140} text="blood O₂ stays ≈ 98%+" size={26} bg={B.o2} anchor="l" />}
      {ptsCO2.length > 0 && <SvgPill x={Math.min(X(cur) + 8, 690)} y={yCO2(40 + 10 * Math.pow(cur, 0.85)) + 44} text="CO₂ (mmHg)" size={26} bg={C.red} anchor="l" />}
      <text x={110} y={500} fontFamily={FONT} fontWeight={800} fontSize={28} fill={S}>start of hold</text>
      <text x={890} y={500} textAnchor="end" fontFamily={FONT} fontWeight={800} fontSize={28} fill={C.red} opacity={bp}>breaking point</text>
      {bp > 0.01 && <line x1={X(1)} y1={60} x2={X(1)} y2={460} stroke={C.red} strokeWidth={6} opacity={bp} />}
      <text x={890} y={44} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={22} fill={C.matcha}>schematic · values from breath-hold studies</text>
    </svg>
  );
};

/* ============ CHEMORECEPTOR MAP (side view: brainstem, carotid body, aortic bodies) ============ */
/** viewBox 760x820 */
export const ChemoMap: React.FC<{ w: number; t: number; central?: number; carotid?: number; aortic?: number; sig9?: number; sig10?: number; csf?: number; hl?: string }> = ({
  w, t, central = 1, carotid = 1, aortic = 1, sig9 = 0, sig10 = 0, csf = 0, hl = "",
}) => {
  const med = { x: 360, y: 300 };
  const cb = { x: 420, y: 470 };
  const ab = { x: 330, y: 690 };
  const pulse = (k: number) => 1 + 0.25 * Math.max(0, Math.sin(t * 6 + k));
  const along = (pts: number[][], p: number) => {
    const n = pts.length - 1, f = p * n, i = Math.min(n - 1, Math.floor(f)), r = f - i;
    return [lerp(pts[i][0], pts[i + 1][0], r), lerp(pts[i][1], pts[i + 1][1], r)];
  };
  const p9 = [[cb.x, cb.y], [450, 420], [430, 350], [med.x + 20, med.y + 10]];
  const p10 = [[ab.x, ab.y], [300, 560], [330, 420], [med.x - 10, med.y + 20]];
  return (
    <svg width={w} height={(w * 820) / 760} viewBox="0 0 760 820">
      {/* head + neck + chest silhouette, facing right */}
      <path d="M220 330 C150 200 220 40 380 40 C540 40 620 150 600 260 C640 290 640 330 610 350 L600 400 C580 430 540 440 520 440 L510 520 C560 560 640 600 680 700 L680 820 L80 820 L80 700 C110 610 200 560 250 520 L250 430 C230 400 225 370 220 330 Z" fill={K.skin} stroke={S} strokeWidth={6} opacity={0.6} />
      {/* brain */}
      <path d="M240 250 C230 140 320 80 420 90 C520 95 570 170 560 240 C520 280 430 280 380 270 C330 280 270 290 240 250 Z" fill="#F1B9B0" stroke={S} strokeWidth={5} />
      {/* cerebellum */}
      <ellipse cx={290} cy={290} rx={60} ry={38} fill="#E59C92" stroke={S} strokeWidth={5} />
      {/* brainstem */}
      <path d="M350 250 C340 300 350 340 345 380 L385 380 C380 340 392 300 395 250 Z" fill={central > 0.5 && hl === "med" ? C.banana : "#E8A79E"} stroke={S} strokeWidth={5} />
      {csf > 0.01 && <ellipse cx={370} cy={330} rx={58} ry={70} fill="#9FD0EA" opacity={0.35 * csf} stroke={B.o2} strokeWidth={4} strokeDasharray="8 8" />}
      {central > 0.01 && (
        <g opacity={central}>
          <circle cx={med.x + 22} cy={med.y + 40} r={14 * pulse(0)} fill={C.red} stroke={S} strokeWidth={4} />
        </g>
      )}
      {/* carotid artery: common -> split */}
      <path d={`M400 800 L405 560 C408 520 ${cb.x - 5} ${cb.y + 20} ${cb.x} ${cb.y}`} stroke={K.blood} strokeWidth={22} fill="none" strokeLinecap="round" />
      <path d={`M${cb.x} ${cb.y} C${cb.x + 10} 420 455 380 470 320`} stroke={K.blood} strokeWidth={16} fill="none" strokeLinecap="round" />
      <path d={`M${cb.x} ${cb.y} C${cb.x + 40} 450 520 420 540 380`} stroke={K.blood} strokeWidth={14} fill="none" strokeLinecap="round" />
      {/* aortic arch */}
      <path d="M440 820 C440 720 400 660 330 660 C260 660 230 720 240 820" stroke={K.blood} strokeWidth={34} fill="none" strokeLinecap="round" />
      {/* nerve paths */}
      {sig9 > 0.01 && <polyline points={p9.map((p) => p.join(",")).join(" ")} fill="none" stroke={K.nerve9} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" opacity={sig9} />}
      {sig10 > 0.01 && <polyline points={p10.map((p) => p.join(",")).join(" ")} fill="none" stroke={K.nerve10} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" opacity={sig10} />}
      {sig9 > 0.01 && [0, 0.5].map((k) => { const [x, y] = along(p9, (t * 0.7 + k) % 1); return <circle key={k} cx={x} cy={y} r={10} fill={K.glow} stroke={S} strokeWidth={3} opacity={sig9} />; })}
      {sig10 > 0.01 && [0, 0.5].map((k) => { const [x, y] = along(p10, (t * 0.7 + k) % 1); return <circle key={k} cx={x} cy={y} r={10} fill={K.glow} stroke={S} strokeWidth={3} opacity={sig10} />; })}
      {carotid > 0.01 && <circle cx={cb.x} cy={cb.y} r={15 * (hl === "cb" ? pulse(1) : 1)} fill={K.nerve9} stroke={S} strokeWidth={4} opacity={carotid} />}
      {aortic > 0.01 && [[300, 650], [345, 642], [372, 660]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={11 * (hl === "ab" ? pulse(i) : 1)} fill={K.nerve10} stroke={S} strokeWidth={4} opacity={aortic} />
      ))}
      <SvgPill x={150} y={420} text="medulla" size={30} dot={[358, 340]} o={central} />
      <SvgPill x={610} y={530} text="carotid body · IX" size={30} bg={K.nerve9} dot={[cb.x + 8, cb.y + 4]} o={carotid} />
      <SvgPill x={600} y={610} text="aortic bodies · X" size={30} bg={K.nerve10} dot={[378, 662]} o={aortic} />
    </svg>
  );
};

/* ============ TUG OF WAR: cortex (hold) vs brainstem (breathe) ============ */
export const Tug: React.FC<{ w: number; t: number; pos: number }> = ({ w, t, pos }) => {
  // pos -1 = cortex winning (left), +1 = brainstem winning (right)
  const kx = 480 + pos * 120;
  return (
    <svg width={w} height={(w * 300) / 960} viewBox="0 0 960 300">
      <line x1={120} y1={150} x2={840} y2={150} stroke="#C8A86B" strokeWidth={16} strokeLinecap="round" />
      <line x1={480} y1={70} x2={480} y2={230} stroke={C.line} strokeWidth={6} strokeDasharray="10 10" />
      <rect x={kx - 16} y={118} width={32} height={64} rx={8} fill={C.red} stroke={S} strokeWidth={4} />
      <g>
        <rect x={10} y={60} width={220} height={180} rx={28} fill={C.matcha} stroke={S} strokeWidth={5} />
        <text x={120} y={135} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill="#fff">CORTEX</text>
        <text x={120} y={180} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.banana}>"hold it"</text>
      </g>
      <g>
        <rect x={730} y={60} width={220} height={180} rx={28} fill={C.red} stroke={S} strokeWidth={5} />
        <text x={840} y={135} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill="#fff">BRAINSTEM</text>
        <text x={840} y={180} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.banana}>"breathe!"</text>
      </g>
    </svg>
  );
};

/* ============ BREATHING TRACE: normal → hold (flat) → big recovery breaths → normal ============ */
/** viewBox 1000x320. cur 0..1 cursor. */
export const BreathTrace: React.FC<{ w: number; cur: number }> = ({ w, cur }) => {
  const pts: string[] = [];
  const N = 400;
  for (let i = 0; i <= N; i++) {
    const k = i / N;
    if (k > cur) break;
    const x = 30 + k * 940;
    let y = 200;
    if (k < 0.18) y = 180 - 35 * Math.sin(k * 2 * Math.PI * 4.2);
    else if (k < 0.22) y = 180 - 90 * ramp(k, 0.18, 0.22);
    else if (k < 0.55) y = 90 + (k > 0.45 ? 8 * Math.sin(k * 300) * ramp(k, 0.45, 0.55) : 0);
    else {
      const q = (k - 0.55) / 0.45;
      const amp = lerp(90, 35, Math.min(1, q * 1.6));
      y = 180 - amp * Math.sin(q * 2 * Math.PI * 5.2 + Math.PI / 2) ;
    }
    pts.push(`${x},${y}`);
  }
  return (
    <svg width={w} height={(w * 320) / 1000} viewBox="0 0 1000 320">
      <rect x={10} y={10} width={980} height={300} rx={24} fill={C.card} stroke={C.line} strokeWidth={4} />
      <rect x={30 + 0.22 * 940} y={20} width={0.33 * 940} height={280} fill={C.banana} opacity={0.25} />
      <text x={30 + 0.385 * 940} y={300} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={S}>the hold</text>
      <text x={30 + 0.5 * 940} y={60} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={22} fill={C.red} opacity={cur > 0.46 ? 1 : 0}>diaphragm twitches</text>
      <text x={30 + 0.8 * 940} y={300} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={S} opacity={cur > 0.6 ? 1 : 0}>deeper, faster → back to normal</text>
      <polyline points={pts.join(" ")} fill="none" stroke={C.matchaDark} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export { clamp, lerp };
