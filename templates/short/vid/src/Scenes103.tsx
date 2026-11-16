import React from "react";
import { C, FONT, Pill, Scene, ramp, useT } from "./kit";
import { Big, pop } from "./Scenes67";
import { Loud, PlateQ, QS } from "./Scenes93";
import { Chip } from "./Portal99";
import { EANCH, EK, ENAME, Exits, FANCH, TCOL, TK, TNAME, TriFace } from "./Trig103";

export const P778 = "plates/trigem778.png";
export const A778 = 1713 / 1728;
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* hook target on Gray's Fig. 778: the trigeminal nerve at its ganglion (1918 "Semilunar Ganglion", root marked "5th").
   "?" stickers over the printed "Semilunar Ganglion" and "5th" — they flip off at the reveal. */
export const HOOKPIN = { x: 0.333, y: 0.262 };
export const hookStick = (off: number): QS[] => [
  { x0: 0.258, y0: 0.238, x1: 0.398, y1: 0.284, rot: -52, off },
  { x0: 0.256, y0: 0.196, x1: 0.298, y1: 0.244, rot: -60, off },
];

export type Tm = { reveal: number; ticks: number[]; cn5: number; split?: [number, number, number]; hookEnd: number };
export const TM_MAIN: Tm = { reveal: 3.51, ticks: [1.8, 2.4, 3.0], cn5: 4.18, split: [5.62, 5.95, 6.11], hookEnd: 6.66 };
export const TM_TT: Tm = { reveal: 3.51, ticks: [1.8, 2.4, 3.0], cn5: 4.29, hookEnd: 5.62 };

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

/* 1. Quiz hook on Gray's Fig. 778 — red pin on the trigeminal ganglion from frame 1, "?" over its printed names, 3-2-1, reveal; then V1/V2/V3 on the plate's 1-2-3 */
export const T1: React.FC<{ tm: Tm }> = ({ tm }) => {
  const t = useT();
  const R = tm.reveal;
  const rv = ramp(t, R, R + 0.25);
  const sp = tm.split;
  return (
    <Scene start={-0.6} end={tm.hookEnd} push={0.02}>
      <div style={center(0, { opacity: 1 - rv })}>
        <Loud size={112}>NAME THIS</Loud>
      </div>
      <div style={center(118, { opacity: 1 - rv })}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ background: "#E5251A", border: "7px solid #111", borderRadius: 18, padding: "0 22px 6px", transform: "rotate(-2deg)" }}><Loud size={84}>NERVE</Loud></div>
          <Loud size={60}>IN 3 SEC</Loud>
        </div>
      </div>
      {rv > 0 && (
        <div style={center(10, pop(t, R, 0.3))}>
          <div style={{ textAlign: "center" }}>
            <Big size={88} color={C.forest}>✓ TRIGEMINAL</Big>
            <div style={{ height: 18 }} />
            <div style={{ display: "flex", justifyContent: "center", ...pop(t, tm.cn5, 0.3) }}>
              <Pill size={40} bg={C.red} color={C.paper}>cranial nerve 5 · CN V</Pill>
            </div>
          </div>
        </div>
      )}
      <PlateQ src={P778} aspect={A778} x={30} y={262} w={800} h={640} a={-0.6} b={tm.hookEnd} from={[0.345, 0.285, 0.5]} to={[0.4, 0.3, 0.6]}
        pin={{ ...HOOKPIN, t0: -1, t1: R + 0.2, r: 78 }} stickers={hookStick(R)} ls={38}
        labels={[
          ...(!sp || t < sp[0] - 0.05 ? [{ x: 0.333, y: 0.262, text: "trigeminal ganglion", t: R + 0.05, hot: true, ox: 30, oy: 200 }] : []),
          ...(sp ? [
            { x: 0.392, y: 0.248, text: "V1 ophthalmic", t: sp[0], hot: true, ox: 40, oy: -120 },
            { x: 0.455, y: 0.3, text: "V2 maxillary", t: sp[1], hot: true, ox: 70, oy: 50 },
            { x: 0.345, y: 0.375, text: "V3 mandibular", t: sp[2], hot: true, ox: 50, oy: 130 },
          ] : []),
        ]} />
      <div style={{ position: "absolute", left: 40, top: 700 }}>
        <Ring t={t} size={170} tm={tm} />
      </div>
      <div style={{ position: "absolute", left: 50, top: 282, ...pop(t, R + 0.75, 0.3) }}>
        <Note><span style={{ color: C.matcha }}>1918 atlas name:</span> “Semilunar ganglion”</Note>
      </div>
      <div style={center(898, pop(t, 0.05, 0.25))}>
        {t < R ? <Pill size={34} bg={C.forest}>anatomy quiz · + its 3 branches after</Pill> : (
          <div style={{ ...pop(t, R + 0.4, 0.25) }}><Pill size={36} bg={C.banana} color={C.forest}>trigeminal nerve · mnemonic</Pill></div>
        )}
      </div>
    </Scene>
  );
};

/* ---- camera box for our diagrams ---- */
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
export type Tag = { a: [number, number]; t: number; dx: number; dy: number; col: string; text: string; size?: number; t1?: number };
const Box: React.FC<{ t: number; ks: Kf[]; top: number; h: number; vw: number; note?: string; tags?: Tag[]; render: (s: number) => React.ReactNode }> = ({ t, ks, top, h, vw, note, tags = [], render }) => {
  const [, s, cx, cy] = cam(t, ks);
  const X0 = 430 - cx * s, Y0 = h / 2 - cy * s;
  return (
    <div style={{ position: "absolute", left: 0, top, width: 860, height: h, overflow: "hidden", borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}` }}>
      <div style={{ position: "absolute", left: X0, top: Y0, width: vw * s }}>{render(s)}</div>
      {tags.map(({ a, t: t0, dx, dy, size, t1, col, text }, i) => {
        const p = ramp(t, t0 - 0.05, t0 + 0.2) * (t1 === undefined ? 1 : 1 - ramp(t, t1, t1 + 0.2));
        if (p <= 0) return null;
        const x = X0 + a[0] * s, y = Y0 + a[1] * s;
        return (
          <React.Fragment key={i}>
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
const ftag = (k: TK | "x", a: string, t: number, dx: number, dy: number, text: string, size = 36, t1?: number, col?: string): Tag => ({ a: FANCH[a], t, dx, dy, col: col ?? (k === "x" ? C.forest : TCOL[k]), text, size, t1 });

/* header: three division dots */
const Three: React.FC<{ t: number; on: [TK, number][]; title: string; tt: number }> = ({ t, on, title, tt }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16, background: C.forest, borderRadius: 26, padding: "8px 26px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper, whiteSpace: "nowrap" }}>
    <span style={{ fontSize: 62, color: C.banana, ...pop(t, tt, 0.25) }}>3</span> {title}
    <span style={{ display: "inline-flex", gap: 8, marginLeft: 6 }}>
      {on.map(([k, t0]) => (
        <span key={k} style={{ width: 30, height: 30, borderRadius: 15, background: t >= t0 - 0.05 ? TCOL[k] : "rgba(247,246,236,0.18)", border: `3px solid ${C.paper}`, transform: `scale(${1 + 0.3 * Math.sin(Math.PI * ramp(t, t0, t0 + 0.3))})` }} />
      ))}
    </span>
  </div>
);
const DivHead: React.FC<{ t: number; k: TK; t0: number }> = ({ t, k, t0 }) => (
  <div key={k} style={{ display: "flex", alignItems: "center", gap: 18, background: TCOL[k], border: `4px solid ${C.forest}`, borderRadius: 26, padding: "6px 26px 12px", fontFamily: FONT, fontWeight: 800, color: C.paper, whiteSpace: "nowrap", ...pop(t, t0, 0.25) }}>
    <span style={{ fontSize: 60 }}>{k}</span>
    <span style={{ fontSize: 50 }}>{TNAME[k]}</span>
  </div>
);

/* 2. Face map: V1 → V2 → V3 (+ chewing muscles), then the whole map held ≥ 1.5 s */
export const T2: React.FC<{ s0: number; s1: number; v1: number; fore: number; lid: number; v2: number; cheek: number; lip: number; v3: number; chin: number; low: number; chew: number; all: number }> = ({ s0, s1, v1, fore, lid, v2, cheek, lip, v3, chin, low, chew, all }) => {
  const t = useT();
  const cur: TK = t >= v3 - 0.05 ? "V3" : t >= v2 - 0.05 ? "V2" : "V1";
  const allOn = t >= all - 0.05;
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, {})}>
        {allOn ? <div style={pop(t, all, 0.25)}><Three t={t} tt={all} title="SKIN ZONES · CN V" on={[["V1", 0], ["V2", 0], ["V3", 0]]} /></div> : <DivHead t={t} k={cur} t0={cur === "V1" ? s0 + 0.03 : cur === "V2" ? v2 : v3} />}
      </div>
      <Box t={t} top={124} h={756} vw={800} note={allOn ? "" : "front view · Book Plume diagram"}
        ks={[[s0, 0.95, 400, 420], [v1 + 0.2, 1.0, 400, 330], [v2 - 0.3, 1.0, 400, 360], [v2 + 0.3, 1.05, 400, 540], [v3 - 0.3, 1.05, 400, 560], [v3 + 0.3, 1.0, 400, 740], [all - 0.25, 1.0, 400, 720], [all + 0.35, 0.84, 400, 470], [s1, 0.84, 400, 470]]}
        render={(s) => <TriFace t={t} w={800 * s} id="f2" lit={{ V1: v1, V2: v2, V3: v3 }} hot={allOn ? [] : [cur]} dimRest={0.45} chew={ramp(t, chew, chew + 0.3) * (allOn ? 0.6 : 1)} angle={ramp(t, all + 0.3, all + 0.6)} faint={0.1} />}
        tags={[
          ftag("V1", "V1", fore, 190, -10, "forehead", 38, v3 - 0.3), ftag("V1", "V1lid", lid, -170, -60, "upper eyelid", 36, v3 - 0.3),
          ftag("V2", "V2", cheek, -60, 120, "cheek", 38, all - 0.3), ftag("V2", "V2lip", lip, 200, 10, "upper lip", 36, all - 0.3),
          ftag("V3", "V3chin", chin, 170, 30, "chin", 38, all - 0.3), ftag("V3", "V3", low + 0.05, -150, -100, "lower lip", 36, all - 0.3),
          ftag("x", "CHEW", chew, -60, 110, "💪 chewing muscles", 32, undefined, "#B23A2E"),
          ftag("V1", "V1r", all + 0.1, 150, 20, "V1", 46), ftag("V2", "V2r", all + 0.2, 150, 30, "V2", 46), ftag("V3", "V3r", all + 0.3, 150, 40, "V3", 46),
          ftag("x", "ANGLE", all + 0.6, 40, 140, "angle of jaw = C2–C3, not CN V", 26, undefined, "#6F6B5C"),
        ]} />
      <div style={center(892, {})}>
        {allOn ? <div style={pop(t, all + 0.5, 0.25)}><Pill size={36} bg={C.banana} color={C.forest}>📸 screenshot this map</Pill></div>
          : cur === "V3" && t >= chew - 0.05 ? <div style={pop(t, chew, 0.25)}><Pill size={34} bg="#B23A2E" color={C.paper}>V3 = the only division with motor fibers</Pill></div>
            : <div key={cur} style={pop(t, cur === "V1" ? v1 + 0.3 : cur === "V2" ? v2 + 0.3 : v3 + 0.3, 0.25)}><Pill size={36} bg={TCOL[cur]} color={C.paper}>{cur === "V1" ? "top third of the face" : cur === "V2" ? "middle third of the face" : "bottom third + jaw"}</Pill></div>}
      </div>
    </Scene>
  );
};

/* mnemonic card: Standing Room Only */
const SRO: React.FC<{ t: number; on: [number, number, number]; hotR?: boolean; small?: boolean }> = ({ t, on, hotR, small }) => {
  const W: [string, string, TK][] = [["S", "tanding", "V1"], ["R", "oom", "V2"], ["O", "nly", "V3"]];
  const f = small ? 0.72 : 1;
  return (
    <div style={{ display: "flex", gap: 22 * f, alignItems: "flex-end", justifyContent: "center" }}>
      {W.map(([L, rest, k], i) => {
        const p = ramp(t, on[i] - 0.05, on[i] + 0.2);
        const dim = hotR && i !== 1 ? 0.4 : 1;
        return (
          <div key={L} style={{ display: "flex", alignItems: "baseline", fontFamily: FONT, fontWeight: 800, color: C.paper, opacity: (0.3 + 0.7 * p) * dim, transform: `scale(${1 + 0.1 * Math.sin(Math.PI * p)})` }}>
            <span style={{ background: p > 0.5 ? TCOL[k] : "rgba(247,246,236,0.15)", border: `4px solid ${C.banana}`, borderRadius: 18, padding: `0 ${14 * f}px ${6 * f}px`, fontSize: 92 * f, lineHeight: 1.05 }}>{L}</span>
            <span style={{ fontSize: 56 * f, marginLeft: 4 }}>{rest}</span>
          </div>
        );
      })}
    </div>
  );
};

/* 3. Exits: Standing Room Only → superior orbital fissure, rotundum, ovale */
export const T3: React.FC<{ s0: number; s1: number; mn: [number, number, number]; sof: number; rot: number; ova: number }> = ({ s0, s1, mn, sof, rot, ova }) => {
  const t = useT();
  const lit: Partial<Record<TK, number>> = { V1: sof, V2: rot, V3: ova };
  const hot: TK[] = t >= ova - 0.05 ? ["V3"] : t >= rot - 0.05 ? ["V2"] : t >= sof - 0.05 ? ["V1"] : [];
  const hh: EK[] = t >= ova - 0.05 ? ["OVA"] : t >= rot - 0.05 ? ["ROT"] : t >= sof - 0.05 ? ["SOF"] : [];
  const etag = (e: EK, t0: number, dx: number, dy: number, k: TK, text: string): Tag => ({ a: EANCH[e], t: t0, dx, dy, col: TCOL[k], text, size: 34 });
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 860, height: 250, borderRadius: 40, background: C.forest, ...pop(t, s0 + 0.03, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 860, top: 18, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: C.banana }}>EXITS FROM THE SKULL · MNEMONIC</div>
        <div style={{ position: "absolute", left: 0, width: 860, top: 74 }}><SRO t={t} on={mn} /></div>
      </div>
      <Box t={t} top={272} h={608} vw={860} note="schematic · Book Plume"
        ks={[[s0, 0.72, 430, 380], [s1, 0.75, 440, 385]]}
        render={(s) => <Exits t={t} w={860 * s} id="x3" lit={lit} hot={hot} hotHole={hh} />}
        tags={[
          etag("SOF", sof, -60, -80, "V1", "V1 → superior orbital fissure"),
          etag("ROT", rot, -260, -10, "V2", "V2 → rotundum"),
          etag("OVA", ova, -200, 100, "V3", "V3 → ovale"),
          { a: EANCH.GANG, t: s0 + 0.4, dx: -120, dy: 90, col: C.forest, text: "trigeminal ganglion", size: 26 },
        ]} />
    </Scene>
  );
};

/* 4. Quick test with 3-2-1 */
export const T4: React.FC<{ s0: number; s1: number; q: number; cd: [number, number][] }> = ({ s0, s1, q, cd }) => {
  const t = useT();
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < s1) { n = v; n0 = s; } });
  const OPTS = ["Superior orbital fissure", "Foramen rotundum", "Foramen ovale", "Foramen spinosum"];
  return (
    <Scene start={s0} end={s1}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, s0 + 0.05, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 42, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 30, width: 760, top: 100, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 58, lineHeight: 1.1, color: C.paper, ...pop(t, q) }}>
          Which hole does <span style={{ color: "#F4BE72" }}>V2 maxillary</span> use?
        </div>
        <div style={{ position: "absolute", left: 60, top: 300, width: 700, display: "flex", flexDirection: "column", gap: 18 }}>
          {OPTS.map((nm, i) => (
            <div key={nm} style={{ height: 82, borderRadius: 22, background: "rgba(247,246,236,0.08)", border: "3px solid rgba(247,246,236,0.18)", display: "flex", alignItems: "center", gap: 16, padding: "0 16px", boxSizing: "border-box", ...pop(t, q + 0.5 + i * 0.08, 0.25) }}>
              <div style={{ width: 54, height: 54, borderRadius: 27, background: "rgba(247,246,236,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.banana }}>{"ABCD"[i]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper, whiteSpace: "nowrap" }}>{nm}</div>
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

/* 5. Answer: foramen rotundum, R for Room */
export const T5: React.FC<{ s0: number; s1: number; ans: number; room: number }> = ({ s0, s1, ans, room }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, pop(t, s0 + 0.05, 0.25))}>
        <div style={{ background: "#E5251A", border: `4px solid ${C.forest}`, borderRadius: 26, padding: "10px 30px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 54, color: C.paper, whiteSpace: "nowrap" }}>✓ B · Foramen rotundum</div>
      </div>
      <Box t={t} top={124} h={560} vw={860} note=""
        ks={[[s0, 0.66, 430, 410], [s1, 0.7, 440, 410]]}
        render={(s) => <Exits t={t} w={860 * s} id="x5" lit={{ V1: 0, V2: 0, V3: 0 }} hot={["V2"]} hotHole={["ROT"]} />}
        tags={[{ a: EANCH.ROT, t: ans, dx: -250, dy: -40, col: TCOL.V2, text: "V2 → rotundum", size: 38 }, { a: EANCH.ROT, t: ans + 0.4, dx: -200, dy: 90, col: C.forest, text: "round hole", size: 30 }]} />
      <div style={{ position: "absolute", left: 0, top: 700, width: 860, height: 200, borderRadius: 40, background: C.forest, display: "flex", flexDirection: "column", gap: 12, alignItems: "center", justifyContent: "center", ...pop(t, room, 0.3) }}>
        <SRO t={t} on={[0, 0, 0]} hotR small />
        <Pill size={38} bg={C.banana} color={C.forest}>R = Room = Rotundum</Pill>
      </div>
    </Scene>
  );
};

/* 6. end card ≤ 1.5 s */
export const T6: React.FC<{ s0: number; s1: number; channel?: boolean }> = ({ s0, s1 }) => {
  const t = useT();
  const ROWS: [TK, string, string][] = [["V1", "ophthalmic", "forehead · upper eyelid → SOF"], ["V2", "maxillary", "cheek · upper lip → rotundum"], ["V3", "mandibular", "chin · lower lip · chewing → ovale"]];
  return (
    <Scene start={s0} end={s1}>
      <div style={{ position: "absolute", left: 30, top: 20, width: 800, height: 860, borderRadius: 44, background: C.forest, ...pop(t, s0 + 0.02, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 800, top: 44, textAlign: "center" }}><Loud size={84}>SAVE THIS</Loud></div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 146, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: "#B9D27A" }}>trigeminal nerve · for your next exam</div>
        <div style={{ position: "absolute", left: 40, top: 220, width: 720, display: "flex", flexDirection: "column", gap: 18 }}>
          {ROWS.map(([k, nm, b], i) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 18, background: "rgba(247,246,236,0.08)", borderRadius: 24, padding: 12, ...pop(t, s0 + 0.1 + i * 0.07, 0.22) }}>
              <div style={{ width: 250, height: 92, borderRadius: 20, background: TCOL[k], display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, color: C.paper, lineHeight: 1 }}>
                <div style={{ fontSize: 40 }}>{k}</div><div style={{ fontSize: 26 }}>{nm}</div>
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 29, color: C.paper, lineHeight: 1.2 }}>{b}</div>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 648, display: "flex", justifyContent: "center", ...pop(t, s0 + 0.25, 0.25) }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.banana }}>Standing · Room · Only</div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 718, display: "flex", justifyContent: "center", ...pop(t, s0 + 0.4, 0.25) }}>
          <div style={{ background: C.banana, color: C.forest, borderRadius: 50, padding: "14px 44px", fontFamily: FONT, fontWeight: 800, fontSize: 42 }}>🔖 SAVE THIS · + FOLLOW</div>
        </div>
      </div>
    </Scene>
  );
};

/* TikTok: face map V1/V2/V3 */
export const TTFace: React.FC<{ s0: number; s1: number; v1: number; fore: number; v2: number; cheek: number; v3: number; jaw: number }> = ({ s0, s1, v1, fore, v2, cheek, v3, jaw }) => {
  const t = useT();
  const cur: TK = t >= v3 - 0.05 ? "V3" : t >= v2 - 0.05 ? "V2" : "V1";
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, pop(t, s0 + 0.03, 0.25))}>
        <Three t={t} tt={s0 + 0.1} title="BRANCHES · CN V" on={[["V1", v1], ["V2", v2], ["V3", v3]]} />
      </div>
      <Box t={t} top={124} h={756} vw={800} note=""
        ks={[[s0, 0.74, 400, 505], [v1 - 0.1, 0.74, 400, 505], [v1 + 0.3, 0.92, 400, 360], [v2 + 0.3, 0.92, 400, 520], [v3 + 0.3, 0.92, 400, 700], [s1, 0.8, 400, 600]]}
        render={(s) => <TriFace t={t} w={800 * s} id="ft" lit={{ V1: v1, V2: v2, V3: v3 }} hot={t < v1 - 0.05 ? [] : [cur]} dimRest={0.45} faint={0.1} />}
        tags={[
          ftag("V1", "V1", fore, 190, -10, "V1 · forehead", 40), ftag("V2", "V2", cheek, -40, 130, "V2 · cheek", 40), ftag("V3", "V3", jaw, -120, 60, "V3 · jaw", 40),
        ]} />
      <div style={center(892, {})}>
        <div key={cur} style={pop(t, cur === "V1" ? v1 : cur === "V2" ? v2 : v3, 0.25)}><Pill size={38} bg={TCOL[cur]} color={C.paper}>{cur} · {TNAME[cur]}</Pill></div>
      </div>
    </Scene>
  );
};
export { ENAME };
