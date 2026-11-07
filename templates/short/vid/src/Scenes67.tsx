import React from "react";
import { Img, staticFile } from "remotion";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { ANCHOR, BCOL, PCOL, Part, SubDiagram } from "./Sub67";

export const A513 = 1735 / 2473;
export const liveAlpha = (_t: number) => 0;

export const pop = (t: number, t0: number, d = 0.3) => {
  const p = ramp(t, t0, t0 + d);
  return { opacity: p, transform: `scale(${0.6 + 0.4 * p + 0.08 * Math.sin(Math.min(1, p) * Math.PI)})` } as React.CSSProperties;
};
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });
export const Big: React.FC<{ size?: number; children: React.ReactNode; color?: string }> = ({ size = 110, children, color = C.forest }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1, letterSpacing: -2, textAlign: "center", whiteSpace: "nowrap" }}>{children}</div>
);

/* the 5 branches in mnemonic order */
export type Bk = "V" | "I" | "T" | "C" | "D";
export const BRS: { b: Bk; name: string; short: string; part: 1 | 2 | 3; note: string }[] = [
  { b: "V", name: "Vertebral artery", short: "vertebral", part: 1, note: "up through the neck vertebrae to the brain" },
  { b: "I", name: "Internal thoracic artery", short: "internal thoracic", part: 1, note: "down behind the front of the chest wall" },
  { b: "T", name: "Thyrocervical trunk", short: "thyrocervical trunk", part: 1, note: "short trunk → 3 branches (thyroid, neck, shoulder)" },
  { b: "C", name: "Costocervical trunk", short: "costocervical trunk", part: 2, note: "behind anterior scalene → deep neck + 1st ribs" },
  { b: "D", name: "Dorsal scapular artery", short: "dorsal scapular", part: 3, note: "lateral to the scalene → back of the shoulder blade" },
];

/** letter chip V / I / T / C / D in the branch colour */
export const LChip: React.FC<{ b: Bk; on?: number; size?: number; hot?: boolean }> = ({ b, on = 1, size = 54, hot }) => (
  <div style={{ width: size, height: size, flex: `0 0 ${size}px`, borderRadius: size * 0.3, background: on > 0.5 ? BCOL[b] : "rgba(31,42,20,0.08)", border: `4px solid ${on > 0.5 ? C.forest : "rgba(31,42,20,0.25)"}`, color: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.62, transform: `scale(${hot ? 1.14 : 1})`, boxShadow: hot ? `0 0 0 6px ${C.banana}` : "none", opacity: 0.45 + 0.55 * on }}>
    {b}
  </div>
);

/** Plate in a fixed box; view = [centre x, centre y, visible width] as fractions of the image; labels in image fractions */
type PL = { x: number; y: number; text: string; t: number; hot?: boolean; ox: number; oy: number };
export const PlateBox: React.FC<{ src: string; aspect: number; x: number; y: number; w: number; h: number; a: number; b: number; from: [number, number, number]; to: [number, number, number]; labels?: PL[]; credit?: string; still?: boolean }> = ({ src, aspect, x, y, w, h, a, b, from, to, labels = [], credit = "Gray's Anatomy, 1918 · public domain", still }) => {
  const t = useT();
  if (!still && (t < a - 0.3 || t > b + 0.5)) return null;
  const k = still ? 0 : ramp(t, a, b);
  const cx = from[0] + (to[0] - from[0]) * k, cy = from[1] + (to[1] - from[1]) * k, zw = from[2] + (to[2] - from[2]) * k;
  const iw = w / zw, ih = iw / aspect;
  const L = w / 2 - cx * iw, T = h / 2 - cy * ih;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden", borderRadius: 40, background: C.paper, boxShadow: `0 0 0 5px ${C.line}, 0 20px 44px rgba(31,42,20,0.18)` }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: L, top: T, width: iw, height: ih }} />
      {labels.map((l, j) => {
        const p = still ? 1 : ramp(t, l.t - 0.1, l.t + 0.25);
        if (p <= 0) return null;
        const px = L + l.x * iw, py = T + l.y * ih;
        return (
          <div key={j} style={{ position: "absolute", left: px, top: py, width: 0, height: 0, opacity: p }}>
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
              <line x1={0} y1={0} x2={l.ox * p} y2={l.oy * p} stroke={C.paper} strokeWidth={10} strokeLinecap="round" />
              <line x1={0} y1={0} x2={l.ox * p} y2={l.oy * p} stroke={C.forest} strokeWidth={5} strokeLinecap="round" />
              <circle cx={0} cy={0} r={11} fill={l.hot ? C.red : C.banana} stroke={C.forest} strokeWidth={4} />
            </svg>
            <div style={{ position: "absolute", left: l.ox, top: l.oy, transform: `translate(${l.ox < 0 ? "-100%" : "0"}, -50%) scale(${0.85 + 0.15 * p})`, transformOrigin: l.ox < 0 ? "100% 50%" : "0% 50%", background: l.hot ? C.banana : C.forest, color: l.hot ? C.forest : C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 34, padding: "5px 16px 9px", borderRadius: 14, whiteSpace: "nowrap", boxShadow: "0 5px 0 rgba(31,42,20,0.18)" }}>{l.text}</div>
          </div>
        );
      })}
      {credit && <div style={{ position: "absolute", right: 16, bottom: 12, fontFamily: FONT, fontWeight: 700, fontSize: 19, color: C.forest, opacity: 0.6, background: "rgba(247,246,236,0.88)", padding: "2px 10px", borderRadius: 8 }}>{credit}</div>}
    </div>
  );
};

/* 1. Hook: Gray's 1918 Fig. 513 visible from frame 0 + challenge */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={3.15} push={0.02}>
      <div style={center(4, pop(t, -0.4, 0.25))}>
        <Big size={128}>NAME ALL 5</Big>
      </div>
      <div style={center(134, pop(t, -0.3, 0.25))}>
        <Big size={64} color={C.red}>SUBCLAVIAN BRANCHES?</Big>
      </div>
      <PlateBox src="plates/sub513.png" aspect={A513} x={30} y={232} w={800} h={640} a={-0.6} b={3.15} from={[0.44, 0.74, 0.66]} to={[0.43, 0.8, 0.5]}
        labels={[
          { x: 0.415, y: 0.877, text: "subclavian artery", t: 1.93, hot: true, ox: 110, oy: -40 },
        ]} />
      <div style={center(892, pop(t, 0.15, 0.25))}>
        <Pill size={34} bg={C.forest}>subclavian artery branches · mnemonic</Pill>
      </div>
      <Stamp t0={0.7} text="5 BRANCHES" size={44} rot={-8} color={C.red} style={{ left: 70, top: 270, whiteSpace: "nowrap" }} />
    </Scene>
  );
};

/* 2. The mnemonic card: VITamin C and D */
export const V2: React.FC = () => {
  const t = useT();
  const L: [Bk, number][] = [["V", 3.5], ["I", 3.62], ["T", 3.74], ["C", 3.99], ["D", 4.4]];
  return (
    <Scene start={3.15} end={4.85} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 820, height: 820, borderRadius: 48, background: C.forest, ...pop(t, 3.17, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 50, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 8, color: C.banana }}>THE MNEMONIC</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 150, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 6, ...pop(t, 3.4, 0.25) }}>
          {["V", "I", "T"].map((c, i) => (
            <span key={c} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 150, lineHeight: 1, color: C.forest, background: BCOL[c], borderRadius: 22, padding: "0 12px 10px", opacity: ramp(t, L[i][1] - 0.05, L[i][1] + 0.1) * 0.75 + 0.25 }}>{c}</span>
          ))}
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 130, color: C.paper }}>amin</span>
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 370, display: "flex", justifyContent: "center", alignItems: "center", gap: 36 }}>
          <div style={pop(t, 3.95, 0.22)}><span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 170, lineHeight: 1, color: C.forest, background: BCOL.C, borderRadius: 26, padding: "0 30px 14px", display: "inline-block" }}>C</span></div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 90, color: C.paper, ...pop(t, 4.25, 0.2) }}>&amp;</div>
          <div style={pop(t, 4.36, 0.22)}><span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 170, lineHeight: 1, color: C.forest, background: BCOL.D, borderRadius: 26, padding: "0 30px 14px", display: "inline-block" }}>D</span></div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 640, display: "flex", justifyContent: "center", gap: 14 }}>
          {L.map(([b, s]) => <div key={b} style={pop(t, s, 0.2)}><LChip b={b} size={78} /></div>)}
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 745, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.banana, opacity: ramp(t, 4.45, 4.65) }}>5 letters = 5 branches</div>
      </div>
    </Scene>
  );
};

/* 3. Our diagram: each branch lights up as it's named */
const NT: Record<Bk, number> = { V: 4.94, I: 5.55, T: 6.56, C: 7.9, D: 9.31 };
export const LBL: Record<Bk, { to: [number, number]; side: "l" | "r"; text: string }> = {
  V: { to: [660, 150], side: "l", text: "vertebral" },
  I: { to: [600, 890], side: "l", text: "internal thoracic" },
  T: { to: [500, 360], side: "l", text: "thyrocervical trunk" },
  C: { to: [440, 240], side: "l", text: "costocervical trunk" },
  D: { to: [72, 480], side: "r", text: "dorsal scapular" },
};
const DIA = { x: -40, y: 30, w: 860 };
const dx = (x: number) => DIA.x + (x * DIA.w) / 860;
const dy = (y: number) => DIA.y + (y * DIA.w) / 860;

const BranchLabels: React.FC<{ t: number; X0: number; Y0: number; s: number; cur: Bk | null; vis: (b: Bk) => number }> = ({ t, X0, Y0, s, cur, vis }) => (
  <>
    {(["V", "I", "T", "C", "D"] as Bk[]).map((b) => {
      const p = vis(b);
      if (p <= 0) return null;
      const L = LBL[b];
      const a = ANCHOR[b];
      const x0 = X0 + a[0] * s, y0 = Y0 + a[1] * s;
      const x1 = X0 + L.to[0] * s, y1 = Y0 + L.to[1] * s;
      const hot = cur === b;
      return (
        <React.Fragment key={b}>
          <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: p }}>
            <line x1={x0} y1={y0} x2={x0 + (x1 - x0) * p} y2={y0 + (y1 - y0) * p} stroke={C.paper} strokeWidth={10} strokeLinecap="round" />
            <line x1={x0} y1={y0} x2={x0 + (x1 - x0) * p} y2={y0 + (y1 - y0) * p} stroke={C.forest} strokeWidth={5} strokeLinecap="round" />
            <circle cx={x0} cy={y0} r={10} fill={BCOL[b]} stroke={C.forest} strokeWidth={4} />
          </svg>
          <div style={{ position: "absolute", left: x1, top: y1, transform: `translate(${L.side === "l" ? "-100%" : "0"}, -50%) scale(${(0.85 + 0.15 * p) * (hot ? 1.06 : 1)})`, transformOrigin: L.side === "l" ? "100% 50%" : "0 50%", opacity: p }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: hot ? C.banana : C.forest, color: hot ? C.forest : C.paper, borderRadius: 16, padding: "6px 16px 9px 8px", fontFamily: FONT, fontWeight: 800, fontSize: 32, whiteSpace: "nowrap", boxShadow: "0 5px 0 rgba(31,42,20,0.18)" }}>
              <LChip b={b} size={42} />
              {L.text}
            </div>
          </div>
        </React.Fragment>
      );
    })}
  </>
);

export const V3: React.FC = () => {
  const t = useT();
  let cur: Bk | null = null;
  (["V", "I", "T", "C", "D"] as Bk[]).forEach((b) => {
    if (t >= NT[b] - 0.05) cur = b;
  });
  const lit: Partial<Record<Part, number>> = { ...NT };
  return (
    <Scene start={4.85} end={10.35} push={0.004}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 860, height: 940, overflow: "hidden", borderRadius: 40 }}>
        <div style={{ position: "absolute", left: DIA.x, top: DIA.y }}>
          <SubDiagram t={t} w={DIA.w} grow={4.85} ghost={0.25} lit={lit} glow={cur ? [cur as Part] : []} id="v3" />
        </div>
        <BranchLabels t={t} X0={DIA.x} Y0={DIA.y} s={1} cur={cur} vis={(b) => ramp(t, NT[b] - 0.05, NT[b] + 0.25)} />
        {/* 1918 name sticker for T */}
        <div style={{ position: "absolute", left: 24, top: 40, opacity: ramp(t, 6.9, 7.15) * (1 - ramp(t, 9.2, 9.4)), transform: `scale(${0.8 + 0.2 * ramp(t, 6.9, 7.15)})`, transformOrigin: "0 0" }}>
          <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "10px 18px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.forest, lineHeight: 1.2, boxShadow: "0 6px 0 rgba(31,42,20,0.08)" }}>
            <span style={{ color: C.matcha }}>1918 atlas name:</span>
            <br />“thyroid axis”
          </div>
        </div>
        <div style={{ position: "absolute", left: 690, top: dy(40), opacity: ramp(t, 5.2, 5.5) * 0.9, transform: "translate(-50%,-50%)" }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, color: C.forest, background: "rgba(247,246,236,0.9)", borderRadius: 8, padding: "2px 8px", whiteSpace: "nowrap" }}>neck vertebrae</div>
        </div>
      </div>
    </Scene>
  );
};

/* 4. Anterior scalene → parts 1 / 2 / 3 → 3-1-1 */
const PT: { p: 1 | 2 | 3; t: number; badge: [number, number]; n: number; bs: Bk[] }[] = [
  { p: 1, t: 12.3, badge: [40, 90], n: 3, bs: ["V", "I", "T"] },
  { p: 2, t: 13.6, badge: [0, 100], n: 1, bs: ["C"] },
  { p: 3, t: 14.72, badge: [-10, 90], n: 1, bs: ["D"] },
];
export const V4: React.FC = () => {
  const t = useT();
  const all: Partial<Record<Part, number>> = { V: 10.35, I: 10.35, T: 10.35, C: 10.35, D: 10.35, AS: 10.5, P1: 12.3, P2: 13.6, P3: 14.72 };
  const k = ramp(t, 10.4, 15.8);
  const s = 1.04 + 0.06 * k;
  const X0 = -18 - 30 * k, Y0 = -60 - 40 * k;
  const pa = (p: number) => {
    const a = ANCHOR[`P${p}`];
    return [X0 + a[0] * s, Y0 + a[1] * s];
  };
  let cp = 0;
  PT.forEach((q) => { if (t >= q.t - 0.05) cp = q.p; });
  return (
    <Scene start={10.35} end={15.95} push={0.004}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 860, height: 940, overflow: "hidden", borderRadius: 40 }}>
        <div style={{ position: "absolute", left: X0, top: Y0 }}>
          <SubDiagram t={t} w={860 * s} ghost={1} lit={all} glow={cp === 0 ? ["AS"] : []} parts={1} id="v4" />
        </div>
        {PT.map((q) => {
          const [x, y] = pa(q.p);
          const shown = ramp(t, q.t - 0.05, q.t + 0.25);
          if (shown <= 0) return null;
          return (
            <div key={q.p} style={{ position: "absolute", left: x + q.badge[0] - 46, top: y + q.badge[1] - 46, opacity: shown, transform: `scale(${(0.6 + 0.4 * shown) * (cp === q.p ? 1.12 : 1)})` }}>
              <div style={{ width: 92, height: 92, borderRadius: 46, background: PCOL[q.p], border: `5px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 54, color: C.forest }}>{q.p}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 24, display: "flex", justifyContent: "center", ...pop(t, 10.55, 0.25) }}>
        <Pill size={36} bg={C.banana} color={C.forest}>anterior scalene splits it</Pill>
      </div>
      {/* 3-1-1 row */}
      <div style={{ position: "absolute", left: 0, width: 860, top: 812, display: "flex", justifyContent: "center", gap: 14 }}>
        {PT.map((q) => (
          <div key={q.p} style={{ ...pop(t, q.t, 0.22), display: "flex", alignItems: "center", gap: 8, background: PCOL[q.p], border: `4px solid ${C.forest}`, borderRadius: 20, padding: "8px 14px 10px" }}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.forest, whiteSpace: "nowrap" }}>part {q.p}:</div>
            {q.bs.map((b) => <LChip key={b} b={b} size={46} />)}
          </div>
        ))}
      </div>
      <Stamp t0={15.3} text="3 · 1 · 1" size={52} rot={-7} color={C.red} style={{ left: 560, top: 120, whiteSpace: "nowrap" }} />
    </Scene>
  );
};

/* 5. Quick test */
export const V5: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[19.72, 3], [20.36, 2], [21.0, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => {
    if (t >= s - 0.05 && t < 21.55) { n = v; n0 = s; }
  });
  const opts = ["internal thoracic", "vertebral", "dorsal scapular"];
  return (
    <Scene start={15.95} end={21.55}>
      <div style={{ position: "absolute", left: 20, top: 55, width: 820, height: 830, borderRadius: 48, background: C.forest, ...pop(t, 16.0, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 56, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 130, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 58, lineHeight: 1.12, color: C.paper, ...pop(t, 16.85) }}>
          Which branch climbs through your <span style={{ color: C.banana }}>NECK VERTEBRAE</span> to the brain?
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 400, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          {opts.map((o, i) => (
            <div key={o} style={{ ...pop(t, 17.9 + i * 0.18), display: "flex", alignItems: "center", gap: 18, width: 600 }}>
              <div style={{ width: 62, height: 62, flex: "0 0 62px", borderRadius: 18, background: C.banana, color: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, border: `4px solid ${C.paper}` }}>{"ABC"[i]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.paper, whiteSpace: "nowrap" }}>{o}</div>
            </div>
          ))}
        </div>
        {n !== null && (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 630, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 170, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 6. Answer on Gray's plate: vertebral artery up through the transverse foramina */
export const V6: React.FC = () => {
  const t = useT();
  return (
    <Scene start={21.55} end={23.0} push={0.01}>
      <div style={{ position: "absolute", left: 0, width: 860, top: 0, display: "flex", justifyContent: "center", ...pop(t, 21.6, 0.25) }}>
        <Pill size={42} bg={C.matcha}>B ✓ vertebral artery</Pill>
      </div>
      <PlateBox src="plates/sub513.png" aspect={A513} x={30} y={100} w={800} h={820} a={21.55} b={23.0} from={[0.45, 0.6, 0.86]} to={[0.44, 0.6, 0.78]}
        labels={[
          { x: 0.42, y: 0.62, text: "vertebral artery", t: 21.78, hot: true, ox: 40, oy: 90 },
          { x: 0.41, y: 0.876, text: "subclavian", t: 21.65, ox: 40, oy: -70 },
          { x: 0.405, y: 0.443, text: "transverse foramina", t: 22.2, ox: 30, oy: -60 },
        ]} />
    </Scene>
  );
};

/* 7. Save + cheat sheet */
export const V7: React.FC = () => {
  const t = useT();
  const b = ramp(t, 23.05, 23.4);
  return (
    <Scene start={23.0} end={25.3}>
      <div style={{ position: "absolute", left: 40, top: 0, ...pop(t, 23.05) }}>
        <svg width={110} height={140} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 170, top: 6, ...pop(t, 23.1) }}>
        <Big size={100}>SAVE THIS</Big>
      </div>
      <div style={{ position: "absolute", left: 172, top: 112, ...pop(t, 23.35) }}>
        <Big size={40} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ position: "absolute", left: 40, top: 215, display: "flex", flexDirection: "column", gap: 20 }}>
        {BRS.map((r, i) => (
          <div key={r.b} style={{ display: "flex", alignItems: "center", gap: 16, ...pop(t, 23.5 + i * 0.09, 0.22), transformOrigin: "0 50%" }}>
            <div style={{ width: 62, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.forest, background: PCOL[r.part], border: `3px solid ${C.forest}`, borderRadius: 12, textAlign: "center", padding: "2px 0 4px" }}>P{r.part}</div>
            <LChip b={r.b} size={78} />
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest, whiteSpace: "nowrap", lineHeight: 1.05 }}>{r.name}</div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, color: C.matcha, lineHeight: 1.15, whiteSpace: "nowrap" }}>{r.note}</div>
            </div>
          </div>
        ))}
      </div>
    </Scene>
  );
};

/* 8. End card (≤ 1.5 s) */
export const V8: React.FC = () => {
  const t = useT();
  return (
    <Scene start={25.3} end={26.6}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, 25.32, 0.3) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.banana, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 25.45, 25.7) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 25.3) * 5))})`, opacity: ramp(t, 25.35, 25.55) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
