import React from "react";
import { C, FONT, Pill, Scene, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, pop } from "./Scenes67";
import { PlateBox74 } from "./Scenes74";
import { ANCHOR, N, NARROW, NCOL, NORDER, Neck, Phrenic } from "./Neck89";

export const A805 = 1510 / 2035;
export const A804 = 1781 / 2200;
export const P805 = "plates/fig805_neck.png";
export const P804 = "plates/fig804_plan.png";
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* 6 branches: 4 skin + 2 motor */
export type K6 = N | "PH" | "AN";
export const ALL6: K6[] = ["LO", "GA", "TC", "SC", "PH", "AN"];
export const COL6: Record<K6, string> = { ...NCOL, PH: "#9C7BD0", AN: "#3FA89A" };
export const SYM6: Record<K6, string> = { ...NARROW, PH: "C3–5", AN: "∪" };
/* voice times (words.json) */
export const T6: Record<K6, number> = { LO: 6.1, GA: 7.66, TC: 9.68, SC: 12.27, PH: 20.23, AN: 24.62 };
export const NAME6: Record<K6, string> = {
  LO: "Lesser occipital",
  GA: "Great auricular",
  TC: "Transverse cervical",
  SC: "Supraclavicular",
  PH: "Phrenic",
  AN: "Ansa cervicalis",
};
export const TO6: Record<K6, string> = {
  LO: "UP · scalp behind the ear (C2)",
  GA: "UP · ear + angle of the jaw (C2–3)",
  TC: "ACROSS · front of the neck (C2–3)",
  SC: "DOWN · over the collarbone (C3–4)",
  PH: "MOTOR · diaphragm (C3, 4, 5)",
  AN: "MOTOR · strap muscles (C1–3)",
};

export const Chip6: React.FC<{ k: K6; size?: number; on?: number; hot?: boolean }> = ({ k, size = 64, on = 1, hot }) => {
  const s = SYM6[k];
  const fs = s.length > 2 ? size * 0.3 : size * 0.6;
  return (
    <div style={{ width: size, height: size, flex: `0 0 ${size}px`, borderRadius: size * 0.28, background: on > 0.5 ? COL6[k] : "rgba(31,42,20,0.08)", border: `4px solid ${on > 0.5 ? C.forest : "rgba(31,42,20,0.25)"}`, color: on > 0.5 ? C.forest : "rgba(31,42,20,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: fs, transform: `scale(${hot ? 1.16 : 1})`, boxShadow: hot ? `0 0 0 6px ${C.banana}` : "none", lineHeight: 1 }}>
      {s}
    </div>
  );
};

const Counter: React.FC<{ t: number; top?: number }> = ({ t, top = 10 }) => {
  const n = ALL6.filter((k) => t >= T6[k] - 0.05).length;
  return (
    <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}>
      {ALL6.map((k) => {
        const p = ramp(t, T6[k] - 0.05, T6[k] + 0.15);
        const hot = t >= T6[k] - 0.05 && t < T6[k] + 1.4;
        return <div key={k} style={{ transform: `scale(${1 + 0.25 * p * (1 - ramp(t, T6[k] + 0.15, T6[k] + 0.45))})` }}><Chip6 k={k} size={62} on={p} hot={hot} /></div>;
      })}
      <div style={{ marginLeft: 10, background: C.forest, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 34, borderRadius: 20, padding: "4px 16px 8px", whiteSpace: "nowrap" }}>{n}/6</div>
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
const Stage: React.FC<{ t: number; k: Kf; id: string; h?: number; top?: number; children?: (P: (m: [number, number]) => [number, number]) => React.ReactNode } & Omit<React.ComponentProps<typeof Neck>, "t" | "w" | "id">> = ({ t, k, id, children, h = 800, top = 110, ...rest }) => {
  const [, s, cx, cy] = k;
  const u = (860 / 900) * s;
  const X0 = 430 - cx * u, Y0 = h / 2 - cy * u;
  const P = (m: [number, number]) => [X0 + m[0] * u, top + Y0 + m[1] * u] as [number, number];
  return (
    <>
      <div style={{ position: "absolute", left: 0, top, width: 860, height: h, overflow: "hidden", borderRadius: 40, background: C.paper, boxShadow: `0 0 0 5px ${C.line}` }}>
        <div style={{ position: "absolute", left: X0, top: Y0 }}>
          <Neck t={t} w={860 * s} id={id} {...rest} />
        </div>
      </div>
      {children && children(P)}
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
        <Pill size={size} bg={bg} color={fg} style={{ whiteSpace: "pre", lineHeight: 1.1, textAlign: "center" }}>{text}</Pill>
      </div>
    </>
  );
};
const Note1918: React.FC<{ t: number; t0: number; text: React.ReactNode; top?: number; left?: number; size?: number }> = ({ t, t0, text, top = 856, left = 30, size = 25 }) => (
  <div style={{ position: "absolute", left, top, opacity: ramp(t, t0, t0 + 0.25), transform: `scale(${0.8 + 0.2 * ramp(t, t0, t0 + 0.25)})`, transformOrigin: "0 0" }}>
    <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 16px 10px", fontFamily: FONT, fontWeight: 800, fontSize: size, color: C.forest, lineHeight: 1.25, boxShadow: "0 6px 0 rgba(31,42,20,0.08)", whiteSpace: "nowrap" }}>
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

/* 1. Hook: Gray's 1918 Fig. 805 (nerves of the side of the neck) visible from frame 0 + challenge */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={2.9} push={0.02}>
      <div style={center(10, pop(t, -0.4, 0.25))}>
        <Big size={100}>CERVICAL PLEXUS</Big>
      </div>
      <div style={center(122, pop(t, -0.3, 0.25))}>
        <Big size={112} color={C.red}>NAME ALL 6?</Big>
      </div>
      <PlateBox74 src={P805} aspect={A805} x={30} y={262} w={800} h={600} a={-0.6} b={2.9} from={[0.46, 0.64, 0.9]} to={[0.46, 0.66, 0.64]}
        labels={[{ x: 0.465, y: 0.685, text: "cervical plexus\nskin branches", t: 1.2, hot: true, ox: 60, oy: -200 }]} />
      <div style={center(884, pop(t, 0.1, 0.25))}>
        <Pill size={33} bg={C.forest}>cervical plexus · mnemonic</Pill>
      </div>
    </Scene>
  );
};

/* 2. The trick: 2 up, 1 across, 1 down */
export const V2: React.FC = () => {
  const t = useT();
  const rows: { k: N; t0: number; word: string }[] = [
    { k: "LO", t0: 4.07, word: "UP" },
    { k: "GA", t0: 4.2, word: "UP" },
    { k: "TC", t0: 4.56, word: "ACROSS" },
    { k: "SC", t0: 5.18, word: "DOWN" },
  ];
  /* arrow fan from Erb's point */
  const fan: Record<N, [number, number]> = { LO: [-120, -170], GA: [30, -200], TC: [210, -10], SC: [-10, 190] };
  return (
    <Scene start={2.9} end={5.75} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 820, height: 840, borderRadius: 48, background: C.forest, ...pop(t, 2.92, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 50, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 8, color: C.banana }}>THE TRICK</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 104, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 76, color: C.paper, ...pop(t, 3.15, 0.3) }}>
          <span style={{ color: C.banana }}>4</span> skin nerves
        </div>
        <svg width={820} height={430} style={{ position: "absolute", left: 0, top: 200 }}>
          {NORDER.map((k) => {
            const r = rows.find((x) => x.k === k)!;
            const p = ramp(t, r.t0, r.t0 + 0.3);
            const [dx, dy] = fan[k];
            const cx = 410, cy = 230;
            const ex = cx + dx * p, ey = cy + dy * p;
            const ang = Math.atan2(dy, dx);
            return (
              <g key={k}>
                <line x1={cx} y1={cy} x2={cx + dx} y2={cy + dy} stroke="rgba(247,246,236,0.22)" strokeWidth={16} strokeLinecap="round" strokeDasharray="2 24" opacity={ramp(t, 3.0, 3.3)} />
                {p > 0.01 && <g>
                <line x1={cx} y1={cy} x2={ex} y2={ey} stroke={C.paper} strokeWidth={26} strokeLinecap="round" />
                <line x1={cx} y1={cy} x2={ex} y2={ey} stroke={NCOL[k]} strokeWidth={16} strokeLinecap="round" />
                {p > 0.9 && (
                  <polygon points={`${ex + Math.cos(ang) * 30},${ey + Math.sin(ang) * 30} ${ex + Math.cos(ang + 2.3) * 26},${ey + Math.sin(ang + 2.3) * 26} ${ex + Math.cos(ang - 2.3) * 26},${ey + Math.sin(ang - 2.3) * 26}`} fill={NCOL[k]} stroke={C.paper} strokeWidth={5} />
                )}
              </g>}
              </g>
            );
          })}
          <circle cx={410} cy={230} r={22} fill={C.red} stroke={C.paper} strokeWidth={6} opacity={ramp(t, 3.05, 3.3)} />
        </svg>
        {/* words */}
        <div style={{ position: "absolute", left: 120, top: 200, ...pop(t, 4.12, 0.25) }}><Pill size={44} bg={C.banana} color={C.forest}>2 UP</Pill></div>
        <div style={{ position: "absolute", left: 610, top: 360, ...pop(t, 4.6, 0.25) }}><Pill size={44} bg={C.banana} color={C.forest}>1 →</Pill></div>
        <div style={{ position: "absolute", left: 470, top: 590, ...pop(t, 5.2, 0.25) }}><Pill size={44} bg={C.banana} color={C.forest}>1 DOWN</Pill></div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 700, display: "flex", justifyContent: "center", gap: 14, ...pop(t, 5.32, 0.25) }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: "#B9D27A", whiteSpace: "nowrap" }}>+ 2 motor nerves (the quiz!)</div>
        </div>
      </div>
    </Scene>
  );
};

/* 3. UP: lesser occipital + great auricular */
export const V3: React.FC = () => {
  const t = useT();
  const k = cam(t, [[5.75, 0.95, 450, 520], [6.2, 1.3, 430, 430], [9.1, 1.32, 440, 440]]);
  return (
    <Scene start={5.75} end={9.1} push={0.004}>
      <Stage t={t} k={k} id="v3" lit={{ LO: T6.LO - 0.05, GA: T6.GA - 0.05 }} hot={t < 7.6 ? ["LO"] : ["GA"]} dim={ramp(t, 7.6, 7.9)} ghost={0.25}>
        {(P) => (
          <>
            <Call t={t} t0={6.2} a={P(ANCHOR.LO)} to={[200, 300]} text={"lesser occipital\n→ scalp"} bg={NCOL.LO} fg={C.forest} size={38} />
            <Call t={t} t0={7.75} a={P(ANCHOR.GA)} to={[650, 330]} text={"great auricular\n→ ear"} bg={NCOL.GA} fg={C.forest} size={38} />
          </>
        )}
      </Stage>
      <Counter t={t} />
      <div style={{ position: "absolute", left: 24, top: 860, ...pop(t, 5.9, 0.25), transformOrigin: "0 0" }}>
        <Pill size={26} bg={C.forest}>right side of the neck · face looks right</Pill>
      </div>
    </Scene>
  );
};

/* 4. ACROSS: transverse cervical · DOWN: supraclavicular */
export const V4: React.FC = () => {
  const t = useT();
  const k = cam(t, [[9.1, 1.32, 440, 440], [9.6, 1.3, 540, 600], [11.8, 1.28, 540, 610], [12.3, 1.15, 470, 740], [14.2, 1.17, 470, 740]]);
  return (
    <Scene start={9.1} end={14.2} push={0.004}>
      <Stage t={t} k={k} id="v4" lit={{ LO: 0, GA: 0, TC: T6.TC - 0.05, SC: T6.SC - 0.05 }} hot={t < 12.1 ? ["TC"] : ["SC"]} dim={1} ghost={0.2}>
        {(P) => (
          <>
            <Call t={t} t0={9.8} t1={12.1} a={P(ANCHOR.TC)} to={[620, 260]} text={"transverse cervical\n→ front of neck"} bg={NCOL.TC} fg={C.forest} size={36} />
            <Call t={t} t0={12.35} a={P(ANCHOR.SC)} to={[640, 330]} text={"supraclavicular\n→ over the clavicle"} bg={NCOL.SC} fg={C.forest} size={36} />
            <Call t={t} t0={13.5} a={P(ANCHOR.CLAV)} to={[230, 790]} text="clavicle" size={30} />
          </>
        )}
      </Stage>
      <Counter t={t} />
      <Tip t={t} t0={12.4} top={922} size={28} bg={C.forest} fg={C.paper}>3 branches: anterior · middle · posterior</Tip>
    </Scene>
  );
};

/* 5. Erb's point on the real thing: Gray's 1918 Fig. 805 with modern labels */
export const V5: React.FC = () => {
  const t = useT();
  return (
    <Scene start={14.2} end={16.05} push={0.006}>
      <PlateBox74 src={P805} aspect={A805} x={30} y={70} w={800} h={790} a={14.2} b={16.05} from={[0.47, 0.665, 0.62]} to={[0.47, 0.665, 0.58]} ls={28}
        labels={[
          { x: 0.372, y: 0.47, text: "lesser occipital", t: 14.3, ox: 40, oy: 30 },
          { x: 0.452, y: 0.55, text: "great auricular", t: 14.42, ox: 110, oy: -20 },
          { x: 0.6, y: 0.69, text: "transverse cervical", t: 14.55, ox: -40, oy: 110 },
          { x: 0.49, y: 0.86, text: "supraclavicular", t: 14.68, ox: 60, oy: -40 },
          { x: 0.462, y: 0.684, text: "Erb's point", t: 15.15, hot: true, ox: -200, oy: 40 },
        ]} />
      <div style={center(0, pop(t, 14.25, 0.25))}>
        <Pill size={34} bg={C.forest}>Gray's Anatomy 1918 · side of the neck</Pill>
      </div>
      <Note1918 t={t} t0={15.3} text={<>“smaller occipital” · “cervical cutaneous”</>} top={872} left={-6} size={24} />
    </Scene>
  );
};

/* 6. Quick test */
export const V6: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[18.22, 3], [18.86, 2], [19.5, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < 20.15) { n = v; n0 = s; } });
  const opts = ["Great auricular", "Phrenic", "Supraclavicular"];
  return (
    <Scene start={16.05} end={20.15}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 820, height: 850, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 16.1, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 110, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 60, lineHeight: 1.1, color: C.paper, ...pop(t, 16.7) }}>
          Which branch keeps you <span style={{ color: C.banana }}>BREATHING?</span>
        </div>
        {/* lungs icon */}
        <svg width={300} height={300} viewBox="0 0 300 300" style={{ position: "absolute", left: 40, top: 380, ...pop(t, 17.4, 0.3) }}>
          <path d="M150 30 L150 120" stroke={C.paper} strokeWidth={14} strokeLinecap="round" />
          <path d="M150 120 C 130 130, 115 140, 105 150 M150 120 C 170 130, 185 140, 195 150" stroke={C.paper} strokeWidth={12} fill="none" strokeLinecap="round" />
          <path d="M120 90 C 60 90, 40 170, 40 230 C 40 270, 80 280, 120 260 C 135 252, 138 200, 135 130 Z" fill="#E8796B" stroke={C.paper} strokeWidth={8} transform={`scale(${1 + 0.05 * Math.sin(t * 5)})`} style={{ transformOrigin: "90px 180px" }} />
          <path d="M180 90 C 240 90, 260 170, 260 230 C 260 270, 220 280, 180 260 C 165 252, 162 200, 165 130 Z" fill="#E8796B" stroke={C.paper} strokeWidth={8} transform={`scale(${1 + 0.05 * Math.sin(t * 5)})`} style={{ transformOrigin: "210px 180px" }} />
          <path d="M30 285 C 90 230, 210 230, 270 285" stroke={C.banana} strokeWidth={12} fill="none" strokeLinecap="round" />
        </svg>
        <div style={{ position: "absolute", left: 380, width: 420, top: 360, display: "flex", flexDirection: "column", gap: 26 }}>
          {opts.map((o, i) => (
            <div key={o} style={{ ...pop(t, 17.0 + i * 0.16), display: "flex", alignItems: "center", gap: 14, transformOrigin: "0 50%" }}>
              <div style={{ width: 58, height: 58, flex: "0 0 58px", borderRadius: 16, background: C.banana, color: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, border: `4px solid ${C.paper}` }}>{"ABC"[i]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.paper, whiteSpace: "nowrap" }}>{o}</div>
            </div>
          ))}
        </div>
        {n !== null && (
          <div key={n} style={{ position: "absolute", left: 500, top: 620, width: 200, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 170, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 7. Answer: phrenic nerve, C3-4-5 keeps the diaphragm alive */
export const V7: React.FC = () => {
  const t = useT();
  return (
    <Scene start={20.15} end={23.9} push={0.006}>
      <div style={center(0, pop(t, 20.2, 0.25))}>
        <Pill size={46} bg={COL6.PH} color={C.forest}>B ✓ PHRENIC NERVE</Pill>
      </div>
      <div style={{ position: "absolute", left: 20, top: 110, width: 820, height: 760, borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}`, overflow: "hidden", ...pop(t, 20.2, 0.3) }}>
        <Phrenic t={t} w={820} r3={21.35} r4={21.62} r5={21.95} down={22.2} dia={ramp(t, 22.7, 23.0)} />
        <div style={{ position: "absolute", left: 440, top: 150, opacity: ramp(t, 21.3, 21.5) }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64, color: C.forest, lineHeight: 1.05 }}>
            C<span style={{ color: t >= 21.4 ? "#7A5AB8" : C.line }}>3</span>, <span style={{ color: t >= 21.68 ? "#7A5AB8" : C.line }}>4</span>, <span style={{ color: t >= 22.02 ? "#7A5AB8" : C.line }}>5</span>
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest, marginTop: 10, opacity: ramp(t, 22.4, 22.6) }}>keeps the</div>
          <div style={{ marginTop: 8, ...pop(t, 22.75, 0.25), transformOrigin: "0 50%" }}><Pill size={38} bg={C.banana} color={C.forest}>diaphragm alive</Pill></div>
        </div>
        <div style={{ position: "absolute", left: 470, top: 470, opacity: ramp(t, 22.3, 22.5), fontFamily: FONT, fontWeight: 800, fontSize: 30, color: "#7A5AB8" }}>phrenic nerve ↓</div>
      </div>
    </Scene>
  );
};

/* 8. Ansa cervicalis on Gray's 1918 Fig. 804 (plan of the cervical plexus) */
export const V8: React.FC = () => {
  const t = useT();
  return (
    <Scene start={23.9} end={26.85} push={0.006}>
      <PlateBox74 src={P804} aspect={A804} x={30} y={70} w={800} h={790} a={23.9} b={26.85} from={[0.5, 0.55, 0.95]} to={[0.62, 0.62, 0.62]} ls={30}
        labels={[
          { x: 0.6, y: 0.79, text: "phrenic", t: 24.15, ox: -100, oy: 60 },
          { x: 0.74, y: 0.705, text: "ansa cervicalis\n→ strap muscles", t: 24.65, hot: true, ox: -40, oy: -220 },
        ]} />
      <div style={center(0, pop(t, 23.95, 0.25))}>
        <Pill size={34} bg={C.forest}>Gray's Anatomy 1918 · plan of the cervical plexus</Pill>
      </div>
      <Note1918 t={t} t0={25.3} text={<>“superficial descending” = supraclavicular</>} top={872} left={-6} size={24} />
    </Scene>
  );
};

/* 9. Save + cheat sheet */
export const V9: React.FC = () => {
  const t = useT();
  const s0 = 26.85;
  const b = ramp(t, s0 + 0.05, s0 + 0.4);
  return (
    <Scene start={s0} end={28.85}>
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
      <div style={{ position: "absolute", left: 30, top: 190, width: 800, height: 720, borderRadius: 40, background: C.card, border: `3px solid ${C.line}`, boxShadow: "0 18px 40px rgba(31,42,20,0.12)", ...pop(t, s0 + 0.15, 0.3) }}>
        <div style={{ position: "absolute", left: 36, top: 24, fontFamily: FONT, fontWeight: 800, fontSize: 29, color: C.matcha, letterSpacing: 2 }}>CERVICAL PLEXUS · 6 BRANCHES</div>
        {ALL6.map((l, i) => (
          <div key={l} style={{ position: "absolute", left: 36, top: 78 + i * 100 + (i >= 4 ? 18 : 0), display: "flex", alignItems: "center", gap: 22, opacity: ramp(t, s0 + 0.25 + i * 0.07, s0 + 0.5 + i * 0.07) }}>
            <Chip6 k={l} size={76} />
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.forest, whiteSpace: "nowrap", lineHeight: 1.05 }}>{NAME6[l]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 25, color: C.matcha, whiteSpace: "nowrap", marginTop: 4 }}>{TO6[l]}</div>
            </div>
          </div>
        ))}
        <div style={{ position: "absolute", left: 36, top: 474, width: 728, height: 3, background: C.line }} />
      </div>
    </Scene>
  );
};

/* 10. End card (≤ 1.5 s) */
export const V10: React.FC = () => {
  const t = useT();
  const s0 = 28.85;
  return (
    <Scene start={s0} end={30.2}>
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
