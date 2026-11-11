import React from "react";
import { AbsoluteFill, Composition, Img, staticFile } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT } from "./kit";
import { ChapterCard, Grid16, Header16, Subs16, LogoMark } from "./Chrome16";
import { END } from "./timeline";
import { SIntro, SBig, SThenar, SHypo, SLum, SInter, SNerve, STricks, SQuiz, SRecap } from "./ScenesHM";

export const Video: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Grid16 />
    <SIntro />
    <SBig />
    <SThenar />
    <SHypo />
    <SLum />
    <SInter />
    <SNerve />
    <STricks />
    <SQuiz />
    <SRecap />
    <ChapterCard />
    <Header16 />
    <Subs16 />
  </AbsoluteFill>
);

const ThumbBase: React.FC<{ art: React.ReactNode; lines: [string, number][]; tag: string; sub: string; tagCol?: string }> = ({ art, lines, tag, sub, tagCol = C.forest }) => (
  <AbsoluteFill style={{ background: C.banana }}>
    <div style={{ position: "absolute", right: 36, top: 36, width: 470, height: 648, borderRadius: 40, overflow: "hidden", background: C.paper, boxShadow: `0 0 0 8px ${C.forest}` }}>{art}</div>
    <div style={{ position: "absolute", left: 50, top: 44, width: 740, fontFamily: FONT, fontWeight: 800, color: C.forest, letterSpacing: -4 }}>
      {lines.map(([x, s]) => <div key={x} style={{ fontSize: s, lineHeight: 0.95, whiteSpace: "nowrap" }}>{x}</div>)}
      <div style={{ marginTop: 24, fontSize: 80, lineHeight: 1, background: tagCol, color: C.banana, padding: "8px 24px 16px", borderRadius: 22, width: "fit-content", letterSpacing: -2 }}>{tag}</div>
    </div>
    <div style={{ position: "absolute", left: 54, bottom: 46, display: "flex", alignItems: "center", gap: 18 }}>
      <div style={{ width: 76, height: 76, borderRadius: 38, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LogoMark size={56} />
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.forest }}>{sub}</div>
    </div>
  </AbsoluteFill>
);
export const Thumb: React.FC = () => (
  <ThumbBase art={<Img src={staticFile("plates/palm427.png")} style={{ position: "absolute", left: -60, top: -30, width: 600 }} />}
    lines={[["19 HAND", 150], ["MUSCLES", 150]]} tag="MADE EASY" sub="+ 3 memory tricks" />
);
export const ThumbB: React.FC = () => (
  <ThumbBase art={<Img src={staticFile("plates/nerves815.png")} style={{ position: "absolute", left: -380, top: -330, width: 1250 }} />}
    lines={[["WHICH", 172], ["NERVE?", 172]]} tag="HAND MUSCLES" tagCol={C.red} sub="the trick exams love" />
);

export const MyComposition = () => (
  <>
    <Composition id="Main" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1920} height={1080} />
    <Composition id="Thumb" component={Thumb} durationInFrames={1} fps={30} width={1280} height={720} />
    <Composition id="ThumbB" component={ThumbB} durationInFrames={1} fps={30} width={1280} height={720} />
  </>
);
