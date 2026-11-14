import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, pop } from "./Scenes67";
import { PlateBox74 } from "./Scenes74";
import { ANCHOR, LET, LETTERS, M, MCOL, MNAME, Thigh } from "./Add81";

export const A430 = 921 / 3245;
export const A433 = 925 / 2848;
export const P430 = "plates/fig430_thigh.png";
export const P433 = "plates/fig433_adductors.png";
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* voice times (words.json) */
export const NT: Record<M, number> = { P: 5.74, L: 7.29, B: 7.79, MG: 8.3, G: 10.29 };
export const MN: Record<M, { word: string; note: string }> = {
  P: { word: "Please", note: "top · from the superior pubic ramus" },
  L: { word: "Let", note: "longus = LONG" },
  B: { word: "Bob", note: "brevis = SHORT" },
  MG: { word: "Make", note: "magnus = BIG" },
  G: { word: "Gravy", note: "gracilis = slender · most medial" },
};

export const Chip: React.FC<{ l: M; size?: number; on?: number; hot?: boolean }> = ({ l, size = 64, on = 1, hot }) => (
  <div style={{ width: size, height: size, flex: `0 0 ${size}px`, borderRadius: size * 0.28, background: on > 0.5 ? MCOL[l] : "rgba(31,42,20,0.08)", border: `4px solid ${on > 0.5 ? C.forest : "rgba(31,42,20,0.25)"}`, color: on > 0.5 ? C.paper : "rgba(31,42,20,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.62, transform: `scale(${hot ? 1.16 : 1})`, boxShadow: hot ? `0 0 0 6px ${C.banana}` : "none" }}>
    {LET[l]}
  </div>
);

/* running strip: P L B M G + n/5 muscles */
const Counter: React.FC<{ t: number; top?: number }> = ({ t, top = 10 }) => {
  const n = Object.values(NT).filter((x) => t >= x).length;
  return (
    <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", alignItems: "center", gap: 12 }}>
      {LETTERS.map((l) => {
        const p = ramp(t, NT[l], NT[l] + 0.2);
        const hot = t >= NT[l] && t < NT[l] + 1.2;
        return <div key={l} style={{ transform: `scale(${1 + 0.25 * p * (1 - ramp(t, NT[l] + 0.2, NT[l] + 0.5))})` }}><Chip l={l} size={66} on={p} hot={hot} /></div>;
      })}
      <div style={{ marginLeft: 12, background: C.forest, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 36, borderRadius: 20, padding: "4px 18px 8px", textAlign: "center", whiteSpace: "nowrap" }}>{n}/5 muscles</div>
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
const Stage: React.FC<{ t: number; k: Kf; id: string; h?: number; top?: number; children?: (P: (m: [number, number]) => [number, number]) => React.ReactNode } & Omit<React.ComponentProps<typeof Thigh>, "t" | "w" | "id">> = ({ t, k, id, children, h = 760, top = 100, ...rest }) => {
  const [, s, cx, cy] = k;
  const u = (860 / 860) * s;
  const X0 = 430 - cx * u, Y0 = h / 2 - cy * u;
  const P = (m: [number, number]) => [X0 + m[0] * u, top + Y0 + m[1] * u] as [number, number];
  return (
    <>
      <div style={{ position: "absolute", left: 0, top, width: 860, height: h, overflow: "hidden", borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}` }}>
        <div style={{ position: "absolute", left: X0, top: Y0 }}>
          <Thigh t={t} w={860 * s} id={id} {...rest} />
        </div>
        <div style={{ position: "absolute", right: 18, bottom: 12, fontFamily: FONT, fontWeight: 700, fontSize: 19, color: C.forest, opacity: 0.55 }}>right thigh, front view · diagram: Book Plume</div>
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
const Note1918: React.FC<{ t: number; t0: number; text: string; top?: number; left?: number; size?: number }> = ({ t, t0, text, top = 856, left = 30, size = 25 }) => (
  <div style={{ position: "absolute", left, top, opacity: ramp(t, t0, t0 + 0.25), transform: `scale(${0.8 + 0.2 * ramp(t, t0, t0 + 0.25)})`, transformOrigin: "0 0" }}>
    <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 16px 10px", fontFamily: FONT, fontWeight: 800, fontSize: size, color: C.forest, lineHeight: 1.2, boxShadow: "0 6px 0 rgba(31,42,20,0.08)", whiteSpace: "nowrap" }}>
      <span style={{ color: C.matcha }}>1918 atlas name:</span> {text}
    </div>
  </div>
);
const Tip: React.FC<{ t: number; t0: number; top: number; children: React.ReactNode; bg?: string; fg?: string; size?: number; t1?: number }> = ({ t, t0, top, children, bg = C.banana, fg = C.forest, size = 34, t1 }) =>
  t >= t0 - 0.05 && (!t1 || t < t1 + 0.2) ? (
    <div style={{ ...center(top), ...pop(t, t0, 0.25), opacity: ramp(t, t0, t0 + 0.2) * (t1 ? 1 - ramp(t, t1, t1 + 0.2) : 1) }}>
      <Pill size={size} bg={bg} color={fg}>{children}</Pill>
    </div>
  ) : null;

/* 1. Hook: Gray's 1918 Fig. 430 visible from frame 0 + challenge */
export const V1: React.FC = () => {
  const t = useT();
  const five = ramp(t, 0.72, 0.86) * (1 - ramp(t, 0.86, 1.1));
  return (
    <Scene start={-0.6} end={2.4} push={0.02}>
      <div style={center(26, pop(t, -0.4, 0.25))}>
        <Big size={92}>INNER THIGH =</Big>
      </div>
      <div style={{ ...center(118, pop(t, -0.3, 0.25)) }}>
        <div style={{ transform: `scale(${1 + 0.12 * five})` }}>
          <Big size={124} color={C.red}>5 MUSCLES</Big>
        </div>
      </div>
      <PlateBox74 src={P430} aspect={A430} x={30} y={268} w={800} h={584} a={-0.6} b={2.4} from={[0.6, 0.52, 1.1]} to={[0.62, 0.53, 0.98]}
        labels={[{ x: 0.7, y: 0.56, text: "5 adductors here", t: 1.0, hot: true, ox: -70, oy: 120 }]} />
      <div style={center(870, pop(t, 0.1, 0.25))}>
        <Pill size={36} bg={C.forest}>Name them? · adductor muscles mnemonic</Pill>
      </div>
      <Stamp t0={1.7} text="NAME ALL 5" size={40} rot={-8} color={C.red} style={{ left: 36, top: 300, whiteSpace: "nowrap" }} />
    </Scene>
  );
};

/* gravy boat (own drawing) */
const Gravy: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 120 100">
    <path d="M 10 46 C 30 44 60 44 104 30 C 108 40 104 52 96 60 C 80 78 50 84 32 74 C 22 68 14 58 10 46 Z" fill="#F7F6EC" stroke={C.forest} strokeWidth={5} strokeLinejoin="round" />
    <path d="M 16 48 C 34 48 64 46 100 34 C 96 44 90 50 80 54 C 60 58 34 58 16 48 Z" fill="#B5712E" stroke={C.forest} strokeWidth={3} />
    <path d="M 34 76 L 30 90 L 76 90 L 70 76" fill="#F7F6EC" stroke={C.forest} strokeWidth={5} strokeLinejoin="round" />
    <path d="M 14 50 C 0 46 2 30 14 34" fill="none" stroke={C.forest} strokeWidth={5} strokeLinecap="round" />
    <path d="M 104 30 C 110 24 116 22 118 24" fill="none" stroke={C.forest} strokeWidth={5} strokeLinecap="round" />
  </svg>
);

/* 2. Mnemonic card: Please Let Bob Make Gravy */
export const V2: React.FC = () => {
  const t = useT();
  const WT: Record<M, number> = { P: 3.72, L: 4.3, B: 4.46, MG: 4.81, G: 5.01 };
  const full: Record<M, [string, string]> = { P: ["", "Pectineus"], L: ["adductor ", "Longus"], B: ["adductor ", "Brevis"], MG: ["adductor ", "Magnus"], G: ["", "Gracilis"] };
  return (
    <Scene start={2.4} end={5.7} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 820, height: 850, borderRadius: 48, background: C.forest, ...pop(t, 2.42, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 8, color: C.banana }}>THE MNEMONIC</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 100, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper, ...pop(t, 2.75) }}>
          adductors · <span style={{ color: C.banana }}>top → inside</span>
        </div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 190, display: "flex", flexDirection: "column", gap: 16 }}>
          {LETTERS.map((l, i) => {
            const t0 = WT[l];
            const p = ramp(t, t0 - 0.08, t0 + 0.14);
            const sub = ramp(t, 5.15 + i * 0.07, 5.35 + i * 0.07);
            return (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 24, opacity: Math.max(0.15, p), transform: `translateX(${(1 - p) * -40}px)` }}>
                <Chip l={l} size={96} on={p} hot={t >= t0 && t < t0 + 0.35} />
                <div>
                  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 66, color: C.paper, lineHeight: 1 }}>
                    <span style={{ color: C.banana }}>{MN[l].word[0]}</span>{MN[l].word.slice(1)}
                  </div>
                  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: "#B9D27A", marginTop: 3, opacity: sub, whiteSpace: "nowrap" }}>
                    {full[l][0]}<span style={{ color: C.banana }}>{full[l][1][0]}</span>{full[l][1].slice(1)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", right: 40, top: 560, ...pop(t, 5.01, 0.3), transformOrigin: "50% 50%" }}>
          <div style={{ transform: `rotate(${-8 + 5 * Math.sin(t * 5)}deg)` }}><Gravy size={230} /></div>
        </div>
      </div>
    </Scene>
  );
};

/* 3. P → L → B on our own diagram (peel to show brevis underneath) */
export const V3: React.FC = () => {
  const t = useT();
  const k = cam(t, [[5.7, 1.0, 470, 380], [6.1, 1.35, 560, 300], [7.2, 1.35, 560, 300], [7.6, 1.15, 560, 400], [8.25, 1.12, 560, 390]]);
  const peel = ramp(t, 7.75, 8.05);
  return (
    <Scene start={5.7} end={8.25} push={0.004}>
      <Stage t={t} k={k} id="v3" lit={{ P: NT.P, L: NT.L, B: NT.B }} hot={t < 7.2 ? ["P"] : t < 7.75 ? ["L"] : ["B"]} peel={peel}>
        {(P) => (
          <>
            <Call t={t} t0={5.8} t1={7.15} a={P(ANCHOR.P)} to={[300, 160]} text="pectineus" bg={MCOL.P} size={46} />
            <Call t={t} t0={7.32} t1={7.7} a={P(ANCHOR.L)} to={[250, 720]} text="adductor longus" bg={MCOL.L} size={42} />
            <Call t={t} t0={7.82} a={P(ANCHOR.B)} to={[250, 200]} text="adductor brevis" bg={MCOL.B} fg={C.forest} size={42} />
          </>
        )}
      </Stage>
      <Counter t={t} />
      <Tip t={t} t0={6.3} t1={7.2} top={876} size={30} bg={C.forest} fg={C.paper}>P = up top, by the pubic bone</Tip>
      <Tip t={t} t0={7.85} top={876} size={30} bg={C.forest} fg={C.paper}>brevis hides UNDER pectineus + longus</Tip>
    </Scene>
  );
};

/* 4. Magnus on Gray's 1918 Fig. 433 + long · short · big */
export const V4: React.FC = () => {
  const t = useT();
  const chips: [number, string, string, M][] = [[9.14, "longus", "LONG", "L"], [9.42, "brevis", "SHORT", "B"], [9.79, "magnus", "BIG", "MG"]];
  return (
    <Scene start={8.25} end={10.25} push={0.006}>
      <PlateBox74 src={P433} aspect={A433} x={30} y={100} w={800} h={740} a={8.25} b={10.25} from={[0.55, 0.52, 1.36]} to={[0.56, 0.6, 1.3]} ls={30}
        labels={[
          { x: 0.64, y: 0.66, text: "adductor\nmagnus", t: 8.32, hot: true, ox: 150, oy: 40 },
          { x: 0.66, y: 0.47, text: "longus\n(cut)", t: 9.14, ox: 120, oy: -40 },
          { x: 0.4, y: 0.45, text: "adductor\nbrevis", t: 9.42, ox: -100, oy: -40 },
          { x: 0.45, y: 0.772, text: "hiatus", t: 9.9, ox: 110, oy: -20 },
        ]} />
      <Counter t={t} />
      <div style={{ position: "absolute", left: 0, width: 860, top: 862, display: "flex", justifyContent: "center", gap: 10 }}>
        {chips.map(([t0, a, b, l]) => (
          <div key={a} style={{ ...pop(t, t0, 0.25), opacity: ramp(t, t0 - 0.05, t0 + 0.15), background: MCOL[l], color: l === "B" ? C.forest : C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 28, borderRadius: 16, padding: "5px 14px 8px", border: `4px solid ${C.forest}`, whiteSpace: "nowrap" }}>
            {a} = {b}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 556, top: 400, opacity: ramp(t, 9.86, 10.1), transform: `scale(${0.8 + 0.2 * ramp(t, 9.86, 10.1)})`, transformOrigin: "0 0" }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 16px 10px", fontFamily: FONT, fontWeight: 800, fontSize: 25, color: C.forest, lineHeight: 1.25, boxShadow: "0 6px 0 rgba(31,42,20,0.08)", whiteSpace: "nowrap" }}>
          <span style={{ color: C.matcha }}>1918 atlas name:</span><br />“For. Fem. Vess.”<br />= adductor hiatus
        </div>
      </div>
    </Scene>
  );
};

/* 5. G: gracilis — the thin strap on the inside */
export const V5: React.FC = () => {
  const t = useT();
  const k = cam(t, [[10.25, 1.0, 520, 470], [10.6, 1.12, 600, 520], [12.5, 1.1, 590, 500]]);
  return (
    <Scene start={10.25} end={12.5} push={0.004}>
      <Stage t={t} k={k} id="v5" lit={{ P: 0, L: 0, B: 0, MG: 0, G: NT.G }} hot={["G"]}>
        {(P) => <Call t={t} t0={10.35} a={P(ANCHOR.G)} to={[250, 620]} text="gracilis" bg={MCOL.G} size={48} />}
      </Stage>
      <Counter t={t} />
      <Tip t={t} t0={11.2} top={876} size={30} bg={C.forest} fg={C.paper}>gracilis = slender · the only one that crosses the knee</Tip>
    </Scene>
  );
};

/* 6a. All five on Gray's 1918 Fig. 430: they pull the thigh IN */
export const V6: React.FC = () => {
  const t = useT();
  const arr = ramp(t, 13.05, 13.4);
  const k = ((t - 13.05) * 1.5) % 1;
  return (
    <Scene start={12.5} end={14.3} push={0.006}>
      <PlateBox74 src={P430} aspect={A430} x={30} y={100} w={800} h={740} a={12.5} b={14.3} from={[0.62, 0.52, 1.25]} to={[0.63, 0.53, 1.15]} ls={30}
        labels={[
          { x: 0.6, y: 0.415, text: "pectineus", t: 12.55, ox: -140, oy: -70 },
          { x: 0.665, y: 0.56, text: "adductor\nlongus", t: 12.7, ox: 110, oy: 70 },
          { x: 0.765, y: 0.47, text: "gracilis", t: 12.85, ox: 70, oy: -80 },
          { x: 0.72, y: 0.635, text: "adductor\nmagnus", t: 13.0, ox: 120, oy: -10 },
        ]} />
      {arr > 0 && (
        <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, opacity: arr }}>
          <defs>
            <marker id="ah6" viewBox="0 0 10 10" refX={5} refY={5} markerWidth={3} markerHeight={3} orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill={C.forest} /></marker>
          </defs>
          {[520, 640].map((y, i) => (
            <path key={y} d={`M ${120 + 40 * ((k + i * 0.4) % 1)} ${y} L ${300 + 40 * ((k + i * 0.4) % 1)} ${y}`} stroke={C.banana} strokeWidth={30} strokeLinecap="round" opacity={0.95} />
          ))}
          {[520, 640].map((y, i) => (
            <path key={`b${y}`} d={`M ${120 + 40 * ((k + i * 0.4) % 1)} ${y} L ${300 + 40 * ((k + i * 0.4) % 1)} ${y}`} stroke={C.forest} strokeWidth={12} strokeLinecap="round" markerEnd="url(#ah6)" />
          ))}
        </svg>
      )}
      <Counter t={t} />
      <Tip t={t} t0={13.1} top={862} size={36}>⟶ ADduct = pull the thigh IN</Tip>
    </Scene>
  );
};

/* 6b. Obturator nerve */
export const V6b: React.FC = () => {
  const t = useT();
  const k = cam(t, [[14.3, 1.0, 520, 420], [14.7, 1.2, 600, 330], [15.95, 1.2, 600, 340]]);
  return (
    <Scene start={14.3} end={15.95} push={0.004}>
      <Stage t={t} k={k} id="v6" lit={{ P: 0, L: 0, B: 0, MG: 0, G: 0 }} nerve={ramp(t, 14.75, 15.5)} pull={ramp(t, 14.3, 14.6)}>
        {(P) => <Call t={t} t0={14.9} a={P([628, 220])} to={[250, 130]} text="obturator nerve" bg={C.banana} fg={C.forest} size={42} />}
      </Stage>
      <Counter t={t} />
      <Tip t={t} t0={15.25} top={876} size={28} bg={C.forest} fg={C.paper}>obturator nerve (L2–L4) · pectineus: mainly femoral</Tip>
    </Scene>
  );
};

/* 7. Quick test */
export const V7: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[18.07, 3], [18.7, 2], [19.35, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < 19.95) { n = v; n0 = s; } });
  const ABC = "ABCDE";
  return (
    <Scene start={15.95} end={19.95}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 820, height: 850, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 16.0, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 106, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 58, lineHeight: 1.12, color: C.paper, ...pop(t, 16.64) }}>
          Which one has <span style={{ color: C.banana }}>TWO</span> nerves?
        </div>
        <div style={{ position: "absolute", left: 30, top: 270, width: 400, height: 540, borderRadius: 30, background: C.paper, overflow: "hidden", ...pop(t, 16.9, 0.3) }}>
          <div style={{ position: "absolute", left: 200 - 600 * 0.78, top: 270 - 440 * 0.78 }}>
            <Thigh t={t} w={860 * 0.78} id="v7" lit={{ P: 0, L: 0, B: 0, MG: 0, G: 0 }} mark={{ P: "A", L: "B", B: "C", MG: "D", G: "E" }} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 452, width: 360, top: 290, display: "flex", flexDirection: "column", gap: 18 }}>
          {LETTERS.map((l, i) => (
            <div key={l} style={{ ...pop(t, 17.1 + i * 0.12), display: "flex", alignItems: "center", gap: 12, transformOrigin: "0 50%" }}>
              <div style={{ width: 54, height: 54, flex: "0 0 54px", borderRadius: 16, background: MCOL[l], color: C.paper, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 32, border: `4px solid ${C.paper}` }}>{ABC[i]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 31, color: C.paper, whiteSpace: "nowrap" }}>{MNAME[l]}</div>
            </div>
          ))}
        </div>
        {n !== null && (
          <div key={n} style={{ position: "absolute", left: 540, top: 640, width: 200, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 170, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 8. Answer: adductor magnus = obturator + tibial part of the sciatic */
export const V8: React.FC = () => {
  const t = useT();
  const k = cam(t, [[19.95, 1.0, 520, 430], [20.4, 1.05, 540, 440], [23.15, 1.05, 540, 450]]);
  return (
    <Scene start={19.95} end={23.15} push={0.006}>
      <Stage t={t} k={k} id="v8" lit={{ MG: 0 }} hot={["MG"]} nerve={ramp(t, 20.9, 21.6)} sciatic={ramp(t, 21.8, 22.6)} ham={ramp(t, 22.1, 22.5)} top={110} h={740} />
      <div style={center(18, pop(t, 20.0, 0.25))}>
        <Pill size={46} bg={C.red}>D ✓ ADDUCTOR MAGNUS</Pill>
      </div>
      <Tip t={t} t0={21.2} t1={22.0} top={866} size={30}>1 · obturator nerve (adductor part)</Tip>
      <div style={{ ...center(866 + 0), ...pop(t, 22.2, 0.25), opacity: ramp(t, 22.15, 22.35) }}>
        <Pill size={30} bg={C.forest}>2 · sciatic, tibial part (hamstring part)</Pill>
      </div>
    </Scene>
  );
};

/* 9. Save + cheat sheet */
export const V9: React.FC = () => {
  const t = useT();
  const s0 = 23.15;
  const b = ramp(t, s0 + 0.05, s0 + 0.4);
  return (
    <Scene start={s0} end={25.6}>
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
        <div style={{ position: "absolute", left: 36, top: 24, fontFamily: FONT, fontWeight: 800, fontSize: 29, color: C.matcha, letterSpacing: 2 }}>INNER THIGH · PLEASE LET BOB MAKE GRAVY</div>
        {LETTERS.map((l, i) => (
          <div key={l} style={{ position: "absolute", left: 36, top: 78 + i * 98, display: "flex", alignItems: "center", gap: 22, opacity: ramp(t, s0 + 0.3 + i * 0.08, s0 + 0.55 + i * 0.08) }}>
            <Chip l={l} size={74} />
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 37, color: C.forest, whiteSpace: "nowrap", lineHeight: 1.05 }}>{MNAME[l]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, color: C.matcha, whiteSpace: "nowrap", marginTop: 3 }}>{MN[l].note}</div>
            </div>
          </div>
        ))}
        <div style={{ position: "absolute", left: 36, top: 576, width: 730, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.forest, lineHeight: 1.5, opacity: ramp(t, s0 + 0.7, s0 + 0.9) }}>
          <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px" }}>action</span> adduct the thigh (pull it in)
          <br />
          <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px" }}>nerve</span> obturator · magnus + sciatic (tibial)
        </div>
      </div>
    </Scene>
  );
};

/* 10. End card (≤ 1.5 s) */
export const V10: React.FC = () => {
  const t = useT();
  const s0 = 25.6;
  return (
    <Scene start={s0} end={26.9}>
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
