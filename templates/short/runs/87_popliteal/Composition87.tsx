import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT, useT } from "./kit";
import { END, Header, Mark, Subtitles } from "./Chrome87";
import { A551, Chip, NAME, PLATE, TO, V1, V2, V3, V4, V5, V6, V7, V8, V9, V10, V11, V12 } from "./Scenes87";
import { PlateBox74 } from "./Scenes74";
import { KORDER, Knee, SectKnee } from "./Knee87";
import { Carousel } from "./Carousel87";

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
    <div style={{ position: "absolute", left: 60, width: 960, top: 300, textAlign: "center", fontWeight: 800, fontSize: 108, lineHeight: 1, letterSpacing: -3, color: C.forest, whiteSpace: "nowrap" }}>BACK OF THE KNEE</div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 430, textAlign: "center", fontWeight: 800, fontSize: 150, lineHeight: 1, letterSpacing: -4, color: C.red, whiteSpace: "nowrap" }}>NAME ALL 5?</div>
    <PlateBox74 src={PLATE} aspect={A551} x={110} y={620} w={860} h={750} a={0} b={1} from={[0.5, 0.15, 0.82]} to={[0.5, 0.15, 0.82]} still credit="Gray's Anatomy, 1918 · PD" />
    <div style={{ position: "absolute", left: 60, width: 960, top: 1398, display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
      <div style={{ fontWeight: 800, fontSize: 56, color: C.forest, marginRight: 8 }}>Popliteal fossa</div>
      {[0, 1, 2, 3, 4].map((i) => <Chip key={i} k="?" size={80} />)}
    </div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 1546, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <div style={{ width: 64, height: 64, borderRadius: 32, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center" }}><Mark size={46} reversed /></div>
      <div style={{ fontWeight: 800, fontSize: 40, color: C.forest }}>Book Plume · leg anatomy mnemonic</div>
    </div>
  </AbsoluteFill>
);

/* Pinterest still 1000x1500 */
const Pin: React.FC<{ title: string; sub: string }> = ({ title, sub }) => (
  <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
    <Dots w={1000} h={1500} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 270, background: C.forest }} />
    <div style={{ position: "absolute", left: 60, top: 46, width: 880, color: C.paper, fontWeight: 800, fontSize: 60, lineHeight: 1.06, letterSpacing: -1 }}>{title}</div>
    <div style={{ position: "absolute", left: 20, top: 300, width: 440, height: 800, overflow: "hidden", borderRadius: 30, background: C.card, boxShadow: `0 0 0 4px ${C.line}` }}>
      <div style={{ position: "absolute", left: 220 - 450 * 0.86, top: 400 - 470 * 0.86 }}>
        <Knee t={30} id="pin" w={900 * 0.86} lit={{ S: 0, A: 0, V: 0, N: 0, B: 0 }} diamond={1} ssv={1} tag={{ S: "S", A: "A", V: "V", N: "N", B: "B" }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 485, top: 305, width: 500, display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ fontWeight: 800, fontSize: 30, color: C.matcha, lineHeight: 1.1 }}>Serve And Volley Next Ball</div>
      {KORDER.map((k) => (
        <div key={k} style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Chip k={k} size={70} />
          <div>
            <div style={{ fontWeight: 800, fontSize: k === "S" ? 23 : 28, color: C.forest, lineHeight: 1.05 }}>{NAME[k]}</div>
            <div style={{ fontWeight: 700, fontSize: 20, color: C.matcha, marginTop: 3 }}>{TO[k]}</div>
          </div>
        </div>
      ))}
      <div style={{ width: 290, height: 210, alignSelf: "center", overflow: "hidden", borderRadius: 20, background: C.card, boxShadow: `0 0 0 3px ${C.line}`, position: "relative" }}>
        <div style={{ position: "absolute", left: 145 - 470 * 0.45, top: 105 - 470 * 0.45 }}>
          <SectKnee t={30} w={900 * 0.45} id="pins" lit={{ A: 0, V: 0, N: 0 }} />
        </div>
      </div>
    </div>
    <div style={{ position: "absolute", left: 60, top: 1130, width: 900, fontSize: 30, fontWeight: 700, color: C.forest, lineHeight: 1.6 }}>
      <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px", fontWeight: 800 }}>order</span> medial → lateral: S · A · V · N · B<br />
      <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px", fontWeight: 800 }}>depth</span> skin → bone: nerve · vein · artery<br />
      <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px", fontWeight: 800 }}>below</span> 2 heads of gastrocnemius
    </div>
    <div style={{ position: "absolute", left: 60, top: 1395, color: C.forest, fontWeight: 800, fontSize: 28, whiteSpace: "nowrap" }}>{sub}</div>
    <div style={{ position: "absolute", right: 50, top: 1380, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 34, padding: "8px 22px 12px", borderRadius: 16 }}>bookplume.com</div>
    <div style={{ position: "absolute", left: 60, bottom: 18, color: C.forest, opacity: 0.55, fontWeight: 700, fontSize: 18 }}>Diagrams: Book Plume · based on Gray's Anatomy (1918) Fig. 551, public domain</div>
  </AbsoluteFill>
);

const Grid: React.FC = () => {
  const t = useT();
  return <Dots w={1080} h={1920} o={(t * 40) % 54} />;
};

export const Video: React.FC<{ mask?: boolean }> = ({ mask }) => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Grid />
    <V1 /><V2 /><V3 /><V4 /><V5 /><V6 /><V7 /><V8 /><V9 /><V10 /><V11 /><V12 />
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
    {v === 0 && <Knee t={30} id="dg" w={900} lit={{ S: 0, A: 0, V: 0, N: 0, B: 0, CF: 0 }} diamond={1} ssv={1} tag={{ S: "S", A: "A", V: "V", N: "N", B: "B" }} />}
    {v === 1 && <Knee t={30} id="dg" w={900} />}
    {v === 2 && <SectKnee t={30} id="dg" w={900} lit={{ A: 0, V: 0, N: 0 }} arrow={1} />}
  </AbsoluteFill>
);
export const MyComposition = () => (
  <>
    <Composition id="Diag" component={Diag} durationInFrames={1} fps={30} width={900} height={1000} defaultProps={{ v: 0 }} />
    <Composition id="Main" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: false }} />
    <Composition id="Mask" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: true }} />
    <Composition id="Cover" component={Cover} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "Popliteal Fossa Mnemonic: Serve And Volley Next Ball", sub: "Anatomy flashcards · study tips" }} />
    <Composition id="Carousel" component={Carousel} durationInFrames={1} fps={30} width={1080} height={1350} defaultProps={{ n: 1 }} />
  </>
);
