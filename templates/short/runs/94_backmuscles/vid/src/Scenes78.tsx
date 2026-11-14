import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, pop } from "./Scenes67";
import { PlateBox74 } from "./Scenes74";
import { ANCHOR, COL, K, LET, MCOL, ORDER, Willis } from "./Willis78";

export const A516 = 1596 / 1805;
export const A519 = 931 / 987;
export const PLATE = "plates/fig516_brainbase.png";
export const PLATE2 = "plates/fig519_circle.png";
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* voice times (words.json): the artery name of each mnemonic word */
export const LT: Record<K, number> = { AC: 5.4, AN: 7.13, IC: 8.51, PC: 9.96, PO: 11.72 };
export const MN: Record<K, { word: string; name: string; short: string }> = {
  AC: { word: "All", name: "Anterior communicating", short: "the only single one · joins the 2 ACAs" },
  AN: { word: "Ants", name: "Anterior cerebral ×2", short: "front of the ring" },
  IC: { word: "In", name: "Internal carotid ×2", short: "brings blood up from the neck" },
  PC: { word: "Pink", name: "Posterior communicating ×2", short: "carotid ↔ posterior cerebral" },
  PO: { word: "Pants", name: "Posterior cerebral ×2", short: "end branches of the basilar" },
};
export const LChip: React.FC<{ k: K; size?: number; on?: number; hot?: boolean }> = ({ k, size = 64, on = 1, hot }) => (
  <div style={{ width: size, height: size, flex: `0 0 ${size}px`, borderRadius: size * 0.28, background: on > 0.5 ? COL[k] : "rgba(31,42,20,0.08)", border: `4px solid ${on > 0.5 ? C.forest : "rgba(31,42,20,0.25)"}`, color: on > 0.5 ? C.paper : "rgba(31,42,20,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.6, transform: `scale(${hot ? 1.16 : 1})`, boxShadow: hot ? `0 0 0 6px ${C.banana}` : "none" }}>
    {LET[k]}
  </div>
);

/* running strip: A A I P P + n/5 */
const Counter: React.FC<{ t: number; top?: number }> = ({ t, top = 10 }) => {
  const n = ORDER.filter((k) => t >= LT[k]).length;
  return (
    <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}>
      {ORDER.map((k) => {
        const p = ramp(t, LT[k], LT[k] + 0.2);
        const hot = t >= LT[k] && t < LT[k] + 1.2;
        return <div key={k} style={{ transform: `scale(${1 + 0.25 * p * (1 - ramp(t, LT[k] + 0.2, LT[k] + 0.5))})` }}><LChip k={k} size={66} on={p} hot={hot} /></div>;
      })}
      <div style={{ marginLeft: 12, background: C.forest, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 38, borderRadius: 20, padding: "4px 18px 8px", minWidth: 86, textAlign: "center" }}>{n}/5</div>
    </div>
  );
};

/* camera over the diagram: [t, scale, cx, cy] */
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
const Stage: React.FC<{ t: number; k: Kf; id: string; cyOff?: number; h?: number; children?: (P: (m: [number, number]) => [number, number]) => React.ReactNode } & Omit<React.ComponentProps<typeof Willis>, "t" | "w" | "id">> = ({ t, k, id, children, cyOff = 0, h = 940, ...rest }) => {
  const [, s, cx, cy] = k;
  const u = (860 / 900) * s;
  const X0 = 430 - cx * u, Y0 = 470 + cyOff - cy * u;
  const P = (m: [number, number]) => [X0 + m[0] * u, Y0 + m[1] * u] as [number, number];
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: 860, height: h, overflow: "hidden", borderRadius: 40, background: C.paper, boxShadow: `0 0 0 5px ${C.line}` }}>
        <div style={{ position: "absolute", left: X0, top: Y0 }}>
          <Willis t={t} w={860 * s} id={id} {...rest} />
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
const ALL0: Partial<Record<K, number>> = { AC: 0, AN: 0, IC: 0, PC: 0, PO: 0 };
const Tip: React.FC<{ t: number; t0: number; top: number; children: React.ReactNode; bg?: string; fg?: string; size?: number; t1?: number }> = ({ t, t0, top, children, bg = C.banana, fg = C.forest, size = 34, t1 }) =>
  t >= t0 - 0.05 && (!t1 || t < t1 + 0.2) ? (
    <div style={{ ...center(top), ...pop(t, t0, 0.25), opacity: ramp(t, t0, t0 + 0.2) * (t1 ? 1 - ramp(t, t1, t1 + 0.2) : 1) }}>
      <Pill size={size} bg={bg} color={fg}>{children}</Pill>
    </div>
  ) : null;

/* 1. Hook: Gray's 1918 Fig. 516 visible from frame 0 + challenge */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={2.7} push={0.02}>
      <div style={center(22, pop(t, -0.4, 0.25))}>
        <Big size={86}>CIRCLE OF WILLIS</Big>
      </div>
      <div style={center(118, pop(t, -0.3, 0.25))}>
        <Big size={108} color={C.red}>NAME ALL 5?</Big>
      </div>
      <PlateBox74 src={PLATE} aspect={A516} x={30} y={258} w={800} h={604} a={-0.6} b={2.7} from={[0.49, 0.43, 0.95]} to={[0.49, 0.42, 0.5]}
        labels={[{ x: 0.49, y: 0.41, text: "the ring", t: 1.55, hot: true, ox: 150, oy: -130 }]} />
      <div style={center(880, pop(t, 0.1, 0.25))}>
        <Pill size={33} bg={C.forest}>brain arteries · mnemonic</Pill>
      </div>
      <Stamp t0={0.7} text="5 ARTERIES" size={40} rot={-8} color={C.red} style={{ left: 40, top: 270, whiteSpace: "nowrap" }} />
    </Scene>
  );
};

/* 2. Mnemonic card: All Ants In Pink Pants */
export const V2: React.FC = () => {
  const t = useT();
  const at: Record<K, number> = { AC: 3.52, AN: 3.73, IC: 3.97, PC: 4.08, PO: 4.33 };
  return (
    <Scene start={2.7} end={5.0} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 820, height: 840, borderRadius: 48, background: C.forest, ...pop(t, 2.72, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 54, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 8, color: C.banana }}>THE MNEMONIC</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 110, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.paper, opacity: ramp(t, 2.8, 3.05) }}>front → back</div>
        <div style={{ position: "absolute", left: 90, width: 660, top: 200, display: "flex", flexDirection: "column", gap: 16 }}>
          {ORDER.map((k) => {
            const p = ramp(t, at[k] - 0.06, at[k] + 0.12);
            const hot = t >= at[k] && t < at[k] + 0.3;
            const w = MN[k].word;
            return (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 30, opacity: 0.25 + 0.75 * p, transform: `translateX(${(1 - p) * 30}px)` }}>
                <LChip k={k} size={92} on={p} hot={hot} />
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 78, color: C.paper, letterSpacing: -1, whiteSpace: "nowrap" }}>
                  <span style={{ color: p > 0.5 ? C.banana : C.paper }}>{w[0]}</span>
                  {w.slice(1)}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 770, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.banana, opacity: ramp(t, 4.55, 4.75) }}>5 words = 5 arteries</div>
      </div>
    </Scene>
  );
};

/* 3. A + A on our diagram: anterior communicating, anterior cerebral */
export const V3: React.FC = () => {
  const t = useT();
  const k = cam(t, [[5.0, 0.8, 450, 520], [5.35, 1.75, 450, 380], [6.8, 1.75, 450, 380], [7.1, 1.45, 450, 330]]);
  return (
    <Scene start={5.0} end={8.2} push={0.004}>
      <Stage t={t} k={k} id="v3" cyOff={60} lit={{ AC: LT.AC, AN: LT.AN }} hot={t > 5.5 && t < 6.9 ? ["AC"] : t > 7.15 ? ["AN"] : []}>
        {(P) => (
          <>
            <Call t={t} t0={5.5} t1={6.85} a={P(ANCHOR.AC)} to={[430, 820]} text="anterior communicating" bg={COL.AC} size={40} />
            <Call t={t} t0={7.2} a={P(ANCHOR.ANR)} to={[600, 810]} text="anterior cerebral" bg={COL.AN} size={38} />
            {t > 7.2 && <Call t={t} t0={7.3} a={P(ANCHOR.ANL)} to={[600, 810]} text="anterior cerebral" bg={COL.AN} size={38} />}
          </>
        )}
      </Stage>
      <Counter t={t} />
      <Tip t={t} t0={5.95} t1={6.85} top={100}>the only single one</Tip>
      <Tip t={t} t0={7.55} top={100}>×2 · left + right</Tip>
      <div style={{ position: "absolute", left: 24, top: 880, ...pop(t, 5.3, 0.25), transformOrigin: "0 0" }}>
        <Pill size={27} bg={C.forest}>base of the brain, seen from below · front = top</Pill>
      </div>
    </Scene>
  );
};

/* 4. I + P: internal carotid, posterior communicating */
export const V4: React.FC = () => {
  const t = useT();
  const k = cam(t, [[8.2, 1.45, 450, 330], [8.55, 1.6, 450, 480], [9.8, 1.6, 450, 480], [10.15, 1.6, 450, 540], [11.3, 1.55, 450, 540]]);
  return (
    <Scene start={8.2} end={11.3} push={0.004}>
      <Stage t={t} k={k} id="v4" cyOff={50} lit={{ AC: 0, AN: 0, IC: LT.IC, PC: LT.PC }} hot={t > 8.5 && t < 9.9 ? ["IC"] : t > 10.0 ? ["PC"] : []}>
        {(P) => (
          <>
            <Call t={t} t0={8.6} t1={9.85} a={P(ANCHOR.ICL)} to={[250, 810]} text="internal carotid" bg={COL.IC} size={40} />
            <Call t={t} t0={8.7} t1={9.85} a={P(ANCHOR.ICR)} to={[250, 810]} text="internal carotid" bg={COL.IC} size={40} />
            <Call t={t} t0={10.05} a={P(ANCHOR.PCR)} to={[560, 820]} text="posterior communicating" bg={COL.PC} size={36} />
            {t > 10.1 && <Call t={t} t0={10.15} a={P(ANCHOR.PCL)} to={[560, 820]} text="posterior communicating" bg={COL.PC} size={36} />}
          </>
        )}
      </Stage>
      <Counter t={t} />
      <Tip t={t} t0={9.0} t1={9.85} top={100}>cut ends · it comes up from the neck</Tip>
      <Tip t={t} t0={10.6} top={100}>links front ↔ back</Tip>
    </Scene>
  );
};

/* 5. P: posterior cerebral on Gray's Fig. 519 with MODERN labels */
export const V5: React.FC = () => {
  const t = useT();
  return (
    <Scene start={11.3} end={13.05} push={0.01}>
      <PlateBox74 src={PLATE2} aspect={A519} x={30} y={100} w={800} h={740} a={11.3} b={13.05} from={[0.44, 0.43, 1.14]} to={[0.44, 0.44, 1.06]} ls={28}
        labels={[
          { x: 0.21, y: 0.6, text: "posterior cerebral", t: 11.75, hot: true, ox: 60, oy: 130 },
          { x: 0.45, y: 0.135, text: "anterior communicating", t: 11.45, ox: 40, oy: 95 },
          { x: 0.245, y: 0.305, text: "internal carotid", t: 11.55, ox: 40, oy: 100 },
          { x: 0.6, y: 0.43, text: "post. communicating", t: 11.65, ox: -40, oy: 70 },
        ]} />
      <Counter t={t} />
      <Note1918 t={t} t0={12.2} text="“Arterial circle” = cerebral arterial circle (of Willis)" top={862} left={0} size={23} />
    </Scene>
  );
};

/* 6. 5 names, 9 vessels, 1 ring */
export const V6: React.FC = () => {
  const t = useT();
  const k = cam(t, [[13.05, 1.0, 450, 520], [13.4, 1.15, 450, 500], [15.2, 1.2, 450, 500]]);
  const lit = { AC: 0, AN: 0, IC: 0, PC: 0, PO: 0 };
  return (
    <Scene start={13.05} end={15.2} push={0.004}>
      <Stage t={t} k={k} id="v6" cyOff={40} lit={lit} nums={ramp(t, 13.65, 14.45)} flow={ramp(t, 14.4, 14.8)} />
      <div style={{ position: "absolute", left: 0, width: 860, top: 14, display: "flex", justifyContent: "center", gap: 14 }}>
        {[["5", "names", 13.1], ["9", "vessels", 13.73], ["1", "ring", 14.46]].map(([n, w, t0]) => (
          <div key={w as string} style={{ ...pop(t, t0 as number, 0.25), background: C.forest, borderRadius: 24, padding: "6px 22px 10px", display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64, color: C.banana }}>{n}</span>
            <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.paper }}>{w}</span>
          </div>
        ))}
      </div>
      <Tip t={t} t0={14.6} top={866} size={30} bg={C.forest} fg={C.paper}>joins carotid + vertebral blood supply</Tip>
    </Scene>
  );
};

/* 7. Quick test */
export const V7: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[18.57, 3], [19.2, 2], [19.84, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < 20.45) { n = v; n0 = s; } });
  return (
    <Scene start={15.2} end={20.45}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 820, height: 850, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 15.25, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 108, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 54, lineHeight: 1.12, color: C.paper, ...pop(t, 16.1) }}>
          Is the <span style={{ color: "#B9D27A" }}>MIDDLE CEREBRAL</span> part of the ring?
        </div>
        <div style={{ position: "absolute", left: 40, top: 300, width: 470, height: 500, borderRadius: 30, background: C.paper, overflow: "hidden", ...pop(t, 16.5, 0.3) }}>
          <div style={{ position: "absolute", left: 235 - 450 * 0.62, top: 250 - 470 * 0.62 }}>
            <Willis t={t} w={900 * 0.62} id="v7" lit={ALL0} mc={ramp(t, 16.6, 16.9)} />
          </div>
          <div style={{ position: "absolute", left: 18, top: 16, background: C.forest, color: C.banana, fontFamily: FONT, fontWeight: 800, fontSize: 30, borderRadius: 14, padding: "2px 12px 6px", opacity: ramp(t, 16.9, 17.1) }}>green = ?</div>
        </div>
        <div style={{ position: "absolute", left: 540, width: 250, top: 330, display: "flex", flexDirection: "column", gap: 30 }}>
          {["YES", "NO"].map((o, i) => (
            <div key={o} style={{ ...pop(t, 17.5 + i * 0.18), display: "flex", alignItems: "center", gap: 14, transformOrigin: "0 50%" }}>
              <div style={{ width: 62, height: 62, flex: "0 0 62px", borderRadius: 16, background: C.banana, color: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, border: `4px solid ${C.paper}` }}>{"AB"[i]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 48, color: C.paper }}>{o}</div>
            </div>
          ))}
        </div>
        {n !== null && (
          <div key={n} style={{ position: "absolute", left: 560, top: 560, width: 200, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 170, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 8. Answer: NO — the middle cerebral branches off, outside the ring (diagram, then Gray's Fig. 516) */
export const V8: React.FC = () => {
  const t = useT();
  const k = cam(t, [[20.45, 1.0, 450, 500], [20.8, 1.3, 400, 480], [21.55, 1.3, 400, 480]]);
  const plate = t >= 21.55;
  return (
    <Scene start={20.45} end={22.6} push={0.006}>
      {!plate && (
        <Stage t={t} k={k} id="v8" cyOff={60} lit={ALL0} mc={ramp(t, 20.5, 20.7)} flow={1}>
          {(P) => <Call t={t} t0={20.95} a={P(ANCHOR.MCL)} to={[250, 800]} text="middle cerebral" bg={MCOL} size={40} />}
        </Stage>
      )}
      {plate && (
        <PlateBox74 src={PLATE} aspect={A516} x={30} y={110} w={800} h={730} a={21.55} b={22.6} from={[0.44, 0.4, 0.42]} to={[0.44, 0.4, 0.38]} ls={30}
          labels={[
            { x: 0.37, y: 0.372, text: "middle cerebral", t: 21.6, hot: true, ox: 40, oy: 190 },
            { x: 0.434, y: 0.41, text: "internal carotid", t: 21.75, ox: 80, oy: 230 },
          ]} />
      )}
      <div style={center(24, pop(t, 20.5, 0.25))}>
        <Pill size={44} bg={C.red}>B ✓ NO · it leaves the ring</Pill>
      </div>
      <Tip t={t} t0={21.2} top={870} size={29} bg={C.forest} fg={C.paper}>a branch of the internal carotid → side of the brain</Tip>
    </Scene>
  );
};

/* 9. Save + cheat sheet */
export const V9: React.FC = () => {
  const t = useT();
  const s0 = 22.6;
  const b = ramp(t, s0 + 0.05, s0 + 0.4);
  return (
    <Scene start={s0} end={24.9}>
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
        <div style={{ position: "absolute", left: 36, top: 26, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.matcha, letterSpacing: 2 }}>CIRCLE OF WILLIS · FRONT → BACK</div>
        {ORDER.map((k, i) => (
          <div key={k} style={{ position: "absolute", left: 36, top: 86 + i * 106, display: "flex", alignItems: "center", gap: 20, opacity: ramp(t, s0 + 0.3 + i * 0.08, s0 + 0.55 + i * 0.08) }}>
            <LChip k={k} size={78} />
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.forest, whiteSpace: "nowrap", lineHeight: 1.05 }}>{MN[k].name}</div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 25, color: C.matcha, whiteSpace: "nowrap", marginTop: 3 }}>{MN[k].short}</div>
            </div>
          </div>
        ))}
        <div style={{ position: "absolute", left: 36, top: 628, fontFamily: FONT, fontWeight: 800, fontSize: 27, color: C.forest, opacity: ramp(t, s0 + 0.8, s0 + 1.0) }}>
          <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px" }}>NOT in the ring</span> middle cerebral · basilar
        </div>
      </div>
    </Scene>
  );
};

/* 10. End card (≤ 1.5 s) */
export const V10: React.FC = () => {
  const t = useT();
  const s0 = 24.9;
  return (
    <Scene start={s0} end={26.2}>
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
