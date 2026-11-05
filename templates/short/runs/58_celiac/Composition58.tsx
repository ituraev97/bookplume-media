import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT } from "./kit";
import { END, Header, Subtitles } from "./Chrome";
import { V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, liveAlpha, LORDER, LART, LWORD, Letter } from "./Scenes58";
import { useT } from "./kit";
import { CeliacDiagram } from "./Celiac58";
// Pinterest still: npx remotion still src/index.ts Pin ../pin.jpg --jpeg-quality 95
const Pin: React.FC<{ title: string; sub: string }> = ({ title, sub }) => {
  const where: Record<string, string> = { L: "smallest · lesser curvature of the stomach", H: "heads right · liver + gallbladder", S: "biggest · wiggles along the pancreas → spleen" };
  return (
    <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 300, background: C.forest }} />
      <div style={{ position: "absolute", left: 60, top: 46, width: 880, color: C.paper, fontWeight: 800, fontSize: 74, lineHeight: 1.05, letterSpacing: -1 }}>{title}</div>
      <div style={{ position: "absolute", left: 180, top: 326 }}>
        <CeliacDiagram t={10} w={640} lit={{ CT: 0, LG: 0, CH: 0, SP: 0, AO: 0, STO: 0, LIV: 0, GB: 0, SPL: 0, PAN: 0, DUO: 0 }} hideDia />
      </div>
      <div style={{ position: "absolute", left: 60, top: 1010, width: 880, display: "flex", flexDirection: "column", gap: 18 }}>
        {LORDER.map((b) => (
          <div key={b} style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Letter b={b} size={58} />
            <div style={{ lineHeight: 1.08 }}>
              <div style={{ fontWeight: 800, fontSize: 40, color: C.forest }}><span style={{ color: C.matcha }}>{LWORD[b]}</span> → {LART[b]}</div>
              <div style={{ fontWeight: 700, fontSize: 25, color: C.matcha }}>{where[b]}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 60, top: 1392, color: C.forest, fontWeight: 800, fontSize: 30, whiteSpace: "nowrap" }}>{sub}</div>
      <div style={{ position: "absolute", right: 50, top: 1380, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 34, padding: "8px 22px 12px", borderRadius: 16 }}>bookplume.com</div>
      <div style={{ position: "absolute", right: 40, bottom: 16, color: C.forest, opacity: 0.5, fontWeight: 700, fontSize: 18 }}>Diagram: Book Plume</div>
    </AbsoluteFill>
  );
};

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
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "Celiac trunk branches: Left Hand Side", sub: "Anatomy flashcards · study tips" }} />
  </>
);
