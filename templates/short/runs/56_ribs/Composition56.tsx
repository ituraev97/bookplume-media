import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT } from "./kit";
import { END, Header, Subtitles } from "./Chrome";
import { V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, liveAlpha } from "./Scenes56";
import { useT } from "./kit";
import { Ribs } from "./Ribs56";
// Pinterest still: npx remotion still src/index.ts Pin ../pin.jpg --jpeg-quality 95
const Pin: React.FC<{ title: string; sub: string }> = ({ title, sub }) => {
  const card = (n: string, word: string, ribs: string, how: string, bg: string, fg: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 20, background: C.forest, borderRadius: 26, padding: "16px 22px", boxShadow: "0 8px 0 rgba(31,42,20,0.2)" }}>
      <div style={{ width: 92, height: 92, borderRadius: 24, background: bg, color: fg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 70 }}>{n}</div>
      <div style={{ fontFamily: FONT, fontWeight: 800, color: C.paper }}>
        <div style={{ fontSize: 44, lineHeight: 1 }}><span style={{ color: C.banana }}>{word[0]}</span>{word.slice(1)}</div>
        <div style={{ fontSize: 26, marginTop: 6, color: C.matchaLight }}>{ribs} · {how}</div>
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 330, background: C.forest }} />
      <div style={{ position: "absolute", left: 60, top: 50, width: 880, color: C.paper, fontWeight: 800, fontSize: 74, lineHeight: 1.05, letterSpacing: -1 }}>{title}</div>
      <div style={{ position: "absolute", left: 20, top: 380 }}>
        <Ribs t={0} w={500} lit={{ T: 1, F: 1, FL: 1 }} nums={1} />
      </div>
      <div style={{ position: "absolute", left: 540, top: 400, width: 430, display: "flex", flexDirection: "column", gap: 20 }}>
        {card("7", "True", "ribs 1–7", "own cartilage", C.matcha, C.paper)}
        {card("3", "False", "ribs 8–10", "cartilage above", C.banana, C.forest)}
        {card("2", "Floating", "ribs 11–12", "no front end", C.red, C.paper)}
      </div>
      <div style={{ position: "absolute", left: 50, top: 1000, width: 900, background: C.card, border: `3px solid ${C.line}`, color: C.forest, borderRadius: 26, padding: "18px 30px 22px", boxSizing: "border-box", fontWeight: 800, fontSize: 34, lineHeight: 1.25 }}>
        Floating ribs count as false too → <span style={{ color: C.matcha }}>false = 8–12</span>. 7 + 3 + 2 = <span style={{ color: C.matcha }}>12 pairs</span>
      </div>
      <div style={{ position: "absolute", left: 50, top: 1150, width: 900, background: C.forest, color: C.paper, borderRadius: 26, padding: "18px 30px 22px", boxSizing: "border-box", fontWeight: 800, fontSize: 34, lineHeight: 1.2 }}>
        <span style={{ color: C.banana }}>Quick test:</span> rib 9? → <span style={{ color: C.banana }}>false</span> (joins rib 8's cartilage)
      </div>
      <div style={{ position: "absolute", left: 60, top: 1290, width: 880, color: C.forest, fontWeight: 800, fontSize: 34, lineHeight: 1.15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sub}</div>
      <div style={{ position: "absolute", left: 60, top: 1352, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 36, padding: "10px 24px 14px", borderRadius: 16 }}>bookplume.com</div>
      <div style={{ position: "absolute", right: 40, bottom: 26, color: C.forest, opacity: 0.5, fontWeight: 700, fontSize: 18 }}>Diagram: Book Plume</div>
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
    <V11 />
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
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "True, false & floating ribs in 3 numbers: 7 · 3 · 2", sub: "Anatomy flashcards · nursing school study tips" }} />
  </>
);
