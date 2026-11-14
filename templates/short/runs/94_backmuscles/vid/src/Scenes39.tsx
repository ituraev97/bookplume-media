import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { Heart, PartId, ValveTop } from "./Heart39";

const ASPECT_RH = 1472 / 1098;
const ASPECT_V = 1003 / 963;
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
const ORDER: ["T" | "P" | "M" | "A", string][] = [["T", "Tricuspid"], ["P", "Pulmonary"], ["M", "Mitral"], ["A", "Aortic"]];

/* 1. Hook: 1918 plate of the opened right heart, push in on the tricuspid */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={3.0} push={0.02}>
      <div style={center(30, pop(t, 0, 0.25))}>
        <Big size={88}>
          NAME ALL <span style={{ background: C.banana, borderRadius: 18, padding: "0 16px 6px" }}>4?</span>
        </Big>
      </div>
      <Plate src="plates/rightheart.png" aspect={ASPECT_RH} x={40} y={130} w={780} a={-0.6} b={3.0} zoomFrom={[1, 0.5, 0.5]} zoomTo={[1.2, 1.0, 0.45]} />
      <div style={{ position: "absolute", left: 30, top: 740, ...pop(t, 0.9) }}>
        <Pill size={46} bg={C.banana} color={C.forest}>HEART VALVES</Pill>
      </div>
      <div style={{ position: "absolute", left: 490, top: 750, ...pop(t, 1.7) }}>
        <Pill size={40} bg={C.forest}>IN ORDER</Pill>
      </div>
      <Stamp t0={2.62} text="THE TRICK" size={62} rot={-8} color={C.red} style={{ left: 440, top: 560 }} />
    </Scene>
  );
};

/* 2. Mnemonic card */
const WORDS2: [string, number][] = [["Try", 3.15], ["Pulling", 3.39], ["My", 3.67], ["Aorta", 3.87]];
export const V2: React.FC = () => {
  const t = useT();
  return (
    <Scene start={3.0} end={4.82}>
      <div style={{ position: "absolute", left: 10, top: 10, width: 840, height: 900, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 3.0, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 48, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: C.matchaLight, ...pop(t, 3.05) }}>THE ORDER BLOOD FLOWS THROUGH</div>
        <div style={{ position: "absolute", left: 60, top: 120, width: 720 }}>
          {WORDS2.map(([w, tt], i) => {
            const p = ramp(t, tt - 0.05, tt + 0.2);
            return (
              <div key={w} style={{ display: "inline-flex", alignItems: "baseline", marginRight: 26, marginBottom: 6, opacity: p, transform: `translateY(${(1 - p) * -60}px) scale(${1 + 0.1 * Math.sin(p * Math.PI)})`, fontFamily: FONT, fontWeight: 800, fontSize: 104, letterSpacing: -3, lineHeight: 1.12 }}>
                <span style={{ background: C.banana, color: C.forest, borderRadius: 18, padding: "0 12px 4px", marginRight: 4 }}>{w[0]}</span>
                <span style={{ color: C.paper }}>{w.slice(1)}</span>
                {i === 3 && <span style={{ color: C.paper }}>.</span>}
              </div>
            );
          })}
        </div>
        {ORDER.map(([l, name], i) => {
          const p = ramp(t, 4.05 + i * 0.12, 4.35 + i * 0.12);
          return (
            <div key={l} style={{ position: "absolute", left: 90, top: 470 + i * 98, opacity: p, transform: `translateX(${(1 - p) * 40}px)`, display: "flex", alignItems: "center", fontFamily: FONT, fontWeight: 800 }}>
              <span style={{ width: 60, fontSize: 30, color: C.matchaLight }}>{i + 1}</span>
              <span style={{ display: "inline-block", width: 72, height: 74, borderRadius: 16, background: C.matcha, color: C.paper, textAlign: "center", lineHeight: "74px", fontSize: 50, marginRight: 22 }}>{l}</span>
              <span style={{ fontSize: 52, color: C.paper, letterSpacing: -1 }}>{name}</span>
              <span style={{ fontSize: 30, color: C.matchaLight, marginLeft: 18 }}>{i < 2 ? "right side" : "left side"}</span>
            </div>
          );
        })}
      </div>
    </Scene>
  );
};

/* fact card under the diagram */
const FactCard: React.FC<{ t: number; t0: number; letter: string; name: string; facts: [string, number, boolean?][]; inset?: React.ReactNode; small?: boolean }> = ({ t, t0, letter, name, facts, inset, small }) => (
  <div style={{ position: "absolute", left: 30, width: 800, top: 708, height: 200, borderRadius: 36, background: C.forest, boxShadow: "0 14px 30px rgba(31,42,20,0.25)", ...pop(t, t0, 0.3) }}>
    <div style={{ position: "absolute", left: 30, top: 24, display: "flex", alignItems: "center", gap: 18 }}>
      <div style={{ width: 68, height: 68, borderRadius: 34, background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: small ? 34 : 44, display: "flex", alignItems: "center", justifyContent: "center" }}>{letter}</div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: small ? 46 : 54, color: C.paper, letterSpacing: -1, whiteSpace: "nowrap" }}>{name}</div>
    </div>
    <div style={{ position: "absolute", left: 30, top: 118, display: "flex", gap: 14 }}>
      {facts.map(([f, ft, hot]) => (
        <div key={f} style={{ ...pop(t, ft, 0.25), ...chip(hot ? C.banana : C.matcha, hot ? C.forest : C.paper, 34) }}>{f}</div>
      ))}
    </div>
    {inset && <div style={{ position: "absolute", right: 22, top: -70 }}>{inset}</div>}
  </div>
);

/* Diagram stage with camera moves between focus points */
type Step = { t: number; zoom: [number, number, number]; focus: PartId[] };
const Stage: React.FC<{ t: number; start: number; steps: Step[]; props: Partial<React.ComponentProps<typeof Heart>> }> = ({ t, start, steps, props }) => {
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
    <div style={{ position: "absolute", left: 0, top: 10, width: 860, height: 680, overflow: "hidden", borderRadius: 36, background: C.card, border: `3px solid ${C.line}` }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 860, height: 680, transform: `scale(${s})`, transformOrigin: `${zx * 100}% ${zy * 100}%` }}>
        <div style={{ position: "absolute", left: 34, top: 24 }}><Heart t={t} w={792} focus={cur.focus} {...props} /></div>
      </div>
    </div>
  );
};

/* 3. T: tricuspid */
export const V3: React.FC = () => {
  const t = useT();
  return (
    <Scene start={4.82} end={9.85} push={0.01}>
      <Stage t={t} start={4.82} steps={[
        { t: 4.82, zoom: [1.0, 0.5, 0.5], focus: ["T"] },
        { t: 6.77, zoom: [1.3, 0.25, 0.45], focus: ["RA"] },
        { t: 7.67, zoom: [1.3, 0.25, 0.62], focus: ["RV"] },
        { t: 8.79, zoom: [1.45, 0.24, 0.56], focus: ["T"] },
      ]} props={{ build: 4.85, tags: 5.4, dimFrom: 5.32, lit: { T: 5.32, RA: 6.77, RV: 7.67 }, letters: { T: 5.32 }, flowR: [6.6, 9.85] }} />
      <FactCard t={t} t0={4.9} letter="T" name="Tricuspid" facts={[["right atrium → right ventricle", 6.77], ["3 cusps", 8.79, true]]}
        inset={<ValveTop t={t} t0={8.79} kind="tri" size={170} />} />
    </Scene>
  );
};

/* 4. P: pulmonary */
export const V4: React.FC = () => {
  const t = useT();
  return (
    <Scene start={9.85} end={14.85} push={0.01}>
      <Stage t={t} start={9.85} steps={[
        { t: 9.85, zoom: [1.3, 0.42, 0.5], focus: ["P"] },
        { t: 11.82, zoom: [1.15, 0.42, 0.55], focus: ["P", "RV"] },
        { t: 13.6, zoom: [1.0, 0.5, 0.3], focus: ["P"] },
      ]} props={{ tags: 0, dimFrom: 9.86, lit: { P: 10.41, RV: 11.82 }, letters: { T: 0, P: 10.41 }, flowR: [11.82, 14.85], lungs: 14.01 }} />
      <FactCard t={t} t0={9.9} letter="P" name="Pulmonary valve" facts={[["out of right ventricle", 12.13], ["→ to the lungs", 14.01, true]]} />
    </Scene>
  );
};

/* 5. M: mitral */
export const V5: React.FC = () => {
  const t = useT();
  return (
    <Scene start={14.85} end={20.5} push={0.01}>
      <Stage t={t} start={14.85} steps={[
        { t: 14.85, zoom: [1.35, 0.76, 0.52], focus: ["M"] },
        { t: 16.41, zoom: [1.12, 0.78, 0.5], focus: ["LA", "LV"] },
        { t: 17.88, zoom: [1.45, 0.76, 0.56], focus: ["M"] },
      ]} props={{ tags: 0, dimFrom: 14.86, lit: { M: 15.4, LA: 16.41, LV: 16.41 }, letters: { T: 0, P: 0, M: 15.4 }, flowL: [15.4, 20.5] }} />
      <FactCard t={t} t0={14.9} letter="M" name="Mitral valve" facts={[["left side", 16.41], ["2 cusps", 17.88, true], ["= bicuspid", 19.66, true]]}
        inset={<ValveTop t={t} t0={17.88} kind="bi" size={170} art />} />
    </Scene>
  );
};

/* 6. A: aortic */
export const V6: React.FC = () => {
  const t = useT();
  return (
    <Scene start={20.5} end={25.3} push={0.01}>
      <Stage t={t} start={20.5} steps={[
        { t: 20.5, zoom: [1.3, 0.58, 0.5], focus: ["A"] },
        { t: 22.6, zoom: [1.15, 0.62, 0.62], focus: ["A", "LV"] },
        { t: 24.3, zoom: [1.05, 0.62, 0.2], focus: ["A"] },
      ]} props={{ tags: 0, dimFrom: 20.51, lit: { A: 21.36, LV: 22.6 }, letters: { T: 0, P: 0, M: 0, A: 21.36 }, flowL: [22.6, 25.3] }} />
      <FactCard t={t} t0={20.55} letter="A" name="Aortic valve" facts={[["exit of left ventricle", 22.72], ["→ into the aorta", 24.46, true]]} />
    </Scene>
  );
};

/* 7a. AV valves + chordae tendineae */
export const V7: React.FC = () => {
  const t = useT();
  return (
    <Scene start={25.3} end={31.6} push={0.008}>
      <Stage t={t} start={25.3} steps={[
        { t: 25.3, zoom: [1.0, 0.5, 0.5], focus: ["T", "M"] },
        { t: 28.71, zoom: [1.12, 0.5, 0.72], focus: ["T", "M"] },
      ]} props={{ tags: 0, dimFrom: 25.32, lit: { T: 25.37, M: 26.09, RA: 27.16, LA: 27.16, RV: 27.7, LV: 27.7 }, letters: { T: 25.37, M: 26.09 }, chordae: 29.49 }} />
      <div style={{ position: "absolute", left: 30, width: 800, top: 708, height: 200, borderRadius: 36, background: C.forest, ...pop(t, 25.35, 0.3) }}>
        <div style={{ position: "absolute", left: 30, top: 22, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={chip(C.banana, C.forest, 40)}>T + M</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper, letterSpacing: -1, whiteSpace: "nowrap", ...pop(t, 27.16) }}>atrioventricular valves</div>
        </div>
        <div style={{ position: "absolute", left: 30, top: 120, display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ ...pop(t, 29.49), fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.matchaLight }}>held by</div>
          <div style={{ ...pop(t, 30.29), ...chip(C.banana, C.forest, 38) }}>chordae tendineae</div>
        </div>
      </div>
    </Scene>
  );
};

/* 7b. Semilunar valves: three half-moon cusps */
export const V7b: React.FC = () => {
  const t = useT();
  const moon = ramp(t, 34.92, 35.3);
  return (
    <Scene start={31.6} end={36.3} push={0.01}>
      <div style={{ position: "absolute", left: 0, top: 10, width: 860, height: 680, borderRadius: 36, background: C.card, border: `3px solid ${C.line}`, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, width: 860, top: 40, display: "flex", justifyContent: "center", ...pop(t, 33.02) }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 84, color: C.forest, letterSpacing: -2 }}>
            <span style={{ background: C.banana, borderRadius: 16, padding: "0 14px 4px" }}>SEMI</span>LUNAR
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 860, top: 150, display: "flex", justifyContent: "center", gap: 70, alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <ValveTop t={t} t0={31.65} kind="semi" size={290} />
            <div style={{ ...pop(t, 31.75), ...chip(C.forest, C.paper, 38) }}>P · pulmonary</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <ValveTop t={t} t0={32.43} kind="semi" size={290} art />
            <div style={{ ...pop(t, 32.5), ...chip(C.forest, C.paper, 38) }}>A · aortic</div>
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 860, top: 560, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, ...pop(t, 34.59) }}>
          <svg width={80} height={80} viewBox="-40 -40 80 80" style={{ transform: `rotate(${-20 + 20 * moon}deg) scale(${0.8 + 0.2 * moon})` }}>
            <path d="M10 -32 A 34 34 0 1 0 10 32 A 26 26 0 1 1 10 -32 Z" fill={C.banana} stroke={C.forest} strokeWidth={5} />
          </svg>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.forest }}>
            3 <span style={{ background: moon > 0.2 ? C.banana : "transparent", borderRadius: 12, padding: "0 10px 3px" }}>half-moon</span> cusps each
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 30, width: 800, top: 708, height: 200, borderRadius: 36, background: C.forest, ...pop(t, 31.7, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 800, top: 30, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 4, color: C.matchaLight }}>THE 2 EXIT VALVES</div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 86, display: "flex", justifyContent: "center", gap: 16 }}>
          <div style={{ ...pop(t, 31.65), ...chip(C.matcha, C.paper, 38) }}>RV → lungs</div>
          <div style={{ ...pop(t, 32.43), ...chip(C.matcha, C.paper, 38) }}>LV → body</div>
          <div style={{ ...pop(t, 34.59), ...chip(C.banana, C.forest, 38) }}>no chordae</div>
        </div>
      </div>
    </Scene>
  );
};

/* 8. The 1918 plate: all four valves from above, modern labels + old-name note */
export const V8: React.FC = () => {
  const t = useT();
  return (
    <Scene start={36.3} end={40.85} push={0.01}>
      <Plate src="plates/valves.png" aspect={ASPECT_V} x={60} y={10} w={740} a={36.3} b={40.85} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.06, 0.48, 0.48]}
        labels={[
          { x: 0.67, y: 0.6, text: "Tricuspid", t: 36.85, ox: 30, oy: 170 },
          { x: 0.2, y: 0.14, text: "Pulmonary", t: 37.25, ox: 150, oy: -60 },
          { x: 0.25, y: 0.62, text: "Mitral", t: 37.65, hot: true, ox: 30, oy: 200 },
          { x: 0.37, y: 0.37, text: "Aortic", t: 38.05, ox: 210, oy: -110 },
        ]}
      />
      <div style={{ position: "absolute", left: 40, width: 780, top: 760, height: 150, borderRadius: 26, background: C.forest, boxShadow: "0 12px 26px rgba(31,42,20,0.3)", ...pop(t, 38.9) }}>
        <div style={{ position: "absolute", left: 30, top: 20, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.matchaLight, letterSpacing: 2 }}>1918 ATLAS NAME · VIEW FROM ABOVE</div>
        <div style={{ position: "absolute", left: 30, top: 64, fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.paper, whiteSpace: "nowrap" }}>
          "Bicuspid valve" = <span style={{ color: C.banana }}>mitral valve</span>
        </div>
      </div>
    </Scene>
  );
};

/* 9. Quick test */
export const V9: React.FC = () => {
  const t = useT();
  const c0 = 43.35;
  const n = t < c0 ? null : t < c0 + 0.5 ? 3 : t < c0 + 1.0 ? 2 : t < c0 + 1.5 ? 1 : null;
  const k = Math.floor((t - c0) / 0.5) * 0.5 + c0;
  return (
    <Scene start={40.85} end={44.87}>
      <div style={{ position: "absolute", left: 10, top: 30, width: 840, height: 860, borderRadius: 48, background: C.forest, ...pop(t, 40.9, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 52, display: "flex", justifyContent: "center" }}>
          <div style={{ background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, padding: "8px 28px 11px 36px", borderRadius: 18 }}>QUICK TEST</div>
        </div>
        <div style={{ position: "absolute", left: 40, width: 760, top: 170, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 70, lineHeight: 1.12, color: C.paper, ...pop(t, 41.61) }}>
          Which valve has only <span style={{ background: C.banana, color: C.forest, borderRadius: 16, padding: "0 14px 4px", display: "inline-block" }}>2 cusps?</span>
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 470, display: "flex", justifyContent: "center", gap: 18 }}>
          {ORDER.map(([x], i) => (
            <div key={x} style={{ ...pop(t, 42.2 + i * 0.12), width: 130, height: 130, borderRadius: 24, background: C.matchaDark, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 76, display: "flex", alignItems: "center", justifyContent: "center" }}>{x}</div>
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

/* 10. Answer: mitral */
export const V10: React.FC = () => {
  const t = useT();
  return (
    <Scene start={44.87} end={47.05} push={0.01}>
      <div style={{ ...center(20), gap: 16, alignItems: "center" }}>
        {ORDER.map(([x], i) => {
          const hot = i === 2;
          const p = ramp(t, 44.92 + (hot ? 0.1 : 0), 45.25);
          return (
            <div key={x} style={{ width: hot ? 150 : 104, height: hot ? 160 : 110, borderRadius: 24, background: hot ? C.red : C.matchaLight, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: hot ? 110 : 64, display: "flex", alignItems: "center", justifyContent: "center", opacity: hot ? 1 : 0.35 + 0.65 * (1 - p), transform: hot ? `scale(${0.7 + 0.3 * p + 0.1 * Math.sin(p * Math.PI)})` : "none" }}>{x}</div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, top: 200, width: 860, height: 480, borderRadius: 36, background: C.card, border: `3px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", ...pop(t, 44.95) }}>
        <ValveTop t={t} t0={45.0} kind="bi" size={330} art />
        <div style={{ position: "absolute", right: 40, top: 60, ...pop(t, 45.25), ...chip(C.banana, C.forest, 40) }}>2 cusps</div>
      </div>
      <div style={{ position: "absolute", left: 30, width: 800, top: 708, height: 200, borderRadius: 36, background: C.forest, ...pop(t, 45.0) }}>
        <div style={{ position: "absolute", left: 0, width: 800, top: 22, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 58, color: C.paper, letterSpacing: -1, ...pop(t, 44.93) }}>Mitral valve</div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 112, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.matchaLight, ...pop(t, 46.0) }}>
          Try Pulling <span style={{ background: C.banana, color: C.forest, borderRadius: 12, padding: "0 10px 3px" }}>M</span>y Aorta
        </div>
      </div>
    </Scene>
  );
};

/* 11. Save */
export const V11: React.FC = () => {
  const t = useT();
  const b = ramp(t, 47.15, 47.5);
  return (
    <Scene start={47.05} end={49.25}>
      <div style={center(40, pop(t, 47.1))}>
        <svg width={220} height={280} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={center(360, pop(t, 47.15))}>
        <Big size={120}>SAVE THIS</Big>
      </div>
      <div style={center(510, pop(t, 48.11))}>
        <Big size={58} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ ...center(650), gap: 14, ...pop(t, 48.5) }}>
        {ORDER.map(([l], i) => (
          <div key={i} style={{ width: 120, height: 124, borderRadius: 24, background: i === 2 ? C.red : C.matcha, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 76, display: "flex", alignItems: "center", justifyContent: "center" }}>{l}</div>
        ))}
      </div>
    </Scene>
  );
};

/* 12. End card */
export const V12: React.FC = () => {
  const t = useT();
  return (
    <Scene start={49.25} end={53.6}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, 49.3, 0.35) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.matchaLight, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 50.35, 50.65) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 49.4) * 5))})`, opacity: ramp(t, 49.37, 49.7) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
