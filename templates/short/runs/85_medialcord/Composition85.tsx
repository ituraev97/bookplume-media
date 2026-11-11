import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT, useT } from "./kit";
import { END, Header, Mark, Subtitles } from "./Chrome85";
import { A809, Chip, NAME, PLATE, TO, V1, V2, V3, V4, V5, V6, V7, V8, V8b, V9, V10 } from "./Scenes85";
import { PlateBox74 } from "./Scenes74";
import { BORDER, Medial } from "./Medial85";

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
    <div style={{ position: "absolute", left: 60, width: 960, top: 300, textAlign: "center", fontWeight: 800, fontSize: 132, lineHeight: 1, letterSpacing: -4, color: C.forest, whiteSpace: "nowrap" }}>MEDIAL CORD</div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 440, textAlign: "center", fontWeight: 800, fontSize: 150, lineHeight: 1, letterSpacing: -4, color: C.red, whiteSpace: "nowrap" }}>5 BRANCHES</div>
    <PlateBox74 src={PLATE} aspect={A809} x={110} y={620} w={860} h={750} a={0} b={1} from={[0.44, 0.4, 0.78]} to={[0.44, 0.4, 0.78]} still credit="Gray's Anatomy, 1918 · PD" />
    <div style={{ position: "absolute", left: 60, width: 960, top: 1398, display: "flex", justifyContent: "center", alignItems: "center", gap: 14 }}>
      <div style={{ fontWeight: 800, fontSize: 60, color: C.forest, marginRight: 10 }}>Name them?</div>
      {BORDER.map((k) => <Chip key={k} b={k} size={84} />)}
    </div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 1546, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
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
    <div style={{ position: "absolute", left: 60, top: 46, width: 880, color: C.paper, fontWeight: 800, fontSize: 60, lineHeight: 1.06, letterSpacing: -1 }}>{title}</div>
    <div style={{ position: "absolute", left: 20, top: 300, width: 440, height: 800, overflow: "hidden", borderRadius: 30, background: C.card, boxShadow: `0 0 0 4px ${C.line}` }}>
      <div style={{ position: "absolute", left: 220 - 520 * 0.78, top: 400 - 540 * 0.78 }}>
        <Medial t={30} id="pin" w={900 * 0.78} lit={{ MP: 0, MA: 0, MF: 0, MR: 0, UL: 0 }} skinA={1} skinF={1} mark={{ MP: "M", MA: "M", MF: "M", MR: "M", UL: "U" }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 490, top: 310, width: 490, display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ fontWeight: 800, fontSize: 30, color: C.matcha, lineHeight: 1.1 }}>M4U = 4 M's + a U</div>
      {BORDER.map((k) => (
        <div key={k} style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Chip b={k} size={70} />
          <div>
            <div style={{ fontWeight: 800, fontSize: k === "MF" || k === "MA" ? 23 : 30, color: C.forest, lineHeight: 1.05 }}>{NAME[k]}</div>
            <div style={{ fontWeight: 700, fontSize: 20, color: C.matcha, marginTop: 3 }}>{TO[k]}</div>
          </div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 60, top: 1130, width: 900, fontSize: 31, fontWeight: 700, color: C.forest, lineHeight: 1.6 }}>
      <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px", fontWeight: 800 }}>roots</span> C8–T1 · medial to the axillary artery<br />
      <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px", fontWeight: 800 }}>rule</span> 2 skin nerves, 1 pec nerve, 2 big nerves<br />
      <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px", fontWeight: 800 }}>quiz</span> median's 2nd root? lateral cord
    </div>
    <div style={{ position: "absolute", left: 60, top: 1395, color: C.forest, fontWeight: 800, fontSize: 28, whiteSpace: "nowrap" }}>{sub}</div>
    <div style={{ position: "absolute", right: 50, top: 1380, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 34, padding: "8px 22px 12px", borderRadius: 16 }}>bookplume.com</div>
    <div style={{ position: "absolute", left: 60, bottom: 18, color: C.forest, opacity: 0.55, fontWeight: 700, fontSize: 18 }}>Diagram: Book Plume · based on Gray's Anatomy (1918) Fig. 809, public domain</div>
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
    <V8b />
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
    {v === 0 && <Medial t={30} id="dg" w={860} lit={{ MP: 0, MA: 0, MF: 0, MR: 0, UL: 0 }} skinA={1} skinF={1} pec={1} epi={1} mark={{ MP: "M", MA: "M", MF: "M", MR: "M", UL: "U" }} />}
    {v === 1 && <Medial t={30} id="dg" w={860} />}
    {v === 2 && <Medial t={30} id="dg" w={860} lit={{ MR: 0 }} lat={0} />}
  </AbsoluteFill>
);
export const MyComposition = () => (
  <>
    <Composition id="Diag" component={Diag} durationInFrames={1} fps={30} width={860} height={1000} defaultProps={{ v: 0 }} />
    <Composition id="Main" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: false }} />
    <Composition id="Mask" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: true }} />
    <Composition id="Cover" component={Cover} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "Medial Cord of the Brachial Plexus: M4U Mnemonic", sub: "Anatomy flashcards · study tips" }} />
  </>
);
