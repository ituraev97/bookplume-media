import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { BId, BR, Neck, ORDER, PartId } from "./Neck41";

const ASPECT_N = 2096 / 2265;
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

/* 1. Hook: Gray's 1918 neck plate, push in on the external carotid */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={3.6} push={0.02}>
      <Plate src="plates/neck.png" aspect={ASPECT_N} x={0} y={250} w={600} a={-0.6} b={3.6} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.55, 0.62, 0.42]}
        labels={[{ x: 0.66, y: 0.36, text: "?", t: 1.92, hot: true, ox: 70, oy: -50 }]} credit="Gray's Anatomy, 1918 · PD" />
      <div style={{ position: "absolute", left: 0, top: 10, width: 860, display: "flex", justifyContent: "center", alignItems: "center", gap: 24, ...pop(t, 0.02, 0.25) }}>
        <Big size={190}>{t < 0.82 ? "?" : "8"}</Big>
        <div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 76, color: C.forest, letterSpacing: -1, lineHeight: 1 }}>BRANCHES</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.matcha, letterSpacing: 3, marginTop: 8, opacity: ramp(t, 0.98, 1.2) }}>CAN YOU NAME THEM ALL?</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 600, top: 330, width: 260, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ ...pop(t, 1.92), fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 4, color: C.matcha }}>THE</div>
        <div style={{ ...pop(t, 1.92), ...chip(C.banana, C.forest, 44), padding: "10px 22px 14px", textAlign: "center", lineHeight: 1.05 }}>External</div>
        <div style={{ ...pop(t, 2.41), ...chip(C.forest, C.paper, 44), padding: "10px 22px 14px" }}>carotid</div>
        <div style={{ ...pop(t, 2.87), fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.forest }}>artery</div>
      </div>
      <div style={{ position: "absolute", left: 600, top: 700, width: 260, display: "flex", justifyContent: "center", ...pop(t, 3.0) }}>
        <svg width={120} height={120} viewBox="0 0 120 120">
          <path d="M60 110 L60 60 M60 60 L28 14 M60 60 L92 14" stroke={C.red} strokeWidth={16} strokeLinecap="round" fill="none" />
          <circle cx={60} cy={60} r={9} fill={C.banana} stroke={C.forest} strokeWidth={4} />
        </svg>
      </div>
    </Scene>
  );
};

/* Diagram stage with camera moves */
type Step = { t: number; zoom: [number, number, number]; focus: PartId[] };
const Stage: React.FC<{ t: number; start: number; steps: Step[]; props: Partial<React.ComponentProps<typeof Neck>>; h?: number }> = ({ t, start, steps, props, h = 680 }) => {
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
    <div style={{ position: "absolute", left: 0, top: 10, width: 860, height: h, overflow: "hidden", borderRadius: 36, background: C.card, border: `3px solid ${C.line}` }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 860, height: h, transform: `scale(${s})`, transformOrigin: `${zx * 100}% ${zy * 100}%` }}>
        <div style={{ position: "absolute", left: 0, top: 0 }}><Neck t={t} w={860} focus={cur.focus} {...props} /></div>
      </div>
      <div style={{ position: "absolute", right: 14, bottom: 10, fontFamily: FONT, fontWeight: 700, fontSize: 18, color: C.forest, background: "rgba(255,254,246,0.9)", padding: "2px 10px", borderRadius: 8, opacity: 0.7 }}>Book Plume diagram · right side of the neck</div>
    </div>
  );
};

/* fact card with two rows (letter → branch → note) */
type Row = { id: BId; t: number; note?: [string, number] };
const RowCard: React.FC<{ t: number; t0: number; rows: Row[] }> = ({ t, t0, rows }) => (
  <div style={{ position: "absolute", left: 30, width: 800, top: 708, height: 200, borderRadius: 36, background: C.forest, boxShadow: "0 14px 30px rgba(31,42,20,0.25)", ...pop(t, t0, 0.3) }}>
    {rows.map((r, i) => {
      const p = ramp(t, r.t - 0.05, r.t + 0.25);
      const b = BR[r.id];
      const done = rows[i + 1] && t >= rows[i + 1].t ? 0.55 : 1;
      return (
        <div key={i} style={{ position: "absolute", left: 26, top: 22 + i * 86, display: "flex", alignItems: "center", gap: 14, opacity: p * done, transform: `translateX(${(1 - p) * 40}px)` }}>
          <div style={{ width: 66, height: 66, borderRadius: 33, background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 42, display: "flex", alignItems: "center", justifyContent: "center" }}>{b.letter}</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.matchaLight, whiteSpace: "nowrap" }}>{b.word} →</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: b.name.length > 16 ? 40 : 46, color: C.paper, letterSpacing: -1, whiteSpace: "nowrap" }}>{b.name}</div>
          {r.note && <div style={{ ...pop(t, r.note[1], 0.25), ...chip(C.matcha, C.paper, 28), padding: "6px 14px 9px" }}>{r.note[0]}</div>}
        </div>
      );
    })}
  </div>
);

/* 2. Where it starts: common carotid splits at the thyroid cartilage */
export const V2: React.FC = () => {
  const t = useT();
  return (
    <Scene start={3.6} end={8.15} push={0.01}>
      <Stage t={t} start={3.6} steps={[
        { t: 3.6, zoom: [1.0, 0.5, 0.5], focus: [] },
        { t: 5.1, zoom: [1.2, 0.5, 0.62], focus: [] },
        { t: 6.6, zoom: [1.35, 0.55, 0.72], focus: ["cart"] },
      ]} props={{ build: 4.2, hideBranches: true, lit: { cca: 4.26, cart: 6.62 }, level: 6.62, vl: { cca: 4.5, ica: 5.6, eca: 5.9 } }} />
      <div style={{ position: "absolute", left: 30, width: 800, top: 708, height: 200, borderRadius: 36, background: C.forest, boxShadow: "0 14px 30px rgba(31,42,20,0.25)", ...pop(t, 3.7, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 800, top: 24, display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
          <div style={{ ...pop(t, 4.26), ...chip(C.matcha, C.paper, 40) }}>Common carotid</div>
          <div style={{ ...pop(t, 5.15), fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.banana }}>splits ⑂</div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 112, display: "flex", justifyContent: "center", alignItems: "center", gap: 14 }}>
          <div style={{ ...pop(t, 6.07), fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.matchaLight }}>at the level of the</div>
          <div style={{ ...pop(t, 6.62), ...chip(C.banana, C.forest, 38) }}>thyroid cartilage</div>
        </div>
      </div>
    </Scene>
  );
};

/* 3. Mnemonic card */
const MN: [string, number][] = [["Some", 9.63], ["Anatomists", 9.87], ["Like", 10.49], ["Freaking", 10.7], ["Out", 11.14], ["Poor", 11.32], ["Medical", 11.57], ["Students", 11.94]];
export const V3: React.FC = () => {
  const t = useT();
  return (
    <Scene start={8.15} end={12.9}>
      <div style={{ position: "absolute", left: 10, top: 10, width: 840, height: 900, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 8.15, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 46, display: "flex", justifyContent: "center", gap: 18, alignItems: "center", ...pop(t, 8.32) }}>
          <div style={chip(C.matcha, C.paper, 34)}>1 SENTENCE</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.matchaLight, letterSpacing: 4 }}>=</div>
          <div style={chip(C.banana, C.forest, 34)}>8 BRANCHES</div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 150, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          {[[0, 1], [2, 3], [4, 5], [6, 7]].map((pair, row) => (
            <div key={row} style={{ display: "flex", gap: 26, justifyContent: "center" }}>
              {pair.map((i) => {
                const [w, tt] = MN[i];
                const p = ramp(t, tt - 0.05, tt + 0.2);
                return (
                  <div key={i} style={{ display: "inline-flex", alignItems: "baseline", opacity: p, transform: `translateY(${(1 - p) * -60}px) scale(${1 + 0.1 * Math.sin(p * Math.PI)})`, fontFamily: FONT, fontWeight: 800, fontSize: 92, letterSpacing: -3, lineHeight: 1.2 }}>
                    <span style={{ background: C.banana, color: C.forest, borderRadius: 18, padding: "0 12px 4px", marginRight: 4 }}>{w[0]}</span>
                    <span style={{ color: C.paper }}>{w.slice(1)}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 680, display: "flex", justifyContent: "center", gap: 12 }}>
          {ORDER.map((id, i) => {
            const p = ramp(t, 12.2 + i * 0.06, 12.45 + i * 0.06);
            return (
              <div key={id} style={{ opacity: p, transform: `translateY(${(1 - p) * 30}px)`, width: 84, height: 96, borderRadius: 18, background: i >= 6 ? C.banana : C.matcha, color: i >= 6 ? C.forest : C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 56, display: "flex", alignItems: "center", justifyContent: "center" }}>{BR[id].letter}</div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 800, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.matchaLight, letterSpacing: 2, opacity: ramp(t, 12.5, 12.75) }}>FROM THE NECK UP ↑</div>
      </div>
    </Scene>
  );
};

/* 4–7. Branches, two per scene */
const SEEN: Partial<Record<BId, number>> = {};
const lettersUpTo = (ids: BId[]) => {
  const o: Partial<Record<BId, number>> = {};
  ids.forEach((id) => (o[id] = 0));
  return o;
};
export const V4: React.FC = () => {
  const t = useT();
  return (
    <Scene start={12.9} end={16.6} push={0.01}>
      <Stage t={t} start={12.9} steps={[
        { t: 12.9, zoom: [1.3, 0.55, 0.78], focus: ["st"] },
        { t: 14.7, zoom: [1.08, 0.5, 0.5], focus: ["ap"] },
      ]} props={{ dimFrom: 12.95, hideBranches: true, grow: { st: 13.2, ap: 15.3 }, lit: { cca: 0, eca: 0, st: 13.3, gland: 13.82, ap: 15.39 }, letters: { st: 12.96, ap: 14.71 }, names: { st: 13.6, ap: 15.6 }, nameEnd: { st: 15.2 } }} />
      <RowCard t={t} t0={12.95} rows={[{ id: "st", t: 12.96, note: ["→ thyroid", 13.82] }, { id: "ap", t: 14.71 }]} />
    </Scene>
  );
};
export const V5: React.FC = () => {
  const t = useT();
  return (
    <Scene start={16.6} end={19.45} push={0.01}>
      <Stage t={t} start={16.6} steps={[
        { t: 16.6, zoom: [1.2, 0.6, 0.58], focus: ["li", "tongue"] },
        { t: 18.2, zoom: [1.25, 0.7, 0.45], focus: ["fa"] },
      ]} props={{ dimFrom: 16.62, grow: { st: 0, ap: 0, li: 16.9, fa: 18.3 }, hideBranches: true, lit: { cca: 0, eca: 0, li: 17.07, tongue: 17.64, fa: 18.4 }, letters: { ...lettersUpTo(["st", "ap"]), li: 16.78, fa: 18.21 }, names: { li: 17.1, fa: 18.6 }, nameEnd: { li: 18.1 } }} />
      <RowCard t={t} t0={16.62} rows={[{ id: "li", t: 16.78, note: ["→ tongue", 17.64] }, { id: "fa", t: 18.21, note: ["→ face", 18.78] }]} />
    </Scene>
  );
};
export const V6: React.FC = () => {
  const t = useT();
  return (
    <Scene start={19.45} end={24.55} push={0.01}>
      <Stage t={t} start={19.45} steps={[
        { t: 19.45, zoom: [1.25, 0.3, 0.42], focus: ["oc"] },
        { t: 20.7, zoom: [1.15, 0.3, 0.35], focus: ["oc", "head"] },
        { t: 21.8, zoom: [1.25, 0.4, 0.3], focus: ["pa"] },
        { t: 23.6, zoom: [1.25, 0.4, 0.3], focus: ["pa", "ear"] },
      ]} props={{ dimFrom: 19.47, hideBranches: true, grow: { st: 0, ap: 0, li: 0, fa: 0, oc: 19.8, pa: 22.1 }, lit: { cca: 0, eca: 0, oc: 19.98, head: 20.72, pa: 22.22, ear: 23.59 }, letters: { ...lettersUpTo(["st", "ap", "li", "fa"]), oc: 19.6, pa: 21.82 }, names: { oc: 20.1, pa: 22.4 }, nameEnd: { oc: 21.7 } }} />
      <RowCard t={t} t0={19.47} rows={[{ id: "oc", t: 19.6, note: ["→ back of head", 20.72] }, { id: "pa", t: 21.82 }]} />
    </Scene>
  );
};
export const V7: React.FC = () => {
  const t = useT();
  return (
    <Scene start={24.55} end={29.4} push={0.01}>
      <Stage t={t} start={24.55} steps={[
        { t: 24.55, zoom: [1.0, 0.5, 0.5], focus: [] },
        { t: 26.1, zoom: [1.35, 0.55, 0.22], focus: ["eca"] },
        { t: 27.2, zoom: [1.15, 0.5, 0.3], focus: ["mx"] },
        { t: 28.1, zoom: [1.15, 0.5, 0.25], focus: ["sut"] },
      ]} props={{ dimFrom: 24.6, hideBranches: true, grow: { st: 0, ap: 0, li: 0, fa: 0, oc: 0, pa: 0, mx: 24.75, sut: 25.2 }, lit: { cca: 0, eca: 26.15, mx: 27.23, sut: 28.11 }, letters: { ...lettersUpTo(["st", "ap", "li", "fa", "oc", "pa"]), mx: 24.71, sut: 25.18 }, names: { mx: 27.3, sut: 28.2 } }} />
      <Stamp t0={26.15} text="2 END BRANCHES" size={44} rot={-6} color={C.red} style={{ left: 40, top: 560 }} />
      <RowCard t={t} t0={24.6} rows={[{ id: "mx", t: 24.71 }, { id: "sut", t: 25.18 }]} />
    </Scene>
  );
};

/* 8. Gray's 1918 plate with modern labels, follow it from the neck up to the temple */
export const V8: React.FC = () => {
  const t = useT();
  const noteOut = ramp(t, 31.95, 32.2);
  return (
    <Scene start={29.4} end={34.6} push={0.01}>
      <Plate src="plates/neck.png" aspect={ASPECT_N} x={40} y={0} w={780} a={29.4} b={34.6} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.25, 0.55, 0.35]}
        labels={[
          { x: 0.648, y: 0.66, text: "Common carotid", t: 30.0, ox: -40, oy: 30 },
          { x: 0.662, y: 0.40, text: "External carotid", t: 30.35, hot: true, ox: -40, oy: 110 },
          { x: 0.725, y: 0.39, text: "Facial", t: 30.75, ox: 40, oy: -70 },
          { x: 0.35, y: 0.335, text: "Occipital", t: 31.1, ox: 30, oy: 80 },
          { x: 0.48, y: 0.24, text: "Posterior auricular", t: 31.45, ox: 20, oy: -90 },
          { x: 0.635, y: 0.245, text: "Maxillary", t: 31.8, ox: 60, oy: -10 },
          { x: 0.578, y: 0.11, text: "Superficial temporal", t: 32.9, hot: true, ox: -30, oy: -50 },
        ]}
      />
      <div style={{ position: "absolute", left: 40, width: 780, top: 760, height: 150, borderRadius: 26, background: C.forest, boxShadow: "0 12px 26px rgba(31,42,20,0.3)", opacity: ramp(t, 29.9, 30.2) * (1 - noteOut), transform: `scale(${0.7 + 0.3 * ramp(t, 29.9, 30.2)})` }}>
        <div style={{ position: "absolute", left: 30, top: 20, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.matchaLight, letterSpacing: 2 }}>1918 ATLAS NAME</div>
        <div style={{ position: "absolute", left: 30, top: 64, fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.paper, whiteSpace: "nowrap" }}>
          "Internal Maxillary" = <span style={{ color: C.banana }}>maxillary a.</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 40, width: 780, top: 760, height: 150, borderRadius: 26, background: C.forest, boxShadow: "0 12px 26px rgba(31,42,20,0.3)", ...pop(t, 32.1) }}>
        <div style={{ position: "absolute", left: 0, width: 780, top: 44, display: "flex", justifyContent: "center", alignItems: "center", gap: 20 }}>
          <div style={{ ...pop(t, 32.43, 0.25), ...chip(C.matcha, C.paper, 44) }}>neck</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 50, color: C.banana, opacity: ramp(t, 32.6, 32.9) }}>→ → →</div>
          <div style={{ ...pop(t, 33.09, 0.25), ...chip(C.banana, C.forest, 44) }}>temple</div>
        </div>
      </div>
    </Scene>
  );
};

/* 9. Quick test */
export const C0 = 36.95;
export const V9: React.FC = () => {
  const t = useT();
  const n = t < C0 ? null : t < C0 + 0.5 ? 3 : t < C0 + 1.0 ? 2 : t < C0 + 1.5 ? 1 : null;
  const k = Math.floor((t - C0) / 0.5) * 0.5 + C0;
  return (
    <Scene start={34.6} end={38.42}>
      <div style={{ position: "absolute", left: 10, top: 30, width: 840, height: 860, borderRadius: 48, background: C.forest, ...pop(t, 34.65, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 52, display: "flex", justifyContent: "center" }}>
          <div style={{ background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, padding: "8px 28px 11px 36px", borderRadius: 18 }}>QUICK TEST</div>
        </div>
        <div style={{ position: "absolute", left: 40, width: 760, top: 170, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 70, lineHeight: 1.12, color: C.paper, ...pop(t, 35.41) }}>
          Which branch supplies the <span style={{ background: C.banana, color: C.forest, borderRadius: 16, padding: "0 14px 4px", display: "inline-block" }}>tongue?</span>
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 450, display: "flex", justifyContent: "center", gap: 12 }}>
          {ORDER.map((id, i) => (
            <div key={id} style={{ ...pop(t, 36.0 + i * 0.07), width: 86, height: 110, borderRadius: 20, background: C.matchaDark, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>{BR[id].letter}</div>
          ))}
        </div>
        {n && (
          <div style={{ position: "absolute", left: 0, width: 840, top: 640, display: "flex", justifyContent: "center", transform: `scale(${1.3 - 0.3 * ramp(t, k, k + 0.15)})` }}>
            <div style={{ width: 150, height: 150, borderRadius: 75, background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 104, lineHeight: "150px", textAlign: "center" }}>{n}</div>
          </div>
        )}
      </div>
    </Scene>
  );
};

/* 10. Answer: lingual */
export const V10: React.FC = () => {
  const t = useT();
  return (
    <Scene start={38.42} end={40.1} push={0.01}>
      <div style={{ ...center(20), gap: 10, alignItems: "center" }}>
        {ORDER.map((id, i) => {
          const hot = id === "li";
          const p = ramp(t, 38.47 + (hot ? 0.1 : 0), 38.8);
          return (
            <div key={id} style={{ width: hot ? 120 : 74, height: hot ? 140 : 90, borderRadius: 20, background: hot ? C.red : C.matchaLight, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: hot ? 96 : 50, display: "flex", alignItems: "center", justifyContent: "center", opacity: hot ? 1 : 0.35 + 0.65 * (1 - p), transform: hot ? `scale(${0.7 + 0.3 * p + 0.1 * Math.sin(p * Math.PI)})` : "none" }}>{BR[id].letter}</div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, top: 190, width: 860, height: 490, borderRadius: 36, background: C.card, border: `3px solid ${C.line}`, overflow: "hidden", ...pop(t, 38.5) }}>
        <div style={{ position: "absolute", left: -330, top: -330, transform: "scale(1.6)", transformOrigin: "0 0" }}>
          <Neck t={t} w={860} focus={["li", "tongue"]} dimFrom={38.46} lit={{ cca: 0, eca: 0, li: 38.5, tongue: 38.6 }} letters={{ li: 38.55 }} />
        </div>
        <div style={{ position: "absolute", left: 30, top: 30, ...pop(t, 38.8), ...chip(C.banana, C.forest, 40) }}>tongue ✓</div>
      </div>
      <div style={{ position: "absolute", left: 30, width: 800, top: 708, height: 200, borderRadius: 36, background: C.forest, ...pop(t, 38.55) }}>
        <div style={{ position: "absolute", left: 0, width: 800, top: 22, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 64, color: C.paper, letterSpacing: -1, ...pop(t, 38.48) }}>Lingual artery</div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 116, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.matchaLight, ...pop(t, 39.01) }}>
          Some Anatomists <span style={{ background: C.banana, color: C.forest, borderRadius: 12, padding: "0 10px 3px" }}>L</span>ike Freaking…
        </div>
      </div>
    </Scene>
  );
};

/* 11. Save */
export const V11: React.FC = () => {
  const t = useT();
  const b = ramp(t, 40.3, 40.65);
  return (
    <Scene start={40.1} end={42.3}>
      <div style={center(40, pop(t, 40.2))}>
        <svg width={220} height={280} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={center(360, pop(t, 40.25))}>
        <Big size={120}>SAVE THIS</Big>
      </div>
      <div style={center(510, pop(t, 40.91))}>
        <Big size={58} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ ...center(640), gap: 10, alignItems: "center", ...pop(t, 41.4) }}>
        {ORDER.map((id, i) => (
          <div key={id} style={{ width: 88, height: 104, borderRadius: 20, background: i >= 6 ? C.banana : C.matcha, color: i >= 6 ? C.forest : C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 58, display: "flex", alignItems: "center", justifyContent: "center" }}>{BR[id].letter}</div>
        ))}
      </div>
    </Scene>
  );
};

/* 12. End card */
export const V12: React.FC = () => {
  const t = useT();
  return (
    <Scene start={42.3} end={46.4}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, 42.35, 0.35) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.matchaLight, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 43.4, 43.7) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 42.5) * 5))})`, opacity: ramp(t, 42.46, 42.8) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
void SEEN; void Pill;
