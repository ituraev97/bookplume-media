import React from "react";
import { Img, staticFile } from "remotion";
import { C, FONT, ramp, useT } from "./kit";
import { Facts, Stage, LogoMark } from "./Chrome16";
import { PlexusMap, LegMap, Gate, CrossSec, FootSide, FootFront, NC, PM_PT, LM_PT, GT_PT, Lit } from "./IllusLS";
import { s_, e_, wf, ST, BE, abs, pop, Big, Mk, Seg, Note, Chip, ViewTag, Tag, Panel, KPlate, TrickCard, FL, kv } from "./Kit2";
import { END } from "./timeline";

/* ---------- plates (Gray's Anatomy 1918, public domain) ---------- */
const P = (f: string, w: number, h: number) => ({ src: `plates/${f}.png`, aspect: w / h });
const LPLAN = P("lplan822", 1679, 1644);
const LUMB = P("lumbar823", 1488, 1440);
const SPLAN = P("splan828", 1939, 2554);
const SAC = P("sacral837", 1984, 1210);
const FRONT = { src: "plates/front827.png", aspect: 1172 / 3103 };
const POST = { src: "plates/post832.png", aspect: 1048 / 3034 };

type CK = [number, number, number, number];
type PinS = { t0: number; t1?: number; pt: [number, number]; text: string; dx?: number; dy?: number; hot?: boolean; size?: number; col?: string };

/** diagram panel with a camera (keys: time, scale, focusX, focusY in viewBox fractions) and pins in viewBox units */
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

/** tall plate (whole leg) in a window: keys [time, zoom (1 = plate width fills the window), fx, fy]; pins in plate fractions */
type TPin = { t0: number; t1?: number; x: number; y: number; text: string; dx?: number; dy?: number; hot?: boolean; col?: string; size?: number };
const TallPlate: React.FC<{ src: string; aspect: number; x: number; y: number; w: number; h: number; t: number; t0: number; keys: CK[]; pins?: TPin[]; tag?: string }> = ({ src, aspect, x, y, w, h, t, t0, keys, pins = [], tag }) => {
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
      {pins.map((p, i) => <Tag key={i} t={t} t0={p.t0} t1={p.t1} x={tx} y={ty} w={iw} vbw={1} pt={[p.x, p.y / aspect]} text={p.text} dx={p.dx ?? 0} dy={p.dy ?? 0} hot={p.hot} col={p.col} size={p.size ?? 30} />)}
      <div style={abs(14, h - 36, { fontFamily: FONT, fontWeight: 700, fontSize: 17, color: C.forest, opacity: 0.6, background: "rgba(247,246,236,0.88)", padding: "2px 10px", borderRadius: 8 })}>Gray's Anatomy, 1918 · public domain</div>
      {tag && <ViewTag t={t} t0={t0 + 0.3} x={18} y={16} text={tag} />}
    </div>
  );
};

export const RowL: React.FC<{ t: number; t0: number; col: string; title: string; sub?: string; w?: number; n?: string; size?: number }> = ({ t, t0, col, title, sub, w = 700, n, size = 38 }) => (
  <div style={{ ...pop(t, t0), width: w, display: "flex", alignItems: "center", gap: 18, background: C.card, border: `3px solid ${C.line}`, borderRadius: 24, padding: "10px 22px", fontFamily: FONT, fontWeight: 800, transformOrigin: "0% 50%", boxSizing: "border-box" }}>
    <div style={{ width: 52, height: 52, borderRadius: 26, background: col, border: `3px solid ${C.forest}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, color: C.forest }}>{n}</div>
    <div>
      <div style={{ fontSize: size, color: C.forest, lineHeight: 1.1 }}>{title}</div>
      {sub && <div style={{ fontSize: size * 0.7, color: C.matcha, lineHeight: 1.15, marginTop: 2 }}>{sub}</div>}
    </div>
  </div>
);
const Col: React.FC<{ x: number; y: number; gap?: number; children: React.ReactNode }> = ({ x, y, gap = 16, children }) => (
  <div style={abs(x, y, { display: "flex", flexDirection: "column", gap })}>{children}</div>
);
export const Hdr: React.FC<{ t: number; t0: number; x: number; y: number; children: React.ReactNode; size?: number; color?: string }> = ({ t, t0, x, y, children, size = 64, color }) => (
  <div style={abs(x, y, { ...pop(t, t0), transformOrigin: "0% 50%" })}><Big size={size} color={color}>{children}</Big></div>
);
/** nerve name header: coloured dot + number + name + roots */
const NHead: React.FC<{ t: number; t0: number; x: number; y: number; n?: string; k: string; name: string; roots: string; w?: number }> = ({ t, t0, x, y, n, k, name, roots, w = 740 }) => (
  <div style={abs(x, y, { ...pop(t, t0, 0.35), width: w, background: C.forest, borderRadius: 28, padding: "16px 26px 20px", boxSizing: "border-box", display: "flex", alignItems: "center", gap: 20, transformOrigin: "0% 50%" })}>
    <div style={{ width: 66, height: 66, borderRadius: 33, background: NC[k], border: `4px solid ${C.paper}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.forest }}>{n}</div>
    <div style={{ fontFamily: FONT, fontWeight: 800 }}>
      <div style={{ fontSize: name.length > 22 ? 40 : 48, color: C.paper, lineHeight: 1.05 }}>{name}</div>
      <div style={{ fontSize: 30, color: C.banana, marginTop: 4 }}>{roots.startsWith("·") ? roots.slice(2) : `roots ${roots}`}</div>
    </div>
  </div>
);
const PMap = (t: number, lit: Lit = {}, extra: Partial<React.ComponentProps<typeof PlexusMap>> = {}) => <PlexusMap t={t} w={900} lit={lit} {...extra} />;
const pm = (k: string): [number, number] => PM_PT[k];

/* ================= 0. INTRO ================= */
export const SIntro: React.FC = () => {
  const t = useT();
  const m1 = s_(3) - 0.2, m2 = s_(7) - 0.2;
  return (
    <Stage a={-1} b={BE(0)}>
      <Seg t={t} a={-1} b={m1}>
        <KPlate {...LUMB} x={0} y={0} w={740} a={-1} b={m1} keys={[[0, 1.0, 0.5, 0.5], [wf(1, "lumbar"), 1.55, 0.3, 0.42], [wf(1, "sacral"), 1.6, 0.45, 0.82], [s_(2), 1.05, 0.5, 0.5]]}
          labels={[
            { x: 0.33, y: 0.4, text: "lumbar plexus", t: wf(1, "lumbar") + 0.2, side: "r", hot: true, t1: s_(2) },
            { x: 0.48, y: 0.82, text: "sacral nerves", t: wf(1, "sacral") + 0.2, side: "r", hot: true, t1: s_(2) },
          ]} />
        <div style={abs(800, 0, { width: 1000, ...pop(t, 0.2) })}>
          <Big size={92}><Mk p={ramp(t, 0.6, 1.6)}>Lumbar &amp; Sacral</Mk></Big>
          <Big size={92}><Mk p={ramp(t, 1.0, 2.0)}>Plexus Made Easy</Mk></Big>
          <Big size={40} color={C.matcha} style={{ marginTop: 10 }}>the nerves of the whole lower limb · in about 10 minutes</Big>
        </div>
        <div style={abs(800, 330, { display: "flex", flexDirection: "column", gap: 14 })}>
          <div><Chip t={t} t0={wf(0, "step")} bg={C.card} color={C.forest} size={38}>every step</Chip></div>
          <div><Chip t={t} t0={wf(0, "stair")} bg={C.card} color={C.forest} size={38}>every stair you climb</Chip></div>
          <div><Chip t={t} t0={wf(0, "squeeze")} bg={C.card} color={C.forest} size={38}>squeezing your knees together</Chip></div>
          <div><Chip t={t} t0={wf(0, "two")} bg={C.forest} size={40}>= 2 nerve networks · lower back + pelvis</Chip></div>
          <div><Chip t={t} t0={wf(2, "entire")} bg={C.banana} color={C.forest} size={44}>they run the ENTIRE lower limb</Chip></div>
        </div>
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <ZoomBox x={0} y={0} w={760} h={740} t={t} t0={m1} keys={[[m1, 1.0, 0.5, 0.5], [s_(6), 1.0, 0.5, 0.5]]}
          pins={[
            { t0: wf(4, "largest"), pt: LM_PT.sci, text: "?", dx: 120, dy: 0, hot: true, size: 44 },
            { t0: wf(5, "thighs"), pt: LM_PT.obt, text: "?", dx: -110, dy: 80, hot: true, size: 44 },
            { t0: wf(6, "above"), pt: LM_PT.sg, text: "?", dx: 120, dy: -10, hot: true, size: 44 },
          ]}>
          <LegMap t={t} w={900} lit={{ sci: wf(4, "largest"), obt: wf(5, "pulls"), sg: wf(6, "odd") }} zones={{ thighMed: wf(5, "pulls"), glut: wf(6, "odd") }} />
        </ZoomBox>
        <ViewTag t={t} t0={m1 + 0.3} x={24} y={20} text="RIGHT LOWER LIMB · SCHEMATIC" />
        <div style={abs(820, 20, { display: "flex", flexDirection: "column", gap: 26 })}>
          <div><Chip t={t} t0={s_(3)} bg={C.matcha} size={36}>keep these 3 in mind:</Chip></div>
          {([["1. The largest nerve in the body?", s_(4), C.forest], ["2. The nerve that pulls your thighs together?", s_(5), C.forest], ["3. The odd one out: leaves ABOVE a muscle?", s_(6), C.red]] as [string, number, string][]).map(([x, tt, bg]) => (
            <div key={x}><Chip t={t} t0={tt} bg={bg} size={42}>{x}</Chip></div>
          ))}
        </div>
        <div style={abs(820, 470, { width: 960, opacity: ramp(t, e_(6) - 0.2, e_(6) + 0.3) })}>
          <Big size={46} color={C.matcha}>…you'll answer all three by the end.</Big>
        </div>
      </Seg>
      <Seg t={t} a={m2} b={BE(0) + 0.1}>
        <ZoomBox x={0} y={0} w={680} h={740} t={t} t0={m2} keys={[[m2, 1.0, 0.5, 0.5]]}>
          {PMap(t, {}, { grow: { ih: m2, ii: m2 + 0.3, gf: m2 + 0.6, lfc: m2 + 0.9, fem: m2 + 1.2, obt: m2 + 1.5, lst: m2 + 1.8, sacral: m2 + 2.1, sg: m2 + 2.4, ig: m2 + 2.7, sci: m2 + 3.0, pfc: m2 + 3.3, pud: m2 + 3.6 }, dimAll: false })}
        </ZoomBox>
        <ViewTag t={t} t0={m2 + 0.3} x={24} y={20} text="LUMBOSACRAL PLEXUS · SCHEMATIC" />
        <div style={abs(740, 0)}><Chip t={t} t0={s_(7)} bg={C.forest} size={44}>In about 10 minutes you'll know:</Chip></div>
        <Col x={740} y={100} gap={14}>
          <RowL t={t} t0={wf(7, "roots")} col={C.banana} n="1" title="the roots · T12 → S4" w={760} />
          <RowL t={t} t0={wf(7, "every")} col={NC.fem} n="2" title="every major branch" w={760} />
          <RowL t={t} t0={wf(7, "supplies")} col={NC.tib} n="3" title="what each one supplies" w={760} />
          <RowL t={t} t0={wf(7, "memory")} col={NC.obt} n="4" title="memory tricks that stick" w={760} />
        </Col>
        <div style={abs(740, 520)}><Chip t={t} t0={wf(8, "quiz")} bg={C.red} size={46}>+ 5-question quiz at the end</Chip></div>
      </Seg>
    </Stage>
  );
};

/* ================= 1. BIG PICTURE ================= */
export const SBig: React.FC = () => {
  const t = useT();
  const a = ST(1), b = BE(1);
  const k2 = s_(12) - 0.2, k3 = s_(13) - 0.2, k4 = s_(14) - 0.2, k5 = s_(16) - 0.2, k6 = s_(19) - 0.2;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={k2}>
        <ZoomBox x={0} y={0} w={760} h={740} t={t} t0={a} keys={[[a, 1.0, 0.5, 0.5], [wf(10, "network"), 1.7, 0.6, 0.3], [s_(11), 1.0, 0.5, 0.5]]}>
          {PMap(t, { lumbar: s_(11) + 0.3, sacral: s_(11) + 1.0 }, { dimAll: false })}
        </ZoomBox>
        <ViewTag t={t} t0={a + 0.3} x={24} y={20} text="SCHEMATIC · RIGHT SIDE · FRONT VIEW" />
        <Hdr t={t} t0={a} x={820} y={0} size={78}>What is a plexus?</Hdr>
        <Facts x={820} y={120} w={940} items={[
          { t: wf(10, "network"), text: "plexus = a NETWORK of nerves", bg: C.forest },
          { t: wf(10, "mix"), text: "spinal nerves mix + regroup → then head out to the body" },
          { t: s_(11), big: "2", text: "plexuses for the lower limb: lumbar (upper) + sacral (lower)", bg: C.matcha },
        ]} />
      </Seg>
      <Seg t={t} a={k2} b={k3}>
        <KPlate {...LPLAN} x={0} y={0} w={756} a={k2} b={k3} keys={[[k2, 1.0, 0.5, 0.5], [wf(12, "anterior"), 1.45, 0.72, 0.35], [wf(12, "twelve"), 1.8, 0.72, 0.08], [e_(12) - 0.6, 1.0, 0.5, 0.5]]}
          labels={[
            { x: 0.73, y: 0.11, text: "L1", t: wf(12, "one"), side: "l", hot: true },
            { x: 0.73, y: 0.26, text: "L2", t: wf(12, "two"), side: "l", hot: true },
            { x: 0.73, y: 0.42, text: "L3", t: wf(12, "three"), side: "l", hot: true },
            { x: 0.73, y: 0.59, text: "L4", t: wf(12, "four"), side: "l", hot: true },
            { x: 0.72, y: 0.03, text: "T12", t: wf(12, "twelve"), side: "l", hot: true },
          ]} />
        <ViewTag t={t} t0={k2 + 0.3} x={20} y={690} text="GRAY'S 1918 · FIG. 822 · PLAN OF THE LUMBAR PLEXUS" />
        <Note t={t} t0={wf(12, "twelve") + 0.5} old="from 12th thoracic" modern="T12" x={820} y={650} />
        <Hdr t={t} t0={k2} x={820} y={0} size={72}>The lumbar plexus</Hdr>
        <Facts x={820} y={110} w={940} items={[
          { t: wf(12, "anterior"), text: "built from the ANTERIOR (ventral) rami", bg: C.forest },
          { t: wf(12, "one"), big: "L1 · L2 · L3 · L4", text: "the main roots" },
          { t: wf(12, "twelve"), text: "+ a small twig from T12", bg: C.banana },
        ]} />
      </Seg>
      <Seg t={t} a={k3} b={k4}>
        <KPlate {...LUMB} x={0} y={0} w={760} a={k3} b={k4} keys={[[k3, 1.0, 0.5, 0.5], [wf(13, "psoas"), 1.55, 0.6, 0.45], [wf(13, "transverse"), 1.5, 0.38, 0.45]]}
          labels={[
            { x: 0.63, y: 0.33, text: "psoas major", t: wf(13, "psoas"), side: "l", hot: true },
            { x: 0.3, y: 0.5, text: "plexus (psoas removed)", t: wf(13, "transverse"), side: "r" },
          ]} />
        <ViewTag t={t} t0={k3 + 0.3} x={20} y={690} text="GRAY'S 1918 · FIG. 823 · POSTERIOR ABDOMINAL WALL" />
        <Hdr t={t} t0={k3} x={830} y={0} size={72}>It forms INSIDE a muscle</Hdr>
        <Facts x={830} y={120} w={930} items={[
          { t: wf(13, "psoas"), big: "psoas major", text: "the plexus is embedded in it", bg: C.forest },
          { t: wf(13, "front"), text: "in front of the transverse processes of the lumbar vertebrae" },
          { t: wf(13, "front") + 1.4, text: "left side: the psoas was removed to show the nerves", bg: C.banana },
        ]} />
      </Seg>
      <Seg t={t} a={k4} b={k5}>
        <KPlate {...SPLAN} x={80} y={0} w={560} a={k4} b={k5} keys={[[k4, 1.0, 0.5, 0.5], [s_(15), 1.5, 0.75, 0.4]]}
          labels={[
            { x: 0.84, y: 0.03, text: "L4", t: wf(15, "four"), side: "l", hot: true },
            { x: 0.84, y: 0.17, text: "L5", t: wf(15, "five"), side: "l", hot: true },
            { x: 0.84, y: 0.31, text: "S1", t: wf(15, "one"), side: "l", hot: true },
            { x: 0.84, y: 0.45, text: "S2", t: wf(15, "one") + 0.25, side: "l", hot: true },
            { x: 0.84, y: 0.59, text: "S3", t: wf(15, "one") + 0.5, side: "l", hot: true },
            { x: 0.84, y: 0.73, text: "S4", t: wf(15, "four", 1), side: "l", hot: true },
          ]} />
        <ViewTag t={t} t0={k4 + 0.3} x={100} y={690} text="GRAY'S 1918 · FIG. 828 · SACRAL PLEXUS (PLAN)" />
        <Hdr t={t} t0={k4} x={720} y={0} size={72}>The sacral plexus</Hdr>
        <Facts x={720} y={110} w={1000} items={[
          { t: wf(14, "back"), text: "on the back wall of the pelvis", bg: C.forest },
          { t: wf(14, "piriformis"), text: "lies right in front of the PIRIFORMIS muscle" },
          { t: s_(15), big: "L4 → S4", text: "L4 · L5 + S1 · S2 · S3 · S4", bg: C.matcha },
        ]} />
      </Seg>
      <Seg t={t} a={k5} b={k6}>
        <KPlate {...SAC} x={0} y={60} w={1000} a={k5} b={k6} keys={[[k5, 1.0, 0.5, 0.5], [wf(17, "lumbosacral"), 1.9, 0.66, 0.45], [s_(18), 1.45, 0.62, 0.55]]}
          labels={[
            { x: 0.64, y: 0.44, text: "lumbosacral trunk", t: wf(17, "lumbosacral"), side: "l", hot: true },
            { x: 0.72, y: 0.66, text: "sacral plexus", t: wf(18, "joins"), side: "l" },
            { x: 0.45, y: 0.33, text: "psoas", t: s_(16) + 0.4, side: "l", t1: wf(17, "lumbosacral") },
          ]} />
        <ViewTag t={t} t0={k5 + 0.3} x={20} y={68} text="GRAY'S 1918 · FIG. 837 · SIDE WALL OF THE PELVIS" />
        <Note t={t} t0={wf(17, "trunk") + 0.4} old="lumbo-sacral cord" modern="lumbosacral trunk" x={20} y={680} />
        <Hdr t={t} t0={s_(16)} x={1060} y={0} size={64}>The bridge</Hdr>
        <Facts x={1060} y={100} w={720} items={[
          { t: wf(17, "part"), text: "part of L4 + all of L5", bg: C.forest },
          { t: wf(17, "lumbosacral"), big: "lumbosacral trunk", text: "a thick cord" },
          { t: s_(18), text: "drops into the pelvis → joins the sacral plexus", bg: C.banana },
        ]} />
      </Seg>
      <Seg t={t} a={k6} b={b + 0.1}>
        <ZoomBox x={0} y={0} w={640} h={740} t={t} t0={k6} keys={[[k6, 1.0, 0.5, 0.5]]}>
          {PMap(t, { lumbar: s_(20), sacral: s_(21) }, { dimAll: false })}
        </ZoomBox>
        <div style={abs(700, 0)}><Chip t={t} t0={s_(19)} bg={C.forest} size={42}>1 lumbosacral plexus · 2 floors</Chip></div>
        <Col x={700} y={110} gap={18}>
          <RowL t={t} t0={s_(20)} col={C.banana} n="↑" title="upper floor = lumbar" sub="front + inner thigh" w={600} />
          <RowL t={t} t0={s_(21)} col="#9FB4E8" n="↓" title="lower floor = sacral" sub="buttock · back of thigh · below the knee" w={600} />
        </Col>
        <div style={abs(1320, 120, pop(t, s_(20)))}>
          <LegMap t={t} w={470} tags={false} show={[]} zones={{ thighAnt: s_(20), thighMed: s_(20), glut: s_(21), thighPost: s_(21), legAnt: s_(21) + 0.3, legLat: s_(21) + 0.3, legPost: s_(21) + 0.3 }} />
        </div>
        <div style={abs(1340, 660, { opacity: ramp(t, s_(20), s_(20) + 0.4), fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.matcha })}>front · back</div>
      </Seg>
    </Stage>
  );
};

/* ================= 2. LUMBAR PLEXUS: FIRST FOUR ================= */
export const SLumbar: React.FC = () => {
  const t = useT();
  const a = ST(2), b = BE(2);
  const k2 = s_(24) - 0.2, k3 = s_(27) - 0.2, k4 = s_(30) - 0.2, k5 = s_(34) - 0.2;
  const six: [string, string][] = [["iliohypogastric", "ih"], ["ilioinguinal", "ii"], ["genitofemoral", "gf"], ["lateral femoral cutaneous", "lfc"], ["obturator", "obt"], ["femoral", "fem"]];
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={k2}>
        <ZoomBox x={0} y={0} w={700} h={740} t={t} t0={a} keys={[[a, 1.15, 0.45, 0.4]]}>
          {PMap(t, {}, { grow: { ih: wf(23, "six"), ii: wf(23, "six") + 0.35, gf: wf(23, "six") + 0.7, lfc: wf(23, "six") + 1.05, obt: wf(23, "six") + 1.4, fem: wf(23, "six") + 1.75, lst: a, sacral: a, sg: a, ig: a, sci: a, pfc: a, pud: a } })}
        </ZoomBox>
        <Hdr t={t} t0={a} x={760} y={0} size={72}><Mk p={ramp(t, wf(23, "six"), wf(23, "six") + 0.6)}>6 branches</Mk>, top → bottom</Hdr>
        <Col x={760} y={110} gap={10}>
          {six.map(([n, k], i) => <RowL key={k} t={t} t0={wf(23, "six") + 0.35 * i} col={NC[k]} n={String(i + 1)} title={n} w={700} size={34} />)}
        </Col>
      </Seg>
      <Seg t={t} a={k2} b={k3}>
        <ZoomBox x={0} y={0} w={760} h={740} t={t} t0={k2} keys={[[k2, 1.0, 0.5, 0.45], [wf(24, "iliohypogastric"), 1.9, 0.42, 0.18], [s_(26), 1.6, 0.4, 0.22]]}
          pins={[{ t0: wf(24, "iliohypogastric"), pt: pm("ih"), text: "iliohypogastric", dx: 150, dy: -70, hot: true }]}>
          {PMap(t, { ih: wf(24, "iliohypogastric") })}
        </ZoomBox>
        <NHead t={t} t0={s_(24)} x={820} y={0} n="1" k="ih" name="Iliohypogastric" roots="T12 · L1" w={900} />
        <Facts x={820} y={160} w={900} items={[
          { t: wf(25, "two"), text: "MOTOR: 2 muscles of the abdominal wall" },
          { t: wf(25, "internal"), text: "internal oblique + transversus abdominis", bg: C.matcha },
          { t: s_(26), text: "SKIN: side of the buttock + just above the pubic bone", bg: C.forest },
        ]} />
      </Seg>
      <Seg t={t} a={k3} b={k4}>
        <KPlate {...LUMB} x={0} y={0} w={760} a={k3} b={k4} keys={[[k3, 1.0, 0.5, 0.5], [wf(27, "ilioinguinal"), 1.9, 0.24, 0.4], [s_(29), 1.6, 0.25, 0.55]]}
          labels={[
            { x: 0.3, y: 0.32, text: "iliohypogastric", t: s_(27), side: "r", t1: wf(27, "ilioinguinal") },
            { x: 0.27, y: 0.45, text: "ilioinguinal", t: wf(27, "ilioinguinal"), side: "r", hot: true },
          ]} />
        <ViewTag t={t} t0={k3 + 0.3} x={20} y={690} text="GRAY'S 1918 · FIG. 823" />
        <Note t={t} t0={wf(27, "ilioinguinal") + 1.2} old="ilio-inguinal" x={20} y={20} />
        <NHead t={t} t0={s_(27)} x={820} y={0} n="2" k="ii" name="Ilioinguinal" roots="L1" w={900} />
        <Facts x={820} y={160} w={900} items={[
          { t: wf(28, "same"), text: "MOTOR: the same 2 abdominal muscles" },
          { t: wf(28, "superficial"), text: "passes through the superficial inguinal ring", bg: C.matcha },
          { t: s_(29), text: "SKIN: upper inner thigh + front of the external genitals", bg: C.forest },
        ]} />
      </Seg>
      <Seg t={t} a={k4} b={k5}>
        <KPlate {...LUMB} x={0} y={0} w={760} a={k4} b={k5} keys={[[k4, 1.0, 0.5, 0.5], [wf(30, "genitofemoral"), 1.8, 0.56, 0.45], [s_(32), 1.5, 0.55, 0.5]]}
          labels={[
            { x: 0.565, y: 0.44, text: "genitofemoral", t: wf(30, "genitofemoral"), side: "l", hot: true },
          ]} />
        <ViewTag t={t} t0={k4 + 0.3} x={20} y={690} text="GRAY'S 1918 · FIG. 823" />
        <NHead t={t} t0={s_(30)} x={820} y={0} n="3" k="gf" name="Genitofemoral" roots="L1 · L2" w={900} />
        <div style={abs(820, 170)}><Chip t={t} t0={s_(31)} bg={C.banana} color={C.forest} size={40}>splits in 2 · exactly as its name says</Chip></div>
        <Col x={820} y={270} gap={18}>
          <RowL t={t} t0={wf(32, "genital")} col={NC.gf} n="G" title="genital branch" sub="cremaster muscle (males) + genital skin" w={900} />
          <RowL t={t} t0={wf(33, "femoral")} col={NC.gf} n="F" title="femoral branch" sub="small patch of skin · upper front of the thigh" w={900} />
        </Col>
      </Seg>
      <Seg t={t} a={k5} b={b + 0.1}>
        <TallPlate {...FRONT} x={0} y={0} w={620} h={740} t={t} t0={k5} keys={[[k5, 1.6, 0.3, 0.06], [wf(36, "outer"), 1.25, 0.3, 0.15]]} tag="GRAY'S 1918 · FIG. 827 · FRONT"
          pins={[
            { t0: wf(34, "lateral"), x: 0.24, y: 0.035, text: "lateral femoral cutaneous", dx: 170, dy: 40, hot: true },
            { t0: wf(36, "outer"), x: 0.2, y: 0.17, text: "outer thigh skin", dx: 140, dy: 30 },
          ]} />
        <NHead t={t} t0={s_(34)} x={680} y={0} n="4" k="lfc" name="Lateral femoral cutaneous" roots="L2 · L3" w={760} />
        <Facts x={680} y={160} w={760} items={[
          { t: wf(35, "cutaneous"), text: "cutaneous = SKIN" },
          { t: wf(35, "purely"), text: "purely SENSORY · no muscles", bg: C.red },
          { t: wf(36, "enters"), text: "enters the thigh near the OUTER end of the inguinal ligament", bg: C.matcha },
          { t: wf(36, "supplies"), text: "skin of the outer (lateral) thigh", bg: C.forest },
        ]} />
        <div style={abs(1480, 180, pop(t, wf(36, "supplies")))}>
          <LegMap t={t} w={300} tags={false} show={["lfc"]} lit={{ lfc: wf(36, "supplies") }} />
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 3. FEMORAL AND OBTURATOR ================= */
export const SBigTwo: React.FC = () => {
  const t = useT();
  const a = ST(3), b = BE(3);
  const k2 = s_(39) - 0.2, k2b = s_(41) - 0.2, k3 = s_(42) - 0.2, k4 = s_(45) - 0.2, k5 = s_(47) - 0.2, k5b = s_(49) - 0.2, k6 = s_(53) - 0.2;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={k2}>
        <ZoomBox x={0} y={0} w={760} h={740} t={t} t0={a} keys={[[a, 1.0, 0.5, 0.45], [s_(38), 1.35, 0.5, 0.55]]}
          pins={[{ t0: a + 0.3, pt: pm("fem"), text: "femoral", dx: -10, dy: -60, hot: true }, { t0: a + 0.6, pt: pm("obt"), text: "obturator", dx: 30, dy: -60, hot: true }]}>
          {PMap(t, { fem: a, obt: a + 0.3 })}
        </ZoomBox>
        <Hdr t={t} t0={a} x={830} y={20} size={96}>The big two</Hdr>
        <div style={abs(830, 170, { display: "flex", gap: 14 })}>
          {["L2", "L3", "L4"].map((x, i) => <Chip key={x} t={t} t0={[wf(38, "two"), wf(38, "three"), wf(38, "four")][i]} bg={C.banana} color={C.forest} size={64}>{x}</Chip>)}
        </div>
        <div style={abs(830, 320, { opacity: ramp(t, wf(38, "four") + 0.3, wf(38, "four") + 0.7) })}><Big size={44} color={C.matcha}>both nerves · same 3 roots</Big></div>
      </Seg>
      <Seg t={t} a={k2} b={k2b}>
        <KPlate {...LUMB} x={0} y={0} w={760} a={k2} b={k2b} keys={[[k2, 1.0, 0.5, 0.5], [wf(39, "femoral"), 1.6, 0.3, 0.72], [s_(40), 1.4, 0.45, 0.7]]}
          labels={[
            { x: 0.27, y: 0.78, text: "femoral nerve", t: wf(39, "femoral"), side: "r", hot: true },
            { x: 0.79, y: 0.68, text: "iliacus", t: wf(40, "iliacus"), side: "l" },
            { x: 0.6, y: 0.5, text: "psoas", t: wf(40, "psoas"), side: "l" },
          ]} />
        <ViewTag t={t} t0={k2 + 0.3} x={20} y={690} text="GRAY'S 1918 · FIG. 823" />
        <NHead t={t} t0={s_(39)} x={820} y={0} n="5" k="fem" name="Femoral nerve" roots="L2 · L3 · L4" w={900} />
        <Facts x={820} y={160} w={900} items={[
          { t: wf(39, "largest"), text: "the LARGEST branch of the lumbar plexus", bg: C.red },
          { t: wf(40, "between"), text: "runs down between psoas and iliacus" },
          { t: wf(40, "under"), text: "→ under the inguinal ligament into the thigh", bg: C.matcha },
        ]} />
      </Seg>
      <Seg t={t} a={k2b} b={k3}>
        <TallPlate {...FRONT} x={0} y={0} w={760} h={740} t={t} t0={k2b} keys={[[k2b, 1.6, 0.47, 0.1]]} tag="GRAY'S 1918 · FIG. 827 · FEMORAL TRIANGLE"
          pins={[
            { t0: wf(41, "femoral"), x: 0.44, y: 0.1, text: "femoral nerve", dx: -170, dy: -40, hot: true },
            { t0: wf(41, "artery"), x: 0.5, y: 0.14, text: "femoral artery", dx: 170, dy: 30 },
          ]} />
        <NHead t={t} t0={k2b} x={820} y={0} n="5" k="fem" name="Femoral nerve" roots="L2 · L3 · L4" w={900} />
        <Facts x={820} y={160} w={900} items={[
          { t: wf(41, "femoral"), big: "femoral triangle", text: "the nerve lies on the OUTER (lateral) side", bg: C.forest },
          { t: wf(41, "artery"), text: "of the femoral artery" },
        ]} />
      </Seg>
      <Seg t={t} a={k3} b={k4}>
        <TallPlate {...FRONT} x={0} y={0} w={620} h={740} t={t} t0={k3} keys={[[k3, 1.25, 0.4, 0.2], [wf(43, "quadriceps"), 1.2, 0.4, 0.3]]} tag="GRAY'S 1918 · FIG. 827 · FRONT OF THIGH"
          pins={[
            { t0: wf(43, "sartorius"), x: 0.29, y: 0.07, text: "sartorius", dx: 120, dy: 20 },
            { t0: wf(43, "pectineus"), x: 0.52, y: 0.13, text: "pectineus", dx: 120, dy: -10 },
            { t0: wf(43, "quadriceps"), x: 0.39, y: 0.27, text: "rectus femoris", dx: 140, dy: 0, hot: true },
            { t0: wf(43, "quadriceps") + 0.3, x: 0.25, y: 0.31, text: "vastus lateralis", dx: 120, dy: 50, hot: true },
            { t0: wf(43, "quadriceps") + 0.6, x: 0.56, y: 0.44, text: "vastus medialis", dx: 10, dy: 50, hot: true },
          ]} />
        <Hdr t={t} t0={s_(42)} x={680} y={0} size={56}>Femoral → FRONT of the thigh</Hdr>
        <Col x={680} y={100} gap={12}>
          <RowL t={t} t0={wf(43, "iliacus")} col={NC.fem} n="1" title="iliacus" w={560} size={34} />
          <RowL t={t} t0={wf(43, "pectineus")} col={NC.fem} n="2" title="pectineus" w={560} size={34} />
          <RowL t={t} t0={wf(43, "sartorius")} col={NC.fem} n="3" title="sartorius" w={560} size={34} />
          <RowL t={t} t0={wf(43, "quadriceps")} col={C.red} n="4" title="quadriceps femoris" sub="4 heads" w={560} size={34} />
        </Col>
        <div style={abs(680, 520, { display: "flex", flexDirection: "column", gap: 12 })}>
          <div><Chip t={t} t0={wf(44, "flex")} bg={C.matcha} size={36}>helps FLEX the hip</Chip></div>
          <div><Chip t={t} t0={wf(44, "straightens")} bg={C.red} size={40}>main nerve that STRAIGHTENS the knee</Chip></div>
        </div>
        <div style={abs(1290, 110, pop(t, s_(42) + 0.4))}>
          <CrossSec t={t} w={480} which="thigh" zones={{ thighAnt: s_(42) + 0.4 }} />
        </div>
      </Seg>
      <Seg t={t} a={k4} b={k5}>
        <TallPlate {...FRONT} x={0} y={0} w={620} h={740} t={t} t0={k4} keys={[[k4, 1.0, 0.5, 0.35], [s_(46), 1.6, 0.48, 0.47]]} tag="GRAY'S 1918 · FIG. 827"
          pins={[
            { t0: wf(45, "saphenous"), x: 0.59, y: 0.36, text: "saphenous nerve", dx: -40, dy: -70, hot: true },
            { t0: wf(46, "patellar"), x: 0.48, y: 0.5, text: "patellar tendon area", dx: -60, dy: 80 },
          ]} />
        <Facts x={680} y={0} w={1080} items={[
          { t: wf(45, "saphenous"), big: "saphenous nerve", text: "its largest skin branch → down the INNER side of the leg", bg: C.forest },
          { t: wf(46, "tap"), text: "tap the patellar tendon → knee-jerk reflex" },
          { t: wf(46, "testing"), text: "that reflex tests the femoral nerve pathway (L2–L4)", bg: C.banana },
        ]} />
      </Seg>
      <Seg t={t} a={k5} b={k5b}>
        <ZoomBox x={0} y={0} w={760} h={740} t={t} t0={k5} keys={[[k5, 1.0, 0.5, 0.5], [wf(48, "inner"), 1.5, 0.52, 0.45], [wf(48, "obturator"), 1.4, 0.48, 0.75]]}
          pins={[
            { t0: wf(47, "obturator"), pt: pm("obt"), text: "obturator", dx: 120, dy: -40, hot: true },
            { t0: wf(48, "inner"), pt: [500, 520], text: "medial border of psoas", dx: -170, dy: 70 },
          ]}>
          {PMap(t, { obt: wf(47, "obturator") }, { grow: {} })}
        </ZoomBox>
        <NHead t={t} t0={s_(47)} x={820} y={0} n="6" k="obt" name="Obturator nerve" roots="L2 · L3 · L4" w={900} />
        <Facts x={820} y={160} w={900} items={[
          { t: wf(48, "inner"), text: "leaves the INNER (medial) border of psoas" },
          { t: wf(48, "side"), text: "runs along the side wall of the pelvis", bg: C.matcha },
          { t: wf(48, "canal"), text: "→ obturator canal → MEDIAL thigh", bg: C.forest },
        ]} />
      </Seg>
      <Seg t={t} a={k5b} b={k6}>
        <TallPlate {...FRONT} x={0} y={0} w={560} h={740} t={t} t0={k5b} keys={[[k5b, 1.9, 0.58, 0.22]]} tag="GRAY'S 1918 · FIG. 827 · INNER THIGH"
          pins={[
            { t0: s_(49), x: 0.57, y: 0.205, text: "obturator (ant. division)", dx: -150, dy: -60, hot: true },
            { t0: wf(50, "longus"), x: 0.56, y: 0.27, text: "adductor longus", dx: -130, dy: 40 },
            { t0: wf(50, "gracilis"), x: 0.645, y: 0.29, text: "gracilis", dx: -60, dy: 90 },
          ]} />
        <Hdr t={t} t0={s_(49)} x={610} y={0} size={56}>Obturator → INNER thigh</Hdr>
        <Col x={610} y={90} gap={10}>
          {([["adductor longus", "longus"], ["adductor brevis", "brevis"], ["adductor magnus (most of it)", "magnus"], ["gracilis", "gracilis"], ["obturator externus", "externus"]] as [string, string][]).map(([n, w], i) => (
            <RowL key={n} t={t} t0={wf(50, w)} col={NC.obt} n={String(i + 1)} title={n} w={620} size={32} />
          ))}
        </Col>
        <div style={abs(610, 560, { display: "flex", flexDirection: "column", gap: 12 })}>
          <div><Chip t={t} t0={wf(51, "pull")} bg={C.red} size={40}>job: pull the thighs TOGETHER</Chip></div>
          <div><Chip t={t} t0={s_(52)} bg={C.matcha} size={34}>+ skin patch on the inner thigh</Chip></div>
        </div>
        <div style={abs(1270, 110, pop(t, s_(49) + 0.3))}>
          <CrossSec t={t} w={500} which="thigh" zones={{ thighMed: s_(49) + 0.3 }} />
        </div>
      </Seg>
      <Seg t={t} a={k6} b={b + 0.1}>
        <ZoomBox x={0} y={0} w={760} h={740} t={t} t0={k6} keys={[[k6, 1.6, 0.47, 0.45]]}
          pins={[
            { t0: wf(53, "femoral"), pt: [395, 525], text: "femoral · OUTER side", dx: -150, dy: 60, hot: true },
            { t0: wf(53, "obturator"), pt: [500, 520], text: "obturator · INNER side", dx: 120, dy: 120, hot: true },
          ]}>
          {PMap(t, { fem: wf(53, "femoral"), obt: wf(53, "obturator") })}
        </ZoomBox>
        <Hdr t={t} t0={s_(53)} x={830} y={20} size={70}>Remember:</Hdr>
        <Col x={830} y={140} gap={22}>
          <RowL t={t} t0={wf(53, "femoral")} col={NC.fem} n="F" title="Femoral" sub="exits the OUTER (lateral) border of psoas" w={920} size={46} />
          <RowL t={t} t0={wf(53, "obturator")} col={NC.obt} n="O" title="Obturator" sub="exits the INNER (medial) border of psoas" w={920} size={46} />
        </Col>
      </Seg>
    </Stage>
  );
};

/* ================= 4. SACRAL PLEXUS ================= */
export const SSacral: React.FC = () => {
  const t = useT();
  const a = ST(4), b = BE(4);
  const k2 = s_(57) - 0.2, k3 = s_(60) - 0.2, k4 = s_(63) - 0.2, k4b = s_(65) - 0.2, k5 = s_(66) - 0.2;
  const gp = (k: string) => GT_PT[k];
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={k4b}>
        <ZoomBox x={0} y={0} w={880} h={740} cw={900} ch={700} t={t} t0={a} keys={[[a, 1.0, 0.5, 0.5], [wf(64, "lesser"), 1.35, 0.68, 0.65]]}
          pins={[
            { t0: wf(55, "greater"), t1: s_(58), pt: gp("gsf"), text: "greater sciatic foramen", dx: 0, dy: -60 },
            { t0: wf(56, "piriformis"), pt: gp("pir"), text: "piriformis", dx: 60, dy: -90, col: "#E8A79B" },
            { t0: wf(58, "superior"), t1: k3 + 1.5, pt: gp("sg"), text: "superior gluteal · ABOVE", dx: 20, dy: -60, hot: true },
            { t0: wf(61, "inferior"), t1: k4, pt: gp("ig"), text: "inferior gluteal", dx: 0, dy: -60, hot: true },
            { t0: wf(62, "posterior"), t1: k4, pt: gp("pfc"), text: "posterior femoral cutaneous", dx: 60, dy: -50, hot: true },
            { t0: wf(63, "pudendal"), pt: gp("pud"), text: "pudendal", dx: -110, dy: 20, hot: true },
            { t0: wf(64, "greater"), t1: wf(64, "lesser"), pt: [640, 300], text: "out: greater sciatic foramen", dx: -150, dy: 120 },
            { t0: wf(64, "lesser"), pt: gp("lsf"), text: "back in: lesser sciatic foramen", dx: -80, dy: 110 },
          ]}>
          <Gate t={t} w={900} pir={ramp(t, wf(56, "piriformis") - 0.3, wf(56, "piriformis") + 0.3)}
            grow={{ sg: wf(58, "superior") - 0.2, ig: wf(57, "below"), sci: wf(57, "below"), pfc: wf(57, "below"), pud: wf(63, "pudendal") - 0.2 }}
            lit={t < k2 ? {} : t < k3 ? { sg: wf(58, "superior") } : t < s_(62) ? { ig: wf(61, "inferior") } : t < k4 ? { pfc: wf(62, "posterior") } : { pud: wf(63, "pudendal") }} />
        </ZoomBox>
        <ViewTag t={t} t0={a + 0.3} x={24} y={20} text="RIGHT GLUTEAL REGION · BACK VIEW · SCHEMATIC" />
        <Seg t={t} a={a} b={k2}>
          <Hdr t={t} t0={a} x={940} y={0} size={60}>One gap, one muscle</Hdr>
          <Facts x={940} y={100} w={840} items={[
            { t: wf(55, "greater"), big: "greater sciatic foramen", text: "the exit from the pelvis", bg: C.forest },
            { t: wf(56, "piriformis"), text: "piriformis runs right through it" },
            { t: s_(57), text: "every nerve leaves ABOVE or BELOW piriformis", bg: C.red },
          ]} />
        </Seg>
        <Seg t={t} a={k2} b={k3}>
          <div style={abs(940, 0)}><Chip t={t} t0={k2} bg={C.red} size={44}>ABOVE piriformis: only 1</Chip></div>
          <NHead t={t} t0={wf(58, "superior")} x={940} y={100} k="sg" name="Superior gluteal" roots="L4 · L5 · S1" w={840} />
          <Col x={940} y={260} gap={10}>
            {([["gluteus medius", "medius"], ["gluteus minimus", "minimus"], ["tensor fasciae latae", "tensor"]] as [string, string][]).map(([n, w]) => <RowL key={n} t={t} t0={wf(59, w)} col={NC.sg} title={n} w={620} size={34} />)}
          </Col>
          <div style={abs(940, 560)}><Chip t={t} t0={wf(59, "move")} bg={C.matcha} size={36}>move the thigh out to the side</Chip></div>
        </Seg>
        <Seg t={t} a={k3} b={k4}>
          <div style={abs(940, 0)}><Chip t={t} t0={k3} bg={C.forest} size={44}>BELOW piriformis: everything else</Chip></div>
          <NHead t={t} t0={wf(61, "inferior")} x={940} y={100} k="ig" name="Inferior gluteal" roots="L5 · S1 · S2" w={840} />
          <div style={abs(940, 250, { display: "flex", flexDirection: "column", gap: 10 })}>
            <div><Chip t={t} t0={wf(61, "maximus")} bg={NC.ig} color={C.forest} size={38}>→ gluteus maximus (hip extensor)</Chip></div>
            <div><Chip t={t} t0={wf(61, "stairs")} bg={C.card} color={C.forest} size={32}>climbing stairs · standing up from a chair</Chip></div>
          </div>
          <NHead t={t} t0={wf(62, "posterior")} x={940} y={420} k="pfc" name="Posterior femoral cutaneous" roots="S1 → S3" w={840} />
          <div style={abs(940, 580)}><Chip t={t} t0={wf(62, "skin")} bg={NC.pfc} color={C.forest} size={34}>→ skin on the back of the thigh</Chip></div>
        </Seg>
        <Seg t={t} a={k4} b={k4b + 0.1}>
          <NHead t={t} t0={s_(63)} x={940} y={0} k="pud" name="Pudendal nerve" roots="S2 · S3 · S4" w={840} />
          <Facts x={940} y={160} w={840} items={[
            { t: wf(64, "greater"), text: "OUT through the greater sciatic foramen" },
            { t: wf(64, "hooks"), text: "hooks BACK IN through the lesser sciatic foramen", bg: C.matcha },
            { t: wf(64, "perineum"), text: "→ reaches the perineum", bg: C.forest },
          ]} />
        </Seg>
      </Seg>
      <Seg t={t} a={k4b} b={k5}>
        <KPlate {...SPLAN} x={80} y={0} w={560} a={k4b} b={k5} keys={[[k4b, 1.0, 0.5, 0.5], [s_(65) + 0.6, 1.7, 0.55, 0.85]]}
          labels={[{ x: 0.55, y: 0.88, text: "pudendal", t: s_(65) + 0.6, side: "r", hot: true }]} />
        <ViewTag t={t} t0={k4b + 0.3} x={100} y={690} text="GRAY'S 1918 · FIG. 828" />
        <NHead t={t} t0={k4b} x={720} y={0} k="pud" name="Pudendal nerve" roots="S2 · S3 · S4" w={1000} />
        <Facts x={720} y={160} w={1000} items={[
          { t: wf(65, "pelvic"), text: "supplies the pelvic floor muscles", bg: C.forest },
          { t: wf(65, "external"), text: "+ the EXTERNAL sphincters" },
          { t: wf(65, "voluntary"), text: "the voluntary muscles that hold in urine + stool", bg: C.matcha },
        ]} />
      </Seg>
      <Seg t={t} a={k5} b={b + 0.1}>
        <KPlate {...SPLAN} x={80} y={0} w={560} a={k5} b={b} keys={[[k5, 1.3, 0.4, 0.6], [s_(66) + 0.3, 2.0, 0.25, 0.74]]}
          labels={[{ x: 0.24, y: 0.74, text: "the giant", t: s_(66) + 0.4, side: "r", hot: true }]} />
        <div style={abs(760, 220, { ...pop(t, s_(66)), transformOrigin: "0% 50%" })}><Big size={130}>And then…</Big></div>
        <div style={abs(760, 380, { ...pop(t, wf(66, "giant")), transformOrigin: "0% 50%" })}><Big size={130} color={C.red}>the giant.</Big></div>
      </Seg>
    </Stage>
  );
};

/* ================= 5. THE SCIATIC NERVE ================= */
export const SSciatic: React.FC = () => {
  const t = useT();
  const a = ST(5), b = BE(5);
  const k2 = s_(70) - 0.2, k3 = s_(73) - 0.2, k4 = s_(77) - 0.2, k5 = s_(80) - 0.2, k6 = s_(82) - 0.2;
  const ever = kv(t, [[wf(80, "turn"), 0], [wf(80, "turn") + 0.8, 24], [s_(81) - 0.4, 24], [s_(81), 0]]);
  const dors = kv(t, [[wf(81, "lift"), 0], [wf(81, "lift") + 0.8, 22]]);
  const plant = kv(t, [[wf(75, "point"), 0], [wf(75, "point") + 0.8, -26], [wf(75, "curl"), -26], [wf(75, "curl") + 0.8, 0]]);
  const drop = kv(t, [[wf(82, "foot", 0), 0], [wf(82, "foot", 0) + 0.8, -30]]);
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={k2}>
        <TallPlate {...POST} x={0} y={0} w={760} h={740} t={t} t0={a} keys={[[a, 1.0, 0.5, 0.2], [wf(69, "piriformis"), 1.6, 0.55, 0.14], [wf(69, "back"), 1.25, 0.55, 0.3]]} tag="GRAY'S 1918 · FIG. 832 · BACK VIEW"
          pins={[
            { t0: s_(68), x: 0.6, y: 0.22, text: "sciatic nerve", dx: 170, dy: 30, hot: true },
            { t0: wf(69, "piriformis"), x: 0.6, y: 0.125, text: "piriformis", dx: 160, dy: -30 },
            { t0: wf(69, "gluteus"), x: 0.33, y: 0.09, text: "gluteus maximus (cut)", dx: -10, dy: -30 },
          ]} />
        <NHead t={t} t0={a} x={820} y={0} k="sci" name="Sciatic nerve" roots="L4 → S3" w={900} />
        <Facts x={820} y={160} w={900} items={[
          { t: wf(68, "largest"), big: "the largest", text: "nerve in the human body", bg: C.red },
          { t: wf(69, "below"), text: "leaves the pelvis BELOW piriformis" },
          { t: wf(69, "back"), text: "runs down the back of the thigh, deep to gluteus maximus", bg: C.forest },
        ]} />
      </Seg>
      <Seg t={t} a={k2} b={k3}>
        <TallPlate {...POST} x={0} y={0} w={620} h={740} t={t} t0={k2} keys={[[k2, 1.35, 0.52, 0.33]]} tag="GRAY'S 1918 · FIG. 832 · HAMSTRINGS"
          pins={[
            { t0: wf(71, "semitendinosus"), x: 0.48, y: 0.36, text: "semitendinosus", dx: -40, dy: -80 },
            { t0: wf(71, "semimembranosus"), x: 0.42, y: 0.34, text: "semimembranosus", dx: -20, dy: 70 },
            { t0: wf(71, "biceps"), x: 0.6, y: 0.38, text: "biceps femoris", dx: 60, dy: 100 },
          ]} />
        <Hdr t={t} t0={s_(70)} x={680} y={0} size={56}>Sciatic → the HAMSTRINGS</Hdr>
        <Col x={680} y={90} gap={10}>
          {([["semitendinosus", "semitendinosus"], ["semimembranosus", "semimembranosus"], ["biceps femoris", "biceps"], ["hamstring part of adductor magnus", "hamstring"]] as [string, string][]).map(([n, w], i) => (
            <RowL key={n} t={t} t0={wf(71, w)} col={NC.sci} n={String(i + 1)} title={n} w={620} size={32} />
          ))}
        </Col>
        <div style={abs(680, 470, { display: "flex", flexDirection: "column", gap: 12 })}>
          <div><Chip t={t} t0={wf(72, "bends")} bg={C.red} size={40}>bends the KNEE</Chip></div>
          <div><Chip t={t} t0={wf(72, "extends")} bg={C.matcha} size={40}>extends the HIP</Chip></div>
        </div>
        <div style={abs(1320, 110, pop(t, s_(70) + 0.3))}>
          <CrossSec t={t} w={460} which="thigh" zones={{ thighPost: s_(70) + 0.3 }} />
        </div>
      </Seg>
      <Seg t={t} a={k3} b={k4}>
        <TallPlate {...POST} x={0} y={0} w={620} h={740} t={t} t0={k3} keys={[[k3, 1.4, 0.55, 0.47], [wf(75, "calf"), 1.0, 0.5, 0.6], [s_(76), 1.5, 0.4, 0.9]]} tag="GRAY'S 1918 · FIG. 832"
          pins={[
            { t0: wf(73, "splits"), t1: wf(75, "calf"), x: 0.53, y: 0.45, text: "the split", dx: -150, dy: -40, hot: true },
            { t0: s_(74), x: 0.52, y: 0.56, text: "tibial nerve", dx: -150, dy: 40, hot: true },
            { t0: wf(75, "deep"), t1: s_(76), x: 0.41, y: 0.76, text: "toe flexors", dx: -110, dy: -60 },
            { t0: wf(76, "plantar"), x: 0.4, y: 0.94, text: "→ sole: plantar nerves", dx: 150, dy: -70 },
          ]} />
        <ViewTag t={t} t0={wf(75, "calf")} x={20} y={680} text="calf muscles removed in this drawing" />
        <Hdr t={t} t0={s_(73)} x={680} y={0} size={52}>Top of the popliteal fossa → splits in 2</Hdr>
        <NHead t={t} t0={s_(74)} x={680} y={90} k="tib" name="Tibial nerve" roots="· branch 1 of the sciatic · straight down" w={720} />
        <Facts x={680} y={250} w={720} items={[
          { t: wf(75, "gastrocnemius"), text: "calf: gastrocnemius + soleus → point the foot DOWN", bg: C.forest },
          { t: wf(75, "curl"), text: "+ deep muscles that curl the toes" },
          { t: s_(76), text: "sole: medial + lateral plantar nerves", bg: C.matcha },
        ]} />
        <div style={abs(1430, 300, pop(t, wf(75, "point")))}>
          <FootSide w={340} ang={plant} />
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.forest, textAlign: "center" }}>plantarflexion</div>
        </div>
      </Seg>
      <Seg t={t} a={k4} b={k5}>
        <TallPlate {...POST} x={0} y={0} w={620} h={740} t={t} t0={k4} keys={[[k4, 1.8, 0.62, 0.52]]} tag="GRAY'S 1918 · FIG. 832"
          pins={[{ t0: s_(77), x: 0.64, y: 0.51, text: "common fibular", dx: -170, dy: 60, hot: true }]} />
        <Note t={t} t0={s_(78)} old="common peroneal" modern="common fibular" x={20} y={20} />
        <NHead t={t} t0={s_(77)} x={680} y={0} k="cf" name="Common fibular nerve" roots="· branch 2 of the sciatic · heads outward" w={760} />
        <Facts x={680} y={160} w={760} items={[
          { t: wf(77, "wraps"), big: "neck of the fibula", text: "it wraps around it", bg: C.forest },
          { t: s_(78), text: "old name: common PERONEAL nerve" },
          { t: s_(79), text: "splits again → superficial + deep", bg: C.matcha },
        ]} />
        <div style={abs(1480, 60, pop(t, s_(77)))}>
          <LegMap t={t} w={300} tags={false} show={["sci", "tib", "cf"]} lit={{ cf: s_(77) }} />
        </div>
      </Seg>
      <Seg t={t} a={k5} b={k6}>
        <TallPlate {...FRONT} x={0} y={0} w={620} h={740} t={t} t0={k5} keys={[[k5, 1.7, 0.4, 0.68]]} tag="GRAY'S 1918 · FIG. 827 · FRONT OF LEG"
          pins={[
            { t0: s_(80), x: 0.37, y: 0.63, text: "superficial fibular", dx: 170, dy: -50, hot: true },
            { t0: s_(81), x: 0.43, y: 0.74, text: "deep fibular", dx: 150, dy: 40, hot: true },
          ]} />
        <Note t={t} t0={s_(80) + 1.0} old="superficial / deep peroneal" x={20} y={20} />
        <Col x={680} y={0} gap={16}>
          <RowL t={t} t0={s_(80)} col={NC.sf} n="S" title="superficial fibular" sub="fibularis longus + brevis → EVERSION" w={720} size={40} />
          <RowL t={t} t0={s_(81)} col={NC.df} n="D" title="deep fibular" sub="tibialis anterior + toe extensors → DORSIFLEXION" w={720} size={40} />
        </Col>
        <div style={abs(700, 330, pop(t, wf(80, "turn")))}>
          <FootFront w={300} ang={ever} />
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.forest, textAlign: "center" }}>eversion · sole turns OUT</div>
        </div>
        <div style={abs(1080, 330, pop(t, wf(81, "lift")))}>
          <FootSide w={340} ang={dors} />
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.forest, textAlign: "center" }}>dorsiflexion · foot UP</div>
        </div>
      </Seg>
      <Seg t={t} a={k6} b={b + 0.1}>
        <ZoomBox x={0} y={0} w={700} h={740} t={t} t0={k6} keys={[[k6, 1.5, 0.78, 0.5]]}
          pins={[{ t0: wf(82, "fibular"), pt: LM_PT.cf, text: "fibular neck", dx: -120, dy: -70, hot: true }]}>
          <LegMap t={t} w={900} tags={false} lit={{ cf: k6 }} show={["sci", "tib", "cf"]} />
        </ZoomBox>
        <Hdr t={t} t0={s_(82)} x={760} y={0} size={56}>Close to the bone</Hdr>
        <Facts x={760} y={100} w={1000} items={[
          { t: wf(82, "injury"), text: "injury at the fibular neck can weaken dorsiflexion", bg: C.forest },
          { t: wf(82, "foot", 0), big: "foot drop", text: "the foot can't be lifted", bg: C.red },
        ]} />
        <div style={abs(1380, 400, pop(t, wf(82, "foot", 0)))}>
          <FootSide w={340} ang={drop} />
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 6. HOW IT ALL CONNECTS ================= */
export const SConnect: React.FC = () => {
  const t = useT();
  const a = ST(6), b = BE(6);
  const k2 = s_(88) - 0.2, k3 = s_(92) - 0.2;
  const zAll = { thighAnt: s_(85), thighMed: s_(86), thighPost: s_(87), legAnt: s_(89), legLat: s_(90), legPost: s_(91), glut: s_(92) };
  return (
    <Stage a={a} b={b}>
      <div style={abs(1290, 0, { ...pop(t, a), width: 510, height: 740, borderRadius: 36, background: C.card, boxShadow: `0 0 0 4px ${C.line}` })}>
        <div style={abs(-10, 40)}><LegMap t={t} w={530} lit={{}} zones={zAll} show={[]} /></div>
      </div>
      <Seg t={t} a={a} b={k2}>
        <div style={abs(0, 0, pop(t, a))}>
          <CrossSec t={t} w={620} which="thigh" zones={{ thighAnt: s_(85), thighMed: s_(86), thighPost: s_(87) }} />
        </div>
        <Hdr t={t} t0={s_(84)} x={660} y={10} size={50}>3 compartments · 3 nerves</Hdr>
        <Col x={660} y={110} gap={18}>
          <RowL t={t} t0={s_(85)} col={NC.fem} n="1" title="front → femoral" w={590} size={40} />
          <RowL t={t} t0={s_(86)} col={NC.obt} n="2" title="inner → obturator" w={590} size={40} />
          <RowL t={t} t0={s_(87)} col={NC.sci} n="3" title="back → sciatic" w={590} size={40} />
        </Col>
      </Seg>
      <Seg t={t} a={k2} b={k3}>
        <div style={abs(0, 0, pop(t, k2))}>
          <CrossSec t={t} w={620} which="leg" zones={{ legAnt: s_(89), legLat: s_(90), legPost: s_(91) }} />
        </div>
        <Hdr t={t} t0={s_(88)} x={660} y={10} size={50}>Below the knee: 3 more</Hdr>
        <Col x={660} y={110} gap={18}>
          <RowL t={t} t0={s_(89)} col={NC.df} n="1" title="front → deep fibular" w={600} size={38} />
          <RowL t={t} t0={s_(90)} col={NC.sf} n="2" title="outer → superficial fibular" w={600} size={38} />
          <RowL t={t} t0={s_(91)} col={NC.tib} n="3" title="back → tibial" w={600} size={38} />
        </Col>
      </Seg>
      <Seg t={t} a={k3} b={b + 0.1}>
        <Col x={0} y={0} gap={18}>
          <RowL t={t} t0={s_(92)} col={NC.ig} n="+" title="buttock → the 2 gluteal nerves" w={1240} size={42} />
        </Col>
        <div style={abs(0, 130, { ...pop(t, s_(93)), width: 1240, background: C.forest, borderRadius: 32, padding: "26px 36px 32px", boxSizing: "border-box" })}>
          <Big size={58} color={C.paper}>Know the <span style={{ color: C.banana }}>compartment</span> → name the <span style={{ color: C.banana }}>nerve</span>.</Big>
        </div>
        <Col x={0} y={380} gap={18}>
          <RowL t={t} t0={s_(94)} col={C.banana} n="L" title="Lumbar plexus" sub="front + inner thigh" w={1240} size={42} />
          <RowL t={t} t0={s_(95)} col="#9FB4E8" n="S" title="Sacral plexus" sub="buttock · back of thigh · almost the entire leg + foot" w={1240} size={42} />
        </Col>
      </Seg>
    </Stage>
  );
};

/* ================= 7. MEMORY TRICKS ================= */
const mini = (x: number, y: number, w: number, h: number, node: React.ReactNode) => (
  <div style={abs(x, y, { width: w, height: h, borderRadius: 32, background: C.card, overflow: "hidden" })}>{node}</div>
);
export const STricks: React.FC = () => {
  const t = useT();
  const a = ST(7), b = BE(7);
  const k2 = s_(101) - 0.2, k3 = s_(106) - 0.2, k4 = s_(109) - 0.2;
  const W1 = ["I", "I", "Get", "Leftovers", "On", "Fridays"];
  const tk1 = [wf(98, "i", 0), wf(98, "i", 1), wf(98, "get"), wf(98, "leftovers"), wf(98, "on"), wf(98, "fridays")];
  const N1: [string, string, number][] = [["Iliohypogastric", "ih", wf(99, "iliohypogastric")], ["Ilioinguinal", "ii", wf(99, "ilioinguinal")], ["Genitofemoral", "gf", wf(99, "genitofemoral")], ["Lateral femoral cutaneous", "lfc", wf(99, "lateral")], ["Obturator", "obt", wf(99, "obturator")], ["Femoral", "fem", wf(99, "femoral", 1)]];
  const cur1 = N1.reduce((acc, x, i) => (t >= x[2] - 0.05 ? i : acc), -1);
  const W3 = ["Some", "Irish", "Sailor", "Pesters", "Polly"];
  const tk3 = W3.map((w) => wf(107, w.toLowerCase()));
  const N3: [string, string, number][] = [["Superior gluteal", "sg", wf(108, "superior")], ["Inferior gluteal", "ig", wf(108, "inferior")], ["Sciatic", "sci", wf(108, "sciatic")], ["Posterior femoral cutaneous", "pfc", wf(108, "posterior")], ["Pudendal", "pud", wf(108, "pudendal")]];
  const cur3 = N3.reduce((acc, x, i) => (t >= x[2] - 0.05 ? i : acc), -1);
  const ever = 22 * (0.5 + 0.5 * Math.sin((t - s_(111)) * 3));
  const dors = 20 * (0.5 + 0.5 * Math.sin((t - s_(111)) * 3 + 1.5));
  const inv = -22 * (0.5 + 0.5 * Math.sin((t - s_(112)) * 3));
  const plan = -24 * (0.5 + 0.5 * Math.sin((t - s_(112)) * 3 + 1.5));
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={k2}>
        <TrickCard t={t} t0={a} n={1} title="Lumbar branches, in order">
          <div style={abs(60, 165, { display: "flex", gap: 22, whiteSpace: "nowrap", width: 1100, fontFamily: FONT, fontWeight: 800, fontSize: 60, color: C.paper })}>
            {W1.map((w, i) => <span key={i} style={{ opacity: ramp(t, tk1[i] - 0.1, tk1[i] + 0.15) }}><FL w={w} on={t >= tk1[i] ? 1 : 0} /></span>)}
          </div>
          <div style={abs(60, 275, { display: "flex", flexDirection: "column", gap: 6 })}>
            {N1.map(([x, k, tt], i) => (
              <div key={x} style={{ ...pop(t, tt), display: "flex", alignItems: "center", gap: 14, fontFamily: FONT, fontWeight: 800, fontSize: 36, color: i === cur1 ? C.banana : C.paper, transformOrigin: "0% 50%" }}>
                <span style={{ width: 26, height: 26, borderRadius: 13, background: NC[k], border: `3px solid ${C.paper}` }} />
                <span><span style={{ color: C.banana, fontSize: 44 }}>{x[0]}</span>{x.slice(1)}</span>
              </div>
            ))}
          </div>
          <div style={abs(60, 650)}><Chip t={t} t0={s_(100)} bg={C.banana} color={C.forest} size={34}>H comes before I → Iliohypogastric first</Chip></div>
          {mini(1180, 40, 560, 660, <div style={abs(-140, -40)}><PlexusMap t={t} w={760} lit={cur1 >= 0 ? { [N1[cur1][1]]: N1[cur1][2] } : { lumbar: a }} /></div>)}
        </TrickCard>
      </Seg>
      <Seg t={t} a={k2} b={k3}>
        <TrickCard t={t} t0={k2} n={2} title="The roots: 2 from 1 · 2 from 2 · 2 from 3">
          <div style={abs(60, 200, { display: "flex", gap: 40 })}>
            {([
              ["from 1 root", ["L1"], [["iliohypogastric", "ih"], ["ilioinguinal", "ii"]], s_(103)],
              ["from 2 roots", ["L1-L2", "L2-L3"], [["genitofemoral", "gf"], ["lat. femoral cutaneous", "lfc"]], s_(104)],
              ["from 3 roots", ["L2-L3-L4"], [["obturator", "obt"], ["femoral", "fem"]], s_(105)],
            ] as [string, string[], [string, string][], number][]).map(([h, roots, ns, tt]) => (
              <div key={h} style={{ ...pop(t, tt), width: 520, background: "rgba(255,255,255,0.07)", border: `3px solid ${t >= tt ? C.banana : "rgba(255,255,255,0.2)"}`, borderRadius: 30, padding: "24px 28px", boxSizing: "border-box", fontFamily: FONT, fontWeight: 800 }}>
                <div style={{ fontSize: 44, color: C.banana }}>{h}</div>
                <div style={{ fontSize: 30, color: C.matchaLight, marginTop: 6 }}>{roots.join(" · ")}</div>
                <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 12 }}>
                  {ns.map(([n, k]) => (
                    <div key={n} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 34, color: C.paper }}>
                      <span style={{ width: 26, height: 26, borderRadius: 13, background: NC[k], border: `3px solid ${C.paper}`, flexShrink: 0 }} />{n}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={abs(60, 560, { display: "flex", gap: 20, fontFamily: FONT, fontWeight: 800, fontSize: 90, color: C.banana, opacity: ramp(t, s_(102), s_(102) + 0.4) })}>2 · 2 · 2 <span style={{ color: C.matchaLight, fontSize: 60, alignSelf: "center" }}>= 6 branches</span></div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={k3} b={k4}>
        <TrickCard t={t} t0={k3} n={3} title="Sacral branches">
          <div style={abs(60, 180, { display: "flex", gap: 24, flexWrap: "wrap", width: 1100, fontFamily: FONT, fontWeight: 800, fontSize: 76, color: C.paper })}>
            {W3.map((w, i) => <span key={w} style={{ opacity: ramp(t, tk3[i] - 0.1, tk3[i] + 0.15) }}><FL w={w} on={t >= tk3[i] ? 1 : 0} /></span>)}
          </div>
          <div style={abs(60, 320, { display: "flex", flexDirection: "column", gap: 10 })}>
            {N3.map(([x, k, tt], i) => (
              <div key={x} style={{ ...pop(t, tt), display: "flex", alignItems: "center", gap: 14, fontFamily: FONT, fontWeight: 800, fontSize: 40, color: i === cur3 ? C.banana : C.paper, transformOrigin: "0% 50%" }}>
                <span style={{ width: 28, height: 28, borderRadius: 14, background: NC[k], border: `3px solid ${C.paper}` }} />
                <span><span style={{ color: C.banana, fontSize: 48 }}>{x[0]}</span>{x.slice(1)}</span>
              </div>
            ))}
          </div>
          {mini(1180, 40, 560, 660, <div style={abs(-150, 80)}><Gate t={t} w={860} lit={cur3 >= 0 ? { [N3[cur3][1]]: N3[cur3][2] } : {}} /></div>)}
        </TrickCard>
      </Seg>
      <Seg t={t} a={k4} b={b + 0.1}>
        <TrickCard t={t} t0={k4} n={4} title="The foot: PED and TIP">
          <div style={abs(60, 190, { ...pop(t, s_(111)), width: 820 })}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 110, color: C.banana, letterSpacing: 6 }}>PED</div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.paper, lineHeight: 1.25 }}>
              <FL w="Peroneal" on={1} /> <FL w="Everts" on={1} /> and <FL w="Dorsiflexes" on={1} />
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.matchaLight, marginTop: 6 }}>common fibular (peroneal) nerve</div>
          </div>
          <div style={abs(940, 190, { ...pop(t, s_(112)), width: 820 })}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 110, color: C.banana, letterSpacing: 6 }}>TIP</div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.paper, lineHeight: 1.25 }}>
              <FL w="Tibial" on={1} /> <FL w="Inverts" on={1} /> and <FL w="Plantarflexes" on={1} />
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.matchaLight, marginTop: 6 }}>tibial nerve</div>
          </div>
          <div style={abs(60, 440, { display: "flex", gap: 30, opacity: ramp(t, s_(111), s_(111) + 0.4) })}>
            <div style={{ background: C.card, borderRadius: 24, padding: 10 }}><FootFront w={270} ang={ever} /></div>
            <div style={{ background: C.card, borderRadius: 24, padding: 10 }}><FootSide w={270} ang={dors} /></div>
          </div>
          <div style={abs(940, 440, { display: "flex", gap: 30, opacity: ramp(t, s_(112), s_(112) + 0.4) })}>
            <div style={{ background: C.card, borderRadius: 24, padding: 10 }}><FootFront w={270} ang={inv} /></div>
            <div style={{ background: C.card, borderRadius: 24, padding: 10 }}><FootSide w={270} ang={plan} /></div>
          </div>
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
  { n: 1, si: 115, q: "Inside which muscle does the lumbar plexus form?", a: "psoas major", visual: (t, r, ans) => <KPlate {...LUMB} x={110} y={0} w={760} a={s_(115) - 0.2} b={s_(117) - 0.2} keys={[[s_(115), 1.0, 0.5, 0.5], [ans, 1.5, 0.6, 0.42]]} labels={r ? [{ x: 0.6, y: 0.36, text: "psoas major", t: ans, side: "l", hot: true }] : []} /> },
  { n: 2, si: 117, q: "Which nerve supplies the adductors of the inner thigh?", a: "obturator nerve (L2–L4)", visual: (t, r, ans) => <QV t={t} t0={s_(117)} tag="THIGH · CROSS-SECTION"><div style={abs(200, 60)}><CrossSec t={t} w={620} which="thigh" title={false} zones={r ? { thighMed: ans } : {}} /></div></QV> },
  { n: 3, si: 119, q: "Which nerve leaves the pelvis ABOVE the piriformis?", a: "superior gluteal nerve", visual: (t, r, ans) => <QV t={t} t0={s_(119)} tag="GLUTEAL REGION · SCHEMATIC"><div style={abs(50, 60)}><Gate t={t} w={900} lit={r ? { sg: ans } : {}} /></div></QV> },
  { n: 4, si: 121, q: "The sciatic nerve divides into which 2 nerves?", a: "tibial + common fibular", visual: (t, r, ans) => <TallPlate {...POST} x={0} y={0} w={1000} h={740} t={t} t0={s_(121) - 0.2} keys={[[s_(121), 1.15, 0.55, 0.5]]} tag="GRAY'S 1918 · FIG. 832" pins={r ? [{ t0: ans, x: 0.52, y: 0.55, text: "tibial", dx: -150, dy: 30, hot: true }, { t0: ans + 0.4, x: 0.64, y: 0.51, text: "common fibular", dx: 150, dy: 60, hot: true }] : []} /> },
  { n: 5, si: 123, q: "Which nerve wraps around the neck of the fibula?", a: "common fibular (peroneal)", visual: (t, r, ans) => <QV t={t} t0={s_(123)} tag="RIGHT LOWER LIMB · SCHEMATIC"><div style={abs(50, 30)}><LegMap t={t} w={900} tags={false} show={["sci", "tib", "cf"]} lit={r ? { cf: ans } : {}} /></div></QV> },
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
              <div style={abs(50, 110, { width: 660, fontFamily: FONT, fontWeight: 800, fontSize: 56, lineHeight: 1.12, color: C.paper })}>{q.q}</div>
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
    ["Lumbar", "T12–L4 · inside psoas major · 6 branches", Math.max(a, s_(126)), C.banana],
    ["Order", "I, I Get Leftovers On Fridays", s_(127), NC.ih],
    ["Thigh", "femoral = front · obturator = inner", s_(128), NC.fem],
    ["Sacral", "L4–S4 · on piriformis · Some Irish Sailor Pesters Polly", s_(129), "#9FB4E8"],
    ["Sciatic", "largest nerve → tibial + common fibular", s_(131), NC.sci],
    ["Foot", "PED (peroneal) · TIP (tibial)", s_(132), NC.tib],
  ];
  const ot = s_(133) - 0.2;
  const outro = ramp(t, ot, ot + 0.5);
  const lit: Lit = t >= s_(131) ? { sci: s_(131) } : t >= s_(129) ? { sacral: s_(129) } : t >= s_(128) ? { fem: s_(128), obt: s_(128) } : { lumbar: a };
  return (
    <Stage a={a} b={END - 0.3}>
      {outro < 1 && (
        <div style={abs(0, 0, { width: 1800, height: 740, borderRadius: 44, background: C.forest })}>
          <div style={abs(70, 40, { fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 8, color: C.banana })}>RECAP</div>
          <div style={abs(70, 105, { display: "flex", flexDirection: "column", gap: 18 })}>
            {items.map(([h, s, tt, col]) => (
              <div key={h} style={{ ...pop(t, tt), display: "flex", alignItems: "center", gap: 24, fontFamily: FONT, fontWeight: 800, transformOrigin: "0% 50%" }}>
                <div style={{ width: 54, height: 54, borderRadius: 27, background: col, border: `4px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: C.forest, flexShrink: 0 }}>✓</div>
                <div style={{ width: 190, fontSize: 40, color: C.paper, flexShrink: 0 }}>{h}</div>
                <div style={{ fontSize: 32, color: C.matchaLight, width: 900, lineHeight: 1.15 }}>{s}</div>
              </div>
            ))}
          </div>
          <div style={abs(1250, 50, { opacity: ramp(t, a, a + 0.5), width: 500, height: 640, borderRadius: 32, background: C.card, overflow: "hidden" })}>
            <div style={abs(-40, 20)}><PlexusMap t={t} w={580} lit={lit} /></div>
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
              <div style={{ background: C.red, color: C.paper, borderRadius: 50, padding: "18px 54px 22px", fontSize: 54, letterSpacing: 3, transform: `scale(${1 + 0.05 * Math.max(0, Math.sin((t - ot) * 5))})`, opacity: ramp(t, wf(134, "subscribe"), wf(134, "subscribe") + 0.3) }}>SUBSCRIBE</div>
              <div style={{ fontSize: 34, color: C.matchaLight, opacity: ramp(t, wf(133, "study"), wf(133, "study") + 0.3) }}>study cards: bookplume.com</div>
            </div>
            <div style={{ marginTop: 40, background: C.paper, color: C.forest, borderRadius: 24, padding: "16px 30px 20px", fontSize: 38, opacity: ramp(t, s_(135), s_(135) + 0.4), width: "fit-content" }}>Which leg nerve do you always mix up?</div>
          </div>
        </div>
      )}
    </Stage>
  );
};
