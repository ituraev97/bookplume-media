import React from "react";
import { C, FONT, Pill, Scene, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, pop } from "./Scenes67";
import { PlateBox74 } from "./Scenes74";
import { IB, INAME, Iliac } from "./Iliac92";

export const A539 = 1623 / 1835;
export const P539 = "plates/pelvis539.png";
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* voice times (words.json) */
export const TB: Record<IB, number> = { IL: 6.12, LS: 7.04, SG: 7.84, IG: 7.84, P: 8.46, IV: 9.66, M: 10.6, V: 11.41, O: 12.0, U: 12.79 };
const MN: [string, number][] = [["I", 3.3], ["Love", 3.4], ["Going", 3.71], ["Places", 3.97], ["In", 4.44], ["My", 4.5], ["Very", 4.65], ["Own", 5.01], ["Underwear", 5.32]];
/* the 9 letters in order and the branch(es) each stands for */
export const SEQ: { l: string; b: IB; post?: boolean }[] = [
  { l: "I", b: "IL", post: true }, { l: "L", b: "LS", post: true }, { l: "G", b: "SG", post: true }, { l: "P", b: "P" }, { l: "I", b: "IV" },
  { l: "M", b: "M" }, { l: "V", b: "V" }, { l: "O", b: "O" }, { l: "U", b: "U" },
];

export const LChip: React.FC<{ l: string; size?: number; on?: number; hot?: boolean; col?: string; dark?: boolean }> = ({ l, size = 70, on = 1, hot, col = C.red, dark }) => (
  <div style={{ width: size, height: size, flex: `0 0 ${size}px`, borderRadius: size * 0.28, background: on > 0.5 ? col : dark ? "rgba(247,246,236,0.1)" : "rgba(31,42,20,0.08)", border: `4px solid ${on > 0.5 ? C.forest : dark ? "rgba(247,246,236,0.3)" : "rgba(31,42,20,0.25)"}`, color: on > 0.5 ? C.paper : dark ? "rgba(247,246,236,0.55)" : "rgba(31,42,20,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.58, transform: `scale(${hot ? 1.16 : 1})`, boxShadow: hot ? `0 0 0 6px ${C.banana}` : "none", boxSizing: "border-box", lineHeight: 1 }}>
    {l}
  </div>
);

const Strip: React.FC<{ t: number; top?: number }> = ({ t, top = 6 }) => {
  let cur = -1;
  SEQ.forEach((s, i) => { if (t >= TB[s.b] - 0.05) cur = i; });
  return (
    <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", gap: 10 }}>
      {SEQ.map((s, i) => {
        const p = ramp(t, TB[s.b] - 0.05, TB[s.b] + 0.12);
        return <div key={i} style={{ transform: `scale(${1 + 0.2 * p * (1 - ramp(t, TB[s.b] + 0.12, TB[s.b] + 0.4))})` }}><LChip l={s.l} size={78} on={p} hot={cur === i} col={s.post ? C.matcha : C.red} /></div>;
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

/* the big name card under the diagram: current branch with its mnemonic letter */
const NOTE: Partial<Record<IB, string>> = {
  IL: "up to iliacus + lower back", LS: "into the sacral foramina", SG: "superior + inferior gluteal", P: "down to the perineum", IV: "to the bladder base",
  M: "to the rectum", V: "♀ females · + uterine artery", O: "out through the obturator canal", U: "gives the superior vesical",
};
const NameCard: React.FC<{ t: number; top: number }> = ({ t, top }) => {
  let cur = -1;
  SEQ.forEach((s, i) => { if (t >= TB[s.b] - 0.02) cur = i; });
  if (cur < 0) return null;
  const s = SEQ[cur];
  const t0 = TB[s.b];
  const p = ramp(t, t0 - 0.02, t0 + 0.2);
  const name = s.b === "SG" ? "Gluteal ×2" : s.b === "P" ? "internal Pudendal" : INAME[s.b];
  const li = s.b === "P" ? 9 : 0;
  return (
    <div key={cur} style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, background: C.forest, borderRadius: 30, padding: "12px 28px 14px 14px", transform: `scale(${0.85 + 0.15 * p})`, opacity: p, boxShadow: "0 10px 0 rgba(31,42,20,0.15)" }}>
        <LChip l={s.l} size={76} col={s.post ? C.matcha : C.red} />
        <div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 50, color: C.paper, lineHeight: 1.05, whiteSpace: "nowrap" }}>
            {name.slice(0, li)}<span style={{ background: C.banana, color: C.forest, borderRadius: 10, padding: "0 6px 2px" }}>{name[li]}</span>{name.slice(li + 1)}
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 27, color: "#B9D27A", marginTop: 2, whiteSpace: "nowrap" }}>{(s.post ? "posterior trunk · " : "anterior trunk · ") + (NOTE[s.b] ?? "")}</div>
        </div>
      </div>
    </div>
  );
};

/* 1. Hook: Gray's 1918 Fig. 539 visible from frame 0 + challenge */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={3.0} push={0.02}>
      <div style={center(0, pop(t, -0.4, 0.25))}>
        <Big size={116}>NAME EVERY</Big>
      </div>
      <div style={center(120, pop(t, -0.3, 0.25))}>
        <Big size={72} color={C.red}>INTERNAL ILIAC BRANCH</Big>
      </div>
      <PlateBox74 src={P539} aspect={A539} x={30} y={250} w={800} h={610} a={-0.6} b={3.0} from={[0.6, 0.4, 0.74]} to={[0.64, 0.39, 0.58]}
        labels={[
          { x: 0.6, y: 0.305, text: "internal iliac", t: 0.85, hot: true, ox: -60, oy: -110 },
          { x: 0.66, y: 0.46, text: "branches?", t: 1.65, hot: false, ox: 150, oy: 120 },
        ]} />
      <div style={center(880, pop(t, 0.05, 0.25))}>
        {t < 2.22 ? <Pill size={34} bg={C.forest}>internal iliac artery · mnemonic</Pill> : (
          <div style={{ ...pop(t, 2.24, 0.25) }}><Pill size={40} bg={C.banana} color={C.forest}>1 sentence · 9 letters</Pill></div>
        )}
      </div>
    </Scene>
  );
};

/* 2. The mnemonic card: I Love Going Places In My Very Own Underwear */
export const V2: React.FC = () => {
  const t = useT();
  return (
    <Scene start={3.0} end={6.0} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, ...pop(t, 3.02, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: C.banana }}>INTERNAL ILIAC MNEMONIC</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 98, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#B9D27A" }}>first letters = the branches, in order</div>
        <div style={{ position: "absolute", left: 50, width: 720, top: 180, display: "flex", flexDirection: "column", gap: 4 }}>
          {MN.map(([w, s], i) => {
            const p = ramp(t, s - 0.08, s + 0.12);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, opacity: 0.18 + 0.82 * p, transform: `translateX(${(1 - p) * 30}px)` }}>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 62, lineHeight: 1.12, color: C.paper, whiteSpace: "nowrap" }}>
                  <span style={{ background: p > 0.5 ? (i < 3 ? "#B9D27A" : C.banana) : "rgba(247,246,236,0.14)", color: C.forest, borderRadius: 14, padding: "0 12px 4px" }}>{w[0]}</span>
                  {w.slice(1)}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", right: 46, top: 196, width: 240, textAlign: "right", fontFamily: FONT, fontWeight: 800, fontSize: 26, color: "#B9D27A", lineHeight: 1.25, opacity: ramp(t, 5.4, 5.7) }}>
          9 letters<br />→ 9 branches
        </div>
      </div>
    </Scene>
  );
};

/* 3. Our own diagram: every branch lights up as it is named */
export const V3: React.FC = () => {
  const t = useT();
  const k = cam(t, [[6.0, 0.86, 520, 500], [6.45, 1.08, 660, 380], [8.1, 1.08, 660, 400], [8.6, 0.86, 520, 560], [11.0, 0.88, 500, 600], [12.2, 0.9, 420, 520], [13.5, 0.88, 440, 500]]);
  const [, s, cx, cy] = k;
  const top = 150, h = 712;
  const X0 = 430 - cx * s, Y0 = h / 2 - cy * s;
  const lit: Partial<Record<IB | "AT" | "PT", number>> = { PT: 6.0, ...TB, AT: 8.4 };
  let hot: IB[] = [];
  SEQ.forEach((q) => { if (t >= TB[q.b] - 0.05) hot = q.b === "SG" ? ["SG", "IG"] : [q.b]; });
  return (
    <Scene start={6.0} end={13.5} push={0.004}>
      <div style={{ position: "absolute", left: 0, top, width: 860, height: h, overflow: "hidden", borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}` }}>
        <div style={{ position: "absolute", left: X0, top: Y0 }}>
          <Iliac t={t} w={1000 * s} id="v3" lit={lit} hot={hot} />
        </div>
        <div style={{ position: "absolute", left: 16, bottom: 12, fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.forest, opacity: 0.55 }}>right side · medial view · diagram: Book Plume</div>
      </div>
      <Strip t={t} top={46} />
      <NameCard t={t} top={878} />
    </Scene>
  );
};

/* 4. Quick test with 3-2-1 */
export const V4: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[16.62, 3], [17.25, 2], [17.89, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < 18.45) { n = v; n0 = s; } });
  return (
    <Scene start={13.5} end={18.45}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 13.55, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 42, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 30, width: 760, top: 104, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 60, lineHeight: 1.1, color: C.paper, ...pop(t, 14.4) }}>
          Which 3 come from the <span style={{ color: "#B9D27A" }}>POSTERIOR TRUNK?</span>
        </div>
        <div style={{ position: "absolute", left: 40, top: 300, width: 740, display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
          {SEQ.map((q, i) => (
            <div key={i} style={{ width: 236, height: 104, borderRadius: 22, background: "rgba(247,246,236,0.08)", border: "3px solid rgba(247,246,236,0.18)", display: "flex", alignItems: "center", gap: 12, padding: "0 12px", boxSizing: "border-box", ...pop(t, 14.9 + i * 0.07, 0.25) }}>
              <LChip l={q.l} size={58} col="#7B8C63" />
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 25, color: C.paper, lineHeight: 1.08, whiteSpace: "pre" }}>{q.b === "SG" ? "Gluteal ×2" : INAME[q.b].replace(" ", "\n")}</div>
            </div>
          ))}
        </div>
        {n !== null ? (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 690, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 150, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        ) : (
          <div style={{ position: "absolute", left: 0, width: 820, top: 740, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#B9D27A", opacity: ramp(t, 15.6, 15.8) }}>pause · say them out loud</div>
        )}
      </div>
    </Scene>
  );
};

/* 5. Answer on the real thing: Gray's 1918 Fig. 539 + P.S. I Love You */
export const V5: React.FC = () => {
  const t = useT();
  const at: [IB, number][] = [["IL", 19.62], ["LS", 20.37], ["SG", 21.22]];
  const ps = ramp(t, 22.45, 22.7);
  return (
    <Scene start={18.45} end={23.7} push={0.006}>
      <div style={center(34, pop(t, 18.5, 0.25))}>
        <Pill size={44} bg={C.banana} color={C.forest}>✓ the FIRST 3 letters</Pill>
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 118, display: "flex", justifyContent: "center", gap: 12 }}>
        {at.map(([b, s]) => {
          const p = ramp(t, s - 0.05, s + 0.15);
          return (
            <div key={b} style={{ display: "flex", alignItems: "center", gap: 8, background: p > 0.5 ? C.matcha : "rgba(31,42,20,0.06)", borderRadius: 20, padding: "8px 14px 8px 8px", border: `3px solid ${p > 0.5 ? C.forest : C.line}`, transform: `scale(${0.92 + 0.08 * p})` }}>
              <LChip l={b === "IL" ? "I" : b === "LS" ? "L" : "G"} size={52} col={C.forest} on={1} />
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: p > 0.5 ? C.paper : "rgba(31,42,20,0.4)", whiteSpace: "nowrap" }}>{INAME[b]}</div>
            </div>
          );
        })}
      </div>
      <PlateBox74 src={P539} aspect={A539} x={30} y={196} w={800} h={650} a={18.45} b={23.7} from={[0.69, 0.37, 0.52]} to={[0.7, 0.37, 0.46]} ls={32}
        labels={[
          { x: 0.6, y: 0.305, text: "internal iliac", t: 18.6, hot: false, ox: 30, oy: 200 },
          { x: 0.714, y: 0.333, text: "iliolumbar", t: 19.62, hot: true, ox: 60, oy: -130 },
          { x: 0.75, y: 0.38, text: "superior gluteal", t: 21.22, hot: true, ox: 30, oy: 190 },
        ]} />
      <div style={{ position: "absolute", left: 6, top: 852, opacity: ramp(t, 19.0, 19.25) * (1 - ps) }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 16px 10px", fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.forest, whiteSpace: "nowrap" }}>
          <span style={{ color: C.matcha }}>1918 atlas name:</span> “hypogastric artery” = internal iliac
        </div>
      </div>
      {ps > 0 && (
        <div style={{ position: "absolute", left: 30, top: 700, width: 800, borderRadius: 34, background: C.forest, padding: "20px 28px 22px", boxSizing: "border-box", transform: `scale(${0.85 + 0.15 * ps})`, opacity: ps, boxShadow: "0 16px 40px rgba(31,42,20,0.3)" }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64, color: C.paper, lineHeight: 1, whiteSpace: "nowrap", textAlign: "center" }}>
            <span style={{ color: C.banana }}>P.S.</span> I Love You <span style={{ color: C.redLight }}>♥</span>
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 29, color: "#B9D27A", marginTop: 12, textAlign: "center", whiteSpace: "nowrap" }}>
            Posterior: Superior gluteal · Iliolumbar · Lateral sacral
          </div>
        </div>
      )}
    </Scene>
  );
};

/* 6. Save + cheat sheet */
export const V6: React.FC = () => {
  const t = useT();
  const s0 = 23.7;
  const b = ramp(t, s0 + 0.05, s0 + 0.4);
  const ant: [string, string][] = [["P", "internal Pudendal"], ["I", "Inferior vesical"], ["M", "Middle rectal"], ["V", "Vaginal ♀ (+ uterine)"], ["O", "Obturator"], ["U", "Umbilical → sup. vesical"]];
  const post: [string, string][] = [["I", "Iliolumbar"], ["L", "Lateral sacral"], ["G", "Gluteal: superior (+ inferior)"]];
  const Row = ({ l, n, col, i }: { l: string; n: string; col: string; i: number }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 14, height: 62, opacity: ramp(t, s0 + 0.2 + i * 0.05, s0 + 0.4 + i * 0.05) }}>
      <LChip l={l} size={52} col={col} />
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 31, color: C.forest, whiteSpace: "nowrap" }}>{n}</div>
    </div>
  );
  return (
    <Scene start={s0} end={26.0}>
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
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 27, color: C.forest, letterSpacing: 1, whiteSpace: "nowrap" }}>I Love Going Places In My Very Own Underwear</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.matcha, letterSpacing: 2, marginTop: 18 }}>POSTERIOR TRUNK · P.S. I LOVE YOU</div>
        {post.map(([l, n], i) => <Row key={i} l={l} n={n} col={C.matcha} i={i} />)}
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.red, letterSpacing: 2, marginTop: 14 }}>ANTERIOR TRUNK · THE REST</div>
        {ant.map(([l, n], i) => <Row key={i} l={l} n={n} col={C.red} i={i + 3} />)}
      </div>
    </Scene>
  );
};

/* 7. End card (≤ 1.5 s) */
export const V7: React.FC = () => {
  const t = useT();
  const s0 = 26.0;
  return (
    <Scene start={s0} end={27.4}>
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
