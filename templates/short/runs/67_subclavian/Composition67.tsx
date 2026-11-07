import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT, useT } from "./kit";
import { END, Header, Mark, Subtitles } from "./Chrome";
import { A513, BRS, LChip, PlateBox, V1, V2, V3, V4, V5, V6, V7, V8, liveAlpha } from "./Scenes67";
import { SubDiagram, PCOL } from "./Sub67";
import { CarouselSlide } from "./Carousel67";

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

/* Cover 1080x1920: all text in y 280–1640, x 60–1020 */
const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
    <Dots w={1080} h={1920} />
    <div style={{ position: "absolute", left: 60, width: 960, top: 300, textAlign: "center", fontWeight: 800, fontSize: 150, lineHeight: 1, letterSpacing: -4, color: C.forest, whiteSpace: "nowrap" }}>NAME ALL 5</div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 462, textAlign: "center", fontWeight: 800, fontSize: 80, lineHeight: 1, letterSpacing: -3, color: C.red, whiteSpace: "nowrap" }}>SUBCLAVIAN BRANCHES</div>
    <PlateBox src="plates/sub513.png" aspect={A513} x={60} y={600} w={960} h={740} a={0} b={1} from={[0.44, 0.76, 0.6]} to={[0.44, 0.76, 0.6]} still
      labels={[{ x: 0.415, y: 0.877, text: "subclavian artery", t: 0, hot: true, ox: 120, oy: -40 }]} />
    <div style={{ position: "absolute", left: 60, width: 960, top: 1370, display: "flex", justifyContent: "center", gap: 14 }}>
      {BRS.map((r) => <LChip key={r.b} b={r.b} size={96} />)}
    </div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 1520, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <div style={{ width: 64, height: 64, borderRadius: 32, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center" }}><Mark size={46} reversed /></div>
      <div style={{ fontWeight: 800, fontSize: 40, color: C.forest }}>Book Plume · anatomy mnemonic</div>
    </div>
  </AbsoluteFill>
);

/* Pinterest still 1000x1500 */
const Pin: React.FC<{ title: string; sub: string }> = ({ title, sub }) => (
  <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 300, background: C.forest }} />
    <div style={{ position: "absolute", left: 60, top: 46, width: 880, color: C.paper, fontWeight: 800, fontSize: 68, lineHeight: 1.04, letterSpacing: -1 }}>{title}</div>
    <div style={{ position: "absolute", left: 40, top: 330, width: 540, height: 540, borderRadius: 36, overflow: "hidden", boxShadow: `0 0 0 4px ${C.line}`, background: C.paper }}>
      <SubDiagram t={20} w={540} ghost={1} lit={{ V: 0, I: 0, T: 0, C: 0, D: 0, AS: 0 }} id="pin" />
    </div>
    <PlateBox src="plates/sub513.png" aspect={A513} x={610} y={330} w={350} h={540} a={0} b={1} from={[0.43, 0.62, 0.42]} to={[0.43, 0.62, 0.42]} still credit="Gray's 1918 · PD" />
    <div style={{ position: "absolute", left: 60, top: 900, width: 880, display: "flex", flexDirection: "column", gap: 10 }}>
      {BRS.map((r) => (
        <div key={r.b} style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 54, fontWeight: 800, fontSize: 24, color: C.forest, background: PCOL[r.part], border: `3px solid ${C.forest}`, borderRadius: 10, textAlign: "center", padding: "2px 0 4px" }}>P{r.part}</div>
          <LChip b={r.b} size={52} />
          <div style={{ fontWeight: 800, fontSize: 40, color: C.forest }}>{r.name}</div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 60, top: 1262, width: 880, background: C.forest, color: C.paper, borderRadius: 18, padding: "8px 22px 12px", fontWeight: 800, fontSize: 30, whiteSpace: "nowrap" }}>Anterior scalene splits it → parts 1 · 2 · 3 give <span style={{ color: C.banana }}>3 · 1 · 1</span></div>
    <div style={{ position: "absolute", left: 60, top: 1360, color: C.forest, fontWeight: 800, fontSize: 28, whiteSpace: "nowrap" }}>{sub}</div>
    <div style={{ position: "absolute", right: 50, top: 1348, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 34, padding: "8px 22px 12px", borderRadius: 16 }}>bookplume.com</div>
    <div style={{ position: "absolute", left: 60, bottom: 22, color: C.forest, opacity: 0.55, fontWeight: 700, fontSize: 18 }}>Plate: Gray's Anatomy (1918), Fig. 513, public domain · diagram: Book Plume</div>
  </AbsoluteFill>
);

const Grid: React.FC = () => {
  const t = useT();
  return <Dots w={1080} h={1920} o={(t * 40) % 54} />;
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
    <Composition id="Cover" component={Cover} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "Subclavian Artery Branches: VIT C & D Mnemonic", sub: "Anatomy flashcards · study tips" }} />
    <Composition id="Carousel" component={CarouselSlide} durationInFrames={1} fps={30} width={1080} height={1350} defaultProps={{ n: 1 }} />
  </>
);
