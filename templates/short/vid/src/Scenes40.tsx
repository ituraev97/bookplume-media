import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { GooseFoot, Knee, MId } from "./Knee40";

const ASPECT_TH = 830 / 1869;
const ASPECT_X = 2115 / 1977;
const pop = (t: number, t0: number, d = 0.3) => {
  const p = ramp(t, t0, t0 + d);
  return { opacity: p, transform: `scale(${0.6 + 0.4 * p + 0.08 * Math.sin(Math.min(1, p) * Math.PI)})` } as React.CSSProperties;
};
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });
const Big: React.FC<{ size?: number; children: React.ReactNode; color?: string }> = ({ size = 110, children, color = C.forest }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1, letterSpacing: -2, textAlign: "center" }}>{children}</div>
);
const chip = (bg: string, color: string, size = 34): React.CSSProperties => ({ background: bg, color, fontFamily: FONT, fontWeight: 800, fontSize: size, padding: "8px 20px 11px", borderRadius: 16, whiteSpace: "nowrap" });
export const liveAlpha = (_t: number) => 0;
const TRIO: [MId, string, string][] = [["S", "Sartorius", "Say"], ["G", "Gracilis", "Grace"], ["T", "Semitendinosus", "Tea"]];

/* 1. Hook: 1918 plate of the front of the thigh, push in on the inner knee */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={3.3} push={0.02}>
      <Plate src="plates/thigh.png" aspect={ASPECT_TH} x={10} y={6} w={410} a={-0.6} b={3.3} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.35, 0.7, 0.86]}
        labels={[{ x: 0.72, y: 0.9, text: "?", t: 0.66, hot: true, ox: 60, oy: -40 }]} credit="Gray's Anatomy, 1918 · PD" />
      <div style={{ position: "absolute", left: 450, top: 40, width: 400, ...pop(t, 0.02, 0.25) }}>
        <Big size={150}>3</Big>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64, color: C.forest, textAlign: "center", letterSpacing: -1 }}>TENDONS</div>
      </div>
      <div style={{ position: "absolute", left: 470, top: 300, width: 360, display: "flex", justifyContent: "center", ...pop(t, 0.66) }}>
        <Pill size={42} bg={C.banana} color={C.forest}>1 SPOT</Pill>
      </div>
      <div style={{ position: "absolute", left: 450, top: 400, width: 400, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, ...pop(t, 1.19) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 4, color: C.matcha }}>INSIDE OF THE</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 84, color: C.forest, letterSpacing: -2 }}>KNEE</div>
      </div>
      <div style={{ position: "absolute", left: 450, top: 700, width: 400, display: "flex", justifyContent: "center", ...pop(t, 2.57) }}>
        <div style={{ ...chip(C.forest, C.paper, 64), padding: "12px 34px 18px", borderRadius: 26 }}>
          NAME <span style={{ color: C.banana }}>THEM?</span>
        </div>
      </div>
    </Scene>
  );
};

/* Diagram stage with camera moves between focus points */
type Step = { t: number; zoom: [number, number, number]; focus: MId[] };
const Stage: React.FC<{ t: number; start: number; steps: Step[]; props: Partial<React.ComponentProps<typeof Knee>>; h?: number }> = ({ t, start, steps, props, h = 680 }) => {
  let ci = 0;
  steps.forEach((s, i) => { if (t >= s.t) ci = i; });
  const cur = steps[ci];
  const prev = steps[Math.max(0, ci - 1)];
  const k = ci === 0 ? 1 : ramp(t, cur.t, cur.t + 0.8);
  const zs = prev.zoom[0] + (cur.zoom[0] - prev.zoom[0]) * k;
  const zx = prev.zoom[1] + (cur.zoom[1] - prev.zoom[1]) * k;
  const zy = prev.zoom[2] + (cur.zoom[2] - prev.zoom[2]) * k;
  const zIn = ramp(t, start, start + 0.9);
  const s = 1 + (zs - 1) * zIn;
  return (
    <div style={{ position: "absolute", left: 0, top: 10, width: 860, height: h, overflow: "hidden", borderRadius: 36, background: C.card, border: `3px solid ${C.line}` }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 860, height: h, transform: `scale(${s})`, transformOrigin: `${zx * 100}% ${zy * 100}%` }}>
        <div style={{ position: "absolute", left: 0, top: 0 }}><Knee t={t} w={860} focus={cur.focus} {...props} /></div>
      </div>
    </div>
  );
};

/* fact card under the diagram */
const FactCard: React.FC<{ t: number; t0: number; letter: string; name: React.ReactNode; facts: [string, number, boolean?][] }> = ({ t, t0, letter, name, facts }) => (
  <div style={{ position: "absolute", left: 30, width: 800, top: 708, height: 200, borderRadius: 36, background: C.forest, boxShadow: "0 14px 30px rgba(31,42,20,0.25)", ...pop(t, t0, 0.3) }}>
    <div style={{ position: "absolute", left: 30, top: 24, display: "flex", alignItems: "center", gap: 18 }}>
      <div style={{ width: 68, height: 68, borderRadius: 34, background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>{letter}</div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 54, color: C.paper, letterSpacing: -1, whiteSpace: "nowrap" }}>{name}</div>
    </div>
    <div style={{ position: "absolute", left: 30, top: 118, display: "flex", gap: 14 }}>
      {facts.map(([f, ft, hot]) => (
        <div key={f} style={{ ...pop(t, ft, 0.25), ...chip(hot ? C.banana : C.matcha, hot ? C.forest : C.paper, 34) }}>{f}</div>
      ))}
    </div>
  </div>
);

/* 2. Pes anserinus = goose's foot: our diagram builds */
export const V2: React.FC = () => {
  const t = useT();
  return (
    <Scene start={3.3} end={7.0} push={0.01}>
      <Stage t={t} start={3.3} steps={[
        { t: 3.3, zoom: [1.0, 0.5, 0.5], focus: [] },
        { t: 5.9, zoom: [1.25, 0.3, 0.72], focus: [] },
      ]} props={{ build: 3.32, axes: 3.9, caption: true, lit: { web: 5.97 }, goose: 5.97 }} />
      <div style={{ position: "absolute", left: 30, width: 800, top: 708, height: 200, borderRadius: 36, background: C.forest, boxShadow: "0 14px 30px rgba(31,42,20,0.25)", ...pop(t, 3.4, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 800, top: 26, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 66, color: C.paper, letterSpacing: -1, ...pop(t, 4.12) }}>
          Pes <span style={{ background: C.banana, color: C.forest, borderRadius: 14, padding: "0 12px 4px" }}>anserinus</span>
        </div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 122, display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
          <div style={{ ...pop(t, 5.45), fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.matchaLight }}>Latin for</div>
          <div style={{ ...pop(t, 5.97), ...chip(C.banana, C.forest, 40) }}>goose's foot</div>
        </div>
      </div>
    </Scene>
  );
};

/* 3. Mnemonic card */
const WORDS3: [string, number, boolean][] = [["Say", 8.57, true], ["Grace", 8.79, true], ["before", 9.15, false], ["Tea", 9.46, true]];
export const V3: React.FC = () => {
  const t = useT();
  return (
    <Scene start={7.0} end={10.1}>
      <div style={{ position: "absolute", left: 10, top: 10, width: 840, height: 900, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 7.0, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 50, display: "flex", justifyContent: "center", gap: 18, alignItems: "center", ...pop(t, 7.08) }}>
          <div style={chip(C.matcha, C.paper, 34)}>◀ FRONT</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.matchaLight, letterSpacing: 4 }}>TO</div>
          <div style={chip(C.matcha, C.paper, 34)}>BACK ▶</div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 230, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 64, color: C.matchaLight, opacity: ramp(t, 7.3, 7.6) * (1 - ramp(t, 8.45, 8.6)), transform: `scale(${0.85 + 0.15 * ramp(t, 7.3, 7.6)})` }}>
          3 muscles · 1 sentence
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 40 }}>
            {[0, 1, 2].map((i) => <div key={i} style={{ width: 110, height: 110, borderRadius: 22, border: `5px dashed ${C.matcha}`, opacity: ramp(t, 7.6 + i * 0.12, 7.8 + i * 0.12) }} />)}
          </div>
        </div>
        <div style={{ position: "absolute", left: 50, top: 150, width: 740, textAlign: "center" }}>
          {WORDS3.map(([w, tt, key], i) => {
            const p = ramp(t, tt - 0.05, tt + 0.2);
            return (
              <div key={w} style={{ display: "inline-flex", alignItems: "baseline", margin: "0 13px 8px", opacity: p, transform: `translateY(${(1 - p) * -60}px) scale(${1 + 0.1 * Math.sin(p * Math.PI)})`, fontFamily: FONT, fontWeight: 800, fontSize: key ? 112 : 80, letterSpacing: -3, lineHeight: 1.12 }}>
                {key ? (
                  <>
                    <span style={{ background: C.banana, color: C.forest, borderRadius: 18, padding: "0 12px 4px", marginRight: 4 }}>{w[0]}</span>
                    <span style={{ color: C.paper }}>{w.slice(1)}</span>
                  </>
                ) : (
                  <span style={{ color: C.matchaLight }}>{w}</span>
                )}
                {i === 3 && <span style={{ color: C.paper }}>.</span>}
              </div>
            );
          })}
        </div>
        {TRIO.map(([l, name], i) => {
          const p = ramp(t, 9.62 + i * 0.12, 9.92 + i * 0.12);
          return (
            <div key={l} style={{ position: "absolute", left: 80, top: 520 + i * 110, opacity: p, transform: `translateX(${(1 - p) * 40}px)`, display: "flex", alignItems: "center", fontFamily: FONT, fontWeight: 800 }}>
              <span style={{ width: 56, fontSize: 30, color: C.matchaLight }}>{i + 1}</span>
              <span style={{ display: "inline-block", width: 78, height: 80, borderRadius: 18, background: C.matcha, color: C.paper, textAlign: "center", lineHeight: "80px", fontSize: 54, marginRight: 24 }}>{l}</span>
              <span style={{ fontSize: 54, color: C.paper, letterSpacing: -1 }}>
                {l === "T" ? (<>Semi<span style={{ color: C.banana }}>t</span>endinosus</>) : name}
              </span>
            </div>
          );
        })}
      </div>
    </Scene>
  );
};

/* 4. S: sartorius */
export const V4: React.FC = () => {
  const t = useT();
  return (
    <Scene start={10.1} end={13.85} push={0.01}>
      <Stage t={t} start={10.1} steps={[
        { t: 10.1, zoom: [1.0, 0.5, 0.5], focus: ["S"] },
        { t: 11.71, zoom: [1.25, 0.25, 0.25], focus: ["S"] },
        { t: 12.94, zoom: [1.2, 0.2, 0.2], focus: ["S"] },
      ]} props={{ axes: 0, dimFrom: 10.4, lit: { S: 10.58 }, letters: { S: 10.4 }, names: { S: 10.8 } }} />
      <FactCard t={t} t0={10.15} letter="S" name={<>Say → <span style={{ color: C.banana }}>Sartorius</span></>} facts={[["long strap muscle", 11.71], ["from the FRONT", 12.94, true]]} />
    </Scene>
  );
};

/* 5. G: gracilis */
export const V5: React.FC = () => {
  const t = useT();
  return (
    <Scene start={13.85} end={17.1} push={0.01}>
      <Stage t={t} start={13.85} steps={[
        { t: 13.85, zoom: [1.15, 0.62, 0.35], focus: ["G"] },
        { t: 15.44, zoom: [1.35, 0.66, 0.15], focus: ["G"] },
        { t: 16.31, zoom: [1.1, 0.62, 0.4], focus: ["G"] },
      ]} props={{ axes: 0, dimFrom: 13.86, lit: { G: 14.5 }, letters: { S: 0, G: 14.36 }, names: { G: 14.7 } }} />
      <FactCard t={t} t0={13.9} letter="G" name={<>Grace → <span style={{ color: C.banana }}>Gracilis</span></>} facts={[["thin", 15.44], ["INNER thigh", 16.31, true]]} />
    </Scene>
  );
};

/* 6. T: semitendinosus */
export const V6: React.FC = () => {
  const t = useT();
  return (
    <Scene start={17.1} end={20.15} push={0.01}>
      <Stage t={t} start={17.1} steps={[
        { t: 17.1, zoom: [1.15, 0.85, 0.2], focus: ["T"] },
        { t: 18.88, zoom: [1.3, 0.75, 0.45], focus: ["T"] },
        { t: 19.58, zoom: [1.05, 0.6, 0.5], focus: ["T"] },
      ]} props={{ axes: 0, dimFrom: 17.11, lit: { T: 17.62 }, letters: { S: 0, G: 0, T: 17.5 }, names: { T: 17.9 } }} />
      <FactCard t={t} t0={17.15} letter="T" name={<>Tea → <span style={{ color: C.banana, fontSize: 48 }}>Semitendinosus</span></>} facts={[["a HAMSTRING", 18.88, true], ["from the BACK", 19.58, true]]} />
    </Scene>
  );
};

/* 7. The 1918 cross-section: three compartments + old-name note */
export const V7: React.FC = () => {
  const t = useT();
  const COMP: [MId, string, number][] = [["S", "FRONT", 25.09], ["G", "INNER", 25.46], ["T", "BACK", 26.02]];
  const noteOut = ramp(t, 24.1, 24.35);
  return (
    <Scene start={20.15} end={26.55} push={0.01}>
      <Plate src="plates/xsec.png" aspect={ASPECT_X} x={40} y={0} w={780} a={20.15} b={26.55} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.14, 0.6, 0.55]}
        labels={[
          { x: 0.63, y: 0.24, text: "Sartorius", t: 22.95, ox: -230, oy: -10 },
          { x: 0.765, y: 0.53, text: "Gracilis", t: 23.13, ox: -210, oy: 40 },
          { x: 0.556, y: 0.813, text: "Semitendinosus", t: 23.44, hot: true, ox: -40, oy: -110 },
        ]}
      />
      <div style={{ position: "absolute", left: 40, width: 780, top: 760, height: 150, borderRadius: 26, background: C.forest, boxShadow: "0 12px 26px rgba(31,42,20,0.3)", opacity: ramp(t, 21.6, 21.9) * (1 - noteOut), transform: `scale(${0.7 + 0.3 * ramp(t, 21.6, 21.9)})` }}>
        <div style={{ position: "absolute", left: 30, top: 20, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.matchaLight, letterSpacing: 2 }}>1918 ATLAS NAME · MID-THIGH SLICE</div>
        <div style={{ position: "absolute", left: 30, top: 64, fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.paper, whiteSpace: "nowrap" }}>
          "Ischiadic N." = <span style={{ color: C.banana }}>sciatic nerve</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 40, width: 780, top: 760, height: 150, borderRadius: 26, background: C.forest, boxShadow: "0 12px 26px rgba(31,42,20,0.3)", ...pop(t, 24.3) }}>
        <div style={{ position: "absolute", left: 0, width: 780, top: 16, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.matchaLight, letterSpacing: 3 }}>3 DIFFERENT COMPARTMENTS</div>
        <div style={{ position: "absolute", left: 0, width: 780, top: 60, display: "flex", justifyContent: "center", gap: 18 }}>
          {COMP.map(([l, c, ct]) => (
            <div key={l} style={{ ...pop(t, ct, 0.25), display: "flex", alignItems: "center", gap: 10, background: l === "T" ? C.banana : C.matcha, borderRadius: 18, padding: "6px 18px 8px 8px" }}>
              <div style={{ width: 54, height: 54, borderRadius: 27, background: C.forest, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>{l}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: l === "T" ? C.forest : C.paper }}>{c}</div>
            </div>
          ))}
        </div>
      </div>
    </Scene>
  );
};

/* 8. One shared insertion: upper medial tibia */
export const V8: React.FC = () => {
  const t = useT();
  return (
    <Scene start={26.55} end={30.6} push={0.01}>
      <Stage t={t} start={26.55} steps={[
        { t: 26.55, zoom: [1.0, 0.5, 0.5], focus: [] },
        { t: 26.96, zoom: [1.0, 0.5, 0.5], focus: ["S", "G", "T"] },
        { t: 28.6, zoom: [1.7, 0.38, 0.8], focus: ["S", "G", "T"] },
      ]} props={{ axes: 0, lit: { S: 26.96, G: 27.06, T: 27.16, web: 27.67, ins: 28.6 }, letters: { S: 0, G: 0, T: 0 } }} />
      <Stamp t0={27.67} text="SAME SPOT" size={58} rot={-8} color={C.red} style={{ left: 480, top: 300 }} />
      <div style={{ position: "absolute", left: 30, width: 800, top: 708, height: 200, borderRadius: 36, background: C.forest, ...pop(t, 26.6, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 800, top: 24, display: "flex", justifyContent: "center", gap: 12, alignItems: "center" }}>
          {TRIO.map(([l], i) => (
            <div key={l} style={{ ...pop(t, 26.96 + i * 0.1, 0.25), width: 64, height: 64, borderRadius: 18, background: C.matcha, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>{l}</div>
          ))}
          <div style={{ ...pop(t, 27.28), fontFamily: FONT, fontWeight: 800, fontSize: 50, color: C.paper, marginLeft: 8 }}>insert together</div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 116, display: "flex", justifyContent: "center", gap: 14, alignItems: "center" }}>
          <div style={{ ...pop(t, 28.48), fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.matchaLight }}>on the</div>
          <div style={{ ...pop(t, 28.81), ...chip(C.banana, C.forest, 40) }}>upper medial tibia</div>
        </div>
      </div>
    </Scene>
  );
};

/* 9. Quick test */
export const C0 = 33.15;
export const V9: React.FC = () => {
  const t = useT();
  const n = t < C0 ? null : t < C0 + 0.5 ? 3 : t < C0 + 1.0 ? 2 : t < C0 + 1.5 ? 1 : null;
  const k = Math.floor((t - C0) / 0.5) * 0.5 + C0;
  return (
    <Scene start={30.6} end={34.62}>
      <div style={{ position: "absolute", left: 10, top: 30, width: 840, height: 860, borderRadius: 48, background: C.forest, ...pop(t, 30.65, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 52, display: "flex", justifyContent: "center" }}>
          <div style={{ background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, padding: "8px 28px 11px 36px", borderRadius: 18 }}>QUICK TEST</div>
        </div>
        <div style={{ position: "absolute", left: 40, width: 760, top: 170, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 70, lineHeight: 1.12, color: C.paper, ...pop(t, 31.58) }}>
          Which of the 3 is a <span style={{ background: C.banana, color: C.forest, borderRadius: 16, padding: "0 14px 4px", display: "inline-block" }}>hamstring?</span>
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 450, display: "flex", justifyContent: "center", gap: 22 }}>
          {TRIO.map(([x], i) => (
            <div key={x} style={{ ...pop(t, 32.3 + i * 0.12), width: 150, height: 150, borderRadius: 26, background: C.matchaDark, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 86, display: "flex", alignItems: "center", justifyContent: "center" }}>{x}</div>
          ))}
        </div>
        {n && (
          <div style={{ position: "absolute", left: 0, width: 840, top: 660, display: "flex", justifyContent: "center", transform: `scale(${1.3 - 0.3 * ramp(t, k, k + 0.15)})` }}>
            <div style={{ width: 150, height: 150, borderRadius: 75, background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 104, lineHeight: "150px", textAlign: "center" }}>{n}</div>
          </div>
        )}
      </div>
    </Scene>
  );
};

/* 10. Answer: semitendinosus */
export const V10: React.FC = () => {
  const t = useT();
  return (
    <Scene start={34.62} end={36.75} push={0.01}>
      <div style={{ ...center(20), gap: 18, alignItems: "center" }}>
        {TRIO.map(([x], i) => {
          const hot = i === 2;
          const p = ramp(t, 34.67 + (hot ? 0.1 : 0), 35.0);
          return (
            <div key={x} style={{ width: hot ? 150 : 104, height: hot ? 160 : 110, borderRadius: 24, background: hot ? C.red : C.matchaLight, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: hot ? 110 : 64, display: "flex", alignItems: "center", justifyContent: "center", opacity: hot ? 1 : 0.35 + 0.65 * (1 - p), transform: hot ? `scale(${0.7 + 0.3 * p + 0.1 * Math.sin(p * Math.PI)})` : "none" }}>{x}</div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, top: 200, width: 860, height: 480, borderRadius: 36, background: C.card, border: `3px solid ${C.line}`, overflow: "hidden", ...pop(t, 34.7) }}>
        <div style={{ position: "absolute", left: 60, top: -30 }}>
          <Knee t={t} w={760} focus={["T"]} dimFrom={34.66} lit={{ T: 34.7 }} letters={{ T: 34.75 }} />
        </div>
        <div style={{ position: "absolute", left: 30, top: 30, ...pop(t, 35.0), ...chip(C.banana, C.forest, 40) }}>hamstring ✓</div>
      </div>
      <div style={{ position: "absolute", left: 30, width: 800, top: 708, height: 200, borderRadius: 36, background: C.forest, ...pop(t, 34.75) }}>
        <div style={{ position: "absolute", left: 0, width: 800, top: 22, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 58, color: C.paper, letterSpacing: -1, ...pop(t, 34.68) }}>Semitendinosus</div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 112, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.matchaLight, ...pop(t, 35.76) }}>
          Say Grace before <span style={{ background: C.banana, color: C.forest, borderRadius: 12, padding: "0 10px 3px" }}>T</span>ea
        </div>
      </div>
    </Scene>
  );
};

/* 11. Save */
export const V11: React.FC = () => {
  const t = useT();
  const b = ramp(t, 36.95, 37.3);
  return (
    <Scene start={36.75} end={38.95}>
      <div style={center(40, pop(t, 36.85))}>
        <svg width={220} height={280} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={center(360, pop(t, 36.91))}>
        <Big size={120}>SAVE THIS</Big>
      </div>
      <div style={center(510, pop(t, 37.62))}>
        <Big size={58} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ ...center(640), gap: 16, alignItems: "center", ...pop(t, 38.1) }}>
        {TRIO.map(([l], i) => (
          <div key={i} style={{ width: 124, height: 128, borderRadius: 24, background: i === 2 ? C.red : C.matcha, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 78, display: "flex", alignItems: "center", justifyContent: "center" }}>{l}</div>
        ))}
        <svg width={150} height={150} viewBox="-80 -80 160 160" style={{ marginLeft: 10 }}><GooseFoot size={150} /></svg>
      </div>
    </Scene>
  );
};

/* 12. End card */
export const V12: React.FC = () => {
  const t = useT();
  return (
    <Scene start={38.95} end={43.6}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, 39.0, 0.35) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.matchaLight, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 40.15, 40.45) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 39.2) * 5))})`, opacity: ramp(t, 39.17, 39.5) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
