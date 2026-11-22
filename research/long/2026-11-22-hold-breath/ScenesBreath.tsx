import React from "react";
import { C, FONT, ramp, useT } from "./kit";
import { Facts, Stage, LogoMark } from "./Chrome16";
import { Plate } from "./Plates";
import { Gauge, HeartShape, K, beatAt } from "./IllusStand";
import { Alveolus, B, BreathTrace, Chest, ChemoMap, Clip3D, HoldGraph, Tag3D, Tug, clamp, lerp } from "./IllusBreath";

const abs = (x: number, y: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: x, top: y, ...extra });
const pop = (t: number, t0: number, d = 0.3): React.CSSProperties => {
  const p = ramp(t, t0, t0 + d);
  return { opacity: p, transform: `scale(${0.6 + 0.4 * p + 0.08 * Math.sin(Math.min(1, p) * Math.PI)})` };
};
const Big: React.FC<{ size?: number; color?: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ size = 100, color = C.forest, children, style }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1.04, letterSpacing: -2, ...style }}>{children}</div>
);
const Mk: React.FC<{ p: number; children: React.ReactNode }> = ({ p, children }) => (
  <span style={{ background: `linear-gradient(${C.banana}, ${C.banana}) no-repeat 0 88% / ${p * 100}% 38%` }}>{children}</span>
);
const Layer: React.FC<{ o: number; children: React.ReactNode }> = ({ o, children }) => (o <= 0.001 ? null : <div style={{ position: "absolute", inset: 0, opacity: o }}>{children}</div>);
const win = (t: number, a: number, b: number) => ramp(t, a - 0.2, a + 0.2) * (1 - ramp(t, b - 0.2, b + 0.2));
const Chip: React.FC<{ t0: number; bg?: string; color?: string; size?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ t0, bg = C.forest, color = C.paper, size = 38, children, style }) => {
  const t = useT();
  return (
    <div style={{ ...pop(t, t0), background: bg, color, borderRadius: 24, padding: "14px 26px", fontFamily: FONT, fontWeight: 800, fontSize: size, whiteSpace: "nowrap", border: bg === C.card ? `3px solid ${C.line}` : "none", ...style }}>
      {children}
    </div>
  );
};
const Note1918: React.FC<{ t0: number; text: React.ReactNode; x: number; y: number }> = ({ t0, text, x, y }) => {
  const t = useT();
  return (
    <div style={abs(x, y, { ...pop(t, t0), background: C.card, border: `3px dashed ${C.matcha}`, borderRadius: 20, padding: "10px 20px", fontFamily: FONT, fontWeight: 700, fontSize: 26, color: C.forest })}>
      {text}
    </div>
  );
};
const Clock: React.FC<{ text: string; t0: number }> = ({ text, t0 }) => {
  const t = useT();
  const p = ramp(t, t0, t0 + 0.3);
  return (
    <div style={abs(900, -138, { opacity: p, transform: `translateX(-50%) scale(${0.7 + 0.3 * p})`, display: "flex", alignItems: "center", gap: 14, background: C.red, color: "#fff", borderRadius: 22, padding: "8px 22px 10px", fontFamily: FONT, fontWeight: 800, fontSize: 40, boxShadow: "0 8px 0 rgba(31,42,20,0.18)" })}>
      <svg width={40} height={40} viewBox="0 0 40 40">
        <circle cx={20} cy={22} r={15} fill="none" stroke="#fff" strokeWidth={5} />
        <path d={`M20 22 L${20 + 10 * Math.sin(t * 3)} ${22 - 10 * Math.cos(t * 3)}`} stroke="#fff" strokeWidth={4} strokeLinecap="round" />
        <rect x={16} y={2} width={8} height={5} rx={2} fill="#fff" />
      </svg>
      {text}
    </div>
  );
};
const BigStat: React.FC<{ t0: number; big: string; text: string; bg?: string; w?: number; size?: number }> = ({ t0, big, text, bg = C.forest, w = 680, size = 120 }) => {
  const t = useT();
  return (
    <div style={{ ...pop(t, t0), width: w, background: bg, color: C.paper, borderRadius: 34, padding: "24px 34px", fontFamily: FONT, fontWeight: 800 }}>
      <div style={{ fontSize: size, lineHeight: 1, color: C.banana }}>{big}</div>
      <div style={{ fontSize: 38, marginTop: 10, lineHeight: 1.15 }}>{text}</div>
    </div>
  );
};
const CR_DIA = "3D: Human Diaphragm · Devden (Sketchfab, CC BY 4.0)";
const CR_LUNG = "3D: Realistic Human Lungs · neshallads (Sketchfab, CC BY 4.0)";
const CR_RESP = "3D: Respiratory System · Vikrama Raghuraman (Sketchfab, CC BY 4.0)";
const CR_SKEL = "3D: Free Pack - Human Skeleton · PolyOne Studio (Sketchfab, CC BY 4.0)";

/* ================= INTRO 0.6 – 33.4 ================= */
export const SIntro: React.FC = () => {
  const t = useT();
  const a = 1 - ramp(t, 12.3, 12.7);
  const b = ramp(t, 12.3, 12.7) * (1 - ramp(t, 21.0, 21.4));
  const c = ramp(t, 21.0, 21.4) * (1 - ramp(t, 27.4, 27.8));
  const d = ramp(t, 27.4, 27.8);
  const inh = ramp(t, 0.7, 1.9);
  const steps = [
    { k: "0 s", n: "the lock", t0: 29.9 },
    { k: "1–20 s", n: "still working", t0: 30.3 },
    { k: "20–40 s", n: "the alarm", t0: 30.7 },
    { k: "brain", n: "control room", t0: 31.1 },
    { k: "!", n: "breaking point", t0: 31.5 },
    { k: "gasp", n: "first breath", t0: 31.9 },
  ];
  return (
    <Stage a={-1} b={33.6}>
      <Layer o={a}>
        <div style={abs(30, -40)}>
          <Chest w={640} t={t} inh={inh} flow={ramp(t, 0.7, 0.9) * (1 - ramp(t, 1.8, 2.0))} lock={ramp(t, 1.9, 2.3)} labels={0} />
        </div>
        <div style={abs(760, 0, { width: 1020, ...pop(t, 0) })}>
          <Big size={88}>
            What happens when you <Mk p={ramp(t, 0.6, 1.6)}>hold your breath</Mk>
          </Big>
          <Big size={46} color={C.matcha} style={{ marginTop: 14 }}>second by second</Big>
        </div>
        <div style={abs(760, 300, { ...pop(t, 1.9), transform: `${pop(t, 1.9).transform} rotate(-3deg)` })}>
          <div style={{ background: C.red, color: "#fff", borderRadius: 26, padding: "18px 40px", fontFamily: FONT, fontWeight: 800, fontSize: 92, border: `6px solid ${C.forest}` }}>HOLD IT. NOW.</div>
        </div>
        <div style={abs(760, 470, { width: 1000, display: "flex", flexWrap: "wrap", gap: 18 })}>
          <Chip t0={3.6} bg={C.card} color={C.forest}>🪑 sit down</Chip>
          <Chip t0={4.6} bg={C.card} color={C.forest}>dry land</Chip>
          <Chip t0={5.6} bg={C.matcha}>breathe whenever you need</Chip>
        </div>
        <div style={abs(760, 650, { ...pop(t, 9.6), display: "flex", alignItems: "center", gap: 16 })}>
          <Big size={52} color={C.red}>↙ your timer</Big>
          <Big size={38} color={C.matcha}>counts your hold</Big>
        </div>
      </Layer>
      <Layer o={b}>
        <div style={abs(0, 20, { width: 1800, textAlign: "center", ...pop(t, 12.7) })}>
          <Big size={84}>When you finally gasp for air…</Big>
          <Big size={84} color={C.red} style={{ marginTop: 8, opacity: ramp(t, 15.6, 16.0) }}>did you run out of oxygen?</Big>
        </div>
        <div style={abs(300, 330, { width: 1200, display: "flex", justifyContent: "center", gap: 60 })}>
          <div style={{ ...pop(t, 18.2), background: C.card, border: `4px solid ${C.line}`, borderRadius: 34, padding: "30px 50px", fontFamily: FONT, fontWeight: 800, textAlign: "center" }}>
            <div style={{ fontSize: 40, color: C.matcha }}>most people say</div>
            <div style={{ fontSize: 130, color: C.forest, lineHeight: 1 }}>YES</div>
          </div>
          <div style={{ ...pop(t, 19.8), background: C.red, borderRadius: 34, padding: "30px 50px", fontFamily: FONT, fontWeight: 800, textAlign: "center", transform: `${pop(t, 19.8).transform} rotate(4deg)`, border: `6px solid ${C.forest}` }}>
            <div style={{ fontSize: 40, color: "#FFE3DF" }}>most people are</div>
            <div style={{ fontSize: 130, color: "#fff", lineHeight: 1 }}>WRONG</div>
          </div>
        </div>
      </Layer>
      <Layer o={c}>
        <div style={abs(40, 40, { width: 860 })}>
          <Big size={64}>In breath-hold studies, blood oxygen is often still…</Big>
        </div>
        <div style={abs(40, 330, { ...pop(t, 25.0) })}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
            <Big size={70} color={B.o2}>above</Big>
            <Big size={250} color={B.o2} style={{ letterSpacing: -8 }}>98%</Big>
          </div>
          <Big size={50} style={{ marginTop: 6 }}>when people <Mk p={ramp(t, 26.6, 27.4)}>give up</Mk></Big>
        </div>
        <div style={abs(1000, 20, { ...pop(t, 21.6) })}>
          <svg width={760} height={680} viewBox="0 0 760 680">
            <circle cx={380} cy={330} r={290} fill={C.card} stroke={C.line} strokeWidth={14} />
            <circle cx={380} cy={330} r={290} fill="none" stroke={B.o2} strokeWidth={34} strokeDasharray={`${2 * Math.PI * 290 * 0.98 * ramp(t, 22.9, 25.2)} 9999`} transform="rotate(-90 380 330)" strokeLinecap="round" />
            <text x={380} y={330} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={120} fill={B.o2}>O₂</text>
            <text x={380} y={420} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill={C.forest}>saturation</text>
          </svg>
        </div>
      </Layer>
      <Layer o={d}>
        <div style={abs(60, 20)}>
          <Big size={72}>So what forces you to breathe?</Big>
          <Big size={46} color={C.matcha} style={{ marginTop: 10 }}>from your <Mk p={ramp(t, 31.9, 32.6)}>diaphragm</Mk> to your <Mk p={ramp(t, 32.8, 33.4)}>brainstem</Mk></Big>
        </div>
        <div style={abs(60, 260, { width: 1680, display: "flex", gap: 16 })}>
          {steps.map((s, i) => (
            <div key={i} style={{ flex: 1, ...pop(t, s.t0), background: i % 2 ? C.card : C.forest, color: i % 2 ? C.forest : C.paper, border: i % 2 ? `3px solid ${C.line}` : "none", borderRadius: 26, padding: "26px 10px", textAlign: "center", fontFamily: FONT, fontWeight: 800 }}>
              <div style={{ fontSize: 50, color: i % 2 ? C.red : C.banana }}>{s.k}</div>
              <div style={{ fontSize: 30, marginTop: 6 }}>{s.n}</div>
            </div>
          ))}
        </div>
        <div style={abs(60, 520, { display: "flex", gap: 30, alignItems: "center", ...pop(t, 32.4) })}>
          <div style={{ width: 110, height: 110, flex: "none", borderRadius: 55, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LogoMark size={82} />
          </div>
          <Big size={52}>Every structure today = <Mk p={ramp(t, 32.6, 33.4)}>exam material</Mk></Big>
        </div>
      </Layer>
    </Stage>
  );
};

/* ================= 1. SECOND 0: THE LOCK 34.5 – 99.8 ================= */
export const SLock: React.FC = () => {
  const t = useT();
  const a = 1 - ramp(t, 46.0, 46.4);
  const b = ramp(t, 46.0, 46.4) * (1 - ramp(t, 54.1, 54.5));
  const c = ramp(t, 54.1, 54.5) * (1 - ramp(t, 74.8, 75.2));
  const d = ramp(t, 74.8, 75.2) * (1 - ramp(t, 90.7, 91.1));
  const e = ramp(t, 90.7, 91.1);
  const inh2 = ramp(t, 46.6, 50.2);
  return (
    <Stage a={36.9} b={99.8}>
      <Clock text="SECOND 0" t0={37.0} />
      <Layer o={a}>
        <Clip3D name="diaph" a={36.9} b={46.2} n={270} x={0} y={20} credit={CR_DIA} />
        <Tag3D t0={38.8} x={650} y={230} text="diaphragm" hot />
        <Facts x={1100} w={680} items={[
          { t: 38.8, text: "diaphragm = a dome of muscle under your lungs", bg: C.forest },
          { t: 42.3, text: "contracts → the dome flattens + moves down", bg: K.muscle },
          { t: 44.8, text: "toward your belly ↓" },
        ]} />
      </Layer>
      <Layer o={b}>
        <div style={abs(40, -40)}>
          <Chest w={600} t={t} inh={inh2} flow={ramp(t, 52.8, 53.2)} ribsHl={ramp(t, 46.9, 47.2)} diaHl={0} />
        </div>
        <Facts x={760} w={1000} items={[
          { t: 46.3, text: "external intercostal muscles", bg: C.forest },
          { t: 48.7, text: "pull the ribs up and out ↗" },
          { t: 50.5, text: "chest bigger → pressure inside ↓", bg: K.vein },
          { t: 53.2, text: "→ air rushes in", bg: C.red },
        ]} />
      </Layer>
      <Layer o={c}>
        <Plate src="plates/phrenic806.png" aspect={0.8429} x={0} y={0} w={600} a={54.2} b={75.0} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.15, 0.55, 0.6]}
          labels={[
            { x: 0.63, y: 0.66, text: "phrenic nerve", t: 56.3, side: "l", hot: true },
            { x: 0.3, y: 0.84, text: "diaphragm", t: 55.3, side: "r" },
          ]} credit="Gray's 1918, Fig. 806 · PD" />
        <div style={abs(660, 0, { width: 1120 })}>
          <Big size={58}>One nerve runs the diaphragm: <Mk p={ramp(t, 56.3, 57.2)}>the phrenic nerve</Mk></Big>
        </div>
        <div style={abs(660, 170, { display: "flex", gap: 20 })}>
          {[["C3", 58.7], ["C4", 59.5], ["C5", 60.5]].map(([s, t0], i) => (
            <div key={i} style={{ ...pop(t, t0 as number), width: 170, height: 150, borderRadius: 30, background: B.nerve, border: `5px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.forest }}>{s}</div>
          ))}
          <div style={{ ...pop(t, 61.3), alignSelf: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.matcha }}>spinal nerves<br />in your neck</div>
        </div>
        <div style={abs(660, 360, { ...pop(t, 62.4), background: C.forest, borderRadius: 34, padding: "24px 34px", width: 1060 })}>
          <Big size={58} color={C.banana}>"C3, 4 and 5 keep the diaphragm alive"</Big>
        </div>
        <div style={abs(660, 540, { width: 1120, display: "flex", flexWrap: "wrap", gap: 16 })}>
          <Chip t0={67.9} bg={C.red}>its only motor nerve</Chip>
          <Chip t0={70.6} bg={C.card} color={C.forest}>starts beside the anterior scalene</Chip>
          <Chip t0={72.8} bg={C.card} color={C.forest}>runs down past the heart ↓</Chip>
        </div>
      </Layer>
      <Layer o={d}>
        <Clip3D name="larynx" a={75.0} b={90.9} n={270} x={0} y={20} credit={CR_LUNG} speed={0.6} />
        <Tag3D t0={80.3} x={575} y={230} text="airway closes" hot />
        <Facts x={1100} w={680} items={[
          { t: 77.5, text: "chest stays at that volume", bg: C.forest },
          { t: 82.5, big: "≈ 500 mL", text: "one quiet breath (tidal volume)" },
          { t: 86.4, big: "≈ 6 L", text: "full lungs, adult man · ≈ 4.2 L woman", bg: K.vein },
        ]} />
      </Layer>
      <Layer o={e}>
        <div style={abs(40, 10)}>
          <Big size={64}>Bigger breath → <Mk p={ramp(t, 91.1, 92.0)}>longer hold</Mk></Big>
          <Big size={36} color={C.matcha} style={{ marginTop: 10 }}>one lab study, face in room-temperature water (Frontiers in Physiology, 2021)</Big>
        </div>
        {[
          { t0: 94.3, lab: "after a full breath", s: 55, col: B.o2 },
          { t0: 97.2, lab: "after a normal breath out", s: 30, col: C.red },
        ].map((r, i) => {
          const p = ramp(t, r.t0, r.t0 + 1.2);
          return (
            <div key={i} style={abs(40, 230 + i * 220, { opacity: ramp(t, r.t0 - 0.2, r.t0 + 0.2) })}>
              <Big size={42} style={{ marginBottom: 10 }}>{r.lab}</Big>
              <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                <div style={{ width: 22 * r.s * p, height: 100, borderRadius: 24, background: r.col, border: `4px solid ${C.forest}` }} />
                <Big size={90} color={r.col}>≈ {Math.round(r.s * p)} s</Big>
              </div>
            </div>
          );
        })}
      </Layer>
    </Stage>
  );
};

/* ================= 2. SECONDS 1–20: STILL WORKING 100.9 – 150.1 ================= */
export const SWorking: React.FC = () => {
  const t = useT();
  const a = 1 - ramp(t, 112.4, 112.8);
  const b = ramp(t, 112.4, 112.8) * (1 - ramp(t, 121.1, 121.5));
  const c = ramp(t, 121.1, 121.5);
  return (
    <Stage a={103.3} b={150.1}>
      <Clock text="SECONDS 1–20" t0={103.4} />
      <Layer o={a}>
        <Clip3D name="airway" a={103.3} b={112.6} n={360} x={0} y={20} credit={CR_RESP} />
        <Tag3D t0={106.3} t1={108.3} x={525} y={200} text="trachea" hot />
        <Tag3D t0={108.4} t1={109.8} x={600} y={330} text="main bronchi" hot />
        <Tag3D t0={110.1} x={690} y={350} text="smaller branches" hot />
        <Facts x={1100} w={680} items={[
          { t: 103.6, text: "nothing moves… but your lungs keep working", bg: C.forest },
          { t: 106.3, text: "trachea → right + left main bronchi" },
          { t: 109.8, text: "→ smaller and smaller branches", bg: K.vein },
        ]} />
      </Layer>
      <Layer o={b}>
        <Plate src="plates/lobule975.png" aspect={1.0072} x={0} y={0} w={700} a={112.6} b={121.3} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.12, 0.55, 0.4]}
          labels={[
            { x: 0.70, y: 0.56, text: "alveolus", t: 113.3, side: "r", hot: true },
            { x: 0.60, y: 0.17, text: "alveolar sac", t: 114.6, side: "r" },
            { x: 0.24, y: 0.86, text: "blood vessel", t: 115.8, side: "r" },
          ]} credit="Gray's 1918, Fig. 975 · PD" />
        <div style={abs(760, 10, { width: 1020 })}>
          <Big size={62}>At the very end: the <Mk p={ramp(t, 113.3, 114.2)}>alveoli</Mk></Big>
          <Big size={42} color={C.matcha} style={{ marginTop: 12 }}>tiny air sacs wrapped in capillaries</Big>
        </div>
        <div style={abs(760, 250, { ...pop(t, 117.2), background: C.forest, borderRadius: 34, padding: "26px 34px", width: 980 })}>
          <Big size={56} color={C.paper}>gas exchange <span style={{ color: C.banana }}>doesn't stop</span> when you hold your breath</Big>
        </div>
        <Note1918 t0={115.0} x={760} y={520} text={<>1918 atlas labels: <b>a</b> = alveolus · <b>a.s.</b> = alveolar sac · <b>at</b> = atrium</>} />
      </Layer>
      <Layer o={c}>
        <div style={abs(0, 0)}>
          <Alveolus w={1000} t={t} hold={ramp(t, 133.4, 138.4)} o2On={ramp(t, 121.4, 121.8)} co2On={ramp(t, 125.3, 125.7)} />
        </div>
        <Facts x={1060} w={720} items={[
          { t: 121.4, text: "O₂: alveoli → blood", bg: B.o2 },
          { t: 125.3, text: "CO₂: blood → alveoli", bg: B.co2D },
          { t: 129.7, text: "…but you're not breathing it out", bg: C.red },
          { t: 133.5, text: "O₂ in the lungs slowly ↓ · CO₂ slowly ↑" },
          { t: 140.7, text: "every cell makes CO₂, every second", bg: C.forest },
          { t: 147.5, text: "blood O₂ barely moves at first (lots of stored air)", bg: B.o2 },
        ]} />
      </Layer>
    </Stage>
  );
};

/* ================= 3. SECONDS 20–40: THE ALARM 151.2 – 231.6 ================= */
export const SAlarm: React.FC = () => {
  const t = useT();
  const a = 1 - ramp(t, 167.3, 167.7);
  const b = ramp(t, 167.3, 167.7) * (1 - ramp(t, 191.8, 192.2));
  const c = ramp(t, 191.8, 192.2) * (1 - ramp(t, 223.9, 224.3));
  const d = ramp(t, 223.9, 224.3);
  const eq = [
    { t0: 158.6, s: "CO₂", col: B.co2D },
    { t0: 160.4, s: "+ H₂O", col: K.vein },
    { t0: 161.3, s: "→ H₂CO₃", col: C.forest },
    { t0: 163.1, s: "→ H⁺", col: C.red },
    { t0: 163.6, s: "+ HCO₃⁻", col: C.matcha },
  ];
  return (
    <Stage a={153.6} b={231.7}>
      <Clock text="SECONDS 20–40" t0={153.7} />
      <Layer o={a}>
        <div style={abs(0, 10, { width: 1800, textAlign: "center" })}>
          <Big size={80}><Mk p={ramp(t, 153.7, 154.8)}>CO₂</Mk> is the signal your body watches</Big>
        </div>
        <div style={abs(0, 200, { width: 1800, display: "flex", justifyContent: "center", gap: 18 })}>
          {eq.map((x, i) => (
            <div key={i} style={{ ...pop(t, x.t0), background: x.col, color: "#fff", borderRadius: 28, padding: "26px 30px", fontFamily: FONT, fontWeight: 800, fontSize: 76 }}>{x.s}</div>
          ))}
        </div>
        <div style={abs(0, 370, { width: 1800, display: "flex", justifyContent: "center", gap: 40 })}>
          <Chip t0={161.3} bg={C.card} color={C.forest} size={40}>H₂CO₃ = carbonic acid</Chip>
          <Chip t0={163.6} bg={C.card} color={C.forest} size={40}>H⁺ = hydrogen ions</Chip>
        </div>
        <div style={abs(0, 500, { width: 1800, textAlign: "center", ...pop(t, 165.3) })}>
          <div style={{ display: "inline-block", background: C.red, borderRadius: 30, padding: "18px 40px" }}>
            <Big size={60} color="#fff">blood pH ↓ = a little more acidic</Big>
          </div>
        </div>
      </Layer>
      <Layer o={b}>
        <Plate src="plates/brain715.png" aspect={1.4163} x={0} y={0} w={1000} a={167.5} b={192.0} zoomFrom={[1.0, 0.5, 0.55]} zoomTo={[1.9, 0.52, 0.8]}
          labels={[
            { x: 0.537, y: 0.875, text: "medulla oblongata", t: 171.9, side: "l", hot: true },
            { x: 0.47, y: 0.77, text: "pons", t: 172.4, side: "l" },
          ]} credit="Gray's 1918, Fig. 715 · PD" />
        <Facts x={1060} w={720} items={[
          { t: 169.0, text: "central chemoreceptors: on the surface of the medulla", bg: C.forest },
          { t: 174.6, text: "CO₂ crosses into the cerebrospinal fluid (CSF) → its pH ↓", bg: K.vein },
          { t: 181.7, text: "they sense pH, not CO₂ directly", bg: C.red },
          { t: 187.6, big: "≈ 80%", text: "of your response to rising CO₂" },
        ]} />
      </Layer>
      <Layer o={c}>
        <div style={abs(20, -40)}>
          <ChemoMap w={640} t={t} central={1} carotid={ramp(t, 194.9, 195.3)} aortic={ramp(t, 203.0, 203.4)} sig9={ramp(t, 199.6, 200.0)} sig10={ramp(t, 206.9, 207.3)} hl={t < 203 ? "cb" : t < 211.9 ? "ab" : t < 221 ? "cb" : ""} />
        </div>
        <Facts x={760} w={1020} items={[
          { t: 194.9, text: "carotid bodies: where the common carotid splits", bg: K.nerve9 },
          { t: 199.6, big: "IX", text: "glossopharyngeal nerve" },
          { t: 203.0, text: "aortic bodies: near the arch of the aorta · vagus nerve (X) · add very little in humans", bg: K.nerve10 },
          { t: 211.9, text: "only the carotid bodies sense O₂ — and not much until ≈ 60 mmHg (normal ≈ 100)", bg: C.red },
        ]} />
      </Layer>
      <Layer o={d}>
        <div style={abs(0, 40, { width: 1800, textAlign: "center" })}>
          <Big size={64} color={C.matcha}>during a normal breath hold</Big>
          <div style={{ ...pop(t, 226.4), marginTop: 30, display: "inline-block", background: C.red, borderRadius: 40, padding: "30px 60px", border: `6px solid ${C.forest}`, transform: `${pop(t, 226.4).transform} rotate(${Math.sin(t * 30) * 2 * ramp(t, 227.7, 228.0) * (1 - ramp(t, 229.5, 229.8))}deg)` }}>
            <Big size={110} color="#fff">🔔 the CO₂ alarm rings first</Big>
          </div>
          <Big size={58} style={{ marginTop: 40, opacity: ramp(t, 229.7, 230.1) }}>That's the urge you're feeling <Mk p={ramp(t, 230.5, 231.3)}>right now</Mk></Big>
        </div>
      </Layer>
    </Stage>
  );
};

/* ================= 4. THE CONTROL ROOM 232.7 – 279.4 ================= */
export const SControl: React.FC = () => {
  const t = useT();
  const a = 1 - ramp(t, 254.6, 255.0);
  const b = ramp(t, 254.6, 255.0) * (1 - ramp(t, 265.8, 266.2));
  const c = ramp(t, 265.8, 266.2);
  const hr = lerp(1.2, 0.95, ramp(t, 269.9, 271.0));
  return (
    <Stage a={235.2} b={279.5}>
      <Layer o={a}>
        <Plate src="plates/brain715.png" aspect={1.4163} x={0} y={0} w={1000} a={235.2} b={254.8} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.7, 0.5, 0.78]}
          labels={[
            { x: 0.537, y: 0.875, text: "medulla", t: 240.4, side: "l", hot: true },
            { x: 0.47, y: 0.77, text: "pons", t: 252.7, side: "l", hot: true },
            { x: 0.40, y: 0.28, text: "cerebral cortex", t: 235.4, side: "r" },
          ]} credit="Gray's 1918, Fig. 715 · PD" />
        <Facts x={1060} w={720} items={[
          { t: 237.3, text: "automatic breathing centers = brainstem", bg: C.forest },
          { t: 241.3, text: "dorsal respiratory group → the basic rhythm", bg: C.red },
          { t: 246.2, text: "ventral respiratory group → forced breathing (exercise)", bg: K.vein },
          { t: 251.4, text: "pons → adjusts rate + depth" },
        ]} />
      </Layer>
      <Layer o={b}>
        <div style={abs(0, 20, { width: 1800, textAlign: "center" })}>
          <Big size={70}>While you hold, the <Mk p={ramp(t, 257.9, 258.6)}>rhythm keeps running</Mk></Big>
        </div>
        <div style={abs(420, 220)}>
          <Tug w={960} t={t} pos={-0.55 + 0.12 * Math.sin(t * 3.1) + 0.1 * ramp(t, 259.2, 261.4)} />
        </div>
        <div style={abs(0, 560, { width: 1800, display: "flex", justifyContent: "center", gap: 40 })}>
          <Chip t0={259.4} bg={C.red} size={42}>brainstem: still sending "breathe"</Chip>
          <Chip t0={263.2} bg={C.matcha} size={42}>cortex: overriding it on purpose</Chip>
        </div>
      </Layer>
      <Layer o={c}>
        <div style={abs(30, 10)}>
          <Big size={64}>Your <Mk p={ramp(t, 266.1, 267.0)}>heart</Mk> joins in</Big>
        </div>
        <div style={abs(40, 140)}>
          <svg width={520} height={480} viewBox="0 0 520 480">
            <HeartShape cx={260} cy={240} size={340} beat={beatAt(t, hr)} />
          </svg>
        </div>
        <div style={abs(620, 140, { display: "flex", flexDirection: "column", gap: 24 })}>
          <div style={{ ...pop(t, 269.1), background: K.vein, color: "#fff", borderRadius: 30, padding: "22px 30px", fontFamily: FONT, fontWeight: 800, fontSize: 52 }}>heart rate ↓ a little <span style={{ fontSize: 34, color: "#DCE8FA" }}>· vagus nerve</span></div>
          <div style={{ ...pop(t, 271.7), background: C.red, color: "#fff", borderRadius: 30, padding: "22px 30px", fontFamily: FONT, fontWeight: 800, fontSize: 52 }}>blood pressure ↑ <span style={{ fontSize: 34, color: "#FFE3DF" }}>· sympathetic nerves</span></div>
          <div style={{ ...pop(t, 274.9), background: C.forest, color: C.paper, borderRadius: 30, padding: "22px 30px", fontFamily: FONT, fontWeight: 800, fontSize: 52 }}>= part of the <span style={{ color: C.banana }}>diving response</span></div>
          <div style={{ ...pop(t, 277.0), background: C.card, border: `4px solid ${C.line}`, color: C.forest, borderRadius: 30, padding: "18px 30px", fontFamily: FONT, fontWeight: 800, fontSize: 42 }}>much stronger with your face in cold water 🌊</div>
        </div>
      </Layer>
    </Stage>
  );
};

/* ================= 5. THE BREAKING POINT 280.5 – 339.6 ================= */
export const SBreak: React.FC = () => {
  const t = useT();
  const a = 1 - ramp(t, 294.5, 294.9);
  const b = ramp(t, 294.5, 294.9) * (1 - ramp(t, 304.5, 304.9));
  const c = ramp(t, 304.5, 304.9) * (1 - ramp(t, 318.7, 319.1));
  const d = ramp(t, 318.7, 319.1);
  return (
    <Stage a={282.9} b={339.7}>
      <Layer o={a}>
        <div style={abs(0, 0)}>
          <HoldGraph w={1040} cur={ramp(t, 283.0, 292.0)} bp={ramp(t, 291.9, 292.3)} />
        </div>
        <Facts x={1100} w={680} items={[
          { t: 283.0, text: "CO₂ keeps rising → the urge grows", bg: C.forest },
          { t: 289.4, big: "≈ 50 mmHg", text: "CO₂ in the lungs at the breaking point", bg: C.red },
          { t: 293.2, big: "≈ 40", text: "where it started (normal)" },
        ]} />
      </Layer>
      <Layer o={b}>
        <Clip3D name="diaph" a={294.7} b={304.7} n={270} x={0} y={20} credit={CR_DIA} speed={0.9} />
        <div style={abs(0, 20, { width: 1040, height: 700, pointerEvents: "none" })}>
          {t > 297.4 && t < 304.7 && (
            <div style={abs(700, 120, { transform: `translate(${Math.sin(t * 40) * 6}px, ${Math.cos(t * 33) * 4}px)` })}>
              <div style={{ background: C.red, color: "#fff", borderRadius: 18, padding: "8px 18px", fontFamily: FONT, fontWeight: 800, fontSize: 40, border: "4px solid #fff" }}>twitch! twitch!</div>
            </div>
          )}
        </div>
        <Facts x={1100} w={680} items={[
          { t: 297.4, text: "your diaphragm starts to twitch", bg: K.muscle },
          { t: 299.8, text: "= involuntary breathing movements" },
          { t: 303.5, big: "struggle phase", text: "what researchers call it", bg: C.red },
        ]} />
      </Layer>
      <Layer o={c}>
        <div style={abs(0, 20, { width: 1800, textAlign: "center" })}>
          <Big size={64}>Some people push past it for a while…</Big>
        </div>
        <div style={abs(420, 170)}>
          <Tug w={960} t={t} pos={lerp(-0.2, 1.0, ramp(t, 307.6, 310.3)) + 0.08 * Math.sin(t * 5) * (1 - ramp(t, 310, 310.5))} />
        </div>
        <div style={abs(0, 500, { width: 1800, textAlign: "center", ...pop(t, 308.5) })}>
          <div style={{ display: "inline-block", background: C.red, borderRadius: 30, padding: "18px 40px", border: `5px solid ${C.forest}` }}>
            <Big size={60} color="#fff">the automatic drive always wins (on dry land)</Big>
          </div>
        </div>
      </Layer>
      <Layer o={d}>
        <div style={abs(0, 0)}>
          <Big size={58}>Exam detail: <Mk p={ramp(t, 321.5, 323.0)}>breathing fast + deep first</Mk></Big>
        </div>
        <div style={abs(0, 130, { display: "flex", gap: 24, alignItems: "center" })}>
          <Chip t0={324.1} bg={B.co2D} size={46}>blows off CO₂ ↓</Chip>
          <Chip t0={326.4} bg={C.card} color={C.forest} size={46}>barely adds O₂</Chip>
          <Chip t0={328.6} bg={C.red} size={46}>silences the alarm 🔕</Chip>
        </div>
        <div style={abs(0, 300, { ...pop(t, 330.2), width: 1780, background: C.card, border: `6px solid ${C.red}`, borderRadius: 36, padding: "30px 40px" })}>
          <Big size={44} color={C.red}>⚠ CDC warning</Big>
          <Big size={52} style={{ marginTop: 12 }}>Hyperventilating before swimming underwater can lead to <Mk p={ramp(t, 335.1, 336.5)}>blacking out from low oxygen</Mk> — before the urge to breathe ever comes.</Big>
        </div>
      </Layer>
    </Stage>
  );
};

/* ================= 6. THE FIRST BREATH 340.7 – 372.6 ================= */
export const SFirst: React.FC = () => {
  const t = useT();
  const a = 1 - ramp(t, 348.2, 348.6);
  const b = ramp(t, 348.2, 348.6) * (1 - ramp(t, 356.3, 356.7));
  const c = ramp(t, 356.3, 356.7);
  return (
    <Stage a={343.0} b={372.7}>
      <Layer o={a}>
        <div style={abs(40, -40)}>
          <Chest w={600} t={t} inh={1 - ramp(t, 345.5, 347.6)} diaHl={0} />
        </div>
        <Facts x={760} w={1000} items={[
          { t: 343.0, text: "breathing out a normal breath = passive", bg: C.forest },
          { t: 345.5, text: "the diaphragm relaxes ↑", bg: K.muscle },
          { t: 347.0, text: "the lungs recoil" },
        ]} />
      </Layer>
      <Layer o={b}>
        <Clip3D name="ribs" a={348.4} b={356.5} n={240} x={0} y={20} credit={CR_SKEL} />
        <Tag3D t0={350.9} x={700} y={300} text="rib cage lifts" hot />
        <Facts x={1100} w={680} items={[
          { t: 348.6, text: "diaphragm contracts hard → big breath in", bg: C.red },
          { t: 352.3, text: "extra CO₂ blown off in the next few breaths", bg: B.co2D },
          { t: 356.3, text: "→ deeper + faster breaths" },
        ]} />
      </Layer>
      <Layer o={c}>
        <div style={abs(0, 0)}>
          <BreathTrace w={1040} cur={lerp(0.55, 1, ramp(t, 356.6, 366.5))} />
        </div>
        <div style={abs(0, 360, { width: 1040, display: "flex", flexDirection: "column", gap: 18 })}>
          <Chip t0={358.8} bg={K.vein} size={40} style={{ width: "fit-content" }}>CSF pH back to normal → chemoreceptors calm down</Chip>
          <Chip t0={364.2} bg={C.card} color={C.forest} size={40} style={{ width: "fit-content" }}>heart rate + blood pressure settle</Chip>
        </div>
        <div style={abs(1100, 40)}>
          <BigStat t0={368.6} big="12–18" text="breaths a minute at rest — without thinking" w={680} size={150} />
        </div>
      </Layer>
    </Stage>
  );
};

/* ================= 7. EXAM CHEAT SHEET 373.7 – 409.9 ================= */
export const SCheat: React.FC = () => {
  const t = useT();
  const cards = [
    { t0: 375.7, k: "Main drive", v: "CO₂ (through pH), not O₂", col: C.red },
    { t0: 380.9, k: "Central chemoreceptors", v: "medulla · pH of CSF", col: C.forest },
    { t0: 386.4, k: "Peripheral chemoreceptors", v: "carotid bodies (IX) · aortic bodies (X) · only they sense low O₂ (< ≈ 60)", col: K.nerve10 },
    { t0: 396.5, k: "Rhythm", v: "dorsal respiratory group (medulla) · pons fine-tunes", col: K.vein },
    { t0: 401.7, k: "Diaphragm", v: "phrenic nerve C3, 4, 5", col: B.o2 },
    { t0: 406.1, k: "Quiet breathing", v: "in = active · out = passive", col: C.matchaDark },
  ];
  return (
    <Stage a={376.0} b={410.0}>
      <div style={abs(0, -10)}>
        <Big size={58}>Exam cheat sheet ✍️</Big>
      </div>
      <div style={abs(0, 90, { width: 1800, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 22 })}>
        {cards.map((x, i) => (
          <div key={i} style={{ ...pop(t, x.t0), background: x.col, color: "#fff", borderRadius: 30, padding: "24px 26px", fontFamily: FONT, fontWeight: 800, minHeight: 250 }}>
            <div style={{ fontSize: 30, color: C.banana, letterSpacing: 1 }}>{x.k}</div>
            <div style={{ fontSize: 42, marginTop: 10, lineHeight: 1.15 }}>{x.v}</div>
          </div>
        ))}
      </div>
    </Stage>
  );
};

/* ================= 8. QUICK QUIZ + OUTRO 410.95 – END ================= */
const QS = [
  { q: "What mainly drives the urge to breathe during a breath hold?", o: ["falling oxygen", "rising CO₂ (pH ↓)", "a tired diaphragm", "lungs running out of air"], a: 1, ask: 415.0, cd: 419.3, rev: 422.5, end: 426.6 },
  { q: "Which spinal nerves form the phrenic nerve?", o: ["C1–C2", "C3, C4, C5", "C5–T1", "T1–T12"], a: 1, ask: 426.9, cd: 430.4, rev: 433.6, end: 435.8 },
  { q: "Which nerve carries signals from the carotid bodies?", o: ["vagus (X)", "phrenic", "glossopharyngeal (IX)", "hypoglossal (XII)"], a: 2, ask: 436.1, cd: 440.1, rev: 443.3, end: 446.6 },
];
export const SQuiz: React.FC = () => {
  const t = useT();
  const outro = ramp(t, 446.6, 447.0);
  return (
    <Stage a={413.3} b={466}>
      <Layer o={1 - ramp(t, 414.8, 415.1)}>
        <div style={abs(0, 200, { width: 1800, textAlign: "center", ...pop(t, 413.4) })}>
          <Big size={130}>3 questions</Big>
          <Big size={56} color={C.matcha}>answer before the timer runs out</Big>
        </div>
      </Layer>
      {QS.map((Q, qi) => {
        const o = win(t, Q.ask, Q.end);
        if (o <= 0) return null;
        const rev = t >= Q.rev;
        const left = clamp((Q.rev - t) / (Q.rev - Q.cd));
        const secs = Math.ceil(Q.rev - t);
        return (
          <Layer key={qi} o={o}>
            <div style={abs(60, 10, { fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: C.red })}>QUESTION {qi + 1} / 3</div>
            <div style={abs(60, 70, { width: 1400 })}>
              <Big size={68}>{Q.q}</Big>
            </div>
            <div style={abs(60, 300, { width: 1400, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 })}>
              {Q.o.map((op, i) => {
                const good = rev && i === Q.a;
                const bad = rev && i !== Q.a;
                const pp = pop(t, Q.ask + 1.0 + i * 0.25);
                return (
                  <div key={i} style={{ ...pp, background: good ? C.matcha : C.card, color: good ? C.paper : C.forest, border: `4px solid ${good ? C.matchaDark : C.line}`, opacity: bad ? 0.4 : pp.opacity, borderRadius: 30, padding: "36px 32px", fontFamily: FONT, fontWeight: 800, fontSize: 48 }}>
                    {String.fromCharCode(65 + i)}. {op} {good ? "✓" : ""}
                  </div>
                );
              })}
            </div>
            <div style={abs(1500, 300)}>
              <svg width={280} height={280} viewBox="0 0 260 260" style={{ overflow: "visible" }}>
                <circle cx={130} cy={130} r={110} fill={rev ? C.matcha : C.card} stroke={C.line} strokeWidth={18} />
                {!rev && t >= Q.cd && <circle cx={130} cy={130} r={110} fill="none" stroke={C.red} strokeWidth={18} strokeDasharray={`${2 * Math.PI * 110 * left} 999`} transform="rotate(-90 130 130)" strokeLinecap="round" />}
                <text x={130} y={rev ? 160 : 166} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={rev ? 110 : 120} fill={rev ? C.paper : C.forest}>
                  {rev ? "✓" : t >= Q.cd ? Math.max(1, Math.min(3, secs)) : "?"}
                </text>
              </svg>
            </div>
          </Layer>
        );
      })}
      <Layer o={outro}>
        <div style={abs(40, 20, { width: 960 })}>
          <Big size={70}>Comment 2 numbers:</Big>
          <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 18 }}>
            {[
              ["⏱", "how long you held your breath", C.red],
              ["?/3", "your quiz score", C.matcha],
            ].map(([s, l, col], i) => (
              <div key={i} style={{ ...pop(t, 447.0 + i * 0.5), display: "flex", alignItems: "center", gap: 22, fontFamily: FONT, fontWeight: 800 }}>
                <div style={{ width: 170, background: col as string, color: C.paper, borderRadius: 22, padding: "14px 0", textAlign: "center", fontSize: 58 }}>{s}</div>
                <div style={{ fontSize: 50, color: C.forest }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ ...pop(t, 449.4), marginTop: 30, background: C.banana, border: `4px solid ${C.forest}`, borderRadius: 26, padding: "16px 26px", fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.forest, width: "fit-content" }}>💬 e.g. "52 s · 3/3"</div>
        </div>
        <div style={abs(1020, 30, { width: 760, ...pop(t, 453.0), background: C.forest, borderRadius: 36, padding: "32px 36px", fontFamily: FONT, fontWeight: 800, color: C.paper })}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 84, height: 84, borderRadius: 42, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LogoMark size={64} />
            </div>
            <div style={{ fontSize: 44 }}>Book Plume</div>
          </div>
          <div style={{ fontSize: 54, marginTop: 22, lineHeight: 1.12 }}>Anatomy flash cards for review on the go</div>
          <div style={{ fontSize: 34, marginTop: 16, color: C.banana }}>↓ link in the description</div>
        </div>
        <div style={abs(1020, 520, { ...pop(t, 458.9) })}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ background: C.red, color: "#FFFFFF", borderRadius: 18, padding: "18px 40px", fontFamily: FONT, fontWeight: 800, fontSize: 52, transform: `scale(${1 + 0.05 * Math.sin(t * 5)})` }}>SUBSCRIBE</div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.forest, width: 360 }}>which moment should we slow down next?</div>
          </div>
        </div>
      </Layer>
    </Stage>
  );
};

export { Gauge };
