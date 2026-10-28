import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT } from "./kit";
import { ChapterCard, Grid16, Header16, Subs16, LogoMark } from "./Chrome16";
import { END } from "./timeline";
import { SCulprit, SDoctor, SFight, SGettingIn, SHelps, SIntro, SPeak, SSilent, SWinter } from "./ScenesCold";
import { HeadProfile, Virus } from "./IllusCold";

export const Video: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Grid16 />
    <SIntro />
    <SCulprit />
    <SGettingIn />
    <SSilent />
    <SFight />
    <SPeak />
    <SWinter />
    <SHelps />
    <SDoctor />
    <ChapterCard />
    <Header16 />
    <Subs16 />
  </AbsoluteFill>
);

export const Thumb: React.FC = () => (
  <AbsoluteFill style={{ background: C.banana }}>
    <div style={{ position: "absolute", right: -80, bottom: -60 }}>
      <HeadProfile w={760} t={0.6} p={0.55} red={1} />
    </div>
    <div style={{ position: "absolute", left: 50, top: 60, width: 760, fontFamily: FONT, fontWeight: 800, fontSize: 96, lineHeight: 0.98, color: C.forest, letterSpacing: -3 }}>
      WHAT HAPPENS WHEN YOU
      <span style={{ display: "block", marginTop: 14, background: C.forest, color: C.paper, padding: "4px 18px", borderRadius: 16, width: "fit-content" }}>CATCH A COLD</span>
    </div>
    <div style={{ position: "absolute", left: 60, bottom: 50, display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 70, height: 70, borderRadius: 35, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LogoMark size={52} />
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest }}>day by day</div>
    </div>
    <div style={{ position: "absolute", left: 1000, top: 40 }}>
      <Virus size={170} t={0.3} />
    </div>
  </AbsoluteFill>
);

export const MyComposition = () => (
  <>
    <Composition id="Main" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1920} height={1080} />
    <Composition id="Thumb" component={Thumb} durationInFrames={1} fps={30} width={1280} height={720} />
  </>
);
