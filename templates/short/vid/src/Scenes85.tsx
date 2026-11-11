import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, pop } from "./Scenes67";
import { PlateBox74 } from "./Scenes74";
import { ANCHOR, B, BCOL, BLET, BNUM, BORDER, Medial } from "./Medial85";

export const A809 = 1905 / 1662;
export const PLATE = "plates/fig809_axilla.png";
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* voice times (words.json) */
export const NT: Record<B, number> = { MP: 5.98, MA: 8.33, MF: 10.4, MR: 12.63, UL: 14.23 };
export const NAME: Record<B, string> = {
  MP: "Medial pectoral",
  MA: "Medial cutaneous n. of ARM",
  MF: "Medial cutaneous n. of FOREARM",
  MR: "Median (medial root)",
  UL: "Ulnar",
};
export const TO: Record<B, string> = {
  MP: "pectoralis minor + major",
  MA: "skin of the medial arm",
  MF: "skin of the medial forearm",
  MR: "+ lateral root = median nerve",
  UL: "“funny bone” nerve at the elbow",
};

export const Chip: React.FC<{ b: B; size?: number; on?: number; hot?: boolean }> = ({ b, size = 64, on = 1, hot }) => (
  <div style={{ position: "relative", width: size, height: size, flex: `0 0 ${size}px`, borderRadius: size * 0.28, background: on > 0.5 ? BCOL[b] : "rgba(31,42,20,0.08)", border: `4px solid ${on > 0.5 ? C.forest : "rgba(31,42,20,0.25)"}`, color: on > 0.5 ? C.forest : "rgba(31,42,20,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.62, transform: `scale(${hot ? 1.16 : 1})`, boxShadow: hot ? `0 0 0 6px ${C.banana}` : "none" }}>
    {BLET[b]}
    {BNUM[b] && <span style={{ position: "absolute", right: size * 0.07, bottom: size * 0.02, fontSize: size * 0.24, opacity: 0.8 }}>{BNUM[b]}</span>}
  </div>
);

const Counter: React.FC<{ t: number; top?: number }> = ({ t, top = 10 }) => {
  const n = BORDER.filter((k) => t >= NT[k] - 0.05).length;
  return (
    <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", alignItems: "center", gap: 12 }}>
      {BORDER.map((b) => {
        const p = ramp(t, NT[b] - 0.05, NT[b] + 0.15);
        const hot = t >= NT[b] - 0.05 && t < NT[b] + 1.4;
        return <div key={b} style={{ transform: `scale(${1 + 0.25 * p * (1 - ramp(t, NT[b] + 0.15, NT[b] + 0.45))})` }}><Chip b={b} size={66} on={p} hot={hot} /></div>;
      })}
      <div style={{ marginLeft: 12, background: C.forest, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 36, borderRadius: 20, padding: "4px 18px 8px", whiteSpace: "nowrap" }}>{n}/5 nerves</div>
    </div>
  );
};

/* camera over the diagram: [t, scale, cx, cy] (viewBox units) */
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
const Stage: React.FC<{ t: number; k: Kf; id: string; h?: number; top?: number; children?: (P: (m: [number, number]) => [number, number]) => React.ReactNode } & Omit<React.ComponentProps<typeof Medial>, "t" | "w" | "id">> = ({ t, k, id, children, h = 940, top = 0, ...rest }) => {
  const [, s, cx, cy] = k;
  const u = (860 / 900) * s;
  const X0 = 430 - cx * u, Y0 = h / 2 - cy * u;
  const P = (m: [number, number]) => [X0 + m[0] * u, top + Y0 + m[1] * u] as [number, number];
  return (
    <>
      <div style={{ position: "absolute", left: 0, top, width: 860, height: h, overflow: "hidden", borderRadius: 40, background: C.paper, boxShadow: `0 0 0 5px ${C.line}` }}>
        <div style={{ position: "absolute", left: X0, top: Y0 }}>
          <Medial t={t} w={860 * s} id={id} {...rest} />
        </div>
      </div>
      {children && children(P)}
    </>
  );
};
const Call: React.FC<{ t: number; t0: number; a: [number, number]; to: [number, number]; text: string; bg?: string; fg?: string; size?: number; t1?: number }> = ({ t, t0, a, to, text, bg = C.forest, fg = C.paper, size = 36, t1 }) => {
  const p = ramp(t, t0, t0 + 0.3) * (t1 ? 1 - ramp(t, t1, t1 + 0.2) : 1);
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
        <Pill size={size} bg={bg} color={fg} style={{ whiteSpace: "nowrap" }}>{text}</Pill>
      </div>
    </>
  );
};
const Note1918: React.FC<{ t: number; t0: number; text: React.ReactNode; top?: number; left?: number; prefix?: string; size?: number }> = ({ t, t0, text, top = 856, left = 30, prefix = "1918 atlas name:", size = 25 }) => (
  <div style={{ position: "absolute", left, top, opacity: ramp(t, t0, t0 + 0.25), transform: `scale(${0.8 + 0.2 * ramp(t, t0, t0 + 0.25)})`, transformOrigin: "0 0" }}>
    <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 16px 10px", fontFamily: FONT, fontWeight: 800, fontSize: size, color: C.forest, lineHeight: 1.2, boxShadow: "0 6px 0 rgba(31,42,20,0.08)", whiteSpace: "nowrap" }}>
      <span style={{ color: C.matcha }}>{prefix}</span> {text}
    </div>
  </div>
);
const Tip: React.FC<{ t: number; t0: number; top: number; children: React.ReactNode; bg?: string; fg?: string; size?: number; t1?: number }> = ({ t, t0, top, children, bg = C.banana, fg = C.forest, size = 34, t1 }) =>
  t >= t0 - 0.05 && (!t1 || t < t1 + 0.2) ? (
    <div style={{ ...center(top), ...pop(t, t0, 0.25), opacity: ramp(t, t0, t0 + 0.2) * (t1 ? 1 - ramp(t, t1, t1 + 0.2) : 1) }}>
      <Pill size={size} bg={bg} color={fg} style={{ whiteSpace: "nowrap" }}>{children}</Pill>
    </div>
  ) : null;

const LIT_ALL: Partial<Record<B, number>> = { MP: 0, MA: 0, MF: 0, MR: 0, UL: 0 };

/* 1. Hook: Gray's 1918 Fig. 809 (axilla, nerves in yellow) visible from frame 0 + challenge */
export const V1: React.FC = () => {
  const t = useT();
  const sec = Math.max(0, Math.ceil(10 - Math.max(0, t - 0.6) * 3.2));
  return (
    <Scene start={-0.6} end={3.55} push={0.02}>
      <div style={center(18, pop(t, -0.4, 0.25))}>
        <Big size={104}>MEDIAL CORD</Big>
      </div>
      <div style={center(128, pop(t, -0.3, 0.25))}>
        <Big size={112} color={C.red}>NAME ALL 5?</Big>
      </div>
      <PlateBox74 src={PLATE} aspect={A809} x={30} y={262} w={800} h={600} a={-0.6} b={3.55} from={[0.47, 0.42, 0.96]} to={[0.44, 0.38, 0.66]}
        labels={[{ x: 0.585, y: 0.275, text: "brachial plexus cords", t: 1.6, hot: true, ox: -60, oy: 210 }]} />
      <div style={center(884, pop(t, 0.1, 0.25))}>
        <Pill size={33} bg={C.forest}>brachial plexus · mnemonic</Pill>
      </div>
      <div style={{ position: "absolute", left: 640, top: 284, ...pop(t, 0.5, 0.25) }}>
        <div style={{ width: 170, height: 170, borderRadius: 85, background: C.forest, border: `6px solid ${C.banana}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 24px rgba(31,42,20,0.25)" }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 76, color: C.banana, lineHeight: 1 }}>{sec}</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.paper }}>seconds</div>
        </div>
      </div>
    </Scene>
  );
};

/* 2. Mnemonic card: M4U */
export const V2: React.FC = () => {
  const t = useT();
  return (
    <Scene start={3.55} end={5.35} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 820, height: 840, borderRadius: 48, background: C.forest, ...pop(t, 3.57, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 56, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 8, color: C.banana }}>THE MNEMONIC</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 126, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 140, letterSpacing: -2, color: C.paper, ...pop(t, 4.38, 0.3) }}>
          M<span style={{ color: C.banana }}>4</span>U
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 340, display: "flex", justifyContent: "center", gap: 18 }}>
          {BORDER.map((b, i) => {
            const t0 = b === "UL" ? 4.78 : 3.75 + i * 0.14;
            const p = ramp(t, t0, t0 + 0.2);
            const glow = b === "UL" ? ramp(t, 4.81, 4.95) * (1 - ramp(t, 5.1, 5.3)) : ramp(t, 4.42, 4.55) * (1 - ramp(t, 4.65, 4.8));
            return (
              <div key={b} style={{ transform: `translateY(${(1 - p) * 40}px) scale(${0.7 + 0.3 * p + 0.08 * glow})`, opacity: p }}>
                <Chip b={b} size={128} hot={glow > 0.3} />
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 520, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 60, color: C.paper, opacity: ramp(t, 4.6, 4.8) }}>
          <span style={{ color: C.banana }}>4 M's</span> + a <span style={{ color: "#B9D27A" }}>U</span>
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 640, display: "flex", justifyContent: "center", ...pop(t, 4.9, 0.25) }}>
          <div style={{ background: C.banana, borderRadius: 22, padding: "10px 28px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.forest }}>medial cord = 5 nerves</div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 752, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 30, color: "#B9D27A", opacity: ramp(t, 5.0, 5.2) }}>roots C8–T1 · medial to the axillary artery</div>
      </div>
    </Scene>
  );
};

/* 3. M1: medial pectoral → pectoralis minor + major */
export const V3: React.FC = () => {
  const t = useT();
  const k = cam(t, [[5.35, 0.92, 450, 500], [5.85, 1.12, 590, 420], [8.25, 1.16, 600, 430]]);
  return (
    <Scene start={5.35} end={8.25} push={0.004}>
      <Stage t={t} k={k} id="v3" build={5.3} lit={{ MP: NT.MP }} hot={t < 7.35 ? ["MP"] : []} pec={ramp(t, 7.35, 7.7)} dimRest={ramp(t, 5.9, 6.3)}>
        {(P) => (
          <>
            <Call t={t} t0={6.0} a={P(ANCHOR.MP)} to={[240, 700]} text="medial pectoral" bg={BCOL.MP} fg={C.forest} size={42} />
            <Call t={t} t0={7.42} a={P(ANCHOR.PMIN)} to={[560, 200]} text="pec minor" size={36} />
            <Call t={t} t0={7.62} a={P(ANCHOR.PMAJ)} to={[620, 820]} text="pec major" size={36} />
          </>
        )}
      </Stage>
      <Counter t={t} />
      <div style={{ position: "absolute", left: 24, top: 880, ...pop(t, 5.5, 0.25), transformOrigin: "0 0" }}>
        <Pill size={26} bg={C.forest}>right armpit from the front · red = axillary artery</Pill>
      </div>
    </Scene>
  );
};

/* 4. M2 + M3: medial cutaneous nerves of the arm and forearm → skin */
export const V4: React.FC = () => {
  const t = useT();
  const k = cam(t, [[8.25, 1.16, 600, 430], [8.65, 1.12, 520, 600], [10.2, 1.12, 500, 610], [10.6, 1.1, 330, 700], [11.9, 1.1, 320, 700]]);
  return (
    <Scene start={8.25} end={11.9} push={0.004}>
      <Stage t={t} k={k} id="v4" lit={{ MP: 0, MA: NT.MA, MF: NT.MF }} hot={t < 10.3 ? ["MA"] : t < 11.3 ? ["MF"] : []} skinA={ramp(t, 9.8, 10.2)} skinF={ramp(t, 10.9, 11.25)} dimRest={0.7}>
        {(P) => (
          <>
            <Call t={t} t0={8.4} t1={10.3} a={P(ANCHOR.MA)} to={[600, 260]} text="medial cutaneous n. of ARM" bg={BCOL.MA} fg={C.forest} size={34} />
            <Call t={t} t0={9.9} t1={10.3} a={P(ANCHOR.SKA)} to={[560, 800]} text="skin" size={34} />
            <Call t={t} t0={10.45} a={P(ANCHOR.MF)} to={[560, 230]} text="… n. of FOREARM" bg={BCOL.MF} fg={C.forest} size={36} />
            <Call t={t} t0={11.0} a={P(ANCHOR.SKF)} to={[300, 820]} text="skin" size={34} />
          </>
        )}
      </Stage>
      <Counter t={t} />
      <Tip t={t} t0={11.05} top={110} size={34}>both = SKIN only (sensory)</Tip>
    </Scene>
  );
};

/* 5. M4: median nerve, its medial root */
export const V5: React.FC = () => {
  const t = useT();
  const k = cam(t, [[11.9, 1.1, 330, 700], [12.3, 1.55, 430, 430], [13.55, 1.6, 430, 425]]);
  return (
    <Scene start={11.9} end={13.55} push={0.004}>
      <Stage t={t} k={k} id="v5" lit={{ ...LIT_ALL, MR: NT.MR }} hot={t >= 12.6 ? ["MR"] : []} dimRest={0.7}>
        {(P) => (
          <>
            <Call t={t} t0={12.0} a={P(ANCHOR.MED)} to={[220, 180]} text="median nerve" size={38} />
            <Call t={t} t0={12.68} a={P(ANCHOR.MR)} to={[560, 760]} text="medial root" bg={BCOL.MR} fg={C.forest} size={42} />
          </>
        )}
      </Stage>
      <Counter t={t} />
    </Scene>
  );
};

/* 6. U: ulnar — the funny bone nerve */
export const V6: React.FC = () => {
  const t = useT();
  const k = cam(t, [[13.55, 1.6, 430, 425], [13.95, 1.12, 330, 640], [15.85, 1.18, 300, 660]]);
  return (
    <Scene start={13.55} end={15.85} push={0.004}>
      <Stage t={t} k={k} id="v6" lit={{ ...LIT_ALL, UL: NT.UL }} hot={t < 15.5 ? ["UL"] : []} epi={ramp(t, 14.69, 15.0)} dimRest={0.7}>
        {(P) => (
          <>
            <Call t={t} t0={14.28} a={P(ANCHOR.UL)} to={[640, 330]} text="ulnar" bg={BCOL.UL} fg={C.forest} size={48} />
            <Call t={t} t0={14.75} a={P(ANCHOR.EPI)} to={[560, 820]} text="funny bone = medial epicondyle" size={30} />
          </>
        )}
      </Stage>
      <Counter t={t} />
      <Tip t={t} t0={15.0} top={110} size={30} bg={C.forest} fg={C.paper}>dashed = behind the bone</Tip>
    </Scene>
  );
};

/* 7. Quick test */
export const V7: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[19.78, 3], [20.42, 2], [21.06, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < 21.7) { n = v; n0 = s; } });
  const opts = ["Lateral cord", "Posterior cord", "Medial cord"];
  return (
    <Scene start={15.85} end={21.7}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 820, height: 850, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 15.9, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 106, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 50, lineHeight: 1.12, color: C.paper, ...pop(t, 16.55) }}>
          The median nerve has a <span style={{ color: "#F2D14E" }}>2nd root</span>. Which <span style={{ color: "#C9B4E8" }}>CORD</span> gives it?
        </div>
        <div style={{ position: "absolute", left: 36, top: 330, width: 400, height: 480, borderRadius: 30, background: C.paper, overflow: "hidden", ...pop(t, 17.2, 0.3) }}>
          <div style={{ position: "absolute", left: 200 - 410 * 1.15, top: 250 - 400 * 1.15 }}>
            <Medial t={t} w={900 * 1.15} id="v7" lit={{ MR: 0 }} ask={{ t0: 17.2 }} dimRest={0.6} />
          </div>
          <div style={{ position: "absolute", left: 16, bottom: 14, background: BCOL.MR, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 26, borderRadius: 14, padding: "2px 12px 6px", opacity: ramp(t, 17.5, 17.7) }}>medial root ✓</div>
        </div>
        <div style={{ position: "absolute", left: 460, width: 350, top: 350, display: "flex", flexDirection: "column", gap: 26 }}>
          {opts.map((o, i) => (
            <div key={o} style={{ ...pop(t, 18.45 + i * 0.16), display: "flex", alignItems: "center", gap: 14, transformOrigin: "0 50%" }}>
              <div style={{ width: 58, height: 58, flex: "0 0 58px", borderRadius: 16, background: C.banana, color: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, border: `4px solid ${C.paper}` }}>{"ABC"[i]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.paper, whiteSpace: "nowrap" }}>{o}</div>
            </div>
          ))}
        </div>
        {n !== null && (
          <div key={n} style={{ position: "absolute", left: 560, top: 600, width: 200, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 170, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 8. Answer: lateral cord — both roots meet in front of the artery */
export const V8: React.FC = () => {
  const t = useT();
  const k = cam(t, [[21.7, 1.3, 430, 400], [23.45, 1.42, 440, 410]]);
  return (
    <Scene start={21.7} end={23.45} push={0.006}>
      <Stage t={t} k={k} id="v8" lit={{ MR: 0 }} lat={21.8} dimRest={0.7} top={60} h={820}>
        {(P) => (
          <>
            <Call t={t} t0={22.0} a={P(ANCHOR.LR)} to={[200, 200]} text="lateral root" bg="#B79BD6" fg={C.forest} size={38} />
            <Call t={t} t0={22.2} a={P(ANCHOR.MR)} to={[560, 700]} text="medial root" bg={BCOL.MR} fg={C.forest} size={38} />
            <Call t={t} t0={22.95} a={P(ANCHOR.ART)} to={[260, 800]} text="axillary artery" bg={C.red} size={32} />
          </>
        )}
      </Stage>
      <div style={center(0, pop(t, 21.75, 0.25))}>
        <Pill size={44} bg={C.red}>A ✓ LATERAL CORD</Pill>
      </div>
      <Tip t={t} t0={23.0} top={888} size={30}>2 roots join IN FRONT of the artery</Tip>
    </Scene>
  );
};

/* 8b. The real thing: Gray's 1918 Fig. 809 with modern labels */
export const V8b: React.FC = () => {
  const t = useT();
  return (
    <Scene start={23.45} end={25.55} push={0.006}>
      <PlateBox74 src={PLATE} aspect={A809} x={30} y={100} w={800} h={740} a={23.45} b={25.55} from={[0.3, 0.42, 0.62]} to={[0.3, 0.42, 0.55]} ls={30}
        labels={[
          { x: 0.1, y: 0.404, text: "median nerve", t: 23.55, hot: true, ox: 40, oy: -230 },
          { x: 0.12, y: 0.433, text: "ulnar nerve", t: 23.8, ox: 210, oy: 240 },
          { x: 0.52, y: 0.336, text: "axillary artery", t: 24.4, ox: -60, oy: -170 },
          { x: 0.262, y: 0.4, text: "medial cutaneous n.\nof forearm", t: 24.85, ox: 70, oy: 110 },
        ]} />
      <div style={center(4, pop(t, 23.5, 0.25))}>
        <Pill size={34} bg={C.forest}>Gray's Anatomy 1918 · right axilla</Pill>
      </div>
      <Note1918 t={t} t0={24.95} text="“internal cutaneous” = medial cutaneous n. of forearm" top={866} left={-10} size={23} />
    </Scene>
  );
};

/* 9. Save + cheat sheet */
export const V9: React.FC = () => {
  const t = useT();
  const s0 = 25.55;
  const b = ramp(t, s0 + 0.05, s0 + 0.4);
  return (
    <Scene start={s0} end={27.85}>
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
      <div style={{ position: "absolute", left: 30, top: 196, width: 800, height: 700, borderRadius: 40, background: C.card, border: `3px solid ${C.line}`, boxShadow: "0 18px 40px rgba(31,42,20,0.12)", ...pop(t, s0 + 0.15, 0.3) }}>
        <div style={{ position: "absolute", left: 36, top: 26, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.matcha, letterSpacing: 2 }}>MEDIAL CORD = M4U · 5 NERVES</div>
        {BORDER.map((l, i) => (
          <div key={l} style={{ position: "absolute", left: 36, top: 86 + i * 108, display: "flex", alignItems: "center", gap: 22, opacity: ramp(t, s0 + 0.3 + i * 0.08, s0 + 0.55 + i * 0.08) }}>
            <Chip b={l} size={80} />
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.forest, whiteSpace: "nowrap", lineHeight: 1.05 }}>{NAME[l]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, color: C.matcha, whiteSpace: "nowrap", marginTop: 4 }}>→ {TO[l]}</div>
            </div>
          </div>
        ))}
        <div style={{ position: "absolute", left: 36, top: 636, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.forest, opacity: ramp(t, s0 + 0.8, s0 + 1.0), whiteSpace: "nowrap" }}>
          <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px" }}>quiz</span> median's 2nd root = lateral cord
        </div>
      </div>
    </Scene>
  );
};

/* 10. End card (≤ 1.5 s) */
export const V10: React.FC = () => {
  const t = useT();
  const s0 = 27.85;
  return (
    <Scene start={s0} end={29.15}>
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
