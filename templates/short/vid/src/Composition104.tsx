import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT, ramp, useT } from "./kit";
import { END, Header, Subtitles, TT_CHAPTERS, TT_END } from "./Chrome104";
import { TT_WORDS } from "./words104";
import { Burst, Loud, PlateQ } from "./Scenes93";
import { A438, ATPIN, GASPIN, P438, RapidQ, SOLPIN, TComment, TM_MAIN, V1, V2, V3, V4, V5, V6, V7, V8, V9, atStick, gasStick, solStick } from "./Scenes104";
import { CCOL, Calf } from "./Calf104";

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
    <V2 s0={5.75} s1={8.5} tri={6.34} three={7.13} one={7.68} />
    <V3 s0={8.5} s1={11.05} g={8.58} two={9.54} femur={10.49} />
    <V4 s0={11.05} s1={13.9} so={11.1} tib={12.75} fib={13.27} />
    <V5 s0={13.9} s1={16.95} at={14.94} thick={15.88} />
    <V6 s0={16.95} s1={19.7} pl={17.01} all={17.95} />
    <V7 s0={19.7} s1={25.3} q={19.79} cd={[[23.39, 3], [24.03, 2], [24.67, 1]]} />
    <V8 s0={25.3} s1={28.6} g={25.35} so={26.57} />
    <V9 s0={28.6} s1={END} />
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

/* TikTok RAPID-QUIZ cut 15–18 s: 3 questions on Gray's Fig. 438 → comment your score. No brand, no store. */
export const TikTok: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Grid />
    <HookBurst R={4.96} />
    <RapidQ intro s0={-0.6} s1={5.75} q={2.37} ticks={[3.62, 4.27]} reveal={4.96} n={1} ask="THIS FLAT MUSCLE?" ans="SOLEUS" col={CCOL.SO}
      view0={[0.53, 0.46, 1.25]} view1={[0.53, 0.44, 1.08]} pin={SOLPIN} r={78} stick={solStick} />
    <RapidQ s0={5.75} s1={9.4} q={5.82} ticks={[7.0, 7.65]} reveal={8.3} n={2} ask="THESE 2 HEADS?" ans="GASTROCNEMIUS" col={CCOL.GM}
      view0={[0.48, 0.24, 1.0]} view1={[0.48, 0.25, 0.9]} pin={GASPIN} r={140} stick={gasStick} />
    <RapidQ s0={9.4} s1={14.65} q={9.47} ticks={[10.86, 11.5]} reveal={12.18} n={3} ask="THIS HEEL CORD?" ans="ACHILLES" col={CCOL.AT}
      view0={[0.42, 0.74, 1.0]} view1={[0.42, 0.75, 0.9]} pin={ATPIN} r={80} stick={atStick} extra={{ t: 13.11, text: "the thickest tendon in your body" }} />
    <TComment s0={14.65} s1={TT_END} />
    <Header chapters={TT_CHAPTERS} end={TT_END} brand={false} />
    <Subtitles words={TT_WORDS} />
  </AbsoluteFill>
);

const COVC: [number, number, number] = [0.52, 0.45, 1.0];

/* Cover 1080x1920 BEAST style: all text in y 280–1640, x 60–1020; no store name (also used on TikTok) */
const Cover: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT }}>
    <Burst w={1080} h={1920} cy={0.5} rot={4} />
    <div style={{ position: "absolute", left: 60, width: 960, top: 300, display: "flex", justifyContent: "center" }}><Loud size={150}>NAME THIS</Loud></div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 470, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "#E5251A", border: "9px solid #111", borderRadius: 22, padding: "2px 34px 14px", transform: "rotate(-2deg)", boxShadow: "0 10px 0 #111" }}><Loud size={130}>CALF MUSCLE?</Loud></div>
    </div>
    <PlateQ src={P438} aspect={A438} x={140} y={690} w={800} h={860} a={0} b={1} from={COVC} to={COVC} still credit="" tilt={-3} loud
      pin={{ ...SOLPIN, t0: 0, t1: 99, r: 100 }} arrow stickers={solStick(99)} />
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
    <PlateQ src={P438} aspect={A438} x={120} y={330} w={760} h={780} a={0} b={1} from={COVC} to={COVC} still credit="" tilt={-2} loud
      pin={{ ...SOLPIN, t0: 0, t1: 99, r: 92 }} arrow stickers={solStick(99)} />
    <div style={{ position: "absolute", left: 50, width: 900, top: 1160, textAlign: "center", fontWeight: 800, fontSize: 46, color: "#111", lineHeight: 1.2 }}>{title}</div>
    <div style={{ position: "absolute", left: 50, width: 900, top: 1300, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "#111", color: "#FFE04A", fontWeight: 800, fontSize: 40, padding: "10px 30px 14px", borderRadius: 18 }}>Answer + flashcards → bookplume.com</div>
    </div>
    <div style={{ position: "absolute", left: 50, width: 900, top: 1410, textAlign: "center", color: "#111", opacity: 0.75, fontWeight: 700, fontSize: 22 }}>{sub}</div>
  </AbsoluteFill>
);

const Diag: React.FC<{ mode: number }> = ({ mode }) => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Calf t={30} id="dg" w={700} lit={{ GM: 0, GL: 0, SO: 0, AT: 0, PL: 0 }} hot={mode === 1 ? ["SO"] : []} bones={mode === 2 ? 1 : 0} gas={mode === 1 ? 0.15 : 1} />
  </AbsoluteFill>
);

export const MyComposition = () => (
  <>
    <Composition id="Diag" component={Diag} durationInFrames={1} fps={30} width={700} height={1500} defaultProps={{ mode: 0 }} />
    <Composition id="Main" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: false }} />
    <Composition id="Mask" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: true }} />
    <Composition id="TikTok" component={TikTok} durationInFrames={Math.ceil(TT_END * 30)} fps={30} width={1080} height={1920} />
    <Composition id="Cover" component={Cover} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "Calf Muscles Quiz: Name This Muscle + the 2 Others That Make Your Achilles", sub: "Gray's Anatomy (1918), public domain · anatomy flashcards · study tips" }} />
      </>
);
