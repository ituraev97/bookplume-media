import React from "react";
import { C, FONT, ramp, useT } from "./kit";
import { Facts, Stage, LogoMark } from "./Chrome16";
import { UrinaryOverview, KidneySection, Layers, HilumView, Nephron, TwoNephrons, SizeCard, OV_PT, SEC_PT, LY_PT, HI_PT, NE_PT, KC, Lit } from "./IllusKidney";
import { s_, e_, wf, ST, BE, abs, pop, Big, Mk, Seg, Note, Chip, ViewTag, Tag, Panel, KPlate, TrickCard, FL } from "./KidKit";
import { END } from "./timeline";

/* ---------- plates (Gray's Anatomy 1918, public domain) ---------- */
const P = (f: string, w: number, h: number) => ({ src: `plates/${f}.png`, aspect: w / h });
const POST = P("post1121", 1829, 1890);
const SECT = P("sect1127", 865, 1407);
const NEPH = P("neph1128", 1808, 1679);
const GLOM = P("glom1130", 569, 789);
const CAPS = P("caps1126", 1604, 1457);
const AORTA = P("aorta531", 1762, 1996);

const win = (a: number, b: number) => ({ a, b });
/** pulsing highlight rings drawn inside a KPlate (fractions of the image) */
const rings = (t: number, list: [number, number, number, number, number?][]) => (w: number, h: number, s: number) => (
  <>{list.map(([x, y, r, t0, t1], i) => {
    const p = ramp(t, t0, t0 + 0.4) * (t1 === undefined ? 1 : 1 - ramp(t, t1, t1 + 0.3));
    if (p <= 0) return null;
    return <div key={i} style={{ position: "absolute", left: x * w - r, top: y * h - r * 0.62, width: r * 2, height: r * 1.24, borderRadius: "50%", border: `${6 / s}px solid ${C.banana}`, boxShadow: `0 0 18px ${C.bananaDark}`, opacity: p * (0.75 + 0.25 * Math.sin(t * 6)) }} />;
  })}</>
);
type CK = [number, number, number, number];
type PinS = { t0: number; t1?: number; pt: [number, number]; text: string; dx?: number; dy?: number; hot?: boolean; size?: number; col?: string };
/** diagram panel with a camera (keys: time, scale, focusX, focusY in viewBox fractions) and pins */
const ZoomBox: React.FC<{ x: number; y: number; w: number; h: number; cw?: number; ch?: number; keys: CK[]; t: number; t0: number; bg?: string; pins?: PinS[]; children: React.ReactNode }> = ({ x, y, w, h, cw = 900, ch = 700, keys, t, t0, bg = C.card, pins = [], children }) => {
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
const Row: React.FC<{ t: number; t0: number; col: string; title: string; sub?: string; w?: number; n?: string; size?: number }> = ({ t, t0, col, title, sub, w = 700, n, size = 38 }) => (
  <div style={{ ...pop(t, t0), width: w, display: "flex", alignItems: "center", gap: 18, background: C.card, border: `3px solid ${C.line}`, borderRadius: 24, padding: "10px 22px", fontFamily: FONT, fontWeight: 800, transformOrigin: "0% 50%", boxSizing: "border-box" }}>
    <div style={{ width: 52, height: 52, borderRadius: 26, background: col, border: `3px solid ${C.forest}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, color: C.forest }}>{n}</div>
    <div>
      <div style={{ fontSize: size, color: C.forest, lineHeight: 1.1 }}>{title}</div>
      {sub && <div style={{ fontSize: size * 0.7, color: C.matcha, lineHeight: 1.15, marginTop: 2 }}>{sub}</div>}
    </div>
  </div>
);
/** step chain: items light up in order (flow chart) */
const Chain: React.FC<{ t: number; items: [string, number, string][]; x: number; y: number; w?: number; size?: number; dark?: boolean }> = ({ t, items, x, y, w = 680, size = 34, dark }) => (
  <div style={abs(x, y, { width: w, display: "flex", flexDirection: "column", gap: 6 })}>
    {items.map(([txt, tt, col], i) => {
      const on = ramp(t, tt - 0.1, tt + 0.25);
      const next = i + 1 < items.length ? ramp(t, items[i + 1][1] - 0.1, items[i + 1][1] + 0.25) : 0;
      return (
        <div key={txt} style={{ opacity: 0.25 + 0.75 * on, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, background: on > 0.5 && next < 0.5 ? col : dark ? "rgba(255,255,255,0.08)" : C.card, border: `3px solid ${on > 0.5 && next < 0.5 ? C.forest : dark ? "rgba(255,255,255,0.2)" : C.line}`, borderRadius: 20, padding: "6px 20px 9px", fontFamily: FONT, fontWeight: 800, fontSize: size, color: dark && !(on > 0.5 && next < 0.5) ? C.paper : C.forest, transform: `scale(${1 + 0.05 * on * (1 - next)})`, transformOrigin: "0% 50%" }}>
            <span style={{ width: 34, height: 34, borderRadius: 17, background: col, border: `3px solid ${C.forest}`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: C.forest }}>{i + 1}</span>
            {txt}
          </div>
          {i + 1 < items.length && <div style={{ marginLeft: 26, fontFamily: FONT, fontWeight: 800, fontSize: size * 0.55, lineHeight: 1, color: dark ? C.matchaLight : C.matcha, height: size * 0.5 }}>↓</div>}
        </div>
      );
    })}
  </div>
);

/* ================= INTRO ================= */
export const SIntro: React.FC = () => {
  const t = useT();
  const m1 = s_(2) - 0.2, m2 = s_(3) - 0.2;
  return (
    <Stage a={-1} b={BE(0)}>
      <Seg t={t} a={-1} b={m1}>
        <Panel x={0} y={0} w={1000} h={740} t={t} t0={0}>
          <div style={abs(50, 20)}><UrinaryOverview t={t} w={900} urine={ramp(t, wf(0, "cleaning"), wf(0, "cleaning") + 0.6)} blood={ramp(t, wf(0, "filters"), wf(0, "filters") + 0.6)}
            lit={{ kidneyR: win(wf(0, "organs"), s_(1) + 0.4), kidneyL: win(wf(0, "organs"), s_(1) + 0.4) }} labels={1} /></div>
          <ViewTag t={t} t0={0.4} x={24} y={20} text="URINARY SYSTEM · FROM THE FRONT · SCHEMATIC" />
        </Panel>
        <div style={abs(1060, 0, { width: 740, ...pop(t, 0.2) })}>
          <Big size={96}><Mk p={ramp(t, 0.6, 1.6)}>Kidney Anatomy</Mk></Big>
          <Big size={96}><Mk p={ramp(t, 1.2, 2.2)}>Made Easy</Mk></Big>
          <Big size={44} color={C.matcha} style={{ marginTop: 10 }}>learn it in about 10 minutes</Big>
        </div>
        <div style={abs(1060, 400, { display: "flex", flexDirection: "column", gap: 14 })}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", width: 740 }}>
            <Chip t={t} t0={wf(0, "organs")} bg={C.forest} size={34}>2 organs</Chip>
            <Chip t={t} t0={wf(0, "fist")} bg={KC.cortex} color={C.forest} size={34}>each fist-sized</Chip>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Chip t={t} t0={wf(0, "million")} bg={C.banana} color={C.forest} size={40}>≈ 2,000,000 tiny filters</Chip>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
            <Chip t={t} t0={wf(1, "what")} bg={C.card} color={C.forest} size={34}>not just what they do…</Chip>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Chip t={t} t0={wf(1, "where")} bg={C.red} size={40}>WHERE everything is</Chip>
          </div>
        </div>
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <Panel x={0} y={0} w={1000} h={740} t={t} t0={m1}>
          <div style={abs(50, 20)}><KidneySection t={t} w={900} vessels={ramp(t, wf(2, "arcuate"), wf(2, "arcuate") + 0.4)} lit={{ hilum: win(wf(2, "hilum"), wf(2, "pyramids")), sinus: win(wf(2, "hilum"), wf(2, "pyramids")), medulla: win(wf(2, "pyramids"), wf(2, "calyces")), minor: win(wf(2, "calyces"), wf(2, "arcuate")), major: win(wf(2, "calyces"), wf(2, "arcuate")), pelvis: win(wf(2, "calyces"), wf(2, "arcuate")) }} vlit={{ arcuate: wf(2, "arcuate") }} /></div>
          <ViewTag t={t} t0={m1 + 0.3} x={24} y={20} text="LEFT KIDNEY · CUT IN HALF · SCHEMATIC" />
        </Panel>
        <div style={abs(1060, 40, { display: "flex", flexDirection: "column", gap: 24 })}>
          {([["Which kidney sits lower?", wf(2, "which"), C.forest], ["What passes through the hilum?", wf(2, "hilum"), C.matcha], ["Pyramids? Calyces?", wf(2, "pyramids"), KC.pyramid], ["Arcuate arteries?", wf(2, "arcuate"), C.red]] as [string, number, string][]).map(([x, tt, bg]) => (
            <div key={x}><Chip t={t} t0={tt} bg={bg} size={44}>{x}</Chip></div>
          ))}
        </div>
      </Seg>
      <Seg t={t} a={m2} b={BE(0) + 0.1}>
        <KPlate {...POST} x={0} y={0} w={716} a={m2} b={BE(0)} keys={[[m2, 1.0, 0.5, 0.5], [s_(4), 1.05, 0.5, 0.45]]} />
        <ViewTag t={t} t0={m2 + 0.3} x={20} y={650} text="GRAY'S 1918 · FIG. 1121" />
        <div style={abs(770, 0, { width: 1000, display: "flex", gap: 12, flexWrap: "wrap" })}>
          {["nursing school", "med school", "A&P class"].map((x, i) => (
            <Chip key={x} t={t} t0={[wf(3, "nursing"), wf(3, "med"), wf(3, "class")][i]} bg={C.card} color={C.forest} size={32}>{x}</Chip>
          ))}
        </div>
        <div style={abs(770, 100, { width: 1000, opacity: ramp(t, m2 + 0.3, m2 + 0.7) * (1 - ramp(t, s_(4) - 0.3, s_(4))) })}>
          <Big size={76}>This is the lesson that makes the <Mk p={ramp(t, wf(3, "click"), wf(3, "click") + 0.6)}>kidney click</Mk>.</Big>
        </div>
        <div style={abs(770, 90)}><Chip t={t} t0={s_(4)} bg={C.forest} size={42}>In about 10 minutes:</Chip></div>
        <div style={abs(770, 176, { display: "flex", flexDirection: "column", gap: 10 })}>
          {([
            ["where the kidneys sit", wf(4, "where"), KC.cortex],
            ["their outer layers", wf(4, "outer"), KC.fat],
            ["the inside of the kidney", wf(4, "inside"), KC.pyramid],
            ["the blood supply", wf(4, "blood"), KC.artery],
            ["the nephron", wf(4, "nephron"), KC.dct],
          ] as [string, number, string][]).map(([txt, tt, col]) => (
            <div key={txt} style={{ ...pop(t, tt), display: "flex", alignItems: "center", gap: 18, background: C.card, border: `3px solid ${C.line}`, borderRadius: 24, padding: "8px 22px", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.forest, transformOrigin: "0% 50%", width: 700, boxSizing: "border-box" }}>
              <div style={{ width: 44, height: 44, borderRadius: 22, background: col, border: `3px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>✓</div>
              {txt}
            </div>
          ))}
        </div>
        <div style={abs(770, 640)}><Chip t={t} t0={wf(5, "five")} bg={C.banana} color={C.forest} size={40}>+ 5-question quiz at the end</Chip></div>
      </Seg>
    </Stage>
  );
};

/* ================= 1. THE BIG PICTURE ================= */
export const SBig: React.FC = () => {
  const t = useT();
  const a = ST(1), b = BE(1), m1 = s_(8) - 0.2, m2 = s_(10) - 0.2;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={m1}>
        <Panel x={0} y={0} w={1000} h={740} t={t} t0={a}>
          <div style={abs(50, 20)}><UrinaryOverview t={t} w={900} labels={1} lit={{ kidneys: win(wf(7, "kidneys"), wf(7, "ureters")), ureters: win(wf(7, "ureters"), wf(7, "bladder")), bladder: win(wf(7, "bladder"), wf(7, "urethra")), urethra: win(wf(7, "urethra"), m1 + 0.3) }} /></div>
          <Tag t={t} t0={wf(7, "kidneys")} x={50} y={20} w={900} pt={OV_PT.kidneyL} text="kidneys" dx={130} dy={-60} hot />
          <Tag t={t} t0={wf(7, "ureters")} x={50} y={20} w={900} pt={OV_PT.ureterL} text="ureters" dx={150} dy={20} col="#F6E3A1" />
          <Tag t={t} t0={wf(7, "bladder")} x={50} y={20} w={900} pt={OV_PT.bladder} text="urinary bladder" dx={230} dy={0} col="#F6E3A1" />
          <Tag t={t} t0={wf(7, "urethra")} x={50} y={20} w={900} pt={OV_PT.urethra} text="urethra" dx={-170} dy={-10} col="#F6E3A1" />
          <ViewTag t={t} t0={a + 0.3} x={24} y={20} text="URINARY SYSTEM · FROM THE FRONT · SCHEMATIC" />
        </Panel>
        <div style={abs(1060, 0, { display: "flex", flexDirection: "column", gap: 16 })}>
          <div style={pop(t, s_(7))}><Big size={62}>The urinary system</Big></div>
          <div style={{ height: 6 }} />
          <Row t={t} t0={wf(7, "kidneys")} col={KC.cortex} n="2" title="kidneys" sub="filter the blood · make urine" />
          <Row t={t} t0={wf(7, "ureters")} col={KC.ureter} n="2" title="ureters" sub="carry urine down" />
          <Row t={t} t0={wf(7, "bladder")} col="#F6D98A" n="1" title="urinary bladder" sub="stores urine" />
          <Row t={t} t0={wf(7, "urethra")} col={KC.ureter} n="1" title="urethra" sub="carries urine out" />
        </div>
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <Panel x={0} y={0} w={1000} h={740} t={t} t0={m1}>
          <div style={abs(50, 20)}><SizeCard t={t} w={900} a={s_(9)} /></div>
          <ViewTag t={t} t0={m1 + 0.3} x={24} y={20} text="ADULT KIDNEY · APPROXIMATE SIZE" />
        </Panel>
        <Facts items={[
          { t: s_(8), text: "bean-shaped · about the size of a FIST", bg: KC.cortexDark },
          { t: wf(9, "eleven"), text: "about 11–14 cm long", big: "11–14 cm", bg: C.forest },
          { t: wf(9, "six"), text: "6 cm wide · 4 cm thick" },
        ]} />
      </Seg>
      <Seg t={t} a={m2} b={b + 0.1}>
        <KPlate {...POST} x={0} y={0} w={716} a={m2} b={b} keys={[[m2, 1.0, 0.5, 0.5], [s_(12), 1.04, 0.5, 0.55], [s_(13), 1.07, 0.55, 0.4]]}
          labels={[
            { x: 0.49, y: 0.50, text: "aorta", t: wf(10, "artery"), side: "l", col: "#F3B5A8", t1: s_(11) },
            { x: 0.50, y: 0.385, text: "renal vein", t: wf(10, "vein"), side: "r", col: "#BFD7EE", t1: s_(11) },
            { x: 0.58, y: 0.58, text: "ureter", t: wf(12, "ureter"), side: "r", hot: true, t1: s_(13) },
            { x: 0.47, y: 0.885, text: "bladder", t: wf(12, "bladder"), side: "r", hot: true, t1: s_(13) },
            { x: 0.57, y: 0.30, text: "adrenal gland", t: wf(13, "adrenal"), side: "r", hot: true },
          ]} />
        <ViewTag t={t} t0={m2 + 0.3} x={20} y={650} text="GRAY'S 1918 · FIG. 1121" />
        <div style={{ opacity: 1 - ramp(t, s_(11) - 0.3, s_(11)) }}><Note t={t} t0={m2 + 1.0} old="cœliac artery" modern="celiac trunk" x={20} y={20} /></div>
        <div style={{ opacity: ramp(t, s_(11), s_(11) + 0.3) * (1 - ramp(t, s_(13) - 0.3, s_(13))) }}><Note t={t} t0={s_(11)} old="internal spermatic vessels" modern="testicular vessels" x={20} y={20} /></div>
        <Panel x={740} y={0} w={500} h={740} t={t} t0={m2 + 0.2}>
          <div style={abs(-160, 40)}><UrinaryOverview t={t} w={820} blood={ramp(t, s_(10), s_(10) + 0.4) * (1 - ramp(t, s_(11), s_(11) + 0.4))} urine={ramp(t, s_(12), s_(12) + 0.4)}
            lit={{ renalA: win(wf(10, "artery"), wf(10, "vein")), renalV: win(wf(10, "vein"), s_(11)), kidneys: win(s_(11), s_(12)), ureters: win(s_(12), s_(13)), bladder: win(wf(12, "bladder"), s_(13)), adrenal: s_(13) }} /></div>
        </Panel>
        <Facts x={1270} w={510} items={[
          { t: s_(10), text: "IN: renal artery → filtered → OUT: renal vein", bg: KC.artery },
          { t: s_(11), text: "≈150 quarts of blood filtered a day", big: "150 qt", bg: C.forest },
          { t: wf(11, "only"), text: "only 1–2 quarts become urine", bg: KC.cd },
          { t: s_(13), text: "on top: ADRENAL (suprarenal) gland", bg: KC.adrenal },
        ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 2. LOCATION AND COVERINGS ================= */
export const SLocation: React.FC = () => {
  const t = useT();
  const a = ST(2), b = BE(2), m1 = s_(17) - 0.2, m2 = s_(20) - 0.2, m3 = s_(21) - 0.2, m4 = s_(24) - 0.2;
  const ring = (x: number, y: number, r: number, t0: number) => (w: number, h: number, s: number) => {
    const p = ramp(t, t0, t0 + 0.4);
    if (p <= 0) return null;
    return <div style={{ position: "absolute", left: x * w - r, top: y * h - r * 0.6, width: r * 2, height: r * 1.2, borderRadius: "50%", border: `${6 / s}px solid ${C.banana}`, boxShadow: `0 0 18px ${C.bananaDark}`, opacity: p * (0.75 + 0.25 * Math.sin(t * 6)) }} />;
  };
  const sv = ramp(t, wf(16, "peritoneum"), wf(16, "peritoneum") + 0.4);
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={m1}>
        <KPlate {...AORTA} x={0} y={0} w={653} a={a} b={m1} keys={[[a, 1.0, 0.5, 0.5], [s_(15), 1.1, 0.5, 0.45], [s_(16), 1.15, 0.5, 0.42]]}
          labels={[
            { x: 0.27, y: 0.53, text: "right kidney", t: wf(15, "kidneys"), side: "r", hot: true },
            { x: 0.64, y: 0.33, text: "left kidney", t: wf(15, "kidneys") + 0.3, side: "r", hot: true },
          ]} />
        <ViewTag t={t} t0={a + 0.3} x={20} y={650} text="GRAY'S 1918 · FIG. 531" />
        <div style={{ opacity: 1 - ramp(t, s_(16) - 0.3, s_(16)) }}>
          <Facts x={720} w={1060} items={[
            { t: s_(15), text: "on the POSTERIOR abdominal wall", bg: C.forest },
            { t: wf(15, "each"), text: "one on each side of the vertebral column", bg: KC.cortexDark },
          ]} />
        </div>
        <div style={abs(720, 30, { width: 1060, opacity: ramp(t, s_(16) - 0.1, s_(16) + 0.3) })}>
          <div style={pop(t, s_(16))}><Big size={84}><Mk p={ramp(t, wf(16, "retroperitoneal"), wf(16, "retroperitoneal") + 0.8)}>Retroperitoneal</Mk></Big></div>
          <div style={{ ...pop(t, wf(16, "behind")), transformOrigin: "0% 50%", marginTop: 6 }}><Big size={44} color={C.matcha}>= BEHIND the peritoneum, not inside it</Big></div>
        </div>
        <div style={abs(720, 230, { width: 1060, height: 480, borderRadius: 32, background: C.card, boxShadow: `0 0 0 4px ${C.line}`, overflow: "hidden", ...pop(t, s_(16) + 0.4) })}>
          <svg width={1060} height={480} viewBox="0 0 1060 480">
            <text x={40} y={56} fontFamily={FONT} fontWeight={800} fontSize={26} fill={C.matcha} letterSpacing={3}>SIDE VIEW · SCHEMATIC</text>
            <path d="M640 80 Q380 70 230 250 Q380 430 640 420 Z" fill="#E7F0DA" stroke={C.forest} strokeWidth={3} />
            <path d="M640 80 Q380 70 230 250 Q380 430 640 420 Z" fill="none" stroke={KC.fascia} strokeWidth={9} strokeDasharray="16 9" opacity={sv} />
            <text x={470} y={175} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.matcha} opacity={sv}>peritoneal cavity</text>
            <ellipse cx={460} cy={260} rx={95} ry={62} fill="#F3B5A8" stroke={C.forest} strokeWidth={3} />
            <text x={460} y={268} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={C.forest}>gut</text>
            <path d="M700 170 Q800 160 805 250 Q800 340 700 330 Q668 290 676 250 Q668 210 700 170 Z" fill={KC.cortex} stroke={C.forest} strokeWidth={4} />
            <text x={742} y={258} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.forest}>kidney</text>
            <rect x={850} y={70} width={120} height={360} rx={20} fill={KC.bone} stroke={KC.boneLine} strokeWidth={4} />
            <text x={910} y={258} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={22} fill={C.forest}>spine</text>
            <g opacity={sv}>
              <path d="M640 300 L690 330" stroke={C.forest} strokeWidth={3} />
              <rect x={520} y={350} width={220} height={44} rx={12} fill={KC.fascia} />
              <text x={630} y={381} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill="#FFFFFF">peritoneum</text>
            </g>
            <g opacity={ramp(t, wf(16, "behind"), wf(16, "behind") + 0.4)}>
              <path d="M660 120 L720 120" stroke={C.red} strokeWidth={6} strokeLinecap="round" />
              <path d="M708 108 L724 120 L708 132" fill="none" stroke={C.red} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
              <text x={735} y={128} fontFamily={FONT} fontWeight={800} fontSize={26} fill={C.red}>behind it</text>
            </g>
            <text x={60} y={452} fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.forest}>← front</text>
            <text x={1000} y={452} textAnchor="end" fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.forest}>back →</text>
          </svg>
        </div>
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <ZoomBox t={t} t0={m1} x={0} y={0} w={1000} h={740} keys={[[m1, 1.0, 0.5, 0.5], [wf(18, "right"), 1.0, 0.5, 0.45], [s_(19), 1.3, 0.5, 0.28]]}
          pins={[
            { t0: wf(17, "twelfth"), pt: [482, 130], text: "T12", dx: 330, dy: -40, hot: true },
            { t0: wf(17, "third"), pt: [482, 316], text: "L3", dx: 330, dy: 30, hot: true },
            { t0: wf(18, "lower"), t1: s_(19), pt: OV_PT.kidneyR, text: "right kidney: a little lower", dx: -20, dy: 250, col: "#F3B5A8" },
            { t0: wf(19, "eleventh"), pt: [300, 156], text: "ribs 11 + 12", dx: -90, dy: -100, col: "#EDE5C8" },
          ]}>
          <UrinaryOverview t={t} w={900} levels={ramp(t, s_(17), s_(17) + 0.6)} lit={{ kidneys: win(s_(17), wf(18, "right")), kidneyR: win(wf(18, "right"), s_(19)), liver: win(wf(18, "liver"), s_(19) + 0.2), ribs: s_(19) }} />
        </ZoomBox>
        <Facts items={[
          { t: s_(17), text: "from T12 down to L3", big: "T12–L3", bg: C.forest },
          { t: wf(18, "right"), text: "RIGHT kidney sits a little lower", bg: KC.artery },
          { t: wf(18, "liver"), text: "…because the LIVER is above it", bg: KC.liver },
          { t: s_(19), text: "upper parts partly protected by ribs 11 + 12" },
        ]} />
      </Seg>
      <Seg t={t} a={m2} b={m3}>
        <KPlate {...AORTA} x={0} y={0} w={653} a={m2} b={m3} keys={[[m2, 1.1, 0.4, 0.4], [wf(20, "psoas"), 1.25, 0.33, 0.62]]}
          ov={(w, h, s) => <>{ring(0.33, 0.78, 70, wf(20, "psoas"))(w, h, s)}{ring(0.27, 0.675, 95, wf(20, "quadratus"))(w, h, s)}</>}
          labels={[{ x: 0.42, y: 0.03, text: "diaphragm", t: wf(20, "diaphragm"), side: "r", hot: true }]} />
        <ViewTag t={t} t0={m2 + 0.3} x={20} y={650} text="GRAY'S 1918 · FIG. 531" />
        <div style={abs(720, 0, { display: "flex", flexDirection: "column", gap: 18 })}>
          <div style={pop(t, s_(20))}><Big size={64}>Behind the kidneys</Big></div>
          <div style={{ height: 8 }} />
          <Row t={t} t0={wf(20, "diaphragm")} col="#E8A38F" n="1" title="diaphragm" sub="above and behind the upper part" w={900} />
          <Row t={t} t0={wf(20, "psoas")} col={C.banana} n="2" title="psoas major" sub="beside the vertebral column" w={900} />
          <Row t={t} t0={wf(20, "quadratus")} col={C.banana} n="3" title="quadratus lumborum" sub="posterior abdominal wall" w={900} />
        </div>
      </Seg>
      <Seg t={t} a={m3} b={m4}>
        <Panel x={0} y={0} w={1000} h={740} t={t} t0={m3}>
          <div style={abs(50, 20)}><Layers t={t} w={900} grow={ramp(t, s_(21), wf(21, "inside") + 0.8)} lit={{ capsule: win(s_(22), s_(23)), peri: s_(23) }} /></div>
          <Tag t={t} t0={s_(22)} x={50} y={20} w={900} pt={LY_PT.capsule} text="1 · renal capsule" dx={-80} dy={-150} hot />
          <Tag t={t} t0={s_(23)} x={50} y={20} w={900} pt={LY_PT.peri} text="2 · perirenal fat" dx={-90} dy={190} hot />
          <ViewTag t={t} t0={m3 + 0.3} x={24} y={20} text="LAYERS AROUND THE KIDNEY · SCHEMATIC" />
        </Panel>
        <div style={abs(1060, 0, { display: "flex", flexDirection: "column", gap: 14 })}>
          <div style={pop(t, s_(21))}><Big size={64}>4 layers</Big></div>
          <div style={{ ...pop(t, wf(21, "inside")), transformOrigin: "0% 50%" }}><Big size={38} color={C.matcha}>from the inside out</Big></div>
          <div style={{ height: 10 }} />
          <Row t={t} t0={s_(22)} col="#FFFFFF" n="1" title="renal capsule" sub="tough, fibrous · on the surface" />
          <Row t={t} t0={s_(23)} col={KC.peri} n="2" title="perirenal fat" sub="cushion around the capsule" />
        </div>
      </Seg>
      <Seg t={t} a={m4} b={b + 0.1}>
        <KPlate {...CAPS} x={0} y={0} w={815} a={m4} b={b} keys={[[m4, 1.0, 0.5, 0.5], [s_(25), 1.06, 0.45, 0.6]]}
          ov={(w, h, s) => <>{ring(0.75, 0.6, 150, wf(24, "fascia"))(w, h, s)}{ring(0.69, 0.75, 120, m4 + 0.6)(w, h, s)}{ring(0.49, 0.91, 120, wf(25, "pararenal"))(w, h, s)}</>}
          labels={[{ x: 0.30, y: 0.62, text: "kidney", t: m4 + 0.4, side: "r", col: "#F3B5A8" }]} />
        <ViewTag t={t} t0={m4 + 0.3} x={20} y={20} text="GRAY'S 1918 · FIG. 1126 · CROSS-SECTION" />
        <div style={abs(860, 0, { display: "flex", flexDirection: "column", gap: 14 })}>
          <Row t={t} t0={m4} col="#FFFFFF" n="1" title="renal capsule" sub="tough, fibrous · on the surface" w={920} size={34} />
          <Row t={t} t0={m4 + 0.15} col={KC.peri} n="2" title="perirenal fat" sub="cushion around the capsule" w={920} size={34} />
          <Row t={t} t0={s_(24)} col={KC.fascia} n="3" title="renal (Gerota's) fascia" sub="encloses kidney + adrenal gland · anchors them" w={920} size={34} />
          <Row t={t} t0={s_(25)} col={KC.para} n="4" title="pararenal fat" sub="outside the fascia" w={920} size={34} />
        </div>
        <div style={abs(860, 520, { display: "flex", flexDirection: "column", gap: 14 })}>
          <div style={{ position: "relative", height: 56 }}><Note t={t} t0={m4 + 0.8} old="adipose capsule" modern="perirenal fat" x={0} y={0} /></div>
          <div style={{ position: "relative", height: 56 }}><Note t={t} t0={wf(25, "pararenal")} old="paranephric body" modern="pararenal fat" x={0} y={0} /></div>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 3. OUTSIDE THE KIDNEY ================= */
export const SOutside: React.FC = () => {
  const t = useT();
  const a = ST(3), b = BE(3), m1 = s_(30) - 0.2, m2 = s_(32) - 0.2;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={m1}>
        <ZoomBox t={t} t0={a} x={0} y={0} w={1000} h={740} keys={[[a, 1.0, 0.5, 0.5], [s_(27), 1.6, 0.68, 0.36]]}
          pins={[
            { t0: wf(27, "upper"), pt: OV_PT.upperL, text: "upper pole", dx: 150, dy: -40, col: "#F3B5A8" },
            { t0: wf(27, "lower"), pt: OV_PT.lowerL, text: "lower pole", dx: 150, dy: 60, col: "#F3B5A8" },
            { t0: wf(27, "lateral"), pt: OV_PT.latL, text: "lateral border (convex)", dx: 120, dy: 150, size: 26 },
            { t0: wf(27, "medial"), pt: OV_PT.medL, text: "medial border (concave)", dx: -170, dy: -40, size: 26 },
            { t0: wf(28, "hilum"), pt: OV_PT.hilumL, text: "renal hilum", dx: -170, dy: 120, hot: true },
          ]}>
          <UrinaryOverview t={t} w={900} dim={0.7} lit={{ kidneyL: win(s_(27), END), lvein: win(wf(29, "vessels"), END), lartery: win(wf(29, "vessels"), END), ureterL: win(wf(29, "ureter"), END) }} urine={ramp(t, wf(29, "ureter"), wf(29, "ureter") + 0.4)} />
        </ZoomBox>
        <Facts items={[
          { t: s_(27), text: "upper + lower POLE", bg: KC.cortexDark },
          { t: wf(27, "convex"), text: "lateral border: convex · medial border: concave" },
          { t: s_(28), text: "RENAL HILUM: a deep slit in the middle of the medial border", bg: C.forest },
          { t: s_(29), text: "the doorway: vessels, nerves, lymphatics + ureter", bg: C.matcha },
        ]} />
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <Panel x={0} y={0} w={1000} h={740} t={t} t0={m1}>
          <div style={abs(50, 20)}><HilumView t={t} w={900} order={ramp(t, s_(31), s_(31) + 0.5)} lit={{ vein: win(wf(31, "vein"), wf(31, "middle")), artery: win(wf(31, "artery"), wf(31, "back")), pelvis: win(wf(31, "pelvis"), m2 + 0.4) }} /></div>
          <Tag t={t} t0={wf(31, "vein")} x={50} y={20} w={900} pt={[790, 234]} text="1 · renal vein (front)" dx={-60} dy={-150} col="#BFD7EE" />
          <Tag t={t} t0={wf(31, "artery")} x={50} y={20} w={900} pt={[800, 360]} text="2 · renal artery" dx={0} dy={-62} col="#F3B5A8" />
          <Tag t={t} t0={wf(31, "pelvis")} x={50} y={20} w={900} pt={[700, 520]} text="3 · renal pelvis (back)" dx={-110} dy={140} col="#F6E3A1" />
          <ViewTag t={t} t0={m1 + 0.3} x={24} y={20} text="CUT ACROSS THE HILUM · SEEN FROM ABOVE · SCHEMATIC" />
        </Panel>
        <div style={abs(1060, 0, { width: 720 })}>
          <div style={pop(t, s_(30))}><Big size={60}>Front to back:</Big></div>
          <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 18 }}>
            <Row t={t} t0={wf(31, "vein")} col={KC.vein} n="V" title="renal Vein" sub="in FRONT" size={46} />
            <Row t={t} t0={wf(31, "artery")} col={KC.artery} n="A" title="renal Artery" sub="in the MIDDLE" size={46} />
            <Row t={t} t0={wf(31, "pelvis")} col={KC.urine} n="P" title="renal Pelvis" sub="at the BACK → becomes the ureter" size={46} />
          </div>
        </div>
      </Seg>
      <Seg t={t} a={m2} b={b + 0.1}>
        <KPlate {...SECT} x={0} y={0} w={455} a={m2} b={b} keys={[[m2, 1.0, 0.5, 0.5], [s_(32), 1.12, 0.55, 0.55], [s_(33), 1.15, 0.55, 0.6]]}
          ov={rings(t, [[0.82, 0.54, 80, m2 + 0.4, s_(32)], [0.62, 0.62, 80, wf(33, "pelvis")]])}
          labels={[{ x: 0.5, y: 0.55, text: "renal sinus", t: wf(32, "sinus"), side: "r", hot: true }]} />
        <ViewTag t={t} t0={m2 + 0.3} x={20} y={20} text="GRAY'S 1918 · FIG. 1127" />
        <Panel x={500} y={0} w={560} h={740} t={t} t0={m2 + 0.2}>
          <div style={abs(-150, 90)}><KidneySection t={t} w={820} lit={{ sinus: win(wf(32, "sinus"), s_(33) + 0.3), pelvis: wf(33, "pelvis"), major: wf(33, "calyces"), minor: wf(33, "calyces") }} vessels={ramp(t, wf(33, "vessels"), wf(33, "vessels") + 0.4)} vlit={{ segmental: wf(33, "vessels") }} /></div>
        </Panel>
        <Facts x={1100} w={680} items={[
          { t: s_(32), text: "RENAL SINUS = the space inside, behind the hilum", bg: C.forest },
          { t: s_(33), text: "holds: renal pelvis · calyces · vessel branches · fat", bg: KC.cd },
        ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 4. INSIDE THE KIDNEY ================= */
export const SInside: React.FC = () => {
  const t = useT();
  const a = ST(4), b = BE(4), m1 = s_(41) - 0.2, m2 = s_(44) - 0.2;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={m1}>
        <ZoomBox t={t} t0={a} x={0} y={0} w={1000} h={740} keys={[[a, 1.0, 0.5, 0.5], [s_(37), 1.25, 0.32, 0.5], [s_(39), 1.25, 0.3, 0.42], [s_(40), 1.3, 0.25, 0.5]]}
          pins={[
            { t0: wf(35, "cortex"), t1: s_(36), pt: SEC_PT.cortex, text: "renal cortex", dx: 40, dy: -260, hot: true },
            { t0: wf(35, "medulla"), t1: s_(36), pt: SEC_PT.medulla, text: "renal medulla", dx: 160, dy: -150, col: "#E8A38F" },
            { t0: wf(36, "pyramids"), t1: s_(38), pt: SEC_PT.pyramid, text: "renal pyramid", dx: 60, dy: -200, hot: true },
            { t0: wf(37, "base"), t1: s_(38), pt: SEC_PT.cortex, text: "base → cortex", dx: 70, dy: 120, size: 26 },
            { t0: wf(38, "papilla"), t1: s_(39), pt: SEC_PT.papilla, text: "renal papilla", dx: 100, dy: 140, hot: true },
            { t0: wf(39, "columns"), t1: s_(40), pt: SEC_PT.column, text: "renal column", dx: -40, dy: -180, hot: true },
            { t0: wf(40, "lobe"), pt: SEC_PT.lobe, text: "1 lobe", dx: 0, dy: 200, hot: true },
          ]}>
          <KidneySection t={t} w={900} lit={{ cortex: win(wf(35, "cortex"), wf(35, "medulla")), medulla: win(wf(35, "medulla"), s_(37)), pyramid: win(s_(37), s_(38)), papilla: win(wf(38, "papilla"), s_(39)), column: win(wf(39, "columns"), s_(40)), lobe: s_(40) }} />
        </ZoomBox>
        <Facts items={[
          { t: s_(35), text: "2 regions: outer CORTEX · inner MEDULLA", bg: C.forest },
          { t: s_(36), text: "medulla = cone-shaped RENAL PYRAMIDS", bg: KC.pyramid },
          { t: s_(37), text: "base → faces the cortex · tip → points to the sinus" },
          { t: s_(38), text: "the tip = RENAL PAPILLA", bg: C.red },
          { t: s_(39), text: "RENAL COLUMNS: cortex dipping between pyramids", bg: KC.cortexDark },
          { t: s_(40), text: "1 pyramid + its cortex = 1 LOBE", bg: C.matcha },
        ]} />
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <ZoomBox t={t} t0={m1} x={0} y={0} w={1000} h={740} keys={[[m1, 1.0, 0.5, 0.5], [s_(42), 1.35, 0.35, 0.55], [s_(43), 1.1, 0.5, 0.5]]}
          pins={[
            { t0: wf(42, "minor"), pt: SEC_PT.minor, text: "minor calyx", dx: -60, dy: 180, hot: true },
            { t0: wf(43, "major"), pt: SEC_PT.major, text: "major calyx", dx: 200, dy: 120, hot: true },
            { t0: wf(43, "pelvis"), pt: SEC_PT.pelvis, text: "renal pelvis", dx: 60, dy: -230, hot: true },
          ]}>
          <KidneySection t={t} w={900} urine={ramp(t, s_(41), s_(41) + 0.6)} lit={{ papilla: win(s_(42), wf(42, "minor")), minor: win(wf(42, "minor"), wf(43, "major")), major: win(wf(43, "major"), wf(43, "pelvis")), pelvis: wf(43, "pelvis") }} />
        </ZoomBox>
        <Chain t={t} x={1080} y={20} items={[
          ["renal papilla", s_(42), "#E8A38F"],
          ["minor calyx · small cup", wf(42, "minor"), KC.coll],
          ["major calyx", wf(43, "major"), KC.sinus],
          ["renal pelvis", wf(43, "pelvis"), KC.urine],
          ["ureter", s_(44) + 10, KC.cd],
        ]} />
        <div style={abs(1080, 640)}><Chip t={t} t0={wf(43, "two")} bg={C.forest} size={32}>usually 2 or 3 major calyces</Chip></div>
      </Seg>
      <Seg t={t} a={m2} b={b + 0.1}>
        <KPlate {...SECT} x={0} y={0} w={455} a={m2} b={b} keys={[[m2, 1.05, 0.55, 0.6], [wf(44, "ureter"), 1.12, 0.65, 0.72]]}
          ov={rings(t, [[0.45, 0.46, 70, m2 + 0.5, s_(44)], [0.48, 0.72, 70, m2 + 0.5, s_(44)], [0.62, 0.62, 80, s_(44), wf(44, "ureter")], [0.86, 0.92, 70, wf(44, "ureter")]])}
          labels={[{ x: 0.24, y: 0.585, text: "minor calyx", t: m2 + 0.9, side: "r", col: "#F6E3A1", t1: s_(44) }]} />
        <ViewTag t={t} t0={m2 + 0.3} x={20} y={20} text="GRAY'S 1918 · FIG. 1127" />
        <Panel x={500} y={0} w={560} h={740} t={t} t0={m2 + 0.2}>
          <div style={abs(-210, 40)}><KidneySection t={t} w={860} urine={1} lit={{ pelvis: win(s_(44), wf(44, "ureter")), ureter: wf(44, "ureter") }} /></div>
          {(() => { const p = ramp(t, s_(45), s_(45) + 0.4); const ph = (t * 1.4) % 1; return p > 0 ? <svg style={abs(0, 0)} width={560} height={740}>{[0, 1, 2].map((i) => { const y = 380 + (((ph + i / 3) % 1) * 360); return <g key={i} opacity={p}><path d={`M${436 + (y - 380) * -0.02} ${y} l-34 0 M${436 + (y - 380) * -0.02 + 70} ${y} l34 0`} stroke={C.red} strokeWidth={8} strokeLinecap="round" /></g>; })}</svg> : null; })()}
        </Panel>
        <Facts x={1100} w={680} items={[
          { t: s_(44), text: "renal pelvis = a FUNNEL · narrows at the hilum → ureter", bg: KC.cd },
          { t: s_(45), text: "smooth muscle squeezes urine along = PERISTALSIS", bg: C.red },
        ]} />
        <Note t={t} t0={m2 + 0.9} old="infundibula" modern="major calyces" x={1100} y={660} />
      </Seg>
    </Stage>
  );
};

/* ================= 5. BLOOD SUPPLY ================= */
export const SBlood: React.FC = () => {
  const t = useT();
  const a = ST(5), b = BE(5), m1 = s_(48) - 0.2, m2 = s_(51) - 0.2, m3 = s_(57) - 0.2, m4 = s_(59) - 0.2;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={m1}>
        <KPlate {...AORTA} x={0} y={0} w={653} a={a} b={m1} keys={[[a, 1.0, 0.5, 0.5], [s_(47), 1.3, 0.5, 0.42]]}
          ov={rings(t, [[0.55, 0.555, 60, a + 0.6], [0.36, 0.41, 70, a + 1.2], [0.62, 0.392, 70, a + 1.2]])} />
        <ViewTag t={t} t0={a + 0.3} x={20} y={650} text="GRAY'S 1918 · FIG. 531" />
        <div style={abs(720, 40, { width: 1060, display: "flex", alignItems: "center", gap: 60, ...pop(t, s_(47)) })}>
          <svg width={360} height={360} viewBox="0 0 100 100">
            <circle cx={50} cy={50} r={40} fill="none" stroke={C.line} strokeWidth={18} />
            <circle cx={50} cy={50} r={40} fill="none" stroke={KC.artery} strokeWidth={18} strokeDasharray={`${2 * Math.PI * 40 * 0.25 * ramp(t, wf(47, "quarter"), wf(47, "quarter") + 1)} 999`} transform="rotate(-90 50 50)" />
            <text x={50} y={58} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={22} fill={C.forest}>25%</text>
          </svg>
          <div>
            <Big size={60}>≈ ¼ of the heart's output</Big>
            <Big size={40} color={C.matcha} style={{ marginTop: 14 }}>goes to the kidneys, at rest</Big>
          </div>
        </div>
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <ZoomBox t={t} t0={m1} x={0} y={0} w={1000} h={740} keys={[[m1, 1.0, 0.5, 0.5], [s_(48), 1.3, 0.5, 0.38], [s_(50), 1.3, 0.5, 0.38]]}
          pins={[
            { t0: wf(48, "aorta"), t1: s_(49), pt: [490, 330], text: "abdominal aorta", dx: 160, dy: 140, col: "#F3B5A8" },
            { t0: wf(48, "superior"), t1: s_(49), pt: OV_PT.sma, text: "SMA", dx: -140, dy: -80, col: "#F3B5A8" },
            { t0: s_(49), t1: s_(50), pt: OV_PT.rartery, text: "R renal artery: longer, BEHIND the IVC", dx: 20, dy: -170, hot: true, size: 26 },
            { t0: wf(50, "inferior"), t1: wf(50, "left"), pt: [410, 450], text: "inferior vena cava", dx: -150, dy: 120, col: "#BFD7EE" },
            { t0: wf(50, "left"), pt: OV_PT.lvein, text: "L renal vein: longer, IN FRONT of the aorta", dx: -20, dy: -170, hot: true, size: 26 },
          ]}>
          <UrinaryOverview t={t} w={900} blood={ramp(t, s_(48), s_(48) + 0.5)} lit={{ aorta: win(wf(48, "aorta"), s_(49)), sma: win(wf(48, "superior"), s_(49)), renalA: win(wf(48, "renal"), s_(49)), rartery: win(s_(49), s_(50)), ivc: win(wf(49, "inferior"), wf(50, "left")), renalV: win(s_(50), wf(50, "left")), lvein: wf(50, "left") }} />
        </ZoomBox>
        <Facts items={[
          { t: s_(48), text: "renal arteries: straight off the ABDOMINAL AORTA, just below the SMA", bg: KC.artery },
          { t: s_(49), text: "RIGHT renal artery: longer · passes behind the IVC", bg: KC.cortexDark },
          { t: s_(50), text: "renal veins → straight into the IVC", bg: KC.vein },
          { t: wf(50, "left"), text: "LEFT renal vein: longer · crosses in front of the aorta", bg: C.forest },
        ]} />
      </Seg>
      <Seg t={t} a={m2} b={m3}>
        <ZoomBox t={t} t0={m2} x={0} y={0} w={1000} h={740} keys={[[m2, 1.0, 0.5, 0.5], [s_(53), 1.15, 0.45, 0.4], [s_(55), 1.3, 0.32, 0.36], [s_(56), 1.45, 0.28, 0.32]]}
          pins={[
            { t0: wf(52, "segmental"), t1: s_(53), pt: SEC_PT.segmental, text: "segmental", dx: 20, dy: -200, hot: true },
            { t0: wf(53, "interlobar"), t1: s_(54), pt: SEC_PT.interlobar, text: "interlobar", dx: 60, dy: -120, hot: true },
            { t0: wf(54, "arcuate"), t1: s_(55), pt: SEC_PT.arcuate, text: "arcuate", dx: -30, dy: 160, hot: true },
            { t0: wf(55, "cortical"), t1: s_(56), pt: SEC_PT.radiate, text: "cortical radiate", dx: 100, dy: -110, hot: true },
            { t0: wf(56, "afferent"), pt: SEC_PT.afferent, text: "afferent arterioles", dx: 140, dy: -60, hot: true, size: 26 },
          ]}>
          <KidneySection t={t} w={900} vessels={ramp(t, s_(51), s_(51) + 0.6)} flow={ramp(t, s_(51), s_(51) + 0.6)} lit={{}} vlit={{ renalA: win(s_(52), wf(52, "segmental")), segmental: win(wf(52, "segmental"), s_(53)), interlobar: win(wf(53, "interlobar"), s_(54)), column: win(wf(53, "columns"), s_(54)), arcuate: win(wf(54, "arcuate"), s_(55)), radiate: win(wf(55, "cortical"), s_(56)), afferent: s_(56) }} />
        </ZoomBox>
        <Chain t={t} x={1080} y={0} size={32} items={[
          ["renal artery", s_(52), "#F3B5A8"],
          ["segmental", wf(52, "segmental"), "#F3B5A8"],
          ["interlobar · in the columns", wf(53, "interlobar"), "#F3B5A8"],
          ["arcuate · arched, at the bases", wf(54, "arcuate"), "#F3B5A8"],
          ["cortical radiate", wf(55, "cortical"), "#F3B5A8"],
          ["afferent arteriole", wf(56, "afferent"), C.banana],
        ]} />
      </Seg>
      <Seg t={t} a={m3} b={m4}>
        <KPlate {...NEPH} x={0} y={0} w={797} a={m3} b={m4} keys={[[m3, 1.3, 0.42, 0.25], [s_(58), 1.25, 0.45, 0.45]]}
          ov={rings(t, [[0.25, 0.112, 95, wf(57, "afferent"), wf(57, "glomerulus")], [0.465, 0.13, 45, wf(57, "glomerulus"), wf(57, "efferent")], [0.26, 0.148, 95, wf(57, "efferent"), s_(58)], [0.205, 0.196, 120, wf(58, "peritubular"), wf(58, "vasa")], [0.28, 0.772, 95, wf(58, "vasa")]])}
          labels={[{ x: 0.462, y: 0.13, text: "glomerulus", t: wf(57, "glomerulus"), side: "r", col: "#F2D14E", t1: s_(58) }]} />
        <ViewTag t={t} t0={m3 + 0.3} x={860} y={445} text="GRAY'S 1918 · FIG. 1128 · SCHEME" />
        <Note t={t} t0={wf(57, "efferent") + 0.5} old="afferent / efferent vessel" modern="arteriole" x={860} y={500} />
        <Note t={t} t0={wf(58, "peritubular") + 0.4} old="intertubular capillaries" modern="peritubular capillaries" x={860} y={575} />
        <Note t={t} t0={wf(58, "vasa") + 0.4} old="arteriae rectae" modern="vasa recta" x={860} y={650} />
        <Chain t={t} x={860} y={20} size={34} w={900} items={[
          ["afferent arteriole", s_(57), "#F3B5A8"],
          ["GLOMERULUS · ball of capillaries", wf(57, "glomerulus"), C.banana],
          ["efferent arteriole", wf(57, "efferent"), "#F3B5A8"],
          ["peritubular capillaries + vasa recta", wf(58, "peritubular"), "#E8A38F"],
        ]} />
      </Seg>
      <Seg t={t} a={m4} b={b + 0.1}>
        <Panel x={0} y={0} w={1000} h={740} t={t} t0={m4}>
          <div style={abs(50, 20)}><KidneySection t={t} w={900} segTint={ramp(t, wf(59, "each"), wf(59, "each") + 0.6)} vessels={1} vlit={{ segmental: s_(59) }} /></div>
          <ViewTag t={t} t0={m4 + 0.3} x={24} y={20} text="SEGMENTS · SCHEMATIC" />
        </Panel>
        <Facts items={[
          { t: s_(59), text: "SEGMENTAL ARTERIES = END ARTERIES", bg: C.red },
          { t: wf(59, "connect"), text: "they don't connect with each other" },
          { t: wf(59, "each"), text: "each one supplies its own segment", bg: C.forest },
        ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 6. THE NEPHRON ================= */
export const SNephron: React.FC = () => {
  const t = useT();
  const a = ST(6), b = BE(6), m1 = s_(62) - 0.2, m2 = s_(66) - 0.2, m3 = s_(70) - 0.2, m4 = s_(71) - 0.2;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={m1}>
        <Panel x={0} y={0} w={1000} h={740} t={t} t0={a}>
          <div style={abs(50, 20)}><Nephron t={t} w={900} flow={ramp(t, a + 0.5, a + 1.2)} /></div>
          <ViewTag t={t} t0={a + 0.3} x={24} y={20} text="ONE NEPHRON · SCHEMATIC" />
        </Panel>
        <Facts items={[
          { t: s_(60), text: "NEPHRON = the working unit of the kidney", bg: C.forest },
          { t: s_(61), text: "about a million in each kidney", big: "≈ 1,000,000", bg: KC.dct },
        ]} />
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <KPlate {...GLOM} x={0} y={0} w={534} a={m1} b={m2} keys={[[m1, 1.0, 0.5, 0.55], [s_(64), 1.2, 0.5, 0.6]]}
          labels={[
            { x: 0.5, y: 0.56, text: "glomerulus", t: wf(63, "glomerulus"), side: "l", hot: true },
            { x: 0.86, y: 0.44, text: "glomerular capsule", t: wf(63, "capsule"), side: "l", col: "#DDEBCB" },
          ]} />
        <ViewTag t={t} t0={m1 + 0.3} x={20} y={20} text="GRAY'S 1918 · FIG. 1130" />
        <ZoomBox t={t} t0={m1 + 0.2} x={570} y={0} w={500} h={740} keys={[[m1, 4.0, 0.444, 0.16]]}
          pins={[{ t0: s_(64), pt: NE_PT.podo, text: "podocytes", dx: 20, dy: -60, hot: true, size: 26 }]}>
          <Nephron t={t} w={900} filt={ramp(t, s_(65), s_(65) + 0.4)} lit={{ glom: win(wf(63, "glomerulus"), wf(63, "cup")), caps: win(wf(63, "cup"), s_(64)), podo: win(s_(64), s_(65) + 0.4) }} />
        </ZoomBox>
        <ViewTag t={t} t0={m1 + 0.5} x={590} y={20} text="SCHEMATIC" />
        <Facts x={1110} w={670} items={[
          { t: s_(62), text: "RENAL CORPUSCLE =", bg: C.forest },
          { t: wf(63, "glomerulus"), text: "glomerulus + glomerular (Bowman's) capsule", bg: KC.glom },
          { t: s_(64), text: "PODOCYTES wrap the capillaries · filtration slits", bg: C.matcha },
          { t: s_(65), text: "pass: water + small molecules · stay: blood cells + large proteins" },
        ]} />
      </Seg>
      <Seg t={t} a={m2} b={m3}>
        <ZoomBox t={t} t0={m2} x={0} y={0} w={1000} h={740} keys={[[m2, 1.0, 0.5, 0.5], [s_(66), 1.4, 0.38, 0.3], [s_(67), 1.05, 0.42, 0.62], [s_(68), 1.35, 0.52, 0.3], [s_(69), 1.0, 0.6, 0.55]]}
          pins={[
            { t0: wf(66, "proximal"), t1: s_(67), pt: NE_PT.pct, text: "proximal convoluted tubule", dx: -20, dy: 170, hot: true, size: 26 },
            { t0: wf(67, "descending"), t1: s_(68), pt: NE_PT.dl, text: "descending limb", dx: -170, dy: 40, hot: true, size: 26 },
            { t0: wf(67, "ascending"), t1: s_(68), pt: NE_PT.al, text: "ascending limb", dx: 180, dy: -40, hot: true, size: 26 },
            { t0: wf(67, "loop"), t1: s_(68), pt: NE_PT.loop, text: "loop of Henle", dx: 190, dy: -10, col: "#BFD49A", size: 26 },
            { t0: wf(68, "distal"), t1: s_(69), pt: NE_PT.dct, text: "distal convoluted tubule", dx: 140, dy: 90, hot: true, size: 26 },
            { t0: wf(69, "collecting"), pt: NE_PT.cd, text: "collecting duct", dx: 150, dy: 60, hot: true },
            { t0: wf(69, "papilla"), pt: NE_PT.papilla, text: "→ renal papilla", dx: 150, dy: -20, col: "#E8A38F", size: 26 },
          ]}>
          <Nephron t={t} w={900} flow={ramp(t, s_(66), s_(66) + 0.6)} lit={{ pct: win(wf(66, "proximal"), s_(67)), dl: win(wf(67, "descending"), wf(67, "ascending")), loopB: win(wf(67, "loop"), s_(68)), al: win(wf(67, "ascending"), s_(68)), dct: win(wf(68, "distal"), s_(69)), cd: wf(69, "collecting") }} />
        </ZoomBox>
        <Chain t={t} x={1080} y={0} size={32} w={700} items={[
          ["Bowman's capsule", m2 + 0.3, KC.caps],
          ["proximal convoluted tubule", wf(66, "proximal"), KC.pct],
          ["loop of Henle ↓↑", wf(67, "loop"), KC.loopD],
          ["distal convoluted tubule", wf(68, "distal"), "#8FD3EA"],
          ["collecting duct", wf(69, "collecting"), "#E9C08A"],
        ]} />
        <div style={abs(1080, 600, { display: "flex", flexDirection: "column", gap: 10 })}>
          <Chip t={t} t0={wf(66, "brush")} bg={KC.pct} color={C.forest} size={28}>PCT: brush border of microvilli · reabsorbs a lot</Chip>
          <Chip t={t} t0={wf(69, "many")} bg={KC.cd} size={28}>many nephrons → 1 collecting duct</Chip>
        </div>
      </Seg>
      <Seg t={t} a={m3} b={m4}>
        <ZoomBox t={t} t0={m3} x={0} y={0} w={1000} h={740} keys={[[m3, 1.0, 0.5, 0.5], [s_(70) + 0.3, 2.6, 0.45, 0.1]]}
          pins={[
            { t0: wf(70, "juxtaglomerular"), pt: NE_PT.jga, text: "juxtaglomerular apparatus", dx: 60, dy: 200, hot: true },
          ]}>
          <Nephron t={t} w={900} lit={{ dct: win(wf(70, "distal"), wf(70, "afferent")), aff: win(wf(70, "afferent"), wf(70, "juxtaglomerular")), jga: wf(70, "juxtaglomerular") }} />
        </ZoomBox>
        <Facts items={[
          { t: s_(70), text: "where the distal tubule touches its own afferent arteriole", bg: KC.dct },
          { t: wf(70, "juxtaglomerular"), text: "= JUXTAGLOMERULAR APPARATUS", bg: C.forest },
          { t: wf(70, "renin"), text: "its cells release RENIN → helps regulate blood pressure", bg: C.red },
        ]} />
      </Seg>
      <Seg t={t} a={m4} b={b + 0.1}>
        <Panel x={0} y={0} w={1000} h={740} t={t} t0={m4}>
          <div style={abs(50, 20)}><TwoNephrons t={t} w={900} a={s_(71)} /></div>
          <Tag t={t} t0={wf(71, "cortical")} x={50} y={20} w={900} pt={[260, 200]} text="cortical · short loop" dx={150} dy={-80} col="#BFD49A" />
          <Tag t={t} t0={wf(71, "juxtamedullary")} x={50} y={20} w={900} pt={[680, 520]} text="juxtamedullary · long loop" dx={-90} dy={110} hot />
        </Panel>
        <Facts items={[
          { t: s_(71), text: "most nephrons: CORTICAL, short loops", bg: KC.loopD },
          { t: wf(71, "fifteen"), text: "JUXTAMEDULLARY: long loops deep into the medulla", big: "≈ 15%", bg: C.forest },
        ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 7. MEMORY TRICKS ================= */
export const STricks: React.FC = () => {
  const t = useT();
  const a = ST(7), b = BE(7);
  const hl = (s: string) => <span style={{ color: C.banana, textShadow: `0 0 18px ${C.bananaDark}` }}>{s}</span>;
  const word = (w: string, tt: number, sub: string, t2: number, size = 70) => (
    <div key={w} style={{ ...pop(t, tt), display: "flex", alignItems: "baseline", gap: 26, fontFamily: FONT, fontWeight: 800, fontSize: size, color: C.paper, transformOrigin: "0% 50%" }}>
      <FL w={w} on={1} /><span style={{ fontSize: size * 0.58, color: C.matchaLight, opacity: ramp(t, t2, t2 + 0.3) }}>→ {sub}</span>
    </div>
  );
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(74) - 0.2}>
        <TrickCard t={t} t0={a} n={1} title="The hilum, front to back">
          <div style={abs(60, 170, { display: "flex", flexDirection: "column", gap: 0 })}>
            {word("Vein", wf(73, "vein"), "in front", wf(73, "vein"), 84)}
            {word("Artery", wf(73, "artery"), "in the middle", wf(73, "artery"), 84)}
            {word("Pelvis", wf(73, "pelvis"), "at the back", wf(73, "pelvis"), 84)}
          </div>
          <div style={abs(60, 590, { ...pop(t, wf(73, "think")), fontFamily: FONT, fontWeight: 800, fontSize: 64, color: C.banana, letterSpacing: 18 })}>V · A · P</div>
          <div style={abs(1000, 40, { width: 760, height: 660, borderRadius: 36, background: C.card, overflow: "hidden" })}>
            <div style={abs(0, 60)}><HilumView t={t} w={760} order={1} lit={{ vein: win(wf(73, "vein"), wf(73, "artery")), artery: win(wf(73, "artery"), wf(73, "pelvis")), pelvis: wf(73, "pelvis") }} /></div>
          </div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={s_(74) - 0.2} b={s_(75) - 0.2}>
        <TrickCard t={t} t0={s_(74) - 0.2} n={2} title="The urine path">
          <div style={abs(60, 200, { display: "flex", flexDirection: "column", gap: 26 })}>
            <div style={{ ...pop(t, wf(74, "small")), fontFamily: FONT, fontWeight: 800, fontSize: 58, color: C.paper, transformOrigin: "0% 50%" }}>{hl("small cups")} → {hl("big cups")}</div>
            <div style={{ ...pop(t, wf(74, "funnel")), fontFamily: FONT, fontWeight: 800, fontSize: 58, color: C.paper, transformOrigin: "0% 50%" }}>big cups → a {hl("funnel")}</div>
          </div>
          <Chain t={t} x={60} y={420} size={30} w={860} dark items={[
            ["minor calyx", wf(74, "minor"), KC.coll],
            ["major calyx", wf(74, "major"), KC.sinus],
            ["renal pelvis → ureter", wf(74, "pelvis"), KC.urine],
          ]} />
          <div style={abs(1000, 40, { width: 760, height: 660, borderRadius: 36, background: C.card, overflow: "hidden" })}>
            <div style={abs(-60, 40)}><KidneySection t={t} w={840} urine={1} lit={{ minor: win(wf(74, "small"), wf(74, "big")), major: win(wf(74, "big"), wf(74, "funnel")), pelvis: win(wf(74, "funnel"), s_(75)), ureter: wf(74, "ureter") }} /></div>
          </div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={s_(75) - 0.2} b={s_(77) - 0.2}>
        <TrickCard t={t} t0={s_(75) - 0.2} n={3} title="The arteries, in order">
          <div style={abs(60, 160, { display: "flex", flexDirection: "column", gap: 0 })}>
            {([["Really", "renal", wf(75, "really"), wf(76, "renal")], ["Smart", "segmental", wf(75, "smart"), wf(76, "segmental")], ["Interns", "interlobar", wf(75, "interns"), wf(76, "interlobar")], ["Always", "arcuate", wf(75, "always"), wf(76, "arcuate")], ["Check", "cortical radiate", wf(75, "check"), wf(76, "cortical")], ["Answers", "afferent", wf(75, "answers"), wf(76, "afferent")]] as [string, string, number, number][]).map(([w, x, tt, t2]) => word(w, tt, x, t2, 58))}
          </div>
          <div style={abs(1000, 40, { width: 760, height: 660, borderRadius: 36, background: C.card, overflow: "hidden" })}>
            <div style={abs(-40, 60)}><KidneySection t={t} w={820} vessels={1} flow={ramp(t, s_(76), s_(76) + 0.4)} vlit={{ renalA: win(wf(76, "renal"), wf(76, "segmental")), segmental: win(wf(76, "segmental"), wf(76, "interlobar")), interlobar: win(wf(76, "interlobar"), wf(76, "arcuate")), arcuate: win(wf(76, "arcuate"), wf(76, "cortical")), radiate: win(wf(76, "cortical"), wf(76, "afferent")), afferent: wf(76, "afferent") }} /></div>
          </div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={s_(77) - 0.2} b={s_(79) - 0.2}>
        <TrickCard t={t} t0={s_(77) - 0.2} n={4} title="The nephron, in order">
          <div style={abs(60, 165, { display: "flex", flexDirection: "column", gap: 0 })}>
            {([["Big", "Bowman's capsule", wf(77, "big"), wf(78, "bowman")], ["People", "proximal tubule", wf(77, "people"), wf(78, "proximal")], ["Love", "loop of Henle", wf(77, "love"), wf(78, "loop")], ["Doing", "distal tubule", wf(77, "doing"), wf(78, "distal")], ["Crosswords", "collecting duct", wf(77, "crosswords"), wf(78, "collecting")]] as [string, string, number, number][]).map(([w, x, tt, t2]) => word(w, tt, x, t2, 64))}
          </div>
          <div style={abs(1000, 40, { width: 760, height: 660, borderRadius: 36, background: C.card, overflow: "hidden" })}>
            <div style={abs(-60, 70)}><Nephron t={t} w={860} flow={1} lit={{ caps: win(wf(78, "bowman"), wf(78, "proximal")), pct: win(wf(78, "proximal"), wf(78, "loop")), dl: win(wf(78, "loop"), wf(78, "distal")), al: win(wf(78, "loop"), wf(78, "distal")), loopB: win(wf(78, "loop"), wf(78, "distal")), dct: win(wf(78, "distal"), wf(78, "collecting")), cd: wf(78, "collecting") }} /></div>
          </div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={s_(79) - 0.2} b={b + 0.1}>
        <TrickCard t={t} t0={s_(79) - 0.2} n={5} title="Which kidney sits lower?">
          <div style={abs(60, 230, { width: 880, display: "flex", flexDirection: "column", gap: 40 })}>
            <div style={{ ...pop(t, wf(79, "liver")), fontFamily: FONT, fontWeight: 800, fontSize: 70, color: C.paper, transformOrigin: "0% 50%" }}>The {hl("liver")} is big…</div>
            <div style={{ ...pop(t, wf(79, "pushes")), fontFamily: FONT, fontWeight: 800, fontSize: 64, lineHeight: 1.12, color: C.paper, transformOrigin: "0% 50%" }}>…it pushes the {hl("right")} kidney down</div>
          </div>
          <div style={abs(1000, 40, { width: 760, height: 660, borderRadius: 36, background: C.card, overflow: "hidden" })}>
            <div style={abs(-40, 60)}><UrinaryOverview t={t} w={840} labels={1} lit={{ liver: wf(79, "liver"), kidneyR: wf(79, "right") }} /></div>
          </div>
        </TrickCard>
      </Seg>
    </Stage>
  );
};

/* ================= 8. QUIZ ================= */
type Q = { n: number; si: number; q: string; a: string; visual: (t: number, r: number, ans: number) => React.ReactNode };
const QS: Q[] = [
  {
    n: 1, si: 81, q: "Which kidney usually sits lower, and why?", a: "the right · the liver is above it",
    visual: (t, r, ans) => (
      <Panel x={0} y={0} w={1000} h={740} t={t} t0={s_(81) - 0.2}>
        <div style={abs(50, 20)}><UrinaryOverview t={t} w={900} labels={1} lit={r ? { kidneyR: ans, liver: ans + 0.4 } : { kidneys: s_(81) + 0.4 }} /></div>
        {r > 0 && <Tag t={t} t0={ans} x={50} y={20} w={900} pt={OV_PT.kidneyR} text="right kidney" dx={60} dy={230} hot />}
      </Panel>
    ),
  },
  {
    n: 2, si: 83, q: "At the hilum, which structure is the most anterior?", a: "the renal vein",
    visual: (t, r, ans) => (
      <Panel x={0} y={0} w={1000} h={740} t={t} t0={s_(83) - 0.2}>
        <div style={abs(50, 20)}><HilumView t={t} w={900} order={r ? ramp(t, ans + 0.6, ans + 1) : 0} lit={r ? { vein: ans } : {}} /></div>
        {r > 0 && <Tag t={t} t0={ans} x={50} y={20} w={900} pt={[790, 234]} text="renal vein · front" dx={-60} dy={-150} hot />}
      </Panel>
    ),
  },
  {
    n: 3, si: 85, q: "What are the tips of the renal pyramids called?", a: "renal papillae",
    visual: (t, r, ans) => (
      <Panel x={0} y={0} w={1000} h={740} t={t} t0={s_(85) - 0.2}>
        <div style={abs(50, 20)}><KidneySection t={t} w={900} lit={r ? { papilla: ans, minor: wf(86, "minor") } : { medulla: s_(85) + 0.4 }} /></div>
        {r > 0 && <Tag t={t} t0={ans} x={50} y={20} w={900} pt={SEC_PT.papilla} text="renal papilla" dx={100} dy={150} hot />}
      </Panel>
    ),
  },
  {
    n: 4, si: 87, q: "Which arteries arch over the bases of the pyramids?", a: "the arcuate arteries",
    visual: (t, r, ans) => (
      <Panel x={0} y={0} w={1000} h={740} t={t} t0={s_(87) - 0.2}>
        <div style={abs(50, 20)}><KidneySection t={t} w={900} vessels={1} lit={r ? {} : { medulla: s_(87) + 0.4 }} vlit={r ? { arcuate: ans } : {}} /></div>
        {r > 0 && <Tag t={t} t0={ans} x={50} y={20} w={900} pt={SEC_PT.arcuate} text="arcuate arteries" dx={-20} dy={170} hot />}
      </Panel>
    ),
  },
  {
    n: 5, si: 89, q: "Filtrate leaves Bowman's capsule. Where does it go next?", a: "proximal convoluted tubule",
    visual: (t, r, ans) => (
      <Panel x={0} y={0} w={1000} h={740} t={t} t0={s_(89) - 0.2}>
        <div style={abs(50, 20)}><Nephron t={t} w={900} flow={r ? 1 : 0} lit={r ? { pct: ans } : { caps: s_(89) + 0.4 }} /></div>
        {r > 0 && <Tag t={t} t0={ans} x={50} y={20} w={900} pt={NE_PT.pct} text="proximal convoluted tubule" dx={0} dy={190} hot />}
      </Panel>
    ),
  },
];
export const SQuiz: React.FC = () => {
  const t = useT();
  const a = ST(8), b = BE(8);
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(81) - 0.2}>
        <div style={abs(0, 0, { width: 1800, height: 740, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" })}>
          <div style={pop(t, a)}><Big size={150}>QUIZ</Big></div>
          <div style={{ marginTop: 20 }}><Chip t={t} t0={a + 0.3} bg={C.banana} color={C.forest} size={44}>5 questions · answer out loud · pause if you need more time</Chip></div>
        </div>
      </Seg>
      {QS.map((q, i) => {
        const ask = s_(q.si), pause = e_(q.si), ans = s_(q.si + 1);
        const end = i < QS.length - 1 ? s_(QS[i + 1].si) - 0.2 : b + 0.1;
        const reveal = t >= ans ? 1 : 0;
        const cdT = t - (pause + 0.2);
        const n = cdT < 0 ? null : cdT < 1.0 ? 3 : cdT < 2.0 ? 2 : cdT < 3.0 ? 1 : null;
        const cdK = n ? ramp(t, pause + 0.2 + (3 - n), pause + 0.2 + (3 - n) + 0.18) : 0;
        return (
          <Seg key={q.n} t={t} a={ask - 0.2} b={end}>
            {q.visual(t, reveal, ans)}
            <div style={abs(1040, 0, { width: 760, height: 740, borderRadius: 44, background: C.forest, ...pop(t, ask - 0.15, 0.35) })}>
              <div style={abs(50, 46, { fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: C.banana })}>QUESTION {q.n} / 5</div>
              <div style={abs(50, 110, { width: 660, fontFamily: FONT, fontWeight: 800, fontSize: 56, lineHeight: 1.12, color: C.paper })}>{q.q}</div>
              {n && <div style={abs(0, 420, { width: 760, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 190, lineHeight: 1, color: C.banana, transform: `scale(${1.35 - 0.35 * cdK})` })}>{n}</div>}
              {reveal > 0 && (
                <div style={abs(50, 500, { ...pop(t, ans), width: 660, background: C.banana, borderRadius: 26, padding: "20px 30px 26px", boxSizing: "border-box", fontFamily: FONT, fontWeight: 800, fontSize: q.a.length > 20 ? 42 : 54, color: C.forest, textAlign: "center" })}>✓ {q.a}</div>
              )}
              {q.n === 5 && reveal > 0 && <div style={abs(50, 672, { ...pop(t, wf(90, "how")), fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.banana, whiteSpace: "nowrap" })}>Your score: ? / 5 · tell me below</div>}
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
    ["Position", "retroperitoneal · T12–L3 · right a little lower", Math.max(a, s_(92)), KC.cortex],
    ["4 layers", "capsule · perirenal fat · renal fascia · pararenal fat", s_(93), KC.peri],
    ["Hilum", "Vein · Artery · Pelvis (front → back)", s_(94), "#BFD7EE"],
    ["Inside", "cortex · medulla (pyramids, papillae) · minor → major calyx → pelvis → ureter", s_(95), "#E8A38F"],
    ["Arteries", "renal → segmental → interlobar → arcuate → cortical radiate → afferent", s_(96), "#F3B5A8"],
    ["Nephron", "Bowman's → PCT → loop of Henle → DCT → collecting duct", s_(97), "#8FD3EA"],
  ];
  const ot = s_(98) - 0.2;
  const outro = ramp(t, ot, ot + 0.5);
  return (
    <Stage a={a} b={END - 0.3}>
      {outro < 1 && (
        <div style={abs(0, 0, { width: 1800, height: 740, borderRadius: 44, background: C.forest })}>
          <div style={abs(70, 40, { fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 8, color: C.banana })}>RECAP</div>
          <div style={abs(70, 100, { display: "flex", flexDirection: "column", gap: 16 })}>
            {items.map(([h, s, tt, col]) => (
              <div key={h} style={{ ...pop(t, tt), display: "flex", alignItems: "center", gap: 24, fontFamily: FONT, fontWeight: 800, transformOrigin: "0% 50%" }}>
                <div style={{ width: 58, height: 58, borderRadius: 29, background: col, border: `4px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, color: C.forest, flexShrink: 0 }}>✓</div>
                <div style={{ width: 200, fontSize: 40, color: C.paper, flexShrink: 0 }}>{h}</div>
                <div style={{ fontSize: 28, color: C.matchaLight, width: 900, lineHeight: 1.15 }}>{s}</div>
              </div>
            ))}
          </div>
          <div style={abs(1300, 110, { opacity: ramp(t, a, a + 0.5), width: 450, height: 560, borderRadius: 32, background: C.card, overflow: "hidden" })}>
            <div style={abs(-60, 0)}>
              {t < s_(96) ? <div style={abs(40, 100)}><KidneySection t={t} w={540} urine={1} lit={{ cortex: win(s_(95), s_(96)) }} /></div>
                : <div style={abs(30, 100)}><Nephron t={t} w={540} flow={1} /></div>}
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
              <div style={{ background: C.red, color: C.paper, borderRadius: 50, padding: "18px 54px 22px", fontSize: 54, letterSpacing: 3, transform: `scale(${1 + 0.05 * Math.max(0, Math.sin((t - ot) * 5))})`, opacity: ramp(t, wf(99, "subscribe"), wf(99, "subscribe") + 0.3) }}>SUBSCRIBE</div>
              <div style={{ fontSize: 34, color: C.matchaLight, opacity: ramp(t, wf(98, "book"), wf(98, "book") + 0.3) }}>study cards: bookplume.com</div>
            </div>
            <div style={{ marginTop: 40, background: C.paper, color: C.forest, borderRadius: 24, padding: "16px 30px 20px", fontSize: 40, opacity: ramp(t, s_(100), s_(100) + 0.4), width: "fit-content" }}>Which part of the kidney is hardest to remember?</div>
          </div>
        </div>
      )}
    </Stage>
  );
};
