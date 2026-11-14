import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { HyoidU, NeckSide, NP } from "./Hyoid66";

export const ANECK = 2023 / 1488;
export const AHY = 1288 / 864;
export const ATON = 1466 / 1486;
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

/** screen position (scene coords) of image point (fx, fy) inside a <Plate> at time t — same maths as Plates.tsx */
export const plateXY = (t: number, x: number, y: number, w: number, aspect: number, a: number, b: number, zf: [number, number, number], zt: [number, number, number], fx: number, fy: number) => {
  const h = w / aspect;
  const k = ramp(t, a, b);
  const s = zf[0] + (zt[0] - zf[0]) * k;
  const cx = zf[1] + (zt[1] - zf[1]) * k;
  const cy = zf[2] + (zt[2] - zf[2]) * k;
  const cl = (v: number, m: number) => Math.max(-m, Math.min(m, v));
  const tx = cl(-(cx - 0.5) * w * s, ((s - 1) * w) / 2);
  const ty = cl(-(cy - 0.5) * h * s, ((s - 1) * h) / 2);
  return [x + w / 2 + (fx * w - w / 2) * s + tx, y + h / 2 + (fy * h - h / 2) * s + ty];
};

const NoteCard: React.FC<{ t0: number; x: number; y: number; w: number; children: React.ReactNode; sub?: string }> = ({ t0, x, y, w, children, sub }) => {
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

/* 1. Hook: Gray's 1918 Fig. 386 on screen from frame 0, hyoid ringed */
const V1Z0: [number, number, number] = [1.3, 0.5, 0.3];
const V1Z1: [number, number, number] = [1.55, 0.5, 0.28];
export const V1: React.FC = () => {
  const t = useT();
  const PX = 20, PY = 290, PW = 820;
  const [hx, hy] = plateXY(t, PX, PY, PW, ANECK, -0.6, 3.35, V1Z0, V1Z1, 0.51, 0.265);
  const dot = 0.5 + 0.5 * Math.sin(t * 7);
  return (
    <Scene start={-0.6} end={3.35} push={0.02}>
      <div style={center(40, pop(t, -0.4, 0.25))}>
        <Big size={84}>THIS BONE TOUCHES</Big>
      </div>
      <div style={center(140, pop(t, -0.3, 0.25))}>
        <Big size={106} color={C.red}>NO OTHER BONE</Big>
      </div>
      <Plate src="plates/neck386.png" aspect={ANECK} x={PX} y={PY} w={PW} a={-0.6} b={3.35} zoomFrom={V1Z0} zoomTo={V1Z1} credit="Gray's 1918 · PD" />
      <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <ellipse cx={hx} cy={hy} rx={150 + 10 * dot} ry={52 + 6 * dot} fill="none" stroke={C.red} strokeWidth={8} opacity={ramp(t, 0.05, 0.35)} />
      </svg>
      <Lead x1={hx} y1={hy + 40} x2={hx} y2={hy + 150} p={ramp(t, 0.8, 1.05)} col={C.red} />
      <div style={{ position: "absolute", left: 0, width: 860, top: hy + 140, display: "flex", justifyContent: "center", ...pop(t, 0.9, 0.25) }}>
        <Pill size={60} bg={C.banana} color={C.forest}>HYOID BONE</Pill>
      </div>
      <Stamp t0={1.9} text="0 JOINTS" size={50} rot={-8} color={C.red} style={{ left: 560, top: 290 }} />
      <div style={{ position: "absolute", left: 0, width: 860, top: 835, display: "flex", justifyContent: "center", ...pop(t, 2.3, 0.25) }}>
        <Pill size={30} bg={C.forest}>anatomy fact · neck</Pill>
      </div>
    </Scene>
  );
};

/* 2. The hyoid, in your neck: own side view */
export const V2: React.FC = () => {
  const t = useT();
  const DX = 130, DY = 150, DW = 600, k = DW / 800;
  const hx = DX + NP.hyoid[0] * k, hy = DY + NP.hyoid[1] * k;
  return (
    <Scene start={3.35} end={4.7} push={0.01}>
      <div style={center(40, pop(t, 3.4, 0.22))}>
        <Big size={86}>IN YOUR NECK</Big>
      </div>
      <div style={{ position: "absolute", left: DX - 30, top: DY - 10, width: DW + 60, height: 720, borderRadius: 40, overflow: "hidden", background: C.card, boxShadow: `0 0 0 4px ${C.line}`, ...pop(t, 3.38, 0.28) }}>
        <div style={{ position: "absolute", left: 30, top: 10 }}>
          <NeckSide w={DW} id="v2" t={t} hyoid={ramp(t, 3.45, 3.75)} ring={ramp(t, 3.6, 3.9)} />
        </div>
      </div>
      <Lead x1={hx - 20} y1={hy} x2={40} y2={hy + 160} p={ramp(t, 3.6, 3.85)} col={C.red} />
      <div style={{ position: "absolute", left: 0, top: hy + 130, ...pop(t, 3.7, 0.22), transformOrigin: "0 50%" }}>
        <Pill size={40} bg={C.banana} color={C.forest}>hyoid</Pill>
      </div>
      <div style={{ position: "absolute", left: 600, top: 800, ...pop(t, 4.0, 0.22) }}>
        <Pill size={28} bg={C.forest}>side view</Pill>
      </div>
    </Scene>
  );
};

/* 3. Memory trick: hyoid = U-shaped (Greek letter upsilon) */
const Upsilon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <path d="M 30 50 C 46 36 66 40 70 64 L 70 120 C 70 156 92 172 112 172 C 150 172 176 140 176 96 C 176 70 168 52 158 40" fill="none" stroke={C.forest} strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const V3: React.FC = () => {
  const t = useT();
  return (
    <Scene start={4.7} end={8.65} push={0.01}>
      <div style={center(40, pop(t, 4.75, 0.25))}>
        <Big size={70}>MEMORY TRICK</Big>
      </div>
      <div style={center(140, pop(t, 5.5, 0.25))}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 104, letterSpacing: 4, color: C.forest, lineHeight: 1 }}>
          HYOID <span style={{ color: C.matcha, opacity: ramp(t, 6.15, 6.4) }}>=</span> <span style={{ background: ramp(t, 6.2, 6.3) > 0.5 ? C.banana : "transparent", borderRadius: 14, padding: "0 10px", color: C.red, opacity: ramp(t, 6.15, 6.4) }}>U</span>
        </div>
      </div>
      <div style={center(270, pop(t, 6.35, 0.25))}>
        <Pill size={40} bg={C.forest}>U-shaped bone</Pill>
      </div>
      <div style={{ position: "absolute", left: 40, top: 380, ...pop(t, 5.0, 0.3) }}>
        <HyoidU w={560} id="v3" u={ramp(t, 6.25, 7.05)} />
      </div>
      <div style={{ position: "absolute", left: 590, top: 390, width: 250, height: 330, borderRadius: 32, background: C.card, boxShadow: `0 0 0 4px ${C.line}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", ...pop(t, 7.6, 0.3) }}>
        <Upsilon size={170} />
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.forest, marginTop: 6 }}>upsilon</div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, color: C.matcha }}>Greek letter</div>
      </div>
      <div style={center(800, pop(t, 8.0, 0.25))}>
        <Pill size={32} bg={C.banana} color={C.forest}>hy-oid = shaped like υ</Pill>
      </div>
    </Scene>
  );
};

/* 4. Parts on Gray's 1918 Fig. 186 with modern labels */
export const V4: React.FC = () => {
  const t = useT();
  const counts: [string, number][] = [["1 body", 8.74], ["2 greater horns", 9.9], ["2 lesser horns", 10.78]];
  return (
    <Scene start={8.65} end={11.6} push={0.006}>
      <div style={center(40, pop(t, 8.7, 0.25))}>
        <Big size={66}>1 BODY + 4 HORNS</Big>
      </div>
      <Plate
        src="plates/hyoid186.png" aspect={AHY} x={20} y={125} w={820} a={8.65} b={11.6} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.06, 0.45, 0.55]}
        labels={[
          { x: 0.36, y: 0.7, text: "body", t: 8.8, hot: true, ox: -20, oy: 100 },
          { x: 0.12, y: 0.11, text: "greater horn", t: 9.92, ox: 60, oy: 4 },
          { x: 0.145, y: 0.4, text: "lesser horn", t: 10.8, ox: 40, oy: -26 },
        ]}
        credit="Gray's 1918, Fig. 186 · PD"
      />
      <div style={{ position: "absolute", left: 20, top: 695, display: "flex", gap: 12 }}>
        {counts.map(([s, t0], i) => (
          <div key={s} style={pop(t, t0, 0.22)}><Pill size={30} bg={i === 0 ? C.banana : C.matcha} color={i === 0 ? C.forest : C.paper}>{s}</Pill></div>
        ))}
      </div>
      <NoteCard t0={11.05} x={20} y={780} w={820} sub="cornu = Latin for horn">
        1918 atlas name: “greater cornu” = greater horn
      </NoteCard>
    </Scene>
  );
};

/* 5. Where it sits: C3, between jaw and larynx */
export const V5: React.FC = () => {
  const t = useT();
  const DX = 10, DY = 80, DW = 620, k = DW / 800;
  const P = (p: [number, number]) => [DX + p[0] * k, DY + p[1] * k];
  const [cx, cy] = P(NP.c3), [jx, jy] = P(NP.jaw), [lx, ly] = P(NP.larynx), [hx, hy] = P(NP.hyoid);
  return (
    <Scene start={11.6} end={14.5} push={0.008}>
      <div style={{ position: "absolute", left: DX - 10, top: DY - 40, width: DW + 20, height: 780, borderRadius: 40, overflow: "hidden", background: C.card, boxShadow: `0 0 0 4px ${C.line}`, ...pop(t, 11.62, 0.3) }}>
        <div style={{ position: "absolute", left: 10, top: 40 }}>
          <NeckSide w={DW} id="v5" t={t} hyoid={0.85} c3={ramp(t, 12.05, 12.35)} jaw={ramp(t, 13.3, 13.55) * (t < 13.9 ? 1 : 0.35)} larynx={ramp(t, 13.9, 14.15)} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 650, top: 40, ...pop(t, 11.7, 0.25) }}>
        <Big size={46}>WHERE?</Big>
      </div>
      <Lead x1={cx + 50} y1={cy} x2={680} y2={cy - 70} p={ramp(t, 12.1, 12.35)} col={C.red} />
      <div style={{ position: "absolute", left: 660, top: cy - 120, ...pop(t, 12.15, 0.22) }}><Pill size={48} bg={C.banana} color={C.forest}>C3 level</Pill></div>
      <Lead x1={hx} y1={hy} x2={hx - 40} y2={hy + 110} p={ramp(t, 11.8, 12.0)} col={C.red} />
      <div style={{ position: "absolute", left: hx - 150, top: hy + 105, ...pop(t, 11.85, 0.22) }}><Pill size={30} bg={C.red}>hyoid</Pill></div>
      <Lead x1={jx - 60} y1={jy + 6} x2={60} y2={jy - 120} p={ramp(t, 13.3, 13.55)} />
      <div style={{ position: "absolute", left: 10, top: jy - 175, ...pop(t, 13.35, 0.22), transformOrigin: "0 50%" }}><Pill size={34} bg={C.forest}>jaw (mandible)</Pill></div>
      <Lead x1={lx + 60} y1={ly + 10} x2={660} y2={ly + 120} p={ramp(t, 13.9, 14.15)} col="#9FD4BF" />
      <div style={{ position: "absolute", left: 640, top: ly + 95, ...pop(t, 13.95, 0.22) }}><Pill size={34} bg={C.forest}>larynx</Pill></div>
      <div style={{ position: "absolute", left: 650, top: 120, width: 200, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.matcha, lineHeight: 1.15, ...pop(t, 12.6, 0.25) }}>3rd neck vertebra</div>
    </Scene>
  );
};

/* 6. Held up only by muscles + ligaments: Fig. 386 again, zoomed */
const V6Z0: [number, number, number] = [1.6, 0.52, 0.3];
const V6Z1: [number, number, number] = [1.75, 0.52, 0.3];
export const V6: React.FC = () => {
  const t = useT();
  const PX = 20, PY = 150, PW = 820;
  return (
    <Scene start={14.5} end={16.8} push={0.008}>
      <div style={center(40, pop(t, 14.55, 0.22))}>
        <Big size={64}>HELD UP BY MUSCLES</Big>
      </div>
      <Plate
        src="plates/neck386.png" aspect={ANECK} x={PX} y={PY} w={PW} a={14.5} b={16.8} zoomFrom={V6Z0} zoomTo={V6Z1}
        labels={[
          { x: 0.53, y: 0.265, text: "hyoid", t: 14.62, hot: true, ox: 150, oy: -40 },
          { x: 0.5, y: 0.15, text: "suprahyoid ↑", t: 15.3, ox: -60, oy: -40 },
          { x: 0.555, y: 0.44, text: "infrahyoid ↓", t: 15.95, ox: -80, oy: 40 },
        ]}
        credit="Gray's 1918, Fig. 386 · PD"
      />
      <div style={{ position: "absolute", left: 0, width: 860, top: 790, display: "flex", justifyContent: "center", gap: 14 }}>
        <div style={pop(t, 15.45, 0.22)}><Pill size={34} bg={C.red}>muscles</Pill></div>
        <div style={pop(t, 16.1, 0.22)}><Pill size={34} bg={C.forest}>+ ligaments</Pill></div>
        <div style={pop(t, 16.3, 0.22)}><Pill size={34} bg={C.banana} color={C.forest}>no joints</Pill></div>
      </div>
    </Scene>
  );
};

/* 7. Quick test */
export const V7: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[18.51, 3], [19.15, 2], [19.79, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => {
    if (t >= s - 0.05 && t < 20.45) { n = v; n0 = s; }
  });
  const opts = ["your teeth", "your tongue", "your eardrum"];
  return (
    <Scene start={16.8} end={20.4}>
      <div style={{ position: "absolute", left: 20, top: 55, width: 820, height: 830, borderRadius: 48, background: C.forest, ...pop(t, 16.83, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 56, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 135, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 66, lineHeight: 1.12, color: C.paper, ...pop(t, 17.4) }}>
          What does the hyoid <span style={{ color: C.banana }}>ANCHOR?</span>
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 345, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          {opts.map((o, i) => (
            <div key={o} style={{ ...pop(t, 17.75 + i * 0.15), display: "flex", alignItems: "center", gap: 18, width: 560 }}>
              <div style={{ width: 62, height: 62, flex: "0 0 62px", borderRadius: 18, background: C.banana, color: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, border: `4px solid ${C.paper}` }}>{"ABC"[i]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper, whiteSpace: "nowrap" }}>{o}</div>
            </div>
          ))}
        </div>
        {n !== null && (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 600, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 190, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 8. Answer on Gray's Fig. 1019: hyoglossus runs from the hyoid into the tongue */
export const V8: React.FC = () => {
  const t = useT();
  return (
    <Scene start={20.4} end={23.9} push={0.008}>
      <div style={center(40, pop(t, 20.45, 0.25))}>
        <Pill size={48} bg={C.matcha}>B ✓ your tongue</Pill>
      </div>
      <Plate
        src="plates/tongue1019.png" aspect={ATON} x={20} y={140} w={600} a={20.4} b={23.9} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.1, 0.45, 0.6]}
        labels={[
          { x: 0.3, y: 0.37, text: "tongue", t: 20.62, ox: 40, oy: -95 },
          { x: 0.5, y: 0.57, text: "hyoglossus", t: 21.45, hot: true, ox: 60, oy: -40 },
          { x: 0.43, y: 0.78, text: "hyoid bone", t: 22.6, hot: true, ox: -60, oy: 85 },
        ]}
        credit="Gray's 1918, Fig. 1019 · PD"
      />
      <div style={{ position: "absolute", left: 630, top: 150, width: 220, height: 300, borderRadius: 30, overflow: "hidden", background: C.card, boxShadow: `0 0 0 4px ${C.line}`, ...pop(t, 20.7, 0.3) }}>
        <div style={{ position: "absolute", left: -63, top: -115 }}>
          <NeckSide w={420} id="v8" t={t} hyoid={ramp(t, 22.6, 22.9)} tongue={ramp(t, 20.65, 20.9)} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 640, top: 470, width: 210, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.forest, lineHeight: 1.15, ...pop(t, 22.1, 0.25) }}>
        hyoid <span style={{ color: C.red }}>→</span> straight into the tongue
      </div>
      <NoteCard t0={21.9} x={20} y={780} w={820} sub="1918 plate label: “Hyo-glossus”">
        <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px" }}>hyo</span> = hyoid ·{" "}
        <span style={{ background: "#F2C0B8", borderRadius: 8, padding: "0 8px" }}>glossus</span> = tongue
      </NoteCard>
    </Scene>
  );
};

/* 9. Save */
export const SUMMARY = ["touches no other bone", "hyoid = U-shaped (upsilon)", "body + 2 greater + 2 lesser horns", "level C3, below the jaw", "anchors the tongue"];
export const V9: React.FC = () => {
  const t = useT();
  const b = ramp(t, 23.95, 24.3);
  return (
    <Scene start={23.9} end={26.2}>
      <div style={center(0, pop(t, 23.95))}>
        <svg width={140} height={178} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={center(195, pop(t, 24.0))}>
        <Big size={116}>SAVE THIS</Big>
      </div>
      <div style={center(325, pop(t, 24.45))}>
        <Big size={50} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ position: "absolute", left: 70, top: 425, display: "flex", flexDirection: "column", gap: 18 }}>
        {SUMMARY.map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 14, ...pop(t, 24.6 + i * 0.12), transformOrigin: "0 50%" }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: i === 0 ? C.banana : C.matcha, border: `4px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.forest }}>{i + 1}</div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest, whiteSpace: "nowrap" }}>{s}</div>
          </div>
        ))}
      </div>
    </Scene>
  );
};

/* 10. End card (≤ 1.5 s) */
export const V10: React.FC = () => {
  const t = useT();
  const s0 = 26.2;
  return (
    <Scene start={s0} end={27.5}>
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
