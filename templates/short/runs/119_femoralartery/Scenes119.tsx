import React from "react";
import { Img, staticFile } from "remotion";
import { C, FONT, Pill, Scene, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, pop } from "./Scenes67";

export const P548 = "plates/fem548.png";
export const A548 = 1256 / 2277;
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* Do Princesses Sew Sweet Superhero Dresses? — Kenhub: D P S S S D */
export type Id = "DG" | "PF" | "SE" | "SC" | "SX" | "DX";
export const IDS: Id[] = ["DG", "PF", "SE", "SC", "SX", "DX"];
export const LET: Record<Id, string> = { DG: "D", PF: "P", SE: "S", SC: "S", SX: "S", DX: "D" };
export const TF: Record<Id, number> = { DG: 5.4, PF: 8.65, SE: 10.8, SC: 14.81, SX: 17.6, DX: 21.22 };
const MT: Record<Id, number> = { DG: 2.81, PF: 2.92, SE: 3.52, SC: 3.72, SX: 4.04, DX: 4.69 };
export const COL: Record<Id, string> = { DG: "#C9483C", PF: "#2F6B8F", SE: "#7B4A9A", SC: "#D9772B", SX: "#5C7A2F", DX: "#B03A78" };
export const NAME: Record<Id, string[]> = {
  DG: ["Descending", "genicular"],
  PF: ["Profunda", "femoris"],
  SE: ["Superficial", "epigastric"],
  SC: ["Superficial", "circumflex iliac"],
  SX: ["Superficial", "external pudendal"],
  DX: ["Deep external", "pudendal"],
};
export const SUB: Record<Id, string> = {
  DG: "lowest · adductor canal",
  PF: "the biggest · deep artery of thigh",
  SE: "lower abdominal wall skin",
  SC: "the smallest",
  SX: "groin + genital skin",
  DX: "perineal + genital skin",
};
const SUBSHORT: Record<Id, string> = { DG: "lowest · adductor canal", PF: "the biggest", SE: "lower abdominal wall skin", SC: "the smallest", SX: "groin + genital skin", DX: "perineal + genital skin" };
/* printed labels on the Gray plate (fractions of the plate image): centre x, y, w, h — only labels whose name is the modern one */
const HL: Partial<Record<Id, [number, number, number, number]>> = {
  PF: [0.638, 0.389, 0.16, 0.028],
  SE: [0.2, 0.207, 0.19, 0.034],
  SC: [0.164, 0.246, 0.265, 0.034],
  SX: [0.784, 0.256, 0.19, 0.042],
  DX: [0.872, 0.298, 0.15, 0.045],
};
/* the artery branch on the plate: centre + radii as fractions of the plate width / height */
const RING: Record<Id, [number, number, number, number]> = {
  DG: [0.51, 0.745, 0.05, 0.038],
  PF: [0.447, 0.41, 0.035, 0.095],
  SE: [0.489, 0.205, 0.04, 0.022],
  SC: [0.45, 0.245, 0.055, 0.02],
  SX: [0.55, 0.263, 0.045, 0.015],
  DX: [0.555, 0.285, 0.05, 0.015],
};
const T_HOLD = 24.5;

export const Chip: React.FC<{ id: Id; size?: number; on?: number; hot?: boolean; round?: boolean }> = ({ id, size = 70, on = 1, hot, round }) => (
  <div style={{ width: size, height: size, flex: `0 0 ${size}px`, borderRadius: round ? size / 2 : size * 0.28, background: on > 0.5 ? COL[id] : "rgba(31,42,20,0.08)", border: `4px solid ${on > 0.5 ? C.forest : "rgba(31,42,20,0.25)"}`, color: on > 0.5 ? C.paper : "rgba(31,42,20,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.6, transform: `scale(${hot ? 1.14 : 1})`, boxShadow: hot ? `0 0 0 6px ${C.banana}` : "none", boxSizing: "border-box", lineHeight: 1 }}>
    {LET[id]}
  </div>
);

const cur = (t: number): Id | null => {
  let c: Id | null = null;
  IDS.forEach((id) => { if (t >= TF[id] - 0.05) c = id; });
  return c;
};

/* Gray 1918 Fig. 548: frame round the printed label + ring on the branch being named */
export const PlateHL: React.FC<{ x: number; y: number; w: number; h: number; id: Id | null; p?: number; all?: boolean }> = ({ x, y, w, h, id, p = 1, all }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden", borderRadius: 36, background: C.paper, boxShadow: `0 0 0 5px ${C.line}, 0 20px 44px rgba(31,42,20,0.18)` }}>
    <Img src={staticFile(P548)} style={{ position: "absolute", left: 0, top: 0, width: w, height: h }} />
    {(all ? IDS : id ? [id] : []).map((k) => {
      const b = HL[k], r = RING[k];
      const o = all ? 0.95 : p;
      return (
        <React.Fragment key={k}>
          {b && <div style={{ position: "absolute", left: (b[0] - b[2] / 2) * w - 7, top: (b[1] - b[3] / 2) * h - 5, width: b[2] * w + 14, height: b[3] * h + 10, border: `7px solid ${COL[k]}`, borderRadius: 14, background: "rgba(255,214,10,0.26)", boxShadow: `0 0 0 3px ${C.paper}`, opacity: o, transform: all ? "none" : `scale(${0.9 + 0.1 * p})` }} />}
          <div style={{ position: "absolute", left: (r[0] - r[2]) * w, top: (r[1] - r[3]) * h, width: r[2] * 2 * w, height: r[3] * 2 * h, border: `8px solid ${COL[k]}`, borderRadius: "50%", boxShadow: `0 0 0 3px ${C.paper}, inset 0 0 0 3px ${C.paper}`, opacity: o, transform: all ? "none" : `scale(${1.25 - 0.25 * p})` }} />
        </React.Fragment>
      );
    })}
  </div>
);

/* 1. Hook: Gray's Fig. 548 visible from frame 0 */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={2.68} push={0}>
      <div style={center(8, pop(t, -0.4, 0.25))}>
        <Big size={118}>NAME EVERY</Big>
      </div>
      <div style={center(128, pop(t, -0.3, 0.25))}>
        <Big size={52} color={C.red}>FEMORAL ARTERY BRANCH</Big>
      </div>
      <PlateHL x={265} y={214} w={330} h={598} id={null} />
      <div style={{ position: "absolute", left: 0, width: 860, top: 822, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.forest, opacity: 0.65 }}>Gray's Anatomy (1918), Fig. 548 · public domain</div>
      <div style={center(862, pop(t, 0.05, 0.25))}>
        <Pill size={34} bg={C.forest}>femoral artery · mnemonic</Pill>
      </div>
    </Scene>
  );
};

/* 2. The mnemonic card */
export const V2: React.FC = () => {
  const t = useT();
  const word = (w: string, i: number, tm: number) => {
    const p = ramp(t, tm - 0.08, tm + 0.12);
    return (
      <span key={i} style={{ opacity: 0.15 + 0.85 * p, transform: `translateY(${(1 - p) * 20}px)`, display: "inline-block" }}>
        <span style={{ color: C.banana }}>{w[0]}</span>{w.slice(1)}
      </span>
    );
  };
  const line = (ws: [string, number][], top: number) => (
    <div style={{ position: "absolute", left: 0, width: 820, top, display: "flex", justifyContent: "center", gap: 24, fontFamily: FONT, fontWeight: 800, fontSize: 70, color: C.paper, whiteSpace: "nowrap" }}>
      {ws.map(([w, tm], i) => word(w, i, tm))}
    </div>
  );
  return (
    <Scene start={2.68} end={5.3} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, ...pop(t, 2.72, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 32, letterSpacing: 4, color: C.banana }}>FEMORAL ARTERY · 6 BRANCHES</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 98, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: "#B9D27A", opacity: ramp(t, 2.8, 3.0) }}>one letter per branch</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 180, display: "flex", justifyContent: "center", gap: 10 }}>
          {IDS.map((id) => {
            const p = ramp(t, MT[id] - 0.08, MT[id] + 0.12);
            return (
              <div key={id} style={{ opacity: 0.2 + 0.8 * p, transform: `translateY(${(1 - p) * 24}px)` }}>
                <div style={{ width: 114, height: 140, borderRadius: 24, background: p > 0.5 ? COL[id] : "rgba(247,246,236,0.14)", border: `5px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 88, color: C.paper, lineHeight: 1, paddingBottom: 6, boxSizing: "border-box" }}>{LET[id]}</div>
              </div>
            );
          })}
        </div>
        {line([["Do", 2.81], ["Princesses", 2.92]], 390)}
        {line([["Sew", 3.52], ["Sweet", 3.72]], 490)}
        {line([["Superhero", 4.04], ["Dresses?", 4.69]], 590)}
        <div style={{ position: "absolute", left: 0, width: 820, top: 730, display: "flex", justifyContent: "center", opacity: ramp(t, 4.9, 5.1) }}>
          <div style={{ background: C.banana, color: C.forest, borderRadius: 24, padding: "8px 28px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 42, whiteSpace: "nowrap" }}>D-P-S-S-S-D · 6 branches</div>
        </div>
      </div>
    </Scene>
  );
};

/* 3. Plate + branch list: label frame + ring + row per letter */
export const V3: React.FC = () => {
  const t = useT();
  const id = cur(t);
  const p = id ? ramp(t, TF[id] - 0.05, TF[id] + 0.18) : 0;
  return (
    <Scene start={5.3} end={T_HOLD} push={0.004}>
      <PlateHL x={0} y={8} w={480} h={870} id={id} p={p} />
      <div style={{ position: "absolute", left: 505, top: 8, width: 355, height: 870, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        {IDS.map((k) => {
          const on = id === k;
          const seen = t >= TF[k] - 0.05;
          return (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 10, height: 130, borderRadius: 26, padding: "0 12px", background: on ? C.forest : C.card, border: `4px solid ${on ? C.forest : C.line}`, opacity: seen ? 1 : 0.4, boxSizing: "border-box" }}>
              <Chip id={k} size={62} on={seen ? 1 : 0} hot={on} round />
              <div style={{ whiteSpace: "nowrap" }}>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 25, lineHeight: 1.1, color: on ? C.paper : C.forest }}>{NAME[k][0]}<br />{NAME[k][1]}</div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 19, marginTop: 4, color: on ? "#B9D27A" : C.matcha }}>{SUBSHORT[k]}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, width: 480, top: 890, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.forest, opacity: 0.65 }}>Gray's Anatomy (1918), Fig. 548 · public domain</div>
    </Scene>
  );
};

/* 4. Quick test with 3-2-1 */
export const V4: React.FC = () => {
  const t = useT();
  const s0 = T_HOLD;
  const cd: [number, number][] = [[26.82, 3], [27.46, 2], [28.1, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < 28.7) { n = v; n0 = s; } });
  return (
    <Scene start={s0} end={28.7}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, s0 + 0.02, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 42, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 30, width: 760, top: 120, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 60, lineHeight: 1.12, color: C.paper, ...pop(t, s0 + 0.12) }}>
          Which branch is the <span style={{ color: C.banana }}>BIGGEST</span>?
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 340, display: "flex", justifyContent: "center", gap: 10, alignItems: "center", ...pop(t, s0 + 1.2, 0.25) }}>
          {IDS.map((id) => <Chip key={id} id={id} size={100} />)}
        </div>
        {n !== null ? (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 520, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 210, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        ) : (
          <div style={{ position: "absolute", left: 0, width: 820, top: 600, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: "#B9D27A", opacity: ramp(t, 26.6, 26.8) }}>pause · say it out loud</div>
        )}
      </div>
    </Scene>
  );
};

/* 5. Answer */
export const V5: React.FC = () => {
  const t = useT();
  return (
    <Scene start={28.7} end={30.1} push={0.006}>
      <div style={center(34, pop(t, 28.72, 0.25))}>
        <Pill size={46} bg={C.banana} color={C.forest}>✓ ANSWER</Pill>
      </div>
      <div style={{ position: "absolute", left: 20, top: 150, width: 820, height: 640, borderRadius: 48, background: C.forest, ...pop(t, 28.75, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 60, display: "flex", justifyContent: "center", gap: 10, alignItems: "center" }}>
          {IDS.map((id) => (
            <div key={id} style={{ opacity: id === "PF" ? 1 : 0.35 }}><Chip id={id} size={100} on={1} hot={id === "PF"} /></div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 250, display: "flex", justifyContent: "center", opacity: ramp(t, 28.85, 29.1) }}>
          <div style={{ background: C.red, color: C.paper, borderRadius: 20, padding: "8px 24px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 62, textAlign: "center", lineHeight: 1.05 }}>PROFUNDA<br />FEMORIS</div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 470, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#B9D27A", opacity: ramp(t, 29.2, 29.45), lineHeight: 1.2 }}>deep artery of the thigh<br />the largest branch</div>
      </div>
    </Scene>
  );
};

/* 6. Save frame */
export const V6: React.FC = () => {
  const t = useT();
  const s0 = 30.1;
  const b = ramp(t, s0 + 0.05, s0 + 0.4);
  const row = (id: Id, base: number) => (
    <div key={id} style={{ display: "flex", alignItems: "center", gap: 14, height: 92, borderBottom: `2px solid ${C.line}`, opacity: ramp(t, s0 + 0.2 + base * 0.04, s0 + 0.4 + base * 0.04) }}>
      <Chip id={id} size={56} round />
      <div style={{ whiteSpace: "nowrap" }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.forest, lineHeight: 1.05 }}>{NAME[id].join(" ")}</div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, color: C.matcha, marginTop: 2 }}>{SUB[id]}</div>
      </div>
    </div>
  );
  return (
    <Scene start={s0} end={32.45}>
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
      <div style={{ position: "absolute", left: 30, top: 178, width: 800, height: 750, borderRadius: 40, background: C.card, border: `3px solid ${C.line}`, boxShadow: "0 18px 40px rgba(31,42,20,0.12)", padding: "10px 28px", boxSizing: "border-box", ...pop(t, s0 + 0.15, 0.3) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 27, color: C.forest, whiteSpace: "nowrap", marginBottom: 0 }}>Do Princesses Sew Sweet Superhero Dresses?</div>
        {IDS.map((id, i) => row(id, i))}
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.matcha, marginTop: 6, lineHeight: 1.2, opacity: ramp(t, s0 + 0.6, s0 + 0.8) }}>Six named branches (Kenhub). Gray's 1918 plate prints "pudic" for pudendal and "femoral profunda".</div>
      </div>
    </Scene>
  );
};

/* 7. End card — no store, no product */
export const V7: React.FC = () => {
  const t = useT();
  const s0 = 32.45;
  return (
    <Scene start={s0} end={33.9}>
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
