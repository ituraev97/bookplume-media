import React from "react";
import { C, FONT, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { APart, Ankle, AnkleLabels, ST, SId, Section } from "./Ankle46";

export const ASPECT_A = 1895 / 1154;
export const ASPECT_L = 552 / 1054;
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

/* plate geometry (Gray 1918 Fig. 442 crop, medial ankle) — points ON each structure, fractions of the crop */
export const PA: Record<"tp" | "fdl" | "fhl" | "ret" | "cru", [number, number]> = {
  tp: [0.677, 0.549],
  fdl: [0.645, 0.67],
  fhl: [0.56, 0.7],
  ret: [0.79, 0.53],
  cru: [0.555, 0.44],
};
/* Gray 1918 Fig. 551 crop (back of leg, lower part) */
export const PL: Record<"art" | "nerve", [number, number]> = { art: [0.295, 0.4], nerve: [0.327, 0.37] };

/* 1. Hook: Gray's 1918 medial ankle, push in behind the malleolus */
export const V1: React.FC = () => {
  const t = useT();
  const W = 820, X = 20, Y = 330;
  return (
    <Scene start={-0.6} end={2.45} push={0.02}>
      <div style={{ position: "absolute", left: 0, top: 30, width: 860, textAlign: "center", ...pop(t, 0.02, 0.25) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.matcha, letterSpacing: 5 }}>WHAT RUNS BEHIND</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 84, color: C.forest, letterSpacing: -2, lineHeight: 1.12, marginTop: 8, whiteSpace: "nowrap" }}>
          the <span style={{ background: t >= 0.91 ? C.banana : "transparent", borderRadius: 20, padding: "0 16px 6px" }}>bump</span> on your
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 84, color: C.forest, letterSpacing: -2, lineHeight: 1.12, whiteSpace: "nowrap", opacity: ramp(t, 1.4, 1.6) }}>inner ankle?</div>
      </div>
      <Plate src="plates/ankle.png" aspect={ASPECT_A} x={X} y={Y} w={W} a={-0.6} b={2.45} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.55, 0.74, 0.55]}
        labels={(["tp", "fdl", "fhl"] as const).map((id, i) => ({ x: PA[id][0], y: PA[id][1], text: "?", t: 1.0 + i * 0.25, hot: true, ox: [60, -70, -70][i], oy: [-70, 40, 50][i] }))}
        credit="Gray's Anatomy, 1918 · public domain" />
    </Scene>
  );
};

/* Diagram stage with camera moves */
type Step = { t: number; zoom: [number, number, number]; focus: APart[] };
const Stage: React.FC<{ t: number; start: number; steps: Step[]; props: Partial<React.ComponentProps<typeof Ankle>>; lab?: Partial<React.ComponentProps<typeof AnkleLabels>>; h?: number; top?: number; note?: string }> = ({ t, start, steps, props, lab = {}, h = 680, top = 10, note = "Book Plume diagram · right ankle, inner side" }) => {
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
        <div style={{ position: "absolute", left: 0, top: 0 }}><Ankle t={t} w={860} focus={cur.focus} {...props} /></div>
      </div>
      <AnkleLabels t={t} h={h} hot={cur.focus} {...lab} map={(x, y) => [zx * 860 + (x - zx * 860) * s, zy * h + (y - zy * h) * s]} />
      <div style={{ position: "absolute", left: 14, bottom: 10, fontFamily: FONT, fontWeight: 700, fontSize: 18, color: C.forest, background: "rgba(255,254,246,0.9)", padding: "2px 10px", borderRadius: 8, opacity: 0.7 }}>{note}</div>
    </div>
  );
};

const DarkCard: React.FC<{ t: number; t0: number; children: React.ReactNode; top?: number; h?: number }> = ({ t, t0, children, top = 708, h = 200 }) => (
  <div style={{ position: "absolute", left: 30, width: 800, top, height: h, borderRadius: 36, background: C.forest, boxShadow: "0 14px 30px rgba(31,42,20,0.25)", ...pop(t, t0, 0.3) }}>{children}</div>
);
const row = (top: number): React.CSSProperties => ({ position: "absolute", left: 0, width: 800, top, display: "flex", justifyContent: "center", alignItems: "center", gap: 16 });

/* 2. medial malleolus -> tarsal tunnel behind it -> flexor retinaculum roof */
export const V2: React.FC = () => {
  const t = useT();
  return (
    <Scene start={2.45} end={9.75} push={0.01}>
      <Stage t={t} start={2.45} steps={[
        { t: 2.45, zoom: [1.0, 0.5, 0.5], focus: [] },
        { t: 3.05, zoom: [1.3, 0.62, 0.42], focus: ["mall"] },
        { t: 4.65, zoom: [1.15, 0.7, 0.55], focus: [] },
        { t: 5.4, zoom: [1.3, 0.74, 0.6], focus: ["tunnel"] },
        { t: 6.6, zoom: [1.1, 0.7, 0.55], focus: [] },
        { t: 8.2, zoom: [1.35, 0.76, 0.58], focus: ["ret"] },
      ]} props={{ show: { tp: 4.7, fdl: 4.8, art: 4.9, vein: 5.0, nerve: 5.1, fhl: 5.2, ret: 7.5 }, lit: { mall: 3.14, tunnel: 5.48, ret: 8.32 } }}
        lab={{ labels: { mall: 3.2, tunnel: 5.55, ret: 8.4 }, labelEnd: { mall: 5.3, tunnel: 7.6 } }} />
      <DarkCard t={t} t0={2.5}>
        {t < 6.5 ? (
          <>
            <div style={row(30)}>
              <div style={{ ...pop(t, 2.6), fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.paper }}>the bump =</div>
              <div style={{ ...pop(t, 3.14), ...chip(C.banana, C.forest, 42) }}>medial malleolus</div>
            </div>
            <div style={row(116)}>
              <div style={{ ...pop(t, 4.7), fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.matchaLight }}>behind it:</div>
              <div style={{ ...pop(t, 5.48), ...chip(C.matcha, C.paper, 40) }}>the tarsal tunnel</div>
            </div>
          </>
        ) : (
          <>
            <div style={row(30)}>
              <div style={{ ...pop(t, 6.6), fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.paper }}>its</div>
              <div style={{ ...pop(t, 6.77), ...chip(C.paper, C.forest, 40) }}>roof</div>
              <div style={{ ...pop(t, 7.2), fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.paper }}>= a tough band</div>
            </div>
            <div style={row(116)}>
              <div style={{ ...pop(t, 8.32), ...chip(C.banana, C.forest, 44) }}>flexor retinaculum</div>
            </div>
          </>
        )}
      </DarkCard>
    </Scene>
  );
};

/* 3. Mnemonic card: Tom, Dick, And Very Nervous Harry */
const MW = [12.46, 12.87, 13.14, 13.27, 13.5, 13.85];
export const V3: React.FC = () => {
  const t = useT();
  return (
    <Scene start={9.75} end={14.55}>
      <div style={{ position: "absolute", left: 10, top: 10, width: 840, height: 910, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 9.75, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 44, display: "flex", justifyContent: "center", gap: 14 }}>
          <div style={{ ...pop(t, 9.89), ...chip(C.paper, C.forest, 34) }}>6 structures</div>
          {t >= 11.5 && <div style={{ ...pop(t, 11.55), ...chip(C.banana, C.forest, 34) }}>JUST REMEMBER</div>}
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 140, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          {ST.map((m, i) => {
            const p = ramp(t, MW[i] - 0.06, MW[i] + 0.16);
            return (
              <div key={i} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 96, letterSpacing: -3, lineHeight: 1.07, display: "flex", opacity: p, transform: `translateX(${(1 - p) * -80}px) scale(${1 + 0.08 * Math.sin(p * Math.PI)})` }}>
                <span style={{ background: m.color, color: C.forest, borderRadius: 20, padding: "0 16px 6px", minWidth: 60, textAlign: "center" }}>{m.word[0]}</span>
                <span style={{ color: C.paper, marginLeft: 4 }}>{m.word.slice(1)}{i < 2 ? "," : ""}</span>
              </div>
            );
          })}
        </div>
        {t < 12.4 && (
          <div style={{ position: "absolute", left: 0, width: 840, top: 330, display: "flex", justifyContent: "center", gap: 18, opacity: ramp(t, 10.1, 10.4) * (1 - ramp(t, 12.2, 12.4)) }}>
            {ST.map((x, i) => (
              <div key={x.id} style={{ ...pop(t, 10.12 + i * 0.12), width: 96, height: 96, borderRadius: 48, background: x.color, border: `5px solid ${C.paper}` }} />
            ))}
          </div>
        )}
        {t < 12.4 && (
          <div style={{ position: "absolute", left: 0, width: 840, top: 470, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper, opacity: ramp(t, 10.6, 10.9) * (1 - ramp(t, 12.2, 12.4)) }}>
            pass through the <span style={{ color: C.banana }}>tarsal tunnel</span>
          </div>
        )}
        <div style={{ position: "absolute", left: 0, width: 840, top: 820, display: "flex", justifyContent: "center", opacity: ramp(t, 14.0, 14.2) }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.matchaLight, letterSpacing: 2 }}>6 words · 6 structures · front → back</div>
        </div>
      </div>
    </Scene>
  );
};

/* tiles strip used in V4 / V7 / V10 */
const Tiles: React.FC<{ t: number; at: number[]; hot: number; ask?: number; top?: number }> = ({ t, at, hot, ask = -1, top = 16 }) => (
  <>
    {ST.map((b, i) => {
      const p = ramp(t, at[i] - 0.05, at[i] + 0.25);
      const isHot = hot === i;
      const isAsk = ask === i;
      return (
        <div key={b.id} style={{ position: "absolute", left: 12 + i * 130, top, width: 126, height: 172, display: "flex", flexDirection: "column", alignItems: "center", opacity: p * (isHot || hot < 0 ? 1 : 0.55), transform: `translateY(${(1 - p) * 30}px) scale(${isHot ? 1.07 : 1})` }}>
          <div style={{ width: 74, height: 74, borderRadius: 37, background: isAsk ? C.matchaDark : isHot ? C.banana : b.color, color: isAsk ? C.banana : C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: isHot ? `0 0 0 5px ${C.paper}` : isAsk ? `0 0 0 4px ${C.banana}` : "none" }}>{isAsk ? "?" : b.letter}</div>
          <div style={{ marginTop: 8, fontFamily: FONT, fontWeight: 800, fontSize: 25, color: C.banana }}>{isAsk ? "?" : b.word}</div>
          <div style={{ marginTop: 2, fontFamily: FONT, fontWeight: 700, fontSize: 19, color: C.paper, lineHeight: 1.08, textAlign: "center", opacity: isAsk ? 0 : 1 }}>{b.kind}</div>
        </div>
      );
    })}
  </>
);

/* 4. The six names, front to back */
const NAME_T = [15.33, 16.69, 18.34, 19.82, 21.13, 22.22];
export const V4: React.FC = () => {
  const t = useT();
  let hot = -1;
  NAME_T.forEach((x, i) => { if (t >= x - 0.1) hot = i; });
  const lit: Partial<Record<APart, number>> = {};
  const labels: Partial<Record<APart, number>> = {};
  const labelEnd: Partial<Record<APart, number>> = {};
  ST.forEach((x, i) => { lit[x.id] = NAME_T[i]; labels[x.id] = NAME_T[i] + 0.02; if (NAME_T[i + 1]) labelEnd[x.id] = NAME_T[i + 1] - 0.2; });
  const zooms: [number, number, number][] = [[1.45, 0.72, 0.55], [1.45, 0.73, 0.57], [1.45, 0.74, 0.6], [1.45, 0.76, 0.62], [1.45, 0.77, 0.64], [1.4, 0.78, 0.66]];
  return (
    <Scene start={14.55} end={23.85} push={0.01}>
      <Stage t={t} start={14.55} steps={[
        { t: 14.55, zoom: [1.2, 0.7, 0.55], focus: [] },
        ...ST.map((x, i) => ({ t: NAME_T[i] - 0.15, zoom: zooms[i], focus: [x.id] as APart[] })),
      ]} props={{ all: true, dimFrom: 14.6, lit, retAlpha: 0.35, solo: true }} lab={{ labels, labelEnd }} />
      <DarkCard t={t} t0={14.6}>
        <Tiles t={t} at={NAME_T} hot={hot} />
      </DarkCard>
      <Stamp t0={14.75} text="FRONT → BACK" size={40} rot={-5} color={C.matcha} style={{ left: 40, top: 150 }} />
    </Scene>
  );
};

/* 5. Cross-section: 2 tendons in front, A V N in the middle, 1 tendon at the back */
export const V5: React.FC = () => {
  const t = useT();
  const G = [24.14, 25.17, 27.49];
  return (
    <Scene start={23.85} end={28.95} push={0.01}>
      <div style={{ position: "absolute", left: 0, top: 10, width: 860, height: 600, borderRadius: 36, background: C.card, border: `3px solid ${C.line}`, overflow: "hidden", ...pop(t, 23.85, 0.35) }}>
        <div style={{ position: "absolute", left: 0, top: 30 }}>
          <Section t={t} show={23.95} group={{ front: G[0], mid: G[1], back: G[2] }} lit={{ tp: 24.14, fdl: 24.3, art: 25.17, vein: 25.93, nerve: 26.42, fhl: 27.49 }} />
        </div>
        <div style={{ position: "absolute", left: 14, bottom: 10, fontFamily: FONT, fontWeight: 700, fontSize: 18, color: C.forest, background: "rgba(255,254,246,0.9)", padding: "2px 10px", borderRadius: 8, opacity: 0.7 }}>Book Plume diagram · cross-section of the tunnel</div>
      </div>
      <DarkCard t={t} t0={23.9} top={640} h={250}>
        <div style={{ position: "absolute", left: 0, width: 800, top: 30, display: "flex", justifyContent: "center", gap: 18 }}>
          {[
            { a: G[0], big: "2", txt: "tendons", sub: "in front" },
            { a: G[1], big: "A·V·N", txt: "vessels + nerve", sub: "in the middle" },
            { a: G[2], big: "1", txt: "tendon", sub: "at the back" },
          ].map((x, i) => (
            <div key={i} style={{ ...pop(t, x.a), width: 240, height: 190, borderRadius: 26, background: C.matchaDark, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: i === 1 ? 50 : 66, color: C.banana, lineHeight: 1.05 }}>{x.big}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.paper }}>{x.txt}</div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, color: C.matchaLight }}>{x.sub}</div>
            </div>
          ))}
        </div>
      </DarkCard>
    </Scene>
  );
};

/* plate -> screen mapping identical to <Plate> (labels are drawn outside the plate so they are never clipped) */
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
      const ww = l.text.length * 17.2 + (l.color ? 72 : 44);
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

/* 6. Gray's 1918 Fig. 442 with modern labels on the three tendons + retinaculum, old-name note */
const AX = 20, AY = 140, AW = 820, AH = AW / ASPECT_A, AA = 28.95, AB = 32.25;
const AZ0: [number, number, number] = [1.0, 0.5, 0.5], AZ1: [number, number, number] = [1.08, 0.6, 0.55];
const amap = mkMap(AX, AY, AW, AH, AA, AB, AZ0, AZ1);
export const V6: React.FC = () => {
  const t = useT();
  const hot = t >= 31.55 && t < 32.2;
  return (
    <Scene start={AA} end={AB} push={0.01}>
      <Plate src="plates/ankle.png" aspect={ASPECT_A} x={AX} y={AY} w={AW} a={AA} b={AB} zoomFrom={AZ0} zoomTo={AZ1} credit="Gray's Anatomy, 1918 · public domain" />
      <Overlay t={t} map={amap} fade={AB} items={[
        { f: PA.tp, text: "Tibialis posterior", t: 29.4, px: 250, py: 72, color: ST[0].color, hot },
        { f: PA.ret, text: "Flexor retinaculum", t: 30.45, px: 670, py: 72 },
        { f: PA.fhl, text: "Flexor hallucis longus", t: 30.1, px: 230, py: AY + AH + 50, color: ST[5].color, hot },
        { f: PA.fdl, text: "Flexor digitorum longus", t: 29.75, px: 640, py: AY + AH + 120, color: ST[1].color, hot },
      ]} />
      <div style={{ position: "absolute", left: 0, top: AY + AH + 172, width: 860, display: "flex", justifyContent: "center", ...pop(t, 30.85) }}>
        <div style={{ ...chip(C.banana, C.forest, 28) }}>1918 atlas name: “Cruciate ligament”</div>
      </div>
      <div style={{ position: "absolute", left: 0, top: AY + AH + 234, width: 860, display: "flex", justifyContent: "center", ...pop(t, 31.1) }}>
        <div style={{ ...chip(C.forest, C.paper, 26) }}>today: inferior extensor retinaculum (front of ankle)</div>
      </div>
    </Scene>
  );
};

/* 7. Gray's 1918 Fig. 551: posterior tibial artery + tibial nerve heading behind the malleolus */
const LX = 20, LY = 10, LW = 460, LH = LW / ASPECT_L, LA = 32.25, LB = 34.45;
const LZ0: [number, number, number] = [1.0, 0.5, 0.5], LZ1: [number, number, number] = [1.1, 0.35, 0.45];
const lmap = mkMap(LX, LY, LW, LH, LA, LB, LZ0, LZ1);
export const V7: React.FC = () => {
  const t = useT();
  return (
    <Scene start={LA} end={LB} push={0.01}>
      <Plate src="plates/leg.png" aspect={ASPECT_L} x={LX} y={LY} w={LW} a={LA} b={LB} zoomFrom={LZ0} zoomTo={LZ1} credit="Gray 1918 · PD" />
      <Overlay t={t} map={lmap} fade={LB} items={[
        { f: PL.art, text: "Post. tibial artery", t: 32.66, px: 650, py: 190, color: ST[2].color, hot: t < 33.28 },
        { f: PL.nerve, text: "Tibial nerve", t: 33.28, px: 660, py: 420, color: ST[4].color, hot: t >= 33.28 },
      ]} />
      <div style={{ position: "absolute", left: 500, top: 560, width: 340, ...pop(t, 32.4) }}>
        <div style={{ background: C.forest, borderRadius: 28, padding: "22px 24px", fontFamily: FONT, fontWeight: 800, color: C.paper, fontSize: 32, lineHeight: 1.2 }}>
          running down to <span style={{ color: C.banana }}>behind the medial malleolus</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 500, top: 790, width: 340, ...pop(t, 33.7) }}>
        <div style={{ ...chip(C.banana, C.forest, 24), whiteSpace: "normal", lineHeight: 1.2 }}>1918 label “Tendo calcaneus” = Achilles tendon</div>
      </div>
    </Scene>
  );
};

/* 8. Quick test */
export const C0 = 37.85;
export const V8: React.FC = () => {
  const t = useT();
  const n = t < C0 ? null : t < C0 + 0.5 ? 3 : t < C0 + 1.0 ? 2 : t < C0 + 1.5 ? 1 : null;
  const k = Math.floor((t - C0) / 0.5) * 0.5 + C0;
  return (
    <Scene start={34.45} end={39.3}>
      <div style={{ position: "absolute", left: 10, top: 20, width: 840, height: 880, borderRadius: 48, background: C.forest, ...pop(t, 34.5, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 50, display: "flex", justifyContent: "center" }}>
          <div style={{ background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, padding: "8px 28px 11px 36px", borderRadius: 18 }}>QUICK TEST</div>
        </div>
        <div style={{ position: "absolute", left: 40, width: 760, top: 150, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 58, lineHeight: 1.18, color: C.paper, ...pop(t, 35.38) }}>
          What runs between the <span style={{ background: "#4F7FC6", color: C.paper, borderRadius: 16, padding: "0 14px 4px", display: "inline-block" }}>vein</span> and the <span style={{ background: "#9D7BC8", color: C.forest, borderRadius: 16, padding: "0 14px 4px", display: "inline-block" }}>hallucis tendon?</span>
        </div>
        <div style={{ position: "absolute", left: 20, top: 430, width: 800, height: 200 }}>
          <Tiles t={t} at={[35.9, 36.0, 36.1, 36.29, 36.5, 36.9]} hot={-1} ask={4} top={0} />
        </div>
        {n && (
          <div style={{ position: "absolute", left: 0, width: 840, top: 660, display: "flex", justifyContent: "center", transform: `scale(${1.3 - 0.3 * ramp(t, k, k + 0.15)})` }}>
            <div style={{ width: 150, height: 150, borderRadius: 75, background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 104, lineHeight: "150px", textAlign: "center" }}>{n}</div>
          </div>
        )}
      </div>
    </Scene>
  );
};

/* 9. Answer: tibial nerve */
export const V9: React.FC = () => {
  const t = useT();
  return (
    <Scene start={39.3} end={41.55} push={0.01}>
      <div style={{ position: "absolute", left: 0, top: 10, width: 860, height: 600, borderRadius: 36, background: C.card, border: `3px solid ${C.line}`, overflow: "hidden", ...pop(t, 39.3, 0.3) }}>
        <div style={{ position: "absolute", left: 0, top: 30 }}>
          <Section t={t} show={39.0} lit={{ nerve: 39.44 }} dimFrom={39.35} ask="nerve" reveal={39.44} />
        </div>
      </div>
      <DarkCard t={t} t0={39.35} top={640} h={230}>
        <div style={{ position: "absolute", left: 0, width: 800, top: 24, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 70, color: C.paper, letterSpacing: -1, ...pop(t, 39.44) }}>Tibial nerve ✓</div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 132, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.matchaLight, ...pop(t, 40.35) }}>
          <span style={{ background: "#E9C743", color: C.forest, borderRadius: 12, padding: "0 14px 3px" }}>N</span> for <span style={{ color: C.paper }}>Nervous</span>
        </div>
      </DarkCard>
    </Scene>
  );
};

/* 10. Save */
export const V10: React.FC = () => {
  const t = useT();
  const b = ramp(t, 41.65, 42.0);
  return (
    <Scene start={41.55} end={43.75}>
      <div style={center(30, pop(t, 41.6))}>
        <svg width={220} height={280} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={center(350, pop(t, 41.63))}>
        <Big size={120}>SAVE THIS</Big>
      </div>
      <div style={center(500, pop(t, 42.63))}>
        <Big size={58} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ ...center(630), gap: 12, alignItems: "center" }}>
        {ST.map((x, i) => (
          <div key={x.id} style={{ ...pop(t, 42.85 + i * 0.08), width: 128, height: 140, borderRadius: 24, background: x.color, color: C.forest, fontFamily: FONT, fontWeight: 800, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 62, lineHeight: 1 }}>{x.letter}</div>
            <div style={{ fontSize: 22, marginTop: 4 }}>{x.word}</div>
          </div>
        ))}
      </div>
    </Scene>
  );
};

/* 11. End card */
export const END_T = 48.2;
export const V11: React.FC = () => {
  const t = useT();
  return (
    <Scene start={43.75} end={END_T}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, 43.8, 0.35) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.matchaLight, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 44.9, 45.2) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 44.0) * 5))})`, opacity: ramp(t, 44.0, 44.3) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};

export type { SId };
