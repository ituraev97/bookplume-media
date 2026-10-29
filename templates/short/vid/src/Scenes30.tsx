import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { Scapula, Joint, MId } from "./Shoulder30";

const ASPECT = 1232 / 964;
const pop = (t: number, t0: number, d = 0.3) => {
  const p = ramp(t, t0, t0 + d);
  return { opacity: p, transform: `scale(${0.6 + 0.4 * p + 0.08 * Math.sin(Math.min(1, p) * Math.PI)})` } as React.CSSProperties;
};
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });
const Big: React.FC<{ size?: number; children: React.ReactNode; color?: string }> = ({ size = 110, children, color = C.forest }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1, letterSpacing: -2, textAlign: "center" }}>{children}</div>
);
export const liveAlpha = (_t: number) => 0;

/* 1. Hook: Gray's 1918 plate, push in on the shoulder */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={2.5} push={0.02}>
      <div style={center(70, pop(t, 0, 0.25))}>
        <Big size={78}>
          <span style={{ color: C.matcha }}>4</span> ROTATOR CUFF
          <br />
          MUSCLES?
        </Big>
      </div>
      <Plate src="plates/cuff.png" aspect={ASPECT} x={40} y={280} w={780} a={-0.6} b={2.5} zoomFrom={[1, 0.5, 0.5]} zoomTo={[1.7, 0.3, 0.3]} />
      <Stamp t0={1.68} text="CAN YOU?" size={58} rot={-8} color={C.red} style={{ left: 470, top: 830 }} />
    </Scene>
  );
};

/* 2. Mnemonic card: one word */
export const V2: React.FC = () => {
  const t = useT();
  const L = ["S", "I", "T", "S"];
  return (
    <Scene start={2.5} end={4.3}>
      <div style={{ position: "absolute", left: 10, top: 80, width: 840, height: 820, borderRadius: 48, background: C.forest, ...pop(t, 2.55, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 80, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, letterSpacing: 6, color: C.matchaLight, ...pop(t, 2.6) }}>REMEMBER ONE WORD</div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 230, display: "flex", justifyContent: "center", gap: 22 }}>
          {L.map((l, i) => {
            const p = ramp(t, 3.3 + i * 0.09, 3.5 + i * 0.09);
            return (
              <div key={i} style={{ width: 160, height: 220, borderRadius: 30, background: i % 2 ? C.matcha : C.banana, color: i % 2 ? C.paper : C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 170, display: "flex", alignItems: "center", justifyContent: "center", opacity: p, transform: `translateY(${(1 - p) * 60}px) rotate(${(1 - p) * (i % 2 ? 8 : -8)}deg)` }}>
                {l}
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 540, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper, lineHeight: 1.25, opacity: ramp(t, 3.7, 3.95) }}>
          4 letters = <span style={{ color: C.banana }}>4 muscles</span>
          <br />
          <span style={{ fontSize: 34, color: C.matchaLight }}>around the shoulder joint</span>
        </div>
      </div>
    </Scene>
  );
};

/* 3. Ball and socket wrapped by the cuff */
export const V3: React.FC = () => {
  const t = useT();
  return (
    <Scene start={4.3} end={8.2}>
      <div style={{ position: "absolute", left: 30, top: 170 }}>
        <Joint t={t} w={800} cuffT={4.73} ballT={5.68} socketT={7.5} />
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 70, display: "flex", justifyContent: "center", ...pop(t, 4.75) }}>
        <Pill size={40} bg={C.matcha}>4 muscles = 1 cuff</Pill>
      </div>
      <div style={{ position: "absolute", left: 20, top: 720, ...pop(t, 5.7) }}>
        <Pill size={40} bg={C.forest}>BALL · head of humerus</Pill>
      </div>
      <div style={{ position: "absolute", left: 470, top: 820, ...pop(t, 7.55) }}>
        <Pill size={40} bg={C.banana} color={C.forest}>SOCKET · glenoid</Pill>
      </div>
    </Scene>
  );
};

/* 4. SITS one by one on our own scapula diagram; flip to the front for subscapularis */
const NAMES: { id: MId; name: string; tl: number; tn: number; where: string; bg: string }[] = [
  { id: "sup", name: "Supraspinatus", tl: 8.38, tn: 8.67, where: "above the spine", bg: C.red },
  { id: "inf", name: "Infraspinatus", tl: 11.68, tn: 11.92, where: "below the spine", bg: C.matcha },
  { id: "tmin", name: "Teres minor", tl: 13.95, tn: 14.26, where: "outer (lateral) edge", bg: C.red },
  { id: "sub", name: "Subscapularis", tl: 16.59, tn: 16.99, where: "front of the blade", bg: C.matcha },
];
export const V4: React.FC = () => {
  const t = useT();
  const lit: Partial<Record<MId, number>> = {};
  NAMES.forEach((n) => (lit[n.id] = n.tn));
  const front = t >= 16.6;
  const viewSwap = ramp(t, 16.6, 16.9);
  return (
    <Scene start={8.2} end={20.0} push={0.01}>
      {/* SITS chips 2x2 */}
      <div style={{ position: "absolute", left: 0, top: 60, width: 860, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {NAMES.map((n) => {
          const p = ramp(t, n.tl - 0.05, n.tl + 0.2);
          const now = t >= n.tn && t < n.tn + 0.8;
          return (
            <div key={n.id} style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ opacity: 0.3 + 0.7 * p, transform: `scale(${now ? 1.06 : 1})`, background: p > 0.5 ? n.bg : C.line, color: p > 0.5 ? C.paper : C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 38, padding: "10px 22px 13px", borderRadius: 18, whiteSpace: "nowrap", boxShadow: "0 6px 0 rgba(31,42,20,0.15)" }}>
                <span style={{ fontSize: 50, color: p > 0.5 ? C.banana : C.forest }}>{n.name[0]}</span>
                {n.name.slice(1)}
              </div>
            </div>
          );
        })}
      </div>
      {/* the diagram */}
      <div style={{ position: "absolute", left: 90, top: 230 }}>
        <Scapula t={t} w={700} lit={lit} spineGlow={10.0} edgeGlow={15.5} flip={[16.35, 16.85]} showTmaj={false} />
      </div>
      {/* view tag */}
      <div style={{ position: "absolute", left: 20, top: 890, opacity: front ? viewSwap : ramp(t, 8.4, 8.7) * (1 - ramp(t, 16.35, 16.55)) }}>
        <Pill size={30} bg={C.forest}>{front ? "FRONT VIEW" : "BACK VIEW"}</Pill>
      </div>
      {/* where tags */}
      {[
        { t0: 10.06, t1: 11.5, x: 480, y: 400, text: "SPINE of the scapula", bg: C.banana, col: C.forest },
        { t0: 9.8, t1: 11.5, x: 470, y: 250, text: "↑ above = SUPRA", bg: C.red, col: C.paper },
        { t0: 12.71, t1: 13.8, x: 520, y: 600, text: "↓ below = INFRA", bg: C.matcha, col: C.paper },
        { t0: 15.55, t1: 16.3, x: 140, y: 760, text: "outer (lateral) edge", bg: C.banana, col: C.forest },
        { t0: 18.52, t1: 20.2, x: 300, y: 880, text: "on the FRONT · faces the ribs", bg: C.forest, col: C.paper },
      ].map((g, i) => {
        const p = ramp(t, g.t0, g.t0 + 0.25) * (1 - ramp(t, g.t1, g.t1 + 0.25));
        if (p <= 0) return null;
        return (
          <div key={i} style={{ position: "absolute", left: g.x, top: g.y, opacity: p, transform: `scale(${0.8 + 0.2 * p})` }}>
            <Pill size={32} bg={g.bg} color={g.col}>{g.text}</Pill>
          </div>
        );
      })}
    </Scene>
  );
};

/* 5. Back on the 1918 plate: three tendons to the greater tubercle (modern labels) */
export const V5: React.FC = () => {
  const t = useT();
  return (
    <Scene start={20.0} end={23.25} push={0.01}>
      <div style={center(70, pop(t, 20.1))}>
        <Pill size={38} bg={C.forest}>
          S · I · T <span style={{ color: C.banana }}>→ GREATER tubercle</span>
        </Pill>
      </div>
      <Plate
        src="plates/cuff.png" aspect={ASPECT} x={20} y={170} w={820} a={20.0} b={23.25}
        zoomFrom={[1.05, 0.5, 0.4]} zoomTo={[1.18, 0.45, 0.35]}
        labels={[
          { x: 0.9, y: 0.12, text: "Supraspinatus", t: 20.15, side: "l" },
          { x: 0.78, y: 0.6, text: "Infraspinatus", t: 20.5, side: "l" },
          { x: 0.48, y: 0.44, text: "Teres minor", t: 20.9, side: "r" },
          { x: 0.2, y: 0.24, text: "Greater tubercle", t: 21.5, side: "r", hot: true },
        ]}
      />
      <div style={{ position: "absolute", left: 60, width: 740, top: 850, display: "flex", justifyContent: "center", ...pop(t, 22.1) }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 20px 11px", fontFamily: FONT, fontWeight: 800, fontSize: 27, color: C.forest, whiteSpace: "nowrap" }}>
          <span style={{ color: C.matcha }}>1918 atlas spelling:</span> Supra-spinatus · Deltoideus
        </div>
      </div>
    </Scene>
  );
};

/* 6. Where they attach: 3 + 1 */
export const V6: React.FC = () => {
  const t = useT();
  const tile = (l: string, bg: string, t0: number) => (
    <div style={{ width: 96, height: 112, borderRadius: 20, background: bg, color: bg === C.banana ? C.forest : C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 72, display: "flex", alignItems: "center", justifyContent: "center", ...pop(t, t0) }}>{l}</div>
  );
  return (
    <Scene start={23.25} end={25.95}>
      <div style={{ position: "absolute", left: 10, top: 80, width: 840, height: 840, borderRadius: 48, background: C.card, border: `4px solid ${C.line}`, boxShadow: "0 18px 40px rgba(31,42,20,0.12)", ...pop(t, 23.28, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 50, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 5, color: C.matcha }}>WHERE THEY ATTACH</div>
        <div style={{ position: "absolute", left: 50, top: 150, display: "flex", gap: 14, alignItems: "center" }}>
          {tile("S", C.red, 23.35)}
          {tile("I", C.matcha, 23.45)}
          {tile("T", C.red, 23.55)}
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 60, color: C.forest, margin: "0 6px", ...pop(t, 23.7) }}>→</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.forest, lineHeight: 1.05, ...pop(t, 23.8) }}>
            GREATER
            <br />
            <span style={{ fontSize: 34, color: C.matcha }}>tubercle</span>
          </div>
        </div>
        <div style={{ position: "absolute", left: 50, top: 330, display: "flex", gap: 14, alignItems: "center" }}>
          {tile("S", C.banana, 23.4)}
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 60, color: C.forest, margin: "0 6px", ...pop(t, 24.6) }}>→</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.red, lineHeight: 1.05, ...pop(t, 24.87) }}>
            LESSER
            <br />
            <span style={{ fontSize: 34, color: C.matcha }}>tubercle</span>
          </div>
        </div>
        {/* mini humerus head, front view */}
        <svg width={420} height={330} viewBox="0 0 420 330" style={{ position: "absolute", left: 210, top: 500, opacity: ramp(t, 23.9, 24.2) }}>
          <path d="M 120 330 L 140 190 Q 70 170 72 110 Q 80 40 160 30 Q 250 24 300 70 Q 336 104 320 150 Q 300 186 270 196 L 250 330 Z" fill="#F3EBD3" stroke={C.forest} strokeWidth={5} strokeLinejoin="round" />
          <ellipse cx={140} cy={92} rx={70} ry={58} fill="#FFFDF4" opacity={0.7} />
          <circle cx={292} cy={118} r={34} fill={ramp(t, 23.8, 24.0) > 0.5 ? C.red : "#E6DAB8"} stroke={C.forest} strokeWidth={4} />
          <circle cx={226} cy={160} r={22} fill={ramp(t, 24.87, 25.1) > 0.5 ? C.banana : "#E6DAB8"} stroke={C.forest} strokeWidth={4} />
          <path d="M 258 150 Q 262 200 254 250" stroke={C.forest} strokeWidth={3} fill="none" opacity={0.35} strokeDasharray="6 6" />
          <text x={350} y={66} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={C.forest}>greater</text>
          <text x={196} y={176} textAnchor="end" fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.forest} opacity={ramp(t, 24.87, 25.1)}>lesser</text>
        </svg>
      </div>
    </Scene>
  );
};

/* 7. The trap: teres major is NOT part of the cuff (plate, modern label) */
export const V7: React.FC = () => {
  const t = useT();
  return (
    <Scene start={25.95} end={28.9} push={0.01}>
      <div style={center(70, pop(t, 26.0))}>
        <Pill size={40} bg={C.red}>CAREFUL</Pill>
      </div>
      <Plate
        src="plates/cuff.png" aspect={ASPECT} x={20} y={170} w={820} a={25.95} b={28.9}
        zoomFrom={[1.25, 0.55, 0.6]} zoomTo={[1.55, 0.62, 0.72]}
        labels={[
          { x: 0.47, y: 0.43, text: "Teres minor ✓ cuff", t: 26.3, side: "r" },
          { x: 0.66, y: 0.8, text: "Teres major", t: 26.65, side: "l", hot: true },
        ]}
      />
      <Stamp t0={27.6} text="NOT IN THE CUFF" size={52} rot={-7} color={C.red} style={{ left: 200, top: 850 }} />
    </Scene>
  );
};

/* 8. Quick test with 3-2-1 */
export const V8: React.FC = () => {
  const t = useT();
  const T0 = 32.2;
  const n = t < T0 ? null : t < T0 + 0.5 ? 3 : t < T0 + 1.0 ? 2 : t < T0 + 1.5 ? 1 : null;
  const k = Math.floor((t - T0) / 0.5) * 0.5 + T0;
  return (
    <Scene start={28.9} end={33.7}>
      <div style={{ position: "absolute", left: 10, top: 80, width: 840, height: 840, borderRadius: 48, background: C.forest, ...pop(t, 28.95, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 66, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 40, width: 760, top: 150, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 66, lineHeight: 1.08, color: C.paper, ...pop(t, 29.9) }}>
          Which one <span style={{ color: C.banana }}>starts lifting</span> your arm out to the side?
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 450, display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", padding: "0 50px", boxSizing: "border-box" }}>
          {["Supraspinatus", "Infraspinatus", "Teres minor", "Subscapularis"].map((x, i) => (
            <div key={x} style={{ ...pop(t, 30.9 + i * 0.12), background: C.matchaDark, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 38, padding: "12px 22px 15px", borderRadius: 18 }}>{x}</div>
          ))}
        </div>
        {n && (
          <div style={{ position: "absolute", left: 0, width: 840, top: 640, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 130, color: C.banana, lineHeight: 1, transform: `scale(${1.3 - 0.3 * ramp(t, k, k + 0.15)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 9. Answer: supraspinatus */
export const V9: React.FC = () => {
  const t = useT();
  return (
    <Scene start={33.7} end={37.8} push={0.01}>
      <div style={{ position: "absolute", left: 0, top: 170 }}>
        <Scapula t={t} w={500} lit={{ sup: 33.86 }} showTmaj={false} dim={0.55} />
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 70, display: "flex", justifyContent: "center", ...pop(t, 33.9) }}>
        <Pill size={44} bg={C.red}>SUPRASPINATUS</Pill>
      </div>
      <div style={{ position: "absolute", left: 520, top: 300, width: 330, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.forest, lineHeight: 1.2, opacity: ramp(t, 34.3, 34.6) }}>
        the only cuff muscle that doesn't rotate the arm
      </div>
      <div style={{ position: "absolute", left: 30, width: 800, top: 680, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ ...pop(t, 35.44), transformOrigin: "left center", display: "flex", alignItems: "center", gap: 18, background: C.card, border: `4px solid ${C.line}`, borderRadius: 26, padding: "16px 24px" }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 38, display: "flex", alignItems: "center", justifyContent: "center" }}>1</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest, lineHeight: 1.1 }}>
            starts <span style={{ color: C.red }}>abduction</span>
            <span style={{ fontSize: 28, color: C.matcha }}> · first ~15°</span>
          </div>
        </div>
        <div style={{ ...pop(t, 36.32), transformOrigin: "left center", display: "flex", alignItems: "center", gap: 18, background: C.card, border: `4px solid ${C.line}`, borderRadius: 26, padding: "16px 24px" }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, background: C.matcha, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 38, display: "flex", alignItems: "center", justifyContent: "center" }}>2</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest, lineHeight: 1.1 }}>
            then the <span style={{ color: C.matcha }}>deltoid</span> takes over
          </div>
        </div>
      </div>
    </Scene>
  );
};

/* 10. Save */
export const V10: React.FC = () => {
  const t = useT();
  const b = ramp(t, 37.9, 38.25);
  return (
    <Scene start={37.8} end={39.95}>
      <div style={center(40, pop(t, 37.85))}>
        <svg width={220} height={280} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={center(360, pop(t, 38.0))}>
        <Big size={120}>SAVE THIS</Big>
      </div>
      <div style={center(510, pop(t, 38.85))}>
        <Big size={58} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 650, display: "flex", justifyContent: "center", gap: 14, ...pop(t, 39.2) }}>
        {"SITS".split("").map((l, i) => (
          <div key={i} style={{ width: 90, height: 104, borderRadius: 18, background: i % 2 ? C.matcha : C.red, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 64, display: "flex", alignItems: "center", justifyContent: "center" }}>{l}</div>
        ))}
      </div>
    </Scene>
  );
};

/* 11. End card */
export const V11: React.FC = () => {
  const t = useT();
  const s = 39.95;
  return (
    <Scene start={s} end={44.4}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, s + 0.05, 0.35) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.banana, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 41.15, 41.45) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - s) * 5))})`, opacity: ramp(t, 40.17, 40.47) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
