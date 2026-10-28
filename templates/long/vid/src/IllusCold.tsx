import React from "react";
import { C, FONT } from "./kit";

const S = C.forest;
const SKIN = "#F2C9B0";
const VIR = "#7FB36B", VIR_D = "#4E7D3A";

/* Rhinovirus particle: icosahedral-ish body with surface knobs */
export const Virus: React.FC<{ size?: number; t?: number; color?: string; dark?: string; spin?: number }> = ({ size = 120, t = 0, color = VIR, dark = VIR_D, spin = 1 }) => (
  <svg width={size} height={size} viewBox="-60 -60 120 120" style={{ overflow: "visible" }}>
    <g transform={`rotate(${t * 25 * spin})`}>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <circle key={i} cx={Math.cos(a) * 44} cy={Math.sin(a) * 44} r={9} fill={dark} stroke={S} strokeWidth={3} />;
      })}
      <polygon points="0,-42 36,-21 36,21 0,42 -36,21 -36,-21" fill={color} stroke={S} strokeWidth={4} />
      <polygon points="0,-42 36,-21 0,0" fill="#FFFFFF" opacity={0.18} />
      <polygon points="0,0 36,21 0,42" fill={S} opacity={0.1} />
      <circle cx={-12} cy={-6} r={6} fill={dark} />
      <circle cx={14} cy={10} r={5} fill={dark} />
      <circle cx={2} cy={-22} r={4} fill={dark} />
    </g>
  </svg>
);

/* Side profile of a head; virus particles drift into the nostril (p 0..1) */
export const HeadProfile: React.FC<{ w?: number; t: number; p: number; red?: number }> = ({ w = 900, t, p, red = 0 }) => (
  <svg width={w} height={w * 0.75} viewBox="0 0 800 600" style={{ overflow: "visible" }}>
    <path d="M520 560 L500 470 C560 450 600 430 610 400 C618 378 600 368 612 350 C630 330 660 320 650 300 C640 284 616 290 620 270 C630 230 600 180 560 140 C500 80 400 60 320 80 C220 104 160 190 170 290 C176 360 210 410 260 440 L250 560 Z" fill={SKIN} stroke={S} strokeWidth={7} strokeLinejoin="round" />
    <path d="M320 80 C380 40 480 40 540 90 C560 110 570 140 560 140 C500 90 420 90 330 110 Z" fill="#5A4325" stroke={S} strokeWidth={6} />
    <ellipse cx={520} cy={250} rx={16} ry={20} fill={S} />
    <path d="M500 225 C512 214 532 214 544 222" stroke={S} strokeWidth={6} fill="none" strokeLinecap="round" />
    <path d="M590 372 C570 380 560 392 572 400" stroke={S} strokeWidth={5} fill="none" strokeLinecap="round" />
    <path d="M600 330 C620 332 634 326 642 316" stroke={S} strokeWidth={5} fill="none" strokeLinecap="round" />
    <ellipse cx={612} cy={334} rx={46} ry={22} fill="#E8796B" opacity={0.5 * red} />
    {Array.from({ length: 7 }, (_, i) => {
      const k = Math.max(0, Math.min(1, p * 1.6 - i * 0.09));
      const x0 = 780 + i * 18, y0 = 140 + i * 50;
      const x = x0 + (628 - x0) * k, y = y0 + (326 - y0) * k + Math.sin(t * 2 + i) * 14 * (1 - k);
      const s = 1 - 0.7 * k;
      return (
        <g key={i} transform={`translate(${x} ${y}) scale(${0.45 * s})`} opacity={k >= 1 ? 0 : 1}>
          <Virus size={120} t={t + i} />
        </g>
      );
    })}
  </svg>
);

/* Grid of viruses; n shown, the first highlighted */
export const VirusGrid: React.FC<{ w?: number; n: number; t: number; hi?: number }> = ({ w = 960, n, t, hi = 0 }) => {
  const cols = 20, cell = 960 / cols;
  const colors = ["#7FB36B", "#E8903A", "#4F74B8", "#C9483C", "#8FA86A", "#B05677", "#D9B52E"];
  return (
    <svg width={w} height={w * 0.5} viewBox="0 0 960 480">
      {Array.from({ length: 200 }, (_, i) => {
        if (i >= n) return null;
        const x = (i % cols) * cell + cell / 2, y = Math.floor(i / cols) * cell + cell / 2;
        const isR = i < 100 && hi > 0;
        const col = isR ? "#7FB36B" : colors[(i * 7) % colors.length];
        const r = 15 + 2 * Math.sin(t * 3 + i);
        return (
          <g key={i} opacity={hi > 0 && !isR ? 0.35 : 1}>
            <circle cx={x} cy={y} r={r} fill={col} stroke={S} strokeWidth={2.5} />
            <circle cx={x - 4} cy={y - 4} r={3} fill="#FFFFFF" opacity={0.5} />
          </g>
        );
      })}
    </svg>
  );
};

/* Face sneezing with droplet spray (p 0..1) */
export const Sneeze: React.FC<{ w?: number; t: number; p: number }> = ({ w = 900, t, p }) => (
  <svg width={w} height={w * 0.66} viewBox="0 0 900 600" style={{ overflow: "visible" }}>
    <circle cx={220} cy={300} r={170} fill={SKIN} stroke={S} strokeWidth={7} />
    <path d="M90 220 C120 110 300 90 360 200 C300 160 160 170 90 220 Z" fill="#5A4325" stroke={S} strokeWidth={6} />
    <path d="M220 270 C236 262 250 262 262 272" stroke={S} strokeWidth={7} fill="none" strokeLinecap="round" />
    <path d="M300 270 C312 262 326 262 340 272" stroke={S} strokeWidth={7} fill="none" strokeLinecap="round" />
    <ellipse cx={340} cy={360} rx={34} ry={28 + 14 * p} fill={S} />
    <ellipse cx={370} cy={320} rx={20} ry={26} fill="#E8796B" stroke={S} strokeWidth={5} />
    {Array.from({ length: 40 }, (_, i) => {
      const a = -0.55 + (i % 10) * 0.11 + Math.sin(i) * 0.05;
      const d = (60 + (i * 37) % 420) * p;
      const x = 380 + Math.cos(a) * d, y = 350 + Math.sin(a) * d + d * d * 0.0004;
      const r = 4 + (i % 4) * 3;
      return <circle key={i} cx={x} cy={y} r={r} fill="#7FB0D8" opacity={p > 0 ? 0.85 - 0.5 * (d / 480) : 0} stroke={S} strokeWidth={1.5} />;
    })}
    {p > 0.6 &&
      [0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${620 + i * 90} ${300 + Math.sin(t * 2 + i) * 20 + i * 30}) scale(0.4)`}>
          <Virus size={120} t={t + i} />
        </g>
      ))}
  </svg>
);

export const DoorHandle: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x={30} y={10} width={30} height={80} rx={8} fill="#C9CED2" stroke={S} strokeWidth={4} />
    <rect x={40} y={40} width={50} height={16} rx={8} fill="#9AA3A8" stroke={S} strokeWidth={4} />
    <circle cx={45} cy={72} r={5} fill={S} />
  </svg>
);
export const PhoneIcon: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x={28} y={6} width={44} height={88} rx={9} fill={S} />
    <rect x={32} y={14} width={36} height={68} rx={4} fill="#DDEBEA" />
    <circle cx={50} cy={88} r={3} fill={C.paper} />
  </svg>
);
export const Keyboard: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x={6} y={30} width={88} height={44} rx={6} fill="#C9CED2" stroke={S} strokeWidth={4} />
    {Array.from({ length: 24 }, (_, i) => (
      <rect key={i} x={12 + (i % 8) * 10} y={36 + Math.floor(i / 8) * 11} width={8} height={8} rx={2} fill={C.card} stroke={S} strokeWidth={1.5} />
    ))}
  </svg>
);
export const Hand: React.FC<{ size?: number; rot?: number }> = ({ size = 220, rot = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
    <g transform={`rotate(${rot} 50 70)`}>
      <rect x={30} y={42} width={40} height={46} rx={14} fill={SKIN} stroke={S} strokeWidth={4} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={31 + i * 10} y={12 + Math.abs(i - 1.5) * 4} width={9} height={36} rx={4.5} fill={SKIN} stroke={S} strokeWidth={3} />
      ))}
      <rect x={14} y={44} width={22} height={10} rx={5} fill={SKIN} stroke={S} strokeWidth={3} transform="rotate(-35 25 49)" />
    </g>
  </svg>
);
export const Soap: React.FC<{ size?: number; t: number }> = ({ size = 220, t }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
    <rect x={30} y={36} width={40} height={52} rx={10} fill="#8FBCE0" stroke={S} strokeWidth={4} />
    <rect x={44} y={20} width={12} height={18} rx={3} fill={C.card} stroke={S} strokeWidth={3} />
    <path d="M56 24 L72 24" stroke={S} strokeWidth={4} strokeLinecap="round" />
    {[0, 1, 2, 3, 4].map((i) => {
      const ph = (t * 0.6 + i * 0.2) % 1;
      return <circle key={i} cx={20 + i * 16} cy={30 - ph * 30} r={4 + i % 3 * 2} fill="none" stroke="#4F8FC8" strokeWidth={2} opacity={1 - ph} />;
    })}
  </svg>
);

/* Timeline of days with highlighted band a..b (in days) */
export const DayLine: React.FC<{ w?: number; days?: number; bands: { a: number; b: number; color: string; label: string; k: number }[]; marker?: number }> = ({ w = 1000, days = 4, bands, marker }) => {
  const x = (d: number) => 40 + (d / days) * 920;
  return (
    <svg width={w} height={w * 0.42} viewBox="0 0 1000 420" style={{ overflow: "visible" }}>
      <line x1={40} y1={300} x2={960} y2={300} stroke={S} strokeWidth={6} strokeLinecap="round" />
      {Array.from({ length: days + 1 }, (_, i) => (
        <g key={i}>
          <line x1={x(i)} y1={285} x2={x(i)} y2={315} stroke={S} strokeWidth={5} />
          <text x={x(i)} y={360} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={S}>
            {i === 0 ? "exposure" : `day ${i}`}
          </text>
        </g>
      ))}
      {bands.map((b, i) => (
        <g key={i} opacity={b.k}>
          <rect x={x(b.a)} y={220 - i * 90} width={(x(b.b) - x(b.a)) * b.k} height={60} rx={30} fill={b.color} stroke={S} strokeWidth={4} />
          <text x={x(b.a) + 24} y={260 - i * 90} fontFamily={FONT} fontWeight={800} fontSize={28} fill={b.color === C.banana ? S : C.paper}>
            {b.label}
          </text>
        </g>
      ))}
      {marker !== undefined && <circle cx={x(marker)} cy={300} r={16} fill={C.red} stroke={S} strokeWidth={4} />}
    </svg>
  );
};

/* Hexagon cell sheet; states: infected count, alarm wave 0..1 */
export const CellSheet: React.FC<{ w?: number; t: number; infected: number; alarm: number; spread?: number }> = ({ w = 1000, t, infected, alarm, spread = 0 }) => {
  const R = 46, cols = 11, rows = 6;
  const cells: React.ReactNode[] = [];
  const cx0 = 5, cy0 = 3;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const x = 60 + c * R * 1.75 + (r % 2) * R * 0.875, y = 60 + r * R * 1.5;
      const dist = Math.hypot(c - cx0, r - cy0);
      const inf = dist < 0.5 ? infected : dist < 1.6 + 4 * spread ? spread : 0;
      const alerted = alarm > 0 && dist <= alarm * 7 && inf < 0.5;
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = Math.PI / 6 + (i * Math.PI) / 3;
        return `${x + Math.cos(a) * R * 0.95},${y + Math.sin(a) * R * 0.95}`;
      }).join(" ");
      cells.push(
        <g key={`${r}-${c}`}>
          <polygon points={pts} fill={inf > 0.5 ? "#E8796B" : alerted ? "#FFF0B8" : "#F6D8C4"} stroke={alerted ? C.bananaDark : S} strokeWidth={alerted ? 5 : 3} />
          <circle cx={x} cy={y} r={10} fill={inf > 0.5 ? C.redDark : "#C98466"} />
          {alerted && <path d={`M${x - 12} ${y - 22} L${x} ${y - 30} L${x + 12} ${y - 22} L${x + 12} ${y - 10} C${x + 12} ${y - 2} ${x} ${y + 4} ${x} ${y + 4} C${x} ${y + 4} ${x - 12} ${y - 2} ${x - 12} ${y - 10} Z`} fill={C.banana} stroke={S} strokeWidth={2} opacity={0.9} />}
        </g>
      );
    }
  const cxp = 60 + cx0 * R * 1.75 + (cy0 % 2) * R * 0.875, cyp = 60 + cy0 * R * 1.5;
  return (
    <svg width={w} height={w * 0.56} viewBox="0 0 1000 560" style={{ overflow: "visible" }}>
      {cells}
      {alarm > 0 && alarm < 1 &&
        [0, 1, 2].map((i) => {
          const ph = (alarm * 2 + i / 3) % 1;
          return <circle key={i} cx={cxp} cy={cyp} r={40 + ph * 420} fill="none" stroke={C.bananaDark} strokeWidth={6} opacity={1 - ph} />;
        })}
      {infected > 0.5 && (
        <g transform={`translate(${cxp + 30} ${cyp - 40}) scale(0.35)`}>
          <Virus size={120} t={t} />
        </g>
      )}
    </svg>
  );
};

/* Nasal passage cross-section: swelling 0..1, mucus 0..1, immune cells flowing */
export const NasalSection: React.FC<{ w?: number; t: number; swell: number; mucus: number; immune: number }> = ({ w = 1000, t, swell, mucus, immune }) => {
  const gap = 150 - 90 * swell;
  return (
    <svg width={w} height={w * 0.6} viewBox="0 0 1000 600" style={{ overflow: "visible" }}>
      {/* upper wall */}
      <path d={`M40 60 L960 60 L960 ${300 - gap / 2 - 20} C800 ${300 - gap / 2 + 10 * Math.sin(t)} 600 ${300 - gap / 2 - 30} 400 ${300 - gap / 2} C250 ${300 - gap / 2 + 10} 120 ${300 - gap / 2 - 20} 40 ${300 - gap / 2} Z`} fill="#F6D8C4" stroke={S} strokeWidth={6} />
      <path d={`M40 540 L960 540 L960 ${300 + gap / 2 + 20} C800 ${300 + gap / 2 - 10 * Math.sin(t)} 600 ${300 + gap / 2 + 30} 400 ${300 + gap / 2} C250 ${300 + gap / 2 - 10} 120 ${300 + gap / 2 + 20} 40 ${300 + gap / 2} Z`} fill="#F6D8C4" stroke={S} strokeWidth={6} />
      {/* vessels widening */}
      {[120, 480].map((y, i) => (
        <path key={y} d={`M60 ${y} C300 ${y + (i ? -30 : 30)} 600 ${y + (i ? 30 : -30)} 940 ${y}`} stroke={C.red} strokeWidth={10 + 22 * swell} fill="none" opacity={0.75} strokeLinecap="round" />
      ))}
      {/* immune cells along vessels */}
      {immune > 0 &&
        Array.from({ length: 10 }, (_, i) => {
          const ph = (t * 0.25 + i / 10) % 1;
          const y = i % 2 ? 120 : 480;
          return <circle key={i} cx={60 + ph * 880} cy={y + Math.sin(ph * 6) * 20} r={14} fill={C.card} stroke={C.matcha} strokeWidth={6} opacity={immune} />;
        })}
      {/* mucus */}
      {mucus > 0 && (
        <>
          <path d={`M40 ${300 - gap / 2 + 4} C300 ${300 - gap / 2 + 20 * mucus} 600 ${300 - gap / 2 + 10} 960 ${300 - gap / 2 - 6} L960 ${300 - gap / 2 + 30 * mucus} C600 ${300 - gap / 2 + 40 * mucus} 300 ${300 - gap / 2 + 50 * mucus} 40 ${300 - gap / 2 + 40 * mucus} Z`} fill="#CFE3A8" opacity={0.85} />
          {Array.from({ length: 6 }, (_, i) => {
            const ph = (t * 0.4 + i / 6) % 1;
            return <circle key={i} cx={960 - ph * 920} cy={300 + Math.sin(i * 2) * (gap / 4)} r={10 * mucus} fill="#B8D58A" stroke={S} strokeWidth={2} />;
          })}
        </>
      )}
      {/* cilia */}
      {Array.from({ length: 30 }, (_, i) => {
        const x = 50 + i * 31;
        const yb = 300 + gap / 2 + 8;
        const sw = Math.sin(t * 6 + i * 0.6) * 8;
        return <line key={i} x1={x} y1={yb} x2={x + sw} y2={yb - 20} stroke={C.matchaDark} strokeWidth={3} strokeLinecap="round" />;
      })}
    </svg>
  );
};

/* Symptom intensity over days 0..14, with phase reveal p */
export const SymptomCurve: React.FC<{ w?: number; p: number; phases: number[]; cough: number }> = ({ w = 1000, p, phases, cough }) => {
  const x = (d: number) => 60 + (d / 14) * 880;
  const f = (d: number) => {
    if (d < 1) return 0.1 * d;
    if (d < 4) return 0.1 + 0.6 * ((d - 1) / 3);
    if (d < 7) return 0.7 + 0.25 * Math.sin(((d - 4) / 3) * Math.PI);
    if (d < 10) return 0.7 - 0.55 * ((d - 7) / 3);
    return 0.15 - 0.1 * ((d - 10) / 4);
  };
  const y = (v: number) => 420 - v * 340;
  let d = `M${x(0)} ${y(0)}`;
  for (let i = 1; i <= 140 * p; i++) d += ` L${x(i / 10)} ${y(f(i / 10))}`;
  const ph = [
    { a: 0, b: 3, c: "#8FA86A", l: "early" },
    { a: 4, b: 7, c: C.red, l: "peak" },
    { a: 8, b: 10, c: "#4F8FC8", l: "easing" },
  ];
  return (
    <svg width={w} height={w * 0.55} viewBox="0 0 1000 550" style={{ overflow: "visible" }}>
      {ph.map((q, i) => (
        <g key={i} opacity={phases[i] ?? 0}>
          <rect x={x(q.a)} y={60} width={x(q.b) - x(q.a)} height={360} fill={q.c} opacity={0.15} />
          <text x={(x(q.a) + x(q.b)) / 2} y={50} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={q.c}>
            {q.l}
          </text>
        </g>
      ))}
      <line x1={60} y1={420} x2={960} y2={420} stroke={S} strokeWidth={5} />
      {[0, 2, 4, 6, 8, 10, 12, 14].map((dd) => (
        <text key={dd} x={x(dd)} y={460} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={S}>
          {dd}
        </text>
      ))}
      <text x={510} y={505} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={26} fill={C.matcha}>
        days since symptoms started
      </text>
      <path d={d} stroke={S} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {cough > 0 && <path d={`M${x(10)} ${y(0.12)} C${x(11.5)} ${y(0.15)} ${x(13)} ${y(0.1)} ${x(14)} ${y(0.12)} L980 ${y(0.12)}`} stroke={C.bananaDark} strokeWidth={7} strokeDasharray="14 12" fill="none" opacity={cough} />}
    </svg>
  );
};

export const House: React.FC<{ w?: number; t: number; snow: number }> = ({ w = 700, t, snow }) => (
  <svg width={w} height={w * 0.85} viewBox="0 0 700 600" style={{ overflow: "visible" }}>
    <path d="M90 260 L350 60 L610 260 Z" fill={C.red} stroke={S} strokeWidth={7} strokeLinejoin="round" />
    <rect x={130} y={250} width={440} height={300} fill="#F4E6CC" stroke={S} strokeWidth={7} />
    <rect x={190} y={320} width={320} height={170} rx={12} fill="#FFF0B8" stroke={S} strokeWidth={6} />
    {[0, 1, 2, 3].map((i) => (
      <g key={i} transform={`translate(${240 + i * 75} ${430 + Math.sin(t * 2 + i) * 4})`}>
        <circle cx={0} cy={-40} r={20} fill={SKIN} stroke={S} strokeWidth={4} />
        <rect x={-22} y={-20} width={44} height={60} rx={14} fill={[C.matcha, "#4F74B8", C.red, C.bananaDark][i]} stroke={S} strokeWidth={4} />
      </g>
    ))}
    {snow > 0 &&
      Array.from({ length: 30 }, (_, i) => {
        const ph = (t * 0.15 + (i * 0.37) % 1) % 1;
        return <circle key={i} cx={(i * 97) % 700} cy={ph * 600} r={4 + (i % 3) * 2} fill="#FFFFFF" stroke="#9FB6C9" strokeWidth={1.5} opacity={snow} />;
      })}
  </svg>
);

export const Thermo: React.FC<{ h?: number; level: number; color: string; label: string }> = ({ h = 460, level, color, label }) => (
  <svg width={h * 0.45} height={h} viewBox="0 0 120 260" style={{ overflow: "visible" }}>
    <rect x={44} y={10} width={32} height={190} rx={16} fill={C.card} stroke={S} strokeWidth={5} />
    <rect x={52} y={20 + 170 * (1 - level)} width={16} height={180 - 170 * (1 - level)} rx={8} fill={color} />
    <circle cx={60} cy={215} r={30} fill={color} stroke={S} strokeWidth={5} />
    {[0, 1, 2, 3, 4].map((i) => (
      <line key={i} x1={80} y1={40 + i * 35} x2={92} y2={40 + i * 35} stroke={S} strokeWidth={3} />
    ))}
    <text x={60} y={258} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={0} fill={S}>
      {label}
    </text>
  </svg>
);

export const PillCross: React.FC<{ size?: number; cross: number }> = ({ size = 260, cross }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <g transform="rotate(-35 50 50)">
      <rect x={18} y={38} width={64} height={24} rx={12} fill={C.card} stroke={S} strokeWidth={4} />
      <rect x={18} y={38} width={32} height={24} rx={12} fill={C.red} stroke={S} strokeWidth={4} />
    </g>
    <path d="M14 14 L86 86" stroke={C.red} strokeWidth={9} strokeLinecap="round" strokeDasharray={102} strokeDashoffset={102 * (1 - cross)} />
  </svg>
);

export const Bottle: React.FC<{ size?: number; label: string; color: string }> = ({ size = 180, label, color }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 100 130">
    <rect x={30} y={8} width={40} height={16} rx={4} fill={S} />
    <rect x={20} y={24} width={60} height={96} rx={14} fill={color} stroke={S} strokeWidth={4} />
    <rect x={26} y={56} width={48} height={34} rx={6} fill={C.card} />
    <text x={50} y={79} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={label.length > 4 ? 11 : 16} fill={S}>
      {label}
    </text>
  </svg>
);

export const CheckRow: React.FC<{ text: string; ok: boolean; k: number }> = ({ text, ok, k }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 22, opacity: k, transform: `translateX(${(1 - k) * -40}px)`, fontFamily: FONT, fontWeight: 800, fontSize: 40, color: S }}>
    <div style={{ width: 64, height: 64, borderRadius: 32, background: ok ? C.matcha : C.red, color: C.paper, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>{ok ? "✓" : "!"}</div>
    {text}
  </div>
);
