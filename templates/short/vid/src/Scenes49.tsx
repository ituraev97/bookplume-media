import React from "react";
import { C, FONT, Scene, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { LCOL, LING, Lungs, LungsProps } from "./Lungs49";

export const ASPECT_LUNGS = 1694 / 1657;
export const ASPECT_BRONCHI = 1659 / 2170;
const pop = (t: number, t0: number, d = 0.3) => {
  const p = ramp(t, t0, t0 + d);
  return { opacity: p, transform: `scale(${0.6 + 0.4 * p + 0.08 * Math.sin(Math.min(1, p) * Math.PI)})` } as React.CSSProperties;
};
const fadeOut = (t: number, t1: number) => 1 - ramp(t, t1 - 0.15, t1 + 0.1);
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });
const Big: React.FC<{ size?: number; children: React.ReactNode; color?: string }> = ({ size = 110, children, color = C.forest }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1, letterSpacing: -2, textAlign: "center" }}>{children}</div>
);
const chip = (bg: string, color: string, size = 34): React.CSSProperties => ({ background: bg, color, fontFamily: FONT, fontWeight: 800, fontSize: size, padding: "8px 20px 11px", borderRadius: 16, whiteSpace: "nowrap" });
export const liveAlpha = (_t: number) => 0;

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

/* 1. Hook: Gray 1918 Fig. 490 (front view of heart and lungs), push in */
export const V1: React.FC = () => {
  const t = useT();
  const W = 700, X = 80, Y = 236;
  return (
    <Scene start={-0.6} end={2.6} push={0.02}>
      <div style={{ position: "absolute", left: 0, top: 6, width: 860, textAlign: "center", ...pop(t, 0.02, 0.25) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.matcha, letterSpacing: 5 }}>WHICH LUNG HAS</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 88, color: C.forest, letterSpacing: -2, lineHeight: 1.12, marginTop: 6, whiteSpace: "nowrap" }}>
          <span style={{ background: t >= 0.65 ? LCOL.rm : "transparent", borderRadius: 20, padding: "0 16px 6px" }}>3 lobes</span>
          <span style={{ opacity: ramp(t, 2.0, 2.2) }}> or <span style={{ background: t >= 2.15 ? LCOL.rs : "transparent", borderRadius: 20, padding: "0 16px 6px" }}>2</span>?</span>
        </div>
      </div>
      <Plate src="plates/lungs.png" aspect={ASPECT_LUNGS} x={X} y={Y} w={W} a={-0.6} b={2.6} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.18, 0.5, 0.55]}
        labels={[
          { x: 0.16, y: 0.66, text: "3?", t: 0.75, hot: true, ox: 70, oy: 70 },
          { x: 0.86, y: 0.66, text: "2?", t: 2.15, hot: true, ox: -70, oy: 70 },
        ]} />
    </Scene>
  );
};

/* Diagram stage with camera moves */
type Step = { t: number; zoom: [number, number, number] };
const SH = 620;
const Stage: React.FC<{ t: number; start: number; steps: Step[]; props: Omit<LungsProps, "t">; top?: number; children?: React.ReactNode }> = ({ t, start, steps, props, top = 0, children }) => {
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
        <Lungs t={t} {...props} />
      </div>
      {children}
      <div style={{ position: "absolute", left: 14, bottom: 10, fontFamily: FONT, fontWeight: 700, fontSize: 18, color: C.forest, background: "rgba(255,254,246,0.9)", padding: "2px 10px", borderRadius: 8, opacity: 0.7 }}>Book Plume diagram · front view, simplified</div>
    </div>
  );
};

const DarkCard: React.FC<{ t: number; t0: number; children: React.ReactNode; top?: number; h?: number }> = ({ t, t0, children, top = 650, h = 270 }) => (
  <div style={{ position: "absolute", left: 30, width: 800, top, height: h, borderRadius: 36, background: C.forest, boxShadow: "0 14px 30px rgba(31,42,20,0.25)", overflow: "hidden", ...pop(t, t0, 0.3) }}>{children}</div>
);
const row = (top: number): React.CSSProperties => ({ position: "absolute", left: 0, width: 800, top, display: "flex", justifyContent: "center", alignItems: "center", gap: 16 });
/* card "page" that slides in at a and out at b */
const Page: React.FC<{ t: number; a: number; b: number; children: React.ReactNode }> = ({ t, a, b, children }) => {
  if (t < a - 0.1 || t > b + 0.3) return null;
  const i = ramp(t, a, a + 0.3), o = ramp(t, b - 0.05, b + 0.2);
  return <div style={{ position: "absolute", inset: 0, opacity: i * (1 - o), transform: `translateY(${(1 - i) * 30 - o * 30}px)` }}>{children}</div>;
};
const LobeTile: React.FC<{ t: number; t0: number; letter: string; word: string; color: string }> = ({ t, t0, letter, word, color }) => {
  const p = ramp(t, t0 - 0.05, t0 + 0.2);
  return (
    <div style={{ width: 168, display: "flex", flexDirection: "column", alignItems: "center", opacity: 0.3 + 0.7 * p, transform: `scale(${1 + 0.1 * Math.sin(p * Math.PI)})` }}>
      <div style={{ width: 84, height: 84, borderRadius: 42, background: p > 0.5 ? color : C.matchaDark, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>{letter}</div>
      <div style={{ marginTop: 8, fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.paper }}>{word}</div>
    </div>
  );
};
const CountBadge: React.FC<{ t: number; t0: number; n: string; label: string }> = ({ t, t0, n, label }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", ...pop(t, t0) }}>
    <div style={{ width: 120, height: 120, borderRadius: 30, background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 92, lineHeight: "120px", textAlign: "center", boxShadow: "0 8px 0 rgba(0,0,0,0.25)" }}>{n}</div>
    <div style={{ marginTop: 8, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.matchaLight, letterSpacing: 2 }}>{label}</div>
  </div>
);
const FissIcon: React.FC<{ kind: "obl" | "hor" }> = ({ kind }) => (
  <svg width={46} height={46} viewBox="0 0 46 46">
    <rect x={2} y={2} width={42} height={42} rx={12} fill={C.matchaDark} />
    {kind === "obl" ? <line x1={10} y1={10} x2={36} y2={36} stroke={C.banana} strokeWidth={6} strokeLinecap="round" /> : <line x1={8} y1={23} x2={38} y2={23} stroke={C.banana} strokeWidth={6} strokeLinecap="round" />}
  </svg>
);

/* 2. The diagram draws itself */
export const V2: React.FC = () => {
  const t = useT();
  return (
    <Scene start={2.6} end={4.5} push={0.01}>
      <Stage t={t} start={2.6} steps={[{ t: 2.6, zoom: [1.0, 0.5, 0.5] }]} props={{ build: 2.7, sides: [3.0] }} />
      <DarkCard t={t} t0={2.7}>
        <div style={row(40)}>
          <div style={{ ...pop(t, 2.9), ...chip(LCOL.rm, C.forest, 46) }}>RIGHT</div>
          <div style={{ ...pop(t, 3.1), fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.paper }}>vs</div>
          <div style={{ ...pop(t, 3.3), ...chip(LCOL.rs, C.forest, 46) }}>LEFT</div>
        </div>
        <div style={row(150)}>
          <div style={{ ...pop(t, 3.56), ...chip(C.matcha, C.paper, 40) }}>never mix them up ✓</div>
        </div>
      </DarkCard>
    </Scene>
  );
};

/* 3. Right lung -> fissures -> left lung -> heart + notch -> lingula (one continuous diagram) */
const A = 4.5, B = 8.05, Cc = 11.2, D = 16.55, E = 21.55, F = 25.85;
export const V3: React.FC = () => {
  const t = useT();
  return (
    <Scene start={A} end={F} push={0.005}>
      <Stage t={t} start={A} steps={[
        { t: A, zoom: [1.0, 0.5, 0.5] },
        { t: A + 0.05, zoom: [1.42, 0.24, 0.6] },
        { t: Cc, zoom: [1.42, 0.76, 0.6] },
        { t: D, zoom: [1.0, 0.5, 0.5] },
        { t: 20.1, zoom: [1.4, 0.68, 0.95] },
        { t: 24.3, zoom: [1.0, 0.5, 0.5] },
      ]} props={{
        sides: [A],
        heart: [17.1],
        lit: { rs: [6.33, 11.0], rm: [[6.92, 11.0], [24.54, F]], ri: [7.36, 11.0], ls: [13.24, 16.6], li: [13.9, 16.6] },
        fiss: { oblR: [9.6, 11.0], hor: [10.26, 11.0], oblL: [15.46, 16.6] },
        lean: [17.38, 20.0],
        notch: [20.32, F],
        ling: [22.45, F],
        tags: { rs: [6.33, 8.0], rm: [6.92, 8.0], ri: [7.36, 8.0], oblR: [9.6, 11.0], hor: [10.26, 11.0], ls: [13.24, 15.3], li: [13.9, 15.3], oblL: [15.46, 16.6], heart: [17.15, 20.0], notch: [20.32, 22.2], ling: [22.45, F] },
      }}>
        {t >= 24.45 && (
          <svg width={860} height={620} style={{ position: "absolute", left: 0, top: 0, opacity: ramp(t, 24.5, 24.8) }}>
            <path d="M 330 470 C 400 540 470 560 560 560" fill="none" stroke={C.forest} strokeWidth={6} strokeDasharray="14 10" strokeLinecap="round" />
            <circle cx={330} cy={470} r={14} fill={LCOL.rm} stroke={C.forest} strokeWidth={5} />
            <circle cx={560} cy={560} r={14} fill={LING} stroke={C.forest} strokeWidth={5} />
          </svg>
        )}
      </Stage>
      {/* lobe highlight overlay for the "matches the right middle lobe" beat */}
      <DarkCard t={t} t0={A + 0.05}>
        <Page t={t} a={A + 0.05} b={B}>
          <div style={{ position: "absolute", left: 40, top: 30, width: 200, display: "flex", justifyContent: "center" }}>
            <CountBadge t={t} t0={5.4} n="3" label="LOBES" />
          </div>
          <div style={{ position: "absolute", left: 50, top: 40, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.banana, letterSpacing: 3, opacity: 1 - ramp(t, 5.3, 5.5) }}>RIGHT LUNG</div>
          <div style={{ position: "absolute", left: 250, top: 50, width: 520, display: "flex", justifyContent: "space-around" }}>
            <LobeTile t={t} t0={6.33} letter="S" word="Superior" color={LCOL.rs} />
            <LobeTile t={t} t0={6.92} letter="M" word="Middle" color={LCOL.rm} />
            <LobeTile t={t} t0={7.36} letter="I" word="Inferior" color={LCOL.ri} />
          </div>
        </Page>
        <Page t={t} a={B} b={Cc}>
          <div style={{ position: "absolute", left: 40, top: 30, width: 200, display: "flex", justifyContent: "center" }}>
            <CountBadge t={t} t0={8.2} n="2" label="FISSURES" />
          </div>
          <div style={{ position: "absolute", left: 270, top: 46, display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ ...pop(t, 9.6), display: "flex", alignItems: "center", gap: 16 }}><FissIcon kind="obl" /><div style={chip(C.banana, C.forest, 44)}>Oblique</div></div>
            <div style={{ ...pop(t, 10.26), display: "flex", alignItems: "center", gap: 16 }}><FissIcon kind="hor" /><div style={chip(C.banana, C.forest, 44)}>Horizontal</div></div>
          </div>
        </Page>
        <Page t={t} a={Cc} b={D}>
          <div style={{ position: "absolute", left: 40, top: 30, width: 200, display: "flex", justifyContent: "center" }}>
            <CountBadge t={t} t0={12.32} n="2" label="LOBES" />
          </div>
          <div style={{ position: "absolute", left: 50, top: 40, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.banana, letterSpacing: 3, opacity: 1 - ramp(t, 12.2, 12.4) }}>LEFT LUNG</div>
          <div style={{ position: "absolute", left: 250, top: 34, width: 520, display: "flex", justifyContent: "space-around", alignItems: "flex-start" }}>
            <LobeTile t={t} t0={13.24} letter="S" word="Superior" color={LCOL.ls} />
            <LobeTile t={t} t0={13.9} letter="I" word="Inferior" color={LCOL.li} />
          </div>
          <div style={{ position: "absolute", left: 250, width: 520, top: 190, display: "flex", justifyContent: "center", ...pop(t, 15.46) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}><FissIcon kind="obl" /><div style={chip(C.matcha, C.paper, 32)}>only 1 fissure: oblique</div></div>
          </div>
        </Page>
        <Page t={t} a={D} b={22.3}>
          <div style={row(44)}>
            <div style={{ ...pop(t, 16.68), fontFamily: FONT, fontWeight: 800, fontSize: 64, color: C.banana }}>Why?</div>
            <div style={{ ...pop(t, 17.38), ...chip(C.redLight, C.forest, 44) }}>heart leans left</div>
          </div>
          <div style={row(166)}>
            <div style={{ ...pop(t, 18.86), fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper }}>left lung makes room →</div>
            <div style={{ ...pop(t, 20.32), ...chip(C.banana, C.forest, 40) }}>cardiac notch</div>
          </div>
        </Page>
        <Page t={t} a={22.3} b={F + 0.3}>
          <div style={row(40)}>
            <div style={{ ...pop(t, 22.45), ...chip(LING, C.forest, 52) }}>Lingula</div>
            <div style={{ ...pop(t, 23.49), fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.paper }}>= “little tongue”</div>
          </div>
          <div style={row(160)}>
            <div style={{ ...pop(t, 24.03), fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.matchaLight }}>matches the</div>
            <div style={{ ...pop(t, 24.54), ...chip(LCOL.rm, C.forest, 40) }}>right middle lobe</div>
          </div>
        </Page>
      </DarkCard>
    </Scene>
  );
};
/* lights the right middle lobe again for the "matches" beat: handled by a second Lungs prop window */

/* 4. Memory card: Right 3, Left 2 + notch */
export const V4: React.FC = () => {
  const t = useT();
  const R = [
    { L: "R", rest: "ight", n: "3", sub: "lobes", t: 26.35, tn: 26.64, color: LCOL.rm },
    { L: "L", rest: "eft", n: "2", sub: "lobes + notch", t: 27.34, tn: 27.6, color: LCOL.rs },
  ];
  return (
    <Scene start={F} end={29.35}>
      <div style={{ position: "absolute", left: 10, top: 10, width: 840, height: 900, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, F, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 60, display: "flex", justifyContent: "center" }}>
          <div style={{ ...pop(t, 25.99), background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 6, padding: "8px 28px 11px 34px", borderRadius: 18 }}>REMEMBER</div>
        </div>
        {R.map((r, i) => {
          const p = ramp(t, r.t - 0.06, r.t + 0.16);
          const np = ramp(t, r.tn - 0.05, r.tn + 0.2);
          return (
            <div key={r.L} style={{ position: "absolute", left: 60, top: 200 + i * 230, width: 720, height: 190, display: "flex", alignItems: "center", gap: 26, opacity: p, transform: `translateX(${(1 - p) * -60}px)` }}>
              <div style={{ width: 150, height: 150, borderRadius: 36, background: r.color, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 116, lineHeight: "150px", textAlign: "center", boxShadow: "0 8px 0 rgba(0,0,0,0.25)" }}>{r.L}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 84, color: C.paper, letterSpacing: -1 }}><span style={{ color: r.color }}>{r.L}</span>{r.rest}</div>
              <div style={{ marginLeft: "auto", display: "flex", flexDirection: "column", alignItems: "center", opacity: np, transform: `scale(${0.6 + 0.4 * np + 0.15 * Math.sin(np * Math.PI)})` }}>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 120, lineHeight: 1, color: C.banana }}>{r.n}</div>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.matchaLight }}>{r.sub}</div>
              </div>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 0, width: 840, top: 700, display: "flex", justifyContent: "center", alignItems: "center", gap: 18 }}>
          <div style={{ ...pop(t, 28.16), ...chip(C.banana, C.forest, 40) }}>notch</div>
          <div style={{ ...pop(t, 28.5), fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper }}>for the</div>
          <div style={{ ...pop(t, 28.71), display: "flex", alignItems: "center", gap: 10, ...chip(C.redLight, C.forest, 40) }}>
            <svg width={38} height={34} viewBox="0 0 38 34"><path d="M19 32 C 6 22 1 15 1 9 C 1 4 5 1 10 1 C 14 1 17 3 19 7 C 21 3 24 1 28 1 C 33 1 37 4 37 9 C 37 15 32 22 19 32 Z" fill={C.forest} /></svg>
            heart
          </div>
        </div>
      </div>
    </Scene>
  );
};

/* 5. Bonus: Gray 1918 Fig. 961 bronchi + modern labels */
const BW = 500, BH = BW / ASPECT_BRONCHI, BX = 180, BY = 84, BA = 29.35, BB = 33.35;
const BZ0: [number, number, number] = [1.0, 0.5, 0.5], BZ1: [number, number, number] = [1.3, 0.42, 0.66];
const bmap = mkMap(BX, BY, BW, BH, BA, BB, BZ0, BZ1);
export const V5: React.FC = () => {
  const t = useT();
  return (
    <Scene start={BA} end={BB} push={0.005}>
      <div style={{ position: "absolute", left: 0, top: 14, width: 860, display: "flex", justifyContent: "center", ...pop(t, 29.46) }}>
        <div style={{ background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 6, padding: "6px 24px 9px 30px", borderRadius: 16 }}>BONUS · MAIN BRONCHI</div>
      </div>
      <Plate src="plates/bronchi.png" aspect={ASPECT_BRONCHI} x={BX} y={BY} w={BW} a={BA} b={BB} zoomFrom={BZ0} zoomTo={BZ1} />
      <Overlay t={t} map={bmap} fade={BB} items={[
        { f: [0.33, 0.69], text: "Right main bronchus", t: 30.35, px: 200, py: 690, hot: true },
        { f: [0.56, 0.71], text: "Left", t: 30.75, px: 720, py: 520 },
      ]} />
      <div style={{ position: "absolute", left: 0, width: 860, top: 774, display: "flex", justifyContent: "center", gap: 14 }}>
        <div style={{ ...pop(t, 31.19), ...chip(C.forest, C.paper, 40) }}>wider</div>
        <div style={{ ...pop(t, 31.88), ...chip(C.forest, C.paper, 40) }}>shorter</div>
        <div style={{ ...pop(t, 32.63), ...chip(C.forest, C.paper, 40) }}>more vertical</div>
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 866, display: "flex", justifyContent: "center", ...pop(t, 32.95) }}>
        <div style={{ ...chip(C.banana, C.forest, 26) }}>1918 atlas name: “right bronchus”</div>
      </div>
    </Scene>
  );
};

/* 6. Rhyme card: Inhale a bite, it goes down the right */
export const V6: React.FC = () => {
  const t = useT();
  const fall = ramp(t, 34.3, 35.1);
  // bite path: down the trachea, then into the RIGHT main bronchus (viewer's left)
  const bx = fall < 0.55 ? 430 : 430 - (fall - 0.55) / 0.45 * 62;
  const by = fall < 0.55 ? 40 + fall / 0.55 * 150 : 190 + (fall - 0.55) / 0.45 * 105;
  return (
    <Scene start={33.35} end={35.65}>
      <div style={{ position: "absolute", left: 10, top: 10, width: 840, height: 900, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 33.35, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 60, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 78, lineHeight: 1.15, color: C.paper, letterSpacing: -1 }}>
          <div style={pop(t, 33.44)}><span style={{ color: C.banana }}>I</span>nhale a <span style={{ color: C.banana }}>b</span>ite,</div>
          <div style={pop(t, 34.26)}>it goes down the</div>
          <div style={{ ...pop(t, 34.95), display: "inline-block", marginTop: 12, background: C.banana, color: C.forest, borderRadius: 24, padding: "4px 34px 14px" }}>RIGHT</div>
        </div>
        <svg width={840} height={440} viewBox="250 10 360 345" style={{ position: "absolute", left: 0, top: 440, ...pop(t, 33.6) }}>
          <path d="M 412 20 L 448 20 L 448 182 L 412 182 Z" fill="#E9E3C8" stroke={C.paper} strokeWidth={4} />
          {[40, 70, 100, 130, 160].map((y) => <path key={y} d={`M 414 ${y} Q 430 ${y + 8} 446 ${y}`} fill="none" stroke="#A9A184" strokeWidth={3} />)}
          <path d="M 412 176 L 432 188 L 388 300 L 352 284 Z" fill={t >= 34.95 ? C.banana : "#E9E3C8"} stroke={C.paper} strokeWidth={4} strokeLinejoin="round" />
          <path d="M 428 188 L 448 176 L 560 252 L 544 274 Z" fill="#E9E3C8" stroke={C.paper} strokeWidth={4} strokeLinejoin="round" opacity={0.75} />
          <text x={340} y={338} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.banana}>patient's right</text>
          <text x={560} y={300} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.matchaLight}>left</text>
          {fall > 0 && <circle cx={bx} cy={by} r={13} fill={C.redLight} stroke={C.paper} strokeWidth={4} />}
        </svg>
      </div>
    </Scene>
  );
};

/* 7. Gray 1918 Fig. 490: same lungs, modern labels, orientation warning */
export const PP: Record<"rlung" | "llung" | "notch" | "ling", [number, number]> = {
  rlung: [0.12, 0.74], // lower right lung (viewer's left)
  llung: [0.9, 0.72], // left lung (viewer's right)
  notch: [0.755, 0.7], // anterior border of left lung curving around the left ventricle
  ling: [0.81, 0.925], // tongue of the left lung below the notch
};
const QX = 80, QY = 96, QW = 700, QH = QW / ASPECT_LUNGS, QA = 35.65, QB = 41.1;
const QZ0: [number, number, number] = [1.0, 0.5, 0.5], QZ1: [number, number, number] = [1.06, 0.5, 0.55];
const qmap = mkMap(QX, QY, QW, QH, QA, QB, QZ0, QZ1);
export const V7: React.FC = () => {
  const t = useT();
  const [rx, ry] = qmap(t, 0.07, 0.08), [lx, ly] = qmap(t, 0.93, 0.08);
  return (
    <Scene start={QA} end={QB} push={0.005}>
      <div style={{ position: "absolute", left: 0, top: 6, width: 860, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.matcha, letterSpacing: 4, ...pop(t, 35.78) }}>SAME LUNGS · 1918 ATLAS</div>
      <Plate src="plates/lungs.png" aspect={ASPECT_LUNGS} x={QX} y={QY} w={QW} a={QA} b={QB} zoomFrom={QZ0} zoomTo={QZ1} credit="Gray's Anatomy, 1918 · public domain" />
      <Overlay t={t} map={qmap} fade={QB} items={[
        { f: PP.rlung, text: "3 lobes", t: 36.3, px: 190, py: QY + QH + 52, color: LCOL.rm, end: 38.3 },
        { f: PP.llung, text: "2 lobes", t: 36.6, px: 680, py: QY + QH + 52, color: LCOL.rs, end: 38.3 },
        { f: PP.notch, text: "Cardiac notch", t: 37.0, px: 450, py: 470, hot: true },
        { f: PP.ling, text: "Lingula", t: 37.4, px: 470, py: 700, color: LING },
      ]} />
      {/* orientation: patient's right is on the viewer's left */}
      <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {[{ x: rx, y: ry, L: "R", t0: 39.45, c: LCOL.rm }, { x: lx, y: ly, L: "L", t0: 40.14, c: LCOL.rs }].map((m) => {
          const p = ramp(t, m.t0 - 0.05, m.t0 + 0.2) * (1 - ramp(t, QB - 0.1, QB + 0.3));
          if (p <= 0) return null;
          return (
            <g key={m.L} transform={`translate(${m.x} ${m.y}) scale(${0.6 + 0.4 * p + 0.2 * Math.sin(p * Math.PI)})`} opacity={p}>
              <circle r={44} fill={m.c} stroke={C.forest} strokeWidth={6} />
              <text y={20} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={56} fill={C.forest}>{m.L}</text>
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: 0, top: QY + QH + 22, width: 860, display: "flex", justifyContent: "center", alignItems: "center", gap: 12, opacity: ramp(t, 38.9, 39.2) * (1 - ramp(t, QB - 0.1, QB + 0.3)) }}>
        <div style={{ ...pop(t, 38.9), ...chip(C.forest, C.paper, 34) }}>patient's <span style={{ color: LCOL.rm }}>right</span></div>
        <div style={{ ...pop(t, 39.6), fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest }}>=</div>
        <div style={{ ...pop(t, 40.05), ...chip(C.banana, C.forest, 34) }}>your left</div>
      </div>
    </Scene>
  );
};

/* 8. Quick test */
export const C0 = 43.25;
const MiniLung: React.FC<{ side: "r" | "l"; color: string }> = ({ side, color }) => (
  <svg width={110} height={130} viewBox="0 0 110 130" style={{ transform: side === "l" ? "scaleX(-1)" : undefined }}>
    <path d="M 70 6 C 50 8 20 40 12 70 C 6 92 6 112 10 122 C 30 120 60 116 96 122 C 100 90 100 50 92 24 C 88 12 80 6 70 6 Z" fill={color} stroke={C.paper} strokeWidth={5} />
  </svg>
);
export const V8: React.FC = () => {
  const t = useT();
  const n = t < C0 ? null : t < C0 + 0.5 ? 3 : t < C0 + 1.0 ? 2 : t < C0 + 1.5 ? 1 : null;
  const k = Math.floor((t - C0) / 0.5) * 0.5 + C0;
  return (
    <Scene start={41.1} end={44.78}>
      <div style={{ position: "absolute", left: 10, top: 20, width: 840, height: 880, borderRadius: 48, background: C.forest, ...pop(t, 41.12, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 50, display: "flex", justifyContent: "center" }}>
          <div style={{ background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, padding: "8px 28px 11px 36px", borderRadius: 18 }}>QUICK TEST</div>
        </div>
        <div style={{ position: "absolute", left: 40, width: 760, top: 165, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 68, lineHeight: 1.18, color: C.paper, ...pop(t, 41.89) }}>
          Which lung has the <span style={{ background: LING, color: C.forest, borderRadius: 16, padding: "0 14px 4px", display: "inline-block" }}>lingula</span>?
        </div>
        <div style={{ position: "absolute", left: 0, top: 410, width: 840, display: "flex", justifyContent: "center", gap: 40 }}>
          {[{ k: "Right", s: "r" as const, c: LCOL.rm }, { k: "Left", s: "l" as const, c: LCOL.rs }].map((c, i) => (
            <div key={c.k} style={{ ...pop(t, 42.5 + i * 0.15), width: 280, height: 210, borderRadius: 30, background: C.matchaDark, border: `4px solid ${c.c}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <MiniLung side={c.s} color={c.c} />
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.paper, marginTop: 4 }}>{c.k} lung</div>
            </div>
          ))}
        </div>
        {n && (
          <div style={{ position: "absolute", left: 0, width: 840, top: 668, display: "flex", justifyContent: "center", transform: `scale(${1.3 - 0.3 * ramp(t, k, k + 0.15)})` }}>
            <div style={{ width: 160, height: 160, borderRadius: 80, background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 110, lineHeight: "160px", textAlign: "center" }}>{n}</div>
          </div>
        )}
      </div>
    </Scene>
  );
};

/* 9. Answer: the LEFT lung (lingula just below the cardiac notch) */
export const V9: React.FC = () => {
  const t = useT();
  return (
    <Scene start={44.78} end={48.1} push={0.01}>
      <Stage t={t} start={44.78} steps={[{ t: 44.78, zoom: [1.0, 0.5, 0.5] }, { t: 45.7, zoom: [1.35, 0.68, 0.95] }]}
        props={{ sides: [44.8], heart: [44.8], lit: { ls: [44.87] }, ling: [45.0], notch: [46.6], tags: { ling: [45.1], notch: [46.77] } }} />
      <DarkCard t={t} t0={44.82} h={250}>
        <div style={{ position: "absolute", left: 0, width: 800, top: 26, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 76, color: C.paper, letterSpacing: -1, ...pop(t, 44.87) }}>
          The <span style={{ color: LCOL.ls }}>left</span> lung ✓
        </div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 146, display: "flex", justifyContent: "center", alignItems: "center", gap: 14 }}>
          <div style={{ ...pop(t, 46.51), fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.matchaLight }}>just below the</div>
          <div style={{ ...pop(t, 46.77), ...chip(C.banana, C.forest, 38) }}>cardiac notch</div>
        </div>
      </DarkCard>
    </Scene>
  );
};

/* 10. Save */
export const V10: React.FC = () => {
  const t = useT();
  const b = ramp(t, 48.2, 48.55);
  const T = [
    { L: "R", n: "3", s: "lobes · 2 fissures", c: LCOL.rm },
    { L: "L", n: "2", s: "lobes · notch + lingula", c: LCOL.rs },
  ];
  return (
    <Scene start={48.1} end={50.35}>
      <div style={center(20, pop(t, 48.15))}>
        <svg width={200} height={250} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={center(300, pop(t, 48.24))}>
        <Big size={120}>SAVE THIS</Big>
      </div>
      <div style={center(450, pop(t, 49.23))}>
        <Big size={58} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ ...center(570), flexDirection: "column", alignItems: "center", gap: 16 }}>
        {T.map((x, i) => (
          <div key={x.L} style={{ ...pop(t, 49.4 + i * 0.12), width: 700, height: 120, borderRadius: 30, background: C.forest, display: "flex", alignItems: "center", gap: 22, padding: "0 22px", boxSizing: "border-box" }}>
            <div style={{ width: 86, height: 86, borderRadius: 22, background: x.c, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 62, lineHeight: "86px", textAlign: "center", flexShrink: 0 }}>{x.L}</div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 72, color: C.banana, lineHeight: 1 }}>{x.n}</div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.paper, whiteSpace: "nowrap" }}>{x.s}</div>
          </div>
        ))}
      </div>
    </Scene>
  );
};

/* 11. End card */
export const END_T = 54.4;
export const V11: React.FC = () => {
  const t = useT();
  return (
    <Scene start={50.35} end={END_T}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, 50.38, 0.35) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.matchaLight, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 51.4, 51.7) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 50.6) * 5))})`, opacity: ramp(t, 50.55, 50.85) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
export const V12: React.FC = () => null;
