import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { ANCHOR, BCOL, BNAME, BONES, BWORD, Bone, OrbitDiagram, Part, wallArc } from "./Orbit61";

export const ASKULL = 1405 / 2068;
export const AMED = 1282 / 1241;
export const liveAlpha = (_t: number) => 0;

const pop = (t: number, t0: number, d = 0.3) => {
  const p = ramp(t, t0, t0 + d);
  return { opacity: p, transform: `scale(${0.6 + 0.4 * p + 0.08 * Math.sin(Math.min(1, p) * Math.PI)})` } as React.CSSProperties;
};
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });
const Big: React.FC<{ size?: number; children: React.ReactNode; color?: string }> = ({ size = 110, children, color = C.forest }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1, letterSpacing: -2, textAlign: "center", whiteSpace: "nowrap" }}>{children}</div>
);

/** letter chip in the bone's colour */
export const LChip: React.FC<{ b: Bone; size?: number; on?: number; style?: React.CSSProperties }> = ({ b, size = 54, on = 1, style }) => (
  <div style={{ width: size * 1.25, height: size * 1.25, borderRadius: size * 0.34, background: on > 0.5 ? BCOL[b] : "rgba(31,42,20,0.07)", border: `${Math.max(3, size * 0.08)}px solid ${on > 0.5 ? C.forest : "rgba(31,42,20,0.25)"}`, color: on > 0.5 ? C.forest : "rgba(31,42,20,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size, boxShadow: on > 0.5 ? "0 6px 0 rgba(31,42,20,0.2)" : "none", transform: `scale(${0.9 + 0.1 * on})`, ...style }}>
    {BWORD[b][0]}
  </div>
);

/* diagram placement in the scene box */
const DX = 130, DY = 175, DW = 600;
const k = DW / 800;
const sx = (x: number) => DX + x * k;
const sy = (y: number) => DY + y * k;

const Callout: React.FC<{ at: [number, number]; dx?: number; dy?: number; to?: [number, number]; align?: "l" | "r" | "c"; t0: number; text: React.ReactNode; hot?: boolean; size?: number; out?: number; inv?: number; col?: string }> = ({ at, dx: dx0 = 0, dy: dy0 = 0, to, align, t0, text, hot, size = 32, out, inv = 1, col }) => {
  const t = useT();
  const dx = to ? to[0] - sx(at[0]) : dx0, dy = to ? to[1] - sy(at[1]) : dy0;
  const al = align ?? (dx < 0 ? "l" : dx === 0 ? "c" : "r");
  const p = ramp(t, t0 - 0.05, t0 + 0.22) * (out === undefined ? 1 : 1 - ramp(t, out, out + 0.22));
  if (p <= 0) return null;
  const x = sx(at[0]), y = sy(at[1]);
  return (
    <>
      <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: p }}>
        <line x1={x} y1={y} x2={x + dx * p * inv} y2={y + dy * p * inv} stroke={C.forest} strokeWidth={5 * inv} strokeLinecap="round" />
        <circle cx={x} cy={y} r={11 * inv} fill={hot ? C.banana : C.paper} stroke={C.forest} strokeWidth={5 * inv} />
      </svg>
      <div style={{ position: "absolute", left: x + dx * inv, top: y + dy * inv, transform: `translate(${al === "l" ? "-100%" : al === "c" ? "-50%" : "0"}, -50%) scale(${(0.8 + 0.2 * p) * inv})`, transformOrigin: al === "l" ? "100% 50%" : al === "c" ? "50% 50%" : "0 50%", opacity: p }}>
        <div style={{ background: hot ? C.banana : C.forest, color: hot ? C.forest : C.paper, fontFamily: FONT, fontWeight: 800, fontSize: size, padding: "6px 18px 9px", borderRadius: 16, whiteSpace: "nowrap", boxShadow: "0 6px 0 rgba(31,42,20,0.18)", borderLeft: col ? `12px solid ${col}` : undefined }}>{text}</div>
      </div>
    </>
  );
};

const Cam: React.FC<{ z: number; f: [number, number]; children: React.ReactNode }> = ({ z, f, children }) => {
  const fx = sx(f[0]), fy = sy(f[1]);
  const cx = 430, cy = 510;
  const m = z - 1;
  return <div style={{ position: "absolute", inset: 0, transformOrigin: "0 0", transform: `translate(${(cx - fx) * m * 0.6}px, ${(cy - fy) * m * 0.6}px) translate(${fx}px, ${fy}px) scale(${z}) translate(${-fx}px, ${-fy}px)` }}>{children}</div>;
};

/** dashed wall bracket along the rim */
const Wall: React.FC<{ a0: number; a1: number; t0: number; col?: string; out?: number }> = ({ a0, a1, t0, col = C.forest, out }) => {
  const t = useT();
  const p = ramp(t, t0, t0 + 0.45) * (out === undefined ? 1 : 1 - ramp(t, out, out + 0.2));
  if (p <= 0) return null;
  return (
    <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <g transform={`translate(${DX} ${DY}) scale(${k})`}>
        <path d={wallArc(a0, a1, 1.1)} fill="none" stroke={C.paper} strokeWidth={26} strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 1`} />
        <path d={wallArc(a0, a1, 1.1)} fill="none" stroke={col} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={`${p} 1`} />
      </g>
    </svg>
  );
};

/* 1. Hook: Gray's 1918 Fig. 190 already on screen, challenge text from frame 0 */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={2.5} push={0.02}>
      <div style={center(14, pop(t, -0.4, 0.25))}>
        <Big size={96}>NAME ALL 7</Big>
      </div>
      <div style={center(116, pop(t, -0.3, 0.25))}>
        <Big size={70} color={C.red}>EYE SOCKET BONES</Big>
      </div>
      <Plate src="plates/skull.png" aspect={ASKULL} x={195} y={215} w={470} a={-0.6} b={2.5} zoomFrom={[1.0, 0.5, 0.45]} zoomTo={[1.75, 0.3, 0.47]}
        covers={[{ x: 0.86, y: 0.86, w: 0.14, h: 0.06 }]}
        labels={[{ x: 0.29, y: 0.47, text: "?", t: 1.3, hot: true, ox: -70, oy: -60 }]} />
      <div style={{ position: "absolute", left: 0, width: 860, top: 850, display: "flex", justifyContent: "center", ...pop(t, 0.95, 0.25) }}>
        <Pill size={40} bg={C.forest}>bones of the orbit · mnemonic</Pill>
      </div>
      <Stamp t0={1.7} text="EXAM FAVORITE" size={40} rot={-8} color={C.forest} style={{ left: 470, top: 700 }} />
    </Scene>
  );
};

/* 2. Mnemonic card: first letters highlighted */
const WT: Record<Bone, number> = { MAX: 3.63, FRO: 3.84, ZYG: 4.22, ETH: 4.71, LAC: 5.1, SPH: 5.54, PAL: 5.81 };
export const V2: React.FC = () => {
  const t = useT();
  const rows: Bone[][] = [["MAX", "FRO"], ["ZYG", "ETH"], ["LAC", "SPH"], ["PAL"]];
  return (
    <Scene start={2.5} end={6.55} push={0.015}>
      <div style={{ position: "absolute", left: 20, top: 50, width: 820, height: 830, borderRadius: 48, background: C.forest, ...pop(t, 2.52, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 44, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 7, color: C.matchaLight }}>THE ORBIT MNEMONIC</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 125, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
          {rows.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 30 }}>
              {r.map((b) => {
                const p = ramp(t, WT[b] - 0.08, WT[b] + 0.16);
                const w = BWORD[b];
                return (
                  <div key={b} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 94, lineHeight: 1.05, letterSpacing: -2, color: C.paper, opacity: 0.18 + 0.82 * p, transform: `translateY(${(1 - p) * 18}px)` }}>
                    <span style={{ background: p > 0.3 ? BCOL[b] : "transparent", color: p > 0.3 ? C.forest : C.paper, borderRadius: 18, padding: "0 12px 6px" }}>{w[0]}</span>
                    {w.slice(1)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 740, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.matchaLight, opacity: ramp(t, 2.8, 3.1) }}>7 words = 7 bones</div>
      </div>
    </Scene>
  );
};

/* 3+4. Our diagram: 7 bones light up as named, then the lateral wall */
const NT: Record<Bone, number> = { MAX: 6.66, FRO: 7.11, ZYG: 7.67, ETH: 8.25, LAC: 8.74, SPH: 9.22, PAL: 9.76 };
const LB: { b: Bone; at: [number, number]; to: [number, number]; al: "l" | "r" | "c" }[] = [
  { b: "MAX", at: ANCHOR.MAX, to: [440, 802], al: "c" },
  { b: "FRO", at: ANCHOR.FRO, to: [430, 128], al: "c" },
  { b: "ZYG", at: ANCHOR.ZYG, to: [165, 790], al: "c" },
  { b: "ETH", at: ANCHOR.ETH, to: [690, 250], al: "r" },
  { b: "LAC", at: ANCHOR.LAC, to: [690, 640], al: "r" },
  { b: "SPH", at: ANCHOR.SGW, to: [235, 215], al: "l" },
  { b: "PAL", at: ANCHOR.PAL, to: [600, 790], al: "r" },
];
export const V3: React.FC = () => {
  const t = useT();
  const phase2 = t >= 10.62;
  const lit: Partial<Record<Part, number>> = phase2
    ? { ZYG: 10.9, SGW: 11.62 }
    : { MAX: NT.MAX, FRO: NT.FRO, ZYG: NT.ZYG, ETH: NT.ETH, LAC: NT.LAC, SPB: NT.SPH, SGW: NT.SPH, SLW: NT.SPH, PAL: NT.PAL };
  let cur: Bone | null = null;
  BONES.forEach((b) => {
    if (t >= NT[b] - 0.05) cur = b;
  });
  const glowMap: Record<Bone, Part[]> = { MAX: ["MAX"], FRO: ["FRO"], ZYG: ["ZYG"], ETH: ["ETH"], LAC: ["LAC"], SPH: ["SGW", "SLW", "SPB"], PAL: ["PAL"] };
  const glow: Part[] = phase2 ? (t < 11.6 ? ["ZYG"] : t < 13.4 ? ["ZYG", "SGW"] : []) : cur ? glowMap[cur as Bone] : [];
  const z = phase2 ? 1.0 + 0.3 * ramp(t, 10.65, 11.4) : 1.0 + 0.03 * ramp(t, 6.6, 10.5);
  const f: [number, number] = phase2 ? [200, 380] : [420, 380];
  return (
    <Scene start={6.55} end={14.42} push={0.01}>
      <div style={{ position: "absolute", left: -40, top: 84, width: 940, height: 760, overflow: "hidden", borderRadius: 40 }}>
        <div style={{ position: "absolute", left: 40, top: -84, width: 860, height: 940 }}>
          <Cam z={z} f={f}>
            <div style={{ position: "absolute", left: DX, top: DY }}>
              <OrbitDiagram t={t} w={DW} lit={lit} glow={glow} dim={phase2 ? 0.28 : 0} id="v3" />
            </div>
            {!phase2 && LB.map((l) => (
              <Callout key={l.b} at={l.at} to={l.to} align={l.al} t0={NT[l.b]} hot={cur === l.b} text={BNAME[l.b]} out={10.45} col={BCOL[l.b]} size={34} />
            ))}
            {phase2 && <Wall a0={150} a1={212} t0={12.55} col={C.red} />}
            {phase2 && <Callout at={ANCHOR.ZYG} dx={-30} dy={200} align="c" t0={10.95} hot={t < 11.6} text="zygomatic" inv={1 / z} col={BCOL.ZYG} />}
            {phase2 && <Callout at={ANCHOR.SGW} dx={60} dy={-250} t0={11.68} hot={t >= 11.6 && t < 12.5} text="greater wing of sphenoid" inv={1 / z} size={30} col={BCOL.SPH} />}
          </Cam>
        </div>
      </div>
      {/* title row */}
      {!phase2 && (
        <div style={{ position: "absolute", left: 0, width: 860, top: 20, display: "flex", justifyContent: "center", ...pop(t, 6.6, 0.25) }}>
          <Big size={54}>7 BONES · 1 EYE SOCKET</Big>
        </div>
      )}
      {phase2 && (
        <div style={{ position: "absolute", left: 0, width: 860, top: 20, display: "flex", justifyContent: "center", ...pop(t, 10.7, 0.25) }}>
          <Big size={62}>LATERAL WALL</Big>
        </div>
      )}
      {/* letter strip */}
      {!phase2 && (
        <div style={{ position: "absolute", left: 0, width: 860, top: 856, display: "flex", justifyContent: "center", gap: 12, opacity: 1 - ramp(t, 10.4, 10.6) }}>
          {BONES.map((b) => (
            <LChip key={b} b={b} size={44} on={t >= NT[b] - 0.05 ? 1 : 0} />
          ))}
        </div>
      )}
      {phase2 && (
        <div style={{ position: "absolute", left: 0, width: 860, top: 866, display: "flex", justifyContent: "center", ...pop(t, 12.6) }}>
          <Pill size={38} bg={C.forest}>outer side · zygomatic + sphenoid</Pill>
        </div>
      )}
      {phase2 && <Stamp t0={13.49} text="STRONGEST" size={60} rot={-9} color={C.red} style={{ left: 420, top: 640 }} />}
    </Scene>
  );
};

/* 5. Medial wall on Gray's 1918 Fig. 192 (left orbit seen from the inside) */
export const V5: React.FC = () => {
  const t = useT();
  return (
    <Scene start={14.42} end={18.15} push={0.006}>
      <div style={{ position: "absolute", left: 0, width: 860, top: 22, display: "flex", justifyContent: "center", ...pop(t, 14.5, 0.25) }}>
        <Big size={62}>MEDIAL WALL</Big>
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 92, display: "flex", justifyContent: "center", ...pop(t, 14.75, 0.25) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.matcha }}>nose side · left orbit, Gray's 1918</div>
      </div>
      <Plate src="plates/medial.png" aspect={AMED} x={30} y={145} w={800} a={14.42} b={18.15} zoomFrom={[1.0, 0.5, 0.45]} zoomTo={[1.32, 0.47, 0.33]}
        covers={[{ x: 0.75, y: 0, w: 0.25, h: 0.072 }, { x: 0.84, y: 0.07, w: 0.16, h: 0.13 }, { x: 0.845, y: 0.545, w: 0.155, h: 0.215 }, { x: 0.64, y: 0.855, w: 0.36, h: 0.07 }, { x: 0, y: 0.045, w: 0.105, h: 0.085 }]}
        labels={[
          { x: 0.43, y: 0.12, text: "frontal", t: 14.7 },
          { x: 0.335, y: 0.3, text: "lacrimal", t: 14.95, ox: -120, oy: 60 },
          { x: 0.26, y: 0.8, text: "maxilla", t: 15.2, ox: 60, oy: -50 },
          { x: 0.76, y: 0.34, text: "sphenoid", t: 15.4, ox: -10, oy: 130 },
          { x: 0.52, y: 0.27, text: "ethmoid · orbital plate", t: 16.3, hot: true, ox: -40, oy: 265 },
        ]} />
      <Stamp t0={15.45} text="THINNEST" size={56} rot={-8} color={C.red} style={{ left: 470, top: 690 }} />
      <div style={{ position: "absolute", left: 0, width: 860, top: 870, display: "flex", justifyContent: "center", ...pop(t, 16.75) }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 22px 11px", fontFamily: FONT, fontWeight: 800, fontSize: 29, color: C.forest, whiteSpace: "nowrap" }}>
          <span style={{ color: C.matcha }}>atlas Latin:</span> “lamina papyracea” = paper layer
        </div>
      </div>
    </Scene>
  );
};

/* 6. Quick test */
export const V6: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[20.97, 3], [21.62, 2], [22.29, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => {
    if (t >= s - 0.05 && t < 22.85) { n = v; n0 = s; }
  });
  const opts: [string, Bone][] = [["maxilla", "MAX"], ["frontal", "FRO"], ["zygomatic", "ZYG"]];
  return (
    <Scene start={18.15} end={22.85}>
      <div style={{ position: "absolute", left: 20, top: 55, width: 820, height: 830, borderRadius: 48, background: C.forest, ...pop(t, 18.2, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 56, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 140, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 68, lineHeight: 1.12, color: C.paper, ...pop(t, 18.95) }}>
          Which bone forms most of the <span style={{ color: C.banana }}>ROOF</span>?
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 390, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          {opts.map(([o], i) => (
            <div key={o} style={{ ...pop(t, 19.6 + i * 0.15), display: "flex", alignItems: "center", gap: 18, width: 360 }}>
              <div style={{ width: 62, height: 62, borderRadius: 18, background: C.banana, color: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, border: `4px solid ${C.paper}` }}>{"ABC"[i]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper, whiteSpace: "nowrap" }}>{o}</div>
            </div>
          ))}
        </div>
        {n !== null && (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 630, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 170, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 7. Answer: frontal + lesser wing of sphenoid = the roof */
export const V7: React.FC = () => {
  const t = useT();
  const lit: Partial<Record<Part, number>> = { FRO: 22.95, SLW: 24.37 };
  const glow: Part[] = t < 24.3 ? ["FRO"] : ["FRO", "SLW"];
  const z = 1.08 + 0.1 * ramp(t, 22.9, 25.5);
  return (
    <Scene start={22.85} end={26.15} push={0.012}>
      <div style={{ position: "absolute", left: 0, width: 860, top: 30, display: "flex", justifyContent: "center", ...pop(t, 22.9, 0.25) }}>
        <Pill size={52} bg={C.matcha}>B · FRONTAL ✓</Pill>
      </div>
      <div style={{ position: "absolute", left: -40, top: 120, width: 940, height: 730, overflow: "hidden", borderRadius: 40 }}>
        <div style={{ position: "absolute", left: 40, top: -120, width: 860, height: 940 }}>
          <Cam z={z} f={[420, 300]}>
            <div style={{ position: "absolute", left: DX, top: DY }}>
              <OrbitDiagram t={t} w={DW} lit={lit} glow={glow} dim={0.25} id="v7" />
            </div>
            <Wall a0={218} a1={318} t0={23.1} col={C.matcha} />
            <Callout at={ANCHOR.FRO} dx={130} dy={-100} t0={23.2} hot={t < 24.3} text="frontal" inv={1 / z} size={30} col={BCOL.FRO} />
            <Callout at={ANCHOR.SLW} dx={0} dy={290} align="c" t0={24.4} hot text="lesser wing of sphenoid" inv={1 / z} size={30} col={BCOL.SPH} />
          </Cam>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 868, display: "flex", justifyContent: "center", ...pop(t, 25.0) }}>
        <Pill size={38} bg={C.forest}>ROOF = frontal + lesser wing (at the back)</Pill>
      </div>
    </Scene>
  );
};

/* 8. Save */
export const V8: React.FC = () => {
  const t = useT();
  const b = ramp(t, 26.2, 26.55);
  return (
    <Scene start={26.15} end={28.3}>
      <div style={center(20, pop(t, 26.2))}>
        <svg width={170} height={220} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={center(270, pop(t, 26.29))}>
        <Big size={120}>SAVE THIS</Big>
      </div>
      <div style={center(410, pop(t, 26.8))}>
        <Big size={56} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ ...center(530), gap: 12 }}>
        {BONES.map((bb, i) => (
          <div key={bb} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, ...pop(t, 27.0 + i * 0.07) }}>
            <LChip b={bb} size={50} />
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 19, color: C.forest, whiteSpace: "nowrap" }}>{BNAME[bb].toLowerCase()}</div>
          </div>
        ))}
      </div>
      <div style={center(740, pop(t, 27.55))}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.forest, whiteSpace: "nowrap" }}>
          Many Friendly Zebras Enjoy Lazy Summer Picnics
        </div>
      </div>
    </Scene>
  );
};

/* 9. End card (short) */
export const V9: React.FC = () => {
  const t = useT();
  return (
    <Scene start={28.3} end={29.9}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, 28.32, 0.3) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.banana, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 28.6, 28.9) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 28.3) * 5))})`, opacity: ramp(t, 28.4, 28.6) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
