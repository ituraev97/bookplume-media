import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { BrainBase, NerveId, NAMES, ROMAN, VagusPath } from "./Nerves31";

const ASPECT = 1780 / 1924;
const pop = (t: number, t0: number, d = 0.3) => {
  const p = ramp(t, t0, t0 + d);
  return { opacity: p, transform: `scale(${0.6 + 0.4 * p + 0.08 * Math.sin(Math.min(1, p) * Math.PI)})` } as React.CSSProperties;
};
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });
const Big: React.FC<{ size?: number; children: React.ReactNode; color?: string }> = ({ size = 110, children, color = C.forest }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1, letterSpacing: -2, textAlign: "center" }}>{children}</div>
);
export const liveAlpha = (_t: number) => 0;

/* 1. Hook: the real 1918 plate, push in on the brainstem */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={4.75} push={0.02}>
      <div style={center(22, pop(t, 0, 0.25))}>
        <div style={{ whiteSpace: "nowrap" }}><Big size={74}>
          <span style={{ color: C.matcha }}>12</span> CRANIAL NERVES?
        </Big></div>
      </div>
      <Plate src="plates/brainbase.png" aspect={ASPECT} x={110} y={128} w={640} a={-0.6} b={4.75} zoomFrom={[1, 0.45, 0.45]} zoomTo={[1.9, 0.4, 0.55]} credit="Gray's Anatomy, 1918 · public domain" />
      <div style={{ position: "absolute", left: 40, top: 160, ...pop(t, 1.0) }}>
        <Pill size={36} bg={C.forest}>IN ORDER</Pill>
      </div>
      <Stamp t0={2.7} text="ONE SENTENCE" size={50} rot={-7} color={C.red} style={{ left: 330, top: 730, whiteSpace: "nowrap" }} />
    </Scene>
  );
};

/* 2. Twelve pairs, front to back */
export const V2: React.FC = () => {
  const t = useT();
  return (
    <Scene start={4.75} end={9.05}>
      <div style={{ position: "absolute", left: 10, top: -40, transform: `translateY(${(1 - ramp(t, 4.75, 5.2)) * 40}px)` }}>
        <BrainBase t={t} w={780} arrow={6.9} tags={7.85} allGlow={5.2} allGlowEnd={6.6} />
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, justifyContent: "center", top: 790, display: "flex", gap: 16 }}>
        <div style={pop(t, 5.0)}><Pill size={40} bg={C.forest}>12 pairs</Pill></div>
        <div style={pop(t, 7.0)}><Pill size={40} bg={C.red}>front → back</Pill></div>
        <div style={pop(t, 7.9)}><Pill size={40} bg={C.banana} color={C.forest}>I → XII</Pill></div>
      </div>
    </Scene>
  );
};

/* 3. The sentence */
const WORDS3: [string, number][] = [
  ["Ooh", 9.71], ["Ooh", 9.96], ["Ooh", 10.22], ["To", 10.41],
  ["Touch", 10.52], ["And", 10.81], ["Feel", 10.9], ["Very", 11.12],
  ["Good", 11.36], ["Velvet", 11.54], ["Such", 12.23], ["Heaven!", 12.52],
];
export const V3: React.FC = () => {
  const t = useT();
  const row = (ws: [string, number][], i0: number, top: number) => (
    <div style={{ position: "absolute", left: 0, width: 840, top, display: "flex", justifyContent: "center", gap: 14 }}>
      {ws.map(([w, wt], j) => {
        const p = ramp(t, wt - 0.05, wt + 0.18);
        return (
          <div key={j} style={{ opacity: p, transform: `translateY(${(1 - p) * 30}px) scale(${0.8 + 0.2 * p})`, textAlign: "center" }}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 54, letterSpacing: -1.5, color: C.paper, lineHeight: 1 }}>
              <span style={{ color: C.banana, fontSize: 74 }}>{w[0]}</span>
              {w.slice(1)}
            </div>
            <div style={{ marginTop: 10, fontFamily: FONT, fontWeight: 800, fontSize: 22, color: C.matchaLight, letterSpacing: 1, opacity: ramp(t, wt + 0.15, wt + 0.4) }}>{ROMAN[i0 + j + 1]}</div>
          </div>
        );
      })}
    </div>
  );
  return (
    <Scene start={9.05} end={13.15}>
      <div style={{ position: "absolute", left: 10, top: 40, width: 840, height: 820, borderRadius: 48, background: C.forest, ...pop(t, 9.1, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 64, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 6, color: C.matchaLight }}>REMEMBER THIS SENTENCE</div>
        {row(WORDS3.slice(0, 4), 0, 190)}
        {row(WORDS3.slice(4, 8), 4, 380)}
        {row(WORDS3.slice(8), 8, 570)}
        <div style={{ position: "absolute", left: 0, width: 840, top: 740, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.banana, opacity: ramp(t, 12.6, 12.9) }}>first letter = first letter of each nerve</div>
      </div>
    </Scene>
  );
};

/* 4. Name them in groups of three */
const GROUPS: [NerveId, number][][] = [
  [[1, 13.35], [2, 13.98], [3, 14.45]],
  [[4, 15.53], [5, 16.05], [6, 16.76]],
  [[7, 17.71], [8, 18.16], [9, 19.4]],
  [[10, 20.73], [11, 21.13], [12, 22.06]],
];
const GSTART = [13.15, 15.35, 17.5, 20.55];
export const V4: React.FC = () => {
  const t = useT();
  const lit: Partial<Record<NerveId, number>> = {};
  GROUPS.flat().forEach(([id, tt]) => (lit[id] = tt));
  let gi = 0;
  GSTART.forEach((s, i) => { if (t >= s) gi = i; });
  const sw = ramp(t, GSTART[gi], GSTART[gi] + 0.3);
  const done = ramp(t, 23.26, 23.6);
  return (
    <Scene start={13.15} end={24.85} push={0.02}>
      <div style={{ position: "absolute", left: 50, top: -40 }}>
        <BrainBase t={t} w={760} lit={lit} allGlow={23.3} />
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 750, opacity: 1 - done }}>
        <div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 28, letterSpacing: 4, color: C.matcha, marginBottom: 12 }}>
          NERVES {ROMAN[gi * 3 + 1]} – {ROMAN[gi * 3 + 3]}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, opacity: sw, transform: `translateY(${(1 - sw) * 20}px)` }}>
          {GROUPS[gi].map(([id, tt]) => {
            const p = ramp(t, tt - 0.05, tt + 0.2);
            const now = t >= tt && t < tt + 0.6;
            const long = NAMES[id].length > 12;
            return (
              <div key={id} style={{ opacity: 0.3 + 0.7 * p, transform: `scale(${now ? 1.07 : 1})`, background: p > 0.5 ? C.forest : C.line, color: p > 0.5 ? C.paper : C.forest, fontFamily: FONT, fontWeight: 800, fontSize: long ? 27 : 32, padding: "10px 14px 13px", borderRadius: 16, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ background: C.banana, color: C.forest, borderRadius: 10, padding: "0 8px 2px", fontSize: long ? 22 : 24 }}>{ROMAN[id]}</span>
                <span><span style={{ color: p > 0.5 ? C.banana : C.forest }}>{NAMES[id][0]}</span>{NAMES[id].slice(1)}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 770, display: "flex", justifyContent: "center", ...pop(t, 23.4) }}>
        <Pill size={50} bg={C.matcha}>ALL 12 ✓ in order</Pill>
      </div>
    </Scene>
  );
};

/* 5. Bonus: number eight on the 1918 plate, modern label */
export const V5: React.FC = () => {
  const t = useT();
  return (
    <Scene start={24.85} end={30.5} push={0.01}>
      <div style={center(0, pop(t, 24.95))}>
        <Pill size={40} bg={C.banana} color={C.forest}>BONUS · NERVE VIII</Pill>
      </div>
      <Plate
        src="plates/brainbase.png" aspect={ASPECT} x={110} y={80} w={640} a={24.85} b={30.5}
        zoomFrom={[1.6, 0.36, 0.6]} zoomTo={[2.2, 0.33, 0.63]}
        labels={[
          { x: 0.285, y: 0.662, text: "VIII", t: 26.32, side: "l", hot: true },
          { x: 0.405, y: 0.585, text: "Pons", t: 27.4, side: "r" },
        ]}
      />
      <div style={{ position: "absolute", left: 0, width: 860, top: 640, display: "flex", justifyContent: "center", opacity: ramp(t, 26.35, 26.6) * (1 - ramp(t, 27.55, 27.7)), transform: `scale(${0.8 + 0.2 * ramp(t, 26.35, 26.6)})` }}>
        <Pill size={44} bg={C.forest}>VIII = <span style={{ color: C.banana }}>Vestibulocochlear</span></Pill>
      </div>
      <div style={{ position: "absolute", left: 30, width: 800, top: 790, display: "flex", justifyContent: "center", gap: 14 }}>
        <div style={pop(t, 29.14)}><Pill size={36} bg={C.matcha}>vestibulo = balance</Pill></div>
        <div style={pop(t, 29.81)}><Pill size={36} bg={C.red}>cochlear = hearing</Pill></div>
      </div>
      <div style={{ position: "absolute", left: 90, width: 680, top: 700, display: "flex", justifyContent: "center", opacity: ramp(t, 27.7, 28.0) * (1 - ramp(t, 29.0, 29.15)), transform: `scale(${0.8 + 0.2 * ramp(t, 27.7, 28.0)})` }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 20px 11px", fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.forest, whiteSpace: "nowrap" }}>
          <span style={{ color: C.matcha }}>1918 atlas name:</span> pons Varolii
        </div>
      </div>
    </Scene>
  );
};

/* 6. Quick test */
export const V6: React.FC = () => {
  const t = useT();
  const c0 = 32.7;
  const n = t < c0 ? null : t < c0 + 0.5 ? 3 : t < c0 + 1.0 ? 2 : t < c0 + 1.5 ? 1 : null;
  const k = Math.floor((t - c0) / 0.5) * 0.5 + c0;
  return (
    <Scene start={30.5} end={34.2}>
      <div style={{ position: "absolute", left: 10, top: 40, width: 840, height: 820, borderRadius: 48, background: C.forest, ...pop(t, 30.55, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 70, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 40, width: 760, top: 170, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 84, lineHeight: 1.05, color: C.paper, ...pop(t, 31.3) }}>
          Which nerve is number <span style={{ color: C.banana }}>X?</span>
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 420, display: "grid", gridTemplateColumns: "300px 300px", justifyContent: "center", gap: 16 }}>
          {["Facial", "Vagus", "Trochlear", "Hypoglossal"].map((x, i) => (
            <div key={x} style={{ ...pop(t, 31.9 + i * 0.1), background: C.matchaDark, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 40, padding: "12px 0 15px", borderRadius: 18, textAlign: "center" }}>{x}</div>
          ))}
        </div>
        {n && (
          <div style={{ position: "absolute", left: 0, width: 840, top: 630, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 130, color: C.banana, lineHeight: 1, transform: `scale(${1.3 - 0.3 * ramp(t, k, k + 0.15)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 7. Answer: vagus, the wanderer */
export const V7: React.FC = () => {
  const t = useT();
  return (
    <Scene start={34.2} end={39.3} push={0.01}>
      <div style={{ position: "absolute", left: 0, top: 10, opacity: 1 - ramp(t, 35.9, 36.2), transform: `scale(${1 - 0.1 * ramp(t, 35.9, 36.2)})` }}>
        <BrainBase t={t} w={500} lit={{ 10: 34.49 }} only={10} onlyAt={34.4} />
      </div>
      <div style={{ position: "absolute", left: 30, top: 0, opacity: ramp(t, 36.0, 36.3) }}>
        <VagusPath t={t} t0={36.4} t1={38.6} w={360} />
      </div>
      <div style={{ position: "absolute", left: 520, top: 120, ...pop(t, 34.5) }}>
        <Pill size={50} bg={C.red}>X · VAGUS</Pill>
      </div>
      <div style={{ position: "absolute", left: 440, width: 400, top: 250, borderRadius: 32, background: C.card, border: `4px solid ${C.line}`, padding: "22px 28px", boxSizing: "border-box", fontFamily: FONT, ...pop(t, 35.8) }}>
        <div style={{ fontWeight: 800, fontSize: 26, letterSpacing: 4, color: C.matcha }}>LATIN</div>
        <div style={{ fontWeight: 800, fontSize: 50, color: C.forest, lineHeight: 1.1 }}>
          vagus =<br /><span style={{ color: C.red }}>wandering</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 440, width: 400, top: 500, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={pop(t, 37.0)}><Pill size={34} bg={C.forest}>starts: brainstem</Pill></div>
        <div style={pop(t, 37.7)}><Pill size={34} bg={C.matcha}>through neck + chest</Pill></div>
        <div style={pop(t, 38.5)}><Pill size={34} bg={C.banana} color={C.forest}>down to the abdomen</Pill></div>
      </div>
    </Scene>
  );
};

/* 8. Save */
export const V8: React.FC = () => {
  const t = useT();
  const b = ramp(t, 39.4, 39.75);
  return (
    <Scene start={39.3} end={41.55}>
      <div style={center(40, pop(t, 39.35))}>
        <svg width={220} height={280} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={center(360, pop(t, 39.55))}>
        <Big size={120}>SAVE THIS</Big>
      </div>
      <div style={center(510, pop(t, 40.3))}>
        <Big size={58} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 650, display: "flex", justifyContent: "center", gap: 8 }}>
        {"OOOTTAFVGVSH".split("").map((l, i) => (
          <div key={i} style={{ ...pop(t, 40.6 + i * 0.04), width: 58, height: 70, borderRadius: 14, background: [C.forest, C.matcha, C.red, C.matchaDark][Math.floor(i / 3)], color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>{l}</div>
        ))}
      </div>
    </Scene>
  );
};

/* 9. End card */
export const V9: React.FC = () => {
  const t = useT();
  return (
    <Scene start={41.55} end={46.0}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, 41.6, 0.35) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.banana, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 42.5, 42.8) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 41.5) * 5))})`, opacity: ramp(t, 41.8, 42.1) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
