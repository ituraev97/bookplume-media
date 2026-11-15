import React from "react";
import { C, FONT, Pill, Scene, ramp, useT } from "./kit";
import { Big, pop } from "./Scenes67";
import { Loud, PlateQ, QS } from "./Scenes93";
import { AANCH, ACOL, ALET, AM, ANAME, ASHORT, Torso, Wall } from "./Abs98";

export const P397 = "plates/abs397.png";
export const A397 = 1478 / 2331;
export const P395 = "plates/obl395.png";
export const A395 = 1408 / 1536;
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* hook target on Gray's Fig. 397: the Transversus abdominis (printed "TRANSVERSUS" across it) */
export const HOOKPIN = { x: 0.565, y: 0.68 };
export const hookStick = (off: number): QS => ({ x0: 0.455, y0: 0.588, x1: 0.765, y1: 0.62, rot: 0, off });

export type Tm = { reveal: number; ticks: number[]; pow: number; hookEnd: number };
export const TM_MAIN: Tm = { reveal: 3.56, ticks: [1.92, 2.52, 3.1], pow: 5.6, hookEnd: 6.3 };
export const TM_TT: Tm = { reveal: 3.56, ticks: [1.92, 2.52, 3.1], pow: 5.6, hookEnd: 6.3 };

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

/* 1. Quiz hook: Gray's Fig. 397, red pin on the Transversus abdominis from frame 1, "?" sticker over its printed name, 3-2-1, reveal */
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
          <div style={{ background: "#E5251A", border: "7px solid #111", borderRadius: 18, padding: "0 22px 6px", transform: "rotate(-2deg)" }}><Loud size={86}>MUSCLE</Loud></div>
          <Loud size={60}>IN 3 SEC</Loud>
        </div>
      </div>
      {rv > 0 && (
        <div style={center(16, pop(t, R, 0.3))}>
          <div style={{ textAlign: "center" }}>
            <Big size={60} color={C.forest}>✓ TRANSVERSUS ABDOMINIS</Big>
            <div style={{ height: 22 }} />
            <div style={{ display: "flex", justifyContent: "center", ...pop(t, tm.pow, 0.3) }}>
              <Pill size={40} bg={C.red} color={C.paper}>your built-in corset</Pill>
            </div>
          </div>
        </div>
      )}
      <PlateQ src={P397} aspect={A397} x={30} y={262} w={800} h={640} a={-0.6} b={tm.hookEnd} from={[0.55, 0.64, 0.98]} to={[0.54, 0.66, 0.84]}
        pin={{ ...HOOKPIN, t0: -1, t1: R + 0.2, r: 78 }} stickers={[hookStick(R)]}
        labels={[{ x: HOOKPIN.x, y: HOOKPIN.y, text: "transversus\nabdominis", t: R + 0.02, hot: true, ox: 60, oy: 150 }]} ls={40} />
      <div style={{ position: "absolute", left: 40, top: 640 }}>
        <Ring t={t} size={170} tm={tm} />
      </div>
      <div style={center(898, pop(t, 0.05, 0.25))}>
        {t < R ? <Pill size={34} bg={C.forest}>anatomy quiz · say it before the 1</Pill> : (
          <div style={{ ...pop(t, R + 0.6, 0.25) }}><Pill size={36} bg={C.banana} color={C.forest}>abdominal wall muscles · mnemonic</Pill></div>
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

type Tag = { m: string; label?: string; col?: string; t: number; dx?: number; dy?: number };
export const TorsoBox: React.FC<{ t: number; ks: Kf[]; top: number; h: number; id: string; tags?: Tag[]; note?: string; children?: React.ReactNode } & Omit<React.ComponentProps<typeof Torso>, "w" | "id" | "t">> = ({ t, ks, top, h, id, tags = [], note = "front view · Book Plume diagram", children, ...rest }) => {
  const [, s, cx, cy] = cam(t, ks);
  const X0 = 430 - cx * s, Y0 = h / 2 - cy * s;
  return (
    <div style={{ position: "absolute", left: 0, top, width: 860, height: h, overflow: "hidden", borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}` }}>
      <div style={{ position: "absolute", left: X0, top: Y0 }}>
        <Torso t={t} w={1000 * s} id={id} {...rest} />
      </div>
      {tags.map(({ m, label, col, t: t0, dx = 0, dy = 0 }) => {
        const p = ramp(t, t0 - 0.05, t0 + 0.2);
        if (p <= 0) return null;
        const [ax, ay] = AANCH[m];
        const x = X0 + ax * s + dx, y = Y0 + ay * s + dy;
        const key = (m.replace(/R$/, "") as AM);
        return (
          <div key={m} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${0.7 + 0.3 * p})`, opacity: p, background: col ?? ACOL[key], color: C.paper, border: `4px solid ${C.paper}`, boxShadow: "0 6px 0 rgba(31,42,20,0.25)", borderRadius: 16, padding: "4px 14px 7px", fontFamily: FONT, fontWeight: 800, fontSize: 32, whiteSpace: "nowrap" }}>
            {label ?? ASHORT[key]}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 18, top: 16, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.forest, background: "rgba(255,254,246,0.9)", borderRadius: 12, padding: "4px 12px" }}>{note}</div>
      {children}
    </div>
  );
};

/* 2. "3 flat layers, outside in: E, I, T" — our cross-section of the wall */
export const V2: React.FC<{ s0: number; s1: number; out: number; e: number; i: number; tt: number }> = ({ s0, s1, out, e, i, tt }) => {
  const t = useT();
  const L: [AM, number, string][] = [["EO", e, "External oblique"], ["IO", i, "Internal oblique"], ["TA", tt, "Transversus abdominis"]];
  return (
    <Scene start={s0} end={s1} push={0.005}>
      <div style={{ position: "absolute", left: 20, top: 0, width: 820, height: 236, borderRadius: 36, background: C.forest, ...pop(t, s0 + 0.02, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 14, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 28, letterSpacing: 4, color: C.banana }}>5 MUSCLES = 3 FLAT + 2 VERTICAL</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 52, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper }}>3 flat layers · outside → in</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 106, display: "flex", justifyContent: "center", gap: 44 }}>
          {L.map(([m, tm]) => {
            const on = t >= tm - 0.05;
            return (
              <div key={m} style={{ width: 120, height: 120, borderRadius: 60, background: on ? ACOL[m] : "rgba(247,246,236,0.1)", border: `6px solid ${on ? C.paper : "rgba(247,246,236,0.25)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 76, color: C.paper, lineHeight: 1, ...pop(t, tm, 0.22) }}>{ALET[m]}</div>
            );
          })}
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 256, width: 860, height: 560, borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}`, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: -10, top: 30 }}>
          <Wall t={t} w={880} id="w2" lit={{ EO: e, IO: i, TA: tt }} hot={t >= tt ? ["TA"] : t >= i ? ["IO"] : t >= e ? ["EO"] : []} inArrow={ramp(t, out - 0.1, out + 0.5)} letters={1} />
        </div>
        <div style={{ position: "absolute", left: 18, top: 16, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.forest, background: "rgba(255,254,246,0.9)", borderRadius: 12, padding: "4px 12px" }}>cross-section · Book Plume diagram</div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 838, width: 860, display: "flex", justifyContent: "center", gap: 14 }}>
        {L.map(([m, tm, nm]) => (
          <div key={m} style={{ opacity: ramp(t, tm - 0.05, tm + 0.2), transform: `scale(${0.8 + 0.2 * ramp(t, tm - 0.05, tm + 0.2)})`, background: ACOL[m], color: C.paper, borderRadius: 16, padding: "6px 14px 9px", fontFamily: FONT, fontWeight: 800, fontSize: 27, whiteSpace: "nowrap" }}>{nm}</div>
        ))}
      </div>
    </Scene>
  );
};

/* 3. Front view: the 3 flat layers peel one by one (+ Gray's Fig. 395 inset for the internal oblique) */
export const V3: React.FC<{ s0: number; s1: number; e: number; i: number; tt: number }> = ({ s0, s1, e, i, tt }) => {
  const t = useT();
  const cur: AM = t >= tt - 0.05 ? "TA" : t >= i - 0.05 ? "IO" : "EO";
  const peelR = ramp(t, i - 0.1, i + 0.25) + ramp(t, tt - 0.1, tt + 0.25);
  const dirTxt: Record<string, string> = { EO: "↘ down + in", IO: "↗ up + in", TA: "→ straight across" };
  const ins = ramp(t, i + 0.05, i + 0.3) * (1 - ramp(t, tt - 0.1, tt + 0.1));
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, {})}>
        <div key={cur} style={{ display: "flex", alignItems: "center", gap: 16, background: ACOL[cur], border: `4px solid ${C.forest}`, borderRadius: 26, padding: "8px 26px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper, whiteSpace: "nowrap", ...pop(t, cur === "EO" ? e : cur === "IO" ? i : tt, 0.22) }}>
          <span style={{ fontSize: 60 }}>{ALET[cur]}</span> {ANAME[cur]}
        </div>
      </div>
      <TorsoBox t={t} top={128} h={752} id="v3" ks={[[s0, 0.84, 500, 470], [s1, 0.9, 520, 480]]}
        lit={{ EO: e, IO: i, TA: tt }} hot={[cur]} peelR={peelR} arrows={{ EO: ramp(t, e + 0.3, e + 0.8) * (1 - ramp(t, i - 0.2, i)), IO: ramp(t, i + 0.2, i + 0.6) * (1 - ramp(t, tt - 0.2, tt)), TA: ramp(t, tt + 0.2, tt + 0.6) }}
        arrowSide={cur === "EO" ? "both" : "R"}
        tags={[{ m: "EO", t: e + 0.1 }, { m: "IO", t: i + 0.1, dy: -30 }, { m: "TA", t: tt + 0.1, dy: 40 }]} />
      <div style={center(892, {})}>
        <div key={cur} style={{ ...pop(t, (cur === "EO" ? e : cur === "IO" ? i : tt) + 0.2, 0.25) }}><Pill size={36} bg={C.forest}>{`fibers ${dirTxt[cur]}`}</Pill></div>
      </div>
      {ins > 0 && (
        <div style={{ position: "absolute", left: 24, top: 520, width: 300, opacity: ins, transform: `scale(${0.85 + 0.15 * ins}) rotate(-2deg)`, transformOrigin: "0 100%" }}>
          <PlateQ src={P395} aspect={A395} x={0} y={0} w={300} h={300} a={s0} b={s1} from={[0.4, 0.6, 0.9]} to={[0.4, 0.6, 0.9]} credit="" still />
          <div style={{ position: "absolute", left: 0, top: 308, width: 300, background: C.forest, color: C.paper, borderRadius: 14, padding: "6px 12px 8px", boxSizing: "border-box", fontFamily: FONT, fontWeight: 800, fontSize: 21, lineHeight: 1.2 }}>
            Gray's Fig. 395 · 1918 name <span style={{ color: C.banana }}>“Obliquus internus”</span>
          </div>
        </div>
      )}
    </Scene>
  );
};

/* 4. Gray's Fig. 397: 2 vertical muscles — rectus abdominis + pyramidalis */
export const V4: React.FC<{ s0: number; s1: number; two: number; ra: number; py: number }> = ({ s0, s1, two, ra, py }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.006}>
      <div style={center(14, pop(t, s0 + 0.05, 0.25))}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: ACOL.RA, border: `4px solid ${C.forest}`, borderRadius: 26, padding: "8px 26px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 64, ...pop(t, two, 0.25) }}>2</span> VERTICAL · up + down
        </div>
      </div>
      <PlateQ src={P397} aspect={A397} x={30} y={130} w={800} h={700} a={s0} b={s1} from={[0.34, 0.58, 0.82]} to={[0.31, 0.73, 0.64]} ls={38}
        labels={[
          { x: 0.2, y: 0.69, text: "rectus\nabdominis", t: ra, hot: t < py, ox: 170, oy: -10 },
          { x: 0.283, y: 0.875, text: "pyramidalis", t: py, hot: t >= py, ox: 150, oy: -40 },
        ]} />
      <div style={{ position: "absolute", left: 30, top: 848, opacity: ramp(t, s0 + 0.3, s0 + 0.55) }}>
        <Pill size={26} bg={C.forest}>Gray's Fig. 397 · front of the abdomen</Pill>
      </div>
    </Scene>
  );
};

/* 4b. Six-pack lines = tendinous intersections (our front view) + 1918 name note */
export const V4b: React.FC<{ s0: number; s1: number; six: number; ti: number }> = ({ s0, s1, six, ti }) => {
  const t = useT();
  const pre = s0 - 1;
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(14, pop(t, s0 + 0.05, 0.25))}>
        <div style={{ background: C.banana, border: `4px solid ${C.forest}`, borderRadius: 26, padding: "8px 26px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.forest, whiteSpace: "nowrap" }}>SIX-PACK LINES?</div>
      </div>
      <TorsoBox t={t} top={128} h={752} id="v4b" ks={[[s0, 1.0, 500, 420], [s1, 1.14, 500, 400]]}
        lit={{ RA: pre, PY: pre, TI: ti }} hot={t >= ti ? ["TI"] : ["RA"]} dim={0.5}
        tags={[{ m: "TI", label: "tendinous intersections", col: C.forest, t: ti + 0.05, dx: 0, dy: -64 }]} />
      <div style={{ position: "absolute", left: 30, top: 790, ...pop(t, ti + 0.4, 0.3) }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 16px 10px", fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.forest, whiteSpace: "nowrap" }}>
          <span style={{ color: C.matcha }}>1918 atlas name:</span> “tendinous inscriptions”
        </div>
      </div>
      <div style={{ position: "absolute", left: 520, top: 150, opacity: ramp(t, six, six + 0.3) }}>
        <Pill size={30} bg={ACOL.RA}>rectus abdominis</Pill>
      </div>
    </Scene>
  );
};

/* 5. Quick test with 3-2-1 */
export const V5: React.FC<{ s0: number; s1: number; q: number; cd: [number, number][] }> = ({ s0, s1, q, cd }) => {
  const t = useT();
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < s1) { n = v; n0 = s; } });
  const OPTS = ["Rectus abdominis", "Internal oblique", "External oblique", "Transversus abdominis"];
  return (
    <Scene start={s0} end={s1}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, s0 + 0.05, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 42, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 30, width: 760, top: 100, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 56, lineHeight: 1.1, color: C.paper, ...pop(t, q) }}>
          Which layer runs like <span style={{ color: C.banana }}>hands in your pockets</span>?
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

/* 6. Answer: external oblique, both sides, arrows down + in */
export const V6: React.FC<{ s0: number; s1: number; fib: number }> = ({ s0, s1, fib }) => {
  const t = useT();
  const pre = s0 - 1;
  return (
    <Scene start={s0} end={s1} push={0.006}>
      <div style={center(14, pop(t, s0 + 0.05, 0.25))}>
        <div style={{ background: ACOL.EO, border: `4px solid ${C.forest}`, borderRadius: 26, padding: "10px 30px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.paper, whiteSpace: "nowrap" }}>✓ External oblique</div>
      </div>
      <TorsoBox t={t} top={128} h={752} id="v6" ks={[[s0, 0.86, 500, 470], [s1, 0.92, 500, 460]]}
        lit={{ EO: pre }} hot={["EO"]} dim={0.4} arrows={{ EO: ramp(t, fib - 0.1, fib + 0.5) }}
        tags={[{ m: "EO", t: s0 + 0.15, dy: 120 }, { m: "EOR", t: s0 + 0.25, dy: 120 }]} />
      <div style={center(892, pop(t, fib + 0.2, 0.25))}>
        <Pill size={36} bg={C.banana} color={C.forest}>down + in · like hands in your front pockets</Pill>
      </div>
    </Scene>
  );
};

/* 7. Save + cheat sheet */
export const V7: React.FC<{ s0: number; s1: number }> = ({ s0, s1 }) => {
  const t = useT();
  const bb = ramp(t, s0 + 0.05, s0 + 0.4);
  const ROWS: [AM, string, string][] = [["EO", "outermost", "↘ down + in"], ["IO", "middle", "↗ up + in"], ["TA", "deepest", "→ across"], ["RA", "vertical", "six-pack"], ["PY", "vertical", "tiny, low"]];
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
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.matcha, letterSpacing: 2 }}>ABDOMINAL WALL · CHEAT SHEET</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest, marginTop: 6 }}>3 flat <span style={{ color: ACOL.EO }}>E</span>-<span style={{ color: ACOL.IO }}>I</span>-<span style={{ color: ACOL.TA }}>T</span> + 2 vertical</div>
        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 16 }}>
          {ROWS.map(([m, a, b], i) => (
            <div key={m} style={{ display: "flex", alignItems: "center", gap: 18, opacity: ramp(t, s0 + 0.2 + i * 0.06, s0 + 0.4 + i * 0.06) }}>
              <div style={{ width: 70, height: 70, flex: "0 0 70px", borderRadius: 35, background: ACOL[m], display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper }}>{ALET[m]}</div>
              <div>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.forest, whiteSpace: "nowrap", lineHeight: 1.05 }}>{ANAME[m]}</div>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: ACOL[m], whiteSpace: "nowrap" }}>{a} · {b}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Scene>
  );
};

/* TikTok 2: the deepest flat layer, fibers straight across */
export const TT2: React.FC<{ s0: number; s1: number; deep: number; run: number }> = ({ s0, s1, deep, run }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(14, pop(t, deep, 0.25))}>
        <div style={{ background: ACOL.TA, border: `4px solid ${C.forest}`, borderRadius: 26, padding: "8px 26px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper, whiteSpace: "nowrap" }}>DEEPEST FLAT LAYER</div>
      </div>
      <TorsoBox t={t} top={128} h={752} id="tt2" ks={[[s0, 0.84, 500, 480], [s1, 0.92, 520, 500]]}
        lit={{ TA: s0 - 1 }} hot={["TA"]} peelL={2} peelR={2} arrows={{ TA: ramp(t, run - 0.1, run + 0.5) }}
        tags={[{ m: "TA", t: deep + 0.1, dy: 70 }]} />
      <div style={center(892, pop(t, run + 0.2, 0.25))}>
        <Pill size={36} bg={C.banana} color={C.forest}>fibers run straight across → like a belt</Pill>
      </div>
    </Scene>
  );
};

/* TikTok 3: on top sit 2 more layers (internal, then external oblique) */
export const TT3: React.FC<{ s0: number; s1: number; i: number; e: number }> = ({ s0, s1, i, e }) => {
  const t = useT();
  const peelR = 2 - ramp(t, i - 0.1, i + 0.25);
  const peelL = 2 - 2 * ramp(t, e - 0.1, e + 0.25);
  const cur: AM = t >= e - 0.05 ? "EO" : t >= i - 0.05 ? "IO" : "TA";
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(14, pop(t, s0 + 0.05, 0.25))}>
        <div style={{ background: C.forest, border: `4px solid ${C.forest}`, borderRadius: 26, padding: "8px 26px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper, whiteSpace: "nowrap" }}>ON TOP: <span style={{ color: C.banana }}>2 MORE LAYERS</span></div>
      </div>
      <TorsoBox t={t} top={128} h={752} id="tt3" ks={[[s0, 0.86, 500, 470], [s1, 0.9, 500, 470]]}
        lit={{ TA: s0 - 1, IO: i, EO: e }} hot={cur === "TA" ? ["TA"] : ["IO", "EO"]} peelL={peelL} peelR={peelR} split
        arrows={{ IO: ramp(t, i + 0.1, i + 0.4), EO: ramp(t, e + 0.1, e + 0.4) }}
        tags={[{ m: "IO", t: i + 0.05, dy: -20 }, { m: "EO", t: e + 0.05, dy: 30 }]} />
      <div style={center(892, {})}>
        <div key={cur} style={{ ...pop(t, cur === "EO" ? e : i, 0.25) }}><Pill size={36} bg={ACOL[cur]}>{cur === "EO" ? "external oblique · outermost" : "internal oblique · middle"}</Pill></div>
      </div>
    </Scene>
  );
};
