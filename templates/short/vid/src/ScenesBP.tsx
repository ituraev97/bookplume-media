import React from "react";
import { C, FONT, Scene, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { PARTS, PCOL, Part, Plexus } from "./PlexusBP";

export const ASPECT_SITU = 1995 / 1555;
export const ASPECT_PLAN = 2065 / 1713;
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
/* the "1918 plan" crop has one word of page text at its top-left corner: cover it (page text at the crop edge only) */
const PLAN_COVER = [{ x: 0, y: 0, w: 0.16, h: 0.025 }];

/* 1. Hook: Gray 1918 Fig. 808 (plexus in the neck/axilla), push in */
export const V1: React.FC = () => {
  const t = useT();
  const W = 760, X = 50, Y = 340;
  return (
    <Scene start={-0.6} end={2.6} push={0.02}>
      <div style={{ position: "absolute", left: 0, top: 20, width: 860, textAlign: "center", ...pop(t, 0.02, 0.25) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.matcha, letterSpacing: 5 }}>CAN YOU NAME</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 84, color: C.forest, letterSpacing: -2, lineHeight: 1.12, marginTop: 6, whiteSpace: "nowrap" }}>
          the <span style={{ background: t >= 0.54 ? C.banana : "transparent", borderRadius: 20, padding: "0 16px 6px" }}>5 parts</span> of the
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 84, color: C.forest, letterSpacing: -2, lineHeight: 1.12, whiteSpace: "nowrap", opacity: ramp(t, 1.38, 1.6) }}>brachial plexus?</div>
      </div>
      <Plate src="plates/situ.png" aspect={ASPECT_SITU} x={X} y={Y} w={W} a={-0.6} b={2.6} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.55, 0.5, 0.47]}
        labels={[[0.56, 0.33], [0.5, 0.46], [0.44, 0.6]].map(([x, y], i) => ({ x, y, text: "?", t: 1.0 + i * 0.22, hot: true, ox: [90, -90, 90][i], oy: [-40, 10, 40][i] }))} />
    </Scene>
  );
};

/* Diagram stage with camera moves */
type Step = { t: number; zoom: [number, number, number]; focus: Part[]; items?: string[] };
const SH = 600;
const Stage: React.FC<{ t: number; start: number; steps: Step[]; props: Partial<React.ComponentProps<typeof Plexus>>; top?: number; children?: React.ReactNode }> = ({ t, start, steps, props, top = 10, children }) => {
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
    <div style={{ position: "absolute", left: 0, top, width: 860, height: SH, overflow: "hidden", borderRadius: 36, background: C.card, border: `3px solid ${C.line}`, ...pop(t, start, 0.35) }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 860, height: SH, transform: `scale(${s})`, transformOrigin: `${zx * 100}% ${zy * 100}%` }}>
        <Plexus t={t} focus={cur.focus} focusItems={cur.items ?? []} {...props} />
      </div>
      {children}
      <div style={{ position: "absolute", left: 14, bottom: 10, fontFamily: FONT, fontWeight: 700, fontSize: 18, color: C.forest, background: "rgba(255,254,246,0.9)", padding: "2px 10px", borderRadius: 8, opacity: 0.7 }}>Book Plume diagram · right side, simplified</div>
    </div>
  );
};

const DarkCard: React.FC<{ t: number; t0: number; children: React.ReactNode; top?: number; h?: number }> = ({ t, t0, children, top = 640, h = 270 }) => (
  <div style={{ position: "absolute", left: 30, width: 800, top, height: h, borderRadius: 36, background: C.forest, boxShadow: "0 14px 30px rgba(31,42,20,0.25)", ...pop(t, t0, 0.3) }}>{children}</div>
);
const row = (top: number): React.CSSProperties => ({ position: "absolute", left: 0, width: 800, top, display: "flex", justifyContent: "center", alignItems: "center", gap: 16 });

/* 2. The whole plexus draws itself */
export const V2: React.FC = () => {
  const t = useT();
  return (
    <Scene start={2.6} end={7.4} push={0.01}>
      <Stage t={t} start={2.6} steps={[{ t: 2.6, zoom: [1.0, 0.5, 0.5], focus: [] }, { t: 5.3, zoom: [1.1, 0.55, 0.5], focus: [] }]}
        props={{ build: 2.75, heads: { roots: 3.0, trunks: 3.3, divs: 3.6, cords: 3.9, branches: 4.2 }, artery: undefined }} />
      <DarkCard t={t} t0={2.7}>
        <div style={row(36)}>
          <div style={{ ...pop(t, 3.0), ...chip(C.banana, C.forest, 46) }}>nerve network</div>
          <div style={{ ...pop(t, 4.5), fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.paper }}>→ your whole arm</div>
        </div>
        <div style={row(150)}>
          {PARTS.map((x, i) => (
            <div key={x.id} style={{ ...pop(t, 5.4 + i * 0.08), width: 58, height: 58, borderRadius: 29, background: x.color, border: `5px solid ${C.paper}` }} />
          ))}
          <div style={{ ...pop(t, 5.95), marginLeft: 14, ...chip(C.matcha, C.paper, 38) }}>+ 1 silly sentence</div>
        </div>
      </DarkCard>
    </Scene>
  );
};

/* 3. Mnemonic card: Randy Travis Drinks Cold Beer */
const MN_T = [7.58, 7.87, 8.28, 8.58, 8.92];
export const V3: React.FC = () => {
  const t = useT();
  return (
    <Scene start={7.4} end={9.62}>
      <div style={{ position: "absolute", left: 10, top: 10, width: 840, height: 900, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 7.4, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 56, display: "flex", justifyContent: "center" }}>
          <div style={{ ...pop(t, 7.45), ...chip(C.paper, C.forest, 36) }}>brachial plexus, in order</div>
        </div>
        {PARTS.map((m, i) => {
          const p = ramp(t, MN_T[i] - 0.06, MN_T[i] + 0.16);
          const y = 170 + i * 136;
          return (
            <div key={m.id} style={{ position: "absolute", left: 70, top: y, width: 700, height: 118, display: "flex", alignItems: "center", gap: 26, opacity: p, transform: `translateX(${(1 - p) * -60}px)` }}>
              <div style={{ width: 118, height: 118, borderRadius: 30, background: m.color, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 92, lineHeight: "118px", textAlign: "center", boxShadow: "0 8px 0 rgba(0,0,0,0.25)", transform: `scale(${1 + 0.12 * Math.sin(p * Math.PI)})` }}>{m.letter}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 84, color: C.paper, letterSpacing: -1 }}>
                <span style={{ color: m.color }}>{m.mn[0]}</span>{m.mn.slice(1)}
              </div>
              <div style={{ marginLeft: "auto", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.matchaLight, opacity: ramp(t, 9.0 + i * 0.06, 9.2 + i * 0.06) }}>{m.word}</div>
            </div>
          );
        })}
      </div>
    </Scene>
  );
};

/* tile strip: R T D C B with counts */
const NUM_T = [10.04, 12.59, 15.16, 18.58, 24.61];
const Tiles: React.FC<{ t: number; at: number[]; hot: number; nums?: number[]; top?: number }> = ({ t, at, hot, nums = NUM_T, top = 26 }) => (
  <>
    {PARTS.map((b, i) => {
      const p = ramp(t, at[i] - 0.05, at[i] + 0.25);
      const isHot = hot === i;
      const np = ramp(t, nums[i] - 0.05, nums[i] + 0.2);
      return (
        <div key={b.id} style={{ position: "absolute", left: 12 + i * 156, top, width: 152, height: 220, display: "flex", flexDirection: "column", alignItems: "center", opacity: Math.max(0.25, p) * (isHot || hot < 0 ? 1 : 0.55), transform: `translateY(${(1 - p) * 20}px) scale(${isHot ? 1.07 : 1})` }}>
          <div style={{ width: 86, height: 86, borderRadius: 43, background: p > 0.5 ? b.color : C.matchaDark, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 52, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: isHot ? `0 0 0 6px ${C.banana}` : "none" }}>{b.letter}</div>
          <div style={{ marginTop: 8, fontFamily: FONT, fontWeight: 800, fontSize: 27, color: isHot ? C.banana : C.paper }}>{b.word}</div>
          <div style={{ marginTop: 2, fontFamily: FONT, fontWeight: 800, fontSize: 52, lineHeight: 1, color: isHot ? C.banana : C.matchaLight, opacity: np, transform: `scale(${0.6 + 0.4 * np + 0.2 * Math.sin(np * Math.PI)})` }}>{b.n}</div>
        </div>
      );
    })}
  </>
);

/* 4. Walk through R-T-D-C-B on the diagram */
const LIT_T = [9.71, 12.26, 14.46, 18.17, 24.07];
export const V4: React.FC = () => {
  const t = useT();
  let hot = -1;
  LIT_T.forEach((x, i) => { if (t >= x - 0.1) hot = i; });
  return (
    <Scene start={9.62} end={26.35} push={0.01}>
      <Stage t={t} start={9.62} steps={[
        { t: 9.62, zoom: [1.0, 0.5, 0.5], focus: [] },
        { t: 9.65, zoom: [1.5, 0.08, 0.5], focus: ["roots"] },
        { t: 12.2, zoom: [1.5, 0.3, 0.5], focus: ["trunks"] },
        { t: 14.4, zoom: [1.5, 0.48, 0.5], focus: ["divs"] },
        { t: 18.1, zoom: [1.45, 0.66, 0.5], focus: ["cords"] },
        { t: 22.5, zoom: [1.3, 0.62, 0.52], focus: ["cords"] },
        { t: 24.0, zoom: [1.0, 0.5, 0.5], focus: ["branches"] },
      ]} props={{ dimFrom: 9.75, lit: { roots: 9.71, trunks: 12.26, divs: 14.46, cords: 18.17, branches: 24.07 }, fb: 17.51, artery: 22.6,
        heads: { roots: 9.62, trunks: 9.62, divs: 9.62, cords: 9.62, branches: 9.62 },
        tags: { C5: 10.83, C6: 10.98, C7: 11.13, C8: 11.28, T1: 11.45, upper: 13.16, middle: 13.38, lower: 13.77, lat: 19.39, post: 19.86, med: 20.63, artery: 22.7 },
        tagEnd: { upper: 14.3, middle: 14.3, lower: 14.3, lat: 23.95, post: 23.95, med: 23.95, artery: 23.95 } }}>
        {t >= 16.0 && t < 18.05 && (
          <div style={{ position: "absolute", left: 30, top: 30, display: "flex", gap: 12, opacity: 1 - ramp(t, 17.85, 18.05) }}>
            <div style={{ ...pop(t, 16.23), ...chip(C.forest, C.paper, 32) }}>each trunk → 2</div>
            <div style={{ ...pop(t, 17.24), ...chip(PCOL.divs, C.forest, 32) }}>front</div>
            <div style={{ ...pop(t, 17.51), ...chip("#7A5FB8", C.paper, 32) }}>back</div>
          </div>
        )}
      </Stage>
      <DarkCard t={t} t0={9.65} h={262}>
        <Tiles t={t} at={LIT_T.map((x) => x - 0.2)} hot={hot} />
      </DarkCard>
    </Scene>
  );
};

/* 5. The numbers: 5-3-6-3-5 */
const N_T = [27.11, 27.56, 27.92, 28.25, 28.49];
export const V5: React.FC = () => {
  const t = useT();
  return (
    <Scene start={26.35} end={29.15}>
      <div style={{ position: "absolute", left: 10, top: 20, width: 840, height: 880, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 26.35, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 60, display: "flex", justifyContent: "center" }}>
          <div style={{ ...pop(t, 26.6), background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 6, padding: "8px 28px 11px 34px", borderRadius: 18 }}>THE NUMBERS</div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 230, display: "flex", justifyContent: "center", gap: 14 }}>
          {PARTS.map((m, i) => {
            const p = ramp(t, N_T[i] - 0.06, N_T[i] + 0.16);
            return (
              <div key={m.id} style={{ width: 148, display: "flex", flexDirection: "column", alignItems: "center", opacity: 0.25 + 0.75 * p }}>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: m.color }}>{m.letter}</div>
                <div style={{ marginTop: 10, width: 140, height: 200, borderRadius: 30, background: p > 0.3 ? m.color : C.matchaDark, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 150, lineHeight: "200px", textAlign: "center", transform: `translateY(${(1 - p) * 40}px) scale(${1 + 0.12 * Math.sin(p * Math.PI)})`, boxShadow: "0 8px 0 rgba(0,0,0,0.25)" }}>{m.n}</div>
                <div style={{ marginTop: 14, fontFamily: FONT, fontWeight: 800, fontSize: 25, color: C.paper }}>{m.word}</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 640, display: "flex", justifyContent: "center", ...pop(t, 28.7) }}>
          <div style={chip(C.matcha, C.paper, 38)}>starts with 5, ends with 5</div>
        </div>
      </div>
    </Scene>
  );
};

/* 6. The five terminal branches */
const BR: { id: string; name: string; t: number; cord: string }[] = [
  { id: "mc", name: "Musculocutaneous", t: 30.26, cord: "L" },
  { id: "ax", name: "Axillary", t: 31.71, cord: "P" },
  { id: "rad", name: "Radial", t: 32.6, cord: "P" },
  { id: "mdn", name: "Median", t: 33.08, cord: "L+M" },
  { id: "uln", name: "Ulnar", t: 33.7, cord: "M" },
];
export const V6: React.FC = () => {
  const t = useT();
  let cur = "";
  BR.forEach((b) => { if (t >= b.t - 0.1) cur = b.id; });
  return (
    <Scene start={29.15} end={34.45} push={0.01}>
      <Stage t={t} start={29.15} steps={[{ t: 29.15, zoom: [1.15, 0.85, 0.5], focus: [], items: [] }, { t: 30.1, zoom: [1.15, 0.85, 0.5], focus: [], items: cur ? [cur] : [] }]}
        props={{ dimFrom: 29.3, lit: { cords: 29.2 }, litItem: Object.fromEntries(BR.map((b) => [b.id, b.t])), tags: Object.fromEntries(BR.map((b) => [b.id, b.t])), heads: { branches: 29.2 } }} />
      <DarkCard t={t} t0={29.2}>
        <div style={{ position: "absolute", left: 0, top: 22, width: 800, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.matchaLight, ...pop(t, 29.3) }}>5 terminal branches · from cord:</div>
        <div style={{ position: "absolute", left: 20, top: 78, width: 760, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "14px 14px" }}>
          {BR.map((b) => (
            <div key={b.id} style={{ ...pop(t, b.t), display: "flex", alignItems: "center", gap: 10, background: cur === b.id ? C.banana : C.matchaDark, borderRadius: 18, padding: "8px 16px 10px 10px" }}>
              <div style={{ minWidth: 44, height: 44, padding: "0 6px", borderRadius: 22, background: PCOL.cords, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>{b.cord}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: cur === b.id ? C.forest : C.paper }}>{b.name}</div>
            </div>
          ))}
        </div>
      </DarkCard>
    </Scene>
  );
};

/* plate -> screen mapping identical to <Plate> */
const mkMap = (X: number, Y: number, W: number, H: number, a: number, b: number, z0: [number, number, number], z1: [number, number, number]) => (t: number, fx: number, fy: number): [number, number] => {
  const k = ramp(t, a, b);
  const sc = z0[0] + (z1[0] - z0[0]) * k, cx = z0[1] + (z1[1] - z0[1]) * k, cy = z0[2] + (z1[2] - z0[2]) * k;
  const cl = (v: number, m: number) => Math.max(-m, Math.min(m, v));
  const tx = cl(-(cx - 0.5) * W * sc, (sc - 1) * W / 2), ty = cl(-(cy - 0.5) * H * sc, (sc - 1) * H / 2);
  return [X + W / 2 + (fx * W - W / 2) * sc + tx, Y + H / 2 + (fy * H - H / 2) * sc + ty];
};
type OL = { f: [number, number]; text: string; t: number; px: number; py: number; color?: string; hot?: boolean };
const Overlay: React.FC<{ t: number; map: (t: number, fx: number, fy: number) => [number, number]; items: OL[]; fade: number }> = ({ t, map, items, fade }) => (
  <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: 1 - ramp(t, fade - 0.1, fade + 0.3) }}>
    {items.map((l, i) => {
      const p = ramp(t, l.t - 0.1, l.t + 0.25);
      if (p <= 0) return null;
      const [ax, ay] = map(t, l.f[0], l.f[1]);
      const ww = l.text.length * 17.4 + (l.color ? 74 : 44);
      if (!l.text) return <circle key={i} cx={ax} cy={ay} r={13 + 4 * Math.sin(t * 8)} fill={C.banana} stroke={C.forest} strokeWidth={4.5} opacity={Math.min(1, p * 1.5)} />;
      return (
        <g key={i} opacity={Math.min(1, p * 1.5)}>
          <line x1={ax} y1={ay} x2={ax + (l.px - ax) * p} y2={ay + (l.py - ay) * p} stroke={C.forest} strokeWidth={5} strokeLinecap="round" />
          <circle cx={ax} cy={ay} r={12} fill={l.hot ? C.red : C.banana} stroke={C.forest} strokeWidth={4.5} />
          <g transform={`translate(${l.px} ${l.py}) scale(${0.8 + 0.2 * p})`}>
            <rect x={-ww / 2} y={-30} width={ww} height={60} rx={18} fill={l.hot ? C.banana : C.forest} stroke={C.forest} strokeWidth={3} />
            {l.color && <circle cx={-ww / 2 + 28} cy={0} r={13} fill={l.color} stroke={l.hot ? C.forest : C.paper} strokeWidth={3} />}
            <text x={l.color ? 14 : 0} y={11} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={31} fill={l.hot ? C.forest : C.paper}>{l.text}</text>
          </g>
        </g>
      );
    })}
  </svg>
);

/* 7. Gray 1918 Fig. 807 "Plan of brachial plexus" with R-T-D-C-B on top + old-name note */
/* points ON the structures, fractions of plan.png (checked on a fraction grid) */
export const PP: Record<"roots" | "trunk" | "divs" | "cord" | "branch" | "oldname", [number, number]> = {
  roots: [0.765, 0.355], // VII C. root
  trunk: [0.66, 0.385], // middle trunk
  divs: [0.45, 0.42], // upper trunk dividing
  cord: [0.37, 0.6], // posterior cord
  branch: [0.08, 0.84], // median nerve
  oldname: [0.27, 0.425], // "Lateral anterior thoracic" label
};
const QX = 80, QY = 170, QW = 700, QH = QW / ASPECT_PLAN, QA = 34.45, QB = 37.75;
const QZ0: [number, number, number] = [1.0, 0.5, 0.5], QZ1: [number, number, number] = [1.0, 0.5, 0.5];
const qmap = mkMap(QX, QY, QW, QH, QA, QB, QZ0, QZ1);
export const V7: React.FC = () => {
  const t = useT();
  return (
    <Scene start={QA} end={QB} push={0.005}>
      <div style={{ position: "absolute", left: 0, top: 6, width: 860, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.matcha, letterSpacing: 4, ...pop(t, 34.55) }}>SAME PLAN · 1918 ATLAS</div>
      <Plate src="plates/plan.png" aspect={ASPECT_PLAN} x={QX} y={QY} w={QW} a={QA} b={QB} zoomFrom={QZ0} zoomTo={QZ1} covers={PLAN_COVER} credit="Gray's Anatomy, 1918 · public domain" />
      <Overlay t={t} map={qmap} fade={QB} items={[
        { f: PP.roots, text: "Roots", t: 34.9, px: 690, py: 112, color: PCOL.roots },
        { f: PP.trunk, text: "Trunks", t: 35.2, px: 450, py: 112, color: PCOL.trunks },
        { f: PP.divs, text: "Divisions", t: 35.5, px: 175, py: 112, color: PCOL.divs },
        { f: PP.oldname, text: "", t: 36.6, px: 0, py: 0 },
        { f: PP.branch, text: "Branches", t: 36.1, px: 160, py: QY + QH + 28, color: PCOL.branches },
        { f: PP.cord, text: "Cords", t: 35.8, px: 420, py: QY + QH + 28, color: PCOL.cords },
      ]} />
      <div style={{ position: "absolute", left: 0, top: QY + QH + 72, width: 860, display: "flex", justifyContent: "center", ...pop(t, 36.6) }}>
        <div style={{ ...chip(C.banana, C.forest, 27) }}>1918 atlas name: “lateral anterior thoracic”</div>
      </div>
      <div style={{ position: "absolute", left: 0, top: QY + QH + 126, width: 860, display: "flex", justifyContent: "center", ...pop(t, 36.85) }}>
        <div style={{ ...chip(C.forest, C.paper, 25) }}>today: lateral pectoral nerve</div>
      </div>
    </Scene>
  );
};

/* 8. Quick test */
export const C0 = 40.4;
const CORDS3 = [{ k: "Lateral" }, { k: "Posterior" }, { k: "Medial" }];
export const V8: React.FC = () => {
  const t = useT();
  const n = t < C0 ? null : t < C0 + 0.5 ? 3 : t < C0 + 1.0 ? 2 : t < C0 + 1.5 ? 1 : null;
  const k = Math.floor((t - C0) / 0.5) * 0.5 + C0;
  return (
    <Scene start={37.75} end={41.92}>
      <div style={{ position: "absolute", left: 10, top: 20, width: 840, height: 880, borderRadius: 48, background: C.forest, ...pop(t, 37.76, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 50, display: "flex", justifyContent: "center" }}>
          <div style={{ background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, padding: "8px 28px 11px 36px", borderRadius: 18 }}>QUICK TEST</div>
        </div>
        <div style={{ position: "absolute", left: 40, width: 760, top: 160, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 64, lineHeight: 1.18, color: C.paper, ...pop(t, 38.59) }}>
          Which <span style={{ color: PCOL.cords }}>cord</span> gives you the <span style={{ background: C.banana, color: C.forest, borderRadius: 16, padding: "0 14px 4px", display: "inline-block" }}>radial</span> nerve?
        </div>
        <div style={{ position: "absolute", left: 0, top: 420, width: 840, display: "flex", justifyContent: "center", gap: 18 }}>
          {CORDS3.map((c, i) => (
            <div key={c.k} style={{ ...pop(t, 39.9 + i * 0.12), width: 240, height: 150, borderRadius: 28, background: C.matchaDark, border: `4px solid ${PCOL.cords}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 52, color: PCOL.cords, lineHeight: 1 }}>{c.k[0]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.paper, marginTop: 6 }}>{c.k}</div>
            </div>
          ))}
        </div>
        {n && (
          <div style={{ position: "absolute", left: 0, width: 840, top: 640, display: "flex", justifyContent: "center", transform: `scale(${1.3 - 0.3 * ramp(t, k, k + 0.15)})` }}>
            <div style={{ width: 160, height: 160, borderRadius: 80, background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 110, lineHeight: "160px", textAlign: "center" }}>{n}</div>
          </div>
        )}
      </div>
    </Scene>
  );
};

/* 9. Answer: posterior cord (-> radial + axillary) */
export const V9: React.FC = () => {
  const t = useT();
  return (
    <Scene start={41.92} end={45.42} push={0.01}>
      <Stage t={t} start={41.92} steps={[{ t: 41.92, zoom: [1.08, 0.8, 0.5], focus: [], items: ["post", "rad"] }, { t: 43.8, zoom: [1.08, 0.8, 0.47], focus: [], items: ["post", "rad", "ax"] }]}
        props={{ dimFrom: 41.95, litItem: { post: 41.98, rad: 42.2, ax: 43.86 }, tags: { post: 42.0, rad: 42.2, ax: 43.86 } }} />
      <DarkCard t={t} t0={41.95} h={250}>
        <div style={{ position: "absolute", left: 0, width: 800, top: 26, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 74, color: C.paper, letterSpacing: -1, ...pop(t, 41.98) }}>
          <span style={{ color: PCOL.cords }}>Posterior</span> cord ✓
        </div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 142, display: "flex", justifyContent: "center", alignItems: "center", gap: 14 }}>
          <div style={{ ...pop(t, 42.3), ...chip(PCOL.branches, C.forest, 40) }}>radial</div>
          <div style={{ ...pop(t, 43.86), fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper }}>+</div>
          <div style={{ ...pop(t, 43.9), ...chip(C.banana, C.forest, 40) }}>axillary too</div>
        </div>
      </DarkCard>
    </Scene>
  );
};

/* 10. Save */
export const V10: React.FC = () => {
  const t = useT();
  const b = ramp(t, 45.5, 45.85);
  return (
    <Scene start={45.42} end={47.62}>
      <div style={center(30, pop(t, 45.45))}>
        <svg width={220} height={280} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={center(350, pop(t, 45.5))}>
        <Big size={120}>SAVE THIS</Big>
      </div>
      <div style={center(500, pop(t, 46.45))}>
        <Big size={58} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ ...center(640), gap: 12, alignItems: "center" }}>
        {PARTS.map((x, i) => (
          <div key={x.id} style={{ ...pop(t, 46.6 + i * 0.08), width: 152, height: 170, borderRadius: 26, background: x.color, color: C.forest, fontFamily: FONT, fontWeight: 800, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 72, lineHeight: 1 }}>{x.letter}</div>
            <div style={{ fontSize: 22, marginTop: 4 }}>{x.mn}</div>
            <div style={{ fontSize: 30, marginTop: 2 }}>{x.n}</div>
          </div>
        ))}
      </div>
    </Scene>
  );
};

/* 11. End card */
export const END_T = 52.1;
export const V11: React.FC = () => {
  const t = useT();
  return (
    <Scene start={47.62} end={END_T}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, 47.65, 0.35) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.matchaLight, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 48.7, 49.0) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 47.8) * 5))})`, opacity: ramp(t, 47.8, 48.1) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
export const V12: React.FC = () => null;
