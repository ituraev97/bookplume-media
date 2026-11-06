import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT } from "./kit";
import { ChapterCard, Grid16, Header16, Subs16, LogoMark } from "./Chrome16";
import { END } from "./timeline";
import { SIntro, SBig, SLumbar, SBigTwo, SSacral, SSciatic, SConnect, STricks, SQuiz, SRecap } from "./ScenesLS";
import { Img, staticFile } from "remotion";

export const Video: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Grid16 />
    <SIntro />
    <SBig />
    <SLumbar />
    <SBigTwo />
    <SSacral />
    <SSciatic />
    <SConnect />
    <STricks />
    <SQuiz />
    <SRecap />
    <ChapterCard />
    <Header16 />
    <Subs16 />
  </AbsoluteFill>
);

const ThumbBase: React.FC<{ plate: string; pw: number; px: number; py: number; lines: [string, number][]; tag: string; sub: string }> = ({ plate, pw, px, py, lines, tag, sub }) => (
  <AbsoluteFill style={{ background: C.banana }}>
    <div style={{ position: "absolute", right: 36, top: 36, width: 470, height: 648, borderRadius: 40, overflow: "hidden", background: C.paper, boxShadow: `0 0 0 8px ${C.forest}` }}>
      <Img src={staticFile(plate)} style={{ position: "absolute", left: px, top: py, width: pw }} />
    </div>
    <div style={{ position: "absolute", left: 50, top: 50, width: 740, fontFamily: FONT, fontWeight: 800, color: C.forest, letterSpacing: -4 }}>
      {lines.map(([x, s]) => <div key={x} style={{ fontSize: s, lineHeight: 0.95 }}>{x}</div>)}
      <div style={{ marginTop: 24, fontSize: 80, lineHeight: 1, background: C.forest, color: C.banana, padding: "8px 24px 16px", borderRadius: 22, width: "fit-content", letterSpacing: -2 }}>{tag}</div>
    </div>
    <div style={{ position: "absolute", left: 54, bottom: 46, display: "flex", alignItems: "center", gap: 18 }}>
      <div style={{ width: 76, height: 76, borderRadius: 38, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LogoMark size={56} />
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.forest }}>{sub}</div>
    </div>
  </AbsoluteFill>
);
export const Thumb: React.FC = () => <ThumbBase plate="plates/lplan822.png" pw={760} px={-200} py={-20} lines={[["LUMBAR +", 118], ["SACRAL", 150], ["PLEXUS", 150]]} tag="MADE EASY" sub="in 10 minutes" />;
export const ThumbB: React.FC = () => <ThumbBase plate="plates/post832.png" pw={1150} px={-400} py={-240} lines={[["LEG", 190], ["NERVES", 150]]} tag="MADE EASY" sub="lumbar + sacral plexus" />;

export const MyComposition = () => (
  <>
    <Composition id="Main" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1920} height={1080} />
    <Composition id="Thumb" component={Thumb} durationInFrames={1} fps={30} width={1280} height={720} />
    <Composition id="ThumbB" component={ThumbB} durationInFrames={1} fps={30} width={1280} height={720} />
  </>
);
