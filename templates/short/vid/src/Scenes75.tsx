import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, pop } from "./Scenes67";
import { PlateBox74 } from "./Scenes74";
import { ANCHOR, COUNT, GCOL, K, POS, Tunnel, grp } from "./Tunnel75";

export const A422 = 1944 / 1130;
export const PLATE = "plates/fig422_wrist.png";
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* voice times */
export const LT: Record<K, number> = {
  S3: 4.75, S4: 4.95, S2: 5.15, S5: 5.35,
  P2: 8.23, P3: 8.43, P4: 8.63, P5: 8.83,
  FPL: 11.44, MED: 14.41,
};

/* the 4-4-1-1 chips */
export const GROUPS: { n: string; g: keyof typeof GCOL; name: string; short: string }[] = [
  { n: "4", g: "S", name: "flexor digitorum superficialis", short: "FDS tendons · on top" },
  { n: "4", g: "P", name: "flexor digitorum profundus", short: "FDP tendons · underneath" },
  { n: "1", g: "F", name: "flexor pollicis longus", short: "FPL · thumb tendon" },
  { n: "1", g: "M", name: "median nerve", short: "the only nerve inside" },
];
export const NChip: React.FC<{ n: string; g: keyof typeof GCOL; size?: number; on?: number; hot?: boolean }> = ({ n, g, size = 64, on = 1, hot }) => (
  <div style={{ width: size, height: size, flex: `0 0 ${size}px`, borderRadius: size * 0.28, background: on > 0.5 ? GCOL[g] : "rgba(31,42,20,0.08)", border: `4px solid ${on > 0.5 ? C.forest : "rgba(31,42,20,0.25)"}`, color: on > 0.5 ? (g === "M" ? C.forest : C.paper) : "rgba(31,42,20,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.62, transform: `scale(${hot ? 1.16 : 1})`, boxShadow: hot ? `0 0 0 6px ${C.banana}` : "none" }}>
    {n}
  </div>
);

/* running counter: 10 dots + N/10 */
const Counter: React.FC<{ t: number; top?: number }> = ({ t, top = 14 }) => {
  const n = COUNT.filter((k) => t >= LT[k]).length;
  return (
    <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}>
      {COUNT.map((k, i) => {
        const p = ramp(t, LT[k], LT[k] + 0.2);
        return <div key={k} style={{ width: 34, height: 34, borderRadius: 17, background: p > 0.5 ? GCOL[grp(k)] : "rgba(31,42,20,0.1)", border: `4px solid ${p > 0.5 ? C.forest : "rgba(31,42,20,0.2)"}`, transform: `scale(${1 + 0.35 * p * (1 - ramp(t, LT[k] + 0.2, LT[k] + 0.5))})`, marginRight: i === 3 || i === 7 || i === 8 ? 12 : 0 }} />;
      })}
      <div style={{ marginLeft: 14, background: C.forest, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 38, borderRadius: 20, padding: "4px 18px 8px", minWidth: 96, textAlign: "center" }}>{n}/10</div>
    </div>
  );
};

/* camera over the tunnel diagram: [t, scale, cx, cy] */
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
const Stage: React.FC<{ t: number; k: Kf; id: string; cyOff?: number; children?: (P: (m: [number, number]) => [number, number]) => React.ReactNode } & Omit<React.ComponentProps<typeof Tunnel>, "t" | "w" | "id">> = ({ t, k, id, children, cyOff = 0, ...rest }) => {
  const [, s, cx, cy] = k;
  const u = (860 / 900) * s;
  const X0 = 430 - cx * u, Y0 = 470 + cyOff - cy * u;
  const P = (m: [number, number]) => [X0 + m[0] * u, Y0 + m[1] * u] as [number, number];
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: 860, height: 940, overflow: "hidden", borderRadius: 40 }}>
        <div style={{ position: "absolute", left: X0, top: Y0 }}>
          <Tunnel t={t} w={860 * s} id={id} {...rest} />
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
const Note1918: React.FC<{ t: number; t0: number; text: string; top?: number; left?: number; prefix?: string }> = ({ t, t0, text, top = 856, left = 30, prefix = "1918 atlas name:" }) => (
  <div style={{ position: "absolute", left, top, opacity: ramp(t, t0, t0 + 0.25), transform: `scale(${0.8 + 0.2 * ramp(t, t0, t0 + 0.25)})`, transformOrigin: "0 0" }}>
    <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 16px 10px", fontFamily: FONT, fontWeight: 800, fontSize: 25, color: C.forest, lineHeight: 1.2, boxShadow: "0 6px 0 rgba(31,42,20,0.08)", whiteSpace: "nowrap" }}>
      <span style={{ color: C.matcha }}>{prefix}</span> {text}
    </div>
  </div>
);

/* 1. Hook: Gray's 1918 Fig. 422 visible from frame 0 + challenge */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={2.65} push={0.02}>
      <div style={center(0, pop(t, -0.4, 0.25))}>
        <Big size={104}>CARPAL TUNNEL</Big>
      </div>
      <div style={center(112, pop(t, -0.3, 0.25))}>
        <Big size={88} color={C.red}>NAME ALL 10?</Big>
      </div>
      <PlateBox74 src={PLATE} aspect={A422} x={30} y={240} w={800} h={620} a={-0.6} b={2.65} from={[0.48, 0.46, 0.66]} to={[0.48, 0.45, 0.5]}
        labels={[{ x: 0.5, y: 0.47, text: "carpal tunnel", t: 1.85, hot: true, ox: -60, oy: 170 }]} />
      <div style={center(880, pop(t, 0.1, 0.25))}>
        <Pill size={33} bg={C.forest}>carpal tunnel contents · mnemonic</Pill>
      </div>
      <Stamp t0={0.65} text="10 THINGS" size={42} rot={-8} color={C.red} style={{ left: 54, top: 270, whiteSpace: "nowrap" }} />
    </Scene>
  );
};

/* 2. The mnemonic card: 4 · 4 · 1 · 1 (each number pops on the voice) */
export const V2: React.FC = () => {
  const t = useT();
  const at = [3.07, 3.38, 3.68, 3.95];
  return (
    <Scene start={2.65} end={4.45} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 820, height: 840, borderRadius: 48, background: C.forest, ...pop(t, 2.67, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 54, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 8, color: C.banana }}>THE MNEMONIC</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 110, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper, opacity: ramp(t, 2.75, 3.0) }}>just 4 numbers</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 240, display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
          {GROUPS.map((g, i) => (
            <React.Fragment key={i}>
              <div style={pop(t, at[i] - 0.05, 0.2)}><NChip n={g.n} g={g.g} size={140} hot={t >= at[i] && t < at[i] + 0.3} /></div>
              {i < 3 && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 60, color: C.paper, opacity: ramp(t, at[i] + 0.1, at[i] + 0.2) }}>·</div>}
            </React.Fragment>
          ))}
        </div>
        <div style={{ position: "absolute", left: 70, width: 700, top: 450, display: "flex", flexDirection: "column", gap: 18 }}>
          {GROUPS.map((g, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, opacity: ramp(t, at[i] + 0.05, at[i] + 0.25) }}>
              <div style={{ width: 24, height: 24, borderRadius: 12, background: GCOL[g.g], border: `3px solid ${C.paper}` }} />
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper, whiteSpace: "nowrap" }}><span style={{ color: C.banana }}>{g.n}</span> = ?</div>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 760, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.banana, opacity: ramp(t, 4.05, 4.25) }}>4 + 4 + 1 + 1 = 10</div>
      </div>
    </Scene>
  );
};

/* 3. FDS: 4 tendons on top */
export const V3: React.FC = () => {
  const t = useT();
  const k = cam(t, [[4.45, 1.1, 460, 370], [4.9, 1.7, 478, 352], [7.2, 1.75, 478, 352], [7.6, 1.5, 470, 365], [8.0, 1.5, 470, 365]]);
  const lit: Partial<Record<K, number>> = { S3: LT.S3, S4: LT.S4, S2: LT.S2, S5: LT.S5 };
  return (
    <Scene start={4.45} end={8.0} push={0.004}>
      <Stage t={t} k={k} id="v3" cyOff={70} lit={lit} hot={t > 5.6 && t < 7.2 ? ["S2", "S3", "S4", "S5"] : []} nums>
        {(P) => (
          <>
            <Call t={t} t0={5.7} t1={7.25} a={P([POS.S4[0], POS.S4[1] - 10])} to={[430, 170]} text="flexor digitorum superficialis" bg={GCOL.S} size={33} />
            <Call t={t} t0={7.3} a={P([POS.S3[0], POS.S3[1]])} to={[640, 190]} text="ON TOP ↑" bg={C.banana} fg={C.forest} size={38} />
          </>
        )}
      </Stage>
      <Counter t={t} />
      <div style={{ position: "absolute", left: 24, top: 860, ...pop(t, 4.7, 0.25), transformOrigin: "0 0" }}>
        <Pill size={29} bg={C.banana} color={C.forest}>right wrist cut across · palm up · thumb left</Pill>
      </div>
    </Scene>
  );
};

/* 4. FDP: 4 tendons underneath */
export const V4: React.FC = () => {
  const t = useT();
  const k = cam(t, [[8.0, 1.5, 470, 365], [8.35, 1.75, 482, 400], [10.4, 1.8, 482, 400], [11.15, 1.5, 450, 370]]);
  const lit: Partial<Record<K, number>> = { S3: 0, S4: 0, S2: 0, S5: 0, P2: LT.P2, P3: LT.P3, P4: LT.P4, P5: LT.P5 };
  return (
    <Scene start={8.0} end={11.15} push={0.004}>
      <Stage t={t} k={k} id="v4" cyOff={70} lit={lit} hot={t > 9.0 && t < 10.5 ? ["P2", "P3", "P4", "P5"] : []} nums>
        {(P) => (
          <>
            <Call t={t} t0={9.1} t1={10.45} a={P([POS.P4[0], POS.P4[1] + 12])} to={[430, 780]} text="flexor digitorum profundus" bg={GCOL.P} size={34} />
            <Call t={t} t0={10.5} a={P([POS.P3[0], POS.P3[1] + 10])} to={[640, 760]} text="UNDERNEATH ↓" bg={C.banana} fg={C.forest} size={38} />
          </>
        )}
      </Stage>
      <Counter t={t} />
      <div style={{ position: "absolute", left: 0, width: 860, top: 868, display: "flex", justifyContent: "center", opacity: ramp(t, 9.75, 10.0) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.matcha }}>profundus = deep · superficialis = superficial</div>
      </div>
    </Scene>
  );
};

/* 5. FPL + median nerve → 10 */
export const V5: React.FC = () => {
  const t = useT();
  const k = cam(t, [[11.15, 1.5, 450, 370], [11.5, 1.85, 370, 360], [13.3, 1.9, 370, 360], [13.75, 1.95, 385, 330], [14.9, 2.0, 385, 330], [15.2, 1.4, 470, 365], [15.45, 1.4, 470, 365]]);
  const lit: Partial<Record<K, number>> = { S3: 0, S4: 0, S2: 0, S5: 0, P2: 0, P3: 0, P4: 0, P5: 0, FPL: LT.FPL, MED: LT.MED };
  const hot: K[] = t >= 15.0 ? [] : t >= 14.3 ? ["MED"] : t >= 11.4 && t < 13.5 ? ["FPL"] : [];
  return (
    <Scene start={11.15} end={15.45} push={0.004}>
      <Stage t={t} k={k} id="v5" cyOff={80} lit={lit} hot={hot} nums>
        {(P) => (
          <>
            <Call t={t} t0={11.75} t1={13.4} a={P([POS.FPL[0] - 6, POS.FPL[1] + 10])} to={[300, 790]} text="flexor pollicis longus" bg={GCOL.F} size={36} />
            <Call t={t} t0={14.45} t1={15.05} a={P([POS.MED[0], POS.MED[1] - 6])} to={[300, 190]} text="MEDIAN NERVE" bg={C.banana} fg={C.forest} size={42} />
          </>
        )}
      </Stage>
      <Counter t={t} />
      {t >= 12.6 && t < 13.5 && (
        <div style={{ position: "absolute", left: 0, width: 860, top: 92, display: "flex", justifyContent: "center", ...pop(t, 12.75, 0.25) }}>
          <Pill size={34} bg={C.forest}>pollicis = of the thumb</Pill>
        </div>
      )}
      {t >= 14.6 && t < 15.1 && (
        <div style={{ position: "absolute", left: 0, width: 860, top: 820, display: "flex", justifyContent: "center", ...pop(t, 14.7, 0.2) }}>
          <Pill size={34} bg={C.forest}>the ONLY nerve inside</Pill>
        </div>
      )}
      <Stamp t0={15.0} text="= 10" size={78} rot={-7} color={C.red} style={{ left: 40, top: 140, whiteSpace: "nowrap" }} />
    </Scene>
  );
};

/* 6. Roof + floor on Gray's plate with MODERN labels */
export const V6: React.FC = () => {
  const t = useT();
  return (
    <Scene start={15.45} end={18.65} push={0.01}>
      <div style={center(0, pop(t, 15.5, 0.25))}>
        <div style={{ display: "flex", gap: 16 }}>
          <Pill size={40} bg={t < 17.0 ? C.banana : C.forest} color={t < 17.0 ? C.forest : C.paper}>ROOF</Pill>
          <Pill size={40} bg={t >= 17.0 ? C.banana : C.forest} color={t >= 17.0 ? C.forest : C.paper}>FLOOR</Pill>
        </div>
      </div>
      <PlateBox74 src={PLATE} aspect={A422} x={30} y={110} w={800} h={720} a={15.45} b={18.65} from={[0.46, 0.46, 0.62]} to={[0.46, 0.5, 0.5]} ls={31}
        labels={[
          { x: 0.49, y: 0.345, text: "flexor retinaculum", t: 15.75, hot: true, ox: -60, oy: -150 },
          { x: 0.452, y: 0.388, text: "median n.", t: 16.0, ox: -170, oy: -40 },
          { x: 0.46, y: 0.645, text: "capitate", t: 17.15, hot: true, ox: -40, oy: 110 },
          { x: 0.6, y: 0.62, text: "hamate", t: 17.35, ox: 30, oy: 120 },
          { x: 0.31, y: 0.44, text: "trapezium", t: 17.55, ox: 30, oy: 150 },
        ]} />
      <Note1918 t={t} t0={16.35} prefix="1918 plate label:" text="“transverse carpal ligament” = same thing" top={846} />
    </Scene>
  );
};

/* 7. Quick test */
export const V7: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[21.18, 3], [21.81, 2], [22.46, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < 23.05) { n = v; n0 = s; } });
  return (
    <Scene start={18.65} end={23.05}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 820, height: 850, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 18.7, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 50, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 118, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 60, lineHeight: 1.12, color: C.paper, ...pop(t, 19.5) }}>
          Is the <span style={{ color: C.banana }}>ULNAR NERVE</span> inside?
        </div>
        {/* mini tunnel with ulnar nerve blinking */}
        <div style={{ position: "absolute", left: 120, top: 290, width: 580, height: 330, borderRadius: 30, background: C.paper, overflow: "hidden", ...pop(t, 20.0, 0.3) }}>
          <div style={{ position: "absolute", left: 0, top: -50 }}>
            <Tunnel t={t} w={580} id="v7" lit={{ S3: 0, S4: 0, S2: 0, S5: 0, P2: 0, P3: 0, P4: 0, P5: 0, FPL: 0, MED: 0 }} ulnar={0.5 + 0.5 * Math.sin(t * 6)} />
          </div>
          <div style={{ position: "absolute", left: 430, top: 22, background: C.forest, color: C.banana, fontFamily: FONT, fontWeight: 800, fontSize: 30, borderRadius: 14, padding: "2px 12px 6px", opacity: ramp(t, 20.3, 20.5) }}>?</div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 650, display: "flex", justifyContent: "center", gap: 30 }}>
          {["YES", "NO"].map((o, i) => (
            <div key={o} style={{ ...pop(t, 20.4 + i * 0.15), display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 62, height: 62, borderRadius: 18, background: C.banana, color: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, border: `4px solid ${C.paper}` }}>{"AB"[i]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.paper }}>{o}</div>
            </div>
          ))}
        </div>
        {n !== null && (
          <div key={n} style={{ position: "absolute", left: 640, top: 690, width: 160, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 130, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 8. Answer: NO, ulnar nerve + artery run through Guyon's canal (diagram, then Gray's plate) */
export const V8: React.FC = () => {
  const t = useT();
  const k = cam(t, [[23.05, 1.4, 470, 365], [23.5, 1.7, 610, 330], [25.55, 1.75, 610, 330]]);
  const plate = t >= 24.55;
  return (
    <Scene start={23.05} end={25.55} push={0.006}>
      {!plate && (
        <Stage t={t} k={k} id="v8" cyOff={60} lit={{ S3: 0, S4: 0, S2: 0, S5: 0, P2: 0, P3: 0, P4: 0, P5: 0, FPL: 0, MED: 0 }} ret={0.6} ulnar={ramp(t, 23.6, 23.9)}>
          {(P) => (
            <>
              <Call t={t} t0={23.75} a={P([POS.UN[0], POS.UN[1]])} to={[430, 760]} text="ulnar nerve + artery" bg={C.banana} fg={C.forest} size={34} />
              <Call t={t} t0={24.1} a={P(ANCHOR.RET)} to={[250, 200]} text="tunnel roof" size={32} />
            </>
          )}
        </Stage>
      )}
      {plate && (
        <PlateBox74 src={PLATE} aspect={A422} x={30} y={110} w={800} h={720} a={24.55} b={25.55} from={[0.55, 0.36, 0.42]} to={[0.56, 0.37, 0.38]} ls={31}
          labels={[
            { x: 0.598, y: 0.375, text: "ulnar nerve", t: 24.6, hot: true, ox: 110, oy: 130 },
            { x: 0.585, y: 0.352, text: "ulnar artery", t: 24.75, ox: 90, oy: -120 },
          ]} />
      )}
      <div style={center(0, pop(t, 23.1, 0.25))}>
        <Pill size={44} bg={C.matcha}>B ✓ NO, it's outside</Pill>
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 850, display: "flex", justifyContent: "center", ...pop(t, 24.45, 0.25) }}>
        <Pill size={42} bg={C.forest}>→ Guyon's canal</Pill>
      </div>
    </Scene>
  );
};

/* 9. Save + cheat sheet */
export const V9: React.FC = () => {
  const t = useT();
  const s0 = 25.55;
  const b = ramp(t, s0 + 0.05, s0 + 0.4);
  return (
    <Scene start={s0} end={27.9}>
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
      <div style={{ position: "absolute", left: 40, top: 200, width: 780, height: 690, borderRadius: 40, background: C.card, border: `3px solid ${C.line}`, boxShadow: "0 18px 40px rgba(31,42,20,0.12)", ...pop(t, s0 + 0.15, 0.3) }}>
        <div style={{ position: "absolute", left: 40, top: 28, fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.matcha, letterSpacing: 3 }}>CARPAL TUNNEL = 10</div>
        {GROUPS.map((g, i) => (
          <div key={i} style={{ position: "absolute", left: 40, top: 96 + i * 112, display: "flex", alignItems: "center", gap: 22, opacity: ramp(t, s0 + 0.35 + i * 0.1, s0 + 0.6 + i * 0.1) }}>
            <NChip n={g.n} g={g.g} size={86} />
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.forest, whiteSpace: "nowrap", lineHeight: 1.05 }}>{g.name}</div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, color: C.matcha, whiteSpace: "nowrap", marginTop: 4 }}>{g.short}</div>
            </div>
          </div>
        ))}
        <div style={{ position: "absolute", left: 40, top: 560, width: 700, display: "flex", flexDirection: "column", gap: 8, opacity: ramp(t, s0 + 0.85, s0 + 1.1) }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.forest }}><span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px" }}>roof</span> flexor retinaculum · <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px" }}>floor</span> carpal bones</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.forest }}><span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px" }}>NOT inside</span> ulnar nerve → Guyon's canal</div>
        </div>
      </div>
    </Scene>
  );
};

/* 10. End card (≤ 1.5 s) */
export const V10: React.FC = () => {
  const t = useT();
  const s0 = 27.9;
  return (
    <Scene start={s0} end={29.2}>
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
