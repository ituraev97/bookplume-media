import React from "react";
import { C, FONT, Pill, Scene, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, pop } from "./Scenes67";
import { PlateBox74 } from "./Scenes74";
import { Space, VCOL, VId, VNAME } from "./Space112";

export const A819 = 1690 / 1287;
export const P819 = "plates/intercostal819.png";
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* voice times (words.json) */
export const IDS: VId[] = ["V", "A", "N"];
export const TF: Record<VId, number> = { V: 6.4, A: 7.58, N: 8.8 }; // the letter
const TM: Record<VId, number> = { V: 6.58, A: 7.71, N: 9.02 }; // the name
const LET = [4.52, 4.86, 5.04]; // "V. A. N."
export const T_GROOVE = 10.3;
export const T_HOLD = 13.9;
const NOTE: Record<VId, string> = { V: "the topmost of the three", A: "in the middle", N: "the lowest of the three" };
const FULL: Record<VId, string> = { V: "Vein", A: "Artery", N: "Nerve" };

export const VChip: React.FC<{ n: string; size?: number; on?: number; hot?: boolean; round?: boolean }> = ({ n, size = 70, on = 1, hot, round }) => (
  <div style={{ width: size, height: size, flex: `0 0 ${size}px`, borderRadius: round ? size / 2 : size * 0.28, background: on > 0.5 ? VCOL[n as VId] : "rgba(31,42,20,0.08)", border: `4px solid ${on > 0.5 ? C.forest : "rgba(31,42,20,0.25)"}`, color: on > 0.5 ? C.paper : "rgba(31,42,20,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.6, transform: `scale(${hot ? 1.16 : 1})`, boxShadow: hot ? `0 0 0 6px ${C.banana}` : "none", boxSizing: "border-box", lineHeight: 1 }}>
    {n}
  </div>
);

const Strip: React.FC<{ t: number; top?: number }> = ({ t, top = 6 }) => {
  let cur = -1;
  IDS.forEach((id, i) => { if (t >= TF[id] - 0.05 && t < T_GROOVE - 0.2) cur = i; });
  return (
    <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", gap: 18 }}>
      {IDS.map((id, i) => {
        const p = ramp(t, TF[id] - 0.05, TF[id] + 0.12);
        return (
          <div key={id} style={{ transform: `scale(${1 + 0.2 * p * (1 - ramp(t, TF[id] + 0.12, TF[id] + 0.4))})` }}>
            <VChip n={id} size={70} on={p} hot={cur === i} />
          </div>
        );
      })}
    </div>
  );
};

const NameCard: React.FC<{ t: number; top: number }> = ({ t, top }) => {
  const wrap = (child: React.ReactNode, key?: string | number) => (
    <div key={key} style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center" }}>{child}</div>
  );
  if (t >= T_HOLD - 0.05) {
    const p = ramp(t, T_HOLD - 0.05, T_HOLD + 0.2);
    return wrap(
      <div style={{ background: C.forest, borderRadius: 30, padding: "14px 30px 16px", transform: `scale(${0.85 + 0.15 * p})`, opacity: p, boxShadow: "0 10px 0 rgba(31,42,20,0.15)", fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.paper, whiteSpace: "nowrap" }}>
        <span style={{ color: C.banana }}>V · A · N</span> = top → bottom
      </div>
    );
  }
  if (t >= T_GROOVE - 0.05) {
    const p = ramp(t, T_GROOVE - 0.05, T_GROOVE + 0.25);
    return wrap(
      <div style={{ background: C.forest, borderRadius: 30, padding: "14px 30px 16px", transform: `scale(${0.85 + 0.15 * p})`, opacity: p, boxShadow: "0 10px 0 rgba(31,42,20,0.15)", fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.paper, whiteSpace: "nowrap" }}>
        all 3 tuck into the <span style={{ color: C.banana }}>costal groove</span>
      </div>
    );
  }
  let cur = -1;
  IDS.forEach((id, i) => { if (t >= TF[id] - 0.02) cur = i; });
  if (cur < 0) {
    const p = ramp(t, 6.3, 6.55);
    return wrap(
      <div style={{ background: C.forest, borderRadius: 30, padding: "14px 30px 18px", opacity: p, transform: `scale(${0.85 + 0.15 * p})`, fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper, whiteSpace: "nowrap" }}>one intercostal space · side view</div>
    );
  }
  const id = IDS[cur];
  const p = ramp(t, TF[id] - 0.02, TF[id] + 0.2);
  return wrap(
    <div key={cur} style={{ display: "flex", alignItems: "center", gap: 18, background: C.forest, borderRadius: 30, padding: "12px 34px 14px 14px", transform: `scale(${0.85 + 0.15 * p})`, opacity: p, boxShadow: "0 10px 0 rgba(31,42,20,0.15)" }}>
      <VChip n={id} size={84} round />
      <div style={{ opacity: ramp(t, TM[id] - 0.1, TM[id] + 0.1, 0.3, 1) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.paper, lineHeight: 1.05, whiteSpace: "nowrap" }}>
          <span style={{ background: C.banana, color: C.forest, borderRadius: 8, padding: "0 6px 2px" }}>{FULL[id][0]}</span>{FULL[id].slice(1)}
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, color: "#B9D27A", marginTop: 2, whiteSpace: "nowrap" }}>{NOTE[id]}</div>
      </div>
    </div>,
    cur
  );
};

/* 1. Hook: Gray's 1918 Fig. 819 visible from frame 0 + challenge */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={3.1} push={0.02}>
      <div style={center(0, pop(t, -0.4, 0.25))}>
        <Big size={124}>NAME ALL 3</Big>
      </div>
      <div style={center(128, pop(t, -0.3, 0.25))}>
        <Big size={72} color={C.red}>UNDER THE RIB</Big>
      </div>
      <PlateBox74 src={P819} aspect={A819} x={30} y={240} w={800} h={640} a={-0.6} b={3.1} from={[0.5, 0.5, 0.98]} to={[0.64, 0.5, 0.7]}
        labels={[{ x: 0.705, y: 0.466, text: "1 of the 3 ?", t: 0.7, hot: true, ox: 30, oy: -170 }]} />
      <div style={center(898, pop(t, 0.05, 0.25))}>
        {t < 1.9 ? <Pill size={34} bg={C.forest}>intercostal space · mnemonic</Pill> : (
          <div style={{ ...pop(t, 1.92, 0.25) }}><Pill size={40} bg={C.banana} color={C.forest}>1 trick: think of a VAN</Pill></div>
        )}
      </div>
    </Scene>
  );
};

/* 2. The mnemonic card: V · A · N, letters revealed one by one */
export const V2: React.FC = () => {
  const t = useT();
  const tagP = ramp(t, 5.25, 5.5);
  return (
    <Scene start={3.1} end={6.3} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, ...pop(t, 3.12, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: C.banana }}>INTERCOSTAL SPACE</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 98, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 42, color: "#B9D27A" }}>think of a VAN</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 230, display: "flex", justifyContent: "center", gap: 30 }}>
          {IDS.map((id, i) => {
            const p = ramp(t, LET[i] - 0.08, LET[i] + 0.12);
            return (
              <div key={id} style={{ opacity: 0.2 + 0.8 * p, transform: `translateY(${(1 - p) * 24}px)` }}>
                <div style={{ width: 214, height: 290, borderRadius: 40, background: p > 0.5 ? VCOL[id] : "rgba(247,246,236,0.14)", border: `6px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 220, color: C.paper, lineHeight: 1, paddingBottom: 14, boxSizing: "border-box" }}>{id}</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 590, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: "#B9D27A", opacity: tagP }}>read it from the top down</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 666, display: "flex", justifyContent: "center", opacity: tagP }}>
          <div style={{ background: C.banana, color: C.forest, borderRadius: 24, padding: "10px 36px 16px", fontFamily: FONT, fontWeight: 800, fontSize: 60, whiteSpace: "nowrap" }}>top ↓ bottom</div>
        </div>
      </div>
    </Scene>
  );
};

/* 3. Our own diagram: V, A, N light up as named, then the groove, then the complete labelled map */
export const V3: React.FC = () => {
  const t = useT();
  return (
    <Scene start={6.3} end={14.0} push={0.004}>
      <div style={{ position: "absolute", left: 0, top: 120, width: 860, height: 660, overflow: "hidden", borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}` }}>
        <div style={{ position: "absolute", left: 38, top: -8, width: 784, height: 660, transform: "scale(0.9)", transformOrigin: "50% 0" }}>
          <Space t={t} lit={TF} groove={T_GROOVE} hold={T_HOLD} />
        </div>
        <div style={{ position: "absolute", right: 18, bottom: 10, fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.forest, opacity: 0.55 }}>schematic · diagram: Book Plume</div>
      </div>
      <Strip t={t} top={20} />
      <NameCard t={t} top={794} />
    </Scene>
  );
};

/* 4. Quick test with 3-2-1 */
export const V4: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[16.15, 3], [16.79, 2], [17.43, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < 18.05) { n = v; n0 = s; } });
  const Opt = ({ id, i }: { id: VId; i: number }) => (
    <div style={{ width: 236, height: 290, borderRadius: 30, background: "rgba(247,246,236,0.08)", border: "4px solid rgba(247,246,236,0.22)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, boxSizing: "border-box", ...pop(t, 14.9 + i * 0.15, 0.25) }}>
      <VChip n={id} size={110} round />
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper, textAlign: "center", lineHeight: 1.1 }}>{FULL[id]}</div>
    </div>
  );
  return (
    <Scene start={14.0} end={18.05}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 14.02, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 42, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 30, width: 760, top: 112, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 62, lineHeight: 1.1, color: C.paper, ...pop(t, 14.3) }}>
          Which one sits <span style={{ color: C.banana }}>LOWEST?</span>
        </div>
        <div style={{ position: "absolute", left: 30, top: 300, width: 760, display: "flex", gap: 16, justifyContent: "center" }}>
          <Opt id="V" i={0} />
          <Opt id="A" i={1} />
          <Opt id="N" i={2} />
        </div>
        {n !== null ? (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 640, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 180, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        ) : (
          <div style={{ position: "absolute", left: 0, width: 820, top: 730, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, color: "#B9D27A", opacity: ramp(t, 15.8, 16.0) }}>pause · say it out loud</div>
        )}
      </div>
    </Scene>
  );
};

/* 5. Answer: the nerve, on the diagram */
export const V5: React.FC = () => {
  const t = useT();
  return (
    <Scene start={18.05} end={19.65} push={0.006}>
      <div style={center(20, pop(t, 18.08, 0.25))}>
        <Pill size={50} bg={C.banana} color={C.forest}>✓ N = NERVE</Pill>
      </div>
      <div style={{ position: "absolute", left: 0, top: 120, width: 860, height: 660, overflow: "hidden", borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}` }}>
        <div style={{ position: "absolute", left: 38, top: -8, width: 784, height: 660, transform: "scale(0.9)", transformOrigin: "50% 0" }}>
          <Space t={t} lit={{ V: 0, A: 0, N: 0 }} groove={0} hold={0} focus="N" />
        </div>
      </div>
      <div style={{ ...center(800), opacity: ramp(t, 18.5, 18.75) }}>
        <div style={{ background: C.forest, borderRadius: 30, padding: "12px 30px 16px", fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.paper, whiteSpace: "nowrap" }}>
          <span style={{ color: C.banana }}>N</span> = the lowest of the three
        </div>
      </div>
    </Scene>
  );
};

/* 6. Save frame: the complete labelled map */
export const V6: React.FC = () => {
  const t = useT();
  const s0 = 19.65;
  const b = ramp(t, s0 + 0.05, s0 + 0.4);
  return (
    <Scene start={s0} end={24.5}>
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
      <div style={{ position: "absolute", left: 0, top: 176, width: 860, height: 650, overflow: "hidden", borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}`, ...pop(t, s0 + 0.15, 0.3) }}>
        <div style={{ position: "absolute", left: 38, top: -8, width: 784, height: 660, transform: "scale(0.9)", transformOrigin: "50% 0" }}>
          <Space t={t} lit={{ V: 0, A: 0, N: 0 }} groove={0} hold={0} />
        </div>
      </div>
      <div style={{ ...center(838), opacity: ramp(t, s0 + 0.3, s0 + 0.55) }}>
        <div style={{ background: C.forest, borderRadius: 30, padding: "12px 32px 16px", fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.paper, whiteSpace: "nowrap" }}>
          <span style={{ color: C.banana }}>V · A · N</span> = vein, artery, nerve
        </div>
      </div>
    </Scene>
  );
};

/* 7. End card (≤ 1.5 s) — no store, no product */
export const V7: React.FC = () => {
  const t = useT();
  const s0 = 24.5;
  return (
    <Scene start={s0} end={25.8}>
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
