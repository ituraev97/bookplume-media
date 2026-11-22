import React from "react";
import { C, FONT, Pill, Scene, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, pop } from "./Scenes67";
import { PlateBox74 } from "./Scenes74";
import { Forearm, MCOL, MId } from "./Forearm110";

export const A414 = 693 / 2424;
export const P414 = "plates/forearm414.png";
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* voice times (words.json) */
export const TM: Record<MId, number> = { PT: 11.04, FCR: 12.49, PL: 14.22, FCU: 16.28 };
const TF: Record<MId, number> = { PT: 10.34, FCR: 12.02, PL: 13.96, FCU: 15.39 };
const MN: [string, number][] = [["Pass", 3.39], ["Fail", 3.76], ["Pass", 4.0], ["Fail", 4.31]];
export const SEQ: { l: string; m: MId; finger: string }[] = [
  { l: "P", m: "PT", finger: "index" }, { l: "F", m: "FCR", finger: "middle" }, { l: "P", m: "PL", finger: "ring" }, { l: "F", m: "FCU", finger: "little" },
];
export const NAME: Record<MId, string> = { PT: "Pronator teres", FCR: "Flexor carpi radialis", PL: "Palmaris longus", FCU: "Flexor carpi ulnaris" };
const NOTE: Record<MId, string> = {
  PT: "index finger · turns the palm down",
  FCR: "middle finger · bends the wrist, thumb side",
  PL: "ring finger · thin tendon, missing in some people",
  FCU: "little finger · bends the wrist, pinky side",
};
const NERVE: Record<MId, string> = { PT: "median", FCR: "median", PL: "median", FCU: "ULNAR" };
const T_HOLD = 17.87;

export const LChip: React.FC<{ l: string; size?: number; on?: number; hot?: boolean; col?: string }> = ({ l, size = 70, on = 1, hot, col = C.red }) => (
  <div style={{ width: size, height: size, flex: `0 0 ${size}px`, borderRadius: size * 0.28, background: on > 0.5 ? col : "rgba(31,42,20,0.08)", border: `4px solid ${on > 0.5 ? C.forest : "rgba(31,42,20,0.25)"}`, color: on > 0.5 ? C.paper : "rgba(31,42,20,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.58, transform: `scale(${hot ? 1.16 : 1})`, boxShadow: hot ? `0 0 0 6px ${C.banana}` : "none", boxSizing: "border-box", lineHeight: 1 }}>
    {l}
  </div>
);

const Strip: React.FC<{ t: number; top?: number }> = ({ t, top = 6 }) => {
  let cur = -1;
  SEQ.forEach((s, i) => { if (t >= TF[s.m] - 0.05 && t < T_HOLD) cur = i; });
  return (
    <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", gap: 16 }}>
      {SEQ.map((s, i) => {
        const p = ramp(t, TF[s.m] - 0.05, TF[s.m] + 0.12);
        return (
          <div key={i} style={{ transform: `scale(${1 + 0.2 * p * (1 - ramp(t, TF[s.m] + 0.12, TF[s.m] + 0.4))})` }}>
            <LChip l={s.l} size={74} on={p} hot={cur === i} col={MCOL[s.m]} />
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
        <div style={{ background: C.forest, borderRadius: 30, padding: "14px 30px 16px", transform: `scale(${0.85 + 0.15 * p})`, opacity: p, boxShadow: "0 10px 0 rgba(31,42,20,0.15)", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper, whiteSpace: "nowrap" }}>
          all <span style={{ color: C.banana }}>4</span> share one start: <span style={{ color: C.banana }}>medial epicondyle</span>
        </div>
      </div>
    );
  }
  let cur = -1;
  SEQ.forEach((s, i) => { if (t >= TF[s.m] - 0.02) cur = i; });
  if (cur < 0) {
    const txt = t >= 8.45 ? <>spread your <span style={{ color: C.banana }}>fingers</span> down the forearm</> : <>heel of your <span style={{ color: C.banana }}>other hand</span> → inner elbow bump</>;
    const t0 = t >= 8.45 ? 8.5 : 5.0;
    const p = ramp(t, t0, t0 + 0.25);
    return (
      <div key={t0} style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center" }}>
        <div style={{ background: C.forest, borderRadius: 30, padding: "14px 30px 18px", opacity: p, transform: `scale(${0.85 + 0.15 * p})`, fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper, whiteSpace: "nowrap" }}>{txt}</div>
      </div>
    );
  }
  const s = SEQ[cur];
  const t0 = TF[s.m];
  const p = ramp(t, t0 - 0.02, t0 + 0.2);
  const name = NAME[s.m];
  return (
    <div key={cur} style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, background: C.forest, borderRadius: 30, padding: "12px 28px 14px 14px", transform: `scale(${0.85 + 0.15 * p})`, opacity: p, boxShadow: "0 10px 0 rgba(31,42,20,0.15)" }}>
        <LChip l={s.l} size={76} col={MCOL[s.m]} />
        <div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 50, color: C.paper, lineHeight: 1.05, whiteSpace: "nowrap", opacity: ramp(t, TM[s.m] - 0.1, TM[s.m] + 0.1, 0.25, 1) }}>
            <span style={{ background: C.banana, color: C.forest, borderRadius: 10, padding: "0 6px 2px" }}>{name[0]}</span>{name.slice(1)}
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 27, color: "#B9D27A", marginTop: 2, whiteSpace: "nowrap" }}>{NOTE[s.m]}</div>
        </div>
      </div>
    </div>
  );
};

/* 1. Hook: Gray's 1918 Fig. 414 visible from frame 0 + challenge */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={2.7} push={0.02}>
      <div style={center(0, pop(t, -0.4, 0.25))}>
        <Big size={124}>NAME ALL 4</Big>
      </div>
      <div style={center(128, pop(t, -0.3, 0.25))}>
        <Big size={80} color={C.red}>FOREARM FLEXORS</Big>
      </div>
      <PlateBox74 src={P414} aspect={A414} x={130} y={240} w={600} h={630} a={-0.6} b={2.7} from={[0.5, 0.38, 1.0]} to={[0.45, 0.36, 0.9]}
        labels={[{ x: 0.3, y: 0.36, text: "4 superficial\nflexors", t: 0.6, hot: true, ox: 40, oy: 190 }]} />
      <div style={center(888, pop(t, 0.05, 0.25))}>
        {t < 1.6 ? <Pill size={34} bg={C.forest}>superficial forearm flexors · mnemonic</Pill> : (
          <div style={{ ...pop(t, 1.62, 0.25) }}><Pill size={40} bg={C.banana} color={C.forest}>4 words · 1 hand trick</Pill></div>
        )}
      </div>
    </Scene>
  );
};

/* 2. The mnemonic card, words revealed one by one */
export const V2: React.FC = () => {
  const t = useT();
  const tagP = ramp(t, 4.45, 4.7);
  return (
    <Scene start={2.7} end={4.9} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, ...pop(t, 2.72, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: C.banana }}>FOREARM FLEXORS MNEMONIC</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 98, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#B9D27A" }}>first letters = the muscles, thumb side first</div>
        <div style={{ position: "absolute", left: 50, width: 740, top: 190, display: "flex", flexDirection: "column", gap: 40 }}>
          {MN.map(([w, s], i) => {
            const p = ramp(t, s - 0.08, s + 0.12);
            const m = SEQ[i].m;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, opacity: 0.18 + 0.82 * p, transform: `translateX(${(1 - p) * 30}px)` }}>
                <div style={{ width: 230, fontFamily: FONT, fontWeight: 800, fontSize: 84, lineHeight: 1.05, color: C.paper, whiteSpace: "nowrap" }}>
                  <span style={{ background: p > 0.5 ? MCOL[m] : "rgba(247,246,236,0.14)", color: C.paper, border: `4px solid ${C.paper}`, borderRadius: 16, padding: "0 12px 4px" }}>{w[0]}</span>
                  {w.slice(1)}
                </div>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.paper, whiteSpace: "nowrap", opacity: tagP }}>
                  {NAME[m]}
                  <div style={{ fontSize: 26, color: C.banana }}>{SEQ[i].finger} finger</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 780, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 32, color: "#B9D27A", opacity: tagP }}>thumb side → pinky side</div>
      </div>
    </Scene>
  );
};

/* 3. Our own diagram: hand trick, each muscle lights up as it is named, then the complete labelled map */
export const V3: React.FC = () => {
  const t = useT();
  return (
    <Scene start={4.9} end={21.15} push={0.004}>
      <div style={{ position: "absolute", left: 0, top: 134, width: 860, height: 728, overflow: "hidden", borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}` }}>
        <Forearm t={t} lit={TM} handOn={5.1} spread={8.5} handOff={T_HOLD - 0.1} bump={6.86} hold={T_HOLD} bump2={20.25} />
        <div style={{ position: "absolute", right: 18, bottom: 12, fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.forest, opacity: 0.55 }}>left forearm · palm view · diagram: Book Plume</div>
      </div>
      <Strip t={t} top={34} />
      <NameCard t={t} top={878} />
    </Scene>
  );
};

/* 4. Quick test with 3-2-1 */
export const V4: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[24.17, 3], [24.8, 2], [25.45, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < 26.05) { n = v; n0 = s; } });
  const Opt = ({ a, b, i }: { a: string; b: string; i: number }) => (
    <div style={{ width: 360, height: 300, borderRadius: 30, background: "rgba(247,246,236,0.08)", border: "4px solid rgba(247,246,236,0.22)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, boxSizing: "border-box", ...pop(t, i === 0 ? 22.0 : 22.4, 0.25) }}>
      <LChip l="F" size={90} col={i === 0 ? MCOL.FCR : MCOL.FCU} />
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.paper, textAlign: "center", lineHeight: 1.15 }}>{a}<br /><span style={{ fontSize: 44 }}>{b}</span></div>
    </div>
  );
  return (
    <Scene start={21.15} end={26.05}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 21.2, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 42, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 30, width: 760, top: 104, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 60, lineHeight: 1.1, color: C.paper, ...pop(t, 21.6) }}>
          Which one gets the <span style={{ color: C.banana }}>ULNAR NERVE?</span>
        </div>
        <div style={{ position: "absolute", left: 40, top: 296, width: 740, display: "flex", gap: 20, justifyContent: "center" }}>
          <Opt a="Flexor carpi" b="radialis" i={0} />
          <Opt a="Flexor carpi" b="ulnaris" i={1} />
        </div>
        {n !== null ? (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 650, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 170, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        ) : (
          <div style={{ position: "absolute", left: 0, width: 820, top: 720, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, color: "#B9D27A", opacity: ramp(t, 23.0, 23.3) }}>pause · say it out loud</div>
        )}
      </div>
    </Scene>
  );
};

/* 5. Answer on the real thing: Gray's 1918 Fig. 414 */
export const V5: React.FC = () => {
  const t = useT();
  const z = ramp(t, 29.2, 29.45);
  return (
    <Scene start={26.05} end={31.25} push={0.006}>
      <div style={center(34, pop(t, 26.1, 0.25))}>
        <Pill size={46} bg={C.banana} color={C.forest}>✓ FLEXOR CARPI ULNARIS</Pill>
      </div>
      <div style={{ ...center(124), opacity: ramp(t, 27.55, 27.8) * (1 - z) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.forest, whiteSpace: "nowrap" }}>
          <span style={{ background: C.red, color: C.paper, borderRadius: 8, padding: "0 6px 2px" }}>ULNAR</span>is = <span style={{ background: C.red, color: C.paper, borderRadius: 8, padding: "0 6px 2px" }}>ULNAR</span> nerve
        </div>
      </div>
      <div style={{ ...center(124), opacity: z }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.forest, whiteSpace: "nowrap" }}>
          the other <span style={{ background: C.matcha, color: C.paper, borderRadius: 8, padding: "0 6px 2px" }}>3 = median</span> nerve
        </div>
      </div>
      <PlateBox74 src={P414} aspect={A414} x={30} y={196} w={800} h={650} a={26.05} b={31.25} from={[0.5, 0.46, 1.55]} to={[0.5, 0.43, 1.7]} ls={30}
        labels={[
          { x: 0.1, y: 0.47, text: "flexor carpi ulnaris\n→ ULNAR nerve", t: 26.2, hot: true, ox: 40, oy: 130 },
          { x: 0.5, y: 0.33, text: "median", t: 29.3, ox: 170, oy: -60 },
          { x: 0.34, y: 0.38, text: "median", t: 29.4, ox: 250, oy: 40 },
          { x: 0.22, y: 0.45, text: "median", t: 29.5, ox: 300, oy: 110 },
        ]} />
      <div style={{ position: "absolute", left: 0, width: 860, top: 862, display: "flex", justifyContent: "center", opacity: ramp(t, 26.6, 26.85) }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 16px 10px", fontFamily: FONT, fontWeight: 800, fontSize: 25, color: C.forest, whiteSpace: "nowrap" }}>
          <span style={{ color: C.matcha }}>1918 atlas name:</span> flexor digitorum sublimis = superficialis
        </div>
      </div>
    </Scene>
  );
};

/* 6. Save + cheat sheet */
export const V6: React.FC = () => {
  const t = useT();
  const s0 = 31.25;
  const b = ramp(t, s0 + 0.05, s0 + 0.4);
  return (
    <Scene start={s0} end={33.6}>
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
      <div style={{ position: "absolute", left: 30, top: 190, width: 800, height: 700, borderRadius: 40, background: C.card, border: `3px solid ${C.line}`, boxShadow: "0 18px 40px rgba(31,42,20,0.12)", padding: "28px 36px", boxSizing: "border-box", ...pop(t, s0 + 0.15, 0.3) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest, whiteSpace: "nowrap" }}>Pass · Fail · Pass · Fail</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 25, color: C.matcha, letterSpacing: 2, marginTop: 10 }}>SUPERFICIAL FLEXORS · THUMB SIDE → PINKY</div>
        {SEQ.map((q, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, height: 108, borderBottom: i < 3 ? `2px solid ${C.line}` : "none", opacity: ramp(t, s0 + 0.2 + i * 0.06, s0 + 0.4 + i * 0.06) }}>
            <LChip l={q.l} size={60} col={MCOL[q.m]} />
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.forest, whiteSpace: "nowrap" }}>{NAME[q.m]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, color: C.forest, opacity: 0.6, whiteSpace: "nowrap" }}>{q.finger} finger</div>
            </div>
            <div style={{ marginLeft: "auto", background: q.m === "FCU" ? C.red : C.matcha, color: C.paper, borderRadius: 14, padding: "6px 16px 9px", fontFamily: FONT, fontWeight: 800, fontSize: 26, whiteSpace: "nowrap" }}>{NERVE[q.m]} n.</div>
          </div>
        ))}
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.forest, marginTop: 18, whiteSpace: "nowrap" }}>common start: <span style={{ color: C.red }}>medial epicondyle</span></div>
      </div>
    </Scene>
  );
};

/* 7. End card (≤ 1.5 s) — no store, no product */
export const V7: React.FC = () => {
  const t = useT();
  const s0 = 33.6;
  return (
    <Scene start={s0} end={35.0}>
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
