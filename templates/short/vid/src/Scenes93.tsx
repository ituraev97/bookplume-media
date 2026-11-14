import React from "react";
import { Img, staticFile } from "remotion";
import { C, FONT, Pill, Scene, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, pop } from "./Scenes67";
import { SB, SCOL, SLETTER, SNAME, SORDER, Sma } from "./Sma93";

export const A534 = 1560 / 1962;
export const P534 = "plates/sma534.png";
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* voice times (words.json) */
export const REVEAL = 3.62;
export const TICKS = [1.8, 2.4, 3.0];
export const TB: Record<SB, number> = { IPD: 8.01, JI: 11.1, MC: 14.58, RC: 15.53, IC: 16.36 };
const MN: [string, number, string][] = [["I", 6.32, "nferior pancreaticoduodenal"], ["Just", 6.39, "ejunal + ileal"], ["Made", 6.57, "iddle colic"], ["Raspberry", 6.75, "ight colic"], ["Ice cream", 7.25, "leocolic"]];

/* ---------- plate with quiz pin, "?" stickers and modern labels ---------- */
export type QL = { x: number; y: number; text: string; t: number; hot?: boolean; ox: number; oy: number };
export type QS = { x0: number; y0: number; x1: number; y1: number; rot?: number; off: number };
export const PlateQ: React.FC<{
  src: string; aspect: number; x: number; y: number; w: number; h: number; a: number; b: number;
  from: [number, number, number]; to: [number, number, number]; labels?: QL[]; ls?: number; credit?: string; still?: boolean;
  pin?: { x: number; y: number; t0: number; t1: number; r?: number }; stickers?: QS[]; tilt?: number; loud?: boolean; tStill?: number; arrow?: boolean;
}> = ({ src, aspect, x, y, w, h, a, b, from, to, labels = [], ls = 34, credit = "Gray's Anatomy, 1918 · public domain", still, pin, stickers = [], tilt = 0, loud, tStill = 0, arrow }) => {
  const tt = useT();
  const t = still ? tStill : tt;
  if (!still && (t < a - 0.3 || t > b + 0.5)) return null;
  const k = still ? 0 : ramp(t, a, b);
  const cx = from[0] + (to[0] - from[0]) * k, cy = from[1] + (to[1] - from[1]) * k, zw = from[2] + (to[2] - from[2]) * k;
  const iw = w / zw, ih = iw / aspect;
  const L = w / 2 - cx * iw, T = h / 2 - cy * ih;
  const P = (fx: number, fy: number) => [L + fx * iw, T + fy * ih];
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: `rotate(${tilt}deg)` }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, overflow: "hidden", borderRadius: loud ? 18 : 40, background: C.paper, boxShadow: loud ? `0 0 0 10px #111, 0 0 0 18px #fff, 0 24px 50px rgba(0,0,0,0.45)` : `0 0 0 5px ${C.line}, 0 20px 44px rgba(31,42,20,0.18)` }}>
        <Img src={staticFile(src)} style={{ position: "absolute", left: L, top: T, width: iw, height: ih, filter: loud ? "contrast(1.3) saturate(1.8)" : undefined }} />
        {stickers.map((s, j) => {
          const f = still ? 0 : ramp(t, s.off - 0.05, s.off + 0.18);
          if (f >= 1) return null;
          const [x0, y0] = P(s.x0, s.y0), [x1, y1] = P(s.x1, s.y1);
          return (
            <div key={j} style={{ position: "absolute", left: x0, top: y0, width: x1 - x0, height: y1 - y0, transform: `rotate(${s.rot ?? 0}deg) scaleX(${1 - f})`, background: C.banana, border: "4px solid #1F2A14", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 0 rgba(31,42,20,0.25)", boxSizing: "border-box" }}>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: Math.min(70, (x1 - x0) * 0.9), color: C.forest, lineHeight: 1 }}>?</div>
            </div>
          );
        })}
        {pin && (() => {
          const on = still ? 1 : ramp(t, pin.t0 - 0.3, pin.t0) * (1 - ramp(t, pin.t1, pin.t1 + 0.3));
          if (on <= 0) return null;
          const [px, py] = P(pin.x, pin.y);
          const r = pin.r ?? 70;
          const pulse = still ? 0.5 : (Math.sin(t * 7) + 1) / 2;
          return (
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: on }} width={w} height={h}>
              <circle cx={px} cy={py} r={r + 14 + pulse * 14} fill="none" stroke="#FF2A1A" strokeWidth={8} opacity={0.35 * (1 - pulse) + 0.15} />
              <circle cx={px} cy={py} r={r + 6} fill="none" stroke="#fff" strokeWidth={18} />
              <circle cx={px} cy={py} r={r + 6} fill="none" stroke="#E5251A" strokeWidth={12} />
              <circle cx={px} cy={py} r={r - 3} fill="none" stroke="#fff" strokeWidth={4} opacity={0.9} />
              <circle cx={px} cy={py} r={13} fill="#E5251A" stroke="#fff" strokeWidth={5} />
              {arrow && (() => {
                const hx = px + (r + 16) * 0.7071, hy = py + (r + 16) * 0.7071;
                const ux = 0.7071, uy = 0.7071, nx = -uy, ny = ux;
                const Lh = 70, Lt = 230, hw = 44, sw = 18;
                const pts = [[hx, hy], [hx + ux * Lh + nx * hw, hy + uy * Lh + ny * hw], [hx + ux * Lh + nx * sw, hy + uy * Lh + ny * sw], [hx + ux * Lt + nx * sw, hy + uy * Lt + ny * sw], [hx + ux * Lt - nx * sw, hy + uy * Lt - ny * sw], [hx + ux * Lh - nx * sw, hy + uy * Lh - ny * sw], [hx + ux * Lh - nx * hw, hy + uy * Lh - ny * hw]];
                return <path d={"M " + pts.map((q) => q.join(" ")).join(" L ") + " Z"} fill="#E5251A" stroke="#111" strokeWidth={8} strokeLinejoin="round" />;
              })()}
            </svg>
          );
        })()}
        {labels.map((l, j) => {
          const p = still ? 1 : ramp(t, l.t - 0.1, l.t + 0.25);
          if (p <= 0) return null;
          const [px, py] = P(l.x, l.y);
          return (
            <div key={j} style={{ position: "absolute", left: px, top: py, width: 0, height: 0, opacity: p }}>
              <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
                <line x1={0} y1={0} x2={l.ox * p} y2={l.oy * p} stroke={C.paper} strokeWidth={10} strokeLinecap="round" />
                <line x1={0} y1={0} x2={l.ox * p} y2={l.oy * p} stroke={C.forest} strokeWidth={5} strokeLinecap="round" />
                <circle cx={0} cy={0} r={11} fill={l.hot ? C.red : C.banana} stroke={C.forest} strokeWidth={4} />
              </svg>
              <div style={{ position: "absolute", left: l.ox, top: l.oy, transform: `translate(${l.ox < 0 ? "-100%" : "0"}, -50%) scale(${(0.85 + 0.15 * p) * (l.hot ? 1 + 0.12 * Math.sin(Math.min(1, ramp(t, l.t, l.t + 0.35)) * Math.PI) : 1)})`, transformOrigin: l.ox < 0 ? "100% 50%" : "0% 50%", background: l.hot ? C.banana : C.forest, color: l.hot ? C.forest : C.paper, fontFamily: FONT, fontWeight: 800, fontSize: ls, lineHeight: 1.1, padding: "5px 16px 9px", borderRadius: 14, whiteSpace: "pre", boxShadow: "0 5px 0 rgba(31,42,20,0.18)", border: l.hot ? `3px solid ${C.forest}` : "none" }}>{l.text}</div>
            </div>
          );
        })}
        {credit && <div style={{ position: "absolute", right: 16, bottom: 12, fontFamily: FONT, fontWeight: 700, fontSize: 19, color: C.forest, opacity: 0.6, background: "rgba(247,246,236,0.88)", padding: "2px 10px", borderRadius: 8 }}>{credit}</div>}
      </div>
    </div>
  );
};

export const Loud: React.FC<{ size: number; children: React.ReactNode; color?: string }> = ({ size, children, color = "#fff" }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, lineHeight: 1, letterSpacing: -1, color, whiteSpace: "nowrap", WebkitTextStroke: `${Math.round(size * 0.12)}px #111`, paintOrder: "stroke fill", textShadow: `0 ${Math.round(size * 0.07)}px 0 #111` } as React.CSSProperties}>{children}</div>
);
export const Burst: React.FC<{ w: number; h: number; cx?: number; cy?: number; rot?: number }> = ({ w, h, cx = 0.5, cy = 0.45, rot = 0 }) => {
  const R = Math.hypot(w, h);
  const X = w * cx, Y = h * cy;
  return (
    <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <radialGradient id={`bg${w}`} cx={cx} cy={cy} r="0.75">
          <stop offset="0" stopColor="#FFF27A" />
          <stop offset="0.45" stopColor="#FFC21C" />
          <stop offset="1" stopColor="#FF7A00" />
        </radialGradient>
      </defs>
      <rect width={w} height={h} fill={`url(#bg${w})`} />
      <g transform={`rotate(${rot} ${X} ${Y})`} opacity={0.32}>
        {Array.from({ length: 24 }).map((_, i) => {
          const a0 = (i / 24) * Math.PI * 2, a1 = a0 + Math.PI / 48;
          return <path key={i} d={`M ${X} ${Y} L ${X + R * Math.cos(a0)} ${Y + R * Math.sin(a0)} L ${X + R * Math.cos(a1)} ${Y + R * Math.sin(a1)} Z`} fill="#fff" />;
        })}
      </g>
    </svg>
  );
};

/* the quiz target: SMA trunk + its printed 1918 name (vertical text along the trunk) */
export const HOOKPIN = { x: 0.533, y: 0.425 };
export const HOOKSTICK: QS = { x0: 0.509, y0: 0.385, x1: 0.547, y1: 0.648, rot: 2, off: REVEAL };

/* 3-2-1 ring */
const Ring: React.FC<{ t: number; size: number }> = ({ t, size }) => {
  if (t > REVEAL + 0.25) return null;
  const k = ramp(t, TICKS[0] - 0.6, REVEAL);
  let n = 3;
  TICKS.forEach((s, i) => { if (t >= s) n = 3 - i; });
  const cur = TICKS[3 - n] ?? 0;
  const bump = ramp(t, cur, cur + 0.15);
  const out = ramp(t, REVEAL - 0.05, REVEAL + 0.2);
  const r = size / 2 - 12;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ width: size, height: size, position: "relative", opacity: 1 - out, transform: `scale(${(1 + 0.12 * (1 - bump)) * (1 - 0.3 * out)})` }}>
      <svg width={size} height={size} style={{ position: "absolute" }}>
        <circle cx={size / 2} cy={size / 2} r={r + 6} fill={C.forest} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(247,246,236,0.18)" strokeWidth={14} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.banana} strokeWidth={14} strokeLinecap="round" strokeDasharray={`${circ * (1 - k)} ${circ}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.5, color: C.paper, lineHeight: 1 }}>{n}</div>
    </div>
  );
};

/* 1. Quiz hook: Gray's 1918 Fig. 534 with a red pin on the SMA from frame 1, 3-2-1, reveal at 3.6 s */
export const V1: React.FC = () => {
  const t = useT();
  const rv = ramp(t, REVEAL, REVEAL + 0.25);
  return (
    <Scene start={-0.6} end={5.15} push={0.02}>
      <div style={center(6, { opacity: 1 - rv })}>
        <Loud size={118}>NAME THIS</Loud>
      </div>
      <div style={center(128, { opacity: 1 - rv })}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ background: "#E5251A", border: "7px solid #111", borderRadius: 18, padding: "0 18px 6px", transform: "rotate(-2deg)" }}><Loud size={92}>ARTERY</Loud></div>
          <Loud size={70}>IN 3 SEC</Loud>
        </div>
      </div>
      {rv > 0 && (
        <div style={center(20, pop(t, REVEAL, 0.3))}>
          <div style={{ textAlign: "center" }}>
            <Big size={72} color={C.forest}>✓ SUPERIOR</Big>
            <div style={{ height: 8 }} />
            <Big size={72} color={C.red}>MESENTERIC ARTERY</Big>
          </div>
        </div>
      )}
      <PlateQ src={P534} aspect={A534} x={30} y={262} w={800} h={610} a={-0.6} b={5.15} from={[0.53, 0.47, 0.62]} to={[0.52, 0.47, 0.5]}
        pin={{ ...HOOKPIN, t0: -1, t1: REVEAL + 0.2 }} stickers={[HOOKSTICK]}
        labels={[
          { x: 0.533, y: 0.43, text: "superior mesenteric\nartery", t: REVEAL + 0.02, hot: true, ox: 16, oy: -150 },
          { x: 0.545, y: 0.565, text: "5 branches", t: 4.45, hot: false, ox: 90, oy: 20 },
        ]} ls={31} />
      <div style={{ position: "absolute", left: 50, top: 690 }}>
        <Ring t={t} size={170} />
      </div>
      <div style={center(890, pop(t, 0.05, 0.25))}>
        {t < REVEAL ? <Pill size={34} bg={C.forest}>anatomy quiz · say it before the 1</Pill> : (
          <div style={{ ...pop(t, REVEAL + 0.6, 0.25) }}><Pill size={38} bg={C.banana} color={C.forest}>SMA · 5 branches · mnemonic</Pill></div>
        )}
      </div>
    </Scene>
  );
};

export const LChip: React.FC<{ l: string; size?: number; on?: number; hot?: boolean; col?: string; dark?: boolean }> = ({ l, size = 70, on = 1, hot, col = C.red, dark }) => (
  <div style={{ width: size, height: size, flex: `0 0 ${size}px`, borderRadius: size * 0.28, background: on > 0.5 ? col : dark ? "rgba(247,246,236,0.1)" : "rgba(31,42,20,0.08)", border: `4px solid ${on > 0.5 ? C.forest : dark ? "rgba(247,246,236,0.3)" : "rgba(31,42,20,0.25)"}`, color: on > 0.5 ? C.paper : dark ? "rgba(247,246,236,0.55)" : "rgba(31,42,20,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.58, transform: `scale(${hot ? 1.16 : 1})`, boxShadow: hot ? `0 0 0 6px ${C.banana}` : "none", boxSizing: "border-box", lineHeight: 1 }}>
    {l}
  </div>
);

/* 2. Mnemonic card: I Just Made Raspberry Ice cream */
export const V2: React.FC = () => {
  const t = useT();
  return (
    <Scene start={5.15} end={8.0} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, ...pop(t, 5.17, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 5, color: C.banana }}>SMA MNEMONIC · 5 BRANCHES</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 98, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: "#B9D27A" }}>first letters, top to bottom</div>
        <div style={{ position: "absolute", left: 50, width: 740, top: 178, display: "flex", flexDirection: "column", gap: 22 }}>
          {MN.map(([w, s, rest], i) => {
            const p = ramp(t, s - 0.08, s + 0.12);
            const q = ramp(t, s + 0.35, s + 0.6);
            return (
              <div key={i} style={{ opacity: 0.3 + 0.7 * p, transform: `translateX(${(1 - p) * 30}px)` }}>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 70, lineHeight: 1.0, color: C.paper, whiteSpace: "nowrap" }}>
                  <span style={{ background: p > 0.5 ? (i === 1 ? "#B9D27A" : C.banana) : "rgba(247,246,236,0.14)", color: C.forest, borderRadius: 14, padding: "0 12px 4px" }}>{w[0]}</span>
                  {w.slice(1)}
                </div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: "#B9D27A", marginTop: 6, marginLeft: 6, opacity: q, whiteSpace: "nowrap" }}>
                  → <span style={{ color: C.banana }}>{w[0]}</span>{rest}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Scene>
  );
};

type Kf = [number, number, number, number];
const cam = (t: number, ks: Kf[]) => {
  if (t <= ks[0][0]) return ks[0];
  for (let i = 0; i < ks.length - 1; i++) {
    const a = ks[i], b = ks[i + 1];
    if (t <= b[0]) {
      const k = ramp(t, a[0], b[0]);
      const e = k * k * (3 - 2 * k);
      return [t, a[1] + (b[1] - a[1]) * e, a[2] + (b[2] - a[2]) * e, a[3] + (b[3] - a[3]) * e] as Kf;
    }
  }
  return ks[ks.length - 1];
};

const NOTE: Record<SB, string> = {
  IPD: "1st branch · pancreas head + duodenum",
  JI: "patient's LEFT · lots of them, in arcades",
  MC: "patient's RIGHT · up to the transverse colon",
  RC: "patient's RIGHT · to the ascending colon",
  IC: "patient's RIGHT · LAST · cecum + appendix",
};
const Strip: React.FC<{ t: number; top: number }> = ({ t, top }) => {
  let cur = -1;
  SORDER.forEach((b, i) => { if (t >= TB[b] - 0.05) cur = i; });
  return (
    <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", gap: 14 }}>
      {SORDER.map((b, i) => {
        const p = ramp(t, TB[b] - 0.05, TB[b] + 0.12);
        return <div key={b} style={{ transform: `scale(${1 + 0.2 * p * (1 - ramp(t, TB[b] + 0.12, TB[b] + 0.4))})` }}><LChip l={SLETTER[b]} size={84} on={p} hot={cur === i} col={SCOL(b)} /></div>;
      })}
    </div>
  );
};
const NameCard: React.FC<{ t: number; top: number }> = ({ t, top }) => {
  let cur: SB | null = null;
  SORDER.forEach((b) => { if (t >= TB[b] - 0.02) cur = b; });
  if (!cur) return null;
  const b = cur as SB;
  const p = ramp(t, TB[b] - 0.02, TB[b] + 0.2);
  const name = SNAME[b];
  return (
    <div key={b} style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, background: C.forest, borderRadius: 30, padding: "12px 28px 14px 14px", transform: `scale(${0.85 + 0.15 * p})`, opacity: p, boxShadow: "0 10px 0 rgba(31,42,20,0.15)" }}>
        <LChip l={SLETTER[b]} size={76} col={SCOL(b)} />
        <div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: name.length > 20 ? 42 : 50, color: C.paper, lineHeight: 1.05, whiteSpace: "nowrap" }}>
            <span style={{ background: C.banana, color: C.forest, borderRadius: 10, padding: "0 6px 2px" }}>{name[0]}</span>{name.slice(1)}
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 27, color: "#B9D27A", marginTop: 4, whiteSpace: "nowrap" }}>{NOTE[b]}</div>
        </div>
      </div>
    </div>
  );
};

/* 3. Our own diagram: every branch lights up as it is named */
export const V3: React.FC = () => {
  const t = useT();
  const k = cam(t, [[8.0, 1.3, 470, 400], [10.6, 1.25, 480, 420], [11.3, 0.95, 640, 600], [13.9, 0.92, 620, 600], [14.6, 0.95, 380, 420], [16.2, 0.84, 400, 600], [17.75, 0.8, 470, 560]]);
  const [, s, cx, cy] = k;
  const top = 150, h = 712;
  const X0 = 430 - cx * s, Y0 = h / 2 - cy * s;
  const lit: Partial<Record<SB, number>> = { ...TB };
  let hot: SB[] = [];
  SORDER.forEach((b) => { if (t >= TB[b] - 0.05) hot = [b]; });
  return (
    <Scene start={8.0} end={17.75} push={0.004}>
      <div style={{ position: "absolute", left: 0, top, width: 860, height: h, overflow: "hidden", borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}` }}>
        <div style={{ position: "absolute", left: X0, top: Y0 }}>
          <Sma t={t} w={1000 * s} id="v3" lit={lit} hot={hot} sides={ramp(t, 11.0, 11.4)} />
        </div>
        <div style={{ position: "absolute", right: 16, bottom: 12, fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.forest, opacity: 0.55, background: "rgba(255,254,246,0.85)", borderRadius: 8, padding: "0 8px" }}>front view · diagram: Book Plume</div>
      </div>
      <Strip t={t} top={36} />
      <NameCard t={t} top={878} />
    </Scene>
  );
};

/* 4. Quick test with 3-2-1 */
export const V4: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[19.96, 3], [20.6, 2], [21.24, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < 21.9) { n = v; n0 = s; } });
  return (
    <Scene start={17.75} end={21.9}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 17.8, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 42, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 30, width: 760, top: 104, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 62, lineHeight: 1.1, color: C.paper, ...pop(t, 18.4) }}>
          Which one is the <span style={{ color: C.banana }}>LAST</span> SMA branch?
        </div>
        <div style={{ position: "absolute", left: 60, top: 300, width: 700, display: "flex", flexDirection: "column", gap: 14 }}>
          {SORDER.map((b, i) => (
            <div key={b} style={{ height: 74, borderRadius: 22, background: "rgba(247,246,236,0.08)", border: "3px solid rgba(247,246,236,0.18)", display: "flex", alignItems: "center", gap: 16, padding: "0 16px", boxSizing: "border-box", ...pop(t, 18.9 + i * 0.08, 0.25) }}>
              <LChip l={SLETTER[b]} size={52} col="#7B8C63" />
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.paper, whiteSpace: "nowrap" }}>{SNAME[b]}</div>
            </div>
          ))}
        </div>
        {n !== null ? (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 718, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 130, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        ) : (
          <div style={{ position: "absolute", left: 0, width: 820, top: 760, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#B9D27A", opacity: ramp(t, 19.3, 19.5) }}>pause · say it out loud</div>
        )}
      </div>
    </Scene>
  );
};

/* 5. Answer on the real thing: Gray's 1918 Fig. 534, ileocolic */
export const V5: React.FC = () => {
  const t = useT();
  return (
    <Scene start={21.9} end={24.9} push={0.006}>
      <div style={center(30, pop(t, 21.95, 0.25))}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, background: C.matcha, border: `4px solid ${C.forest}`, borderRadius: 26, padding: "10px 26px 14px 12px" }}>
          <LChip l="I" size={72} col={C.red} />
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.paper, whiteSpace: "nowrap" }}>✓ Ileocolic = the last</div>
        </div>
      </div>
      <div style={center(124, pop(t, 23.4, 0.25))}>
        <Pill size={34} bg={C.forest}>reaches the cecum + appendix</Pill>
      </div>
      <PlateQ src={P534} aspect={A534} x={30} y={196} w={800} h={646} a={21.9} b={24.9} from={[0.36, 0.62, 0.6]} to={[0.34, 0.64, 0.54]} ls={32}
        labels={[
          { x: 0.522, y: 0.62, text: "SMA", t: 22.1, hot: false, ox: -40, oy: 150 },
          { x: 0.43, y: 0.592, text: "ileocolic", t: 21.95, hot: true, ox: -30, oy: 120 },
          { x: 0.16, y: 0.715, text: "cecum", t: 23.46, hot: true, ox: 40, oy: -170 },
        ]} />
      <div style={{ position: "absolute", left: 30, top: 852, opacity: ramp(t, 23.0, 23.25) }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 16px 10px", fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.forest, whiteSpace: "nowrap" }}>
          <span style={{ color: C.matcha }}>1918 atlas name:</span> “cæcum” = cecum
        </div>
      </div>
    </Scene>
  );
};

/* 6. Save + cheat sheet */
export const V6: React.FC = () => {
  const t = useT();
  const s0 = 24.9;
  const bb = ramp(t, s0 + 0.05, s0 + 0.4);
  const rows: [SB, string][] = [["IPD", "1st · pancreas head + duodenum"], ["JI", "to the LEFT · small intestine"], ["MC", "transverse colon"], ["RC", "ascending colon"], ["IC", "LAST · cecum + appendix"]];
  return (
    <Scene start={s0} end={26.9}>
      <div style={{ position: "absolute", left: 40, top: 0, ...pop(t, s0 + 0.05) }}>
        <svg width={110} height={140} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - bb) * -40})`} />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 170, top: 6, ...pop(t, s0 + 0.1) }}>
        <Big size={100}>SAVE THIS</Big>
      </div>
      <div style={{ position: "absolute", left: 172, top: 112, ...pop(t, s0 + 0.3) }}>
        <Big size={40} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ position: "absolute", left: 30, top: 190, width: 800, height: 700, borderRadius: 40, background: C.card, border: `3px solid ${C.line}`, boxShadow: "0 18px 40px rgba(31,42,20,0.12)", padding: "28px 36px", boxSizing: "border-box", ...pop(t, s0 + 0.15, 0.3) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.matcha, letterSpacing: 2 }}>SUPERIOR MESENTERIC ARTERY · L1 · MIDGUT</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.forest, marginTop: 10, whiteSpace: "nowrap" }}>I Just Made Raspberry Ice cream</div>
        <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 22 }}>
          {rows.map(([b, n], i) => (
            <div key={b} style={{ display: "flex", alignItems: "center", gap: 16, opacity: ramp(t, s0 + 0.2 + i * 0.06, s0 + 0.4 + i * 0.06) }}>
              <LChip l={SLETTER[b]} size={72} col={SCOL(b)} />
              <div>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.forest, whiteSpace: "nowrap", lineHeight: 1.05 }}>{SNAME[b]}</div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 27, color: C.matcha, whiteSpace: "nowrap" }}>{n}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Scene>
  );
};

/* 7. End card (≤ 1.5 s) */
export const V7: React.FC = () => {
  const t = useT();
  const s0 = 26.9;
  return (
    <Scene start={s0} end={28.2}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, s0 + 0.02, 0.3) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.banana, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, s0 + 0.15, s0 + 0.4) }}>
          anatomy quizzes you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - s0) * 5))})`, opacity: ramp(t, s0 + 0.05, s0 + 0.25) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
