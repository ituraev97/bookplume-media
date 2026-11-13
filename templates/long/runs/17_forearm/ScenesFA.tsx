import React from "react";
import { Img, staticFile } from "remotion";
import { C, FONT, ramp, useT } from "./kit";
import { Stage, LogoMark } from "./Chrome16";
import { Forearm, FAProps, XSec, FingerSplit, Snuffbox, SB_PT, Rotate, WristBox, anchor, FC, NC } from "./IllusFA";
import { s_, e_, wf, ST, BE, abs, pop, Big, Mk, Seg, Note, Chip, ViewTag, Tag, TrickCard, kv } from "./Kit2";
import { END } from "./timeline";

/* ---------- plates (Gray's Anatomy 1918, public domain) ---------- */
const P = (f: string, w: number, h: number, fig: string) => ({ src: `plates/${f}.png`, aspect: w / h, fig });
const FSUP = P("fsup414", 683, 2409, "414");
const FDEEP = P("fdeep415", 1046, 3218, "415");
const BSUP = P("bsup418", 1023, 3295, "418");
const BDEEP = P("bdeep419", 1102, 3045, "419");
const NERV = P("nerves816", 1555, 3072, "816");
const BONES = P("bones213", 1807, 3223, "213");

type CK = [number, number, number, number];
type PinS = { t0: number; t1?: number; pt: [number, number]; text: string; dx?: number; dy?: number; hot?: boolean; size?: number; col?: string };

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

type TPin = { t0: number; t1?: number; x: number; y: number; text: string; dx?: number; dy?: number; hot?: boolean; col?: string; size?: number };
const TallPlate: React.FC<{ src: string; aspect: number; fig: string; x: number; y: number; w: number; h: number; t: number; t0: number; keys: CK[]; pins?: TPin[]; tag?: string; ring?: { x: number; y: number; t0: number; t1?: number }; credit?: boolean }> = ({ src, aspect, fig, x, y, w, h, t, t0, keys, pins = [], tag, ring, credit = true }) => {
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
      {ring && t >= ring.t0 && (ring.t1 === undefined || t < ring.t1) && [0, 0.33, 0.66].map((ph) => {
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
const DCard: React.FC<{ t: number; t0: number; x: number; y: number; w: number; bg?: string; children: React.ReactNode; size?: number; color?: string }> = ({ t, t0, x, y, w, bg = C.forest, children, size = 44, color = C.paper }) => (
  <div style={abs(x, y, { ...pop(t, t0, 0.35), width: w, background: bg, borderRadius: 30, padding: "20px 30px 24px", boxSizing: "border-box", fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1.15, transformOrigin: "0% 50%" })}>{children}</div>
);
/** muscle card: big name + what it does */
const MCard: React.FC<{ t: number; t0: number; x: number; y: number; w: number; col: string; tagTxt: string; name: string; lines: [string, number][] }> = ({ t, t0, x, y, w, col, tagTxt, name, lines }) => (
  <div style={abs(x, y, { ...pop(t, t0, 0.35), width: w, background: C.card, border: `4px solid ${C.line}`, borderRadius: 32, padding: "22px 30px 26px", boxSizing: "border-box", fontFamily: FONT, fontWeight: 800, transformOrigin: "0% 50%", boxShadow: "0 14px 30px rgba(31,42,20,0.10)" })}>
    <div style={{ display: "inline-block", background: col, color: C.forest, fontSize: 26, padding: "4px 16px 6px", borderRadius: 12, border: `3px solid ${C.forest}`, letterSpacing: 2 }}>{tagTxt}</div>
    <div style={{ fontSize: name.length > 24 ? 48 : 56, color: C.forest, lineHeight: 1.05, marginTop: 12 }}>{name}</div>
    {lines.map(([l, tt]) => (
      <div key={l} style={{ fontSize: 32, color: C.matcha, lineHeight: 1.2, marginTop: 10, opacity: ramp(t, tt, tt + 0.35), transform: `translateX(${(1 - ramp(t, tt, tt + 0.35)) * 20}px)` }}>→ {l}</div>
    ))}
  </div>
);
const FA = (t: number, p: Partial<FAProps>) => <Forearm t={t} view="front" {...p} />;
const at = (id: string, view: "front" | "back" = "front", u = 0.45) => anchor(id, view, u);
const FRONT_TAG = "LEFT FOREARM · FRONT · SCHEMATIC";
const BACK_TAG = "LEFT FOREARM · BACK · SCHEMATIC";

/* ================= 0. INTRO ================= */
export const SIntro: React.FC = () => {
  const t = useT();
  const m1 = s_(4) - 0.2, m2 = s_(6) - 0.2;
  return (
    <Stage a={-1} b={BE(0)}>
      <Seg t={t} a={-1} b={m1}>
        <TallPlate {...FSUP} x={0} y={0} w={520} h={740} t={t} t0={-1} keys={[[0, 1.05, 0.5, 0.45], [s_(1), 1.25, 0.45, 0.35], [s_(3), 1.0, 0.5, 0.5]]} tag="GRAY'S 1918 · FRONT"
          pins={[{ t0: wf(1, "twenty"), x: 0.45, y: 0.42, text: "≈ 20 muscles", dx: 40, dy: 150, hot: true, size: 36 }]} />
        <TallPlate {...BSUP} x={540} y={0} w={240} h={740} t={t} t0={s_(1)} keys={[[s_(1), 0.6, 0.5, 0.4]]} credit={false} />
        <div style={abs(820, 0, { width: 980, ...pop(t, 0.2) })}>
          <Big size={100}><Mk p={ramp(t, 0.6, 1.6)}>Forearm Muscles</Mk></Big>
          <Big size={100}><Mk p={ramp(t, 1.0, 2.0)}>Made Easy</Mk></Big>
          <Big size={40} color={C.matcha} style={{ marginTop: 10 }}>all 20 · flexors + extensors · in about 10 minutes</Big>
        </div>
        <div style={abs(820, 300, { display: "flex", flexDirection: "column", gap: 16 })}>
          <div><Chip t={t} t0={wf(0, "make")} bg={C.forest} size={40}>Make a fist + bend your wrist</Chip></div>
          <div><Chip t={t} t0={wf(1, "twenty")} bg={C.matcha} size={40}>≈ 20 muscles working together</Chip></div>
          <div><Chip t={t} t0={wf(2, "memorize")} bg={C.red} size={40}>one by one? → most students give up</Chip></div>
        </div>
        <div style={abs(820, 580, { display: "flex", gap: 14, flexWrap: "wrap", width: 980 })}>
          <Chip t={t} t0={wf(3, "compartments")} bg={C.banana} color={C.forest} size={38}>2 compartments</Chip>
          <Chip t={t} t0={wf(3, "bumps")} bg={C.banana} color={C.forest} size={38}>2 bumps on the elbow</Chip>
          <Chip t={t} t0={wf(3, "nerves")} bg={C.banana} color={C.forest} size={38}>3 nerves</Chip>
        </div>
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <TallPlate {...FDEEP} x={0} y={0} w={760} h={740} t={t} t0={m1} keys={[[m1, 1.0, 0.4, 0.75], [s_(5) + 0.5, 1.9, 0.28, 0.93]]} tag="GRAY'S 1918 · FIG. 415"
          ring={{ x: 0.265, y: 0.965, t0: wf(5, "tip") }}
          pins={[{ t0: wf(5, "tip"), x: 0.27, y: 0.955, text: "the tip of your finger", dx: 220, dy: -160, hot: true, size: 36 }]} />
        <div style={abs(820, 20)}><Chip t={t} t0={s_(4)} bg={C.matcha} size={36}>keep this in mind:</Chip></div>
        <div style={abs(820, 120, { width: 960, ...pop(t, wf(5, "only")), transformOrigin: "0% 50%" })}>
          <Big size={80}>Only ONE muscle can bend the tip of your finger.</Big>
        </div>
        <div style={abs(820, 420)}><Chip t={t} t0={wf(5, "which")} bg={C.red} size={64}>Which one?</Chip></div>
        <div style={abs(820, 560, { width: 960, opacity: ramp(t, wf(5, "which") + 0.6, wf(5, "which") + 1.1) })}><Big size={40} color={C.matcha}>…the answer comes in chapter 3.</Big></div>
      </Seg>
      <Seg t={t} a={m2} b={BE(0) + 0.1}>
        <TallPlate {...FSUP} x={0} y={0} w={240} h={740} t={t} t0={m2} keys={[[m2, 1.0, 0.5, 0.4]]} credit={false} />
        <TallPlate {...FDEEP} x={260} y={0} w={240} h={740} t={t} t0={m2 + 0.2} keys={[[m2, 0.86, 0.5, 0.4]]} credit={false} />
        <TallPlate {...BSUP} x={520} y={0} w={240} h={740} t={t} t0={m2 + 0.4} keys={[[m2, 0.86, 0.5, 0.35]]} credit={false} />
        <div style={abs(820, 0)}><Chip t={t} t0={s_(6)} bg={C.forest} size={44}>In about 10 minutes you'll:</Chip></div>
        <Col x={820} y={100} gap={14}>
          <RowL t={t} t0={wf(6, "name")} col={FC.pt} n="1" title="name every forearm muscle" sub="layer by layer" w={940} />
          <RowL t={t} t0={wf(6, "say")} col={FC.fds} n="2" title="say what each one does" w={940} />
          <RowL t={t} t0={wf(6, "nerve")} col={NC.med} n="3" title="know its nerve" w={940} />
          <RowL t={t} t0={wf(6, "tricks")} col={FC.sup} n="4" title="lock it in with tricks that stick" w={940} />
        </Col>
        <div style={abs(820, 560)}><Chip t={t} t0={wf(7, "quiz")} bg={C.red} size={46}>+ 5-question quiz at the end</Chip></div>
      </Seg>
    </Stage>
  );
};

/* ================= 1. BIG PICTURE ================= */
export const SBig: React.FC = () => {
  const t = useT();
  const a = ST(1), m1 = s_(11) - 0.2, m2 = s_(15) - 0.2, m3 = s_(19) - 0.2;
  return (
    <Stage a={a} b={BE(1)}>
      <Seg t={t} a={a - 0.1} b={m1}>
        <TallPlate {...BONES} x={0} y={0} w={560} h={740} t={t} t0={a} keys={[[a, 0.75, 0.5, 0.5], [wf(10, "interosseous"), 1.2, 0.47, 0.45]]} tag="GRAY'S 1918 · FIG. 213 · BONES"
          pins={[
            { t0: wf(9, "radius"), x: 0.62, y: 0.5, text: "radius · thumb side", dx: 20, dy: -150, col: FC.br },
            { t0: wf(9, "ulna"), x: 0.31, y: 0.55, text: "ulna · little-finger side", dx: 30, dy: 140, col: FC.fcu },
            { t0: wf(10, "interosseous"), x: 0.47, y: 0.42, text: "interosseous membrane", dx: 0, dy: -60, hot: true },
          ]} />
        <ZoomBox x={600} y={0} w={1200} h={740} cw={900} ch={700} t={t} t0={s_(10) - 0.3} keys={[[s_(10), 1, 0.5, 0.5]]} tag="CROSS-SECTION · MID-FOREARM"
          pins={[
            { t0: s_(10) + 0.2, pt: [640, 372], text: "radius", dx: 170, dy: 0 },
            { t0: s_(10) + 0.2, pt: [300, 380], text: "ulna", dx: -150, dy: 0 },
            { t0: wf(10, "interosseous"), pt: [465, 375], text: "interosseous membrane", dx: 0, dy: -80, hot: true },
            { t0: wf(10, "two"), pt: [450, 140], text: "FRONT", dx: 0, dy: -30, col: C.banana },
            { t0: wf(10, "two"), pt: [450, 600], text: "BACK", dx: 0, dy: 30, col: C.banana },
          ]}>
          <XSec t={t} mem={wf(10, "interosseous")} front={wf(10, "compartments")} back={wf(10, "compartments") + 0.3} />
        </ZoomBox>
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <ZoomBox x={0} y={0} w={860} h={740} cw={900} ch={700} t={t} t0={m1} keys={[[m1, 1, 0.5, 0.5], [s_(11) + 0.3, 1.25, 0.5, 0.33], [s_(13), 1.25, 0.5, 0.67]]} tag="CROSS-SECTION · MID-FOREARM"
          pins={[
            { t0: s_(11) + 0.3, t1: s_(13), pt: [450, 230], text: "anterior = FRONT", dx: 0, dy: -110, col: C.banana },
            { t0: s_(13) + 0.3, pt: [450, 480], text: "posterior = BACK", dx: 0, dy: 110, col: C.banana },
          ]}>
          <XSec t={t} mem={1} front={s_(11)} back={s_(13)} />
        </ZoomBox>
        <DCard t={t} t0={s_(11)} x={900} y={0} w={900} bg={C.red} size={46}>
          FRONT · anterior compartment
          <div style={{ fontSize: 36, color: C.paper, opacity: 0.92, marginTop: 6 }}>flexors + pronators</div>
        </DCard>
        <Col x={930} y={190} gap={10}>
          <Chip t={t} t0={wf(12, "bend")} bg={C.card} color={C.forest} size={36}>bend the wrist + fingers</Chip>
          <Chip t={t} t0={wf(12, "palm")} bg={C.card} color={C.forest} size={36}>turn the palm DOWN</Chip>
        </Col>
        <DCard t={t} t0={s_(13)} x={900} y={370} w={900} bg={NC.rad} size={46} color={C.forest}>
          BACK · posterior compartment
          <div style={{ fontSize: 36, opacity: 0.85, marginTop: 6 }}>extensors + the supinator</div>
        </DCard>
        <Col x={930} y={560} gap={10}>
          <Chip t={t} t0={wf(14, "straighten")} bg={C.card} color={C.forest} size={36}>straighten the wrist + fingers</Chip>
          <Chip t={t} t0={wf(14, "palm")} bg={C.card} color={C.forest} size={36}>turn the palm UP</Chip>
        </Col>
      </Seg>
      <Seg t={t} a={m2} b={m3}>
        <TallPlate {...BDEEP} x={0} y={0} w={860} h={740} t={t} t0={m2} keys={[[m2, 0.9, 0.55, 0.12], [s_(16), 1.35, 0.78, 0.13], [s_(17), 1.35, 0.32, 0.13], [s_(18), 0.95, 0.55, 0.15]]} tag="GRAY'S 1918 · BACK OF ELBOW"
          pins={[
            { t0: wf(16, "medial"), x: 0.84, y: 0.10, text: "medial epicondyle", dx: -170, dy: 120, col: FC.fcu },
            { t0: wf(17, "lateral"), x: 0.36, y: 0.115, text: "lateral epicondyle", dx: 170, dy: 130, col: FC.ecrb },
          ]} />
        <div style={abs(900, 0, { ...pop(t, s_(15)), transformOrigin: "0% 50%" })}><Big size={56}>Feel the 2 bumps at your elbow</Big></div>
        <MCard t={t} t0={s_(16)} x={900} y={110} w={900} col={FC.fcu} tagTxt="INNER BUMP" name="Medial epicondyle" lines={[["most FLEXORS start here", wf(16, "flexors")], ["common flexor origin", wf(16, "common")]]} />
        <MCard t={t} t0={s_(17)} x={900} y={390} w={900} col={FC.ecrb} tagTxt="OUTER BUMP" name="Lateral epicondyle" lines={[["most EXTENSORS start here", wf(17, "extensors")], ["common extensor origin", wf(17, "common")]]} />
        <div style={abs(900, 670, { ...pop(t, s_(18)), background: C.banana, borderRadius: 20, padding: "8px 22px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.forest, whiteSpace: "nowrap", transformOrigin: "0% 50%" })}>flexors INSIDE · extensors OUTSIDE</div>
      </Seg>
      <Seg t={t} a={m3} b={BE(1) + 0.1}>
        <ZoomBox x={0} y={0} w={420} h={740} t={t} t0={m3} keys={[[m3, 1.55, 0.48, 0.45]]} tag="FRONT">{FA(t, { layer: "both", peel: 0 })}</ZoomBox>
        <ZoomBox x={440} y={0} w={420} h={740} t={t} t0={m3 + 0.3} keys={[[m3, 1.55, 0.52, 0.45]]} tag="BACK"><Forearm t={t} view="back" layer="both" /></ZoomBox>
        <div style={abs(900, 20, { display: "flex", gap: 24 })}>
          <div style={{ ...pop(t, wf(19, "eight")), width: 420, height: 300, borderRadius: 36, background: C.red, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, color: C.paper }}>
            <div style={{ fontSize: 170, lineHeight: 1 }}>8</div><div style={{ fontSize: 40 }}>in the FRONT</div>
          </div>
          <div style={{ ...pop(t, wf(19, "twelve")), width: 420, height: 300, borderRadius: 36, background: NC.rad, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, color: C.forest }}>
            <div style={{ fontSize: 170, lineHeight: 1 }}>12</div><div style={{ fontSize: 40 }}>in the BACK</div>
          </div>
        </div>
        <DCard t={t} t0={s_(20)} x={900} y={360} w={864} size={64}>= 20 forearm muscles</DCard>
        <div style={abs(900, 520, { width: 864, opacity: ramp(t, wf(20, "anconeus"), wf(20, "anconeus") + 0.4), fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.matcha, lineHeight: 1.25 })}>some books count the anconeus with the arm → you may also see 19</div>
      </Seg>
    </Stage>
  );
};

/* ================= 2. SUPERFICIAL FLEXORS ================= */
const HT = ["pt", "fcr", "pl", "fds", "fcu"];
export const SSupFlex: React.FC = () => {
  const t = useT();
  const a = ST(2), m1 = s_(25) - 0.2, m2 = s_(33) - 0.2;
  const fT = [s_(25), s_(27), s_(29), s_(33), s_(31)]; // thumb, index, middle, ring, little
  const cur = t < s_(27) ? 0 : t < s_(29) ? 1 : t < s_(31) ? 2 : 4;
  const PL = { pt: [0.52, 0.36], fcr: [0.38, 0.38], pl: [0.25, 0.47], fcu: [0.15, 0.55], fds: [0.42, 0.62] } as Record<string, [number, number]>;
  const plateKeys: CK[] = [[m1, 0.95, 0.5, 0.3], [s_(25), 1.5, 0.5, 0.36], [s_(27), 1.5, 0.38, 0.4], [s_(29), 1.5, 0.27, 0.48], [s_(31), 1.5, 0.2, 0.55]];
  const cards: [string, string, string[], number[]][] = [
    ["THUMB", "Pronator teres", ["runs across to the middle of the radius", "turns the palm DOWN"], [wf(26, "across"), wf(26, "palm")]],
    ["INDEX", "Flexor carpi radialis", ["carpi = of the wrist", "bends the wrist + tilts it to the THUMB side"], [wf(28, "carpi"), wf(28, "bends")]],
    ["MIDDLE", "Palmaris longus", ["thin muscle, long tendon into the palm", "missing in some people: check yours!"], [wf(30, "thin"), wf(30, "missing")]],
    ["", "", [], []],
    ["LITTLE", "Flexor carpi ulnaris", ["bends the wrist + tilts it to the LITTLE-finger side", "ends on the pisiform bone"], [wf(32, "bends"), wf(32, "pisiform")]],
  ];
  return (
    <Stage a={a} b={BE(2)}>
      <Seg t={t} a={a - 0.1} b={m1}>
        <ZoomBox x={0} y={0} w={700} h={740} t={t} t0={a} tag={FRONT_TAG} keys={[[a, 1, 0.5, 0.5], [wf(23, "heel"), 1.6, 0.3, 0.3], [s_(24), 1.05, 0.48, 0.45]]}
          pins={[
            { t0: wf(23, "inner"), pt: [228, 182], text: "medial epicondyle", dx: 150, dy: -110, hot: true },
          ]}>
          {FA(t, { handTrick: { a: wf(23, "heel"), fingers: [] }, dim: 0.0 })}
        </ZoomBox>
        <div style={abs(760, 0, { ...pop(t, s_(22)), transformOrigin: "0% 50%" })}><Big size={64}>A trick you can do <Mk p={ramp(t, wf(22, "right"), wf(22, "right") + 0.5)}>right now</Mk></Big></div>
        <Col x={760} y={130} gap={16}>
          <RowL t={t} t0={wf(23, "heel")} col={C.banana} n="1" title="heel of your RIGHT hand" sub="on the inner bump of your LEFT elbow" w={1020} size={42} />
          <RowL t={t} t0={wf(23, "lay")} col={C.banana} n="2" title="lay your fingers along the forearm" sub="pointing toward the wrist" w={1020} size={42} />
        </Col>
        <DCard t={t} t0={s_(24)} x={760} y={430} w={1020} size={50}>your 5 fingers = the 4 superficial flexors <span style={{ color: C.banana }}>+ 1</span></DCard>
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <TallPlate {...FSUP} x={0} y={0} w={520} h={740} t={t} t0={m1} keys={plateKeys} tag="GRAY'S 1918 · FIG. 414"
          pins={([["pt", "pronator teres", s_(25)], ["fcr", "flexor carpi radialis", s_(27)], ["pl", "palmaris longus", s_(29)], ["fcu", "flexor carpi ulnaris", s_(31)]] as [string, string, number][]).map(([id, txt, t0], i) => ({ t0, t1: i < 3 ? [s_(27), s_(29), s_(31)][i] : undefined, x: PL[id][0], y: PL[id][1], text: txt, dx: id === "fcu" ? 150 : 110, dy: 120, col: FC[id] }))} />
        <ZoomBox x={540} y={0} w={460} h={740} t={t} t0={m1 + 0.2} keys={[[m1, 1.55, 0.42, 0.42]]} tag="YOUR HAND = MAP">
          {FA(t, { handTrick: { a: m1 - 1, fingers: fT }, lit: { pt: s_(25), fcr: s_(27), pl: s_(29), fcu: s_(31) }, dim: 0.75, only: ["pt", "fcr", "pl", "fcu", "fds", "br"] })}
        </ZoomBox>
        {cards.map(([tg, nm, ls, ts], i) => (i === 3 ? null : (
          <Seg key={i} t={t} a={fT[i] - 0.2} b={i === cur ? m2 + 0.2 : i === 4 ? m2 + 0.2 : [s_(27), s_(29), s_(31), 0, 0][i] - 0.2}>
            <MCard t={t} t0={fT[i]} x={1030} y={0} w={770} col={FC[HT[i]]} tagTxt={tg + " →"} name={nm} lines={ls.map((l, j) => [l, ts[j]] as [string, number])} />
          </Seg>
        )))}
        <div style={abs(1030, 420, { display: "flex", flexDirection: "column", gap: 10 })}>
          {[0, 1, 2, 4].map((i) => (
            <div key={i} style={{ ...pop(t, fT[i] + 0.3), display: "flex", alignItems: "center", gap: 14, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.forest, transformOrigin: "0% 50%" }}>
              <div style={{ width: 130, background: FC[HT[i]], borderRadius: 12, padding: "4px 10px", textAlign: "center", border: `3px solid ${C.forest}` }}>{cards[i][0].toLowerCase()}</div>
              <div>{cards[i][1]}</div>
            </div>
          ))}
        </div>
      </Seg>
      <Seg t={t} a={m2} b={BE(2) + 0.1}>
        <TallPlate {...FSUP} x={0} y={0} w={560} h={740} t={t} t0={m2} keys={[[m2, 1.3, 0.42, 0.6], [s_(36), 1.9, 0.42, 0.64]]} tag="GRAY'S 1918 · FIG. 414"
          pins={[{ t0: s_(34), x: 0.42, y: 0.62, text: "flexor digitorum superficialis", dx: 40, dy: 150, col: FC.fds }]} />
        <Note t={t} t0={wf(36, "old")} old="flexor digitorum sublimis" modern="superficialis" x={20} y={660} />
        <ZoomBox x={580} y={0} w={420} h={740} t={t} t0={m2 + 0.2} keys={[[m2, 1.55, 0.45, 0.5]]} tag="MIDDLE LAYER">
          {FA(t, { handTrick: { a: m2 - 2, fingers: [0, 0, 0, s_(33), 0] }, lit: { fds: s_(34) }, dim: 0.85, only: ["fds", "pt", "fcr", "pl", "fcu"] })}
        </ZoomBox>
        <div style={abs(1030, 0, { ...pop(t, s_(33)), transformOrigin: "0% 50%" })}><Big size={60}>…and your <Mk p={ramp(t, wf(33, "ring"), wf(33, "ring") + 0.4)}>ring finger?</Mk></Big></div>
        <MCard t={t} t0={s_(34)} x={1030} y={110} w={770} col={FC.fds} tagTxt="RING → MIDDLE LAYER" name="Flexor digitorum superficialis" lines={[["the only muscle of the middle layer", wf(34, "middle")], ["4 tendons → the 4 fingers", wf(35, "tendons")], ["bends them at the MIDDLE knuckles", wf(35, "middle")]]} />
      </Seg>
    </Stage>
  );
};

/* ================= 3. DEEP FLEXORS ================= */
export const SDeepFlex: React.FC = () => {
  const t = useT();
  const a = ST(3), m1 = s_(43) - 0.2, m2 = s_(46) - 0.2, m3 = s_(51) - 0.2;
  return (
    <Stage a={a} b={BE(3)}>
      <Seg t={t} a={a - 0.1} b={m1}>
        <TallPlate {...FDEEP} x={0} y={0} w={620} h={740} t={t} t0={a} keys={[[a, 0.62, 0.5, 0.5], [s_(39), 1.25, 0.32, 0.4], [wf(40, "tips"), 1.25, 0.3, 0.88], [s_(41), 1.9, 0.27, 0.93]]} tag="GRAY'S 1918 · FIG. 415 · DEEP"
          ring={{ x: 0.265, y: 0.965, t0: s_(41), t1: s_(43) }}
          pins={[
            { t0: s_(39), t1: wf(40, "tips"), x: 0.30, y: 0.38, text: "flexor digitorum profundus", dx: 80, dy: -140, col: FC.fdpM },
            { t0: wf(40, "tips"), x: 0.27, y: 0.955, text: "→ fingertip", dx: 200, dy: -120, hot: true },
          ]} />
        <div style={abs(660, 0, { ...pop(t, s_(38)), transformOrigin: "0% 50%" })}><Big size={56}>Deep layer of the front: <Mk p={ramp(t, wf(38, "three"), wf(38, "three") + 0.4)}>3 muscles</Mk></Big></div>
        <MCard t={t} t0={s_(39)} x={660} y={100} w={1140} col={FC.fdpM} tagTxt="DEEP · 1 of 3" name="Flexor digitorum profundus" lines={[["profundus = deep", wf(39, "profundus", 1)], ["from the ulna + interosseous membrane", wf(40, "ulna")], ["4 tendons → the TIPS of the fingers", wf(40, "tips")]]} />
        <DCard t={t} t0={s_(41)} x={660} y={470} w={1140} bg={C.red} size={46}>the ONLY muscle that bends your fingertip joint (DIP)</DCard>
        <div style={abs(660, 640)}><Chip t={t} t0={s_(42)} bg={C.banana} color={C.forest} size={42}>✓ answer to the opening question</Chip></div>
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <ZoomBox x={0} y={0} w={620} h={740} cw={900} ch={1000} t={t} t0={m1} keys={[[m1, 1, 0.5, 0.5], [wf(44, "splits"), 1.35, 0.5, 0.45], [s_(45), 1.05, 0.5, 0.55]]} tag="ONE FINGER · PALM VIEW"
          pins={[
            { t0: s_(43) + 0.3, pt: [450, 200], text: "FDS", dx: 120, dy: -60, col: FC.fds },
            { t0: wf(44, "profundus"), pt: [450, 520], text: "profundus (FDP)", dx: 230, dy: 0, col: FC.fdpU },
            { t0: wf(45, "middle"), pt: [370, 600], text: "→ middle bone", dx: -170, dy: 60, hot: true },
            { t0: wf(45, "tip"), pt: [450, 780], text: "→ tip", dx: 170, dy: 60, hot: true },
          ]}>
          <FingerSplit t={t} fds={m1} fdp={wf(44, "profundus") - 0.3} split={wf(44, "splits")} ins={s_(45)} />
        </ZoomBox>
        <div style={abs(660, 0, { width: 1140, ...pop(t, s_(43)), transformOrigin: "0% 50%" })}><Big size={64}>How does a DEEP tendon reach further than a superficial one?</Big></div>
        <Col x={660} y={300} gap={18}>
          <RowL t={t} t0={wf(44, "splits")} col={FC.fds} n="1" title="superficialis splits in 2" sub="at each finger" w={1140} size={44} />
          <RowL t={t} t0={wf(44, "passes")} col={FC.fdpU} n="2" title="profundus passes through the gap" w={1140} size={44} />
          <RowL t={t} t0={s_(45)} col={C.banana} n="3" title="FDS → middle bone · FDP → the tip" w={1140} size={44} on={t > wf(45, "tip")} />
        </Col>
      </Seg>
      <Seg t={t} a={m2} b={m3}>
        <TallPlate {...FDEEP} x={0} y={0} w={620} h={740} t={t} t0={m2} keys={[[m2, 1.2, 0.52, 0.42], [s_(48), 1.6, 0.55, 0.62]]} tag="GRAY'S 1918 · FIG. 415 · DEEP"
          pins={[
            { t0: s_(46), x: 0.52, y: 0.42, text: "flexor pollicis longus", dx: 30, dy: -150, col: FC.fpl },
            { t0: s_(48), x: 0.55, y: 0.62, text: "pronator quadratus", dx: -60, dy: 130, col: FC.pq },
          ]} />
        <MCard t={t} t0={s_(46)} x={660} y={0} w={1140} col={FC.fpl} tagTxt="DEEP · 2 of 3" name="Flexor pollicis longus" lines={[["pollicis = of the thumb", wf(46, "pollicis", 1)], ["from the radius → bends the thumb to its tip", wf(47, "radius")]]} />
        <MCard t={t} t0={s_(48)} x={660} y={330} w={1140} col={FC.pq} tagTxt="DEEP · 3 of 3" name="Pronator quadratus" lines={[["small + square, low near the wrist", wf(49, "square")], ["joins the ulna to the radius", wf(49, "ulna")], ["the MAIN muscle that turns the palm down", s_(50)]]} />
      </Seg>
      <Seg t={t} a={m3} b={BE(3) + 0.1}>
        <ZoomBox x={0} y={0} w={560} h={740} t={t} t0={m3} keys={[[m3, 1.35, 0.5, 0.62]]} tag="TENDONS → CARPAL TUNNEL">
          {FA(t, { layer: "both", peel: 0.75, lit: { fds: wf(52, "superficialis"), fdpU: wf(52, "profundus"), fdpM: wf(52, "profundus"), fpl: wf(52, "flexor") }, dim: 0.8 })}
        </ZoomBox>
        <div style={abs(600, 0, { ...pop(t, s_(51)), transformOrigin: "0% 50%" })}><Big size={56}>Bonus link: <Mk p={ramp(t, wf(51, "link"), wf(51, "link") + 0.4)}>the carpal tunnel</Mk></Big></div>
        <div style={abs(600, 110, { display: "flex", gap: 18 })}>
          {([["4", "FDS tendons", FC.fds, wf(52, "four")], ["4", "FDP tendons", FC.fdpU, wf(52, "four", 1)], ["1", "flexor pollicis longus", FC.fpl, wf(52, "one")], ["1", "median nerve", NC.med, wf(52, "median")]] as [string, string, string, number][]).map(([n, l, c, tt]) => (
            <div key={l} style={{ ...pop(t, tt), width: 282, height: 330, borderRadius: 32, background: c, border: `4px solid ${C.forest}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, color: C.forest, textAlign: "center" }}>
              <div style={{ fontSize: 170, lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 32, lineHeight: 1.1, padding: "0 14px" }}>{l}</div>
            </div>
          ))}
        </div>
        <DCard t={t} t0={s_(53)} x={600} y={480} w={1182} size={64} bg={C.forest}>4 · 4 · 1 · 1 <span style={{ color: C.banana, fontSize: 40 }}>= what passes through the carpal tunnel</span></DCard>
      </Seg>
    </Stage>
  );
};

/* ================= 4. SUPERFICIAL EXTENSORS ================= */
const BS = { br: [0.37, 0.24], ecrl: [0.47, 0.22], ecrb: [0.40, 0.45], ed: [0.56, 0.40], edm: [0.62, 0.55], ecu: [0.72, 0.38], an: [0.80, 0.22], le: [0.62, 0.16] } as Record<string, [number, number]>;
export const SSupExt: React.FC = () => {
  const t = useT();
  const a = ST(4), m1 = s_(56) - 0.2, m2 = s_(63) - 0.2;
  const groups: [string, string, string[], string][] = [["1", "brachioradialis", ["br"], FC.br], ["2", "radial wrist extensors", ["ecrl", "ecrb"], FC.ecrl], ["2", "finger extensors", ["ed", "edm"], FC.ed], ["1", "ulnar wrist extensor", ["ecu"], FC.ecu]];
  const gT = [wf(55, "one"), wf(55, "two"), wf(55, "two", 1), wf(55, "one", 1)];
  const sT = [s_(56), s_(59), s_(61), s_(62)];
  const lit = { br: s_(56), ecrl: wf(59, "longus"), ecrb: wf(59, "brevis"), ed: wf(61, "digitorum"), edm: wf(61, "minimi"), ecu: s_(62), an: s_(66) };
  const plateKeys: CK[] = [[m1, 1.0, 0.45, 0.3], [s_(56), 1.5, 0.37, 0.3], [s_(59), 1.5, 0.44, 0.33], [s_(61), 1.4, 0.58, 0.45], [s_(62), 1.5, 0.7, 0.38], [s_(63) - 0.5, 0.9, 0.55, 0.35]];
  return (
    <Stage a={a} b={BE(4)}>
      <Seg t={t} a={a - 0.1} b={m1}>
        <TallPlate {...BSUP} x={0} y={0} w={560} h={740} t={t} t0={a} keys={[[a, 0.62, 0.5, 0.5], [s_(55), 0.95, 0.5, 0.33]]} tag="GRAY'S 1918 · FIG. 418 · BACK" />
        <div style={abs(600, 0, { ...pop(t, s_(54)), transformOrigin: "0% 50%" })}><Big size={56}>Flip your arm over → the BACK</Big></div>
        <div style={abs(600, 90, { ...pop(t, wf(55, "thumb")), fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.matcha })}>superficial extensors, thumb side → little-finger side:</div>
        <div style={abs(600, 170, { display: "flex", gap: 18 })}>
          {groups.map(([n, l, , c], i) => (
            <div key={i} style={{ ...pop(t, gT[i]), width: 282, height: 420, borderRadius: 34, background: c, border: `4px solid ${C.forest}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, color: C.forest, textAlign: "center" }}>
              <div style={{ fontSize: 220, lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 30, lineHeight: 1.1, padding: "0 14px", opacity: ramp(t, s_(55) + 4, s_(55) + 5) }}>{l}</div>
            </div>
          ))}
        </div>
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <TallPlate {...BSUP} x={0} y={0} w={500} h={740} t={t} t0={m1} keys={plateKeys} tag="GRAY'S 1918 · FIG. 418"
          pins={([["br", "brachioradialis", s_(56), s_(59)], ["ecrl", "ext. carpi radialis longus", wf(59, "longus"), s_(61)], ["ecrb", "ext. carpi radialis brevis", wf(59, "brevis"), s_(61)], ["ed", "extensor digitorum", wf(61, "digitorum"), s_(62)], ["edm", "ext. digiti minimi", wf(61, "minimi"), s_(62)], ["ecu", "extensor carpi ulnaris", s_(62), undefined]] as [string, string, number, number | undefined][]).map(([id, txt, t0, t1]) => ({ t0, t1, x: BS[id][0], y: BS[id][1], text: txt, dx: id === "ecu" ? -40 : 60, dy: id === "ecrl" ? -120 : 120, col: FC[id] }))} />
        <Note t={t} t0={wf(61, "digitorum") + 0.6} old="extensor digitorum communis" x={10} y={600} />
        <ZoomBox x={520} y={0} w={420} h={740} t={t} t0={m1 + 0.2} keys={[[m1, 1.55, 0.52, 0.45]]} tag="BACK · SCHEMATIC">
          <Forearm t={t} view="back" lit={lit} dim={0.8} only={["br", "ecrl", "ecrb", "ed", "edm", "ecu", "an"]} />
        </ZoomBox>
        <div style={abs(970, 0, { display: "flex", gap: 10 })}>
          {groups.map(([n, , , c], i) => (
            <div key={i} style={{ width: 196, height: 96, borderRadius: 22, background: t >= sT[i] ? c : C.card, border: `4px solid ${t >= sT[i] ? C.forest : C.line}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 64, color: C.forest, transform: `scale(${1 + 0.08 * (ramp(t, sT[i], sT[i] + 0.2) - ramp(t, sT[i] + 0.2, sT[i] + 0.5))})` }}>{n}</div>
          ))}
        </div>
        <Seg t={t} a={s_(56) - 0.2} b={s_(59) - 0.2}>
          <MCard t={t} t0={s_(56)} x={970} y={130} w={830} col={FC.br} tagTxt="1 · THUMB SIDE" name="Brachioradialis" lines={[["the big muscle on the thumb side", wf(57, "big")], ["the twist: back group, yet it bends the ELBOW", wf(57, "twist")], ["best with the thumb up, like holding a hammer", s_(58)]]} />
        </Seg>
        <Seg t={t} a={s_(59) - 0.2} b={s_(61) - 0.2}>
          <MCard t={t} t0={s_(59)} x={970} y={130} w={830} col={FC.ecrl} tagTxt="2 · RADIAL WRIST EXTENSORS" name="Ext. carpi radialis longus + brevis" lines={[["longus = long · brevis = short", s_(60)], ["extend the wrist", wf(60, "extend")], ["+ tilt it to the THUMB side", wf(60, "thumb")]]} />
        </Seg>
        <Seg t={t} a={s_(61) - 0.2} b={s_(62) - 0.2}>
          <MCard t={t} t0={s_(61)} x={970} y={130} w={830} col={FC.ed} tagTxt="2 · FINGER EXTENSORS" name="Extensor digitorum + digiti minimi" lines={[["digitorum: 4 tendons → 4 fingers", wf(61, "tendons")], ["digiti minimi: just the little finger", wf(61, "minimi")]]} />
        </Seg>
        <Seg t={t} a={s_(62) - 0.2} b={m2 + 0.2}>
          <MCard t={t} t0={s_(62)} x={970} y={130} w={830} col={FC.ecu} tagTxt="1 · LITTLE-FINGER SIDE" name="Extensor carpi ulnaris" lines={[["extends the wrist", wf(62, "extends")], ["+ tilts it to the LITTLE-finger side", wf(62, "little")]]} />
        </Seg>
      </Seg>
      <Seg t={t} a={m2} b={BE(4) + 0.1}>
        <ZoomBox x={0} y={0} w={560} h={740} t={t} t0={m2} keys={[[m2, 1.3, 0.5, 0.45], [s_(64), 1.9, 0.3, 0.15], [s_(66), 2.0, 0.45, 0.2]]} tag={BACK_TAG}
          pins={[
            { t0: wf(64, "brachioradialis"), t1: s_(66), pt: at("br", "back", 0.05), text: "BR", dx: -60, dy: 70, col: FC.br },
            { t0: wf(64, "longus"), t1: s_(66), pt: at("ecrl", "back", 0.05), text: "ECRL", dx: 90, dy: 80, col: FC.ecrl },
            { t0: wf(64, "ridge"), t1: s_(66), pt: [200, 110], text: "ridge above", dx: 30, dy: -60, hot: true },
            { t0: s_(65), t1: s_(66), pt: [228, 150], text: "lateral epicondyle", dx: 160, dy: 120, hot: true },
            { t0: wf(66, "anconeus"), pt: at("an", "back", 0.5), text: "anconeus", dx: 120, dy: 100, col: FC.an },
          ]}>
          <Forearm t={t} view="back" lit={{ br: m2, ecrl: m2, ecrb: m2, ed: m2, edm: m2, ecu: m2, an: wf(66, "anconeus") }} dim={0.8} pulse={t > wf(66, "anconeus") ? ["an"] : []} />
        </ZoomBox>
        <div style={abs(600, 0, { display: "flex", gap: 14 })}>
          {groups.map(([n, l, , c], i) => (
            <div key={i} style={{ ...pop(t, m2 + 0.2 + i * 0.25), width: 290, height: 250, borderRadius: 30, background: c, border: `4px solid ${C.forest}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, color: C.forest, textAlign: "center" }}>
              <div style={{ fontSize: 130, lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 26, lineHeight: 1.1, padding: "0 10px" }}>{l}</div>
            </div>
          ))}
        </div>
        <DCard t={t} t0={s_(64)} x={600} y={290} w={1200} size={38}>BR + ECRL start higher: <span style={{ color: C.banana }}>the ridge above the lateral epicondyle</span></DCard>
        <DCard t={t} t0={s_(65)} x={600} y={420} w={1200} size={38} bg={C.card} color={C.forest}>the rest: the common extensor origin</DCard>
        <MCard t={t} t0={s_(66)} x={600} y={520} w={1200} col={FC.an} tagTxt="+ 1 SMALL EXTRA" name="Anconeus" lines={[["a triangle behind the elbow · helps the triceps straighten it", wf(66, "triangle")]]} />
      </Seg>
    </Stage>
  );
};

/* ================= 5. DEEP EXTENSORS ================= */
const BD = { le: [0.38, 0.11], sup: [0.48, 0.23], apl: [0.42, 0.48], epb: [0.32, 0.60], epl: [0.48, 0.58], ei: [0.55, 0.64] } as Record<string, [number, number]>;
export const SDeepExt: React.FC = () => {
  const t = useT();
  const a = ST(5), m1 = s_(71) - 0.2, m2 = s_(77) - 0.2;
  const prone = kv(t, [[a, 1], [wf(69, "palm"), 1], [wf(69, "palm") + 1.2, 0], [s_(70), 0], [s_(70) + 1.4, 1], [s_(70) + 2.8, 0]]);
  const thumbs: [string, string, string, number][] = [["apl", "Abductor pollicis longus", "moves the thumb away from the palm", s_(72)], ["epb", "Extensor pollicis brevis", "straightens the thumb at its base", s_(73)], ["epl", "Extensor pollicis longus", "straightens the whole thumb, to the tip", s_(74)], ["ei", "Extensor indicis", "extra extensor for the index finger", s_(75)]];
  return (
    <Stage a={a} b={BE(5)}>
      <Seg t={t} a={a - 0.1} b={m1}>
        <TallPlate {...BDEEP} x={0} y={0} w={560} h={740} t={t} t0={a} keys={[[a, 0.62, 0.5, 0.5], [s_(68), 1.5, 0.45, 0.2]]} tag="GRAY'S 1918 · FIG. 419 · DEEP"
          ring={{ x: 0.47, y: 0.22, t0: s_(70) }}
          pins={[{ t0: s_(68), x: 0.48, y: 0.23, text: "supinator", dx: 150, dy: 120, col: FC.sup }]} />
        <ZoomBox x={580} y={0} w={420} h={740} cw={900} ch={1000} t={t} t0={s_(68)} keys={[[s_(68), 1.45, 0.5, 0.52]]} tag="PALM UP · PALM DOWN">
          <Rotate t={t} prone={prone} litSup={s_(68)} />
        </ZoomBox>
        <div style={abs(1030, 0, { ...pop(t, s_(67)), transformOrigin: "0% 50%", width: 770 })}><Big size={50}>Deep layer of the back: <Mk p={ramp(t, wf(67, "five"), wf(67, "five") + 0.4)}>5 muscles</Mk></Big></div>
        <MCard t={t} t0={s_(68)} x={1030} y={150} w={770} col={FC.sup} tagTxt="DEEP · 1 of 5" name="Supinator" lines={[["wraps around the top of the radius", wf(69, "wraps")], ["turns the palm UP: a key, a screwdriver", wf(69, "palm")]]} />
        <DCard t={t} t0={s_(70)} x={1030} y={500} w={770} bg={C.red} size={40}>a branch of the radial nerve passes right THROUGH it</DCard>
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <TallPlate {...BDEEP} x={0} y={0} w={500} h={740} t={t} t0={m1} keys={[[m1, 1.3, 0.42, 0.5], [s_(73), 1.6, 0.38, 0.58], [s_(75), 1.6, 0.5, 0.62]]} tag="GRAY'S 1918 · FIG. 419"
          pins={thumbs.map(([id, nm, , tt], i) => ({ t0: tt, x: BD[id][0], y: BD[id][1], text: ["APL", "EPB", "EPL", "EI"][i], dx: [-90, -80, 110, 120][i], dy: [-90, 80, -60, 80][i], col: FC[id] }))} />
        <Note t={t} t0={s_(75) + 0.4} old="ext. indicis proprius" x={10} y={600} />
        <ZoomBox x={520} y={0} w={420} h={740} t={t} t0={m1 + 0.2} keys={[[m1, 1.6, 0.52, 0.55]]} tag={BACK_TAG}>
          <Forearm t={t} view="back" layer="deep" lit={{ sup: m1 - 1, apl: s_(72), epb: s_(73), epl: s_(74), ei: s_(75) }} dim={0.8} />
        </ZoomBox>
        <div style={abs(970, 0, { ...pop(t, s_(71)), transformOrigin: "0% 50%" })}><Big size={44}>3 for the thumb · 1 for the index</Big></div>
        <Col x={970} y={90} gap={14}>
          {thumbs.map(([id, nm, sub, tt], i) => <RowL key={id} t={t} t0={tt} col={FC[id]} n={i < 3 ? String(i + 1) : "+"} title={nm} sub={sub} w={830} size={38} on={i === 3 && t > s_(76)} />)}
        </Col>
        <div style={abs(970, 620)}><Chip t={t} t0={s_(76)} bg={C.forest} size={36}>☝ that's how you point with 1 finger</Chip></div>
      </Seg>
      <Seg t={t} a={m2} b={BE(5) + 0.1}>
        <ZoomBox x={0} y={0} w={900} h={740} cw={900} ch={900} t={t} t0={m2} keys={[[m2, 1.0, 0.5, 0.5], [s_(78), 1.35, 0.62, 0.52]]} tag="LEFT WRIST · THUMB SIDE"
          pins={[
            { t0: wf(78, "snuffbox"), pt: SB_PT.hollow, text: "anatomical snuffbox", dx: -40, dy: -200, hot: true, size: 34 },
            { t0: s_(79), pt: SB_PT.lat, text: "APL + EPB", dx: -40, dy: 120, col: FC.apl },
            { t0: s_(80), pt: SB_PT.med, text: "EPL", dx: -60, dy: -100, col: FC.epl },
            { t0: wf(81, "scaphoid"), pt: SB_PT.scaph, text: "scaphoid", dx: 170, dy: 100, col: C.banana },
            { t0: wf(81, "radial"), pt: SB_PT.art, text: "radial artery", dx: 40, dy: 110, col: C.redLight },
          ]}>
          <Snuffbox t={t} ext={s_(77)} lat={s_(79)} med={s_(80)} floor={wf(81, "scaphoid")} art={wf(81, "radial")} />
        </ZoomBox>
        <div style={abs(940, 0, { ...pop(t, s_(77)), transformOrigin: "0% 50%", width: 860 })}><Big size={54}>Stretch your thumb back hard</Big></div>
        <DCard t={t} t0={s_(78)} x={940} y={90} w={860} bg={C.forest} size={44}>the hollow = the <span style={{ color: C.banana }}>anatomical snuffbox</span></DCard>
        <Col x={940} y={250} gap={14}>
          <RowL t={t} t0={s_(79)} col={FC.apl} n="1" title="thumb-side border" sub="abductor pollicis longus + extensor pollicis brevis" w={860} size={40} />
          <RowL t={t} t0={s_(80)} col={FC.epl} n="2" title="other border" sub="extensor pollicis longus" w={860} size={40} />
          <RowL t={t} t0={s_(81)} col={C.banana} n="3" title="in its floor" sub="the scaphoid bone + the radial artery" w={860} size={40} />
        </Col>
      </Seg>
    </Stage>
  );
};

/* ================= 6. NERVES + MOVEMENTS ================= */
const NV = { uln: [0.453, 0.589], med: [0.581, 0.602], medPT: [0.536, 0.544], rad: [0.594, 0.462], deep: [0.604, 0.482], sup: [0.626, 0.527], fcu: [0.504, 0.648], fdp: [0.569, 0.648] } as Record<string, [number, number]>;
export const SNerve: React.FC = () => {
  const t = useT();
  const a = ST(6), m1 = s_(85) - 0.2, m2 = s_(90) - 0.2, m3 = s_(93) - 0.2;
  const prone = kv(t, [[m2, 0], [s_(91), 0], [s_(91) + 1.4, 1], [s_(92), 1], [s_(92) + 1.4, 0]]);
  return (
    <Stage a={a} b={BE(6)}>
      <Seg t={t} a={a - 0.1} b={m1}>
        <TallPlate {...NERV} x={0} y={0} w={560} h={740} t={t} t0={a} keys={[[a, 0.7, 0.5, 0.5], [s_(83), 1.7, 0.6, 0.5]]} tag="GRAY'S 1918 · FIG. 816 · NERVES"
          pins={[
            { t0: wf(83, "radial"), x: NV.rad[0], y: NV.rad[1], text: "radial n.", dx: 130, dy: -90, col: NC.rad },
            { t0: wf(84, "deep"), x: NV.deep[0], y: NV.deep[1], text: "deep branch", dx: 140, dy: 20, col: NC.rad },
            { t0: wf(84, "posterior"), x: NV.sup[0], y: NV.sup[1] + 0.03, text: "→ posterior interosseous n.", dx: -40, dy: 140, hot: true, size: 26 },
          ]} />
        <ZoomBox x={580} y={0} w={420} h={740} t={t} t0={a + 0.3} keys={[[a, 1.55, 0.5, 0.45]]} tag={BACK_TAG}>
          <Forearm t={t} view="back" layer="both" peel={0} nerve={wf(83, "radial")} />
        </ZoomBox>
        <div style={abs(1030, 0, { ...pop(t, s_(82)), transformOrigin: "0% 50%", width: 770 })}><Big size={54}>Muscles → nerves</Big></div>
        <DCard t={t} t0={s_(83)} x={1030} y={100} w={770} bg={NC.rad} color={C.forest} size={52}>BACK = 100% RADIAL</DCard>
        <Col x={1030} y={260} gap={14}>
          <RowL t={t} t0={wf(84, "deep")} col={NC.rad} n="1" title="deep branch" sub="pierces the supinator" w={770} size={40} />
          <RowL t={t} t0={wf(84, "posterior")} col={NC.rad} n="2" title="→ posterior interosseous n." sub="to the deep extensors" w={770} size={40} />
        </Col>
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <TallPlate {...NERV} x={0} y={0} w={560} h={740} t={t} t0={m1} keys={[[m1, 1.6, 0.55, 0.58], [s_(86), 2.0, 0.55, 0.54], [s_(88), 1.6, 0.5, 0.6]]} tag="GRAY'S 1918 · FIG. 816 · FRONT"
          pins={[
            { t0: wf(85, "median"), x: NV.med[0], y: NV.med[1], text: "median n.", dx: 150, dy: 60, col: NC.med },
            { t0: wf(86, "pronator"), t1: s_(88), x: NV.medPT[0], y: NV.medPT[1], text: "between 2 heads of pronator teres", dx: 40, dy: -150, hot: true, size: 26 },
            { t0: s_(89), x: NV.uln[0], y: NV.uln[1], text: "ulnar n.", dx: -120, dy: -60, col: NC.uln },
            { t0: wf(88, "flexor"), x: NV.fcu[0], y: NV.fcu[1] + 0.05, text: "FCU", dx: -110, dy: 60, col: FC.fcu },
          ]} />
        <ZoomBox x={580} y={0} w={420} h={740} t={t} t0={m1 + 0.2} keys={[[m1, 1.55, 0.48, 0.45]]} tag={FRONT_TAG}>
          {FA(t, { layer: "both", peel: kv(t, [[s_(88), 0], [s_(88) + 1.5, 0.6]]), nerve: wf(85, "median"), pulse: t > s_(88) ? ["fcu", "fdpU"] : [] })}
        </ZoomBox>
        <DCard t={t} t0={s_(85)} x={1030} y={0} w={770} bg={NC.med} color={C.forest} size={50}>FRONT = mostly MEDIAN</DCard>
        <div style={abs(1030, 150, { ...pop(t, s_(87)), transformOrigin: "0% 50%", fontFamily: FONT, fontWeight: 800, fontSize: 48, color: C.forest })}>except <span style={{ background: NC.uln, color: C.paper, padding: "0 14px 4px", borderRadius: 14 }}>1½</span> muscles:</div>
        <Col x={1030} y={250} gap={14}>
          <RowL t={t} t0={wf(88, "flexor")} col={NC.uln} n="1" title="flexor carpi ulnaris" w={770} size={40} />
          <RowL t={t} t0={wf(88, "half")} col={NC.uln} n="½" title="½ of flexor digitorum profundus" sub="the half for the ring + little fingers" w={770} size={40} />
        </Col>
        <DCard t={t} t0={s_(89)} x={1030} y={560} w={770} bg={NC.uln} size={46}>→ supplied by the ULNAR nerve</DCard>
      </Seg>
      <Seg t={t} a={m2} b={m3}>
        <ZoomBox x={0} y={0} w={620} h={740} cw={900} ch={1000} t={t} t0={m2} keys={[[m2, 1, 0.5, 0.5]]} tag="LEFT FOREARM · BONES">
          <Rotate t={t} prone={prone} litPro={s_(91)} litSup={s_(92)} />
        </ZoomBox>
        <div style={abs(660, 0, { ...pop(t, s_(90)), transformOrigin: "0% 50%" })}><Big size={56}>Now the movements</Big></div>
        <MCard t={t} t0={s_(91)} x={660} y={100} w={1140} col={FC.pt} tagTxt="PALM DOWN = PRONATION" name="2 pronators: teres + quadratus" lines={[["both in the front · median nerve", wf(91, "quadratus") + 0.4]]} />
        <MCard t={t} t0={s_(92)} x={660} y={400} w={1140} col={FC.sup} tagTxt="PALM UP = SUPINATION" name="Supinator + biceps (in the arm)" lines={[["supinator: back · radial nerve", wf(92, "biceps") + 0.4]]} />
      </Seg>
      <Seg t={t} a={m3} b={BE(6) + 0.1}>
        <ZoomBox x={0} y={0} w={860} h={740} cw={900} ch={700} t={t} t0={m3} keys={[[m3, 1, 0.5, 0.5]]} tag="THE WRIST · 4 CORNERS">
          <WristBox t={t} rad={s_(94)} uln={s_(95)} />
        </ZoomBox>
        <div style={abs(900, 0, { ...pop(t, s_(93)), transformOrigin: "0% 50%", width: 900 })}><Big size={56}>The wrist = a box with 4 corners</Big></div>
        <MCard t={t} t0={s_(94)} x={900} y={170} w={900} col={FC.fcr} tagTxt="TILT → THUMB SIDE" name="flexor + extensor carpi RADIALIS" lines={[]} />
        <MCard t={t} t0={s_(95)} x={900} y={420} w={900} col={FC.fcu} tagTxt="TILT → LITTLE-FINGER SIDE" name="flexor + extensor carpi ULNARIS" lines={[]} />
      </Seg>
    </Stage>
  );
};

/* ================= 7. MEMORY TRICKS ================= */
export const STricks: React.FC = () => {
  const t = useT();
  const a = ST(7), m1 = s_(99) - 0.2, m2 = s_(102) - 0.2;
  const fing: [string, string, string, string][] = [["thumb", "THUMB", "pronator teres", "pt"], ["index", "INDEX", "flexor carpi radialis", "fcr"], ["middle", "MIDDLE", "palmaris longus", "pl"], ["ring", "RING", "flexor digitorum superficialis", "fds"], ["little", "LITTLE", "flexor carpi ulnaris", "fcu"]];
  const fT = fing.map(([w]) => wf(98, w));
  const tiles: [string, string, string, number][] = [["1", "brachio-\nradialis", FC.br, wf(100, "brachioradialis")], ["2", "radial wrist\nextensors", FC.ecrl, wf(100, "radial")], ["2", "finger\nextensors", FC.ed, wf(100, "finger")], ["1", "ulnar wrist\nextensor", FC.ecu, wf(100, "ulnar")]];
  const deep: [string, string, string, number][] = [["1", "supinator", FC.sup, wf(101, "supinator")], ["3", "for the thumb", FC.apl, wf(101, "thumb")], ["1", "for the index", FC.ei, wf(101, "index")]];
  return (
    <Stage a={a} b={BE(7)}>
      <Seg t={t} a={a - 0.1} b={m1}>
        <TrickCard t={t} t0={a} n={1} title="The hand on the elbow">
          <div style={abs(40, 140, { width: 520, height: 580, borderRadius: 30, background: C.card, overflow: "hidden" })}>
            <div style={abs(-60, -40, { width: 640, height: 700 })}>{FA(t, { handTrick: { a: s_(97), fingers: [fT[0], fT[1], fT[2], fT[3], fT[4]] }, lit: { pt: fT[0], fcr: fT[1], pl: fT[2], fds: fT[3], fcu: fT[4] }, dim: 0.75, only: ["pt", "fcr", "pl", "fds", "fcu"] })}</div>
          </div>
          <div style={abs(620, 150, { display: "flex", flexDirection: "column", gap: 16 })}>
            {fing.map(([w, F, nm, id], i) => (
              <div key={w} style={{ ...pop(t, fT[i]), display: "flex", alignItems: "center", gap: 24, fontFamily: FONT, fontWeight: 800, transformOrigin: "0% 50%" }}>
                <div style={{ width: 200, height: 90, borderRadius: 22, background: FC[id], color: C.forest, fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>{F}</div>
                <div style={{ fontSize: 50, color: C.paper }}>{nm}</div>
              </div>
            ))}
          </div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <TrickCard t={t} t0={m1} n={2} title="The back counts 1 · 2 · 2 · 1">
          <div style={abs(60, 170, { display: "flex", gap: 22 })}>
            {tiles.map(([n, l, c, tt], i) => (
              <div key={i} style={{ ...pop(t, i === 0 ? Math.min(tt, wf(99, "one")) : tt), width: 250, height: 330, borderRadius: 32, background: c, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, color: C.forest, textAlign: "center", whiteSpace: "pre-line" }}>
                <div style={{ fontSize: 190, lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: 30, lineHeight: 1.1 }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={abs(1200, 150, { fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.matchaLight, letterSpacing: 4, opacity: ramp(t, s_(101), s_(101) + 0.3) })}>DEEP LAYER</div>
          <div style={abs(1200, 200, { display: "flex", flexDirection: "column", gap: 16 })}>
            {deep.map(([n, l, c, tt]) => (
              <div key={l} style={{ ...pop(t, tt), display: "flex", alignItems: "center", gap: 20, fontFamily: FONT, fontWeight: 800, transformOrigin: "0% 50%" }}>
                <div style={{ width: 110, height: 110, borderRadius: 26, background: c, color: C.forest, fontSize: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</div>
                <div style={{ fontSize: 44, color: C.paper }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={abs(60, 560, { ...pop(t, wf(99, "one", 1) + 0.6), fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.banana })}>thumb side → little-finger side</div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={m2} b={BE(7) + 0.1}>
        <TrickCard t={t} t0={m2} n={3} title="The nerves">
          <div style={abs(40, 140, { width: 380, height: 580, borderRadius: 30, background: C.card, overflow: "hidden", ...pop(t, s_(103)) })}>
            <div style={abs(-90, -20, { width: 560, height: 620 })}><Forearm t={t} view="back" layer="both" nerve={s_(103)} /></div>
            <ViewTag t={t} t0={s_(103)} x={14} y={12} text="BACK" />
          </div>
          <div style={abs(440, 140, { width: 380, height: 580, borderRadius: 30, background: C.card, overflow: "hidden", ...pop(t, s_(104)) })}>
            <div style={abs(-90, -20, { width: 560, height: 620 })}>{FA(t, { layer: "both", peel: 0.55, nerve: s_(104) })}</div>
            <ViewTag t={t} t0={s_(104)} x={14} y={12} text="FRONT" />
          </div>
          <div style={abs(880, 170, { ...pop(t, s_(103)), background: NC.rad, borderRadius: 28, padding: "18px 32px 22px", fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.forest, width: 860, boxSizing: "border-box" })}>BACK → all RADIAL</div>
          <div style={abs(880, 340, { ...pop(t, s_(104)), background: NC.med, borderRadius: 28, padding: "18px 32px 22px", fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.forest, width: 860, boxSizing: "border-box" })}>FRONT → all MEDIAN</div>
          <div style={abs(880, 510, { ...pop(t, wf(104, "except")), background: NC.uln, borderRadius: 28, padding: "18px 32px 22px", fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper, width: 860, boxSizing: "border-box" })}>except 1½ → ULNAR <span style={{ fontSize: 30, opacity: 0.85 }}>(FCU + ½ FDP)</span></div>
        </TrickCard>
      </Seg>
    </Stage>
  );
};

/* ================= 8. QUIZ ================= */
type Q = { n: number; si: number; q: string; a: string; visual: (t: number, r: number, ans: number) => React.ReactNode };
const QS: Q[] = [
  { n: 1, si: 106, q: "Which nerve supplies flexor carpi ulnaris?", a: "the ulnar nerve", visual: (t, r, ans) => <TallPlate {...FSUP} x={0} y={0} w={1000} h={740} t={t} t0={s_(106) - 0.2} keys={[[s_(106), 1.15, 0.2, 0.5]]} tag="GRAY'S 1918 · FIG. 414" pins={[{ t0: s_(106) + 0.3, x: 0.15, y: 0.55, text: r ? "ulnar n. ✓" : "FCU · which nerve?", dx: 260, dy: -80, hot: !r, col: r ? NC.uln : undefined, size: 40 }]} /> },
  { n: 2, si: 108, q: "Which is the ONLY muscle that bends the tip of your finger?", a: "flexor digitorum profundus", visual: (t, r, ans) => <ZoomBox x={0} y={0} w={1000} h={740} cw={900} ch={1000} t={t} t0={s_(108) - 0.2} keys={[[s_(108), 1, 0.5, 0.5]]} pins={r ? [{ t0: ans, pt: [450, 700], text: "FDP → the tip", dx: 230, dy: 0, col: FC.fdpU, size: 40 }] : [{ t0: s_(108) + 0.3, pt: [450, 860], text: "?", dx: 160, dy: 0, hot: true, size: 50 }]}><FingerSplit t={t} fds={s_(108) - 2} fdp={r ? ans : 99999} split={s_(108) - 2} ins={r ? ans : 0} /></ZoomBox> },
  { n: 3, si: 110, q: "Which muscle does the deep branch of the radial nerve pass through?", a: "the supinator", visual: (t, r, ans) => <TallPlate {...BDEEP} x={0} y={0} w={1000} h={740} t={t} t0={s_(110) - 0.2} keys={[[s_(110), 1.2, 0.45, 0.2]]} tag="GRAY'S 1918 · FIG. 419" ring={r ? { x: 0.47, y: 0.22, t0: ans } : undefined} pins={[{ t0: s_(110) + 0.3, x: 0.48, y: 0.23, text: r ? "supinator ✓" : "?", dx: 230, dy: 120, hot: !r, col: r ? FC.sup : undefined, size: 44 }]} /> },
  { n: 4, si: 112, q: "Which tendon forms the little-finger-side border of the snuffbox?", a: "extensor pollicis longus", visual: (t, r, ans) => <ZoomBox x={0} y={0} w={1000} h={740} cw={900} ch={900} t={t} t0={s_(112) - 0.2} keys={[[s_(112), 1.2, 0.6, 0.5]]} pins={[{ t0: s_(112) + 0.3, pt: SB_PT.hollow, text: "snuffbox", dx: 40, dy: 200, hot: true }, ...(r ? [{ t0: ans, pt: SB_PT.med, text: "EPL ✓", dx: -60, dy: -110, col: FC.epl, size: 40 }] : [{ t0: s_(112) + 0.6, pt: SB_PT.med, text: "?", dx: -60, dy: -110, hot: true, size: 50 }])]}><Snuffbox t={t} ext={s_(112) - 2} lat={s_(112) - 2} med={r ? ans : 0} floor={0} art={0} /></ZoomBox> },
  { n: 5, si: 114, q: "Brachioradialis bends the elbow. So which nerve supplies it?", a: "the radial nerve (back group)", visual: (t, r, ans) => <TallPlate {...BSUP} x={0} y={0} w={1000} h={740} t={t} t0={s_(114) - 0.2} keys={[[s_(114), 1.1, 0.4, 0.25]]} tag="GRAY'S 1918 · FIG. 418" pins={[{ t0: s_(114) + 0.3, x: 0.37, y: 0.24, text: r ? "radial n. ✓" : "brachioradialis · nerve?", dx: 260, dy: 80, hot: !r, col: r ? NC.rad : undefined, size: 40 }]} /> },
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
    ["2 compartments", "front: flexors + pronators · back: extensors + supinator", Math.max(a, s_(117)), C.banana],
    ["2 epicondyles", "flexors → medial · extensors → lateral", s_(118), FC.ecrb],
    ["Front superficial", "the hand trick (PT, FCR, PL, FCU) + FDS in the middle", s_(119), FC.fds],
    ["Front deep", "FDP · flexor pollicis longus · pronator quadratus", s_(120), FC.fdpU],
    ["Back", "superficial 1 · 2 · 2 · 1 · deep: supinator, 3 thumb, 1 index", s_(121), FC.sup],
    ["Nerves", "back = radial · front = median + 1½ ulnar", s_(122), NC.med],
  ];
  const ot = s_(123) - 0.2;
  const outro = ramp(t, ot, ot + 0.5);
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
                <div style={{ fontSize: 28, color: C.matchaLight, width: 760, lineHeight: 1.15 }}>{s}</div>
              </div>
            ))}
          </div>
          <div style={abs(1290, 40, { opacity: ramp(t, a, a + 0.5), width: 230, height: 660, borderRadius: 28, background: C.card, overflow: "hidden" })}>
            <div style={abs(-80, 20, { width: 420, height: 620 })}>{FA(t, { layer: "both", peel: t > s_(120) ? 0.6 : 0, nerve: s_(122) })}</div>
          </div>
          <div style={abs(1530, 40, { opacity: ramp(t, a + 0.3, a + 0.8), width: 230, height: 660, borderRadius: 28, background: C.card, overflow: "hidden" })}>
            <div style={abs(-110, 20, { width: 420, height: 620 })}><Forearm t={t} view="back" layer="both" nerve={s_(122)} /></div>
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
              <div style={{ background: C.red, color: C.paper, borderRadius: 50, padding: "18px 54px 22px", fontSize: 54, letterSpacing: 3, transform: `scale(${1 + 0.05 * Math.max(0, Math.sin((t - ot) * 5))})`, opacity: ramp(t, wf(124, "subscribe"), wf(124, "subscribe") + 0.3) }}>SUBSCRIBE</div>
              <div style={{ fontSize: 34, color: C.matchaLight, opacity: ramp(t, wf(123, "study"), wf(123, "study") + 0.3) }}>study cards: bookplume.com</div>
            </div>
            <div style={{ marginTop: 40, background: C.paper, color: C.forest, borderRadius: 24, padding: "16px 30px 20px", fontSize: 38, opacity: ramp(t, s_(125), s_(125) + 0.4), width: "fit-content" }}>Which forearm muscle do you always mix up?</div>
          </div>
        </div>
      )}
    </Stage>
  );
};
