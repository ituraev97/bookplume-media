import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { Scalp, LayerId } from "./Scalp38";

const ASPECT_HEAD = 2103 / 2004;
const ASPECT_ART = 1792 / 1766;
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

/* 1. Hook: the 1918 plate, push in on the top of the head */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={2.9} push={0.02}>
      <div style={center(40, pop(t, 0, 0.25))}>
        <Big size={88}>
          NAME ALL <span style={{ background: C.banana, borderRadius: 18, padding: "0 16px 6px" }}>5?</span>
        </Big>
      </div>
      <Plate src="plates/head.png" aspect={ASPECT_HEAD} x={110} y={160} w={640} a={-0.6} b={2.9} zoomFrom={[1, 0.5, 0.45]} zoomTo={[1.75, 0.55, 0.16]} />
      <div style={{ position: "absolute", left: 0, top: 640, ...pop(t, 1.0) }}>
        <Pill size={40} bg={C.forest}>LAYERS OF YOUR</Pill>
      </div>
      <div style={{ position: "absolute", left: 520, top: 640, ...pop(t, 1.54) }}>
        <Pill size={46} bg={C.banana} color={C.forest}>SCALP</Pill>
      </div>
      <Stamp t0={2.52} text="THE TRICK" size={62} rot={-8} color={C.red} style={{ left: 440, top: 780 }} />
    </Scene>
  );
};

/* 2. The mnemonic card: the word SCALP spells the layers */
const LET: [string, string, number][] = [
  ["S", "Skin", 3.47],
  ["C", "Connective tissue", 3.62],
  ["A", "Aponeurosis", 3.77],
  ["L", "Loose areolar tissue", 3.92],
  ["P", "Pericranium", 4.07],
];
export const V2: React.FC = () => {
  const t = useT();
  return (
    <Scene start={2.9} end={4.85}>
      <div style={{ position: "absolute", left: 10, top: 10, width: 840, height: 900, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 2.95, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 50, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 32, letterSpacing: 6, color: C.matchaLight, ...pop(t, 3.19) }}>THE WORD SPELLS THE LAYERS</div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 130, display: "flex", justifyContent: "center", gap: 14 }}>
          {LET.map(([l, , tt]) => {
            const p = ramp(t, tt - 0.05, tt + 0.22);
            return (
              <div key={l} style={{ width: 136, height: 156, borderRadius: 28, background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 120, lineHeight: "156px", textAlign: "center", opacity: p, transform: `translateY(${(1 - p) * -120}px) rotate(${(1 - p) * (l === "A" ? 8 : -8)}deg) scale(${1 + 0.12 * Math.sin(p * Math.PI)})` }}>{l}</div>
            );
          })}
        </div>
        {LET.map(([l, name, tt], i) => {
          const p = ramp(t, tt + 0.25, tt + 0.55);
          return (
            <div key={l} style={{ position: "absolute", left: 90, top: 345 + i * 100, opacity: p, transform: `translateX(${(1 - p) * 40}px)`, display: "flex", alignItems: "center", fontFamily: FONT, fontWeight: 800 }}>
              <span style={{ width: 70, fontSize: 30, color: C.matchaLight }}>{i + 1}</span>
              <span style={{ display: "inline-block", width: 70, height: 74, borderRadius: 16, background: C.matcha, color: C.paper, textAlign: "center", lineHeight: "74px", fontSize: 50, marginRight: 22 }}>{l}</span>
              <span style={{ fontSize: 50, color: C.paper, letterSpacing: -1, whiteSpace: "nowrap" }}>{name}</span>
            </div>
          );
        })}
        <div style={{ position: "absolute", right: 46, top: 360, width: 10, height: 470, borderRadius: 5, background: C.matchaDark, ...pop(t, 4.3) }} />
        <div style={{ position: "absolute", right: 22, top: 836, fontFamily: FONT, fontWeight: 800, fontSize: 22, letterSpacing: 2, color: C.matchaLight, ...pop(t, 4.3) }}>DEEPER</div>
      </div>
    </Scene>
  );
};

/* fact card under the diagram */
const FactCard: React.FC<{ t: number; t0: number; letter: string; name: string; at: number; facts: [string, number, boolean?][]; small?: boolean }> = ({ t, t0, letter, name, at, facts, small }) => {
  const swap = ramp(t, at, at + 0.3);
  return (
    <div style={{ position: "absolute", left: 30, width: 800, top: 700, height: 200, borderRadius: 36, background: C.forest, boxShadow: "0 14px 30px rgba(31,42,20,0.25)", ...pop(t, t0, 0.3) }}>
      <div style={{ position: "absolute", left: 30, top: 24, display: "flex", alignItems: "center", gap: 18, opacity: swap, transform: `translateX(${(1 - swap) * 24}px)` }}>
        <div style={{ width: 68, height: 68, borderRadius: 34, background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>{letter}</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: small ? 46 : 54, color: C.paper, letterSpacing: -1, whiteSpace: "nowrap" }}>{name}</div>
      </div>
      <div style={{ position: "absolute", left: 30, top: 118, display: "flex", gap: 14 }}>
        {facts.map(([f, ft, hot]) => (
          <div key={f} style={{ ...pop(t, ft, 0.25), ...chip(hot ? C.banana : C.matcha, hot ? C.forest : C.paper, 34) }}>{f}</div>
        ))}
      </div>
    </div>
  );
};

/* 3. Diagram: S then C */
type Step = { id: LayerId; t: number; name: string; facts: [string, number, boolean?][]; zoom: [number, number, number]; small?: boolean };
const DiagramSteps: React.FC<{ t: number; steps: Step[]; start: number; extra?: Partial<React.ComponentProps<typeof Scalp>>; letters: Partial<Record<"S" | "C" | "A" | "L" | "P", number>>; lit: Partial<Record<LayerId, number>>; focusOverride?: LayerId[] }> = ({ t, steps, start, extra = {}, letters, lit, focusOverride }) => {
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
    <>
      <div style={{ position: "absolute", left: 0, top: 20, width: 860, height: 660, overflow: "hidden", borderRadius: 36, background: C.card, border: `3px solid ${C.line}` }}>
        <div style={{ position: "absolute", left: 0, top: 36, transform: `scale(${s})`, transformOrigin: `${zx * 0 + 1}% ${zy * 100}%` }}>
          <Scalp t={t} w={860} lit={lit} focus={focusOverride ?? [cur.id]} dimFrom={start + 0.05} letters={letters} {...extra} />
        </div>
      </div>
      <FactCard key={ci} t={t} t0={start + 0.05} letter={cur.id === "B" ? "P" : cur.id} name={cur.name} at={cur.t} facts={cur.facts} small={cur.small} />
    </>
  );
};

export const V3: React.FC = () => {
  const t = useT();
  const steps: Step[] = [
    { id: "S", t: 4.92, name: "Skin", facts: [["thick", 6.26], ["hair follicles", 7.23, true]], zoom: [1.12, 0.5, 0.15] },
    { id: "C", t: 8.17, name: "Connective tissue", facts: [["dense", 9.91, true]], zoom: [1.18, 0.5, 0.35], small: true },
  ];
  return (
    <Scene start={4.85} end={10.55} push={0.01}>
      <DiagramSteps t={t} steps={steps} start={4.85} letters={{ S: 4.92, C: 8.17 }} lit={{ S: 4.92, C: 8.17 }} extra={{ grow: 4.88 }} />
    </Scene>
  );
};

/* 3b. Layer C carries the vessels: the 1918 plate of the scalp arteries */
export const V3b: React.FC = () => {
  const t = useT();
  return (
    <Scene start={10.55} end={13.1} push={0.01}>
      <Plate src="plates/arteries.png" aspect={ASPECT_ART} x={60} y={20} w={740} a={10.55} b={13.1} zoomFrom={[1.05, 0.4, 0.3]} zoomTo={[1.25, 0.38, 0.28]}
        labels={[
          { x: 0.398, y: 0.36, text: "Sup. temporal a.", t: 11.55, hot: true, ox: -10, oy: -140 },
          { x: 0.075, y: 0.42, text: "Occipital a.", t: 11.95, ox: 40, oy: 150 },
        ]}
      />
      <div style={{ position: "absolute", left: 60, width: 740, top: 770, height: 130, borderRadius: 34, background: C.forest, display: "flex", justifyContent: "center", alignItems: "center", gap: 14, boxShadow: "0 14px 30px rgba(31,42,20,0.25)", ...pop(t, 10.65, 0.3) }}>
        <div style={{ ...pop(t, 10.7), width: 62, height: 62, borderRadius: 31, background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>C</div>
        <div style={{ ...pop(t, 10.7), fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.matchaLight }}>carries</div>
        <div style={{ ...pop(t, 11.55), ...chip(C.red, C.paper, 36) }}>blood vessels</div>
        <div style={{ ...pop(t, 12.21), fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.paper }}>+</div>
        <div style={{ ...pop(t, 12.33), ...chip(C.banana, C.forest, 36) }}>nerves</div>
      </div>
    </Scene>
  );
};

/* 4. A: aponeurosis + muscle bellies */
export const V4: React.FC = () => {
  const t = useT();
  const steps: Step[] = [{ id: "A", t: 13.21, name: "Aponeurosis", facts: [["flat tendon sheet", 14.89, true], ["joins 2 muscle bellies", 16.1]], zoom: [1.12, 0.5, 0.45] }];
  return (
    <Scene start={13.1} end={18.7} push={0.01}>
      <DiagramSteps t={t} steps={steps} start={13.1} letters={{ S: 0, C: 0, A: 13.21 }} lit={{ A: 13.21 }} extra={{ bellies: 16.58 }} />
      <div style={{ position: "absolute", left: 150, top: 480, ...pop(t, 16.58) }}>
        <Pill size={32} bg={C.red}>frontal belly</Pill>
      </div>
      <div style={{ position: "absolute", right: 30, top: 480, ...pop(t, 17.2) }}>
        <Pill size={32} bg={C.red}>occipital belly</Pill>
      </div>
    </Scene>
  );
};

/* 5. The top three move as one unit */
export const V5: React.FC = () => {
  const t = useT();
  const steps: Step[] = [{ id: "S", t: 18.78, name: "S + C + A", facts: [["bound together", 19.99], ["1 unit", 21.63, true]], zoom: [1.0, 0.5, 0.4] }];
  return (
    <Scene start={18.7} end={22.45} push={0.01}>
      <DiagramSteps t={t} steps={steps} start={18.7} letters={{ S: 18.78, C: 18.9, A: 19.02 }} lit={{ S: 18.78, C: 18.9, A: 19.02 }} focusOverride={["S", "C", "A"]} extra={{ unit: 19.5 }} />
      <Stamp t0={21.63} text="1 UNIT" size={56} rot={-7} color={C.red} style={{ left: 560, top: 40 }} />
    </Scene>
  );
};

/* 6. L: loose areolar tissue lets the top three slide */
export const V6: React.FC = () => {
  const t = useT();
  const steps: Step[] = [{ id: "L", t: 22.55, name: "Loose areolar tissue", facts: [["loose", 22.82], ["lets them slide", 25.69, true]], zoom: [1.15, 0.5, 0.55], small: true }];
  return (
    <Scene start={22.45} end={26.95} push={0.008}>
      <DiagramSteps t={t} steps={steps} start={22.45} letters={{ S: 0, C: 0, A: 0, L: 22.55 }} lit={{ L: 22.55 }} extra={{ slide: [24.36, 26.9] }} />
      <div style={{ position: "absolute", left: 0, width: 860, top: 60, display: "flex", justifyContent: "center", ...pop(t, 25.69) }}>
        <div style={{ ...chip(C.forest, C.paper, 34), display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: C.banana }}>⟵</span> SLIDES <span style={{ color: C.banana }}>⟶</span>
        </div>
      </div>
    </Scene>
  );
};

/* 7. P: pericranium on the bone */
export const V7: React.FC = () => {
  const t = useT();
  const steps: Step[] = [
    { id: "P", t: 27.18, name: "Pericranium", facts: [["= periosteum", 28.85, true]], zoom: [1.2, 0.5, 0.68] },
    { id: "P", t: 29.63, name: "Pericranium", facts: [["= periosteum", 0, true], ["stuck onto bone", 29.63]], zoom: [1.35, 0.5, 0.75] },
  ];
  return (
    <Scene start={26.95} end={31.2} push={0.008}>
      <DiagramSteps t={t} steps={steps} start={26.95} letters={{ S: 0, C: 0, A: 0, L: 0, P: 27.18 }} lit={{ P: 27.18, B: 30.45 }} focusOverride={t > 30.45 ? ["P", "B"] : ["P"]} />
    </Scene>
  );
};

/* 8. The 1918 plate with modern labels + old-name note */
export const V8: React.FC = () => {
  const t = useT();
  return (
    <Scene start={31.2} end={36.3} push={0.01}>
      <Plate src="plates/head.png" aspect={ASPECT_HEAD} x={60} y={20} w={740} a={31.2} b={36.3} zoomFrom={[1.0, 0.5, 0.3]} zoomTo={[1.1, 0.52, 0.25]}
        labels={[
          { x: 0.6, y: 0.11, text: "Epicranial aponeurosis", t: 31.66, hot: true, ox: -40, oy: 40 },
          { x: 0.36, y: 0.2, text: "Frontal belly", t: 32.77, ox: 24, oy: 70 },
          { x: 0.73, y: 0.4, text: "Occipital belly", t: 33.27, ox: -30, oy: 120 },
        ]}
      />
      <div style={{ position: "absolute", left: 40, width: 780, top: 735, height: 175, borderRadius: 26, background: C.forest, boxShadow: "0 12px 26px rgba(31,42,20,0.3)", ...pop(t, 34.3) }}>
        <div style={{ position: "absolute", left: 30, top: 20, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.matchaLight, letterSpacing: 2 }}>1918 ATLAS NAMES</div>
        <div style={{ position: "absolute", left: 30, top: 60, fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.paper, whiteSpace: "nowrap" }}>
          "Galea aponeurotica" = <span style={{ color: C.banana }}>aponeurosis</span>
        </div>
        <div style={{ position: "absolute", left: 30, top: 112, fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.paper, whiteSpace: "nowrap", ...pop(t, 34.9) }}>
          "Epicranius" = <span style={{ color: C.banana }}>occipitofrontalis</span>
        </div>
      </div>
    </Scene>
  );
};

/* 9. Quick test */
export const V9: React.FC = () => {
  const t = useT();
  const c0 = 38.72;
  const n = t < c0 ? null : t < c0 + 0.5 ? 3 : t < c0 + 1.0 ? 2 : t < c0 + 1.5 ? 1 : null;
  const k = Math.floor((t - c0) / 0.5) * 0.5 + c0;
  return (
    <Scene start={36.3} end={40.2}>
      <div style={{ position: "absolute", left: 10, top: 30, width: 840, height: 860, borderRadius: 48, background: C.forest, ...pop(t, 36.35, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 52, display: "flex", justifyContent: "center" }}>
          <div style={{ background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, padding: "8px 28px 11px 36px", borderRadius: 18 }}>QUICK TEST</div>
        </div>
        <div style={{ position: "absolute", left: 40, width: 760, top: 170, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 70, lineHeight: 1.12, color: C.paper, ...pop(t, 37.1) }}>
          Which layer lets your scalp <span style={{ background: C.banana, color: C.forest, borderRadius: 16, padding: "0 14px 4px", display: "inline-block" }}>slide?</span>
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 470, display: "flex", justifyContent: "center", gap: 14 }}>
          {["S", "C", "A", "L", "P"].map((x, i) => (
            <div key={x} style={{ ...pop(t, 37.6 + i * 0.12), width: 112, height: 120, borderRadius: 22, background: C.matchaDark, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 70, display: "flex", alignItems: "center", justifyContent: "center" }}>{x}</div>
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

/* 10. Answer: L, layer 4 */
export const V10: React.FC = () => {
  const t = useT();
  return (
    <Scene start={40.2} end={43.4} push={0.01}>
      <div style={{ ...center(20), gap: 16, alignItems: "center" }}>
        {["S", "C", "A", "L", "P"].map((x, i) => {
          const hot = i === 3;
          const p = ramp(t, 40.27 + (hot ? 0.1 : 0), 40.6);
          return (
            <div key={x} style={{ width: hot ? 150 : 100, height: hot ? 160 : 108, borderRadius: 24, background: hot ? C.red : C.matchaLight, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: hot ? 110 : 64, display: "flex", alignItems: "center", justifyContent: "center", opacity: hot ? 1 : 0.35 + 0.65 * (1 - p), transform: hot ? `scale(${0.7 + 0.3 * p + 0.1 * Math.sin(p * Math.PI)})` : "none" }}>{x}</div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, top: 200, width: 860, height: 470, overflow: "hidden", borderRadius: 36, background: C.card, border: `3px solid ${C.line}`, ...pop(t, 40.3) }}>
        <div style={{ position: "absolute", left: 0, top: -40, transform: "scale(1.0)", transformOrigin: "0% 50%" }}>
          <Scalp t={t} w={860} lit={{ L: 40.5 }} focus={["L"]} dimFrom={40.3} letters={{ S: 0, C: 0, A: 0, L: 40.5, P: 0 }} slide={[41.1, 43.4]} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 30, width: 800, top: 700, height: 200, borderRadius: 36, background: C.forest, ...pop(t, 40.4) }}>
        <div style={{ position: "absolute", left: 0, width: 800, top: 26, display: "flex", justifyContent: "center", ...pop(t, 40.51) }}>
          <div style={chip(C.banana, C.forest, 44)}>LAYER 4</div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 114, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.paper, letterSpacing: -1, ...pop(t, 41.19) }}>Loose areolar tissue</div>
      </div>
    </Scene>
  );
};

/* 11. Save */
export const V11: React.FC = () => {
  const t = useT();
  const b = ramp(t, 43.5, 43.85);
  return (
    <Scene start={43.4} end={45.6}>
      <div style={center(40, pop(t, 43.45))}>
        <svg width={220} height={280} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={center(360, pop(t, 43.5))}>
        <Big size={120}>SAVE THIS</Big>
      </div>
      <div style={center(510, pop(t, 44.18))}>
        <Big size={58} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ ...center(650), gap: 12, ...pop(t, 44.6) }}>
        {["S", "C", "A", "L", "P"].map((l, i) => (
          <div key={i} style={{ width: 104, height: 112, borderRadius: 22, background: i === 3 ? C.red : C.matcha, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 68, display: "flex", alignItems: "center", justifyContent: "center" }}>{l}</div>
        ))}
      </div>
    </Scene>
  );
};

/* 12. End card */
export const V12: React.FC = () => {
  const t = useT();
  return (
    <Scene start={45.6} end={49.9}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, 45.65, 0.35) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.matchaLight, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 46.55, 46.85) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 45.75) * 5))})`, opacity: ramp(t, 45.74, 46.05) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
