import React from "react";
import { C, FONT, Pill, Scene, ramp, useT } from "./kit";
import { Big, pop } from "./Scenes67";
import { Loud, PlateQ, QS } from "./Scenes93";
import { Chip } from "./Portal99";
import { CANCH, CCOL, CK, Calf } from "./Calf104";

export const P438 = "plates/calf438.png";
export const A438 = 830 / 2640;
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* Gray's Fig. 438 (right leg from behind, superficial layer; gastrocnemius cut and turned up).
   Targets (fractions of the crop): soleus belly, gastrocnemius heads, tendo calcaneus. "?" stickers over printed names. */
export const SOLPIN = { x: 0.56, y: 0.44 };
export const solStick = (off: number): QS[] => [{ x0: 0.395, y0: 0.49, x1: 0.69, y1: 0.52, rot: 0, off }];
export const GASPIN = { x: 0.47, y: 0.262 };
export const gasStick = (off: number): QS[] => [
  { x0: 0.325, y0: 0.213, x1: 0.675, y1: 0.239, rot: 0, off },
  { x0: 0.285, y0: 0.239, x1: 0.445, y1: 0.27, rot: 0, off },
  { x0: 0.515, y0: 0.239, x1: 0.675, y1: 0.27, rot: 0, off },
];
export const ATPIN = { x: 0.405, y: 0.725 };
export const atStick = (off: number): QS[] => [
  { x0: 0.335, y0: 0.808, x1: 0.465, y1: 0.834, rot: 0, off },
  { x0: 0.325, y0: 0.851, x1: 0.49, y1: 0.878, rot: 0, off },
];

export type Tm = { reveal: number; ticks: number[]; hookEnd: number };
export const TM_MAIN: Tm = { reveal: 3.78, ticks: [2.05, 2.65, 3.25], hookEnd: 5.75 };

export const Ring: React.FC<{ t: number; size: number; reveal: number; ticks: number[]; late?: boolean }> = ({ t, size, reveal: REVEAL, ticks: TICKS, late }) => {
  if (t > REVEAL + 0.25) return null;
  if (late && t < TICKS[0] - 0.75) return null;
  const N = TICKS.length;
  const k = ramp(t, TICKS[0] - 0.6, REVEAL);
  let n = N;
  TICKS.forEach((s, i) => { if (t >= s) n = N - i; });
  const cur = TICKS[N - n] ?? 0;
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

const Note: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 16px 10px", fontFamily: FONT, fontWeight: 800, fontSize: 27, color: C.forest, whiteSpace: "nowrap", boxShadow: "0 6px 0 rgba(31,42,20,0.12)", ...style }}>{children}</div>
);

/* 1. Quiz hook: Fig. 438 already visible, red pin on the soleus, "?" over its printed name, 3-2-1, reveal */
export const V1: React.FC<{ tm: Tm }> = ({ tm }) => {
  const t = useT();
  const R = tm.reveal;
  const rv = ramp(t, R, R + 0.25);
  return (
    <Scene start={-0.6} end={tm.hookEnd} push={0.02}>
      <div style={center(0, { opacity: 1 - rv })}>
        <Loud size={112}>NAME THIS</Loud>
      </div>
      <div style={center(118, { opacity: 1 - rv })}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ background: "#E5251A", border: "7px solid #111", borderRadius: 18, padding: "0 22px 6px", transform: "rotate(-2deg)" }}><Loud size={84}>CALF MUSCLE</Loud></div>
          <Loud size={60}>3 SEC</Loud>
        </div>
      </div>
      {rv > 0 && (
        <div style={center(10, pop(t, R, 0.3))}>
          <div style={{ textAlign: "center" }}>
            <Big size={92} color={C.forest}>✓ SOLEUS</Big>
            <div style={{ height: 18 }} />
            <div style={{ display: "flex", justifyContent: "center", ...pop(t, 4.46, 0.3) }}>
              <Pill size={40} bg={CCOL.SO} color={C.paper}>the flat one underneath</Pill>
            </div>
          </div>
        </div>
      )}
      <PlateQ src={P438} aspect={A438} x={230} y={262} w={600} h={630} a={-0.6} b={tm.hookEnd} from={[0.53, 0.46, 1.25]} to={[0.53, 0.44, 1.05]}
        pin={{ ...SOLPIN, t0: -1, t1: R + 0.2, r: 78 }} stickers={solStick(R)}
        labels={[{ x: 0.56, y: 0.44, text: "soleus", t: R + 0.02, hot: true, ox: -60, oy: 170 }]} ls={40} />
      <div style={{ position: "absolute", left: 30, top: 430 }}>
        <Ring t={t} size={170} reveal={R} ticks={tm.ticks} />
      </div>
      <div style={center(898, pop(t, 0.05, 0.25))}>
        {t < R ? <Pill size={34} bg={C.forest}>anatomy quiz · + 2 more after it</Pill> : (
          <div style={{ ...pop(t, R + 0.4, 0.25) }}><Pill size={36} bg={C.banana} color={C.forest}>calf muscles · mnemonic</Pill></div>
        )}
      </div>
    </Scene>
  );
};

/* ---- our diagram in a box with a camera and chips ---- */
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
export type Tag = { a: string; t: number; dx: number; dy: number; col: string; text: string; size?: number; t1?: number };
export const CBox: React.FC<{ t: number; ks: Kf[]; top: number; h: number; id: string; tags?: Tag[]; note?: string } & Omit<React.ComponentProps<typeof Calf>, "w" | "id" | "t">> = ({ t, ks, top, h, id, tags = [], note = "right leg from behind · Book Plume diagram", ...rest }) => {
  const [, s, cx, cy] = cam(t, ks);
  const X0 = 430 - cx * s, Y0 = h / 2 - cy * s;
  return (
    <div style={{ position: "absolute", left: 0, top, width: 860, height: h, overflow: "hidden", borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}` }}>
      <div style={{ position: "absolute", left: X0, top: Y0 }}>
        <Calf t={t} w={700 * s} id={id} {...rest} />
      </div>
      {tags.map(({ a, t: t0, dx, dy, size, t1, col, text }) => {
        const p = ramp(t, t0 - 0.05, t0 + 0.2) * (t1 === undefined ? 1 : 1 - ramp(t, t1, t1 + 0.2));
        if (p <= 0) return null;
        const [ax, ay] = CANCH[a];
        const x = X0 + ax * s, y = Y0 + ay * s;
        return (
          <React.Fragment key={a + text}>
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: p }} width={1} height={1}>
              <line x1={x} y1={y} x2={x + dx} y2={y + dy} stroke={C.paper} strokeWidth={9} strokeLinecap="round" />
              <line x1={x} y1={y} x2={x + dx} y2={y + dy} stroke={C.forest} strokeWidth={4.5} strokeLinecap="round" />
              <circle cx={x} cy={y} r={9} fill={col} stroke={C.forest} strokeWidth={3.5} />
            </svg>
            <Chip x={x + dx} y={y + dy} p={p} col={col} size={size}>{text}</Chip>
          </React.Fragment>
        );
      })}
      {note && <div style={{ position: "absolute", left: 18, top: 16, fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.forest, background: "rgba(255,254,246,0.9)", borderRadius: 12, padding: "4px 12px" }}>{note}</div>}
    </div>
  );
};
const tg = (k: CK, a: string, t: number, dx: number, dy: number, text: string, size = 36, t1?: number): Tag => ({ a, t, dx, dy, col: CCOL[k], text, size, t1 });
const BONE = "#6B6F5E";
const tb = (a: string, t: number, dx: number, dy: number, text: string, size = 30, t1?: number): Tag => ({ a, t, dx, dy, col: BONE, text, size, t1 });

/* the "3 heads → 1 tendon" equation */
const Heads: React.FC<{ t: number; t3: number; t1: number }> = ({ t, t3, t1 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, background: C.forest, borderRadius: 26, padding: "8px 24px 12px", fontFamily: FONT, fontWeight: 800, color: C.paper, whiteSpace: "nowrap" }}>
    <span style={{ fontSize: 46 }}>TRICEPS SURAE</span>
    <span style={{ fontSize: 40, color: C.banana, ...pop(t, t3, 0.25) }}>3 heads</span>
    <span style={{ fontSize: 40, ...pop(t, t1, 0.25) }}>→ 1 tendon</span>
  </div>
);

/* 2. Your calf is a triceps: 3 heads, 1 tendon */
export const V2: React.FC<{ s0: number; s1: number; tri: number; three: number; one: number }> = ({ s0, s1, tri, three, one }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.006}>
      <div style={center(10, pop(t, s0 + 0.03, 0.25))}>
        <Heads t={t} t3={three} t1={one} />
      </div>
      <CBox t={t} top={124} h={756} id="v2" ks={[[s0, 0.62, 350, 760], [s1, 0.58, 350, 760]]}
        lit={{ GM: three, GL: three + 0.12, SO: three + 0.24, AT: one }} hot={t >= one - 0.05 ? ["AT"] : t >= three - 0.05 ? ["GM", "GL", "SO"] : []} dimRest={0.35} flow={ramp(t, one, one + 0.3)}
        tags={[tg("GM", "GM", three, -130, -40, "1", 44), tg("GL", "GL", three + 0.12, 130, -40, "2", 44), tg("SO", "SO", three + 0.24, 150, 30, "3", 44), tg("AT", "AT", one, 170, 20, "1 tendon", 38)]} />
      <div style={center(892, pop(t, tri, 0.25))}>
        <Pill size={36} bg={C.banana} color={C.forest}>surae = Latin “of the calf”</Pill>
      </div>
    </Scene>
  );
};

/* 3. Gastrocnemius: 2 heads from the femur's condyles */
export const V3: React.FC<{ s0: number; s1: number; g: number; two: number; femur: number }> = ({ s0, s1, g, two, femur }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, pop(t, s0 + 0.03, 0.25))}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, background: CCOL.GM, border: `4px solid ${C.forest}`, borderRadius: 26, padding: "6px 26px 12px", fontFamily: FONT, fontWeight: 800, color: C.paper, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 56 }}>GASTROCNEMIUS</span>
          <span style={{ fontSize: 40, ...pop(t, two, 0.25) }}>= 2 heads</span>
        </div>
      </div>
      <CBox t={t} top={124} h={756} id="v3" ks={[[s0, 0.95, 350, 620], [femur - 0.2, 1.1, 350, 520], [s1, 1.25, 350, 420]]}
        lit={{ GM: g, GL: g, SO: s0 - 1, AT: s0 - 1 }} hot={["GM", "GL"]} dimRest={0.5} bones={ramp(t, femur, femur + 0.3)}
        tags={[tg("GM", "GM", two, -120, 120, "medial head", 34), tg("GL", "GL", two + 0.1, 110, 140, "lateral head", 34),
          tb("MCON", femur, -150, -110, "femur · medial condyle", 28), tb("LCON", femur + 0.1, 150, -150, "lateral condyle", 28)]} />
      <div style={center(892, pop(t, femur + 0.2, 0.25))}>
        <Pill size={36} bg={CCOL.GM} color={C.paper}>starts above the knee</Pill>
      </div>
    </Scene>
  );
};

/* 4. Soleus: the 3rd head, from tibia + fibula (gastrocnemius fades to show it) */
export const V4: React.FC<{ s0: number; s1: number; so: number; tib: number; fib: number }> = ({ s0, s1, so, tib, fib }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, pop(t, s0 + 0.03, 0.25))}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, background: CCOL.SO, border: `4px solid ${C.forest}`, borderRadius: 26, padding: "6px 26px 12px", fontFamily: FONT, fontWeight: 800, color: C.paper, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 60 }}>SOLEUS</span>
          <span style={{ fontSize: 40, ...pop(t, so + 0.4, 0.25) }}>= head 3</span>
        </div>
      </div>
      <CBox t={t} top={124} h={756} id="v4" ks={[[s0, 0.95, 350, 640], [s1, 0.9, 350, 700]]}
        lit={{ GM: s0 - 1, GL: s0 - 1, SO: so, AT: s0 - 1 }} hot={["SO"]} dimRest={0.5} gas={1 - 0.88 * ramp(t, so, so + 0.6)} bones={ramp(t, tib - 0.2, tib + 0.2)}
        tags={[tg("SO", "SO", so + 0.3, 150, 40, "soleus", 40), tb("TIB", tib, -150, 60, "tibia", 34), tb("FIB", fib, 150, -80, "fibula", 34)]} />
      <div style={center(892, pop(t, tib, 0.25))}>
        <Pill size={36} bg={CCOL.SO} color={C.paper}>starts BELOW the knee · under gastrocnemius</Pill>
      </div>
    </Scene>
  );
};

/* 5. Achilles on Gray's Fig. 438 + 1918 name */
export const V5: React.FC<{ s0: number; s1: number; at: number; thick: number }> = ({ s0, s1, at, thick }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, pop(t, s0 + 0.03, 0.25))}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, background: CCOL.AT, border: `4px solid ${C.forest}`, borderRadius: 26, padding: "6px 26px 12px", fontFamily: FONT, fontWeight: 800, color: C.paper, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 50 }}>3 HEADS →</span>
          <span style={{ fontSize: 56, ...pop(t, at, 0.25) }}>ACHILLES</span>
        </div>
      </div>
      <PlateQ src={P438} aspect={A438} x={130} y={124} w={600} h={756} a={s0} b={s1} from={[0.42, 0.62, 1.15]} to={[0.42, 0.72, 0.95]} ls={36}
        labels={[
          { x: 0.42, y: 0.70, text: "Achilles tendon", t: at, hot: true, ox: -20, oy: -170 },
          { x: 0.3, y: 0.93, text: "calcaneus (heel)", t: at + 0.5, ox: 200, oy: 0 },
        ]} />
      <div style={{ position: "absolute", left: 20, top: 150, ...pop(t, at + 0.35, 0.3) }}>
        <Note><span style={{ color: C.matcha }}>1918 atlas name:</span> “tendo calcaneus”</Note>
      </div>
      <div style={center(892, pop(t, thick, 0.25))}>
        <Pill size={38} bg={C.banana} color={C.forest}>💪 the thickest tendon in your body</Pill>
      </div>
    </Scene>
  );
};

/* 6. Plantaris + the complete map (all labelled, held ≥ 1.5 s) */
export const V6: React.FC<{ s0: number; s1: number; pl: number; all: number }> = ({ s0, s1, pl, all }) => {
  const t = useT();
  const allOn = t >= all - 0.05;
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, pop(t, s0 + 0.03, 0.25))}>
        {!allOn ? (
          <div style={{ display: "flex", alignItems: "center", gap: 18, background: CCOL.PL, border: `4px solid ${C.forest}`, borderRadius: 26, padding: "6px 26px 12px", fontFamily: FONT, fontWeight: 800, color: C.paper, whiteSpace: "nowrap" }}>
            <span style={{ fontSize: 58 }}>PLANTARIS</span><span style={{ fontSize: 40 }}>= bonus</span>
          </div>
        ) : (
          <div style={{ background: C.forest, borderRadius: 26, padding: "8px 28px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 50, color: C.paper, whiteSpace: "nowrap", ...pop(t, all, 0.25) }}>THE CALF · ONE MAP</div>
        )}
      </div>
      <CBox t={t} top={124} h={756} id="v6" note="" ks={[[s0, 1.0, 380, 640], [all - 0.25, 0.95, 370, 680], [all + 0.25, 0.52, 350, 760], [s1, 0.5, 350, 760]]}
        lit={{ GM: s0 - 1, GL: s0 - 1, SO: s0 - 1, AT: s0 - 1, PL: pl }} hot={allOn ? [] : ["PL"]} dimRest={0.55} gas={1 - 0.5 * ramp(t, pl, pl + 0.4) * (1 - ramp(t, all - 0.3, all))}
        tags={[
          tg("PL", "PL", pl + 0.1, 170, 90, "plantaris", 38, all - 0.25), tg("PL", "PLt", pl + 0.5, 190, 120, "long thin tendon", 30, all - 0.25),
          tg("GM", "GM", all + 0.25, -150, -120, "gastrocnemius ×2", 28),
          tg("SO", "SO", all + 0.4, 130, 40, "soleus", 30), tg("AT", "AT", all + 0.5, 150, 40, "Achilles", 30), tg("PL", "PL", all + 0.6, 140, -40, "plantaris", 26),
        ]} />
      <div style={center(892, {})}>
        {!allOn ? <div style={pop(t, pl + 0.9, 0.25)}><Pill size={34} bg={CCOL.PL} color={C.paper}>skinny tendon · missing in about 1 in 10</Pill></div>
          : <div style={pop(t, all + 0.6, 0.25)}><Pill size={36} bg={C.banana} color={C.forest}>📸 screenshot this map</Pill></div>}
      </div>
    </Scene>
  );
};

/* 7. Quick test with 3-2-1 */
export const V7: React.FC<{ s0: number; s1: number; q: number; cd: [number, number][] }> = ({ s0, s1, q, cd }) => {
  const t = useT();
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < s1) { n = v; n0 = s; } });
  const OPTS: [string, string][] = [["Gastrocnemius", CCOL.GM], ["Soleus", CCOL.SO]];
  return (
    <Scene start={s0} end={s1}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, s0 + 0.05, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 42, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 30, width: 760, top: 100, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 60, lineHeight: 1.1, color: C.paper, ...pop(t, q) }}>
          Which one also crosses the <span style={{ color: C.banana }}>knee</span>?
        </div>
        <div style={{ position: "absolute", left: 60, top: 320, width: 700, display: "flex", flexDirection: "column", gap: 26 }}>
          {OPTS.map(([nm, col], i) => (
            <div key={nm} style={{ height: 120, borderRadius: 26, background: "rgba(247,246,236,0.08)", border: "3px solid rgba(247,246,236,0.2)", display: "flex", alignItems: "center", gap: 22, padding: "0 22px", boxSizing: "border-box", ...pop(t, q + 0.55 + i * 0.5, 0.25) }}>
              <div style={{ width: 74, height: 74, borderRadius: 37, background: col, border: `4px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper }}>{"AB"[i]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.paper, whiteSpace: "nowrap" }}>{nm}</div>
              <div style={{ marginLeft: "auto", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.banana }}>?</div>
            </div>
          ))}
        </div>
        {n !== null ? (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 640, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 170, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        ) : (
          <div style={{ position: "absolute", left: 0, width: 820, top: 700, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#B9D27A", opacity: ramp(t, q + 1.6, q + 1.8) }}>pause · say it out loud</div>
        )}
      </div>
    </Scene>
  );
};

/* 8. Answer: gastrocnemius heads start ABOVE the knee (Gray's Fig. 438, popliteal fossa) */
export const V8: React.FC<{ s0: number; s1: number; g: number; so: number }> = ({ s0, s1, g, so }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, pop(t, s0 + 0.05, 0.25))}>
        <div style={{ background: "#E5251A", border: `4px solid ${C.forest}`, borderRadius: 26, padding: "10px 30px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 54, color: C.paper, whiteSpace: "nowrap" }}>✓ A · Gastrocnemius</div>
      </div>
      <PlateQ src={P438} aspect={A438} x={130} y={124} w={600} h={756} a={s0} b={s1} from={[0.48, 0.25, 1.0]} to={[0.48, 0.29, 0.92]} ls={34}
        labels={[
          { x: 0.36, y: 0.26, text: "gastrocnemius", t: g, hot: true, ox: 0, oy: -150 },
          { x: 0.6, y: 0.26, text: "gastrocnemius", t: g + 0.1, hot: true, ox: -60, oy: 130 },
          { x: 0.5, y: 0.15, text: "back of the knee", t: g + 0.5, ox: -20, oy: -70 },
          { x: 0.56, y: 0.42, text: "soleus", t: so, ox: 60, oy: -40 },
        ]} />
      <div style={center(892, pop(t, so + 0.4, 0.25))}>
        <Pill size={34} bg={CCOL.SO} color={C.paper}>soleus = ankle only · gastrocnemius = knee + ankle</Pill>
      </div>
    </Scene>
  );
};

/* 9. end card ≤ 1.5 s: full quiz + save */
export const V9: React.FC<{ s0: number; s1: number }> = ({ s0, s1 }) => {
  const t = useT();
  const ROWS: [CK, string, string][] = [["GM", "gastrocnemius", "2 heads · knee + ankle"], ["SO", "soleus", "head 3 · ankle only"], ["AT", "Achilles", "1 tendon · thickest"], ["PL", "plantaris", "bonus · sometimes missing"]];
  return (
    <Scene start={s0} end={s1}>
      <div style={{ position: "absolute", left: 30, top: 20, width: 800, height: 860, borderRadius: 44, background: C.forest, ...pop(t, s0 + 0.02, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 800, top: 40, textAlign: "center" }}><Loud size={74}>FULL QUIZ</Loud></div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 136, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.banana }}>on our channel · 27 leg muscles</div>
        <div style={{ position: "absolute", left: 40, top: 214, width: 720, display: "flex", flexDirection: "column", gap: 16 }}>
          {ROWS.map(([k, nm, b], i) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 18, background: "rgba(247,246,236,0.08)", borderRadius: 24, padding: 12, ...pop(t, s0 + 0.08 + i * 0.06, 0.22) }}>
              <div style={{ width: 290, height: 76, borderRadius: 20, background: CCOL[k], display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.paper, whiteSpace: "nowrap" }}>{nm}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 29, color: C.paper, lineHeight: 1.2 }}>{b}</div>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 690, display: "flex", justifyContent: "center", ...pop(t, s0 + 0.3, 0.25) }}>
          <div style={{ background: C.banana, color: C.forest, borderRadius: 50, padding: "14px 44px", fontFamily: FONT, fontWeight: 800, fontSize: 42 }}>🔖 SAVE THIS · + FOLLOW</div>
        </div>
      </div>
    </Scene>
  );
};

/* ---------- TikTok RAPID QUIZ: 3 questions on Fig. 438, pin → "?" → 2-1 → answer ---------- */
export type RQ = { s0: number; s1: number; q: number; ticks: number[]; reveal: number; n: number; ask: string; ans: string; col: string;
  view0: [number, number, number]; view1: [number, number, number]; pin: { x: number; y: number }; r: number; stick: (o: number) => QS[]; extra?: { t: number; text: string } };
const Score: React.FC<{ t: number; n: number; reveal: number }> = ({ t, n, reveal }) => (
  <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
    {[1, 2, 3].map((i) => {
      const done = i < n || (i === n && t >= reveal);
      const cur = i === n;
      return (
        <div key={i} style={{ width: 64, height: 64, borderRadius: 32, background: done ? C.banana : cur ? "#E5251A" : "rgba(31,42,20,0.15)", border: "5px solid #111", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: done ? C.forest : "#fff", transform: `scale(${cur ? 1.12 : 1})` }}>{done ? "✓" : i}</div>
      );
    })}
  </div>
);
export const RapidQ: React.FC<RQ & { intro?: boolean }> = (p) => {
  const t = useT();
  const R = p.reveal;
  const rv = ramp(t, R, R + 0.25);
  return (
    <Scene start={p.s0} end={p.s1} push={0.01}>
      <div style={center(0, {})}>
        {p.intro && t < p.q ? (
          <div style={{ textAlign: "center" }}>
            <Loud size={96}>3 CALF</Loud>
            <div style={{ height: 6 }} />
            <div style={{ display: "inline-block", background: "#E5251A", border: "7px solid #111", borderRadius: 18, padding: "0 22px 6px", transform: "rotate(-2deg)" }}><Loud size={76}>QUESTIONS</Loud></div>
          </div>
        ) : rv <= 0 ? (
          <div style={{ textAlign: "center", ...pop(t, p.q, 0.25) }}>
            <div style={{ display: "inline-block", background: "#E5251A", border: "7px solid #111", borderRadius: 18, padding: "0 22px 6px", transform: "rotate(-2deg)" }}><Loud size={64}>{`#${p.n}`}</Loud></div>
            <div style={{ height: 8 }} />
            <Loud size={84}>{p.ask}</Loud>
          </div>
        ) : (
          <div style={{ textAlign: "center", ...pop(t, R, 0.3) }}>
            <Big size={p.ans.length > 9 ? 76 : 96} color={C.forest}>{`✓ ${p.ans}`}</Big>
            {p.extra && t >= p.extra.t - 0.05 && <div style={{ marginTop: 14, display: "flex", justifyContent: "center", ...pop(t, p.extra.t, 0.25) }}><Pill size={40} bg={C.banana} color={C.forest}>{p.extra.text}</Pill></div>}
          </div>
        )}
      </div>
      <PlateQ src={P438} aspect={A438} x={230} y={262} w={600} h={630} a={p.s0} b={p.s1} from={p.view0} to={p.view1}
        pin={{ ...p.pin, t0: p.intro ? -1 : p.s0 + 0.05, t1: R + 0.2, r: p.r }} stickers={p.stick(R)}
        labels={[{ x: p.pin.x, y: p.pin.y, text: p.ans.toLowerCase(), t: R + 0.02, hot: true, ox: p.ans.length > 9 ? -6 : 30, oy: 170 }]} ls={p.ans.length > 9 ? 31 : 40} />
      <div style={{ position: "absolute", left: 30, top: 430 }}>
        <div style={pop(t, p.ticks[0] - 0.75, 0.25)}><Ring t={t} size={170} reveal={R} ticks={p.ticks} late /></div>
      </div>
      <div style={center(898, {})}>
        <Score t={t} n={p.n} reveal={R} />
      </div>
    </Scene>
  );
};

export const TComment: React.FC<{ s0: number; s1: number }> = ({ s0, s1 }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1 + 0.6} push={0.01}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 800, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, s0 + 0.02, 0.3) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.banana, letterSpacing: 2 }}>SOLEUS · GASTROCNEMIUS · ACHILLES</div>
        <div style={{ textAlign: "center" }}>
          <Loud size={104}>COMMENT</Loud>
          <div style={{ height: 14 }} />
          <Loud size={92} color="#FFE04A">YOUR SCORE</Loud>
          <div style={{ height: 14 }} />
          <div style={{ display: "inline-block", background: "#E5251A", border: "7px solid #111", borderRadius: 18, padding: "0 26px 6px", transform: "rotate(-3deg)" }}><Loud size={96}>? / 3</Loud></div>
        </div>
        <svg width={110} height={120} viewBox="0 0 120 130" style={{ transform: `translateY(${Math.abs(Math.sin((t - s0) * 6)) * 16}px)` }}>
          <path d="M 40 6 L 80 6 L 80 66 L 112 66 L 60 124 L 8 66 L 40 66 Z" fill="#E5251A" stroke="#111" strokeWidth={8} strokeLinejoin="round" />
        </svg>
      </div>
    </Scene>
  );
};
