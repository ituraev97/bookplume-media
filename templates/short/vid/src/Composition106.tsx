import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT, ramp, useT } from "./kit";
import { END, Header, Subtitles, TT_CHAPTERS, TT_END } from "./Chrome106";
import { TT_WORDS } from "./words106";
import { Burst, Loud, PlateQ } from "./Scenes93";
import { VComment } from "./Scenes97";
import { A411, ALLSTICK, HOOKPIN, P411, TM_MAIN, TM_TT, TTDiag, V1, V2, V3, V4, V5, V6, V7, V8, V9 } from "./Scenes106";
import { Arm, MCOL } from "./Arm106";

const Dots: React.FC<{ w: number; h: number; o?: number }> = ({ w, h, o = 0 }) => (
  <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0 }}>
    <defs>
      <pattern id={`grid${w}`} width={54} height={54} patternUnits="userSpaceOnUse" patternTransform={`translate(${o} ${o * 0.5})`}>
        <circle cx={27} cy={27} r={2.2} fill={C.matcha} opacity={0.13} />
      </pattern>
    </defs>
    <rect width={w} height={h} fill={`url(#grid${w})`} />
  </svg>
);
const Grid: React.FC = () => {
  const t = useT();
  return <Dots w={1080} h={1920} o={(t * 40) % 54} />;
};
const HookBurst: React.FC<{ R: number }> = ({ R }) => {
  const t = useT();
  const a = 1 - ramp(t, R + 0.1, R + 0.6);
  if (a <= 0) return null;
  return <div style={{ position: "absolute", inset: 0, opacity: a }}><Burst w={1080} h={1920} cy={0.55} rot={t * 6} /></div>;
};

/* main cut (Reels / Shorts / FB / Stories) */
export const Video: React.FC<{ mask?: boolean }> = ({ mask }) => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Grid />
    <HookBurst R={TM_MAIN.reveal} />
    <V1 tm={TM_MAIN} />
    <V2 s0={6.0} s1={8.1} title={6.1} b1={7.0} b2={7.38} c={7.66} />
    <V3 s0={8.1} s1={10.6} bi={8.16} long={9.49} short={9.99} />
    <V4 s0={10.6} s1={13.35} br={10.66} bends={12.37} />
    <V5 s0={13.35} s1={16.8} cb={13.4} cor={15.23} hum={16.06} />
    <V6 s0={16.8} s1={20.0} nv={17.02} nvDone={17.8} all={18.75} />
    <V7 s0={20.0} s1={24.5} q={20.09} cd={[[22.64, 3], [23.27, 2], [23.91, 1]]} />
    <V8 s0={24.5} s1={26.85} a={24.67} />
    <V9 s0={26.85} s1={END} />
    <Header />
    <Subtitles />
    {mask && (
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <rect x={0} y={0} width={1080} height={200} fill="red" opacity={0.3} />
        <rect x={940} y={700} width={140} height={1000} fill="red" opacity={0.3} />
        <rect x={0} y={1440} width={1080} height={480} fill="red" opacity={0.3} />
        <rect x={70} y={470} width={860} height={940} fill="none" stroke="blue" strokeWidth={3} />
      </svg>
    )}
  </AbsoluteFill>
);

/* TikTok cut 15–18 s: hook → reveal → B·B·C → one map + nerve → comment card. No brand, no store. */
export const TikTok: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Grid />
    <HookBurst R={TM_TT.reveal} />
    <V1 tm={TM_TT} />
    <V2 s0={6.0} s1={8.1} title={6.1} b1={7.0} b2={7.38} c={7.66} />
    <TTDiag s0={8.1} s1={13.4} bi={8.16} br={8.65} cb={9.27} nv={10.6} nvDone={11.6} />
    <VComment s0={13.4} s1={TT_END} />
    <Header chapters={TT_CHAPTERS} end={TT_END} brand={false} />
    <Subtitles words={TT_WORDS} />
  </AbsoluteFill>
);

const COVC: [number, number, number] = [0.775, 0.81, 0.46];

/* Cover 1080x1920 BEAST style: all text in y 280–1640, x 60–1020; no store name (also used on TikTok) */
const Cover: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT }}>
    <Burst w={1080} h={1920} cy={0.5} rot={4} />
    <div style={{ position: "absolute", left: 60, width: 960, top: 300, display: "flex", justifyContent: "center" }}><Loud size={150}>NAME THIS</Loud></div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 470, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "#E5251A", border: "9px solid #111", borderRadius: 22, padding: "2px 34px 14px", transform: "rotate(-2deg)", boxShadow: "0 10px 0 #111" }}><Loud size={130}>MUSCLE?</Loud></div>
    </div>
    <PlateQ src={P411} aspect={A411} x={140} y={690} w={800} h={860} a={0} b={1} from={COVC} to={COVC} still credit="" tilt={-3} loud
      pin={{ ...HOOKPIN, t0: 0, t1: 99, r: 95 }} arrow stickers={ALLSTICK} />
    <div style={{ position: "absolute", left: 720, top: 1430, transform: "rotate(10deg)", background: "#E5251A", border: "8px solid #111", borderRadius: 24, padding: "6px 22px 12px", boxShadow: "0 8px 0 #111" }}><Loud size={78}>3 SEC</Loud></div>
  </AbsoluteFill>
);

/* Pinterest still 1000x1500 — loud quiz style */
const Pin: React.FC<{ title: string; sub: string }> = ({ title, sub }) => (
  <AbsoluteFill style={{ fontFamily: FONT }}>
    <Burst w={1000} h={1500} cy={0.5} rot={8} />
    <div style={{ position: "absolute", left: 40, width: 920, top: 50, textAlign: "center" }}><Loud size={92}>CAN YOU</Loud></div>
    <div style={{ position: "absolute", left: 40, width: 920, top: 160, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "#E5251A", border: "8px solid #111", borderRadius: 20, padding: "0 24px 10px", transform: "rotate(-2deg)", boxShadow: "0 8px 0 #111" }}><Loud size={88}>NAME THIS?</Loud></div>
    </div>
    <PlateQ src={P411} aspect={A411} x={120} y={330} w={760} h={780} a={0} b={1} from={COVC} to={COVC} still credit="" tilt={-2} loud
      pin={{ ...HOOKPIN, t0: 0, t1: 99, r: 90 }} arrow stickers={ALLSTICK} />
    <div style={{ position: "absolute", left: 50, width: 900, top: 1160, textAlign: "center", fontWeight: 800, fontSize: 46, color: "#111", lineHeight: 1.2 }}>{title}</div>
    <div style={{ position: "absolute", left: 50, width: 900, top: 1300, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "#111", color: "#FFE04A", fontWeight: 800, fontSize: 40, padding: "10px 30px 14px", borderRadius: 18 }}>Answer + flashcards → bookplume.com</div>
    </div>
    <div style={{ position: "absolute", left: 50, width: 900, top: 1410, textAlign: "center", color: "#111", opacity: 0.75, fontWeight: 700, fontSize: 22 }}>{sub}</div>
  </AbsoluteFill>
);

/* ---------- Instagram QUIZ carousel 1080x1350, 6 slides (n = 0..5) ---------- */
const CW = 1080, CH = 1350;
type CK = "CB" | "SH" | "LH" | "BR";
/* numbered pins on Gray's Fig. 411: 1 coracobrachialis, 2 short head of biceps, 3 long head of biceps, 4 brachialis */
const CPIN: [number, CK, number, number][] = [[1, "CB", 0.5, 0.21], [2, "SH", 0.6, 0.4], [3, "LH", 0.7, 0.42], [4, "BR", 0.792, 0.872]];
const CNAME: Record<CK, string> = { CB: "Coracobrachialis", SH: "Biceps · short head", LH: "Biceps · long head", BR: "Brachialis" };
const CCOL: Record<CK, string> = { CB: MCOL.CB, SH: MCOL.BI, LH: MCOL.BI, BR: MCOL.BR };
const CVIEW: [number, number, number] = [0.64, 0.52, 0.82];
const NumDots: React.FC<{ w: number; h: number; only?: number }> = ({ w, h, only }) => {
  const [cx, cy, zw] = CVIEW;
  const iw = w / zw, ih = iw / A411, L = w / 2 - cx * iw, T = h / 2 - cy * ih;
  return (
    <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {CPIN.filter(([n]) => only === undefined || n === only).map(([n, , fx, fy]) => {
        const x = L + fx * iw, y = T + fy * ih;
        return (
          <g key={n}>
            <circle cx={x} cy={y} r={40} fill="none" stroke="#fff" strokeWidth={14} />
            <circle cx={x} cy={y} r={40} fill="none" stroke="#E5251A" strokeWidth={8} />
            <circle cx={x - 58} cy={y - 40} r={34} fill="#E5251A" stroke="#111" strokeWidth={6} />
            <text x={x - 58} y={y - 28} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={38} fill="#fff">{n}</text>
          </g>
        );
      })}
    </svg>
  );
};
const CarPlate: React.FC<{ x: number; y: number; w: number; h: number; only?: number; loud?: boolean; view?: [number, number, number]; labels?: { x: number; y: number; text: string; t: number; hot?: boolean; ox: number; oy: number }[] }> = ({ x, y, w, h, only, loud, labels, view = CVIEW }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
    <PlateQ src={P411} aspect={A411} x={0} y={0} w={w} h={h} a={0} b={1} from={view} to={view} still credit={loud ? "" : "Gray's Anatomy, 1918 · public domain"} loud={loud} stickers={labels ? [] : ALLSTICK} labels={labels} ls={40} />
    {!labels && <NumDots w={w} h={h} only={only} />}
  </div>
);
const SLIDE: Record<CK, { view: [number, number, number]; labels: { x: number; y: number; text: string; t: number; hot?: boolean; ox: number; oy: number }[]; foot: string }> = {
  CB: { view: [0.48, 0.24, 0.5], labels: [{ x: 0.5, y: 0.25, text: "coracobrachialis", t: 0, hot: true, ox: 60, oy: 200 }, { x: 0.43, y: 0.125, text: "coracoid process", t: 0, ox: 80, oy: -70 }], foot: "C · coracoid process → middle of the humerus" },
  SH: { view: [0.62, 0.36, 0.5], labels: [{ x: 0.6, y: 0.36, text: "short head", t: 0, hot: true, ox: -60, oy: 160 }, { x: 0.672, y: 0.38, text: "long head", t: 0, ox: 60, oy: -130 }], foot: "B · from the coracoid, next to coracobrachialis" },
  LH: { view: [0.66, 0.38, 0.5], labels: [{ x: 0.672, y: 0.4, text: "long head", t: 0, hot: true, ox: 170, oy: 90 }, { x: 0.6, y: 0.36, text: "short head", t: 0, ox: -40, oy: -140 }], foot: "B · from above the shoulder socket → 1 belly" },
  BR: { view: [0.77, 0.8, 0.45], labels: [{ x: 0.79, y: 0.875, text: "brachialis", t: 0, hot: true, ox: -260, oy: -40 }, { x: 0.74, y: 0.66, text: "biceps", t: 0, ox: -200, oy: -30 }], foot: "B · under the biceps · bends the elbow only" },
};
const Carousel: React.FC<{ n: number }> = ({ n }) => {
  if (n === 0) {
    return (
      <AbsoluteFill style={{ fontFamily: FONT }}>
        <Burst w={CW} h={CH} cy={0.5} rot={6} />
        <div style={{ position: "absolute", left: 40, width: 1000, top: 40, textAlign: "center" }}><Loud size={96}>CAN YOU NAME</Loud></div>
        <div style={{ position: "absolute", left: 40, width: 1000, top: 152, display: "flex", justifyContent: "center" }}>
          <div style={{ background: "#E5251A", border: "8px solid #111", borderRadius: 20, padding: "0 26px 10px", transform: "rotate(-2deg)", boxShadow: "0 8px 0 #111" }}><Loud size={92}>ALL 4?</Loud></div>
        </div>
        <CarPlate x={130} y={300} w={820} h={880} loud />
        <div style={{ position: "absolute", left: 60, width: 640, top: 1240, fontWeight: 800, fontSize: 34, color: "#111" }}>front of the arm · quiz</div>
        <div style={{ position: "absolute", left: 720, top: 1215, transform: "rotate(-5deg)", background: C.banana, border: "6px solid #111", borderRadius: 20, padding: "8px 20px 12px", fontWeight: 800, fontSize: 38, color: "#111", boxShadow: "0 6px 0 #111" }}>swipe for answers →</div>
      </AbsoluteFill>
    );
  }
  if (n === 5) {
    const ROWS: [string, string, string][] = [["1", "Coracobrachialis", "coracoid → humerus · pierced by the nerve"], ["2", "Biceps · short head", "from the coracoid process"], ["3", "Biceps · long head", "from above the shoulder socket"], ["4", "Brachialis", "under the biceps · elbow only"]];
    return (
      <AbsoluteFill style={{ fontFamily: FONT, background: C.forest }}>
        <div style={{ position: "absolute", left: 60, top: 50, fontWeight: 800, fontSize: 34, letterSpacing: 4, color: C.banana }}>ALL 4 · FRONT OF THE ARM</div>
        <div style={{ position: "absolute", left: 60, top: 104, fontWeight: 800, fontSize: 52, color: C.paper, lineHeight: 1.1, whiteSpace: "nowrap" }}><span style={{ color: "#F59A7E" }}>B</span>iceps · <span style={{ color: "#5FD0BE" }}>B</span>rachialis · <span style={{ color: "#B99AF0" }}>C</span>oracobrachialis</div>
        <div style={{ position: "absolute", left: 60, top: 270, display: "flex", flexDirection: "column", gap: 56 }}>
          {ROWS.map(([i, nm, sub]) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <div style={{ width: 70, height: 70, borderRadius: 35, background: "#E5251A", border: "5px solid #111", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 40 }}>{i}</div>
              <div style={{ width: 24, height: 70, borderRadius: 12, background: CCOL[CPIN[Number(i) - 1][1]], border: `4px solid ${C.paper}` }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: 50, color: C.paper, lineHeight: 1.05 }}>{nm}</div>
                <div style={{ fontWeight: 700, fontSize: 30, color: "#B9D27A" }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 60, width: 960, top: 990, fontWeight: 700, fontSize: 32, color: "#B9D27A", lineHeight: 1.3 }}>All 3 muscles: musculocutaneous nerve. Biceps also turns the palm up (supination).</div>
        <div style={{ position: "absolute", left: 60, width: 960, top: 1170, display: "flex", justifyContent: "center" }}>
          <div style={{ background: C.banana, color: C.forest, borderRadius: 50, padding: "18px 50px 22px", fontWeight: 800, fontSize: 50 }}>Save this · bookplume.com</div>
        </div>
      </AbsoluteFill>
    );
  }
  const k = CPIN[n - 1][1];
  const S = SLIDE[k];
  const nm = CNAME[k];
  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: C.paper }}>
      <Dots w={CW} h={CH} />
      <div style={{ position: "absolute", left: 60, top: 46, display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 92, height: 92, borderRadius: 46, background: "#E5251A", border: "6px solid #111", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 52 }}>{n}</div>
        <div style={{ fontWeight: 800, fontSize: 40, color: C.matcha, letterSpacing: 3 }}>ANSWER</div>
      </div>
      <div style={{ position: "absolute", left: 60, width: 960, top: 160, fontWeight: 800, fontSize: nm.length > 16 ? 70 : 80, color: C.forest, lineHeight: 1.05, letterSpacing: -1, whiteSpace: "nowrap" }}>
        <span style={{ background: C.banana, borderRadius: 14, padding: "0 10px 4px" }}>{nm[0]}</span>{nm.slice(1)}
      </div>
      <CarPlate x={60} y={290} w={960} h={860} view={S.view} labels={S.labels} />
      <div style={{ position: "absolute", left: 60, width: 960, top: 1180, display: "flex" }}>
        <div style={{ background: CCOL[k], color: C.paper, borderRadius: 18, padding: "10px 22px 14px", fontWeight: 800, fontSize: 32 }}>{S.foot}</div>
      </div>
    </AbsoluteFill>
  );
};

const Diag: React.FC<{ mode: number }> = ({ mode }) => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Arm t={30} id="dg" w={700} lit={{ BI: 0, BR: 0, CB: 0 }} hot={mode === 1 ? ["BR"] : []} lift={mode === 1 ? 0.7 : mode === 2 ? 0.5 : 0} nerve={mode === 2 ? 1 : 0} heads={mode === 0 ? 1 : 0} />
  </AbsoluteFill>
);

export const MyComposition = () => (
  <>
    <Composition id="Diag" component={Diag} durationInFrames={1} fps={30} width={700} height={1100} defaultProps={{ mode: 0 }} />
    <Composition id="Main" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: false }} />
    <Composition id="Mask" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: true }} />
    <Composition id="TikTok" component={TikTok} durationInFrames={Math.ceil(TT_END * 30)} fps={30} width={1080} height={1920} />
    <Composition id="Cover" component={Cover} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "Arm Muscles Quiz: Name This Muscle + Biceps, Brachialis, Coracobrachialis", sub: "Gray's Anatomy (1918), public domain · anatomy flashcards · study tips" }} />
    <Composition id="Car" component={Carousel} durationInFrames={1} fps={30} width={CW} height={CH} defaultProps={{ n: 0 }} />
  </>
);
