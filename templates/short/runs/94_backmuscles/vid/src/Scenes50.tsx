import React from "react";
import { C, FONT, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { OCOL, Org, Section, SecProps, Wall, WallProps } from "./Retro50";

export const ASPECT_WALL = 1747 / 1986;
export const ASPECT_XSEC = 1814 / 1217;
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
export const MNEM = "SADPUCKER";

/* plate -> screen mapping identical to <Plate> */
const mkMap = (X: number, Y: number, W: number, H: number, a: number, b: number, z0: [number, number, number], z1: [number, number, number]) => (t: number, fx: number, fy: number): [number, number] => {
  const k = ramp(t, a, b);
  const sc = z0[0] + (z1[0] - z0[0]) * k, cx = z0[1] + (z1[1] - z0[1]) * k, cy = z0[2] + (z1[2] - z0[2]) * k;
  const cl = (v: number, m: number) => Math.max(-m, Math.min(m, v));
  const tx = cl(-(cx - 0.5) * W * sc, (sc - 1) * W / 2), ty = cl(-(cy - 0.5) * H * sc, (sc - 1) * H / 2);
  return [X + W / 2 + (fx * W - W / 2) * sc + tx, Y + H / 2 + (fy * H - H / 2) * sc + ty];
};
type OL = { f: [number, number]; text: string; t: number; px: number; py: number; color?: string; hot?: boolean; end?: number };
const Overlay: React.FC<{ t: number; map: (t: number, fx: number, fy: number) => [number, number]; items: OL[]; fade: number }> = ({ t, map, items, fade }) => (
  <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: 1 - ramp(t, fade - 0.1, fade + 0.3) }}>
    {items.map((l, i) => {
      const p = ramp(t, l.t - 0.1, l.t + 0.25) * (l.end ? 1 - ramp(t, l.end, l.end + 0.3) : 1);
      if (p <= 0) return null;
      const [ax, ay] = map(t, l.f[0], l.f[1]);
      const ww = l.text.length * 17.4 + (l.color ? 74 : 44);
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

/* camera stage around one of our diagrams */
type Step = { t: number; zoom: [number, number, number] };
const SH = 620;
const Stage: React.FC<{ t: number; start: number; steps: Step[]; children: React.ReactNode; caption?: string; overlay?: React.ReactNode }> = ({ t, start, steps, children, caption = "Book Plume diagram · simplified", overlay }) => {
  let ci = 0;
  steps.forEach((s, i) => { if (t >= s.t) ci = i; });
  const cur = steps[ci];
  const prev = steps[Math.max(0, ci - 1)];
  const k = ci === 0 ? 1 : ramp(t, cur.t, cur.t + 0.8);
  const zs = prev.zoom[0] + (cur.zoom[0] - prev.zoom[0]) * k;
  const zx = prev.zoom[1] + (cur.zoom[1] - prev.zoom[1]) * k;
  const zy = prev.zoom[2] + (cur.zoom[2] - prev.zoom[2]) * k;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 860, height: SH, overflow: "hidden", borderRadius: 36, background: C.card, border: `3px solid ${C.line}`, ...pop(t, start, 0.35) }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 860, height: SH, transform: `scale(${zs})`, transformOrigin: `${zx * 100}% ${zy * 100}%` }}>{children}</div>
      {overlay}
      <div style={{ position: "absolute", left: 14, bottom: 10, fontFamily: FONT, fontWeight: 700, fontSize: 18, color: C.forest, background: "rgba(255,254,246,0.9)", padding: "2px 10px", borderRadius: 8, opacity: 0.75 }}>{caption}</div>
    </div>
  );
};
const DarkCard: React.FC<{ t: number; t0: number; children: React.ReactNode; top?: number; h?: number }> = ({ t, t0, children, top = 650, h = 270 }) => (
  <div style={{ position: "absolute", left: 30, width: 800, top, height: h, borderRadius: 36, background: C.forest, boxShadow: "0 14px 30px rgba(31,42,20,0.25)", overflow: "hidden", ...pop(t, t0, 0.3) }}>{children}</div>
);
const row = (top: number): React.CSSProperties => ({ position: "absolute", left: 0, width: 800, top, display: "flex", justifyContent: "center", alignItems: "center", gap: 16 });
const Page: React.FC<{ t: number; a: number; b: number; children: React.ReactNode }> = ({ t, a, b, children }) => {
  if (t < a - 0.1 || t > b + 0.3) return null;
  const i = ramp(t, a, a + 0.3), o = ramp(t, b - 0.05, b + 0.2);
  return <div style={{ position: "absolute", inset: 0, opacity: i * (1 - o), transform: `translateY(${(1 - i) * 30 - o * 30}px)` }}>{children}</div>;
};
const LetterTiles: React.FC<{ t: number; times: number[]; size?: number; dark?: boolean; cur?: number }> = ({ t, times, size = 70, dark = true, cur = -1 }) => (
  <div style={{ display: "flex", gap: size * 0.12, alignItems: "flex-end" }}>
    {MNEM.split("").map((l, i) => {
      const p = ramp(t, times[i] - 0.05, times[i] + 0.2);
      const now = i === cur;
      return (
        <React.Fragment key={i}>
          {i === 3 && <div style={{ width: size * 0.32 }} />}
          <div style={{ width: size, height: size * 1.12, borderRadius: size * 0.22, background: p > 0.5 ? C.banana : dark ? C.matchaDark : C.line, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: size * 0.7, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.35 + 0.65 * p, transform: `translateY(${now ? -8 : 0}px) scale(${1 + 0.14 * Math.sin(p * Math.PI)})`, boxShadow: now ? `0 0 0 5px ${C.paper}` : "0 6px 0 rgba(0,0,0,0.22)" }}>{l}</div>
        </React.Fragment>
      );
    })}
  </div>
);

/* ---------- 1. Hook: Gray 1918 Fig. 531, push in ---------- */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={2.5} push={0.02}>
      <div style={{ position: "absolute", left: 0, top: 56, width: 860, textAlign: "center", ...pop(t, 0.02, 0.25) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.matcha, letterSpacing: 5 }}>CAN YOU NAME THE</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 82, color: C.forest, letterSpacing: -2, lineHeight: 1.05, marginTop: 8 }}>
          <span style={{ background: t >= 0.6 ? C.banana : "transparent", borderRadius: 20, padding: "0 14px 6px" }}>Retroperitoneal</span>
          <br />
          organs?
        </div>
      </div>
      <Plate src="plates/postwall.png" aspect={ASPECT_WALL} x={190} y={350} w={480} a={-0.6} b={2.5} zoomFrom={[1.0, 0.5, 0.45]} zoomTo={[1.3, 0.5, 0.42]}
        labels={[
          { x: 0.27, y: 0.47, text: "?", t: 1.0, hot: true, ox: -60, oy: 50 },
          { x: 0.55, y: 0.56, text: "?", t: 1.35, hot: true, ox: 60, oy: 40 },
          { x: 0.615, y: 0.265, text: "?", t: 1.7, hot: true, ox: 70, oy: -40 },
        ]} />
    </Scene>
  );
};

/* ---------- 2. One word: SAD PUCKER ---------- */
export const V2: React.FC = () => {
  const t = useT();
  const T = [4.15, 4.2, 4.25, 4.43, 4.48, 4.53, 4.58, 4.63, 4.68];
  return (
    <Scene start={2.5} end={5.15}>
      <div style={{ position: "absolute", left: 10, top: 20, width: 840, height: 880, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 2.5, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 70, display: "flex", justifyContent: "center" }}>
          <div style={{ ...pop(t, 2.65), background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 6, padding: "8px 28px 11px 34px", borderRadius: 18 }}>ONE WORD</div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 180, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.paper, ...pop(t, 3.43) }}>
          gets you <span style={{ color: C.banana }}>all</span> of them
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 330, display: "flex", justifyContent: "center" }}>
          <LetterTiles t={t} times={T} size={74} />
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 470, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 96, letterSpacing: 4, color: C.banana, opacity: ramp(t, 4.5, 4.75), transform: `scale(${0.9 + 0.1 * ramp(t, 4.5, 4.75)})` }}>
          SAD PUCKER
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 640, display: "flex", justifyContent: "center", gap: 14, ...pop(t, 4.85) }}>
          <div style={chip(C.matcha, C.paper, 34)}>9 letters</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper }}>→</div>
          <div style={chip(C.paper, C.forest, 34)}>every organ</div>
        </div>
      </div>
      <Stamp t0={4.43} text="MNEMONIC" size={52} rot={-8} color={C.red} style={{ left: 470, top: 760 }} />
    </Scene>
  );
};

/* ---------- 3. What retroperitoneal means: horizontal section ---------- */
export const V3: React.FC = () => {
  const t = useT();
  const props: Omit<SecProps, "t"> = {
    build: 5.2,
    perit: [7.05],
    lining: [8.13, 9.6],
    back: [10.6],
    organs: [9.86],
    front: [12.97],
    tags: [
      { x: 160, y: 120, text: "Peritoneum", w: [7.1], hot: true },
      { x: 650, y: 236, text: "Abdominal cavity", w: [8.2, 10.4] },
    ],
  };
  return (
    <Scene start={5.15} end={13.75} push={0.005}>
      <Stage t={t} start={5.15} steps={[{ t: 5.15, zoom: [1.0, 0.5, 0.5] }, { t: 10.5, zoom: [1.18, 0.5, 0.72] }]} caption="Book Plume diagram · cross-section, simplified">
        <Section t={t} {...props} />
      </Stage>
      <DarkCard t={t} t0={5.2}>
        <Page t={t} a={5.2} b={9.6}>
          <div style={row(36)}>
            <div style={{ ...pop(t, 5.31), ...chip(C.banana, C.forest, 50) }}>RETRO</div>
            <div style={{ ...pop(t, 5.6), fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper }}>=</div>
            <div style={{ ...pop(t, 6.59), fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.matchaLight }}>behind</div>
          </div>
          <div style={row(150)}>
            <div style={{ ...pop(t, 7.05), ...chip(C.redLight, C.forest, 40) }}>peritoneum</div>
            <div style={{ ...pop(t, 8.13), fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.paper }}>= lining of the abdomen</div>
          </div>
        </Page>
        <Page t={t} a={9.6} b={13.85}>
          <div style={row(36)}>
            <div style={{ ...pop(t, 9.86), fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.paper }}>sit on the</div>
            <div style={{ ...pop(t, 10.6), ...chip(C.banana, C.forest, 46) }}>back wall</div>
          </div>
          <div style={row(150)}>
            <div style={{ ...pop(t, 11.47), fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.matchaLight }}>peritoneum only</div>
            <div style={{ ...pop(t, 12.97), ...chip(C.redLight, C.forest, 44) }}>in FRONT ↓</div>
          </div>
        </Page>
      </DarkCard>
    </Scene>
  );
};

/* ---------- 4. Letter by letter on the back wall ---------- */
type L4 = { o: Org[]; t: number; name: string; sub?: string; subT?: number; zoom: [number, number, number] };
export const LET: L4[] = [
  { o: ["adr"], t: 13.97, name: "Suprarenal glands", sub: "= adrenal glands", subT: 14.67, zoom: [1.45, 0.5, 0.2] },
  { o: ["aorta", "ivc"], t: 15.43, name: "Aorta + IVC", sub: "inferior vena cava", subT: 16.29, zoom: [1.15, 0.5, 0.55] },
  { o: ["duo"], t: 16.88, name: "Duodenum", sub: "C-shaped loop", subT: 17.4, zoom: [1.5, 0.38, 0.45] },
  { o: ["panc"], t: 18.18, name: "Pancreas", zoom: [1.4, 0.58, 0.38] },
  { o: ["ure"], t: 19.18, name: "Ureters", sub: "kidney → bladder", subT: 19.6, zoom: [1.2, 0.5, 0.78] },
  { o: ["colon"], t: 20.16, name: "Colon", sub: "ascending + descending", subT: 21.02, zoom: [1.0, 0.5, 0.5] },
  { o: ["kid"], t: 22.79, name: "Kidneys", zoom: [1.2, 0.5, 0.4] },
  { o: ["eso"], t: 23.66, name: "Esophagus", sub: "abdominal part", subT: 24.1, zoom: [1.6, 0.6, 0.05] },
  { o: ["rect"], t: 24.62, name: "Rectum", zoom: [1.45, 0.5, 0.98] },
];
const IVC_T = 16.29;
export const V4: React.FC = () => {
  const t = useT();
  const lit: WallProps["lit"] = {};
  const badges: WallProps["badges"] = {};
  LET.forEach((l) => l.o.forEach((o) => { lit[o] = [o === "ivc" ? IVC_T : l.t]; badges[o] = [o === "ivc" ? IVC_T : l.t]; }));
  delete badges.ivc;
  let ci = -1;
  LET.forEach((l, i) => { if (t >= l.t - 0.05) ci = i; });
  const steps: Step[] = [{ t: 13.75, zoom: [1.0, 0.5, 0.5] }, ...LET.map((l) => ({ t: l.t - 0.1, zoom: l.zoom }))];
  return (
    <Scene start={13.75} end={25.6} push={0.004}>
      <Stage t={t} start={13.75} steps={steps} caption="Book Plume diagram · back wall, front view">
        <Wall t={t} build={13.8} lit={lit} badges={badges} dimRest={[14.0]} />
      </Stage>
      <DarkCard t={t} t0={13.8}>
        <div style={{ position: "absolute", left: 0, width: 800, top: 24, display: "flex", justifyContent: "center" }}>
          <LetterTiles t={t} times={LET.map((l) => l.t)} size={54} cur={ci} />
        </div>
        {LET.map((l, i) => {
          const nx = i < LET.length - 1 ? LET[i + 1].t : 25.8;
          return (
            <Page key={i} t={t} a={l.t - 0.05} b={nx - 0.08}>
              <div style={{ position: "absolute", left: 0, width: 800, top: 112, display: "flex", justifyContent: "center", alignItems: "center", gap: 18 }}>
                <div style={{ width: 22, height: 22, borderRadius: 11, background: OCOL[l.o[0]], boxShadow: `0 0 0 4px ${C.paper}` }} />
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64, color: C.paper, letterSpacing: -1, whiteSpace: "nowrap" }}>
                  <span style={{ color: C.banana }}>{l.name[0]}</span>{l.name.slice(1)}
                </div>
              </div>
              {l.sub && (
                <div style={{ position: "absolute", left: 0, width: 800, top: 196, display: "flex", justifyContent: "center", ...pop(t, l.subT ?? l.t) }}>
                  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.matchaLight }}>{l.sub}</div>
                </div>
              )}
            </Page>
          );
        })}
      </DarkCard>
    </Scene>
  );
};

/* ---------- 5. Two catches: tail of pancreas + first part of duodenum ---------- */
export const V5: React.FC = () => {
  const t = useT();
  const all: Org[] = ["adr", "aorta", "ivc", "duo", "panc", "ure", "colon", "kid", "eso", "rect"];
  const lit: WallProps["lit"] = {};
  all.forEach((o) => (lit[o] = [-5, 25.95]));
  return (
    <Scene start={25.6} end={31.75} push={0.004}>
      <Stage t={t} start={25.6} steps={[
        { t: 25.6, zoom: [1.0, 0.5, 0.5] },
        { t: 25.75, zoom: [1.3, 0.55, 0.32] },
        { t: 26.85, zoom: [1.75, 0.76, 0.3] },
        { t: 28.15, zoom: [1.75, 0.42, 0.3] },
        { t: 30.0, zoom: [1.3, 0.55, 0.32] },
      ]} caption="Book Plume diagram · back wall, front view">
        <Wall t={t} lit={{ ...lit, panc: [-5], duo: [-5] }} dimRest={[25.95]} xTail={[26.9]} xCap={[28.2]}
          tags={[
            { x: 700, y: 120, text: "tail", w: [27.26], hot: true },
            { x: 470, y: 130, text: "1st part", w: [28.6], hot: true },
          ]} />
      </Stage>
      <DarkCard t={t} t0={25.65}>
        <div style={{ position: "absolute", left: 40, top: 30, ...pop(t, 25.76) }}>
          <div style={{ width: 110, height: 110, borderRadius: 28, background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 84, lineHeight: "110px", textAlign: "center", boxShadow: "0 8px 0 rgba(0,0,0,0.25)" }}>2</div>
          <div style={{ marginTop: 8, fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.matchaLight, letterSpacing: 2, textAlign: "center" }}>CATCHES</div>
        </div>
        <div style={{ position: "absolute", left: 180, top: 30, display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { t0: 26.9, a: "Tail", b: " of the pancreas" },
            { t0: 28.2, a: "1st part", b: " of the duodenum" },
          ].map((r) => (
            <div key={r.a} style={{ ...pop(t, r.t0), display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 46, height: 46, borderRadius: 23, background: C.red, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.paper, whiteSpace: "nowrap" }}><span style={{ color: C.banana }}>{r.a}</span>{r.b}</div>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 180, top: 182, display: "flex", alignItems: "center", gap: 12, ...pop(t, 30.08) }}>
          <div style={chip(C.redLight, C.forest, 34)}>NOT retroperitoneal</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.matchaLight, opacity: ramp(t, 30.6, 30.9) }}>(duodenal cap)</div>
        </div>
      </DarkCard>
    </Scene>
  );
};

/* ---------- 6. Gray 1918 Fig. 531 with modern labels ---------- */
const QX = 130, QY = 100, QW = 600, QH = QW / ASPECT_WALL, QA = 31.75, QB = 38.45;
const QZ0: [number, number, number] = [1.0, 0.5, 0.5], QZ1: [number, number, number] = [1.07, 0.5, 0.42];
const qmap = mkMap(QX, QY, QW, QH, QA, QB, QZ0, QZ1);
export const PP: Record<string, [number, number]> = {
  kidR: [0.255, 0.47], // "Right Kidney" (viewer's left)
  kidL: [0.74, 0.43],
  adrR: [0.33, 0.295], // R. supra-renal gland
  adrL: [0.62, 0.27],
  aorta: [0.55, 0.57],
  ivc: [0.43, 0.5],
  ureter: [0.375, 0.64],
};
export const V6: React.FC = () => {
  const t = useT();
  return (
    <Scene start={QA} end={QB} push={0.005}>
      <div style={{ position: "absolute", left: 0, top: 46, width: 860, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.matcha, letterSpacing: 4, ...pop(t, 31.86) }}>SAME ORGANS · 1918 ATLAS</div>
      <Plate src="plates/postwall.png" aspect={ASPECT_WALL} x={QX} y={QY} w={QW} a={QA} b={QB} zoomFrom={QZ0} zoomTo={QZ1} />
      <Overlay t={t} map={qmap} fade={QB} items={[
        { f: PP.kidR, text: "Kidney", t: 34.2, px: 225, py: 545, color: OCOL.kid },
        { f: PP.kidL, text: "Kidney", t: 34.4, px: 660, py: 535, color: OCOL.kid },
        { f: PP.adrR, text: "Adrenal", t: 34.91, px: 220, py: 205, color: OCOL.adr },
        { f: PP.adrL, text: "Adrenal", t: 35.1, px: 650, py: 190, color: OCOL.adr },
        { f: PP.aorta, text: "Aorta", t: 35.56, px: 640, py: 640, hot: true },
        { f: PP.ivc, text: "IVC", t: 36.19, px: 330, py: 740, hot: true },
        { f: PP.ureter, text: "Ureter", t: 37.0, px: 220, py: 640, color: OCOL.ure },
      ]} />
      <div style={{ position: "absolute", left: 0, width: 860, top: QY + QH + 14, display: "flex", justifyContent: "center", gap: 12 }}>
        <div style={{ ...pop(t, 37.54), ...chip(C.forest, C.paper, 34) }}>all on the <span style={{ color: C.banana }}>back wall</span> ✓</div>
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: QY + QH + 76, display: "flex", justifyContent: "center", ...pop(t, 35.4) }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "6px 18px 9px", fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.forest, whiteSpace: "nowrap" }}>
          <span style={{ color: C.matcha }}>1918 atlas label:</span> supra-renal gland = adrenal
        </div>
      </div>
    </Scene>
  );
};

/* ---------- 7. Quick test ---------- */
export const C0 = 41.05;
export const V7: React.FC = () => {
  const t = useT();
  const n = t < C0 ? null : t < C0 + 0.5 ? 3 : t < C0 + 1.0 ? 2 : t < C0 + 1.5 ? 1 : null;
  const k = Math.floor((t - C0) / 0.5) * 0.5 + C0;
  return (
    <Scene start={38.45} end={42.55}>
      <div style={{ position: "absolute", left: 10, top: 20, width: 840, height: 880, borderRadius: 48, background: C.forest, ...pop(t, 38.47, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 50, display: "flex", justifyContent: "center" }}>
          <div style={{ background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, padding: "8px 28px 11px 36px", borderRadius: 18 }}>QUICK TEST</div>
        </div>
        <div style={{ position: "absolute", left: 40, width: 760, top: 165, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 66, lineHeight: 1.2, color: C.paper, ...pop(t, 39.34) }}>
          Is the <span style={{ background: OCOL.duo, color: C.forest, borderRadius: 16, padding: "0 14px 4px", display: "inline-block" }}>stomach</span>
          <br />
          retroperitoneal?
        </div>
        <div style={{ position: "absolute", left: 0, top: 420, width: 840, display: "flex", justifyContent: "center", gap: 40 }}>
          {["YES", "NO"].map((c, i) => (
            <div key={c} style={{ ...pop(t, 40.3 + i * 0.15), width: 260, height: 170, borderRadius: 30, background: C.matchaDark, border: `4px solid ${C.matchaLight}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>{c}</div>
          ))}
        </div>
        {n && (
          <div style={{ position: "absolute", left: 0, width: 840, top: 650, display: "flex", justifyContent: "center", transform: `scale(${1.3 - 0.3 * ramp(t, k, k + 0.15)})` }}>
            <div style={{ width: 160, height: 160, borderRadius: 80, background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 110, lineHeight: "160px", textAlign: "center" }}>{n}</div>
          </div>
        )}
      </div>
    </Scene>
  );
};

/* ---------- 8. Answer: NO — intraperitoneal (Gray 1918 Fig. 1039) ---------- */
const XX = 30, XY = 178, XW = 800, XH = XW / ASPECT_XSEC, XA = 42.55, XB = 47.45;
const XZ0: [number, number, number] = [1.0, 0.5, 0.5], XZ1: [number, number, number] = [1.12, 0.42, 0.5];
const xmap = mkMap(XX, XY, XW, XH, XA, XB, XZ0, XZ1);
export const V8: React.FC = () => {
  const t = useT();
  const [sx, sy] = xmap(t, 0.3, 0.405);
  const s = 1 + (XZ1[0] - XZ0[0]) * ramp(t, XA, XB);
  const wp = ramp(t, 45.0, 45.4) * (1 - ramp(t, XB - 0.1, XB + 0.3));
  return (
    <Scene start={XA} end={XB} push={0.005}>
      <div style={{ position: "absolute", left: 0, top: 34, width: 860, display: "flex", justifyContent: "center", alignItems: "center", gap: 18 }}>
        <div style={{ ...pop(t, 42.62), ...chip(C.red, C.paper, 56) }}>NO ✕</div>
        <div style={{ ...pop(t, 43.71), ...chip(C.banana, C.forest, 44) }}>INTRAperitoneal</div>
      </div>
      <Plate src="plates/xsec_perit.png" aspect={ASPECT_XSEC} x={XX} y={XY} w={XW} a={XA} b={XB} zoomFrom={XZ0} zoomTo={XZ1} />
      {wp > 0 && (
        <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <g transform={`translate(${sx} ${sy}) rotate(-38)`} opacity={wp}>
            <ellipse rx={(108 + 6 * Math.sin(t * 6)) * s} ry={60 * s} fill="none" stroke={C.banana} strokeWidth={12} strokeDasharray="26 14" strokeDashoffset={-t * 60} />
          </g>
        </svg>
      )}
      <Overlay t={t} map={xmap} fade={XB} items={[
        { f: [0.33, 0.33], text: "Stomach", t: 43.15, px: 170, py: 150, hot: true },
        { f: [0.12, 0.55], text: "Peritoneum", t: 45.41, px: 150, py: 745 },
        { f: [0.565, 0.665], text: "Kidney = retro", t: 46.2, px: 620, py: 745, color: OCOL.kid },
      ]} />
      <div style={{ position: "absolute", left: 0, width: 860, top: 800, display: "flex", justifyContent: "center", gap: 12, ...pop(t, 45.05) }}>
        <div style={chip(C.forest, C.paper, 34)}>wrapped <span style={{ color: C.banana }}>all the way around</span></div>
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 862, display: "flex", justifyContent: "center", ...pop(t, 44.2) }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 16, padding: "4px 16px 7px", fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.forest, whiteSpace: "nowrap" }}>
          <span style={{ color: C.matcha }}>1918 atlas names:</span> “lienal” = splenic
        </div>
      </div>
    </Scene>
  );
};

/* ---------- 9. Save ---------- */
export const V9: React.FC = () => {
  const t = useT();
  const b = ramp(t, 47.55, 47.9);
  return (
    <Scene start={47.45} end={49.75}>
      <div style={center(20, pop(t, 47.5))}>
        <svg width={200} height={250} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={center(300, pop(t, 47.6))}>
        <Big size={120}>SAVE THIS</Big>
      </div>
      <div style={center(450, pop(t, 48.6))}>
        <Big size={58} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ ...center(590), ...pop(t, 48.85) }}>
        <div style={{ background: C.forest, borderRadius: 32, padding: "26px 30px" }}>
          <LetterTiles t={t} times={[48.9, 48.95, 49.0, 49.05, 49.1, 49.15, 49.2, 49.25, 49.3]} size={62} />
        </div>
      </div>
    </Scene>
  );
};

/* ---------- 10. End card ---------- */
export const END_T = 54.3;
export const V10: React.FC = () => {
  const t = useT();
  const s0 = 49.75;
  return (
    <Scene start={s0} end={END_T}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, s0 + 0.03, 0.35) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.matchaLight, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 50.85, 51.15) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 50.0) * 5))})`, opacity: ramp(t, 49.95, 50.25) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
