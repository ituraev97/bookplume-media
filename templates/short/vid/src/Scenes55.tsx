import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { Hand } from "./Hand55";

const A427 = 1944 / 2555;
const A428 = 864 / 1276;
const A429 = 751 / 1218;
const pop = (t: number, t0: number, d = 0.3) => {
  const p = ramp(t, t0, t0 + d);
  return { opacity: p, transform: `scale(${0.6 + 0.4 * p + 0.08 * Math.sin(Math.min(1, p) * Math.PI)})` } as React.CSSProperties;
};
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });
const Big: React.FC<{ size?: number; children: React.ReactNode; color?: string }> = ({ size = 110, children, color = C.forest }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1, letterSpacing: -2, textAlign: "center" }}>{children}</div>
);
export const liveAlpha = (_t: number) => 0;
// smooth back-and-forth between two values
const osc = (t: number, a: number, b: number, period: number, t0: number) => a + (b - a) * (0.5 - 0.5 * Math.cos(((t - t0) / period) * 2 * Math.PI));

/* 1. Hook: the 1918 palm plate, push in on the hand */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={4.9} push={0.02}>
      <div style={center(30, { ...pop(t, 0, 0.25), whiteSpace: "nowrap" })}>
        <Big size={64}>WHAT SPREADS YOUR</Big>
      </div>
      <div style={center(104, { ...pop(t, 0.5, 0.25), whiteSpace: "nowrap" })}>
        <Big size={86} color={C.red}>FINGERS APART?</Big>
      </div>
      <Plate src="plates/hand427.png" aspect={A427} x={160} y={215} w={540} a={-0.6} b={4.9} zoomFrom={[1, 0.5, 0.45]} zoomTo={[1.9, 0.52, 0.42]} />
      <div style={{ position: "absolute", left: 90, top: 760, display: "flex", gap: 22 }}>
        <div style={pop(t, 3.81, 0.22)}>
          <div style={{ background: C.matcha, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 84, padding: "6px 34px 14px", borderRadius: 26, border: `5px solid ${C.forest}`, letterSpacing: 4 }}>PAD</div>
        </div>
        <div style={pop(t, 4.22, 0.22)}>
          <div style={{ background: C.red, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 84, padding: "6px 34px 14px", borderRadius: 26, border: `5px solid ${C.forest}`, letterSpacing: 4 }}>DAB</div>
        </div>
      </div>
      <Stamp t0={2.3} text="2 WORDS" size={56} rot={8} color={C.forest} style={{ left: 470, top: 600 }} />
    </Scene>
  );
};

/* 2. The interossei: bones, then the two sets */
export const V2: React.FC = () => {
  const t = useT();
  const both = ramp(t, 8.17, 8.6);
  const pFocus = ramp(t, 10.24, 10.55) * (1 - ramp(t, 11.52, 11.8));
  const dFocus = ramp(t, 11.52, 11.8);
  const pA = both * (1 - 0.82 * dFocus);
  const dA = both * (1 - 0.85 * pFocus);
  return (
    <Scene start={4.9} end={12.85} push={0.02}>
      <div style={{ position: "absolute", left: 90, top: -30, transform: `translateY(${(1 - ramp(t, 4.9, 5.3)) * 40}px)` }}>
        <Hand t={t} w={680} boneLit={5.44} dA={dA} pA={pA} glow={{ P1: pFocus, P2: pFocus, P3: pFocus, D1: dFocus, D2: dFocus, D3: dFocus, D4: dFocus }} />
      </div>
      <div style={{ position: "absolute", left: 600, top: 560, ...pop(t, 5.44) }}>
        <Pill size={30} bg={C.forest}>metacarpals</Pill>
      </div>
      <div style={{ position: "absolute", left: 0, top: 120, ...pop(t, 8.17) }}>
        <Pill size={36} bg={C.banana} color={C.forest}>INTEROSSEI</Pill>
      </div>
      <div style={{ position: "absolute", left: 10, top: 188, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.forest, opacity: 0.6 * ramp(t, 8.6, 8.9) }}>
        inter- = between
        <br />
        osseus = bone
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 792, display: "flex", justifyContent: "center", gap: 18 }}>
        <div style={{ ...pop(t, 10.24), opacity: ramp(t, 10.24, 10.5) * (1 - 0.55 * dFocus) }}>
          <Pill size={36} bg={C.matcha}>PALMAR · palm side</Pill>
        </div>
        <div style={pop(t, 11.52)}>
          <Pill size={36} bg={C.red}>DORSAL · back</Pill>
        </div>
      </div>
    </Scene>
  );
};

/* 3. The mnemonic card */
const Row: React.FC<{ t: number; t0: number; tWord: number; tAct: number; word: string; a: string; aRest: string; b: string; bRest: string; color: string; top: number }> = ({ t, t0, tWord, tAct, word, a, aRest, b, bRest, color, top }) => {
  const p0 = ramp(t, t0 - 0.05, t0 + 0.2);
  const pw = ramp(t, tWord - 0.05, tWord + 0.2);
  const pa = ramp(t, tAct - 0.05, tAct + 0.2);
  const L = (s: string, big = true) => <span style={{ color: C.banana, fontSize: big ? 78 : 60 }}>{s}</span>;
  return (
    <div style={{ position: "absolute", left: 30, width: 780, top, height: 120, display: "flex", alignItems: "center", gap: 26 }}>
      <div style={{ opacity: p0, transform: `scale(${0.7 + 0.3 * p0})`, background: color, borderRadius: 24, width: 230, height: 112, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 78, color: C.paper, letterSpacing: 6, boxShadow: "0 8px 0 rgba(0,0,0,0.25)" }}>{word}</div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.paper, lineHeight: 1, display: "flex", gap: 16, alignItems: "baseline" }}>
        <span style={{ opacity: pw, transform: `translateY(${(1 - pw) * 24}px)`, display: "inline-block" }}>{L(a)}{aRest}</span>
        <span style={{ opacity: pa, transform: `translateY(${(1 - pa) * 24}px)`, display: "inline-block" }}>{L(b, false)}{bRest}</span>
      </div>
    </div>
  );
};
export const V3: React.FC = () => {
  const t = useT();
  const sq = t < 14.6 ? 0 : -0.75 * ramp(t, 15.6, 16.3);
  const sp = t < 17.2 ? 0 : 1.0 * ramp(t, 18.3, 19.0);
  return (
    <Scene start={12.85} end={20.0}>
      <div style={{ position: "absolute", left: 10, top: 20, width: 840, height: 880, borderRadius: 48, background: C.forest, ...pop(t, 12.9, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 42, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: C.matchaLight, opacity: ramp(t, 13.08, 13.4) }}>REMEMBER: PAD · DAB</div>
        <Row t={t} t0={13.56} tWord={14.66} tAct={15.02} word="PAD" a="P" aRest="almar" b="AD" bRest="duct" color={C.matcha} top={110} />
        <Row t={t} t0={13.97} tWord={17.28} tAct={17.67} word="DAB" a="D" aRest="orsal" b="AB" bRest="duct" color={C.red} top={250} />
        {/* the two moves */}
        <div style={{ position: "absolute", left: 30, top: 410, width: 370, height: 440, borderRadius: 32, background: "rgba(247,246,236,0.08)", opacity: ramp(t, 14.66, 15.0), border: `3px solid ${t < 17.2 ? C.matchaLight : "rgba(143,168,106,0.35)"}` }}>
          <div style={{ position: "absolute", left: 20, top: 8 }}>
            <Hand t={t} w={330} spread={sq} pA={1} glow={{ P1: ramp(t, 15.6, 15.9), P2: ramp(t, 15.6, 15.9), P3: ramp(t, 15.6, 15.9) }} arrows={{ dir: "in", a: ramp(t, 15.79, 16.0) }} />
          </div>
          <div style={{ position: "absolute", left: 0, width: 370, top: 380, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.matchaLight, opacity: ramp(t, 16.52, 16.8) }}>→ together ←</div>
        </div>
        <div style={{ position: "absolute", left: 440, top: 410, width: 370, height: 440, borderRadius: 32, background: "rgba(247,246,236,0.08)", opacity: ramp(t, 17.28, 17.6), border: `3px solid ${C.redLight}` }}>
          <div style={{ position: "absolute", left: 20, top: 8 }}>
            <Hand t={t} w={330} spread={sp} dA={1} glow={{ D1: ramp(t, 18.3, 18.6), D2: ramp(t, 18.3, 18.6), D3: ramp(t, 18.3, 18.6), D4: ramp(t, 18.3, 18.6) }} arrows={{ dir: "out", a: ramp(t, 18.44, 18.7) }} />
          </div>
          <div style={{ position: "absolute", left: 0, width: 370, top: 380, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.redLight, opacity: ramp(t, 19.24, 19.5) }}>← apart →</div>
        </div>
      </div>
    </Scene>
  );
};

/* 4. Everything is measured from the middle finger */
export const V4: React.FC = () => {
  const t = useT();
  const sp = t < 20.6 ? 0 : osc(t, 0, 1, 1.6, 20.6) - (t > 22.0 ? 0 : 0);
  const noP = ramp(t, 22.74, 23.05);
  const two = ramp(t, 24.51, 24.8);
  const mid = t < 25.4 ? 0 : t < 25.95 ? -13 * ramp(t, 25.4, 25.75) : -13 + 26 * ramp(t, 25.9, 26.3);
  const g = two * (0.6 + 0.4 * Math.sin(t * 6) ** 2);
  return (
    <Scene start={20.0} end={26.9} push={0.02}>
      <div style={{ position: "absolute", left: 90, top: -30 }}>
        <Hand t={t} w={680} spread={t < 22.3 ? sp * (1 - ramp(t, 21.9, 22.3)) : 0} mid={mid} axis={ramp(t, 20.3, 21.6)} dA={ramp(t, 20.0, 20.4)} pA={ramp(t, 20.0, 20.4) * (1 - 0.8 * two)} noPalmar={noP} glow={{ D2: g, D3: g }} midArrow={t > 25.4 ? { dir: t < 25.95 ? -1 : 1, a: ramp(t, 25.45, 25.65) } : undefined} arrows={t < 22.0 ? { dir: "out", a: ramp(t, 20.6, 20.9) * (1 - ramp(t, 21.7, 21.95)) } : undefined} />
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 792, display: "flex", justifyContent: "center", opacity: ramp(t, 21.48, 21.7) * (1 - ramp(t, 22.6, 22.85)) }}>
        <div style={pop(t, 21.48)}>
          <Pill size={36} bg={C.banana} color={C.forest}>the axis = middle finger</Pill>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 792, display: "flex", justifyContent: "center", gap: 18 }}>
        <div style={pop(t, 22.92)}>
          <Pill size={34} bg={C.card} color={C.forest} style={{ border: `4px solid ${C.forest}` }}>
            <span style={{ color: C.red }}>✕</span> no palmar
          </Pill>
        </div>
        <div style={pop(t, 24.22)}>
          <Pill size={34} bg={C.red}>2 dorsal ✓</Pill>
        </div>
        <div style={pop(t, 25.57)}>
          <Pill size={34} bg={C.forest}>moves both ways</Pill>
        </div>
      </div>
    </Scene>
  );
};

/* 5. Nerve supply */
export const V5: React.FC = () => {
  const t = useT();
  return (
    <Scene start={26.9} end={29.25} push={0.02}>
      <div style={{ position: "absolute", left: 90, top: -30 }}>
        <Hand t={t} w={680} dA={0.9} pA={0.9} dimBones={0.4} nerve={ramp(t, 27.4, 28.6)} glow={{ D1: ramp(t, 28.29, 28.5) * 0.6, P1: ramp(t, 28.29, 28.5) * 0.6, P2: ramp(t, 28.29, 28.5) * 0.6 }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 120, ...pop(t, 26.95) }}>
        <Pill size={32} bg={C.forest}>BOTH SETS</Pill>
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 790, display: "flex", justifyContent: "center", ...pop(t, 28.29) }}>
        <div style={{ background: C.banana, color: C.forest, border: `4px solid ${C.forest}`, borderRadius: 26, padding: "10px 30px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 48, whiteSpace: "nowrap" }}>
          ULNAR NERVE <span style={{ fontSize: 30, opacity: 0.75 }}>· deep branch</span>
        </div>
      </div>
    </Scene>
  );
};

/* 6. The 1918 atlas: dorsal + palmar plates with modern labels */
export const V6: React.FC = () => {
  const t = useT();
  return (
    <Scene start={29.25} end={31.85} push={0.01}>
      <Plate src="plates/dors428.png" aspect={A428} x={10} y={40} w={420} a={29.25} b={31.85} zoomFrom={[1, 0.5, 0.3]} zoomTo={[1.05, 0.5, 0.3]} credit=""
        labels={[{ x: 0.45, y: 0.3, text: "Dorsal", t: 29.6, hot: true, ox: 90, oy: 210 }]} />
      <Plate src="plates/palm429.png" aspect={A429} x={445} y={40} w={400} a={29.45} b={31.85} zoomFrom={[1, 0.5, 0.3]} zoomTo={[1.05, 0.5, 0.3]} credit="Gray's Anatomy, 1918 · public domain"
        labels={[{ x: 0.42, y: 0.3, text: "Palmar", t: 30.1, ox: 70, oy: 230 }]} />
      <div style={{ position: "absolute", left: 0, width: 860, top: 735, display: "flex", justifyContent: "center", ...pop(t, 30.6) }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 20px 11px", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.forest, whiteSpace: "nowrap" }}>
          <span style={{ color: C.matcha }}>1918 atlas name:</span> interossei volares (palmar)
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 815, display: "flex", justifyContent: "center", ...pop(t, 30.96) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.forest, opacity: 0.7 }}>* line = axis through the middle finger</div>
      </div>
    </Scene>
  );
};

/* 7. Quick test */
export const V7: React.FC = () => {
  const t = useT();
  const c0 = 36.12;
  const n = t < c0 ? null : t < c0 + 0.5 ? 3 : t < c0 + 1.0 ? 2 : t < c0 + 1.5 ? 1 : null;
  return (
    <Scene start={31.85} end={37.62}>
      <div style={{ position: "absolute", left: 10, top: 40, width: 840, height: 840, borderRadius: 48, background: C.forest, ...pop(t, 31.9, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 60, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 40, width: 760, top: 140, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 52, lineHeight: 1.12, color: C.paper, ...pop(t, 32.62) }}>
          You grip a <span style={{ color: C.banana }}>card</span> between 2 fingers.
        </div>
        {/* card between two finger pills */}
        <div style={{ position: "absolute", left: 0, width: 840, top: 290, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 0, ...pop(t, 33.16) }}>
          <div style={{ width: 70, height: 150, borderRadius: "35px 35px 12px 12px", background: "#E9E3C8", border: `4px solid ${C.paper}`, transform: `translateX(${8 * ramp(t, 33.4, 33.8)}px)` }} />
          <div style={{ width: 130, height: 96, borderRadius: 12, background: C.card, border: `4px solid ${C.banana}`, marginBottom: 30, zIndex: 2, display: "flex", flexDirection: "column", gap: 8, padding: 14, boxSizing: "border-box" }}>
            <div style={{ width: 60, height: 10, borderRadius: 5, background: C.matcha }} />
            <div style={{ width: 90, height: 8, borderRadius: 4, background: C.line }} />
            <div style={{ width: 70, height: 8, borderRadius: 4, background: C.line }} />
          </div>
          <div style={{ width: 74, height: 170, borderRadius: "37px 37px 12px 12px", background: "#E9E3C8", border: `4px solid ${C.paper}`, transform: `translateX(${-8 * ramp(t, 33.4, 33.8)}px)` }} />
        </div>
        <div style={{ position: "absolute", left: 40, width: 760, top: 480, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 60, lineHeight: 1.1, color: C.paper, ...pop(t, 34.64) }}>
          Which interossei <span style={{ color: C.banana }}>hold it?</span>
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 590, display: "flex", justifyContent: "center", gap: 22 }}>
          {[["PALMAR", C.matcha], ["DORSAL", C.red]].map(([x, col], i) => (
            <div key={x} style={{ ...pop(t, 35.2 + i * 0.15), background: C.matchaDark, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 40, padding: "12px 26px 16px", borderRadius: 20, display: "flex", alignItems: "center", gap: 12, whiteSpace: "nowrap" }}>
              <div style={{ width: 24, height: 24, borderRadius: 12, background: col, border: `3px solid ${C.paper}` }} />
              {x}
            </div>
          ))}
        </div>
        {n && (
          <div style={{ position: "absolute", left: 0, width: 840, top: 700, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 116, color: C.banana, lineHeight: 1, transform: `scale(${1.3 - 0.3 * ramp(t, Math.floor((t - c0) / 0.5) * 0.5 + c0, Math.floor((t - c0) / 0.5) * 0.5 + c0 + 0.15)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 8. Answer: palmar — fingers pulled together around the card */
export const V8: React.FC = () => {
  const t = useT();
  const sq = -0.55 * ramp(t, 37.9, 38.4);
  const g = ramp(t, 37.77, 38.0);
  return (
    <Scene start={37.62} end={40.1} push={0.01}>
      <div style={{ position: "absolute", left: 0, top: 10 }}>
        <Hand t={t} w={560} spread={sq} pA={1} dA={0.18} card={ramp(t, 37.8, 38.2)} glow={{ P1: g, P2: g, P3: g }} />
      </div>
      <div style={{ position: "absolute", left: 540, top: 120, ...pop(t, 37.7) }}>
        <Pill size={46} bg={C.matcha}>PALMAR ✓</Pill>
      </div>
      <div style={{ position: "absolute", left: 556, top: 214, width: 280, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.forest, lineHeight: 1.2, opacity: ramp(t, 38.1, 38.4) }}>
        they squeeze the fingers together
      </div>
      <div style={{ position: "absolute", left: 40, width: 780, top: 690, borderRadius: 36, background: C.card, border: `4px solid ${C.line}`, padding: "24px 34px", boxSizing: "border-box", fontFamily: FONT, ...pop(t, 38.46) }}>
        <div style={{ fontWeight: 800, fontSize: 30, letterSpacing: 4, color: C.matcha }}>PAD</div>
        <div style={{ fontWeight: 800, fontSize: 64, color: C.forest, lineHeight: 1.1 }}>
          <span style={{ color: C.matcha }}>P</span>almar <span style={{ color: C.matcha }}>AD</span>duct
        </div>
      </div>
    </Scene>
  );
};

/* 9. Save */
export const V9: React.FC = () => {
  const t = useT();
  const b = ramp(t, 40.2, 40.55);
  return (
    <Scene start={40.1} end={42.3}>
      <div style={center(40, pop(t, 40.15))}>
        <svg width={220} height={280} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={center(360, pop(t, 40.19))}>
        <Big size={120}>SAVE THIS</Big>
      </div>
      <div style={center(510, pop(t, 41.18))}>
        <Big size={58} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ ...center(640), gap: 18, ...pop(t, 41.5) }}>
        <div style={{ background: C.matcha, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 44, padding: "12px 26px 16px", borderRadius: 18 }}>
          <span style={{ color: C.banana }}>P</span>almar <span style={{ color: C.banana }}>AD</span>
        </div>
        <div style={{ background: C.red, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 44, padding: "12px 26px 16px", borderRadius: 18 }}>
          <span style={{ color: C.banana }}>D</span>orsal <span style={{ color: C.banana }}>AB</span>
        </div>
      </div>
    </Scene>
  );
};

/* 10. End card */
export const V10: React.FC = () => {
  const t = useT();
  return (
    <Scene start={42.3} end={46.6}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, 42.35, 0.35) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.banana, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 43.43, 43.7) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 42.3) * 5))})`, opacity: ramp(t, 42.45, 42.7) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
