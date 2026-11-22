import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C } from "./kit";
import { ChapterCard, Grid16, Header16, Subs16 } from "./Chrome16";
import { END } from "./timeline";
import { SAlarm, SBreak, SCheat, SControl, SFirst, SIntro, SLock, SQuiz, SWorking } from "./ScenesBreath";
import { HoldTimer } from "./IllusBreath";
import { BreathThumb, ThumbProps } from "./ThumbBreath";

export const Video: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Grid16 />
    <SIntro />
    <SLock />
    <SWorking />
    <SAlarm />
    <SControl />
    <SBreak />
    <SFirst />
    <SCheat />
    <SQuiz />
    <ChapterCard />
    <Header16 />
    <Subs16 />
    <HoldTimer t0={1.9} t1={231.4} />
  </AbsoluteFill>
);

export const MyComposition = () => (
  <>
    <Composition id="Main" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1920} height={1080} />
    <Composition id="Thumb" component={BreathThumb} durationInFrames={1} fps={30} width={1280} height={720} defaultProps={{ v: "A" } as ThumbProps} />
  </>
);
