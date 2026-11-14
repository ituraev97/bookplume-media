import React from "react";
import { C, FONT, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { BId, BR, FPart, Face, FaceLabels } from "./Face45";

export const ASPECT_F = 1499 / 1599;
const pop = (t: number, t0: number, d = 0.3) => {
  const p = ramp(t, t0, t0 + d);
  return { opacity: p, transform: `scale(${0.6 + 0.4 * p + 0.08 * Math.sin(Math.min(1, p) * Math.PI)})` } as React.CSSProperties;
};
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });
const Big: React.FC<{ size?: number; children: React.ReactNode; color?: string }> = ({ size = 110, children, color = C.forest }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1, letterSpacing: -2, textAlign: "center" }}>{children}</div>
);
const chip = (bg: string, color: string, size = 34): React.CSSProperties => ({ background: bg, color, fontFamily: FONT, fontWeight: 800, fontSize: size, padding: "8px 20px 11px", borderRadius: 16, whiteSpace: "nowrap" });
export const liveAlpha = (_t: number) => 0;

/* plate geometry (Gray 1918 Fig. 790 crop) — points ON each branch, fractions of the crop */
export const PB: Record<BId | "trunk", [number, number]> = {
  trunk: [0.5, 0.494],
  tem: [0.563, 0.384],
  zyg: [0.587, 0.431],
  buc: [0.647, 0.581],
  man: [0.594, 0.653],
  cer: [0.587, 0.725],
};

/* 1. Hook: Gray's 1918 plate, five branches numbered */
export const V1: React.FC = () => {
  const t = useT();
  const W = 560, X = 150, Y = 300;
  return (
    <Scene start={-0.6} end={2.75} push={0.02}>
      <div style={{ position: "absolute", left: 0, top: 20, width: 860, textAlign: "center", ...pop(t, 0.02, 0.25) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.matcha, letterSpacing: 5 }}>CAN YOU NAME THE</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 72, color: C.forest, letterSpacing: -2, lineHeight: 1.1, marginTop: 6, whiteSpace: "nowrap" }}>
          <span style={{ background: t >= 0.59 ? C.banana : "transparent", borderRadius: 20, padding: "0 16px 6px" }}>5 branches</span> of the
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 72, color: C.forest, letterSpacing: -2, lineHeight: 1.1, whiteSpace: "nowrap", opacity: ramp(t, 1.65, 1.85) }}>facial nerve?</div>
      </div>
      <Plate src="plates/face.png" aspect={ASPECT_F} x={X} y={Y} w={W} a={-0.6} b={2.75} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.45, 0.56, 0.55]}
        labels={(["tem", "zyg", "buc", "man", "cer"] as BId[]).map((id, i) => ({ x: PB[id][0], y: PB[id][1], text: String(i + 1), t: 1.0 + i * 0.2, hot: true, ox: [-80, 95, 105, 100, -95][i], oy: [-50, -45, 0, 40, 40][i] }))}
        credit="Gray's Anatomy, 1918 · public domain" />
    </Scene>
  );
};

/* Diagram stage with camera moves */
type Step = { t: number; zoom: [number, number, number]; focus: FPart[] };
const Stage: React.FC<{ t: number; start: number; steps: Step[]; props: Partial<React.ComponentProps<typeof Face>>; lab?: Partial<React.ComponentProps<typeof FaceLabels>>; h?: number; top?: number; note?: string }> = ({ t, start, steps, props, lab = {}, h = 680, top = 10, note = "Book Plume diagram · right side of the head" }) => {
  let ci = 0;
  steps.forEach((s, i) => { if (t >= s.t) ci = i; });
  const cur = steps[ci];
  const prev = steps[Math.max(0, ci - 1)];
  const k = ci === 0 ? 1 : ramp(t, cur.t, cur.t + 0.8);
  const zs = prev.zoom[0] + (cur.zoom[0] - prev.zoom[0]) * k;
  const zx = prev.zoom[1] + (cur.zoom[1] - prev.zoom[1]) * k;
  const zy = prev.zoom[2] + (cur.zoom[2] - prev.zoom[2]) * k;
  const zIn = ramp(t, start, start + 0.9);
  const s = 1 + (zs - 1) * zIn;
  return (
    <div style={{ position: "absolute", left: 0, top, width: 860, height: h, overflow: "hidden", borderRadius: 36, background: C.card, border: `3px solid ${C.line}` }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 860, height: h, transform: `scale(${s})`, transformOrigin: `${zx * 100}% ${zy * 100}%` }}>
        <div style={{ position: "absolute", left: 0, top: 0 }}><Face t={t} w={860} focus={cur.focus} {...props} /></div>
      </div>
      <FaceLabels t={t} h={h} focus={cur.focus} lit={props.lit} {...lab} map={(x, y) => [zx * 860 + (x - zx * 860) * s, zy * h + (y - zy * h) * s]} />
      <div style={{ position: "absolute", left: 14, bottom: 10, fontFamily: FONT, fontWeight: 700, fontSize: 18, color: C.forest, background: "rgba(255,254,246,0.9)", padding: "2px 10px", borderRadius: 8, opacity: 0.7 }}>{note}</div>
    </div>
  );
};

const DarkCard: React.FC<{ t: number; t0: number; children: React.ReactNode; top?: number; h?: number }> = ({ t, t0, children, top = 708, h = 200 }) => (
  <div style={{ position: "absolute", left: 30, width: 800, top, height: h, borderRadius: 36, background: C.forest, boxShadow: "0 14px 30px rgba(31,42,20,0.25)", ...pop(t, t0, 0.3) }}>{children}</div>
);
const row = (top: number): React.CSSProperties => ({ position: "absolute", left: 0, width: 800, top, display: "flex", justifyContent: "center", alignItems: "center", gap: 16 });

/* 2. Cranial nerve VII, moves the face, exits below the ear, fans out in the parotid */
export const V2: React.FC = () => {
  const t = useT();
  return (
    <Scene start={2.75} end={10.8} push={0.01}>
      <Stage t={t} start={2.75} steps={[
        { t: 2.75, zoom: [1.0, 0.5, 0.5], focus: [] },
        { t: 3.0, zoom: [1.12, 0.42, 0.55], focus: ["trunk"] },
        { t: 4.9, zoom: [1.0, 0.6, 0.5], focus: ["muscles"] },
        { t: 7.3, zoom: [1.45, 0.38, 0.56], focus: ["exit"] },
        { t: 8.55, zoom: [1.05, 0.5, 0.5], focus: [] },
        { t: 9.4, zoom: [1.3, 0.45, 0.6], focus: ["parotid"] },
      ]} props={{ show: { trunk: 2.95, tem: 8.62, zyg: 8.72, buc: 8.82, man: 8.92, cer: 9.02, parotid: 9.3 }, lit: { trunk: 2.93, muscles: 5.01, exit: 7.45, parotid: 9.48 } }}
        lab={{ labels: { trunk: 3.0, exit: 7.5, parotid: 9.55 }, labelEnd: { trunk: 6.3, exit: 9.3 } }} />
      <DarkCard t={t} t0={2.8}>
        {t < 6.35 ? (
          <>
            <div style={row(30)}>
              <div style={{ ...pop(t, 2.93), ...chip(C.banana, C.forest, 42) }}>Cranial nerve VII</div>
              <div style={{ ...pop(t, 3.62), fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper }}>(7)</div>
            </div>
            <div style={row(116)}>
              <div style={{ ...pop(t, 4.52), fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.matchaLight }}>moves the</div>
              <div style={{ ...pop(t, 5.01), ...chip(C.matcha, C.paper, 40) }}>muscles of your face</div>
            </div>
          </>
        ) : (
          <>
            <div style={row(30)}>
              <div style={{ ...pop(t, 6.4), fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.paper }}>leaves the skull</div>
              <div style={{ ...pop(t, 7.45), ...chip(C.banana, C.forest, 40) }}>below the ear</div>
            </div>
            <div style={row(116)}>
              <div style={{ ...pop(t, 8.66), fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.matchaLight }}>fans out in the</div>
              <div style={{ ...pop(t, 9.48), ...chip(C.paper, C.forest, 40) }}>parotid gland</div>
            </div>
          </>
        )}
      </DarkCard>
    </Scene>
  );
};

/* 3. Mnemonic card: To Zanzibar By Motor Car */
const MW = [
  { w: "To", t: 11.84 },
  { w: "Zanzibar", t: 11.94 },
  { w: "By", t: 12.6 },
  { w: "Motor", t: 12.77 },
  { w: "Car", t: 13.02 },
];
export const V3: React.FC = () => {
  const t = useT();
  return (
    <Scene start={10.8} end={13.65}>
      <div style={{ position: "absolute", left: 10, top: 10, width: 840, height: 900, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 10.8, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 56, display: "flex", justifyContent: "center" }}>
          <div style={{ ...pop(t, 10.95), ...chip(C.banana, C.forest, 36) }}>JUST REMEMBER</div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 170, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          {MW.map((m, i) => {
            const p = ramp(t, m.t - 0.06, m.t + 0.18);
            return (
              <div key={i} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 104, letterSpacing: -3, lineHeight: 1.08, display: "flex", opacity: p, transform: `translateX(${(1 - p) * -80}px) scale(${1 + 0.08 * Math.sin(p * Math.PI)})` }}>
                <span style={{ background: BR[i].color, color: C.forest, borderRadius: 20, padding: "0 16px 6px", minWidth: 60, textAlign: "center" }}>{m.w[0]}</span>
                <span style={{ color: C.paper, marginLeft: 4 }}>{m.w.slice(1)}</span>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 790, display: "flex", justifyContent: "center", opacity: ramp(t, 13.15, 13.35) }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.matchaLight, letterSpacing: 2 }}>5 words · 5 branches · top → bottom</div>
        </div>
      </div>
    </Scene>
  );
};

/* letter tiles strip used in V4 / V5 */
const Tiles: React.FC<{ t: number; at: number[]; hot: number; names?: boolean; sub?: (i: number) => string; subAt?: number[] }> = ({ t, at, hot, names = true, sub, subAt }) => (
  <>
    {BR.map((b, i) => {
      const p = ramp(t, at[i] - 0.05, at[i] + 0.25);
      const isHot = hot === i;
      const sp = subAt ? ramp(t, subAt[i] - 0.05, subAt[i] + 0.25) : 1;
      return (
        <div key={b.id} style={{ position: "absolute", left: 14 + i * 155, top: 16, width: 150, height: 170, display: "flex", flexDirection: "column", alignItems: "center", opacity: p * (isHot || hot < 0 ? 1 : 0.6), transform: `translateY(${(1 - p) * 30}px) scale(${isHot ? 1.06 : 1})` }}>
          <div style={{ width: 76, height: 76, borderRadius: 38, background: isHot ? C.banana : b.color, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 46, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: isHot ? `0 0 0 5px ${C.paper}` : "none" }}>{b.letter}</div>
          {names && (
            <div style={{ marginTop: 10, fontFamily: FONT, fontWeight: 800, fontSize: b.id === "man" ? 23 : 27, color: C.paper, lineHeight: 1.05, textAlign: "center" }}>
              {b.id === "man" ? (<>Marginal<br />mandibular</>) : b.name}
            </div>
          )}
          {sub && <div style={{ marginTop: 6, fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.matchaLight, opacity: sp }}>{sub(i)}</div>}
        </div>
      );
    })}
  </>
);

/* 4. The five names, top to bottom */
const NAME_T = [13.86, 14.27, 14.92, 15.66, 16.8];
export const V4: React.FC = () => {
  const t = useT();
  let hot = -1;
  NAME_T.forEach((x, i) => { if (t >= x) hot = i; });
  if (t >= 17.6) hot = -1;
  const ids: BId[] = ["tem", "zyg", "buc", "man", "cer"];
  const colorAt: Partial<Record<BId, number>> = {};
  const lit: Partial<Record<FPart, number>> = {};
  const labels: Partial<Record<FPart, number>> = {};
  ids.forEach((id, i) => { colorAt[id] = NAME_T[i]; lit[id] = NAME_T[i]; labels[id] = NAME_T[i] + 0.05; });
  return (
    <Scene start={13.65} end={19.8} push={0.01}>
      <Stage t={t} start={13.65} steps={[
        { t: 13.65, zoom: [1.0, 0.5, 0.5], focus: [] },
        { t: 13.8, zoom: [1.12, 0.55, 0.5], focus: ["tem"] },
        { t: 14.22, zoom: [1.12, 0.55, 0.5], focus: ["zyg"] },
        { t: 14.87, zoom: [1.12, 0.55, 0.52], focus: ["buc"] },
        { t: 15.6, zoom: [1.12, 0.55, 0.56], focus: ["man"] },
        { t: 16.75, zoom: [1.12, 0.52, 0.6], focus: ["cer"] },
        { t: 17.6, zoom: [1.0, 0.5, 0.5], focus: [] },
      ]} props={{ all: true, dimFrom: 13.7, colorAt, lit }} lab={{ labels }} />
      <DarkCard t={t} t0={13.7}>
        <Tiles t={t} at={NAME_T} hot={hot} />
      </DarkCard>
      <Stamp t0={17.78} text="TOP → BOTTOM" size={44} rot={-6} color={C.matcha} style={{ left: 40, top: 40 }} />
      {t >= 18.7 && (
        <div style={{ position: "absolute", right: 30, top: 56, ...pop(t, 18.76) }}>
          <div style={{ ...chip(C.banana, C.forest, 34), border: `4px solid ${C.forest}` }}>they follow your face</div>
        </div>
      )}
    </Scene>
  );
};

/* 5. Where each one goes */
const REG_T: { name: number; reg: number; zoom: [number, number, number] }[] = [
  { name: 19.97, reg: 20.47, zoom: [1.4, 0.62, 0.22] },
  { name: 21.26, reg: 22.13, zoom: [1.5, 0.7, 0.38] },
  { name: 22.63, reg: 23.15, zoom: [1.45, 0.66, 0.58] },
  { name: 23.85, reg: 25.42, zoom: [1.35, 0.64, 0.74] },
  { name: 26.18, reg: 27.27, zoom: [1.2, 0.5, 0.92] },
];
export const V5: React.FC = () => {
  const t = useT();
  let ci = 0;
  REG_T.forEach((r, i) => { if (t >= r.name - 0.1) ci = i; });
  const ids: BId[] = ["tem", "zyg", "buc", "man", "cer"];
  const colorAt: Partial<Record<BId, number>> = { tem: 0, zyg: 0, buc: 0, man: 0, cer: 0 };
  const lit: Partial<Record<FPart, number>> = {};
  const labels: Partial<Record<FPart, number>> = {};
  const labelEnd: Partial<Record<FPart, number>> = {};
  const regions: Partial<Record<FPart, number>> = {};
  const regionEnd: Partial<Record<FPart, number>> = {};
  ids.forEach((id, i) => {
    const r = REG_T[i];
    const nx = REG_T[i + 1];
    lit[id] = r.name; lit[BR[i].rid] = r.reg;
    labels[id] = r.name + 0.05; regions[BR[i].rid] = r.reg + 0.05;
    if (nx) { labelEnd[id] = nx.name - 0.15; regionEnd[BR[i].rid] = nx.name - 0.15; }
  });
  const b = BR[ci];
  const r = REG_T[ci];
  const sw = ramp(t, r.name - 0.1, r.name + 0.15);
  return (
    <Scene start={19.8} end={27.95} push={0.01}>
      <Stage t={t} start={19.8} steps={[{ t: 19.8, zoom: [1.0, 0.5, 0.5], focus: [] }, ...REG_T.map((x, i) => ({ t: x.name - 0.1, zoom: x.zoom, focus: [ids[i], BR[i].rid] as FPart[] }))]}
        props={{ all: true, dimFrom: 19.85, colorAt, lit }} lab={{ labels, labelEnd }} />
      <DarkCard t={t} t0={19.85}>
        <div style={{ position: "absolute", left: 0, width: 800, top: 34, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, opacity: sw, transform: `translateY(${(1 - sw) * 20}px)` }}>
          <div style={{ width: 72, height: 72, borderRadius: 36, background: b.color, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>{b.letter}</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: b.id === "man" ? 44 : 54, color: C.paper, whiteSpace: "nowrap" }}>{b.name}</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 50, color: C.matchaLight, opacity: ramp(t, r.reg - 0.3, r.reg) }}>→</div>
          <div style={{ ...chip(C.banana, C.forest, 46), opacity: ramp(t, r.reg - 0.05, r.reg + 0.15), transform: `scale(${0.7 + 0.3 * ramp(t, r.reg - 0.05, r.reg + 0.2)})` }}>{b.region}</div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 140, display: "flex", justifyContent: "center", gap: 14 }}>
          {BR.map((x, i) => (
            <div key={x.id} style={{ width: i === ci ? 56 : 22, height: 22, borderRadius: 11, background: i < ci ? x.color : i === ci ? C.banana : C.matchaDark }} />
          ))}
        </div>
      </DarkCard>
    </Scene>
  );
};

/* 6. Gray's 1918 plate with modern labels */
const PX = 80, PW = 700, PH = PW / ASPECT_F, PA = 27.95, PBB = 31.05;
const PZ0: [number, number, number] = [1.0, 0.5, 0.5], PZ1: [number, number, number] = [1.1, 0.55, 0.55];
const plateMap = (t: number, fx: number, fy: number): [number, number] => {
  const k = ramp(t, PA, PBB);
  const sc = PZ0[0] + (PZ1[0] - PZ0[0]) * k, cx = PZ0[1] + (PZ1[1] - PZ0[1]) * k, cy = PZ0[2] + (PZ1[2] - PZ0[2]) * k;
  const cl = (v: number, m: number) => Math.max(-m, Math.min(m, v));
  const tx = cl(-(cx - 0.5) * PW * sc, (sc - 1) * PW / 2), ty = cl(-(cy - 0.5) * PH * sc, (sc - 1) * PH / 2);
  return [PX + PW / 2 + (fx * PW - PW / 2) * sc + tx, PH / 2 + (fy * PH - PH / 2) * sc + ty];
};
export const PL: { id: BId; text: string; t: number; px: number; py: number }[] = [
  { id: "tem", text: "Temporal", t: 28.3, px: 250, py: 110 },
  { id: "zyg", text: "Zygomatic", t: 28.6, px: 660, py: 150 },
  { id: "buc", text: "Buccal", t: 28.9, px: 715, py: 390 },
  { id: "man", text: "Marginal mandibular", t: 29.2, px: 590, py: 640 },
  { id: "cer", text: "Cervical", t: 29.5, px: 180, py: 560 },
];
export const V6: React.FC = () => {
  const t = useT();
  return (
    <Scene start={27.95} end={31.05} push={0.01}>
      <Plate src="plates/face.png" aspect={ASPECT_F} x={PX} y={0} w={PW} a={PA} b={PBB} zoomFrom={PZ0} zoomTo={PZ1} credit="Gray's Anatomy, 1918 · public domain" />
      <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: 1 - ramp(t, PBB - 0.1, PBB + 0.35) }}>
        {PL.map((l, i) => {
          const p = ramp(t, l.t - 0.1, l.t + 0.25);
          if (p <= 0) return null;
          const [ax, ay] = plateMap(t, PB[l.id][0], PB[l.id][1]);
          const ww = l.text.length * 17.5 + 70;
          const b = BR.find((x) => x.id === l.id)!;
          return (
            <g key={i} opacity={Math.min(1, p * 1.5)}>
              <line x1={ax} y1={ay} x2={ax + (l.px - ax) * p} y2={ay + (l.py - ay) * p} stroke={C.forest} strokeWidth={5} strokeLinecap="round" />
              <circle cx={ax} cy={ay} r={12} fill={C.banana} stroke={C.forest} strokeWidth={4.5} />
              <g transform={`translate(${l.px} ${l.py}) scale(${0.8 + 0.2 * p})`}>
                <rect x={-ww / 2} y={-30} width={ww} height={60} rx={18} fill={C.forest} />
                <circle cx={-ww / 2 + 28} cy={0} r={13} fill={b.color} stroke={C.paper} strokeWidth={3} />
                <text x={-ww / 2 + 28} y={8} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={19} fill={C.forest}>{b.letter}</text>
                <text x={16} y={11} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={31} fill={C.paper}>{l.text}</text>
              </g>
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: 0, top: PH + 22, width: 860, display: "flex", justifyContent: "center", ...pop(t, 29.95) }}>
        <div style={{ ...chip(C.banana, C.forest, 28) }}>1918 atlas name: “Mandibular”</div>
      </div>
      <div style={{ position: "absolute", left: 0, top: PH + 96, width: 860, display: "flex", justifyContent: "center", ...pop(t, 30.25) }}>
        <div style={{ ...chip(C.forest, C.paper, 26) }}>today: marginal mandibular branch</div>
      </div>
    </Scene>
  );
};

/* 7. Quick test */
export const C0 = 34.1;
export const V7: React.FC = () => {
  const t = useT();
  const n = t < C0 ? null : t < C0 + 0.5 ? 3 : t < C0 + 1.0 ? 2 : t < C0 + 1.5 ? 1 : null;
  const k = Math.floor((t - C0) / 0.5) * 0.5 + C0;
  return (
    <Scene start={31.05} end={35.55}>
      <div style={{ position: "absolute", left: 10, top: 30, width: 840, height: 860, borderRadius: 48, background: C.forest, ...pop(t, 31.1, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 52, display: "flex", justifyContent: "center" }}>
          <div style={{ background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, padding: "8px 28px 11px 36px", borderRadius: 18 }}>QUICK TEST</div>
        </div>
        <div style={{ position: "absolute", left: 40, width: 760, top: 160, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 64, lineHeight: 1.16, color: C.paper, ...pop(t, 31.96) }}>
          Which branch reaches the <span style={{ background: C.banana, color: C.forest, borderRadius: 16, padding: "0 14px 4px", display: "inline-block" }}>platysma?</span>
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 420, display: "flex", justifyContent: "center", gap: 16 }}>
          {BR.map((x, i) => (
            <div key={x.id} style={{ ...pop(t, 33.1 + i * 0.1), width: 134, height: 134, borderRadius: 30, background: C.matchaDark, border: `4px solid ${x.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 64, color: C.paper }}>{x.letter}</div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 580, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.matchaLight, ...pop(t, 33.73) }}>the thin muscle sheet in your neck</div>
        {n && (
          <div style={{ position: "absolute", left: 0, width: 840, top: 660, display: "flex", justifyContent: "center", transform: `scale(${1.3 - 0.3 * ramp(t, k, k + 0.15)})` }}>
            <div style={{ width: 150, height: 150, borderRadius: 75, background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 104, lineHeight: "150px", textAlign: "center" }}>{n}</div>
          </div>
        )}
      </div>
    </Scene>
  );
};

/* 8. Answer: cervical */
export const V8: React.FC = () => {
  const t = useT();
  return (
    <Scene start={35.55} end={37.85} push={0.01}>
      <Stage t={t} start={35.55} steps={[{ t: 35.55, zoom: [1.45, 0.45, 0.95], focus: ["cer", "rNeck"] }]}
        props={{ all: true, dimFrom: 35.57, colorAt: { tem: 0, zyg: 0, buc: 0, man: 0, cer: 0 }, lit: { cer: 35.72, rNeck: 35.9 } }} lab={{ labels: { cer: 35.75 } }} />
      <DarkCard t={t} t0={35.6}>
        <div style={{ position: "absolute", left: 0, width: 800, top: 22, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 66, color: C.paper, letterSpacing: -1, ...pop(t, 35.72) }}>Cervical ✓</div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 118, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.matchaLight, ...pop(t, 36.78) }}>
          <span style={{ background: BR[4].color, color: C.forest, borderRadius: 12, padding: "0 12px 3px" }}>C</span> for <span style={{ color: C.paper }}>Car</span> → platysma
        </div>
      </DarkCard>
    </Scene>
  );
};

/* 9. Save */
export const V9: React.FC = () => {
  const t = useT();
  const b = ramp(t, 37.95, 38.3);
  return (
    <Scene start={37.85} end={40.05}>
      <div style={center(40, pop(t, 37.9))}>
        <svg width={220} height={280} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={center(360, pop(t, 37.97))}>
        <Big size={120}>SAVE THIS</Big>
      </div>
      <div style={center(510, pop(t, 38.97))}>
        <Big size={58} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ ...center(640), gap: 14, alignItems: "center" }}>
        {BR.map((x, i) => (
          <div key={x.id} style={{ ...pop(t, 39.2 + i * 0.08), width: 148, height: 148, borderRadius: 26, background: x.color, color: C.forest, fontFamily: FONT, fontWeight: 800, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 64, lineHeight: 1 }}>{x.letter}</div>
            <div style={{ fontSize: 20, marginTop: 4 }}>{x.word}</div>
          </div>
        ))}
      </div>
    </Scene>
  );
};

/* 10. End card */
export const END_T = 45.0;
export const V10: React.FC = () => {
  const t = useT();
  return (
    <Scene start={40.05} end={END_T}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, 40.1, 0.35) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.matchaLight, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 41.2, 41.5) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 40.3) * 5))})`, opacity: ramp(t, 40.3, 40.6) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
