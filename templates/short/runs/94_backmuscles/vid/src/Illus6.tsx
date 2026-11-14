import React from "react";
import { C, FONT } from "./kit";

const S = C.forest;
const sc = (p: number, cx: number, cy: number) => `translate(${cx} ${cy}) scale(${Math.max(0.0001, p)}) translate(${-cx} ${-cy})`;

/* ---------- Body with the five vital organs ---------- */
export const BODY_PATH =
  "M172 116 L228 116 C230 134 240 142 265 148 C305 158 322 175 326 215 L340 382 C342 400 330 406 322 394 L302 252 L294 400 C292 440 284 470 282 500 L278 730 C278 750 240 750 238 730 L212 520 L188 520 L162 730 C160 750 122 750 122 730 L118 500 C116 470 108 440 106 400 L98 252 L78 394 C70 406 58 400 60 382 L74 215 C78 175 95 158 135 148 C160 142 170 134 172 116 Z";

export const BodyOrgans: React.FC<{ w?: number; p: number[]; glow?: number[]; t: number }> = ({ w = 420, p, glow = [], t }) => {
  const [pB, pH, pL, pLv, pK] = p;
  const beat = Math.max(0, Math.sin(t * 7.5)) ** 6;
  const br = Math.sin(t * 2.2) * 0.03;
  const g = (i: number) => (glow[i] ?? 0) * (0.6 + 0.4 * Math.sin(t * 6));
  return (
    <svg width={w} height={w * 1.9} viewBox="0 0 400 760" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="bo-skin" x1="0" x2="1">
          <stop offset="0%" stopColor="#E9E4CC" />
          <stop offset="50%" stopColor="#FFFEF6" />
          <stop offset="100%" stopColor="#E9E4CC" />
        </linearGradient>
        <radialGradient id="bo-lung" cx="40%" cy="30%">
          <stop offset="0%" stopColor="#F6B8B4" />
          <stop offset="100%" stopColor="#D97A7E" />
        </radialGradient>
        <radialGradient id="bo-glow">
          <stop offset="0%" stopColor={C.banana} stopOpacity={0.9} />
          <stop offset="100%" stopColor={C.banana} stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={200} cy={752} rx={130} ry={10} fill={S} opacity={0.12} />
      <circle cx={200} cy={66} r={52} fill="url(#bo-skin)" stroke={S} strokeWidth={6} />
      <path d={BODY_PATH} fill="url(#bo-skin)" stroke={S} strokeWidth={6} strokeLinejoin="round" />
      {/* spine hint */}
      {Array.from({ length: 11 }, (_, i) => (
        <rect key={i} x={194} y={160 + i * 26} width={12} height={18} rx={4} fill={C.line} />
      ))}
      {/* glows */}
      {[
        [200, 62, 70],
        [214, 262, 60],
        [200, 235, 110],
        [170, 322, 75],
        [200, 378, 75],
      ].map(([x, y, r], i) => (g(i) > 0 ? <circle key={i} cx={x} cy={y} r={r} fill="url(#bo-glow)" opacity={g(i)} /> : null))}
      {/* brain */}
      <g transform={sc(pB, 200, 62)} opacity={Math.min(1, pB * 2)}>
        <path d="M200 28 C182 18 156 26 156 46 C142 52 142 76 158 84 C160 100 184 106 200 96 C216 106 240 100 242 84 C258 76 258 52 244 46 C244 26 218 18 200 28 Z" fill="#E9A3AA" stroke={S} strokeWidth={4} />
        <path d="M200 30 L200 94 M172 42 C182 50 178 62 168 64 M228 42 C218 50 222 62 232 64 M168 80 C178 74 188 80 188 90 M232 80 C222 74 212 80 212 90" stroke="#A85A66" strokeWidth={3} fill="none" strokeLinecap="round" />
      </g>
      {/* lungs */}
      <g transform={`${sc(pL, 200, 235)} translate(200 235) scale(${1 + br}) translate(-200 -235)`} opacity={Math.min(1, pL * 2)}>
        <path d="M188 172 C160 168 136 196 130 240 C124 286 132 312 152 312 C176 312 190 296 190 270 Z" fill="url(#bo-lung)" stroke={S} strokeWidth={4} />
        <path d="M212 172 C240 168 264 196 270 240 C276 286 268 312 248 312 C232 312 222 304 218 294 L212 270 Z" fill="url(#bo-lung)" stroke={S} strokeWidth={4} />
        <path d="M200 140 L200 176 M200 176 L176 200 M200 176 L224 200 M176 200 L160 236 M176 200 L178 250 M224 200 L240 236 M224 200 L226 250" stroke="#B5525A" strokeWidth={4} strokeLinecap="round" fill="none" />
      </g>
      {/* heart */}
      <g transform={`${sc(pH, 214, 262)} translate(214 262) scale(${1 + beat * 0.08}) translate(-214 -262)`} opacity={Math.min(1, pH * 2)}>
        <path d="M214 296 C190 280 182 262 186 246 C190 232 206 230 214 242 C222 230 240 232 244 248 C248 264 236 282 214 296 Z" fill={C.red} stroke={S} strokeWidth={4} />
        <path d="M206 236 C204 224 210 216 222 216" stroke="#8F2A22" strokeWidth={7} fill="none" strokeLinecap="round" />
        <path d="M196 250 C200 244 206 244 208 248" stroke="#F29A8C" strokeWidth={4} fill="none" strokeLinecap="round" />
      </g>
      {/* liver (body's right = viewer's left) */}
      <g transform={sc(pLv, 170, 322)} opacity={Math.min(1, pLv * 2)}>
        <path d="M124 304 C150 290 210 292 246 300 C240 316 214 332 186 344 C160 354 132 352 124 336 C120 326 120 312 124 304 Z" fill="#9B3F2F" stroke={S} strokeWidth={4} />
        <path d="M150 306 C170 302 196 302 214 306" stroke="#C86A55" strokeWidth={4} fill="none" strokeLinecap="round" />
        <ellipse cx={176} cy={346} rx={10} ry={7} fill="#6E9A3A" stroke={S} strokeWidth={3} />
      </g>
      {/* kidneys */}
      <g transform={sc(pK, 200, 378)} opacity={Math.min(1, pK * 2)}>
        {[160, 240].map((x, i) => (
          <g key={x} transform={`translate(${x} ${378 + (i ? 6 : 0)}) scale(${i ? -1 : 1} 1)`}>
            <path d="M-6 -30 C-30 -32 -36 -8 -32 8 C-28 26 -10 34 0 26 C6 20 2 12 6 4 C10 -4 12 -10 8 -20 C6 -26 2 -30 -6 -30 Z" fill="#B2453A" stroke={S} strokeWidth={4} />
            <path d="M6 2 C16 4 22 14 24 40" stroke="#E7C9A0" strokeWidth={4} fill="none" strokeLinecap="round" />
          </g>
        ))}
      </g>
    </svg>
  );
};

/* ---------- Kidney (standalone) ---------- */
export const Kidney: React.FC<{ size?: number; ghost?: boolean }> = ({ size = 160, ghost }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
    <g opacity={ghost ? 0.25 : 1}>
      <path d="M44 10 C14 8 6 40 10 60 C14 84 38 94 50 82 C58 74 52 62 58 52 C64 42 66 34 62 22 C58 14 52 10 44 10 Z" fill={ghost ? "none" : "#B2453A"} stroke={S} strokeWidth={4} strokeDasharray={ghost ? "6 6" : undefined} />
      {!ghost && <path d="M24 30 C30 22 40 20 46 22" stroke="#E07A6C" strokeWidth={4} fill="none" strokeLinecap="round" />}
      <path d="M56 50 C70 52 76 64 78 96" stroke={ghost ? S : "#D9B98A"} strokeWidth={4} fill="none" strokeLinecap="round" />
    </g>
  </svg>
);

export const MiniLung: React.FC<{ size?: number; ghost?: boolean }> = ({ size = 160, ghost }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M60 10 L60 26 L54 34" stroke={S} strokeWidth={5} fill="none" strokeLinecap="round" opacity={ghost ? 0.25 : 1} />
    <path d="M52 22 C30 18 14 40 12 64 C10 86 20 94 34 92 C46 90 54 80 54 64 Z" fill={ghost ? "none" : "#E8999A"} stroke={S} strokeWidth={4} strokeDasharray={ghost ? "6 6" : undefined} opacity={ghost ? 0.25 : 1} />
  </svg>
);

export const Appendix: React.FC<{ size?: number }> = ({ size = 160 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M10 20 C30 16 50 18 58 30 C66 42 60 56 46 58 C34 60 26 52 18 56" stroke="#E2A07E" strokeWidth={22} fill="none" strokeLinecap="round" />
    <path d="M10 20 C30 16 50 18 58 30 C66 42 60 56 46 58 C34 60 26 52 18 56" stroke={S} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.25} />
    <path d="M48 58 C52 70 60 80 70 90" stroke="#D88A68" strokeWidth={9} fill="none" strokeLinecap="round" />
    <path d="M48 58 C52 70 60 80 70 90" stroke={S} strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={0.4} />
  </svg>
);

export const Gallbladder: React.FC<{ size?: number }> = ({ size = 160 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M50 10 C60 10 64 18 60 26" stroke="#7FA347" strokeWidth={6} fill="none" strokeLinecap="round" />
    <path d="M58 24 C78 30 82 60 70 78 C58 94 34 92 30 76 C26 60 40 40 58 24 Z" fill="#6E9A3A" stroke={S} strokeWidth={4} />
    <path d="M44 56 C48 48 54 44 60 42" stroke="#A6C46E" strokeWidth={5} fill="none" strokeLinecap="round" />
  </svg>
);

export const Spleen: React.FC<{ size?: number }> = ({ size = 160 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M30 14 C58 6 86 26 84 54 C82 80 56 94 36 86 C46 72 48 58 38 50 C28 42 18 36 30 14 Z" fill="#7A2E4A" stroke={S} strokeWidth={4} />
    <path d="M40 22 C58 20 72 32 74 46" stroke="#B05677" strokeWidth={5} fill="none" strokeLinecap="round" />
  </svg>
);

/* ---------- Skin cross-section block ---------- */
export const SkinBlock: React.FC<{ w?: number; p: number; t: number }> = ({ w = 760, p, t }) => {
  const W = 600;
  const cut = 40 + 480 * p; // reveal width
  return (
    <svg width={w} height={w * 0.75} viewBox="0 0 600 450" style={{ overflow: "visible" }}>
      <defs>
        <clipPath id="sk-c">
          <rect x={0} y={0} width={cut + 60} height={450} />
        </clipPath>
        <linearGradient id="sk-d" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F2C9B0" />
          <stop offset="100%" stopColor="#E7A992" />
        </linearGradient>
      </defs>
      <ellipse cx={300} cy={438} rx={260} ry={10} fill={S} opacity={0.12} />
      <g clipPath="url(#sk-c)">
        {/* top face (perspective) */}
        <path d="M40 90 L100 40 L560 40 L500 90 Z" fill="#E9B79C" stroke={S} strokeWidth={4} strokeLinejoin="round" />
        {/* hairs */}
        {[150, 260, 380, 470].map((x, i) => (
          <path key={x} d={`M${x} 64 C${x + 6} ${40 - 8 * Math.sin(t * 2 + i)} ${x + 16} ${22} ${x + 24 + 4 * Math.sin(t * 2 + i)} 6`} stroke="#5A4325" strokeWidth={4} fill="none" strokeLinecap="round" />
        ))}
        {/* epidermis */}
        <rect x={40} y={90} width={460} height={50} fill="#E9B79C" stroke={S} strokeWidth={4} />
        {Array.from({ length: 4 }, (_, i) => (
          <path key={i} d={`M40 ${100 + i * 10} Q 270 ${96 + i * 10 + 6 * Math.sin(i)} 500 ${100 + i * 10}`} stroke="#D49A80" strokeWidth={2} fill="none" />
        ))}
        {/* dermis */}
        <rect x={40} y={140} width={460} height={150} fill="url(#sk-d)" stroke={S} strokeWidth={4} />
        <path d="M60 210 C120 190 160 240 230 215 C300 190 340 240 410 214 C450 200 480 214 500 220" stroke={C.red} strokeWidth={6} fill="none" />
        <path d="M60 236 C130 220 170 262 240 240 C310 218 350 262 420 240 C460 228 486 238 500 244" stroke="#4F74B8" strokeWidth={6} fill="none" />
        {/* follicles */}
        {[150, 380].map((x) => (
          <g key={x}>
            <path d={`M${x} 92 L${x + 14} 230`} stroke="#5A4325" strokeWidth={4} />
            <ellipse cx={x + 15} cy={236} rx={12} ry={16} fill="#C98466" stroke={S} strokeWidth={3} />
          </g>
        ))}
        {/* sweat gland coil */}
        <path d="M270 92 L272 230 C250 236 254 256 272 254 C290 252 292 270 272 272 C254 274 258 290 276 286" stroke="#6FA0C8" strokeWidth={4} fill="none" strokeLinecap="round" />
        {/* fat */}
        <rect x={40} y={290} width={460} height={130} fill="#F6E6A8" stroke={S} strokeWidth={4} />
        {Array.from({ length: 18 }, (_, i) => {
          const x = 70 + (i % 9) * 52 + (Math.floor(i / 9) % 2) * 26;
          const y = 322 + Math.floor(i / 9) * 56;
          return <ellipse key={i} cx={x} cy={y} rx={24} ry={20} fill="#FBEFC2" stroke="#D9C06A" strokeWidth={3} />;
        })}
        {/* side face */}
        <path d="M500 90 L560 40 L560 370 L500 420 Z" fill="#D9A088" stroke={S} strokeWidth={4} strokeLinejoin="round" opacity={0.9} />
      </g>
      {/* layer labels */}
      {[
        ["EPIDERMIS", 115],
        ["DERMIS", 215],
        ["FAT LAYER", 355],
      ].map(([s, y], i) => (
        <text key={s} x={W - 10} y={(y as number) + 8} textAnchor="end" fontFamily={FONT} fontWeight={800} fontSize={20} fill={S} opacity={Math.max(0, Math.min(1, p * 3 - i))} letterSpacing={2}>
          {""}
        </text>
      ))}
    </svg>
  );
};

/* ---------- Body silhouette that fills to a percentage ---------- */
export const WeightFigure: React.FC<{ h?: number; fill: number }> = ({ h = 560, fill }) => (
  <svg width={h * 0.53} height={h} viewBox="0 0 400 760">
    <defs>
      <clipPath id="wf-c">
        <circle cx={200} cy={66} r={52} />
        <path d={BODY_PATH} />
      </clipPath>
    </defs>
    <g clipPath="url(#wf-c)">
      <rect x={0} y={0} width={400} height={760} fill={C.card} />
      <rect x={0} y={760 - 760 * fill} width={400} height={760 * fill} fill="#E9B79C" />
      <line x1={0} y1={760 - 760 * fill} x2={400} y2={760 - 760 * fill} stroke={S} strokeWidth={4} strokeDasharray="10 8" />
    </g>
    <circle cx={200} cy={66} r={52} fill="none" stroke={S} strokeWidth={6} />
    <path d={BODY_PATH} fill="none" stroke={S} strokeWidth={6} strokeLinejoin="round" />
  </svg>
);

/* ---------- Intestines + mesentery fan ---------- */
export const Intestines: React.FC<{ w?: number; mes: number; one: number; t: number; sepia?: boolean; draw?: number }> = ({ w = 760, mes, one, t, sepia, draw = 1 }) => {
  const ink = sepia ? "#5A4325" : S;
  const gut = sepia ? "none" : "#E8A58E";
  const gutHi = sepia ? "none" : "#F4C5AE";
  // loops along a fan arc around root (300,140)
  const loops = Array.from({ length: 9 }, (_, i) => {
    const a = (-150 + i * 15) * (Math.PI / 180) * -1;
    const R = 230 + 14 * Math.sin(t * 1.5 + i);
    return { x: 300 + Math.cos(a) * R * 1.05, y: 140 + Math.sin(a) * R * 0.95, a };
  });
  const gutPath = loops.reduce((d, l, i) => {
    if (i === 0) return `M${l.x} ${l.y}`;
    const pr = loops[i - 1];
    const mx = (pr.x + l.x) / 2 + Math.cos(pr.a) * 60 * (i % 2 ? 1 : -1);
    const my = (pr.y + l.y) / 2 + Math.sin(pr.a) * 60 * (i % 2 ? 1 : -1);
    return `${d} Q ${mx} ${my} ${l.x} ${l.y}`;
  }, "");
  const L = 2600;
  return (
    <svg width={w} height={w * 0.75} viewBox="0 0 600 450" style={{ overflow: "visible" }}>
      {/* mesentery fan */}
      <g opacity={mes}>
        {loops.map((l, i) => (
          <path
            key={i}
            d={`M300 140 Q ${(300 + l.x) / 2 + 10} ${(140 + l.y) / 2} ${l.x} ${l.y}`}
            stroke={sepia ? "#7A5A30" : "#E0B84A"}
            strokeWidth={sepia ? 2 : 3}
            fill="none"
            strokeDasharray={L}
            strokeDashoffset={L * (1 - draw)}
          />
        ))}
        <path
          d={`M300 140 ${loops.map((l) => `L ${l.x} ${l.y}`).join(" ")} Z`}
          fill={sepia ? "#C9A86A" : C.banana}
          opacity={sepia ? 0.18 : 0.35 + 0.25 * one}
        />
        {!sepia &&
          loops.map((l, i) => (
            <path key={`v${i}`} d={`M300 140 Q ${(300 + l.x) / 2 - 12} ${(140 + l.y) / 2 + 8} ${l.x} ${l.y}`} stroke={C.red} strokeWidth={2.5} fill="none" opacity={0.7} />
          ))}
        <circle cx={300} cy={140} r={14} fill={sepia ? "none" : C.forest} stroke={ink} strokeWidth={3} />
      </g>
      {/* gut tube */}
      {!sepia && <path d={gutPath} stroke={ink} strokeWidth={44} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
      <path d={gutPath} stroke={sepia ? ink : gut} strokeWidth={sepia ? 3 : 36} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={L} strokeDashoffset={L * (1 - draw)} />
      {!sepia && <path d={gutPath} stroke={gutHi} strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.7} transform="translate(-4 -6)" />}
      {/* one-organ outline */}
      {one > 0 && (
        <path
          d={`M300 110 ${loops.map((l) => `L ${300 + (l.x - 300) * 1.18} ${140 + (l.y - 140) * 1.18}`).join(" ")} Z`}
          fill="none"
          stroke={C.forest}
          strokeWidth={6}
          strokeDasharray="18 12"
          strokeDashoffset={-t * 40}
          strokeLinejoin="round"
          opacity={one}
        />
      )}
    </svg>
  );
};

/* ---------- da Vinci notebook page ---------- */
export const NotebookPage: React.FC<{ w?: number; draw: number; t: number }> = ({ w = 700, draw, t }) => (
  <div style={{ position: "relative", width: w, height: w * 0.9 }}>
    <svg width={w} height={w * 0.9} viewBox="0 0 700 630" style={{ position: "absolute" }}>
      <defs>
        <radialGradient id="nb-p" cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor="#F3E3BE" />
          <stop offset="100%" stopColor="#D9BE88" />
        </radialGradient>
      </defs>
      <rect x={10} y={10} width={680} height={610} rx={10} fill="url(#nb-p)" stroke="#8A6A3A" strokeWidth={4} transform="rotate(-1.5 350 315)" />
      {/* mirror-script lines */}
      {Array.from({ length: 7 }, (_, i) => {
        const y = 440 + i * 24;
        const len = 560 - (i % 3) * 90;
        let d = `M${640} ${y}`;
        for (let x = 640; x > 640 - len; x -= 16) d += ` q -4 ${-8 + ((x / 16) % 3) * 3} -8 0 t -8 0`;
        return <path key={i} d={d} stroke="#6B4E26" strokeWidth={2} fill="none" opacity={Math.max(0, Math.min(1, draw * 2 - i * 0.12))} />;
      })}
    </svg>
    <div style={{ position: "absolute", left: 60, top: 10 }}>
      <Intestines w={580} mes={1} one={0} t={t * 0.3} sepia draw={draw} />
    </div>
  </div>
);

/* ---------- Referee flag + whistle ---------- */
export const RefFlag: React.FC<{ size?: number; wave: number }> = ({ size = 260, wave }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
    <rect x={20} y={10} width={5} height={86} rx={2.5} fill={S} />
    <path d={`M25 12 C40 ${8 + wave * 6} 55 ${18 - wave * 6} 78 12 L78 46 C55 ${52 - wave * 6} 40 ${42 + wave * 6} 25 46 Z`} fill={C.banana} stroke={S} strokeWidth={3} />
    <path d={`M25 29 C40 ${25 + wave * 6} 55 ${35 - wave * 6} 78 29`} stroke={C.red} strokeWidth={3} fill="none" />
  </svg>
);

/* ---------- Simple textbook ---------- */
export const Textbook: React.FC<{ size?: number; check: number }> = ({ size = 300, check }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
    <path d="M14 18 L50 26 L86 18 L86 84 L50 92 L14 84 Z" fill={C.card} stroke={S} strokeWidth={3} strokeLinejoin="round" />
    <path d="M50 26 L50 92" stroke={S} strokeWidth={3} />
    {[36, 46, 56, 66].map((y) => (
      <g key={y}>
        <line x1={20} y1={y} x2={44} y2={y + 2} stroke={C.line} strokeWidth={3} />
        <line x1={56} y1={y + 2} x2={80} y2={y} stroke={C.line} strokeWidth={3} />
      </g>
    ))}
    <circle cx={74} cy={74} r={16 * check} fill={C.matcha} stroke={S} strokeWidth={3 * check} />
    <path d="M66 74 L72 80 L83 68" stroke={C.paper} strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray={30} strokeDashoffset={30 * (1 - check)} />
  </svg>
);

/* ---------- tissue chip ---------- */
export const TissueChip: React.FC<{ kind: "muscle" | "nerve" | "epi" | "conn"; size?: number }> = ({ kind, size = 150 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx={50} cy={50} r={44} fill={C.card} stroke={S} strokeWidth={4} />
    <clipPath id={`tc-${kind}`}>
      <circle cx={50} cy={50} r={40} />
    </clipPath>
    <g clipPath={`url(#tc-${kind})`}>
      {kind === "muscle" &&
        Array.from({ length: 7 }, (_, i) => <rect key={i} x={6} y={12 + i * 11} width={88} height={9} rx={4.5} fill={i % 2 ? "#C9483C" : "#E07A6C"} />)}
      {kind === "epi" &&
        Array.from({ length: 16 }, (_, i) => (
          <rect key={i} x={8 + (i % 4) * 22} y={8 + Math.floor(i / 4) * 22} width={20} height={20} rx={5} fill="#F2C9B0" stroke="#C98466" strokeWidth={2} />
        ))}
      {kind === "nerve" && <path d="M10 50 C30 30 40 70 60 50 S 85 40 92 30 M60 50 L80 75 M30 42 L20 20" stroke="#D9B52E" strokeWidth={6} fill="none" strokeLinecap="round" />}
      {kind === "conn" && Array.from({ length: 6 }, (_, i) => <path key={i} d={`M0 ${15 + i * 14} C30 ${5 + i * 14} 60 ${25 + i * 14} 100 ${12 + i * 14}`} stroke="#E0B84A" strokeWidth={4} fill="none" />)}
    </g>
  </svg>
);
