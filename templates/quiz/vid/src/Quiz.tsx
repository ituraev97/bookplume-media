import React from "react";
import { Img, staticFile } from "remotion";
import { C, FONT, ramp, useT } from "./kit";
import { LogoMark } from "./Chrome16";
import { QZ } from "./quizdata";

/**
 * LONG QUIZ format (data comes from tools/quiz_build.py -> src/quizdata.ts).
 * Left: atlas plate in a frame, camera pushes to the structure, red pin points at it, ALL label boxes listed in `hide`
 * wear a yellow "?" sticker during the question (deliberate quiz element, so printed 1918 names can't give the answer);
 * on reveal the boxes in `open` flip off and a MODERN label pops at the pin (+ "1918 atlas name" note if `old`).
 * Right: level badge, question counter, question, 4 options, 5-second countdown ring, then the correct option lights up.
 */
type Item = (typeof QZ.items)[number];
const FX = 60, FY = 150, FW = 1040, FH = 760; // plate frame

const smooth = (t: number, a: number, b: number) => ramp(t, a, b);

export const itemAt = (t: number): Item | null => {
  let cur: Item | null = null;
  for (const it of QZ.items) if (t >= it.tQ - 0.05 && t < it.tEnd + 0.05) cur = it;
  return cur;
};

const levelAt = (t: number) => {
  let l = QZ.levels[0];
  for (const x of QZ.levels) if (t >= x.s) l = x;
  return l;
};

/** plate drawn into the frame with zoom z centred on (fx, fy), clamped so no empty edge shows */
const QuizPlate: React.FC<{ it: Item; t: number }> = ({ it, t }) => {
  const p = it.plate as unknown as { src: string; aspect: number };
  const [z0, fx, fy] = it.zoom as unknown as [number, number, number];
  const z = z0 * (1 + 0.06 * smooth(t, it.tQ, it.tEnd)); // slow push
  // base: image covers the frame
  const base = Math.max(FW / 1, (FH * p.aspect) / 1);
  const iw = base * z, ih = iw / p.aspect;
  const cl = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
  const left = cl(FW / 2 - fx * iw, FW - iw, 0);
  const top = cl(FH / 2 - fy * ih, FH - ih, 0);
  const reveal = smooth(t, it.tReveal - 0.05, it.tReveal + 0.35);
  const pinIn = smooth(t, it.tQ + 0.2, it.tQ + 0.6);
  const pulse = 1 + 0.12 * Math.sin((t - it.tQ) * 6);
  const [px, py] = it.pin as unknown as [number, number];
  const hide = (it.hide ?? []) as unknown as number[][];
  const open = new Set((it.open ?? []) as unknown as number[]);
  const lbl = smooth(t, it.tReveal + 0.15, it.tReveal + 0.5);
  const lx = left + px * iw, ly = top + py * ih;
  const lside = lx > FW * 0.62 ? -1 : 1; // label goes left when the pin is near the right edge
  return (
    <div style={{ position: "absolute", left: FX, top: FY, width: FW, height: FH, borderRadius: 36, overflow: "hidden", background: C.paper, boxShadow: `0 0 0 4px ${C.line}, 0 18px 40px rgba(31,42,20,0.14)` }}>
      <Img src={staticFile(p.src)} style={{ position: "absolute", left, top, width: iw, height: ih }} />
      {hide.map((b, j) => {
        const opening = open.has(j) ? reveal : 0;
        const bx = left + b[0] * iw, by = top + b[1] * ih, bw = b[2] * iw, bh = b[3] * ih;
        if (opening >= 1) return null;
        return (
          <div key={j} style={{ position: "absolute", left: bx, top: by, width: bw, height: bh, transform: `rotate(${((j * 37) % 7) - 3}deg) scaleY(${1 - opening})`, transformOrigin: "50% 0%", background: C.banana, border: `3px solid ${C.forest}`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: Math.min(bh * 0.7, 46), color: C.forest, boxShadow: "0 4px 0 rgba(31,42,20,0.2)" }}>
            ?
          </div>
        );
      })}
      {/* pin */}
      <div style={{ position: "absolute", left: lx, top: ly, width: 0, height: 0, opacity: pinIn }}>
        <div style={{ position: "absolute", left: -34 * pulse, top: -34 * pulse, width: 68 * pulse, height: 68 * pulse, borderRadius: "50%", border: `6px solid ${reveal > 0.5 ? C.matcha : C.red}`, boxShadow: "0 0 0 4px rgba(247,246,236,0.9)" }} />
        <div style={{ position: "absolute", left: -9, top: -9, width: 18, height: 18, borderRadius: 9, background: reveal > 0.5 ? C.matcha : C.red, border: `3px solid ${C.paper}` }} />
        {lbl > 0 && (
          <div style={{ position: "absolute", left: lside * 52, top: 0, transform: `translate(${lside < 0 ? "-100%" : "0"}, -50%) scale(${0.8 + 0.2 * lbl})`, transformOrigin: lside < 0 ? "100% 50%" : "0% 50%", opacity: lbl, whiteSpace: "nowrap" }}>
            <div style={{ background: C.forest, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 46, padding: "8px 24px 12px", borderRadius: 18, boxShadow: "0 6px 0 rgba(31,42,20,0.18)" }}>{it.label}</div>
            {it.old && <div style={{ marginTop: 8, background: C.card, color: C.forest, border: `3px solid ${C.line}`, fontFamily: FONT, fontWeight: 700, fontSize: 24, padding: "4px 14px 6px", borderRadius: 12, width: "fit-content" }}>1918 atlas name: {it.old}</div>}
          </div>
        )}
      </div>
      <div style={{ position: "absolute", right: 14, bottom: 10, fontFamily: FONT, fontWeight: 700, fontSize: 18, color: C.forest, opacity: 0.55, background: "rgba(247,246,236,0.85)", padding: "2px 10px", borderRadius: 8 }}>Gray's Anatomy, 1918 · public domain</div>
    </div>
  );
};

const Ring: React.FC<{ t: number; it: Item }> = ({ t, it }) => {
  const n = QZ.count;
  const k = Math.max(0, Math.min(1, (t - it.tCount) / n));
  const left = Math.ceil(n - (t - it.tCount) - 1e-6);
  const show = smooth(t, it.tCount - 0.3, it.tCount) * (1 - smooth(t, it.tReveal, it.tReveal + 0.3));
  if (show <= 0) return null;
  const r = 70, L = 2 * Math.PI * r;
  const hot = left <= 2;
  const tickPop = 1 + 0.12 * Math.max(0, 1 - ((t - it.tCount) % 1) / 0.25);
  return (
    <div style={{ position: "absolute", left: 1700, top: 170, width: 180, height: 180, opacity: show, transform: `scale(${(0.8 + 0.2 * show) * tickPop})` }}>
      <svg width={180} height={180} viewBox="0 0 180 180">
        <circle cx={90} cy={90} r={r + 14} fill={C.forest} />
        <circle cx={90} cy={90} r={r} fill="none" stroke={C.matchaDark} strokeWidth={14} />
        <circle cx={90} cy={90} r={r} fill="none" stroke={hot ? C.red : C.banana} strokeWidth={14} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * k} transform="rotate(-90 90 90)" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 84, color: hot ? C.redLight : C.paper }}>{Math.max(1, Math.min(n, left))}</div>
    </div>
  );
};

const QuestionPanel: React.FC<{ it: Item; t: number }> = ({ it, t }) => {
  const i = smooth(t, it.tQ, it.tQ + 0.4);
  const o = smooth(t, it.tEnd - 0.3, it.tEnd);
  const reveal = smooth(t, it.tReveal - 0.05, it.tReveal + 0.3);
  const lv = QZ.levels[it.level];
  const opts = it.options as unknown as string[];
  return (
    <div style={{ position: "absolute", left: 1140, top: 160, width: 720, height: 750, opacity: i * (1 - o), transform: `translateX(${(1 - i) * 50}px)`, fontFamily: FONT }}>
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <div style={{ background: C.forest, color: C.banana, fontWeight: 800, fontSize: 26, letterSpacing: 3, padding: "8px 18px 10px", borderRadius: 14 }}>LEVEL {lv.n} · {lv.name.toUpperCase()}</div>
        <div style={{ color: C.matcha, fontWeight: 800, fontSize: 28 }}>Q{it.n} / {QZ.total}</div>
      </div>
      <div style={{ marginTop: 22, width: 540, color: C.forest, fontWeight: 800, fontSize: 52, lineHeight: 1.08, letterSpacing: -1 }}>{it.q}</div>
      <div style={{ position: "absolute", top: 300, width: 720, display: "flex", flexDirection: "column", gap: 18 }}>
        {opts.map((op, j) => {
          const good = j === it.a;
          const pj = smooth(t, it.tQ + 0.25 + j * 0.12, it.tQ + 0.55 + j * 0.12);
          const bg = reveal > 0.5 ? (good ? C.matcha : C.card) : C.card;
          return (
            <div key={j} style={{ opacity: pj * (reveal > 0.5 && !good ? 0.45 : 1), transform: `translateX(${(1 - pj) * 40}px) scale(${good ? 1 + 0.04 * reveal : 1})`, transformOrigin: "0% 50%", display: "flex", alignItems: "center", gap: 20, height: 92, background: bg, border: `4px solid ${reveal > 0.5 && good ? C.matchaDark : C.line}`, borderRadius: 24, padding: "0 24px", boxShadow: "0 8px 20px rgba(31,42,20,0.08)" }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: reveal > 0.5 && good ? C.banana : C.forest, color: reveal > 0.5 && good ? C.forest : C.paper, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 32 }}>{"ABCD"[j]}</div>
              <div style={{ fontWeight: 800, fontSize: 40, color: reveal > 0.5 && good ? C.paper : C.forest }}>{op}</div>
              {reveal > 0.5 && good && <div style={{ marginLeft: "auto", fontSize: 44, color: C.banana, fontWeight: 800 }}>✓</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const LevelCard: React.FC<{ t: number }> = ({ t }) => {
  for (const l of QZ.levels) {
    const a = smooth(t, l.s - 0.05, l.s + 0.3) * (1 - smooth(t, l.s + 1.9, l.s + 2.3));
    if (a > 0) {
      const k = smooth(t, l.s, l.s + 0.45);
      return (
        <div style={{ position: "absolute", left: 60, top: 150, width: 1800, height: 760, borderRadius: 44, background: C.forest, opacity: a, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT }}>
          <div style={{ fontWeight: 800, fontSize: 36, letterSpacing: 10, color: C.banana, transform: `translateY(${(1 - k) * 30}px)` }}>LEVEL {l.n} OF {QZ.levels.length}</div>
          <div style={{ fontWeight: 800, fontSize: 150, color: C.paper, letterSpacing: -3, transform: `scale(${0.9 + 0.1 * k})` }}>{l.name}</div>
          <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
            {QZ.levels.map((x, j) => (
              <div key={j} style={{ width: 90, height: 16, borderRadius: 8, background: j < l.n ? C.banana : C.matchaDark, transform: `scaleX(${j === l.n - 1 ? k : 1})` }} />
            ))}
          </div>
        </div>
      );
    }
  }
  return null;
};

const Intro: React.FC<{ t: number }> = ({ t }) => {
  const { s, e } = QZ.intro;
  if (t > e + 0.5) return null;
  const o = smooth(t, e - 0.2, e + 0.3);
  const first = QZ.items[0];
  const rules = QZ.rules as unknown as string[];
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - o, fontFamily: FONT }}>
      <div style={{ position: "absolute", left: 60, top: 160, width: 1000 }}>
        <div style={{ color: C.matcha, fontWeight: 800, fontSize: 30, letterSpacing: 6 }}>{QZ.series.toUpperCase()}</div>
        <div style={{ marginTop: 14, color: C.forest, fontWeight: 800, fontSize: 104, lineHeight: 0.98, letterSpacing: -3, transform: `translateY(${(1 - smooth(t, s, s + 0.6)) * 40}px)`, opacity: smooth(t, s, s + 0.5) }}>{QZ.title}</div>
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 18 }}>
          {rules.map((r, j) => {
            const p = smooth(t, 1.2 + j * 0.7, 1.6 + j * 0.7);
            return (
              <div key={j} style={{ opacity: p, transform: `translateX(${(1 - p) * 40}px)`, display: "flex", alignItems: "center", gap: 18 }}>
                <div style={{ width: 54, height: 54, borderRadius: 27, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>{j + 1}</div>
                <div style={{ fontWeight: 800, fontSize: 44, color: C.forest }}>{r}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ position: "absolute", left: 1140, top: 170, width: 720, height: 720, borderRadius: 40, overflow: "hidden", boxShadow: `0 0 0 4px ${C.line}`, transform: `rotate(${2 - 2 * smooth(t, 0, e)}deg)` }}>
        <Img src={staticFile((first.plate as unknown as { src: string }).src)} style={{ width: 720, height: 720, objectFit: "cover", transform: `scale(${1.05 + 0.1 * smooth(t, 0, e)})` }} />
        <div style={{ position: "absolute", right: 30, bottom: 30, background: C.forest, color: C.banana, fontWeight: 800, fontSize: 60, padding: "6px 26px 12px", borderRadius: 22 }}>0 / {QZ.total}</div>
      </div>
    </div>
  );
};

const CtaCard: React.FC<{ t: number }> = ({ t }) => {
  const c = QZ.cta;
  if (!c) return null;
  const a = smooth(t, c.s, c.s + 0.4) * (1 - smooth(t, c.e - 0.3, c.e + 0.1));
  if (a <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 60, top: 150, width: 1800, height: 760, borderRadius: 44, background: C.banana, opacity: a, fontFamily: FONT, display: "flex", alignItems: "center", padding: "0 110px", gap: 70 }}>
      <div style={{ width: 300, height: 300, borderRadius: 150, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <LogoMark size={210} />
      </div>
      <div>
        <div style={{ fontWeight: 800, fontSize: 34, letterSpacing: 6, color: C.matchaDark }}>QUICK BREAK</div>
        <div style={{ fontWeight: 800, fontSize: 86, lineHeight: 1.02, color: C.forest, letterSpacing: -2, marginTop: 10 }}>Study these with Book Plume flash cards</div>
        <div style={{ marginTop: 26, display: "inline-block", background: C.forest, color: C.paper, fontWeight: 800, fontSize: 42, padding: "10px 28px 14px", borderRadius: 18 }}>link in the description</div>
      </div>
    </div>
  );
};

const Outro: React.FC<{ t: number }> = ({ t }) => {
  const { s } = QZ.outro;
  if (t < s - 0.1) return null;
  const a = smooth(t, s, s + 0.5);
  const bands = QZ.bands as unknown as string[][];
  return (
    <div style={{ position: "absolute", left: 60, top: 150, width: 1800, height: 760, opacity: a, fontFamily: FONT }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1040, height: 760, borderRadius: 44, background: C.forest, padding: "56px 70px" }}>
        <div style={{ fontWeight: 800, fontSize: 34, letterSpacing: 8, color: C.banana }}>WHAT'S YOUR SCORE?</div>
        <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 22 }}>
          {bands.map(([r, txt], j) => {
            const p = smooth(t, s + 0.6 + j * 0.5, s + 1.0 + j * 0.5);
            return (
              <div key={j} style={{ opacity: p, transform: `translateX(${(1 - p) * 40}px)`, display: "flex", alignItems: "center", gap: 26 }}>
                <div style={{ width: 200, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 44, textAlign: "center", padding: "6px 0 10px", borderRadius: 18 }}>{r}</div>
                <div style={{ fontWeight: 800, fontSize: 48, color: C.paper }}>{txt}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ position: "absolute", left: 1080, top: 0, width: 720, height: 360, borderRadius: 44, background: C.banana, padding: "44px 50px" }}>
        <div style={{ fontWeight: 800, fontSize: 64, lineHeight: 1.04, color: C.forest, letterSpacing: -1 }}>Comment your score ↓</div>
        <div style={{ marginTop: 18, fontWeight: 700, fontSize: 34, color: C.forest }}>Which one got you?</div>
      </div>
      <div style={{ position: "absolute", left: 1080, top: 400, width: 720, height: 360, borderRadius: 44, background: C.card, border: `4px solid ${C.line}`, padding: "44px 50px" }}>
        <div style={{ fontWeight: 800, fontSize: 30, letterSpacing: 5, color: C.matcha }}>STUDY THEM</div>
        <div style={{ marginTop: 10, fontWeight: 800, fontSize: 52, lineHeight: 1.06, color: C.forest }}>Book Plume anatomy flash cards</div>
        <div style={{ marginTop: 16, fontWeight: 700, fontSize: 30, color: C.forest }}>link in the description</div>
      </div>
    </div>
  );
};

export const QuizHeader: React.FC<{ t: number }> = ({ t }) => {
  const it = itemAt(t);
  const done = QZ.items.filter((x) => t >= x.tReveal).length;
  const lv = levelAt(t);
  return (
    <div style={{ position: "absolute", left: 60, top: 30, width: 1800, height: 100, fontFamily: FONT }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 72, height: 72, borderRadius: 36, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 3px ${C.paper}, 0 0 0 6px ${C.matcha}` }}>
        <LogoMark size={54} />
      </div>
      <div style={{ position: "absolute", left: 92, top: 2, fontWeight: 800, fontSize: 34, color: C.forest }}>Book Plume Anatomy</div>
      <div style={{ position: "absolute", left: 92, top: 44, fontWeight: 700, fontSize: 22, color: C.matcha }}>{QZ.series} · {QZ.title}</div>
      {t > QZ.intro.e && t < QZ.outro.s && (
        <div style={{ position: "absolute", right: 0, top: 6, textAlign: "right", fontWeight: 800, fontSize: 26, color: C.forest }}>
          Level {lv.n}: {lv.name} {it ? `· Question ${it.n}` : ""}
        </div>
      )}
      <div style={{ position: "absolute", left: 0, top: 88, width: 1800, height: 8, display: "flex", gap: 4 }}>
        {QZ.items.map((x, j) => (
          <div key={j} style={{ flex: 1, height: 8, borderRadius: 4, background: j < done ? (x.level % 2 ? C.matchaDark : C.matcha) : C.line }} />
        ))}
      </div>
    </div>
  );
};

export const QuizVideo: React.FC = () => {
  const t = useT();
  const it = itemAt(t);
  return (
    <>
      <Intro t={t} />
      {it && <QuizPlate it={it} t={t} />}
      {it && <QuestionPanel it={it} t={t} />}
      {it && <Ring it={it} t={t} />}
      <LevelCard t={t} />
      <CtaCard t={t} />
      <Outro t={t} />
      <QuizHeader t={t} />
    </>
  );
};

/**
 * 1280x720 thumbnail — "BEAST" style (owner 2026-11-14: thumbnails must be as bright and loud as possible).
 * Sunburst yellow→orange background, the plate crop punched up (contrast/saturation), thick black frame + white rim,
 * glowing red circle on the structure + a big red arrow, 2–3 HUGE white words with a black outline and hard shadow
 * (one word in a red box = th.hl index), red "0/N?" sticker. Must stay readable at 168x94.
 */
export const QuizThumb: React.FC = () => {
  const th = QZ.thumb as unknown as { big: string; sub: string; q: number; zoom: number; hl?: number };
  const it = QZ.items[th.q ?? 0];
  const p = it.plate as unknown as { src: string; aspect: number };
  const [px, py] = it.pin as unknown as [number, number];
  const z = th.zoom ?? 2.2;
  const BW = 600, BH = 600, BX = 34, BY = 60;
  const iw = Math.max(BW, BH * p.aspect) * z, ih = iw / p.aspect;
  const cl = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
  const left = cl(BW / 2 - px * iw, BW - iw, 0), top = cl(BH / 2 - py * ih, BH - ih, 0);
  const cx = left + px * iw, cy = top + py * ih;
  // only the target's own printed name gets a sticker on the thumbnail (cleaner; other names give nothing away)
  const openIdx = (it.open ?? []) as unknown as number[];
  const hide = ((it.hide ?? []) as unknown as number[][]).filter((_, j) => openIdx.includes(j));
  const words = th.big.split(" ");
  const hl = th.hl ?? words.length - 1;
  const stroke = (w: number) => ({ WebkitTextStroke: `${w}px #000`, paintOrder: "stroke fill" as const, textShadow: "8px 8px 0 #000" });
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", fontFamily: FONT, background: "radial-gradient(circle at 34% 50%, #FFF36B 0%, #FFD21F 38%, #FF8A00 100%)" }}>
      <div style={{ position: "absolute", left: -400, top: -660, width: 2000, height: 2000, background: "repeating-conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,0.32) 0deg 7deg, rgba(255,255,255,0) 7deg 18deg)", transform: "translate(-120px, 0)" }} />
      {/* plate */}
      <div style={{ position: "absolute", left: BX, top: BY, width: BW, height: BH, transform: "rotate(-3deg)", borderRadius: 34, overflow: "hidden", background: "#FFF8E6", boxShadow: "0 0 0 10px #000, 0 0 0 20px #fff, 0 0 0 26px #000, 18px 22px 0 26px rgba(0,0,0,0.35)" }}>
        <Img src={staticFile(p.src)} style={{ position: "absolute", left, top, width: iw, height: ih, filter: "contrast(1.35) saturate(1.9) brightness(1.04)" }} />
        {hide.map((b, j) => (
          <div key={j} style={{ position: "absolute", left: left + b[0] * iw, top: top + b[1] * ih, width: b[2] * iw, height: b[3] * ih, background: "#FFD21F", border: "4px solid #000", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 44, color: "#000" }}>?</div>
        ))}
        <div style={{ position: "absolute", left: cx - 80, top: cy - 80, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,214,10,0.75) 0%, rgba(255,170,0,0.45) 60%, rgba(255,170,0,0) 72%)", mixBlendMode: "multiply" }} />
        <div style={{ position: "absolute", left: cx - 110, top: cy - 110, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,40,40,0) 52%, rgba(255,40,40,0.45) 64%, rgba(255,40,40,0) 76%)" }} />
        <div style={{ position: "absolute", left: cx - 88, top: cy - 88, width: 176, height: 176, borderRadius: "50%", border: "16px solid #FF1E1E", boxShadow: "0 0 0 6px #fff, inset 0 0 0 6px #fff, 0 0 30px 10px rgba(255,30,30,0.6)" }} />
      </div>
      {/* arrow from the text side to the circle */}
      <svg width={1280} height={720} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {(() => {
          const tx = BX + cx + 95, ty = BY + cy + 10;
          const sx = Math.min(760, tx + 230), sy = ty + 150;
          const ang = Math.atan2(ty - sy, tx - sx);
          const hx = tx - Math.cos(ang) * 6, hy = ty - Math.sin(ang) * 6;
          const head = (d: number, a: number) => `${hx + Math.cos(ang + a) * d},${hy + Math.sin(ang + a) * d}`;
          return (
            <g>
              <path d={`M${sx},${sy} Q${(sx + tx) / 2 + 60},${(sy + ty) / 2 + 40} ${hx - Math.cos(ang) * 40},${hy - Math.sin(ang) * 40}`} stroke="#000" strokeWidth={42} fill="none" strokeLinecap="round" />
              <path d={`M${sx},${sy} Q${(sx + tx) / 2 + 60},${(sy + ty) / 2 + 40} ${hx - Math.cos(ang) * 40},${hy - Math.sin(ang) * 40}`} stroke="#FF1E1E" strokeWidth={26} fill="none" strokeLinecap="round" />
              <polygon points={`${hx},${hy} ${head(86, Math.PI - 0.5)} ${head(86, Math.PI + 0.5)}`} fill="#FF1E1E" stroke="#000" strokeWidth={8} strokeLinejoin="round" />
            </g>
          );
        })()}
      </svg>
      {/* text */}
      <div style={{ position: "absolute", left: 690, top: 34, width: 570, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4, transform: "rotate(-2deg)" }}>
        <div style={{ background: "#000", color: "#FFD21F", fontWeight: 800, fontSize: 34, letterSpacing: 2, padding: "6px 18px 10px", borderRadius: 12, marginBottom: 8 }}>{th.sub}</div>
        {words.map((w, j) =>
          j === hl ? (
            <div key={j} style={{ background: "#FF1E1E", border: "8px solid #000", borderRadius: 18, padding: "0 18px 8px", boxShadow: "8px 8px 0 #000", color: "#fff", fontWeight: 800, fontSize: 116, lineHeight: 1.0, letterSpacing: -3, ...stroke(10) }}>{w}</div>
          ) : (
            <div key={j} style={{ color: "#fff", fontWeight: 800, fontSize: 132, lineHeight: 0.96, letterSpacing: -4, ...stroke(16) }}>{w}</div>
          ),
        )}
      </div>
      <div style={{ position: "absolute", right: 34, bottom: 30, transform: "rotate(-8deg)", background: "#FF1E1E", color: "#fff", fontWeight: 800, fontSize: 78, padding: "2px 26px 10px", borderRadius: 22, border: "8px solid #000", boxShadow: "8px 8px 0 #000", ...stroke(8) }}>0/{QZ.total}?</div>
    </div>
  );
};
