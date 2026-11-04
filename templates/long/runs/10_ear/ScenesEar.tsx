import React from "react";
import { C, FONT, ramp, useT } from "./kit";
import { Facts, Stage, LogoMark } from "./Chrome16";
import { EarOverview, OssicleChain, Labyrinth, Uncoiled, Corti, Macula, Ampulla, OV_PT, OS_PT, LB_PT, UC_PT, CO_PT, AC, Lit } from "./IllusEar";
import { s_, e_, wf, ST, BE, abs, pop, Big, Mk, Seg, Note, Chip, ViewTag, Tag, Panel, KPlate, TrickCard, FL, StudyCard } from "./EarKit";
import { END } from "./timeline";

/* ---------- plates (Gray's Anatomy 1918, public domain) ---------- */
const P = (f: string, w: number, h: number) => ({ src: `plates/${f}.png`, aspect: w / h });
const EAR = P("ear907", 1544, 1459);
const AUR = P("auricle904", 688, 1048);
const DRUM = P("drum909", 1239, 876);
const OSS = P("ossicles919", 827, 1221);
const BONY = P("bony920", 1240, 895);
const MEM = P("membr924", 1307, 968);
const COC = P("cochlea928", 1668, 1060);

/* ---------- camera box for our own diagrams ---------- */
type CK = [number, number, number, number];
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
  if (cw * S >= w) tx = Math.min(0, Math.max(w - cw * S, tx)); else tx = (w - cw * S) / 2;
  if (ch * S >= h) ty = Math.min(0, Math.max(h - ch * S, ty)); else ty = (h - ch * S) / 2;
  return (
    <div style={abs(x, y, { width: w, height: h, borderRadius: 36, overflow: "hidden", background: bg, boxShadow: `0 0 0 4px ${C.line}, 0 18px 40px rgba(31,42,20,0.10)`, ...pop(t, t0, 0.35) })}>
      <div style={{ position: "absolute", left: tx, top: ty, width: cw, height: ch, transform: `scale(${S})`, transformOrigin: "0 0" }}>{children}</div>
      {pins.map((p, i) => <Tag key={i} t={t} t0={p.t0} t1={p.t1} x={tx} y={ty} w={cw * S} vbw={cw} pt={p.pt} text={p.text} dx={p.dx} dy={p.dy} hot={p.hot} size={p.size ?? 30} col={p.col} />)}
    </div>
  );
};
const GroupRow: React.FC<{ t: number; t0: number; col: string; title: string; sub: string; w?: number; n?: string }> = ({ t, t0, col, title, sub, w = 680, n }) => (
  <div style={{ ...pop(t, t0), width: w, display: "flex", alignItems: "center", gap: 18, background: C.card, border: `3px solid ${C.line}`, borderRadius: 24, padding: "12px 22px", fontFamily: FONT, fontWeight: 800, transformOrigin: "0% 50%", boxSizing: "border-box" }}>
    <div style={{ width: 50, height: 50, borderRadius: 25, background: col, border: `3px solid ${C.forest}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, color: C.forest }}>{n}</div>
    <div>
      <div style={{ fontSize: 38, color: C.forest, lineHeight: 1.1 }}>{title}</div>
      <div style={{ fontSize: 27, color: C.matcha, lineHeight: 1.15, marginTop: 2 }}>{sub}</div>
    </div>
  </div>
);
const win = (a: number, b: number) => ({ a, b });
const NumRow: React.FC<{ t: number; t0: number; i: number; col: string; text: string; size?: number; dark?: boolean }> = ({ t, t0, i, col, text, size = 38, dark }) => (
  <div style={{ ...pop(t, t0), display: "flex", alignItems: "center", gap: 16, fontFamily: FONT, fontWeight: 800, fontSize: size, color: dark ? C.paper : C.forest, transformOrigin: "0% 50%" }}>
    <div style={{ width: 50, height: 50, borderRadius: 25, background: col, border: `3px solid ${dark ? C.paper : C.forest}`, color: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{i}</div>{text}
  </div>
);
const OVW = 900, OVH = 700;

/* ================= INTRO ================= */
export const SIntro: React.FC = () => {
  const t = useT();
  const m = s_(3) - 0.2;
  return (
    <Stage a={-1} b={BE(0)}>
      <Seg t={t} a={-1} b={m}>
        <Panel x={0} y={0} w={1000} h={740} t={t} t0={0}>
          <div style={abs(50, 30)}><EarOverview t={t} w={900} waves={ramp(t, 0.2, 0.8) * (1 - ramp(t, e_(0), e_(0) + 0.5))} sound={ramp(t, 0.6, e_(0) - 0.2)} regions={ramp(t, s_(2), s_(2) + 1.4)}
            lit={{ malleus: win(wf(0, "three"), wf(0, "coiled")), incus: win(wf(0, "three"), wf(0, "coiled")), stapes: win(wf(0, "three"), wf(0, "coiled")), cochlea: win(wf(0, "coiled"), e_(0)), nerve: win(wf(0, "brain"), e_(0) + 0.3),
              ...(t > s_(1) ? { cochlea: win(wf(1, "hearing"), wf(1, "balance")), vestibule: win(wf(1, "balance"), e_(1)), canals: win(wf(1, "balance"), e_(1)) } : {}) }} /></div>
          <ViewTag t={t} t0={0.4} x={24} y={690} text="RIGHT EAR · FROM THE FRONT · SCHEMATIC" />
        </Panel>
        <div style={abs(1060, 0, { width: 740, ...pop(t, 0.2) })}>
          <Big size={96}><Mk p={ramp(t, 0.6, 1.6)}>Ear Anatomy</Mk></Big>
          <Big size={96}><Mk p={ramp(t, 1.2, 2.2)}>Made Easy</Mk></Big>
          <Big size={44} color={C.matcha} style={{ marginTop: 10 }}>learn it in about 10 minutes</Big>
        </div>
        <div style={abs(1060, 330, { display: "flex", flexDirection: "column", gap: 16 })}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", width: 740 }}>
            <Chip t={t} t0={wf(0, "three")} bg={C.forest} size={34}>3 tiny bones</Chip>
            <Chip t={t} t0={wf(0, "coiled")} bg={AC.inner} size={34}>a coiled tube of fluid</Chip>
            <Chip t={t} t0={wf(0, "hair")} bg={AC.outer} color={C.forest} size={34}>hair cells</Chip>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Chip t={t} t0={wf(1, "hearing")} bg={C.card} color={C.forest} size={36}>hearing?</Chip>
            <Chip t={t} t0={wf(1, "balance")} bg={C.card} color={C.forest} size={36}>or balance?</Chip>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Chip t={t} t0={wf(2, "three")} bg={C.banana} color={C.forest} size={44}>just 3 parts</Chip>
          </div>
        </div>
      </Seg>
      <Seg t={t} a={m} b={BE(0) + 0.1}>
        <KPlate {...EAR} x={0} y={0} w={785} a={m} b={BE(0)} keys={[[m, 1.0, 0.5, 0.5], [s_(4), 1.1, 0.45, 0.45]]} />
        <ViewTag t={t} t0={m + 0.3} x={20} y={20} text="GRAY'S ANATOMY 1918 · FIG. 907 · RIGHT EAR" />
        <div style={abs(860, 0, { width: 940, display: "flex", gap: 12, flexWrap: "wrap" })}>
          {["nursing school", "med school", "A&P class"].map((x, i) => (
            <Chip key={x} t={t} t0={[wf(3, "nursing"), wf(3, "med"), wf(3, "class")][i]} bg={C.card} color={C.forest} size={32}>{x}</Chip>
          ))}
        </div>
        <div style={abs(860, 90)}><Chip t={t} t0={s_(4)} bg={C.forest} size={42}>In about 10 minutes:</Chip></div>
        <div style={abs(860, 176, { display: "flex", flexDirection: "column", gap: 10 })}>
          {([
            ["the outer ear", wf(4, "outer"), AC.outer],
            ["the eardrum", wf(4, "eardrum"), "#F4DDB0"],
            ["the 3 ossicles", wf(4, "ossicles"), C.matcha],
            ["the cochlea", wf(4, "cochlea"), AC.inner],
            ["the balance organs", wf(4, "balance"), "#E8796B"],
          ] as [string, number, string][]).map(([txt, tt, col]) => (
            <div key={txt} style={{ ...pop(t, tt), display: "flex", alignItems: "center", gap: 18, background: C.card, border: `3px solid ${C.line}`, borderRadius: 24, padding: "8px 22px", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.forest, transformOrigin: "0% 50%", width: 700, boxSizing: "border-box" }}>
              <div style={{ width: 44, height: 44, borderRadius: 22, background: col, border: `3px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>✓</div>
              {txt}
            </div>
          ))}
        </div>
        <div style={abs(860, 640)}><Chip t={t} t0={wf(5, "five")} bg={C.banana} color={C.forest} size={40}>+ 5-question quiz at the end</Chip></div>
      </Seg>
    </Stage>
  );
};

/* ================= 1. THE BIG PICTURE ================= */
export const SBig: React.FC = () => {
  const t = useT();
  const a = ST(1), b = BE(1), m1 = s_(11) - 0.2, m2 = s_(12) - 0.2;
  const o7 = wf(7, "outer"), d7 = wf(7, "middle"), i7 = wf(7, "inner");
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={m1}>
        <Panel x={0} y={0} w={1000} h={740} t={t} t0={a}>
          <div style={abs(50, 30)}><EarOverview t={t} w={900} regions={ramp(t, s_(7), s_(7) + 1.2)} waves={ramp(t, s_(8), s_(8) + 0.4) * (1 - ramp(t, e_(8), e_(8) + 0.4))} sound={t < s_(9) ? ramp(t, wf(8, "collects"), e_(8)) * 0.4 : 0}
            lit={{ outer: win(o7, d7), middle: win(d7, i7), inner: win(i7, s_(8)),
              ...(t >= s_(8) - 0.1 ? { outer: win(s_(8), s_(9)), drum: win(wf(8, "eardrum"), s_(9)) } : {}),
              ...(t >= s_(9) - 0.1 ? { middle: win(s_(9), s_(10)) } : {}),
              ...(t >= s_(10) - 0.1 ? { inner: win(s_(10), m1 + 0.2) } : {}) }} /></div>
          <ViewTag t={t} t0={a + 0.3} x={24} y={690} text="RIGHT EAR · FROM THE FRONT · SCHEMATIC" />
        </Panel>
        <Facts items={[
          { t: s_(7), text: "The ear has 3 parts", big: "3", bg: C.forest },
          { t: s_(8), text: "OUTER ear: collects sound · ends at the eardrum", bg: AC.outer },
          { t: s_(9), text: "MIDDLE ear: small air-filled space · 3 tiny bones", bg: AC.middle },
          { t: s_(10), text: "INNER ear: filled with fluid · organs of hearing + balance", bg: AC.inner },
        ]} />
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <KPlate {...EAR} x={0} y={0} w={785} a={m1} b={m2} keys={[[m1, 1.0, 0.5, 0.5], [wf(11, "temporal"), 1.35, 0.55, 0.5]]}
          labels={[
            { x: 0.53, y: 0.435, text: "middle ear", t: wf(11, "middle"), side: "r", hot: true },
            { x: 0.58, y: 0.62, text: "temporal bone", t: wf(11, "temporal"), side: "l", col: "#EDE5C8" },
          ]} />
        <ViewTag t={t} t0={m1 + 0.3} x={20} y={20} text="GRAY'S 1918 · FIG. 907 · OPENED FROM THE FRONT" />
        <Note t={t} t0={m1 + 1.2} old="auricula" modern="auricle" x={20} y={680} />
        <Facts x={860} w={920} items={[
          { t: s_(11), text: "Middle + inner ear sit deep inside the TEMPORAL BONE of the skull", bg: C.forest },
        ]} />
      </Seg>
      <Seg t={t} a={m2} b={b + 0.1}>
        <Panel x={0} y={0} w={1000} h={740} t={t} t0={m2}>
          <div style={abs(50, 30)}><EarOverview t={t} w={900} lit={{ nerve: wf(12, "vestibulocochlear"), cochlea: win(wf(12, "hearing"), wf(12, "balance")), vestibule: wf(12, "balance"), canals: wf(12, "balance") }} /></div>
          <Tag t={t} t0={wf(12, "vestibulocochlear")} x={50} y={30} w={900} vbw={900} pt={OV_PT.nerve} text="CN VIII" dx={-40} dy={-150} hot size={34} />
          <Tag t={t} t0={wf(12, "hearing")} x={50} y={30} w={900} vbw={900} pt={OV_PT.cochlea} text="hearing" dx={40} dy={150} col="#BFE3EE" />
          <Tag t={t} t0={wf(12, "balance")} x={50} y={30} w={900} vbw={900} pt={OV_PT.canals} text="balance" dx={-180} dy={-60} col="#F6C9AE" />
        </Panel>
        <Facts items={[
          { t: s_(12), text: "Vestibulocochlear nerve = cranial nerve 8", big: "CN VIII", bg: C.forest },
          { t: wf(12, "hearing"), text: "carries BOTH hearing + balance to the brain", bg: AC.inner },
        ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 2. THE OUTER EAR ================= */
export const SOuter: React.FC = () => {
  const t = useT();
  const a = ST(2), b = BE(2), m1 = s_(19) - 0.2, m2 = s_(23) - 0.2;
  const parts: [string, string, number, string][] = [
    ["helix", "the outer rim", wf(16, "helix"), "#E9A23B"],
    ["antihelix", "parallel, just inside", wf(16, "antihelix"), "#D9735F"],
    ["concha", "deep hollow next to the canal", wf(17, "concha"), "#8FA86A"],
    ["tragus", "small flap in front of the canal", wf(17, "tragus"), "#3F9BB8"],
    ["lobule", "earlobe · NO cartilage", wf(18, "lobule"), "#E8796B"],
  ];
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={m1}>
        <KPlate {...AUR} x={0} y={0} w={486} a={a} b={m1} keys={[[a, 1.0, 0.5, 0.5], [wf(16, "helix"), 1.18, 0.5, 0.3], [wf(17, "concha"), 1.2, 0.55, 0.6], [wf(18, "lobule"), 1.18, 0.55, 0.78], [e_(18), 1.0, 0.5, 0.5]]}
          labels={[
            { x: 0.82, y: 0.14, text: "helix", t: wf(16, "helix"), side: "l", col: "#E9A23B", t1: s_(17) },
            { x: 0.25, y: 0.66, text: "antihelix", t: wf(16, "antihelix"), side: "r", col: "#E8A38F", t1: s_(17) },
            { x: 0.44, y: 0.55, text: "concha", t: wf(17, "concha"), side: "r", col: "#BFD49A", t1: wf(17, "tragus") },
            { x: 0.75, y: 0.64, text: "tragus", t: wf(17, "tragus"), side: "l", col: "#BFE3EE", t1: s_(18) },
            { x: 0.62, y: 0.92, text: "lobule", t: wf(18, "lobule"), side: "l", col: "#F3B5A8" },
          ]} />
        <ViewTag t={t} t0={a + 0.3} x={20} y={20} text="GRAY'S 1918 · FIG. 904" />
        <div style={abs(540, 0, { width: 560, display: "flex", flexDirection: "column", gap: 12 })}>
          <div style={pop(t, s_(14))}><Big size={64}>Auricle</Big></div>
          <div style={{ ...pop(t, wf(14, "pinna")), transformOrigin: "0% 50%" }}><Big size={38} color={C.matcha}>also called the pinna</Big></div>
          <div style={{ height: 6 }} />
          {parts.map(([h, s, tt, col]) => <GroupRow key={h} t={t} t0={tt} col={col} title={h} sub={s} w={540} />)}
        </div>
        <Facts x={1130} w={650} items={[
          { t: s_(15), text: "Its curves catch sound + funnel it into the ear canal", bg: AC.outer },
          { t: wf(18, "elastic"), text: "ELASTIC CARTILAGE covered by skin", bg: C.forest },
          { t: wf(18, "lobule"), text: "…except the lobule (earlobe): no cartilage at all", bg: "#E8796B" },
        ]} />
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <ZoomBox t={t} t0={m1} x={0} y={0} w={1000} h={740} cw={OVW} ch={OVH} keys={[[m1, 1.0, 0.5, 0.5], [wf(19, "external"), 1.45, 0.36, 0.5], [s_(21), 1.5, 0.36, 0.5], [s_(22), 1.6, 0.32, 0.48]]}
          pins={[
            { t0: wf(19, "external"), t1: s_(21), pt: OV_PT.canal, text: "ear canal (external acoustic meatus)", dx: 40, dy: -150, hot: true, size: 26 },
            { t0: wf(21, "outer"), t1: s_(22), pt: OV_PT.cart, text: "outer ⅓ · cartilage", dx: -20, dy: -130, size: 26, col: "#F8E6D6" },
            { t0: wf(21, "inner"), t1: s_(22), pt: OV_PT.bonecanal, text: "inner ⅔ · bone", dx: 40, dy: 130, size: 26, col: "#EDE5C8" },
            { t0: wf(22, "earwax"), pt: OV_PT.cerumen, text: "cerumen = earwax", dx: 20, dy: -130, size: 26, col: "#E9C08A" },
          ]}>
          <EarOverview t={t} w={900} dim={0.35} sound={t < s_(20) + 1 ? ramp(t, wf(19, "runs"), e_(19)) * 0.36 : ramp(t, s_(20), e_(20)) * 0.36}
            lit={{ canal: win(wf(19, "external"), s_(21)), cart: win(wf(21, "outer"), wf(21, "inner")), bonecanal: win(wf(21, "inner"), s_(22)), cerumen: s_(22) }} />
        </ZoomBox>
        <Facts items={[
          { t: s_(19), text: "External acoustic meatus = the ear canal", bg: C.forest },
          { t: wf(19, "two"), text: "runs inward about 2.5 cm (about 1 inch)", big: "2.5 cm", bg: AC.outer },
          { t: s_(20), text: "not straight: a gentle S-shaped curve" },
          { t: s_(21), text: "outer ⅓ cartilage · inner ⅔ bone", bg: C.matcha },
          { t: s_(22), text: "glands in its skin make earwax = CERUMEN", bg: "#B77418" },
        ]} />
      </Seg>
      <Seg t={t} a={m2} b={b + 0.1}>
        <KPlate {...DRUM} x={0} y={0} w={1000} a={m2} b={b} keys={[[m2, 1.0, 0.5, 0.5], [s_(25), 1.08, 0.5, 0.5], [s_(26), 1.12, 0.5, 0.55]]}
          labels={[
            { x: 0.30, y: 0.32, text: "tympanic membrane", t: wf(23, "tympanic"), side: "l", hot: true, t1: s_(25) },
            { x: 0.505, y: 0.43, text: "handle of the malleus", t: wf(25, "handle"), side: "l", hot: true },
            { x: 0.462, y: 0.605, text: "umbo", t: wf(26, "umbo"), side: "l", col: "#F2D14E" },
            { x: 0.56, y: 0.70, text: "cone of light", t: wf(26, "cone"), side: "r", col: "#FFF4C2" },
          ]} />
        <ViewTag t={t} t0={m2 + 0.3} x={20} y={20} text="GRAY'S 1918 · FIG. 909 · RIGHT EARDRUM THROUGH A SPECULUM" />
        <Note t={t} t0={wf(25, "handle") + 0.6} old="manubrium of malleus" modern="handle of the malleus" x={20} y={650} />
        <Facts x={1060} w={720} items={[
          { t: s_(23), text: "Tympanic membrane = the eardrum", big: "Eardrum", bg: C.forest },
          { t: s_(24), text: "thin + cone-shaped · skin outside, mucous membrane inside" },
          { t: s_(25), text: "translucent on otoscopy: the malleus handle shows through", bg: AC.middle },
          { t: s_(26), text: "UMBO = tip of the handle · CONE OF LIGHT in front + below", bg: "#B77418" },
        ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 3. THE MIDDLE EAR ================= */
const TubeCompare: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const one = (label: string, len: number, ang: number, tt: number) => (
    <div style={{ ...pop(t, tt), display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <svg width={330} height={230} viewBox="0 0 300 210">
        <circle cx={40} cy={40} r={22} fill={AC.air} stroke={C.forest} strokeWidth={3} />
        <g transform={`rotate(${ang} 40 40)`}><rect x={40} y={30} width={len} height={20} rx={10} fill={AC.air} stroke={C.forest} strokeWidth={3} /></g>
      </svg>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.forest }}>{label}</div>
    </div>
  );
  return (
    <div style={abs(1080, 330, { display: "flex", gap: 30, opacity: ramp(t, t0, t0 + 0.4) })}>
      {one("adult: longer, angled", 250, 36, t0)}
      {one("child: shorter, straighter", 160, 12, t0 + 0.5)}
    </div>
  );
};
export const SMiddle: React.FC = () => {
  const t = useT();
  const a = ST(3), b = BE(3), m1 = s_(30) - 0.2, m2 = s_(34) - 0.2, m3 = s_(39) - 0.2;
  const v1 = wf(34, "malleus"), v2 = wf(34, "incus"), v3 = wf(34, "stapes"), v4 = wf(34, "inner");
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={m1}>
        <KPlate {...EAR} x={0} y={0} w={785} a={a} b={m1} keys={[[a, 1.0, 0.5, 0.5], [s_(28), 1.6, 0.52, 0.42], [s_(29), 1.75, 0.5, 0.38]]}
          labels={[
            { x: 0.53, y: 0.44, text: "tympanic cavity", t: wf(28, "tympanic"), side: "r", hot: true, t1: s_(29) },
            { x: 0.47, y: 0.35, text: "incus", t: wf(29, "ossicles") - 0.3, side: "l", col: "#F2D14E" },
            { x: 0.50, y: 0.41, text: "malleus", t: wf(29, "ossicles"), side: "r", col: "#F2D14E" },
          ]} />
        <ViewTag t={t} t0={a + 0.3} x={20} y={20} text="GRAY'S 1918 · FIG. 907 · THE MIDDLE EAR" />
        <Note t={t} t0={s_(29)} old="attic" modern="epitympanic recess" x={20} y={680} />
        <Facts x={860} w={920} items={[
          { t: s_(27), text: "Step through the eardrum → the middle ear", bg: AC.middle },
          { t: s_(28), text: "= TYMPANIC CAVITY · small, air-filled, inside the temporal bone" },
          { t: s_(29), text: "a chain of 3 tiny bones: the auditory OSSICLES", big: "3", bg: C.forest },
        ]} />
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <KPlate {...OSS} x={0} y={0} w={501} a={m1} b={m2} keys={[[m1, 1.0, 0.5, 0.5], [s_(30), 1.4, 0.4, 0.45], [s_(31), 1.4, 0.5, 0.42], [s_(32), 1.45, 0.66, 0.5], [s_(33), 1.0, 0.5, 0.5]]}
          labels={[
            { x: 0.36, y: 0.30, text: "malleus", t: wf(30, "malleus"), side: "r", hot: true },
            { x: 0.49, y: 0.40, text: "incus", t: wf(31, "incus"), side: "r", hot: true },
            { x: 0.64, y: 0.51, text: "stapes", t: wf(32, "stapes"), side: "l", hot: true },
            { x: 0.86, y: 0.50, text: "oval window", t: wf(32, "oval"), side: "l", col: "#BFE3EE" },
          ]} />
        <ViewTag t={t} t0={m1 + 0.3} x={20} y={20} text="GRAY'S 1918 · FIG. 919" />
        <Note t={t} t0={wf(30, "eardrum")} old="membrana tympani" modern="eardrum" x={20} y={680} />
        <div style={abs(560, 20, { display: "flex", flexDirection: "column", gap: 16 })}>
          <GroupRow t={t} t0={wf(30, "malleus")} col="#F2D14E" n="1" title="Malleus · hammer" sub="its handle is attached to the eardrum" w={620} />
          <GroupRow t={t} t0={wf(31, "incus")} col="#E9A23B" n="2" title="Incus · anvil" sub="in the middle" w={620} />
          <GroupRow t={t} t0={wf(32, "stapes")} col="#D9735F" n="3" title="Stapes · stirrup" sub="footplate sits in the OVAL WINDOW" w={620} />
        </div>
        <div style={abs(560, 470, { ...pop(t, s_(33)), width: 620, background: C.forest, borderRadius: 30, padding: "22px 30px", boxSizing: "border-box", fontFamily: FONT, fontWeight: 800, transformOrigin: "0% 50%" })}>
          <div style={{ fontSize: 30, color: C.banana, letterSpacing: 4 }}>RECORD</div>
          <div style={{ fontSize: 46, color: C.paper, lineHeight: 1.1, marginTop: 6 }}>the stapes is the smallest bone in the human body</div>
        </div>
        <Panel x={1220} y={20} w={580} h={700} t={t} t0={s_(30) + 0.2}>
          <div style={abs(10, 130)}><OssicleChain t={t} w={560} lit={{ malleus: win(wf(30, "malleus"), s_(31)), drum: win(wf(30, "eardrum"), s_(31)), incus: win(wf(31, "incus"), s_(32)), stapes: win(wf(32, "stapes"), END), oval: win(wf(32, "oval"), s_(33)) }} /></div>
        </Panel>
      </Seg>
      <Seg t={t} a={m2} b={m3}>
        <ZoomBox t={t} t0={m2} x={0} y={0} w={1000} h={740} cw={900} ch={700} keys={[[m2, 1.0, 0.5, 0.5], [s_(36), 1.25, 0.42, 0.6], [s_(37), 1.35, 0.6, 0.55], [s_(38), 1.0, 0.5, 0.5]]}
          pins={[
            { t0: wf(36, "tensor"), t1: s_(37), pt: OS_PT.tensor, text: "tensor tympani", dx: 150, dy: 60, hot: true },
            { t0: wf(36, "handle"), t1: s_(37), pt: OS_PT.handle, text: "→ malleus handle", dx: -30, dy: -70, size: 26 },
            { t0: wf(37, "stapedius"), t1: s_(38), pt: OS_PT.stapedius, text: "stapedius", dx: 70, dy: 110, hot: true },
          ]}>
          <OssicleChain t={t} w={900} vib={ramp(t, s_(34), s_(34) + 0.5) * (1 - ramp(t, e_(34), e_(34) + 0.4)) + ramp(t, s_(38), s_(38) + 0.4)} pull={ramp(t, wf(38, "contract"), wf(38, "contract") + 0.6)}
            lit={{ drum: win(wf(34, "eardrum"), v1), malleus: win(v1, v2), incus: win(v2, v3), stapes: win(v3, v4), oval: win(v4, e_(34) + 0.3), vest: win(v4, e_(34) + 0.3),
              tensor: win(wf(36, "tensor"), s_(37)), stapedius: win(wf(37, "stapedius"), s_(38)), ...(t > s_(38) ? { tensor: win(wf(38, "both"), END), stapedius: win(wf(38, "both"), END) } : {}) }} />
        </ZoomBox>
        <Facts items={[
          { t: s_(34), text: "eardrum → malleus → incus → stapes → inner ear", bg: C.forest },
          { t: s_(35), text: "2 tiny muscles control the chain", big: "2" },
          { t: s_(36), text: "TENSOR TYMPANI → pulls the malleus handle · mandibular nerve (trigeminal, CN V)", bg: "#B5523F" },
          { t: s_(37), text: "STAPEDIUS → attaches to the stapes · facial nerve (CN VII)", bg: "#D9735F" },
          { t: s_(38), text: "very loud sound → both contract → dampen the vibration", bg: AC.middle },
        ]} />
      </Seg>
      <Seg t={t} a={m3} b={b + 0.1}>
        <ZoomBox t={t} t0={m3} x={0} y={0} w={1000} h={740} cw={OVW} ch={OVH} keys={[[m3, 1.25, 0.62, 0.62], [s_(40), 1.3, 0.68, 0.72]]}
          pins={[
            { t0: wf(39, "auditory"), pt: OV_PT.tube, text: "auditory (Eustachian) tube", dx: -250, dy: -110, hot: true, size: 28 },
            { t0: wf(40, "nasopharynx"), pt: OV_PT.naso, text: "→ nasopharynx", dx: -60, dy: -80, size: 28, col: "#F6C9AE" },
          ]}>
          <EarOverview t={t} w={900} lit={{ tube: s_(39), cavity: win(s_(39), s_(40)), drum: win(wf(41, "both"), e_(41)) }} />
        </ZoomBox>
        <Facts y={20} items={[
          { t: s_(39), text: "Opening in the FRONT wall: the auditory tube (Eustachian tube)", bg: C.forest },
          { t: s_(40), text: "connects the middle ear → nasopharynx (back of the nose)", bg: AC.middle },
          ...(t < s_(42) - 0.2 ? [{ t: s_(41), text: "opens when you swallow or yawn · keeps air pressure equal on both sides of the eardrum", bg: "#3F9BB8" }] : []),
        ]} />
        {t >= s_(42) - 0.3 && <TubeCompare t={t} t0={s_(42) - 0.2} />}
      </Seg>
    </Stage>
  );
};

/* ================= 4. THE INNER EAR ================= */
export const SInner: React.FC = () => {
  const t = useT();
  const a = ST(4), b = BE(4), m1 = s_(49) - 0.2, m2 = s_(52) - 0.2;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={m1}>
        <KPlate {...BONY} x={0} y={0} w={1000} a={a} b={m1} keys={[[a, 1.0, 0.5, 0.5], [wf(47, "cochlea"), 1.45, 0.78, 0.62], [wf(47, "vestibule"), 1.45, 0.6, 0.72], [wf(47, "semicircular"), 1.15, 0.35, 0.45], [s_(48), 1.0, 0.5, 0.5]]}
          labels={[
            { x: 0.80, y: 0.52, text: "cochlea", t: wf(47, "cochlea"), side: "l", hot: true },
            { x: 0.66, y: 0.83, text: "vestibule", t: wf(47, "vestibule"), side: "r", hot: true },
            { x: 0.44, y: 0.08, text: "semicircular canals (3)", t: wf(47, "semicircular"), side: "r", hot: true },
          ]} />
        <ViewTag t={t} t0={a + 0.3} x={20} y={20} text="GRAY'S 1918 · FIG. 920 · RIGHT BONY LABYRINTH" />
        <Facts x={1060} w={720} items={[
          { t: s_(44), text: "In the PETROUS part of the temporal bone · called the LABYRINTH", bg: C.forest },
          { t: s_(45), text: "2 labyrinths, one inside the other", big: "2" },
          { t: s_(46), text: "BONY labyrinth: cochlea (front) · vestibule (middle) · 3 semicircular canals (back)", bg: AC.inner },
          { t: s_(48), text: "filled with PERILYMPH", big: "Perilymph", bg: "#2E7C96" },
        ]} />
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <Panel x={0} y={0} w={1000} h={740} t={t} t0={m1}>
          <div style={abs(50, 20)}><Labyrinth t={t} w={900} membr={ramp(t, s_(49), s_(49) + 1.0)} lit={{ bony: win(m1, s_(49)), membr: win(s_(49), s_(50)), cochduct: win(wf(50, "cochlear"), wf(50, "utricle")), utricle: win(wf(50, "utricle"), wf(50, "semicircular")), saccule: win(wf(50, "saccule"), wf(50, "semicircular")), ducts: win(wf(50, "semicircular"), s_(51)), ...(t > s_(51) ? { membr: s_(51) } : {}) }} /></div>
          <Tag t={t} t0={wf(50, "cochlear")} t1={s_(51)} x={50} y={20} w={900} vbw={900} pt={LB_PT.cochduct} text="cochlear duct" dx={60} dy={-90} hot />
          <Tag t={t} t0={wf(50, "utricle")} t1={s_(51)} x={50} y={20} w={900} vbw={900} pt={LB_PT.utricle} text="utricle" dx={-150} dy={40} hot />
          <Tag t={t} t0={wf(50, "saccule")} t1={s_(51)} x={50} y={20} w={900} vbw={900} pt={LB_PT.saccule} text="saccule" dx={-60} dy={160} hot />
          <Tag t={t} t0={wf(50, "semicircular")} t1={s_(51)} x={50} y={20} w={900} vbw={900} pt={LB_PT.sup} text="semicircular ducts" dx={170} dy={-10} hot />
          <ViewTag t={t} t0={m1 + 0.3} x={24} y={24} text="BLUE = BONY LABYRINTH · YELLOW = MEMBRANOUS" />
        </Panel>
        <Facts items={[
          { t: s_(49), text: "Inside floats the MEMBRANOUS labyrinth: ducts + sacs", bg: "#B77418" },
          { t: s_(50), text: "cochlear duct · utricle + saccule · 3 semicircular ducts" },
          { t: s_(51), text: "filled with a different fluid: ENDOLYMPH", big: "Endolymph", bg: C.forest },
        ]} />
      </Seg>
      <Seg t={t} a={m2} b={b + 0.1}>
        <KPlate {...BONY} x={0} y={0} w={1000} a={m2} b={b} keys={[[m2, 1.0, 0.5, 0.5], [s_(53), 1.9, 0.53, 0.72], [s_(54), 1.9, 0.53, 0.84]]}
          labels={[
            { x: 0.52, y: 0.70, text: "oval window", t: wf(53, "oval"), side: "l", hot: true },
            { x: 0.55, y: 0.93, text: "round window", t: wf(54, "round"), side: "l", hot: true },
          ]} />
        <ViewTag t={t} t0={m2 + 0.3} x={20} y={20} text="GRAY'S 1918 · FIG. 920 · THE TWO WINDOWS" />
        <Note t={t} t0={wf(53, "oval") + 0.5} old="vestibular fenestra" modern="oval window" x={20} y={600} />
        <Note t={t} t0={wf(54, "round") + 0.5} old="cochlear fenestra" modern="round window" x={20} y={668} />
        <Facts x={1060} w={720} items={[
          { t: s_(52), text: "2 windows connect the inner ear to the middle ear", big: "2", bg: C.forest },
          { t: s_(53), text: "OVAL window: where the stapes pushes in", bg: AC.inner },
          { t: s_(54), text: "ROUND window: a little lower · covered by a thin membrane", bg: "#7FB6C7" },
        ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 5. THE COCHLEA AND HEARING ================= */
export const SCochlea: React.FC = () => {
  const t = useT();
  const a = ST(5), b = BE(5), m1 = s_(59) - 0.2, m2 = s_(61) - 0.2, m3 = s_(64) - 0.2;
  const w0 = s_(59) + 0.2, w1 = e_(59), w2 = e_(60);
  const wave = t < w1 ? 0.48 * ramp(t, w0, w1) : 0.48 + 0.52 * ramp(t, s_(60), w2);
  const hiT = wf(65, "high"), loT = wf(65, "low");
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={m1}>
        <KPlate {...COC} x={0} y={0} w={1000} a={a} b={m1} keys={[[a, 1.0, 0.5, 0.5], [wf(56, "core"), 1.25, 0.43, 0.55], [s_(57), 1.0, 0.5, 0.5], [s_(58), 1.6, 0.8, 0.48]]}
          labels={[
            { x: 0.43, y: 0.62, text: "central core of bone (modiolus)", t: wf(56, "core"), side: "r", col: "#EDE5C8", t1: s_(58) },
            { x: 0.78, y: 0.40, text: "scala vestibuli", t: wf(58, "vestibuli"), side: "l", hot: true },
            { x: 0.92, y: 0.46, text: "cochlear duct", t: wf(58, "duct"), side: "l", col: "#F5C766" },
            { x: 0.78, y: 0.61, text: "scala tympani", t: wf(58, "tympani"), side: "l", hot: true },
          ]} />
        <ViewTag t={t} t0={a + 0.3} x={20} y={20} text="GRAY'S 1918 · FIG. 928 · THE COCHLEA CUT OPEN" />
        <Note t={t} t0={wf(58, "duct") + 0.4} old="ductus cochlearis" modern="cochlear duct" x={20} y={650} />
        <Facts x={1060} w={720} items={[
          { t: s_(56), text: "Cochlea = snail-shaped spiral around a central core of bone", big: "Cochlea", bg: AC.inner },
          { t: s_(57), text: "every turn has 3 channels", big: "3" },
          { t: s_(58), text: "top: scala vestibuli · middle: cochlear duct · bottom: scala tympani", bg: C.forest },
        ]} />
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <Panel x={0} y={0} w={1000} h={740} t={t} t0={m1}>
          <div style={abs(50, 120)}><Uncoiled t={t} w={900} wave={wave} lit={{ oval: win(wf(59, "oval"), wf(59, "wave")), sv: win(wf(59, "perilymph"), s_(60)), st: win(wf(60, "scala"), wf(60, "round")), round: wf(60, "round") }} /></div>
          <Tag t={t} t0={wf(59, "oval")} x={50} y={120} w={900} vbw={900} pt={UC_PT.oval} text="oval window" dx={80} dy={-140} hot />
          <Tag t={t} t0={wf(59, "vestibuli")} x={50} y={120} w={900} vbw={900} pt={UC_PT.sv} text="scala vestibuli" dx={0} dy={-120} />
          <Tag t={t} t0={wf(60, "tip")} x={50} y={120} w={900} vbw={900} pt={UC_PT.apex} text="apex" dx={-20} dy={-170} col="#F2D14E" />
          <Tag t={t} t0={wf(60, "scala")} x={50} y={120} w={900} vbw={900} pt={UC_PT.st} text="scala tympani" dx={0} dy={150} />
          <Tag t={t} t0={wf(60, "round")} x={50} y={120} w={900} vbw={900} pt={UC_PT.round} text="round window bulges" dx={120} dy={160} hot />
          <ViewTag t={t} t0={m1 + 0.3} x={24} y={24} text="THE COCHLEA, UNCOILED · BASE ← → APEX" />
        </Panel>
        <Facts items={[
          { t: s_(59), text: "stapes pushes the oval window → a wave in the perilymph of the scala vestibuli", bg: C.forest },
          { t: wf(60, "tip"), text: "up to the tip (apex) → turns → back down the scala tympani", bg: AC.inner },
          { t: wf(60, "round"), text: "the ROUND WINDOW bulges out", bg: "#7FB6C7" },
        ]} />
      </Seg>
      <Seg t={t} a={m2} b={m3}>
        <Panel x={0} y={0} w={1000} h={740} t={t} t0={m2}>
          <div style={abs(50, 70)}><Corti t={t} w={900} bend={ramp(t, wf(63, "moves"), wf(63, "moves") + 0.6)} signal={ramp(t, wf(63, "signals"), wf(63, "signals") + 0.4)}
            lit={{ basilar: win(wf(61, "basilar"), wf(61, "organ")), inner: win(wf(62, "hair"), wf(62, "stereocilia")), outer: win(wf(62, "hair"), wf(62, "stereocilia")), stereo: win(wf(62, "stereocilia"), e_(63)), tect: win(wf(62, "tectorial"), s_(63)), nerve: wf(63, "cochlear") }} /></div>
          <Tag t={t} t0={wf(61, "basilar")} x={50} y={70} w={900} vbw={900} pt={CO_PT.basilar} text="basilar membrane" dx={120} dy={90} hot />
          <Tag t={t} t0={wf(61, "organ")} t1={s_(62)} x={50} y={70} w={900} vbw={900} pt={CO_PT.outer} text="organ of Corti" dx={150} dy={-30} hot />
          <Tag t={t} t0={wf(62, "hair")} x={50} y={70} w={900} vbw={900} pt={[600, 400]} text="hair cells" dx={190} dy={0} col={AC.hair} />
          <Tag t={t} t0={wf(62, "stereocilia")} x={50} y={70} w={900} vbw={900} pt={CO_PT.stereo} text="stereocilia" dx={150} dy={-80} hot />
          <Tag t={t} t0={wf(62, "tectorial")} x={50} y={70} w={900} vbw={900} pt={CO_PT.tect} text="tectorial membrane" dx={0} dy={-120} col="#DDEBCB" />
          <Tag t={t} t0={wf(63, "cochlear")} x={50} y={70} w={900} vbw={900} pt={CO_PT.nerve} text="cochlear nerve" dx={-60} dy={30} col={AC.nerve} />
          <ViewTag t={t} t0={m2 + 0.3} x={24} y={24} text="INSIDE THE COCHLEAR DUCT · ORGAN OF CORTI" />
        </Panel>
        <Note t={t} t0={wf(61, "organ") + 0.8} old="spiral organ" modern="organ of Corti" x={1060} y={668} />
        <Facts items={[
          { t: s_(61), text: "ORGAN OF CORTI = the organ of hearing · sits on the basilar membrane", bg: C.forest },
          { t: s_(62), text: "hair cells → stereocilia reach up to the tectorial membrane", bg: AC.hair },
          { t: s_(63), text: "membrane moves → stereocilia bend → signal along the cochlear nerve", bg: AC.inner },
        ]} />
      </Seg>
      <Seg t={t} a={m3} b={b + 0.1}>
        <Panel x={0} y={0} w={1000} h={740} t={t} t0={m3}>
          <div style={abs(50, 110)}><Uncoiled t={t} w={900} grad={ramp(t, s_(64), s_(64) + 0.6)} placeK={ramp(t, s_(64) + 0.3, s_(64) + 1)} place={t < loT ? (t < hiT ? 0.5 : 0.1) : 0.86} lit={{ basilar: win(s_(64), hiT) }} /></div>
          <Tag t={t} t0={hiT} t1={loT} x={50} y={110} w={900} vbw={900} pt={[200, 300]} text="high pitch → base" dx={60} dy={-170} hot />
          <Tag t={t} t0={loT} x={50} y={110} w={900} vbw={900} pt={[720, 300]} text="low pitch → apex" dx={-60} dy={-170} col="#F2D14E" />
          <ViewTag t={t} t0={m3 + 0.3} x={24} y={24} text="BASILAR MEMBRANE · BASE ← → APEX" />
        </Panel>
        <Facts items={[
          { t: s_(64), text: "different pitches move different parts of the membrane", bg: C.forest },
          { t: hiT, text: "HIGH pitch → the BASE, near the windows", bg: "#2E7C96" },
          { t: loT, text: "LOW pitch → the tip, the APEX", bg: "#B77418" },
          { t: s_(66), text: "together: about 20 to 20,000 hertz", big: "20–20,000 Hz" },
        ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 6. BALANCE ================= */
export const SBalance: React.FC = () => {
  const t = useT();
  const a = ST(6), b = BE(6), m1 = s_(69) - 0.2, m2 = s_(72) - 0.2, m3 = s_(74) - 0.2, m4 = s_(76) - 0.2;
  const tl = wf(70, "tilt"), sp = wf(70, "speed");
  const tilt = t < sp ? 0.9 * Math.sin(Math.min(1, ramp(t, tl, tl + 0.6)) * Math.PI / 2) : 0.9 * (1 - ramp(t, sp, sp + 0.4)) + 0.7 * ramp(t, sp + 0.4, sp + 0.9) * (1 - ramp(t, e_(70) + 0.5, e_(70) + 1.2));
  const tn = wf(74, "turn");
  const turn = ramp(t, tn, tn + 0.8) * (1 - ramp(t, e_(74) + 1.2, e_(74) + 2.0));
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={m1}>
        <KPlate {...MEM} x={0} y={0} w={1000} a={a} b={m1} keys={[[a, 1.0, 0.5, 0.5], [wf(68, "utricle"), 1.4, 0.55, 0.52]]}
          labels={[
            { x: 0.50, y: 0.50, text: "utricle", t: wf(68, "utricle"), side: "l", hot: true },
            { x: 0.64, y: 0.56, text: "saccule", t: wf(68, "saccule"), side: "r", hot: true },
          ]} />
        <ViewTag t={t} t0={a + 0.3} x={20} y={20} text="GRAY'S 1918 · FIG. 924 · MEMBRANOUS LABYRINTH" />
        <Facts x={1060} w={720} items={[
          { t: s_(67), text: "Balance", big: "Balance", bg: C.forest },
          { t: s_(68), text: "the vestibule holds 2 sacs: the UTRICLE + the SACCULE", bg: "#B77418" },
        ]} />
      </Seg>
      <Seg t={t} a={m1} b={m2}>
        <Panel x={0} y={0} w={1000} h={740} t={t} t0={m1}>
          <div style={abs(110, 80)}><Macula t={t} w={780} tilt={tilt} lit={{ hair: win(wf(69, "hair"), wf(69, "jelly")), gel: win(wf(69, "jelly"), wf(69, "crystals")), oto: win(wf(69, "crystals"), s_(70)) }} /></div>
          <Tag t={t} t0={wf(69, "macula")} x={110} y={80} w={780} vbw={600} pt={[520, 398]} text="macula" dx={40} dy={60} hot />
          <Tag t={t} t0={wf(69, "hair")} x={110} y={80} w={780} vbw={600} pt={[110, 330]} text="hair cells" dx={-30} dy={-10} col={AC.hair} size={28} />
          <Tag t={t} t0={wf(69, "jelly")} x={110} y={80} w={780} vbw={600} pt={[560, 220]} text="jelly layer" dx={-20} dy={-140} col="#DDEBCB" size={28} />
          <Tag t={t} t0={wf(69, "otoliths")} x={110} y={80} w={780} vbw={600} pt={[300, 170]} text="otoliths" dx={-40} dy={-120} hot />
          {t > tl && <div style={abs(40, 640, { ...pop(t, tl), fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.forest })}>{t < sp ? "↻ head tilts → crystals slide → hair cells bend" : "→ speeding up in a straight line"}</div>}
          <ViewTag t={t} t0={m1 + 0.3} x={24} y={24} text="MACULA OF THE UTRICLE / SACCULE" />
        </Panel>
        <Facts items={[
          { t: s_(69), text: "MACULA: hair cells + jelly layer topped with calcium carbonate crystals = OTOLITHS", bg: C.forest },
          { t: s_(70), text: "tilt your head / speed up in a straight line → crystals shift → hair cells bend", bg: AC.hair },
          { t: s_(71), text: "UTRICLE + SACCULE: head position + linear acceleration", bg: "#B77418" },
        ]} />
      </Seg>
      <Seg t={t} a={m2} b={m3}>
        <KPlate {...MEM} x={0} y={0} w={1000} a={m2} b={m3} keys={[[m2, 1.0, 0.5, 0.5], [s_(73), 1.6, 0.4, 0.62]]}
          labels={[
            { x: 0.30, y: 0.24, text: "superior", t: wf(72, "three"), side: "r", col: "#F6C9AE" },
            { x: 0.12, y: 0.72, text: "posterior", t: wf(72, "three") + 0.3, side: "r", col: "#F6C9AE" },
            { x: 0.30, y: 0.555, text: "lateral", t: wf(72, "three") + 0.6, side: "l", col: "#F6C9AE" },
            { x: 0.37, y: 0.725, text: "ampulla", t: wf(73, "ampulla"), side: "r", hot: true },
          ]} />
        <ViewTag t={t} t0={m2 + 0.3} x={20} y={20} text="GRAY'S 1918 · FIG. 924 · SEMICIRCULAR DUCTS" />
        <Note t={t} t0={wf(72, "three") + 1.0} old="external" modern="lateral semicircular duct" x={20} y={680} />
        <Facts x={1060} w={720} items={[
          { t: s_(72), text: "3 semicircular canals at RIGHT ANGLES — like the corners of a box", big: "90°", bg: C.forest },
          { t: s_(73), text: "each has a swelling at its base: the AMPULLA · hair cells in a jelly cap = CUPULA", bg: "#B77418" },
        ]} />
      </Seg>
      <Seg t={t} a={m3} b={m4}>
        <Panel x={0} y={0} w={1000} h={740} t={t} t0={m3}>
          <div style={abs(110, 80)}><Ampulla t={t} w={780} turn={turn} lit={{ cupula: win(wf(74, "cupula"), END) }} /></div>
          <Tag t={t} t0={m3 + 0.2} x={110} y={80} w={780} vbw={600} pt={[300, 150]} text="cupula" dx={160} dy={-40} hot />
          <Tag t={t} t0={m3 + 0.4} x={110} y={80} w={780} vbw={600} pt={[300, 380]} text="hair cells" dx={170} dy={60} col={AC.hair} size={28} />
          <Tag t={t} t0={wf(74, "endolymph")} x={110} y={80} w={780} vbw={600} pt={[90, 160]} text="endolymph lags" dx={30} dy={-110} col="#F5C766" size={28} />
          <ViewTag t={t} t0={m3 + 0.3} x={24} y={24} text="INSIDE AN AMPULLA" />
        </Panel>
        <Facts items={[
          { t: s_(74), text: "turn your head → endolymph lags behind → pushes the cupula", bg: C.forest },
          { t: s_(75), text: "SEMICIRCULAR CANALS: rotation", big: "Rotation", bg: "#B5523F" },
        ]} />
      </Seg>
      <Seg t={t} a={m4} b={b + 0.1}>
        <Panel x={0} y={0} w={1000} h={740} t={t} t0={m4}>
          <div style={abs(50, 20)}><Labyrinth t={t} w={900} lit={{ nerve: wf(76, "vestibular"), vestibule: win(wf(76, "vestibular"), wf(76, "joins")), canals: win(wf(76, "vestibular"), wf(76, "joins")), cochlea: wf(76, "cochlear") }} /></div>
          <Tag t={t} t0={wf(76, "eight")} x={50} y={20} w={900} vbw={900} pt={LB_PT.nerve} text="CN VIII → brainstem + cerebellum" dx={-160} dy={-120} hot size={28} />
        </Panel>
        <Facts items={[
          { t: s_(76), text: "vestibular nerve + cochlear nerve = cranial nerve 8", big: "CN VIII", bg: C.forest },
          { t: wf(76, "brainstem"), text: "→ to the brainstem + the cerebellum" },
        ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 7. MEMORY TRICKS ================= */
export const STricks: React.FC = () => {
  const t = useT();
  const a = ST(7), b = BE(7);
  const big = (txt: React.ReactNode, tt: number, size = 72, col = C.paper) => (
    <div style={{ ...pop(t, tt), fontFamily: FONT, fontWeight: 800, fontSize: size, color: col, transformOrigin: "0% 50%", lineHeight: 1.1 }}>{txt}</div>
  );
  const hl = (s: string) => <span style={{ color: C.banana, textShadow: `0 0 18px ${C.bananaDark}` }}>{s}</span>;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(80) - 0.2}>
        <TrickCard t={t} t0={a} n={1} title="The ossicles, eardrum → inward">
          <div style={abs(60, 190, { display: "flex", flexDirection: "column", gap: 8 })}>
            {([["Many", "Malleus", wf(78, "many"), wf(78, "malleus")], ["Ice", "Incus", wf(78, "ice"), wf(78, "incus")], ["Skaters", "Stapes", wf(78, "skaters"), wf(78, "stapes")]] as [string, string, number, number][]).map(([w, x, tt, t2]) => (
              <div key={w} style={{ ...pop(t, tt), display: "flex", alignItems: "baseline", gap: 30, fontFamily: FONT, fontWeight: 800, fontSize: 78, color: C.paper, transformOrigin: "0% 50%" }}>
                <FL w={w} on={1} /><span style={{ fontSize: 46, color: C.matchaLight, opacity: ramp(t, t2, t2 + 0.3) }}>→ {x}</span>
              </div>
            ))}
          </div>
          <div style={abs(60, 610, { display: "flex", gap: 14 })}>
            {([["hammer", wf(79, "hammer")], ["anvil", wf(79, "anvil")], ["stirrup → oval window", wf(79, "stirrup")]] as [string, number][]).map(([x, tt]) => <Chip key={x} t={t} t0={tt} bg={C.banana} color={C.forest} size={36}>{x}</Chip>)}
          </div>
          <div style={abs(1000, 40, { width: 760, height: 660, borderRadius: 36, background: C.card, overflow: "hidden" })}>
            <div style={abs(-40, 40)}><OssicleChain t={t} w={840} vib={ramp(t, wf(79, "hammer"), wf(79, "hammer") + 0.4)} lit={{ malleus: win(wf(78, "many"), wf(78, "ice")), incus: win(wf(78, "ice"), wf(78, "skaters")), stapes: win(wf(78, "skaters"), s_(79)), ...(t > s_(79) ? { malleus: win(wf(79, "hammer"), wf(79, "anvil")), incus: win(wf(79, "anvil"), wf(79, "stirrup")), stapes: wf(79, "stirrup"), oval: wf(79, "oval") } : {}) }} /></div>
          </div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={s_(80) - 0.2} b={s_(81) - 0.2}>
        <TrickCard t={t} t0={s_(80) - 0.2} n={2} title="The 2 muscles: same first letter">
          <div style={abs(60, 210, { display: "flex", flexDirection: "column", gap: 50 })}>
            {big(<>{hl("T")}ensor {hl("T")}ympani → {hl("T")}rigeminal</>, wf(80, "tensor"), 62)}
            {big(<>{hl("S")}tapedius → {hl("S")}eventh <span style={{ fontSize: 40, color: C.matchaLight }}>(CN VII, facial)</span></>, wf(80, "stapedius"), 62)}
          </div>
          <div style={abs(60, 560, { opacity: ramp(t, wf(80, "trigeminal"), wf(80, "trigeminal") + 0.4), fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.matchaLight })}>tensor tympani: mandibular branch of the trigeminal (CN V)</div>
          <div style={abs(1080, 40, { width: 680, height: 660, borderRadius: 36, background: C.card, overflow: "hidden" })}>
            <div style={abs(-100, 20)}><OssicleChain t={t} w={860} lit={{ tensor: win(wf(80, "tensor"), wf(80, "stapedius")), stapedius: wf(80, "stapedius") }} /></div>
          </div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={s_(81) - 0.2} b={s_(82) - 0.2}>
        <TrickCard t={t} t0={s_(81) - 0.2} n={3} title="The 2 fluids">
          <div style={abs(60, 210, { display: "flex", flexDirection: "column", gap: 50 })}>
            <div>{big(<><span style={{ color: "#8FD3EA" }}>PERI</span>lymph</>, wf(81, "perilymph"), 80)}{big(<>on the <span style={{ color: "#8FD3EA" }}>PERI</span>meter · outside</>, wf(81, "perimeter"), 44, C.matchaLight)}</div>
            <div>{big(<><span style={{ color: AC.endo }}>ENDO</span>lymph</>, wf(81, "endolymph"), 80)}{big(<>inside the ducts</>, wf(81, "inside"), 44, C.matchaLight)}</div>
          </div>
          <div style={abs(1080, 40, { width: 680, height: 660, borderRadius: 36, background: C.card, overflow: "hidden" })}>
            <div style={abs(10, 80)}><Labyrinth t={t} w={660} lit={{ bony: win(wf(81, "perilymph"), wf(81, "endolymph")), membr: wf(81, "endolymph") }} /></div>
          </div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={s_(82) - 0.2} b={s_(83) - 0.2}>
        <TrickCard t={t} t0={s_(82) - 0.2} n={4} title="Pitch in the cochlea">
          <div style={abs(60, 220, { display: "flex", flexDirection: "column", gap: 40 })}>
            {big(<>{hl("H")}igh at the {hl("B")}ase</>, wf(82, "high"), 80)}
            {big(<>{hl("L")}ow at the {hl("A")}pex</>, wf(82, "low"), 80)}
          </div>
          <div style={abs(1000, 120, { width: 760, height: 520, borderRadius: 36, background: C.card, overflow: "hidden" })}>
            <div style={abs(20, 60)}><Uncoiled t={t} w={720} grad={1} placeK={1} place={t < wf(82, "low") ? 0.1 : 0.86} /></div>
          </div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={s_(83) - 0.2} b={s_(84) - 0.2}>
        <TrickCard t={t} t0={s_(83) - 0.2} n={5} title="Balance">
          <div style={abs(60, 220, { display: "flex", flexDirection: "column", gap: 40 })}>
            {big(<>{hl("C")}anals for {hl("C")}ircles <span style={{ fontSize: 40, color: C.matchaLight }}>(rotation)</span></>, wf(83, "canals"), 64)}
            {big(<>{hl("S")}acs for {hl("S")}traight lines + tilt</>, wf(83, "sacs"), 64)}
          </div>
          <div style={abs(1000, 60, { width: 360, height: 600, borderRadius: 32, background: C.card, overflow: "hidden", ...pop(t, wf(83, "canals")) })}>
            <div style={abs(0, 140)}><Ampulla t={t} w={360} turn={Math.sin(t * 2.2) * 0.8} /></div>
            <div style={abs(0, 30, { width: 360, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.forest })}>ampulla</div>
          </div>
          <div style={abs(1400, 60, { width: 360, height: 600, borderRadius: 32, background: C.card, overflow: "hidden", ...pop(t, wf(83, "sacs")) })}>
            <div style={abs(0, 140)}><Macula t={t} w={360} tilt={Math.sin(t * 1.6) * 0.8} /></div>
            <div style={abs(0, 30, { width: 360, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.forest })}>macula</div>
          </div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={s_(84) - 0.2} b={b + 0.1}>
        <div style={abs(40, 60)}>
          <StudyCard t={t} flip={wf(84, "flip") - 0.1} w={940}
            front={
              <div style={{ position: "relative", width: 880, height: 560 }}>
                <div style={{ position: "absolute", left: 20, top: 0, fontSize: 40, color: C.matcha }}>Name the bone</div>
                <div style={{ position: "absolute", left: 160, top: 80 }}><OssicleChain t={t} w={600} lit={{ stapes: s_(84) }} dim={0.7} /></div>
              </div>
            }
            back={"Stapes\nsmallest bone in the body\nfootplate in the oval window"} />
        </div>
        <div style={abs(1060, 80, { width: 720 })}>
          <div style={pop(t, s_(84))}><Big size={70}>Test yourself</Big></div>
          <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 18 }}>
            <div><Chip t={t} t0={wf(84, "look")} bg={C.card} color={C.forest} size={40}>1 · look at the picture</Chip></div>
            <div><Chip t={t} t0={wf(84, "name")} bg={C.matcha} size={40}>2 · name the structure</Chip></div>
            <div><Chip t={t} t0={wf(84, "flip")} bg={C.forest} size={40}>3 · flip the card to check</Chip></div>
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
    n: 1, si: 86, q: "Name the 3 ossicles, in order, from the eardrum.", a: "malleus · incus · stapes",
    visual: (t, r, ans) => (
      <Panel x={0} y={0} w={1000} h={740} t={t} t0={s_(86) - 0.2}>
        <div style={abs(50, 20)}><OssicleChain t={t} w={900} lit={r ? { malleus: ans, incus: ans + 0.45, stapes: ans + 0.9 } : { drum: s_(86) + 0.4 }} dim={0.3} /></div>
        {r > 0 && <>
          <Tag t={t} t0={ans} x={50} y={20} w={900} vbw={900} pt={OS_PT.malleus} text="1 · malleus" dx={-20} dy={-90} hot />
          <Tag t={t} t0={ans + 0.45} x={50} y={20} w={900} vbw={900} pt={OS_PT.incus} text="2 · incus" dx={150} dy={-40} hot />
          <Tag t={t} t0={ans + 0.9} x={50} y={20} w={900} vbw={900} pt={OS_PT.stapes} text="3 · stapes" dx={0} dy={120} hot />
        </>}
      </Panel>
    ),
  },
  {
    n: 2, si: 88, q: "Which nerve supplies the stapedius muscle?", a: "facial nerve · CN VII",
    visual: (t, r, ans) => (
      <Panel x={0} y={0} w={1000} h={740} t={t} t0={s_(88) - 0.2}>
        <div style={abs(50, 20)}><OssicleChain t={t} w={900} lit={{ stapedius: s_(88) + 0.4, ...(r ? { stapes: ans } : {}) }} pull={r ? ramp(t, ans, ans + 0.6) : 0} /></div>
        <Tag t={t} t0={s_(88) + 0.4} x={50} y={20} w={900} vbw={900} pt={OS_PT.stapedius} text="stapedius" dx={90} dy={110} hot />
        {r > 0 && <Tag t={t} t0={ans} x={50} y={20} w={900} vbw={900} pt={[620, 560]} text="← facial nerve (CN VII)" dx={60} dy={110} col="#F2D14E" />}
      </Panel>
    ),
  },
  {
    n: 3, si: 90, q: "What connects the middle ear to the nasopharynx?", a: "auditory (Eustachian) tube",
    visual: (t, r, ans) => (
      <Panel x={0} y={0} w={1000} h={740} t={t} t0={s_(90) - 0.2}>
        <div style={abs(50, 30)}><EarOverview t={t} w={900} lit={r ? { tube: ans } : { cavity: s_(90) + 0.4 }} /></div>
        {r > 0 && <Tag t={t} t0={ans} x={50} y={30} w={900} vbw={900} pt={OV_PT.tube} text="auditory tube" dx={-80} dy={100} hot />}
      </Panel>
    ),
  },
  {
    n: 4, si: 92, q: "Where in the cochlea are HIGH-pitched sounds detected?", a: "at the base",
    visual: (t, r, ans) => (
      <Panel x={0} y={0} w={1000} h={740} t={t} t0={s_(92) - 0.2}>
        <div style={abs(50, 110)}><Uncoiled t={t} w={900} grad={r ? ramp(t, ans, ans + 0.5) : 0} placeK={r ? ramp(t, ans, ans + 0.5) : 0} place={0.1} /></div>
        {r > 0 && <Tag t={t} t0={ans + 0.2} x={50} y={110} w={900} vbw={900} pt={[200, 300]} text="base · near the windows" dx={80} dy={-170} hot />}
      </Panel>
    ),
  },
  {
    n: 5, si: 94, q: "Which structures sense ROTATION of the head?", a: "the semicircular canals",
    visual: (t, r, ans) => (
      <Panel x={0} y={0} w={1000} h={740} t={t} t0={s_(94) - 0.2}>
        <div style={abs(50, 20)}><Labyrinth t={t} w={900} lit={r ? { canals: ans, ducts: ans } : {}} /></div>
        {r > 0 && <Tag t={t} t0={ans} x={50} y={20} w={900} vbw={900} pt={LB_PT.sup} text="semicircular canals" dx={150} dy={0} hot />}
      </Panel>
    ),
  },
];
export const SQuiz: React.FC = () => {
  const t = useT();
  const a = ST(8), b = BE(8);
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(86) - 0.2}>
        <div style={abs(0, 0, { width: 1800, height: 740, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" })}>
          <div style={pop(t, a)}><Big size={150}>QUIZ</Big></div>
          <div style={{ marginTop: 20 }}><Chip t={t} t0={a + 0.3} bg={C.banana} color={C.forest} size={44}>5 questions · pause if you need more time</Chip></div>
        </div>
      </Seg>
      {QS.map((q, i) => {
        const ask = s_(q.si), pause = e_(q.si), ans = s_(q.si + 1);
        const end = i < QS.length - 1 ? s_(QS[i + 1].si) - 0.2 : s_(96) - 0.2;
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
                <div style={abs(50, 520, { ...pop(t, ans), width: 660, background: C.banana, borderRadius: 26, padding: "20px 30px 26px", boxSizing: "border-box", fontFamily: FONT, fontWeight: 800, fontSize: q.a.length > 18 ? 42 : 56, color: C.forest, textAlign: "center" })}>✓ {q.a}</div>
              )}
            </div>
          </Seg>
        );
      })}
      <Seg t={t} a={s_(96) - 0.2} b={b + 0.1}>
        <div style={abs(0, 0, { width: 1800, height: 740, borderRadius: 44, background: C.card, border: `4px solid ${C.line}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" })}>
          <Big size={110}>Your score: <span style={{ color: C.matcha }}>? / 5</span></Big>
          <div style={{ marginTop: 30 }}><Chip t={t} t0={wf(96, "tell")} bg={C.forest} size={46}>tell me in the comments</Chip></div>
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
    ["3 parts", "outer ear collects sound · ends at the eardrum", Math.max(a, s_(98)), AC.outer],
    ["Ossicles", "malleus → incus → stapes (Many Ice Skaters)", s_(99), C.matchaLight],
    ["Tube", "auditory tube keeps the pressure equal", s_(100), "#BFE3EE"],
    ["Labyrinth", "perilymph outside · endolymph inside", s_(101), AC.endo],
    ["Cochlea", "hearing · high at the base, low at the apex", s_(102), "#3F9BB8"],
    ["Balance", "vestibule (sacs) + semicircular canals", s_(103), "#E8796B"],
  ];
  const ot = s_(104) - 0.2;
  const outro = ramp(t, ot, ot + 0.5);
  return (
    <Stage a={a} b={END - 0.3}>
      {outro < 1 && (
        <div style={abs(0, 0, { width: 1800, height: 740, borderRadius: 44, background: C.forest })}>
          <div style={abs(70, 40, { fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 8, color: C.banana })}>RECAP</div>
          <div style={abs(70, 110, { display: "flex", flexDirection: "column", gap: 20 })}>
            {items.map(([h, s, tt, col]) => (
              <div key={h} style={{ ...pop(t, tt), display: "flex", alignItems: "center", gap: 24, fontFamily: FONT, fontWeight: 800, transformOrigin: "0% 50%" }}>
                <div style={{ width: 58, height: 58, borderRadius: 29, background: col, border: `4px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, color: C.forest, flexShrink: 0 }}>✓</div>
                <div style={{ width: 260, fontSize: 46, color: C.paper, flexShrink: 0 }}>{h}</div>
                <div style={{ fontSize: 32, color: C.matchaLight, width: 860 }}>{s}</div>
              </div>
            ))}
          </div>
          <div style={abs(1270, 110, { opacity: ramp(t, a, a + 0.5), width: 480, height: 540, borderRadius: 32, background: C.card, overflow: "hidden" })}>
            <div style={abs(-10, 80)}><EarOverview t={t} w={500} waves={1} sound={((t - a) / 6) % 1} lit={{ outer: win(s_(98), s_(99)), middle: win(s_(99), s_(101)), inner: win(s_(101), END) }} /></div>
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
              <div style={{ background: C.red, color: C.paper, borderRadius: 50, padding: "18px 54px 22px", fontSize: 54, letterSpacing: 3, transform: `scale(${1 + 0.05 * Math.max(0, Math.sin((t - ot) * 5))})`, opacity: ramp(t, wf(104, "subscribe"), wf(104, "subscribe") + 0.3) }}>SUBSCRIBE</div>
              <div style={{ fontSize: 34, color: C.matchaLight, opacity: ramp(t, wf(104, "book"), wf(104, "book") + 0.3) }}>study cards: bookplume.com</div>
            </div>
            <div style={{ marginTop: 40, background: C.paper, color: C.forest, borderRadius: 24, padding: "16px 30px 20px", fontSize: 40, opacity: ramp(t, s_(105), s_(105) + 0.4), width: "fit-content" }}>Which part of the body should we learn next?</div>
          </div>
        </div>
      )}
    </Stage>
  );
};
