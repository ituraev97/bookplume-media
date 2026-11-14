import React from "react";
import { C, Callout, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { Aorta, PartId } from "./Aorta36";

const ASPECT = 1375 / 2162;
const ASPECT_TOP = 1375 / 1081;
const pop = (t: number, t0: number, d = 0.3) => {
  const p = ramp(t, t0, t0 + d);
  return { opacity: p, transform: `scale(${0.6 + 0.4 * p + 0.08 * Math.sin(Math.min(1, p) * Math.PI)})` } as React.CSSProperties;
};
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });
const Big: React.FC<{ size?: number; children: React.ReactNode; color?: string }> = ({ size = 110, children, color = C.forest }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1, letterSpacing: -2, textAlign: "center" }}>{children}</div>
);
export const liveAlpha = (_t: number) => 0;

/* 1. Hook: the real 1918 plate, push in on the great vessels */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={4.5} push={0.02}>
      <div style={center(10, pop(t, 0, 0.25))}>
        <Big size={84}>
          NAME ALL <span style={{ background: C.banana, borderRadius: 18, padding: "0 16px 6px" }}>3?</span>
        </Big>
      </div>
      <Plate src="plates/aorta.png" aspect={ASPECT} x={175} y={120} w={510} a={-0.6} b={4.5} zoomFrom={[1, 0.5, 0.42]} zoomTo={[1.85, 0.5, 0.17]} />
      <div style={{ position: "absolute", left: 0, top: 330, ...pop(t, 1.54) }}>
        <Pill size={38} bg={C.forest}>AORTIC ARCH</Pill>
      </div>
      <div style={{ position: "absolute", left: 520, top: 520, ...pop(t, 0.7) }}>
        <Pill size={34} bg={C.banana} color={C.forest}>3 BRANCHES</Pill>
      </div>
      <Stamp t0={3.16} text="THE TRICK" size={62} rot={-8} color={C.red} style={{ left: 450, top: 740 }} />
    </Scene>
  );
};

/* 2. What the arch is: aorta grows out of the heart, curves back + left, 3 branches rise */
export const V2: React.FC = () => {
  const t = useT();
  const nums: [PartId, number, number, number][] = [["BT", 10.95, 300, 175], ["LCC", 11.2, 520, 30], ["LSA", 11.48, 700, 120]];
  return (
    <Scene start={4.5} end={12.8} push={0.015}>
      <div style={{ position: "absolute", left: 0, top: 20, transform: `translateY(${(1 - ramp(t, 4.5, 4.9)) * 40}px)` }}>
        <Aorta t={t} draw={4.85} grow={{ BT: 10.9, LCC: 11.15, LSA: 11.43 }} lit={{ AR: 8.6 }} focus={t < 10.4 ? "AR" : null} arrow={6.3} sides={7.26} />
      </div>
      <div style={{ position: "absolute", left: 40, top: 640, ...pop(t, 5.71), opacity: ramp(t, 5.71, 6.0) * (1 - ramp(t, 9.4, 9.7)) }}>
        <Pill size={30} bg={C.paper} color={C.forest} style={{ border: `4px solid ${C.forest}` }}>HEART</Pill>
      </div>
      <Callout t0={4.85} x={352} y={520} tx={150} ty={470} text="Aorta" />
      <div style={{ position: "absolute", left: 470, top: 380, ...pop(t, 8.71), opacity: ramp(t, 8.71, 9.0) * (1 - ramp(t, 10.3, 10.6)) }}>
        <Pill size={44} bg={C.banana} color={C.forest}>THE ARCH</Pill>
      </div>
      {nums.map(([id, tt, x, y], i) => (
        <div key={id} style={{ position: "absolute", left: x, top: y, ...pop(t, tt + 0.15) }}>
          <div style={{ width: 70, height: 70, borderRadius: 35, background: C.forest, color: C.banana, fontFamily: FONT, fontWeight: 800, fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 5px ${C.paper}` }}>{i + 1}</div>
        </div>
      ))}
    </Scene>
  );
};

/* 3. The mnemonic card: ABC'S */
const ROWS: [string, string, string][] = [["A", "rch", "the aortic arch itself"], ["B", "rachiocephalic trunk", "1st, on the right"], ["C", "ommon carotid (left)", "2nd, head + neck"], ["S", "ubclavian (left)", "3rd, left arm"]];
export const V3: React.FC = () => {
  const t = useT();
  const LT = [13.78, 14.0, 14.27, 14.54];
  return (
    <Scene start={12.8} end={15.25}>
      <div style={{ position: "absolute", left: 10, top: 20, width: 840, height: 880, borderRadius: 48, background: C.forest, ...pop(t, 12.85, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 44, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: C.matchaLight }}>JUST REMEMBER YOUR</div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 100, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 8 }}>
          {["A", "B", "C", "'", "S"].map((l, i) => {
            const k = l === "'" ? 3 : i > 3 ? 3 : i;
            const p = ramp(t, LT[k], LT[k] + 0.2);
            return <div key={i} style={{ fontFamily: FONT, fontWeight: 800, fontSize: l === "'" ? 120 : 140, lineHeight: 1, color: p > 0.5 ? C.banana : "rgba(247,246,236,0.18)", transform: `scale(${1 + 0.18 * Math.sin(p * Math.PI)})` }}>{l}</div>;
          })}
        </div>
        {ROWS.map(([l, rest, sub], i) => {
          const p = ramp(t, 13.1 + i * 0.2, 13.35 + i * 0.2);
          const hit = ramp(t, LT[i], LT[i] + 0.3);
          return (
            <div key={l} style={{ position: "absolute", left: 50, top: 300 + i * 140, opacity: p, transform: `translateX(${(1 - p) * 40}px)`, display: "flex", alignItems: "center", fontFamily: FONT, fontWeight: 800 }}>
              <span style={{ display: "inline-block", width: 96, height: 100, borderRadius: 22, background: C.banana, color: C.forest, textAlign: "center", lineHeight: "100px", fontSize: 76, marginRight: 8, flexShrink: 0, transform: `scale(${1 + 0.15 * Math.sin(hit * Math.PI)})` }}>{l}</span>
              <div>
                <div style={{ fontSize: 50, color: C.paper, letterSpacing: -1, lineHeight: 1.05, whiteSpace: "nowrap" }}>{rest}</div>
                <div style={{ fontSize: 28, color: C.matchaLight, marginTop: 4, whiteSpace: "nowrap" }}>{sub}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Scene>
  );
};

/* 4. Each letter lights its vessel on our diagram */
const STEPS: { id: PartId[]; t: number; name: string; letter: string; facts: [string, number][] }[] = [
  { id: ["AR"], t: 15.36, name: "Aortic arch", letter: "A", facts: [["the arch itself", 15.77]] },
  { id: ["BT"], t: 17.17, name: "Brachiocephalic trunk", letter: "B", facts: [["1st branch", 19.03], ["right side", 19.57]] },
  { id: ["LCC"], t: 20.56, name: "Left common carotid", letter: "C", facts: [["2nd", 20.9], ["head + neck", 22.23]] },
  { id: ["LSA"], t: 23.55, name: "Left subclavian", letter: "S", facts: [["3rd", 23.9], ["left arm", 24.94]] },
];
export const V4: React.FC = () => {
  const t = useT();
  const lit: Partial<Record<PartId, number>> = {};
  STEPS.forEach((s) => s.id.forEach((i) => (lit[i] = s.t)));
  let cur = STEPS[0];
  STEPS.forEach((s) => { if (t >= s.t) cur = s; });
  const swap = ramp(t, cur.t, cur.t + 0.3);
  return (
    <Scene start={15.25} end={25.85} push={0.015}>
      <div style={{ position: "absolute", left: 30, top: 0, opacity: ramp(t, 15.25, 15.55) }}>
        <Aorta t={t} w={800} lit={lit} focus={cur.id} dimFrom={15.3} letters letterOn={{ A: 15.36, B: 16.84, C: 20.21, S: 23.23 }} />
      </div>
      <div style={{ position: "absolute", left: 30, width: 800, top: 740, height: 190, borderRadius: 36, background: C.forest, boxShadow: "0 14px 30px rgba(31,42,20,0.25)", ...pop(t, 15.4, 0.3) }}>
        <div style={{ position: "absolute", left: 30, top: 26, display: "flex", alignItems: "center", gap: 18, opacity: swap, transform: `translateX(${(1 - swap) * 24}px)` }}>
          <div style={{ width: 66, height: 66, borderRadius: 33, background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>{cur.letter}</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: cur.name.length > 18 ? 48 : 56, color: C.paper, letterSpacing: -1, whiteSpace: "nowrap" }}>{cur.name}</div>
        </div>
        <div style={{ position: "absolute", left: 30, top: 116, display: "flex", gap: 14 }}>
          {cur.facts.map(([f, ft]) => (
            <div key={f} style={{ ...pop(t, ft, 0.25), background: C.matcha, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 34, padding: "8px 20px 11px", borderRadius: 16, whiteSpace: "nowrap" }}>{f}</div>
          ))}
        </div>
      </div>
    </Scene>
  );
};

/* 5. Only the right side has a brachiocephalic trunk: it splits in two */
export const V5: React.FC = () => {
  const t = useT();
  const right = ramp(t, 26.35, 26.7);
  return (
    <Scene start={25.85} end={32.85} push={0.015}>
      <div style={{ position: "absolute", left: 30, top: 0, opacity: ramp(t, 25.85, 26.15) }}>
        <Aorta t={t} w={800} lit={{ BT: 27.29, RCC: 30.16, RSA: 31.8, AR: 26.0 }} focus={t < 30.1 ? "BT" : t < 31.75 ? "RCC" : "RSA"} dimFrom={25.9} grow={{ BT: 0, RCC: 29.6, RSA: 31.3 }} />
      </div>
      {/* highlight the patient's right half */}
      <div style={{ position: "absolute", left: 10, top: 0, width: 400, height: 470, borderRadius: 40, border: `6px dashed ${C.matcha}`, background: "rgba(143,168,106,0.10)", opacity: right * (1 - ramp(t, 28.9, 29.2)) }} />
      <div style={{ position: "absolute", left: 34, top: 400, ...pop(t, 26.35) , opacity: right * (1 - ramp(t, 28.9, 29.2)) }}>
        <Pill size={34} bg={C.matcha}>RIGHT SIDE ONLY</Pill>
      </div>
      <Callout t0={29.84} x={326} y={110} tx={600} ty={50} text="R common carotid" />
      <Callout t0={31.52} x={150} y={186} tx={170} ty={330} text="R subclavian" />
      <div style={{ position: "absolute", left: 30, width: 800, top: 760, height: 130, borderRadius: 34, background: C.forest, boxShadow: "0 14px 30px rgba(31,42,20,0.25)", display: "flex", justifyContent: "center", alignItems: "center", gap: 12, ...pop(t, 29.1, 0.3) }}>
        <div style={{ ...pop(t, 29.2), background: C.matcha, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 40, padding: "10px 22px 13px", borderRadius: 18 }}>1 trunk</div>
        <div style={{ ...pop(t, 29.3), fontFamily: FONT, fontWeight: 800, fontSize: 48, color: C.matchaLight }}>→</div>
        <div style={{ ...pop(t, 30.16), background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 40, padding: "10px 22px 13px", borderRadius: 18 }}>carotid</div>
        <div style={{ ...pop(t, 31.33), fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper }}>+</div>
        <div style={{ ...pop(t, 31.8), background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 40, padding: "10px 22px 13px", borderRadius: 18 }}>subclavian</div>
      </div>
    </Scene>
  );
};

/* 6. The 1918 plate with modern labels + old-name note */
export const V6: React.FC = () => {
  const t = useT();
  return (
    <Scene start={32.85} end={37.2} push={0.01}>
      <Plate src="plates/aorta_top.png" aspect={ASPECT_TOP} x={20} y={20} w={820} a={32.85} b={37.2} zoomFrom={[1, 0.5, 0.5]} zoomTo={[1, 0.5, 0.5]} />
      <Callout t0={33.4} x={455} y={452} tx={640} ty={560} text="Aortic arch" />
      <Callout t0={34.0} x={356} y={302} tx={250} ty={470} text="Brachiocephalic trunk" dark={false} />
      <Callout t0={34.5} x={315} y={149} tx={185} ty={70} text="R common carotid" />
      <Callout t0={34.85} x={221} y={181} tx={150} ty={300} text="R subclavian" />
      <Callout t0={35.2} x={532} y={188} tx={625} ty={70} text="L common carotid" />
      <Callout t0={35.55} x={651} y={188} tx={700} ty={320} text="L subclavian" />
      <div style={{ position: "absolute", left: 60, width: 740, top: 715, height: 150, borderRadius: 26, background: C.forest, boxShadow: "0 12px 26px rgba(31,42,20,0.3)", ...pop(t, 36.0) }}>
        <div style={{ position: "absolute", left: 30, top: 22, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.matchaLight, letterSpacing: 2 }}>1918 ATLAS NAME</div>
        <div style={{ position: "absolute", left: 30, top: 62, fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.paper, whiteSpace: "nowrap" }}>
          "Innominate" = <span style={{ color: C.banana }}>brachiocephalic</span>
        </div>
      </div>
    </Scene>
  );
};

/* 7. Quick test */
export const V7: React.FC = () => {
  const t = useT();
  const c0 = 40.45;
  const n = t < c0 ? null : t < c0 + 0.5 ? 3 : t < c0 + 1.0 ? 2 : t < c0 + 1.5 ? 1 : null;
  const k = Math.floor((t - c0) / 0.5) * 0.5 + c0;
  return (
    <Scene start={37.2} end={41.95}>
      <div style={{ position: "absolute", left: 10, top: 30, width: 840, height: 840, borderRadius: 48, background: C.forest, ...pop(t, 37.25, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 52, display: "flex", justifyContent: "center" }}><div style={{ background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, padding: "8px 28px 11px 36px", borderRadius: 18 }}>QUICK TEST</div></div>
        <div style={{ position: "absolute", left: 40, width: 760, top: 150, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 66, lineHeight: 1.1, color: C.paper, ...pop(t, 38.16) }}>
          Where does the <span style={{ background: C.banana, color: C.forest, borderRadius: 16, padding: "0 14px 4px", display: "inline-block" }}>right subclavian</span> come from?
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 450, display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", padding: "0 50px", boxSizing: "border-box" }}>
          {["Aortic arch", "Brachiocephalic trunk", "Left common carotid"].map((x, i) => (
            <div key={x} style={{ ...pop(t, 39.6 + i * 0.15), background: C.matchaDark, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 38, padding: "12px 24px 15px", borderRadius: 18 }}>{x}</div>
          ))}
        </div>
        {n && (
          <div style={{ position: "absolute", left: 0, width: 840, top: 660, display: "flex", justifyContent: "center", transform: `scale(${1.3 - 0.3 * ramp(t, k, k + 0.15)})` }}><div style={{ width: 150, height: 150, borderRadius: 75, background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 104, lineHeight: "150px", textAlign: "center" }}>{n}</div></div>
        )}
      </div>
    </Scene>
  );
};

/* 8. Answer: from the brachiocephalic trunk; only the left one comes straight off the arch */
export const V8: React.FC = () => {
  const t = useT();
  const leftPhase = t >= 44.25;
  return (
    <Scene start={41.95} end={46.55} push={0.01}>
      <div style={center(0, pop(t, 42.05))}>
        <Pill size={50} bg={C.red}>BRACHIOCEPHALIC TRUNK</Pill>
      </div>
      <div style={{ position: "absolute", left: 100, top: 110, opacity: ramp(t, 42.0, 42.3) }}>
        <Aorta t={t} w={660} lit={{ BT: 42.18, RSA: 42.6, LSA: 44.25, AR: 45.79 }} focus={leftPhase ? (t >= 45.79 ? ["LSA", "AR"] : "LSA") : ["BT", "RSA"]} dimFrom={42.0} veins={false} />
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 790, display: "flex", justifyContent: "center", gap: 14 }}>
        <div style={{ ...pop(t, 42.6), background: C.forest, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 36, padding: "10px 20px 13px", borderRadius: 18, whiteSpace: "nowrap" }}>Right: via the trunk</div>
        <div style={{ ...pop(t, 44.25), background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 36, padding: "10px 20px 13px", borderRadius: 18, whiteSpace: "nowrap" }}>Left: straight off</div>
      </div>
    </Scene>
  );
};

/* 9. Save */
export const V9: React.FC = () => {
  const t = useT();
  const b = ramp(t, 46.65, 47.0);
  return (
    <Scene start={46.55} end={48.8}>
      <div style={center(40, pop(t, 46.6))}>
        <svg width={220} height={280} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={center(360, pop(t, 46.69))}>
        <Big size={120}>SAVE THIS</Big>
      </div>
      <div style={center(510, pop(t, 47.4))}>
        <Big size={58} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ ...center(650), gap: 14, ...pop(t, 47.9) }}>
        {["A", "B", "C", "S"].map((l, i) => (
          <div key={i} style={{ width: 100, height: 108, borderRadius: 20, background: i === 1 ? C.red : C.matcha, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 66, display: "flex", alignItems: "center", justifyContent: "center" }}>{l}</div>
        ))}
      </div>
    </Scene>
  );
};

/* 10. End card */
export const V10: React.FC = () => {
  const t = useT();
  return (
    <Scene start={48.8} end={52.9}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, 48.85, 0.35) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.matchaLight, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 49.9, 50.2) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 48.9) * 5))})`, opacity: ramp(t, 49.0, 49.3) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
