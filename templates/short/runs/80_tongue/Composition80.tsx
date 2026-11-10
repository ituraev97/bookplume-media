import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT, useT } from "./kit";
import { END, Header, Mark, Subtitles } from "./Chrome80";
import { A1019, GChip, MN, PLATE, V1, V2, V3, V4, V5, V6, V7, V8, V9, V10 } from "./Scenes80";
import { PlateBox74 } from "./Scenes74";
import { LETTERS, MNAME, Section, Tongue } from "./Tongue80";

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
    <div style={{ position: "absolute", left: 60, width: 960, top: 300, textAlign: "center", fontWeight: 800, fontSize: 112, lineHeight: 1, letterSpacing: -4, color: C.forest, whiteSpace: "nowrap" }}>YOUR TONGUE IS</div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 424, textAlign: "center", fontWeight: 800, fontSize: 158, lineHeight: 1, letterSpacing: -4, color: C.red, whiteSpace: "nowrap" }}>8 MUSCLES</div>
    <PlateBox74 src={PLATE} aspect={A1019} x={110} y={610} w={860} h={760} a={0} b={1} from={[0.46, 0.52, 0.86]} to={[0.46, 0.52, 0.86]} still credit="Gray's Anatomy, 1918 · PD" />
    <div style={{ position: "absolute", left: 60, width: 960, top: 1400, display: "flex", justifyContent: "center", alignItems: "center", gap: 18 }}>
      <div style={{ fontWeight: 800, fontSize: 64, color: C.forest, marginRight: 8 }}>Name them?</div>
      {LETTERS.map((k) => <GChip key={k} l={k} size={96} />)}
    </div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 1546, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <div style={{ width: 64, height: 64, borderRadius: 32, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center" }}><Mark size={46} reversed /></div>
      <div style={{ fontWeight: 800, fontSize: 40, color: C.forest }}>Book Plume · tongue muscles mnemonic</div>
    </div>
  </AbsoluteFill>
);

/* Pinterest still 1000x1500 */
const Pin: React.FC<{ title: string; sub: string }> = ({ title, sub }) => (
  <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
    <Dots w={1000} h={1500} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 270, background: C.forest }} />
    <div style={{ position: "absolute", left: 60, top: 46, width: 880, color: C.paper, fontWeight: 800, fontSize: 62, lineHeight: 1.06, letterSpacing: -1 }}>{title}</div>
    <div style={{ position: "absolute", left: -20, top: 300, width: 540, height: 600, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: -10, top: -40 }}>
        <Tongue t={30} id="pin" w={600} lit={{ G: 0, H: 0, S: 0, P: 0 }} mark={{ G: "G", H: "H", S: "S", P: "P" }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 540, top: 320, width: 430, display: "flex", flexDirection: "column", gap: 26 }}>
      <div style={{ fontWeight: 800, fontSize: 30, color: C.matcha, lineHeight: 1.1 }}>4 EXTRINSIC MUSCLES</div>
      {LETTERS.map((k) => (
        <div key={k} style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <GChip l={k} size={70} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 30, color: C.forest, lineHeight: 1.05 }}>{MNAME[k]}</div>
            <div style={{ fontWeight: 700, fontSize: 22, color: C.matcha, marginTop: 3 }}>{MN[k].from} → {MN[k].does}</div>
          </div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 600, top: 880, width: 360 }}>
      <Section t={30} w={340} id="pinsec" lit={{ SL: 0, IL: 0, TV: 0, VE: 0 }} />
    </div>
    <div style={{ position: "absolute", left: 60, top: 930, width: 520, fontSize: 30, fontWeight: 800, color: C.forest, lineHeight: 1.35 }}>
      + 4 intrinsic (shape):<br />
      <span style={{ fontWeight: 700, color: C.matcha }}>superior + inferior longitudinal, transverse, vertical</span>
    </div>
    <div style={{ position: "absolute", left: 60, top: 1190, width: 900, fontSize: 32, fontWeight: 700, color: C.forest, lineHeight: 1.6 }}>
      <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px", fontWeight: 800 }}>quiz</span> which skips CN XII? palatoglossus (vagus, CN X)
    </div>
    <div style={{ position: "absolute", left: 60, top: 1385, color: C.forest, fontWeight: 800, fontSize: 28, whiteSpace: "nowrap" }}>{sub}</div>
    <div style={{ position: "absolute", right: 50, top: 1370, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 34, padding: "8px 22px 12px", borderRadius: 16 }}>bookplume.com</div>
    <div style={{ position: "absolute", left: 60, bottom: 20, color: C.forest, opacity: 0.55, fontWeight: 700, fontSize: 18 }}>Diagrams: Book Plume · based on Gray's Anatomy (1918) Figs. 1019, 1020, public domain</div>
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

const Diag: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Tongue t={30} id="dg" w={900} lit={{ G: 0, H: 0, S: 0, P: 0 }} arrows={{ G: 0, H: 0, S: 0, P: 0 }} origins={{ CHIN: 0, HYOID: 0, STYLOID: 0, PALATE: 0 }} />
    <div style={{ position: "absolute", left: 100, top: 1000 }}><Section t={30} w={700} id="dgs" lit={{ SL: 0, IL: 0, TV: 0, VE: 0 }} /></div>
  </AbsoluteFill>
);
export const MyComposition = () => (
  <>
    <Composition id="Diag" component={Diag} durationInFrames={1} fps={30} width={900} height={1560} />
    <Composition id="Main" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: false }} />
    <Composition id="Mask" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: true }} />
    <Composition id="Cover" component={Cover} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "Tongue Muscles Mnemonic: Go Have Some Pizza", sub: "Anatomy flashcards · study tips" }} />
  </>
);
