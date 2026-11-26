import React from "react";
import { Img, staticFile } from "remotion";
import { C, FONT, Pill, Scene, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, pop } from "./Scenes67";
import { PlateBox74 } from "./Scenes74";

export const P1032 = "plates/med1032.png";
export const A1032 = 1657 / 1209;
export const P530 = "plates/aorta530.png";
export const A530 = 1781 / 2345;
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* D A T E  V S L (Kenhub: "on the DATE Vivian Slapped Larry") */
export type Id = "D" | "A" | "T" | "E" | "V" | "S" | "L";
export const IDS: Id[] = ["D", "A", "T", "E", "V", "S", "L"];
export const LET: Record<Id, string> = { D: "D", A: "A", T: "T", E: "E", V: "V", S: "S", L: "L" };
/* voice times (words.json): the letter ("D." "A." ...) */
export const TF: Record<Id, number> = { D: 6.64, A: 8.57, T: 10.69, E: 12.0, V: 13.03, S: 14.18, L: 15.53 };
export const TM: Record<Id, number> = { D: 6.89, A: 8.72, T: 10.96, E: 12.19, V: 13.18, S: 14.31, L: 15.7 };
/* mnemonic card: DATE, Vivian, Slapped, Larry */
const MT: Record<Id, number> = { D: 4.95, A: 5.04, T: 5.13, E: 5.2, V: 5.3, S: 5.66, L: 6.03 };
export const COL: Record<Id, string> = { D: "#C9483C", A: "#2F6B8F", T: "#7B4A9A", E: "#D9772B", V: "#5C7A2F", S: "#B5476B", L: "#2A8C82" };
export const NAME: Record<Id, string[]> = {
  D: ["Descending", "thoracic aorta"],
  A: ["Azygos and", "hemiazygos veins"],
  T: ["Thoracic duct"],
  E: ["Esophagus"],
  V: ["Vagus nerves"],
  S: ["Splanchnic nerves"],
  L: ["Lymph nodes"],
};
export const NOTE: Record<Id, string> = { D: "artery", A: "veins", T: "lymph", E: "tube", V: "CN X", S: "nerves", L: "nodes" };
const POS: Record<Id, string> = {
  D: "runs down to the diaphragm",
  A: "azygos right · hemiazygos left",
  T: "right of the aorta",
  E: "tube from throat to stomach",
  V: "left and right",
  S: "greater · lesser · least",
  L: "along the vessels",
};
type Box = [number, number, number, number];
type Cfg = { src: string; aspect: number; fig: string; x: number; y: number; w: number; h: number; hl: Partial<Record<Id, Box[]>>; ring: Partial<Record<Id, Box>> };
/* printed label boxes + rings: fractions of the plate image (cx, cy, w/rx, h/ry) */
const CFG1032: Cfg = {
  src: P1032, aspect: A1032, fig: "1032", x: 0, y: 100, w: 860, h: 640,
  hl: { D: [[0.195, 0.158, 0.092, 0.038]], A: [[0.891, 0.378, 0.15, 0.038]], T: [[0.0955, 0.494, 0.18, 0.038]], E: [[0.875, 0.249, 0.135, 0.038]], V: [[0.107, 0.58, 0.155, 0.038], [0.895, 0.305, 0.15, 0.038]] },
  ring: { D: [0.436, 0.539, 0.045, 0.27], A: [0.575, 0.337, 0.035, 0.06], E: [0.51, 0.4, 0.028, 0.34] },
};
const CFG530: Cfg = {
  src: P530, aspect: A530, fig: "530", x: 150, y: 96, w: 560, h: 664,
  hl: {}, ring: { S: [0.559, 0.738, 0.044, 0.072] },
};
const cfgFor = (id: Id | null): Cfg => (id === "S" || id === "L" ? CFG530 : CFG1032);
const T_HOLD = 16.65;

export const Chip: React.FC<{ id: Id; size?: number; on?: number; hot?: boolean; round?: boolean }> = ({ id, size = 70, on = 1, hot, round }) => (
  <div style={{ width: size, height: size, flex: `0 0 ${size}px`, borderRadius: round ? size / 2 : size * 0.28, background: on > 0.5 ? COL[id] : "rgba(31,42,20,0.08)", border: `4px solid ${on > 0.5 ? C.forest : "rgba(31,42,20,0.25)"}`, color: on > 0.5 ? C.paper : "rgba(31,42,20,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.6, transform: `scale(${hot ? 1.16 : 1})`, boxShadow: hot ? `0 0 0 6px ${C.banana}` : "none", boxSizing: "border-box", lineHeight: 1 }}>
    {LET[id]}
  </div>
);

/* current letter at time t */
const cur = (t: number): Id | null => {
  let c: Id | null = null;
  IDS.forEach((id) => { if (t >= TF[id] - 0.05) c = id; });
  return c;
};

/* strip of 7 chips */
const Strip: React.FC<{ t: number; top?: number }> = ({ t, top = 0 }) => {
  const L = cur(t);
  return (
    <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", alignItems: "center", gap: 12 }}>
      {IDS.map((id) => {
        const p = ramp(t, TF[id] - 0.05, TF[id] + 0.12);
        const hot = L === id;
        return (
          <div key={id} style={{ transform: `scale(${1 + 0.2 * p * (1 - ramp(t, TF[id] + 0.12, TF[id] + 0.4))})` }}>
            <Chip id={id} size={84} on={p} hot={hot} />
          </div>
        );
      })}
    </div>
  );
};

/* Gray plate with a frame round the printed label + a ring on the structure being named */
const PlateHL: React.FC<{ t: number }> = ({ t }) => {
  const id = cur(t);
  const g = cfgFor(id);
  const ih0 = g.h, iw0 = g.h * g.aspect;
  const iw = Math.min(g.w, iw0), ih = iw / g.aspect;
  const L = g.w / 2 - iw / 2, T = g.h / 2 - ih / 2;
  const p = id ? ramp(t, TF[id] - 0.05, TF[id] + 0.18) : 0;
  const hl = id ? g.hl[id] || [] : [];
  const r = id ? g.ring[id] : undefined;
  return (
    <>
      <div style={{ position: "absolute", left: g.x, top: g.y, width: g.w, height: g.h, overflow: "hidden", borderRadius: 40, background: C.paper, boxShadow: `0 0 0 5px ${C.line}, 0 20px 44px rgba(31,42,20,0.18)` }}>
        <Img src={staticFile(g.src)} style={{ position: "absolute", left: L, top: T, width: iw, height: ih }} />
        {id && hl.map((b, i) => (
          <div key={i} style={{ position: "absolute", left: L + (b[0] - b[2] / 2) * iw - 8, top: T + (b[1] - b[3] / 2) * ih - 6, width: b[2] * iw + 16, height: b[3] * ih + 12, border: `8px solid ${COL[id]}`, borderRadius: 16, background: "rgba(255,214,10,0.28)", boxShadow: `0 0 0 4px ${C.paper}`, opacity: p, transform: `scale(${0.9 + 0.1 * p})` }} />
        ))}
        {id && r && (
          <div style={{ position: "absolute", left: L + (r[0] - r[2]) * iw, top: T + (r[1] - r[3]) * ih, width: r[2] * 2 * iw, height: r[3] * 2 * ih, border: `9px solid ${COL[id]}`, borderRadius: "50%", boxShadow: `0 0 0 4px ${C.paper}, inset 0 0 0 4px ${C.paper}`, opacity: p, transform: `scale(${1.25 - 0.25 * p})` }} />
        )}
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: g.y + g.h + 10, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.forest, opacity: 0.65 }}>Gray's Anatomy (1918), Fig. {g.fig} · public domain</div>
    </>
  );
};

const NameCard: React.FC<{ t: number; top: number }> = ({ t, top }) => {
  const id = cur(t);
  if (!id) return null;
  const p = ramp(t, TF[id] - 0.02, TF[id] + 0.2);
  return (
    <div key={id} style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, background: C.forest, borderRadius: 30, padding: "12px 28px 14px 14px", transform: `scale(${0.85 + 0.15 * p})`, opacity: p, boxShadow: "0 10px 0 rgba(31,42,20,0.15)" }}>
        <Chip id={id} size={84} round />
        <div style={{ opacity: ramp(t, TM[id] - 0.1, TM[id] + 0.1, 0.3, 1) }}>
          {NAME[id].map((nm, i) => (
            <div key={i} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.paper, lineHeight: 1.08, whiteSpace: "nowrap" }}>
              {i === 0 ? <span style={{ background: C.banana, color: C.forest, borderRadius: 8, padding: "0 5px 2px" }}>{nm[0]}</span> : null}
              {i === 0 ? nm.slice(1) : nm}
            </div>
          ))}
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, color: "#B9D27A", marginTop: 2, whiteSpace: "nowrap" }}>{NOTE[id]} · {POS[id]}</div>
        </div>
      </div>
    </div>
  );
};

/* 1. Hook: Gray's 1918 Fig. 1032 visible from frame 0 + challenge */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={3.83} push={0.02}>
      <div style={center(0, pop(t, -0.4, 0.25))}>
        <Big size={124}>NAME THE 7</Big>
      </div>
      <div style={center(128, pop(t, -0.3, 0.25))}>
        <Big size={54} color={C.red}>POSTERIOR MEDIASTINUM</Big>
      </div>
      <PlateBox74 src={P1032} aspect={A1032} x={50} y={232} w={760} h={560} a={-0.6} b={3.83} from={[0.5, 0.5, 1.02]} to={[0.5, 0.5, 1.0]} credit="" />
      <div style={{ position: "absolute", left: 0, width: 860, top: 802, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.forest, opacity: 0.65 }}>Gray's Anatomy (1918), Fig. 1032 · public domain</div>
      <div style={center(850, pop(t, 0.05, 0.25))}>
        <Pill size={34} bg={C.forest}>posterior mediastinum · mnemonic</Pill>
      </div>
    </Scene>
  );
};

/* 2. The mnemonic card: on the DATE, Vivian Slapped Larry */
export const V2: React.FC = () => {
  const t = useT();
  const tagP = ramp(t, 5.0, 5.25);
  const tag2 = ramp(t, 5.3, 5.6);
  return (
    <Scene start={3.83} end={6.5} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, ...pop(t, 3.86, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: C.banana }}>POSTERIOR MEDIASTINUM</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 98, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#B9D27A", opacity: ramp(t, 4.0, 4.2) }}>just remember</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 190, display: "flex", justifyContent: "center", gap: 8 }}>
          {IDS.map((id) => {
            const p = ramp(t, MT[id] - 0.08, MT[id] + 0.12);
            return (
              <div key={id} style={{ opacity: 0.2 + 0.8 * p, transform: `translateY(${(1 - p) * 24}px)` }}>
                <div style={{ width: 100, height: 160, borderRadius: 26, background: p > 0.5 ? COL[id] : "rgba(247,246,236,0.14)", border: `5px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 96, color: C.paper, lineHeight: 1, paddingBottom: 6, boxSizing: "border-box" }}>{LET[id]}</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 420, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 84, color: C.paper, opacity: tagP }}>on the <span style={{ color: C.banana }}>DATE</span></div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 540, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 66, color: C.paper, opacity: tag2, whiteSpace: "nowrap" }}>
          <span style={{ color: C.banana }}>V</span>ivian <span style={{ color: C.banana }}>S</span>lapped <span style={{ color: C.banana }}>L</span>arry
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 720, display: "flex", justifyContent: "center", opacity: tag2 }}>
          <div style={{ background: C.banana, color: C.forest, borderRadius: 24, padding: "8px 30px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 50, whiteSpace: "nowrap" }}>7 main structures</div>
        </div>
      </div>
    </Scene>
  );
};

/* 3. Plate: label + structure ringed per letter + name card */
export const V3: React.FC = () => {
  const t = useT();
  const g = cfgFor(cur(t));
  return (
    <Scene start={6.5} end={T_HOLD} push={0.004}>
      <Strip t={t} top={0} />
      <PlateHL t={t} />
      <NameCard t={t} top={g === CFG530 ? 810 : 800} />
    </Scene>
  );
};

/* 4. Quick test with 3-2-1 */
export const V4: React.FC = () => {
  const t = useT();
  const s0 = T_HOLD;
  const cd: [number, number][] = [[20.41, 3], [21.05, 2], [21.69, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < 22.3) { n = v; n0 = s; } });
  return (
    <Scene start={s0} end={22.3}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, s0 + 0.02, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 42, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 30, width: 760, top: 110, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 54, lineHeight: 1.12, color: C.paper, ...pop(t, s0 + 0.3) }}>
          Which one is the only <span style={{ color: C.banana }}>MAJOR ARTERY</span> on the list?
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 350, display: "flex", justifyContent: "center", gap: 8, alignItems: "center", ...pop(t, s0 + 1.6, 0.25) }}>
          {IDS.map((id) => <Chip key={id} id={id} size={92} />)}
        </div>
        {n !== null ? (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 560, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 190, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        ) : (
          <div style={{ position: "absolute", left: 0, width: 820, top: 640, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, color: "#B9D27A", opacity: ramp(t, 20.1, 20.3) }}>pause · say it out loud</div>
        )}
      </div>
    </Scene>
  );
};

/* 5. Answer */
export const V5: React.FC = () => {
  const t = useT();
  return (
    <Scene start={22.3} end={24.2} push={0.006}>
      <div style={center(34, pop(t, 22.32, 0.25))}>
        <Pill size={46} bg={C.banana} color={C.forest}>✓ THE D IN DATE</Pill>
      </div>
      <div style={{ position: "absolute", left: 20, top: 150, width: 820, height: 640, borderRadius: 48, background: C.forest, ...pop(t, 22.35, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 70, display: "flex", justifyContent: "center", gap: 8, alignItems: "center" }}>
          {IDS.map((id) => (
            <div key={id} style={{ opacity: id === "D" ? 1 : 0.4 }}><Chip id={id} size={92} on={1} hot={id === "D"} /></div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 250, display: "flex", justifyContent: "center", opacity: ramp(t, 22.45, 22.7) }}>
          <div style={{ background: C.red, color: C.paper, borderRadius: 20, padding: "8px 24px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 60, textAlign: "center", lineHeight: 1.05 }}>DESCENDING<br />THORACIC AORTA</div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 490, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, color: "#B9D27A", opacity: ramp(t, 23.0, 23.25), lineHeight: 1.2 }}>the other six: veins, duct,<br />esophagus, nerves, nodes</div>
      </div>
    </Scene>
  );
};

/* 6. Save frame: the complete list */
export const V6: React.FC = () => {
  const t = useT();
  const s0 = 24.2;
  const b = ramp(t, s0 + 0.05, s0 + 0.4);
  const row = (id: Id, base: number) => (
    <div key={id} style={{ display: "flex", alignItems: "center", gap: 14, height: 62, borderBottom: `2px solid ${C.line}`, opacity: ramp(t, s0 + 0.2 + base * 0.04, s0 + 0.4 + base * 0.04) }}>
      <Chip id={id} size={48} round />
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.forest, whiteSpace: "nowrap" }}>{NAME[id].join(" ")}</div>
      <div style={{ marginLeft: "auto", fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.matcha, whiteSpace: "nowrap" }}>{NOTE[id]}</div>
    </div>
  );
  return (
    <Scene start={s0} end={26.55}>
      <div style={{ position: "absolute", left: 40, top: 0, ...pop(t, s0 + 0.05) }}>
        <svg width={110} height={140} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 170, top: 6, ...pop(t, s0 + 0.1) }}>
        <Big size={100}>SAVE THIS</Big>
      </div>
      <div style={{ position: "absolute", left: 172, top: 112, ...pop(t, s0 + 0.3) }}>
        <Big size={40} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ position: "absolute", left: 30, top: 178, width: 800, height: 722, borderRadius: 40, background: C.card, border: `3px solid ${C.line}`, boxShadow: "0 18px 40px rgba(31,42,20,0.12)", padding: "14px 30px", boxSizing: "border-box", ...pop(t, s0 + 0.15, 0.3) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.forest, whiteSpace: "nowrap", marginBottom: 4 }}>DATE VSL = 7 main structures</div>
        {IDS.map((id, i) => row(id, i))}
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, color: C.matcha, marginTop: 10, lineHeight: 1.2, opacity: ramp(t, s0 + 0.6, s0 + 0.8) }}>Behind the pericardium, in front of the spine. The sympathetic trunk is not counted: books differ.</div>
      </div>
    </Scene>
  );
};

/* 7. End card (≤ 1.5 s) — no store, no product */
export const V7: React.FC = () => {
  const t = useT();
  const s0 = 26.55;
  return (
    <Scene start={s0} end={27.85}>
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
