import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT, useT } from "./kit";
import { END, Header, Mark, Subtitles } from "./Chrome";
import { A454, PP, V1, V2, V3, V4, V5, V6, V7, liveAlpha } from "./Scenes69";
import { PlateBox } from "./Scenes67";
import { Cell, WBC, WCOL, WChip } from "./Cells69";

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
    <div style={{ position: "absolute", left: 60, width: 960, top: 300, textAlign: "center", fontWeight: 800, fontSize: 160, lineHeight: 1, letterSpacing: -4, color: C.forest, whiteSpace: "nowrap" }}>RANK ALL 5</div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 470, textAlign: "center", fontWeight: 800, fontSize: 94, lineHeight: 1, letterSpacing: -3, color: C.red, whiteSpace: "nowrap" }}>WHITE BLOOD CELLS</div>
    <PlateBox src="plates/wbc454.png" aspect={A454} x={60} y={610} w={960} h={700} a={0} b={1} from={[0.5, 0.5, 1.0]} to={[0.5, 0.5, 1.0]} still />
    <div style={{ position: "absolute", left: 60, width: 960, top: 1345, display: "flex", justifyContent: "center", gap: 14 }}>
      {WBC.map((r) => <WChip key={r.k} k={r.k} size={110} />)}
    </div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 1510, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <div style={{ width: 64, height: 64, borderRadius: 32, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center" }}><Mark size={46} reversed /></div>
      <div style={{ fontWeight: 800, fontSize: 40, color: C.forest }}>Book Plume · WBC mnemonic</div>
    </div>
  </AbsoluteFill>
);

/* Pinterest still 1000x1500 */
const Pin: React.FC<{ title: string; sub: string }> = ({ title, sub }) => (
  <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
    <Dots w={1000} h={1500} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 290, background: C.forest }} />
    <div style={{ position: "absolute", left: 60, top: 44, width: 880, color: C.paper, fontWeight: 800, fontSize: 66, lineHeight: 1.05, letterSpacing: -1 }}>{title}</div>
    <PlateBox src="plates/wbc454.png" aspect={A454} x={40} y={320} w={920} h={470} a={0} b={1} from={[0.5, 0.5, 1.33]} to={[0.5, 0.5, 1.33]} still credit="Gray's 1918 · PD" />
    <div style={{ position: "absolute", left: 50, top: 815, width: 900, display: "flex", flexDirection: "column", gap: 8 }}>
      {WBC.map((r, i) => (
        <div key={r.k} style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 40, fontWeight: 800, fontSize: 36, color: C.forest, textAlign: "right" }}>{i + 1}</div>
          <WChip k={r.k} size={56} />
          <div style={{ width: 78, height: 78 }}><Cell kind={r.k} size={78} id={`p${i}`} /></div>
          <div style={{ fontWeight: 800, fontSize: 38, color: C.forest, width: 230 }}>{r.name}</div>
          <div style={{ fontWeight: 800, fontSize: 30, color: C.forest, background: WCOL[r.k], borderRadius: 10, padding: "2px 10px 4px", width: 150, textAlign: "center", whiteSpace: "nowrap" }}>{r.pct}</div>
          <div style={{ fontWeight: 700, fontSize: 24, color: C.matchaDark, whiteSpace: "nowrap" }}>{r.job}</div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 50, top: 1290, color: C.forest, fontWeight: 800, fontSize: 28, whiteSpace: "nowrap" }}>Never Let Monkeys Eat Bananas = most → least</div>
    <div style={{ position: "absolute", left: 50, top: 1345, color: C.matcha, fontWeight: 800, fontSize: 28, whiteSpace: "nowrap" }}>{sub}</div>
    <div style={{ position: "absolute", right: 50, top: 1400, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 34, padding: "8px 22px 12px", borderRadius: 16 }}>bookplume.com</div>
    <div style={{ position: "absolute", left: 50, bottom: 22, color: C.forest, opacity: 0.55, fontWeight: 700, fontSize: 18 }}>Plate: Gray's Anatomy (1918), Fig. 454, public domain · cell drawings: Book Plume · % per OpenStax A&P 2e</div>
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
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "White Blood Cells Mnemonic: Never Let Monkeys Eat Bananas", sub: "Anatomy flashcards · nursing school study tips" }} />
  </>
);
