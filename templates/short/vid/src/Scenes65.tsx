import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { ANCHOR, HipDiagram, M, MCOL } from "./Hip65";

export const ASP = 1064 / 1376; // Gray's 1918 Fig. 434 crop
export const liveAlpha = (_t: number) => 0;

const pop = (t: number, t0: number, d = 0.3) => {
  const p = ramp(t, t0, t0 + d);
  return { opacity: p, transform: `scale(${0.6 + 0.4 * p + 0.08 * Math.sin(Math.min(1, p) * Math.PI)})` } as React.CSSProperties;
};
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });
const Big: React.FC<{ size?: number; children: React.ReactNode; color?: string }> = ({ size = 110, children, color = C.forest }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1, letterSpacing: -2, textAlign: "center", whiteSpace: "nowrap" }}>{children}</div>
);

/* the 6 muscles, top to bottom = mnemonic order */
export const MS: { m: M; l: string; name: string; short: string; note: string }[] = [
  { m: "P", l: "P", name: "Piriformis", short: "piriformis", note: "top · from the sacrum" },
  { m: "GS", l: "G", name: "Gemellus superior", short: "gemellus superior", note: "from the ischial spine" },
  { m: "OI", l: "O", name: "Obturator internus", short: "obturator internus", note: "tendon between the twins" },
  { m: "GI", l: "G", name: "Gemellus inferior", short: "gemellus inferior", note: "from the ischial tuberosity" },
  { m: "OE", l: "O", name: "Obturator externus", short: "obturator externus", note: "deep, hidden" },
  { m: "QF", l: "Q", name: "Quadratus femoris", short: "quadratus femoris", note: "bottom · square muscle" },
];
export const NT: Record<M, number> = { P: 5.24, GS: 6.34, OI: 7.79, GI: 9.31, OE: 10.74, QF: 12.95 };

export const LChip: React.FC<{ m: M; on?: number; size?: number; hot?: boolean }> = ({ m, on = 1, size = 54, hot }) => {
  const r = MS.find((x) => x.m === m)!;
  return (
    <div style={{ width: size, height: size, flex: `0 0 ${size}px`, borderRadius: size * 0.3, background: on > 0.5 ? MCOL[m] : "rgba(31,42,20,0.08)", border: `4px solid ${on > 0.5 ? C.forest : "rgba(31,42,20,0.25)"}`, color: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.62, transform: `scale(${hot ? 1.14 : 1})`, boxShadow: hot ? `0 0 0 6px ${C.banana}` : "none", opacity: 0.45 + 0.55 * on }}>
      {r.l}
    </div>
  );
};

/* P-GO-GO-Q tracker */
const Tracker: React.FC<{ t: number; top: number; onAt: (m: M) => number; cur: M | null; size?: number }> = ({ t, top, onAt, cur, size = 62 }) => (
  <>
    <div style={{ position: "absolute", left: 190, width: 480, top: top - 12, height: size + 24, borderRadius: (size + 24) / 2, background: C.paper, boxShadow: `0 0 0 4px ${C.line}` }} />
    <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", gap: 14 }}>
      {MS.map((r, i) => (
        <React.Fragment key={r.m}>
          {(i === 1 || i === 3 || i === 5) && <div style={{ width: 4, height: size, borderRadius: 2, background: C.line }} />}
          <LChip m={r.m} size={size} on={t >= onAt(r.m) - 0.05 ? 1 : 0} hot={cur === r.m} />
        </React.Fragment>
      ))}
    </div>
  </>
);

/* 1. Hook: Gray's 1918 Fig. 434 visible from frame 0 + challenge */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={2.2} push={0.02}>
      <div style={center(10, pop(t, -0.4, 0.25))}>
        <Big size={112}>NAME ALL 6</Big>
      </div>
      <div style={center(126, pop(t, -0.3, 0.25))}>
        <Big size={84} color={C.red}>DEEP HIP ROTATORS</Big>
      </div>
      <Plate src="plates/gluteal434.png" aspect={ASP} x={130} y={232} w={600} a={-0.6} b={2.2} zoomFrom={[1.55, 0.6, 0.55]} zoomTo={[1.75, 0.6, 0.56]} />
      <div style={center(880, pop(t, 0.1, 0.25))}>
        <Pill size={36} bg={C.forest}>deep hip rotators · mnemonic</Pill>
      </div>
      <Stamp t0={0.9} text="6 MUSCLES" size={44} rot={-8} color={C.red} style={{ left: 540, top: 262, whiteSpace: "nowrap" }} />
    </Scene>
  );
};

/* 2. The mnemonic card: P-GO-GO-Q */
const PIECES: [string, number, M[]][] = [["P", 3.87, ["P"]], ["GO", 4.11, ["GS", "OI"]], ["GO", 4.37, ["GI", "OE"]], ["Q", 4.64, ["QF"]]];
export const V2: React.FC = () => {
  const t = useT();
  return (
    <Scene start={2.2} end={5.15} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 820, height: 840, borderRadius: 48, background: C.forest, ...pop(t, 2.22, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 8, color: C.banana }}>ONE WORD · TOP TO BOTTOM</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 150, display: "flex", justifyContent: "center", alignItems: "center", gap: 6 }}>
          {PIECES.map(([w, s, ms], i) => (
            <React.Fragment key={i}>
              {i > 0 && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper, opacity: 0.5 }}>-</div>}
              <div style={{ display: "flex", ...pop(t, s - 0.06, 0.2), opacity: 0.18 + 0.82 * ramp(t, s - 0.06, s + 0.1) }}>
                {w.split("").map((ch, j) => (
                  <span key={j} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 100, lineHeight: 1.0, color: C.forest, background: MCOL[ms[j]], borderRadius: 18, padding: "4px 8px 10px", marginRight: j < w.length - 1 ? 6 : 0 }}>{ch}</span>
                ))}
              </div>
            </React.Fragment>
          ))}
        </div>
        {/* six names list */}
        <div style={{ position: "absolute", left: 90, top: 380, display: "flex", flexDirection: "column", gap: 10 }}>
          {MS.map((r, i) => {
            const s = PIECES.find((p) => p[2].includes(r.m))![1];
            return (
              <div key={r.m} style={{ display: "flex", alignItems: "center", gap: 18, ...pop(t, s + 0.05 + (r.m === "OI" || r.m === "OE" ? 0.08 : 0), 0.2), transformOrigin: "0 50%" }}>
                <LChip m={r.m} size={52} />
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.paper, whiteSpace: "nowrap" }}>{r.name}</div>
              </div>
            );
          })}
        </div>
        <svg width={60} height={400} style={{ position: "absolute", left: 22, top: 386, opacity: ramp(t, 4.0, 4.4) }}>
          <line x1={30} y1={10} x2={30} y2={370} stroke={C.banana} strokeWidth={8} strokeLinecap="round" />
          <path d="M12 352 L30 386 L48 352 Z" fill={C.banana} />
        </svg>
      </div>
    </Scene>
  );
};

/* 3. Our diagram: P, G, O, G light up as they are named; labels sit in the empty areas */
const V3S = 1.15, V3X = -120, V3Y = -120;
const V3L: Partial<Record<M, [number, number]>> = { P: [420, 120], GS: [20, 600], OI: [20, 668], GI: [20, 736] };
export const V3: React.FC = () => {
  const t = useT();
  let cur: M | null = null;
  (["P", "GS", "OI", "GI"] as M[]).forEach((m) => {
    if (t >= NT[m] - 0.05) cur = m;
  });
  const W = 860 * V3S;
  const lit: Partial<Record<M, number>> = {};
  (["P", "GS", "OI", "GI"] as M[]).forEach((m) => (lit[m] = NT[m]));
  return (
    <Scene start={5.15} end={10.7} push={0.03}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 860, height: 940, overflow: "hidden", borderRadius: 40, background: C.card, boxShadow: `0 0 0 4px ${C.line}` }}>
        <div style={{ position: "absolute", left: V3X, top: V3Y }}>
          <HipDiagram t={t} w={W} grow={5.0} lit={lit} glow={cur ? [cur] : []} id="v3" />
        </div>
        {(["P", "GS", "OI", "GI"] as M[]).map((m) => {
          const p = ramp(t, NT[m] - 0.05, NT[m] + 0.25);
          if (p <= 0) return null;
          const [lx, ly] = V3L[m]!;
          const centre = m === "P";
          const x0 = V3X + ANCHOR[m][0] * V3S, y0 = V3Y + ANCHOR[m][1] * V3S;
          const x1 = centre ? lx : lx + 330, y1 = centre ? ly + 30 : ly;
          const hot = cur === m;
          const r = MS.find((q) => q.m === m)!;
          return (
            <React.Fragment key={m}>
              <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: p }}>
                <line x1={x0} y1={y0} x2={x0 + (x1 - x0) * p} y2={y0 + (y1 - y0) * p} stroke={C.paper} strokeWidth={10} strokeLinecap="round" />
                <line x1={x0} y1={y0} x2={x0 + (x1 - x0) * p} y2={y0 + (y1 - y0) * p} stroke={C.forest} strokeWidth={5} strokeLinecap="round" />
                <circle cx={x0} cy={y0} r={11} fill={MCOL[m]} stroke={C.forest} strokeWidth={4} />
              </svg>
              <div style={{ position: "absolute", left: lx, top: ly, transform: `translate(${centre ? "-50%" : "0"}, -50%) scale(${(0.85 + 0.15 * p) * (hot ? 1.06 : 1)})`, transformOrigin: centre ? "50% 50%" : "0 50%", opacity: p }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, background: hot ? C.banana : C.forest, color: hot ? C.forest : C.paper, borderRadius: 16, padding: "6px 16px 9px 8px", fontFamily: FONT, fontWeight: 800, fontSize: 32, whiteSpace: "nowrap", boxShadow: "0 5px 0 rgba(31,42,20,0.18)" }}>
                  <LChip m={m} size={42} />
                  {r.short}
                </div>
              </div>
            </React.Fragment>
          );
        })}
        <div style={{ position: "absolute", left: 24, top: 22, ...pop(t, 5.3, 0.25), transformOrigin: "0 0" }}>
          <Pill size={26} bg={C.forest}>right hip · from behind</Pill>
        </div>
        <div style={{ position: "absolute", right: 24, top: 740, ...pop(t, 9.75, 0.25), transformOrigin: "100% 0" }}>
          <Pill size={28} bg={C.banana} color={C.forest}>gemellus = Latin “little twin”</Pill>
        </div>
      </div>
      <Tracker t={t} top={830} onAt={(m) => NT[m]} cur={cur} />
    </Scene>
  );
};

/* 4. Gray's 1918 plate: obturator externus hiding deep + quadratus femoris */
export const V4: React.FC = () => {
  const t = useT();
  const cur: M = t < NT.QF - 0.05 ? "OE" : "QF";
  return (
    <Scene start={10.7} end={14.55} push={0.01}>
      <Plate src="plates/gluteal434.png" aspect={ASP} x={20} y={0} w={820} a={10.7} b={14.55} zoomFrom={[1.7, 0.6, 0.6]} zoomTo={[1.95, 0.62, 0.66]}
        labels={[
          { x: 0.685, y: 0.632, text: "obturator externus", t: 10.85, hot: cur === "OE", ox: -60, oy: -170 },
          { x: 0.6, y: 0.7, text: "quadratus femoris", t: 12.95, hot: cur === "QF", ox: 60, oy: 110 },
          { x: 0.42, y: 0.69, text: "ischial tuberosity", t: 13.6, ox: 30, oy: -190 },
        ]} />
      <div style={{ position: "absolute", left: 0, top: 0, opacity: 1 - ramp(t, 12.85, 13.05) }}>
        <Stamp t0={12.2} text="HIDING DEEP" size={46} rot={-8} color={C.red} style={{ left: 60, top: 470, whiteSpace: "nowrap" }} />
      </div>
      <div style={{ position: "absolute", left: 40, top: 30, ...pop(t, 13.9, 0.25), transformOrigin: "0 0" }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "12px 20px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.forest, lineHeight: 1.2, boxShadow: "0 6px 0 rgba(31,42,20,0.08)" }}>
          <span style={{ color: C.matcha }}>1918 atlas name:</span>
          <br />“Tuber ischiad.” = ischial tuberosity
        </div>
      </div>
      <Tracker t={t} top={830} onAt={(m) => NT[m]} cur={cur} />
    </Scene>
  );
};

/* 5. All six = lateral rotation */
export const V5: React.FC = () => {
  const t = useT();
  const s = 0.95, W = 860 * s;
  const X0 = 430 - 0.52 * W, Y0 = 470 - 0.52 * W;
  const lit: Partial<Record<M, number>> = {};
  MS.forEach((r, i) => (lit[r.m] = 14.6 + i * 0.07));
  return (
    <Scene start={14.55} end={16.3} push={0.01}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 860, height: 940, overflow: "hidden", borderRadius: 40, background: C.card, boxShadow: `0 0 0 4px ${C.line}` }}>
        <div style={{ position: "absolute", left: X0, top: Y0 }}>
          <HipDiagram t={t} w={W} lit={lit} glow={t > 15.0 ? ["P", "GS", "OI", "GI", "OE", "QF"] : []} rot={15.36} id="v5" />
        </div>
        <div style={{ position: "absolute", left: 0, width: 860, top: 26, display: "flex", justifyContent: "center", ...pop(t, 14.65, 0.25) }}>
          <Pill size={40} bg={C.forest}>all 6 → same job</Pill>
        </div>
        <div style={{ position: "absolute", left: 0, width: 860, top: 845, display: "flex", justifyContent: "center", ...pop(t, 15.4, 0.25) }}>
          <Pill size={44} bg={C.banana} color={C.forest}>LATERAL ROTATION ↻ thigh turns out</Pill>
        </div>
      </div>
    </Scene>
  );
};

/* 6. Quick test (≈ 60 % mark) */
export const V6: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[20.05, 3], [20.68, 2], [21.32, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => {
    if (t >= s - 0.05 && t < 21.9) { n = v; n0 = s; }
  });
  const opts = ["femoral nerve", "sciatic nerve", "obturator nerve"];
  return (
    <Scene start={16.3} end={21.9}>
      <div style={{ position: "absolute", left: 20, top: 55, width: 820, height: 830, borderRadius: 48, background: C.forest, ...pop(t, 16.35, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 56, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 130, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 58, lineHeight: 1.12, color: C.paper, ...pop(t, 17.1) }}>
          Which big nerve exits just below <span style={{ color: C.banana }}>PIRIFORMIS</span>?
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 400, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          {opts.map((o, i) => (
            <div key={o} style={{ ...pop(t, 18.0 + i * 0.18), display: "flex", alignItems: "center", gap: 18, width: 560 }}>
              <div style={{ width: 62, height: 62, flex: "0 0 62px", borderRadius: 18, background: C.banana, color: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, border: `4px solid ${C.paper}` }}>{"ABC"[i]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.paper, whiteSpace: "nowrap" }}>{o}</div>
            </div>
          ))}
        </div>
        {n !== null && (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 640, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 170, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 7. Answer: sciatic nerve draws in below piriformis on our diagram */
export const V7: React.FC = () => {
  const t = useT();
  const s = 1.18, W = 860 * s;
  const X0 = 430 - 0.52 * W, Y0 = 470 - 0.56 * W;
  const lit: Partial<Record<M, number>> = { P: 21.0, GS: 21.0, OI: 21.0, GI: 21.0, OE: 21.0, QF: 21.0 };
  const nx = X0 + 372 * s, ny = Y0 + 404 * s;
  return (
    <Scene start={21.9} end={23.2} push={0.01}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 860, height: 940, overflow: "hidden", borderRadius: 40, background: C.card, boxShadow: `0 0 0 4px ${C.line}` }}>
        <div style={{ position: "absolute", left: X0, top: Y0 }}>
          <HipDiagram t={t} w={W} lit={lit} glow={["P"]} nerve={21.95} id="v7" />
        </div>
        <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, opacity: ramp(t, 22.25, 22.45) }}>
          <line x1={250} y1={790} x2={nx + 10} y2={ny + 40} stroke={C.paper} strokeWidth={10} strokeLinecap="round" />
          <line x1={250} y1={790} x2={nx + 10} y2={ny + 40} stroke={C.forest} strokeWidth={5} strokeLinecap="round" />
        </svg>
        <div style={{ position: "absolute", left: 20, top: 790, ...pop(t, 22.25, 0.2), transformOrigin: "0 0" }}>
          <Pill size={34} bg={C.banana} color={C.forest}>exits just below piriformis</Pill>
        </div>
        <div style={{ position: "absolute", left: 0, width: 860, top: 24, display: "flex", justifyContent: "center", ...pop(t, 21.95, 0.25) }}>
          <Pill size={44} bg={C.matcha}>B ✓ sciatic nerve</Pill>
        </div>
      </div>
    </Scene>
  );
};

/* 8. Save + cheat sheet */
export const V8: React.FC = () => {
  const t = useT();
  const b = ramp(t, 23.25, 23.6);
  return (
    <Scene start={23.2} end={25.5}>
      <div style={{ position: "absolute", left: 40, top: 0, ...pop(t, 23.25) }}>
        <svg width={110} height={140} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 170, top: 6, ...pop(t, 23.3) }}>
        <Big size={100}>SAVE THIS</Big>
      </div>
      <div style={{ position: "absolute", left: 172, top: 112, ...pop(t, 23.5) }}>
        <Big size={40} color={C.matcha}>P-GO-GO-Q · top to bottom</Big>
      </div>
      <div style={{ position: "absolute", left: 40, top: 205, display: "flex", flexDirection: "column", gap: 14 }}>
        {MS.map((r, i) => (
          <div key={r.m} style={{ display: "flex", alignItems: "center", gap: 18, ...pop(t, 23.6 + i * 0.08, 0.22), transformOrigin: "0 50%" }}>
            <LChip m={r.m} size={72} />
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest, whiteSpace: "nowrap", lineHeight: 1.05 }}>{r.name}</div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 25, color: C.matcha, lineHeight: 1.15 }}>{r.note}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 40, top: 846, ...pop(t, 24.2, 0.25), transformOrigin: "0 50%" }}>
        <Pill size={30} bg={C.forest}>all 6: lateral rotation · sciatic nerve below piriformis</Pill>
      </div>
    </Scene>
  );
};

/* 9. End card (≤ 1.5 s) */
export const V9: React.FC = () => {
  const t = useT();
  return (
    <Scene start={25.5} end={26.9}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, 25.52, 0.3) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.banana, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 25.6, 25.85) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 25.5) * 5))})`, opacity: ramp(t, 25.55, 25.75) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
