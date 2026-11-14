import React from "react";
import { C, Callout, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { PartId, Thigh } from "./Thigh35";

const ASPECT = 1206 / 1383;
const pop = (t: number, t0: number, d = 0.3) => {
  const p = ramp(t, t0, t0 + d);
  return { opacity: p, transform: `scale(${0.6 + 0.4 * p + 0.08 * Math.sin(Math.min(1, p) * Math.PI)})` } as React.CSSProperties;
};
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });
const Big: React.FC<{ size?: number; children: React.ReactNode; color?: string }> = ({ size = 110, children, color = C.forest }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1, letterSpacing: -2, textAlign: "center" }}>{children}</div>
);
export const liveAlpha = (_t: number) => 0;

/* 1. Hook: the real 1918 plate, push in on the vessels */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={4.5} push={0.02}>
      <div style={center(20, pop(t, 0, 0.25))}>
        <Big size={88}>
          WHAT'S IN <span style={{ background: C.banana, borderRadius: 18, padding: "0 16px 6px" }}>HERE?</span>
        </Big>
      </div>
      <Plate src="plates/femoral.png" aspect={ASPECT} x={120} y={140} w={620} a={-0.6} b={4.5} zoomFrom={[1, 0.5, 0.45]} zoomTo={[1.9, 0.44, 0.3]} />
      <div style={{ position: "absolute", left: 20, top: 300, ...pop(t, 1.38) }}>
        <Pill size={38} bg={C.forest}>FEMORAL TRIANGLE</Pill>
      </div>
      <Stamp t0={3.02} text="THE TRICK" size={62} rot={-8} color={C.red} style={{ left: 470, top: 700 }} />
    </Scene>
  );
};

/* 2. Where it is + its 3 borders (our diagram) */
export const V2: React.FC = () => {
  const t = useT();
  return (
    <Scene start={4.5} end={12.05} push={0.015}>
      <div style={{ position: "absolute", left: 0, top: 30, transform: `translateY(${(1 - ramp(t, 4.5, 4.9)) * 40}px)` }}>
        <Thigh t={t} tri={5.01} borders={{ lig: 8.24, sar: 10.03, add: 10.87 }} />
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 770, display: "flex", justifyContent: "center", ...pop(t, 6.06), opacity: ramp(t, 6.06, 6.36) * (1 - ramp(t, 11.0, 11.25)) }}>
        <Pill size={32} bg={C.banana} color={C.forest}>TOP OF THE FRONT THIGH</Pill>
      </div>
      <Callout t0={8.24} x={430} y={285} tx={600} ty={150} text="Inguinal ligament" />
      <Callout t0={10.03} x={330} y={470} tx={175} ty={620} text="Sartorius" />
      <Callout t0={10.87} x={600} y={470} tx={665} ty={640} text="Adductor longus" />
      <div style={{ position: "absolute", left: 0, top: 760, width: 860, display: "flex", justifyContent: "center", gap: 14, ...pop(t, 11.3) }}>
        {["1 ligament", "2 muscles", "= 3 borders"].map((x, i) => (
          <div key={x} style={{ background: i === 2 ? C.forest : C.matcha, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 34, padding: "8px 20px 11px", borderRadius: 16 }}>{x}</div>
        ))}
      </div>
    </Scene>
  );
};

/* 3. The mnemonic: NAVEL, lateral -> medial */
const ROWS: [string, string][] = [["N", "erve"], ["A", "rtery"], ["V", "ein"], ["E", "mpty space"], ["L", "ymphatics"]];
export const V3: React.FC = () => {
  const t = useT();
  const arrow = ramp(t, 12.64, 13.3);
  const big = ramp(t, 14.54, 14.8);
  return (
    <Scene start={12.05} end={15.35}>
      <div style={{ position: "absolute", left: 10, top: 20, width: 840, height: 880, borderRadius: 48, background: C.forest, ...pop(t, 12.1, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 44, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: C.matchaLight }}>FROM LATERAL TO MEDIAL</div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 96, display: "flex", justifyContent: "center", gap: 10 }}>
          {"NAVEL".split("").map((l, i) => {
            const p = ramp(t, 14.54 + i * 0.05, 14.74 + i * 0.05);
            return <div key={i} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 120, lineHeight: 1, color: p > 0.5 ? C.banana : "rgba(247,246,236,0.18)", transform: `scale(${1 + 0.15 * Math.sin(p * Math.PI)})` }}>{l}</div>;
          })}
        </div>
        {/* lateral -> medial arrow */}
        <div style={{ position: "absolute", left: 50, top: 250, width: 110, height: 600, opacity: arrow }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 110, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 22, letterSpacing: 2, color: C.matchaLight }}>OUTSIDE</div>
          <svg style={{ position: "absolute", left: 0, top: 40 }} width={110} height={520}>
            <line x1={55} y1={0} x2={55} y2={460 * arrow} stroke={C.matchaLight} strokeWidth={10} strokeLinecap="round" />
            <path d={`M33 ${460 * arrow - 18} L55 ${460 * arrow + 10} L77 ${460 * arrow - 18}`} fill="none" stroke={C.matchaLight} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ position: "absolute", left: 0, top: 560, width: 110, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 22, letterSpacing: 2, color: C.matchaLight, opacity: ramp(t, 13.16, 13.4) }}>INSIDE</div>
        </div>
        {ROWS.map(([l, rest], i) => {
          const p = ramp(t, 12.55 + i * 0.22, 12.8 + i * 0.22);
          return (
            <div key={l} style={{ position: "absolute", left: 200, top: 270 + i * 116, opacity: p, transform: `translateX(${(1 - p) * 40}px)`, fontFamily: FONT, fontWeight: 800, fontSize: 70, letterSpacing: -1.5, color: C.paper, lineHeight: 1, whiteSpace: "nowrap", display: "flex", alignItems: "center" }}>
              <span style={{ display: "inline-block", width: 92, height: 96, borderRadius: 20, background: C.banana, color: C.forest, textAlign: "center", lineHeight: "96px", marginRight: 6, fontSize: 74, transform: `scale(${1 + 0.12 * big * Math.sin(ramp(t, 14.54 + i * 0.05, 14.84 + i * 0.05) * Math.PI)})` }}>{l}</span>
              {rest}
            </div>
          );
        })}
      </div>
    </Scene>
  );
};

/* 4. Contents light up one by one */
const STEPS: { id: PartId; t: number; name: string; letter: string; facts: [string, number][] }[] = [
  { id: "N", t: 15.45, name: "Femoral nerve", letter: "N", facts: [["most lateral", 16.82]] },
  { id: "A", t: 17.61, name: "Femoral artery", letter: "A", facts: [["next in", 18.6]] },
  { id: "V", t: 19.41, name: "Femoral vein", letter: "V", facts: [["medial to the artery", 20.0]] },
  { id: "E", t: 20.96, name: "Femoral canal", letter: "E+L", facts: [["empty space", 21.2], ["lymphatics", 21.72]] },
];
export const V4: React.FC = () => {
  const t = useT();
  const lit: Partial<Record<PartId, number>> = {};
  STEPS.forEach((s) => (lit[s.id] = s.t));
  let cur = STEPS[0];
  STEPS.forEach((s) => { if (t >= s.t) cur = s; });
  const swap = ramp(t, cur.t, cur.t + 0.3);
  return (
    <Scene start={15.35} end={23.75} push={0.015}>
      <div style={{ position: "absolute", left: 0, top: 26, opacity: ramp(t, 15.35, 15.65) }}>
        <Thigh t={t} lit={lit} focus={cur.id} dimFrom={15.35} letters tri={15.0} />
      </div>
      <div style={{ position: "absolute", left: 30, width: 800, top: 740, height: 190, borderRadius: 36, background: C.forest, boxShadow: "0 14px 30px rgba(31,42,20,0.25)", ...pop(t, 15.5, 0.3) }}>
        <div style={{ position: "absolute", left: 32, top: 26, display: "flex", alignItems: "center", gap: 18, opacity: swap, transform: `translateX(${(1 - swap) * 24}px)` }}>
          <div style={{ minWidth: 66, height: 66, padding: "0 10px", boxSizing: "border-box", borderRadius: 33, background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: cur.letter.length > 1 ? 34 : 44, display: "flex", alignItems: "center", justifyContent: "center" }}>{cur.letter}</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.paper, letterSpacing: -1 }}>{cur.name}</div>
        </div>
        <div style={{ position: "absolute", left: 32, top: 116, display: "flex", gap: 14 }}>
          {cur.facts.map(([f, ft]) => (
            <div key={f} style={{ ...pop(t, ft, 0.25), background: C.matcha, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 34, padding: "8px 20px 11px", borderRadius: 16, whiteSpace: "nowrap" }}>{f}</div>
          ))}
        </div>
      </div>
    </Scene>
  );
};

/* 5. The 1918 plate with modern labels; it is a LEFT thigh -> read right to left */
export const V5: React.FC = () => {
  const t = useT();
  const ar = ramp(t, 28.5, 29.1);
  return (
    <Scene start={23.75} end={29.95} push={0.01}>
      <Plate
        src="plates/femoral.png" aspect={ASPECT} x={40} y={0} w={780} a={23.75} b={29.95}
        zoomFrom={[1.04, 0.45, 0.35]} zoomTo={[1.1, 0.45, 0.35]}
        labels={[
          { x: 0.535, y: 0.25, text: "N  Femoral nerve", t: 24.45, ox: 30, oy: -44 },
          { x: 0.44, y: 0.36, text: "A  Femoral artery", t: 24.8, ox: 80, oy: -6 },
          { x: 0.357, y: 0.43, text: "V  Femoral vein", t: 25.15, ox: 160, oy: 80 },
          { x: 0.36, y: 0.175, text: "E+L  Femoral canal", t: 25.5, ox: 40, oy: -80 },
        ]}
      />
      <div style={{ position: "absolute", left: 60, top: 420, ...pop(t, 27.35) }}>
        <Pill size={36} bg={C.red}>LEFT THIGH</Pill>
      </div>
      <div style={{ position: "absolute", left: 60, width: 740, top: 760, height: 110, borderRadius: 26, background: C.forest, boxShadow: "0 12px 26px rgba(31,42,20,0.3)", ...pop(t, 28.3) }}>
        <div style={{ position: "absolute", left: 24, top: 36, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.matchaLight, letterSpacing: 2 }}>MEDIAL</div>
        <div style={{ position: "absolute", right: 24, top: 36, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.matchaLight, letterSpacing: 2 }}>LATERAL</div>
        <div style={{ position: "absolute", left: 150, width: 440, top: 26, display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
          <svg width={90} height={40} style={{ opacity: ar }}>
            <line x1={90 - 80 * ar} y1={20} x2={88} y2={20} stroke={C.banana} strokeWidth={8} strokeLinecap="round" />
            <path d={`M${90 - 80 * ar + 16} 6 L${90 - 80 * ar} 20 L${90 - 80 * ar + 16} 34`} fill="none" stroke={C.banana} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.paper, whiteSpace: "nowrap" }}>read <span style={{ color: C.banana }}>N</span>-A-V-E-L</div>
        </div>
      </div>
    </Scene>
  );
};

/* 6. Quick test */
export const V6: React.FC = () => {
  const t = useT();
  const c0 = 33.85;
  const n = t < c0 ? null : t < c0 + 0.5 ? 3 : t < c0 + 1.0 ? 2 : t < c0 + 1.5 ? 1 : null;
  const k = Math.floor((t - c0) / 0.5) * 0.5 + c0;
  return (
    <Scene start={29.95} end={35.2}>
      <div style={{ position: "absolute", left: 10, top: 30, width: 840, height: 840, borderRadius: 48, background: C.forest, ...pop(t, 30.0, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 52, display: "flex", justifyContent: "center" }}><div style={{ background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, padding: "8px 28px 11px 36px", borderRadius: 18 }}>QUICK TEST</div></div>
        <div style={{ position: "absolute", left: 40, width: 760, top: 150, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 70, lineHeight: 1.08, color: C.paper, ...pop(t, 30.96) }}>
          What lies <span style={{ background: C.banana, color: C.forest, borderRadius: 16, padding: "0 14px 4px", display: "inline-block" }}>just medial</span> to the femoral artery?
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 450, display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", padding: "0 60px", boxSizing: "border-box" }}>
          {["Femoral nerve", "Femoral vein", "Sartorius", "Femoral canal"].map((x, i) => (
            <div key={x} style={{ ...pop(t, 32.2 + i * 0.12), background: C.matchaDark, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 40, padding: "12px 24px 15px", borderRadius: 18 }}>{x}</div>
          ))}
        </div>
        {n && (
          <div style={{ position: "absolute", left: 0, width: 840, top: 650, display: "flex", justifyContent: "center", transform: `scale(${1.3 - 0.3 * ramp(t, k, k + 0.15)})` }}><div style={{ width: 150, height: 150, borderRadius: 75, background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 104, lineHeight: "150px", textAlign: "center" }}>{n}</div></div>
        )}
      </div>
    </Scene>
  );
};

/* 7. Answer: the femoral vein */
export const V7: React.FC = () => {
  const t = useT();
  return (
    <Scene start={35.2} end={38.95} push={0.01}>
      <div style={center(20, pop(t, 35.4))}>
        <Pill size={54} bg={C.red}>FEMORAL VEIN</Pill>
      </div>
      <div style={{ position: "absolute", left: 140, top: 130, opacity: ramp(t, 35.25, 35.6) }}>
        <Thigh t={t} w={580} lit={{ N: 0, A: 0, V: 0, E: 0 }} focus="V" hi="V" letters />
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 770, display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}>
        {([["Nerve", 36.61], ["Artery", 36.94], ["Vein", 37.36]] as [string, number][]).map(([x, xt], i) => (
          <React.Fragment key={x}>
            {i > 0 && <div style={{ ...pop(t, xt - 0.05), fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.matcha }}>→</div>}
            <div style={{ ...pop(t, xt), background: x === "Vein" ? C.banana : C.forest, color: x === "Vein" ? C.forest : C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 44, padding: "10px 24px 13px", borderRadius: 18 }}>{x}</div>
          </React.Fragment>
        ))}
      </div>
      <div style={center(870, pop(t, 38.03))}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.matcha, letterSpacing: 2 }}>OUTSIDE → IN</div>
      </div>
    </Scene>
  );
};

/* 8. Save */
export const V8: React.FC = () => {
  const t = useT();
  const b = ramp(t, 39.05, 39.4);
  return (
    <Scene start={38.95} end={41.2}>
      <div style={center(40, pop(t, 39.0))}>
        <svg width={220} height={280} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={center(360, pop(t, 39.13))}>
        <Big size={120}>SAVE THIS</Big>
      </div>
      <div style={center(510, pop(t, 39.84))}>
        <Big size={58} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ ...center(650), gap: 14, ...pop(t, 40.3) }}>
        {"NAVEL".split("").map((l, i) => (
          <div key={i} style={{ width: 92, height: 100, borderRadius: 18, background: i === 2 ? C.red : C.matcha, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 62, display: "flex", alignItems: "center", justifyContent: "center" }}>{l}</div>
        ))}
      </div>
    </Scene>
  );
};

/* 9. End card */
export const V9: React.FC = () => {
  const t = useT();
  return (
    <Scene start={41.2} end={45.2}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, 41.25, 0.35) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.matchaLight, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 42.3, 42.6) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 41.3) * 5))})`, opacity: ramp(t, 41.4, 41.7) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
