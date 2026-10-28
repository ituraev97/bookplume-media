import React from "react";
import { C, FONT } from "./kit";

export const BLUE = "#4F74B8";
export const BLUE_D = "#2E4C86";
export const BRIGHT = "#E0312F";
export const DARK = "#7E1420";
const SKIN = "#E9B595";
const SKIN_D = "#C98E6E";

const Shadow: React.FC<{ cx: number; cy: number; rx: number; o?: number }> = ({ cx, cy, rx, o = 0.13 }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={rx * 0.1} fill={C.forest} opacity={o} />
);

/* Inner forearm + hand with visible veins; magnifier shows red blood inside */
export const Wrist: React.FC<{ w?: number; mag: number; t: number }> = ({ w = 820, mag, t }) => (
  <svg width={w} height={w * 1.05} viewBox="0 0 800 840" style={{ overflow: "visible" }}>
    <defs>
      <linearGradient id="wr-s" x1="0" x2="1">
        <stop offset="0%" stopColor={SKIN_D} />
        <stop offset="35%" stopColor={SKIN} />
        <stop offset="65%" stopColor="#F2C7AA" />
        <stop offset="100%" stopColor={SKIN_D} />
      </linearGradient>
      <radialGradient id="wr-m" cx="45%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#B32A2E" />
        <stop offset="100%" stopColor={DARK} />
      </radialGradient>
      <clipPath id="wr-c">
        <circle cx={560} cy={520} r={150} />
      </clipPath>
    </defs>
    <Shadow cx={330} cy={820} rx={260} />
    {/* hand */}
    <path
      d="M210 330 C200 260 205 200 215 150 C220 120 250 120 255 150 L262 240 L270 90 C273 55 310 55 310 90 L312 230 L322 70 C326 35 362 38 362 72 L360 232 L375 95 C380 62 414 66 412 100 L402 260 L428 190 C440 160 478 172 468 206 L430 340 C420 380 400 400 395 420 Z"
      fill="url(#wr-s)"
      stroke="#9A6247"
      strokeWidth={5}
      strokeLinejoin="round"
    />
    {/* forearm */}
    <path d="M205 320 L400 340 C410 480 430 640 450 820 L190 820 C195 650 198 480 205 320 Z" fill="url(#wr-s)" />
    <path d="M205 320 C198 480 195 650 190 820 M400 340 C410 480 430 640 450 820" stroke="#9A6247" strokeWidth={5} fill="none" />
    {/* wrist creases */}
    <path d="M215 370 C270 380 340 384 398 378" stroke="#B57A5C" strokeWidth={4} fill="none" opacity={0.6} />
    <path d="M214 392 C270 402 340 404 400 398" stroke="#B57A5C" strokeWidth={3} fill="none" opacity={0.45} />
    {/* veins */}
    <g fill="none" strokeLinecap="round" opacity={0.85}>
      <path d="M260 820 C265 700 270 600 285 520 C295 470 300 430 290 360" stroke={BLUE} strokeWidth={14} opacity={0.75} />
      <path d="M380 820 C370 720 360 640 340 560 C330 520 335 470 345 400" stroke={BLUE} strokeWidth={12} opacity={0.7} />
      <path d="M285 520 C305 500 325 520 340 560" stroke={BLUE} strokeWidth={9} opacity={0.65} />
      <path d="M290 360 L285 300 M345 400 L355 320" stroke={BLUE} strokeWidth={7} opacity={0.55} />
    </g>
    {/* highlight */}
    <path d="M230 420 C228 560 225 680 222 800" stroke="#FFFFFF" strokeWidth={14} strokeLinecap="round" opacity={0.25} />
    {/* magnifier */}
    {mag > 0 && (
      <g opacity={mag} transform={`translate(${560} ${520}) scale(${0.5 + 0.5 * mag}) translate(${-560} ${-520})`}>
        <line x1={300} y1={560} x2={430} y2={535} stroke={C.forest} strokeWidth={4} strokeDasharray="10 8" />
        <circle cx={560} cy={520} r={158} fill={C.forest} />
        <g clipPath="url(#wr-c)">
          <rect x={400} y={360} width={320} height={320} fill="#F0C3A6" />
          <rect x={400} y={455} width={320} height={130} fill="url(#wr-m)" />
          <rect x={400} y={450} width={320} height={10} fill={C.redDark} opacity={0.6} />
          <rect x={400} y={580} width={320} height={10} fill={C.redDark} opacity={0.6} />
          {Array.from({ length: 9 }, (_, i) => {
            const x = 400 + ((i * 47 + t * 90) % 360) - 20;
            const y = 480 + ((i * 29) % 80);
            return (
              <g key={i} transform={`translate(${x} ${y})`}>
                <ellipse rx={26} ry={15} fill="#C9302C" stroke="#6E1018" strokeWidth={3} />
                <ellipse rx={12} ry={6} fill="#8E1C22" opacity={0.6} />
              </g>
            );
          })}
        </g>
        <circle cx={560} cy={520} r={150} fill="none" stroke={C.forest} strokeWidth={14} />
        <path d="M455 430 A130 130 0 0 1 520 385" stroke="#FFFFFF" strokeWidth={10} strokeLinecap="round" fill="none" opacity={0.7} />
        <rect x={660} y={640} width={34} height={150} rx={14} fill={C.forest} transform="rotate(-40 677 715)" />
      </g>
    )}
  </svg>
);

export const Drop: React.FC<{ color: string; size?: number; label?: string }> = ({ color, size = 220, label }) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 200 250" style={{ overflow: "visible" }}>
    <defs>
      <radialGradient id={`dr-${color}`} cx="38%" cy="55%" r="65%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.35} />
        <stop offset="40%" stopColor={color} />
        <stop offset="100%" stopColor={color} />
      </radialGradient>
    </defs>
    <ellipse cx={100} cy={242} rx={70} ry={8} fill={C.forest} opacity={0.13} />
    <path d="M100 10 C130 70 175 115 175 160 C175 205 140 232 100 232 C60 232 25 205 25 160 C25 115 70 70 100 10 Z" fill={`url(#dr-${color})`} stroke={C.forest} strokeWidth={6} strokeLinejoin="round" />
    <path d="M60 150 C60 125 72 105 85 90" stroke="#FFFFFF" strokeWidth={10} strokeLinecap="round" fill="none" opacity={0.6} />
    {label && (
      <text x={100} y={190} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill="#FFFFFF">
        {label}
      </text>
    )}
  </svg>
);

export const Vial: React.FC<{ color: string; h?: number; fill?: number }> = ({ color, h = 520, fill = 1 }) => {
  const fy = 470 - 380 * fill;
  return (
    <svg width={h * 0.42} height={h} viewBox="0 0 210 520" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`vl-${color}`} x1="0" x2="1">
          <stop offset="0%" stopColor={color} />
          <stop offset="35%" stopColor={color} stopOpacity={0.85} />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
        <clipPath id={`vc-${color}`}>
          <path d="M45 70 L165 70 L165 440 C165 480 140 500 105 500 C70 500 45 480 45 440 Z" />
        </clipPath>
      </defs>
      <ellipse cx={105} cy={512} rx={80} ry={8} fill={C.forest} opacity={0.13} />
      <path d="M45 70 L165 70 L165 440 C165 480 140 500 105 500 C70 500 45 480 45 440 Z" fill="#FFFFFF" opacity={0.7} />
      <g clipPath={`url(#vc-${color})`}>
        <rect x={40} y={fy} width={130} height={520} fill={`url(#vl-${color})`} />
        <ellipse cx={105} cy={fy} rx={62} ry={10} fill="#FFFFFF" opacity={0.25} />
      </g>
      <path d="M45 70 L165 70 L165 440 C165 480 140 500 105 500 C70 500 45 480 45 440 Z" fill="none" stroke={C.forest} strokeWidth={6} />
      <rect x={30} y={30} width={150} height={52} rx={12} fill={C.matcha} stroke={C.forest} strokeWidth={6} />
      <rect x={40} y={38} width={130} height={10} rx={5} fill="#FFFFFF" opacity={0.35} />
      <path d="M62 110 L62 420" stroke="#FFFFFF" strokeWidth={10} strokeLinecap="round" opacity={0.55} />
    </svg>
  );
};

/* Skin cross-section with light rays. pW=white beam, pR=red ray progress, pA=absorbed, pB=blue ray progress */
export const SkinSection: React.FC<{ w?: number; pW: number; pS: number; pR: number; pA: number; pB: number }> = ({ w = 820, pW, pS, pR, pA, pB }) => {
  const H = 640;
  const vein = { x: 520, y: 470, r: 62 };
  // red path: from (240,0) to vein top-left
  const rx0 = 250,
    ry0 = 70,
    rx1 = vein.x - 30,
    ry1 = vein.y - 45;
  const rLen = pR;
  // blue path: down to depth 175 then back up
  const bx0 = 380,
    by0 = 70,
    bx1 = 470,
    by1 = 200,
    bx2 = 560,
    by2 = 40;
  const bA = Math.min(1, pB * 2);
  const bB = Math.max(0, pB * 2 - 1);
  return (
    <svg width={w} height={(w / 820) * H} viewBox={`0 0 820 ${H}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="sk-e" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F4CDB2" />
          <stop offset="100%" stopColor={SKIN} />
        </linearGradient>
        <linearGradient id="sk-d" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E9A792" />
          <stop offset="100%" stopColor="#D98F7C" />
        </linearGradient>
        <linearGradient id="sk-f" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F6E2A8" />
          <stop offset="100%" stopColor="#EBCF85" />
        </linearGradient>
        <radialGradient id="sk-v" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#B32A2E" />
          <stop offset="100%" stopColor={DARK} />
        </radialGradient>
        <linearGradient id="sk-w" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FFF6D8" />
        </linearGradient>
      </defs>
      {/* layers */}
      <rect x={0} y={130} width={820} height={70} rx={0} fill="url(#sk-e)" />
      <rect x={0} y={200} width={820} height={210} fill="url(#sk-d)" />
      <rect x={0} y={410} width={820} height={230} fill="url(#sk-f)" />
      {Array.from({ length: 16 }, (_, i) => (
        <circle key={i} cx={30 + i * 52} cy={480 + (i % 3) * 50} r={30} fill="#FFFFFF" opacity={0.22} />
      ))}
      <path d="M0 130 Q100 118 200 130 T400 130 T600 130 T820 130" fill="none" stroke="#B57A5C" strokeWidth={5} />
      <rect x={0} y={130} width={820} height={510} fill="none" stroke={C.forest} strokeWidth={0} />
      {/* layer labels */}
      <text x={800} y={175} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={24} fill="#7A4A35">epidermis</text>
      <text x={800} y={250} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={24} fill="#7A4A35">dermis</text>
      <text x={800} y={625} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={24} fill="#8A6A2A">fat</text>
      {/* vein */}
      <circle cx={vein.x} cy={vein.y} r={vein.r + 8} fill="#C47A86" stroke="#7A3A44" strokeWidth={4} />
      <circle cx={vein.x} cy={vein.y} r={vein.r} fill="url(#sk-v)" />
      <ellipse cx={vein.x - 20} cy={vein.y - 22} rx={22} ry={10} fill="#FFFFFF" opacity={0.3} />
      <text x={vein.x} y={vein.y + vein.r + 44} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={C.forest}>vein</text>
      {/* absorbed glow */}
      {pA > 0 && <circle cx={vein.x} cy={vein.y} r={vein.r + 20 * pA} fill="none" stroke={BRIGHT} strokeWidth={8} opacity={0.6 * (1 - pA * 0.4)} />}
      {/* white beam & prism */}
      <g opacity={pW}>
        <polygon points="40,-70 140,-70 120,60 60,60" fill="url(#sk-w)" stroke={C.forest} strokeWidth={4} opacity={0.95} />
        <text x={90} y={-90} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={C.forest}>white light</text>
      </g>
      {/* spectrum fan */}
      <g opacity={pS}>
        {["#E0312F", "#F08A3C", "#F2D14E", "#5C9A3A", "#4F74B8", "#6A4FA8"].map((c, i) => (
          <line key={c} x1={90} y1={60} x2={90 + (i - 2.5) * 30 * pS + 40} y2={120} stroke={c} strokeWidth={8} strokeLinecap="round" />
        ))}
      </g>
      {/* red ray */}
      {pR > 0 && (
        <g>
          <line x1={rx0} y1={ry0} x2={rx0 + (rx1 - rx0) * rLen} y2={ry0 + (ry1 - ry0) * rLen} stroke={BRIGHT} strokeWidth={14} strokeLinecap="round" opacity={1 - 0.5 * pA} />
          <circle cx={rx0} cy={ry0} r={14} fill={BRIGHT} stroke={C.forest} strokeWidth={4} />
        </g>
      )}
      {/* blue ray */}
      {pB > 0 && (
        <g>
          <line x1={bx0} y1={by0} x2={bx0 + (bx1 - bx0) * bA} y2={by0 + (by1 - by0) * bA} stroke={BLUE} strokeWidth={14} strokeLinecap="round" />
          {bB > 0 && <line x1={bx1} y1={by1} x2={bx1 + (bx2 - bx1) * bB} y2={by1 + (by2 - by1) * bB} stroke={BLUE} strokeWidth={14} strokeLinecap="round" />}
          {bB > 0.95 && <polygon points={`${bx2},${by2 - 18} ${bx2 - 24},${by2 + 14} ${bx2 + 10},${by2 + 22}`} fill={BLUE} />}
          <circle cx={bx0} cy={by0} r={14} fill={BLUE} stroke={C.forest} strokeWidth={4} />
        </g>
      )}
    </svg>
  );
};

/* Light returned from skin: bars */
export const Bars: React.FC<{ red: number; blue: number; label: string; swatch: string }> = ({ red, blue, label, swatch }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: 360 }}>
    <div style={{ width: 300, height: 120, borderRadius: 24, background: swatch, border: `4px solid ${C.forest}`, boxShadow: "inset 0 10px 0 rgba(255,255,255,0.25)" }} />
    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.forest, textAlign: "center", height: 80 }}>{label}</div>
    <div style={{ display: "flex", alignItems: "flex-end", gap: 30, height: 260, borderBottom: `5px solid ${C.forest}`, padding: "0 20px" }}>
      {[
        [red, BRIGHT, "red"],
        [blue, BLUE, "blue"],
      ].map(([v, c, n]) => (
        <div key={n as string} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 90, height: 240 * (v as number), background: c as string, borderRadius: "16px 16px 0 0", border: `4px solid ${C.forest}`, borderBottom: "none" }} />
        </div>
      ))}
    </div>
    <div style={{ display: "flex", gap: 54, fontFamily: FONT, fontWeight: 700, fontSize: 26, color: C.forest }}>
      <span>red</span>
      <span>blue</span>
    </div>
  </div>
);

export const Brain: React.FC<{ size?: number }> = ({ size = 160 }) => (
  <svg width={size} height={size * 0.85} viewBox="0 0 200 170">
    <defs>
      <radialGradient id="br-g" cx="40%" cy="35%">
        <stop offset="0%" stopColor="#F7C8C8" />
        <stop offset="100%" stopColor="#D98A92" />
      </radialGradient>
    </defs>
    <path d="M100 20 C70 0 30 15 30 50 C5 60 5 100 30 110 C30 145 70 160 100 140 C130 160 170 145 170 110 C195 100 195 60 170 50 C170 15 130 0 100 20 Z" fill="url(#br-g)" stroke={C.forest} strokeWidth={6} />
    <path d="M100 22 L100 140 M60 45 C75 55 70 75 55 80 M140 45 C125 55 130 75 145 80 M55 110 C70 100 85 110 85 125 M145 110 C130 100 115 110 115 125" stroke="#A85A66" strokeWidth={5} fill="none" strokeLinecap="round" />
    <path d="M45 40 C55 28 70 24 82 26" stroke="#FFFFFF" strokeWidth={7} strokeLinecap="round" fill="none" opacity={0.6} />
  </svg>
);

export const Journal: React.FC<{ w?: number }> = ({ w = 760 }) => (
  <svg width={w} height={w * 0.5} viewBox="0 0 760 380">
    <ellipse cx={380} cy={370} rx={320} ry={10} fill={C.forest} opacity={0.12} />
    <rect x={20} y={10} width={720} height={350} rx={16} fill={C.card} stroke={C.forest} strokeWidth={5} />
    <rect x={20} y={10} width={720} height={70} rx={16} fill={C.forest} />
    <rect x={20} y={60} width={720} height={20} fill={C.forest} />
    <text x={50} y={56} fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.paper} letterSpacing={2}>APPLIED OPTICS</text>
    <text x={710} y={56} textAnchor="end" fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.banana}>1996</text>
    <text x={50} y={140} fontFamily="Georgia, serif" fontWeight={700} fontSize={40} fill={C.forest}>Why do veins appear blue?</text>
    <text x={50} y={188} fontFamily="Georgia, serif" fontStyle="italic" fontSize={32} fill={C.forest} opacity={0.75}>A new look at an old question</text>
    <text x={50} y={236} fontFamily={FONT} fontWeight={600} fontSize={22} fill={C.matcha}>Kienle, Lilge, Vitkin, Patterson, Wilson, Hibst, Steiner</text>
    {Array.from({ length: 4 }, (_, i) => (
      <rect key={i} x={50} y={262 + i * 22} width={i === 3 ? 380 : 660} height={9} rx={4} fill={C.line} />
    ))}
  </svg>
);

/* Atlas-style arm with artery (red), vein (blue), nerve (yellow) */
export const ArmAtlas: React.FC<{ w?: number; pA: number; pV: number; pN: number; sepia?: boolean }> = ({ w = 520, pA, pV, pN, sepia }) => {
  const len = 1400;
  const ink = sepia ? "#5A4325" : C.forest;
  return (
    <svg width={w} height={w * 1.3} viewBox="0 0 400 520" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`aa-${sepia ? "s" : "n"}`} x1="0" x2="1">
          <stop offset="0%" stopColor={sepia ? "#E3CFA4" : "#F3E7DA"} />
          <stop offset="50%" stopColor={sepia ? "#F1E2BE" : "#FFF8F0"} />
          <stop offset="100%" stopColor={sepia ? "#DCC596" : "#EDDCCB"} />
        </linearGradient>
      </defs>
      {/* arm: shoulder at top, elbow, forearm, hand with fingers at bottom */}
      <g fill={`url(#aa-${sepia ? "s" : "n"})`} stroke={ink} strokeWidth={5} strokeLinejoin="round">
        {[
          [172, 418, 16, 82],
          [192, 422, 16, 92],
          [212, 420, 16, 88],
          [231, 414, 15, 72],
        ].map(([x, y, w2, h2], i) => (
          <rect key={i} x={x} y={y} width={w2} height={h2} rx={8} />
        ))}
        <path d="M168 395 C150 410 138 440 140 470 C142 482 156 480 158 468 C160 450 166 438 176 430 Z" />
        <path d="M120 10 C180 -4 270 -4 305 22 C300 90 285 160 268 225 C262 290 252 350 250 395 C252 420 248 435 240 440 L170 440 C164 430 165 410 166 395 C162 340 152 285 140 225 C128 160 118 90 120 10 Z" />
      </g>
      <path d="M150 225 C180 232 235 232 262 225" stroke={ink} strokeWidth={3} fill="none" opacity={0.45} />
      <path d="M168 398 C190 402 225 402 249 398" stroke={ink} strokeWidth={3} fill="none" opacity={0.45} />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1={128 + i * 2.6} x2={146 + i * 2.6} y1={40 + i * 30} y2={30 + i * 30} stroke={ink} strokeWidth={2} opacity={0.22} />
      ))}
      {/* artery */}
      <path d="M200 12 C206 110 205 180 205 230 C204 300 205 360 215 430" stroke="#C9302C" strokeWidth={14} fill="none" strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - pA)} />
      <path d="M205 235 C190 300 180 360 180 425" stroke="#C9302C" strokeWidth={9} fill="none" strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - pA)} />
      {/* vein */}
      <path d="M262 20 C258 110 248 180 242 240 C236 300 236 360 236 430" stroke={BLUE} strokeWidth={14} fill="none" strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - pV)} />
      <path d="M145 30 C152 120 160 190 166 245 C170 300 172 360 172 425" stroke={BLUE} strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - pV)} />
      {/* nerve */}
      <path d="M228 15 C232 110 226 190 222 240 C218 300 222 370 226 430" stroke="#E8B923" strokeWidth={8} fill="none" strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - pN)} />
    </svg>
  );
};

export const Pencil: React.FC<{ color: string; w?: number }> = ({ color, w = 380 }) => (
  <svg width={w} height={w * 0.16} viewBox="0 0 380 60" style={{ overflow: "visible" }}>
    <rect x={60} y={8} width={300} height={44} rx={6} fill={color} stroke={C.forest} strokeWidth={4} />
    <rect x={64} y={12} width={292} height={10} rx={5} fill="#FFFFFF" opacity={0.35} />
    <rect x={330} y={8} width={30} height={44} fill="#C9CED3" stroke={C.forest} strokeWidth={4} />
    <polygon points="60,8 10,30 60,52" fill="#F1D9A8" stroke={C.forest} strokeWidth={4} strokeLinejoin="round" />
    <polygon points="26,23 10,30 26,37" fill={color} />
  </svg>
);
