import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C } from "./kit";
import { END, Header, Subtitles } from "./Chrome";
import { V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12, liveAlpha } from "./Scenes49";
import { useT } from "./kit";
import { PinStill } from "./Plates";
// Pinterest still: edit defaultProps per video, render with: npx remotion still src/index.ts Pin ../pin.jpg --jpeg-quality 95
import { FONT } from "./kit";
import { LCOL } from "./Lungs49";
const Pin: React.FC<{ src: string; aspect: number; title: string; sub: string }> = (p) => (
  <AbsoluteFill>
    <PinStill {...p} />
    {[{ x: 150, L: "R", n: "3 lobes", c: LCOL.rm }, { x: 850, L: "L", n: "2 lobes", c: LCOL.rs }].map((m) => (
      <div key={m.L} style={{ position: "absolute", left: m.x - 90, top: 400, width: 180, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: FONT }}>
        <div style={{ width: 96, height: 96, borderRadius: 48, background: m.c, border: `6px solid ${C.forest}`, color: C.forest, fontWeight: 800, fontSize: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>{m.L}</div>
        <div style={{ marginTop: 8, background: C.forest, color: C.paper, fontWeight: 800, fontSize: 32, padding: "4px 16px 7px", borderRadius: 14, whiteSpace: "nowrap" }}>{m.n}</div>
      </div>
    ))}
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
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ src: "plates/lungs.png", aspect: 1694 / 1657, title: "Right lung: 3 lobes\nLeft lung: 2 lobes", sub: "Cardiac notch + lingula = left lung · study tip" }} />
  </>
);
