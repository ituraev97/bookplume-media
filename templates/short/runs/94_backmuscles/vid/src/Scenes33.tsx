import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { Spine, Clock, Reg, TINT } from "./Spine33";

const SP_ASPECT = 984 / 3230;
const TOP_ASPECT = 709 / 830;
const LUM_ASPECT = 1625 / 833;

const pop = (t: number, t0: number, d = 0.3) => {
  const p = ramp(t, t0, t0 + d);
  return { opacity: p, transform: `scale(${0.6 + 0.4 * p + 0.08 * Math.sin(Math.min(1, p) * Math.PI)})` } as React.CSSProperties;
};
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });
const Big: React.FC<{ size?: number; children: React.ReactNode; color?: string; align?: "center" | "left" }> = ({ size = 110, children, color = C.forest, align = "center" }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1, letterSpacing: -2, textAlign: align }}>{children}</div>
);
export const liveAlpha = (_t: number) => 0;

/** leader line from a point (scene px) to a label */
const Lead: React.FC<{ t0: number; x: number; y: number; lx: number; ly: number; text: string; hot?: boolean; size?: number }> = ({ t0, x, y, lx, ly, text, hot, size = 34 }) => {
  const t = useT();
  const p = ramp(t, t0 - 0.1, t0 + 0.3);
  if (p <= 0) return null;
  const ex = x + (lx - x) * p, ey = y + (ly - y) * p;
  return (
    <>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={860} height={940}>
        <line x1={x} y1={y} x2={ex} y2={ey} stroke={C.paper} strokeWidth={10} strokeLinecap="round" />
        <line x1={x} y1={y} x2={ex} y2={ey} stroke={C.forest} strokeWidth={4} strokeLinecap="round" />
        <circle cx={x} cy={y} r={11} fill={hot ? C.red : C.forest} stroke={C.paper} strokeWidth={4} />
      </svg>
      <div style={{ position: "absolute", left: lx, top: ly, transform: `translate(0,-50%) scale(${0.8 + 0.2 * p})`, transformOrigin: "0% 50%", opacity: p, background: hot ? C.banana : C.forest, color: hot ? C.forest : C.paper, fontFamily: FONT, fontWeight: 800, fontSize: size, padding: "6px 18px 9px", borderRadius: 14, whiteSpace: "nowrap", boxShadow: "0 6px 0 rgba(31,42,20,0.15)" }}>
        {text}
      </div>
    </>
  );
};

/* 1. Hook: the 1918 column, a scan line runs down it */
export const V1: React.FC = () => {
  const t = useT();
  const scan = ramp(t, 0.4, 2.3);
  const words: [string, number, string][] = [["HOW", 0.0, C.forest], ["MANY", 0.09, C.forest], ["IN EACH", 1.17, C.matcha], ["REGION?", 1.47, C.red]];
  return (
    <Scene start={-0.6} end={5.1} push={0.02}>
      <Plate src="plates/spine.png" aspect={SP_ASPECT} x={40} y={0} w={286} a={-0.6} b={5.1} zoomFrom={[1, 0.5, 0.5]} zoomTo={[1.06, 0.5, 0.4]} credit="" />
      {scan > 0 && scan < 1 && (
        <div style={{ position: "absolute", left: 30, top: scan * 920, width: 306, height: 10, borderRadius: 5, background: C.banana, boxShadow: `0 0 24px 8px ${C.banana}`, opacity: 0.85 }} />
      )}
      <div style={{ position: "absolute", left: 370, top: 60, width: 480 }}>
        {words.map(([w, wt, col], i) => (
          <div key={i} style={{ ...pop(t, wt, 0.25), transformOrigin: "0% 50%", marginBottom: 14 }}>
            <Big size={i < 2 ? 96 : 84} color={col} align="left">{w}</Big>
          </div>
        ))}
        <div style={{ ...pop(t, 0.51, 0.25), transformOrigin: "0% 50%", marginTop: 10 }}>
          <Pill size={40} bg={C.forest}>vertebrae</Pill>
        </div>
      </div>
      <div style={{ position: "absolute", left: 380, top: 560, display: "flex", gap: 14 }}>
        {["?", "?", "?"].map((q, i) => (
          <div key={i} style={{ ...pop(t, 1.9 + i * 0.12), width: 120, height: 120, borderRadius: 28, background: [C.redLight, C.matchaLight, C.banana][i], color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 80, display: "flex", alignItems: "center", justifyContent: "center", border: `4px solid ${C.forest}` }}>{q}</div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 370, top: 905, fontFamily: FONT, fontWeight: 700, fontSize: 18, color: C.forest, opacity: 0.55 }}>Gray's Anatomy, 1918 · public domain</div>
      <Stamp t0={2.9} text="THE TRICK" size={64} rot={-8} color={C.red} style={{ left: 420, top: 740 }} />
    </Scene>
  );
};

/* 2. The meal mnemonic */
const MEALS: [string, number, number, number, string][] = [
  ["Breakfast", 7, 5.27, 5.75, C.redLight],
  ["Lunch", 12, 6.3, 6.63, C.matchaLight],
  ["Dinner", 5, 7.13, 7.54, C.banana],
];
export const V2: React.FC = () => {
  const t = useT();
  return (
    <Scene start={5.1} end={8.3}>
      <div style={{ position: "absolute", left: 10, top: 30, width: 840, height: 850, borderRadius: 48, background: C.forest, ...pop(t, 5.12, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 56, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 6, color: C.matchaLight }}>THINK OF YOUR MEALS</div>
        {MEALS.map(([meal, n, t0, tn, col], i) => {
          const p = ramp(t, t0 - 0.05, t0 + 0.25);
          const pn = ramp(t, tn - 0.05, tn + 0.25);
          return (
            <div key={meal} style={{ position: "absolute", left: 50, top: 160 + i * 220, width: 740, height: 190, borderRadius: 30, background: "rgba(247,246,236,0.07)", border: `3px solid ${p > 0.5 ? col : "rgba(247,246,236,0.12)"}`, opacity: 0.2 + 0.8 * p, transform: `translateX(${(1 - p) * -40}px)`, display: "flex", alignItems: "center", padding: "0 30px", boxSizing: "border-box", gap: 30 }}>
              <Clock hour={n} size={128} p={pn} dark />
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 66, color: C.paper, letterSpacing: -1.5, flex: 1, whiteSpace: "nowrap" }}>
                <span style={{ color: col, fontSize: 84 }}>{meal[0]}</span>
                {meal.slice(1)}
              </div>
              <div style={{ width: 150, height: 130, borderRadius: 26, background: col, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 96, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.5 + 0.5 * pn + 0.12 * Math.sin(pn * Math.PI)})`, opacity: pn }}>{n}</div>
            </div>
          );
        })}
      </div>
    </Scene>
  );
};

/* 3. Our diagram: cervical, thoracic, lumbar light up */
const ROWS: [Reg, number, string, string, number, number][] = [
  ["C", 7, "CERVICAL", "neck", 8.47, 8.8],
  ["T", 12, "THORACIC", "chest", 10.59, 10.87],
  ["L", 5, "LUMBAR", "lower back", 14.5, 14.87],
];
export const V3: React.FC = () => {
  const t = useT();
  return (
    <Scene start={8.3} end={16.75} push={0.02}>
      <div style={{ position: "absolute", left: 40, top: 30 }}>
        <Spine t={t} h={880} lit={{ C: 8.8, T: 10.87, L: 14.87 }} ribs={12.75} brackets={{ C: 8.8, T: 10.87, L: 14.87 }} hideLower vb={[95, 10, 300, 975]} />
      </div>
      {ROWS.map(([g, n, name, where, t0, tl], i) => {
        const p = ramp(t, t0 - 0.05, t0 + 0.3);
        if (p <= 0) return null;
        const now = t < (ROWS[i + 1] ? ROWS[i + 1][4] : 99);
        const tops = [70, 330, 640];
        return (
          <div key={g} style={{ position: "absolute", left: 400, top: tops[i], width: 450, opacity: p * (now ? 1 : 0.75), transform: `translateX(${(1 - p) * 40}px) scale(${now ? 1 : 0.94})`, transformOrigin: "0% 50%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <Clock hour={n} size={96} p={ramp(t, t0, t0 + 0.4)} />
              <div style={{ width: 128, height: 112, borderRadius: 24, background: TINT[g][1], border: `4px solid ${C.forest}`, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</div>
            </div>
            <div style={{ marginTop: 12, fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.forest, letterSpacing: -1, opacity: ramp(t, tl, tl + 0.25) }}>{name}</div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: TINT[g][2] === C.bananaDark ? C.matchaDark : TINT[g][2], opacity: ramp(t, tl + 0.4, tl + 0.65) }}>{where}</div>
          </div>
        );
      })}
      {/* ribs note */}
      <div style={{ position: "absolute", left: 400, top: 580, ...pop(t, 12.75), opacity: ramp(t, 12.75, 13.05) * (1 - ramp(t, 14.4, 14.6)), transformOrigin: "0% 50%" }}>
        <Pill size={34} bg={C.matcha}>1 per pair of ribs</Pill>
      </div>
    </Scene>
  );
};

/* 4. Zoom lens: the 5 sacral vertebrae fuse into one bone */
export const V4: React.FC = () => {
  const t = useT();
  const s = 2.0;
  const H = 880 * s;
  const z = ramp(t, 16.75, 17.4);
  const ty = -(H * 0.53) * z; // move down the column into the lens
  return (
    <Scene start={16.75} end={21.0}>
      <div style={{ position: "absolute", left: 20, top: 20, width: 500, height: 880, borderRadius: 40, overflow: "hidden", background: C.card, boxShadow: `0 0 0 4px ${C.line}, 0 18px 40px rgba(31,42,20,0.14)` }}>
        <div style={{ position: "absolute", left: 30 - 40 * z, top: ty + 10, transform: `scale(${1 + (s - 1) * z})`, transformOrigin: "0 0" }}>
          <Spine t={t} h={880} lit={{ C: -9, T: -9, L: -9, S: 18.04, Co: 21.1 }} fuse={18.86} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 545, top: 70, width: 310 }}>
        <div style={pop(t, 17.69)}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 4, color: C.matcha }}>BELOW THEM</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 120, color: C.forest, lineHeight: 1 }}>5</div>
        </div>
        <div style={{ ...pop(t, 18.04), transformOrigin: "0% 50%", marginTop: 6 }}>
          <Pill size={40} bg={C.forest}>sacral</Pill>
        </div>
        <div style={{ marginTop: 40, fontFamily: FONT, fontWeight: 800, fontSize: 54, color: C.red, lineHeight: 1.05, ...pop(t, 18.86) }}>fuse →<br />1 bone</div>
        <div style={{ marginTop: 40, ...pop(t, 20.29), transformOrigin: "0% 50%" }}>
          <Pill size={46} bg={C.banana} color={C.forest}>SACRUM</Pill>
        </div>
      </div>
    </Scene>
  );
};

/* 5. The 1918 column again, with modern region brackets */
const BR: [string, string, number, number, number, string][] = [
  // label, sub, fy0, fy1, t, color
  ["CERVICAL", "7", 0.012, 0.225, 21.05, C.red],
  ["THORACIC", "12", 0.232, 0.622, 21.15, C.matcha],
  ["LUMBAR", "5", 0.63, 0.852, 21.25, C.bananaDark],
  ["SACRUM", "5 fused", 0.858, 0.95, 21.35, C.forest],
  ["COCCYX", "tailbone", 0.952, 0.995, 21.25, C.red],
];
export const V5: React.FC = () => {
  const t = useT();
  const px = 60, py = 6, pw = 270, ph = pw / SP_ASPECT;
  return (
    <Scene start={21.0} end={23.85} push={0.01}>
      <Plate src="plates/spine.png" aspect={SP_ASPECT} x={px} y={py} w={pw} a={21.0} b={23.85} zoomFrom={[1, 0.5, 0.5]} zoomTo={[1, 0.5, 0.5]} credit="" />
      {BR.map(([lab, sub, f0, f1, tt, col], i) => {
        const p = ramp(t, tt, tt + 0.3);
        if (p <= 0) return null;
        const y0 = py + f0 * ph, y1 = py + f1 * ph;
        const x = px + pw + 22;
        const hot = lab === "COCCYX";
        const ly = hot ? y1 + 6 : (y0 + y1) / 2;
        return (
          <React.Fragment key={lab}>
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={860} height={940}>
              <path d={`M${x - 12} ${y0} L${x} ${y0} L${x} ${y0 + (y1 - y0) * p} L${x - 12} ${y0 + (y1 - y0) * p}`} fill="none" stroke={col} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
              {hot && <line x1={x} y1={(y0 + y1) / 2} x2={x + 40} y2={ly} stroke={col} strokeWidth={5} strokeLinecap="round" opacity={p} />}
            </svg>
            <div style={{ position: "absolute", left: x + (hot ? 46 : 26), top: ly, transform: `translate(${(1 - p) * 30}px,-50%)`, opacity: p, display: "flex", alignItems: "baseline", gap: 12, whiteSpace: "nowrap" }}>
              <div style={{ background: hot ? C.banana : col === C.bananaDark ? C.banana : col, color: hot || col === C.bananaDark ? C.forest : C.paper, fontFamily: FONT, fontWeight: 800, fontSize: i === 4 ? 40 : 36, padding: "6px 16px 9px", borderRadius: 14 }}>{lab}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.forest, opacity: hot ? ramp(t, 21.83, 22.1) : 1 }}>{sub}</div>
            </div>
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: 380, top: 470, width: 470, borderRadius: 28, background: C.forest, padding: "18px 24px 22px", boxSizing: "border-box", ...pop(t, 22.57) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 24, letterSpacing: 4, color: C.matchaLight }}>THE WHOLE COLUMN</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.paper, marginTop: 4 }}>
          <span style={{ color: C.redLight }}>7</span> + <span style={{ color: C.matchaLight }}>12</span> + <span style={{ color: C.banana }}>5</span> + S + Co
        </div>
      </div>
      <div style={{ position: "absolute", left: px, top: py + ph + 4, fontFamily: FONT, fontWeight: 700, fontSize: 18, color: C.forest, opacity: 0.55 }}>Gray's Anatomy, 1918 · public domain</div>
    </Scene>
  );
};

/* 6. Bonus: atlas and axis on the 1918 neck */
export const V6: React.FC = () => {
  const t = useT();
  const px = 0, py = 130, pw = 560, ph = pw / TOP_ASPECT;
  const rot = ramp(t, 28.3, 29.1);
  return (
    <Scene start={23.85} end={29.4} push={0.015}>
      <div style={center(30, pop(t, 23.99))}>
        <Pill size={42} bg={C.banana} color={C.forest}>BONUS · THE TOP TWO</Pill>
      </div>
      <Plate src="plates/spine_top.png" aspect={TOP_ASPECT} x={px} y={py} w={pw} a={23.85} b={29.4} zoomFrom={[1, 0.5, 0.5]} zoomTo={[1, 0.5, 0.5]} credit="Gray's Anatomy, 1918 · public domain" />
      <Lead t0={26.14} x={px + 0.6 * pw} y={py + 0.12 * ph} lx={590} ly={py + 0.08 * ph} text="C1 · Atlas" hot />
      <Lead t0={27.85} x={px + 0.55 * pw} y={py + 0.255 * ph} lx={590} ly={py + 0.31 * ph} text="C2 · Axis" hot />
      <div style={{ position: "absolute", left: 590, top: py + 0.08 * ph + 40, width: 260, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.forest, lineHeight: 1.15, opacity: ramp(t, 26.49, 26.75) }}>holds up your skull</div>
      <div style={{ position: "absolute", left: 590, top: py + 0.31 * ph + 40, width: 260, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.forest, lineHeight: 1.15, opacity: ramp(t, 28.27, 28.5) }}>lets your head turn</div>
      {/* head icons */}
      <div style={{ position: "absolute", left: 580, top: 520, width: 280, height: 280, ...pop(t, 26.49) }}>
        <svg width={280} height={280} viewBox="0 0 280 280">
          <circle cx={140} cy={140} r={130} fill={C.card} stroke={C.line} strokeWidth={4} />
          <g transform={`translate(140 150) rotate(${Math.sin(rot * Math.PI * 2) * 22})`}>
            <ellipse cx={0} cy={-30} rx={62} ry={72} fill="#EFE6CC" stroke={C.forest} strokeWidth={6} />
            <circle cx={-20} cy={-36} r={8} fill={C.forest} />
            <circle cx={22} cy={-36} r={8} fill={C.forest} />
            <path d="M-18 -2 Q0 12 18 -2" stroke={C.forest} strokeWidth={6} fill="none" strokeLinecap="round" />
          </g>
          <rect x={122} y={190} width={36} height={60} rx={10} fill={C.banana} stroke={C.forest} strokeWidth={5} />
          {rot > 0 && (
            <g opacity={ramp(t, 28.3, 28.5)}>
              <path d="M60 70 Q140 20 220 70" fill="none" stroke={C.red} strokeWidth={8} strokeLinecap="round" />
              <path d="M210 52 L224 74 L198 78" fill="none" stroke={C.red} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          )}
        </svg>
      </div>
    </Scene>
  );
};

/* 7. Quick test */
export const V7: React.FC = () => {
  const t = useT();
  const T0 = 32.08;
  const n = t < T0 ? null : t < T0 + 0.5 ? 3 : t < T0 + 1.0 ? 2 : t < T0 + 1.5 ? 1 : null;
  const k = Math.floor((t - T0) / 0.5) * 0.5 + T0;
  return (
    <Scene start={29.4} end={33.55}>
      <div style={{ position: "absolute", left: 10, top: 40, width: 840, height: 840, borderRadius: 48, background: C.forest, ...pop(t, 29.45, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 70, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 40, width: 760, top: 160, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 82, lineHeight: 1.05, color: C.paper, ...pop(t, 30.43) }}>
          How many <span style={{ color: C.banana }}>lumbar</span> vertebrae?
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 480, display: "flex", justifyContent: "center", gap: 22 }}>
          {["4", "5", "7", "12"].map((x, i) => (
            <div key={x} style={{ ...pop(t, 31.0 + i * 0.1), width: 150, height: 130, background: C.matchaDark, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 72, borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>{x}</div>
          ))}
        </div>
        {n && (
          <div style={{ position: "absolute", left: 0, width: 840, top: 660, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 130, color: C.banana, lineHeight: 1, transform: `scale(${1.3 - 0.3 * ramp(t, k, k + 0.15)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 8. Answer: five — lumbar vertebra on the 1918 plate */
export const V8: React.FC = () => {
  const t = useT();
  const pw = 820, ph = pw / LUM_ASPECT;
  return (
    <Scene start={33.55} end={37.1} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 30, display: "flex", alignItems: "center", gap: 22, ...pop(t, 33.62) }}>
        <div style={{ width: 150, height: 150, borderRadius: 34, background: C.banana, border: `5px solid ${C.forest}`, fontFamily: FONT, fontWeight: 800, fontSize: 120, color: C.forest, display: "flex", alignItems: "center", justifyContent: "center" }}>5</div>
        <Big size={86} align="left">LUMBAR</Big>
      </div>
      <Plate src="plates/lumbar.png" aspect={LUM_ASPECT} x={20} y={220} w={pw} a={33.55} b={37.1} zoomFrom={[1, 0.5, 0.5]} zoomTo={[1, 0.5, 0.5]} credit="Gray's Anatomy, 1918 · public domain" />
      <Lead t0={34.87} x={20 + 0.8 * pw} y={220 + 0.66 * ph} lx={380} ly={220 + ph + 60} text="biggest bodies" hot size={38} />
      <div style={{ position: "absolute", left: 40, width: 780, top: 790, borderRadius: 32, background: C.card, border: `4px solid ${C.line}`, padding: "22px 30px", boxSizing: "border-box", fontFamily: FONT, ...pop(t, 35.5) }}>
        <div style={{ fontWeight: 800, fontSize: 28, letterSpacing: 4, color: C.matcha }}>WHY?</div>
        <div style={{ fontWeight: 800, fontSize: 52, color: C.forest, lineHeight: 1.1 }}>
          they carry the <span style={{ color: C.red }}>most weight</span>
        </div>
      </div>
    </Scene>
  );
};

/* 9. Save */
export const V9: React.FC = () => {
  const t = useT();
  const b = ramp(t, 37.2, 37.55);
  return (
    <Scene start={37.1} end={39.35}>
      <div style={center(30, pop(t, 37.15))}>
        <svg width={220} height={280} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={center(350, pop(t, 37.28))}>
        <Big size={120}>SAVE THIS</Big>
      </div>
      <div style={center(500, pop(t, 37.99))}>
        <Big size={58} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ ...center(640), gap: 18, ...pop(t, 38.4) }}>
        {MEALS.map(([meal, n, , , col]) => (
          <div key={meal} style={{ display: "flex", alignItems: "center", gap: 10, background: C.forest, borderRadius: 22, padding: "12px 20px 14px" }}>
            <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 46, color: col }}>{meal[0]}</span>
            <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper }}>{n}</span>
          </div>
        ))}
      </div>
    </Scene>
  );
};

/* 10. End card */
export const V10: React.FC = () => {
  const t = useT();
  const s = 39.35;
  return (
    <Scene start={s} end={43.4}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, s + 0.05, 0.35) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.banana, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 40.5, 40.8) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - s) * 5))})`, opacity: ramp(t, 39.55, 39.85) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
