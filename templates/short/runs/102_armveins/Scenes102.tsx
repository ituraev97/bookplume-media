import React from "react";
import { C, FONT, Pill, Scene, ramp, useT } from "./kit";
import { Big, pop } from "./Scenes67";
import { Loud, PlateQ, QS } from "./Scenes93";
import { Chip } from "./Portal99";
import { VANCH, VCOL, VK, VNAME, Veins } from "./Veins102";

export const P574 = "plates/veins574.png";
export const A574 = 1156 / 3007;
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* hook target on Gray's Fig. 574: the median cubital vein (1918 "Vena mediana cubiti") crossing the front of the elbow.
   "?" sticker over its printed name on the right edge. */
export const HOOKPIN = { x: 0.509, y: 0.508 };
export const hookStick = (off: number): QS[] => [{ x0: 0.755, y0: 0.486, x1: 0.995, y1: 0.522, rot: 0, off }];

export type Tm = { reveal: number; ticks: number[]; draws: number; hookEnd: number };
export const TM_MAIN: Tm = { reveal: 3.53, ticks: [1.8, 2.4, 3.0], draws: 5.4, hookEnd: 6.45 };
export const TM_TT: Tm = { reveal: 3.53, ticks: [1.8, 2.4, 3.0], draws: 5.4, hookEnd: 6.45 };

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

const Note: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 16px 10px", fontFamily: FONT, fontWeight: 800, fontSize: 27, color: C.forest, whiteSpace: "nowrap", boxShadow: "0 6px 0 rgba(31,42,20,0.12)", ...style }}>{children}</div>
);

/* 1. Quiz hook: Gray's Fig. 574 elbow, red pin on the median cubital vein from frame 1, "?" over its printed name, 3-2-1, reveal */
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
          <div style={{ background: "#E5251A", border: "7px solid #111", borderRadius: 18, padding: "0 22px 6px", transform: "rotate(-2deg)" }}><Loud size={84}>VEIN</Loud></div>
          <Loud size={60}>IN 3 SEC</Loud>
        </div>
      </div>
      {rv > 0 && (
        <div style={center(10, pop(t, R, 0.3))}>
          <div style={{ textAlign: "center" }}>
            <Big size={80} color={C.forest}>✓ MEDIAN CUBITAL</Big>
            <div style={{ height: 18 }} />
            <div style={{ display: "flex", justifyContent: "center", ...pop(t, tm.draws, 0.3) }}>
              <Pill size={40} bg={C.red} color={C.paper}>the go-to vein for blood draws</Pill>
            </div>
          </div>
        </div>
      )}
      <PlateQ src={P574} aspect={A574} x={30} y={262} w={800} h={640} a={-0.6} b={tm.hookEnd} from={[0.51, 0.512, 0.5]} to={[0.515, 0.505, 0.43]}
        pin={{ ...HOOKPIN, t0: -1, t1: R + 0.2, r: 62 }} stickers={hookStick(R)}
        labels={[{ x: 0.5, y: 0.504, text: "median cubital", t: R + 0.02, hot: true, ox: 40, oy: 150 }]} ls={42} />
      <div style={{ position: "absolute", left: 40, top: 700 }}>
        <Ring t={t} size={170} tm={tm} />
      </div>
      <div style={{ position: "absolute", left: 50, top: 282, ...pop(t, R + 0.55, 0.3) }}>
        <Note><span style={{ color: C.matcha }}>1918 atlas name:</span> “Vena mediana cubiti”</Note>
      </div>
      <div style={center(898, pop(t, 0.05, 0.25))}>
        {t < R ? <Pill size={34} bg={C.forest}>anatomy quiz · + 3 more after it</Pill> : (
          <div style={{ ...pop(t, R + 0.4, 0.25) }}><Pill size={36} bg={C.banana} color={C.forest}>superficial arm veins · mnemonic</Pill></div>
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
export const VBox: React.FC<{ t: number; ks: Kf[]; top: number; h: number; id: string; tags?: Tag[]; note?: string } & Omit<React.ComponentProps<typeof Veins>, "w" | "id" | "t">> = ({ t, ks, top, h, id, tags = [], note = "right arm, palm forward · Book Plume diagram", ...rest }) => {
  const [, s, cx, cy] = cam(t, ks);
  const X0 = 430 - cx * s, Y0 = h / 2 - cy * s;
  return (
    <div style={{ position: "absolute", left: 0, top, width: 860, height: h, overflow: "hidden", borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}` }}>
      <div style={{ position: "absolute", left: X0, top: Y0 }}>
        <Veins t={t} w={700 * s} id={id} {...rest} />
      </div>
      {tags.map(({ a, t: t0, dx, dy, size, t1, col, text }) => {
        const p = ramp(t, t0 - 0.05, t0 + 0.2) * (t1 === undefined ? 1 : 1 - ramp(t, t1, t1 + 0.2));
        if (p <= 0) return null;
        const [ax, ay] = VANCH[a];
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
const tg = (k: VK, a: string, t: number, dx: number, dy: number, size = 36, t1?: number): Tag => ({ a, t, dx, dy, col: VCOL[k], text: VNAME[k], size, t1 });

/* header: 4 dots with names */
const Four: React.FC<{ t: number; on: [VK, number][]; title?: string; tt: number }> = ({ t, on, title = "SUPERFICIAL ARM VEINS", tt }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16, background: C.forest, borderRadius: 26, padding: "8px 26px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper, whiteSpace: "nowrap" }}>
    <span style={{ fontSize: 62, color: C.banana, ...pop(t, tt, 0.25) }}>4</span> {title}
    <span style={{ display: "inline-flex", gap: 8, marginLeft: 6 }}>
      {on.map(([k, t0]) => (
        <span key={k} style={{ width: 30, height: 30, borderRadius: 15, background: t >= t0 - 0.05 ? VCOL[k] : "rgba(247,246,236,0.18)", border: `3px solid ${C.paper}`, transform: `scale(${1 + 0.3 * Math.sin(Math.PI * ramp(t, t0, t0 + 0.3))})` }} />
      ))}
    </span>
  </div>
);

/* 2. One of four, bridging the two big ones (elbow on our map) */
export const V2: React.FC<{ s0: number; s1: number; four: number; bridge: number; big: number }> = ({ s0, s1, four, bridge, big }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.006}>
      <div style={center(10, pop(t, s0 + 0.03, 0.25))}>
        <Four t={t} tt={four} on={[["MC", s0], ["CE", big], ["BA", big], ["MA", 99]]} />
      </div>
      <VBox t={t} top={124} h={756} id="v2" ks={[[s0, 1.25, 350, 720], [s1, 1.15, 350, 720]]}
        lit={{ MC: s0, CE: big, BA: big }} hot={t >= big - 0.05 ? ["CE", "BA"] : ["MC"]} dimRest={0.5} flow={ramp(t, bridge, bridge + 0.3)}
        tags={[tg("MC", "MC", s0 + 0.15, 40, 150, 40), tg("CE", "CE", big, 30, 120), tg("BA", "BA", big + 0.1, -40, 120)]} />
      <div style={center(892, pop(t, bridge, 0.25))}>
        <Pill size={36} bg={VCOL.MC} color={C.paper}>the bridge across the elbow crease</Pill>
      </div>
    </Scene>
  );
};

/* 3. Cephalic: thumb side → means head → climbs toward the shoulder */
export const V3: React.FC<{ s0: number; s1: number; ce: number; thumb: number; head: number; climb: number }> = ({ s0, s1, ce, thumb, head, climb }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, pop(t, s0 + 0.03, 0.25))}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, background: VCOL.CE, border: `4px solid ${C.forest}`, borderRadius: 26, padding: "6px 26px 12px", fontFamily: FONT, fontWeight: 800, color: C.paper, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 60 }}>CEPHALIC</span>
          <span style={{ fontSize: 40, ...pop(t, thumb, 0.25) }}>= 👍 thumb side</span>
        </div>
      </div>
      <VBox t={t} top={124} h={756} id="v3" ks={[[s0, 1.0, 340, 800], [thumb + 0.2, 0.82, 320, 980], [climb - 0.3, 0.82, 330, 820], [s1 - 0.2, 0.86, 320, 360]]}
        lit={{ CE: ce, MC: s0 - 1, BA: s0 - 1, MA: s0 - 1 }} hot={["CE"]} dimRest={0.6} sides={ramp(t, thumb, thumb + 0.3)} climb={ramp(t, climb, climb + 0.5)} flow={1}
        tags={[tg("CE", "CE", ce, 160, 40, 40, climb - 0.4), tg("CE", "CEtop", climb + 0.3, 210, 60, 40)]} />
      <div style={center(892, {})}>
        {t < head ? <div style={pop(t, thumb, 0.25)}><Pill size={36} bg={VCOL.CE} color={C.paper}>runs up the thumb side of the forearm</Pill></div>
          : t < climb ? <div style={pop(t, head, 0.25)}><Pill size={38} bg={C.banana} color={C.forest}>cephalic = “head” (Greek kephalē)</Pill></div>
          : <div style={pop(t, climb, 0.25)}><Pill size={36} bg={VCOL.CE} color={C.paper}>↑ climbs toward your shoulder</Pill></div>}
      </div>
    </Scene>
  );
};

/* 4. Basilic on Gray's plate: pinky side, then B = baby finger card */
export const V4: React.FC<{ s0: number; s1: number; ba: number; pinky: number; b: number }> = ({ s0, s1, ba, pinky, b }) => {
  const t = useT();
  const card = ramp(t, b - 0.05, b + 0.25);
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, pop(t, s0 + 0.03, 0.25))}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, background: VCOL.BA, border: `4px solid ${C.forest}`, borderRadius: 26, padding: "6px 26px 12px", fontFamily: FONT, fontWeight: 800, color: C.paper, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 60 }}>BASILIC</span>
          <span style={{ fontSize: 40, ...pop(t, pinky, 0.25) }}>= pinky side</span>
        </div>
      </div>
      <PlateQ src={P574} aspect={A574} x={30} y={124} w={800} h={756} a={s0} b={s1} from={[0.6, 0.53, 0.62]} to={[0.6, 0.5, 0.56]} ls={36}
        labels={[
          { x: 0.622, y: 0.452, text: "basilic", t: ba, hot: true, ox: -230, oy: 50 },
          { x: 0.68, y: 0.585, text: "basilic", t: ba + 0.2, hot: true, ox: -240, oy: -30 },
          { x: 0.425, y: 0.47, text: "cephalic", t: pinky, ox: 40, oy: -170 },
        ]} />
      {card > 0 && (
        <div style={{ position: "absolute", left: 120, top: 260, width: 620, height: 470, borderRadius: 40, background: C.forest, border: `6px solid ${C.banana}`, boxShadow: "0 18px 40px rgba(0,0,0,0.35)", ...pop(t, b, 0.3) }}>
          <div style={{ position: "absolute", left: 0, width: 620, top: 34, display: "flex", justifyContent: "center", alignItems: "center", gap: 26 }}>
            <div style={{ width: 170, height: 170, borderRadius: 40, background: VCOL.BA, border: `7px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 130, color: C.paper, lineHeight: 1 }}>B</div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 92, color: C.paper }}>=</div>
            <div style={{ width: 170, height: 170, borderRadius: 40, background: C.banana, border: `7px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 130, color: C.forest, lineHeight: 1 }}>B</div>
          </div>
          <div style={{ position: "absolute", left: 0, width: 620, top: 236, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.paper, lineHeight: 1.15, whiteSpace: "nowrap" }}>
            <span style={{ color: "#8FA8E8" }}>B</span>asilic = <span style={{ color: C.banana }}>B</span>aby finger
          </div>
          <div style={{ position: "absolute", left: 0, width: 620, top: 352, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: "#B9D27A" }}>runs up the pinky side</div>
        </div>
      )}
    </Scene>
  );
};

/* 5. Median antebrachial + the complete map (all 4 labelled, held ≥ 1.5 s) */
export const V5: React.FC<{ s0: number; s1: number; ma: number; all: number }> = ({ s0, s1, ma, all }) => {
  const t = useT();
  const allOn = t >= all - 0.05;
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, pop(t, s0 + 0.03, 0.25))}>
        <Four t={t} tt={s0} on={[["MC", s0 - 1], ["CE", s0 - 1], ["BA", s0 - 1], ["MA", ma]]} title="ARM VEINS · ONE MAP" />
      </div>
      <VBox t={t} top={124} h={756} id="v5" note="" ks={[[s0, 1.0, 350, 940], [all - 0.2, 0.92, 350, 900], [all + 0.3, 0.6, 340, 700], [s1, 0.58, 340, 700]]}
        lit={{ MC: s0 - 1, CE: s0 - 1, BA: s0 - 1, MA: ma }} hot={allOn ? [] : ["MA"]} dimRest={0.55} sides={allOn ? 1 : 0} flow={1}
        tags={[
          tg("MA", "MA", ma, 170, 70, 36, all - 0.2),
          tg("CE", "CEarm", all + 0.3, -150, -50, 30), tg("BA", "BAarm", all + 0.4, 180, -60, 30),
          tg("MC", "MC", all + 0.5, 200, -40, 30), tg("MA", "MA", all + 0.6, 190, 30, 30),
        ]} />
      <div style={center(892, {})}>
        {!allOn ? <div style={pop(t, ma + 0.3, 0.25)}><Pill size={36} bg={VCOL.MA} color={C.paper}>up the middle of the forearm</Pill></div>
          : <div style={pop(t, all + 0.6, 0.25)}><Pill size={36} bg={C.banana} color={C.forest}>📸 screenshot this map</Pill></div>}
      </div>
    </Scene>
  );
};

/* 6. Quick test with 3-2-1 */
export const V6: React.FC<{ s0: number; s1: number; q: number; cd: [number, number][] }> = ({ s0, s1, q, cd }) => {
  const t = useT();
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < s1) { n = v; n0 = s; } });
  const OPTS = ["Basilic", "Cephalic", "Median cubital", "Median antebrachial"];
  return (
    <Scene start={s0} end={s1}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, s0 + 0.05, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 42, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 30, width: 760, top: 100, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 56, lineHeight: 1.1, color: C.paper, ...pop(t, q) }}>
          Which vein runs between your <span style={{ color: C.banana }}>deltoid and pec</span>?
        </div>
        <div style={{ position: "absolute", left: 60, top: 300, width: 700, display: "flex", flexDirection: "column", gap: 18 }}>
          {OPTS.map((nm, i) => (
            <div key={nm} style={{ height: 82, borderRadius: 22, background: "rgba(247,246,236,0.08)", border: "3px solid rgba(247,246,236,0.18)", display: "flex", alignItems: "center", gap: 16, padding: "0 16px", boxSizing: "border-box", ...pop(t, q + 0.5 + i * 0.08, 0.25) }}>
              <div style={{ width: 54, height: 54, borderRadius: 27, background: "rgba(247,246,236,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.banana }}>{"ABCD"[i]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.paper, whiteSpace: "nowrap" }}>{nm}</div>
              <div style={{ marginLeft: "auto", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.banana }}>?</div>
            </div>
          ))}
        </div>
        {n !== null ? (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 712, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 130, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        ) : (
          <div style={{ position: "absolute", left: 0, width: 820, top: 760, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#B9D27A", opacity: ramp(t, q + 1.0, q + 1.2) }}>pause · say it out loud</div>
        )}
      </div>
    </Scene>
  );
};

/* 7. Answer on Gray's Fig. 574 (shoulder): cephalic in the deltopectoral groove */
export const V7: React.FC<{ s0: number; s1: number; ce: number; groove: number }> = ({ s0, s1, ce, groove }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, pop(t, s0 + 0.05, 0.25))}>
        <div style={{ background: "#E5251A", border: `4px solid ${C.forest}`, borderRadius: 26, padding: "10px 30px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 54, color: C.paper, whiteSpace: "nowrap" }}>✓ B · Cephalic</div>
      </div>
      <PlateQ src={P574} aspect={A574} x={30} y={130} w={800} h={720} a={s0} b={s1} from={[0.5, 0.25, 0.66]} to={[0.5, 0.21, 0.6]} ls={36}
        labels={[
          { x: 0.43, y: 0.285, text: "cephalic vein", t: ce, hot: true, ox: 170, oy: -30 },
          { x: 0.355, y: 0.17, text: "deltoid", t: ce + 0.45, ox: -40, oy: -110 },
          { x: 0.72, y: 0.215, text: "pec major", t: ce + 0.6, ox: -90, oy: -120 },
        ]} />
      <div style={center(866, pop(t, groove, 0.25))}>
        <Pill size={34} bg={VCOL.CE} color={C.paper}>deltopectoral groove → axillary vein</Pill>
      </div>
    </Scene>
  );
};

/* 8. end card: save (≤ 1.5 s) */
export const V8: React.FC<{ s0: number; s1: number }> = ({ s0, s1 }) => {
  const t = useT();
  const ROWS: [VK, string][] = [["MC", "bridge at the elbow · blood draws"], ["CE", "thumb side → shoulder"], ["BA", "B = baby finger side"], ["MA", "middle of the forearm"]];
  return (
    <Scene start={s0} end={s1}>
      <div style={{ position: "absolute", left: 30, top: 20, width: 800, height: 860, borderRadius: 44, background: C.forest, ...pop(t, s0 + 0.02, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 800, top: 44, textAlign: "center" }}><Loud size={84}>SAVE THIS</Loud></div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 146, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: "#B9D27A" }}>for your next anatomy exam</div>
        <div style={{ position: "absolute", left: 40, top: 220, width: 720, display: "flex", flexDirection: "column", gap: 18 }}>
          {ROWS.map(([k, b], i) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 18, background: "rgba(247,246,236,0.08)", borderRadius: 24, padding: 12, ...pop(t, s0 + 0.1 + i * 0.07, 0.22) }}>
              <div style={{ width: 290, height: 76, borderRadius: 20, background: VCOL[k], display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: k === "MA" ? 26 : 32, color: C.paper, whiteSpace: "nowrap" }}>{VNAME[k]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 29, color: C.paper, lineHeight: 1.2 }}>{b}</div>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 690, display: "flex", justifyContent: "center", ...pop(t, s0 + 0.4, 0.25) }}>
          <div style={{ background: C.banana, color: C.forest, borderRadius: 50, padding: "14px 44px", fontFamily: FONT, fontWeight: 800, fontSize: 42 }}>🔖 SAVE THIS · + FOLLOW</div>
        </div>
      </div>
    </Scene>
  );
};

/* TikTok: one map scene — bridge → cephalic thumb side climbs → basilic pinky side → B = baby finger */
export const TTDiag: React.FC<{ s0: number; s1: number; bridge: number; big: number; ce: number; climb: number; ba: number; b: number }> = ({ s0, s1, bridge, big, ce, climb, ba, b }) => {
  const t = useT();
  const phase = t >= ba - 0.05 ? 2 : t >= ce - 0.05 ? 1 : 0;
  const hot: VK[] = phase === 2 ? ["BA"] : phase === 1 ? ["CE"] : t >= big - 0.05 ? ["CE", "BA"] : ["MC"];
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, pop(t, s0 + 0.03, 0.25))}>
        <Four t={t} tt={s0 + 0.1} on={[["MC", s0], ["CE", big], ["BA", big], ["MA", 99]]} title="ARM VEINS" />
      </div>
      <VBox note="" t={t} top={124} h={756} id="tt" ks={[[s0, 1.2, 350, 720], [ce - 0.1, 1.05, 350, 760], [climb + 0.3, 0.8, 340, 620], [ba, 0.78, 350, 760], [s1, 0.82, 360, 860]]}
        lit={{ MC: s0, CE: big, BA: big }} hot={hot} dimRest={0.5} sides={ramp(t, ce, ce + 0.3)} climb={ramp(t, climb, climb + 0.45) * (1 - ramp(t, ba, ba + 0.3))} flow={1}
        tags={[tg("MC", "MC", s0 + 0.12, 40, 150, 40, ce - 0.1), tg("CE", "CEarm", ce, 150, -40, 40), tg("BA", "BA", ba, -170, 40, 40)]} />
      <div style={center(892, {})}>
        {phase === 0 && <div style={pop(t, bridge, 0.25)}><Pill size={36} bg={VCOL.MC} color={C.paper}>the bridge between the 2 big veins</Pill></div>}
        {phase === 1 && <div style={pop(t, ce, 0.25)}><Pill size={36} bg={VCOL.CE} color={C.paper}>👍 cephalic = thumb side → shoulder</Pill></div>}
        {phase === 2 && (t < b ? <div style={pop(t, ba, 0.25)}><Pill size={36} bg={VCOL.BA} color={C.paper}>basilic = pinky side</Pill></div>
          : <div style={pop(t, b, 0.25)}><Pill size={44} bg={C.banana} color={C.forest}>B = Basilic = Baby finger</Pill></div>)}
      </div>
    </Scene>
  );
};
