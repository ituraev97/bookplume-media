import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, PlateBox, pop } from "./Scenes67";
import { Abdomen, FULL, LET, ORDER, R, ROWCOL, ROWS } from "./Abd73";

export const A1223 = 1007 / 1496;
export const liveAlpha = (_t: number) => 0;
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* keyframed camera over the diagram: [t, scale, X0, Y0] */
type K = [number, number, number, number];
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

/** region name times (voice) */
export const NT: Record<R, number> = { RH: 6.63, EP: 7.76, LH: 8.44, RL: 9.82, UM: 10.5, LL: 11.05, RI: 12.05, HG: 12.48, LI: 13.27 };
const hotAt = (t: number, rs: R[]) => {
  let cur: R | null = null;
  rs.forEach((r) => { if (t >= NT[r] - 0.05) cur = r; });
  return cur as R | null;
};

/** letter chip */
export const RChip: React.FC<{ r: R; size?: number; row?: number }> = ({ r, size = 54, row }) => {
  const ri = row ?? ROWS.findIndex((x) => x.includes(r));
  return (
    <div style={{ width: size, height: size, flex: `0 0 ${size}px`, borderRadius: size * 0.28, background: ROWCOL[ri], border: `4px solid ${C.forest}`, color: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.62 }}>
      {LET[r]}
    </div>
  );
};

/* 1. Hook: Gray's 1918 Fig. 1223 (with the 9-region grid) visible from frame 0 + challenge */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={2.4} push={0.02}>
      <div style={center(0, pop(t, -0.4, 0.25))}>
        <Big size={124}>NAME ALL 9</Big>
      </div>
      <div style={center(128, pop(t, -0.3, 0.25))}>
        <Big size={66} color={C.red}>ABDOMINAL REGIONS?</Big>
      </div>
      <PlateBox src="plates/abd1223.png" aspect={A1223} x={30} y={225} w={800} h={650} a={-0.6} b={2.4} from={[0.54, 0.45, 1.0]} to={[0.54, 0.46, 0.9]}
        labels={[
          { x: 0.545, y: 0.405, text: "9 boxes", t: 1.1, hot: true, ox: 70, oy: -110 },
        ]} />
      <div style={center(895, pop(t, 0.1, 0.25))}>
        <Pill size={33} bg={C.forest}>9 abdominal regions · mnemonic</Pill>
      </div>
      <Stamp t0={0.7} text="5 SECONDS" size={42} rot={-8} color={C.red} style={{ left: 60, top: 720, whiteSpace: "nowrap" }} />
    </Scene>
  );
};

/* 2. The trick: tic-tac-toe grid, every row is a palindrome */
const ROWT = [4.1, 4.4, 4.7];
export const V2: React.FC = () => {
  const t = useT();
  const g = ramp(t, 2.75, 3.45);
  const cs = 170, gx = 155, gy = 200;
  const both = ramp(t, 5.05, 5.35);
  return (
    <Scene start={2.4} end={6.25} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, ...pop(t, 2.42, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 8, color: C.banana }}>THE TRICK</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 104, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.paper, opacity: ramp(t, 2.65, 2.95) }}>draw a tic-tac-toe grid</div>
        {/* grid lines */}
        <svg width={820} height={860} style={{ position: "absolute", left: 0, top: 0 }}>
          {[1, 2].map((i) => (
            <line key={`v${i}`} x1={gx + cs * i * 1.0} y1={gy} x2={gx + cs * i} y2={gy + 3 * cs * ramp(g, (i - 1) * 0.25, 0.25 + (i - 1) * 0.25)} stroke={C.paper} strokeWidth={10} strokeLinecap="round" />
          ))}
          {[1, 2].map((i) => (
            <line key={`h${i}`} x1={gx} y1={gy + cs * i} x2={gx + 3 * cs * ramp(g, 0.5 + (i - 1) * 0.25, 0.75 + (i - 1) * 0.25)} y2={gy + cs * i} stroke={C.paper} strokeWidth={10} strokeLinecap="round" />
          ))}
        </svg>
        {ROWS.map((row, ri) =>
          row.map((r, ci) => (
            <div key={r} style={{ position: "absolute", left: gx + ci * cs + 15, top: gy + ri * cs + 15, width: cs - 30, height: cs - 30, borderRadius: 30, background: ROWCOL[ri], display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 100, color: C.forest, ...pop(t, ROWT[ri] + ci * 0.07, 0.22) }}>
              {LET[r]}
            </div>
          ))
        )}
        {/* ↔ palindrome marks */}
        {ROWS.map((_row, ri) => (
          <div key={ri} style={{ position: "absolute", left: gx + 3 * cs + 14, top: gy + ri * cs + cs / 2 - 34, opacity: ramp(t, 5.05 + ri * 0.12, 5.3 + ri * 0.12), transform: `scale(${0.7 + 0.3 * ramp(t, 5.05 + ri * 0.12, 5.3 + ri * 0.12)})` }}>
            <svg width={120} height={68} viewBox="0 0 120 68">
              <path d="M10 34 L110 34 M10 34 L30 16 M10 34 L30 52 M110 34 L90 16 M110 34 L90 52" stroke={C.banana} strokeWidth={9} strokeLinecap="round" fill="none" />
            </svg>
          </div>
        ))}
        <div style={{ position: "absolute", left: 0, width: 820, top: 735, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.banana, opacity: both, transform: `scale(${0.85 + 0.15 * both})` }}>
          each row reads the same both ways
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 795, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.paper, opacity: ramp(t, 5.5, 5.75), letterSpacing: 4 }}>
          H-E-H · L-U-L · I-H-I
        </div>
      </div>
    </Scene>
  );
};

/** diagram on the stage with camera */
const Diagram: React.FC<{ t: number; s: number; X0: number; Y0: number; id: string; lit: Partial<Record<R, number>>; hot: R | null; extra?: Partial<React.ComponentProps<typeof Abdomen>> }> = ({ t, s, X0, Y0, id, lit, hot, extra }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 860, height: 940, overflow: "hidden", borderRadius: 40 }}>
    <div style={{ position: "absolute", left: X0, top: Y0 }}>
      <Abdomen t={t} id={id} w={800 * s} lit={lit} hot={hot} {...extra} />
    </div>
  </div>
);

/* 3. Top row */
export const V3: React.FC = () => {
  const t = useT();
  const [, s, X0, Y0] = cam(t, [[6.25, 1.0, 30, 0], [6.6, 1.22, -58, 0], [9.45, 1.22, -58, 0]]);
  const hot = hotAt(t, ["RH", "EP", "LH"]);
  return (
    <Scene start={6.25} end={9.45} push={0.004}>
      <Diagram t={t} s={s} X0={X0} Y0={Y0} id="v3" lit={{ RH: NT.RH, EP: NT.EP, LH: NT.LH }} hot={hot} extra={{ grid: 1 }} />
      <div style={{ position: "absolute", left: 0, width: 860, top: 800, display: "flex", justifyContent: "center", gap: 14, ...pop(t, 6.35, 0.25) }}>
        <Pill size={40} bg={C.forest}>TOP ROW</Pill>
        {(["RH", "EP", "LH"] as R[]).map((r) => <div key={r} style={pop(t, NT[r] - 0.05, 0.2)}><RChip r={r} size={66} /></div>)}
      </div>
      <div style={{ position: "absolute", left: 24, top: 24, ...pop(t, 8.9, 0.25), transformOrigin: "0 0" }}>
        <Pill size={30} bg={C.banana} color={C.forest}>R = patient's right (your left)</Pill>
      </div>
    </Scene>
  );
};

/* 4. Middle + bottom rows, then all 9 */
export const V4: React.FC = () => {
  const t = useT();
  const [, s, X0, Y0] = cam(t, [[9.45, 1.22, -58, 0], [9.85, 1.22, -58, -260], [11.55, 1.22, -58, -260], [11.95, 1.22, -58, -206], [13.35, 1.22, -58, -206], [13.75, 1.0, 30, 0], [13.95, 1.0, 30, 0]]);
  const hot = t < 13.35 ? hotAt(t, ["RL", "UM", "LL", "RI", "HG", "LI"]) : null;
  const bottom = t >= 11.75;
  return (
    <Scene start={9.45} end={13.95} push={0.004}>
      <Diagram t={t} s={s} X0={X0} Y0={Y0} id="v4" lit={{ RH: 0, EP: 0, LH: 0, RL: NT.RL, UM: NT.UM, LL: NT.LL, RI: NT.RI, HG: NT.HG, LI: NT.LI }} hot={hot} />
      {t < 13.35 && (
        <div style={{ position: "absolute", left: 0, width: 860, top: 820, display: "flex", justifyContent: "center", gap: 14, ...pop(t, bottom ? 11.75 : 9.5, 0.25) }}>
          <Pill size={40} bg={C.forest}>{bottom ? "BOTTOM ROW" : "MIDDLE ROW"}</Pill>
          {((bottom ? ["RI", "HG", "LI"] : ["RL", "UM", "LL"]) as R[]).map((r) => <div key={r} style={pop(t, NT[r] - 0.05, 0.2)}><RChip r={r} size={66} /></div>)}
        </div>
      )}
      <Stamp t0={13.45} text="ALL 9" size={56} rot={-7} color={C.red} style={{ left: 16, top: 6, whiteSpace: "nowrap" }} />
    </Scene>
  );
};

/* 5. Quick test */
export const V5: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[17.1, 3], [17.73, 2], [18.38, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => {
    if (t >= s - 0.05 && t < 19.0) { n = v; n0 = s; }
  });
  const opts = ["right hypochondriac", "epigastric", "left hypochondriac"];
  return (
    <Scene start={13.95} end={19.0}>
      <div style={{ position: "absolute", left: 20, top: 55, width: 820, height: 830, borderRadius: 48, background: C.forest, ...pop(t, 14.0, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 56, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 130, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 58, lineHeight: 1.12, color: C.paper, ...pop(t, 14.9) }}>
          Most of your <span style={{ color: "#E8796B" }}>LIVER</span> sits in which region?
        </div>
        {/* tiny liver icon */}
        <div style={{ position: "absolute", left: 0, width: 820, top: 300, display: "flex", justifyContent: "center", ...pop(t, 15.4, 0.25) }}>
          <svg width={200} height={110} viewBox="90 100 490 290">
            <path d="M 104 150 C 180 100, 400 112, 568 176 C 530 232, 440 282, 350 318 C 270 350, 190 376, 128 372 C 100 320, 96 220, 104 150 Z" fill="#B85A43" stroke={C.paper} strokeWidth={10} />
            <ellipse cx={262} cy={352} rx={22} ry={34} transform="rotate(-20 262 352)" fill="#6E9A45" stroke={C.paper} strokeWidth={6} />
          </svg>
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 445, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          {opts.map((o, i) => (
            <div key={o} style={{ ...pop(t, 15.7 + i * 0.2), display: "flex", alignItems: "center", gap: 18, width: 600 }}>
              <div style={{ width: 62, height: 62, flex: "0 0 62px", borderRadius: 18, background: C.banana, color: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, border: `4px solid ${C.paper}` }}>{"ABC"[i]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper, whiteSpace: "nowrap" }}>{o}</div>
            </div>
          ))}
        </div>
        {n !== null && (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 665, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 150, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/** right hypochondriac cell on the plate (same camera maths as PlateBox: x 150, y 90, 560x720) */
const CellHi: React.FC<{ t: number }> = ({ t }) => {
  const k = ramp(t, 19.0, 21.4);
  const from = [0.5, 0.5, 1.0], to = [0.45, 0.5, 0.95];
  const cx = from[0] + (to[0] - from[0]) * k, cy = from[1] + (to[1] - from[1]) * k, zw = from[2] + (to[2] - from[2]) * k;
  const w = 560, h = 720, iw = w / zw, ih = iw / A1223;
  const L = w / 2 - cx * iw, T = h / 2 - cy * ih;
  const x0 = Math.max(0, L + 0.0 * iw), x1 = L + 0.29 * iw, y0 = Math.max(0, T + 0.12 * ih), y1 = T + 0.405 * ih;
  const p = ramp(t, 19.2, 19.45);
  return (
    <div style={{ position: "absolute", left: 150, top: 90, width: w, height: h, overflow: "hidden", borderRadius: 40, pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: x0, top: y0, width: x1 - x0, height: y1 - y0, background: "rgba(242,209,78,0.38)", border: `7px solid ${C.forest}`, borderRadius: 16, opacity: p }} />
      <div style={{ position: "absolute", left: x0 + 10, top: y0 + 12, opacity: p, transform: `scale(${0.8 + 0.2 * p})`, transformOrigin: "0 0" }}>
        <Pill size={26} bg={C.banana} color={C.forest}>R. hypochondriac</Pill>
      </div>
    </div>
  );
};

/* 6a. Answer on Gray's plate: right hypochondriac + 1918 name note + HYPO */
export const V6: React.FC = () => {
  const t = useT();
  return (
    <Scene start={19.0} end={21.4} push={0.01}>
      <div style={{ position: "absolute", left: 0, width: 860, top: 0, display: "flex", justifyContent: "center", ...pop(t, 19.05, 0.25) }}>
        <Pill size={42} bg={C.matcha}>A ✓ right hypochondriac</Pill>
      </div>
      <PlateBox src="plates/abd1223.png" aspect={A1223} x={150} y={90} w={560} h={720} a={19.0} b={21.4} from={[0.5, 0.5, 1.0]} to={[0.45, 0.5, 0.95]}
        labels={[
          { x: 0.36, y: 0.33, text: "liver", t: 19.65, ox: 90, oy: 80 },
          { x: 0.5, y: 0.825, text: "sigmoid colon", t: 20.0, ox: -20, oy: -90 },
        ]} />
      <CellHi t={t} />
      <div style={{ position: "absolute", left: 4, top: 828, opacity: ramp(t, 20.0, 20.25), transform: `scale(${0.8 + 0.2 * ramp(t, 20.0, 20.25)})`, transformOrigin: "0 0" }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 16px 10px", fontFamily: FONT, fontWeight: 800, fontSize: 25, color: C.forest, lineHeight: 1.2, boxShadow: "0 6px 0 rgba(31,42,20,0.08)" }}>
          <span style={{ color: C.matcha }}>1918 atlas name:</span>
          <br />“pelvic colon” = sigmoid colon
        </div>
      </div>
      <div style={{ position: "absolute", right: 4, top: 830, ...pop(t, 20.46, 0.25), transformOrigin: "100% 0" }}>
        <Pill size={44} bg={C.banana} color={C.forest}>HYPO = below</Pill>
      </div>
    </Scene>
  );
};

/* 6b. Own diagram: costal cartilages (chondro) → liver under the right ribs */
export const V6b: React.FC = () => {
  const t = useT();
  const [, s, X0, Y0] = cam(t, [[21.4, 1.25, -70, 0], [21.9, 1.62, 0, 0], [23.2, 1.62, 0, 0], [23.6, 1.62, 0, -40], [25.0, 1.62, 0, -40]]);
  const cart = ramp(t, 21.5, 21.8) * (1 - 0.6 * ramp(t, 23.2, 23.5));
  const liver = ramp(t, 23.35, 23.6);
  const ribs = ramp(t, 24.05, 24.3);
  const k = 800 * s / 800;
  const P = (x: number, y: number): [number, number] => [X0 + x * k, Y0 + y * k];
  const call = (x: number, y: number, tx: number, ty: number, t0: number, text: string, bg: string, fg: string) => {
    const p = ramp(t, t0, t0 + 0.3);
    if (p <= 0) return null;
    const [ax, ay] = P(x, y);
    return (
      <>
        <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: p }}>
          <line x1={ax} y1={ay} x2={ax + (tx - ax) * p} y2={ay + (ty - ay) * p} stroke={C.paper} strokeWidth={11} strokeLinecap="round" />
          <line x1={ax} y1={ay} x2={ax + (tx - ax) * p} y2={ay + (ty - ay) * p} stroke={C.forest} strokeWidth={5} strokeLinecap="round" />
          <circle cx={ax} cy={ay} r={12} fill={C.banana} stroke={C.forest} strokeWidth={4} />
        </svg>
        <div style={{ position: "absolute", left: tx, top: ty, transform: `translate(-50%, -50%) scale(${0.8 + 0.2 * p})`, opacity: p }}>
          <Pill size={36} bg={bg} color={fg}>{text}</Pill>
        </div>
      </>
    );
  };
  return (
    <Scene start={21.4} end={25.0} push={0.004}>
      <Diagram t={t} s={s} X0={X0} Y0={Y0} id="v6b" lit={{ RH: 0 }} hot="RH" extra={{ letters: 0, names: 0, cart, liver, ribs, sides: 0 }} />
      {call(330, 250, 560, 620, 21.6, "costal cartilages", "#3E7C93", C.paper)}
      {call(190, 300, 250, 610, 23.4, "liver", "#8F3A2A", C.paper)}
      {call(160, 190, 610, 140, 24.1, "right ribs", C.forest, C.paper)}
      <div style={{ position: "absolute", left: 0, width: 860, top: 30, display: "flex", justifyContent: "center", ...pop(t, 21.5, 0.25) }}>
        <Pill size={44} bg={C.banana} color={C.forest}>CHONDRO = cartilage</Pill>
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 850, display: "flex", justifyContent: "center", ...pop(t, 22.35, 0.25) }}>
        <Pill size={36} bg={C.forest}>hypo·chondriac = below the rib cartilage</Pill>
      </div>
    </Scene>
  );
};

/* 7. Save + cheat sheet */
export const V7: React.FC = () => {
  const t = useT();
  const b = ramp(t, 25.05, 25.4);
  const all: Partial<Record<R, number>> = {};
  ORDER.forEach((r, i) => (all[r] = 25.3 + i * 0.06));
  return (
    <Scene start={25.0} end={27.2}>
      <div style={{ position: "absolute", left: 40, top: 0, ...pop(t, 25.05) }}>
        <svg width={110} height={140} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 170, top: 6, ...pop(t, 25.1) }}>
        <Big size={100}>SAVE THIS</Big>
      </div>
      <div style={{ position: "absolute", left: 172, top: 112, ...pop(t, 25.35) }}>
        <Big size={40} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ position: "absolute", left: 107, top: 180, ...pop(t, 25.2, 0.3) }}>
        <Abdomen t={t} id="v7" w={646} lit={all} letters={0} full organs={0.75} />
      </div>
    </Scene>
  );
};

/* 8. End card (≤ 1.5 s) */
export const V8: React.FC = () => {
  const t = useT();
  return (
    <Scene start={27.2} end={28.6}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, 27.22, 0.3) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.banana, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 27.35, 27.6) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 27.2) * 5))})`, opacity: ramp(t, 27.25, 27.45) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};

export const FULLN = FULL;
