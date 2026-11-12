import React from "react";
import { C, FONT, Pill, Scene, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, pop } from "./Scenes67";
import { PlateBox74 } from "./Scenes74";
import { K, KA, KCOL, KDARK, KORDER, KWORD, Knee, SA, SectKnee } from "./Knee87";

export const A551 = 609 / 2869;
export const PLATE = "plates/fig551_popliteal.png";
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* voice times (words.json) */
export const NT: Record<K, number> = { S: 6.13, A: 9.7, V: 11.01, N: 12.42, B: 13.62 };
export const NAME: Record<K, string> = { S: "Semimembranosus + semitendinosus", A: "Popliteal artery", V: "Popliteal vein", N: "Tibial nerve", B: "Biceps femoris" };
export const TO: Record<K, string> = { S: "inner (medial) upper border", A: "deepest, right on the bone", V: "between artery + nerve", N: "most superficial", B: "outer (lateral) upper border" };

export const Chip: React.FC<{ k: K | "?"; size?: number; on?: number; hot?: boolean }> = ({ k, size = 64, on = 1, hot }) => {
  const q = k === "?";
  const lit = on > 0.5 && !q;
  return (
    <div style={{ position: "relative", width: size, height: size, flex: `0 0 ${size}px`, borderRadius: size * 0.28, background: q ? C.forest : lit ? KCOL[k as K] : "rgba(31,42,20,0.08)", border: `4px solid ${q ? C.banana : lit ? C.forest : "rgba(31,42,20,0.25)"}`, color: q ? C.banana : lit ? (KDARK[k as K] ? C.paper : C.forest) : "rgba(31,42,20,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * (q ? 0.62 : 0.56), letterSpacing: -1, transform: `scale(${hot ? 1.16 : 1})`, boxShadow: hot ? `0 0 0 6px ${C.banana}` : "none" }}>
      {q ? "?" : k}
    </div>
  );
};

const Counter: React.FC<{ t: number; top?: number }> = ({ t, top = 10 }) => {
  const n = KORDER.filter((k) => t >= NT[k] - 0.05).length;
  return (
    <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", alignItems: "center", gap: 12 }}>
      {KORDER.map((k) => {
        const p = ramp(t, NT[k] - 0.05, NT[k] + 0.15);
        const hot = t >= NT[k] - 0.05 && t < NT[k] + 1.2;
        return <div key={k} style={{ transform: `scale(${1 + 0.25 * p * (1 - ramp(t, NT[k] + 0.15, NT[k] + 0.45))})` }}><Chip k={k} size={66} on={p} hot={hot} /></div>;
      })}
      <div style={{ marginLeft: 12, background: C.forest, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 36, borderRadius: 20, padding: "4px 18px 8px", whiteSpace: "nowrap" }}>{n}/5</div>
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
const Stage: React.FC<{ k: Kf; h?: number; top?: number; render: (w: number) => React.ReactNode; children?: (P: P) => React.ReactNode }> = ({ k, render, children, h = 940, top = 0 }) => {
  const [, s, cx, cy] = k;
  const u = (860 / 900) * s;
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

/* plate label positions (fractions of the Fig. 551 crop, from a grid) */
const PL = { ST: [0.234, 0.07], SM: [0.36, 0.11], BF: [0.82, 0.14], ART: [0.495, 0.14], NERVE: [0.545, 0.105], GM: [0.3, 0.205], GL: [0.72, 0.2], PER: [0.79, 0.355] };

/* 1. Hook: Gray's 1918 Fig. 551 (back of the knee) visible from frame 0 + challenge */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={3.6} push={0.02}>
      <div style={center(14, pop(t, -0.4, 0.25))}>
        <Big size={100}>BACK OF THE KNEE</Big>
      </div>
      <div style={center(120, pop(t, -0.3, 0.25))}>
        <Big size={96} color={C.red}>NAME ALL 5?</Big>
      </div>
      <PlateBox74 src={PLATE} aspect={A551} x={30} y={250} w={800} h={610} a={-0.6} b={3.6} from={[0.5, 0.15, 1.0]} to={[0.5, 0.15, 0.82]}
        labels={[{ x: 0.5, y: 0.15, text: "popliteal fossa", t: 2.4, hot: true, ox: -50, oy: -170 }]} />
      <div style={{ position: "absolute", left: 0, width: 860, top: 748, display: "flex", justifyContent: "center", gap: 16 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} style={pop(t, 0.3 + i * 0.1, 0.25)}><Chip k="?" size={78} /></div>
        ))}
      </div>
      <div style={center(884, pop(t, 0.1, 0.25))}>
        <Pill size={33} bg={C.forest}>popliteal fossa · mnemonic</Pill>
      </div>
    </Scene>
  );
};

/* 2. Mnemonic card: Serve And Volley Next Ball */
export const V2: React.FC = () => {
  const t = useT();
  const W: [K, number][] = [["S", 4.42], ["A", 4.76], ["V", 4.89], ["N", 5.21], ["B", 5.44]];
  return (
    <Scene start={3.6} end={6.05} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 820, height: 840, borderRadius: 48, background: C.forest, ...pop(t, 3.62, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 50, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 8, color: C.banana }}>THE MNEMONIC</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 110, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: "#B9D27A" }}>like a tennis rally · inner → outer</div>
        <div style={{ position: "absolute", left: 60, width: 700, top: 180, display: "flex", flexDirection: "column", gap: 14 }}>
          {W.map(([k, t0]) => {
            const p = ramp(t, t0 - 0.12, t0 + 0.12);
            const hot = t >= t0 - 0.05 && t < t0 + 0.4;
            return (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 26, opacity: 0.25 + 0.75 * p, transform: `translateX(${(1 - p) * 30}px)` }}>
                <div style={{ width: 96, height: 96, borderRadius: 26, background: p > 0.5 ? KCOL[k] : "rgba(247,246,236,0.12)", color: KDARK[k] ? C.paper : C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 66, border: `4px solid ${C.paper}`, transform: `scale(${hot ? 1.12 : 1})` }}>{k}</div>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 84, letterSpacing: -2, color: C.paper, lineHeight: 1 }}>
                  <span style={{ color: p > 0.5 ? C.banana : C.paper }}>{KWORD[k][0]}</span>{KWORD[k].slice(1)}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 742, display: "flex", justifyContent: "center", ...pop(t, 5.6, 0.25) }}>
          <div style={{ background: C.banana, borderRadius: 22, padding: "8px 26px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.forest }}>= the 5, medial → lateral</div>
        </div>
      </div>
    </Scene>
  );
};

const knee = (t: number, extra: Partial<React.ComponentProps<typeof Knee>>) => (w: number) => <Knee t={t} w={w} id={extra.id || "k"} {...extra} />;
const BUILD = 6.0;
const allLit = (t: number) => {
  const l: Record<string, number> = {};
  KORDER.forEach((k) => { if (t >= NT[k] - 0.2) l[k] = NT[k]; });
  return l;
};

/* 3. S: semimembranosus + semitendinosus */
export const V3: React.FC = () => {
  const t = useT();
  const k = cam(t, [[6.05, 0.92, 450, 500], [6.5, 1.15, 380, 380], [8.8, 1.2, 390, 390], [9.6, 1.0, 450, 470]]);
  return (
    <Scene start={6.05} end={9.6} push={0.004}>
      <Stage k={k} render={knee(t, { id: "v3", build: BUILD, lit: { S: NT.S }, hot: t < 9.0 ? ["S"] : [], dimRest: ramp(t, 6.4, 6.8) * 0.8, diamond: ramp(t, 8.95, 9.4) })}>
        {(P) => (
          <>
            <Call t={t} t0={6.5} a={P(KA.S)} to={[640, 230]} text="semimembranosus" bg={KCOL.S} fg={C.forest} size={40} />
            <Call t={t} t0={7.64} a={P(KA.ST)} to={[200, 700]} text="semitendinosus" bg={KCOL.S} fg={C.forest} size={40} />
          </>
        )}
      </Stage>
      <Counter t={t} />
      <Tip t={t} t0={8.97} top={866} size={34}>inner (medial) upper border</Tip>
      <div style={{ position: "absolute", left: 24, top: 112, ...pop(t, 6.2, 0.25), transformOrigin: "0 0" }}>
        <Pill size={24} bg={C.forest}>right knee from behind · inner side = left</Pill>
      </div>
    </Scene>
  );
};

/* 4. A: popliteal artery */
export const V4: React.FC = () => {
  const t = useT();
  const k = cam(t, [[9.6, 1.0, 450, 470], [10.0, 1.3, 440, 420], [10.95, 1.33, 445, 420]]);
  return (
    <Scene start={9.6} end={10.95} push={0.004}>
      <Stage k={k} render={knee(t, { id: "v4", lit: { S: 0, A: NT.A }, hot: ["A"], dimRest: 0.75, diamond: 0.5 })}>
        {(P) => <Call t={t} t0={9.85} a={P(KA.A)} to={[200, 230]} text="popliteal artery" bg={KCOL.A} size={42} />}
      </Stage>
      <Counter t={t} />
      <Tip t={t} t0={10.3} top={866} size={30} bg={C.forest} fg={C.paper}>the femoral artery, renamed behind the knee</Tip>
    </Scene>
  );
};

/* 5. V: popliteal vein (+ small saphenous vein joins it) */
export const V5: React.FC = () => {
  const t = useT();
  const k = cam(t, [[10.95, 1.33, 445, 420], [11.3, 1.25, 465, 560], [12.35, 1.27, 465, 570]]);
  return (
    <Scene start={10.95} end={12.35} push={0.004}>
      <Stage k={k} render={knee(t, { id: "v5", lit: { S: 0, A: 0, V: NT.V, SSV: 11.75 }, hot: t < 11.75 ? ["V"] : ["V", "SSV"], dimRest: 0.75, diamond: 0.5, ssv: ramp(t, 11.7, 12.1) })}>
        {(P) => (
          <>
            <Call t={t} t0={11.37} a={P(KA.V)} to={[680, 260]} text="popliteal vein" bg={KCOL.V} size={42} />
            <Call t={t} t0={11.8} a={P(KA.SSV)} to={[220, 800]} text={"+ small saphenous\nvein joins it"} size={28} bg={C.forest} />
          </>
        )}
      </Stage>
      <Counter t={t} />
    </Scene>
  );
};

/* 6. N: tibial nerve (+ common fibular nerve along biceps) */
export const V6: React.FC = () => {
  const t = useT();
  const k = cam(t, [[12.35, 1.27, 465, 570], [12.7, 1.2, 520, 360], [13.55, 1.22, 525, 360]]);
  return (
    <Scene start={12.35} end={13.55} push={0.004}>
      <Stage k={k} render={knee(t, { id: "v6", lit: { S: 0, A: 0, V: 0, N: NT.N, CF: 13.05 }, hot: t < 13.05 ? ["N"] : ["N", "CF"], dimRest: 0.75, diamond: 0.5 })}>
        {(P) => (
          <>
            <Call t={t} t0={12.75} a={P(KA.N)} to={[230, 200]} text="tibial nerve" bg={KCOL.N} fg={C.forest} size={42} />
            <Call t={t} t0={13.1} a={P(KA.CF)} to={[620, 800]} text={"+ common fibular n.\nhugs the biceps"} size={28} bg={C.forest} />
          </>
        )}
      </Stage>
      <Counter t={t} />
      <Note1918 t={t} t0={13.15} text="“common peroneal” = common fibular" top={866} left={20} size={26} />
    </Scene>
  );
};

/* 7. B: biceps femoris + the diamond closes with gastrocnemius */
export const V7: React.FC = () => {
  const t = useT();
  const k = cam(t, [[13.55, 1.22, 525, 360], [13.95, 1.15, 530, 340], [14.9, 1.15, 530, 350], [15.35, 0.9, 450, 490], [16.0, 0.9, 450, 495]]);
  return (
    <Scene start={13.55} end={16.0} push={0.004}>
      <Stage k={k} render={knee(t, { id: "v7", lit: { ...allLit(t), G: 15.35 }, hot: t < 15.2 ? ["B"] : ["G"], dimRest: 0.6, diamond: 0.5 + 0.5 * ramp(t, 15.3, 15.7), tag: t > 15.4 ? { S: "S", A: "A", V: "V", N: "N", B: "B" } : undefined })}>
        {(P) => (
          <>
            <Call t={t} t0={13.95} a={P(KA.B)} to={[260, 210]} text="biceps femoris" bg={KCOL.B} fg={C.forest} size={42} t1={15.2} />
            <Call t={t} t0={15.45} a={P(KA.GM)} to={[190, 830]} text={"gastrocnemius\nheads below"} size={28} bg={C.forest} />
          </>
        )}
      </Stage>
      <Counter t={t} />
      <Tip t={t} t0={15.18} top={112} size={30} bg={C.forest} fg={C.paper} t1={15.9}>outer (lateral) upper border</Tip>
      <Tip t={t} t0={15.5} top={866} size={32}>4 borders = a diamond</Tip>
    </Scene>
  );
};

/* 8. Quick test */
export const V8: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[18.95, 3], [19.59, 2], [20.23, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < 20.85) { n = v; n0 = s; } });
  const opts: [K, string][] = [["N", "Tibial nerve"], ["V", "Popliteal vein"], ["A", "Popliteal artery"]];
  return (
    <Scene start={16.0} end={20.85}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 820, height: 850, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 16.05, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 106, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 54, lineHeight: 1.12, color: C.paper, ...pop(t, 16.75) }}>
          Which one lies <span style={{ color: C.banana }}>DEEPEST</span>, right on the bone?
        </div>
        <div style={{ position: "absolute", left: 36, top: 330, width: 390, height: 480, borderRadius: 30, background: C.paper, overflow: "hidden", ...pop(t, 17.0, 0.3) }}>
          <div style={{ position: "absolute", left: 195 - 470 * 0.78, top: 250 - 540 * 0.78 }}>
            <SectKnee t={t} w={900 * 0.78} id="v8" ask={t >= 17.4} />
          </div>
          <div style={{ position: "absolute", left: 14, top: 12, background: C.matcha, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 22, borderRadius: 14, padding: "2px 12px 6px", opacity: ramp(t, 17.3, 17.5) }}>slice · bone on top</div>
        </div>
        <div style={{ position: "absolute", left: 452, width: 360, top: 360, display: "flex", flexDirection: "column", gap: 28 }}>
          {opts.map(([k, o], i) => (
            <div key={o} style={{ ...pop(t, 17.6 + i * 0.16), display: "flex", alignItems: "center", gap: 14, transformOrigin: "0 50%" }}>
              <div style={{ width: 58, height: 58, flex: "0 0 58px", borderRadius: 16, background: C.banana, color: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, border: `4px solid ${C.paper}` }}>{"ABC"[i]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.paper, whiteSpace: "nowrap" }}>{o}</div>
            </div>
          ))}
        </div>
        {n !== null && (
          <div key={n} style={{ position: "absolute", left: 540, top: 600, width: 200, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 180, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 9. Answer on the real plate: Gray's 1918 Fig. 551 with modern labels */
export const V9: React.FC = () => {
  const t = useT();
  return (
    <Scene start={20.85} end={22.2} push={0.006}>
      <PlateBox74 src={PLATE} aspect={A551} x={30} y={110} w={800} h={760} a={20.85} b={22.2} from={[0.5, 0.15, 0.8]} to={[0.5, 0.155, 0.74]} ls={30}
        labels={[
          { x: PL.ART[0], y: PL.ART[1], text: "popliteal artery", t: 20.95, hot: true, ox: 120, oy: 300 },
          { x: PL.NERVE[0], y: PL.NERVE[1], text: "tibial nerve", t: 21.3, ox: 110, oy: -50 },
          { x: PL.SM[0], y: PL.SM[1], text: "semi-\nmembranosus", t: 21.5, ox: 10, oy: 300 },
          { x: PL.BF[0], y: PL.BF[1], text: "biceps femoris", t: 21.7, ox: -20, oy: -120 },
        ]} />
      <div style={center(0, pop(t, 20.9, 0.25))}>
        <Pill size={44} bg={C.red}>C ✓ POPLITEAL ARTERY = deepest</Pill>
      </div>
    </Scene>
  );
};

/* 10. Skin → bone: nerve, vein, artery (transverse section) */
export const V10: React.FC = () => {
  const t = useT();
  const k = cam(t, [[22.2, 1.0, 470, 500], [23.0, 1.32, 470, 540], [24.6, 1.36, 470, 545]]);
  const st: [string, number, [number, number]][] = [["N", 23.26, [700, 650]], ["V", 23.67, [720, 520]], ["A", 24.02, [700, 390]]];
  return (
    <Scene start={22.2} end={24.6} push={0.004}>
      <Stage k={k} top={60} h={820} render={(w) => <SectKnee t={t} w={w} id="v10" lit={{ N: 23.26, V: 23.67, A: 24.02, FEM: 22.3 }} hot={t < 23.67 ? ["N"] : t < 24.02 ? ["V"] : ["A"]} dimRest={0.5} arrow={ramp(t, 22.35, 23.1)} />}>
        {(P) => (
          <>
            {st.map(([k2, t0, to]) => (
              <Call key={k2} t={t} t0={t0} a={P(SA[k2])} to={to} text={{ N: "1 nerve", V: "2 vein", A: "3 artery" }[k2] as string} bg={KCOL[k2 as K]} fg={KDARK[k2 as K] ? C.paper : C.forest} size={40} />
            ))}
            <Call t={t} t0={22.45} a={P(SA.FEM)} to={[200, 190]} text="femur (bone)" size={30} bg={C.forest} />
          </>
        )}
      </Stage>
      <Tip t={t} t0={22.3} top={0} size={36} bg={C.forest} fg={C.paper}>skin → bone: N · V · A</Tip>
      <Tip t={t} t0={22.6} top={892} size={27}>slice above the knee · front (bone) on top</Tip>
    </Scene>
  );
};

/* 11. Save + cheat sheet */
export const V11: React.FC = () => {
  const t = useT();
  const s0 = 24.6;
  const b = ramp(t, s0 + 0.05, s0 + 0.4);
  return (
    <Scene start={s0} end={26.95}>
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
        <div style={{ position: "absolute", left: 36, top: 26, fontFamily: FONT, fontWeight: 800, fontSize: 27, color: C.matcha, letterSpacing: 1.5, whiteSpace: "nowrap" }}>POPLITEAL FOSSA · SERVE AND VOLLEY NEXT BALL</div>
        {KORDER.map((l, i) => (
          <div key={l} style={{ position: "absolute", left: 36, top: 84 + i * 104, display: "flex", alignItems: "center", gap: 22, opacity: ramp(t, s0 + 0.3 + i * 0.08, s0 + 0.55 + i * 0.08) }}>
            <Chip k={l} size={80} />
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.forest, whiteSpace: "nowrap", lineHeight: 1.05 }}>{NAME[l]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, color: C.matcha, whiteSpace: "nowrap", marginTop: 4 }}>→ {TO[l]}</div>
            </div>
          </div>
        ))}
        <div style={{ position: "absolute", left: 36, top: 610, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.forest, opacity: ramp(t, s0 + 0.7, s0 + 0.9), whiteSpace: "nowrap" }}>
          <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px" }}>below</span> 2 heads of gastrocnemius close the diamond
        </div>
      </div>
    </Scene>
  );
};

/* 12. End card (≤ 1.5 s) */
export const V12: React.FC = () => {
  const t = useT();
  const s0 = 26.95;
  return (
    <Scene start={s0} end={28.3}>
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
