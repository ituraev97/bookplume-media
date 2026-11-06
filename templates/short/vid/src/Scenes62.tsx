import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { FINGER, ForearmDiagram, HandDiagram, M, MCOL, MNAME, MUS } from "./Forearm62";

export const AMID = 641 / 955;
export const AUP = 641 / 1383;
export const liveAlpha = (_t: number) => 0;

const pop = (t: number, t0: number, d = 0.3) => {
  const p = ramp(t, t0, t0 + d);
  return { opacity: p, transform: `scale(${0.6 + 0.4 * p + 0.08 * Math.sin(Math.min(1, p) * Math.PI)})` } as React.CSSProperties;
};
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });
const Big: React.FC<{ size?: number; children: React.ReactNode; color?: string }> = ({ size = 110, children, color = C.forest }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1, letterSpacing: -2, textAlign: "center", whiteSpace: "nowrap" }}>{children}</div>
);
const ABBR: Record<M, string> = { PT: "PT", FCR: "FCR", PL: "PL", FDS: "FDS", FCU: "FCU" };

/** finger chip: finger name + muscle abbreviation, in the muscle colour */
export const FChip: React.FC<{ m: M; on?: number; size?: number; hot?: boolean }> = ({ m, on = 1, size = 30, hot }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: 0.3 + 0.7 * on, transform: `scale(${(0.92 + 0.08 * on) * (hot ? 1.06 : 1)})`, transformOrigin: "0 50%" }}>
    <div style={{ minWidth: size * 3.9, padding: `${size * 0.2}px ${size * 0.4}px ${size * 0.28}px`, borderRadius: size * 0.5, background: on > 0.5 ? C.forest : "rgba(31,42,20,0.12)", color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: size, textAlign: "center", boxShadow: hot ? `0 0 0 5px ${C.banana}` : "none" }}>{FINGER[m]}</div>
    <div style={{ width: size * 2.9, padding: `${size * 0.2}px 0 ${size * 0.28}px`, borderRadius: size * 0.5, background: on > 0.5 ? MCOL[m] : "rgba(31,42,20,0.07)", border: `4px solid ${on > 0.5 ? C.forest : "rgba(31,42,20,0.2)"}`, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: size, textAlign: "center" }}>{ABBR[m]}</div>
  </div>
);

/* 1. Hook: Gray's 1918 Fig. 414 on screen from frame 0, challenge text */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={4.2} push={0.02}>
      <div style={center(6, pop(t, -0.4, 0.25))}>
        <Big size={104}>~15% OF PEOPLE</Big>
      </div>
      <div style={center(118, pop(t, -0.3, 0.25))}>
        <Big size={64} color={C.red}>DON'T HAVE THIS MUSCLE</Big>
      </div>
      <Plate src="plates/forearm_mid.png" aspect={AMID} x={208} y={208} w={444} a={-0.6} b={4.2} zoomFrom={[1.0, 0.5, 0.45]} zoomTo={[1.25, 0.3, 0.5]}
        labels={[
          { x: 0.17, y: 0.42, text: "?", t: 1.15, hot: true, ox: 70, oy: -70 },
          { x: 0.26, y: 0.72, text: "palmaris longus", t: 2.95, hot: true, ox: 30, oy: -50 },
        ]} />
      <div style={{ position: "absolute", left: 0, width: 860, top: 868, display: "flex", justifyContent: "center", ...pop(t, 0.8, 0.25) }}>
        <Pill size={38} bg={C.forest}>palmaris longus · hand trick mnemonic</Pill>
      </div>
      <Stamp t0={1.9} text="ARE YOU ONE?" size={42} rot={-8} color={C.red} style={{ left: 0, top: 420 }} />
    </Scene>
  );
};

/* 2. The test: thumb to pinky, flex the wrist, tendon pops up */
export const V2: React.FC = () => {
  const t = useT();
  const touch = ramp(t, 5.0, 5.6);
  const flex = ramp(t, 5.75, 6.4);
  const tendon = ramp(t, 6.85, 7.3);
  const z = 1 + 0.18 * ramp(t, 6.5, 8.9);
  const fy = 0.62;
  return (
    <Scene start={4.2} end={8.95} push={0.01}>
      <div style={center(18, pop(t, 4.25, 0.25))}>
        <Big size={62}>THE 3-SECOND TEST</Big>
      </div>
      <div style={{ position: "absolute", left: 0, top: 100, width: 860, height: 740, overflow: "hidden", borderRadius: 40, background: C.card, boxShadow: `0 0 0 4px ${C.line}` }}>
        <div style={{ position: "absolute", left: 130, top: -40, width: 600, height: 750, transformOrigin: `50% ${fy * 100}%`, transform: `scale(${z})` }}>
          <HandDiagram t={t} w={600} touch={touch} flex={flex} tendon={tendon} glowThumb={t > 4.55 && t < 5.7 ? 1 : 0} glowPinky={t > 5.0 && t < 5.7 ? 1 : 0} id="v2" />
        </div>
        {/* step chips */}
        <div style={{ position: "absolute", left: 24, top: 24, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={pop(t, 4.6, 0.25)}><Pill size={30} bg={t < 5.7 ? C.banana : C.forest} color={t < 5.7 ? C.forest : C.paper}>1 · thumb + pinky</Pill></div>
          <div style={pop(t, 5.75, 0.25)}><Pill size={30} bg={t >= 5.7 && t < 6.8 ? C.banana : C.forest} color={t >= 5.7 && t < 6.8 ? C.forest : C.paper}>2 · flex the wrist</Pill></div>
        </div>
        {/* tendon callout */}
        {tendon > 0 && (
          <svg width={860} height={740} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: tendon }}>
            <line x1={430} y1={600} x2={430 + 170 * tendon} y2={600 - 60 * tendon} stroke={C.forest} strokeWidth={5} strokeLinecap="round" />
            <circle cx={430} cy={600} r={11} fill={C.banana} stroke={C.forest} strokeWidth={5} />
          </svg>
        )}
        <div style={{ position: "absolute", left: 600, top: 515, ...pop(t, 6.9, 0.25) }}>
          <div style={{ background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 32, padding: "6px 16px 9px", borderRadius: 16, lineHeight: 1.05, boxShadow: "0 6px 0 rgba(31,42,20,0.18)" }}>palmaris<br />longus tendon</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 862, display: "flex", justifyContent: "center", gap: 16 }}>
        <div style={pop(t, 8.15, 0.25)}><Pill size={36} bg={C.matcha}>✓ see it = you have it</Pill></div>
        <div style={pop(t, 8.45, 0.25)}><Pill size={36} bg={C.forest}>no cord? ~15%</Pill></div>
      </div>
    </Scene>
  );
};

/* 3. Gray's 1918: five muscles from the medial epicondyle */
const PLT: { m: M; x: number; y: number; ly: number; t: number }[] = [
  { m: "PT", x: 0.48, y: 0.42, ly: 330, t: 9.35 },
  { m: "FCR", x: 0.3, y: 0.5, ly: 425, t: 9.5 },
  { m: "PL", x: 0.16, y: 0.56, ly: 520, t: 9.65 },
  { m: "FCU", x: 0.08, y: 0.62, ly: 615, t: 9.8 },
  { m: "FDS", x: 0.4, y: 0.8, ly: 745, t: 9.95 },
];
export const V3: React.FC = () => {
  const t = useT();
  const PX = 20, PY = 50, PW = 410;
  const PH = PW / AUP;
  return (
    <Scene start={8.95} end={11.45} push={0.008}>
      <Plate src="plates/forearm_up.png" aspect={AUP} x={PX} y={PY} w={PW} a={8.95} b={11.45} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.0, 0.5, 0.5]} />
      <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {[...PLT.map((p) => ({ x: p.x, y: p.y, ly: p.ly, t: p.t, col: MCOL[p.m] })), { x: 0.1, y: 0.21, ly: 205, t: 10.3, col: C.banana }].map((p, i) => {
          const a = ramp(t, p.t - 0.05, p.t + 0.25);
          if (a <= 0) return null;
          const x0 = PX + p.x * PW, y0 = PY + p.y * PH;
          const x1 = x0 + (462 - x0) * a, y1 = y0 + (p.ly - y0) * a;
          return (
            <g key={i} opacity={a}>
              <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={C.paper} strokeWidth={10} strokeLinecap="round" />
              <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={C.forest} strokeWidth={5} strokeLinecap="round" />
              <circle cx={x0} cy={y0} r={12} fill={p.col} stroke={C.forest} strokeWidth={5} />
            </g>
          );
        })}
      </svg>
      {PLT.map((p) => (
        <div key={p.m} style={{ position: "absolute", left: 470, top: p.ly - 30, display: "flex", alignItems: "center", gap: 12, ...pop(t, p.t + 0.1, 0.22), transformOrigin: "0 50%" }}>
          <div style={{ minWidth: 92, textAlign: "center", background: MCOL[p.m], border: `4px solid ${C.forest}`, borderRadius: 16, fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.forest, padding: "2px 10px 5px" }}>{p.m}</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, color: C.forest, lineHeight: 1.05, width: 260 }}>{MNAME[p.m].toLowerCase()}</div>
        </div>
      ))}
      <div style={{ position: "absolute", left: 470, top: 178, ...pop(t, 10.35, 0.22), transformOrigin: "0 50%" }}>
        <Pill size={32} bg={C.banana} color={C.forest}>medial epicondyle</Pill>
      </div>
      <div style={{ position: "absolute", left: 470, top: 40, ...pop(t, 9.05, 0.25) }}>
        <Big size={58}>5 MUSCLES</Big>
      </div>
      <div style={{ position: "absolute", left: 470, top: 104, ...pop(t, 9.3, 0.25) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.matcha }}>1 starting point</div>
      </div>
      <div style={{ position: "absolute", left: 460, top: 850, ...pop(t, 10.75, 0.25) }}>
        <Pill size={30} bg={C.forest}>common flexor origin</Pill>
      </div>
    </Scene>
  );
};

/* 4. The hand trick on our own diagram */
const NT: Record<M, number> = { PT: 11.75, FCR: 12.95, PL: 14.68, FDS: 16.18, FCU: 18.47 };
const FT: Record<M, number> = { PT: 11.51, FCR: 12.58, PL: 14.49, FDS: 15.92, FCU: 18.12 };
const DX = 20, DY = 100, DW = 600;
const kk = DW / 800;
const sx = (x: number) => DX + x * kk;
const sy = (y: number) => DY + y * kk;
const FDIR: Record<M, [number, number]> = { PT: [520, 390], FCR: [420, 520], PL: [330, 560], FDS: [270, 580], FCU: [200, 520] };
export const V4: React.FC = () => {
  const t = useT();
  let cur: M | null = null;
  MUS.forEach((m) => {
    if (t >= FT[m] - 0.05) cur = m;
  });
  const lit: Partial<Record<M, number>> = {};
  MUS.forEach((m) => (lit[m] = NT[m]));
  const palm: [number, number] = [190, 150];
  const handIn = ramp(t, 11.45, 11.9);
  return (
    <Scene start={11.45} end={20.0} push={0.006}>
      <div style={{ position: "absolute", left: 0, width: 860, top: 18, display: "flex", justifyContent: "center", ...pop(t, 11.5, 0.25) }}>
        <Big size={62}>THE HAND TRICK</Big>
      </div>
      <div style={{ position: "absolute", left: DX, top: DY }}>
        <ForearmDiagram t={t} w={DW} lit={lit} glow={cur ? [cur] : []} id="v4" />
      </div>
      {/* ghost hand: heel of the palm on the medial epicondyle, fingers fan down the forearm */}
      <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: handIn }}>
        <circle cx={sx(palm[0])} cy={sy(palm[1])} r={62} fill="rgba(247,246,236,0.35)" stroke={C.forest} strokeWidth={4} strokeDasharray="10 8" />
        {MUS.map((m) => {
          const on = ramp(t, FT[m] - 0.05, FT[m] + 0.3);
          const [ex, ey] = FDIR[m];
          const x1 = sx(palm[0]), y1 = sy(palm[1]);
          const x2 = sx(palm[0] + (ex - palm[0]) * (0.25 + 0.75 * on)), y2 = sy(palm[1] + (ey - palm[1]) * (0.25 + 0.75 * on));
          const hot = cur === m;
          return (
            <g key={m} opacity={0.35 + 0.65 * on}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.forest} strokeWidth={hot ? 22 : 17} strokeLinecap="round" opacity={0.8} />
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={hot ? C.banana : "#FFF4E4"} strokeWidth={hot ? 14 : 10} strokeLinecap="round" opacity={hot ? 1 : 0.8} />
              <circle cx={x2} cy={y2} r={hot ? 9 : 7} fill={MCOL[m]} stroke={C.forest} strokeWidth={3} />
            </g>
          );
        })}
      </svg>
      {/* finger -> muscle chips */}
      <div style={{ position: "absolute", left: 535, top: 150, display: "flex", flexDirection: "column", gap: 22 }}>
        {MUS.map((m) => (
          <FChip key={m} m={m} on={t >= FT[m] - 0.05 ? 1 : 0} size={30} hot={cur === m} />
        ))}
      </div>
      {/* current pair */}
      {cur && (
        <div key={cur} style={{ position: "absolute", left: 0, width: 860, top: 862, display: "flex", justifyContent: "center", ...pop(t, FT[cur as M], 0.22) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, background: C.forest, borderRadius: 26, padding: "10px 24px 14px", boxShadow: "0 8px 0 rgba(31,42,20,0.18)" }}>
            <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.banana }}>{FINGER[cur as M]}</span>
            <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.paper }}>→</span>
            <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.paper, whiteSpace: "nowrap", borderBottom: `6px solid ${MCOL[cur as M]}` }}>{MNAME[cur as M].toLowerCase()}</span>
          </div>
        </div>
      )}
    </Scene>
  );
};

/* 5. Quick test */
export const V5: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[22.31, 3], [22.94, 2], [23.59, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => {
    if (t >= s - 0.05 && t < 24.2) { n = v; n0 = s; }
  });
  const opts = ["palmaris longus", "flexor digitorum superficialis", "flexor carpi ulnaris"];
  return (
    <Scene start={20.0} end={24.2}>
      <div style={{ position: "absolute", left: 20, top: 55, width: 820, height: 830, borderRadius: 48, background: C.forest, ...pop(t, 20.05, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 56, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 135, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 66, lineHeight: 1.12, color: C.paper, ...pop(t, 20.6) }}>
          Which muscle is your <span style={{ color: C.banana }}>RING</span> finger?
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 385, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          {opts.map((o, i) => (
            <div key={o} style={{ ...pop(t, 21.2 + i * 0.15), display: "flex", alignItems: "center", gap: 18, width: 700 }}>
              <div style={{ width: 62, height: 62, flex: "0 0 62px", borderRadius: 18, background: C.banana, color: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, border: `4px solid ${C.paper}` }}>{"ABC"[i]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper, whiteSpace: "nowrap" }}>{o}</div>
            </div>
          ))}
        </div>
        {n !== null && (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 630, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 170, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 6. Answer on Gray's plate, with the 1918 name */
export const V6: React.FC = () => {
  const t = useT();
  return (
    <Scene start={24.2} end={26.35} push={0.01}>
      <div style={{ position: "absolute", left: 0, width: 860, top: 10, display: "flex", justifyContent: "center", ...pop(t, 24.25, 0.25) }}>
        <Pill size={44} bg={C.matcha}>B ✓ flexor digitorum superficialis</Pill>
      </div>
      <Plate src="plates/forearm_up.png" aspect={AUP} x={30} y={95} w={380} a={24.2} b={26.35} zoomFrom={[1.15, 0.4, 0.75]} zoomTo={[1.4, 0.4, 0.78]}
        labels={[{ x: 0.4, y: 0.8, text: "FDS", t: 24.45, hot: true, ox: 70, oy: -70 }]} />
      <div style={{ position: "absolute", left: 420, top: 150, width: 420, display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={pop(t, 24.6, 0.25)}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.forest, lineHeight: 1.08 }}>flexes fingers<br />2 to 5</div>
        </div>
        <div style={pop(t, 24.9, 0.25)}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.matcha, lineHeight: 1.15 }}>4 tendons, one<br />to each finger</div>
        </div>
        <div style={{ ...pop(t, 25.25, 0.25), marginTop: 30 }}>
          <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "12px 18px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 27, color: C.forest, lineHeight: 1.2, boxShadow: "0 6px 0 rgba(31,42,20,0.08)" }}>
            <span style={{ color: C.matcha }}>1918 atlas name:</span>
            <br />“flexor digitorum sublimis”
          </div>
        </div>
      </div>
    </Scene>
  );
};

/* 7. Save */
export const V7: React.FC = () => {
  const t = useT();
  const b = ramp(t, 26.4, 26.75);
  return (
    <Scene start={26.35} end={28.55}>
      <div style={center(0, pop(t, 26.4))}>
        <svg width={150} height={190} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={center(205, pop(t, 26.47))}>
        <Big size={116}>SAVE THIS</Big>
      </div>
      <div style={center(335, pop(t, 26.95))}>
        <Big size={52} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ position: "absolute", left: 175, top: 430, display: "flex", flexDirection: "column", gap: 14 }}>
        {MUS.map((m, i) => (
          <div key={m} style={{ display: "flex", alignItems: "center", gap: 14, ...pop(t, 27.1 + i * 0.08) }}>
            <FChip m={m} size={28} />
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, color: C.forest, whiteSpace: "nowrap" }}>{MNAME[m].toLowerCase()}</div>
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
    <Scene start={28.55} end={29.95}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, 28.57, 0.3) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.banana, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 28.7, 28.95) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 28.55) * 5))})`, opacity: ramp(t, 28.6, 28.8) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
