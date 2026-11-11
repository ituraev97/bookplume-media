import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, pop } from "./Scenes67";
import { PlateBox74 } from "./Scenes74";
import { ANCHOR, AortaDiagram, B, BCOL, BLEVEL, BNAME, Lv } from "./Aorta82";

export const A531 = 2018 / 1997;
export const P531 = "plates/fig531_aorta.png";
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* order on the spine, top → bottom */
export const ORDER: B[] = ["CT", "SMA", "REN", "IMA", "BIF"];
/* voice times: when each level is named */
export const NT: Record<B, number> = { CT: 7.85, SMA: 9.44, REN: 11.62, IMA: 22.43, BIF: 14.74 };
/* when the branch name itself is spoken */
export const WT: Record<B, number> = { CT: 8.43, SMA: 9.95, REN: 12.96, IMA: 22.54, BIF: 15.91 };
export const NOTE: Record<B, string> = {
  CT: "stomach · liver · spleen (foregut)",
  SMA: "small intestine (midgut)",
  REN: "one to each kidney",
  IMA: "lower colon + rectum (hindgut)",
  BIF: "the aorta splits in two",
};

export const LChip: React.FC<{ b: B; size?: number; on?: number; hot?: boolean; text?: string }> = ({ b, size = 64, on = 1, hot, text }) => {
  const s = text ?? BLEVEL[b];
  const wide = s.length > 3;
  return (
    <div style={{ minWidth: wide ? size * 1.55 : size, height: size, padding: wide ? "0 8px" : 0, boxSizing: "border-box", borderRadius: size * 0.28, background: on > 0.5 ? BCOL[b] : "rgba(31,42,20,0.08)", border: `4px solid ${on > 0.5 ? C.forest : "rgba(31,42,20,0.25)"}`, color: on > 0.5 ? C.paper : "rgba(31,42,20,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * (wide ? 0.4 : 0.44), transform: `scale(${hot ? 1.14 : 1})`, boxShadow: hot ? `0 0 0 6px ${C.banana}` : "none", whiteSpace: "nowrap" }}>
      {s}
    </div>
  );
};

/* running strip: T12 · L1 · L1–L2 · ? · L4 + n/5 */
const Strip: React.FC<{ t: number; top?: number }> = ({ t, top = 10 }) => {
  const n = ORDER.filter((b) => t >= NT[b]).length;
  return (
    <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}>
      {ORDER.map((b) => {
        const p = ramp(t, NT[b], NT[b] + 0.2);
        const hot = t >= NT[b] && t < NT[b] + 1.4;
        const q = b === "IMA" && t < NT.IMA;
        return <LChip key={b} b={b} size={64} on={p} hot={hot} text={q ? "L3?" : undefined} />;
      })}
      <div style={{ marginLeft: 10, background: C.forest, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 32, borderRadius: 20, padding: "4px 16px 8px", whiteSpace: "nowrap" }}>{n}/5 branches</div>
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
const Stage: React.FC<{ t: number; k: Kf; id: string; h?: number; top?: number; children?: (P: (m: [number, number]) => [number, number]) => React.ReactNode } & Omit<React.ComponentProps<typeof AortaDiagram>, "t" | "w" | "id">> = ({ t, k, id, children, h = 740, top = 100, ...rest }) => {
  const [, s, cx, cy] = k;
  const X0 = 430 - cx * s, Y0 = h / 2 - cy * s;
  const P = (m: [number, number]) => [X0 + m[0] * s, top + Y0 + m[1] * s] as [number, number];
  return (
    <>
      <div style={{ position: "absolute", left: 0, top, width: 860, height: h, overflow: "hidden", borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}` }}>
        <div style={{ position: "absolute", left: X0, top: Y0 }}>
          <AortaDiagram t={t} w={860 * s} id={id} {...rest} />
        </div>
        <div style={{ position: "absolute", right: 18, bottom: 12, fontFamily: FONT, fontWeight: 700, fontSize: 19, color: C.forest, opacity: 0.6, background: "rgba(255,254,246,0.85)", padding: "1px 8px", borderRadius: 8 }}>front view · diagram: Book Plume</div>
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
      <div style={{ position: "absolute", left: tx, top: ty, transform: `translate(-50%, -50%) scale(${0.8 + 0.2 * p})`, opacity: p, whiteSpace: "nowrap" }}>
        <Pill size={size} bg={bg} color={fg}>{text}</Pill>
      </div>
    </>
  );
};
const Tip: React.FC<{ t: number; t0: number; top: number; children: React.ReactNode; bg?: string; fg?: string; size?: number; t1?: number }> = ({ t, t0, top, children, bg = C.banana, fg = C.forest, size = 34, t1 }) =>
  t >= t0 - 0.05 && (!t1 || t < t1 + 0.2) ? (
    <div style={{ ...center(top), ...pop(t, t0, 0.25), opacity: ramp(t, t0, t0 + 0.2) * (t1 ? 1 - ramp(t, t1, t1 + 0.2) : 1) }}>
      <Pill size={size} bg={bg} color={fg}>{children}</Pill>
    </div>
  ) : null;
const Note1918: React.FC<{ t: number; t0: number; children: React.ReactNode; top?: number; left?: number; size?: number }> = ({ t, t0, children, top = 856, left = 30, size = 25 }) => (
  <div style={{ position: "absolute", left, top, opacity: ramp(t, t0, t0 + 0.25), transform: `scale(${0.8 + 0.2 * ramp(t, t0, t0 + 0.25)})`, transformOrigin: "0 0" }}>
    <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 16px 10px", fontFamily: FONT, fontWeight: 800, fontSize: size, color: C.forest, lineHeight: 1.25, boxShadow: "0 6px 0 rgba(31,42,20,0.08)", whiteSpace: "nowrap" }}>
      <span style={{ color: C.matcha }}>1918 atlas name:</span> {children}
    </div>
  </div>
);

/* 1. Hook: Gray's 1918 Fig. 531 visible from frame 0 + challenge */
export const V1: React.FC = () => {
  const t = useT();
  const five = ramp(t, 0.5, 0.64) * (1 - ramp(t, 0.64, 0.9));
  return (
    <Scene start={-0.6} end={3.4} push={0.02}>
      <div style={center(26, pop(t, -0.4, 0.25))}>
        <Big size={88}>ABDOMINAL AORTA</Big>
      </div>
      <div style={center(118, pop(t, -0.3, 0.25))}>
        <div style={{ transform: `scale(${1 + 0.12 * five})` }}>
          <Big size={122} color={C.red}>5 BRANCHES</Big>
        </div>
      </div>
      <PlateBox74 src={P531} aspect={A531} x={30} y={268} w={800} h={584} a={-0.6} b={3.4} from={[0.5, 0.47, 0.92]} to={[0.5, 0.5, 0.8]}
        labels={[{ x: 0.49, y: 0.56, text: "aorta", t: 2.75, hot: true, ox: -150, oy: 60 }]} />
      <div style={center(870, pop(t, 0.1, 0.25))}>
        <Pill size={36} bg={C.forest}>Place them? · abdominal aorta mnemonic</Pill>
      </div>
      <Stamp t0={1.9} text="T12 → L4" size={44} rot={-8} color={C.red} style={{ left: 36, top: 300, whiteSpace: "nowrap" }} />
    </Scene>
  );
};

/* 2. Mnemonic: just count 12 · 1 · 2 · 3 · 4 down the spine */
export const V2: React.FC = () => {
  const t = useT();
  const CT_: [string, string, number][] = [["T", "12", 6.13], ["L", "1", 6.44], ["L", "2", 6.65], ["L", "3", 6.89], ["L", "4", 7.14]];
  const cnt = ramp(t, 5.44, 5.7);
  return (
    <Scene start={3.4} end={7.8} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 820, height: 850, borderRadius: 48, background: C.forest, ...pop(t, 3.42, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 44, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 8, color: C.banana }}>THE MNEMONIC</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 98, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.paper, ...pop(t, 3.6) }}>
          abdominal aorta · <span style={{ color: C.banana }}>top → bottom</span>
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 170, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 92, color: C.paper, letterSpacing: -2, opacity: cnt, transform: `scale(${0.7 + 0.3 * cnt})` }}>
          just <span style={{ background: C.banana, color: C.forest, borderRadius: 18, padding: "0 18px 6px" }}>COUNT</span>
        </div>
        {/* vertebra stack */}
        <div style={{ position: "absolute", left: 150, width: 520, top: 312, display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
          {CT_.map(([pre, n, t0], i) => {
            const p = ramp(t, t0 - 0.06, t0 + 0.12);
            const hot = t >= t0 && t < t0 + 0.3;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, opacity: Math.max(0.12, p), transform: `translateX(${(1 - p) * -40}px) scale(${hot ? 1.06 : 1})` }}>
                <div style={{ width: 300, height: 88, borderRadius: 26, background: p > 0.5 ? "#F6EFDC" : "rgba(247,246,236,0.15)", border: `5px solid ${p > 0.5 ? C.banana : "rgba(247,246,236,0.3)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 64, color: C.forest, boxShadow: hot ? `0 0 0 8px rgba(242,209,78,0.5)` : "none" }}>
                  <span style={{ color: C.matcha, fontSize: 44, marginRight: 6 }}>{pre}</span>
                  <span style={{ color: C.red }}>{n}</span>
                </div>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: n === "3" ? C.banana : "#B9D27A", width: 130, opacity: ramp(t, 7.3 + i * 0.05, 7.45 + i * 0.05) }}>{n === "3" ? "?" : "✓"}</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 70, top: 330, width: 60, height: 460, opacity: ramp(t, 6.1, 6.4) }}>
          <svg width={60} height={460}>
            <defs><marker id="ah2" viewBox="0 0 10 10" refX={5} refY={5} markerWidth={4} markerHeight={4} orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill={C.banana} /></marker></defs>
            <line x1={30} y1={10} x2={30} y2={10 + 420 * ramp(t, 6.1, 7.3)} stroke={C.banana} strokeWidth={10} strokeLinecap="round" markerEnd="url(#ah2)" />
          </svg>
        </div>
      </div>
    </Scene>
  );
};

/* 3. T12 celiac → L1 SMA on our own diagram */
export const V3: React.FC = () => {
  const t = useT();
  const k = cam(t, [[7.8, 0.9, 430, 470], [8.15, 1.3, 370, 230], [9.3, 1.3, 370, 230], [9.7, 1.18, 375, 390], [11.55, 1.14, 380, 400]]);
  return (
    <Scene start={7.8} end={11.55} push={0.004}>
      <Stage t={t} k={k} id="v3" lit={{ CT: WT.CT, SMA: WT.SMA }} hot={t < 9.6 ? ["CT"] : ["SMA"]} hide={["IMA"]} lv={{ T12: 7.85, L1: 9.44 }}>
        {(P) => (
          <>
            <Call t={t} t0={8.43} t1={9.45} a={P(ANCHOR.CT)} to={[560, 640]} text="celiac trunk" bg={BCOL.CT} size={46} />
            <Call t={t} t0={9.95} a={P(ANCHOR.SMA)} to={[560, 720]} text="superior mesenteric a." bg={BCOL.SMA} size={38} />
          </>
        )}
      </Stage>
      <Strip t={t} />
      <Tip t={t} t0={8.85} t1={9.5} top={864} size={30} bg={C.forest} fg={C.paper}>celiac → stomach · liver · spleen</Tip>
      <Tip t={t} t0={10.55} top={864} size={30} bg={C.forest} fg={C.paper}>superior mesenteric → small intestine</Tip>
    </Scene>
  );
};

/* 4. Renals on Gray's 1918 Fig. 531 */
export const V4: React.FC = () => {
  const t = useT();
  return (
    <Scene start={11.55} end={14.65} push={0.006}>
      <PlateBox74 src={P531} aspect={A531} x={30} y={100} w={800} h={740} a={11.55} b={14.65} from={[0.47, 0.4, 0.52]} to={[0.47, 0.41, 0.46]} ls={30}
        labels={[
          { x: 0.505, y: 0.335, text: "celiac trunk", t: 11.7, ox: -200, oy: -90 },
          { x: 0.512, y: 0.392, text: "sup. mesenteric", t: 11.95, ox: -120, oy: 30 },
          { x: 0.565, y: 0.414, text: "renal a.", t: 12.96, hot: true, ox: 60, oy: -150 },
          { x: 0.355, y: 0.445, text: "renal a.", t: 13.2, hot: true, ox: -40, oy: 140 },
          { x: 0.49, y: 0.56, text: "aorta", t: 13.6, ox: 130, oy: -30 },
        ]} />
      <Strip t={t} />
      <Note1918 t={t} t0={13.9} top={858} left={60}>“cœliac art.” = celiac trunk</Note1918>
    </Scene>
  );
};

/* 5. L4: the aorta splits into the common iliacs */
export const V5: React.FC = () => {
  const t = useT();
  const k = cam(t, [[14.65, 0.95, 430, 450], [15.0, 1.15, 380, 620], [17.7, 1.12, 380, 615]]);
  return (
    <Scene start={14.65} end={17.7} push={0.004}>
      <Stage t={t} k={k} id="v5" lit={{ CT: 0, SMA: 0, REN: 0, BIF: 15.91 }} hot={["BIF"]} hide={["IMA"]} lv={{ L4: 14.74 }}>
        {(P) => (
          <>
            <Call t={t} t0={15.95} a={P(ANCHOR.BIF)} to={[650, 190]} text="aorta splits" bg={C.red} size={44} />
            <Call t={t} t0={16.85} a={P([340, 820])} to={[250, 790]} text="common iliacs" bg={BCOL.BIF} size={40} />
          </>
        )}
      </Stage>
      <Strip t={t} />
      <Tip t={t} t0={16.2} top={862} size={28} bg={C.forest} fg={C.paper}>Gray's 1918: ends “on the fourth lumbar vertebra”</Tip>
    </Scene>
  );
};

/* 6. Quick test */
export const V6: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[20.48, 3], [21.11, 2], [21.75, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < 22.35) { n = v; n0 = s; } });
  const opts: [string, string][] = [["A", "renal arteries"], ["B", "inferior mesenteric"], ["C", "celiac trunk"], ["D", "gonadal arteries"]];
  return (
    <Scene start={17.7} end={22.35}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 820, height: 850, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 17.75, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 104, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 56, lineHeight: 1.12, color: C.paper, ...pop(t, 18.3) }}>
          What leaves at <span style={{ color: C.banana }}>L3</span>?
        </div>
        <div style={{ position: "absolute", left: 30, top: 200, width: 400, height: 620, borderRadius: 30, background: C.paper, overflow: "hidden", ...pop(t, 18.5, 0.3) }}>
          <div style={{ position: "absolute", left: 0, top: -26 }}>
            <AortaDiagram t={t} w={860 * 0.7} id="v6" lit={{ CT: 0, SMA: 0, REN: 0, BIF: 0 }} hide={["IMA"]} q={ramp(t, 18.8, 19.1)} lv={{ L3: 18.7 }} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 452, width: 360, top: 230, display: "flex", flexDirection: "column", gap: 20 }}>
          {opts.map(([l, s], i) => (
            <div key={l} style={{ ...pop(t, 19.4 + i * 0.12), display: "flex", alignItems: "center", gap: 12, transformOrigin: "0 50%" }}>
              <div style={{ width: 54, height: 54, flex: "0 0 54px", borderRadius: 16, background: C.banana, color: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 32 }}>{l}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.paper, whiteSpace: "nowrap" }}>{s}</div>
            </div>
          ))}
        </div>
        {n !== null && (
          <div key={n} style={{ position: "absolute", left: 540, top: 600, width: 200, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 170, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 7a. Answer on our diagram */
export const V7: React.FC = () => {
  const t = useT();
  const k = cam(t, [[22.35, 1.0, 450, 470], [22.7, 1.1, 430, 560], [24.2, 1.08, 430, 570]]);
  return (
    <Scene start={22.35} end={24.2} push={0.006}>
      <Stage t={t} k={k} id="v7" lit={{ CT: 0, SMA: 0, REN: 0, BIF: 0, IMA: WT.IMA }} hot={["IMA"]} lv={{ L3: 22.43 }} gut={ramp(t, 23.0, 23.4)} top={110} h={740} />
      <div style={center(18, pop(t, 22.4, 0.25))}>
        <Pill size={42} bg={C.red}>B ✓ INFERIOR MESENTERIC · L3</Pill>
      </div>
      <Tip t={t} t0={23.5} top={866} size={30}>→ the lower gut (hindgut)</Tip>
    </Scene>
  );
};

/* 7b. Answer on Gray's 1918 Fig. 531 */
export const V7b: React.FC = () => {
  const t = useT();
  return (
    <Scene start={24.2} end={25.25} push={0.006}>
      <PlateBox74 src={P531} aspect={A531} x={30} y={100} w={800} h={740} a={24.2} b={25.25} from={[0.53, 0.66, 0.5]} to={[0.54, 0.67, 0.44]} ls={30}
        labels={[{ x: 0.555, y: 0.705, text: "inferior\nmesenteric a.", t: 24.3, hot: true, ox: 70, oy: -120 }]} />
      <Strip t={t} />
      <Tip t={t} t0={24.35} top={862} size={28} bg={C.forest} fg={C.paper}>descending + sigmoid colon, upper rectum</Tip>
    </Scene>
  );
};

/* 8. Save + cheat sheet */
export const V8: React.FC = () => {
  const t = useT();
  const s0 = 25.25;
  const b = ramp(t, s0 + 0.05, s0 + 0.4);
  return (
    <Scene start={s0} end={27.5}>
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
        <div style={{ position: "absolute", left: 36, top: 24, fontFamily: FONT, fontWeight: 800, fontSize: 29, color: C.matcha, letterSpacing: 2 }}>ABDOMINAL AORTA · JUST COUNT T12 → L4</div>
        {ORDER.map((bb, i) => (
          <div key={bb} style={{ position: "absolute", left: 36, top: 80 + i * 100, display: "flex", alignItems: "center", gap: 22, opacity: ramp(t, s0 + 0.3 + i * 0.08, s0 + 0.55 + i * 0.08) }}>
            <div style={{ width: 128, display: "flex", justifyContent: "center" }}><LChip b={bb} size={74} /></div>
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 37, color: C.forest, whiteSpace: "nowrap", lineHeight: 1.05 }}>{BNAME[bb]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, color: C.matcha, whiteSpace: "nowrap", marginTop: 3 }}>{NOTE[bb]}</div>
            </div>
          </div>
        ))}
        <div style={{ position: "absolute", left: 36, top: 600, width: 730, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.forest, lineHeight: 1.5, opacity: ramp(t, s0 + 0.7, s0 + 0.9) }}>
          <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px" }}>starts</span> T12, aortic hiatus · <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px" }}>ends</span> L4
        </div>
      </div>
    </Scene>
  );
};

/* 9. End card (≤ 1.5 s) */
export const V9: React.FC = () => {
  const t = useT();
  const s0 = 27.5;
  return (
    <Scene start={s0} end={28.7}>
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

export type { Lv };
