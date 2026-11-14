import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { Wrist, BoneId } from "./Wrist14";

const ASPECT = 2151 / 2919;
const pop = (t: number, t0: number, d = 0.3) => {
  const p = ramp(t, t0, t0 + d);
  return { opacity: p, transform: `scale(${0.6 + 0.4 * p + 0.08 * Math.sin(Math.min(1, p) * Math.PI)})` } as React.CSSProperties;
};
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });
const Big: React.FC<{ size?: number; children: React.ReactNode; color?: string }> = ({ size = 110, children, color = C.forest }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1, letterSpacing: -2, textAlign: "center" }}>{children}</div>
);
export const liveAlpha = (_t: number) => 0;

/* 1. Hook: the real 1918 plate, push in on the wrist */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={4.0} push={0.02}>
      <div style={center(0, pop(t, 0, 0.25))}>
        <Big size={96}>
          <span style={{ color: C.matcha }}>8</span> CARPAL BONES?
        </Big>
      </div>
      <Plate src="plates/hand.png" aspect={ASPECT} x={130} y={120} w={600} a={-0.6} b={4.0} zoomFrom={[1, 0.5, 0.3]} zoomTo={[2.3, 0.5, 0.12]} credit="Gray's Anatomy, 1918 · public domain" />
      <Stamp t0={2.25} text="THE TRICK" size={62} rot={-8} color={C.red} style={{ left: 520, top: 640 }} />
    </Scene>
  );
};

/* 2. Two rows of four, start at the thumb */
export const V2: React.FC = () => {
  const t = useT();
  return (
    <Scene start={4.0} end={9.1}>
      <div style={center(-20, { transform: `translateY(${(1 - ramp(t, 4.0, 4.4)) * 40}px)` })}>
        <Wrist t={t} w={840} rowHi={{ d: 6.2, p: 6.45 }} thumbGlow={8.1} lit={{}} />
      </div>
      <div style={{ position: "absolute", left: 40, top: 740, display: "flex", gap: 18 }}>
        <div style={pop(t, 4.64)}><Pill size={40} bg={C.forest}>8 bones</Pill></div>
        <div style={pop(t, 5.94)}><Pill size={40} bg={C.matcha}>2 rows</Pill></div>
        <div style={pop(t, 6.5)}><Pill size={40} bg={C.red}>× 4 each</Pill></div>
      </div>
      <div style={{ position: "absolute", left: 40, top: 840, ...pop(t, 7.6) }}>
        <Pill size={42} bg={C.banana} color={C.forest}>START: THUMB SIDE →</Pill>
      </div>
    </Scene>
  );
};

/* 3. The sentence */
const WORDS3: [string, number][] = [["Sally", 10.46], ["Left", 10.77], ["The", 11.0], ["Party", 11.07], ["To", 11.47], ["Take", 11.57], ["Cathy", 11.85], ["Home", 12.21]];
export const V3: React.FC = () => {
  const t = useT();
  const line = (ws: [string, number][], top: number, tag: string, tagBg: string, tagT: number) => (
    <div style={{ position: "absolute", left: 0, width: 860, top }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 14, ...pop(t, tagT) }}>
        <Pill size={30} bg={tagBg}>{tag}</Pill>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "nowrap" }}>
        {ws.map(([w, wt]) => {
          const p = ramp(t, wt - 0.05, wt + 0.18);
          return (
            <div key={w} style={{ opacity: p, transform: `translateY(${(1 - p) * 30}px) scale(${0.8 + 0.2 * p})`, fontFamily: FONT, fontWeight: 800, fontSize: 62, letterSpacing: -1.5, color: C.paper, lineHeight: 1 }}>
              <span style={{ color: C.banana, fontSize: 88 }}>{w[0]}</span>
              {w.slice(1)}
            </div>
          );
        })}
      </div>
    </div>
  );
  return (
    <Scene start={9.1} end={12.95}>
      <div style={{ position: "absolute", left: 10, top: 40, width: 840, height: 820, borderRadius: 48, background: C.forest, ...pop(t, 9.15, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 60, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 6, color: C.matchaLight }}>REMEMBER THIS SENTENCE</div>
        <div style={{ position: "absolute", left: -10, top: 170 }}>{line(WORDS3.slice(0, 4), 0, "ROW 1 · forearm side", C.red, 10.4)}</div>
        <div style={{ position: "absolute", left: -10, top: 460 }}>{line(WORDS3.slice(4), 0, "ROW 2 · finger side", C.matcha, 11.4)}</div>
      </div>
    </Scene>
  );
};

/* 4. Name them one by one */
const P_ROW: [BoneId, string, number][] = [["S", "Scaphoid", 14.63], ["L", "Lunate", 15.16], ["Tq", "Triquetrum", 15.63], ["P", "Pisiform", 16.26]];
const D_ROW: [BoneId, string, number][] = [["Tm", "Trapezium", 18.84], ["Td", "Trapezoid", 19.6], ["Cp", "Capitate", 20.22], ["H", "Hamate", 20.81]];
export const V4: React.FC = () => {
  const t = useT();
  const lit: Partial<Record<BoneId, number>> = {};
  [...P_ROW, ...D_ROW].forEach(([id, , tt]) => (lit[id] = tt));
  const second = t >= 17.25;
  const rowSwap = ramp(t, 17.25, 17.55);
  const chips = (row: [BoneId, string, number][], bg: string) => (
    <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
      {row.map(([id, name, tt]) => {
        const p = ramp(t, tt - 0.05, tt + 0.2);
        const now = t >= tt && t < tt + 0.6;
        return (
          <div key={id} style={{ opacity: 0.25 + 0.75 * p, transform: `scale(${now ? 1.08 : 1})`, background: p > 0.5 ? bg : C.line, color: p > 0.5 ? (bg === C.banana ? C.forest : C.paper) : C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 34, padding: "10px 16px 13px", borderRadius: 16, whiteSpace: "nowrap" }}>
            <span style={{ fontSize: 40 }}>{name[0]}</span>
            {name.slice(1)}
          </div>
        );
      })}
    </div>
  );
  return (
    <Scene start={12.95} end={21.5} push={0.02}>
      <div style={{ position: "absolute", left: 10, top: -20 }}>
        <Wrist t={t} w={840} lit={lit} rowHi={{ p: 13.1, d: 17.3 }} />
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 735 }}>
        <div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 4, color: second ? C.matcha : C.red, marginBottom: 14 }}>
          {second ? "ROW 2 · NEXT TO THE FINGERS" : "ROW 1 · NEXT TO THE FOREARM"}
        </div>
        <div style={{ opacity: second ? rowSwap : 1, transform: `translateY(${second ? (1 - rowSwap) * 20 : 0}px)` }}>{second ? chips(D_ROW, C.matcha) : chips(P_ROW, C.red)}</div>
      </div>
    </Scene>
  );
};

/* 5. Bonus: trapezium under the thumb — on the 1918 plate with modern labels */
export const V5: React.FC = () => {
  const t = useT();
  return (
    <Scene start={21.5} end={24.9} push={0.01}>
      <div style={center(0, pop(t, 21.6))}>
        <Pill size={40} bg={C.banana} color={C.forest}>BONUS TRICK</Pill>
      </div>
      <Plate
        src="plates/hand.png" aspect={ASPECT} x={150} y={80} w={560} a={21.5} b={24.9}
        zoomFrom={[1.7, 0.35, 0.16]} zoomTo={[2.4, 0.3, 0.17]}
        labels={[
          { x: 0.333, y: 0.148, text: "Trapezium", t: 22.6, side: "r", hot: true },
          { x: 0.17, y: 0.27, text: "Thumb", t: 23.95, side: "r" },
        ]}
      />
      <div style={{ position: "absolute", left: 90, width: 680, top: 860, display: "flex", justifyContent: "center", ...pop(t, 23.2) }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 20px 11px", fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.forest, whiteSpace: "nowrap" }}>
          <span style={{ color: C.matcha }}>1918 atlas name:</span> greater multangular
        </div>
      </div>
    </Scene>
  );
};

/* 6. Quick test */
export const V6: React.FC = () => {
  const t = useT();
  const n = t < 26.6 ? null : t < 27.1 ? 3 : t < 27.6 ? 2 : t < 28.1 ? 1 : null;
  return (
    <Scene start={24.9} end={28.15}>
      <div style={{ position: "absolute", left: 10, top: 40, width: 840, height: 820, borderRadius: 48, background: C.forest, ...pop(t, 24.95, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 70, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 40, width: 760, top: 170, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 84, lineHeight: 1.05, color: C.paper, ...pop(t, 25.6) }}>
          Which one has a little <span style={{ color: C.banana }}>hook?</span>
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 470, display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", padding: "0 60px", boxSizing: "border-box" }}>
          {["Scaphoid", "Lunate", "Capitate", "Hamate"].map((x, i) => (
            <div key={x} style={{ ...pop(t, 25.9 + i * 0.1), background: C.matchaDark, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 40, padding: "12px 24px 15px", borderRadius: 18 }}>{x}</div>
          ))}
        </div>
        {n && (
          <div style={{ position: "absolute", left: 0, width: 840, top: 640, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 120, color: C.banana, lineHeight: 1, transform: `scale(${1.3 - 0.3 * ramp(t, Math.floor((t - 26.6) / 0.5) * 0.5 + 26.6, Math.floor((t - 26.6) / 0.5) * 0.5 + 26.75)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 7. Answer: hamate */
export const V7: React.FC = () => {
  const t = useT();
  return (
    <Scene start={28.15} end={31.85} push={0.01}>
      <div style={{ position: "absolute", left: 30, top: 0 }}>
        <Wrist t={t} w={600} lit={{ H: 28.48 }} hookGlow={28.6} showLetters={false} dim={0.5} />
      </div>
      <div style={{ position: "absolute", left: 600, top: 170, ...pop(t, 28.5) }}>
        <Pill size={46} bg={C.red}>HAMATE</Pill>
      </div>
      <div style={{ position: "absolute", left: 610, top: 270, width: 230, fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.forest, opacity: ramp(t, 28.9, 29.2), lineHeight: 1.2 }}>
        hook faces the palm
      </div>
      <div style={{ position: "absolute", left: 40, width: 780, top: 600, borderRadius: 36, background: C.card, border: `4px solid ${C.line}`, padding: "28px 34px", boxSizing: "border-box", fontFamily: FONT, ...pop(t, 29.35) }}>
        <div style={{ fontWeight: 800, fontSize: 30, letterSpacing: 4, color: C.matcha }}>LATIN</div>
        <div style={{ fontWeight: 800, fontSize: 64, color: C.forest, lineHeight: 1.1 }}>
          hamatus = <span style={{ color: C.red }}>hooked</span>
        </div>
      </div>
    </Scene>
  );
};

/* 8. Save */
export const V8: React.FC = () => {
  const t = useT();
  const b = ramp(t, 31.95, 32.3);
  return (
    <Scene start={31.85} end={34.05}>
      <div style={center(40, pop(t, 31.9))}>
        <svg width={220} height={280} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={center(360, pop(t, 32.1))}>
        <Big size={120}>SAVE THIS</Big>
      </div>
      <div style={center(510, pop(t, 32.9))}>
        <Big size={58} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ position: "absolute", left: 150, top: 650, display: "flex", gap: 10, ...pop(t, 33.3) }}>
        {"SLTPTTCH".split("").map((l, i) => (
          <div key={i} style={{ width: 62, height: 72, borderRadius: 14, background: i < 4 ? C.red : C.matcha, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>{l}</div>
        ))}
      </div>
    </Scene>
  );
};

/* 9. End card */
export const V9: React.FC = () => {
  const t = useT();
  return (
    <Scene start={34.05} end={38.6}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, 34.1, 0.35) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.banana, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 35.0, 35.3) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 34) * 5))})`, opacity: ramp(t, 34.3, 34.6) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
