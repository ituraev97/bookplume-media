import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT } from "./kit";
import { END, Header, Subtitles } from "./Chrome";
import { V1, V2, V3, V4, V5, V6, V7, V8, V9, liveAlpha, BRS, LChip, PCOL } from "./Scenes63";
import { useT } from "./kit";
import { AxillaDiagram } from "./Axilla63";
import { CarouselSlide } from "./Carousel63";

// Pinterest still: npx remotion still src/index.ts Pin ../pin.jpg --jpeg-quality 95
const Pin: React.FC<{ title: string; sub: string }> = ({ title, sub }) => (
  <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 290, background: C.forest }} />
    <div style={{ position: "absolute", left: 60, top: 44, width: 880, color: C.paper, fontWeight: 800, fontSize: 70, lineHeight: 1.04, letterSpacing: -1 }}>{title}</div>
    <div style={{ position: "absolute", left: 40, top: 310, width: 600, height: 600 }}>
      <AxillaDiagram t={10} w={600} ghost={1} lit={{ ST: 0, TA: 0, LT: 0, SS: 0, ACH: 0, PCH: 0, P1: 0, P2: 0, P3: 0, PM: 0 }} parts={0.7} id="pin" />
    </div>
    <div style={{ position: "absolute", left: 660, top: 340, width: 300, color: C.forest, fontWeight: 800, fontSize: 34, lineHeight: 1.1 }}>Pectoralis minor splits it into 3 parts</div>
    <div style={{ position: "absolute", left: 660, top: 470, display: "flex", flexDirection: "column", gap: 12 }}>
      {[1, 2, 3].map((n) => (
        <div key={n} style={{ fontWeight: 800, fontSize: 28, color: C.forest, background: PCOL[n], border: `4px solid ${C.forest}`, borderRadius: 16, padding: "4px 14px 8px", whiteSpace: "nowrap" }}>part {n} → {n} {n === 1 ? "branch" : "branches"}</div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 660, top: 700, width: 300, color: C.matcha, fontWeight: 800, fontSize: 26, lineHeight: 1.2 }}>1st rib → lower border of teres major, then brachial artery</div>
    <div style={{ position: "absolute", left: 60, top: 935, width: 880, display: "flex", flexDirection: "column", gap: 10 }}>
      {BRS.map((r) => (
        <div key={r.b} style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <LChip b={r.b} size={46} />
          <div style={{ fontWeight: 800, fontSize: 34, color: C.forest, whiteSpace: "nowrap" }}>{r.name} <span style={{ color: C.matcha, fontSize: 26 }}>· {r.word.replace(/[,.]/g, "")} · part {r.part}</span></div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 60, top: 1352, color: C.forest, fontWeight: 800, fontSize: 30, whiteSpace: "nowrap" }}>{sub}</div>
    <div style={{ position: "absolute", right: 50, top: 1340, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 34, padding: "8px 22px 12px", borderRadius: 16 }}>bookplume.com</div>
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
    <Composition id="Carousel" component={CarouselSlide} durationInFrames={1} fps={30} width={1080} height={1350} defaultProps={{ n: 1 }} />
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "Axillary Artery Branches Mnemonic: Screw The Lawyer Save A Patient", sub: "Anatomy flashcards · study tips" }} />
  </>
);
