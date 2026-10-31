import React from "react";
import { C, Callout, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { Gut, GutId } from "./Gut37";

const ASPECT_ABD = 1921 / 2250;
const ASPECT_DUO = 1819 / 1281;
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

/* 1. Hook: the real 1918 plate, push in on the coils of small intestine */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={4.85} push={0.02}>
      <div style={center(60, pop(t, 0, 0.25))}>
        <Big size={84}>
          NAME ALL <span style={{ background: C.banana, borderRadius: 18, padding: "0 16px 6px" }}>3?</span>
        </Big>
      </div>
      <Plate src="plates/abdomen.png" aspect={ASPECT_ABD} x={150} y={170} w={560} a={-0.6} b={4.85} zoomFrom={[1, 0.5, 0.5]} zoomTo={[1.9, 0.5, 0.64]} />
      <div style={{ position: "absolute", left: 0, top: 600, ...pop(t, 1.17) }}>
        <Pill size={38} bg={C.forest}>SMALL INTESTINE</Pill>
      </div>
      <div style={{ position: "absolute", left: 570, top: 340, ...pop(t, 2.43) }}>
        <Pill size={36} bg={C.banana} color={C.forest}>IN ORDER</Pill>
      </div>
      <Stamp t0={3.4} text="THE TRICK" size={62} rot={-8} color={C.red} style={{ left: 440, top: 790 }} />
    </Scene>
  );
};

/* 2. Stomach -> a tube about 10 ft long (in life); a bolus travels D -> J -> I */
export const V2: React.FC = () => {
  const t = useT();
  return (
    <Scene start={4.85} end={9.1} push={0.015}>
      <div style={{ position: "absolute", left: 80, top: 0, transform: `translateY(${(1 - ramp(t, 4.85, 5.25)) * 40}px)` }}>
        <Gut t={t} w={700} grow={{ ST: 4.95, PA: 6.1, LI: 6.2, DU: 6.4, JE: 6.85, IL: 7.45 }} lit={{ ST: 5.66 }} focus={t < 6.5 ? "ST" : null} food={[6.75, 8.95]} />
      </div>
      <Callout t0={5.66} x={600} y={160} tx={700} ty={330} text="Stomach" />
      <div style={{ position: "absolute", left: 80, width: 700, top: 760, height: 150, borderRadius: 34, background: C.forest, boxShadow: "0 14px 30px rgba(31,42,20,0.25)", display: "flex", justifyContent: "center", alignItems: "center", gap: 16, ...pop(t, 6.6, 0.3) }}>
        <div style={{ ...pop(t, 6.67), ...chip(C.matcha, C.paper, 40) }}>1 long tube</div>
        <div style={{ ...pop(t, 7.47), ...chip(C.banana, C.forest, 52) }}>≈ 10 ft</div>
        <div style={{ ...pop(t, 8.34), fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.matchaLight, lineHeight: 1.1 }}>
          about 3 m
          <br />
          in life
        </div>
      </div>
    </Scene>
  );
};

/* 3. The mnemonic card: Dow Jones Industrial (stock market) */
const ROWS: [string, string, string, number][] = [
  ["D", "uodenum", "1st · shortest", 10.68],
  ["J", "ejunum", "middle · “empty”", 10.95],
  ["I", "leum", "last · longest", 11.45],
];
export const V3: React.FC = () => {
  const t = useT();
  const line = ramp(t, 9.6, 11.9);
  const words: [string, string, number][] = [["D", "ow", 10.68], ["J", "ones", 10.95], ["I", "ndustrial", 11.45]];
  return (
    <Scene start={9.1} end={12.55}>
      <div style={{ position: "absolute", left: 10, top: 10, width: 840, height: 900, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 9.15, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 40, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 32, letterSpacing: 6, color: C.matchaLight, ...pop(t, 9.6) }}>THINK OF THE STOCK MARKET</div>
        {/* ticker chart */}
        <svg width={840} height={260} style={{ position: "absolute", left: 0, top: 90 }} viewBox="0 0 840 260">
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={50} x2={790} y1={40 + i * 60} y2={40 + i * 60} stroke="#3A4A28" strokeWidth={2} strokeDasharray="6 10" />
          ))}
          <path d="M50 220 L150 190 L220 205 L300 150 L370 168 L460 110 L530 130 L610 70 L690 86 L780 30" fill="none" stroke={C.matcha} strokeWidth={14} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={`${line} 1`} />
          <path d="M50 220 L150 190 L220 205 L300 150 L370 168 L460 110 L530 130 L610 70 L690 86 L780 30" fill="none" stroke={C.banana} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray={`${line} 1`} />
          {line > 0.98 && <path d="M748 26 L784 28 L776 62" fill="none" stroke={C.banana} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />}
        </svg>
        <div style={{ position: "absolute", left: 0, width: 840, top: 330, display: "flex", justifyContent: "center", gap: 18 }}>
          {words.map(([l, rest, tt]) => {
            const p = ramp(t, tt - 0.05, tt + 0.2);
            return (
              <div key={l} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64, letterSpacing: -1, opacity: 0.22 + 0.78 * p, transform: `scale(${1 + 0.12 * Math.sin(p * Math.PI)})`, color: C.paper, whiteSpace: "nowrap" }}>
                <span style={{ background: p > 0.5 ? C.banana : "transparent", color: p > 0.5 ? C.forest : C.paper, borderRadius: 12, padding: "0 6px 2px" }}>{l}</span>
                {rest}
              </div>
            );
          })}
        </div>
        {ROWS.map(([l, rest, sub, tt], i) => {
          const p = ramp(t, tt, tt + 0.3);
          return (
            <div key={l} style={{ position: "absolute", left: 70, top: 470 + i * 140, opacity: p, transform: `translateX(${(1 - p) * 40}px)`, display: "flex", alignItems: "center", fontFamily: FONT, fontWeight: 800 }}>
              <span style={{ display: "inline-block", width: 100, height: 104, borderRadius: 22, background: C.banana, color: C.forest, textAlign: "center", lineHeight: "104px", fontSize: 78, marginRight: 10, flexShrink: 0, transform: `scale(${1 + 0.15 * Math.sin(p * Math.PI)})` }}>{l}</span>
              <div>
                <div style={{ fontSize: 58, color: C.paper, letterSpacing: -1, lineHeight: 1.05, whiteSpace: "nowrap" }}>{rest}</div>
                <div style={{ fontSize: 30, color: C.matchaLight, marginTop: 4, whiteSpace: "nowrap" }}>{sub}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Scene>
  );
};

/* fact card under the diagram */
const FactCard: React.FC<{ t: number; t0: number; letter: string; name: string; at: number; facts: [string, number][] }> = ({ t, t0, letter, name, at, facts }) => {
  const swap = ramp(t, at, at + 0.3);
  return (
    <div style={{ position: "absolute", left: 30, width: 800, top: 750, height: 180, borderRadius: 36, background: C.forest, boxShadow: "0 14px 30px rgba(31,42,20,0.25)", ...pop(t, t0, 0.3) }}>
      <div style={{ position: "absolute", left: 30, top: 22, display: "flex", alignItems: "center", gap: 18, opacity: swap, transform: `translateX(${(1 - swap) * 24}px)` }}>
        <div style={{ width: 64, height: 64, borderRadius: 32, background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 42, display: "flex", alignItems: "center", justifyContent: "center" }}>{letter}</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 54, color: C.paper, letterSpacing: -1, whiteSpace: "nowrap" }}>{name}</div>
      </div>
      <div style={{ position: "absolute", left: 30, top: 108, display: "flex", gap: 14 }}>
        {facts.map(([f, ft], i) => (
          <div key={f} style={{ ...pop(t, ft, 0.25), ...chip(i === facts.length - 1 && f.includes("ft") ? C.banana : C.matcha, i === facts.length - 1 && f.includes("ft") ? C.forest : C.paper, 34) }}>{f}</div>
        ))}
      </div>
    </div>
  );
};

/* 4a. D: duodenum lights on our diagram */
export const V4: React.FC = () => {
  const t = useT();
  const z = ramp(t, 12.6, 16.6);
  return (
    <Scene start={12.55} end={16.62} push={0.012}>
      <div style={{ position: "absolute", left: 80, top: 0, opacity: ramp(t, 12.55, 12.85), transform: `scale(${1 + 0.18 * z})`, transformOrigin: "40% 50%" }}>
        <Gut t={t} w={700} lit={{ DU: 12.64 }} focus="DU" dimFrom={12.6} letters letterOn={{ D: 12.64 }} />
      </div>
      <FactCard t={t} t0={12.7} letter="D" name="Duodenum" at={12.7} facts={[["1st part", 14.13], ["shortest", 14.63], ["≈ 10 in", 15.71]]} />
    </Scene>
  );
};

/* 4b. The duodenum's C around the head of the pancreas, on the 1918 plate */
const P = (x: number, y: number) => `${(x * 820).toFixed(1)} ${(y * 577.5).toFixed(1)}`;
export const V4b: React.FC = () => {
  const t = useT();
  const cP = ramp(t, 17.25, 18.1);
  const cPath = `M${P(0.425, 0.42)} C${P(0.37, 0.42)} ${P(0.33, 0.48)} ${P(0.335, 0.58)} C${P(0.34, 0.7)} ${P(0.38, 0.8)} ${P(0.46, 0.82)} C${P(0.54, 0.83)} ${P(0.585, 0.76)} ${P(0.6, 0.66)}`;
  return (
    <Scene start={16.62} end={19.25} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 150 }}>
        <Plate src="plates/duodenum.png" aspect={ASPECT_DUO} x={0} y={0} w={820} a={16.62} b={19.25} zoomFrom={[1, 0.5, 0.5]} zoomTo={[1, 0.5, 0.5]}
          labels={[
            { x: 0.335, y: 0.5, text: "Duodenum", t: 16.85, ox: -40, oy: -150 },
            { x: 0.42, y: 0.59, text: "Head of pancreas", t: 18.0, hot: true, ox: 110, oy: -200 },
          ]}
        />
        <svg width={820} height={578} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: 1 - ramp(t, 19.0, 19.3) }}>
          <path d={cPath} fill="none" stroke={C.forest} strokeWidth={22} strokeLinecap="round" pathLength={1} strokeDasharray={`${cP} 1`} opacity={0.85} />
          <path d={cPath} fill="none" stroke={C.banana} strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray={`${cP} 1`} />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 0, top: 60, ...pop(t, 16.7) }}>
        <Pill size={36} bg={C.forest}>1918 ATLAS · DUODENUM</Pill>
      </div>
      <div style={{ position: "absolute", left: 30, width: 800, top: 760, height: 130, borderRadius: 34, background: C.forest, display: "flex", justifyContent: "center", alignItems: "center", gap: 14, boxShadow: "0 14px 30px rgba(31,42,20,0.25)", ...pop(t, 17.3, 0.3) }}>
        <div style={{ ...pop(t, 17.32), ...chip(C.banana, C.forest, 48) }}>C-shape</div>
        <div style={{ ...pop(t, 17.67), fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper }}>around the</div>
        <div style={{ ...pop(t, 18.2), ...chip(C.matcha, C.paper, 40) }}>pancreas</div>
      </div>
    </Scene>
  );
};

/* 4c. J and I light up, then the junction with the large intestine */
type Step = { id: GutId[]; t: number; name: string; letter: string; facts: [string, number][]; zoom: [number, number, number] };
const STEPS: Step[] = [
  { id: ["JE"], t: 19.37, name: "Jejunum", letter: "J", facts: [["middle", 19.9], ["≈ 3 ft", 20.9], ["Latin: “empty”", 22.69]], zoom: [1.22, 0.78, 0.6] },
  { id: ["IL"], t: 23.95, name: "Ileum", letter: "I", facts: [["last", 24.4], ["longest", 24.95], ["≈ 6 ft", 26.09]], zoom: [1.22, 0.35, 0.82] },
  { id: ["IL", "LI"], t: 26.87, name: "Ileocecal valve", letter: "→", facts: [["into the large intestine", 27.46], ["ileum + cecum", 28.96]], zoom: [1.3, 0.2, 0.9] },
];
export const V5: React.FC = () => {
  const t = useT();
  let ci = 0;
  STEPS.forEach((s, i) => { if (t >= s.t) ci = i; });
  const cur = STEPS[ci];
  const prev = STEPS[Math.max(0, ci - 1)];
  const k = ci === 0 ? 1 : ramp(t, cur.t, cur.t + 0.8);
  const zs = prev.zoom[0] + (cur.zoom[0] - prev.zoom[0]) * k;
  const zx = prev.zoom[1] + (cur.zoom[1] - prev.zoom[1]) * k;
  const zy = prev.zoom[2] + (cur.zoom[2] - prev.zoom[2]) * k;
  const zIn = ramp(t, 19.25, 20.2);
  const s = 1 + (zs - 1) * zIn;
  return (
    <Scene start={19.25} end={30.25} push={0.01}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 860, height: 740, overflow: "hidden", borderRadius: 36 }}>
        <div style={{ position: "absolute", left: 80, top: 0, opacity: ramp(t, 19.25, 19.55), transform: `scale(${s})`, transformOrigin: `${zx * 100}% ${zy * 100}%` }}>
          <Gut t={t} w={700} lit={{ JE: 19.37, IL: 23.95, LI: 27.46 }} focus={cur.id} dimFrom={19.3} letters letterOn={{ D: 0, J: 19.37, I: 23.95 }} valve={28.96} />
        </div>
      </div>
      <FactCard key={ci} t={t} t0={19.3} letter={cur.letter} name={cur.name} at={cur.t} facts={cur.facts} />
    </Scene>
  );
};

/* 6. The 1918 plate with modern labels + old-name note */
export const V6: React.FC = () => {
  const t = useT();
  return (
    <Scene start={30.25} end={34.75} push={0.01}>
      <Plate src="plates/abdomen.png" aspect={ASPECT_ABD} x={80} y={50} w={700} a={30.25} b={34.75} zoomFrom={[1.0, 0.5, 0.55]} zoomTo={[1.12, 0.5, 0.62]}
        labels={[
          { x: 0.55, y: 0.45, text: "Stomach", t: 30.6, ox: 120, oy: -70 },
          { x: 0.64, y: 0.57, text: "Jejunum", t: 31.1, hot: true, ox: 70, oy: -40 },
          { x: 0.38, y: 0.7, text: "Ileum", t: 31.6, hot: true, ox: -120, oy: -60 },
          { x: 0.3, y: 0.79, text: "Cecum", t: 32.1, ox: 50, oy: 60 },
        ]}
      />
      <div style={{ position: "absolute", left: 60, width: 740, top: 760, height: 150, borderRadius: 26, background: C.forest, boxShadow: "0 12px 26px rgba(31,42,20,0.3)", ...pop(t, 32.6) }}>
        <div style={{ position: "absolute", left: 30, top: 22, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.matchaLight, letterSpacing: 2 }}>1918 ATLAS NAME</div>
        <div style={{ position: "absolute", left: 30, top: 62, fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper, whiteSpace: "nowrap" }}>
          "Sigmoid flexure" = <span style={{ color: C.banana }}>sigmoid colon</span>
        </div>
      </div>
    </Scene>
  );
};

/* 7. Quick test */
export const V7: React.FC = () => {
  const t = useT();
  const c0 = 36.9;
  const n = t < c0 ? null : t < c0 + 0.5 ? 3 : t < c0 + 1.0 ? 2 : t < c0 + 1.5 ? 1 : null;
  const k = Math.floor((t - c0) / 0.5) * 0.5 + c0;
  return (
    <Scene start={34.75} end={38.35}>
      <div style={{ position: "absolute", left: 10, top: 30, width: 840, height: 840, borderRadius: 48, background: C.forest, ...pop(t, 34.8, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 52, display: "flex", justifyContent: "center" }}><div style={{ background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, padding: "8px 28px 11px 36px", borderRadius: 18 }}>QUICK TEST</div></div>
        <div style={{ position: "absolute", left: 40, width: 760, top: 170, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 72, lineHeight: 1.1, color: C.paper, ...pop(t, 35.55) }}>
          Which part is the <span style={{ background: C.banana, color: C.forest, borderRadius: 16, padding: "0 14px 4px", display: "inline-block" }}>longest?</span>
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 450, display: "flex", justifyContent: "center", gap: 14 }}>
          {["Duodenum", "Jejunum", "Ileum"].map((x, i) => (
            <div key={x} style={{ ...pop(t, 36.0 + i * 0.15), ...chip(C.matchaDark, C.paper, 40), padding: "12px 24px 15px", borderRadius: 18 }}>{x}</div>
          ))}
        </div>
        {n && (
          <div style={{ position: "absolute", left: 0, width: 840, top: 640, display: "flex", justifyContent: "center", transform: `scale(${1.3 - 0.3 * ramp(t, k, k + 0.15)})` }}><div style={{ width: 150, height: 150, borderRadius: 75, background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 104, lineHeight: "150px", textAlign: "center" }}>{n}</div></div>
        )}
      </div>
    </Scene>
  );
};

/* 8. Answer: ileum (≈6 ft); duodenum shortest (≈10 in) — bars to scale */
export const V8: React.FC = () => {
  const t = useT();
  const BARS: [string, number, string, string, number][] = [
    ["Duodenum", 0.83, "≈ 10 in", "SHORTEST", 39.24],
    ["Jejunum", 3, "≈ 3 ft", "", 38.75],
    ["Ileum", 6, "≈ 6 ft", "LONGEST", 38.55],
  ];
  return (
    <Scene start={38.35} end={40.95} push={0.01}>
      <div style={center(40, pop(t, 38.45))}>
        <Pill size={64} bg={C.red}>ILEUM</Pill>
      </div>
      <div style={{ position: "absolute", left: 30, width: 800, top: 180, height: 620, borderRadius: 40, background: C.card, border: `3px solid ${C.line}`, boxShadow: "0 18px 40px rgba(31,42,20,0.12)", ...pop(t, 38.4, 0.3) }}>
        {BARS.map(([name, ft, len, tag, tt], i) => {
          const p = ramp(t, tt, tt + 0.45);
          const hot = (i === 2 && t >= 38.55) || (i === 0 && t >= 39.24);
          const bw = (ft / 6) * 600;
          return (
            <div key={name} style={{ position: "absolute", left: 40, top: 40 + i * 190 }}>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.forest, display: "flex", alignItems: "center", gap: 14 }}>
                {name}
                {tag && <span style={{ ...pop(t, i === 0 ? 39.98 : 38.75), ...chip(i === 0 ? C.matcha : C.banana, i === 0 ? C.paper : C.forest, 28) }}>{tag}</span>}
              </div>
              <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: Math.max(8, bw * p), height: 62, borderRadius: 31, background: hot ? (i === 2 ? C.banana : C.redLight) : C.matchaLight, border: `5px solid ${C.forest}` }} />
                <div style={{ opacity: p, fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.forest, whiteSpace: "nowrap" }}>{len}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ ...center(820), ...pop(t, 39.3) }}>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, color: C.matchaDark }}>approximate lengths in life (OpenStax A&P)</div>
      </div>
    </Scene>
  );
};

/* 9. Save */
export const V9: React.FC = () => {
  const t = useT();
  const b = ramp(t, 41.05, 41.4);
  return (
    <Scene start={40.95} end={43.2}>
      <div style={center(40, pop(t, 41.0))}>
        <svg width={220} height={280} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={center(360, pop(t, 41.11))}>
        <Big size={120}>SAVE THIS</Big>
      </div>
      <div style={center(510, pop(t, 41.8))}>
        <Big size={58} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ ...center(650), gap: 14, ...pop(t, 42.3) }}>
        {["D", "J", "I"].map((l, i) => (
          <div key={i} style={{ width: 110, height: 118, borderRadius: 22, background: i === 2 ? C.red : C.matcha, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 72, display: "flex", alignItems: "center", justifyContent: "center" }}>{l}</div>
        ))}
      </div>
    </Scene>
  );
};

/* 10. End card */
export const V10: React.FC = () => {
  const t = useT();
  return (
    <Scene start={43.2} end={50.4}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, 43.25, 0.35) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.matchaLight, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 44.3, 44.6) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 43.3) * 5))})`, opacity: ramp(t, 43.37, 43.7) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
