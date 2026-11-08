import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT, useT } from "./kit";
import { END, Header, Mark, Subtitles } from "./Chrome71";
import { A427, MChip, V1, V2, V3, V4, V5, V6, V6b, V7, V8, liveAlpha } from "./Scenes71";
import { PlateBox } from "./Scenes67";
import { GDARK, GROUP, NAME, ORDER, Palm } from "./Palm71";
import { CarouselSlide } from "./Carousel71";

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
const ALL = { APB: 0, OP: 0, FPB: 0, ADP: 0, ODM: 0, FDM: 0, ADM: 0 };

/* Cover 1080x1920: all text in y 280–1640, x 60–1020 */
const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
    <Dots w={1080} h={1920} />
    <div style={{ position: "absolute", left: 60, width: 960, top: 300, textAlign: "center", fontWeight: 800, fontSize: 150, lineHeight: 1, letterSpacing: -4, color: C.forest, whiteSpace: "nowrap" }}>NAME ALL 7</div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 462, textAlign: "center", fontWeight: 800, fontSize: 104, lineHeight: 1, letterSpacing: -3, color: C.red, whiteSpace: "nowrap" }}>PALM MUSCLES</div>
    <PlateBox src="plates/hand427.png" aspect={A427} x={60} y={610} w={960} h={730} a={0} b={1} from={[0.56, 0.36, 0.86]} to={[0.56, 0.36, 0.86]} still
      labels={[
        { x: 0.76, y: 0.33, text: "thenar", t: 0, hot: true, ox: 40, oy: -110 },
        { x: 0.33, y: 0.37, text: "hypothenar", t: 0, hot: true, ox: 30, oy: -150 },
      ]} />
    <div style={{ position: "absolute", left: 60, width: 960, top: 1372, display: "flex", justifyContent: "center", gap: 12 }}>
      {ORDER.map((m) => <MChip key={m} m={m} size={100} />)}
    </div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 1530, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <div style={{ width: 64, height: 64, borderRadius: 32, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center" }}><Mark size={46} reversed /></div>
      <div style={{ fontWeight: 800, fontSize: 40, color: C.forest }}>Book Plume · anatomy mnemonic</div>
    </div>
  </AbsoluteFill>
);

/* Pinterest still 1000x1500 */
const Pin: React.FC<{ title: string; sub: string }> = ({ title, sub }) => (
  <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 290, background: C.forest }} />
    <div style={{ position: "absolute", left: 60, top: 46, width: 880, color: C.paper, fontWeight: 800, fontSize: 66, lineHeight: 1.04, letterSpacing: -1 }}>{title}</div>
    <div style={{ position: "absolute", left: 40, top: 320, width: 470, height: 560, borderRadius: 36, overflow: "hidden", boxShadow: `0 0 0 4px ${C.line}`, background: C.paper }}>
      <div style={{ position: "absolute", left: -20, top: 0 }}><Palm t={20} w={510} id="pin" lit={ALL} letters={1} bones={0.6} /></div>
    </div>
    <PlateBox src="plates/hand427.png" aspect={A427} x={530} y={320} w={430} h={560} a={0} b={1} from={[0.55, 0.36, 0.95]} to={[0.55, 0.36, 0.95]} still credit="Gray's 1918 · PD" />
    <div style={{ position: "absolute", left: 60, top: 905, width: 880, display: "flex", flexDirection: "column", gap: 8 }}>
      {ORDER.map((m) => (
        <div key={m} style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <MChip m={m} size={46} />
          <div style={{ fontWeight: 800, fontSize: 34, color: C.forest, whiteSpace: "nowrap" }}>{NAME[m]}</div>
          <div style={{ fontWeight: 700, fontSize: 22, color: GDARK[GROUP[m]], whiteSpace: "nowrap" }}>{GROUP[m] === "th" ? "thenar · median" : GROUP[m] === "ad" ? "ulnar" : "hypothenar · ulnar"}</div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 60, top: 1380, color: C.forest, fontWeight: 800, fontSize: 28, whiteSpace: "nowrap" }}>{sub}</div>
    <div style={{ position: "absolute", right: 50, top: 1366, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 34, padding: "8px 22px 12px", borderRadius: 16 }}>bookplume.com</div>
    <div style={{ position: "absolute", left: 60, bottom: 22, color: C.forest, opacity: 0.55, fontWeight: 700, fontSize: 18 }}>Plate: Gray's Anatomy (1918), Fig. 427, public domain · diagram: Book Plume</div>
  </AbsoluteFill>
);

const Grid: React.FC = () => {
  const t = useT();
  return <Dots w={1080} h={1920} o={(t * 40) % 54} />;
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
    <V6b />
    <V7 />
    <V8 />
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
    <Composition id="Cover" component={Cover} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "Thenar & Hypothenar Muscles: the A-OF-A-OF-A Mnemonic", sub: "Anatomy flashcards · study tips" }} />
    <Composition id="Carousel" component={CarouselSlide} durationInFrames={1} fps={30} width={1080} height={1350} defaultProps={{ n: 1 }} />
  </>
);
