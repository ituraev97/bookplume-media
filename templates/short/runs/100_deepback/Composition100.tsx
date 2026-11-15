import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT, ramp, useT } from "./kit";
import { END, Header, Subtitles, TT_CHAPTERS, TT_END } from "./Chrome100";
import { TT_WORDS } from "./words100";
import { Burst, Loud, PlateQ } from "./Scenes93";
import { V8 as VFollow, VComment } from "./Scenes97";
import { A389, HOOKPIN, P389, TM_MAIN, TM_TT, V1, V2, V3, V4, V5, V6, V7, hookStick } from "./Scenes100";
import { Deep } from "./Deep100";

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
    <V2 s0={5.85} s1={8.9} three={5.88} out={6.59} tok={[7.82, 7.91, 8.13]} />
    <V3 s0={8.9} s1={13.3} il={8.92} lo={9.94} sp={11.23} big={10.73} by={12.14} />
    <V4 s0={13.3} s1={17.75} deeper={13.33} groove={13.82} ss={15.33} mu={16.15} ro={16.87} />
    <V5 s0={17.75} s1={22.15} q={17.79} cd={[[20.26, 3], [20.89, 2], [21.54, 1]]} />
    <V6 s0={22.15} s1={25.55} post={22.26} not={24.5} />
    <V7 s0={25.55} s1={27.9} />
    <VFollow s0={27.9} s1={END} />
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

/* TikTok cut 15–18 s: hook → reveal → I Love Spaghetti → plate columns → comment card. No brand, no store. */
export const TikTok: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Grid />
    <HookBurst R={TM_TT.reveal} />
    <V1 tm={TM_TT} ridges />
    <V2 s0={6.45} s1={9.8} three={6.66} out={7.39} tok={[8.68, 8.78, 9.07]} />
    <V3 s0={9.8} s1={14.3} il={9.86} lo={10.94} sp={11.53} big={13.38} />
    <VComment s0={14.3} s1={TT_END} />
    <Header chapters={TT_CHAPTERS} end={TT_END} brand={false} />
    <Subtitles words={TT_WORDS} />
  </AbsoluteFill>
);

const COVC: [number, number, number] = [0.6, 0.69, 0.68];

/* Cover 1080x1920 BEAST style: all text in y 280–1640, x 60–1020; no store name (also used on TikTok) */
const Cover: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT }}>
    <Burst w={1080} h={1920} cy={0.5} rot={4} />
    <div style={{ position: "absolute", left: 60, width: 960, top: 300, display: "flex", justifyContent: "center" }}><Loud size={150}>NAME THIS</Loud></div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 470, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "#E5251A", border: "9px solid #111", borderRadius: 22, padding: "2px 34px 14px", transform: "rotate(-2deg)", boxShadow: "0 10px 0 #111" }}><Loud size={130}>MUSCLE?</Loud></div>
    </div>
    <PlateQ src={P389} aspect={A389} x={140} y={690} w={800} h={860} a={0} b={1} from={COVC} to={COVC} still credit="" tilt={-3} loud
      pin={{ ...HOOKPIN, t0: 0, t1: 99, r: 105 }} arrow stickers={[hookStick(99)]} />
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
    <PlateQ src={P389} aspect={A389} x={120} y={330} w={760} h={780} a={0} b={1} from={COVC} to={COVC} still credit="" tilt={-2} loud
      pin={{ ...HOOKPIN, t0: 0, t1: 99, r: 100 }} arrow stickers={[hookStick(99)]} />
    <div style={{ position: "absolute", left: 50, width: 900, top: 1160, textAlign: "center", fontWeight: 800, fontSize: 46, color: "#111", lineHeight: 1.2 }}>{title}</div>
    <div style={{ position: "absolute", left: 50, width: 900, top: 1300, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "#111", color: "#FFE04A", fontWeight: 800, fontSize: 40, padding: "10px 30px 14px", borderRadius: 18 }}>Answer + flashcards → bookplume.com</div>
    </div>
    <div style={{ position: "absolute", left: 50, width: 900, top: 1410, textAlign: "center", color: "#111", opacity: 0.75, fontWeight: 700, fontSize: 22 }}>{sub}</div>
  </AbsoluteFill>
);

const Diag: React.FC<{ mode: number }> = ({ mode }) => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Deep t={30} id="dg" w={1000} lit={{ IL: 0, LO: 0, SP: 0, SS: 0, MU: 0, RO: 0 }} hot={mode === 1 ? ["MU"] : []} nerve={mode === 2 ? 1 : 0} post={mode === 2 ? 1 : 0} ant={mode === 2 ? 1 : 0} es={mode === 0 ? 1 : 0} ts={mode === 0 ? 1 : 0} groove={mode === 1 ? 1 : 0} />
  </AbsoluteFill>
);

export const MyComposition = () => (
  <>
    <Composition id="Diag" component={Diag} durationInFrames={1} fps={30} width={1000} height={1000} defaultProps={{ mode: 0 }} />
    <Composition id="Main" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: false }} />
    <Composition id="Mask" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: true }} />
    <Composition id="TikTok" component={TikTok} durationInFrames={Math.ceil(TT_END * 30)} fps={30} width={1080} height={1920} />
    <Composition id="Cover" component={Cover} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "Deep Back Muscles Quiz: Name This Muscle + the I Love Spaghetti Trick", sub: "Gray's Anatomy (1918), public domain · anatomy flashcards · study tips" }} />
  </>
);
