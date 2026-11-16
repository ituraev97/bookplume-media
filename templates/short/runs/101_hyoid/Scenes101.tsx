import React from "react";
import { C, FONT, Pill, Scene, ramp, useT } from "./kit";
import { Big, pop } from "./Scenes67";
import { Loud, PlateQ, QS } from "./Scenes93";
import { Chip } from "./Portal99";
import { HANCH, HCOL, HM, HNAME, Hyoid, INFRA, SUPRA } from "./Hyoid101";

export const P386 = "plates/neck386.png";
export const A386 = 2048 / 1505;
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* hook target on Gray's Fig. 386: the left omohyoid (inferior belly, running down to the scapula).
   "?" stickers over every printed "OMO-HYOIDEUS" that is in frame. */
export const HOOKPIN = { x: 0.3, y: 0.742 };
export const hookStick = (off: number): QS[] => [
  { x0: 0.24, y0: 0.656, x1: 0.448, y1: 0.699, rot: -47.4, off },
  { x0: 0.546, y0: 0.328, x1: 0.58, y1: 0.552, rot: 0, off },
  { x0: 0.638, y0: 0.796, x1: 0.707, y1: 0.846, rot: 22, off },
];

export type Tm = { reveal: number; ticks: number[]; pow: number; blade: number; hookEnd: number };
export const TM_MAIN: Tm = { reveal: 3.8, ticks: [2.05, 2.65, 3.25], pow: 4.69, blade: 6.49, hookEnd: 7.5 };
export const TM_TT: Tm = { reveal: 3.8, ticks: [2.05, 2.65, 3.25], pow: 4.69, blade: 6.49, hookEnd: 7.45 };

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

/* 1. Quiz hook: Gray's Fig. 386, red pin on the omohyoid from frame 1, "?" stickers over its printed name, 3-2-1, reveal, then pan to the scapula */
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
            <Big size={84} color={C.forest}>✓ OMOHYOID</Big>
            <div style={{ height: 18 }} />
            <div style={{ display: "flex", justifyContent: "center", ...pop(t, tm.pow, 0.3) }}>
              <Pill size={40} bg={C.red} color={C.paper}>omo = shoulder (Greek)</Pill>
            </div>
          </div>
        </div>
      )}
      <PlateQ src={P386} aspect={A386} x={30} y={262} w={800} h={640} a={-0.6} b={tm.hookEnd} from={[0.4, 0.67, 0.62]} to={[0.3, 0.73, 0.54]}
        pin={{ ...HOOKPIN, t0: -1, t1: R + 0.2, r: 66 }} stickers={hookStick(R)}
        labels={[
          { x: 0.37, y: 0.62, text: "omohyoid", t: R + 0.02, hot: true, ox: 60, oy: -60 },
          { x: 0.1, y: 0.905, text: "shoulder blade", t: tm.blade, ox: 60, oy: -120 },
        ]} ls={40} />
      <div style={{ position: "absolute", left: 40, top: 690 }}>
        <Ring t={t} size={170} tm={tm} />
      </div>
      <div style={{ position: "absolute", left: 50, top: 282, ...pop(t, R + 0.55, 0.3) }}>
        <Note><span style={{ color: C.matcha }}>1918 atlas name:</span> “Omo-hyoideus”</Note>
      </div>
      <div style={center(898, pop(t, 0.05, 0.25))}>
        {t < R ? <Pill size={34} bg={C.forest}>anatomy quiz · + 7 more after it</Pill> : (
          <div style={{ ...pop(t, R + 0.4, 0.25) }}><Pill size={36} bg={C.banana} color={C.forest}>hyoid muscles · mnemonic</Pill></div>
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
export type Tag = { m: HM; t: number; dx: number; dy: number; size?: number; t1?: number; label?: string };
/* default chip placements (offset from the anchor, in screen px at scale 1) */
export const TAGPOS: Record<HM, [number, number]> = {
  DI: [-240, -40], ST: [-120, 100], MY: [190, -60], GE: [230, 60],
  TH: [220, 40], OM: [-170, 20], STH: [200, 90], SH: [-230, 110],
};
export const HBox: React.FC<{ t: number; ks: Kf[]; top: number; h: number; id: string; tags?: Tag[]; note?: string } & Omit<React.ComponentProps<typeof Hyoid>, "w" | "id" | "t">> = ({ t, ks, top, h, id, tags = [], note = "front of the neck · Book Plume diagram", ...rest }) => {
  const [, s, cx, cy] = cam(t, ks);
  const X0 = 430 - cx * s, Y0 = h / 2 - cy * s;
  return (
    <div style={{ position: "absolute", left: 0, top, width: 860, height: h, overflow: "hidden", borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}` }}>
      <div style={{ position: "absolute", left: X0, top: Y0 }}>
        <Hyoid t={t} w={1000 * s} id={id} {...rest} />
      </div>
      {tags.map(({ m, t: t0, dx, dy, size, t1, label }) => {
        const p = ramp(t, t0 - 0.05, t0 + 0.2) * (t1 === undefined ? 1 : 1 - ramp(t, t1, t1 + 0.2));
        if (p <= 0) return null;
        const [ax, ay] = HANCH[m];
        const x = X0 + ax * s, y = Y0 + ay * s;
        return (
          <React.Fragment key={m}>
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: p }} width={1} height={1}>
              <line x1={x} y1={y} x2={x + dx} y2={y + dy} stroke={C.paper} strokeWidth={9} strokeLinecap="round" />
              <line x1={x} y1={y} x2={x + dx} y2={y + dy} stroke={C.forest} strokeWidth={4.5} strokeLinecap="round" />
              <circle cx={x} cy={y} r={9} fill={HCOL[m]} stroke={C.forest} strokeWidth={3.5} />
            </svg>
            <Chip x={x + dx} y={y + dy} p={p} col={HCOL[m]} size={size}>{label ?? HNAME[m]}</Chip>
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: 18, top: 16, fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.forest, background: "rgba(255,254,246,0.9)", borderRadius: 12, padding: "4px 12px" }}>{note}</div>
    </div>
  );
};
const ALL0 = (t0: number) => Object.fromEntries([...SUPRA, ...INFRA].map((k) => [k, t0])) as Partial<Record<HM, number>>;
const tagsFor = (ks: HM[], ts: number[], t1?: number): Tag[] => ks.map((m, i) => ({ m, t: ts[i], dx: TAGPOS[m][0], dy: TAGPOS[m][1], t1 }));

/* 2. 8 = 4 above + 4 below (hyoid in the middle) */
export const V2: React.FC<{ s0: number; s1: number; hy: number; above: number; below: number; eight: number }> = ({ s0, s1, hy, above, below, eight }) => {
  const t = useT();
  const sup = Object.fromEntries(SUPRA.map((k) => [k, above])), inf = Object.fromEntries(INFRA.map((k) => [k, below]));
  return (
    <Scene start={s0} end={s1} push={0.006}>
      <div style={center(10, pop(t, s0 + 0.03, 0.25))}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, background: C.forest, borderRadius: 26, padding: "6px 28px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 66, color: C.banana, ...pop(t, eight, 0.25) }}>8</span> HYOID MUSCLES
          <span style={{ ...pop(t, above, 0.25), color: "#F0913A" }}>= 4 ↑</span>
          <span style={{ ...pop(t, below, 0.25), color: "#7FB8E6" }}>+ 4 ↓</span>
        </div>
      </div>
      <HBox t={t} top={124} h={756} id="v2" ks={[[s0, 0.76, 500, 520], [s1, 0.8, 500, 500]]}
        lit={{ ...sup, ...inf }} hot={t >= below - 0.05 ? INFRA : t >= above - 0.05 ? SUPRA : []} hy={ramp(t, hy, hy + 0.3)} split={ramp(t, hy + 0.2, hy + 0.8)} />
      <div style={{ position: "absolute", left: 600, top: 470, ...pop(t, hy, 0.25) }}>
        <Pill size={32} bg={C.banana} color={C.forest}>← hyoid bone</Pill>
      </div>
      <div style={{ position: "absolute", left: 40, top: 190, ...pop(t, above, 0.25) }}>
        <Pill size={36} bg="#D9741C" color={C.paper}>4 ABOVE</Pill>
      </div>
      <div style={{ position: "absolute", left: 40, top: 560, ...pop(t, below, 0.25) }}>
        <Pill size={36} bg="#2F4E8E" color={C.paper}>4 BELOW</Pill>
      </div>
    </Scene>
  );
};

/* letter row for a mnemonic header */
const Letters: React.FC<{ t: number; L: [string, HM, number][]; title: string; bg: string }> = ({ t, L, title, bg }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, background: bg, border: `4px solid ${C.forest}`, borderRadius: 26, padding: "8px 22px 10px", fontFamily: FONT, fontWeight: 800, whiteSpace: "nowrap" }}>
    <span style={{ fontSize: 40, color: C.paper, marginRight: 6 }}>{title}</span>
    {L.map(([l, m, t0], i) => {
      const on = t >= t0 - 0.05;
      return (
        <span key={i} style={{ width: 62, height: 66, borderRadius: 16, background: on ? HCOL[m] : "rgba(247,246,236,0.15)", border: `4px solid ${C.paper}`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 46, color: C.paper, transform: `scale(${1 + 0.18 * Math.sin(Math.PI * ramp(t, t0, t0 + 0.3))})` }}>{l}</span>
      );
    })}
  </div>
);

/* 3. mnemonic card: Don't Swallow My Gum */
const MN: [string, string, HM][] = [["Don't", "igastric", "DI"], ["Swallow", "tylohyoid", "ST"], ["My", "ylohyoid", "MY"], ["Gum", "eniohyoid", "GE"]];
export const V3: React.FC<{ s0: number; s1: number; tok: number[]; names: number[] }> = ({ s0, s1, tok, names }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 850, borderRadius: 48, background: C.forest, ...pop(t, s0 + 0.02, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 44, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: C.banana }}>4 ABOVE THE HYOID</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 96, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: "rgba(247,246,236,0.7)" }}>suprahyoid · they work when you swallow</div>
        <div style={{ position: "absolute", left: 60, width: 720, top: 176, display: "flex", flexDirection: "column", gap: 26 }}>
          {MN.map(([w, rest, k], i) => {
            const on = t >= tok[i] - 0.05;
            const nm = t >= names[i] - 0.05;
            return (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 26, opacity: on ? 1 : 0.2, ...pop(t, tok[i], 0.22) }}>
                <div style={{ width: 130, height: 130, flex: "0 0 130px", borderRadius: 30, background: on ? HCOL[k] : "rgba(247,246,236,0.1)", border: `6px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 92, color: C.paper, lineHeight: 1 }}>{w[0]}</div>
                <div>
                  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 70, color: C.paper, whiteSpace: "nowrap", lineHeight: 1 }}>
                    <span style={{ color: C.banana }}>{w[0]}</span>{w.slice(1)}
                  </div>
                  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: nm ? C.banana : "rgba(247,246,236,0.55)", whiteSpace: "nowrap", marginTop: 6 }}>
                    = <span style={{ color: C.paper }}>{w[0].toUpperCase()}</span>{rest}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Scene>
  );
};

/* 3b. suprahyoids on our diagram, lit as named, then the lift arrow */
export const V3b: React.FC<{ s0: number; s1: number; names: number[]; lift: number; tok?: number }> = ({ s0, s1, names, lift }) => {
  const t = useT();
  const cur = SUPRA.filter((_, i) => t >= names[i] - 0.05).slice(-1);
  const lit = Object.fromEntries(SUPRA.map((k, i) => [k, names[i]]));
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, pop(t, s0 + 0.03, 0.25))}>
        <Letters t={t} title="ABOVE" bg="#B4561A" L={[["D", "DI", names[0]], ["S", "ST", names[1]], ["M", "MY", names[2]], ["G", "GE", names[3]]]} />
      </div>
      <HBox t={t} top={124} h={756} id="v3" ks={[[s0, 0.98, 500, 330], [lift - 0.3, 1.0, 500, 330], [s1, 0.96, 500, 340]]}
        lit={lit} hot={t >= lift - 0.05 ? SUPRA : (cur as HM[])} hy={ramp(t, lift, lift + 0.3)} up={ramp(t, lift, lift + 0.45)}
        tags={tagsFor(SUPRA, names)} />
      <div style={center(892, pop(t, lift + 0.2, 0.25))}>
        <Pill size={36} bg="#D9741C" color={C.paper}>↑ they LIFT the hyoid when you swallow</Pill>
      </div>
    </Scene>
  );
};

/* 4. infrahyoids: TOSS, lit as named; suprahyoid chips stay → all 8 labelled on one picture */
export const V4: React.FC<{ s0: number; s1: number; toss: number; names: number[]; down: number; supraShown?: boolean }> = ({ s0, s1, toss, names, down, supraShown = true }) => {
  const t = useT();
  const cur = INFRA.filter((_, i) => t >= names[i] - 0.05).slice(-1);
  const lit = { ...(supraShown ? ALL0(s0 - 1) : {}), ...Object.fromEntries(INFRA.map((k, i) => [k, names[i]])) };
  const allOn = t >= names[3] + 0.3;
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, pop(t, s0 + 0.03, 0.25))}>
        <Letters t={t} title="BELOW" bg="#2F4E8E" L={[["T", "TH", Math.max(toss, names[0])], ["O", "OM", names[1]], ["S", "STH", names[2]], ["S", "SH", names[3]]]} />
      </div>
      <HBox t={t} top={124} h={756} id="v4" ks={[[s0, 0.92, 500, 560], [names[3], 0.86, 500, 520], [s1, 0.74, 500, 500]]}
        note="" lit={lit} hot={t >= down - 0.05 ? INFRA : (cur as HM[])} dimSupra={allOn ? 0 : 0.35} hy={ramp(t, down, down + 0.3)} down={ramp(t, down, down + 0.45)}
        tags={[...(supraShown ? tagsFor(SUPRA, [names[3] + 0.3, names[3] + 0.35, names[3] + 0.4, names[3] + 0.45]) : []), ...tagsFor(INFRA, names)]} />
      <div style={center(892, pop(t, toss, 0.25))}>
        {t < down ? <Pill size={36} bg={C.banana} color={C.forest}>T · O · S · S = “toss it”</Pill> : <div style={pop(t, down, 0.25)}><Pill size={36} bg="#2F4E8E" color={C.paper}>↓ they PULL it back down</Pill></div>}
      </div>
    </Scene>
  );
};

/* 5. Quick test with 3-2-1 */
export const V5: React.FC<{ s0: number; s1: number; q: number; cd: [number, number][] }> = ({ s0, s1, q, cd }) => {
  const t = useT();
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < s1) { n = v; n0 = s; } });
  const OPTS = ["Geniohyoid", "Mylohyoid", "Digastric", "Sternohyoid"];
  return (
    <Scene start={s0} end={s1}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, s0 + 0.05, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 42, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 30, width: 760, top: 100, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 58, lineHeight: 1.1, color: C.paper, ...pop(t, q) }}>
          Which one is the <span style={{ color: C.banana }}>floor of your mouth</span>?
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

/* 6. Answer on Gray's Fig. 386 (upper part): modern labels on the suprahyoid muscles */
export const V6: React.FC<{ s0: number; s1: number; my: number; sling: number }> = ({ s0, s1, my, sling }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, pop(t, s0 + 0.05, 0.25))}>
        <div style={{ background: "#E5251A", border: `4px solid ${C.forest}`, borderRadius: 26, padding: "10px 30px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 54, color: C.paper, whiteSpace: "nowrap" }}>✓ B · Mylohyoid</div>
      </div>
      <PlateQ src={P386} aspect={A386} x={30} y={130} w={800} h={700} a={s0} b={s1} from={[0.52, 0.22, 0.6]} to={[0.52, 0.21, 0.54]} ls={34}
        labels={[
          { x: 0.513, y: 0.2, text: "mylohyoid", t: my, hot: true, ox: 60, oy: -150 },
          { x: 0.476, y: 0.2, text: "geniohyoid\n(deeper)", t: my + 0.35, ox: -90, oy: -110 },
          { x: 0.556, y: 0.2, text: "digastric", t: my + 0.5, ox: 90, oy: -20 },
          { x: 0.6, y: 0.236, text: "stylohyoid", t: my + 0.65, ox: 40, oy: 150 },
          { x: 0.44, y: 0.27, text: "hyoid bone", t: my + 0.8, ox: 30, oy: 140 },
        ]} />
      <div style={center(852, pop(t, sling, 0.25))}>
        <Pill size={34} bg={C.banana} color={C.forest}>a sling from jaw to hyoid · under the tongue</Pill>
      </div>
    </Scene>
  );
};

/* 7. end card: full video + save (≤ 1.7 s) */
export const V7: React.FC<{ s0: number; s1: number }> = ({ s0, s1 }) => {
  const t = useT();
  const ROWS: [string, string, string][] = [
    ["D·S·M·G", "4 above · lift when you swallow", "#D9741C"],
    ["T·O·S·S", "4 below · pull it back down", "#2F4E8E"],
  ];
  return (
    <Scene start={s0} end={s1}>
      <div style={{ position: "absolute", left: 30, top: 20, width: 800, height: 860, borderRadius: 44, background: C.forest, ...pop(t, s0 + 0.02, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 800, top: 50, textAlign: "center" }}><Loud size={78}>FULL VIDEO</Loud></div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 150, textAlign: "center" }}><Loud size={60} color="#FFE04A">ON OUR CHANNEL</Loud></div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 236, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: "#B9D27A" }}>what happens when you swallow ▶</div>
        <div style={{ position: "absolute", left: 50, top: 330, width: 700, display: "flex", flexDirection: "column", gap: 28 }}>
          {ROWS.map(([a, b, col], i) => (
            <div key={a} style={{ display: "flex", alignItems: "center", gap: 20, background: "rgba(247,246,236,0.08)", borderRadius: 26, padding: 16, ...pop(t, s0 + 0.15 + i * 0.1, 0.25) }}>
              <div style={{ width: 210, height: 88, borderRadius: 22, background: col, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper }}>{a}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.paper, lineHeight: 1.2 }}>{b}</div>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 690, display: "flex", justifyContent: "center", ...pop(t, s0 + 0.35, 0.25) }}>
          <div style={{ background: C.banana, color: C.forest, borderRadius: 50, padding: "14px 44px", fontFamily: FONT, fontWeight: 800, fontSize: 42 }}>🔖 SAVE THIS · + FOLLOW</div>
        </div>
      </div>
    </Scene>
  );
};

/* TikTok: one diagram scene — 8 = 4 + 4 → 4 above lift → 4 below pull down, TOSS */
export const TTDiag: React.FC<{ s0: number; s1: number; eight: number; hy: number; above: number; lift: number; below: number; pull: number; toss: number }> = ({ s0, s1, eight, hy, above, lift, below, pull, toss }) => {
  const t = useT();
  const sup = Object.fromEntries(SUPRA.map((k) => [k, above])), inf = Object.fromEntries(INFRA.map((k) => [k, below]));
  const phase = t >= below - 0.05 ? 2 : t >= above - 0.05 ? 1 : 0;
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, pop(t, s0 + 0.03, 0.25))}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, background: C.forest, borderRadius: 26, padding: "6px 28px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 66, color: C.banana, ...pop(t, eight, 0.25) }}>8</span> HYOID MUSCLES
          <span style={{ ...pop(t, above, 0.25), color: "#F0913A" }}>= 4 ↑</span>
          <span style={{ ...pop(t, below, 0.25), color: "#7FB8E6" }}>+ 4 ↓</span>
        </div>
      </div>
      <HBox note="" t={t} top={124} h={756} id="tt" ks={[[s0, 0.76, 500, 520], [above, 0.8, 500, 500], [s1, 0.78, 500, 510]]}
        lit={{ ...sup, ...inf }} hot={phase === 2 ? INFRA : phase === 1 ? SUPRA : []} hy={ramp(t, hy, hy + 0.3)} split={ramp(t, hy + 0.2, hy + 0.8) * (1 - ramp(t, above, above + 0.3))}
        up={ramp(t, lift, lift + 0.45) * (1 - ramp(t, below, below + 0.25))} down={ramp(t, pull, pull + 0.45)}
        tags={[...tagsFor(SUPRA, [above + 0.05, above + 0.12, above + 0.19, above + 0.26]), ...tagsFor(INFRA, [below + 0.05, below + 0.12, below + 0.19, below + 0.26])]} />
      <div style={center(892, {})}>
        {phase === 0 && <div style={pop(t, hy, 0.25)}><Pill size={36} bg={C.banana} color={C.forest}>the hyoid bone sits in the middle</Pill></div>}
        {phase === 1 && <div style={pop(t, lift, 0.25)}><Pill size={36} bg="#D9741C" color={C.paper}>↑ 4 above LIFT it when you swallow</Pill></div>}
        {phase === 2 && (t < toss ? <div style={pop(t, pull, 0.25)}><Pill size={36} bg="#2F4E8E" color={C.paper}>↓ 4 below PULL it down</Pill></div> : <div style={pop(t, toss, 0.25)}><Pill size={40} bg={C.banana} color={C.forest}>T · O · S · S = just “toss it”</Pill></div>)}
      </div>
    </Scene>
  );
};
