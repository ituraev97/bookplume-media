import React from "react";
import { C, FONT } from "./kit";

/* Own diagrams for "What happens when you stand up too fast" — Book Plume illustrations */

export const K = {
  blood: "#C9302C",
  bloodL: "#E8796B",
  vein: "#3F6FB5",
  veinL: "#8DB0E3",
  nerve9: "#E8903A",
  nerve10: "#8D5BC4",
  brake: "#3F6FB5",
  gas: "#E2552B",
  glow: "#FFE14D",
  skin: "#F4D9C4",
  skinD: "#D9AE8F",
  muscle: "#C65A4E",
  muscleL: "#E58C7E",
  bone: "#F5EEDA",
};
const S = C.forest;
export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

/** pill label drawn inside an SVG */
export const SvgPill: React.FC<{ x: number; y: number; text: string; o?: number; size?: number; hot?: boolean; anchor?: "l" | "r" | "c"; dot?: [number, number]; bg?: string }> = ({
  x, y, text, o = 1, size = 30, hot = false, anchor = "c", dot, bg,
}) => {
  if (o <= 0.001) return null;
  const w = text.length * size * 0.56 + size * 1.0;
  const h = size * 1.5;
  const x0 = anchor === "c" ? x - w / 2 : anchor === "l" ? x : x - w;
  const s = 0.8 + 0.2 * o;
  return (
    <g opacity={o}>
      {dot && (
        <>
          <line x1={dot[0]} y1={dot[1]} x2={anchor === "l" ? x0 : anchor === "r" ? x0 + w : x} y2={y} stroke={S} strokeWidth={4} strokeLinecap="round" />
          <circle cx={dot[0]} cy={dot[1]} r={10} fill={hot ? C.red : K.glow} stroke={S} strokeWidth={4} />
        </>
      )}
      <g transform={`translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`}>
        <rect x={x0} y={y - h / 2} width={w} height={h} rx={h / 2.4} fill={bg ?? (hot ? C.banana : S)} stroke={hot ? S : "none"} strokeWidth={hot ? 3 : 0} />
        <text x={x0 + w / 2} y={y + size * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={size} fill={hot ? S : C.paper}>
          {text}
        </text>
      </g>
    </g>
  );
};

/** heart icon centred at (cx,cy), size = width */
export const HeartShape: React.FC<{ cx: number; cy: number; size: number; beat?: number; fill?: string; glow?: number }> = ({ cx, cy, size, beat = 0, fill = K.blood, glow = 0 }) => {
  const s = (size / 100) * (1 + 0.08 * beat);
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s}) translate(-50 -48)`}>
      {glow > 0 && <circle cx={50} cy={50} r={70} fill={K.glow} opacity={0.5 * glow} />}
      <path d="M50 92 C20 70 2 52 2 30 C2 14 14 4 28 4 C38 4 46 10 50 18 C54 10 62 4 72 4 C86 4 98 14 98 30 C98 52 80 70 50 92 Z" fill={fill} stroke={S} strokeWidth={5} strokeLinejoin="round" />
      <path d="M22 26 C24 18 30 14 36 14" stroke="#fff" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.6} />
    </g>
  );
};
/** heartbeat 0..1 pulse for time t at rate (beats per second) */
export const beatAt = (t: number, bps = 1.2) => {
  const ph = (t * bps) % 1;
  return Math.max(0, Math.sin(Math.min(1, ph / 0.25) * Math.PI));
};

/* ===================== BODY (standing / lying) ===================== */
/**
 * viewBox 900x900. lie: 1 = lying on a couch, 0 = standing. pool: 0 = blood even, 1 = pooled in legs + gut.
 * dim: head/brain greys out. grav: gravity arrows. pump: leg-muscle squeeze 0..1 (shows calves). still: show "muscle pump OFF".
 */
export const Body: React.FC<{ w: number; t: number; lie?: number; pool?: number; dim?: number; grav?: number; heart?: number; gut?: number; legVeins?: number; tag?: string }> = ({
  w, t, lie = 0, pool = 0, dim = 0, grav = 0, heart = 1, gut = 0, legVeins = 0, tag,
}) => {
  const id = "bd";
  const topO = lerp(0.5, 0.14, pool), midO = lerp(0.5, 0.42, pool), botO = lerp(0.5, 0.92, pool);
  const ang = -90 * lie;
  const shapes = (
    <>
      <circle cx={450} cy={105} r={58} />
      <rect x={428} y={150} width={44} height={44} rx={10} />
      <rect x={352} y={185} width={196} height={300} rx={64} />
      <rect x={302} y={196} width={46} height={290} rx={23} transform="rotate(6 325 196)" />
      <rect x={552} y={196} width={46} height={290} rx={23} transform="rotate(-6 575 196)" />
      <rect x={372} y={455} width={74} height={410} rx={34} />
      <rect x={454} y={455} width={74} height={410} rx={34} />
      <ellipse cx={404} cy={872} rx={44} ry={17} />
      <ellipse cx={496} cy={872} rx={44} ry={17} />
    </>
  );
  const bt = beatAt(t, 1.1 + 0.6 * pool);
  return (
    <svg width={w} height={w} viewBox="0 0 900 900" style={{ overflow: "visible" }}>
      <defs>
        <clipPath id={`${id}clip`}>{shapes}</clipPath>
        <linearGradient id={`${id}grad`} x1="0" y1="40" x2="0" y2="890" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={K.blood} stopOpacity={topO} />
          <stop offset="0.45" stopColor={K.blood} stopOpacity={midO} />
          <stop offset="1" stopColor={K.blood} stopOpacity={botO} />
        </linearGradient>
      </defs>
      {/* couch */}
      <g opacity={lie}>
        <rect x={40} y={585} width={820} height={110} rx={40} fill="#B98A5A" stroke={S} strokeWidth={6} />
        <rect x={40} y={520} width={120} height={175} rx={40} fill="#A87A4C" stroke={S} strokeWidth={6} />
        <rect x={70} y={690} width={30} height={60} rx={8} fill={S} />
        <rect x={800} y={690} width={30} height={60} rx={8} fill={S} />
      </g>
      <g transform={`rotate(${ang} 450 530)`}>
        <g fill={K.skin} stroke={S} strokeWidth={7}>{shapes}</g>
        <g clipPath={`url(#${id}clip)`}>
          <rect x={250} y={30} width={400} height={870} fill={`url(#${id}grad)`} />
          {/* leg veins */}
          <g opacity={0.35 + 0.65 * legVeins} stroke={K.vein} fill="none" strokeLinecap="round">
            <path d="M420 470 C418 600 412 700 418 860" strokeWidth={6 + 12 * pool} />
            <path d="M480 470 C482 600 488 700 482 860" strokeWidth={6 + 12 * pool} />
            <path d="M398 520 C396 640 392 740 396 840" strokeWidth={3 + 6 * pool} />
            <path d="M502 520 C504 640 508 740 504 840" strokeWidth={3 + 6 * pool} />
          </g>
          {/* gut veins */}
          <g opacity={gut}>
            {[0, 1, 2].map((i) => (
              <path key={i} d={`M${392 + i * 6} ${372 + i * 26} C${420} ${352 + i * 26} ${480} ${400 + i * 26} ${508 - i * 6} ${376 + i * 26}`} stroke={K.vein} strokeWidth={5 + 6 * pool} fill="none" strokeLinecap="round" opacity={0.5 + 0.4 * pool} />
            ))}
          </g>
          {/* head dimming */}
          <circle cx={450} cy={105} r={70} fill="#5E5E5E" opacity={0.75 * dim} />
        </g>
        {heart > 0 && <HeartShape cx={472} cy={262} size={58} beat={bt} />}
        {/* brain outline */}
        <path d="M410 92 C410 62 440 52 452 64 C462 50 494 58 490 90 C500 102 488 122 470 118 C460 130 432 128 426 116 C406 116 400 100 410 92 Z" fill={dim > 0.05 ? "#9A9A9A" : "#F1B9B0"} stroke={S} strokeWidth={4} opacity={0.9} />
      </g>
      {/* gravity arrows (screen space) */}
      <g opacity={grav}>
        {[0, 1, 2].map((i) => {
          const y = 230 + ((t * 120 + i * 160) % 480);
          return (
            <g key={i} transform={`translate(700 ${y})`}>
              <path d="M0 0 L0 70" stroke={S} strokeWidth={16} strokeLinecap="round" />
              <path d="M-26 52 L0 92 L26 52 Z" fill={S} />
            </g>
          );
        })}
        <text x={700} y={200} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={S}>gravity</text>
      </g>
      {dim > 0.05 && (
        <g opacity={dim}>
          {[0, 1, 2, 3].map((i) => {
            const a = t * 2 + (i * Math.PI) / 2;
            return <text key={i} x={450 + Math.cos(a) * 95} y={110 + Math.sin(a) * 40} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={C.red}>✦</text>;
          })}
        </g>
      )}
      {tag && <SvgPill x={450} y={-10} text={tag} size={34} />}
    </svg>
  );
};

/* ===================== GAUGE ===================== */
export const Gauge: React.FC<{ w: number; v: number; label?: string }> = ({ w, v, label = "blood pressure" }) => {
  const a = Math.PI * (1 - clamp(v));
  const nx = 150 + Math.cos(a) * 105, ny = 160 - Math.sin(a) * 105;
  const arc = (a0: number, a1: number, col: string) => {
    const p = (ang: number, r: number) => `${150 + Math.cos(ang) * r},${160 - Math.sin(ang) * r}`;
    return <path d={`M${p(a0, 125)} A125 125 0 0 1 ${p(a1, 125)}`} stroke={col} strokeWidth={26} fill="none" />;
  };
  return (
    <svg width={w} height={(w * 220) / 300} viewBox="0 0 300 220">
      {arc(Math.PI, Math.PI * 0.66, C.red)}
      {arc(Math.PI * 0.66, Math.PI * 0.36, C.banana)}
      {arc(Math.PI * 0.36, 0, C.matcha)}
      <line x1={150} y1={160} x2={nx} y2={ny} stroke={S} strokeWidth={10} strokeLinecap="round" />
      <circle cx={150} cy={160} r={16} fill={S} />
      <text x={22} y={200} fontFamily={FONT} fontWeight={800} fontSize={22} fill={C.red}>LOW</text>
      <text x={278} y={200} textAnchor="end" fontFamily={FONT} fontWeight={800} fontSize={22} fill={C.matchaDark}>OK</text>
      <text x={150} y={214} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={22} fill={S}>{label}</text>
    </svg>
  );
};

/* ===================== REFLEX MAP ===================== */
/** dotted moving pulses along a path */
const Pulses: React.FC<{ d: string; t: number; rate: number; col: string; o?: number; speed?: number; width?: number; dir?: 1 | -1 }> = ({ d, t, rate, col, o = 1, speed = 160, width = 24, dir = 1 }) => {
  if (o <= 0.001) return null;
  const gap = lerp(260, 34, clamp(rate));
  return (
    <g opacity={o}>
      <path d={d} stroke={col} strokeWidth={12} fill="none" strokeLinecap="round" opacity={0.5} />
      {rate > 0.01 && <path d={d} stroke={col} strokeWidth={width} fill="none" strokeLinecap="round" strokeDasharray={`0.1 ${gap}`} strokeDashoffset={-dir * t * speed} />}
    </g>
  );
};

export type MapShow = { sensors?: number; aff?: number; med?: number; brake?: number; gas?: number; vessels?: number; heart?: number };
export const P = {
  ix: "M286 214 C232 140 300 96 418 92",
  x: "M574 372 C640 300 560 200 478 128",
  brake: "M560 150 C600 270 470 330 462 470",
  symp: "M700 92 C800 92 850 120 850 200 L850 680",
  sympHeart: "M850 440 C720 440 600 470 540 520",
  sympArt: "M850 560 L880 560",
  sympVein: "M850 680 L880 680",
};
/**
 * viewBox 1000x780 schematic of the baroreflex: carotid sinus + aortic arch → IX / X → NTS (medulla) → vagus (brake) / sympathetic (gas).
 * rateIn: afferent firing 0..1; brakeR / gasR: efferent firing 0..1; constrict: vessel tightening 0..1; hl: highlight key.
 */
export const ReflexMap: React.FC<{ w: number; t: number; show?: MapShow; rateIn?: number; brakeR?: number; gasR?: number; constrict?: number; hl?: string; labels?: number; hr?: number }> = ({
  w, t, show = {}, rateIn = 0.6, brakeR = 0.6, gasR = 0.3, constrict = 0, hl = "", labels = 1, hr = 1.1,
}) => {
  const o = (k: keyof MapShow) => (show[k] === undefined ? 1 : (show[k] as number));
  const glow = (k: string) => (hl.split(" ").includes(k) ? 1 : 0);
  const bt = beatAt(t, hr);
  const artW = lerp(44, 16, constrict), veinW = lerp(56, 26, constrict);
  return (
    <svg width={w} height={(w * 780) / 1000} viewBox="0 0 1000 780" style={{ overflow: "visible" }}>
      {/* vessels: aorta + carotid */}
      <g opacity={o("sensors")}>
        <path d="M480 470 C470 380 560 330 640 380 C680 405 690 450 690 520 L692 760" stroke={K.blood} strokeWidth={40} fill="none" strokeLinecap="round" />
        <path d="M540 360 C470 330 360 300 312 252" stroke={K.blood} strokeWidth={24} fill="none" strokeLinecap="round" />
        <path d="M312 252 C296 220 284 190 276 140" stroke={K.blood} strokeWidth={20} fill="none" strokeLinecap="round" />
        <path d="M312 252 C330 214 344 190 350 150" stroke={K.blood} strokeWidth={16} fill="none" strokeLinecap="round" />
        {/* sinus bulge */}
        <ellipse cx={294} cy={214} rx={20} ry={28} fill={K.blood} stroke={glow("sinus") ? K.glow : "none"} strokeWidth={10} />
        {glow("sinus") > 0 && <circle cx={294} cy={214} r={52} fill="none" stroke={C.red} strokeWidth={8} opacity={0.6 + 0.4 * Math.sin(t * 6)} />}
        {glow("arch") > 0 && <circle cx={574} cy={360} r={62} fill="none" stroke={C.red} strokeWidth={8} opacity={0.6 + 0.4 * Math.sin(t * 6)} />}
        {/* receptor dots */}
        {[[288, 200], [300, 226], [556, 346], [590, 350], [618, 362]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={7} fill={K.glow} stroke={S} strokeWidth={3} />
        ))}
        {labels > 0 && (
          <>
            <SvgPill x={140} y={260} text="carotid sinus" size={34} hot={glow("sinus") > 0} dot={[278, 222]} anchor="c" />
            <SvgPill x={700} y={300} text="aortic arch" size={34} hot={glow("arch") > 0} dot={[640, 372]} anchor="c" />
          </>
        )}
      </g>
      {/* heart */}
      <g opacity={o("heart")}>
        <HeartShape cx={490} cy={540} size={150} beat={bt} glow={glow("heart")} />
        {labels > 0 && <SvgPill x={320} y={610} text="heart" size={32} o={o("heart")} />}
      </g>
      {/* medulla */}
      <g opacity={o("med")}>
        <rect x={370} y={20} width={330} height={140} rx={36} fill={S} stroke={glow("med") ? K.glow : "none"} strokeWidth={10} />
        <text x={535} y={66} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill={C.paper}>MEDULLA</text>
        <circle cx={430} cy={116} r={30} fill={glow("nts") ? K.glow : C.banana} stroke={C.paper} strokeWidth={4} />
        <text x={430} y={124} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={22} fill={S}>NTS</text>
        <text x={580} y={112} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={21} fill={C.paper} opacity={0.9}>cardiovascular</text>
        <text x={580} y={138} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={21} fill={C.paper} opacity={0.9}>centers</text>
      </g>
      {/* afferents */}
      <Pulses d={P.ix} t={t} rate={rateIn} col={K.nerve9} o={o("aff")} />
      <Pulses d={P.x} t={t} rate={rateIn} col={K.nerve10} o={o("aff")} />
      {labels > 0 && o("aff") > 0.01 && (
        <>
          <SvgPill x={226} y={92} text="IX" size={36} bg={K.nerve9} o={o("aff")} />
          <SvgPill x={650} y={246} text="X" size={36} bg={K.nerve10} o={o("aff")} />
        </>
      )}
      {/* efferents */}
      <Pulses d={P.brake} t={t} rate={brakeR} col={K.brake} o={o("brake")} />
      {labels > 0 && o("brake") > 0.01 && <SvgPill x={370} y={330} text="vagus: BRAKE" size={32} bg={K.brake} o={o("brake")} />}
      <Pulses d={P.symp} t={t} rate={gasR} col={K.gas} o={o("gas")} />
      <Pulses d={P.sympHeart} t={t} rate={gasR} col={K.gas} o={o("gas")} />
      {labels > 0 && o("gas") > 0.01 && <SvgPill x={850} y={230} text="sympathetic: GAS" size={30} bg={K.gas} o={o("gas")} />}
      {/* vessels: arteriole + gut vein */}
      <g opacity={o("vessels")}>
        <Pulses d={P.sympArt} t={t} rate={gasR} col={K.gas} o={o("gas")} />
        <Pulses d={P.sympVein} t={t} rate={gasR} col={K.gas} o={o("gas")} />
        <rect x={880} y={560 - artW / 2} width={130} height={artW} rx={artW / 2} fill={K.blood} stroke={S} strokeWidth={5} />
        <rect x={880} y={680 - veinW / 2} width={130} height={veinW} rx={veinW / 2} fill={K.vein} stroke={S} strokeWidth={5} />
        <text x={940} y={512} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={S}>arterioles</text>
        <text x={940} y={636} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={S}>gut veins</text>
      </g>
    </svg>
  );
};

/* ===================== FIRING (stretch → spikes) ===================== */
/** viewBox 800x440: artery with stretch receptors + spike train. p = pressure 0..1, rate = firing 0..1 */
export const Firing: React.FC<{ w: number; t: number; p: number; rate: number }> = ({ w, t, p, rate }) => {
  const r = lerp(46, 82, p);
  const cy = 140;
  const gap = lerp(150, 30, clamp(rate));
  const off = (t * 170) % gap;
  const xs: number[] = [];
  for (let x = 780 - off; x > 30; x -= gap) xs.push(x);
  return (
    <svg width={w} height={(w * 440) / 800} viewBox="0 0 800 440">
      <rect x={20} y={cy - r - 12} width={760} height={2 * r + 24} rx={r + 12} fill={K.bloodL} stroke={S} strokeWidth={6} />
      <rect x={20} y={cy - r} width={760} height={2 * r} rx={r} fill={K.blood} />
      {[140, 300, 460, 620].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={cy - r - 6} r={11} fill={K.glow} stroke={S} strokeWidth={4} />
          <circle cx={x + 60} cy={cy + r + 6} r={11} fill={K.glow} stroke={S} strokeWidth={4} />
        </g>
      ))}
      {/* stretch arrows */}
      <g opacity={p}>
        <path d={`M400 ${cy - r - 20} L400 ${cy - r - 60}`} stroke={S} strokeWidth={8} strokeLinecap="round" />
        <path d={`M384 ${cy - r - 44} L400 ${cy - r - 66} L416 ${cy - r - 44}`} stroke={S} strokeWidth={8} fill="none" strokeLinecap="round" />
      </g>
      <rect x={20} y={300} width={760} height={120} rx={22} fill={C.card} stroke={C.line} strokeWidth={4} />
      <line x1={30} y1={390} x2={770} y2={390} stroke={S} strokeWidth={3} opacity={0.4} />
      {xs.map((x, i) => (
        <path key={i} d={`M${x - 8} 390 L${x} 318 L${x + 8} 390`} stroke={C.red} strokeWidth={6} fill="none" strokeLinejoin="round" />
      ))}
      <text x={36} y={290} fontFamily={FONT} fontWeight={800} fontSize={26} fill={S}>nerve signals →</text>
    </svg>
  );
};

/* ===================== BP / HR GRAPH ===================== */
const bpShape = (s: number) => {
  if (s <= 0) return 0;
  if (s < 10) return -Math.pow(Math.sin((Math.PI / 2) * (s / 10)), 1.4);
  if (s < 15) return -0.5 - 0.5 * Math.cos((Math.PI * (s - 10)) / 5);
  if (s < 30) return 0.12 * Math.sin(Math.PI * clamp((s - 15) / 10)) * Math.exp(-(s - 15) / 12);
  return 0;
};
const hrShape = (s: number) => {
  if (s <= 0) return 0;
  if (s < 3) return 0.75 * Math.sin((Math.PI / 2) * (s / 3));
  if (s < 10) return 0.75 + 0.25 * Math.sin((Math.PI / 2) * ((s - 3) / 7));
  if (s < 22) return 1 - 0.6 * (0.5 - 0.5 * Math.cos(Math.PI * ((s - 10) / 12)));
  return 0.4;
};
/** viewBox 1000x520; cur = seconds drawn so far (-5..30); marks: which markers to show */
export const BPGraph: React.FC<{ w: number; cur: number; hr?: number; marks?: { nadir?: number; back?: number; peak?: number; stand?: number } }> = ({ w, cur, hr = 1, marks = {} }) => {
  const X = (s: number) => 110 + ((s + 5) / 35) * 850;
  const Ybp = (v: number) => 150 - v * 120;
  const Yhr = (v: number) => 440 - v * 110;
  const pts = (fn: (s: number) => number, Y: (v: number) => number) => {
    const a: string[] = [];
    for (let s = -5; s <= Math.min(30, cur); s += 0.25) a.push(`${X(s).toFixed(1)},${Y(fn(s)).toFixed(1)}`);
    return a.join(" ");
  };
  return (
    <svg width={w} height={(w * 520) / 1000} viewBox="0 0 1000 520" style={{ overflow: "visible" }}>
      <rect x={0} y={0} width={1000} height={520} rx={30} fill={C.card} stroke={C.line} strokeWidth={4} />
      {[0, 5, 10, 15, 20, 25, 30].map((s) => (
        <g key={s}>
          <line x1={X(s)} y1={30} x2={X(s)} y2={470} stroke={C.line} strokeWidth={3} />
          <text x={X(s)} y={505} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={S}>{s} s</text>
        </g>
      ))}
      <line x1={X(-5)} y1={Ybp(0)} x2={X(30)} y2={Ybp(0)} stroke={S} strokeWidth={3} strokeDasharray="10 10" opacity={0.45} />
      <line x1={X(-5)} y1={Yhr(0)} x2={X(30)} y2={Yhr(0)} stroke={S} strokeWidth={3} strokeDasharray="10 10" opacity={0.45} />
      <text x={X(-5) - 12} y={Ybp(0) + 8} textAnchor="end" fontFamily={FONT} fontWeight={800} fontSize={22} fill={S}>start</text>
      <polyline points={pts(bpShape, Ybp)} stroke={C.red} strokeWidth={10} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      {hr > 0 && <polyline points={pts(hrShape, Yhr)} stroke={K.vein} strokeWidth={10} fill="none" strokeLinejoin="round" strokeLinecap="round" opacity={hr} />}
      <text x={X(19)} y={70} fontFamily={FONT} fontWeight={800} fontSize={32} fill={C.red}>blood pressure</text>
      {hr > 0 && <text x={X(19)} y={300} fontFamily={FONT} fontWeight={800} fontSize={30} fill={K.vein} opacity={hr}>heart rate</text>}
      {/* stand marker */}
      <g opacity={marks.stand ?? 1}>
        <line x1={X(0)} y1={30} x2={X(0)} y2={470} stroke={S} strokeWidth={6} />
        <SvgPill x={X(0)} y={30} text="STAND" size={24} />
      </g>
      {cur > -5 && cur < 30 && <line x1={X(cur)} y1={30} x2={X(cur)} y2={470} stroke={C.matcha} strokeWidth={4} opacity={0.8} />}
      {(marks.nadir ?? 0) > 0 && (
        <g opacity={marks.nadir}>
          <circle cx={X(10)} cy={Ybp(-1)} r={20} fill="none" stroke={C.red} strokeWidth={8} />
          <SvgPill x={X(10) + 150} y={Ybp(-1) + 16} text="lowest ≈ 10 s" size={28} hot />
        </g>
      )}
      {(marks.back ?? 0) > 0 && (
        <g opacity={marks.back}>
          <circle cx={X(15)} cy={Ybp(0)} r={20} fill="none" stroke={C.matcha} strokeWidth={8} />
          <SvgPill x={X(15) + 140} y={Ybp(0) - 50} text="back ≈ 15 s" size={28} bg={C.matcha} />
        </g>
      )}
      {(marks.peak ?? 0) > 0 && (
        <g opacity={marks.peak}>
          <SvgPill x={X(10)} y={Yhr(1) - 40} text="baroreflex peak" size={26} bg={K.vein} />
        </g>
      )}
    </svg>
  );
};

/* ===================== VEIN vs ARTERY ===================== */
export const VeinArtery: React.FC<{ w: number; fill: number }> = ({ w, fill }) => {
  const rv = lerp(70, 118, fill);
  return (
    <svg width={w} height={(w * 380) / 760} viewBox="0 0 760 380">
      <circle cx={190} cy={190} r={100} fill={K.bloodL} stroke={S} strokeWidth={6} />
      <circle cx={190} cy={190} r={62} fill={K.blood} />
      <text x={190} y={350} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={S}>artery: thick wall</text>
      <circle cx={540} cy={190} r={rv + 8} fill={K.veinL} stroke={S} strokeWidth={5} />
      <circle cx={540} cy={190} r={rv} fill={K.vein} />
      <text x={540} y={360} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={S}>vein: thin, stretchy</text>
    </svg>
  );
};

/* ===================== MUSCLE PUMP ===================== */
/** viewBox 520x720: vein through the calf with 2 valves. sq: squeeze 0..1, flow: accumulated flow (px). */
export const MusclePump: React.FC<{ w: number; sq: number; flow: number; off?: boolean }> = ({ w, sq, flow, off = false }) => {
  const vw = 64 - 34 * sq;
  const veinPath = `M${260 - 32} 30 L${260 - 32} 250 C${260 - 32} 300 ${260 - vw / 2} 320 ${260 - vw / 2} 380 C${260 - vw / 2} 440 ${260 - 32} 460 ${260 - 32} 510 L${260 - 32} 690 L${260 + 32} 690 L${260 + 32} 510 C${260 + 32} 460 ${260 + vw / 2} 440 ${260 + vw / 2} 380 C${260 + vw / 2} 320 ${260 + 32} 300 ${260 + 32} 250 L${260 + 32} 30 Z`;
  const valve = (y: number, open: number) => {
    const gapX = lerp(2, 22, open);
    const tipY = y - lerp(18, 46, open);
    return (
      <g>
        <path d={`M${228} ${y + 20} Q${236} ${y} ${260 - gapX} ${tipY}`} stroke={S} strokeWidth={7} fill="none" strokeLinecap="round" />
        <path d={`M${292} ${y + 20} Q${284} ${y} ${260 + gapX} ${tipY}`} stroke={S} strokeWidth={7} fill="none" strokeLinecap="round" />
      </g>
    );
  };
  const dots = [];
  for (let i = 0; i < 9; i++) {
    const y = 680 - ((i * 74 + flow) % 650);
    const nx = 260 + Math.sin(i * 2.1) * 12 * (1 - sq);
    dots.push(<circle key={i} cx={nx} cy={y} r={11} fill={K.blood} stroke="#fff" strokeWidth={3} />);
  }
  return (
    <svg width={w} height={(w * 720) / 520} viewBox="0 0 520 720">
      {/* calf muscles */}
      <ellipse cx={lerp(150, 168, sq)} cy={380} rx={lerp(78, 92, sq)} ry={190} fill={K.muscle} stroke={S} strokeWidth={6} />
      <ellipse cx={lerp(370, 352, sq)} cy={380} rx={lerp(78, 92, sq)} ry={190} fill={K.muscle} stroke={S} strokeWidth={6} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} stroke={K.muscleL} strokeWidth={4} opacity={0.7}>
          <path d={`M${110 + i * 20} 240 C${100 + i * 22} 380 ${110 + i * 20} 450 ${130 + i * 14} 540`} fill="none" />
          <path d={`M${410 - i * 20} 240 C${420 - i * 22} 380 ${410 - i * 20} 450 ${390 - i * 14} 540`} fill="none" />
        </g>
      ))}
      <path d={veinPath} fill={K.veinL} stroke={S} strokeWidth={6} />
      {dots}
      {valve(190, off ? 0.4 : sq)}
      {valve(590, off ? 0.4 : 1 - sq)}
      {!off && sq > 0.3 && (
        <g opacity={(sq - 0.3) / 0.7}>
          <path d="M470 330 L470 190" stroke={C.matchaDark} strokeWidth={14} strokeLinecap="round" />
          <path d="M446 214 L470 180 L494 214" stroke={C.matchaDark} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
      <SvgPill x={110} y={150} text="valve open" size={22} o={off ? 0 : clamp(sq * 2 - 0.4)} bg={C.matcha} dot={[236, 176]} />
      <SvgPill x={110} y={650} text="valve shut" size={22} o={off ? 0 : clamp(sq * 2 - 0.4)} bg={C.red} dot={[236, 588]} />
      {off && <SvgPill x={260} y={36} text="pump OFF" size={46} hot />}
    </svg>
  );
};

/* ===================== RESPIRATORY PUMP ===================== */
/** viewBox 560x640. inh: 0 = out, 1 = breathed in. flow: accumulated (px) */
export const RespPump: React.FC<{ w: number; inh: number; flow: number }> = ({ w, inh, flow }) => {
  const dy = 60 * inh;
  const dots = [];
  for (let i = 0; i < 6; i++) {
    const y = 620 - ((i * 70 + flow) % 380);
    dots.push(<circle key={i} cx={280} cy={y} r={10} fill={K.vein} stroke="#fff" strokeWidth={3} />);
  }
  return (
    <svg width={w} height={(w * 640) / 560} viewBox="0 0 560 640">
      <path d={`M120 70 C60 160 ${50 - 14 * inh} 300 ${70 - 10 * inh} 410 L${490 + 10 * inh} 410 C${510 + 14 * inh} 300 500 160 440 70 Z`} fill="#FFF6EC" stroke={S} strokeWidth={6} />
      {[130, 190, 250, 310].map((y, i) => (
        <path key={i} d={`M${100 - i * 8 - 8 * inh} ${y} C200 ${y + 30} 360 ${y + 30} ${460 + i * 8 + 8 * inh} ${y}`} stroke={K.skinD} strokeWidth={8} fill="none" opacity={0.6} />
      ))}
      <ellipse cx={190} cy={250} rx={68 + 14 * inh} ry={120 + 26 * inh} fill="#F2B6AE" stroke={S} strokeWidth={5} />
      <ellipse cx={370} cy={250} rx={68 + 14 * inh} ry={120 + 26 * inh} fill="#F2B6AE" stroke={S} strokeWidth={5} />
      <path d={`M60 ${410 + dy} C150 ${300 + dy} 410 ${300 + dy} 500 ${410 + dy}`} stroke={K.muscle} strokeWidth={18} fill="none" strokeLinecap="round" />
      <rect x={262} y={250} width={36} height={380} rx={18} fill={K.veinL} stroke={S} strokeWidth={5} />
      {dots}
      <HeartShape cx={300} cy={250} size={90} />
      <SvgPill x={420} y={560} text={`diaphragm ${inh > 0.5 ? "down" : "up"}`} size={26} bg={K.muscle} />
      <SvgPill x={160} y={560} text="IVC" size={26} bg={K.vein} dot={[268, 520]} />
      <g opacity={inh}>
        <SvgPill x={280} y={30} text="chest pressure ↓" size={28} hot />
      </g>
    </svg>
  );
};

/* ===================== BRAIN (autoregulation) ===================== */
export const Brain: React.FC<{ w: number; t: number; dim: number; widen: number }> = ({ w, t, dim, widen }) => {
  const sw = lerp(7, 16, widen);
  return (
    <svg width={w} height={(w * 460) / 600} viewBox="0 0 600 460">
      <path d="M90 250 C60 150 150 50 270 60 C330 20 470 40 510 140 C580 180 570 300 500 330 C470 400 360 410 300 380 C230 420 120 390 110 320 C80 310 76 280 90 250 Z" fill="#F1B9B0" stroke={S} strokeWidth={8} />
      {[
        "M300 380 C300 300 260 240 200 200 C170 180 140 170 120 180",
        "M300 380 C310 290 360 230 440 200 C470 190 500 190 520 200",
        "M300 380 C300 300 300 220 300 100",
        "M300 300 C250 290 210 300 160 300",
        "M300 280 C350 270 400 280 450 300",
      ].map((d, i) => (
        <path key={i} d={d} stroke={K.blood} strokeWidth={sw} fill="none" strokeLinecap="round" />
      ))}
      <path d="M90 250 C60 150 150 50 270 60 C330 20 470 40 510 140 C580 180 570 300 500 330 C470 400 360 410 300 380 C230 420 120 390 110 320 C80 310 76 280 90 250 Z" fill="#7A7A7A" opacity={0.6 * dim} />
      {widen > 0.05 && (
        <g opacity={widen}>
          {[[200, 200], [440, 200], [300, 150]].map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y}) scale(${1 + 0.1 * Math.sin(t * 4 + i)})`}>
              <path d="M-34 0 L-16 0 M16 0 L34 0" stroke={C.matchaDark} strokeWidth={8} strokeLinecap="round" />
              <path d="M-26 -10 L-38 0 L-26 10 M26 -10 L38 0 L26 10" stroke={C.matchaDark} strokeWidth={8} fill="none" strokeLinecap="round" />
            </g>
          ))}
        </g>
      )}
    </svg>
  );
};

/* ===================== KIDNEY icon ===================== */
export const Kidney: React.FC<{ w: number }> = ({ w }) => (
  <svg width={w} height={w} viewBox="0 0 200 200">
    <path d="M120 20 C60 10 20 60 30 120 C40 180 110 200 140 160 C150 145 130 130 125 110 C120 90 150 80 155 60 C160 40 145 24 120 20 Z" fill="#B8574C" stroke={S} strokeWidth={7} />
    <path d="M125 110 C140 105 160 110 175 120" stroke={K.vein} strokeWidth={10} fill="none" strokeLinecap="round" />
    <path d="M125 95 C140 85 160 85 178 90" stroke={K.blood} strokeWidth={10} fill="none" strokeLinecap="round" />
  </svg>
);
