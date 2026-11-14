import React from "react";
import { C, FONT } from "./kit";

const S = C.forest;

/* Simple standing figure; h = total height in px of the drawing area */
export const Figure: React.FC<{ h?: number; tone?: string; shirt?: string; squash?: number; t?: number }> = ({ h = 600, tone = "#F2C9B0", shirt = C.matcha, squash = 0, t = 0 }) => {
  const sy = 1 - 0.04 * squash;
  return (
    <svg width={h * 0.45} height={h} viewBox="0 0 180 400" style={{ overflow: "visible" }}>
      <ellipse cx={90} cy={396} rx={60} ry={6} fill={S} opacity={0.12} />
      <g transform={`translate(0 ${400 * (1 - sy)}) scale(1 ${sy})`}>
        <circle cx={90} cy={46} r={32} fill={tone} stroke={S} strokeWidth={5} />
        <circle cx={80} cy={44} r={3.5} fill={S} />
        <circle cx={100} cy={44} r={3.5} fill={S} />
        <path d="M80 58 C86 64 94 64 100 58" stroke={S} strokeWidth={4} fill="none" strokeLinecap="round" />
        <path d="M44 110 C44 92 62 84 90 84 C118 84 136 92 136 110 L140 230 L118 232 L114 392 L94 392 L90 260 L86 392 L66 392 L62 232 L40 230 Z" fill={shirt} stroke={S} strokeWidth={5} strokeLinejoin="round" />
        <path d="M62 232 L118 232 L114 392 L94 392 L90 260 L86 392 L66 392 Z" fill="#3E5C9A" stroke={S} strokeWidth={5} strokeLinejoin="round" />
      </g>
    </svg>
  );
};

/* Sun or moon badge */
export const Sky: React.FC<{ size?: number; night?: boolean; t: number }> = ({ size = 120, night, t }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    {night ? (
      <>
        <path d="M60 14 A36 36 0 1 0 86 70 A28 28 0 1 1 60 14 Z" fill="#EDE6C9" stroke={S} strokeWidth={4} />
        {[[20, 20], [84, 28], [30, 84]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={3 + Math.sin(t * 4 + i) * 1.2} fill={C.banana} />
        ))}
      </>
    ) : (
      <g transform={`rotate(${t * 20} 50 50)`}>
        {Array.from({ length: 8 }, (_, i) => (
          <rect key={i} x={47} y={4} width={6} height={16} rx={3} fill={C.bananaDark} transform={`rotate(${i * 45} 50 50)`} />
        ))}
        <circle cx={50} cy={50} r={26} fill={C.banana} stroke={S} strokeWidth={4} />
      </g>
    )}
  </svg>
);

/* Door frame with a ruler and pencil marks */
export const DoorFrame: React.FC<{ w?: number; m1: number; m2: number }> = ({ w = 420, m1, m2 }) => (
  <svg width={w} height={w * 2} viewBox="0 0 200 400" style={{ overflow: "visible" }}>
    <rect x={20} y={10} width={160} height={390} fill="#F4E6CC" stroke={S} strokeWidth={5} />
    <rect x={20} y={10} width={22} height={390} fill="#C99A63" stroke={S} strokeWidth={4} />
    <rect x={158} y={10} width={22} height={390} fill="#C99A63" stroke={S} strokeWidth={4} />
    {/* ruler on the left jamb */}
    {Array.from({ length: 28 }, (_, i) => (
      <line key={i} x1={42} y1={40 + i * 10} x2={i % 5 === 0 ? 60 : 52} y2={40 + i * 10} stroke={S} strokeWidth={2} />
    ))}
    {/* morning mark (higher) */}
    <line x1={42} y1={92} x2={42 + 116 * m1} y2={92} stroke={C.bananaDark} strokeWidth={5} strokeLinecap="round" />
    {/* night mark (lower) */}
    <line x1={42} y1={104} x2={42 + 116 * m2} y2={104} stroke={C.red} strokeWidth={5} strokeLinecap="round" />
  </svg>
);

/* Stack of vertebrae with discs. squash 0..1 flattens discs; drops 0..1 squeezes water out (or back in) */
export const SpineStack: React.FC<{ w?: number; n?: number; squash: number; drops: number; t: number; build?: number; inward?: boolean; glow?: number }> = ({
  w = 520,
  n = 6,
  squash,
  drops,
  t,
  build = 1,
  inward,
  glow = 0,
}) => {
  const VB = 70;
  const disc = 34 - 18 * squash;
  const total = n * VB + (n - 1) * disc;
  const top = 20 + (6 * VB + 5 * 34 - total);
  const items: React.ReactNode[] = [];
  let y = top;
  for (let i = 0; i < n; i++) {
    const k = Math.max(0, Math.min(1, build * n - i));
    if (k <= 0) break;
    items.push(
      <g key={`v${i}`} opacity={k} transform={`translate(0 ${(1 - k) * -40})`}>
        <path d={`M110 ${y + 6} C110 ${y - 2} 290 ${y - 2} 290 ${y + 6} L292 ${y + VB - 6} C292 ${y + VB + 2} 108 ${y + VB + 2} 108 ${y + VB - 6} Z`} fill="#F3E9D2" stroke={S} strokeWidth={5} />
        <path d={`M290 ${y + 20} L370 ${y + 30} C384 ${y + 34} 384 ${y + 50} 370 ${y + 54} L290 ${y + 52}`} fill="#E6D8B8" stroke={S} strokeWidth={5} strokeLinejoin="round" />
        <path d={`M130 ${y + 16} C170 ${y + 10} 230 ${y + 10} 270 ${y + 16}`} stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={0.6} fill="none" />
      </g>
    );
    y += VB;
    if (i < n - 1) {
      const k2 = Math.max(0, Math.min(1, build * n - i - 0.5));
      if (k2 > 0) {
        const bulge = 8 * squash;
        items.push(
          <g key={`d${i}`} opacity={k2}>
            <path d={`M${116 - bulge} ${y + disc / 2} C${116 - bulge} ${y - 2} ${284 + bulge} ${y - 2} ${284 + bulge} ${y + disc / 2} C${284 + bulge} ${y + disc + 2} ${116 - bulge} ${y + disc + 2} ${116 - bulge} ${y + disc / 2} Z`} fill={glow > 0 ? C.banana : "#7FB0D8"} stroke={S} strokeWidth={4} />
            <ellipse cx={200} cy={y + disc / 2} rx={40} ry={Math.max(3, disc / 4)} fill="#B9D7EE" opacity={0.9} />
            {/* droplets */}
            {drops > 0 &&
              [-1, 1].map((side) =>
                [0, 1].map((j) => {
                  const ph = (t * 0.9 + j * 0.5 + i * 0.13) % 1;
                  const d = inward ? 1 - ph : ph;
                  const dx = side * (100 + d * 70);
                  return (
                    <path
                      key={`${side}${j}`}
                      d={`M${200 + dx} ${y + disc / 2 - 9} C${200 + dx + 7} ${y + disc / 2} ${200 + dx + 7} ${y + disc / 2 + 9} ${200 + dx} ${y + disc / 2 + 9} C${200 + dx - 7} ${y + disc / 2 + 9} ${200 + dx - 7} ${y + disc / 2} ${200 + dx} ${y + disc / 2 - 9} Z`}
                      fill="#4F8FC8"
                      opacity={drops * (1 - d) * 0.9}
                    />
                  );
                })
              )}
          </g>
        );
      }
      y += disc;
    }
  }
  return (
    <svg width={w} height={w * 1.3} viewBox="0 0 400 520" style={{ overflow: "visible" }}>
      {items}
    </svg>
  );
};

/* Gravity arrows pressing down */
export const GravityArrows: React.FC<{ w?: number; p: number; t: number }> = ({ w = 520, p, t }) => (
  <svg width={w} height={w * 0.3} viewBox="0 0 400 120">
    {[90, 200, 310].map((x, i) => {
      const bob = Math.sin(t * 5 + i) * 6 * p;
      return (
        <g key={x} opacity={p} transform={`translate(0 ${bob})`}>
          <rect x={x - 9} y={0} width={18} height={70} rx={9} fill={S} />
          <path d={`M${x - 30} 66 L${x + 30} 66 L${x} 110 Z`} fill={S} />
        </g>
      );
    })}
  </svg>
);

/* Person lying in bed */
export const Bed: React.FC<{ w?: number; t: number }> = ({ w = 780, t }) => (
  <svg width={w} height={w * 0.5} viewBox="0 0 600 300" style={{ overflow: "visible" }}>
    <rect x={20} y={150} width={560} height={90} rx={20} fill="#B9844F" stroke={S} strokeWidth={6} />
    <rect x={20} y={110} width={30} height={170} rx={10} fill="#9A6B3C" stroke={S} strokeWidth={6} />
    <rect x={550} y={140} width={30} height={140} rx={10} fill="#9A6B3C" stroke={S} strokeWidth={6} />
    <rect x={60} y={110} width={120} height={50} rx={24} fill={C.card} stroke={S} strokeWidth={5} />
    <circle cx={130} cy={104} r={36} fill="#F2C9B0" stroke={S} strokeWidth={5} />
    <path d="M114 104 C118 108 124 108 128 104 M138 104 C142 108 148 108 152 104" stroke={S} strokeWidth={4} fill="none" strokeLinecap="round" />
    <path d={`M170 ${116 + Math.sin(t * 1.8) * 3} C260 ${90 + Math.sin(t * 1.8) * 5} 420 ${100 + Math.sin(t * 1.8) * 4} 540 ${120} L540 160 L170 160 Z`} fill={C.matchaLight} stroke={S} strokeWidth={5} strokeLinejoin="round" />
    {["z", "Z", "z"].map((z, i) => {
      const ph = (t * 0.5 + i / 3) % 1;
      return (
        <text key={i} x={180 + ph * 80 + i * 10} y={70 - ph * 70} fontFamily={FONT} fontWeight={800} fontSize={28 + i * 8} fill={S} opacity={1 - ph}>
          {z}
        </text>
      );
    })}
  </svg>
);

/* Astronaut floating */
export const Astronaut: React.FC<{ size?: number; t: number; stretch: number }> = ({ size = 420, t, stretch }) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 300 420" style={{ overflow: "visible" }}>
    <g transform={`translate(150 210) rotate(${Math.sin(t * 0.8) * 8}) translate(-150 -210)`}>
      {/* pack */}
      <rect x={95} y={130} width={110} height={140} rx={18} fill="#C9CED2" stroke={S} strokeWidth={6} />
      {/* body */}
      <g transform={`translate(150 260) scale(1 ${1 + 0.06 * stretch}) translate(-150 -260)`}>
        <rect x={100} y={150} width={100} height={150} rx={40} fill="#F4F4F0" stroke={S} strokeWidth={6} />
        <rect x={125} y={200} width={50} height={34} rx={8} fill={C.matcha} stroke={S} strokeWidth={4} />
      </g>
      {/* arms */}
      <rect x={58} y={170} width={44} height={110} rx={22} fill="#F4F4F0" stroke={S} strokeWidth={6} transform={`rotate(${30 + Math.sin(t * 1.2) * 10} 80 180)`} />
      <rect x={198} y={170} width={44} height={110} rx={22} fill="#F4F4F0" stroke={S} strokeWidth={6} transform={`rotate(${-30 - Math.sin(t * 1.2) * 10} 220 180)`} />
      {/* legs */}
      <rect x={104} y={290 + 18 * stretch} width={42} height={110} rx={20} fill="#F4F4F0" stroke={S} strokeWidth={6} transform={`rotate(${8 + Math.sin(t) * 6} 125 300)`} />
      <rect x={154} y={290 + 18 * stretch} width={42} height={110} rx={20} fill="#F4F4F0" stroke={S} strokeWidth={6} transform={`rotate(${-8 - Math.sin(t) * 6} 175 300)`} />
      {/* helmet */}
      <circle cx={150} cy={100} r={66} fill="#F4F4F0" stroke={S} strokeWidth={6} />
      <ellipse cx={150} cy={104} rx={46} ry={38} fill="#2B3A55" stroke={S} strokeWidth={5} />
      <path d="M122 90 C130 78 146 74 160 76" stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" opacity={0.7} fill="none" />
    </g>
  </svg>
);

export const Earth: React.FC<{ w?: number; t: number }> = ({ w = 1000, t }) => (
  <svg width={w} height={w * 0.4} viewBox="0 0 1000 400">
    <defs>
      <clipPath id="earthc">
        <circle cx={500} cy={900} r={760} />
      </clipPath>
    </defs>
    <circle cx={500} cy={900} r={780} fill="#BFD9EF" opacity={0.6} />
    <circle cx={500} cy={900} r={760} fill="#4F8FC8" stroke={S} strokeWidth={6} />
    <g clipPath="url(#earthc)">
      {[
        [200, 210, 140, 50],
        [560, 180, 180, 60],
        [820, 260, 120, 40],
        [380, 300, 160, 50],
      ].map(([x, y, rx, ry], i) => (
        <ellipse key={i} cx={(x + t * 20) % 1100} cy={y} rx={rx} ry={ry} fill={C.matcha} opacity={0.85} />
      ))}
    </g>
  </svg>
);

/* Height sign at a ride */
export const RideSign: React.FC<{ size?: number }> = ({ size = 220 }) => (
  <svg width={size} height={size * 1.6} viewBox="0 0 100 160">
    <rect x={44} y={40} width={12} height={118} rx={4} fill="#9A6B3C" stroke={S} strokeWidth={3} />
    <rect x={8} y={6} width={84} height={56} rx={10} fill={C.banana} stroke={S} strokeWidth={4} />
    <text x={50} y={26} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={11} fill={S}>
      YOU MUST BE
    </text>
    <text x={50} y={42} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={11} fill={S}>
      THIS TALL
    </text>
    <path d="M30 52 L70 52" stroke={C.red} strokeWidth={4} strokeLinecap="round" />
  </svg>
);
export const FormDoc: React.FC<{ size?: number }> = ({ size = 220 }) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 100 130">
    <rect x={10} y={10} width={80} height={110} rx={8} fill={C.card} stroke={S} strokeWidth={4} />
    <rect x={34} y={4} width={32} height={14} rx={4} fill={C.matcha} stroke={S} strokeWidth={3} />
    {[34, 54, 74, 94].map((y) => (
      <g key={y}>
        <rect x={20} y={y} width={30} height={6} rx={3} fill={C.line} />
        <rect x={56} y={y - 2} width={26} height={10} rx={3} fill="none" stroke={S} strokeWidth={2} />
      </g>
    ))}
    <text x={69} y={60} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={9} fill={C.red}>
      HEIGHT
    </text>
  </svg>
);
export const Phone: React.FC<{ size?: number; t: number }> = ({ size = 220, t }) => (
  <svg width={size} height={size * 1.6} viewBox="0 0 100 160">
    <rect x={10} y={4} width={80} height={152} rx={14} fill={S} />
    <rect x={16} y={14} width={68} height={132} rx={8} fill={C.card} />
    <circle cx={50} cy={50} r={20} fill="#F2C9B0" stroke={S} strokeWidth={3} />
    <rect x={26} y={80} width={48} height={8} rx={4} fill={C.line} />
    <text x={50} y={104} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={13} fill={S}>
      6'0"
    </text>
    <path transform={`translate(50 126) scale(${1 + 0.15 * Math.max(0, Math.sin(t * 6))})`} d="M0 6 C-14 -4 -8 -14 0 -7 C8 -14 14 -4 0 6 Z" fill={C.red} />
  </svg>
);

/* Book Plume logo mark (reversed) */
export const LogoMark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    {[13, 23, 42].map((x) => (
      <rect key={x} x={x} y={17} width={9} height={34} rx={4.5} fill={C.paper} />
    ))}
    <rect x={31} y={13} width={9} height={38} rx={4.5} fill={C.banana} transform="rotate(16 35.5 51)" />
  </svg>
);
