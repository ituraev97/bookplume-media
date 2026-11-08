import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { AlveolarSac, Alveolus, BronchialTree, FloorPlan, LV } from "./Air70";

export const ABR = 1826 / 1563;
export const ALOB = 992 / 972;
export const liveAlpha = (_t: number) => 0;

export const pop = (t: number, t0: number, d = 0.3) => {
  const p = ramp(t, t0, t0 + d);
  return { opacity: p, transform: `scale(${0.6 + 0.4 * p + 0.08 * Math.sin(Math.min(1, p) * Math.PI)})` } as React.CSSProperties;
};
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });
export const Big: React.FC<{ size?: number; children: React.ReactNode; color?: string }> = ({ size = 110, children, color = C.forest }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1, letterSpacing: -2, textAlign: "center", whiteSpace: "nowrap" }}>{children}</div>
);
const Lead: React.FC<{ x1: number; y1: number; x2: number; y2: number; p: number; col?: string }> = ({ x1, y1, x2, y2, p, col = C.banana }) =>
  p <= 0 ? null : (
    <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: p }}>
      <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke={C.paper} strokeWidth={11} strokeLinecap="round" />
      <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke={C.forest} strokeWidth={5} strokeLinecap="round" />
      <circle cx={x1} cy={y1} r={12} fill={col} stroke={C.forest} strokeWidth={5} />
    </svg>
  );
const HL: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg = C.banana }) => <span style={{ background: bg, borderRadius: 18, padding: "0 14px" }}>{children}</span>;

export const NoteCard: React.FC<{ t0: number; x: number; y: number; w: number; children: React.ReactNode; sub?: string }> = ({ t0, x, y, w, children, sub }) => {
  const t = useT();
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, ...pop(t, t0, 0.25) }}>
      <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "10px 18px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.forest, lineHeight: 1.2, boxShadow: "0 8px 20px rgba(31,42,20,0.10)" }}>
        {children}
        {sub && <div style={{ fontSize: 23, color: C.matcha, marginTop: 4 }}>{sub}</div>}
      </div>
    </div>
  );
};

/* 1. Hook: Gray's 1918 Fig. 962 (bronchi and bronchioles) visible from frame 0 */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={2.0} push={0.02}>
      <div style={center(10, pop(t, -0.4, 0.25))}>
        <Big size={96}>YOUR LUNGS HIDE</Big>
      </div>
      <div style={center(122, pop(t, -0.3, 0.25))}>
        <Big size={104}>AN <HL>APARTMENT</HL></Big>
      </div>
      <Plate
        src="plates/bronchi.png" aspect={ABR} x={40} y={265} w={780} a={-0.6} b={2.0} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.14, 0.5, 0.42]}
        labels={[{ x: 0.535, y: 0.12, text: "trachea", t: 0.9, ox: 120, oy: -10 }]}
        credit="Gray's 1918, Fig. 962 · PD"
      />
      <div style={{ position: "absolute", left: 0, top: 290, ...pop(t, 0.45, 0.25), transformOrigin: "0 50%" }}>
        <Pill size={34} bg={C.forest}>alveoli · lung anatomy</Pill>
      </div>
      <div style={{ position: "absolute", left: 590, top: 860, ...pop(t, 1.4, 0.25) }}>
        <Pill size={32} bg={C.banana} color={C.forest}>body fact 🫁</Pill>
      </div>
    </Scene>
  );
};

/* 2. Flatten every air sac → 70 m² floor plan */
export const V2: React.FC = () => {
  const t = useT();
  const fill = ramp(t, 3.9, 5.35);
  const n = Math.round(70 * fill);
  return (
    <Scene start={2.0} end={6.0} push={0.008}>
      <div style={center(15, pop(t, 2.05, 0.22))}>
        <Big size={64}>FLATTEN EVERY <HL>AIR SAC</HL></Big>
      </div>
      <div style={{ position: "absolute", left: 40, top: 120, width: 300, height: 340, ...pop(t, 2.2, 0.3) }}>
        <AlveolarSac t={t} w={290} lit={ramp(t, 3.0, 3.3)} />
      </div>
      <div style={{ position: "absolute", left: 30, top: 450, width: 310, textAlign: "center", ...pop(t, 3.1, 0.22), opacity: ramp(t, 3.1, 3.3) * (1 - ramp(t, 5.3, 5.5)) }}>
        <Pill size={30} bg={C.forest}>alveolar sac</Pill>
      </div>
      <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: ramp(t, 3.6, 3.9) }}>
        <path d={`M 350 270 C 420 250 450 260 ${360 + 120 * ramp(t, 3.6, 4.1)} 270`} fill="none" stroke={C.forest} strokeWidth={10} strokeLinecap="round" />
        <path d="M 468 252 L 494 270 L 468 288 Z" fill={C.forest} stroke={C.forest} strokeWidth={6} strokeLinejoin="round" opacity={ramp(t, 4.0, 4.1)} />
      </svg>
      <div style={{ position: "absolute", left: 510, top: 150, width: 330, height: 240, borderRadius: 34, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", ...pop(t, 3.85, 0.25) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 118, color: n === 70 ? C.banana : C.paper, lineHeight: 1 }}>{n}<span style={{ fontSize: 64 }}> m²</span></div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, color: C.matchaLight, marginTop: 6 }}>gas-exchange surface</div>
      </div>
      <div style={{ position: "absolute", left: 150, top: 515, ...pop(t, 3.9, 0.3) }}>
        <FloorPlan w={560} p={fill} rooms={ramp(t, 5.0, 5.3)} />
      </div>
      <Stamp t0={5.35} text="≈ 750 FT²" size={46} rot={-7} color={C.red} style={{ left: 540, top: 470 }} />
      <div style={{ position: "absolute", left: 140, top: 455, ...pop(t, 5.5, 0.22), transformOrigin: "0 50%" }}>
        <Pill size={28} bg={C.banana} color={C.forest}>a small one-bedroom</Pill>
      </div>
    </Scene>
  );
};

/* 3. Alveoli on Gray's 1918 Fig. 975 (schematic primary lobule) */
const V3Z0: [number, number, number] = [1.0, 0.5, 0.5];
const V3Z1: [number, number, number] = [1.1, 0.45, 0.4];
export const V3: React.FC = () => {
  const t = useT();
  const n = Math.round(480 * ramp(t, 7.5, 8.75));
  return (
    <Scene start={6.0} end={9.6} push={0.006}>
      <div style={center(15, pop(t, 6.05, 0.22))}>
        <Big size={80}><HL>ALVEOLI</HL> = AIR SACS</Big>
      </div>
      <Plate
        src="plates/lobule.png" aspect={ALOB} x={30} y={130} w={555} a={6.0} b={9.6} zoomFrom={V3Z0} zoomTo={V3Z1}
        labels={[
          { x: 0.66, y: 0.135, text: "alveolar sac", t: 6.33, ox: -70, oy: 95 },
          { x: 0.69, y: 0.47, text: "alveolus", t: 6.78, hot: true, ox: -60, oy: 110 },
          { x: 0.31, y: 0.53, text: "alveolar duct", t: 8.95, ox: 30, oy: 150 },
        ]}
        credit="Gray's 1918, Fig. 975 · PD"
      />
      <div style={{ position: "absolute", left: 600, top: 140, width: 255, height: 250, borderRadius: 32, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", ...pop(t, 7.45, 0.25) }}>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, color: C.matchaLight }}>about</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 96, color: n === 480 ? C.banana : C.paper, lineHeight: 1 }}>{n}</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper }}>MILLION</div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, color: C.matchaLight, marginTop: 4 }}>alveoli</div>
      </div>
      <div style={{ position: "absolute", left: 600, top: 420, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={pop(t, 8.1, 0.22)}><Pill size={24} bg={C.red}>pulmonary artery</Pill></div>
        <div style={pop(t, 8.35, 0.22)}><Pill size={24} bg="#3F6EA8">pulmonary vein</Pill></div>
      </div>
      <NoteCard t0={8.55} x={10} y={760} w={840} sub="Miller's old name for the space past the alveolar duct, dropped today">
        1918 atlas term: “atria” (at)
      </NoteCard>
    </Scene>
  );
};

/* 4. The airway tree: own diagram, each level lights as it is named */
const STEPS: [string, number][] = [["trachea", 11.34], ["main bronchi", 11.75], ["lobar", 12.65], ["segmental", 13.14], ["bronchioles", 13.73], ["alveoli", 14.76]];
export const V4: React.FC = () => {
  const t = useT();
  let cur = -1;
  STEPS.forEach(([, s], i) => {
    if (t >= s - 0.08) cur = i;
  });
  const lit = STEPS.map(([, s]) => ramp(t, s - 0.08, s + 0.2));
  return (
    <Scene start={9.6} end={15.55} push={0.004}>
      <div style={center(10, pop(t, 9.65, 0.22))}>
        <Big size={84}>THE <HL>AIRWAY TREE</HL></Big>
      </div>
      <div style={{ position: "absolute", left: 0, top: 110, width: 860, height: 660 }}>
        <BronchialTree t={t} drawn={ramp(t, 9.7, 11.3)} lit={lit} cur={cur} air={ramp(t, 9.7, 10.1) * (1 - ramp(t, 11.2, 11.5))} lungs={ramp(t, 9.65, 10.0)} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 330, ...pop(t, 11.8, 0.22), transformOrigin: "0 50%" }}>
        <Pill size={24} bg={C.forest}>right: wider, steeper</Pill>
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 790, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "14px 10px" }}>
        {STEPS.map(([s, t0], i) => (
          <div key={s} style={{ ...pop(t, t0 - 0.05, 0.22), display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: i === cur ? C.forest : C.card, border: `4px solid ${C.forest}`, borderRadius: 40, padding: "6px 18px 8px 8px" }}>
              <div style={{ width: 34, height: 34, borderRadius: 17, background: LV[i], border: `3px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 20, color: C.forest }}>{i + 1}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 31, color: i === cur ? C.paper : C.forest, whiteSpace: "nowrap" }}>{s}</div>
            </div>
            {i < STEPS.length - 1 && i !== 2 && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.forest }}>→</div>}
          </div>
        ))}
      </div>
    </Scene>
  );
};

/* 5. Quick test */
export const V5: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[18.39, 3], [19.03, 2], [19.67, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => {
    if (t >= s - 0.05 && t < 20.35) { n = v; n0 = s; }
  });
  const opts = ["type I alveolar cell", "type II alveolar cell", "alveolar macrophage"];
  return (
    <Scene start={15.55} end={20.33}>
      <div style={{ position: "absolute", left: 20, top: 55, width: 820, height: 830, borderRadius: 48, background: C.forest, ...pop(t, 15.58, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 56, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 130, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 64, lineHeight: 1.12, color: C.paper, ...pop(t, 16.4) }}>
          Which <span style={{ color: C.banana }}>alveolar cell</span> makes <span style={{ color: C.banana }}>SURFACTANT?</span>
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 370, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          {opts.map((o, i) => (
            <div key={o} style={{ ...pop(t, 17.15 + i * 0.25), display: "flex", alignItems: "center", gap: 18, width: 620 }}>
              <div style={{ width: 62, height: 62, flex: "0 0 62px", borderRadius: 18, background: C.banana, color: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, border: `4px solid ${C.paper}` }}>{"ABC"[i]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.paper, whiteSpace: "nowrap" }}>{o}</div>
            </div>
          ))}
        </div>
        {n !== null && (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 610, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 190, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 6. Answer: own alveolus section — type II makes surfactant, type I = thin wall for gas exchange */
export const V6: React.FC = () => {
  const t = useT();
  const AW = 740, K = AW / 600, AX = 430 - AW / 2, AY = 110; // diagram AW x AW
  const P = (deg: number, r: number) => [AX + AW / 2 + Math.cos((deg * Math.PI) / 180) * r * K, AY + AW / 2 + Math.sin((deg * Math.PI) / 180) * r * K];
  const [l2x, l2y] = P(212, 150), [r2x, r2y] = P(328, 150), [t1x, t1y] = P(100, 190), [cx, cy] = P(48, 242);
  return (
    <Scene start={20.33} end={24.78} push={0.006}>
      <div style={center(10, pop(t, 20.38, 0.25))}>
        <Pill size={50} bg={C.matcha}>B ✓ TYPE II → surfactant</Pill>
      </div>
      <div style={{ position: "absolute", left: AX, top: AY, width: AW, height: AW, ...pop(t, 20.4, 0.3) }}>
        <Alveolus t={t} w={AW} t2={ramp(t, 20.36, 20.7)} surf={ramp(t, 20.8, 21.2)} t1={ramp(t, 21.39, 21.7)} gas={ramp(t, 23.5, 23.8)} />
      </div>
      <Lead x1={l2x} y1={l2y} x2={90} y2={150} p={ramp(t, 20.5, 20.75)} col={LV[2]} />
      <Lead x1={r2x} y1={r2y} x2={770} y2={150} p={ramp(t, 20.55, 20.8)} col={LV[2]} />
      <div style={{ position: "absolute", left: 0, top: 125, ...pop(t, 20.6, 0.22), transformOrigin: "0 50%" }}>
        <Pill size={28} bg={C.banana} color={C.forest}>type II</Pill>
      </div>
      <div style={{ position: "absolute", left: 700, top: 125, ...pop(t, 20.65, 0.22) }}>
        <Pill size={28} bg={C.banana} color={C.forest}>type II</Pill>
      </div>
      <div style={{ position: "absolute", left: 290, top: 450, width: 280, textAlign: "center", ...pop(t, 21.0, 0.22) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.forest, lineHeight: 1.15 }}>
          <span style={{ background: C.banana, borderRadius: 10, padding: "0 8px" }}>surfactant</span>
          <br />
          <span style={{ fontSize: 22, color: C.matcha }}>film keeps alveoli open</span>
        </div>
      </div>
      <Lead x1={t1x} y1={t1y} x2={330} y2={815} p={ramp(t, 21.5, 21.75)} col={LV[0]} />
      <div style={{ position: "absolute", left: 150, top: 790, ...pop(t, 21.6, 0.22) }}>
        <Pill size={32} bg={C.forest}>type I · paper-thin wall</Pill>
      </div>
      <Lead x1={cx} y1={cy} x2={790} y2={760} p={ramp(t, 22.4, 22.65)} col={C.red} />
      <div style={{ position: "absolute", left: 680, top: 760, ...pop(t, 22.5, 0.22) }}>
        <Pill size={26} bg={C.red}>capillary</Pill>
      </div>
      <div style={{ position: "absolute", left: 300, top: 560, ...pop(t, 23.55, 0.22) }}>
        <Pill size={26} bg={C.forest}>O₂ in · CO₂ out</Pill>
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 880, display: "flex", justifyContent: "center", ...pop(t, 22.0, 0.22) }}>
        <Pill size={26} bg={C.card} color={C.forest} style={{ border: `3px solid ${C.line}` }}>type I cells cover ~95% of the alveolar surface</Pill>
      </div>
    </Scene>
  );
};

/* 7. Save */
export const SUMMARY = ["~480 million alveoli", "~70 m² gas-exchange surface", "trachea → main → lobar → segmental", "→ bronchioles → alveoli", "type II cells make surfactant", "type I = thin gas-exchange wall"];
export const V7: React.FC = () => {
  const t = useT();
  const b = ramp(t, 24.9, 25.25);
  return (
    <Scene start={24.78} end={26.9}>
      <div style={center(0, pop(t, 24.82))}>
        <svg width={120} height={152} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={center(165, pop(t, 24.88))}>
        <Big size={110}>SAVE THIS</Big>
      </div>
      <div style={center(290, pop(t, 25.85))}>
        <Big size={46} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ position: "absolute", left: 30, top: 385, display: "flex", flexDirection: "column", gap: 16 }}>
        {SUMMARY.map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 14, ...pop(t, 25.15 + i * 0.1), transformOrigin: "0 50%" }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: LV[i], border: `4px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.forest }}>{i + 1}</div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.forest, whiteSpace: "nowrap" }}>{s}</div>
          </div>
        ))}
      </div>
    </Scene>
  );
};

/* 8. End card (≤ 1.5 s) */
export const V8: React.FC = () => {
  const t = useT();
  const s0 = 26.9;
  return (
    <Scene start={s0} end={28.2}>
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
