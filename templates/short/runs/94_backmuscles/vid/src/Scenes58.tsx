import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { ANCHOR, CeliacDiagram, Part } from "./Celiac58";

export const A532 = 1544 / 1728;
export const A533 = 1758 / 1766;
export const liveAlpha = (_t: number) => 0;

const pop = (t: number, t0: number, d = 0.3) => {
  const p = ramp(t, t0, t0 + d);
  return { opacity: p, transform: `scale(${0.6 + 0.4 * p + 0.08 * Math.sin(Math.min(1, p) * Math.PI)})` } as React.CSSProperties;
};
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });
const Big: React.FC<{ size?: number; children: React.ReactNode; color?: string }> = ({ size = 110, children, color = C.forest }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1, letterSpacing: -2, textAlign: "center", whiteSpace: "nowrap" }}>{children}</div>
);

export type L3 = "L" | "H" | "S";
export const LCOL: Record<L3, string> = { L: C.banana, H: "#E8796B", S: "#7FAFC4" };
export const LWORD: Record<L3, string> = { L: "Left", H: "Hand", S: "Side" };
export const LART: Record<L3, string> = { L: "Left gastric", H: "Common hepatic", S: "Splenic" };
export const LORDER: L3[] = ["L", "H", "S"];
export const Letter: React.FC<{ b: L3; size?: number; on?: number; style?: React.CSSProperties }> = ({ b, size = 64, on = 1, style }) => (
  <div style={{ width: size * 1.2, height: size * 1.2, borderRadius: size * 0.3, background: on > 0.5 ? LCOL[b] : "rgba(31,42,20,0.08)", color: on > 0.5 ? C.forest : "rgba(31,42,20,0.3)", border: `${Math.max(3, size * 0.06)}px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size, boxShadow: "0 6px 0 rgba(31,42,20,0.2)", flexShrink: 0, ...style }}>{b}</div>
);

/* diagram placement inside the scene box (860 x 940) */
const DX = 40, DY = 150, DW = 780;
const k = DW / 860;
const sx = (x: number) => DX + x * k;
const sy = (y: number) => DY + y * k;

/** callout: dot on the diagram + pill offset */
const Callout: React.FC<{ at: [number, number]; dx: number; dy: number; t0: number; text: React.ReactNode; hot?: boolean; size?: number; out?: number }> = ({ at, dx, dy, t0, text, hot, size = 34, out }) => {
  const t = useT();
  const p = ramp(t, t0 - 0.05, t0 + 0.25) * (out === undefined ? 1 : 1 - ramp(t, out, out + 0.25));
  if (p <= 0) return null;
  const x = sx(at[0]), y = sy(at[1]);
  return (
    <>
      <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: p }}>
        <line x1={x} y1={y} x2={x + dx * p} y2={y + dy * p} stroke={C.forest} strokeWidth={5} strokeLinecap="round" />
        <circle cx={x} cy={y} r={11} fill={hot ? C.banana : C.paper} stroke={C.forest} strokeWidth={5} />
      </svg>
      <div style={{ position: "absolute", left: x + dx, top: y + dy, transform: `translate(${dx < 0 ? "-100%" : dx === 0 ? "-50%" : "0"}, -50%) scale(${0.8 + 0.2 * p})`, transformOrigin: dx < 0 ? "100% 50%" : "0 50%", opacity: p }}>
        <div style={{ background: hot ? C.banana : C.forest, color: hot ? C.forest : C.paper, fontFamily: FONT, fontWeight: 800, fontSize: size, padding: "6px 18px 9px", borderRadius: 16, whiteSpace: "nowrap", boxShadow: "0 6px 0 rgba(31,42,20,0.18)" }}>{text}</div>
      </div>
    </>
  );
};

/** camera on the diagram: scale z around a focus point (diagram coords), keeping it roughly centred */
const Cam: React.FC<{ z: number; f: [number, number]; children: React.ReactNode }> = ({ z, f, children }) => {
  const fx = sx(f[0]), fy = sy(f[1]);
  const cx = 430, cy = 500;
  const m = z - 1;
  return <div style={{ position: "absolute", inset: 0, transformOrigin: "0 0", transform: `translate(${(cx - fx) * m * 0.55}px, ${(cy - fy) * m * 0.55}px) translate(${fx}px, ${fy}px) scale(${z}) translate(${-fx}px, ${-fy}px)` }}>{children}</div>;
};

/* 1. Hook: Gray's 1918 Fig. 532, push in on the celiac */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={2.9} push={0.02}>
      <div style={center(40, { ...pop(t, 0, 0.25) })}>
        <Big size={80}>NAME ALL 3</Big>
      </div>
      <div style={center(126, { ...pop(t, 0.85, 0.25) })}>
        <Big size={72} color={C.red}>CELIAC TRUNK</Big>
      </div>
      <div style={center(206, { ...pop(t, 1.2, 0.25) })}>
        <Big size={56}>branches?</Big>
      </div>
      <Plate src="plates/celiac532.png" aspect={A532} x={140} y={290} w={580} a={-0.6} b={2.9} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.55, 0.43, 0.42]} />
      <Stamp t0={1.9} text="EXAM FAVORITE" size={46} rot={-7} color={C.forest} style={{ left: 190, top: 860 }} />
    </Scene>
  );
};

/* 2. Where it starts: first big branch of the abdominal aorta, below the diaphragm, T12 */
export const V2: React.FC = () => {
  const t = useT();
  const lit: Partial<Record<Part, number>> = { CT: 3.62, AO: 4.25, DIA: 6.62 };
  const glow: Part[] = t < 4.2 ? ["CT"] : t < 6.5 ? ["AO"] : ["DIA"];
  const z = 1 + 0.18 * ramp(t, 7.5, 8.6);
  return (
    <Scene start={2.9} end={9.06} push={0.012}>
      <Cam z={z} f={[400, 292]}>
        <div style={{ position: "absolute", left: DX, top: DY }}>
          <CeliacDiagram t={t} w={DW} grow={{ AO: 2.9, CT: 3.5, LG: 99, CH: 99, SP: 99 }} lit={lit} glow={glow} organs={0.55 + 0.45 * ramp(t, 3.0, 3.6)} dim={0.45} t12={ramp(t, 7.85, 8.15)} />
        </div>
        <Callout at={ANCHOR.CT} dx={150} dy={-60} t0={3.62} hot text={<>1st big branch</>} out={6.3} />
        <Callout at={[400, 600]} dx={150} dy={0} t0={4.3} text="abdominal aorta" out={6.3} />
        <Callout at={[600, 54]} dx={-40} dy={60} t0={6.65} text="diaphragm" size={32} />
        <Callout at={[322, 292]} dx={-120} dy={-2} t0={7.95} hot text="T12" size={44} />
      </Cam>
      <div style={{ position: "absolute", left: 0, top: 56, display: "flex", gap: 18, alignItems: "center", ...pop(t, 3.0, 0.25) }}>
        <Big size={60}>CELIAC TRUNK</Big>
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 868, display: "flex", justifyContent: "center", ...pop(t, 6.4) }}>
        <Pill size={36} bg={C.forest}>just below the diaphragm</Pill>
      </div>
    </Scene>
  );
};

/* 3. Mnemonic card: Left Hand Side */
const TIMES: Record<L3, number> = { L: 11.0, H: 11.29, S: 11.54 };
export const V3: React.FC = () => {
  const t = useT();
  const fork = ramp(t, 9.2, 9.9);
  return (
    <Scene start={9.06} end={12.45} push={0.015}>
      <div style={{ position: "absolute", left: 10, top: 10, width: 840, height: 910, borderRadius: 48, background: C.forest, ...pop(t, 9.05, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 40, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 7, color: C.matchaLight }}>1 TRUNK → 3 BRANCHES</div>
        {/* tripod icon */}
        <svg width={840} height={240} style={{ position: "absolute", left: 0, top: 96 }}>
          <path d="M420 10 L420 90" stroke={C.paper} strokeWidth={22} strokeLinecap="round" />
          {[[-230, 0], [0, 1], [230, 2]].map(([dx, i]) => {
            const p = ramp(t, 9.5 + i * 0.12, 9.9 + i * 0.12) * fork;
            return <path key={i} d={`M420 90 Q${420 + dx * 0.5} 120 ${420 + dx * p} ${90 + 110 * p}`} stroke={i === 1 ? C.banana : i === 0 ? "#E8796B" : "#7FAFC4"} strokeWidth={16} strokeLinecap="round" fill="none" />;
          })}
          <circle cx={420} cy={90} r={20} fill={C.paper} />
        </svg>
        {LORDER.map((b, i) => {
          const t0 = TIMES[b];
          const p = ramp(t, t0 - 0.05, t0 + 0.2);
          const pulse = Math.sin(Math.PI * Math.min(1, Math.max(0, (t - (12.0 + i * 0.12)) / 0.28)));
          return (
            <div key={b} style={{ position: "absolute", left: 150, top: 360 + i * 150, height: 130, display: "flex", alignItems: "center", gap: 30, opacity: p, transform: `translateX(${(1 - p) * -50}px)` }}>
              <Letter b={b} size={84} style={{ transform: `scale(${1 + 0.14 * pulse})`, border: `6px solid ${C.paper}` }} />
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 104, color: C.paper, letterSpacing: -1 }}>
                <span style={{ color: LCOL[b] }}>{b}</span>
                {LWORD[b].slice(1)}
              </div>
            </div>
          );
        })}
      </div>
    </Scene>
  );
};

/* 4. Branch by branch on our own diagram */
const STEP: { b: L3; part: Part; t0: number; f: [number, number] }[] = [
  { b: "L", part: "LG", t0: 12.47, f: [500, 280] },
  { b: "H", part: "CH", t0: 17.04, f: [330, 330] },
  { b: "S", part: "SP", t0: 21.74, f: [620, 440] },
];
export const V4: React.FC = () => {
  const t = useT();
  let cur = 0;
  STEP.forEach((s, i) => {
    if (t >= s.t0 - 0.05) cur = i;
  });
  const lit: Partial<Record<Part, number>> = { CT: 0, AO: 0, LC: 15.55, LIV: 20.25, GB: 20.75, PAN: 25.25, SPL: 25.95 };
  STEP.forEach((s) => (lit[s.part] = s.t0));
  const grow: Partial<Record<Part, number>> = { LG: 12.47, CH: 17.04, SP: 21.74 };
  const glow: Part[] = [STEP[cur].part];
  if (t > 20.2 && t < 21.6) glow.push(t < 20.7 ? "LIV" : "GB");
  if (t > 25.2) glow.push(t < 25.9 ? "PAN" : "SPL");
  // camera follows the branch being named
  const fs = STEP.map((s) => s.f);
  const blend = (i: number) => ramp(t, STEP[i].t0 - 0.2, STEP[i].t0 + 0.5);
  let f: [number, number] = fs[0];
  for (let i = 1; i < 3; i++) {
    const b = blend(i);
    f = [f[0] + (fs[i][0] - f[0]) * b, f[1] + (fs[i][1] - f[1]) * b];
  }
  const z = 1.14 - 0.14 * ramp(t, 26.2, 26.9);
  const s = STEP[cur];
  const p = ramp(t, s.t0 - 0.05, s.t0 + 0.22);
  return (
    <Scene start={12.45} end={26.9} push={0.01}>
      <div style={{ position: "absolute", left: 0, top: 150, width: 860, height: 712, overflow: "hidden", borderRadius: 40 }}>
        <div style={{ position: "absolute", left: 0, top: -150, width: 860, height: 940 }}>
          <Cam z={z} f={f}>
            <div style={{ position: "absolute", left: DX, top: DY }}>
              <CeliacDiagram t={t} w={DW} grow={grow} lit={lit} glow={glow} dim={0.5} wiggle={t > 24.3 ? 24.4 : undefined} hideDia />
            </div>
            <Callout at={[543, 290]} dx={0} dy={150} t0={15.6} hot text="lesser curvature" size={32} out={16.9} />
            <Callout at={ANCHOR.LIV} dx={0} dy={-90} t0={20.27} text="liver" size={32} out={21.6} />
            <Callout at={[200, 384]} dx={0} dy={110} t0={20.77} text="gallbladder" size={32} out={21.6} />
            <Callout at={[600, 500]} dx={-60} dy={120} t0={25.27} text="pancreas" size={32} />
            <Callout at={[836, 540]} dx={-40} dy={120} t0={25.97} hot text="spleen" size={32} />
          </Cam>
        </div>
      </div>
      {/* patient's right arrow */}
      {(() => {
        const q = ramp(t, 19.35, 19.65) * (1 - ramp(t, 21.5, 21.8));
        if (q <= 0) return null;
        return (
          <div style={{ position: "absolute", left: 20, top: 780, opacity: q, transform: `translateX(${(1 - q) * 40}px)` }}>
            <Pill size={34} bg={C.banana} color={C.forest}>← patient's RIGHT</Pill>
          </div>
        );
      })()}
      {/* header row: letter + artery name */}
      <div key={s.b} style={{ position: "absolute", left: 0, top: 58, display: "flex", gap: 18, alignItems: "center", opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
        <Letter b={s.b} size={60} />
        <Big size={s.b === "H" ? 60 : 68}>{LART[s.b].toUpperCase()}</Big>
      </div>
      <div style={{ position: "absolute", right: 0, top: 4, display: "flex", gap: 8 }}>
        {cur >= 0 && LORDER.map((b, i) => <Letter key={b} b={b} size={26} on={t >= STEP[i].t0 - 0.05 ? 1 : 0} />)}
      </div>
      {/* bottom facts */}
      <div style={{ position: "absolute", left: 0, width: 860, top: 872, display: "flex", justifyContent: "center", gap: 14 }}>
        {cur === 0 && <div style={pop(t, 14.2)}><Pill size={36} bg={C.forest}>runs along the stomach</Pill></div>}
        {cur === 1 && <div style={pop(t, 19.36)}><Pill size={36} bg={C.forest}>→ liver + gallbladder</Pill></div>}
        {cur === 2 && (
          <>
            <div style={pop(t, 23.45)}><Pill size={38} bg={C.red}>THE BIGGEST</Pill></div>
            <div style={pop(t, 24.45)}><Pill size={38} bg={C.forest}>wiggly 〰</Pill></div>
          </>
        )}
      </div>
    </Scene>
  );
};

/* 5. What they feed */
const FEED: { part: Part; t0: number; label: string; at: [number, number]; dx: number; dy: number }[] = [
  { part: "STO", t0: 27.7, label: "stomach", at: [690, 200], dx: 0, dy: -150 },
  { part: "LIV", t0: 28.32, label: "liver", at: [140, 230], dx: 0, dy: -130 },
  { part: "SPL", t0: 28.92, label: "spleen", at: [836, 500], dx: -20, dy: 140 },
  { part: "PAN", t0: 29.47, label: "pancreas", at: [560, 500], dx: -20, dy: 150 },
  { part: "DUO", t0: 30.47, label: "start of duodenum", at: [232, 560], dx: 40, dy: 220 },
];
export const V5: React.FC = () => {
  const t = useT();
  const lit: Partial<Record<Part, number>> = { CT: 26.9, LG: 26.9, CH: 26.9, SP: 26.9, AO: 26.9 };
  FEED.forEach((f) => (lit[f.part] = f.t0));
  let cur: Part | null = null;
  FEED.forEach((f) => {
    if (t >= f.t0) cur = f.part;
  });
  return (
    <Scene start={26.9} end={32.1} push={0.012}>
      <div style={{ position: "absolute", left: 0, top: 56, ...pop(t, 26.95, 0.25) }}>
        <Big size={60}>WHAT THEY FEED</Big>
      </div>
      <div style={{ position: "absolute", left: DX, top: DY }}>
        <CeliacDiagram t={t} w={DW} lit={lit} glow={cur ? [cur] : []} dim={0.55} hideDia />
      </div>
      {FEED.map((f) => <Callout key={f.part} at={f.at} dx={f.dx} dy={f.dy} t0={f.t0} text={f.label} hot={cur === f.part} size={32} />)}
    </Scene>
  );
};

/* 6. Gray's 1918 Fig. 533 with modern labels */
export const V6: React.FC = () => {
  const t = useT();
  return (
    <Scene start={32.1} end={34.68} push={0.008}>
      <Plate src="plates/celiac533.png" aspect={A533} x={40} y={46} w={780} a={32.1} b={34.68} zoomFrom={[1.05, 0.45, 0.55]} zoomTo={[1.18, 0.45, 0.55]}
        labels={[
          { x: 0.348, y: 0.566, text: "celiac trunk", t: 32.25, hot: true, ox: 70, oy: 170 },
          { x: 0.395, y: 0.472, text: "left gastric", t: 32.55, ox: 140, oy: -210 },
          { x: 0.245, y: 0.562, text: "common hepatic", t: 32.85, ox: 10, oy: -150 },
          { x: 0.60, y: 0.626, text: "splenic", t: 33.15, ox: 60, oy: 120 },
        ]} />
      <div style={{ position: "absolute", left: 0, width: 860, top: 864, display: "flex", justifyContent: "center", ...pop(t, 33.45) }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 22px 11px", fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.forest, whiteSpace: "nowrap" }}>
          <span style={{ color: C.matcha }}>1918 atlas name:</span> “Lienal” = splenic
        </div>
      </div>
    </Scene>
  );
};

/* 7. Quick test */
export const V7: React.FC = () => {
  const t = useT();
  const c0 = 36.85;
  const n = t < c0 ? null : t < c0 + 0.5 ? 3 : t < c0 + 1.0 ? 2 : t < c0 + 1.5 ? 1 : null;
  return (
    <Scene start={34.68} end={38.36}>
      <div style={{ position: "absolute", left: 10, top: 20, width: 840, height: 880, borderRadius: 48, background: C.forest, ...pop(t, 34.72, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 56, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 50, width: 740, top: 150, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 70, lineHeight: 1.12, color: C.paper, ...pop(t, 35.34) }}>
          Which branch is the <span style={{ color: C.banana }}>smallest</span>?
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 420, display: "flex", justifyContent: "center", gap: 26 }}>
          {LORDER.map((b, i) => (
            <div key={b} style={{ ...pop(t, 36.0 + i * 0.15), display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <Letter b={b} size={70} style={{ border: `5px solid ${C.paper}` }} />
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.paper, opacity: 0.85, whiteSpace: "nowrap" }}>{LART[b].toLowerCase()}</div>
            </div>
          ))}
        </div>
        {n && (
          <div style={{ position: "absolute", left: 0, width: 840, top: 640, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 150, color: C.banana, lineHeight: 1, transform: `scale(${1.3 - 0.3 * ramp(t, Math.floor((t - c0) / 0.5) * 0.5 + c0, Math.floor((t - c0) / 0.5) * 0.5 + c0 + 0.15)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 8. Answer: left gastric (smallest), splenic (biggest) */
export const V8: React.FC = () => {
  const t = useT();
  const toS = ramp(t, 39.5, 39.8);
  const lit: Partial<Record<Part, number>> = { LG: 38.4, CT: 38.4, SP: 39.55 };
  const bar = (w: number, col: string, label: string, t0: number, top: number, hot?: boolean) => {
    const p = ramp(t, t0, t0 + 0.45);
    return (
      <div style={{ position: "absolute", left: 40, top, display: "flex", alignItems: "center", gap: 18, opacity: Math.min(1, p * 2) }}>
        <div style={{ width: 280, fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.forest, textAlign: "right", whiteSpace: "nowrap" }}>{label}</div>
        <div style={{ width: w * p, height: 34, borderRadius: 17, background: col, border: `4px solid ${C.forest}`, boxShadow: hot ? `0 0 0 6px ${C.banana}` : "none" }} />
      </div>
    );
  };
  return (
    <Scene start={38.36} end={41.2} push={0.012}>
      <div style={{ position: "absolute", left: 0, top: 50, ...pop(t, 38.4, 0.25) }}>
        <Pill size={52} bg={C.matcha}>LEFT GASTRIC ✓</Pill>
      </div>
      <div style={{ position: "absolute", left: 175, top: 140 }}>
        <CeliacDiagram t={t} w={510} lit={lit} glow={toS > 0.5 ? ["SP"] : ["LG"]} dim={0.6} hideDia />
      </div>
      {bar(110, "#E8B9AE", "left gastric", 38.6, 718, toS < 0.5)}
      {bar(240, "#E8B9AE", "common hepatic", 38.75, 778)}
      {bar(440, "#D8574B", "splenic", 39.6, 838, toS >= 0.5)}
    </Scene>
  );
};

/* 9. Save */
export const V9: React.FC = () => {
  const t = useT();
  const b = ramp(t, 41.25, 41.6);
  return (
    <Scene start={41.2} end={43.38}>
      <div style={center(30, pop(t, 41.25))}>
        <svg width={200} height={260} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={center(330, pop(t, 41.3))}>
        <Big size={120}>SAVE THIS</Big>
      </div>
      <div style={center(480, pop(t, 41.95))}>
        <Big size={58} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ ...center(610), gap: 18, ...pop(t, 42.4) }}>
        {LORDER.map((b2) => <Letter key={b2} b={b2} size={70} />)}
      </div>
      <div style={center(760, pop(t, 42.6))}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest, whiteSpace: "nowrap" }}>
          <span style={{ color: C.matcha }}>L</span>eft gastric · <span style={{ color: C.matcha }}>H</span>epatic · <span style={{ color: C.matcha }}>S</span>plenic
        </div>
      </div>
    </Scene>
  );
};

/* 10. End card */
export const V10: React.FC = () => {
  const t = useT();
  return (
    <Scene start={43.38} end={47.6}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, 43.42, 0.35) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.banana, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 44.4, 44.75) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 43.4) * 5))})`, opacity: ramp(t, 43.6, 43.85) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
