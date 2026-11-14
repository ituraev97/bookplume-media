import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, pop } from "./Scenes67";
import { PlateBox74 } from "./Scenes74";
import { ANCHOR, AT, Ankle, COL, K, ORDER } from "./Ankle77";

export const A437 = 741 / 3160;
export const A553 = 1003 / 3033;
export const PLATE = "plates/fig437_frontleg.png";
export const PLATE2 = "plates/fig553_anttibial.png";
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* voice times (words.json) */
export const LT: Record<K, number> = { T: 5.66, H: 7.76, V: 10.25, N: 12.24, D: 14.01, P: 16.07 };
export const MN: Record<K, { word: string; name: string; short: string }> = {
  T: { word: "Tom", name: "Tibialis anterior", short: "most medial" },
  H: { word: "Has", name: "extensor Hallucis longus", short: "to the big toe" },
  V: { word: "Very", name: "anterior tibial Vessels", short: "artery + 2 veins" },
  N: { word: "Nice", name: "deep fibular Nerve", short: "old name: deep peroneal" },
  D: { word: "Dancing", name: "extensor Digitorum longus", short: "to 4 toes" },
  P: { word: "Pigs", name: "Peroneus tertius", short: "= fibularis tertius" },
};
export const LChip: React.FC<{ k: K; size?: number; on?: number; hot?: boolean }> = ({ k, size = 64, on = 1, hot }) => (
  <div style={{ width: size, height: size, flex: `0 0 ${size}px`, borderRadius: size * 0.28, background: on > 0.5 ? COL[k] : "rgba(31,42,20,0.08)", border: `4px solid ${on > 0.5 ? C.forest : "rgba(31,42,20,0.25)"}`, color: on > 0.5 ? (k === "N" ? C.forest : C.paper) : "rgba(31,42,20,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.6, transform: `scale(${hot ? 1.16 : 1})`, boxShadow: hot ? `0 0 0 6px ${C.banana}` : "none" }}>
    {k}
  </div>
);

/* running strip: T H V N D P + n/6 */
const Counter: React.FC<{ t: number; top?: number }> = ({ t, top = 10 }) => {
  const n = ORDER.filter((k) => t >= LT[k]).length;
  return (
    <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}>
      {ORDER.map((k) => {
        const p = ramp(t, LT[k], LT[k] + 0.2);
        const hot = t >= LT[k] && t < LT[k] + 1.2;
        return <div key={k} style={{ transform: `scale(${1 + 0.25 * p * (1 - ramp(t, LT[k] + 0.2, LT[k] + 0.5))})` }}><LChip k={k} size={66} on={p} hot={hot} /></div>;
      })}
      <div style={{ marginLeft: 12, background: C.forest, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 38, borderRadius: 20, padding: "4px 18px 8px", minWidth: 86, textAlign: "center" }}>{n}/6</div>
    </div>
  );
};

/* camera over the ankle diagram: [t, scale, cx, cy] */
type Kf = [number, number, number, number];
const cam = (t: number, ks: Kf[]) => {
  if (t <= ks[0][0]) return ks[0];
  for (let i = 0; i < ks.length - 1; i++) {
    const a = ks[i], b = ks[i + 1];
    if (t <= b[0]) {
      const k = ramp(t, a[0], b[0]);
      return [t, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k, a[3] + (b[3] - a[3]) * k] as Kf;
    }
  }
  return ks[ks.length - 1];
};
const Stage: React.FC<{ t: number; k: Kf; id: string; cyOff?: number; children?: (P: (m: [number, number]) => [number, number]) => React.ReactNode } & Omit<React.ComponentProps<typeof Ankle>, "t" | "w" | "id">> = ({ t, k, id, children, cyOff = 0, ...rest }) => {
  const [, s, cx, cy] = k;
  const u = (860 / 900) * s;
  const X0 = 430 - cx * u, Y0 = 470 + cyOff - cy * u;
  const P = (m: [number, number]) => [X0 + m[0] * u, Y0 + m[1] * u] as [number, number];
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: 860, height: 940, overflow: "hidden", borderRadius: 40, background: C.paper, boxShadow: `0 0 0 5px ${C.line}` }}>
        <div style={{ position: "absolute", left: X0, top: Y0 }}>
          <Ankle t={t} w={860 * s} id={id} {...rest} />
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
        <Pill size={size} bg={bg} color={fg}>{text}</Pill>
      </div>
    </>
  );
};
const Note1918: React.FC<{ t: number; t0: number; text: string; top?: number; left?: number; prefix?: string; size?: number }> = ({ t, t0, text, top = 856, left = 30, prefix = "1918 atlas name:", size = 25 }) => (
  <div style={{ position: "absolute", left, top, opacity: ramp(t, t0, t0 + 0.25), transform: `scale(${0.8 + 0.2 * ramp(t, t0, t0 + 0.25)})`, transformOrigin: "0 0" }}>
    <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 16px 10px", fontFamily: FONT, fontWeight: 800, fontSize: size, color: C.forest, lineHeight: 1.2, boxShadow: "0 6px 0 rgba(31,42,20,0.08)", whiteSpace: "nowrap" }}>
      <span style={{ color: C.matcha }}>{prefix}</span> {text}
    </div>
  </div>
);
const NONE: Partial<Record<K, number>> = {};
const ALL0: Partial<Record<K, number>> = { T: 0, H: 0, V: 0, N: 0, D: 0, P: 0 };

/* 1. Hook: Gray's 1918 Fig. 437 visible from frame 0 + challenge */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={2.45} push={0.02}>
      <div style={center(0, pop(t, -0.4, 0.25))}>
        <Big size={78}>FRONT OF THE ANKLE</Big>
      </div>
      <div style={center(94, pop(t, -0.3, 0.25))}>
        <Big size={104} color={C.red}>NAME ALL 6?</Big>
      </div>
      <PlateBox74 src={PLATE} aspect={A437} x={30} y={240} w={800} h={620} a={-0.6} b={2.45} from={[0.47, 0.62, 1.0]} to={[0.46, 0.64, 0.84]}
        labels={[{ x: 0.47, y: 0.64, text: "6 things cross here", t: 1.55, hot: true, ox: -60, oy: 190 }]} />
      <div style={center(880, pop(t, 0.1, 0.25))}>
        <Pill size={33} bg={C.forest}>anterior ankle · mnemonic</Pill>
      </div>
      <Stamp t0={0.7} text="6 THINGS" size={42} rot={-8} color={C.red} style={{ left: 40, top: 270, whiteSpace: "nowrap" }} />
    </Scene>
  );
};

/* 2. Mnemonic card: Tom Has Very Nice Dancing Pigs, first letters lit on the voice */
export const V2: React.FC = () => {
  const t = useT();
  const at: Record<K, number> = { T: 3.0, H: 3.44, V: 3.62, N: 3.84, D: 4.16, P: 4.57 };
  return (
    <Scene start={2.45} end={5.25} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 820, height: 840, borderRadius: 48, background: C.forest, ...pop(t, 2.47, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 54, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 8, color: C.banana }}>THE MNEMONIC</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 110, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.paper, opacity: ramp(t, 2.6, 2.85) }}>medial → lateral</div>
        <div style={{ position: "absolute", left: 60, width: 700, top: 186, display: "flex", flexDirection: "column", gap: 10 }}>
          {ORDER.map((k) => {
            const p = ramp(t, at[k] - 0.06, at[k] + 0.14);
            const hot = t >= at[k] && t < at[k] + 0.35;
            const w = MN[k].word;
            return (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 26, opacity: 0.25 + 0.75 * p, transform: `translateX(${(1 - p) * 30}px)` }}>
                <LChip k={k} size={80} on={p} hot={hot} />
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 62, color: C.paper, letterSpacing: -1, whiteSpace: "nowrap" }}>
                  <span style={{ color: p > 0.5 ? C.banana : C.paper }}>{w[0]}</span>
                  {w.slice(1)}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 770, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.banana, opacity: ramp(t, 4.85, 5.05) }}>6 words = 6 structures</div>
      </div>
    </Scene>
  );
};

/* 3. T + H on our diagram */
export const V3: React.FC = () => {
  const t = useT();
  const k = cam(t, [[5.25, 0.92, 450, 560], [5.7, 1.5, 380, 440], [7.45, 1.5, 380, 440], [7.95, 1.3, 360, 600], [9.68, 1.3, 350, 640]]);
  const lit: Partial<Record<K, number>> = { T: LT.T, H: LT.H };
  return (
    <Scene start={5.25} end={9.68} push={0.004}>
      <Stage t={t} k={k} id="v3" cyOff={60} lit={lit} hot={t > 5.9 && t < 7.5 ? ["T"] : t > 7.9 && t < 9.6 ? ["H"] : []}>
        {(P) => (
          <>
            <Call t={t} t0={5.8} t1={7.5} a={P([346, 330])} to={[260, 800]} text="tibialis anterior" bg={COL.T} size={40} />
            <Call t={t} t0={7.9} a={P([392, 520])} to={[600, 800]} text="extensor hallucis longus" bg={COL.H} size={34} />
          </>
        )}
      </Stage>
      <Counter t={t} />
      {t >= 8.8 && (
        <div style={{ position: "absolute", left: 0, width: 860, top: 100, display: "flex", justifyContent: "center", ...pop(t, 8.9, 0.25) }}>
          <Pill size={34} bg={C.banana} color={C.forest}>hallux = big toe</Pill>
        </div>
      )}
      <div style={{ position: "absolute", left: 24, top: 880, ...pop(t, 5.5, 0.25), transformOrigin: "0 0" }}>
        <Pill size={27} bg={C.forest}>right ankle, front view · big toe on the left</Pill>
      </div>
    </Scene>
  );
};

/* 4. V + N: vessels and nerve between EHL and EDL */
export const V4: React.FC = () => {
  const t = useT();
  const k = cam(t, [[9.68, 1.3, 350, 640], [10.15, 1.9, 470, 420], [13.4, 1.95, 476, 430]]);
  const lit: Partial<Record<K, number>> = { T: 0, H: 0, V: LT.V, N: LT.N };
  return (
    <Scene start={9.68} end={13.4} push={0.004}>
      <Stage t={t} k={k} id="v4" cyOff={50} lit={lit} hot={t > 10.4 && t < 12.1 ? ["V"] : t > 12.4 && t < 13.4 ? ["N"] : []} nums>
        {(P) => (
          <>
            <Call t={t} t0={10.45} t1={12.15} a={P([463, 470])} to={[250, 790]} text="anterior tibial artery + veins" bg={COL.V} size={34} />
            <Call t={t} t0={12.4} a={P([494, 480])} to={[600, 790]} text="deep fibular nerve" bg={COL.N} fg={C.forest} size={38} />
          </>
        )}
      </Stage>
      <Counter t={t} />
      {t >= 12.85 && (
        <Note1918 t={t} t0={12.9} prefix="old name:" text="deep peroneal nerve" top={880} left={230} size={27} />
      )}
    </Scene>
  );
};

/* 5. D: extensor digitorum longus splits to 4 toes */
export const V5: React.FC = () => {
  const t = useT();
  const k = cam(t, [[13.4, 1.95, 476, 430], [13.85, 1.1, 500, 660], [15.75, 1.12, 500, 690]]);
  const lit: Partial<Record<K, number>> = { T: 0, H: 0, V: 0, N: 0, D: LT.D };
  return (
    <Scene start={13.4} end={15.75} push={0.004}>
      <Stage t={t} k={k} id="v5" cyOff={60} lit={lit} hot={t > 14.2 && t < 15.75 ? ["D"] : []}>
        {(P) => <Call t={t} t0={14.15} a={P([548, 520])} to={[620, 150]} text="extensor digitorum longus" bg={COL.D} size={33} />}
      </Stage>
      <Counter t={t} />
      {t >= 14.85 && (
        <div style={{ position: "absolute", left: 0, width: 860, top: 860, display: "flex", justifyContent: "center", ...pop(t, 14.9, 0.25) }}>
          <Pill size={36} bg={C.forest}>digitorum = toes · splits into 4</Pill>
        </div>
      )}
    </Scene>
  );
};

/* 6. P on Gray's Fig. 437 with MODERN labels (left leg: medial on the right) */
export const V6: React.FC = () => {
  const t = useT();
  return (
    <Scene start={15.75} end={17.45} push={0.01}>
      <PlateBox74 src={PLATE} aspect={A437} x={30} y={100} w={800} h={740} a={15.75} b={17.45} from={[0.44, 0.585, 0.9]} to={[0.44, 0.6, 0.82]} ls={28}
        labels={[
          { x: 0.29, y: 0.575, text: "peroneus tertius", t: 16.1, hot: true, ox: 30, oy: 250 },
          { x: 0.42, y: 0.56, text: "ext. hallucis longus", t: 15.85, ox: 40, oy: -60 },
          { x: 0.53, y: 0.585, text: "tibialis anterior", t: 15.9, ox: 40, oy: 40 },
        ]} />
      <Counter t={t} />
      <Note1918 t={t} t0={16.55} text="“cruciate crural ligament” = inferior extensor retinaculum" top={862} left={0} size={22} />
      <Stamp t0={16.75} text="= 6" size={70} rot={-7} color={C.red} style={{ left: 620, top: 690, whiteSpace: "nowrap" }} />
    </Scene>
  );
};

/* 7. Quick test */
export const V7: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[20.05, 3], [20.69, 2], [21.32, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < 21.95) { n = v; n0 = s; } });
  const opts = ["tibialis anterior", "anterior tibial artery", "deep fibular nerve"];
  return (
    <Scene start={17.45} end={21.95}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 820, height: 850, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 17.5, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 108, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 56, lineHeight: 1.12, color: C.paper, ...pop(t, 18.25) }}>
          Which one becomes your <span style={{ color: C.banana }}>FOOT PULSE?</span>
        </div>
        {/* mini foot with a pulsing dot */}
        <div style={{ position: "absolute", left: 40, top: 270, width: 340, height: 420, borderRadius: 30, background: C.paper, overflow: "hidden", ...pop(t, 18.8, 0.3) }}>
          <div style={{ position: "absolute", left: 340 / 2 - ANCHOR.DP[0] * 0.62, top: 210 - ANCHOR.DP[1] * 0.62 }}>
            <Ankle t={t} w={900 * 0.62} id="v7" lit={ALL0} pulse={ramp(t, 19.0, 19.3)} />
          </div>
          <div style={{ position: "absolute", left: 18, top: 16, background: C.forest, color: C.banana, fontFamily: FONT, fontWeight: 800, fontSize: 30, borderRadius: 14, padding: "2px 12px 6px", opacity: ramp(t, 19.2, 19.4) }}>?</div>
        </div>
        <div style={{ position: "absolute", left: 410, width: 380, top: 300, display: "flex", flexDirection: "column", gap: 34 }}>
          {opts.map((o, i) => (
            <div key={o} style={{ ...pop(t, 19.1 + i * 0.15), display: "flex", alignItems: "center", gap: 14, transformOrigin: "0 50%" }}>
              <div style={{ width: 58, height: 58, flex: "0 0 58px", borderRadius: 16, background: C.banana, color: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, border: `4px solid ${C.paper}` }}>{"ABC"[i]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.paper, lineHeight: 1.1 }}>{o}</div>
            </div>
          ))}
        </div>
        {n !== null && (
          <div key={n} style={{ position: "absolute", left: 520, top: 640, width: 200, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 150, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 8. Answer: anterior tibial artery → dorsalis pedis (diagram, then Gray's Fig. 553) */
export const V8: React.FC = () => {
  const t = useT();
  const k = cam(t, [[21.95, 1.3, 430, 600], [22.4, 1.55, 430, 600], [23.65, 1.6, 420, 610]]);
  const plate = t >= 23.65;
  return (
    <Scene start={21.95} end={25.5} push={0.006}>
      {!plate && (
        <Stage t={t} k={k} id="v8" cyOff={70} lit={{ V: 21.95 }} hot={["V"]} dp={ramp(t, 22.2, 22.5)} pulse={ramp(t, 22.3, 22.6)}>
          {(P) => <Call t={t} t0={22.35} a={P([462, 440])} to={[600, 210]} text="anterior tibial artery" bg={COL.V} size={36} />}
        </Stage>
      )}
      {plate && (
        <PlateBox74 src={PLATE2} aspect={A553} x={30} y={110} w={800} h={730} a={23.65} b={25.5} from={[0.5, 0.69, 0.5]} to={[0.5, 0.71, 0.45]} ls={28}
          labels={[
            { x: 0.47, y: 0.66, text: "anterior tibial artery", t: 23.7, ox: 30, oy: -150 },
            { x: 0.448, y: 0.64, text: "deep fibular n.", t: 23.95, ox: -40, oy: -40 },
            { x: 0.51, y: 0.75, text: "dorsalis pedis", t: 24.35, hot: true, ox: 60, oy: -40 },
          ]} />
      )}
      <div style={center(0, pop(t, 21.98, 0.25))}>
        <Pill size={44} bg={C.matcha}>B ✓ anterior tibial artery</Pill>
      </div>
      {plate && <Note1918 t={t} t0={24.7} prefix="1918 plate:" text="“deep peroneal nerve” = deep fibular nerve" top={858} left={40} size={24} />}
    </Scene>
  );
};

/* 9. Save + cheat sheet */
export const V9: React.FC = () => {
  const t = useT();
  const s0 = 25.5;
  const b = ramp(t, s0 + 0.05, s0 + 0.4);
  return (
    <Scene start={s0} end={27.6}>
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
        <div style={{ position: "absolute", left: 36, top: 26, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.matcha, letterSpacing: 2 }}>FRONT OF ANKLE · MEDIAL → LATERAL</div>
        {ORDER.map((k, i) => (
          <div key={k} style={{ position: "absolute", left: 36, top: 84 + i * 100, display: "flex", alignItems: "center", gap: 20, opacity: ramp(t, s0 + 0.3 + i * 0.08, s0 + 0.55 + i * 0.08) }}>
            <LChip k={k} size={76} />
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.forest, whiteSpace: "nowrap", lineHeight: 1.05 }}>{MN[k].name}</div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 25, color: C.matcha, whiteSpace: "nowrap", marginTop: 3 }}>{MN[k].short}</div>
            </div>
          </div>
        ))}
      </div>
    </Scene>
  );
};

/* 10. End card (≤ 1.5 s) */
export const V10: React.FC = () => {
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
