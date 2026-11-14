import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, pop } from "./Scenes67";
import { PlateBox74 } from "./Scenes74";
import { ANCHOR, Glute, N, NCOL, NLET, NNAME, NS } from "./Glute83";

export const A832 = 595 / 1298;
export const A829 = 1431 / 1402;
export const P832 = "plates/fig832_gluteal.png";
export const P829 = "plates/fig829_pelvis.png";
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* voice times (words.json) */
export const NT: Record<N, number> = { SG: 6.73, IG: 9.19, SC: 10.29, PF: 10.97, PU: 13.58 };
export const MN: Record<N, { word: string; note: string }> = {
  SG: { word: "Some", note: "ABOVE piriformis → glut. medius + minimus" },
  IG: { word: "Irish", note: "below → gluteus maximus" },
  SC: { word: "Sailor", note: "below · biggest nerve in the body" },
  PF: { word: "Pesters", note: "below · skin of the back of the thigh" },
  PU: { word: "Polly", note: "below → hooks back in → perineum" },
};

export const Chip: React.FC<{ l: N; size?: number; on?: number; hot?: boolean }> = ({ l, size = 64, on = 1, hot }) => (
  <div style={{ width: size, height: size, flex: `0 0 ${size}px`, borderRadius: size * 0.28, background: on > 0.5 ? NCOL[l] : "rgba(31,42,20,0.08)", border: `4px solid ${on > 0.5 ? C.forest : "rgba(31,42,20,0.25)"}`, color: on > 0.5 ? C.paper : "rgba(31,42,20,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.62, transform: `scale(${hot ? 1.16 : 1})`, boxShadow: hot ? `0 0 0 6px ${C.banana}` : "none" }}>
    {NLET[l]}
  </div>
);

/* running strip: S I S P P + n/5 branches */
const Counter: React.FC<{ t: number; top?: number }> = ({ t, top = 10 }) => {
  const n = Object.values(NT).filter((x) => t >= x).length;
  return (
    <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", alignItems: "center", gap: 12 }}>
      {NS.map((l) => {
        const p = ramp(t, NT[l], NT[l] + 0.2);
        const hot = t >= NT[l] && t < NT[l] + 1.1;
        return <div key={l} style={{ transform: `scale(${1 + 0.25 * p * (1 - ramp(t, NT[l] + 0.2, NT[l] + 0.5))})` }}><Chip l={l} size={66} on={p} hot={hot} /></div>;
      })}
      <div style={{ marginLeft: 12, background: C.forest, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 36, borderRadius: 20, padding: "4px 18px 8px", textAlign: "center", whiteSpace: "nowrap" }}>{n}/5 branches</div>
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
const Stage: React.FC<{ t: number; k: Kf; id: string; h?: number; top?: number; credit?: string; children?: (P: (m: [number, number]) => [number, number]) => React.ReactNode } & Omit<React.ComponentProps<typeof Glute>, "t" | "w" | "id">> = ({ t, k, id, children, h = 760, top = 100, credit = "right buttock, back view · gluteus maximus removed · diagram: Book Plume", ...rest }) => {
  const [, s, cx, cy] = k;
  const X0 = 430 - cx * s, Y0 = h / 2 - cy * s;
  const P = (m: [number, number]) => [X0 + m[0] * s, top + Y0 + m[1] * s] as [number, number];
  return (
    <>
      <div style={{ position: "absolute", left: 0, top, width: 860, height: h, overflow: "hidden", borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}` }}>
        <div style={{ position: "absolute", left: X0, top: Y0 }}>
          <Glute t={t} w={860 * s} id={id} {...rest} />
        </div>
        <div style={{ position: "absolute", right: 18, bottom: 12, fontFamily: FONT, fontWeight: 700, fontSize: 19, color: C.forest, opacity: 0.6, background: "rgba(255,254,246,0.85)", padding: "2px 10px", borderRadius: 8 }}>{credit}</div>
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
const Note1918: React.FC<{ t: number; t0: number; lines: React.ReactNode; top: number; left: number; size?: number }> = ({ t, t0, lines, top, left, size = 25 }) => (
  <div style={{ position: "absolute", left, top, opacity: ramp(t, t0, t0 + 0.25), transform: `scale(${0.8 + 0.2 * ramp(t, t0, t0 + 0.25)})`, transformOrigin: "0 0" }}>
    <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 16px 10px", fontFamily: FONT, fontWeight: 800, fontSize: size, color: C.forest, lineHeight: 1.25, boxShadow: "0 6px 0 rgba(31,42,20,0.08)", whiteSpace: "nowrap" }}>
      <span style={{ color: C.matcha }}>1918 atlas name:</span>
      <br />
      {lines}
    </div>
  </div>
);
const Tip: React.FC<{ t: number; t0: number; top: number; children: React.ReactNode; bg?: string; fg?: string; size?: number; t1?: number }> = ({ t, t0, top, children, bg = C.banana, fg = C.forest, size = 34, t1 }) =>
  t >= t0 - 0.05 && (!t1 || t < t1 + 0.2) ? (
    <div style={{ ...center(top), ...pop(t, t0, 0.25), opacity: ramp(t, t0, t0 + 0.2) * (t1 ? 1 - ramp(t, t1, t1 + 0.2) : 1) }}>
      <Pill size={size} bg={bg} color={fg}>{children}</Pill>
    </div>
  ) : null;

/* 1. Hook: Gray's 1918 Fig. 832 visible from frame 0 + challenge */
export const V1: React.FC = () => {
  const t = useT();
  const five = ramp(t, 0.64, 0.8) * (1 - ramp(t, 0.8, 1.05));
  return (
    <Scene start={-0.6} end={3.1} push={0.02}>
      <div style={center(26, pop(t, -0.4, 0.25))}>
        <Big size={96}>SACRAL PLEXUS =</Big>
      </div>
      <div style={{ ...center(124, pop(t, -0.3, 0.25)) }}>
        <div style={{ transform: `scale(${1 + 0.12 * five})` }}>
          <Big size={124} color={C.red}>5 BRANCHES</Big>
        </div>
      </div>
      <PlateBox74 src={P832} aspect={A832} x={30} y={276} w={800} h={576} a={-0.6} b={3.1} from={[0.5, 0.34, 1.0]} to={[0.5, 0.35, 0.9]}
        labels={[
          { x: 0.47, y: 0.305, text: "piriformis", t: 1.1, ox: 150, oy: -110 },
          { x: 0.5, y: 0.4, text: "5 nerves exit here", t: 1.5, hot: true, ox: -30, oy: 80 },
        ]} />
      <div style={center(872, pop(t, 0.1, 0.25))}>
        <Pill size={36} bg={C.forest}>Name them? · sacral plexus mnemonic</Pill>
      </div>
      <Stamp t0={2.0} text="NAME ALL 5" size={40} rot={-8} color={C.red} style={{ left: 36, top: 310, whiteSpace: "nowrap" }} />
    </Scene>
  );
};

/* 1b. Where the plexus sits: Gray's 1918 Fig. 829 (inside the pelvis) */
export const V1b: React.FC = () => {
  const t = useT();
  return (
    <Scene start={3.1} end={4.55} push={0.006}>
      <PlateBox74 src={P829} aspect={A829} x={30} y={60} w={800} h={790} a={3.1} b={4.55} from={[0.66, 0.5, 0.62]} to={[0.75, 0.6, 0.52]} ls={34}
        labels={[
          { x: 0.79, y: 0.66, text: "sacral plexus\n(L4–S4)", t: 3.18, hot: true, ox: -250, oy: 120 },
          { x: 0.9, y: 0.6, text: "piriformis", t: 3.55, ox: -60, oy: -150 },
        ]} />
      <Note1918 t={t} t0={3.8} left={22} top={92} lines={<>“hypogastric art.”<br />= internal iliac artery</>} />
      <Tip t={t} t0={3.2} top={872} size={32} bg={C.forest} fg={C.paper}>inside the pelvis, on the piriformis</Tip>
    </Scene>
  );
};

/* anchor (own drawing) */
const Hat: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 120 120">
    <g fill="none" stroke={C.paper} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={60} cy={20} r={10} />
      <path d="M 60 30 L 60 104" />
      <path d="M 38 46 L 82 46" />
      <path d="M 16 70 C 20 94 40 106 60 106 C 80 106 100 94 104 70" />
      <path d="M 8 78 L 16 66 L 28 74" />
      <path d="M 112 78 L 104 66 L 92 74" />
    </g>
    <g fill="none" stroke={C.banana} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={60} cy={20} r={10} />
      <path d="M 60 30 L 60 104" />
      <path d="M 38 46 L 82 46" />
      <path d="M 16 70 C 20 94 40 106 60 106 C 80 106 100 94 104 70" />
    </g>
  </svg>
);

/* 2. Mnemonic card: Some Irish Sailor Pesters Polly */
export const V2: React.FC = () => {
  const t = useT();
  const WT: Record<N, number> = { SG: 4.69, IG: 4.88, SC: 5.26, PF: 5.61, PU: 6.01 };
  return (
    <Scene start={4.55} end={6.7} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 820, height: 850, borderRadius: 48, background: C.forest, ...pop(t, 4.57, 0.22) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 8, color: C.banana }}>THE MNEMONIC</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 100, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.paper, ...pop(t, 4.7) }}>
          sacral plexus · <span style={{ color: C.banana }}>5 big branches</span>
        </div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 190, display: "flex", flexDirection: "column", gap: 16 }}>
          {NS.map((l, i) => {
            const t0 = WT[l];
            const p = ramp(t, t0 - 0.08, t0 + 0.12);
            const sub = ramp(t, 6.05 + i * 0.07, 6.25 + i * 0.07);
            return (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 24, opacity: Math.max(0.15, p), transform: `translateX(${(1 - p) * -40}px)` }}>
                <Chip l={l} size={96} on={p} hot={t >= t0 && t < t0 + 0.3} />
                <div>
                  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 66, color: C.paper, lineHeight: 1 }}>
                    <span style={{ color: C.banana }}>{MN[l].word[0]}</span>{MN[l].word.slice(1)}
                  </div>
                  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: "#B9D27A", marginTop: 3, opacity: sub, whiteSpace: "nowrap" }}>
                    <span style={{ color: C.banana }}>{NNAME[l][0]}</span>{NNAME[l].slice(1)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", right: 34, top: 300, ...pop(t, 5.26, 0.3), transformOrigin: "50% 50%" }}>
          <div style={{ transform: `rotate(${-10 + 6 * Math.sin(t * 5)}deg)` }}><Hat size={170} /></div>
        </div>
      </div>
    </Scene>
  );
};

/* 3. S: superior gluteal — ABOVE the piriformis */
export const V3: React.FC = () => {
  const t = useT();
  const k = cam(t, [[6.7, 0.95, 430, 420], [7.1, 1.25, 430, 300], [8.2, 1.25, 430, 310], [8.6, 1.1, 440, 360], [9.15, 1.08, 440, 360]]);
  return (
    <Scene start={6.7} end={9.15} push={0.004}>
      <Stage t={t} k={k} id="v3" lit={{ SG: NT.SG }} hot={["SG"]} pir={ramp(t, 8.25, 8.55)} divide={ramp(t, 8.3, 8.6)}>
        {(P) => (
          <>
            <Call t={t} t0={6.85} a={P([480, 226])} to={[250, 150]} text="superior gluteal" bg={NCOL.SG} size={44} />
            <Call t={t} t0={8.3} a={P(ANCHOR.PIR)} to={[560, 700]} text="piriformis" bg={C.forest} size={42} />
          </>
        )}
      </Stage>
      <Counter t={t} />
      <Tip t={t} t0={7.95} top={876} size={34}>↑ ABOVE the piriformis</Tip>
    </Scene>
  );
};

/* 4. I · S · P: inferior gluteal, sciatic, posterior femoral cutaneous — BELOW it */
export const V4: React.FC = () => {
  const t = useT();
  const k = cam(t, [[9.15, 1.08, 440, 360], [9.5, 1.2, 470, 440], [10.2, 1.2, 470, 440], [10.7, 1.08, 440, 540], [12.6, 1.05, 430, 520], [13.45, 0.98, 430, 470]]);
  const hot: N[] = t < 10.25 ? ["IG"] : t < 10.95 ? ["SC"] : t < 12.7 ? ["PF"] : ["IG", "SC", "PF"];
  return (
    <Scene start={9.15} end={13.45} push={0.004}>
      <Stage t={t} k={k} id="v4" lit={{ SG: 0, IG: NT.IG, SC: NT.SC, PF: NT.PF }} hot={hot} pir={1} divide={1} dim={t < 12.7 ? 0.5 : 0.2}>
        {(P) => (
          <>
            <Call t={t} t0={9.25} a={P([500, 410])} to={[600, 170]} text="inferior gluteal" bg={NCOL.IG} size={42} />
            <Call t={t} t0={10.35} a={P(ANCHOR.SC)} to={[650, 640]} text="sciatic" bg={NCOL.SC} size={46} />
            <Call t={t} t0={11.05} a={P(ANCHOR.PF)} to={[330, 700]} text="posterior femoral cutaneous" bg={NCOL.PF} size={32} />
          </>
        )}
      </Stage>
      <Counter t={t} />
      <Tip t={t} t0={12.75} top={876} size={34}>↓ BELOW the piriformis</Tip>
    </Scene>
  );
};

/* 5. P: pudendal — out, then hooks back in to the perineum */
export const V5: React.FC = () => {
  const t = useT();
  const k = cam(t, [[13.45, 0.98, 430, 470], [13.9, 1.38, 320, 500], [15.65, 1.42, 310, 510]]);
  return (
    <Scene start={13.45} end={15.65} push={0.004}>
      <Stage t={t} k={k} id="v5" lit={{ SG: 0, IG: 0, SC: 0, PF: 0, PU: NT.PU }} hot={["PU"]} pir={0.6} dim={0.75}>
        {(P) => (
          <>
            <Call t={t} t0={13.7} a={P([240, 470])} to={[600, 260]} text="pudendal" bg={NCOL.PU} size={48} />
            <Call t={t} t0={14.4} a={P([262, 450])} to={[620, 470]} text="ischial spine" bg={C.forest} size={32} />
          </>
        )}
      </Stage>
      <Counter t={t} />
      <Tip t={t} t0={14.75} top={876} size={30} bg={C.forest} fg={C.paper}>out → around the spine → back in → perineum</Tip>
    </Scene>
  );
};

/* 6. Sciatic = biggest nerve, on Gray's 1918 Fig. 832 */
export const V6: React.FC = () => {
  const t = useT();
  return (
    <Scene start={15.65} end={18.1} push={0.006}>
      <PlateBox74 src={P832} aspect={A832} x={30} y={100} w={800} h={740} a={15.65} b={18.1} from={[0.5, 0.36, 1.0]} to={[0.5, 0.37, 0.9]} ls={30}
        labels={[
          { x: 0.5, y: 0.47, text: "sciatic nerve", t: 15.75, hot: true, ox: 170, oy: 60 },
          { x: 0.38, y: 0.237, text: "superior gluteal", t: 16.25, ox: -30, oy: -70 },
          { x: 0.33, y: 0.448, text: "post. femoral\ncutaneous", t: 16.55, ox: -20, oy: 150 },
          { x: 0.28, y: 0.33, text: "pudendal", t: 16.85, ox: -20, oy: -60 },
        ]} />
      <Note1918 t={t} t0={17.15} left={500} top={150} lines={<>“Tuber ischiad.”<br />= ischial tuberosity</>} />
      <Counter t={t} />
      <Tip t={t} t0={16.64} top={862} size={34}>sciatic = the BIGGEST nerve · L4–S3</Tip>
    </Scene>
  );
};

/* 7. Quick test */
export const V7: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[21.04, 3], [21.68, 2], [22.32, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < 22.95) { n = v; n0 = s; } });
  const ABC = "ABCDE";
  return (
    <Scene start={18.1} end={22.95}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 820, height: 850, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 18.15, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 106, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 56, lineHeight: 1.12, color: C.paper, ...pop(t, 18.89) }}>
          Which one powers <span style={{ color: C.banana }}>GLUTEUS MAXIMUS?</span>
        </div>
        <div style={{ position: "absolute", left: 30, top: 270, width: 400, height: 540, borderRadius: 30, background: C.paper, overflow: "hidden", ...pop(t, 19.3, 0.3) }}>
          <div style={{ position: "absolute", left: 200 - 430 * 0.62, top: 270 - 440 * 0.62 }}>
            <Glute t={t} w={860 * 0.62} id="v7" lit={{ SG: 0, IG: 0, SC: 0, PF: 0, PU: 0 }} pir={0.5} max={0.25 + 0.15 * ramp(t, 19.7, 20.1)} mark={{ SG: "A", IG: "B", SC: "C", PF: "D", PU: "E" }} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 452, width: 360, top: 290, display: "flex", flexDirection: "column", gap: 18 }}>
          {NS.map((l, i) => (
            <div key={l} style={{ ...pop(t, 19.5 + i * 0.12), display: "flex", alignItems: "center", gap: 12, transformOrigin: "0 50%" }}>
              <div style={{ width: 54, height: 54, flex: "0 0 54px", borderRadius: 16, background: NCOL[l], color: C.paper, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 32, border: `4px solid ${C.paper}` }}>{ABC[i]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: l === "PF" ? 25 : 31, color: C.paper, whiteSpace: l === "PF" ? "normal" : "nowrap", lineHeight: 1.05 }}>{l === "PF" ? "Post. femoral cutaneous" : NNAME[l]}</div>
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

/* 8. Answer: inferior gluteal → gluteus maximus; superior → medius + minimus */
export const V8: React.FC = () => {
  const t = useT();
  const k = cam(t, [[22.95, 1.0, 440, 420], [23.4, 1.02, 450, 420], [24.2, 1.02, 450, 420], [24.6, 1.12, 450, 300], [26.35, 1.12, 450, 300]]);
  const sw = ramp(t, 24.2, 24.55);
  return (
    <Scene start={22.95} end={26.35} push={0.006}>
      <Stage t={t} k={k} id="v8" lit={{ SG: 0, IG: 0, SC: 0, PF: 0, PU: 0 }} hot={sw < 0.5 ? ["IG"] : ["SG"]} dim={0.8} pir={0.4}
        max={ramp(t, 23.05, 23.4) * (1 - sw)} maxLit={ramp(t, 23.3, 23.6)} med={ramp(t, 24.9, 25.3)} top={110} h={740} credit="right buttock, back view · diagram: Book Plume">
        {(P) => (
          <>
            <Call t={t} t0={23.45} t1={24.15} a={P([560, 520])} to={[620, 780]} text="gluteus maximus" bg="#3E7C93" size={40} />
            <Call t={t} t0={25.05} a={P([560, 200])} to={[560, 680]} text="gluteus medius + minimus" bg="#B8473A" size={36} />
          </>
        )}
      </Stage>
      <div style={center(18, pop(t, 23.0, 0.25))}>
        <Pill size={46} bg={C.red}>B ✓ INFERIOR GLUTEAL</Pill>
      </div>
      <Tip t={t} t0={23.5} t1={24.15} top={866} size={34}>inferior gluteal → gluteus MAXIMUS</Tip>
      <div style={{ ...center(866), ...pop(t, 24.3, 0.25), opacity: ramp(t, 24.25, 24.45) }}>
        <Pill size={32} bg={C.forest}>superior gluteal → gluteus MEDIUS + MINIMUS</Pill>
      </div>
    </Scene>
  );
};

/* 9. Save + cheat sheet */
export const V9: React.FC = () => {
  const t = useT();
  const s0 = 26.35;
  const b = ramp(t, s0 + 0.05, s0 + 0.4);
  return (
    <Scene start={s0} end={28.55}>
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
        <div style={{ position: "absolute", left: 36, top: 24, fontFamily: FONT, fontWeight: 800, fontSize: 23, color: C.matcha, letterSpacing: 0.5, whiteSpace: "nowrap" }}>SACRAL PLEXUS · SOME IRISH SAILOR PESTERS POLLY</div>
        {NS.map((l, i) => (
          <div key={l} style={{ position: "absolute", left: 36, top: 78 + i * 98, display: "flex", alignItems: "center", gap: 22, opacity: ramp(t, s0 + 0.3 + i * 0.08, s0 + 0.55 + i * 0.08) }}>
            <Chip l={l} size={74} />
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.forest, whiteSpace: "nowrap", lineHeight: 1.05 }}>{NNAME[l]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 25, color: C.matcha, whiteSpace: "nowrap", marginTop: 3 }}>{MN[l].note}</div>
            </div>
          </div>
        ))}
        <div style={{ position: "absolute", left: 36, top: 584, width: 730, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.forest, lineHeight: 1.5, opacity: ramp(t, s0 + 0.7, s0 + 0.9) }}>
          <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px" }}>roots</span> L4–S4 · all exit the greater sciatic foramen
          <br />
          <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px" }}>landmark</span> piriformis: 1 above, 4 below
        </div>
      </div>
    </Scene>
  );
};

/* 10. End card (≤ 1.5 s) */
export const V10: React.FC = () => {
  const t = useT();
  const s0 = 28.55;
  return (
    <Scene start={s0} end={29.75}>
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
