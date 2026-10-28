import React from "react";
import { C, FONT } from "./kit";

/* All illustrations are pure SVG with gradients, highlights and shadows. */

const Shadow: React.FC<{ cx: number; cy: number; rx: number; ry?: number; o?: number }> = ({ cx, cy, rx, ry, o = 0.14 }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={ry ?? rx * 0.12} fill={C.forest} opacity={o} />
);

export const Lungs: React.FC<{ size?: number; breathe?: number; dust?: number; t?: number }> = ({ size = 520, breathe = 0, dust = 0, t = 0 }) => {
  const s = 1 + 0.035 * breathe;
  const particles = Array.from({ length: 34 }, (_, i) => {
    const seed = (i * 97.13) % 1;
    const ph = ((t * 0.35 + i / 34) % 1);
    const x = 250 + Math.sin(i * 2.3) * 40 * (1 - ph) + Math.sin(t * 2 + i) * 6;
    const y = -40 + ph * 300 + seed * 4;
    return { x: x + (i % 2 ? 1 : -1) * ph * (60 + (i % 5) * 18), y, r: 3 + (i % 4) * 1.6, o: Math.sin(ph * Math.PI) };
  });
  return (
    <svg width={size} height={size} viewBox="0 0 500 500" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="lg-l" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#F4A79A" />
          <stop offset="55%" stopColor={C.redLight} />
          <stop offset="100%" stopColor={C.red} />
        </radialGradient>
        <linearGradient id="lg-t" x1="0" x2="1">
          <stop offset="0%" stopColor="#E9DCC8" />
          <stop offset="50%" stopColor="#FFF6E6" />
          <stop offset="100%" stopColor="#D6C6AE" />
        </linearGradient>
      </defs>
      <Shadow cx={250} cy={470} rx={190} />
      <g transform={`translate(250 260) scale(${s}) translate(-250 -260)`}>
        {/* left lung */}
        <path
          d="M215 120 C150 110 85 170 70 260 C58 335 62 410 95 440 C130 470 190 455 215 420 C228 400 230 340 228 280 C226 210 232 150 215 120 Z"
          fill="url(#lg-l)"
          stroke={C.redDark}
          strokeWidth={5}
        />
        {/* right lung */}
        <path
          d="M285 120 C350 110 415 170 430 260 C442 335 438 410 405 440 C370 470 310 455 285 420 C272 400 270 340 272 280 C274 210 268 150 285 120 Z"
          fill="url(#lg-l)"
          stroke={C.redDark}
          strokeWidth={5}
        />
        {/* lobe fissures */}
        <path d="M80 330 C130 310 180 300 222 270" stroke={C.redDark} strokeWidth={4} fill="none" opacity={0.55} />
        <path d="M420 300 C380 300 330 285 280 255" stroke={C.redDark} strokeWidth={4} fill="none" opacity={0.55} />
        <path d="M425 370 C380 370 330 360 282 330" stroke={C.redDark} strokeWidth={4} fill="none" opacity={0.55} />
        {/* highlights */}
        <path d="M110 200 C125 160 160 140 190 138" stroke="#FFFFFF" strokeWidth={12} strokeLinecap="round" fill="none" opacity={0.45} />
        <path d="M310 140 C345 140 380 160 395 195" stroke="#FFFFFF" strokeWidth={12} strokeLinecap="round" fill="none" opacity={0.45} />
        {/* bronchial tree */}
        <g stroke="#FFF3E2" strokeLinecap="round" fill="none" opacity={0.9}>
          <path d="M250 175 L250 215 M250 215 C230 230 205 240 185 270 M250 215 C270 230 295 240 315 270" strokeWidth={14} />
          <path d="M185 270 C165 300 150 330 140 370 M185 270 C190 310 175 350 170 400 M185 270 C160 280 130 285 110 300" strokeWidth={8} />
          <path d="M315 270 C335 300 350 330 360 370 M315 270 C310 310 325 350 330 400 M315 270 C340 280 370 285 390 300" strokeWidth={8} />
          <path d="M140 370 L120 400 M140 370 L150 410 M360 370 L380 400 M360 370 L350 410 M110 300 L95 330 M390 300 L405 330" strokeWidth={4} />
        </g>
        {/* trachea */}
        <rect x={232} y={30} width={36} height={160} rx={16} fill="url(#lg-t)" stroke="#9C8A6E" strokeWidth={4} />
        {Array.from({ length: 9 }, (_, i) => (
          <line key={i} x1={234} x2={266} y1={46 + i * 16} y2={46 + i * 16} stroke="#B7A383" strokeWidth={4} />
        ))}
      </g>
      {dust > 0 &&
        particles.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={i % 3 ? "#7B6B58" : "#A89880"} opacity={p.o * dust} />
        ))}
    </svg>
  );
};

export const Beyond: React.FC<{ p: number; size?: number }> = ({ p, size = 520 }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 500 400" style={{ overflow: "visible" }}>
    <defs>
      <linearGradient id="by-a" x1="0" x2="1">
        <stop offset="0%" stopColor={C.matchaLight} />
        <stop offset="100%" stopColor={C.matcha} />
      </linearGradient>
      <linearGradient id="by-w" x1="0" x2="1">
        <stop offset="0%" stopColor="#2E3D1E" />
        <stop offset="50%" stopColor={C.forest} />
        <stop offset="100%" stopColor="#141C0C" />
      </linearGradient>
    </defs>
    <Shadow cx={250} cy={370} rx={220} />
    <rect x={190} y={60} width={34} height={300} rx={10} fill="url(#by-w)" />
    <rect x={195} y={66} width={7} height={288} rx={3} fill="#FFFFFF" opacity={0.2} />
    <text x={207} y={45} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={C.forest} letterSpacing={2}>
      LIMIT
    </text>
    <text x={90} y={330} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={24} fill={C.forest} opacity={0.5}>normal</text>
    <text x={380} y={330} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={C.matcha} opacity={p}>BEYOND</text>
    <g transform={`translate(${-220 + p * 300} 0)`}>
      {[0, 1, 2].map((i) => (
        <line key={i} x1={-40 - i * 34} x2={0 - i * 34} y1={180 + i * 16} y2={180 + i * 16} stroke={C.matcha} strokeWidth={7} strokeLinecap="round" opacity={(0.6 - i * 0.15) * p} />
      ))}
      <path d="M20 185 L200 185 L200 150 L270 205 L200 260 L200 225 L20 225 Z" fill="url(#by-a)" stroke={C.forest} strokeWidth={6} strokeLinejoin="round" />
      <path d="M30 193 L195 193" stroke="#FFFFFF" strokeWidth={6} opacity={0.5} strokeLinecap="round" />
    </g>
    <rect x={190} y={60} width={34} height={300} rx={10} fill="none" stroke={C.forest} strokeWidth={4} />
  </svg>
);

export const Microscope: React.FC<{ size?: number; zoom?: number }> = ({ size = 520, zoom = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 500 500" style={{ overflow: "visible" }}>
    <defs>
      <linearGradient id="ms-b" x1="0" x2="1">
        <stop offset="0%" stopColor="#3A4A28" />
        <stop offset="45%" stopColor={C.matcha} />
        <stop offset="100%" stopColor="#2C3A1A" />
      </linearGradient>
      <linearGradient id="ms-m" x1="0" x2="1">
        <stop offset="0%" stopColor="#9AA0A6" />
        <stop offset="45%" stopColor="#F2F4F5" />
        <stop offset="100%" stopColor="#7C838A" />
      </linearGradient>
      <radialGradient id="ms-v" cx="40%" cy="40%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#E7EFD9" />
      </radialGradient>
    </defs>
    <Shadow cx={210} cy={470} rx={170} />
    {/* base */}
    <path d="M70 440 Q70 410 100 410 L330 410 Q360 410 360 440 L360 455 L70 455 Z" fill="url(#ms-b)" stroke={C.forest} strokeWidth={5} />
    {/* arm */}
    <path d="M250 410 C250 330 300 300 300 230 C300 170 270 140 240 120 L215 150 C240 170 255 195 255 230 C255 280 210 320 210 410 Z" fill="url(#ms-b)" stroke={C.forest} strokeWidth={5} />
    {/* stage */}
    <rect x={95} y={300} width={190} height={22} rx={6} fill="url(#ms-m)" stroke={C.forest} strokeWidth={4} />
    <rect x={150} y={292} width={80} height={10} rx={3} fill="#D7EEF5" stroke={C.forest} strokeWidth={3} />
    {/* tube */}
    <g transform="rotate(-22 190 150)">
      <rect x={160} y={40} width={62} height={190} rx={10} fill="url(#ms-m)" stroke={C.forest} strokeWidth={5} />
      <rect x={150} y={20} width={82} height={34} rx={8} fill="url(#ms-b)" stroke={C.forest} strokeWidth={5} />
      <rect x={172} y={228} width={38} height={44} rx={6} fill="url(#ms-m)" stroke={C.forest} strokeWidth={5} />
      <rect x={168} y={60} width={8} height={150} rx={4} fill="#FFFFFF" opacity={0.6} />
    </g>
    {/* focus knob */}
    <circle cx={275} cy={300} r={26} fill="url(#ms-m)" stroke={C.forest} strokeWidth={5} />
    <circle cx={275} cy={300} r={9} fill={C.forest} />
    {/* magnified view bubble */}
    <g opacity={zoom} transform={`translate(380 170) scale(${0.6 + 0.4 * zoom})`}>
      <circle r={105} fill="url(#ms-v)" stroke={C.forest} strokeWidth={7} />
      {Array.from({ length: 16 }, (_, i) => (
        <circle key={i} cx={Math.cos(i * 2.4) * (20 + (i * 13) % 70)} cy={Math.sin(i * 2.4) * (20 + (i * 13) % 70)} r={4 + (i % 4) * 2.5} fill={i % 2 ? "#8B7B66" : "#B5A68F"} stroke={C.forest} strokeWidth={1.5} />
      ))}
      <path d="M-70 -50 A90 90 0 0 1 -20 -88" stroke="#FFFFFF" strokeWidth={10} strokeLinecap="round" fill="none" opacity={0.8} />
    </g>
  </svg>
);

export const Sand: React.FC<{ size?: number; p?: number }> = ({ size = 520, p = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 500 500" style={{ overflow: "visible" }}>
    <defs>
      <linearGradient id="sd-h" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F1DFA8" />
        <stop offset="100%" stopColor="#C9A863" />
      </linearGradient>
      <linearGradient id="sd-c" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor="#DDEFF3" />
        <stop offset="100%" stopColor="#A9CBD3" />
      </linearGradient>
    </defs>
    <Shadow cx={250} cy={470} rx={210} />
    {/* sand pile */}
    <path d="M40 460 C110 330 190 300 250 300 C310 300 390 330 460 460 Z" fill="url(#sd-h)" stroke="#8C6E35" strokeWidth={5} />
    {Array.from({ length: 60 }, (_, i) => (
      <circle key={i} cx={90 + ((i * 53) % 320)} cy={360 + ((i * 37) % 90)} r={2 + (i % 3)} fill="#A5843F" opacity={0.6} />
    ))}
    {/* silica crystal */}
    <g transform={`translate(250 ${210 - 20 * p}) scale(${0.5 + 0.5 * p})`} opacity={p}>
      <polygon points="0,-150 60,-90 60,60 0,120 -60,60 -60,-90" fill="url(#sd-c)" stroke={C.forest} strokeWidth={6} strokeLinejoin="round" />
      <polygon points="0,-150 60,-90 0,-60 -60,-90" fill="#FFFFFF" opacity={0.75} />
      <line x1={0} y1={-60} x2={0} y2={120} stroke={C.forest} strokeWidth={3} opacity={0.4} />
      <polygon points="-60,-90 0,-60 0,120 -60,60" fill="#BFDDE4" opacity={0.5} />
      <path d="M-40 -60 L-40 30" stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" opacity={0.8} />
      <text x={0} y={30} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill={C.forest}>
        SiO₂
      </text>
    </g>
  </svg>
);

export const Volcano: React.FC<{ size?: number; t?: number; erupt?: number }> = ({ size = 560, t = 0, erupt = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 500 500" style={{ overflow: "visible" }}>
    <defs>
      <linearGradient id="vc-m" x1="0" x2="1">
        <stop offset="0%" stopColor="#5D4A3A" />
        <stop offset="50%" stopColor="#7E6650" />
        <stop offset="100%" stopColor="#3F3227" />
      </linearGradient>
      <linearGradient id="vc-l" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={C.banana} />
        <stop offset="60%" stopColor="#F08A3C" />
        <stop offset="100%" stopColor={C.red} />
      </linearGradient>
      <radialGradient id="vc-a" cx="50%" cy="50%">
        <stop offset="0%" stopColor="#9C9488" />
        <stop offset="100%" stopColor="#6E675D" />
      </radialGradient>
    </defs>
    <Shadow cx={250} cy={472} rx={230} />
    {/* ash clouds */}
    {Array.from({ length: 9 }, (_, i) => {
      const k = ((t * 0.3 + i / 9) % 1) * erupt;
      return (
        <circle key={i} cx={250 + Math.sin(i * 1.7) * 70 * k + (i % 2 ? 30 : -30) * k} cy={170 - k * 170} r={28 + 40 * k} fill="url(#vc-a)" opacity={(1 - k) * 0.85} stroke={C.forest} strokeWidth={3} strokeOpacity={0.25} />
      );
    })}
    {/* mountain */}
    <path d="M20 465 L195 185 Q250 165 305 185 L480 465 Z" fill="url(#vc-m)" stroke={C.forest} strokeWidth={6} strokeLinejoin="round" />
    <path d="M195 185 Q250 205 305 185 Q290 175 250 172 Q210 175 195 185 Z" fill="#2B211A" />
    {/* lava streams */}
    <path d="M225 192 C215 240 230 270 205 320 C195 345 200 370 190 400" stroke="url(#vc-l)" strokeWidth={18} fill="none" strokeLinecap="round" />
    <path d="M272 192 C285 230 270 260 295 300 C305 320 300 340 312 360" stroke="url(#vc-l)" strokeWidth={13} fill="none" strokeLinecap="round" />
    {/* rock texture */}
    <path d="M110 380 l40 -10 M330 330 l35 8 M360 420 l40 -6 M80 440 l30 -4 M150 300 l25 -6" stroke="#2B211A" strokeWidth={5} strokeLinecap="round" opacity={0.45} />
    <path d="M200 200 L120 330" stroke="#FFFFFF" strokeWidth={6} opacity={0.15} strokeLinecap="round" />
    {/* glow */}
    <ellipse cx={250} cy={182} rx={52} ry={14} fill={C.banana} opacity={0.75} />
  </svg>
);

export const Dust: React.FC<{ size?: number; t?: number }> = ({ size = 520, t = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 500 500" style={{ overflow: "visible" }}>
    <defs>
      <radialGradient id="ds-g" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#C9BBA4" />
        <stop offset="100%" stopColor="#7B6B58" />
      </radialGradient>
    </defs>
    {/* Greek tablet */}
    <g transform="translate(250 120)">
      <rect x={-190} y={-75} width={380} height={150} rx={20} fill="#EFE8D6" stroke={C.forest} strokeWidth={6} />
      <rect x={-178} y={-63} width={356} height={16} rx={7} fill="#FFFFFF" opacity={0.6} />
      <text y={30} textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontWeight={700} fontSize={88} fill={C.forest}>
        κόνις
      </text>
    </g>
    {/* swirling dust */}
    {Array.from({ length: 110 }, (_, i) => {
      const a = i * 2.39996 + t * (0.6 + (i % 5) * 0.08);
      const r = 20 + ((i * 41) % 210);
      return <circle key={i} cx={250 + Math.cos(a) * r} cy={350 + Math.sin(a) * r * 0.42} r={3.5 + (i % 5) * 2.2} fill="url(#ds-g)" opacity={0.55 + (i % 3) * 0.15} />;
    })}
    <Shadow cx={250} cy={470} rx={170} o={0.08} />
  </svg>
);

export const Chart: React.FC<{ size?: number }> = ({ size = 520 }) => (
  <svg width={size} height={size} viewBox="0 0 500 500" style={{ overflow: "visible" }}>
    <defs>
      <linearGradient id="ch-b" x1="0" x2="1">
        <stop offset="0%" stopColor="#8A6A44" />
        <stop offset="50%" stopColor="#B08A5B" />
        <stop offset="100%" stopColor="#7A5C38" />
      </linearGradient>
    </defs>
    <Shadow cx={250} cy={478} rx={170} />
    <rect x={95} y={40} width={310} height={420} rx={24} fill="url(#ch-b)" stroke={C.forest} strokeWidth={6} />
    <rect x={120} y={80} width={260} height={360} rx={10} fill={C.card} stroke={C.forest} strokeWidth={4} />
        <rect x={190} y={22} width={120} height={50} rx={12} fill="#C9CED3" stroke={C.forest} strokeWidth={5} />
    <rect x={200} y={30} width={100} height={10} rx={5} fill="#FFFFFF" opacity={0.6} />
    {/* red cross */}
    <g transform="translate(250 160)">
      <rect x={-18} y={-50} width={36} height={100} rx={6} fill={C.red} />
      <rect x={-50} y={-18} width={100} height={36} rx={6} fill={C.red} />
    </g>
    {[250, 290, 330, 370, 405].map((y, i) => (
      <g key={y}>
        <rect x={145} y={y - 12} width={22} height={22} rx={5} fill="none" stroke={C.forest} strokeWidth={3} />
        {i < 2 && <path d={`M149 ${y} l6 6 l10 -12`} stroke={C.matcha} strokeWidth={5} fill="none" strokeLinecap="round" />}
        <rect x={180} y={y - 6} width={170 - (i % 3) * 30} height={10} rx={5} fill={C.line} />
      </g>
    ))}
  </svg>
);

export const Brick: React.FC<{ w?: number; color: string; dark: string; label: string; textColor?: string }> = ({ w = 240, color, dark, label, textColor = C.forest }) => {
  const studs = Math.max(2, Math.round(w / 80));
  return (
    <svg width={w} height={150} viewBox={`0 0 ${w} 150`} style={{ overflow: "visible" }}>
      {Array.from({ length: studs }, (_, i) => {
        const cx = (w / studs) * (i + 0.5);
        return (
          <g key={i}>
            <rect x={cx - 26} y={8} width={52} height={30} rx={6} fill={dark} />
            <ellipse cx={cx} cy={8} rx={26} ry={9} fill={color} stroke={dark} strokeWidth={3} />
            <ellipse cx={cx - 8} cy={5} rx={10} ry={3} fill="#FFFFFF" opacity={0.5} />
          </g>
        );
      })}
      <rect x={0} y={30} width={w} height={115} rx={14} fill={dark} />
      <rect x={0} y={26} width={w} height={106} rx={14} fill={color} />
      <rect x={10} y={34} width={w - 20} height={12} rx={6} fill="#FFFFFF" opacity={0.35} />
      <text x={w / 2} y={98} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={38} fill={textColor} letterSpacing={1}>
        {label}
      </text>
    </svg>
  );
};

export const Heart: React.FC<{ size?: number; beat?: number }> = ({ size = 440, beat = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 500 500" style={{ overflow: "visible" }}>
    <defs>
      <radialGradient id="ht-g" cx="38%" cy="32%" r="75%">
        <stop offset="0%" stopColor="#F29A8C" />
        <stop offset="50%" stopColor={C.red} />
        <stop offset="100%" stopColor={C.redDark} />
      </radialGradient>
      <linearGradient id="ht-a" x1="0" x2="1">
        <stop offset="0%" stopColor="#B2453A" />
        <stop offset="50%" stopColor="#E06A5C" />
        <stop offset="100%" stopColor="#8F2A22" />
      </linearGradient>
      <linearGradient id="ht-v" x1="0" x2="1">
        <stop offset="0%" stopColor="#3E5C9A" />
        <stop offset="50%" stopColor="#6F8FCC" />
        <stop offset="100%" stopColor="#2F477A" />
      </linearGradient>
    </defs>
    <g transform={`translate(250 270) scale(${1 + beat * 0.05}) translate(-250 -270)`}>
      {/* vessels */}
      <path d="M215 150 C210 90 230 55 280 50 C330 46 350 80 352 115" stroke="url(#ht-a)" strokeWidth={42} fill="none" strokeLinecap="round" />
      <path d="M352 115 L360 150" stroke="url(#ht-a)" strokeWidth={30} strokeLinecap="round" />
      <path d="M245 55 L240 20 M280 50 L282 12 M312 55 L322 22" stroke="url(#ht-a)" strokeWidth={18} strokeLinecap="round" />
      <path d="M170 170 C160 120 150 90 140 70" stroke="url(#ht-v)" strokeWidth={36} fill="none" strokeLinecap="round" />
      {/* body */}
      <path
        d="M250 445 C190 400 110 340 105 255 C100 185 150 140 205 145 C235 148 252 165 262 185 C275 160 305 140 345 145 C400 152 420 210 410 265 C398 340 320 400 250 445 Z"
        fill="url(#ht-g)"
        stroke={C.redDark}
        strokeWidth={6}
      />
      {/* coronary vessels */}
      <path d="M262 190 C250 250 260 320 250 420" stroke="#7A221B" strokeWidth={6} fill="none" opacity={0.7} />
      <path d="M255 260 C230 280 200 290 160 300 M258 320 C290 330 330 320 370 300" stroke="#7A221B" strokeWidth={4} fill="none" opacity={0.6} />
      <path d="M140 210 C150 180 175 165 200 165" stroke="#FFFFFF" strokeWidth={14} strokeLinecap="round" fill="none" opacity={0.45} />
    </g>
  </svg>
);

export const Monitor: React.FC<{ w?: number; bpm: number; t: number; label: string; color: string }> = ({ w = 820, bpm, t, label, color }) => {
  const h = 250;
  const period = 60 / bpm;
  const pxPerSec = 160;
  const pts: string[] = [];
  for (let x = 0; x <= w - 300; x += 3) {
    const tt = t - (w - 300 - x) / pxPerSec;
    const ph = ((tt % period) + period) % period;
    let y = 0;
    const q = ph / 0.06;
    if (ph < 0.04) y = -10 * Math.sin((ph / 0.04) * Math.PI);
    else if (ph > 0.06 && ph < 0.09) y = 14;
    else if (ph >= 0.09 && ph < 0.13) y = -95 * Math.sin(((ph - 0.09) / 0.04) * Math.PI);
    else if (ph >= 0.13 && ph < 0.16) y = 22;
    else if (ph > 0.3 && ph < 0.42) y = -22 * Math.sin(((ph - 0.3) / 0.12) * Math.PI);
    void q;
    pts.push(`${30 + x},${h / 2 + 20 + y}`);
  }
  const blink = (((t % period) + period) % period) < 0.15;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id={`mn-${label}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2B3A1C" />
          <stop offset="100%" stopColor={C.forest} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={w} height={h} rx={30} fill={`url(#mn-${label})`} stroke="#0F160A" strokeWidth={5} />
      <rect x={14} y={12} width={w - 28} height={10} rx={5} fill="#FFFFFF" opacity={0.08} />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1={30 + i * 45} x2={30 + i * 45} y1={30} y2={h - 30} stroke="#FFFFFF" opacity={0.06} strokeWidth={2} />
      ))}
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
      <rect x={w - 270} y={30} width={2} height={h - 60} fill="#FFFFFF" opacity={0.15} />
      <text x={w - 140} y={92} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.paper} opacity={0.75} letterSpacing={2}>
        {label}
      </text>
      <text x={w - 140} y={175} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={88} fill={color}>
        {bpm}
      </text>
      <text x={w - 140} y={215} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={24} fill={C.paper} opacity={0.6}>
        BPM
      </text>
      <path d="M0 0" />
      <g transform={`translate(${w - 230} 150) scale(${blink ? 1.15 : 1})`}>
        <path d="M0 8 C-14 -4 -14 -18 -4 -18 C0 -18 0 -14 0 -12 C0 -14 0 -18 4 -18 C14 -18 14 -4 0 8 Z" fill={color} />
      </g>
    </svg>
  );
};

export const Vessel: React.FC<{ w?: number; balloon: number; open: number }> = ({ w = 840, balloon, open }) => {
  const h = 380;
  const narrow = 1 - open;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="vs-w" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E58F82" />
          <stop offset="50%" stopColor={C.red} />
          <stop offset="100%" stopColor={C.redDark} />
        </linearGradient>
        <linearGradient id="vs-in" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7A221B" />
          <stop offset="50%" stopColor="#A8352B" />
          <stop offset="100%" stopColor="#7A221B" />
        </linearGradient>
        <linearGradient id="vs-p" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F7E39A" />
          <stop offset="100%" stopColor="#D2B04A" />
        </linearGradient>
        <linearGradient id="vs-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E9F2F5" />
          <stop offset="100%" stopColor="#9FC0CB" />
        </linearGradient>
      </defs>
      <ellipse cx={w / 2} cy={h - 18} rx={w * 0.45} ry={14} fill={C.forest} opacity={0.12} />
      {/* outer wall */}
      <rect x={10} y={60} width={w - 20} height={250} rx={125} fill="url(#vs-w)" stroke={C.redDark} strokeWidth={6} />
      <rect x={30} y={72} width={w - 60} height={18} rx={9} fill="#FFFFFF" opacity={0.3} />
      {/* lumen */}
      <rect x={10} y={110} width={w - 20} height={150} fill="url(#vs-in)" />
      {/* blood cells */}
      {Array.from({ length: 10 }, (_, i) => (
        <ellipse key={i} cx={40 + ((i * 87 + open * 400) % (w - 80))} cy={150 + (i % 3) * 35} rx={20} ry={12} fill="#D9544A" stroke="#7A221B" strokeWidth={3} opacity={0.9} />
      ))}
      {/* plaque */}
      <path
        d={`M${w / 2 - 170} 110 C${w / 2 - 100} 110 ${w / 2 - 60} ${110 + 62 * narrow} ${w / 2} ${110 + 62 * narrow} C${w / 2 + 60} ${110 + 62 * narrow} ${w / 2 + 100} 110 ${w / 2 + 170} 110 Z`}
        fill="url(#vs-p)"
        stroke="#9C7E22"
        strokeWidth={4}
      />
      <path
        d={`M${w / 2 - 170} 260 C${w / 2 - 100} 260 ${w / 2 - 60} ${260 - 62 * narrow} ${w / 2} ${260 - 62 * narrow} C${w / 2 + 60} ${260 - 62 * narrow} ${w / 2 + 100} 260 ${w / 2 + 170} 260 Z`}
        fill="url(#vs-p)"
        stroke="#9C7E22"
        strokeWidth={4}
      />
      {/* catheter + balloon */}
      {balloon > 0 && (
        <g>
          <rect x={-20} y={181} width={w / 2 + 140} height={8} rx={4} fill="#E8E8E8" stroke={C.forest} strokeWidth={2} />
          <rect x={w / 2 - 110} y={185 - 10 - 52 * balloon} width={220} height={20 + 104 * balloon} rx={10 + 52 * balloon} fill="url(#vs-b)" stroke={C.forest} strokeWidth={4} opacity={0.95} />
          <rect x={w / 2 - 95} y={185 - 6 - 48 * balloon} width={190} height={8} rx={4} fill="#FFFFFF" opacity={0.7 * balloon} />
        </g>
      )}
    </svg>
  );
};

export const Liver: React.FC<{ size?: number; inflame: number }> = ({ size = 600, inflame }) => (
  <svg width={size} height={size * 0.75} viewBox="0 0 600 450" style={{ overflow: "visible" }}>
    <defs>
      <radialGradient id="lv-g" cx="40%" cy="30%" r="80%">
        <stop offset="0%" stopColor="#C86A55" />
        <stop offset="55%" stopColor="#9B3F2F" />
        <stop offset="100%" stopColor="#6B2519" />
      </radialGradient>
      <radialGradient id="lv-f" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FF6A3D" stopOpacity={0.9} />
        <stop offset="100%" stopColor="#FF6A3D" stopOpacity={0} />
      </radialGradient>
      <linearGradient id="lv-gb" x1="0" x2="1">
        <stop offset="0%" stopColor="#6E9A3A" />
        <stop offset="100%" stopColor="#4A6E24" />
      </linearGradient>
    </defs>
    <ellipse cx={300} cy={425} rx={240} ry={18} fill={C.forest} opacity={0.12} />
    <ellipse cx={300} cy={230} rx={260 + inflame * 30} ry={180 + inflame * 20} fill="url(#lv-f)" opacity={inflame} />
    <path
      d="M40 170 C40 90 140 50 260 55 C380 60 520 70 560 120 C590 160 560 200 500 230 C430 265 360 330 290 385 C260 410 220 405 200 380 C150 320 40 260 40 170 Z"
      fill="url(#lv-g)"
      stroke="#4E1910"
      strokeWidth={6}
    />
    <path d="M300 60 C290 140 280 220 250 300" stroke="#4E1910" strokeWidth={5} fill="none" opacity={0.5} />
    <path d="M90 140 C120 100 180 80 240 78" stroke="#FFFFFF" strokeWidth={16} strokeLinecap="round" fill="none" opacity={0.3} />
    <path d="M330 90 C400 88 470 95 520 115" stroke="#FFFFFF" strokeWidth={10} strokeLinecap="round" fill="none" opacity={0.22} />
    {/* gallbladder */}
    <path d="M300 300 C290 340 300 380 330 385 C360 388 365 350 350 300 Z" fill="url(#lv-gb)" stroke="#2F4716" strokeWidth={4} />
    {/* inflammation sparks */}
    {inflame > 0 &&
      [
        [180, 160],
        [330, 150],
        [430, 170],
        [230, 260],
        [130, 210],
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${inflame})`}>
          <circle r={26} fill="#FF6A3D" opacity={0.35} />
          <path d="M0 -16 L4 -4 L16 0 L4 4 L0 16 L-4 4 L-16 0 L-4 -4 Z" fill={C.banana} stroke="#B34A1E" strokeWidth={2} />
        </g>
      ))}
  </svg>
);

export const Stomach: React.FC<{ size?: number; q?: number }> = ({ size = 480, q = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 500 500" style={{ overflow: "visible" }}>
    <defs>
      <radialGradient id="st-g" cx="40%" cy="35%" r="75%">
        <stop offset="0%" stopColor="#F6B3A6" />
        <stop offset="60%" stopColor="#E07F70" />
        <stop offset="100%" stopColor="#B4524A" />
      </radialGradient>
    </defs>
    <ellipse cx={250} cy={470} rx={170} ry={16} fill={C.forest} opacity={0.12} />
    <path d="M190 30 C190 60 195 90 200 110" stroke="#E9A497" strokeWidth={46} strokeLinecap="round" fill="none" />
    <path
      d="M195 100 C240 90 300 110 350 150 C420 205 430 300 380 370 C330 440 220 450 150 410 C110 388 100 350 130 330 C165 305 230 330 260 300 C285 275 265 220 220 190 C180 165 160 120 195 100 Z"
      fill="url(#st-g)"
      stroke="#8F3A33"
      strokeWidth={6}
    />
    <path d="M140 400 C110 420 80 440 60 470" stroke="#E9A497" strokeWidth={38} strokeLinecap="round" fill="none" />
    <path d="M250 150 C300 170 340 210 350 260 M230 200 C280 230 300 270 300 320 M300 380 C260 395 220 395 190 385" stroke="#B4524A" strokeWidth={5} fill="none" opacity={0.5} strokeLinecap="round" />
    <path d="M230 115 C280 115 320 135 345 160" stroke="#FFFFFF" strokeWidth={12} strokeLinecap="round" fill="none" opacity={0.45} />
    <g transform={`translate(330 120) scale(${q})`} opacity={q}>
      <circle r={62} fill={C.banana} stroke={C.forest} strokeWidth={6} />
      <text y={30} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={90} fill={C.forest}>
        ?
      </text>
    </g>
  </svg>
);

export const Newspaper: React.FC<{ w?: number }> = ({ w = 760 }) => (
  <svg width={w} height={w * 0.72} viewBox="0 0 760 548" style={{ overflow: "visible" }}>
    <defs>
      <linearGradient id="np-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F3ECD8" />
        <stop offset="100%" stopColor="#E2D6B8" />
      </linearGradient>
    </defs>
    <ellipse cx={380} cy={535} rx={330} ry={14} fill={C.forest} opacity={0.12} />
    <path d="M20 20 L740 10 L748 520 L14 528 Z" fill="url(#np-g)" stroke="#8C7B5A" strokeWidth={4} />
    <path d="M20 20 L740 10 L742 60 L20 70 Z" fill="#FFFFFF" opacity={0.25} />
    <text x={380} y={74} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={30} fill="#3B3426" letterSpacing={4}>
      NEW YORK · FEBRUARY 23, 1935
    </text>
    <line x1={50} x2={710} y1={94} y2={94} stroke="#3B3426" strokeWidth={4} />
    <line x1={50} x2={710} y1={102} y2={102} stroke="#3B3426" strokeWidth={1.5} />
    <text x={380} y={168} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={50} fill={C.forest}>
      Puzzlers Open 103rd Session
    </text>
    <text x={380} y={228} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={50} fill={C.forest}>
      Here by Recognizing
    </text>
    <text x={380} y={300} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={800} fontSize={64} fill={C.red}>
      45-Letter Word
    </text>
    {Array.from({ length: 3 }, (_, c) =>
      Array.from({ length: 8 }, (_, r) => (
        <rect key={`${c}-${r}`} x={60 + c * 220} y={335 + r * 22} width={r === 7 ? 120 : 190} height={9} rx={4} fill="#9C8D6D" opacity={0.55} />
      ))
    )}
  </svg>
);

export const Puzzle: React.FC<{ size?: number; color?: string }> = ({ size = 200, color = C.matcha }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <path
      d="M40 50 L80 50 C78 30 90 20 100 20 C110 20 122 30 120 50 L160 50 L160 90 C180 88 190 100 190 110 C190 120 180 132 160 130 L160 170 L40 170 L40 130 C60 132 70 120 70 110 C70 100 60 88 40 90 Z"
      fill={color}
      stroke={C.forest}
      strokeWidth={6}
      strokeLinejoin="round"
    />
    <path d="M52 62 L76 62" stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" opacity={0.45} />
  </svg>
);

export const DictBook: React.FC<{ size?: number }> = ({ size = 520 }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 500 400" style={{ overflow: "visible" }}>
    <defs>
      <linearGradient id="db-c" x1="0" x2="1">
        <stop offset="0%" stopColor={C.matchaDark} />
        <stop offset="50%" stopColor={C.matcha} />
        <stop offset="100%" stopColor={C.matchaDark} />
      </linearGradient>
    </defs>
    <ellipse cx={250} cy={385} rx={220} ry={14} fill={C.forest} opacity={0.14} />
    <path d="M30 70 L240 90 L240 370 L30 350 Z" fill="url(#db-c)" stroke={C.forest} strokeWidth={6} strokeLinejoin="round" />
    <path d="M470 70 L260 90 L260 370 L470 350 Z" fill="url(#db-c)" stroke={C.forest} strokeWidth={6} strokeLinejoin="round" />
    <path d="M45 60 L245 80 L245 352 L45 335 Z" fill={C.card} stroke={C.forest} strokeWidth={4} />
    <path d="M455 60 L255 80 L255 352 L455 335 Z" fill={C.card} stroke={C.forest} strokeWidth={4} />
    <rect x={240} y={78} width={20} height={292} fill={C.forest} />
    <text x={145} y={128} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={22} fill={C.forest} transform="rotate(5 145 128)">
      pneumono·ultra·
    </text>
    {Array.from({ length: 7 }, (_, i) => (
      <rect key={i} x={70} y={150 + i * 26} width={150 - (i % 3) * 20} height={8} rx={4} fill={C.line} transform={`rotate(5 145 ${150 + i * 26})`} />
    ))}
    {Array.from({ length: 9 }, (_, i) => (
      <rect key={i} x={280} y={110 + i * 26} width={150 - (i % 2) * 30} height={8} rx={4} fill={C.line} transform={`rotate(-5 355 ${110 + i * 26})`} />
    ))}
  </svg>
);

export const Clipboard: React.FC<{ size?: number }> = ({ size = 360 }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 300 360">
    <rect x={20} y={30} width={260} height={320} rx={22} fill="#B08A5B" stroke={C.forest} strokeWidth={6} />
    <rect x={40} y={60} width={220} height={270} rx={8} fill={C.card} stroke={C.forest} strokeWidth={4} />
    <rect x={100} y={14} width={100} height={40} rx={10} fill="#C9CED3" stroke={C.forest} strokeWidth={5} />
    <text x={150} y={110} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={22} fill={C.matcha} letterSpacing={3}>
      DIAGNOSIS
    </text>
    {[150, 180, 280, 305].map((y, i) => (
      <rect key={i} x={65} y={y} width={170 - i * 15} height={9} rx={4} fill={C.line} />
    ))}
  </svg>
);

export const Stethoscope: React.FC<{ size?: number }> = ({ size = 160 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <path d="M50 20 L50 80 C50 120 90 130 100 130 C110 130 150 120 150 80 L150 20" stroke={C.forest} strokeWidth={12} fill="none" strokeLinecap="round" />
    <path d="M100 130 L100 150 C100 180 140 185 150 160" stroke={C.forest} strokeWidth={12} fill="none" strokeLinecap="round" />
    <circle cx={155} cy={148} r={24} fill={C.matcha} stroke={C.forest} strokeWidth={8} />
    <circle cx={50} cy={20} r={10} fill={C.banana} stroke={C.forest} strokeWidth={4} />
    <circle cx={150} cy={20} r={10} fill={C.banana} stroke={C.forest} strokeWidth={4} />
  </svg>
);
