import React from "react";
import { C, FONT, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { LAYERS, MLabels, MPart, Meninges, COL } from "./Mening47";

export const ASPECT_S = 2051 / 1421;
export const ASPECT_C = 2153 / 807;
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

/* Gray 1918 Fig. 769 crop (section across the top of the skull) — points ON each structure, fractions of the crop */
export const PS: Record<"dura" | "arach" | "pia" | "sas" | "subd", [number, number]> = {
  dura: [0.893, 0.314],
  arach: [0.832, 0.342],
  pia: [0.611, 0.763],
  sas: [0.632, 0.55],
  subd: [0.238, 0.356],
};
/* Gray 1918 Fig. 770 crop (spinal cord + its membranes) */
export const PC: Record<"cord" | "pia" | "arach" | "dura", [number, number]> = { cord: [0.48, 0.52], pia: [0.314, 0.571], arach: [0.229, 0.838], dura: [0.257, 0.895] };

/* 1. Hook: Gray's 1918 skull section, push in on the layers */
export const V1: React.FC = () => {
  const t = useT();
  const W = 820, X = 20, Y = 330;
  return (
    <Scene start={-0.6} end={2.33} push={0.02}>
      <div style={{ position: "absolute", left: 0, top: 30, width: 860, textAlign: "center", ...pop(t, 0.02, 0.25) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.matcha, letterSpacing: 5 }}>CAN YOU NAME</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 84, color: C.forest, letterSpacing: -2, lineHeight: 1.12, marginTop: 8, whiteSpace: "nowrap" }}>
          the <span style={{ background: t >= 0.51 ? C.banana : "transparent", borderRadius: 20, padding: "0 16px 6px" }}>3 layers</span>
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 84, color: C.forest, letterSpacing: -2, lineHeight: 1.12, whiteSpace: "nowrap", opacity: ramp(t, 1.2, 1.45) }}>around your brain?</div>
      </div>
      <Plate src="plates/skull.png" aspect={ASPECT_S} x={X} y={Y} w={W} a={-0.6} b={2.33} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.6, 0.78, 0.4]}
        labels={(["dura", "arach", "pia"] as const).map((id, i) => ({ x: PS[id][0], y: PS[id][1], text: "?", t: 0.9 + i * 0.25, hot: true, ox: [-80, -90, -80][i], oy: [-60, 40, 0][i] }))}
        credit="Gray's Anatomy, 1918 · public domain" />
    </Scene>
  );
};

/* Diagram stage with camera moves */
type Step = { t: number; zoom: [number, number, number]; focus: MPart[] };
const SH = 600;
const Stage: React.FC<{
  t: number; start: number; steps: Step[]; props: Partial<React.ComponentProps<typeof Meninges>>;
  lab?: { labels: Partial<Record<MPart, number>>; labelEnd?: Partial<Record<MPart, number>>; pos?: Partial<Record<MPart, [number, number]>> };
  top?: number; note?: string;
}> = ({ t, start, steps, props, lab, top = 10, note = "Book Plume diagram" }) => {
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
    <div style={{ position: "absolute", left: 0, top, width: 860, height: SH, overflow: "hidden", borderRadius: 36, background: C.card, border: `3px solid ${C.line}`, ...pop(t, start, 0.35) }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 860, height: SH, transform: `scale(${s})`, transformOrigin: `${zx * 100}% ${zy * 100}%` }}>
        <Meninges t={t} focus={cur.focus} {...props} />
      </div>
      {lab && <MLabels t={t} hot={cur.focus} labels={lab.labels} labelEnd={lab.labelEnd} pos={lab.pos} map={(x, y) => [zx * 860 + (x - zx * 860) * s, zy * SH + (y - zy * SH) * s]} />}
      <div style={{ position: "absolute", left: 14, bottom: 10, fontFamily: FONT, fontWeight: 700, fontSize: 18, color: C.forest, background: "rgba(255,254,246,0.9)", padding: "2px 10px", borderRadius: 8, opacity: 0.7 }}>{note}</div>
    </div>
  );
};

const DarkCard: React.FC<{ t: number; t0: number; children: React.ReactNode; top?: number; h?: number }> = ({ t, t0, children, top = 640, h = 270 }) => (
  <div style={{ position: "absolute", left: 30, width: 800, top, height: h, borderRadius: 36, background: C.forest, boxShadow: "0 14px 30px rgba(31,42,20,0.25)", ...pop(t, t0, 0.3) }}>{children}</div>
);
const row = (top: number): React.CSSProperties => ({ position: "absolute", left: 0, width: 800, top, display: "flex", justifyContent: "center", alignItems: "center", gap: 16 });

/* 2. The diagram builds layer by layer: "the meninges" */
export const V2: React.FC = () => {
  const t = useT();
  return (
    <Scene start={2.33} end={5.97} push={0.01}>
      <Stage t={t} start={2.33} steps={[{ t: 2.33, zoom: [1.0, 0.5, 0.5], focus: [] }, { t: 4.3, zoom: [1.12, 0.5, 0.42], focus: [] }]}
        props={{ show: { skull: 2.45, dura: 2.75, arach: 3.0, pia: 3.25 } }} />
      <DarkCard t={t} t0={2.45}>
        <div style={row(34)}>
          <div style={{ ...pop(t, 2.5), fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.paper }}>3 wraps =</div>
          <div style={{ ...pop(t, 2.77), ...chip(C.banana, C.forest, 52) }}>the meninges</div>
        </div>
        <div style={row(140)}>
          {LAYERS.map((x, i) => (
            <div key={x.id} style={{ ...pop(t, 3.1 + i * 0.12), width: 64, height: 64, borderRadius: 32, background: x.color, border: `5px solid ${C.paper}` }} />
          ))}
          <div style={{ ...pop(t, 4.01), marginLeft: 18, ...chip(C.matcha, C.paper, 40) }}>+ 1 tiny word</div>
        </div>
      </DarkCard>
    </Scene>
  );
};

/* 3. Mnemonic card: the meninges PAD your brain */
export const V3: React.FC = () => {
  const t = useT();
  const at = [6.56, 6.66, 6.76];
  return (
    <Scene start={5.97} end={7.79}>
      <div style={{ position: "absolute", left: 10, top: 10, width: 840, height: 900, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 5.97, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 60, display: "flex", justifyContent: "center" }}>
          <div style={{ ...pop(t, 6.02), ...chip(C.paper, C.forest, 38) }}>the meninges</div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 210, display: "flex", justifyContent: "center", gap: 22 }}>
          {LAYERS.map((m, i) => {
            const p = ramp(t, at[i] - 0.06, at[i] + 0.16);
            return (
              <div key={m.id} style={{ width: 210, height: 250, borderRadius: 36, background: m.color, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 200, lineHeight: "250px", textAlign: "center", opacity: p, transform: `translateY(${(1 - p) * 60}px) scale(${1 + 0.1 * Math.sin(p * Math.PI)})`, boxShadow: `0 10px 0 rgba(0,0,0,0.25)` }}>{m.letter}</div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 520, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 76, color: C.paper, ...pop(t, 6.81) }}>
          your <span style={{ color: C.banana }}>brain</span>
        </div>
        {/* a soft cushion under a brain icon */}
        <svg width={840} height={200} style={{ position: "absolute", left: 0, top: 650, opacity: ramp(t, 6.95, 7.25) }}>
          <ellipse cx={420} cy={150} rx={260} ry={34} fill={C.matchaDark} />
          <path d="M 330 120 C 300 60 360 20 410 40 C 440 10 500 20 510 60 C 560 60 560 120 520 130 Z" fill="#E9CFC6" stroke={C.paper} strokeWidth={6} transform={`translate(0 ${-6 * Math.sin(t * 5)})`} />
          <path d="M 380 70 C 400 60 420 80 440 66 M 420 100 C 445 88 470 104 490 92" fill="none" stroke="#B98C80" strokeWidth={5} strokeLinecap="round" transform={`translate(0 ${-6 * Math.sin(t * 5)})`} />
        </svg>
      </div>
    </Scene>
  );
};

/* tiles strip used in V4 / V9 / V11 */
const Tiles: React.FC<{ t: number; at: number[]; hot: number; ask?: number; top?: number; sub?: boolean }> = ({ t, at, hot, ask = -1, top = 22, sub = true }) => (
  <>
    {LAYERS.map((b, i) => {
      const p = ramp(t, at[i] - 0.05, at[i] + 0.25);
      const isHot = hot === i;
      const isAsk = ask === i;
      return (
        <div key={b.id} style={{ position: "absolute", left: 16 + i * 258, top, width: 250, height: 226, display: "flex", flexDirection: "column", alignItems: "center", opacity: p * (isHot || hot < 0 ? 1 : 0.5), transform: `translateY(${(1 - p) * 30}px) scale(${isHot ? 1.06 : 1})` }}>
          <div style={{ width: 92, height: 92, borderRadius: 46, background: isAsk ? C.matchaDark : b.color, color: isAsk ? C.banana : C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 58, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: isHot ? `0 0 0 6px ${C.banana}` : isAsk ? `0 0 0 4px ${C.banana}` : "none" }}>{isAsk ? "?" : b.letter}</div>
          <div style={{ marginTop: 10, fontFamily: FONT, fontWeight: 800, fontSize: 36, color: isHot ? C.banana : C.paper }}>{isAsk ? "?" : b.word}</div>
          {sub && <div style={{ marginTop: 4, fontFamily: FONT, fontWeight: 700, fontSize: 24, color: C.matchaLight, textAlign: "center", opacity: isAsk ? 0 : 1 }}>{b.sub}</div>}
        </div>
      );
    })}
  </>
);

/* 4. P, A, D on the diagram, brain outward */
const NAME_T = [9.35, 12.58, 15.78];
export const V4: React.FC = () => {
  const t = useT();
  let hot = -1;
  NAME_T.forEach((x, i) => { if (t >= x - 0.1) hot = i; });
  return (
    <Scene start={7.79} end={18.34} push={0.01}>
      <Stage t={t} start={7.79} steps={[
        { t: 7.79, zoom: [1.0, 0.5, 0.5], focus: [] },
        { t: 9.2, zoom: [1.4, 0.3, 0.6], focus: ["pia"] },
        { t: 10.85, zoom: [1.25, 0.45, 0.75], focus: ["pia"] },
        { t: 12.45, zoom: [1.4, 0.62, 0.42], focus: ["arach"] },
        { t: 14.2, zoom: [1.55, 0.5, 0.5], focus: ["arach"] },
        { t: 15.65, zoom: [1.4, 0.3, 0.3], focus: ["dura"] },
        { t: 17.85, zoom: [1.2, 0.6, 0.2], focus: ["dura", "skull"] },
      ]} props={{ dimFrom: 7.9, lit: { pia: 9.35, arach: 12.58, dura: 15.78, skull: 17.95 } }}
        lab={{ labels: { pia: 9.4, arach: 12.62, dura: 15.82, skull: 17.98 }, labelEnd: { pia: 12.3, arach: 15.5 }, pos: { pia: [470, 552], arach: [600, 520], dura: [230, 470], skull: [640, 470] } }} />
      <DarkCard t={t} t0={7.85}>
        <Tiles t={t} at={NAME_T.map((x) => x - 0.3)} hot={hot} />
      </DarkCard>
      {t < 10.85 && <div style={{ opacity: 1 - ramp(t, 10.6, 10.85) }}><Stamp t0={8.3} text="BRAIN → OUT" size={38} rot={-5} color={C.matcha} style={{ left: 40, top: 40 }} /></div>}
      {t >= 10.9 && t < 12.3 && (
        <div style={{ position: "absolute", left: 470, top: 40, ...pop(t, 10.92) }}><div style={chip(C.banana, C.forest, 34)}>dips into every fold</div></div>
      )}
      {t >= 14.2 && t < 15.5 && (
        <div style={{ position: "absolute", left: 40, top: 40, ...pop(t, 14.27) }}><div style={chip(C.banana, C.forest, 34)}>web-like strands ↓</div></div>
      )}
    </Scene>
  );
};

/* 5. Bonus: dura = "hard" in Latin */
export const V5: React.FC = () => {
  const t = useT();
  return (
    <Scene start={18.34} end={21.0}>
      <div style={{ position: "absolute", left: 10, top: 20, width: 840, height: 880, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 18.34, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 56, display: "flex", justifyContent: "center" }}>
          <div style={{ ...pop(t, 18.77), background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, padding: "8px 28px 11px 36px", borderRadius: 18 }}>BONUS</div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 190, textAlign: "center", ...pop(t, 19.26) }}>
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 170, color: COL.dura, letterSpacing: -4 }}>dura</span>
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 420, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 96, color: C.paper, ...pop(t, 19.72) }}>
          = “hard”
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 565, display: "flex", justifyContent: "center", ...pop(t, 20.16) }}>
          <div style={chip(C.matcha, C.paper, 40)}>in Latin</div>
        </div>
        {/* tough fibrous band */}
        <svg width={840} height={120} style={{ position: "absolute", left: 0, top: 690, opacity: ramp(t, 19.4, 19.8) }}>
          <defs>
            <pattern id="fibB" width={14} height={14} patternUnits="userSpaceOnUse" patternTransform="rotate(-8)">
              <line x1={0} y1={7} x2={14} y2={7} stroke="#FFFFFF" strokeWidth={2.5} opacity={0.45} />
            </pattern>
          </defs>
          <rect x={90} y={30} width={660 * ramp(t, 19.4, 20.2)} height={56} rx={28} fill={COL.dura} />
          <rect x={90} y={30} width={660 * ramp(t, 19.4, 20.2)} height={56} rx={28} fill="url(#fibB)" />
        </svg>
      </div>
    </Scene>
  );
};

/* 6. Subarachnoid space + CSF */
export const V6: React.FC = () => {
  const t = useT();
  return (
    <Scene start={21.0} end={25.64} push={0.01}>
      <Stage t={t} start={21.0} steps={[
        { t: 21.0, zoom: [1.15, 0.55, 0.45], focus: ["arach"] },
        { t: 22.0, zoom: [1.35, 0.55, 0.62], focus: ["sas"] },
        { t: 23.9, zoom: [1.2, 0.5, 0.6], focus: ["sas"] },
      ]} props={{ dimFrom: 21.1, lit: { arach: 21.31, sas: 22.11 }, csf: 24.05 }}
        lab={{ labels: { arach: 21.35, sas: 22.15 }, labelEnd: { arach: 22.0 }, pos: { arach: [560, 120], sas: [430, 530] } }} />
      <DarkCard t={t} t0={21.05}>
        <div style={row(30)}>
          <div style={{ ...pop(t, 21.05), fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.paper }}>under the arachnoid:</div>
        </div>
        <div style={row(100)}>
          <div style={{ ...pop(t, 22.11), ...chip(COL.sas, C.forest, 48) }}>subarachnoid space</div>
        </div>
        <div style={row(190)}>
          <div style={{ ...pop(t, 23.59), fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.matchaLight }}>filled with</div>
          <div style={{ ...pop(t, 24.05), ...chip(C.banana, C.forest, 36) }}>CSF · cerebrospinal fluid</div>
        </div>
      </DarkCard>
    </Scene>
  );
};

/* plate -> screen mapping identical to <Plate> (labels are drawn outside the plate so they are never clipped) */
const mkMap = (X: number, Y: number, W: number, H: number, a: number, b: number, z0: [number, number, number], z1: [number, number, number]) => (t: number, fx: number, fy: number): [number, number] => {
  const k = ramp(t, a, b);
  const sc = z0[0] + (z1[0] - z0[0]) * k, cx = z0[1] + (z1[1] - z0[1]) * k, cy = z0[2] + (z1[2] - z0[2]) * k;
  const cl = (v: number, m: number) => Math.max(-m, Math.min(m, v));
  const tx = cl(-(cx - 0.5) * W * sc, (sc - 1) * W / 2), ty = cl(-(cy - 0.5) * H * sc, (sc - 1) * H / 2);
  return [X + W / 2 + (fx * W - W / 2) * sc + tx, Y + H / 2 + (fy * H - H / 2) * sc + ty];
};
type OL = { f: [number, number]; text: string; t: number; px: number; py: number; color?: string; hot?: boolean };
const Overlay: React.FC<{ t: number; map: (t: number, fx: number, fy: number) => [number, number]; items: OL[]; fade: number }> = ({ t, map, items, fade }) => (
  <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: 1 - ramp(t, fade - 0.1, fade + 0.3) }}>
    {items.map((l, i) => {
      const p = ramp(t, l.t - 0.1, l.t + 0.25);
      if (p <= 0) return null;
      const [ax, ay] = map(t, l.f[0], l.f[1]);
      const ww = l.text.length * 17.4 + (l.color ? 74 : 44);
      return (
        <g key={i} opacity={Math.min(1, p * 1.5)}>
          <line x1={ax} y1={ay} x2={ax + (l.px - ax) * p} y2={ay + (l.py - ay) * p} stroke={C.forest} strokeWidth={5} strokeLinecap="round" />
          <circle cx={ax} cy={ay} r={12} fill={l.hot ? C.red : C.banana} stroke={C.forest} strokeWidth={4.5} />
          <g transform={`translate(${l.px} ${l.py}) scale(${0.8 + 0.2 * p})`}>
            <rect x={-ww / 2} y={-30} width={ww} height={60} rx={18} fill={l.hot ? C.banana : C.forest} stroke={C.forest} strokeWidth={3} />
            {l.color && <circle cx={-ww / 2 + 28} cy={0} r={13} fill={l.color} stroke={l.hot ? C.forest : C.paper} strokeWidth={3} />}
            <text x={l.color ? 14 : 0} y={11} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={31} fill={l.hot ? C.forest : C.paper}>{l.text}</text>
          </g>
        </g>
      );
    })}
  </svg>
);

/* 7. Gray's 1918 Fig. 769 with modern labels + old-name note */
const SX = 20, SY = 180, SW = 820, SHH = SW / ASPECT_S, SA = 25.64, SB = 28.3;
const SZ0: [number, number, number] = [1.0, 0.5, 0.5], SZ1: [number, number, number] = [1.1, 0.62, 0.5];
const smap = mkMap(SX, SY, SW, SHH, SA, SB, SZ0, SZ1);
export const V7: React.FC = () => {
  const t = useT();
  return (
    <Scene start={SA} end={SB} push={0.01}>
      <Plate src="plates/skull.png" aspect={ASPECT_S} x={SX} y={SY} w={SW} a={SA} b={SB} zoomFrom={SZ0} zoomTo={SZ1} credit="Gray's Anatomy, 1918 · public domain" />
      <Overlay t={t} map={smap} fade={SB} items={[
        { f: PS.dura, text: "Dura mater", t: 25.95, px: 700, py: 50, color: COL.dura },
        { f: PS.arach, text: "Arachnoid mater", t: 26.3, px: 500, py: 125, color: COL.arach },
        { f: PS.sas, text: "Subarachnoid space", t: 26.7, px: 250, py: 50, color: COL.sas },
        { f: PS.pia, text: "Pia mater", t: 27.1, px: 230, py: SY + SHH + 50, color: COL.pia },
      ]} />
      <div style={{ position: "absolute", left: 0, top: SY + SHH + 100, width: 860, display: "flex", justifyContent: "center", ...pop(t, 27.3) }}>
        <div style={{ ...chip(C.banana, C.forest, 28) }}>1918 atlas name: “Subarachnoid cavity”</div>
      </div>
      <div style={{ position: "absolute", left: 0, top: SY + SHH + 160, width: 860, display: "flex", justifyContent: "center", ...pop(t, 27.55) }}>
        <div style={{ ...chip(C.forest, C.paper, 26) }}>today: subarachnoid space</div>
      </div>
    </Scene>
  );
};

/* 8. Gray's 1918 Fig. 770: the same 3 layers around the spinal cord */
const CX = 20, CY = 230, CW = 820, CH = CW / ASPECT_C, CA = 28.3, CB = 31.59;
const CZ0: [number, number, number] = [1.0, 0.5, 0.5], CZ1: [number, number, number] = [1.12, 0.4, 0.6];
const cmap = mkMap(CX, CY, CW, CH, CA, CB, CZ0, CZ1);
export const V8: React.FC = () => {
  const t = useT();
  return (
    <Scene start={CA} end={CB} push={0.01}>
      <div style={{ position: "absolute", left: 0, top: 40, width: 860, textAlign: "center", ...pop(t, 28.4) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.matcha, letterSpacing: 4 }}>THE SAME 3 LAYERS</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 70, color: C.forest, letterSpacing: -1, marginTop: 6, opacity: ramp(t, 29.7, 29.95) }}>
          wrap the <span style={{ background: C.banana, borderRadius: 16, padding: "0 12px 4px" }}>spinal cord</span>
        </div>
      </div>
      <Plate src="plates/cord.png" aspect={ASPECT_C} x={CX} y={CY} w={CW} a={CA} b={CB} zoomFrom={CZ0} zoomTo={CZ1} credit="Gray 1918 · PD" />
      <Overlay t={t} map={cmap} fade={CB} items={[
        { f: PC.cord, text: "Spinal cord", t: 29.84, px: 600, py: CY + CH + 70, hot: true },
      ]} />
      <div style={{ position: "absolute", left: 30, width: 800, top: 700, height: 210, borderRadius: 36, background: C.forest, ...pop(t, 28.7) }}>
        <div style={{ position: "absolute", left: 0, width: 800, top: 34, display: "flex", justifyContent: "center", gap: 18 }}>
          {LAYERS.map((x, i) => (
            <div key={x.id} style={{ ...pop(t, 29.0 + i * 0.2), display: "flex", alignItems: "center", gap: 10, background: C.matchaDark, borderRadius: 22, padding: "12px 18px" }}>
              <div style={{ width: 50, height: 50, borderRadius: 25, background: x.color, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>{x.letter}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.paper }}>{x.word}</div>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 128, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 28, color: C.matchaLight, opacity: ramp(t, 30.3, 30.6) }}>
          brain + spinal cord: same order, P → A → D
        </div>
      </div>
    </Scene>
  );
};

/* 9. Quick test */
export const C0 = 34.25;
export const V9: React.FC = () => {
  const t = useT();
  const n = t < C0 ? null : t < C0 + 0.5 ? 3 : t < C0 + 1.0 ? 2 : t < C0 + 1.5 ? 1 : null;
  const k = Math.floor((t - C0) / 0.5) * 0.5 + C0;
  return (
    <Scene start={31.59} end={35.78}>
      <div style={{ position: "absolute", left: 10, top: 20, width: 840, height: 880, borderRadius: 48, background: C.forest, ...pop(t, 31.6, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 50, display: "flex", justifyContent: "center" }}>
          <div style={{ background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, padding: "8px 28px 11px 36px", borderRadius: 18 }}>QUICK TEST</div>
        </div>
        <div style={{ position: "absolute", left: 40, width: 760, top: 160, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 64, lineHeight: 1.18, color: C.paper, ...pop(t, 32.36) }}>
          Which layer <span style={{ background: C.banana, color: C.forest, borderRadius: 16, padding: "0 14px 4px", display: "inline-block" }}>touches</span> the brain itself?
        </div>
        <div style={{ position: "absolute", left: 20, top: 400, width: 800, height: 230 }}>
          <Tiles t={t} at={[32.9, 33.05, 33.2]} hot={-1} ask={0} top={0} sub={false} />
        </div>
        {n && (
          <div style={{ position: "absolute", left: 0, width: 840, top: 650, display: "flex", justifyContent: "center", transform: `scale(${1.3 - 0.3 * ramp(t, k, k + 0.15)})` }}>
            <div style={{ width: 160, height: 160, borderRadius: 80, background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 110, lineHeight: "160px", textAlign: "center" }}>{n}</div>
          </div>
        )}
      </div>
    </Scene>
  );
};

/* 10. Answer: pia mater */
export const V10: React.FC = () => {
  const t = useT();
  return (
    <Scene start={35.78} end={39.06} push={0.01}>
      <Stage t={t} start={35.78} steps={[{ t: 35.78, zoom: [1.35, 0.3, 0.6], focus: ["pia"] }]}
        props={{ dimFrom: 35.8, lit: { pia: 35.82 }, ask: "pia", reveal: 35.82 }}
        lab={{ labels: { pia: 35.9, brain: 38.15 }, pos: { pia: [470, 552], brain: [640, 470] } }} />
      <DarkCard t={t} t0={35.8} h={250}>
        <div style={{ position: "absolute", left: 0, width: 800, top: 26, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 76, color: C.paper, letterSpacing: -1, ...pop(t, 35.82) }}>Pia mater ✓</div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 140, display: "flex", justifyContent: "center", alignItems: "center", gap: 10, fontFamily: FONT, fontWeight: 800, fontSize: 48, color: C.matchaLight, ...pop(t, 36.47) }}>
          {LAYERS.map((x, i) => (
            <span key={x.id} style={{ background: i === 0 ? x.color : "transparent", color: i === 0 ? C.forest : C.paper, border: i === 0 ? "none" : `3px solid ${C.matchaLight}`, borderRadius: 14, padding: "0 16px 4px" }}>{x.letter}</span>
          ))}
          <span style={{ marginLeft: 10 }}>first = on the brain</span>
        </div>
      </DarkCard>
    </Scene>
  );
};

/* 11. Save */
export const V11: React.FC = () => {
  const t = useT();
  const b = ramp(t, 39.15, 39.5);
  return (
    <Scene start={39.06} end={41.25}>
      <div style={center(30, pop(t, 39.1))}>
        <svg width={220} height={280} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={center(350, pop(t, 39.12))}>
        <Big size={120}>SAVE THIS</Big>
      </div>
      <div style={center(500, pop(t, 40.07))}>
        <Big size={58} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ ...center(640), gap: 18, alignItems: "center" }}>
        {LAYERS.map((x, i) => (
          <div key={x.id} style={{ ...pop(t, 40.3 + i * 0.1), width: 230, height: 170, borderRadius: 26, background: x.color, color: C.forest, fontFamily: FONT, fontWeight: 800, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 80, lineHeight: 1 }}>{x.letter}</div>
            <div style={{ fontSize: 25, marginTop: 6 }}>{x.name}</div>
          </div>
        ))}
      </div>
    </Scene>
  );
};

/* 12. End card */
export const END_T = 45.3;
export const V12: React.FC = () => {
  const t = useT();
  return (
    <Scene start={41.25} end={END_T}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, 41.3, 0.35) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.matchaLight, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 42.3, 42.6) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 41.4) * 5))})`, opacity: ramp(t, 41.45, 41.75) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
