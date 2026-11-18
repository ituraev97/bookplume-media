import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { C, FONT } from "./kit";
import Q from "./sheetquiz.json";

// ---------- data shape (sheetquiz.json) ----------
// {title, sub, plate:{src,w,h}, labels:[{box:[x0,y0,x1,y1], name}], end, qs:[{n, pin:[fx,fy], label: idx, ask, opts:[..3], a:0..2, tAsk, tCount, tReveal, tNext, name}]}
type Qn = { n: number; pin: [number, number]; label: number; ask: string; opts: string[]; a: number; tAsk: number; tCount: number; tReveal: number; tNext: number; name: string; zoom?: number; badge?: [number, number] };
const DATA = Q as unknown as {
  title: string; sub: string; end: number; tEnd: number;
  plate: { src: string; w: number; h: number };
  labels: { box: [number, number, number, number] }[];
  qs: Qn[];
};

const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const ease = Easing.bezier(0.33, 0, 0.2, 1);
const r = (t: number, a: number, b: number, f = 0, to = 1) => interpolate(t, [a, b], [f, to], { ...cl, easing: ease });
const pop = (t: number, t0: number, d = 0.35) => {
  const x = Math.min(Math.max((t - t0) / d, 0), 1);
  if (x <= 0) return 0;
  const s = 1.70158 * 1.4;
  const y = x - 1;
  return 1 + (s + 1) * y * y * y + s * y * y;
};

const useT = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps;
};

const curQ = (t: number) => {
  let i = 0;
  for (let k = 0; k < DATA.qs.length; k++) if (t >= DATA.qs[k].tAsk - 0.05) i = k;
  return i;
};

// ---------- plate with zoom, stickers and pin ----------
const PW = 940; // plate window width on the sheet
const PH = 760;
const Plate: React.FC<{ t: number }> = ({ t }) => {
  const { plate, labels, qs } = DATA;
  const i = curQ(t);
  const q = qs[i];
  // zoom: towards the current pin while the question is live, back out a bit after the reveal
  const baseScale = PW / plate.w;
  const z = (q.zoom ?? 1.55);
  const zin = r(t, q.tAsk - 0.1, q.tAsk + 0.5) * (1 - r(t, q.tReveal + 0.9, q.tNext - 0.1) * 0.55);
  const scale = baseScale * (1 + (z - 1) * zin);
  // focus point in plate px
  const fx = q.pin[0] * plate.w, fy = q.pin[1] * plate.h;
  const cxFull = plate.w / 2, cyFull = plate.h / 2;
  const cx = cxFull + (fx - cxFull) * zin, cy = cyFull + (fy - cyFull) * zin;
  // translate so that (cx,cy) sits at the window centre, then clamp so the plate keeps covering the window
  let tx = PW / 2 - cx * scale, ty = PH / 2 - cy * scale;
  const minX = PW - plate.w * scale, minY = PH - plate.h * scale;
  tx = Math.min(Math.max(tx, Math.min(minX, 0)), Math.max(0, minX));
  ty = Math.min(Math.max(ty, Math.min(minY, 0)), Math.max(0, minY));
  if (plate.h * scale < PH) ty = (PH - plate.h * scale) / 2;
  const P = (fxx: number, fyy: number) => [tx + fxx * plate.w * scale, ty + fyy * plate.h * scale];

  const live = t >= q.tAsk - 0.05 && t < q.tNext;
  const pinIn = pop(t, q.tAsk + 0.15);
  const pulse = 1 + 0.12 * Math.sin(t * 9);
  const [px, py] = P(q.pin[0], q.pin[1]);

  return (
    <div style={{ position: "absolute", left: 30, top: 0, width: PW, height: PH, overflow: "hidden", borderRadius: 18, border: `4px solid ${C.forest}`, background: "#F2EFDC" }}>
      <Img src={staticFile(plate.src)} style={{ position: "absolute", left: tx, top: ty, width: plate.w * scale, height: plate.h * scale, filter: "contrast(1.12) saturate(1.25)" }} />
      {/* stickers over every printed bone name */}
      {labels.map((lb, k) => ({ lb, k })).sort((A, B) => {
        const rank = (k: number) => { const qq = qs.find((qx) => qx.label === k); if (!qq) return 0; if (qq === q) return 30; return t >= qq.tReveal ? 2 + qq.n : 1; };
        return rank(A.k) - rank(B.k);
      }).map(({ lb, k }) => {
        const [x0, y0] = P(lb.box[0], lb.box[1]);
        const [x1, y1] = P(lb.box[2], lb.box[3]);
        const qq = qs.find((qx) => qx.label === k);
        const revealed = qq ? t >= qq.tReveal : false;
        const flip = qq ? r(t, qq.tReveal, qq.tReveal + 0.25) : 0;
        const isCur = qq && qq === q && live;
        const showName = revealed && flip >= 0.5;
        const h0 = Math.max(y1 - y0, 30 + 10 * zin); const past = !!qq && revealed && !(qq === q && live); const h = h0; const fs = Math.min(h * 0.75, 34); const w = Math.max(x1 - x0, 48 + 16 * zin, (qq && revealed) ? qq.name.length * fs * 0.78 + 10 : 0);
        const sy = Math.abs(1 - 2 * flip);
        if (past) {
          const hs = Math.max(y1 - y0, 30 + 10 * zin), ws = Math.max(x1 - x0, 48 + 16 * zin);
          const cf = 26, cw = qq!.name.length * cf * 0.8 + 24, ch = 44;
          const ca = (lb as any).chipAt ? P((lb as any).chipAt[0], (lb as any).chipAt[1]) : [(x0 + x1) / 2, (y0 + y1) / 2];
          const cxm = Math.min(Math.max(ca[0], cw / 2 + 10), PW - cw / 2 - 14), cym = Math.min(Math.max(ca[1], ch / 2 + 10), PH - ch / 2 - 14);
          return (
            <React.Fragment key={k}>
              <div style={{ position: "absolute", left: (x0 + x1) / 2 - ws / 2 - 8, top: (y0 + y1) / 2 - hs / 2 - 6, width: ws + 16, height: hs + 12, transform: "rotate(-3deg)", borderRadius: 10, zIndex: 1,
                background: C.banana, border: `3px solid ${C.forest}`, boxShadow: "2px 3px 0 rgba(31,42,20,0.35)" }} />
              <div style={{ position: "absolute", left: cxm - cw / 2, top: cym - ch / 2, width: cw, height: ch, transform: "rotate(-3deg)", borderRadius: 10, zIndex: 5, background: C.matcha,
                border: `3px solid ${C.forest}`, boxShadow: "2px 3px 0 rgba(31,42,20,0.35)", display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: FONT, fontWeight: 800, fontSize: cf, color: "#fff", whiteSpace: "nowrap" }}>{qq!.name.toUpperCase()}</div>
            </React.Fragment>
          );
        }
        return (
          <div key={k} style={{
            position: "absolute", left: revealed ? Math.min(Math.max((x0 + x1) / 2 - w / 2 - 8, 8), PW - w - 30) : (x0 + x1) / 2 - w / 2 - 8, top: revealed ? Math.min(Math.max((y0 + y1) / 2 - h / 2 - 6, 8), PH - h - 26) : (y0 + y1) / 2 - h / 2 - 6, width: w + 16, height: h + 12,
            transform: `rotate(-3deg) scaleY(${revealed ? sy : 1})`, borderRadius: 10, zIndex: isCur ? 8 : 1,
            background: showName ? C.matcha : C.banana, border: `3px solid ${C.forest}`,
            boxShadow: isCur ? `0 0 0 6px ${C.red}` : "2px 3px 0 rgba(31,42,20,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: FONT, fontWeight: 800, fontSize: fs, color: showName ? "#fff" : C.forest, whiteSpace: "nowrap",
          }}>
            {showName ? qq!.name.toUpperCase() : "?"}
          </div>
        );
      })}
      {/* pin */}
      {live && pinIn > 0 && (
        <svg width={PW} height={PH} style={{ position: "absolute", left: 0, top: 0, zIndex: 9 }}>
          <circle cx={px} cy={py} r={44 * pulse * pinIn} fill="none" stroke="#fff" strokeWidth={14} opacity={0.9} />
          <circle cx={px} cy={py} r={44 * pulse * pinIn} fill="rgba(201,72,60,0.18)" stroke={C.red} strokeWidth={8} />
          <circle cx={px} cy={py} r={9 * pinIn} fill={C.red} stroke="#fff" strokeWidth={3} />
          <g transform={`translate(${px + (q.badge ? q.badge[0] : 40)} ${py + (q.badge ? q.badge[1] : -92)}) scale(${pinIn})`}>
            <circle r={36} fill={C.red} stroke="#fff" strokeWidth={5} />
            <text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={42} fill="#fff">{q.n}</text>
          </g>
        </svg>
      )}
    </div>
  );
};

// ---------- countdown ring ----------
const Ring: React.FC<{ t: number; q: Qn }> = ({ t, q }) => {
  if (t < q.tCount || t > q.tReveal + 0.2) return null;
  const dur = q.tReveal - q.tCount;
  const left = Math.max(0, q.tReveal - t);
  const num = Math.min(3, Math.ceil(left / (dur / 3)));
  const frac = left / dur;
  const R = 62, L = 2 * Math.PI * R;
  const s = pop(t, q.tCount, 0.3);
  const beatPulse = 1 + 0.08 * Math.max(0, 1 - ((dur - left) % (dur / 3)) / 0.18);
  return (
    <svg width={180} height={180} style={{ position: "absolute", right: 34, top: 18, transform: `scale(${s * beatPulse})` }}>
      <circle cx={90} cy={90} r={R + 10} fill={C.forest} />
      <circle cx={90} cy={90} r={R} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={12} />
      <circle cx={90} cy={90} r={R} fill="none" stroke={C.banana} strokeWidth={12} strokeLinecap="round"
        strokeDasharray={L} strokeDashoffset={L * (1 - frac)} transform="rotate(-90 90 90)" />
      <text x={90} y={112} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={66} fill="#fff">{left > 0.02 ? num : "!"}</text>
    </svg>
  );
};

// ---------- hand-drawn marker circle ----------
const Marker: React.FC<{ p: number; w: number; h: number }> = ({ p, w, h }) => {
  if (p <= 0) return null;
  const rx = w / 2 + 22, ry = h / 2 + 16;
  // slightly open, overshooting ellipse like a real pen stroke
  const pts: string[] = [];
  const N = 60;
  for (let k = 0; k <= N; k++) {
    const a = -2.6 + (k / N) * (Math.PI * 2 + 0.5);
    const wob = 1 + 0.04 * Math.sin(k * 0.7);
    pts.push(`${(w / 2 + rx * wob * Math.cos(a)).toFixed(1)},${(h / 2 + ry * wob * Math.sin(a) + k * 0.12).toFixed(1)}`);
  }
  const d = "M" + pts.join(" L");
  return (
    <svg width={w + 80} height={h + 70} style={{ position: "absolute", left: -40, top: -35, overflow: "visible" }}>
      <g transform="translate(40 35)">
        <path d={d} fill="none" stroke={C.red} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" pathLength={1}
          strokeDasharray={1} strokeDashoffset={1 - p} opacity={0.92} />
      </g>
    </svg>
  );
};

// ---------- question block ----------
const Question: React.FC<{ t: number }> = ({ t }) => {
  const i = curQ(t);
  const q = DATA.qs[i];
  const inA = r(t, q.tAsk - 0.05, q.tAsk + 0.3);
  const outA = 1 - r(t, q.tNext - 0.25, q.tNext + 0.02);
  const vis = i === DATA.qs.length - 1 ? inA * (1 - r(t, DATA.end - 0.3, DATA.end)) : inA * outA;
  const markP = r(t, q.tReveal + 0.05, q.tReveal + 0.6);
  return (
    <div style={{ position: "absolute", left: 30, top: PH + 22, width: PW, height: 460, opacity: vis, transform: `translateY(${(1 - inA) * 24}px)` }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64, color: C.forest, letterSpacing: -1 }}>
        <span style={{ color: C.red }}>{q.n}.</span> {q.ask}
      </div>
      <Ring t={t} q={q} />
      <div style={{ marginTop: 18 }}>
        {q.opts.map((o, k) => {
          const correct = k === q.a;
          const done = t >= q.tReveal + 0.35;
          const dim = done && !correct;
          return (
            <div key={k} style={{ position: "relative", display: "flex", alignItems: "center", height: 100, marginBottom: 4 }}>
              <div style={{ width: 82, height: 82, borderRadius: 41, border: `5px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: FONT, fontWeight: 800, fontSize: 46, color: done && correct ? "#fff" : C.forest, background: done && correct ? C.matcha : "transparent" }}>
                {done && correct ? "✓" : String.fromCharCode(97 + k)}
              </div>
              <div style={{ position: "relative", marginLeft: 30, fontFamily: FONT, fontWeight: 700, fontSize: 60, color: C.forest, opacity: dim ? 0.35 : 1,
                textDecoration: dim ? "line-through" : "none", textDecorationThickness: 5 }}>
                {o}
                {correct && <Marker p={markP} w={o.length * 34} h={70} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------- header with progress ----------
const Header: React.FC<{ t: number }> = ({ t }) => {
  return (
    <div style={{ position: "absolute", left: 30, top: 0, width: PW, height: 240 }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 104, color: C.forest, letterSpacing: -3, lineHeight: 1 }}>
        {DATA.title}
      </div>
      <div style={{ position: "absolute", left: 0, top: 112, height: 16, width: 560, background: C.banana, borderRadius: 8, opacity: 0.9 }} />
      <div style={{ marginTop: 26, fontFamily: FONT, fontWeight: 800, fontSize: 58, color: C.red }}>{DATA.sub}</div>
      <div style={{ position: "absolute", right: 0, top: 18, display: "flex", gap: 12 }}>
        {DATA.qs.map((q, k) => {
          const done = t >= q.tReveal;
          const cur = t >= q.tAsk - 0.05 && t < q.tNext;
          return (
            <div key={k} style={{ width: 54, height: 54, borderRadius: 12, border: `4px solid ${C.forest}`, background: done ? C.matcha : cur ? C.banana : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: done ? "#fff" : C.forest,
              transform: `scale(${cur && !done ? 1 + 0.06 * Math.sin(t * 8) : 1})` }}>
              {done ? "✓" : q.n}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------- end card ----------
const EndCard: React.FC<{ t: number; store: boolean }> = ({ t, store }) => {
  const a = pop(t, DATA.end, 0.45);
  if (t < DATA.end) return null;
  return (
    <AbsoluteFill style={{ background: `rgba(31,42,20,${0.82 * Math.min(1, (t - DATA.end) / 0.25)})`, alignItems: "center", justifyContent: "center" }}>
      <div style={{ transform: `scale(${a}) rotate(-2deg)`, width: 900, padding: "56px 40px", background: C.banana, borderRadius: 36, border: `6px solid ${C.forest}`,
        boxShadow: "12px 14px 0 rgba(0,0,0,0.35)", textAlign: "center", fontFamily: FONT }}>
        <div style={{ fontWeight: 800, fontSize: 92, color: C.forest, lineHeight: 1.05 }}>How many<br />did you get?</div>
        <div style={{ marginTop: 26, fontWeight: 800, fontSize: 60, color: C.red }}>Comment your score 👇</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 34 }}>
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <div key={k} style={{ width: 92, height: 92, borderRadius: 20, background: "#fff", border: `5px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 40, color: C.forest,
              transform: `translateY(${-14 * Math.max(0, Math.sin((t - DATA.end) * 6 - k * 0.6))}px)` }}>{k}/5</div>
          ))}
        </div>
        {store && <div style={{ marginTop: 34, fontWeight: 700, fontSize: 40, color: C.forest }}>Save this · flashcards at bookplume.com</div>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- whole video ----------
export const SheetQuizVideo: React.FC<{ store?: boolean }> = ({ store = false }) => {
  const t = useT();
  // handheld drift of the sheet
  const dx = 6 * Math.sin(t * 0.7) + 3 * Math.sin(t * 1.9);
  const dy = 5 * Math.sin(t * 0.9 + 1) + 2 * Math.sin(t * 2.3);
  const rot = -1.2 + 0.5 * Math.sin(t * 0.5);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, #2E3D1E 0%, ${C.forest} 70%)` }}>
      <svg width={1080} height={1920} style={{ position: "absolute", opacity: 0.08 }}>
        <defs>
          <pattern id="dots" width={46} height={46} patternUnits="userSpaceOnUse"><circle cx={23} cy={23} r={2.4} fill="#fff" /></pattern>
        </defs>
        <rect width={1080} height={1920} fill="url(#dots)" />
      </svg>
      <div style={{ position: "absolute", left: 40 + dx, top: 110 + dy, width: 1000, height: 1700, transform: `rotate(${rot}deg)`, background: C.paper, borderRadius: 18,
        boxShadow: "0 30px 60px rgba(0,0,0,0.45), inset 0 0 120px rgba(160,140,90,0.18)" }}>
        {/* paper lines */}
        <svg width={1000} height={1640} style={{ position: "absolute", opacity: 0.35 }}>
          {Array.from({ length: 30 }).map((_, k) => <line key={k} x1={0} x2={1000} y1={900 + k * 58} y2={900 + k * 58} stroke="#B9C6D6" strokeWidth={2} />)}
          <line x1={92} x2={92} y1={0} y2={1640} stroke="#E8A0A0" strokeWidth={3} />
        </svg>
        <div style={{ position: "absolute", left: 0, top: 40, width: 1000 }}>
          <Header t={t} />
          <div style={{ position: "absolute", top: 220, left: 0 }}>
            <Plate t={t} />
            <Question t={t} />
          </div>
        </div>
      </div>
      <EndCard t={t} store={store} />
    </AbsoluteFill>
  );
};
