import React from "react";
import { C, FONT, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { CId, CONTENTS, CT, EPart, Elbow, ElbowLabels } from "./Elbow42";

const ASPECT_E = 629 / 1006;
const ASPECT_F = 564 / 912;
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

/* 1. Hook: Gray's 1918 front-of-elbow plate, push in on the pit of the elbow */
export const V1: React.FC = () => {
  const t = useT();
  const tri = ramp(t, 3.35, 3.95);
  return (
    <Scene start={-0.6} end={5.2} push={0.02}>
      <div style={{ position: "absolute", left: 0, top: 40, width: 860, textAlign: "center", ...pop(t, 0.02, 0.25) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.matcha, letterSpacing: 5 }}>WHAT'S HIDING IN THE</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.forest, letterSpacing: -2, lineHeight: 1.1, marginTop: 6, whiteSpace: "nowrap" }}>
          <span style={{ background: t >= 0.72 ? C.banana : "transparent", borderRadius: 20, padding: "0 16px 6px" }}>pit</span> of your elbow?
        </div>
      </div>
      <Plate src="plates/elbow.png" aspect={ASPECT_E} x={10} y={200} w={460} a={-0.6} b={5.2} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.55, 0.45, 0.42]}
        labels={[{ x: 0.47, y: 0.5, text: "?", t: 0.74, hot: true, ox: 60, oy: -60 }]} credit="Gray's Anatomy, 1918 · PD" />
      <div style={{ position: "absolute", left: 500, top: 270, width: 340, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div style={{ ...pop(t, 1.87), fontFamily: FONT, fontWeight: 800, fontSize: 28, letterSpacing: 4, color: C.matcha }}>IT'S THE</div>
        <div style={{ ...pop(t, 2.11), ...chip(C.banana, C.forest, 52), padding: "10px 24px 14px" }}>Cubital</div>
        <div style={{ ...pop(t, 2.49), ...chip(C.forest, C.paper, 52), padding: "10px 24px 14px" }}>fossa</div>
      </div>
      <div style={{ position: "absolute", left: 500, top: 570, width: 340, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, ...pop(t, 3.3) }}>
        <svg width={200} height={180} viewBox="0 0 200 180">
          <path d="M 20 20 L 180 20 L 100 165 Z" fill={C.banana} fillOpacity={0.35 * tri} stroke={C.forest} strokeWidth={10} strokeLinejoin="round" pathLength={1} strokeDasharray={`${tri} 2`} />
        </svg>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest }}>a triangle</div>
        <div style={{ ...pop(t, 4.16), fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.matcha, textAlign: "center", lineHeight: 1.15 }}>at the front
          <br />of the elbow</div>
      </div>
    </Scene>
  );
};

/* Diagram stage with camera moves */
type Step = { t: number; zoom: [number, number, number]; focus: EPart[] };
const Stage: React.FC<{ t: number; start: number; steps: Step[]; props: Partial<React.ComponentProps<typeof Elbow>>; h?: number; top?: number; note?: string }> = ({ t, start, steps, props, h = 680, top = 10, note = "Book Plume diagram · right elbow, front view" }) => {
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
    <div style={{ position: "absolute", left: 0, top, width: 860, height: h, overflow: "hidden", borderRadius: 36, background: C.card, border: `3px solid ${C.line}` }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 860, height: h, transform: `scale(${s})`, transformOrigin: `${zx * 100}% ${zy * 100}%` }}>
        <div style={{ position: "absolute", left: 0, top: 0 }}><Elbow t={t} w={860} focus={cur.focus} {...props} labels={{}} /></div>
      </div>
      <ElbowLabels t={t} h={h} focus={cur.focus} lit={props.lit} labels={props.labels} labelEnd={props.labelEnd} map={(x, y) => [zx * 860 + (x - zx * 860) * s, zy * h + (y - zy * h) * s]} />
      <div style={{ position: "absolute", right: 14, bottom: 10, fontFamily: FONT, fontWeight: 700, fontSize: 18, color: C.forest, background: "rgba(255,254,246,0.9)", padding: "2px 10px", borderRadius: 8, opacity: 0.7 }}>{note}</div>
    </div>
  );
};

const DarkCard: React.FC<{ t: number; t0: number; children: React.ReactNode; top?: number; h?: number }> = ({ t, t0, children, top = 708, h = 200 }) => (
  <div style={{ position: "absolute", left: 30, width: 800, top, height: h, borderRadius: 36, background: C.forest, boxShadow: "0 14px 30px rgba(31,42,20,0.25)", ...pop(t, t0, 0.3) }}>{children}</div>
);

/* 2. The borders of the triangle */
const BRow: React.FC<{ t: number; t0: number; y: number; side: string; name: string; hotAt: number; nextAt?: number }> = ({ t, t0, y, side, name, hotAt, nextAt }) => {
  const p = ramp(t, t0 - 0.05, t0 + 0.25);
  const done = nextAt !== undefined && t >= nextAt ? 0.6 : 1;
  const hot = ramp(t, hotAt, hotAt + 0.2) * (nextAt !== undefined && t >= nextAt ? 0 : 1);
  return (
    <div style={{ position: "absolute", left: 30, top: y, display: "flex", alignItems: "center", gap: 18, opacity: p * done, transform: `translateX(${(1 - p) * 40}px)` }}>
      <div style={{ width: 200, ...chip(C.matcha, C.paper, 26), textAlign: "center", letterSpacing: 3, padding: "6px 0 8px" }}>{side}</div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: hot > 0.5 ? C.forest : C.paper, background: hot > 0.5 ? C.banana : "transparent", borderRadius: 14, padding: "0 12px 4px", whiteSpace: "nowrap" }}>{name}</div>
    </div>
  );
};
export const V2: React.FC = () => {
  const t = useT();
  return (
    <Scene start={5.2} end={12.3} push={0.01}>
      <Stage t={t} start={5.2} steps={[
        { t: 5.2, zoom: [1.0, 0.5, 0.5], focus: [] },
        { t: 5.35, zoom: [1.18, 0.25, 0.6], focus: ["br"] },
        { t: 7.55, zoom: [1.18, 0.7, 0.6], focus: ["pt"] },
        { t: 9.75, zoom: [1.12, 0.5, 0.38], focus: ["lep", "mep"] },
        { t: 11.55, zoom: [1.05, 0.5, 0.5], focus: [] },
      ]} props={{ dimFrom: 5.25, lit: { br: 5.4, pt: 7.6, lep: 10.66, mep: 10.9, tri: 11.57 }, show: { line: 9.83, tri: 11.5 }, labels: { br: 5.6, pt: 7.8, line: 10.3 } }} />
      <DarkCard t={t} t0={5.25}>
        <BRow t={t} t0={5.35} y={18} side="LATERAL" name="Brachioradialis" hotAt={5.35} nextAt={7.55} />
        <BRow t={t} t0={7.55} y={78} side="MEDIAL" name="Pronator teres" hotAt={7.55} nextAt={9.83} />
        <BRow t={t} t0={9.83} y={138} side="TOP" name="Epicondyle line" hotAt={10.66} nextAt={11.9} />
      </DarkCard>
      <Stamp t0={11.57} text="TRIANGLE ✓" size={42} rot={-6} color={C.matcha} style={{ left: 470, top: 520 }} />
    </Scene>
  );
};

/* 3. Mnemonic card */
const MN: [string, number][] = [["Really", 15.45], ["Need", 15.68], ["Beer", 15.95], ["To", 16.13], ["Be", 16.51], ["At", 16.7], ["My", 16.84], ["Nicest", 17.03]];
export const V3: React.FC = () => {
  const t = useT();
  const arrow = ramp(t, 14.07, 14.75);
  return (
    <Scene start={12.3} end={17.9}>
      <div style={{ position: "absolute", left: 10, top: 10, width: 840, height: 900, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 12.3, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 44, display: "flex", justifyContent: "center", gap: 18, alignItems: "center" }}>
          <div style={{ ...pop(t, 13.0), ...chip(C.banana, C.forest, 36) }}>4 STRUCTURES</div>
          <div style={{ ...pop(t, 13.31), fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.matchaLight, letterSpacing: 3 }}>INSIDE THE FOSSA</div>
        </div>
        <div style={{ position: "absolute", left: 60, width: 720, top: 132, height: 70, opacity: ramp(t, 13.95, 14.2) }}>
          <svg width={720} height={70} viewBox="0 0 720 70">
            <line x1={150} y1={35} x2={150 + 420 * arrow} y2={35} stroke={C.matchaLight} strokeWidth={8} strokeLinecap="round" />
            {arrow > 0.95 && <path d="M 560 15 L 590 35 L 560 55" fill="none" stroke={C.matchaLight} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />}
            <text x={70} y={46} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.paper}>lateral</text>
            <text x={660} y={46} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.paper} opacity={ramp(t, 14.57, 14.8)}>medial</text>
          </svg>
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 236, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          {[[0, 1], [2, 3], [4, 5], [6, 7]].map((pair, row) => {
            const rowP = ramp(t, MN[pair[1]][1] + 0.1, MN[pair[1]][1] + 0.35);
            return (
              <div key={row} style={{ display: "flex", gap: 24, justifyContent: "center", alignItems: "center" }}>
                {pair.map((i) => {
                  const [w, tt] = MN[i];
                  const p = ramp(t, tt - 0.05, tt + 0.2);
                  return (
                    <div key={i} style={{ display: "inline-flex", alignItems: "baseline", opacity: p, transform: `translateY(${(1 - p) * -60}px) scale(${1 + 0.1 * Math.sin(p * Math.PI)})`, fontFamily: FONT, fontWeight: 800, fontSize: 92, letterSpacing: -3, lineHeight: 1.2 }}>
                      <span style={{ background: C.banana, color: C.forest, borderRadius: 18, padding: "0 12px 4px", marginRight: 4 }}>{w[0]}</span>
                      <span style={{ color: C.paper }}>{w.slice(1)}</span>
                    </div>
                  );
                })}
                <div style={{ width: 56, height: 56, borderRadius: 28, background: C.matcha, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center", opacity: rowP, transform: `scale(${0.5 + 0.5 * rowP})`, marginLeft: 6 }}>{row + 1}</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 770, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.matchaLight, letterSpacing: 2, opacity: ramp(t, 17.3, 17.55) }}>2 WORDS = 1 STRUCTURE</div>
      </div>
    </Scene>
  );
};

/* 4. The four contents, lateral -> medial */
const Strip: React.FC<{ t: number; t0: number; at: Record<CId, number>; hot?: CId | null; fade?: number }> = ({ t, t0, at, hot = null }) => (
  <DarkCard t={t} t0={t0}>
    <div style={{ position: "absolute", left: 0, top: 10, width: 800, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 20, letterSpacing: 4, color: C.matchaLight }}>LATERAL ─────────────── MEDIAL</div>
    {CONTENTS.map((id, i) => {
      const p = ramp(t, at[id] - 0.05, at[id] + 0.25);
      const isHot = hot === id;
      return (
        <div key={id} style={{ position: "absolute", left: 16 + i * 192, top: 40, width: 184, height: 150, display: "flex", flexDirection: "column", alignItems: "center", opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
          <div style={{ minWidth: 104, height: 62, borderRadius: 31, background: isHot ? C.banana : C.matcha, color: isHot ? C.forest : C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: 2 }}>{CT[id].pair}</div>
          <div style={{ marginTop: 8, fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.paper, lineHeight: 1.05, textAlign: "center" }}>{CT[id].l1}</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.matchaLight, lineHeight: 1.1, textAlign: "center" }}>{CT[id].l2}</div>
        </div>
      );
    })}
  </DarkCard>
);
export const V4: React.FC = () => {
  const t = useT();
  const at = { rn: 18.02, bt: 19.86, ba: 21.44, mn: 23.08 };
  let hot: CId | null = null;
  CONTENTS.forEach((id) => { if (t >= at[id]) hot = id; });
  return (
    <Scene start={17.9} end={25.6} push={0.01}>
      <Stage t={t} start={17.9} steps={[
        { t: 17.9, zoom: [1.2, 0.42, 0.42], focus: [] },
        { t: 18.7, zoom: [1.4, 0.38, 0.45], focus: ["rn"] },
        { t: 20.2, zoom: [1.4, 0.47, 0.38], focus: ["bt"] },
        { t: 21.8, zoom: [1.4, 0.54, 0.45], focus: ["ba"] },
        { t: 23.8, zoom: [1.35, 0.62, 0.45], focus: ["mn"] },
        { t: 24.66, zoom: [1.12, 0.55, 0.42], focus: ["mn"] },
      ]} props={{ dimFrom: 17.95, show: { rn: 18.6, ba: 21.7, mn: 23.7 }, lit: { rn: 18.74, bt: 20.22, ba: 21.85, mn: 23.82 }, labels: { rn: 18.9, bt: 20.4, ba: 22.0, mn: 24.0 } }} />
      <Strip t={t} t0={17.95} at={at} hot={hot} />
      <Stamp t0={24.66} text="MOST MEDIAL" size={40} rot={-6} color={C.red} style={{ left: 470, top: 560 }} />
    </Scene>
  );
};

/* 5. The roof: median cubital vein */
export const V5: React.FC = () => {
  const t = useT();
  return (
    <Scene start={25.6} end={30.7} push={0.01}>
      <Stage t={t} start={25.6} steps={[
        { t: 25.6, zoom: [1.1, 0.5, 0.45], focus: [] },
        { t: 26.9, zoom: [1.0, 0.5, 0.5], focus: ["mcv"] },
        { t: 28.7, zoom: [1.22, 0.5, 0.5], focus: ["mcv"] },
      ]} props={{ contentsAll: true, show: { roof: 26.3, mcv: 26.9 }, lit: { mcv: 27.06 }, labels: { mcv: 27.5 } }} note="Book Plume diagram · roof of the fossa" />
      <DarkCard t={t} t0={25.65}>
        <div style={{ position: "absolute", left: 0, width: 800, top: 26, display: "flex", justifyContent: "center", alignItems: "center", gap: 18 }}>
          <div style={{ ...pop(t, 26.36), ...chip(C.matcha, C.paper, 34), letterSpacing: 3 }}>ROOF</div>
          <div style={{ ...pop(t, 27.06), fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper, whiteSpace: "nowrap" }}>Median cubital vein</div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 114, display: "flex", justifyContent: "center", alignItems: "center", gap: 14 }}>
          <div style={{ ...pop(t, 28.76), ...chip(C.banana, C.forest, 36) }}>classic blood-draw spot</div>
        </div>
      </DarkCard>
    </Scene>
  );
};

/* 6. Gray's 1918 deep-view plate with modern labels (labels drawn outside the plate frame: lateral ones left, medial ones right) */
const PX = 150, PW = 560, PH = PW / ASPECT_F, PA = 30.7, PB = 33.75;
const PZ0: [number, number, number] = [1.0, 0.5, 0.4], PZ1: [number, number, number] = [1.08, 0.5, 0.36];
const plateMap = (t: number, fx: number, fy: number): [number, number] => {
  const k = ramp(t, PA, PB);
  const sc = PZ0[0] + (PZ1[0] - PZ0[0]) * k, cx = PZ0[1] + (PZ1[1] - PZ0[1]) * k, cy = PZ0[2] + (PZ1[2] - PZ0[2]) * k;
  const cl = (v: number, m: number) => Math.max(-m, Math.min(m, v));
  const tx = cl(-(cx - 0.5) * PW * sc, (sc - 1) * PW / 2), ty = cl(-(cy - 0.5) * PH * sc, (sc - 1) * PH / 2);
  return [PX + PW / 2 + (fx * PW - PW / 2) * sc + tx, PH / 2 + (fy * PH - PH / 2) * sc + ty];
};
const PL: { fx: number; fy: number; text: string; t: number; px: number; py: number; hot?: boolean }[] = [
  { fx: 0.335, fy: 0.5, text: "Radial nerve", t: 31.0, px: 140, py: 560 },
  { fx: 0.44, fy: 0.345, text: "Biceps tendon", t: 31.4, px: 150, py: 250 },
  { fx: 0.585, fy: 0.21, text: "Brachial artery", t: 31.8, px: 715, py: 120, hot: true },
  { fx: 0.665, fy: 0.36, text: "Median nerve", t: 32.2, px: 720, py: 430 },
];
export const V6: React.FC = () => {
  const t = useT();
  return (
    <Scene start={30.7} end={33.75} push={0.01}>
      <Plate src="plates/fossa.png" aspect={ASPECT_F} x={PX} y={0} w={PW} a={PA} b={PB} zoomFrom={PZ0} zoomTo={PZ1} />
      <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: 1 - ramp(t, PB - 0.1, PB + 0.35) }}>
        {PL.map((l, i) => {
          const p = ramp(t, l.t - 0.1, l.t + 0.25);
          if (p <= 0) return null;
          const [ax, ay] = plateMap(t, l.fx, l.fy);
          const ww = l.text.length * 17.5 + 40;
          return (
            <g key={i} opacity={Math.min(1, p * 1.5)}>
              <line x1={ax} y1={ay} x2={ax + (l.px - ax) * p} y2={ay + (l.py - ay) * p} stroke={C.forest} strokeWidth={5} strokeLinecap="round" />
              <circle cx={ax} cy={ay} r={11} fill={l.hot ? C.red : C.banana} stroke={C.forest} strokeWidth={4.5} />
              <g transform={`translate(${l.px} ${l.py}) scale(${0.8 + 0.2 * p})`}>
                <rect x={-ww / 2} y={-28} width={ww} height={56} rx={16} fill={l.hot ? C.banana : C.forest} stroke={C.forest} strokeWidth={3} />
                <text x={0} y={11} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill={l.hot ? C.forest : C.paper}>{l.text}</text>
              </g>
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: 0, top: 860, width: 860, display: "flex", justifyContent: "center", ...pop(t, 32.28) }}>
        <div style={{ ...chip(C.forest, C.paper, 26) }}>1918 atlas · deep view · lateral ← → medial</div>
      </div>
    </Scene>
  );
};

/* 7. Quick test */
export const C0 = 37.25;
export const V7: React.FC = () => {
  const t = useT();
  const n = t < C0 ? null : t < C0 + 0.5 ? 3 : t < C0 + 1.0 ? 2 : t < C0 + 1.5 ? 1 : null;
  const k = Math.floor((t - C0) / 0.5) * 0.5 + C0;
  return (
    <Scene start={33.75} end={38.72}>
      <div style={{ position: "absolute", left: 10, top: 30, width: 840, height: 860, borderRadius: 48, background: C.forest, ...pop(t, 33.8, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 52, display: "flex", justifyContent: "center" }}>
          <div style={{ background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, padding: "8px 28px 11px 36px", borderRadius: 18 }}>QUICK TEST</div>
        </div>
        <div style={{ position: "absolute", left: 40, width: 760, top: 160, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 64, lineHeight: 1.14, color: C.paper, ...pop(t, 34.87) }}>
          What lies just <span style={{ color: C.banana }}>medial</span> to the <span style={{ background: C.banana, color: C.forest, borderRadius: 16, padding: "0 14px 4px", display: "inline-block" }}>biceps tendon?</span>
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 440, display: "flex", justifyContent: "center", gap: 16 }}>
          {CONTENTS.map((id, i) => {
            const q = id === "ba";
            const known = id === "bt";
            return (
              <div key={id} style={{ ...pop(t, 35.5 + i * 0.1), width: 170, height: 120, borderRadius: 22, background: q ? C.banana : known ? C.matcha : C.matchaDark, color: q || known ? (q ? C.forest : C.paper) : C.matchaLight, fontFamily: FONT, fontWeight: 800, fontSize: q ? 80 : 46, display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: 2, border: q ? `4px dashed ${C.forest}` : "none" }}>{q ? "?" : known ? "BT" : "··"}</div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 572, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 22, letterSpacing: 4, color: C.matchaLight, opacity: ramp(t, 35.9, 36.2) }}>LATERAL ───────────────── MEDIAL</div>
        {n && (
          <div style={{ position: "absolute", left: 0, width: 840, top: 650, display: "flex", justifyContent: "center", transform: `scale(${1.3 - 0.3 * ramp(t, k, k + 0.15)})` }}>
            <div style={{ width: 150, height: 150, borderRadius: 75, background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 104, lineHeight: "150px", textAlign: "center" }}>{n}</div>
          </div>
        )}
      </div>
    </Scene>
  );
};

/* 8. Answer: brachial artery */
export const V8: React.FC = () => {
  const t = useT();
  return (
    <Scene start={38.72} end={40.6} push={0.01}>
      <Stage t={t} start={38.72} h={680} steps={[{ t: 38.72, zoom: [1.45, 0.53, 0.42], focus: ["ba"] }]}
        props={{ contentsAll: true, dimFrom: 38.74, lit: { ba: 38.8, bt: 38.8 }, labels: { ba: 38.85, bt: 39.0 } }} />
      <DarkCard t={t} t0={38.76}>
        <div style={{ position: "absolute", left: 0, width: 800, top: 22, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 66, color: C.paper, letterSpacing: -1, ...pop(t, 38.82) }}>Brachial artery ✓</div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 118, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.matchaLight, ...pop(t, 39.87) }}>
          Beer To → <span style={{ background: C.banana, color: C.forest, borderRadius: 12, padding: "0 12px 3px" }}>Be At</span>
        </div>
      </DarkCard>
    </Scene>
  );
};

/* 9. Save */
export const V9: React.FC = () => {
  const t = useT();
  const b = ramp(t, 40.7, 41.05);
  return (
    <Scene start={40.6} end={42.9}>
      <div style={center(40, pop(t, 40.65))}>
        <svg width={220} height={280} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={center(360, pop(t, 40.83))}>
        <Big size={120}>SAVE THIS</Big>
      </div>
      <div style={center(510, pop(t, 41.82))}>
        <Big size={58} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ ...center(640), gap: 14, alignItems: "center", ...pop(t, 42.2) }}>
        {CONTENTS.map((id) => (
          <div key={id} style={{ width: 150, height: 104, borderRadius: 20, background: id === "ba" ? C.banana : C.matcha, color: id === "ba" ? C.forest : C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 52, display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: 2 }}>{CT[id].pair}</div>
        ))}
      </div>
    </Scene>
  );
};

/* 10. End card */
export const V10: React.FC = () => {
  const t = useT();
  return (
    <Scene start={42.9} end={46.8}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, 42.95, 0.35) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.matchaLight, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 44.08, 44.4) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 43.1) * 5))})`, opacity: ramp(t, 43.1, 43.4) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
