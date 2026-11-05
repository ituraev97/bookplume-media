import React from "react";
import { C, FONT, ramp, useT } from "./kit";
import { Facts, Stage, LogoMark } from "./Chrome16";
import { GITract, GutWall, Peristalsis, Esoph, Stomach, Gland, BileTree, Surface, ColonSeg, GI_PT, WALL_PT, ESO_PT, ST_PT, GL_PT, BT_PT, COL_PT, DC, foodAt, Lit } from "./IllusDigest";
import { s_, e_, wf, ST, BE, abs, pop, Big, Mk, Seg, Note, Chip, ViewTag, Tag, Panel, KPlate, TrickCard, FL, kv, Row } from "./DigKit";
import { END } from "./timeline";

/* ---------- plates (Gray's Anatomy 1918, public domain) ---------- */
const P = (f: string, w: number, h: number) => ({ src: `plates/${f}.png`, aspect: w / h });
const VISC = P("viscera1224", 1978, 2224);
const COLON = P("colon1223", 2001, 1668);
const SALIV = P("saliv1024", 1893, 1574);
const ESO = P("esoph1032", 1645, 1832);
const STOM = P("stom1050", 1683, 1058);
const STOB = P("stomob1052", 1296, 1127);
const STLONG = P("stomlong1051", 1433, 1322);
const DUOD = P("duod1098", 1808, 1261);
const PAP = P("papilla1057", 1273, 1242);
const LIVER = P("liver1086", 1933, 1276);
const GALL = P("gall1095", 796, 1706);
const CECUM = P("cecum1073", 1785, 1373);
const RECT = P("rectum1078", 819, 1361);
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
export const RowL: React.FC<{ t: number; t0: number; col: string; title: string; sub?: string; w?: number; n?: string; size?: number }> = ({ t, t0, col, title, sub, w = 700, n, size = 38 }) => (
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


/* ---------- shorthand ---------- */
const GI = (t: number, lit: Lit, food = -1, trail = 0, body = 1) => <GITract t={t} w={900} lit={lit} food={food} trail={trail} body={body} />;
const fAt = (k: keyof typeof GI_PT) => foodAt(GI_PT[k]);
export const Hdr: React.FC<{ t: number; t0: number; x: number; y: number; children: React.ReactNode; size?: number }> = ({ t, t0, x, y, children, size = 64 }) => (
  <div style={abs(x, y, { ...pop(t, t0), transformOrigin: "0% 50%" })}><Big size={size}>{children}</Big></div>
);

/* ================= 0. INTRO ================= */
export const SIntro: React.FC = () => {
  const t = useT();
  const m1 = s_(2) - 0.2, m2 = s_(3) - 0.2;
  const food = kv(t, [[0.8, 0], [7.6, 1]]);
  return (
    <Stage a={-1} b={BE(0)}>
      <Seg t={t} a={-1} b={m1}>
        <ZoomBox x={0} y={0} w={1000} h={740} cw={900} ch={1000} t={t} t0={0} keys={[[0, 1.0, 0.5, 0.5], [wf(0, "journey"), 1.0, 0.5, 0.5], [wf(0, "mouth"), 1.6, 0.5, 0.3], [wf(0, "end"), 1.3, 0.5, 0.75], [s_(1), 1.0, 0.5, 0.5]]}
          pins={[
            { t0: wf(0, "mouth"), t1: wf(0, "end"), pt: GI_PT.mouth, text: "mouth", dx: 160, dy: 10, hot: true },
            { t0: wf(0, "tube"), t1: s_(1) + 1, pt: GI_PT.esoph, text: "one long tube", dx: 200, dy: -20 },
            { t0: wf(0, "end"), t1: s_(2), pt: GI_PT.anus, text: "the very end", dx: 190, dy: -10, hot: true },
          ]}>
          {GI(t, { tract: wf(0, "tube") }, food, 0.4)}
        </ZoomBox>
        <ViewTag t={t} t0={0.4} x={24} y={20} text="GI TRACT · FRONT VIEW · SCHEMATIC" />
        <div style={abs(1060, 0, { width: 740, ...pop(t, 0.2) })}>
          <Big size={96}><Mk p={ramp(t, 0.6, 1.6)}>Digestive</Mk></Big>
          <Big size={96}><Mk p={ramp(t, 1.0, 2.0)}>System</Mk></Big>
          <Big size={96}><Mk p={ramp(t, 1.4, 2.4)}>Made Easy</Mk></Big>
          <Big size={42} color={C.matcha} style={{ marginTop: 10 }}>learn it in about 10 minutes</Big>
        </div>
        <div style={abs(1060, 470, { display: "flex", flexDirection: "column", gap: 14 })}>
          <div><Chip t={t} t0={wf(0, "tube")} bg={C.forest} size={36}>1 tube · mouth → anus</Chip></div>
          <div><Chip t={t} t0={wf(0, "twenty")} bg={C.banana} color={C.forest} size={40}>≈ 25 feet (7.6 m) long</Chip></div>
          <div><Chip t={t} t0={wf(1, "every")} bg={C.red} size={38}>every stop · in order</Chip></div>
        </div>
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <KPlate {...VISC} x={0} y={0} w={658} a={m1} b={m2} keys={[[m1, 1.0, 0.5, 0.5], [wf(2, "where"), 1.7, 0.28, 0.45], [wf(2, "which", 0), 1.5, 0.45, 0.62], [wf(2, "which", 1), 1.7, 0.6, 0.38]]}
          labels={[
            { x: 0.27, y: 0.47, text: "gallbladder", t: wf(2, "where") + 0.3, side: "r", hot: true, t1: wf(2, "which", 0) },
            { x: 0.45, y: 0.62, text: "small intestine", t: wf(2, "which", 0) + 0.3, side: "r", hot: true, t1: wf(2, "which", 1) },
            { x: 0.62, y: 0.38, text: "stomach", t: wf(2, "which", 1) + 0.3, side: "r", hot: true },
          ]} />
        <ViewTag t={t} t0={m1 + 0.3} x={20} y={690} text="GRAY'S 1918 · FIG. 1224 · ABDOMINAL ORGANS" />
        <div style={abs(720, 40, { display: "flex", flexDirection: "column", gap: 26 })}>
          {([["Where does the bile duct open?", wf(2, "where"), C.forest], ["Which part of the small intestine is the longest?", wf(2, "which", 0), C.matcha], ["Which cells make stomach acid?", wf(2, "which", 1), C.red]] as [string, number, string][]).map(([x, tt, bg]) => (
            <div key={x}><Chip t={t} t0={tt} bg={bg} size={44}>{x}</Chip></div>
          ))}
        </div>
        <div style={abs(720, 420, { width: 1000, opacity: ramp(t, wf(2, "which", 1) + 1, wf(2, "which", 1) + 1.5) })}>
          <Big size={44} color={C.matcha}>…you'll answer all three by the end.</Big>
        </div>
      </Seg>
      <Seg t={t} a={m2} b={BE(0) + 0.1}>
        <KPlate {...COLON} x={0} y={110} w={600} a={m2} b={BE(0)} keys={[[m2, 1.0, 0.5, 0.5], [s_(4), 1.08, 0.5, 0.45]]} />
        <ViewTag t={t} t0={m2 + 0.3} x={20} y={640} text="GRAY'S 1918 · FIG. 1223" />
        <div style={abs(660, 0, { width: 1140, display: "flex", gap: 12, flexWrap: "wrap" })}>
          {["nursing school", "med school", "A&P class"].map((x, i) => (
            <Chip key={x} t={t} t0={[wf(3, "nursing"), wf(3, "med"), wf(3, "class")][i]} bg={C.card} color={C.forest} size={32}>{x}</Chip>
          ))}
        </div>
        <div style={abs(660, 100, { width: 1120, opacity: ramp(t, m2 + 0.3, m2 + 0.7) * (1 - ramp(t, s_(4) - 0.3, s_(4))) })}>
          <Big size={76}>This is the lesson that makes the <Mk p={ramp(t, wf(3, "click") - 0.6, wf(3, "click"))}>digestive system click</Mk>.</Big>
        </div>
        <div style={abs(660, 90)}><Chip t={t} t0={s_(4)} bg={C.forest} size={42}>In about 10 minutes:</Chip></div>
        <Lst t={t} x={660} y={176} w={740} size={34} items={[
          ["mouth and esophagus", wf(4, "mouth"), DC.tract],
          ["the stomach", wf(4, "stomach"), DC.stomach],
          ["the small intestine", wf(4, "small"), DC.small],
          ["liver · gallbladder · pancreas", wf(4, "liver"), DC.pancreas],
          ["the large intestine", wf(4, "large"), DC.colon],
        ]} />
        <div style={abs(1420, 560)}><Chip t={t} t0={wf(5, "quiz")} bg={C.red} size={40}>+ 5-question quiz</Chip></div>
      </Seg>
    </Stage>
  );
};

/* ================= 1. BIG PICTURE ================= */
export const SBig: React.FC = () => {
  const t = useT();
  const a = ST(1), b = BE(1);
  const k1 = s_(12) - 0.2, k2 = s_(15) - 0.2, k3 = s_(16) - 0.2;
  const order: [string, number, keyof typeof GI_PT][] = [["mouth", wf(9, "mouth"), "mouth"], ["pharynx", wf(9, "pharynx"), "pharynx"], ["esoph", wf(9, "esophagus"), "esoph"], ["stomach", wf(9, "stomach"), "stomach"], ["small", wf(9, "small"), "jejunum"], ["large", wf(9, "large"), "transverse"], ["anus", wf(9, "anus"), "anus"]];
  const acc: [string, number][] = [["teeth", wf(11, "teeth")], ["tongue", wf(11, "tongue")], ["saliv", wf(11, "salivary")], ["liver", wf(11, "liver")], ["gall", wf(11, "gallbladder")], ["pancreas", wf(11, "pancreas")]];
  const lit: Lit = { tract: win(wf(8, "alimentary"), wf(9, "mouth") - 0.1) };
  order.forEach(([id, tt], i) => (lit[id] = win(tt, i + 1 < order.length ? order[i + 1][1] : s_(10))));
  lit.acc = win(s_(10), wf(11, "teeth") - 0.1);
  acc.forEach(([id, tt], i) => (lit[id] = win(tt, i + 1 < acc.length ? acc[i + 1][1] : k1)));
  const food = kv(t, [[wf(8, "alimentary"), 0], [s_(9) - 0.1, 1], [wf(9, "mouth") - 0.05, 1], [wf(9, "mouth"), fAt("mouth")], ...order.slice(1).map(([, tt, p]) => [tt, fAt(p)] as [number, number]), [s_(10), 1]]);
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={k1}>
        <ZoomBox x={0} y={0} w={1000} h={740} cw={900} ch={1000} t={t} t0={a}
          keys={[[a, 1.0, 0.5, 0.5], [wf(9, "mouth"), 2.2, 0.5, 0.2], [wf(9, "esophagus"), 1.5, 0.5, 0.42], [wf(9, "stomach"), 1.6, 0.55, 0.6], [wf(9, "large"), 1.3, 0.5, 0.8], [s_(10), 1.0, 0.5, 0.5], [wf(11, "teeth"), 3.0, 0.5, 0.15], [wf(11, "liver"), 1.6, 0.48, 0.58], [k1 - 0.6, 1.0, 0.5, 0.5]]}
          pins={[
            { t0: wf(9, "mouth"), t1: wf(9, "pharynx"), pt: GI_PT.mouth, text: "mouth", dx: 120, dy: 0, hot: true, size: 26 },
            { t0: wf(9, "pharynx"), t1: wf(9, "esophagus"), pt: GI_PT.pharynx, text: "pharynx", dx: 120, dy: 0, hot: true, size: 26 },
            { t0: wf(9, "esophagus"), t1: wf(9, "stomach"), pt: GI_PT.esoph, text: "esophagus", dx: -150, dy: 0, hot: true },
            { t0: wf(9, "stomach"), t1: wf(9, "small"), pt: GI_PT.stomach, text: "stomach", dx: 150, dy: -40, hot: true },
            { t0: wf(9, "small"), t1: wf(9, "large"), pt: GI_PT.jejunum, text: "small intestine", dx: 60, dy: -110, hot: true },
            { t0: wf(9, "large"), t1: wf(9, "anus"), pt: GI_PT.descending, text: "large intestine", dx: -40, dy: -170, hot: true },
            { t0: wf(9, "anus"), t1: s_(10), pt: GI_PT.anus, text: "anus", dx: 110, dy: -20, hot: true },
            { t0: wf(11, "teeth"), t1: wf(11, "tongue"), pt: GI_PT.teeth, text: "teeth", dx: 0, dy: -50, hot: true, size: 18 },
            { t0: wf(11, "tongue"), t1: wf(11, "salivary"), pt: GI_PT.tongue, text: "tongue", dx: 0, dy: 40, hot: true, size: 18 },
            { t0: wf(11, "salivary"), t1: wf(11, "liver"), pt: GI_PT.parotid, text: "salivary glands", dx: -40, dy: -70, hot: true, size: 18 },
            { t0: wf(11, "liver"), t1: wf(11, "gallbladder"), pt: GI_PT.liver, text: "liver", dx: -60, dy: -90, hot: true },
            { t0: wf(11, "gallbladder"), t1: wf(11, "pancreas"), pt: GI_PT.gall, text: "gallbladder", dx: -140, dy: 50, hot: true },
            { t0: wf(11, "pancreas"), t1: k1, pt: GI_PT.pancreas, text: "pancreas", dx: 130, dy: 60, hot: true },
          ]}>
          {GI(t, lit, food >= 1 && t > s_(10) ? -1 : food, 0.18)}
        </ZoomBox>
        <ViewTag t={t} t0={a + 0.2} x={24} y={20} text="GI TRACT · FRONT VIEW · SCHEMATIC" />
        <Facts x={1060} w={740} items={[
          { t: wf(7, "two"), text: "2 groups of organs", big: "2" },
          { t: wf(8, "alimentary"), text: "① Alimentary canal = GI tract · one continuous tube", bg: C.forest },
          { t: s_(9), text: "mouth → pharynx → esophagus → stomach → small intestine → large intestine → anus" },
          { t: s_(10), text: "② Accessory organs · help digestion · food doesn't pass through most of them", bg: C.matcha },
          { t: s_(11), text: "teeth · tongue · salivary glands · liver · gallbladder · pancreas" },
        ]} />
      </Seg>
      <Seg t={t} a={k1} b={k2}>
        <ZoomBox x={0} y={0} w={1000} h={740} cw={1150} ch={700} t={t} t0={k1} keys={[[k1, 1.0, 0.5, 0.5]]}
          pins={[
            { t0: wf(13, "mucosa"), pt: WALL_PT.mucosa, text: "1 · mucosa", dx: 965 - WALL_PT.mucosa[0], dy: -200, hot: true },
            { t0: wf(13, "submucosa"), pt: WALL_PT.sub, text: "2 · submucosa", dx: 965 - WALL_PT.sub[0], dy: -70 },
            { t0: wf(13, "muscularis"), pt: WALL_PT.musc, text: "3 · muscularis", dx: 965 - WALL_PT.musc[0], dy: 60 },
            { t0: wf(13, "serosa"), pt: WALL_PT.serosa, text: "4 · serosa", dx: 965 - WALL_PT.serosa[0], dy: 190 },
            { t0: wf(14, "food"), t1: wf(14, "submucosa"), pt: WALL_PT.lumen, text: "food", dx: 0, dy: 0, hot: true },
            { t0: wf(14, "vessels"), pt: WALL_PT.vessel, text: "blood vessels + nerves", dx: -60, dy: 360, size: 26 },
          ]}>
          <GutWall t={t} w={900} lit={t > wf(14, "submucosa") ? { sub: wf(14, "submucosa") } : t > s_(14) ? { mucosa: s_(14), lumen: wf(14, "food") - 0.4 } : { mucosa: win(wf(13, "mucosa"), wf(13, "submucosa")), sub: win(wf(13, "submucosa"), wf(13, "muscularis")), musc: win(wf(13, "muscularis"), wf(13, "serosa")), serosa: win(wf(13, "serosa"), s_(14)) }} />
        </ZoomBox>
        <ViewTag t={t} t0={k1 + 0.2} x={24} y={20} text="GUT WALL · CROSS-SECTION · SCHEMATIC" />
        <div style={abs(1060, 10)}><Chip t={t} t0={k1 + 0.2} bg={C.forest} size={38}>Same 4 layers · esophagus → anus</Chip></div>
        <Chain t={t} x={1060} y={110} w={720} size={36} items={[
          ["mucosa · lines it, touches food", wf(13, "mucosa"), DC.mucosa],
          ["submucosa · vessels + nerves", wf(13, "submucosa"), DC.sub],
          ["muscularis · smooth muscle", wf(13, "muscularis"), DC.muscC],
          ["serosa · outer covering", wf(13, "serosa"), DC.serosa],
        ]} />
        <div style={abs(1060, 640, { opacity: ramp(t, wf(13, "inside") - 0.2, wf(13, "inside") + 0.3) })}><Chip t={t} t0={wf(13, "inside")} bg={C.banana} color={C.forest} size={32}>order: from the INSIDE out</Chip></div>
      </Seg>
      <Seg t={t} a={k2} b={k3}>
        <Panel x={0} y={0} w={1000} h={740} t={t} t0={k2}>
          <div style={abs(50, 150)}><Peristalsis t={t} w={900} k={ramp(t, wf(15, "pushes") - 0.5, wf(15, "pushes"))} /></div>
          <div style={abs(50, 520, { width: 900, textAlign: "center", ...pop(t, wf(15, "peristalsis")) })}><Big size={64}><Mk p={ramp(t, wf(15, "peristalsis"), wf(15, "peristalsis") + 0.6)}>peristalsis</Mk></Big></div>
        </Panel>
        <ViewTag t={t} t0={k2 + 0.2} x={24} y={20} text="MUSCULARIS AT WORK · SCHEMATIC" />
        <Facts x={1060} w={740} items={[
          { t: s_(15), text: "Muscularis = smooth muscle", bg: C.forest },
          { t: wf(15, "mixes"), text: "it mixes food…" },
          { t: wf(15, "pushes"), text: "…and pushes it along" },
          { t: wf(15, "waves"), text: "in squeezing waves: peristalsis", bg: C.red },
        ]} />
      </Seg>
      <Seg t={t} a={k3} b={b + 0.1}>
        <ZoomBox x={0} y={0} w={1000} h={740} cw={900} ch={700} t={t} t0={k3} keys={[[k3, 1.0, 0.5, 0.5], [wf(16, "serosa"), 1.35, 0.72, 0.5]]}
          pins={[{ t0: wf(16, "serosa"), pt: WALL_PT.serosa, text: "serosa = visceral peritoneum", dx: -120, dy: -250, hot: true, size: 28 }]}>
          <GutWall t={t} w={900} lit={{ serosa: wf(16, "serosa") }} />
        </ZoomBox>
        <Facts x={1060} w={740} items={[
          { t: k3 + 0.2, text: "In the abdomen, layer 4 is the serosa", big: "4" },
          { t: wf(16, "visceral"), text: "made of visceral peritoneum", bg: C.matcha },
        ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 2. MOUTH TO ESOPHAGUS ================= */
export const SMouth: React.FC = () => {
  const t = useT();
  const a = ST(2), b = BE(2);
  const k1 = s_(19) - 0.2, k2 = s_(23) - 0.2, k3 = s_(26) - 0.2;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={k1}>
        <ZoomBox x={0} y={0} w={1000} h={740} cw={900} ch={1000} t={t} t0={a} keys={[[a, 3.4, 0.5, 0.15], [wf(18, "adults"), 3.8, 0.5, 0.16]]}
          pins={[{ t0: wf(18, "teeth"), pt: GI_PT.teeth, text: "teeth", dx: 0, dy: -36, hot: true, size: 30 }, { t0: a + 0.3, pt: GI_PT.mouth, text: "mouth", dx: 90, dy: 26, size: 28 }]}>
          {GI(t, { mouth: a, teeth: wf(18, "teeth") })}
        </ZoomBox>
        <ViewTag t={t} t0={a + 0.2} x={24} y={20} text="HEAD · FRONT VIEW · SCHEMATIC" />
        <Facts x={1060} w={740} items={[
          { t: a + 0.2, text: "Digestion starts in the mouth", bg: C.forest },
          { t: wf(18, "thirty"), text: "permanent teeth (adults)", big: "32" },
          { t: wf(18, "twenty"), text: "baby teeth (children)", big: "20" },
        ]} />
      </Seg>
      <Seg t={t} a={k1} b={k2}>
        <KPlate {...SALIV} x={0} y={0} w={880} a={k1} b={k2}
          keys={[[k1, 1.0, 0.5, 0.5], [wf(20, "parotid"), 1.5, 0.3, 0.5], [wf(20, "duct"), 1.6, 0.58, 0.48], [wf(21, "submandibular"), 1.5, 0.45, 0.72], [wf(21, "sublingual"), 1.6, 0.58, 0.7], [s_(22), 1.0, 0.5, 0.5]]}
          labels={[
            { x: 0.25, y: 0.48, text: "parotid gland", t: wf(20, "parotid"), side: "r", hot: true },
            { x: 0.62, y: 0.45, text: "parotid duct opening", t: wf(20, "duct"), side: "r", t1: wf(21, "submandibular") - 0.2 },
            { x: 0.46, y: 0.8, text: "submandibular gland", t: wf(21, "submandibular"), side: "r", hot: true },
            { x: 0.6, y: 0.72, text: "sublingual gland", t: wf(21, "sublingual"), side: "r", hot: true },
          ]} />
        <ViewTag t={t} t0={k1 + 0.3} x={20} y={690} text="GRAY'S 1918 · FIG. 1024 · SALIVARY GLANDS, RIGHT SIDE" />
        <Note t={t} t0={wf(21, "submandibular") + 0.8} x={24} y={20} old="submaxillary" modern="submandibular" />
        <Facts x={930} w={850} items={[
          { t: k1 + 0.2, text: "3 pairs of major salivary glands", big: "3 pairs" },
          { t: wf(20, "parotid"), text: "Parotid · near the ear · duct opens by the 2nd upper molar" },
          { t: wf(21, "submandibular"), text: "Submandibular · under the jaw · Sublingual · under the tongue" },
          { t: s_(22), text: "saliva every day", big: "1–1.5 L", bg: C.forest },
        ]} />
      </Seg>
      <Seg t={t} a={k2} b={k3}>
        <KPlate {...ESO} x={0} y={0} w={664} a={k2} b={k3}
          keys={[[k2, 1.0, 0.5, 0.5], [wf(23, "oropharynx"), 1.8, 0.5, 0.1], [s_(24), 1.25, 0.5, 0.45], [wf(25, "diaphragm"), 1.8, 0.5, 0.9]]}
          labels={[
            { x: 0.5, y: 0.08, text: "pharynx", t: wf(23, "oropharynx"), side: "r", hot: true, t1: s_(24) },
            { x: 0.5, y: 0.45, text: "esophagus", t: wf(23, "esophagus"), side: "r", hot: true },
            { x: 0.5, y: 0.93, text: "diaphragm", t: wf(25, "diaphragm"), side: "r" },
          ]} />
        <ViewTag t={t} t0={k2 + 0.3} x={20} y={690} text="GRAY'S 1918 · FIG. 1032 · VIEW FROM BEHIND" />
        <Facts x={720} w={1060} items={[
          { t: k2 + 0.2, text: "swallow: oropharynx → laryngopharynx → esophagus" },
          { t: s_(24), text: "muscular tube · runs behind the trachea", big: "≈ 10 in (25 cm)", bg: C.forest },
          { t: s_(25), text: "passes the diaphragm at the esophageal hiatus → joins the stomach" },
        ]} />
      </Seg>
      <Seg t={t} a={k3} b={b + 0.1}>
        <ZoomBox x={0} y={0} w={1000} h={740} cw={900} ch={700} t={t} t0={k3} keys={[[k3, 1.0, 0.5, 0.5]]}
          pins={[
            { t0: wf(26, "upper"), pt: ESO_PT.ues, text: "upper esophageal sphincter", dx: 250, dy: -30, hot: t < wf(26, "lower") },
            { t0: wf(26, "lower"), pt: ESO_PT.les, text: "lower esophageal sphincter", dx: 270, dy: -40, hot: true },
            { t0: wf(28, "upper"), pt: ESO_PT.upper, text: "skeletal", dx: -200, dy: 0, col: "#E8A090" },
            { t0: wf(28, "middle"), pt: ESO_PT.middle, text: "mixed", dx: -200, dy: 0, col: "#F2C4B4" },
            { t0: wf(28, "lower"), pt: ESO_PT.lower, text: "smooth", dx: -210, dy: 0, col: "#F7DCD2" },
          ]}>
          <Esoph t={t} w={900} lit={{ ues: win(wf(26, "upper"), wf(26, "lower")), les: win(wf(26, "lower"), s_(28)), upper: wf(28, "upper"), middle: wf(28, "middle"), lower: wf(28, "lower") }} reflux={ramp(t, s_(27), s_(27) + 0.5) * (1 - ramp(t, s_(28) - 0.3, s_(28)))} food={t < s_(27) ? ramp(t, k3 + 0.3, s_(27) - 0.3) : -1} />
        </ZoomBox>
        <ViewTag t={t} t0={k3 + 0.2} x={24} y={20} text="ESOPHAGUS · SCHEMATIC" />
        <div style={abs(1040, 0, { display: "flex", flexDirection: "column", gap: 14, opacity: 1 - ramp(t, s_(28) - 0.3, s_(28)) })}>
          <Row t={t} t0={wf(26, "upper")} n="↑" col={DC.muscL} title="Upper esophageal sphincter" sub="at the top" w={760} />
          <Row t={t} t0={wf(26, "lower")} n="↓" col={C.red} title="Lower esophageal sphincter" sub="at the bottom" w={760} />
          <div><Chip t={t} t0={s_(27)} bg={C.banana} color={C.forest} size={38}>keeps stomach acid from flowing back up</Chip></div>
        </div>
        <div style={abs(1040, 0, { opacity: ramp(t, s_(28) - 0.2, s_(28) + 0.2), display: "flex", flexDirection: "column", gap: 16 })}>
          <div><Chip t={t} t0={s_(28)} bg={C.red} size={40}>CLASSIC EXAM FACT</Chip></div>
          <Row t={t} t0={wf(28, "upper")} n="⅓" col={DC.skeletal} title="Upper third · skeletal" w={760} />
          <Row t={t} t0={wf(28, "middle")} n="⅓" col="#D27A64" title="Middle third · mixed" w={760} />
          <Row t={t} t0={wf(28, "lower")} n="⅓" col={DC.smooth} title="Lower third · smooth" w={760} />
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 3. THE STOMACH ================= */
export const SStomach: React.FC = () => {
  const t = useT();
  const a = ST(3), b = BE(3);
  const k1 = s_(31) - 0.2, k2 = s_(35) - 0.2, k3 = s_(37) - 0.2, k4 = s_(38) - 0.2, k5 = s_(41) - 0.2;
  const ob = wf(37, "oblique") - 0.4;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={k1}>
        <ZoomBox x={0} y={0} w={1000} h={740} cw={900} ch={1000} t={t} t0={a} keys={[[a, 1.2, 0.55, 0.5], [wf(29, "upper"), 2.0, 0.6, 0.52], [s_(30), 2.2, 0.62, 0.55]]}
          pins={[{ t0: wf(29, "upper"), pt: GI_PT.stomach, text: "stomach · upper left", dx: 120, dy: -150, hot: true, size: 26 }, { t0: wf(29, "diaphragm"), pt: GI_PT.diaphragm, text: "diaphragm", dx: 30, dy: -60, size: 22 }]}>
          {GI(t, { stomach: a, diaphragm: win(wf(29, "diaphragm"), s_(30)) })}
        </ZoomBox>
        <ViewTag t={t} t0={a + 0.2} x={24} y={20} text="FRONT VIEW · YOUR LEFT IS ON THE RIGHT OF THE SCREEN" />
        <Facts x={1060} w={740} items={[
          { t: a + 0.2, text: "upper LEFT abdomen · just under the diaphragm", bg: C.forest },
          { t: s_(30), text: "regions", big: "4" },
        ]} />
      </Seg>
      <Seg t={t} a={k1} b={k2}>
        <ZoomBox x={0} y={0} w={1000} h={740} cw={900} ch={700} t={t} t0={k1} keys={[[k1, 1.0, 0.5, 0.5], [wf(33, "sphincter"), 1.5, 0.3, 0.68], [s_(34), 1.0, 0.5, 0.5]]}
          pins={[
            { t0: wf(31, "cardia"), pt: ST_PT.cardia, text: "cardia", dx: -170, dy: 30, hot: true },
            { t0: wf(31, "fundus"), pt: ST_PT.fundus, text: "fundus", dx: 150, dy: -40, hot: true },
            { t0: wf(32, "body"), pt: ST_PT.body, text: "body", dx: 0, dy: 0, hot: true },
            { t0: wf(32, "pylorus"), pt: ST_PT.pylorus, text: "pylorus", dx: 20, dy: 90, hot: true },
            { t0: wf(32, "duodenum"), pt: ST_PT.duod, text: "duodenum", dx: 0, dy: 150 },
            { t0: wf(33, "sphincter"), pt: ST_PT.sphincter, text: "pyloric sphincter", dx: 0, dy: -110, hot: true, t1: s_(34) },
            { t0: wf(34, "lesser"), pt: ST_PT.lesser, text: "lesser curvature", dx: -230, dy: -40, col: "#F7DCD2" },
            { t0: wf(34, "greater"), pt: ST_PT.greater, text: "greater curvature", dx: -60, dy: 230, col: C.banana },
          ]}>
          <Stomach t={t} w={900} lit={{ cardia: win(wf(31, "cardia"), wf(31, "fundus")), fundus: win(wf(31, "fundus"), wf(32, "body")), body: win(wf(32, "body"), wf(32, "pylorus")), pylorus: win(wf(32, "pylorus"), s_(33)), duod: win(wf(32, "duodenum"), s_(33)), sphincter: win(s_(33), s_(34)), lesser: win(wf(34, "lesser"), wf(34, "greater")), greater: wf(34, "greater") }} rugae={0.4} />
        </ZoomBox>
        <ViewTag t={t} t0={k1 + 0.2} x={24} y={20} text="STOMACH · FRONT VIEW · SCHEMATIC" />
        <div style={abs(1040, 0, { display: "flex", flexDirection: "column", gap: 12 })}>
          <Row t={t} t0={wf(31, "cardia")} n="1" col="#F7C3AE" title="Cardia" sub="where the esophagus enters" w={760} size={36} />
          <Row t={t} t0={wf(31, "fundus")} n="2" col="#F2AE98" title="Fundus" sub="the dome, bulges up to the left" w={760} size={36} />
          <Row t={t} t0={wf(32, "body")} n="3" col={DC.stomach} title="Body" sub="the large middle part" w={760} size={36} />
          <Row t={t} t0={wf(32, "pylorus")} n="4" col="#E88E78" title="Pylorus" sub="leads to the duodenum" w={760} size={36} />
          <div><Chip t={t} t0={wf(33, "sphincter")} bg={C.red} size={32}>pyloric sphincter = controls emptying</Chip></div>
          <div><Chip t={t} t0={wf(34, "lesser")} bg={C.forest} size={30}>short inner edge = lesser · long outer = greater</Chip></div>
        </div>
      </Seg>
      <Seg t={t} a={k2} b={k3}>
        <KPlate {...STOM} x={0} y={60} w={1000} a={k2} b={k3} keys={[[k2, 1.0, 0.5, 0.5], [s_(36), 1.6, 0.65, 0.72]]}
          labels={[
            { x: 0.78, y: 0.14, text: "fundus", t: k2 + 0.4, side: "l", t1: s_(36) },
            { x: 0.72, y: 0.48, text: "body", t: k2 + 0.6, side: "l", t1: s_(36) },
            { x: 0.17, y: 0.58, text: "pylorus", t: k2 + 0.8, side: "r", t1: s_(36) },
            { x: 0.62, y: 0.83, text: "rugae", t: wf(36, "rugae"), side: "l", hot: true },
          ]} />
        <ViewTag t={t} t0={k2 + 0.3} x={20} y={0} text="GRAY'S 1918 · FIG. 1050 · INTERIOR OF THE STOMACH" />
        <Note t={t} t0={k2 + 1.6} x={20} y={700} old="antrum cardiacum" modern="cardia" />
        <Facts x={1060} w={740} items={[
          { t: wf(35, "fist"), text: "empty: about the size of your fist", big: "✊" },
          { t: wf(35, "four"), text: "can stretch to hold about 4 liters", big: "≈ 4 L", bg: C.forest },
          { t: wf(36, "rugae"), text: "rugae = folds of the empty stomach's lining", bg: C.red },
        ]} />
      </Seg>
      <Seg t={t} a={k3} b={k4}>
        <KPlate {...STLONG} x={0} y={0} w={800} a={k3} b={ob} keys={[[k3, 1.0, 0.5, 0.5], [wf(37, "longitudinal"), 1.2, 0.5, 0.5]]}
          labels={[
            { x: 0.82, y: 0.6, text: "longitudinal", t: wf(37, "longitudinal"), side: "l", hot: true },
            { x: 0.58, y: 0.5, text: "circular", t: wf(37, "circular"), side: "l" },
          ]} />
        <KPlate {...STOB} x={0} y={0} w={850} a={ob} b={k4} keys={[[ob, 1.0, 0.5, 0.5], [wf(37, "oblique"), 1.3, 0.6, 0.45]]}
          labels={[
            { x: 0.6, y: 0.4, text: "oblique (extra)", t: wf(37, "oblique"), side: "r", hot: true },
            { x: 0.68, y: 0.68, text: "circular", t: wf(37, "oblique") + 0.3, side: "l" },
          ]} />
        <ViewTag t={t} t0={k3 + 0.3} x={20} y={700} text="GRAY'S 1918 · FIGS. 1051–1052 · STOMACH MUSCLE" />
        <div style={abs(900, 0, { display: "flex", flexDirection: "column", gap: 14 })}>
          <div><Chip t={t} t0={k3 + 0.2} bg={C.forest} size={36}>Muscularis: 3 layers (not 2)</Chip></div>
          <Row t={t} t0={wf(37, "longitudinal")} n="1" col={DC.muscL} title="Longitudinal" w={860} />
          <Row t={t} t0={wf(37, "circular")} n="2" col={DC.muscC} title="Circular" w={860} />
          <Row t={t} t0={wf(37, "oblique")} n="3" col="#E7B37A" title="Oblique · the extra one" sub="for churning" w={860} />
        </div>
      </Seg>
      <Seg t={t} a={k4} b={k5}>
        <ZoomBox x={0} y={0} w={1000} h={740} cw={900} ch={700} t={t} t0={k4} keys={[[k4, 1.0, 0.5, 0.5], [wf(39, "parietal"), 1.25, 0.45, 0.5], [wf(40, "chief"), 1.3, 0.5, 0.72]]}
          pins={[
            { t0: k4 + 0.3, pt: GL_PT.pit, text: "gastric pit", dx: 220, dy: -50 },
            { t0: wf(39, "parietal"), pt: GL_PT.parietal, text: "parietal cell", dx: -220, dy: 0, hot: true, col: "#E4CCF2" },
            { t0: wf(40, "chief"), pt: GL_PT.chief, text: "chief cell", dx: 210, dy: 30, hot: true, col: "#CFE3F6" },
          ]}>
          <Gland t={t} w={900} lit={{ pit: win(k4, wf(39, "parietal")), parietal: win(wf(39, "parietal"), wf(40, "chief")), chief: wf(40, "chief") }} acid={ramp(t, wf(39, "hydrochloric"), wf(39, "hydrochloric") + 0.6)} pep={ramp(t, wf(40, "pepsinogen"), wf(40, "pepsinogen") + 0.6)} />
        </ZoomBox>
        <ViewTag t={t} t0={k4 + 0.2} x={24} y={20} text="GASTRIC GLAND · SCHEMATIC" />
        <Facts x={1060} w={740} items={[
          { t: k4 + 0.2, text: "The lining is full of gastric glands" },
          { t: wf(39, "parietal"), text: "Parietal cells → hydrochloric acid (HCl)", bg: "#7E4FA0" },
          { t: wf(39, "intrinsic"), text: "+ intrinsic factor → needed to absorb vitamin B12" },
          { t: wf(40, "chief"), text: "Chief cells → pepsinogen → pepsin (digests protein)", bg: "#3D78AE" },
        ]} />
      </Seg>
      <Seg t={t} a={k5} b={b + 0.1}>
        <ZoomBox x={0} y={0} w={1000} h={740} cw={900} ch={700} t={t} t0={k5} keys={[[k5, 1.0, 0.5, 0.5]]}
          pins={[{ t0: wf(41, "chyme"), pt: ST_PT.body, text: "chyme", dx: 0, dy: 0, hot: true }, { t0: wf(41, "empties"), pt: ST_PT.sphincter, text: "→ duodenum", dx: -10, dy: 110 }]}>
          <Stomach t={t} w={900} churn={1} lit={{ stomach: k5, sphincter: wf(41, "empties") }} />
        </ZoomBox>
        <Facts x={1060} w={740} items={[
          { t: wf(41, "chyme"), text: "food → chyme, a thick liquid", bg: C.forest },
          { t: wf(41, "two"), text: "usually empties in 2–4 hours", big: "2–4 h" },
        ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 4. THE SMALL INTESTINE ================= */
export const SSmall: React.FC = () => {
  const t = useT();
  const a = ST(4), b = BE(4);
  const k1 = s_(44) - 0.2, k2 = s_(45) - 0.2, k3 = wf(46, "papilla") - 0.4, k4 = s_(47) - 0.2, k5 = s_(49) - 0.2, k6 = s_(50) - 0.2;
  const food = kv(t, [[a, fAt("duod")], [k1, fAt("cecum")]]);
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={k1}>
        <ZoomBox x={0} y={0} w={1000} h={740} cw={900} ch={1000} t={t} t0={a} keys={[[a, 1.8, 0.5, 0.78]]}
          pins={[{ t0: s_(43), pt: GI_PT.duod, text: "1", dx: -70, dy: -40, hot: true }, { t0: s_(43) + 0.3, pt: GI_PT.jejunum, text: "2", dx: 60, dy: -60, hot: true }, { t0: s_(43) + 0.6, pt: GI_PT.ileum, text: "3", dx: -40, dy: 60, hot: true }]}>
          {GI(t, { small: a }, food, 0.3)}
        </ZoomBox>
        <Facts x={1060} w={740} items={[
          { t: a + 0.2, text: "long in a living person", big: "≈ 10 ft (3 m)", bg: C.forest },
          { t: wf(42, "inch"), text: "about one inch (2.5 cm) wide" },
          { t: s_(43), text: "3 parts", big: "3" },
        ]} />
      </Seg>
      <Seg t={t} a={k1} b={k2}>
        <KPlate {...DUOD} x={0} y={20} w={1000} a={k1} b={k2} keys={[[k1, 1.0, 0.5, 0.5], [wf(44, "duodenum"), 1.5, 0.4, 0.66], [wf(44, "head"), 1.6, 0.44, 0.6]]}
          labels={[
            { x: 0.37, y: 0.72, text: "duodenum", t: wf(44, "duodenum"), side: "l", hot: true },
            { x: 0.44, y: 0.6, text: "head of pancreas", t: wf(44, "head"), side: "r" },
          ]} />
        <ViewTag t={t} t0={k1 + 0.3} x={20} y={0} text="GRAY'S 1918 · FIG. 1098 · DUODENUM AND PANCREAS" />
      </Seg>
      <Seg t={t} a={k2} b={k3}>
        <ZoomBox x={0} y={0} w={1000} h={740} cw={900} ch={700} t={t} t0={k2} keys={[[k2, 1.0, 0.5, 0.5], [wf(45, "hepatopancreatic"), 1.5, 0.36, 0.7]]}
          pins={[
            { t0: wf(45, "bile"), pt: BT_PT.cbd, text: "bile duct", dx: 150, dy: -80, col: "#D7EBB5" },
            { t0: wf(45, "pancreatic"), pt: BT_PT.pancduct, text: "main pancreatic duct", dx: 60, dy: -110, col: C.banana },
            { t0: wf(45, "hepatopancreatic"), pt: BT_PT.ampulla, text: "hepatopancreatic ampulla", dx: 60, dy: 140, hot: true, size: 26 },
          ]}>
          <BileTree t={t} w={900} lit={{ duod: win(k2, s_(45) + 0.6), cbd: win(wf(45, "bile"), wf(45, "pancreatic")), pancduct: win(wf(45, "pancreatic"), wf(45, "hepatopancreatic")), ampulla: wf(45, "hepatopancreatic") }} bile={ramp(t, wf(45, "bile"), wf(45, "bile") + 0.5)} juice={ramp(t, wf(45, "pancreatic"), wf(45, "pancreatic") + 0.5)} />
        </ZoomBox>
        <ViewTag t={t} t0={k2 + 0.2} x={24} y={20} text="DUCTS INTO THE DUODENUM · SCHEMATIC" />
      </Seg>
      <Seg t={t} a={k3} b={k4}>
        <KPlate {...PAP} x={0} y={0} w={758} a={k3} b={k4} keys={[[k3, 1.0, 0.5, 0.5], [wf(46, "papilla"), 1.6, 0.36, 0.5]]}
          labels={[
            { x: 0.39, y: 0.49, text: "major duodenal papilla", t: wf(46, "papilla"), side: "l", hot: true },
            { x: 0.41, y: 0.54, text: "sphincter of Oddi", t: wf(46, "oddi"), side: "r" },
          ]} />
        <ViewTag t={t} t0={k3 + 0.3} x={20} y={700} text="GRAY'S 1918 · FIG. 1057 · INSIDE THE DUODENUM" />
      </Seg>
      <Seg t={t} a={k1} b={k4}><Facts x={1060} w={740} items={[
        { t: s_(44), text: "Duodenum · 1st + shortest · ≈ 10 in · C-shaped around the head of the pancreas", bg: C.forest },
        { t: s_(45), text: "KEY LANDMARK: bile duct + main pancreatic duct → hepatopancreatic ampulla", bg: C.red },
        { t: wf(46, "papilla"), text: "opens at the major duodenal papilla · guarded by the sphincter of Oddi" },
      ]} /></Seg>
      <Seg t={t} a={k4} b={k5}>
        <ZoomBox x={0} y={0} w={1000} h={740} cw={900} ch={1000} t={t} t0={k4} keys={[[k4, 1.4, 0.5, 0.78], [s_(47), 2.2, 0.62, 0.8], [s_(48), 2.2, 0.42, 0.86]]}
          pins={[
            { t0: s_(47), t1: s_(48), pt: GI_PT.jejunum, text: "jejunum", dx: 30, dy: -90, hot: true },
            { t0: s_(48), pt: GI_PT.ileum, text: "ileum", dx: 0, dy: 70, hot: true },
          ]}>
          {GI(t, { jejunum: win(s_(47), s_(48)), ileum: s_(48) })}
        </ZoomBox>
        <ViewTag t={t} t0={k4 + 0.2} x={24} y={20} text="FRONT VIEW · YOUR LEFT IS ON THE RIGHT OF THE SCREEN" />
        <div style={abs(1040, 0, { display: "flex", flexDirection: "column", gap: 16 })}>
          <Row t={t} t0={s_(47)} n="2" col={DC.small} title="Jejunum · ≈ 3 ft" sub="upper left · thicker, redder wall" w={760} />
          <Row t={t} t0={s_(48)} n="3" col="#F7D8C8" title="Ileum · ≈ 6 ft · LONGEST" sub="lower right" w={760} />
        </div>
      </Seg>
      <Seg t={t} a={k5} b={k6}>
        <KPlate {...CECUM} x={0} y={0} w={960} a={k5} b={k6} keys={[[k5, 1.0, 0.5, 0.5], [wf(49, "ileocecal"), 1.4, 0.48, 0.45]]}
          labels={[
            { x: 0.62, y: 0.4, text: "ileum", t: k5 + 0.3, side: "r", hot: true },
            { x: 0.42, y: 0.47, text: "ileocecal junction", t: wf(49, "ileocecal"), side: "l", hot: true },
            { x: 0.25, y: 0.66, text: "large intestine", t: wf(49, "large"), side: "r" },
          ]} />
        <ViewTag t={t} t0={k5 + 0.3} x={20} y={0} text="GRAY'S 1918 · FIG. 1073" />
        <div style={abs(1040, 200)}><Chip t={t} t0={wf(49, "ileocecal")} bg={C.forest} size={38}>ileocecal valve → large intestine</Chip></div>
      </Seg>
      <Seg t={t} a={k6} b={b + 0.1}>
        <ZoomBox x={0} y={0} w={1000} h={740} cw={900} ch={700} t={t} t0={k6} keys={[[k6, 1.0, 0.5, 0.5]]}>
          <Surface t={t} w={900} lit={{ folds: win(wf(51, "circular"), wf(51, "villi")), villi: win(wf(51, "villi"), wf(51, "microvilli")), micro: win(wf(51, "microvilli"), s_(52)) }} />
        </ZoomBox>
        <ViewTag t={t} t0={k6 + 0.2} x={24} y={20} text="SMALL INTESTINE LINING · SCHEMATIC" />
        <Facts x={1060} w={740} items={[
          { t: k6 + 0.2, text: "most absorption happens here → built for surface area", bg: C.forest },
          { t: wf(51, "circular"), text: "circular folds → villi → microvilli" },
          { t: wf(52, "two"), text: "of absorptive surface", big: "≈ 200 m²", bg: C.red },
        ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 5. LIVER, GALLBLADDER, PANCREAS ================= */
export const SAccessory: React.FC = () => {
  const t = useT();
  const a = ST(5), b = BE(5);
  const k1 = s_(55) - 0.2, k2 = s_(57) - 0.2, k3 = s_(59) - 0.2, k4 = s_(61) - 0.2;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={k1}>
        <ZoomBox x={0} y={0} w={1000} h={740} cw={900} ch={1000} t={t} t0={a} keys={[[a, 1.5, 0.48, 0.6], [wf(54, "liver"), 2.0, 0.4, 0.53]]}
          pins={[
            { t0: a + 0.2, t1: wf(54, "liver"), pt: GI_PT.gall, text: "gallbladder", dx: -40, dy: 80, size: 22 },
            { t0: a + 0.4, t1: wf(54, "liver"), pt: GI_PT.pancreas, text: "pancreas", dx: 40, dy: 60, size: 22 },
            { t0: wf(54, "liver"), pt: GI_PT.liver, text: "liver · upper right", dx: -20, dy: -110, hot: true, size: 24 },
          ]}>
          {GI(t, t < wf(54, "liver") ? { liver: a, gall: a, pancreas: a } : { liver: wf(54, "liver") })}
        </ZoomBox>
        <ViewTag t={t} t0={a + 0.2} x={24} y={20} text="FRONT VIEW · SCHEMATIC" />
      </Seg>
      <Seg t={t} a={k1} b={k2}>
        <KPlate {...LIVER} x={0} y={40} w={1000} a={k1} b={k2} keys={[[k1, 1.0, 0.5, 0.5], [wf(55, "right"), 1.3, 0.65, 0.45], [wf(55, "left"), 1.3, 0.3, 0.5], [s_(56), 1.0, 0.5, 0.5], [wf(56, "caudate"), 1.6, 0.44, 0.45], [wf(56, "quadrate"), 1.6, 0.52, 0.65]]}
          labels={[
            { x: 0.72, y: 0.3, text: "right lobe", t: wf(55, "right"), side: "l", hot: true },
            { x: 0.22, y: 0.5, text: "left lobe", t: wf(55, "left"), side: "r", hot: true },
            { x: 0.42, y: 0.4, text: "caudate lobe", t: wf(56, "caudate"), side: "l", hot: true },
            { x: 0.52, y: 0.67, text: "quadrate lobe", t: wf(56, "quadrate"), side: "l", hot: true },
            { x: 0.64, y: 0.74, text: "gallbladder", t: wf(56, "quadrate") + 0.6, side: "r" },
          ]} />
        <ViewTag t={t} t0={k1 + 0.3} x={20} y={0} text="GRAY'S 1918 · FIG. 1086 · LIVER SEEN FROM BELOW" />
      </Seg>
      <Seg t={t} a={a} b={k2}><Facts x={1060} w={740} items={[
        { t: s_(54), text: "largest gland in the body · upper right, under the ribs", big: "≈ 3 lb (1.4 kg)", bg: C.forest },
        { t: wf(55, "falciform"), text: "large right lobe + smaller left lobe · split in front by the falciform ligament" },
        { t: wf(56, "caudate"), text: "from below: caudate + quadrate lobes" },
      ]} /></Seg>
      <Seg t={t} a={k2} b={k3}>
        <ZoomBox x={0} y={0} w={1000} h={740} cw={900} ch={700} t={t} t0={k2} keys={[[k2, 1.0, 0.5, 0.5], [s_(58), 1.4, 0.5, 0.3]]}
          pins={[
            { t0: wf(58, "right"), pt: BT_PT.rhep, text: "right hepatic duct", dx: -230, dy: 30, size: 26 },
            { t0: wf(58, "left"), pt: BT_PT.lhep, text: "left hepatic duct", dx: 220, dy: 30, size: 26 },
            { t0: wf(58, "common"), pt: BT_PT.chd, text: "common hepatic duct", dx: 230, dy: 40, hot: true, size: 26 },
          ]}>
          <BileTree t={t} w={900} lit={{ liver: win(k2, s_(58)), rhep: wf(58, "right"), lhep: wf(58, "left"), chd: wf(58, "common") }} bile={ramp(t, wf(57, "bile"), wf(57, "bile") + 0.6)} />
        </ZoomBox>
        <ViewTag t={t} t0={k2 + 0.2} x={24} y={20} text="BILE DUCTS · SCHEMATIC" />
      </Seg>
      <Seg t={t} a={k3} b={k4}>
        <KPlate {...GALL} x={0} y={0} w={345} a={k3} b={k4} keys={[[k3, 1.0, 0.5, 0.5]]}
          labels={[
            { x: 0.3, y: 0.3, text: "gallbladder", t: k3 + 0.3, side: "r", hot: true },
            { x: 0.33, y: 0.67, text: "cystic duct", t: wf(60, "cystic"), side: "r", hot: true },
          ]} credit={false} />
        <div style={abs(10, 704, { fontFamily: FONT, fontWeight: 700, fontSize: 17, color: C.forest, background: "rgba(247,246,236,0.9)", padding: "2px 8px", borderRadius: 8 })}>Gray's 1918 · Fig. 1095 · public domain</div>
        <ZoomBox x={380} y={0} w={640} h={740} cw={900} ch={700} t={t} t0={k3} keys={[[k3, 1.0, 0.5, 0.5], [s_(60), 1.3, 0.4, 0.55]]}
          pins={[
            { t0: wf(60, "cystic"), pt: BT_PT.cystic, text: "cystic duct", dx: 40, dy: -70, size: 24 },
            { t0: wf(60, "bile"), pt: BT_PT.cbd, text: "common bile duct", dx: 180, dy: 30, hot: true, size: 24 },
          ]}>
          <BileTree t={t} w={900} lit={{ gall: win(k3, s_(60)), cystic: wf(60, "cystic"), chd: win(wf(60, "hepatic"), wf(60, "bile")), cbd: wf(60, "bile") }} bile={1} />
        </ZoomBox>
      </Seg>
      <Seg t={t} a={k2} b={k4}><Chain t={t} x={1060} y={0} w={740} size={32} items={([
        ["liver makes bile · ≈ 1 L/day", s_(57), DC.liverLight],
        ["right + left hepatic ducts", wf(58, "right"), "#D7EBB5"],
        ["→ common hepatic duct", wf(58, "common"), DC.bile],
        ["gallbladder stores + concentrates", s_(59), DC.gall],
        ["+ cystic duct → common bile duct", wf(60, "bile"), C.banana],
      ] as [string, number, string][])} />
      <div style={abs(1060, 640)}><Chip t={t} t0={wf(57, "fat")} bg={C.forest} size={30}>bile breaks fat into small droplets</Chip></div></Seg>
      <Seg t={t} a={k4} b={b + 0.1}>
        <KPlate {...DUOD} x={0} y={20} w={1000} a={k4} b={b} keys={[[k4, 1.0, 0.5, 0.5], [wf(62, "head"), 1.5, 0.45, 0.6], [wf(62, "tail"), 1.5, 0.7, 0.4], [s_(63), 1.1, 0.55, 0.5]]}
          labels={[
            { x: 0.45, y: 0.6, text: "head", t: wf(62, "head"), side: "l", hot: true },
            { x: 0.55, y: 0.47, text: "body", t: wf(62, "body"), side: "r", hot: true },
            { x: 0.73, y: 0.43, text: "tail", t: wf(62, "tail"), side: "r", hot: true },
            { x: 0.72, y: 0.3, text: "spleen", t: wf(62, "spleen"), side: "r" },
            { x: 0.37, y: 0.73, text: "duodenum", t: wf(62, "duodenum"), side: "l" },
          ]} />
        <ViewTag t={t} t0={k4 + 0.3} x={20} y={0} text="GRAY'S 1918 · FIG. 1098 · STOMACH REMOVED" />
        <Facts x={1060} w={740} items={[
          { t: k4 + 0.2, text: "Pancreas · behind the stomach, crosswise", bg: C.forest },
          { t: wf(62, "head"), text: "head in the C of the duodenum → body → tail at the spleen" },
          { t: s_(63), text: "pancreatic juice a day · enzymes + bicarbonate", big: "> 1 L" },
          { t: s_(64), text: "islets → hormones: insulin, glucagon", bg: C.red },
        ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 6. THE LARGE INTESTINE ================= */
export const SLarge: React.FC = () => {
  const t = useT();
  const a = ST(6), b = BE(6);
  const k1 = s_(66) - 0.2, k2 = s_(67) - 0.2, k3 = s_(71) - 0.2, k4 = s_(73) - 0.2;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={k1}>
        <ZoomBox x={0} y={0} w={1000} h={740} cw={900} ch={1000} t={t} t0={a} keys={[[a, 1.5, 0.5, 0.76]]}>
          {GI(t, { large: a })}
        </ZoomBox>
        <ViewTag t={t} t0={a + 0.2} x={24} y={20} text="LARGE INTESTINE · FRONT VIEW · SCHEMATIC" />
      </Seg>
      <Seg t={t} a={k1} b={k2}>
        <KPlate {...CECUM} x={0} y={0} w={960} a={k1} b={k2} keys={[[k1, 1.0, 0.5, 0.5], [wf(66, "appendix"), 1.5, 0.7, 0.8]]}
          labels={[
            { x: 0.24, y: 0.62, text: "cecum", t: wf(66, "cecum"), side: "r", hot: true },
            { x: 0.62, y: 0.4, text: "ileum", t: wf(66, "pouch"), side: "r" },
            { x: 0.76, y: 0.86, text: "appendix", t: wf(66, "appendix"), side: "l", hot: true },
          ]} />
        <ViewTag t={t} t0={k1 + 0.3} x={20} y={0} text="GRAY'S 1918 · FIG. 1073 · CECUM AND APPENDIX" />
        <Note t={t} t0={wf(66, "appendix") + 0.8} x={20} y={700} old="vermiform process" modern="appendix" />
      </Seg>
      <Seg t={t} a={a} b={k2}><Facts x={1060} w={740} items={[
        { t: a + 0.2, text: "long · much wider than the small intestine", big: "≈ 5 ft (1.5 m)", bg: C.forest },
        { t: wf(66, "cecum"), text: "starts at the cecum · a pouch, lower right" },
        { t: wf(66, "appendix"), text: "the appendix hangs from the cecum" },
      ]} /></Seg>
      <Seg t={t} a={k2} b={k3}>
        <KPlate {...COLON} x={0} y={0} w={888} a={k2} b={k3}
          keys={[[k2, 1.0, 0.5, 0.5], [s_(68), 1.5, 0.35, 0.5], [wf(68, "hepatic"), 1.6, 0.35, 0.4], [s_(69), 1.3, 0.5, 0.42], [wf(69, "splenic"), 1.6, 0.66, 0.35], [s_(70), 1.5, 0.68, 0.52], [wf(70, "sigmoid"), 1.5, 0.55, 0.72]]}
          labels={[
            { x: 0.32, y: 0.56, text: "ascending colon", t: s_(68), side: "l", hot: true, t1: s_(70) },
            { x: 0.33, y: 0.39, text: "hepatic flexure", t: wf(68, "hepatic"), side: "l", t1: s_(70) },
            { x: 0.5, y: 0.45, text: "transverse colon", t: s_(69), side: "r", hot: true, t1: s_(70) },
            { x: 0.67, y: 0.3, text: "splenic flexure", t: wf(69, "splenic"), side: "r", t1: s_(70) },
            { x: 0.675, y: 0.57, text: "descending colon", t: s_(70), side: "r", hot: true },
            { x: 0.48, y: 0.77, text: "sigmoid colon", t: wf(70, "sigmoid"), side: "r", hot: true },
          ]} />
        <ViewTag t={t} t0={k2 + 0.3} x={20} y={700} text="GRAY'S 1918 · FIG. 1223 · SURFACE MARKINGS" />
        <Note t={t} t0={wf(70, "pelvis")} x={20} y={640} old="pelvic colon" modern="sigmoid colon" />
        <div style={abs(930, 0, { display: "flex", flexDirection: "column", gap: 12 })}>
          <div><Chip t={t} t0={k2 + 0.2} bg={C.forest} size={36}>the colon · 4 parts</Chip></div>
          <Row t={t} t0={s_(68)} n="1" col={DC.colon} title="Ascending" sub="up the right · hepatic flexure under the liver" w={850} size={34} />
          <Row t={t} t0={s_(69)} n="2" col={DC.colon} title="Transverse" sub="across · splenic flexure near the spleen" w={850} size={34} />
          <Row t={t} t0={s_(70)} n="3" col={DC.colon} title="Descending" sub="down the left side" w={850} size={34} />
          <Row t={t} t0={wf(70, "sigmoid")} n="4" col={DC.colon} title="Sigmoid" sub="S-shaped · curves into the pelvis" w={850} size={34} />
        </div>
      </Seg>
      <Seg t={t} a={k3} b={k4}>
        <KPlate {...RECT} x={0} y={0} w={445} a={k3} b={k4} keys={[[k3, 1.0, 0.5, 0.5], [s_(72), 1.4, 0.5, 0.78]]} credit={false}
          labels={[
            { x: 0.4, y: 0.25, text: "rectum", t: wf(71, "rectum"), side: "r", hot: true, t1: s_(72) },
            { x: 0.58, y: 0.79, text: "internal", t: wf(72, "internal"), side: "l", hot: true },
            { x: 0.66, y: 0.86, text: "external", t: wf(72, "external"), side: "l", col: C.banana },
          ]} />
        <div style={abs(10, 704, { fontFamily: FONT, fontWeight: 700, fontSize: 17, color: C.forest, background: "rgba(247,246,236,0.9)", padding: "2px 8px", borderRadius: 8 })}>Gray's 1918 · Fig. 1078 · public domain</div>
        <Note t={t} t0={wf(72, "external") + 0.5} x={480} y={640} old="sphincter ani internus / externus" />
        <div style={abs(480, 0, { display: "flex", flexDirection: "column", gap: 14 })}>
          <Row t={t} t0={wf(71, "rectum")} n="R" col={DC.colon} title="Rectum · ≈ 8 in (20 cm)" w={880} />
          <Row t={t} t0={wf(71, "anal")} n="A" col={DC.colonDark} title="Anal canal · 2 sphincters" w={880} />
          <Row t={t} t0={wf(72, "internal")} n="in" col={DC.smooth} title="Internal · smooth muscle" sub="involuntary" w={880} />
          <Row t={t} t0={wf(72, "external")} n="ex" col={DC.skeletal} title="External · skeletal muscle" sub="voluntary" w={880} />
        </div>
      </Seg>
      <Seg t={t} a={k4} b={b + 0.1}>
        <Panel x={0} y={0} w={1000} h={740} t={t} t0={k4}>
          <div style={abs(50, 200)}><ColonSeg t={t} w={900} lit={{ teniae: win(wf(74, "teniae"), wf(74, "haustra")), haustra: win(wf(74, "haustra"), wf(74, "epiploic")), epiploic: win(wf(74, "epiploic"), s_(75)) }} /></div>
          <Tag t={t} t0={wf(74, "teniae")} t1={wf(74, "haustra")} x={50} y={200} w={900} pt={COL_PT.teniae} text="teniae coli" dx={0} dy={-80} hot />
          <Tag t={t} t0={wf(74, "haustra")} t1={wf(74, "epiploic")} x={50} y={200} w={900} pt={COL_PT.haustra} text="haustra" dx={0} dy={-150} hot />
          <Tag t={t} t0={wf(74, "epiploic")} t1={s_(75)} x={50} y={200} w={900} pt={COL_PT.epiploic} text="epiploic appendages" dx={0} dy={110} hot />
        </Panel>
        <ViewTag t={t} t0={k4 + 0.2} x={24} y={20} text="COLON SURFACE · SCHEMATIC" />
        <Facts x={1060} w={740} items={[
          { t: wf(74, "teniae"), text: "Teniae coli · 3 long bands of muscle" },
          { t: wf(74, "haustra"), text: "Haustra · the pouches they create" },
          { t: wf(74, "epiploic"), text: "Epiploic appendages · small sacs of fat" },
          { t: s_(75), text: "absorbs water · forms + stores waste", bg: C.forest },
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
  const k2 = s_(79) - 0.2, k3 = s_(81) - 0.2, k4 = s_(83) - 0.2, k5 = s_(84) - 0.2;
  const W1 = ["Many", "People", "Eat", "Sandwiches", "Slowly", "Late", "Afternoon"];
  const T1 = ["mouth", "pharynx", "esophagus", "stomach", "small intestine", "large intestine", "anus"];
  const tk1 = W1.map((w) => wf(77, w.toLowerCase()));
  const tk2 = [wf(78, "mouth"), wf(78, "pharynx"), wf(78, "esophagus"), wf(78, "stomach"), wf(78, "small"), wf(78, "large"), wf(78, "anus")];
  const ids1 = ["mouth", "pharynx", "esoph", "stomach", "small", "large", "anus"];
  const cur1 = tk2.reduce((acc, tt, i) => (t >= tt - 0.05 ? i : acc), -1);
  const W3 = ["Could", "A", "Tiny", "Dog", "Swim", "Right", "Away"];
  const tk3 = [wf(81, "could"), wf(81, "a", 0), wf(81, "tiny"), wf(81, "dog"), wf(81, "swim"), wf(81, "right"), wf(81, "away")];
  const T3 = ["cecum", "ascending", "transverse", "descending", "sigmoid", "rectum", "anal canal"];
  const tk4 = [wf(82, "cecum"), wf(82, "ascending"), wf(82, "transverse"), wf(82, "descending"), wf(82, "sigmoid"), wf(82, "rectum"), wf(82, "anal")];
  const ids3 = ["cecum", "ascending", "transverse", "descending", "sigmoid", "rectum", "anus"];
  const cur3 = tk4.reduce((acc, tt, i) => (t >= tt - 0.05 ? i : acc), -1);
  const ft = [wf(80, "one"), wf(80, "three"), wf(80, "six")];
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={k2}>
        <TrickCard t={t} t0={a} n={1} title="The GI tract, in order">
          <div style={abs(60, 180, { display: "flex", gap: 20, flexWrap: "wrap", width: 1120, fontFamily: FONT, fontWeight: 800, fontSize: 66, color: C.paper })}>
            {W1.map((w, i) => <span key={w} style={{ opacity: ramp(t, tk1[i] - 0.1, tk1[i] + 0.15) }}><FL w={w} on={t >= tk1[i] ? 1 : 0} /></span>)}
          </div>
          <div style={abs(60, 400, { display: "flex", flexDirection: "column", flexWrap: "wrap", height: 300, gap: 4 })}>
            {T1.map((x, i) => (
              <div key={x} style={{ ...pop(t, tk2[i]), fontFamily: FONT, fontWeight: 800, fontSize: 34, color: i === cur1 ? C.banana : C.paper, transformOrigin: "0% 50%", width: 520 }}>
                <span style={{ color: C.banana, fontSize: 42 }}>{x[0].toUpperCase()}</span>{x.slice(1)}
              </div>
            ))}
          </div>
          {mini(1220, 40, 520, 660, <div style={abs(-150, 6)}><GITract t={t} w={590} lit={cur1 >= 0 ? { [ids1[cur1]]: tk2[cur1] } : { tract: a }} /></div>)}
        </TrickCard>
      </Seg>
      <Seg t={t} a={k2} b={k3}>
        <TrickCard t={t} t0={k2} n={2} title="Small intestine: Dow Jones Industrial">
          <div style={abs(60, 190, { display: "flex", gap: 30, fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper })}>
            {["Dow", "Jones", "Industrial"].map((w) => <span key={w} style={{ opacity: ramp(t, wf(79, w.toLowerCase()) - 0.1, wf(79, w.toLowerCase()) + 0.15) }}><FL w={w} on={t >= wf(79, w.toLowerCase()) ? 1 : 0} /></span>)}
          </div>
          <div style={abs(60, 320, { display: "flex", gap: 24, fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.banana })}>
            {["duodenum", "jejunum", "ileum"].map((w) => <span key={w} style={pop(t, wf(79, w))}>{w}</span>)}
          </div>
          <div style={abs(60, 420, { display: "flex", flexDirection: "column", gap: 14 })}>
            {([["D", 1, ft[0], "1 ft"], ["J", 3, ft[1], "3 ft"], ["I", 6, ft[2], "6 ft"]] as [string, number, number, string][]).map(([l, n, tt, s]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 16, opacity: ramp(t, tt - 0.1, tt + 0.2) }}>
                <div style={{ width: 40, fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.banana }}>{l}</div>
                <div style={{ width: 150 * n * ramp(t, tt, tt + 0.6), height: 44, borderRadius: 22, background: DC.small, border: `3px solid ${C.paper}` }} />
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.paper }}>{s}</div>
              </div>
            ))}
          </div>
          <div style={abs(1180, 560)}><Chip t={t} t0={wf(80, "ten")} bg={C.banana} color={C.forest} size={50}>≈ 10 ft total</Chip></div>
          {mini(1220, 40, 520, 480, <div style={abs(-343, -813)}><GITract t={t} w={1143} lit={t >= wf(79, "ileum") ? { ileum: wf(79, "ileum") } : t >= wf(79, "jejunum") ? { jejunum: wf(79, "jejunum") } : { duod: k2 }} /></div>)}
        </TrickCard>
      </Seg>
      <Seg t={t} a={k3} b={k4}>
        <TrickCard t={t} t0={k3} n={3} title="Large intestine, in order">
          <div style={abs(60, 180, { display: "flex", gap: 16, flexWrap: "wrap", width: 1140, fontFamily: FONT, fontWeight: 800, fontSize: 54, color: C.paper })}>
            {W3.map((w, i) => <span key={w} style={{ opacity: ramp(t, tk3[i] - 0.1, tk3[i] + 0.15) }}><FL w={w} on={t >= tk3[i] ? 1 : 0} /></span>)}
          </div>
          <div style={abs(60, 400, { display: "flex", flexDirection: "column", flexWrap: "wrap", height: 300, gap: 4 })}>
            {T3.map((x, i) => (
              <div key={x} style={{ ...pop(t, tk4[i]), fontFamily: FONT, fontWeight: 800, fontSize: 34, color: i === cur3 ? C.banana : C.paper, transformOrigin: "0% 50%", width: 520 }}>
                <span style={{ color: C.banana, fontSize: 42 }}>{x[0].toUpperCase()}</span>{x.slice(1)}
              </div>
            ))}
          </div>
          {mini(1220, 40, 520, 660, <div style={abs(-289, -693)}><GITract t={t} w={1040} lit={cur3 >= 0 ? { [ids3[cur3]]: tk4[cur3] } : { large: k3 }} /></div>)}
        </TrickCard>
      </Seg>
      <Seg t={t} a={k4} b={k5}>
        <TrickCard t={t} t0={k4} n={4} title="Stomach cells">
          <div style={abs(60, 220, { display: "flex", flexDirection: "column", gap: 24 })}>
            <div><Chip t={t} t0={wf(83, "parietal")} bg="#B07ACF" color={C.forest} size={56}>Parietal → the Acid (HCl)</Chip></div>
            <div><Chip t={t} t0={wf(83, "chief")} bg={DC.chief} color={C.forest} size={56}>Chief → pepsinogen</Chip></div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.matchaLight, opacity: ramp(t, wf(83, "pepsinogen"), wf(83, "pepsinogen") + 0.4) }}>tip: the Chief Cooks the protein</div>
          </div>
          {mini(1000, 40, 740, 660, <div style={abs(-80, 30)}><Gland t={t} w={900} lit={t >= wf(83, "chief") ? { chief: wf(83, "chief") } : { parietal: wf(83, "parietal") }} acid={ramp(t, wf(83, "acid"), wf(83, "acid") + 0.4)} pep={ramp(t, wf(83, "pepsinogen"), wf(83, "pepsinogen") + 0.4)} /></div>)}
        </TrickCard>
      </Seg>
      <Seg t={t} a={k5} b={b + 0.1}>
        <TrickCard t={t} t0={k5} n={5} title="The bile path">
          <div style={abs(60, 210, { display: "flex", flexDirection: "column", gap: 22, fontFamily: FONT, fontWeight: 800, fontSize: 64, color: C.paper })}>
            {([["Liver", "makes it", wf(84, "liver")], ["Gallbladder", "stores it", wf(84, "gallbladder")], ["Duodenum", "uses it", wf(84, "duodenum")]] as [string, string, number][]).map(([o, v, tt]) => (
              <div key={o} style={{ ...pop(t, tt), transformOrigin: "0% 50%" }}><span style={{ color: C.banana }}>{o}</span> {v}</div>
            ))}
          </div>
          {mini(1000, 40, 740, 660, <div style={abs(-80, 30)}><BileTree t={t} w={900} bile={1} lit={t >= wf(84, "duodenum") ? { duod: wf(84, "duodenum"), papilla: wf(84, "duodenum") } : t >= wf(84, "gallbladder") ? { gall: wf(84, "gallbladder") } : { liver: k5 }} /></div>)}
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
  { n: 1, si: 86, q: "Which part of the stomach controls how fast it empties?", a: "the pyloric sphincter", visual: (t, r, ans) => <QV t={t} t0={s_(86)} tag="STOMACH · SCHEMATIC"><div style={abs(50, 20)}><Stomach t={t} w={900} lit={r ? { sphincter: ans } : {}} /></div></QV> },
  { n: 2, si: 88, q: "Which stomach cells secrete hydrochloric acid?", a: "parietal cells", visual: (t, r, ans) => <QV t={t} t0={s_(88)} tag="GASTRIC GLAND · SCHEMATIC"><div style={abs(50, 20)}><Gland t={t} w={900} lit={r ? { parietal: ans } : {}} acid={r ? ramp(t, ans, ans + 0.5) : 0} /></div></QV> },
  { n: 3, si: 90, q: "Which part of the small intestine is the longest?", a: "the ileum (≈ 6 ft)", visual: (t, r, ans) => <QV t={t} t0={s_(90)} tag="SMALL INTESTINE · SCHEMATIC"><div style={abs(-412, -1150)}><GITract t={t} w={1710} lit={r ? { ileum: ans } : { small: s_(90) }} /></div></QV> },
  { n: 4, si: 92, q: "Where does bile drain into the gut?", a: "duodenum · major duodenal papilla", visual: (t, r, ans) => <QV t={t} t0={s_(92)} tag="BILE DUCTS · SCHEMATIC"><div style={abs(50, 20)}><BileTree t={t} w={900} bile={r ? 1 : 0} lit={r ? { papilla: ans, ampulla: ans, duod: ans } : {}} /></div></QV> },
  { n: 5, si: 94, q: "Which flexure sits near the spleen?", a: "the splenic (left colic) flexure", visual: (t, r, ans) => <KPlate {...COLON} x={60} y={0} w={888} a={s_(94) - 0.2} b={BE(8)} keys={[[s_(94), 1.0, 0.5, 0.5], [ans, 1.5, 0.66, 0.35]]} labels={r ? [{ x: 0.67, y: 0.3, text: "splenic flexure", t: ans, side: "l", hot: true }] : []} /> },
];
export const SQuiz: React.FC = () => {
  const t = useT();
  const a = ST(8), b = BE(8);
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(86) - 0.2}>
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
                <div style={abs(50, 500, { ...pop(t, ans), width: 660, background: C.banana, borderRadius: 26, padding: "20px 30px 26px", boxSizing: "border-box", fontFamily: FONT, fontWeight: 800, fontSize: q.a.length > 22 ? 40 : 54, color: C.forest, textAlign: "center" })}>✓ {q.a}</div>
              )}
              {q.n === 5 && reveal > 0 && <div style={abs(50, 672, { ...pop(t, wf(95, "how")), fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.banana, whiteSpace: "nowrap" })}>Your score: ? / 5 · tell me below</div>}
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
    ["GI tract", "mouth → pharynx → esophagus → stomach → small int. → large int. → anus", Math.max(a, s_(97)), DC.tract],
    ["Accessory", "teeth · tongue · salivary glands · liver · gallbladder · pancreas", s_(98), DC.pancreas],
    ["Stomach", "cardia · fundus · body · pylorus · parietal = acid · chief = pepsinogen", s_(99), DC.stomach],
    ["Small int.", "duodenum · jejunum · ileum · bile + pancreatic juice → duodenum", s_(100), DC.small],
    ["Large int.", "cecum → colon → rectum → anal canal", s_(101), DC.colon],
  ];
  const ot = s_(102) - 0.2;
  const outro = ramp(t, ot, ot + 0.5);
  const lit: Lit = t >= s_(101) ? { large: s_(101) } : t >= s_(100) ? { small: s_(100) } : t >= s_(99) ? { stomach: s_(99) } : t >= s_(98) ? { acc: s_(98) } : { tract: a };
  return (
    <Stage a={a} b={END - 0.3}>
      {outro < 1 && (
        <div style={abs(0, 0, { width: 1800, height: 740, borderRadius: 44, background: C.forest })}>
          <div style={abs(70, 40, { fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 8, color: C.banana })}>RECAP</div>
          <div style={abs(70, 110, { display: "flex", flexDirection: "column", gap: 22 })}>
            {items.map(([h, s, tt, col]) => (
              <div key={h} style={{ ...pop(t, tt), display: "flex", alignItems: "center", gap: 24, fontFamily: FONT, fontWeight: 800, transformOrigin: "0% 50%" }}>
                <div style={{ width: 58, height: 58, borderRadius: 29, background: col, border: `4px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, color: C.forest, flexShrink: 0 }}>✓</div>
                <div style={{ width: 230, fontSize: 40, color: C.paper, flexShrink: 0 }}>{h}</div>
                <div style={{ fontSize: 29, color: C.matchaLight, width: 880, lineHeight: 1.15 }}>{s}</div>
              </div>
            ))}
          </div>
          <div style={abs(1300, 60, { opacity: ramp(t, a, a + 0.5), width: 450, height: 620, borderRadius: 32, background: C.card, overflow: "hidden" })}>
            <div style={abs(-55, 0)}><GITract t={t} w={560} lit={lit} /></div>
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
              <div style={{ background: C.red, color: C.paper, borderRadius: 50, padding: "18px 54px 22px", fontSize: 54, letterSpacing: 3, transform: `scale(${1 + 0.05 * Math.max(0, Math.sin((t - ot) * 5))})`, opacity: ramp(t, wf(103, "subscribe"), wf(103, "subscribe") + 0.3) }}>SUBSCRIBE</div>
              <div style={{ fontSize: 34, color: C.matchaLight, opacity: ramp(t, wf(102, "book"), wf(102, "book") + 0.3) }}>study cards: bookplume.com</div>
            </div>
            <div style={{ marginTop: 40, background: C.paper, color: C.forest, borderRadius: 24, padding: "16px 30px 20px", fontSize: 38, opacity: ramp(t, s_(104), s_(104) + 0.4), width: "fit-content" }}>Which part of the digestive system is hardest to remember?</div>
          </div>
        </div>
      )}
    </Stage>
  );
};
