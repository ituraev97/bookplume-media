import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT, ramp, useT } from "./kit";
import { END, Header, Subtitles, TT_CHAPTERS, TT_END } from "./Chrome97";
import { TT_WORDS } from "./words97";
import { Burst, Loud, PlateQ } from "./Scenes93";
import { A418, HOOKPIN, P418, TM_MAIN, TM_TT, TTLift, V1, V3, V3b, V4, V4b, V5, V6, V7, V8, VComment, VTrick } from "./Scenes97";
import { Snuff } from "./Snuff97";

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
    <VTrick s0={5.15} s1={6.6} tok={[5.41, 5.66, 5.86, 6.12]} grp={[5.41, 5.66, 5.86, 6.12]} />
    <V3 s0={6.6} s1={11.85} two={6.69} apl={8.52} epb={10.17} />
    <V3b s0={11.85} s1={15.3} one={11.89} epl={13.55} />
    <V4 s0={15.3} s1={18.15} two={15.4} sca={16.75} tra={17.44} />
    <V4b s0={18.15} s1={19.75} ra={18.49} />
    <V5 s0={19.75} s1={24.0} q={20.57} cd={[[22.16, 3], [22.79, 2], [23.44, 1]]} />
    <V6 s0={24.0} s1={26.75} ra={24.17} pulse={25.93} />
    <V7 s0={26.75} s1={28.75} />
    <V8 s0={28.75} s1={END} />
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

/* TikTok cut 15–18 s: hook → reveal → lift your thumb → 2-1-2-1 → radial artery pulse → comment card. No brand, no store. */
export const TikTok: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Grid />
    <HookBurst R={TM_TT.reveal} />
    <V1 tm={TM_TT} />
    <TTLift s0={5.05} s1={6.72} lift={5.14} up={6.07} />
    <VTrick s0={6.72} s1={10.9} tok={[6.97, 7.22, 7.42, 7.68]} grp={[8.2, 8.83, 9.47, 10.12]} />
    <V6 s0={10.9} s1={14.05} ra={11.84} pulse={13.22} head="That artery: RADIAL" />
    <VComment s0={14.05} s1={TT_END} />
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
      <div style={{ background: "#E5251A", border: "9px solid #111", borderRadius: 22, padding: "2px 34px 14px", transform: "rotate(-2deg)", boxShadow: "0 10px 0 #111" }}><Loud size={130}>HOLLOW?</Loud></div>
    </div>
    <PlateQ src={P418} aspect={A418} x={140} y={690} w={800} h={860} a={0} b={1} from={[0.46, 0.42, 0.86]} to={[0.46, 0.42, 0.86]} still credit="" tilt={-3} loud
      pin={{ ...HOOKPIN, t0: 0, t1: 99, r: 86 }} arrow />
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
    <PlateQ src={P418} aspect={A418} x={120} y={330} w={760} h={780} a={0} b={1} from={[0.46, 0.42, 0.86]} to={[0.46, 0.42, 0.86]} still credit="" tilt={-2} loud
      pin={{ ...HOOKPIN, t0: 0, t1: 99, r: 76 }} arrow />
    <div style={{ position: "absolute", left: 50, width: 900, top: 1160, textAlign: "center", fontWeight: 800, fontSize: 46, color: "#111", lineHeight: 1.2 }}>{title}</div>
    <div style={{ position: "absolute", left: 50, width: 900, top: 1300, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "#111", color: "#FFE04A", fontWeight: 800, fontSize: 40, padding: "10px 30px 14px", borderRadius: 18 }}>Answer + flashcards → bookplume.com</div>
    </div>
    <div style={{ position: "absolute", left: 50, width: 900, top: 1410, textAlign: "center", color: "#111", opacity: 0.75, fontWeight: 700, fontSize: 22 }}>{sub}</div>
  </AbsoluteFill>
);

const Diag: React.FC<{ ang: number; all: number }> = ({ ang, all }) => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Snuff t={30} id="dg" w={1000} ang={ang} lit={all ? { APL: 0, EPB: 0, EPL: 0, SCA: 0, TRA: 0, RA: 0 } : {}} hot={all ? ["RA"] : []} box={all} />
  </AbsoluteFill>
);

export const MyComposition = () => (
  <>
    <Composition id="Diag" component={Diag} durationInFrames={1} fps={30} width={1000} height={1000} defaultProps={{ ang: 40, all: 1 }} />
    <Composition id="Main" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: false }} />
    <Composition id="Mask" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: true }} />
    <Composition id="TikTok" component={TikTok} durationInFrames={Math.ceil(TT_END * 30)} fps={30} width={1080} height={1920} />
    <Composition id="Cover" component={Cover} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "Anatomy Quiz: Name This Hollow at the Thumb (2-1-2-1 Trick)", sub: "Gray's Anatomy (1918), public domain · anatomy flashcards · study tips" }} />
  </>
);
