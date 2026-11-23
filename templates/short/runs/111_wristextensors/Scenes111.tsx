import React from "react";
import { C, FONT, Pill, Scene, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, pop } from "./Scenes67";
import { PlateBox74 } from "./Scenes74";
import { CCOL, CCOUNT, CFULL, CId, Wrist } from "./Wrist111";

export const A1234 = 1751 / 2626;
export const P1234 = "plates/wrist1234.png";
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* voice times (words.json) */
export const IDS: CId[] = [1, 2, 3, 4, 5, 6];
const TF: Record<CId, number> = { 1: 7.24, 2: 11.04, 3: 14.08, 4: 16.05, 5: 19.09, 6: 21.03 }; // the number word
export const TM: Record<CId, number> = { 1: 7.55, 2: 11.44, 3: 14.45, 4: 16.52, 5: 19.48, 6: 21.34 }; // first tendon name
const DIG = [5.43, 5.67, 5.92, 6.16, 6.41, 6.63]; // "Two, two, one, two, one, one"
const NOTE: Record<CId, string> = {
  1: "the thumb pair · 2 tendons",
  2: "wrist extensors · 2 tendons",
  3: "thumb's long extensor · alone",
  4: "the finger extensors · 2 tendons",
  5: "little finger's own extensor",
  6: "wrist extensor · pinky side",
};
const T_HOLD = 23.15;

export const CChip: React.FC<{ n: number | string; size?: number; on?: number; hot?: boolean; col?: string; round?: boolean }> = ({ n, size = 70, on = 1, hot, col = C.red, round }) => (
  <div style={{ width: size, height: size, flex: `0 0 ${size}px`, borderRadius: round ? size / 2 : size * 0.28, background: on > 0.5 ? col : "rgba(31,42,20,0.08)", border: `4px solid ${on > 0.5 ? C.forest : "rgba(31,42,20,0.25)"}`, color: on > 0.5 ? C.paper : "rgba(31,42,20,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.6, transform: `scale(${hot ? 1.16 : 1})`, boxShadow: hot ? `0 0 0 6px ${C.banana}` : "none", boxSizing: "border-box", lineHeight: 1 }}>
    {n}
  </div>
);

const Strip: React.FC<{ t: number; top?: number }> = ({ t, top = 6 }) => {
  let cur = -1;
  IDS.forEach((id, i) => { if (t >= TF[id] - 0.05 && t < T_HOLD) cur = i; });
  return (
    <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", gap: 14 }}>
      {IDS.map((id, i) => {
        const p = ramp(t, TF[id] - 0.05, TF[id] + 0.12);
        return (
          <div key={id} style={{ transform: `scale(${1 + 0.2 * p * (1 - ramp(t, TF[id] + 0.12, TF[id] + 0.4))})` }}>
            <CChip n={CCOUNT[id]} size={70} on={p} hot={cur === i} col={CCOL[id]} />
          </div>
        );
      })}
    </div>
  );
};

const NameCard: React.FC<{ t: number; top: number }> = ({ t, top }) => {
  if (t >= T_HOLD - 0.05) {
    const p = ramp(t, T_HOLD - 0.05, T_HOLD + 0.2);
    return (
      <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center" }}>
        <div style={{ background: C.forest, borderRadius: 30, padding: "14px 30px 16px", transform: `scale(${0.85 + 0.15 * p})`, opacity: p, boxShadow: "0 10px 0 rgba(31,42,20,0.15)", fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.paper, whiteSpace: "nowrap" }}>
          <span style={{ color: C.banana }}>6</span> compartments · <span style={{ color: C.banana }}>9</span> tendons
        </div>
      </div>
    );
  }
  let cur = -1;
  IDS.forEach((id, i) => { if (t >= TF[id] - 0.02) cur = i; });
  if (cur < 0) {
    const p = ramp(t, 7.2, 7.45);
    return (
      <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center" }}>
        <div style={{ background: C.forest, borderRadius: 30, padding: "14px 30px 18px", opacity: p, transform: `scale(${0.85 + 0.15 * p})`, fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper, whiteSpace: "nowrap" }}>back of the left hand · thumb side first</div>
      </div>
    );
  }
  const id = IDS[cur];
  const p = ramp(t, TF[id] - 0.02, TF[id] + 0.2);
  const names = CFULL[id];
  return (
    <div key={cur} style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, background: C.forest, borderRadius: 30, padding: "12px 28px 14px 14px", transform: `scale(${0.85 + 0.15 * p})`, opacity: p, boxShadow: "0 10px 0 rgba(31,42,20,0.15)" }}>
        <CChip n={id} size={76} col={CCOL[id]} round />
        <div style={{ opacity: ramp(t, TM[id] - 0.1, TM[id] + 0.1, 0.3, 1) }}>
          {names.map((nm, i) => (
            <div key={i} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.paper, lineHeight: 1.08, whiteSpace: "nowrap" }}>
              <span style={{ background: C.banana, color: C.forest, borderRadius: 8, padding: "0 5px 2px" }}>{nm[0]}</span>{nm.slice(1)}
            </div>
          ))}
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, color: "#B9D27A", marginTop: 2, whiteSpace: "nowrap" }}>{NOTE[id]}</div>
        </div>
      </div>
    </div>
  );
};

/* 1. Hook: Gray's 1918 Fig. 1234 visible from frame 0 + challenge */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={2.7} push={0.02}>
      <div style={center(0, pop(t, -0.4, 0.25))}>
        <Big size={124}>NAME ALL 6</Big>
      </div>
      <div style={center(128, pop(t, -0.3, 0.25))}>
        <Big size={76} color={C.red}>WRIST EXTENSORS</Big>
      </div>
      <PlateBox74 src={P1234} aspect={A1234} x={130} y={240} w={600} h={630} a={-0.6} b={2.7} from={[0.5, 0.66, 0.9]} to={[0.46, 0.72, 0.82]}
        labels={[{ x: 0.4, y: 0.74, text: "6 compartments\n9 tendons", t: 0.6, hot: true, ox: 40, oy: 150 }]} />
      <div style={center(888, pop(t, 0.05, 0.25))}>
        {t < 1.6 ? <Pill size={34} bg={C.forest}>wrist extensor compartments · mnemonic</Pill> : (
          <div style={{ ...pop(t, 1.62, 0.25) }}><Pill size={40} bg={C.banana} color={C.forest}>1 number trick: 2-2-1-2-1-1</Pill></div>
        )}
      </div>
    </Scene>
  );
};

/* 2. The mnemonic card: 2-2-1-2-1-1, digits revealed one by one */
export const V2: React.FC = () => {
  const t = useT();
  const tagP = ramp(t, 6.75, 7.0);
  return (
    <Scene start={2.7} end={7.2} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, ...pop(t, 2.72, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: C.banana }}>EXTENSOR COMPARTMENTS</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 98, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#B9D27A" }}>count the tendons, thumb side first</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 250, display: "flex", justifyContent: "center", gap: 16 }}>
          {IDS.map((id, i) => {
            const p = ramp(t, DIG[i] - 0.08, DIG[i] + 0.12);
            return (
              <div key={id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: 0.2 + 0.8 * p, transform: `translateY(${(1 - p) * 24}px)` }}>
                <div style={{ width: 112, height: 150, borderRadius: 30, background: p > 0.5 ? CCOL[id] : "rgba(247,246,236,0.14)", border: `5px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 112, color: C.paper, lineHeight: 1, paddingBottom: 8, boxSizing: "border-box" }}>{CCOUNT[id]}</div>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.paper, opacity: tagP }}>#{id}</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 520, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: "#B9D27A", opacity: tagP }}>tendons in compartments 1 → 6</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 610, display: "flex", justifyContent: "center", opacity: tagP }}>
          <div style={{ background: C.banana, color: C.forest, borderRadius: 24, padding: "10px 32px 16px", fontFamily: FONT, fontWeight: 800, fontSize: 60, whiteSpace: "nowrap" }}>2+2+1+2+1+1 = 9</div>
        </div>
      </div>
    </Scene>
  );
};

/* 3. Our own diagram: compartments light up as named, then the complete labelled map */
export const V3: React.FC = () => {
  const t = useT();
  return (
    <Scene start={7.2} end={25.31} push={0.004}>
      <div style={{ position: "absolute", left: 0, top: 120, width: 860, height: 660, overflow: "hidden", borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}` }}>
        <div style={{ position: "absolute", left: 38, top: -8, width: 784, height: 660, transform: "scale(0.9)", transformOrigin: "50% 0" }}>
          <Wrist t={t} lit={TF} hold={T_HOLD} />
        </div>
        <div style={{ position: "absolute", right: 18, bottom: 10, fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.forest, opacity: 0.55 }}>back of the left hand · schematic · diagram: Book Plume</div>
      </div>
      <Strip t={t} top={20} />
      <NameCard t={t} top={794} />
    </Scene>
  );
};

/* 4. Quick test with 3-2-1 */
export const V4: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[29.13, 3], [29.77, 2], [30.41, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < 31.05) { n = v; n0 = s; } });
  const Opt = ({ id, i }: { id: CId; i: number }) => (
    <div style={{ width: 360, height: 300, borderRadius: 30, background: "rgba(247,246,236,0.08)", border: "4px solid rgba(247,246,236,0.22)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, boxSizing: "border-box", ...pop(t, i === 0 ? 27.3 : 27.7, 0.25) }}>
      <CChip n={id} size={110} col={CCOL[id]} round />
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.paper, textAlign: "center", lineHeight: 1.15 }}>compartment {id}</div>
    </div>
  );
  return (
    <Scene start={25.31} end={31.05}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 25.35, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 42, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 30, width: 760, top: 104, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 56, lineHeight: 1.1, color: C.paper, ...pop(t, 25.65) }}>
          Which compartment holds the <span style={{ color: C.banana }}>LITTLE FINGER'S own extensor?</span>
        </div>
        <div style={{ position: "absolute", left: 40, top: 320, width: 740, display: "flex", gap: 20, justifyContent: "center" }}>
          <Opt id={4} i={0} />
          <Opt id={5} i={1} />
        </div>
        {n !== null ? (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 660, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 170, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        ) : (
          <div style={{ position: "absolute", left: 0, width: 820, top: 730, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, color: "#B9D27A", opacity: ramp(t, 28.9, 29.1) }}>pause · say it out loud</div>
        )}
      </div>
    </Scene>
  );
};

/* 5. Answer on the real thing: Gray's 1918 Fig. 1234 */
export const V5: React.FC = () => {
  const t = useT();
  return (
    <Scene start={31.05} end={34.0} push={0.006}>
      <div style={center(34, pop(t, 31.1, 0.25))}>
        <Pill size={46} bg={C.banana} color={C.forest}>✓ COMPARTMENT 5</Pill>
      </div>
      <div style={{ ...center(124), opacity: ramp(t, 32.25, 32.5) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.forest, whiteSpace: "nowrap" }}>
          <span style={{ background: C.red, color: C.paper, borderRadius: 8, padding: "0 6px 2px" }}>EXTENSOR DIGITI MINIMI</span>
        </div>
      </div>
      <PlateBox74 src={P1234} aspect={A1234} x={30} y={196} w={800} h={650} a={31.05} b={34.0} from={[0.34, 0.56, 0.72]} to={[0.31, 0.54, 0.66]} ls={30}
        labels={[{ x: 0.2, y: 0.535, text: "extensor digiti minimi\n→ little finger", t: 31.2, hot: true, ox: 70, oy: -150 }]} />
      <div style={{ position: "absolute", left: 0, width: 860, top: 862, display: "flex", justifyContent: "center", opacity: ramp(t, 32.3, 32.55) }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 16px 10px", fontFamily: FONT, fontWeight: 800, fontSize: 25, color: C.forest, whiteSpace: "nowrap" }}>
          <span style={{ color: C.matcha }}>1918 atlas name:</span> extensor digiti quinti proprius
        </div>
      </div>
    </Scene>
  );
};

/* 6. Save + cheat sheet */
export const V6: React.FC = () => {
  const t = useT();
  const s0 = 34.0;
  const b = ramp(t, s0 + 0.05, s0 + 0.4);
  return (
    <Scene start={s0} end={36.2}>
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
      <div style={{ position: "absolute", left: 30, top: 178, width: 800, height: 722, borderRadius: 40, background: C.card, border: `3px solid ${C.line}`, boxShadow: "0 18px 40px rgba(31,42,20,0.12)", padding: "20px 30px", boxSizing: "border-box", ...pop(t, s0 + 0.15, 0.3) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.forest, whiteSpace: "nowrap" }}>2 · 2 · 1 · 2 · 1 · 1 = 9 tendons</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 23, color: C.matcha, letterSpacing: 2, marginTop: 6 }}>WRIST EXTENSOR COMPARTMENTS · THUMB SIDE → PINKY SIDE</div>
        {IDS.map((id, i) => (
          <div key={id} style={{ display: "flex", alignItems: "center", gap: 14, height: 94, borderBottom: i < 5 ? `2px solid ${C.line}` : "none", opacity: ramp(t, s0 + 0.2 + i * 0.05, s0 + 0.4 + i * 0.05) }}>
            <CChip n={id} size={56} col={CCOL[id]} round />
            <div>
              {CFULL[id].map((nm, j) => (
                <div key={j} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.forest, whiteSpace: "nowrap", lineHeight: 1.12 }}>{nm}</div>
              ))}
            </div>
            <div style={{ marginLeft: "auto", background: CCOL[id], color: C.paper, borderRadius: 14, padding: "4px 14px 8px", fontFamily: FONT, fontWeight: 800, fontSize: 30, whiteSpace: "nowrap" }}>×{CCOUNT[id]}</div>
          </div>
        ))}
      </div>
    </Scene>
  );
};

/* 7. End card (≤ 1.5 s) — no store, no product */
export const V7: React.FC = () => {
  const t = useT();
  const s0 = 36.2;
  return (
    <Scene start={s0} end={37.5}>
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
