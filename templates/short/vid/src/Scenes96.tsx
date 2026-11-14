import React from "react";
import { C, FONT, Pill, Scene, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, pop } from "./Scenes67";
import { LChip, Loud, PlateQ, QS } from "./Scenes93";
import { EACT, EANCH, EM, ENAME, ENERVE, EORDER, Eye, NCOL, NNAME, NROM } from "./Eye96";

export const P889 = "plates/orbit889.png";
export const A889 = 1407 / 971;
export const P890 = "plates/orbit890.png";
export const A890 = 1623 / 1298;
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* the printed 1918 words "RECTUS LATERALIS" on Fig. 889 */
export const hookStick = (off: number): QS[] => [{ x0: 0.408, y0: 0.506, x1: 0.604, y1: 0.568, rot: 0, off }];
export const HOOKPIN = { x: 0.51, y: 0.5 };

export type Tm = { reveal: number; ticks: number[]; pow: number; hookEnd: number };
export const TM_MAIN: Tm = { reveal: 3.77, ticks: [1.95, 2.6, 3.2], pow: 4.82, hookEnd: 6.25 };
export const TM_TT: Tm = { reveal: 3.78, ticks: [1.95, 2.6, 3.2], pow: 4.87, hookEnd: 6.55 };

const ECOL = (m: EM) => NCOL[ENERVE[m]];

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

/* 1. Quiz hook: Gray's 1918 Fig. 889 (right orbit, side view), red pin on the lateral rectus from frame 1, 3-2-1, reveal */
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
          <div style={{ background: "#E5251A", border: "7px solid #111", borderRadius: 18, padding: "0 18px 6px", transform: "rotate(-2deg)" }}><Loud size={80}>EYE MUSCLE</Loud></div>
          <Loud size={58}>IN 3 SEC</Loud>
        </div>
      </div>
      {rv > 0 && (
        <div style={center(20, pop(t, R, 0.3))}>
          <div style={{ textAlign: "center" }}>
            <Big size={84} color={C.forest}>✓ LATERAL RECTUS</Big>
            <div style={{ height: 14 }} />
            <div style={{ display: "flex", justifyContent: "center", ...pop(t, tm.pow, 0.3) }}>
              <Pill size={44} bg={C.red} color={C.paper}>← turns your eye OUTWARD</Pill>
            </div>
          </div>
        </div>
      )}
      <PlateQ src={P889} aspect={A889} x={30} y={262} w={800} h={620} a={-0.6} b={tm.hookEnd} from={[0.5, 0.5, 0.86]} to={[0.51, 0.52, 0.66]}
        pin={{ ...HOOKPIN, t0: -1, t1: R + 0.2, r: 104 }} stickers={hookStick(R)}
        labels={[{ x: 0.51, y: 0.537, text: "lateral rectus", t: R + 0.02, hot: true, ox: 70, oy: 175 }]} ls={42} />
      <div style={{ position: "absolute", left: 650, top: 640 }}>
        <Ring t={t} size={170} tm={tm} />
      </div>
      <div style={center(898, pop(t, 0.05, 0.25))}>
        {t < R ? <Pill size={34} bg={C.forest}>anatomy quiz · say it before the 1</Pill> : (
          <div style={{ ...pop(t, R + 0.6, 0.25) }}><Pill size={36} bg={C.banana} color={C.forest}>extraocular muscles · mnemonic</Pill></div>
        )}
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

/* diagram box with a camera + name tags that pop on the muscles */
type Tag = { m: EM; t: number; nerve?: boolean };
const EyeBox: React.FC<{ t: number; ks: Kf[]; top: number; h: number; id: string; tags?: Tag[]; children?: React.ReactNode } & Omit<React.ComponentProps<typeof Eye>, "w" | "id" | "t">> = ({ t, ks, top, h, id, tags = [], children, ...rest }) => {
  const [, s, cx, cy] = cam(t, ks);
  const X0 = 430 - cx * s, Y0 = h / 2 - cy * s;
  return (
    <div style={{ position: "absolute", left: 0, top, width: 860, height: h, overflow: "hidden", borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}` }}>
      <div style={{ position: "absolute", left: X0, top: Y0 }}>
        <Eye t={t} w={1000 * s} id={id} {...rest} />
      </div>
      {tags.map(({ m, t: t0, nerve }) => {
        const p = ramp(t, t0 - 0.05, t0 + 0.2);
        if (p <= 0) return null;
        const [ax, ay] = EANCH[m];
        const x = X0 + ax * s, y = Y0 + ay * s;
        const col = nerve ? ECOL(m) : C.forest;
        return (
          <div key={m} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${0.7 + 0.3 * p})`, opacity: p, background: col, color: C.paper, border: `4px solid ${C.paper}`, boxShadow: "0 6px 0 rgba(31,42,20,0.25)", borderRadius: 16, padding: "4px 14px 7px", fontFamily: FONT, fontWeight: 800, fontSize: 34, whiteSpace: "nowrap" }}>
            {nerve ? `${m} · ${NROM[ENERVE[m]]}` : m}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 18, top: 16, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.forest, background: "rgba(255,254,246,0.9)", borderRadius: 12, padding: "4px 12px" }}>right eye · front view</div>
      <div style={{ position: "absolute", right: 16, bottom: 12, fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.forest, opacity: 0.55, background: "rgba(255,254,246,0.85)", borderRadius: 8, padding: "0 8px" }}>diagram: Book Plume</div>
      {children}
    </div>
  );
};

const Tok: React.FC<{ t: number; t0: number; children: React.ReactNode; col?: string; size?: number }> = ({ t, t0, children, col = C.paper, size = 52 }) => {
  const p = ramp(t, t0 - 0.05, t0 + 0.2);
  return <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color: col, lineHeight: 1, whiteSpace: "nowrap", opacity: 0.2 + 0.8 * p, transform: `scale(${0.88 + 0.12 * p + 0.1 * Math.sin(Math.PI * ramp(t, t0, t0 + 0.3))})` }}>{children}</div>;
};

/* 2. Our diagram: 6 = 4 recti + 2 obliques */
export const V2: React.FC<{ s0: number; s1: number; six: number; rec: number; obl: number }> = ({ s0, s1, six, rec, obl }) => {
  const t = useT();
  const lit: Partial<Record<EM, number>> = { SR: rec, IR: rec + 0.1, MR: rec + 0.2, LR: rec + 0.3, SO: obl, IO: obl + 0.15 };
  const hot: EM[] = t >= obl - 0.05 ? ["SO", "IO"] : t >= rec - 0.05 ? ["SR", "IR", "MR", "LR"] : [];
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(14, pop(t, s0 + 0.05, 0.25))}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, background: C.forest, borderRadius: 28, padding: "10px 28px 14px" }}>
          <Tok t={t} t0={six} col={C.banana} size={70}>6</Tok>
          <Tok t={t} t0={rec - 0.1} size={46}>=</Tok>
          <Tok t={t} t0={rec} col="#F5A08F" size={52}>4 recti</Tok>
          <Tok t={t} t0={obl - 0.1} size={46}>+</Tok>
          <Tok t={t} t0={obl} col="#F5A08F" size={52}>2 obliques</Tok>
        </div>
      </div>
      <EyeBox t={t} top={128} h={752} id="v2" ks={[[s0, 0.8, 500, 520], [s1, 0.86, 500, 520]]} lit={lit} hot={hot}
        tags={[{ m: "SR", t: rec }, { m: "IR", t: rec + 0.1 }, { m: "MR", t: rec + 0.2 }, { m: "LR", t: rec + 0.3 }, { m: "SO", t: obl }, { m: "IO", t: obl + 0.15 }]} />
      <div style={center(892, { opacity: ramp(t, obl + 0.3, obl + 0.55) })}>
        <Pill size={30} bg={C.matcha}>rectus = straight · oblique = slanted</Pill>
      </div>
    </Scene>
  );
};

/* 3. Gray's Fig. 889 with MODERN labels as the 4 recti are named */
export const V3: React.FC<{ s0: number; s1: number; sr: number; ir: number; mr: number; lr: number }> = ({ s0, s1, sr, ir, mr, lr }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.006}>
      <div style={center(14, pop(t, s0 + 0.05, 0.25))}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#C9503C", border: `4px solid ${C.forest}`, borderRadius: 26, padding: "8px 22px 10px", fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.paper, whiteSpace: "nowrap" }}>
          4 RECTI
          {(["S", "I", "M", "L"] as const).map((l, i) => <div key={l} style={{ ...pop(t, [sr, ir, mr, lr][i], 0.25) }}><LChip l={l} size={56} col={C.forest} /></div>)}
        </div>
      </div>
      <PlateQ src={P889} aspect={A889} x={30} y={124} w={800} h={640} a={s0} b={s1} from={[0.5, 0.5, 0.98]} to={[0.48, 0.5, 0.9]} ls={34}
        labels={[
          { x: 0.56, y: 0.375, text: "superior rectus", t: sr, hot: t < ir, ox: -30, oy: -120 },
          { x: 0.5, y: 0.7, text: "inferior rectus", t: ir, hot: t >= ir && t < mr, ox: 60, oy: 130 },
          { x: 0.3, y: 0.53, text: "medial rectus", t: mr, hot: t >= mr && t < lr, ox: 30, oy: 150 },
          { x: 0.53, y: 0.537, text: "lateral rectus", t: lr, hot: t >= lr, ox: 20, oy: -175 },
        ]} />
      <div style={{ position: "absolute", left: 30, top: 790, opacity: ramp(t, lr + 0.35, lr + 0.6) }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 16px 10px", fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.forest, whiteSpace: "nowrap" }}>
          <span style={{ color: C.matcha }}>1918 atlas name:</span> “Rectus lateralis” = lateral rectus
        </div>
      </div>
      <div style={{ position: "absolute", left: 30, top: 864, opacity: ramp(t, s0 + 0.3, s0 + 0.55) }}>
        <Pill size={26} bg={C.forest}>Gray's Fig. 889 · right orbit, side view</Pill>
      </div>
    </Scene>
  );
};

/* 4. Nerve mnemonic: LR6 · SO4 (· R3) */
export const V4: React.FC<{ s0: number; s1: number; q: number; l: number; r: number; six: number; s: number; o: number; four: number; rest?: number; three?: number }> = ({ s0, s1, q, l, r, six, s, o, four, rest, three }) => {
  const t = useT();
  const Grp: React.FC<{ a: [string, number]; b: [string, number]; n: [string, number]; col: string; hot: boolean }> = ({ a, b, n, col, hot }) => (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, padding: "10px 18px 14px", borderRadius: 26, background: hot ? "rgba(247,246,236,0.12)" : "transparent", border: `4px solid ${hot ? col : "transparent"}` }}>
      {[a, b].map(([x, t0]) => <div key={x} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 132, color: C.paper, lineHeight: 1, ...pop(t, t0, 0.22) }}>{x}</div>)}
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 96, color: col, lineHeight: 1, marginBottom: -14, ...pop(t, n[1], 0.25) }}>{n[0]}</div>
    </div>
  );
  const Row: React.FC<{ name: string; n: 3 | 4 | 6; t0: number }> = ({ name, n, t0 }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 18, ...pop(t, t0, 0.25) }}>
      <div style={{ width: 92, height: 72, borderRadius: 20, background: NCOL[n], border: `4px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper }}>{NROM[n]}</div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper, whiteSpace: "nowrap" }}>{name} <span style={{ color: "#B9D27A", fontSize: 32 }}>→ {NNAME[n]}</span></div>
    </div>
  );
  const restOn = rest !== undefined;
  return (
    <Scene start={s0} end={s1} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 20, width: 820, height: 880, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, s0 + 0.02, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 36, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 4, color: C.banana, ...pop(t, q, 0.25) }}>EYE MUSCLE NERVES · MNEMONIC</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 96, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 8 }}>
          <Grp a={["L", l]} b={["R", r]} n={["6", six]} col={NCOL[6]} hot={t >= l && t < s} />
          <Grp a={["S", s]} b={["O", o]} n={["4", four]} col={NCOL[4]} hot={t >= s && (!restOn || t < (rest as number))} />
        </div>
        <div style={{ position: "absolute", left: 60, top: 330, display: "flex", flexDirection: "column", gap: 26 }}>
          <Row name="Lateral rectus" n={6} t0={six + 0.1} />
          <Row name="Superior oblique" n={4} t0={four + 0.1} />
          {restOn ? <Row name="The other 4" n={3} t0={three as number} /> : (
            <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: 0.35 * ramp(t, four + 0.4, four + 0.7) }}>
              <div style={{ width: 92, height: 72, borderRadius: 20, border: `4px dashed ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper }}>?</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper }}>the other 4</div>
            </div>
          )}
        </div>
        {restOn && (
          <div style={{ position: "absolute", left: 40, width: 740, top: 640, display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", opacity: ramp(t, (rest as number) - 0.05, (rest as number) + 0.25) }}>
            {(["SR", "IR", "MR", "IO"] as EM[]).map((m, i) => (
              <div key={m} style={{ background: NCOL[3], color: C.paper, borderRadius: 16, padding: "6px 16px 9px", fontFamily: FONT, fontWeight: 800, fontSize: 32, ...pop(t, (rest as number) + i * 0.08, 0.22) }}>{ENAME[m].toLowerCase()}</div>
            ))}
          </div>
        )}
        <div style={{ position: "absolute", left: 0, width: 820, top: 800, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: "#B9D27A", opacity: ramp(t, six + 0.3, six + 0.6) }}>
          LR6 · SO4 · the rest 3
        </div>
      </div>
    </Scene>
  );
};

/* 4b. Gray's Fig. 890: the nerves entering the orbit, CN VI + CN IV picked out */
export const V4b: React.FC<{ s0: number; s1: number; lr: number; n6: number; so: number; n4: number }> = ({ s0, s1, lr, n6, so, n4 }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.006}>
      <div style={center(14, pop(t, s0 + 0.05, 0.25))}>
        <div style={{ display: "flex", gap: 14 }}>
          <div style={{ background: NCOL[6], border: `4px solid ${C.forest}`, borderRadius: 22, padding: "6px 20px 10px", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper, whiteSpace: "nowrap", ...pop(t, n6, 0.25) }}>LR → VI</div>
          <div style={{ background: NCOL[4], border: `4px solid ${C.forest}`, borderRadius: 22, padding: "6px 20px 10px", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper, whiteSpace: "nowrap", ...pop(t, n4, 0.25) }}>SO → IV</div>
        </div>
      </div>
      <PlateQ src={P890} aspect={A890} x={30} y={110} w={800} h={690} a={s0} b={s1} from={[0.5, 0.52, 1.0]} to={[0.5, 0.52, 0.94]} ls={32}
        labels={[
          { x: 0.4, y: 0.49, text: "lateral rectus", t: lr, hot: t < n6, ox: -40, oy: -120 },
          { x: 0.19, y: 0.885, text: "CN VI · abducens", t: n6, hot: t >= n6 && t < so, ox: 40, oy: -70 },
          { x: 0.585, y: 0.462, text: "superior oblique", t: so, hot: t >= so && t < n4, ox: 30, oy: 150 },
          { x: 0.77, y: 0.11, text: "CN IV · trochlear", t: n4, hot: t >= n4, ox: -10, oy: 80 },
        ]} />
      <div style={{ position: "absolute", left: 30, top: 826, opacity: ramp(t, n6 + 0.35, n6 + 0.6) }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 16px 10px", fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.forest, whiteSpace: "nowrap" }}>
          <span style={{ color: C.matcha }}>1918 atlas name:</span> “Abducent nerve” = abducens
        </div>
      </div>
    </Scene>
  );
};

/* 4c. Our diagram coloured by nerve: the other 4 = CN III */
export const V4c: React.FC<{ s0: number; s1: number; rest: number; three: number }> = ({ s0, s1, rest, three }) => {
  const t = useT();
  const lit: Partial<Record<EM, number>> = { SR: s0 - 1, IR: s0 - 1, MR: s0 - 1, LR: s0 - 1, SO: s0 - 1, IO: s0 - 1 };
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(14, pop(t, s0 + 0.05, 0.25))}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: NCOL[3], border: `4px solid ${C.forest}`, borderRadius: 26, padding: "8px 24px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.paper, whiteSpace: "nowrap" }}>
          the other 4 → <span style={{ background: C.paper, color: NCOL[3], borderRadius: 12, padding: "0 12px 4px", ...pop(t, three, 0.25) }}>CN III</span>
        </div>
      </div>
      <EyeBox t={t} top={128} h={752} id="v4c" ks={[[s0, 0.84, 500, 520], [s1, 0.9, 500, 520]]} lit={lit} nerve={1} hot={t >= rest ? ["SR", "IR", "MR", "IO"] : []}
        tags={EORDER.map((m) => ({ m, t: m === "LR" || m === "SO" ? s0 : rest, nerve: true }))} />
      <div style={center(892, { opacity: ramp(t, three + 0.1, three + 0.35) })}>
        <Pill size={30} bg={C.forest}>CN III = oculomotor (+ levator, lifts the lid)</Pill>
      </div>
    </Scene>
  );
};

/* 5. Quick test with 3-2-1 */
export const V5: React.FC<{ s0: number; s1: number; q: number; cd: [number, number][] }> = ({ s0, s1, q, cd }) => {
  const t = useT();
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < s1) { n = v; n0 = s; } });
  const OPTS: [string, string][] = [["Oculomotor", "CN III"], ["Trochlear", "CN IV"], ["Abducens", "CN VI"], ["Optic", "CN II"]];
  return (
    <Scene start={s0} end={s1}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, s0 + 0.05, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 42, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 30, width: 760, top: 100, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 58, lineHeight: 1.1, color: C.paper, ...pop(t, q) }}>
          Which nerve moves the <span style={{ color: C.banana }}>superior oblique</span>?
        </div>
        <div style={{ position: "absolute", left: 60, top: 310, width: 700, display: "flex", flexDirection: "column", gap: 18 }}>
          {OPTS.map(([nm, cn], i) => (
            <div key={nm} style={{ height: 80, borderRadius: 22, background: "rgba(247,246,236,0.08)", border: "3px solid rgba(247,246,236,0.18)", display: "flex", alignItems: "center", gap: 16, padding: "0 16px", boxSizing: "border-box", ...pop(t, q + 0.5 + i * 0.08, 0.25) }}>
              <div style={{ width: 54, height: 54, borderRadius: 27, background: "rgba(247,246,236,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.banana }}>{"ABCD"[i]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper, whiteSpace: "nowrap" }}>{nm}</div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: "#B9D27A", whiteSpace: "nowrap" }}>{cn}</div>
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

/* 6. Answer on our diagram: superior oblique + its pulley, eye looks down + out */
export const V6: React.FC<{ s0: number; s1: number }> = ({ s0, s1 }) => {
  const t = useT();
  const lk = ramp(t, s0 + 0.4, s0 + 0.9);
  return (
    <Scene start={s0} end={s1} push={0.006}>
      <div style={center(14, pop(t, s0 + 0.05, 0.25))}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, background: NCOL[4], border: `4px solid ${C.forest}`, borderRadius: 26, padding: "10px 26px 14px 12px" }}>
          <div style={{ width: 82, height: 72, borderRadius: 18, background: C.forest, color: C.paper, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40 }}>IV</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.paper, whiteSpace: "nowrap" }}>✓ Trochlear nerve</div>
        </div>
      </div>
      <EyeBox t={t} top={128} h={712} id="v6" ks={[[s0, 0.92, 600, 430], [s1, 0.98, 600, 440]]}
        lit={{ SO: s0 - 1, SR: s0 - 1, IR: s0 - 1, MR: s0 - 1, LR: s0 - 1, IO: s0 - 1 }} hot={["SO"]} dim={1} look={[-0.55 * lk, 0.55 * lk]} labels={false} />
      <div style={center(852, pop(t, s0 + 0.45, 0.25))}>
        <Pill size={36} bg={C.banana} color={C.forest}>trochlea = pulley → trochlear nerve</Pill>
      </div>
    </Scene>
  );
};

/* 7. Save + cheat sheet */
export const V7: React.FC<{ s0: number; s1: number }> = ({ s0, s1 }) => {
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
      <div style={{ position: "absolute", left: 30, top: 190, width: 800, height: 720, borderRadius: 40, background: C.card, border: `3px solid ${C.line}`, boxShadow: "0 18px 40px rgba(31,42,20,0.12)", padding: "24px 34px", boxSizing: "border-box", ...pop(t, s0 + 0.15, 0.3) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.matcha, letterSpacing: 2 }}>6 EXTRAOCULAR MUSCLES · NERVES</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.forest, marginTop: 6, whiteSpace: "nowrap" }}>
          <span style={{ color: NCOL[6] }}>LR6</span> · <span style={{ color: NCOL[4] }}>SO4</span> · <span style={{ color: NCOL[3] }}>rest 3</span>
        </div>
        <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 26 }}>
          {EORDER.map((m, i) => (
            <div key={m} style={{ display: "flex", alignItems: "center", gap: 16, opacity: ramp(t, s0 + 0.2 + i * 0.06, s0 + 0.4 + i * 0.06) }}>
              <div style={{ width: 80, height: 64, flex: "0 0 80px", borderRadius: 16, background: ECOL(m), color: C.paper, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34 }}>{NROM[ENERVE[m]]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest, whiteSpace: "nowrap", lineHeight: 1.05 }}>{ENAME[m]}</div>
              <div style={{ marginLeft: "auto", fontFamily: FONT, fontWeight: 700, fontSize: 27, color: C.matcha, whiteSpace: "nowrap" }}>{EACT[m]}</div>
            </div>
          ))}
        </div>
      </div>
    </Scene>
  );
};

/* 8. End card (≤ 1.5 s) */
export const V8: React.FC<{ s0: number; s1: number }> = ({ s0, s1 }) => {
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

/* TikTok: the lateral rectus on our diagram, eye turns out, its odd nerve CN VI */
export const TT2: React.FC<{ s0: number; s1: number; odd: number; six: number }> = ({ s0, s1, odd, six }) => {
  const t = useT();
  const lk = ramp(t, s0 + 0.2, s0 + 0.8);
  const n6 = t >= six - 0.05;
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(14, pop(t, s0 + 0.05, 0.25))}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: n6 ? NCOL[6] : "#C9503C", border: `4px solid ${C.forest}`, borderRadius: 26, padding: "8px 24px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.paper, whiteSpace: "nowrap" }}>
          LATERAL RECTUS → {n6 ? <span style={{ background: C.paper, color: NCOL[6], borderRadius: 12, padding: "0 12px 4px", ...pop(t, six, 0.25) }}>CN VI</span> : <span style={{ opacity: ramp(t, odd, odd + 0.3) }}>?</span>}
        </div>
      </div>
      <EyeBox t={t} top={128} h={752} id="tt2" ks={[[s0, 0.84, 470, 520], [s1, 0.98, 400, 520]]}
        lit={{ LR: s0 - 1, SR: s0 - 1, IR: s0 - 1, MR: s0 - 1, SO: s0 - 1, IO: s0 - 1 }} hot={["LR"]} dim={1} look={[-0.6 * lk, 0]} nerve={n6 ? 1 : 0} />
      <div style={center(892, pop(t, six + 0.1, 0.25))}>
        <Pill size={34} bg={C.banana} color={C.forest}>abducens · it ABducts the eye</Pill>
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
