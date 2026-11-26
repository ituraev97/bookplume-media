import React from "react";
import { Img, staticFile } from "remotion";
import { C, FONT, Pill, Scene, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, pop } from "./Scenes67";

export const P962 = "plates/lungs962.png";
export const A962 = 1893 / 1528;
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* A PALM Seed Makes Another Little Palm (Epomedicine + Kenhub): 10 segments of the RIGHT lung = 3 + 2 + 5 */
export type Id = "AP" | "PO" | "AN" | "LA" | "ME" | "SU" | "MB" | "AB" | "LB" | "PB";
export const IDS: Id[] = ["AP", "PO", "AN", "LA", "ME", "SU", "MB", "AB", "LB", "PB"];
export const LET: Record<Id, string> = { AP: "A", PO: "P", AN: "A", LA: "L", ME: "M", SU: "S", MB: "M", AB: "A", LB: "L", PB: "P" };
export const TF: Record<Id, number> = { AP: 5.4, PO: 6.19, AN: 7.21, LA: 8.13, ME: 8.97, SU: 9.88, MB: 10.84, AB: 12.13, LB: 13.3, PB: 14.48 };
export const TM: Record<Id, number> = { AP: 5.55, PO: 6.41, AN: 7.37, LA: 8.32, ME: 9.24, SU: 10.05, MB: 11.17, AB: 12.24, LB: 13.53, PB: 14.71 };
const MT: number[] = [3.3, 3.4, 3.5, 3.6, 3.7, 3.7, 4.0, 4.25, 4.52, 4.72];
export const COL: Record<Id, string> = { AP: "#2F6B8F", PO: "#3558A8", AN: "#2A8C82", LA: "#D9772B", ME: "#B8860B", SU: "#C9483C", MB: "#7B4A9A", AB: "#B5476B", LB: "#5C7A2F", PB: "#8A5A2B" };
export const NAME: Record<Id, string> = { AP: "Apical", PO: "Posterior", AN: "Anterior", LA: "Lateral", ME: "Medial", SU: "Superior", MB: "Medial basal", AB: "Anterior basal", LB: "Lateral basal", PB: "Posterior basal" };
export const LOBE: Record<Id, string> = { AP: "upper lobe", PO: "upper lobe", AN: "upper lobe", LA: "middle lobe", ME: "middle lobe", SU: "lower lobe", MB: "lower lobe", AB: "lower lobe", LB: "lower lobe", PB: "lower lobe" };
export const NUM: Record<Id, number> = { AP: 1, PO: 2, AN: 3, LA: 4, ME: 5, SU: 6, MB: 7, AB: 8, LB: 9, PB: 10 };
const T_HOLD = 15.9;

export const Chip: React.FC<{ id: Id; size?: number; on?: number; hot?: boolean; round?: boolean }> = ({ id, size = 70, on = 1, hot, round }) => (
  <div style={{ width: size, height: size, flex: `0 0 ${size}px`, borderRadius: round ? size / 2 : size * 0.28, background: on > 0.5 ? COL[id] : "rgba(31,42,20,0.08)", border: `4px solid ${on > 0.5 ? C.forest : "rgba(31,42,20,0.25)"}`, color: on > 0.5 ? C.paper : "rgba(31,42,20,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.6, transform: `scale(${hot ? 1.16 : 1})`, boxShadow: hot ? `0 0 0 6px ${C.banana}` : "none", boxSizing: "border-box", lineHeight: 1 }}>
    {LET[id]}
  </div>
);

const cur = (t: number): Id | null => {
  let c: Id | null = null;
  IDS.forEach((id) => { if (t >= TF[id] - 0.05) c = id; });
  return c;
};

const Strip: React.FC<{ t: number; top?: number }> = ({ t, top = 0 }) => {
  const L = cur(t);
  return (
    <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
      {IDS.map((id) => {
        const p = ramp(t, TF[id] - 0.05, TF[id] + 0.12);
        const hot = L === id;
        return (
          <div key={id} style={{ transform: `scale(${1 + 0.2 * p * (1 - ramp(t, TF[id] + 0.12, TF[id] + 0.4))})` }}>
            <Chip id={id} size={74} on={p} hot={hot} />
          </div>
        );
      })}
    </div>
  );
};

/* ---------- own schematic: right bronchial tree, 3 lobar bronchi, 10 segmental bronchi (not to scale) ---------- */
type Pt = [number, number];
const J: Record<string, Pt> = { U: [480, 150], M: [480, 320], L: [480, 520] };
const EP: Record<Id, { j: "U" | "M" | "L"; p: Pt }> = {
  AP: { j: "U", p: [340, 92] }, PO: { j: "U", p: [300, 150] }, AN: { j: "U", p: [340, 208] },
  LA: { j: "M", p: [340, 292] }, ME: { j: "M", p: [340, 346] },
  SU: { j: "L", p: [340, 424] }, MB: { j: "L", p: [320, 472] }, AB: { j: "L", p: [310, 520] }, LB: { j: "L", p: [320, 568] }, PB: { j: "L", p: [340, 616] },
};
const PANEL = [
  { y: 52, h: 200, col: "#3558A8", tag: "UPPER LOBE", n: "3 segments", ty: 120 },
  { y: 262, h: 118, col: "#D9772B", tag: "MIDDLE LOBE", n: "2 segments", ty: 321 },
  { y: 394, h: 244, col: "#5C7A2F", tag: "LOWER LOBE", n: "5 segments", ty: 516 },
];

const Diagram: React.FC<{ t: number; at: { x: number; y: number; w: number; h: number }; all?: boolean }> = ({ t, at, all }) => {
  const id = cur(t);
  return (
    <>
      <div style={{ position: "absolute", left: at.x, top: at.y, width: at.w, height: at.h, overflow: "hidden", borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}, 0 20px 44px rgba(31,42,20,0.18)` }}>
        <svg width={at.w} height={at.h} viewBox="0 0 860 640" style={{ position: "absolute", left: 0, top: 0 }}>
          {PANEL.map((p, i) => (
            <g key={i}>
              <rect x={30} y={p.y} width={555} height={p.h} rx={30} fill={p.col} opacity={0.12} stroke={p.col} strokeWidth={3} />
              <rect x={636} y={p.ty - 40} width={200} height={80} rx={22} fill={p.col} stroke={C.forest} strokeWidth={4} />
              <text x={736} y={p.ty - 6} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={C.paper}>{p.tag}</text>
              <text x={736} y={p.ty + 26} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.banana}>{p.n}</text>
            </g>
          ))}
          <path d="M 600 20 L 600 500" stroke={C.forest} strokeWidth={30} strokeLinecap="round" />
          <path d="M 600 20 L 600 500" stroke={C.paper} strokeWidth={18} strokeLinecap="round" />
          {(["U", "M", "L"] as const).map((k) => {
            const y0 = k === "U" ? 130 : k === "M" ? 318 : 500;
            return (
              <g key={k}>
                <line x1={600} y1={y0} x2={J[k][0]} y2={J[k][1]} stroke={C.forest} strokeWidth={24} strokeLinecap="round" />
                <line x1={600} y1={y0} x2={J[k][0]} y2={J[k][1]} stroke={C.paper} strokeWidth={13} strokeLinecap="round" />
              </g>
            );
          })}
          <text x={616} y={46} fontFamily={FONT} fontWeight={800} fontSize={21} fill={C.matcha}>right main bronchus</text>
          {IDS.map((k) => {
            const e = EP[k];
            const p = all ? 1 : ramp(t, TF[k] - 0.05, TF[k] + 0.2);
            if (p <= 0) return null;
            const hot = !all && id === k;
            const a = J[e.j];
            const ex = a[0] + (e.p[0] - a[0]) * p, ey = a[1] + (e.p[1] - a[1]) * p;
            return (
              <g key={k}>
                {hot && <circle cx={e.p[0]} cy={e.p[1]} r={30} fill="none" stroke={C.banana} strokeWidth={7} opacity={p} />}
                <line x1={a[0]} y1={a[1]} x2={ex} y2={ey} stroke={C.forest} strokeWidth={18} strokeLinecap="round" />
                <line x1={a[0]} y1={a[1]} x2={ex} y2={ey} stroke={COL[k]} strokeWidth={10} strokeLinecap="round" />
                <g opacity={p}>
                  <rect x={e.p[0] - 24} y={e.p[1] - 22} width={48} height={44} rx={13} fill={COL[k]} stroke={C.forest} strokeWidth={4} />
                  <text x={e.p[0]} y={e.p[1] + 13} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill={C.paper}>{LET[k]}</text>
                  <text x={e.p[0] - 36} y={e.p[1] + 9} textAnchor="end" fontFamily={FONT} fontWeight={800} fontSize={25} fill={C.forest}>{NAME[k]}</text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: at.y + at.h + 10, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.forest, opacity: 0.65 }}>Book Plume schematic · right lung bronchi · not to scale</div>
    </>
  );
};

/* ---------- Gray 1918 Fig. 962 with printed lobe labels + 3 / 2 / 5 badges ---------- */
const BADGES: { n: number; x: number; y: number; t: number }[] = [
  { n: 3, x: 0.43, y: 0.18, t: 16.46 },
  { n: 2, x: 0.34, y: 0.47, t: 17.44 },
  { n: 5, x: 0.34, y: 0.7, t: 18.42 },
];
const PlateLobes: React.FC<{ t: number; at: { x: number; y: number; w: number; h: number } }> = ({ t, at }) => {
  const ih = at.h, iw = ih * A962;
  const L = (at.w - iw) / 2;
  return (
    <>
      <div style={{ position: "absolute", left: at.x, top: at.y, width: at.w, height: at.h, overflow: "hidden", borderRadius: 40, background: C.paper, boxShadow: `0 0 0 5px ${C.line}, 0 20px 44px rgba(31,42,20,0.18)` }}>
        <Img src={staticFile(P962)} style={{ position: "absolute", left: L, top: 0, width: iw, height: ih }} />
        {BADGES.map((b, i) => {
          const p = ramp(t, b.t - 0.1, b.t + 0.15);
          return (
            <div key={i} style={{ position: "absolute", left: L + b.x * iw - 44, top: b.y * ih - 44, width: 88, height: 88, borderRadius: 44, background: C.red, border: `7px solid ${C.paper}`, boxShadow: `0 0 0 4px ${C.forest}`, color: C.paper, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 58, lineHeight: 1, opacity: p, transform: `scale(${0.5 + 0.5 * p})`, boxSizing: "border-box", paddingBottom: 4 }}>{b.n}</div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: at.y + at.h + 10, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.forest, opacity: 0.65 }}>Gray's Anatomy (1918), Fig. 962 · public domain</div>
    </>
  );
};

const NameCard: React.FC<{ t: number; top: number }> = ({ t, top }) => {
  const id = cur(t);
  if (!id) return null;
  const p = ramp(t, TF[id] - 0.02, TF[id] + 0.2);
  const nm = NAME[id];
  return (
    <div key={id} style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, background: C.forest, borderRadius: 30, padding: "12px 28px 14px 14px", transform: `scale(${0.85 + 0.15 * p})`, opacity: p, boxShadow: "0 10px 0 rgba(31,42,20,0.15)" }}>
        <Chip id={id} size={84} round />
        <div style={{ opacity: ramp(t, TM[id] - 0.1, TM[id] + 0.1, 0.3, 1) }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper, lineHeight: 1.08, whiteSpace: "nowrap" }}>
            <span style={{ background: C.banana, color: C.forest, borderRadius: 8, padding: "0 5px 2px" }}>{nm[0]}</span>
            {nm.slice(1)}
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 25, color: "#B9D27A", marginTop: 2, whiteSpace: "nowrap" }}>{LOBE[id]} · segment {NUM[id]}</div>
        </div>
      </div>
    </div>
  );
};

/* 1. Hook: Gray's 1918 Fig. 962 visible from frame 0 + challenge */
export const V1: React.FC = () => {
  const t = useT();
  const w = 760, h = 540, ih = w / A962, top = (h - ih) / 2;
  return (
    <Scene start={-0.6} end={2.4} push={0}>
      <div style={center(18, pop(t, -0.4, 0.25))}>
        <Big size={124}>NAME ALL 10</Big>
      </div>
      <div style={center(146, pop(t, -0.3, 0.25))}>
        <Big size={50} color={C.red}>RIGHT LUNG SEGMENTS</Big>
      </div>
      <div style={{ position: "absolute", left: 50, top: 250, width: w, height: h, overflow: "hidden", borderRadius: 40, background: C.paper, boxShadow: `0 0 0 5px ${C.line}, 0 20px 44px rgba(31,42,20,0.18)` }}>
        <Img src={staticFile(P962)} style={{ position: "absolute", left: 0, top, width: w, height: ih }} />
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 802, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.forest, opacity: 0.65 }}>Gray's Anatomy (1918), Fig. 962 · public domain</div>
      <div style={center(850, pop(t, 0.05, 0.25))}>
        <Pill size={34} bg={C.forest}>lung segments · mnemonic</Pill>
      </div>
    </Scene>
  );
};

/* 2. The mnemonic card: A PALM Seed Makes Another Little Palm */
export const V2: React.FC = () => {
  const t = useT();
  const hl = (s: string) => <><span style={{ color: C.banana }}>{s[0]}</span>{s.slice(1)}</>;
  return (
    <Scene start={2.4} end={5.3} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, ...pop(t, 2.45, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 32, letterSpacing: 5, color: C.banana }}>RIGHT LUNG SEGMENTS</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 98, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#B9D27A", opacity: ramp(t, 2.55, 2.75) }}>just remember</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 190, display: "flex", justifyContent: "center", gap: 5 }}>
          {IDS.map((id, i) => {
            const p = ramp(t, MT[i] - 0.08, MT[i] + 0.12);
            return (
              <div key={id} style={{ opacity: 0.2 + 0.8 * p, transform: `translateY(${(1 - p) * 24}px)` }}>
                <div style={{ width: 74, height: 140, borderRadius: 20, background: p > 0.5 ? COL[id] : "rgba(247,246,236,0.14)", border: `5px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper, lineHeight: 1, paddingBottom: 6, boxSizing: "border-box" }}>{LET[id]}</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 395, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 108, color: C.banana, opacity: ramp(t, 3.25, 3.5), whiteSpace: "nowrap" }}>A PALM</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 530, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 76, color: C.paper, opacity: ramp(t, 3.65, 3.9), whiteSpace: "nowrap" }}>{hl("Seed")} {hl("Makes")}</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 625, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 66, color: C.paper, opacity: ramp(t, 4.2, 4.45), whiteSpace: "nowrap" }}>{hl("Another")} {hl("Little")} {hl("Palm")}</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 740, display: "flex", justifyContent: "center", opacity: ramp(t, 4.75, 5.0) }}>
          <div style={{ background: C.banana, color: C.forest, borderRadius: 24, padding: "8px 28px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 44, whiteSpace: "nowrap" }}>10 segments · 3 + 2 + 5</div>
        </div>
      </div>
    </Scene>
  );
};

/* 3. Diagram: letter + structure + name card per letter, then Gray plate for 3-2-5 */
export const V3: React.FC = () => {
  const t = useT();
  const at = { x: 0, y: 122, w: 860, h: 640 };
  return (
    <Scene start={5.3} end={T_HOLD} push={0.004}>
      <Strip t={t} top={26} />
      <Diagram t={t} at={at} />
      <NameCard t={t} top={816} />
    </Scene>
  );
};
export const V3b: React.FC = () => {
  const t = useT();
  const at = { x: 0, y: 122, w: 860, h: 630 };
  return (
    <Scene start={T_HOLD} end={19.0} push={0.004}>
      <Strip t={19} top={26} />
      <PlateLobes t={t} at={at} />
      <div style={center(814, pop(t, T_HOLD + 0.1, 0.3))}>
        <div style={{ background: C.forest, borderRadius: 30, padding: "10px 34px 16px", fontFamily: FONT, fontWeight: 800, fontSize: 50, color: C.paper, whiteSpace: "nowrap", boxShadow: "0 10px 0 rgba(31,42,20,0.15)" }}>
          upper <span style={{ color: C.banana }}>3</span> · middle <span style={{ color: C.banana }}>2</span> · lower <span style={{ color: C.banana }}>5</span>
        </div>
      </div>
    </Scene>
  );
};

/* 4. Quick test with 3-2-1 */
export const V4: React.FC = () => {
  const t = useT();
  const s0 = 19.0;
  const cd: [number, number][] = [[21.89, 3], [22.52, 2], [23.17, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < 23.75) { n = v; n0 = s; } });
  return (
    <Scene start={s0} end={23.75}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, s0 + 0.02, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 42, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 30, width: 760, top: 110, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 54, lineHeight: 1.12, color: C.paper, ...pop(t, s0 + 0.9) }}>
          Which <span style={{ color: C.banana }}>LOBE</span> has only <span style={{ color: C.banana }}>TWO</span> segments?
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 380, display: "flex", justifyContent: "center", gap: 6, alignItems: "center", ...pop(t, s0 + 1.6, 0.25) }}>
          {IDS.map((id) => <Chip key={id} id={id} size={72} />)}
        </div>
        {n !== null ? (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 560, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 190, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        ) : (
          <div style={{ position: "absolute", left: 0, width: 820, top: 640, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, color: "#B9D27A", opacity: ramp(t, 21.7, 21.85) }}>pause · say it out loud</div>
        )}
      </div>
    </Scene>
  );
};

/* 5. Answer */
export const V5: React.FC = () => {
  const t = useT();
  const hot = (id: Id) => id === "LA" || id === "ME";
  return (
    <Scene start={23.75} end={24.9} push={0.006}>
      <div style={center(34, pop(t, 23.77, 0.25))}>
        <Pill size={46} bg={C.banana} color={C.forest}>✓ THE MIDDLE LOBE</Pill>
      </div>
      <div style={{ position: "absolute", left: 20, top: 150, width: 820, height: 640, borderRadius: 48, background: C.forest, ...pop(t, 23.8, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 60, display: "flex", justifyContent: "center", gap: 6, alignItems: "center" }}>
          {IDS.map((id) => (
            <div key={id} style={{ opacity: hot(id) ? 1 : 0.35 }}><Chip id={id} size={72} on={1} hot={hot(id)} /></div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 230, display: "flex", justifyContent: "center", opacity: ramp(t, 23.9, 24.1) }}>
          <div style={{ background: C.red, color: C.paper, borderRadius: 20, padding: "8px 24px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 58, textAlign: "center", lineHeight: 1.05 }}>LATERAL + MEDIAL</div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 400, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, color: "#B9D27A", opacity: ramp(t, 24.2, 24.4), lineHeight: 1.2 }}>the right middle lobe<br />has just 2 segments</div>
      </div>
    </Scene>
  );
};

/* 6. Save frame: the complete list */
export const V6: React.FC = () => {
  const t = useT();
  const s0 = 24.9;
  const b = ramp(t, s0 + 0.05, s0 + 0.4);
  const row = (id: Id, base: number) => (
    <div key={id} style={{ display: "flex", alignItems: "center", gap: 12, height: 52, borderBottom: `2px solid ${C.line}`, opacity: ramp(t, s0 + 0.2 + base * 0.03, s0 + 0.4 + base * 0.03) }}>
      <Chip id={id} size={40} round />
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.forest, whiteSpace: "nowrap" }}>{NAME[id]}</div>
      <div style={{ marginLeft: "auto", fontFamily: FONT, fontWeight: 800, fontSize: 23, color: C.matcha, whiteSpace: "nowrap" }}>{LOBE[id]} · {NUM[id]}</div>
    </div>
  );
  return (
    <Scene start={s0} end={28.3}>
      <div style={{ position: "absolute", left: 40, top: 14, ...pop(t, s0 + 0.05) }}>
        <svg width={100} height={126} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 160, top: 18, ...pop(t, s0 + 0.1) }}>
        <Big size={96}>SAVE THIS</Big>
      </div>
      <div style={{ position: "absolute", left: 162, top: 120, ...pop(t, s0 + 0.3) }}>
        <Big size={38} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ position: "absolute", left: 30, top: 180, width: 800, height: 740, borderRadius: 40, background: C.card, border: `3px solid ${C.line}`, boxShadow: "0 18px 40px rgba(31,42,20,0.12)", padding: "12px 28px", boxSizing: "border-box", ...pop(t, s0 + 0.15, 0.3) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.forest, whiteSpace: "nowrap", marginBottom: 2 }}>A PALM Seed Makes Another Little Palm</div>
        {IDS.map((id, i) => row(id, i))}
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, color: C.matcha, marginTop: 8, lineHeight: 1.22, opacity: ramp(t, s0 + 0.6, s0 + 0.8) }}>Right lung = 10 segments. The left lung has 8–9 (some sources 8–10): apicoposterior and anteromedial basal merge, and the lingula takes the middle lobe's place.</div>
      </div>
    </Scene>
  );
};

/* 7. End card (≤ 1.5 s) — no store, no product */
export const V7: React.FC = () => {
  const t = useT();
  const s0 = 28.3;
  return (
    <Scene start={s0} end={29.6}>
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
