import React from "react";
import { C, FONT, Pill, Scene, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, pop } from "./Scenes67";
import { PlateBox74 } from "./Scenes74";
import { BONES, BoneId, Wrist } from "./Wrist14";

export const A220 = 1190 / 907;
export const P220 = "plates/carpus220.png";
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* voice times (words.json) */
export const TB: Record<BoneId, number> = { S: 7.16, L: 7.67, Tq: 8.09, P: 8.72, Tm: 10.42, Td: 11.13, Cp: 11.71, H: 12.2 };
const MN: [string, number][] = [["Sally", 2.8], ["Left", 3.11], ["The", 3.33], ["Party", 3.4], ["To", 3.79], ["Take", 3.88], ["Cathy", 4.17], ["Home", 4.5]];
export const SEQ: { l: string; b: BoneId; prox: boolean }[] = [
  { l: "S", b: "S", prox: true }, { l: "L", b: "L", prox: true }, { l: "T", b: "Tq", prox: true }, { l: "P", b: "P", prox: true },
  { l: "T", b: "Tm", prox: false }, { l: "T", b: "Td", prox: false }, { l: "C", b: "Cp", prox: false }, { l: "H", b: "H", prox: false },
];
export const NAME: Record<BoneId, string> = { S: "Scaphoid", L: "Lunate", Tq: "Triquetrum", P: "Pisiform", Tm: "Trapezium", Td: "Trapezoid", Cp: "Capitate", H: "Hamate" };
const NOTE: Record<BoneId, string> = {
  S: "thumb side", L: "moon-shaped", Tq: "three-cornered", P: "pea-shaped, on the triquetrum",
  Tm: "under the thumb", Td: "between 4 bones", Cp: "biggest carpal bone", H: "has a hook",
};
const T_ALL = 12.88; // "Two rows of four. That's all eight."

export const LChip: React.FC<{ l: string; size?: number; on?: number; hot?: boolean; col?: string }> = ({ l, size = 70, on = 1, hot, col = C.red }) => (
  <div style={{ width: size, height: size, flex: `0 0 ${size}px`, borderRadius: size * 0.28, background: on > 0.5 ? col : "rgba(31,42,20,0.08)", border: `4px solid ${on > 0.5 ? C.forest : "rgba(31,42,20,0.25)"}`, color: on > 0.5 ? C.paper : "rgba(31,42,20,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.58, transform: `scale(${hot ? 1.16 : 1})`, boxShadow: hot ? `0 0 0 6px ${C.banana}` : "none", boxSizing: "border-box", lineHeight: 1 }}>
    {l}
  </div>
);

const Strip: React.FC<{ t: number; top?: number }> = ({ t, top = 6 }) => {
  let cur = -1;
  SEQ.forEach((s, i) => { if (t >= TB[s.b] - 0.05 && t < T_ALL) cur = i; });
  return (
    <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", gap: 10 }}>
      {SEQ.map((s, i) => {
        const p = ramp(t, TB[s.b] - 0.05, TB[s.b] + 0.12);
        return (
          <div key={i} style={{ display: "flex", gap: 10, transform: `scale(${1 + 0.2 * p * (1 - ramp(t, TB[s.b] + 0.12, TB[s.b] + 0.4))})` }}>
            {i === 4 && <div style={{ width: 6, height: 78, borderRadius: 3, background: C.line }} />}
            <LChip l={s.l} size={74} on={p} hot={cur === i} col={s.prox ? C.matcha : C.red} />
          </div>
        );
      })}
    </div>
  );
};

type Kf = [number, number, number, number];
const cam = (t: number, ks: Kf[]) => {
  if (t <= ks[0][0]) return ks[0];
  for (let i = 0; i < ks.length - 1; i++) {
    const a = ks[i], b = ks[i + 1];
    if (t <= b[0]) {
      const k = ramp(t, a[0], b[0]);
      const e = k * k * (3 - 2 * k);
      return [t, a[1] + (b[1] - a[1]) * e, a[2] + (b[2] - a[2]) * e, a[3] + (b[3] - a[3]) * e] as Kf;
    }
  }
  return ks[ks.length - 1];
};

const NameCard: React.FC<{ t: number; top: number }> = ({ t, top }) => {
  if (t >= T_ALL - 0.05) {
    const p = ramp(t, T_ALL - 0.05, T_ALL + 0.2);
    return (
      <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, background: C.forest, borderRadius: 30, padding: "16px 34px 18px", transform: `scale(${0.85 + 0.15 * p})`, opacity: p, boxShadow: "0 10px 0 rgba(31,42,20,0.15)", fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.paper, whiteSpace: "nowrap" }}>
          <span style={{ color: "#B9D27A" }}>2 rows</span> × <span style={{ color: C.banana }}>4</span> = all 8
        </div>
      </div>
    );
  }
  let cur = -1;
  SEQ.forEach((s, i) => { if (t >= TB[s.b] - 0.02) cur = i; });
  if (cur < 0) {
    const fr = t >= 9.4 ? "Finger row" : "Forearm row";
    const p = ramp(t, t >= 9.4 ? 9.45 : 5.2, (t >= 9.4 ? 9.45 : 5.2) + 0.25);
    return (
      <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center" }}>
        <div style={{ background: C.forest, borderRadius: 30, padding: "14px 32px 18px", opacity: p, transform: `scale(${0.85 + 0.15 * p})`, fontFamily: FONT, fontWeight: 800, fontSize: 48, color: C.paper, whiteSpace: "nowrap" }}>
          {fr} <span style={{ color: C.banana }}>· thumb side first</span>
        </div>
      </div>
    );
  }
  const s = SEQ[cur];
  if (cur >= 4 && t < TB.Tm - 0.02) return null;
  const t0 = TB[s.b];
  const p = ramp(t, t0 - 0.02, t0 + 0.2);
  const name = NAME[s.b];
  return (
    <div key={cur} style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, background: C.forest, borderRadius: 30, padding: "12px 28px 14px 14px", transform: `scale(${0.85 + 0.15 * p})`, opacity: p, boxShadow: "0 10px 0 rgba(31,42,20,0.15)" }}>
        <LChip l={s.l} size={76} col={s.prox ? C.matcha : C.red} />
        <div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.paper, lineHeight: 1.05, whiteSpace: "nowrap" }}>
            <span style={{ background: C.banana, color: C.forest, borderRadius: 10, padding: "0 6px 2px" }}>{name[0]}</span>{name.slice(1)}
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 28, color: "#B9D27A", marginTop: 2, whiteSpace: "nowrap" }}>{(s.prox ? "forearm row · " : "finger row · ") + NOTE[s.b]}</div>
        </div>
      </div>
    </div>
  );
};

/* name tags on the complete diagram (hold) — positions in diagram units, two staggered levels so they never touch */
const TAGS: { b: BoneId; dy: number; dx?: number }[] = [
  { b: "S", dy: 100, dx: -40 }, { b: "L", dy: 100, dx: -12 }, { b: "Tq", dy: 100, dx: 45 }, { b: "P", dy: 40, dx: 115 },
  { b: "Tm", dy: -96 }, { b: "Cp", dy: -150 }, { b: "Td", dy: -205 }, { b: "H", dy: -96 },
];
const HoldTags: React.FC<{ t: number; X0: number; Y0: number; s: number }> = ({ t, X0, Y0, s }) => (
  <>
    {TAGS.map(({ b, dy, dx = 0 }, i) => {
      const bone = BONES.find((x) => x.id === b)!;
      const p = ramp(t, T_ALL + i * 0.05, T_ALL + 0.25 + i * 0.05);
      if (p <= 0) return null;
      const cx0 = X0 + bone.cx * s, cy0 = Y0 + bone.cy * s;
      const ty = cy0 + dy * s, tx = cx0 + dx * s;
      const bx = cx0 + (dx > 60 ? bone.rx * 0.8 * s : 0), by = dx > 60 ? cy0 : cy0 + Math.sign(dy) * bone.ry * 0.7 * s;
      const prox = ["S", "L", "Tq", "P"].includes(b);
      return (
        <React.Fragment key={b}>
          <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: p }} width={1} height={1}>
            <line x1={bx} y1={by} x2={tx} y2={ty} stroke={C.paper} strokeWidth={9} strokeLinecap="round" />
            <line x1={bx} y1={by} x2={tx} y2={ty} stroke={C.forest} strokeWidth={4} strokeLinecap="round" />
            <circle cx={bx} cy={by} r={8} fill={prox ? C.matcha : C.red} stroke={C.forest} strokeWidth={3} />
          </svg>
          <div style={{ position: "absolute", left: tx, top: ty, transform: `translate(-50%, -50%) scale(${0.8 + 0.2 * p})`, opacity: p, background: prox ? C.matcha : C.red, color: C.paper, border: `3px solid ${C.forest}`, fontFamily: FONT, fontWeight: 800, fontSize: 27, padding: "3px 12px 6px", borderRadius: 12, whiteSpace: "nowrap" }}>
            {NAME[b]}
          </div>
        </React.Fragment>
      );
    })}
  </>
);

/* 1. Hook: Gray's 1918 Fig. 220 visible from frame 0 + challenge */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={2.6} push={0.02}>
      <div style={center(0, pop(t, -0.4, 0.25))}>
        <Big size={124}>NAME ALL 8</Big>
      </div>
      <div style={center(128, pop(t, -0.3, 0.25))}>
        <Big size={84} color={C.red}>WRIST BONES</Big>
      </div>
      <PlateBox74 src={P220} aspect={A220} x={30} y={250} w={800} h={610} a={-0.6} b={2.6} from={[0.5, 0.45, 1.0]} to={[0.46, 0.36, 0.8]}
        labels={[
          { x: 0.48, y: 0.47, text: "carpal bones", t: 0.6, hot: true, ox: 120, oy: 150 },
        ]} />
      <div style={center(880, pop(t, 0.05, 0.25))}>
        {t < 1.76 ? <Pill size={34} bg={C.forest}>carpal bones · mnemonic</Pill> : (
          <div style={{ ...pop(t, 1.78, 0.25) }}><Pill size={40} bg={C.banana} color={C.forest}>1 sentence · 8 letters</Pill></div>
        )}
      </div>
    </Scene>
  );
};

/* 2. The mnemonic card, letters revealed one by one */
export const V2: React.FC = () => {
  const t = useT();
  const tagP = ramp(t, 4.6, 4.85);
  return (
    <Scene start={2.6} end={5.1} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, ...pop(t, 2.62, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: C.banana }}>CARPAL BONES MNEMONIC</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 98, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#B9D27A" }}>first letters = the bones, in order</div>
        <div style={{ position: "absolute", left: 60, width: 460, top: 176, display: "flex", flexDirection: "column", gap: 6 }}>
          {MN.map(([w, s], i) => {
            const p = ramp(t, s - 0.08, s + 0.12);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", opacity: 0.18 + 0.82 * p, transform: `translateX(${(1 - p) * 30}px)`, marginTop: i === 4 ? 26 : 0 }}>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64, lineHeight: 1.08, color: C.paper, whiteSpace: "nowrap" }}>
                  <span style={{ background: p > 0.5 ? (i < 4 ? "#B9D27A" : C.banana) : "rgba(247,246,236,0.14)", color: C.forest, borderRadius: 14, padding: "0 12px 4px" }}>{w[0]}</span>
                  {w.slice(1)}
                </div>
              </div>
            );
          })}
        </div>
        {[0, 1].map((k) => (
          <div key={k} style={{ position: "absolute", left: 530, top: k === 0 ? 220 : 556, width: 250, opacity: tagP, transform: `translateX(${(1 - tagP) * 30}px)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 8, height: 230, borderRadius: 4, background: k === 0 ? "#B9D27A" : C.banana }} />
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, lineHeight: 1.1, color: k === 0 ? "#B9D27A" : C.banana }}>{k === 0 ? "forearm" : "finger"}<br />row</div>
            </div>
          </div>
        ))}
      </div>
    </Scene>
  );
};

/* 3. Our own diagram: each bone lights up as it is named, then the complete labelled map */
export const V3: React.FC = () => {
  const t = useT();
  const k = cam(t, [[5.1, 0.98, 380, 370], [5.7, 1.3, 400, 470], [9.2, 1.3, 400, 470], [9.75, 1.2, 370, 322], [12.6, 1.2, 370, 322], [13.15, 1.0, 380, 330], [14.75, 1.0, 380, 330]]);
  const [, s, cx, cy] = k;
  const top = 134, h = 728;
  const X0 = 430 - cx * s, Y0 = h / 2 - cy * s;
  return (
    <Scene start={5.1} end={14.75} push={0.004}>
      <div style={{ position: "absolute", left: 0, top, width: 860, height: h, overflow: "hidden", borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}` }}>
        <div style={{ position: "absolute", left: X0, top: Y0 }}>
          <Wrist t={t} w={800 * s} lit={TB} rowHi={{ p: 5.3, d: 9.5 }} thumbGlow={6.16} hookGlow={12.2} />
        </div>
        <HoldTags t={t} X0={X0} Y0={Y0} s={s} />
        <div style={{ position: "absolute", left: 16, bottom: 12, fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.forest, opacity: 0.55 }}>left hand · palm view · diagram: Book Plume</div>
      </div>
      <Strip t={t} top={34} />
      <NameCard t={t} top={878} />
    </Scene>
  );
};

/* 4. Quick test with 3-2-1 */
export const V4: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[18.89, 3], [19.53, 2], [20.17, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < 20.75) { n = v; n0 = s; } });
  const Opt = ({ name, i }: { name: string; i: number }) => (
    <div style={{ width: 360, height: 300, borderRadius: 30, background: "rgba(247,246,236,0.08)", border: "4px solid rgba(247,246,236,0.22)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, boxSizing: "border-box", ...pop(t, i === 0 ? 15.57 : 16.35, 0.25) }}>
      <LChip l="T" size={96} col={i === 0 ? C.red : "#7B8C63"} />
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.paper }}>{name}</div>
    </div>
  );
  return (
    <Scene start={14.75} end={20.75}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 14.8, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 42, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 30, width: 760, top: 104, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 62, lineHeight: 1.1, color: C.paper, ...pop(t, 15.0) }}>
          Which one sits <span style={{ color: C.banana }}>UNDER YOUR THUMB?</span>
        </div>
        <div style={{ position: "absolute", left: 40, top: 296, width: 740, display: "flex", gap: 20, justifyContent: "center" }}>
          <Opt name="Trapezium" i={0} />
          <Opt name="Trapezoid" i={1} />
        </div>
        {n !== null ? (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 650, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 170, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        ) : (
          <div style={{ position: "absolute", left: 0, width: 820, top: 720, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, color: "#B9D27A", opacity: ramp(t, 17.6, 17.9) }}>pause · say it out loud</div>
        )}
      </div>
    </Scene>
  );
};

/* 5. Answer on the real thing: Gray's 1918 Fig. 220 */
export const V5: React.FC = () => {
  const t = useT();
  const z = ramp(t, 23.5, 23.72);
  const zOut = ramp(t, 23.28, 23.46);
  return (
    <Scene start={20.75} end={26.75} push={0.006}>
      <div style={center(34, pop(t, 20.8, 0.25))}>
        <Pill size={46} bg={C.banana} color={C.forest}>✓ TRAPEZIUM</Pill>
      </div>
      <div style={{ ...center(124), opacity: ramp(t, 21.5, 21.75) * (1 - zOut) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest, whiteSpace: "nowrap" }}>
          trapezi<span style={{ background: C.red, color: C.paper, borderRadius: 8, padding: "0 6px 2px" }}>UM</span> = under the th<span style={{ background: C.red, color: C.paper, borderRadius: 8, padding: "0 6px 2px" }}>UM</span>b
        </div>
      </div>
      <div style={{ ...center(124), opacity: z }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest, whiteSpace: "nowrap" }}>
          trapez<span style={{ background: C.matcha, color: C.paper, borderRadius: 8, padding: "0 6px 2px" }}>OID</span> = inside, 4 bones around it
        </div>
      </div>
      <PlateBox74 src={P220} aspect={A220} x={30} y={196} w={800} h={650} a={20.75} b={26.75} from={[0.36, 0.44, 0.72]} to={[0.33, 0.44, 0.62]} ls={34}
        labels={[
          { x: 0.125, y: 0.44, text: "trapezium", t: 20.86, hot: true, ox: 30, oy: 235 },
          { x: 0.3, y: 0.43, text: "trapezoid", t: 23.54, hot: true, ox: 90, oy: 190 },
        ]} />
      <div style={{ position: "absolute", left: 0, width: 860, top: 862, display: "flex", justifyContent: "center", opacity: ramp(t, 21.2, 21.45) }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 16px 10px", fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.forest, whiteSpace: "nowrap" }}>
          <span style={{ color: C.matcha }}>1918 atlas names:</span> {z < 0.5 ? "greater multangular = trapezium" : "lesser multangular = trapezoid"}
        </div>
      </div>
    </Scene>
  );
};

/* 6. Save + cheat sheet */
export const V6: React.FC = () => {
  const t = useT();
  const s0 = 26.75;
  const b = ramp(t, s0 + 0.05, s0 + 0.4);
  const Row = ({ l, n, note, col, i }: { l: string; n: string; note: string; col: string; i: number }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 14, height: 60, opacity: ramp(t, s0 + 0.2 + i * 0.05, s0 + 0.4 + i * 0.05) }}>
      <LChip l={l} size={50} col={col} />
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.forest, whiteSpace: "nowrap" }}>{n}</div>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, color: C.forest, opacity: 0.55, whiteSpace: "nowrap" }}>{note}</div>
    </div>
  );
  return (
    <Scene start={s0} end={28.9}>
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
      <div style={{ position: "absolute", left: 30, top: 190, width: 800, height: 730, borderRadius: 40, background: C.card, border: `3px solid ${C.line}`, boxShadow: "0 18px 40px rgba(31,42,20,0.12)", padding: "24px 36px", boxSizing: "border-box", ...pop(t, s0 + 0.15, 0.3) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 33, color: C.forest, whiteSpace: "nowrap" }}>Sally Left The Party To Take Cathy Home</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.matcha, letterSpacing: 2, marginTop: 20 }}>FOREARM ROW · THUMB → PINKY</div>
        {SEQ.slice(0, 4).map((q, i) => <Row key={i} l={q.l} n={NAME[q.b]} note={NOTE[q.b]} col={C.matcha} i={i} />)}
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.red, letterSpacing: 2, marginTop: 16 }}>FINGER ROW · THUMB → PINKY</div>
        {SEQ.slice(4).map((q, i) => <Row key={i} l={q.l} n={NAME[q.b]} note={NOTE[q.b]} col={C.red} i={i + 4} />)}
      </div>
    </Scene>
  );
};

/* 7. End card (≤ 1.5 s) — no store, no product */
export const V7: React.FC = () => {
  const t = useT();
  const s0 = 28.9;
  return (
    <Scene start={s0} end={30.3}>
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
