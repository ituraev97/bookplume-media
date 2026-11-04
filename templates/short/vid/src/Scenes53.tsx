import React from "react";
import { C, FONT, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { Lumbar, NERVES, NCOL, NK } from "./Lumbar53";

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
export const MNEM = "IIGLOF";

/* plate -> screen mapping identical to <Plate> */
const mkMap = (X: number, Y: number, W: number, H: number, a: number, b: number, z0: [number, number, number], z1: [number, number, number]) => (t: number, fx: number, fy: number): [number, number] => {
  const k = ramp(t, a, b);
  const sc = z0[0] + (z1[0] - z0[0]) * k, cx = z0[1] + (z1[1] - z0[1]) * k, cy = z0[2] + (z1[2] - z0[2]) * k;
  const cl = (v: number, m: number) => Math.max(-m, Math.min(m, v));
  const tx = cl(-(cx - 0.5) * W * sc, (sc - 1) * W / 2), ty = cl(-(cy - 0.5) * H * sc, (sc - 1) * H / 2);
  return [X + W / 2 + (fx * W - W / 2) * sc + tx, Y + H / 2 + (fy * H - H / 2) * sc + ty];
};
type OL = { f: [number, number]; text: string; t: number; px: number; py: number; color?: string; hot?: boolean; end?: number; size?: number };
const Overlay: React.FC<{ t: number; map: (t: number, fx: number, fy: number) => [number, number]; items: OL[]; fade: number }> = ({ t, map, items, fade }) => (
  <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: 1 - ramp(t, fade - 0.1, fade + 0.3) }}>
    {items.map((l, i) => {
      const p = ramp(t, l.t - 0.1, l.t + 0.25) * (l.end ? 1 - ramp(t, l.end, l.end + 0.3) : 1);
      if (p <= 0) return null;
      const [ax, ay] = map(t, l.f[0], l.f[1]);
      const fs = l.size ?? 31;
      const ww = l.text.length * fs * 0.56 + (l.color ? 74 : 44);
      return (
        <g key={i} opacity={Math.min(1, p * 1.5)}>
          <line x1={ax} y1={ay} x2={ax + (l.px - ax) * p} y2={ay + (l.py - ay) * p} stroke={C.forest} strokeWidth={5} strokeLinecap="round" />
          <circle cx={ax} cy={ay} r={12} fill={l.hot ? C.red : C.banana} stroke={C.forest} strokeWidth={4.5} />
          <g transform={`translate(${l.px} ${l.py}) scale(${0.8 + 0.2 * p})`}>
            <rect x={-ww / 2} y={-30} width={ww} height={60} rx={18} fill={l.hot ? C.banana : C.forest} stroke={C.forest} strokeWidth={3} />
            {l.color && <circle cx={-ww / 2 + 28} cy={0} r={13} fill={l.color} stroke={l.hot ? C.forest : C.paper} strokeWidth={3} />}
            <text x={l.color ? 14 : 0} y={fs * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={fs} fill={l.hot ? C.forest : C.paper}>{l.text}</text>
          </g>
        </g>
      );
    })}
  </svg>
);
/* letter badge pinned to a plate point */
type LB = { f: [number, number]; k: NK; t: number; dx: number; dy: number };
const Letters: React.FC<{ t: number; map: (t: number, fx: number, fy: number) => [number, number]; items: LB[]; fade: number }> = ({ t, map, items, fade }) => (
  <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: 1 - ramp(t, fade - 0.1, fade + 0.3) }}>
    {items.map((l, i) => {
      const p = ramp(t, l.t - 0.05, l.t + 0.25);
      if (p <= 0) return null;
      const [ax, ay] = map(t, l.f[0], l.f[1]);
      const n = NERVES.find((x) => x.k === l.k)!;
      const bx = ax + l.dx * p, by = ay + l.dy * p;
      return (
        <g key={i} opacity={Math.min(1, p * 1.5)}>
          <line x1={ax} y1={ay} x2={bx} y2={by} stroke={C.forest} strokeWidth={5} strokeLinecap="round" />
          <circle cx={ax} cy={ay} r={11} fill={n.color} stroke={C.forest} strokeWidth={4.5} />
          <g transform={`translate(${bx} ${by}) scale(${0.7 + 0.3 * p})`}>
            <rect x={-30} y={-33} width={60} height={66} rx={16} fill={n.color} stroke={C.forest} strokeWidth={5} />
            <text y={15} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill={C.forest}>{n.L}</text>
          </g>
        </g>
      );
    })}
  </svg>
);

/* camera stage around our diagram */
type Step = { t: number; zoom: [number, number, number] };
const SH = 620;
const Stage: React.FC<{ t: number; start: number; steps: Step[]; children: React.ReactNode; caption?: string }> = ({ t, start, steps, children, caption = "Book Plume diagram · right side, front view, not to scale" }) => {
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
      <div style={{ position: "absolute", left: 14, bottom: 10, fontFamily: FONT, fontWeight: 700, fontSize: 18, color: C.forest, background: "rgba(255,254,246,0.9)", padding: "2px 10px", borderRadius: 8, opacity: 0.75 }}>{caption}</div>
    </div>
  );
};
const DarkCard: React.FC<{ t: number; t0: number; children: React.ReactNode; top?: number; h?: number }> = ({ t, t0, children, top = 650, h = 270 }) => (
  <div style={{ position: "absolute", left: 30, width: 800, top, height: h, borderRadius: 36, background: C.forest, boxShadow: "0 14px 30px rgba(31,42,20,0.25)", overflow: "hidden", ...pop(t, t0, 0.3) }}>{children}</div>
);
const Page: React.FC<{ t: number; a: number; b: number; children: React.ReactNode }> = ({ t, a, b, children }) => {
  if (t < a - 0.1 || t > b + 0.3) return null;
  const i = ramp(t, a, a + 0.3), o = ramp(t, b - 0.05, b + 0.2);
  return <div style={{ position: "absolute", inset: 0, opacity: i * (1 - o), transform: `translateY(${(1 - i) * 30 - o * 30}px)` }}>{children}</div>;
};
const Tile: React.FC<{ k: NK; size?: number; style?: React.CSSProperties; ring?: boolean }> = ({ k, size = 70, style, ring }) => {
  const n = NERVES.find((x) => x.k === k)!;
  return (
    <div style={{ width: size, height: size * 1.12, borderRadius: size * 0.24, background: n.color, border: `${Math.max(3, size * 0.06)}px solid ${ring ? C.banana : C.paper}`, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: size * 0.68, display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box", ...style }}>{n.L}</div>
  );
};

export const ASPECT_823 = 1544 / 1812;
export const ASPECT_822 = 1668 / 1636;

/* ---------- 1. Hook: Gray 1918 Fig. 823, push in on the plexus ---------- */
const HW = 590, HH = HW / ASPECT_823, HX = (860 - HW) / 2, HY = 246, HA = -0.6, HB = 2.55;
const HZ0: [number, number, number] = [1.0, 0.45, 0.45], HZ1: [number, number, number] = [1.5, 0.3, 0.48];
const hmap = mkMap(HX, HY, HW, HH, HA, HB, HZ0, HZ1);
const PT823: Record<NK, [number, number]> = { ih: [0.275, 0.276], ii: [0.2175, 0.405], gf: [0.35, 0.29], lfc: [0.175, 0.555], fe: [0.285, 0.653], ob: [0.3775, 0.683] };
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={HB} push={0.02}>
      <div style={{ position: "absolute", left: 0, top: 22, width: 860, textAlign: "center", ...pop(t, 0.02, 0.25) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.matcha, letterSpacing: 5 }}>CAN YOU NAME THE</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 66, color: C.forest, letterSpacing: -2, lineHeight: 1.08, marginTop: 6 }}>
          <span style={{ background: t >= 0.51 ? C.banana : "transparent", borderRadius: 20, padding: "0 14px 6px" }}>6 nerves</span> of the
          <br />
          lumbar plexus?
        </div>
      </div>
      <Plate src="plates/plexus823.png" aspect={ASPECT_823} x={HX} y={HY} w={HW} a={HA} b={HB} zoomFrom={HZ0} zoomTo={HZ1} />
      <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: 1 - ramp(t, HB - 0.1, HB + 0.3) }}>
        {(["ih", "gf", "ii", "lfc", "fe", "ob"] as NK[]).map((k, i) => {
          const t0 = 0.75 + i * 0.16;
          const p = ramp(t, t0, t0 + 0.22);
          if (p <= 0) return null;
          const [x, y] = hmap(t, PT823[k][0], PT823[k][1]);
          return (
            <g key={k} transform={`translate(${x} ${y}) scale(${(0.6 + 0.4 * p) * (1 + 0.05 * Math.sin(t * 7 + i))})`} opacity={p}>
              <circle r={27} fill={C.forest} stroke={C.paper} strokeWidth={4} />
              <text y={13} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={36} fill={C.banana}>?</text>
            </g>
          );
        })}
      </svg>
    </Scene>
  );
};

/* ---------- 2. One silly sentence, top to bottom ---------- */
export const V2: React.FC = () => {
  const t = useT();
  const ks: NK[] = ["ih", "ii", "gf", "lfc", "ob", "fe"];
  const arrow = ramp(t, 4.85, 5.3);
  return (
    <Scene start={HB} end={6.05}>
      <div style={{ position: "absolute", left: 10, top: 20, width: 840, height: 880, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, HB, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 60, display: "flex", justifyContent: "center" }}>
          <div style={{ ...pop(t, 2.66), background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 6, padding: "8px 28px 11px 34px", borderRadius: 18 }}>ONE SILLY SENTENCE</div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 170, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 54, color: C.paper, ...pop(t, 3.49) }}>
          puts all <span style={{ color: C.banana }}>6 nerves</span> in order
        </div>
        {/* six nerve slots stacked top -> bottom */}
        <div style={{ position: "absolute", left: 150, top: 280, width: 520, height: 560 }}>
          {ks.map((k, i) => {
            const t0 = 3.1 + i * 0.1;
            const sweep = ramp(t, 4.85 + i * 0.07, 5.05 + i * 0.07);
            return (
              <div key={k} style={{ position: "absolute", left: 60 + i * 16, top: i * 88, display: "flex", alignItems: "center", gap: 18, ...pop(t, t0, 0.25) }}>
                <div style={{ width: 70, height: 70, borderRadius: 18, background: sweep > 0.5 ? NCOL[k] : C.matchaDark, border: `4px solid ${C.matchaLight}`, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.15 * Math.sin(sweep * Math.PI)})` }}>{sweep > 0.5 ? i + 1 : "?"}</div>
                <div style={{ width: 300, height: 22, borderRadius: 11, background: sweep > 0.5 ? NCOL[k] : "#3A4A28", opacity: 0.9 }} />
              </div>
            );
          })}
        </div>
        {/* top -> bottom arrow */}
        <div style={{ position: "absolute", left: 60, top: 280, width: 90, height: 540 }}>
          <div style={{ position: "absolute", left: 0, top: -6, ...pop(t, 4.81), ...chip(C.banana, C.forest, 28), padding: "4px 12px 6px" }}>TOP</div>
          <svg width={90} height={540} style={{ position: "absolute", left: 0, top: 0 }}>
            {arrow > 0.01 && <line x1={38} y1={56} x2={38} y2={56 + 400 * arrow} stroke={C.banana} strokeWidth={10} strokeLinecap="round" />}
            {arrow > 0.9 && <path d="M 38 486 l -20 -30 l 40 0 Z" fill={C.banana} />}
          </svg>
          <div style={{ position: "absolute", left: -12, top: 498, ...pop(t, 5.23), ...chip(C.paper, C.forest, 26), padding: "4px 10px 6px" }}>BOTTOM</div>
        </div>
      </div>
    </Scene>
  );
};

/* ---------- 3. Where it forms: psoas major, L1-L4 + T12 ---------- */
const ROOTW: Record<string, [number, number]> = { L1: [9.47, 11.0], L2: [9.62, 11.0], L3: [9.85, 11.0], L4: [10.16, 11.0], T12: [11.91, 12.95] };
export const V3: React.FC = () => {
  const t = useT();
  const steps: Step[] = [
    { t: 6.05, zoom: [1.0, 0.5, 0.5] },
    { t: 7.7, zoom: [1.3, 0.68, 0.42] },
    { t: 9.25, zoom: [1.45, 0.78, 0.3] },
    { t: 11.7, zoom: [1.5, 0.78, 0.05] },
  ];
  return (
    <Scene start={6.05} end={12.95} push={0.004}>
      <Stage t={t} start={6.05} steps={steps}>
        <Lumbar t={t} build={6.1} psoasLit={[7.9, 9.4]} roots={ROOTW}
          extra={[{ x: 470, y: 120, text: "Psoas major", w: [7.95, 9.4], hot: true, anchor: "end", size: 30 }]} />
      </Stage>
      <DarkCard t={t} t0={6.1}>
        <Page t={t} a={6.1} b={9.3}>
          <div style={{ position: "absolute", left: 0, width: 800, top: 40, display: "flex", justifyContent: "center", ...pop(t, 6.15) }}>
            <div style={chip(C.banana, C.forest, 40)}>LUMBAR PLEXUS</div>
          </div>
          <div style={{ position: "absolute", left: 0, width: 800, top: 140, display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
            <div style={{ ...pop(t, 6.94), fontFamily: FONT, fontWeight: 800, fontSize: 48, color: C.paper }}>forms inside</div>
            <div style={{ ...pop(t, 7.9), ...chip("#D98272", C.forest, 48) }}>psoas major</div>
          </div>
        </Page>
        <Page t={t} a={9.3} b={13.1}>
          <div style={{ position: "absolute", left: 0, width: 800, top: 34, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.matchaLight, letterSpacing: 4, ...pop(t, 9.31) }}>ROOTS · ANTERIOR RAMI</div>
          <div style={{ position: "absolute", left: 0, width: 800, top: 100, display: "flex", justifyContent: "center", gap: 14 }}>
            {["L1", "L2", "L3", "L4"].map((r) => (
              <div key={r} style={{ ...pop(t, ROOTW[r][0]), ...chip(C.banana, C.forest, 54), padding: "6px 22px 10px" }}>{r}</div>
            ))}
          </div>
          <div style={{ position: "absolute", left: 0, width: 800, top: 192, display: "flex", justifyContent: "center", alignItems: "center", gap: 14 }}>
            <div style={{ ...pop(t, 11.2), fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.paper }}>+ a little help from</div>
            <div style={{ ...pop(t, 11.91), ...chip(C.paper, C.forest, 40), padding: "4px 18px 8px" }}>T12</div>
          </div>
        </Page>
      </DarkCard>
    </Scene>
  );
};

/* ---------- 4. Mnemonic card ---------- */
const MW = [
  { w: "I,", t: 13.92, k: "ih" as NK },
  { w: "I", t: 14.12, k: "ii" as NK },
  { w: "Get", t: 14.25, k: "gf" as NK },
  { w: "Leftovers", t: 14.42, k: "lfc" as NK },
  { w: "On", t: 15.02, k: "ob" as NK },
  { w: "Fridays", t: 15.14, k: "fe" as NK },
];
const LT = [15.35, 15.45, 15.55, 15.65, 15.75, 15.85];
export const V4: React.FC = () => {
  const t = useT();
  const line = (ids: number[], top: number) => (
    <div style={{ position: "absolute", left: 0, width: 840, top, display: "flex", justifyContent: "center", gap: 26 }}>
      {ids.map((i) => {
        const x = MW[i];
        const on = t >= LT[i];
        return (
          <div key={i} style={{ ...pop(t, x.t, 0.25), fontFamily: FONT, fontWeight: 800, fontSize: 100, color: C.paper, letterSpacing: -2, lineHeight: 1.05 }}>
            <span style={{ display: "inline-block", background: on ? NCOL[x.k] : "transparent", color: on ? C.forest : C.banana, borderRadius: 18, padding: on ? (x.w[0] === "I" ? "0 22px 6px" : "0 10px 6px") : 0, marginRight: on ? 4 : 0, transform: `scale(${1 + 0.14 * Math.sin(ramp(t, LT[i], LT[i] + 0.3) * Math.PI)})` }}>{x.w[0]}</span>
            {x.w.slice(1)}
          </div>
        );
      })}
    </div>
  );
  return (
    <Scene start={12.95} end={16.25}>
      <div style={{ position: "absolute", left: 10, top: 20, width: 840, height: 880, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 12.95, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 54, display: "flex", justifyContent: "center", ...pop(t, 13.25) }}>
          <div style={{ background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 6, padding: "8px 26px 11px 32px", borderRadius: 18 }}>THE TRICK</div>
        </div>
        {line([0, 1, 2], 160)}
        {line([3], 290)}
        {line([4, 5], 420)}
        <div style={{ position: "absolute", left: 0, width: 840, top: 600, display: "flex", justifyContent: "center", gap: 14 }}>
          {MW.map((x, i) => <div key={i} style={pop(t, LT[i], 0.25)}><Tile k={x.k} size={92} /></div>)}
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 740, display: "flex", justifyContent: "center", ...pop(t, 15.9) }}>
          <div style={chip(C.matchaDark, C.paper, 34)}>top <span style={{ color: C.banana }}>→</span> bottom</div>
        </div>
      </div>
      <Stamp t0={14.42} text="SILLY = STICKY" size={40} rot={-8} color={C.red} style={{ left: 470, top: 840 }} />
    </Scene>
  );
};

/* ---------- 5. Nerve by nerve on our diagram ---------- */
type NP = { k: NK; a: number; b: number; nameT: number; info: string; infoT: number; extra?: string; extraT?: number };
const NPAGES: NP[] = [
  { k: "ih", a: 16.28, b: 17.88, nameT: 16.51, info: "over the iliac crest", infoT: 16.9 },
  { k: "ii", a: 17.88, b: 19.2, nameT: 18.09, info: "into the groin", infoT: 18.5 },
  { k: "gf", a: 22.2, b: 23.85, nameT: 22.71, info: "runs on the front of psoas", infoT: 23.0 },
  { k: "lfc", a: 23.85, b: 27.45, nameT: 24.16, info: "skin · side of the thigh", infoT: 25.72 },
  { k: "ob", a: 27.45, b: 29.12, nameT: 27.61, info: "inner thigh", infoT: 28.5 },
  { k: "fe", a: 29.12, b: 32.45, nameT: 29.27, info: "front of the thigh", infoT: 31.06, extra: "BIGGEST", extraT: 29.93 },
];
export const V5: React.FC = () => {
  const t = useT();
  const steps: Step[] = [
    { t: 16.25, zoom: [1.0, 0.5, 0.5] },
    { t: 16.3, zoom: [1.35, 0.3, 0.3] },
    { t: 17.85, zoom: [1.35, 0.35, 0.55] },
    { t: 19.2, zoom: [1.15, 0.3, 0.42] },
    { t: 22.2, zoom: [1.35, 0.66, 0.6] },
    { t: 23.85, zoom: [1.3, 0.18, 0.72] },
    { t: 27.45, zoom: [1.25, 0.7, 0.95] },
    { t: 29.12, zoom: [1.3, 0.42, 0.8] },
    { t: 30.9, zoom: [1.2, 0.36, 0.85] },
  ];
  let ci = -1;
  const order: NK[] = ["ih", "ii", "gf", "lfc", "ob", "fe"];
  order.forEach((k, i) => { const p = NPAGES.find((x) => x.k === k)!; if (t >= p.a - 0.05) ci = i; });
  return (
    <Scene start={16.25} end={32.45} push={0.004}>
      <Stage t={t} start={16.25} steps={steps}>
        <Lumbar t={t} dim={[16.3, 32.6]}
          lit={{ ih: [16.33, 22.2], ii: [17.91, 22.2], gf: [22.26, 23.85], lfc: [23.88, 27.45], ob: [27.49, 29.12], fe: [29.16, 32.6] }}
          tags={{ ih: [16.55, 22.2], ii: [18.1, 22.2], gf: [22.75, 23.85], lfc: [24.2, 27.45], ob: [27.65, 29.12], fe: [29.3, 32.6] }}
          regions={{ crest: [16.9, 17.88], side: [25.72, 27.45], inner: [28.5, 29.12], front: [31.06, 32.6] }}
          roots={{ L1: [16.4, 22.2], T12: [16.6, 17.88], L2: [22.3, 27.45], L3: [23.95, 32.6], L4: [27.55, 32.6] }} />
      </Stage>
      <DarkCard t={t} t0={16.3}>
        {NPAGES.map((p) => {
          const n = NERVES.find((x) => x.k === p.k)!;
          const long = n.name.length > 16;
          return (
            <Page key={p.k} t={t} a={p.a} b={p.b}>
              <div style={{ position: "absolute", left: 34, top: 34, ...pop(t, p.a + 0.05) }}><Tile k={p.k} size={150} /></div>
              <div style={{ position: "absolute", left: 214, top: long ? 26 : 34, width: 560, fontFamily: FONT, fontWeight: 800, fontSize: long ? 50 : n.name.length > 13 ? 56 : 66, lineHeight: 1.0, color: C.paper, letterSpacing: -1, ...pop(t, p.nameT) }}>
                {long ? (<><span style={{ color: C.banana }}>L</span>ateral femoral<br />cutaneous</>) : (<><span style={{ color: C.banana }}>{n.name[0]}</span>{n.name.slice(1)}</>)}
              </div>
              <div style={{ position: "absolute", left: 216, top: long ? 140 : 120, display: "flex", alignItems: "center", gap: 12, ...pop(t, p.nameT + 0.35) }}>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.matchaLight }}>roots</div>
                <div style={chip(C.banana, C.forest, 34)}>{n.roots}</div>
                {p.extra && <div style={{ ...pop(t, p.extraT!), ...chip(C.red, C.paper, 30) }}>{p.extra}</div>}
              </div>
              <div style={{ position: "absolute", left: 216, top: long ? 204 : 192, fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.paper, whiteSpace: "nowrap", ...pop(t, p.infoT) }}>→ {p.info}</div>
            </Page>
          );
        })}
        {/* H before I rule */}
        <Page t={t} a={19.2} b={22.2}>
          <div style={{ position: "absolute", left: 0, width: 800, top: 30, display: "flex", justifyContent: "center", alignItems: "center", gap: 18 }}>
            <div style={{ ...pop(t, 19.23), width: 96, height: 104, borderRadius: 24, background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 72, display: "flex", alignItems: "center", justifyContent: "center" }}>H</div>
            <div style={{ ...pop(t, 19.75), fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.paper }}>comes before</div>
            <div style={{ ...pop(t, 20.28), width: 96, height: 104, borderRadius: 24, background: C.paper, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 72, display: "flex", alignItems: "center", justifyContent: "center" }}>I</div>
          </div>
          <div style={{ position: "absolute", left: 0, width: 800, top: 160, display: "flex", justifyContent: "center", alignItems: "center", gap: 12, ...pop(t, 20.63) }}>
            <div style={{ ...chip(NCOL.ih, C.forest, 34), padding: "6px 14px 9px" }}>1. ilio<u>H</u>ypogastric</div>
            <div style={{ ...pop(t, 20.98), ...chip(NCOL.ii, C.forest, 34), padding: "6px 14px 9px" }}>2. ilio<u>I</u>nguinal</div>
          </div>
        </Page>
        {/* progress */}
        <div style={{ position: "absolute", right: 30, bottom: 16, display: "flex", gap: 6 }}>
          {order.map((k, i) => <div key={k} style={{ width: 28, height: 8, borderRadius: 4, background: i <= ci ? NCOL[k] : C.matchaDark }} />)}
        </div>
      </DarkCard>
    </Scene>
  );
};

/* ---------- 6. Bonus: roots 2-1, 2-2, 2-3 on Gray 1918 Fig. 822 ---------- */
const BW = 560, BH2 = BW / ASPECT_822, BX = (860 - BW) / 2, BY = 340, BA = 32.45, BB = 36.15;
const BZ0: [number, number, number] = [1.0, 0.5, 0.5], BZ1: [number, number, number] = [1.06, 0.5, 0.45];
const bmap = mkMap(BX, BY, BW, BH2, BA, BB, BZ0, BZ1);
const GROUPS = [
  { t: 33.67, n: "1", ks: ["ih", "ii"] as NK[], roots: "L1" },
  { t: 34.36, n: "2", ks: ["gf", "lfc"] as NK[], roots: "L1–2 · L2–3" },
  { t: 35.05, n: "3", ks: ["ob", "fe"] as NK[], roots: "L2–4" },
];
export const V6: React.FC = () => {
  const t = useT();
  return (
    <Scene start={BA} end={BB} push={0.004}>
      <div style={{ position: "absolute", left: 10, top: 0, width: 840, height: 320, borderRadius: 40, background: C.forest, ...pop(t, BA, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 26, display: "flex", justifyContent: "center", ...pop(t, 32.5) }}>
          <div style={chip(C.banana, C.forest, 34)}>BONUS · THE ROOTS</div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 104, display: "flex", justifyContent: "center", gap: 18 }}>
          {GROUPS.map((g) => (
            <div key={g.n} style={{ ...pop(t, g.t), width: 250, height: 190, borderRadius: 26, background: C.matchaDark, border: `4px solid ${C.matchaLight}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper, whiteSpace: "nowrap" }}>2 from <span style={{ color: C.banana }}>{g.n}</span></div>
              <div style={{ display: "flex", gap: 8 }}>{g.ks.map((k) => <Tile key={k} k={k} size={54} />)}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.matchaLight, whiteSpace: "nowrap" }}>{g.roots}</div>
            </div>
          ))}
        </div>
      </div>
      <Plate src="plates/plan822.png" aspect={ASPECT_822} x={BX} y={BY} w={BW} a={BA} b={BB} zoomFrom={BZ0} zoomTo={BZ1} credit="Gray's Anatomy, 1918 · Fig. 822 · public domain" />
      <Letters t={t} map={bmap} fade={BB} items={[
        { f: [0.35, 0.188], k: "ih", t: 33.75, dx: -10, dy: -75 },
        { f: [0.345, 0.235], k: "ii", t: 33.85, dx: 90, dy: -10 },
        { f: [0.455, 0.305], k: "gf", t: 34.44, dx: 40, dy: 70 },
        { f: [0.375, 0.47], k: "lfc", t: 34.54, dx: 10, dy: 75 },
        { f: [0.54, 0.8], k: "ob", t: 35.12, dx: 70, dy: -10 },
        { f: [0.25, 0.79], k: "fe", t: 35.22, dx: 60, dy: -20 },
      ]} />
      <div style={{ position: "absolute", left: 0, width: 860, top: BY + BH2 + 12, display: "flex", justifyContent: "center", ...pop(t, 33.0) }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 16, padding: "4px 16px 7px", fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.forest, whiteSpace: "nowrap" }}>
          <span style={{ color: C.matcha }}>1918 plan:</span> "accessory obturator" is found only in some people
        </div>
      </div>
    </Scene>
  );
};

/* ---------- 7. Gray 1918 Fig. 823 with modern labels ---------- */
const QW = 640, QH = QW / ASPECT_823, QX = (860 - QW) / 2, QY = 40, QA = 36.15, QB = 39.55;
const QZ0: [number, number, number] = [1.0, 0.5, 0.5], QZ1: [number, number, number] = [1.12, 0.38, 0.5];
const qmap = mkMap(QX, QY, QW, QH, QA, QB, QZ0, QZ1);
export const V7: React.FC = () => {
  const t = useT();
  return (
    <Scene start={QA} end={QB} push={0.005}>
      <Plate src="plates/plexus823.png" aspect={ASPECT_823} x={QX} y={QY} w={QW} a={QA} b={QB} zoomFrom={QZ0} zoomTo={QZ1} credit="Gray's Anatomy, 1918 · Fig. 823 · public domain" />
      <Letters t={t} map={qmap} fade={QB} items={[
        { f: PT823.ih, k: "ih", t: 36.6, dx: -90, dy: -60 },
        { f: PT823.ii, k: "ii", t: 36.75, dx: -80, dy: -20 },
        { f: PT823.gf, k: "gf", t: 36.9, dx: -30, dy: -110 },
        { f: PT823.lfc, k: "lfc", t: 37.05, dx: -70, dy: 40 },
        { f: PT823.fe, k: "fe", t: 37.2, dx: -80, dy: 60 },
        { f: PT823.ob, k: "ob", t: 37.35, dx: 40, dy: 80 },
      ]} />
      <Overlay t={t} map={qmap} fade={QB} items={[
        { f: [0.64, 0.4], text: "Psoas major", t: 37.7, px: 700, py: 140, hot: true },
      ]} />
      <div style={{ position: "absolute", left: 0, width: 860, top: QY + QH + 14, display: "flex", justifyContent: "center", ...pop(t, 38.2) }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 16, padding: "4px 16px 7px", fontFamily: FONT, fontWeight: 800, fontSize: 25, color: C.forest, whiteSpace: "nowrap" }}>
          <span style={{ color: C.matcha }}>1918 atlas spelling:</span> Ilio-hypogastric = iliohypogastric
        </div>
      </div>
    </Scene>
  );
};

/* ---------- 8. Quick test ---------- */
export const C0 = 42.9;
const OPTS: NK[] = ["fe", "ob", "gf", "ii"];
export const V8: React.FC = () => {
  const t = useT();
  const n = t < C0 ? null : t < C0 + 0.5 ? 3 : t < C0 + 1.0 ? 2 : t < C0 + 1.5 ? 1 : null;
  const k = Math.floor((t - C0) / 0.5) * 0.5 + C0;
  return (
    <Scene start={39.55} end={44.35}>
      <div style={{ position: "absolute", left: 10, top: 20, width: 840, height: 880, borderRadius: 48, background: C.forest, ...pop(t, 39.6, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 50, display: "flex", justifyContent: "center" }}>
          <div style={{ background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, padding: "8px 28px 11px 36px", borderRadius: 18 }}>QUICK TEST</div>
        </div>
        <div style={{ position: "absolute", left: 30, width: 780, top: 150, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 58, lineHeight: 1.2, color: C.paper, ...pop(t, 40.42) }}>
          Which nerve supplies the
          <br />
          <span style={{ background: NCOL.ob, color: C.forest, borderRadius: 16, padding: "0 14px 4px", display: "inline-block", opacity: t >= 41.62 ? 1 : 0.25 }}>adductors</span>{" "}
          <span style={{ opacity: t >= 42.28 ? 1 : 0.25 }}>(inner thigh)?</span>
        </div>
        <div style={{ position: "absolute", left: 60, top: 370, width: 720, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {OPTS.map((o, i) => {
            const nn = NERVES.find((x) => x.k === o)!;
            return (
              <div key={o} style={{ ...pop(t, 41.0 + i * 0.15), height: 110, borderRadius: 26, background: C.matchaDark, border: `4px solid ${C.matchaLight}`, display: "flex", alignItems: "center", gap: 16, padding: "0 20px", boxSizing: "border-box" }}>
                <div style={{ width: 54, height: 54, borderRadius: 14, background: C.paper, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>{"ABCD"[i]}</div>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.paper }}>{nn.name}</div>
              </div>
            );
          })}
        </div>
        {n && (
          <div style={{ position: "absolute", left: 0, width: 840, top: 650, display: "flex", justifyContent: "center", transform: `scale(${1.3 - 0.3 * ramp(t, k, k + 0.15)})` }}>
            <div style={{ width: 170, height: 170, borderRadius: 85, background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 116, lineHeight: "170px", textAlign: "center" }}>{n}</div>
          </div>
        )}
      </div>
    </Scene>
  );
};

/* ---------- 9. Answer: obturator ---------- */
export const V9: React.FC = () => {
  const t = useT();
  return (
    <Scene start={44.35} end={47.0} push={0.004}>
      <Stage t={t} start={44.35} steps={[{ t: 44.35, zoom: [1.0, 0.5, 0.5] }, { t: 44.5, zoom: [1.15, 0.66, 0.9] }]}>
        <Lumbar t={t} dim={[44.4]} lit={{ ob: [44.5] }} tags={{ ob: [44.6] }} regions={{ inner: [44.9] }} roots={{ L2: [45.0], L3: [45.1], L4: [45.2] }}
          extra={[{ x: 600, y: 562, text: "adductors", w: [45.2], hot: true, anchor: "start", size: 26 }]} />
      </Stage>
      <DarkCard t={t} t0={44.4}>
        <div style={{ position: "absolute", left: 0, width: 800, top: 36, display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
          <div style={{ ...pop(t, 44.45), ...chip(C.matcha, C.paper, 56) }}>✓ OBTURATOR</div>
          <div style={{ ...pop(t, 45.0), ...chip(C.banana, C.forest, 40) }}>L2–L4</div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 150, display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}>
          {MW.map((x, i) => {
            const isO = x.k === "ob";
            const p = ramp(t, 45.96, 46.2);
            return (
              <div key={i} style={{ ...pop(t, 45.6 + i * 0.05), opacity: isO ? 1 : 1 - 0.55 * p, transform: `translateY(${isO ? -8 * p : 0}px) scale(${isO ? 1 + 0.15 * p : 1})` }}>
                <Tile k={x.k} size={70} ring={isO && p > 0.5} />
              </div>
            );
          })}
          <div style={{ ...pop(t, 46.32), fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper, marginLeft: 12 }}>
            the <span style={{ color: NCOL.ob }}>O</span> in <span style={{ color: C.banana }}>On</span>
          </div>
        </div>
      </DarkCard>
    </Scene>
  );
};

/* ---------- 10. Save ---------- */
export const V10: React.FC = () => {
  const t = useT();
  const b = ramp(t, 47.1, 47.45);
  return (
    <Scene start={47.0} end={49.2}>
      <div style={center(20, pop(t, 47.05))}>
        <svg width={200} height={250} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={center(300, pop(t, 47.1))}>
        <Big size={120}>SAVE THIS</Big>
      </div>
      <div style={center(450, pop(t, 48.06))}>
        <Big size={58} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ ...center(570), ...pop(t, 48.3) }}>
        <div style={{ background: C.forest, borderRadius: 32, padding: "22px 30px", display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 10 }}>
            {MW.map((x, i) => <div key={i} style={pop(t, 48.35 + i * 0.06)}><Tile k={x.k} size={64} /></div>)}
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.paper }}>I, I Get Leftovers On Fridays</div>
        </div>
      </div>
    </Scene>
  );
};

/* ---------- 11. End card ---------- */
export const END_T = 53.4;
export const V11: React.FC = () => {
  const t = useT();
  const s0 = 49.2;
  return (
    <Scene start={s0} end={END_T}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, s0 + 0.03, 0.35) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.matchaLight, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 50.3, 50.6) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 49.35) * 5))})`, opacity: ramp(t, 49.34, 49.6) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
