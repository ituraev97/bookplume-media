import React from "react";
import { C, FONT, ramp, useT } from "./kit";
import { Facts, Stage, LogoMark } from "./Chrome16";
import { AirwayMap, Cilia, Pharynx, Sinuses, Septum, LarynxFront, Glottis, Signet, TracheaX, BronchTree, LungsFront, Pleura, Acinus, Alveolus, Breath, Phrenic, RC, AW_PT, PH_PT, SI_PT, SE_PT, LX_PT, GL_PT, TX_PT, BT_PT, LU_PT, PL_PT, AC_PT, AL_PT, BR_PT, PN_PT } from "./IllusResp";
import { s_, e_, wf, ST, BE, abs, pop, Big, Mk, Seg, Note, Chip, ViewTag, Tag, Panel, KPlate, TrickCard, FL } from "./RespKit";
import { END } from "./timeline";

/* ---------- plates (Gray's Anatomy 1918, public domain) ---------- */
const P = (f: string, w: number, h: number) => ({ src: `plates/${f}.png`, aspect: w / h });
const SAG = P("sag994", 1713, 2477);
const TREE = P("tree961", 1690, 2182);
const BRON = P("bron962", 1780, 1574);
const THOR = P("thor965", 1330, 1689);
const LEFT = P("left973", 1736, 1586);
const RIGHT = P("right972", 1600, 1632);
const LOB = P("lob975", 1510, 940);
const NOSE = P("nose855", 1690, 1536);
const HEART = P("heart490", 1955, 1638);
const DIAPH = P("diaph391", 2137, 1684);
const win = (a: number, b: number) => ({ a, b });
/** pulsing highlight rings drawn inside a KPlate (fractions of the image) */
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

const Lst: React.FC<{ t: number; items: [string, number, string][]; x: number; y: number; w?: number; size?: number }> = ({ t, items, x, y, w = 700, size = 36 }) => (
  <div style={abs(x, y, { display: "flex", flexDirection: "column", gap: 10 })}>
    {items.map(([txt, tt, col]) => (
      <div key={txt} style={{ ...pop(t, tt), display: "flex", alignItems: "center", gap: 18, background: C.card, border: `3px solid ${C.line}`, borderRadius: 24, padding: "8px 22px", fontFamily: FONT, fontWeight: 800, fontSize: size, color: C.forest, transformOrigin: "0% 50%", width: w, boxSizing: "border-box" }}>
        <div style={{ width: 44, height: 44, borderRadius: 22, background: col, border: `3px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>✓</div>
        {txt}
      </div>
    ))}
  </div>
);

/* ================= INTRO ================= */
export const SIntro: React.FC = () => {
  const t = useT();
  const m1 = s_(2) - 0.2, m2 = s_(3) - 0.2;
  return (
    <Stage a={-1} b={BE(0)}>
      <Seg t={t} a={-1} b={m1}>
        <ZoomBox x={0} y={0} w={1000} h={740} t={t} t0={0} keys={[[0, 1.0, 0.5, 0.5], [wf(0, "nose"), 1.25, 0.5, 0.3], [wf(0, "branching"), 1.1, 0.5, 0.55], [wf(0, "sacs"), 1.25, 0.42, 0.7], [s_(1), 1.0, 0.5, 0.5]]}
          pins={[
            { t0: wf(0, "nose"), t1: s_(1), pt: AW_PT.nose, text: "nose", dx: 150, dy: 70, hot: true },
            { t0: wf(0, "branching"), t1: s_(1), pt: AW_PT.lmain, text: "a branching tree of tubes", dx: 190, dy: -50 },
            { t0: wf(0, "sacs"), t1: s_(1) + 0.5, pt: AW_PT.alveoli, text: "tiny air sacs", dx: -150, dy: 60, hot: true },
          ]}>
          <AirwayMap t={t} w={900} air={ramp(t, 0.3, 1)} lit={{ nose: win(wf(0, "nose"), wf(0, "branching")), bronchi: win(wf(0, "branching"), wf(0, "sacs")), bronchioles: win(wf(0, "branching"), wf(0, "sacs")), alveoli: win(wf(0, "sacs"), s_(1) + 0.4) }} />
        </ZoomBox>
        <ViewTag t={t} t0={0.4} x={24} y={20} text="AIRWAY · FROM THE FRONT · SCHEMATIC" />
        <div style={abs(1060, 0, { width: 740, ...pop(t, 0.2) })}>
          <Big size={92}><Mk p={ramp(t, 0.6, 1.6)}>Respiratory</Mk></Big>
          <Big size={92}><Mk p={ramp(t, 1.0, 2.0)}>System</Mk></Big>
          <Big size={92}><Mk p={ramp(t, 1.4, 2.4)}>Made Easy</Mk></Big>
          <Big size={42} color={C.matcha} style={{ marginTop: 10 }}>learn it in about 10 minutes</Big>
        </div>
        <div style={abs(1060, 440, { display: "flex", flexDirection: "column", gap: 14 })}>
          <div><Chip t={t} t0={wf(0, "path")} bg={C.forest} size={36}>1 path · nose → air sacs</Chip></div>
          <div><Chip t={t} t0={wf(0, "million")} bg={C.banana} color={C.forest} size={40}>≈ 300,000,000 alveoli</Chip></div>
          <div><Chip t={t} t0={wf(1, "every")} bg={C.red} size={38}>every stop · in order</Chip></div>
        </div>
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <KPlate {...BRON} x={0} y={0} w={836} a={m1} b={m2} keys={[[m1, 1.0, 0.5, 0.5], [wf(2, "bronchus"), 1.35, 0.5, 0.3], [wf(2, "lobes"), 1.0, 0.5, 0.5], [wf(2, "surfactant"), 1.5, 0.3, 0.55]]}
          labels={[
            { x: 0.43, y: 0.29, text: "right main bronchus", t: wf(2, "bronchus"), side: "l", hot: true, t1: wf(2, "lobes") },
            { x: 0.60, y: 0.29, text: "left", t: wf(2, "bronchus") + 0.5, side: "r", t1: wf(2, "lobes") },
            { x: 0.27, y: 0.16, text: "3 lobes", t: wf(2, "lobes"), side: "r", t1: wf(2, "surfactant") },
            { x: 0.76, y: 0.30, text: "2 lobes", t: wf(2, "lobes") + 0.3, side: "l", t1: wf(2, "surfactant") },
          ]} />
        <ViewTag t={t} t0={m1 + 0.3} x={20} y={690} text="GRAY'S 1918 · FIG. 962 · BRONCHI AND BRONCHIOLES" />
        <div style={abs(890, 40, { display: "flex", flexDirection: "column", gap: 26 })}>
          {([["Which bronchus is wider?", wf(2, "which"), C.forest], ["How many lobes does each lung have?", wf(2, "lobes") - 0.5, C.matcha], ["Which cells make surfactant?", wf(2, "surfactant") - 0.4, C.red]] as [string, number, string][]).map(([x, tt, bg]) => (
            <div key={x}><Chip t={t} t0={tt} bg={bg} size={44}>{x}</Chip></div>
          ))}
        </div>
      </Seg>
      <Seg t={t} a={m2} b={BE(0) + 0.1}>
        <KPlate {...SAG} x={0} y={0} w={512} a={m2} b={BE(0)} keys={[[m2, 1.0, 0.5, 0.5], [s_(4), 1.06, 0.5, 0.4]]} />
        <ViewTag t={t} t0={m2 + 0.3} x={20} y={690} text="GRAY'S 1918 · FIG. 994" />
        <div style={abs(580, 0, { width: 1200, display: "flex", gap: 12, flexWrap: "wrap" })}>
          {["nursing school", "med school", "A&P class"].map((x, i) => (
            <Chip key={x} t={t} t0={[wf(3, "nursing"), wf(3, "med"), wf(3, "class")][i]} bg={C.card} color={C.forest} size={32}>{x}</Chip>
          ))}
        </div>
        <div style={abs(580, 100, { width: 1180, opacity: ramp(t, m2 + 0.3, m2 + 0.7) * (1 - ramp(t, s_(4) - 0.3, s_(4))) })}>
          <Big size={76}>This is the lesson that makes the <Mk p={ramp(t, wf(3, "click") - 0.6, wf(3, "click"))}>respiratory system click</Mk>.</Big>
        </div>
        <div style={abs(580, 90)}><Chip t={t} t0={s_(4)} bg={C.forest} size={42}>In about 10 minutes:</Chip></div>
        <Lst t={t} x={580} y={176} items={[
          ["the nose and pharynx", wf(4, "nose"), RC.mucosa],
          ["the larynx", wf(4, "larynx"), RC.cart],
          ["the trachea and bronchi", wf(4, "trachea"), "#BFD7EE"],
          ["the lungs and pleura", wf(4, "lungs"), RC.supL],
          ["the alveoli", wf(4, "alveoli"), RC.mid],
        ]} />
        <div style={abs(580, 640)}><Chip t={t} t0={wf(5, "five")} bg={C.banana} color={C.forest} size={40}>+ 5-question quiz at the end</Chip></div>
      </Seg>
    </Stage>
  );
};

/* ================= 1. THE BIG PICTURE ================= */
export const SBig: React.FC = () => {
  const t = useT();
  const a = ST(1), b = BE(1), m1 = s_(11) - 0.2;
  const cond = win(wf(8, "conducting"), s_(10) - 0.1), resp = win(wf(10, "respiratory"), m1 + 0.3);
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={m1}>
        <ZoomBox x={0} y={0} w={1000} h={740} t={t} t0={a} keys={[[a, 1.0, 0.5, 0.5], [wf(9, "nose"), 1.3, 0.5, 0.3], [wf(9, "bronchi"), 1.15, 0.5, 0.5], [s_(10), 1.3, 0.42, 0.68], [m1 - 2, 1.0, 0.5, 0.5]]}
          pins={[
            { t0: wf(9, "nose"), t1: s_(10), pt: AW_PT.nose, text: "nose", dx: -150, dy: 60 },
            { t0: wf(9, "pharynx"), t1: s_(10), pt: AW_PT.pharynx, text: "pharynx", dx: 160, dy: -20 },
            { t0: wf(9, "larynx"), t1: s_(10), pt: AW_PT.larynx, text: "larynx", dx: -160, dy: 0 },
            { t0: wf(9, "trachea"), t1: s_(10), pt: AW_PT.trachea, text: "trachea", dx: 160, dy: 0 },
            { t0: wf(9, "bronchi"), t1: s_(10), pt: AW_PT.lmain, text: "bronchi", dx: 150, dy: 60 },
            { t0: wf(9, "terminal"), t1: s_(10), pt: AW_PT.bronchioles, text: "terminal bronchioles", dx: -60, dy: 150, hot: true },
            { t0: wf(10, "respiratory", 1), pt: AW_PT.bronchioles, text: "respiratory bronchioles", dx: -40, dy: -120, col: "#F6E3A1" },
            { t0: wf(10, "alveoli"), pt: AW_PT.alveoli, text: "alveoli", dx: 140, dy: 80, hot: true },
          ]}>
          <AirwayMap t={t} w={900} air={1} lit={{ conducting: cond, respiratory: resp }} />
        </ZoomBox>
        <ViewTag t={t} t0={a + 0.3} x={24} y={20} text="AIRWAY · FROM THE FRONT · SCHEMATIC" />
        <div style={abs(1060, 0, { width: 740 })}>
          <div style={pop(t, s_(7))}><Big size={56}>2 working zones</Big></div>
          <div style={abs(0, 90, { width: 740, borderRadius: 30, background: C.card, border: `4px solid ${ramp(t, cond.a, cond.a + 0.3) > 0.5 && t < cond.b ? C.banana : C.line}`, padding: "18px 26px", boxSizing: "border-box", ...pop(t, wf(8, "conducting")) })}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest }}>CONDUCTING ZONE</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
              <Chip t={t} t0={wf(8, "moves")} bg={C.forest} size={28}>moves air</Chip>
              <Chip t={t} t0={wf(8, "filters")} bg={C.matcha} size={28}>filters</Chip>
              <Chip t={t} t0={wf(8, "warms")} bg={RC.mucosaDark} size={28}>warms</Chip>
              <Chip t={t} t0={wf(8, "humidifies")} bg={RC.airDark} size={28}>humidifies</Chip>
              <Chip t={t} t0={wf(8, "no")} bg={C.red} size={28}>NO gas exchange</Chip>
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.matcha, marginTop: 12, opacity: ramp(t, wf(9, "nose"), wf(9, "nose") + 0.4) }}>nose → … → terminal bronchioles</div>
          </div>
          <div style={abs(0, 420, { width: 740, borderRadius: 30, background: C.forest, padding: "18px 26px", boxSizing: "border-box", ...pop(t, wf(10, "respiratory")) })}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.banana }}>RESPIRATORY ZONE</div>
            <div style={{ marginTop: 10 }}><Chip t={t} t0={wf(10, "gas")} bg={C.banana} color={C.forest} size={30}>gas exchange happens here</Chip></div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.matchaLight, marginTop: 12, opacity: ramp(t, wf(10, "starts"), wf(10, "starts") + 0.4) }}>respiratory bronchioles → alveoli</div>
          </div>
        </div>
      </Seg>
      <Seg t={t} a={m1} b={b + 0.1}>
        <ZoomBox x={0} y={0} w={1000} h={740} t={t} t0={m1} keys={[[m1, 1.0, 0.5, 0.55], [wf(12, "goblet"), 1.5, 0.45, 0.5], [wf(12, "cilia"), 1.6, 0.6, 0.35], [s_(13), 1.0, 0.5, 0.5]]}
          pins={[
            { t0: wf(11, "pseudostratified"), t1: wf(12, "goblet"), pt: [450, 480], text: "nuclei at different heights", dx: 0, dy: 170 },
            { t0: wf(12, "goblet"), pt: [372, 360], text: "goblet cell", dx: -30, dy: 250, hot: true },
            { t0: wf(12, "mucus"), pt: [520, 196], text: "mucus traps dust", dx: -120, dy: -110, col: RC.mucus },
            { t0: wf(12, "cilia"), pt: [560, 250], text: "cilia sweep", dx: 120, dy: -110, hot: true },
          ]}>
          <Cilia t={t} w={900} flow={1} lit={{ cells: win(wf(11, "pseudostratified"), wf(12, "goblet")), goblet: win(wf(12, "goblet"), wf(12, "mucus") + 0.6), mucus: win(wf(12, "mucus"), wf(12, "cilia")), cilia: win(wf(12, "cilia"), s_(13)) }} />
        </ZoomBox>
        <ViewTag t={t} t0={m1 + 0.3} x={24} y={20} text="AIRWAY LINING · MAGNIFIED · SCHEMATIC" />
        <div style={abs(1060, 640, { opacity: ramp(t, wf(12, "throat"), wf(12, "throat") + 0.4) * (1 - ramp(t, s_(13), s_(13) + 0.3)), fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.forest })}>mucus moves up toward the throat →</div>
        <Facts x={1060} y={0} w={740} items={[
          { t: wf(11, "special"), text: "pseudostratified ciliated columnar epithelium", bg: C.forest },
          { t: wf(12, "goblet"), text: "goblet cells → make mucus" },
          { t: wf(12, "cilia"), text: "cilia → sweep mucus to the throat", bg: RC.airDark },
          { t: s_(13), text: "a filter that keeps cleaning itself", bg: C.red },
        ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 2. NOSE AND PHARYNX ================= */
export const SNose: React.FC = () => {
  const t = useT();
  const a = ST(2), b = BE(2), m1 = s_(15) - 0.2, m2 = s_(16) - 0.2, m3 = s_(19) - 0.2, m4 = s_(20) - 0.2;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={m1}>
        <KPlate {...NOSE} x={0} y={0} w={814} a={a} b={m1} keys={[[a, 1.0, 0.5, 0.5], [wf(14, "nostrils"), 1.5, 0.2, 0.6], [wf(14, "nasal"), 1.1, 0.45, 0.5]]}
          labels={[
            { x: 0.12, y: 0.655, text: "nostril (naris)", t: wf(14, "nostrils"), side: "r", hot: true },
            { x: 0.47, y: 0.40, text: "nasal cavity", t: wf(14, "nasal"), side: "r", hot: true },
          ]} />
        <ViewTag t={t} t0={a + 0.3} x={20} y={690} text="GRAY'S 1918 · FIG. 855 · LATERAL WALL OF NASAL CAVITY" />
        <div style={abs(880, 20, { width: 900 })}>
          <div style={pop(t, s_(14))}><Big size={66}>Air comes in through the <Mk p={ramp(t, wf(14, "nostrils"), wf(14, "nostrils") + 0.6)}>nostrils</Mk></Big></div>
          <div style={{ marginTop: 26 }}><Chip t={t} t0={wf(14, "nares")} bg={C.forest} size={40}>nostrils = nares (one: naris)</Chip></div>
          <div style={{ marginTop: 16 }}><Chip t={t} t0={wf(14, "nasal")} bg={RC.mucosaDark} size={40}>→ nasal cavity</Chip></div>
        </div>
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <ZoomBox x={0} y={0} w={1000} h={740} t={t} t0={m1} keys={[[m1, 1.0, 0.5, 0.5], [wf(15, "cartilage"), 1.25, 0.65, 0.45], [wf(15, "bone"), 1.15, 0.42, 0.45]]}
          pins={[
            { t0: wf(15, "cartilage"), pt: SE_PT.cart, text: "septal cartilage", dx: 60, dy: 150, hot: true },
            { t0: wf(15, "vomer"), pt: SE_PT.vomer, text: "vomer", dx: -60, dy: 140 },
            { t0: wf(15, "ethmoid"), pt: SE_PT.perp, text: "ethmoid (perpendicular plate)", dx: 0, dy: -150 },
          ]}>
          <Septum t={t} w={900} lit={{ cart: win(wf(15, "cartilage"), wf(15, "bone")), vomer: win(wf(15, "vomer"), m2 + 0.3), perp: win(wf(15, "ethmoid"), m2 + 0.3) }} />
        </ZoomBox>
        <ViewTag t={t} t0={m1 + 0.3} x={24} y={20} text="NASAL SEPTUM · SIDE VIEW · FRONT → RIGHT · SCHEMATIC" />
        <Facts x={1060} y={0} w={740} items={[
          { t: wf(15, "septum"), text: "nasal septum: splits the cavity into right + left", bg: C.forest },
          { t: wf(15, "front"), text: "front = cartilage" },
          { t: wf(15, "back"), text: "back = bone: vomer + ethmoid", bg: C.matcha },
        ]} />
      </Seg>
      <Seg t={t} a={m2} b={m3}>
        <KPlate {...NOSE} x={0} y={0} w={780} a={m2} b={m3} keys={[[m2, 1.0, 0.5, 0.5], [wf(16, "superior"), 1.3, 0.45, 0.52], [wf(17, "meatus"), 1.3, 0.45, 0.6], [s_(18), 1.1, 0.45, 0.55]]}
          labels={[
            { x: 0.56, y: 0.445, text: "superior concha", t: wf(16, "superior"), side: "r", col: "#F6E3A1", t1: wf(17, "meatus") },
            { x: 0.53, y: 0.53, text: "middle concha", t: wf(16, "middle"), side: "r", hot: true, t1: wf(17, "meatus") },
            { x: 0.56, y: 0.635, text: "inferior concha", t: wf(16, "inferior"), side: "r", col: "#F6E3A1", t1: wf(17, "meatus") },
            { x: 0.33, y: 0.585, text: "middle meatus", t: wf(17, "meatus"), side: "r", col: "#BFE3F0" },
            { x: 0.35, y: 0.70, text: "inferior meatus", t: wf(17, "meatus") + 0.4, side: "r", col: "#BFE3F0" },
          ]} />
        <div style={{ opacity: 1 - ramp(t, s_(18) - 0.3, s_(18)) }}><Note t={t} t0={wf(16, "middle") + 0.8} old="concha media" modern="middle concha" x={20} y={20} /></div>
        <ViewTag t={t} t0={m2 + 0.3} x={20} y={672} text="GRAY'S 1918 · FIG. 855" />
        <ZoomBox x={820} y={0} w={980} h={740} t={t} t0={m2 + 0.2} keys={[[m2, 1.0, 0.5, 0.5], [wf(16, "superior"), 1.6, 0.5, 0.6], [s_(18), 1.4, 0.5, 0.62]]}
          pins={[
            { t0: wf(16, "superior"), pt: SI_PT.conchaS, text: "superior", dx: -190, dy: -30 },
            { t0: wf(16, "middle"), pt: SI_PT.conchaM, text: "middle", dx: -190, dy: 0 },
            { t0: wf(16, "inferior"), pt: SI_PT.conchaI, text: "inferior", dx: -190, dy: 30 },
            { t0: wf(17, "meatus"), pt: [480, 512], text: "meatus = air passage", dx: 210, dy: 40, hot: true },
            { t0: wf(16, "side"), pt: SI_PT.septum, text: "septum", dx: 0, dy: 190 },
          ]}>
          <Sinuses t={t} w={900} lit={{ conchaS: win(wf(16, "superior"), wf(16, "middle")), conchaM: win(wf(16, "middle"), wf(16, "inferior")), conchaI: win(wf(16, "inferior"), s_(17)), meatus: wf(17, "meatus") }} />
        </ZoomBox>
        <ViewTag t={t} t0={m2 + 0.5} x={844} y={20} text="NASAL CAVITY · FRONT SECTION · SCHEMATIC" />
        <div style={abs(860, 640, { zIndex: 8 })}><Chip t={t} t0={wf(18, "swirl")} bg={C.forest} size={32}>conchae make air swirl → touches warm, moist lining</Chip></div>
      </Seg>
      <Seg t={t} a={m3} b={m4}>
        <ZoomBox x={0} y={0} w={1000} h={740} t={t} t0={m3} keys={[[m3, 1.0, 0.5, 0.5]]}
          pins={[
            { t0: wf(19, "frontal"), pt: SI_PT.frontal, text: "frontal", dx: 220, dy: -30, hot: true },
            { t0: wf(19, "maxillary"), pt: SI_PT.maxillary, text: "maxillary", dx: 200, dy: 60, hot: true },
            { t0: wf(19, "sphenoid"), pt: SI_PT.sphenoid, text: "sphenoid (deep, behind)", dx: 260, dy: 30, col: "#E7DDF3" },
            { t0: wf(19, "ethmoid"), pt: SI_PT.ethmoid, text: "ethmoid air cells", dx: -250, dy: -120, hot: true },
          ]}>
          <Sinuses t={t} w={900} lit={{ frontal: win(wf(19, "frontal"), wf(19, "maxillary")), maxillary: win(wf(19, "maxillary"), wf(19, "sphenoid")), sphenoid: win(wf(19, "sphenoid"), wf(19, "ethmoid")), ethmoid: win(wf(19, "ethmoid"), wf(19, "mucus")) }} />
        </ZoomBox>
        <ViewTag t={t} t0={m3 + 0.3} x={24} y={20} text="PARANASAL SINUSES · FRONT · SCHEMATIC" />
        <Facts x={1060} y={0} w={740} items={[
          { t: s_(19), text: "paranasal sinuses = air spaces around the nasal cavity", bg: C.forest },
          { t: wf(19, "frontal"), text: "frontal · maxillary · sphenoid · ethmoid", big: "4" },
          { t: wf(19, "mucus"), text: "they make mucus", bg: RC.airDark },
          { t: wf(19, "lighter"), text: "…and make the skull lighter", bg: C.matcha },
        ]} />
      </Seg>
      <Seg t={t} a={m4} b={b + 0.1}>
        <ZoomBox x={0} y={0} w={940} h={740} t={t} t0={m4} keys={[[m4, 1.0, 0.5, 0.5], [wf(21, "nasopharynx"), 1.2, 0.46, 0.3], [wf(22, "oropharynx"), 1.2, 0.46, 0.45], [wf(23, "laryngopharynx"), 1.2, 0.46, 0.65]]}
          pins={[
            { t0: wf(21, "nasopharynx"), pt: PH_PT.naso, text: "nasopharynx", dx: 60, dy: 90, hot: true },
            { t0: wf(21, "pharyngeal"), pt: PH_PT.adenoid, text: "adenoid", dx: -150, dy: 40, col: "#F2C4D6" },
            { t0: wf(22, "oropharynx"), pt: PH_PT.oro, text: "oropharynx", dx: -190, dy: 0, hot: true },
            { t0: wf(22, "palatine"), pt: PH_PT.tonsil, text: "palatine tonsil", dx: 190, dy: -10, col: "#F2C4D6" },
            { t0: wf(23, "laryngopharynx"), pt: PH_PT.laryngo, text: "laryngopharynx", dx: -220, dy: 0, hot: true },
            { t0: wf(23, "larynx"), pt: PH_PT.larynx, text: "larynx (front)", dx: 200, dy: 0 },
            { t0: wf(23, "esophagus"), pt: PH_PT.esoph, text: "esophagus (behind)", dx: -220, dy: 30 },
          ]}>
          <Pharynx t={t} w={900} air={ramp(t, m4, m4 + 0.5) * (1 - ramp(t, s_(22), s_(22) + 0.3)) + ramp(t, s_(23), s_(23) + 0.3)} bolus={ramp(t, wf(22, "food"), wf(22, "food") + 2.2)}
            lit={{ naso: win(wf(21, "nasopharynx"), s_(22)), adenoid: win(wf(21, "pharyngeal"), s_(22)), oro: win(wf(22, "oropharynx"), s_(23)), tonsil: win(wf(22, "palatine"), s_(23)), laryngo: win(wf(23, "laryngopharynx"), b), larynx: win(wf(23, "larynx"), b), esoph: win(wf(23, "esophagus"), b) }} />
        </ZoomBox>
        <ViewTag t={t} t0={m4 + 0.3} x={24} y={20} text="HEAD AND NECK · MIDLINE SECTION · SCHEMATIC" />
        <KPlate {...SAG} x={970} y={0} w={512} a={m4 + 0.2} b={b} keys={[[m4, 1.0, 0.5, 0.5], [wf(21, "nasopharynx"), 1.4, 0.45, 0.35], [wf(22, "oropharynx"), 1.4, 0.45, 0.52], [wf(23, "laryngopharynx"), 1.4, 0.45, 0.7]]}
          labels={[
            { x: 0.36, y: 0.36, text: "nasopharynx", t: wf(21, "nasopharynx"), side: "r", hot: true, t1: s_(22) },
            { x: 0.385, y: 0.52, text: "oropharynx", t: wf(22, "oropharynx"), side: "r", hot: true, t1: s_(23) },
            { x: 0.375, y: 0.68, text: "laryngopharynx", t: wf(23, "laryngopharynx"), side: "l", hot: true },
          ]} />
        <div style={abs(980, 690, { zIndex: 6 })}><ViewTag t={t} t0={m4 + 0.6} x={0} y={0} text="GRAY'S 1918 · FIG. 994" /></div>
        <div style={abs(1500, 0, { display: "flex", flexDirection: "column", gap: 14 })}>
          <div><Chip t={t} t0={s_(20)} bg={C.forest} size={30}>pharynx = throat</Chip></div>
          {([["naso-", "air only", wf(21, "nasopharynx"), "#FFFFFF"], ["oro-", "air + food", wf(22, "oropharynx"), RC.mid], ["laryngo-", "→ larynx + esophagus", wf(23, "laryngopharynx"), RC.inf]] as [string, string, number, string][]).map(([h, s, tt, col], i) => (
            <div key={h} style={{ ...pop(t, tt), width: 300, background: C.card, border: `3px solid ${C.line}`, borderRadius: 22, padding: "10px 16px", boxSizing: "border-box", fontFamily: FONT, fontWeight: 800, transformOrigin: "0% 50%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 18, background: col, border: `3px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: C.forest }}>{i + 1}</div>
                <div style={{ fontSize: 32, color: C.forest }}>{h}</div>
              </div>
              <div style={{ fontSize: 24, color: C.matcha, marginTop: 4 }}>{s}</div>
            </div>
          ))}
        </div>
        <div style={abs(1500, 560, { width: 290, opacity: ramp(t, wf(21, "nasopharynx") + 1.2, wf(21, "nasopharynx") + 1.6) })}>
          <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 20, color: C.forest }}><span style={{ color: C.matcha }}>1918 atlas name:</span> nasal / oral / laryngeal part of pharynx</div>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 3. THE LARYNX ================= */
const Single: React.FC<{ t: number; items: [string, string, number, string][]; x: number; y: number; w?: number }> = ({ t, items, x, y, w = 740 }) => (
  <div style={abs(x, y, { display: "flex", flexDirection: "column", gap: 14 })}>
    {items.map(([h, s, tt, col], i) => <Row key={h} t={t} t0={tt} col={col} n={String(i + 1)} title={h} sub={s} w={w} />)}
  </div>
);
export const SLarynx: React.FC = () => {
  const t = useT();
  const a = ST(3), b = BE(3), m1 = s_(26) - 0.2, m2 = s_(30) - 0.2, m3 = s_(31) - 0.2;
  const sw = ramp(t, wf(29, "swallow"), wf(29, "swallow") + 0.8) * (1 - ramp(t, e_(29) + 0.1, e_(29) + 0.6));
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={m1}>
        <KPlate {...TREE} x={0} y={0} w={573} a={a} b={m1} keys={[[a, 2.1, 0.43, 0.14], [wf(25, "nine"), 2.3, 0.43, 0.14], [wf(25, "pairs"), 1.9, 0.43, 0.17]]}
          labels={[
            { x: 0.47, y: 0.045, text: "epiglottis", t: wf(25, "three"), side: "r", col: "#F6E3A1" },
            { x: 0.51, y: 0.13, text: "thyroid", t: wf(25, "three") + 0.3, side: "r", col: "#F6E3A1" },
            { x: 0.51, y: 0.215, text: "cricoid", t: wf(25, "three") + 0.6, side: "r", col: "#F6E3A1" },
          ]} />
        <div style={{ opacity: 1 - ramp(t, m1 - 0.4, m1) }}><Note t={t} t0={a + 1.2} old="superior / inferior cornu" modern="horn" x={20} y={620} /></div>
        <ViewTag t={t} t0={a + 0.3} x={20} y={690} text="GRAY'S 1918 · FIG. 961 · LARYNX" />
        <div style={abs(640, 0, { width: 1150 })}>
          <div style={pop(t, s_(24))}><Big size={76}>The <Mk p={ramp(t, wf(24, "larynx"), wf(24, "larynx") + 0.6)}>larynx</Mk> = voice box</Big></div>
          <div style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 20 }}>
            <Chip t={t} t0={wf(24, "connects")} bg={RC.mucosaDark} size={38}>pharynx</Chip>
            <Chip t={t} t0={wf(24, "connects") + 0.2} bg={C.card} color={C.forest} size={38}>→ larynx →</Chip>
            <Chip t={t} t0={wf(24, "trachea")} bg={C.forest} size={38}>trachea</Chip>
          </div>
          <div style={abs(0, 230, { ...pop(t, wf(25, "nine")), background: C.forest, borderRadius: 34, padding: "22px 34px", width: 1100, boxSizing: "border-box", fontFamily: FONT, fontWeight: 800 })}>
            <div style={{ fontSize: 130, color: C.banana, lineHeight: 1 }}>9 <span style={{ fontSize: 54, color: C.paper }}>cartilages</span></div>
            <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
              <Chip t={t} t0={wf(25, "three")} bg={C.banana} color={C.forest} size={36}>3 large, single</Chip>
              <Chip t={t} t0={wf(25, "pairs")} bg={C.matchaLight} color={C.forest} size={36}>3 small pairs (× 2)</Chip>
            </div>
          </div>
        </div>
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <ZoomBox x={0} y={0} w={1000} h={740} t={t} t0={m1} keys={[[m1, 1.0, 0.5, 0.5], [wf(26, "adam's"), 1.6, 0.5, 0.26], [s_(27), 1.4, 0.5, 0.55], [s_(28), 1.4, 0.5, 0.2], [s_(29), 1.0, 0.5, 0.5]]}
          pins={[
            { t0: wf(26, "thyroid"), pt: LX_PT.thyroid, text: "thyroid cartilage", dx: 220, dy: -40, hot: true },
            { t0: wf(26, "adam's"), pt: LX_PT.prominence, text: "laryngeal prominence = Adam's apple", dx: -60, dy: 140, col: C.banana },
            { t0: wf(27, "cricoid"), pt: LX_PT.cricoid, text: "cricoid cartilage", dx: 220, dy: 30, hot: true },
            { t0: wf(28, "epiglottis"), pt: LX_PT.epiglottis, text: "epiglottis", dx: 200, dy: 0, hot: true },
            { t0: wf(26, "thyroid") + 0.6, t1: s_(28), pt: LX_PT.hyoid, text: "hyoid bone", dx: 150, dy: 10, col: RC.bone },
            { t0: s_(27) + 1, pt: LX_PT.trachea, text: "trachea", dx: 190, dy: 40 },
          ]}>
          <LarynxFront t={t} w={900} lit={{ thyroid: win(wf(26, "thyroid"), s_(27)), prominence: win(wf(26, "adam's"), s_(27)), cricoid: win(wf(27, "cricoid"), s_(28)), epiglottis: win(wf(28, "epiglottis"), m2) }} />
        </ZoomBox>
        <ViewTag t={t} t0={m1 + 0.3} x={24} y={20} text="LARYNX · FROM THE FRONT · SCHEMATIC" />
        <Seg t={t} a={m1} b={s_(29) - 0.1}>
          <Single t={t} x={1060} y={0} items={[
            ["thyroid cartilage", "biggest · at the front · Adam's apple", wf(26, "thyroid"), RC.cart],
            ["cricoid cartilage", "a full ring · wide back, narrow front", wf(27, "cricoid"), RC.cart],
            ["epiglottis", "leaf-shaped flap on top", wf(28, "epiglottis"), "#F4E3A6"],
          ]} />
        </Seg>
        <Seg t={t} a={s_(29) - 0.1} b={m2 + 0.1}>
          <ZoomBox x={1040} y={0} w={760} h={740} t={t} t0={s_(29) - 0.1} keys={[[s_(29), 1.35, 0.5, 0.55]]}
            pins={[{ t0: wf(29, "epiglottis"), pt: PH_PT.epiglottis, text: "epiglottis swings down", dx: 130, dy: -150, hot: true }, { t0: wf(29, "esophagus"), pt: PH_PT.esoph, text: "food → esophagus", dx: -120, dy: 90, col: RC.food }]}>
            <Pharynx t={t} w={900} swallow={sw} bolus={ramp(t, wf(29, "swallow") + 0.3, wf(29, "esophagus") + 0.5)} lit={{ epiglottis: wf(29, "epiglottis"), esoph: wf(29, "esophagus") }} />
          </ZoomBox>
          <ViewTag t={t} t0={s_(29) + 0.2} x={1064} y={20} text="SWALLOWING · SIDE VIEW" />
        </Seg>
      </Seg>
      <Seg t={t} a={m2} b={m3}>
        <ZoomBox x={0} y={0} w={1000} h={740} t={t} t0={m2} keys={[[m2, 1.5, 0.5, 0.38]]}
          pins={[
            { t0: wf(30, "arytenoid"), pt: LX_PT.arytenoid, text: "arytenoid ×2", dx: -230, dy: 40, hot: true },
            { t0: wf(30, "corniculate"), pt: LX_PT.corniculate, text: "corniculate ×2", dx: -230, dy: -60, col: "#BFD7EE" },
            { t0: wf(30, "cuneiform"), pt: LX_PT.cuneiform, text: "cuneiform ×2", dx: -150, dy: -140, col: "#BFD7EE" },
          ]}>
          <LarynxFront t={t} w={900} xray={1} lit={{ arytenoid: win(wf(30, "arytenoid"), wf(30, "corniculate")), corniculate: win(wf(30, "corniculate"), wf(30, "cuneiform")), cuneiform: win(wf(30, "cuneiform"), m3 + 0.3) }} />
        </ZoomBox>
        <ViewTag t={t} t0={m2 + 0.3} x={24} y={20} text="LARYNX · FRONT · SMALL CARTILAGES SEEN 'THROUGH' THE THYROID" />
        <Single t={t} x={1060} y={0} items={[
          ["arytenoid", "pair · sits on the back of the cricoid", wf(30, "arytenoid"), "#E7DDF3"],
          ["corniculate", "pair · tiny horns on the arytenoids", wf(30, "corniculate"), "#BFD7EE"],
          ["cuneiform", "pair · small wedges in the folds", wf(30, "cuneiform"), "#BFD7EE"],
        ]} />
      </Seg>
      <Seg t={t} a={m3} b={b + 0.1}>
        <ZoomBox x={0} y={0} w={940} h={740} t={t} t0={m3} keys={[[m3, 1.0, 0.5, 0.5]]}
          pins={[
            { t0: wf(31, "vocal"), t1: wf(33, "glottis"), pt: GL_PT.vocal, text: "true vocal fold", dx: 30, dy: 220, hot: true },
            { t0: wf(31, "thyroid"), pt: GL_PT.front, text: "front: thyroid cartilage", dx: 260, dy: 0 },
            { t0: wf(31, "arytenoids"), t1: s_(32), pt: GL_PT.arytenoid, text: "back: arytenoids", dx: -120, dy: 60 },
            { t0: wf(32, "vestibular"), pt: GL_PT.vestibular, text: "vestibular (false) fold", dx: -60, dy: -170, col: "#F3B5A8" },
            { t0: wf(33, "glottis"), pt: [450, 470], text: "glottis", dx: 230, dy: 120, col: C.banana },
          ]}>
          <Glottis t={t} w={900} open={0.6 - 0.45 * ramp(t, wf(33, "rushes"), wf(33, "rushes") + 0.4)} vib={ramp(t, wf(33, "vibrate"), wf(33, "vibrate") + 0.3)}
            lit={{ vocal: win(wf(31, "vocal"), s_(32)), thyroid: win(wf(31, "thyroid"), wf(31, "arytenoids")), arytenoid: win(wf(31, "arytenoids"), s_(32)), vestibular: win(wf(32, "vestibular"), s_(33)), glottis: win(wf(33, "glottis"), wf(33, "rushes")), vocalB: 0 }} />
        </ZoomBox>
        <ViewTag t={t} t0={m3 + 0.3} x={24} y={20} text="LOOKING DOWN INTO THE LARYNX · FRONT AT TOP · SCHEMATIC" />
        <KPlate {...SAG} x={970} y={0} w={512} a={m3 + 0.2} b={b} keys={[[m3, 2.4, 0.48, 0.79]]}
          labels={[
            { x: 0.49, y: 0.762, text: "vestibular fold", t: wf(32, "vestibular"), side: "l", col: "#F3B5A8" },
            { x: 0.49, y: 0.79, text: "vocal fold", t: wf(31, "vocal"), side: "l", hot: true },
          ]} />
        <div style={abs(980, 690, { zIndex: 6 })}><ViewTag t={t} t0={m3 + 0.6} x={0} y={0} text="GRAY'S 1918 · FIG. 994" /></div>
        <div style={abs(1500, 0, { width: 300, display: "flex", flexDirection: "column", gap: 14 })}>
          <Chip t={t} t0={wf(31, "vocal")} bg={C.forest} size={26}>vocal folds</Chip>
          <Chip t={t} t0={wf(32, "vestibular")} bg={"#E58C83"} size={26}>vestibular = false</Chip>
          <Chip t={t} t0={wf(33, "glottis")} bg={C.banana} color={C.forest} size={26}>folds + gap = glottis</Chip>
          <Chip t={t} t0={wf(33, "vibrate")} bg={C.red} size={26}>edges vibrate = voice</Chip>
        </div>
        <div style={abs(1500, 400, { width: 296, opacity: ramp(t, wf(32, "vestibular") + 0.6, wf(32, "vestibular") + 1) })}>
          <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 22, color: C.forest }}><span style={{ color: C.matcha }}>1918 atlas name:</span> ventricular fold = vestibular fold</div>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 4. TRACHEA AND BRONCHI ================= */
export const STrachea: React.FC = () => {
  const t = useT();
  const a = ST(4), b = BE(4), m1 = s_(36) - 0.2, m2 = s_(37) - 0.2, m3 = s_(41) - 0.2;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={m1}>
        <KPlate {...TREE} x={0} y={0} w={573} a={a} b={m1} keys={[[a, 1.0, 0.5, 0.5], [s_(35), 1.35, 0.45, 0.36]]}
          labels={[
            { x: 0.39, y: 0.42, text: "trachea", t: wf(34, "trachea"), side: "l", hot: true },
            { x: 0.39, y: 0.305, text: "C-shaped ring", t: wf(35, "rings"), side: "l", col: "#BFD7EE" },
          ]} />
        <ViewTag t={t} t0={a + 0.3} x={20} y={690} text="GRAY'S 1918 · FIG. 961 · FRONT VIEW" />
        <div style={abs(640, 0, { width: 1150 })}>
          <div style={pop(t, s_(34))}><Big size={76}>The <Mk p={ramp(t, wf(34, "trachea"), wf(34, "trachea") + 0.6)}>trachea</Mk> = windpipe</Big></div>
        </div>
        <Facts x={640} y={130} w={1100} items={[
          { t: wf(35, "sixteen"), text: "C-shaped rings hold it open", big: "16–20", bg: C.forest },
          { t: wf(35, "hyaline"), text: "made of hyaline cartilage" },
        ]} />
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <ZoomBox x={0} y={0} w={1000} h={740} t={t} t0={m1} keys={[[m1, 1.0, 0.5, 0.5], [wf(36, "trachealis"), 1.3, 0.5, 0.7]]}
          pins={[
            { t0: m1 + 0.4, pt: TX_PT.ring, text: "C-shaped ring", dx: 160, dy: -60, col: "#BFD7EE" },
            { t0: wf(36, "backward"), pt: [450, 515], text: "open part faces back", dx: 280, dy: -40, hot: true },
            { t0: wf(36, "esophagus"), pt: TX_PT.esoph, text: "esophagus", dx: 280, dy: 10, col: "#F2CFA4" },
            { t0: wf(36, "trachealis"), pt: TX_PT.trachealis, text: "trachealis (smooth muscle)", dx: -270, dy: 40, hot: true },
          ]}>
          <TracheaX t={t} w={900} lit={{ ring: win(m1 + 0.3, wf(36, "backward")), esoph: win(wf(36, "esophagus"), wf(36, "trachealis")), trachealis: wf(36, "trachealis") }} />
        </ZoomBox>
        <ViewTag t={t} t0={m1 + 0.3} x={24} y={20} text="TRACHEA · CROSS-SECTION · FRONT AT TOP · SCHEMATIC" />
        <div style={abs(40, 70)}><Chip t={t} t0={m1 + 0.6} bg={C.card} color={C.forest} size={26}>FRONT ↑</Chip></div>
        <div style={abs(40, 660)}><Chip t={t} t0={m1 + 0.6} bg={C.card} color={C.forest} size={26}>BACK ↓</Chip></div>
        <Facts x={1060} y={0} w={740} items={[
          { t: wf(36, "open"), text: "the open side of each C faces backward", bg: C.forest },
          { t: wf(36, "esophagus"), text: "…toward the esophagus" },
          { t: wf(36, "trachealis"), text: "closed by the trachealis muscle", bg: C.red },
        ]} />
      </Seg>
      <Seg t={t} a={m2} b={m3}>
        <KPlate {...TREE} x={0} y={0} w={573} a={m2} b={m3} keys={[[m2, 1.4, 0.45, 0.66], [s_(39), 1.3, 0.42, 0.7]]}
          labels={[
            { x: 0.43, y: 0.648, text: "carina", t: wf(38, "carina"), side: "r", hot: true, t1: s_(39) },
            { x: 0.32, y: 0.69, text: "right main", t: wf(37, "right"), side: "l", col: C.banana },
            { x: 0.55, y: 0.715, text: "left main", t: wf(37, "left"), side: "r", col: "#BFD7EE" },
          ]} />
        <ViewTag t={t} t0={m2 + 0.3} x={20} y={690} text="GRAY'S 1918 · FIG. 961" />
        <ZoomBox x={610} y={0} w={1190} h={740} t={t} t0={m2 + 0.2} cw={900} ch={700} keys={[[m2, 1.0, 0.5, 0.45], [wf(38, "carina"), 1.6, 0.5, 0.38], [s_(39), 1.05, 0.5, 0.5]]}
          pins={[
            { t0: wf(37, "sternal"), t1: wf(38, "carina"), pt: BT_PT.trachea, text: "≈ sternal angle level", dx: 200, dy: 0 },
            { t0: wf(38, "carina"), t1: s_(39), pt: BT_PT.carina, text: "carina · cough reflex", dx: 230, dy: -40, hot: true },
            { t0: wf(39, "right"), pt: BT_PT.rmain, text: "RIGHT main", dx: -200, dy: -40, col: C.banana },
            { t0: wf(37, "left"), pt: BT_PT.lmain, text: "LEFT main", dx: 160, dy: -70, col: "#BFD7EE" },
          ]}>
          <BronchTree t={t} w={900} angles={ramp(t, wf(39, "vertical"), wf(39, "vertical") + 0.4)} drop={ramp(t, wf(40, "inhaled"), e_(40) + 0.2)}
            lit={{ trachea: win(s_(37), wf(38, "carina")), carina: win(wf(38, "carina"), s_(39)), rmain: win(wf(39, "right"), m3 + 0.3), lmain: win(wf(37, "left"), wf(38, "carina")) }} />
        </ZoomBox>
        <ViewTag t={t} t0={m2 + 0.5} x={634} y={20} text="BRONCHIAL TREE · FROM THE FRONT · SCHEMATIC" />
        <div style={abs(1260, 470, { display: "flex", flexDirection: "column", gap: 12, zIndex: 8 })}>
          <Chip t={t} t0={wf(39, "wider")} bg={C.forest} size={34}>right = wider</Chip>
          <Chip t={t} t0={wf(39, "shorter")} bg={C.forest} size={34}>shorter</Chip>
          <Chip t={t} t0={wf(39, "vertical")} bg={C.red} size={34}>more vertical</Chip>
        </div>
        <div style={abs(640, 640, { zIndex: 8 })}><Chip t={t} t0={wf(40, "inhaled")} bg={C.banana} color={C.forest} size={32}>inhaled object → more often RIGHT</Chip></div>
      </Seg>
      <Seg t={t} a={m3} b={b + 0.1}>
        <ZoomBox x={0} y={0} w={1000} h={740} t={t} t0={m3} keys={[[m3, 1.0, 0.5, 0.5], [wf(42, "segmental"), 1.2, 0.35, 0.45], [s_(43), 1.35, 0.3, 0.6], [s_(44), 1.45, 0.25, 0.65]]}
          pins={[
            { t0: wf(41, "three"), t1: s_(42), pt: BT_PT.lobarR, text: "3 lobar (right)", dx: -40, dy: -120, hot: true },
            { t0: wf(41, "two"), t1: s_(42), pt: BT_PT.lobarL, text: "2 lobar (left)", dx: 20, dy: -120, hot: true },
            { t0: wf(42, "segmental"), t1: s_(43), pt: BT_PT.segmental, text: "segmental bronchi", dx: 120, dy: -110, col: "#F6E3A1" },
            { t0: wf(43, "bronchioles"), t1: s_(44), pt: BT_PT.bronchioles, text: "bronchioles · ~1 mm", dx: 130, dy: 90, hot: true },
            { t0: wf(44, "terminal"), pt: BT_PT.terminal, text: "terminal bronchioles", dx: 140, dy: -70, col: C.banana },
          ]}>
          <BronchTree t={t} w={900} lit={{ lobarR: win(wf(41, "lobar"), s_(42)), lobarL: win(wf(41, "lobar"), s_(42)), segmental: win(wf(42, "segmental"), s_(43)), bronchioles: win(wf(43, "bronchioles"), s_(44)), terminal: wf(44, "terminal") }} />
        </ZoomBox>
        <ViewTag t={t} t0={m3 + 0.3} x={24} y={20} text="BRONCHIAL TREE · SCHEMATIC" />
        <Chain t={t} x={1060} y={0} w={740} size={32} items={[
          ["main bronchi", s_(41), "#BFD7EE"],
          ["lobar bronchi · 3 right, 2 left", wf(41, "lobar"), C.banana],
          ["segmental bronchi → 1 segment each", wf(42, "segmental"), "#F6E3A1"],
          ["bronchioles · ~1 mm, no cartilage", wf(43, "bronchioles"), RC.mucosa],
          ["terminal bronchioles · >1,000 per lung", wf(44, "terminal"), C.red],
        ]} />
        <div style={abs(1060, 640)}><Chip t={t} t0={wf(43, "smooth")} bg={C.forest} size={28}>smooth muscle can narrow or widen them</Chip></div>
      </Seg>
    </Stage>
  );
};

/* ================= 5. LUNGS AND PLEURA ================= */
export const SLungs: React.FC = () => {
  const t = useT();
  const a = ST(5), b = BE(5), m1 = s_(47) - 0.2, m2 = s_(52) - 0.2, m3 = s_(53) - 0.2;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={m1}>
        <KPlate {...THOR} x={0} y={0} w={582} a={a} b={m1} keys={[[a, 1.0, 0.5, 0.5], [wf(46, "apex"), 1.7, 0.45, 0.15], [wf(46, "base"), 1.3, 0.45, 0.65]]}
          labels={[
            { x: 0.34, y: 0.06, text: "apex", t: wf(46, "apex"), side: "l", hot: true, t1: wf(46, "base") },
            { x: 0.36, y: 0.125, text: "1st rib", t: wf(46, "first"), side: "r", col: RC.bone, t1: wf(46, "base") },
            { x: 0.16, y: 0.62, text: "lower margin of lung", t: wf(46, "base"), side: "r", col: "#E7DDF3" },
          ]} />
        <ViewTag t={t} t0={a + 0.3} x={20} y={690} text="GRAY'S 1918 · FIG. 965 · LUNGS PURPLE, PLEURA BLUE" />
        <ZoomBox x={620} y={0} w={1180} h={740} t={t} t0={a + 0.2} keys={[[a, 1.0, 0.5, 0.5], [wf(46, "apex"), 1.5, 0.35, 0.2], [wf(46, "base"), 1.3, 0.5, 0.8]]}
          pins={[
            { t0: wf(46, "apex"), pt: LU_PT.apexR, text: "apex: above the 1st rib", dx: 260, dy: 30, hot: true },
            { t0: wf(46, "base"), pt: LU_PT.base, text: "base: rests on the diaphragm", dx: 240, dy: -100, hot: true },
          ]}>
          <LungsFront t={t} w={900} ribs={ramp(t, wf(46, "first"), wf(46, "first") + 0.4)} lit={{ apex: win(wf(46, "apex"), wf(46, "base")), diaphragm: wf(46, "base") }} />
        </ZoomBox>
        <ViewTag t={t} t0={a + 0.5} x={644} y={20} text="LUNGS · FROM THE FRONT · SCHEMATIC" />
        <div style={abs(660, 70, { zIndex: 8 })}><Chip t={t} t0={wf(46, "pyramid")} bg={C.forest} size={32}>each lung: pyramid-shaped</Chip></div>
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <ZoomBox x={0} y={0} w={1000} h={740} t={t} t0={m1} keys={[[m1, 1.0, 0.5, 0.5], [s_(47), 1.35, 0.3, 0.5], [s_(49), 1.35, 0.7, 0.5], [wf(50, "cardiac"), 1.6, 0.6, 0.72], [s_(51), 1.0, 0.5, 0.55]]}
          pins={[
            { t0: wf(47, "superior"), t1: s_(49), pt: LU_PT.supR, text: "superior", dx: 0, dy: -90, col: RC.supL },
            { t0: wf(47, "middle"), t1: s_(49), pt: LU_PT.midR, text: "middle", dx: 70, dy: -40, col: RC.mid },
            { t0: wf(47, "inferior"), t1: s_(49), pt: LU_PT.infR, text: "inferior", dx: -40, dy: 90, col: RC.inf },
            { t0: wf(48, "horizontal"), t1: s_(49), pt: LU_PT.hfis, text: "horizontal fissure", dx: 0, dy: -60, hot: true },
            { t0: wf(48, "oblique"), t1: s_(49), pt: LU_PT.ofisR, text: "oblique fissure", dx: 120, dy: 90, hot: true },
            { t0: wf(49, "superior"), t1: wf(50, "cardiac"), pt: LU_PT.supL, text: "superior", dx: 30, dy: -90, col: RC.supL },
            { t0: wf(49, "inferior"), t1: wf(50, "cardiac"), pt: LU_PT.infL, text: "inferior", dx: 40, dy: 90, col: RC.inf },
            { t0: wf(49, "oblique"), t1: wf(50, "cardiac"), pt: LU_PT.ofisL, text: "oblique fissure", dx: 150, dy: -60, hot: true },
            { t0: wf(50, "cardiac"), t1: s_(51), pt: LU_PT.notch, text: "cardiac notch", dx: 160, dy: -60, hot: true },
            { t0: wf(50, "lingula"), t1: s_(51), pt: LU_PT.lingula, text: "lingula", dx: 120, dy: 70, col: C.banana },
            { t0: wf(51, "liver"), pt: LU_PT.liver, text: "liver", dx: -120, dy: -10, col: "#E2B9A0" },
            { t0: wf(51, "diaphragm"), pt: [290, 588], text: "right dome higher", dx: 40, dy: -150, hot: true },
          ]}>
          <LungsFront t={t} w={900} lit={{ supR: win(wf(47, "superior"), wf(47, "middle")), midR: win(wf(47, "middle"), wf(47, "inferior")), infR: win(wf(47, "inferior"), s_(48)), hfis: win(wf(48, "horizontal"), wf(48, "oblique")), ofisR: win(wf(48, "oblique"), s_(49)), supL: win(wf(49, "superior"), wf(49, "inferior")), infL: win(wf(49, "inferior"), wf(49, "oblique")), ofisL: win(wf(49, "oblique"), s_(50)), notch: win(wf(50, "cardiac"), wf(50, "lingula")), lingula: win(wf(50, "lingula"), s_(51)), liver: win(wf(51, "liver"), m2), diaphragm: win(wf(51, "diaphragm"), m2), lungR: win(wf(51, "right"), wf(51, "liver")) }} />
        </ZoomBox>
        <ViewTag t={t} t0={m1 + 0.3} x={24} y={20} text="LUNGS · FROM THE FRONT · PATIENT'S RIGHT ON YOUR LEFT" />
        <KPlate {...BRON} x={1040} y={0} w={700} a={m1 + 0.2} b={s_(51) - 0.2} keys={[[m1, 1.0, 0.5, 0.5], [s_(47), 1.3, 0.25, 0.45], [s_(49), 1.3, 0.75, 0.45]]}
          labels={[
            { x: 0.30, y: 0.17, text: "superior", t: wf(47, "superior"), side: "r", col: RC.supL, t1: s_(49) },
            { x: 0.17, y: 0.52, text: "middle", t: wf(47, "middle"), side: "r", col: RC.mid, t1: s_(49) },
            { x: 0.18, y: 0.75, text: "inferior", t: wf(47, "inferior"), side: "r", col: RC.inf, t1: s_(49) },
            { x: 0.74, y: 0.20, text: "superior", t: wf(49, "superior"), side: "l", col: RC.supL },
            { x: 0.78, y: 0.80, text: "inferior", t: wf(49, "inferior"), side: "l", col: RC.inf },
          ]} />
        <Seg t={t} a={s_(51) - 0.2} b={m2 + 0.1}>
          <KPlate {...HEART} x={1040} y={0} w={700} a={s_(51) - 0.2} b={m2} keys={[[s_(51), 1.0, 0.5, 0.5]]}
            labels={[
              { x: 0.17, y: 0.44, text: "right lung", t: s_(51), side: "r", hot: true },
              { x: 0.70, y: 0.44, text: "left lung", t: s_(51) + 0.3, side: "r" },
            ]} />
          <ViewTag t={t} t0={s_(51)} x={1060} y={600} text="GRAY'S 1918 · FIG. 490" />
        </Seg>
        <div style={abs(1040, 652, { zIndex: 8 })}>
          <Chip t={t} t0={s_(47)} bg={C.forest} size={30}>right: 3 lobes · 2 fissures</Chip>{" "}
          <Chip t={t} t0={s_(49)} bg={C.matcha} size={30}>left: 2 lobes · 1 fissure</Chip>
        </div>
      </Seg>
      <Seg t={t} a={m2} b={m3}>
        <KPlate {...RIGHT} x={120} y={0} w={700} a={m2} b={m3} keys={[[m2, 1.0, 0.5, 0.5], [wf(52, "hilum"), 1.2, 0.55, 0.45]]}
          labels={[
            { x: 0.53, y: 0.37, text: "bronchus", t: wf(52, "bronchus"), side: "r", col: "#BFD7EE" },
            { x: 0.43, y: 0.40, text: "pulmonary artery", t: wf(52, "artery"), side: "l", col: "#F3B5A8" },
            { x: 0.565, y: 0.53, text: "pulmonary veins", t: wf(52, "veins"), side: "r", col: "#BFD7EE" },
          ]} />
        <KPlate {...LEFT} x={880} y={0} w={780} a={m2 + 0.2} b={m3} keys={[[m2, 1.0, 0.5, 0.5], [wf(52, "hilum"), 1.35, 0.45, 0.42]]}
          labels={[
            { x: 0.405, y: 0.435, text: "bronchus", t: wf(52, "bronchus"), side: "l", col: "#BFD7EE" },
            { x: 0.47, y: 0.32, text: "pulmonary artery", t: wf(52, "artery"), side: "r", col: "#F3B5A8" },
            { x: 0.48, y: 0.43, text: "pulmonary veins", t: wf(52, "veins"), side: "r", col: "#BFD7EE" },
          ]} />
        <ViewTag t={t} t0={m2 + 0.3} x={140} y={20} text="RIGHT LUNG · INNER SURFACE · FIG. 972" />
        <ViewTag t={t} t0={m2 + 0.5} x={900} y={20} text="LEFT LUNG · INNER SURFACE · FIG. 973" />
        <div style={abs(140, 640, { zIndex: 8 })}><Chip t={t} t0={wf(52, "hilum")} bg={C.banana} color={C.forest} size={34}>hilum = where the root of the lung enters</Chip></div>
        <div style={{ opacity: ramp(t, wf(52, "bronchus") + 0.4, wf(52, "bronchus") + 0.8) }}><Note t={t} t0={wf(52, "bronchus") + 0.4} old="eparterial bronchus" modern="upper lobe bronchus" x={900} y={640} /></div>
      </Seg>
      <Seg t={t} a={m3} b={b + 0.1}>
        <ZoomBox x={0} y={0} w={1000} h={740} t={t} t0={m3} keys={[[m3, 1.0, 0.5, 0.5], [s_(55), 1.3, 0.3, 0.5]]}
          pins={[
            { t0: wf(54, "visceral"), pt: PL_PT.visc, text: "visceral pleura (on the lung)", dx: -120, dy: -110, col: "#BFE3F0" },
            { t0: wf(54, "parietal"), pt: PL_PT.cupula, text: "parietal pleura", dx: 0, dy: -10, col: "#E7DDF3" },
            { t0: wf(54, "chest"), pt: PL_PT.pari, text: "chest wall", dx: 120, dy: 160 },
            { t0: wf(54, "mediastinum"), pt: PL_PT.medi, text: "mediastinum", dx: -40, dy: 180 },
            { t0: wf(54, "diaphragm"), pt: PL_PT.diaph, text: "diaphragm", dx: 0, dy: 50 },
            { t0: wf(55, "cavity"), pt: PL_PT.cavity, text: "pleural cavity + fluid", dx: 160, dy: 120, hot: true },
          ]}>
          <Pleura t={t} w={900} breath={ramp(t, wf(55, "slide"), wf(55, "slide") + 0.5)} lit={{ lung: win(s_(53), wf(54, "visceral")), visc: win(wf(54, "visceral"), wf(54, "parietal")), pari: win(wf(54, "parietal"), s_(55)), wall: win(wf(54, "chest"), wf(54, "mediastinum")), medi: win(wf(54, "mediastinum"), wf(54, "diaphragm")), diaph: win(wf(54, "diaphragm"), s_(55)), cavity: wf(55, "cavity") }} />
        </ZoomBox>
        <ViewTag t={t} t0={m3 + 0.3} x={24} y={20} text="PLEURA · SCHEMATIC (CAVITY ENLARGED)" />
        <Facts x={1060} y={0} w={740} items={[
          { t: s_(53), text: "pleura: a thin double layer of membrane", bg: C.forest },
          { t: wf(54, "visceral"), text: "visceral pleura → covers the lung", bg: RC.visc },
          { t: wf(54, "parietal"), text: "parietal pleura → chest wall, mediastinum, diaphragm", bg: RC.pari },
          { t: wf(55, "cavity"), text: "pleural cavity: a little fluid → layers slide, lung held to the wall" },
        ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 6. ALVEOLI AND BREATHING ================= */
export const SAlveoli: React.FC = () => {
  const t = useT();
  const a = ST(6), b = BE(6), m1 = s_(58) - 0.2, m2 = s_(60) - 0.2, m3 = s_(65) - 0.2, m4 = s_(69) - 0.2;
  const inh = ramp(t, wf(66, "contracts"), e_(67)) * (1 - ramp(t, wf(68, "relax"), e_(68) + 0.2));
  const flow = t >= wf(66, "contracts") && t < wf(68, "passive") ? 1 : t >= wf(68, "passive") && t < e_(68) + 0.3 ? -1 : 0;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={m1}>
        <ZoomBox x={0} y={0} w={1000} h={740} t={t} t0={a} keys={[[a, 1.0, 0.5, 0.5], [wf(57, "sacs"), 1.25, 0.65, 0.5]]}
          pins={[
            { t0: wf(57, "terminal"), pt: AC_PT.terminal, text: "terminal bronchiole", dx: 160, dy: -70 },
            { t0: wf(57, "respiratory"), pt: AC_PT.respb, text: "respiratory bronchiole", dx: -150, dy: 110, hot: true },
            { t0: wf(57, "ducts"), pt: AC_PT.duct, text: "alveolar duct", dx: 60, dy: 190, col: "#F6E3A1" },
            { t0: wf(57, "sacs"), pt: AC_PT.sacs, text: "alveolar sac", dx: 40, dy: -150, hot: true },
          ]}>
          <Acinus t={t} w={900} air={1} lit={{ terminal: win(wf(57, "terminal"), wf(57, "respiratory")), respb: win(wf(57, "respiratory"), wf(57, "ducts")), duct: win(wf(57, "ducts"), wf(57, "alveoli")), sacs: wf(57, "alveoli") }} />
        </ZoomBox>
        <ViewTag t={t} t0={a + 0.3} x={24} y={20} text="END OF THE AIRWAY · SCHEMATIC" />
        <KPlate {...LOB} x={1040} y={0} w={760} a={a + 0.2} b={m1} keys={[[a, 1.0, 0.5, 0.5], [wf(57, "respiratory"), 1.4, 0.2, 0.7], [wf(57, "sacs"), 1.2, 0.4, 0.5]]}
          labels={[
            { x: 0.13, y: 0.83, text: "respiratory bronchiole", t: wf(57, "respiratory"), side: "r", hot: true },
            { x: 0.25, y: 0.50, text: "alveolar duct", t: wf(57, "ducts"), side: "r", col: "#F6E3A1" },
            { x: 0.42, y: 0.74, text: "alveolar sac", t: wf(57, "sacs"), side: "r", hot: true },
          ]} />
        <ViewTag t={t} t0={a + 0.5} x={1060} y={500} text="GRAY'S 1918 · FIG. 975 · LUNG LOBULE (SCHEMATIC)" />
        <div style={abs(1060, 560, { opacity: ramp(t, wf(57, "ducts") + 0.5, wf(57, "ducts") + 0.9) })}>
          <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 18px", fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.forest, width: 700 }}><span style={{ color: C.matcha }}>1918 labels:</span> r.b. respiratory bronchiole · al.d. alveolar duct · a.s. alveolar sac</div>
        </div>
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <ZoomBox x={0} y={0} w={1000} h={740} t={t} t0={m1} keys={[[m1, 1.3, 0.72, 0.6], [s_(59), 1.7, 0.72, 0.72]]}>
          <Acinus t={t} w={900} air={1} cap={ramp(t, s_(59), s_(59) + 0.6)} lit={{ sacs: m1, sacs2: m1 }} />
        </ZoomBox>
        <ViewTag t={t} t0={m1 + 0.3} x={24} y={20} text="ALVEOLAR SACS · CAPILLARIES AROUND THEM" />
        <Facts x={1060} y={0} w={740} items={[
          { t: wf(58, "three"), text: "alveoli in adult lungs", big: "≈ 300 million", bg: C.forest },
          { t: wf(58, "two"), text: "each about 200 µm across", big: "200 µm" },
          { t: wf(59, "seventy"), text: "of surface for gas exchange", big: "≈ 70 m²", bg: C.red },
        ]} />
      </Seg>
      <Seg t={t} a={m2} b={m3}>
        <ZoomBox x={0} y={0} w={1000} h={740} t={t} t0={m2} keys={[[m2, 1.0, 0.5, 0.5], [s_(61), 1.3, 0.35, 0.4], [s_(62), 1.4, 0.3, 0.6], [s_(63), 1.3, 0.42, 0.5], [s_(64), 1.5, 0.72, 0.48]]}
          pins={[
            { t0: wf(61, "type"), t1: s_(62), pt: AL_PT.type1, text: "type I cell · thin, flat", dx: -40, dy: -110, hot: true },
            { t0: wf(62, "type"), t1: s_(63), pt: AL_PT.type2, text: "type II cell", dx: -80, dy: 130, hot: true },
            { t0: wf(62, "surfactant"), t1: s_(63), pt: AL_PT.surf, text: "surfactant film", dx: 140, dy: 90, col: C.banana },
            { t0: wf(63, "macrophages"), t1: s_(64), pt: [380, 380], text: "alveolar macrophage", dx: 40, dy: 170, col: "#D4E8C8" },
            { t0: wf(64, "membrane"), pt: AL_PT.membrane, text: "respiratory membrane", dx: -150, dy: -190, hot: true },
            { t0: wf(64, "capillary"), pt: AL_PT.cap, text: "capillary", dx: 0, dy: -120, col: "#F3B5A8" },
          ]}>
          <Alveolus t={t} w={900} gas={ramp(t, wf(64, "oxygen"), wf(64, "oxygen") + 0.5)} surf={ramp(t, wf(62, "surfactant"), wf(62, "surfactant") + 0.6)} eat={ramp(t, wf(63, "eat"), e_(63) + 1)}
            lit={{ type1: win(wf(61, "type"), s_(62)), type2: win(wf(62, "type"), s_(63)), surf: win(wf(62, "surfactant"), s_(63)), macro: win(wf(63, "macrophages"), s_(64)), membrane: wf(64, "membrane") }} />
        </ZoomBox>
        <ViewTag t={t} t0={m2 + 0.3} x={24} y={20} text="ONE ALVEOLUS · CUT OPEN · SCHEMATIC" />
        <div style={abs(1060, 0)}><Chip t={t} t0={s_(60)} bg={C.forest} size={38}>3 main cell types</Chip></div>
        <div style={abs(1060, 90, { display: "flex", flexDirection: "column", gap: 14 })}>
          <Row t={t} t0={wf(61, "type")} col="#F4C5B8" n="I" title="type I alveolar cells" sub="thin, flat · up to 97% of the surface · gases pass through" w={740} size={34} />
          <Row t={t} t0={wf(62, "type")} col="#F7E3A8" n="II" title="type II alveolar cells" sub="secrete surfactant → lower surface tension" w={740} size={34} />
          <Row t={t} t0={wf(63, "macrophages")} col="#B8D7A8" n="M" title="alveolar macrophages" sub="eat dust and microbes" w={740} size={34} />
        </div>
        <div style={abs(1060, 560, { display: "flex", flexDirection: "column", gap: 12 })}>
          <div><Chip t={t} t0={wf(62, "collapse")} bg={C.banana} color={C.forest} size={30}>so the alveoli don't collapse</Chip></div>
          <div><Chip t={t} t0={wf(64, "half")} bg={C.red} size={30}>respiratory membrane ≈ 0.5 µm thick</Chip></div>
        </div>
      </Seg>
      <Seg t={t} a={m3} b={m4}>
        <ZoomBox x={0} y={0} w={1000} h={740} t={t} t0={m3} keys={[[m3, 1.0, 0.5, 0.5]]}
          pins={[
            { t0: wf(65, "diaphragm"), pt: [450, 520], text: "diaphragm", dx: 0, dy: 110, hot: true },
            { t0: wf(66, "intercostals"), pt: BR_PT.intercostals, text: "external intercostals", dx: -40, dy: -170, col: "#F3B5A8" },
          ]}>
          <Breath t={t} w={900} p={inh} flow={flow} lit={{ diaphragm: win(wf(65, "diaphragm"), wf(66, "intercostals")), intercostals: win(wf(66, "intercostals"), s_(67)), ribs: win(wf(66, "ribs"), s_(67)), lungs: win(s_(67), wf(67, "flows") + 0.6) }} />
        </ZoomBox>
        <ViewTag t={t} t0={m3 + 0.3} x={24} y={20} text="BREATHING · FROM THE FRONT · SCHEMATIC" />
        <div style={abs(40, 70, { zIndex: 8 })}><Chip t={t} t0={wf(66, "contracts")} bg={t >= wf(68, "passive") ? C.matcha : C.red} size={30}>{t >= wf(68, "passive") ? "breathing OUT (passive)" : "breathing IN"}</Chip></div>
        <Seg t={t} a={m3} b={s_(67) - 0.2}>
          <KPlate {...DIAPH} x={1040} y={0} w={760} a={m3 + 0.2} b={s_(67) - 0.2} keys={[[m3, 1.0, 0.5, 0.5], [wf(65, "diaphragm"), 1.25, 0.45, 0.35]]}
            labels={[
              { x: 0.47, y: 0.17, text: "central tendon", t: wf(65, "diaphragm") + 0.3, side: "r", col: "#F6E3A1" },
              { x: 0.17, y: 0.45, text: "muscle fibers", t: wf(65, "diaphragm") + 0.8, side: "r", hot: true },
            ]} />
          <ViewTag t={t} t0={m3 + 0.5} x={1060} y={540} text="GRAY'S 1918 · FIG. 391 · DIAPHRAGM FROM BELOW" />
          <div style={abs(1060, 610)}><Chip t={t} t0={wf(66, "contracts")} bg={C.forest} size={30}>contracts → moves DOWN</Chip></div>
        </Seg>
        <Seg t={t} a={s_(67) - 0.2} b={m4 + 0.1}>
          <Chain t={t} x={1060} y={0} w={740} size={32} items={[
            ["diaphragm contracts, moves down", s_(67) - 0.2, RC.muscle],
            ["ribs lift up and out", s_(67) - 0.1, "#F3B5A8"],
            ["chest gets bigger", wf(67, "bigger"), C.banana],
            ["pressure inside drops", wf(67, "pressure"), "#BFD7EE"],
            ["air flows IN", wf(67, "flows"), RC.air],
          ]} />
          <div style={abs(1060, 520, { width: 740, ...pop(t, s_(68)), background: C.forest, borderRadius: 28, padding: "16px 26px", boxSizing: "border-box", fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.paper })}>
            Quiet breathing OUT is <span style={{ color: C.banana }}>passive</span>: muscles relax, elastic lungs recoil
          </div>
        </Seg>
      </Seg>
      <Seg t={t} a={m4} b={b + 0.1}>
        <ZoomBox x={0} y={0} w={1000} h={740} t={t} t0={m4} keys={[[m4, 1.0, 0.5, 0.5]]}
          pins={[
            { t0: wf(69, "phrenic"), pt: PN_PT.phrenic, text: "phrenic nerve", dx: 190, dy: -40, hot: true },
            { t0: wf(69, "diaphragm"), pt: PN_PT.diaphragm, text: "diaphragm", dx: 120, dy: -80 },
          ]}>
          <Phrenic t={t} w={900} signal={ramp(t, wf(69, "phrenic"), wf(69, "phrenic") + 0.4)} lit={{ c3: wf(69, "three"), c4: wf(69, "four"), c5: wf(69, "five"), phrenic: wf(69, "phrenic") }} />
        </ZoomBox>
        <ViewTag t={t} t0={m4 + 0.3} x={24} y={20} text="NECK AND DIAPHRAGM · SIDE VIEW · SCHEMATIC" />
        <Facts x={1060} y={0} w={740} items={[
          { t: wf(69, "phrenic"), text: "the diaphragm's nerve: phrenic nerve", bg: C.forest },
          { t: wf(69, "three"), text: "from spinal nerves", big: "C3 · C4 · C5", bg: C.red },
        ]} />
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
  const k1 = s_(71) - 0.2, k2 = s_(73) - 0.2, k3 = s_(74) - 0.2, k4 = s_(75) - 0.2, k5 = s_(76) - 0.2, k6 = s_(77) - 0.2;
  const W1 = ["Never", "Put", "Large", "Toys", "By", "Baby's", "Airway"];
  const T1 = ["nose", "pharynx", "larynx", "trachea", "bronchi", "bronchioles", "alveoli"];
  const tk1 = ["never", "put", "large", "toys", "by", "baby's", "airway"].map((w) => wf(71, w));
  const tk2 = [wf(72, "nose"), wf(72, "pharynx"), wf(72, "larynx"), wf(72, "trachea"), wf(72, "bronchi", 0), wf(72, "bronchi", 1), wf(72, "alveoli")];
  const litPath = ["nose", "pharynx", "larynx", "trachea", "bronchi", "bronchioles", "alveoli"];
  const curI = tk2.reduce((acc, tt, i) => (t >= tt - 0.05 ? i : acc), -1);
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={k1}>
        <div style={abs(0, 0, { width: 1800, height: 740, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" })}>
          <div style={pop(t, a)}><Big size={110}>Memory tricks</Big></div>
          <div style={{ marginTop: 18 }}><Chip t={t} t0={a + 0.4} bg={C.banana} color={C.forest} size={40}>6 quick ways to lock it in</Chip></div>
        </div>
      </Seg>
      <Seg t={t} a={k1} b={k2}>
        <TrickCard t={t} t0={k1} n={1} title="The path of air, in order">
          <div style={abs(60, 190, { display: "flex", gap: 22, flexWrap: "wrap", width: 1100, fontFamily: FONT, fontWeight: 800, fontSize: 70, color: C.paper })}>
            {W1.map((w, i) => <span key={w} style={{ opacity: ramp(t, tk1[i] - 0.1, tk1[i] + 0.15) }}><FL w={w} on={t >= tk1[i] ? 1 : 0} /></span>)}
          </div>
          <div style={abs(60, 420, { display: "flex", flexDirection: "column", gap: 6, flexWrap: "wrap", height: 300 })}>
            {T1.map((x, i) => (
              <div key={x} style={{ ...pop(t, tk2[i]), fontFamily: FONT, fontWeight: 800, fontSize: 36, color: i === curI ? C.banana : C.paper, transformOrigin: "0% 50%", width: 520 }}>
                <span style={{ color: C.banana, fontSize: 44 }}>{x[0].toUpperCase()}</span>{x.slice(1)}
              </div>
            ))}
          </div>
          {mini(1220, 60, 520, 620, <div style={abs(-190, 0)}><AirwayMap t={t} w={900} air={1} lit={curI >= 0 ? { [litPath[curI]]: tk2[curI] } : {}} /></div>)}
        </TrickCard>
      </Seg>
      <Seg t={t} a={k2} b={k3}>
        <TrickCard t={t} t0={k2} n={2} title="Lobes: right 3, left 2">
          <div style={abs(60, 200, { fontFamily: FONT, fontWeight: 800, color: C.paper, width: 820 })}>
            <div style={{ fontSize: 130, lineHeight: 1 }}><span style={{ color: C.banana, opacity: ramp(t, wf(73, "three"), wf(73, "three") + 0.3) }}>R 3</span> · <span style={{ color: C.matchaLight, opacity: ramp(t, wf(73, "two"), wf(73, "two") + 0.3) }}>L 2</span></div>
            <div style={{ fontSize: 44, marginTop: 30, opacity: ramp(t, wf(73, "heart"), wf(73, "heart") + 0.4) }}>the heart takes room on the left →</div>
            <div style={{ fontSize: 44, marginTop: 10, opacity: ramp(t, wf(73, "fewer"), wf(73, "fewer") + 0.4) }}>one lobe fewer, plus a little tongue:</div>
            <div style={{ fontSize: 64, marginTop: 10, color: C.banana, opacity: ramp(t, wf(73, "lingula"), wf(73, "lingula") + 0.4) }}>the lingula</div>
          </div>
          {mini(920, 40, 820, 660, <div style={abs(-30, 10)}><LungsFront t={t} w={880} lit={{ supR: wf(73, "three"), midR: wf(73, "three"), infR: wf(73, "three"), heart: win(wf(73, "heart"), wf(73, "lingula")), lingula: wf(73, "lingula") }} /></div>)}
        </TrickCard>
      </Seg>
      <Seg t={t} a={k3} b={k4}>
        <TrickCard t={t} t0={k3} n={3} title="Inhale a bite, it goes down the right">
          <div style={abs(60, 220, { display: "flex", flexDirection: "column", gap: 18 })}>
            {["wider", "shorter", "more vertical"].map((x, i) => <div key={x}><Chip t={t} t0={wf(74, ["wider", "shorter", "vertical"][i])} bg={C.banana} color={C.forest} size={54}>right main bronchus: {x}</Chip></div>)}
          </div>
          {mini(1100, 150, 640, 550, <div style={abs(-130, -40)}><BronchTree t={t} w={860} drop={ramp(t, wf(74, "inhale"), wf(74, "right") + 0.6)} lit={{ rmain: wf(74, "right") }} /></div>)}
        </TrickCard>
      </Seg>
      <Seg t={t} a={k4} b={k5}>
        <TrickCard t={t} t0={k4} n={4} title="The cricoid = a signet ring">
          <div style={abs(60, 220, { display: "flex", flexDirection: "column", gap: 18 })}>
            <div><Chip t={t} t0={wf(75, "wide")} bg={C.banana} color={C.forest} size={54}>wide at the BACK</Chip></div>
            <div><Chip t={t} t0={wf(75, "narrow")} bg={C.matchaLight} color={C.forest} size={54}>narrow at the FRONT</Chip></div>
          </div>
          {mini(900, 40, 840, 660, <div style={abs(-30, 20)}><Signet t={t} w={880} k={ramp(t, wf(75, "signet"), wf(75, "signet") + 0.4)} /></div>)}
          <div style={abs(940, 600, { fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.forest, zIndex: 3 })}>← back · · · · · · · · · · front →</div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={k5} b={k6}>
        <TrickCard t={t} t0={k5} n={5} title="Type I vs type II">
          <div style={abs(60, 220, { display: "flex", flexDirection: "column", gap: 18 })}>
            <div><Chip t={t} t0={wf(76, "type", 0)} bg={"#F4C5B8"} color={C.forest} size={50}>type I = thin → gas exchange</Chip></div>
            <div><Chip t={t} t0={wf(76, "type", 1)} bg={C.banana} color={C.forest} size={50}>type II = surfactant</Chip></div>
          </div>
          {mini(1000, 40, 740, 660, <div style={abs(-70, 20)}><Alveolus t={t} w={880} gas={1} surf={ramp(t, wf(76, "surfactant"), wf(76, "surfactant") + 0.5)} lit={{ type1: win(wf(76, "type", 0), wf(76, "type", 1)), type2: wf(76, "type", 1) }} /></div>)}
        </TrickCard>
      </Seg>
      <Seg t={t} a={k6} b={b + 0.1}>
        <TrickCard t={t} t0={k6} n={6} title="The phrenic nerve">
          <div style={abs(60, 220, { fontFamily: FONT, fontWeight: 800, fontSize: 76, color: C.paper, lineHeight: 1.15, width: 900 })}>
            <div style={{ opacity: ramp(t, wf(77, "c"), wf(77, "c") + 0.3) }}><span style={{ color: C.banana }}>C3, 4, 5</span></div>
            <div style={{ opacity: ramp(t, wf(77, "keeps"), wf(77, "keeps") + 0.3) }}>keeps the diaphragm</div>
            <div style={{ opacity: ramp(t, wf(77, "alive"), wf(77, "alive") + 0.3) }}><Mk p={ramp(t, wf(77, "alive"), wf(77, "alive") + 0.5)}><span style={{ color: C.forest }}>alive</span></Mk></div>
          </div>
          {mini(1000, 40, 740, 660, <div style={abs(-90, 20)}><Phrenic t={t} w={880} signal={1} lit={{ roots: wf(77, "c"), diaphragm: wf(77, "alive") }} /></div>)}
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
  { n: 1, si: 79, q: "Which part of the pharynx carries air only?", a: "the nasopharynx", visual: (t, r, ans) => <QV t={t} t0={s_(79)} tag="PHARYNX · SIDE VIEW"><div style={abs(50, 20)}><Pharynx t={t} w={900} air={1} lit={r ? { naso: ans } : {}} /></div></QV> },
  { n: 2, si: 81, q: "Which cartilage forms the Adam's apple?", a: "the thyroid cartilage", visual: (t, r, ans) => <QV t={t} t0={s_(81)} tag="LARYNX · FRONT"><div style={abs(50, 20)}><LarynxFront t={t} w={900} lit={r ? { thyroid: ans, prominence: ans } : {}} /></div></QV> },
  { n: 3, si: 83, q: "Which main bronchus is wider, shorter and more vertical?", a: "the RIGHT main bronchus", visual: (t, r, ans) => <QV t={t} t0={s_(83)} tag="BRONCHIAL TREE · FRONT"><div style={abs(50, 20)}><BronchTree t={t} w={900} drop={r ? ramp(t, ans, ans + 1.5) : 0} lit={r ? { rmain: ans } : {}} /></div></QV> },
  { n: 4, si: 85, q: "Which lung has a horizontal fissure?", a: "the RIGHT lung", visual: (t, r, ans) => <QV t={t} t0={s_(85)} tag="LUNGS · FRONT"><div style={abs(50, 20)}><LungsFront t={t} w={900} lit={r ? { hfis: ans, supR: ans + 0.8, midR: ans + 0.8 } : {}} /></div></QV> },
  { n: 5, si: 87, q: "Which alveolar cells secrete surfactant?", a: "type II alveolar cells", visual: (t, r, ans) => <QV t={t} t0={s_(87)} tag="ALVEOLUS"><div style={abs(50, 20)}><Alveolus t={t} w={900} gas={1} surf={r ? ramp(t, ans, ans + 0.6) : 0} lit={r ? { type2: ans } : {}} /></div></QV> },
];
export const SQuiz: React.FC = () => {
  const t = useT();
  const a = ST(8), b = BE(8);
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(79) - 0.2}>
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
              {q.n === 5 && reveal > 0 && <div style={abs(50, 672, { ...pop(t, wf(88, "how")), fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.banana, whiteSpace: "nowrap" })}>Your score: ? / 5 · tell me below</div>}
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
    ["Zones", "conducting = moves + cleans air · respiratory = resp. bronchioles → alveoli", Math.max(a, s_(90)), RC.air],
    ["Nose", "conchae · nasopharynx · oropharynx · laryngopharynx", s_(91), RC.mucosa],
    ["Larynx", "thyroid · cricoid · epiglottis · vocal folds", s_(92), RC.cart],
    ["Trachea", "C-shaped rings · carina · right main bronchus wider, shorter, more vertical", s_(93), "#BFD7EE"],
    ["Lungs", "right 3 lobes · left 2 lobes · wrapped in pleura", s_(94), RC.supL],
    ["Alveoli", "type I = gas exchange · type II = surfactant · diaphragm does most of the work", s_(95), RC.mid],
  ];
  const ot = s_(96) - 0.2;
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
            {t < s_(94) ? <div style={abs(-60, 60)}><AirwayMap t={t} w={570} air={1} lit={t >= s_(93) ? { trachea: s_(93), bronchi: s_(93) } : t >= s_(92) ? { larynx: s_(92) } : t >= s_(91) ? { nose: s_(91), pharynx: s_(91) } : {}} /></div>
              : t < s_(95) ? <div style={abs(-60, 100)}><LungsFront t={t} w={570} /></div>
              : <div style={abs(-60, 100)}><Alveolus t={t} w={570} gas={1} surf={1} /></div>}
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
              <div style={{ background: C.red, color: C.paper, borderRadius: 50, padding: "18px 54px 22px", fontSize: 54, letterSpacing: 3, transform: `scale(${1 + 0.05 * Math.max(0, Math.sin((t - ot) * 5))})`, opacity: ramp(t, wf(97, "subscribe"), wf(97, "subscribe") + 0.3) }}>SUBSCRIBE</div>
              <div style={{ fontSize: 34, color: C.matchaLight, opacity: ramp(t, wf(96, "book"), wf(96, "book") + 0.3) }}>study cards: bookplume.com</div>
            </div>
            <div style={{ marginTop: 40, background: C.paper, color: C.forest, borderRadius: 24, padding: "16px 30px 20px", fontSize: 38, opacity: ramp(t, s_(98), s_(98) + 0.4), width: "fit-content" }}>Which part of the respiratory system is hardest to remember?</div>
          </div>
        </div>
      )}
    </Stage>
  );
};
