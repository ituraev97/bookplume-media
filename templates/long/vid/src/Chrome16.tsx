import React from "react";
import { C, FONT, ramp, useT } from "./kit";
import { WORDS } from "./words";
import { CHAPTERS, END } from "./timeline";
import { SERIES, TOPIC, KEYWORDS } from "./meta";

export const W = 1920, H = 1080;

export const LogoMark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    {[13, 23, 42].map((x) => (
      <rect key={x} x={x} y={17} width={9} height={34} rx={4.5} fill={C.paper} />
    ))}
    <rect x={31} y={13} width={9} height={38} rx={4.5} fill={C.banana} transform="rotate(16 35.5 51)" />
  </svg>
);

export const chapterAt = (t: number) => {
  let ci = 0;
  CHAPTERS.forEach((c, i) => {
    if (t >= c.s - 0.05) ci = i;
  });
  return ci;
};

export const Grid16: React.FC = () => {
  const t = useT();
  const o = (t * 30) % 60;
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <pattern id="g16" width={60} height={60} patternUnits="userSpaceOnUse" patternTransform={`translate(${o} ${o * 0.4})`}>
          <circle cx={30} cy={30} r={2.4} fill={C.matcha} opacity={0.12} />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="url(#g16)" />
    </svg>
  );
};

export const Header16: React.FC = () => {
  const t = useT();
  const ci = chapterAt(t);
  const ch = CHAPTERS[ci];
  const sw = ci === 0 ? 1 : ramp(t, ch.s, ch.s + 0.4);
  return (
    <div style={{ position: "absolute", left: 60, top: 30, width: 1800, height: 110, fontFamily: FONT }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 72, height: 72, borderRadius: 36, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 3px ${C.paper}, 0 0 0 6px ${C.matcha}` }}>
        <LogoMark size={54} />
      </div>
      <div style={{ position: "absolute", left: 92, top: 2, fontWeight: 800, fontSize: 34, color: C.forest }}>Book Plume</div>
      <div style={{ position: "absolute", left: 92, top: 44, fontWeight: 700, fontSize: 22, color: C.matcha }}>
        {SERIES} · {TOPIC}
      </div>
      <div style={{ position: "absolute", right: 0, top: 2, textAlign: "right", opacity: sw, transform: `translateY(${(1 - sw) * 10}px)` }}>
        <div style={{ fontWeight: 800, fontSize: 20, color: C.matcha, letterSpacing: 3 }}>{ci === 0 ? "INTRO" : `CHAPTER ${ci} / ${CHAPTERS.length - 1}`}</div>
        <div style={{ fontWeight: 800, fontSize: 32, color: C.forest }}>{ch.title}</div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 92, width: 1800, height: 8, display: "flex", gap: 6 }}>
        {CHAPTERS.map((c, i) => {
          const e = i < CHAPTERS.length - 1 ? CHAPTERS[i + 1].s : END;
          const p = i < ci ? 1 : i > ci ? 0 : ramp(t, c.s, e);
          return (
            <div key={i} style={{ flex: e - c.s, height: 8, borderRadius: 4, background: C.line, overflow: "hidden" }}>
              <div style={{ width: `${p * 100}%`, height: "100%", background: i === ci ? C.matcha : C.matchaDark }} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const KEY = new Set(KEYWORDS.split(" "));
const norm = (w: string) => w.toLowerCase().replace(/[.,?!:]/g, "");
type Chunk = { words: typeof WORDS; s: number; e: number };
const CHUNKS: Chunk[] = (() => {
  const out: Chunk[] = [];
  let cur: typeof WORDS = [];
  WORDS.forEach((w, i) => {
    cur.push(w);
    const next = WORDS[i + 1];
    const chars = cur.reduce((a, x) => a + x.w.length + 1, 0);
    const over = next ? chars + next.w.length > 44 : false;
    const punct = /[.?!]$/.test(w.w);
    const comma = /,$/.test(w.w);
    const gap = next ? next.s - w.e : 9;
    if (!next || punct || (comma && cur.length >= 4) || gap > 0.45 || cur.length >= 8 || over) {
      out.push({ words: cur, s: cur[0].s, e: w.e });
      cur = [];
    }
  });
  return out;
})();

export const Subs16: React.FC = () => {
  const t = useT();
  let idx = -1;
  CHUNKS.forEach((c, i) => {
    if (t >= c.s - 0.12) idx = i;
  });
  if (idx < 0) return null;
  const c = CHUNKS[idx];
  const next = CHUNKS[idx + 1];
  if (t > c.e + 0.8 && (!next || t < next.s - 0.12)) return null;
  const pop = ramp(t, c.s - 0.12, c.s + 0.05);
  return (
    <div style={{ position: "absolute", left: 0, width: W, top: 935, height: 90, display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ background: C.forest, borderRadius: 24, padding: "10px 30px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 44, whiteSpace: "nowrap", transform: `scale(${0.94 + 0.06 * pop})`, boxShadow: "0 8px 0 rgba(31,42,20,0.15)" }}>
        {c.words.map((w, i) => {
          const said = t >= w.s;
          const key = KEY.has(norm(w.w));
          return (
            <span key={i} style={{ display: "inline-block", marginRight: i < c.words.length - 1 ? 12 : 0, color: key ? C.banana : C.paper, opacity: said ? 1 : 0.35, borderBottom: `4px solid ${key && said ? C.banana : "transparent"}` }}>
              {w.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/** Full-stage chapter card for ~2.4 s at the start of each chapter (except intro) */
export const ChapterCard: React.FC = () => {
  const t = useT();
  const ci = chapterAt(t);
  if (ci === 0) return null;
  const ch = CHAPTERS[ci];
  const a = ramp(t, ch.s - 0.05, ch.s + 0.3) * (1 - ramp(t, ch.s + 2.1, ch.s + 2.5));
  if (a <= 0) return null;
  const k = ramp(t, ch.s, ch.s + 0.45);
  return (
    <div style={{ position: "absolute", left: 60, top: 160, width: 1800, height: 740, borderRadius: 44, background: C.forest, opacity: a, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT }}>
      <div style={{ fontWeight: 800, fontSize: 34, letterSpacing: 8, color: C.banana, transform: `translateY(${(1 - k) * 30}px)` }}>CHAPTER {ci}</div>
      <div style={{ fontWeight: 800, fontSize: 120, color: C.paper, letterSpacing: -2, transform: `scale(${0.9 + 0.1 * k})` }}>{ch.title}</div>
      <div style={{ width: 300 * k, height: 12, borderRadius: 6, background: C.banana, marginTop: 20 }} />
    </div>
  );
};

/** stage block visible between a and b, with slow push + drift */
export const Stage: React.FC<{ a: number; b: number; children: React.ReactNode }> = ({ a, b, children }) => {
  const t = useT();
  if (t < a - 0.1 || t > b + 0.4) return null;
  const i = ramp(t, a, a + 0.45), o = ramp(t, b - 0.1, b + 0.3);
  const s = 1 + 0.035 * ramp(t, a, b);
  return (
    <div style={{ position: "absolute", left: 60, top: 160, width: 1800, height: 740, opacity: i * (1 - o), transform: `translate(${Math.sin(t * 0.9) * 10 + (1 - i) * 60}px, ${Math.sin(t * 0.7) * 4}px) scale(${s})`, transformOrigin: "50% 50%" }}>
      {children}
    </div>
  );
};

/** Right-column fact cards that stack as narration reaches them */
export const Facts: React.FC<{ items: { t: number; text: string; bg?: string; big?: string }[]; x?: number; y?: number; w?: number; until?: number }> = ({ items, x = 1100, y = 20, w = 680 }) => {
  const t = useT();
  const shown = items.filter((it) => t >= it.t - 0.1);
  const last = shown.slice(-4);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, display: "flex", flexDirection: "column", gap: 18 }}>
      {last.map((it) => {
        const p = ramp(t, it.t - 0.1, it.t + 0.25);
        return (
          <div key={it.text} style={{ opacity: p, transform: `translateX(${(1 - p) * 60}px)`, background: it.bg || C.card, color: it.bg && it.bg !== C.card ? C.paper : C.forest, border: it.bg ? "none" : `3px solid ${C.line}`, borderRadius: 28, padding: "20px 28px", fontFamily: FONT, fontWeight: 800, fontSize: 34, lineHeight: 1.2, boxShadow: "0 12px 30px rgba(31,42,20,0.10)" }}>
            {it.big && <div style={{ fontSize: 76, lineHeight: 1, color: it.bg ? C.banana : C.matcha, marginBottom: 6 }}>{it.big}</div>}
            {it.text}
          </div>
        );
      })}
    </div>
  );
};
