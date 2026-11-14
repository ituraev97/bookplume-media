import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { ANCHOR, AxillaDiagram, BCOL, Part } from "./Axilla63";

export const ASP = 1680 / 1545;
export const liveAlpha = (_t: number) => 0;

const pop = (t: number, t0: number, d = 0.3) => {
  const p = ramp(t, t0, t0 + d);
  return { opacity: p, transform: `scale(${0.6 + 0.4 * p + 0.08 * Math.sin(Math.min(1, p) * Math.PI)})` } as React.CSSProperties;
};
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });
const Big: React.FC<{ size?: number; children: React.ReactNode; color?: string }> = ({ size = 110, children, color = C.forest }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1, letterSpacing: -2, textAlign: "center", whiteSpace: "nowrap" }}>{children}</div>
);

/* the 6 branches in mnemonic order */
export type B = "ST" | "TA" | "LT" | "SS" | "ACH" | "PCH";
export const BRS: { b: B; word: string; name: string; part: 1 | 2 | 3 }[] = [
  { b: "ST", word: "Screw", name: "Superior thoracic", part: 1 },
  { b: "TA", word: "The", name: "Thoracoacromial", part: 2 },
  { b: "LT", word: "Lawyer", name: "Lateral thoracic", part: 2 },
  { b: "SS", word: "Save", name: "Subscapular", part: 3 },
  { b: "ACH", word: "A", name: "Anterior circumflex humeral", part: 3 },
  { b: "PCH", word: "Patient", name: "Posterior circumflex humeral", part: 3 },
];
export const PCOL: Record<number, string> = { 1: "#E58B7F", 2: "#E8A44E", 3: "#B59AD8" };

/** letter chip: S / T / L ... in the branch colour */
export const LChip: React.FC<{ b: B; on?: number; size?: number; hot?: boolean }> = ({ b, on = 1, size = 54, hot }) => {
  const r = BRS.find((x) => x.b === b)!;
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.3, background: on > 0.5 ? BCOL[b] : "rgba(31,42,20,0.08)", border: `4px solid ${on > 0.5 ? C.forest : "rgba(31,42,20,0.25)"}`, color: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.62, transform: `scale(${hot ? 1.14 : 1})`, boxShadow: hot ? `0 0 0 6px ${C.banana}` : "none", opacity: 0.45 + 0.55 * on }}>
      {r.word[0]}
    </div>
  );
};

/* 1. Hook: Gray's 1918 Fig. 523 visible from frame 0 + challenge */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={2.85} push={0.02}>
      <div style={center(22, pop(t, -0.4, 0.25))}>
        <Big size={112}>NAME ALL 6</Big>
      </div>
      <div style={center(136, pop(t, -0.3, 0.25))}>
        <Big size={76} color={C.red}>IN 5 SECONDS?</Big>
      </div>
      <Plate src="plates/axillary.png" aspect={ASP} x={70} y={238} w={720} a={-0.6} b={2.85} zoomFrom={[1.05, 0.45, 0.4]} zoomTo={[1.3, 0.45, 0.35]}
        labels={[{ x: 0.42, y: 0.345, text: "axillary artery", t: 1.75, hot: true, ox: 40, oy: 120 }]} />
      <div style={center(890, pop(t, 0.15, 0.25))}>
        <Pill size={36} bg={C.forest}>axillary artery branches · mnemonic</Pill>
      </div>
      <Stamp t0={0.95} text="6 BRANCHES" size={44} rot={-8} color={C.red} style={{ left: 500, top: 262, whiteSpace: "nowrap" }} />
    </Scene>
  );
};

/* 2. The mnemonic card */
const MW: [string, number][] = [["Screw", 2.92], ["The", 3.12], ["Lawyer,", 3.18], ["Save", 3.59], ["A", 3.78], ["Patient.", 3.81]];
export const V2: React.FC = () => {
  const t = useT();
  return (
    <Scene start={2.85} end={4.45} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 820, height: 820, borderRadius: 48, background: C.forest, ...pop(t, 2.86, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 8, color: C.banana }}>THE MNEMONIC</div>
        <div style={{ position: "absolute", left: 70, top: 120, display: "flex", flexDirection: "column", gap: 2 }}>
          {MW.map(([w, s], i) => (
            <div key={i} style={{ display: "flex", alignItems: "baseline", ...pop(t, s - 0.08, 0.2), transformOrigin: "0 50%" }}>
              <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 104, lineHeight: 1.0, color: C.forest, background: BCOL[BRS[i].b], borderRadius: 18, padding: "0 14px 6px", marginRight: 6 }}>{w[0]}</span>
              <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 92, lineHeight: 1.0, color: C.paper }}>{w.slice(1)}</span>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", right: 46, top: 575, ...pop(t, 4.0, 0.25) }}>
          <Pill size={34} bg={C.banana} color={C.forest}>6 letters = 6 branches</Pill>
        </div>
      </div>
    </Scene>
  );
};

/* 3. Our diagram: pectoralis minor splits the artery into 3 parts (1-2-3) */
const PT3: { p: 1 | 2 | 3; a: [number, number]; t: number; badge: [number, number]; chip: [number, number] }[] = [
  { p: 1, a: ANCHOR.P1, t: 7.25, badge: [-80, -36], chip: [70, 50] },
  { p: 2, a: ANCHOR.P2, t: 7.51, badge: [-60, -110], chip: [100, 40] },
  { p: 3, a: ANCHOR.P3, t: 7.87, badge: [-120, -100], chip: [60, 60] },
];
const DIA = { x: 0, y: 30, w: 860 };
const dx = (x: number) => DIA.x + (x * DIA.w) / 860;
const dy = (y: number) => DIA.y + (y * DIA.w) / 860;

export const V3: React.FC = () => {
  const t = useT();
  return (
    <Scene start={4.45} end={8.85} push={0.01}>
      <div style={{ position: "absolute", left: DIA.x, top: DIA.y }}>
        <AxillaDiagram t={t} w={DIA.w} grow={4.45} ghost={0.0} lit={{ PM: 4.56, R1: 5.6, TM: 5.75, P1: 7.25, P2: 7.51, P3: 7.87 }} glow={["PM"]} parts={1} id="v3" />
      </div>
      {/* labels */}
      <div style={{ position: "absolute", left: dx(560), top: dy(640), ...pop(t, 4.75, 0.25), transformOrigin: "0 50%" }}>
        <Pill size={32} bg={C.banana} color={C.forest}>pectoralis minor</Pill>
      </div>
      <div style={{ position: "absolute", left: dx(440), top: dy(112), ...pop(t, 5.6, 0.22), transformOrigin: "100% 50%" }}>
        <Pill size={28} bg={C.forest}>starts at the 1st rib →</Pill>
      </div>
      <div style={{ position: "absolute", left: dx(20), top: dy(700), ...pop(t, 5.8, 0.22), transformOrigin: "0 50%" }}>
        <Pill size={28} bg={C.forest}>ends: teres major</Pill>
      </div>
      {/* part badges */}
      {PT3.map((p) => {
        const x = dx(p.a[0] + p.badge[0]), y = dy(p.a[1] + p.badge[1]);
        const shown = ramp(t, 6.18 + (p.p - 1) * 0.12, 6.4 + (p.p - 1) * 0.12);
        return (
          <React.Fragment key={p.p}>
            <div style={{ position: "absolute", left: x - 42, top: y - 42, width: 84, height: 84, borderRadius: 42, background: PCOL[p.p], border: `5px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 50, color: C.forest, opacity: shown, transform: `scale(${(0.6 + 0.4 * shown) * (t > p.t && t < p.t + 0.4 ? 1.15 : 1)})` }}>{p.p}</div>
            <div style={{ position: "absolute", left: dx(p.a[0] + p.chip[0]), top: dy(p.a[1] + p.chip[1]), ...pop(t, p.t, 0.22), transformOrigin: "0 50%" }}>
              <Pill size={30} bg={C.forest}>{p.p} {p.p === 1 ? "branch" : "branches"}</Pill>
            </div>
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: 0, width: 860, top: 874, display: "flex", justifyContent: "center", gap: 14 }}>
        {[1, 2, 3].map((n, i) => (
          <div key={n} style={pop(t, 7.25 + [0, 0.26, 0.62][i], 0.2)}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest, background: PCOL[n], border: `4px solid ${C.forest}`, borderRadius: 18, padding: "4px 22px 8px" }}>part {n}: {n}</div>
          </div>
        ))}
      </div>
    </Scene>
  );
};

/* 4. Part one on Gray's 1918 plate + the 1918 name */
export const V4: React.FC = () => {
  const t = useT();
  return (
    <Scene start={8.85} end={10.78} push={0.01}>
      <div style={{ position: "absolute", left: 0, width: 860, top: 22, display: "flex", justifyContent: "center", gap: 16, alignItems: "center", ...pop(t, 8.9, 0.25) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest, background: PCOL[1], border: `4px solid ${C.forest}`, borderRadius: 18, padding: "4px 22px 8px" }}>PART 1</div>
        <LChip b="ST" size={66} hot={t > 9.5} />
        <Big size={50}>superior thoracic</Big>
      </div>
      <Plate src="plates/axillary.png" aspect={ASP} x={20} y={118} w={820} a={8.85} b={10.78} zoomFrom={[1.5, 0.55, 0.3]} zoomTo={[1.75, 0.56, 0.3]}
        labels={[
          { x: 0.47, y: 0.31, text: "axillary artery", t: 8.95, ox: -40, oy: 150 },
          { x: 0.585, y: 0.29, text: "superior thoracic", t: 9.5, hot: true, ox: 20, oy: 130 },
        ]} />
      <div style={{ position: "absolute", left: 360, top: 690, ...pop(t, 10.05, 0.25) }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "12px 20px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.forest, lineHeight: 1.2, boxShadow: "0 6px 0 rgba(31,42,20,0.08)" }}>
          <span style={{ color: C.matcha }}>1918 atlas name:</span>
          <br />“highest thoracic”
        </div>
      </div>
    </Scene>
  );
};

/* 5. Our diagram: parts 2 and 3, each branch lights up as it's named */
const NT: Record<B, number> = { ST: 0, TA: 11.49, LT: 12.51, SS: 14.48, ACH: 16.11, PCH: 16.85 };
const LBL: Record<B, { at: [number, number]; off: [number, number]; side: "l" | "r"; text: string }> = {
  ST: { at: ANCHOR.ST, off: [-40, -80], side: "l", text: "superior thoracic" },
  TA: { at: ANCHOR.TA, off: [-80, -40], side: "l", text: "thoracoacromial" },
  LT: { at: ANCHOR.LT, off: [50, -60], side: "r", text: "lateral thoracic" },
  SS: { at: ANCHOR.SS, off: [60, 120], side: "r", text: "subscapular" },
  ACH: { at: ANCHOR.ACH, off: [10, 90], side: "r", text: "ant. circumflex humeral" },
  PCH: { at: ANCHOR.PCH, off: [10, -110], side: "r", text: "post. circumflex humeral" },
};
export const V5: React.FC = () => {
  const t = useT();
  let cur: B | null = null;
  (["TA", "LT", "SS", "ACH", "PCH"] as B[]).forEach((b) => {
    if (t >= NT[b] - 0.05) cur = b;
  });
  const lit: Partial<Record<Part, number>> = { ST: 10.6, P1: 10.6, P2: 11.06, P3: 13.83, PM: 10.6 };
  (["TA", "LT", "SS", "ACH", "PCH"] as B[]).forEach((b) => (lit[b as Part] = NT[b]));
  const k = ramp(t, 13.4, 14.2); // camera slides from part 2 to part 3
  const s = 1.12;
  const fx = 0.6 - 0.3 * k, fy = 0.36 + 0.24 * k;
  const W = 860 * s;
  const ox = 430 - fx * W, oy = 470 - fy * W;
  const cl = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
  const X0 = cl(ox, 860 - W, 0), Y0 = cl(oy, 900 - W, 60);
  const px = (p: [number, number]) => [X0 + p[0] * s, Y0 + p[1] * s];
  return (
    <Scene start={10.78} end={18.6} push={0.004}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 860, height: 940, overflow: "hidden", borderRadius: 40 }}>
        <div style={{ position: "absolute", left: X0, top: Y0 }}>
          <AxillaDiagram t={t} w={W} ghost={0.3} lit={lit} glow={cur ? [cur as Part] : []} parts={0.7} flow={15.3} id="v5" />
        </div>
        {(["TA", "LT", "SS", "ACH", "PCH"] as B[]).map((b) => {
          const L = LBL[b];
          const tt = b === "ST" ? 10.8 : NT[b];
          const part3 = b === "SS" || b === "ACH" || b === "PCH";
          const p = ramp(t, tt - 0.05, tt + 0.25) * (part3 ? 1 : 1 - ramp(t, 13.4, 13.7));
          if (p <= 0) return null;
          const [x0, y0] = px(L.at);
          const x1 = x0 + L.off[0], y1 = y0 + L.off[1];
          const hot = cur === b;
          return (
            <React.Fragment key={b}>
              <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: p }}>
                <line x1={x0} y1={y0} x2={x0 + (x1 - x0) * p} y2={y0 + (y1 - y0) * p} stroke={C.paper} strokeWidth={10} strokeLinecap="round" />
                <line x1={x0} y1={y0} x2={x0 + (x1 - x0) * p} y2={y0 + (y1 - y0) * p} stroke={C.forest} strokeWidth={5} strokeLinecap="round" />
                <circle cx={x0} cy={y0} r={10} fill={BCOL[b]} stroke={C.forest} strokeWidth={4} />
              </svg>
              <div style={{ position: "absolute", left: x1, top: y1, transform: `translate(${L.side === "l" ? "-100%" : "0"}, -50%) scale(${(0.85 + 0.15 * p) * (hot ? 1.06 : 1)})`, transformOrigin: L.side === "l" ? "100% 50%" : "0 50%", opacity: p }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, background: hot ? C.banana : C.forest, color: hot ? C.forest : C.paper, borderRadius: 16, padding: "6px 16px 9px 8px", fontFamily: FONT, fontWeight: 800, fontSize: 31, whiteSpace: "nowrap", boxShadow: "0 5px 0 rgba(31,42,20,0.18)" }}>
                  <LChip b={b} size={40} />
                  {L.text}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
      {/* part heading */}
      <div style={{ position: "absolute", left: 24, top: 20, ...pop(t, t < 13.83 ? 11.06 : 13.83, 0.25), transformOrigin: "0 0" }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest, background: PCOL[t < 13.83 ? 2 : 3], border: `4px solid ${C.forest}`, borderRadius: 18, padding: "4px 22px 8px" }}>PART {t < 13.83 ? 2 : 3}{t < 13.83 ? " · behind pec minor" : " · below pec minor"}</div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, opacity: 1 - ramp(t, 16.0, 16.25) }}><Stamp t0={15.32} text="BIGGEST" size={46} rot={-8} color={C.red} style={{ left: 580, top: 560 }} /></div>
      {/* S T L S A P tracker */}
      <div style={{ position: "absolute", left: 190, width: 480, top: 858, height: 86, borderRadius: 43, background: C.paper, boxShadow: `0 0 0 4px ${C.line}` }} />
      <div style={{ position: "absolute", left: 0, width: 860, top: 870, display: "flex", justifyContent: "center", gap: 14 }}>
        {BRS.map((r) => (
          <LChip key={r.b} b={r.b} size={62} on={t >= (r.b === "ST" ? 10.6 : NT[r.b]) - 0.05 ? 1 : 0} hot={cur === r.b} />
        ))}
      </div>
    </Scene>
  );
};

/* 6. Quick test */
export const V6: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[21.62, 3], [22.26, 2], [22.9, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => {
    if (t >= s - 0.05 && t < 23.45) { n = v; n0 = s; }
  });
  const opts = ["1st rib", "lower border of pec minor", "lower border of teres major"];
  return (
    <Scene start={18.6} end={23.45}>
      <div style={{ position: "absolute", left: 20, top: 55, width: 820, height: 830, borderRadius: 48, background: C.forest, ...pop(t, 18.65, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 56, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 130, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 60, lineHeight: 1.12, color: C.paper, ...pop(t, 19.3) }}>
          Where does it become the <span style={{ color: C.banana }}>BRACHIAL</span> artery?
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 395, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          {opts.map((o, i) => (
            <div key={o} style={{ ...pop(t, 20.0 + i * 0.18), display: "flex", alignItems: "center", gap: 18, width: 720 }}>
              <div style={{ width: 62, height: 62, flex: "0 0 62px", borderRadius: 18, background: C.banana, color: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, border: `4px solid ${C.paper}` }}>{"ABC"[i]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper, whiteSpace: "nowrap" }}>{o}</div>
            </div>
          ))}
        </div>
        {n !== null && (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 640, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 170, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 7. Answer: our diagram (teres major lower border lights) + Gray's plate */
export const V7: React.FC = () => {
  const t = useT();
  return (
    <Scene start={23.45} end={25.4} push={0.01}>
      <div style={{ position: "absolute", left: 0, width: 860, top: 0, display: "flex", justifyContent: "center", ...pop(t, 23.5, 0.25) }}>
        <Pill size={40} bg={C.matcha}>C ✓ lower border of teres major</Pill>
      </div>
      <Plate src="plates/axillary.png" aspect={ASP} x={20} y={100} w={820} a={23.45} b={25.4} zoomFrom={[1.45, 0.22, 0.6]} zoomTo={[1.65, 0.22, 0.62]}
        labels={[
          { x: 0.315, y: 0.695, text: "teres major", t: 24.46, hot: true, ox: 60, oy: 120 },
          { x: 0.11, y: 0.62, text: "brachial artery", t: 24.0, ox: 30, oy: 150 },
          { x: 0.3, y: 0.47, text: "axillary artery", t: 23.6, ox: 40, oy: -90 },
        ]} />
    </Scene>
  );
};

/* 8. Save + cheat sheet */
export const V8: React.FC = () => {
  const t = useT();
  const b = ramp(t, 25.45, 25.8);
  return (
    <Scene start={25.4} end={27.6}>
      <div style={{ position: "absolute", left: 40, top: 0, ...pop(t, 25.45) }}>
        <svg width={110} height={140} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 170, top: 6, ...pop(t, 25.5) }}>
        <Big size={100}>SAVE THIS</Big>
      </div>
      <div style={{ position: "absolute", left: 172, top: 112, ...pop(t, 25.75) }}>
        <Big size={40} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ position: "absolute", left: 40, top: 205, display: "flex", flexDirection: "column", gap: 16 }}>
        {BRS.map((r, i) => (
          <div key={r.b} style={{ display: "flex", alignItems: "center", gap: 16, ...pop(t, 25.9 + i * 0.09, 0.22), transformOrigin: "0 50%" }}>
            <div style={{ width: 62, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.forest, background: PCOL[r.part], border: `3px solid ${C.forest}`, borderRadius: 12, textAlign: "center", padding: "2px 0 4px" }}>P{r.part}</div>
            <LChip b={r.b} size={70} />
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.forest, whiteSpace: "nowrap", lineHeight: 1.05 }}>{r.name}</div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, color: C.matcha, lineHeight: 1.1 }}>{r.word.replace(/[,.]/g, "")}</div>
            </div>
          </div>
        ))}
      </div>
    </Scene>
  );
};

/* 9. End card (≤ 1.5 s) */
export const V9: React.FC = () => {
  const t = useT();
  return (
    <Scene start={27.6} end={29.0}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, 27.62, 0.3) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.banana, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 27.75, 28.0) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 27.6) * 5))})`, opacity: ramp(t, 27.65, 27.85) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
