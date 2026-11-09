import React from "react";
import { Img, staticFile } from "remotion";
import { C, FONT, ramp, useT } from "./kit";
import { Facts, Stage, LogoMark } from "./Chrome16";
import { ArmMap, Cubital, Hand, ThreeParts, MedianCross, AC, AM_PT, CF_PT, HA_PT, Lit } from "./IllusArt";
import { s_, e_, wf, ST, BE, abs, pop, Big, Mk, Seg, Note, Chip, ViewTag, Tag, Panel, KPlate, TrickCard, FL } from "./Kit2";
import { END } from "./timeline";

/* ---------- plates (Gray's Anatomy 1918, public domain) ---------- */
const P = (f: string, w: number, h: number) => ({ src: `plates/${f}.png`, aspect: w / h });
const NECK = P("neck520", 2141, 2269);
const AXIL = P("axil523", 1792, 1401);
const BRACH = P("brach525", 755, 2205);
const FORE = P("fore527", 970, 2900);
const DEEP = P("deep528", 456, 592);
const ELBOW = P("elbow526", 1532, 1613);
const BACK = P("back529", 1409, 964);

type CK = [number, number, number, number];
type PinS = { t0: number; t1?: number; pt: [number, number]; text: string; dx?: number; dy?: number; hot?: boolean; size?: number; col?: string };

/** diagram panel with a camera (keys: time, scale, focusX, focusY as viewBox fractions) and pins in viewBox units */
const ZoomBox: React.FC<{ x: number; y: number; w: number; h: number; cw?: number; ch?: number; keys: CK[]; t: number; t0: number; bg?: string; pins?: PinS[]; children: React.ReactNode }> = ({ x, y, w, h, cw = 900, ch = 1000, keys, t, t0, bg = C.card, pins = [], children }) => {
  let cur = 0;
  for (let k = 0; k < keys.length; k++) if (t >= keys[k][0]) cur = k;
  const pv = keys[Math.max(0, cur - 1)], nw = keys[cur];
  const e = cur === 0 ? 1 : ramp(t, nw[0] - 0.2, nw[0] + 1.2);
  const s = (pv[1] + (nw[1] - pv[1]) * e) * (1 + 0.025 * ramp(t, nw[0], nw[0] + 8));
  const fx = pv[2] + (nw[2] - pv[2]) * e, fy = pv[3] + (nw[3] - pv[3]) * e;
  const base = Math.min(w / cw, h / ch) * 0.94;
  const S = base * s;
  let tx = w / 2 - fx * cw * S, ty = h / 2 - fy * ch * S;
  if (cw * S >= w) tx = Math.min(0, Math.max(w - cw * S, tx)); else tx = (w - cw * S) / 2;
  if (ch * S >= h) ty = Math.min(0, Math.max(h - ch * S, ty)); else ty = (h - ch * S) / 2;
  return (
    <div style={abs(x, y, { width: w, height: h, borderRadius: 36, overflow: "hidden", background: bg, boxShadow: `0 0 0 4px ${C.line}, 0 18px 40px rgba(31,42,20,0.10)`, ...pop(t, t0, 0.35) })}>
      <div style={{ position: "absolute", left: tx, top: ty, width: cw, height: ch, transform: `scale(${S})`, transformOrigin: "0 0" }}>{children}</div>
      {pins.map((p, i) => <Tag key={i} t={t} t0={p.t0} t1={p.t1} x={tx} y={ty} w={cw * S} vbw={cw} pt={p.pt} text={p.text} dx={p.dx} dy={p.dy} hot={p.hot} size={p.size ?? 30} col={p.col} />)}
    </div>
  );
};

/** tall plate in a window: keys [time, zoom (1 = plate width fills the window), fx, fy]; pins in plate fractions */
type TPin = { t0: number; t1?: number; x: number; y: number; text: string; dx?: number; dy?: number; hot?: boolean; col?: string; size?: number };
const TallPlate: React.FC<{ src: string; aspect: number; x: number; y: number; w: number; h: number; t: number; t0: number; keys: CK[]; pins?: TPin[]; tag?: string; ring?: { x: number; y: number; t0: number } }> = ({ src, aspect, x, y, w, h, t, t0, keys, pins = [], tag, ring }) => {
  let cur = 0;
  for (let k = 0; k < keys.length; k++) if (t >= keys[k][0]) cur = k;
  const pv = keys[Math.max(0, cur - 1)], nw = keys[cur];
  const e = cur === 0 ? 1 : ramp(t, nw[0] - 0.2, nw[0] + 1.3);
  const z = (pv[1] + (nw[1] - pv[1]) * e) * (1 + 0.03 * ramp(t, nw[0], nw[0] + 8));
  const fx = pv[2] + (nw[2] - pv[2]) * e, fy = pv[3] + (nw[3] - pv[3]) * e;
  const iw = w * z, ih = iw / aspect;
  let tx = w / 2 - fx * iw, ty = h / 2 - fy * ih;
  tx = iw >= w ? Math.min(0, Math.max(w - iw, tx)) : (w - iw) / 2;
  ty = ih >= h ? Math.min(0, Math.max(h - ih, ty)) : (h - ih) / 2;
  return (
    <div style={abs(x, y, { width: w, height: h, borderRadius: 36, overflow: "hidden", background: C.paper, boxShadow: `0 0 0 4px ${C.line}, 0 18px 40px rgba(31,42,20,0.16)`, ...pop(t, t0, 0.35) })}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: tx, top: ty, width: iw, height: ih }} />
      {ring && t >= ring.t0 && [0, 0.33, 0.66].map((ph) => {
        const k = ((t - ring.t0) * 1.2 + ph) % 1;
        const cx = tx + ring.x * iw, cy = ty + ring.y * ih, r = 16 + 70 * k;
        return <div key={ph} style={abs(cx - r, cy - r, { width: 2 * r, height: 2 * r, borderRadius: r, border: `${7 * (1 - k)}px solid ${C.red}`, opacity: 1 - k, boxSizing: "border-box" })} />;
      })}
      {pins.map((p, i) => <Tag key={i} t={t} t0={p.t0} t1={p.t1} x={tx} y={ty} w={iw} vbw={1} pt={[p.x, p.y / aspect]} text={p.text} dx={p.dx ?? 0} dy={p.dy ?? 0} hot={p.hot} col={p.col} size={p.size ?? 30} />)}
      <div style={abs(14, h - 36, { fontFamily: FONT, fontWeight: 700, fontSize: 17, color: C.forest, opacity: 0.6, background: "rgba(247,246,236,0.88)", padding: "2px 10px", borderRadius: 8 })}>Gray's Anatomy, 1918 · public domain</div>
      {tag && <ViewTag t={t} t0={t0 + 0.3} x={18} y={16} text={tag} />}
    </div>
  );
};

export const RowL: React.FC<{ t: number; t0: number; col: string; title: string; sub?: string; w?: number; n?: string; size?: number; on?: boolean }> = ({ t, t0, col, title, sub, w = 700, n, size = 38, on }) => (
  <div style={{ ...pop(t, t0), width: w, display: "flex", alignItems: "center", gap: 18, background: on ? C.banana : C.card, border: `3px solid ${on ? C.bananaDark : C.line}`, borderRadius: 24, padding: "10px 22px", fontFamily: FONT, fontWeight: 800, transformOrigin: "0% 50%", boxSizing: "border-box" }}>
    <div style={{ width: 52, height: 52, borderRadius: 26, background: col, border: `3px solid ${C.forest}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, color: C.forest }}>{n}</div>
    <div>
      <div style={{ fontSize: size, color: C.forest, lineHeight: 1.1 }}>{title}</div>
      {sub && <div style={{ fontSize: size * 0.68, color: C.matcha, lineHeight: 1.15, marginTop: 2 }}>{sub}</div>}
    </div>
  </div>
);
const Col: React.FC<{ x: number; y: number; gap?: number; children: React.ReactNode }> = ({ x, y, gap = 16, children }) => (
  <div style={abs(x, y, { display: "flex", flexDirection: "column", gap })}>{children}</div>
);
export const Hdr: React.FC<{ t: number; t0: number; x: number; y: number; children: React.ReactNode; size?: number; color?: string }> = ({ t, t0, x, y, children, size = 64, color }) => (
  <div style={abs(x, y, { ...pop(t, t0), transformOrigin: "0% 50%" })}><Big size={size} color={color}>{children}</Big></div>
);
/** artery name header: coloured dot + name + sub line */
const AHead: React.FC<{ t: number; t0: number; x: number; y: number; k: string; name: string; sub: string; w?: number; n?: string }> = ({ t, t0, x, y, k, name, sub, w = 940, n }) => (
  <div style={abs(x, y, { ...pop(t, t0, 0.35), width: w, background: C.forest, borderRadius: 28, padding: "16px 26px 20px", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 20, transformOrigin: "0% 50%" })}>
    <div style={{ width: 66, height: 66, borderRadius: 33, background: AC[k], border: `4px solid ${C.paper}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.forest }}>{n}</div>
    <div style={{ fontFamily: FONT, fontWeight: 800 }}>
      <div style={{ fontSize: name.length > 24 ? 40 : 48, color: C.paper, lineHeight: 1.05 }}>{name}</div>
      <div style={{ fontSize: 30, color: C.banana, marginTop: 4 }}>{sub}</div>
    </div>
  </div>
);
/** route strip: Subclavian → Axillary → Brachial → Radial + Ulnar */
const Route: React.FC<{ t: number; t0: number; x: number; y: number; on: number; times?: number[]; size?: number }> = ({ t, t0, x, y, on, times, size = 34 }) => {
  const R: [string, string][] = [["Subclavian", "sub"], ["Axillary", "ax"], ["Brachial", "br"], ["Radial", "rad"], ["Ulnar", "uln"]];
  return (
    <div style={abs(x, y, { display: "flex", gap: 10, alignItems: "center", ...pop(t, t0) , transformOrigin: "0% 50%"})}>
      {R.map(([n, k], i) => (
        <React.Fragment key={n}>
          {i > 0 && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color: C.matcha }}>{i === 4 ? "+" : "→"}</div>}
          <div style={{ opacity: times ? ramp(t, times[i] - 0.1, times[i] + 0.2) : 1, background: on === i ? C.banana : AC[k], color: C.forest, border: `3px solid ${C.forest}`, fontFamily: FONT, fontWeight: 800, fontSize: size, padding: "6px 16px 9px", borderRadius: 16, transform: `scale(${on === i ? 1.08 : 1})` }}>{n}</div>
        </React.Fragment>
      ))}
    </div>
  );
};
const ARM = (t: number, p: Partial<React.ComponentProps<typeof ArmMap>> = {}) => <ArmMap t={t} {...p} />;
const am = (k: string): [number, number] => AM_PT[k];

/** small aortic arch schematic: right side via brachiocephalic trunk, left side straight off the arch */
const ArchMini: React.FC<{ t: number; r: number; l: number }> = ({ t, r, l }) => {
  const gr = ramp(t, r, r + 0.4), gl = ramp(t, l, l + 0.4);
  const V = (d: string, c: string, w: number, g: number) => (
    <g>
      {g > 0 && <path d={d} stroke={C.banana} strokeWidth={w + 22} fill="none" strokeLinecap="round" opacity={0.55 * g} />}
      <path d={d} stroke={C.forest} strokeWidth={w + 6} fill="none" strokeLinecap="round" />
      <path d={d} stroke={c} strokeWidth={w} fill="none" strokeLinecap="round" />
    </g>
  );
  return (
    <svg viewBox="0 0 900 740" width={760} height={625}>
      <rect x={0} y={0} width={900} height={740} rx={40} fill={C.card} />
      {V("M300 700 C 290 520 320 380 450 360 C 580 340 640 420 640 700", AC.aorta, 60, 0)}
      {V("M380 380 C 360 320 330 280 300 250", AC.bct, 30, gr)}
      {V("M300 250 C 300 180 305 120 310 40", AC.cca, 20, 0)}
      {V("M300 250 C 240 230 180 236 70 290", AC.sub, 22, gr)}
      {V("M470 360 C 472 280 476 160 480 40", AC.cca, 20, 0)}
      {V("M540 372 C 600 320 680 280 830 290", AC.sub, 22, gl)}
      <text x={40} y={330} fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.forest}>R subclavian</text>
      <line x1={150} y1={530} x2={340} y2={330} stroke={C.forest} strokeWidth={3} />
      <text x={20} y={565} fontFamily={FONT} fontWeight={800} fontSize={28} fill={C.forest}>brachiocephalic</text>
      <text x={20} y={600} fontFamily={FONT} fontWeight={800} fontSize={28} fill={C.forest}>trunk</text>
      <text x={680} y={250} fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.forest}>L subclavian</text>
      <text x={290} y={36} textAnchor="end" fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.matcha}>R common carotid</text>
      <text x={500} y={36} fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.matcha}>L common carotid</text>
      <text x={470} y={560} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill={C.forest}>arch of aorta</text>
      <text x={880} y={720} textAnchor="end" fontFamily={FONT} fontWeight={800} fontSize={22} fill={C.matcha}>front view</text>
    </svg>
  );
};

/* ================= 0. INTRO ================= */
export const SIntro: React.FC = () => {
  const t = useT();
  const m1 = s_(3) - 0.2, m2 = s_(6) - 0.2;
  const g0 = 0.6;
  return (
    <Stage a={-1} b={BE(0)}>
      <Seg t={t} a={-1} b={m1}>
        <ZoomBox x={0} y={0} w={760} h={740} cw={900} ch={1600} t={t} t0={-1} keys={[[0, 1.0, 0.5, 0.5], [wf(0, "collarbone"), 1.9, 0.62, 0.17], [wf(0, "fingertips"), 1.9, 0.22, 0.85], [s_(1), 1.0, 0.5, 0.5]]}>
          {ARM(t, { grow: { aorta: -1, bct: -1, cca: -1, sub: g0, ax: g0 + 0.9, br: g0 + 1.8, rad: g0 + 2.7, uln: g0 + 2.7, sarch: g0 + 3.6, darch: g0 + 3.6, digit: g0 + 4.2 }, show: ["aorta", "bct", "cca", "sub", "ax", "br", "rad", "uln", "sarch", "darch", "digit"], marks: { rib: wf(1, "three"), teres: wf(1, "three") + 0.3, elbow: wf(1, "three") + 0.6 } })}
        </ZoomBox>
        <ViewTag t={t} t0={0} x={24} y={20} text="RIGHT UPPER LIMB · SCHEMATIC" />
        <div style={abs(820, 0, { width: 980, ...pop(t, 0.2) })}>
          <Big size={88}><Mk p={ramp(t, 0.6, 1.6)}>Arteries of the</Mk></Big>
          <Big size={88}><Mk p={ramp(t, 1.0, 2.0)}>Upper Limb</Mk></Big>
          <Big size={40} color={C.matcha} style={{ marginTop: 10 }}>collarbone → fingertips · in about 10 minutes</Big>
        </div>
        <div style={abs(820, 300, { display: "flex", flexDirection: "column", gap: 18 })}>
          <div><Chip t={t} t0={wf(0, "one")} bg={C.forest} size={40}>1 artery feeds the entire arm</Chip></div>
          <div><Chip t={t} t0={wf(1, "changes")} bg={C.red} size={40}>…but it changes its NAME 3 times</Chip></div>
        </div>
        <Route t={t} t0={s_(2)} x={820} y={470} on={-1} times={[wf(2, "subclavian"), wf(2, "axillary"), wf(2, "brachial"), wf(2, "radial"), wf(2, "ulnar")]} size={31} />
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <ZoomBox x={0} y={0} w={760} h={740} cw={900} ch={1600} t={t} t0={m1} keys={[[m1, 1.0, 0.5, 0.5], [s_(5), 2.2, 0.22, 0.76]]}
          pins={[
            { t0: wf(4, "where"), t1: s_(5), pt: am("rib"), text: "?", dx: 110, dy: -40, hot: true, size: 44 },
            { t0: wf(4, "where") + 0.3, t1: s_(5), pt: am("teres"), text: "?", dx: 120, dy: 30, hot: true, size: 44 },
            { t0: wf(4, "where") + 0.6, t1: s_(5), pt: am("elbow"), text: "?", dx: 120, dy: 0, hot: true, size: 44 },
            { t0: wf(5, "pulse"), pt: am("wrist"), text: "which artery?", dx: 160, dy: -50, hot: true, size: 34 },
          ]}>
          {ARM(t, { marks: { rib: wf(4, "where"), teres: wf(4, "where") + 0.3, elbow: wf(4, "where") + 0.6 }, pulses: [{ k: "wrist", t0: wf(5, "pulse") }], show: ["aorta", "bct", "cca", "sub", "ax", "br", "rad", "uln", "sarch", "darch", "digit"] })}
        </ZoomBox>
        <ViewTag t={t} t0={m1 + 0.3} x={24} y={20} text="RIGHT UPPER LIMB · SCHEMATIC" />
        <div style={abs(820, 20, { display: "flex", flexDirection: "column", gap: 26 })}>
          <div><Chip t={t} t0={s_(3)} bg={C.matcha} size={36}>keep these 2 in mind:</Chip></div>
          <div><Chip t={t} t0={s_(4)} bg={C.forest} size={42}>1. Where exactly does each name change?</Chip></div>
          <div><Chip t={t} t0={s_(5)} bg={C.red} size={42}>2. Wrist pulse: which artery is it?</Chip></div>
        </div>
        <div style={abs(820, 330, { width: 960, opacity: ramp(t, e_(5) - 0.2, e_(5) + 0.3) })}>
          <Big size={46} color={C.matcha}>…you'll answer both by the end.</Big>
        </div>
      </Seg>
      <Seg t={t} a={m2} b={BE(0) + 0.1}>
        <KPlate {...FORE} x={130} y={0} w={250} a={m2} b={BE(0) + 0.1} keys={[[m2, 1.0, 0.5, 0.5]]} />
        <div style={abs(0, 0, { width: 760, height: 740 })}>
          <KPlate {...NECK} x={400} y={0} w={360} a={m2 + 0.3} b={BE(0) + 0.1} keys={[[m2, 1.0, 0.5, 0.5], [s_(7), 1.6, 0.48, 0.82]]} credit={false} />
          <KPlate {...AXIL} x={400} y={400} w={360} a={m2 + 0.6} b={BE(0) + 0.1} keys={[[m2, 1.0, 0.5, 0.5]]} credit={false} />
        </div>
        <div style={abs(820, 0)}><Chip t={t} t0={s_(6)} bg={C.forest} size={44}>In about 10 minutes you'll:</Chip></div>
        <Col x={820} y={100} gap={14}>
          <RowL t={t} t0={wf(6, "trace")} col={AC.sub} n="1" title="trace the whole route" sub="neck → armpit → arm → forearm → hand" w={900} />
          <RowL t={t} t0={wf(6, "every")} col={AC.ax} n="2" title="name every major branch" w={900} />
          <RowL t={t} t0={wf(6, "simple")} col={AC.rad} n="3" title="lock them in with simple tricks" w={900} />
        </Col>
        <div style={abs(820, 470)}><Chip t={t} t0={wf(7, "quiz")} bg={C.red} size={46}>+ 5-question quiz at the end</Chip></div>
      </Seg>
    </Stage>
  );
};

/* ================= 1. BIG PICTURE ================= */
export const SBig: React.FC = () => {
  const t = useT();
  const a = ST(1), b = BE(1);
  const k2 = s_(11) - 0.2, k3 = s_(13) - 0.2, k4 = s_(15) - 0.2, k5 = s_(17) - 0.2;
  const nb = wf(9, "neighborhoods");
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={k2}>
        <ZoomBox x={0} y={0} w={760} h={740} cw={900} ch={1600} t={t} t0={a} keys={[[a, 1.0, 0.5, 0.5]]}>
          {ARM(t, { lit: t < nb ? {} : { sub: nb, ax: nb + 0.4, br: nb + 0.8, rad: nb + 1.2, uln: nb + 1.2 }, dimAll: false, show: ["aorta", "bct", "cca", "sub", "ax", "br", "rad", "uln", "sarch", "darch", "digit"], marks: { rib: s_(10) + 0.3, teres: s_(10) + 0.7, elbow: s_(10) + 1.1 } })}
        </ZoomBox>
        <ViewTag t={t} t0={a + 0.3} x={24} y={20} text="RIGHT UPPER LIMB · SCHEMATIC" />
        <Hdr t={t} t0={a} x={820} y={0} size={72}>One pipe, many names</Hdr>
        <Facts x={820} y={110} w={940} items={[
          { t: wf(9, "pipe"), text: "1 long pipe = 1 continuous artery", bg: C.forest },
          { t: nb, text: "different NAMES for different neighborhoods" },
          { t: s_(10), big: "3", text: "landmarks = 3 name changes", bg: C.matcha },
        ]} />
        <Route t={t} t0={nb} x={820} y={620} on={-1} size={28} />
      </Seg>
      <Seg t={t} a={k2} b={k3}>
        <ZoomBox x={0} y={0} w={760} h={740} cw={900} ch={1600} t={t} t0={k2} keys={[[k2, 1.0, 0.5, 0.5], [wf(11, "first"), 2.6, 0.55, 0.17]]}
          pins={[{ t0: wf(11, "first"), pt: am("rib"), text: "1st rib · outer border", dx: 40, dy: 120, hot: true }, { t0: wf(12, "subclavian"), pt: [560, 222], text: "subclavian", dx: 30, dy: -90, col: AC.sub }, { t0: wf(12, "axillary"), pt: [400, 352], text: "axillary", dx: -40, dy: 110, col: AC.ax }]}>
          {ARM(t, { lit: { sub: wf(12, "subclavian"), ax: wf(12, "axillary") }, marks: { rib: wf(11, "first") } })}
        </ZoomBox>
        <ViewTag t={t} t0={k2 + 0.3} x={24} y={20} text="LANDMARK 1 · SCHEMATIC" />
        <AHead t={t} t0={s_(11)} x={820} y={0} k="sub" n="1" name="Outer border of the 1st rib" sub="landmark 1" />
        <Col x={820} y={170} gap={16}>
          <RowL t={t} t0={wf(12, "before")} col={AC.sub} title="before it → SUBCLAVIAN" w={900} on={t < wf(12, "after")} />
          <RowL t={t} t0={wf(12, "after")} col={AC.ax} title="after it → AXILLARY" w={900} on={t >= wf(12, "after")} />
        </Col>
      </Seg>
      <Seg t={t} a={k3} b={k4}>
        <KPlate {...AXIL} x={0} y={0} w={760} a={k3} b={k4} keys={[[k3, 1.0, 0.5, 0.5], [wf(13, "teres"), 1.7, 0.36, 0.62]]}
          labels={[
            { x: 0.48, y: 0.69, text: "teres major", t: wf(13, "teres"), side: "r", hot: true },
            { x: 0.40, y: 0.42, text: "axillary a.", t: wf(14, "axillary"), side: "r", col: AC.ax },
            { x: 0.21, y: 0.64, text: "brachial a.", t: wf(14, "brachial"), side: "r", col: AC.br },
          ]} />
        <ViewTag t={t} t0={k3 + 0.3} x={20} y={16} text="GRAY'S 1918 · FIG. 523 · THE AXILLARY ARTERY" />
        <AHead t={t} t0={s_(13)} x={820} y={0} k="ax" n="2" name="Lower border of teres major" sub="landmark 2" />
        <Col x={820} y={170} gap={16}>
          <RowL t={t} t0={wf(14, "axillary")} col={AC.ax} title="AXILLARY above it" w={900} />
          <RowL t={t} t0={wf(14, "brachial")} col={AC.br} title="BRACHIAL below it" w={900} on />
        </Col>
      </Seg>
      <Seg t={t} a={k4} b={k5}>
        <ZoomBox x={0} y={0} w={760} h={740} cw={900} ch={820} t={t} t0={k4} keys={[[k4, 1.0, 0.5, 0.5], [wf(16, "splits"), 1.25, 0.5, 0.7]]}
          pins={[{ t0: wf(16, "radial"), pt: CF_PT.rad, text: "radial", dx: -120, dy: -20, col: AC.rad }, { t0: wf(16, "ulnar"), pt: CF_PT.uln, text: "ulnar", dx: 120, dy: -20, col: AC.uln }, { t0: wf(15, "pit"), pt: CF_PT.top, text: "elbow crease", dx: 0, dy: 60 }]}>
          <Cubital t={t} show={{ borders: k4, art: k4 + 0.3, ten: k4 + 0.3, split: wf(16, "splits") }} />
        </ZoomBox>
        <ViewTag t={t} t0={k4 + 0.3} x={24} y={20} text="CUBITAL FOSSA · RIGHT ELBOW · FRONT" />
        <AHead t={t} t0={s_(15)} x={820} y={0} k="br" n="3" name="The cubital fossa" sub="landmark 3 · the pit in front of the elbow" />
        <Facts x={820} y={170} w={940} items={[
          { t: wf(16, "neck"), text: "level: about the NECK of the radius" },
          { t: wf(16, "splits"), text: "brachial → RADIAL + ULNAR", bg: C.forest },
        ]} />
      </Seg>
      <Seg t={t} a={k5} b={b + 0.1}>
        <ZoomBox x={0} y={0} w={760} h={740} cw={900} ch={1000} t={t} t0={k5} keys={[[k5, 1.0, 0.5, 0.55]]}
          pins={[{ t0: wf(17, "two") + 0.4, pt: HA_PT.sarch, text: "arch 1", dx: 0, dy: -70, col: AC.sarch }, { t0: wf(17, "two") + 0.8, pt: HA_PT.darch, text: "arch 2", dx: 0, dy: 70, col: AC.darch }]}>
          <Hand t={t} grow={{ sarch: wf(17, "join"), darch: wf(17, "join") + 0.3, digit: wf(17, "arches") }} />
        </ZoomBox>
        <ViewTag t={t} t0={k5 + 0.3} x={24} y={20} text="RIGHT PALM · SCHEMATIC" />
        <Hdr t={t} t0={s_(17)} x={820} y={0} size={64}>…and they meet again</Hdr>
        <Facts x={820} y={100} w={940} items={[
          { t: wf(17, "join"), text: "radial + ulnar JOIN UP in the hand" },
          { t: wf(17, "two"), big: "2", text: "arches in the palm", bg: C.matcha },
        ]} />
        <div style={abs(820, 470, { ...pop(t, s_(18)), display: "flex", gap: 12, alignItems: "center" })}>
          {([["RIB", wf(18, "rib")], ["TERES", wf(18, "teres")], ["ELBOW", wf(18, "elbow")], ["2 ARCHES", wf(18, "arches")]] as [string, number][]).map(([x, tt], i) => (
            <React.Fragment key={x}>
              {i > 0 && <Big size={44} color={C.matcha}>→</Big>}
              <div style={{ ...pop(t, tt), background: C.forest, color: C.banana, fontFamily: FONT, fontWeight: 800, fontSize: 38, padding: "8px 18px 12px", borderRadius: 18 }}>{x}</div>
            </React.Fragment>
          ))}
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 2. SUBCLAVIAN ================= */
const SUBB: [string, string, number][] = [["Vertebral", "vert", 27], ["Internal thoracic", "intth", 29], ["Thyrocervical trunk", "tcx", 31], ["Costocervical trunk", "ccx", 33], ["Dorsal scapular", "dsc", 34]];
export const SSub: React.FC = () => {
  const t = useT();
  const a = ST(2), b = BE(2);
  const k2 = s_(23) - 0.2, k3 = s_(24) - 0.2, k4 = s_(26) - 0.2, k5 = s_(31) - 0.2;
  const cur = SUBB.reduce((acc, x, i) => (t >= s_(x[2]) - 0.1 ? i : acc), -1);
  const list = (y0: number) => (
    <Col x={820} y={y0} gap={12}>
      {SUBB.map(([n, k, si], i) => <RowL key={n} t={t} t0={s_(si)} col={AC[k]} n={String(i + 1)} title={n} w={900} size={36} on={i === cur} />)}
    </Col>
  );
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={k2}>
        <div style={abs(0, 0, { ...pop(t, a, 0.35) })}><ArchMini t={t} r={s_(21)} l={s_(22)} /></div>
        <AHead t={t} t0={a} x={820} y={0} k="sub" name="Subclavian artery" sub="from the root of the neck to the 1st rib" />
        <Facts x={820} y={170} w={940} items={[
          { t: s_(20), text: "the 2 sides START differently" },
          { t: s_(21), text: "RIGHT: from the brachiocephalic trunk", bg: C.forest },
          { t: s_(22), text: "LEFT: straight off the arch of the aorta", bg: C.matcha },
        ]} />
      </Seg>
      <Seg t={t} a={k2} b={k3}>
        <KPlate {...NECK} x={0} y={0} w={700} a={k2} b={k3} keys={[[k2, 1.15, 0.5, 0.6], [wf(23, "first"), 1.9, 0.47, 0.8], [wf(23, "scalene"), 1.9, 0.58, 0.76]]}
          labels={[
            { x: 0.455, y: 0.843, text: "subclavian a.", t: wf(23, "arches"), side: "l", col: AC.sub },
            { x: 0.27, y: 0.93, text: "clavicle", t: wf(23, "rib"), side: "r" },
            { x: 0.548, y: 0.70, text: "anterior scalene", t: wf(23, "scalene"), side: "r", hot: true },
          ]} />
        <ViewTag t={t} t0={k2 + 0.3} x={20} y={16} text="GRAY'S 1918 · FIG. 520 · RIGHT SIDE OF THE NECK" />
        <Note t={t} t0={wf(23, "scalene") + 0.6} old="scalenus anterior" modern="anterior scalene" x={760} y={650} />
        <Hdr t={t} t0={k2} x={760} y={0} size={60}>Over the 1st rib…</Hdr>
        <Facts x={760} y={100} w={1000} items={[
          { t: wf(23, "arches"), text: "it arches over the 1st rib" },
          { t: wf(23, "scalene"), text: "the ANTERIOR SCALENE crosses in front of it", bg: C.forest },
        ]} />
      </Seg>
      <Seg t={t} a={k3} b={k4}>
        <Panel x={0} y={0} w={1000} h={740} t={t} t0={k3}>
          <div style={abs(50, 60)}>
            <ThreeParts t={t} t0={k3} muscle="anterior scalene" col={AC.sub} left="← from the arch / BCT" right="1st rib →" counts={["before", "behind", "beyond"]} branches={[]} />
          </div>
        </Panel>
        <ViewTag t={t} t0={k3 + 0.3} x={24} y={20} text="SUBCLAVIAN · 3 PARTS · SCHEMATIC" />
        <Hdr t={t} t0={s_(24)} x={1060} y={0} size={60}>3 parts</Hdr>
        <Col x={1060} y={110} gap={16}>
          <RowL t={t} t0={wf(25, "one")} col={AC.sub} n="1" title="before the muscle" w={700} />
          <RowL t={t} t0={wf(25, "two")} col={AC.sub} n="2" title="behind it" w={700} />
          <RowL t={t} t0={wf(25, "three")} col={AC.sub} n="3" title="beyond it → 1st rib" w={700} />
        </Col>
      </Seg>
      <Seg t={t} a={k4} b={k5}>
        <ZoomBox x={0} y={0} w={760} h={740} cw={900} ch={1600} t={t} t0={k4} keys={[[k4, 2.2, 0.62, 0.13], [s_(29), 2.0, 0.66, 0.2]]}
          pins={[
            { t0: s_(27), pt: [648, 120], text: "vertebral", dx: 110, dy: 0, col: AC.vert },
            { t0: wf(28, "brain"), pt: [650, 50], text: "→ brain", dx: -150, dy: 50 },
            { t0: s_(29), pt: [662, 440], text: "internal thoracic", dx: 40, dy: 0, col: AC.intth },
            { t0: wf(30, "sternum"), pt: [760, 520], text: "sternum side", dx: 0, dy: 60 },
          ]}>
          {ARM(t, { lit: cur >= 0 ? { [SUBB[cur][1]]: s_(SUBB[cur][2]) } : { sub: k4 }, scal: k4, show: ["aorta", "bct", "cca", "sub", "ax", "vert", "intth", "tcx", "ccx", "dsc"] })}
        </ZoomBox>
        <ViewTag t={t} t0={k4 + 0.3} x={24} y={20} text="SUBCLAVIAN BRANCHES · SCHEMATIC" />
        <Hdr t={t} t0={s_(26)} x={820} y={0} size={56}>5 main branches</Hdr>
        {list(90)}
        <div style={abs(820, 560, { width: 900 })}>
          <Facts x={0} y={0} w={900} items={[
            { t: wf(28, "transverse"), text: "through the TRANSVERSE FORAMINA of the neck vertebrae", bg: C.forest },
            { t: wf(30, "behind"), text: "behind the front chest wall, beside the sternum", bg: C.matcha },
          ].filter((x) => t < (x.t < s_(29) ? s_(29) - 0.1 : 9999))} />
        </div>
      </Seg>
      <Seg t={t} a={k5} b={b + 0.1}>
        <Panel x={0} y={0} w={760} h={740} t={t} t0={k5}>
          <div style={abs(14, 110, { transform: "scale(0.81)", transformOrigin: "0 0" })}>
            <ThreeParts t={t} t0={k5 - 1.5} muscle="anterior scalene" col={AC.sub} left="part 1" right="part 3" counts={["3", "1", "1"]} branches={[
              { x: 110, up: true, name: "V", t0: k5, col: AC.vert }, { x: 200, up: false, name: "I", t0: k5, col: AC.intth }, { x: 290, up: true, name: "T", t0: s_(31), col: AC.tcx },
              { x: 392, up: true, name: "C", t0: s_(33), col: AC.ccx }, { x: 700, up: true, name: "D", t0: s_(34), col: AC.dsc },
            ]} />
          </div>
        </Panel>
        <ViewTag t={t} t0={k5 + 0.3} x={24} y={20} text="WHICH PART GIVES WHAT · 3-1-1" />
        <Hdr t={t} t0={k5} x={820} y={0} size={56}>5 main branches</Hdr>
        {list(90)}
        <div style={abs(820, 590, { width: 940 })}>
          {t < s_(33) - 0.1 && <Chip t={t} t0={wf(32, "thyroid")} bg={C.forest} size={30}>→ thyroid · neck · shoulder blade</Chip>}
          {t >= s_(33) - 0.1 && t < s_(34) - 0.1 && <Chip t={t} t0={s_(33)} bg={C.forest} size={30}>→ deep neck muscles · 1st 2 intercostal spaces</Chip>}
          {t >= s_(34) - 0.1 && <Chip t={t} t0={wf(34, "part")} bg={C.forest} size={30}>usually from PART 3 → inner border of the scapula</Chip>}
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 3. AXILLARY ================= */
const AXB: [string, string, number, string][] = [["Superior thoracic", "supth", 41, "1"], ["Thoracoacromial", "thac", 42, "2"], ["Lateral thoracic", "latth", 43, "2"], ["Subscapular", "subsc", 44, "3"], ["Ant. circumflex humeral", "ach", 46, "3"], ["Post. circumflex humeral", "pch", 46, "3"]];
export const SAx: React.FC = () => {
  const t = useT();
  const a = ST(3), b = BE(3);
  const k2 = s_(37) - 0.2, k3 = s_(44) - 0.2, k4 = s_(46) - 0.2, k5 = s_(49) - 0.2;
  const cur = AXB.reduce((acc, x, i) => (t >= s_(x[2]) - 0.1 ? i : acc), -1);
  const list = (y0: number, x0 = 820, w = 900) => (
    <Col x={x0} y={y0} gap={10}>
      {AXB.map(([n, k, si, part], i) => <RowL key={n} t={t} t0={s_(si) + (i === 5 ? 0.6 : 0)} col={AC[k]} n={part} title={n} w={w} size={34} on={i === cur || (cur === 4 && i === 5 && t >= s_(46) + 0.6)} />)}
    </Col>
  );
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={k2}>
        <KPlate {...AXIL} x={0} y={0} w={760} a={a} b={k2} keys={[[a, 1.0, 0.5, 0.5], [s_(35), 1.5, 0.52, 0.3], [wf(36, "cords"), 1.7, 0.42, 0.42]]}
          labels={[
            { x: 0.56, y: 0.245, text: "axillary a.", t: s_(35) + 0.6, side: "r", col: AC.ax },
            { x: 0.44, y: 0.40, text: "brachial plexus cords", t: wf(36, "cords"), side: "l", hot: true },
          ]} />
        <ViewTag t={t} t0={a + 0.3} x={20} y={16} text="GRAY'S 1918 · FIG. 523 · RIGHT AXILLA" />
        <AHead t={t} t0={a} x={820} y={0} k="ax" name="Axillary artery" sub="1st rib → lower border of teres major" />
        <Facts x={820} y={170} w={940} items={[
          { t: wf(35, "armpit"), text: "enters the ARMPIT (axilla)" },
          { t: wf(36, "axillary"), text: "inside the AXILLARY SHEATH", bg: C.forest },
          { t: wf(36, "cords"), text: "wrapped with the CORDS of the brachial plexus", bg: C.matcha },
        ]} />
      </Seg>
      <Seg t={t} a={k2} b={k3}>
        <Panel x={0} y={0} w={760} h={740} t={t} t0={k2}>
          <div style={abs(14, 110, { transform: "scale(0.81)", transformOrigin: "0 0" })}>
            <ThreeParts t={t} t0={k2} muscle="pectoralis minor" col={AC.ax} left="1st rib" right="teres major" counts={t >= wf(40, "one") ? ["1", "2", "3"] : ["", "", ""]} branches={[
              { x: 200, up: true, name: "S", t0: s_(41), col: AC.supth },
              { x: 400, up: true, name: "T", t0: s_(42), col: AC.thac }, { x: 500, up: false, name: "L", t0: s_(43), col: AC.latth },
              { x: 620, up: false, name: "S", t0: s_(44), col: AC.subsc }, { x: 720, up: true, name: "A", t0: s_(46), col: AC.ach }, { x: 790, up: false, name: "P", t0: s_(46), col: AC.pch },
            ]} />
          </div>
          {t >= wf(40, "one") && <div style={abs(40, 34, { ...pop(t, wf(40, "one")), fontFamily: FONT, fontWeight: 800, fontSize: 50, color: C.red })}>1 · 2 · 3</div>}
        </Panel>
        <ViewTag t={t} t0={k2 + 0.3} x={250} y={40} text="AXILLARY · 3 PARTS · SCHEMATIC" />
        <Hdr t={t} t0={s_(37)} x={820} y={0} size={50}>Pectoralis minor splits it in 3</Hdr>
        {t < s_(41) - 0.1 ? (
          <Facts x={820} y={90} w={940} items={[
            { t: s_(37), text: "PECTORALIS MINOR crosses in front", bg: C.forest },
            { t: s_(38), text: "→ again, 3 parts" },
            { t: s_(40), big: "1 · 2 · 3", text: "part 1 = 1 branch, part 2 = 2, part 3 = 3", bg: C.red },
          ]} />
        ) : list(90)}
        {t >= s_(41) - 0.1 && t < s_(44) - 0.1 && (
          <div style={abs(820, 620)}>
            <Chip t={t} t0={s_(41)} bg={C.forest} size={30}>{t < s_(42) - 0.1 ? "→ top of the chest wall" : t < s_(43) - 0.1 ? "→ fans out to chest + shoulder" : "→ down the side of the chest wall"}</Chip>
          </div>
        )}
      </Seg>
      <Seg t={t} a={k3} b={k4}>
        <ZoomBox x={0} y={0} w={760} h={740} cw={900} ch={1600} t={t} t0={k3} keys={[[k3, 2.4, 0.43, 0.27], [s_(45), 2.4, 0.46, 0.36]]}
          pins={[{ t0: s_(44) + 0.3, pt: [396, 520], text: "subscapular", dx: -150, dy: 0, col: AC.subsc }, { t0: wf(45, "thoracodorsal"), pt: [440, 680], text: "thoracodorsal", dx: 130, dy: -20, col: AC.thd }, { t0: wf(45, "latissimus"), pt: [452, 720], text: "→ latissimus dorsi", dx: -60, dy: 70 }]}>
          {ARM(t, { lit: { subsc: s_(44), thd: wf(45, "thoracodorsal") }, pec: k3, show: ["sub", "ax", "br", "supth", "thac", "latth", "subsc", "thd", "ach", "pch"] })}
        </ZoomBox>
        <ViewTag t={t} t0={k3 + 0.3} x={24} y={20} text="PART 3 · SCHEMATIC" />
        <Hdr t={t} t0={k3} x={820} y={0} size={50}>Branches, part by part</Hdr>
        {list(90)}
        <div style={abs(820, 640)}><Chip t={t} t0={wf(44, "biggest")} bg={C.red} size={30}>subscapular = the BIGGEST branch</Chip></div>
      </Seg>
      <Seg t={t} a={k4} b={k5}>
        <ZoomBox x={0} y={0} w={760} h={740} cw={900} ch={1600} t={t} t0={k4} keys={[[k4, 3.2, 0.36, 0.25]]}
          pins={[{ t0: wf(46, "anterior"), pt: [300, 402], text: "anterior", dx: -40, dy: -110, col: AC.ach }, { t0: wf(46, "posterior"), pt: [282, 424], text: "posterior", dx: -60, dy: 100, col: AC.pch }, { t0: wf(48, "axillary"), pt: [270, 436], text: "+ axillary nerve", dx: 120, dy: 160 }]}>
          {ARM(t, { lit: { ach: wf(46, "anterior"), pch: wf(46, "posterior") }, show: ["sub", "ax", "br", "ach", "pch", "subsc"] })}
        </ZoomBox>
        <ViewTag t={t} t0={k4 + 0.3} x={24} y={20} text="AROUND THE HUMERUS · SCHEMATIC" />
        <Hdr t={t} t0={k4} x={820} y={0} size={50}>Branches, part by part</Hdr>
        {list(90)}
        <div style={abs(820, 640)}><Chip t={t} t0={wf(47, "collar")} bg={C.forest} size={30}>{t < s_(48) ? "a COLLAR around the surgical neck" : "posterior = bigger · runs with the axillary nerve"}</Chip></div>
      </Seg>
      <Seg t={t} a={k5} b={b + 0.1}>
        <ZoomBox x={0} y={0} w={760} h={740} cw={900} ch={1600} t={t} t0={k5} keys={[[k5, 2.0, 0.38, 0.3]]}
          pins={[{ t0: wf(49, "teres"), pt: am("teres"), text: "lower border of teres major", dx: 40, dy: 120, hot: true }]}>
          {ARM(t, { lit: { ax: k5, br: wf(49, "brachial") }, marks: { teres: wf(49, "teres") }, show: ["sub", "ax", "br", "aorta", "bct", "cca"] })}
        </ZoomBox>
        <ViewTag t={t} t0={k5 + 0.3} x={24} y={20} text="LANDMARK 2 · SCHEMATIC" />
        <Route t={t} t0={k5} x={820} y={40} on={t >= wf(49, "brachial") ? 2 : 1} size={30} />
        <Facts x={820} y={150} w={940} items={[
          { t: wf(49, "lower"), text: "axillary ENDS at the lower border of teres major", bg: C.forest },
          { t: wf(49, "brachial"), text: "→ the BRACHIAL artery begins", bg: C.matcha },
        ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 4. BRACHIAL ================= */
export const SBr: React.FC = () => {
  const t = useT();
  const a = ST(4), b = BE(4);
  const k2 = s_(53) - 0.2, k3 = s_(54) - 0.2, k4 = s_(56) - 0.2, k5 = s_(58) - 0.2;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={k2}>
        <TallPlate {...BRACH} x={0} y={0} w={760} h={740} t={t} t0={a} keys={[[a, 1.0, 0.5, 0.35], [wf(51, "biceps"), 1.0, 0.5, 0.55], [s_(52), 1.6, 0.75, 0.38]]} tag="GRAY'S 1918 · FIG. 525 · RIGHT ARM"
          pins={[
            { t0: s_(50) + 0.4, x: 0.645, y: 0.56, text: "brachial a.", dx: 180, dy: 30, col: AC.br },
            { t0: wf(51, "biceps"), x: 0.36, y: 0.52, text: "biceps", dx: -40, dy: -80 },
            { t0: wf(52, "profunda"), x: 0.79, y: 0.375, text: "profunda brachii", dx: -40, dy: -70, hot: true },
          ]} />
        <AHead t={t} t0={a} x={820} y={0} k="br" name="Brachial artery" sub="teres major → cubital fossa" />
        <Facts x={820} y={170} w={940} items={[
          { t: s_(50), text: "the MAIN artery of the arm" },
          { t: wf(51, "groove"), text: "inner side, in the groove MEDIAL to the biceps", bg: C.forest },
          { t: wf(52, "profunda"), text: "biggest branch: PROFUNDA BRACHII = deep artery of the arm", bg: C.matcha },
        ]} />
      </Seg>
      <Seg t={t} a={k2} b={k3}>
        <ZoomBox x={0} y={0} w={760} h={740} cw={900} ch={1600} t={t} t0={k2} keys={[[k2, 2.1, 0.33, 0.38]]}
          pins={[{ t0: s_(53) + 0.3, pt: [250, 640], text: "profunda brachii", dx: -40, dy: -170, col: AC.prof }, { t0: wf(53, "radial"), pt: [242, 760], text: "+ radial nerve · radial groove", dx: 170, dy: 90 }, { t0: wf(53, "triceps"), pt: [222, 560], text: "→ triceps", dx: -60, dy: 70 }]}>
          {ARM(t, { lit: { prof: s_(53) }, show: ["ax", "br", "rad", "uln", "prof", "suc", "iuc"] })}
        </ZoomBox>
        <ViewTag t={t} t0={k2 + 0.3} x={24} y={20} text="ARM · SCHEMATIC" />
        <AHead t={t} t0={k2} x={820} y={0} k="prof" name="Profunda brachii" sub="deep artery of the arm" />
        <Facts x={820} y={170} w={940} items={[
          { t: wf(53, "spirals"), text: "spirals around the BACK of the humerus" },
          { t: wf(53, "radial"), text: "with the RADIAL NERVE, in the radial groove", bg: C.forest },
          { t: wf(53, "triceps"), text: "supplies the TRICEPS", bg: C.matcha },
        ]} />
      </Seg>
      <Seg t={t} a={k3} b={k4}>
        <KPlate {...ELBOW} x={0} y={0} w={705} a={k3} b={k4} keys={[[k3, 1.0, 0.5, 0.5], [wf(54, "superior"), 1.5, 0.62, 0.35], [s_(55), 1.0, 0.5, 0.5]]}
          labels={[
            { x: 0.62, y: 0.2, text: "superior ulnar collateral", t: wf(54, "superior"), side: "l", hot: true, t1: s_(55) },
            { x: 0.60, y: 0.43, text: "inferior ulnar collateral", t: wf(54, "inferior"), side: "l", hot: true, t1: s_(55) },
          ]} />
        <ViewTag t={t} t0={k3 + 0.3} x={20} y={16} text="GRAY'S 1918 · FIG. 526 · AROUND THE ELBOW" />
        <Hdr t={t} t0={k3} x={760} y={0} size={56}>Small branches → elbow</Hdr>
        <Facts x={760} y={100} w={1000} items={[
          { t: s_(54), text: "superior + inferior ULNAR COLLATERAL arteries" },
          { t: wf(55, "network"), text: "join a NETWORK around the elbow joint", bg: C.forest },
          { t: wf(55, "more"), text: "→ blood has MORE THAN ONE ROUTE", bg: C.matcha },
        ]} />
      </Seg>
      <Seg t={t} a={k4} b={k5}>
        <Panel x={0} y={0} w={760} h={740} t={t} t0={k4}>
          <div style={abs(205, 20, { transform: "scale(0.7)", transformOrigin: "0 0" })}><MedianCross t={t} t0={wf(57, "starts")} t1={wf(57, "inner") + 0.3} /></div>
        </Panel>
        <ViewTag t={t} t0={k4 + 0.3} x={24} y={20} text="ARM · FRONT · SCHEMATIC" />
        <Tag t={t} t0={wf(57, "starts")} x={0} y={0} w={760} vbw={760} pt={[300, 140]} text="median nerve" dx={-120} dy={40} col={"#E9CF4A"} />
        <Tag t={t} t0={wf(57, "front")} x={0} y={0} w={760} vbw={760} pt={[380, 370]} text="crosses IN FRONT" dx={160} dy={0} hot />
        <AHead t={t} t0={s_(56)} x={820} y={0} k="br" name="Median nerve: its travel partner" sub="the whole way down the arm" />
        <Col x={820} y={170} gap={16}>
          <RowL t={t} t0={wf(57, "outer")} col="#E9CF4A" n="1" title="starts LATERAL to the artery" w={900} />
          <RowL t={t} t0={wf(57, "front")} col="#E9CF4A" n="2" title="crosses IN FRONT · mid-arm" w={900} />
          <RowL t={t} t0={wf(57, "inner")} col="#E9CF4A" n="3" title="ends up MEDIAL" w={900} />
        </Col>
      </Seg>
      <Seg t={t} a={k5} b={b + 0.1}>
        <ZoomBox x={0} y={0} w={760} h={740} cw={900} ch={820} t={t} t0={k5} keys={[[k5, 1.0, 0.5, 0.5], [s_(61), 1.3, 0.5, 0.72]]}
          pins={[
            { t0: wf(59, "biceps"), t1: s_(61), pt: CF_PT.ten, text: "biceps tendon", dx: 0, dy: 330, col: C.card },
            { t0: wf(59, "brachial"), t1: s_(61), pt: CF_PT.art, text: "brachial a.", dx: 60, dy: 200, col: AC.br },
            { t0: wf(59, "median"), t1: s_(61), pt: CF_PT.mn, text: "median n.", dx: 130, dy: 110, col: "#E9CF4A" },
            { t0: wf(60, "pulse"), t1: s_(61), pt: [494, 300], text: "brachial pulse", dx: 170, dy: -170, hot: true },
            { t0: wf(61, "divides"), pt: CF_PT.rad, text: "radial", dx: -120, dy: -20, col: AC.rad },
            { t0: wf(61, "divides") + 0.4, pt: CF_PT.uln, text: "ulnar", dx: 120, dy: -20, col: AC.uln },
          ]}>
          <Cubital t={t} lit={t < wf(59, "biceps") ? {} : t < wf(59, "brachial") ? { ten: wf(59, "biceps") } : t < wf(59, "median") ? { art: wf(59, "brachial") } : t < s_(60) ? { mn: wf(59, "median") } : {}} show={{ borders: k5, rn: k5 + 0.2, ten: wf(59, "biceps") - 0.3, art: wf(59, "brachial") - 0.3, mn: wf(59, "median") - 0.3, split: wf(61, "divides"), pulse: wf(60, "pulse") }} />
        </ZoomBox>
        <ViewTag t={t} t0={k5 + 0.3} x={24} y={20} text="CUBITAL FOSSA · RIGHT ELBOW · FRONT" />
        <Hdr t={t} t0={k5} x={820} y={0} size={56}>Into the cubital fossa</Hdr>
        <Facts x={820} y={100} w={940} items={[
          { t: wf(59, "biceps"), text: "middle: BICEPS TENDON" },
          { t: wf(59, "brachial"), text: "just medial: BRACHIAL ARTERY", bg: C.forest },
          { t: wf(59, "median"), text: "medial to that: MEDIAN NERVE" },
          { t: wf(60, "cuff"), text: "the artery under the BP cuff + stethoscope", bg: C.red },
          { t: wf(61, "divides"), text: "splits at about the neck of the radius", bg: C.matcha },
        ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 5. RADIAL + ULNAR ================= */
export const SRU: React.FC = () => {
  const t = useT();
  const a = ST(5), b = BE(5);
  const k2 = s_(64) - 0.2, k3 = s_(66) - 0.2, k4 = s_(68) - 0.2, k5 = s_(69) - 0.2, k6 = s_(71) - 0.2, k7 = s_(74) - 0.2;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={k2}>
        <TallPlate {...FORE} x={0} y={0} w={760} h={740} t={t} t0={a} keys={[[a, 1.0, 0.45, 0.28], [s_(63), 1.15, 0.38, 0.34]]} tag="GRAY'S 1918 · FIG. 527 · RIGHT FOREARM"
          pins={[
            { t0: s_(62) + 0.3, x: 0.405, y: 0.40, text: "radial a.", dx: 200, dy: 0, col: AC.rad },
            { t0: wf(62, "thumb"), x: 0.16, y: 0.3, text: "thumb side", dx: 30, dy: -90 },
            { t0: wf(63, "brachioradialis"), x: 0.30, y: 0.33, text: "brachioradialis", dx: 30, dy: 110, hot: true },
          ]} />
        <AHead t={t} t0={a} x={820} y={0} k="rad" name="Radial artery" sub="the thumb side of the forearm" />
        <Facts x={820} y={170} w={940} items={[
          { t: wf(62, "thumb"), text: "runs down the THUMB side (lateral)" },
          { t: wf(63, "hides"), text: "hides under BRACHIORADIALIS most of the way", bg: C.forest },
        ]} />
      </Seg>
      <Seg t={t} a={k2} b={k3}>
        <TallPlate {...FORE} x={0} y={0} w={760} h={740} t={t} t0={k2} keys={[[k2, 1.7, 0.45, 0.62]]} tag="GRAY'S 1918 · FIG. 527 · WRIST"
          ring={{ x: 0.428, y: 0.635, t0: s_(65) }}
          pins={[
            { t0: wf(64, "flexor"), x: 0.485, y: 0.62, text: "flexor carpi radialis tendon", dx: 110, dy: 90, hot: true },
            { t0: wf(64, "wrist"), x: 0.428, y: 0.57, text: "radial a.", dx: -120, dy: -120, col: AC.rad },
          ]} />
        <Hdr t={t} t0={k2} x={820} y={0} size={60}>The radial pulse</Hdr>
        <Facts x={820} y={100} w={940} items={[
          { t: wf(64, "skin"), text: "near the wrist: JUST UNDER THE SKIN" },
          { t: wf(64, "flexor"), text: "right beside the FLEXOR CARPI RADIALIS tendon, on its OUTER (lateral) side", bg: C.forest },
          { t: wf(65, "pulse"), text: "→ that's where you feel the RADIAL PULSE", bg: C.red },
        ]} />
      </Seg>
      <Seg t={t} a={k3} b={k4}>
        <KPlate {...BACK} x={0} y={0} w={760} a={k3} b={k4} keys={[[k3, 1.0, 0.5, 0.5], [wf(66, "snuffbox"), 1.9, 0.64, 0.5], [s_(67), 1.8, 0.64, 0.66]]}
          labels={[
            { x: 0.625, y: 0.34, text: "radial a.", t: wf(66, "back"), side: "l", col: AC.rad },
            { x: 0.66, y: 0.45, text: "anatomical snuffbox", t: wf(66, "snuffbox"), side: "l", hot: true, t1: s_(67) },
            { x: 0.655, y: 0.72, text: "1st dorsal interosseous", t: wf(67, "first"), side: "l", hot: true },
          ]} />
        <ViewTag t={t} t0={k3 + 0.3} x={20} y={16} text="GRAY'S 1918 · FIG. 529 · BACK OF THE RIGHT HAND" />
        <Hdr t={t} t0={k3} x={820} y={0} size={60}>Around to the back</Hdr>
        <Facts x={820} y={100} w={940} items={[
          { t: wf(66, "curves"), text: "curves around to the BACK of the wrist" },
          { t: wf(66, "snuffbox"), text: "across the floor of the ANATOMICAL SNUFFBOX", bg: C.forest },
          { t: wf(67, "dives"), text: "dives between the 2 heads of the 1st dorsal interosseous → PALM", bg: C.matcha },
        ]} />
      </Seg>
      <Seg t={t} a={k4} b={k5}>
        <ZoomBox x={0} y={0} w={760} h={740} cw={900} ch={1600} t={t} t0={k4} keys={[[k4, 1.7, 0.26, 0.58], [wf(68, "thumb"), 2.6, 0.17, 0.83]]}
          pins={[{ t0: wf(68, "recurrent"), t1: wf(68, "thumb"), pt: [214, 848], text: "radial recurrent → elbow", dx: 130, dy: -60, col: AC.rrec }, { t0: wf(68, "pollicis"), pt: [96, 1395], text: "princeps pollicis", dx: 190, dy: -130, col: AC.pp }, { t0: wf(68, "indicis"), pt: [162, 1440], text: "radialis indicis", dx: 170, dy: 70, col: AC.ri }]}>
          {ARM(t, { lit: { rrec: wf(68, "recurrent"), pp: wf(68, "pollicis"), ri: wf(68, "indicis") }, show: ["br", "rad", "uln", "rrec", "pp", "ri", "darch", "sarch", "spb"] })}
        </ZoomBox>
        <ViewTag t={t} t0={k4 + 0.3} x={24} y={20} text="RADIAL BRANCHES · SCHEMATIC" />
        <AHead t={t} t0={k4} x={820} y={0} k="rad" name="Radial: 3 named branches" sub="along the way" />
        <Col x={820} y={170} gap={14}>
          <RowL t={t} t0={wf(68, "recurrent")} col={AC.rrec} n="1" title="radial recurrent" sub="back up to the elbow" w={900} />
          <RowL t={t} t0={wf(68, "pollicis")} col={AC.pp} n="2" title="princeps pollicis" sub="pollex = thumb" w={900} />
          <RowL t={t} t0={wf(68, "indicis")} col={AC.ri} n="3" title="radialis indicis" sub="index finger" w={900} />
        </Col>
      </Seg>
      <Seg t={t} a={k5} b={k6}>
        <TallPlate {...FORE} x={0} y={0} w={760} h={740} t={t} t0={k5} keys={[[k5, 1.0, 0.6, 0.35], [s_(70), 1.1, 0.65, 0.45]]} tag="GRAY'S 1918 · FIG. 527 · RIGHT FOREARM"
          pins={[
            { t0: s_(69) + 0.3, x: 0.695, y: 0.55, text: "ulnar a.", dx: -190, dy: 40, col: AC.uln },
            { t0: wf(70, "little"), x: 0.82, y: 0.4, text: "little finger side", dx: -60, dy: -110 },
          ]} />
        <AHead t={t} t0={k5} x={820} y={0} k="uln" name="Ulnar artery" sub="the little-finger side" />
        <Facts x={820} y={170} w={940} items={[
          { t: wf(69, "larger"), big: "larger", text: "the LARGER of the 2 branches", bg: C.forest },
          { t: wf(70, "deep"), text: "runs DEEP to the forearm flexor muscles" },
        ]} />
      </Seg>
      <Seg t={t} a={k6} b={k7}>
        <KPlate {...ELBOW} x={0} y={0} w={705} a={k6} b={k7} keys={[[k6, 1.0, 0.5, 0.5], [wf(71, "common"), 1.5, 0.45, 0.86], [s_(73), 1.3, 0.45, 0.7]]}
          labels={[
            { x: 0.545, y: 0.85, text: "common interosseous", t: wf(71, "common"), side: "l", hot: true, t1: s_(73) },
            { x: 0.495, y: 0.9, text: "posterior interosseous", t: wf(72, "posterior"), side: "l", col: AC.pi, t1: s_(73) },
            { x: 0.47, y: 0.975, text: "anterior interosseous", t: wf(72, "anterior"), side: "l", col: AC.ai, t1: s_(73) },
            { x: 0.63, y: 0.66, text: "anterior ulnar recurrent", t: wf(73, "anterior"), side: "l", hot: true },
            { x: 0.6, y: 0.75, text: "posterior ulnar recurrent", t: wf(73, "posterior"), side: "l", hot: true },
          ]} />
        <ViewTag t={t} t0={k6 + 0.3} x={20} y={16} text="GRAY'S 1918 · FIG. 526" />
        <Note t={t} t0={wf(72, "anterior") + 0.3} old="volar interosseous" modern="anterior interosseous" x={760} y={600} />
        <Note t={t} t0={wf(72, "posterior") + 0.3} old="dorsal interosseous" modern="posterior interosseous" x={760} y={660} />
        <Hdr t={t} t0={k6} x={760} y={0} size={56}>Ulnar: near its start</Hdr>
        <Facts x={760} y={100} w={1000} items={[
          { t: wf(71, "common"), text: "COMMON INTEROSSEOUS artery", bg: C.forest },
          { t: wf(72, "splits"), text: "→ ANTERIOR + POSTERIOR interosseous, one each side of the interosseous membrane" },
          { t: s_(73), text: "+ anterior & posterior ULNAR RECURRENT → back up to the elbow", bg: C.matcha },
        ]} />
      </Seg>
      <Seg t={t} a={k7} b={b + 0.1}>
        <ZoomBox x={0} y={0} w={760} h={740} cw={900} ch={1000} t={t} t0={k7} keys={[[k7, 1.0, 0.5, 0.6], [wf(75, "wrist"), 1.45, 0.62, 0.8]]}
          pins={[
            { t0: wf(74, "ulnar", 0) + 0.2, pt: [698, 940], text: "ulnar nerve", dx: 90, dy: -60, col: "#E9CF4A" },
            { t0: wf(74, "thumb"), pt: [662, 730], text: "artery = thumb side", dx: -220, dy: 40, col: AC.uln },
            { t0: wf(75, "retinaculum"), pt: [500, 870], text: "flexor retinaculum", dx: 0, dy: 80 },
            { t0: wf(75, "guyon's"), pt: [683, 770], text: "Guyon's canal", dx: 60, dy: -170, hot: true },
          ]}>
          <Hand t={t} lit={{ uln: k7 }} layers={{ un: wf(74, "ulnar", 0), ret: wf(75, "retinaculum") - 0.5, guyon: wf(75, "guyon's") }} />
        </ZoomBox>
        <ViewTag t={t} t0={k7 + 0.3} x={24} y={20} text="RIGHT WRIST · PALM SIDE · SCHEMATIC" />
        <Hdr t={t} t0={k7} x={820} y={0} size={56}>Into the hand</Hdr>
        <Facts x={820} y={100} w={940} items={[
          { t: wf(74, "beside"), text: "runs beside the ULNAR NERVE · artery on the thumb side" },
          { t: wf(75, "over"), text: "passes OVER the flexor retinaculum, not under it", bg: C.forest },
          { t: wf(75, "guyon's"), text: "through GUYON'S CANAL", bg: C.red },
        ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 6. PALMAR ARCHES ================= */
export const SArch: React.FC = () => {
  const t = useT();
  const a = ST(6), b = BE(6);
  const k2 = s_(78) - 0.2, k3 = s_(81) - 0.2, k4 = s_(83) - 0.2, k5 = s_(85) - 0.2, k6 = s_(87) - 0.2;
  const PIN = (k: string, txt: string, t0: number, dx: number, dy: number, col?: string, hot?: boolean, t1?: number): PinS => ({ t0, t1, pt: HA_PT[k], text: txt, dx, dy, col, hot });
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={k2}>
        <TallPlate {...FORE} x={0} y={0} w={760} h={740} t={t} t0={a} keys={[[a, 1.7, 0.5, 0.78]]} tag="GRAY'S 1918 · FIG. 527 · RIGHT PALM"
          pins={[{ t0: wf(77, "superficial"), x: 0.55, y: 0.775, text: "superficial palmar arch", dx: 40, dy: 150, hot: true }, { t0: wf(76, "two"), x: 0.67, y: 0.68, text: "ulnar a.", dx: 140, dy: -40, col: AC.uln }, { t0: wf(76, "two"), x: 0.42, y: 0.64, text: "radial a.", dx: -120, dy: -40, col: AC.rad }]} />
        <Note t={t} t0={wf(77, "superficial") + 0.8} old="superficial volar arch" modern="superficial palmar arch" x={30} y={600} />
        <Hdr t={t} t0={a} x={820} y={0} size={60}>The hand: 2 arches</Hdr>
        <Facts x={820} y={100} w={940} items={[
          { t: s_(76), text: "radial + ulnar MEET AGAIN" },
          { t: wf(77, "superficial"), text: "1 SUPERFICIAL arch", bg: C.forest },
          { t: wf(77, "deep"), text: "1 DEEP arch", bg: C.matcha },
        ]} />
      </Seg>
      <Seg t={t} a={k2} b={k3}>
        <ZoomBox x={0} y={0} w={760} h={740} cw={900} ch={1000} t={t} t0={k2} keys={[[k2, 1.0, 0.5, 0.55]]}
          pins={[PIN("sarch", "superficial palmar arch", s_(78) + 0.3, -120, -200, AC.sarch), PIN("spb", "superficial palmar br. (radial)", s_(79), 60, 170, AC.spb), PIN("apo", "palmar aponeurosis", wf(80, "aponeurosis"), 110, -110, C.card), PIN("ten", "flexor tendons (deeper)", wf(80, "flexor"), 90, 120)]}>
          <Hand t={t} lit={{ uln: s_(78), sarch: s_(78) + 0.2, spb: s_(79) }} layers={{ ten: k2, apo: wf(80, "aponeurosis") }} />
        </ZoomBox>
        <ViewTag t={t} t0={k2 + 0.3} x={24} y={20} text="RIGHT PALM · SCHEMATIC" />
        <AHead t={t} t0={k2} x={820} y={0} k="sarch" name="Superficial palmar arch" sub="the more distal arch" />
        <Facts x={820} y={170} w={940} items={[
          { t: wf(78, "ulnar"), text: "made MAINLY by the ULNAR artery", bg: C.forest },
          { t: s_(79), text: "usually completed by the superficial palmar branch of the RADIAL" },
          { t: wf(80, "aponeurosis"), text: "under the palmar aponeurosis · IN FRONT of the flexor tendons", bg: C.matcha },
        ]} />
      </Seg>
      <Seg t={t} a={k3} b={k4}>
        <ZoomBox x={0} y={0} w={760} h={740} cw={900} ch={1000} t={t} t0={k3} keys={[[k3, 1.0, 0.45, 0.48], [s_(82), 1.2, 0.55, 0.35]]}
          pins={[PIN("line", "level of the arch", wf(81, "level"), 30, 70, C.banana, false, s_(82)), PIN("digit", "common palmar digital", wf(82, "common"), 210, -10, AC.digit), { t0: wf(82, "proper"), pt: [384, 160], text: "proper digital", dx: -150, dy: 0, col: AC.digit }]}>
          <Hand t={t} lit={{ sarch: k3, digit: wf(82, "common") }} layers={{ line: wf(81, "stretch"), ten: k3 }} />
        </ZoomBox>
        <ViewTag t={t} t0={k3 + 0.3} x={24} y={20} text="RIGHT PALM · SCHEMATIC" />
        <AHead t={t} t0={k3} x={820} y={0} k="sarch" name="Find it on your own hand" sub="Boeckel's line" />
        <Facts x={820} y={170} w={940} items={[
          { t: wf(81, "stretch"), text: "stretch the thumb out FULLY" },
          { t: wf(81, "level"), text: "arch ≈ level of the thumb's lower (distal) border", bg: C.forest },
          { t: wf(82, "common"), text: "→ COMMON palmar digital arteries → 2 PROPER digital each (sides of the fingers)", bg: C.matcha },
        ]} />
      </Seg>
      <Seg t={t} a={k4} b={k5}>
        <KPlate {...DEEP} x={60} y={0} w={570} a={k4} b={k5} keys={[[k4, 1.0, 0.5, 0.45], [s_(84), 1.25, 0.6, 0.22]]}
          labels={[
            { x: 0.47, y: 0.185, text: "deep palmar arch", t: s_(83) + 0.4, side: "r", hot: true },
            { x: 0.8, y: 0.3, text: "deep palmar br. of ulnar", t: s_(84) + 0.2, side: "l", col: AC.dpb },
          ]} />
        <ViewTag t={t} t0={k4 + 0.3} x={80} y={16} text="GRAY'S 1918 · FIG. 528 · DEEP VIEW" />
        <Note t={t} t0={s_(83) + 1.4} old="deep volar arch" modern="deep palmar arch" x={720} y={420} />
        <AHead t={t} t0={k4} x={720} y={0} k="darch" name="Deep palmar arch" sub="the more proximal arch" w={1040} />
        <Facts x={720} y={170} w={1040} items={[
          { t: wf(83, "radial"), text: "made MAINLY by the RADIAL artery", bg: C.forest },
          { t: s_(84), text: "completed by the DEEP PALMAR BRANCH of the ULNAR" },
        ]} />
      </Seg>
      <Seg t={t} a={k5} b={k6}>
        <ZoomBox x={0} y={0} w={760} h={740} cw={900} ch={1000} t={t} t0={k5} keys={[[k5, 1.15, 0.5, 0.55]]}
          pins={[PIN("darch", "deep arch", s_(85), -60, 120, AC.darch), PIN("sarch", "superficial arch", s_(85) + 0.3, 40, -160, AC.sarch), PIN("meta", "palmar metacarpal", wf(86, "metacarpal"), -150, -40, AC.meta)]}>
          <Hand t={t} lit={{ darch: s_(85), meta: wf(86, "metacarpal") }} layers={{ ten: k5 }} />
        </ZoomBox>
        <ViewTag t={t} t0={k5 + 0.3} x={24} y={20} text="RIGHT PALM · SCHEMATIC" />
        <AHead t={t} t0={k5} x={820} y={0} k="darch" name="Deep palmar arch" sub="where it lies" />
        <Facts x={820} y={170} w={940} items={[
          { t: wf(85, "behind"), text: "BEHIND the flexor tendons", bg: C.forest },
          { t: wf(85, "bases"), text: "across the BASES of the metacarpals" },
          { t: wf(85, "finger"), text: "≈ 1 FINGER WIDTH above (proximal to) the superficial arch", bg: C.matcha },
          { t: wf(86, "metacarpal"), text: "palmar metacarpal arteries → join the digital arteries" },
        ]} />
      </Seg>
      <Seg t={t} a={k6} b={b + 0.1}>
        <ZoomBox x={0} y={0} w={760} h={740} cw={900} ch={1000} t={t} t0={k6} keys={[[k6, 1.0, 0.5, 0.55]]}
          pins={[PIN("rad", "radial", wf(87, "radial"), -110, -40, AC.rad), PIN("uln", "ulnar", wf(87, "ulnar"), 110, -40, AC.uln)]}>
          <Hand t={t} lit={{ rad: wf(87, "radial"), darch: wf(87, "radial") + 0.2, uln: wf(87, "ulnar"), sarch: wf(87, "ulnar") + 0.2 }} />
        </ZoomBox>
        <ViewTag t={t} t0={k6 + 0.3} x={24} y={20} text="RIGHT PALM · SCHEMATIC" />
        <Hdr t={t} t0={k6} x={820} y={0} size={60}>2 arches, 1 network</Hdr>
        <Facts x={820} y={100} w={940} items={[
          { t: wf(87, "connected"), text: "the 2 arches are CONNECTED" },
          { t: wf(87, "both"), text: "→ the hand gets blood from BOTH radial + ulnar", bg: C.forest },
          { t: wf(88, "allen"), text: "the anatomy behind the ALLEN TEST", bg: C.matcha },
        ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 7. MEMORY TRICKS ================= */
const mini = (x: number, y: number, w: number, h: number, child: React.ReactNode) => (
  <div style={abs(x, y, { width: w, height: h, borderRadius: 30, background: C.card, overflow: "hidden" })}>{child}</div>
);
export const STricks: React.FC = () => {
  const t = useT();
  const a = ST(7), b = BE(7);
  const k2 = s_(93) - 0.2, k3 = s_(97) - 0.2, k4 = s_(100) - 0.2, k5 = s_(104) - 0.2;
  const V1: [string, string, number][] = [["Vertebral", "vert", wf(92, "vertebral")], ["Internal thoracic", "intth", wf(92, "internal")], ["Thyrocervical trunk", "tcx", wf(92, "thyrocervical")], ["Costocervical trunk", "ccx", wf(92, "costocervical")], ["Dorsal scapular", "dsc", wf(92, "dorsal")]];
  const cur1 = V1.reduce((acc, x, i) => (t >= x[2] - 0.05 ? i : acc), -1);
  const W2 = ["Screw", "The", "Lawyer,", "Save", "A", "Patient"];
  const tk2 = [wf(94, "screw"), wf(94, "the"), wf(94, "lawyer"), wf(94, "save"), wf(94, "a"), wf(94, "patient")];
  const N2: [string, string, number, string][] = [["Superior thoracic", "supth", wf(95, "superior"), "1"], ["Thoracoacromial", "thac", wf(95, "thoracoacromial"), "2"], ["Lateral thoracic", "latth", wf(95, "lateral"), "2"], ["Subscapular", "subsc", wf(95, "subscapular"), "3"], ["Anterior circumflex humeral", "ach", wf(95, "anterior"), "3"], ["Posterior circumflex humeral", "pch", wf(95, "posterior"), "3"]];
  const cur2 = N2.reduce((acc, x, i) => (t >= x[2] - 0.05 ? i : acc), -1);
  const tan: Lit = t < wf(99, "tendon") ? {} : t < wf(99, "brachial") ? { ten: wf(99, "tendon") } : t < wf(99, "median") ? { art: wf(99, "brachial") } : { mn: wf(99, "median") };
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={k2}>
        <TrickCard t={t} t0={a} n={1} title="Subclavian branches">
          <div style={abs(60, 160, { ...pop(t, s_(91)), fontFamily: FONT, fontWeight: 800, fontSize: 96, color: C.paper, whiteSpace: "nowrap" })}>
            <span style={{ color: C.banana }}>VIT</span>amin <span style={{ color: C.banana }}>C</span> &amp; <span style={{ color: C.banana }}>D</span>
          </div>
          <div style={abs(60, 300, { display: "flex", flexDirection: "column", gap: 10 })}>
            {V1.map(([x, k, tt], i) => (
              <div key={x} style={{ ...pop(t, tt), display: "flex", alignItems: "center", gap: 14, fontFamily: FONT, fontWeight: 800, fontSize: 42, color: i === cur1 ? C.banana : C.paper, transformOrigin: "0% 50%" }}>
                <span style={{ width: 28, height: 28, borderRadius: 14, background: AC[k], border: `3px solid ${C.paper}` }} />
                <span><span style={{ color: C.banana, fontSize: 52 }}>{x[0]}</span>{x.slice(1)}</span>
              </div>
            ))}
          </div>
          {mini(1180, 40, 560, 660, <div style={abs(-500, -40, { transform: "scale(1.35)", transformOrigin: "0 0" })}><ArmMap t={t} lit={cur1 >= 0 ? { [V1[cur1][1]]: V1[cur1][2] } : { sub: a }} show={["aorta", "bct", "cca", "sub", "ax", "vert", "intth", "tcx", "ccx", "dsc"]} /></div>)}
        </TrickCard>
      </Seg>
      <Seg t={t} a={k2} b={k3}>
        <TrickCard t={t} t0={k2} n={2} title="Axillary branches">
          <div style={abs(60, 160, { display: "flex", gap: 20, whiteSpace: "nowrap", fontFamily: FONT, fontWeight: 800, fontSize: 64, color: C.paper })}>
            {W2.map((w, i) => <span key={i} style={{ opacity: ramp(t, tk2[i] - 0.1, tk2[i] + 0.15) }}><FL w={w} on={t >= tk2[i] ? 1 : 0} /></span>)}
          </div>
          <div style={abs(60, 270, { display: "flex", flexDirection: "column", gap: 8 })}>
            {N2.map(([x, k, tt, part], i) => (
              <div key={x} style={{ ...pop(t, tt), display: "flex", alignItems: "center", gap: 14, fontFamily: FONT, fontWeight: 800, fontSize: 38, color: i === cur2 ? C.banana : C.paper, transformOrigin: "0% 50%" }}>
                <span style={{ width: 46, height: 46, borderRadius: 23, background: AC[k], border: `3px solid ${C.paper}`, color: C.forest, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>{part}</span>
                <span><span style={{ color: C.banana, fontSize: 46 }}>{x[0]}</span>{x.slice(1)}</span>
              </div>
            ))}
          </div>
          <div style={abs(1150, 180, { ...pop(t, s_(96)), width: 600, textAlign: "center" })}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.matchaLight }}>part 1 · part 2 · part 3</div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 200, color: C.banana, lineHeight: 1.1 }}>
              <span style={{ opacity: ramp(t, wf(96, "one"), wf(96, "one") + 0.2) }}>1</span>
              <span style={{ opacity: ramp(t, wf(96, "two"), wf(96, "two") + 0.2) }}> 2</span>
              <span style={{ opacity: ramp(t, wf(96, "three"), wf(96, "three") + 0.2) }}> 3</span>
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.paper }}>branches</div>
          </div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={k3} b={k4}>
        <TrickCard t={t} t0={k3} n={3} title="Cubital fossa · lateral → medial">
          <div style={abs(60, 170, { ...pop(t, s_(98)), fontFamily: FONT, fontWeight: 800, fontSize: 200, color: C.banana, letterSpacing: 30, lineHeight: 1 })}>TAN</div>
          <div style={abs(60, 420, { display: "flex", flexDirection: "column", gap: 14 })}>
            {([["Tendon of biceps", wf(99, "tendon"), C.card], ["brachial Artery", wf(99, "brachial"), AC.br], ["median Nerve", wf(99, "median"), "#E9CF4A"]] as [string, number, string][]).map(([x, tt, col]) => (
              <div key={x} style={{ ...pop(t, tt), display: "flex", alignItems: "center", gap: 16, fontFamily: FONT, fontWeight: 800, fontSize: 48, color: C.paper, transformOrigin: "0% 50%" }}>
                <span style={{ width: 32, height: 32, borderRadius: 16, background: col, border: `3px solid ${C.paper}` }} />{x}
              </div>
            ))}
          </div>
          {mini(1060, 40, 680, 660, <div style={abs(-20, 40, { transform: "scale(0.78)", transformOrigin: "0 0" })}><Cubital t={t} lit={tan} show={{ borders: k3, rn: k3, ten: k3, art: k3, mn: k3 }} /></div>)}
        </TrickCard>
      </Seg>
      <Seg t={t} a={k4} b={k5}>
        <TrickCard t={t} t0={k4} n={4} title="Which artery makes which arch?">
          <div style={abs(60, 160)}><Chip t={t} t0={s_(101)} bg={C.matcha} size={30}>look for the letters</Chip></div>
          <div style={abs(60, 250, { ...pop(t, s_(102)), fontFamily: FONT, fontWeight: 800, color: C.paper })}>
            <div style={{ fontSize: 96, lineHeight: 1.05 }}>ra<span style={{ color: C.banana, fontSize: 130 }}>D</span>ial → <span style={{ color: C.banana, fontSize: 130 }}>D</span>eep</div>
          </div>
          <div style={abs(60, 450, { ...pop(t, s_(103)), fontFamily: FONT, fontWeight: 800, color: C.paper })}>
            <div style={{ fontSize: 96, lineHeight: 1.05 }}>s<span style={{ color: C.banana, fontSize: 130 }}>U</span>perficial → <span style={{ color: C.banana, fontSize: 130 }}>U</span>lnar</div>
          </div>
          {mini(1180, 40, 560, 660, <div style={abs(-110, 20, { transform: "scale(0.85)", transformOrigin: "0 0" })}><Hand t={t} lit={t < s_(103) ? { rad: s_(102), darch: s_(102) } : { uln: s_(103), sarch: s_(103) }} /></div>)}
        </TrickCard>
      </Seg>
      <Seg t={t} a={k5} b={b + 0.1}>
        <TrickCard t={t} t0={k5} n={5} title="The 3 name changes">
          <div style={abs(60, 210, { display: "flex", gap: 18, alignItems: "center" })}>
            {([["RIB", wf(105, "rib"), "sub → ax"], ["TERES", wf(105, "teres"), "ax → brachial"], ["ELBOW", wf(105, "elbow"), "→ radial + ulnar"]] as [string, number, string][]).map(([x, tt, s], i) => (
              <React.Fragment key={x}>
                {i > 0 && <Big size={56} color={C.matchaLight}>→</Big>}
                <div style={{ ...pop(t, tt), textAlign: "center" }}>
                  <div style={{ background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 66, padding: "10px 24px 14px", borderRadius: 24 }}>{x}</div>
                  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.matchaLight, marginTop: 12 }}>{s}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
          {mini(1180, 40, 560, 660, <div style={abs(-30, -20, { transform: "scale(0.46)", transformOrigin: "0 0" })}><ArmMap t={t} marks={{ rib: wf(105, "rib"), teres: wf(105, "teres"), elbow: wf(105, "elbow") }} show={["aorta", "bct", "cca", "sub", "ax", "br", "rad", "uln", "sarch", "darch", "digit"]} lit={{ sub: wf(105, "rib"), ax: wf(105, "rib"), br: wf(105, "teres"), rad: wf(105, "elbow"), uln: wf(105, "elbow") }} /></div>)}
        </TrickCard>
      </Seg>
    </Stage>
  );
};

/* ================= 8. QUICK QUIZ ================= */
type Q = { n: number; si: number; q: string; a: string; visual: (t: number, reveal: number, ans: number) => React.ReactNode };
const QV: React.FC<{ t: number; t0: number; children: React.ReactNode; tag: string }> = ({ t, t0, children, tag }) => (
  <>
    <Panel x={0} y={0} w={1000} h={740} t={t} t0={t0}>{children}</Panel>
    <ViewTag t={t} t0={t0 + 0.2} x={24} y={20} text={tag} />
  </>
);
const QS: Q[] = [
  { n: 1, si: 108, q: "Where does the subclavian become the axillary artery?", a: "outer border of the 1st rib", visual: (t, r, ans) => <ZoomBox x={0} y={0} w={1000} h={740} cw={900} ch={1600} t={t} t0={s_(108) - 0.2} keys={[[s_(108), 2.4, 0.55, 0.18]]} pins={r ? [{ t0: ans, pt: AM_PT.rib, text: "1st rib", dx: 40, dy: 120, hot: true }] : []}><ArmMap t={t} lit={r ? { sub: ans, ax: ans } : {}} marks={r ? { rib: ans } : {}} show={["aorta", "bct", "cca", "sub", "ax", "br"]} /></ZoomBox> },
  { n: 2, si: 110, q: "Which muscle divides the axillary artery into 3 parts?", a: "pectoralis minor", visual: (t, r, ans) => <ZoomBox x={0} y={0} w={1000} h={740} cw={900} ch={1600} t={t} t0={s_(110) - 0.2} keys={[[s_(110), 2.6, 0.45, 0.24]]} pins={r ? [{ t0: ans, pt: [470, 440], text: "pectoralis minor", dx: 70, dy: 90, hot: true }] : []}><ArmMap t={t} pec={r ? ans : 0} lit={{ ax: s_(110) }} parts={r ? { kind: "ax", t0: ans + 0.3 } : undefined} show={["sub", "ax", "br"]} /></ZoomBox> },
  { n: 3, si: 112, q: "Which artery runs with the radial nerve in the radial groove?", a: "profunda brachii", visual: (t, r, ans) => <TallPlate {...BRACH} x={0} y={0} w={1000} h={740} t={t} t0={s_(112) - 0.2} keys={[[s_(112), 1.3, 0.7, 0.36]]} tag="GRAY'S 1918 · FIG. 525" pins={r ? [{ t0: ans, x: 0.79, y: 0.375, text: "profunda brachii", dx: -200, dy: -60, hot: true }] : []} /> },
  { n: 4, si: 114, q: "Which artery mainly forms the superficial palmar arch?", a: "ulnar artery", visual: (t, r, ans) => <QV t={t} t0={s_(114)} tag="RIGHT PALM · SCHEMATIC"><div style={abs(190, 20, { transform: "scale(0.7)", transformOrigin: "0 0" })}><Hand t={t} lit={r ? { uln: ans, sarch: ans + 0.2 } : { sarch: s_(114) }} /></div></QV> },
  { n: 5, si: 116, q: "Where do you feel the radial pulse?", a: "wrist · lateral to the FCR tendon", visual: (t, r, ans) => <TallPlate {...FORE} x={0} y={0} w={1000} h={740} t={t} t0={s_(116) - 0.2} keys={[[s_(116), 1.8, 0.45, 0.62]]} tag="GRAY'S 1918 · FIG. 527 · WRIST" ring={r ? { x: 0.428, y: 0.635, t0: ans } : undefined} pins={r ? [{ t0: ans + 0.3, x: 0.485, y: 0.6, text: "flexor carpi radialis tendon", dx: 80, dy: -160 }] : []} /> },
];
export const SQuiz: React.FC = () => {
  const t = useT();
  const a = ST(8), b = BE(8);
  return (
    <Stage a={a} b={b}>
      {QS.map((q, i) => {
        const ask = s_(q.si), pause = e_(q.si), ans = s_(q.si + 1);
        const end = i < QS.length - 1 ? s_(QS[i + 1].si) - 0.2 : b + 0.1;
        const reveal = t >= ans ? 1 : 0;
        const cdT = t - (pause + 0.2);
        const n = cdT < 0 ? null : cdT < 1.0 ? 3 : cdT < 2.0 ? 2 : cdT < 3.0 ? 1 : null;
        const cdK = n ? ramp(t, pause + 0.2 + (3 - n), pause + 0.2 + (3 - n) + 0.18) : 0;
        return (
          <Seg key={q.n} t={t} a={i === 0 ? a - 0.1 : ask - 0.2} b={end}>
            {q.visual(t, reveal, ans)}
            <div style={abs(1040, 0, { width: 760, height: 740, borderRadius: 44, background: C.forest, ...pop(t, i === 0 ? a : ask - 0.15, 0.35) })}>
              <div style={abs(50, 46, { fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: C.banana })}>QUESTION {q.n} / 5</div>
              {i === 0 && <div style={abs(420, 46, { fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.matchaLight, opacity: 1 - ramp(t, ask + 2, ask + 2.4) })}>pause if you need more time</div>}
              <div style={abs(50, 110, { width: 660, fontFamily: FONT, fontWeight: 800, fontSize: 54, lineHeight: 1.12, color: C.paper })}>{q.q}</div>
              {n && <div style={abs(0, 420, { width: 760, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 190, lineHeight: 1, color: C.banana, transform: `scale(${1.35 - 0.35 * cdK})` })}>{n}</div>}
              {reveal > 0 && (
                <div style={abs(50, 500, { ...pop(t, ans), width: 660, background: C.banana, borderRadius: 26, padding: "20px 30px 26px", boxSizing: "border-box", fontFamily: FONT, fontWeight: 800, fontSize: q.a.length > 22 ? 42 : 54, color: C.forest, textAlign: "center" })}>✓ {q.a}</div>
              )}
              {q.n === 5 && reveal > 0 && <div style={abs(50, 672, { ...pop(t, ans + 1.5), fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.banana, whiteSpace: "nowrap" })}>Your score: ? / 5 · tell me below</div>}
            </div>
          </Seg>
        );
      })}
    </Stage>
  );
};

/* ================= 9. RECAP + OUTRO ================= */
export const SRecap: React.FC = () => {
  const t = useT();
  const a = ST(9);
  const items: [string, string, number, string][] = [
    ["1 artery", "3 name changes: rib · teres · elbow", Math.max(a, s_(119)), C.banana],
    ["Subclavian", "→ 1st rib · VITamin C & D", s_(120), AC.sub],
    ["Axillary", "→ teres major · 3 parts (pec minor) · STL SAP", s_(121), AC.ax],
    ["Brachial", "+ median nerve · profunda brachii + radial nerve", s_(122), AC.br],
    ["Elbow", "→ radial + ulnar", s_(123), AC.rad],
    ["Hand", "ulnar = superficial arch · radial = deep arch", s_(124), AC.uln],
  ];
  const ot = s_(125) - 0.2;
  const outro = ramp(t, ot, ot + 0.5);
  const lit: Lit = t >= s_(124) ? { sarch: s_(124), darch: s_(124) } : t >= s_(123) ? { rad: s_(123), uln: s_(123) } : t >= s_(122) ? { br: s_(122), prof: s_(122) } : t >= s_(121) ? { ax: s_(121) } : t >= s_(120) ? { sub: s_(120) } : {};
  return (
    <Stage a={a} b={END - 0.3}>
      {outro < 1 && (
        <div style={abs(0, 0, { width: 1800, height: 740, borderRadius: 44, background: C.forest })}>
          <div style={abs(70, 40, { fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 8, color: C.banana })}>RECAP</div>
          <div style={abs(70, 105, { display: "flex", flexDirection: "column", gap: 18 })}>
            {items.map(([h, s, tt, col]) => (
              <div key={h} style={{ ...pop(t, tt), display: "flex", alignItems: "center", gap: 24, fontFamily: FONT, fontWeight: 800, transformOrigin: "0% 50%" }}>
                <div style={{ width: 54, height: 54, borderRadius: 27, background: col, border: `4px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: C.forest, flexShrink: 0 }}>✓</div>
                <div style={{ width: 230, fontSize: 40, color: C.paper, flexShrink: 0 }}>{h}</div>
                <div style={{ fontSize: 32, color: C.matchaLight, width: 880, lineHeight: 1.15 }}>{s}</div>
              </div>
            ))}
          </div>
          <div style={abs(1290, 40, { opacity: ramp(t, a, a + 0.5), width: 460, height: 660, borderRadius: 32, background: C.card, overflow: "hidden" })}>
            <div style={abs(-10, -10, { transform: "scale(0.44)", transformOrigin: "0 0" })}><ArmMap t={t} lit={lit} show={["aorta", "bct", "cca", "sub", "ax", "br", "prof", "rad", "uln", "sarch", "darch", "digit"]} /></div>
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
              <div style={{ background: C.red, color: C.paper, borderRadius: 50, padding: "18px 54px 22px", fontSize: 54, letterSpacing: 3, transform: `scale(${1 + 0.05 * Math.max(0, Math.sin((t - ot) * 5))})`, opacity: ramp(t, wf(126, "subscribe"), wf(126, "subscribe") + 0.3) }}>SUBSCRIBE</div>
              <div style={{ fontSize: 34, color: C.matchaLight, opacity: ramp(t, wf(125, "study"), wf(125, "study") + 0.3) }}>study cards: bookplume.com</div>
            </div>
            <div style={{ marginTop: 40, background: C.paper, color: C.forest, borderRadius: 24, padding: "16px 30px 20px", fontSize: 38, opacity: ramp(t, s_(127), s_(127) + 0.4), width: "fit-content" }}>Which artery branch do you always forget?</div>
          </div>
        </div>
      )}
    </Stage>
  );
};
