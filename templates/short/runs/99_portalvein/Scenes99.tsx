import React from "react";
import { C, FONT, Pill, Scene, ramp, useT } from "./kit";
import { Big, pop } from "./Scenes67";
import { Loud, PlateQ, QS } from "./Scenes93";
import { Chip, PANCH, PCOL, PNAME, PSHORT, PV, Portal } from "./Portal99";

export const P591 = "plates/portal591.png";
export const A591 = 1431 / 2200;
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* hook target on Gray's Fig. 591: the portal vein trunk; "?" sticker over its printed name "Portal Vein" */
export const HOOKPIN = { x: 0.428, y: 0.336 };
export const hookStick = (off: number): QS => ({ x0: 0.338, y0: 0.218, x1: 0.418, y1: 0.305, rot: 0, off });

export type Tm = { reveal: number; ticks: number[]; pow: number; hookEnd: number };
export const TM_MAIN: Tm = { reveal: 3.53, ticks: [1.92, 2.5, 3.06], pow: 4.05, hookEnd: 4.95 };
export const TM_TT: Tm = { reveal: 3.53, ticks: [1.92, 2.5, 3.06], pow: 4.05, hookEnd: 4.95 };

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

/* 1. Quiz hook: Gray's Fig. 591, red pin on the portal vein from frame 1, "?" over its printed name, 3-2-1, reveal */
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
          <div style={{ background: "#E5251A", border: "7px solid #111", borderRadius: 18, padding: "0 22px 6px", transform: "rotate(-2deg)" }}><Loud size={86}>VEIN</Loud></div>
          <Loud size={60}>IN 3 SEC</Loud>
        </div>
      </div>
      {rv > 0 && (
        <div style={center(16, pop(t, R, 0.3))}>
          <div style={{ textAlign: "center" }}>
            <Big size={62} color={C.forest}>✓ HEPATIC PORTAL VEIN</Big>
            <div style={{ height: 22 }} />
            <div style={{ display: "flex", justifyContent: "center", ...pop(t, tm.pow, 0.3) }}>
              <Pill size={40} bg={C.red} color={C.paper}>gut blood → liver first</Pill>
            </div>
          </div>
        </div>
      )}
      <PlateQ src={P591} aspect={A591} x={30} y={262} w={800} h={640} a={-0.6} b={tm.hookEnd} from={[0.46, 0.33, 0.62]} to={[0.44, 0.32, 0.52]}
        pin={{ ...HOOKPIN, t0: -1, t1: R + 0.2, r: 70 }} stickers={[hookStick(R)]}
        labels={[{ x: HOOKPIN.x, y: HOOKPIN.y, text: "hepatic\nportal vein", t: R + 0.02, hot: true, ox: -30, oy: 190 }]} ls={40} />
      <div style={{ position: "absolute", left: 40, top: 680 }}>
        <Ring t={t} size={170} tm={tm} />
      </div>
      <div style={center(898, pop(t, 0.05, 0.25))}>
        {t < R ? <Pill size={34} bg={C.forest}>anatomy quiz · say it before the 1</Pill> : (
          <div style={{ ...pop(t, R + 0.4, 0.25) }}><Pill size={36} bg={C.banana} color={C.forest}>portal vein tributaries · mnemonic</Pill></div>
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

type Tag = { m: string; label: string; col: string; t: number; dx?: number; dy?: number; size?: number };
export const PortalBox: React.FC<{ t: number; ks: Kf[]; top: number; h: number; id: string; tags?: Tag[]; note?: string; children?: React.ReactNode } & Omit<React.ComponentProps<typeof Portal>, "w" | "id" | "t">> = ({ t, ks, top, h, id, tags = [], note = "front view · Book Plume diagram", children, ...rest }) => {
  const [, s, cx, cy] = cam(t, ks);
  const X0 = 430 - cx * s, Y0 = h / 2 - cy * s;
  return (
    <div style={{ position: "absolute", left: 0, top, width: 860, height: h, overflow: "hidden", borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}` }}>
      <div style={{ position: "absolute", left: X0, top: Y0 }}>
        <Portal t={t} w={1000 * s} id={id} {...rest} />
      </div>
      {tags.map(({ m, label, col, t: t0, dx = 0, dy = 0, size }) => {
        const p = ramp(t, t0 - 0.05, t0 + 0.2);
        if (p <= 0) return null;
        const [ax, ay] = PANCH[m];
        return <Chip key={m + label} x={X0 + ax * s + dx} y={Y0 + ay * s + dy} p={p} col={col} size={size}>{label}</Chip>;
      })}
      <div style={{ position: "absolute", left: 18, top: 16, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.forest, background: "rgba(255,254,246,0.9)", borderRadius: 12, padding: "4px 12px" }}>{note}</div>
      {children}
    </div>
  );
};
const ALL: Partial<Record<PV, number>> = { PV: -9, SPL: -9, SMV: -9, IMV: -9, LG: -9, RG: -9, CY: -9, PU: -9 };

/* 2. Gut blood hits the liver first, then the heart — our diagram with flowing blood */
export const V2: React.FC<{ s0: number; s1: number; gut: number; liver: number; heart: number; head?: string }> = ({ s0, s1, gut, liver, heart, head = "LIVER FIRST" }) => {
  const t = useT();
  const ivc = ramp(t, heart - 0.5, heart);
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(14, pop(t, s0 + 0.05, 0.25))}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, background: C.forest, borderRadius: 26, padding: "8px 26px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper, whiteSpace: "nowrap" }}>
          <span style={{ color: t >= gut - 0.05 ? C.banana : C.paper }}>GUT</span> → <span style={{ color: t >= liver - 0.05 ? C.banana : "rgba(247,246,236,0.35)" }}>{head}</span> → <span style={{ color: t >= heart - 0.05 ? "#FF8A7A" : "rgba(247,246,236,0.35)" }}>HEART</span>
        </div>
      </div>
      <PortalBox t={t} top={128} h={752} id="v2" ks={[[s0, 0.74, 500, 520], [liver, 0.76, 450, 450], [s1, 0.72, 470, 440]]}
        lit={ALL} hot={["PV"]} flow={ramp(t, s0, s0 + 0.4)} gut={gut} liver={liver} heart={heart} showIVC={ivc}
        tags={[{ m: "GUT", label: "gut", col: "#B9886A", t: gut }, { m: "LIVER", label: "liver", col: "#8E3E28", t: liver }, { m: "HEART", label: "heart", col: "#C2392B", t: heart, dx: 130, dy: 14 }, { m: "PV", label: "portal vein", col: PCOL.PV, t: s0 + 0.3, dx: -40, dy: 90 }]} />
      <div style={center(892, pop(t, liver + 0.15, 0.25))}>
        <Pill size={34} bg={C.banana} color={C.forest}>~75% of the liver's blood comes this way</Pill>
      </div>
    </Scene>
  );
};

/* 3. The trick: 2 · 1 · 4 */
const TRICK: [string, string, string][] = [["2", "build it", PCOL.SPL], ["1", "joins splenic", PCOL.IMV], ["4", "drain straight in", PCOL.LG]];
export const V3: React.FC<{ s0: number; s1: number; tok: number[] }> = ({ s0, s1, tok }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 820, height: 820, borderRadius: 48, background: C.forest, ...pop(t, s0 + 0.02, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 50, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: C.banana }}>PORTAL VEIN MNEMONIC</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 104, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.paper }}>just remember</div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 210, display: "flex", flexDirection: "column", gap: 34 }}>
          {TRICK.map(([n, txt, col], i) => {
            const on = t >= tok[i] - 0.05;
            return (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: 34, opacity: on ? 1 : 0.22, ...pop(t, tok[i], 0.22) }}>
                <div style={{ width: 150, height: 150, borderRadius: 75, background: on ? col : "rgba(247,246,236,0.1)", border: `7px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 104, color: C.paper, lineHeight: 1 }}>{n}</div>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 58, color: on ? C.paper : "rgba(247,246,236,0.5)", whiteSpace: "nowrap" }}>{txt}</div>
              </div>
            );
          })}
        </div>
      </div>
    </Scene>
  );
};

/* 4. Gray's Fig. 591: 2 build it — splenic + superior mesenteric, behind the pancreas */
export const V4: React.FC<{ s0: number; s1: number; spl: number; smv: number; panc?: number }> = ({ s0, s1, spl, smv, panc }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.006}>
      <div style={center(14, pop(t, s0 + 0.05, 0.25))}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: PCOL.SPL, border: `4px solid ${C.forest}`, borderRadius: 26, padding: "8px 26px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 64 }}>2</span> BUILD IT
        </div>
      </div>
      <PlateQ src={P591} aspect={A591} x={30} y={130} w={800} h={700} a={s0} b={s1} from={[0.56, 0.42, 0.78]} to={[0.54, 0.43, 0.7]} ls={36}
        pin={{ x: 0.432, y: 0.345, t0: smv + 0.4, t1: s1 + 1, r: 34 }}
        labels={[
          { x: 0.69, y: 0.36, text: "splenic vein", t: spl, hot: t < smv, ox: -40, oy: -150 },
          { x: 0.468, y: 0.56, text: "superior\nmesenteric vein", t: smv, hot: t >= smv, ox: 60, oy: 40 },
          ...(panc !== undefined ? [{ x: 0.6, y: 0.39, text: "pancreas", t: panc, hot: t < spl, ox: 60, oy: 110 }] : []),
        ]} />
      <div style={{ position: "absolute", left: 40, top: 480, ...pop(t, spl + 0.35, 0.3) }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 16px 10px", fontFamily: FONT, fontWeight: 800, fontSize: 27, color: C.forest, whiteSpace: "nowrap", boxShadow: "0 6px 0 rgba(31,42,20,0.12)" }}>
          <span style={{ color: C.matcha }}>1918 atlas name:</span> “Lienal”
        </div>
      </div>
      <div style={center(848, pop(t, smv + 0.45, 0.25))}>
        <Pill size={34} bg={C.forest}>they meet behind the neck of the pancreas</Pill>
      </div>
    </Scene>
  );
};

/* 5. 1 joins the splenic: inferior mesenteric (our diagram) */
export const V5: React.FC<{ s0: number; s1: number; spl: number; imv: number }> = ({ s0, s1, spl, imv }) => {
  const t = useT();
  const pre = s0 - 1;
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(14, pop(t, s0 + 0.05, 0.25))}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: PCOL.IMV, border: `4px solid ${C.forest}`, borderRadius: 26, padding: "8px 26px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 64 }}>1</span> JOINS THE SPLENIC
        </div>
      </div>
      <PortalBox t={t} top={128} h={752} id="v5" ks={[[s0, 0.84, 600, 620], [s1, 0.9, 630, 640]]}
        lit={{ PV: pre, SPL: pre, SMV: pre, IMV: imv - 0.2 }} hot={t >= imv ? ["IMV"] : t >= spl ? ["SPL"] : []} flow={1} join={imv + 0.3}
        tags={[{ m: "SPL", label: "splenic", col: PCOL.SPL, t: spl, dy: -70 }, { m: "SMV", label: "sup. mesenteric", col: PCOL.SMV, t: s0 + 0.2, dx: -100, dy: -40 }, { m: "IMV", label: "inferior mesenteric", col: PCOL.IMV, t: imv, dx: -10, dy: 90 }]} />
      <div style={center(892, pop(t, imv + 0.4, 0.25))}>
        <Pill size={34} bg={C.banana} color={C.forest}>not the portal vein directly · usually</Pill>
      </div>
    </Scene>
  );
};

/* 6. 4 drain straight in: left + right gastric, cystic, paraumbilical */
export const V6: React.FC<{ s0: number; s1: number; four: number; lg: number; rg: number; cy: number; pu: number }> = ({ s0, s1, four, lg, rg, cy, pu }) => {
  const t = useT();
  const pre = s0 - 1;
  const ks: PV[] = ["LG", "RG", "CY", "PU"];
  const tt: Record<string, number> = { LG: lg, RG: rg, CY: cy, PU: pu };
  let cur: PV | null = null;
  ks.forEach((k) => { if (t >= tt[k] - 0.05) cur = k; });
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(14, pop(t, s0 + 0.05, 0.25))}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: PCOL.LG, border: `4px solid ${C.forest}`, borderRadius: 26, padding: "8px 26px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 64, ...pop(t, four, 0.25) }}>4</span> DRAIN STRAIGHT IN
        </div>
      </div>
      <PortalBox t={t} top={128} h={752} id="v6" ks={[[s0, 0.92, 420, 430], [s1, 0.98, 410, 420]]}
        lit={{ PV: pre, SPL: pre, SMV: pre, IMV: pre, LG: lg, RG: rg, CY: cy, PU: pu }} hot={cur ? [cur] : ["PV"]} flow={1}
        tags={[{ m: "LG", label: "left gastric", col: PCOL.LG, t: lg, dx: 60, dy: -60 }, { m: "RG", label: "right gastric", col: PCOL.RG, t: rg, dx: 70, dy: 34 }, { m: "CY", label: "cystic", col: PCOL.CY, t: cy, dx: -20, dy: 40 }, { m: "PU", label: "paraumbilical", col: PCOL.PU, t: pu, dx: 20, dy: 80 }]} />
      <div style={{ position: "absolute", left: 30, top: 812, ...pop(t, lg + 0.35, 0.3) }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 16px 10px", fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.forest, whiteSpace: "nowrap" }}>
          <span style={{ color: C.matcha }}>1918 atlas:</span> “Coronary” = left gastric · “Pyloric” = right gastric
        </div>
      </div>
    </Scene>
  );
};

/* 7. Quick test with 3-2-1 */
export const V7: React.FC<{ s0: number; s1: number; q: number; cd: [number, number][] }> = ({ s0, s1, q, cd }) => {
  const t = useT();
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < s1) { n = v; n0 = s; } });
  const OPTS = ["Left gastric", "Inferior mesenteric", "Superior mesenteric", "Cystic"];
  return (
    <Scene start={s0} end={s1}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, s0 + 0.05, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 42, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 30, width: 760, top: 100, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 56, lineHeight: 1.1, color: C.paper, ...pop(t, q) }}>
          Which vein usually empties into the <span style={{ color: C.banana }}>splenic vein</span>?
        </div>
        <div style={{ position: "absolute", left: 60, top: 320, width: 700, display: "flex", flexDirection: "column", gap: 18 }}>
          {OPTS.map((nm, i) => (
            <div key={nm} style={{ height: 80, borderRadius: 22, background: "rgba(247,246,236,0.08)", border: "3px solid rgba(247,246,236,0.18)", display: "flex", alignItems: "center", gap: 16, padding: "0 16px", boxSizing: "border-box", ...pop(t, q + 0.5 + i * 0.08, 0.25) }}>
              <div style={{ width: 54, height: 54, borderRadius: 27, background: "rgba(247,246,236,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.banana }}>{"ABCD"[i]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper, whiteSpace: "nowrap" }}>{nm}</div>
              <div style={{ marginLeft: "auto", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.banana }}>?</div>
            </div>
          ))}
        </div>
        {n !== null ? (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 718, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 130, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        ) : (
          <div style={{ position: "absolute", left: 0, width: 820, top: 760, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#B9D27A", opacity: ramp(t, q + 1.0, q + 1.2) }}>pause · say it out loud</div>
        )}
      </div>
    </Scene>
  );
};

/* 8. Answer on Gray's Fig. 591: the inferior mesenteric vein climbing to the splenic */
export const V8: React.FC<{ s0: number; s1: number; joins: number }> = ({ s0, s1, joins }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.006}>
      <div style={center(14, pop(t, s0 + 0.05, 0.25))}>
        <div style={{ background: PCOL.IMV, border: `4px solid ${C.forest}`, borderRadius: 26, padding: "10px 30px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.paper, whiteSpace: "nowrap" }}>✓ Inferior mesenteric</div>
      </div>
      <PlateQ src={P591} aspect={A591} x={30} y={130} w={800} h={700} a={s0} b={s1} from={[0.63, 0.5, 0.72]} to={[0.62, 0.46, 0.66]} ls={36}
        pin={{ x: 0.575, y: 0.385, t0: joins, t1: s1 + 1, r: 34 }}
        labels={[
          { x: 0.712, y: 0.6, text: "inferior\nmesenteric vein", t: s0 + 0.15, hot: t < joins, ox: -40, oy: -70 },
          { x: 0.68, y: 0.36, text: "splenic vein", t: joins, hot: t >= joins, ox: 20, oy: -120 },
        ]} />
      <div style={center(848, pop(t, joins + 0.2, 0.25))}>
        <Pill size={34} bg={C.banana} color={C.forest}>it climbs up and joins the splenic first</Pill>
      </div>
    </Scene>
  );
};

/* 9. Save + cheat sheet */
export const V9: React.FC<{ s0: number; s1: number }> = ({ s0, s1 }) => {
  const t = useT();
  const bb = ramp(t, s0 + 0.05, s0 + 0.4);
  const ROWS: [string, string, string, string][] = [["2", "build it", "splenic + superior mesenteric", PCOL.SPL], ["1", "joins the splenic", "inferior mesenteric", PCOL.IMV], ["4", "drain straight in", "L + R gastric · cystic · paraumbilical", PCOL.LG]];
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
      <div style={{ position: "absolute", left: 30, top: 190, width: 800, height: 720, borderRadius: 40, background: C.card, border: `3px solid ${C.line}`, boxShadow: "0 18px 40px rgba(31,42,20,0.12)", padding: "26px 34px", boxSizing: "border-box", ...pop(t, s0 + 0.15, 0.3) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.matcha, letterSpacing: 2 }}>HEPATIC PORTAL VEIN · CHEAT SHEET</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest, marginTop: 6 }}>gut → <span style={{ color: "#8E3E28" }}>liver</span> → heart</div>
        <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 34 }}>
          {ROWS.map(([n, a, b, col], i) => (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 20, opacity: ramp(t, s0 + 0.2 + i * 0.07, s0 + 0.4 + i * 0.07) }}>
              <div style={{ width: 96, height: 96, flex: "0 0 96px", borderRadius: 48, background: col, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 62, color: C.paper }}>{n}</div>
              <div>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: col, whiteSpace: "nowrap" }}>{a}</div>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: b.length > 30 ? 34 : 44, color: C.forest, whiteSpace: "nowrap", lineHeight: 1.1 }}>{b}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Scene>
  );
};

export { PNAME, PSHORT };
