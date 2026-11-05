import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { ANCHOR, HumerusDiagram, MCOL, Part } from "./Humerus60";

export const AHUM = 915 / 1409;
export const liveAlpha = (_t: number) => 0;

const pop = (t: number, t0: number, d = 0.3) => {
  const p = ramp(t, t0, t0 + d);
  return { opacity: p, transform: `scale(${0.6 + 0.4 * p + 0.08 * Math.sin(Math.min(1, p) * Math.PI)})` } as React.CSSProperties;
};
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });
const Big: React.FC<{ size?: number; children: React.ReactNode; color?: string }> = ({ size = 110, children, color = C.forest }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1, letterSpacing: -2, textAlign: "center", whiteSpace: "nowrap" }}>{children}</div>
);

export type M3 = "PEC" | "LAT" | "TER";
export const MNAME: Record<M3, string> = { PEC: "Pectoralis major", LAT: "Latissimus dorsi", TER: "Teres major" };
export const MROLE: Record<M3, string> = { PEC: "MAJOR", LAT: "LADY", TER: "MAJOR" };
export const MSPOT: Record<M3, string> = { PEC: "lateral lip", LAT: "floor", TER: "medial lip" };

/** role chip: coloured badge with the muscle colour */
export const Chip: React.FC<{ m: M3; size?: number; on?: number; style?: React.CSSProperties; crown?: boolean }> = ({ m, size = 40, on = 1, style, crown }) => (
  <div style={{ position: "relative", background: on > 0.5 ? MCOL[m] : "rgba(31,42,20,0.08)", color: on > 0.5 ? (m === "LAT" ? C.forest : C.paper) : "rgba(31,42,20,0.3)", border: `${Math.max(3, size * 0.09)}px solid ${C.forest}`, borderRadius: size * 0.45, padding: `${size * 0.18}px ${size * 0.5}px ${size * 0.24}px`, fontFamily: FONT, fontWeight: 800, fontSize: size, letterSpacing: 1, boxShadow: "0 6px 0 rgba(31,42,20,0.2)", whiteSpace: "nowrap", minWidth: m === "LAT" ? size * 2.6 : size * 3.3, textAlign: "center", ...style }}>
    {crown && (
      <svg width={size * 1.2} height={size * 0.8} viewBox="0 0 60 40" style={{ position: "absolute", left: "50%", top: -size * 0.78, transform: "translateX(-50%)" }}>
        <path d="M6 36 L4 10 L18 22 L30 4 L42 22 L56 10 L54 36 Z" fill={C.banana} stroke={C.forest} strokeWidth={4} strokeLinejoin="round" />
      </svg>
    )}
    {on > 0.5 ? MROLE[m] : "?"}
  </div>
);

/* diagram placement inside the scene box (860 x 940) */
const DX = 40, DY = 150, DW = 780;
const k = DW / 860;
const sx = (x: number) => DX + x * k;
const sy = (y: number) => DY + y * k;

const Callout: React.FC<{ at: [number, number]; dx: number; dy: number; t0: number; text: React.ReactNode; hot?: boolean; size?: number; out?: number; inv?: number }> = ({ at, dx, dy, t0, text, hot, size = 34, out, inv = 1 }) => {
  const t = useT();
  const p = ramp(t, t0 - 0.05, t0 + 0.25) * (out === undefined ? 1 : 1 - ramp(t, out, out + 0.25));
  if (p <= 0) return null;
  const x = sx(at[0]), y = sy(at[1]);
  return (
    <>
      <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: p }}>
        <line x1={x} y1={y} x2={x + dx * p * inv} y2={y + dy * p * inv} stroke={C.forest} strokeWidth={5 * inv} strokeLinecap="round" />
        <circle cx={x} cy={y} r={11 * inv} fill={hot ? C.banana : C.paper} stroke={C.forest} strokeWidth={5 * inv} />
      </svg>
      <div style={{ position: "absolute", left: x + dx * inv, top: y + dy * inv, transform: `translate(${dx < 0 ? "-100%" : dx === 0 ? "-50%" : "0"}, -50%) scale(${(0.8 + 0.2 * p) * inv})`, transformOrigin: dx < 0 ? "100% 50%" : dx === 0 ? "50% 50%" : "0 50%", opacity: p }}>
        <div style={{ background: hot ? C.banana : C.forest, color: hot ? C.forest : C.paper, fontFamily: FONT, fontWeight: 800, fontSize: size, padding: "6px 18px 9px", borderRadius: 16, whiteSpace: "nowrap", boxShadow: "0 6px 0 rgba(31,42,20,0.18)" }}>{text}</div>
      </div>
    </>
  );
};

const Cam: React.FC<{ z: number; f: [number, number]; children: React.ReactNode }> = ({ z, f, children }) => {
  const fx = sx(f[0]), fy = sy(f[1]);
  const cx = 430, cy = 520;
  const m = z - 1;
  return <div style={{ position: "absolute", inset: 0, transformOrigin: "0 0", transform: `translate(${(cx - fx) * m * 0.6}px, ${(cy - fy) * m * 0.6}px) translate(${fx}px, ${fy}px) scale(${z}) translate(${-fx}px, ${-fy}px)` }}>{children}</div>;
};

/* 1. Hook: Gray's 1918 Fig. 207, push in on the groove */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={2.55} push={0.02}>
      <div style={center(30, pop(t, 0, 0.25))}>
        <Big size={78}>NAME ALL 3</Big>
      </div>
      <div style={center(116, pop(t, 0.78, 0.25))}>
        <Big size={70} color={C.red}>MUSCLES</Big>
      </div>
      <div style={center(196, pop(t, 1.4, 0.25))}>
        <Big size={54}>on this groove</Big>
      </div>
      <Plate src="plates/humerus.png" aspect={AHUM} x={195} y={268} w={470} a={-0.6} b={2.55} zoomFrom={[1.0, 0.5, 0.45]} zoomTo={[1.55, 0.57, 0.42]} labels={[{ x: 0.565, y: 0.36, text: "?", t: 1.9, hot: true, ox: 80, oy: -40 }]} />
      <Stamp t0={1.95} text="EXAM FAVORITE" size={44} rot={-7} color={C.forest} style={{ left: 120, top: 880 }} />
    </Scene>
  );
};

/* 2. The groove: our own diagram */
export const V2: React.FC = () => {
  const t = useT();
  const lit: Partial<Record<Part, number>> = { GRV: 2.94, HUM: 5.03, GT: 6.71, LT: 7.32, TEN: 8.69, LIG: 8.69 };
  const glow: Part[] = t < 5.0 ? ["GRV"] : t < 6.65 ? ["HUM"] : t < 7.3 ? ["GT"] : t < 8.6 ? ["LT"] : ["TEN"];
  const z = 1 + 0.16 * ramp(t, 8.5, 10.0);
  return (
    <Scene start={2.55} end={11.3} push={0.012}>
      <div style={{ position: "absolute", left: -40, top: 110, width: 940, height: 760, overflow: "hidden", borderRadius: 40 }}>
      <div style={{ position: "absolute", left: 40, top: -110, width: 860, height: 940 }}>
      <Cam z={z} f={[530, 300]}>
        <div style={{ position: "absolute", left: DX, top: DY }}>
          <HumerusDiagram t={t} w={DW} lit={lit} glow={glow} dim={0.35} tendonGrow={8.6} id="v2" />
        </div>
        <Callout at={ANCHOR.GRV} dx={0} dy={-150} t0={2.98} hot text="intertubercular groove" size={34} out={5.0} inv={1 / z} />
        <Callout at={ANCHOR.HUM} dx={-200} dy={0} t0={5.05} text="humerus" size={36} out={8.5} inv={1 / z} />
        <Callout at={ANCHOR.GT} dx={20} dy={-150} t0={6.72} hot={t < 7.3} text="greater tubercle" size={32} out={8.5} inv={1 / z} />
        <Callout at={ANCHOR.LT} dx={-200} dy={-120} t0={7.35} hot={t < 8.6} text="lesser tubercle" size={32} out={8.5} inv={1 / z} />
        <Callout at={[532, 470]} dx={-150} dy={80} t0={8.95} hot text="long head of biceps" size={32} inv={1 / z} />
      </Cam>
      </div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 40, ...pop(t, 2.65, 0.25) }}>
        <Big size={46}>INTERTUBERCULAR GROOVE</Big>
      </div>
      <div style={{ position: "absolute", left: 0, top: 104, ...pop(t, 5.1, 0.25), opacity: ramp(t, 5.1, 5.35) * (1 - ramp(t, 8.4, 8.7)) }}>
        <Pill size={28} bg={C.matcha}>top of the humerus</Pill>
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 872, display: "flex", justifyContent: "center", ...pop(t, 9.95) }}>
        <Pill size={36} bg={C.forest}>tendon slides through ↓</Pill>
      </div>
    </Scene>
  );
};

/* 3. Mnemonic card */
export const V3: React.FC = () => {
  const t = useT();
  const line = (t0: number) => {
    const p = ramp(t, t0 - 0.05, t0 + 0.22);
    return { opacity: p, transform: `translateY(${(1 - p) * 30}px)` } as React.CSSProperties;
  };
  const chips: M3[] = ["TER", "LAT", "PEC"];
  return (
    <Scene start={11.3} end={14.2} push={0.015}>
      <div style={{ position: "absolute", left: 10, top: 10, width: 840, height: 910, borderRadius: 48, background: C.forest, ...pop(t, 11.32, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 44, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 7, color: C.matchaLight }}>THE TRICK</div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 130, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 118, color: C.paper, lineHeight: 1, letterSpacing: -2, ...line(12.4) }}>
          a <span style={{ background: C.banana, color: C.forest, borderRadius: 20, padding: "0 16px 6px" }}>L</span>ady
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 280, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 76, color: C.matchaLight, lineHeight: 1, ...line(12.8) }}>between</div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 390, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 118, color: C.paper, lineHeight: 1, letterSpacing: -2, ...line(13.1) }}>
          two <span style={{ background: C.banana, color: C.forest, borderRadius: 20, padding: "0 16px 6px" }}>M</span>ajors
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 640, display: "flex", justifyContent: "center", gap: 22 }}>
          {chips.map((m, i) => (
            <div key={m} style={{ ...pop(t, 11.45 + i * 0.1), }}>
              <Chip m={m} size={52} crown={m === "LAT" && t > 12.45} on={t >= (m === "LAT" ? 12.45 : 13.3 + i * 0.05) ? 1 : 0} style={{ border: `5px solid ${t >= (m === "LAT" ? 12.45 : 13.3 + i * 0.05) ? C.paper : "rgba(247,246,236,0.3)"}`, background: t >= (m === "LAT" ? 12.45 : 13.3 + i * 0.05) ? MCOL[m] : "rgba(247,246,236,0.08)", color: t >= (m === "LAT" ? 12.45 : 13.3 + i * 0.05) ? (m === "LAT" ? C.forest : C.paper) : "rgba(247,246,236,0.35)" }} />
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 790, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.matchaLight, opacity: ramp(t, 11.5, 11.8) }}>{t < 13.5 ? "3 muscles · 1 sentence" : "the lady lies in the middle"}</div>
      </div>
    </Scene>
  );
};

/* 4. Muscle by muscle on our diagram */
const STEP: { m: M3; t0: number; f: [number, number] }[] = [
  { m: "LAT", t0: 14.41, f: [530, 440] },
  { m: "PEC", t0: 18.34, f: [570, 470] },
  { m: "TER", t0: 20.76, f: [490, 500] },
];
export const V4: React.FC = () => {
  const t = useT();
  let cur = 0;
  STEP.forEach((s, i) => {
    if (t >= s.t0 - 0.05) cur = i;
  });
  const summary = t >= 23.05;
  const lit: Partial<Record<Part, number>> = { HUM: 0, GRV: 0, GT: 0, LT: 0, LAT: 14.93, PEC: 19.2, TER: 21.57, LLIP: 18.5, MLIP: 20.92 };
  const glow: Part[] = summary ? (t < 24.59 ? [] : t < 24.96 ? ["PEC"] : t < 25.28 ? ["LAT"] : ["TER"]) : [STEP[cur].m];
  if (!summary && t > 17.0 && t < 18.3) glow.push("GRV");
  const fs = STEP.map((s) => s.f);
  const blend = (i: number) => ramp(t, STEP[i].t0 - 0.2, STEP[i].t0 + 0.5);
  let f: [number, number] = fs[0];
  for (let i = 1; i < 3; i++) {
    const b = blend(i);
    f = [f[0] + (fs[i][0] - f[0]) * b, f[1] + (fs[i][1] - f[1]) * b];
  }
  const zs = ramp(t, 22.9, 23.5);
  const z = 1.45 - 0.37 * zs;
  f = [f[0] + (530 - f[0]) * zs, f[1] + (420 - f[1]) * zs];
  const s = STEP[cur];
  const p = ramp(t, s.t0 - 0.05, s.t0 + 0.22);
  const tendon = 1 - 0.75 * ramp(t, 14.6, 15.0);
  const order: M3[] = ["TER", "LAT", "PEC"];
  const sayT: Record<M3, number> = { PEC: 24.59, LAT: 24.96, TER: 25.28 };
  return (
    <Scene start={14.2} end={26.0} push={0.01}>
      <div style={{ position: "absolute", left: 0, top: 150, width: 860, height: 712, overflow: "hidden", borderRadius: 40 }}>
        <div style={{ position: "absolute", left: 0, top: -150, width: 860, height: 940 }}>
          <Cam z={z} f={f}>
            <div style={{ position: "absolute", left: DX, top: DY }}>
              <HumerusDiagram t={t} w={DW} lit={lit} glow={glow} dim={0.2} tendon={tendon} feet={0} id="v4" />
            </div>
            <Callout at={ANCHOR.FLOOR} dx={-170} dy={40} t0={17.1} hot text="floor" size={34} out={18.2} inv={1 / z} />
            <Callout at={[584, 400]} dx={130} dy={-40} t0={18.52} hot={t < 19.2} text="lateral lip" size={32} out={20.6} inv={1 / z} />
            <Callout at={[480, 470]} dx={-150} dy={40} t0={20.95} hot={t < 21.57} text="medial lip" size={32} out={22.9} inv={1 / z} />
          </Cam>
        </div>
      </div>
      {/* header row: chip + muscle name */}
      {!summary && (
        <div key={s.m} style={{ position: "absolute", left: 0, top: 52, display: "flex", gap: 18, alignItems: "center", opacity: p * (1 - ramp(t, 22.85, 23.05)), transform: `translateY(${(1 - p) * 20}px)` }}>
          <Chip m={s.m} size={34} crown={false} />
          <Big size={58}>{MNAME[s.m].toUpperCase()}</Big>
        </div>
      )}
      {summary && (
        <div style={{ position: "absolute", left: 0, top: 50, width: 860, display: "flex", justifyContent: "center", ...pop(t, 23.08, 0.25) }}>
          <Big size={56}>MAJOR · LADY · MAJOR</Big>
        </div>
      )}
      {/* bottom */}
      <div style={{ position: "absolute", left: 0, width: 860, top: 870, display: "flex", justifyContent: "center", gap: 14 }}>
        {!summary && cur === 0 && t < 16.3 && <div style={pop(t, 14.95)}><Pill size={36} bg={C.banana} color={C.forest}>the LADY · latissimus</Pill></div>}
        {!summary && cur === 0 && t >= 16.3 && <div style={pop(t, 16.4)}><Pill size={36} bg={C.forest}>lies on the floor</Pill></div>}
        {!summary && cur === 1 && <div style={pop(t, 19.3)}><Pill size={36} bg={C.red}>MAJOR #1 · lateral lip</Pill></div>}
        {!summary && cur === 2 && <div style={pop(t, 21.65)}><Pill size={36} bg="#2F5E7E">MAJOR #2 · medial lip</Pill></div>}
      </div>
      {summary && (
        <div style={{ position: "absolute", left: 0, width: 860, top: 800 }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 18 }}>
            {order.map((m) => {
              const q = ramp(t, sayT[m] - 0.05, sayT[m] + 0.2);
              return (
                <div key={m} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0.35 + 0.65 * q, transform: `scale(${0.9 + 0.1 * q})` }}>
                  <Chip m={m} size={34} on={1} crown={m === "LAT"} />
                  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.forest, whiteSpace: "nowrap" }}>{MNAME[m].toLowerCase()}</div>
                </div>
              );
            })}
          </div>
          <div style={{ position: "absolute", left: 30, top: -46, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.matcha, opacity: ramp(t, 23.85, 24.1) }}>← medial</div>
          <div style={{ position: "absolute", right: 30, top: -46, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.matcha, opacity: ramp(t, 23.27, 23.5) }}>lateral →</div>
        </div>
      )}
    </Scene>
  );
};

/* 5. Bonus: all three adduct + medially rotate — own figure (front view; the person's LEFT arm is on the viewer's right) */
const limb = (a: [number, number], b: [number, number], wa: number, wb: number) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L, ny = dx / L;
  return `M${a[0] + nx * wa} ${a[1] + ny * wa} L${b[0] + nx * wb} ${b[1] + ny * wb} A${wb} ${wb} 0 0 0 ${b[0] - nx * wb} ${b[1] - ny * wb} L${a[0] - nx * wa} ${a[1] - ny * wa} A${wa} ${wa} 0 0 0 ${a[0] + nx * wa} ${a[1] + ny * wa} Z`;
};
export const V5: React.FC = () => {
  const t = useT();
  const add = ramp(t, 27.15, 27.95); // upper arm swings in to the side
  const rot = ramp(t, 28.05, 28.9); // forearm swings in front of the belly
  const sh: [number, number] = [548, 318];
  const L1 = 190, L2 = 150;
  const ang = (42 * (1 - add) * Math.PI) / 180; // abduction
  const el: [number, number] = [sh[0] + Math.sin(ang) * L1, sh[1] + Math.cos(ang) * L1];
  // forearm: elbow bent 90°. Before rotation it points laterally (viewer's right); medial rotation brings it across the belly.
  // seen from the front the forearm foreshortens as it passes "toward the viewer" (cos), then points medially.
  const phi = Math.PI * rot; // 0 = lateral, PI = medial
  const fdir = Math.cos(phi);
  const fore: [number, number] = [el[0] + fdir * L2 * (0.35 + 0.65 * Math.abs(fdir)) * (1 - 0.1 * Math.sin(phi)) - Math.sin(phi) * 18, el[1] - Math.sin(phi) * 22 + (1 - add) * -10];
  const skin = "#F3DFC0", skinD = "#C9A27A";
  const fib = (from: [number, number], to: [number, number], col: string, wdt: number, q: [number, number]) => (
    <>
      <path d={`M${from[0]} ${from[1]} Q${q[0]} ${q[1]} ${to[0]} ${to[1]}`} stroke={C.forest} strokeWidth={wdt + 8} fill="none" strokeLinecap="round" opacity={0.9} />
      <path d={`M${from[0]} ${from[1]} Q${q[0]} ${q[1]} ${to[0]} ${to[1]}`} stroke={col} strokeWidth={wdt} fill="none" strokeLinecap="round" />
    </>
  );
  const ins: [number, number] = [sh[0] + (el[0] - sh[0]) * 0.3, sh[1] + (el[1] - sh[1]) * 0.3];
  // arrow arcs
  const arc1 = (() => {
    const r = L1 + 70, a0 = (42 * Math.PI) / 180, a1 = (10 * Math.PI) / 180;
    const p = (a: number) => [sh[0] + Math.sin(a) * r, sh[1] + Math.cos(a) * r];
    const [x0, y0] = p(a0), [x1, y1] = p(a0 + (a1 - a0) * add);
    return { d: `M${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1}`, end: [x1, y1], dir: a0 + (a1 - a0) * add };
  })();
  return (
    <Scene start={26.0} end={29.3} push={0.012}>
      <div style={{ position: "absolute", left: 0, top: 30, width: 860, display: "flex", justifyContent: "center", ...pop(t, 26.1, 0.25) }}>
        <Pill size={44} bg={C.banana} color={C.forest}>BONUS · ALL 3</Pill>
      </div>
      <svg width={860} height={720} viewBox="0 0 860 720" style={{ position: "absolute", left: 0, top: 120 }}>
        {/* body */}
        <ellipse cx={400} cy={690} rx={300} ry={26} fill={C.forest} opacity={0.08} />
        <rect x={366} y={160} width={68} height={70} rx={20} fill={skin} stroke={C.forest} strokeWidth={7} />
        <circle cx={400} cy={108} r={74} fill={skin} stroke={C.forest} strokeWidth={7} />
        <path d="M352 96 Q400 52 450 96" fill="none" stroke={C.forest} strokeWidth={5} opacity={0.25} />
        <path d="M262 236 Q400 196 538 236 Q578 252 580 310 L560 640 Q400 680 240 640 L220 310 Q222 252 262 236 Z" fill="#E6ECD8" stroke={C.forest} strokeWidth={7} strokeLinejoin="round" />
        <path d="M400 250 L400 620" stroke={C.forest} strokeWidth={3} opacity={0.15} />
        {/* the person's right arm (viewer's left) hanging */}
        <path d={limb([252, 318], [222, 520], 40, 32)} fill={skin} stroke={C.forest} strokeWidth={7} />
        <path d={limb([222, 520], [216, 660], 32, 26)} fill={skin} stroke={C.forest} strokeWidth={7} />
        {/* muscles: pec major (chest), lat dorsi (back/flank), teres major (shoulder blade) → front of the humerus */}
        {fib([410, 300], ins, MCOL.PEC, 34, [480, 300])}
        {fib([470, 600], [ins[0] - 4, ins[1] + 14], MCOL.LAT, 30, [520, 520])}
        {fib([500, 420], [ins[0] - 2, ins[1] + 4], MCOL.TER, 20, [520, 420])}
        {/* moving arm */}
        <path d={limb(sh, el, 44, 34)} fill={skin} stroke={C.forest} strokeWidth={7} />
        <path d={limb(el, fore, 34, 26)} fill={skin} stroke={C.forest} strokeWidth={7} />
        <circle cx={fore[0]} cy={fore[1]} r={34} fill={skin} stroke={C.forest} strokeWidth={7} />
        <circle cx={el[0]} cy={el[1]} r={9} fill={skinD} />
        <circle cx={sh[0]} cy={sh[1]} r={15} fill={C.banana} stroke={C.forest} strokeWidth={5} />
        {/* arrows */}
        {t > 27.1 && add < 1 && (
          <g opacity={1 - ramp(t, 27.95, 28.1)}>
            <path d={arc1.d} fill="none" stroke={C.matcha} strokeWidth={12} strokeLinecap="round" />
          </g>
        )}
        {t > 28.0 && (
          <g opacity={ramp(t, 28.0, 28.15)}>
            <path d={`M${el[0] + 150} ${el[1] + 70} Q${el[0]} ${el[1] + 150} ${el[0] - 150 * rot} ${el[1] + 70 + 20 * rot}`} fill="none" stroke={C.matcha} strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray={`${rot} 1`} />
            {rot > 0.9 && <path d={`M${el[0] - 150} ${el[1] + 90} l-6 -34 l34 10 z`} fill={C.matcha} transform={`rotate(-20 ${el[0] - 150} ${el[1] + 90})`} />}
          </g>
        )}
      </svg>
      <div style={{ position: "absolute", left: 0, width: 860, top: 862, display: "flex", justifyContent: "center", gap: 16 }}>
        <div style={pop(t, 27.2)}><Pill size={36} bg={C.forest}>pull the arm IN</Pill></div>
        <div style={pop(t, 28.08)}><Pill size={36} bg={C.matcha}>rotate it INWARD</Pill></div>
      </div>
      <div style={{ position: "absolute", left: 10, top: 130, display: "flex", flexDirection: "column", gap: 12 }}>
        {(["PEC", "LAT", "TER"] as M3[]).map((m, i) => (
          <div key={m} style={{ display: "flex", alignItems: "center", gap: 10, ...pop(t, 26.62 + i * 0.12) }}>
            <div style={{ width: 26, height: 26, borderRadius: 13, background: MCOL[m], border: `4px solid ${C.forest}` }} />
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.forest, whiteSpace: "nowrap" }}>{MNAME[m].toLowerCase()}</div>
          </div>
        ))}
      </div>
    </Scene>
  );
};

/* 6. Gray's 1918 Fig. 207 with modern labels (labels drawn over the scene so they can sit beside the plate) */
const PX = 170, PY = 0, PW = 520, PH = PW / (915 / 1409);
const PZ0: [number, number, number] = [1.18, 0.56, 0.5], PZ1: [number, number, number] = [1.3, 0.56, 0.5];
const plateXY = (t: number, fx: number, fy: number): [number, number] => {
  const k2 = ramp(t, 29.3, 31.85);
  const s = PZ0[0] + (PZ1[0] - PZ0[0]) * k2, cx = PZ0[1] + (PZ1[1] - PZ0[1]) * k2, cy = PZ0[2] + (PZ1[2] - PZ0[2]) * k2;
  const cl = (v: number, m: number) => Math.max(-m, Math.min(m, v));
  const tx = cl(-(cx - 0.5) * PW * s, (s - 1) * PW / 2), ty = cl(-(cy - 0.5) * PH * s, (s - 1) * PH / 2);
  const i = ramp(t, 29.3, 29.8);
  return [PX + PW / 2 + (fx * PW - PW / 2) * s + tx, PY + PH / 2 + (fy * PH - PH / 2) * s + ty + (1 - i) * 40];
};
const PLab: React.FC<{ fx: number; fy: number; dx: number; dy: number; t0: number; text: string; hot?: boolean; col?: string }> = ({ fx, fy, dx, dy, t0, text, hot, col }) => {
  const t = useT();
  const p = ramp(t, t0 - 0.05, t0 + 0.25) * (1 - ramp(t, 31.8, 32.1));
  if (p <= 0) return null;
  const [x, y] = plateXY(t, fx, fy);
  return (
    <>
      <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: p }}>
        <line x1={x} y1={y} x2={x + dx * p} y2={y + dy * p} stroke={C.forest} strokeWidth={5} strokeLinecap="round" />
        <circle cx={x} cy={y} r={11} fill={col ?? (hot ? C.banana : C.paper)} stroke={C.forest} strokeWidth={5} />
      </svg>
      <div style={{ position: "absolute", left: x + dx, top: y + dy, transform: `translate(${dx < 0 ? "-100%" : "0"}, -50%) scale(${0.8 + 0.2 * p})`, transformOrigin: dx < 0 ? "100% 50%" : "0 50%", opacity: p }}>
        <div style={{ background: hot ? C.banana : C.forest, color: hot ? C.forest : C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 30, padding: "5px 16px 8px", borderRadius: 14, whiteSpace: "nowrap", boxShadow: "0 5px 0 rgba(31,42,20,0.18)", borderLeft: col ? `10px solid ${col}` : undefined }}>{text}</div>
      </div>
    </>
  );
};
export const V6: React.FC = () => {
  const t = useT();
  return (
    <Scene start={29.3} end={31.85} push={0.008}>
      <Plate src="plates/humerus.png" aspect={AHUM} x={PX} y={PY} w={PW} a={29.3} b={31.85} zoomFrom={PZ0} zoomTo={PZ1} />
      <PLab fx={0.585} fy={0.31} dx={-40} dy={-170} t0={29.45} hot text="intertubercular groove" />
      <PLab fx={0.548} fy={0.47} dx={110} dy={-120} t0={29.75} text="latissimus dorsi" col={MCOL.LAT} />
      <PLab fx={0.618} fy={0.68} dx={70} dy={120} t0={30.05} text="pectoralis major" col={MCOL.PEC} />
      <PLab fx={0.466} fy={0.70} dx={-200} dy={60} t0={30.35} text="teres major" col={MCOL.TER} />
      <div style={{ position: "absolute", left: 0, width: 860, top: 870, display: "flex", justifyContent: "center", ...pop(t, 30.75) }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 22px 11px", fontFamily: FONT, fontWeight: 800, fontSize: 29, color: C.forest, whiteSpace: "nowrap" }}>
          <span style={{ color: C.matcha }}>1918 atlas name:</span> “crest of greater tubercle” = lateral lip
        </div>
      </div>
    </Scene>
  );
};

/* 7. Quick test */
export const V7: React.FC = () => {
  const t = useT();
  const c0 = 34.5;
  const n = t < c0 ? null : t < c0 + 0.5 ? 3 : t < c0 + 1.0 ? 2 : t < c0 + 1.5 ? 1 : null;
  const opts = ["long head of biceps", "short head of biceps", "long head of triceps"];
  return (
    <Scene start={31.85} end={35.95}>
      <div style={{ position: "absolute", left: 10, top: 20, width: 840, height: 880, borderRadius: 48, background: C.forest, ...pop(t, 31.9, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 56, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 50, width: 740, top: 140, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 66, lineHeight: 1.12, color: C.paper, ...pop(t, 32.5) }}>
          Which tendon runs <span style={{ color: C.banana }}>inside</span> the groove?
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 400, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          {opts.map((o, i) => (
            <div key={o} style={{ ...pop(t, 33.3 + i * 0.15), display: "flex", alignItems: "center", gap: 18, width: 600 }}>
              <div style={{ width: 62, height: 62, borderRadius: 18, background: C.banana, color: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, border: `4px solid ${C.paper}` }}>{"ABC"[i]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper, whiteSpace: "nowrap" }}>{o}</div>
            </div>
          ))}
        </div>
        {n && (
          <div style={{ position: "absolute", left: 0, width: 840, top: 680, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 150, color: C.banana, lineHeight: 1, transform: `scale(${1.3 - 0.3 * ramp(t, Math.floor((t - c0) / 0.5) * 0.5 + c0, Math.floor((t - c0) / 0.5) * 0.5 + c0 + 0.15)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 8. Answer: long head of biceps → bicipital groove */
export const V8: React.FC = () => {
  const t = useT();
  const lit: Partial<Record<Part, number>> = { HUM: 0, GRV: 0, GT: 0, LT: 0, TEN: 36.0, LIG: 36.0, LAT: 0, PEC: 0, TER: 0 };
  return (
    <Scene start={35.95} end={40.1} push={0.012}>
      <div style={{ position: "absolute", left: 0, width: 860, top: 40, display: "flex", justifyContent: "center", ...pop(t, 36.0, 0.25) }}>
        <Pill size={50} bg={C.matcha}>A · LONG HEAD OF BICEPS ✓</Pill>
      </div>
      <div style={{ position: "absolute", left: 0, top: 150, width: 860, height: 700, overflow: "hidden", borderRadius: 40 }}>
        <div style={{ position: "absolute", left: 0, top: -150, width: 860, height: 940 }}>
          <Cam z={1.2} f={[520, 330]}>
            <div style={{ position: "absolute", left: DX, top: DY }}>
              <HumerusDiagram t={t} w={DW} lit={lit} glow={["TEN"]} dim={0.45} feet={0} tendon={1} tendonGrow={35.95} id="v8" />
            </div>
            <Callout at={[532, 470]} dx={-150} dy={110} t0={36.6} hot text="long head of biceps" size={30} inv={1 / 1.2} />
            <Callout at={[540, 246]} dx={0} dy={-100} t0={37.4} text="held in by a ligament" size={26} inv={1 / 1.2} />
          </Cam>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 862, display: "flex", justifyContent: "center", alignItems: "center", gap: 14, ...pop(t, 38.5) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.forest }}>a.k.a.</div>
        <Pill size={44} bg={C.banana} color={C.forest}>BICIPITAL GROOVE</Pill>
      </div>
    </Scene>
  );
};

/* 9. Save */
export const V9: React.FC = () => {
  const t = useT();
  const b = ramp(t, 40.15, 40.5);
  const order: M3[] = ["TER", "LAT", "PEC"];
  return (
    <Scene start={40.1} end={42.35}>
      <div style={center(30, pop(t, 40.15))}>
        <svg width={200} height={260} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={center(330, pop(t, 40.2))}>
        <Big size={120}>SAVE THIS</Big>
      </div>
      <div style={center(480, pop(t, 40.85))}>
        <Big size={58} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ ...center(640), gap: 18, ...pop(t, 41.3) }}>
        {order.map((m) => <Chip key={m} m={m} size={50} crown={m === "LAT"} />)}
      </div>
      <div style={center(780, pop(t, 41.5))}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.forest, whiteSpace: "nowrap" }}>
          teres major · <span style={{ color: C.matcha }}>latissimus dorsi</span> · pectoralis major
        </div>
      </div>
    </Scene>
  );
};

/* 10. End card */
export const V10: React.FC = () => {
  const t = useT();
  return (
    <Scene start={42.35} end={46.8}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, 42.4, 0.35) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.banana, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 43.4, 43.75) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 42.4) * 5))})`, opacity: ramp(t, 42.6, 42.85) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
