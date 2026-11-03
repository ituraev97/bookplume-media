import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C } from "./kit";
import { END, Header, Subtitles } from "./Chrome";
import { V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12, liveAlpha } from "./ScenesBP";
import { useT } from "./kit";
import { PinStill } from "./Plates";
// Pinterest still: edit defaultProps per video, render with: npx remotion still src/index.ts Pin ../pin.jpg --jpeg-quality 95
import { PARTS } from "./PlexusBP";
import { FONT } from "./kit";
const Pin: React.FC<{ src: string; aspect: number; title: string; sub: string }> = (p) => (
  <AbsoluteFill>
    <PinStill {...p} cover={[{ x: 0, y: 0, w: 0.16, h: 0.025 }]} />
    <div style={{ position: "absolute", left: 50, top: 1100, width: 900, display: "flex", gap: 12, fontFamily: FONT }}>
      {PARTS.map((x) => (
        <div key={x.id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", background: C.forest, borderRadius: 18, padding: "10px 4px 12px" }}>
          <div style={{ width: 58, height: 58, borderRadius: 29, background: x.color, color: C.forest, fontWeight: 800, fontSize: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>{x.letter}</div>
          <div style={{ color: C.paper, fontWeight: 800, fontSize: 24, marginTop: 6 }}>{x.word}</div>
          <div style={{ color: C.banana, fontWeight: 800, fontSize: 30, lineHeight: 1 }}>{x.n}</div>
        </div>
      ))}
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
    <V11 />
    <V12 />
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
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ src: "plates/plan.png", aspect: 2065 / 1713, title: "Brachial plexus in 1 sentence", sub: "Randy Travis Drinks Cold Beer · 5-3-6-3-5" }} />
  </>
);
