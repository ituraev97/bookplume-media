import React from "react";
import { C, FONT, Pill, Scene, ramp, useT } from "./kit";
import { Big, pop } from "./Scenes67";
import { Loud, PlateQ, QS } from "./Scenes93";
import { Chip } from "./Portal99";
import { Arm, MANCH, MCOL, MK, MNAME } from "./Arm106";

export const P411 = "plates/arm411.png";
export const A411 = 1819 / 1773;
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* hook target on Gray's Fig. 411: the brachialis just above the elbow, lateral to the biceps tendon.
   "?" sticker over its printed name (rotated along the muscle). */
export const HOOKPIN = { x: 0.792, y: 0.872 };
export const hookStick = (off: number): QS[] => [{ x0: 0.722, y0: 0.852, x1: 0.864, y1: 0.884, rot: 58.6, off }];
/* every printed muscle name in the arm (carousel / pin): coraco-brachialis, short head, long head, biceps brachii, brachialis */
export const ALLSTICK: QS[] = [
  { x0: 0.404, y0: 0.228, x1: 0.596, y1: 0.262, rot: 60, off: 99 },
  { x0: 0.532, y0: 0.315, x1: 0.657, y1: 0.349, rot: 61, off: 99 },
  { x0: 0.609, y0: 0.307, x1: 0.728, y1: 0.34, rot: 62, off: 99 },
  { x0: 0.68, y0: 0.528, x1: 0.795, y1: 0.592, rot: 0, off: 99 },
  ...hookStick(99),
];

export type Tm = { reveal: number; ticks: number[]; draws: number; hookEnd: number };
export const TM_MAIN: Tm = { reveal: 3.79, ticks: [2.0, 2.6, 3.2], draws: 4.63, hookEnd: 6.0 };
export const TM_TT: Tm = TM_MAIN;

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

/* 1. Quiz hook: Gray's Fig. 411 lower arm, red pin on the brachialis from frame 1, "?" over its printed name, 3-2-1, reveal */
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
          <div style={{ background: "#E5251A", border: "7px solid #111", borderRadius: 18, padding: "0 22px 6px", transform: "rotate(-2deg)" }}><Loud size={84}>MUSCLE</Loud></div>
          <Loud size={60}>IN 3 SEC</Loud>
        </div>
      </div>
      {rv > 0 && (
        <div style={center(10, pop(t, R, 0.3))}>
          <div style={{ textAlign: "center" }}>
            <Big size={92} color={C.forest}>✓ BRACHIALIS</Big>
            <div style={{ height: 14 }} />
            <div style={{ display: "flex", justifyContent: "center", ...pop(t, tm.draws, 0.3) }}>
              <Pill size={40} bg={C.red} color={C.paper}>hiding under your biceps</Pill>
            </div>
          </div>
        </div>
      )}
      <PlateQ src={P411} aspect={A411} x={30} y={262} w={800} h={640} a={-0.6} b={tm.hookEnd} from={[0.74, 0.74, 0.6]} to={[0.765, 0.8, 0.5]}
        pin={{ ...HOOKPIN, t0: -1, t1: R + 0.2, r: 70 }} stickers={[{ x0: 0.68, y0: 0.528, x1: 0.795, y1: 0.592, rot: 0, off: R }, ...hookStick(R)]}
        labels={[
          { x: 0.79, y: 0.875, text: "brachialis", t: R + 0.02, hot: true, ox: -190, oy: -60 },
          { x: 0.735, y: 0.66, text: "biceps", t: tm.draws + 0.1, ox: -170, oy: 30 },
        ]} ls={42} />
      <div style={{ position: "absolute", left: 40, top: 700 }}>
        <Ring t={t} size={170} tm={tm} />
      </div>
      <div style={center(898, pop(t, 0.05, 0.25))}>
        {t < R ? <Pill size={34} bg={C.forest}>anatomy quiz · + 2 more after it</Pill> : (
          <div style={{ ...pop(t, R + 0.4, 0.25) }}><Pill size={36} bg={C.banana} color={C.forest}>front of the arm · mnemonic</Pill></div>
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
export const ABox: React.FC<{ t: number; ks: Kf[]; top: number; h: number; id: string; tags?: Tag[]; note?: string; x?: number; bw?: number } & Omit<React.ComponentProps<typeof Arm>, "w" | "id" | "t">> = ({ t, ks, top, h, id, tags = [], note = "right arm, front view · Book Plume diagram", x = 0, bw = 860, ...rest }) => {
  const [, s, cx, cy] = cam(t, ks);
  const X0 = bw / 2 - cx * s, Y0 = h / 2 - cy * s;
  return (
    <div style={{ position: "absolute", left: x, top, width: bw, height: h, overflow: "hidden", borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}` }}>
      <div style={{ position: "absolute", left: X0, top: Y0 }}>
        <Arm t={t} w={700 * s} id={id} {...rest} />
      </div>
      {tags.map(({ a, t: t0, dx, dy, size, t1, col, text }) => {
        const p = ramp(t, t0 - 0.05, t0 + 0.2) * (t1 === undefined ? 1 : 1 - ramp(t, t1, t1 + 0.2));
        if (p <= 0) return null;
        const [ax, ay] = MANCH[a];
        const px = X0 + ax * s, py = Y0 + ay * s;
        return (
          <React.Fragment key={a + text}>
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: p }} width={1} height={1}>
              <line x1={px} y1={py} x2={px + dx} y2={py + dy} stroke={C.paper} strokeWidth={9} strokeLinecap="round" />
              <line x1={px} y1={py} x2={px + dx} y2={py + dy} stroke={C.forest} strokeWidth={4.5} strokeLinecap="round" />
              <circle cx={px} cy={py} r={9} fill={col} stroke={C.forest} strokeWidth={3.5} />
            </svg>
            <Chip x={px + dx} y={py + dy} p={p} col={col} size={size}>{text}</Chip>
          </React.Fragment>
        );
      })}
      {note && <div style={{ position: "absolute", left: 18, top: 16, fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.forest, background: "rgba(255,254,246,0.9)", borderRadius: 12, padding: "4px 12px" }}>{note}</div>}
    </div>
  );
};
const tg = (k: MK, a: string, t: number, dx: number, dy: number, size = 36, t1?: number, text?: string): Tag => ({ a, t, dx, dy, col: k === "NV" ? "#B58A00" : MCOL[k], text: text ?? MNAME[k], size, t1 });

const Banner: React.FC<{ k: MK; letter: string; name: string; sub: string; tSub: number; t: number }> = ({ k, letter, name, sub, tSub, t }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 18, background: MCOL[k], border: `4px solid ${C.forest}`, borderRadius: 26, padding: "6px 26px 12px", fontFamily: FONT, fontWeight: 800, color: C.paper, whiteSpace: "nowrap" }}>
    <span style={{ fontSize: 60, color: C.banana }}>{letter}</span>
    <span style={{ fontSize: name.length > 12 ? 46 : 58 }}>{name}</span>
    <span style={{ fontSize: 36, ...pop(t, tSub, 0.25) }}>{sub}</span>
  </div>
);

/* 2. Mnemonic card: B · B · C */
export const V2: React.FC<{ s0: number; s1: number; title: number; b1: number; b2: number; c: number }> = ({ s0, s1, title, b1, b2, c }) => {
  const t = useT();
  const TILES: [MK, string, string, number][] = [["BI", "B", "Biceps", b1], ["BR", "B", "Brachialis", b2], ["CB", "C", "Coraco-\nbrachialis", c]];
  return (
    <Scene start={s0} end={s1} push={0.006}>
      <div style={{ position: "absolute", left: 20, top: 20, width: 820, height: 860, borderRadius: 48, background: C.forest, ...pop(t, s0 + 0.02, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 50, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 7, color: "#B9D27A", ...pop(t, title, 0.25) }}>FRONT OF THE ARM =</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 150, display: "flex", justifyContent: "center", gap: 34 }}>
          {TILES.map(([k, L, nm, t0], i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22, ...pop(t, t0, 0.3) }}>
              <div style={{ width: 220, height: 260, borderRadius: 40, background: MCOL[k], border: `8px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 200, color: C.paper, lineHeight: 1, boxShadow: "0 12px 0 rgba(0,0,0,0.35)" }}>{L}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper, textAlign: "center", lineHeight: 1.1, whiteSpace: "pre" }}>
                <span style={{ background: C.banana, color: C.forest, borderRadius: 10, padding: "0 6px 2px" }}>{nm[0]}</span>{nm.slice(1)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 640, display: "flex", justifyContent: "center", ...pop(t, c + 0.2, 0.25) }}>
          <div style={{ background: C.banana, color: C.forest, borderRadius: 40, padding: "14px 40px 18px", fontFamily: FONT, fontWeight: 800, fontSize: 46 }}>3 muscles · 1 nerve</div>
        </div>
      </div>
    </Scene>
  );
};

/* 3. Biceps on Gray's Fig. 411: 2 heads → 1 belly */
export const V3: React.FC<{ s0: number; s1: number; bi: number; long: number; short: number }> = ({ s0, s1, bi, long, short }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, pop(t, s0 + 0.03, 0.25))}>
        <Banner k="BI" letter="B" name="BICEPS" sub="· 2 heads" tSub={long} t={t} />
      </div>
      <PlateQ src={P411} aspect={A411} x={30} y={124} w={800} h={756} a={s0} b={s1} from={[0.66, 0.5, 0.66]} to={[0.64, 0.42, 0.58]} ls={36}
        labels={[
          { x: 0.745, y: 0.66, text: "biceps brachii", t: bi + 0.05, hot: true, ox: -200, oy: -90 },
          { x: 0.672, y: 0.4, text: "long head", t: long, hot: true, ox: 170, oy: -60 },
          { x: 0.6, y: 0.36, text: "short head", t: short, hot: true, ox: -120, oy: -110 },
        ]} />
      <div style={center(892, {})}>
        {t < short + 0.3 ? <div style={pop(t, bi + 0.3, 0.25)}><Pill size={36} bg={MCOL.BI} color={C.paper}>on top · the one you can see</Pill></div>
          : <div style={pop(t, short + 0.3, 0.25)}><Pill size={36} bg={C.banana} color={C.forest}>long head + short head → 1 belly</Pill></div>}
      </div>
    </Scene>
  );
};

/* 4. Brachialis on our map: lift the biceps, the brachialis is underneath, pure elbow flexor */
export const V4: React.FC<{ s0: number; s1: number; br: number; bends: number }> = ({ s0, s1, br, bends }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, pop(t, s0 + 0.03, 0.25))}>
        <Banner k="BR" letter="B" name="BRACHIALIS" sub="· underneath" tSub={br + 0.4} t={t} />
      </div>
      <ABox t={t} top={124} h={756} id="v4" ks={[[s0, 0.72, 350, 520], [br + 0.6, 0.82, 350, 600], [s1, 0.85, 350, 620]]}
        lit={{ BI: s0 - 1, BR: br, CB: s0 - 1 }} hot={["BR"]} dimRest={0.4} lift={ramp(t, br, br + 0.5)}
        tags={[tg("BR", "BR", br + 0.2, 150, 60, 40), tg("BI", "BI", s0 + 0.1, -190, -40, 32, br + 0.3, "biceps (lifted)")]} />
      <div style={center(892, {})}>
        {t < bends ? <div style={pop(t, br + 0.5, 0.25)}><Pill size={36} bg={MCOL.BR} color={C.paper}>under the biceps → onto the ulna</Pill></div>
          : <div style={pop(t, bends, 0.25)}><Pill size={38} bg={C.banana} color={C.forest}>job: bends the elbow · nothing else</Pill></div>}
      </div>
    </Scene>
  );
};

/* 5. Coracobrachialis on Gray's Fig. 411: coracoid process → humerus */
export const V5: React.FC<{ s0: number; s1: number; cb: number; cor: number; hum: number }> = ({ s0, s1, cb, cor, hum }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, pop(t, s0 + 0.03, 0.25))}>
        <Banner k="CB" letter="C" name="CORACOBRACHIALIS" sub="" tSub={cb} t={t} />
      </div>
      <PlateQ src={P411} aspect={A411} x={30} y={124} w={800} h={756} a={s0} b={s1} from={[0.5, 0.24, 0.56]} to={[0.48, 0.22, 0.48]} ls={36}
        labels={[
          { x: 0.5, y: 0.25, text: "coracobrachialis", t: cb + 0.05, hot: true, ox: -40, oy: 230 },
          { x: 0.43, y: 0.125, text: "coracoid process", t: cor, ox: 60, oy: -70 },
        ]} />
      <div style={center(892, {})}>
        {t < hum ? <div style={pop(t, cb + 0.4, 0.25)}><Pill size={36} bg={MCOL.CB} color={C.paper}>up high, near the armpit</Pill></div>
          : <div style={pop(t, hum, 0.25)}><Pill size={38} bg={C.banana} color={C.forest}>coracoid → middle of the humerus</Pill></div>}
      </div>
    </Scene>
  );
};

/* 6. One-picture map: all 3 + the musculocutaneous nerve (held ≥ 1.5 s) */
export const V6: React.FC<{ s0: number; s1: number; nv: number; nvDone: number; all: number }> = ({ s0, s1, nv, nvDone, all }) => {
  const t = useT();
  const nerve = ramp(t, nv, nvDone);
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, pop(t, s0 + 0.03, 0.25))}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, background: C.forest, borderRadius: 26, padding: "8px 26px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.paper, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 62, color: C.banana }}>1</span> NERVE · ALL <span style={{ fontSize: 62, color: C.banana }}>3</span>
        </div>
      </div>
      <ABox t={t} top={124} h={756} id="v6" note="" ks={[[s0, 0.8, 360, 560], [s1, 0.78, 360, 560]]}
        lit={{ BI: s0 - 1, BR: s0 - 1, CB: s0 - 1 }} hot={t >= nvDone ? [] : ["NV"]} dimRest={0.25} lift={0.5} nerve={nerve}
        tags={[
          tg("BI", "BI", s0 + 0.1, 190, 80, 30, undefined, "biceps"),
          tg("BR", "BRL", s0 + 0.2, -150, 40, 30),
          tg("CB", "CB", s0 + 0.3, 170, -60, 30),
          tg("NV", "NV", nv + 0.5, -110, 140, 30, undefined, "musculocutaneous n."),
        ]} />
      <div style={center(892, {})}>
        {t < all ? <div style={pop(t, nv + 0.3, 0.25)}><Pill size={36} bg="#B58A00" color={C.paper}>it pierces the coracobrachialis ⭕</Pill></div>
          : <div style={pop(t, all, 0.25)}><Pill size={36} bg={C.banana} color={C.forest}>📸 screenshot this map</Pill></div>}
      </div>
    </Scene>
  );
};

/* 7. Quick test with 3-2-1 */
export const V7: React.FC<{ s0: number; s1: number; q: number; cd: [number, number][] }> = ({ s0, s1, q, cd }) => {
  const t = useT();
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < s1) { n = v; n0 = s; } });
  const OPTS: [MK, string][] = [["BI", "Biceps"], ["BR", "Brachialis"], ["CB", "Coracobrachialis"]];
  return (
    <Scene start={s0} end={s1}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, s0 + 0.05, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 42, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 30, width: 760, top: 100, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 58, lineHeight: 1.1, color: C.paper, ...pop(t, q) }}>
          Which one also turns your <span style={{ color: C.banana }}>palm up</span>?
        </div>
        <div style={{ position: "absolute", left: 60, top: 310, width: 700, display: "flex", flexDirection: "column", gap: 22 }}>
          {OPTS.map(([k, nm], i) => (
            <div key={nm} style={{ height: 96, borderRadius: 24, background: "rgba(247,246,236,0.08)", border: "3px solid rgba(247,246,236,0.18)", display: "flex", alignItems: "center", gap: 18, padding: "0 18px", boxSizing: "border-box", ...pop(t, q + 0.5 + i * 0.08, 0.25) }}>
              <div style={{ width: 60, height: 60, borderRadius: 30, background: "rgba(247,246,236,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.banana }}>{"ABC"[i]}</div>
              <div style={{ width: 20, height: 60, borderRadius: 10, background: MCOL[k] }} />
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 48, color: C.paper, whiteSpace: "nowrap" }}>{nm}</div>
              <div style={{ marginLeft: "auto", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.banana }}>?</div>
            </div>
          ))}
        </div>
        {n !== null ? (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 660, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 150, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        ) : (
          <div style={{ position: "absolute", left: 0, width: 820, top: 730, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#B9D27A", opacity: ramp(t, q + 1.0, q + 1.2) }}>pause · say it out loud</div>
        )}
      </div>
    </Scene>
  );
};

/* 8. Answer: biceps on our map */
export const V8: React.FC<{ s0: number; s1: number; a: number }> = ({ s0, s1, a }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, pop(t, s0 + 0.05, 0.25))}>
        <div style={{ background: "#E5251A", border: `4px solid ${C.forest}`, borderRadius: 26, padding: "10px 30px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.paper, whiteSpace: "nowrap" }}>✓ A · Biceps</div>
      </div>
      <ABox t={t} top={124} h={756} id="v8" ks={[[s0, 0.8, 350, 560], [s1, 0.9, 345, 600]]}
        lit={{ BI: s0 - 1, BR: s0 - 1, CB: s0 - 1 }} hot={["BI"]} dimRest={0.5} heads={0}
        tags={[tg("BI", "RT", a + 0.2, -170, 110, 32, undefined, "→ radius: twists it palm up")]} />
      <div style={center(892, pop(t, a + 0.4, 0.25))}>
        <Pill size={36} bg={C.banana} color={C.forest}>biceps = bends the elbow + supinates</Pill>
      </div>
    </Scene>
  );
};

/* 9. end card: save (≤ 1.5 s) */
export const V9: React.FC<{ s0: number; s1: number }> = ({ s0, s1 }) => {
  const t = useT();
  const ROWS: [MK, string, string][] = [["BI", "Biceps", "2 heads · elbow + palm up"], ["BR", "Brachialis", "underneath · elbow only"], ["CB", "Coracobrachialis", "coracoid → humerus"], ["NV", "Musculocut. n.", "supplies all 3"]];
  return (
    <Scene start={s0} end={s1}>
      <div style={{ position: "absolute", left: 30, top: 20, width: 800, height: 860, borderRadius: 44, background: C.forest, ...pop(t, s0 + 0.02, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 800, top: 40, textAlign: "center" }}><Loud size={84}>SAVE THIS</Loud></div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 142, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: "#B9D27A" }}>front of the arm = B · B · C</div>
        <div style={{ position: "absolute", left: 40, top: 210, width: 720, display: "flex", flexDirection: "column", gap: 16 }}>
          {ROWS.map(([k, nm, b], i) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 18, background: "rgba(247,246,236,0.08)", borderRadius: 24, padding: 12, ...pop(t, s0 + 0.08 + i * 0.06, 0.22) }}>
              <div style={{ width: 300, height: 76, borderRadius: 20, background: k === "NV" ? "#B58A00" : MCOL[k], display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: nm.length > 12 ? 30 : 36, color: C.paper, whiteSpace: "nowrap" }}>{nm}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 29, color: C.paper, lineHeight: 1.2 }}>{b}</div>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 700, display: "flex", justifyContent: "center", ...pop(t, s0 + 0.3, 0.25) }}>
          <div style={{ background: C.banana, color: C.forest, borderRadius: 50, padding: "14px 44px", fontFamily: FONT, fontWeight: 800, fontSize: 42 }}>🔖 SAVE THIS · + FOLLOW</div>
        </div>
      </div>
    </Scene>
  );
};

/* TikTok: one map — biceps / brachialis / coracobrachialis light up, then the nerve */
export const TTDiag: React.FC<{ s0: number; s1: number; bi: number; br: number; cb: number; nv: number; nvDone: number }> = ({ s0, s1, bi, br, cb, nv, nvDone }) => {
  const t = useT();
  const hot: MK[] = t >= nv - 0.05 ? (t >= nvDone + 0.3 ? [] : ["NV"]) : t >= cb - 0.05 ? ["CB"] : t >= br - 0.05 ? ["BR"] : ["BI"];
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, pop(t, s0 + 0.03, 0.25))}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, background: C.forest, borderRadius: 26, padding: "8px 26px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.paper, whiteSpace: "nowrap" }}>
          FRONT OF THE ARM = <span style={{ color: C.banana }}>B · B · C</span>
        </div>
      </div>
      <ABox note="" t={t} top={124} h={756} id="tt" ks={[[s0, 0.95, 350, 470], [cb - 0.1, 0.9, 350, 520], [cb + 0.5, 0.8, 360, 380], [nv + 0.2, 0.72, 350, 560], [s1, 0.72, 350, 560]]}
        lit={{ BI: bi, BR: br, CB: cb }} hot={hot} dimRest={0.4} lift={ramp(t, br, br + 0.4) * 0.6} nerve={ramp(t, nv, nvDone)}
        tags={[tg("BI", "BI", bi, 190, 60, 34, undefined, "biceps"), tg("BR", "BRL", br + 0.1, -150, 50, 34), tg("CB", "CB", cb + 0.1, 170, -70, 32), tg("NV", "NV", nv + 0.5, -110, 140, 30, undefined, "musculocutaneous n.")]} />
      <div style={center(892, {})}>
        {t < nv ? <div style={pop(t, bi + 0.1, 0.25)}><Pill size={36} bg={C.banana} color={C.forest}>Biceps · Brachialis · Coracobrachialis</Pill></div>
          : <div style={pop(t, nv, 0.25)}><Pill size={36} bg="#B58A00" color={C.paper}>1 nerve runs all 3</Pill></div>}
      </div>
    </Scene>
  );
};
