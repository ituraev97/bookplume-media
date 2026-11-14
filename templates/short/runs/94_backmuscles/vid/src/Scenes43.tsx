import React from "react";
import { C, FONT, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { DId, DPart, Dia, DiaLabels } from "./Dia43";

const ASPECT_D = 1978 / 1723;
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

const TRIO: { id: DId; letter: string; num: string; name: string; level: string; extra: string }[] = [
  { id: "ivc", letter: "I", num: "8", name: "IVC", level: "T8", extra: "central tendon" },
  { id: "eso", letter: "E", num: "10", name: "Esophagus", level: "T10", extra: "+ vagus nerves" },
  { id: "ao", letter: "A", num: "12", name: "Aorta", level: "T12", extra: "+ thoracic duct" },
];

/* plate geometry (diaphragm, under surface) — fractions of the crop */
const HOLE: Record<DId, [number, number]> = { ivc: [0.467, 0.33], eso: [0.566, 0.413], ao: [0.531, 0.582] };

/* 1. Hook: Gray's 1918 diaphragm from below, three openings flagged */
export const V1: React.FC = () => {
  const t = useT();
  const W = 640, X = 110, Y = 230;
  return (
    <Scene start={-0.6} end={2.85} push={0.02}>
      <div style={{ position: "absolute", left: 0, top: 30, width: 860, textAlign: "center", ...pop(t, 0.02, 0.25) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.matcha, letterSpacing: 5 }}>CAN YOU NAME THE</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 72, color: C.forest, letterSpacing: -2, lineHeight: 1.1, marginTop: 6, whiteSpace: "nowrap" }}>
          <span style={{ background: t >= 0.67 ? C.banana : "transparent", borderRadius: 20, padding: "0 16px 6px" }}>3 openings</span> in your
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 72, color: C.forest, letterSpacing: -2, lineHeight: 1.1, whiteSpace: "nowrap", opacity: ramp(t, 1.85, 2.05) }}>diaphragm?</div>
      </div>
      <Plate src="plates/diaphragm.png" aspect={ASPECT_D} x={X} y={Y + 60} w={W} a={-0.6} b={2.85} zoomFrom={[1.0, 0.5, 0.45]} zoomTo={[1.3, 0.52, 0.45]}
        labels={[
          { x: HOLE.ivc[0], y: HOLE.ivc[1], text: "1", t: 1.22, hot: true, ox: -90, oy: -60 },
          { x: HOLE.eso[0], y: HOLE.eso[1], text: "2", t: 1.45, hot: true, ox: 95, oy: -55 },
          { x: HOLE.ao[0], y: HOLE.ao[1], text: "3", t: 1.68, hot: true, ox: 100, oy: 40 },
        ]} credit="Gray's Anatomy, 1918 · PD · view from below" />
    </Scene>
  );
};

/* Diagram stage with camera moves */
type Step = { t: number; zoom: [number, number, number]; focus: DPart[] };
const Stage: React.FC<{ t: number; start: number; steps: Step[]; props: Partial<React.ComponentProps<typeof Dia>>; lab?: Partial<React.ComponentProps<typeof DiaLabels>>; h?: number; top?: number; note?: string }> = ({ t, start, steps, props, lab = {}, h = 680, top = 10, note = "Book Plume diagram · side view" }) => {
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
        <div style={{ position: "absolute", left: 0, top: 0 }}><Dia t={t} w={860} focus={cur.focus} {...props} /></div>
      </div>
      <DiaLabels t={t} h={h} focus={cur.focus} lit={props.lit} {...lab} map={(x, y) => [zx * 860 + (x - zx * 860) * s, zy * h + (y - zy * h) * s]} />
      <div style={{ position: "absolute", left: 14, bottom: 10, fontFamily: FONT, fontWeight: 700, fontSize: 18, color: C.forest, background: "rgba(255,254,246,0.9)", padding: "2px 10px", borderRadius: 8, opacity: 0.7 }}>{note}</div>
    </div>
  );
};

const DarkCard: React.FC<{ t: number; t0: number; children: React.ReactNode; top?: number; h?: number }> = ({ t, t0, children, top = 708, h = 200 }) => (
  <div style={{ position: "absolute", left: 30, width: 800, top, height: h, borderRadius: 36, background: C.forest, boxShadow: "0 14px 30px rgba(31,42,20,0.25)", ...pop(t, t0, 0.3) }}>{children}</div>
);

/* 2. The dome between chest and abdomen, 3 tubes, 3 levels */
export const V2: React.FC = () => {
  const t = useT();
  return (
    <Scene start={2.85} end={10.0} push={0.01}>
      <Stage t={t} start={2.85} steps={[
        { t: 2.85, zoom: [1.0, 0.5, 0.5], focus: [] },
        { t: 3.9, zoom: [1.06, 0.35, 0.45], focus: ["dome"] },
        { t: 6.8, zoom: [1.0, 0.5, 0.5], focus: [] },
      ]} props={{ show: { dome: 2.95, ivc: 7.05, eso: 7.3, ao: 7.55, lv8: 8.6, lv10: 8.85, lv12: 9.1 }, lit: { dome: 3.98, chest: 5.08, abd: 6.05 } }}
        lab={{ labels: { dome: 4.0 }, labelEnd: { dome: 6.8 }, regions: { chest: 5.08, abd: 6.05 }, levels: { ivc: 8.6, eso: 8.85, ao: 9.1 } }} />
      <DarkCard t={t} t0={2.95}>
        <div style={{ position: "absolute", left: 0, width: 800, top: 30, display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
          <div style={{ ...pop(t, 3.98), ...chip(C.matcha, C.paper, 40) }}>a dome</div>
          <div style={{ ...pop(t, 4.36), fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper }}>of muscle</div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 112, display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
          {t < 6.83 ? (
            <div style={{ ...pop(t, 5.08), fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.matchaLight }}>chest above · abdomen below</div>
          ) : (
            <>
              <div style={{ ...pop(t, 6.83), ...chip(C.banana, C.forest, 40) }}>3 tubes</div>
              <div style={{ ...pop(t, 8.61), ...chip(C.paper, C.forest, 40) }}>3 levels</div>
            </>
          )}
        </div>
      </DarkCard>
    </Scene>
  );
};

/* 3. Mnemonic card: I ate ten eggs at twelve */
const MW: { w: string; t: number; hi?: number; sub?: string }[] = [
  { w: "I", t: 11.04, hi: 1 },
  { w: "ate", t: 11.19, sub: "= 8" },
  { w: "10", t: 11.37 },
  { w: "eggs", t: 11.61, hi: 1 },
  { w: "at", t: 11.91, hi: 1 },
  { w: "12", t: 11.99 },
];
export const V3: React.FC = () => {
  const t = useT();
  return (
    <Scene start={10.0} end={12.9}>
      <div style={{ position: "absolute", left: 10, top: 10, width: 840, height: 900, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 10.0, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 50, display: "flex", justifyContent: "center", gap: 18, alignItems: "center" }}>
          <div style={{ ...pop(t, 10.1), ...chip(C.banana, C.forest, 36) }}>JUST REMEMBER</div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 170, display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: 26, rowGap: 30, padding: "0 30px", boxSizing: "border-box" }}>
          {MW.map((m, i) => {
            const p = ramp(t, m.t - 0.06, m.t + 0.18);
            const num = /\d/.test(m.w);
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: p, transform: `translateY(${(1 - p) * -60}px) scale(${1 + 0.1 * Math.sin(p * Math.PI)})` }}>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 120, letterSpacing: -3, lineHeight: 1.1, display: "flex" }}>
                  {m.hi ? (
                    <>
                      <span style={{ background: C.banana, color: C.forest, borderRadius: 20, padding: m.w.length === 1 ? "0 30px 6px" : "0 14px 6px" }}>{m.w[0].toUpperCase()}</span>
                      <span style={{ color: C.paper }}>{m.w.slice(1)}</span>
                    </>
                  ) : (
                    <span style={{ color: num ? C.banana : C.paper }}>{m.w}</span>
                  )}
                </div>
                {m.sub && <div style={{ ...pop(t, m.t + 0.15), ...chip(C.matcha, C.paper, 34), marginTop: 4 }}>{m.sub}</div>}
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 640, display: "flex", justifyContent: "center", gap: 18 }}>
          {TRIO.map((x, i) => (
            <div key={x.id} style={{ ...pop(t, [11.1, 11.65, 11.95][i]), width: 240, height: 170, borderRadius: 26, background: C.matchaDark, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 58, color: C.paper, lineHeight: 1 }}>
                <span style={{ color: C.forest, background: C.banana, borderRadius: 12, padding: "0 10px 3px" }}>{x.letter}</span> {x.level}
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.matchaLight }}>{x.id === "ivc" ? "vena cava" : x.name.toLowerCase()}</div>
            </div>
          ))}
        </div>
      </div>
    </Scene>
  );
};

/* 4. The three openings one by one */
const Strip: React.FC<{ t: number; t0: number; at: Record<DId, number>; lv: Record<DId, number>; ex: Record<DId, number>; hot: DId | null }> = ({ t, t0, at, lv, ex, hot }) => (
  <DarkCard t={t} t0={t0}>
    {TRIO.map((x, i) => {
      const p = ramp(t, at[x.id] - 0.05, at[x.id] + 0.25);
      const isHot = hot === x.id;
      const lp = ramp(t, lv[x.id] - 0.05, lv[x.id] + 0.2);
      const ep = ramp(t, ex[x.id] - 0.05, ex[x.id] + 0.2);
      return (
        <div key={x.id} style={{ position: "absolute", left: 14 + i * 258, top: 16, width: 250, height: 170, display: "flex", flexDirection: "column", alignItems: "center", opacity: p * (isHot || hot === null ? 1 : 0.62), transform: `translateY(${(1 - p) * 30}px)` }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ minWidth: 70, height: 58, borderRadius: 29, background: isHot ? C.banana : C.matcha, color: isHot ? C.forest : C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 38, display: "flex", alignItems: "center", justifyContent: "center" }}>{x.letter}</div>
            <div style={{ opacity: lp, transform: `scale(${0.6 + 0.4 * lp})`, minWidth: 90, height: 58, borderRadius: 29, background: C.paper, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 38, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 10px" }}>{x.level}</div>
          </div>
          <div style={{ marginTop: 10, fontFamily: FONT, fontWeight: 800, fontSize: x.name.length > 6 ? 36 : 40, color: C.paper, lineHeight: 1.05, textAlign: "center" }}>{x.name}</div>
          <div style={{ marginTop: 4, fontFamily: FONT, fontWeight: 800, fontSize: 25, color: C.matchaLight, lineHeight: 1.1, textAlign: "center", opacity: ep }}>{x.extra}</div>
        </div>
      );
    })}
  </DarkCard>
);
export const V4: React.FC = () => {
  const t = useT();
  const at = { ivc: 13.5, eso: 18.21, ao: 21.93 };
  const lv = { ivc: 14.77, eso: 18.97, ao: 22.56 };
  const ex = { ivc: 15.92, eso: 19.72, ao: 23.37 };
  let hot: DId | null = null;
  (["ivc", "eso", "ao"] as DId[]).forEach((id) => { if (t >= at[id]) hot = id; });
  if (t >= 24.1) hot = null;
  return (
    <Scene start={12.9} end={24.6} push={0.01}>
      <Stage t={t} start={12.9} steps={[
        { t: 12.9, zoom: [1.0, 0.5, 0.5], focus: [] },
        { t: 13.45, zoom: [1.35, 0.46, 0.34], focus: ["ivc"] },
        { t: 15.85, zoom: [1.35, 0.42, 0.3], focus: ["ivc", "tendon"] },
        { t: 17.25, zoom: [1.4, 0.66, 0.44], focus: ["eso"] },
        { t: 19.65, zoom: [1.4, 0.66, 0.44], focus: ["eso", "vag"] },
        { t: 20.95, zoom: [1.35, 0.76, 0.62], focus: ["ao"] },
        { t: 23.3, zoom: [1.35, 0.76, 0.62], focus: ["ao", "duct"] },
        { t: 24.0, zoom: [1.0, 0.5, 0.5], focus: [] },
      ]} props={{ all: true, dimFrom: 13.0, show: { lv8: 14.77, lv10: 18.97, lv12: 22.56 }, lit: { ivc: 13.5, tendon: 15.92, eso: 18.21, vag: 19.72, ao: 21.93, duct: 23.37 } }}
        lab={{ labels: { ivc: 13.6, tendon: 16.0, eso: 18.3, vag: 19.8, ao: 22.0, duct: 23.45 }, labelEnd: { ivc: 17.1, tendon: 17.1, eso: 20.8, vag: 20.8, ao: 23.95, duct: 23.95 }, levels: { ivc: 14.77, eso: 18.97, ao: 22.56 } }} />
      <Strip t={t} t0={12.95} at={at} lv={lv} ex={ex} hot={hot} />
      <Stamp t0={24.1} text="HIGH → LOW" size={40} rot={-6} color={C.matcha} style={{ left: 60, top: 560 }} />
    </Scene>
  );
};

/* 5. Bonus: count the letters */
const ROWS: { word: string; start: number; end: number; n: number; tag?: [string, number] }[] = [
  { word: "VENA CAVA", start: 26.44, end: 27.07, n: 8 },
  { word: "OESOPHAGUS", start: 27.63, end: 28.96, n: 10, tag: ["UK spelling", 28.29] },
  { word: "AORTIC HIATUS", start: 29.59, end: 30.64, n: 12 },
];
export const V5: React.FC = () => {
  const t = useT();
  return (
    <Scene start={24.6} end={31.4}>
      <div style={{ position: "absolute", left: 10, top: 20, width: 840, height: 880, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 24.62, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 46, display: "flex", justifyContent: "center", gap: 16, alignItems: "center" }}>
          <div style={{ ...pop(t, 24.71), ...chip(C.banana, C.forest, 38) }}>BONUS TRICK</div>
          <div style={{ ...pop(t, 25.34), fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper }}>count the letters</div>
        </div>
        {ROWS.map((r, ri) => {
          const letters = r.word.split("");
          const nL = letters.filter((c) => c !== " ").length;
          const rowTop = 190 + ri * 220;
          const vis = ramp(t, r.start - 0.15, r.start + 0.1);
          let k = 0;
          const done = t >= r.end;
          return (
            <div key={ri} style={{ position: "absolute", left: 0, top: rowTop, width: 840, height: 200, opacity: vis }}>
              <div style={{ position: "absolute", left: 36, top: 0, display: "flex", gap: 5 }}>
                {letters.map((c, i) => {
                  if (c === " ") return <div key={i} style={{ width: 16 }} />;
                  const idx = k++;
                  const tt = r.start + (idx / nL) * Math.max(0.35, r.end - r.start - 0.1);
                  const p = ramp(t, tt - 0.04, tt + 0.1);
                  return (
                    <div key={i} style={{ width: 46, height: 66, borderRadius: 12, background: done ? C.matcha : p > 0.5 ? C.paper : C.matchaDark, color: done ? C.paper : C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 38, display: "flex", alignItems: "center", justifyContent: "center", transform: `translateY(${(1 - p) * 14}px) scale(${0.85 + 0.15 * p})` }}>
                      <span style={{ opacity: Math.max(0.25, p) }}>{c}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ position: "absolute", left: 36, top: 84, display: "flex", gap: 6 }}>
                {Array.from({ length: nL }).map((_, i) => {
                  const tt = r.start + (i / nL) * Math.max(0.35, r.end - r.start - 0.1);
                  return <div key={i} style={{ width: 46, height: 8, borderRadius: 4, background: t >= tt ? C.banana : C.matchaDark, marginRight: i < nL - 1 ? -1 : 0 }} />;
                })}
              </div>
              {r.tag && <div style={{ position: "absolute", left: 36, top: 112, ...pop(t, r.tag[1]), ...chip(C.paper, C.forest, 28), transformOrigin: "0 50%" }}>{r.tag[0]}</div>}
              <div style={{ position: "absolute", right: 30, top: -6, width: 120, height: 120, borderRadius: 60, background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 60, display: "flex", alignItems: "center", justifyContent: "center", ...pop(t, r.end) }}>{r.n}</div>
              <div style={{ position: "absolute", right: 30, top: 122, width: 120, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.matchaLight, opacity: ramp(t, r.end + 0.1, r.end + 0.3) }}>T{r.n}</div>
            </div>
          );
        })}
      </div>
    </Scene>
  );
};

/* 6. Gray's 1918 plate (under surface) with modern labels */
const PX = 30, PW = 800, PH = PW / ASPECT_D, PA = 31.4, PB = 34.5;
const PZ0: [number, number, number] = [1.0, 0.5, 0.45], PZ1: [number, number, number] = [1.12, 0.52, 0.45];
const plateMap = (t: number, fx: number, fy: number): [number, number] => {
  const k = ramp(t, PA, PB);
  const sc = PZ0[0] + (PZ1[0] - PZ0[0]) * k, cx = PZ0[1] + (PZ1[1] - PZ0[1]) * k, cy = PZ0[2] + (PZ1[2] - PZ0[2]) * k;
  const cl = (v: number, m: number) => Math.max(-m, Math.min(m, v));
  const tx = cl(-(cx - 0.5) * PW * sc, (sc - 1) * PW / 2), ty = cl(-(cy - 0.5) * PH * sc, (sc - 1) * PH / 2);
  return [PX + PW / 2 + (fx * PW - PW / 2) * sc + tx, PH / 2 + (fy * PH - PH / 2) * sc + ty];
};
const PL: { id: DId; text: string; t: number; px: number; py: number; color: string }[] = [
  { id: "ivc", text: "IVC · T8", t: 31.75, px: 190, py: 120, color: "#3F6CA8" },
  { id: "eso", text: "Esophagus · T10", t: 32.15, px: 650, py: 175, color: "#DA907E" },
  { id: "ao", text: "Aorta · T12", t: 32.55, px: 210, py: 520, color: C.red },
];
export const V6: React.FC = () => {
  const t = useT();
  return (
    <Scene start={31.4} end={34.5} push={0.01}>
      <Plate src="plates/diaphragm.png" aspect={ASPECT_D} x={PX} y={0} w={PW} a={PA} b={PB} zoomFrom={PZ0} zoomTo={PZ1} credit="Gray's Anatomy, 1918 · public domain" />
      <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: 1 - ramp(t, PB - 0.1, PB + 0.35) }}>
        {PL.map((l, i) => {
          const p = ramp(t, l.t - 0.1, l.t + 0.25);
          if (p <= 0) return null;
          const [ax, ay] = plateMap(t, HOLE[l.id][0], HOLE[l.id][1]);
          const ww = l.text.length * 17.5 + 44;
          return (
            <g key={i} opacity={Math.min(1, p * 1.5)}>
              <line x1={ax} y1={ay} x2={ax + (l.px - ax) * p} y2={ay + (l.py - ay) * p} stroke={C.forest} strokeWidth={5} strokeLinecap="round" />
              <circle cx={ax} cy={ay} r={13} fill={C.banana} stroke={C.forest} strokeWidth={4.5} />
              <g transform={`translate(${l.px} ${l.py}) scale(${0.8 + 0.2 * p})`}>
                <rect x={-ww / 2} y={-30} width={ww} height={60} rx={18} fill={C.forest} stroke={C.forest} strokeWidth={3} />
                <circle cx={-ww / 2 + 26} cy={0} r={10} fill={l.color} stroke={C.paper} strokeWidth={3} />
                <text x={14} y={11} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill={C.paper}>{l.text}</text>
              </g>
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: 0, top: PH + 26, width: 860, display: "flex", justifyContent: "center", gap: 12, ...pop(t, 33.0) }}>
        <div style={{ ...chip(C.banana, C.forest, 27) }}>1918 atlas name: “vena caval foramen”</div>
      </div>
      <div style={{ position: "absolute", left: 0, top: PH + 98, width: 860, display: "flex", justifyContent: "center", ...pop(t, 33.3) }}>
        <div style={{ ...chip(C.forest, C.paper, 25) }}>today: caval opening · view from below</div>
      </div>
    </Scene>
  );
};

/* 7. Quick test */
export const C0 = 36.86;
export const V7: React.FC = () => {
  const t = useT();
  const n = t < C0 ? null : t < C0 + 0.5 ? 3 : t < C0 + 1.0 ? 2 : t < C0 + 1.5 ? 1 : null;
  const k = Math.floor((t - C0) / 0.5) * 0.5 + C0;
  return (
    <Scene start={34.5} end={38.3}>
      <div style={{ position: "absolute", left: 10, top: 30, width: 840, height: 860, borderRadius: 48, background: C.forest, ...pop(t, 34.55, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 52, display: "flex", justifyContent: "center" }}>
          <div style={{ background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, padding: "8px 28px 11px 36px", borderRadius: 18 }}>QUICK TEST</div>
        </div>
        <div style={{ position: "absolute", left: 40, width: 760, top: 170, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 68, lineHeight: 1.14, color: C.paper, ...pop(t, 35.27) }}>
          What passes through at <span style={{ background: C.banana, color: C.forest, borderRadius: 16, padding: "0 14px 4px", display: "inline-block" }}>T10?</span>
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 420, display: "flex", justifyContent: "center", gap: 20 }}>
          {TRIO.map((x, i) => {
            const q = x.id === "eso";
            return (
              <div key={x.id} style={{ ...pop(t, 35.9 + i * 0.12), width: 220, height: 150, borderRadius: 24, background: q ? C.banana : C.matchaDark, border: q ? `4px dashed ${C.forest}` : "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: q ? 84 : 44, color: q ? C.forest : C.matchaLight, lineHeight: 1 }}>{q ? "?" : "··"}</div>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: q ? C.forest : C.paper, marginTop: 6 }}>{x.level}</div>
              </div>
            );
          })}
        </div>
        {n && (
          <div style={{ position: "absolute", left: 0, width: 840, top: 640, display: "flex", justifyContent: "center", transform: `scale(${1.3 - 0.3 * ramp(t, k, k + 0.15)})` }}>
            <div style={{ width: 150, height: 150, borderRadius: 75, background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 104, lineHeight: "150px", textAlign: "center" }}>{n}</div>
          </div>
        )}
      </div>
    </Scene>
  );
};

/* 8. Answer: esophagus */
export const V8: React.FC = () => {
  const t = useT();
  return (
    <Scene start={38.3} end={40.2} push={0.01}>
      <Stage t={t} start={38.3} h={680} steps={[{ t: 38.3, zoom: [1.4, 0.66, 0.44], focus: ["eso"] }]}
        props={{ all: true, dimFrom: 38.32, show: { lv10: 38.4 }, lit: { eso: 38.4 } }} lab={{ labels: { eso: 38.5 }, levels: { eso: 38.4 } }} />
      <DarkCard t={t} t0={38.34}>
        <div style={{ position: "absolute", left: 0, width: 800, top: 22, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 66, color: C.paper, letterSpacing: -1, ...pop(t, 38.45) }}>Esophagus ✓</div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 118, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.matchaLight, ...pop(t, 39.14) }}>
          <span style={{ background: C.banana, color: C.forest, borderRadius: 12, padding: "0 12px 3px" }}>10 Eggs</span> → T10
        </div>
      </DarkCard>
    </Scene>
  );
};

/* 9. Save */
export const V9: React.FC = () => {
  const t = useT();
  const b = ramp(t, 40.3, 40.65);
  return (
    <Scene start={40.2} end={42.4}>
      <div style={center(40, pop(t, 40.25))}>
        <svg width={220} height={280} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={center(360, pop(t, 40.4))}>
        <Big size={120}>SAVE THIS</Big>
      </div>
      <div style={center(510, pop(t, 41.28))}>
        <Big size={58} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ ...center(640), gap: 16, alignItems: "center", ...pop(t, 41.6) }}>
        {TRIO.map((x) => (
          <div key={x.id} style={{ width: 210, height: 110, borderRadius: 22, background: x.id === "eso" ? C.banana : C.matcha, color: x.id === "eso" ? C.forest : C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 52, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            {x.letter}<span style={{ fontSize: 40, opacity: 0.85 }}>{x.level}</span>
          </div>
        ))}
      </div>
    </Scene>
  );
};

/* 10. End card */
export const V10: React.FC = () => {
  const t = useT();
  return (
    <Scene start={42.4} end={46.6}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, 42.45, 0.35) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.matchaLight, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 43.53, 43.85) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 42.6) * 5))})`, opacity: ramp(t, 42.6, 42.9) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
