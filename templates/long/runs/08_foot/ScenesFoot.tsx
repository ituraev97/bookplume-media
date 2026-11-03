import React from "react";
import { Img, staticFile } from "remotion";
import { C, FONT, ramp, useT } from "./kit";
import { Facts, Stage, LogoMark } from "./Chrome16";
import { FootTop, AnkleSide, AnkleBack, ArchSide, TransArch, FT, AS, AB, GC, LIGC } from "./IllusFoot";
import { SEG } from "./cues";
import { CHAPTERS, END } from "./timeline";

/* ---------- timing helpers (all from the voice alignment) ---------- */
export const s_ = (i: number) => SEG[i].s;
export const e_ = (i: number) => SEG[i].e;
export const wf = (i: number, str: string, n = 0) => {
  let c = 0;
  for (let k = 0; k < SEG[i].t.length; k++) {
    if (SEG[i].t[k].startsWith(str)) {
      if (c === n) return SEG[i].w[k];
      c++;
    }
  }
  throw new Error(`cue not found: ${i} ${str}`);
};
const CHs = (n: number) => CHAPTERS[n].s;
export const ST = (n: number) => CHs(n) + 2.3;
export const BE = (n: number) => (n + 1 < CHAPTERS.length ? CHs(n + 1) - 0.1 : END);

/* ---------- small UI pieces ---------- */
export const abs = (x: number, y: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: x, top: y, ...extra });
export const pop = (t: number, t0: number, d = 0.3): React.CSSProperties => {
  const p = ramp(t, t0, t0 + d);
  return { opacity: p, transform: `scale(${0.6 + 0.4 * p + 0.08 * Math.sin(Math.min(1, p) * Math.PI)})` };
};
export const Big: React.FC<{ size?: number; color?: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ size = 100, color = C.forest, children, style }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1.04, letterSpacing: -2, ...style }}>{children}</div>
);
export const Mk: React.FC<{ p: number; children: React.ReactNode }> = ({ p, children }) => (
  <span style={{ background: `linear-gradient(${C.banana}, ${C.banana}) no-repeat 0 88% / ${p * 100}% 38%` }}>{children}</span>
);
export const Seg: React.FC<{ t: number; a: number; b: number; children: React.ReactNode }> = ({ t, a, b, children }) => {
  const o = ramp(t, a, a + 0.4) * (1 - ramp(t, b - 0.2, b + 0.2));
  if (o <= 0.001) return null;
  return <div style={{ position: "absolute", inset: 0, opacity: o, transform: `translateY(${(1 - ramp(t, a, a + 0.4)) * 20}px)` }}>{children}</div>;
};
export const Note: React.FC<{ t: number; t0: number; old: string; x: number; y: number; modern?: string }> = ({ t, t0, old, x, y, modern }) => (
  <div style={abs(x, y, { ...pop(t, t0), background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 20px 11px", fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.forest, whiteSpace: "nowrap", boxShadow: "0 8px 20px rgba(31,42,20,0.10)", transformOrigin: "0% 50%", zIndex: 6 })}>
    <span style={{ color: C.matcha }}>1918 atlas name:</span> {old}{modern ? <span style={{ color: C.matcha }}> = {modern}</span> : null}
  </div>
);
export const Chip: React.FC<{ t: number; t0: number; bg?: string; color?: string; size?: number; children: React.ReactNode }> = ({ t, t0, bg = C.forest, color = C.paper, size = 34, children }) => (
  <div style={{ ...pop(t, t0), display: "inline-block", background: bg, color, fontFamily: FONT, fontWeight: 800, fontSize: size, padding: `${size * 0.3}px ${size * 0.62}px ${size * 0.38}px`, borderRadius: size * 0.6, whiteSpace: "nowrap", transformOrigin: "0% 50%" }}>{children}</div>
);
export const ViewTag: React.FC<{ t: number; t0: number; x: number; y: number; text: string }> = ({ t, t0, x, y, text }) => (
  <div style={abs(x, y, { opacity: ramp(t, t0, t0 + 0.4), fontFamily: FONT, fontWeight: 800, fontSize: 22, letterSpacing: 3, color: C.matcha, background: "rgba(247,246,236,0.9)", padding: "4px 12px", borderRadius: 10, whiteSpace: "nowrap", zIndex: 5 })}>{text}</div>
);
/** HTML tag pinned to a point of an SVG diagram (viewBox width vbw) */
export const Tag: React.FC<{ t: number; t0: number; t1?: number; x: number; y: number; w: number; vbw?: number; pt: [number, number]; text: string; dx?: number; dy?: number; hot?: boolean; size?: number; col?: string }> = ({ t, t0, t1, x, y, w, vbw = 900, pt, text, dx = 0, dy = 0, hot, size = 30, col }) => {
  const k = w / vbw;
  const p = ramp(t, t0, t0 + 0.25) * (t1 === undefined ? 1 : 1 - ramp(t, t1, t1 + 0.25));
  if (p <= 0) return null;
  const px = x + pt[0] * k, py = y + pt[1] * k;
  return (
    <>
      {(dx !== 0 || dy !== 0) && (
        <svg style={abs(0, 0, { overflow: "visible", opacity: p, zIndex: 4 })} width={1} height={1}>
          <line x1={px} y1={py} x2={px + dx} y2={py + dy} stroke={C.forest} strokeWidth={3} />
          <circle cx={px} cy={py} r={8} fill={hot ? C.red : C.forest} stroke={C.paper} strokeWidth={3} />
        </svg>
      )}
      <div style={abs(px + dx, py + dy, { transform: `translate(-50%, -50%) scale(${0.8 + 0.2 * p})`, opacity: p, background: col || (hot ? C.banana : C.forest), color: hot || col ? C.forest : C.paper, fontFamily: FONT, fontWeight: 800, fontSize: size, padding: "5px 14px 8px", borderRadius: 14, whiteSpace: "nowrap", boxShadow: "0 6px 0 rgba(31,42,20,0.15)", zIndex: 5 })}>{text}</div>
    </>
  );
};
const Arrow: React.FC<{ t: number; t0: number; x: number; y: number; dir: "l" | "r" | "u" | "d"; label?: string; col?: string; size?: number }> = ({ t, t0, x, y, dir, label, col = C.red, size = 110 }) => {
  const p = ramp(t, t0, t0 + 0.35);
  const off = (1 - p) * 40 + Math.sin(t * 6) * 6 * p;
  const rot = { r: 0, l: 180, d: 90, u: -90 }[dir];
  const tx = dir === "r" ? -off : dir === "l" ? off : 0, ty = dir === "d" ? -off : dir === "u" ? off : 0;
  return (
    <div style={abs(x, y, { opacity: p, transform: `translate(${tx}px, ${ty}px)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, zIndex: 5 })}>
      <svg width={size} height={size * 0.6} viewBox="0 0 100 60" style={{ transform: `rotate(${rot}deg)` }}>
        <path d="M4 22 L62 22 L62 6 L96 30 L62 54 L62 38 L4 38 Z" fill={col} stroke={C.forest} strokeWidth={3} strokeLinejoin="round" />
      </svg>
      {label && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.forest, background: C.card, padding: "3px 12px 5px", borderRadius: 10, whiteSpace: "nowrap" }}>{label}</div>}
    </div>
  );
};
const Panel: React.FC<{ x: number; y: number; w: number; h: number; t: number; t0: number; children: React.ReactNode; bg?: string }> = ({ x, y, w, h, t, t0, children, bg = C.card }) => (
  <div style={abs(x, y, { width: w, height: h, borderRadius: 36, background: bg, boxShadow: `0 0 0 4px ${C.line}, 0 18px 40px rgba(31,42,20,0.10)`, overflow: "hidden", ...pop(t, t0, 0.35) })}>{children}</div>
);
/** numbered row card (muscle / joint) */
const Row: React.FC<{ t: number; t0: number; n: string; col: string; title: string; sub?: string; w?: number; size?: number }> = ({ t, t0, n, col, title, sub, w = 700, size = 40 }) => (
  <div style={{ ...pop(t, t0), width: w, display: "flex", alignItems: "center", gap: 18, background: C.card, border: `3px solid ${C.line}`, borderRadius: 24, padding: "10px 20px", fontFamily: FONT, fontWeight: 800, transformOrigin: "0% 50%", boxSizing: "border-box" }}>
    <div style={{ minWidth: 54, height: 54, borderRadius: 27, background: col, border: `3px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: C.forest }}>{n}</div>
    <div>
      <div style={{ fontSize: size, color: C.forest, lineHeight: 1.1 }}>{title}</div>
      {sub && <div style={{ fontSize: size * 0.7, color: C.matcha, lineHeight: 1.15, marginTop: 2 }}>{sub}</div>}
    </div>

  </div>
);

type PL = { x: number; y: number; text: string; t: number; side?: "l" | "r"; hot?: boolean; col?: string; t1?: number };
type Key = [number, number, number, number]; // time, scale, focusX, focusY
/** plate in a rounded frame; camera follows keyframes; modern labels pinned in image fractions */
export const KPlate: React.FC<{ src: string; aspect: number; x: number; y: number; w: number; a: number; b: number; keys?: Key[]; labels?: PL[]; credit?: boolean; frame?: boolean; ov?: (w: number, h: number, s: number) => React.ReactNode }> = ({ src, aspect, x, y, w, a, b, keys = [], labels = [], credit = true, frame = true, ov }) => {
  const t = useT();
  if (t < a - 0.3 || t > b + 0.5) return null;
  const h = w / aspect;
  const i = ramp(t, a - 0.1, a + 0.45), o = ramp(t, b - 0.1, b + 0.35);
  const ks: Key[] = keys.length ? keys : [[a, 1, 0.5, 0.5], [b, 1.08, 0.5, 0.5]];
  let s: number, fx: number, fy: number;
  // smooth: blend from previous key to current over 1.4 s
  let cur = 0;
  for (let k = 0; k < ks.length; k++) if (t >= ks[k][0]) cur = k;
  const prev = ks[Math.max(0, cur - 1)], now = ks[cur];
  const e = cur === 0 ? 1 : ramp(t, now[0] - 0.2, now[0] + 1.4);
  s = prev[1] + (now[1] - prev[1]) * e;
  fx = prev[2] + (now[2] - prev[2]) * e;
  fy = prev[3] + (now[3] - prev[3]) * e;
  s *= 1 + 0.03 * ramp(t, now[0], now[0] + 8); // slow push-in
  const cl = (v: number, m: number) => Math.max(-m, Math.min(m, v));
  const tx = cl(-(fx - 0.5) * w * s, ((s - 1) * w) / 2);
  const ty = cl(-(fy - 0.5) * h * s, ((s - 1) * h) / 2);
  return (
    <div style={abs(x, y, { width: w, height: h, opacity: i * (1 - o), transform: `translateY(${(1 - i) * 30}px)` })}>
      <div style={{ position: "absolute", inset: 0, borderRadius: frame ? 36 : 0, overflow: "hidden", background: C.paper, boxShadow: frame ? `0 0 0 4px ${C.line}, 0 18px 40px rgba(31,42,20,0.16)` : "none" }}>
        <div style={{ position: "absolute", width: w, height: h, transform: `translate(${tx}px, ${ty}px) scale(${s})`, transformOrigin: "50% 50%" }}>
          <Img src={staticFile(src)} style={{ width: w, height: h, display: "block" }} />
          {ov && ov(w, h, s)}
          {labels.map((l, j) => {
            const p = ramp(t, l.t - 0.1, l.t + 0.25) * (l.t1 === undefined ? 1 : 1 - ramp(t, l.t1, l.t1 + 0.3));
            if (p <= 0) return null;
            const left = l.side === "l";
            return (
              <div key={j} style={{ position: "absolute", left: l.x * w, top: l.y * h, transform: `translate(${left ? "-100%" : "0"}, -50%) scale(${(0.85 + 0.15 * p) / s})`, transformOrigin: left ? "100% 50%" : "0% 50%", opacity: p, display: "flex", alignItems: "center", flexDirection: left ? "row-reverse" : "row", gap: 8 }}>
                <div style={{ width: 20, height: 20, borderRadius: 10, background: l.hot ? C.red : C.forest, boxShadow: `0 0 0 4px ${C.paper}`, flexShrink: 0 }} />
                <div style={{ background: l.col || (l.hot ? C.banana : C.forest), color: l.hot || l.col ? C.forest : C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 32, padding: "6px 16px 8px", borderRadius: 14, whiteSpace: "nowrap", boxShadow: "0 4px 0 rgba(31,42,20,0.18)" }}>{l.text}</div>
              </div>
            );
          })}
        </div>
      </div>
      {credit && <div style={abs(14, h - 36, { fontFamily: FONT, fontWeight: 700, fontSize: 17, color: C.forest, opacity: 0.6, background: "rgba(247,246,236,0.88)", padding: "2px 10px", borderRadius: 8 })}>Gray's Anatomy, 1918 · public domain</div>}
    </div>
  );
};

const TrickCard: React.FC<{ t: number; t0: number; n: number; title: string; children: React.ReactNode }> = ({ t, t0, n, title, children }) => (
  <div style={abs(0, 0, { width: 1800, height: 740, borderRadius: 44, background: C.forest, overflow: "hidden", ...pop(t, t0, 0.35) })}>
    <div style={abs(60, 40, { fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: C.matchaLight })}>TRICK {n}</div>
    <div style={abs(60, 80, { fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.paper })}>{title}</div>
    {children}
  </div>
);
const FL: React.FC<{ w: string; on: number; col?: string }> = ({ w, on, col = C.banana }) => (
  <span><span style={{ color: on ? col : C.paper, textShadow: on ? `0 0 18px ${C.bananaDark}` : "none", fontSize: "1.25em" }}>{w[0]}</span>{w.slice(1)}</span>
);
/** animated value between keyframes [time, value] */
const kv = (t: number, ks: [number, number][]) => {
  if (t <= ks[0][0]) return ks[0][1];
  for (let i = 0; i < ks.length - 1; i++) {
    if (t < ks[i + 1][0]) return ks[i][1] + (ks[i + 1][1] - ks[i][1]) * ramp(t, ks[i][0], ks[i + 1][0]);
  }
  return ks[ks.length - 1][1];
};



/* ---------- plates (Gray's Anatomy 1918, public domain) ---------- */
const P = (f: string, w: number, h: number) => ({ src: `plates/${f}.png`, aspect: w / h });
export const DORS = P("dorsal", 1762, 3160);
export const PLAN = P("plantar", 1773, 3141);
export const MEDS = P("medial", 1910, 705);
export const LATS = P("lateral", 1910, 674);
export const LLIG = P("latlig", 2126, 1688);
export const MLIG = P("medlig", 2172, 1630);
export const CORO = P("coronal", 1933, 1561);
export const TALP = P("talus", 1433, 1237);
export const DMID = P("dmid", 1762, 1769);
export const DFORE = P("dfore", 1762, 1770);
export const PMID = P("pmid", 1773, 1758);

const FTW = 520; // FootTop width in panels (viewBox 800 → k = 0.7)
const FTag: React.FC<{ t: number; t0: number; t1?: number; x: number; y: number; w?: number; id: string; text: string; dx?: number; dy?: number; hot?: boolean; col?: string; size?: number }> = ({ w = FTW, id, ...r }) => (
  <Tag {...r} w={w} vbw={800} pt={FT[id]} />
);
const Eq: React.FC<{ t: number; parts: [string, number, string?][]; size?: number }> = ({ t, parts, size = 120 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: FONT, fontWeight: 800, fontSize: size, color: C.forest }}>
    {parts.map(([txt, tt, col], i) => (
      <div key={i} style={{ ...pop(t, tt), color: col || C.forest }}>{txt}</div>
    ))}
  </div>
);
const Stamp: React.FC<{ t: number; t0: number; text: string; x: number; y: number; rot?: number; col?: string; size?: number }> = ({ t, t0, text, x, y, rot = -8, col = C.red, size = 50 }) => {
  if (t < t0) return null;
  const p = ramp(t, t0, t0 + 0.2);
  return (
    <div style={abs(x, y, { transform: `rotate(${rot}deg) scale(${1.6 - 0.6 * p})`, opacity: p, border: `6px solid ${col}`, color: col, fontFamily: FONT, fontWeight: 800, fontSize: size, padding: "6px 22px 10px", borderRadius: 16, background: "rgba(247,246,236,0.92)", whiteSpace: "nowrap", zIndex: 8, letterSpacing: 1 })}>{text}</div>
  );
};

/* ================= INTRO ================= */
export const SIntro: React.FC = () => {
  const t = useT();
  const m = s_(3) - 0.2;
  const tw = wf(0, "twenty");
  // bones pop in one group after another while the count runs up to 26
  const g = { tarsal: ramp(t, 1.0, 1.6), meta: ramp(t, 1.6, 2.2), phal: ramp(t, 2.2, 2.8) };
  const count = Math.round(26 * ramp(t, 0.8, tw + 0.4));
  return (
    <Stage a={-1} b={BE(0)}>
      <Seg t={t} a={-1} b={m}>
        <Panel x={0} y={0} w={620} h={740} t={t} t0={0}>
          <div style={abs(80, 40)}><FootTop t={t} w={520} groups={g} skin={0.7} /></div>
          <ViewTag t={t} t0={0.4} x={24} y={702} text="RIGHT FOOT · FROM ABOVE" />
        </Panel>
        <div style={abs(680, 0, { width: 1120, ...pop(t, 0.2) })}>
          <Big size={92}><Mk p={ramp(t, 0.6, 1.6)}>Bones of the Foot</Mk></Big>
          <Big size={92}><Mk p={ramp(t, 1.2, 2.2)}>and Ankle</Mk></Big>
          <Big size={50} color={C.matcha} style={{ marginTop: 8 }}>made easy · in about 10 minutes</Big>
        </div>
        <div style={abs(680, 300, { display: "flex", alignItems: "flex-end", gap: 24, ...pop(t, 0.8) })}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 210, lineHeight: 0.9, color: C.red }}>{count}</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.forest, paddingBottom: 24 }}>bones in <span style={{ background: C.banana, padding: "0 10px", borderRadius: 10 }}>each</span> foot</div>
        </div>
        <div style={abs(680, 520, { display: "flex", flexDirection: "column", gap: 16 })}>
          <div><Chip t={t} t0={wf(1, "exam")} bg={C.forest} size={40}>on the exam: you need every one</Chip></div>
          <div style={{ display: "flex", gap: 16 }}>
            <Chip t={t} t0={wf(2, "three")} bg={C.matcha} size={40}>just 3 groups</Chip>
            <Chip t={t} t0={wf(2, "memory")} bg={C.banana} color={C.forest} size={40}>+ 1 memory trick for the hardest part</Chip>
          </div>
        </div>
      </Seg>
      <Seg t={t} a={m} b={BE(0) + 0.1}>
        <KPlate {...DORS} x={0} y={0} w={413} a={m} b={BE(0)} keys={[[m, 1.0, 0.5, 0.5], [s_(4), 1.12, 0.5, 0.35]]} />
        <ViewTag t={t} t0={m + 0.3} x={20} y={20} text="RIGHT FOOT · TOP VIEW" />
        <div style={abs(470, 0, { width: 1330, display: "flex", gap: 14, ...pop(t, m + 0.1) })}>
          {["nursing school", "med school", "A&P class"].map((x, i) => (
            <Chip key={x} t={t} t0={[wf(3, "nursing"), wf(3, "med"), wf(3, "class")][i]} bg={C.card} color={C.forest} size={34}>{x}</Chip>
          ))}
        </div>
        <div style={abs(470, 90, { width: 1330 })}><Chip t={t} t0={s_(4)} bg={C.forest} size={44}>In about 10 minutes:</Chip></div>
        <div style={abs(470, 180, { width: 1330, display: "flex", flexDirection: "column", gap: 12 })}>
          {[
            ["all 7 tarsal bones", wf(4, "seven"), GC.tarsal],
            ["the metatarsals + the phalanges", wf(4, "metatarsals"), GC.meta],
            ["the ankle joint and its ligaments", wf(4, "ankle"), LIGC.atfl],
            ["the 3 arches of the foot", wf(4, "arches"), GC.fore],
          ].map(([txt, tt, col]) => (
            <div key={txt as string} style={{ ...pop(t, tt as number), display: "flex", alignItems: "center", gap: 18, background: C.card, border: `3px solid ${C.line}`, borderRadius: 24, padding: "10px 22px", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest, transformOrigin: "0% 50%", width: 900 }}>
              <div style={{ width: 46, height: 46, borderRadius: 23, background: col as string, border: `3px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>✓</div>
              {txt}
            </div>
          ))}
        </div>
        <div style={abs(470, 620)}>
          <Chip t={t} t0={wf(5, "five")} bg={C.banana} color={C.forest} size={42}>+ 5-question quiz at the end</Chip>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 1. THE BIG PICTURE ================= */
export const SBig: React.FC = () => {
  const t = useT();
  const a = ST(1), b = BE(1);
  const m1 = s_(12) - 0.2, m2 = s_(16) - 0.2;
  const gT = wf(8, "tarsals"), gM = wf(9, "metatarsals"), gP = wf(10, "phalanges");
  const hind = { talus: wf(13, "talus"), calc: wf(13, "calcaneus") };
  const midT = { nav: wf(14, "navicular"), cub: wf(14, "cuboid"), cun: wf(14, "cuneiforms") };
  const fore = wf(15, "metatarsals");
  const REG: Record<string, string> = { talus: GC.hind, calc: GC.hind, nav: GC.mid, cub: GC.mid, cun1: GC.mid, cun2: GC.mid, cun3: GC.mid };
  const foreIds = ["mt1", "mt2", "mt3", "mt4", "mt5", "mt5tub", "ph1p", "ph1d", "ph2p", "ph2m", "ph2d", "ph3p", "ph3m", "ph3d", "ph4p", "ph4m", "ph4d", "ph5p", "ph5m", "ph5d"];
  const litReg: Record<string, number> = { ...hind, nav: midT.nav, cub: midT.cub, cun1: midT.cun, cun2: midT.cun, cun3: midT.cun };
  foreIds.forEach((id) => (litReg[id] = fore));
  const colReg: Record<string, string> = { ...REG };
  foreIds.forEach((id) => (colReg[id] = GC.fore));
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={m1}>
        <Panel x={0} y={0} w={620} h={740} t={t} t0={a}>
          <div style={abs(80, 40)}><FootTop t={t} w={520} groups={{ tarsal: ramp(t, gT, gT + 0.4), meta: ramp(t, gM, gM + 0.4), phal: ramp(t, gP, gP + 0.4) }} /></div>
          <ViewTag t={t} t0={a + 0.2} x={24} y={702} text="RIGHT FOOT · FROM ABOVE" />
        </Panel>
        <FTag t={t} t0={gT} x={80} y={40} id="talus" text="tarsals · 7" dx={260} dy={60} col={GC.tarsal} />
        <FTag t={t} t0={gM} x={80} y={40} id="mt4" text="metatarsals · 5" dx={250} dy={20} col={GC.meta} />
        <FTag t={t} t0={gP} x={80} y={40} id="ph4p" text="phalanges · 14" dx={240} dy={-60} col={GC.phal} />
        <div style={abs(700, 0, { width: 1100 })}>
          <div style={pop(t, a)}><Big size={70}>3 groups of bones</Big></div>
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            <Row t={t} t0={gT} n="7" col={GC.tarsal} title="Tarsals" sub="the ankle and the heel · at the back" w={1000} size={48} />
            <Row t={t} t0={gM} n="5" col={GC.meta} title="Metatarsals" sub="5 long bones · the middle of the foot" w={1000} size={48} />
            <Row t={t} t0={gP} n="14" col={GC.phal} title="Phalanges" sub="the bones of the toes" w={1000} size={48} />
          </div>
          <div style={{ marginTop: 40 }}>
            <Eq t={t} size={104} parts={[["7", wf(11, "seven"), C.bananaDark], ["+", wf(11, "plus")], ["5", wf(11, "five"), C.matcha], ["+", wf(11, "plus", 1)], ["14", wf(11, "fourteen"), C.red], ["=", wf(11, "makes")], ["26", wf(11, "twenty"), C.forest]]} />
          </div>
        </div>
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <Panel x={0} y={0} w={620} h={740} t={t} t0={m1}>
          <div style={abs(80, 40)}><FootTop t={t} w={520} lit={litReg} col={colReg} dim={0.55} /></div>
          <ViewTag t={t} t0={m1 + 0.2} x={24} y={702} text="3 REGIONS" />
        </Panel>
        <FTag t={t} t0={hind.talus} x={80} y={40} id="calc" text="hindfoot" dx={230} dy={-40} col={GC.hind} />
        <FTag t={t} t0={midT.nav} x={80} y={40} id="cub" text="midfoot" dx={190} dy={0} col={GC.mid} />
        <FTag t={t} t0={fore} x={80} y={40} id="mt5" text="forefoot" dx={190} dy={-60} col={GC.fore} />
        <KPlate {...DORS} x={1440} y={0} w={360} a={m1 + 0.2} b={m2} keys={[[m1, 1.0, 0.5, 0.5], [s_(13), 1.25, 0.5, 0.2], [s_(14), 1.25, 0.5, 0.42], [s_(15), 1.15, 0.5, 0.7]]} />
        <div style={abs(680, 10, { width: 720 })}>
          <div style={pop(t, m1)}><Big size={60}>Clinicians: 3 regions</Big></div>
          <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 16 }}>
            <Row t={t} t0={s_(13)} n="H" col={GC.hind} title="Hindfoot" sub="talus · calcaneus" w={720} size={46} />
            <Row t={t} t0={s_(14)} n="M" col={GC.mid} title="Midfoot" sub="navicular · cuboid · 3 cuneiforms" w={720} size={46} />
            <Row t={t} t0={s_(15)} n="F" col={GC.fore} title="Forefoot" sub="metatarsals · phalanges" w={720} size={46} />
          </div>
        </div>
      </Seg>
      <Seg t={t} a={m2} b={b + 0.1}>
        <Panel x={0} y={0} w={620} h={740} t={t} t0={m2}>
          <div style={abs(80, 40)}><FootTop t={t} w={520} lit={{ mt1: wf(16, "big"), ph1p: wf(16, "big"), ph1d: wf(16, "big"), mt5: wf(16, "little"), ph5p: wf(16, "little"), ph5m: wf(16, "little"), ph5d: wf(16, "little") }} col={{ mt1: "#3E7FA6", ph1p: "#3E7FA6", ph1d: "#3E7FA6" }} dim={0.6} /></div>
        </Panel>
        <Arrow t={t} t0={wf(16, "medial")} x={20} y={320} dir="l" label="MEDIAL" col="#3E7FA6" />
        <Arrow t={t} t0={wf(16, "lateral")} x={470} y={320} dir="r" label="LATERAL" />
        <div style={abs(700, 20, { width: 1100 })}>
          <div style={pop(t, m2)}><Big size={66}>Before we start: sides</Big></div>
          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 24 }}>
            <Row t={t} t0={wf(16, "big")} n="M" col="#BFD9E6" title="big toe side = MEDIAL" sub="toward the midline of the body" w={1000} size={52} />
            <Row t={t} t0={wf(16, "little")} n="L" col={C.redLight} title="little toe side = LATERAL" sub="away from the midline" w={1000} size={52} />
          </div>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 2. THE HINDFOOT ================= */
export const SHind: React.FC = () => {
  const t = useT();
  const a = ST(2), b = BE(2);
  const m1 = s_(21) - 0.2, m2 = s_(24) - 0.2, m3 = s_(28) - 0.2;
  const ta = wf(18, "talus");
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={m1}>
        <KPlate {...TALP} x={0} y={0} w={620} a={a} b={m1} keys={[[a, 1.0, 0.5, 0.5], [s_(19), 1.12, 0.5, 0.55]]}
          labels={[{ x: 0.5, y: 0.6, text: "almost square", t: wf(19, "square"), side: "r", hot: true }]} />
        <ViewTag t={t} t0={a + 0.3} x={20} y={20} text="TALUS · FROM ABOVE" />
        <Panel x={650} y={0} w={560} h={740} t={t} t0={a + 0.2}>
          <div style={abs(-60, 250)}><AnkleSide t={t} w={600} lit={{ talus: ta, tibia: wf(19, "tibia"), fibula: wf(19, "fibula") }} dim={0.45} /></div>
          <ViewTag t={t} t0={a + 0.4} x={20} y={20} text="SIDE VIEW" />
          {t > s_(20) && <div style={abs(230, 70)}><Arrow t={t} t0={s_(20)} x={0} y={0} dir="d" label="body weight" size={120} /></div>}
        </Panel>
        <Facts x={1240} y={10} w={560}
          items={[
            { t: s_(17), text: "the hindfoot = the 2 BIGGEST tarsal bones", bg: C.forest },
            { t: ta, text: "TALUS: on top · the highest bone of the foot", bg: C.matcha },
            { t: wf(19, "fits"), text: "fits up between the TIBIA and the FIBULA → the ankle joint" },
            { t: s_(20), text: "carries the weight of the whole body into the foot", bg: C.red },
          ]} />
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <KPlate {...DMID} x={0} y={0} w={720} a={m1} b={m2} keys={[[m1, 1.25, 0.5, 0.45], [s_(22), 1.3, 0.55, 0.55], [s_(23), 1.2, 0.5, 0.45]]}
          labels={[
            { x: 0.47, y: 0.366, text: "body", t: wf(21, "body"), side: "l", hot: true },
            { x: 0.52, y: 0.527, text: "neck", t: wf(21, "neck"), side: "l", hot: true },
            { x: 0.56, y: 0.604, text: "head", t: wf(21, "head"), side: "r", hot: true },
            { x: 0.6, y: 0.67, text: "navicular", t: wf(22, "navicular"), side: "r" },
          ]} />
        <ViewTag t={t} t0={m1 + 0.3} x={20} y={20} text="TALUS · TOP VIEW" />
        <Panel x={750} y={0} w={480} h={740} t={t} t0={m1 + 0.2}>
          <div style={abs(20, 90)}><FootTop t={t} w={440} lit={{ talus: m1, nav: wf(22, "navicular") }} col={{ talus: GC.hind, nav: GC.mid }} dim={0.5} /></div>
        </Panel>
        <Tag t={t} t0={wf(22, "navicular")} x={770} y={90} w={440} vbw={800} pt={FT.nav} text="navicular" dx={-100} dy={-80} />
        <Stamp t={t} t0={wf(23, "muscles")} text="NO MUSCLES ATTACH" x={640} y={610} />
        <Facts x={1260} y={10} w={540}
          items={[
            { t: s_(21), text: "3 parts: BODY at the back, a narrow NECK, a rounded HEAD in front", bg: C.forest },
            { t: s_(22), text: "the head points forward and meets the NAVICULAR" },
            { t: wf(23, "exam"), text: "exam favorite:", bg: C.matcha },
            { t: wf(23, "muscles"), text: "NO muscles attach to the talus", bg: C.red, big: "0" },
          ]} />
      </Seg>
      <Seg t={t} a={m2} b={m3}>
        <KPlate {...LATS} x={0} y={0} w={1000} a={m2} b={m3} keys={[[m2, 1.0, 0.5, 0.5], [s_(25), 1.5, 0.82, 0.6], [s_(27), 1.8, 0.92, 0.7]]}
          labels={[
            { x: 0.8, y: 0.56, text: "calcaneus = heel bone", t: wf(24, "calcaneus"), side: "l", hot: true, t1: s_(27) - 0.3 },
            { x: 0.97, y: 0.78, text: "calcaneal tuberosity", t: wf(27, "tuberosity"), side: "l", hot: true },
          ]} />
        <ViewTag t={t} t0={m2 + 0.3} x={20} y={20} text="RIGHT FOOT · LATERAL SIDE" />
        <Panel x={0} y={380} w={1000} h={360} t={t} t0={s_(26) - 0.2}>
          <div style={abs(60, -60)}><AnkleSide t={t} w={700} ang={-6 * Math.sin(Math.max(0, t - s_(26)) * 2.4) * ramp(t, s_(26), s_(26) + 0.4)} lit={{ calc: s_(26) }} dim={0.6} /></div>
        </Panel>
        {t > wf(27, "achilles") - 0.3 && <Tag t={t} t0={wf(27, "achilles")} x={60} y={320} w={700} vbw={1000} pt={AS.achilles} dx={170} dy={-10} text="Achilles tendon" hot />}
        <Facts x={1060} y={10} w={740}
          items={[
            { t: s_(24), text: "below the talus: the CALCANEUS = the heel bone", bg: C.forest },
            { t: s_(25), text: "the LARGEST bone of the foot", bg: C.red, big: "#1" },
            { t: s_(26), text: "sticks out behind the ankle · first bone to hit the ground when you walk" },
            { t: wf(27, "tuberosity"), text: "calcaneal tuberosity → the ACHILLES TENDON attaches", bg: C.matcha },
          ]} />
      </Seg>
      <Seg t={t} a={m3} b={b + 0.1}>
        <KPlate {...CORO} x={0} y={0} w={820} a={m3} b={b} keys={[[m3, 1.3, 0.47, 0.45]]}
          labels={[
            { x: 0.46, y: 0.42, text: "talus", t: wf(28, "talus"), side: "r", hot: true },
            { x: 0.46, y: 0.62, text: "calcaneus", t: wf(28, "calcaneus"), side: "r", hot: true },
            { x: 0.56, y: 0.535, text: "subtalar joint", t: wf(28, "subtalar"), side: "r", col: C.banana },
          ]} />
        <ViewTag t={t} t0={m3 + 0.3} x={20} y={20} text="SECTION · SEEN FROM BEHIND" />
        <Facts x={880} y={10} w={920}
          items={[
            { t: s_(28), text: "talus + calcaneus meet at the SUBTALAR JOINT", bg: C.forest },
            { t: wf(28, "back"), text: "we'll come back to it in chapter 6", bg: C.matcha },
          ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 3. THE MIDFOOT ================= */
export const SMid: React.FC = () => {
  const t = useT();
  const a = ST(3), b = BE(3);
  const m1 = s_(33) - 0.2, m2 = s_(36) - 0.2, m3 = s_(39) - 0.2;
  const cM = wf(37, "medial", 1), cI = wf(37, "intermediate"), cL = wf(37, "lateral", 1);
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={m1}>
        <KPlate {...PMID} x={0} y={0} w={720} a={a} b={m1} keys={[[a, 1.0, 0.5, 0.5], [s_(30), 1.3, 0.35, 0.62], [s_(32), 1.45, 0.3, 0.68]]}
          labels={[
            { x: 0.33, y: 0.67, text: "navicular", t: wf(30, "navicular"), side: "r", hot: true },
            { x: 0.2, y: 0.74, text: "navicular tuberosity", t: wf(32, "tuberosity"), side: "r", col: C.banana },
          ]} />
        <ViewTag t={t} t0={a + 0.3} x={20} y={20} text="RIGHT FOOT · SOLE VIEW" />
        <Note t={t} t0={wf(32, "tibialis")} x={20} y={640} old="tubercle of navicular" modern="navicular tuberosity" />
        <Panel x={750} y={0} w={480} h={740} t={t} t0={a + 0.2}>
          <div style={abs(20, 90)}><FootTop t={t} w={440} lit={{ nav: wf(30, "navicular"), talus: { a: wf(30, "talus"), b: wf(30, "navicular") } }} col={{ nav: GC.mid, talus: GC.hind }} dim={0.5} /></div>
          <ViewTag t={t} t0={a + 0.4} x={24} y={20} text="FROM ABOVE" />
        </Panel>
        <Tag t={t} t0={wf(30, "navicular")} x={770} y={90} w={440} vbw={800} pt={FT.nav} text="navicular" dx={-90} dy={-110} hot />
        <Facts x={1260} y={10} w={540}
          items={[
            { t: s_(30), text: "in front of the talus, MEDIAL side: the NAVICULAR", bg: C.forest },
            { t: s_(31), text: "its name means BOAT SHAPED" },
            { t: wf(32, "tuberosity"), text: "navicular tuberosity (underside) → TIBIALIS POSTERIOR tendon", bg: C.matcha },
          ]} />
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <KPlate {...PMID} x={0} y={0} w={720} a={m1} b={m2} keys={[[m1, 1.3, 0.55, 0.62], [s_(35), 1.45, 0.58, 0.7]]}
          labels={[
            { x: 0.53, y: 0.645, text: "cuboid", t: wf(33, "cuboid"), side: "r", hot: true },
            { x: 0.61, y: 0.786, text: "groove: fibularis longus", t: wf(35, "groove"), side: "r", col: C.banana },
          ]} />
        <ViewTag t={t} t0={m1 + 0.3} x={20} y={20} text="RIGHT FOOT · SOLE VIEW" />
        <Note t={t} t0={wf(35, "fibularis") + 0.3} x={20} y={640} old="peronaeus longus" modern="fibularis longus" />
        <Panel x={750} y={0} w={480} h={740} t={t} t0={m1 + 0.2}>
          <div style={abs(20, 90)}><FootTop t={t} w={440} lit={{ cub: wf(33, "cuboid"), calc: { a: wf(33, "calcaneus"), b: wf(33, "cuboid") } }} col={{ cub: GC.mid, calc: GC.hind }} dim={0.5} /></div>
          <ViewTag t={t} t0={m1 + 0.4} x={24} y={20} text="FROM ABOVE" />
        </Panel>
        <Tag t={t} t0={wf(33, "cuboid")} x={770} y={90} w={440} vbw={800} pt={FT.cub} text="cuboid" dx={60} dy={-120} hot />
        <Facts x={1260} y={10} w={540}
          items={[
            { t: s_(33), text: "LATERAL side, in front of the calcaneus: the CUBOID", bg: C.forest },
            { t: s_(34), text: "the MOST LATERAL tarsal bone · roughly a cube" },
            { t: s_(35), text: "a groove underneath for the tendon of FIBULARIS LONGUS", bg: C.matcha },
          ]} />
      </Seg>
      <Seg t={t} a={m2} b={m3}>
        <KPlate {...DMID} x={0} y={0} w={720} a={m2} b={m3} keys={[[m2, 1.3, 0.5, 0.72], [s_(38), 1.4, 0.58, 0.78]]}
          labels={[
            { x: 0.63, y: 0.84, text: "medial", t: cM, side: "r", hot: true },
            { x: 0.5, y: 0.76, text: "intermediate", t: cI, side: "r", col: C.banana },
            { x: 0.39, y: 0.795, text: "lateral", t: cL, side: "l", hot: true },
          ]} />
        <ViewTag t={t} t0={m2 + 0.3} x={20} y={20} text="RIGHT FOOT · TOP VIEW" />
        <Note t={t} t0={cM + 0.4} x={20} y={70} old="first / second / third cuneiform" />
        <div style={abs(20, 136, { ...pop(t, cM + 0.8), transformOrigin: "0% 50%" })}><Chip t={t} t0={cM + 0.8} bg={C.forest} size={26}>today: medial / intermediate / lateral</Chip></div>
        <Panel x={750} y={0} w={480} h={740} t={t} t0={m2 + 0.2}>
          <div style={abs(20, 90)}><FootTop t={t} w={440} lit={{ cun1: Math.min(cM, wf(36, "cuneiforms")), cun2: Math.min(cI, wf(36, "cuneiforms") + 0.2), cun3: Math.min(cL, wf(36, "cuneiforms") + 0.4), nav: { a: wf(36, "navicular"), b: wf(36, "cuneiforms") } }} col={{ cun1: C.red, cun2: C.banana, cun3: GC.meta, nav: GC.mid }} dim={0.5} /></div>
          <ViewTag t={t} t0={m2 + 0.4} x={24} y={20} text="FROM ABOVE" />
        </Panel>
        <Tag t={t} t0={cM} x={770} y={90} w={440} vbw={800} pt={FT.cun1} text="medial" dx={-60} dy={-150} hot />
        <Tag t={t} t0={cI} x={770} y={90} w={440} vbw={800} pt={FT.cun2} text="intermediate" dx={10} dy={-215} col={C.banana} />
        <Tag t={t} t0={cL} x={770} y={90} w={440} vbw={800} pt={FT.cun3} text="lateral" dx={110} dy={-150} hot />
        <Facts x={1260} y={10} w={540}
          items={[
            { t: s_(36), text: "in front of the navicular: 3 wedge shaped CUNEIFORMS", bg: C.forest },
            { t: s_(37), text: "medial → intermediate → lateral" },
            { t: s_(38), text: "MEDIAL cuneiform = the biggest of the three", bg: C.matcha },
            { t: wf(38, "tibialis"), text: "→ the TIBIALIS ANTERIOR tendon attaches", bg: C.red },
          ]} />
      </Seg>
      <Seg t={t} a={m3} b={b + 0.1}>
        <Panel x={0} y={0} w={620} h={740} t={t} t0={m3}>
          <div style={abs(80, 40)}><FootTop t={t} w={520} lit={{ cub: m3 + 0.2, cun1: m3 + 0.2, cun2: m3 + 0.2, cun3: m3 + 0.2, mt1: wf(39, "bases"), mt2: wf(39, "bases"), mt3: wf(39, "bases"), mt4: wf(39, "bases"), mt5: wf(39, "bases"), mt5tub: wf(39, "bases") }} col={{ cub: GC.mid, cun1: GC.mid, cun2: GC.mid, cun3: GC.mid, mt1: GC.meta, mt2: GC.meta, mt3: GC.meta, mt4: GC.meta, mt5: GC.meta, mt5tub: GC.meta }} dim={0.5} joints={{ tmt: wf(39, "meet") }} /></div>
          <ViewTag t={t} t0={m3 + 0.3} x={24} y={702} text="ONE ROW" />
        </Panel>
        <div style={abs(700, 20, { width: 1100 })}>
          <div style={pop(t, m3)}><Big size={64}>cuboid + 3 cuneiforms = one row</Big></div>
          <div style={{ marginTop: 40, display: "flex", gap: 16, flexWrap: "wrap" }}>
            {["medial cuneiform", "intermediate", "lateral", "cuboid"].map((x, i) => <Chip key={x} t={t} t0={m3 + 0.3 + i * 0.25} bg={GC.mid} color={C.forest} size={42}>{x}</Chip>)}
          </div>
          <div style={{ marginTop: 40, fontFamily: FONT, fontWeight: 800, fontSize: 70, color: C.matcha, ...pop(t, wf(39, "meet")) }}>↓ meets the bases of all 5 metatarsals</div>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 4. THE FOREFOOT ================= */
export const SFore: React.FC = () => {
  const t = useT();
  const a = ST(4), b = BE(4);
  const m1 = s_(43) - 0.2, m2 = s_(47) - 0.2, m3 = s_(48) - 0.2;
  const MT = ["mt1", "mt2", "mt3", "mt4", "mt5", "mt5tub"];
  const allMt: Record<string, number> = {};
  MT.forEach((id) => (allMt[id] = wf(41, "five")));
  const toes25 = ["ph2", "ph3", "ph4", "ph5"];
  const pT = wf(49, "proximal"), mT = wf(49, "middle"), dT = wf(49, "distal");
  const litToes: Record<string, number | { a: number; b: number }> = {};
  const colToes: Record<string, string> = {};
  toes25.forEach((r) => {
    litToes[r + "p"] = pT; litToes[r + "m"] = mT; litToes[r + "d"] = dT;
    colToes[r + "p"] = GC.phal; colToes[r + "m"] = C.banana; colToes[r + "d"] = "#9CC3D9";
  });
  const hx = wf(50, "hallux");
  litToes.ph1p = wf(50, "proximal"); litToes.ph1d = wf(50, "distal"); colToes.ph1p = C.red; colToes.ph1d = C.red;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={m1}>
        <Panel x={0} y={0} w={620} h={740} t={t} t0={a}>
          <div style={abs(80, 40)}><FootTop t={t} w={520} lit={{ ...allMt, mt1: { a: allMt.mt1, b: wf(42, "first") }, ph1p: wf(42, "big"), ph1d: wf(42, "big"), ph5p: wf(42, "little"), ph5m: wf(42, "little"), ph5d: wf(42, "little") }} col={{ mt1: GC.meta, mt2: GC.meta, mt3: GC.meta, mt4: GC.meta, mt5: GC.meta, mt5tub: GC.meta, ph1p: "#3E7FA6", ph1d: "#3E7FA6" }} dim={0.55} nums={ramp(t, wf(41, "numbered"), wf(41, "numbered") + 1.6)} /></div>
          <ViewTag t={t} t0={a + 0.3} x={24} y={702} text="5 METATARSALS" />
        </Panel>
        <KPlate {...DFORE} x={650} y={0} w={540} a={a + 0.3} b={m1} keys={[[a, 1.0, 0.5, 0.5], [s_(42), 1.15, 0.5, 0.4]]}
          labels={[
            { x: 0.62, y: 0.33, text: "1st", t: wf(42, "first"), side: "r", hot: true },
            { x: 0.2, y: 0.3, text: "5th", t: wf(42, "fifth"), side: "r", hot: true },
          ]} />
        <Facts x={1220} y={10} w={580}
          items={[
            { t: s_(41), text: "5 metatarsals, numbered 1 → 5", bg: C.forest, big: "1–5" },
            { t: wf(41, "medial"), text: "from MEDIAL (big toe) to LATERAL (little toe)" },
            { t: s_(42), text: "1st → the big toe · 5th → the little toe", bg: C.matcha },
          ]} />
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <KPlate {...DFORE} x={0} y={0} w={700} a={m1} b={m2} keys={[[m1, 1.25, 0.6, 0.36], [s_(44), 1.2, 0.45, 0.25], [s_(45), 1.2, 0.5, 0.55], [s_(46), 1.15, 0.45, 0.3]]}
          labels={[
            { x: 0.6, y: 0.17, text: "base", t: wf(43, "base"), side: "l", hot: true, t1: s_(44) },
            { x: 0.645, y: 0.34, text: "shaft", t: wf(43, "shaft"), side: "l", hot: true, t1: s_(44) },
            { x: 0.64, y: 0.56, text: "head", t: wf(43, "head"), side: "l", hot: true, t1: s_(44) },
          ]} />
        <ViewTag t={t} t0={m1 + 0.3} x={20} y={20} text="RIGHT FOOT · TOP VIEW" />
        <Note t={t} t0={wf(43, "shaft") + 0.5} x={20} y={640} old="body" modern="shaft" />
        <Panel x={730} y={0} w={500} h={740} t={t} t0={m1 + 0.2}>
          <div style={abs(30, 90)}><FootTop t={t} w={440} joints={{ tmt: wf(44, "tarsometatarsal"), mtp: wf(45, "metatarsophalangeal"), imt: wf(46, "intermetatarsal") }} /></div>
          <ViewTag t={t} t0={m1 + 0.4} x={24} y={20} text="THE JOINTS" />
        </Panel>
        <Facts x={1260} y={10} w={540}
          items={[
            { t: s_(43), text: "each metatarsal: BASE · SHAFT · HEAD", bg: C.forest },
            { t: s_(44), text: "bases ↔ tarsals: TARSOMETATARSAL joints", bg: C.red },
            { t: s_(45), text: "heads ↔ toes: METATARSOPHALANGEAL joints", bg: C.matcha },
            { t: s_(46), text: "bases ↔ each other: INTERMETATARSAL joints" },
          ]} />
      </Seg>
      <Seg t={t} a={m2} b={m3}>
        <KPlate {...PMID} x={0} y={0} w={720} a={m2} b={m3} keys={[[m2, 1.3, 0.68, 0.7]]}
          labels={[{ x: 0.75, y: 0.75, text: "base of 5th metatarsal", t: wf(47, "base"), side: "l", hot: true }]} />
        <ViewTag t={t} t0={m2 + 0.3} x={20} y={20} text="RIGHT FOOT · SOLE VIEW" />
        <Panel x={750} y={0} w={480} h={740} t={t} t0={m2 + 0.2}>
          <div style={abs(20, 90)}><FootTop t={t} w={440} lit={{ mt5tub: wf(47, "fifth"), mt5: wf(47, "fifth") }} dim={0.5} /></div>
        </Panel>
        <Tag t={t} t0={wf(47, "outer")} x={770} y={90} w={440} vbw={800} pt={FT.mt5tub} text="sticks out here" dx={-40} dy={180} hot />
        <Facts x={1260} y={10} w={540}
          items={[
            { t: s_(47), text: "BASE of the 5th metatarsal: sticks out on the OUTER edge of the foot", bg: C.forest },
            { t: wf(47, "fibularis"), text: "→ the FIBULARIS BREVIS tendon attaches here", bg: C.red },
          ]} />
      </Seg>
      <Seg t={t} a={m3} b={b + 0.1}>
        <KPlate {...DFORE} x={0} y={0} w={700} a={m3} b={b} keys={[[m3, 1.3, 0.42, 0.75], [hx, 1.3, 0.6, 0.78]]}
          labels={[
            { x: 0.43, y: 0.634, text: "proximal", t: pT, side: "l", hot: true, t1: hx - 0.2 },
            { x: 0.425, y: 0.786, text: "middle", t: mT, side: "l", col: C.banana, t1: hx - 0.2 },
            { x: 0.43, y: 0.902, text: "distal", t: dT, side: "l", hot: true, t1: hx - 0.2 },
            { x: 0.6, y: 0.73, text: "proximal", t: wf(50, "proximal"), side: "r", hot: true },
            { x: 0.6, y: 0.91, text: "distal", t: wf(50, "distal"), side: "r", hot: true },
          ]} />
        <ViewTag t={t} t0={m3 + 0.3} x={20} y={20} text="TOES · TOP VIEW" />
        <Panel x={730} y={0} w={500} h={740} t={t} t0={m3 + 0.2}>
          <div style={abs(30, 90)}><FootTop t={t} w={440} lit={litToes} col={colToes} dim={0.55} /></div>
        </Panel>
        <Tag t={t} t0={hx} x={760} y={90} w={440} vbw={800} pt={FT.ph1p} text="hallux: only 2" dx={-20} dy={110} hot />
        <div style={abs(1260, 0, { width: 540 })}>
          <Facts x={0} y={10} w={540}
            items={[
              { t: s_(49), text: "toes 2–5: 3 phalanges each · proximal · middle · distal", bg: C.forest },
              { t: s_(50), text: "big toe = HALLUX: only 2 · proximal + distal", bg: C.red },
            ]} />
          <div style={abs(0, 400)}>
            <Eq t={t} size={70} parts={[["4", wf(51, "four"), C.forest], ["×", wf(51, "times")], ["3", wf(51, "three")], ["+", wf(51, "plus")], ["2", wf(51, "two"), C.red], ["=", wf(51, "makes")], ["14", wf(51, "fourteen"), C.matcha]]} />
            <div style={{ marginTop: 18 }}><Chip t={t} t0={wf(51, "fingers")} bg={C.banana} color={C.forest} size={36}>exactly like the fingers</Chip></div>
          </div>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 5. THE ANKLE JOINT ================= */
export const SAnkle: React.FC = () => {
  const t = useT();
  const a = ST(5), b = BE(5);
  const m1 = s_(56) - 0.2, m2 = s_(59) - 0.2, m3 = s_(60) - 0.2, m4 = s_(62) - 0.2;
  const ti = wf(53, "tibia"), fi = wf(53, "fibula"), ta = wf(53, "talus");
  const mm = wf(54, "medial"), lm = wf(55, "lateral");
  const dT = wf(58, "dorsiflexion"), pT = wf(58, "plantarflexion");
  const ang = kv(t, [[m2 - 2, 0], [dT, 0], [dT + 0.7, -16], [wf(58, "pointing") - 0.6, -16], [pT + 0.2, 0], [pT + 0.9, 26], [e_(58), 26], [e_(58) + 0.8, 0]]);
  const at = wf(63, "anterior"), cf = wf(63, "calcaneofibular"), pt = wf(63, "posterior");
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={m1}>
        <KPlate {...CORO} x={0} y={0} w={760} a={a} b={m1} keys={[[a, 1.1, 0.48, 0.38], [s_(54), 1.4, 0.38, 0.38], [s_(55), 1.3, 0.62, 0.45]]}
          labels={[
            { x: 0.4, y: 0.2, text: "tibia", t: ti, side: "r", hot: true, t1: s_(54) - 0.2 },
            { x: 0.6, y: 0.27, text: "fibula", t: fi, side: "r", col: "#E9A23B", t1: s_(54) - 0.2 },
            { x: 0.47, y: 0.44, text: "talus", t: ta, side: "r", col: GC.hind },
            { x: 0.335, y: 0.36, text: "medial malleolus", t: mm, side: "r", hot: true },
          ]}
          ov={(w, h) => (
            <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
              <ellipse cx={0.645 * w} cy={0.45 * h} rx={0.05 * w} ry={0.07 * h} fill="none" stroke={C.red} strokeWidth={8} opacity={ramp(t, lm, lm + 0.3)} />
              <ellipse cx={0.335 * w} cy={0.37 * h} rx={0.045 * w} ry={0.06 * h} fill="none" stroke={C.red} strokeWidth={8} opacity={ramp(t, mm, mm + 0.3)} />
            </svg>
          )} />
        <ViewTag t={t} t0={a + 0.3} x={20} y={20} text="RIGHT ANKLE · SECTION FROM BEHIND" />
        <Panel x={800} y={0} w={460} h={740} t={t} t0={a + 0.2}>
          <div style={abs(10, 30)}><AnkleBack t={t} w={440} lit={{ tibia: ti, fibula: fi, talus: ta }} ligs={0} /></div>
        </Panel>
        {t > mm - 0.5 && <div style={abs(800, 0)}><Tag t={t} t0={mm} x={10} y={30} w={440} vbw={800} pt={AB.medmal} dx={0} dy={160} text="medial malleolus" hot size={24} /></div>}
        {t > lm - 0.5 && <div style={abs(800, 0)}><Tag t={t} t0={lm} x={10} y={30} w={440} vbw={800} pt={AB.latmal} dx={-20} dy={200} text="lateral malleolus" hot size={24} /></div>}
        <Facts x={1300} y={10} w={500}
          items={[
            { t: s_(52), text: "ankle joint = TALOCRURAL joint", bg: C.forest },
            { t: s_(53), text: "3 bones: tibia · fibula · talus" },
            { t: s_(54), text: "inner bump = MEDIAL malleolus → part of the TIBIA", bg: C.matcha },
            { t: s_(55), text: "outer bump = LATERAL malleolus → lower end of the FIBULA", bg: C.red },
          ]} />
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <Panel x={0} y={0} w={540} h={740} t={t} t0={m1}>
          <div style={abs(40, 60)}><AnkleBack t={t} w={460} lit={{ talus: wf(57, "talus") }} mortise={ramp(t, wf(56, "mortise") - 0.6, wf(56, "mortise") + 0.6)} ligs={0} /></div>
          <ViewTag t={t} t0={m1 + 0.2} x={24} y={20} text="THE MORTISE" />
        </Panel>
        <KPlate {...CORO} x={580} y={0} w={700} a={m1 + 0.2} b={s_(58) - 0.2} keys={[[m1, 1.15, 0.5, 0.38]]}
          ov={(w, h) => {
            const k = ramp(t, wf(56, "mortise") - 0.4, wf(56, "mortise") + 0.8);
            return (
              <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
                <path d={`M${0.33 * w} ${0.42 * h} L ${0.37 * w} ${0.32 * h} Q ${0.47 * w} ${0.28 * h} ${0.58 * w} ${0.31 * h} L ${0.66 * w} ${0.5 * h}`} fill="none" stroke={C.red} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" pathLength={100} strokeDasharray="100 100" strokeDashoffset={100 * (1 - k)} />
              </svg>
            );
          }}
          labels={[{ x: 0.47, y: 0.42, text: "talus", t: wf(57, "talus"), side: "r", col: GC.hind }]} />
        <Panel x={580} y={0} w={700} h={740} t={t} t0={s_(58) - 0.2}>
          <div style={abs(-110, 120)}><AnkleSide t={t} w={900} ang={ang} ligs={0} /></div>
          <ViewTag t={t} t0={s_(58)} x={24} y={20} text="A HINGE JOINT" />
          <div style={abs(40, 640)}><Chip t={t} t0={dT} bg={"#3E7FA6"} size={32}>dorsiflexion: toes UP</Chip></div>
          <div style={abs(380, 640)}><Chip t={t} t0={pT} bg={C.red} size={32}>plantarflexion: DOWN</Chip></div>
        </Panel>
        <Facts x={1320} y={10} w={480}
          items={[
            { t: s_(56), text: "2 malleoli + the end of the tibia = a deep socket: the ANKLE MORTISE", bg: C.forest },
            { t: s_(57), text: "the top of the talus sits inside it" },
            { t: s_(58), text: "a SYNOVIAL HINGE joint", bg: C.matcha },
          ]} />
      </Seg>
      <Seg t={t} a={m2} b={m3}>
        <KPlate {...TALP} x={0} y={0} w={700} a={m2} b={m3} keys={[[m2, 1.05, 0.5, 0.55]]}
          ov={(w, h) => (
            <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0 }}>
              <line x1={0.28 * w} y1={0.42 * h} x2={0.77 * w} y2={0.42 * h} stroke={C.red} strokeWidth={10} strokeLinecap="round" opacity={ramp(t, wf(59, "wider"), wf(59, "wider") + 0.4)} />
              <line x1={0.36 * w} y1={0.8 * h} x2={0.6 * w} y2={0.8 * h} stroke="#3E7FA6" strokeWidth={10} strokeLinecap="round" opacity={ramp(t, wf(59, "behind"), wf(59, "behind") + 0.4)} />
            </svg>
          )}
          labels={[
            { x: 0.78, y: 0.42, text: "wider", t: wf(59, "wider"), side: "r", hot: true },
            { x: 0.61, y: 0.8, text: "narrower", t: wf(59, "behind"), side: "r", col: "#BFD9E6" },
          ]} />
        <ViewTag t={t} t0={m2 + 0.3} x={20} y={20} text="TALUS · FROM ABOVE (front = up)" />
        <Panel x={740} y={0} w={560} h={740} t={t} t0={m2 + 0.2}>
          <div style={abs(-130, 140)}><AnkleSide t={t} w={760} ang={kv(t, [[m2, 0], [wf(59, "stable"), 0], [wf(59, "stable") + 0.8, -16]])} ligs={0} lit={{ talus: wf(59, "talus") }} dim={0.8} /></div>
        </Panel>
        <Facts x={1340} y={10} w={460}
          items={[
            { t: s_(59), text: "the talus is WIDER in front than behind", bg: C.forest },
            { t: wf(59, "stable"), text: "so the ankle is MOST STABLE in dorsiflexion", bg: C.red },
          ]} />
      </Seg>
      <Seg t={t} a={m3} b={m4}>
        <KPlate {...MLIG} x={0} y={0} w={900} a={m3} b={m4} keys={[[m3, 1.0, 0.5, 0.5], [wf(60, "deltoid"), 1.35, 0.6, 0.5]]}
          labels={[{ x: 0.57, y: 0.39, text: "medial malleolus", t: s_(61), side: "l", col: C.banana }, { x: 0.61, y: 0.5, text: "deltoid ligament", t: wf(60, "deltoid"), side: "r", hot: true }]} />
        <ViewTag t={t} t0={m3 + 0.3} x={20} y={20} text="RIGHT FOOT · MEDIAL SIDE" />
        <Panel x={940} y={0} w={420} h={740} t={t} t0={m3 + 0.2}>
          <div style={abs(10, 60)}><AnkleBack t={t} w={400} lit={{ delt: wf(60, "deltoid"), talus: wf(61, "talus"), calc: wf(61, "calcaneus") }} dim={0.55} /></div>
        </Panel>
        <Facts x={1400} y={10} w={400}
          items={[
            { t: s_(60), text: "MEDIAL side: 1 strong, fan shaped ligament", bg: C.forest },
            { t: wf(60, "deltoid"), text: "the DELTOID ligament", bg: "#3E7FA6", big: "Δ" },
            { t: s_(61), text: "4 ligaments fused · from the medial malleolus → navicular, talus, calcaneus" },
          ]} />
      </Seg>
      <Seg t={t} a={m4} b={b + 0.1}>
        <KPlate {...LLIG} x={0} y={0} w={900} a={m4} b={b} keys={[[m4, 1.0, 0.5, 0.5], [at, 1.35, 0.38, 0.58], [s_(64), 1.5, 0.42, 0.56]]}
          labels={[
            { x: 0.43, y: 0.545, text: "ATFL", t: at, side: "r", col: LIGC.atfl },
            { x: 0.335, y: 0.66, text: "CFL", t: cf, side: "l", col: LIGC.cfl },
            { x: 0.275, y: 0.515, text: "PTFL", t: pt, side: "l", col: "#C9B8E6" },
          ]} />
        <ViewTag t={t} t0={m4 + 0.3} x={20} y={20} text="RIGHT FOOT · LATERAL SIDE" />
        <Panel x={940} y={0} w={480} h={740} t={t} t0={m4 + 0.2}>
          <div style={abs(-170, 170)}><AnkleSide t={t} w={760} lit={{ atfl: at, cfl: cf, ptfl: pt }} /></div>
          <ViewTag t={t} t0={m4 + 0.4} x={24} y={20} text="3 SEPARATE LIGAMENTS" />
        </Panel>
        <Stamp t={t} t0={wf(64, "commonly")} text="MOST OFTEN INJURED" x={360} y={620} />
        <Facts x={1460} y={10} w={340}
          items={[
            { t: s_(62), text: "LATERAL side: 3 separate ligaments", bg: C.forest },
            { t: at, text: "ATFL · anterior talofibular", bg: LIGC.atfl },
            { t: cf, text: "CFL · calcaneofibular", bg: "#B87A1E" },
            { t: pt, text: "PTFL · posterior talofibular", bg: LIGC.ptfl },
            { t: wf(64, "weakest"), text: "ATFL = the WEAKEST → most often injured in an ankle sprain", bg: C.red },
          ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 6. JOINTS AND ARCHES ================= */
const ArchOv: React.FC<{ t: number; w: number; h: number; p: [number, number, number, number, number, number]; t0: number; col?: string }> = ({ t, w, h, p, t0, col = C.red }) => {
  const k = ramp(t, t0, t0 + 1.0);
  const d = `M${p[0] * w} ${p[1] * h} Q ${p[2] * w} ${p[3] * h} ${p[4] * w} ${p[5] * h}`;
  return (
    <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <path d={d} fill="none" stroke={C.paper} strokeWidth={20} strokeLinecap="round" pathLength={100} strokeDasharray="100 100" strokeDashoffset={100 * (1 - k)} opacity={0.9} />
      <path d={d} fill="none" stroke={col} strokeWidth={11} strokeLinecap="round" pathLength={100} strokeDasharray="100 100" strokeDashoffset={100 * (1 - k)} />
    </svg>
  );
};
export const SArches: React.FC = () => {
  const t = useT();
  const a = ST(6), b = BE(6);
  const m1 = s_(69) - 0.2, m2 = s_(72) - 0.2, m3 = s_(74) - 0.2, m4 = s_(75) - 0.2;
  const inv = wf(67, "inversion"), ev = wf(67, "eversion");
  const tilt = kv(t, [[a, 0], [wf(66, "side"), 0], [wf(66, "side") + 0.5, 9], [wf(66, "side") + 1.1, -7], [inv - 0.2, 0], [inv + 0.6, 14], [ev - 0.3, 14], [ev + 0.6, -10], [e_(67) + 0.5, -10], [s_(68) + 0.4, 0], [wf(68, "tilt"), 0], [wf(68, "tilt") + 0.5, 8], [wf(68, "tilt") + 1.1, -6], [e_(68), 0]]);
  const nod = kv(t, [[a, 0], [wf(66, "up"), 0], [wf(66, "up") + 0.4, -14], [wf(66, "down") + 0.3, 20], [e_(66) - 1.6, 0], [wf(68, "up"), 0], [wf(68, "up") + 0.4, -12], [wf(68, "down") + 0.3, 18], [wf(68, "subtalar"), 0]]);
  const med = wf(70, "medial"), lat = wf(72, "lateral");
  const step = (s_(76) + 0.2);
  const sq = t > step ? Math.max(0, Math.sin((t - step) * 3.2)) * ramp(t, step, step + 0.3) : 0;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={m1}>
        <Panel x={0} y={0} w={560} h={740} t={t} t0={a}>
          <div style={abs(50, 70)}><AnkleBack t={t} w={460} tilt={tilt} lit={{ subtalar: s_(65), talus: wf(65, "talus"), calc: wf(65, "calcaneus") }} dim={0.8} /></div>
          <ViewTag t={t} t0={a + 0.2} x={24} y={20} text="SUBTALAR · SIDE TO SIDE" />
          <div style={abs(30, 660, { display: "flex", gap: 14 })}>
            <Chip t={t} t0={inv} bg={C.red} size={30}>inversion: sole IN</Chip>
            <Chip t={t} t0={ev} bg={"#3E7FA6"} size={30}>eversion: sole OUT</Chip>
          </div>
        </Panel>
        <Panel x={600} y={0} w={640} h={740} t={t} t0={s_(66)}>
          <div style={abs(-120, 140)}><AnkleSide t={t} w={860} ang={nod} ligs={0} /></div>
          <ViewTag t={t} t0={s_(66) + 0.2} x={24} y={20} text="ANKLE · UP AND DOWN" />
        </Panel>
        <Facts x={1280} y={10} w={520}
          items={[
            { t: s_(65), text: "talus sits on the calcaneus: the SUBTALAR joint", bg: C.forest },
            { t: s_(66), text: "ankle = UP + DOWN · subtalar = SIDE TO SIDE" },
            { t: inv, text: "INVERSION: sole turns IN", bg: C.red },
            { t: ev, text: "EVERSION: sole turns OUT", bg: "#3E7FA6" },
            { t: s_(68), text: "uneven ground: the ankle does up/down, the subtalar joint does the tilt", bg: C.matcha },
          ]} />
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <KPlate {...MEDS} x={0} y={40} w={1150} a={m1} b={m2} keys={[[m1, 1.0, 0.5, 0.5]]}
          ov={(w, h) => <ArchOv t={t} w={w} h={h} t0={med} p={[0.1, 0.95, 0.4, 0.3, 0.73, 0.98]} />}
          labels={[
            { x: 0.2, y: 0.62, text: "calcaneus", t: wf(71, "calcaneus"), side: "r", col: GC.hind },
            { x: 0.3, y: 0.24, text: "talus", t: wf(71, "talus"), side: "r", col: GC.hind },
            { x: 0.42, y: 0.36, text: "navicular", t: wf(71, "navicular"), side: "r", col: GC.mid },
            { x: 0.5, y: 0.73, text: "cuneiforms", t: wf(71, "cuneiforms"), side: "r", col: GC.mid },
            { x: 0.66, y: 0.44, text: "1st–3rd metatarsals", t: wf(71, "metatarsals"), side: "r", col: GC.meta },
          ]} />
        <ViewTag t={t} t0={m1 + 0.3} x={20} y={60} text="RIGHT FOOT · MEDIAL SIDE" />
        <Note t={t} t0={wf(71, "cuneiforms") + 0.5} x={0} y={580} old="first cuneiform" modern="medial cuneiform" />
        <div style={abs(0, 500, { display: "flex", gap: 14 })}>
          <Chip t={t} t0={s_(69)} bg={C.forest} size={36}>3 arches</Chip>
          <Chip t={t} t0={med} bg={C.red} size={36}>1 · medial longitudinal = the HIGHEST</Chip>
        </div>
        <Facts x={1200} y={10} w={600}
          items={[
            { t: s_(69), text: "the foot is not flat: its bones form 3 ARCHES", bg: C.forest, big: "3" },
            { t: med, text: "MEDIAL LONGITUDINAL arch: the inner edge · the highest", bg: C.red },
            { t: s_(71), text: "calcaneus · talus · navicular · 3 cuneiforms · metatarsals 1–3" },
          ]} />
      </Seg>
      <Seg t={t} a={m2} b={m3}>
        <KPlate {...LATS} x={0} y={40} w={1150} a={m2} b={m3} keys={[[m2, 1.0, 0.5, 0.5]]}
          ov={(w, h) => <ArchOv t={t} w={w} h={h} t0={lat} col={C.bananaDark} p={[0.93, 0.97, 0.65, 0.62, 0.36, 0.96]} />}
          labels={[
            { x: 0.82, y: 0.6, text: "calcaneus", t: wf(73, "calcaneus"), side: "l", col: GC.hind },
            { x: 0.6, y: 0.57, text: "cuboid", t: wf(73, "cuboid"), side: "l", col: GC.mid },
            { x: 0.38, y: 0.7, text: "4th + 5th metatarsals", t: wf(73, "fourth"), side: "l", col: GC.meta },
          ]} />
        <ViewTag t={t} t0={m2 + 0.3} x={20} y={60} text="RIGHT FOOT · LATERAL SIDE" />
        <div style={abs(0, 500, { display: "flex", gap: 14 })}>
          <Chip t={t} t0={lat} bg={C.banana} color={C.forest} size={36}>2 · lateral longitudinal = much FLATTER</Chip>
          <Chip t={t} t0={wf(72, "touches")} bg={C.forest} size={36}>touches the ground</Chip>
        </div>
        <Facts x={1200} y={10} w={600}
          items={[
            { t: lat, text: "LATERAL LONGITUDINAL arch: the outer edge", bg: C.forest },
            { t: wf(72, "flatter"), text: "much FLATTER · touches the ground when you stand", bg: C.matcha },
            { t: s_(73), text: "calcaneus · cuboid · metatarsals 4 + 5" },
          ]} />
      </Seg>
      <Seg t={t} a={m3} b={m4}>
        <Panel x={0} y={0} w={560} h={740} t={t} t0={m3}>
          <div style={abs(50, 40)}><FootTop t={t} w={520} lit={{ cun1: wf(74, "cuneiforms"), cun2: wf(74, "cuneiforms"), cun3: wf(74, "cuneiforms"), cub: wf(74, "cuboid"), mt1: wf(74, "bases"), mt2: wf(74, "bases"), mt3: wf(74, "bases"), mt4: wf(74, "bases"), mt5: wf(74, "bases") }} col={{ cun1: GC.mid, cun2: GC.mid, cun3: GC.mid, cub: "#F0A868", mt1: GC.meta, mt2: GC.meta, mt3: GC.meta, mt4: GC.meta, mt5: GC.meta }} dim={0.5} /></div>
        </Panel>
        <Panel x={600} y={0} w={760} h={740} t={t} t0={m3 + 0.2}>
          <div style={abs(30, 160)}><TransArch t={t} w={700} p={ramp(t, wf(74, "transverse"), wf(74, "bases") + 0.6)} /></div>
          <ViewTag t={t} t0={m3 + 0.3} x={24} y={20} text="CROSS-SECTION OF THE MIDFOOT" />
          <div style={abs(40, 620)}><Chip t={t} t0={wf(74, "across")} bg={GC.fore} color={C.forest} size={36}>3 · transverse = ACROSS the midfoot</Chip></div>
        </Panel>
        <Facts x={1400} y={10} w={400}
          items={[
            { t: s_(74), text: "TRANSVERSE arch: across the midfoot", bg: C.forest },
            { t: wf(74, "made"), text: "cuneiforms · cuboid · bases of the metatarsals" },
          ]} />
      </Seg>
      <Seg t={t} a={m4} b={b + 0.1}>
        <Panel x={0} y={0} w={1200} h={740} t={t} t0={m4}>
          <div style={abs(100, 130)}><ArchSide t={t} w={1000} fascia={ramp(t, wf(75, "plantar") - 0.3, wf(75, "plantar") + 0.3)} weight={ramp(t, s_(76), s_(76) + 0.4)} squash={sq} lit={{ calc: m4, talus: m4, nav: m4, cun: m4, mt1: m4, ph: m4 }} /></div>
          <ViewTag t={t} t0={m4 + 0.2} x={24} y={20} text="THE ARCH = A SPRING" />
          {t > wf(75, "aponeurosis") - 0.3 && <div style={abs(470, 650)}><Chip t={t} t0={wf(75, "aponeurosis")} bg={"#3E7FA6"} size={34}>plantar aponeurosis</Chip></div>}
        </Panel>
        <Facts x={1240} y={10} w={560}
          items={[
            { t: s_(75), text: "held up by LIGAMENTS + MUSCLES", bg: C.forest },
            { t: wf(75, "sheet"), text: "+ a thick sheet under the sole: the PLANTAR APONEUROSIS", bg: "#3E7FA6" },
            { t: s_(76), text: "together: a SPRING that carries your weight and absorbs shock", bg: C.red },
          ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 7. MEMORY TRICKS ================= */
const StudyCard: React.FC<{ t: number; flip: number; front: React.ReactNode; back: string; w?: number }> = ({ t, flip, front, back, w = 560 }) => {
  const p = ramp(t, flip, flip + 0.6);
  const ang = p * 180;
  const showBack = ang > 90;
  return (
    <div style={{ width: w, height: w * 0.66, perspective: 1600 }}>
      <div style={{ width: "100%", height: "100%", transform: `rotateY(${ang}deg)`, transformStyle: "preserve-3d", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: showBack ? C.forest : C.card, border: `4px solid ${showBack ? C.forest : C.line}`, boxShadow: "0 20px 40px rgba(31,42,20,0.18)", transform: showBack ? "rotateY(180deg)" : "none", display: "flex", alignItems: "center", justifyContent: "center", padding: 30, boxSizing: "border-box", textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 52, color: showBack ? C.banana : C.forest, lineHeight: 1.15, whiteSpace: "pre-line", overflow: "hidden" }}>
          {showBack ? back : front}
        </div>
      </div>
    </div>
  );
};
export const STricks: React.FC = () => {
  const t = useT();
  const a = ST(7), b = BE(7);
  const words: [string, string, number][] = [
    ["Tiger", "talus", wf(78, "tiger")], ["Cub", "calc", wf(78, "cub")], ["Needs", "nav", wf(78, "needs")],
    ["M", "cun1", wf(78, "milc")], ["I", "cun2", wf(78, "milc") + 0.12], ["L", "cun3", wf(78, "milc") + 0.24], ["C", "cub", wf(78, "milc") + 0.36],
  ];
  const names: [string, string, number][] = [
    ["Talus", "talus", wf(79, "talus")], ["Calcaneus", "calc", wf(79, "calcaneus")], ["Navicular", "nav", wf(79, "navicular")],
    ["Medial cuneiform", "cun1", wf(79, "medial")], ["Intermediate cuneiform", "cun2", wf(79, "intermediate")], ["Lateral cuneiform", "cun3", wf(79, "lateral")], ["Cuboid", "cub", wf(79, "cuboid")],
  ];
  const nl: Record<string, { a: number; b: number }> = {};
  names.forEach(([, id, tt], i) => (nl[id] = { a: tt, b: i < names.length - 1 ? names[i + 1][2] : s_(80) - 0.3 }));
  const T4 = wf(83, "always");
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(80) - 0.2}>
        <TrickCard t={t} t0={a} n={1} title="The 7 tarsals: Tiger Cub Needs MILC">
          <div style={abs(60, 180, { display: "flex", gap: 22, alignItems: "baseline", fontFamily: FONT, fontWeight: 800, fontSize: 74, color: C.paper })}>
            {["Tiger", "Cub", "Needs"].map((w, i) => (
              <div key={w} style={pop(t, words[i][2])}><FL w={w} on={t >= words[i][2] ? 1 : 0} /></div>
            ))}
            <div style={{ ...pop(t, words[3][2]), color: C.banana, textShadow: `0 0 18px ${C.bananaDark}`, fontSize: 90 }}>MILC</div>
          </div>
          <div style={abs(60, 300, { display: "flex", flexDirection: "column", gap: 0 })}>
            {names.map(([n, id, tt]) => (
              <div key={n} style={{ ...pop(t, tt), display: "flex", alignItems: "center", gap: 16, fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.paper, transformOrigin: "0% 50%" }}>
                <FL w={n} on={t >= tt ? 1 : 0} />
              </div>
            ))}
          </div>
          <div style={abs(1080, 30, { width: 680, height: 680, borderRadius: 36, background: C.card, overflow: "hidden" })}>
            <div style={abs(80, -20)}><FootTop t={t} w={540} lit={nl} col={{ talus: GC.hind, calc: GC.hind, nav: GC.mid, cun1: C.red, cun2: C.banana, cun3: GC.meta, cub: "#F0A868" }} dim={0.6} letters={ramp(t, wf(78, "tiger"), wf(78, "milc") + 0.6)} /></div>
          </div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={s_(80) - 0.2} b={s_(81) - 0.2}>
        <TrickCard t={t} t0={s_(80) - 0.2} n={2} title="The numbers: 7 · 5 · 14">
          <div style={abs(60, 200, { display: "flex", gap: 40 })}>
            {([["FOOT", "7", "5", "14", wf(80, "seven")], ["HAND", "8", "5", "14", wf(80, "carpals")]] as [string, string, string, string, number][]).map(([h, x, y, z, tt]) => (
              <div key={h} style={{ ...pop(t, tt), width: 800, borderRadius: 36, background: "rgba(247,246,236,0.08)", border: `4px solid ${h === "FOOT" ? C.banana : C.matcha}`, padding: "30px 40px", fontFamily: FONT, fontWeight: 800, color: C.paper }}>
                <div style={{ fontSize: 40, letterSpacing: 6, color: h === "FOOT" ? C.banana : C.matchaLight }}>{h}</div>
                {[[x, h === "FOOT" ? "tarsals" : "carpals"], [y, h === "FOOT" ? "metatarsals" : "metacarpals"], [z, "phalanges"]].map(([n, l], i) => (
                  <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 24, marginTop: 4 }}>
                    <div style={{ width: 110, fontSize: 72, color: i === 0 ? (h === "FOOT" ? C.banana : C.red) : C.paper }}>{n}</div>
                    <div style={{ fontSize: 42 }}>{l}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={abs(60, 650, { fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.banana, opacity: ramp(t, wf(80, "less"), wf(80, "less") + 0.4) })}>one LESS tarsal than the 8 carpals · the same 5 + 14 as the hand</div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={s_(81) - 0.2} b={s_(82) - 0.2}>
        <TrickCard t={t} t0={s_(81) - 0.2} n={3} title="The malleoli: tibia inside, fibula outside">
          <div style={abs(60, 190, { width: 440, height: 520, borderRadius: 36, background: C.card, overflow: "hidden" })}>
            <div style={abs(10, 10)}><AnkleBack t={t} w={420} lit={{ tibia: wf(81, "tibia"), fibula: wf(81, "fibula") }} ligs={0} dim={0.7} /></div>
          </div>
          <div style={abs(560, 210, { display: "flex", flexDirection: "column", gap: 40 })}>
            {([["TIBIA", "on the INSIDE", "MEDIAL malleolus", wf(81, "tibia"), C.red], ["FIBULA", "on the OUTSIDE", "LATERAL malleolus", wf(81, "fibula"), "#E9A23B"]] as [string, string, string, number, string][]).map(([x, y, z, tt, col]) => (
              <div key={x} style={{ ...pop(t, tt), display: "flex", alignItems: "center", gap: 26, fontFamily: FONT, fontWeight: 800, transformOrigin: "0% 50%" }}>
                <div style={{ width: 300, background: col, color: C.forest, borderRadius: 26, padding: "18px 26px", fontSize: 50, textAlign: "center" }}>{x}</div>
                <div style={{ fontSize: 40, color: C.paper, width: 330 }}>{y}</div>
                <div style={{ fontSize: 60, color: C.matchaLight }}>→</div>
                <div style={{ fontSize: 46, color: C.banana }}>{z}</div>
              </div>
            ))}
          </div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={s_(82) - 0.2} b={s_(84) - 0.2}>
        <TrickCard t={t} t0={s_(82) - 0.2} n={4} title="Lateral ligaments run front → back">
          <div style={abs(60, 180, { display: "flex", flexDirection: "column", gap: 18 })}>
            {([["ATFL", "anterior talofibular", wf(82, "anterior"), LIGC.atfl], ["CFL", "calcaneofibular", wf(82, "calcaneofibular"), LIGC.cfl], ["PTFL", "posterior talofibular", wf(82, "posterior"), "#B79CE0"]] as [string, string, number, string][]).map(([k, n, tt, col]) => (
              <div key={k} style={{ ...pop(t, tt), display: "flex", alignItems: "center", gap: 24, fontFamily: FONT, fontWeight: 800, transformOrigin: "0% 50%" }}>
                <div style={{ width: 190, background: col, color: C.forest, borderRadius: 22, padding: "10px 0", fontSize: 50, textAlign: "center" }}>{k}</div>
                <div style={{ fontSize: 46, color: C.paper }}>{n}</div>
              </div>
            ))}
          </div>
          <div style={abs(60, 520, { ...pop(t, T4), fontFamily: FONT, fontWeight: 800, fontSize: 70, color: C.paper, transformOrigin: "0% 50%" })}>
            <span style={{ color: C.banana }}>A</span>lways <span style={{ color: C.banana }}>T</span>ears <span style={{ color: C.banana }}>F</span>irst = <span style={{ background: C.red, padding: "0 16px", borderRadius: 14 }}>ATFL</span>
          </div>
          <div style={abs(1020, 140, { width: 740, height: 560, borderRadius: 36, background: C.card, overflow: "hidden" })}>
            <div style={abs(-150, 110)}><AnkleSide t={t} w={900} lit={{ atfl: Math.min(wf(82, "anterior"), T4), cfl: { a: wf(82, "calcaneofibular"), b: T4 }, ptfl: { a: wf(82, "posterior"), b: T4 } }} dim={0.6} /></div>
            <Arrow t={t} t0={wf(82, "front")} x={60} y={30} dir="l" label="front → back" col={C.banana} size={90} />
          </div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={s_(84) - 0.2} b={b + 0.1}>
        <div style={abs(40, 40)}>
          <StudyCard t={t} flip={wf(84, "flip") - 0.1} w={900}
            front={
              <div style={{ position: "relative", width: 840, height: 540 }}>
                <div style={{ position: "absolute", left: 20, top: 0, fontSize: 40, color: C.matcha }}>Name the bone</div>
                <div style={{ position: "absolute", left: 250, top: 10 }}>
                  <FootTop t={t} w={420} lit={{ talus: s_(84) }} dim={0.55} />
                </div>
              </div>
            }
            back={"Talus\nno muscles attach\nhindfoot · ankle joint"} />
        </div>
        <div style={abs(1020, 80, { width: 760 })}>
          <div style={pop(t, s_(84))}><Big size={70}>Test yourself</Big></div>
          <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 18 }}>
            <div><Chip t={t} t0={wf(84, "look")} bg={C.card} color={C.forest} size={40}>1 · look at the picture</Chip></div>
            <div><Chip t={t} t0={wf(84, "name")} bg={C.matcha} size={40}>2 · name the bone</Chip></div>
            <div><Chip t={t} t0={wf(84, "flip")} bg={C.forest} size={40}>3 · flip the card to check</Chip></div>
          </div>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 8. QUIZ ================= */
type Q = { n: number; si: number; q: string; a: string; visual: (t: number, r: number, ans: number) => React.ReactNode };
const ALL: Record<string, number> = {};
const QS: Q[] = [
  {
    n: 1, si: 86, q: "How many bones are in one foot?", a: "26",
    visual: (t, r, ans) => (
      <Panel x={0} y={0} w={980} h={740} t={t} t0={s_(86) - 0.2}>
        <div style={abs(90, 40)}><FootTop t={t} w={520} groups={r ? { tarsal: ramp(t, ans, ans + 0.3), meta: ramp(t, ans + 0.2, ans + 0.5), phal: ramp(t, ans + 0.4, ans + 0.7) } : {}} /></div>
        {r ? <div style={abs(620, 230, { ...pop(t, ans + 0.5), fontFamily: FONT, fontWeight: 800, fontSize: 70, color: C.forest, lineHeight: 1.2 })}><span style={{ color: C.bananaDark }}>7</span> + <span style={{ color: C.matcha }}>5</span> + <span style={{ color: C.red }}>14</span><br />= 26</div> : <div style={abs(680, 260, { fontFamily: FONT, fontWeight: 800, fontSize: 160, color: C.red })}>?</div>}
      </Panel>
    ),
  },
  {
    n: 2, si: 88, q: "Which is the largest bone of the foot?", a: "The calcaneus",
    visual: (t, r, ans) => (
      <KPlate {...LATS} x={0} y={150} w={980} a={s_(88) - 0.2} b={s_(90) - 0.2} keys={[[s_(88) - 0.2, 1.0, 0.5, 0.5], [ans, 1.25, 0.75, 0.55]]}
        labels={r ? [{ x: 0.8, y: 0.6, text: "calcaneus", t: ans, side: "l", hot: true }] : []} />
    ),
  },
  {
    n: 3, si: 90, q: "Which tarsal bone has no muscle attachments?", a: "The talus",
    visual: (t, r, ans) => (
      <Panel x={0} y={0} w={980} h={740} t={t} t0={s_(90) - 0.2}>
        <div style={abs(260, 40)}><FootTop t={t} w={520} lit={r ? { talus: ans } : ALL} dim={r ? 0.5 : 1} groups={{ tarsal: r ? 0 : 1 }} /></div>
        {r ? <div style={abs(0, 0)}><FTag t={t} t0={ans} x={260} y={40} id="talus" text="talus" dx={260} dy={0} hot /></div> : null}
      </Panel>
    ),
  },
  {
    n: 4, si: 92, q: "Which bone forms the lateral malleolus?", a: "The fibula",
    visual: (t, r, ans) => (
      <KPlate {...CORO} x={0} y={0} w={920} a={s_(92) - 0.2} b={s_(94) - 0.2} keys={[[s_(92) - 0.2, 1.0, 0.5, 0.5]]}
        labels={[{ x: 0.665, y: 0.46, text: "lateral malleolus", t: s_(92) + 0.6, side: "r", col: C.banana }, ...(r ? [{ x: 0.6, y: 0.24, text: "fibula", t: ans, side: "r" as const, hot: true }] : [])]} />
    ),
  },
  {
    n: 5, si: 94, q: "Which ankle ligament is the most commonly injured?", a: "Anterior talofibular",
    visual: (t, r, ans) => (
      <Panel x={0} y={0} w={980} h={740} t={t} t0={s_(94) - 0.2}>
        <div style={abs(-60, 120)}><AnkleSide t={t} w={1040} lit={r ? { atfl: ans } : {}} dim={0.6} /></div>
        {r ? <Tag t={t} t0={ans + 0.2} x={-60} y={120} w={1040} vbw={1000} pt={AS.atfl} dx={120} dy={-150} text="ATFL" hot size={40} /> : null}
      </Panel>
    ),
  },
];
export const SQuiz: React.FC = () => {
  const t = useT();
  const a = ST(8), b = BE(8);
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(86) - 0.2}>
        <div style={abs(0, 0, { width: 1800, height: 740, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" })}>
          <div style={pop(t, a)}><Big size={150}>QUIZ</Big></div>
          <div style={{ marginTop: 20 }}><Chip t={t} t0={a + 0.3} bg={C.banana} color={C.forest} size={44}>5 questions · pause if you need more time</Chip></div>
        </div>
      </Seg>
      {QS.map((q, i) => {
        const ask = s_(q.si), pause = e_(q.si), ans = s_(q.si + 1);
        const end = i < QS.length - 1 ? s_(QS[i + 1].si) - 0.2 : s_(96) - 0.2;
        const reveal = t >= ans ? 1 : 0;
        const cdT = t - (pause + 0.2);
        const n = cdT < 0 ? null : cdT < 1.0 ? 3 : cdT < 2.0 ? 2 : cdT < 3.0 ? 1 : null;
        const cdK = n ? ramp(t, pause + 0.2 + (3 - n), pause + 0.2 + (3 - n) + 0.18) : 0;
        return (
          <Seg key={q.n} t={t} a={ask - 0.2} b={end}>
            {q.visual(t, reveal, ans)}
            <div style={abs(1040, 0, { width: 760, height: 740, borderRadius: 44, background: C.forest, ...pop(t, ask - 0.15, 0.35) })}>
              <div style={abs(50, 46, { fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: C.banana })}>QUESTION {q.n} / 5</div>
              <div style={abs(50, 110, { width: 660, fontFamily: FONT, fontWeight: 800, fontSize: 58, lineHeight: 1.12, color: C.paper })}>{q.q}</div>
              {n && <div style={abs(0, 440, { width: 760, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 190, lineHeight: 1, color: C.banana, transform: `scale(${1.35 - 0.35 * cdK})` })}>{n}</div>}
              {reveal > 0 && (
                <div style={abs(50, 520, { ...pop(t, ans), width: 660, background: C.banana, borderRadius: 26, padding: "20px 30px 26px", boxSizing: "border-box", fontFamily: FONT, fontWeight: 800, fontSize: q.a.length > 16 ? 46 : 56, color: C.forest, textAlign: "center" })}>✓ {q.a}</div>
              )}
            </div>
          </Seg>
        );
      })}
      <Seg t={t} a={s_(96) - 0.2} b={b + 0.1}>
        <div style={abs(0, 0, { width: 1800, height: 740, borderRadius: 44, background: C.card, border: `4px solid ${C.line}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" })}>
          <Big size={110}>Your score: <span style={{ color: C.matcha }}>? / 5</span></Big>
          <div style={{ marginTop: 30 }}><Chip t={t} t0={wf(96, "tell")} bg={C.forest} size={46}>tell me in the comments</Chip></div>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 9. RECAP + OUTRO ================= */
export const SRecap: React.FC = () => {
  const t = useT();
  const a = ST(9);
  const items: [string, string, number, string][] = [
    ["26 bones", "7 tarsals · 5 metatarsals · 14 phalanges", Math.max(a, s_(98)), GC.tarsal],
    ["Tarsals", "Tiger Cub Needs MILC: talus · calcaneus · navicular · 3 cuneiforms · cuboid", s_(99), GC.hind],
    ["Ankle", "hinge: tibia + fibula + talus · deltoid inside · 3 lateral ligaments outside", s_(100), LIGC.atfl],
    ["Subtalar", "inversion + eversion", s_(101), "#BFD9E6"],
    ["Arches", "medial · lateral · transverse = a spring", s_(102), GC.meta],
  ];
  const ot = s_(103) - 0.2;
  const outro = ramp(t, ot, ot + 0.5);
  return (
    <Stage a={a} b={END - 0.3}>
      {outro < 1 && (
        <div style={abs(0, 0, { width: 1800, height: 740, borderRadius: 44, background: C.forest })}>
          <div style={abs(70, 40, { fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 8, color: C.banana })}>RECAP</div>
          <div style={abs(70, 120, { display: "flex", flexDirection: "column", gap: 26 })}>
            {items.map(([h, s, tt, col]) => (
              <div key={h} style={{ ...pop(t, tt), display: "flex", alignItems: "center", gap: 24, fontFamily: FONT, fontWeight: 800, transformOrigin: "0% 50%" }}>
                <div style={{ width: 62, height: 62, borderRadius: 31, background: col, border: `4px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: C.forest, flexShrink: 0 }}>✓</div>
                <div style={{ width: 250, fontSize: 48, color: C.paper, flexShrink: 0 }}>{h}</div>
                <div style={{ fontSize: 33, color: C.matchaLight, width: 960 }}>{s}</div>
              </div>
            ))}
          </div>
          <div style={abs(1360, 110, { opacity: ramp(t, s_(98), s_(98) + 0.5), width: 380, height: 520, borderRadius: 32, background: C.card })}>
            <div style={abs(30, 20)}><FootTop t={t} w={320} groups={{ tarsal: 1, meta: 1, phal: 1 }} skin={0.6} letters={ramp(t, s_(99), s_(99) + 1.2)} /></div>
          </div>
        </div>
      )}
      {outro > 0 && (
        <div style={abs(0, 0, { width: 1800, height: 740, borderRadius: 44, background: C.forest, opacity: outro, display: "flex", alignItems: "center" })}>
          <div style={{ marginLeft: 120, width: 260, height: 260, borderRadius: 130, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
            <LogoMark size={200} />
          </div>
          <div style={{ marginLeft: 80, fontFamily: FONT, fontWeight: 800 }}>
            <div style={{ fontSize: 110, color: C.paper, lineHeight: 1 }}>Book Plume</div>
            <div style={{ fontSize: 50, color: C.banana, marginTop: 14, opacity: ramp(t, ot + 0.8, ot + 1.2) }}>anatomy you'll actually remember</div>
            <div style={{ display: "flex", gap: 24, marginTop: 40, alignItems: "center" }}>
              <div style={{ background: C.red, color: C.paper, borderRadius: 50, padding: "18px 54px 22px", fontSize: 54, letterSpacing: 3, transform: `scale(${1 + 0.05 * Math.max(0, Math.sin((t - ot) * 5))})`, opacity: ramp(t, wf(103, "subscribe"), wf(103, "subscribe") + 0.3) }}>SUBSCRIBE</div>
            </div>
            <div style={{ marginTop: 40, background: C.paper, color: C.forest, borderRadius: 24, padding: "16px 30px 20px", fontSize: 40, opacity: ramp(t, s_(104), s_(104) + 0.4), width: "fit-content" }}>Which part of the body should we learn next?</div>
          </div>
        </div>
      )}
    </Stage>
  );
};
