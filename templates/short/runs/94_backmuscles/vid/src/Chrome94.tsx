import React from "react";
import { C, FONT, ramp, useT } from "./kit";
import { WORDS as W0 } from "./words94";
type Wd = { w: string; s: number; e: number };

export type Ch = { n: number; title: string; s: number };
export const CHAPTERS: Ch[] = [
  { n: 1, title: "Quiz", s: 0 },
  { n: 2, title: "Mnemonic", s: 5.6 },
  { n: 3, title: "5 Muscles", s: 9.3 },
  { n: 4, title: "Quick Test", s: 17.1 },
  { n: 5, title: "Answer", s: 22.55 },
  { n: 6, title: "Save It", s: 25.85 },
];
export const END = 29.25;
export const TT_CHAPTERS: Ch[] = [
  { n: 1, title: "Quiz", s: 0 },
  { n: 2, title: "2 on top", s: 5.75 },
  { n: 3, title: "3 underneath", s: 10.1 },
  { n: 4, title: "Your guess?", s: 15.25 },
];
export const TT_END = 17.3;
export const Mark: React.FC<{ size: number; reversed?: boolean }> = ({ size, reversed }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    {[13, 23, 42].map((x) => (
      <rect key={x} x={x} y={17} width={9} height={34} rx={4.5} fill={reversed ? C.paper : C.matcha} />
    ))}
    <rect x={31} y={13} width={9} height={38} rx={4.5} fill={C.banana} transform="rotate(16 35.5 51)" />
  </svg>
);

export const Header: React.FC<{ chapters?: Ch[]; end?: number; brand?: boolean }> = ({ chapters = CHAPTERS, end = END, brand = true }) => {
  const t = useT();
  const CHAPTERS = chapters, END = end;
  let ci = 0;
  CHAPTERS.forEach((c, i) => {
    if (t >= c.s) ci = i;
  });
  const ch = CHAPTERS[ci];
  const chEnd = ci < CHAPTERS.length - 1 ? CHAPTERS[ci + 1].s : END;
  const chSwap = ramp(t, ch.s, ch.s + 0.35);
  return (
    <div style={{ position: "absolute", left: 70, top: 205, width: 860, height: 110, fontFamily: FONT }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 84,
          height: 84,
          borderRadius: 42,
          background: C.forest,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 0 4px ${C.paper}, 0 0 0 7px ${C.matcha}`,
        }}
      >
        {brand ? <Mark size={62} reversed /> : <div style={{ fontWeight: 800, fontSize: 50, color: C.banana, lineHeight: 1 }}>?</div>}
      </div>
      <div style={{ position: "absolute", left: 106, top: 2, fontWeight: 800, fontSize: 40, color: C.forest, letterSpacing: -0.5 }}>
        {brand ? "Book Plume" : "Anatomy Quiz"}
      </div>
      <div style={{ position: "absolute", left: 106, top: 50, fontWeight: 700, fontSize: 25, color: C.matcha }}>
        {t < 3.76 ? "anatomy quiz · back muscles" : "superficial back muscles mnemonic"}
      </div>
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 4,
          textAlign: "right",
          opacity: chSwap,
          transform: `translateY(${(1 - chSwap) * 12}px)`,
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 22, color: C.matcha, letterSpacing: 3 }}>
          CHAPTER {ch.n} / {CHAPTERS.length}
        </div>
        <div style={{ fontWeight: 800, fontSize: 32, color: C.forest, marginTop: 2 }}>{ch.title}</div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 100, width: 860, height: 10, display: "flex", gap: 8 }}>
        {CHAPTERS.map((c, i) => {
          const e = i < CHAPTERS.length - 1 ? CHAPTERS[i + 1].s : END;
          const p = i < ci ? 1 : i > ci ? 0 : ramp(t, c.s, chEnd);
          return (
            <div key={i} style={{ flex: 1, height: 10, borderRadius: 5, background: C.line, overflow: "hidden" }}>
              <div style={{ width: `${p * 100}%`, height: "100%", background: i === ci ? C.matcha : C.matchaDark, borderRadius: 5 }} />
              {e < 0 ? null : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const KEY = new Set(
  ("muscle latissimus dorsi lats superficial trapezius levator scapulae rhomboid minor major not brachial plexus 11 accessory save comment top underneath").split(" ")
);
const norm = (w: string) => w.toLowerCase().replace(/[.,?!:]/g, "");

type Chunk = { words: Wd[]; s: number; e: number };
const mkChunks = (WORDS: Wd[]): Chunk[] => {
  const out: Chunk[] = [];
  let cur: Wd[] = [];
  WORDS.forEach((w, i) => {
    cur.push(w);
    const next = WORDS[i + 1];
    const curChars = cur.reduce((a, x) => a + x.w.length + 1, 0);
    const wouldOverflow = next ? curChars + next.w.length > 25 : false;
    const punct = /[.?!]$/.test(w.w) || /\.\.\.$/.test(w.w);
    const comma = /,$/.test(w.w);
    const gap = next ? next.s - w.e : 9;
    const chars = cur.reduce((a, x) => a + x.w.length + 1, 0);
    if (!next || punct || (comma && cur.length >= 2) || gap > 0.4 || cur.length >= 4 || chars > 24 || wouldOverflow) {
      out.push({ words: cur, s: cur[0].s, e: w.e });
      cur = [];
    }
  });
  return out;
};
const CH_MAIN = mkChunks(W0);

export const Subtitles: React.FC<{ words?: Wd[] }> = ({ words }) => {
  const t = useT();
  const CHUNKS = React.useMemo(() => (words ? mkChunks(words) : CH_MAIN), [words]);
  let idx = -1;
  CHUNKS.forEach((c, i) => {
    if (t >= c.s - 0.12) idx = i;
  });
  if (idx < 0) return null;
  const c = CHUNKS[idx];
  const next = CHUNKS[idx + 1];
  if (t > c.e + 0.9 && (!next || t < next.s - 0.12)) return null;
  const pop = ramp(t, c.s - 0.12, c.s + 0.05);
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        width: 860,
        top: 336,
        height: 100,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: C.forest,
          borderRadius: 26,
          padding: "12px 30px 16px",
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 50,
          letterSpacing: -0.5,
          whiteSpace: "nowrap",
          transform: `scale(${0.92 + 0.08 * pop})`,
          boxShadow: "0 8px 0 rgba(31,42,20,0.15)",
        }}
      >
        {c.words.map((w, i) => {
          const said = t >= w.s;
          const active = t >= w.s && t < w.e + 0.05;
          const key = KEY.has(norm(w.w));
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                marginRight: i < c.words.length - 1 ? 14 : 0,
                color: key && said ? C.forest : C.paper,
                background: key && said ? C.banana : "transparent",
                borderRadius: 12,
                padding: key && said ? "0 8px 2px" : 0,
                opacity: said ? 1 : 0.35,
                transform: `translateY(${active ? -3 : 0}px)`,
                lineHeight: 1.1,
              }}
            >
              {w.w.replace(/\.\.\.$/, "…")}
            </span>
          );
        })}
      </div>
    </div>
  );
};
