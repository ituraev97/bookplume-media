import React from "react";
import { Img, staticFile } from "remotion";
import { C, FONT, ramp, useT } from "./kit";
import { Stage, LogoMark } from "./Chrome16";
import { Palm, PALM_PT, Spread, SideFinger, SF_PTS, Loaf, Worm, MC, PalmProps } from "./IllusHM";
import { s_, e_, wf, ST, BE, abs, pop, Big, Mk, Seg, Note, Chip, ViewTag, Tag, TrickCard, kv } from "./Kit2";
import { END } from "./timeline";

/* ---------- plates (Gray's Anatomy 1918, public domain) ---------- */
const P = (f: string, w: number, h: number, fig: string) => ({ src: `plates/${f}.png`, aspect: w / h, fig });
const PALM = P("palm427", 1819, 2506, "427");
const THUMB = P("thumb426", 1274, 1251, "426");
const DORS = P("dors428", 865, 1271, "428");
const PALI = P("palm429", 819, 1271, "429");
const NERV = P("nerves815", 1916, 2206, "815");
const FORE = P("fore415", 1069, 3179, "415");
const WRIST = P("wrist422", 1933, 1068, "422");

type CK = [number, number, number, number];
type PinS = { t0: number; t1?: number; pt: [number, number]; text: string; dx?: number; dy?: number; hot?: boolean; size?: number; col?: string };

/** diagram panel with a camera (keys: time, scale, focusX, focusY as viewBox fractions) and pins in viewBox units */
const ZoomBox: React.FC<{ x: number; y: number; w: number; h: number; cw?: number; ch?: number; keys: CK[]; t: number; t0: number; bg?: string; pins?: PinS[]; tag?: string; children: React.ReactNode }> = ({ x, y, w, h, cw = 900, ch = 1000, keys, t, t0, bg = C.card, pins = [], tag, children }) => {
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
      {tag && <ViewTag t={t} t0={t0 + 0.3} x={18} y={16} text={tag} />}
    </div>
  );
};

/** plate in a window: keys [time, zoom (1 = plate width fills the window), fx, fy]; pins in plate fractions */
type TPin = { t0: number; t1?: number; x: number; y: number; text: string; dx?: number; dy?: number; hot?: boolean; col?: string; size?: number };
const TallPlate: React.FC<{ src: string; aspect: number; fig: string; x: number; y: number; w: number; h: number; t: number; t0: number; keys: CK[]; pins?: TPin[]; tag?: string; ring?: { x: number; y: number; t0: number }; credit?: boolean }> = ({ src, aspect, fig, x, y, w, h, t, t0, keys, pins = [], tag, ring, credit = true }) => {
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
      {credit && <div style={abs(14, h - 36, { fontFamily: FONT, fontWeight: 700, fontSize: 17, color: C.forest, opacity: 0.65, background: "rgba(247,246,236,0.9)", padding: "2px 10px", borderRadius: 8 })}>Gray's Anatomy, 1918 · Fig. {fig} · public domain</div>}
      {tag && <ViewTag t={t} t0={t0 + 0.3} x={18} y={16} text={tag} />}
    </div>
  );
};

const RowL: React.FC<{ t: number; t0: number; col: string; title: string; sub?: string; w?: number; n?: string; size?: number; on?: boolean }> = ({ t, t0, col, title, sub, w = 740, n, size = 38, on }) => (
  <div style={{ ...pop(t, t0), width: w, display: "flex", alignItems: "center", gap: 18, background: on ? C.banana : C.card, border: `3px solid ${on ? C.bananaDark : C.line}`, borderRadius: 24, padding: "10px 22px", fontFamily: FONT, fontWeight: 800, transformOrigin: "0% 50%", boxSizing: "border-box" }}>
    <div style={{ minWidth: 52, height: 52, borderRadius: 26, background: col, border: `3px solid ${C.forest}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, color: C.forest, padding: "0 6px", boxSizing: "border-box" }}>{n}</div>
    <div>
      <div style={{ fontSize: size, color: C.forest, lineHeight: 1.1 }}>{title}</div>
      {sub && <div style={{ fontSize: size * 0.68, color: C.matcha, lineHeight: 1.15, marginTop: 2 }}>{sub}</div>}
    </div>
  </div>
);
const Col: React.FC<{ x: number; y: number; gap?: number; children: React.ReactNode }> = ({ x, y, gap = 16, children }) => (
  <div style={abs(x, y, { display: "flex", flexDirection: "column", gap })}>{children}</div>
);
const Hdr: React.FC<{ t: number; t0: number; x: number; y: number; children: React.ReactNode; size?: number; color?: string }> = ({ t, t0, x, y, children, size = 64, color }) => (
  <div style={abs(x, y, { ...pop(t, t0), transformOrigin: "0% 50%" })}><Big size={size} color={color}>{children}</Big></div>
);
/** dark card with big text */
const DCard: React.FC<{ t: number; t0: number; x: number; y: number; w: number; bg?: string; children: React.ReactNode; size?: number; color?: string }> = ({ t, t0, x, y, w, bg = C.forest, children, size = 44, color = C.paper }) => (
  <div style={abs(x, y, { ...pop(t, t0, 0.35), width: w, background: bg, borderRadius: 30, padding: "20px 30px 24px", boxSizing: "border-box", fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1.15, transformOrigin: "0% 50%" })}>{children}</div>
);
const PALMV = (t: number, p: Partial<PalmProps> = {}) => <Palm t={t} {...p} />;
const pp = (k: string): [number, number] => PALM_PT[k];
const ALL_TH = (x: number) => ({ apb: x, fpb: x, op: x });
const ALL_HY = (x: number) => ({ adm: x, fdm: x, odm: x });
const ALL_L = (x: number) => ({ l1: x, l2: x, l3: x, l4: x });
const ALL_AD = (x: number) => ({ addO: x, addT: x });
const PALM_TAG = "LEFT PALM · SCHEMATIC";

/* ================= 0. INTRO ================= */
export const SIntro: React.FC = () => {
  const t = useT();
  const m1 = s_(5) - 0.2, m2 = s_(7) - 0.2;
  const opp = kv(t, [[wf(0, "thumb"), 0], [wf(0, "little") + 0.5, 1], [s_(2), 1], [s_(2) + 1.2, 0]]);
  return (
    <Stage a={-1} b={BE(0)}>
      <Seg t={t} a={-1} b={m1}>
        <ZoomBox x={0} y={0} w={760} h={740} t={t} t0={-1} tag={PALM_TAG} keys={[[0, 1.0, 0.5, 0.5], [s_(1), 1.25, 0.6, 0.66], [s_(3) - 0.8, 1.0, 0.5, 0.5]]}
          pins={[
            { t0: wf(3, "thenar"), pt: pp("thenar"), text: "thenar", dx: -10, dy: 150, hot: true },
            { t0: wf(3, "hypothenar"), pt: pp("hypo"), text: "hypothenar", dx: 60, dy: 130, hot: true },
            { t0: wf(3, "lumbricals"), pt: pp("l2"), text: "lumbricals", dx: 0, dy: -330, hot: true },
            { t0: wf(3, "interossei"), pt: pp("middle"), text: "interossei", dx: 0, dy: -200, hot: true },
          ]}>
          {PALMV(t, { oppose: opp, lit: { ...ALL_TH(wf(3, "thenar")), ...ALL_AD(wf(3, "thenar")), ...ALL_HY(wf(3, "hypothenar")), pb: wf(3, "hypothenar"), ...ALL_L(wf(3, "lumbricals")) }, eminence: { middle: ramp(t, wf(3, "interossei"), wf(3, "interossei") + 0.4) } })}
        </ZoomBox>
        <div style={abs(820, 0, { width: 980, ...pop(t, 0.2) })}>
          <Big size={96}><Mk p={ramp(t, 0.6, 1.6)}>Muscles of</Mk></Big>
          <Big size={96}><Mk p={ramp(t, 1.0, 2.0)}>the Hand</Mk></Big>
          <Big size={40} color={C.matcha} style={{ marginTop: 10 }}>every intrinsic muscle · in about 10 minutes</Big>
        </div>
        <div style={abs(820, 290, { display: "flex", flexDirection: "column", gap: 18 })}>
          <div><Chip t={t} t0={wf(0, "touch")} bg={C.forest} size={40}>Touch thumb → little finger</Chip></div>
          <div><Chip t={t} t0={wf(1, "entirely")} bg={C.matcha} size={40}>= muscles 100% inside your hand</Chip></div>
          <div><Chip t={t} t0={wf(2, "can't")} bg={C.red} size={40}>most students can't name them</Chip></div>
        </div>
        <div style={abs(820, 560, { display: "flex", gap: 12, flexWrap: "wrap", width: 980 })}>
          {([["Thenar", "thenar", MC.th], ["Hypothenar", "hypothenar", MC.hyp], ["Lumbricals", "lumbricals", MC.lum], ["Interossei", "interossei", MC.dor]] as [string, string, string][]).map(([n, w, c]) => (
            <Chip key={n} t={t} t0={wf(3, w)} bg={c} color={C.forest} size={36}>{n}</Chip>
          ))}
        </div>
        <div style={abs(820, 660, { opacity: ramp(t, s_(4), s_(4) + 0.4) })}><Big size={40} color={C.matcha}>scary names → one simple pattern</Big></div>
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <TallPlate {...NERV} x={0} y={0} w={760} h={740} t={t} t0={m1} keys={[[m1, 1.2, 0.45, 0.42], [s_(6) + 1, 1.7, 0.4, 0.42]]} tag="GRAY'S 1918 · LEFT PALM"
          pins={[
            { t0: wf(6, "thumb"), x: 0.30, y: 0.47, text: "thumb muscles", dx: 120, dy: 170, hot: true },
            { t0: wf(6, "nerve"), x: 0.45, y: 0.3, text: "which nerve?", dx: 130, dy: -90, hot: true, size: 36 },
          ]} />
        <div style={abs(820, 20, { display: "flex", flexDirection: "column", gap: 26 })}>
          <div><Chip t={t} t0={s_(5)} bg={C.matcha} size={36}>keep this in mind:</Chip></div>
        </div>
        <div style={abs(820, 120, { width: 960, ...pop(t, wf(6, "which")), transformOrigin: "0% 50%" })}>
          <Big size={84}>Which nerve runs the muscles of your thumb?</Big>
        </div>
        <div style={abs(820, 470)}><Chip t={t} t0={wf(6, "trick")} bg={C.red} size={56}>careful: trick question!</Chip></div>
        <div style={abs(820, 590, { width: 960, opacity: ramp(t, wf(6, "question") + 0.4, wf(6, "question") + 0.9) })}><Big size={40} color={C.matcha}>…the answer comes in chapter 2.</Big></div>
      </Seg>
      <Seg t={t} a={m2} b={BE(0) + 0.1}>
        <TallPlate {...PALM} x={0} y={0} w={370} h={740} t={t} t0={m2} keys={[[m2, 1.0, 0.5, 0.45]]} credit={false} />
        <TallPlate {...THUMB} x={390} y={0} w={370} h={360} t={t} t0={m2 + 0.25} keys={[[m2, 1.05, 0.5, 0.5]]} credit={false} />
        <TallPlate {...DORS} x={390} y={380} w={370} h={360} t={t} t0={m2 + 0.5} keys={[[m2, 1.2, 0.45, 0.3]]} credit={false} />
        <div style={abs(820, 0)}><Chip t={t} t0={s_(7)} bg={C.forest} size={44}>In about 10 minutes you'll:</Chip></div>
        <Col x={820} y={100} gap={14}>
          <RowL t={t} t0={wf(7, "every")} col={MC.th} n="1" title="name every muscle in your hand" w={940} />
          <RowL t={t} t0={wf(7, "say")} col={MC.hyp} n="2" title="say what each one does" w={940} />
          <RowL t={t} t0={wf(7, "nerve")} col={MC.lum} n="3" title="know its nerve" w={940} />
          <RowL t={t} t0={wf(7, "tricks")} col={MC.dor} n="4" title="lock it in with tricks that stick" w={940} />
        </Col>
        <div style={abs(820, 510)}><Chip t={t} t0={wf(8, "quiz")} bg={C.red} size={46}>+ 5-question quiz at the end</Chip></div>
      </Seg>
    </Stage>
  );
};

/* ================= 1. BIG PICTURE ================= */
export const SBig: React.FC = () => {
  const t = useT();
  const a = ST(1), m1 = s_(16) - 0.2, m2 = s_(20) - 0.2;
  const tot = t < wf(21, "three") ? 0 : t < wf(21, "one") ? 3 : t < wf(21, "three", 1) ? 4 : t < wf(21, "four") ? 7 : t < wf(21, "interossei") ? 11 : t < wf(21, "three", 2) ? 11 : t < wf(21, "four", 1) ? 14 : t < wf(22, "nineteen") ? 18 : 19;
  return (
    <Stage a={a} b={BE(1)}>
      <Seg t={t} a={a - 0.1} b={m1}>
        <TallPlate {...FORE} x={0} y={0} w={560} h={740} t={t} t0={a} tag="GRAY'S 1918 · LEFT FOREARM, DEEP"
          keys={[[a, 1.0, 0.5, 0.3], [s_(11), 1.15, 0.45, 0.33], [wf(11, "tendons"), 1.15, 0.45, 0.62], [s_(13), 1.7, 0.55, 0.8]]}
          pins={[
            { t0: wf(11, "forearm"), t1: s_(13), x: 0.45, y: 0.28, text: "extrinsic: forearm muscles", dx: 30, dy: 0 },
            { t0: wf(11, "tendons"), t1: s_(13), x: 0.36, y: 0.58, text: "long tendons ↓", dx: 140, dy: 0, hot: true },
            { t0: wf(13, "intrinsic"), x: 0.62, y: 0.78, text: "intrinsic: hand muscles", dx: -90, dy: -120, hot: true },
          ]} />
        <div style={abs(600, 0, { width: 1200 })}><Hdr t={t} t0={s_(10)} x={0} y={0} size={58}>2 kinds of hand muscles</Hdr></div>
        <div style={abs(600, 110, { display: "flex", gap: 24 })}>
          <div style={{ ...pop(t, s_(11)), width: 580, height: 430, borderRadius: 34, background: C.card, border: `4px solid ${C.line}`, padding: "26px 30px", boxSizing: "border-box", fontFamily: FONT, fontWeight: 800, opacity: t > s_(13) ? 0.55 : 1 }}>
            <div style={{ fontSize: 30, letterSpacing: 5, color: C.matcha }}>EXTRINSIC</div>
            <div style={{ fontSize: 40, color: C.forest, marginTop: 10, lineHeight: 1.15 }}>in the forearm → long tendons into the hand</div>
            <div style={{ ...pop(t, wf(12, "power")), marginTop: 30, background: C.forest, color: C.banana, borderRadius: 22, padding: "14px 24px 18px", fontSize: 54, width: "fit-content" }}>POWER</div>
            <div style={{ opacity: ramp(t, wf(12, "grip"), wf(12, "grip") + 0.3), fontSize: 34, color: C.matcha, marginTop: 14 }}>a strong grip</div>
          </div>
          <div style={{ ...pop(t, s_(13)), width: 580, height: 430, borderRadius: 34, background: t > s_(15) ? C.banana : C.card, border: `4px solid ${t > s_(15) ? C.bananaDark : C.line}`, padding: "26px 30px", boxSizing: "border-box", fontFamily: FONT, fontWeight: 800 }}>
            <div style={{ fontSize: 30, letterSpacing: 5, color: C.matcha }}>INTRINSIC</div>
            <div style={{ fontSize: 40, color: C.forest, marginTop: 10, lineHeight: 1.15 }}>start AND end inside the hand</div>
            <div style={{ ...pop(t, wf(14, "precision")), marginTop: 30, background: C.red, color: C.paper, borderRadius: 22, padding: "14px 24px 18px", fontSize: 54, width: "fit-content" }}>PRECISION</div>
            <div style={{ opacity: ramp(t, wf(14, "writing"), wf(14, "writing") + 0.3), fontSize: 34, color: C.matcha, marginTop: 14 }}>writing · typing · picking up a coin</div>
          </div>
        </div>
        <div style={abs(600, 580)}><Chip t={t} t0={s_(15)} bg={C.forest} size={46}>today: the INTRINSIC muscles ✓</Chip></div>
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <ZoomBox x={0} y={0} w={760} h={740} t={t} t0={m1} tag={PALM_TAG} keys={[[m1, 1.0, 0.5, 0.55], [s_(17), 1.35, 0.66, 0.72], [s_(18), 1.35, 0.34, 0.72], [s_(19), 1.1, 0.5, 0.6]]}
          pins={[
            { t0: wf(17, "thenar"), pt: [700, 900], text: "thenar eminence", dx: -60, dy: 50, hot: true },
            { t0: wf(18, "hypothenar"), pt: [270, 900], text: "hypothenar eminence", dx: 80, dy: 50, hot: true },
            { t0: wf(19, "lumbricals"), pt: pp("middle"), text: "lumbricals + interossei", dx: 0, dy: -260, hot: true },
          ]}>
          {PALMV(t, { dim: 0.6, lit: { ...ALL_TH(wf(17, "thenar")), ...ALL_HY(wf(18, "hypothenar")), ...ALL_L(wf(19, "lumbricals")) }, eminence: { thenar: ramp(t, wf(17, "thenar"), wf(17, "thenar") + 0.4), hypo: ramp(t, wf(18, "hypothenar"), wf(18, "hypothenar") + 0.4), middle: ramp(t, wf(19, "interossei"), wf(19, "interossei") + 0.4) } })}
        </ZoomBox>
        <div style={abs(800, 0)}><Chip t={t} t0={s_(16)} bg={C.forest} size={40}>Look at your palm</Chip></div>
        <TallPlate {...WRIST} x={800} y={90} w={1000} h={500} t={t} t0={s_(16) + 0.3} tag="GRAY'S 1918 · SLICE THROUGH THE WRIST" keys={[[s_(16), 1.0, 0.5, 0.5]]}
          pins={[
            { t0: wf(17, "thenar"), x: 0.27, y: 0.27, text: "thenar", dx: -10, dy: 270, hot: true, col: MC.th },
            { t0: wf(18, "hypothenar"), x: 0.69, y: 0.47, text: "hypothenar", dx: 40, dy: 200, hot: true, col: MC.hyp },
          ]} />
        <Note t={t} t0={wf(18, "eminence") + 0.6} old="muscles of thumb / of little finger" x={800} y={620} />
      </Seg>
      <Seg t={t} a={m2} b={BE(1) + 0.1}>
        <ZoomBox x={0} y={0} w={760} h={740} t={t} t0={m2} tag={PALM_TAG} keys={[[m2, 1.0, 0.5, 0.55]]}>
          {PALMV(t, { dim: 0.7, lit: { ...ALL_TH(wf(21, "three")), ...ALL_AD(wf(21, "one")), ...ALL_HY(wf(21, "three", 1)), ...ALL_L(wf(21, "four")), pb: wf(22, "palmaris") }, eminence: { middle: ramp(t, wf(21, "interossei"), wf(21, "interossei") + 0.4) } })}
        </ZoomBox>
        <Hdr t={t} t0={s_(20)} x={820} y={0} size={58}>5 groups</Hdr>
        <Col x={820} y={92} gap={10}>
          <RowL t={t} t0={wf(21, "three")} col={MC.th} n="3" title="thenar" size={34} w={620} />
          <RowL t={t} t0={wf(21, "one")} col={MC.add} n="1" title="adductor pollicis" size={34} w={620} />
          <RowL t={t} t0={wf(21, "three", 1)} col={MC.hyp} n="3" title="hypothenar" size={34} w={620} />
          <RowL t={t} t0={wf(21, "four")} col={MC.lum} n="4" title="lumbricals" size={34} w={620} />
          <RowL t={t} t0={wf(21, "interossei")} col={MC.dor} n="3+4" title="interossei" sub="3 palmar + 4 dorsal" size={34} w={620} />
          <RowL t={t} t0={wf(22, "tiny")} col={MC.pb} n="+1" title="palmaris brevis" sub="tiny, in the skin" size={34} w={620} on={t > wf(22, "palmaris")} />
        </Col>
        <div style={abs(1470, 100, { width: 330, height: 330, borderRadius: 40, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", ...pop(t, wf(21, "three")) })}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 5, color: C.matchaLight }}>TOTAL</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 180, lineHeight: 1, color: tot === 19 ? C.banana : C.paper, transform: `scale(${tot === 19 ? 1 + 0.05 * Math.sin(t * 5) : 1})` }}>{tot}</div>
        </div>
        <div style={abs(1470, 460, { width: 330, ...pop(t, s_(23)) })}>
          <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 24, padding: "14px 20px", fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.forest, lineHeight: 1.2 }}>some books: a 4th palmar interosseous → <span style={{ color: C.red }}>20</span></div>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 2. THENAR ================= */
export const SThenar: React.FC = () => {
  const t = useT();
  const a = ST(2), m1 = s_(33) - 0.2, m2 = s_(35) - 0.2, m3 = s_(38) - 0.2;
  const opp = kv(t, [[s_(33) + 0.3, 0], [e_(33) - 0.3, 1], [s_(34) + 0.4, 1], [e_(34), 0.15], [e_(34) + 1.0, 1]]);
  return (
    <Stage a={a} b={BE(2)}>
      <Seg t={t} a={a - 0.1} b={m1}>
        <TallPlate {...PALM} x={0} y={0} w={640} h={740} t={t} t0={a} tag="GRAY'S 1918 · LEFT PALM"
          keys={[[a, 1.5, 0.72, 0.33], [wf(26, "abductor"), 1.85, 0.72, 0.31], [wf(29, "flexor"), 1.85, 0.66, 0.38], [wf(31, "opponens"), 1.85, 0.76, 0.3], [e_(32), 1.5, 0.72, 0.35]]}
          pins={[
            { t0: wf(26, "abductor"), x: 0.735, y: 0.3, text: "abductor pollicis brevis", dx: -40, dy: -150, hot: t < s_(29) },
            { t0: wf(29, "flexor"), x: 0.64, y: 0.405, text: "flexor pollicis brevis", dx: 0, dy: 150, hot: t >= s_(29) && t < s_(31) },
            { t0: wf(31, "opponens"), x: 0.835, y: 0.29, text: "opponens pollicis", dx: -70, dy: 110, hot: t >= s_(31) },
          ]} />
        <Hdr t={t} t0={s_(25)} x={680} y={0} size={56}>Thenar group = 3</Hdr>
        <Col x={680} y={92} gap={14}>
          <RowL t={t} t0={wf(26, "abductor")} col={MC.th} n="1" title="Abductor pollicis brevis" sub="most superficial · thumb forward, away from palm" w={1120} on={t >= s_(26) && t < s_(29)} />
          <RowL t={t} t0={wf(29, "flexor")} col={MC.th} n="2" title="Flexor pollicis brevis" sub="next to it, little-finger side · bends the thumb's 1st knuckle" w={1120} on={t >= s_(29) && t < s_(31)} />
          <RowL t={t} t0={wf(31, "opponens")} col={MC.th} n="3" title="Opponens pollicis" sub="deep · along the WHOLE 1st metacarpal · opposition" w={1120} on={t >= s_(31)} />
        </Col>
        <div style={abs(680, 520, { display: "flex", gap: 16 })}>
          <Chip t={t} t0={wf(27, "pollicis")} bg={C.forest} color={C.banana} size={38}>pollicis = of the thumb</Chip>
          <Chip t={t} t0={wf(27, "brevis")} bg={C.matcha} size={38}>brevis = short</Chip>
        </div>
        <div style={abs(680, 620, { opacity: ramp(t, s_(25) + 1, s_(25) + 1.5) * (1 - ramp(t, wf(27, "pollicis") - 0.3, wf(27, "pollicis"))) })}><Big size={36} color={C.matcha}>the names tell you the jobs</Big></div>
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <ZoomBox x={0} y={0} w={760} h={740} t={t} t0={m1} tag={PALM_TAG} keys={[[m1, 1.0, 0.5, 0.5]]}
          pins={[{ t0: s_(33) + 0.5, pt: pp("op"), text: "opponens pollicis", dx: -40, dy: 140, hot: true }]}>
          {PALMV(t, { oppose: opp, dim: 0.5, lit: { op: s_(33) } })}
        </ZoomBox>
        <DCard t={t} t0={s_(33)} x={820} y={0} w={980} size={88} color={C.banana}>OPPOSITION</DCard>
        <Col x={820} y={180} gap={16}>
          <RowL t={t} t0={wf(33, "rotates")} col={MC.th} n="↻" title="thumb rotates across the palm" w={960} />
          <RowL t={t} t0={wf(33, "meet")} col={MC.th} n="✓" title="…so it can meet your fingertips" w={960} />
          <RowL t={t} t0={s_(34)} col={C.banana} n="!" title="the move you did at the start" w={960} on />
        </Col>
      </Seg>
      <Seg t={t} a={m2} b={m3}>
        <TallPlate {...NERV} x={0} y={0} w={760} h={740} t={t} t0={m2} tag="GRAY'S 1918 · PALMAR NERVES (AFTER TESTUT)"
          keys={[[m2, 1.5, 0.45, 0.36], [s_(36), 1.9, 0.4, 0.36]]}
          ring={{ x: 0.36, y: 0.42, t0: wf(36, "recurrent") }}
          pins={[
            { t0: wf(35, "retinaculum"), t1: s_(36), x: 0.5, y: 0.37, text: "flexor retinaculum", dx: 150, dy: -60 },
            { t0: wf(36, "median", 0), x: 0.445, y: 0.27, text: "median nerve", dx: 150, dy: -40, col: MC.med },
            { t0: wf(36, "recurrent"), x: 0.35, y: 0.42, text: "recurrent branch", dx: -40, dy: 150, hot: true },
          ]} />
        <Note t={t} t0={s_(37) + 0.6} old='"muscular to abductor, opponens & flexor brevis pollicis"' x={20} y={620} />
        <ZoomBox x={800} y={0} w={1000} h={740} t={t} t0={m2 + 0.2} keys={[[m2, 1.25, 0.6, 0.78]]}
          pins={[
            { t0: wf(35, "retinaculum"), pt: [470, 880], text: "flexor retinaculum (roof of the carpal tunnel)", dx: -40, dy: 80, size: 26 },
            { t0: wf(35, "scaphoid"), pt: [610, 900], text: "scaphoid + trapezium", dx: 150, dy: -260, size: 28 },
          ]}>
          {PALMV(t, { dim: 0.6, lit: ALL_TH(s_(35)), ret: 0.4 + 0.6 * ramp(t, wf(35, "retinaculum"), wf(35, "retinaculum") + 0.4), nerves: { med: ramp(t, wf(36, "median"), wf(36, "median") + 1.0), rec: ramp(t, s_(37), s_(37) + 1.6) } })}
        </ZoomBox>
        <div style={abs(830, 30, { width: 600 })}>
          <div><Chip t={t} t0={wf(36, "same")} bg={MC.med} color={C.forest} size={34}>all 3: recurrent branch of MEDIAN n.</Chip></div>
        </div>
      </Seg>
      <Seg t={t} a={m3} b={BE(2) + 0.1}>
        <TallPlate {...THUMB} x={0} y={0} w={760} h={740} t={t} t0={m3} tag="GRAY'S 1918 · MUSCLES OF THE THUMB (DEEP)"
          keys={[[m3, 1.0, 0.5, 0.5], [s_(40), 1.45, 0.45, 0.66]]}
          pins={[
            { t0: s_(38) + 0.4, t1: s_(40), x: 0.33, y: 0.42, text: "opponens pollicis", dx: 0, dy: -130 },
            { t0: wf(40, "oblique"), x: 0.43, y: 0.6, text: "oblique head", dx: 160, dy: -150, hot: true, col: MC.add },
            { t0: wf(40, "transverse"), x: 0.5, y: 0.76, text: "transverse head", dx: 120, dy: 90, hot: true, col: MC.add },
          ]} />
        <Note t={t} t0={wf(40, "transverse") + 0.9} old="adductor obliquus / transversus" x={20} y={620} />
        <Hdr t={t} t0={s_(39)} x={820} y={0} size={62}>Adductor pollicis</Hdr>
        <Col x={820} y={100} gap={14}>
          <RowL t={t} t0={wf(38, "deeper")} col={MC.add} n="↓" title="deeper than the thenar three" w={980} />
          <RowL t={t} t0={wf(40, "fan")} col={MC.add} n="2" title="fan-shaped · 2 heads" sub="oblique + transverse" w={980} />
          <RowL t={t} t0={s_(41)} col={MC.add} n="←" title="pulls the thumb back to the palm" sub="squeeze a card against your index finger" w={980} />
        </Col>
        <div style={abs(820, 450)}><Chip t={t} t0={s_(42)} bg={C.red} size={44}>THE CATCH</Chip></div>
        <DCard t={t} t0={wf(43, "ulnar")} x={820} y={540} w={980} bg={MC.uln} size={48}>nerve: ULNAR, not median!</DCard>
      </Seg>
    </Stage>
  );
};

/* ================= 3. HYPOTHENAR ================= */
export const SHypo: React.FC = () => {
  const t = useT();
  const a = ST(3), m1 = s_(48) - 0.2, m1b = s_(50) - 0.2, m2 = s_(51) - 0.2, m3 = s_(54) - 0.2;
  const PairRow: React.FC<{ t0: number; l: string; r: string; on?: boolean }> = ({ t0, l, r, on }) => (
    <div style={{ ...pop(t, t0), display: "flex", gap: 14, transformOrigin: "50% 50%" }}>
      <div style={{ width: 470, background: on ? C.banana : MC.th, borderRadius: 22, padding: "12px 20px", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.forest, border: `3px solid ${C.forest}` }}>{l} <span style={{ fontSize: 26 }}>pollicis</span></div>
      <div style={{ width: 470, background: on ? C.banana : MC.hyp, borderRadius: 22, padding: "12px 20px", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.forest, border: `3px solid ${C.forest}` }}>{r} <span style={{ fontSize: 26 }}>digiti minimi</span></div>
    </div>
  );
  return (
    <Stage a={a} b={BE(3)}>
      <Seg t={t} a={a - 0.1} b={m1}>
        <ZoomBox x={0} y={0} w={760} h={740} t={t} t0={a} tag={PALM_TAG} keys={[[a, 1.05, 0.5, 0.58]]}>
          {PALMV(t, { dim: 0.65, lit: { ...ALL_TH(s_(45)), ...ALL_HY(s_(45) + 0.7) } })}
          <line x1={455} y1={430} x2={455} y2={990} stroke={C.red} strokeWidth={6} strokeDasharray="16 12" opacity={ramp(t, s_(45) + 0.4, s_(45) + 0.8)} />
        </ZoomBox>
        <Hdr t={t} t0={s_(45)} x={820} y={0} size={58}>Hypothenar = mirror image</Hdr>
        <div style={abs(820, 92, { display: "flex", gap: 14, ...pop(t, s_(45) + 0.3) })}>
          <div style={{ width: 470, fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 4, color: MC.thD }}>THUMB</div>
          <div style={{ width: 470, fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 4, color: MC.hypD }}>LITTLE FINGER</div>
        </div>
        <Col x={820} y={140} gap={14}>
          <PairRow t0={wf(46, "abductor")} l="abductor" r="abductor" />
          <PairRow t0={wf(46, "flexor")} l="flexor" r="flexor" />
          <PairRow t0={wf(46, "opponens")} l="opponens" r="opponens" />
        </Col>
        <div style={abs(820, 470)}><Chip t={t} t0={wf(47, "digiti")} bg={C.forest} color={C.banana} size={42}>digiti minimi = of the little finger</Chip></div>
      </Seg>
      <Seg t={t} a={m1} b={m1b}>
        <TallPlate {...PALM} x={0} y={0} w={640} h={740} t={t} t0={m1} tag="GRAY'S 1918 · LEFT PALM"
          keys={[[m1, 2.0, 0.33, 0.27], [s_(49), 2.2, 0.36, 0.34]]}
          pins={[
            { t0: wf(48, "pisiform"), x: 0.45, y: 0.165, text: "pisiform", dx: -170, dy: 30 },
            { t0: wf(48, "abductor"), x: 0.28, y: 0.38, text: "abductor digiti minimi", dx: 140, dy: 140, hot: t < s_(49) },
            { t0: wf(49, "flexor"), x: 0.37, y: 0.39, text: "flexor digiti minimi brevis", dx: 120, dy: -170, hot: t >= s_(49) },
          ]} />
        <Note t={t} t0={wf(48, "away") } old="abductor digiti quinti" modern="minimi" x={20} y={620} />
        <Col x={680} y={0} gap={14}>
          <RowL t={t} t0={wf(48, "abductor")} col={MC.hyp} n="1" title="Abductor digiti minimi" sub="from the pisiform · pulls the little finger away from the ring finger" w={1120} on={t < s_(49)} />
          <RowL t={t} t0={wf(49, "flexor")} col={MC.hyp} n="2" title="Flexor digiti minimi brevis" sub="from the hook of the hamate · bends the little finger at its knuckle" w={1120} on={t >= s_(49)} />
        </Col>
      </Seg>
      <Seg t={t} a={m1b} b={m2}>
        <TallPlate {...THUMB} x={0} y={0} w={760} h={740} t={t} t0={m1b} tag="GRAY'S 1918 · DEEP MUSCLES"
          keys={[[m1b, 1.7, 0.72, 0.45]]}
          pins={[{ t0: wf(50, "opponens"), x: 0.75, y: 0.47, text: "opponens digiti minimi", dx: -160, dy: 190, hot: true, col: MC.hyp }]} />
        <Note t={t} t0={wf(50, "opponens") + 1.2} old="opponens quinti digiti" x={20} y={620} />
        <Col x={820} y={0} gap={14}>
          <RowL t={t} t0={m1b} col={MC.hyp} n="1" title="Abductor digiti minimi" w={980} size={32} />
          <RowL t={t} t0={m1b} col={MC.hyp} n="2" title="Flexor digiti minimi brevis" w={980} size={32} />
          <RowL t={t} t0={wf(50, "opponens")} col={MC.hyp} n="3" title="Opponens digiti minimi" sub="deep · hook of the hamate · rolls the 5th metacarpal forward, cups the palm" w={980} on />
        </Col>
      </Seg>
      <Seg t={t} a={m2} b={m3}>
        <div style={abs(0, 0, { width: 860, ...pop(t, m2) })}><Big size={46}>Guyon's canal: the ulnar nerve's own tunnel</Big></div>
        <TallPlate {...WRIST} x={0} y={130} w={860} h={500} t={t} t0={m2} tag="GRAY'S 1918 · SLICE THROUGH THE WRIST" keys={[[m2, 1.0, 0.5, 0.5], [s_(52), 1.35, 0.55, 0.42]]}
          pins={[
            { t0: s_(51), x: 0.69, y: 0.47, text: "hypothenar", dx: 20, dy: 150, col: MC.hyp },
            { t0: wf(52, "canal"), x: 0.565, y: 0.375, text: "ulnar n. + a.", dx: -60, dy: -110, hot: true },
            { t0: wf(52, "pisiform") , x: 0.42, y: 0.40, text: "median n. (carpal tunnel)", dx: -60, dy: 170, col: MC.med },
          ]} />
        <ZoomBox x={900} y={0} w={900} h={740} t={t} t0={m2 + 0.2} tag={PALM_TAG} keys={[[m2, 1.3, 0.38, 0.75]]}
          pins={[
            { t0: wf(52, "canal"), pt: pp("guyon"), text: "Guyon's canal", dx: 150, dy: 30, hot: true },
            { t0: wf(53, "superficial"), pt: [310, 640], text: "superficial br.", dx: 160, dy: -60, size: 28 },
            { t0: wf(53, "deep"), pt: [520, 770], text: "deep br. → hypothenar 3", dx: 60, dy: -150, size: 28, col: MC.uln },
          ]}>
          {PALMV(t, { dim: 0.6, lit: ALL_HY(s_(51)), nerves: { uln: ramp(t, s_(52), s_(52) + 1.2), sup: ramp(t, wf(53, "superficial"), wf(53, "superficial") + 1), deep: ramp(t, wf(53, "deep"), wf(53, "deep") + 1.4) } })}
        </ZoomBox>
        <div style={abs(0, 660)}><Chip t={t} t0={s_(51)} bg={MC.uln} size={34}>all 3: deep branch of the ULNAR nerve</Chip></div>
      </Seg>
      <Seg t={t} a={m3} b={BE(3) + 0.1}>
        <TallPlate {...PALM} x={0} y={0} w={760} h={740} t={t} t0={m3} tag="GRAY'S 1918 · LEFT PALM" keys={[[m3, 2.4, 0.42, 0.29]]}
          pins={[{ t0: wf(55, "palmaris"), x: 0.43, y: 0.29, text: "palmaris brevis", dx: 150, dy: -170, hot: true, col: MC.pb }]} />
        <Hdr t={t} t0={s_(54)} x={820} y={0} size={58}>Bonus muscle: Palmaris brevis</Hdr>
        <Col x={820} y={110} gap={16}>
          <RowL t={t} t0={wf(55, "skin")} col={MC.pb} n="1" title="in the skin over the hypothenar eminence" w={980} />
          <RowL t={t} t0={wf(56, "wrinkles")} col={MC.pb} n="2" title="wrinkles that skin" w={980} />
          <RowL t={t} t0={wf(56, "deepen")} col={MC.pb} n="3" title="deepens the cup of the palm → better grip" w={980} />
        </Col>
        <div style={abs(820, 470)}><Chip t={t} t0={wf(56, "grip")} bg={MC.uln} size={38}>nerve: ulnar (that makes 19)</Chip></div>
      </Seg>
    </Stage>
  );
};

/* ================= 4. LUMBRICALS ================= */
export const SLum: React.FC = () => {
  const t = useT();
  const a = ST(4), m1 = s_(60) - 0.2, m2 = s_(64) - 0.2, m3 = s_(68) - 0.2;
  const k = kv(t, [[s_(64), 0], [wf(65, "flex"), 0], [wf(65, "knuckles") + 0.5, 0.55], [wf(65, "straighten"), 0.55], [e_(65), 1], [s_(66), 1], [s_(66) + 0.5, 0], [wf(67, "knuckles"), 0], [wf(67, "straight"), 1]]);
  const J = SF_PTS(k);
  return (
    <Stage a={a} b={BE(4)}>
      <Seg t={t} a={a - 0.1} b={m1}>
        <TallPlate {...PALM} x={0} y={0} w={760} h={740} t={t} t0={a} tag="GRAY'S 1918 · LEFT PALM" keys={[[a, 1.8, 0.52, 0.5]]}
          pins={[
            { t0: wf(58, "four"), x: 0.635, y: 0.53, text: "1", dx: 70, dy: 40, hot: true, col: MC.lum },
            { t0: wf(58, "four") + 0.25, x: 0.545, y: 0.5, text: "2", dx: 50, dy: 120, hot: true, col: MC.lum },
            { t0: wf(58, "four") + 0.5, x: 0.465, y: 0.47, text: "3", dx: -10, dy: 150, hot: true, col: MC.lum },
            { t0: wf(58, "four") + 0.75, x: 0.395, y: 0.47, text: "4", dx: -70, dy: 130, hot: true, col: MC.lum },
          ]} />
        <Hdr t={t} t0={s_(57)} x={820} y={0} size={64}>4 lumbricals</Hdr>
        <Col x={820} y={110} gap={16}>
          <RowL t={t} t0={wf(58, "one")} col={MC.lum} n="4" title="one for each finger" sub="index · middle · ring · little" w={980} />
          <RowL t={t} t0={wf(58, "thumb")} col={C.line} n="✗" title="not the thumb" w={980} />
        </Col>
        <div style={abs(820, 380, { ...pop(t, s_(59)), display: "flex", alignItems: "center", gap: 30, background: C.card, border: `3px solid ${C.line}`, borderRadius: 30, padding: "16px 30px", width: 980, boxSizing: "border-box", transformOrigin: "0% 50%" })}>
          <Worm t={t} size={280} />
          <div style={{ fontFamily: FONT, fontWeight: 800 }}>
            <div style={{ fontSize: 46, color: C.forest }}>lumbricus</div>
            <div style={{ fontSize: 36, color: C.matcha }}>= earthworm (Latin)</div>
          </div>
        </div>
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <ZoomBox x={0} y={0} w={760} h={740} t={t} t0={m1} tag={PALM_TAG} keys={[[m1, 1.0, 0.5, 0.55], [s_(62), 1.3, 0.47, 0.62]]}
          pins={[
            { t0: wf(62, "tendons"), pt: [462, 840], text: "FDP tendons", dx: 180, dy: 40 },
            { t0: wf(63, "joins"), pt: [575, 500], text: "→ extensor expansion", dx: 150, dy: -70, size: 28 },
          ]}>
          {PALMV(t, { show: ["l1", "l2", "l3", "l4"], lit: ALL_L(wf(62, "tendons")), tendons: ramp(t, wf(62, "tendons") - 0.3, wf(62, "tendons") + 0.4) })}
        </ZoomBox>
        <Hdr t={t} t0={s_(60)} x={820} y={0} size={56}>What makes them unique</Hdr>
        <Col x={820} y={100} gap={16}>
          <RowL t={t} t0={s_(61)} col={C.red} n="✗" title="they don't start from bone" w={980} />
          <RowL t={t} t0={wf(62, "tendons")} col={MC.lum} n="→" title="start: tendons of flexor digitorum profundus" sub="the deep finger flexor from the forearm" w={980} />
          <RowL t={t} t0={wf(63, "thumb")} col={MC.lum} n="↗" title="run along the thumb side of each finger" w={980} />
          <RowL t={t} t0={wf(63, "expansion")} col={MC.lum} n="✓" title="end: extensor expansion (the hood)" sub="on the back of the finger" w={980} />
        </Col>
      </Seg>
      <Seg t={t} a={m2} b={m3}>
        <ZoomBox x={0} y={0} w={940} h={740} t={t} t0={m2} cw={1000} ch={800} tag="ONE FINGER · SIDE VIEW" keys={[[m2, 1.0, 0.5, 0.5]]}
          pins={[
            { t0: wf(65, "metacarpophalangeal"), pt: J.mcp, text: "MCP: flexes", dx: -120, dy: -140, hot: true, size: 30 },
            { t0: wf(65, "interphalangeal"), pt: J.pip, text: "IP: straighten", dx: 170, dy: -60, hot: true, size: 30 },
            { t0: wf(64, "double"), pt: [330, 282], text: "lumbrical", dx: -60, dy: 170, col: MC.lum, size: 30 },
          ]}>
          <SideFinger t={t} k={k} lit={ramp(t, s_(64), s_(64) + 0.4)} />
        </ZoomBox>
        <Hdr t={t} t0={s_(64)} x={980} y={0} size={56}>A double job</Hdr>
        <Col x={980} y={100} gap={16}>
          <RowL t={t} t0={wf(65, "flex")} col={MC.lum} n="1" title="flex the knuckles" sub="metacarpophalangeal (MCP) joints" w={820} />
          <RowL t={t} t0={wf(65, "straighten")} col={MC.lum} n="2" title="straighten the fingers" sub="interphalangeal (IP) joints" w={820} />
        </Col>
        <DCard t={t} t0={s_(66)} x={980} y={360} w={820} size={42}>a waiter holding a tray on flat fingers</DCard>
        <DCard t={t} t0={s_(67)} x={980} y={520} w={820} bg={C.banana} color={C.forest} size={40}>knuckles bent + fingers straight = lumbrical position</DCard>
      </Seg>
      <Seg t={t} a={m3} b={BE(4) + 0.1}>
        <ZoomBox x={0} y={0} w={760} h={740} t={t} t0={m3} tag={PALM_TAG} keys={[[m3, 1.2, 0.47, 0.6]]}>
          {PALMV(t, { show: ["l1", "l2", "l3", "l4"], tendons: 0.6, nerveMode: { l1: wf(69, "median"), l2: wf(69, "median"), l3: wf(70, "ulnar"), l4: wf(70, "ulnar") }, nerves: { med: ramp(t, wf(69, "median") - 0.6, wf(69, "median") + 0.6), uln: ramp(t, wf(70, "ulnar") - 0.6, wf(70, "ulnar") + 0.6), deep: ramp(t, wf(70, "ulnar"), wf(70, "ulnar") + 1.2) } })}
        </ZoomBox>
        <Hdr t={t} t0={s_(68)} x={820} y={0} size={58}>Split nerve supply</Hdr>
        <Col x={820} y={110} gap={20}>
          <RowL t={t} t0={wf(69, "first")} col={MC.med} n="1+2" title="index + middle → MEDIAN" w={980} size={42} />
          <RowL t={t} t0={wf(70, "third")} col={MC.uln} n="3+4" title="ring + little → ULNAR" w={980} size={42} />
        </Col>
        <div style={abs(820, 360, { opacity: ramp(t, e_(70) - 0.2, e_(70) + 0.3) })}><Big size={40} color={C.matcha}>the only intrinsic group split between both nerves</Big></div>
      </Seg>
    </Stage>
  );
};

/* ================= 5. INTEROSSEI ================= */
export const SInter: React.FC = () => {
  const t = useT();
  const a = ST(5), m1 = s_(74) - 0.2, m2 = s_(77) - 0.2, m3 = s_(80) - 0.2, m4 = s_(84) - 0.2;
  const spD = kv(t, [[wf(76, "spread"), 0], [wf(76, "apart") + 0.3, 1], [e_(76) + 0.6, 1]]);
  const spP = kv(t, [[m2, 0.9], [wf(79, "pull") - 0.2, 0.9], [wf(79, "together") + 0.4, -0.35]]);
  return (
    <Stage a={a} b={BE(5)}>
      <Seg t={t} a={a - 0.1} b={m1}>
        <TallPlate {...DORS} x={0} y={0} w={440} h={740} t={t} t0={a} tag="DORSAL · FIG. 428" credit={false} keys={[[a, 1.05, 0.5, 0.38]]}
          pins={[{ t0: wf(73, "line"), x: 0.49, y: 0.05, text: "middle-finger line", dx: 0, dy: 60, hot: true, size: 26 }]} />
        <TallPlate {...PALI} x={460} y={0} w={440} h={740} t={t} t0={a + 0.3} tag="PALMAR · FIG. 429" credit={false} keys={[[a, 1.05, 0.5, 0.38]]} />
        <div style={abs(10, 700, { fontFamily: FONT, fontWeight: 700, fontSize: 17, color: C.forest, opacity: 0.65 })}>Gray's Anatomy, 1918 · public domain</div>
        <Hdr t={t} t0={s_(71)} x={940} y={0} size={60}>Interossei: the deepest layer</Hdr>
        <div style={abs(940, 110, { display: "flex", gap: 14 })}>
          <Chip t={t} t0={wf(72, "between")} bg={C.forest} color={C.banana} size={38}>inter = between</Chip>
          <Chip t={t} t0={wf(72, "bones")} bg={C.matcha} size={38}>os = bone</Chip>
        </div>
        <Col x={940} y={210} gap={16}>
          <RowL t={t} t0={wf(72, "fill")} col={MC.dor} n="↔" title="fill the gaps between the metacarpals" w={860} />
          <RowL t={t} t0={wf(73, "two")} col={MC.pal} n="2" title="two sets: dorsal + palmar" w={860} />
        </Col>
        <DCard t={t} t0={wf(73, "measured")} x={940} y={420} w={860} bg={C.red} size={42}>everything is measured from a line through the MIDDLE finger</DCard>
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <ZoomBox x={0} y={0} w={760} h={740} cw={900} ch={900} t={t} t0={m1} tag="LEFT PALM VIEW · SCHEMATIC" keys={[[m1, 1.0, 0.5, 0.5]]}>
          <Spread t={t} spread={spD} dorsal={ramp(t, s_(74), s_(74) + 0.5)} axis={1} arrows={t > wf(76, "spread") ? "out" : null} hiD={t >= s_(75) && t < s_(76) ? [1, 2, 3, 4] : []} />
        </ZoomBox>
        <Hdr t={t} t0={s_(74)} x={820} y={0} size={60} color={MC.dorD}>Dorsal interossei</Hdr>
        <Col x={820} y={100} gap={16}>
          <RowL t={t} t0={wf(74, "back")} col={MC.dor} n="↑" title="toward the back of the hand" w={980} />
          <RowL t={t} t0={wf(75, "four")} col={MC.dor} n="4" title="4 muscles · 2 heads each" sub="from the 2 metacarpals beside them" w={980} />
          <RowL t={t} t0={wf(76, "spread")} col={MC.dor} n="↔" title="spread the fingers apart" sub="ABduct: away from the middle finger" w={980} on={t > wf(76, "spread")} />
        </Col>
        <div style={abs(820, 480)}><Chip t={t} t0={wf(76, "apart")} bg={MC.dorD} size={60}>DAB = Dorsal ABduct</Chip></div>
      </Seg>
      <Seg t={t} a={m2} b={m3}>
        <ZoomBox x={0} y={0} w={760} h={740} cw={900} ch={900} t={t} t0={m2} tag="LEFT PALM VIEW · SCHEMATIC" keys={[[m2, 1.0, 0.5, 0.5]]}>
          <Spread t={t} spread={spP} palmar={ramp(t, s_(77), s_(77) + 0.5)} axis={1} arrows={t > wf(79, "pull") ? "in" : null} hiP={t >= s_(78) && t < s_(79) ? [1, 2, 3] : []} />
        </ZoomBox>
        <Hdr t={t} t0={s_(77)} x={820} y={0} size={60} color={MC.palD}>Palmar interossei</Hdr>
        <Col x={820} y={100} gap={16}>
          <RowL t={t} t0={wf(77, "palm")} col={MC.pal} n="↓" title="on the palm side" w={980} />
          <RowL t={t} t0={wf(78, "three")} col={MC.pal} n="3" title="3 muscles · 1 head each" sub="index · ring · little finger" w={980} />
          <RowL t={t} t0={wf(79, "pull")} col={MC.pal} n="→←" title="pull the fingers together" sub="ADduct: toward the middle finger" w={980} on={t > wf(79, "pull")} />
        </Col>
        <div style={abs(820, 480)}><Chip t={t} t0={wf(79, "together")} bg={MC.palD} size={60}>PAD = Palmar ADduct</Chip></div>
      </Seg>
      <Seg t={t} a={m3} b={m4}>
        <ZoomBox x={0} y={0} w={760} h={740} cw={900} ch={900} t={t} t0={m3} tag="LEFT PALM VIEW · SCHEMATIC" keys={[[m3, 1.0, 0.5, 0.5]]}>
          <Spread t={t} spread={0} dorsal={1} palmar={0} axis={1} mid={t > s_(82) && t < s_(83) ? Math.sin((t - s_(82)) * 4) : 0} hiD={t >= s_(81) && t < s_(83) ? [2, 3] : []} hiT={ramp(t, wf(83, "thumb"), wf(83, "thumb") + 0.4)} />
        </ZoomBox>
        <TallPlate {...DORS} x={790} y={0} w={380} h={740} t={t} t0={s_(81)} tag="FIG. 428" credit={false} keys={[[s_(81), 1.5, 0.47, 0.3]]}
          pins={[
            { t0: wf(81, "two"), x: 0.385, y: 0.30, text: "2nd", dx: -30, dy: 110, hot: true, size: 28, col: MC.dor },
            { t0: wf(81, "two") + 0.3, x: 0.56, y: 0.31, text: "3rd", dx: 30, dy: 150, hot: true, size: 28, col: MC.dor },
          ]} />
        <Hdr t={t} t0={s_(80)} x={1200} y={0} size={44} color={C.red}>Examiners love this</Hdr>
        <Col x={1200} y={80} gap={14}>
          <RowL t={t} t0={wf(81, "middle")} col={MC.dor} n="2" title="middle finger: 2 dorsal" w={600} size={34} />
          <RowL t={t} t0={wf(81, "palmar")} col={C.line} n="0" title="…and NO palmar" w={600} size={34} />
          <RowL t={t} t0={s_(82)} col={C.banana} n="↔" title="moves either way" sub="never toward itself" w={600} size={34} />
          <RowL t={t} t0={wf(83, "thumb")} col={C.red} n="✗" title="thumb + little finger: no dorsal" sub="they have their own abductors" w={600} size={34} />
        </Col>
      </Seg>
      <Seg t={t} a={m4} b={BE(5) + 0.1}>
        <ZoomBox x={0} y={0} w={760} h={740} cw={900} ch={900} t={t} t0={m4} tag="LEFT PALM VIEW · SCHEMATIC" keys={[[m4, 1.0, 0.5, 0.5]]}>
          <Spread t={t} spread={Math.sin((t - m4) * 1.6) * 0.6} dorsal={1} palmar={1} axis={0.5} labels={0} />
        </ZoomBox>
        <Col x={820} y={0} gap={18}>
          <RowL t={t} t0={s_(84)} col={MC.lum} n="+" title="also: flex the knuckles + straighten the fingers" sub="just like the lumbricals" w={980} />
        </Col>
        <DCard t={t} t0={s_(85)} x={820} y={180} w={980} bg={MC.uln} size={52}>all 7 interossei → deep branch of the ULNAR nerve</DCard>
      </Seg>
    </Stage>
  );
};

/* ================= 6. NERVE SUPPLY ================= */
export const SNerve: React.FC = () => {
  const t = useT();
  const a = ST(6), m1 = s_(89) - 0.2;
  const tM = { l: wf(90, "lumbricals"), th: wf(90, "thenar") };
  const tU = { add: wf(92, "adductor"), hy: wf(92, "hypothenar"), l: wf(92, "third"), int: wf(92, "seven"), pb: wf(92, "palmaris") };
  const med = t < tM.l ? 0 : t < tM.th ? 2 : 5;
  const uln = t < tU.add ? 0 : t < tU.hy ? 1 : t < tU.l ? 4 : t < tU.int ? 6 : t < tU.pb ? 13 : 14;
  const NC: React.FC<{ t0: number; name: string; n: number | string; col: string; x: number; dim?: boolean; on?: boolean }> = ({ t0, name, n, col, x, dim, on }) => (
    <div style={abs(x, 0, { ...pop(t, t0), width: 300, height: 250, borderRadius: 30, background: col, border: `4px solid ${on ? C.forest : "transparent"}`, opacity: (dim ? 0.55 : 1) * ramp(t, t0, t0 + 0.3), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, color: C.forest })}>
      <div style={{ fontSize: 32, letterSpacing: 4 }}>{name}</div>
      <div style={{ fontSize: 120, lineHeight: 1 }}>{n}</div>
    </div>
  );
  return (
    <Stage a={a} b={BE(6)}>
      <Seg t={t} a={a - 0.1} b={m1}>
        <TallPlate {...NERV} x={0} y={0} w={760} h={740} t={t} t0={a} tag="GRAY'S 1918 · PALMAR NERVES (AFTER TESTUT)" keys={[[a, 1.15, 0.5, 0.3]]}
          pins={[
            { t0: wf(87, "median"), x: 0.445, y: 0.22, text: "median", dx: -130, dy: -40, col: MC.med },
            { t0: wf(87, "ulnar"), x: 0.655, y: 0.13, text: "ulnar", dx: 130, dy: 30, col: MC.uln },
          ]} />
        <Hdr t={t} t0={s_(86)} x={820} y={0} size={56}>What exams ask most</Hdr>
        <div style={abs(820, 100, { display: "flex", gap: 20 })}>
          <div style={{ ...pop(t, wf(87, "median")), width: 320, borderRadius: 26, background: MC.med, padding: "18px 24px", fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.forest }}>MEDIAN ✓</div>
          <div style={{ ...pop(t, wf(87, "ulnar")), width: 320, borderRadius: 26, background: MC.uln, padding: "18px 24px", fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.paper }}>ULNAR ✓</div>
        </div>
        <div style={abs(820, 240, { ...pop(t, s_(88)), width: 660, borderRadius: 26, background: C.line, padding: "18px 24px", fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.forest, transformOrigin: "0% 50%" })}>
          RADIAL ✗ <span style={{ fontSize: 32, color: C.matcha }}>supplies none of them</span>
        </div>
      </Seg>
      <Seg t={t} a={m1} b={BE(6) + 0.1}>
        <ZoomBox x={0} y={0} w={760} h={740} t={t} t0={m1} tag={PALM_TAG} keys={[[m1, 1.0, 0.5, 0.55]]}>
          {PALMV(t, {
            nerveMode: { l1: tM.l, l2: tM.l, apb: tM.th, fpb: tM.th, op: tM.th, addO: tU.add, addT: tU.add, adm: tU.hy, fdm: tU.hy, odm: tU.hy, l3: tU.l, l4: tU.l, pb: tU.pb },
            eminence: { middle: ramp(t, tU.int, tU.int + 0.4) },
            stripe: { fpb: wf(94, "deep") },
            nerves: { med: ramp(t, s_(89), s_(89) + 1), rec: ramp(t, tM.th, tM.th + 1), uln: ramp(t, s_(91), s_(91) + 1), sup: ramp(t, s_(91) + 0.6, s_(91) + 1.4), deep: ramp(t, s_(91) + 0.8, s_(91) + 2) },
          })}
        </ZoomBox>
        <NC t0={s_(89)} name="MEDIAN" n={med} col={MC.med} x={820} on={t < s_(91)} />
        <NC t0={s_(91)} name="ULNAR" n={uln} col={MC.uln} x={1140} on={t >= s_(91) && t < s_(95)} />
        <NC t0={m1} name="RADIAL" n={0} col={C.line} x={1460} dim />
        <div style={abs(820, 280, { width: 980, opacity: ramp(t, wf(90, "first"), wf(90, "first") + 0.3) * (1 - ramp(t, s_(91) - 0.2, s_(91))), fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.forest, lineHeight: 1.3 })}>
          lumbricals 1 + 2 · thenar 3 (abductor, flexor, opponens pollicis)
        </div>
        <div style={abs(820, 280, { width: 980, opacity: ramp(t, s_(91), s_(91) + 0.3) * (1 - ramp(t, s_(93) - 0.2, s_(93))), fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.forest, lineHeight: 1.3 })}>
          adductor pollicis · hypothenar 3 · lumbricals 3 + 4 · all 7 interossei · palmaris brevis
        </div>
        <DCard t={t} t0={s_(93)} x={820} y={280} w={980} bg={C.card} color={C.forest} size={36}>
          <span style={{ color: C.red }}>exception:</span> the deep head of flexor pollicis brevis often gets a twig of the ulnar nerve
        </DCard>
        <div style={abs(820, 470, { ...pop(t, s_(95)), width: 980, display: "flex", gap: 16, transformOrigin: "0% 50%" })}>
          <div style={{ flex: 1, background: MC.med, borderRadius: 26, padding: "18px 24px", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.forest, lineHeight: 1.15, opacity: ramp(t, wf(96, "median"), wf(96, "median") + 0.3) }}>MEDIAN: the thumb's ball + 2 lumbricals</div>
          <div style={{ flex: 1, background: MC.uln, borderRadius: 26, padding: "18px 24px", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.paper, lineHeight: 1.15, opacity: ramp(t, wf(96, "ulnar"), wf(96, "ulnar") + 0.3) }}>ULNAR: everything else</div>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 7. TRICKS ================= */
export const STricks: React.FC = () => {
  const t = useT();
  const a = ST(7), m1 = s_(101) - 0.2, m2 = s_(104) - 0.2;
  const L4: [string, string, string][] = [["L", "lateral 2 lumbricals", "l"], ["O", "opponens pollicis", "o"], ["A", "abductor pollicis brevis", "a"], ["F", "flexor pollicis brevis", "f"]];
  const aofa: [string, string, string, number][] = [["A", "apb", "a", 0], ["O", "op", "o", 0], ["F", "fpb", "f", 0], ["A", "addT", "a", 1], ["O", "odm", "o", 1], ["F", "fdm", "f", 1], ["A", "adm", "a", 2]];
  const spr = kv(t, [[wf(103, "palmar"), 0.8], [wf(103, "adduct") + 0.2, -0.35], [wf(103, "dorsal"), -0.35], [wf(103, "abduct") + 0.3, 1]]);
  return (
    <Stage a={a} b={BE(7)}>
      <Seg t={t} a={a - 0.1} b={m1}>
        <TrickCard t={t} t0={a} n={1} title="The median nerve gets a LOAF">
          <div style={abs(60, 190, pop(t, wf(98, "loaf")))}><Loaf size={300} /></div>
          <div style={abs(420, 180, { display: "flex", flexDirection: "column", gap: 14 })}>
            {L4.map(([L, txt, tok]) => (
              <div key={L} style={{ ...pop(t, wf(99, tok)), display: "flex", alignItems: "center", gap: 24, fontFamily: FONT, fontWeight: 800, transformOrigin: "0% 50%" }}>
                <div style={{ width: 84, height: 84, borderRadius: 22, background: MC.med, color: C.forest, fontSize: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>{L}</div>
                <div style={{ fontSize: 46, color: C.paper }}>{txt}</div>
              </div>
            ))}
          </div>
          <div style={abs(1280, 120, { width: 460, height: 560, opacity: ramp(t, s_(99), s_(99) + 0.4) })}>
            <Palm t={t} nerveMode={{ l1: wf(99, "l"), l2: wf(99, "l"), op: wf(99, "o"), apb: wf(99, "a"), fpb: wf(99, "f"), addO: s_(100), addT: s_(100), adm: s_(100), fdm: s_(100), odm: s_(100), l3: s_(100), l4: s_(100), pb: s_(100) }} />
          </div>
          <div style={abs(420, 600, { ...pop(t, s_(100)), background: MC.uln, borderRadius: 22, padding: "10px 26px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.paper, transformOrigin: "0% 50%" })}>not in the LOAF? → ULNAR</div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <TrickCard t={t} t0={m1} n={2} title="Interossei: PAD and DAB">
          <div style={abs(60, 180, { width: 520, height: 520 })}>
            <Spread t={t} spread={spr} palmar={t < wf(103, "dorsal") ? 1 : 0} dorsal={t >= wf(103, "dorsal") ? 1 : 0} axis={1} labels={0} arrows={t > wf(103, "adduct") && t < wf(103, "dorsal") ? "in" : t > wf(103, "abduct") ? "out" : null} />
          </div>
          <div style={abs(680, 200, { ...pop(t, wf(102, "pad")), background: MC.pal, borderRadius: 30, padding: "18px 36px 24px", fontFamily: FONT, fontWeight: 800, color: C.forest, width: 1000, boxSizing: "border-box" })}>
            <div style={{ fontSize: 96, lineHeight: 1 }}>PAD</div>
            <div style={{ fontSize: 40, opacity: ramp(t, wf(103, "palmar"), wf(103, "palmar") + 0.3) }}>Palmar ADduct · fingers together</div>
          </div>
          <div style={abs(680, 440, { ...pop(t, wf(102, "dab")), background: MC.dor, borderRadius: 30, padding: "18px 36px 24px", fontFamily: FONT, fontWeight: 800, color: C.forest, width: 1000, boxSizing: "border-box" })}>
            <div style={{ fontSize: 96, lineHeight: 1 }}>DAB</div>
            <div style={{ fontSize: 40, opacity: ramp(t, wf(103, "dorsal"), wf(103, "dorsal") + 0.3) }}>Dorsal ABduct · fingers apart</div>
          </div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={m2} b={BE(7) + 0.1}>
        <TrickCard t={t} t0={m2} n={3} title="The palm, thumb side → little-finger side">
          <div style={abs(20, 130, { width: 620, height: 600 })}>
            <Palm t={t} dim={0.5} lit={t > s_(107) ? { apb: s_(107), adm: s_(107), addT: s_(107) + 0.6, addO: s_(107) + 0.6 } : {}} letters={aofa.map(([ch, id, tok, n]) => ({ id, ch, t0: wf(105, tok, n) }))} />
          </div>
          <div style={abs(660, 180, { display: "flex", gap: 14 })}>
            {aofa.map(([ch, id, tok, n], i) => (
              <div key={i} style={{ ...pop(t, wf(105, tok, n)), width: 128, height: 150, borderRadius: 26, background: i < 3 ? MC.th : i === 3 ? MC.add : MC.hyp, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 96, color: C.forest, border: (i === 0 || i === 6 || i === 3) && t > s_(107) ? `6px solid ${C.banana}` : "6px solid transparent" }}>{ch}</div>
            ))}
          </div>
          <div style={abs(660, 380, { display: "flex", gap: 14, fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.paper })}>
            <div style={{ width: 412, opacity: ramp(t, wf(106, "abductor"), wf(106, "abductor") + 0.3) }}>abductor · opponens · flexor <span style={{ color: C.matchaLight }}>(thumb)</span></div>
            <div style={{ width: 128, opacity: ramp(t, wf(106, "adductor"), wf(106, "adductor") + 0.3) }}>adductor</div>
            <div style={{ width: 412, opacity: ramp(t, wf(106, "opponens", 1), wf(106, "opponens", 1) + 0.3) }}>opponens · flexor · abductor <span style={{ color: C.matchaLight }}>(little f.)</span></div>
          </div>
          <div style={abs(660, 560, { ...pop(t, s_(107)), background: C.banana, borderRadius: 24, padding: "14px 28px 18px", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.forest, width: 1080, boxSizing: "border-box" })}>abductors on the outer edges · the adductor right in the middle</div>
        </TrickCard>
      </Seg>
    </Stage>
  );
};

/* ================= 8. QUIZ ================= */
type Q = { n: number; si: number; q: string; a: string; visual: (t: number, r: number, ans: number) => React.ReactNode };
const QS: Q[] = [
  { n: 1, si: 109, q: "Which nerve supplies opponens pollicis?", a: "median (recurrent branch)", visual: (t, r, ans) => <TallPlate {...THUMB} x={0} y={0} w={1000} h={740} t={t} t0={s_(109) - 0.2} keys={[[s_(109), 1.5, 0.35, 0.45]]} tag="GRAY'S 1918 · FIG. 426" pins={[{ t0: s_(109) + 0.3, x: 0.33, y: 0.42, text: r ? "median n." : "?", dx: 200, dy: -140, hot: true, col: r ? MC.med : undefined, size: 40 }]} /> },
  { n: 2, si: 111, q: "You spread your fingers wide apart. Which interossei do that?", a: "dorsal (DAB)", visual: (t, r, ans) => <ZoomBox x={0} y={0} w={1000} h={740} cw={900} ch={900} t={t} t0={s_(111) - 0.2} keys={[[s_(111), 1, 0.5, 0.5]]}><Spread t={t} spread={0.5 + 0.5 * Math.sin((t - s_(111)) * 2)} dorsal={r} axis={1} arrows="out" labels={r} /></ZoomBox> },
  { n: 3, si: 113, q: "The lumbricals start from the tendons of which muscle?", a: "flexor digitorum profundus", visual: (t, r, ans) => <ZoomBox x={0} y={0} w={1000} h={740} t={t} t0={s_(113) - 0.2} keys={[[s_(113), 1.25, 0.47, 0.6]]} pins={r ? [{ t0: ans, pt: [462, 840], text: "FDP tendons", dx: 200, dy: 20, hot: true }] : [{ t0: s_(113) + 0.3, pt: [462, 840], text: "?", dx: 160, dy: 20, hot: true, size: 44 }]}>{PALMV(t, { show: ["l1", "l2", "l3", "l4"], tendons: 1, lit: r ? ALL_L(ans) : {} })}</ZoomBox> },
  { n: 4, si: 115, q: "Which finger has 2 dorsal interossei and no palmar one?", a: "the middle finger", visual: (t, r, ans) => <ZoomBox x={0} y={0} w={1000} h={740} cw={900} ch={900} t={t} t0={s_(115) - 0.2} keys={[[s_(115), 1, 0.5, 0.5]]}><Spread t={t} spread={0} dorsal={1} palmar={0} axis={r} hiD={r ? [2, 3] : []} labels={1} /></ZoomBox> },
  { n: 5, si: 117, q: "How many intrinsic hand muscles does the radial nerve supply?", a: "none (0)", visual: (t, r, ans) => <TallPlate {...NERV} x={0} y={0} w={1000} h={740} t={t} t0={s_(117) - 0.2} keys={[[s_(117), 1.1, 0.5, 0.35]]} tag="GRAY'S 1918 · FIG. 815" pins={r ? [{ t0: ans, x: 0.445, y: 0.22, text: "median", dx: -150, dy: 0, col: MC.med }, { t0: ans + 0.2, x: 0.655, y: 0.13, text: "ulnar", dx: 150, dy: 40, col: MC.uln }] : []} /> },
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
              <div style={abs(50, 110, { width: 660, fontFamily: FONT, fontWeight: 800, fontSize: q.q.length > 52 ? 48 : 54, lineHeight: 1.12, color: C.paper })}>{q.q}</div>
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
    ["Intrinsic", "start + end in the hand · precision", Math.max(a, s_(120)), C.banana],
    ["Thenar 3", "abductor, flexor, opponens pollicis · recurrent br. of MEDIAN", s_(121), MC.th],
    ["Adductor pollicis", "deep · ULNAR", s_(122), MC.add],
    ["Hypothenar 3", "mirror image · deep br. of ULNAR", s_(123), MC.hyp],
    ["Lumbricals 4", "from FDP tendons · knuckles bent, fingers straight", s_(124), MC.lum],
    ["Interossei 7", "PAD + DAB · all ULNAR", s_(125), MC.dor],
  ];
  const ot = s_(126) - 0.2;
  const outro = ramp(t, ot, ot + 0.5);
  const lit: Record<string, number> = {};
  if (t >= s_(121)) Object.assign(lit, ALL_TH(s_(121)));
  if (t >= s_(122)) Object.assign(lit, ALL_AD(s_(122)));
  if (t >= s_(123)) Object.assign(lit, ALL_HY(s_(123)));
  if (t >= s_(124)) Object.assign(lit, ALL_L(s_(124)));
  return (
    <Stage a={a} b={END - 0.3}>
      {outro < 1 && (
        <div style={abs(0, 0, { width: 1800, height: 740, borderRadius: 44, background: C.forest })}>
          <div style={abs(70, 40, { fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 8, color: C.banana })}>RECAP</div>
          <div style={abs(70, 105, { display: "flex", flexDirection: "column", gap: 18 })}>
            {items.map(([h, s, tt, col]) => (
              <div key={h} style={{ ...pop(t, tt), display: "flex", alignItems: "center", gap: 24, fontFamily: FONT, fontWeight: 800, transformOrigin: "0% 50%" }}>
                <div style={{ width: 54, height: 54, borderRadius: 27, background: col, border: `4px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: C.forest, flexShrink: 0 }}>✓</div>
                <div style={{ width: 340, fontSize: 34, color: C.paper, flexShrink: 0, whiteSpace: "nowrap" }}>{h}</div>
                <div style={{ fontSize: 28, color: C.matchaLight, width: 730, lineHeight: 1.15 }}>{s}</div>
              </div>
            ))}
          </div>
          <div style={abs(1300, 40, { opacity: ramp(t, a, a + 0.5), width: 450, height: 660, borderRadius: 32, background: C.card, overflow: "hidden" })}>
            <div style={abs(-15, 20, { width: 480, height: 620 })}>
              <Palm t={t} lit={lit} dim={0.6} eminence={{ middle: ramp(t, s_(125), s_(125) + 0.4) }} />
            </div>
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
              <div style={{ background: C.red, color: C.paper, borderRadius: 50, padding: "18px 54px 22px", fontSize: 54, letterSpacing: 3, transform: `scale(${1 + 0.05 * Math.max(0, Math.sin((t - ot) * 5))})`, opacity: ramp(t, wf(127, "subscribe"), wf(127, "subscribe") + 0.3) }}>SUBSCRIBE</div>
              <div style={{ fontSize: 34, color: C.matchaLight, opacity: ramp(t, wf(126, "study"), wf(126, "study") + 0.3) }}>study cards: bookplume.com</div>
            </div>
            <div style={{ marginTop: 40, background: C.paper, color: C.forest, borderRadius: 24, padding: "16px 30px 20px", fontSize: 38, opacity: ramp(t, s_(128), s_(128) + 0.4), width: "fit-content" }}>Which hand muscle do you always mix up?</div>
          </div>
        </div>
      )}
    </Stage>
  );
};
