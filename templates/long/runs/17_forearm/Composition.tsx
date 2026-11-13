import React from "react";
import { AbsoluteFill, Composition, Img, staticFile } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT } from "./kit";
import { ChapterCard, Grid16, Header16, Subs16, LogoMark } from "./Chrome16";
import { END } from "./timeline";
import { SIntro, SBig, SSupFlex, SDeepFlex, SSupExt, SDeepExt, SNerve, STricks, SQuiz, SRecap } from "./ScenesFA";

export const Video: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Grid16 />
    <SIntro />
    <SBig />
    <SSupFlex />
    <SDeepFlex />
    <SSupExt />
    <SDeepExt />
    <SNerve />
    <STricks />
    <SQuiz />
    <SRecap />
    <ChapterCard />
    <Header16 />
    <Subs16 />
  </AbsoluteFill>
);

const Logo: React.FC<{ sub: string; color?: string }> = ({ sub, color = C.forest }) => (
  <div style={{ position: "absolute", left: 54, bottom: 46, display: "flex", alignItems: "center", gap: 18 }}>
    <div style={{ width: 76, height: 76, borderRadius: 38, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 4px ${C.banana}` }}>
      <LogoMark size={56} />
    </div>
    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 42, color }}>{sub}</div>
  </div>
);
/* A: research-backed — exact keyword in huge words + one striking colour plate + a number */
export const Thumb: React.FC = () => (
  <AbsoluteFill style={{ background: C.banana }}>
    <div style={{ position: "absolute", right: 36, top: 36, width: 470, height: 648, borderRadius: 40, overflow: "hidden", background: C.paper, boxShadow: `0 0 0 8px ${C.forest}` }}>
      <Img src={staticFile("plates/bsup418.png")} style={{ position: "absolute", left: -95, top: -20, width: 640 }} />
    </div>
    <div style={{ position: "absolute", left: 50, top: 40, width: 760, fontFamily: FONT, fontWeight: 800, color: C.forest, letterSpacing: -4 }}>
      <div style={{ fontSize: 142, lineHeight: 0.95, whiteSpace: "nowrap" }}>FOREARM</div>
      <div style={{ fontSize: 142, lineHeight: 0.95, whiteSpace: "nowrap" }}>MUSCLES</div>
      <div style={{ marginTop: 26, fontSize: 84, lineHeight: 1, background: C.forest, color: C.banana, padding: "8px 26px 16px", borderRadius: 22, width: "fit-content", letterSpacing: -2 }}>MADE EASY</div>
    </div>
    <div style={{ position: "absolute", left: 590, top: 440, width: 150, height: 150, borderRadius: 75, background: C.red, color: C.paper, fontFamily: FONT, fontWeight: 800, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: "rotate(-8deg)", boxShadow: `0 0 0 6px ${C.forest}` }}>
      <div style={{ fontSize: 76, lineHeight: 0.9 }}>20</div>
      <div style={{ fontSize: 24 }}>muscles</div>
    </div>
    <Logo sub="+ 3 memory tricks" />
  </AbsoluteFill>
);
/* B: the outlier's "A vs B" split — front vs back */
export const ThumbB: React.FC = () => (
  <AbsoluteFill style={{ background: C.banana }}>
    {[["plates/fsup414.png", 620, -40, 30, 470, C.red], ["plates/bsup418.png", 950, -150, 0, 560, NC_RAD]].map(([src, x, l, tp, w, col], i) => (
      <div key={i} style={{ position: "absolute", left: x as number, top: 36, width: 290, height: 648, borderRadius: 32, overflow: "hidden", background: C.paper, boxShadow: `0 0 0 8px ${col}` }}>
        <Img src={staticFile(src as string)} style={{ position: "absolute", left: l as number, top: tp as number, width: w as number }} />
      </div>
    ))}
    <div style={{ position: "absolute", left: 50, top: 50, width: 600, fontFamily: FONT, fontWeight: 800, letterSpacing: -4 }}>
      <div style={{ fontSize: 118, lineHeight: 0.95, color: C.red }}>FLEXORS</div>
      <div style={{ fontSize: 96, lineHeight: 1.0, color: C.forest, margin: "6px 0 8px 6px" }}>vs</div>
      <div style={{ fontSize: 90, lineHeight: 0.95, color: "#5B3F94", letterSpacing: -3 }}>EXTENSORS</div>
    </div>
    <div style={{ position: "absolute", left: 865, top: 290, width: 140, height: 140, borderRadius: 70, background: C.forest, color: C.banana, fontFamily: FONT, fontWeight: 800, fontSize: 64, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 0 6px ${C.banana}` }}>VS</div>
    <Logo sub="forearm muscles" />
  </AbsoluteFill>
);
const NC_RAD = "#9B7FD1";

export const MyComposition = () => (
  <>
    <Composition id="Main" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1920} height={1080} />
    <Composition id="Thumb" component={Thumb} durationInFrames={1} fps={30} width={1280} height={720} />
    <Composition id="ThumbB" component={ThumbB} durationInFrames={1} fps={30} width={1280} height={720} />
  </>
);
