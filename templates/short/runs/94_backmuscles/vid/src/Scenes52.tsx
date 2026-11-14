import React from "react";
import { C, FONT, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { Ear, Icon, PCOL } from "./Ear52";

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
export const MNEM = "MIS";

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
          
          <div style={{ width: size, height: size * 1.12, borderRadius: size * 0.22, background: p > 0.5 ? C.banana : dark ? C.matchaDark : C.line, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: size * 0.7, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.35 + 0.65 * p, transform: `translateY(${now ? -8 : 0}px) scale(${1 + 0.14 * Math.sin(p * Math.PI)})`, boxShadow: now ? `0 0 0 5px ${C.paper}` : "0 6px 0 rgba(0,0,0,0.22)" }}>{l}</div>
        </React.Fragment>
      );
    })}
  </div>
);


const BONES = [
  { k: "mal" as const, L: "M", name: "Malleus", latin: "hammer", icon: "hammer" as const },
  { k: "inc" as const, L: "I", name: "Incus", latin: "anvil", icon: "anvil" as const },
  { k: "sta" as const, L: "S", name: "Stapes", latin: "stirrup", icon: "stirrup" as const },
];
export const ASPECT_EAR = 1611 / 1440;
export const ASPECT_CHAIN = 902 / 1248;
export const ASPECT_MAL = 1026 / 691;
export const ASPECT_STA = 654 / 430;

/* ---------- 1. Hook: Gray 1918 Fig. 907, push in to the middle ear ---------- */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={2.6} push={0.02}>
      <div style={{ position: "absolute", left: 0, top: 40, width: 860, textAlign: "center", ...pop(t, 0.02, 0.25) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.matcha, letterSpacing: 5 }}>CAN YOU NAME THE</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 84, color: C.forest, letterSpacing: -2, lineHeight: 1.05, marginTop: 8 }}>
          <span style={{ background: t >= 0.46 ? C.banana : "transparent", borderRadius: 20, padding: "0 14px 6px" }}>3 tiny bones</span>
          <br />
          in your ear?
        </div>
      </div>
      <Plate src="plates/ear907.png" aspect={ASPECT_EAR} x={30} y={300} w={800} a={-0.6} b={2.6} zoomFrom={[1.0, 0.5, 0.45]} zoomTo={[1.55, 0.48, 0.4]}
        labels={[
          { x: 0.495, y: 0.41, text: "?", t: 1.09, hot: true, ox: 70, oy: 60 },
          { x: 0.47, y: 0.37, text: "?", t: 1.4, hot: true, ox: -80, oy: -30 },
          { x: 0.535, y: 0.44, text: "?", t: 1.7, hot: true, ox: 90, oy: 10 },
        ]} />
    </Scene>
  );
};

/* ---------- 2. Smallest bones + one trick ---------- */
export const V2: React.FC = () => {
  const t = useT();
  return (
    <Scene start={2.6} end={6.45}>
      <div style={{ position: "absolute", left: 10, top: 20, width: 840, height: 880, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 2.6, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 60, display: "flex", justifyContent: "center" }}>
          <div style={{ ...pop(t, 2.98), background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 6, padding: "8px 28px 11px 34px", borderRadius: 18 }}>THE SMALLEST BONES</div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 150, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.paper, ...pop(t, 4.0) }}>
          in your <span style={{ color: C.banana }}>whole body</span>
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 260, display: "flex", justifyContent: "center", gap: 36 }}>
          {BONES.map((b, i) => (
            <div key={b.k} style={{ ...pop(t, 3.15 + i * 0.22), width: 210, height: 230, borderRadius: 32, background: C.matchaDark, border: `4px solid ${C.matchaLight}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <div style={{ width: 96, height: 96, borderRadius: 48, background: PCOL[b.k], border: `5px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 60, color: C.forest, transform: `rotate(${Math.sin(t * 3 + i) * 6}deg)` }}>?</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.matchaLight, letterSpacing: 2 }}>BONE {i + 1}</div>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 560, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, ...pop(t, 4.99) }}>
          <div style={chip(C.banana, C.forest, 48)}>1 trick</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 48, color: C.paper }}>→</div>
          <div style={{ ...pop(t, 5.66), ...chip(C.paper, C.forest, 48) }}>in order</div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 700, display: "flex", justifyContent: "center", gap: 14, ...pop(t, 5.85) }}>
          {["1", "2", "3"].map((n, i) => (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 84, height: 84, borderRadius: 22, background: C.matcha, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 52, display: "flex", alignItems: "center", justifyContent: "center", transform: `translateY(${Math.sin(Math.max(0, t - 5.85 - i * 0.12) * 9) * -6 * (1 - ramp(t, 6.0, 6.4))}px)` }}>{n}</div>
              {i < 2 && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.matchaLight }}>›</div>}
            </div>
          ))}
        </div>
      </div>
      <Stamp t0={3.51} text="TINY" size={56} rot={-9} color={C.red} style={{ left: 590, top: 770 }} />
    </Scene>
  );
};

/* ---------- 3. Mnemonic card: Many Ice Skaters ---------- */
export const V3: React.FC = () => {
  const t = useT();
  const W = [
    { w: "Many", t: 6.62 },
    { w: "Ice", t: 6.83 },
    { w: "Skaters", t: 7.06 },
  ];
  const lt = [7.85, 8.18, 8.48];
  return (
    <Scene start={6.45} end={10.2}>
      <div style={{ position: "absolute", left: 10, top: 20, width: 840, height: 880, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 6.45, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 54, display: "flex", justifyContent: "center" }}>
          <div style={{ background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 6, padding: "8px 26px 11px 32px", borderRadius: 18 }}>THE TRICK</div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 150, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          {W.map((x, i) => (
            <div key={x.w} style={{ ...pop(t, x.t), fontFamily: FONT, fontWeight: 800, fontSize: 104, color: C.paper, letterSpacing: -2, lineHeight: 1.08 }}>
              <span style={{ display: "inline-block", background: t >= lt[i] ? C.banana : "transparent", color: t >= lt[i] ? C.forest : C.banana, borderRadius: 18, padding: t >= lt[i] ? "0 10px 6px" : 0, marginRight: t >= lt[i] ? 6 : 0, transform: `scale(${1 + 0.12 * Math.sin(ramp(t, lt[i], lt[i] + 0.3) * Math.PI)})` }}>{x.w[0]}</span>
              {x.w.slice(1)}
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 560, display: "flex", justifyContent: "center", alignItems: "center", gap: 18 }}>
          {BONES.map((b, i) => (
            <React.Fragment key={b.k}>
              <div style={{ ...pop(t, lt[i]), width: 120, height: 132, borderRadius: 28, background: PCOL[b.k], border: `5px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 84, color: C.forest }}>{b.L}</div>
              {i < 2 && <div style={{ ...pop(t, lt[i] + 0.15), fontFamily: FONT, fontWeight: 800, fontSize: 54, color: C.matchaLight }}>→</div>}
            </React.Fragment>
          ))}
        </div>
        <div style={{ position: "absolute", left: 60, width: 720, top: 740, height: 90, ...pop(t, 8.75) }}>
          <div style={{ position: "absolute", left: 0, top: 18, ...chip(PCOL.drum, C.forest, 34) }}>eardrum</div>
          <svg width={720} height={90} style={{ position: "absolute", left: 0, top: 0 }}>
            <line x1={210} y1={46} x2={210 + 300 * ramp(t, 9.0, 9.6)} y2={46} stroke={C.banana} strokeWidth={10} strokeLinecap="round" />
            {t > 9.4 && <path d={`M ${500 * 1 + 10} 46 l -26 -20 l 0 40 Z`} fill={C.banana} opacity={ramp(t, 9.4, 9.6)} />}
          </svg>
          <div style={{ position: "absolute", right: 0, top: 18, ...chip(C.paper, C.forest, 34), opacity: ramp(t, 9.38, 9.6) }}>inward</div>
        </div>
      </div>
    </Scene>
  );
};

/* ---------- 4. Bone by bone on our diagram ---------- */
const B4 = [
  { i: 0, t: 10.27, nameT: 10.44, latT: 11.26, extraT: 12.49, extra: "handle → eardrum", extra2T: 13.65, zoom: [1.55, 0.36, 0.42] as [number, number, number], zoom2: [1.35, 0.32, 0.5] as [number, number, number] },
  { i: 1, t: 14.41, nameT: 14.52, latT: 15.0, extraT: 15.87, extra: "in the middle", zoom: [1.6, 0.45, 0.36] as [number, number, number] },
  { i: 2, t: 16.6, nameT: 16.77, latT: 17.37, extraT: 18.26, extra: "footplate → oval window", extra2T: 19.25, zoom: [1.55, 0.55, 0.53] as [number, number, number], zoom2: [1.7, 0.63, 0.54] as [number, number, number] },
];
export const V4: React.FC = () => {
  const t = useT();
  const steps: Step[] = [
    { t: 10.2, zoom: [1.0, 0.5, 0.5] },
    { t: 10.35, zoom: B4[0].zoom },
    { t: 12.45, zoom: B4[0].zoom2! },
    { t: 14.35, zoom: B4[1].zoom },
    { t: 16.55, zoom: B4[2].zoom },
    { t: 18.2, zoom: B4[2].zoom2! },
  ];
  let ci = -1;
  B4.forEach((b, i) => { if (t >= b.t - 0.05) ci = i; });
  return (
    <Scene start={10.2} end={20.3} push={0.004}>
      <Stage t={t} start={10.2} steps={steps} caption="Book Plume diagram · right ear, front view, not to scale">
        <Ear t={t} build={10.2} dimRest={[10.4]}
          lit={{ mal: [10.44, 14.41], drum: [13.65, 14.41], inc: [14.52, 16.6], sta: [16.77], oval: [19.25] }}
          tags={[
            { x: 205, y: 150, text: "Malleus", w: [10.5, 14.41], hot: true, color: PCOL.mal },
            { x: 150, y: 470, text: "Eardrum", w: [13.65, 14.41], color: PCOL.drum },
            { x: 470, y: 125, text: "Incus", w: [14.55, 16.6], hot: true, color: PCOL.inc },
            { x: 455, y: 250, text: "Stapes", w: [16.8, 19.2], hot: true, color: PCOL.sta },
            { x: 560, y: 245, text: "Oval window", w: [19.25], hot: true },
          ]} />
      </Stage>
      <DarkCard t={t} t0={10.25}>
        {B4.map((b, k) => {
          const B = BONES[b.i];
          const nx = k < B4.length - 1 ? B4[k + 1].t : 20.5;
          return (
            <Page key={k} t={t} a={b.t - 0.05} b={nx - 0.08}>
              <div style={{ position: "absolute", left: 36, top: 36, width: 150, height: 170, borderRadius: 32, background: PCOL[B.k], border: `5px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 110, color: C.forest, ...pop(t, b.t) }}>{B.L}</div>
              <div style={{ position: "absolute", left: 220, top: 34, fontFamily: FONT, fontWeight: 800, fontSize: 70, color: C.paper, letterSpacing: -1, ...pop(t, b.nameT) }}>
                <span style={{ color: C.banana }}>{B.name[0]}</span>{B.name.slice(1)}
              </div>
              <div style={{ position: "absolute", left: 222, top: 128, display: "flex", alignItems: "center", gap: 12, ...pop(t, b.latT) }}>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.matchaLight }}>Latin:</div>
                <div style={chip(C.banana, C.forest, 36)}>{B.latin}</div>
              </div>
              <div style={{ position: "absolute", left: 222, top: 198, fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.paper, whiteSpace: "nowrap", ...pop(t, b.extraT) }}>{b.extra}</div>
              <div style={{ position: "absolute", right: 34, top: 40, ...pop(t, b.latT + 0.1), transform: `${(pop(t, b.latT + 0.1).transform as string)} rotate(${Math.sin(t * 4) * 4}deg)` }}>
                <Icon kind={B.icon} size={130} color={PCOL[B.k]} />
              </div>
              {b.extra2T && (
                <div style={{ position: "absolute", right: 40, top: 196, ...pop(t, b.extra2T) }}>
                  <div style={{ width: 40, height: 40, borderRadius: 20, background: C.matcha, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>✓</div>
                </div>
              )}
            </Page>
          );
        })}
        {/* progress M I S */}
        <div style={{ position: "absolute", right: 30, bottom: 16, display: "flex", gap: 6 }}>
          {BONES.map((B, i) => <div key={B.k} style={{ width: 30, height: 8, borderRadius: 4, background: i <= ci ? PCOL[B.k] : C.matchaDark }} />)}
        </div>
      </DarkCard>
    </Scene>
  );
};

/* ---------- 5. How the chain works: vibration ---------- */
export const V5: React.FC = () => {
  const t = useT();
  const flow = [
    { w: "Sound", t: 20.43, bg: C.matcha, c: C.paper },
    { w: "Eardrum", t: 21.15, bg: PCOL.drum, c: C.forest },
    { w: "M · I · S", t: 22.1, bg: C.banana, c: C.forest },
    { w: "Inner ear", t: 23.91, bg: PCOL.inner, c: C.forest },
  ];
  return (
    <Scene start={20.3} end={24.8} push={0.004}>
      <Stage t={t} start={20.3} steps={[{ t: 20.3, zoom: [1.0, 0.5, 0.5] }, { t: 23.7, zoom: [1.12, 0.62, 0.55] }]} caption="Book Plume diagram · right ear, front view, not to scale">
        <Ear t={t} vib={[21.1, 24.8]} waveT={20.43} pulse={[22.1, 23.9]} innerT={23.91}
          lit={{ drum: [21.15, 22.1], mal: [22.2, 23.0], inc: [22.6, 23.3], sta: [22.95, 23.8], inner: [23.91] }}
          tags={[
            { x: 110, y: 200, text: "Ear canal", w: [20.5, 22.0] },
            { x: 640, y: 90, text: "Inner ear", w: [23.95], hot: true, color: PCOL.inner },
          ]} />
      </Stage>
      <DarkCard t={t} t0={20.35}>
        <div style={{ position: "absolute", left: 0, width: 800, top: 44, display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
          {flow.map((f, i) => (
            <React.Fragment key={f.w}>
              <div style={{ ...pop(t, f.t), ...chip(f.bg, f.c, 32), padding: "8px 14px 11px" }}>{f.w}</div>
              {i < flow.length - 1 && <div style={{ ...pop(t, flow[i + 1].t - 0.1), fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.matchaLight }}>→</div>}
            </React.Fragment>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 150, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.paper, ...pop(t, 22.48) }}>
          the chain <span style={{ color: C.banana }}>passes the vibration</span>
        </div>
      </DarkCard>
    </Scene>
  );
};

/* ---------- 6. Gray 1918 Fig. 919 with modern labels ---------- */
const QW = 540, QH = QW / ASPECT_CHAIN, QX = (860 - QW) / 2, QY = 70, QA = 24.8, QB = 28.7;
const QZ0: [number, number, number] = [1.0, 0.5, 0.5], QZ1: [number, number, number] = [1.1, 0.5, 0.48];
const qmap = mkMap(QX, QY, QW, QH, QA, QB, QZ0, QZ1);
export const V6: React.FC = () => {
  const t = useT();
  return (
    <Scene start={QA} end={QB} push={0.005}>
      <div style={{ position: "absolute", left: 0, top: 16, width: 860, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.matcha, letterSpacing: 4, ...pop(t, 24.9) }}>SAME CHAIN · 1918 ATLAS</div>
      <Plate src="plates/chain919.png" aspect={ASPECT_CHAIN} x={QX} y={QY} w={QW} a={QA} b={QB} zoomFrom={QZ0} zoomTo={QZ1} />
      <Overlay t={t} map={qmap} fade={QB} items={[
        { f: [0.33, 0.33], text: "Malleus", t: 25.5, px: 120, py: 250, color: PCOL.mal },
        { f: [0.47, 0.44], text: "Incus", t: 25.9, px: 760, py: 300, color: PCOL.inc },
        { f: [0.6, 0.5], text: "Stapes", t: 26.3, px: 740, py: 470, color: PCOL.sta },
        { f: [0.33, 0.64], text: "Eardrum", t: 26.9, px: 120, py: 680, color: PCOL.drum },
        { f: [0.69, 0.51], text: "Oval window", t: 27.4, px: 690, py: 640, hot: true },
      ]} />
      <div style={{ position: "absolute", left: 0, width: 860, top: QY + QH + 14, display: "flex", justifyContent: "center", ...pop(t, 27.14) }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "6px 18px 9px", fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.forest, whiteSpace: "nowrap" }}>
          <span style={{ color: C.matcha }}>1918 atlas name:</span> membrana tympani = eardrum
        </div>
      </div>
    </Scene>
  );
};

/* ---------- 6b. The stapes: smallest bone (Gray 1918 Fig. 918) ---------- */
const SW = 720, SH2 = SW / ASPECT_STA, SX = 70, SY = 190, SA = 28.7, SB = 31.85;
const SZ0: [number, number, number] = [1.0, 0.5, 0.5], SZ1: [number, number, number] = [1.06, 0.6, 0.55];
const smap = mkMap(SX, SY, SW, SH2, SA, SB, SZ0, SZ1);
export const V6b: React.FC = () => {
  const t = useT();
  return (
    <Scene start={SA} end={SB} push={0.005}>
      <div style={{ position: "absolute", left: 0, top: 40, width: 860, display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
        <div style={{ ...pop(t, 28.85), ...chip(PCOL.sta, C.forest, 54) }}>Stapes</div>
        <div style={{ ...pop(t, 29.76), ...chip(C.forest, C.banana, 46) }}>SMALLEST bone</div>
      </div>
      <Plate src="plates/stapes918.png" aspect={ASPECT_STA} x={SX} y={SY} w={SW} a={SA} b={SB} zoomFrom={SZ0} zoomTo={SZ1} />
      <Overlay t={t} map={smap} fade={SB} items={[
        { f: [0.72, 0.88], text: "footplate", t: 30.25, px: 300, py: SY + SH2 + 40, hot: true },
      ]} />
      <div style={{ position: "absolute", left: 0, width: 860, top: SY + SH2 + 110, display: "flex", justifyContent: "center", ...pop(t, 30.82) }}>
        <div style={chip(C.banana, C.forest, 40)}>in the human body</div>
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: SY + SH2 + 186, display: "flex", justifyContent: "center", ...pop(t, 30.4) }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 16, padding: "4px 16px 7px", fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.forest, whiteSpace: "nowrap" }}>
          <span style={{ color: C.matcha }}>1918 atlas label:</span> base = footplate
        </div>
      </div>
      <Stamp t0={30.25} text="#1 TINIEST" size={44} rot={8} color={C.red} style={{ left: 560, top: 690 }} />
    </Scene>
  );
};

/* ---------- 7. Quick test ---------- */
export const C0 = 34.75;
export const V7: React.FC = () => {
  const t = useT();
  const n = t < C0 ? null : t < C0 + 0.5 ? 3 : t < C0 + 1.0 ? 2 : t < C0 + 1.5 ? 1 : null;
  const k = Math.floor((t - C0) / 0.5) * 0.5 + C0;
  return (
    <Scene start={31.85} end={36.3}>
      <div style={{ position: "absolute", left: 10, top: 20, width: 840, height: 880, borderRadius: 48, background: C.forest, ...pop(t, 31.9, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 50, display: "flex", justifyContent: "center" }}>
          <div style={{ background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, padding: "8px 28px 11px 36px", borderRadius: 18 }}>QUICK TEST</div>
        </div>
        <div style={{ position: "absolute", left: 40, width: 760, top: 160, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 62, lineHeight: 1.2, color: C.paper, ...pop(t, 32.77) }}>
          Which ossicle is
          <br />
          attached to the <span style={{ background: PCOL.drum, color: C.forest, borderRadius: 16, padding: "0 14px 4px", display: "inline-block" }}>eardrum</span>?
        </div>
        <div style={{ position: "absolute", left: 0, top: 410, width: 840, display: "flex", justifyContent: "center", gap: 26 }}>
          {BONES.map((b, i) => (
            <div key={b.k} style={{ ...pop(t, 33.5 + i * 0.15), width: 230, height: 200, borderRadius: 30, background: C.matchaDark, border: `4px solid ${C.matchaLight}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <div style={{ width: 84, height: 84, borderRadius: 22, background: PCOL[b.k], color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>{b.L}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.paper }}>{b.name}</div>
            </div>
          ))}
        </div>
        {n && (
          <div style={{ position: "absolute", left: 0, width: 840, top: 660, display: "flex", justifyContent: "center", transform: `scale(${1.3 - 0.3 * ramp(t, k, k + 0.15)})` }}>
            <div style={{ width: 160, height: 160, borderRadius: 80, background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 110, lineHeight: "160px", textAlign: "center" }}>{n}</div>
          </div>
        )}
      </div>
    </Scene>
  );
};

/* ---------- 8. Answer: malleus (Gray 1918 Fig. 916) ---------- */
const XW = 760, XH = XW / ASPECT_MAL, XX = 50, XY = 175, XA = 36.3, XB = 38.95;
const XZ0: [number, number, number] = [1.0, 0.5, 0.5], XZ1: [number, number, number] = [1.1, 0.35, 0.6];
const xmap = mkMap(XX, XY, XW, XH, XA, XB, XZ0, XZ1);
export const V8: React.FC = () => {
  const t = useT();
  return (
    <Scene start={XA} end={XB} push={0.005}>
      <div style={{ position: "absolute", left: 0, top: 40, width: 860, display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
        <div style={{ ...pop(t, 36.36), ...chip(C.matcha, C.paper, 56) }}>✓ MALLEUS</div>
        <div style={{ ...pop(t, 36.91), ...chip(C.banana, C.forest, 44) }}>the hammer</div>
      </div>
      <Plate src="plates/malleus916.png" aspect={ASPECT_MAL} x={XX} y={XY} w={XW} a={XA} b={XB} zoomFrom={XZ0} zoomTo={XZ1} />
      <Overlay t={t} map={xmap} fade={XB} items={[
        { f: [0.39, 0.68], text: "handle → eardrum", t: 36.6, px: 600, py: XY + XH + 50, hot: true },
      ]} />
      <div style={{ position: "absolute", left: 0, width: 860, top: XY + XH + 110, display: "flex", justifyContent: "center", gap: 12, ...pop(t, 37.67) }}>
        <div style={chip(C.forest, C.paper, 38)}><span style={{ color: C.banana }}>1st</span> in the chain: M → I → S</div>
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: XY + XH + 184, display: "flex", justifyContent: "center", ...pop(t, 37.2) }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 16, padding: "4px 16px 7px", fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.forest, whiteSpace: "nowrap" }}>
          <span style={{ color: C.matcha }}>1918 atlas label:</span> manubrium = handle
        </div>
      </div>
    </Scene>
  );
};

/* ---------- 9. Save ---------- */
export const V9: React.FC = () => {
  const t = useT();
  const b = ramp(t, 39.05, 39.4);
  return (
    <Scene start={38.95} end={41.15}>
      <div style={center(20, pop(t, 39.0))}>
        <svg width={200} height={250} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={center(300, pop(t, 39.1))}>
        <Big size={120}>SAVE THIS</Big>
      </div>
      <div style={center(450, pop(t, 39.76))}>
        <Big size={58} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ ...center(590), ...pop(t, 40.1) }}>
        <div style={{ background: C.forest, borderRadius: 32, padding: "22px 34px", display: "flex", gap: 18, alignItems: "center" }}>
          {BONES.map((B, i) => (
            <div key={B.k} style={{ ...pop(t, 40.15 + i * 0.08), display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 66, height: 74, borderRadius: 16, background: PCOL[B.k], color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 46, display: "flex", alignItems: "center", justifyContent: "center" }}>{B.L}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.paper }}>{["Many", "Ice", "Skaters"][i]}</div>
            </div>
          ))}
        </div>
      </div>
    </Scene>
  );
};

/* ---------- 10. End card ---------- */
export const END_T = 45.0;
export const V10: React.FC = () => {
  const t = useT();
  const s0 = 41.15;
  return (
    <Scene start={s0} end={END_T}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, s0 + 0.03, 0.35) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.matchaLight, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 42.3, 42.6) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 41.3) * 5))})`, opacity: ramp(t, 41.3, 41.6) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
