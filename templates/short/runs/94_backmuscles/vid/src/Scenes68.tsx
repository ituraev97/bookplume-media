import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { NewbornSkull, HipBone, Fuse } from "./Bones68";

export const ASKT = 1052 / 1293;
export const AHIP = 1029 / 1274;
export const ASKS = 1259 / 957;
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

/* 1. Hook: Gray's 1918 Fig. 197 (skull at birth, from above) on screen from frame 0 */
const V1Z0: [number, number, number] = [1.0, 0.5, 0.45];
const V1Z1: [number, number, number] = [1.12, 0.5, 0.3];
export const V1: React.FC = () => {
  const t = useT();
  const PX = 150, PY = 250, PW = 560;
  const [ax, ay] = plateXY(t, PX, PY, PW, ASKT, -0.6, 3.75, V1Z0, V1Z1, 0.5, 0.22);
  const dot = 0.5 + 0.5 * Math.sin(t * 7);
  const n = Math.round(300 - 94 * ramp(t, 2.6, 3.3));
  return (
    <Scene start={-0.6} end={3.75} push={0.02}>
      <div style={center(25, pop(t, -0.4, 0.25))}>
        <Big size={88}>BABIES: <span style={{ color: C.red }}>300</span> BONES</Big>
      </div>
      <div style={center(140, pop(t, -0.3, 0.25))}>
        <Big size={92}>YOU: <span style={{ background: C.banana, borderRadius: 18, padding: "0 14px" }}>206</span></Big>
      </div>
      <Plate src="plates/skull_top.png" aspect={ASKT} x={PX} y={PY} w={PW} a={-0.6} b={3.75} zoomFrom={V1Z0} zoomTo={V1Z1} credit="Gray's 1918, Fig. 197 · PD" />
      <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <ellipse cx={ax} cy={ay} rx={70 + 6 * dot} ry={80 + 6 * dot} fill="none" stroke={C.red} strokeWidth={8} opacity={ramp(t, 0.9, 1.2)} />
      </svg>
      <Lead x1={ax - 70} y1={ay} x2={40} y2={ay + 60} p={ramp(t, 1.2, 1.45)} col={C.red} />
      <div style={{ position: "absolute", left: -10, top: ay + 40, ...pop(t, 1.3, 0.22), transformOrigin: "0 50%" }}>
        <Pill size={30} bg={C.red}>soft spot</Pill>
      </div>
      <div style={{ position: "absolute", left: 600, top: 330, ...pop(t, 0.5, 0.25) }}>
        <Pill size={30} bg={C.forest}>newborn skull</Pill>
      </div>
      <div style={{ position: "absolute", left: 615, top: 780, width: 230, height: 120, borderRadius: 26, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", ...pop(t, 2.55, 0.25) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 62, color: n === 206 ? C.banana : C.paper, lineHeight: 1 }}>{n}</div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, color: C.matchaLight }}>bones</div>
      </div>
      <div style={{ position: "absolute", left: 0, top: 860, ...pop(t, 1.9, 0.25) }}>
        <Pill size={30} bg={C.banana} color={C.forest}>skeleton fact · bones fuse</Pill>
      </div>
    </Scene>
  );
};

/* 2. They fused */
export const V2: React.FC = () => {
  const t = useT();
  const p = ramp(t, 4.05, 4.85);
  return (
    <Scene start={3.75} end={5.5} push={0.01}>
      <div style={center(40, pop(t, 3.8, 0.22))}>
        <Big size={80}>NOT LOST…</Big>
      </div>
      <div style={center(150, pop(t, 4.62, 0.22))}>
        <Big size={130} color={C.red}>FUSED</Big>
      </div>
      <div style={{ position: "absolute", left: 30, top: 330, ...pop(t, 3.85, 0.3) }}>
        <Fuse w={800} p={p} t={t} />
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 760, display: "flex", justifyContent: "center", gap: 18 }}>
        <div style={pop(t, 4.2, 0.22)}><Pill size={44} bg={C.forest}>2 bones</Pill></div>
        <div style={{ ...pop(t, 4.5, 0.22), fontFamily: FONT, fontWeight: 800, fontSize: 60, color: C.forest }}>→</div>
        <div style={pop(t, 4.85, 0.22)}><Pill size={44} bg={C.banana} color={C.forest}>1 bone</Pill></div>
      </div>
    </Scene>
  );
};

/* 3. Soft spots: own newborn-skull diagram, parts lit as named */
export const V3: React.FC = () => {
  const t = useT();
  const DX = 110, DY = 150, DW = 520, k = DW / 600;
  const P = (x: number, y: number) => [DX + x * k, DY + y * k];
  const [ax, ay] = P(300, 245), [px, py] = P(300, 590);
  const lit = ramp(t, 7.33, 7.6);
  return (
    <Scene start={5.5} end={9.85} push={0.01}>
      <div style={center(30, pop(t, 5.55, 0.22))}>
        <Big size={84}>NEWBORN SKULL</Big>
      </div>
      <div style={{ position: "absolute", left: DX, top: DY, ...pop(t, 5.6, 0.3) }}>
        <NewbornSkull w={DW} id="v3" t={t} plates={ramp(t, 8.5, 8.8)} ant={lit} post={lit} sut={ramp(t, 9.1, 9.35)} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 150, ...pop(t, 6.0, 0.22), transformOrigin: "0 50%" }}>
        <Pill size={26} bg={C.forest}>top view</Pill>
      </div>
      <Lead x1={ax + 48} y1={ay} x2={680} y2={(ay + py) / 2 - 40} p={ramp(t, 7.35, 7.6)} col={C.red} />
      <Lead x1={px + 26} y1={py} x2={680} y2={(ay + py) / 2 - 20} p={ramp(t, 7.45, 7.7)} col={C.red} />
      <div style={{ position: "absolute", left: 645, top: (ay + py) / 2 - 60, width: 230, textAlign: "center", ...pop(t, 7.4, 0.22) }}>
        <Pill size={36} bg={C.red}>fontanelles</Pill>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.forest, marginTop: 10 }}>= soft spots</div>
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 845, display: "flex", justifyContent: "center", gap: 14 }}>
        <div style={pop(t, 8.55, 0.22)}><Pill size={34} bg={C.matcha}>bony plates</Pill></div>
        <div style={pop(t, 9.2, 0.22)}><Pill size={34} bg={C.banana} color={C.forest}>not joined yet</Pill></div>
      </div>
    </Scene>
  );
};

/* 4. The biggest: anterior fontanelle on Gray's Fig. 197 + closing inset */
const V4Z0: [number, number, number] = [1.05, 0.5, 0.35];
const V4Z1: [number, number, number] = [1.7, 0.5, 0.2];
export const V4: React.FC = () => {
  const t = useT();
  const [fx, fy] = plateXY(t, 20, 110, 580, ASKT, 9.85, 14.0, V4Z0, V4Z1, 0.5, 0.22);
  return (
    <Scene start={9.85} end={14.0} push={0.006}>
      <div style={center(25, pop(t, 9.9, 0.25))}>
        <Big size={64}>ANTERIOR FONTANELLE</Big>
      </div>
      <Plate
        src="plates/skull_top.png" aspect={ASKT} x={20} y={110} w={580} a={9.85} b={14.0} zoomFrom={V4Z0} zoomTo={V4Z1}
        credit="Gray's 1918, Fig. 197 · PD"
      />
      <Lead x1={fx} y1={fy} x2={170} y2={640} p={ramp(t, 10.7, 10.95)} col={C.red} />
      <div style={{ position: "absolute", left: 40, top: 620, ...pop(t, 10.75, 0.22), transformOrigin: "0 50%" }}>
        <Pill size={38} bg={C.banana} color={C.forest}>anterior fontanelle</Pill>
      </div>
      <div style={{ position: "absolute", left: 620, top: 110, width: 230, height: 300, borderRadius: 30, background: C.card, boxShadow: `0 0 0 4px ${C.line}`, overflow: "hidden", ...pop(t, 10.2, 0.3) }}>
        <div style={{ position: "absolute", left: 30, top: 34 }}>
          <NewbornSkull w={170} id="v4" t={t} ant={1} post={0.6} close={ramp(t, 12.5, 13.8)} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 620, top: 425, width: 230, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.forest, lineHeight: 1.15, ...pop(t, 10.4, 0.25) }}>
        the biggest<br /><span style={{ color: C.matcha, fontSize: 24 }}>diamond-shaped</span>
      </div>
      <Stamp t0={12.5} text="CLOSES BY ~AGE 2" size={40} rot={-6} color={C.red} style={{ left: 560, top: 560 }} />
      <NoteCard t0={12.0} x={20} y={845} w={820} sub="its other name: the bregmatic fontanelle">
        1918 atlas name: “frontal fontanel”
      </NoteCard>
    </Scene>
  );
};

/* 5. Quick test */
export const V5: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[17.23, 3], [17.86, 2], [18.51, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => {
    if (t >= s - 0.05 && t < 19.2) { n = v; n0 = s; }
  });
  const opts = ["ilium · ischium · pubis", "femur · tibia · fibula", "sacrum · coccyx · ilium"];
  return (
    <Scene start={14.0} end={19.15}>
      <div style={{ position: "absolute", left: 20, top: 55, width: 820, height: 830, borderRadius: 48, background: C.forest, ...pop(t, 14.03, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 56, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 130, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 62, lineHeight: 1.12, color: C.paper, ...pop(t, 14.85) }}>
          Which <span style={{ color: C.banana }}>3 bones</span> fuse into ONE <span style={{ color: C.banana }}>HIP BONE?</span>
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 360, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          {opts.map((o, i) => (
            <div key={o} style={{ ...pop(t, 15.6 + i * 0.25), display: "flex", alignItems: "center", gap: 18, width: 640 }}>
              <div style={{ width: 62, height: 62, flex: "0 0 62px", borderRadius: 18, background: C.banana, color: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, border: `4px solid ${C.paper}` }}>{"ABC"[i]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.paper, whiteSpace: "nowrap" }}>{o}</div>
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

/* 6. Answer on Gray's Fig. 237 (ossification of the hip bone) + own diagram */
export const V6: React.FC = () => {
  const t = useT();
  return (
    <Scene start={19.15} end={23.0} push={0.006}>
      <div style={center(25, pop(t, 19.2, 0.25))}>
        <Pill size={46} bg={C.matcha}>A ✓ ilium · ischium · pubis</Pill>
      </div>
      <Plate
        src="plates/hip_ossif.png" aspect={AHIP} x={20} y={120} w={470} a={19.15} b={23.0} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.08, 0.4, 0.6]}
        labels={[
          { x: 0.6, y: 0.28, text: "ilium", t: 19.2, ox: 50, oy: -50 },
          { x: 0.45, y: 0.86, text: "ischium", t: 19.55, ox: 80, oy: -30 },
          { x: 0.14, y: 0.62, text: "pubis", t: 20.07, ox: 20, oy: -110 },
          { x: 0.38, y: 0.63, text: "acetabulum", t: 22.0, hot: true, ox: 70, oy: 75 },
        ]}
        credit="Gray's 1918, Fig. 237 · PD"
      />
      <div style={{ position: "absolute", left: 505, top: 150, ...pop(t, 19.3, 0.3) }}>
        <HipBone w={340} id="v6" t={t} il={ramp(t, 19.2, 19.45)} is={ramp(t, 19.55, 19.8)} pu={ramp(t, 20.07, 20.3)} ac={ramp(t, 21.98, 22.2)} />
      </div>
      <div style={{ position: "absolute", left: 510, top: 570, width: 340, display: "flex", flexDirection: "column", gap: 10 }}>
        {([["ilium", C.matchaLight, 19.2], ["ischium", C.redLight, 19.55], ["pubis", C.banana, 20.07]] as [string, string, number][]).map(([s, col, t0]) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 12, ...pop(t, t0, 0.2), transformOrigin: "0 50%" }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: col, border: `4px solid ${C.forest}` }} />
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.forest }}>{s}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 505, top: 740, ...pop(t, 21.1, 0.22) }}>
        <Pill size={30} bg={C.red}>meet in the hip socket</Pill>
      </div>
      <NoteCard t0={22.15} x={20} y={820} w={820} sub="= triradiate cartilage, fuses in the late teens">
        1918 plate label: “Y-shaped piece”
      </NoteCard>
    </Scene>
  );
};

/* 7. Trick: you sit on your ischium */
export const V7: React.FC = () => {
  const t = useT();
  return (
    <Scene start={23.0} end={24.5} push={0.01}>
      <div style={center(25, pop(t, 23.02, 0.22))}>
        <Big size={60}>TRICK: YOU <span style={{ background: C.banana, borderRadius: 14, padding: "0 10px" }}>SIT</span> ON YOUR</Big>
      </div>
      <div style={center(115, pop(t, 23.8, 0.22))}>
        <Big size={110} color={C.red}>ISCHIUM</Big>
      </div>
      <div style={{ position: "absolute", left: 200, top: 250, ...pop(t, 23.05, 0.3) }}>
        <HipBone w={460} id="v7" t={t} il={0.35} pu={0.35} is={ramp(t, 23.8, 24.0)} tub={ramp(t, 23.4, 23.6)} ac={0} dim={0} />
      </div>
      <Lead x1={200 + 462 * (460 / 600) + 40} y1={250 + 598 * (460 / 600)} x2={760} y2={250 + 598 * (460 / 600) + 50} p={ramp(t, 23.45, 23.65)} col={C.red} />
      <div style={{ position: "absolute", left: 690, top: 250 + 598 * (460 / 600) + 30, ...pop(t, 23.5, 0.2) }}>
        <Pill size={30} bg={C.red}>sit bone</Pill>
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 860, display: "flex", justifyContent: "center", ...pop(t, 23.95, 0.22) }}>
        <Pill size={30} bg={C.forest}>ischial tuberosity carries your weight when sitting</Pill>
      </div>
    </Scene>
  );
};

/* 8. Save */
export const SUMMARY = ["newborn ≈ 300 bones → adult 206", "they don't vanish, they fuse", "fontanelles = soft spots of the skull", "anterior fontanelle closes by ~age 2", "hip bone = ilium + ischium + pubis", "all 3 meet at the acetabulum"];
export const V8: React.FC = () => {
  const t = useT();
  const b = ramp(t, 24.55, 24.9);
  return (
    <Scene start={24.5} end={26.5}>
      <div style={center(0, pop(t, 24.55))}>
        <svg width={120} height={152} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={center(165, pop(t, 24.6))}>
        <Big size={110}>SAVE THIS</Big>
      </div>
      <div style={center(290, pop(t, 24.95))}>
        <Big size={46} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ position: "absolute", left: 30, top: 385, display: "flex", flexDirection: "column", gap: 16 }}>
        {SUMMARY.map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 14, ...pop(t, 25.05 + i * 0.1), transformOrigin: "0 50%" }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: i === 0 ? C.banana : C.matcha, border: `4px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.forest }}>{i + 1}</div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.forest, whiteSpace: "nowrap" }}>{s}</div>
          </div>
        ))}
      </div>
    </Scene>
  );
};


/* 9. End card (≤ 1.5 s) */
export const V9: React.FC = () => {
  const t = useT();
  const s0 = 26.5;
  return (
    <Scene start={s0} end={27.9}>
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
