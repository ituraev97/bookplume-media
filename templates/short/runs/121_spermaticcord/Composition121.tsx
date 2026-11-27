import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT, useT } from "./kit";
import { END, Header, Subtitles } from "./Chrome121";
import { Burst, Loud } from "./Scenes93";
import { Chip, Diagram, END_CLEAN, END_TRIAL, IDS, PdfSticker, V1, V2, V3, V4, V5, V6, V7, V7T } from "./Scenes121";

const Dots: React.FC<{ w: number; h: number; o?: number }> = ({ w, h, o = 0 }) => (
  <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0 }}>
    <defs>
      <pattern id={`grid${w}`} width={54} height={54} patternUnits="userSpaceOnUse" patternTransform={`translate(${o} ${o * 0.5})`}>
        <circle cx={27} cy={27} r={2.2} fill={C.matcha} opacity={0.13} />
      </pattern>
    </defs>
    <rect width={w} height={h} fill={`url(#grid${w})`} />
  </svg>
);

/* Cover 1080x1920 BEAST style: all text in y 280–1640, x 60–1020; no store name */
const Cover: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT }}>
    <Burst w={1080} h={1920} cy={0.5} rot={4} />
    <div style={{ position: "absolute", left: 60, width: 960, top: 300, display: "flex", justifyContent: "center" }}><Loud size={170}>NAME ALL 8</Loud></div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 490, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "#E5251A", border: "9px solid #111", borderRadius: 22, padding: "2px 34px 14px", transform: "rotate(-2deg)", boxShadow: "0 10px 0 #111" }}><Loud size={74}>SPERMATIC CORD?</Loud></div>
    </div>
    <div style={{ position: "absolute", left: 110, top: 720, width: 860, height: 792, overflow: "hidden", borderRadius: 36, border: "10px solid #111", boxShadow: "0 0 0 6px #fff, 0 14px 0 #111", transform: "rotate(-3deg)", background: "#F7F6EC" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 840, height: 774, filter: "saturate(1.5)" }}>
        <Diagram w={840} h={774} id={null} plain />
        <div style={{ position: "absolute", left: 420 - 150, top: 204 - 150, width: 300, height: 300, border: "16px solid #E5251A", borderRadius: "50%", boxShadow: "0 0 0 5px #fff, inset 0 0 0 5px #fff" }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 1545, display: "flex", justifyContent: "center", gap: 10, alignItems: "center" }}>
      {IDS.map((id) => <React.Fragment key={id}><Chip id={id} size={104} /></React.Fragment>)}
    </div>
  </AbsoluteFill>
);

const Grid: React.FC = () => {
  const t = useT();
  return <Dots w={1080} h={1920} o={(t * 40) % 54} />;
};

export const Video: React.FC<{ mask?: boolean; variant?: "clean" | "reel" | "trial" }> = ({ mask, variant = "clean" }) => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Grid />
    <V1 />
    <V2 />
    <V3 />
    <V4 />
    <V5 />
    <V6 />
    {variant === "trial" ? <V7T /> : <V7 />}
    <Header />
    <Subtitles />
    {variant !== "clean" && <PdfSticker t0={13.0} text="10 more like this in the free PDF" />}
    {mask && (
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <rect x={0} y={0} width={1080} height={270} fill="red" opacity={0.3} />
        <rect x={940} y={700} width={140} height={1000} fill="red" opacity={0.3} />
        <rect x={0} y={1536} width={1080} height={384} fill="red" opacity={0.3} />
        <rect x={70} y={540} width={860} height={940} fill="none" stroke="blue" strokeWidth={3} />
      </svg>
    )}
  </AbsoluteFill>
);

export const MyComposition = () => (
  <>
    <Composition id="Main" component={Video} durationInFrames={Math.ceil(END_CLEAN * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: false, variant: "clean" as const }} />
        <Composition id="Trial" component={Video} durationInFrames={Math.ceil(END_TRIAL * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: false, variant: "trial" as const }} />
    <Composition id="Mask" component={Video} durationInFrames={Math.ceil(END_CLEAN * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: true, variant: "trial" as const }} />
    <Composition id="Cover" component={Cover} durationInFrames={1} fps={30} width={1080} height={1920} />
  </>
);
