import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT } from "./kit";
import { END, Header, Subtitles } from "./Chrome";
import { V1, V2, V3, V5, V6, V7, V8, V9, liveAlpha, LChip } from "./Scenes61";
import { useT } from "./kit";
import { BNAME, BONES, BWORD, OrbitDiagram } from "./Orbit61";

const WALLS: Record<string, string> = { MAX: "floor + medial rim", FRO: "roof", ZYG: "lateral wall + floor", ETH: "medial wall (thinnest)", LAC: "medial wall, tear sac", SPH: "lateral wall, roof, apex", PAL: "floor, at the back" };

// Pinterest still: npx remotion still src/index.ts Pin ../pin.jpg --jpeg-quality 95
const Pin: React.FC<{ title: string; sub: string }> = ({ title, sub }) => (
  <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 300, background: C.forest }} />
    <div style={{ position: "absolute", left: 60, top: 46, width: 880, color: C.paper, fontWeight: 800, fontSize: 74, lineHeight: 1.04, letterSpacing: -1 }}>{title}</div>
    <div style={{ position: "absolute", left: 150, top: 350, width: 700, height: 630 }}>
      <OrbitDiagram t={10} w={700} lit={{ FRO: 0, SPB: 0, SGW: 0, SLW: 0, ZYG: 0, MAX: 0, ETH: 0, LAC: 0, PAL: 0 }} id="pin" />
    </div>
    <div style={{ position: "absolute", left: 60, top: 1010, width: 880, display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: 14, columnGap: 20 }}>
      {BONES.map((b) => (
        <div key={b} style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <LChip b={b} size={30} />
          <div style={{ lineHeight: 1.05 }}>
            <div style={{ fontWeight: 800, fontSize: 32, color: C.forest }}>{BNAME[b]} <span style={{ color: C.matcha, fontSize: 24 }}>· {BWORD[b]}</span></div>
            <div style={{ fontWeight: 700, fontSize: 21, color: C.matcha }}>{WALLS[b]}</div>
          </div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 60, top: 1400, color: C.forest, fontWeight: 800, fontSize: 28, whiteSpace: "nowrap" }}>{sub}</div>
    <div style={{ position: "absolute", right: 50, top: 1388, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 34, padding: "8px 22px 12px", borderRadius: 16 }}>bookplume.com</div>
    <div style={{ position: "absolute", right: 40, bottom: 14, color: C.forest, opacity: 0.5, fontWeight: 700, fontSize: 18 }}>Diagram: Book Plume</div>
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
    <V5 />
    <V6 />
    <V7 />
    <V8 />
    <V9 />
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
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "7 Bones of the Orbit: Easy Mnemonic", sub: "Anatomy flashcards · study tips" }} />
  </>
);
