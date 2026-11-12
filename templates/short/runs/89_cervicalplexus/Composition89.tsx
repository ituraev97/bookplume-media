import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT, useT } from "./kit";
import { END, Header, Mark, Subtitles } from "./Chrome89";
import { A805, ALL6, Chip6, NAME6, P805, TO6, V1, V2, V3, V4, V5, V6, V7, V8, V9, V10 } from "./Scenes89";
import { PlateBox74 } from "./Scenes74";
import { Neck } from "./Neck89";

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
    <div style={{ position: "absolute", left: 60, width: 960, top: 300, textAlign: "center", fontWeight: 800, fontSize: 112, lineHeight: 1, letterSpacing: -4, color: C.forest, whiteSpace: "nowrap" }}>CERVICAL PLEXUS</div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 430, textAlign: "center", fontWeight: 800, fontSize: 150, lineHeight: 1, letterSpacing: -4, color: C.red, whiteSpace: "nowrap" }}>NAME ALL 6?</div>
    <PlateBox74 src={P805} aspect={A805} x={110} y={610} w={860} h={760} a={0} b={1} from={[0.46, 0.65, 0.66]} to={[0.46, 0.65, 0.66]} still credit="Gray's Anatomy, 1918 · PD" />
    <div style={{ position: "absolute", left: 60, width: 960, top: 1400, display: "flex", justifyContent: "center", alignItems: "center", gap: 12 }}>
      {ALL6.map((k) => <Chip6 key={k} k={k} size={84} />)}
    </div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 1546, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <div style={{ width: 64, height: 64, borderRadius: 32, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center" }}><Mark size={46} reversed /></div>
      <div style={{ fontWeight: 800, fontSize: 40, color: C.forest }}>Book Plume · neck anatomy mnemonic</div>
    </div>
  </AbsoluteFill>
);

/* Pinterest still 1000x1500 */
const Pin: React.FC<{ title: string; sub: string }> = ({ title, sub }) => (
  <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
    <Dots w={1000} h={1500} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 270, background: C.forest }} />
    <div style={{ position: "absolute", left: 60, top: 46, width: 880, color: C.paper, fontWeight: 800, fontSize: 60, lineHeight: 1.06, letterSpacing: -1 }}>{title}</div>
    <div style={{ position: "absolute", left: 20, top: 300, width: 430, height: 800, overflow: "hidden", borderRadius: 30, background: C.card, boxShadow: `0 0 0 4px ${C.line}` }}>
      <div style={{ position: "absolute", left: 215 - 480 * 1.0, top: 400 - 620 * 1.0 }}>
        <Neck t={30} id="pin" w={900 * 1.0} lit={{ LO: 0, GA: 0, TC: 0, SC: 0 }} erb={1} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 475, top: 306, width: 510, display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ fontWeight: 800, fontSize: 30, color: C.matcha, lineHeight: 1.1 }}>2 up · 1 across · 1 down + 2 motor</div>
      {ALL6.map((k) => (
        <div key={k} style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Chip6 k={k} size={66} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 29, color: C.forest, lineHeight: 1.05 }}>{NAME6[k]}</div>
            <div style={{ fontWeight: 700, fontSize: 19, color: C.matcha, marginTop: 3 }}>{TO6[k]}</div>
          </div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 60, top: 1130, width: 900, fontSize: 31, fontWeight: 700, color: C.forest, lineHeight: 1.6 }}>
      <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px", fontWeight: 800 }}>roots</span> C1–C4 (phrenic C3–C5)<br />
      <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px", fontWeight: 800 }}>Erb's point</span> 4 skin nerves exit behind SCM<br />
      <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px", fontWeight: 800 }}>quiz</span> C3, 4, 5 keeps the diaphragm alive
    </div>
    <div style={{ position: "absolute", left: 60, top: 1395, color: C.forest, fontWeight: 800, fontSize: 28, whiteSpace: "nowrap" }}>{sub}</div>
    <div style={{ position: "absolute", right: 50, top: 1380, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 34, padding: "8px 22px 12px", borderRadius: 16 }}>bookplume.com</div>
    <div style={{ position: "absolute", left: 60, bottom: 18, color: C.forest, opacity: 0.55, fontWeight: 700, fontSize: 18 }}>Diagram: Book Plume · based on Gray's Anatomy (1918) Figs. 804–805, public domain</div>
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
    <V7 />
    <V8 />
    <V9 />
    <V10 />
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
    {v === 0 && <Neck t={30} id="dg" w={860} lit={{ LO: 0, GA: 0, TC: 0, SC: 0 }} erb={1} />}
    {v === 1 && <Neck t={30} id="dg" w={860} ghost={0.3} scm={1} />}
  </AbsoluteFill>
);
export const MyComposition = () => (
  <>
    <Composition id="Diag" component={Diag} durationInFrames={1} fps={30} width={860} height={956} defaultProps={{ v: 0 }} />
    <Composition id="Main" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: false }} />
    <Composition id="Mask" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: true }} />
    <Composition id="Cover" component={Cover} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "Cervical Plexus Branches: 2 Up, 1 Across, 1 Down", sub: "Anatomy flashcards · study tips" }} />
  </>
);
