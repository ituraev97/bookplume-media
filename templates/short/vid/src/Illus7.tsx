import React from "react";
import { C } from "./kit";

const S = C.forest;
export const LIVER_D =
  "M40 170 C40 90 140 50 260 55 C380 60 520 70 560 120 C590 160 560 200 500 230 C430 265 360 330 290 385 C260 410 220 405 200 380 C150 320 40 260 40 170 Z";
const CUT = 310;

/**
 * Liver that can be cut at x=CUT.
 * cut: 0..1 dashed line draws; away: 0..1 piece (right side) slides off and fades;
 * regrow: 0..1 remaining part grows back the missing side.
 */
export const LiverCut: React.FC<{ w?: number; cut?: number; away?: number; regrow?: number; id: string; glow?: number; t?: number; pieceOnly?: boolean }> = ({
  w = 600,
  cut = 0,
  away = 0,
  regrow = 1,
  id,
  glow = 0,
  t = 0,
  pieceOnly,
}) => {
  const rightW = (600 - CUT) * (away > 0 ? regrow : 1);
  const pulse = 0.6 + 0.4 * Math.sin(t * 5);
  return (
    <svg width={w} height={w * 0.75} viewBox="0 0 600 450" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={`lc-g-${id}`} cx="40%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#C86A55" />
          <stop offset="55%" stopColor="#9B3F2F" />
          <stop offset="100%" stopColor="#6B2519" />
        </radialGradient>
        <radialGradient id={`lc-h-${id}`}>
          <stop offset="0%" stopColor={C.banana} stopOpacity={0.85} />
          <stop offset="100%" stopColor={C.banana} stopOpacity={0} />
        </radialGradient>
        <clipPath id={`lc-l-${id}`}>
          <rect x={0} y={0} width={CUT} height={450} />
        </clipPath>
        <clipPath id={`lc-r-${id}`}>
          <rect x={CUT} y={0} width={rightW} height={450} />
        </clipPath>
        <clipPath id={`lc-p-${id}`}>
          <rect x={CUT} y={0} width={300} height={450} />
        </clipPath>
      </defs>
      {glow > 0 && <ellipse cx={300} cy={220} rx={330} ry={240} fill={`url(#lc-h-${id})`} opacity={glow * pulse} />}
      <ellipse cx={300} cy={425} rx={240} ry={18} fill={S} opacity={0.12} />
      {!pieceOnly && (
        <>
          <g clipPath={`url(#lc-l-${id})`}>
            <path d={LIVER_D} fill={`url(#lc-g-${id})`} stroke="#4E1910" strokeWidth={6} />
            <path d="M90 140 C120 100 180 80 240 78" stroke="#FFFFFF" strokeWidth={16} strokeLinecap="round" fill="none" opacity={0.3} />
          </g>
          <g clipPath={`url(#lc-r-${id})`}>
            <path d={LIVER_D} fill={away > 0 ? "#B65A45" : `url(#lc-g-${id})`} stroke="#4E1910" strokeWidth={6} />
            <path d="M330 90 C400 88 470 95 520 115" stroke="#FFFFFF" strokeWidth={10} strokeLinecap="round" fill="none" opacity={0.22} />
          </g>
          {away > 0 && regrow < 1 && regrow > 0 && (
            <line x1={CUT + rightW} y1={60} x2={CUT + rightW} y2={300} stroke={C.banana} strokeWidth={8} strokeLinecap="round" opacity={0.9} />
          )}
        </>
      )}
      {/* the removed piece */}
      {(away < 1 || pieceOnly) && (
        <g transform={pieceOnly ? undefined : `translate(${away * 160} ${away * 60}) rotate(${away * 14} 450 150)`} opacity={pieceOnly ? 1 : 1 - away}>
          <g clipPath={`url(#lc-p-${id})`}>
            <path d={LIVER_D} fill={`url(#lc-g-${id})`} stroke="#4E1910" strokeWidth={6} />
          </g>
        </g>
      )}
      {cut > 0 && (
        <line x1={CUT} y1={40} x2={CUT} y2={40 + 330 * cut} stroke={C.banana} strokeWidth={7} strokeDasharray="16 12" strokeLinecap="round" />
      )}
    </svg>
  );
};

/* Simple scalpel */
export const Scalpel: React.FC<{ size?: number }> = ({ size = 220 }) => (
  <svg width={size} height={size * 0.35} viewBox="0 0 200 70">
    <rect x={70} y={26} width={124} height={18} rx={9} fill="#9AA3A8" stroke={S} strokeWidth={4} />
    <path d="M72 26 L8 30 C2 34 10 46 30 46 L72 44 Z" fill="#E6ECEF" stroke={S} strokeWidth={4} strokeLinejoin="round" />
    {[100, 120, 140, 160].map((x) => (
      <line key={x} x1={x} y1={30} x2={x} y2={40} stroke="#6F787D" strokeWidth={3} />
    ))}
  </svg>
);

/* Person with a small liver inside */
export const Person: React.FC<{ h?: number; tone: string; children?: React.ReactNode }> = ({ h = 520, tone, children }) => (
  <div style={{ position: "relative", width: h * 0.55, height: h }}>
    <svg width={h * 0.55} height={h} viewBox="0 0 220 400" style={{ position: "absolute" }}>
      <ellipse cx={110} cy={392} rx={80} ry={8} fill={S} opacity={0.12} />
      <circle cx={110} cy={52} r={40} fill={tone} stroke={S} strokeWidth={5} />
      <path d="M50 120 C50 100 70 92 110 92 C150 92 170 100 170 120 L176 260 L150 262 L146 390 L118 390 L110 280 L102 390 L74 390 L70 262 L44 260 Z" fill={tone} stroke={S} strokeWidth={5} strokeLinejoin="round" />
    </svg>
    <div style={{ position: "absolute", left: h * 0.55 * 0.18, top: h * 0.36 }}>{children}</div>
  </div>
);

/* Calendar */
export const Calendar: React.FC<{ size?: number; label: string; flip: number }> = ({ size = 200, label, flip }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x={10} y={16} width={80} height={74} rx={10} fill={C.card} stroke={S} strokeWidth={4} />
    <rect x={10} y={16} width={80} height={22} rx={10} fill={C.red} />
    <rect x={10} y={30} width={80} height={8} fill={C.red} />
    <rect x={28} y={8} width={6} height={16} rx={3} fill={S} />
    <rect x={66} y={8} width={6} height={16} rx={3} fill={S} />
    <g transform={`translate(50 66) scale(1 ${Math.max(0.05, Math.abs(Math.cos(flip * Math.PI)))}) translate(-50 -66)`}>
      <text x={50} y={74} textAnchor="middle" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight={800} fontSize={19} fill={S}>
        {label}
      </text>
    </g>
  </svg>
);

/* Greek vase panel: Prometheus on the rock, eagle, sun/moon cycle */
const TERRA = "#C8693A";
const BLK = "#1E140E";
export const VasePanel: React.FC<{ w?: number; t: number; eagle: number; night: number; regrow: number; draw: number }> = ({ w = 820, t, eagle, night, regrow, draw }) => {
  const flap = Math.sin(t * 8) * 18;
  const ex = 700 - 230 * eagle;
  const ey = 90 + 90 * eagle + Math.sin(t * 3) * 6;
  const sky = night;
  const meander = (y: number) => {
    let d = "";
    for (let x = 20; x < 800; x += 40) d += `M${x} ${y + 18} L${x} ${y} L${x + 30} ${y} L${x + 30} ${y + 12} L${x + 12} ${y + 12} L${x + 12} ${y + 6} `;
    return d;
  };
  return (
    <svg width={w} height={w * 0.8} viewBox="0 0 820 656" style={{ overflow: "visible" }}>
      <defs>
        <clipPath id="vp-c">
          <rect x={20} y={50} width={780} height={556} rx={20} />
        </clipPath>
      </defs>
      <rect x={10} y={10} width={800} height={636} rx={28} fill={BLK} />
      <path d={meander(22)} stroke={TERRA} strokeWidth={5} fill="none" />
      <path d={meander(614)} stroke={TERRA} strokeWidth={5} fill="none" />
      <g clipPath="url(#vp-c)" opacity={draw}>
        <rect x={20} y={50} width={780} height={556} fill={TERRA} />
        <rect x={20} y={50} width={780} height={556} fill="#2B2350" opacity={sky * 0.55} />
        {/* sun / moon */}
        <g transform={`rotate(${-70 + sky * 140} 410 700)`}>
          <circle cx={410} cy={130} r={42} fill="#F4C26B" stroke={BLK} strokeWidth={5} />
        </g>
        <g transform={`rotate(${-140 + sky * 140} 410 700)`}>
          <path d="M410 88 A42 42 0 1 0 452 150 A34 34 0 1 1 410 88 Z" fill="#EDE6C9" stroke={BLK} strokeWidth={5} />
        </g>
        {/* rock */}
        <path d="M60 606 L120 420 L210 360 L330 380 L420 470 L470 606 Z" fill={BLK} />
        <path d="M150 440 L200 400 M260 420 L320 430 M140 520 L210 500" stroke={TERRA} strokeWidth={4} opacity={0.6} />
        {/* Prometheus (black-figure) */}
        <g>
          <circle cx={262} cy={262} r={30} fill={BLK} />
          <path d="M240 240 C250 222 278 222 288 238" stroke={TERRA} strokeWidth={4} fill="none" />
          <path d="M236 292 C226 330 228 370 240 400 L300 400 C310 370 310 330 292 292 Z" fill={BLK} />
          {/* arms up to chains */}
          <path d="M240 300 L180 240 M292 300 L352 240" stroke={BLK} strokeWidth={18} strokeLinecap="round" />
          <path d="M180 240 L150 200 M352 240 L382 200" stroke={BLK} strokeWidth={4} strokeDasharray="8 6" />
          <path d="M248 400 L238 470 L214 480 M292 400 L300 470 L326 478" stroke={BLK} strokeWidth={18} strokeLinecap="round" fill="none" />
          {/* liver glow on torso */}
          <path d="M252 330 C262 318 290 318 296 332 C292 348 270 356 252 348 Z" fill={C.red} stroke={TERRA} strokeWidth={2} transform={`translate(274 336) scale(${0.3 + 0.7 * regrow}) translate(-274 -336)`} />
        </g>
        {/* eagle */}
        <g transform={`translate(${ex} ${ey})`}>
          <path d={`M0 0 C-30 ${-20 - flap} -80 ${-40 - flap} -120 ${-30 - flap} C-90 -10 -50 0 -20 8 Z`} fill={BLK} />
          <path d={`M10 0 C40 ${-20 - flap} 90 ${-40 - flap} 120 ${-26 - flap} C90 -6 50 2 20 8 Z`} fill={BLK} />
          <ellipse cx={0} cy={10} rx={34} ry={16} fill={BLK} />
          <circle cx={-34} cy={2} r={12} fill={BLK} />
          <path d="M-44 0 L-60 8 L-44 8 Z" fill={BLK} />
          <path d="M30 10 L60 4 L56 22 Z" fill={BLK} />
        </g>
      </g>
    </svg>
  );
};

/* Organ silhouette tile with cross */
export const Crossed: React.FC<{ p: number; size?: number; children: React.ReactNode }> = ({ p, size = 170, children }) => (
  <div style={{ position: "relative", width: size, height: size }}>
    <div style={{ opacity: 1 - 0.55 * p }}>{children}</div>
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", left: 0, top: 0 }}>
      <path d="M18 18 L82 82" stroke={C.red} strokeWidth={9} strokeLinecap="round" strokeDasharray={92} strokeDashoffset={92 * (1 - Math.min(1, p * 2))} />
      <path d="M82 18 L18 82" stroke={C.red} strokeWidth={9} strokeLinecap="round" strokeDasharray={92} strokeDashoffset={92 * (1 - Math.max(0, p * 2 - 1))} />
    </svg>
  </div>
);
