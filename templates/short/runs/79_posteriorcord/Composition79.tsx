import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT, useT } from "./kit";
import { END, Header, Mark, Subtitles } from "./Chrome79";
import { A809, SChip, MN, PLATE, V1, V2, V3, V4, V5, V6, V7, V8, V9, V10 } from "./Scenes79";
import { PlateBox74 } from "./Scenes74";
import { Cord, LETTERS } from "./Cord79";
import { CarouselSlide } from "./Carousel79";

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
const ALL = { US: 0, LS: 0, TD: 0, AX: 0, RA: 0 };
const ALLM = { SS: 0, TM: 0, LD: 0, DE: 0, TMi: 0, TR: 0 };

/* Cover 1080x1920: all text in y 280–1640, x 60–1020 */
const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
    <Dots w={1080} h={1920} />
    <div style={{ position: "absolute", left: 60, width: 960, top: 300, textAlign: "center", fontWeight: 800, fontSize: 104, lineHeight: 1, letterSpacing: -4, color: C.forest, whiteSpace: "nowrap" }}>POSTERIOR CORD</div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 422, textAlign: "center", fontWeight: 800, fontSize: 130, lineHeight: 1, letterSpacing: -3, color: C.red, whiteSpace: "nowrap" }}>NAME ALL 5?</div>
    <PlateBox74 src={PLATE} aspect={A809} x={110} y={590} w={860} h={790} a={0} b={1} from={[0.5, 0.48, 0.66]} to={[0.5, 0.48, 0.66]} still credit="Gray's Anatomy, 1918 · PD"
      labels={[{ x: 0.535, y: 0.315, text: "?", t: 0, hot: true, ox: 160, oy: -150 }]} ls={60} />
    <div style={{ position: "absolute", left: 60, width: 960, top: 1418, display: "flex", justifyContent: "center", alignItems: "center", gap: 14 }}>
      {LETTERS.map((k) => <SChip key={k} l={k} size={110} />)}
    </div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 1558, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <div style={{ width: 64, height: 64, borderRadius: 32, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center" }}><Mark size={46} reversed /></div>
      <div style={{ fontWeight: 800, fontSize: 40, color: C.forest }}>Book Plume · brachial plexus mnemonic</div>
    </div>
  </AbsoluteFill>
);

/* Pinterest still 1000x1500 */
const Pin: React.FC<{ title: string; sub: string }> = ({ title, sub }) => (
  <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
    <Dots w={1000} h={1500} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 270, background: C.forest }} />
    <div style={{ position: "absolute", left: 60, top: 46, width: 880, color: C.paper, fontWeight: 800, fontSize: 62, lineHeight: 1.06, letterSpacing: -1 }}>{title}</div>
    <div style={{ position: "absolute", left: 0, top: 300, width: 520, height: 880, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: -120, top: -40 }}>
        <Cord t={30} id="pin" w={860} lit={ALL} mus={ALLM} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 520, top: 320, width: 450, display: "flex", flexDirection: "column", gap: 26 }}>
      <div style={{ fontWeight: 800, fontSize: 30, color: C.matcha, lineHeight: 1.1 }}>POSTERIOR CORD = STAR</div>
      {LETTERS.map((k) => (
        <div key={k} style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <SChip l={k} size={70} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 28, color: C.forest, lineHeight: 1.05 }}>{MN[k].name}</div>
            <div style={{ fontWeight: 700, fontSize: 21, color: C.matcha, marginTop: 3 }}>→ {MN[k].to}</div>
          </div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 60, top: 1215, width: 900, fontSize: 32, fontWeight: 700, color: C.forest, lineHeight: 1.6 }}>
      <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px", fontWeight: 800 }}>mnemonic</span> STAR = 4 letters, 5 nerves
      <br />
      <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px", fontWeight: 800 }}>quiz</span> around the surgical neck? axillary
    </div>
    <div style={{ position: "absolute", left: 60, top: 1385, color: C.forest, fontWeight: 800, fontSize: 28, whiteSpace: "nowrap" }}>{sub}</div>
    <div style={{ position: "absolute", right: 50, top: 1370, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 34, padding: "8px 22px 12px", borderRadius: 16 }}>bookplume.com</div>
    <div style={{ position: "absolute", left: 60, bottom: 20, color: C.forest, opacity: 0.55, fontWeight: 700, fontSize: 18 }}>Diagram: Book Plume · based on Gray's Anatomy (1918) Figs. 809, 810, public domain</div>
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

const Diag: React.FC = () => (<AbsoluteFill style={{ background: C.paper }}><Cord t={30} id="dg" w={900} lit={{ US: 0, LS: 0, TD: 0, AX: 0, RA: 0 }} mus={{ SS: 0, TM: 0, LD: 0, DE: 0, TMi: 0, TR: 0 }} /></AbsoluteFill>);
export const MyComposition = () => (
  <>
    <Composition id="Diag" component={Diag} durationInFrames={1} fps={30} width={900} height={1000} />
    <Composition id="Main" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: false }} />
    <Composition id="Mask" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: true }} />
    <Composition id="Cover" component={Cover} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="Carousel" component={CarouselSlide} durationInFrames={1} fps={30} width={1080} height={1350} defaultProps={{ n: 1 }} />
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "Posterior Cord Branches Mnemonic: STAR", sub: "Anatomy flashcards · study tips" }} />
  </>
);
