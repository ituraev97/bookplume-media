import React from "react";
import { C, FONT, ramp, useT } from "./kit";
import { Facts, Stage, LogoMark } from "./Chrome16";
import { Plate } from "./Plates";
import { BPGraph, Body, Brain, Firing, Gauge, HeartShape, K, Kidney, MusclePump, ReflexMap, RespPump, VeinArtery, beatAt, clamp, lerp } from "./IllusStand";

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
const Note1918: React.FC<{ t0: number; name: string; modern: string; x: number; y: number }> = ({ t0, name, modern, x, y }) => {
  const t = useT();
  return (
    <div style={abs(x, y, { ...pop(t, t0), background: C.card, border: `3px dashed ${C.matcha}`, borderRadius: 20, padding: "10px 20px", fontFamily: FONT, fontWeight: 700, fontSize: 26, color: C.forest })}>
      1918 atlas name: <b>{name}</b> = {modern}
    </div>
  );
};
const Arrow: React.FC<{ o?: number; dir?: "down" | "right"; size?: number; color?: string }> = ({ o = 1, dir = "right", size = 60, color = C.forest }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" style={{ opacity: o, transform: dir === "down" ? "rotate(90deg)" : "none", flex: "none" }}>
    <path d="M6 30 L44 30" stroke={color} strokeWidth={9} strokeLinecap="round" />
    <path d="M32 14 L50 30 L32 46" stroke={color} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
/** the "time stamp" pill used in each chapter, top-left */
const Clock: React.FC<{ text: string; t0: number; x?: number; y?: number }> = ({ text, t0 }) => {
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

/* ================= INTRO 0.6 – 37.84 ================= */
export const SIntro: React.FC = () => {
  const t = useT();
  const a = 1 - ramp(t, 12.2, 12.6);
  const b = ramp(t, 12.2, 12.6) * (1 - ramp(t, 21.2, 21.6));
  const c = ramp(t, 21.2, 21.6) * (1 - ramp(t, 29.7, 30.1));
  const d = ramp(t, 29.7, 30.1);
  const lie = 1 - ramp(t, 1.9, 3.0);
  const dim = ramp(t, 3.3, 4.2) * (1 - ramp(t, 9.3, 10.6));
  const steps = [
    { k: "0 s", n: "gravity", t0: 30.4 },
    { k: "1 s", n: "sensors", t0: 30.8 },
    { k: "2–10 s", n: "reflex", t0: 31.2 },
    { k: "10 s", n: "head rush", t0: 31.6 },
    { k: "10–30 s", n: "recovery", t0: 32.0 },
    { k: "min", n: "staying up", t0: 32.4 },
  ];
  return (
    <Stage a={-1} b={37.6}>
      <Layer o={a}>
        <div style={abs(-20, -60)}>
          <Body w={860} t={t} lie={lie} pool={ramp(t, 2.6, 4.0) * (1 - ramp(t, 9.5, 11.5)) * 0.8} dim={dim} grav={ramp(t, 2.8, 3.4) * (1 - ramp(t, 9.5, 10.5))} legVeins={0.5} />
        </div>
        <div style={abs(860, 20, { width: 920, ...pop(t, 0) })}>
          <Big size={92}>
            What happens when you <Mk p={ramp(t, 0.4, 1.3)}>stand up too fast</Mk>
          </Big>
          <Big size={50} color={C.matcha} style={{ marginTop: 16 }}>second by second</Big>
        </div>
        <div style={abs(860, 380, { width: 900, display: "flex", flexWrap: "wrap", gap: 18 })}>
          <Chip t0={4.4} bg="#5E5E5E">the room goes gray</Chip>
          <Chip t0={6.0} bg={C.red}>head feels light</Chip>
          <Chip t0={7.4} bg={C.card} color={C.forest}>vision dims at the edges</Chip>
          <Chip t0={9.4} bg={C.matcha}>…then everything's fine again</Chip>
        </div>
      </Layer>
      <Layer o={b}>
        <div style={abs(0, 30, { width: 1800, textAlign: "center", ...pop(t, 12.4) })}>
          <Big size={110}>What just happened?</Big>
          <Big size={70} color={C.red} style={{ marginTop: 10, opacity: ramp(t, 14.1, 14.5) }}>And what fixed it?</Big>
        </div>
        <div style={abs(420, 360, { width: 960, display: "flex", alignItems: "center", justifyContent: "center", gap: 40, ...pop(t, 16.5) })}>
          <div style={{ width: 240, height: 240, borderRadius: 120, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <svg width={240} height={240} viewBox="0 0 240 240" style={{ position: "absolute" }}>
              <circle cx={120} cy={120} r={96} fill="none" stroke={C.line} strokeWidth={16} opacity={0.3} />
              <circle cx={120} cy={120} r={96} fill="none" stroke={C.banana} strokeWidth={16} strokeDasharray={`${2 * Math.PI * 96 * ramp(t, 16.6, 20.8)} 999`} transform="rotate(-90 120 120)" strokeLinecap="round" />
            </svg>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>{Math.round(15 * ramp(t, 16.6, 20.8))} s</div>
          </div>
          <Big size={64} style={{ width: 620 }}>one of the body's <Mk p={ramp(t, 19.2, 20.4)}>fastest reflexes</Mk></Big>
        </div>
      </Layer>
      <Layer o={c}>
        <div style={abs(0, -10)}>
          <ReflexMap w={1000} t={t} hl={t > 22.6 && t < 24.2 ? "sinus" : t < 25.6 ? "med" : t < 27.2 ? "" : t < 28.6 ? "heart" : ""}
            show={{ sensors: ramp(t, 21.8, 22.4), med: ramp(t, 23.6, 24.2), aff: ramp(t, 25.4, 26.0), brake: ramp(t, 26.8, 27.4), gas: ramp(t, 26.8, 27.4), heart: ramp(t, 26.8, 27.4), vessels: ramp(t, 27.8, 28.4) }} />
        </div>
        <Facts x={1060} w={720} items={[
          { t: 22.6, text: "sensors in your neck", bg: C.forest },
          { t: 24.1, text: "a control center in your brainstem" },
          { t: 25.6, text: "2 cranial nerves", big: "IX + X" },
          { t: 27.2, text: "your heart + almost every blood vessel", bg: C.red },
        ]} />
      </Layer>
      <Layer o={d}>
        <div style={abs(60, 20)}>
          <Big size={76}>Slowed down, <Mk p={ramp(t, 30.4, 31.4)}>second by second</Mk></Big>
        </div>
        <div style={abs(60, 190, { width: 1680, display: "flex", gap: 16 })}>
          {steps.map((s, i) => (
            <div key={i} style={{ flex: 1, ...pop(t, s.t0), background: i % 2 ? C.card : C.forest, color: i % 2 ? C.forest : C.paper, border: i % 2 ? `3px solid ${C.line}` : "none", borderRadius: 26, padding: "22px 10px", textAlign: "center", fontFamily: FONT, fontWeight: 800 }}>
              <div style={{ fontSize: 48, color: i % 2 ? C.red : C.banana }}>{s.k}</div>
              <div style={{ fontSize: 30, marginTop: 6 }}>{s.n}</div>
            </div>
          ))}
        </div>
        <div style={abs(60, 470, { display: "flex", gap: 30, alignItems: "center", ...pop(t, 33.6) })}>
          <div style={{ width: 110, height: 110, flex: "none", borderRadius: 55, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LogoMark size={82} />
          </div>
          <Big size={56}>Every structure today = <Mk p={ramp(t, 34.6, 35.8)}>exam material</Mk></Big>
        </div>
      </Layer>
    </Stage>
  );
};

/* ================= 1. SECOND 0: GRAVITY 37.84 – 93.97 ================= */
export const SGravity: React.FC = () => {
  const t = useT();
  const a = 1 - ramp(t, 55.1, 55.5);
  const b = ramp(t, 55.1, 55.5) * (1 - ramp(t, 67.2, 67.6));
  const c = ramp(t, 67.2, 67.6) * (1 - ramp(t, 78.2, 78.6));
  const d = ramp(t, 78.2, 78.6);
  const pool = ramp(t, 45.4, 48.6);
  const chain = [
    { t0: 78.6, txt: "venous return", sub: "less blood back to the heart" },
    { t0: 84.6, txt: "stroke volume", sub: "less per beat" },
    { t0: 87.4, txt: "cardiac output", sub: "less per minute" },
    { t0: 89.6, txt: "blood pressure", sub: "falls with it" },
  ];
  return (
    <Stage a={40.2} b={93.8}>
      <Clock text="SECOND 0" t0={40.3} x={0} y={0} />
      <Layer o={a}>
        <div style={abs(0, 40)}>
          <Body w={720} t={t} lie={1 - ramp(t, 45.3, 46.4)} pool={pool} grav={ramp(t, 45.3, 45.8)} legVeins={pool} gut={pool} />
        </div>
        <div style={abs(780, 10, { width: 1000 })}>
          <Big size={70}>Lying down: blood spread <Mk p={ramp(t, 41.2, 42.6)}>evenly</Mk></Big>
          <Big size={70} color={C.red} style={{ marginTop: 14, opacity: ramp(t, 45.3, 45.7) }}>Standing: gravity pulls it down</Big>
        </div>
        <div style={abs(780, 300, { ...pop(t, 48.0), background: C.forest, color: C.paper, borderRadius: 34, padding: "26px 36px", fontFamily: FONT, fontWeight: 800, width: 900 })}>
          <div style={{ fontSize: 120, lineHeight: 1, color: C.banana }}>300–800 mL</div>
          <div style={{ fontSize: 42, marginTop: 10 }}>of blood pools in your legs</div>
        </div>
        <div style={abs(780, 600, { display: "flex", gap: 20, alignItems: "center", ...pop(t, 51.6) })}>
          <svg width={70} height={110} viewBox="0 0 70 110">
            <rect x={6} y={10} width={58} height={94} rx={12} fill={C.red} stroke={C.forest} strokeWidth={5} />
            <rect x={14} y={2} width={42} height={12} rx={5} fill="#BBB" stroke={C.forest} strokeWidth={4} />
            <rect x={6} y={40} width={58} height={30} fill="#fff" opacity={0.85} />
          </svg>
          <Big size={46}>≈ a soda can's worth, or more</Big>
        </div>
      </Layer>
      <Layer o={b}>
        <div style={abs(0, 60)}>
          <VeinArtery w={900} fill={ramp(t, 57.8, 61.8)} />
        </div>
        <div style={abs(40, 520, { width: 860 })}>
          <Big size={52}>Veins are built to <Mk p={ramp(t, 60.0, 61.4)}>stretch and store</Mk> blood</Big>
        </div>
        <div style={abs(1000, 60, { ...pop(t, 62.2), width: 760, background: K.vein, color: "#fff", borderRadius: 40, padding: "36px 40px", fontFamily: FONT, fontWeight: 800 })}>
          <div style={{ fontSize: 200, lineHeight: 0.95 }}>64%</div>
          <div style={{ fontSize: 46, marginTop: 14 }}>of your blood sits in your systemic veins at any moment</div>
        </div>
      </Layer>
      <Layer o={c}>
        <Plate src="plates/leg581b.png" aspect={0.4753} x={40} y={0} w={352} a={67.3} b={78.4} zoomFrom={[1.05, 0.6, 0.45]} zoomTo={[1.2, 0.65, 0.55]}
          labels={[{ x: 0.7, y: 0.56, text: "GSV", t: 69.6, side: "l", hot: true }]} credit="Gray's 1918 · PD" />
        <Plate src="plates/portal591.png" aspect={0.652} x={440} y={0} w={482} a={71.9} b={78.4} zoomFrom={[1.1, 0.45, 0.4]} zoomTo={[1.3, 0.42, 0.38]}
          labels={[
            { x: 0.4, y: 0.29, text: "portal vein", t: 76.4, side: "r", hot: true },
            { x: 0.47, y: 0.6, text: "gut veins", t: 73.4, side: "r" },
          ]} credit="Gray's 1918 · PD" />
        <Facts x={1000} w={780} items={[
          { t: 67.4, text: "legs: big veins widen and fill", bg: C.forest },
          { t: 69.6, text: "GSV = great saphenous vein", bg: C.red },
          { t: 73.0, text: "gut: the splanchnic veins fill too", bg: K.vein },
          { t: 76.2, text: "→ they drain into the portal vein" },
        ]} />
      </Layer>
      <Layer o={d}>
        <div style={abs(60, 10)}>
          <Big size={66}>Less in = less out</Big>
        </div>
        <div style={abs(60, 130, { width: 1180, display: "flex", flexDirection: "column", gap: 14 })}>
          {chain.map((x, i) => {
            const p = ramp(t, x.t0 - 0.1, x.t0 + 0.3);
            const last = i === chain.length - 1;
            return (
              <div key={i} style={{ opacity: p, transform: `translateX(${(1 - p) * 60}px)`, display: "flex", alignItems: "center", gap: 24, background: last ? C.red : C.card, border: `3px solid ${last ? C.red : C.line}`, borderRadius: 26, padding: "12px 26px", fontFamily: FONT, fontWeight: 800 }}>
                <div style={{ fontSize: 70, color: last ? C.banana : C.red, width: 70 }}>↓</div>
                <div style={{ fontSize: 50, color: last ? C.paper : C.forest, width: 470 }}>{x.txt}</div>
                <div style={{ fontSize: 34, color: last ? C.paper : C.matchaDark }}>{x.sub}</div>
              </div>
            );
          })}
        </div>
        <div style={abs(1300, 120, { ...pop(t, 79.0) })}>
          <Gauge w={440} v={lerp(0.78, 0.18, ramp(t, 87.4, 92.0))} />
        </div>
        <div style={abs(1380, 470, { ...pop(t, 83.2) })}>
          <svg width={280} height={260} viewBox="0 0 280 260">
            <HeartShape cx={140} cy={130} size={170} beat={beatAt(t, 1.3) * lerp(1, 0.4, ramp(t, 84.5, 87))} />
          </svg>
        </div>
      </Layer>
    </Stage>
  );
};

/* ================= 2. SECOND 1: THE SENSORS 93.97 – 135.53 ================= */
export const SSensors: React.FC = () => {
  const t = useT();
  const a = 1 - ramp(t, 103.0, 103.4);
  const b = ramp(t, 103.0, 103.4) * (1 - ramp(t, 118.4, 118.8));
  const c = ramp(t, 118.4, 118.8);
  // pressure + firing for the stretch demo
  const p = t < 124.2 ? 1 : t < 127.5 ? 0.15 : lerp(1, 0.2, ramp(t, 127.6, 131.5));
  const rate = t < 124.2 ? 0.95 : t < 127.5 ? 0.15 : lerp(0.95, 0.15, ramp(t, 127.6, 131.5));
  return (
    <Stage a={96.3} b={135.3}>
      <Clock text="SECOND 1" t0={96.4} x={0} y={0} />
      <Layer o={a}>
        <div style={abs(0, 120, { ...pop(t, 96.4) })}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 30 }}>
            <Big size={180} color={C.red}>BARO</Big>
            <Big size={90}>= pressure</Big>
          </div>
          <Big size={64} style={{ marginTop: 10 }}>baroreceptors = <Mk p={ramp(t, 99.8, 101.2)}>stretch receptors</Mk></Big>
          <Big size={44} color={C.matcha} style={{ marginTop: 14 }}>in the walls of your big arteries</Big>
        </div>
        <div style={abs(1080, 80, { ...pop(t, 99.8) })}>
          <Firing w={700} t={t} p={0.8} rate={0.8} />
        </div>
      </Layer>
      <Layer o={b}>
        <Plate src="plates/neck507.png" aspect={0.9302} x={20} y={0} w={688} a={103.3} b={114.3} zoomFrom={[1.25, 0.62, 0.55]} zoomTo={[1.9, 0.65, 0.5]}
          labels={[
            { x: 0.665, y: 0.66, text: "common carotid", t: 104.0, side: "l" },
            { x: 0.645, y: 0.49, text: "carotid sinus", t: 105.0, side: "l", hot: true },
          ]} />
        <Plate src="plates/arch505.png" aspect={0.587} x={20} y={0} w={434} a={114.4} b={118.6} zoomFrom={[1.2, 0.5, 0.35]} zoomTo={[1.45, 0.52, 0.33]}
          labels={[{ x: 0.52, y: 0.32, text: "aortic arch", t: 114.8, side: "l", hot: true }]} />
        <div style={abs(760, 0)}>
          <ReflexMap w={1000} t={t} labels={1} hl={t < 114.4 ? "sinus" : "arch"} show={{ sensors: 1, med: 0, aff: 0, brake: 0, gas: 0, vessels: 0, heart: 1 }} />
        </div>
        <div style={abs(780, 640, { display: "flex", gap: 16, opacity: 1 - ramp(t, 114.2, 114.5) })}>
          <Chip t0={106.0} size={30}>start of the internal carotid</Chip>
          <Chip t0={109.4} size={30} bg={C.card} color={C.forest}>≈ top of the thyroid cartilage</Chip>
        </div>
        {t > 114.4 && <div style={abs(780, 640)}><Chip t0={115.2} size={30} bg={C.red}>group 2: right above the heart</Chip></div>}
      </Layer>
      <Layer o={c}>
        <div style={abs(0, 20)}>
          <Firing w={1000} t={t} p={p} rate={rate} />
        </div>
        <div style={abs(1060, 30, { width: 720, display: "flex", flexDirection: "column", gap: 18 })}>
          <Chip t0={118.8} bg={C.matcha}>higher pressure → more stretch</Chip>
          <Chip t0={121.0} bg={C.forest}>→ fires FASTER</Chip>
          <Chip t0={124.3} bg={C.card} color={C.forest}>lower pressure → less stretch</Chip>
          <Chip t0={125.6} bg={K.vein}>→ fires SLOWER</Chip>
          <Chip t0={127.6} bg={C.red}>standing up: firing slows</Chip>
        </div>
        {t > 132.9 && (
          <div style={abs(1180, 520, { ...pop(t, 132.9), transform: `rotate(-6deg) scale(${0.6 + 0.4 * ramp(t, 132.9, 133.2)})`, border: `10px solid ${C.red}`, color: C.red, background: "rgba(255,254,246,0.95)", borderRadius: 18, padding: "4px 30px", fontFamily: FONT, fontWeight: 800, fontSize: 110, letterSpacing: 6 })}>ALARM</div>
        )}
      </Layer>
    </Stage>
  );
};

/* ================= 3. SECONDS 2–10: THE REFLEX 135.53 – 207.82 ================= */
export const SReflex: React.FC = () => {
  const t = useT();
  const mapO = 1 - ramp(t, 195.4, 195.8);
  const f = ramp(t, 195.4, 195.8);
  const brakeR = t < 167.2 ? 0.7 : lerp(0.7, 0.12, ramp(t, 167.2, 170.0));
  const gasR = t < 178.0 ? 0.2 : lerp(0.2, 1, ramp(t, 178.0, 180.0));
  const hr = t < 167.2 ? 1.05 : lerp(1.05, 1.7, ramp(t, 168.5, 173.0));
  const right1 = 1 - ramp(t, 148.7, 149.1);
  const right2 = ramp(t, 148.7, 149.1) * (1 - ramp(t, 156.0, 156.4));
  const right3 = ramp(t, 156.0, 156.4) * (1 - ramp(t, 165.4, 165.8));
  const right4 = ramp(t, 165.4, 165.8) * (1 - ramp(t, 177.8, 178.2));
  const right5 = ramp(t, 177.8, 178.2);
  return (
    <Stage a={137.9} b={207.6}>
      <Clock text="SECONDS 2–10" t0={138.0} x={0} y={0} />
      <Layer o={mapO}>
        <div style={abs(0, 70)}>
          <ReflexMap w={860} t={t} rateIn={0.3} brakeR={brakeR} gasR={gasR} hr={hr} constrict={ramp(t, 186.0, 189.0)}
            hl={t < 144.2 ? "sinus" : t < 148.9 ? "arch" : t < 156.2 ? "nts med" : t < 178 ? "" : t < 185.6 ? "heart" : ""}
            show={{ sensors: 1, aff: ramp(t, 138.4, 139.0), med: ramp(t, 148.9, 149.4), brake: ramp(t, 156.6, 157.2), gas: ramp(t, 156.6, 157.2), heart: 1, vessels: ramp(t, 185.0, 185.6) }} />
        </div>
        <Layer o={right1}>
          <Plate src="plates/vagus793.png" aspect={0.4332} x={900} y={0} w={320} a={138.4} b={149.0} zoomFrom={[1.05, 0.3, 0.25]} zoomTo={[1.2, 0.32, 0.3]}
            labels={[{ x: 0.31, y: 0.3, text: "vagus (X)", t: 144.3, side: "r", hot: true }]} credit="Gray's 1918 · PD" />
          <Facts x={1260} y={10} w={520} items={[
            { t: 138.5, text: "carotid sinus → glossopharyngeal", big: "IX", bg: K.nerve9 },
            { t: 144.2, text: "aortic arch → vagus", big: "X", bg: K.nerve10 },
          ]} />
        </Layer>
        <Layer o={right2}>
          <Plate src="plates/stem682.png" aspect={0.5686} x={900} y={0} w={420} a={149.0} b={156.2} zoomFrom={[1.4, 0.75, 0.8]} zoomTo={[1.7, 0.78, 0.84]}
            labels={[{ x: 0.82, y: 0.86, text: "medulla", t: 151.0, side: "l", hot: true }]} credit="Gray's 1918 · PD" />
          <Facts x={1360} y={10} w={420} items={[
            { t: 149.0, text: "both nerves → the same place", bg: C.forest },
            { t: 151.0, text: "medulla oblongata", bg: C.card },
          { t: 153.0, text: "nucleus of the solitary tract", big: "NTS", bg: C.red },
          ]} />
        </Layer>
        <Layer o={right3}>
          <div style={abs(940, 20, { width: 840 })}>
            <Big size={52}>Cardiovascular centers in the medulla</Big>
          </div>
          <div style={abs(940, 200, { width: 840, display: "flex", flexDirection: "column", gap: 18 })}>
            <Chip t0={158.0} bg={K.gas} size={40}>cardioaccelerator: speeds the heart up</Chip>
            <Chip t0={160.0} bg={K.brake} size={40}>cardioinhibitor: slows it down</Chip>
            <Chip t0={162.4} bg={C.forest} size={40}>vasomotor: vessel tone</Chip>
          </div>
        </Layer>
        <Layer o={right4}>
          <div style={abs(940, 20, { width: 840, ...pop(t, 165.6) })}>
            <Big size={60}>Now it flips the switches</Big>
          </div>
          <div style={abs(940, 150, { width: 840, ...pop(t, 167.2), background: K.brake, color: "#fff", borderRadius: 34, padding: "24px 32px", fontFamily: FONT, fontWeight: 800 })}>
            <div style={{ fontSize: 34, letterSpacing: 4, opacity: 0.85 }}>SWITCH 1</div>
            <div style={{ fontSize: 60 }}>BRAKE OFF</div>
            <div style={{ fontSize: 36, marginTop: 6 }}>vagal tone to the heart ↓</div>
          </div>
          <div style={abs(940, 420, { display: "flex", alignItems: "center", gap: 24, ...pop(t, 171.1) })}>
            <svg width={150} height={130} viewBox="0 0 150 130"><HeartShape cx={75} cy={65} size={120} beat={beatAt(t, hr)} /></svg>
            <Big size={56}>heart rate ↑ <span style={{ color: C.matcha }}>in seconds</span></Big>
          </div>
          <div style={abs(940, 580)}><Chip t0={174.4} bg={C.card} color={C.forest} size={34}>+ a kick from tensing your leg muscles</Chip></div>
        </Layer>
        <Layer o={right5}>
          <div style={abs(940, 10, { width: 840, ...pop(t, 178.1), background: K.gas, color: "#fff", borderRadius: 34, padding: "20px 32px", fontFamily: FONT, fontWeight: 800 })}>
            <div style={{ fontSize: 34, letterSpacing: 4, opacity: 0.85 }}>SWITCH 2</div>
            <div style={{ fontSize: 60 }}>GAS ON: sympathetic ↑</div>
          </div>
          <div style={abs(940, 230, { width: 840, display: "flex", flexDirection: "column", gap: 16 })}>
            <Chip t0={181.9} bg={C.red} size={36}>heart squeezes harder → more per beat</Chip>
            <Chip t0={185.7} bg={C.forest} size={36}>arterioles tighten → resistance ↑</Chip>
            <Chip t0={190.7} bg={K.vein} size={36}>gut veins tighten → blood back to heart</Chip>
          </div>
        </Layer>
      </Layer>
      <Layer o={f}>
        <div style={abs(0, 40, { width: 1800, textAlign: "center" })}>
          <Big size={56} color={C.matcha}>the formula behind all of it</Big>
        </div>
        <div style={abs(0, 180, { width: 1800, display: "flex", justifyContent: "center", alignItems: "center", gap: 34, fontFamily: FONT, fontWeight: 800 })}>
          {[
            { k: "MAP", s: "mean arterial pressure", t0: 196.9, bg: C.red },
            { k: "=", s: "", t0: 198.0, bg: "" },
            { k: "CO", s: "cardiac output", t0: 198.6, bg: C.forest },
            { k: "×", s: "", t0: 200.0, bg: "" },
            { k: "SVR", s: "systemic vascular resistance", t0: 200.4, bg: K.gas },
          ].map((x, i) =>
            x.bg ? (
              <div key={i} style={{ position: "relative" }}>
                <div style={{ ...pop(t, x.t0), background: x.bg, color: "#fff", borderRadius: 34, padding: "26px 40px", textAlign: "center", width: 440 }}>
                  <div style={{ fontSize: 120, lineHeight: 1 }}>{x.k}</div>
                  <div style={{ fontSize: 30, marginTop: 8 }}>{x.s}</div>
                </div>
                {x.k !== "MAP" && <div style={{ position: "absolute", left: 0, width: 440, top: 270, textAlign: "center", ...pop(t, x.k === "CO" ? 203.7 : 204.1), fontSize: 110, color: C.matcha }}>↑</div>}
              </div>
            ) : (
              <div key={i} style={{ ...pop(t, x.t0), fontSize: 110, color: C.forest }}>{x.k}</div>
            ),
          )}
        </div>
        <div style={abs(0, 640, { width: 1800, textAlign: "center", ...pop(t, 204.2) })}>
          <Big size={48}>your body raises <Mk p={ramp(t, 204.6, 205.8)}>both sides</Mk> at once</Big>
        </div>
      </Layer>
    </Stage>
  );
};

/* ================= 4. SECOND 10: THE HEAD RUSH 207.82 – 247.24 ================= */
export const SHeadRush: React.FC = () => {
  const t = useT();
  const a = 1 - ramp(t, 220.0, 220.4);
  const b = ramp(t, 220.0, 220.4) * (1 - ramp(t, 232.2, 232.6));
  const c = ramp(t, 232.2, 232.6);
  return (
    <Stage a={210.2} b={247.0}>
      <Clock text="SECOND 10" t0={210.3} x={0} y={0} />
      <Layer o={a}>
        <div style={abs(0, 90)}>
          <BPGraph w={1150} cur={lerp(-5, 11, ramp(t, 210.4, 216.0))} hr={0} marks={{ nadir: ramp(t, 214.8, 215.3) }} />
        </div>
        <Facts x={1220} y={90} w={560} items={[
          { t: 210.4, text: "the reflex has a short delay", bg: C.forest },
          { t: 212.2, text: "pressure keeps sliding for a few seconds" },
          { t: 215.0, text: "lowest point", big: "≈ 10 s", bg: C.red },
        ]} />
      </Layer>
      <Layer o={b}>
        <div style={abs(-40, -40)}>
          <Body w={800} t={t} pool={0.85} dim={ramp(t, 224.3, 225.3)} legVeins={1} />
        </div>
        <div style={abs(760, 10, { width: 1020 })}>
          <Big size={58}>Your brain sits at the <Mk p={ramp(t, 221.6, 223.0)}>top of the column</Mk></Big>
          <Big size={44} color={C.red} style={{ marginTop: 14, opacity: ramp(t, 224.3, 224.7) }}>less blood to the brain + the retina, for a moment</Big>
        </div>
        <div style={abs(760, 330, { ...pop(t, 227.7), background: C.forest, color: C.paper, borderRadius: 30, padding: "18px 30px", fontFamily: FONT, fontWeight: 800, fontSize: 70 })}>= the HEAD RUSH</div>
        <div style={abs(760, 520, { display: "flex", gap: 18 })}>
          <Chip t0={229.0} bg={C.red}>lightheaded</Chip>
          <Chip t0={229.7} bg={K.nerve10}>dizzy</Chip>
          <Chip t0={230.5} bg="#5E5E5E">blurry / grayed-out vision</Chip>
        </div>
      </Layer>
      <Layer o={c}>
        <div style={abs(0, 40)}>
          <Brain w={760} t={t} dim={lerp(0.9, 0, ramp(t, 236.6, 241.5))} widen={ramp(t, 236.6, 239.0)} />
        </div>
        <div style={abs(820, 10, { width: 960 })}>
          <Big size={58}>The brain's backup:</Big>
          <Big size={70} color={C.matchaDark} style={{ marginTop: 6 }}><Mk p={ramp(t, 233.6, 235.2)}>cerebral autoregulation</Mk></Big>
        </div>
        <div style={abs(820, 240, { width: 960, display: "flex", flexDirection: "column", gap: 16 })}>
          <Chip t0={236.6} bg={C.matcha}>small brain arteries widen</Chip>
          <Chip t0={239.0} bg={C.forest}>buffers the drop within ≈ 10 s</Chip>
        </div>
        <div style={abs(820, 470, { ...pop(t, 243.4), background: K.vein, color: "#fff", borderRadius: 30, padding: "18px 30px", fontFamily: FONT, fontWeight: 800 })}>
          <div style={{ fontSize: 34, opacity: 0.9 }}>at the same moment</div>
          <div style={{ fontSize: 60 }}>baroreflex at its peak</div>
        </div>
      </Layer>
    </Stage>
  );
};

/* ================= 5. SECONDS 10–30: RECOVERY 247.24 – 288.94 ================= */
export const SRecovery: React.FC = () => {
  const t = useT();
  const a = 1 - ramp(t, 258.8, 259.2);
  const b = ramp(t, 258.8, 259.2) * (1 - ramp(t, 274.4, 274.8));
  const c = ramp(t, 274.4, 274.8) * (1 - ramp(t, 283.1, 283.5));
  const d = ramp(t, 283.1, 283.5);
  const sqOn = t > 263.5;
  const sq = sqOn ? 0.5 - 0.5 * Math.cos((2 * Math.PI * (t - 263.5)) / 1.8) : 0;
  const flow = sqOn ? (t - 263.5) * 110 : 0;
  const inh = t > 276.7 ? 0.5 - 0.5 * Math.cos((2 * Math.PI * (t - 276.7)) / 3.0) : 0;
  const rflow = t > 276.7 ? (t - 276.7) * 60 : 0;
  const sq2 = 0.5 - 0.5 * Math.cos((2 * Math.PI * (t - 283)) / 1.2);
  return (
    <Stage a={249.6} b={288.7}>
      <Clock text="SECONDS 10–30" t0={249.7} x={0} y={0} />
      <Layer o={a}>
        <div style={abs(0, 90)}>
          <BPGraph w={1150} cur={lerp(10, 30, ramp(t, 249.9, 257.5))} hr={ramp(t, 255.4, 255.9)} marks={{ nadir: 1, back: ramp(t, 252.5, 253.0), peak: ramp(t, 255.6, 256.1) }} />
        </div>
        <Facts x={1220} y={90} w={560} items={[
          { t: 250.0, text: "healthy person: blood pressure back to start", big: "≈ 15 s", bg: C.matcha },
          { t: 255.6, text: "heart rate rises, then settles a little", bg: K.vein },
        ]} />
      </Layer>
      <Layer o={b}>
        <div style={abs(40, 0)}>
          <MusclePump w={520} sq={sq} flow={flow} />
        </div>
        <div style={abs(660, 10, { width: 1120 })}>
          <Big size={52}>2 pumps help blood climb back up</Big>
          <Big size={76} color={C.red} style={{ marginTop: 10, opacity: ramp(t, 261.2, 261.6) }}>1. skeletal muscle pump</Big>
        </div>
        <div style={abs(660, 260, { width: 1100, display: "flex", flexDirection: "column", gap: 16 })}>
          <Chip t0={263.7} bg={K.vein}>leg veins have one-way valves</Chip>
          <Chip t0={266.3} bg={K.muscle}>calf muscles contract → squeeze the veins → blood up</Chip>
          <Chip t0={270.8} bg={C.forest}>valves below snap shut → no falling back</Chip>
        </div>
      </Layer>
      <Layer o={c}>
        <div style={abs(40, 0)}>
          <RespPump w={600} inh={inh} flow={rflow} />
        </div>
        <div style={abs(700, 10, { width: 1080 })}>
          <Big size={76} color={K.vein}>2. respiratory pump</Big>
        </div>
        <div style={abs(700, 170, { width: 1080, display: "flex", flexDirection: "column", gap: 16 })}>
          <Chip t0={276.8} bg={K.muscle}>breathe in → diaphragm moves down</Chip>
          <Chip t0={278.6} bg={C.red}>pressure in your chest drops</Chip>
          <Chip t0={280.4} bg={K.vein}>blood is pulled up toward the heart</Chip>
        </div>
      </Layer>
      <Layer o={d}>
        <div style={abs(40, 0)}>
          <MusclePump w={520} sq={sq2} flow={(t - 283) * 160} />
        </div>
        <div style={abs(700, 120, { width: 1080, ...pop(t, 283.3) })}>
          <Big size={84}>Your first step helps</Big>
          <div style={{ marginTop: 30, display: "inline-block", background: C.matcha, color: "#fff", borderRadius: 30, padding: "18px 34px", fontFamily: FONT, fontWeight: 800, fontSize: 56, ...pop(t, 285.4) }}>walking = muscle pump ON</div>
        </div>
      </Layer>
    </Stage>
  );
};

/* ================= 6. MINUTES: STAYING UP 288.94 – 333.8 ================= */
export const SMinutes: React.FC = () => {
  const t = useT();
  const a = 1 - ramp(t, 296.6, 297.0);
  const b = ramp(t, 296.6, 297.0) * (1 - ramp(t, 303.7, 304.1));
  const c = ramp(t, 303.7, 304.1) * (1 - ramp(t, 316.3, 316.7));
  const d = ramp(t, 316.3, 316.7) * (1 - ramp(t, 326.7, 327.1));
  const e = ramp(t, 326.7, 327.1);
  const sq = 0.5 - 0.5 * Math.cos((2 * Math.PI * t) / 2.4);
  return (
    <Stage a={291.3} b={333.6}>
      <Clock text="MINUTES" t0={291.4} x={0} y={0} />
      <Layer o={a}>
        <div style={abs(0, 80)}>
          <ReflexMap w={860} t={t} rateIn={0.5} brakeR={0.35} gasR={0.6} hr={1.3} constrict={0.5} labels={1} />
        </div>
        <div style={abs(940, 40, { width: 840 })}>
          <Big size={62}>Now your body has to <Mk p={ramp(t, 291.6, 293.0)}>keep it up</Mk></Big>
        </div>
        <div style={abs(940, 300, { ...pop(t, 293.6) })}>
          <div style={{ background: K.gas, color: "#fff", borderRadius: 30, padding: "22px 32px", fontFamily: FONT, fontWeight: 800, fontSize: 48, width: 780 }}>sympathetic tone stays higher than lying down</div>
        </div>
      </Layer>
      <Layer o={b}>
        <Plate src="plates/arch505.png" aspect={0.587} x={40} y={0} w={434} a={296.9} b={304.0} zoomFrom={[1.2, 0.3, 0.45]} zoomTo={[1.4, 0.26, 0.48]}
          labels={[
            { x: 0.22, y: 0.36, text: "SVC", t: 298.4, side: "r", hot: true },
            { x: 0.17, y: 0.56, text: "right atrium", t: 300.6, side: "r", hot: true },
          ]} />
        <div style={abs(540, 20, { width: 1240 })}>
          <Big size={58}>Low-pressure receptors</Big>
          <Big size={42} color={C.matcha} style={{ marginTop: 8 }}>in the venae cavae + right atrium</Big>
        </div>
        <div style={abs(540, 190)}><Chip t0={298.4} bg={C.red} size={36}>SVC = superior vena cava</Chip></div>
        <div style={abs(540, 280)}><Chip t0={301.4} bg={C.forest} size={44}>they track how full your system is</Chip></div>
        <Note1918 t0={300.8} name="right auricula" modern="right atrium (its appendage)" x={540} y={420} />
      </Layer>
      <Layer o={c}>
        <div style={abs(40, 40, { ...pop(t, 304.0) })}><Kidney w={300} /></div>
        <div style={abs(400, 20, { width: 1380 })}>
          <Big size={56}>If pressure stayed low longer…</Big>
          <Big size={42} color={C.matcha} style={{ marginTop: 6 }}>slower hormone systems join in (minutes → hours)</Big>
        </div>
        <div style={abs(400, 240, { width: 1380, display: "flex", flexDirection: "column", gap: 18 })}>
          <Chip t0={307.6} bg={C.red} size={46}>kidneys → renin–angiotensin system</Chip>
          <Chip t0={311.6} bg={K.vein} size={46}>antidiuretic hormone (ADH)</Chip>
          <Chip t0={313.6} bg={C.forest} size={46}>→ hold on to salt + water</Chip>
        </div>
      </Layer>
      <Layer o={d}>
        <div style={abs(-30, -30)}>
          <Body w={780} t={t} pool={ramp(t, 317.5, 321.0)} dim={ramp(t, 321.5, 323.5) * 0.9} legVeins={1} />
        </div>
        <div style={abs(650, 10)}>
          <MusclePump w={390} sq={0} flow={0} off />
        </div>
        <div style={abs(1060, 30, { width: 720, display: "flex", flexDirection: "column", gap: 16 })}>
          <Chip t0={316.5} bg={C.forest} size={36}>stand perfectly still for a long time</Chip>
          <Chip t0={319.0} bg="#5E5E5E" size={36}>the muscle pump goes quiet</Chip>
          <Chip t0={321.1} bg={K.vein} size={36}>blood pools in the legs</Chip>
          <Chip t0={322.6} bg={C.card} color={C.forest} size={36}>brain gets less oxygen-rich blood</Chip>
          <Chip t0={325.0} bg={C.red} size={36}>a person may faint</Chip>
        </div>
      </Layer>
      <Layer o={e}>
        <div style={abs(40, 0)}>
          <MusclePump w={520} sq={sq * 0.7} flow={(t - 326) * 70} />
        </div>
        <div style={abs(660, 60, { width: 1120, ...pop(t, 326.9) })}>
          <Big size={64}>Soldiers standing at attention for a long time</Big>
          <div style={{ marginTop: 30, display: "inline-block", background: C.matcha, color: "#fff", borderRadius: 30, padding: "18px 34px", fontFamily: FONT, fontWeight: 800, fontSize: 54, ...pop(t, 329.0) }}>are trained to flex their legs slightly</div>
          <Big size={40} color={C.matchaDark} style={{ marginTop: 26, opacity: ramp(t, 330.4, 330.8) }}>→ keeps the muscle pump going</Big>
        </div>
      </Layer>
    </Stage>
  );
};

/* ================= 7. EXAM CHEAT SHEET 333.8 – 382.13 ================= */
export const SCheat: React.FC = () => {
  const t = useT();
  const a = 1 - ramp(t, 348.6, 349.0);
  const b = ramp(t, 348.6, 349.0) * (1 - ramp(t, 363.4, 363.8));
  const c = ramp(t, 363.4, 363.8) * (1 - ramp(t, 370.2, 370.6));
  const d = ramp(t, 370.2, 370.6);
  return (
    <Stage a={336.2} b={381.9}>
      <Layer o={a}>
        <div style={abs(0, 0)}>
          <Big size={64}>Arterial baroreceptors: <Mk p={ramp(t, 336.4, 337.6)}>2 places</Mk></Big>
        </div>
        <div style={abs(0, 120)}>
          <ReflexMap w={760} t={t} rateIn={0.6} labels={1} hl={t < 341.5 ? "sinus arch" : t < 344.5 ? "sinus" : "arch"} show={{ sensors: 1, aff: 1, med: 1, brake: 0, gas: 0, vessels: 0, heart: 1 }} />
        </div>
        <div style={abs(840, 140, { width: 940, display: "flex", flexDirection: "column", gap: 20 })}>
          {[
            { t0: 341.5, a: "carotid sinus", n: "IX", nn: "glossopharyngeal", col: K.nerve9 },
            { t0: 343.4, a: "aortic arch", n: "X", nn: "vagus", col: K.nerve10 },
          ].map((x, i) => (
            <div key={i} style={{ ...pop(t, x.t0), display: "flex", alignItems: "center", gap: 24, background: C.card, border: `3px solid ${C.line}`, borderRadius: 28, padding: "16px 26px", fontFamily: FONT, fontWeight: 800 }}>
              <div style={{ fontSize: 46, color: C.forest, width: 360 }}>{x.a}</div>
              <Arrow />
              <div style={{ background: x.col, color: "#fff", borderRadius: 20, padding: "6px 22px", fontSize: 60 }}>{x.n}</div>
              <div style={{ fontSize: 34, color: C.matchaDark }}>{x.nn}</div>
            </div>
          ))}
          <div style={{ ...pop(t, 345.5), background: C.banana, border: `5px solid ${C.forest}`, borderRadius: 26, padding: "16px 26px", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest }}>
            trick: 9 is higher (neck), 10 goes lower (chest)
          </div>
        </div>
      </Layer>
      <Layer o={b}>
        <div style={abs(0, 0)}>
          <Big size={60}>Both report to the <Mk p={ramp(t, 349.6, 351.0)}>NTS in the medulla</Mk></Big>
        </div>
        <div style={abs(0, 140, { width: 1780, display: "flex", alignItems: "center", gap: 16, flexWrap: "nowrap" })}>
          <Chip t0={352.9} bg={C.red} size={40}>pressure ↓</Chip>
          <Arrow o={ramp(t, 353.6, 353.9)} />
          <Chip t0={353.9} bg={C.card} color={C.forest} size={40}>fewer signals</Chip>
          <Arrow o={ramp(t, 355.0, 355.3)} />
          <Chip t0={355.3} bg={K.gas} size={40}>sympathetic ↑</Chip>
          <Chip t0={357.0} bg={K.brake} size={40}>vagal ↓</Chip>
        </div>
        <div style={abs(1180, 250)}>
          <ReflexMap w={600} t={t} rateIn={0.15} brakeR={0.1} gasR={1} hr={1.7} constrict={1} labels={0} />
        </div>
        <div style={abs(0, 300, { width: 1120, display: "flex", flexDirection: "column", gap: 20 })}>
          {[
            { t0: 359.6, k: "heart rate ↑", col: C.red },
            { t0: 360.8, k: "stronger heartbeat", col: C.forest },
            { t0: 362.0, k: "tighter vessels", col: K.gas },
          ].map((x, i) => (
            <div key={i} style={{ ...pop(t, x.t0), background: x.col, color: "#fff", borderRadius: 30, padding: "24px 30px", fontFamily: FONT, fontWeight: 800, fontSize: 54 }}>{x.k}</div>
          ))}
        </div>
      </Layer>
      <Layer o={c}>
        <div style={abs(0, 40, { width: 1800, textAlign: "center" })}>
          <Big size={56} color={C.matcha}>know the formula</Big>
        </div>
        <div style={abs(0, 200, { width: 1800, textAlign: "center", ...pop(t, 364.6) })}>
          <div style={{ display: "inline-block", background: C.forest, color: C.paper, borderRadius: 40, padding: "40px 70px", fontFamily: FONT, fontWeight: 800, fontSize: 140, letterSpacing: 2 }}>
            MAP = CO × SVR
          </div>
          <Big size={40} style={{ marginTop: 30 }}>mean arterial pressure = cardiac output × systemic vascular resistance</Big>
        </div>
      </Layer>
      <Layer o={d}>
        <div style={abs(0, 0)}>
          <Big size={60}>Textbook definition:</Big>
          <Big size={84} color={C.red} style={{ marginTop: 6 }}>orthostatic hypotension</Big>
        </div>
        <div style={abs(0, 260, { width: 1780, display: "flex", gap: 24, alignItems: "stretch" })}>
          {[
            { t0: 374.4, big: "≥ 20", s: "mmHg drop in systolic pressure", col: C.red },
            { t0: 376.6, big: "or ≥ 10", s: "mmHg drop in diastolic pressure", col: K.vein },
            { t0: 378.6, big: "≤ 3 min", s: "within 3 minutes of standing", col: C.forest },
          ].map((x, i) => (
            <div key={i} style={{ ...pop(t, x.t0), flex: 1, background: x.col, color: "#fff", borderRadius: 32, padding: "30px 26px", fontFamily: FONT, fontWeight: 800 }}>
              <div style={{ fontSize: 110, lineHeight: 1, color: C.banana }}>{x.big}</div>
              <div style={{ fontSize: 38, marginTop: 12 }}>{x.s}</div>
            </div>
          ))}
        </div>
      </Layer>
    </Stage>
  );
};

/* ================= 8. QUICK QUIZ + OUTRO 382.13 – END ================= */
const QS = [
  { q: "Where are the 2 groups of arterial baroreceptors?", o: ["carotid sinus + aortic arch", "both kidneys", "brainstem + spinal cord", "lungs + right atrium"], a: 0, ask: 386.18, cd: 389.95, rev: 393.15, end: 395.9 },
  { q: "Which cranial nerve carries signals from the carotid sinus?", o: ["CN VII facial", "CN IX glossopharyngeal", "CN XI accessory", "CN XII hypoglossal"], a: 1, ask: 396.19, cd: 400.7, rev: 403.9, end: 407.2 },
  { q: "When you stand up, vagal tone to the heart goes…", o: ["up", "down", "stays the same"], a: 1, ask: 407.44, cd: 411.98, rev: 415.18, end: 417.8 },
];
export const SQuiz: React.FC = () => {
  const t = useT();
  const outro = ramp(t, 417.8, 418.2);
  return (
    <Stage a={384.5} b={434.0}>
      <Layer o={1 - ramp(t, 385.9, 386.2)}>
        <div style={abs(0, 200, { width: 1800, textAlign: "center", ...pop(t, 384.6) })}>
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
              <Big size={72}>{Q.q}</Big>
            </div>
            <div style={abs(60, 300, { width: 1400, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 })}>
              {Q.o.map((op, i) => {
                const good = rev && i === Q.a;
                const bad = rev && i !== Q.a;
                const pp = pop(t, Q.ask + 1.0 + i * 0.25);
                return (
                  <div key={i} style={{ ...pp, background: good ? C.matcha : C.card, color: good ? C.paper : C.forest, border: `4px solid ${good ? C.matchaDark : C.line}`, opacity: bad ? 0.4 : pp.opacity, borderRadius: 30, padding: "36px 32px", fontFamily: FONT, fontWeight: 800, fontSize: 50 }}>
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
          <Big size={78}>How many did you get?</Big>
          <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              ["3/3", "exam ready", C.matcha],
              ["2/3", "almost there", C.forest],
              ["0–1", "rewatch the cheat sheet", C.red],
            ].map(([s, l, col], i) => (
              <div key={i} style={{ ...pop(t, 418.3 + i * 0.35), display: "flex", alignItems: "center", gap: 22, fontFamily: FONT, fontWeight: 800 }}>
                <div style={{ width: 170, background: col as string, color: C.paper, borderRadius: 22, padding: "14px 0", textAlign: "center", fontSize: 58 }}>{s}</div>
                <div style={{ fontSize: 54, color: C.forest }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ ...pop(t, 419.8), marginTop: 30, background: C.banana, border: `4px solid ${C.forest}`, borderRadius: 26, padding: "16px 26px", fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.forest, width: "fit-content" }}>💬 comment your score</div>
        </div>
        <div style={abs(1020, 30, { width: 760, ...pop(t, 421.3), background: C.forest, borderRadius: 36, padding: "32px 36px", fontFamily: FONT, fontWeight: 800, color: C.paper })}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 84, height: 84, borderRadius: 42, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LogoMark size={64} />
            </div>
            <div style={{ fontSize: 44 }}>Book Plume</div>
          </div>
          <div style={{ fontSize: 54, marginTop: 22, lineHeight: 1.12 }}>Anatomy flash cards for review on the go</div>
          <div style={{ fontSize: 34, marginTop: 16, color: C.banana }}>↓ link in the description</div>
        </div>
        <div style={abs(1020, 520, { ...pop(t, 427.2) })}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ background: C.red, color: "#FFFFFF", borderRadius: 18, padding: "18px 40px", fontFamily: FONT, fontWeight: 800, fontSize: 52, transform: `scale(${1 + 0.05 * Math.sin(t * 5)})` }}>SUBSCRIBE</div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.forest, width: 360 }}>which moment should we slow down next?</div>
          </div>
        </div>
      </Layer>
    </Stage>
  );
};
