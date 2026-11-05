import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT } from "./kit";
import { END, Header, Subtitles } from "./Chrome";
import { V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, liveAlpha } from "./Scenes57";
import { useT } from "./kit";
import { BONE_COL, BONE_NAME, ORDER, SkullSide } from "./Skull57";
// Pinterest still: npx remotion still src/index.ts Pin ../pin.jpg --jpeg-quality 95
const Pin: React.FC<{ title: string; sub: string }> = ({ title, sub }) => {
  const word: Record<string, string> = { O: "Old", P: "People", F: "From", T: "Texas", E: "Eat", S: "Spiders" };
  const where: Record<string, string> = { O: "back of the skull", P: "top + sides (×2)", F: "forehead", T: "above the ears (×2)", E: "between the eye sockets", S: "keystone, joins almost all" };
  return (
    <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 300, background: C.forest }} />
      <div style={{ position: "absolute", left: 60, top: 46, width: 880, color: C.paper, fontWeight: 800, fontSize: 74, lineHeight: 1.05, letterSpacing: -1 }}>{title}</div>
      <div style={{ position: "absolute", left: 100, top: 330 }}>
        <SkullSide w={800} lit={{ O: 1, P: 1, F: 1, T: 1, E: 1, S: 1 }} face={0.9} />
      </div>
      <div style={{ position: "absolute", left: 50, top: 1080, width: 900, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 22px" }}>
        {ORDER.map((b) => (
          <div key={b} style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 62, height: 62, borderRadius: 16, background: BONE_COL[b], color: b === "P" ? C.forest : C.paper, border: `4px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 40, flexShrink: 0 }}>{b}</div>
            <div style={{ lineHeight: 1.05 }}>
              <div style={{ fontWeight: 800, fontSize: 32, color: C.forest }}>{word[b]} → {BONE_NAME[b]}</div>
              <div style={{ fontWeight: 700, fontSize: 21, color: C.matcha }}>{where[b]}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 60, top: 1388, color: C.forest, fontWeight: 800, fontSize: 30, whiteSpace: "nowrap" }}>{sub}</div>
      <div style={{ position: "absolute", right: 50, top: 1376, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 34, padding: "8px 22px 12px", borderRadius: 16 }}>bookplume.com</div>
      <div style={{ position: "absolute", right: 40, bottom: 20, color: C.forest, opacity: 0.5, fontWeight: 700, fontSize: 18 }}>Diagram: Book Plume</div>
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
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "The 8 cranial bones: one easy mnemonic", sub: "Anatomy flashcards · study tips" }} />
  </>
);
