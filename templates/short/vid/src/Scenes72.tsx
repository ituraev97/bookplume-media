import React from "react";
import { interpolate } from "remotion";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { BrainNo, Conduction, SpeedDial, STEP_COL } from "./Cond72";

export const AHIS = 1532 / 1794;
export const ARA = 1501 / 967;
export const liveAlpha = (_t: number) => 0;

export const pop = (t: number, t0: number, d = 0.3) => {
  const p = ramp(t, t0, t0 + d);
  return { opacity: p, transform: `scale(${0.6 + 0.4 * p + 0.08 * Math.sin(Math.min(1, p) * Math.PI)})` } as React.CSSProperties;
};
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });
export const Big: React.FC<{ size?: number; children: React.ReactNode; color?: string }> = ({ size = 110, children, color = C.forest }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1, letterSpacing: -2, textAlign: "center", whiteSpace: "nowrap" }}>{children}</div>
);
const HL: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg = C.banana }) => <span style={{ background: bg, borderRadius: 18, padding: "0 14px" }}>{children}</span>;

export const NoteCard: React.FC<{ t0: number; x: number; y: number; w: number; children: React.ReactNode; sub?: string }> = ({ t0, x, y, w, children, sub }) => {
  const t = useT();
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, ...pop(t, t0, 0.25) }}>
      <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "10px 18px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.forest, lineHeight: 1.2, boxShadow: "0 8px 20px rgba(31,42,20,0.10)" }}>
        {children}
        {sub && <div style={{ fontSize: 23, color: C.matcha, marginTop: 4 }}>{sub}</div>}
      </div>
    </div>
  );
};

/* 1. Hook: Gray's 1918 Fig. 501 (bundle of His drawn in red) visible from frame 0 */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={2.1} push={0.02}>
      <div style={center(0, pop(t, -0.4, 0.25))}>
        <Big size={78}>YOUR HEART DOESN'T</Big>
      </div>
      <div style={center(108, pop(t, -0.3, 0.25))}>
        <Big size={92}>NEED YOUR <HL>BRAIN</HL></Big>
      </div>
      <Plate
        src="plates/his.png" aspect={AHIS} x={150} y={235} w={600} a={-0.6} b={2.1} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.16, 0.45, 0.6]}
        labels={[{ x: 0.36, y: 0.553, text: "conduction system", t: 0.9, hot: true, ox: 20, oy: -190 }]}
        credit="Gray's 1918, Fig. 501 · PD"
      />
      <div style={{ position: "absolute", left: 0, top: 690, ...pop(t, 0.45, 0.25), transformOrigin: "0 50%" }}>
        <Pill size={32} bg={C.forest}>heart conduction system</Pill>
      </div>
      <div style={{ position: "absolute", left: 0, top: 260, ...pop(t, 1.3, 0.3) }}>
        <BrainNo w={170} slash={ramp(t, 1.45, 1.75)} />
      </div>
    </Scene>
  );
};

/* 2. SA node on Gray's 1918 Fig. 493 (interior of the right atrium) */
export const V2: React.FC = () => {
  const t = useT();
  return (
    <Scene start={2.1} end={8.1} push={0.006}>
      <div style={center(5, pop(t, 2.15, 0.22))}>
        <Big size={70}>EVERY BEAT STARTS <HL>HERE</HL></Big>
      </div>
      <Plate
        src="plates/ra.png" aspect={ARA} x={20} y={105} w={820} a={2.1} b={8.1} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.12, 0.3, 0.4]}
        labels={[
          { x: 0.085, y: 0.25, text: "SA node", t: 3.17, hot: true, ox: 150, oy: 30 },
          { x: 0.17, y: 0.5, text: "right atrium", t: 5.8, ox: 150, oy: 60 },
        ]}
        credit="Gray's 1918, Fig. 493 · PD"
      />
      <div style={{ position: "absolute", left: 420, top: 150, ...pop(t, 4.75, 0.22) }}>
        <Pill size={30} bg={C.banana} color={C.forest}>⚡ a tiny spark</Pill>
      </div>
      <NoteCard t0={6.3} x={20} y={665} w={560} sub="modern: right auricle (atrial appendage)">
        1918 atlas name: “right auricula”
      </NoteCard>
      <Stamp t0={7.28} text="NATURAL PACEMAKER" size={44} rot={-6} color={C.red} style={{ left: 330, top: 470 }} />
      <div style={{ position: "absolute", left: 600, top: 668, ...pop(t, 7.55, 0.22) }}>
        <div style={{ background: C.forest, color: C.paper, borderRadius: 24, padding: "12px 18px", fontFamily: FONT, fontWeight: 800, fontSize: 28, lineHeight: 1.15, textAlign: "center", width: 240 }}>
          fires <span style={{ color: C.banana }}>80–100×</span> a minute on its own
        </div>
      </div>
    </Scene>
  );
};

/* 3. The path: own diagram, each part lights as it is named */
const STEPS: [string, number][] = [["SA node", 8.2], ["AV node", 9.65], ["bundle of His", 10.41], ["bundle branches", 11.36], ["Purkinje fibers", 13.02]];
export const V3: React.FC = () => {
  const t = useT();
  let cur = -1;
  STEPS.forEach(([, s], i) => {
    if (t >= s - 0.08) cur = i;
  });
  const lit = STEPS.map(([, s], i) => ramp(t, s - 0.08, s + (i >= 3 ? 0.9 : 0.35)));
  const pulse = t < 8.45 || t > 14.1 ? -1 : interpolate(t, [8.45, 9.6, 10.25, 10.9, 12.5, 14.0], [0, 0.24, 0.24, 0.31, 0.52, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const word = (txt: string, on: boolean, col: string) => (
    <span style={{ background: on ? col : "transparent", color: C.forest, borderRadius: 14, padding: "0 12px", opacity: on ? 1 : 0.4 }}>{txt}</span>
  );
  return (
    <Scene start={8.1} end={14.3} push={0.004}>
      <div style={{ position: "absolute", left: 20, top: 92, width: 820, ...pop(t, 8.1, 0.35) }}>
        <Conduction
          t={t}
          w={820}
          lit={lit}
          cur={cur}
          pulse={pulse}
          atria={ramp(t, 9.0, 9.25) * (1 - ramp(t, 9.6, 10.0))}
          vent={ramp(t, 13.6, 13.85) * (1 - ramp(t, 14.1, 14.4))}
          tags={ramp(t, 8.3, 8.6)}
        />
      </div>
      <div style={center(0, pop(t, 8.15, 0.25))}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 58, color: C.forest, whiteSpace: "nowrap", background: C.card, border: `4px solid ${C.forest}`, borderRadius: 30, padding: "6px 22px 10px" }}>
          {word("SPARK", cur === 0, STEP_COL[0])} → {word("PAUSE", cur === 1, STEP_COL[1])} → {word("SPREAD", cur >= 2, STEP_COL[3])}
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 800, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px 8px" }}>
        {STEPS.map(([s, t0], i) => (
          <div key={s} style={{ ...pop(t, t0 - 0.05, 0.22), display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: i === cur ? C.forest : C.card, border: `4px solid ${C.forest}`, borderRadius: 40, padding: "5px 16px 7px 7px" }}>
              <div style={{ width: 34, height: 34, borderRadius: 17, background: STEP_COL[i], border: `3px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 20, color: C.forest }}>{i + 1}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: i === cur ? C.paper : C.forest, whiteSpace: "nowrap" }}>{s}</div>
            </div>
            {i < STEPS.length - 1 && i !== 2 && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.forest }}>→</div>}
          </div>
        ))}
      </div>
    </Scene>
  );
};

/* 4. Nerves + hormones = speed dial */
export const V4: React.FC = () => {
  const t = useT();
  const k = 0.5 + 0.38 * Math.sin((t - 15.3) * 3.2) * ramp(t, 15.3, 15.6);
  return (
    <Scene start={14.3} end={16.45} push={0.01}>
      <div style={center(20, pop(t, 14.35, 0.22))}>
        <Big size={78}><HL>NERVES</HL> + <HL bg={C.matchaLight}>HORMONES</HL></Big>
      </div>
      <div style={center(140, pop(t, 14.8, 0.25))}>
        <Big size={52} color={C.matcha}>just tune the speed</Big>
      </div>
      <div style={{ position: "absolute", left: 150, top: 240, ...pop(t, 14.9, 0.3) }}>
        <SpeedDial t={t} w={560} k={k} />
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 660, display: "flex", justifyContent: "center", gap: 20 }}>
        <div style={pop(t, 15.5, 0.22)}><Pill size={30} bg="#3F6EA8">parasympathetic ↓</Pill></div>
        <div style={pop(t, 15.75, 0.22)}><Pill size={30} bg={C.red}>sympathetic ↑</Pill></div>
      </div>
      <div style={center(760, pop(t, 15.95, 0.22))}>
        <Pill size={30} bg={C.banana} color={C.forest}>the spark itself = SA node</Pill>
      </div>
    </Scene>
  );
};

/* 5. Quick test */
export const V5: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[20.73, 3], [21.37, 2], [22.01, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => {
    if (t >= s - 0.05 && t < 22.62) { n = v; n0 = s; }
  });
  const opts = ["SA node", "AV node", "Purkinje fibers"];
  return (
    <Scene start={16.45} end={22.6}>
      <div style={{ position: "absolute", left: 20, top: 55, width: 820, height: 830, borderRadius: 48, background: C.forest, ...pop(t, 16.48, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 56, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 125, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 66, lineHeight: 1.1, color: C.paper, ...pop(t, 17.3) }}>
          Where does the signal <span style={{ color: C.banana }}>PAUSE?</span>
        </div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 290, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 32, color: C.matchaLight, ...pop(t, 18.9) }}>
          so the atria finish emptying first
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 370, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          {opts.map((o, i) => (
            <div key={o} style={{ ...pop(t, 19.4 + i * 0.25), display: "flex", alignItems: "center", gap: 18, width: 520 }}>
              <div style={{ width: 62, height: 62, flex: "0 0 62px", borderRadius: 18, background: C.banana, color: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, border: `4px solid ${C.paper}` }}>{"ABC"[i]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 48, color: C.paper, whiteSpace: "nowrap" }}>{o}</div>
            </div>
          ))}
        </div>
        {n !== null && (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 610, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 190, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 6. Answer: AV node on Gray's Fig. 501 + 0.1 s timer */
export const V6: React.FC = () => {
  const t = useT();
  const ms = Math.round(100 * ramp(t, 24.9, 25.6));
  return (
    <Scene start={22.6} end={26.15} push={0.006}>
      <div style={center(5, pop(t, 22.65, 0.25))}>
        <Pill size={52} bg={C.matcha}>B ✓ the AV node</Pill>
      </div>
      <Plate
        src="plates/his.png" aspect={AHIS} x={0} y={120} w={560} a={22.6} b={26.15} zoomFrom={[1.05, 0.4, 0.55]} zoomTo={[1.3, 0.35, 0.6]}
        labels={[
          { x: 0.275, y: 0.6, text: "AV node", t: 22.9, hot: true, ox: -10, oy: 150 },
          { x: 0.37, y: 0.553, text: "bundle of His", t: 23.5, ox: 40, oy: -150 },
          { x: 0.47, y: 0.7, text: "branches", t: 24.1, ox: -30, oy: 150 },
        ]}
        credit="Gray's 1918, Fig. 501 · PD"
      />
      <div style={{ position: "absolute", left: 585, top: 150, width: 260, height: 260, borderRadius: 34, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", ...pop(t, 23.8, 0.25) }}>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, color: C.matchaLight }}>holds each beat</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 92, color: ms >= 100 ? C.banana : C.paper, lineHeight: 1.05 }}>{(ms / 1000).toFixed(2)}<span style={{ fontSize: 44 }}> s</span></div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, color: C.matchaLight }}>≈ 100 ms</div>
      </div>
      <div style={{ position: "absolute", left: 590, top: 440, ...pop(t, 24.3, 0.22) }}>
        <Pill size={28} bg={C.banana} color={C.forest}>atria empty first</Pill>
      </div>
      <div style={{ position: "absolute", left: 590, top: 520, ...pop(t, 24.6, 0.22) }}>
        <Pill size={28} bg={C.forest}>then ventricles fire</Pill>
      </div>
      <Stamp t0={25.65} text="PAUSE" size={50} rot={-8} color={C.red} style={{ left: 620, top: 640 }} />
    </Scene>
  );
};

/* 7. Save */
export const SUMMARY = ["SA node = natural pacemaker", "AV node = ~0.1 s pause", "bundle of His (AV bundle)", "right + left bundle branches", "Purkinje fibers → ventricles", "nerves + hormones tune the rate"];
export const V7: React.FC = () => {
  const t = useT();
  const b = ramp(t, 26.3, 26.6);
  return (
    <Scene start={26.15} end={28.4}>
      <div style={center(0, pop(t, 26.2))}>
        <svg width={120} height={152} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={center(165, pop(t, 26.25))}>
        <Big size={110}>SAVE THIS</Big>
      </div>
      <div style={center(290, pop(t, 27.2))}>
        <Big size={46} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ position: "absolute", left: 30, top: 385, display: "flex", flexDirection: "column", gap: 16 }}>
        {SUMMARY.map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 14, ...pop(t, 26.5 + i * 0.1), transformOrigin: "0 50%" }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: STEP_COL[Math.min(i, 4)], border: `4px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.forest }}>{i + 1}</div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.forest, whiteSpace: "nowrap" }}>{s}</div>
          </div>
        ))}
      </div>
    </Scene>
  );
};

/* 8. End card (≤ 1.5 s) */
export const V8: React.FC = () => {
  const t = useT();
  const s0 = 28.4;
  return (
    <Scene start={s0} end={29.7}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, s0 + 0.02, 0.3) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.banana, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, s0 + 0.15, s0 + 0.4) }}>
          anatomy you'll
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
