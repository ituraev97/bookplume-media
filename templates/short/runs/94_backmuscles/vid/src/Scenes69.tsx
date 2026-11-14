import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, PlateBox, pop } from "./Scenes67";
import { Cell, WBC, WCOL, WChip, Wk } from "./Cells69";

export const A454 = 1546 / 1048;
export const liveAlpha = (_t: number) => 0;
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* plate positions (fractions of wbc454.png) */
export const PP = { H: [0.21, 0.19], L: [0.71, 0.21], P: [0.52, 0.45], E: [0.82, 0.66], P2: [0.12, 0.71], P3: [0.46, 0.82] };

/* 1. Hook: Gray's 1918 Fig. 454 visible from frame 0 + challenge */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={3.3} push={0.02}>
      <div style={center(4, pop(t, -0.4, 0.25))}>
        <Big size={128}>RANK ALL 5</Big>
      </div>
      <div style={center(134, pop(t, -0.3, 0.25))}>
        <Big size={80} color={C.red}>WHITE BLOOD CELLS</Big>
      </div>
      <PlateBox src="plates/wbc454.png" aspect={A454} x={30} y={240} w={800} h={630} a={-0.6} b={3.3} from={[0.5, 0.5, 1.0]} to={[0.5, 0.47, 0.82]}
        labels={[
          { x: 0.5, y: 0.37, text: "white blood cell", t: 1.15, hot: true, ox: 90, oy: -70 },
        ]} />
      <div style={center(892, pop(t, 0.15, 0.25))}>
        <Pill size={34} bg={C.forest}>white blood cells · mnemonic</Pill>
      </div>
      <Stamp t0={2.2} text="MOST → LEAST" size={42} rot={-7} color={C.red} style={{ left: 60, top: 690, whiteSpace: "nowrap" }} />
    </Scene>
  );
};

/* 2. Mnemonic card: Never Let Monkeys Eat Bananas */
const MW: [string, number][] = [["Never", 3.42], ["Let", 3.63], ["Monkeys", 3.82], ["Eat", 4.29], ["Bananas", 4.44]];
export const V2: React.FC = () => {
  const t = useT();
  return (
    <Scene start={3.3} end={5.15} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 820, height: 840, borderRadius: 48, background: C.forest, ...pop(t, 3.32, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 8, color: C.banana }}>THE MNEMONIC</div>
        <div style={{ position: "absolute", left: 70, top: 120, display: "flex", flexDirection: "column", gap: 4 }}>
          {MW.map(([w, s], i) => {
            const k = WBC[i].k;
            return (
              <div key={w} style={{ display: "flex", alignItems: "center", gap: 22, ...pop(t, s - 0.05, 0.2), transformOrigin: "0 50%" }}>
                <div style={{ width: 110, height: 110, flex: "0 0 110px" }}>
                  <Cell kind={k} size={110} id={`m${i}`} spin={i * 40 + t * 12} />
                </div>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 96, lineHeight: 1.1, color: C.paper, whiteSpace: "nowrap" }}>
                  <span style={{ background: WCOL[k], color: C.forest, borderRadius: 18, padding: "0 12px 6px", marginRight: 4 }}>{w[0]}</span>
                  {w.slice(1)}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 770, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.banana, opacity: ramp(t, 4.6, 4.8) }}>5 words = 5 cells, most → least</div>
      </div>
    </Scene>
  );
};

/* 3. Ranking: hero cell + bar list, each lights up as it's named */
const NT: Record<Wk, number> = { N: 5.3, L: 8.11, M: 9.99, E: 11.55, B: 14.08 };
const JT: Record<Wk, number> = { N: 6.72, L: 8.85, M: 10.7, E: 12.62, B: 15.34 };
export const V3: React.FC = () => {
  const t = useT();
  let cur: Wk = "N";
  WBC.forEach((w) => { if (t >= NT[w.k] - 0.05) cur = w.k; });
  const ci = WBC.findIndex((w) => w.k === cur);
  const info = WBC[ci];
  const sw = ramp(t, NT[cur] - 0.05, NT[cur] + 0.3);
  return (
    <Scene start={5.15} end={16.3} push={0.004}>
      {/* hero card */}
      <div style={{ position: "absolute", left: 20, top: 0, width: 820, height: 400, borderRadius: 44, background: C.card, boxShadow: `0 0 0 5px ${C.line}, 0 18px 40px rgba(31,42,20,0.14)`, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 400, height: 400, background: `radial-gradient(circle at 50% 50%, ${WCOL[cur]}66 0%, rgba(255,254,246,0) 70%)` }} />
        <div key={cur} style={{ position: "absolute", left: 30, top: 30, width: 340, height: 340, transform: `scale(${0.55 + 0.45 * sw}) rotate(${(1 - sw) * -40}deg)`, opacity: sw }}>
          <Cell kind={cur} size={340} id="hero" spin={t * 9} />
        </div>
        <div style={{ position: "absolute", left: 390, top: 46, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.matcha, letterSpacing: 3 }}>#{ci + 1} · {info.pct} of WBCs</div>
        <div key={`n${cur}`} style={{ position: "absolute", left: 386, top: 96, fontFamily: FONT, fontWeight: 800, fontSize: 60, color: C.forest, letterSpacing: -2, whiteSpace: "nowrap", ...pop(t, NT[cur] - 0.05, 0.22), transformOrigin: "0 50%" }}>
          <span style={{ background: WCOL[cur], borderRadius: 14, padding: "0 8px 4px" }}>{info.plural[0]}</span>
          {info.plural.slice(1)}
        </div>
        <div key={`j${cur}`} style={{ position: "absolute", left: 390, top: 200, ...pop(t, JT[cur] - 0.05, 0.22), transformOrigin: "0 50%" }}>
          <div style={{ background: C.forest, color: C.paper, borderRadius: 18, padding: "10px 20px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 36, whiteSpace: "nowrap" }}>{info.job}</div>
        </div>
        <div style={{ position: "absolute", left: 390, top: 300, fontFamily: FONT, fontWeight: 800, fontSize: 28, color: info.group === "granulocyte" ? C.red : C.matcha, opacity: ramp(t, JT[cur], JT[cur] + 0.3) }}>
          {info.group === "granulocyte" ? "● granulocyte (granules)" : "○ agranulocyte (no granules)"}
        </div>
      </div>
      {/* ranked bar list */}
      <div style={{ position: "absolute", left: 20, top: 432, width: 820, display: "flex", flexDirection: "column", gap: 14 }}>
        {WBC.map((w, i) => {
          const p = ramp(t, NT[w.k] - 0.05, NT[w.k] + 0.3);
          const hot = cur === w.k;
          const bw = 40 + (w.mid / 60) * 300;
          return (
            <div key={w.k} style={{ display: "flex", alignItems: "center", gap: 14, height: 80, opacity: 0.25 + 0.75 * p, transform: `scale(${hot ? 1.03 : 1})`, transformOrigin: "0 50%" }}>
              <div style={{ width: 52, fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest, textAlign: "right" }}>{i + 1}</div>
              <div style={{ width: 80, height: 80, flex: "0 0 80px" }}>{p > 0 ? <Cell kind={w.k} size={80} id={`r${i}`} spin={i * 50} /> : <div style={{ width: 70, height: 70, margin: 5, borderRadius: 35, border: `4px dashed ${C.line}` }} />}</div>
              <div style={{ width: 290, fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest, whiteSpace: "nowrap" }}>{p > 0 ? w.name : "?"}</div>
              <div style={{ position: "relative", width: bw * p, height: 44, borderRadius: 14, background: WCOL[w.k], border: p > 0 ? `4px solid ${C.forest}` : "none", boxShadow: hot ? `0 0 0 5px ${C.banana}` : "none" }} />
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.forest, opacity: p, whiteSpace: "nowrap" }}>{w.pct}</div>
            </div>
          );
        })}
      </div>
      <Stamp t0={14.75} text="RAREST" size={44} rot={-8} color={C.red} style={{ left: 560, top: 330, whiteSpace: "nowrap" }} />
    </Scene>
  );
};

/* 4. Quick test */
export const V4: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[20.11, 3], [20.74, 2], [21.38, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < 22.0) { n = v; n0 = s; } });
  const opts: Wk[] = ["N", "M", "B"];
  return (
    <Scene start={16.3} end={22.0}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 820, height: 850, borderRadius: 48, background: C.forest, ...pop(t, 16.35, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 50, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 122, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 56, lineHeight: 1.12, color: C.paper, ...pop(t, 17.3) }}>
          Which one leaves the blood and becomes a <span style={{ color: C.banana }}>MACROPHAGE?</span>
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 340, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          {opts.map((k, i) => (
            <div key={k} style={{ ...pop(t, 18.0 + i * 0.18), display: "flex", alignItems: "center", gap: 18, width: 560 }}>
              <div style={{ width: 62, height: 62, flex: "0 0 62px", borderRadius: 18, background: C.banana, color: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, border: `4px solid ${C.paper}` }}>{"ABC"[i]}</div>
              <div style={{ width: 92, height: 92, flex: "0 0 92px" }}><Cell kind={k} size={92} id={`q${i}`} outline={false} spin={t * 15 + i * 60} /></div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper, whiteSpace: "nowrap" }}>{WBC.find((w) => w.k === k)!.name.toLowerCase()}</div>
            </div>
          ))}
        </div>
        {n !== null && (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 680, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 150, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 5. Answer on Gray's plate with modern labels + 1918 name */
export const V5: React.FC = () => {
  const t = useT();
  return (
    <Scene start={22.0} end={23.3} push={0.01}>
      <div style={{ position: "absolute", left: 0, width: 860, top: 0, display: "flex", justifyContent: "center", ...pop(t, 22.05, 0.25) }}>
        <Pill size={42} bg={C.matcha}>B ✓ monocyte → macrophage</Pill>
      </div>
      <PlateBox src="plates/wbc454.png" aspect={A454} x={30} y={100} w={800} h={700} a={22.0} b={23.3} from={[0.5, 0.5, 1.0]} to={[0.5, 0.5, 0.98]}
        labels={[
          { x: 0.21, y: 0.06, text: "monocyte", t: 22.13, hot: true, ox: 10, oy: -55 },
          { x: 0.68, y: 0.07, text: "lymphocyte", t: 22.4, ox: 14, oy: -58 },
          { x: 0.46, y: 0.97, text: "neutrophil", t: 22.55, ox: -30, oy: 55 },
          { x: 0.82, y: 0.85, text: "eosinophil", t: 22.7, ox: -10, oy: 95 },
        ]} />
      <div style={{ position: "absolute", left: 30, top: 820, ...pop(t, 22.3, 0.22), transformOrigin: "0 0" }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "10px 18px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.forest, whiteSpace: "nowrap", boxShadow: "0 6px 0 rgba(31,42,20,0.08)" }}>
          <span style={{ color: C.matcha }}>1918 atlas name:</span> “hyaline cell” (H)
        </div>
      </div>
    </Scene>
  );
};

/* 6. Save + cheat sheet */
export const V6: React.FC = () => {
  const t = useT();
  const b = ramp(t, 23.35, 23.7);
  return (
    <Scene start={23.3} end={25.1}>
      <div style={{ position: "absolute", left: 40, top: 0, ...pop(t, 23.35) }}>
        <svg width={110} height={140} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 170, top: 6, ...pop(t, 23.4) }}>
        <Big size={100}>SAVE THIS</Big>
      </div>
      <div style={{ position: "absolute", left: 172, top: 112, ...pop(t, 23.6) }}>
        <Big size={40} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ position: "absolute", left: 30, top: 205, display: "flex", flexDirection: "column", gap: 16 }}>
        {WBC.map((r, i) => (
          <div key={r.k} style={{ display: "flex", alignItems: "center", gap: 14, ...pop(t, 23.7 + i * 0.08, 0.22), transformOrigin: "0 50%" }}>
            <WChip k={r.k} size={66} />
            <div style={{ width: 92, height: 92, flex: "0 0 92px" }}><Cell kind={r.k} size={92} id={`s${i}`} /></div>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest, whiteSpace: "nowrap", lineHeight: 1.05 }}>{r.name} <span style={{ color: C.matcha, fontSize: 32 }}>{r.pct}</span></div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, color: r.group === "granulocyte" ? C.redDark : C.matchaDark, lineHeight: 1.2, whiteSpace: "nowrap" }}>{r.job} · {r.group}</div>
            </div>
          </div>
        ))}
      </div>
    </Scene>
  );
};

/* 7. End card (≤ 1.5 s) */
export const V7: React.FC = () => {
  const t = useT();
  return (
    <Scene start={25.1} end={26.3}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, 25.12, 0.3) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.banana, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 25.2, 25.45) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 25.1) * 5))})`, opacity: ramp(t, 25.15, 25.35) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
