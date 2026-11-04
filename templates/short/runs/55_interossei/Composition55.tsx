import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT } from "./kit";
import { END, Header, Subtitles } from "./Chrome";
import { V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, liveAlpha } from "./Scenes55";
import { useT } from "./kit";
import { Img, staticFile } from "remotion";
// Pinterest still: npx remotion still src/index.ts Pin ../pin.jpg --jpeg-quality 95
const Pin: React.FC<{ title: string; sub: string }> = ({ title, sub }) => {
  const pw = 430, ph = pw / (864 / 1276);
  const card = (word: string, a: string, ar: string, b: string, br: string, bg: string, what: string) => (
    <div style={{ background: bg, borderRadius: 26, padding: "18px 26px 22px", color: C.paper, fontFamily: FONT, fontWeight: 800, boxShadow: "0 8px 0 rgba(31,42,20,0.2)" }}>
      <div style={{ fontSize: 64, letterSpacing: 6, lineHeight: 1 }}>{word}</div>
      <div style={{ fontSize: 38, marginTop: 8 }}><span style={{ color: C.banana }}>{a}</span>{ar} <span style={{ color: C.banana }}>{b}</span>{br}</div>
      <div style={{ fontSize: 28, marginTop: 6, opacity: 0.85 }}>{what}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 330, background: C.forest }} />
      <div style={{ position: "absolute", left: 60, top: 50, width: 880, color: C.paper, fontWeight: 800, fontSize: 74, lineHeight: 1.05, letterSpacing: -1 }}>{title}</div>
      <div style={{ position: "absolute", left: 50, top: 380, width: pw, height: ph, borderRadius: 28, overflow: "hidden", boxShadow: `0 0 0 4px ${C.line}`, background: C.paper }}>
        <Img src={staticFile("plates/dors428.png")} style={{ width: pw, height: ph }} />
        <div style={{ position: "absolute", left: 16, top: 14, background: C.red, color: C.paper, fontWeight: 800, fontSize: 28, padding: "4px 14px 7px", borderRadius: 12 }}>Dorsal</div>
      </div>
      <div style={{ position: "absolute", left: 520, top: 380, width: 430, display: "flex", flexDirection: "column", gap: 22 }}>
        {card("PAD", "P", "almar", "AD", "duct", C.matcha, "pull fingers together")}
        {card("DAB", "D", "orsal", "AB", "duct", C.red, "spread fingers apart")}
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 22, padding: "16px 22px", color: C.forest, fontWeight: 800, fontSize: 30, lineHeight: 1.25 }}>
          Axis = <span style={{ color: C.matcha }}>middle finger</span><br />Nerve = <span style={{ color: C.matcha }}>ulnar</span> (deep branch)
        </div>
      </div>
      <div style={{ position: "absolute", left: 50, top: 1060, width: 900, background: C.forest, color: C.paper, borderRadius: 26, padding: "22px 30px 26px", boxSizing: "border-box", fontWeight: 800, fontSize: 36, lineHeight: 1.2 }}>
        <span style={{ color: C.banana }}>Quick test:</span> grip a card between 2 fingers → <span style={{ color: C.banana }}>palmar</span> interossei hold it
      </div>
      <div style={{ position: "absolute", left: 60, top: 1262, width: 880, color: C.forest, fontWeight: 800, fontSize: 36, lineHeight: 1.15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sub}</div>
      <div style={{ position: "absolute", left: 60, top: 1330, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 36, padding: "10px 24px 14px", borderRadius: 16 }}>bookplume.com</div>
      <div style={{ position: "absolute", right: 40, bottom: 26, color: C.forest, opacity: 0.5, fontWeight: 700, fontSize: 18 }}>Illustration: Gray's Anatomy (1918), public domain</div>
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
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "Hand interossei in 2 words: PAD and DAB", sub: "Anatomy flashcards · nursing school study tips" }} />
  </>
);
