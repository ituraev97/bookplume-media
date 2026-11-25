import React from "react";
import { Img, staticFile } from "remotion";
import { C, FONT, Pill, Scene, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, pop } from "./Scenes67";
import { PlateBox74 } from "./Scenes74";

export const P787 = "plates/orbit787.png";
export const A787 = 1364 / 1316;
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

export type Id = "L" | "F" | "T" | "V" | "S" | "A" | "N" | "I";
export const IDS: Id[] = ["L", "F", "T", "V", "S", "A", "N", "I"];
export const LET: Record<Id, string> = { L: "L", F: "F", T: "T", V: "S", S: "S", A: "A", N: "N", I: "I" };
/* voice times (words.json): the letter */
export const TF: Record<Id, number> = { L: 7.54, F: 8.77, T: 9.91, V: 11.15, S: 14.24, A: 16.8, N: 18.04, I: 19.56 };
export const TM: Record<Id, number> = { L: 7.67, F: 8.95, T: 10.04, V: 11.32, S: 14.4, A: 16.94, N: 18.18, I: 19.7 };
const GRP: Record<Id, 1 | 2> = { L: 1, F: 1, T: 1, V: 1, S: 2, A: 2, N: 2, I: 2 };
export const COL: Record<Id, string> = { L: "#C9483C", F: "#C99A12", T: "#5C7A2F", V: "#2F6B8F", S: "#7B4A9A", A: "#D9772B", N: "#2A8C82", I: "#8A5A3C" };
export const NAME: Record<Id, string[]> = {
  L: ["Lacrimal nerve"],
  F: ["Frontal nerve"],
  T: ["Trochlear nerve"],
  V: ["Superior ophthalmic vein"],
  S: ["Superior division of", "oculomotor nerve"],
  A: ["Abducens nerve"],
  N: ["Nasociliary nerve"],
  I: ["Inferior division of", "oculomotor nerve"],
};
export const NOTE: Record<Id, string> = {
  L: "CN V1 branch",
  F: "CN V1 branch",
  T: "CN IV",
  V: "a vein · not drawn on this nerve plate",
  S: "CN III",
  A: "CN VI",
  N: "CN V1 branch",
  I: "CN III",
};
/* printed label boxes on the Gray plate (fractions of the plate image): x, y = centre, w, h */
const HL: Partial<Record<Id, [number, number, number, number]>> = {
  L: [0.262, 0.19, 0.235, 0.05],
  F: [0.462, 0.071, 0.2, 0.05],
  T: [0.812, 0.109, 0.22, 0.05],
  S: [0.247, 0.106, 0.465, 0.05],
  A: [0.123, 0.886, 0.225, 0.05],
  N: [0.785, 0.073, 0.245, 0.05],
  I: [0.178, 0.968, 0.36, 0.085],
};
const T_HOLD = 21.95;
const MT: Record<Id, number> = { L: 4.41, F: 4.59, T: 4.74, V: 5.01, S: 5.4, A: 5.6, N: 5.67, I: 5.86 };

export const Chip: React.FC<{ id: Id; size?: number; on?: number; hot?: boolean; round?: boolean }> = ({ id, size = 70, on = 1, hot, round }) => (
  <div style={{ width: size, height: size, flex: `0 0 ${size}px`, borderRadius: round ? size / 2 : size * 0.28, background: on > 0.5 ? COL[id] : "rgba(31,42,20,0.08)", border: `4px solid ${on > 0.5 ? C.forest : "rgba(31,42,20,0.25)"}`, color: on > 0.5 ? C.paper : "rgba(31,42,20,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.6, transform: `scale(${hot ? 1.16 : 1})`, boxShadow: hot ? `0 0 0 6px ${C.banana}` : "none", boxSizing: "border-box", lineHeight: 1 }}>
    {LET[id]}
  </div>
);

/* strip of 8 chips: LFTS | SANI */
const Strip: React.FC<{ t: number; top?: number; allOn?: boolean }> = ({ t, top = 0, allOn }) => {
  let cur = -1;
  IDS.forEach((id, i) => { if (t >= TF[id] - 0.05 && t < T_HOLD) cur = i; });
  return (
    <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}>
      {IDS.map((id, i) => {
        const p = allOn ? 1 : ramp(t, TF[id] - 0.05, TF[id] + 0.12);
        return (
          <React.Fragment key={id}>
            {i === 4 && <div style={{ width: 8, height: 54, borderRadius: 4, background: C.forest, opacity: 0.35, margin: "0 8px" }} />}
            <div style={{ transform: `scale(${1 + 0.2 * p * (1 - ramp(t, TF[id] + 0.12, TF[id] + 0.4))})` }}>
              <Chip id={id} size={72} on={p} hot={cur === i} />
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

/* Gray plate with a red frame round the printed label of the structure being named */
const PlateHL: React.FC<{ t: number; x: number; y: number; w: number; h: number; a: number; b: number }> = ({ t, x, y, w, h, a, b }) => {
  if (t < a - 0.3 || t > b + 0.5) return null;
  return <><PlateHL0 t={t} x={x} y={y} w={w} h={h} />
    <div style={{ position: "absolute", left: 0, width: 860, top: y + h + 8, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.forest, opacity: 0.65 }}>Gray's Anatomy (1918), Fig. 787 · public domain</div></>;
};
const PlateHL0: React.FC<{ t: number; x: number; y: number; w: number; h: number }> = ({ t, x, y, w, h }) => {
  const zw = 1.2, cx = 0.5, cy = 0.5;
  const iw = w / zw, ih = iw / A787;
  const L = w / 2 - cx * iw, T = h / 2 - cy * ih;
  let cur: Id | null = null;
  IDS.forEach((id) => { if (t >= TF[id] - 0.05 && t < T_HOLD) cur = id; });
  const box = cur ? HL[cur] : undefined;
  const p = cur ? ramp(t, TF[cur] - 0.05, TF[cur] + 0.18) : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden", borderRadius: 40, background: C.paper, boxShadow: `0 0 0 5px ${C.line}, 0 20px 44px rgba(31,42,20,0.18)` }}>
      <Img src={staticFile(P787)} style={{ position: "absolute", left: L, top: T, width: iw, height: ih }} />
      {box && cur && (
        <div key={cur} style={{ position: "absolute", left: L + (box[0] - box[2] / 2) * iw - 10, top: T + (box[1] - box[3] / 2) * ih - 8, width: box[2] * iw + 20, height: box[3] * ih + 16, border: `8px solid ${COL[cur]}`, borderRadius: 16, background: "rgba(255,214,10,0.28)", boxShadow: `0 0 0 4px ${C.paper}`, opacity: p, transform: `scale(${0.9 + 0.1 * p})` }} />
      )}
    </div>
  );
};

const NameCard: React.FC<{ t: number; top: number }> = ({ t, top }) => {
  if (t >= T_HOLD - 0.05) {
    const p = ramp(t, T_HOLD - 0.05, T_HOLD + 0.2);
    return (
      <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center" }}>
        <div style={{ background: C.forest, borderRadius: 30, padding: "14px 30px 16px", transform: `scale(${0.85 + 0.15 * p})`, opacity: p, boxShadow: "0 10px 0 rgba(31,42,20,0.15)", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper, whiteSpace: "nowrap" }}>
          <span style={{ color: C.banana }}>4</span> outside + <span style={{ color: C.banana }}>4</span> inside = <span style={{ color: C.banana }}>8</span>
        </div>
      </div>
    );
  }
  let cur = -1;
  IDS.forEach((id, i) => { if (t >= TF[id] - 0.02) cur = i; });
  if (cur < 0) {
    const g = t >= 6.55 ? 1 : 0;
    const p = ramp(t, 6.5, 6.8);
    return g ? (
      <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center" }}>
        <div style={{ background: C.forest, borderRadius: 30, padding: "14px 30px 18px", opacity: p, transform: `scale(${0.85 + 0.15 * p})`, fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper, whiteSpace: "nowrap" }}>outside the ring · L F T S</div>
      </div>
    ) : null;
  }
  const id = IDS[cur];
  const p = ramp(t, TF[id] - 0.02, TF[id] + 0.2);
  const grp = GRP[id] === 1 ? "OUTSIDE THE RING" : "INSIDE THE RING";
  return (
    <div key={cur} style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, background: C.forest, borderRadius: 30, padding: "12px 28px 14px 14px", transform: `scale(${0.85 + 0.15 * p})`, opacity: p, boxShadow: "0 10px 0 rgba(31,42,20,0.15)" }}>
        <Chip id={id} size={84} round />
        <div style={{ opacity: ramp(t, TM[id] - 0.1, TM[id] + 0.1, 0.3, 1) }}>
          {NAME[id].map((nm, i) => (
            <div key={i} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.paper, lineHeight: 1.08, whiteSpace: "nowrap" }}>
              {i === 0 ? <span style={{ background: C.banana, color: C.forest, borderRadius: 8, padding: "0 5px 2px" }}>{nm[0]}</span> : null}
              {i === 0 ? nm.slice(1) : nm}
            </div>
          ))}
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, color: "#B9D27A", marginTop: 2, whiteSpace: "nowrap" }}>{NOTE[id]} · {grp.toLowerCase()}</div>
        </div>
      </div>
    </div>
  );
};

/* 1. Hook: Gray's 1918 Fig. 787 visible from frame 0 + challenge */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={3.3} push={0.02}>
      <div style={center(0, pop(t, -0.4, 0.25))}>
        <Big size={124}>NAME ALL 8</Big>
      </div>
      <div style={center(128, pop(t, -0.3, 0.25))}>
        <Big size={64} color={C.red}>ORBITAL FISSURE</Big>
      </div>
      <PlateBox74 src={P787} aspect={A787} x={90} y={222} w={680} h={640} a={-0.6} b={3.3} from={[0.5, 0.5, 1.06]} to={[0.5, 0.5, 1.04]} credit="" />
      <div style={{ position: "absolute", left: 0, width: 860, top: 870, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.forest, opacity: 0.65 }}>Gray's Anatomy (1918), Fig. 787 · public domain</div>
      <div style={center(908, pop(t, 0.05, 0.25))}>
        {t < 1.9 ? <Pill size={34} bg={C.forest}>superior orbital fissure · mnemonic</Pill> : (
          <div style={{ ...pop(t, 1.92, 0.25) }}><Pill size={40} bg={C.banana} color={C.forest}>2 codes: L F T S + S A N I</Pill></div>
        )}
      </div>
    </Scene>
  );
};

/* 2. The mnemonic card */
export const V2: React.FC = () => {
  const t = useT();
  const tagP = ramp(t, 6.15, 6.4);
  const row = (ids: Id[], top: number, tag: string) => (
    <>
      <div style={{ position: "absolute", left: 0, width: 820, top, display: "flex", justifyContent: "center", gap: 18 }}>
        {ids.map((id) => {
          const p = ramp(t, MT[id] - 0.08, MT[id] + 0.12);
          return (
            <div key={id} style={{ opacity: 0.2 + 0.8 * p, transform: `translateY(${(1 - p) * 24}px)` }}>
              <div style={{ width: 150, height: 170, borderRadius: 34, background: p > 0.5 ? COL[id] : "rgba(247,246,236,0.14)", border: `5px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 124, color: C.paper, lineHeight: 1, paddingBottom: 8, boxSizing: "border-box" }}>{LET[id]}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, width: 820, top: top + 186, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#B9D27A", opacity: tagP }}>{tag}</div>
    </>
  );
  return (
    <Scene start={3.3} end={6.5} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, ...pop(t, 3.32, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: C.banana }}>ORBITAL FISSURE</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 98, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#B9D27A" }}>two short codes</div>
        {row(["L", "F", "T", "V"], 190, "outside the ring")}
        {row(["S", "A", "N", "I"], 480, "inside the ring")}
        <div style={{ position: "absolute", left: 0, width: 820, top: 770, display: "flex", justifyContent: "center", opacity: tagP }}>
          <div style={{ background: C.banana, color: C.forest, borderRadius: 24, padding: "8px 30px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 50, whiteSpace: "nowrap" }}>4 + 4 = 8</div>
        </div>
      </div>
    </Scene>
  );
};

/* 3. Plate: one printed label framed per letter + name card */
export const V3: React.FC = () => {
  const t = useT();
  return (
    <Scene start={6.5} end={22.0} push={0.004}>
      <Strip t={t} top={0} />
      <PlateHL t={t} x={0} y={86} w={860} h={724} a={6.5} b={22.0} />
      <NameCard t={t} top={850} />
    </Scene>
  );
};

/* 4. Quick test with 3-2-1 */
export const V4: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[24.03, 3], [24.66, 2], [25.3, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < 25.98) { n = v; n0 = s; } });
  return (
    <Scene start={22.0} end={25.98}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 22.02, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 42, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 30, width: 760, top: 110, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 62, lineHeight: 1.1, color: C.paper, ...pop(t, 22.3) }}>
          Which one of the eight is the <span style={{ color: C.banana }}>VEIN?</span>
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 330, display: "flex", justifyContent: "center", gap: 10, alignItems: "center", ...pop(t, 22.9, 0.25) }}>
          {IDS.map((id, i) => (
            <React.Fragment key={id}>
              {i === 4 && <div style={{ width: 6, height: 54, borderRadius: 3, background: C.paper, opacity: 0.35, margin: "0 6px" }} />}
              <Chip id={id} size={78} />
            </React.Fragment>
          ))}
        </div>
        {n !== null ? (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 560, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 190, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        ) : (
          <div style={{ position: "absolute", left: 0, width: 820, top: 640, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, color: "#B9D27A", opacity: ramp(t, 23.8, 24.0) }}>pause · say it out loud</div>
        )}
      </div>
    </Scene>
  );
};

/* 5. Answer */
export const V5: React.FC = () => {
  const t = useT();
  return (
    <Scene start={25.98} end={27.9} push={0.006}>
      <div style={center(34, pop(t, 26.0, 0.25))}>
        <Pill size={46} bg={C.banana} color={C.forest}>✓ THE S IN L F T S</Pill>
      </div>
      <div style={{ position: "absolute", left: 20, top: 150, width: 820, height: 640, borderRadius: 48, background: C.forest, ...pop(t, 26.05, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 70, display: "flex", justifyContent: "center", gap: 10, alignItems: "center" }}>
          {IDS.map((id, i) => (
            <React.Fragment key={id}>
              {i === 4 && <div style={{ width: 6, height: 54, borderRadius: 3, background: C.paper, opacity: 0.35, margin: "0 6px" }} />}
              <div style={{ opacity: id === "V" ? 1 : 0.4 }}><Chip id={id} size={78} on={1} hot={id === "V"} /></div>
            </React.Fragment>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 250, display: "flex", justifyContent: "center", opacity: ramp(t, 26.3, 26.55) }}>
          <div style={{ background: C.red, color: C.paper, borderRadius: 20, padding: "8px 24px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 56, textAlign: "center", lineHeight: 1.05 }}>SUPERIOR<br />OPHTHALMIC VEIN</div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 490, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, color: "#B9D27A", opacity: ramp(t, 26.9, 27.15), lineHeight: 1.2 }}>the only vein of the eight<br />the other seven are nerves</div>
      </div>
    </Scene>
  );
};

/* 6. Save frame: the complete map */
export const V6: React.FC = () => {
  const t = useT();
  const s0 = 27.9;
  const b = ramp(t, s0 + 0.05, s0 + 0.4);
  const grp = (g: 1 | 2, label: string, ids: Id[], base: number) => (
    <div style={{ opacity: ramp(t, s0 + 0.2 + base * 0.04, s0 + 0.4 + base * 0.04) }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.matcha, letterSpacing: 2, margin: "6px 0 4px" }}>{label}</div>
      {ids.map((id) => (
        <div key={id} style={{ display: "flex", alignItems: "center", gap: 14, height: 66, borderBottom: `2px solid ${C.line}` }}>
          <Chip id={id} size={50} round />
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.forest, whiteSpace: "nowrap" }}>{NAME[id].join(" ")}</div>
          <div style={{ marginLeft: "auto", fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.matcha, whiteSpace: "nowrap" }}>{id === "V" ? "vein" : NOTE[id]}</div>
        </div>
      ))}
    </div>
  );
  return (
    <Scene start={s0} end={30.1}>
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
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.forest, whiteSpace: "nowrap" }}>L F T S · S A N I = 8 structures</div>
        {grp(1, "OUTSIDE THE RING · L F T S", ["L", "F", "T", "V"], 0)}
        {grp(2, "INSIDE THE RING · S A N I", ["S", "A", "N", "I"], 4)}
      </div>
    </Scene>
  );
};

/* 7. End card (≤ 1.5 s) — no store, no product */
export const V7: React.FC = () => {
  const t = useT();
  const s0 = 30.1;
  return (
    <Scene start={s0} end={31.4}>
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
