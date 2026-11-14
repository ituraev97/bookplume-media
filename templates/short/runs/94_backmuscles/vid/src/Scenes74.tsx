import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Img, staticFile } from "remotion";
import { Big, PlateBox, pop } from "./Scenes67";
import { ANCHOR, Arm, GCOL, GROUP, M } from "./Arm74";

export const A418 = 977 / 2162;
export const A818 = 1190 / 2569;
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

type PL74 = { x: number; y: number; text: string; t: number; hot?: boolean; ox: number; oy: number };
export const PlateBox74: React.FC<{ src: string; aspect: number; x: number; y: number; w: number; h: number; a: number; b: number; from: [number, number, number]; to: [number, number, number]; labels?: PL74[]; ls?: number; credit?: string; still?: boolean }> = ({ src, aspect, x, y, w, h, a, b, from, to, labels = [], ls = 34, credit = "Gray's Anatomy, 1918 · public domain", still }) => {
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
            <div style={{ position: "absolute", left: l.ox, top: l.oy, transform: `translate(${l.ox < 0 ? "-100%" : "0"}, -50%) scale(${0.85 + 0.15 * p})`, transformOrigin: l.ox < 0 ? "100% 50%" : "0% 50%", background: l.hot ? C.banana : C.forest, color: l.hot ? C.forest : C.paper, fontFamily: FONT, fontWeight: 800, fontSize: ls, lineHeight: 1.1, padding: "5px 16px 9px", borderRadius: 14, whiteSpace: "pre", boxShadow: "0 5px 0 rgba(31,42,20,0.18)" }}>{l.text}</div>
          </div>
        );
      })}
      {credit && <div style={{ position: "absolute", right: 16, bottom: 12, fontFamily: FONT, fontWeight: 700, fontSize: 19, color: C.forest, opacity: 0.6, background: "rgba(247,246,236,0.88)", padding: "2px 10px", borderRadius: 8 }}>{credit}</div>}
    </div>
  );
};


type L5 = "B" | "E" | "A" | "S" | "T";
export const LETTERS: L5[] = ["B", "E", "A", "S", "T"];
/* voice times of each letter's muscle name */
export const LT: Record<L5, number> = { B: 4.12, E: 5.57, A: 7.85, S: 9.69, T: 10.7 };
export const NAMES: Record<L5, string> = { B: "Brachioradialis", E: "Extensors (wrist + fingers)", A: "Abductor pollicis longus", S: "Supinator", T: "Triceps" };

/** letter chip */
export const BChip: React.FC<{ l: L5; size?: number; on?: number; hot?: boolean }> = ({ l, size = 64, on = 1, hot }) => (
  <div style={{ width: size, height: size, flex: `0 0 ${size}px`, borderRadius: size * 0.28, background: on > 0.5 ? GCOL[l] : "rgba(31,42,20,0.08)", border: `4px solid ${on > 0.5 ? C.forest : "rgba(31,42,20,0.25)"}`, color: on > 0.5 ? C.paper : "rgba(31,42,20,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.62, transform: `scale(${hot ? 1.16 : 1})`, boxShadow: hot ? `0 0 0 6px ${C.banana}` : "none" }}>
    {l}
  </div>
);
const Strip: React.FC<{ t: number; top?: number }> = ({ t, top = 18 }) => {
  let cur: L5 | null = null;
  LETTERS.forEach((l) => { if (t >= LT[l] - 0.05) cur = l; });
  return (
    <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", gap: 14 }}>
      {LETTERS.map((l) => <BChip key={l} l={l} size={70} on={t >= LT[l] - 0.05 ? 1 : 0} hot={cur === l} />)}
    </div>
  );
};

/* camera over the arm diagram: [t, scale, cx, cy] (cx, cy in viewBox units → put at stage centre) */
type K = [number, number, number, number];
const cam = (t: number, ks: K[]) => {
  if (t <= ks[0][0]) return ks[0];
  for (let i = 0; i < ks.length - 1; i++) {
    const a = ks[i], b = ks[i + 1];
    if (t <= b[0]) {
      const k = ramp(t, a[0], b[0]);
      return [t, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k, a[3] + (b[3] - a[3]) * k] as K;
    }
  }
  return ks[ks.length - 1];
};
const Stage: React.FC<{ t: number; k: K; id: string; cyOff?: number; children?: (P: (m: [number, number]) => [number, number]) => React.ReactNode } & Omit<React.ComponentProps<typeof Arm>, "t" | "w" | "id">> = ({ t, k, id, children, cyOff = 0, ...rest }) => {
  const [, s, cx, cy] = k;
  const X0 = 430 - cx * s, Y0 = 470 + cyOff - cy * s;
  const P = (m: [number, number]) => [X0 + m[0] * s, Y0 + m[1] * s] as [number, number];
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: 860, height: 940, overflow: "hidden", borderRadius: 40 }}>
        <div style={{ position: "absolute", left: X0, top: Y0 }}>
          <Arm t={t} w={800 * s} id={id} {...rest} />
        </div>
      </div>
      {children && children(P)}
    </>
  );
};
/** callout from a diagram point to a pill */
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

/* 1. Hook: Gray's 1918 Fig. 818 (radial nerve, yellow) visible from frame 0 + challenge */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={2.84} push={0.02}>
      <div style={center(0, pop(t, -0.4, 0.25))}>
        <Big size={118}>RADIAL NERVE</Big>
      </div>
      <div style={center(124, pop(t, -0.3, 0.25))}>
        <Big size={70} color={C.red}>NAME ITS MUSCLES?</Big>
      </div>
      <PlateBox src="plates/fig818_radial.png" aspect={A818} x={30} y={225} w={800} h={650} a={-0.6} b={2.84} from={[0.52, 0.45, 1.05]} to={[0.54, 0.46, 0.88]}
        labels={[
          { x: 0.575, y: 0.43, text: "radial nerve", t: 1.3, hot: true, ox: 150, oy: -110 },
        ]} />
      <div style={center(892, pop(t, 0.1, 0.25))}>
        <Pill size={33} bg={C.forest}>radial nerve muscles · mnemonic</Pill>
      </div>
      <Stamp t0={0.6} text="5 LETTERS" size={42} rot={-8} color={C.red} style={{ left: 64, top: 760, whiteSpace: "nowrap" }} />
    </Scene>
  );
};

/* 2. The mnemonic card: BEAST */
export const V2: React.FC = () => {
  const t = useT();
  return (
    <Scene start={2.84} end={4.1} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 820, height: 840, borderRadius: 48, background: C.forest, ...pop(t, 2.86, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 54, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 8, color: C.banana }}>THE MNEMONIC</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 110, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper, opacity: ramp(t, 2.95, 3.2) }}>one word</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 250, display: "flex", justifyContent: "center", gap: 18 }}>
          {LETTERS.map((l, i) => (
            <div key={l} style={pop(t, 3.32 + i * 0.07, 0.22)}><BChip l={l} size={136} /></div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 60, width: 700, top: 460, display: "flex", flexDirection: "column", gap: 14 }}>
          {LETTERS.map((l, i) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 16, opacity: ramp(t, 3.55 + i * 0.06, 3.75 + i * 0.06) }}>
              <div style={{ width: 22, height: 22, borderRadius: 11, background: GCOL[l] }} />
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.paper, whiteSpace: "nowrap" }}><span style={{ color: C.banana }}>{l}</span> = ?</div>
            </div>
          ))}
        </div>
      </div>
    </Scene>
  );
};

/* 3. B: brachioradialis on our diagram */
export const V3: React.FC = () => {
  const t = useT();
  const k = cam(t, [[4.1, 0.62, 400, 690], [4.5, 0.86, 360, 700], [5.5, 0.9, 360, 700]]);
  return (
    <Scene start={4.1} end={5.5} push={0.004}>
      <Stage t={t} k={k} id="v3" cyOff={60} lit={{ BR: 4.35 }} hot={t > 4.3 ? ["BR"] : []} dim={0.25}>
        {(P) => <Call t={t} t0={4.45} a={P(ANCHOR.BR)} to={[620, 520]} text="brachioradialis" bg={GCOL.B} />}
      </Stage>
      <Strip t={t} />
      <div style={{ position: "absolute", left: 24, top: 860, ...pop(t, 4.6, 0.25), transformOrigin: "0 0" }}>
        <Pill size={30} bg={C.banana} color={C.forest}>left arm from behind · thumb side = left</Pill>
      </div>
    </Scene>
  );
};

/* 4. E: the extensors on Gray's plate with MODERN labels */
export const V4: React.FC = () => {
  const t = useT();
  return (
    <Scene start={5.5} end={7.8} push={0.01}>
      <Strip t={t} />
      <PlateBox74 src="plates/fig418_post_forearm.png" aspect={A418} x={30} y={120} w={800} h={720} a={5.5} b={7.8} from={[0.5, 0.55, 1.4]} to={[0.52, 0.56, 1.28]} ls={29}
        labels={[
          { x: 0.47, y: 0.33, text: "ext. carpi\nradialis longus", t: 5.95, ox: -130, oy: 30 },
          { x: 0.41, y: 0.7, text: "ext. carpi\nradialis brevis", t: 6.35, ox: -100, oy: 70 },
          { x: 0.55, y: 0.6, text: "extensor\ndigitorum", t: 6.75, hot: true, ox: 140, oy: -20 },
          { x: 0.71, y: 0.52, text: "ext. carpi\nulnaris", t: 7.15, ox: 100, oy: -110 },
        ]} />
      <div style={{ position: "absolute", left: 30, top: 856, opacity: ramp(t, 7.0, 7.25), transform: `scale(${0.8 + 0.2 * ramp(t, 7.0, 7.25)})`, transformOrigin: "0 0" }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 16px 10px", fontFamily: FONT, fontWeight: 800, fontSize: 25, color: C.forest, lineHeight: 1.2, boxShadow: "0 6px 0 rgba(31,42,20,0.08)" }}>
          <span style={{ color: C.matcha }}>1918 atlas name:</span> “extensor digitorum communis”
        </div>
      </div>
    </Scene>
  );
};

/* 5. A, S, T on the diagram, then all five */
export const V5: React.FC = () => {
  const t = useT();
  const k = cam(t, [
    [7.8, 0.6, 400, 700], [8.15, 1.15, 330, 1070], [9.6, 1.15, 330, 1070],
    [9.95, 1.2, 340, 720], [10.6, 1.2, 340, 720],
    [10.95, 0.95, 420, 330], [11.3, 0.95, 420, 330], [11.6, 0.6, 400, 700], [11.85, 0.6, 400, 700],
  ]);
  const peel = ramp(t, 9.7, 10.0) * (1 - ramp(t, 10.6, 10.85));
  const all = t >= 11.35;
  const lit: Partial<Record<M, number>> = { BR: 0, ECRL: 0, ECRB: 0, ED: 0, EDM: 0, ECU: 0, EPB: 0, APL: 7.99, SUP: 9.86, TLO: 10.9, TLA: 10.95 };
  const hot: M[] = all ? [] : t >= 10.7 ? GROUP.T : t >= 9.69 ? GROUP.S : t >= 7.9 ? GROUP.A : [];
  return (
    <Scene start={7.8} end={11.85} push={0.004}>
      <Stage t={t} k={k} id="v5" cyOff={60} lit={lit} hot={hot} dim={0.25} peel={peel}>
        {(P) => (
          <>
            <Call t={t} t0={8.2} t1={9.6} a={P(ANCHOR.APL)} to={[640, 470]} text="abductor pollicis longus" bg={GCOL.A} size={32} />
            <Call t={t} t0={9.95} t1={10.6} a={P(ANCHOR.SUP)} to={[620, 380]} text="supinator (deep)" bg={GCOL.S} />
            <Call t={t} t0={10.95} t1={11.35} a={P(ANCHOR.TLA)} to={[640, 330]} text="triceps" bg={GCOL.T} />
          </>
        )}
      </Stage>
      <Strip t={t} />
      {t >= 8.0 && t < 9.6 && (
        <div style={{ position: "absolute", left: 0, width: 860, top: 856, display: "flex", justifyContent: "center", ...pop(t, 8.4, 0.25) }}>
          <Pill size={32} bg={C.banana} color={C.forest}>pollicis = of the thumb</Pill>
        </div>
      )}
      {t >= 9.9 && t < 10.6 && (
        <div style={{ position: "absolute", left: 0, width: 860, top: 856, display: "flex", justifyContent: "center", ...pop(t, 10.0, 0.25) }}>
          <Pill size={32} bg={C.banana} color={C.forest}>wraps the top of the radius</Pill>
        </div>
      )}
      <Stamp t0={11.35} text="ALL 5" size={60} rot={-7} color={C.red} style={{ left: 30, top: 120, whiteSpace: "nowrap" }} />
    </Scene>
  );
};

/* 6. Quick test */
export const V6: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[14.55, 3], [15.18, 2], [15.83, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < 16.45) { n = v; n0 = s; } });
  const opts = ["brachioradialis", "supinator", "triceps"];
  // little elbow icon bending
  const bend = 0.5 + 0.5 * Math.sin((t - 12.6) * 4);
  return (
    <Scene start={11.85} end={16.45}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 820, height: 850, borderRadius: 48, background: C.forest, ...pop(t, 11.9, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 54, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 124, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 58, lineHeight: 1.12, color: C.paper, ...pop(t, 12.6) }}>
          Which BEAST muscle <span style={{ color: C.redLight }}>BENDS</span> your elbow?
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 286, display: "flex", justifyContent: "center", ...pop(t, 13.5, 0.25) }}>
          <svg width={240} height={140} viewBox="0 0 240 140">
            <line x1={40} y1={110} x2={120} y2={110} stroke={C.paper} strokeWidth={22} strokeLinecap="round" />
            <g transform={`rotate(${-20 - 70 * bend} 120 110)`}>
              <line x1={120} y1={110} x2={205} y2={110} stroke={C.redLight} strokeWidth={22} strokeLinecap="round" />
            </g>
            <circle cx={120} cy={110} r={16} fill={C.banana} stroke={C.forest} strokeWidth={5} />
          </svg>
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 452, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          {opts.map((o, i) => (
            <div key={o} style={{ ...pop(t, 13.7 + i * 0.18), display: "flex", alignItems: "center", gap: 18, width: 560 }}>
              <div style={{ width: 62, height: 62, flex: "0 0 62px", borderRadius: 18, background: C.banana, color: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, border: `4px solid ${C.paper}` }}>{"ABC"[i]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 48, color: C.paper, whiteSpace: "nowrap" }}>{o}</div>
            </div>
          ))}
        </div>
        {n !== null && (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 676, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 150, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 7. Answer on Gray's plate: brachioradialis */
export const V7: React.FC = () => {
  const t = useT();
  const bend = ramp(t, 17.85, 18.4) * (1 - ramp(t, 19.0, 19.5));
  return (
    <Scene start={16.45} end={19.8} push={0.01}>
      <div style={{ position: "absolute", left: 0, width: 860, top: 0, display: "flex", justifyContent: "center", ...pop(t, 16.5, 0.25) }}>
        <Pill size={44} bg={C.matcha}>A ✓ brachioradialis</Pill>
      </div>
      <PlateBox74 src="plates/fig418_post_forearm.png" aspect={A418} x={40} y={100} w={500} h={760} a={16.45} b={19.8} from={[0.45, 0.42, 1.0]} to={[0.42, 0.4, 0.86]} ls={30}
        labels={[
          { x: 0.324, y: 0.39, text: "brachioradialis", t: 16.7, hot: true, ox: 40, oy: -170 },
        ]} />
      {/* elbow flexion mini diagram */}
      <div style={{ position: "absolute", left: 560, top: 140, width: 270, height: 340, borderRadius: 34, background: C.card, border: `3px solid ${C.line}`, ...pop(t, 17.7, 0.3) }}>
        <svg width={270} height={260} viewBox="0 0 270 260">
          <line x1={135} y1={30} x2={135} y2={150} stroke={C.forest} strokeWidth={26} strokeLinecap="round" />
          <g transform={`rotate(${-95 * bend} 135 150)`}>
            <line x1={135} y1={150} x2={135} y2={248} stroke="#E6B7A8" strokeWidth={26} strokeLinecap="round" />
            <path d="M 112 108 Q 100 170 120 238" stroke={GCOL.B} strokeWidth={14} fill="none" strokeLinecap="round" />
          </g>
          <circle cx={135} cy={150} r={15} fill={C.banana} stroke={C.forest} strokeWidth={5} />
        </svg>
        <div style={{ position: "absolute", left: 0, width: 270, top: 262, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.forest, lineHeight: 1.1 }}>elbow<br />flexor</div>
      </div>
      <div style={{ position: "absolute", left: 560, top: 510, width: 270, ...pop(t, 18.85, 0.3) }}>
        <div style={{ background: C.banana, borderRadius: 26, padding: "14px 18px 18px", fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.forest, textAlign: "center", lineHeight: 1.15 }}>yet it's on the<br />RADIAL nerve</div>
      </div>
      <div style={{ position: "absolute", left: 560, top: 680, width: 270, opacity: ramp(t, 19.2, 19.45) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 25, color: C.matcha, textAlign: "center", lineHeight: 1.2 }}>classic exam trap</div>
      </div>
    </Scene>
  );
};

/* 8. Rule: radial nerve = back of the arm + forearm (our diagram with the nerve drawn) */
export const V8: React.FC = () => {
  const t = useT();
  const k = cam(t, [[19.8, 0.63, 400, 680], [22.8, 0.67, 400, 680]]);
  const nerve = ramp(t, 20.0, 21.3);
  return (
    <Scene start={19.8} end={22.8} push={0.004}>
      <Stage t={t} k={k} id="v8" cyOff={30} full nerve={nerve} dim={0}>
        {(P) => (
          <>
            <Call t={t} t0={20.4} a={P(ANCHOR.NERVE)} to={[690, 250]} text="radial nerve" bg={C.banana} fg={C.forest} />
            <Call t={t} t0={21.3} a={P(ANCHOR.DEEPN)} to={[650, 690]} text="deep branch" size={32} />
          </>
        )}
      </Stage>
      <div style={{ position: "absolute", left: 0, width: 860, top: 0, display: "flex", justifyContent: "center", ...pop(t, 19.9, 0.25) }}>
        <div style={{ marginTop: 34 }}><Pill size={42} bg={C.forest}>RULE</Pill></div>
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 846, display: "flex", justifyContent: "center", ...pop(t, 21.25, 0.25) }}>
        <Pill size={38} bg={C.banana} color={C.forest}>radial = BACK of arm + forearm</Pill>
      </div>
      <div style={{ position: "absolute", left: 560, top: 740, width: 290, opacity: ramp(t, 21.6, 21.85), fontFamily: FONT, fontWeight: 800, fontSize: 27, color: C.matcha, textAlign: "center", lineHeight: 1.2 }}>
        = posterior interosseous nerve
      </div>
    </Scene>
  );
};

/* 9. Save + cheat sheet */
export const V9: React.FC = () => {
  const t = useT();
  const b = ramp(t, 22.85, 23.2);
  return (
    <Scene start={22.8} end={25.0}>
      <div style={{ position: "absolute", left: 40, top: 0, ...pop(t, 22.85) }}>
        <svg width={110} height={140} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 170, top: 6, ...pop(t, 22.9) }}>
        <Big size={100}>SAVE THIS</Big>
      </div>
      <div style={{ position: "absolute", left: 172, top: 112, ...pop(t, 23.15) }}>
        <Big size={40} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ position: "absolute", left: 40, top: 200, width: 780, height: 680, borderRadius: 40, background: C.card, border: `3px solid ${C.line}`, boxShadow: "0 18px 40px rgba(31,42,20,0.12)", ...pop(t, 23.0, 0.3) }}>
        <div style={{ position: "absolute", left: 40, top: 30, fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.matcha, letterSpacing: 3 }}>RADIAL NERVE MUSCLES</div>
        {LETTERS.map((l, i) => (
          <div key={l} style={{ position: "absolute", left: 40, top: 100 + i * 112, display: "flex", alignItems: "center", gap: 22, opacity: ramp(t, 23.2 + i * 0.1, 23.45 + i * 0.1) }}>
            <BChip l={l} size={86} />
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: l === "E" || l === "A" ? 42 : 48, color: C.forest, whiteSpace: "nowrap" }}>{NAMES[l]}</div>
          </div>
        ))}
      </div>
    </Scene>
  );
};

/* 10. End card (≤ 1.5 s) */
export const V10: React.FC = () => {
  const t = useT();
  const s0 = 25.0;
  return (
    <Scene start={s0} end={26.4}>
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
