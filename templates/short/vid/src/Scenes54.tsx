import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { Circ, BLUE, BLUE_D } from "./Circ54";

const A490 = 1694 / 1619;
const A504 = 1771 / 1452;
const pop = (t: number, t0: number, d = 0.3) => {
  const p = ramp(t, t0, t0 + d);
  return { opacity: p, transform: `scale(${0.6 + 0.4 * p + 0.08 * Math.sin(Math.min(1, p) * Math.PI)})` } as React.CSSProperties;
};
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });
const Big: React.FC<{ size?: number; children: React.ReactNode; color?: string }> = ({ size = 110, children, color = C.forest }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1, letterSpacing: -2, textAlign: "center" }}>{children}</div>
);
export const liveAlpha = (_t: number) => 0;

/* 1. Hook: the real 1918 plate, push in on the (blue) pulmonary trunk */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={4.1} push={0.02}>
      <div style={center(40, { ...pop(t, 0, 0.25), whiteSpace: "nowrap" })}>
        <Big size={60}>WHICH ARTERY CARRIES</Big>
      </div>
      <div style={center(112, { ...pop(t, 0.6, 0.25), whiteSpace: "nowrap" })}>
        <Big size={70} color={BLUE}>OXYGEN-POOR BLOOD?</Big>
      </div>
      <Plate src="plates/heart490.png" aspect={A490} x={100} y={215} w={660} a={-0.6} b={4.1} zoomFrom={[1, 0.5, 0.45]} zoomTo={[2.2, 0.53, 0.48]} />
      <div style={{ position: "absolute", left: 120, top: 640, ...pop(t, 2.55, 0.2) }}>
        <div style={{ background: C.card, border: `4px solid ${C.forest}`, borderRadius: 20, padding: "8px 26px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.forest, position: "relative" }}>
          "none"
          <div style={{ position: "absolute", left: 14, right: 14, top: "52%", height: 8, borderRadius: 4, background: C.red, transform: `scaleX(${ramp(t, 3.0, 3.25)})`, transformOrigin: "0 50%" }} />
        </div>
      </div>
      <Stamp t0={3.25} text="THINK AGAIN" size={54} rot={-8} color={C.red} style={{ left: 430, top: 660 }} />
    </Scene>
  );
};

/* 2–3. Two loops: pulmonary, then systemic — our own diagram lit word by word */
const Steps: React.FC<{ t: number; title: string; color: string; t0: number; steps: [string, number][] }> = ({ t, title, color, t0, steps }) => (
  <div style={{ position: "absolute", left: 0, width: 860, top: 770, opacity: ramp(t, t0 - 0.1, t0 + 0.2) }}>
    <div style={{ display: "flex", justifyContent: "center", marginBottom: 12, ...pop(t, t0) }}>
      <Pill size={34} bg={color}>{title}</Pill>
    </div>
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
      {steps.map(([s, st], i) => {
        const p = ramp(t, st - 0.05, st + 0.2);
        const now = t >= st && t < st + 0.7;
        return (
          <React.Fragment key={s}>
            {i > 0 && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.forest, opacity: 0.25 + 0.75 * p }}>→</div>}
            <div style={{ opacity: 0.3 + 0.7 * p, transform: `scale(${now ? 1.08 : 1})`, background: p > 0.5 ? (now ? C.banana : C.card) : C.line, color: C.forest, border: `3px solid ${p > 0.5 ? C.forest : C.line}`, fontFamily: FONT, fontWeight: 800, fontSize: 29, padding: "7px 14px 10px", borderRadius: 14, whiteSpace: "nowrap" }}>{s}</div>
          </React.Fragment>
        );
      })}
    </div>
  </div>
);

export const V2: React.FC = () => {
  const t = useT();
  return (
    <Scene start={4.1} end={12.05} push={0.02}>
      <div style={{ position: "absolute", left: 95, top: -20, transform: `translateY(${(1 - ramp(t, 4.1, 4.5)) * 40}px)` }}>
        <Circ t={t} w={670} loops={{ pul: 5.1, sys: 5.3, sysOff: 6.0 }} dimSys={ramp(t, 6.0, 6.4)}
          lit={{ RV: 7.07, PA: 7.86, PAL: 7.9, PAR: 7.9, lungs: 8.7, PVL: 10.5, PVR: 10.5, LA: 11.14 }}
          flow={{ PA: 7.86, PAL: 8.0, PAR: 8.0, PVL: 10.0, PVR: 10.0 }} oxy={9.61} />
      </div>
      <Steps t={t} title="PULMONARY LOOP · heart ⇄ lungs" color={BLUE} t0={6.04} steps={[["Right ventricle", 7.07], ["Lungs + O₂", 8.7], ["Left atrium", 11.14]]} />
    </Scene>
  );
};

export const V3: React.FC = () => {
  const t = useT();
  return (
    <Scene start={12.05} end={18.05} push={0.02}>
      <div style={{ position: "absolute", left: 95, top: -20 }}>
        <Circ t={t} w={670} loops={{ sys: 12.24 }} dimPul={ramp(t, 12.1, 12.5)} oxy={0}
          lit={{ LV: 13.18, AO: 14.71, body: 15.37, VC: 16.4, RA: 16.95 }}
          flow={{ AO: 13.9, VC: 16.3 }} deoxy={15.9} />
      </div>
      <Steps t={t} title="SYSTEMIC LOOP · heart ⇄ body" color={C.red} t0={12.24} steps={[["Left ventricle", 13.18], ["Aorta", 14.71], ["Body", 15.37], ["Right atrium", 16.95]]} />
    </Scene>
  );
};

/* 4. The trick */
const W4: [string, number, boolean][] = [["Arteries", 19.15, true], ["go", 19.62, false], ["Away", 19.79, true], ["from", 20.01, false], ["the", 20.2, false], ["heart", 20.26, false]];
export const V4: React.FC = () => {
  const t = useT();
  const word = (w: string, wt: number, hi: boolean) => {
    const p = ramp(t, wt - 0.05, wt + 0.18);
    return (
      <div key={w} style={{ opacity: p, transform: `translateY(${(1 - p) * 30}px) scale(${0.8 + 0.2 * p})`, fontFamily: FONT, fontWeight: 800, fontSize: 70, letterSpacing: -1.5, color: C.paper, lineHeight: 1 }}>
        {hi ? <span style={{ color: C.banana, fontSize: 100 }}>{w[0]}</span> : w[0]}
        {w.slice(1)}
      </div>
    );
  };
  const aa = ramp(t, 21.0, 21.3), dir = ramp(t, 23.1, 23.4), ox = ramp(t, 23.65, 23.95);
  return (
    <Scene start={18.05} end={24.65}>
      <div style={{ position: "absolute", left: 10, top: 20, width: 840, height: 860, borderRadius: 48, background: C.forest, ...pop(t, 18.1, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 56, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 6, color: C.matchaLight, opacity: ramp(t, 18.5, 18.8) }}>THE TRICK</div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 140, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 20 }}>{W4.slice(0, 3).map(([w, wt, hi]) => word(w, wt, hi))}</div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 262, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 20 }}>{W4.slice(3).map(([w, wt, hi]) => word(w, wt, hi))}</div>
        {/* A = A */}
        <div style={{ position: "absolute", left: 0, width: 840, top: 420, display: "flex", justifyContent: "center", alignItems: "center", gap: 22, opacity: aa, transform: `scale(${0.85 + 0.15 * aa})` }}>
          {[["A", "rtery", 21.0], ["A", "way", 21.77]].map(([a, r, tt], i) => (
            <React.Fragment key={i}>
              {i === 1 && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 70, color: C.banana }}>=</div>}
              <div style={{ background: C.matcha, borderRadius: 26, padding: "14px 28px 20px", fontFamily: FONT, fontWeight: 800, fontSize: 54, color: C.paper, opacity: ramp(t, (tt as number) - 0.05, (tt as number) + 0.2), boxShadow: "0 8px 0 rgba(0,0,0,0.25)" }}>
                <span style={{ color: C.banana, fontSize: 74 }}>{a}</span>
                {r}
              </div>
            </React.Fragment>
          ))}
        </div>
        {/* direction, not oxygen */}
        <div style={{ position: "absolute", left: 60, width: 720, top: 610, display: "flex", justifyContent: "center", gap: 24 }}>
          <div style={{ opacity: dir, transform: `scale(${0.7 + 0.3 * dir})`, background: C.banana, color: C.forest, borderRadius: 22, padding: "12px 26px 16px", fontFamily: FONT, fontWeight: 800, fontSize: 44, display: "flex", alignItems: "center", gap: 12 }}>
            <svg width={46} height={46} viewBox="0 0 46 46"><path d="M8 23 L34 23 M24 12 L36 23 L24 34" stroke={C.forest} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            direction
          </div>
          <div style={{ opacity: ox, transform: `scale(${0.7 + 0.3 * ox})`, background: "transparent", border: `4px solid ${C.matchaLight}`, color: C.matchaLight, borderRadius: 22, padding: "10px 26px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 44, position: "relative" }}>
            not O₂
            <div style={{ position: "absolute", left: 10, right: 10, top: "50%", height: 6, borderRadius: 3, background: C.red, transform: `rotate(-8deg) scaleX(${ramp(t, 23.9, 24.15)})` }} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 750, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 32, color: C.paper, opacity: 0.75 * ramp(t, 22.2, 22.5) }}>
          veins bring blood <span style={{ color: C.banana }}>back to</span> the heart
        </div>
      </div>
    </Scene>
  );
};

/* 5. Pulmonary vessels on the 1918 plate — blue artery, red veins */
const PX = 70, PY = 240, PW = 720, PH = PW / A504;
const anc = (fx: number, fy: number) => [PX + fx * PW, PY + fy * PH] as const;
export const V5: React.FC = () => {
  const t = useT();
  const a1 = anc(0.37, 0.44), v1 = anc(0.40, 0.575), v2 = anc(0.665, 0.585);
  const la = ramp(t, 25.28, 25.6), lv = ramp(t, 28.86, 29.2);
  const lineTo = (from: readonly [number, number], to: readonly [number, number], p: number, col: string) => (
    <>
      <line x1={from[0]} y1={from[1]} x2={from[0] + (to[0] - from[0]) * p} y2={from[1] + (to[1] - from[1]) * p} stroke={C.forest} strokeWidth={9} strokeLinecap="round" />
      <line x1={from[0]} y1={from[1]} x2={from[0] + (to[0] - from[0]) * p} y2={from[1] + (to[1] - from[1]) * p} stroke={col} strokeWidth={4} strokeLinecap="round" />
      {p > 0.95 && <circle cx={to[0]} cy={to[1]} r={12} fill={C.banana} stroke={C.forest} strokeWidth={4} />}
    </>
  );
  const chip = (x: number, y: number, p: number, bg: string, name: string, sub: string, subT: number) => (
    <div style={{ position: "absolute", left: x, top: y, opacity: p, transform: `scale(${0.8 + 0.2 * p})`, transformOrigin: "0 50%", display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ background: bg, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 36, padding: "8px 20px 11px", borderRadius: 16, border: `3px solid ${C.forest}`, whiteSpace: "nowrap" }}>{name}</div>
      <div style={{ background: C.card, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 30, padding: "7px 16px 10px", borderRadius: 14, border: `3px solid ${C.forest}`, whiteSpace: "nowrap", opacity: ramp(t, subT - 0.05, subT + 0.2) }}>{sub}</div>
    </div>
  );
  return (
    <Scene start={24.65} end={31.75} push={0.01}>
      <div style={center(40, pop(t, 24.7))}>
        <div style={{ background: C.forest, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 36, padding: "10px 28px 14px", borderRadius: 18, whiteSpace: "nowrap" }}>
          <span style={{ color: C.banana }}>A</span>rtery = <span style={{ color: C.banana }}>A</span>way from the heart
        </div>
      </div>
      <Plate src="plates/pulm504.png" aspect={A504} x={PX} y={PY} w={PW} a={24.65} b={31.75} zoomFrom={[1, 0.5, 0.5]} zoomTo={[1, 0.5, 0.5]} covers={[{ x: 0.935, y: 0.33, w: 0.08, h: 0.125 }]} />
      <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {la > 0 && lineTo([150, 175], a1, la, BLUE)}
        {lv > 0 && lineTo([300, 862], v1, lv, C.red)}
        {lv > 0 && lineTo([380, 862], v2, lv, C.red)}
      </svg>
      {chip(40, 140, la, BLUE_D, "Pulmonary artery", "O₂-poor → lungs", 26.71)}
      {chip(40, 840, lv, C.redDark, "Pulmonary veins", "O₂-rich → heart", 30.09)}
    </Scene>
  );
};

/* 6. The same heart in the 1918 atlas, modern labels + old name note */
export const V6: React.FC = () => {
  const t = useT();
  return (
    <Scene start={31.75} end={34.9} push={0.01}>
      <Plate
        src="plates/heart490.png" aspect={A490} x={50} y={60} w={760} a={31.75} b={34.9}
        zoomFrom={[1.0, 0.5, 0.55]} zoomTo={[1.1, 0.5, 0.55]}
        labels={[
          { x: 0.53, y: 0.47, text: "Pulmonary trunk", t: 32.2, hot: true, ox: 30, oy: -215 },
          { x: 0.40, y: 0.43, text: "Aorta", t: 32.6, ox: -120, oy: -150 },
          { x: 0.47, y: 0.73, text: "Right ventricle", t: 33.05, ox: -80, oy: 40 },
          { x: 0.67, y: 0.75, text: "Left ventricle", t: 33.45, ox: -40, oy: 118 },
        ]}
      />
      <div style={{ position: "absolute", left: 60, width: 740, top: 812, display: "flex", justifyContent: "center", ...pop(t, 33.97) }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 20px 11px", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.forest, whiteSpace: "nowrap" }}>
          <span style={{ color: C.matcha }}>1918 atlas name:</span> pulmonary artery
        </div>
      </div>
    </Scene>
  );
};

/* 7. Quick test */
export const V7: React.FC = () => {
  const t = useT();
  const c0 = 38.0;
  const n = t < c0 ? null : t < c0 + 0.5 ? 3 : t < c0 + 1.0 ? 2 : t < c0 + 1.5 ? 1 : null;
  return (
    <Scene start={34.9} end={39.5}>
      <div style={{ position: "absolute", left: 10, top: 40, width: 840, height: 820, borderRadius: 48, background: C.forest, ...pop(t, 34.95, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 70, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 40, width: 760, top: 160, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 74, lineHeight: 1.08, color: C.paper, ...pop(t, 35.75) }}>
          Which ventricle pumps blood to your <span style={{ color: C.banana }}>whole body?</span>
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 480, display: "flex", justifyContent: "center", gap: 22 }}>
          {[["RIGHT", BLUE], ["LEFT", C.red]].map(([x, col], i) => (
            <div key={x} style={{ ...pop(t, 36.3 + i * 0.15), background: C.matchaDark, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 38, padding: "14px 24px 18px", borderRadius: 20, display: "flex", alignItems: "center", gap: 12, whiteSpace: "nowrap" }}>
              <div style={{ width: 22, height: 22, borderRadius: 11, background: col }} />
              {x} ventricle
            </div>
          ))}
        </div>
        {n && (
          <div style={{ position: "absolute", left: 0, width: 840, top: 640, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 120, color: C.banana, lineHeight: 1, transform: `scale(${1.3 - 0.3 * ramp(t, Math.floor((t - c0) / 0.5) * 0.5 + c0, Math.floor((t - c0) / 0.5) * 0.5 + c0 + 0.15)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 8. Answer: left ventricle, thicker wall — our own cross-section of the ventricles */
const Xsec: React.FC<{ t: number }> = ({ t }) => {
  const lv = ramp(t, 39.58, 39.85);
  const wall = ramp(t, 41.2, 41.5);
  const pu = Math.max(0, 1 - Math.abs(t - 41.35) / 0.4);
  return (
    <svg width={760} height={560} viewBox="0 0 760 560">
      <defs>
        <radialGradient id="x54m" cx="45%" cy="35%" r="80%">
          <stop offset="0%" stopColor="#E9918A" />
          <stop offset="75%" stopColor="#C9584C" />
          <stop offset="100%" stopColor="#9E3A30" />
        </radialGradient>
        <filter id="x54sh" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#1F2A14" floodOpacity="0.2" />
        </filter>
        <filter id="x54g" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14" /></filter>
      </defs>
      <g filter="url(#x54sh)">
        {/* myocardium: LV thick ring + RV thin crescent (viewer's left) */}
        <path d="M380 75 Q120 100 100 290 Q120 470 380 465 A210 210 0 0 1 380 75 Z" fill="url(#x54m)" stroke={C.forest} strokeWidth={6} />
        <circle cx={470} cy={270} r={210} fill="url(#x54m)" stroke={C.forest} strokeWidth={6} />
      </g>
      {/* RV cavity */}
      <path d="M340 112 Q150 130 130 290 Q150 450 340 440 Q180 276 340 112 Z" fill="#B9CCE6" stroke={C.forest} strokeWidth={4} />
      {/* LV cavity */}
      {lv > 0 && <circle cx={470} cy={270} r={130} fill={C.banana} opacity={0.8 * lv} filter="url(#x54g)" />}
      <circle cx={470} cy={270} r={108} fill="#F0B3A9" stroke={C.forest} strokeWidth={4} />
      <circle cx={470} cy={270} r={108} fill={C.banana} opacity={0.9 * lv} />
      <text x={470} y={284} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={C.forest}>LV</text>
      <text x={196} y={302} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={C.forest}>RV</text>
      {/* wall thickness markers */}
      {wall > 0 && (
        <g opacity={wall}>
          <line x1={578} y1={270} x2={680} y2={270} stroke={C.forest} strokeWidth={10 + 4 * pu} strokeLinecap="round" />
          <line x1={578} y1={270} x2={680} y2={270} stroke={C.banana} strokeWidth={5 + 2 * pu} strokeLinecap="round" />
          <circle cx={578} cy={270} r={9} fill={C.banana} stroke={C.forest} strokeWidth={4} />
          <circle cx={680} cy={270} r={9} fill={C.banana} stroke={C.forest} strokeWidth={4} />
          <line x1={100} y1={290} x2={130} y2={290} stroke={C.forest} strokeWidth={8} strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
};
export const V8: React.FC = () => {
  const t = useT();
  return (
    <Scene start={39.5} end={42.75} push={0.01}>
      <div style={center(50, pop(t, 39.55))}>
        <Pill size={50} bg={C.red}>LEFT VENTRICLE ✓</Pill>
      </div>
      <div style={{ position: "absolute", left: 50, top: 130 }}>
        <Xsec t={t} />
      </div>
      <div style={{ position: "absolute", left: 30, top: 668, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.forest, opacity: 0.55 * ramp(t, 39.8, 40.1) }}>cross-section of the ventricles</div>
      <div style={{ position: "absolute", left: 40, width: 780, top: 720, borderRadius: 36, background: C.card, border: `4px solid ${C.line}`, padding: "24px 34px", boxSizing: "border-box", fontFamily: FONT, ...pop(t, 40.65) }}>
        <div style={{ fontWeight: 800, fontSize: 30, letterSpacing: 4, color: C.matcha }}>WHOLE BODY = BIG JOB</div>
        <div style={{ fontWeight: 800, fontSize: 56, color: C.forest, lineHeight: 1.1 }}>
          → much <span style={{ color: C.red }}>thicker wall</span>
        </div>
      </div>
    </Scene>
  );
};

/* 9. Save */
export const V9: React.FC = () => {
  const t = useT();
  const b = ramp(t, 42.85, 43.2);
  return (
    <Scene start={42.75} end={44.95}>
      <div style={center(40, pop(t, 42.8))}>
        <svg width={220} height={280} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={center(360, pop(t, 43.0))}>
        <Big size={120}>SAVE THIS</Big>
      </div>
      <div style={center(510, pop(t, 43.6))}>
        <Big size={58} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ ...center(640), gap: 14, ...pop(t, 44.0) }}>
        <div style={{ background: C.forest, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 44, padding: "12px 26px 16px", borderRadius: 18 }}>
          <span style={{ color: C.banana }}>A</span>rtery
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 54, color: C.forest, alignSelf: "center" }}>=</div>
        <div style={{ background: C.forest, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 44, padding: "12px 26px 16px", borderRadius: 18 }}>
          <span style={{ color: C.banana }}>A</span>way
        </div>
      </div>
    </Scene>
  );
};

/* 10. End card */
export const V10: React.FC = () => {
  const t = useT();
  return (
    <Scene start={44.95} end={49.4}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, 45.0, 0.35) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.banana, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 46.1, 46.4) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 45) * 5))})`, opacity: ramp(t, 45.12, 45.4) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
