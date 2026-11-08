import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, PlateBox, pop } from "./Scenes67";
import { ANC, GCOL, GDARK, GROUP, LET, M, NAME, ORDER, Palm } from "./Palm71";

export const A427 = 1853 / 2563;
export const liveAlpha = (_t: number) => 0;
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/** letter chip in the group colour */
export const MChip: React.FC<{ m: M; size?: number; on?: number; hot?: boolean }> = ({ m, size = 54, on = 1, hot }) => (
  <div style={{ width: size, height: size, flex: `0 0 ${size}px`, borderRadius: size * 0.3, background: on > 0.5 ? GCOL[GROUP[m]] : "rgba(31,42,20,0.08)", border: `4px solid ${on > 0.5 ? C.forest : "rgba(31,42,20,0.25)"}`, color: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.62, transform: `scale(${hot ? 1.14 : 1})`, boxShadow: hot ? `0 0 0 6px ${C.banana}` : "none", opacity: 0.45 + 0.55 * on }}>
    {LET[m]}
  </div>
);

/* keyframed camera over the diagram */
type K = [number, number, number, number]; // t, scale, X0, Y0
const cam = (t: number, ks: K[]) => {
  if (t <= ks[0][0]) return ks[0];
  for (let i = 0; i < ks.length - 1; i++) {
    const a = ks[i], b = ks[i + 1];
    if (t <= b[0]) {
      const k = ramp(t, a[0], b[0]);
      return [t, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k, a[3] + (b[3] - a[3]) * k] as K;
    }
  }
  return ks[ks.length - 1];
};

/** name callouts: line from muscle anchor (diagram coords → stage) to a label at a fixed stage point */
const Callouts: React.FC<{ t: number; s: number; X0: number; Y0: number; items: { m: M; t: number; at: [number, number]; side: "l" | "r" }[]; hot: M | null }> = ({ t, s, X0, Y0, items, hot }) => (
  <>
    {items.map((it) => {
      const p = ramp(t, it.t - 0.05, it.t + 0.25);
      if (p <= 0) return null;
      const a = ANC[it.m];
      const x0 = X0 + (a[0] * s * 860) / 800, y0 = Y0 + (a[1] * s * 860) / 800;
      const [x1, y1] = it.at;
      const isHot = hot === it.m;
      return (
        <React.Fragment key={it.m}>
          <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: p }}>
            <line x1={x0} y1={y0} x2={x0 + (x1 - x0) * p} y2={y0 + (y1 - y0) * p} stroke={C.paper} strokeWidth={10} strokeLinecap="round" />
            <line x1={x0} y1={y0} x2={x0 + (x1 - x0) * p} y2={y0 + (y1 - y0) * p} stroke={C.forest} strokeWidth={5} strokeLinecap="round" />
            <circle cx={x0} cy={y0} r={11} fill={GCOL[GROUP[it.m]]} stroke={C.forest} strokeWidth={4} />
          </svg>
          <div style={{ position: "absolute", left: x1, top: y1, transform: `translate(${it.side === "l" ? "-100%" : "0"}, -50%) scale(${(0.85 + 0.15 * p) * (isHot ? 1.05 : 1)})`, transformOrigin: it.side === "l" ? "100% 50%" : "0 50%", opacity: p }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: isHot ? C.banana : C.forest, color: isHot ? C.forest : C.paper, borderRadius: 16, padding: "6px 16px 9px 8px", fontFamily: FONT, fontWeight: 800, fontSize: 31, whiteSpace: "nowrap", boxShadow: "0 5px 0 rgba(31,42,20,0.18)" }}>
              <MChip m={it.m} size={42} />
              {NAME[it.m]}
            </div>
          </div>
        </React.Fragment>
      );
    })}
  </>
);

/* 1. Hook: Gray's 1918 Fig. 427 visible from frame 0 + challenge */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={2.8} push={0.02}>
      <div style={center(0, pop(t, -0.4, 0.25))}>
        <Big size={124}>NAME ALL 7</Big>
      </div>
      <div style={center(128, pop(t, -0.3, 0.25))}>
        <Big size={70} color={C.red}>PALM MUSCLES?</Big>
      </div>
      <PlateBox src="plates/hand427.png" aspect={A427} x={30} y={225} w={800} h={650} a={-0.6} b={2.8} from={[0.55, 0.36, 0.95]} to={[0.55, 0.37, 0.8]}
        labels={[
          { x: 0.76, y: 0.33, text: "thenar", t: 1.2, hot: true, ox: 40, oy: -120 },
          { x: 0.33, y: 0.37, text: "hypothenar", t: 1.55, hot: true, ox: 30, oy: -150 },
        ]} />
      <div style={center(895, pop(t, 0.1, 0.25))}>
        <Pill size={33} bg={C.forest}>thenar + hypothenar muscles · mnemonic</Pill>
      </div>
      <Stamp t0={0.7} text="5 SECONDS" size={42} rot={-8} color={C.red} style={{ left: 60, top: 700, whiteSpace: "nowrap" }} />
    </Scene>
  );
};

/* 2. The mnemonic card: A OF A OF A */
const MN: [string, M[], number][] = [
  ["A", ["APB"], 3.8],
  ["OF", ["OP", "FPB"], 3.95],
  ["A", ["ADP"], 4.08],
  ["OF", ["ODM", "FDM"], 4.26],
  ["A", ["ADM"], 4.42],
];
export const V2: React.FC = () => {
  const t = useT();
  return (
    <Scene start={2.8} end={4.85} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 820, height: 840, borderRadius: 48, background: C.forest, ...pop(t, 2.82, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 52, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 8, color: C.banana }}>THE MNEMONIC</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 120, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.paper, opacity: ramp(t, 3.0, 3.3) }}>thumb side → pinky side</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 220, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 10 }}>
          {MN.map(([w, ms, s], i) => (
            <div key={i} style={{ ...pop(t, s - 0.05, 0.22), display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
              <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: w.length > 1 ? 96 : 124, lineHeight: 1, color: C.forest, background: GCOL[GROUP[ms[0]]], borderRadius: 24, padding: "4px 14px 12px" }}>{w}</span>
            </div>
          ))}
        </div>
        {/* group brackets */}
        {[
          { x: 40, w: 330, txt: "THENAR · 3", g: "th" as const, t0: 4.0 },
          { x: 380, w: 120, txt: "ADD.", g: "ad" as const, t0: 4.15 },
          { x: 510, w: 270, txt: "HYPOTHENAR · 3", g: "hy" as const, t0: 4.45 },
        ].map((b) => (
          <div key={b.txt} style={{ position: "absolute", left: b.x, top: 440, width: b.w, opacity: ramp(t, b.t0, b.t0 + 0.2) }}>
            <div style={{ height: 22, borderLeft: `6px solid ${GCOL[b.g]}`, borderRight: `6px solid ${GCOL[b.g]}`, borderBottom: `6px solid ${GCOL[b.g]}`, borderRadius: "0 0 14px 14px" }} />
            <div style={{ marginTop: 12, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: b.g === "ad" ? 26 : 30, color: GCOL[b.g], whiteSpace: "nowrap" }}>{b.txt}</div>
          </div>
        ))}
        <div style={{ position: "absolute", left: 0, width: 820, top: 600, display: "flex", justifyContent: "center", gap: 12 }}>
          {ORDER.map((m, i) => <div key={m} style={pop(t, 3.8 + i * 0.1, 0.2)}><MChip m={m} size={86} /></div>)}
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 730, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.banana, opacity: ramp(t, 4.5, 4.7) }}>7 letters = 7 muscles</div>
      </div>
    </Scene>
  );
};

/* 3. Thumb side: diagram, each muscle lights as named */
const NT: Partial<Record<M, number>> = { APB: 5.55, OP: 6.14, FPB: 6.7, ADP: 8.4, ODM: 10.85, FDM: 11.48, ADM: 12.0 };
const hotAt = (t: number, ms: M[]) => {
  let cur: M | null = null;
  ms.forEach((m) => { if (t >= (NT[m] ?? 99) - 0.05) cur = m; });
  return cur as M | null;
};
export const V3: React.FC = () => {
  const t = useT();
  const [, s, X0, Y0] = cam(t, [[4.85, 0.98, 20, 0], [5.4, 1.5, 120, -560], [8.1, 1.5, 120, -560], [8.6, 1.32, 60, -400], [10.05, 1.32, 60, -400]]);
  const lit: Partial<Record<M, number>> = { APB: NT.APB, OP: NT.OP, FPB: NT.FPB, ADP: NT.ADP };
  const hot = hotAt(t, ["APB", "OP", "FPB", "ADP"]);
  return (
    <Scene start={4.85} end={10.05} push={0.004}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 860, height: 940, overflow: "hidden", borderRadius: 40 }}>
        <div style={{ position: "absolute", left: X0, top: Y0 }}>
          <Palm t={t} id="v3" w={860 * s} lit={lit} hot={hot} letters={1} bones={0.6} />
        </div>
        <Callouts t={t} s={s} X0={X0} Y0={Y0} hot={hot}
          items={[
            { m: "APB", t: NT.APB!, at: [300, 820], side: "r" },
            { m: "OP", t: NT.OP!, at: [330, 120], side: "r" },
            { m: "FPB", t: NT.FPB!, at: [430, 240], side: "r" },
            { m: "ADP", t: NT.ADP!, at: [500, 380], side: "r" },
          ]} />
        {/* thenar bracket */}
        <div style={{ position: "absolute", left: 30, top: 30, ...pop(t, 7.3, 0.25), transformOrigin: "0 0" }}>
          <Pill size={40} bg={GDARK.th}>THENAR = 3 · thumb</Pill>
        </div>
      </div>
    </Scene>
  );
};

/* 4. Pinky side + full summary */
export const V4: React.FC = () => {
  const t = useT();
  const [, s, X0, Y0] = cam(t, [[10.05, 1.32, 60, -400], [10.6, 1.5, -500, -560], [14.15, 1.5, -500, -560], [14.6, 0.98, 20, 0], [15.05, 0.98, 20, 0]]);
  const lit: Partial<Record<M, number>> = { APB: 0, OP: 0, FPB: 0, ADP: 0, ODM: NT.ODM, FDM: NT.FDM, ADM: NT.ADM };
  const hot = hotAt(t, ["ODM", "FDM", "ADM"]);
  const out = ramp(t, 14.1, 14.35);
  return (
    <Scene start={10.05} end={15.05} push={0.004}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 860, height: 940, overflow: "hidden", borderRadius: 40 }}>
        <div style={{ position: "absolute", left: X0, top: Y0 }}>
          <Palm t={t} id="v4" w={860 * s} lit={lit} hot={t < 14.1 ? hot : null} letters={1} bones={0.6} />
        </div>
        <div style={{ opacity: 1 - out }}>
          <Callouts t={t} s={s} X0={X0} Y0={Y0} hot={hot}
            items={[
              { m: "ODM", t: NT.ODM!, at: [520, 110], side: "l" },
              { m: "FDM", t: NT.FDM!, at: [560, 230], side: "l" },
              { m: "ADM", t: NT.ADM!, at: [600, 350], side: "l" },
            ]} />
        </div>
        <div style={{ position: "absolute", right: 30, top: 820, ...pop(t, 13.6, 0.25), opacity: ramp(t, 13.6, 13.85) * (1 - out), transformOrigin: "100% 0" }}>
          <Pill size={40} bg={GDARK.hy}>HYPOTHENAR = 3 · pinky</Pill>
        </div>
        {/* summary row */}
        <div style={{ position: "absolute", left: 0, width: 860, top: 30, display: "flex", justifyContent: "center", gap: 10 }}>
          {ORDER.map((m, i) => <div key={m} style={pop(t, 14.35 + i * 0.06, 0.2)}><MChip m={m} size={78} /></div>)}
        </div>
      </div>
      <Stamp t0={14.6} text="ALL 7" size={50} rot={-7} color={C.red} style={{ left: 590, top: 820, whiteSpace: "nowrap" }} />
    </Scene>
  );
};

/* 5. Quick test */
export const V5: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[17.84, 3], [18.48, 2], [19.12, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => {
    if (t >= s - 0.05 && t < 19.7) { n = v; n0 = s; }
  });
  const opts = ["median nerve", "ulnar nerve", "radial nerve"];
  return (
    <Scene start={15.05} end={19.7}>
      <div style={{ position: "absolute", left: 20, top: 55, width: 820, height: 830, borderRadius: 48, background: C.forest, ...pop(t, 15.1, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 56, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 130, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 60, lineHeight: 1.12, color: C.paper, ...pop(t, 15.85) }}>
          Which nerve runs the <span style={{ color: GCOL.th }}>THENAR 3</span>?
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 330, display: "flex", justifyContent: "center", gap: 10, ...pop(t, 16.3, 0.25) }}>
          {(["APB", "OP", "FPB"] as M[]).map((m) => <MChip key={m} m={m} size={64} />)}
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 440, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          {opts.map((o, i) => (
            <div key={o} style={{ ...pop(t, 16.7 + i * 0.18), display: "flex", alignItems: "center", gap: 18, width: 520 }}>
              <div style={{ width: 62, height: 62, flex: "0 0 62px", borderRadius: 18, background: C.banana, color: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, border: `4px solid ${C.paper}` }}>{"ABC"[i]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper, whiteSpace: "nowrap" }}>{o}</div>
            </div>
          ))}
        </div>
        {n !== null && (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 660, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 150, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 6a. Answer: median nerve → thenar, on Gray's plate */
export const V6: React.FC = () => {
  const t = useT();
  return (
    <Scene start={19.7} end={22.15} push={0.01}>
      <div style={{ position: "absolute", left: 0, width: 860, top: 0, display: "flex", justifyContent: "center", ...pop(t, 19.75, 0.25) }}>
        <Pill size={42} bg={C.matcha}>A ✓ median nerve</Pill>
      </div>
      <PlateBox src="plates/hand427.png" aspect={A427} x={30} y={95} w={800} h={700} a={19.7} b={22.15} from={[0.64, 0.38, 0.62]} to={[0.66, 0.37, 0.52]}
        labels={[
          { x: 0.725, y: 0.305, text: "abductor pollicis brevis", t: 20.0, hot: true, ox: -60, oy: -110 },
          { x: 0.83, y: 0.3, text: "opponens pollicis", t: 20.35, ox: -150, oy: 130 },
          { x: 0.7, y: 0.385, text: "flexor pollicis brevis", t: 20.7, ox: -40, oy: 140 },
        ]} />
      <div style={center(815, pop(t, 21.2, 0.25))}>
        <Pill size={36} bg={C.banana} color={C.forest}>its recurrent branch → the thenar 3</Pill>
      </div>
    </Scene>
  );
};

/* 6b. Ulnar nerve → adductor + hypothenar, same plate, other side */
export const V6b: React.FC = () => {
  const t = useT();
  return (
    <Scene start={22.15} end={25.5} push={0.01}>
      <div style={{ position: "absolute", left: 0, width: 860, top: 0, display: "flex", justifyContent: "center", ...pop(t, 24.4, 0.25) }}>
        <Pill size={42} bg="#5B7DB0">ulnar nerve</Pill>
      </div>
      <PlateBox src="plates/hand427.png" aspect={A427} x={30} y={95} w={800} h={700} a={22.15} b={25.5} from={[0.52, 0.42, 0.66]} to={[0.48, 0.41, 0.6]}
        labels={[
          { x: 0.725, y: 0.468, text: "adductor pollicis", t: 22.3, ox: -40, oy: -150 },
          { x: 0.29, y: 0.4, text: "abductor digiti minimi", t: 22.9, hot: true, ox: 40, oy: 110 },
          { x: 0.375, y: 0.43, text: "flexor digiti minimi", t: 23.25, ox: 60, oy: -200 },
        ]} />
      <div style={{ position: "absolute", left: 24, top: 120, opacity: ramp(t, 23.6, 23.85), transform: `scale(${0.8 + 0.2 * ramp(t, 23.6, 23.85)})`, transformOrigin: "0 0" }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "10px 18px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.forest, lineHeight: 1.2, boxShadow: "0 6px 0 rgba(31,42,20,0.08)" }}>
          <span style={{ color: C.matcha }}>1918 atlas name:</span>
          <br />“digiti quinti” = digiti minimi
        </div>
      </div>
      <div style={center(815, pop(t, 24.6, 0.25))}>
        <Pill size={34} bg={C.forest}>adductor + hypothenar 3 → ulnar</Pill>
      </div>
    </Scene>
  );
};

/* 7. Save + cheat sheet */
export const V7: React.FC = () => {
  const t = useT();
  const b = ramp(t, 25.55, 25.9);
  return (
    <Scene start={25.5} end={28.0}>
      <div style={{ position: "absolute", left: 40, top: 0, ...pop(t, 25.55) }}>
        <svg width={110} height={140} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 170, top: 6, ...pop(t, 25.6) }}>
        <Big size={100}>SAVE THIS</Big>
      </div>
      <div style={{ position: "absolute", left: 172, top: 112, ...pop(t, 25.85) }}>
        <Big size={40} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ position: "absolute", left: 30, top: 200, display: "flex", flexDirection: "column", gap: 12 }}>
        {ORDER.map((m, i) => (
          <div key={m} style={{ display: "flex", alignItems: "center", gap: 14, ...pop(t, 26.0 + i * 0.07, 0.22), transformOrigin: "0 50%" }}>
            <MChip m={m} size={70} />
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.forest, whiteSpace: "nowrap", lineHeight: 1.05 }}>{NAME[m]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 23, color: GDARK[GROUP[m]], lineHeight: 1.15, whiteSpace: "nowrap" }}>
                {GROUP[m] === "th" ? "thenar · median n. (recurrent branch)" : GROUP[m] === "ad" ? "adductor compartment · ulnar n. (deep branch)" : "hypothenar · ulnar n. (deep branch)"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Scene>
  );
};

/* 8. End card (≤ 1.5 s) */
export const V8: React.FC = () => {
  const t = useT();
  return (
    <Scene start={28.0} end={29.3}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, 28.02, 0.3) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.banana, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 28.15, 28.4) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 28.0) * 5))})`, opacity: ramp(t, 28.05, 28.25) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
