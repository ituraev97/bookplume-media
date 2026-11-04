import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT } from "./kit";
import { END, Header, Subtitles } from "./Chrome";
import { V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, liveAlpha } from "./Scenes54";
import { BLUE } from "./Circ54";
import { useT } from "./kit";
import { PinStill } from "./Plates";
// Pinterest still: edit defaultProps per video, render with: npx remotion still src/index.ts Pin ../pin.jpg --jpeg-quality 95
const Pin: React.FC<{ src: string; aspect: number; title: string; sub: string }> = (p) => (
  <AbsoluteFill>
    <PinStill {...p} cover={[{ x: 0.935, y: 0.33, w: 0.08, h: 0.125 }]} />
    <div style={{ position: "absolute", left: 0, top: 1100, width: 1000, display: "flex", justifyContent: "center", alignItems: "center", gap: 16, fontFamily: FONT, fontWeight: 800 }}>
      <div style={{ background: BLUE, color: C.paper, fontSize: 40, padding: "10px 22px 14px", borderRadius: 18 }}>
        <span style={{ color: C.banana, fontSize: 54 }}>A</span>rteries
      </div>
      <div style={{ fontSize: 44, color: C.forest }}>go</div>
      <div style={{ background: C.red, color: C.paper, fontSize: 40, padding: "10px 22px 14px", borderRadius: 18 }}>
        <span style={{ color: C.banana, fontSize: 54 }}>A</span>way
      </div>
      <div style={{ fontSize: 44, color: C.forest }}>from the heart</div>
    </div>
  </AbsoluteFill>
);

const Grid: React.FC = () => {
  const t = useT();
  const o = (t * 40) % 54;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <defs>
        <pattern id="grid" width={54} height={54} patternUnits="userSpaceOnUse" patternTransform={`translate(${o} ${o * 0.5})`}>
          <circle cx={27} cy={27} r={2.2} fill={C.matcha} opacity={0.13} />
        </pattern>
      </defs>
      <rect width={1080} height={1920} fill="url(#grid)" />
    </svg>
  );
};
const HeaderBack: React.FC = () => {
  const a = liveAlpha(useT());
  if (a <= 0) return null;
  return <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 462, borderRadius: "0 0 44px 44px", background: C.paper, boxShadow: "0 12px 30px rgba(31,42,20,0.18)", opacity: a }} />;
};

export const Video: React.FC<{ mask?: boolean }> = ({ mask }) => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Grid />
    <V1 />
    <V2 />
    <V3 />
    <V4 />
    <V5 />
    <V6 />
    <V7 />
    <V8 />
    <V9 />
    <V10 />
    <HeaderBack />
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

export const MyComposition = () => (
  <>
    <Composition id="Main" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: false }} />
    <Composition id="Mask" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: true }} />
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ src: "plates/pulm504.png", aspect: 1771 / 1452, title: "Pulmonary vs systemic circulation: the A trick", sub: "Anatomy flashcards · nursing school study tips" }} />
  </>
);
