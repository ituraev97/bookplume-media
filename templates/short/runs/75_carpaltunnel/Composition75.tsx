import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT, useT } from "./kit";
import { END, Header, Mark, Subtitles } from "./Chrome75";
import { A422, GROUPS, NChip, PLATE, V1, V2, V3, V4, V5, V6, V7, V8, V9, V10 } from "./Scenes75";
import { PlateBox74 } from "./Scenes74";
import { Tunnel } from "./Tunnel75";
import { CarouselSlide } from "./Carousel75";

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
const ALL = { S3: 0, S4: 0, S2: 0, S5: 0, P2: 0, P3: 0, P4: 0, P5: 0, FPL: 0, MED: 0 };

/* Cover 1080x1920: all text in y 280–1640, x 60–1020 */
const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
    <Dots w={1080} h={1920} />
    <div style={{ position: "absolute", left: 60, width: 960, top: 290, textAlign: "center", fontWeight: 800, fontSize: 116, lineHeight: 1, letterSpacing: -4, color: C.forest, whiteSpace: "nowrap" }}>CARPAL TUNNEL</div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 430, textAlign: "center", fontWeight: 800, fontSize: 124, lineHeight: 1, letterSpacing: -3, color: C.red, whiteSpace: "nowrap" }}>NAME ALL 10?</div>
    <PlateBox74 src={PLATE} aspect={A422} x={80} y={610} w={920} h={760} a={0} b={1} from={[0.48, 0.46, 0.6]} to={[0.48, 0.46, 0.6]} still credit="Gray's Anatomy, 1918 · PD"
      labels={[{ x: 0.5, y: 0.47, text: "?", t: 0, hot: true, ox: 160, oy: -150 }]} ls={60} />
    <div style={{ position: "absolute", left: 60, width: 960, top: 1418, display: "flex", justifyContent: "center", alignItems: "center", gap: 18 }}>
      {GROUPS.map((g, i) => (
        <React.Fragment key={i}>
          <NChip n={g.n} g={g.g} size={104} />
          {i < 3 && <div style={{ fontWeight: 800, fontSize: 60, color: C.forest }}>·</div>}
        </React.Fragment>
      ))}
    </div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 1558, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <div style={{ width: 64, height: 64, borderRadius: 32, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center" }}><Mark size={46} reversed /></div>
      <div style={{ fontWeight: 800, fontSize: 40, color: C.forest }}>Book Plume · anatomy mnemonic</div>
    </div>
  </AbsoluteFill>
);

/* Pinterest still 1000x1500 */
const Pin: React.FC<{ title: string; sub: string }> = ({ title, sub }) => (
  <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 270, background: C.forest }} />
    <div style={{ position: "absolute", left: 60, top: 46, width: 880, color: C.paper, fontWeight: 800, fontSize: 66, lineHeight: 1.04, letterSpacing: -1 }}>{title}</div>
    <div style={{ position: "absolute", left: 30, top: 300 }}>
      <Tunnel t={30} id="pin" w={940} lit={ALL} nums />
    </div>
    <div style={{ position: "absolute", left: 60, top: 980, width: 880, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
      {GROUPS.map((g, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <NChip n={g.n} g={g.g} size={72} />
          <div style={{ fontWeight: 800, fontSize: 28, color: C.forest, lineHeight: 1.1 }}>{g.name}</div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 60, top: 1200, width: 880, fontSize: 30, fontWeight: 700, color: C.forest, lineHeight: 1.3 }}>
      <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px", fontWeight: 800 }}>roof</span> flexor retinaculum ·{" "}
      <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px", fontWeight: 800 }}>floor</span> carpal bones
      <br />
      <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px", fontWeight: 800 }}>NOT inside</span> ulnar nerve (Guyon's canal)
    </div>
    <div style={{ position: "absolute", left: 60, top: 1380, color: C.forest, fontWeight: 800, fontSize: 28, whiteSpace: "nowrap" }}>{sub}</div>
    <div style={{ position: "absolute", right: 50, top: 1366, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 34, padding: "8px 22px 12px", borderRadius: 16 }}>bookplume.com</div>
    <div style={{ position: "absolute", left: 60, bottom: 22, color: C.forest, opacity: 0.55, fontWeight: 700, fontSize: 18 }}>Diagram: Book Plume · reference plate Gray's Anatomy (1918) Fig. 422, public domain</div>
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

export const MyComposition = () => (
  <>
    <Composition id="Main" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: false }} />
    <Composition id="Mask" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: true }} />
    <Composition id="Cover" component={Cover} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "Carpal Tunnel Contents: the 4-4-1-1 Mnemonic", sub: "Anatomy flashcards · study tips" }} />
    <Composition id="Carousel" component={CarouselSlide} durationInFrames={1} fps={30} width={1080} height={1350} defaultProps={{ n: 1 }} />
  </>
);
