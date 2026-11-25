import React from "react";
import { Img, staticFile } from "remotion";
import { C, FONT, Pill, Scene, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, pop } from "./Scenes67";
import { PlateBox74 } from "./Scenes74";

export const P786 = "plates/cavern786.png";
export const A786 = 1116 / 726;
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* O C O A T: O = oculomotor, C = internal carotid, P = ophthalmic (second O), A = abducens, T = trochlear */
export type Id = "O" | "C" | "P" | "A" | "T";
export const IDS: Id[] = ["O", "C", "P", "A", "T"];
export const LET: Record<Id, string> = { O: "O", C: "C", P: "O", A: "A", T: "T" };
/* voice times (words.json): the letter ("O." "C." ...) */
export const TF: Record<Id, number> = { O: 4.81, C: 6.21, P: 7.96, A: 9.3, T: 10.53 };
export const TM: Record<Id, number> = { O: 4.95, C: 6.52, P: 8.22, A: 9.44, T: 10.66 };
const MT: Record<Id, number> = { O: 3.96, C: 4.17, P: 4.27, A: 4.36, T: 4.43 };
export const COL: Record<Id, string> = { O: "#C9483C", C: "#2F6B8F", P: "#7B4A9A", A: "#D9772B", T: "#5C7A2F" };
export const NAME: Record<Id, string[]> = {
  O: ["Oculomotor nerve"],
  C: ["Internal carotid", "artery"],
  P: ["Ophthalmic nerve"],
  A: ["Abducens nerve"],
  T: ["Trochlear nerve"],
};
export const NOTE: Record<Id, string> = {
  O: "CN III",
  C: "ICA",
  P: "V1 (trigeminal)",
  A: "CN VI",
  T: "CN IV",
};
const POS: Record<Id, string> = { O: "in the lateral wall · top", C: "inside the sinus", P: "in the lateral wall · lowest of 3", A: "inside the sinus · next to the artery", T: "in the lateral wall · middle" };
/* printed label boxes on the Gray plate (fractions of the plate image): x, y = centre, w, h */
const HL: Record<Id, [number, number, number, number]> = {
  O: [0.195, 0.225, 0.31, 0.068],
  C: [0.745, 0.046, 0.43, 0.058],
  P: [0.195, 0.437, 0.32, 0.066],
  A: [0.215, 0.518, 0.28, 0.058],
  T: [0.21, 0.305, 0.3, 0.064],
};
/* the structure itself on the plate: centre + radii as fractions of image width / height */
const RING: Record<Id, [number, number, number, number]> = {
  O: [0.452, 0.22, 0.036, 0.058],
  C: [0.573, 0.31, 0.1, 0.136],
  P: [0.399, 0.482, 0.038, 0.126],
  A: [0.464, 0.482, 0.03, 0.05],
  T: [0.421, 0.293, 0.026, 0.042],
};
const T_WALLGRP = 15.29; /* "The other three sit in its wall." */
const T_INSIDE = 12.39; /* "Only the artery and the abducens …" */
const T_HOLD = 17.2;

export const Chip: React.FC<{ id: Id; size?: number; on?: number; hot?: boolean; round?: boolean }> = ({ id, size = 70, on = 1, hot, round }) => (
  <div style={{ width: size, height: size, flex: `0 0 ${size}px`, borderRadius: round ? size / 2 : size * 0.28, background: on > 0.5 ? COL[id] : "rgba(31,42,20,0.08)", border: `4px solid ${on > 0.5 ? C.forest : "rgba(31,42,20,0.25)"}`, color: on > 0.5 ? C.paper : "rgba(31,42,20,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.6, transform: `scale(${hot ? 1.16 : 1})`, boxShadow: hot ? `0 0 0 6px ${C.banana}` : "none", boxSizing: "border-box", lineHeight: 1 }}>
    {LET[id]}
  </div>
);

/* which ids are lit at time t */
const lit = (t: number): Id[] => {
  if (t >= T_WALLGRP - 0.05) return ["O", "T", "P"];
  if (t >= T_INSIDE - 0.05) return ["C", "A"];
  const out: Id[] = [];
  let cur: Id | null = null;
  IDS.forEach((id) => { if (t >= TF[id] - 0.05) cur = id; });
  if (cur) out.push(cur);
  return out;
};
const litStart = (t: number, id: Id): number => {
  if (t >= T_WALLGRP - 0.05) return T_WALLGRP;
  if (t >= T_INSIDE - 0.05) return id === "C" ? T_INSIDE : 13.17;
  return TF[id];
};

/* strip of 5 chips */
const Strip: React.FC<{ t: number; top?: number }> = ({ t, top = 0 }) => {
  const L = lit(t);
  return (
    <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", alignItems: "center", gap: 12 }}>
      {IDS.map((id) => {
        const p = t >= T_INSIDE - 0.05 ? 1 : ramp(t, TF[id] - 0.05, TF[id] + 0.12);
        const hot = L.includes(id);
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
const PlateHL: React.FC<{ t: number; x: number; y: number; w: number; h: number }> = ({ t, x, y, w, h }) => {
  const iw = 920, ih = iw / A786;
  const L = w / 2 - 0.5 * iw, T = h / 2 - 0.5 * ih;
  const ids = lit(t);
  return (
    <>
      <div style={{ position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden", borderRadius: 40, background: C.paper, boxShadow: `0 0 0 5px ${C.line}, 0 20px 44px rgba(31,42,20,0.18)` }}>
        <Img src={staticFile(P786)} style={{ position: "absolute", left: L, top: T, width: iw, height: ih }} />
        {ids.map((id) => {
          const p = ramp(t, litStart(t, id) - 0.05, litStart(t, id) + 0.18);
          const b = HL[id], r = RING[id];
          return (
            <React.Fragment key={id}>
              <div style={{ position: "absolute", left: L + (b[0] - b[2] / 2) * iw - 8, top: T + (b[1] - b[3] / 2) * ih - 6, width: b[2] * iw + 16, height: b[3] * ih + 12, border: `8px solid ${COL[id]}`, borderRadius: 16, background: "rgba(255,214,10,0.28)", boxShadow: `0 0 0 4px ${C.paper}`, opacity: p, transform: `scale(${0.9 + 0.1 * p})` }} />
              <div style={{ position: "absolute", left: L + (r[0] - r[2]) * iw, top: T + (r[1] - r[3]) * ih, width: r[2] * 2 * iw, height: r[3] * 2 * ih, border: `9px solid ${COL[id]}`, borderRadius: "50%", boxShadow: `0 0 0 4px ${C.paper}, inset 0 0 0 4px ${C.paper}`, opacity: p, transform: `scale(${1.25 - 0.25 * p})` }} />
            </React.Fragment>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: y + h + 10, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.forest, opacity: 0.65 }}>Gray's Anatomy (1918), Fig. 786 · public domain</div>
    </>
  );
};

const NameCard: React.FC<{ t: number; top: number }> = ({ t, top }) => {
  if (t >= T_WALLGRP - 0.05) {
    const p = ramp(t, T_WALLGRP - 0.05, T_WALLGRP + 0.2);
    return (
      <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: C.forest, borderRadius: 30, padding: "12px 26px 16px", transform: `scale(${0.85 + 0.15 * p})`, opacity: p, boxShadow: "0 10px 0 rgba(31,42,20,0.15)", fontFamily: FONT, fontWeight: 800, color: C.paper, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 34, color: "#B9D27A" }}>WALL, top → bottom</span>
          {(["O", "T", "P"] as Id[]).map((id) => <Chip key={id} id={id} size={58} round />)}
          <span style={{ fontSize: 34 }}>3 · 4 · V1</span>
        </div>
      </div>
    );
  }
  if (t >= T_INSIDE - 0.05) {
    const p = ramp(t, T_INSIDE - 0.05, T_INSIDE + 0.2);
    return (
      <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: C.forest, borderRadius: 30, padding: "12px 28px 16px", transform: `scale(${0.85 + 0.15 * p})`, opacity: p, boxShadow: "0 10px 0 rgba(31,42,20,0.15)", fontFamily: FONT, fontWeight: 800, color: C.paper, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 36, color: "#B9D27A" }}>INSIDE THE SINUS</span>
          <Chip id="C" size={62} round />
          <span style={{ fontSize: 36 }}>+</span>
          <Chip id="A" size={62} round />
        </div>
      </div>
    );
  }
  let cur = -1;
  IDS.forEach((id, i) => { if (t >= TF[id] - 0.02) cur = i; });
  if (cur < 0) return null;
  const id = IDS[cur];
  const p = ramp(t, TF[id] - 0.02, TF[id] + 0.2);
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
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, color: "#B9D27A", marginTop: 2, whiteSpace: "nowrap" }}>{NOTE[id]} · {POS[id]}</div>
        </div>
      </div>
    </div>
  );
};

/* 1. Hook: Gray's 1918 Fig. 786 visible from frame 0 + challenge */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={3.2} push={0.02}>
      <div style={center(0, pop(t, -0.4, 0.25))}>
        <Big size={124}>NAME ALL 5</Big>
      </div>
      <div style={center(128, pop(t, -0.3, 0.25))}>
        <Big size={60} color={C.red}>CAVERNOUS SINUS</Big>
      </div>
      <PlateBox74 src={P786} aspect={A786} x={50} y={232} w={760} h={560} a={-0.6} b={3.2} from={[0.5, 0.5, 1.02]} to={[0.5, 0.5, 1.0]} credit="" />
      <div style={{ position: "absolute", left: 0, width: 860, top: 802, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.forest, opacity: 0.65 }}>Gray's Anatomy (1918), Fig. 786 · public domain</div>
      <div style={center(850, pop(t, 0.05, 0.25))}>
        <Pill size={36} bg={C.forest}>cavernous sinus · mnemonic</Pill>
      </div>
    </Scene>
  );
};

/* 2. The mnemonic card: Oh, COAT */
export const V2: React.FC = () => {
  const t = useT();
  const tagP = ramp(t, 4.3, 4.55);
  return (
    <Scene start={3.2} end={4.7} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, ...pop(t, 3.22, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: C.banana }}>CAVERNOUS SINUS</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 98, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#B9D27A" }}>just remember</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 230, display: "flex", justifyContent: "center", gap: 14 }}>
          {IDS.map((id) => {
            const p = ramp(t, MT[id] - 0.08, MT[id] + 0.12);
            return (
              <div key={id} style={{ opacity: 0.2 + 0.8 * p, transform: `translateY(${(1 - p) * 24}px)` }}>
                <div style={{ width: 138, height: 190, borderRadius: 32, background: p > 0.5 ? COL[id] : "rgba(247,246,236,0.14)", border: `5px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 124, color: C.paper, lineHeight: 1, paddingBottom: 8, boxSizing: "border-box" }}>{LET[id]}</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 490, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 96, color: C.paper, opacity: tagP }}>Oh, <span style={{ color: C.banana }}>COAT</span></div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 700, display: "flex", justifyContent: "center", opacity: tagP }}>
          <div style={{ background: C.banana, color: C.forest, borderRadius: 24, padding: "8px 30px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 50, whiteSpace: "nowrap" }}>5 main structures</div>
        </div>
      </div>
    </Scene>
  );
};

/* 3. Plate: label + structure ringed per letter + name card */
export const V3: React.FC = () => {
  const t = useT();
  return (
    <Scene start={4.7} end={T_HOLD} push={0.004}>
      <Strip t={t} top={0} />
      <PlateHL t={t} x={0} y={104} w={860} h={640} />
      <NameCard t={t} top={800} />
    </Scene>
  );
};

/* 4. Quick test with 3-2-1 */
export const V4: React.FC = () => {
  const t = useT();
  const s0 = T_HOLD;
  const cd: [number, number][] = [[21.58, 3], [22.21, 2], [22.85, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < 23.5) { n = v; n0 = s; } });
  return (
    <Scene start={s0} end={23.5}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, s0 + 0.02, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 42, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 30, width: 760, top: 110, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 54, lineHeight: 1.12, color: C.paper, ...pop(t, s0 + 0.3) }}>
          Which <span style={{ color: C.banana }}>CRANIAL NERVE</span> runs inside the sinus, beside the artery?
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 350, display: "flex", justifyContent: "center", gap: 12, alignItems: "center", ...pop(t, s0 + 1.6, 0.25) }}>
          {IDS.map((id) => <Chip key={id} id={id} size={84} />)}
        </div>
        {n !== null ? (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 560, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 190, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        ) : (
          <div style={{ position: "absolute", left: 0, width: 820, top: 640, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, color: "#B9D27A", opacity: ramp(t, 21.0, 21.2) }}>pause · say it out loud</div>
        )}
      </div>
    </Scene>
  );
};

/* 5. Answer */
export const V5: React.FC = () => {
  const t = useT();
  return (
    <Scene start={23.5} end={24.9} push={0.006}>
      <div style={center(34, pop(t, 23.52, 0.25))}>
        <Pill size={46} bg={C.banana} color={C.forest}>✓ THE A IN COAT</Pill>
      </div>
      <div style={{ position: "absolute", left: 20, top: 150, width: 820, height: 640, borderRadius: 48, background: C.forest, ...pop(t, 23.55, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 70, display: "flex", justifyContent: "center", gap: 12, alignItems: "center" }}>
          {IDS.map((id) => (
            <div key={id} style={{ opacity: id === "A" ? 1 : 0.4 }}><Chip id={id} size={84} on={1} hot={id === "A"} /></div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 250, display: "flex", justifyContent: "center", opacity: ramp(t, 23.7, 23.95) }}>
          <div style={{ background: C.red, color: C.paper, borderRadius: 20, padding: "8px 24px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 60, textAlign: "center", lineHeight: 1.05 }}>ABDUCENS<br />NERVE · CN VI</div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 490, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, color: "#B9D27A", opacity: ramp(t, 24.1, 24.35), lineHeight: 1.2 }}>inside the sinus<br />next to the carotid artery</div>
      </div>
    </Scene>
  );
};

/* 6. Save frame: the complete map */
export const V6: React.FC = () => {
  const t = useT();
  const s0 = 24.9;
  const b = ramp(t, s0 + 0.05, s0 + 0.4);
  const row = (id: Id, extra: string, base: number) => (
    <div key={id + extra} style={{ display: "flex", alignItems: "center", gap: 14, height: 66, borderBottom: `2px solid ${C.line}`, opacity: ramp(t, s0 + 0.2 + base * 0.04, s0 + 0.4 + base * 0.04) }}>
      <Chip id={id} size={50} round />
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.forest, whiteSpace: "nowrap" }}>{NAME[id].join(" ")}</div>
      <div style={{ marginLeft: "auto", fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.matcha, whiteSpace: "nowrap" }}>{extra}</div>
    </div>
  );
  const lab = (s: string, base: number) => (
    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.matcha, letterSpacing: 2, margin: "8px 0 4px", opacity: ramp(t, s0 + 0.2 + base * 0.04, s0 + 0.4 + base * 0.04) }}>{s}</div>
  );
  return (
    <Scene start={s0} end={27.2}>
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
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.forest, whiteSpace: "nowrap" }}>Oh, COAT = 5 main structures</div>
        {lab("IN THE LATERAL WALL · top → bottom", 0)}
        {row("O", "CN III", 0)}
        {row("T", "CN IV", 1)}
        {row("P", "V1", 2)}
        {lab("INSIDE THE SINUS", 4)}
        {row("C", "ICA", 4)}
        {row("A", "CN VI", 5)}
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, color: C.matcha, marginTop: 10, lineHeight: 1.2, opacity: ramp(t, s0 + 0.6, s0 + 0.8) }}>Maxillary nerve (V2): books differ, some put it just outside the wall.</div>
      </div>
    </Scene>
  );
};

/* 7. End card (≤ 1.5 s) — no store, no product */
export const V7: React.FC = () => {
  const t = useT();
  const s0 = 27.2;
  return (
    <Scene start={s0} end={28.5}>
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
