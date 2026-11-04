import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { Ribs, cartPath, ribLateral } from "./Ribs56";

export const A112 = 1579 / 2146;
const pop = (t: number, t0: number, d = 0.3) => {
  const p = ramp(t, t0, t0 + d);
  return { opacity: p, transform: `scale(${0.6 + 0.4 * p + 0.08 * Math.sin(Math.min(1, p) * Math.PI)})` } as React.CSSProperties;
};
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });
const Big: React.FC<{ size?: number; children: React.ReactNode; color?: string }> = ({ size = 110, children, color = C.forest }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1, letterSpacing: -2, textAlign: "center" }}>{children}</div>
);
export const liveAlpha = (_t: number) => 0;
const NumChip: React.FC<{ n: string; bg: string; color?: string; size?: number }> = ({ n, bg, color = C.paper, size = 96 }) => (
  <div style={{ width: size * 1.25, height: size * 1.25, borderRadius: size * 0.36, background: bg, color, border: `5px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size, boxShadow: "0 8px 0 rgba(31,42,20,0.2)" }}>{n}</div>
);
// diagram placement inside the scene
const RX = 120, RY = 80, RWID = 620;
const sc = RWID / 680;
const at = (p: [number, number]) => ({ left: RX + p[0] * sc, top: RY + p[1] * sc });

/* 1. Hook: the 1918 thorax plate, push in on the sternum */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={5.1} push={0.02}>
      <div style={center(22, { ...pop(t, 0, 0.25), whiteSpace: "nowrap" })}>
        <Big size={62}>HOW MANY RIBS REACH</Big>
      </div>
      <div style={center(92, { ...pop(t, 0.9, 0.25), whiteSpace: "nowrap" })}>
        <Big size={84} color={C.red}>YOUR BREASTBONE?</Big>
      </div>
      <Plate src="plates/thorax112.png" aspect={A112} x={200} y={190} w={450} a={-0.6} b={5.1} zoomFrom={[1, 0.5, 0.45]} zoomTo={[1.55, 0.5, 0.42]}
        labels={[{ x: 0.49, y: 0.42, text: "sternum", t: 1.9, hot: true, ox: 30, oy: 120 }]} />
      <div style={{ position: "absolute", left: 0, width: 860, top: 690, display: "flex", justifyContent: "center", gap: 26 }}>
        <div style={pop(t, 3.85, 0.22)}><NumChip n="7" bg={C.matcha} /></div>
        <div style={pop(t, 4.2, 0.22)}><NumChip n="3" bg={C.banana} color={C.forest} /></div>
        <div style={pop(t, 4.5, 0.22)}><NumChip n="2" bg={C.red} /></div>
      </div>
      <Stamp t0={2.85} text="3 NUMBERS" size={50} rot={-8} color={C.forest} style={{ left: 0, top: 560 }} />
    </Scene>
  );
};

/* 2. 12 pairs, each joined to a thoracic vertebra */
export const V2: React.FC = () => {
  const t = useT();
  const build = ramp(t, 5.3, 7.1) * 12;
  return (
    <Scene start={5.1} end={10.0} push={0.02}>
      <div style={{ position: "absolute", left: RX, top: RY }}>
        <Ribs t={t} w={RWID} build={build} spine={ramp(t, 8.25, 8.6)} nums={ramp(t, 5.6, 6.9)} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, ...pop(t, 5.6) }}>
        <Pill size={40} bg={C.forest}>12 PAIRS</Pill>
      </div>
      <div style={{ position: "absolute", left: 0, top: 84, fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.forest, opacity: 0.65 * ramp(t, 6.3, 6.6) }}>
        24 ribs in total
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 800, display: "flex", justifyContent: "center", ...pop(t, 8.28) }}>
        <Pill size={36} bg={C.banana} color={C.forest}>back: thoracic vertebrae T1–T12</Pill>
      </div>
    </Scene>
  );
};

/* 3. True ribs 1–7 → straight to the sternum */
export const V3: React.FC = () => {
  const t = useT();
  const L = ramp(t, 10.22, 10.6);
  const pu = (i: number) => ramp(t, 14.6 + (i - 1) * 0.07, 15.25 + (i - 1) * 0.07);
  return (
    <Scene start={10.0} end={15.95} push={0.02}>
      <div style={{ position: "absolute", left: RX, top: RY }}>
        <Ribs t={t} w={RWID} lit={{ T: L }} dim={{ F: 0.55 * L, FL: 0.55 * L }} nums={ramp(t, 11.66, 12.4)} numsFrom={1} numsTo={7} sternum={ramp(t, 13.45, 13.7) * (1 - 0.6 * ramp(t, 14.6, 15))}
          pulses={[1, 2, 3, 4, 5, 6, 7].flatMap((i) => [-1, 1].map((s) => ({ path: cartPath(i, s), u: pu(i), color: C.banana })))} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, display: "flex", gap: 16, alignItems: "center", ...pop(t, 10.22) }}>
        <NumChip n="7" bg={C.matcha} size={64} />
        <Big size={70} color={C.matcha}>TRUE</Big>
      </div>
      <div style={{ position: "absolute", left: 0, top: 104, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.forest, opacity: ramp(t, 11.66, 12.0) }}>ribs 1–7</div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 800, display: "flex", justifyContent: "center", gap: 16 }}>
        <div style={pop(t, 12.65)}><Pill size={34} bg={C.matcha}>DIRECT → sternum</Pill></div>
        <div style={pop(t, 14.59)}><Pill size={34} bg={C.forest}>own costal cartilage</Pill></div>
      </div>
    </Scene>
  );
};

/* 4. False ribs 8–10 → via the cartilage above */
export const V4: React.FC = () => {
  const t = useT();
  const L = ramp(t, 16.16, 16.55);
  const pu = (i: number, t0: number) => ramp(t, t0, t0 + 1.4);
  const route = (i: number, s: number) => {
    // rib i cartilage → join → down the chain to rib 7's cartilage → sternum
    const pts = [...cartPath(i, s, 0, 1, 10)];
    let k = i - 1;
    let u = i === 8 ? 0.58 : 0.45;
    while (k >= 7) {
      pts.push(...cartPath(k, s, u, k === 7 ? 1 : 1, 8).slice(1));
      if (k === 7) break;
      // the rest of each lower cartilage joins the one above at its end
      u = k === 8 ? 0.58 : 0.45;
      k -= 1;
    }
    return pts;
  };
  const r8 = (s: number) => [...cartPath(8, s, 0, 1, 10), ...cartPath(7, s, 0.58, 1, 8).slice(1)];
  const r9 = (s: number) => [...cartPath(9, s, 0, 1, 10), ...cartPath(8, s, 0.45, 1, 6).slice(1), ...cartPath(7, s, 0.58, 1, 6).slice(1)];
  const r10 = (s: number) => [...cartPath(10, s, 0, 1, 10), ...cartPath(9, s, 0.45, 1, 6).slice(1), ...cartPath(8, s, 0.45, 1, 6).slice(1), ...cartPath(7, s, 0.58, 1, 6).slice(1)];
  void route;
  return (
    <Scene start={15.95} end={22.9} push={0.02}>
      <div style={{ position: "absolute", left: RX, top: RY }}>
        <Ribs t={t} w={RWID} lit={{ T: 0.35, F: L }} dim={{ T: 0.45 * L, FL: 0.6 * L }} nums={ramp(t, 17.66, 18.4)} numsFrom={8} numsTo={10}
          pulses={[-1, 1].flatMap((s) => [
            { path: r8(s), u: pu(8, 18.95), color: C.red },
            { path: r9(s), u: pu(9, 19.2), color: C.red },
            { path: r10(s), u: pu(10, 19.45), color: C.red },
          ])} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, display: "flex", gap: 16, alignItems: "center", ...pop(t, 16.16) }}>
        <NumChip n="3" bg={C.banana} color={C.forest} size={64} />
        <Big size={70} color={C.forest}>FALSE</Big>
      </div>
      <div style={{ position: "absolute", left: 0, top: 104, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.forest, opacity: ramp(t, 17.66, 18.0) }}>ribs 8–10</div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 800, display: "flex", justifyContent: "center", gap: 16 }}>
        <div style={pop(t, 18.95)}><Pill size={34} bg={C.forest}>join the cartilage above</Pill></div>
        <div style={pop(t, 22.1)}><Pill size={34} bg={C.banana} color={C.forest}>INDIRECT</Pill></div>
      </div>
    </Scene>
  );
};

/* 5. Floating ribs 11–12 */
export const V5: React.FC = () => {
  const t = useT();
  const L = ramp(t, 23.1, 23.5);
  return (
    <Scene start={22.9} end={26.95} push={0.02}>
      <div style={{ position: "absolute", left: RX, top: RY }}>
        <Ribs t={t} w={RWID} lit={{ T: 0.35, F: 0.35, FL: L }} dim={{ T: 0.5 * L, F: 0.5 * L }} bob={ramp(t, 23.3, 23.8)} nums={ramp(t, 24.48, 25.2)} numsFrom={11} numsTo={12} noFront={ramp(t, 25.85, 26.3)} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, display: "flex", gap: 16, alignItems: "center", ...pop(t, 23.1) }}>
        <NumChip n="2" bg={C.red} size={64} />
        <Big size={70} color={C.red}>FLOATING</Big>
      </div>
      <div style={{ position: "absolute", left: 0, top: 104, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.forest, opacity: ramp(t, 24.48, 24.8) }}>ribs 11–12</div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 800, display: "flex", justifyContent: "center", ...pop(t, 25.64) }}>
        <Pill size={34} bg={C.red}>no front attachment</Pill>
      </div>
    </Scene>
  );
};

/* 6. Mnemonic card: 7 · 3 · 2, false = 8–12 */
const Row: React.FC<{ t: number; t0: number; n: string; word: string; ribs: string; how: string; bg: string; fg?: string; top: number; pulse: number }> = ({ t, t0, n, word, ribs, how, bg, fg = C.paper, top, pulse }) => {
  const p = ramp(t, t0, t0 + 0.3);
  const k = 1 + 0.12 * Math.sin(Math.PI * Math.min(1, Math.max(0, pulse)));
  return (
    <div style={{ position: "absolute", left: 40, width: 640, top, height: 128, display: "flex", alignItems: "center", gap: 28, opacity: p, transform: `translateX(${(1 - p) * -40}px)` }}>
      <div style={{ width: 128, height: 118, borderRadius: 28, background: bg, color: fg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 92, transform: `scale(${k})`, boxShadow: "0 8px 0 rgba(0,0,0,0.25)" }}>{n}</div>
      <div style={{ fontFamily: FONT, fontWeight: 800, color: C.paper }}>
        <div style={{ fontSize: 58, lineHeight: 1 }}>
          <span style={{ color: C.banana, fontSize: 70 }}>{word[0]}</span>
          {word.slice(1)} <span style={{ fontSize: 34, opacity: 0.75 }}>{ribs}</span>
        </div>
        <div style={{ fontSize: 30, color: C.matchaLight, marginTop: 6 }}>{how}</div>
      </div>
    </div>
  );
};
export const V6: React.FC = () => {
  const t = useT();
  const br = ramp(t, 29.3, 29.9);
  return (
    <Scene start={26.95} end={33.25}>
      <div style={{ position: "absolute", left: 10, top: 10, width: 840, height: 900, borderRadius: 48, background: C.forest, ...pop(t, 27.0, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 40, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 7, color: C.matchaLight, opacity: ramp(t, 27.1, 27.4) }}>REMEMBER: 7 · 3 · 2</div>
        <Row t={t} t0={27.2} n="7" word="True" ribs="ribs 1–7" how="own cartilage → sternum" bg={C.matcha} top={110} pulse={(t - 31.05) / 0.3} />
        <Row t={t} t0={27.45} n="3" word="False" ribs="ribs 8–10" how="cartilage above → sternum" bg={C.banana} fg={C.forest} top={262} pulse={(t - 31.36) / 0.3} />
        <Row t={t} t0={27.7} n="2" word="Floating" ribs="ribs 11–12" how="no front attachment" bg={C.red} top={414} pulse={(t - 31.6) / 0.3} />
        {/* bracket: false = 8–12 */}
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={840} height={900}>
          <path d={`M770 ${270} L790 270 L790 ${270 + 262 * br} ${br >= 1 ? "L770 532" : ""}`} fill="none" stroke={C.banana} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" opacity={br > 0 ? 1 : 0} />
        </svg>
        <div style={{ position: "absolute", right: 70, top: 380, transform: `rotate(-90deg) translateY(-40px)`, transformOrigin: "100% 0", fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.banana, opacity: ramp(t, 29.6, 29.9), whiteSpace: "nowrap" }}></div>
        <div style={{ position: "absolute", left: 40, width: 760, top: 590, display: "flex", justifyContent: "center", ...pop(t, 28.05) }}>
          <div style={{ background: "rgba(247,246,236,0.1)", border: `3px solid ${C.banana}`, borderRadius: 24, padding: "14px 28px 18px", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper, whiteSpace: "nowrap" }}>
            technically <span style={{ color: C.banana }}>FALSE</span> = ribs <span style={{ color: C.banana }}>{t < 29.95 ? "8–10 + 11–12" : "8–12"}</span>
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 730, display: "flex", justifyContent: "center", ...pop(t, 32.1) }}>
          <div style={{ background: C.banana, color: C.forest, borderRadius: 26, padding: "12px 34px 16px", fontFamily: FONT, fontWeight: 800, fontSize: 56, whiteSpace: "nowrap" }}>7 + 3 + 2 = 12 pairs</div>
        </div>
      </div>
    </Scene>
  );
};

/* 7. The 1918 atlas with modern labels */
export const V7: React.FC = () => {
  const t = useT();
  return (
    <Scene start={33.25} end={36.3} push={0.01}>
      <Plate src="plates/thorax112.png" aspect={A112} x={130} y={0} w={600} a={33.25} b={36.3} zoomFrom={[1, 0.5, 0.5]} zoomTo={[1.06, 0.5, 0.55]}
        labels={[
          { x: 0.49, y: 0.3, text: "sternum", t: 33.5, ox: 50, oy: -130 },
          { x: 0.62, y: 0.37, text: "true 1–7", t: 33.9, hot: true, ox: 14, oy: 66 },
          { x: 0.17, y: 0.63, text: "false 8–10", t: 34.4, ox: 20, oy: 90 },
          { x: 0.82, y: 0.965, text: "floating 11–12", t: 34.9, ox: -40, oy: -90 },
        ]} />
      <div style={{ position: "absolute", left: 0, width: 860, top: 838, display: "flex", justifyContent: "center", ...pop(t, 35.45) }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 20px 11px", fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.forest, whiteSpace: "nowrap" }}>
          <span style={{ color: C.matcha }}>1918 atlas labels:</span> "first thoracic" = T1 · "first lumbar" = L1
        </div>
      </div>
    </Scene>
  );
};

/* 8. Quick test */
export const V8: React.FC = () => {
  const t = useT();
  const c0 = 38.95;
  const n = t < c0 ? null : t < c0 + 0.5 ? 3 : t < c0 + 1.0 ? 2 : t < c0 + 1.5 ? 1 : null;
  return (
    <Scene start={36.3} end={40.45}>
      <div style={{ position: "absolute", left: 10, top: 30, width: 840, height: 860, borderRadius: 48, background: C.forest, ...pop(t, 36.35, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 56, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 140, display: "flex", justifyContent: "center", alignItems: "center", gap: 24, ...pop(t, 37.19) }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 96, color: C.paper }}>RIB</div>
          <div style={{ width: 150, height: 150, borderRadius: 75, background: C.paper, color: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 104, border: `6px solid ${C.banana}` }}>9</div>
        </div>
        <div style={{ position: "absolute", left: 60, width: 720, top: 350, display: "flex", flexDirection: "column", gap: 20 }}>
          {([["TRUE", C.matcha, 37.71], ["FALSE", C.banana, 37.96], ["FLOATING", C.red, 38.46]] as [string, string, number][]).map(([x, col, t0]) => (
            <div key={x} style={{ ...pop(t, t0), background: C.matchaDark, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 50, padding: "14px 30px 18px", borderRadius: 24, display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ width: 34, height: 34, borderRadius: 17, background: col, border: `4px solid ${C.paper}` }} />
              {x}?
            </div>
          ))}
        </div>
        {n && (
          <div style={{ position: "absolute", left: 0, width: 840, top: 730, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 116, color: C.banana, lineHeight: 1, transform: `scale(${1.3 - 0.3 * ramp(t, Math.floor((t - c0) / 0.5) * 0.5 + c0, Math.floor((t - c0) / 0.5) * 0.5 + c0 + 0.15)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 9. Answer: false — rib 9's cartilage joins rib 8 */
export const V9: React.FC = () => {
  const t = useT();
  const z = ramp(t, 40.5, 41.3);
  const s = 1 + 0.55 * z;
  // zoom toward the viewer-right lower cartilages
  const fx = 470, fy = 520;
  const pu = ramp(t, 41.1, 42.3);
  return (
    <Scene start={40.45} end={43.8} push={0.01}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 860, height: 800, overflow: "hidden", borderRadius: 40 }}>
        <div style={{ position: "absolute", left: RX, top: RY, transformOrigin: `${fx}px ${fy}px`, transform: `scale(${s}) translate(${-60 * z}px, ${-120 * z}px)` }}>
          <Ribs t={t} w={RWID} lit={{ T: 0.4, F: 1, FL: 0.4 }} dim={{ T: 0.5, FL: 0.5 }} focus={9} focusA={ramp(t, 40.55, 40.9)} nums={1} numsFrom={7} numsTo={10}
            pulses={[{ path: [...cartPath(9, 1, 0, 1, 12), ...cartPath(8, 1, 0.45, 1, 8).slice(1)], u: pu, color: C.red }]} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, ...pop(t, 40.54) }}>
        <Pill size={52} bg={C.banana} color={C.forest}>FALSE ✓</Pill>
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 820, display: "flex", justifyContent: "center", gap: 16 }}>
        <div style={pop(t, 41.67)}><Pill size={34} bg={C.forest}>joins rib 8's cartilage</Pill></div>
        <div style={pop(t, 42.7)}><Pill size={34} bg={C.card} color={C.forest} style={{ border: `4px solid ${C.forest}` }}><span style={{ color: C.red }}>✕</span> sternum</Pill></div>
      </div>
    </Scene>
  );
};
void ribLateral;

/* 10. Save */
export const V10: React.FC = () => {
  const t = useT();
  const b = ramp(t, 43.85, 44.2);
  return (
    <Scene start={43.8} end={45.98}>
      <div style={center(40, pop(t, 43.85))}>
        <svg width={220} height={280} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={center(360, pop(t, 43.91))}>
        <Big size={120}>SAVE THIS</Big>
      </div>
      <div style={center(510, pop(t, 44.62))}>
        <Big size={58} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ ...center(640), gap: 18, ...pop(t, 45.2) }}>
        {([["7 true", C.matcha, C.paper], ["3 false", C.banana, C.forest], ["2 floating", C.red, C.paper]] as [string, string, string][]).map(([x, bg, fg]) => (
          <div key={x} style={{ background: bg, color: fg, fontFamily: FONT, fontWeight: 800, fontSize: 44, padding: "12px 26px 16px", borderRadius: 18 }}>{x}</div>
        ))}
      </div>
    </Scene>
  );
};

/* 11. End card */
export const V11: React.FC = () => {
  const t = useT();
  return (
    <Scene start={45.98} end={50.6}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, 46.03, 0.35) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.banana, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 47.16, 47.5) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 46) * 5))})`, opacity: ramp(t, 46.18, 46.45) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
void at;
