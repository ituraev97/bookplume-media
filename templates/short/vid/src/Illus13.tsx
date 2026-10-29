import React from "react";
import { C, FONT } from "./kit";

const S = C.forest;
const SKIN = "#F3CDB4", SKIN_M = "#E8B394", SKIN_D = "#D4916F", SKIN_L = "#FBE3D2";
const WATER = "#9FCFC4", WATER_D = "#5E9F92", WATER_L = "#D3ECE5";
const BLOOD = "#C9483C", BLOOD_D = "#8F2A22", BLOOD_L = "#E8796B";

/* deterministic pseudo-random */
const rnd = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const SkinDefs: React.FC<{ id: string }> = ({ id }) => (
  <defs>
    <linearGradient id={`${id}-skin`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor={SKIN_L} />
      <stop offset="55%" stopColor={SKIN} />
      <stop offset="100%" stopColor={SKIN_M} />
    </linearGradient>
    <radialGradient id={`${id}-pad`} cx="0.4" cy="0.3" r="0.8">
      <stop offset="0%" stopColor={SKIN_L} />
      <stop offset="70%" stopColor={SKIN} />
      <stop offset="100%" stopColor={SKIN_M} />
    </radialGradient>
    <radialGradient id={`${id}-glow`}>
      <stop offset="0%" stopColor={C.banana} stopOpacity={0.95} />
      <stop offset="100%" stopColor={C.banana} stopOpacity={0} />
    </radialGradient>
    <linearGradient id={`${id}-water`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={WATER_L} stopOpacity={0.95} />
      <stop offset="100%" stopColor={WATER} stopOpacity={0.95} />
    </linearGradient>
  </defs>
);

/* wavy wrinkle path across a width at local y */
const wavy = (x0: number, x1: number, y: number, amp: number, seed: number) => {
  const n = 5;
  let d = `M${x0} ${y}`;
  for (let i = 1; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n;
    const cx = x - (x1 - x0) / n / 2;
    const cy = y + (rnd(seed + i) - 0.5) * amp * 2.4;
    d += ` Q${cx} ${cy} ${x} ${y + (rnd(seed + i * 3) - 0.5) * amp}`;
  }
  return d;
};

/* ---------- Open hand, palm side. wrinkle 0..1, nerve 0..1, broken = damaged nerve ---------- */
export const Hand: React.FC<{ w?: number; wrinkle: number; nerve?: number; broken?: boolean; t: number; id?: string; wet?: number }> = ({
  w = 380,
  wrinkle,
  nerve = 0,
  broken = false,
  t,
  id = "hd",
  wet = 0,
}) => {
  const fingers = [
    { x: 128, y: 250, w: 50, h: 170, r: -9 },
    { x: 186, y: 236, w: 54, h: 196, r: -2 },
    { x: 246, y: 240, w: 52, h: 184, r: 5 },
    { x: 300, y: 262, w: 44, h: 140, r: 13 },
  ];
  const thumb = { x: 108, y: 360, w: 56, h: 140, r: -52 };
  const all = [...fingers, thumb];
  return (
    <svg width={w} height={w * 1.35} viewBox="0 0 400 540" style={{ overflow: "visible" }}>
      <SkinDefs id={id} />
      {/* soft shadow */}
      <ellipse cx={215} cy={528} rx={120} ry={12} fill={S} opacity={0.12} />
      {/* fingers */}
      {all.map((f, i) => (
        <g key={i} transform={`translate(${f.x} ${f.y}) rotate(${f.r})`}>
          <rect x={-f.w / 2} y={-f.h} width={f.w} height={f.h + 30} rx={f.w / 2} fill={`url(#${id}-skin)`} stroke={S} strokeWidth={5} />
          {/* side shading */}
          <rect x={f.w / 2 - 14} y={-f.h + 14} width={9} height={f.h} rx={4.5} fill={SKIN_D} opacity={0.35} />
          <rect x={-f.w / 2 + 8} y={-f.h + 18} width={7} height={f.h * 0.6} rx={3.5} fill="#fff" opacity={0.35} />
          {/* joint creases */}
          {[0.36, 0.68].map((k) => (
            <path key={k} d={`M${-f.w / 2 + 8} ${-f.h + f.h * k} q${f.w / 2 - 8} 6 ${f.w - 16} 0`} stroke={SKIN_D} strokeWidth={3.5} fill="none" strokeLinecap="round" />
          ))}
          {/* fingertip pad */}
          <ellipse cx={0} cy={-f.h + f.w * 0.62} rx={f.w * 0.36} ry={f.w * 0.5} fill={`url(#${id}-pad)`} opacity={0.8} />
          {/* wrinkles */}
          {wrinkle > 0.01 &&
            [0, 1, 2, 3, 4].map((k) => (
              <g key={k} opacity={Math.min(1, wrinkle * 1.4 - k * 0.08)}>
                <path d={wavy(-f.w / 2 + 7, f.w / 2 - 7, -f.h + 14 + k * 11, 3 + 3 * wrinkle, i * 10 + k)} stroke={SKIN_D} strokeWidth={3.2} fill="none" strokeLinecap="round" />
                <path d={wavy(-f.w / 2 + 7, f.w / 2 - 7, -f.h + 17 + k * 11, 3 + 3 * wrinkle, i * 10 + k)} stroke="#fff" strokeWidth={1.6} fill="none" opacity={0.5} strokeLinecap="round" />
              </g>
            ))}
        </g>
      ))}
      {/* palm */}
      <path d="M92 250 C96 236 330 236 334 262 L330 420 C326 470 300 500 290 540 L150 540 C140 500 104 470 98 420 Z" fill={`url(#${id}-skin)`} stroke={S} strokeWidth={5} />
      {/* palm creases */}
      <path d="M110 300 C170 290 250 300 320 280" stroke={SKIN_D} strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d="M118 340 C170 330 230 350 300 330" stroke={SKIN_D} strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d="M160 300 C150 360 160 420 190 470" stroke={SKIN_D} strokeWidth={4} fill="none" strokeLinecap="round" />
      <ellipse cx={150} cy={430} rx={46} ry={56} fill={SKIN_M} opacity={0.35} />
      <ellipse cx={290} cy={400} rx={34} ry={60} fill={SKIN_D} opacity={0.18} />
      {/* thumb base cover */}
      <path d="M100 330 C80 360 84 410 120 440" stroke={S} strokeWidth={5} fill="none" strokeLinecap="round" />
      {/* water drops */}
      {wet > 0 &&
        [0, 1, 2, 3, 4, 5].map((k) => {
          const ph = (t * 0.6 + k / 6) % 1;
          return (
            <g key={k} opacity={wet * Math.sin(ph * Math.PI)} transform={`translate(${110 + k * 42} ${120 + ph * 300})`}>
              <path d="M0 -14 C8 -2 10 4 0 10 C-10 4 -8 -2 0 -14 Z" fill={WATER} stroke={WATER_D} strokeWidth={2.5} />
              <circle cx={-3} cy={2} r={2.4} fill="#fff" />
            </g>
          );
        })}
      {/* median nerve */}
      {nerve > 0 && (
        <g>
          {[
            "M220 540 C218 470 212 410 206 360 C190 320 160 330 118 340",
            "M206 360 C190 310 170 240 140 150",
            "M206 360 C200 300 196 200 190 90",
            "M206 360 C220 300 240 210 256 110",
          ].map((d, k) => (
            <path key={k} d={d} stroke={broken ? "#B7A77A" : C.bananaDark} strokeWidth={8} fill="none" strokeLinecap="round" strokeDasharray={440} strokeDashoffset={440 * (1 - Math.min(1, nerve * 1.2 - k * 0.05))} opacity={broken ? 0.55 : 1} />
          ))}
          {!broken && nerve > 0.85 &&
            [0, 1, 2].map((k) => {
              const ph = (t * 1.3 + k / 3) % 1;
              return <circle key={k} cx={220 - ph * 16} cy={540 - ph * 230} r={9} fill={C.banana} stroke={S} strokeWidth={2.5} />;
            })}
          {broken && nerve > 0.5 && (
            <g transform="translate(219 488)">
              <rect x={-30} y={-14} width={60} height={28} fill={SKIN} />
              <circle r={34} fill={C.red} stroke={S} strokeWidth={5} />
              <path d="M-14 -14 L14 14 M14 -14 L-14 14" stroke="#fff" strokeWidth={8} strokeLinecap="round" />
            </g>
          )}
        </g>
      )}
    </svg>
  );
};

/* ---------- Brain with nerve going down ---------- */
export const Brain: React.FC<{ size?: number; t: number; pulse?: number }> = ({ size = 240, t, pulse = 0 }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 300 240" style={{ overflow: "visible" }}>
    <defs>
      <radialGradient id="br-g" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0%" stopColor="#F9C8C0" />
        <stop offset="70%" stopColor="#E8968A" />
        <stop offset="100%" stopColor="#C9665A" />
      </radialGradient>
      <radialGradient id="br-glow">
        <stop offset="0%" stopColor={C.banana} stopOpacity={0.9} />
        <stop offset="100%" stopColor={C.banana} stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle cx={150} cy={110} r={130} fill="url(#br-glow)" opacity={pulse * (0.5 + 0.3 * Math.sin(t * 10))} />
    <path d="M60 140 C20 120 30 50 90 40 C110 10 180 10 200 35 C260 30 290 90 260 130 C270 170 220 200 180 185 C150 210 100 200 90 175 C60 180 40 160 60 140 Z" fill="url(#br-g)" stroke={S} strokeWidth={6} />
    {[
      "M90 70 C110 60 120 90 140 80 C160 70 170 95 190 85",
      "M70 120 C100 110 110 135 140 125 C170 115 190 140 230 120",
      "M120 160 C140 150 160 170 190 155",
      "M150 40 C145 70 160 90 150 120",
      "M215 60 C200 80 225 100 210 120",
    ].map((d, i) => (
      <path key={i} d={d} stroke="#B55348" strokeWidth={5} fill="none" strokeLinecap="round" />
    ))}
    <path d="M70 70 C80 55 95 50 110 52" stroke="#fff" strokeWidth={6} opacity={0.4} fill="none" strokeLinecap="round" />
  </svg>
);

/* ---------- Skin cross-section: water through pores, nerve signal, vessels squeeze, surface puckers ---------- */
export const SkinSection: React.FC<{ w?: number; water: number; nerve: number; squeeze: number; t: number }> = ({ w = 820, water, nerve, squeeze, t }) => {
  const amp = 26 * squeeze;
  const top = (x: number) => 120 + amp * Math.sin(x / 46) * (0.7 + 0.3 * Math.sin(x / 130)) + 12 * squeeze;
  let surf = `M0 ${top(0)}`;
  for (let x = 10; x <= 800; x += 10) surf += ` L${x} ${top(x)}`;
  const pores = [170, 400, 630];
  const vr = 22 * (1 - 0.6 * squeeze);
  const vy = 300 + 10 * squeeze;
  return (
    <svg width={w} height={w * 0.7} viewBox="0 0 800 560" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="ss-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={WATER_L} />
          <stop offset="100%" stopColor={WATER} />
        </linearGradient>
        <linearGradient id="ss-epi" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F8DCC6" />
          <stop offset="100%" stopColor="#EBBC9C" />
        </linearGradient>
        <linearGradient id="ss-der" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F2B9A6" />
          <stop offset="100%" stopColor="#DE9580" />
        </linearGradient>
        <linearGradient id="ss-vein" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BLOOD_L} />
          <stop offset="50%" stopColor={BLOOD} />
          <stop offset="100%" stopColor={BLOOD_D} />
        </linearGradient>
        <clipPath id="ss-clip">
          <rect x={0} y={0} width={800} height={560} rx={40} />
        </clipPath>
        <radialGradient id="ss-glow">
          <stop offset="0%" stopColor={C.banana} stopOpacity={0.95} />
          <stop offset="100%" stopColor={C.banana} stopOpacity={0} />
        </radialGradient>
      </defs>
      <g clipPath="url(#ss-clip)">
        <rect width={800} height={560} fill="url(#ss-water)" />
        {/* water ripples */}
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${-100 + ((t * 40 + i * 260) % 900)} ${40 + i * 22} q30 -10 60 0 t60 0`} stroke="#fff" strokeWidth={4} fill="none" opacity={0.6} strokeLinecap="round" />
        ))}
        {/* dermis */}
        <path d={`${surf} L800 560 L0 560 Z`} fill="url(#ss-der)" />
        {/* epidermis band */}
        <path d={`${surf} L800 ${top(800) + 70} ${Array.from({ length: 81 }, (_, k) => `L${800 - k * 10} ${top(800 - k * 10) + 70 + 6 * Math.sin(k)}`).join(" ")} Z`} fill="url(#ss-epi)" />
        {[22, 44].map((o) => (
          <path key={o} d={Array.from({ length: 81 }, (_, k) => `${k ? "L" : "M"}${k * 10} ${top(k * 10) + o}`).join(" ")} stroke="#DDA889" strokeWidth={2.5} fill="none" opacity={0.6} />
        ))}
        <path d={surf} stroke={S} strokeWidth={6} fill="none" />
        {/* collagen fibers */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M${i * 140 - 20} ${400 + (i % 2) * 60} c40 -20 80 20 120 0`} stroke="#C97F6B" strokeWidth={3} fill="none" opacity={0.45} />
        ))}
        {/* sweat glands */}
        {pores.map((x, i) => (
          <g key={i}>
            <path d={`M${x} ${top(x)} C${x - 10} ${top(x) + 80} ${x + 14} ${top(x) + 160} ${x} 430`} stroke="#F7E6D6" strokeWidth={14} fill="none" />
            <path d={`M${x} ${top(x)} C${x - 10} ${top(x) + 80} ${x + 14} ${top(x) + 160} ${x} 430`} stroke="#B98B70" strokeWidth={3} fill="none" opacity={0.7} />
            <g transform={`translate(${x} 450)`}>
              {[0, 1, 2].map((k) => (
                <ellipse key={k} cx={(k - 1) * 14} cy={k % 2 ? 10 : 0} rx={22} ry={16} fill="#F2D2BC" stroke="#B98B70" strokeWidth={3} />
              ))}
            </g>
            {/* water droplets going in */}
            {water > 0 &&
              [0, 1, 2].map((k) => {
                const ph = (t * 0.8 + k / 3 + i * 0.17) % 1;
                const y = top(x) - 40 + ph * 230;
                return <circle key={k} cx={x + Math.sin(ph * 6) * 5} cy={y} r={9 - ph * 3} fill={WATER} stroke={WATER_D} strokeWidth={2.5} opacity={water * Math.sin(ph * Math.PI)} />;
              })}
          </g>
        ))}
        {/* blood vessel: arteriole with capillary loops */}
        <path d={`M-20 ${vy} C150 ${vy - 20} 250 ${vy + 20} 400 ${vy} S650 ${vy - 20} 820 ${vy}`} stroke={BLOOD_D} strokeWidth={vr * 2 + 8} fill="none" strokeLinecap="round" />
        <path d={`M-20 ${vy} C150 ${vy - 20} 250 ${vy + 20} 400 ${vy} S650 ${vy - 20} 820 ${vy}`} stroke="url(#ss-vein)" strokeWidth={vr * 2} fill="none" strokeLinecap="round" />
        <path d={`M-20 ${vy - vr * 0.45} C150 ${vy - 20 - vr * 0.45} 250 ${vy + 20 - vr * 0.45} 400 ${vy - vr * 0.45} S650 ${vy - 20 - vr * 0.45} 820 ${vy - vr * 0.45}`} stroke="#fff" strokeWidth={vr * 0.35} opacity={0.35} fill="none" />
        {[90, 290, 510, 720].map((x, i) => (
          <path key={i} d={`M${x - 16} ${vy - 10} C${x - 20} ${top(x) + 110} ${x + 20} ${top(x) + 110} ${x + 16} ${vy - 10}`} stroke={BLOOD} strokeWidth={8 * (1 - 0.6 * squeeze) + 2} fill="none" strokeLinecap="round" />
        ))}
        {/* blood cells flowing */}
        {[0, 1, 2, 3, 4, 5, 6].map((k) => {
          const ph = (t * (0.25 - 0.15 * squeeze) + k / 7) % 1;
          const x = -20 + ph * 840;
          return <ellipse key={k} cx={x} cy={vy + 5 * Math.sin(x / 120)} rx={9 * (1 - 0.4 * squeeze)} ry={6 * (1 - 0.4 * squeeze)} fill="#F2A397" stroke={BLOOD_D} strokeWidth={2} />;
        })}
        {/* squeeze arrows */}
        {squeeze > 0.05 &&
          [250, 560].map((x) => (
            <g key={x} opacity={Math.min(1, squeeze * 2)}>
              <path d={`M${x} ${vy - 70} l0 ${30 + 8 * Math.sin(t * 8)}`} stroke={S} strokeWidth={6} strokeLinecap="round" />
              <path d={`M${x - 10} ${vy - 46 + 8 * Math.sin(t * 8)} l10 10 l10 -10`} stroke={S} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d={`M${x} ${vy + 70} l0 ${-30 - 8 * Math.sin(t * 8)}`} stroke={S} strokeWidth={6} strokeLinecap="round" />
              <path d={`M${x - 10} ${vy + 46 - 8 * Math.sin(t * 8)} l10 -10 l10 10`} stroke={S} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          ))}
        {/* nerve fiber */}
        {nerve > 0 && (
          <g>
            <path d="M-10 520 C120 500 200 470 260 420 C320 370 360 360 420 352" stroke={C.bananaDark} strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray={560} strokeDashoffset={560 * (1 - Math.min(1, nerve))} />
            <path d="M-10 520 C120 500 200 470 260 420 C320 370 360 360 420 352" stroke={C.banana} strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray={560} strokeDashoffset={560 * (1 - Math.min(1, nerve))} />
            {nerve >= 1 && (
              <>
                <circle cx={420} cy={352} r={60} fill="url(#ss-glow)" opacity={0.6 + 0.4 * Math.sin(t * 12)} />
                {[0, 1].map((k) => {
                  const ph = (t * 1.2 + k / 2) % 1;
                  const x = -10 + ph * 430;
                  const y = 520 - ph * 168 - 30 * Math.sin(ph * Math.PI);
                  return <circle key={k} cx={x} cy={y} r={10} fill={C.banana} stroke={S} strokeWidth={3} />;
                })}
              </>
            )}
          </g>
        )}
      </g>
      <rect x={3} y={3} width={794} height={554} rx={40} fill="none" stroke={S} strokeWidth={6} />
    </svg>
  );
};

/* ---------- Fingertip side view: pad shrinks, underside puckers ---------- */
export const PadSide: React.FC<{ w?: number; shrink: number; t: number }> = ({ w = 760, shrink, t }) => {
  const amp = 13 * shrink;
  const env = (x: number) => Math.sin(Math.max(0, Math.min(1, (x - 60) / 600)) * Math.PI);
  const under = (x: number) => 330 + 46 * Math.sin(((x - 60) / 620) * Math.PI * 0.9) - 26 * shrink * env(x) + amp * Math.sin(x / 14) * env(x);
  let bottom = "";
  for (let x = 640; x >= 0; x -= 5) bottom += ` L${x} ${under(x)}`;
  return (
    <svg width={w} height={w * 0.6} viewBox="0 0 760 460" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="ps-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={SKIN_L} />
          <stop offset="55%" stopColor={SKIN} />
          <stop offset="100%" stopColor={SKIN_D} />
        </linearGradient>
        <linearGradient id="ps-nail" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF4EC" />
          <stop offset="100%" stopColor="#F2CFC0" />
        </linearGradient>
        <radialGradient id="ps-fat" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0%" stopColor="#FCE7A8" />
          <stop offset="100%" stopColor="#E9C46A" />
        </radialGradient>
        <linearGradient id="ps-bone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFDF5" />
          <stop offset="100%" stopColor="#E6DCC4" />
        </linearGradient>
        <linearGradient id="ps-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity={0} />
          <stop offset="18%" stopColor="#fff" stopOpacity={1} />
        </linearGradient>
        <mask id="ps-mask">
          <rect x={-20} y={0} width={800} height={460} fill="url(#ps-fade)" />
        </mask>
      </defs>
      <ellipse cx={400} cy={445} rx={290} ry={12} fill={S} opacity={0.1} />
      <g mask="url(#ps-mask)">
        <path d={`M0 70 L540 70 C680 66 735 180 712 262 C700 305 668 320 640 ${under(640)} ${bottom} Z`} fill="url(#ps-skin)" stroke={S} strokeWidth={6} strokeLinejoin="round" />
        {/* nail */}
        <path d="M400 72 L590 72 C650 74 690 110 690 136 L400 136 C392 110 392 90 400 72 Z" fill="url(#ps-nail)" stroke={S} strokeWidth={5} />
        <path d="M425 90 L590 90" stroke="#fff" strokeWidth={7} opacity={0.7} strokeLinecap="round" />
        <path d="M400 136 L690 136" stroke="#E7B8A6" strokeWidth={4} />
        {/* bone: middle + distal phalanx */}
        <path d="M0 176 C60 168 160 170 230 172 C252 160 270 162 280 176 C290 192 276 206 256 204 C200 206 80 208 0 212 Z" fill="url(#ps-bone)" stroke="#C8B99A" strokeWidth={4} />
        <path d="M296 178 C312 162 340 164 352 178 C420 180 500 186 540 196 C566 204 566 222 540 226 C500 232 420 230 352 226 C338 240 310 238 298 222 C290 210 290 190 296 178 Z" fill="url(#ps-bone)" stroke="#C8B99A" strokeWidth={4} />
        {/* fat pad */}
        <ellipse cx={440} cy={290 - 6 * shrink} rx={210 - 42 * shrink} ry={44 - 14 * shrink} fill="url(#ps-fat)" stroke="#C9A445" strokeWidth={4} opacity={0.95} />
        {[0, 1, 2, 3, 4].map((k) => (
          <circle key={k} cx={330 + k * 50} cy={288 - 6 * shrink + (k % 2 ? 8 : -8) * (1 - shrink * 0.4)} r={9 - 3 * shrink} fill="#FFF3C4" opacity={0.7} />
        ))}
        {/* highlight */}
        <path d="M60 92 L520 92" stroke="#fff" strokeWidth={9} opacity={0.3} strokeLinecap="round" />
      </g>
      {/* inward arrows */}
      {shrink > 0.05 &&
        [-1, 1].map((s) => (
          <g key={s} opacity={Math.min(1, shrink * 2)} transform={`translate(${440 + s * (262 - 34 * shrink + 6 * Math.sin(t * 7))} 290)`}>
            <path d={`M${s * 40} 0 L0 0 M${s * 14} -14 L0 0 L${s * 14} 14`} stroke={S} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ))}
    </svg>
  );
};

/* ---------- Fingertip close-up (palm side), wrinkle pattern from seed ---------- */
export const Fingertip: React.FC<{ size?: number; wrinkle: number; seed?: number; t: number; id: string; tint?: string; print?: number }> = ({ size = 360, wrinkle, seed = 3, t, id, tint, print = 0.25 }) => {
  const lines = Array.from({ length: 9 }, (_, i) => {
    const y = 110 + i * 34;
    const x0 = 70 + rnd(seed + i * 7) * 30;
    const x1 = 330 - rnd(seed + i * 11) * 30;
    const tilt = (rnd(seed + i * 13) - 0.5) * 40;
    const midA = (rnd(seed + i * 17) - 0.5) * 36;
    const midB = (rnd(seed + i * 19) - 0.5) * 36;
    return `M${x0} ${y} C${x0 + 70} ${y + midA} ${x1 - 70} ${y + tilt + midB} ${x1} ${y + tilt}`;
  });
  const branches = Array.from({ length: 5 }, (_, i) => {
    const x = 110 + rnd(seed + i * 23) * 180;
    const y = 120 + rnd(seed + i * 29) * 250;
    return `M${x} ${y} c${10 + rnd(seed + i) * 20} 20 ${-10} 40 ${10} 60`;
  });
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 400 500" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={`${id}-g`} cx="0.4" cy="0.35" r="0.75">
          <stop offset="0%" stopColor={SKIN_L} />
          <stop offset="65%" stopColor={tint || SKIN} />
          <stop offset="100%" stopColor={SKIN_M} />
        </radialGradient>
        <clipPath id={`${id}-c`}>
          <path d="M60 500 L60 200 C60 60 340 60 340 200 L340 500 Z" />
        </clipPath>
      </defs>
      <path d="M60 500 L60 200 C60 60 340 60 340 200 L340 500 Z" fill={`url(#${id}-g)`} />
      <g clipPath={`url(#${id}-c)`}>
        {/* fingerprint whorl */}
        {Array.from({ length: 12 }, (_, i) => (
          <ellipse key={i} cx={200} cy={250} rx={18 + i * 15} ry={26 + i * 17} fill="none" stroke={SKIN_D} strokeWidth={2.4} opacity={print} />
        ))}
        {/* wrinkle ridges */}
        {lines.map((d, i) => (
          <g key={i} opacity={Math.min(1, wrinkle * 1.6 - i * 0.05)}>
            <path d={d} stroke="#B9765A" strokeWidth={7} fill="none" strokeLinecap="round" />
            <path d={d} stroke="#fff" strokeWidth={3} fill="none" opacity={0.55} strokeLinecap="round" transform="translate(0 7)" />
          </g>
        ))}
        {branches.map((d, i) => (
          <path key={i} d={d} stroke="#B9765A" strokeWidth={5} fill="none" strokeLinecap="round" opacity={Math.min(1, wrinkle * 1.4)} />
        ))}
        <ellipse cx={140} cy={150} rx={40} ry={60} fill="#fff" opacity={0.25 + 0.05 * Math.sin(t * 2)} />
      </g>
      <path d="M60 500 L60 200 C60 60 340 60 340 200 L340 500" fill="none" stroke={S} strokeWidth={7} strokeLinejoin="round" />
    </svg>
  );
};

/* ---------- Magnifying glass ---------- */
export const Magnifier: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible" }}>
    <defs>
      <radialGradient id="mg-g" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0%" stopColor="#fff" stopOpacity={0.8} />
        <stop offset="100%" stopColor={WATER_L} stopOpacity={0.35} />
      </radialGradient>
    </defs>
    <rect x={120} y={120} width={30} height={80} rx={12} transform="rotate(-45 135 160)" fill={C.matchaDark} stroke={S} strokeWidth={5} />
    <circle cx={85} cy={85} r={62} fill="url(#mg-g)" stroke={S} strokeWidth={14} />
    <circle cx={85} cy={85} r={62} fill="none" stroke={C.matcha} strokeWidth={6} />
    <path d="M50 65 C58 48 72 40 88 38" stroke="#fff" strokeWidth={8} strokeLinecap="round" fill="none" />
  </svg>
);

/* ---------- Soak test: basin + dipping fingers + clipboard ---------- */
export const SoakTest: React.FC<{ w?: number; dip: number; check: number; t: number }> = ({ w = 760, dip, check, t }) => (
  <svg width={w} height={w * 0.85} viewBox="0 0 760 640" style={{ overflow: "visible" }}>
    <defs>
      <linearGradient id="st-bowl" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#E9EEE4" />
        <stop offset="50%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#CFD6C6" />
      </linearGradient>
      <linearGradient id="st-w" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={WATER_L} />
        <stop offset="100%" stopColor={WATER} />
      </linearGradient>
      <linearGradient id="st-skin" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={SKIN_L} />
        <stop offset="100%" stopColor={SKIN_M} />
      </linearGradient>
      <clipPath id="st-wclip">
        <path d="M70 330 L450 330 C440 470 400 540 260 540 C120 540 80 470 70 330 Z" />
      </clipPath>
    </defs>
    {/* fingers dipping */}
    <g transform={`translate(0 ${-160 + 200 * dip})`}>
      {[180, 240, 300].map((x, i) => (
        <g key={x}>
          <rect x={x - 26} y={0} width={52} height={300 - i * 10} rx={26} fill="url(#st-skin)" stroke={S} strokeWidth={5} />
          <path d={`M${x - 16} ${90} q16 6 32 0`} stroke={SKIN_D} strokeWidth={3.5} fill="none" />
        </g>
      ))}
    </g>
    {/* bowl back + water */}
    <ellipse cx={260} cy={330} rx={200} ry={36} fill="#D7DED0" stroke={S} strokeWidth={5} />
    <g clipPath="url(#st-wclip)">
      <rect x={60} y={340} width={400} height={220} fill="url(#st-w)" opacity={0.85} />
      {[0, 1, 2].map((i) => (
        <ellipse key={i} cx={240} cy={350 + i * 30} rx={60 + ((t * 40 + i * 30) % 90)} ry={8} fill="none" stroke="#fff" strokeWidth={3} opacity={0.5} />
      ))}
    </g>
    <path d="M60 330 C70 480 120 552 260 552 C400 552 450 480 460 330" fill="url(#st-bowl)" stroke={S} strokeWidth={6} opacity={0.55} />
    <path d="M60 330 C70 480 120 552 260 552 C400 552 450 480 460 330" fill="none" stroke={S} strokeWidth={6} />
    <ellipse cx={260} cy={330} rx={200} ry={36} fill="none" stroke={S} strokeWidth={6} />
    <path d="M100 380 C110 450 140 500 190 520" stroke="#fff" strokeWidth={10} opacity={0.6} fill="none" strokeLinecap="round" />
    {/* clipboard */}
    <g transform={`translate(500 160) rotate(${6 + Math.sin(t * 1.5) * 2})`}>
      <rect x={0} y={0} width={220} height={300} rx={22} fill={C.matchaDark} stroke={S} strokeWidth={5} />
      <rect x={18} y={30} width={184} height={252} rx={10} fill={C.card} stroke={S} strokeWidth={4} />
      <rect x={70} y={-14} width={80} height={36} rx={10} fill="#B9C2AE" stroke={S} strokeWidth={4} />
      <text x={110} y={74} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill={S}>
        NERVE TEST
      </text>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(36 ${110 + i * 54})`}>
          <rect width={34} height={34} rx={8} fill="#fff" stroke={S} strokeWidth={4} />
          {check > i / 3 + 0.1 && <path d="M7 18 L15 26 L29 8" stroke={C.matcha} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
          <rect x={50} y={10} width={96 - i * 14} height={12} rx={6} fill={C.line} />
        </g>
      ))}
    </g>
  </svg>
);

/* ---------- Lab flask (Newcastle study) ---------- */
export const Flask: React.FC<{ size?: number; t: number }> = ({ size = 220, t }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible" }}>
    <defs>
      <linearGradient id="fl-l" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={C.matchaLight} />
        <stop offset="100%" stopColor={C.matcha} />
      </linearGradient>
    </defs>
    <path d="M80 20 L120 20 L120 70 L170 170 C176 184 166 192 152 192 L48 192 C34 192 24 184 30 170 L80 70 Z" fill="#fff" stroke={S} strokeWidth={6} strokeLinejoin="round" />
    <path d="M58 120 L142 120 L166 172 C170 182 162 186 152 186 L48 186 C38 186 30 182 34 172 Z" fill="url(#fl-l)" />
    {[0, 1, 2].map((i) => {
      const ph = (t * 0.7 + i / 3) % 1;
      return <circle key={i} cx={80 + i * 20} cy={180 - ph * 70} r={6 - ph * 3} fill="#fff" opacity={1 - ph} />;
    })}
    <rect x={72} y={12} width={56} height={14} rx={6} fill={C.forest} />
    <path d="M70 140 L60 165" stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.6} />
  </svg>
);

/* ---------- Marble race: smooth vs wrinkly fingers ---------- */
const Marble: React.FC<{ x: number; y: number; c: string; r?: number }> = ({ x, y, c, r = 15 }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill={c} stroke={S} strokeWidth={3} />
    <circle cx={-r * 0.35} cy={-r * 0.35} r={r * 0.35} fill="#fff" opacity={0.7} />
  </g>
);
export const MarbleRace: React.FC<{ w?: number; p: number; t: number }> = ({ w = 820, p, t }) => {
  const cols = [C.matcha, C.banana, BLOOD, C.matchaLight, WATER_D, C.bananaDark, C.matchaDark, BLOOD_L];
  const lane = (y: number, speed: number, label: string, dark: boolean) => {
    const prog = Math.min(1, p * speed);
    const moved = Math.floor(prog * 8);
    const fly = (prog * 8) % 1;
    return (
      <g transform={`translate(0 ${y})`}>
        <rect x={0} y={0} width={820} height={250} rx={30} fill={dark ? "#EEF2E4" : C.card} stroke={C.line} strokeWidth={3} />
        {/* bowl with water */}
        <path d="M30 120 L230 120 C224 200 190 230 130 230 C70 230 36 200 30 120 Z" fill={WATER} stroke={S} strokeWidth={5} />
        <ellipse cx={130} cy={120} rx={100} ry={18} fill={WATER_L} stroke={S} strokeWidth={5} />
        {cols.slice(moved).map((c, i) => (
          <Marble key={i} x={80 + (i % 4) * 32} y={150 + Math.floor(i / 4) * 30} c={c} />
        ))}
        {/* box */}
        <path d="M590 130 L790 130 L770 230 L610 230 Z" fill="#D9C7A0" stroke={S} strokeWidth={5} />
        <path d="M590 130 L790 130" stroke={S} strokeWidth={8} />
        {cols.slice(0, moved).map((c, i) => (
          <Marble key={i} x={640 + (i % 4) * 32} y={205 - Math.floor(i / 4) * 30} c={c} />
        ))}
        {/* flying marble arc */}
        {moved < 8 && p > 0 && <Marble x={150 + fly * 520} y={130 - Math.sin(fly * Math.PI) * 110} c={cols[moved]} />}
        {/* label */}
        <g transform="translate(300 18)">
          <rect width={220} height={50} rx={25} fill={dark ? C.matcha : C.forest} />
          <text x={110} y={34} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={C.paper}>
            {label}
          </text>
        </g>
        {/* progress bar */}
        <rect x={250} y={200} width={320} height={22} rx={11} fill={C.line} />
        <rect x={250} y={200} width={320 * prog} height={22} rx={11} fill={dark ? C.matcha : "#9AA38C"} />
        {prog >= 1 && (
          <g transform={`translate(560 70) scale(${1 + 0.08 * Math.sin(t * 8)})`}>
            <circle r={32} fill={C.banana} stroke={S} strokeWidth={4} />
            <path d="M-13 1 L-3 11 L14 -9" stroke={S} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
      </g>
    );
  };
  return (
    <svg width={w} height={w * 0.66} viewBox="0 0 820 540" style={{ overflow: "visible" }}>
      {lane(0, 0.89, "smooth fingers", false)}
      {lane(280, 1.0, "wrinkly fingers", true)}
    </svg>
  );
};

/* ---------- Tire with treads on wet road ---------- */
export const Tire: React.FC<{ size?: number; t: number }> = ({ size = 360, t }) => {
  const rot = (t * 160) % 360;
  return (
    <svg width={size} height={size} viewBox="0 0 400 400" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="ti-r" cx="0.45" cy="0.4" r="0.6">
          <stop offset="70%" stopColor="#3A4630" />
          <stop offset="100%" stopColor="#141C0C" />
        </radialGradient>
        <radialGradient id="ti-hub" cx="0.4" cy="0.35" r="0.7">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#B9C2AE" />
        </radialGradient>
      </defs>
      <rect x={0} y={340} width={400} height={50} rx={10} fill="#6B7563" />
      <rect x={0} y={340} width={400} height={14} fill={WATER} opacity={0.8} />
      <g transform={`rotate(${rot} 200 190)`}>
        <circle cx={200} cy={190} r={150} fill="url(#ti-r)" stroke={S} strokeWidth={6} />
        {Array.from({ length: 24 }, (_, i) => (
          <rect key={i} x={194} y={36} width={14} height={34} rx={4} fill="#55614A" transform={`rotate(${i * 15} 200 190)`} />
        ))}
        <circle cx={200} cy={190} r={86} fill="url(#ti-hub)" stroke={S} strokeWidth={6} />
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx={200 + 46 * Math.cos((i * 72 * Math.PI) / 180)} cy={190 + 46 * Math.sin((i * 72 * Math.PI) / 180)} r={10} fill="#8C9680" stroke={S} strokeWidth={3} />
        ))}
        <circle cx={200} cy={190} r={22} fill={C.matcha} stroke={S} strokeWidth={4} />
      </g>
      {/* spray */}
      {Array.from({ length: 8 }, (_, i) => {
        const ph = (t * 1.4 + i / 8) % 1;
        const dir = i % 2 ? 1 : -1;
        return <circle key={i} cx={200 + dir * (40 + ph * 170)} cy={340 - Math.sin(ph * Math.PI) * 90} r={8 - ph * 4} fill={WATER} stroke={WATER_D} strokeWidth={2} opacity={1 - ph} />;
      })}
    </svg>
  );
};

/* ---------- Water channel arrows over ridges ---------- */
export const Channels: React.FC<{ size?: number; t: number }> = ({ size = 360, t }) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 400 500" style={{ overflow: "visible", position: "absolute", left: 0, top: 0 }}>
    {[0, 1, 2, 3].map((i) => {
      const ph = (t * 0.9 + i / 4) % 1;
      const y = 150 + i * 70;
      return (
        <g key={i} opacity={Math.sin(ph * Math.PI)} transform={`translate(${120 + ph * 160} ${y})`}>
          <path d="M-20 0 L10 0 M0 -10 L12 0 L0 10" stroke={WATER_D} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={-34} cy={0} r={6} fill={WATER} stroke={WATER_D} strokeWidth={2} />
        </g>
      );
    })}
  </svg>
);

/* ---------- Camera ---------- */
export const Camera: React.FC<{ size?: number; flash: number }> = ({ size = 220, flash }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 240 190" style={{ overflow: "visible" }}>
    <defs>
      <radialGradient id="cm-l" cx="0.4" cy="0.35" r="0.7">
        <stop offset="0%" stopColor="#8FB4C9" />
        <stop offset="100%" stopColor="#1F2A14" />
      </radialGradient>
      <radialGradient id="cm-f">
        <stop offset="0%" stopColor="#fff" stopOpacity={1} />
        <stop offset="100%" stopColor={C.banana} stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle cx={60} cy={40} r={90} fill="url(#cm-f)" opacity={flash} />
    <rect x={20} y={40} width={200} height={140} rx={24} fill="#3A4630" stroke={S} strokeWidth={6} />
    <rect x={80} y={20} width={80} height={30} rx={8} fill="#3A4630" stroke={S} strokeWidth={6} />
    <rect x={36} y={30} width={40} height={18} rx={5} fill={C.banana} stroke={S} strokeWidth={4} />
    <circle cx={120} cy={110} r={50} fill="#E4E2CF" stroke={S} strokeWidth={6} />
    <circle cx={120} cy={110} r={36} fill="url(#cm-l)" stroke={S} strokeWidth={4} />
    <circle cx={108} cy={98} r={10} fill="#fff" opacity={0.7} />
  </svg>
);

/* ---------- Calendar day flip ---------- */
export const Calendar: React.FC<{ size?: number; flip: number }> = ({ size = 220, flip }) => {
  const sc = Math.abs(Math.cos(flip * Math.PI));
  const day = flip < 0.5 ? "1" : "2";
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 200 220" style={{ overflow: "visible" }}>
      <rect x={10} y={20} width={180} height={190} rx={22} fill={C.card} stroke={S} strokeWidth={6} />
      <path d="M10 42 C10 30 20 20 32 20 L168 20 C180 20 190 30 190 42 L190 70 L10 70 Z" fill={C.red} stroke={S} strokeWidth={6} />
      {[60, 140].map((x) => (
        <rect key={x} x={x - 7} y={6} width={14} height={34} rx={7} fill={S} />
      ))}
      <g transform={`translate(100 140) scale(1 ${sc}) translate(-100 -140)`}>
        <text x={100} y={112} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={C.matcha}>
          DAY
        </text>
        <text x={100} y={190} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={84} fill={S}>
          {day}
        </text>
      </g>
    </svg>
  );
};

/* ---------- Blood vessel map under fingertip, pins barely move ---------- */
export const VesselMap: React.FC<{ size?: number; p: number; t: number }> = ({ size = 420, p, t }) => {
  const paths = [
    "M200 500 C200 420 196 360 200 300 C204 240 200 180 200 120",
    "M200 380 C160 350 130 320 110 260",
    "M200 380 C240 350 270 320 290 260",
    "M200 300 C170 270 150 230 140 180",
    "M200 300 C230 270 250 230 262 180",
    "M110 260 C100 230 104 200 120 170",
    "M290 260 C300 230 296 200 280 170",
    "M200 200 C180 180 170 150 170 120",
    "M200 200 C220 180 232 150 232 120",
  ];
  const pins: [number, number][] = [
    [110, 260],
    [290, 260],
    [140, 180],
    [262, 180],
    [200, 120],
  ];
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 400 500" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="vm-g" cx="0.4" cy="0.35" r="0.75">
          <stop offset="0%" stopColor={SKIN_L} />
          <stop offset="70%" stopColor={SKIN} />
          <stop offset="100%" stopColor={SKIN_M} />
        </radialGradient>
        <linearGradient id="vm-v" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={BLOOD_D} />
          <stop offset="50%" stopColor={BLOOD} />
          <stop offset="100%" stopColor={BLOOD_D} />
        </linearGradient>
      </defs>
      <path d="M60 500 L60 200 C60 60 340 60 340 200 L340 500 Z" fill="url(#vm-g)" stroke={S} strokeWidth={7} />
      {paths.map((d, i) => (
        <g key={i}>
          <path d={d} stroke={BLOOD_D} strokeWidth={i === 0 ? 16 : 10} fill="none" strokeLinecap="round" strokeDasharray={420} strokeDashoffset={420 * (1 - Math.min(1, p * 1.5 - i * 0.06))} opacity={0.9} />
          <path d={d} stroke={BLOOD_L} strokeWidth={i === 0 ? 5 : 3} fill="none" strokeLinecap="round" strokeDasharray={420} strokeDashoffset={420 * (1 - Math.min(1, p * 1.5 - i * 0.06))} opacity={0.8} />
        </g>
      ))}
      {p > 0.8 &&
        pins.map(([x, y], i) => (
          <g key={i} transform={`translate(${x + Math.sin(t * 3 + i) * 1.5} ${y + Math.cos(t * 3 + i) * 1.5})`}>
            <path d="M0 0 C-14 -16 -14 -34 0 -38 C14 -34 14 -16 0 0 Z" fill={C.banana} stroke={S} strokeWidth={4} />
            <circle cy={-26} r={5} fill={S} />
          </g>
        ))}
    </svg>
  );
};

/* ---------- Fingerprint scan ---------- */
export const Fingerprint: React.FC<{ size?: number; scan: number; t: number }> = ({ size = 320, scan, t }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 300 360" style={{ overflow: "visible" }}>
    <defs>
      <clipPath id="fp-c">
        <path d="M40 336 L40 160 C40 40 260 40 260 160 L260 336 Z" />
      </clipPath>
      <linearGradient id="fp-scan" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={C.banana} stopOpacity={0} />
        <stop offset="100%" stopColor={C.banana} stopOpacity={0.85} />
      </linearGradient>
    </defs>
    <rect x={10} y={20} width={280} height={330} rx={36} fill="#26331A" stroke={S} strokeWidth={6} />
    <g clipPath="url(#fp-c)">
      {Array.from({ length: 13 }, (_, i) => (
        <path key={i} d={`M${150 - 10 - i * 11} ${360} L${150 - 10 - i * 11} ${200 - i * 2} C${150 - 10 - i * 11} ${150 - i * 9} ${150 + 10 + i * 11} ${150 - i * 9} ${150 + 10 + i * 11} ${200 - i * 2} L${150 + 10 + i * 11} ${300 + (i % 3) * 10}`} stroke={C.matchaLight} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.95} />
      ))}
    </g>
    <rect x={20} y={30 + 300 * ((scan + t * 0) % 1) - 50} width={260} height={50} fill="url(#fp-scan)" opacity={scan > 0 && scan < 1 ? 1 : 0} />
  </svg>
);

/* ---------- ID card with match ---------- */
export const IdCard: React.FC<{ w?: number; match: number; t: number }> = ({ w = 420, match, t }) => (
  <svg width={w} height={w * 0.66} viewBox="0 0 420 280" style={{ overflow: "visible" }}>
    <defs>
      <linearGradient id="id-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFFEF6" />
        <stop offset="100%" stopColor="#ECEAD6" />
      </linearGradient>
    </defs>
    <rect x={6} y={6} width={408} height={268} rx={28} fill="url(#id-g)" stroke={S} strokeWidth={6} />
    <rect x={6} y={6} width={408} height={56} rx={28} fill={C.matcha} />
    <rect x={6} y={40} width={408} height={22} fill={C.matcha} />
    <text x={30} y={46} fontFamily={FONT} fontWeight={800} fontSize={26} fill={C.paper}>
      IDENTIFIED
    </text>
    <rect x={30} y={86} width={120} height={150} rx={16} fill="#D9DECF" stroke={S} strokeWidth={4} />
    <circle cx={90} cy={140} r={30} fill="#A9B39A" />
    <path d="M44 236 C50 190 130 190 136 236 Z" fill="#A9B39A" />
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={176} y={100 + i * 34} width={200 - i * 30} height={16} rx={8} fill={C.line} />
    ))}
    {match > 0 && (
      <g transform={`translate(340 210) scale(${Math.min(1, match * 1.4) * (1 + 0.05 * Math.sin(t * 8))})`}>
        <circle r={44} fill={C.matcha} stroke={S} strokeWidth={5} />
        <path d="M-18 2 L-5 15 L20 -12" stroke="#fff" strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    )}
  </svg>
);

/* ---------- Bathtub with hand grabbing soap ---------- */
export const Bathtub: React.FC<{ w?: number; grab: number; t: number }> = ({ w = 800, grab, t }) => (
  <svg width={w} height={w * 0.8} viewBox="0 0 800 640" style={{ overflow: "visible" }}>
    <defs>
      <linearGradient id="bt-tub" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#D7DED0" />
      </linearGradient>
      <linearGradient id="bt-w" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={WATER_L} />
        <stop offset="100%" stopColor={WATER} />
      </linearGradient>
      <linearGradient id="bt-skin" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={SKIN_L} />
        <stop offset="100%" stopColor={SKIN_M} />
      </linearGradient>
      <radialGradient id="bt-duck" cx="0.4" cy="0.3" r="0.8">
        <stop offset="0%" stopColor="#FFF3B0" />
        <stop offset="100%" stopColor={C.bananaDark} />
      </radialGradient>
      <linearGradient id="bt-soap" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#E6F2D6" />
        <stop offset="100%" stopColor={C.matchaLight} />
      </linearGradient>
    </defs>
    {/* tiles */}
    {Array.from({ length: 4 }, (_, r) =>
      Array.from({ length: 6 }, (_, c) => <rect key={`${r}-${c}`} x={20 + c * 128} y={10 + r * 76} width={120} height={68} rx={10} fill={(r + c) % 2 ? "#EEF1E6" : "#E5EADB"} />)
    )}
    {/* faucet */}
    <path d="M640 230 L640 170 C640 140 700 140 700 170" stroke="#9AA38C" strokeWidth={22} fill="none" strokeLinecap="round" />
    <path d="M640 230 L640 170 C640 140 700 140 700 170" stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.6} />
    {/* drip */}
    <circle cx={700} cy={190 + ((t * 120) % 90)} r={7} fill={WATER} stroke={WATER_D} strokeWidth={2} opacity={1 - ((t * 120) % 90) / 90} />
    {/* water surface */}
    <path d={`M60 300 ${Array.from({ length: 35 }, (_, k) => `L${60 + k * 20} ${300 + 6 * Math.sin(t * 2.5 + k * 0.6)}`).join(" ")} L740 560 L60 560 Z`} fill="url(#bt-w)" />
    {/* bubbles */}
    {Array.from({ length: 14 }, (_, i) => (
      <circle key={i} cx={90 + i * 46 + 8 * Math.sin(t + i)} cy={294 + 10 * Math.sin(t * 1.4 + i * 2)} r={14 + (i % 3) * 8} fill="#fff" stroke="#C9D8D2" strokeWidth={3} opacity={0.9} />
    ))}
    {/* duck */}
    <g transform={`translate(500 ${262 + 6 * Math.sin(t * 2.5)}) rotate(${4 * Math.sin(t * 2)})`}>
      <ellipse cx={0} cy={20} rx={64} ry={38} fill="url(#bt-duck)" stroke={S} strokeWidth={5} />
      <circle cx={34} cy={-26} r={30} fill="url(#bt-duck)" stroke={S} strokeWidth={5} />
      <path d="M60 -26 L88 -18 L60 -12 Z" fill="#E8833A" stroke={S} strokeWidth={4} strokeLinejoin="round" />
      <circle cx={44} cy={-34} r={5} fill={S} />
      <path d="M-30 14 C-10 30 20 28 30 12" stroke={C.bananaDark} strokeWidth={5} fill="none" strokeLinecap="round" />
    </g>
    {/* hand rising to grab soap */}
    <g transform={`translate(240 ${380 - 150 * grab})`}>
      {/* soap */}
      <g transform={`translate(0 ${-70}) rotate(${-8 + 6 * Math.sin(t * 2)})`}>
        <rect x={-70} y={-30} width={140} height={64} rx={26} fill="url(#bt-soap)" stroke={S} strokeWidth={5} />
        <path d="M-50 -14 L30 -14" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.7} />
      </g>
      {/* fingers wrapping */}
      {[
        [-50, 118],
        [-17, 140],
        [16, 134],
        [48, 112],
      ].map(([x, h], i) => (
        <g key={i}>
          <rect x={x - 17} y={-h + 60 - grab * 10} width={34} height={h + 60} rx={17} fill="url(#bt-skin)" stroke={S} strokeWidth={5} />
          <rect x={x + 6} y={-h + 72 - grab * 10} width={6} height={h * 0.6} rx={3} fill={SKIN_D} opacity={0.35} />
          {[0, 1, 2].map((k) => (
            <path key={k} d={wavy(x - 11, x + 11, -h + 74 - grab * 10 + k * 9, 2.5, i * 5 + k)} stroke={SKIN_D} strokeWidth={2.6} fill="none" strokeLinecap="round" />
          ))}
        </g>
      ))}
      <path d="M-70 40 C-74 120 -50 170 0 172 C50 170 74 120 70 40 Z" fill="url(#bt-skin)" stroke={S} strokeWidth={5} />
      <path d="M-40 60 C-30 80 20 84 40 70" stroke={SKIN_D} strokeWidth={4} fill="none" strokeLinecap="round" />
    </g>
    {/* tub */}
    <path d="M30 300 L770 300 L740 520 C730 570 690 600 640 600 L160 600 C110 600 70 570 60 520 Z" fill="url(#bt-tub)" stroke={S} strokeWidth={7} opacity={0.0} />
    <path d="M20 330 L780 330 L750 520 C740 570 700 600 650 600 L150 600 C100 600 60 570 50 520 Z" fill="url(#bt-tub)" stroke={S} strokeWidth={7} />
    <rect x={10} y={312} width={780} height={34} rx={17} fill="#FFFFFF" stroke={S} strokeWidth={7} />
    <path d="M90 380 C100 470 130 540 180 560" stroke="#fff" strokeWidth={14} opacity={0.8} fill="none" strokeLinecap="round" />
    {[150, 650].map((x) => (
      <path key={x} d={`M${x} 600 L${x - 10} 636 L${x + 30} 636 L${x + 20} 600`} fill="#B9C2AE" stroke={S} strokeWidth={5} strokeLinejoin="round" />
    ))}
  </svg>
);
