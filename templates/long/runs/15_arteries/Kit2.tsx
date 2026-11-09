import React from "react";
import { Img, staticFile } from "remotion";
import { C, FONT, ramp, useT } from "./kit";
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
export const Arrow: React.FC<{ t: number; t0: number; x: number; y: number; dir: "l" | "r" | "u" | "d"; label?: string; col?: string; size?: number }> = ({ t, t0, x, y, dir, label, col = C.red, size = 110 }) => {
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
export const Panel: React.FC<{ x: number; y: number; w: number; h: number; t: number; t0: number; children: React.ReactNode; bg?: string }> = ({ x, y, w, h, t, t0, children, bg = C.card }) => (
  <div style={abs(x, y, { width: w, height: h, borderRadius: 36, background: bg, boxShadow: `0 0 0 4px ${C.line}, 0 18px 40px rgba(31,42,20,0.10)`, overflow: "hidden", ...pop(t, t0, 0.35) })}>{children}</div>
);
/** numbered row card (muscle / joint) */
export const Row: React.FC<{ t: number; t0: number; n: string; col: string; title: string; sub?: string; w?: number; size?: number }> = ({ t, t0, n, col, title, sub, w = 700, size = 40 }) => (
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

export const TrickCard: React.FC<{ t: number; t0: number; n: number; title: string; children: React.ReactNode }> = ({ t, t0, n, title, children }) => (
  <div style={abs(0, 0, { width: 1800, height: 740, borderRadius: 44, background: C.forest, overflow: "hidden", ...pop(t, t0, 0.35) })}>
    <div style={abs(60, 40, { fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: C.matchaLight })}>TRICK {n}</div>
    <div style={abs(60, 80, { fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.paper })}>{title}</div>
    {children}
  </div>
);
export const FL: React.FC<{ w: string; on: number; col?: string }> = ({ w, on, col = C.banana }) => (
  <span><span style={{ color: on ? col : C.paper, textShadow: on ? `0 0 18px ${C.bananaDark}` : "none", fontSize: "1.25em" }}>{w[0]}</span>{w.slice(1)}</span>
);
/** animated value between keyframes [time, value] */
export const kv = (t: number, ks: [number, number][]) => {
  if (t <= ks[0][0]) return ks[0][1];
  for (let i = 0; i < ks.length - 1; i++) {
    if (t < ks[i + 1][0]) return ks[i][1] + (ks[i + 1][1] - ks[i][1]) * ramp(t, ks[i][0], ks[i + 1][0]);
  }
  return ks[ks.length - 1][1];
};




export const StudyCard: React.FC<{ t: number; flip: number; front: React.ReactNode; back: string; w?: number }> = ({ t, flip, front, back, w = 560 }) => {
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
