import React from "react";
import { C, FONT, Pill, Scene, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, pop } from "./Scenes67";
import { PlateBox74 } from "./Scenes74";
import { Exploded, FA, FrontLarynx, K, KCOL, KFG, KLET, KNAME, PAIRS, Rings, SINGLES, TA, TopView, XA } from "./Larynx88";

export const A951 = 748 / 1554;
export const A950 = 1101 / 2201;
export const P951 = "plates/fig951_larynx_front.png";
export const P950 = "plates/fig950_larynx_cart.png";
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* voice times (words.json) */
export const NT: Record<K, number> = { EP: 8.64, TH: 9.31, CR: 9.79, AR: 12.06, CO: 12.67, CU: 13.35 };
const ORDER: K[] = [...SINGLES, ...PAIRS];

export const Chip: React.FC<{ k: K | "?"; size?: number; on?: number; hot?: boolean; x2?: boolean }> = ({ k, size = 64, on = 1, hot, x2 }) => {
  const q = k === "?";
  const lit = on > 0.5 && !q;
  return (
    <div style={{ position: "relative", width: size, height: size, flex: `0 0 ${size}px`, borderRadius: size * 0.28, background: q ? C.forest : lit ? KCOL[k as K] : "rgba(31,42,20,0.08)", border: `4px solid ${q ? C.banana : lit ? C.forest : "rgba(31,42,20,0.25)"}`, color: q ? C.banana : lit ? KFG[k as K] : "rgba(31,42,20,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.6, letterSpacing: -1, transform: `scale(${hot ? 1.16 : 1})`, boxShadow: hot ? `0 0 0 6px ${C.banana}` : "none" }}>
      {q ? "?" : KLET[k as K]}
      {x2 && lit && <div style={{ position: "absolute", right: -size * 0.22, top: -size * 0.22, background: C.forest, color: C.banana, borderRadius: 14, fontSize: size * 0.28, padding: "0 7px 3px", border: `3px solid ${C.paper}` }}>×2</div>}
    </div>
  );
};

/* top strip: E T C | A C C */
const Strip: React.FC<{ t: number; top?: number }> = ({ t, top = 6 }) => {
  let cur: K | null = null;
  ORDER.forEach((k) => { if (t >= NT[k] - 0.05) cur = k; });
  return (
    <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", alignItems: "center", gap: 12 }}>
      {ORDER.map((k, i) => {
        const p = ramp(t, NT[k] - 0.05, NT[k] + 0.15);
        return (
          <React.Fragment key={k}>
            {i === 3 && <div style={{ width: 4, height: 60, background: C.line, margin: "0 8px", borderRadius: 2 }} />}
            <div style={{ transform: `scale(${1 + 0.25 * p * (1 - ramp(t, NT[k] + 0.15, NT[k] + 0.45))})` }}><Chip k={k} size={66} on={p} hot={cur === k && t < NT[k] + 1.2} x2={i >= 3} /></div>
          </React.Fragment>
        );
      })}
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
type P = (m: [number, number]) => [number, number];
const Stage: React.FC<{ k: Kf; h?: number; top?: number; vw?: number; render: (w: number) => React.ReactNode; children?: (P: P) => React.ReactNode }> = ({ k, render, children, h = 940, top = 0, vw = 900 }) => {
  const [, s, cx, cy] = k;
  const u = (860 / vw) * s;
  const X0 = 430 - cx * u, Y0 = h / 2 - cy * u;
  const Pf: P = (m) => [X0 + m[0] * u, top + Y0 + m[1] * u];
  return (
    <>
      <div style={{ position: "absolute", left: 0, top, width: 860, height: h, overflow: "hidden", borderRadius: 40, background: C.paper, boxShadow: `0 0 0 5px ${C.line}` }}>
        <div style={{ position: "absolute", left: X0, top: Y0 }}>{render(860 * s)}</div>
      </div>
      {children && children(Pf)}
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
        <Pill size={size} bg={bg} color={fg} style={{ whiteSpace: "pre", textAlign: "center", lineHeight: 1.08 }}>{text}</Pill>
      </div>
    </>
  );
};
const Note1918: React.FC<{ t: number; t0: number; text: React.ReactNode; top?: number; left?: number; size?: number }> = ({ t, t0, text, top = 856, left = 30, size = 25 }) => (
  <div style={{ position: "absolute", left, top, opacity: ramp(t, t0, t0 + 0.25), transform: `scale(${0.8 + 0.2 * ramp(t, t0, t0 + 0.25)})`, transformOrigin: "0 0" }}>
    <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 16px 10px", fontFamily: FONT, fontWeight: 800, fontSize: size, color: C.forest, lineHeight: 1.2, boxShadow: "0 6px 0 rgba(31,42,20,0.08)", whiteSpace: "nowrap" }}>
      <span style={{ color: C.matcha }}>1918 atlas name:</span> {text}
    </div>
  </div>
);
const Tip: React.FC<{ t: number; t0: number; top: number; children: React.ReactNode; bg?: string; fg?: string; size?: number; t1?: number }> = ({ t, t0, top, children, bg = C.banana, fg = C.forest, size = 34, t1 }) =>
  t >= t0 - 0.05 && (!t1 || t < t1 + 0.2) ? (
    <div style={{ ...center(top), ...pop(t, t0, 0.25), opacity: ramp(t, t0, t0 + 0.2) * (t1 ? 1 - ramp(t, t1, t1 + 0.2) : 1) }}>
      <Pill size={size} bg={bg} color={fg} style={{ whiteSpace: "nowrap" }}>{children}</Pill>
    </div>
  ) : null;

/* 1. Hook: Gray's 1918 Fig. 951 visible from frame 0 + challenge */
export const V1: React.FC = () => {
  const t = useT();
  const x = ramp(t, 1.1, 1.35);
  return (
    <Scene start={-0.6} end={2.62} push={0.02}>
      <div style={center(4, pop(t, -0.4, 0.25))}>
        <Big size={84}>YOUR ADAM'S APPLE</Big>
      </div>
      <div style={center(100, pop(t, -0.3, 0.25))}>
        <Big size={104} color={C.red}>IS NOT A BONE</Big>
      </div>
      <PlateBox74 src={P951} aspect={A951} x={30} y={232} w={800} h={630} a={-0.6} b={2.62} from={[0.42, 0.44, 1.3]} to={[0.32, 0.42, 1.0]}
        labels={[{ x: 0.2, y: 0.39, text: "Adam's apple", t: 0.45, hot: true, ox: 230, oy: -40 }]} />
      {x > 0 && (
        <div style={{ position: "absolute", left: 520, top: 560, transform: `rotate(-8deg) scale(${1.4 - 0.4 * x})`, opacity: x }}>
          <div style={{ border: `8px solid ${C.red}`, color: C.red, background: "rgba(247,246,236,0.92)", borderRadius: 20, padding: "4px 22px 10px", fontFamily: FONT, fontWeight: 800, fontSize: 64, letterSpacing: 2 }}>BONE ✗</div>
        </div>
      )}
      <div style={center(884, pop(t, 0.1, 0.25))}>
        <Pill size={33} bg={C.forest}>larynx cartilages · mnemonic</Pill>
      </div>
    </Scene>
  );
};

/* 2. It's the thyroid cartilage, biggest of 9 */
export const V2: React.FC = () => {
  const t = useT();
  const k = cam(t, [[2.62, 1.0, 450, 520], [3.0, 1.12, 450, 430], [4.4, 1.12, 450, 430], [4.9, 0.86, 450, 520], [5.9, 0.86, 450, 520]]);
  const n9 = ramp(t, 4.5, 4.75);
  return (
    <Scene start={2.62} end={5.9} push={0.006}>
      <Stage k={k} render={(w) => <FrontLarynx t={t} w={w} id="v2" lit={{ TH: 2.8 }} hot={t < 4.5 ? ["TH"] : []} dimRest={0.45} epi={0.7} />}>
        {(P) => (
          <>
            <Call t={t} t0={2.85} a={P(FA.TH)} to={[170, 610]} text={"thyroid\ncartilage"} bg={KCOL.TH} size={40} t1={4.45} />
            <Call t={t} t0={3.35} a={P(FA.PROM)} to={[640, 150]} text={"laryngeal prominence\n= Adam's apple"} size={30} t1={4.45} />
          </>
        )}
      </Stage>
      <Tip t={t} t0={4.05} top={826} size={38} t1={4.45}>the BIGGEST one</Tip>
      {n9 > 0 && (
        <div style={{ position: "absolute", left: 20, top: 640, width: 820, borderRadius: 34, background: C.forest, padding: "22px 0 26px", opacity: n9, transform: `translateY(${(1 - n9) * 50}px)` }}>
          <div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 50, color: C.paper }}><span style={{ color: C.banana, fontSize: 64 }}>9</span> cartilages in your larynx</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 14 }}>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} style={{ ...pop(t, 4.6 + i * 0.07, 0.2), width: 62, height: 62, borderRadius: 18, background: i === 0 ? KCOL.TH : "rgba(247,246,236,0.12)", border: `4px solid ${i === 0 ? C.banana : "rgba(247,246,236,0.35)"}` }} />
            ))}
          </div>
        </div>
      )}
    </Scene>
  );
};

/* 3. Singles: think E-T-C */
export const V3: React.FC = () => {
  const t = useT();
  const L: [K, number][] = [["EP", 7.89], ["TH", 8.0], ["CR", 8.23]];
  return (
    <Scene start={5.9} end={8.6} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, ...pop(t, 5.92, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 54, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 8, color: C.banana }}>THE MNEMONIC</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 120, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 66, color: C.paper, ...pop(t, 6.0) }}>
          <span style={{ color: C.banana }}>3</span> are single
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 216, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: "#B9D27A", ...pop(t, 6.9) }}>top → bottom</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 310, display: "flex", justifyContent: "center", gap: 34 }}>
          {L.map(([k, t0], i) => {
            const p = ramp(t, t0 - 0.06, t0 + 0.14);
            return (
              <div key={k} style={{ ...pop(t, 6.1 + i * 0.12, 0.25) }}>
                <div style={{ width: 200, height: 230, borderRadius: 40, background: p > 0.5 ? KCOL[k] : "rgba(247,246,236,0.1)", border: `6px solid ${p > 0.5 ? C.banana : "rgba(247,246,236,0.35)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 170, color: p > 0.5 ? KFG[k] : C.banana, transform: `scale(${1 + 0.12 * Math.sin(Math.min(1, p) * Math.PI)})` }}>{p > 0.5 ? KLET[k] : "?"}</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 590, display: "flex", justifyContent: "center", ...pop(t, 8.3, 0.25) }}>
          <div style={{ background: C.banana, borderRadius: 22, padding: "10px 30px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.forest }}>E · T · C = “etc.”</div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 700, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: "#B9D27A", ...pop(t, 7.5) }}>1 of each · no pair</div>
      </div>
    </Scene>
  );
};

/* 4. epiglottis, thyroid, cricoid on the exploded diagram */
export const V4: React.FC = () => {
  const t = useT();
  const k = cam(t, [[8.6, 0.78, 450, 560], [10.48, 0.8, 450, 560]]);
  const hot: string[] = t < 9.27 ? ["EP"] : t < 9.75 ? ["TH"] : ["CR"];
  return (
    <Scene start={8.6} end={10.48} push={0.004}>
      <Stage k={k} top={90} h={850} render={(w) => <Exploded t={t} w={w} id="v4" lit={{ EP: NT.EP, TH: NT.TH, CR: NT.CR }} hot={hot} dimRest={0.6} />}>
        {(P) => (
          <>
            <Call t={t} t0={8.68} a={P(XA.EP)} to={[650, 200]} text="E · epiglottis" bg={KCOL.EP} fg={C.forest} size={38} />
            <Call t={t} t0={9.35} a={P(XA.TH)} to={[180, 330]} text="T · thyroid" bg={KCOL.TH} size={38} />
            <Call t={t} t0={9.83} a={P(XA.CR)} to={[660, 760]} text="C · cricoid" bg={KCOL.CR} size={38} />
          </>
        )}
      </Stage>
      <Strip t={t} />
    </Scene>
  );
};

/* 5. Pairs: A-C-C */
export const V5: React.FC = () => {
  const t = useT();
  const L: [K, number][] = [["AR", 11.32], ["CO", 11.37], ["CU", 11.64]];
  return (
    <Scene start={10.48} end={12.0} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, ...pop(t, 10.5, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 54, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 8, color: C.banana }}>THE MNEMONIC</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 120, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 66, color: C.paper }}>
          <span style={{ color: C.banana }}>3</span> come in pairs
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 300, display: "flex", justifyContent: "center", gap: 34 }}>
          {L.map(([k, t0], i) => {
            const p = ramp(t, t0 - 0.06, t0 + 0.12);
            return (
              <div key={k} style={{ ...pop(t, 10.6 + i * 0.1, 0.22), position: "relative", width: 200, height: 250 }}>
                <div style={{ position: "absolute", left: 18, top: 18, width: 200, height: 230, borderRadius: 40, background: p > 0.5 ? KCOL[k] : "rgba(247,246,236,0.06)", border: `6px solid ${C.forest}`, opacity: 0.55 }} />
                <div style={{ position: "absolute", left: 0, top: 0, width: 200, height: 230, borderRadius: 40, background: p > 0.5 ? KCOL[k] : "rgba(247,246,236,0.1)", border: `6px solid ${p > 0.5 ? C.banana : "rgba(247,246,236,0.35)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 170, color: p > 0.5 ? KFG[k] : C.banana, transform: `scale(${1 + 0.12 * Math.sin(Math.min(1, p) * Math.PI)})` }}>{p > 0.5 ? KLET[k] : "?"}</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 610, display: "flex", justifyContent: "center", ...pop(t, 11.0, 0.25) }}>
          <div style={{ background: C.banana, borderRadius: 22, padding: "10px 30px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 48, color: C.forest }}>3 + 3 × 2 = 9</div>
        </div>
      </div>
    </Scene>
  );
};

/* 6. Pairs on Gray's 1918 Fig. 950 */
export const V6: React.FC = () => {
  const t = useT();
  return (
    <Scene start={12.0} end={14.26} push={0.006}>
      <PlateBox74 src={P950} aspect={A950} x={30} y={96} w={800} h={740} a={12.0} b={14.26} from={[0.55, 0.69, 0.98]} to={[0.56, 0.68, 0.86]} ls={30}
        labels={[
          { x: 0.43, y: 0.72, text: "A · arytenoid", t: 12.06, hot: t < 12.6, ox: -40, oy: 175 },
          { x: 0.68, y: 0.71, text: "A", t: 12.1, ox: 40, oy: 175 },
          { x: 0.51, y: 0.637, text: "C · corniculate", t: 12.67, hot: t >= 12.6 && t < 13.3, ox: 30, oy: -150 },
          { x: 0.62, y: 0.637, text: "C", t: 12.72, ox: 120, oy: -110 },
          { x: 0.42, y: 0.618, text: "C · cuneiform", t: 13.35, hot: t >= 13.3, ox: -40, oy: -210 },
          { x: 0.745, y: 0.64, text: "C", t: 13.4, ox: 60, oy: -40 },
        ]} />
      <Strip t={t} />
      <Note1918 t={t} t0={13.7} text="“arytænoid” = arytenoid" top={862} left={0} size={26} />
    </Scene>
  );
};

/* 7. Vocal cords: thyroid (front) -> arytenoids (back), seen from above */
export const V7: React.FC = () => {
  const t = useT();
  const k = cam(t, [[14.26, 0.9, 450, 470], [14.7, 1.0, 450, 460], [17.92, 1.04, 450, 470]]);
  const hot: string[] = t < 15.8 ? ["VF"] : t < 16.85 ? ["VF", "TH"] : ["VF", "AR"];
  return (
    <Scene start={14.26} end={17.92} push={0.004}>
      <Stage k={k} top={70} h={810} render={(w) => <TopView t={t} w={w} id="v7" lit={{ VF: 14.4, TH: 15.82, AR: 16.86 }} hot={hot} dimRest={0.5} />}>
        {(P) => (
          <>
            <Call t={t} t0={14.45} a={P(TA.VF)} to={[170, 330]} text={"vocal\ncords"} bg={C.banana} fg={C.forest} size={40} />
            <Call t={t} t0={15.85} a={P(TA.TH)} to={[650, 170]} text={"FRONT: thyroid"} bg={KCOL.TH} size={34} />
            <Call t={t} t0={16.9} a={P(TA.AR2)} to={[650, 790]} text={"BACK: arytenoids"} bg={KCOL.AR} size={34} />
          </>
        )}
      </Stage>
      <Tip t={t} t0={14.4} top={892} size={30} bg={C.forest} fg={C.paper}>your larynx, seen from above</Tip>
    </Scene>
  );
};

/* 8. Quick test */
export const V8: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[21.26, 3], [21.9, 2], [22.54, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < 23.12) { n = v; n0 = s; } });
  const opts: [string, K][] = [["Thyroid", "TH"], ["Cricoid", "CR"], ["Epiglottis", "EP"]];
  return (
    <Scene start={17.92} end={23.12}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 870, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 17.95, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 108, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 54, lineHeight: 1.12, color: C.paper, ...pop(t, 18.8) }}>
          Which one is a <span style={{ color: C.banana }}>COMPLETE RING</span> around your airway?
        </div>
        <div style={{ position: "absolute", left: 36, top: 340, width: 380, height: 490, borderRadius: 30, background: C.paper, overflow: "hidden", ...pop(t, 19.2, 0.3) }}>
          <div style={{ position: "absolute", left: 190 - 450 * 0.5, top: 245 - 520 * 0.5 }}>
            <FrontLarynx t={t} w={900 * 0.5} id="v8" lit={{ TH: 0, CR: 0 }} epi={0} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 450, width: 360, top: 380, display: "flex", flexDirection: "column", gap: 30 }}>
          {opts.map(([o, k], i) => (
            <div key={o} style={{ ...pop(t, 19.5 + i * 0.16), display: "flex", alignItems: "center", gap: 14, transformOrigin: "0 50%" }}>
              <div style={{ width: 62, height: 62, flex: "0 0 62px", borderRadius: 16, background: C.banana, color: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, border: `4px solid ${C.paper}` }}>{"ABC"[i]}</div>
              <div style={{ width: 22, height: 22, borderRadius: 11, background: KCOL[k], border: `3px solid ${C.paper}` }} />
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper, whiteSpace: "nowrap" }}>{o}</div>
            </div>
          ))}
        </div>
        {n !== null && (
          <div key={n} style={{ position: "absolute", left: 540, top: 640, width: 200, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 180, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 9. Answer: the cricoid, a signet ring */
export const V9: React.FC = () => {
  const t = useT();
  return (
    <Scene start={23.12} end={25.3} push={0.006}>
      <div style={center(36, pop(t, 23.2, 0.25))}>
        <Pill size={50} bg={C.red}>B ✓ THE CRICOID</Pill>
      </div>
      <div style={{ position: "absolute", left: 0, top: 130, width: 860, height: 450, borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}`, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: -20, top: -20 }}>
          <Rings t={t} w={900} id="v9" t0={23.3} />
        </div>
        <div style={{ position: "absolute", left: 40, top: 20, ...pop(t, 23.95, 0.25), transformOrigin: "0 0" }}>
          <Pill size={32} bg={C.forest}>shaped like a signet ring</Pill>
        </div>
      </div>
      <PlateBox74 src={P951} aspect={A951} x={0} y={604} w={860} h={290} a={23.12} b={25.3} from={[0.42, 0.73, 1.1]} to={[0.4, 0.73, 1.0]} ls={30} credit="Gray's 1918 · PD"
        labels={[{ x: 0.2, y: 0.74, text: "cricoid cartilage", t: 23.6, hot: true, ox: 300, oy: -40 }]} />
    </Scene>
  );
};

/* 10. Save + cheat sheet */
export const V10: React.FC = () => {
  const t = useT();
  const s0 = 25.3;
  const b = ramp(t, s0 + 0.05, s0 + 0.4);
  const rows: [K, string][] = [["EP", "leaf-shaped lid on top"], ["TH", "biggest · Adam's apple"], ["CR", "the only full ring"], ["AR", "vocal cords attach here"], ["CO", "tiny horns on the arytenoids"], ["CU", "wedges in the folds"]];
  return (
    <Scene start={s0} end={27.6}>
      <div style={{ position: "absolute", left: 40, top: 34, ...pop(t, s0 + 0.05) }}>
        <svg width={110} height={140} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 170, top: 40, ...pop(t, s0 + 0.1) }}>
        <Big size={100}>SAVE THIS</Big>
      </div>
      <div style={{ position: "absolute", left: 172, top: 146, ...pop(t, s0 + 0.3) }}>
        <Big size={40} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ position: "absolute", left: 30, top: 222, width: 800, height: 700, borderRadius: 40, background: C.card, border: `3px solid ${C.line}`, boxShadow: "0 18px 40px rgba(31,42,20,0.12)", ...pop(t, s0 + 0.15, 0.3) }}>
        <div style={{ position: "absolute", left: 36, top: 26, fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.matcha, letterSpacing: 1.5, whiteSpace: "nowrap" }}>9 LARYNX CARTILAGES · E-T-C + A-C-C</div>
        {rows.map(([k, d], i) => (
          <div key={k} style={{ position: "absolute", left: 36, top: 84 + i * 100 + (i >= 3 ? 24 : 0), display: "flex", alignItems: "center", gap: 22, opacity: ramp(t, s0 + 0.3 + i * 0.07, s0 + 0.55 + i * 0.07) }}>
            <Chip k={k} size={76} x2={i >= 3} />
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.forest, whiteSpace: "nowrap", lineHeight: 1.05 }}>{KNAME[k]}{i >= 3 ? " ×2" : ""}</div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, color: C.matcha, whiteSpace: "nowrap", marginTop: 3 }}>→ {d}</div>
            </div>
          </div>
        ))}
        <div style={{ position: "absolute", left: 36, top: 383, width: 728, height: 3, background: C.line }} />
      </div>
    </Scene>
  );
};

/* 11. End card (≤ 1.5 s) */
export const V11: React.FC = () => {
  const t = useT();
  const s0 = 27.6;
  return (
    <Scene start={s0} end={28.9}>
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
