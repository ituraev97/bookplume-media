import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { Epidermis, LayerId, ThickThin } from "./Skin34";

const ASPECT = 1938 / 2032;
const pop = (t: number, t0: number, d = 0.3) => {
  const p = ramp(t, t0, t0 + d);
  return { opacity: p, transform: `scale(${0.6 + 0.4 * p + 0.08 * Math.sin(Math.min(1, p) * Math.PI)})` } as React.CSSProperties;
};
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });
const Big: React.FC<{ size?: number; children: React.ReactNode; color?: string }> = ({ size = 110, children, color = C.forest }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1, letterSpacing: -2, textAlign: "center" }}>{children}</div>
);
export const liveAlpha = (_t: number) => 0;

/* 1. Hook: the real 1918 plate, push in on the epidermis */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={4.49} push={0.02}>
      <div style={center(40, pop(t, 0, 0.25))}>
        <Big size={92}>
          <span style={{ color: C.matcha }}>5</span> SKIN LAYERS?
        </Big>
      </div>
      <Plate src="plates/skin.png" aspect={ASPECT} x={90} y={150} w={680} a={-0.6} b={4.49} zoomFrom={[1, 0.5, 0.45]} zoomTo={[2.0, 0.52, 0.12]} />
      <div style={{ position: "absolute", left: 30, top: 330, ...pop(t, 1.0) }}>
        <Pill size={36} bg={C.banana} color={C.forest}>EPIDERMIS</Pill>
      </div>
      <Stamp t0={2.9} text="THE TRICK" size={62} rot={-8} color={C.red} style={{ left: 500, top: 660 }} />
    </Scene>
  );
};

/* 2. Epidermis = outer layer, no blood vessels */
export const V2: React.FC = () => {
  const t = useT();
  return (
    <Scene start={4.49} end={8.89} push={0.02}>
      <div style={{ position: "absolute", left: 0, top: 80, transform: `translateY(${(1 - ramp(t, 4.49, 4.9)) * 40}px)` }}>
        <Epidermis t={t} w={860} badges={false} names={false} overview={{ epi: 4.6, dermis: 6.3, vessels: 7.69, noVessel: 7.45 }} />
      </div>
      <div style={{ position: "absolute", left: 40, top: 30, ...pop(t, 5.53) }}>
        <Pill size={34} bg={C.banana} color={C.forest}>OUTER LAYER OF SKIN</Pill>
      </div>
    </Scene>
  );
};

/* 3. The sentence: Come Let's Get Sun Burned */
const WORDS3: [string, number][] = [["Come", 10.74], ["Let's", 11.06], ["Get", 11.34], ["Sun", 11.51], ["Burned", 11.77]];
export const V3: React.FC = () => {
  const t = useT();
  const arrow = ramp(t, 9.05, 9.6);
  return (
    <Scene start={8.89} end={12.62}>
      <div style={{ position: "absolute", left: 10, top: 30, width: 840, height: 840, borderRadius: 48, background: C.forest, ...pop(t, 8.94, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 56, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 6, color: C.matchaLight }}>REMEMBER THIS SENTENCE</div>
        {/* surface -> deep arrow */}
        <div style={{ position: "absolute", left: 60, top: 150, width: 120, height: 620, opacity: arrow }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 120, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 24, letterSpacing: 2, color: C.matchaLight }}>SURFACE</div>
          <svg style={{ position: "absolute", left: 0, top: 40 }} width={120} height={540}>
            <line x1={60} y1={0} x2={60} y2={480 * arrow} stroke={C.matchaLight} strokeWidth={10} strokeLinecap="round" />
            <path d={`M38 ${480 * arrow - 18} L60 ${480 * arrow + 10} L82 ${480 * arrow - 18}`} fill="none" stroke={C.matchaLight} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ position: "absolute", left: 0, top: 590, width: 120, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 24, letterSpacing: 2, color: C.matchaLight, opacity: ramp(t, 9.42, 9.7) }}>DEEP</div>
        </div>
        {WORDS3.map(([w, wt], i) => {
          const p = ramp(t, wt - 0.05, wt + 0.2);
          const cols = ["#EFE0BE", "#FFFDF6", "#E6C29A", "#F2D0BA", "#D9A486"];
          return <div key={"b" + i} style={{ position: "absolute", left: 660, top: 160 + i * 124, width: 130, height: 100, borderRadius: i === 0 ? "20px 20px 6px 6px" : i === 4 ? "6px 6px 20px 20px" : 6, background: cols[i], opacity: 0.2 + 0.8 * p, transform: `scaleX(${0.6 + 0.4 * p})`, boxShadow: p > 0.5 ? `0 0 0 4px ${C.banana}` : "none" }} />;
        })}
        {WORDS3.map(([w, wt], i) => {
          const p = ramp(t, wt - 0.05, wt + 0.18);
          return (
            <div key={w} style={{ position: "absolute", left: 230, top: 160 + i * 124, opacity: p, transform: `translateX(${(1 - p) * 40}px) scale(${0.8 + 0.2 * p})`, transformOrigin: "0 50%", fontFamily: FONT, fontWeight: 800, fontSize: 86, letterSpacing: -2, color: C.paper, lineHeight: 1, whiteSpace: "nowrap" }}>
              <span style={{ display: "inline-block", width: 92, height: 100, borderRadius: 20, background: C.banana, color: C.forest, textAlign: "center", lineHeight: "100px", marginRight: 14, fontSize: 80 }}>{w[0]}</span>
              {w.slice(1)}
            </div>
          );
        })}
      </div>
    </Scene>
  );
};

/* 4. Name the layers one by one on our diagram */
const STEPS: { id: LayerId; t: number; facts: [string, number][] }[] = [
  { id: "C", t: 12.73, facts: [["15–30 layers", 13.22], ["dead, flat cells", 14.37]] },
  { id: "L", t: 15.88, facts: [["clear layer", 16.51], ["thick skin only", 17.52]] },
  { id: "G", t: 18.81, facts: [["full of granules", 20.39], ["cells start to die", 21.08]] },
  { id: "S", t: 22.2, facts: [["the spiny layer", 22.9]] },
  { id: "B", t: 24.01, facts: [["the deepest", 24.75], ["makes new cells", 25.62]] },
];
const NAMES: Record<LayerId, string> = { C: "Corneum", L: "Lucidum", G: "Granulosum", S: "Spinosum", B: "Basale" };
export const V4: React.FC = () => {
  const t = useT();
  const lit: Partial<Record<LayerId, number>> = {};
  STEPS.forEach((s) => (lit[s.id] = s.t));
  let cur = STEPS[0];
  STEPS.forEach((s) => { if (t >= s.t) cur = s; });
  const swap = ramp(t, cur.t, cur.t + 0.3);
  // gentle camera follow: move the diagram so the named layer drifts toward the middle
  const ys: Record<LayerId, number> = { C: 50, L: 40, G: 30, S: 15, B: 0 };
  let camY = ys.C;
  STEPS.forEach((s, i) => {
    if (i === 0) return;
    camY += (ys[s.id] - ys[STEPS[i - 1].id]) * ramp(t, s.t - 0.1, s.t + 0.5);
  });
  return (
    <Scene start={12.62} end={26.9} push={0.015}>
      <div style={{ position: "absolute", left: 0, top: -30 + camY, opacity: ramp(t, 12.62, 12.9) }}>
        <Epidermis t={t} w={860} lit={lit} focus={cur.id} focusT={12.73} dermis={false} />
      </div>
      {/* fact card */}
      <div style={{ position: "absolute", left: 30, width: 800, top: 690, height: 200, borderRadius: 36, background: C.forest, boxShadow: "0 14px 30px rgba(31,42,20,0.25)", ...pop(t, 12.75, 0.3) }}>
        <div style={{ position: "absolute", left: 36, top: 26, display: "flex", alignItems: "center", gap: 18, opacity: swap, transform: `translateX(${(1 - swap) * 24}px)` }}>
          <div style={{ width: 66, height: 66, borderRadius: 33, background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>{cur.id}</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.paper, letterSpacing: -1 }}>
            <span style={{ color: C.matchaLight, fontSize: 30, letterSpacing: 2, marginRight: 12 }}>STRATUM</span>
            {NAMES[cur.id]}
          </div>
        </div>
        <div style={{ position: "absolute", left: 36, top: 116, display: "flex", gap: 14 }}>
          {cur.facts.map(([f, ft]) => (
            <div key={f} style={{ ...pop(t, ft, 0.25), background: C.matcha, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 34, padding: "8px 20px 11px", borderRadius: 16, whiteSpace: "nowrap" }}>{f}</div>
          ))}
        </div>
      </div>
    </Scene>
  );
};

/* 5. The 1918 plate with MODERN labels + old-name note */
export const V5: React.FC = () => {
  const t = useT();
  return (
    <Scene start={26.9} end={30.47} push={0.01}>
      <Plate
        src="plates/skin.png" aspect={ASPECT} x={50} y={20} w={760} a={26.9} b={30.47}
        zoomFrom={[1.25, 0.62, 0.2]} zoomTo={[1.35, 0.62, 0.2]}
        labels={[
          { x: 0.55, y: 0.1, text: "Corneum", t: 27.35, ox: -70, oy: -33 },
          { x: 0.5, y: 0.174, text: "Lucidum", t: 27.7, ox: -30, oy: -40 },
          { x: 0.6, y: 0.19, text: "Granulosum", t: 28.05, ox: -120, oy: 14 },
          { x: 0.58, y: 0.235, text: "Spinosum", t: 28.4, ox: -100, oy: 32 },
          { x: 0.509, y: 0.32, text: "Basale", t: 28.75, ox: -46, oy: 70 },
        ]}
      />
      <div style={{ position: "absolute", left: 60, width: 740, top: 836, display: "flex", justifyContent: "center", ...pop(t, 29.2) }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 24px 11px", fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.forest, whiteSpace: "nowrap", textAlign: "center", lineHeight: 1.25 }}>
          <span style={{ color: C.matcha }}>1918 atlas names</span>
          <br />
          mucosum = spinosum · germinativum = basale
        </div>
      </div>
    </Scene>
  );
};

/* 6. Quick test */
export const V6: React.FC = () => {
  const t = useT();
  const c0 = 34.95;
  const n = t < c0 ? null : t < c0 + 0.5 ? 3 : t < c0 + 1.0 ? 2 : t < c0 + 1.5 ? 1 : null;
  const k = Math.floor((t - c0) / 0.5) * 0.5 + c0;
  return (
    <Scene start={30.47} end={36.45}>
      <div style={{ position: "absolute", left: 10, top: 30, width: 840, height: 840, borderRadius: 48, background: C.forest, ...pop(t, 30.52, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 52, display: "flex", justifyContent: "center" }}><div style={{ background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, padding: "8px 28px 11px 36px", borderRadius: 18 }}>QUICK TEST</div></div>
        <div style={{ position: "absolute", left: 40, width: 760, top: 150, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 74, lineHeight: 1.05, color: C.paper, ...pop(t, 31.29) }}>
          Which layer is only in <span style={{ background: C.banana, color: C.forest, borderRadius: 16, padding: "0 14px 4px", display: "inline-block", marginTop: 8 }}>thick skin?</span>
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 360, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 32, color: C.matchaLight, ...pop(t, 33.74) }}>
          like your palms and soles
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 440, display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", padding: "0 70px", boxSizing: "border-box" }}>
          {["Corneum", "Lucidum", "Granulosum", "Basale"].map((x, i) => (
            <div key={x} style={{ ...pop(t, 32.0 + i * 0.12), background: C.matchaDark, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 40, padding: "12px 24px 15px", borderRadius: 18 }}>{x}</div>
          ))}
        </div>
        {n && (
          <div style={{ position: "absolute", left: 0, width: 840, top: 650, display: "flex", justifyContent: "center", transform: `scale(${1.3 - 0.3 * ramp(t, k, k + 0.15)})` }}><div style={{ width: 150, height: 150, borderRadius: 75, background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 104, lineHeight: "150px", textAlign: "center" }}>{n}</div></div>
        )}
      </div>
    </Scene>
  );
};

/* 7. Answer: stratum lucidum */
export const V7: React.FC = () => {
  const t = useT();
  return (
    <Scene start={36.45} end={39.54} push={0.01}>
      <div style={center(40, pop(t, 36.6))}>
        <Pill size={50} bg={C.red}>STRATUM LUCIDUM</Pill>
      </div>
      <div style={{ position: "absolute", left: 0, top: 140 }}>
        <ThickThin t={t} t0={36.5} litT={37.14} />
      </div>
      <div style={{ position: "absolute", left: 60, width: 740, top: 720, borderRadius: 36, background: C.card, border: `4px solid ${C.line}`, padding: "26px 34px", boxSizing: "border-box", fontFamily: FONT, ...pop(t, 37.91) }}>
        <div style={{ fontWeight: 800, fontSize: 30, letterSpacing: 4, color: C.matcha }}>LATIN</div>
        <div style={{ fontWeight: 800, fontSize: 64, color: C.forest, lineHeight: 1.1 }}>
          lucidus = <span style={{ color: C.red }}>clear</span>
        </div>
      </div>
    </Scene>
  );
};

/* 8. Save */
export const V8: React.FC = () => {
  const t = useT();
  const b = ramp(t, 39.64, 40.0);
  return (
    <Scene start={39.54} end={41.73}>
      <div style={center(40, pop(t, 39.6))}>
        <svg width={220} height={280} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={center(360, pop(t, 39.8))}>
        <Big size={120}>SAVE THIS</Big>
      </div>
      <div style={center(510, pop(t, 40.4))}>
        <Big size={58} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ ...center(650), gap: 14, ...pop(t, 40.9) }}>
        {"CLGSB".split("").map((l, i) => (
          <div key={i} style={{ width: 84, height: 92, borderRadius: 18, background: i === 1 ? C.red : C.matcha, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>{l}</div>
        ))}
      </div>
    </Scene>
  );
};

/* 9. End card */
export const V9: React.FC = () => {
  const t = useT();
  return (
    <Scene start={41.73} end={45.9}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, 41.78, 0.35) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.matchaLight, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 42.8, 43.1) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 41.8) * 5))})`, opacity: ramp(t, 41.95, 42.25) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
