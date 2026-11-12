import React from "react";
import { C, FONT, Pill, Scene, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, pop } from "./Scenes67";
import { PlateBox74 } from "./Scenes74";
import { FA, FrontNeck, K, KCOL, KLAB, KORDER, SA, SectNeck } from "./Neck86";

export const A384 = 1878 / 2050;
export const PLATE = "plates/f384_neck.png";
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* voice times (words.json) */
export const NT: Record<K, number> = { IC: 6.12, VG: 7.81, CC: 9.89, IV: 11.9 };
export const NAME: Record<K, string> = { IC: "Internal carotid artery", VG: "Vagus nerve (CN X)", CC: "Common carotid artery", IV: "Internal jugular vein" };
export const TO: Record<K, string> = { IC: "up top: above the split", VG: "behind, between artery + vein", CC: "down low: below the split", IV: "lateral (artery = medial)" };

export const Chip: React.FC<{ k: K | "?"; size?: number; on?: number; hot?: boolean }> = ({ k, size = 64, on = 1, hot }) => {
  const q = k === "?";
  const lit = on > 0.5 && !q;
  return (
    <div style={{ position: "relative", width: size, height: size, flex: `0 0 ${size}px`, borderRadius: size * 0.28, background: q ? C.forest : lit ? KCOL[k as K] : "rgba(31,42,20,0.08)", border: `4px solid ${q ? C.banana : lit ? C.forest : "rgba(31,42,20,0.25)"}`, color: q ? C.banana : lit ? (k === "CC" || k === "IV" ? C.paper : C.forest) : "rgba(31,42,20,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * (q ? 0.62 : 0.46), letterSpacing: -1, transform: `scale(${hot ? 1.16 : 1})`, boxShadow: hot ? `0 0 0 6px ${C.banana}` : "none" }}>
      {q ? "?" : KLAB[k as K]}
    </div>
  );
};

const Counter: React.FC<{ t: number; top?: number }> = ({ t, top = 10 }) => {
  const n = KORDER.filter((k) => t >= NT[k] - 0.05).length;
  return (
    <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", alignItems: "center", gap: 12 }}>
      {KORDER.map((k) => {
        const p = ramp(t, NT[k] - 0.05, NT[k] + 0.15);
        const hot = t >= NT[k] - 0.05 && t < NT[k] + 1.4;
        return <div key={k} style={{ transform: `scale(${1 + 0.25 * p * (1 - ramp(t, NT[k] + 0.15, NT[k] + 0.45))})` }}><Chip k={k} size={68} on={p} hot={hot} /></div>;
      })}
      <div style={{ marginLeft: 12, background: C.forest, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 36, borderRadius: 20, padding: "4px 18px 8px", whiteSpace: "nowrap" }}>{n}/4 inside</div>
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
type P = (m: [number, number]) => [number, number];
const Stage: React.FC<{ k: Kf; h?: number; top?: number; render: (w: number) => React.ReactNode; children?: (P: P) => React.ReactNode }> = ({ k, render, children, h = 940, top = 0 }) => {
  const [, s, cx, cy] = k;
  const u = (860 / 900) * s;
  const X0 = 430 - cx * u, Y0 = h / 2 - cy * u;
  const Pf: P = (m) => [X0 + m[0] * u, top + Y0 + m[1] * u];
  return (
    <>
      <div style={{ position: "absolute", left: 0, top, width: 860, height: h, overflow: "hidden", borderRadius: 40, background: C.paper, boxShadow: `0 0 0 5px ${C.line}` }}>
        <div style={{ position: "absolute", left: X0, top: Y0 }}>{render(860 * s)}</div>
      </div>
      {children && children(Pf)}
    </>
  );
};
const Call: React.FC<{ t: number; t0: number; a: [number, number]; to: [number, number]; text: string; bg?: string; fg?: string; size?: number; t1?: number }> = ({ t, t0, a, to, text, bg = C.forest, fg = C.paper, size = 36, t1 }) => {
  const p = ramp(t, t0, t0 + 0.3) * (t1 ? 1 - ramp(t, t1, t1 + 0.2) : 1);
  if (p <= 0) return null;
  const [ax, ay] = a, [tx, ty] = to;
  return (
    <>
      <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: p }}>
        <line x1={ax} y1={ay} x2={ax + (tx - ax) * p} y2={ay + (ty - ay) * p} stroke={C.paper} strokeWidth={11} strokeLinecap="round" />
        <line x1={ax} y1={ay} x2={ax + (tx - ax) * p} y2={ay + (ty - ay) * p} stroke={C.forest} strokeWidth={5} strokeLinecap="round" />
        <circle cx={ax} cy={ay} r={12} fill={C.banana} stroke={C.forest} strokeWidth={4} />
      </svg>
      <div style={{ position: "absolute", left: tx, top: ty, transform: `translate(-50%, -50%) scale(${0.8 + 0.2 * p})`, opacity: p }}>
        <Pill size={size} bg={bg} color={fg} style={{ whiteSpace: "pre", textAlign: "center", lineHeight: 1.08 }}>{text}</Pill>
      </div>
    </>
  );
};
const Note1918: React.FC<{ t: number; t0: number; text: React.ReactNode; top?: number; left?: number; size?: number }> = ({ t, t0, text, top = 856, left = 30, size = 25 }) => (
  <div style={{ position: "absolute", left, top, opacity: ramp(t, t0, t0 + 0.25), transform: `scale(${0.8 + 0.2 * ramp(t, t0, t0 + 0.25)})`, transformOrigin: "0 0" }}>
    <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 16px 10px", fontFamily: FONT, fontWeight: 800, fontSize: size, color: C.forest, lineHeight: 1.2, boxShadow: "0 6px 0 rgba(31,42,20,0.08)", whiteSpace: "nowrap" }}>
      <span style={{ color: C.matcha }}>1918 atlas name:</span> {text}
    </div>
  </div>
);
const Tip: React.FC<{ t: number; t0: number; top: number; children: React.ReactNode; bg?: string; fg?: string; size?: number; t1?: number }> = ({ t, t0, top, children, bg = C.banana, fg = C.forest, size = 34, t1 }) =>
  t >= t0 - 0.05 && (!t1 || t < t1 + 0.2) ? (
    <div style={{ ...center(top), ...pop(t, t0, 0.25), opacity: ramp(t, t0, t0 + 0.2) * (t1 ? 1 - ramp(t, t1, t1 + 0.2) : 1) }}>
      <Pill size={size} bg={bg} color={fg} style={{ whiteSpace: "nowrap" }}>{children}</Pill>
    </div>
  ) : null;

/* 1. Hook: Gray's 1918 Fig. 384 (neck section at C6) visible from frame 0 + challenge */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={3.08} push={0.02}>
      <div style={center(18, pop(t, -0.4, 0.25))}>
        <Big size={104}>CAROTID SHEATH</Big>
      </div>
      <div style={center(128, pop(t, -0.3, 0.25))}>
        <Big size={86} color={C.red}>NAME ALL 4 INSIDE?</Big>
      </div>
      <PlateBox74 src={PLATE} aspect={A384} x={30} y={262} w={800} h={600} a={-0.6} b={3.08} from={[0.47, 0.37, 0.86]} to={[0.455, 0.35, 0.5]}
        labels={[{ x: 0.455, y: 0.345, text: "carotid sheath", t: 1.39, hot: true, ox: -40, oy: -200 }]} />
      <div style={{ position: "absolute", left: 0, width: 860, top: 756, display: "flex", justifyContent: "center", gap: 18 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={pop(t, 0.35 + i * 0.12, 0.25)}><Chip k="?" size={80} /></div>
        ))}
      </div>
      <div style={center(884, pop(t, 0.1, 0.25))}>
        <Pill size={33} bg={C.forest}>neck anatomy · mnemonic</Pill>
      </div>
    </Scene>
  );
};

/* 2. Mnemonic card: I see 10 CC's in the IV */
export const V2: React.FC = () => {
  const t = useT();
  const W: [string, K | null, number][] = [["I see", "IC", 3.63], ["10", "VG", 3.89], ["CC's", "CC", 4.12], ["in the", null, 4.73], ["IV", "IV", 4.95]];
  return (
    <Scene start={3.08} end={5.65} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 820, height: 840, borderRadius: 48, background: C.forest, ...pop(t, 3.1, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 56, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 8, color: C.banana }}>THE MNEMONIC</div>
        <div style={{ position: "absolute", left: 30, width: 760, top: 130, display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", gap: "10px 22px" }}>
          {W.map(([w, k, t0]) => {
            const p = ramp(t, t0 - 0.08, t0 + 0.15);
            const hl = k && t >= t0 - 0.05;
            return (
              <div key={w} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 104, letterSpacing: -2, color: hl ? (k === "CC" || k === "IV" ? C.paper : C.forest) : C.paper, background: hl ? KCOL[k as K] : "transparent", borderRadius: 24, padding: hl ? "0 18px 8px" : "0 0 8px", opacity: 0.25 + 0.75 * p, transform: `scale(${0.9 + 0.1 * p + 0.06 * Math.sin(Math.min(1, p) * Math.PI)})`, whiteSpace: "nowrap" }}>{w}</div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 470, display: "flex", justifyContent: "center", gap: 22 }}>
          {KORDER.map((k) => {
            const t0 = { IC: 3.63, VG: 3.89, CC: 4.12, IV: 4.95 }[k];
            const p = ramp(t, t0, t0 + 0.2);
            return (
              <div key={k} style={{ transform: `translateY(${(1 - p) * 40}px) scale(${0.7 + 0.3 * p})`, opacity: p, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <Chip k={k} size={120} hot={t >= t0 && t < t0 + 0.35} />
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: "#B9D27A", whiteSpace: "nowrap" }}>{{ IC: "int. carotid", VG: "vagus", CC: "com. carotid", IV: "int. jugular" }[k]}</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 700, display: "flex", justifyContent: "center", ...pop(t, 5.15, 0.25) }}>
          <div style={{ background: C.banana, borderRadius: 22, padding: "10px 28px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.forest }}>= 4 things in the sheath</div>
        </div>
      </div>
    </Scene>
  );
};

const front = (t: number, extra: Partial<React.ComponentProps<typeof FrontNeck>>) => (w: number) => <FrontNeck t={t} w={w} id={extra.id || "f"} {...extra} />;

/* 3. IC: internal carotid, up top (external carotid leaves the sheath) */
export const V3: React.FC = () => {
  const t = useT();
  const k = cam(t, [[5.65, 0.92, 470, 500], [6.1, 1.25, 540, 330], [7.52, 1.3, 540, 320]]);
  return (
    <Scene start={5.65} end={7.52} push={0.004}>
      <Stage k={k} render={front(t, { id: "v3", build: 5.6, lit: { IC: NT.IC, ECA: 6.75 }, hot: t < 6.75 ? ["IC"] : t < 7.3 ? ["IC", "ECA"] : [], dimRest: ramp(t, 6.0, 6.3) })}>
        {(P) => (
          <>
            <Call t={t} t0={6.15} a={P(FA.IC)} to={[230, 260]} text="internal carotid" bg={KCOL.IC} fg={C.forest} size={42} />
            <Call t={t} t0={6.75} a={P(FA.ECA)} to={[610, 760]} text={"external carotid\nLEAVES the sheath"} size={30} />
          </>
        )}
      </Stage>
      <Counter t={t} />
      <Tip t={t} t0={7.02} top={866} size={32}>up top = ABOVE the split</Tip>
      <div style={{ position: "absolute", left: 24, top: 112, ...pop(t, 5.8, 0.25), transformOrigin: "0 0" }}>
        <Pill size={24} bg={C.forest}>right side of the neck, from the front · dashed = sheath</Pill>
      </div>
    </Scene>
  );
};

/* 4. 10: vagus nerve */
export const V4: React.FC = () => {
  const t = useT();
  const k = cam(t, [[7.52, 1.3, 540, 320], [7.95, 1.32, 470, 560], [9.4, 1.36, 465, 570]]);
  return (
    <Scene start={7.52} end={9.4} push={0.004}>
      <Stage k={k} render={front(t, { id: "v4", lit: { IC: 0, VG: NT.VG }, hot: t < 9.2 ? ["VG"] : [], dimRest: 0.7 })}>
        {(P) => (
          <>
            <Call t={t} t0={7.9} a={P(FA.VG)} to={[650, 300]} text="vagus nerve" bg={KCOL.VG} fg={C.forest} size={44} />
            <Call t={t} t0={8.5} a={P([455, 720])} to={[640, 800]} text="cranial nerve 10" size={34} />
          </>
        )}
      </Stage>
      <Counter t={t} />
      <Tip t={t} t0={8.85} top={112} size={30} bg={C.forest} fg={C.paper}>X = 10 in Roman numerals</Tip>
    </Scene>
  );
};

/* 5. CC: common carotid, down low */
export const V5: React.FC = () => {
  const t = useT();
  const k = cam(t, [[9.4, 1.36, 465, 570], [9.85, 1.18, 540, 640], [11.45, 1.2, 540, 650]]);
  return (
    <Scene start={9.4} end={11.45} push={0.004}>
      <Stage k={k} render={front(t, { id: "v5", lit: { IC: 0, VG: 0, CC: NT.CC }, hot: t < 11.2 ? ["CC"] : [], dimRest: 0.7 })}>
        {(P) => (
          <>
            <Call t={t} t0={9.95} a={P(FA.CC)} to={[230, 820]} text="common carotid" bg={KCOL.CC} size={42} />
            <Call t={t} t0={10.65} a={P(FA.BIF)} to={[650, 170]} text={"the split:\ntop of thyroid cartilage"} size={28} />
          </>
        )}
      </Stage>
      <Counter t={t} />
      <Tip t={t} t0={10.8} top={866} size={32}>down low = BELOW the split</Tip>
    </Scene>
  );
};

/* 6. IV: internal jugular vein (+ deep cervical lymph nodes) */
export const V6: React.FC = () => {
  const t = useT();
  const k = cam(t, [[11.45, 1.2, 540, 650], [11.9, 0.98, 470, 520], [13.3, 1.0, 470, 520]]);
  return (
    <Scene start={11.45} end={13.3} push={0.004}>
      <Stage k={k} render={front(t, { id: "v6", lit: { IC: 0, VG: 0, CC: 0, IV: NT.IV, ND: 12.55 }, hot: t < 12.55 ? ["IV"] : t < 13.1 ? ["ND"] : [], nodes: ramp(t, 12.5, 12.9), dimRest: 0.5 })}>
        {(P) => (
          <>
            <Call t={t} t0={11.95} a={P(FA.IV)} to={[200, 170]} text="internal jugular vein" bg={KCOL.IV} size={38} />
            <Call t={t} t0={12.6} a={P(FA.ND)} to={[230, 800]} text={"+ deep cervical\nlymph nodes"} size={28} bg={C.matcha} />
          </>
        )}
      </Stage>
      <Counter t={t} />
    </Scene>
  );
};

const sect = (t: number, extra: Partial<React.ComponentProps<typeof SectNeck>>) => (w: number) => <SectNeck t={t} w={w} id={extra.id || "s"} {...extra} />;

/* 7. Who sits where: cross-section at C6 */
export const V7: React.FC = () => {
  const t = useT();
  const k = cam(t, [[13.3, 0.9, 450, 450], [13.7, 1.55, 280, 360], [16.85, 1.62, 285, 365]]);
  return (
    <Scene start={13.3} end={16.85} push={0.004}>
      <Stage k={k} top={60} h={820} render={sect(t, { id: "v7", lit: { CC: 13.42, IV: 14.35, VG: 15.28, SH: 0 }, hot: t < 14.3 ? ["CC"] : t < 15.25 ? ["IV"] : ["VG"], dimRest: 0.6, arrows: ramp(t, 13.6, 13.9) })}>
        {(P) => (
          <>
            <Call t={t} t0={13.45} a={P(SA.CC)} to={[650, 190]} text="ARTERY = medial" bg={KCOL.CC} size={38} />
            <Call t={t} t0={14.38} a={P(SA.IV)} to={[200, 160]} text="VEIN = lateral" bg={KCOL.IV} size={38} />
            <Call t={t} t0={15.3} a={P(SA.VG)} to={[430, 760]} text="VAGUS = behind, between" bg={KCOL.VG} fg={C.forest} size={38} />
          </>
        )}
      </Stage>
      <Tip t={t} t0={13.4} top={892} size={27} bg={C.forest} fg={C.paper}>cross-section at C6 · front is up · medial = midline</Tip>
    </Scene>
  );
};

/* 8. Quick test */
export const V8: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[20.05, 3], [20.69, 2], [21.33, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < 21.95) { n = v; n0 = s; } });
  const opts = ["Inside it", "Behind it", "In front of it"];
  return (
    <Scene start={16.85} end={21.95}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 820, height: 850, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 16.9, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 106, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 52, lineHeight: 1.12, color: C.paper, ...pop(t, 17.45) }}>
          The <span style={{ color: C.banana }}>sympathetic trunk</span>: is it <span style={{ color: "#B9D27A" }}>INSIDE</span> the sheath?
        </div>
        <div style={{ position: "absolute", left: 36, top: 330, width: 400, height: 480, borderRadius: 30, background: C.paper, overflow: "hidden", ...pop(t, 17.6, 0.3) }}>
          <div style={{ position: "absolute", left: 200 - 270 * 1.05, top: 240 - 360 * 1.05 }}>
            <SectNeck t={t} w={900 * 1.05} id="v8" ask={t >= 18.1} lit={{ SH: 0 }} dimRest={0.3} />
          </div>
          <div style={{ position: "absolute", left: 16, bottom: 14, background: C.matcha, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 24, borderRadius: 14, padding: "2px 12px 6px", opacity: ramp(t, 18.2, 18.4) }}>dashed = carotid sheath</div>
        </div>
        <div style={{ position: "absolute", left: 460, width: 350, top: 380, display: "flex", flexDirection: "column", gap: 30 }}>
          {opts.map((o, i) => (
            <div key={o} style={{ ...pop(t, 18.72 + i * 0.16), display: "flex", alignItems: "center", gap: 14, transformOrigin: "0 50%" }}>
              <div style={{ width: 58, height: 58, flex: "0 0 58px", borderRadius: 16, background: C.banana, color: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, border: `4px solid ${C.paper}` }}>{"ABC"[i]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.paper, whiteSpace: "nowrap" }}>{o}</div>
            </div>
          ))}
        </div>
        {n !== null && (
          <div key={n} style={{ position: "absolute", left: 560, top: 620, width: 200, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 170, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 9. Answer: behind the sheath, in the prevertebral fascia */
export const V9: React.FC = () => {
  const t = useT();
  const k = cam(t, [[21.95, 1.35, 300, 380], [23.6, 1.5, 300, 390]]);
  return (
    <Scene start={21.95} end={23.6} push={0.006}>
      <Stage k={k} top={70} h={810} render={sect(t, { id: "v9", lit: { SY: 22.0, SH: 0 }, hot: ["SY"], dimRest: 0.55, fasc: ramp(t, 22.9, 23.2) })}>
        {(P) => (
          <>
            <Call t={t} t0={22.1} a={P(SA.SY)} to={[640, 690]} text="sympathetic trunk" bg={C.banana} fg={C.forest} size={38} />
            <Call t={t} t0={22.5} a={P(SA.SH)} to={[230, 120]} text="carotid sheath" bg={C.matcha} size={34} />
          </>
        )}
      </Stage>
      <div style={center(0, pop(t, 22.0, 0.25))}>
        <Pill size={44} bg={C.red}>B ✓ BEHIND IT · not inside</Pill>
      </div>
      <Tip t={t} t0={22.95} top={894} size={30}>it lies in the prevertebral fascia</Tip>
    </Scene>
  );
};

/* 10. The real thing: Gray's 1918 Fig. 384 with modern labels */
export const V10: React.FC = () => {
  const t = useT();
  return (
    <Scene start={23.6} end={25.32} push={0.006}>
      <PlateBox74 src={PLATE} aspect={A384} x={30} y={70} w={800} h={770} a={23.6} b={25.32} from={[0.41, 0.335, 0.74]} to={[0.41, 0.335, 0.72]} ls={28}
        labels={[
          { x: 0.448, y: 0.402, text: "sympathetic trunk", t: 23.7, hot: true, ox: 40, oy: 210 },
          { x: 0.491, y: 0.329, text: "common carotid", t: 23.95, ox: 50, oy: -200 },
          { x: 0.423, y: 0.343, text: "internal jugular v.", t: 24.2, ox: -40, oy: -300 },
          { x: 0.445, y: 0.364, text: "vagus", t: 24.45, ox: -110, oy: 120 },
        ]} />
      <div style={center(0, pop(t, 23.65, 0.25))}>
        <Pill size={32} bg={C.forest}>Gray's Anatomy 1918 · neck at C6</Pill>
      </div>
      <Note1918 t={t} t0={24.7} text="“Sternocleidomastoideus” = sternocleidomastoid" top={862} left={0} size={25} />
    </Scene>
  );
};

/* 11. Save + cheat sheet */
export const V11: React.FC = () => {
  const t = useT();
  const s0 = 25.32;
  const b = ramp(t, s0 + 0.05, s0 + 0.4);
  return (
    <Scene start={s0} end={27.6}>
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
      <div style={{ position: "absolute", left: 30, top: 196, width: 800, height: 700, borderRadius: 40, background: C.card, border: `3px solid ${C.line}`, boxShadow: "0 18px 40px rgba(31,42,20,0.12)", ...pop(t, s0 + 0.15, 0.3) }}>
        <div style={{ position: "absolute", left: 36, top: 26, fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.matcha, letterSpacing: 1.5, whiteSpace: "nowrap" }}>CAROTID SHEATH · I SEE 10 CC'S IN THE IV</div>
        {KORDER.map((l, i) => (
          <div key={l} style={{ position: "absolute", left: 36, top: 90 + i * 112, display: "flex", alignItems: "center", gap: 22, opacity: ramp(t, s0 + 0.3 + i * 0.08, s0 + 0.55 + i * 0.08) }}>
            <Chip k={l} size={84} />
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.forest, whiteSpace: "nowrap", lineHeight: 1.05 }}>{NAME[l]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 27, color: C.matcha, whiteSpace: "nowrap", marginTop: 4 }}>→ {TO[l]}</div>
            </div>
          </div>
        ))}
        <div style={{ position: "absolute", left: 36, top: 556, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.forest, opacity: ramp(t, s0 + 0.7, s0 + 0.9), whiteSpace: "nowrap", lineHeight: 1.75 }}>
          <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px" }}>out</span> external carotid leaves at the split
          <br />
          <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px" }}>quiz</span> sympathetic trunk = BEHIND the sheath
        </div>
      </div>
    </Scene>
  );
};

/* 12. End card (≤ 1.5 s) */
export const V12: React.FC = () => {
  const t = useT();
  const s0 = 27.6;
  return (
    <Scene start={s0} end={28.95}>
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
