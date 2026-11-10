import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, pop } from "./Scenes67";
import { PlateBox74 } from "./Scenes74";
import { ANCHOR, Cord, L4, LCOL, LETTERS, M, N } from "./Cord79";

export const A809 = 1905 / 1662;
export const A810 = 1825 / 1336;
export const PLATE = "plates/fig809_axilla.png";
export const PLATE2 = "plates/fig810_axillary.png";
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* voice times (words.json) */
export const NT: Record<N, number> = { US: 4.98, LS: 5.27, TD: 8.65, AX: 11.24, RA: 14.08 };
export const LTT: Record<L4, number> = { S: 4.04, T: 8.4, A: 11.1, R: 13.77 };
export const MN: Record<L4, { name: string; to: string }> = {
  S: { name: "Subscapular ×2 (upper + lower)", to: "subscapularis · teres major" },
  T: { name: "Thoracodorsal", to: "latissimus dorsi" },
  A: { name: "Axillary", to: "deltoid · teres minor" },
  R: { name: "Radial (the biggest)", to: "triceps · back of arm + forearm" },
};
export const SChip: React.FC<{ l: L4; size?: number; on?: number; hot?: boolean }> = ({ l, size = 64, on = 1, hot }) => (
  <div style={{ width: size, height: size, flex: `0 0 ${size}px`, borderRadius: size * 0.28, background: on > 0.5 ? LCOL[l] : "rgba(31,42,20,0.08)", border: `4px solid ${on > 0.5 ? C.forest : "rgba(31,42,20,0.25)"}`, color: on > 0.5 ? C.forest : "rgba(31,42,20,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.62, transform: `scale(${hot ? 1.16 : 1})`, boxShadow: hot ? `0 0 0 6px ${C.banana}` : "none" }}>
    {l}
  </div>
);

/* running strip: S T A R + n/5 nerves */
const Counter: React.FC<{ t: number; top?: number }> = ({ t, top = 10 }) => {
  const n = (Object.keys(NT) as N[]).filter((k) => t >= NT[k]).length;
  return (
    <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", alignItems: "center", gap: 12 }}>
      {LETTERS.map((l) => {
        const p = ramp(t, LTT[l], LTT[l] + 0.2);
        const hot = t >= LTT[l] && t < LTT[l] + 1.4;
        return <div key={l} style={{ transform: `scale(${1 + 0.25 * p * (1 - ramp(t, LTT[l] + 0.2, LTT[l] + 0.5))})` }}><SChip l={l} size={66} on={p} hot={hot} /></div>;
      })}
      <div style={{ marginLeft: 12, background: C.forest, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 36, borderRadius: 20, padding: "4px 18px 8px", textAlign: "center", whiteSpace: "nowrap" }}>{n}/5 nerves</div>
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
      const e = k * k * (3 - 2 * k);
      return [t, a[1] + (b[1] - a[1]) * e, a[2] + (b[2] - a[2]) * e, a[3] + (b[3] - a[3]) * e] as Kf;
    }
  }
  return ks[ks.length - 1];
};
const Stage: React.FC<{ t: number; k: Kf; id: string; cyOff?: number; h?: number; top?: number; children?: (P: (m: [number, number]) => [number, number]) => React.ReactNode } & Omit<React.ComponentProps<typeof Cord>, "t" | "w" | "id">> = ({ t, k, id, children, cyOff = 0, h = 940, top = 0, ...rest }) => {
  const [, s, cx, cy] = k;
  const u = (860 / 900) * s;
  const X0 = 430 - cx * u, Y0 = h / 2 + cyOff - cy * u;
  const P = (m: [number, number]) => [X0 + m[0] * u, top + Y0 + m[1] * u] as [number, number];
  return (
    <>
      <div style={{ position: "absolute", left: 0, top, width: 860, height: h, overflow: "hidden", borderRadius: 40, background: C.paper, boxShadow: `0 0 0 5px ${C.line}` }}>
        <div style={{ position: "absolute", left: X0, top: Y0 }}>
          <Cord t={t} w={860 * s} id={id} {...rest} />
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
const Tip: React.FC<{ t: number; t0: number; top: number; children: React.ReactNode; bg?: string; fg?: string; size?: number; t1?: number }> = ({ t, t0, top, children, bg = C.banana, fg = C.forest, size = 34, t1 }) =>
  t >= t0 - 0.05 && (!t1 || t < t1 + 0.2) ? (
    <div style={{ ...center(top), ...pop(t, t0, 0.25), opacity: ramp(t, t0, t0 + 0.2) * (t1 ? 1 - ramp(t, t1, t1 + 0.2) : 1) }}>
      <Pill size={size} bg={bg} color={fg}>{children}</Pill>
    </div>
  ) : null;

const LIT0: Partial<Record<N, number>> = { US: 0, LS: 0, TD: 0, AX: 0, RA: 0 };
const MUS0: Partial<Record<M, number>> = { SS: 0, TM: 0, LD: 0, DE: 0, TMi: 0, TR: 0 };

/* 1. Hook: Gray's 1918 Fig. 809 (axilla, nerves in yellow) visible from frame 0 + challenge */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={2.7} push={0.02}>
      <div style={center(22, pop(t, -0.4, 0.25))}>
        <Big size={88}>POSTERIOR CORD</Big>
      </div>
      <div style={center(120, pop(t, -0.3, 0.25))}>
        <Big size={108} color={C.red}>NAME ALL 5?</Big>
      </div>
      <PlateBox74 src={PLATE} aspect={A809} x={30} y={262} w={800} h={600} a={-0.6} b={2.7} from={[0.5, 0.5, 0.98]} to={[0.5, 0.48, 0.66]}
        labels={[{ x: 0.535, y: 0.315, text: "branches start here", t: 1.55, hot: true, ox: -40, oy: 190 }]} />
      <div style={center(884, pop(t, 0.1, 0.25))}>
        <Pill size={33} bg={C.forest}>brachial plexus · mnemonic</Pill>
      </div>
      <Stamp t0={0.7} text="5 NERVES" size={40} rot={-8} color={C.red} style={{ left: 40, top: 280, whiteSpace: "nowrap" }} />
    </Scene>
  );
};

/* 2. Mnemonic card: STAR */
export const V2: React.FC = () => {
  const t = useT();
  return (
    <Scene start={2.7} end={4.0} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 820, height: 840, borderRadius: 48, background: C.forest, ...pop(t, 2.72, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 56, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 8, color: C.banana }}>THE MNEMONIC</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 112, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.paper, opacity: ramp(t, 2.8, 3.0) }}>one word</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 230, display: "flex", justifyContent: "center", gap: 22 }}>
          {LETTERS.map((l, i) => {
            const t0 = 2.86 + i * 0.12;
            const p = ramp(t, t0, t0 + 0.2);
            const glow = ramp(t, 3.28, 3.45) * (1 - ramp(t, 3.6, 3.9));
            return (
              <div key={l} style={{ transform: `translateY(${(1 - p) * 40}px) scale(${0.7 + 0.3 * p + 0.08 * glow})`, opacity: p }}>
                <SChip l={l} size={150} hot={glow > 0.3} />
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 470, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 64, color: C.paper, opacity: ramp(t, 3.3, 3.5) }}>
          posterior cord = a <span style={{ color: C.banana }}>STAR</span>
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 600, display: "flex", justifyContent: "center", ...pop(t, 3.5, 0.25) }}>
          <div style={{ background: C.banana, borderRadius: 22, padding: "10px 28px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.forest }}>4 letters → 5 nerves</div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 712, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 32, color: "#B9D27A", opacity: ramp(t, 3.6, 3.8) }}>S counts twice: upper + lower</div>
      </div>
    </Scene>
  );
};

/* 3. S: upper + lower subscapular → subscapularis, teres major */
export const V3: React.FC = () => {
  const t = useT();
  const k = cam(t, [[4.0, 0.95, 470, 520], [4.4, 1.35, 560, 470], [6.0, 1.35, 560, 470], [6.4, 1.3, 520, 480], [8.3, 1.3, 520, 500]]);
  return (
    <Scene start={4.0} end={8.3} push={0.004}>
      <Stage t={t} k={k} id="v3" build={4.0} lit={{ US: NT.US, LS: NT.LS }} mus={{ SS: 6.26, TM: 7.41 }}
        hot={t < 6.2 ? ["US", "LS"] : []} hotM={t > 6.2 && t < 7.35 ? ["SS"] : t >= 7.35 ? ["TM"] : []} dimRest={ramp(t, 4.6, 5.0)}>
        {(P) => (
          <>
            <Call t={t} t0={4.98} t1={6.15} a={P(ANCHOR.US)} to={[640, 190]} text="upper subscapular" bg={LCOL.S} fg={C.forest} size={36} />
            <Call t={t} t0={5.27} t1={6.15} a={P(ANCHOR.LS)} to={[250, 720]} text="lower subscapular" bg={LCOL.S} fg={C.forest} size={36} />
            <Call t={t} t0={6.3} a={P(ANCHOR.SS)} to={[600, 180]} text="subscapularis" size={38} />
            <Call t={t} t0={7.45} a={P(ANCHOR.TM)} to={[250, 760]} text="teres major" size={38} />
          </>
        )}
      </Stage>
      <Counter t={t} />
      <div style={{ position: "absolute", left: 24, top: 880, ...pop(t, 4.2, 0.25), transformOrigin: "0 0" }}>
        <Pill size={26} bg={C.forest}>right shoulder from the front · red = axillary artery</Pill>
      </div>
    </Scene>
  );
};

/* 4. T: thoracodorsal → latissimus dorsi, on Gray's Fig. 809 with the MODERN name */
export const V4: React.FC = () => {
  const t = useT();
  return (
    <Scene start={8.3} end={11.0} push={0.01}>
      <PlateBox74 src={PLATE} aspect={A809} x={30} y={100} w={800} h={740} a={8.3} b={11.0} from={[0.47, 0.6, 0.62]} to={[0.47, 0.62, 0.54]} ls={34}
        labels={[
          { x: 0.483, y: 0.58, text: "thoracodorsal nerve", t: 8.65, hot: true, ox: -40, oy: -200 },
          { x: 0.395, y: 0.75, text: "latissimus dorsi", t: 9.72, ox: 60, oy: 130 },
        ]} />
      <Counter t={t} />
      <Note1918 t={t} t0={9.15} text="“long subscapular nerve” = thoracodorsal" top={866} left={0} size={24} />
    </Scene>
  );
};

/* 5. A: axillary → deltoid, teres minor */
export const V5: React.FC = () => {
  const t = useT();
  const k = cam(t, [[11.0, 1.0, 470, 520], [11.35, 1.55, 330, 380], [13.7, 1.6, 320, 380]]);
  return (
    <Scene start={11.0} end={13.7} push={0.004}>
      <Stage t={t} k={k} id="v5" lit={{ ...LIT0, RA: undefined, AX: NT.AX }} mus={{ SS: 0, TM: 0, LD: 0, DE: 12.21, TMi: 12.78 }}
        hot={t < 12.15 ? ["AX"] : []} hotM={t > 12.15 && t < 12.75 ? ["DE"] : t >= 12.75 ? ["TMi"] : []} dimRest={0.7}>
        {(P) => (
          <>
            <Call t={t} t0={11.3} a={P(ANCHOR.AX)} to={[560, 780]} text="axillary" bg={LCOL.A} fg={C.forest} size={44} />
            <Call t={t} t0={12.25} a={P(ANCHOR.DE)} to={[200, 160]} text="deltoid" size={40} />
            <Call t={t} t0={12.82} a={P(ANCHOR.TMi)} to={[640, 560]} text="teres minor" size={38} />
          </>
        )}
      </Stage>
      <Counter t={t} />
      <Tip t={t} t0={12.95} top={866} size={28} bg={C.forest} fg={C.paper}>dashed = behind the bone</Tip>
    </Scene>
  );
};

/* 6. R: radial, the biggest → back of the arm */
export const V6: React.FC = () => {
  const t = useT();
  const k = cam(t, [[13.7, 1.6, 320, 380], [14.1, 1.05, 380, 600], [16.2, 1.0, 400, 580]]);
  return (
    <Scene start={13.7} end={16.2} push={0.004}>
      <Stage t={t} k={k} id="v6" lit={{ ...LIT0, RA: NT.RA }} mus={{ ...MUS0, TR: 15.27 }} hot={t < 15.2 ? ["RA"] : []} hotM={t >= 15.2 ? ["TR"] : []}>
        {(P) => (
          <>
            <Call t={t} t0={14.12} a={P(ANCHOR.RA)} to={[600, 640]} text="radial" bg={LCOL.R} fg={C.forest} size={46} />
            <Call t={t} t0={15.3} a={P(ANCHOR.TR)} to={[560, 800]} text="triceps · back of arm" size={34} />
          </>
        )}
      </Stage>
      <Counter t={t} />
      <Tip t={t} t0={14.62} top={100} size={36}>the BIGGEST branch</Tip>
    </Scene>
  );
};

/* 7. Quick test */
export const V7: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[20.13, 3], [20.76, 2], [21.4, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < 21.95) { n = v; n0 = s; } });
  const opts = ["Radial", "Axillary", "Thoracodorsal"];
  return (
    <Scene start={16.2} end={21.95}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 820, height: 850, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 16.25, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 106, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 52, lineHeight: 1.12, color: C.paper, ...pop(t, 17.1) }}>
          Which one wraps around the <span style={{ color: "#F09A8C" }}>SURGICAL NECK</span> of the humerus?
        </div>
        <div style={{ position: "absolute", left: 36, top: 330, width: 400, height: 480, borderRadius: 30, background: C.paper, overflow: "hidden", ...pop(t, 17.5, 0.3) }}>
          <div style={{ position: "absolute", left: 200 - 300 * 1.0, top: 230 - 380 * 1.0 }}>
            <Cord t={t} w={900 * 1.0} hideDe id="v7" lit={{ US: 0, LS: 0, TD: 0, RA: 0 }} mus={{ DE: 0 }} ask={{ t0: 17.5 }} neck={ramp(t, 18.36, 18.7)} dimRest={0} />
          </div>
          <div style={{ position: "absolute", left: 16, bottom: 14, background: C.red, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 28, borderRadius: 14, padding: "2px 12px 6px", opacity: ramp(t, 18.6, 18.8) }}>surgical neck</div>
        </div>
        <div style={{ position: "absolute", left: 460, width: 350, top: 350, display: "flex", flexDirection: "column", gap: 26 }}>
          {opts.map((o, i) => (
            <div key={o} style={{ ...pop(t, 18.9 + i * 0.16), display: "flex", alignItems: "center", gap: 14, transformOrigin: "0 50%" }}>
              <div style={{ width: 58, height: 58, flex: "0 0 58px", borderRadius: 16, background: C.banana, color: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, border: `4px solid ${C.paper}` }}>{"ABC"[i]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.paper, whiteSpace: "nowrap" }}>{o}</div>
            </div>
          ))}
        </div>
        {n !== null && (
          <div key={n} style={{ position: "absolute", left: 560, top: 600, width: 200, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 170, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 8. Answer: axillary — on our diagram, then Gray's Fig. 810 (seen from behind) with modern labels */
export const V8: React.FC = () => {
  const t = useT();
  return (
    <Scene start={21.95} end={23.6} push={0.006}>
      <PlateBox74 src={PLATE2} aspect={A810} x={30} y={110} w={800} h={730} a={21.95} b={23.6} from={[0.56, 0.42, 0.7]} to={[0.58, 0.42, 0.62]} ls={32}
        labels={[
          { x: 0.53, y: 0.43, text: "axillary nerve", t: 22.1, hot: true, ox: -60, oy: 200 },
          { x: 0.465, y: 0.33, text: "teres minor", t: 22.5, ox: 50, oy: -160 },
          { x: 0.73, y: 0.48, text: "deltoid", t: 22.7, ox: 60, oy: 170 },
        ]} />
      <div style={center(24, pop(t, 22.0, 0.25))}>
        <Pill size={44} bg={C.red}>B ✓ AXILLARY · the A in STAR</Pill>
      </div>
      <Tip t={t} t0={22.9} top={866} size={28} bg={C.forest} fg={C.paper}>seen from behind · it curls around the humerus</Tip>
    </Scene>
  );
};

/* 9. Save + cheat sheet */
export const V9: React.FC = () => {
  const t = useT();
  const s0 = 23.6;
  const b = ramp(t, s0 + 0.05, s0 + 0.4);
  return (
    <Scene start={s0} end={25.9}>
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
        <div style={{ position: "absolute", left: 36, top: 26, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.matcha, letterSpacing: 2 }}>POSTERIOR CORD = STAR · 5 NERVES</div>
        {LETTERS.map((l, i) => (
          <div key={l} style={{ position: "absolute", left: 36, top: 90 + i * 128, display: "flex", alignItems: "center", gap: 22, opacity: ramp(t, s0 + 0.3 + i * 0.08, s0 + 0.55 + i * 0.08) }}>
            <SChip l={l} size={88} />
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.forest, whiteSpace: "nowrap", lineHeight: 1.05 }}>{MN[l].name}</div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 28, color: C.matcha, whiteSpace: "nowrap", marginTop: 4 }}>→ {MN[l].to}</div>
            </div>
          </div>
        ))}
        <div style={{ position: "absolute", left: 36, top: 618, fontFamily: FONT, fontWeight: 800, fontSize: 27, color: C.forest, opacity: ramp(t, s0 + 0.8, s0 + 1.0) }}>
          <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px" }}>surgical neck</span> axillary · <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px" }}>1918</span> long subscapular
        </div>
      </div>
    </Scene>
  );
};

/* 10. End card (≤ 1.5 s) */
export const V10: React.FC = () => {
  const t = useT();
  const s0 = 25.9;
  return (
    <Scene start={s0} end={27.2}>
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
