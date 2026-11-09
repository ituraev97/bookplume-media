import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, pop } from "./Scenes67";
import { PlateBox74 } from "./Scenes74";
import { ANCHOR, Q, QCOL, Quad } from "./Quad76";

export const A430 = 850 / 3225;
export const PLATE = "plates/fig430_thigh.png";
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* voice times (words.json) */
export const LT: Record<Q, number> = { RF: 7.62, VL: 9.3, VM: 11.14, VI: 13.21 };
export const ORDER: Q[] = ["RF", "VL", "VM", "VI"];
export const MUS: Record<Q, { name: string; where: string; l: string }> = {
  RF: { name: "rectus femoris", where: "down the middle · crosses the hip", l: "R" },
  VL: { name: "vastus lateralis", where: "outside (lateral)", l: "V" },
  VM: { name: "vastus medialis", where: "inside (medial) · 'teardrop'", l: "V" },
  VI: { name: "vastus intermedius", where: "hidden underneath rectus", l: "V" },
};

export const QChip: React.FC<{ q: Q; size?: number; on?: number; hot?: boolean; text?: string }> = ({ q, size = 64, on = 1, hot, text }) => (
  <div style={{ width: size, height: size, flex: `0 0 ${size}px`, borderRadius: size * 0.28, background: on > 0.5 ? QCOL[q] : "rgba(31,42,20,0.08)", border: `4px solid ${on > 0.5 ? C.forest : "rgba(31,42,20,0.25)"}`, color: on > 0.5 ? C.paper : "rgba(31,42,20,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.58, transform: `scale(${hot ? 1.16 : 1})`, boxShadow: hot ? `0 0 0 6px ${C.banana}` : "none" }}>
    {text ?? MUS[q].l}
  </div>
);

/* running counter: 4 chips + N/4 */
const Counter: React.FC<{ t: number; top?: number }> = ({ t, top = 14 }) => {
  const n = ORDER.filter((k) => t >= LT[k]).length;
  return (
    <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", alignItems: "center", gap: 12 }}>
      {ORDER.map((k) => {
        const p = ramp(t, LT[k], LT[k] + 0.2);
        return (
          <div key={k} style={{ transform: `scale(${1 + 0.3 * p * (1 - ramp(t, LT[k] + 0.2, LT[k] + 0.5))})` }}>
            <QChip q={k} size={58} on={p} />
          </div>
        );
      })}
      <div style={{ marginLeft: 12, background: C.forest, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 38, borderRadius: 20, padding: "4px 18px 8px", minWidth: 90, textAlign: "center" }}>{n}/4</div>
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
      return [t, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k, a[3] + (b[3] - a[3]) * k] as Kf;
    }
  }
  return ks[ks.length - 1];
};
const Stage: React.FC<{ t: number; k: Kf; id: string; cyOff?: number; children?: (P: (m: [number, number]) => [number, number]) => React.ReactNode } & Omit<React.ComponentProps<typeof Quad>, "t" | "w" | "id">> = ({ t, k, id, children, cyOff = 0, ...rest }) => {
  const [, s, cx, cy] = k;
  const u = s;
  const X0 = 430 - cx * u, Y0 = 470 + cyOff - cy * u;
  const P = (m: [number, number]) => [X0 + m[0] * u, Y0 + m[1] * u] as [number, number];
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: 860, height: 940, overflow: "hidden", borderRadius: 40 }}>
        <div style={{ position: "absolute", left: X0, top: Y0 }}>
          <Quad t={t} w={860 * s} id={id} {...rest} />
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

/* 1. Hook: Gray's 1918 Fig. 430 (knee) visible from frame 0 + challenge */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={2.55} push={0.02}>
      <div style={center(40, pop(t, -0.4, 0.25))}>
        <Big size={110}>YOUR KNEECAP</Big>
      </div>
      <div style={center(156, pop(t, -0.3, 0.25))}>
        <Big size={66} color={C.red}>GROWS INSIDE A TENDON</Big>
      </div>
      <PlateBox74 src={PLATE} aspect={A430} x={30} y={250} w={800} h={620} a={-0.6} b={2.55} from={[0.5, 0.86, 1.25]} to={[0.5, 0.855, 1.0]} ls={34}
        labels={[
          { x: 0.53, y: 0.876, text: "patella (kneecap)", t: 0.75, hot: true, ox: -60, oy: 150 },
          { x: 0.5, y: 0.832, text: "quadriceps tendon", t: 1.6, ox: -30, oy: -150 },
        ]} />
      <div style={center(890, pop(t, 0.15, 0.25))}>
        <Pill size={33} bg={C.forest}>patella + quadriceps · mnemonic</Pill>
      </div>
      <Stamp t0={1.95} text="SESAMOID BONE" size={40} rot={-8} color={C.red} style={{ left: 450, top: 600, whiteSpace: "nowrap" }} />
    </Scene>
  );
};

/* 2. 4 muscles pull on that tendon: diagram, muscles unlit with "?" */
export const V2: React.FC = () => {
  const t = useT();
  const k = cam(t, [[2.55, 1.0, 440, 470], [5.31, 0.98, 440, 480]]);
  const qs: [Q, number][] = [["RF", 2.9], ["VL", 3.1], ["VM", 3.3], ["VI", 3.5]];
  return (
    <Scene start={2.55} end={5.31} push={0.01}>
      <Stage t={t} k={k} id="v2" cyOff={20} tendon={ramp(t, 3.6, 3.9)} pat={ramp(t, 2.6, 2.9)}>
        {(P) => (
          <>
            {qs.map(([q, t0]) => {
              const [x, y] = P(ANCHOR[q === "VI" ? "VI" : q]);
              const yy = q === "VI" ? y + 40 : q === "RF" ? y - 60 : y;
              const xx = q === "VI" ? x + 10 : x;
              return (
                <div key={q} style={{ position: "absolute", left: xx, top: yy, transform: "translate(-50%,-50%)", ...pop(t, t0, 0.25) }}>
                  <div style={{ width: 70, height: 70, borderRadius: 35, background: C.forest, color: C.banana, border: `4px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 44 }}>?</div>
                </div>
              );
            })}
            <Call t={t} t0={3.75} a={P(ANCHOR.QT)} to={[690, 760]} text="1 tendon" bg={C.banana} fg={C.forest} size={36} />
          </>
        )}
      </Stage>
      <div style={{ position: "absolute", left: 24, top: 20, ...pop(t, 2.65, 0.25), transformOrigin: "0 0" }}>
        <Pill size={28} bg={C.banana} color={C.forest}>sesamoid = shaped like a sesame seed</Pill>
      </div>
      <Stamp t0={4.45} text="NAME ALL 4?" size={60} rot={-7} color={C.red} style={{ left: 40, top: 820, whiteSpace: "nowrap" }} />
    </Scene>
  );
};

/* 3. The mnemonic card: 1 RECTUS + 3 VASTI */
export const V3: React.FC = () => {
  const t = useT();
  const Hi: React.FC<{ c: string; on: boolean }> = ({ c, on }) => (
    <span style={{ background: on ? C.banana : "transparent", color: on ? C.forest : C.paper, borderRadius: 14, padding: "0 10px 4px" }}>{c}</span>
  );
  return (
    <Scene start={5.31} end={7.62} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 820, height: 850, borderRadius: 48, background: C.forest, ...pop(t, 5.33, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 54, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 8, color: C.banana }}>THE MNEMONIC</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 170, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 112, color: C.paper, lineHeight: 1, ...pop(t, 5.86, 0.22) }}>
          <span style={{ color: C.banana }}>1</span> <Hi c="R" on={t >= 6.12} />ECTUS
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 300, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 70, color: C.banana, opacity: ramp(t, 6.4, 6.55) }}>+</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 400, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 112, color: C.paper, lineHeight: 1, ...pop(t, 6.53, 0.22) }}>
          <span style={{ color: C.banana }}>3</span> <Hi c="V" on={t >= 6.92} />ASTI
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 580, display: "flex", justifyContent: "center", gap: 18 }}>
          {ORDER.map((q, i) => (
            <div key={q} style={pop(t, (i === 0 ? 6.15 : 6.95 + i * 0.08), 0.2)}>
              <QChip q={q} size={104} />
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 740, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.paper, opacity: ramp(t, 7.15, 7.35) }}>
          = <span style={{ color: C.banana }}>QUADRICEPS</span> · quad = 4
        </div>
      </div>
    </Scene>
  );
};

/* 4. The four muscles light up one by one */
export const V4: React.FC = () => {
  const t = useT();
  const k = cam(t, [
    [7.62, 1.0, 440, 480], [8.0, 1.3, 455, 400], [9.1, 1.3, 455, 400],
    [9.5, 1.38, 330, 470], [10.95, 1.38, 330, 470],
    [11.3, 1.38, 540, 560], [12.95, 1.38, 540, 560],
    [13.3, 1.4, 450, 470], [15.0, 1.4, 450, 470], [15.6, 1.05, 440, 480],
  ]);
  const lit: Partial<Record<Q, number>> = { RF: LT.RF, VL: LT.VL, VM: LT.VM, VI: LT.VI };
  const hot: Q[] = t >= 15.0 ? [] : t >= 13.2 ? ["VI"] : t >= 11.1 ? ["VM"] : t >= 9.25 ? ["VL"] : ["RF"];
  return (
    <Scene start={7.62} end={15.6} push={0.004}>
      <Stage t={t} k={k} id="v4" cyOff={40} lit={lit} hot={hot} peel={ramp(t, 13.1, 13.5) * (1 - ramp(t, 15.0, 15.4))}>
        {(P) => (
          <>
            <Call t={t} t0={7.8} t1={9.15} a={P(ANCHOR.RF)} to={[600, 150]} text="rectus femoris" bg={QCOL.RF} size={40} />
            <Call t={t} t0={9.45} t1={10.95} a={P(ANCHOR.VL)} to={[540, 180]} text="vastus lateralis" bg={QCOL.VL} size={40} />
            <Call t={t} t0={11.3} t1={12.95} a={P(ANCHOR.VM)} to={[300, 190]} text="vastus medialis" bg={QCOL.VM} size={40} />
            <Call t={t} t0={13.6} t1={15.0} a={P(ANCHOR.VI)} to={[430, 150]} text="vastus intermedius" bg={QCOL.VI} size={40} />
          </>
        )}
      </Stage>
      <Counter t={t} />
      {/* position words */}
      {[
        [8.45, 9.15, "↓ DOWN THE MIDDLE", 640],
        [10.25, 10.95, "← OUTSIDE (lateral)", 640],
        [12.1, 12.95, "INSIDE (medial) →", 640],
        [14.5, 15.0, "HIDDEN UNDERNEATH", 640],
      ].map(([a, b, txt, top], i) => {
        const p = ramp(t, a as number, (a as number) + 0.2) * (1 - ramp(t, b as number, (b as number) + 0.15));
        if (p <= 0) return null;
        return (
          <div key={i} style={{ position: "absolute", left: 0, width: 860, top: top as number, display: "flex", justifyContent: "center", opacity: p, transform: `scale(${0.8 + 0.2 * p})` }}>
            <Pill size={42} bg={C.banana} color={C.forest}>{txt as string}</Pill>
          </div>
        );
      })}
      {/* Latin crumbs */}
      {[
        [8.0, 9.15, "rectus = straight"],
        [9.6, 10.95, "vastus = vast, huge"],
        [11.45, 12.95, "the 'teardrop' above the knee"],
        [13.7, 15.0, "rectus see-through → the deep one"],
      ].map(([a, b, txt], i) => {
        const p = ramp(t, a as number, (a as number) + 0.2) * (1 - ramp(t, b as number, (b as number) + 0.15));
        if (p <= 0) return null;
        return (
          <div key={i} style={{ position: "absolute", left: 0, width: 860, top: 860, display: "flex", justifyContent: "center", opacity: p }}>
            <Pill size={30} bg={C.forest}>{txt as string}</Pill>
          </div>
        );
      })}
    </Scene>
  );
};

/* 5. Together → the quadriceps: Gray's plate with MODERN labels */
export const V5: React.FC = () => {
  const t = useT();
  return (
    <Scene start={15.6} end={17.95} push={0.01}>
      <div style={center(18, pop(t, 15.62, 0.25))}>
        <Pill size={40} bg={C.forest}>QUADRICEPS → <span style={{ color: C.banana }}>straightens the knee</span></Pill>
      </div>
      <PlateBox74 src={PLATE} aspect={A430} x={30} y={112} w={800} h={730} a={15.6} b={17.95} from={[0.5, 0.69, 2.5]} to={[0.5, 0.72, 2.25]} ls={30}
        labels={[
          { x: 0.40, y: 0.665, text: "rectus\nfemoris", t: 15.72, ox: -150, oy: -70 },
          { x: 0.22, y: 0.73, text: "vastus\nlateralis", t: 15.9, ox: -110, oy: 70 },
          { x: 0.66, y: 0.785, text: "vastus\nmedialis", t: 16.08, ox: 130, oy: -60 },
          { x: 0.5, y: 0.836, text: "quadriceps\ntendon", t: 16.3, ox: 170, oy: 50 },
          { x: 0.5, y: 0.876, text: "patella", t: 16.55, hot: true, ox: -170, oy: 40 },
          { x: 0.54, y: 0.945, text: "patellar\nligament", t: 16.8, ox: 150, oy: -10 },
        ]} />
      <Note1918 t={t} t0={17.05} text="“Lig. patellæ” = patellar ligament" top={852} left={40} />
    </Scene>
  );
};

/* 6. Quick test */
export const V6: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[20.45, 3], [21.09, 2], [21.73, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < 22.42) { n = v; n0 = s; } });
  return (
    <Scene start={17.95} end={22.42}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 820, height: 850, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 18.0, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 50, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 120, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 62, lineHeight: 1.12, color: C.paper, ...pop(t, 18.7) }}>
          Which one <span style={{ color: C.banana }}>ALSO</span> crosses the <span style={{ color: C.banana }}>HIP?</span>
        </div>
        <div style={{ position: "absolute", left: 70, top: 330, display: "flex", flexDirection: "column", gap: 26 }}>
          {ORDER.map((q, i) => (
            <div key={q} style={{ display: "flex", alignItems: "center", gap: 20, ...pop(t, 19.2 + i * 0.12), transformOrigin: "0 50%" }}>
              <div style={{ width: 70, height: 70, borderRadius: 20, background: C.banana, color: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, border: `4px solid ${C.paper}` }}>{"ABCD"[i]}</div>
              <div style={{ width: 22, height: 22, borderRadius: 11, background: QCOL[q], border: `3px solid ${C.paper}` }} />
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper, whiteSpace: "nowrap" }}>{MUS[q].name}</div>
            </div>
          ))}
        </div>
        {n !== null && (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 700, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 130, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 7. Answer: rectus femoris crosses hip + knee */
export const V7: React.FC = () => {
  const t = useT();
  const k = cam(t, [[22.42, 1.0, 440, 470], [23.15, 1.0, 440, 470], [23.6, 1.3, 470, 330], [24.91, 1.32, 470, 330]]);
  return (
    <Scene start={22.42} end={24.91} push={0.006}>
      <Stage t={t} k={k} id="v7" cyOff={60} lit={{ RF: 22.45 }} hot={["RF"]} hip={ramp(t, 22.6, 22.9)} knee={ramp(t, 22.6, 22.9) * (1 - ramp(t, 23.1, 23.3))}>
        {(P) => (
          <>
            <Call t={t} t0={22.65} a={P(ANCHOR.HIP)} to={[700, 250]} text="hip joint ✓" bg={C.banana} fg={C.forest} size={36} />
            <Call t={t} t0={22.65} t1={23.1} a={P(ANCHOR.KNEE)} to={[680, 820]} text="knee joint ✓" bg={C.banana} fg={C.forest} size={36} />
            <Call t={t} t0={23.7} a={P(ANCHOR.AIIS)} to={[200, 250]} text="starts on the hip bone" size={30} />
          </>
        )}
      </Stage>
      <div style={center(0, pop(t, 22.45, 0.25))}>
        <Pill size={46} bg={C.matcha}>A ✓ rectus femoris</Pill>
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 860, display: "flex", justifyContent: "center", ...pop(t, 23.4, 0.25) }}>
        <Pill size={40} bg={C.forest}>flexes the hip <span style={{ color: C.banana }}>+</span> straightens the knee</Pill>
      </div>
    </Scene>
  );
};

/* 8. Save + cheat sheet */
export const V8: React.FC = () => {
  const t = useT();
  const s0 = 24.91;
  const b = ramp(t, s0 + 0.05, s0 + 0.4);
  return (
    <Scene start={s0} end={27.1}>
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
        <div style={{ position: "absolute", left: 40, top: 28, fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.matcha, letterSpacing: 3 }}>QUADRICEPS = 1 RECTUS + 3 VASTI</div>
        {ORDER.map((q, i) => (
          <div key={q} style={{ position: "absolute", left: 40, top: 96 + i * 108, display: "flex", alignItems: "center", gap: 22, opacity: ramp(t, s0 + 0.35 + i * 0.1, s0 + 0.6 + i * 0.1) }}>
            <QChip q={q} size={82} />
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.forest, whiteSpace: "nowrap", lineHeight: 1.05 }}>{MUS[q].name}</div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, color: C.matcha, whiteSpace: "nowrap", marginTop: 4 }}>{MUS[q].where}</div>
            </div>
          </div>
        ))}
        <div style={{ position: "absolute", left: 40, top: 545, width: 700, display: "flex", flexDirection: "column", gap: 10, opacity: ramp(t, s0 + 0.85, s0 + 1.1) }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 29, color: C.forest }}><span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px" }}>patella</span> sesamoid bone in the quadriceps tendon</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 29, color: C.forest }}><span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px" }}>patellar ligament</span> patella → tibial tuberosity</div>
        </div>
      </div>
    </Scene>
  );
};

/* 9. End card (≤ 1.5 s) */
export const V9: React.FC = () => {
  const t = useT();
  const s0 = 27.1;
  return (
    <Scene start={s0} end={28.4}>
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
