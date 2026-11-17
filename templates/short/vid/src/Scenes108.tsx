import React from "react";
import { C, FONT, Pill, Scene, ramp, useT } from "./kit";
import { Big, pop } from "./Scenes67";
import { Loud, PlateQ, QS } from "./Scenes93";
import { Chip } from "./Portal99";
import { HANCH, HCOL, HK, Ham, NERVE } from "./Ham108";
import { Ring } from "./Scenes104";

export const P434 = "plates/ham434.png";
export const A434 = 1149 / 3275;
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* Gray's Fig. 434 (right gluteal + posterior femoral regions, from behind). Fractions of the crop.
   Printed names run vertically down each belly: "SEMI-TENDINOSUS", "SEMI-MEMBRANOSUS", "BICEPS FEMORIS". */
export const STPIN = { x: 0.432, y: 0.645 };
export const stStick = (off: number): QS[] => [{ x0: 0.393, y0: 0.468, x1: 0.452, y1: 0.612, rot: 0, off }];
export const SMPIN = { x: 0.333, y: 0.6 };
export const smStick = (off: number): QS[] => [{ x0: 0.302, y0: 0.5, x1: 0.362, y1: 0.642, rot: 0, off }];
export const BFPIN = { x: 0.56, y: 0.6 };
export const bfStick = (off: number): QS[] => [{ x0: 0.5, y0: 0.52, x1: 0.68, y1: 0.562, rot: 0, off }];

export type Tm = { reveal: number; ticks: number[]; hookEnd: number };
export const TM_MAIN: Tm = { reveal: 4.05, ticks: [2.3, 2.9, 3.5], hookEnd: 6.85 };

/* 1. Quiz hook: Fig. 434 already visible, red pin on the semitendinosus, "?" over its printed name, 3-2-1, reveal */
export const V1: React.FC<{ tm: Tm; named: number }> = ({ tm, named }) => {
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
          <div style={{ background: "#E5251A", border: "7px solid #111", borderRadius: 18, padding: "0 22px 6px", transform: "rotate(-2deg)" }}><Loud size={84}>HAMSTRING</Loud></div>
          <Loud size={60}>3 SEC</Loud>
        </div>
      </div>
      {rv > 0 && (
        <div style={center(10, pop(t, R, 0.3))}>
          <div style={{ textAlign: "center" }}>
            <Big size={80} color={C.forest}>✓ SEMITENDINOSUS</Big>
            <div style={{ height: 18 }} />
            <div style={{ display: "flex", justifyContent: "center", ...pop(t, named, 0.3) }}>
              <Pill size={40} bg={HCOL.ST} color={C.paper}>named for its long tendon</Pill>
            </div>
          </div>
        </div>
      )}
      <PlateQ src={P434} aspect={A434} x={230} y={262} w={600} h={630} a={-0.6} b={tm.hookEnd} from={[0.5, 0.575, 0.76]} to={[0.48, 0.6, 0.66]}
        pin={{ ...STPIN, t0: -1, t1: R + 0.2, r: 70 }} stickers={stStick(R)}
        labels={[{ x: 0.432, y: 0.645, text: "semitendinosus", t: R + 0.02, hot: true, ox: 6, oy: 110 }]} ls={30} />
      <div style={{ position: "absolute", left: 30, top: 430 }}>
        <Ring t={t} size={170} reveal={R} ticks={tm.ticks} />
      </div>
      <div style={center(898, pop(t, 0.05, 0.25))}>
        {t < R ? <Pill size={34} bg={C.forest}>anatomy quiz · + 2 more after it</Pill> : (
          <div style={{ ...pop(t, R + 0.4, 0.25) }}><Pill size={36} bg={C.banana} color={C.forest}>hamstrings · mnemonic</Pill></div>
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
export type Tag = { a: string; t: number; dx: number; dy: number; col: string; text: string; size?: number; t1?: number; dark?: boolean };
export const HBox: React.FC<{ t: number; ks: Kf[]; top: number; h: number; id: string; tags?: Tag[]; note?: string; side?: number } & Omit<React.ComponentProps<typeof Ham>, "w" | "id" | "t">> = ({ t, ks, top, h, id, tags = [], note = "right thigh from behind · Book Plume diagram", side = 0, ...rest }) => {
  const [, s, cx, cy] = cam(t, ks);
  const X0 = 430 - cx * s, Y0 = h / 2 - cy * s;
  return (
    <div style={{ position: "absolute", left: 0, top, width: 860, height: h, overflow: "hidden", borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}` }}>
      <div style={{ position: "absolute", left: X0, top: Y0 }}>
        <Ham t={t} w={700 * s} id={id} {...rest} />
      </div>
      {side > 0 && (
        <>
          <div style={{ position: "absolute", left: 22, bottom: 20, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.forest, background: "rgba(255,254,246,0.92)", borderRadius: 12, padding: "2px 10px", opacity: side, letterSpacing: 2 }}>◀ INSIDE (medial)</div>
          <div style={{ position: "absolute", right: 22, bottom: 20, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.forest, background: "rgba(255,254,246,0.92)", borderRadius: 12, padding: "2px 10px", opacity: side, letterSpacing: 2 }}>OUTSIDE (lateral) ▶</div>
        </>
      )}
      {tags.map(({ a, t: t0, dx, dy, size, t1, col, text, dark }) => {
        const p = ramp(t, t0 - 0.05, t0 + 0.2) * (t1 === undefined ? 1 : 1 - ramp(t, t1, t1 + 0.2));
        if (p <= 0) return null;
        const [ax, ay] = HANCH[a];
        const x = X0 + ax * s, y = Y0 + ay * s;
        return (
          <React.Fragment key={a + text}>
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: p }} width={1} height={1}>
              <line x1={x} y1={y} x2={x + dx} y2={y + dy} stroke={C.paper} strokeWidth={9} strokeLinecap="round" />
              <line x1={x} y1={y} x2={x + dx} y2={y + dy} stroke={C.forest} strokeWidth={4.5} strokeLinecap="round" />
              <circle cx={x} cy={y} r={9} fill={col} stroke={C.forest} strokeWidth={3.5} />
            </svg>
            {dark ? (
              <div style={{ position: "absolute", left: x + dx, top: y + dy, transform: `translate(-50%, -50%) scale(${0.7 + 0.3 * p})`, opacity: p, background: col, color: C.forest, border: `4px solid ${C.forest}`, boxShadow: "0 6px 0 rgba(31,42,20,0.25)", borderRadius: 16, padding: "4px 14px 7px", fontFamily: FONT, fontWeight: 800, fontSize: size ?? 32, whiteSpace: "nowrap" }}>{text}</div>
            ) : (
              <Chip x={x + dx} y={y + dy} p={p} col={col} size={size}>{text}</Chip>
            )}
          </React.Fragment>
        );
      })}
      {note && <div style={{ position: "absolute", left: 18, top: 16, fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.forest, background: "rgba(255,254,246,0.9)", borderRadius: 12, padding: "4px 12px" }}>{note}</div>}
    </div>
  );
};
const tg = (k: HK, a: string, t: number, dx: number, dy: number, text: string, size = 36, t1?: number): Tag => ({ a, t, dx, dy, col: HCOL[k], text, size, t1 });
const BONE = "#6B6F5E";
const tb = (a: string, t: number, dx: number, dy: number, text: string, size = 30, t1?: number): Tag => ({ a, t, dx, dy, col: BONE, text, size, t1 });
const tn = (a: string, t: number, dx: number, dy: number, text: string, size = 32, t1?: number): Tag => ({ a, t, dx, dy, col: NERVE, text, size, t1, dark: true });

const Head: React.FC<{ bg: string; children: React.ReactNode }> = ({ bg, children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 18, background: bg, border: `4px solid ${C.forest}`, borderRadius: 26, padding: "6px 26px 12px", fontFamily: FONT, fontWeight: 800, color: C.paper, whiteSpace: "nowrap" }}>{children}</div>
);

/* 2. Three hamstrings: two semis inside, biceps outside */
export const V2: React.FC<{ s0: number; s1: number; three: number; semis: number; biceps: number }> = ({ s0, s1, three, semis, biceps }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.006}>
      <div style={center(10, pop(t, s0 + 0.03, 0.25))}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: C.forest, borderRadius: 26, padding: "8px 24px 12px", fontFamily: FONT, fontWeight: 800, color: C.paper, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 50 }}>HAMSTRINGS</span>
          <span style={{ fontSize: 50, color: C.banana, ...pop(t, three + 0.1, 0.25) }}>= 3</span>
        </div>
      </div>
      <HBox t={t} top={124} h={756} id="v2" side={ramp(t, semis, semis + 0.3)} ks={[[s0, 0.84, 370, 640], [s1, 0.8, 370, 660]]}
        lit={{ ST: semis, SM: semis + 0.12, BL: biceps, BS: biceps + 0.1 }}
        hot={t >= biceps - 0.05 ? ["BL", "BS"] : t >= semis - 0.05 ? ["ST", "SM"] : []} dimRest={0.35}
        tags={[tg("ST", "ST", semis + 0.05, -150, -90, "semi 1", 38), tg("SM", "SM", semis + 0.2, -110, 120, "semi 2", 38), tg("BL", "BL", biceps + 0.05, 160, -60, "biceps", 40)]} />
      <div style={center(892, pop(t, semis, 0.25))}>
        <Pill size={36} bg={C.banana} color={C.forest}>2 semis = inside · biceps = outside</Pill>
      </div>
    </Scene>
  );
};

/* 3. Semitendinosus on top (T for top), semimembranosus hides underneath (ST fades away) */
export const V3: React.FC<{ s0: number; s1: number; st: number; top: number; tfor: number; sm: number; under: number }> = ({ s0, s1, st, top, tfor, sm, under }) => {
  const t = useT();
  const smOn = t >= sm - 0.05;
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, pop(t, s0 + 0.03, 0.25))}>
        {!smOn ? (
          <Head bg={HCOL.ST}><span style={{ fontSize: 50 }}>SEMI-T</span><span style={{ fontSize: 44, ...pop(t, tfor, 0.25) }}>= <span style={{ color: C.banana }}>T</span>op</span></Head>
        ) : (
          <div style={pop(t, sm, 0.25)}><Head bg={HCOL.SM}><span style={{ fontSize: 50 }}>SEMI-M</span><span style={{ fontSize: 44 }}>= under it</span></Head></div>
        )}
      </div>
      <HBox t={t} top={124} h={756} id="v3" ks={[[s0, 0.95, 330, 560], [sm - 0.2, 0.9, 320, 640], [s1, 0.85, 320, 740]]}
        lit={{ ST: st, SM: sm, BL: s0 - 1, BS: s0 - 1 }} hot={smOn ? ["SM"] : ["ST"]} dimRest={0.55} st={1 - 0.85 * ramp(t, sm, sm + 0.6)}
        tags={[tg("ST", "ST", st + 0.2, 170, -60, "semitendinosus", 36, sm - 0.1), tg("ST", "STt", top, 170, 40, "long thin tendon", 32, sm - 0.1),
          tg("SM", "SM", sm + 0.4, 190, -20, "semimembranosus", 36), tg("SM", "SM", under, 210, 150, "flat + deep", 32)]} />
      <div style={center(892, {})}>
        {!smOn ? <div style={pop(t, top, 0.25)}><Pill size={36} bg={HCOL.ST} color={C.paper}>T = Tendon = Top layer</Pill></div>
          : <div style={pop(t, under, 0.25)}><Pill size={36} bg={HCOL.SM} color={C.paper}>M = Membrane · flat sheet underneath</Pill></div>}
      </div>
    </Scene>
  );
};

/* 4. Biceps femoris on Gray's Fig. 434: long head + short head */
export const V4: React.FC<{ s0: number; s1: number; b: number; long: number; short: number }> = ({ s0, s1, b, long, short }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, pop(t, s0 + 0.03, 0.25))}>
        <Head bg={HCOL.BL}><span style={{ fontSize: 52 }}>BICEPS FEMORIS</span><span style={{ fontSize: 40, ...pop(t, long, 0.25) }}>= 2 heads</span></Head>
      </div>
      <PlateQ src={P434} aspect={A434} x={30} y={124} w={800} h={756} a={s0} b={s1} from={[0.55, 0.57, 0.95]} to={[0.56, 0.645, 0.85]} ls={34}
        labels={[
          { x: 0.6, y: 0.52, text: "biceps femoris", t: b, hot: true, ox: -150, oy: 60 },
          { x: 0.57, y: 0.61, text: "long head", t: long, ox: 150, oy: 30 },
          { x: 0.63, y: 0.765, text: "short head", t: short, ox: -170, oy: 20 },
        ]} />
      <div style={center(892, pop(t, short + 0.2, 0.25))}>
        <Pill size={36} bg={HCOL.BL} color={C.paper}>biceps = “2 heads” · the only one outside</Pill>
      </div>
    </Scene>
  );
};

/* 5. Sit bone + sciatic nerve → the complete one-picture map (held ≥ 1.5 s) */
export const V5: React.FC<{ s0: number; s1: number; sit: number; nerve: number; sci: number }> = ({ s0, s1, sit, nerve, sci }) => {
  const t = useT();
  const allOn = t >= nerve - 0.05;
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, pop(t, s0 + 0.03, 0.25))}>
        {!allOn ? (
          <Head bg={C.forest}><span style={{ fontSize: 48 }}>START:</span><span style={{ fontSize: 48, color: C.banana }}>SIT BONE</span></Head>
        ) : (
          <div style={{ background: C.forest, borderRadius: 26, padding: "8px 28px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 48, color: C.paper, whiteSpace: "nowrap", ...pop(t, nerve, 0.25) }}>HAMSTRINGS · ONE MAP</div>
        )}
      </div>
      <HBox t={t} top={124} h={756} id="v5" note="" ks={[[s0, 1.25, 330, 330], [nerve - 0.3, 1.15, 340, 380], [nerve + 0.3, 0.62, 380, 720], [s1, 0.61, 380, 720]]}
        lit={{ ST: s0 - 1, SM: s0 - 1, BL: s0 - 1, BS: s0 - 1 }} hot={[]} it={ramp(t, sit - 0.1, sit + 0.3) * (1 - 0.6 * ramp(t, nerve, nerve + 0.4))} nerve={ramp(t, nerve, nerve + 0.4)}
        tags={[
          tb("IT", sit, 200, -40, "ischial tuberosity = sit bone", 32, nerve - 0.3),
          tg("ST", "ST", nerve + 0.25, -170, -150, "semitendinosus", 30), tg("SM", "SM", nerve + 0.35, -95, 130, "semimembranosus", 30),
          tg("BL", "BL", nerve + 0.45, 150, -170, "biceps · long", 30), tg("BS", "BS", nerve + 0.55, 70, 140, "biceps · short", 30),
          tn("SN", sci - 0.2, 170, 60, "sciatic nerve", 32),
        ]} />
      <div style={center(892, {})}>
        {!allOn ? <div style={pop(t, sit + 0.2, 0.25)}><Pill size={36} bg={C.banana} color={C.forest}>long head + both semis start here</Pill></div>
          : <div style={pop(t, sci, 0.25)}><Pill size={36} bg={C.banana} color={C.forest}>📸 one nerve: sciatic · screenshot this</Pill></div>}
      </div>
    </Scene>
  );
};

/* 6. Quick test with 3-2-1 */
export const V6: React.FC<{ s0: number; s1: number; q: number; cd: [number, number][] }> = ({ s0, s1, q, cd }) => {
  const t = useT();
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < s1) { n = v; n0 = s; } });
  const OPTS: [string, string][] = [["Semitendinosus", HCOL.ST], ["Biceps · short head", HCOL.BS], ["Semimembranosus", HCOL.SM]];
  return (
    <Scene start={s0} end={s1}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, s0 + 0.05, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 40, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 30, width: 760, top: 96, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 58, lineHeight: 1.1, color: C.paper, ...pop(t, q) }}>
          Which part does <span style={{ color: C.banana }}>NOT</span> cross the hip?
        </div>
        <div style={{ position: "absolute", left: 50, top: 290, width: 720, display: "flex", flexDirection: "column", gap: 20 }}>
          {OPTS.map(([nm, col], i) => (
            <div key={nm} style={{ height: 104, borderRadius: 26, background: "rgba(247,246,236,0.08)", border: "3px solid rgba(247,246,236,0.2)", display: "flex", alignItems: "center", gap: 22, padding: "0 22px", boxSizing: "border-box", ...pop(t, q + 0.45 + i * 0.35, 0.25) }}>
              <div style={{ width: 68, height: 68, borderRadius: 34, background: col, border: `4px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.paper }}>{"ABC"[i]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 48, color: C.paper, whiteSpace: "nowrap" }}>{nm}</div>
              <div style={{ marginLeft: "auto", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.banana }}>?</div>
            </div>
          ))}
        </div>
        {n !== null ? (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 670, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 160, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        ) : (
          <div style={{ position: "absolute", left: 0, width: 820, top: 720, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#B9D27A", opacity: ramp(t, q + 1.3, q + 1.5) }}>pause · say it out loud</div>
        )}
      </div>
    </Scene>
  );
};

/* 7. Answer: biceps short head starts on the femur (diagram, femur lit) */
export const V7: React.FC<{ s0: number; s1: number; sh: number; fem: number }> = ({ s0, s1, sh, fem }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, pop(t, s0 + 0.05, 0.25))}>
        <div style={{ background: "#E5251A", border: `4px solid ${C.forest}`, borderRadius: 26, padding: "10px 30px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.paper, whiteSpace: "nowrap" }}>✓ B · Biceps short head</div>
      </div>
      <HBox t={t} top={124} h={756} id="v7" ks={[[s0, 0.62, 400, 700], [fem - 0.3, 0.8, 440, 760], [s1, 0.85, 440, 780]]}
        lit={{ ST: s0 - 1, SM: s0 - 1, BL: s0 - 1, BS: sh }} hot={["BS"]} dimRest={0.6} bones={ramp(t, fem - 0.15, fem + 0.25)}
        tags={[tg("BS", "BS", sh + 0.2, -260, 110, "short head", 38), tb("FEM", fem, -220, -90, "starts on the femur", 32)]} />
      <div style={center(892, pop(t, fem + 0.3, 0.25))}>
        <Pill size={34} bg={HCOL.BS} color={C.forest}>knee only · the other 3 cross hip + knee</Pill>
      </div>
    </Scene>
  );
};

/* 8. end card ≤ 1.5 s: full quiz + save */
export const V8: React.FC<{ s0: number; s1: number }> = ({ s0, s1 }) => {
  const t = useT();
  const ROWS: [HK, string, string][] = [["ST", "semitendinosus", "inside · top · long tendon"], ["SM", "semimembranosus", "inside · underneath · flat"], ["BL", "biceps femoris", "outside · long + short head"]];
  return (
    <Scene start={s0} end={s1}>
      <div style={{ position: "absolute", left: 30, top: 20, width: 800, height: 860, borderRadius: 44, background: C.forest, ...pop(t, s0 + 0.02, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 800, top: 40, textAlign: "center" }}><Loud size={74}>FULL QUIZ</Loud></div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 136, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.banana }}>on our channel · 27 leg muscles</div>
        <div style={{ position: "absolute", left: 40, top: 220, width: 720, display: "flex", flexDirection: "column", gap: 16 }}>
          {ROWS.map(([k, nm, b], i) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 18, background: "rgba(247,246,236,0.08)", borderRadius: 24, padding: 12, ...pop(t, s0 + 0.08 + i * 0.06, 0.22) }}>
              <div style={{ width: 330, height: 76, borderRadius: 20, background: HCOL[k], display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 31, color: C.paper, whiteSpace: "nowrap" }}>{nm}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 27, color: C.paper, lineHeight: 1.2 }}>{b}</div>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 18, background: "rgba(247,246,236,0.08)", borderRadius: 24, padding: 12, ...pop(t, s0 + 0.26, 0.22) }}>
            <div style={{ width: 330, height: 76, borderRadius: 20, background: NERVE, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 31, color: C.forest }}>sciatic nerve</div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 27, color: C.paper, lineHeight: 1.2 }}>runs all of them</div>
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 700, display: "flex", justifyContent: "center", ...pop(t, s0 + 0.3, 0.25) }}>
          <div style={{ background: C.banana, color: C.forest, borderRadius: 50, padding: "14px 44px", fontFamily: FONT, fontWeight: 800, fontSize: 42 }}>🔖 SAVE THIS · + FOLLOW</div>
        </div>
      </div>
    </Scene>
  );
};

/* ---------- TikTok RAPID QUIZ: 3 questions on Fig. 434, pin → "?" → 2-1 → answer ---------- */
export type RQ = { s0: number; s1: number; q: number; ticks: number[]; reveal: number; n: number; ask: string; ans: string; col: string;
  view0: [number, number, number]; view1: [number, number, number]; pin: { x: number; y: number }; r: number; stick: QS[]; extra?: { t: number; text: string }; lab?: [number, number] };
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
  const big = p.ans.length > 12 ? 64 : p.ans.length > 9 ? 76 : 96;
  return (
    <Scene start={p.s0} end={p.s1} push={0.01}>
      <div style={center(0, {})}>
        {p.intro && t < p.q ? (
          <div style={{ textAlign: "center" }}>
            <Loud size={96}>3 HAMSTRING</Loud>
            <div style={{ height: 6 }} />
            <div style={{ display: "inline-block", background: "#E5251A", border: "7px solid #111", borderRadius: 18, padding: "0 22px 6px", transform: "rotate(-2deg)" }}><Loud size={76}>QUESTIONS</Loud></div>
          </div>
        ) : rv <= 0 ? (
          <div style={{ textAlign: "center", ...pop(t, p.q, 0.25) }}>
            <div style={{ display: "inline-block", background: "#E5251A", border: "7px solid #111", borderRadius: 18, padding: "0 22px 6px", transform: "rotate(-2deg)" }}><Loud size={64}>{`#${p.n}`}</Loud></div>
            <div style={{ height: 8 }} />
            <Loud size={80}>{p.ask}</Loud>
          </div>
        ) : (
          <div style={{ textAlign: "center", ...pop(t, R, 0.3) }}>
            <Big size={big} color={C.forest}>{`✓ ${p.ans}`}</Big>
            {p.extra && t >= p.extra.t - 0.05 && <div style={{ marginTop: 14, display: "flex", justifyContent: "center", ...pop(t, p.extra.t, 0.25) }}><Pill size={40} bg={C.banana} color={C.forest}>{p.extra.text}</Pill></div>}
          </div>
        )}
      </div>
      <PlateQ src={P434} aspect={A434} x={230} y={262} w={600} h={630} a={p.s0} b={p.s1} from={p.view0} to={p.view1}
        pin={{ ...p.pin, t0: p.intro ? -1 : p.s0 + 0.05, t1: R + 0.2, r: p.r }} stickers={p.stick}
        labels={[{ x: p.pin.x, y: p.pin.y, text: p.ans.toLowerCase(), t: R + 0.02, hot: true, ox: p.lab ? p.lab[0] : 30, oy: p.lab ? p.lab[1] : 160 }]} ls={p.ans.length > 9 ? 31 : 40} />
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
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, color: C.banana, letterSpacing: 1 }}>BICEPS FEMORIS · SEMITENDINOSUS · SEMIMEMBRANOSUS</div>
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
