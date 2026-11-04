import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT } from "./kit";
import { ChapterCard, Grid16, Header16, Subs16, LogoMark } from "./Chrome16";
import { END } from "./timeline";
import { SIntro, SBig, SOuter, SMiddle, SInner, SCochlea, SBalance, STricks, SQuiz, SRecap } from "./ScenesEar";
import { Img, staticFile } from "remotion";

export const Video: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Grid16 />
    <SIntro />
    <SBig />
    <SOuter />
    <SMiddle />
    <SInner />
    <SCochlea />
    <SBalance />
    <STricks />
    <SQuiz />
    <SRecap />
    <ChapterCard />
    <Header16 />
    <Subs16 />
  </AbsoluteFill>
);

export const Thumb: React.FC = () => (
  <AbsoluteFill style={{ background: C.banana }}>
    <div style={{ position: "absolute", right: 30, top: 40, width: 510, height: 640, borderRadius: 40, overflow: "hidden", background: C.paper, boxShadow: `0 0 0 8px ${C.forest}` }}>
      <Img src={staticFile("plates/ear907.png")} style={{ position: "absolute", left: -40, top: 30, width: 660 }} />
    </div>
    <div style={{ position: "absolute", left: 56, top: 70, width: 640, fontFamily: FONT, fontWeight: 800, color: C.forest, letterSpacing: -4 }}>
      <div style={{ fontSize: 200, lineHeight: 0.9 }}>EAR</div>
      <div style={{ fontSize: 112, lineHeight: 0.95 }}>ANATOMY</div>
      <div style={{ marginTop: 22, fontSize: 84, lineHeight: 1, background: C.forest, color: C.banana, padding: "8px 24px 16px", borderRadius: 22, width: "fit-content", letterSpacing: -2 }}>MADE EASY</div>
    </div>
    <div style={{ position: "absolute", left: 60, bottom: 46, display: "flex", alignItems: "center", gap: 18 }}>
      <div style={{ width: 76, height: 76, borderRadius: 38, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LogoMark size={56} />
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.forest }}>in 10 minutes</div>
    </div>
  </AbsoluteFill>
);

export const MyComposition = () => (
  <>
    <Composition id="Main" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1920} height={1080} />
    <Composition id="Thumb" component={Thumb} durationInFrames={1} fps={30} width={1280} height={720} />
  </>
);
