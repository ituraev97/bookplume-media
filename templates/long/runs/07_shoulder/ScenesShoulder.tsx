import React from "react";
import { Img, staticFile } from "remotion";
import { C, FONT, ramp, useT } from "./kit";
import { Facts, Stage, LogoMark } from "./Chrome16";
import { ShoulderFront, Cuff, CuffRing, JointSection, ArmRaise, RotateTop, GolfTee, MC, SF, CB, JS } from "./IllusShoulder";
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

/* ---------- plates (Gray's Anatomy 1918, public domain) with keyframed camera ---------- */
const P = (f: string, w: number, h: number) => ({ src: `plates/${f}.png`, aspect: w / h });
export const CLAV = P("clavicle", 1944, 521);
export const SCB = P("scapula_back", 1830, 2509);
export const SCF = P("scapula_front", 1556, 2373);
export const HUM = P("humerus_top", 870, 1255);
export const GIRD = P("girdle_back", 2014, 1911);
export const SCJ = P("sc_joint", 2069, 925);
export const ACL = P("ac_ligaments", 1433, 1523);
export const GLEN = P("glenoid", 830, 924);
export const CAPS = P("capsule", 2115, 1368);
export const CUFF = P("cuff_back", 1706, 1638);
export const DELT = P("deltoid", 1842, 2139);
export const NERV = P("nerves", 1894, 1332);

type PL = { x: number; y: number; text: string; t: number; side?: "l" | "r"; hot?: boolean; col?: string; t1?: number };
type Key = [number, number, number, number]; // time, scale, focusX, focusY
/** plate in a rounded frame; camera follows keyframes; modern labels pinned in image fractions */
export const KPlate: React.FC<{ src: string; aspect: number; x: number; y: number; w: number; a: number; b: number; keys?: Key[]; labels?: PL[]; credit?: boolean; frame?: boolean }> = ({ src, aspect, x, y, w, a, b, keys = [], labels = [], credit = true, frame = true }) => {
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

/* ================= INTRO ================= */
export const SIntro: React.FC = () => {
  const t = useT();
  const m = s_(3) - 0.2;
  const ang = kv(t, [[0.6, 0], [wf(1, "lift"), 0], [wf(1, "head"), 165], [wf(1, "reach"), 165], [wf(1, "behind"), 40], [wf(1, "swing"), 0], [wf(1, "full") , 90], [wf(1, "circle"), 170], [e_(1) + 0.3, 0]]);
  return (
    <Stage a={-1} b={BE(0)}>
      <Seg t={t} a={-1} b={m}>
        <Panel x={0} y={0} w={700} h={740} t={t} t0={0}>
          <div style={abs(60, 30)}><ArmRaise t={t} w={620} ang={ang} hi={{ delt: { a: wf(1, "lift"), b: s_(2) } }} /></div>
          <ViewTag t={t} t0={0.4} x={24} y={20} text="FROM BEHIND" />
        </Panel>
        <div style={abs(760, 0, { width: 1040, ...pop(t, 0.2) })}>
          <Big size={96}><Mk p={ramp(t, 0.6, 1.6)}>Shoulder Anatomy</Mk></Big>
          <Big size={54} color={C.matcha} style={{ marginTop: 8 }}>made easy · in about 10 minutes</Big>
        </div>
        <Facts x={760} y={210} w={1000}
          items={[
            { t: wf(0, "mobile"), text: "the MOST MOBILE joint in your whole body", bg: C.forest },
            { t: wf(1, "lift"), text: "lift it overhead · reach behind your back · swing a full circle" },
            { t: wf(2, "price"), text: "the price of all that freedom?", bg: C.matcha },
            { t: wf(2, "stability"), text: "STABILITY", bg: C.red, big: "!" },
          ]} />
      </Seg>
      <Seg t={t} a={m} b={BE(0) + 0.1}>
        <KPlate {...ACL} x={0} y={0} w={700} a={m} b={BE(0)} keys={[[m, 1.05, 0.5, 0.45], [s_(4), 1.25, 0.65, 0.55]]} />
        <div style={abs(760, 0, { width: 1040, ...pop(t, m + 0.1) })}>
          <Big size={58}>In about 10 minutes:</Big>
        </div>
        <div style={abs(760, 86, { width: 1040, display: "flex", flexDirection: "column", gap: 12 })}>
          {[
            ["the 3 bones of the shoulder", wf(3, "bones"), "#F4ECD2"],
            ["the 4 joints that move it", wf(3, "joints"), C.red],
            ["how the ball and socket really works", wf(3, "ball"), "#BFD9E6"],
            ["the 4 rotator cuff muscles + where they attach", wf(4, "rotator"), MC.supra],
            ["what each one does + its nerve", wf(4, "does"), MC.infra],
            ["memory tricks that stick", wf(5, "memory"), C.banana],
          ].map(([txt, tt, col]) => (
            <div key={txt as string} style={{ ...pop(t, tt as number), display: "flex", alignItems: "center", gap: 18, background: C.card, border: `3px solid ${C.line}`, borderRadius: 24, padding: "8px 22px", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.forest, transformOrigin: "0% 50%" }}>
              <div style={{ width: 42, height: 42, borderRadius: 21, background: col as string, border: `3px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>✓</div>
              {txt}
            </div>
          ))}
        </div>
        <div style={abs(760, 650)}>
          <Chip t={t} t0={wf(5, "five")} bg={C.banana} color={C.forest} size={40}>+ 5-question quiz at the end</Chip>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 1. THE THREE BONES ================= */
export const SBones: React.FC = () => {
  const t = useT();
  const a = ST(1), b = BE(1);
  const m1 = s_(7) - 0.2, m2 = s_(10) - 0.2, m3 = s_(17) - 0.2;
  return (
    <Stage a={a} b={b}>
      {/* the three bones */}
      <Seg t={t} a={a} b={m1}>
        <Panel x={0} y={0} w={860} h={740} t={t} t0={a}>
          <div style={abs(20, 40)}><ShoulderFront t={t} w={820} lit={{ clav: { a: wf(6, "clavicle"), b: wf(6, "scapula") }, scap: { a: wf(6, "scapula"), b: wf(6, "humerus") }, hum: wf(6, "humerus"), head: wf(6, "humerus") }} dim={0.75} /></div>
          <ViewTag t={t} t0={a + 0.2} x={24} y={20} text="FRONT VIEW · LEFT SHOULDER" />
        </Panel>
        <Tag t={t} t0={wf(6, "clavicle")} x={20} y={40} w={820} pt={SF.clav} dx={0} dy={-90} text="clavicle" hot />
        <Tag t={t} t0={wf(6, "scapula")} x={20} y={40} w={820} pt={SF.scap} dx={-10} dy={120} text="scapula (behind the ribs)" hot />
        <Tag t={t} t0={wf(6, "humerus")} x={20} y={40} w={820} pt={SF.hum} dx={-150} dy={20} text="humerus" hot />
        <div style={abs(920, 20, { width: 880 })}>
          <div style={pop(t, a)}><Big size={70}>3 bones meet here</Big></div>
          <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 18 }}>
            <Row t={t} t0={wf(6, "clavicle")} n="1" col="#F4ECD2" title="Clavicle" sub="the collarbone" w={820} size={50} />
            <Row t={t} t0={wf(6, "scapula")} n="2" col="#F4ECD2" title="Scapula" sub="the shoulder blade" w={820} size={50} />
            <Row t={t} t0={wf(6, "humerus")} n="3" col="#F4ECD2" title="Humerus" sub="the bone of the upper arm" w={820} size={50} />
          </div>
        </div>
      </Seg>
      {/* clavicle */}
      <Seg t={t} a={m1} b={m2}>
        <KPlate {...CLAV} x={0} y={10} w={1000} a={m1} b={m2} keys={[[m1, 1.0, 0.5, 0.5]]}
          labels={[
            { x: 0.05, y: 0.62, text: "sternal end", t: wf(8, "chest"), side: "r" },
            { x: 0.93, y: 0.55, text: "acromial end", t: wf(8, "side"), side: "l" },
          ]} />
        <Note t={t} t0={wf(8, "chest") + 0.6} x={0} y={300} old="sternal / acromial extremity" />
        <Panel x={0} y={380} w={1000} h={360} t={t} t0={m1 + 0.3}>
          <div style={abs(170, -70)}><ShoulderFront t={t} w={600} lit={{ clav: m1 + 0.4 }} dim={0.55} /></div>
          <Arrow t={t} t0={wf(8, "strut")} x={680} y={60} dir="r" label="holds the shoulder OUT" />
        </Panel>
        <Facts x={1060} y={10} w={740}
          items={[
            { t: s_(7), text: "clavicle = the COLLARBONE", bg: C.forest },
            { t: wf(7, "only"), text: "the only long bone that lies HORIZONTALLY" },
            { t: wf(8, "strut"), text: "a strut: keeps the shoulder out to the side, away from the chest" },
            { t: s_(9), text: "the most commonly fractured bone in the body", bg: C.red },
          ]} />
      </Seg>
      {/* scapula */}
      <Seg t={t} a={m2} b={m3}>
        <KPlate {...SCB} x={0} y={0} w={540} a={m2} b={m3}
          keys={[[m2, 1.0, 0.5, 0.5], [s_(11), 1.08, 0.45, 0.35], [s_(12), 1.0, 0.5, 0.5], [s_(14), 1.1, 0.35, 0.3], [s_(16), 1.12, 0.3, 0.32]]}
          labels={[
            { x: 0.42, y: 0.31, text: "spine", t: wf(11, "spine"), side: "r", hot: true, t1: s_(14) },
            { x: 0.72, y: 0.24, text: "supraspinous fossa", t: wf(12, "supraspinous"), side: "l", t1: s_(14) },
            { x: 0.62, y: 0.6, text: "infraspinous fossa", t: wf(12, "infraspinous"), side: "l", t1: s_(14) },
            { x: 0.08, y: 0.17, text: "acromion", t: wf(14, "acromion"), side: "r", hot: true },
            { x: 0.4, y: 0.1, text: "coracoid", t: wf(15, "coracoid"), side: "r", hot: true },
            { x: 0.2, y: 0.37, text: "glenoid cavity", t: wf(16, "glenoid"), side: "r", hot: true },
          ]} />
        <ViewTag t={t} t0={m2 + 0.3} x={20} y={20} text="BACK VIEW" />
        <KPlate {...SCF} x={570} y={0} w={480} a={s_(13) - 0.1} b={s_(14) + 0.3} keys={[[s_(13) - 0.1, 1.0, 0.5, 0.5]]}
          labels={[{ x: 0.3, y: 0.55, text: "subscapular fossa", t: wf(13, "subscapular"), side: "r", hot: true }]} />
        <Note t={t} t0={s_(11) + 1.0} x={575} y={560} old="axillary border" modern="lateral border" />
        <Note t={t} t0={s_(11) + 1.4} x={575} y={630} old="vertebral border" modern="medial border" />
        <Facts x={1170} y={10} w={630}
          items={[
            { t: s_(10), text: "scapula = the SHOULDER BLADE: flat + triangular, on the back of the rib cage", bg: C.forest },
            { t: wf(11, "spine"), text: "a ridge across its back: the SPINE of the scapula" },
            { t: wf(12, "above"), text: "above the spine: SUPRAspinous fossa · below: INFRAspinous fossa" },
            { t: s_(13), text: "front (faces the ribs): SUBscapular fossa", bg: C.matcha },
            { t: s_(14), text: "acromion = the highest point of your shoulder" },
            { t: s_(15), text: "coracoid process = hook pointing forward" },
            { t: s_(16), text: "glenoid cavity = shallow dish = the SOCKET", bg: C.red },
          ]} />
      </Seg>
      {/* humerus */}
      <Seg t={t} a={m3} b={b + 0.1}>
        <KPlate {...HUM} x={0} y={0} w={512} a={m3} b={b}
          keys={[[m3, 1.0, 0.5, 0.5], [s_(18), 1.12, 0.45, 0.3], [s_(20), 1.1, 0.55, 0.38]]}
          labels={[
            { x: 0.36, y: 0.22, text: "head", t: wf(18, "head"), side: "r", hot: true, t1: wf(19, "greater") - 0.3 },
            { x: 0.79, y: 0.27, text: "greater tubercle", t: wf(19, "greater"), side: "l", hot: true, t1: wf(19, "lesser") - 0.3 },
            { x: 0.52, y: 0.31, text: "lesser tubercle", t: wf(19, "lesser"), side: "l", hot: true, t1: wf(20, "intertubercular") - 0.3 },
            { x: 0.66, y: 0.4, text: "intertubercular groove", t: wf(20, "intertubercular"), side: "l", hot: true },
          ]} />
        <ViewTag t={t} t0={m3 + 0.3} x={20} y={20} text="FRONT VIEW" />
        <Panel x={550} y={0} w={500} h={740} t={t} t0={m3 + 0.2}>
          <div style={abs(-330, -40)}><ShoulderFront t={t} w={900} lit={{ head: { a: wf(18, "head"), b: s_(19) }, gt: wf(19, "greater"), lt: wf(19, "lesser"), groove: wf(20, "groove"), biceps: wf(20, "biceps") }} dim={0.8} /></div>
        </Panel>
        <Facts x={1100} y={10} w={700}
          items={[
            { t: s_(17), text: "humerus = the bone of the UPPER ARM", bg: C.forest },
            { t: s_(18), text: "round head = the BALL of the joint" },
            { t: wf(19, "greater"), text: "GREATER tubercle: bigger, on the outer side", bg: C.matcha },
            { t: wf(19, "lesser"), text: "LESSER tubercle: smaller, in front" },
            { t: s_(20), text: "intertubercular groove → tendon of the long head of biceps", bg: C.red },
          ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 2. FOUR JOINTS ================= */
export const SJoints: React.FC = () => {
  const t = useT();
  const a = ST(2), b = BE(2);
  const j1 = s_(22) - 0.2, j2 = s_(24) - 0.2, j3 = s_(26) - 0.2, j4 = s_(28) - 0.2;
  const four = wf(21, "four");
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={j1}>
        <Panel x={0} y={0} w={940} h={740} t={t} t0={a}>
          <div style={abs(30, 20)}><ShoulderFront t={t} w={880} dim={0.8} joints={{ jSC: four, jAC: four + 0.25, jST: four + 0.5, jGH: four + 0.75 }} /></div>
        </Panel>
        <div style={abs(1000, 60, { width: 800 })}>
          <div style={pop(t, a)}><Big size={64} color={C.matcha}>"shoulder joint" =</Big></div>
          <div style={{ ...pop(t, four), marginTop: 10 }}><Big size={120}><Mk p={ramp(t, four, four + 0.8)}>4 joints</Mk></Big></div>
          <div style={{ ...pop(t, wf(21, "together")), marginTop: 24 }}><Big size={48} color={C.forest}>working together to move your shoulder</Big></div>
        </div>
      </Seg>
      {/* 1 SC */}
      <Seg t={t} a={j1} b={j2}>
        <KPlate {...SCJ} x={0} y={0} w={1000} a={j1} b={j2} keys={[[j1, 1.0, 0.5, 0.5], [s_(23), 1.12, 0.6, 0.5]]}
          labels={[
            { x: 0.67, y: 0.52, text: "sternoclavicular joint", t: wf(22, "sternoclavicular"), side: "l", hot: true },
            { x: 0.78, y: 0.2, text: "clavicle", t: wf(22, "clavicle"), side: "l" },
            { x: 0.45, y: 0.86, text: "sternum", t: wf(22, "sternum"), side: "l" },
          ]} />
        <Note t={t} t0={wf(22, "sternum") + 0.4} x={0} y={470} old="manubrium sterni" modern="manubrium of sternum" />
        <Panel x={0} y={550} w={1000} h={190} t={t} t0={s_(23)} bg={C.forest}>
          <div style={abs(40, 34, { fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper, width: 920 })}>the ONLY bony link between your arm and the rest of your skeleton</div>
        </Panel>
        <div style={abs(1080, 0)}>
          <Row t={t} t0={j1 + 0.1} n="1" col={C.red} title="Sternoclavicular" sub="clavicle + sternum (breastbone)" w={720} size={46} />
        </div>
        <Panel x={1080} y={150} w={720} h={590} t={t} t0={j1 + 0.3}>
          <div style={abs(-30, 10)}><ShoulderFront t={t} w={760} dim={0.6} lit={{ clav: j1 + 0.5, sternum: j1 + 0.5 }} joints={{ jSC: j1 + 0.5 }} /></div>
        </Panel>
      </Seg>
      {/* 2 AC */}
      <Seg t={t} a={j2} b={j3}>
        <KPlate {...ACL} x={0} y={0} w={700} a={j2} b={j3} keys={[[j2, 1.0, 0.5, 0.5], [wf(24, "acromioclavicular"), 1.35, 0.7, 0.2], [wf(25, "coracoid"), 1.3, 0.45, 0.25]]}
          labels={[
            { x: 0.8, y: 0.165, text: "AC joint", t: wf(24, "acromioclavicular"), side: "l", hot: true, t1: wf(25, "coracoid") },
            { x: 0.93, y: 0.21, text: "acromion", t: wf(24, "acromion"), side: "l", t1: wf(25, "coracoid") },
            { x: 0.45, y: 0.3, text: "coracoid process", t: wf(25, "coracoid"), side: "r" },
            { x: 0.37, y: 0.16, text: "coracoclavicular ligament", t: wf(25, "coracoclavicular"), side: "r", hot: true },
          ]} />
        <div style={abs(760, 0)}>
          <Row t={t} t0={j2 + 0.1} n="2" col={C.red} title="Acromioclavicular" sub="outer end of clavicle + acromion" w={1040} size={46} />
        </div>
        <Panel x={760} y={150} w={460} h={590} t={t} t0={j2 + 0.3}>
          <div style={abs(-330, -40)}><ShoulderFront t={t} w={860} dim={0.6} lit={{ acro: wf(24, "acromion"), clav: wf(24, "clavicle"), cora: wf(25, "coracoid") }} joints={{ jAC: j2 + 0.5 }} /></div>
        </Panel>
        <Facts x={1260} y={150} w={540}
          items={[
            { t: wf(25, "small"), text: "small, flat, GLIDING joint" },
            { t: wf(25, "ligament"), text: "held mainly by the CORACOCLAVICULAR ligament", bg: C.matcha },
            { t: wf(25, "coracoclavicular"), text: "coracoid process → clavicle", bg: C.forest },
          ]} />
      </Seg>
      {/* 3 scapulothoracic */}
      <Seg t={t} a={j3} b={j4}>
        <KPlate {...GIRD} x={0} y={0} w={780} a={j3} b={j4} keys={[[j3, 1.0, 0.5, 0.5], [s_(27), 1.3, 0.22, 0.32]]}
          labels={[
            { x: 0.2, y: 0.3, text: "scapula", t: wf(26, "scapulothoracic") + 0.3, side: "r", hot: true },
            { x: 0.38, y: 0.6, text: "rib cage", t: wf(27, "rib"), side: "r" },
          ]} />
        <ViewTag t={t} t0={j3 + 0.3} x={20} y={20} text="BACK VIEW" />
        <Arrow t={t} t0={wf(27, "gliding")} x={20} y={110} dir="u" col={C.matcha} size={90} />
        <Arrow t={t} t0={wf(27, "gliding") + 0.3} x={20} y={430} dir="d" col={C.matcha} size={90} />
        <div style={abs(840, 0)}>
          <Row t={t} t0={j3 + 0.1} n="3" col={C.matcha} title="Scapulothoracic" sub="scapula + back of the rib cage" w={960} size={46} />
        </div>
        <Facts x={840} y={170} w={960}
          items={[
            { t: wf(26, "true"), text: "NOT a true joint at all", bg: C.red, big: "✗" },
            { t: wf(27, "gliding"), text: "just the scapula GLIDING over the back of the rib cage" },
            { t: wf(27, "muscles"), text: "held in place by MUSCLES", bg: C.forest },
          ]} />
      </Seg>
      {/* 4 glenohumeral */}
      <Seg t={t} a={j4} b={b + 0.1}>
        <KPlate {...GLEN} x={0} y={0} w={620} a={j4} b={b} keys={[[j4, 1.0, 0.5, 0.5], [wf(28, "glenoid"), 1.15, 0.45, 0.55]]}
          labels={[
            { x: 0.4, y: 0.53, text: "glenoid cavity", t: wf(28, "glenoid"), side: "r", hot: true },
            { x: 0.08, y: 0.3, text: "acromion", t: j4 + 0.6, side: "r" },
          ]} />
        <ViewTag t={t} t0={j4 + 0.3} x={20} y={20} text="SOCKET, SEEN FROM THE SIDE" />
        <div style={abs(680, 0)}>
          <Row t={t} t0={j4 + 0.1} n="4" col={C.red} title="Glenohumeral" sub="head of humerus + glenoid cavity" w={1120} size={46} />
        </div>
        <Panel x={680} y={150} w={520} h={590} t={t} t0={j4 + 0.3}>
          <div style={abs(-320, -60)}><ShoulderFront t={t} w={900} dim={0.6} lit={{ head: wf(28, "head"), glen: wf(28, "glenoid") }} joints={{ jGH: j4 + 0.5 }} /></div>
        </Panel>
        <div style={abs(1240, 200, { width: 560, ...pop(t, s_(29)) })}>
          <div style={{ background: C.banana, borderRadius: 30, padding: "26px 30px", fontFamily: FONT, fontWeight: 800, fontSize: 50, color: C.forest, lineHeight: 1.1 }}>= THE "shoulder joint"</div>
          <div style={{ marginTop: 20, fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.matcha, opacity: ramp(t, wf(29, "rest"), wf(29, "rest") + 0.4) }}>the rest of this lesson is mostly about it</div>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 3. THE BALL AND SOCKET ================= */
export const SSocket: React.FC = () => {
  const t = useT();
  const a = ST(3), b = BE(3);
  const k1 = s_(33) - 0.2, k2 = s_(34) - 0.2, k3 = s_(36) - 0.2, k4 = s_(39) - 0.2, k5 = s_(41) - 0.2;
  const rc = wf(41, "rotator");
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={k1}>
        <Panel x={0} y={0} w={880} h={740} t={t} t0={a}>
          <div style={abs(30, 50)}><JointSection t={t} w={820} lit={{ head: { a: wf(30, "ball"), b: wf(30, "socket") + 0.6 }, glen: wf(30, "socket") }} supra={0.25} delt={0.2} bursa={0.2} cap={0.4} acro={0.35} /></div>
          <ViewTag t={t} t0={a + 0.3} x={24} y={20} text="CUT THROUGH THE JOINT, FROM THE FRONT" />
        </Panel>
        <Tag t={t} t0={wf(30, "ball")} x={30} y={50} w={820} pt={JS.head} dx={240} dy={250} text="ball: head of humerus" hot />
        <Tag t={t} t0={wf(30, "socket")} x={30} y={50} w={820} pt={JS.glen} dx={-120} dy={170} text="socket: glenoid cavity" hot />
        <Facts x={940} y={0} w={560}
          items={[
            { t: s_(30), text: "synovial BALL-AND-SOCKET joint", bg: C.forest },
            { t: wf(31, "small"), text: "but the socket is small + SHALLOW" },
            { t: wf(31, "less"), text: "covers less than 1/3 of the head", big: "< ⅓", bg: C.red },
          ]} />
        <Panel x={1530} y={330} w={270} h={410} t={t} t0={s_(32)}>
          <div style={abs(20, 30)}><GolfTee t={t} t0={s_(32)} w={230} /></div>
          <div style={abs(0, 330, { width: 270, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.matcha })}>a golf ball on a tee</div>
        </Panel>
      </Seg>
      <Seg t={t} a={k1} b={k2}>
        <KPlate {...GLEN} x={0} y={0} w={620} a={k1} b={k2} keys={[[k1, 1.05, 0.45, 0.55], [wf(33, "labrum"), 1.15, 0.42, 0.58]]}
          labels={[{ x: 0.48, y: 0.66, text: "glenoid labrum", t: wf(33, "labrum"), side: "r", hot: true }]} />
        <Note t={t} t0={wf(33, "labrum") + 0.6} x={0} y={600} old="glenoid ligament" modern="glenoid labrum" />
        <Panel x={660} y={0} w={640} h={740} t={t} t0={k1 + 0.2}>
          <div style={abs(-110, 100)}><JointSection t={t} w={860} lit={{ lab: wf(33, "ring") }} dim={0.7} supra={0.2} delt={0.15} bursa={0.15} cap={0.3} acro={0.3} /></div>
        </Panel>
        <Tag t={t} t0={wf(33, "ring")} x={550} y={100} w={860} pt={JS.lab} dx={160} dy={-80} text="labrum" hot />
        <Facts x={1340} y={0} w={460}
          items={[
            { t: wf(33, "ring"), text: "a RING of fibrocartilage around the rim", bg: C.forest },
            { t: wf(33, "deeper"), text: "makes the socket DEEPER" },
            { t: wf(33, "labrum"), text: "= the GLENOID LABRUM", bg: C.red },
          ]} />
      </Seg>
      <Seg t={t} a={k2} b={k3}>
        <KPlate {...CAPS} x={0} y={0} w={1000} a={k2} b={k3} keys={[[k2, 1.0, 0.5, 0.5], [s_(35), 1.1, 0.42, 0.55]]}
          labels={[
            { x: 0.42, y: 0.42, text: "joint capsule", t: wf(34, "capsule"), side: "r", hot: true },
            { x: 0.33, y: 0.62, text: "glenohumeral ligaments", t: wf(35, "glenohumeral"), side: "r" },
            { x: 0.5, y: 0.17, text: "coracoid process", t: k2 + 0.8, side: "r" },
          ]} />
        <ViewTag t={t} t0={k2 + 0.3} x={20} y={20} text="FRONT VIEW · CAPSULE FILLED" />
        <Panel x={1040} y={0} w={760} h={480} t={t} t0={k2 + 0.2}>
          <div style={abs(30, 0)}><JointSection t={t} w={640} lit={{ cap: wf(34, "loose") }} dim={0.7} supra={0.25} delt={0.15} bursa={0.15} acro={0.3} /></div>
        </Panel>
        <Tag t={t} t0={wf(34, "underneath")} x={1070} y={0} w={640} pt={[430, 590]} dx={200} dy={0} text="loose fold below" hot />
        <div style={abs(1040, 510, { width: 760, display: "flex", flexDirection: "column", gap: 14 })}>
          <Chip t={t} t0={wf(34, "slack")} bg={C.forest} size={34}>slack = lets the arm move so far</Chip>
          <Chip t={t} t0={wf(35, "superior")} bg={C.matcha} size={32}>superior · middle · inferior GH ligaments</Chip>
        </div>
      </Seg>
      <Seg t={t} a={k3} b={k4}>
        <KPlate {...ACL} x={0} y={0} w={700} a={k3} b={k4}
          keys={[[k3, 1.1, 0.6, 0.4], [s_(37), 1.1, 0.6, 0.3], [s_(38), 1.05, 0.55, 0.35]]}
          labels={[
            { x: 0.7, y: 0.38, text: "coracohumeral lig.", t: wf(36, "coracohumeral"), side: "l", hot: true, t1: s_(37) },
            { x: 0.45, y: 0.31, text: "coracoid process", t: wf(37, "coracoid"), side: "r" },
            { x: 0.62, y: 0.24, text: "coracoacromial lig.", t: wf(37, "coracoacromial"), side: "l", hot: true },
            { x: 0.92, y: 0.19, text: "acromion", t: wf(37, "acromion"), side: "l" },
          ]} />
        <Facts x={760} y={0} w={1040}
          items={[
            { t: s_(36), text: "coracohumeral ligament: coracoid → humerus · supports the top of the capsule" },
            { t: wf(37, "coracoid"), text: "coracoid process + coracoacromial ligament + acromion", bg: C.matcha },
            { t: wf(37, "arch"), text: "= the CORACOACROMIAL ARCH", bg: C.forest },
            { t: s_(38), text: "stops the head of the humerus sliding UPWARD", bg: C.red },
          ]} />
      </Seg>
      <Seg t={t} a={k4} b={k5}>
        <Panel x={0} y={0} w={960} h={740} t={t} t0={k4}>
          <div style={abs(30, 40)}><JointSection t={t} w={900} lit={{ bursa: wf(39, "bursa"), acro: { a: wf(40, "acromion"), b: wf(40, "tendon") + 0.5 }, supra: wf(40, "tendon") }} /></div>
        </Panel>
        <Tag t={t} t0={wf(39, "bursa")} x={30} y={40} w={900} pt={JS.bursa} dx={-150} dy={-110} text="subacromial bursa" hot />
        <Tag t={t} t0={wf(40, "acromion")} x={30} y={40} w={900} pt={JS.acro} dx={230} dy={-80} text="acromion" />
        <Tag t={t} t0={wf(40, "tendon")} x={30} y={40} w={900} pt={JS.supra} dx={40} dy={200} text="supraspinatus" />
        <Tag t={t} t0={k4 + 0.6} x={30} y={40} w={900} pt={JS.delt} dx={0} dy={0} text="deltoid" size={26} />
        <Facts x={1020} y={0} w={780}
          items={[
            { t: s_(39), text: "under the arch: a small fluid-filled sac", bg: C.forest },
            { t: wf(39, "subacromial"), text: "= the SUBACROMIAL BURSA", bg: "#3E7FA6" },
            { t: s_(40), text: "between the acromion and a rotator cuff tendon" },
            { t: wf(40, "glide"), text: "lets that tendon GLIDE smoothly" },
          ]} />
      </Seg>
      <Seg t={t} a={k5} b={b + 0.1}>
        <div style={abs(0, 40, { display: "flex", gap: 30 })}>
          <div style={{ ...pop(t, wf(41, "mobility")), width: 520, height: 300, borderRadius: 36, background: C.card, border: `4px solid ${C.matcha}`, padding: 30, boxSizing: "border-box", fontFamily: FONT, fontWeight: 800 }}>
            <div style={{ fontSize: 34, color: C.matcha }}>BONES give</div>
            <div style={{ fontSize: 74, color: C.forest }}>mobility ✓</div>
          </div>
          <div style={{ ...pop(t, wf(41, "stability")), width: 520, height: 300, borderRadius: 36, background: C.card, border: `4px solid ${C.red}`, padding: 30, boxSizing: "border-box", fontFamily: FONT, fontWeight: 800 }}>
            <div style={{ fontSize: 34, color: C.red }}>but not much</div>
            <div style={{ fontSize: 74, color: C.forest }}>stability ✗</div>
          </div>
        </div>
        <div style={abs(0, 380, { width: 1070, ...pop(t, wf(41, "muscles")) })}>
          <div style={{ background: C.forest, borderRadius: 36, padding: "30px 40px", fontFamily: FONT, fontWeight: 800, color: C.paper, fontSize: 48, lineHeight: 1.15 }}>
            stability comes from <span style={{ color: C.banana }}>MUSCLES</span>
            <div style={{ fontSize: 64, color: C.banana, marginTop: 10, opacity: ramp(t, rc, rc + 0.4) }}>→ the ROTATOR CUFF</div>
          </div>
        </div>
        <div style={abs(1150, 40, pop(t, rc))}>
          <CuffRing t={t} w={640} show={ramp(t, rc, rc + 1.5)} />
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 4. MEET THE ROTATOR CUFF ================= */
export const SCuff: React.FC = () => {
  const t = useT();
  const a = ST(4), b = BE(4);
  const m1 = s_(45) - 0.2, m2 = s_(51) - 0.2, m3 = s_(53) - 0.2;
  const ins1 = wf(46, "greater"), ins2 = wf(48, "back"), ins3 = wf(50, "lowest");
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={m1}>
        <Panel x={0} y={0} w={760} h={740} t={t} t0={a}>
          <div style={abs(30, 40)}><Cuff t={t} w={700} view="back" lit={{ scap: { a: wf(43, "scapula"), b: wf(43, "end") }, hum: wf(43, "humerus"), head: wf(43, "humerus") }} muscles={ramp(t, wf(42, "four"), wf(42, "four") + 0.8)} tmaj={0} /></div>
          <ViewTag t={t} t0={a + 0.3} x={24} y={20} text="BACK VIEW" />
        </Panel>
        <div style={abs(800, 0)}><CuffRing t={t} w={560} show={ramp(t, wf(44, "wrap"), wf(44, "wrap") + 1.2)} letters={ramp(t, wf(44, "cuff"), wf(44, "cuff") + 0.4)} /></div>
        <Facts x={1380} y={0} w={420}
          items={[
            { t: s_(42), text: "muscles in the rotator cuff", bg: C.forest, big: "4" },
            { t: wf(43, "scapula"), text: "all START on the scapula" },
            { t: wf(43, "humerus"), text: "all END on top of the humerus" },
            { t: wf(44, "wrap"), text: "tendons blend with the capsule + WRAP the head like a cuff", bg: C.matcha },
          ]} />
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <KPlate {...CUFF} x={0} y={0} w={760} a={m1} b={m2}
          keys={[[m1, 1.0, 0.5, 0.5], [s_(45), 1.15, 0.7, 0.2], [s_(46), 1.15, 0.55, 0.15], [s_(47), 1.12, 0.7, 0.32], [s_(49), 1.15, 0.6, 0.35], [s_(50), 1.1, 0.5, 0.3]]}
          labels={[
            { x: 0.83, y: 0.12, text: "supraspinatus", t: wf(45, "supraspinatus"), side: "l", col: MC.supra, t1: wf(47, "infraspinatus") - 0.2 },
            { x: 0.42, y: 0.12, text: "greater tubercle", t: ins1, side: "r", hot: true },
            { x: 0.78, y: 0.31, text: "infraspinatus", t: wf(47, "infraspinatus"), side: "l", col: MC.infra, t1: wf(49, "teres") - 0.2 },
            { x: 0.62, y: 0.28, text: "teres minor", t: wf(49, "teres"), side: "l", col: MC.tmin },
            { x: 0.78, y: 0.48, text: "teres major · NOT cuff", t: wf(49, "narrow"), side: "l" },
          ]} />
        <Panel x={800} y={0} w={560} h={430} t={t} t0={m1 + 0.2}>
          <div style={abs(-20, -20)}><Cuff t={t} w={570} view="back" lit={{ supra: { a: wf(45, "supraspinatus"), b: s_(47) }, infra: { a: wf(47, "infraspinatus"), b: s_(49) }, tmin: wf(49, "teres") }} dim={0.55} tmaj={0.6} tendons={ramp(t, ins1, ins1 + 0.3)} /></div>
        </Panel>
        <div style={abs(800, 455, { display: "flex", flexDirection: "column", gap: 10 })}>
          <Row t={t} t0={wf(45, "supraspinatus")} n="1" col={MC.supra} title="Supraspinatus" sub={t >= ins1 ? "→ TOP of greater tubercle" : "above the spine"} w={560} size={32} />
          <Row t={t} t0={wf(47, "infraspinatus")} n="2" col={MC.infra} title="Infraspinatus" sub={t >= ins2 ? "→ BACK of greater tubercle" : "below the spine"} w={560} size={32} />
          <Row t={t} t0={wf(49, "teres")} n="3" col={MC.tmin} title="Teres minor" sub={t >= ins3 ? "→ LOWEST part of greater tubercle" : "lateral border"} w={560} size={32} />
        </div>
        <Facts x={1390} y={0} w={410}
          items={[
            { t: wf(45, "fossa"), text: "starts in the SUPRAspinous fossa" },
            { t: wf(46, "under"), text: "tendon passes UNDER the acromion", bg: C.red },
            { t: wf(47, "fills"), text: "fills the INFRAspinous fossa" },
            { t: wf(49, "small"), text: "small + narrow · along the LATERAL BORDER" },
          ]} />
      </Seg>
      <Seg t={t} a={m2} b={m3}>
        <KPlate {...SCF} x={0} y={0} w={480} a={m2} b={m3} keys={[[m2, 1.0, 0.5, 0.5], [wf(51, "subscapular", 1), 1.15, 0.45, 0.45]]}
          labels={[{ x: 0.3, y: 0.55, text: "subscapular fossa", t: wf(51, "subscapular", 1), side: "r", hot: true }]} />
        <ViewTag t={t} t0={m2 + 0.3} x={20} y={20} text="FRONT VIEW" />
        <Panel x={520} y={0} w={760} h={740} t={t} t0={m2 + 0.2}>
          <div style={abs(10, 60)}><Cuff t={t} w={740} view="front" lit={{ subs: wf(51, "subscapularis"), lt: wf(52, "lesser") }} tendons={ramp(t, wf(52, "lesser"), wf(52, "lesser") + 0.3)} /></div>
        </Panel>
        <Tag t={t} t0={wf(51, "subscapularis")} x={530} y={60} w={740} pt={CB.subs} dx={0} dy={0} text="subscapularis" col={MC.subs} />
        <Tag t={t} t0={wf(52, "lesser")} x={530} y={60} w={740} pt={CB.lt} dx={-30} dy={180} text="lesser tubercle" hot />
        <div style={abs(1320, 0, { display: "flex", flexDirection: "column", gap: 18 })}>
          <Row t={t} t0={wf(51, "subscapularis")} n="4" col={MC.subs} title="Subscapularis" sub="the only one in FRONT" w={480} size={40} />
          <div style={{ ...pop(t, wf(52, "lesser")), width: 480, background: C.forest, borderRadius: 28, padding: "22px 26px", boxSizing: "border-box", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper, lineHeight: 1.15 }}>the only one on the <span style={{ color: C.banana }}>LESSER tubercle</span></div>
        </div>
      </Seg>
      <Seg t={t} a={m3} b={b + 0.1}>
        <Panel x={0} y={0} w={880} h={560} t={t} t0={m3}>
          <div style={abs(40, -20)}><Cuff t={t} w={760} view="back" lit={{ supra: wf(53, "three"), infra: wf(53, "three") + 0.2, tmin: wf(53, "three") + 0.4, gt: wf(53, "greater") }} tmaj={0.3} tendons={1} /></div>
          <ViewTag t={t} t0={m3 + 0.2} x={24} y={20} text="BACK" />
        </Panel>
        <Panel x={920} y={0} w={880} h={560} t={t} t0={m3 + 0.2}>
          <div style={abs(40, -20)}><Cuff t={t} w={760} view="front" lit={{ subs: wf(53, "one"), lt: wf(53, "lesser") }} tendons={1} /></div>
          <ViewTag t={t} t0={m3 + 0.4} x={24} y={20} text="FRONT" />
        </Panel>
        <div style={abs(0, 590, { width: 880, ...pop(t, wf(53, "greater")) })}>
          <div style={{ background: C.forest, borderRadius: 28, padding: "20px 30px", fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.paper }}>3 on the back → <span style={{ color: C.banana }}>GREATER</span> tubercle</div>
        </div>
        <div style={abs(920, 590, { width: 880, ...pop(t, wf(53, "lesser")) })}>
          <div style={{ background: C.forest, borderRadius: 28, padding: "20px 30px", fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.paper }}>1 in front → <span style={{ color: C.banana }}>LESSER</span> tubercle</div>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 5. WHAT EACH MUSCLE DOES ================= */
export const SActions: React.FC = () => {
  const t = useT();
  const a = ST(5), b = BE(5);
  const m1 = s_(56) - 0.2, m2 = s_(58) - 0.2, m3 = s_(59) - 0.2;
  const ang = kv(t, [[wf(55, "abduction"), 0], [wf(55, "fifteen") + 0.6, 15], [m1 - 0.6, 15]]);
  const outT = wf(56, "laterally"), inT = wf(57, "medially");
  const rotOut = Math.max(0, Math.sin((t - outT) * 2.2)) * 55 * ramp(t, outT, outT + 0.3);
  const rotIn = Math.max(0, Math.sin((t - inT) * 2.2)) * 55 * ramp(t, inT, inT + 0.3);
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={m1}>
        <Panel x={0} y={0} w={760} h={740} t={t} t0={a}>
          <div style={abs(60, 30)}><ArmRaise t={t} w={640} ang={ang} hi={{ supra: wf(55, "supraspinatus") }} /></div>
          <ViewTag t={t} t0={a + 0.2} x={24} y={20} text="FROM BEHIND" />
        </Panel>
        <div style={abs(820, 0)}><Row t={t} t0={wf(55, "supraspinatus")} n="S" col={MC.supra} title="Supraspinatus" sub="starts ABDUCTION" w={980} size={56} /></div>
        <Facts x={820} y={170} w={980}
          items={[
            { t: wf(55, "lifting"), text: "abduction = lifting the arm OUT TO THE SIDE" },
            { t: wf(55, "fifteen"), text: "for about the first 15 degrees", big: "0–15°", bg: C.forest },
          ]} />
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <Panel x={0} y={0} w={560} h={740} t={t} t0={m1}>
          <div style={abs(20, 60)}><RotateTop t={t} w={520} rot={t < inT - 0.3 ? rotOut : -rotIn} mode={t < inT - 0.3 ? "out" : "in"} col={t < inT - 0.3 ? MC.infra : "#8B6BB0"} /></div>
          <div style={abs(30, 560, { fontFamily: FONT, fontWeight: 800, fontSize: 44, color: t < inT - 0.3 ? "#3E7FA6" : "#7A55A6" })}>{t < inT - 0.3 ? "turn OUT = lateral rotation" : "turn IN = medial rotation"}</div>
        </Panel>
        <Panel x={600} y={0} w={560} h={470} t={t} t0={m1 + 0.2}>
          <div style={abs(-20, -10)}><Cuff t={t} w={600} view="back" lit={{ infra: { a: wf(56, "infraspinatus"), b: s_(57) }, tmin: { a: wf(56, "teres"), b: s_(57) } }} dim={0.5} tmaj={0} /></div>
        </Panel>
        <Panel x={1200} y={0} w={600} h={470} t={t} t0={s_(57)}>
          <div style={abs(-10, -10)}><Cuff t={t} w={620} view="front" lit={{ subs: wf(57, "subscapularis") }} dim={0.5} /></div>
        </Panel>
        <div style={abs(600, 500)}><Row t={t} t0={wf(56, "infraspinatus")} n="I+T" col={MC.infra} title="Infraspinatus + teres minor" sub="BACK · lateral rotation (turn OUT)" w={560} size={32} /></div>
        <div style={abs(1200, 500)}><Row t={t} t0={wf(57, "subscapularis")} n="S" col={MC.subs} title="Subscapularis" sub="FRONT · medial rotation (turn IN)" w={600} size={32} /></div>
      </Seg>
      <Seg t={t} a={m2} b={m3}>
        <Panel x={0} y={0} w={880} h={740} t={t} t0={m2}>
          <div style={abs(30, 60)}><JointSection t={t} w={820} lit={{ head: wf(58, "head") }} down={ramp(t, wf(58, "tight"), wf(58, "tight") + 0.3)} delt={0.3} bursa={0.3} /></div>
        </Panel>
        <div style={abs(920, 0)}><CuffRing t={t} w={520} letters={1} squeeze={ramp(t, wf(58, "tight"), wf(58, "tight") + 0.4)} lit={{ supra: wf(58, "four"), infra: wf(58, "four"), tmin: wf(58, "four"), subs: wf(58, "four") }} /></div>
        <div style={abs(920, 540, { width: 880, ...pop(t, wf(58, "job")) })}>
          <div style={{ background: C.forest, borderRadius: 30, padding: "22px 30px", fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.paper, lineHeight: 1.15 }}>all 4: hold the head <span style={{ color: C.banana }}>TIGHT</span> in the glenoid cavity</div>
        </div>
      </Seg>
      <Seg t={t} a={m3} b={b + 0.1}>
        <KPlate {...NERV} x={0} y={0} w={940} a={m3} b={b}
          keys={[[m3, 1.0, 0.5, 0.5], [s_(60), 1.12, 0.35, 0.3], [s_(61), 1.12, 0.55, 0.42], [s_(63), 1.03, 0.5, 0.5]]}
          labels={[
            { x: 0.3, y: 0.14, text: "suprascapular nerve", t: wf(60, "suprascapular"), side: "r", hot: true },
            { x: 0.12, y: 0.22, text: "supraspinatus", t: wf(60, "supraspinatus"), side: "r", col: MC.supra },
            { x: 0.22, y: 0.47, text: "infraspinatus", t: wf(60, "infraspinatus"), side: "r", col: MC.infra },
            { x: 0.57, y: 0.42, text: "axillary nerve", t: wf(61, "axillary"), side: "r", hot: true },
            { x: 0.47, y: 0.45, text: "teres minor", t: wf(61, "teres"), side: "l", col: MC.tmin },
            { x: 0.71, y: 0.56, text: "deltoid", t: wf(61, "deltoid"), side: "r", col: MC.delt },
          ]} />
        <ViewTag t={t} t0={m3 + 0.3} x={20} y={20} text="BACK VIEW · NERVES IN YELLOW" />
        <div style={abs(990, 0, { display: "flex", flexDirection: "column", gap: 16 })}>
          <Row t={t} t0={wf(60, "suprascapular")} n="SS" col={C.banana} title="Suprascapular n." sub="supraspinatus + infraspinatus" w={810} size={40} />
          <Row t={t} t0={wf(61, "axillary")} n="AX" col={C.banana} title="Axillary n." sub="teres minor (+ the deltoid)" w={810} size={40} />
          <Row t={t} t0={wf(62, "subscapular")} n="SUB" col={C.banana} title="Subscapular nn." sub="subscapularis" w={810} size={40} />
          <div style={{ ...pop(t, wf(63, "brachial")), marginTop: 10, width: 810, background: C.forest, borderRadius: 28, padding: "20px 28px", boxSizing: "border-box", fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.paper }}>
            all from the <span style={{ color: C.banana }}>brachial plexus</span>
            <div style={{ fontSize: 34, color: C.matchaLight, marginTop: 6, opacity: ramp(t, wf(63, "fifth"), wf(63, "fifth") + 0.4) }}>mainly C5 + C6</div>
          </div>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 6. HOW IT ALL WORKS TOGETHER ================= */
export const STogether: React.FC = () => {
  const t = useT();
  const a = ST(6), b = BE(6);
  const t1 = s_(65), t2 = s_(66), t3 = s_(67), t5 = s_(69), t6 = s_(70);
  const ang = kv(t, [[a, 0], [t1 + 0.3, 0], [e_(65), 15], [t2 + 0.3, 15], [e_(66), 90], [t3 + 0.3, 90], [e_(68), 170], [t5, 170], [t5 + 1.5, 90]]);
  const ranges: [string, string, string, number, number, string][] = [
    ["0 → 15°", "supraspinatus", "starts the movement", t1, t2, MC.supra],
    ["15 → 90°", "deltoid (middle fibers)", "takes over", t2, t3, MC.delt],
    ["above 90°", "scapula rotates · socket turns up", "trapezius + serratus anterior", t3, t5, MC.trap],
  ];
  return (
    <Stage a={a} b={b}>
      <Panel x={0} y={0} w={760} h={740} t={t} t0={a}>
        <div style={abs(60, 30)}><ArmRaise t={t} w={640} ang={ang} hi={{ supra: { a: t1, b: t2 }, delt: { a: t2, b: t3 }, scap: { a: t3, b: t5 }, trap: { a: wf(68, "trapezius"), b: t5 }, serr: { a: wf(68, "serratus"), b: t5 } }} cuffPull={ramp(t, t5, t5 + 0.4)} /></div>
        <ViewTag t={t} t0={a + 0.2} x={24} y={20} text="FROM BEHIND · RAISING THE ARM TO THE SIDE" />
      </Panel>
      <div style={abs(800, 0, { display: "flex", flexDirection: "column", gap: 16 })}>
        {ranges.map(([r, m, s, ta, tb, col]) => {
          const on = t >= ta && t < tb + 0.2 ? 1 : 0;
          return (
            <div key={r} style={{ ...pop(t, ta), width: 1000, display: "flex", alignItems: "center", gap: 24, background: on ? C.forest : C.card, border: `4px solid ${on ? C.forest : C.line}`, borderRadius: 28, padding: "14px 24px", boxSizing: "border-box", fontFamily: FONT, fontWeight: 800, transformOrigin: "0% 50%" }}>
              <div style={{ minWidth: 230, fontSize: 48, color: on ? C.banana : C.forest }}>{r}</div>
              <div style={{ width: 22, height: 70, borderRadius: 10, background: col, border: `3px solid ${C.forest}` }} />
              <div>
                <div style={{ fontSize: 38, color: on ? C.paper : C.forest }}>{m}</div>
                <div style={{ fontSize: 30, color: on ? C.matchaLight : C.matcha }}>{s}</div>
              </div>
            </div>
          );
        })}
      </div>
      {t >= t5 - 0.3 && (
        <Panel x={800} y={420} w={480} h={320} t={t} t0={t5 - 0.2}>
          <div style={abs(-10, 10)}><JointSection t={t} w={500} down={ramp(t, t5 + 0.3, t5 + 0.6)} lit={{ supra: t5 }} bursa={0.4} /></div>
        </Panel>
      )}
      <div style={abs(1310, 430, { width: 490, display: "flex", flexDirection: "column", gap: 16 })}>
        <div style={{ ...pop(t, wf(69, "down")), background: C.card, border: `3px solid ${C.line}`, borderRadius: 26, padding: "16px 22px", fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.forest }}>cuff pulls the head DOWN + IN, so the deltoid can't jam it up</div>
        <div style={{ ...pop(t, t6), background: C.banana, borderRadius: 26, padding: "16px 22px", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.forest }}>deltoid = POWER<br />rotator cuff = CONTROL</div>
      </div>
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
  const names: [string, string, number][] = [
    ["Supraspinatus", "supra", wf(73, "supraspinatus")],
    ["Infraspinatus", "infra", wf(73, "infraspinatus")],
    ["Teres minor", "tmin", wf(73, "teres")],
    ["Subscapularis", "subs", wf(73, "subscapularis")],
  ];
  const ord = wf(74, "order");
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(75) - 0.2}>
        <TrickCard t={t} t0={a} n={1} title="The classic: they spell SITS">
          <div style={abs(60, 180, { display: "flex", gap: 22 })}>
            {"SITS".split("").map((L, i) => (
              <div key={i} style={{ ...pop(t, wf(72, "sits") + i * 0.12), width: 130, height: 150, borderRadius: 26, background: MC[names[i][1]], border: `4px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 110, color: C.forest }}>{L}</div>
            ))}
          </div>
          <div style={abs(60, 360, { display: "flex", flexDirection: "column", gap: 2 })}>
            {names.map(([n, k, tt]) => (
              <div key={n} style={{ ...pop(t, tt), display: "flex", alignItems: "center", gap: 16, fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper, transformOrigin: "0% 50%" }}>
                <div style={{ width: 26, height: 26, borderRadius: 13, background: MC[k] }} />
                <FL w={n} on={t >= tt ? 1 : 0} col={MC[k]} />
              </div>
            ))}
          </div>
          <div style={abs(1090, 120, { width: 660, height: 600, borderRadius: 36, background: C.card })}>
            <div style={abs(40, 20)}><CuffRing t={t} w={580} letters={ramp(t, wf(72, "sits"), wf(72, "sits") + 0.4)} lit={{ supra: { a: names[0][2], b: names[1][2] }, infra: { a: names[1][2], b: names[2][2] }, tmin: { a: names[2][2], b: names[3][2] }, subs: { a: names[3][2], b: ord } }} dim={0.8} /></div>
            {t >= ord - 0.2 && (
              <svg style={abs(40, 20, { overflow: "visible", opacity: ramp(t, ord, ord + 0.4) })} width={580} height={580} viewBox="0 0 700 700">
                <path d="M350 70 A 280 280 0 0 0 110 520" fill="none" stroke={C.red} strokeWidth={10} strokeDasharray="16 12" strokeDashoffset={-t * 60} />
                <path d="M300 640 C 420 690, 560 640, 640 420" fill="none" stroke={C.red} strokeWidth={10} strokeDasharray="16 12" strokeDashoffset={-t * 60} />
              </svg>
            )}
          </div>
          <div style={abs(60, 672, { opacity: ramp(t, ord, ord + 0.4), fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.banana })}>order on the humerus: top → bottom, back → front</div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={s_(75) - 0.2} b={s_(76) - 0.2}>
        <TrickCard t={t} t0={s_(75) - 0.2} n={2} title="The tubercles: S-I-T sits on the greater">
          <div style={abs(60, 170, { width: 820, height: 520, borderRadius: 36, background: C.card, overflow: "hidden" })}>
            <div style={abs(10, -10)}><Cuff t={t} w={780} view="back" lit={{ gt: wf(75, "greater") }} tmaj={0} tendons={ramp(t, wf(75, "sits"), wf(75, "sits") + 0.4)} /></div>
            <div style={abs(30, 440)}><Chip t={t} t0={wf(75, "greater")} bg={C.forest} size={36}>S · I · T → GREATER tubercle</Chip></div>
          </div>
          <div style={abs(920, 170, { width: 820, height: 520, borderRadius: 36, background: C.card, overflow: "hidden", ...pop(t, wf(75, "last")) })}>
            <div style={abs(10, -10)}><Cuff t={t} w={780} view="front" lit={{ lt: wf(75, "lesser"), subs: wf(75, "last") }} tendons={1} /></div>
            <div style={abs(30, 440)}><Chip t={t} t0={wf(75, "lesser")} bg={C.forest} size={36}>last S → alone to the LESSER</Chip></div>
          </div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={s_(76) - 0.2} b={s_(77) - 0.2}>
        <TrickCard t={t} t0={s_(76) - 0.2} n={3} title="Rotation: back turns OUT, front turns IN">
          {(() => {
            const o = wf(76, "out"), i = wf(76, "in");
            return (
              <>
                <div style={abs(60, 170, { width: 820, height: 520, borderRadius: 36, background: C.card, ...pop(t, wf(76, "back")) })}>
                  <div style={abs(190, 20)}><RotateTop t={t} w={440} rot={Math.max(0, Math.sin((t - o) * 2.4)) * 55 * ramp(t, o, o + 0.3)} mode="out" col="#3E7FA6" /></div>
                  <div style={abs(40, 440, { fontFamily: FONT, fontWeight: 800, fontSize: 40, color: "#3E7FA6" })}>BACK muscles (I + T) → OUT</div>
                </div>
                <div style={abs(920, 170, { width: 820, height: 520, borderRadius: 36, background: C.card, ...pop(t, wf(76, "front")) })}>
                  <div style={abs(190, 20)}><RotateTop t={t} w={440} rot={-Math.max(0, Math.sin((t - i) * 2.4)) * 55 * ramp(t, i, i + 0.3)} mode="in" col="#7A55A6" /></div>
                  <div style={abs(40, 440, { fontFamily: FONT, fontWeight: 800, fontSize: 40, color: "#7A55A6" })}>FRONT muscle (subscapularis) → IN</div>
                </div>
              </>
            );
          })()}
        </TrickCard>
      </Seg>
      <Seg t={t} a={s_(77) - 0.2} b={s_(79) - 0.2}>
        <TrickCard t={t} t0={s_(77) - 0.2} n={4} title="The nerves follow the names">
          <div style={abs(60, 190, { display: "flex", flexDirection: "column", gap: 26 })}>
            {([
              [<><span style={{ color: MC.supra }}>SUPRA</span>spinatus + <span style={{ color: MC.infra }}>INFRA</span>spinatus</>, <><span style={{ color: C.banana }}>SUPRA</span>scapular nerve</>, wf(77, "two")],
              [<><span style={{ color: MC.subs }}>SUB</span>scapularis</>, <><span style={{ color: C.banana }}>SUB</span>scapular nerves</>, wf(77, "subscapularis") - 0.2],
              [<><span style={{ color: MC.tmin }}>Teres minor</span> + <span style={{ color: MC.delt }}>deltoid</span></>, <><span style={{ color: C.banana }}>AXILLARY</span> nerve</>, wf(78, "teres")],
            ] as [React.ReactNode, React.ReactNode, number][]).map(([l, r, tt], i) => (
              <div key={i} style={{ ...pop(t, tt), display: "flex", alignItems: "center", gap: 30, fontFamily: FONT, fontWeight: 800, transformOrigin: "0% 50%" }}>
                <div style={{ width: 760, background: "rgba(247,246,236,0.08)", border: `3px solid ${C.matcha}`, borderRadius: 26, padding: "22px 28px", fontSize: 46, color: C.paper }}>{l}</div>
                <div style={{ fontSize: 60, color: C.matchaLight }}>→</div>
                <div style={{ width: 720, background: "rgba(247,246,236,0.08)", border: `3px solid ${C.banana}`, borderRadius: 26, padding: "22px 28px", fontSize: 46, color: C.paper }}>{r}</div>
              </div>
            ))}
          </div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={s_(79) - 0.2} b={b + 0.1}>
        <div style={abs(40, 40)}>
          <StudyCard t={t} flip={wf(79, "flip") - 0.1} w={900}
            front={
              <div style={{ position: "relative", width: 840, height: 540 }}>
                <div style={{ position: "absolute", left: 20, top: 0, fontSize: 40, color: C.matcha }}>Name the muscle</div>
                <div style={{ position: "absolute", left: 160, top: 40 }}>
                  <Cuff t={t} w={560} view="back" lit={{ infra: s_(79) }} dim={0.55} tmaj={0} />
                </div>
              </div>
            }
            back={"Infraspinatus\nturns the arm OUT\nsuprascapular nerve"} />
        </div>
        <div style={abs(1020, 80, { width: 760 })}>
          <div style={pop(t, s_(79))}><Big size={70}>Test yourself</Big></div>
          <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 18 }}>
            <div><Chip t={t} t0={wf(79, "look")} bg={C.card} color={C.forest} size={40}>1 · look at the picture</Chip></div>
            <div><Chip t={t} t0={wf(79, "name")} bg={C.matcha} size={40}>2 · name the muscle</Chip></div>
            <div><Chip t={t} t0={wf(79, "flip")} bg={C.forest} size={40}>3 · flip the card to check</Chip></div>
          </div>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 8. QUIZ ================= */
type Q = { n: number; si: number; q: string; a: string; visual: (t: number, r: number, ans: number) => React.ReactNode };
const QS: Q[] = [
  {
    n: 1, si: 81, q: "Which bone is the only long bone that lies horizontally?", a: "The clavicle",
    visual: (t, r, ans) => (
      <div style={abs(40, 20)}><ShoulderFront t={t} w={920} lit={r ? { clav: ans } : {}} dim={r ? 0.5 : 1} /></div>
    ),
  },
  {
    n: 2, si: 83, q: "What ring of fibrocartilage deepens the glenoid cavity?", a: "The glenoid labrum",
    visual: (t, r, ans) => (
      <>
        <div style={abs(20, 60)}><JointSection t={t} w={940} lit={r ? { lab: ans } : {}} dim={r ? 0.6 : 1} supra={0.3} delt={0.3} bursa={0.3} /></div>
        {r ? <Tag t={t} t0={ans} x={20} y={60} w={940} pt={JS.lab} dx={170} dy={-90} text="glenoid labrum" hot /> : <div style={abs(250, 230, { fontFamily: FONT, fontWeight: 800, fontSize: 120, color: C.red })}>?</div>}
      </>
    ),
  },
  {
    n: 3, si: 85, q: "Which rotator cuff muscle starts abduction of the arm?", a: "Supraspinatus",
    visual: (t, r, ans) => (
      <div style={abs(200, 10)}><ArmRaise t={t} w={660} ang={r ? kv(t, [[ans, 0], [ans + 0.8, 15]]) : 0} hi={r ? { supra: ans } : {}} /></div>
    ),
  },
  {
    n: 4, si: 87, q: "Which rotator cuff muscle inserts on the lesser tubercle?", a: "Subscapularis",
    visual: (t, r, ans) => (
      <div style={abs(60, 40)}><Cuff t={t} w={860} view="front" lit={r ? { subs: ans, lt: ans } : { lt: s_(87) + 1 }} tendons={r ? ramp(t, ans, ans + 0.3) : 0} muscles={r ? 1 : 0.15} /></div>
    ),
  },
  {
    n: 5, si: 89, q: "Which nerve supplies the teres minor?", a: "The axillary nerve",
    visual: (t, r, ans) => (
      <KPlate {...NERV} x={0} y={60} w={960} a={s_(89) - 0.2} b={s_(91) - 0.2} keys={[[s_(89) - 0.2, 1.1, 0.5, 0.4]]}
        labels={[{ x: 0.47, y: 0.45, text: "teres minor", t: s_(89) + 0.5, side: "l", col: MC.tmin }, ...(r ? [{ x: 0.57, y: 0.42, text: "axillary nerve", t: ans, side: "r" as const, hot: true }] : [])]} />
    ),
  },
];
export const SQuiz: React.FC = () => {
  const t = useT();
  const a = ST(8), b = BE(8);
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(81) - 0.2}>
        <div style={abs(0, 0, { width: 1800, height: 740, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" })}>
          <div style={pop(t, a)}><Big size={150}>QUIZ</Big></div>
          <div style={{ marginTop: 20 }}><Chip t={t} t0={wf(80, "pause")} bg={C.banana} color={C.forest} size={44}>5 questions · pause if you need more time</Chip></div>
        </div>
      </Seg>
      {QS.map((q, i) => {
        const ask = s_(q.si), pause = e_(q.si), ans = s_(q.si + 1);
        const end = i < QS.length - 1 ? s_(QS[i + 1].si) - 0.2 : s_(91) - 0.2;
        const reveal = t >= ans ? 1 : 0;
        const cdT = t - (pause + 0.2);
        const n = cdT < 0 ? null : cdT < 1.0 ? 3 : cdT < 2.0 ? 2 : cdT < 3.0 ? 1 : null;
        const cdK = n ? ramp(t, pause + 0.2 + (3 - n), pause + 0.2 + (3 - n) + 0.18) : 0;
        return (
          <Seg key={q.n} t={t} a={ask - 0.2} b={end}>
            {q.visual(t, reveal, ans)}
            <div style={abs(1040, 0, { width: 760, height: 740, borderRadius: 44, background: C.forest, ...pop(t, ask - 0.15, 0.35) })}>
              <div style={abs(50, 46, { fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: C.banana })}>QUESTION {q.n} / 5</div>
              <div style={abs(50, 110, { width: 660, fontFamily: FONT, fontWeight: 800, fontSize: 54, lineHeight: 1.12, color: C.paper })}>{q.q}</div>
              {n && <div style={abs(0, 470, { width: 760, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 190, lineHeight: 1, color: C.banana, transform: `scale(${1.35 - 0.35 * cdK})` })}>{n}</div>}
              {reveal > 0 && (
                <div style={abs(50, 520, { ...pop(t, ans), width: 660, background: C.banana, borderRadius: 26, padding: "20px 30px 26px", boxSizing: "border-box", fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.forest, textAlign: "center" })}>✓ {q.a}</div>
              )}
            </div>
          </Seg>
        );
      })}
      <Seg t={t} a={s_(91) - 0.2} b={b + 0.1}>
        <div style={abs(0, 0, { width: 1800, height: 740, borderRadius: 44, background: C.card, border: `4px solid ${C.line}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" })}>
          <Big size={110}>Your score: <span style={{ color: C.matcha }}>? / 5</span></Big>
          <div style={{ marginTop: 30 }}><Chip t={t} t0={wf(91, "tell")} bg={C.forest} size={46}>tell me in the comments</Chip></div>
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
    ["3 bones", "clavicle · scapula · humerus", Math.max(a, s_(93)), "#F4ECD2"],
    ["4 joints", "sternoclavicular · acromioclavicular · scapulothoracic · glenohumeral", s_(94), C.red],
    ["Socket", "shallow · deepened by the labrum · coracoacromial arch above", s_(95), "#BFD9E6"],
    ["SITS", "S-I-T → greater tubercle · S → lesser tubercle", s_(96), MC.supra],
    ["Actions", "supra: starts abduction · I + T: turn out · subscap: turn in", s_(97), MC.infra],
    ["Together", "they hold the ball in the socket", s_(98), MC.tmin],
  ];
  const ot = s_(99) - 0.2;
  const outro = ramp(t, ot, ot + 0.5);
  return (
    <Stage a={a} b={END - 0.3}>
      {outro < 1 && (
        <div style={abs(0, 0, { width: 1800, height: 740, borderRadius: 44, background: C.forest })}>
          <div style={abs(70, 40, { fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 8, color: C.banana })}>RECAP</div>
          <div style={abs(70, 110, { display: "flex", flexDirection: "column", gap: 20 })}>
            {items.map(([h, s, tt, col]) => (
              <div key={h} style={{ ...pop(t, tt), display: "flex", alignItems: "center", gap: 24, fontFamily: FONT, fontWeight: 800, transformOrigin: "0% 50%" }}>
                <div style={{ width: 60, height: 60, borderRadius: 30, background: col, border: `4px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: C.forest, flexShrink: 0 }}>✓</div>
                <div style={{ width: 230, fontSize: 46, color: C.paper, flexShrink: 0 }}>{h}</div>
                <div style={{ fontSize: 32, color: C.matchaLight, width: 940 }}>{s}</div>
              </div>
            ))}
          </div>
          <div style={abs(1420, 250, { opacity: ramp(t, s_(96), s_(96) + 0.5) })}>
            <CuffRing t={t} w={340} letters={1} squeeze={ramp(t, s_(98), s_(98) + 0.4)} />
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
              <div style={{ background: C.red, color: C.paper, borderRadius: 50, padding: "18px 54px 22px", fontSize: 54, letterSpacing: 3, transform: `scale(${1 + 0.05 * Math.max(0, Math.sin((t - ot) * 5))})`, opacity: ramp(t, wf(99, "subscribe"), wf(99, "subscribe") + 0.3) }}>SUBSCRIBE</div>
            </div>
            <div style={{ marginTop: 40, background: C.paper, color: C.forest, borderRadius: 24, padding: "16px 30px 20px", fontSize: 40, opacity: ramp(t, s_(100), s_(100) + 0.4), width: "fit-content" }}>Which part of the body should we learn next?</div>
          </div>
        </div>
      )}
    </Stage>
  );
};
