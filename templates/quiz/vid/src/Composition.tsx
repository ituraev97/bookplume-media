import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C } from "./kit";
import { Grid16, Subs16 } from "./Chrome16";
import { QuizThumb, QuizVideo } from "./Quiz";
import { END } from "./timeline";

export const Video: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Grid16 />
    <QuizVideo />
    <Subs16 />
  </AbsoluteFill>
);

export const MyComposition = () => (
  <>
    <Composition id="Main" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1920} height={1080} />
    <Composition id="Thumb" component={QuizThumb} durationInFrames={1} fps={30} width={1280} height={720} />
  </>
);
