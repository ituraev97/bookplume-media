import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { Foot, TarsId } from "./Foot32";

const A_FOOT = 1706 / 3199;
const A_MID = 1160 / 1216;
const A_MED = 1887 / 751;
const pop = (t: number, t0: number, d = 0.3) => {
  const p = ramp(t, t0, t0 + d);
  return { opacity: p, transform: `scale(${0.6 + 0.4 * p + 0.08 * Math.sin(Math.min(1, p) * Math.PI)})` } as React.CSSProperties;
};
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });
const Big: React.FC<{ size?: number; children: React.ReactNode; color?: string }> = ({ size = 110, children, color = C.forest }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1, letterSpacing: -2, textAlign: "center" }}>{children}</div>
);
export const liveAlpha = (_t: number) => 0;

const GROUP: Record<TarsId, string> = { T: C.red, Ca: C.red, N: C.bananaDark, MC: C.matcha, IC: C.matcha, LC: C.matcha, Cb: C.matcha };
const ORDER: [TarsId, string][] = [["T", "T"], ["Ca", "C"], ["N", "N"], ["MC", "M"], ["IC", "I"], ["LC", "L"], ["Cb", "C"]];

/* 1. Hook: the real 1918 plate, push in on the tarsus */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={4.0} push={0.02}>
      <div style={center(0, pop(t, 0, 0.25))}>
        <Big size={92}>
          <span style={{ color: C.matcha }}>7</span> TARSAL BONES?
        </Big>
      </div>
      <Plate src="plates/foot.png" aspect={A_FOOT} x={215} y={118} w={430} a={-0.6} b={4.0} zoomFrom={[1, 0.5, 0.42]} zoomTo={[2.1, 0.47, 0.3]} />
      <Stamp t0={2.6} text="THE TRICK" size={62} rot={-8} color={C.red} style={{ left: 520, top: 660 }} />
    </Scene>
  );
};

/* 2. Seven bones: ankle + back half of the foot */
export const V2: React.FC = () => {
  const t = useT();
  const dim = ramp(t, 6.58, 7.0);
  return (
    <Scene start={4.0} end={7.75}>
      <div style={{ position: "absolute", left: -25, top: 0, transform: `translateY(${(1 - ramp(t, 4.0, 4.4)) * 40}px)` }}>
        <Foot t={t} w={640} region={4.5} dimFore={dim} letters={false} lit={{}} />
      </div>
      <div style={{ position: "absolute", left: 540, top: 200, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 26 }}>
        <div style={pop(t, 4.18)}><Pill size={44} bg={C.forest}>7 bones</Pill></div>
        <div style={pop(t, 5.74)}><Pill size={44} bg={C.matcha}>ankle</Pill></div>
        <div style={pop(t, 6.84)}><Pill size={40} bg={C.banana} color={C.forest}>back half</Pill></div>
      </div>
      <div style={{ position: "absolute", left: 540, top: 550, width: 300, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.forest, lineHeight: 1.2, opacity: ramp(t, 6.9, 7.2) }}>
        of your foot
        <div style={{ fontSize: 24, color: C.matcha, marginTop: 10 }}>right foot · seen from above</div>
      </div>
    </Scene>
  );
};

/* 3. The sentence */
const WORDS3: [string, number][] = [["Tiger", 8.79], ["Cub", 9.1], ["Needs", 9.35], ["MILC", 9.65]];
export const V3: React.FC = () => {
  const t = useT();
  const word = (w: string, wt: number) => {
    const p = ramp(t, wt - 0.05, wt + 0.18);
    const all = w === "MILC";
    return (
      <div key={w} style={{ opacity: p, transform: `translateY(${(1 - p) * 30}px) scale(${0.8 + 0.2 * p})`, fontFamily: FONT, fontWeight: 800, fontSize: 92, letterSpacing: -2, color: C.paper, lineHeight: 1 }}>
        {all ? <span style={{ color: C.banana, fontSize: 108 }}>{w}</span> : <><span style={{ color: C.banana, fontSize: 112 }}>{w[0]}</span>{w.slice(1)}</>}
      </div>
    );
  };
  return (
    <Scene start={7.75} end={10.4}>
      <div style={{ position: "absolute", left: 10, top: 40, width: 840, height: 820, borderRadius: 48, background: C.forest, ...pop(t, 7.8, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 60, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 6, color: C.matchaLight }}>REMEMBER THIS</div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 170, display: "flex", justifyContent: "center", gap: 30 }}>{WORDS3.slice(0, 2).map(([w, wt]) => word(w, wt))}</div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 330, display: "flex", justifyContent: "center", gap: 30 }}>{WORDS3.slice(2).map(([w, wt]) => word(w, wt))}</div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 540, display: "flex", justifyContent: "center", gap: 12 }}>
          {ORDER.map(([id, l], i) => (
            <div key={i} style={{ ...pop(t, 9.85 + i * 0.07, 0.25), width: 86, height: 100, borderRadius: 18, background: GROUP[id], color: id === "N" ? C.forest : C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>{l}</div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 680, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.matchaLight, opacity: ramp(t, 10.0, 10.3) }}>heel → toes · inside → outside</div>
      </div>
    </Scene>
  );
};

/* 4. Name them one by one on our diagram (camera moves to each bone) */
type Step = { id: TarsId; t: number; name: string; note: string };
const STEPS: Step[] = [
  { id: "T", t: 11.07, name: "Talus", note: "top bone · under the shin" },
  { id: "Ca", t: 14.12, name: "Calcaneus", note: "the heel bone" },
  { id: "N", t: 16.96, name: "Navicular", note: "in front of the talus" },
  { id: "MC", t: 19.56, name: "Medial cuneiform", note: "big-toe side" },
  { id: "IC", t: 19.84, name: "Intermediate cuneiform", note: "the middle wedge" },
  { id: "LC", t: 20.15, name: "Lateral cuneiform", note: "next to the cuboid" },
  { id: "Cb", t: 24.56, name: "Cuboid", note: "outer side of the foot" },
];
const CAM: [number, number, number, number][] = [
  // time, scale, focusX, focusY (diagram units)
  [10.4, 1.0, 390, 480],
  [10.9, 1.45, 320, 610],
  [13.5, 1.45, 320, 610],
  [14.0, 1.35, 470, 740],
  [16.2, 1.35, 470, 740],
  [16.7, 1.6, 300, 480],
  [19.3, 1.6, 300, 480],
  [19.6, 1.6, 300, 400],
  [23.4, 1.6, 300, 400],
  [23.9, 1.55, 470, 440],
  [26.0, 1.55, 470, 440],
  [26.6, 1.0, 390, 480],
];
const cam = (t: number) => {
  let i = 0;
  while (i < CAM.length - 1 && t > CAM[i + 1][0]) i++;
  const a = CAM[i], b = CAM[Math.min(i + 1, CAM.length - 1)];
  const k = b[0] === a[0] ? 1 : ramp(t, a[0], b[0]);
  return [a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k, a[3] + (b[3] - a[3]) * k];
};
export const V4: React.FC = () => {
  const t = useT();
  const lit: Partial<Record<TarsId, number>> = {};
  STEPS.forEach((s) => (lit[s.id] = s.t));
  const W = 600, k = W / 700, H = 800;
  const [s, fx, fy] = cam(t);
  const px = (fx - 40) * k, py = (fy + 10) * k;
  const tx = W / 2 - px * s, ty = H / 2 - py * s;
  let cur = -1;
  STEPS.forEach((st, i) => { if (t >= st.t - 0.1) cur = i; });
  const showGroup = cur >= 3 && cur <= 5 && t < 23.5;
  const st = cur >= 0 ? STEPS[cur] : null;
  const cardKey = showGroup ? "cun" : st ? st.id : "none";
  const cardT = showGroup ? 19.56 : st ? st.t : 0;
  const cp = ramp(t, cardT - 0.1, cardT + 0.2);
  return (
    <Scene start={10.4} end={26.95} push={0.0}>
      <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 50%", transform: `scale(${1 / (1 + 0.1 * ramp(t, 10.4, 26.95))})` }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, borderRadius: 40, overflow: "hidden", background: C.card, boxShadow: `0 0 0 4px ${C.line}, 0 18px 40px rgba(31,42,20,0.12)`, ...pop(t, 10.45, 0.35) }}>
        <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(${tx}px, ${ty}px) scale(${s})` }}>
          <Foot t={t} w={W} lit={lit} />
        </div>
        <div style={{ position: "absolute", left: 18, top: 16, fontFamily: FONT, fontWeight: 800, fontSize: 22, color: C.matcha, background: "rgba(255,254,246,0.9)", padding: "4px 12px", borderRadius: 10 }}>RIGHT FOOT · TOP VIEW</div>
        <div style={{ position: "absolute", left: 18, bottom: 16, fontFamily: FONT, fontWeight: 800, fontSize: 22, color: C.forest, opacity: 0.6, background: "rgba(255,254,246,0.9)", padding: "4px 12px", borderRadius: 10 }}>↑ toes · heel ↓</div>
      </div>
      {/* letter column */}
      <div style={{ position: "absolute", left: 640, top: 0, width: 210, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        {ORDER.map(([id, l], i) => {
          const tt = lit[id]!;
          const p = ramp(t, tt - 0.05, tt + 0.2);
          const now = t >= tt - 0.05 && (i === ORDER.length - 1 || t < lit[ORDER[i + 1][0]]! - 0.05) && t < 26.6;
          return (
            <div key={i} style={{ width: now ? 112 : 96, height: 100, borderRadius: 20, background: p > 0.5 ? GROUP[id] : C.line, color: p > 0.5 ? (id === "N" ? C.forest : C.paper) : C.forest, opacity: 0.35 + 0.65 * p, fontFamily: FONT, fontWeight: 800, fontSize: 58, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: now ? `0 0 0 6px ${C.banana}` : "none" }}>{l}</div>
          );
        })}
      </div>
      {/* name card */}
      {cur >= 0 && (
        <div key={cardKey} style={{ position: "absolute", left: 0, top: 822, width: 860, display: "flex", justifyContent: "center", opacity: cp, transform: `translateY(${(1 - cp) * 24}px)` }}>
          <div style={{ background: C.forest, borderRadius: 26, padding: "14px 30px 18px", fontFamily: FONT, fontWeight: 800, display: "flex", alignItems: "baseline", gap: 18, whiteSpace: "nowrap" }}>
            {showGroup ? (
              <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                {([["Medial", 20.81], ["Intermediate", 21.37], ["Lateral", 22.16]] as [string, number][]).map(([n, tt], i) => {
                  const q = ramp(t, tt - 0.05, tt + 0.2);
                  return (
                    <span key={n} style={{ fontSize: 40, color: C.paper, opacity: 0.3 + 0.7 * q }}>
                      <span style={{ color: C.banana, fontSize: 50 }}>{n[0]}</span>{n.slice(1)}{i < 2 ? " ·" : ""}
                    </span>
                  );
                })}
                <span style={{ fontSize: 26, color: C.matchaLight, opacity: ramp(t, 22.5, 22.8) }}>cuneiforms</span>
              </div>
            ) : (
              <>
                <span style={{ fontSize: 52, color: C.banana }}>{st!.name}</span>
                <span style={{ fontSize: 28, color: C.matchaLight }}>{st!.note}</span>
              </>
            )}
          </div>
        </div>
      )}
      </div>
    </Scene>
  );
};

/* 5. Bonus: cuneiform = wedge — on the 1918 plate with modern labels */
export const V5: React.FC = () => {
  const t = useT();
  return (
    <Scene start={26.95} end={31.5} push={0.01}>
      <div style={center(18, pop(t, 27.05))}>
        <Pill size={40} bg={C.banana} color={C.forest}>BONUS TRICK</Pill>
      </div>
      <Plate
        src="plates/foot_mid.png" aspect={A_MID} x={110} y={110} w={640} a={26.95} b={31.5}
        zoomFrom={[1.02, 0.5, 0.5]} zoomTo={[1.18, 0.54, 0.58]}
        labels={[
          { x: 0.40, y: 0.60, text: "Lateral", t: 27.55, side: "l" },
          { x: 0.53, y: 0.53, text: "Intermediate", t: 27.8, side: "r" },
          { x: 0.69, y: 0.69, text: "Medial", t: 28.05, side: "r" },
        ]}
      />
      <div style={{ position: "absolute", left: 0, width: 860, top: 790, display: "flex", justifyContent: "center", alignItems: "center", gap: 20 }}>
        <div style={pop(t, 28.7)}><Pill size={38} bg={C.forest}>cuneiform = <span style={{ color: C.banana }}>wedge-shaped</span></Pill></div>
        <div style={{ display: "flex", gap: 8 }}>
          {[0, 1, 2].map((i) => (
            <svg key={i} width={44} height={52} viewBox="0 0 44 52" style={pop(t, 29.73 + i * 0.15, 0.22)}>
              <path d="M3 4 L41 4 L22 48 Z" fill={C.banana} stroke={C.forest} strokeWidth={4} strokeLinejoin="round" />
            </svg>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: 60, width: 740, top: 878, display: "flex", justifyContent: "center", ...pop(t, 30.1) }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 20px 11px", fontFamily: FONT, fontWeight: 800, fontSize: 27, color: C.forest, whiteSpace: "nowrap" }}>
          <span style={{ color: C.matcha }}>1918 atlas names:</span> first · second · third cuneiform
        </div>
      </div>
    </Scene>
  );
};

/* 6. Quick test */
export const V6: React.FC = () => {
  const t = useT();
  const c0 = 34.2;
  const n = t < c0 ? null : t < c0 + 0.5 ? 3 : t < c0 + 1.0 ? 2 : t < c0 + 1.45 ? 1 : null;
  const k = Math.floor((t - c0) / 0.5) * 0.5 + c0;
  return (
    <Scene start={31.5} end={35.65}>
      <div style={{ position: "absolute", left: 10, top: 40, width: 840, height: 820, borderRadius: 48, background: C.forest, ...pop(t, 31.55, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 70, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 40, width: 760, top: 165, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 80, lineHeight: 1.05, color: C.paper, ...pop(t, 32.35) }}>
          Which tarsal bone is the <span style={{ color: C.banana }}>largest?</span>
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 450, display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", padding: "0 60px", boxSizing: "border-box" }}>
          {["Talus", "Calcaneus", "Navicular", "Cuboid"].map((x, i) => (
            <div key={x} style={{ ...pop(t, 33.0 + i * 0.1), background: C.matchaDark, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 42, padding: "12px 26px 15px", borderRadius: 18 }}>{x}</div>
          ))}
        </div>
        {n && (
          <div style={{ position: "absolute", left: 0, width: 840, top: 640, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 120, color: C.banana, lineHeight: 1, transform: `scale(${1.3 - 0.3 * ramp(t, k, k + 0.15)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 7. Answer: calcaneus, on the 1918 medial view + our diagram */
export const V7: React.FC = () => {
  const t = useT();
  return (
    <Scene start={35.65} end={40.35} push={0.01}>
      <div style={center(26, pop(t, 35.8))}>
        <Pill size={44} bg={C.red}>CALCANEUS · the heel bone</Pill>
      </div>
      <Plate
        src="plates/footmed.png" aspect={A_MED} x={20} y={128} w={820} a={35.65} b={40.35}
        zoomFrom={[1.0, 0.4, 0.5]} zoomTo={[1.35, 0.2, 0.6]}
        labels={[
          { x: 0.22, y: 0.74, text: "Largest tarsal", t: 36.1, side: "r", hot: true },
          { x: 0.02, y: 0.56, text: "Achilles tendon attaches here", t: 38.13, side: "r" },
        ]}
      />
      <div style={{ position: "absolute", left: 20, top: 490, ...pop(t, 36.5) }}>
        <div style={{ position: "relative", width: 300, height: 420, borderRadius: 32, overflow: "hidden", background: C.card, boxShadow: `0 0 0 4px ${C.line}` }}>
          <div style={{ position: "absolute", left: -40, top: -150 }}>
            <Foot t={t} w={380} hot={{ Ca: 36.6 }} letters={false} dimFore={0.4} />
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 350, width: 490, top: 520, borderRadius: 32, background: C.card, border: `4px solid ${C.line}`, padding: "24px 30px", boxSizing: "border-box", fontFamily: FONT, ...pop(t, 37.0) }}>
        <div style={{ fontWeight: 800, fontSize: 28, letterSpacing: 4, color: C.matcha }}>SIZE RANK</div>
        <div style={{ fontWeight: 800, fontSize: 52, color: C.forest, lineHeight: 1.2, marginTop: 6 }}>
          <span style={{ color: C.red }}>#1</span> Calcaneus
        </div>
        <div style={{ fontWeight: 800, fontSize: 44, color: C.forest, opacity: 0.75, lineHeight: 1.2 }}>
          <span style={{ color: C.matcha }}>#2</span> Talus
        </div>
      </div>
      <div style={{ position: "absolute", left: 350, width: 490, top: 790, ...pop(t, 38.6) }}>
        <Pill size={34} bg={C.forest}>Achilles → back of heel</Pill>
      </div>
    </Scene>
  );
};

/* 8. Save */
export const V8: React.FC = () => {
  const t = useT();
  const b = ramp(t, 40.45, 40.8);
  return (
    <Scene start={40.35} end={42.6}>
      <div style={center(40, pop(t, 40.4))}>
        <svg width={220} height={280} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={center(360, pop(t, 40.55))}>
        <Big size={120}>SAVE THIS</Big>
      </div>
      <div style={center(510, pop(t, 41.3))}>
        <Big size={58} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 650, display: "flex", justifyContent: "center", gap: 10, ...pop(t, 41.7) }}>
        {ORDER.map(([id, l], i) => (
          <div key={i} style={{ width: 72, height: 84, borderRadius: 16, background: GROUP[id], color: id === "N" ? C.forest : C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 50, display: "flex", alignItems: "center", justifyContent: "center" }}>{l}</div>
        ))}
      </div>
    </Scene>
  );
};

/* 9. End card */
export const V9: React.FC = () => {
  const t = useT();
  return (
    <Scene start={42.6} end={46.8}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, 42.65, 0.35) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.banana, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 43.6, 43.9) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 42.6) * 5))})`, opacity: ramp(t, 42.85, 43.15) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
