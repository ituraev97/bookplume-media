import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { CrossSection, ElbowDiagram, Hand } from "./Elbow64";

export const AARM = 969 / 2496;
export const AHAND = 620 / 825;
export const AHUM = 801 / 3165;
export const liveAlpha = (_t: number) => 0;
export const HUM_COVERS = [
  { x: 0, y: 0.153, w: 0.385, h: 0.026 },
  { x: 0, y: 0.912, w: 0.05, h: 0.088 },
  { x: 0, y: 0.966, w: 0.17, h: 0.034 },
  { x: 0.895, y: 0.812, w: 0.105, h: 0.024 },
];
export const HAND_COVERS = [{ x: 0, y: 0.36, w: 0.075, h: 0.08 }];
export const ARM_COVERS = [{ x: 0, y: 0.785, w: 0.045, h: 0.03 }];

export const pop = (t: number, t0: number, d = 0.3) => {
  const p = ramp(t, t0, t0 + d);
  return { opacity: p, transform: `scale(${0.6 + 0.4 * p + 0.08 * Math.sin(Math.min(1, p) * Math.PI)})` } as React.CSSProperties;
};
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });
export const Big: React.FC<{ size?: number; children: React.ReactNode; color?: string }> = ({ size = 110, children, color = C.forest }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1, letterSpacing: -2, textAlign: "center", whiteSpace: "nowrap" }}>{children}</div>
);
const Lead: React.FC<{ x1: number; y1: number; x2: number; y2: number; p: number; col?: string }> = ({ x1, y1, x2, y2, p, col = C.banana }) =>
  p <= 0 ? null : (
    <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: p }}>
      <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke={C.paper} strokeWidth={11} strokeLinecap="round" />
      <line x1={x1} y1={y1} x2={x1 + (x2 - x1) * p} y2={y1 + (y2 - y1) * p} stroke={C.forest} strokeWidth={5} strokeLinecap="round" />
      <circle cx={x1} cy={y1} r={12} fill={col} stroke={C.forest} strokeWidth={5} />
    </svg>
  );

/** bone icon with a red cross */
const NoBone: React.FC<{ p: number; size?: number }> = ({ p, size = 200 }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 200 120" style={{ overflow: "visible" }}>
    <path d="M 40 42 C 22 20 2 38 14 54 C 0 66 16 90 36 74 L 164 74 C 184 90 200 66 186 54 C 198 38 178 20 160 42 Z" fill="#F4ECD4" stroke={C.forest} strokeWidth={7} strokeLinejoin="round" />
    <g opacity={p} strokeLinecap="round">
      <line x1={30} y1={10} x2={170} y2={110} stroke={C.red} strokeWidth={16 * p} />
      <line x1={170} y1={10} x2={30} y2={110} stroke={C.red} strokeWidth={16 * p} />
    </g>
  </svg>
);

/* 1. Hook: Gray's 1918 Fig. 812 on screen from frame 0 */
export const V1: React.FC = () => {
  const t = useT();
  const dot = 0.5 + 0.5 * Math.sin(t * 7);
  const PX = 14, PY = 236, PW = 262;
  const PH = PW / AARM;
  return (
    <Scene start={-0.6} end={3.3} push={0.02}>
      <div style={center(0, pop(t, -0.4, 0.25))}>
        <Big size={94}>YOUR FUNNY BONE</Big>
      </div>
      <div style={center(104, pop(t, -0.3, 0.25))}>
        <Big size={112} color={C.red}>ISN'T A BONE</Big>
      </div>
      <Plate src="plates/arm812.png" aspect={AARM} x={PX} y={PY} w={PW} a={-0.6} b={3.3} zoomFrom={[1.0, 0.5, 0.45]} zoomTo={[1.12, 0.62, 0.44]} covers={ARM_COVERS} credit="Gray's 1918 · PD" />
      {/* pulsing "funny bone" spot at the medial elbow */}
      <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        <circle cx={PX + 0.72 * PW} cy={PY + 0.445 * PH} r={20 + 10 * dot} fill="none" stroke={C.red} strokeWidth={6} opacity={ramp(t, 0.1, 0.4)} />
        <circle cx={PX + 0.72 * PW} cy={PY + 0.445 * PH} r={11} fill={C.red} stroke={C.paper} strokeWidth={4} opacity={ramp(t, 0.1, 0.4)} />
      </svg>
      <div style={{ position: "absolute", left: 320, top: 255, ...pop(t, 0.35, 0.25) }}>
        <NoBone p={ramp(t, 0.9, 1.2)} size={210} />
      </div>
      <Stamp t0={1.6} text="IT'S A NERVE" size={44} rot={-7} color={C.red} style={{ left: 305, top: 410 }} />
      <div style={{ position: "absolute", left: 590, top: 525, width: 270, height: 400, overflow: "hidden", borderRadius: 30, background: C.card, boxShadow: `0 0 0 4px ${C.line}`, ...pop(t, 1.75, 0.3) }}>
        <div style={{ position: "absolute", left: -50, top: -120 }}>
          <ElbowDiagram t={t} w={380} id="v1" draw={ramp(t, 1.9, 2.9)} nerve={ramp(t, 2.4, 2.7)} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 305, top: 560, ...pop(t, 2.4, 0.25), transformOrigin: "0 50%" }}>
        <Pill size={42} bg={C.banana} color={C.forest}>ulnar nerve</Pill>
      </div>
      <div style={{ position: "absolute", left: 305, top: 690, ...pop(t, 0.7, 0.25), transformOrigin: "0 50%" }}>
        <Pill size={24} bg={C.forest}>funny bone · anatomy fact</Pill>
      </div>
    </Scene>
  );
};

/* 2. Memory trick: humerus = humorous, on Gray's Fig. 207 */
const Word: React.FC<{ w: string; hi: number; col?: string }> = ({ w, hi, col = C.forest }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 84, letterSpacing: 2, color: col, whiteSpace: "nowrap", lineHeight: 1 }}>
    {w.split("").map((ch, i) => (
      <span key={i} style={{ background: i < hi ? C.banana : "transparent", borderRadius: 10, padding: "0 2px" }}>{ch}</span>
    ))}
  </div>
);
export const V2: React.FC = () => {
  const t = useT();
  const PX = 20, PY = 100, PW = 212;
  const PH = PW / AHUM;
  return (
    <Scene start={3.3} end={7.4} push={0.01}>
      <div style={center(16, pop(t, 3.35, 0.25))}>
        <Big size={70}>MEMORY TRICK</Big>
      </div>
      <Plate src="plates/humerus207.png" aspect={AHUM} x={PX} y={PY} w={PW} a={3.3} b={7.4} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.08, 0.5, 0.6]} covers={HUM_COVERS} credit="" />
      <Lead x1={PX + 0.5 * PW} y1={PY + 0.45 * PH} x2={280} y2={330} p={ramp(t, 4.9, 5.2)} />
      <div style={{ position: "absolute", left: 280, top: 150, ...pop(t, 3.9, 0.25), transformOrigin: "0 50%" }}>
        <Pill size={34} bg={C.forest}>the arm bone it crosses</Pill>
      </div>
      <div style={{ position: "absolute", left: 280, top: 280, ...pop(t, 4.86, 0.25), transformOrigin: "0 50%" }}>
        <Word w="HUMERUS" hi={ramp(t, 5.6, 5.9) > 0.5 ? 3 : 0} />
      </div>
      <div style={{ position: "absolute", left: 440, top: 400, ...pop(t, 5.65, 0.25) }}>
        <svg width={120} height={140} viewBox="0 0 120 140">
          <path d="M 60 10 L 60 100 M 25 70 L 60 110 L 95 70" fill="none" stroke={C.forest} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ position: "absolute", left: 120, top: 40, fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.matcha, whiteSpace: "nowrap" }}>sounds like…</div>
      </div>
      <div style={{ position: "absolute", left: 275, top: 560, ...pop(t, 6.6, 0.25), transformOrigin: "0 50%" }}>
        <Word w="HUMOROUS" hi={3} col={C.red} />
      </div>
      <Stamp t0={6.85} text="= FUNNY" size={60} rot={-8} color={C.matcha} style={{ left: 400, top: 720 }} />
    </Scene>
  );
};

/* 3. Own diagram: behind the medial epicondyle, only skin + a little fat */
export const V3: React.FC = () => {
  const t = useT();
  const DX = -10, DY = 80, DW = 540, k = DW / 800;
  const ex = DX + 232 * k, ey = DY + 476 * k;
  const nx = DX + 238 * k, ny = DY + 300 * k;
  const lens = ramp(t, 10.2, 10.6);
  return (
    <Scene start={7.4} end={12.7} push={0.008}>
      <div style={center(0, pop(t, 7.45, 0.25))}>
        <Big size={62}>RIGHT ELBOW · FROM BEHIND</Big>
      </div>
      <div style={{ position: "absolute", left: DX, top: DY, width: DW, height: 625, overflow: "hidden", borderRadius: 40, background: C.card, boxShadow: `0 0 0 4px ${C.line}`, ...pop(t, 7.45, 0.3) }}>
        <ElbowDiagram t={t} w={DW} id="v3" draw={ramp(t, 7.6, 9.0)} nerve={ramp(t, 8.3, 8.6) * (t < 10.3 ? 1 : 0.4)} epi={ramp(t, 9.25, 9.55)} skin={ramp(t, 10.7, 11.0) * (t < 11.6 ? 1 : 0.5)} zap={t > 8.3 && t < 9.2 ? (t - 8.3) / 0.9 : -1} />
      </div>
      <div style={{ position: "absolute", left: 560, top: 85, ...pop(t, 7.7, 0.25) }}>
        <Pill size={30} bg={C.matcha}>elbow</Pill>
      </div>
      <Lead x1={nx} y1={ny} x2={nx + 120} y2={ny - 70} p={ramp(t, 8.3, 8.6)} />
      <div style={{ position: "absolute", left: nx + 100, top: ny - 110, ...pop(t, 8.45, 0.25), transformOrigin: "0 50%" }}>
        <Pill size={32} bg={C.banana} color={C.forest}>ulnar nerve</Pill>
      </div>
      <Lead x1={ex} y1={ey} x2={60} y2={ey + 260} p={ramp(t, 9.25, 9.55)} col={C.red} />
      <div style={{ position: "absolute", left: 10, top: ey + 238, ...pop(t, 9.35, 0.25), transformOrigin: "0 50%" }}>
        <Pill size={34} bg={C.forest}>medial epicondyle</Pill>
      </div>
      {/* lens line from the groove to the cross-section */}
      {lens > 0 && (
        <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: lens }}>
          <circle cx={ex + 22} cy={ey - 6} r={38} fill="none" stroke={C.forest} strokeWidth={5} strokeDasharray="10 8" />
          <line x1={ex + 58} y1={ey - 18} x2={ex + 58 + (560 - ex) * lens} y2={ey - 18 + (300 - ey) * lens} stroke={C.forest} strokeWidth={4} strokeDasharray="10 8" />
        </svg>
      )}
      <div style={{ position: "absolute", left: 540, top: 150, ...pop(t, 10.25, 0.35) }}>
        <CrossSection t={t} w={310} id="v3" nerve={0.6} skin={ramp(t, 10.7, 11.0)} fat={ramp(t, 11.6, 11.9)} />
      </div>
      <div style={{ position: "absolute", left: 560, top: 485, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={pop(t, 10.74, 0.22)}><Pill size={32} bg={C.red}>only skin</Pill></div>
        <div style={pop(t, 11.65, 0.22)}><Pill size={32} bg={C.banana} color={C.forest}>+ a little fat</Pill></div>
        <div style={pop(t, 12.1, 0.22)}><Pill size={28} bg={C.forest}>no muscle cushion</Pill></div>
      </div>
    </Scene>
  );
};

/* 4. Bump: nerve squashed against the bone */
export const V4: React.FC = () => {
  const t = useT();
  const hit = ramp(t, 12.72, 12.95);
  const squash = ramp(t, 13.85, 14.1) * (1 - 0.6 * ramp(t, 14.9, 15.3));
  const shake = t > 12.9 && t < 13.3 ? Math.sin(t * 90) * 10 * (13.3 - t) : 0;
  return (
    <Scene start={12.7} end={15.25} push={0.006}>
      <div style={center(0, pop(t, 12.72, 0.2))}>
        <Big size={96} color={C.red}>BUMP!</Big>
      </div>
      <div style={{ position: "absolute", left: 140, top: 110, transform: `translateX(${shake}px)` }}>
        <CrossSection t={t} w={580} id="v4" hit={hit} squash={squash} nerve={ramp(t, 13.3, 13.6)} bone={ramp(t, 14.6, 14.9)} />
      </div>
      <div style={{ position: "absolute", left: 20, top: 400, ...pop(t, 13.35, 0.22), transformOrigin: "0 50%" }}>
        <Pill size={30} bg={C.banana} color={C.forest}>nerve</Pill>
      </div>
      <div style={{ position: "absolute", left: 640, top: 560, ...pop(t, 14.65, 0.22) }}>
        <Pill size={30} bg={C.matcha}>bone</Pill>
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 735, display: "flex", justifyContent: "center", ...pop(t, 13.9, 0.25) }}>
        <Pill size={42} bg={C.forest}>squashed against the bone ⚡</Pill>
      </div>
      <div style={{ position: "absolute", left: 650, top: 40, ...pop(t, 14.55, 0.25) }}>
        <Hand t={t} w={150} id="v4" q={ramp(t, 14.6, 14.8)} />
      </div>
    </Scene>
  );
};

/* 5. Quick test */
export const V5: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[17.13, 3], [17.76, 2], [18.41, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => {
    if (t >= s - 0.05 && t < 19.05) { n = v; n0 = s; }
  });
  const opts = ["thumb + index finger", "little + half of ring finger", "middle finger only"];
  return (
    <Scene start={15.25} end={19.05}>
      <div style={{ position: "absolute", left: 20, top: 55, width: 820, height: 830, borderRadius: 48, background: C.forest, ...pop(t, 15.28, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 56, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 135, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 70, lineHeight: 1.12, color: C.paper, ...pop(t, 15.85) }}>
          Which fingers <span style={{ color: C.banana }}>TINGLE?</span>
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 330, display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
          {opts.map((o, i) => (
            <div key={o} style={{ ...pop(t, 16.2 + i * 0.15), display: "flex", alignItems: "center", gap: 18, width: 700 }}>
              <div style={{ width: 62, height: 62, flex: "0 0 62px", borderRadius: 18, background: C.banana, color: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, border: `4px solid ${C.paper}` }}>{"ABC"[i]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.paper, whiteSpace: "nowrap" }}>{o}</div>
            </div>
          ))}
        </div>
        {n !== null && (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 600, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 190, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 6. Answer on Gray's Fig. 812 (ulnar skin area, C8 T1) + own hand */
export const V6: React.FC = () => {
  const t = useT();
  return (
    <Scene start={19.05} end={24.95} push={0.008}>
      <div style={center(0, pop(t, 19.1, 0.25))}>
        <Pill size={44} bg={C.matcha}>B ✓ little + half of ring finger</Pill>
      </div>
      <Plate src="plates/hand812.png" aspect={AHAND} x={10} y={100} w={500} a={19.05} b={24.95} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.0, 0.5, 0.5]} covers={HAND_COVERS} credit="Gray's 1918 · PD" />
      <Lead x1={10 + 0.84 * 500} y1={100 + 0.64 * 665} x2={560} y2={470} p={ramp(t, 19.3, 19.6)} col={C.red} />
      <Lead x1={10 + 0.7 * 500} y1={100 + 0.86 * 665} x2={560} y2={540} p={ramp(t, 20.6, 20.9)} col={C.red} />
      <div style={{ position: "absolute", left: 560, top: 440, ...pop(t, 19.4, 0.22), transformOrigin: "0 50%" }}><Pill size={30} bg={C.banana} color={C.forest}>little finger</Pill></div>
      <div style={{ position: "absolute", left: 560, top: 510, ...pop(t, 20.65, 0.22), transformOrigin: "0 50%" }}><Pill size={30} bg={C.banana} color={C.forest}>½ ring finger</Pill></div>
      <div style={{ position: "absolute", left: 580, top: 100, ...pop(t, 19.35, 0.3) }}>
        <Hand t={t} w={250} id="v6" little={ramp(t, 19.35, 19.7)} ringHalf={ramp(t, 20.6, 20.95)} />
      </div>
      <div style={{ position: "absolute", left: 560, top: 610, width: 300, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ ...pop(t, 23.4, 0.25), fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.matcha }}>roots</div>
        <div style={{ display: "flex", gap: 14 }}>
          <div style={pop(t, 23.65, 0.22)}><Pill size={50} bg={C.banana} color={C.forest}>C8</Pill></div>
          <div style={pop(t, 24.26, 0.22)}><Pill size={50} bg={C.banana} color={C.forest}>T1</Pill></div>
        </div>
        <div style={pop(t, 24.45, 0.22)}><Pill size={26} bg={C.forest}>medial cord → ulnar nerve</Pill></div>
      </div>
      <div style={{ position: "absolute", left: 10, top: 790, width: 500, ...pop(t, 21.6, 0.25) }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "10px 18px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 27, color: C.forest, lineHeight: 1.2 }}>
          <span style={{ background: "#A9C9E6", borderRadius: 8, padding: "0 8px" }}>blue zone</span> = ulnar nerve skin area
          <div style={{ fontSize: 22, color: C.matcha, marginTop: 4 }}>1918 plate label: “Ulnar C.8. T.1.”</div>
        </div>
      </div>
    </Scene>
  );
};

/* 7. Save */
export const SUMMARY = ["funny bone = ulnar nerve", "behind the medial epicondyle", "only skin + a little fat", "little + ½ ring finger", "roots C8 and T1"];
export const V7: React.FC = () => {
  const t = useT();
  const b = ramp(t, 25.0, 25.35);
  return (
    <Scene start={24.95} end={27.3}>
      <div style={center(0, pop(t, 25.0))}>
        <svg width={140} height={178} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={center(195, pop(t, 25.05))}>
        <Big size={116}>SAVE THIS</Big>
      </div>
      <div style={center(325, pop(t, 25.5))}>
        <Big size={50} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ position: "absolute", left: 110, top: 425, display: "flex", flexDirection: "column", gap: 18 }}>
        {SUMMARY.map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 14, ...pop(t, 25.7 + i * 0.12), transformOrigin: "0 50%" }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: i === 0 ? C.banana : C.matcha, border: `4px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.forest }}>{i + 1}</div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.forest, whiteSpace: "nowrap" }}>{s}</div>
          </div>
        ))}
      </div>
    </Scene>
  );
};

/* 8. End card (≤ 1.5 s) */
export const V8: React.FC = () => {
  const t = useT();
  const s0 = 27.3;
  return (
    <Scene start={s0} end={28.7}>
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
