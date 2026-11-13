import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT, useT } from "./kit";
import { END, Header, Mark, Subtitles } from "./Chrome91";
import { A492, P492, HChip, V1, V2, V3, V4, V5, V6, V7, V8 } from "./Scenes91";
import { PlateBox74 } from "./Scenes74";
import { Heart, HB } from "./Heart91";

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

const ALL: Partial<Record<HB, number>> = { LCA: 0, CX: 0, LAD: 0, RCA: 0, RM: 0, PDA: 0 };

/* Cover 1080x1920: all text in y 280–1640, x 60–1020 */
const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
    <Dots w={1080} h={1920} />
    <div style={{ position: "absolute", left: 60, width: 960, top: 300, textAlign: "center", fontWeight: 800, fontSize: 138, lineHeight: 1, letterSpacing: -4, color: C.forest, whiteSpace: "nowrap" }}>YOUR HEART</div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 446, textAlign: "center", fontWeight: 800, fontSize: 100, lineHeight: 1, letterSpacing: -3, color: C.red, whiteSpace: "nowrap" }}>FEEDS ITSELF FIRST</div>
    <PlateBox74 src={P492} aspect={A492} x={100} y={606} w={880} h={760} a={0} b={1} from={[0.47, 0.46, 0.86]} to={[0.47, 0.46, 0.86]} still credit="Gray's Anatomy, 1918 · PD"
      labels={[
        { x: 0.225, y: 0.56, text: "right coronary", t: 0, hot: true, ox: 40, oy: -170 },
        { x: 0.69, y: 0.55, text: "LAD", t: 0, hot: true, ox: 50, oy: 120 },
      ]} />
    <div style={{ position: "absolute", left: 60, width: 960, top: 1400, display: "flex", justifyContent: "center", alignItems: "center", gap: 14 }}>
      {(["CX", "LAD", "RM", "PDA"] as HB[]).map((k) => <HChip key={k} b={k} size={96} />)}
    </div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 1540, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <div style={{ width: 64, height: 64, borderRadius: 32, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center" }}><Mark size={46} reversed /></div>
      <div style={{ fontWeight: 800, fontSize: 40, color: C.forest }}>Book Plume · coronary arteries</div>
    </div>
  </AbsoluteFill>
);

/* Pinterest still 1000x1500 */
const Pin: React.FC<{ title: string; sub: string }> = ({ title, sub }) => {
  const rows: [HB, string, string][] = [
    ["CX", "Circumflex", "goes AROUND (left AV groove)"],
    ["LAD", "LAD", "runs DOWN the front"],
    ["RM", "Right marginal", "the EDGE (acute margin)"],
    ["PDA", "Posterior descending", "the BACK (usually)"],
  ];
  return (
    <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
      <Dots w={1000} h={1500} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 270, background: C.forest }} />
      <div style={{ position: "absolute", left: 60, top: 50, width: 880, color: C.paper, fontWeight: 800, fontSize: 56, lineHeight: 1.08, letterSpacing: -1 }}>{title}</div>
      <div style={{ position: "absolute", left: 30, top: 300, width: 460, height: 520, overflow: "hidden", borderRadius: 30, background: C.card, boxShadow: `0 0 0 4px ${C.line}` }}>
        <div style={{ position: "absolute", left: -40, top: -20 }}><Heart t={30} w={540} id="pinf" lit={ALL} /></div>
        <div style={{ position: "absolute", left: 16, bottom: 12, fontWeight: 800, fontSize: 22, color: C.matcha }}>front</div>
      </div>
      <div style={{ position: "absolute", left: 510, top: 300, width: 460, height: 520, overflow: "hidden", borderRadius: 30, background: C.card, boxShadow: `0 0 0 4px ${C.line}` }}>
        <div style={{ position: "absolute", left: -40, top: -20 }}><Heart t={30} w={540} id="pinb" back={1} lit={ALL} /></div>
        <div style={{ position: "absolute", left: 16, bottom: 12, fontWeight: 800, fontSize: 22, color: C.matcha }}>back</div>
      </div>
      <div style={{ position: "absolute", left: 50, top: 850, width: 900, display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ fontWeight: 800, fontSize: 34, color: C.forest }}>Left = <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px" }}>Around + Down</span> · Right = <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px" }}>Edge + Back</span></div>
        {rows.map(([k, nm, cue]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <HChip b={k} size={62} />
            <div style={{ fontWeight: 800, fontSize: 32, color: C.forest, width: 350, whiteSpace: "nowrap" }}>{nm}</div>
            <div style={{ fontWeight: 700, fontSize: 27, color: C.matcha, whiteSpace: "nowrap" }}>{cue}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 50, top: 1395, color: C.forest, fontWeight: 800, fontSize: 28, whiteSpace: "nowrap" }}>{sub}</div>
      <div style={{ position: "absolute", right: 50, top: 1380, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 34, padding: "8px 22px 12px", borderRadius: 16 }}>bookplume.com</div>
      <div style={{ position: "absolute", left: 50, bottom: 16, color: C.forest, opacity: 0.55, fontWeight: 700, fontSize: 18 }}>Diagrams: Book Plume · coronary anatomy per OpenStax A&P 2e · study use only</div>
    </AbsoluteFill>
  );
};

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

const Diag: React.FC<{ v: number }> = ({ v }) => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Heart t={30} id="dg" w={1000} lit={ALL} hot={v === 1 ? ["PDA"] : ["LAD"]} back={v === 1 ? 1 : 0} ghost={v === 2} />
  </AbsoluteFill>
);

export const MyComposition = () => (
  <>
    <Composition id="Diag" component={Diag} durationInFrames={1} fps={30} width={1000} height={1000} defaultProps={{ v: 0 }} />
    <Composition id="Main" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: false }} />
    <Composition id="Mask" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: true }} />
    <Composition id="Cover" component={Cover} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "Coronary Arteries Mnemonic: Left = Around + Down, Right = Edge + Back", sub: "Anatomy flashcards · study tips" }} />
  </>
);
