import React from "react";
import { Img, staticFile } from "remotion";
import { C, FONT, Pill, Scene, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, pop } from "./Scenes67";

export const P941 = "plates/epi941.png";
export const A941 = 1030 / 1259;
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* Come, Let's Get Sun Burned: the 5 layers of the epidermis, top → bottom */
export type Id = "C" | "L" | "G" | "S" | "B";
export const IDS: Id[] = ["C", "L", "G", "S", "B"];
export const TF: Record<Id, number> = { C: 5.28, L: 7.92, G: 11.0, S: 14.03, B: 17.24 };
export const TM: Record<Id, number> = { C: 5.45, L: 8.06, G: 11.16, S: 14.18, B: 17.38 };
const MT: number[] = [3.58, 3.86, 4.09, 4.25, 4.52];
export const COL: Record<Id, string> = { C: "#C9483C", L: "#2F6B8F", G: "#7B4A9A", S: "#D9772B", B: "#5C7A2F" };
export const NAME: Record<Id, string> = { C: "Corneum", L: "Lucidum", G: "Granulosum", S: "Spinosum", B: "Basale" };
export const SUB: Record<Id, string> = {
  C: "dead, flat cells on top",
  L: "thin, clear · thick skin only",
  G: "keratohyalin granules",
  S: "prickly · 1918: stratum mucosum",
  B: "stem cells · 1918: stratum germinativum",
};
export const SAVEROW: Record<Id, string> = {
  C: "dead, flat cells on top",
  L: "clear · thick skin only",
  G: "keratohyalin granules",
  S: "prickly, desmosomes",
  B: "stem cells divide",
};
/* layer bands on the plate (fractions of the plate height, measured on the Gray crop) */
const BAND: Record<Id, [number, number]> = { C: [0.0, 0.26], L: [0.26, 0.325], G: [0.325, 0.38], S: [0.38, 0.83], B: [0.83, 1.0] };
const T_HOLD = 19.6;
const LET: Record<Id, string> = { C: "C", L: "L", G: "G", S: "S", B: "B" };

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
    <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
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

/* Gray 1918 Fig. 941 card: the drawing, a colour band on the current layer */
export const PlateCard: React.FC<{ x: number; y: number; w: number; h: number; id: Id | null; p?: number; all?: boolean }> = ({ x, y, w, h, id, p = 1, all }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden", borderRadius: 36, background: C.paper, boxShadow: `0 0 0 5px ${C.line}, 0 20px 44px rgba(31,42,20,0.18)` }}>
    <Img src={staticFile(P941)} style={{ position: "absolute", left: 0, top: 0, width: w, height: h }} />
    {(all ? IDS : id ? [id] : []).map((k) => {
      const [a, b] = BAND[k];
      return (
        <div key={k} style={{ position: "absolute", left: 6, width: w - 12, top: a * h + 3, height: Math.max(26, (b - a) * h - 6), border: `8px solid ${COL[k]}`, borderRadius: 18, background: `${COL[k]}33`, boxShadow: `0 0 0 3px ${C.paper}`, opacity: all ? 0.95 : p, boxSizing: "border-box" }}>
          {all && <div style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)" }}><Chip id={k} size={46} round /></div>}
        </div>
      );
    })}
  </div>
);

const NameCard: React.FC<{ t: number; top: number }> = ({ t, top }) => {
  const id = cur(t);
  if (!id) return null;
  const p = ramp(t, TF[id] - 0.02, TF[id] + 0.2);
  return (
    <div key={id} style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, background: C.forest, borderRadius: 30, padding: "12px 28px 14px 14px", transform: `scale(${0.85 + 0.15 * p})`, opacity: p, boxShadow: "0 10px 0 rgba(31,42,20,0.15)" }}>
        <Chip id={id} size={84} round />
        <div style={{ opacity: ramp(t, TM[id] - 0.1, TM[id] + 0.1, 0.3, 1) }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.paper, lineHeight: 1.08, whiteSpace: "nowrap" }}>
            <span style={{ background: C.banana, color: C.forest, borderRadius: 8, padding: "0 5px 2px" }}>{NAME[id][0]}</span>
            {NAME[id].slice(1)}
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, color: "#B9D27A", marginTop: 2, whiteSpace: "nowrap" }}>{SUB[id]}</div>
        </div>
      </div>
    </div>
  );
};

/* 1. Hook: Gray's Fig. 941 visible from frame 0 */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={2.35} push={0}>
      <div style={center(18, pop(t, -0.4, 0.25))}>
        <Big size={124}>NAME ALL 5</Big>
      </div>
      <div style={center(146, pop(t, -0.3, 0.25))}>
        <Big size={54} color={C.red}>EPIDERMIS LAYERS</Big>
      </div>
      <PlateCard x={170} y={250} w={440 + 100} h={Math.round(540 * 1.0)} id={null} />
      <div style={{ position: "absolute", left: 0, width: 860, top: 802, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.forest, opacity: 0.65 }}>Gray's Anatomy (1918), Fig. 941 · public domain</div>
      <div style={center(850, pop(t, 0.05, 0.25))}>
        <Pill size={34} bg={C.forest}>epidermis · mnemonic</Pill>
      </div>
    </Scene>
  );
};

/* 2. The mnemonic card */
export const V2: React.FC = () => {
  const t = useT();
  const w1 = [["Come,", 0], ["Let's", 1]] as const;
  const w2 = [["Get", 2], ["Sun", 3], ["Burned", 4]] as const;
  const line = (ws: readonly (readonly [string, number])[], top: number) => (
    <div style={{ position: "absolute", left: 0, width: 820, top, display: "flex", justifyContent: "center", gap: 26, fontFamily: FONT, fontWeight: 800, fontSize: 96, color: C.paper, whiteSpace: "nowrap" }}>
      {ws.map(([w, i]) => {
        const p = ramp(t, MT[i] - 0.08, MT[i] + 0.12);
        return (
          <span key={w} style={{ opacity: 0.15 + 0.85 * p, transform: `translateY(${(1 - p) * 20}px)` }}>
            <span style={{ color: C.banana }}>{w[0]}</span>{w.slice(1)}
          </span>
        );
      })}
    </div>
  );
  return (
    <Scene start={2.35} end={5.2} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, ...pop(t, 2.4, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 32, letterSpacing: 5, color: C.banana }}>EPIDERMIS · 5 LAYERS</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 98, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#B9D27A", opacity: ramp(t, 2.5, 2.7) }}>a popular mnemonic</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 190, display: "flex", justifyContent: "center", gap: 14 }}>
          {IDS.map((id, i) => {
            const p = ramp(t, MT[i] - 0.08, MT[i] + 0.12);
            return (
              <div key={id} style={{ opacity: 0.2 + 0.8 * p, transform: `translateY(${(1 - p) * 24}px)` }}>
                <div style={{ width: 132, height: 150, borderRadius: 24, background: p > 0.5 ? COL[id] : "rgba(247,246,236,0.14)", border: `5px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 96, color: C.paper, lineHeight: 1, paddingBottom: 6, boxSizing: "border-box" }}>{LET[id]}</div>
              </div>
            );
          })}
        </div>
        {line(w1, 420)}
        {line(w2, 550)}
        <div style={{ position: "absolute", left: 0, width: 820, top: 710, display: "flex", justifyContent: "center", opacity: ramp(t, 4.7, 4.95) }}>
          <div style={{ background: C.banana, color: C.forest, borderRadius: 24, padding: "8px 28px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 44, whiteSpace: "nowrap" }}>C-L-G-S-B · top to bottom</div>
        </div>
      </div>
    </Scene>
  );
};

/* 3. The plate + layer list: band + chip per letter + name card */
export const V3: React.FC = () => {
  const t = useT();
  const id = cur(t);
  const p = id ? ramp(t, TF[id] - 0.05, TF[id] + 0.18) : 0;
  return (
    <Scene start={5.2} end={T_HOLD} push={0.004}>
      <Strip t={t} top={14} />
      <PlateCard x={0} y={122} w={515} h={630} id={id} p={p} />
      <div style={{ position: "absolute", left: 545, top: 122, width: 315, height: 630, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        {IDS.map((k) => {
          const on = id === k;
          const seen = t >= TF[k] - 0.05;
          return (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 12, height: 110, borderRadius: 26, padding: "0 12px", background: on ? C.forest : C.card, border: `4px solid ${on ? C.forest : C.line}`, opacity: seen ? 1 : 0.45, boxSizing: "border-box" }}>
              <Chip id={k} size={64} on={seen ? 1 : 0} hot={on} round />
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 31, color: on ? C.paper : C.forest, whiteSpace: "nowrap" }}>{NAME[k]}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, width: 515, top: 762, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.forest, opacity: 0.65 }}>Gray's Anatomy (1918), Fig. 941 · public domain</div>
      <NameCard t={t} top={806} />
    </Scene>
  );
};

/* 4. Quick test with 3-2-1 */
export const V4: React.FC = () => {
  const t = useT();
  const s0 = T_HOLD;
  const cd: [number, number][] = [[24.12, 3], [24.76, 2], [25.4, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < 26.0) { n = v; n0 = s; } });
  return (
    <Scene start={s0} end={26.0}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, s0 + 0.02, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 42, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 30, width: 760, top: 110, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 54, lineHeight: 1.12, color: C.paper, ...pop(t, s0 + 0.5) }}>
          Which layer is found <span style={{ color: C.banana }}>ONLY</span> in <span style={{ color: C.banana }}>THICK SKIN</span>?
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 340, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 36, color: "#B9D27A", ...pop(t, s0 + 2.8, 0.25) }}>like palms and soles</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 420, display: "flex", justifyContent: "center", gap: 14, alignItems: "center", ...pop(t, s0 + 2.0, 0.25) }}>
          {IDS.map((id) => <Chip key={id} id={id} size={110} />)}
        </div>
        {n !== null ? (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 590, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 190, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        ) : (
          <div style={{ position: "absolute", left: 0, width: 820, top: 660, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, color: "#B9D27A", opacity: ramp(t, 23.85, 24.05) }}>pause · say it out loud</div>
        )}
      </div>
    </Scene>
  );
};

/* 5. Answer */
export const V5: React.FC = () => {
  const t = useT();
  return (
    <Scene start={26.0} end={27.45} push={0.006}>
      <div style={center(34, pop(t, 26.02, 0.25))}>
        <Pill size={46} bg={C.banana} color={C.forest}>✓ ANSWER</Pill>
      </div>
      <div style={{ position: "absolute", left: 20, top: 150, width: 820, height: 640, borderRadius: 48, background: C.forest, ...pop(t, 26.05, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 60, display: "flex", justifyContent: "center", gap: 14, alignItems: "center" }}>
          {IDS.map((id) => (
            <div key={id} style={{ opacity: id === "L" ? 1 : 0.35 }}><Chip id={id} size={104} on={1} hot={id === "L"} /></div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 250, display: "flex", justifyContent: "center", opacity: ramp(t, 26.15, 26.4) }}>
          <div style={{ background: C.red, color: C.paper, borderRadius: 20, padding: "8px 24px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 62, textAlign: "center", lineHeight: 1.05 }}>STRATUM<br />LUCIDUM</div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 470, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#B9D27A", opacity: ramp(t, 26.5, 26.75), lineHeight: 1.2 }}>thin skin has 4 layers<br />(no lucidum)</div>
      </div>
    </Scene>
  );
};

/* 6. Save frame */
export const V6: React.FC = () => {
  const t = useT();
  const s0 = 27.45;
  const b = ramp(t, s0 + 0.05, s0 + 0.4);
  const row = (id: Id, base: number) => (
    <div key={id} style={{ display: "flex", alignItems: "center", gap: 14, height: 84, borderBottom: `2px solid ${C.line}`, opacity: ramp(t, s0 + 0.2 + base * 0.04, s0 + 0.4 + base * 0.04) }}>
      <Chip id={id} size={56} round />
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.forest, whiteSpace: "nowrap" }}>{NAME[id]}</div>
      <div style={{ marginLeft: "auto", fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.matcha, whiteSpace: "nowrap" }}>{SAVEROW[id]}</div>
    </div>
  );
  return (
    <Scene start={s0} end={29.85}>
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
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.forest, whiteSpace: "nowrap", marginBottom: 2 }}>Come, Let's Get Sun Burned · top → bottom</div>
        {IDS.map((id, i) => row(id, i))}
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, color: C.matcha, marginTop: 10, lineHeight: 1.22, opacity: ramp(t, s0 + 0.6, s0 + 0.8) }}>Thick skin: 5 layers; thin skin has no lucidum. Gray's 1918 names: spinosum = stratum mucosum, basale ≈ germinativum.</div>
      </div>
    </Scene>
  );
};

/* 7. End card — no store, no product */
export const V7: React.FC = () => {
  const t = useT();
  const s0 = 29.85;
  return (
    <Scene start={s0} end={31.15}>
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
