import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT, ramp, useT } from "./kit";
import { END, Header, Subtitles, TT_CHAPTERS, TT_END } from "./Chrome108";
import { TT_WORDS } from "./words108";
import { Burst, Loud, PlateQ } from "./Scenes93";
import { A434, BFPIN, P434, RapidQ, SMPIN, STPIN, TComment, TM_MAIN, V1, V2, V3, V4, V5, V6, V7, V8, bfStick, smStick, stStick } from "./Scenes108";
import { HCOL, Ham } from "./Ham108";

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
    <V1 tm={TM_MAIN} named={5.32} />
    <V2 s0={6.85} s1={10.0} three={6.91} semis={7.94} biceps={8.94} />
    <V3 s0={10.0} s1={14.9} st={10.11} top={11.36} tfor={11.78} sm={12.92} under={14.27} />
    <V4 s0={14.9} s1={17.45} b={15.0} long={16.24} short={16.72} />
    <V5 s0={17.45} s1={21.45} sit={18.14} nerve={19.16} sci={20.56} />
    <V6 s0={21.45} s1={25.62} q={21.5} cd={[[23.74, 3], [24.38, 2], [25.02, 1]]} />
    <V7 s0={25.62} s1={28.5} sh={25.76} fem={27.72} />
    <V8 s0={28.5} s1={END} />
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

const ALLST = [...bfStick(5.14), ...stStick(9.58), ...smStick(13.93)];
/* TikTok RAPID-QUIZ cut 15–18 s: 3 questions on Gray's Fig. 434 → comment your score. No brand, no store. */
export const TikTok: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Grid />
    <HookBurst R={5.14} />
    <RapidQ intro s0={-0.6} s1={6.4} q={2.61} ticks={[3.95, 4.55]} reveal={5.14} n={1} ask="THIS OUTER ONE?" ans="BICEPS FEMORIS" col={HCOL.BL}
      view0={[0.53, 0.6, 0.8]} view1={[0.53, 0.58, 0.7]} pin={BFPIN} r={80} stick={ALLST} lab={[-40, 130]} />
    <RapidQ s0={6.4} s1={10.85} q={6.47} ticks={[8.35, 8.95]} reveal={9.58} n={2} ask="LONG TENDON ONE?" ans="SEMITENDINOSUS" col={HCOL.ST}
      view0={[0.46, 0.58, 0.8]} view1={[0.46, 0.6, 0.7]} pin={STPIN} r={72} stick={ALLST} lab={[20, 160]} />
    <RapidQ s0={10.85} s1={16.0} q={10.92} ticks={[12.7, 13.3]} reveal={13.93} n={3} ask="FLAT ONE UNDER?" ans="SEMIMEMBRANOSUS" col={HCOL.SM}
      view0={[0.42, 0.6, 0.8]} view1={[0.42, 0.6, 0.7]} pin={SMPIN} r={72} stick={ALLST} lab={[40, 110]} extra={{ t: 15.01, text: "the hidden one" }} />
    <TComment s0={16.0} s1={TT_END} />
    <Header chapters={TT_CHAPTERS} end={TT_END} brand={false} />
    <Subtitles words={TT_WORDS} />
  </AbsoluteFill>
);

const COVC: [number, number, number] = [0.5, 0.585, 0.74];

/* Cover 1080x1920 BEAST style: all text in y 280–1640, x 60–1020; no store name (also used on TikTok) */
const Cover: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT }}>
    <Burst w={1080} h={1920} cy={0.5} rot={4} />
    <div style={{ position: "absolute", left: 60, width: 960, top: 300, display: "flex", justifyContent: "center" }}><Loud size={150}>NAME THIS</Loud></div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 470, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "#E5251A", border: "9px solid #111", borderRadius: 22, padding: "2px 34px 14px", transform: "rotate(-2deg)", boxShadow: "0 10px 0 #111" }}><Loud size={130}>HAMSTRING?</Loud></div>
    </div>
    <PlateQ src={P434} aspect={A434} x={140} y={690} w={800} h={860} a={0} b={1} from={COVC} to={COVC} still credit="" tilt={-3} loud
      pin={{ ...STPIN, t0: 0, t1: 99, r: 95 }} arrow stickers={stStick(99)} />
    <div style={{ position: "absolute", left: 790, top: 640, transform: "rotate(10deg)", background: "#E5251A", border: "8px solid #111", borderRadius: 24, padding: "6px 22px 12px", boxShadow: "0 8px 0 #111" }}><Loud size={78}>3 SEC</Loud></div>
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
    <PlateQ src={P434} aspect={A434} x={120} y={330} w={760} h={780} a={0} b={1} from={COVC} to={COVC} still credit="" tilt={-2} loud
      pin={{ ...STPIN, t0: 0, t1: 99, r: 88 }} arrow stickers={stStick(99)} />
    <div style={{ position: "absolute", left: 50, width: 900, top: 1160, textAlign: "center", fontWeight: 800, fontSize: 46, color: "#111", lineHeight: 1.2 }}>{title}</div>
    <div style={{ position: "absolute", left: 50, width: 900, top: 1300, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "#111", color: "#FFE04A", fontWeight: 800, fontSize: 40, padding: "10px 30px 14px", borderRadius: 18 }}>Answer + flashcards → bookplume.com</div>
    </div>
    <div style={{ position: "absolute", left: 50, width: 900, top: 1410, textAlign: "center", color: "#111", opacity: 0.75, fontWeight: 700, fontSize: 22 }}>{sub}</div>
  </AbsoluteFill>
);

const Diag: React.FC<{ mode: number }> = ({ mode }) => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Ham t={30} id="dg" w={700} lit={{ ST: 0, SM: 0, BL: 0, BS: 0 }} hot={mode === 1 ? ["BS"] : []} bones={mode === 1 ? 1 : 0} nerve={mode === 2 ? 1 : 0} it={mode === 2 ? 1 : 0} st={mode === 3 ? 0.15 : 1} />
  </AbsoluteFill>
);

export const MyComposition = () => (
  <>
    <Composition id="Diag" component={Diag} durationInFrames={1} fps={30} width={700} height={1500} defaultProps={{ mode: 0 }} />
    <Composition id="Main" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: false }} />
    <Composition id="Mask" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: true }} />
    <Composition id="TikTok" component={TikTok} durationInFrames={Math.ceil(TT_END * 30)} fps={30} width={1080} height={1920} />
    <Composition id="Cover" component={Cover} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "Hamstrings Quiz: Name This Muscle + the 2 Others on the Back of Your Thigh", sub: "Gray's Anatomy (1918), public domain · anatomy flashcards · study tips" }} />
      </>
);
