import React from "react";
import { C, FONT } from "./kit";

const S = C.forest;
const SKIN = "#F2C9B0", SKIN_D = "#E3A98A", DERM = "#F6D8C4";

/* Skin cross-section with one hair follicle, arrector pili muscle and nerve.
   pull 0..1: muscle contracts, hair stands up, skin bumps. nerve 0..1 draws the nerve. stem 0..1 shows stem-cell glow. */
export const SkinFollicle: React.FC<{ w?: number; pull: number; nerve?: number; stem?: number; t: number; labels?: boolean }> = ({ w = 760, pull, nerve = 0, stem = 0, t }) => {
  const bump = 26 * pull;
  const ang = -62 + 50 * pull; // hair angle from horizontal (deg): lying -> standing
  const rad = (ang * Math.PI) / 180;
  const hx = 300, hy = 120 - bump;
  const hairLen = 170;
  // follicle base (tilted)
  const bx = 250, by = 330;
  const mLen = 1 - 0.35 * pull; // muscle shortens
  return (
    <svg width={w} height={w * 0.75} viewBox="0 0 600 450" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="sf-glow">
          <stop offset="0%" stopColor={C.banana} stopOpacity={0.95} />
          <stop offset="100%" stopColor={C.banana} stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* dermis block */}
      <path d={`M20 ${130} C150 130 220 ${130 - bump * 0.2} 260 ${128 - bump * 0.6} C285 ${124 - bump} 315 ${124 - bump} 340 ${128 - bump * 0.6} C380 ${130 - bump * 0.2} 450 130 580 130 L580 430 L20 430 Z`} fill={DERM} stroke={S} strokeWidth={5} />
      {/* epidermis band */}
      <path d={`M20 ${130} C150 130 220 ${130 - bump * 0.2} 260 ${128 - bump * 0.6} C285 ${124 - bump} 315 ${124 - bump} 340 ${128 - bump * 0.6} C380 ${130 - bump * 0.2} 450 130 580 130 L580 160 C450 160 380 ${160 - bump * 0.2} 340 ${158 - bump * 0.6} C315 ${154 - bump} 285 ${154 - bump} 260 ${158 - bump * 0.6} C220 ${160 - bump * 0.2} 150 160 20 160 Z`} fill={SKIN} stroke={S} strokeWidth={4} />
      {/* small vessels */}
      <path d="M40 380 C140 350 220 400 320 370 C420 340 500 390 570 360" stroke={C.red} strokeWidth={5} fill="none" opacity={0.6} />
      {/* follicle sheath */}
      <path d={`M${hx - 18} ${hy + 30} L${bx - 26} ${by} C${bx - 30} ${by + 40} ${bx + 30} ${by + 40} ${bx + 26} ${by} L${hx + 18} ${hy + 30} Z`} fill="#EBC0A4" stroke={S} strokeWidth={4} />
      {/* hair shaft inside */}
      <line x1={bx} y1={by + 10} x2={hx} y2={hy + 10} stroke="#5A4325" strokeWidth={8} strokeLinecap="round" />
      {/* bulb */}
      <ellipse cx={bx} cy={by + 18} rx={26} ry={20} fill="#C98466" stroke={S} strokeWidth={4} />
      {/* stem cell bulge glow */}
      {stem > 0 && (
        <>
          <circle cx={268} cy={255} r={60} fill="url(#sf-glow)" opacity={stem * (0.7 + 0.3 * Math.sin(t * 6))} />
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={258 + (i % 3) * 12} cy={245 + Math.floor(i / 3) * 14} r={6} fill={C.banana} stroke={S} strokeWidth={2} opacity={stem} />
          ))}
        </>
      )}
      {/* arrector pili muscle: from follicle bulge to under epidermis at right */}
      {(() => {
        const ax = 270, ay = 250; // on follicle
        const ex = 420, ey = 175; // anchor near surface
        const mx = ax + (ex - ax) * mLen, my = ay + (ey - ay) * mLen;
        return (
          <g>
            <path d={`M${ax} ${ay} Q${(ax + mx) / 2} ${(ay + my) / 2 + 20 - 14 * pull} ${mx} ${my}`} stroke="#C9483C" strokeWidth={22 + 8 * pull} strokeLinecap="round" fill="none" />
            {[0.25, 0.5, 0.75].map((f) => (
              <line key={f} x1={ax + (mx - ax) * f - 6} y1={ay + (my - ay) * f - 8} x2={ax + (mx - ax) * f + 6} y2={ay + (my - ay) * f + 8} stroke="#8F2A22" strokeWidth={3} />
            ))}
            <line x1={mx} y1={my} x2={ex} y2={ey} stroke="#8F2A22" strokeWidth={4} strokeDasharray="6 6" />
          </g>
        );
      })()}
      {/* nerve */}
      {nerve > 0 && (
        <path
          d="M580 300 C520 300 470 260 420 250 C380 242 340 262 300 258"
          stroke={C.bananaDark}
          strokeWidth={8}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={420}
          strokeDashoffset={420 * (1 - nerve)}
        />
      )}
      {nerve > 0.95 &&
        [0, 1, 2].map((i) => {
          const ph = (t * 1.2 + i / 3) % 1;
          const x = 580 - ph * 280, y = 300 - Math.sin(ph * Math.PI) * 30 - ph * 40;
          return <circle key={i} cx={x} cy={y} r={7} fill={C.banana} stroke={S} strokeWidth={2} />;
        })}
      {/* hair outside */}
      <line x1={hx} y1={hy + 10} x2={hx + Math.cos(rad) * hairLen} y2={hy + 10 + Math.sin(rad) * hairLen} stroke="#5A4325" strokeWidth={7} strokeLinecap="round" />
      {/* neighbouring small hairs */}
      {[90, 500].map((x, i) => (
        <line key={x} x1={x} y1={128} x2={x + Math.cos(rad) * 70} y2={128 + Math.sin(rad) * 70} stroke="#5A4325" strokeWidth={5} strokeLinecap="round" opacity={0.7} />
      ))}
    </svg>
  );
};

/* Cat that puffs up */
export const Cat: React.FC<{ size?: number; puff: number; t: number }> = ({ size = 520, puff, t }) => {
  const spikes = Array.from({ length: 40 }, (_, i) => i);
  const body = (a: number) => {
    // ellipse body centre (300,300) rx 170 ry 100
    return [300 + Math.cos(a) * 170, 300 + Math.sin(a) * 100];
  };
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 600 480" style={{ overflow: "visible" }}>
      <ellipse cx={300} cy={420} rx={220} ry={14} fill={S} opacity={0.12} />
      {/* fur spikes */}
      {spikes.map((i) => {
        const a = Math.PI + (i / 39) * Math.PI;
        const [x, y] = body(a);
        const len = 10 + 40 * puff * (0.7 + 0.3 * Math.sin(i * 1.7));
        return <line key={i} x1={x} y1={y} x2={x + Math.cos(a) * len} y2={y + Math.sin(a) * len} stroke="#3A3A3A" strokeWidth={10} strokeLinecap="round" />;
      })}
      {/* warm air dots */}
      {puff > 0.2 &&
        spikes.filter((i) => i % 3 === 0).map((i) => {
          const a = Math.PI + (i / 39) * Math.PI;
          const [x, y] = body(a);
          return <circle key={`a${i}`} cx={x + Math.cos(a) * 22 * puff} cy={y + Math.sin(a) * 22 * puff} r={6} fill="#E8903A" opacity={0.6 * puff * (0.6 + 0.4 * Math.sin(t * 3 + i))} />;
        })}
      <ellipse cx={300} cy={300} rx={170 + 20 * puff} ry={100 + 14 * puff} fill="#3A3A3A" stroke={S} strokeWidth={5} />
      {/* legs */}
      {[190, 240, 360, 410].map((x) => (
        <rect key={x} x={x - 16} y={340} width={32} height={80} rx={14} fill="#3A3A3A" stroke={S} strokeWidth={5} />
      ))}
      {/* tail */}
      <path d={`M460 280 C${520 + 20 * puff} ${200 - 60 * puff} ${540} ${150 - 40 * puff} ${510} ${110 - 30 * puff}`} stroke="#3A3A3A" strokeWidth={26 + 30 * puff} fill="none" strokeLinecap="round" />
      {/* head */}
      <g transform={`translate(140 ${230 - 10 * puff})`}>
        <path d="M-50 -40 L-40 -95 L-10 -55 Z M50 -40 L40 -95 L10 -55 Z" fill="#3A3A3A" stroke={S} strokeWidth={5} strokeLinejoin="round" />
        <circle cx={0} cy={0} r={62 + 6 * puff} fill="#3A3A3A" stroke={S} strokeWidth={5} />
        <ellipse cx={-22} cy={-8} rx={12} ry={14 + 4 * puff} fill={C.banana} />
        <ellipse cx={22} cy={-8} rx={12} ry={14 + 4 * puff} fill={C.banana} />
        <ellipse cx={-22} cy={-8} rx={3} ry={10} fill={S} />
        <ellipse cx={22} cy={-8} rx={3} ry={10} fill={S} />
        <path d={puff > 0.5 ? "M-14 28 L-6 20 L0 28 L6 20 L14 28" : "M-10 24 C-4 30 4 30 10 24"} stroke={C.paper} strokeWidth={4} fill="none" strokeLinejoin="round" />
      </g>
    </svg>
  );
};

/* Human forearm with sparse hair */
export const Arm: React.FC<{ w?: number; up: number }> = ({ w = 720, up }) => (
  <svg width={w} height={w * 0.4} viewBox="0 0 600 240" style={{ overflow: "visible" }}>
    <path d="M10 90 C150 70 400 60 520 80 C560 86 590 110 590 140 C590 170 560 190 520 190 C400 200 150 190 10 170 Z" fill={SKIN} stroke={S} strokeWidth={6} />
    {Array.from({ length: 14 }, (_, i) => {
      const x = 40 + i * 36, y = 78 - (i % 2) * 4;
      const a = ((-150 + 60 * up) * Math.PI) / 180;
      return <line key={i} x1={x} y1={y} x2={x + Math.cos(a) * 20} y2={y + Math.sin(a) * 20} stroke="#5A4325" strokeWidth={3} strokeLinecap="round" />;
    })}
    {up > 0 &&
      Array.from({ length: 22 }, (_, i) => (
        <circle key={i} cx={30 + ((i * 53) % 520)} cy={110 + ((i * 37) % 60)} r={4 * up} fill={SKIN_D} />
      ))}
  </svg>
);

export const Snowflake: React.FC<{ size?: number; t: number }> = ({ size = 140, t }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <g transform={`rotate(${t * 30} 50 50)`} stroke="#4F8FC8" strokeWidth={6} strokeLinecap="round">
      {[0, 60, 120].map((a) => (
        <g key={a} transform={`rotate(${a} 50 50)`}>
          <line x1={50} y1={10} x2={50} y2={90} />
          <line x1={50} y1={22} x2={40} y2={12} />
          <line x1={50} y1={22} x2={60} y2={12} />
          <line x1={50} y1={78} x2={40} y2={88} />
          <line x1={50} y1={78} x2={60} y2={88} />
        </g>
      ))}
    </g>
  </svg>
);
export const Ghost: React.FC<{ size?: number; t: number }> = ({ size = 140, t }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <g transform={`translate(0 ${Math.sin(t * 3) * 4})`}>
      <path d="M20 90 L20 45 C20 20 80 20 80 45 L80 90 L70 82 L60 90 L50 82 L40 90 L30 82 Z" fill={C.card} stroke={S} strokeWidth={5} strokeLinejoin="round" />
      <ellipse cx={38} cy={48} rx={6} ry={9} fill={S} />
      <ellipse cx={62} cy={48} rx={6} ry={9} fill={S} />
      <ellipse cx={50} cy={66} rx={7} ry={9} fill={S} />
    </g>
  </svg>
);
export const Note: React.FC<{ size?: number }> = ({ size = 140 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M38 76 L38 22 L82 12 L82 66" stroke={S} strokeWidth={7} fill="none" strokeLinejoin="round" />
    <ellipse cx={28} cy={76} rx={14} ry={11} fill={C.matcha} stroke={S} strokeWidth={4} />
    <ellipse cx={72} cy={66} rx={14} ry={11} fill={C.matcha} stroke={S} strokeWidth={4} />
  </svg>
);
export const Clapper: React.FC<{ size?: number; t: number }> = ({ size = 140, t }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x={14} y={40} width={72} height={48} rx={6} fill={S} />
    <g transform={`rotate(${-18 * Math.max(0, Math.sin(t * 4))} 14 36)`}>
      <rect x={14} y={24} width={72} height={14} rx={3} fill={C.paper} stroke={S} strokeWidth={4} />
      {[24, 44, 64].map((x) => (
        <path key={x} d={`M${x} 24 L${x + 10} 38`} stroke={S} strokeWidth={5} />
      ))}
    </g>
    <rect x={24} y={52} width={52} height={6} rx={3} fill={C.banana} />
  </svg>
);
export const Mic: React.FC<{ size?: number }> = ({ size = 140 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x={36} y={10} width={28} height={50} rx={14} fill={C.red} stroke={S} strokeWidth={4} />
    <path d="M26 46 C26 66 74 66 74 46" stroke={S} strokeWidth={5} fill="none" />
    <line x1={50} y1={64} x2={50} y2={86} stroke={S} strokeWidth={5} />
    <line x1={34} y1={88} x2={66} y2={88} stroke={S} strokeWidth={6} strokeLinecap="round" />
  </svg>
);
export const Mouse: React.FC<{ size?: number; hair: number; t: number }> = ({ size = 360, hair, t }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 300 210" style={{ overflow: "visible" }}>
    <ellipse cx={150} cy={196} rx={110} ry={8} fill={S} opacity={0.12} />
    <path d="M240 150 C280 150 290 110 270 90" stroke="#E7A4AB" strokeWidth={8} fill="none" strokeLinecap="round" />
    <ellipse cx={160} cy={140} rx={95} ry={55} fill="#D9D3C7" stroke={S} strokeWidth={5} />
    {/* growing fur patch */}
    {Array.from({ length: 26 }, (_, i) => {
      const x = 100 + (i % 13) * 10, y = 100 + Math.floor(i / 13) * 14;
      const len = 4 + 18 * hair * (0.6 + 0.4 * Math.sin(i * 2.3 + t * 2));
      return <line key={i} x1={x} y1={y} x2={x - 2} y2={y - len} stroke="#7A7468" strokeWidth={3} strokeLinecap="round" />;
    })}
    <circle cx={72} cy={120} r={38} fill="#D9D3C7" stroke={S} strokeWidth={5} />
    <circle cx={60} cy={84} r={18} fill="#E7A4AB" stroke={S} strokeWidth={4} />
    <circle cx={88} cy={82} r={18} fill="#E7A4AB" stroke={S} strokeWidth={4} />
    <circle cx={58} cy={118} r={5} fill={S} />
    <circle cx={36} cy={128} r={6} fill="#C9483C" />
  </svg>
);
export const Toggle: React.FC<{ size?: number; on: number }> = ({ size = 260, on }) => (
  <svg width={size} height={size * 0.5} viewBox="0 0 200 100">
    <rect x={10} y={10} width={180} height={80} rx={40} fill={on > 0.5 ? C.matcha : C.line} stroke={S} strokeWidth={5} />
    <circle cx={50 + 100 * on} cy={50} r={32} fill={C.card} stroke={S} strokeWidth={5} />
    <text x={on > 0.5 ? 60 : 140} y={60} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={on > 0.5 ? C.paper : S}>
      {on > 0.5 ? "ON" : "OFF"}
    </text>
  </svg>
);
