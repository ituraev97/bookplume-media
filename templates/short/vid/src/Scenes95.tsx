import React from "react";
import { C, FONT, Pill, Scene, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, pop } from "./Scenes67";
import { LChip, Loud, PlateQ, QS } from "./Scenes93";
import { Jaw, JACT, JCOL, JLET, JM, JNAME, JORDER } from "./Jaw95";

export const P378 = "plates/head378.png";
export const A378 = 1785 / 2340;
export const P382 = "plates/temp382.png";
export const A382 = 1569 / 1225;
export const P383 = "plates/pter383.png";
export const A383 = 1308 / 1149;
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* rotated "?" sticker along a printed label on Fig. 378 (plate fractions a→b, thickness in plate px) */
const band = (ax: number, ay: number, bx: number, by: number, wpx: number, off: number, W = 1785, H = 2340): QS => {
  const x0 = ax * W, y0 = ay * H, x1 = bx * W, y1 = by * H;
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const L = Math.hypot(x1 - x0, y1 - y0) + wpx * 0.5;
  const rot = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
  return { x0: (cx - L / 2) / W, x1: (cx + L / 2) / W, y0: (cy - wpx / 2) / H, y1: (cy + wpx / 2) / H, rot, off };
};
/* printed 1918 words on Fig. 378 near the target: MASSETER, Superficial Portion, Deep Portion */
export const hookStick = (off: number): QS[] => [
  band(0.318, 0.409, 0.394, 0.338, 118, off),
  band(0.39, 0.354, 0.436, 0.341, 66, off),
];
export const HOOKPIN = { x: 0.405, y: 0.405 };

export type Tm = {
  reveal: number; ticks: number[]; pow: number; hookEnd: number;
};
export const TM_MAIN: Tm = { reveal: 3.79, ticks: [1.95, 2.6, 3.2], pow: 4.63, hookEnd: 6.0 };
export const TM_TT: Tm = TM_MAIN;

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

/* 1. Quiz hook: Gray's 1918 Fig. 378, red pin on the masseter from frame 1, 3-2-1, reveal */
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
        <div style={center(20, pop(t, R, 0.3))}>
          <div style={{ textAlign: "center" }}>
            <Big size={112} color={C.forest}>✓ MASSETER</Big>
            <div style={{ height: 12 }} />
            <div style={{ display: "flex", justifyContent: "center", ...pop(t, tm.pow, 0.3) }}>
              <Pill size={44} bg={C.red} color={C.paper}>most powerful chewing muscle</Pill>
            </div>
          </div>
        </div>
      )}
      <PlateQ src={P378} aspect={A378} x={30} y={262} w={800} h={620} a={-0.6} b={tm.hookEnd} from={[0.385, 0.385, 0.42]} to={[0.39, 0.39, 0.37]}
        pin={{ ...HOOKPIN, t0: -1, t1: R + 0.2, r: 62 }} stickers={hookStick(R)}
        labels={[{ x: HOOKPIN.x, y: HOOKPIN.y, text: "masseter", t: R + 0.02, hot: true, ox: 150, oy: 170 }]} ls={40} />
      <div style={{ position: "absolute", left: 640, top: 700 }}>
        <Ring t={t} size={170} tm={tm} />
      </div>
      <div style={center(898, pop(t, 0.05, 0.25))}>
        {t < R ? <Pill size={34} bg={C.forest}>anatomy quiz · say it before the 1</Pill> : (
          <div style={{ ...pop(t, R + 0.6, 0.25) }}><Pill size={36} bg={C.banana} color={C.forest}>muscles of mastication · mnemonic</Pill></div>
        )}
      </div>
    </Scene>
  );
};

/* 2. Mnemonic card: 4 = 3 CLOSE + 1 OPENS */
export const V2: React.FC<{ s0: number; s1: number; four: number; close: number; open: number; lpHot?: number }> = ({ s0, s1, four, close, open, lpHot }) => {
  const t = useT();
  const cOn = ramp(t, close - 0.05, close + 0.25);
  const oOn = ramp(t, open - 0.05, open + 0.25);
  const hotLP = lpHot !== undefined && t >= lpHot - 0.05;
  const Row: React.FC<{ m: JM; on: number; hot?: boolean }> = ({ m, on, hot }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: 0.45 + 0.55 * on, transform: `scale(${hot ? 1.06 : 1})`, transformOrigin: "0 50%" }}>
      <LChip l={JLET[m]} size={66} on={on} col={JCOL(m)} hot={hot} dark />
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper, whiteSpace: "nowrap", lineHeight: 1 }}>
        <span style={{ background: on > 0.5 ? C.banana : "rgba(247,246,236,0.14)", color: C.forest, borderRadius: 12, padding: "0 10px 3px" }}>{JNAME[m][0]}</span>
        {JNAME[m].slice(1)}
      </div>
    </div>
  );
  const bob = Math.sin(t * 6) * 6;
  return (
    <Scene start={s0} end={s1} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 20, width: 820, height: 880, borderRadius: 48, background: C.forest, ...pop(t, s0 + 0.02, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 36, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 4, color: C.banana }}>MUSCLES OF MASTICATION · MNEMONIC</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 86, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, fontFamily: FONT, fontWeight: 800, color: C.paper }}>
          <div style={{ fontSize: 110, color: C.banana, lineHeight: 1, ...pop(t, four, 0.3) }}>4</div>
          <div style={{ fontSize: 64, lineHeight: 1, opacity: ramp(t, close - 0.1, close + 0.15) }}>=</div>
          <div style={{ fontSize: 110, lineHeight: 1, color: "#F59A8A", ...pop(t, close, 0.3) }}>3↑</div>
          <div style={{ fontSize: 64, lineHeight: 1, opacity: ramp(t, open - 0.1, open + 0.15) }}>+</div>
          <div style={{ fontSize: 110, lineHeight: 1, color: "#8CC0E6", ...pop(t, open, 0.3) }}>1↓</div>
        </div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 236, height: 330, borderRadius: 30, background: "rgba(226,92,71,0.18)", border: `4px solid ${cOn > 0.5 ? "#F59A8A" : "rgba(247,246,236,0.2)"}`, boxSizing: "border-box", padding: "16px 26px", opacity: ramp(t, s0 + 0.15, s0 + 0.45) * (0.4 + 0.6 * cOn) }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT, fontWeight: 800, fontSize: 28, letterSpacing: 3, color: "#F59A8A" }}>
            <span>3 CLOSE YOUR JAW</span>
            <span style={{ transform: `translateY(${cOn > 0.5 ? -Math.abs(bob) : 0}px)`, fontSize: 34 }}>↑ bite</span>
          </div>
          <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 16 }}>
            <Row m="MA" on={cOn} />
            <Row m="TE" on={cOn} />
            <Row m="MP" on={cOn} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 592 + (1 - oOn) * -40, height: 250, borderRadius: 30, background: "rgba(91,152,196,0.18)", border: `4px solid ${oOn > 0.5 ? "#8CC0E6" : "rgba(247,246,236,0.18)"}`, boxSizing: "border-box", padding: "16px 26px", opacity: 0.35 + 0.65 * oOn }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT, fontWeight: 800, fontSize: 28, letterSpacing: 3, color: "#8CC0E6" }}>
            <span>ONLY 1 HELPS IT OPEN</span>
            <span style={{ transform: `translateY(${oOn > 0.5 ? Math.abs(bob) : 0}px)`, fontSize: 34 }}>↓ open</span>
          </div>
          <div style={{ marginTop: 18 }}>
            <Row m="LP" on={oOn} hot={hotLP} />
          </div>
          <div style={{ marginTop: 18, fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.paper, opacity: ramp(t, open + 0.4, open + 0.7) }}>
            trick: <span style={{ color: C.banana }}>L</span>ateral = <span style={{ color: C.banana }}>L</span>owers the jaw
          </div>
        </div>
      </div>
    </Scene>
  );
};

/* tracker of the closers (top banner) */
const Closers: React.FC<{ t: number; times: [JM, number][]; label: string; col: string }> = ({ t, times, label, col }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, background: col, border: `4px solid ${C.forest}`, borderRadius: 26, padding: "8px 22px 10px", fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.paper, whiteSpace: "nowrap" }}>
    {label}
    {times.map(([m, s], i) => (
      <div key={i} style={{ ...pop(t, s, 0.25) }}><LChip l={JLET[m]} size={56} col={JCOL(m)} /></div>
    ))}
  </div>
);

/* 3a. Gray's Fig. 382: temporalis (masseter + arch removed) */
export const V3a: React.FC<{ s0: number; s1: number; ma: number; te: number }> = ({ s0, s1, ma, te }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.006}>
      <div style={center(20, pop(t, s0 + 0.05, 0.25))}>
        <Closers t={t} times={[["MA", ma], ["TE", te]]} label="3 CLOSE ↑" col="#C9503C" />
      </div>
      <PlateQ src={P382} aspect={A382} x={30} y={130} w={800} h={700} a={s0} b={s1} from={[0.5, 0.5, 1.0]} to={[0.55, 0.47, 0.86]} ls={36}
        labels={[
          { x: 0.62, y: 0.32, text: "temporalis", t: te, hot: true, ox: -60, oy: -110 },
          { x: 0.33, y: 0.8, text: "→ coronoid process", t: te + 0.35, ox: 80, oy: 40 },
        ]} />
      <div style={center(850, { opacity: ramp(t, s0 + 0.3, s0 + 0.55) })}>
        <Pill size={30} bg={C.forest}>Gray's Fig. 382 · masseter + zygomatic arch removed</Pill>
      </div>
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

const NameCard: React.FC<{ t: number; top: number; times: [JM, number][] }> = ({ t, top, times }) => {
  let cur: [JM, number] | null = null;
  times.forEach((x) => { if (t >= x[1] - 0.02) cur = x; });
  if (!cur) return null;
  const [m, s] = cur as [JM, number];
  const p = ramp(t, s - 0.02, s + 0.2);
  const name = JNAME[m];
  return (
    <div key={m} style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, background: C.forest, borderRadius: 30, padding: "12px 28px 14px 14px", transform: `scale(${0.85 + 0.15 * p})`, opacity: p, boxShadow: "0 10px 0 rgba(31,42,20,0.15)" }}>
        <LChip l={JLET[m]} size={76} col={JCOL(m)} />
        <div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 50, color: C.paper, lineHeight: 1.05, whiteSpace: "nowrap" }}>
            <span style={{ background: C.banana, color: C.forest, borderRadius: 10, padding: "0 6px 2px" }}>{name[0]}</span>{name.slice(1)}
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 27, color: m === "LP" ? "#8CC0E6" : "#F5B3A6", marginTop: 4, whiteSpace: "nowrap" }}>{JACT[m]}</div>
        </div>
      </div>
    </div>
  );
};

/* the diagram box with a camera */
const JawBox: React.FC<{ t: number; ks: Kf[]; top: number; h: number; id: string; children?: React.ReactNode } & Omit<React.ComponentProps<typeof Jaw>, "w" | "id" | "t">> = ({ t, ks, top, h, id, children, ...rest }) => {
  const [, s, cx, cy] = cam(t, ks);
  const X0 = 430 - cx * s, Y0 = h / 2 - cy * s;
  return (
    <div style={{ position: "absolute", left: 0, top, width: 860, height: h, overflow: "hidden", borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}` }}>
      <div style={{ position: "absolute", left: X0, top: Y0 }}>
        <Jaw t={t} w={1000 * s} id={id} {...rest} />
      </div>
      <div style={{ position: "absolute", left: 18, top: 16, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.forest, background: "rgba(255,254,246,0.9)", borderRadius: 12, padding: "4px 12px" }}>left side view</div>
      <div style={{ position: "absolute", right: 16, bottom: 12, fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.forest, opacity: 0.55, background: "rgba(255,254,246,0.85)", borderRadius: 8, padding: "0 8px" }}>diagram: Book Plume</div>
      {children}
    </div>
  );
};

/* 3. Our own diagram: masseter peels away, medial pterygoid lights up, CLOSE arrows */
export const V3: React.FC<{ s0: number; s1: number; ma: number; te: number; peel: number; mp: number; lift: number }> = ({ s0, s1, ma, te, peel, mp, lift }) => {
  const t = useT();
  const pe = ramp(t, peel, peel + 0.7);
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(20, pop(t, s0 + 0.05, 0.25))}>
        <Closers t={t} times={[["MA", s0 - 1], ["TE", s0 - 1], ["MP", mp]]} label="3 CLOSE ↑" col="#C9503C" />
      </div>
      <JawBox t={t} top={130} h={712} id="v3" ks={[[s0, 0.72, 520, 520], [peel, 0.76, 530, 560], [mp, 1.35, 560, 700], [lift - 0.1, 1.35, 560, 700], [lift + 0.5, 0.82, 560, 560], [s1, 0.8, 550, 560]]}
        lit={{ MA: ma, TE: te, MP: mp }} hot={t >= mp - 0.05 && t < lift ? ["MP"] : []} peel={pe} up={ramp(t, lift, lift + 0.4)} />
      <NameCard t={t} top={866} times={[["MP", mp]]} />
    </Scene>
  );
};

/* 3b. Gray's Fig. 383: the two pterygoids, the lateral one pulls forward + helps open */
export const V3b: React.FC<{ s0: number; s1: number; lp: number; fwd: number; open: number }> = ({ s0, s1, lp, fwd, open }) => {
  const t = useT();
  const act = t >= open - 0.05 ? 1 : t >= fwd - 0.05 ? 0 : -1;
  return (
    <Scene start={s0} end={s1} push={0.006}>
      <div style={center(20, pop(t, s0 + 0.05, 0.25))}>
        <Closers t={t} times={[["LP", lp]]} label="1 OPENS ↓" col="#2F7DB8" />
      </div>
      <PlateQ src={P383} aspect={A383} x={30} y={130} w={800} h={640} a={s0} b={s1} from={[0.5, 0.52, 0.9]} to={[0.53, 0.53, 0.72]} ls={36}
        pin={{ x: 0.53, y: 0.46, t0: lp, t1: s1 + 1, r: 52 }}
        labels={[
          { x: 0.53, y: 0.46, text: "lateral pterygoid", t: lp + 0.05, hot: true, ox: -30, oy: -150 },
          { x: 0.52, y: 0.72, text: "medial pterygoid", t: lp + 0.5, ox: 70, oy: 70 },
        ]} />
      <div style={{ position: "absolute", left: 30, top: 784, opacity: ramp(t, lp + 0.9, lp + 1.15) }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 16px 10px", fontFamily: FONT, fontWeight: 800, fontSize: 27, color: C.forest, whiteSpace: "nowrap" }}>
          <span style={{ color: C.matcha }}>1918 atlas name:</span> “Pterygoideus externus” = lateral
        </div>
      </div>
      {act >= 0 && (
        <div key={act} style={center(862, pop(t, act === 1 ? open : fwd, 0.25))}>
          <div style={{ background: "#2F7DB8", border: `4px solid ${C.forest}`, borderRadius: 24, padding: "6px 26px 10px", fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.paper, whiteSpace: "nowrap" }}>
            {act === 1 ? "↓ helps the jaw OPEN" : "← pulls the jaw FORWARD"}
          </div>
        </div>
      )}
    </Scene>
  );
};

/* 3c. One nerve: CN V → V3 mandibular → all 4 */
export const V3c: React.FC<{ s0: number; s1: number; v3: number; tri: number }> = ({ s0, s1, v3, tri }) => {
  const t = useT();
  const on3 = ramp(t, v3 - 0.05, v3 + 0.25);
  const B: [string, string][] = [["V1", "ophthalmic"], ["V2", "maxillary"], ["V3", "mandibular"]];
  return (
    <Scene start={s0} end={s1} push={0.008}>
      <div style={{ position: "absolute", left: 20, top: 20, width: 820, height: 880, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, s0 + 0.02, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 38, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 5, color: C.banana }}>ONE NERVE FOR ALL 4</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 96, display: "flex", justifyContent: "center", ...pop(t, Math.min(tri, s0 + 0.3), 0.3) }}>
          <div style={{ background: C.paper, borderRadius: 26, padding: "10px 34px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 54, color: C.forest, whiteSpace: "nowrap" }}>CN V · trigeminal</div>
        </div>
        <svg width={820} height={200} style={{ position: "absolute", left: 0, top: 186 }}>
          {[160, 410, 660].map((x, i) => (
            <path key={x} d={`M 410 0 C 410 60 ${x} 60 ${x} 130`} fill="none" stroke={i === 2 && on3 > 0.5 ? C.banana : "rgba(247,246,236,0.35)"} strokeWidth={i === 2 && on3 > 0.5 ? 12 : 7} strokeLinecap="round" />
          ))}
        </svg>
        <div style={{ position: "absolute", left: 30, width: 760, top: 318, display: "flex", justifyContent: "space-between" }}>
          {B.map(([k, n], i) => {
            const hot = i === 2 && on3 > 0.5;
            return (
              <div key={k} style={{ width: 230, height: 120, borderRadius: 24, background: hot ? C.banana : "rgba(247,246,236,0.1)", border: `4px solid ${hot ? C.paper : "rgba(247,246,236,0.25)"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${hot ? 1.08 : 1})`, opacity: i === 2 ? 1 : 1 - 0.5 * on3, ...pop(t, s0 + 0.2 + i * 0.1, 0.25) }}>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 52, color: hot ? C.forest : C.paper, lineHeight: 1 }}>{k}</div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 28, color: hot ? C.forest : "#B9D27A" }}>{n}</div>
              </div>
            );
          })}
        </div>
        <svg width={820} height={140} style={{ position: "absolute", left: 0, top: 438, opacity: on3 }}>
          {[130, 310, 490, 670].map((x, i) => (
            <path key={x} d={`M 676 0 C 676 60 ${x} 50 ${x} 120`} fill="none" stroke={C.banana} strokeWidth={8} strokeLinecap="round" strokeDasharray="600" strokeDashoffset={600 * (1 - ramp(t, v3 + 0.1 + i * 0.12, v3 + 0.5 + i * 0.12))} />
          ))}
        </svg>
        <div style={{ position: "absolute", left: 30, width: 760, top: 566, display: "flex", justifyContent: "space-between" }}>
          {JORDER.map((m, i) => (
            <div key={m} style={{ width: 170, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, ...pop(t, v3 + 0.4 + i * 0.12, 0.25) }}>
              <LChip l={JLET[m]} size={86} col={JCOL(m)} />
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 25, color: C.paper, textAlign: "center", lineHeight: 1.1 }}>{JNAME[m].replace(" pterygoid", "\npterygoid").split("\n").map((x, j) => <div key={j}>{x}</div>)}</div>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 30, width: 760, top: 780, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 32, color: "#B9D27A", opacity: ramp(t, v3 + 1.0, v3 + 1.3) }}>
          V3 = the only branch of CN V that moves muscles
        </div>
      </div>
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
        <div style={{ position: "absolute", left: 30, width: 760, top: 100, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 60, lineHeight: 1.1, color: C.paper, ...pop(t, q) }}>
          Which one helps you <span style={{ color: C.banana }}>OPEN</span> your mouth?
        </div>
        <div style={{ position: "absolute", left: 60, top: 300, width: 700, display: "flex", flexDirection: "column", gap: 18 }}>
          {(["TE", "LP", "MA", "MP"] as JM[]).map((m, i) => (
            <div key={m} style={{ height: 80, borderRadius: 22, background: "rgba(247,246,236,0.08)", border: "3px solid rgba(247,246,236,0.18)", display: "flex", alignItems: "center", gap: 16, padding: "0 16px", boxSizing: "border-box", ...pop(t, q + 0.5 + i * 0.08, 0.25) }}>
              <div style={{ width: 54, height: 54, borderRadius: 27, background: "rgba(247,246,236,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.banana }}>{"ABCD"[i]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.paper, whiteSpace: "nowrap" }}>{JNAME[m]}</div>
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

/* 5. Answer on our diagram: lateral pterygoid lit, FORWARD + OPEN arrows */
export const V5: React.FC<{ s0: number; s1: number }> = ({ s0, s1 }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.006}>
      <div style={center(14, pop(t, s0 + 0.05, 0.25))}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, background: "#2F7DB8", border: `4px solid ${C.forest}`, borderRadius: 26, padding: "10px 26px 14px 12px" }}>
          <LChip l="L" size={72} col={C.forest} />
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.paper, whiteSpace: "nowrap" }}>✓ Lateral pterygoid</div>
        </div>
      </div>
      <JawBox t={t} top={128} h={700} id="v5" ks={[[s0, 1.12, 430, 700], [s1, 1.17, 420, 705]]}
        lit={{ LP: s0 - 1 }} hot={["LP"]} peel={1} fwd={ramp(t, s0 + 0.15, s0 + 0.5)} open={ramp(t, s0 + 0.45, s0 + 0.8)} dimSup={1} />
      <div style={center(846, pop(t, s0 + 0.5, 0.25))}>
        <Pill size={40} bg={C.banana} color={C.forest}>Lateral = Lowers the jaw</Pill>
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
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.matcha, letterSpacing: 2 }}>MUSCLES OF MASTICATION · ALL CN V3</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest, marginTop: 8, whiteSpace: "nowrap" }}>3 close ↑ + 1 opens ↓</div>
        <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 34 }}>
          {JORDER.map((m, i) => (
            <div key={m} style={{ display: "flex", alignItems: "center", gap: 16, opacity: ramp(t, s0 + 0.2 + i * 0.06, s0 + 0.4 + i * 0.06) }}>
              <LChip l={JLET[m]} size={78} col={JCOL(m)} />
              <div>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.forest, whiteSpace: "nowrap", lineHeight: 1.05 }}>{JNAME[m]}</div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 28, color: m === "LP" ? "#2F7DB8" : C.red, whiteSpace: "nowrap" }}>{JACT[m]}</div>
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

/* TikTok: the 4 muscles on our diagram, named as they are said */
export const TT2: React.FC<{ s0: number; s1: number; ma: number; te: number; peel: number; mp: number; lp: number }> = ({ s0, s1, ma, te, peel, mp, lp }) => {
  const t = useT();
  const pe = ramp(t, peel, peel + 0.6);
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(20, pop(t, s0 + 0.05, 0.25))}>
        <Closers t={t} times={[["MA", ma], ["TE", te], ["MP", mp], ["LP", lp]]} label="4 CHEWING MUSCLES" col={C.matcha} />
      </div>
      <JawBox t={t} top={130} h={712} id="tt2" ks={[[s0, 0.74, 520, 520], [te, 0.76, 540, 470], [peel, 0.8, 540, 560], [mp, 1.3, 560, 680], [s1, 1.35, 560, 690]]}
        lit={{ MA: ma, TE: te, MP: mp, LP: lp }} hot={t >= lp - 0.05 ? ["LP"] : t >= mp - 0.05 ? ["MP"] : t >= te - 0.05 ? ["TE"] : ["MA"]} peel={pe} />
      <NameCard t={t} top={866} times={[["MA", ma], ["TE", te], ["MP", mp], ["LP", lp]]} />
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
