import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT, ramp, useT } from "./kit";
import { END, Header, Subtitles, TT_CHAPTERS, TT_END } from "./Chrome95";
import { TT_WORDS } from "./words95";
import { Burst, Loud, PlateQ } from "./Scenes93";
import { A378, HOOKPIN, P378, TM_MAIN, TM_TT, TT2, V1, V2, V3, V3a, V3b, V3c, V4, V5, V6, V7, VComment, hookStick } from "./Scenes95";
import { Jaw } from "./Jaw95";

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
    <V2 s0={6.0} s1={10.25} four={6.11} close={7.83} open={9.07} />
    <V3a s0={10.25} s1={11.85} ma={10.35} te={10.98} />
    <V3 s0={11.85} s1={14.05} ma={10.35} te={10.98} peel={11.95} mp={12.23} lift={12.99} />
    <V3b s0={14.05} s1={17.1} lp={14.17} fwd={15.17} open={16.32} />
    <V3c s0={17.1} s1={20.15} v3={17.92} tri={19.07} />
    <V4 s0={20.15} s1={24.6} q={20.25} cd={[[22.73, 3], [23.36, 2], [24.0, 1]]} />
    <V5 s0={24.6} s1={26.05} />
    <V6 s0={26.05} s1={27.95} />
    <V7 s0={27.95} s1={END} />
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

/* TikTok cut 15–18 s: hook → reveal → 4 muscles → 3 close / 1 opens → comment card. No brand, no store. */
export const TikTok: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Grid />
    <HookBurst R={TM_TT.reveal} />
    <V1 tm={TM_TT} />
    <TT2 s0={6.0} s1={9.55} ma={6.0} te={7.02} peel={7.5} mp={7.85} lp={8.52} />
    <V2 s0={9.55} s1={13.6} four={9.6} close={9.63} open={10.83} lpHot={12.25} />
    <VComment s0={13.6} s1={TT_END} />
    <Header chapters={TT_CHAPTERS} end={TT_END} brand={false} />
    <Subtitles words={TT_WORDS} />
  </AbsoluteFill>
);

/* Cover 1080x1920 BEAST style: all text in y 280–1640, x 60–1020; no store name (also used on TikTok) */
const Cover: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT }}>
    <Burst w={1080} h={1920} cy={0.5} rot={4} />
    <div style={{ position: "absolute", left: 60, width: 960, top: 300, display: "flex", justifyContent: "center" }}><Loud size={150}>NAME THIS</Loud></div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 470, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "#E5251A", border: "9px solid #111", borderRadius: 22, padding: "2px 30px 14px", transform: "rotate(-2deg)", boxShadow: "0 10px 0 #111" }}><Loud size={130}>MUSCLE?</Loud></div>
    </div>
    <PlateQ src={P378} aspect={A378} x={110} y={700} w={860} h={820} a={0} b={1} from={[0.39, 0.39, 0.4]} to={[0.39, 0.39, 0.4]} still credit="" tilt={-3} loud
      pin={{ ...HOOKPIN, t0: 0, t1: 99, r: 80 }} stickers={hookStick(99)} arrow />
    <div style={{ position: "absolute", left: 760, top: 1420, transform: "rotate(10deg)", background: "#E5251A", border: "8px solid #111", borderRadius: 24, padding: "6px 22px 12px", boxShadow: "0 8px 0 #111" }}><Loud size={78}>3 SEC</Loud></div>
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
    <PlateQ src={P378} aspect={A378} x={90} y={330} w={820} h={760} a={0} b={1} from={[0.39, 0.39, 0.4]} to={[0.39, 0.39, 0.4]} still credit="" tilt={-2} loud
      pin={{ ...HOOKPIN, t0: 0, t1: 99, r: 72 }} stickers={hookStick(99)} arrow />
    <div style={{ position: "absolute", left: 50, width: 900, top: 1150, textAlign: "center", fontWeight: 800, fontSize: 46, color: "#111", lineHeight: 1.2 }}>{title}</div>
    <div style={{ position: "absolute", left: 50, width: 900, top: 1290, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "#111", color: "#FFE04A", fontWeight: 800, fontSize: 40, padding: "10px 30px 14px", borderRadius: 18 }}>Answer + flashcards → bookplume.com</div>
    </div>
    <div style={{ position: "absolute", left: 50, width: 900, top: 1405, textAlign: "center", color: "#111", opacity: 0.75, fontWeight: 700, fontSize: 22 }}>{sub}</div>
  </AbsoluteFill>
);

const Diag: React.FC<{ peel: number }> = ({ peel }) => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Jaw t={30} id="dg" w={1000} lit={{ MA: 0, TE: 0, MP: 0, LP: 0 }} hot={["LP"]} peel={peel} up={1} fwd={1} open={1} />
  </AbsoluteFill>
);

export const MyComposition = () => (
  <>
    <Composition id="Diag" component={Diag} durationInFrames={1} fps={30} width={1000} height={1000} defaultProps={{ peel: 0 }} />
    <Composition id="Main" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: false }} />
    <Composition id="Mask" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: true }} />
    <Composition id="TikTok" component={TikTok} durationInFrames={Math.ceil(TT_END * 30)} fps={30} width={1080} height={1920} />
    <Composition id="Cover" component={Cover} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "Chewing Muscles Quiz: Name This Muscle + Its 3 Partners", sub: "Gray's Anatomy (1918), public domain · anatomy flashcards · study tips" }} />
  </>
);
