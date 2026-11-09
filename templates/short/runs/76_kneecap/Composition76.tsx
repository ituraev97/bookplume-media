import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT, useT } from "./kit";
import { END, Header, Mark, Subtitles } from "./Chrome76";
import { A430, MUS, ORDER, PLATE, QChip, V1, V2, V3, V4, V5, V6, V7, V8, V9 } from "./Scenes76";
import { PlateBox74 } from "./Scenes74";
import { Quad } from "./Quad76";

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
const ALL = { RF: 0, VL: 0, VM: 0, VI: 0 };

/* Cover 1080x1920: all text in y 280–1640, x 60–1020 */
const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
    <Dots w={1080} h={1920} />
    <div style={{ position: "absolute", left: 60, width: 960, top: 292, textAlign: "center", fontWeight: 800, fontSize: 128, lineHeight: 1, letterSpacing: -4, color: C.forest, whiteSpace: "nowrap" }}>YOUR KNEECAP</div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 432, textAlign: "center", fontWeight: 800, fontSize: 92, lineHeight: 1, letterSpacing: -3, color: C.red, whiteSpace: "nowrap" }}>GROWS INSIDE</div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 534, textAlign: "center", fontWeight: 800, fontSize: 92, lineHeight: 1, letterSpacing: -3, color: C.red, whiteSpace: "nowrap" }}>A TENDON</div>
    <PlateBox74 src={PLATE} aspect={A430} x={110} y={670} w={860} h={700} a={0} b={1} from={[0.5, 0.85, 1.05]} to={[0.5, 0.85, 1.05]} still credit="Gray's Anatomy, 1918 · PD" ls={46}
      labels={[{ x: 0.53, y: 0.876, text: "patella", t: 0, hot: true, ox: 170, oy: 130 }]} />
    <div style={{ position: "absolute", left: 60, width: 960, top: 1414, display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
      {ORDER.map((q) => <QChip key={q} q={q} size={96} />)}
      <div style={{ marginLeft: 12, fontWeight: 800, fontSize: 50, color: C.forest, whiteSpace: "nowrap" }}>= 4 muscles</div>
    </div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 1556, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <div style={{ width: 64, height: 64, borderRadius: 32, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center" }}><Mark size={46} reversed /></div>
      <div style={{ fontWeight: 800, fontSize: 40, color: C.forest }}>Book Plume · anatomy mnemonic</div>
    </div>
  </AbsoluteFill>
);

/* Pinterest still 1000x1500 */
const Pin: React.FC<{ title: string; sub: string }> = ({ title, sub }) => (
  <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
    <Dots w={1000} h={1500} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 270, background: C.forest }} />
    <div style={{ position: "absolute", left: 60, top: 46, width: 880, color: C.paper, fontWeight: 800, fontSize: 62, lineHeight: 1.06, letterSpacing: -1 }}>{title}</div>
    <div style={{ position: "absolute", left: 0, top: 300 }}>
      <Quad t={30} id="pin" w={580} lit={ALL} pat={1} />
    </div>
    <div style={{ position: "absolute", left: 560, top: 330, width: 410, display: "flex", flexDirection: "column", gap: 26 }}>
      <div style={{ fontWeight: 800, fontSize: 34, color: C.matcha, lineHeight: 1.1 }}>1 RECTUS + 3 VASTI</div>
      {ORDER.map((q) => (
        <div key={q} style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <QChip q={q} size={70} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 30, color: C.forest, lineHeight: 1.05 }}>{MUS[q].name}</div>
            <div style={{ fontWeight: 700, fontSize: 21, color: C.matcha, marginTop: 3 }}>{MUS[q].where}</div>
          </div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 60, top: 1010, width: 900, fontSize: 33, fontWeight: 700, color: C.forest, lineHeight: 1.75 }}>
      <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px", fontWeight: 800 }}>patella</span> sesamoid bone in the quadriceps tendon
      <br />
      <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px", fontWeight: 800 }}>patellar ligament</span> patella → tibial tuberosity
      <br />
      <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px", fontWeight: 800 }}>quiz</span> only rectus femoris crosses the hip too
    </div>
    <div style={{ position: "absolute", left: 60, top: 1380, color: C.forest, fontWeight: 800, fontSize: 28, whiteSpace: "nowrap" }}>{sub}</div>
    <div style={{ position: "absolute", right: 50, top: 1366, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 34, padding: "8px 22px 12px", borderRadius: 16 }}>bookplume.com</div>
    <div style={{ position: "absolute", left: 60, bottom: 22, color: C.forest, opacity: 0.55, fontWeight: 700, fontSize: 18 }}>Diagram: Book Plume · reference plate Gray's Anatomy (1918) Fig. 430, public domain</div>
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
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "Quadriceps Muscles: 1 Rectus + 3 Vasti", sub: "Anatomy flashcards · study tips" }} />
  </>
);
