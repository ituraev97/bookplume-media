import React from "react";
import { C, FONT, Pill, Scene, ramp, useT } from "./kit";
import { Big, pop } from "./Scenes67";
import { Loud, PlateQ, QS } from "./Scenes93";
import { Chip } from "./Portal99";
import { DANCH, DCOL, DM, DNAME, Deep } from "./Deep100";

export const P389 = "plates/back389.png";
export const A389 = 1126 / 3063;
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* hook target on Gray's Fig. 389: the erector spinae mass in the lumbar region; "?" sticker over its printed 1918 name "SACRO-SPINALIS" */
export const HOOKPIN = { x: 0.62, y: 0.675 };
export const hookStick = (off: number): QS => ({ x0: 0.5, y0: 0.737, x1: 0.745, y1: 0.808, rot: -2, off });

export type Tm = { reveal: number; ticks: number[]; pow: number; hookEnd: number };
export const TM_MAIN: Tm = { reveal: 3.76, ticks: [2.05, 2.63, 3.21], pow: 4.85, hookEnd: 5.85 };
export const TM_TT: Tm = { reveal: 3.76, ticks: [2.05, 2.63, 3.21], pow: 4.88, hookEnd: 6.45 };

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

/* 1. Quiz hook: Gray's Fig. 389, red pin on the erector spinae from frame 1, "?" over "SACRO-SPINALIS", 3-2-1, reveal */
export const V1: React.FC<{ tm: Tm; ridges?: boolean }> = ({ tm, ridges }) => {
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
          <div style={{ background: "#E5251A", border: "7px solid #111", borderRadius: 18, padding: "0 22px 6px", transform: "rotate(-2deg)" }}><Loud size={86}>MUSCLE</Loud></div>
          <Loud size={60}>IN 3 SEC</Loud>
        </div>
      </div>
      {rv > 0 && (
        <div style={center(16, pop(t, R, 0.3))}>
          <div style={{ textAlign: "center" }}>
            <Big size={70} color={C.forest}>✓ ERECTOR SPINAE</Big>
            <div style={{ height: 20 }} />
            <div style={{ display: "flex", justifyContent: "center", ...pop(t, tm.pow, 0.3) }}>
              <Pill size={40} bg={C.red} color={C.paper}>{ridges ? "the 2 ridges beside your spine" : "it holds you upright"}</Pill>
            </div>
          </div>
        </div>
      )}
      <PlateQ src={P389} aspect={A389} x={30} y={262} w={800} h={640} a={-0.6} b={tm.hookEnd} from={[0.56, 0.69, 1.02]} to={[0.6, 0.7, 0.86]}
        pin={{ ...HOOKPIN, t0: -1, t1: R + 0.2, r: 70 }} stickers={[hookStick(R)]}
        labels={[{ x: HOOKPIN.x, y: HOOKPIN.y, text: "erector spinae", t: R + 0.02, hot: true, ox: 40, oy: -150 }]} ls={40} />
      <div style={{ position: "absolute", left: 40, top: 690 }}>
        <Ring t={t} size={170} tm={tm} />
      </div>
      <div style={{ position: "absolute", left: 50, top: 812, ...pop(t, R + 0.55, 0.3) }}>
        <Note><span style={{ color: C.matcha }}>1918 atlas name:</span> “Sacrospinalis”</Note>
      </div>
      <div style={center(898, pop(t, 0.05, 0.25))}>
        {t < R ? <Pill size={34} bg={C.forest}>anatomy quiz · say it before the 1</Pill> : (
          <div style={{ ...pop(t, R + 0.4, 0.25) }}><Pill size={36} bg={C.banana} color={C.forest}>deep back muscles · mnemonic</Pill></div>
        )}
      </div>
    </Scene>
  );
};

/* 2. Mnemonic card: I Love Spaghetti = Iliocostalis · Longissimus · Spinalis (outside → inside) */
const MN: [string, string, string, DM][] = [["I", "Love", "liocostalis", "IL"], ["L", "", "ongissimus", "LO"], ["S", "", "pinalis", "SP"]];
export const V2: React.FC<{ s0: number; s1: number; three: number; out: number; tok: number[]; names?: number[] }> = ({ s0, s1, three, out, tok, names }) => {
  const t = useT();
  const WORDS = ["I", "Love", "Spaghetti"];
  return (
    <Scene start={s0} end={s1} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 850, borderRadius: 48, background: C.forest, ...pop(t, s0 + 0.02, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: C.banana }}>ERECTOR SPINAE MNEMONIC</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 100, display: "flex", justifyContent: "center", gap: 18, alignItems: "baseline", ...pop(t, three, 0.25) }}>
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 96, color: C.banana, lineHeight: 1 }}>3</span>
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.paper }}>columns</span>
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 214, display: "flex", justifyContent: "center", ...pop(t, out, 0.25) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(247,246,236,0.1)", borderRadius: 40, padding: "6px 26px 10px", fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.paper }}>
            outside <span style={{ color: C.banana }}>→</span> inside
          </div>
        </div>
        <div style={{ position: "absolute", left: 50, width: 720, top: 318, display: "flex", flexDirection: "column", gap: 30 }}>
          {MN.map(([L, , rest, k], i) => {
            const on = t >= tok[i] - 0.05;
            const nm = names ? t >= names[i] - 0.05 : false;
            return (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 26, opacity: on ? 1 : 0.2, ...pop(t, tok[i], 0.22) }}>
                <div style={{ width: 140, height: 140, flex: "0 0 140px", borderRadius: 32, background: on ? DCOL[k] : "rgba(247,246,236,0.1)", border: `6px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 100, color: C.paper, lineHeight: 1 }}>{L}</div>
                <div>
                  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 78, color: C.paper, whiteSpace: "nowrap", lineHeight: 1 }}>
                    <span style={{ color: C.banana }}>{WORDS[i][0]}</span>{WORDS[i].slice(1)}
                  </div>
                  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: nm ? C.banana : "rgba(247,246,236,0.55)", whiteSpace: "nowrap", marginTop: 8 }}>
                    = <span style={{ color: C.paper }}>{L}</span>{rest}
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

/* 3. Gray's Fig. 389 with modern labels on the 3 columns, lateral → medial */
export const V3: React.FC<{ s0: number; s1: number; il: number; lo: number; sp: number; big?: number; by?: number }> = ({ s0, s1, il, lo, sp, big, by }) => {
  const t = useT();
  const cur = t >= sp - 0.05 ? "SP" : t >= lo - 0.05 ? "LO" : "IL";
  return (
    <Scene start={s0} end={s1} push={0.006}>
      <div style={center(14, pop(t, s0 + 0.05, 0.25))}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: DCOL[cur as DM], border: `4px solid ${C.forest}`, borderRadius: 26, padding: "8px 26px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper, whiteSpace: "nowrap" }}>
          {cur === "IL" ? "1 · OUTSIDE" : cur === "LO" ? "2 · MIDDLE" : "3 · INSIDE"}
        </div>
      </div>
      <PlateQ src={P389} aspect={A389} x={30} y={130} w={800} h={700} a={s0} b={s1} from={[0.6, 0.47, 0.92]} to={[0.6, 0.52, 0.82]} ls={36}
        labels={[
          { x: 0.732, y: 0.5, text: "iliocostalis", t: il, hot: cur === "IL", ox: 40, oy: -150 },
          { x: 0.603, y: 0.55, text: "longissimus", t: lo, hot: cur === "LO", ox: -30, oy: 120 },
          { x: 0.535, y: 0.5, text: "spinalis", t: sp, hot: cur === "SP", ox: -50, oy: -140 },
        ]} />
      {big !== undefined && (
        <div style={{ position: "absolute", left: 470, top: 152, ...pop(t, big, 0.3) }}>
          <Pill size={32} bg={C.banana} color={C.forest}>longissimus = the biggest</Pill>
        </div>
      )}
      {by !== undefined && (
        <div style={{ position: "absolute", left: 40, top: 152, ...pop(t, by, 0.3) }}>
          <Pill size={32} bg={C.forest}>spinalis hugs the spine</Pill>
        </div>
      )}
      <div style={center(848, pop(t, lo + 0.4, 0.25))}>
        <Note><span style={{ color: C.matcha }}>1918 atlas:</span> “… dorsi” = today’s “… thoracis”</Note>
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
type Tag = { m: keyof typeof DANCH; label: string; col: string; t: number; dx?: number; dy?: number; size?: number; t1?: number };
export const DeepBox: React.FC<{ t: number; ks: Kf[]; top: number; h: number; id: string; tags?: Tag[]; note?: string } & Omit<React.ComponentProps<typeof Deep>, "w" | "id" | "t">> = ({ t, ks, top, h, id, tags = [], note = "cross-section · Book Plume diagram", ...rest }) => {
  const [, s, cx, cy] = cam(t, ks);
  const X0 = 430 - cx * s, Y0 = h / 2 - cy * s;
  return (
    <div style={{ position: "absolute", left: 0, top, width: 860, height: h, overflow: "hidden", borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}` }}>
      <div style={{ position: "absolute", left: X0, top: Y0 }}>
        <Deep t={t} w={1000 * s} id={id} {...rest} />
      </div>
      {tags.map(({ m, label, col, t: t0, dx = 0, dy = 0, size, t1 }) => {
        const p = ramp(t, t0 - 0.05, t0 + 0.2) * (t1 === undefined ? 1 : 1 - ramp(t, t1, t1 + 0.2));
        if (p <= 0) return null;
        const [ax, ay] = DANCH[m];
        const x = X0 + ax * s, y = Y0 + ay * s;
        return (
          <React.Fragment key={m + label}>
            {(dx !== 0 || dy !== 0) && (
              <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: p }} width={1} height={1}>
                <line x1={x} y1={y} x2={x + dx} y2={y + dy} stroke={C.paper} strokeWidth={9} strokeLinecap="round" />
                <line x1={x} y1={y} x2={x + dx} y2={y + dy} stroke={C.forest} strokeWidth={4.5} strokeLinecap="round" />
                <circle cx={x} cy={y} r={9} fill={col} stroke={C.forest} strokeWidth={3.5} />
              </svg>
            )}
            <Chip x={x + dx} y={y + dy} p={p} col={col} size={size}>{label}</Chip>
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: 18, top: 16, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.forest, background: "rgba(255,254,246,0.9)", borderRadius: 12, padding: "4px 12px" }}>{note}</div>
    </div>
  );
};

/* 4. Our cross-section: erector spinae 3 columns, then "deeper, in the groove": semispinalis, multifidus, rotatores */
export const V4: React.FC<{ s0: number; s1: number; deeper: number; groove: number; ss: number; mu: number; ro: number }> = ({ s0, s1, deeper, groove, ss, mu, ro }) => {
  const t = useT();
  const pre = s0 - 1;
  const cur: DM | null = t >= ro - 0.05 ? "RO" : t >= mu - 0.05 ? "MU" : t >= ss - 0.05 ? "SS" : null;
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(14, pop(t, s0 + 0.05, 0.25))}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#2F5E86", border: `4px solid ${C.forest}`, borderRadius: 26, padding: "8px 26px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 60 }}>+3</span> DEEPER, IN THE GROOVE
        </div>
      </div>
      <DeepBox t={t} top={128} h={752} id="v4" ks={[[s0, 0.84, 470, 470], [groove, 0.84, 470, 470], [ss, 1.3, 400, 420], [s1, 1.38, 405, 425]]}
        lit={{ IL: pre, LO: pre, SP: pre, SS: ss, MU: mu, RO: ro }} hot={cur ? [cur] : []} dimES={ramp(t, deeper, deeper + 0.4)} groove={ramp(t, groove, groove + 0.3)} ts={ramp(t, ro + 0.3, ro + 0.6)}
        tags={[
          { m: "IL", label: "I", col: DCOL.IL, t: s0 + 0.1, size: 30, t1: deeper },
          { m: "LO", label: "L", col: DCOL.LO, t: s0 + 0.15, size: 30, t1: deeper },
          { m: "SP", label: "S", col: DCOL.SP, t: s0 + 0.2, size: 30, t1: deeper },
          { m: "SS", label: "semispinalis", col: DCOL.SS, t: ss, dx: -190, dy: -70 },
          { m: "MU", label: "multifidus", col: DCOL.MU, t: mu, dx: -210, dy: 10 },
          { m: "RO", label: "rotatores", col: DCOL.RO, t: ro, dx: -200, dy: 80 },
        ]} />
      <div style={center(892, pop(t, ro + 0.3, 0.25))}>
        <Pill size={34} bg={C.banana} color={C.forest}>top → deepest · they fill the groove</Pill>
      </div>
    </Scene>
  );
};

/* 5. Quick test with 3-2-1 */
export const V5: React.FC<{ s0: number; s1: number; q: number; cd: [number, number][] }> = ({ s0, s1, q, cd }) => {
  const t = useT();
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < s1) { n = v; n0 = s; } });
  const OPTS = ["Brachial plexus", "Posterior rami", "Anterior rami", "Accessory nerve"];
  return (
    <Scene start={s0} end={s1}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, s0 + 0.05, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 42, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 30, width: 760, top: 100, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 58, lineHeight: 1.1, color: C.paper, ...pop(t, q) }}>
          Which nerves supply <span style={{ color: C.banana }}>all 6</span>?
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

/* 6. Answer on our cross-section: spinal nerve → posterior ramus to the back muscles; anterior rami build the plexuses */
export const V6: React.FC<{ s0: number; s1: number; post: number; not: number }> = ({ s0, s1, post, not }) => {
  const t = useT();
  const pre = s0 - 1;
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(14, pop(t, s0 + 0.05, 0.25))}>
        <div style={{ background: "#E5251A", border: `4px solid ${C.forest}`, borderRadius: 26, padding: "10px 30px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.paper, whiteSpace: "nowrap" }}>✓ Posterior rami</div>
      </div>
      <DeepBox t={t} top={128} h={752} id="v6" ks={[[s0, 0.92, 430, 520], [s1, 0.98, 420, 530]]}
        lit={{ IL: pre, LO: pre, SP: pre, SS: pre, MU: pre, RO: pre }} hot={t >= post + 0.6 && t < not ? ["IL", "LO", "MU"] : []}
        nerve={ramp(t, s0, s0 + 0.35)} post={ramp(t, post, post + 0.8)} ant={ramp(t, not, not + 0.6)}
        tags={[
          { m: "NERVE", label: "spinal nerve", col: C.forest, t: s0 + 0.2, dx: 60, dy: 70 },
          { m: "POST", label: "posterior ramus → back", col: "#E5251A", t: post + 0.3, dx: -60, dy: -230 },
          { m: "ANT", label: "anterior ramus → plexuses", col: "#4F7186", t: not + 0.2, dx: 170, dy: 40 },
        ]} />
      <div style={center(892, pop(t, not + 0.25, 0.25))}>
        <Pill size={34} bg={C.banana} color={C.forest}>not a plexus · unlike the superficial back</Pill>
      </div>
    </Scene>
  );
};

/* 7. Save + cheat sheet */
export const V7: React.FC<{ s0: number; s1: number }> = ({ s0, s1 }) => {
  const t = useT();
  const bb = ramp(t, s0 + 0.05, s0 + 0.4);
  const ROWS: [string, string, string, string][] = [
    ["I·L·S", "erector spinae · outside → in", "iliocostalis · longissimus · spinalis", DCOL.LO],
    ["S·M·R", "deeper, in the groove · top → deep", "semispinalis · multifidus · rotatores", DCOL.MU],
    ["✓", "nerve supply · all 6", "posterior rami of spinal nerves", "#E5251A"],
  ];
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
      <div style={{ position: "absolute", left: 30, top: 190, width: 800, height: 720, borderRadius: 40, background: C.card, border: `3px solid ${C.line}`, boxShadow: "0 18px 40px rgba(31,42,20,0.12)", padding: "26px 30px", boxSizing: "border-box", ...pop(t, s0 + 0.15, 0.3) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.matcha, letterSpacing: 2 }}>DEEP BACK MUSCLES · CHEAT SHEET</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 50, color: C.forest, marginTop: 8 }}>“<span style={{ color: DCOL.IL }}>I</span> <span style={{ color: DCOL.LO }}>L</span>ove <span style={{ color: DCOL.SP }}>S</span>paghetti”</div>
        <div style={{ marginTop: 44, display: "flex", flexDirection: "column", gap: 54 }}>
          {ROWS.map(([n, a, b, col], i) => (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 20, opacity: ramp(t, s0 + 0.2 + i * 0.07, s0 + 0.4 + i * 0.07) }}>
              <div style={{ width: 128, height: 96, flex: "0 0 128px", borderRadius: 26, background: col, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: n.length > 1 ? 36 : 56, color: C.paper }}>{n}</div>
              <div>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: col, whiteSpace: "nowrap" }}>{a}</div>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 35, color: C.forest, whiteSpace: "nowrap", lineHeight: 1.15 }}>{b}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Scene>
  );
};

export { DNAME };
