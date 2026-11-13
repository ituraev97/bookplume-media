import React from "react";
import { C, FONT, Pill, Scene, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, pop } from "./Scenes67";
import { PlateBox74 } from "./Scenes74";
import { HANCH_B, HANCH_F, HB, HCOL, HCUE, HNAME, HORDER, Heart } from "./Heart91";

export const A492 = 1638 / 1329;
export const P492 = "plates/heart492.png";
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* voice times (words.json) */
const TL = { left: 5.02, around: 5.55, down: 5.99, cx: 6.62, cxAround: 7.63, lad: 8.68, ladDown: 9.63, right: 10.56, edge: 10.82, back: 11.13, rm: 11.9, usually: 13.61, pda: 14.16, pdaBack: 15.38 };
export const TB: Record<HB, number> = { LCA: 6.5, CX: 6.62, LAD: 8.68, RCA: 10.56, RM: 11.9, PDA: 14.16 };

export const HChip: React.FC<{ b: HB; size?: number; on?: number; hot?: boolean; q?: boolean; wide?: boolean }> = ({ b, size = 64, on = 1, hot, q, wide }) => {
  const label = q ? "?" : b === "CX" ? "Cx" : b === "LAD" ? "LAD" : b === "RM" ? "RM" : b === "PDA" ? "PDA" : b;
  return (
    <div style={{ height: size, minWidth: size, padding: wide ? `0 ${size * 0.3}px` : 0, flex: "0 0 auto", borderRadius: size * 0.28, background: on > 0.5 ? HCOL[b] : "rgba(31,42,20,0.08)", border: `4px solid ${on > 0.5 ? C.forest : "rgba(31,42,20,0.25)"}`, color: on > 0.5 ? (b === "LAD" || b === "PDA" ? C.paper : C.forest) : "rgba(31,42,20,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * (label.length > 2 ? 0.4 : 0.52), transform: `scale(${hot ? 1.14 : 1})`, boxShadow: hot ? `0 0 0 6px ${C.banana}` : "none", lineHeight: 1, boxSizing: "border-box" }}>
      {label}
    </div>
  );
};

/* 4 branch chips: L(Cx, LAD) | R(RM, PDA) */
const Strip: React.FC<{ t: number; top?: number }> = ({ t, top = 12 }) => {
  let cur: HB | null = null;
  HORDER.forEach((b) => { if (t >= TB[b] - 0.05) cur = b; });
  const grp = (side: string, bs: HB[], col: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.card, border: `3px solid ${C.line}`, borderRadius: 24, padding: "8px 14px" }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 24, color: col, letterSpacing: 2 }}>{side}</div>
      {bs.map((b) => {
        const p = ramp(t, TB[b] - 0.05, TB[b] + 0.15);
        return <div key={b} style={{ transform: `scale(${1 + 0.22 * p * (1 - ramp(t, TB[b] + 0.15, TB[b] + 0.45))})` }}><HChip b={b} size={66} on={p} hot={cur === b} /></div>;
      })}
    </div>
  );
  return (
    <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", gap: 18 }}>
      {grp("LEFT", ["CX", "LAD"], C.red)}
      {grp("RIGHT", ["RM", "PDA"], C.matcha)}
    </div>
  );
};

type Kf = [number, number, number, number];
const cam = (t: number, ks: Kf[]) => {
  if (t <= ks[0][0]) return ks[0];
  for (let i = 0; i < ks.length - 1; i++) {
    const a = ks[i], b = ks[i + 1];
    if (t <= b[0]) {
      const k = ramp(t, a[0], b[0]);
      const e = k * k * (3 - 2 * k);
      return [t, a[1] + (b[1] - a[1]) * e, a[2] + (b[2] - a[2]) * e, a[3] + (b[3] - a[3]) * e] as Kf;
    }
  }
  return ks[ks.length - 1];
};
const Stage: React.FC<{ t: number; k: Kf; id: string; h?: number; top?: number; children?: (P: (m: [number, number]) => [number, number]) => React.ReactNode } & Omit<React.ComponentProps<typeof Heart>, "t" | "w" | "id">> = ({ t, k, id, children, h = 780, top = 120, ...rest }) => {
  const [, s, cx, cy] = k;
  const X0 = 430 - cx * s, Y0 = h / 2 - cy * s;
  const P = (m: [number, number]) => [X0 + m[0] * s, top + Y0 + m[1] * s] as [number, number];
  return (
    <>
      <div style={{ position: "absolute", left: 0, top, width: 860, height: h, overflow: "hidden", borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}` }}>
        <div style={{ position: "absolute", left: X0, top: Y0 }}>
          <Heart t={t} w={1000 * s} id={id} {...rest} />
        </div>
      </div>
      {children && children(P)}
    </>
  );
};
const Call: React.FC<{ t: number; t0: number; a: [number, number]; to: [number, number]; text: React.ReactNode; bg?: string; fg?: string; size?: number; t1?: number }> = ({ t, t0, a, to, text, bg = C.forest, fg = C.paper, size = 36, t1 }) => {
  const p = ramp(t, t0, t0 + 0.25) * (t1 ? 1 - ramp(t, t1, t1 + 0.15) : 1);
  if (p <= 0) return null;
  const [ax, ay] = a, [tx, ty] = to;
  return (
    <>
      <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: p }}>
        <line x1={ax} y1={ay} x2={ax + (tx - ax) * p} y2={ay + (ty - ay) * p} stroke={C.paper} strokeWidth={11} strokeLinecap="round" />
        <line x1={ax} y1={ay} x2={ax + (tx - ax) * p} y2={ay + (ty - ay) * p} stroke={C.forest} strokeWidth={5} strokeLinecap="round" />
        <circle cx={ax} cy={ay} r={12} fill={C.banana} stroke={C.forest} strokeWidth={4} />
      </svg>
      <div style={{ position: "absolute", left: tx, top: ty, transform: `translate(-50%, -50%) scale(${0.8 + 0.2 * p})`, opacity: p }}>
        <Pill size={size} bg={bg} color={fg} style={{ whiteSpace: "pre", lineHeight: 1.1, textAlign: "center" }}>{text}</Pill>
      </div>
    </>
  );
};
const Cue: React.FC<{ w: string; p: number }> = ({ w, p }) => (
  <span style={{ display: "inline-block", opacity: 0.25 + 0.75 * p, transform: `scale(${0.9 + 0.1 * p})` }}>
    <span style={{ background: p > 0.5 ? C.banana : "rgba(247,246,236,0.14)", color: C.forest, borderRadius: 14, padding: "0 10px 4px" }}>{w[0]}</span>
    {w.slice(1)}
  </span>
);

/* 1. Hook: Gray's 1918 Fig. 492 visible from frame 0 + challenge */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={4.6} push={0.02}>
      <div style={center(4, pop(t, -0.4, 0.25))}>
        <Big size={108}>YOUR HEART</Big>
      </div>
      <div style={center(122, pop(t, -0.3, 0.25))}>
        <Big size={90} color={C.red}>FEEDS ITSELF FIRST</Big>
      </div>
      <PlateBox74 src={P492} aspect={A492} x={30} y={250} w={800} h={610} a={-0.6} b={4.6} from={[0.48, 0.5, 1.0]} to={[0.47, 0.42, 0.8]}
        labels={[
          { x: 0.38, y: 0.12, text: "aorta", t: 0.9, hot: false, ox: -120, oy: 40 },
          { x: 0.225, y: 0.56, text: "right coronary", t: 2.6, hot: true, ox: 40, oy: -150 },
          { x: 0.69, y: 0.5, text: "left coronary\nbranch", t: 2.95, hot: true, ox: -60, oy: 120 },
        ]} />
      <div style={center(880, pop(t, 0.05, 0.25))}>
        {t < 3.6 ? <Pill size={34} bg={C.forest}>coronary arteries · mnemonic</Pill> : (
          <div style={{ ...pop(t, 3.62, 0.25) }}><Pill size={40} bg={C.banana} color={C.forest}>2 arteries → 4 main branches</Pill></div>
        )}
      </div>
    </Scene>
  );
};

/* 2. The trick card: LEFT = Around + Down, RIGHT = Edge + Back */
export const V2: React.FC = () => {
  const t = useT();
  const pa = ramp(t, TL.around - 0.08, TL.around + 0.15), pd = ramp(t, TL.down - 0.08, TL.down + 0.15);
  return (
    <Scene start={4.6} end={6.45} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, ...pop(t, 4.62, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 8, color: C.banana }}>CORONARY ARTERIES TRICK</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 100, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 42, color: "#B9D27A", ...pop(t, 4.8, 0.3) }}>2 arteries · 2 main branches each</div>
        <div style={{ position: "absolute", left: 50, width: 720, top: 200, borderRadius: 34, border: `4px solid ${C.redLight}`, padding: "26px 30px", ...pop(t, TL.left - 0.05, 0.3) }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.redLight, letterSpacing: 4 }}>LEFT GOES</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 84, color: C.paper, lineHeight: 1.1, marginTop: 6, whiteSpace: "nowrap" }}>
            <Cue w="Around" p={pa} /> <span style={{ opacity: 0.25 + 0.75 * pd }}>+</span> <Cue w="Down" p={pd} />
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 32, color: "#B9D27A", marginTop: 8, opacity: ramp(t, TL.down, TL.down + 0.2) }}>circumflex · LAD</div>
        </div>
        <div style={{ position: "absolute", left: 50, width: 720, top: 540, borderRadius: 34, border: `4px dashed rgba(143,168,106,0.6)`, padding: "26px 30px", opacity: 0.55 * ramp(t, 5.2, 5.5) }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: "#8FA86A", letterSpacing: 4 }}>RIGHT GOES</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 96, color: C.paper, lineHeight: 1.1, marginTop: 6 }}>? + ?</div>
        </div>
      </div>
    </Scene>
  );
};

/* 3. Left coronary on our own diagram: circumflex goes AROUND, LAD runs DOWN the front */
export const V3: React.FC = () => {
  const t = useT();
  const k = cam(t, [[6.45, 0.78, 540, 520], [6.9, 0.95, 600, 500], [8.2, 0.95, 610, 510], [8.75, 0.82, 565, 600], [10.4, 0.8, 565, 610]]);
  return (
    <Scene start={6.45} end={10.4} push={0.004}>
      <Stage t={t} k={k} id="v3" lit={{ LCA: TB.LCA, CX: TB.CX, LAD: TB.LAD }} hot={t < TB.LAD - 0.05 ? ["CX"] : ["LAD"]}>
        {(P) => (
          <>
            <Call t={t} t0={TB.CX} t1={TB.LAD - 0.1} a={P(HANCH_F.CX!)} to={[560, 830]} text={"circumflex\n→ goes AROUND"} bg={HCOL.CX} fg={C.forest} size={38} />
            <Call t={t} t0={7.7} t1={TB.LAD - 0.1} a={P([856, 472])} to={[700, 700]} text={"to the back ↻"} size={30} />
            <Call t={t} t0={TB.LAD} a={P(HANCH_F.LAD!)} to={[300, 820]} text={"LAD\n↓ runs DOWN the front"} bg={HCOL.LAD} size={38} />
            <Call t={t} t0={6.6} t1={TB.LAD - 0.1} a={P([540, 400])} to={[230, 300]} text={"left coronary"} size={30} />
          </>
        )}
      </Stage>
      <Strip t={t} />
    </Scene>
  );
};

/* 4. Right coronary: Edge (right marginal) + Back (posterior descending, usually) */
export const V4: React.FC = () => {
  const t = useT();
  const flip = ramp(t, 13.3, 13.85);
  const k = cam(t, [[10.4, 0.82, 420, 560], [11.7, 0.86, 420, 640], [13.2, 0.86, 450, 640], [13.9, 0.8, 520, 600], [15.9, 0.84, 500, 620]]);
  const pe = ramp(t, TL.edge - 0.08, TL.edge + 0.15), pb = ramp(t, TL.back - 0.08, TL.back + 0.15);
  return (
    <Scene start={10.4} end={15.9} push={0.004}>
      <Stage t={t} k={k} id="v4" top={200} h={700} back={flip} lit={{ LCA: 0, CX: 0, LAD: 0, RCA: TB.RCA, RM: TB.RM, PDA: TB.PDA }} hot={t < 13.4 ? ["RCA", "RM"] : ["PDA"]}>
        {(P) => (
          <>
            {flip < 0.5 && <Call t={t} t0={10.7} t1={13.2} a={P(HANCH_F.RCA!)} to={[150, 300]} text={"right coronary"} bg={HCOL.RCA} size={32} />}
            {flip < 0.5 && <Call t={t} t0={TB.RM} t1={13.2} a={P(HANCH_F.RM!)} to={[560, 840]} text={"right marginal\n= the EDGE"} bg={HCOL.RM} fg={C.forest} size={36} />}
            {flip >= 0.5 && <Call t={t} t0={TB.PDA} a={P(HANCH_B.PDA!)} to={[620, 790]} text={"posterior descending\n= the BACK"} bg={HCOL.PDA} size={34} />}
          </>
        )}
      </Stage>
      <div style={{ position: "absolute", left: 30, top: 0, width: 800, height: 170, borderRadius: 34, background: C.forest, display: "flex", alignItems: "center", gap: 24, padding: "0 32px", boxSizing: "border-box", ...pop(t, 10.45, 0.25) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#8FA86A", letterSpacing: 3, lineHeight: 1 }}>RIGHT<br />GOES</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 84, color: C.paper, lineHeight: 1, whiteSpace: "nowrap" }}>
          <Cue w="Edge" p={pe} /> <span style={{ opacity: 0.25 + 0.75 * pb }}>+</span> <Cue w="Back" p={pb} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 40, top: 222, opacity: ramp(t, 13.4, 13.6) }}>
        <Pill size={28} bg={C.card} color={C.forest} style={{ border: `3px solid ${C.line}`, boxShadow: "none" }}>⟲ back view</Pill>
      </div>
      <div style={{ position: "absolute", right: 40, top: 220, ...pop(t, TL.usually - 0.05, 0.25) }}>
        <Pill size={28} bg={C.banana} color={C.forest}>usually · ~80–85% of people</Pill>
      </div>
    </Scene>
  );
};

/* 5. Quick test with 3-2-1 */
export const V5: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[18.41, 3], [19.05, 2], [19.69, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < 20.3) { n = v; n0 = s; } });
  const opts: HB[] = ["RM", "LAD", "PDA", "CX"];
  return (
    <Scene start={15.9} end={20.3}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 15.95, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 42, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 30, width: 760, top: 104, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 62, lineHeight: 1.1, color: C.paper, ...pop(t, 16.2) }}>
          Which one runs <span style={{ color: C.banana }}>DOWN THE FRONT?</span>
        </div>
        <div style={{ position: "absolute", left: 40, top: 300, width: 400, height: 400, opacity: ramp(t, 16.5, 16.8) }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 400, height: 400, borderRadius: 30, background: "rgba(247,246,236,0.07)" }} />
          <div style={{ position: "absolute", left: 0, top: 0 }}><Heart t={t} w={400} id="q5" ghost labels={false} /></div>
          <div style={{ position: "absolute", left: 262 - 34, top: 260 - 40, width: 68, height: 68, borderRadius: 34, background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 52, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.12 * Math.sin(t * 7)})`, border: `4px solid ${C.forest}` }}>?</div>
        </div>
        <div style={{ position: "absolute", left: 470, top: 310, width: 320, display: "flex", flexDirection: "column", gap: 20 }}>
          {opts.map((b, i) => (
            <div key={b} style={{ display: "flex", alignItems: "center", gap: 14, ...pop(t, 16.8 + i * 0.12, 0.25), transformOrigin: "0 50%" }}>
              <div style={{ width: 54, height: 54, borderRadius: 16, background: C.paper, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>{"ABCD"[i]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.paper, lineHeight: 1.05, whiteSpace: "pre" }}>{b === "PDA" ? "Posterior\ndescending" : b === "RM" ? "Right\nmarginal" : HNAME[b]}</div>
            </div>
          ))}
        </div>
        {n !== null ? (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 700, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 150, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        ) : (
          <div style={{ position: "absolute", left: 0, width: 820, top: 750, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#B9D27A", opacity: ramp(t, 17.6, 17.8) }}>pause · say it out loud</div>
        )}
      </div>
    </Scene>
  );
};

/* 6. Answer on the real thing: Gray's 1918 Fig. 492 */
export const V6: React.FC = () => {
  const t = useT();
  const L = (w: string, t0: number) => {
    const p = ramp(t, t0 - 0.05, t0 + 0.15);
    return <Cue w={w} p={p} />;
  };
  return (
    <Scene start={20.3} end={22.45} push={0.006}>
      <div style={center(0, pop(t, 20.35, 0.25))}>
        <Pill size={46} bg={C.banana} color={C.forest}>✓ B · the LAD</Pill>
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 96, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.forest, whiteSpace: "nowrap", opacity: ramp(t, 20.9, 21.05) }}>
        {L("Left", 20.96)} {L("Anterior", 21.2)} {L("Descending", 21.73)}
      </div>
      <PlateBox74 src={P492} aspect={A492} x={30} y={190} w={800} h={660} a={20.3} b={22.45} from={[0.62, 0.55, 0.78]} to={[0.66, 0.58, 0.62]} ls={34}
        labels={[{ x: 0.7, y: 0.56, text: "LAD", t: 20.45, hot: true, ox: -170, oy: 60 }]} />
      <div style={{ position: "absolute", left: 6, top: 868, opacity: ramp(t, 21.0, 21.25) }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 16px 10px", fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.forest, whiteSpace: "nowrap" }}>
          <span style={{ color: C.matcha }}>1918 atlas name:</span> “Ant. desc. branch of left coronary artery”
        </div>
      </div>
    </Scene>
  );
};

/* 7. Save + cheat sheet */
export const V7: React.FC = () => {
  const t = useT();
  const s0 = 22.45;
  const b = ramp(t, s0 + 0.05, s0 + 0.4);
  const rows: [HB, string, string][] = [
    ["CX", "Circumflex", "AROUND the left groove"],
    ["LAD", "LAD (ant. interventricular)", "DOWN the front"],
    ["RM", "Right marginal", "the EDGE"],
    ["PDA", "Posterior descending", "the BACK (usually)"],
  ];
  return (
    <Scene start={s0} end={24.6}>
      <div style={{ position: "absolute", left: 40, top: 0, ...pop(t, s0 + 0.05) }}>
        <svg width={110} height={140} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 170, top: 6, ...pop(t, s0 + 0.1) }}>
        <Big size={100}>SAVE THIS</Big>
      </div>
      <div style={{ position: "absolute", left: 172, top: 112, ...pop(t, s0 + 0.3) }}>
        <Big size={40} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ position: "absolute", left: 30, top: 190, width: 800, height: 720, borderRadius: 40, background: C.card, border: `3px solid ${C.line}`, boxShadow: "0 18px 40px rgba(31,42,20,0.12)", ...pop(t, s0 + 0.15, 0.3) }}>
        <div style={{ position: "absolute", left: 36, top: 26, fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.matcha, letterSpacing: 2, whiteSpace: "nowrap" }}>CORONARY ARTERIES · 2 → 4</div>
        {rows.map(([k, nm, cue], i) => (
          <React.Fragment key={k}>
            {i % 2 === 0 && (
              <div style={{ position: "absolute", left: 36, top: 84 + i * 150 + (i ? 20 : 0), fontFamily: FONT, fontWeight: 800, fontSize: 30, color: i ? C.matcha : C.red, letterSpacing: 2, opacity: ramp(t, s0 + 0.2 + i * 0.08, s0 + 0.4 + i * 0.08) }}>
                {i ? "RIGHT CORONARY → EDGE + BACK" : "LEFT CORONARY → AROUND + DOWN"}
              </div>
            )}
            <div style={{ position: "absolute", left: 36, top: 136 + i * 140 + (i >= 2 ? 50 : 0), display: "flex", alignItems: "center", gap: 18, opacity: ramp(t, s0 + 0.25 + i * 0.08, s0 + 0.5 + i * 0.08) }}>
              <HChip b={k} size={72} />
              <div>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.forest, whiteSpace: "nowrap", lineHeight: 1.05 }}>{nm}</div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 28, color: C.matcha, whiteSpace: "nowrap", marginTop: 4 }}>{cue}</div>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </Scene>
  );
};

/* 8. End card (≤ 1.5 s) */
export const V8: React.FC = () => {
  const t = useT();
  const s0 = 24.6;
  return (
    <Scene start={s0} end={26.0}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, s0 + 0.02, 0.3) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.banana, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, s0 + 0.15, s0 + 0.4) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - s0) * 5))})`, opacity: ramp(t, s0 + 0.05, s0 + 0.25) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};

export { HCUE };
