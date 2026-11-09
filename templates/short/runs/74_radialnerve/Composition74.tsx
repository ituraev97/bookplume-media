import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT, useT } from "./kit";
import { END, Header, Mark, Subtitles } from "./Chrome74";
import { A418, BChip, LETTERS, NAMES, V1, V2, V3, V4, V5, V6, V7, V8, V9, V10 } from "./Scenes74";
import { PlateBox } from "./Scenes67";
import { Arm } from "./Arm74";

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
    <div style={{ position: "absolute", left: 60, width: 960, top: 290, textAlign: "center", fontWeight: 800, fontSize: 142, lineHeight: 1, letterSpacing: -4, color: C.forest, whiteSpace: "nowrap" }}>RADIAL NERVE</div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 446, textAlign: "center", fontWeight: 800, fontSize: 92, lineHeight: 1, letterSpacing: -3, color: C.red, whiteSpace: "nowrap" }}>NAME ITS MUSCLES?</div>
    <PlateBox src="plates/fig418_post_forearm.png" aspect={A418} x={90} y={580} w={560} h={830} a={0} b={1} from={[0.56, 0.4, 0.78]} to={[0.56, 0.4, 0.78]} still credit="Gray's Anatomy, 1918 · PD" />
    <div style={{ position: "absolute", left: 690, top: 600, display: "flex", flexDirection: "column", gap: 22 }}>
      {LETTERS.map((l) => (
        <div key={l} style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <BChip l={l} size={128} />
          <div style={{ fontWeight: 800, fontSize: 90, color: C.forest }}>?</div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 1450, display: "flex", justifyContent: "center" }}>
      <div style={{ background: C.forest, color: C.paper, fontWeight: 800, fontSize: 54, borderRadius: 30, padding: "14px 36px 18px" }}>1-word mnemonic</div>
    </div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 1565, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
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
      <Arm t={10} id="pin" w={540} full />
    </div>
    <div style={{ position: "absolute", left: 560, top: 310, width: 410, display: "flex", flexDirection: "column", gap: 18 }}>
      {LETTERS.map((l) => (
        <div key={l} style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <BChip l={l} size={70} />
          <div style={{ fontWeight: 800, fontSize: 30, color: C.forest, lineHeight: 1.1 }}>{NAMES[l]}</div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 560, top: 800, width: 410, display: "flex", flexDirection: "column", gap: 14 }}>
      {[
        ["rule", "radial nerve = back of arm + forearm"],
        ["trap", "brachioradialis flexes the elbow, yet it's radial"],
        ["deep", "supinator wraps the top of the radius"],
      ].map(([a, b]) => (
        <div key={a} style={{ fontSize: 28, fontWeight: 700, color: C.forest, lineHeight: 1.2 }}>
          <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px", fontWeight: 800 }}>{a}</span> {b}
        </div>
      ))}
    </div>
    <PlateBox src="plates/fig418_post_forearm.png" aspect={A418} x={560} y={1060} w={410} h={270} a={0} b={1} from={[0.45, 0.42, 0.95]} to={[0.45, 0.42, 0.95]} still credit="Gray's 1918 · PD" />
    <div style={{ position: "absolute", left: 60, top: 1380, color: C.forest, fontWeight: 800, fontSize: 28, whiteSpace: "nowrap" }}>{sub}</div>
    <div style={{ position: "absolute", right: 50, top: 1366, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 34, padding: "8px 22px 12px", borderRadius: 16 }}>bookplume.com</div>
    <div style={{ position: "absolute", left: 60, bottom: 22, color: C.forest, opacity: 0.55, fontWeight: 700, fontSize: 18 }}>Plate: Gray's Anatomy (1918), Fig. 418, public domain · diagram: Book Plume (posterior view)</div>
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
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "Radial Nerve Muscles: the BEAST Mnemonic", sub: "Anatomy flashcards · study tips" }} />
  </>
);
