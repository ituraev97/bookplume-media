import React from "react";
import { Img, staticFile } from "remotion";
import { C, FONT, Pill, Scene, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, pop } from "./Scenes67";

export const P548 = "plates/oph514.png";
export const A548 = 1814 / 1498;
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });


/* Smart Little Pipes Supply All My Sight's Demands — Radiopaedia: S L P S A M S D */
export type Id = "SC" | "LC" | "PE" | "SO" | "AE" | "MP" | "ST" | "DN";
export const IDS: Id[] = ["SC", "LC", "PE", "SO", "AE", "MP", "ST", "DN"];
export const LET: Record<Id, string> = { SC: "S", LC: "L", PE: "P", SO: "S", AE: "A", MP: "M", ST: "S", DN: "D" };
export const TF: Record<Id, number> = { SC: 5.59, LC: 8.36, PE: 10.92, SO: 13.5, AE: 14.96, MP: 17.24, ST: 19.48, DN: 21.77 };
const MT: Record<Id, number> = { SC: 2.91, LC: 3.19, PE: 3.53, SO: 3.82, AE: 4.16, MP: 4.33, ST: 4.44, DN: 4.84 };
export const COL: Record<Id, string> = { SC: "#C9483C", LC: "#2F6B8F", PE: "#7B4A9A", SO: "#D9772B", AE: "#5C7A2F", MP: "#B03A78", ST: "#1F7A6D", DN: "#8A6D12" };
export const NAME: Record<Id, string> = {
  SC: "Short posterior ciliary",
  LC: "Long posterior ciliary",
  PE: "Posterior ethmoidal",
  SO: "Supraorbital",
  AE: "Anterior ethmoidal",
  MP: "Medial palpebral",
  ST: "Supratrochlear",
  DN: "Dorsal nasal",
};
export const SUB: Record<Id, string> = {
  SC: "sclera · choroid",
  LC: "joins the arterial circle of the iris",
  PE: "nasal septum · ethmoid cells",
  SO: "forehead skin · muscles",
  AE: "lateral nasal wall · septum",
  MP: "upper + lower eyelid",
  ST: "terminal · forehead skin",
  DN: "terminal · dorsum of the nose",
};
const SUBSHORT: Record<Id, string> = { ...SUB, SC: "sclera · choroid (plate: 'Ciliary')", LC: "iris circle (plate: 'Ciliary')" };
/* printed labels on the Gray plate (fractions of the plate image): centre x, y, w, h */
const HL: Partial<Record<Id, [number, number, number, number]>> = {
  SC: [0.545, 0.495, 0.115, 0.034],
  LC: [0.545, 0.495, 0.115, 0.034],
  PE: [0.133, 0.592, 0.215, 0.042],
  SO: [0.625, 0.07, 0.145, 0.042],
  AE: [0.135, 0.418, 0.215, 0.042],
  MP: [0.545, 0.033, 0.19, 0.042],
  DN: [0.343, 0.033, 0.14, 0.042],
};
/* the artery branch on the plate: centre + radii as fractions of the plate width / height */
const RING: Record<Id, [number, number, number, number]> = {
  SC: [0.5, 0.57, 0.06, 0.06],
  LC: [0.6, 0.55, 0.045, 0.07],
  PE: [0.355, 0.6, 0.045, 0.045],
  SO: [0.64, 0.16, 0.05, 0.035],
  AE: [0.385, 0.42, 0.045, 0.045],
  MP: [0.528, 0.15, 0.022, 0.045],
  ST: [0.47, 0.155, 0.03, 0.03],
  DN: [0.385, 0.14, 0.045, 0.04],
};
const T_HOLD = 24.3;
const T_ANS = 28.3;
const T_SAVE = 30.45;
const T_END = 32.95;

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

/* Gray 1918 Fig. 514: frame round the printed label + ring on the branch being named */
export const PlateHL: React.FC<{ x: number; y: number; w: number; h: number; id: Id | null; p?: number; all?: boolean }> = ({ x, y, w, h, id, p = 1, all }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden", borderRadius: 30, background: C.paper, boxShadow: `0 0 0 5px ${C.line}, 0 20px 44px rgba(31,42,20,0.18)` }}>
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

/* 1. Hook: Gray's Fig. 514 visible from frame 0 */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={2.86} push={0}>
      <div style={center(8, pop(t, -0.4, 0.25))}>
        <Big size={118}>NAME ALL 8</Big>
      </div>
      <div style={center(128, pop(t, -0.3, 0.25))}>
        <Big size={52} color={C.red}>OPHTHALMIC ARTERY BRANCHES</Big>
      </div>
      <PlateHL x={50} y={206} w={760} h={Math.round(760 / A548)} id={null} />
      <div style={{ position: "absolute", left: 0, width: 860, top: 842, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.forest, opacity: 0.65 }}>Gray's Anatomy (1918), Fig. 514 · public domain</div>
      <div style={center(876, pop(t, 0.05, 0.25))}>
        <Pill size={34} bg={C.forest}>ophthalmic artery · mnemonic</Pill>
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
    <Scene start={2.86} end={5.45} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, ...pop(t, 2.9, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 32, letterSpacing: 3, color: C.banana }}>OPHTHALMIC ARTERY · 8 BRANCHES</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 98, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: "#B9D27A", opacity: ramp(t, 2.95, 3.15) }}>one letter per branch</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 170, display: "flex", justifyContent: "center", gap: 10 }}>
          {IDS.map((id) => {
            const p = ramp(t, MT[id] - 0.08, MT[id] + 0.12);
            return (
              <div key={id} style={{ opacity: 0.2 + 0.8 * p, transform: `translateY(${(1 - p) * 24}px)` }}>
                <div style={{ width: 86, height: 120, borderRadius: 20, background: p > 0.5 ? COL[id] : "rgba(247,246,236,0.14)", border: `5px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 70, color: C.paper, lineHeight: 1, paddingBottom: 6, boxSizing: "border-box" }}>{LET[id]}</div>
              </div>
            );
          })}
        </div>
        {line([["Smart", 2.91], ["Little", 3.19], ["Pipes", 3.53]], 340)}
        {line([["Supply", 3.82], ["All", 4.16], ["My", 4.33]], 450)}
        {line([["Sight's", 4.44], ["Demands", 4.84]], 560)}
        <div style={{ position: "absolute", left: 0, width: 820, top: 700, display: "flex", justifyContent: "center", opacity: ramp(t, 5.0, 5.2) }}>
          <div style={{ background: C.banana, color: C.forest, borderRadius: 24, padding: "8px 28px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 40, whiteSpace: "nowrap" }}>S-L-P-S-A-M-S-D · 8 branches</div>
        </div>
      </div>
    </Scene>
  );
};

/* 3. Plate (top) + letter strip + current branch banner */
export const V3: React.FC = () => {
  const t = useT();
  const id = cur(t);
  const p = id ? ramp(t, TF[id] - 0.05, TF[id] + 0.18) : 0;
  const PH = Math.round(860 / A548);
  return (
    <Scene start={5.45} end={T_HOLD} push={0.004}>
      <PlateHL x={0} y={4} w={860} h={PH} id={id} p={p} />
      <div style={{ position: "absolute", left: 8, top: PH + 20, width: 844, display: "flex", justifyContent: "space-between" }}>
        {IDS.map((k) => {
          const seen = t >= TF[k] - 0.05;
          return <Chip key={k} id={k} size={88} on={seen ? 1 : 0} hot={id === k} />;
        })}
      </div>
      {id && (
        <div style={{ position: "absolute", left: 0, width: 860, top: PH + 124, height: 84, borderRadius: 26, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.paper, lineHeight: 1.05, whiteSpace: "nowrap" }}><span style={{ color: C.banana }}>{LET[id]}</span> · {NAME[id]}</div>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, color: "#B9D27A", marginTop: 2, whiteSpace: "nowrap" }}>{SUBSHORT[id]}</div>
        </div>
      )}
    </Scene>
  );
};

/* 4. Quick test with 3-2-1 */
export const V4: React.FC = () => {
  const t = useT();
  const s0 = T_HOLD;
  const cd: [number, number][] = [[26.42, 3], [27.08, 2], [27.71, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < T_ANS) { n = v; n0 = s; } });
  return (
    <Scene start={s0} end={T_ANS}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, s0 + 0.02, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 42, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 30, width: 760, top: 120, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 60, lineHeight: 1.12, color: C.paper, ...pop(t, s0 + 0.12) }}>
          Which <span style={{ color: C.banana }}>TWO</span> are <span style={{ color: C.banana }}>TERMINAL</span>?
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 340, display: "flex", justifyContent: "center", gap: 10, alignItems: "center", ...pop(t, s0 + 1.2, 0.25) }}>
          {IDS.map((id) => <Chip key={id} id={id} size={82} />)}
        </div>
        {n !== null ? (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 520, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 210, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        ) : (
          <div style={{ position: "absolute", left: 0, width: 820, top: 600, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: "#B9D27A", opacity: ramp(t, 26.2, 26.4) }}>pause · say it out loud</div>
        )}
      </div>
    </Scene>
  );
};

/* 5. Answer */
export const V5: React.FC = () => {
  const t = useT();
  return (
    <Scene start={T_ANS} end={T_SAVE} push={0.006}>
      <div style={center(34, pop(t, T_ANS + 0.02, 0.25))}>
        <Pill size={46} bg={C.banana} color={C.forest}>✓ ANSWER</Pill>
      </div>
      <div style={{ position: "absolute", left: 20, top: 150, width: 820, height: 700, borderRadius: 48, background: C.forest, ...pop(t, T_ANS + 0.05, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 50, display: "flex", justifyContent: "center", gap: 10, alignItems: "center" }}>
          {IDS.map((id) => (
            <div key={id} style={{ opacity: id === "ST" || id === "DN" ? 1 : 0.35 }}><Chip id={id} size={82} on={1} hot={id === "ST" || id === "DN"} /></div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 220, display: "flex", justifyContent: "center", opacity: ramp(t, T_ANS + 0.15, T_ANS + 0.4) }}>
          <div style={{ background: C.red, color: C.paper, borderRadius: 20, padding: "8px 24px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 58, textAlign: "center", lineHeight: 1.05 }}>SUPRATROCHLEAR</div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 340, display: "flex", justifyContent: "center", opacity: ramp(t, T_ANS + 0.5, T_ANS + 0.75) }}>
          <div style={{ background: C.red, color: C.paper, borderRadius: 20, padding: "8px 24px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 58, textAlign: "center", lineHeight: 1.05 }}>DORSAL NASAL</div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 520, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#B9D27A", opacity: ramp(t, T_ANS + 0.8, T_ANS + 1.05), lineHeight: 1.2 }}>the two terminal branches<br />of the ophthalmic artery</div>
      </div>
    </Scene>
  );
};

/* 6. Save frame */
export const V6: React.FC = () => {
  const t = useT();
  const s0 = T_SAVE;
  const b = ramp(t, s0 + 0.05, s0 + 0.4);
  const row = (id: Id, base: number) => (
    <div key={id} style={{ display: "flex", alignItems: "center", gap: 14, height: 78, borderBottom: `2px solid ${C.line}`, opacity: ramp(t, s0 + 0.2 + base * 0.04, s0 + 0.4 + base * 0.04) }}>
      <Chip id={id} size={52} round />
      <div style={{ whiteSpace: "nowrap" }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.forest, lineHeight: 1.05 }}>{NAME[id]}</div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 21, color: C.matcha, marginTop: 2 }}>{SUB[id]}</div>
      </div>
    </div>
  );
  return (
    <Scene start={s0} end={T_END}>
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
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 27, color: C.forest, whiteSpace: "nowrap", marginBottom: 0 }}>Smart Little Pipes Supply All My Sight's Demands</div>
        {IDS.map((id, i) => row(id, i))}
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.matcha, marginTop: 6, lineHeight: 1.2, whiteSpace: "nowrap", opacity: ramp(t, s0 + 0.7, s0 + 0.9) }}>Not in the mnemonic: central retinal, lacrimal, muscular.</div>
      </div>
    </Scene>
  );
};

/* 7. End card — no store, no product */
export const V7: React.FC = () => {
  const t = useT();
  const s0 = T_END;
  return (
    <Scene start={s0} end={s0 + 1.45}>
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
