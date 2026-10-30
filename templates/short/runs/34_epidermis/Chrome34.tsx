import React from "react";
import { C, FONT, ramp, useT } from "./kit";
import { WORDS } from "./words";

export const CHAPTERS = [
  { n: 1, title: "5 Layers", s: 0 },
  { n: 2, title: "The Trick", s: 8.89 },
  { n: 3, title: "Quick Test", s: 30.47 },
  { n: 4, title: "Save It", s: 39.54 },
];
export const END = 45.9;

export const Mark: React.FC<{ size: number; reversed?: boolean }> = ({ size, reversed }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    {[13, 23, 42].map((x) => (
      <rect key={x} x={x} y={17} width={9} height={34} rx={4.5} fill={reversed ? C.paper : C.matcha} />
    ))}
    <rect x={31} y={13} width={9} height={38} rx={4.5} fill={C.banana} transform="rotate(16 35.5 51)" />
  </svg>
);

export const Header: React.FC = () => {
  const t = useT();
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
        <Mark size={62} reversed />
      </div>
      <div style={{ position: "absolute", left: 106, top: 2, fontWeight: 800, fontSize: 40, color: C.forest, letterSpacing: -0.5 }}>
        Book Plume
      </div>
      <div style={{ position: "absolute", left: 106, top: 50, fontWeight: 700, fontSize: 25, color: C.matcha }}>
        Epidermis layers in 45 seconds
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
  (
    "5 epidermis trick blood vessels surface come let's get sun burned corneum lucidum granulosum spinosum basale dead clear thick granules die spiny deepest 1918 palms soles stratum exam save follow"
  ).split(" ")
);
const norm = (w: string) => w.toLowerCase().replace(/[.,?!:]/g, "");

type Chunk = { words: typeof WORDS; s: number; e: number };
const CHUNKS: Chunk[] = (() => {
  const out: Chunk[] = [];
  let cur: typeof WORDS = [];
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
})();

export const Subtitles: React.FC = () => {
  const t = useT();
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
