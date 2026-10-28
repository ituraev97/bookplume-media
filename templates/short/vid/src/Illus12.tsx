import React from "react";
import { C, FONT } from "./kit";

const S = C.forest;
const SKIN = "#F2C9B0", SKIN_D = "#E3A98A", LUNG = "#E8968A", LUNG_D = "#C9665A";

/* Front torso cut-away: lungs, diaphragm dome, phrenic nerve.
   breath 0..1 smooth inhale, twitch 0..1 sudden jerk, nerve 0..1 nerve draw + glow, air 0..1 air arrows */
export const Torso: React.FC<{ w?: number; breath: number; twitch?: number; nerve?: number; air?: number; t: number }> = ({ w = 700, breath, twitch = 0, nerve = 0, air = 0, t }) => {
  const jerk = twitch * (0.6 + 0.4 * Math.sin(t * 40));
  const drop = 30 * breath + 46 * jerk; // diaphragm drop
  const lx = 1 + 0.06 * breath + 0.08 * jerk;
  const dy = 470 + drop;
  return (
    <svg width={w} height={w * 1.1} viewBox="0 0 600 660" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="t-glow">
          <stop offset="0%" stopColor={C.banana} stopOpacity={0.9} />
          <stop offset="100%" stopColor={C.banana} stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* body silhouette */}
      <path d="M240 20 L360 20 L370 110 C450 120 520 150 545 210 L560 640 L40 640 L55 210 C80 150 150 120 230 110 Z" fill={SKIN} stroke={S} strokeWidth={6} />
      <path d="M248 20 C260 70 340 70 352 20" fill="none" stroke={SKIN_D} strokeWidth={5} />
      {/* rib cage */}
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} opacity={0.35}>
          <path d={`M300 ${190 + i * 52} C230 ${180 + i * 52} 150 ${200 + i * 56} 120 ${250 + i * 58}`} stroke={S} strokeWidth={6} fill="none" strokeLinecap="round" />
          <path d={`M300 ${190 + i * 52} C370 ${180 + i * 52} 450 ${200 + i * 56} 480 ${250 + i * 58}`} stroke={S} strokeWidth={6} fill="none" strokeLinecap="round" />
        </g>
      ))}
      {/* trachea */}
      <rect x={286} y={60} width={28} height={130} rx={12} fill="#F4E3D6" stroke={S} strokeWidth={5} />
      {[80, 100, 120, 140, 160].map((y) => (
        <line key={y} x1={288} y1={y} x2={312} y2={y} stroke={S} strokeWidth={3} opacity={0.5} />
      ))}
      <path d="M300 185 L250 225 M300 185 L350 225" stroke={S} strokeWidth={10} strokeLinecap="round" />
      {/* lungs */}
      <g transform={`translate(300 300) scale(${lx} ${1 + 0.1 * breath + 0.1 * jerk}) translate(-300 -300)`}>
        <path d="M268 210 C210 190 130 240 120 330 C112 400 130 450 150 460 C200 470 250 450 272 430 Z" fill={LUNG} stroke={S} strokeWidth={6} />
        <path d="M332 210 C390 190 470 240 480 330 C488 400 470 450 450 460 C400 470 350 450 328 430 Z" fill={LUNG} stroke={S} strokeWidth={6} />
        {[0, 1].map((side) => (
          <g key={side} stroke={LUNG_D} strokeWidth={4} fill="none" strokeLinecap="round">
            <path d={side ? "M340 240 C370 280 380 330 420 380" : "M260 240 C230 280 220 330 180 380"} />
            <path d={side ? "M360 300 C390 310 420 320 450 350" : "M240 300 C210 310 180 320 150 350"} />
          </g>
        ))}
      </g>
      {/* heart */}
      <path d="M300 330 C280 300 240 320 255 360 C265 390 300 410 310 420 C330 400 360 380 350 350 C345 320 315 310 300 330 Z" fill={C.red} stroke={S} strokeWidth={5} opacity={0.9} />
      {/* diaphragm dome */}
      <path d={`M70 ${dy + 40} C110 ${dy - 70 + drop * 0.6} 250 ${dy - 70 + drop * 0.4} 300 ${dy - 50 + drop * 0.5} C350 ${dy - 70 + drop * 0.4} 490 ${dy - 70 + drop * 0.6} 530 ${dy + 40}`} fill="none" stroke={C.matcha} strokeWidth={22} strokeLinecap="round" />
      <path d={`M70 ${dy + 40} C110 ${dy - 70 + drop * 0.6} 250 ${dy - 70 + drop * 0.4} 300 ${dy - 50 + drop * 0.5} C350 ${dy - 70 + drop * 0.4} 490 ${dy - 70 + drop * 0.6} 530 ${dy + 40}`} fill="none" stroke={C.matchaDark} strokeWidth={4} strokeDasharray="10 14" />
      {/* belly organs hint */}
      <ellipse cx={220} cy={590} rx={110} ry={40} fill={SKIN_D} opacity={0.5} />
      <ellipse cx={390} cy={600} rx={90} ry={34} fill={SKIN_D} opacity={0.4} />
      {/* phrenic nerve */}
      {nerve > 0 && (
        <>
          {[0, 1].map((side) => (
            <path
              key={side}
              d={side ? "M318 70 C350 140 380 200 410 260 C440 330 430 390 400 " + (dy - 46) : "M282 70 C250 140 220 200 190 260 C160 330 170 390 200 " + (dy - 46)}
              stroke={C.bananaDark}
              strokeWidth={8}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={520}
              strokeDashoffset={520 * (1 - Math.min(1, nerve))}
            />
          ))}
          {nerve > 0.9 && (
            <>
              <circle cx={200} cy={dy - 46} r={50} fill="url(#t-glow)" opacity={0.6 + 0.4 * Math.sin(t * 14)} />
              <circle cx={400} cy={dy - 46} r={50} fill="url(#t-glow)" opacity={0.6 + 0.4 * Math.sin(t * 14 + 1)} />
              {[0, 1, 2].map((i) => {
                const ph = (t * 1.6 + i / 3) % 1;
                return <circle key={i} cx={282 - ph * 82} cy={70 + ph * (dy - 116)} r={8} fill={C.banana} stroke={S} strokeWidth={2} />;
              })}
            </>
          )}
        </>
      )}
      {/* air arrows down the trachea */}
      {air > 0 &&
        [0, 1, 2].map((i) => {
          const ph = (t * 1.4 + i / 3) % 1;
          return (
            <g key={i} opacity={air * Math.sin(ph * Math.PI)} transform={`translate(300 ${-30 + ph * 200})`}>
              <path d="M-16 -12 L0 8 L16 -12" stroke={C.matcha} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          );
        })}
    </svg>
  );
};

/* Vocal cords seen from above. close 0..1 (0 = open V, 1 = snapped shut). */
export const VocalCords: React.FC<{ size?: number; close: number; t: number }> = ({ size = 420, close, t }) => {
  const a = 26 * (1 - close); // half-angle opening
  return (
    <svg width={size} height={size} viewBox="0 0 400 400" style={{ overflow: "visible" }}>
      <circle cx={200} cy={200} r={180} fill="#F4D3C2" stroke={S} strokeWidth={6} />
      <circle cx={200} cy={200} r={150} fill="#E7A996" stroke={S} strokeWidth={3} opacity={0.7} />
      {/* airway gap */}
      <path d={`M200 80 L${200 - Math.tan((a * Math.PI) / 180) * 240} 320 L${200 + Math.tan((a * Math.PI) / 180) * 240} 320 Z`} fill="#3A1F1A" />
      {/* cords */}
      <g transform={`rotate(${a} 200 80)`}>
        <path d="M200 80 C190 160 188 260 196 320 L150 320 C150 240 160 150 200 80 Z" fill="#FBEFE6" stroke={S} strokeWidth={5} />
      </g>
      <g transform={`rotate(${-a} 200 80)`}>
        <path d="M200 80 C210 160 212 260 204 320 L250 320 C250 240 240 150 200 80 Z" fill="#FBEFE6" stroke={S} strokeWidth={5} />
      </g>
      {/* air puffs while open */}
      {close < 0.6 &&
        [0, 1, 2].map((i) => {
          const ph = (t * 1.8 + i / 3) % 1;
          return <circle key={i} cx={200 + Math.sin(i * 2) * 14} cy={300 - ph * 200} r={10 - ph * 6} fill="#FFFFFF" opacity={(1 - close) * 0.8 * (1 - ph)} />;
        })}
      {close > 0.9 && <circle cx={200} cy={200} r={170 + 30 * ((t * 3) % 1)} fill="none" stroke={C.red} strokeWidth={6} opacity={1 - ((t * 3) % 1)} />}
    </svg>
  );
};

/* Comic burst with HIC! */
export const HicBurst: React.FC<{ size?: number; p: number; t: number }> = ({ size = 360, p, t }) => {
  const pts = Array.from({ length: 24 }, (_, i) => {
    const r = i % 2 ? 110 : 170 + 10 * Math.sin(t * 8 + i);
    const a = (i / 24) * Math.PI * 2;
    return `${200 + Math.cos(a) * r},${200 + Math.sin(a) * r}`;
  }).join(" ");
  return (
    <svg width={size} height={size} viewBox="0 0 400 400" style={{ overflow: "visible", transform: `scale(${0.4 + 0.6 * p}) rotate(${-8 + 4 * Math.sin(t * 6)}deg)` }}>
      <polygon points={pts} fill={C.banana} stroke={S} strokeWidth={8} strokeLinejoin="round" />
      <text x={200} y={232} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={96} fill={S}>
        HIC!
      </text>
    </svg>
  );
};

/* plate + fork with speed lines */
export const FastPlate: React.FC<{ size?: number; t: number }> = ({ size = 200, t }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible" }}>
    <ellipse cx={100} cy={130} rx={86} ry={34} fill="#FFFFFF" stroke={S} strokeWidth={5} />
    <ellipse cx={100} cy={124} rx={56} ry={18} fill={C.matchaLight} stroke={S} strokeWidth={3} />
    <circle cx={80} cy={118} r={9} fill={C.red} stroke={S} strokeWidth={2} />
    <circle cx={112} cy={120} r={8} fill={C.banana} stroke={S} strokeWidth={2} />
    <g transform={`translate(${130 + 6 * Math.sin(t * 14)} ${40 + 10 * Math.abs(Math.sin(t * 7))}) rotate(30)`}>
      <rect x={-5} y={0} width={10} height={70} rx={5} fill="#BFC3B0" stroke={S} strokeWidth={3} />
      <path d="M-14 0 L-14 -26 M-5 0 L-5 -26 M5 0 L5 -26 M14 0 L14 -26 M-14 0 L14 0" stroke={S} strokeWidth={5} strokeLinecap="round" />
    </g>
    {[0, 1, 2].map((i) => (
      <line key={i} x1={10} y1={60 + i * 18} x2={50 - 10 * Math.sin(t * 10 + i)} y2={60 + i * 18} stroke={S} strokeWidth={5} strokeLinecap="round" opacity={0.5} />
    ))}
  </svg>
);

/* fizzy drink glass */
export const Soda: React.FC<{ size?: number; t: number }> = ({ size = 200, t }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible" }}>
    <path d="M50 30 L150 30 L135 185 L65 185 Z" fill="#D9EBC4" stroke={S} strokeWidth={5} strokeLinejoin="round" />
    <path d="M56 70 L144 70 L135 185 L65 185 Z" fill={C.matchaLight} opacity={0.8} />
    <rect x={112} y={-10} width={12} height={90} rx={5} fill={C.red} stroke={S} strokeWidth={3} transform="rotate(14 118 35)" />
    {Array.from({ length: 9 }, (_, i) => {
      const ph = (t * 0.9 + i / 9) % 1;
      return <circle key={i} cx={72 + ((i * 23) % 58)} cy={180 - ph * 110} r={4 + (i % 3) * 2} fill="#FFFFFF" stroke={S} strokeWidth={2} opacity={1 - ph * 0.6} />;
    })}
    {[0, 1, 2].map((i) => {
      const ph = (t * 1.2 + i / 3) % 1;
      return <circle key={`p${i}`} cx={80 + i * 22} cy={24 - ph * 40} r={5} fill="#FFFFFF" stroke={S} strokeWidth={2} opacity={1 - ph} />;
    })}
  </svg>
);

/* chili pepper with heat lines */
export const Chili: React.FC<{ size?: number; t: number }> = ({ size = 200, t }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible" }}>
    <g transform={`rotate(${-20 + 4 * Math.sin(t * 5)} 100 100)`}>
      <path d="M40 80 C70 70 140 80 170 150 C175 165 160 170 150 160 C120 120 80 110 45 110 C25 110 25 85 40 80 Z" fill={C.red} stroke={S} strokeWidth={5} />
      <path d="M60 88 C90 86 120 96 140 120" stroke="#E8796B" strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d="M40 82 C30 70 30 55 45 45" stroke={C.matcha} strokeWidth={9} fill="none" strokeLinecap="round" />
      <path d="M30 78 C38 70 52 72 56 84" fill={C.matcha} stroke={S} strokeWidth={4} />
    </g>
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M${110 + i * 26} ${50 - 6 * Math.sin(t * 6 + i)} q8 -12 0 -24 q-8 -12 0 -24`} stroke="#E8903A" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.8} />
    ))}
  </svg>
);

/* open mouth gulping air bubbles */
export const GulpAir: React.FC<{ size?: number; t: number }> = ({ size = 200, t }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible" }}>
    <circle cx={100} cy={110} r={80} fill={SKIN} stroke={S} strokeWidth={5} />
    <circle cx={70} cy={85} r={8} fill={S} />
    <circle cx={130} cy={85} r={8} fill={S} />
    <ellipse cx={100} cy={135} rx={28} ry={22 + 6 * Math.sin(t * 6)} fill="#5A2A24" stroke={S} strokeWidth={4} />
    {[0, 1, 2, 3].map((i) => {
      const ph = (t * 1.1 + i / 4) % 1;
      return <circle key={i} cx={100 + 70 * (1 - ph) * (i % 2 ? 1 : -1)} cy={135 - 40 * (1 - ph)} r={10 * (1 - ph * 0.5)} fill="#FFFFFF" stroke={S} strokeWidth={3} opacity={ph < 0.95 ? 1 : 0} />;
    })}
  </svg>
);

/* stopwatch, p = 0..1 sweep */
export const Stopwatch: React.FC<{ size?: number; p: number }> = ({ size = 300, p }) => {
  const a = p * Math.PI * 2 - Math.PI / 2;
  return (
    <svg width={size} height={size} viewBox="0 0 300 300" style={{ overflow: "visible" }}>
      <rect x={130} y={8} width={40} height={30} rx={8} fill={C.matcha} stroke={S} strokeWidth={5} />
      <circle cx={150} cy={165} r={125} fill="#FFFFFF" stroke={S} strokeWidth={8} />
      <path d={`M150 165 L150 40 A125 125 0 ${p > 0.5 ? 1 : 0} 1 ${150 + Math.cos(a) * 125} ${165 + Math.sin(a) * 125} Z`} fill={C.banana} opacity={0.8} />
      {Array.from({ length: 12 }, (_, i) => {
        const b = (i / 12) * Math.PI * 2;
        return <line key={i} x1={150 + Math.cos(b) * 100} y1={165 + Math.sin(b) * 100} x2={150 + Math.cos(b) * 115} y2={165 + Math.sin(b) * 115} stroke={S} strokeWidth={6} strokeLinecap="round" />;
      })}
      <line x1={150} y1={165} x2={150 + Math.cos(a) * 95} y2={165 + Math.sin(a) * 95} stroke={C.red} strokeWidth={8} strokeLinecap="round" />
      <circle cx={150} cy={165} r={12} fill={S} />
    </svg>
  );
};

/* old man in armchair with hic bubbles, hic 0..1 bounce phase driver */
export const OldMan: React.FC<{ size?: number; t: number }> = ({ size = 460, t }) => {
  const ph = (t * 0.5) % 1; // one hic every 2 s
  const jump = Math.max(0, Math.sin(Math.min(1, ph * 6) * Math.PI)) * 14;
  return (
    <svg width={size} height={size} viewBox="0 0 460 460" style={{ overflow: "visible" }}>
      <ellipse cx={230} cy={440} rx={180} ry={14} fill={S} opacity={0.12} />
      {/* armchair */}
      <rect x={70} y={150} width={320} height={250} rx={50} fill={C.matcha} stroke={S} strokeWidth={6} />
      <rect x={40} y={260} width={80} height={170} rx={30} fill={C.matchaDark} stroke={S} strokeWidth={6} />
      <rect x={340} y={260} width={80} height={170} rx={30} fill={C.matchaDark} stroke={S} strokeWidth={6} />
      <g transform={`translate(0 ${-jump})`}>
        {/* body */}
        <path d="M150 400 C150 300 170 250 230 250 C290 250 310 300 310 400 Z" fill="#7C8FA6" stroke={S} strokeWidth={6} />
        {/* head */}
        <circle cx={230} cy={190} r={62} fill={SKIN} stroke={S} strokeWidth={6} />
        <path d="M172 180 C175 140 200 125 230 125 C260 125 285 140 288 180" fill="#E9E6DA" stroke={S} strokeWidth={5} />
        <circle cx={208} cy={192} r={6} fill={S} />
        <circle cx={252} cy={192} r={6} fill={S} />
        <path d="M200 175 L216 178 M244 178 L260 175" stroke={S} strokeWidth={4} strokeLinecap="round" />
        <path d="M206 218 C220 228 240 228 254 218" stroke="#E9E6DA" strokeWidth={10} strokeLinecap="round" fill="none" />
        <ellipse cx={230} cy={228} rx={10} ry={8 + 6 * (jump / 14)} fill="#5A2A24" />
        {/* hands */}
        <circle cx={160} cy={330} r={20} fill={SKIN} stroke={S} strokeWidth={5} />
        <circle cx={300} cy={330} r={20} fill={SKIN} stroke={S} strokeWidth={5} />
      </g>
      {/* hic bubble */}
      {ph < 0.7 && (
        <g transform={`translate(${330 + ph * 40} ${120 - ph * 60}) scale(${0.6 + ph * 0.6})`} opacity={1 - ph / 0.7}>
          <rect x={-60} y={-30} width={120} height={60} rx={30} fill="#FFFFFF" stroke={S} strokeWidth={5} />
          <text x={0} y={14} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={38} fill={S}>
            hic!
          </text>
        </g>
      )}
    </svg>
  );
};

/* metronome ticking fast */
export const Metronome: React.FC<{ size?: number; t: number }> = ({ size = 240, t }) => {
  const a = 28 * Math.sin(t * Math.PI * 1.0);
  return (
    <svg width={size} height={size} viewBox="0 0 240 240" style={{ overflow: "visible" }}>
      <path d="M70 225 L100 20 L140 20 L170 225 Z" fill="#C98A4B" stroke={S} strokeWidth={6} strokeLinejoin="round" />
      <path d="M90 170 L150 170" stroke={S} strokeWidth={4} />
      <g transform={`rotate(${a} 120 200)`}>
        <line x1={120} y1={200} x2={120} y2={45} stroke={S} strokeWidth={6} strokeLinecap="round" />
        <rect x={104} y={80} width={32} height={26} rx={6} fill={C.banana} stroke={S} strokeWidth={4} />
      </g>
      <circle cx={120} cy={200} r={10} fill={S} />
    </svg>
  );
};

/* womb with curled fetus. hic triggers a little jump */
export const Womb: React.FC<{ size?: number; t: number; hicAt?: number[] }> = ({ size = 560, t, hicAt = [] }) => {
  let j = 0;
  hicAt.forEach((h) => {
    const d = t - h;
    if (d > 0 && d < 0.35) j = Math.max(j, Math.sin((d / 0.35) * Math.PI));
  });
  const breathe = 1 + 0.015 * Math.sin(t * 2);
  return (
    <svg width={size} height={size} viewBox="0 0 500 500" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="w-fl" cx="50%" cy="45%">
          <stop offset="0%" stopColor="#FCE3D6" />
          <stop offset="100%" stopColor="#F0B9A6" />
        </radialGradient>
      </defs>
      <g transform={`translate(250 250) scale(${breathe}) translate(-250 -250)`}>
        <ellipse cx={250} cy={250} rx={220} ry={230} fill="#E08A7A" stroke={S} strokeWidth={6} />
        <ellipse cx={250} cy={250} rx={190} ry={200} fill="url(#w-fl)" stroke={S} strokeWidth={3} />
      </g>
      {/* umbilical cord */}
      <path d="M250 440 C300 420 320 380 290 340 C270 315 280 300 270 290" stroke="#D27A6A" strokeWidth={14} fill="none" strokeLinecap="round" />
      <g transform={`translate(0 ${-18 * j}) rotate(${-3 * j} 250 260)`}>
        {/* back + body */}
        <path d="M200 160 C140 200 140 330 210 360 C260 380 330 360 330 300 C330 260 300 240 280 240" fill="#F6C6AE" stroke={S} strokeWidth={6} />
        {/* head */}
        <circle cx={255} cy={170} r={78} fill="#F6C6AE" stroke={S} strokeWidth={6} />
        <path d="M290 180 C300 178 304 186 300 192" stroke={S} strokeWidth={4} fill="none" strokeLinecap="round" />
        <path d="M265 150 C275 144 285 146 290 152" stroke={S} strokeWidth={4} fill="none" strokeLinecap="round" />
        {/* legs */}
        <path d="M230 340 C260 330 300 330 310 300 C318 280 300 270 285 280" fill="#F6C6AE" stroke={S} strokeWidth={6} />
        {/* arm */}
        <path d="M250 250 C270 240 300 230 300 210" stroke={S} strokeWidth={6} fill="none" strokeLinecap="round" />
        <circle cx={300} cy={206} r={12} fill="#F6C6AE" stroke={S} strokeWidth={4} />
      </g>
      {j > 0.05 && (
        <g opacity={j}>
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M${120 + i * 10} ${130 - i * 30} l-40 -20`} stroke={C.forest} strokeWidth={6} strokeLinecap="round" />
          ))}
          <text x={380} y={120} fontFamily={FONT} fontWeight={800} fontSize={54} fill={S}>
            hic
          </text>
        </g>
      )}
    </svg>
  );
};

/* newborn head with brain and EEG trace. wave = 0..1 pulse amplitude */
export const BabyBrain: React.FC<{ w?: number; t: number; pulses: number[] }> = ({ w = 800, t, pulses }) => {
  // EEG: scrolling trace; spikes at pulse times
  const pts: string[] = [];
  for (let i = 0; i <= 120; i++) {
    const x = 420 + i * 3.2;
    const tt = t - (120 - i) * 0.02;
    let y = 5 * Math.sin(tt * 30) + 3 * Math.sin(tt * 47);
    pulses.forEach((p) => {
      const d = tt - p;
      if (d > 0 && d < 0.6) y += -70 * Math.exp(-((d - 0.08) ** 2) / 0.002) + 55 * Math.exp(-((d - 0.2) ** 2) / 0.003) - 40 * Math.exp(-((d - 0.4) ** 2) / 0.004);
    });
    pts.push(`${x},${220 + y}`);
  }
  let glow = 0;
  pulses.forEach((p) => {
    const d = t - p;
    if (d > 0 && d < 0.7) glow = Math.max(glow, 1 - d / 0.7);
  });
  return (
    <svg width={w} height={w * 0.6} viewBox="0 0 820 490" style={{ overflow: "visible" }}>
      {/* head */}
      <circle cx={200} cy={240} r={180} fill="#F6C6AE" stroke={S} strokeWidth={7} />
      {/* brain */}
      <g transform="translate(200 180)">
        <path d="M-130 20 C-140 -60 -70 -110 0 -105 C80 -110 140 -60 130 20 C125 60 80 70 0 66 C-80 70 -125 60 -130 20 Z" fill={glow > 0 ? "#F5B7C0" : "#EFA9B3"} stroke={S} strokeWidth={5} />
        {["M-90 -30 C-60 -60 -30 -20 0 -50", "M10 -70 C40 -40 70 -80 100 -40", "M-100 20 C-60 0 -40 40 0 10", "M20 0 C50 40 80 0 110 20", "M0 -105 L0 66"].map((d) => (
          <path key={d} d={d} stroke="#C9707E" strokeWidth={5} fill="none" strokeLinecap="round" />
        ))}
        {glow > 0 &&
          [0, 1, 2].map((i) => <circle key={i} cx={0} cy={-20} r={40 + i * 50 + (1 - glow) * 60} fill="none" stroke={C.bananaDark} strokeWidth={8 - i * 2} opacity={glow * (1 - i * 0.3)} />)}
      </g>
      {/* face */}
      <circle cx={140} cy={320} r={9} fill={S} />
      <circle cx={260} cy={320} r={9} fill={S} />
      <path d="M180 365 C195 378 210 378 225 365" stroke={S} strokeWidth={5} fill="none" strokeLinecap="round" />
      <circle cx={110} cy={355} r={16} fill={C.red} opacity={0.25} />
      <circle cx={290} cy={355} r={16} fill={C.red} opacity={0.25} />
      {/* electrodes */}
      {[[120, 110], [200, 72], [280, 110]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={12} fill={C.matcha} stroke={S} strokeWidth={4} />
          <path d={`M${x} ${y} C${x + 100} ${y - 60} 380 ${150 + i * 20} 420 ${200 + i * 10}`} stroke={S} strokeWidth={3} fill="none" opacity={0.5} />
        </g>
      ))}
      {/* monitor */}
      <rect x={400} y={100} width={410} height={240} rx={24} fill={C.forest} stroke={S} strokeWidth={6} />
      {[150, 220, 290].map((y) => (
        <line key={y} x1={420} y1={y} x2={790} y2={y} stroke={C.matcha} strokeWidth={2} opacity={0.4} />
      ))}
      <polyline points={pts.join(" ")} fill="none" stroke={C.banana} strokeWidth={5} strokeLinejoin="round" />
      <text x={605} y={380} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={S}>
        brainwaves
      </text>
    </svg>
  );
};

/* brain <-> diaphragm feedback loop. p draws the loop */
export const BrainLoop: React.FC<{ w?: number; p: number; t: number }> = ({ w = 760, p, t }) => {
  const L = 1100;
  return (
    <svg width={w} height={w * 0.9} viewBox="0 0 760 680" style={{ overflow: "visible" }}>
      {/* brain */}
      <g transform="translate(380 140)">
        <path d="M-150 20 C-160 -70 -80 -125 0 -120 C90 -125 160 -70 150 20 C145 70 90 80 0 76 C-90 80 -145 70 -150 20 Z" fill="#EFA9B3" stroke={S} strokeWidth={6} />
        {["M-100 -30 C-70 -70 -30 -20 0 -55", "M10 -80 C45 -45 80 -90 115 -45", "M-115 25 C-70 0 -45 45 0 12", "M20 0 C55 45 90 0 125 25", "M0 -120 L0 76"].map((d) => (
          <path key={d} d={d} stroke="#C9707E" strokeWidth={6} fill="none" strokeLinecap="round" />
        ))}
      </g>
      {/* diaphragm */}
      <path d="M90 600 C160 470 320 470 380 500 C440 470 600 470 670 600" fill="none" stroke={C.matcha} strokeWidth={28} strokeLinecap="round" />
      {/* loop */}
      <path d="M560 210 C700 300 700 420 580 500 M200 500 C80 420 80 300 200 210" stroke={C.forest} strokeWidth={8} fill="none" strokeDasharray={`${L * p} ${L}`} strokeLinecap="round" />
      {p > 0.98 && (
        <>
          <path d="M565 480 L585 500 L555 510" stroke={C.forest} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M195 230 L200 210 L222 220" stroke={C.forest} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {[0, 1].map((i) => {
            const ph = (t * 0.7 + i / 2) % 1;
            const ang = ph * Math.PI * 2;
            return <circle key={i} cx={380 + Math.cos(ang) * 290} cy={355 + Math.sin(ang) * 180} r={14} fill={C.banana} stroke={S} strokeWidth={4} />;
          })}
        </>
      )}
    </svg>
  );
};

/* small chalkboard with lesson line */
export const Chalkboard: React.FC<{ w?: number; p: number; t: number }> = ({ w = 640, p, t }) => (
  <svg width={w} height={w * 0.62} viewBox="0 0 640 400" style={{ overflow: "visible" }}>
    <rect x={10} y={10} width={620} height={360} rx={22} fill="#C98A4B" stroke={S} strokeWidth={6} />
    <rect x={36} y={36} width={568} height={308} rx={12} fill="#2F3D22" />
    <text x={70} y={110} fontFamily={FONT} fontWeight={800} fontSize={44} fill={C.paper} opacity={0.9}>
      LESSON 1
    </text>
    <text x={70} y={190} fontFamily={FONT} fontWeight={700} fontSize={50} fill={C.paper} opacity={ramp01(p * 2)}>
      breathe in…
    </text>
    <text x={70} y={270} fontFamily={FONT} fontWeight={700} fontSize={50} fill={C.banana} opacity={ramp01(p * 2 - 1)}>
      feel the muscle
    </text>
    <rect x={480} y={330} width={70} height={16} rx={6} fill="#FFFFFF" transform={`rotate(${-6 + 3 * Math.sin(t * 3)} 515 338)`} />
  </svg>
);
const ramp01 = (x: number) => Math.max(0, Math.min(1, x));
