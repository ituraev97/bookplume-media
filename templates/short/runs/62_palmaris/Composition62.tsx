import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT } from "./kit";
import { END, Header, Subtitles } from "./Chrome";
import { V1, V2, V3, V4, V5, V6, V7, V8, liveAlpha, FChip } from "./Scenes62";
import { useT } from "./kit";
import { FINGER, ForearmDiagram, MCOL, MNAME, MUS } from "./Forearm62";

// Pinterest still: npx remotion still src/index.ts Pin ../pin.jpg --jpeg-quality 95
const Pin: React.FC<{ title: string; sub: string }> = ({ title, sub }) => (
  <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 300, background: C.forest }} />
    <div style={{ position: "absolute", left: 60, top: 44, width: 880, color: C.paper, fontWeight: 800, fontSize: 72, lineHeight: 1.04, letterSpacing: -1 }}>{title}</div>
    <div style={{ position: "absolute", left: 30, top: 330, width: 520, height: 650 }}>
      <ForearmDiagram t={10} w={520} lit={{ PT: 0, FCR: 0, PL: 0, FDS: 0, FCU: 0 }} id="pin" />
    </div>
    <div style={{ position: "absolute", left: 560, top: 360, color: C.forest, fontWeight: 800, fontSize: 34, lineHeight: 1.1 }}>The hand trick</div>
    <div style={{ position: "absolute", left: 560, top: 420, display: "flex", flexDirection: "column", gap: 20 }}>
      {MUS.map((m) => <FChip key={m} m={m} size={30} />)}
    </div>
    <div style={{ position: "absolute", left: 560, top: 840, width: 400, color: C.matcha, fontWeight: 800, fontSize: 26, lineHeight: 1.2 }}>Palm heel on the medial epicondyle, fingers down the forearm</div>
    <div style={{ position: "absolute", left: 60, top: 1010, width: 880, display: "flex", flexDirection: "column", gap: 10 }}>
      {MUS.map((m) => (
        <div key={m} style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, background: MCOL[m], border: `3px solid ${C.forest}` }} />
          <div style={{ fontWeight: 800, fontSize: 34, color: C.forest }}>{MNAME[m]} <span style={{ color: C.matcha, fontSize: 26 }}>· {FINGER[m].toLowerCase()}</span></div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 60, top: 1310, width: 880, color: C.forest, fontWeight: 700, fontSize: 26, lineHeight: 1.25 }}>Test: thumb to pinky + flex the wrist. A cord in the middle of the wrist = palmaris longus (absent in ~15% of people).</div>
    <div style={{ position: "absolute", left: 60, top: 1408, color: C.forest, fontWeight: 800, fontSize: 28, whiteSpace: "nowrap" }}>{sub}</div>
    <div style={{ position: "absolute", right: 50, top: 1396, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 34, padding: "8px 22px 12px", borderRadius: 16 }}>bookplume.com</div>
    <div style={{ position: "absolute", right: 40, bottom: 10, color: C.forest, opacity: 0.5, fontWeight: 700, fontSize: 18 }}>Diagram: Book Plume</div>
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
  return <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 462, background: C.paper, opacity: a }} />;
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
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "Do You Have This Muscle? Palmaris Longus Test", sub: "Anatomy flashcards · study tips" }} />
  </>
);
