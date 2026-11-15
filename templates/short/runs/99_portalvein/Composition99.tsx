import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT, ramp, useT } from "./kit";
import { END, Header, Subtitles, TT_CHAPTERS, TT_END } from "./Chrome99";
import { TT_WORDS } from "./words99";
import { Burst, Loud, PlateQ } from "./Scenes93";
import { V8 as VFollow, VComment } from "./Scenes97";
import { A591, HOOKPIN, P591, TM_MAIN, TM_TT, V1, V2, V3, V4, V5, V6, V7, V8, V9, hookStick } from "./Scenes99";
import { Portal } from "./Portal99";

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
    <V2 s0={4.95} s1={7.35} gut={5.0} liver={5.72} heart={6.79} />
    <V3 s0={7.35} s1={8.85} tok={[7.71, 8.03, 8.28]} />
    <V4 s0={8.85} s1={11.8} spl={9.79} smv={10.33} />
    <V5 s0={11.8} s1={14.65} spl={12.5} imv={13.2} />
    <V6 s0={14.65} s1={18.75} four={14.73} lg={16.2} rg={16.58} cy={17.35} pu={17.78} />
    <V7 s0={18.75} s1={24.1} q={19.64} cd={[[22.27, 3], [22.91, 2], [23.55, 1]]} />
    <V8 s0={24.1} s1={27.35} joins={25.8} />
    <V9 s0={27.35} s1={29.3} />
    <VFollow s0={29.3} s1={END} />
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

/* TikTok cut 15–18 s: hook → reveal → gut→liver→heart → 2 veins build it → comment card. No brand, no store. */
export const TikTok: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Grid />
    <HookBurst R={TM_TT.reveal} />
    <V1 tm={TM_TT} />
    <V2 s0={4.95} s1={8.6} gut={6.21} liver={6.71} heart={7.59} />
    <V4 s0={8.6} s1={13.65} spl={11.56} smv={12.11} panc={10.59} />
    <VComment s0={13.65} s1={TT_END} />
    <Header chapters={TT_CHAPTERS} end={TT_END} brand={false} />
    <Subtitles words={TT_WORDS} />
  </AbsoluteFill>
);

const COVC: [number, number, number] = [0.45, 0.33, 0.6];

/* Cover 1080x1920 BEAST style: all text in y 280–1640, x 60–1020; no store name (also used on TikTok) */
const Cover: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT }}>
    <Burst w={1080} h={1920} cy={0.5} rot={4} />
    <div style={{ position: "absolute", left: 60, width: 960, top: 300, display: "flex", justifyContent: "center" }}><Loud size={150}>NAME THIS</Loud></div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 470, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "#E5251A", border: "9px solid #111", borderRadius: 22, padding: "2px 34px 14px", transform: "rotate(-2deg)", boxShadow: "0 10px 0 #111" }}><Loud size={130}>VEIN?</Loud></div>
    </div>
    <PlateQ src={P591} aspect={A591} x={140} y={690} w={800} h={860} a={0} b={1} from={COVC} to={COVC} still credit="" tilt={-3} loud
      pin={{ ...HOOKPIN, t0: 0, t1: 99, r: 80 }} arrow stickers={[hookStick(99)]} />
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
    <PlateQ src={P591} aspect={A591} x={120} y={330} w={760} h={780} a={0} b={1} from={COVC} to={COVC} still credit="" tilt={-2} loud
      pin={{ ...HOOKPIN, t0: 0, t1: 99, r: 76 }} arrow stickers={[hookStick(99)]} />
    <div style={{ position: "absolute", left: 50, width: 900, top: 1160, textAlign: "center", fontWeight: 800, fontSize: 46, color: "#111", lineHeight: 1.2 }}>{title}</div>
    <div style={{ position: "absolute", left: 50, width: 900, top: 1300, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "#111", color: "#FFE04A", fontWeight: 800, fontSize: 40, padding: "10px 30px 14px", borderRadius: 18 }}>Answer + flashcards → bookplume.com</div>
    </div>
    <div style={{ position: "absolute", left: 50, width: 900, top: 1410, textAlign: "center", color: "#111", opacity: 0.75, fontWeight: 700, fontSize: 22 }}>{sub}</div>
  </AbsoluteFill>
);

const Diag: React.FC<{ mode: number }> = ({ mode }) => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Portal t={30} id="dg" w={1000} lit={{ PV: 0, SPL: 0, SMV: 0, IMV: 0, LG: 0, RG: 0, CY: 0, PU: 0 }} showIVC={1} hot={mode === 1 ? ["IMV"] : []} liver={mode === 2 ? 0 : -1} />
  </AbsoluteFill>
);

export const MyComposition = () => (
  <>
    <Composition id="Diag" component={Diag} durationInFrames={1} fps={30} width={1000} height={1000} defaultProps={{ mode: 0 }} />
    <Composition id="Main" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: false }} />
    <Composition id="Mask" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: true }} />
    <Composition id="TikTok" component={TikTok} durationInFrames={Math.ceil(TT_END * 30)} fps={30} width={1080} height={1920} />
    <Composition id="Cover" component={Cover} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "Hepatic Portal Vein Quiz: Name This Vein + Its 7 Tributaries (2-1-4 Trick)", sub: "Gray's Anatomy (1918), public domain · anatomy flashcards · study tips" }} />
  </>
);
