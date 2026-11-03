import React from "react";
import { C, FONT, ramp, useT } from "./kit";
import { Facts, Stage, LogoMark } from "./Chrome16";
import { EyeSection, RetinaCells, EyeFront, EyeLids, EYE_PT, EF_PT, EL_PT, MCOL, Lit } from "./IllusEye";
import { s_, e_, wf, ST, BE, abs, pop, Big, Mk, Seg, Note, Chip, ViewTag, Tag, Panel, KPlate, TrickCard, FL, StudyCard } from "./EyeKit";
import { END } from "./timeline";

/* ---------- plates (Gray's Anatomy 1918, public domain) ---------- */
const P = (f: string, w: number, h: number) => ({ src: `plates/${f}.png`, aspect: w / h });
const SEC = P("eye869", 1882, 1505);
const CHO = P("choroid872", 1082, 1306);
const FUN = P("fundus879", 1048, 1056);
const ORB = P("orbit889", 1555, 941);
const RING = P("ring890", 1442, 1371);

/* ---------- camera box for our own diagrams ---------- */
type CK = [number, number, number, number]; // time, scale, fx, fy (fractions of the content)
type PinS = { t0: number; t1?: number; pt: [number, number]; text: string; dx?: number; dy?: number; hot?: boolean; size?: number; col?: string };
const ZoomBox: React.FC<{ x: number; y: number; w: number; h: number; cw: number; ch: number; keys: CK[]; t: number; t0: number; bg?: string; pins?: PinS[]; children: React.ReactNode }> = ({ x, y, w, h, cw, ch, keys, t, t0, bg = C.card, pins = [], children }) => {
  let cur = 0;
  for (let k = 0; k < keys.length; k++) if (t >= keys[k][0]) cur = k;
  const pv = keys[Math.max(0, cur - 1)], nw = keys[cur];
  const e = cur === 0 ? 1 : ramp(t, nw[0] - 0.2, nw[0] + 1.2);
  const s = (pv[1] + (nw[1] - pv[1]) * e) * (1 + 0.025 * ramp(t, nw[0], nw[0] + 8));
  const fx = pv[2] + (nw[2] - pv[2]) * e, fy = pv[3] + (nw[3] - pv[3]) * e;
  const base = Math.min(w / cw, h / ch);
  const S = base * s;
  let tx = w / 2 - fx * cw * S, ty = h / 2 - fy * ch * S;
  // clamp so the content covers the box when zoomed in
  if (cw * S >= w) tx = Math.min(0, Math.max(w - cw * S, tx)); else tx = (w - cw * S) / 2;
  if (ch * S >= h) ty = Math.min(0, Math.max(h - ch * S, ty)); else ty = (h - ch * S) / 2;
  return (
    <div style={abs(x, y, { width: w, height: h, borderRadius: 36, overflow: "hidden", background: bg, boxShadow: `0 0 0 4px ${C.line}, 0 18px 40px rgba(31,42,20,0.10)`, ...pop(t, t0, 0.35) })}>
      <div style={{ position: "absolute", left: tx, top: ty, width: cw, height: ch, transform: `scale(${S})`, transformOrigin: "0 0" }}>{children}</div>
      {pins.map((p, i) => <Tag key={i} t={t} t0={p.t0} t1={p.t1} x={tx} y={ty} w={cw * S} vbw={cw} pt={p.pt} text={p.text} dx={p.dx} dy={p.dy} hot={p.hot} size={p.size ?? 30} col={p.col} />)}
    </div>
  );
};
/** label pinned inside a ZoomBox's content coordinates (counter-scaled by the caller if needed) */
const Pin: React.FC<{ t: number; t0: number; t1?: number; pt: [number, number]; k: number; text: string; dx?: number; dy?: number; hot?: boolean; size?: number; col?: string }> = ({ t, t0, t1, pt, k, text, dx = 0, dy = 0, hot, size = 30, col }) => (
  <Tag t={t} t0={t0} t1={t1} x={0} y={0} w={900 * k} vbw={900} pt={pt} text={text} dx={dx} dy={dy} hot={hot} size={size} col={col} />
);
const Ring: React.FC<{ t: number; t0: number; t1?: number; x: number; y: number; r: number; col?: string }> = ({ t, t0, t1, x, y, r, col = C.banana }) => {
  const p = ramp(t, t0, t0 + 0.3) * (t1 === undefined ? 1 : 1 - ramp(t, t1, t1 + 0.3));
  if (p <= 0) return null;
  return <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: r, border: `${Math.max(4, r * 0.08)}px solid ${col}`, boxShadow: `0 0 0 3px ${C.forest}`, opacity: p, transform: `scale(${1.25 - 0.25 * p})` }} />;
};
const GroupRow: React.FC<{ t: number; t0: number; col: string; title: string; sub: string; w?: number }> = ({ t, t0, col, title, sub, w = 680 }) => (
  <div style={{ ...pop(t, t0), width: w, display: "flex", alignItems: "center", gap: 18, background: C.card, border: `3px solid ${C.line}`, borderRadius: 24, padding: "12px 22px", fontFamily: FONT, fontWeight: 800, transformOrigin: "0% 50%", boxSizing: "border-box" }}>
    <div style={{ width: 50, height: 50, borderRadius: 25, background: col, border: `3px solid ${C.forest}`, flexShrink: 0 }} />
    <div>
      <div style={{ fontSize: 38, color: C.forest, lineHeight: 1.1 }}>{title}</div>
      <div style={{ fontSize: 27, color: C.matcha, lineHeight: 1.15, marginTop: 2 }}>{sub}</div>
    </div>
  </div>
);
const win = (a: number, b: number) => ({ a, b });
const litOf = (ids: string[], v: number | { a: number; b: number }): Lit => Object.fromEntries(ids.map((i) => [i, v]));

/* ================= INTRO ================= */
export const SIntro: React.FC = () => {
  const t = useT();
  const m = s_(3) - 0.2;
  return (
    <Stage a={-1} b={BE(0)}>
      <Seg t={t} a={-1} b={m}>
        <Panel x={0} y={0} w={1000} h={740} t={t} t0={0}>
          <div style={abs(50, 40)}><EyeSection t={t} w={900} light={ramp(t, 0.4, 3.2)} lit={{ retina: win(wf(0, "landing"), wf(0, "brain")), lens: win(wf(2, "lens"), m), ant: win(wf(2, "fluids"), m), vit: win(wf(2, "fluids"), m), sclera: win(wf(2, "layers"), wf(2, "fluids")), choroid: win(wf(2, "layers"), wf(2, "fluids")) }} dim={0.4} /></div>
          <ViewTag t={t} t0={0.4} x={24} y={690} text="RIGHT EYE · HORIZONTAL SECTION · LIGHT ENTERS FROM THE LEFT" />
        </Panel>
        <div style={abs(1060, 0, { width: 740, ...pop(t, 0.2) })}>
          <Big size={96}><Mk p={ramp(t, 0.6, 1.6)}>Eye Anatomy</Mk></Big>
          <Big size={96}><Mk p={ramp(t, 1.2, 2.2)}>Made Easy</Mk></Big>
          <Big size={44} color={C.matcha} style={{ marginTop: 10 }}>learn it in about 10 minutes</Big>
        </div>
        <div style={abs(1060, 330, { display: "flex", flexDirection: "column", gap: 18 })}>
          <div><Chip t={t} t0={wf(1, "exam")} bg={C.forest} size={38}>on the exam: name it + know its job</Chip></div>
          <div style={{ display: "flex", gap: 14 }}>
            <Chip t={t} t0={wf(2, "three")} bg={C.matcha} size={42}>3 layers</Chip>
            <Chip t={t} t0={wf(2, "two")} bg="#3F9BB8" size={42}>2 fluids</Chip>
            <Chip t={t} t0={wf(2, "one")} bg={C.banana} color={C.forest} size={42}>1 lens</Chip>
          </div>
        </div>
      </Seg>
      <Seg t={t} a={m} b={BE(0) + 0.1}>
        <KPlate {...SEC} x={0} y={0} w={925} a={m} b={BE(0)} keys={[[m, 1.0, 0.5, 0.5], [s_(4), 1.08, 0.5, 0.4]]} />
        <ViewTag t={t} t0={m + 0.3} x={20} y={20} text="GRAY'S ANATOMY 1918 · FIG. 869" />
        <div style={abs(980, 0, { width: 820, display: "flex", gap: 12, flexWrap: "wrap" })}>
          {["nursing school", "med school", "A&P class"].map((x, i) => (
            <Chip key={x} t={t} t0={[wf(3, "nursing"), wf(3, "med"), wf(3, "class")][i]} bg={C.card} color={C.forest} size={32}>{x}</Chip>
          ))}
        </div>
        <div style={abs(980, 90)}><Chip t={t} t0={s_(4)} bg={C.forest} size={42}>In about 10 minutes:</Chip></div>
        <div style={abs(980, 180, { display: "flex", flexDirection: "column", gap: 12 })}>
          {([
            ["the 3 layers of the eye", wf(4, "three"), C.matcha],
            ["the retina", wf(4, "retina"), "#E9A23B"],
            ["the lens, chambers + fluids", wf(4, "lens"), "#7FB6C7"],
            ["the 6 muscles that move the eye", wf(4, "six"), C.red],
          ] as [string, number, string][]).map(([txt, tt, col]) => (
            <div key={txt} style={{ ...pop(t, tt), display: "flex", alignItems: "center", gap: 18, background: C.card, border: `3px solid ${C.line}`, borderRadius: 24, padding: "10px 22px", fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.forest, transformOrigin: "0% 50%", width: 800, boxSizing: "border-box" }}>
              <div style={{ width: 46, height: 46, borderRadius: 23, background: col, border: `3px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>✓</div>
              {txt}
            </div>
          ))}
        </div>
        <div style={abs(980, 620)}><Chip t={t} t0={wf(5, "five")} bg={C.banana} color={C.forest} size={40}>+ 5-question quiz at the end</Chip></div>
      </Seg>
    </Stage>
  );
};

/* ================= 1. THE BIG PICTURE ================= */
export const SBig: React.FC = () => {
  const t = useT();
  const a = ST(1), b = BE(1), m = s_(10) - 0.2;
  const k = 900 / 900;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={m}>
        <Panel x={0} y={0} w={1000} h={740} t={t} t0={a}>
          <div style={abs(50, 110)}><EyeLids t={t} w={900} lit={{ gland: win(wf(8, "lacrimal"), s_(9)), duct: win(wf(8, "nose"), s_(9)), conj: s_(9) }} tears={ramp(t, wf(8, "drain"), wf(8, "drain") + 0.6) * (1 - ramp(t, s_(9), s_(9) + 0.5))} /></div>
          <Tag t={t} t0={wf(8, "lacrimal")} x={50} y={110} w={900} vbw={900} pt={EL_PT.gland} text="lacrimal gland" dx={170} dy={-80} hot />
          <Tag t={t} t0={wf(8, "inner")} x={50} y={110} w={900} vbw={900} pt={EL_PT.corner} text="inner corner" dx={-10} dy={-170} />
          <Tag t={t} t0={wf(9, "conjunctiva")} x={50} y={110} w={900} vbw={900} pt={EL_PT.conj} text="conjunctiva" dx={-120} dy={250} hot />
          <ViewTag t={t} t0={a + 0.3} x={24} y={24} text="RIGHT EYE · FRONT VIEW" />
          <ViewTag t={t} t0={a + 0.6} x={24} y={690} text="OUTER SIDE ←  · →  NOSE SIDE" />
        </Panel>
        <Facts items={[
          { t: wf(7, "orbit"), text: "Sits in the bony orbit — a cone-shaped socket that protects it", big: "Orbit" },
          { t: wf(8, "lacrimal"), text: "Lacrimal gland: above + to the outer side · makes tears", bg: C.forest },
          { t: wf(8, "drain"), text: "Tears drain to the inner corner → into the nose" },
          { t: wf(9, "conjunctiva"), text: "Conjunctiva: lines the lids + covers the white of the eye", bg: C.matcha },
        ]} />
      </Seg>
      <Seg t={t} a={m} b={b + 0.1}>
        <Panel x={0} y={0} w={1000} h={740} t={t} t0={m}>
          <div style={abs(50, 20)}><EyeSection t={t} w={900} layers={ramp(t, s_(10), s_(10) + 0.5) * (1 - ramp(t, s_(11), s_(11) + 0.4))} lit={{
            ...litOf(["sclera", "cornea"], win(wf(11, "outer"), wf(11, "middle"))),
            ...litOf(["choroid", "ciliary", "iris"], win(wf(11, "middle"), wf(11, "inner"))),
            retina: win(wf(11, "inner"), s_(12)),
            lens: win(wf(12, "lens"), wf(12, "two")), ant: win(wf(12, "aqueous"), s_(13)), post: win(wf(12, "aqueous"), s_(13)), vit: win(wf(12, "vitreous"), s_(13)),
            nerve: win(s_(13), s_(14)), disc: win(s_(13), s_(14)),
          }} /></div>
          <Pin t={t} t0={wf(11, "outer")} t1={wf(11, "middle")} pt={[EYE_PT.sclera[0] + 50, EYE_PT.sclera[1] + 20]} k={k} text="fibrous layer" dx={60} dy={-60} hot />
          <Pin t={t} t0={wf(11, "middle")} t1={wf(11, "inner")} pt={[EYE_PT.choroid[0] + 50, EYE_PT.choroid[1] + 20]} k={k} text="vascular layer" dx={40} dy={-60} hot />
          <Pin t={t} t0={wf(11, "inner")} t1={s_(12)} pt={[EYE_PT.retina[0] + 50, EYE_PT.retina[1] + 20]} k={k} text="neural layer" dx={30} dy={-60} hot />
          <Pin t={t} t0={wf(12, "lens")} t1={s_(13)} pt={[EYE_PT.lens[0] + 50, EYE_PT.lens[1] + 20]} k={k} text="lens" dx={60} dy={140} />
          <Pin t={t} t0={wf(12, "aqueous")} t1={s_(13)} pt={[EYE_PT.ant[0] + 50, EYE_PT.ant[1] + 20]} k={k} text="aqueous humor" dx={-10} dy={240} col="#BFE3EE" />
          <Pin t={t} t0={wf(12, "vitreous")} t1={s_(13)} pt={[EYE_PT.vit[0] + 50, EYE_PT.vit[1] + 20]} k={k} text="vitreous humor" dx={0} dy={0} col="#DDEBCB" />
          <Pin t={t} t0={s_(13)} t1={s_(14)} pt={[EYE_PT.nerve[0] + 50, EYE_PT.nerve[1] + 20]} k={k} text="optic nerve → brain" dx={-60} dy={90} hot />
        </Panel>
        <Facts items={[
          { t: s_(10), text: "The wall has 3 layers", big: "3", bg: C.forest },
          { t: wf(11, "outer"), text: "outer · FIBROUS  →  middle · VASCULAR  →  inner · NEURAL" },
          { t: s_(12), text: "Inside: the lens + 2 fluids — aqueous in front, vitreous behind", bg: "#3F9BB8" },
          { t: s_(13), text: "Optic nerve: carries the signal to the brain" },
          { t: s_(14), text: "+ 6 small muscles on the outside aim the eye", bg: C.red },
        ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 2. THE OUTER LAYER ================= */
export const SOuter: React.FC = () => {
  const t = useT();
  const a = ST(2), b = BE(2), m = s_(21) - 0.2;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={m}>
        <KPlate {...SEC} x={0} y={0} w={925} a={a} b={m} keys={[[a, 1.0, 0.5, 0.5], [s_(17), 1.5, 0.72, 0.6], [s_(19), 1.25, 0.5, 0.45], [s_(20), 1.7, 0.55, 0.85]]}
          labels={[
            { x: 0.80, y: 0.50, text: "sclera", t: wf(17, "sclera"), side: "l", hot: true },
            { x: 0.62, y: 0.86, text: "optic nerve", t: wf(20, "optic"), side: "l", hot: true },
            { x: 0.12, y: 0.40, text: "lateral rectus", t: wf(19, "muscles"), side: "r" },
            { x: 0.84, y: 0.44, text: "medial rectus", t: wf(19, "muscles") + 0.3, side: "l" },
          ]} />
        <ViewTag t={t} t0={a + 0.3} x={20} y={20} text="GRAY'S 1918 · FIG. 869 · CORNEA AT THE TOP" />
        <Note t={t} t0={wf(19, "muscles") + 0.6} old="Rectus lateralis / medialis" modern="lateral / medial rectus" x={20} y={680} />
        <Facts items={[
          { t: s_(16), text: "Fibrous layer = sclera + cornea", bg: C.forest },
          { t: s_(17), text: "Sclera = the white of the eye · tough, dense connective tissue", big: "Sclera" },
          { t: wf(18, "five"), text: "covers about 5/6 of the eyeball", big: "5/6", bg: C.matcha },
          { t: s_(19), text: "keeps the eye's shape · the eye muscles attach to it" },
          { t: s_(20), text: "the optic nerve passes through it at the back", bg: "#E9A23B" },
        ]} />
      </Seg>
      <Seg t={t} a={m} b={b + 0.1}>
        <ZoomBox pins={[{ t0: wf(21, "cornea"), pt: EYE_PT.front, dx: 60, dy: -150, size: 26, hot: true, text: "cornea" }]} t={t} t0={m} x={0} y={0} w={1000} h={740} cw={900} ch={700} keys={[[m, 1.0, 0.5, 0.5], [s_(22), 1.75, 0.3, 0.5], [s_(24), 1.0, 0.5, 0.5]]}>
          <EyeSection t={t} w={900} lit={{ cornea: wf(21, "cornea"), ...(t > s_(25) ? { lens: wf(25, "lens") } : {}), ...(t > s_(25) ? { fovea: wf(25, "retina"), retina: wf(25, "retina") } : {}) }} light={ramp(t, wf(24, "light"), wf(24, "light") + 3.2)} />
        </ZoomBox>
        <Facts items={[
          { t: s_(21), text: "In front, the sclera continues into the cornea" },
          { t: s_(22), text: "Cornea = the clear window at the front", big: "Cornea", bg: "#3F9BB8" },
          { t: wf(23, "front"), text: "bulges like a dome · covers the front 1/6", big: "1/6" },
          { t: s_(24), text: "light enters here first · the cornea BENDS it", bg: C.forest },
          { t: s_(25), text: "cornea + lens focus light onto the retina", bg: C.matcha },
        ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 3. THE MIDDLE LAYER ================= */
const PupilDemo: React.FC<{ t: number; t0: number; bright: number; dim: number }> = ({ t, t0, bright, dim }) => {
  const r1 = 26 - 10 * ramp(t, bright, bright + 0.8), r2 = 26 + 22 * ramp(t, dim, dim + 0.8);
  const one = (r: number, label: string, sun: boolean, tt: number) => (
    <div style={{ ...pop(t, tt), display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{ width: 300, height: 220, borderRadius: 28, background: sun ? "#FFF3B8" : "#2C3A2A", display: "flex", alignItems: "center", justifyContent: "center", border: `3px solid ${C.line}` }}>
        <svg width={200} height={200} viewBox="0 0 200 200">
          <circle cx={100} cy={100} r={92} fill={C.paper} stroke={C.forest} strokeWidth={4} />
          <circle cx={100} cy={100} r={66} fill="#6F8F3A" stroke={C.forest} strokeWidth={3} />
          <circle cx={100} cy={100} r={r} fill={C.forest} />
          <circle cx={92} cy={90} r={6} fill={C.paper} />
        </svg>
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.forest }}>{label}</div>
    </div>
  );
  return (
    <div style={abs(1100, 380, { display: "flex", gap: 40, opacity: ramp(t, t0, t0 + 0.4) })}>
      {one(r1, "bright → constricts", true, bright - 0.3)}
      {one(r2, "dim → dilates", false, dim - 0.3)}
    </div>
  );
};
export const SMiddle: React.FC = () => {
  const t = useT();
  const a = ST(3), b = BE(3), m = s_(31) - 0.2;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={m}>
        <KPlate {...CHO} x={0} y={0} w={612} a={a} b={m} keys={[[a, 1.0, 0.5, 0.5], [s_(28), 1.35, 0.5, 0.62], [s_(30), 1.15, 0.5, 0.5]]}
          labels={[
            { x: 0.16, y: 0.60, text: "choroid", t: wf(27, "choroid"), side: "r", hot: true },
            { x: 0.80, y: 0.22, text: "ciliary body", t: wf(27, "ciliary"), side: "l" },
            { x: 0.60, y: 0.10, text: "iris", t: wf(27, "iris"), side: "r" },
          ]} />
        <ViewTag t={t} t0={a + 0.3} x={20} y={20} text="GRAY'S 1918 · FIG. 872 · SCLERA PARTLY REMOVED" />
        <div style={abs(670, 20, { width: 520, display: "flex", flexDirection: "column", gap: 14 })}>
          <div><Chip t={t} t0={wf(27, "uvea")} bg={C.forest} size={36}>vascular layer = uvea</Chip></div>
          {([["choroid", wf(27, "choroid"), "#9C4A3C"], ["ciliary body", wf(27, "ciliary"), "#D9735F"], ["iris", wf(27, "iris"), "#6F8F3A"]] as [string, number, string][]).map(([x, tt, col], i) => (
            <div key={x} style={{ ...pop(t, tt), display: "flex", alignItems: "center", gap: 14, fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest, transformOrigin: "0% 50%" }}>
              <div style={{ width: 54, height: 54, borderRadius: 27, background: col, border: `3px solid ${C.forest}`, color: C.paper, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>{i + 1}</div>{x}
            </div>
          ))}
        </div>
        <Note t={t} t0={s_(30)} old="“a dark brown or chocolate color”" x={670} y={640} />
        <Facts x={1230} y={20} w={570} items={[
          { t: s_(28), text: "Choroid: lines the back, between sclera + retina", bg: C.forest },
          { t: s_(29), text: "packed with blood vessels → feeds the outer retina", bg: "#9C4A3C" },
        ]} />
      </Seg>
      <Seg t={t} a={m} b={b + 0.1}>
        <ZoomBox pins={[{ t0: wf(31, "ciliary"), t1: s_(35), pt: EYE_PT.ciliary, dx: 110, dy: -50, size: 28, hot: true, text: "ciliary body" }, { t0: wf(33, "lens"), t1: s_(34), pt: EYE_PT.lens, dx: 110, dy: 90, size: 26, text: "lens changes shape" }, { t0: wf(34, "aqueous"), t1: s_(35), pt: EYE_PT.post, dx: 120, dy: 30, size: 26, text: "aqueous humor" }, { t0: wf(35, "iris"), pt: EYE_PT.iris, dx: -80, dy: -60, size: 28, hot: true, text: "iris" }, { t0: wf(36, "pupil"), pt: EYE_PT.pupil, dx: -110, dy: 70, size: 26, text: "pupil (a hole)" }]} t={t} t0={m} x={0} y={0} w={1000} h={740} cw={900} ch={700} keys={[[m, 1.2, 0.42, 0.45], [s_(33), 2.0, 0.34, 0.33], [s_(35), 1.8, 0.3, 0.45], [s_(37), 1.4, 0.33, 0.5]]}>
          <EyeSection t={t} w={900} accom={ramp(t, wf(33, "changes"), wf(33, "changes") + 0.8) * (1 - ramp(t, s_(34), s_(34) + 0.8))} flow={ramp(t, wf(34, "aqueous"), wf(34, "aqueous") + 0.5) * (1 - ramp(t, s_(35), s_(35) + 0.4))}
            lit={{ ciliary: win(s_(31), s_(35)), lens: win(wf(33, "lens"), s_(34)), iris: win(s_(35), END), pupil: wf(36, "pupil") }} />
        </ZoomBox>
        <Facts y={20} items={t < s_(37) ? [
          { t: s_(31), text: "Ciliary body: a ring of tissue around the lens", bg: "#D9735F" },
          { t: wf(33, "ciliary"), text: "job 1 · ciliary muscle changes the lens shape → focus" },
          { t: wf(34, "processes"), text: "job 2 · ciliary processes make the aqueous humor", bg: "#3F9BB8" },
          { t: s_(35), text: "Iris = the colored part · pupil = the hole in its center", bg: "#6F8F3A" },
        ] : [
          { t: s_(37), text: "Iris = smooth muscle · autonomic control · sets pupil size", bg: C.forest },
        ]} />
        {t >= s_(37) - 0.2 && <PupilDemo t={t} t0={s_(37) - 0.2} bright={wf(38, "constricts")} dim={wf(38, "dilates")} />}
      </Seg>
    </Stage>
  );
};

/* ================= 4. THE INNER LAYER ================= */
export const SInner: React.FC = () => {
  const t = useT();
  const a = ST(4), b = BE(4), m = s_(47) - 0.2;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={m}>
        <Panel x={0} y={0} w={1000} h={740} t={t} t0={a}>
          <div style={abs(50, 70)}><RetinaCells t={t} w={900} light={ramp(t, wf(46, "light"), wf(46, "light") + 2.2)} signal={ramp(t, wf(45, "photoreceptors"), wf(45, "ganglion") + 0.6) * (1 - ramp(t, s_(46), s_(46) + 0.3))}
            lit={{ pigment: win(wf(41, "outer"), wf(41, "inner")), ...litOf(["rods", "cones", "bipolar", "ganglion"], win(wf(41, "inner"), s_(42))), ...litOf(["rods", "cones"], win(s_(42), s_(43))), rods: win(s_(43), s_(44)), cones: win(s_(44), s_(45)), bipolar: win(wf(45, "bipolar"), s_(46)), ganglion: win(wf(45, "ganglion"), s_(46)) }} /></div>
          <ViewTag t={t} t0={a + 0.3} x={24} y={24} text="RETINA · ZOOMED IN · LIGHT COMES FROM THE TOP" />
          <Tag t={t} t0={s_(43)} t1={s_(44)} x={50} y={70} w={900} vbw={900} pt={[290, 400]} text="rod" dx={0} dy={-90} hot />
          <Tag t={t} t0={s_(44)} t1={s_(45)} x={50} y={70} w={900} vbw={900} pt={[190, 400]} text="cone" dx={0} dy={-110} hot />
          <Tag t={t} t0={wf(45, "bipolar")} t1={s_(46)} x={50} y={70} w={900} vbw={900} pt={[340, 250]} text="bipolar cell" dx={110} dy={0} />
          <Tag t={t} t0={wf(45, "ganglion")} t1={s_(46)} x={50} y={70} w={900} vbw={900} pt={[240, 132]} text="ganglion cell" dx={-10} dy={-80} />
        </Panel>
        <Facts items={[
          { t: s_(40), text: "Retina = where seeing actually happens", big: "Retina", bg: "#E9A23B" },
          { t: s_(41), text: "2 layers: outer PIGMENTED (on the choroid) + inner NEURAL" },
          { t: s_(43), text: "RODS → dim light · night vision · no color", bg: C.matcha },
          { t: s_(44), text: "CONES → bright light · color vision", bg: "#E9A23B" },
          { t: s_(45), text: "photoreceptor → bipolar cell → ganglion cell", bg: C.forest },
          { t: s_(46), text: "light passes the inner cells first, then reaches the photoreceptors" },
        ]} />
      </Seg>
      <Seg t={t} a={m} b={b + 0.1}>
        <KPlate {...FUN} x={0} y={0} w={740} a={m} b={b} keys={[[m, 1.0, 0.5, 0.5], [s_(48), 1.6, 0.5, 0.5], [s_(50), 1.6, 0.36, 0.46], [s_(51), 1.3, 0.42, 0.48]]}
          labels={[
            { x: 0.50, y: 0.505, text: "macula", t: wf(48, "macula"), side: "r", hot: true, t1: s_(49) },
            { x: 0.50, y: 0.505, text: "fovea · sharpest vision", t: wf(49, "fovea"), side: "r", hot: true, t1: s_(50) },
            { x: 0.335, y: 0.455, text: "optic disc", t: wf(50, "optic"), side: "r", hot: true },
            { x: 0.335, y: 0.455, text: "blind spot", t: wf(51, "blind"), side: "l", col: "#E8796B" },
          ]} />
        <ViewTag t={t} t0={m + 0.3} x={20} y={20} text="GRAY'S 1918 · FIG. 879 · BACK OF THE LEFT EYE" />
        <Note t={t} t0={wf(48, "macula") + 0.5} old="macula lutea (“yellow spot”)" x={20} y={680} />
        <Facts x={800} w={980} items={[
          { t: s_(47), text: "2 spots that come up on every exam", bg: C.forest },
          { t: s_(48), text: "MACULA: small yellowish area at the center of the retina", bg: "#E9A23B" },
          { t: s_(49), text: "FOVEA: a tiny pit in the macula, packed with photoreceptors → sharpest vision" },
          { t: s_(50), text: "OPTIC DISC: ganglion-cell axons leave as the optic nerve", bg: C.matcha },
          { t: s_(51), text: "no photoreceptors at the optic disc = your BLIND SPOT", bg: C.red },
        ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 5. LENS, CHAMBERS AND FLUIDS ================= */
export const SLens: React.FC = () => {
  const t = useT();
  const a = ST(5), b = BE(5), m1 = s_(57) - 0.2, m2 = s_(61) - 0.2, m3 = s_(66) - 0.2;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={m1}>
        <ZoomBox pins={[{ t0: wf(53, "lens"), pt: EYE_PT.lens, dx: 90, dy: 80, size: 28, hot: true, text: "lens" }, { t0: wf(54, "zonular"), t1: s_(56), pt: EYE_PT.zon, dx: 120, dy: -30, size: 26, text: "zonular fibers" }]} t={t} t0={a} x={0} y={0} w={1000} h={740} cw={900} ch={700} keys={[[a, 1.0, 0.5, 0.5], [s_(53), 1.9, 0.33, 0.5], [s_(54), 1.8, 0.35, 0.36]]}>
          <EyeSection t={t} w={900} accom={ramp(t, wf(55, "contracts"), wf(55, "contracts") + 0.8) * (1 - ramp(t, wf(55, "near") + 0.6, wf(55, "far") + 0.6))} cloud={ramp(t, wf(56, "cloudy"), wf(56, "cloudy") + 0.8) * (1 - ramp(t, e_(56), e_(56) + 0.3))}
            lit={{ lens: s_(53), zon: win(wf(54, "suspensory"), s_(56)), ciliary: win(wf(54, "ciliary"), s_(56)) }} />
        </ZoomBox>
        <Facts items={[
          { t: s_(53), text: "Lens: just behind the iris + pupil", big: "Lens", bg: C.forest },
          { t: s_(54), text: "clear + flexible · held by suspensory ligaments (zonular fibers) to the ciliary body" },
          { t: s_(55), text: "ciliary muscle contracts → lens changes shape → focus near / far", bg: C.matcha },
          { t: s_(56), text: "lens becomes cloudy with age = CATARACT", bg: "#9AA38E" },
        ]} />
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <KPlate {...SEC} x={0} y={0} w={925} a={m1} b={m2} keys={[[m1, 1.0, 0.5, 0.5], [s_(58), 2.0, 0.40, 0.16]]}
          labels={[
            { x: 0.45, y: 0.255, text: "lens", t: wf(57, "lens"), side: "r" },
            { x: 0.45, y: 0.12, text: "anterior chamber", t: wf(60, "anterior"), side: "r", hot: true },
            { x: 0.305, y: 0.17, text: "posterior chamber", t: wf(60, "posterior"), side: "r", hot: true },
            { x: 0.53, y: 0.15, text: "iris", t: wf(59, "iris"), side: "r" },
          ]} />
        <ViewTag t={t} t0={m1 + 0.3} x={20} y={20} text="GRAY'S 1918 · FIG. 869 · FRONT OF THE EYE" />
        <Facts items={[
          { t: s_(57), text: "The lens divides the eye into 2 cavities", big: "2", bg: C.forest },
          { t: s_(58), text: "ANTERIOR cavity (in front of the lens) = aqueous humor", bg: "#3F9BB8" },
          { t: s_(59), text: "the iris splits it into 2 chambers" },
          { t: wf(60, "anterior"), text: "anterior chamber: cornea ↔ iris" , bg: C.matcha },
          { t: wf(60, "posterior"), text: "posterior chamber: iris ↔ lens", bg: "#E9A23B" },
        ]} />
      </Seg>
      <Seg t={t} a={m2} b={m3}>
        <ZoomBox pins={[{ t0: wf(62, "posterior"), t1: s_(63), pt: EYE_PT.post, dx: 110, dy: 20, size: 26, hot: true, text: "① made here" }, { t0: wf(63, "pupil"), t1: s_(64), pt: EYE_PT.pupil, dx: -20, dy: 70, size: 26, hot: true, text: "② through the pupil" }, { t0: wf(64, "drains"), pt: EYE_PT.schlemm, dx: 150, dy: -40, size: 26, hot: true, text: "③ drains: canal of Schlemm" }]} t={t} t0={m2} x={0} y={0} w={1000} h={740} cw={900} ch={700} keys={[[m2, 1.4, 0.4, 0.45], [s_(62), 2.1, 0.3, 0.33], [s_(64), 2.4, 0.26, 0.3], [s_(65), 1.5, 0.35, 0.45]]}>
          <EyeSection t={t} w={900} flow={ramp(t, s_(62), s_(62) + 0.6)}
            lit={{ ciliary: win(s_(62), s_(63)), post: win(wf(62, "posterior"), s_(63)), pupil: win(wf(63, "pupil"), s_(64)), ant: win(wf(63, "anterior"), s_(64)), schlemm: wf(64, "canal") }} />
        </ZoomBox>
        <div style={abs(1100, 20, { width: 680, display: "flex", flexDirection: "column", gap: 14 })}>
          <Chip t={t} t0={s_(61)} bg={C.forest} size={40}>the aqueous humor path</Chip>
          {([["ciliary processes", s_(62), "#D9735F"], ["posterior chamber", wf(62, "posterior"), "#E9A23B"], ["pupil", wf(63, "pupil"), C.forest], ["anterior chamber", wf(63, "anterior"), C.matcha], ["trabecular meshwork", wf(64, "trabecular"), "#7FB6C7"], ["canal of Schlemm", wf(64, "canal"), "#3F9BB8"]] as [string, number, string][]).map(([x, tt, col], i) => (
            <div key={x} style={{ ...pop(t, tt), display: "flex", alignItems: "center", gap: 16, fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.forest, transformOrigin: "0% 50%" }}>
              <div style={{ width: 46, height: 46, borderRadius: 23, background: col, border: `3px solid ${C.forest}`, color: C.paper, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{i + 1}</div>{x}
            </div>
          ))}
          <div style={{ ...pop(t, wf(65, "blocked")), marginTop: 6, background: C.red, color: C.paper, borderRadius: 24, padding: "14px 24px", fontFamily: FONT, fontWeight: 800, fontSize: 32, transformOrigin: "0% 50%" }}>drainage blocked → eye pressure rises · linked to glaucoma</div>
        </div>
      </Seg>
      <Seg t={t} a={m3} b={b + 0.1}>
        <KPlate {...SEC} x={0} y={0} w={925} a={m3} b={b} keys={[[m3, 1.2, 0.5, 0.35], [s_(67), 1.0, 0.5, 0.5]]}
          labels={[
            { x: 0.47, y: 0.62, text: "vitreous humor", t: wf(66, "vitreous"), side: "r", hot: true },
            { x: 0.45, y: 0.255, text: "lens", t: wf(67, "lens"), side: "r" },
            { x: 0.73, y: 0.75, text: "retina", t: wf(67, "retina"), side: "l" },
          ]} />
        <Note t={t} t0={wf(66, "vitreous") + 0.6} old="vitreous body" modern="vitreous humor" x={20} y={680} />
        <Facts items={[
          { t: s_(66), text: "POSTERIOR cavity: behind the lens · much bigger", big: "Vitreous", bg: C.forest },
          { t: s_(67), text: "clear gel · supports the lens · holds the retina in place", bg: C.matcha },
        ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 6. THE EYE MUSCLES ================= */
export const SMuscles: React.FC = () => {
  const t = useT();
  const a = ST(6), b = BE(6), m1 = s_(70) - 0.2, m2 = s_(71) - 0.2, m3 = s_(79) - 0.2;
  // gaze follows each muscle's action
  const gz: [number, [number, number]][] = [[m2, [0, 0]], [wf(72, "medial"), [1, 0]], [wf(72, "lateral"), [-1, 0]], [wf(73, "superior"), [0, -1]], [wf(73, "inferior"), [0, 1]], [s_(74), [0, 0]], [wf(76, "depresses"), [-0.7, 0.7]], [s_(77), [-0.7, -0.7]], [s_(78), [0, 0]]];
  let gi = 0;
  gz.forEach((g, i) => { if (t >= g[0]) gi = i; });
  const g0 = gz[Math.max(0, gi - 1)][1], g1 = gz[gi][1], ge = ramp(t, gz[gi][0], gz[gi][0] + 0.5);
  const gaze: [number, number] = [g0[0] + (g1[0] - g0[0]) * ge, g0[1] + (g1[1] - g0[1]) * ge];
  const EFW = 640;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={m1}>
        <KPlate {...ORB} x={0} y={0} w={1000} a={a} b={m1} keys={[[a, 1.0, 0.5, 0.5], [s_(69), 1.1, 0.5, 0.5]]}
          labels={[
            { x: 0.62, y: 0.455, text: "lateral rectus", t: wf(69, "rectus"), side: "r", hot: true },
            { x: 0.40, y: 0.30, text: "superior rectus", t: wf(69, "rectus") + 0.25, side: "l" },
            { x: 0.36, y: 0.73, text: "inferior rectus", t: wf(69, "rectus") + 0.5, side: "r" },
            { x: 0.50, y: 0.215, text: "superior oblique", t: wf(69, "oblique"), side: "r", col: "#E8796B" },
            { x: 0.78, y: 0.80, text: "inferior oblique", t: wf(69, "oblique") + 0.3, side: "l", col: "#F0A868" },
          ]} />
        <ViewTag t={t} t0={a + 0.3} x={20} y={20} text="GRAY'S 1918 · FIG. 889 · RIGHT ORBIT FROM THE SIDE" />
        <Note t={t} t0={s_(69) + 1.6} old="Rectus lateralis, Obliquus superior…" modern="Latin names" x={20} y={650} />
        <Facts x={1100} y={20} items={[
          { t: s_(68), text: "6 extraocular muscles", big: "6", bg: C.forest },
          { t: wf(69, "four"), text: "4 rectus muscles (recti)", bg: "#7FB6C7" },
          { t: wf(69, "two"), text: "2 oblique muscles", bg: C.red },
        ]} />
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <KPlate {...RING} x={0} y={0} w={778} a={m1} b={m2} keys={[[m1, 1.0, 0.5, 0.5], [wf(70, "ring"), 1.9, 0.54, 0.47]]}
          labels={[{ x: 0.58, y: 0.50, text: "tendinous ring", t: wf(70, "ring"), side: "r", hot: true }]} />
        <ViewTag t={t} t0={m1 + 0.3} x={20} y={20} text="GRAY'S 1918 · FIG. 890 · BACK OF THE RIGHT ORBIT" />
        <Facts x={840} w={940} items={[
          { t: s_(70), text: "All 4 recti start from a COMMON TENDINOUS RING", bg: C.forest },
          { t: wf(70, "back"), text: "at the back of the orbit, around the optic canal" },
        ]} />
        <Note t={t} t0={wf(70, "ring") + 0.6} old="annulus tendineus communis (ring of Zinn)" x={840} y={420} />
      </Seg>
      <Seg t={t} a={m2} b={m3}>
        <Panel x={0} y={0} w={1000} h={740} t={t} t0={m2}>
          <div style={abs(180, 40)}><EyeFront t={t} w={EFW} gaze={gaze}
            lit={{ mr: win(wf(72, "medial"), wf(72, "lateral")), lr: win(wf(72, "lateral"), s_(73)), sr: win(wf(73, "superior"), wf(73, "inferior")), ir: win(wf(73, "inferior"), s_(74)), so: win(s_(75), s_(77)), io: win(s_(77), s_(78)) }}
            arrows={{ mr: win(wf(72, "medial"), wf(72, "lateral")), lr: win(wf(72, "lateral"), s_(73)), sr: win(wf(73, "superior"), wf(73, "inferior")), ir: win(wf(73, "inferior"), s_(74)), so: win(wf(76, "depresses"), s_(77)), io: win(wf(77, "elevates"), s_(78)) }} /></div>
          {([["mr", "medial rectus", wf(72, "medial"), wf(72, "lateral"), 30, 120], ["lr", "lateral rectus", wf(72, "lateral"), s_(73), -40, 40], ["sr", "superior rectus", wf(73, "superior"), wf(73, "inferior"), 140, 0], ["ir", "inferior rectus", wf(73, "inferior"), s_(74), 140, 0], ["so", "superior oblique", wf(75, "superior"), s_(77), -140, -10], ["io", "inferior oblique", wf(77, "inferior"), s_(78), -60, 40]] as [string, string, number, number, number, number][]).map(([id, txt, t0, t1, dx, dy]) => (
            <Tag key={id} t={t} t0={t0} t1={t1} x={180} y={40} w={EFW} vbw={800} pt={EF_PT[id]} text={txt} dx={dx} dy={dy} col={MCOL[id]} />
          ))}
          <Tag t={t} t0={wf(75, "trochlea")} t1={s_(77)} x={180} y={40} w={EFW} vbw={800} pt={EF_PT.trochlea} text="trochlea = pulley" dx={90} dy={80} hot size={26} />
          <ViewTag t={t} t0={m2 + 0.3} x={24} y={24} text="RIGHT EYE · FROM THE FRONT" />
        </Panel>
        <div style={abs(1060, 20, { width: 740, display: "flex", flexDirection: "column", gap: 12 })}>
          {([["mr", "Medial rectus", "turns the eye IN (adducts)", wf(72, "medial")], ["lr", "Lateral rectus", "turns the eye OUT (abducts)", wf(72, "lateral")], ["sr", "Superior rectus", "mainly LIFTS (elevates)", wf(73, "superior")], ["ir", "Inferior rectus", "mainly LOWERS (depresses)", wf(73, "inferior")], ["so", "Superior oblique", "depresses · abducts · rotates in", wf(76, "depresses")], ["io", "Inferior oblique", "elevates · abducts · rotates out", wf(77, "elevates")]] as [string, string, string, number][]).map(([id, h, s, tt]) => (
            <GroupRow key={id} t={t} t0={tt} col={MCOL[id]} title={h} sub={s} w={740} />
          ))}
        </div>
        {t >= s_(78) - 0.2 && (
          <div style={abs(1060, 20, { width: 740, height: 700, borderRadius: 36, background: C.forest, padding: 40, boxSizing: "border-box", ...pop(t, s_(78) - 0.2, 0.35) })}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: C.banana }}>+ ONE MORE IN THE ORBIT</div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.paper, marginTop: 20, lineHeight: 1.1 }}>levator palpebrae superioris</div>
            <div style={{ ...pop(t, wf(78, "doesn't")), fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.matchaLight, marginTop: 40, transformOrigin: "0% 50%" }}>✗ doesn't move the eyeball</div>
            <div style={{ ...pop(t, wf(78, "raises")), fontFamily: FONT, fontWeight: 800, fontSize: 48, color: C.banana, marginTop: 24, transformOrigin: "0% 50%" }}>✓ raises the upper eyelid</div>
          </div>
        )}
      </Seg>
      <Seg t={t} a={m3} b={b + 0.1}>
        <KPlate {...RING} x={0} y={0} w={778} a={m3} b={b} keys={[[m3, 1.0, 0.5, 0.5], [s_(80), 1.25, 0.35, 0.65], [s_(81), 1.25, 0.6, 0.3], [s_(82), 1.05, 0.5, 0.5]]}
          ov={(w, h) => (
            <>
              <Ring t={t} t0={wf(80, "abducens")} t1={s_(81)} x={0.155 * w} y={0.862 * h} r={60} />
              <Ring t={t} t0={wf(81, "trochlear")} t1={s_(82)} x={0.80 * w} y={0.115 * h} r={60} />
              <Ring t={t} t0={wf(82, "oculomotor")} x={0.28 * w} y={0.115 * h} r={60} />
            </>
          )} />
        <ViewTag t={t} t0={m3 + 0.3} x={20} y={20} text="GRAY'S 1918 · FIG. 890 · NERVES ENTERING THE ORBIT" />
        <Note t={t} t0={wf(80, "abducens") + 0.5} old="abducent nerve" modern="abducens nerve" x={840} y={660} />
        <div style={abs(840, 20, { width: 940, display: "flex", flexDirection: "column", gap: 20 })}>
          <Chip t={t} t0={s_(79)} bg={C.forest} size={40}>3 cranial nerves supply them</Chip>
          {([["lr", "Lateral rectus", "abducens · CN VI", "6", s_(80)], ["so", "Superior oblique", "trochlear · CN IV", "4", s_(81)], ["mr", "All the rest", "oculomotor · CN III  (+ levator palpebrae)", "3", s_(82)]] as [string, string, string, string, number][]).map(([id, h, s, n, tt]) => (
            <div key={id} style={{ ...pop(t, tt), display: "flex", alignItems: "center", gap: 24, background: C.card, border: `3px solid ${C.line}`, borderRadius: 28, padding: "14px 24px", fontFamily: FONT, fontWeight: 800, transformOrigin: "0% 50%" }}>
              <div style={{ width: 110, height: 110, borderRadius: 26, background: MCOL[id], border: `4px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 72, color: C.forest }}>{n}</div>
              <div>
                <div style={{ fontSize: 46, color: C.forest }}>{h}</div>
                <div style={{ fontSize: 32, color: C.matcha }}>{s}</div>
              </div>
            </div>
          ))}
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 7. MEMORY TRICKS ================= */
export const STricks: React.FC = () => {
  const t = useT();
  const a = ST(7), b = BE(7);
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(86) - 0.2}>
        <TrickCard t={t} t0={a} n={1} title="3 layers, outside → in: S · C · R">
          <div style={abs(60, 190, { display: "flex", flexDirection: "column", gap: 10 })}>
            {([["Sclera", wf(84, "sclera"), "outer · fibrous"], ["Choroid", wf(84, "choroid"), "middle · vascular"], ["Retina", wf(84, "retina"), "inner · neural"]] as [string, number, string][]).map(([w, tt, s]) => (
              <div key={w} style={{ ...pop(t, tt), display: "flex", alignItems: "baseline", gap: 24, fontFamily: FONT, fontWeight: 800, fontSize: 72, color: C.paper, transformOrigin: "0% 50%" }}>
                <FL w={w} on={t >= tt ? 1 : 0} /><span style={{ fontSize: 34, color: C.matchaLight }}>{s}</span>
              </div>
            ))}
          </div>
          <div style={abs(60, 520, { ...pop(t, wf(84, "screen")), fontFamily: FONT, fontWeight: 800, fontSize: 88, color: C.paper, transformOrigin: "0% 50%" })}>
            <span style={{ color: C.banana }}>S·C·R</span> → <span style={{ background: C.banana, color: C.forest, padding: "0 18px", borderRadius: 16 }}>SCReen</span>
          </div>
          <div style={abs(60, 640, { opacity: ramp(t, s_(85), s_(85) + 0.4), fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.matchaLight })}>the retina is the screen the picture lands on</div>
          <div style={abs(1000, 40, { width: 760, height: 660, borderRadius: 36, background: C.card, overflow: "hidden" })}>
            <div style={abs(-20, 40)}><EyeSection t={t} w={800} light={ramp(t, s_(85), s_(85) + 2.5)} lit={{ sclera: win(wf(84, "sclera"), wf(84, "choroid")), choroid: win(wf(84, "choroid"), wf(84, "retina")), retina: wf(84, "retina") }} /></div>
          </div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={s_(86) - 0.2} b={s_(87) - 0.2}>
        <TrickCard t={t} t0={s_(86) - 0.2} n={2} title="Rods and cones">
          <div style={abs(60, 220, { display: "flex", flexDirection: "column", gap: 40 })}>
            {([["Cones", "for", "Color", wf(86, "cones"), "#E9A23B"], ["Rods", "for the", "Really dark", wf(86, "rods"), C.matchaLight]] as [string, string, string, number, string][]).map(([x, y, z, tt, col]) => (
              <div key={x} style={{ ...pop(t, tt), display: "flex", alignItems: "baseline", gap: 22, fontFamily: FONT, fontWeight: 800, color: C.paper, transformOrigin: "0% 50%" }}>
                <div style={{ fontSize: 80, color: col }}><span style={{ color: C.banana, textShadow: `0 0 18px ${C.bananaDark}` }}>{x[0]}</span>{x.slice(1)}</div>
                <div style={{ fontSize: 48, color: C.matchaLight }}>{y}</div>
                <div style={{ fontSize: 80 }}><span style={{ color: C.banana, textShadow: `0 0 18px ${C.bananaDark}` }}>{z[0]}</span>{z.slice(1)}</div>
              </div>
            ))}
          </div>
          <div style={abs(1080, 60, { width: 680, height: 620, borderRadius: 36, background: C.card, overflow: "hidden" })}>
            <div style={abs(20, 80)}><RetinaCells t={t} w={640} lit={{ cones: win(wf(86, "cones"), wf(86, "rods")), rods: wf(86, "rods") }} /></div>
          </div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={s_(87) - 0.2} b={s_(89) - 0.2}>
        <TrickCard t={t} t0={s_(87) - 0.2} n={3} title="The nerves: LR6 · SO4 · R3">
          <div style={abs(60, 190, { display: "flex", gap: 30 })}>
            {([["LR", "6", wf(87, "l"), "lr", "Lateral Rectus → CN VI", wf(88, "lateral")], ["SO", "4", wf(87, "s"), "so", "Superior Oblique → CN IV", wf(88, "superior")], ["R", "3", wf(87, "rest"), "mr", "the Rest → CN III", wf(88, "everything")]] as [string, string, number, string, string, number][]).map(([x, n, tt, id, s, t2]) => (
              <div key={x} style={{ ...pop(t, tt), width: 290, height: 300, borderRadius: 36, background: "rgba(247,246,236,0.08)", border: `5px solid ${MCOL[id]}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800 }}>
                <div style={{ fontSize: 104, color: C.paper, lineHeight: 1 }}>{x}<span style={{ color: C.banana }}>{n}</span></div>
                <div style={{ opacity: ramp(t, t2, t2 + 0.4), fontSize: 26, color: C.matchaLight, marginTop: 20, textAlign: "center", padding: "0 14px" }}>{s}</div>
              </div>
            ))}
          </div>
          <div style={abs(60, 540, { opacity: ramp(t, wf(88, "lateral"), wf(88, "lateral") + 0.4), fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.paper, width: 900 })}>abducens <span style={{ color: C.banana }}>(VI)</span> · trochlear <span style={{ color: C.banana }}>(IV)</span> · oculomotor <span style={{ color: C.banana }}>(III)</span></div>
          <div style={abs(1080, 40, { width: 680, height: 660, borderRadius: 36, background: C.card, overflow: "hidden" })}>
            <div style={abs(20, 40)}><EyeFront t={t} w={640} lit={{ lr: wf(88, "lateral"), so: wf(88, "superior"), mr: wf(88, "everything"), sr: wf(88, "everything"), ir: wf(88, "everything"), io: wf(88, "everything") }} dim={0.8} /></div>
          </div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={s_(89) - 0.2} b={s_(91) - 0.2}>
        <TrickCard t={t} t0={s_(89) - 0.2} n={4} title="The aqueous humor path">
          <div style={abs(60, 200, { display: "flex", flexDirection: "column", gap: 14 })}>
            {([["Made in the back", wf(89, "made")], ["flows through the pupil", wf(89, "flows")], ["drains in the front", wf(89, "drains")]] as [string, number][]).map(([x, tt]) => (
              <div key={x} style={{ ...pop(t, tt), fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.paper, transformOrigin: "0% 50%" }}>→ {x}</div>
            ))}
          </div>
          <div style={abs(60, 470, { width: 900, display: "flex", flexWrap: "wrap", gap: 12 })}>
            {([["posterior chamber", wf(90, "posterior")], ["pupil", wf(90, "pupil")], ["anterior chamber", wf(90, "anterior")], ["trabecular meshwork", wf(90, "trabecular")], ["canal of Schlemm", wf(90, "canal")]] as [string, number][]).map(([x, tt], i) => (
              <Chip key={x} t={t} t0={tt} bg={i === 4 ? C.banana : C.matcha} color={i === 4 ? C.forest : C.paper} size={32}>{i + 1} · {x}</Chip>
            ))}
          </div>
          <div style={abs(1000, 40, { width: 760, height: 660, borderRadius: 36, background: C.card, overflow: "hidden" })}>
            <div style={abs(-60, -40, { transform: "scale(1.5)", transformOrigin: "0 0" })}><EyeSection t={t} w={800} flow={1} lit={{ post: win(wf(90, "posterior"), wf(90, "pupil")), pupil: win(wf(90, "pupil"), wf(90, "anterior")), ant: win(wf(90, "anterior"), wf(90, "trabecular")), schlemm: wf(90, "canal") }} /></div>
          </div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={s_(91) - 0.2} b={b + 0.1}>
        <div style={abs(40, 60)}>
          <StudyCard t={t} flip={wf(91, "flip") - 0.1} w={940}
            front={
              <div style={{ position: "relative", width: 880, height: 560 }}>
                <div style={{ position: "absolute", left: 20, top: 0, fontSize: 40, color: C.matcha }}>Name the structure</div>
                <div style={{ position: "absolute", left: 150, top: 50 }}><EyeSection t={t} w={600} lit={{ ciliary: s_(91) }} dim={0.7} /></div>
              </div>
            }
            back={"Ciliary body\nmuscle → focuses the lens\nprocesses → make aqueous humor"} />
        </div>
        <div style={abs(1060, 80, { width: 720 })}>
          <div style={pop(t, s_(91))}><Big size={70}>Test yourself</Big></div>
          <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 18 }}>
            <div><Chip t={t} t0={wf(91, "look")} bg={C.card} color={C.forest} size={40}>1 · look at the picture</Chip></div>
            <div><Chip t={t} t0={wf(91, "name")} bg={C.matcha} size={40}>2 · name the structure</Chip></div>
            <div><Chip t={t} t0={wf(91, "flip")} bg={C.forest} size={40}>3 · flip the card to check</Chip></div>
          </div>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 8. QUIZ ================= */
type Q = { n: number; si: number; q: string; a: string; visual: (t: number, r: number, ans: number) => React.ReactNode };
const QS: Q[] = [
  {
    n: 1, si: 93, q: "The 3 layers of the eyeball, from outside in?", a: "fibrous · vascular · neural",
    visual: (t, r, ans) => (
      <Panel x={0} y={0} w={1000} h={740} t={t} t0={s_(93) - 0.2}>
        <div style={abs(50, 20)}><EyeSection t={t} w={900} lit={r ? { sclera: ans, cornea: ans, choroid: ans + 0.5, ciliary: ans + 0.5, iris: ans + 0.5, retina: ans + 1.0 } : {}} dim={0.3} /></div>
        {r > 0 && <>
          <Pin t={t} t0={ans} pt={[EYE_PT.sclera[0] + 50, EYE_PT.sclera[1] + 20]} k={1} text="sclera" dx={60} dy={-50} hot />
          <Pin t={t} t0={ans + 0.5} pt={[EYE_PT.choroid[0] + 50, EYE_PT.choroid[1] + 20]} k={1} text="choroid" dx={110} dy={20} hot />
          <Pin t={t} t0={ans + 1.0} pt={[EYE_PT.retina[0] + 50, EYE_PT.retina[1] + 20]} k={1} text="retina" dx={-120} dy={60} hot />
        </>}
      </Panel>
    ),
  },
  {
    n: 2, si: 95, q: "Which part of the retina gives the sharpest vision?", a: "the fovea",
    visual: (t, r, ans) => (
      <KPlate {...FUN} x={130} y={0} w={740} a={s_(95) - 0.2} b={s_(97) - 0.2} keys={[[s_(95), 1.0, 0.5, 0.5], [ans, 1.5, 0.5, 0.5]]} labels={r ? [{ x: 0.5, y: 0.505, text: "fovea (in the macula)", t: ans, side: "r", hot: true }] : []} />
    ),
  },
  {
    n: 3, si: 97, q: "Why is the optic disc a blind spot?", a: "no photoreceptors",
    visual: (t, r, ans) => (
      <KPlate {...FUN} x={130} y={0} w={740} a={s_(97) - 0.2} b={s_(99) - 0.2} keys={[[s_(97), 1.2, 0.4, 0.47], [ans, 1.7, 0.35, 0.46]]} labels={[{ x: 0.335, y: 0.455, text: "optic disc", t: s_(97) + 0.3, side: "r", hot: true }, ...(r ? [{ x: 0.335, y: 0.455, text: "0 rods · 0 cones", t: ans, side: "l" as const, col: "#E8796B" }] : [])]} />
    ),
  },
  {
    n: 4, si: 99, q: "Which structure makes the aqueous humor?", a: "the ciliary body",
    visual: (t, r, ans) => (
      <ZoomBox pins={[...(r > 0 ? [{ t0: ans + 0.2, pt: EYE_PT.ciliary, dx: 110, dy: -40, size: 28, hot: true, text: "ciliary processes" }] : [])]} t={t} t0={s_(99) - 0.2} x={0} y={0} w={1000} h={740} cw={900} ch={700} keys={[[s_(99), 1.0, 0.5, 0.5], [ans, 1.9, 0.33, 0.35]]}>
        <EyeSection t={t} w={900} flow={r ? ramp(t, ans, ans + 0.5) : 0} lit={r ? { ciliary: ans } : {}} />
      </ZoomBox>
    ),
  },
  {
    n: 5, si: 101, q: "Which nerve supplies the superior oblique?", a: "trochlear · CN IV",
    visual: (t, r, ans) => (
      <Panel x={0} y={0} w={1000} h={740} t={t} t0={s_(101) - 0.2}>
        <div style={abs(180, 40)}><EyeFront t={t} w={640} lit={{ so: s_(101) + 0.3 }} arrows={r ? { so: ans } : {}} gaze={r ? [-0.7 * ramp(t, ans, ans + 0.5), 0.7 * ramp(t, ans, ans + 0.5)] : [0, 0]} /></div>
        <Tag t={t} t0={s_(101) + 0.3} x={180} y={40} w={640} vbw={800} pt={EF_PT.so} text="superior oblique" dx={-140} dy={-10} col={MCOL.so} />
        {r > 0 && <Tag t={t} t0={ans} x={180} y={40} w={640} vbw={800} pt={EF_PT.trochlea} text="through the trochlea → CN IV" dx={60} dy={90} hot size={26} />}
      </Panel>
    ),
  },
];
export const SQuiz: React.FC = () => {
  const t = useT();
  const a = ST(8), b = BE(8);
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(93) - 0.2}>
        <div style={abs(0, 0, { width: 1800, height: 740, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" })}>
          <div style={pop(t, a)}><Big size={150}>QUIZ</Big></div>
          <div style={{ marginTop: 20 }}><Chip t={t} t0={a + 0.3} bg={C.banana} color={C.forest} size={44}>5 questions · pause if you need more time</Chip></div>
        </div>
      </Seg>
      {QS.map((q, i) => {
        const ask = s_(q.si), pause = e_(q.si), ans = s_(q.si + 1);
        const end = i < QS.length - 1 ? s_(QS[i + 1].si) - 0.2 : s_(103) - 0.2;
        const reveal = t >= ans ? 1 : 0;
        const cdT = t - (pause + 0.2);
        const n = cdT < 0 ? null : cdT < 1.0 ? 3 : cdT < 2.0 ? 2 : cdT < 3.0 ? 1 : null;
        const cdK = n ? ramp(t, pause + 0.2 + (3 - n), pause + 0.2 + (3 - n) + 0.18) : 0;
        return (
          <Seg key={q.n} t={t} a={ask - 0.2} b={end}>
            {q.visual(t, reveal, ans)}
            <div style={abs(1040, 0, { width: 760, height: 740, borderRadius: 44, background: C.forest, ...pop(t, ask - 0.15, 0.35) })}>
              <div style={abs(50, 46, { fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: C.banana })}>QUESTION {q.n} / 5</div>
              <div style={abs(50, 110, { width: 660, fontFamily: FONT, fontWeight: 800, fontSize: 58, lineHeight: 1.12, color: C.paper })}>{q.q}</div>
              {n && <div style={abs(0, 440, { width: 760, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 190, lineHeight: 1, color: C.banana, transform: `scale(${1.35 - 0.35 * cdK})` })}>{n}</div>}
              {reveal > 0 && (
                <div style={abs(50, 520, { ...pop(t, ans), width: 660, background: C.banana, borderRadius: 26, padding: "20px 30px 26px", boxSizing: "border-box", fontFamily: FONT, fontWeight: 800, fontSize: q.a.length > 18 ? 44 : 56, color: C.forest, textAlign: "center" })}>✓ {q.a}</div>
              )}
            </div>
          </Seg>
        );
      })}
      <Seg t={t} a={s_(103) - 0.2} b={b + 0.1}>
        <div style={abs(0, 0, { width: 1800, height: 740, borderRadius: 44, background: C.card, border: `4px solid ${C.line}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" })}>
          <Big size={110}>Your score: <span style={{ color: C.matcha }}>? / 5</span></Big>
          <div style={{ marginTop: 30 }}><Chip t={t} t0={wf(103, "tell")} bg={C.forest} size={46}>tell me in the comments</Chip></div>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 9. RECAP + OUTRO ================= */
export const SRecap: React.FC = () => {
  const t = useT();
  const a = ST(9);
  const items: [string, string, number, string][] = [
    ["3 layers", "sclera + cornea · choroid, ciliary body + iris · retina", Math.max(a, s_(105)), C.matcha],
    ["Retina", "rods = dim · cones = color · fovea = sharpest · disc = blind spot", s_(106), "#E9A23B"],
    ["Lens", "focuses with the help of the ciliary muscle", s_(107), "#BFE3EE"],
    ["2 fluids", "aqueous humor in front · vitreous humor behind", s_(108), "#3F9BB8"],
    ["6 muscles", "LR6 · SO4 · the rest 3", s_(109), C.red],
  ];
  const ot = s_(110) - 0.2;
  const outro = ramp(t, ot, ot + 0.5);
  return (
    <Stage a={a} b={END - 0.3}>
      {outro < 1 && (
        <div style={abs(0, 0, { width: 1800, height: 740, borderRadius: 44, background: C.forest })}>
          <div style={abs(70, 40, { fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 8, color: C.banana })}>RECAP</div>
          <div style={abs(70, 120, { display: "flex", flexDirection: "column", gap: 26 })}>
            {items.map(([h, s, tt, col]) => (
              <div key={h} style={{ ...pop(t, tt), display: "flex", alignItems: "center", gap: 24, fontFamily: FONT, fontWeight: 800, transformOrigin: "0% 50%" }}>
                <div style={{ width: 62, height: 62, borderRadius: 31, background: col, border: `4px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: C.forest, flexShrink: 0 }}>✓</div>
                <div style={{ width: 250, fontSize: 48, color: C.paper, flexShrink: 0 }}>{h}</div>
                <div style={{ fontSize: 33, color: C.matchaLight, width: 900 }}>{s}</div>
              </div>
            ))}
          </div>
          <div style={abs(1290, 120, { opacity: ramp(t, a, a + 0.5), width: 450, height: 500, borderRadius: 32, background: C.card, overflow: "hidden" })}>
            <div style={abs(0, 60)}><EyeSection t={t} w={450} light={ramp(t, a + 0.3, a + 3)} /></div>
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
              <div style={{ background: C.red, color: C.paper, borderRadius: 50, padding: "18px 54px 22px", fontSize: 54, letterSpacing: 3, transform: `scale(${1 + 0.05 * Math.max(0, Math.sin((t - ot) * 5))})`, opacity: ramp(t, wf(110, "subscribe"), wf(110, "subscribe") + 0.3) }}>SUBSCRIBE</div>
              <div style={{ fontSize: 34, color: C.matchaLight, opacity: ramp(t, wf(110, "book"), wf(110, "book") + 0.3) }}>study cards: bookplume.com</div>
            </div>
            <div style={{ marginTop: 40, background: C.paper, color: C.forest, borderRadius: 24, padding: "16px 30px 20px", fontSize: 40, opacity: ramp(t, s_(111), s_(111) + 0.4), width: "fit-content" }}>Which part of the body should we learn next?</div>
          </div>
        </div>
      )}
    </Stage>
  );
};
