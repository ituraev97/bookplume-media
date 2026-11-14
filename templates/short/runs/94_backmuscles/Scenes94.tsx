import React from "react";
import { C, FONT, Pill, Scene, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, pop } from "./Scenes67";
import { LChip, Loud, PlateQ, QS } from "./Scenes93";
import { Back, BCOL, BLETTER, BM, BNAME, BNERVE, BORDER } from "./Back94";

export const A409 = 1830 / 3044;
export const P409 = "plates/back409.png";
const W = 1830, H = 3044;
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* rotated "?" sticker along a printed label: from point a to point b (plate fractions), width in plate px */
export const band = (ax: number, ay: number, bx: number, by: number, wpx: number, off: number): QS => {
  const x0 = ax * W, y0 = ay * H, x1 = bx * W, y1 = by * H;
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const L = Math.hypot(x1 - x0, y1 - y0) + wpx * 0.6;
  const rot = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
  return { x0: (cx - L / 2) / W, x1: (cx + L / 2) / W, y0: (cy - wpx / 2) / H, y1: (cy + wpx / 2) / H, rot, off };
};
/* printed 1918 names on Fig. 409 */
export const LAB = {
  LAT1: [0.336, 0.52, 0.502, 0.748] as const, // L A T I S S I M U S
  DORSI: [0.314, 0.616, 0.378, 0.728] as const,
  TRAP: [0.352, 0.232, 0.512, 0.422] as const,
  LEV: [0.648, 0.152, 0.703, 0.258] as const,
  RMIN: [0.596, 0.23, 0.73, 0.35] as const,
  RMAJ1: [0.62, 0.316, 0.737, 0.407] as const,
  RMAJ2: [0.617, 0.35, 0.664, 0.407] as const,
};
export const st = (k: keyof typeof LAB, off: number, wpx = 78): QS => {
  const [a, b, c, d] = LAB[k];
  return band(a, b, c, d, wpx, off);
};
/* pins on the muscles (plate fractions) */
export const PINS: Record<BM, { x: number; y: number }> = {
  TR: { x: 0.39, y: 0.32 },
  LD: { x: 0.37, y: 0.6 },
  LS: { x: 0.685, y: 0.2 },
  RMI: { x: 0.66, y: 0.285 },
  RMA: { x: 0.635, y: 0.375 },
};

export type Tm = {
  reveal: number; ticks: number[]; lats: number; hookEnd: number;
  v2: [number, number]; five: number; top: number; under: number; trT?: number; ldT?: number;
  v3a?: [number, number]; trP?: number; ldP?: number;
  v3: [number, number]; peel: number; ls: number; rmi: number; rma: number; trD?: number; ldD?: number;
  cam: [number, number, number, number][];
};
export const TM_MAIN: Tm = {
  reveal: 3.76, ticks: [1.95, 2.6, 3.2], lats: 4.93, hookEnd: 5.6,
  v2: [5.6, 9.3], five: 5.8, top: 7.63, under: 8.43,
  v3a: [9.3, 11.85], trP: 9.98, ldP: 10.75,
  v3: [11.85, 17.1], peel: 12.13, ls: 14.1, rmi: 14.98, rma: 15.96, trD: 11.9, ldD: 11.9,
  cam: [[11.85, 0.74, 500, 500], [12.9, 0.78, 520, 470], [13.7, 1.25, 590, 300], [15.2, 1.3, 580, 330], [16.2, 1.15, 560, 360], [17.1, 1.05, 540, 380]],
};
export const TM_TT: Tm = {
  reveal: 3.76, ticks: [1.95, 2.6, 3.2], lats: 4.93, hookEnd: 5.75,
  v2: [5.75, 10.1], five: 6.11, top: 7.92, under: 99, trT: 8.84, ldT: 9.59,
  v3: [10.1, 15.25], peel: 10.99, ls: 12.03, rmi: 12.97, rma: 14.12, trD: 10.1, ldD: 10.1,
  cam: [[10.1, 0.74, 500, 500], [11.0, 0.78, 520, 470], [11.7, 1.25, 590, 300], [13.4, 1.3, 580, 330], [14.4, 1.15, 560, 360], [15.25, 1.05, 540, 380]],
};

/* the quiz target: latissimus dorsi + its printed name */
export const HOOKPIN = PINS.LD;
export const hookStick = (off: number): QS[] => [st("LAT1", off, 84), st("DORSI", off, 84)];

/* 3-2-1 ring */
const Ring: React.FC<{ t: number; size: number; tm: Tm }> = ({ t, size, tm }) => {
  const { reveal: REVEAL, ticks: TICKS } = tm;
  if (t > REVEAL + 0.25) return null;
  const k = ramp(t, TICKS[0] - 0.6, REVEAL);
  let n = 3;
  TICKS.forEach((s, i) => { if (t >= s) n = 3 - i; });
  const cur = TICKS[3 - n] ?? 0;
  const bump = ramp(t, cur, cur + 0.15);
  const out = ramp(t, REVEAL - 0.05, REVEAL + 0.2);
  const r = size / 2 - 12;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ width: size, height: size, position: "relative", opacity: 1 - out, transform: `scale(${(1 + 0.12 * (1 - bump)) * (1 - 0.3 * out)})` }}>
      <svg width={size} height={size} style={{ position: "absolute" }}>
        <circle cx={size / 2} cy={size / 2} r={r + 6} fill={C.forest} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(247,246,236,0.18)" strokeWidth={14} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.banana} strokeWidth={14} strokeLinecap="round" strokeDasharray={`${circ * (1 - k)} ${circ}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.5, color: C.paper, lineHeight: 1 }}>{n}</div>
    </div>
  );
};

/* 1. Quiz hook: Gray's 1918 Fig. 409, red pin on latissimus dorsi from frame 1, 3-2-1, reveal */
export const V1: React.FC<{ tm: Tm }> = ({ tm }) => {
  const t = useT();
  const R = tm.reveal;
  const rv = ramp(t, R, R + 0.25);
  return (
    <Scene start={-0.6} end={tm.hookEnd} push={0.02}>
      <div style={center(0, { opacity: 1 - rv })}>
        <Loud size={118}>NAME THIS</Loud>
      </div>
      <div style={center(124, { opacity: 1 - rv })}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ background: "#E5251A", border: "7px solid #111", borderRadius: 18, padding: "0 18px 6px", transform: "rotate(-2deg)" }}><Loud size={92}>MUSCLE</Loud></div>
          <Loud size={70}>IN 3 SEC</Loud>
        </div>
      </div>
      {rv > 0 && (
        <div style={center(16, pop(t, R, 0.3))}>
          <div style={{ textAlign: "center" }}>
            <Big size={84} color={C.forest}>✓ LATISSIMUS</Big>
            <div style={{ height: 10 }} />
            <div style={{ display: "flex", gap: 18, alignItems: "center", justifyContent: "center" }}>
              <Big size={84} color={C.red}>DORSI</Big>
              <div style={{ ...pop(t, tm.lats, 0.3) }}><Pill size={44} bg={C.banana} color={C.forest}>= your “lats”</Pill></div>
            </div>
          </div>
        </div>
      )}
      <PlateQ src={P409} aspect={A409} x={30} y={262} w={800} h={620} a={-0.6} b={tm.hookEnd} from={[0.43, 0.6, 0.46]} to={[0.42, 0.6, 0.5]}
        pin={{ ...HOOKPIN, t0: -1, t1: R + 0.2, r: 66 }} stickers={hookStick(R)}
        labels={[{ x: 0.37, y: 0.6, text: "latissimus dorsi", t: R + 0.02, hot: true, ox: 50, oy: -175 }]} ls={38} />
      <div style={{ position: "absolute", left: 640, top: 690 }}>
        <Ring t={t} size={170} tm={tm} />
      </div>
      <div style={center(898, pop(t, 0.05, 0.25))}>
        {t < R ? <Pill size={34} bg={C.forest}>anatomy quiz · say it before the 1</Pill> : (
          <div style={{ ...pop(t, R + 0.6, 0.25) }}><Pill size={36} bg={C.banana} color={C.forest}>superficial back muscles · mnemonic</Pill></div>
        )}
      </div>
    </Scene>
  );
};

/* 2. Mnemonic card: 5 = 2 on top + 3 underneath (T L over L m M) */
export const V2: React.FC<{ tm: Tm }> = ({ tm }) => {
  const t = useT();
  const [s0, s1] = tm.v2;
  const topOn = ramp(t, tm.top - 0.05, tm.top + 0.25);
  const undOn = ramp(t, tm.under - 0.05, tm.under + 0.25);
  const Row: React.FC<{ b: BM; on: number; hot?: boolean; dark?: boolean }> = ({ b, on, hot }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: 0.45 + 0.55 * on, transform: `scale(${hot ? 1.05 : 1})`, transformOrigin: "0 50%" }}>
      <LChip l={BLETTER[b]} size={70} on={on} col={BCOL(b)} hot={hot} dark />
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 48, color: C.paper, whiteSpace: "nowrap", lineHeight: 1 }}>
        <span style={{ background: on > 0.5 ? C.banana : "rgba(247,246,236,0.14)", color: C.forest, borderRadius: 12, padding: "0 10px 3px" }}>{BNAME[b][0]}</span>
        {BNAME[b].slice(1)}
      </div>
    </div>
  );
  const hotT = tm.trT !== undefined && t >= tm.trT && (tm.ldT === undefined || t < tm.ldT);
  const hotL = tm.ldT !== undefined && t >= tm.ldT;
  return (
    <Scene start={s0} end={s1} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 20, width: 820, height: 880, borderRadius: 48, background: C.forest, ...pop(t, s0 + 0.02, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 36, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 32, letterSpacing: 4, color: C.banana }}>SUPERFICIAL BACK MUSCLES · MNEMONIC</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 86, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, fontFamily: FONT, fontWeight: 800, color: C.paper }}>
          <div style={{ fontSize: 110, color: C.banana, lineHeight: 1, ...pop(t, tm.five, 0.3) }}>5</div>
          <div style={{ fontSize: 64, lineHeight: 1, opacity: ramp(t, tm.top - 0.1, tm.top + 0.15) }}>=</div>
          <div style={{ fontSize: 110, lineHeight: 1, color: "#F59A8A", ...pop(t, tm.top, 0.3) }}>2</div>
          <div style={{ fontSize: 64, lineHeight: 1, opacity: ramp(t, tm.top + 0.3, tm.top + 0.5) }}>+</div>
          <div style={{ fontSize: 110, lineHeight: 1, color: "#8CC0E6", ...pop(t, Math.min(tm.under, tm.top + 0.6), 0.3) }}>3</div>
        </div>
        {/* top layer */}
        <div style={{ position: "absolute", left: 40, width: 740, top: 236, height: 250, borderRadius: 30, background: "rgba(226,92,71,0.18)", border: `4px solid ${topOn > 0.5 ? "#F59A8A" : "rgba(247,246,236,0.2)"}`, boxSizing: "border-box", padding: "16px 26px", ...pop(t, s0 + 0.2, 0.3), opacity: ramp(t, s0 + 0.2, s0 + 0.5) * (0.35 + 0.65 * topOn) }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, letterSpacing: 3, color: "#F59A8A" }}>2 ON TOP · the big sheets</div>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 16 }}>
            <Row b="TR" on={topOn} hot={hotT} />
            <Row b="LD" on={topOn} hot={hotL} />
          </div>
        </div>
        {/* bottom layer, slides out from under */}
        <div style={{ position: "absolute", left: 40, width: 740, top: 512 + (1 - undOn) * -40, height: 330, borderRadius: 30, background: "rgba(91,152,196,0.16)", border: `4px solid ${undOn > 0.5 ? "#8CC0E6" : "rgba(247,246,236,0.18)"}`, boxSizing: "border-box", padding: "16px 26px", opacity: 0.35 + 0.65 * undOn }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, letterSpacing: 3, color: "#8CC0E6" }}>3 UNDERNEATH · top → bottom</div>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 14 }}>
            <Row b="LS" on={undOn} />
            <Row b="RMI" on={undOn} />
            <Row b="RMA" on={undOn} />
          </div>
        </div>
      </div>
    </Scene>
  );
};

/* 3a. On the real plate: trapezius + latissimus dorsi with modern labels (main cut) */
export const V3a: React.FC<{ tm: Tm }> = ({ tm }) => {
  const t = useT();
  if (!tm.v3a) return null;
  const [s0, s1] = tm.v3a;
  return (
    <Scene start={s0} end={s1} push={0.006}>
      <div style={center(26, pop(t, s0 + 0.05, 0.25))}>
        <div style={{ background: "#E25C47", border: `4px solid ${C.forest}`, borderRadius: 26, padding: "8px 30px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.paper }}>2 ON TOP</div>
      </div>
      <PlateQ src={P409} aspect={A409} x={30} y={110} w={800} h={800} a={s0} b={s1} from={[0.41, 0.44, 0.74]} to={[0.4, 0.45, 0.68]} ls={36}
        labels={[
          { x: 0.39, y: 0.32, text: "trapezius", t: tm.trP!, hot: t < tm.ldP!, ox: 60, oy: 110 },
          { x: 0.33, y: 0.58, text: "latissimus dorsi", t: tm.ldP!, hot: true, ox: 70, oy: -120 },
        ]} />
    </Scene>
  );
};

type Kf = [number, number, number, number];
const cam = (t: number, ks: Kf[]) => {
  if (t <= ks[0][0]) return ks[0];
  for (let i = 0; i < ks.length - 1; i++) {
    const a = ks[i], b = ks[i + 1];
    if (t <= b[0]) {
      const k = ramp(t, a[0], b[0]);
      const e = k * k * (3 - 2 * k);
      return [t, a[1] + (b[1] - a[1]) * e, a[2] + (b[2] - a[2]) * e, a[3] + (b[3] - a[3]) * e] as Kf;
    }
  }
  return ks[ks.length - 1];
};

const NOTE: Record<BM, string> = {
  TR: "top sheet · neck + upper back",
  LD: "top sheet · widest muscle of the back",
  LS: "UNDER trapezius · lifts the scapula",
  RMI: "UNDER trapezius · above the major",
  RMA: "UNDER trapezius · biggest of the 3",
};
const NameCard: React.FC<{ t: number; top: number; times: Partial<Record<BM, number>> }> = ({ t, top, times }) => {
  let cur: BM | null = null;
  BORDER.forEach((b) => { const s = times[b]; if (s !== undefined && t >= s - 0.02) cur = b; });
  if (!cur) return null;
  const b = cur as BM;
  const p = ramp(t, times[b]! - 0.02, times[b]! + 0.2);
  const name = BNAME[b];
  return (
    <div key={b} style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, background: C.forest, borderRadius: 30, padding: "12px 28px 14px 14px", transform: `scale(${0.85 + 0.15 * p})`, opacity: p, boxShadow: "0 10px 0 rgba(31,42,20,0.15)" }}>
        <LChip l={BLETTER[b]} size={76} col={BCOL(b)} />
        <div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 50, color: C.paper, lineHeight: 1.05, whiteSpace: "nowrap" }}>
            <span style={{ background: C.banana, color: C.forest, borderRadius: 10, padding: "0 6px 2px" }}>{name[0]}</span>{name.slice(1)}
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 27, color: "#B9D27A", marginTop: 4, whiteSpace: "nowrap" }}>{NOTE[b]}</div>
        </div>
      </div>
    </div>
  );
};

/* 3. Our own diagram: trapezius peels away, the deep three light up as named */
export const V3: React.FC<{ tm: Tm }> = ({ tm }) => {
  const t = useT();
  const [s0, s1] = tm.v3;
  const [, s, cx, cy] = cam(t, tm.cam);
  const top = 150, h = 712;
  const X0 = 430 - cx * s, Y0 = h / 2 - cy * s;
  const lit: Partial<Record<BM, number>> = { TR: tm.trD, LD: tm.ldD, LS: tm.ls, RMI: tm.rmi, RMA: tm.rma };
  let hot: BM[] = [];
  ([["LS", tm.ls], ["RMI", tm.rmi], ["RMA", tm.rma]] as [BM, number][]).forEach(([b, s]) => { if (t >= s - 0.05) hot = [b]; });
  const peel = ramp(t, tm.peel, tm.peel + 0.7);
  const names: Partial<Record<BM, number>> = { LS: tm.ls, RMI: tm.rmi, RMA: tm.rma };
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={{ position: "absolute", left: 0, top, width: 860, height: h, overflow: "hidden", borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}` }}>
        <div style={{ position: "absolute", left: X0, top: Y0 }}>
          <Back t={t} w={1000 * s} id="v3" lit={lit} hot={hot} peel={peel} dimTop={ramp(t, tm.peel, tm.peel + 0.5)} />
        </div>
        <div style={{ position: "absolute", left: 18, top: 16, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.forest, background: "rgba(255,254,246,0.9)", borderRadius: 12, padding: "4px 12px" }}>back view</div>
        <div style={{ position: "absolute", right: 16, bottom: 12, fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.forest, opacity: 0.55, background: "rgba(255,254,246,0.85)", borderRadius: 8, padding: "0 8px" }}>diagram: Book Plume</div>
      </div>
      <div style={center(30, { opacity: ramp(t, tm.peel, tm.peel + 0.3) })}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#3E7CA6", border: `4px solid ${C.forest}`, borderRadius: 26, padding: "8px 26px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 48, color: C.paper, whiteSpace: "nowrap" }}>
          lift the trapezius → 3 UNDER
        </div>
      </div>
      <div style={{ ...center(30), opacity: 1 - ramp(t, tm.peel - 0.2, tm.peel) }}>
        <div style={{ background: "#E25C47", border: `4px solid ${C.forest}`, borderRadius: 26, padding: "8px 30px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.paper }}>2 ON TOP</div>
      </div>
      <NameCard t={t} top={878} times={names} />
    </Scene>
  );
};

/* 4. Quick test with 3-2-1 */
export const V4: React.FC<{ s0: number; s1: number; q: number; cd: [number, number][] }> = ({ s0, s1, q, cd }) => {
  const t = useT();
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < s1) { n = v; n0 = s; } });
  return (
    <Scene start={s0} end={s1}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, s0 + 0.05, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 42, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 30, width: 760, top: 100, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 58, lineHeight: 1.1, color: C.paper, ...pop(t, q) }}>
          Which one is <span style={{ color: C.banana }}>NOT</span> supplied by the brachial plexus?
        </div>
        <div style={{ position: "absolute", left: 60, top: 300, width: 700, display: "flex", flexDirection: "column", gap: 14 }}>
          {BORDER.map((b, i) => (
            <div key={b} style={{ height: 74, borderRadius: 22, background: "rgba(247,246,236,0.08)", border: "3px solid rgba(247,246,236,0.18)", display: "flex", alignItems: "center", gap: 16, padding: "0 16px", boxSizing: "border-box", ...pop(t, q + 0.5 + i * 0.08, 0.25) }}>
              <LChip l={BLETTER[b]} size={52} col="#7B8C63" />
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.paper, whiteSpace: "nowrap" }}>{BNAME[b]}</div>
              <div style={{ marginLeft: "auto", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.banana }}>?</div>
            </div>
          ))}
        </div>
        {n !== null ? (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 718, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 130, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        ) : (
          <div style={{ position: "absolute", left: 0, width: 820, top: 760, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#B9D27A", opacity: ramp(t, q + 1.2, q + 1.4) }}>pause · say it out loud</div>
        )}
      </div>
    </Scene>
  );
};

/* 5. Answer on Gray's 1918 Fig. 409: trapezius = accessory nerve (CN XI) */
export const V5: React.FC<{ s0: number; s1: number; cn: number; rest: number }> = ({ s0, s1, cn, rest }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.006}>
      <div style={center(20, pop(t, s0 + 0.05, 0.25))}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, background: C.matcha, border: `4px solid ${C.forest}`, borderRadius: 26, padding: "10px 26px 14px 12px" }}>
          <LChip l="T" size={72} col={C.red} />
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 60, color: C.paper, whiteSpace: "nowrap" }}>✓ Trapezius</div>
        </div>
      </div>
      <div style={center(122, pop(t, cn, 0.25))}>
        <Pill size={36} bg={C.forest}>cranial nerve XI · accessory nerve</Pill>
      </div>
      <PlateQ src={P409} aspect={A409} x={30} y={196} w={800} h={640} a={s0} b={s1} from={[0.53, 0.29, 0.62]} to={[0.53, 0.3, 0.58]} ls={32}
        pin={{ x: 0.42, y: 0.31, t0: s0, t1: s1 + 1, r: 56 }}
        labels={[
          { x: 0.42, y: 0.31, text: "trapezius", t: s0 + 0.1, hot: true, ox: -20, oy: 130 },
          { x: 0.685, y: 0.21, text: "levator scapulae", t: rest, ox: -70, oy: -60 },
          { x: 0.655, y: 0.285, text: "rhomboid minor", t: rest + 0.15, ox: -70, oy: -20 },
          { x: 0.64, y: 0.375, text: "rhomboid major", t: rest + 0.3, ox: -70, oy: 50 },
        ]} />
      <div style={{ position: "absolute", left: 30, top: 846, opacity: ramp(t, rest + 0.4, rest + 0.65) }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 16px 10px", fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.forest, whiteSpace: "nowrap" }}>
          <span style={{ color: C.matcha }}>1918 atlas name:</span> “Rhomboideus major” = rhomboid major
        </div>
      </div>
    </Scene>
  );
};

/* 6. Save + cheat sheet */
export const V6: React.FC<{ s0: number; s1: number }> = ({ s0, s1 }) => {
  const t = useT();
  const bb = ramp(t, s0 + 0.05, s0 + 0.4);
  return (
    <Scene start={s0} end={s1}>
      <div style={{ position: "absolute", left: 40, top: 0, ...pop(t, s0 + 0.05) }}>
        <svg width={110} height={140} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - bb) * -40})`} />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 170, top: 6, ...pop(t, s0 + 0.1) }}>
        <Big size={100}>SAVE THIS</Big>
      </div>
      <div style={{ position: "absolute", left: 172, top: 112, ...pop(t, s0 + 0.3) }}>
        <Big size={40} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ position: "absolute", left: 30, top: 190, width: 800, height: 710, borderRadius: 40, background: C.card, border: `3px solid ${C.line}`, boxShadow: "0 18px 40px rgba(31,42,20,0.12)", padding: "26px 34px", boxSizing: "border-box", ...pop(t, s0 + 0.15, 0.3) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.matcha, letterSpacing: 2 }}>SUPERFICIAL BACK MUSCLES · NERVES</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.forest, marginTop: 8, whiteSpace: "nowrap" }}>2 on top (T L) + 3 under (L m M)</div>
        <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 30 }}>
          {BORDER.map((b, i) => (
            <div key={b} style={{ display: "flex", alignItems: "center", gap: 16, opacity: ramp(t, s0 + 0.2 + i * 0.06, s0 + 0.4 + i * 0.06) }}>
              <LChip l={BLETTER[b]} size={72} col={BCOL(b)} />
              <div>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.forest, whiteSpace: "nowrap", lineHeight: 1.05 }}>{BNAME[b]}</div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 27, color: b === "TR" ? C.red : C.matcha, whiteSpace: "nowrap" }}>{BNERVE[b]}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Scene>
  );
};

/* 7. End card (≤ 1.5 s) */
export const V7: React.FC<{ s0: number; s1: number }> = ({ s0, s1 }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, s0 + 0.02, 0.3) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.banana, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, s0 + 0.15, s0 + 0.4) }}>
          anatomy quizzes you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - s0) * 5))})`, opacity: ramp(t, s0 + 0.05, s0 + 0.25) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};

/* TikTok end: comment card (no brand) */
export const VComment: React.FC<{ s0: number; s1: number }> = ({ s0, s1 }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1 + 0.6} push={0.01}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 800, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30, ...pop(t, s0 + 0.02, 0.3) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.banana, letterSpacing: 4 }}>DID YOU GET IT IN 3?</div>
        <div style={{ textAlign: "center" }}>
          <Loud size={104}>COMMENT</Loud>
          <div style={{ height: 14 }} />
          <Loud size={84} color="#FFE04A">WHAT YOU</Loud>
          <div style={{ height: 14 }} />
          <Loud size={84} color="#FFE04A">GUESSED</Loud>
        </div>
        <svg width={120} height={130} viewBox="0 0 120 130" style={{ transform: `translateY(${Math.abs(Math.sin((t - s0) * 6)) * 16}px)` }}>
          <path d="M 40 6 L 80 6 L 80 66 L 112 66 L 60 124 L 8 66 L 40 66 Z" fill="#E5251A" stroke="#111" strokeWidth={8} strokeLinejoin="round" />
        </svg>
      </div>
    </Scene>
  );
};
