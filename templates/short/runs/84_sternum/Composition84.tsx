import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT, useT } from "./kit";
import { END, Header, Mark, Subtitles } from "./Chrome84";
import { A112, Chip, NOTE, P112, SwordIcon, V1, V2, V3, V4, V5, V6, V7, V7b, V7c, V8, V9 } from "./Scenes84";
import { PlateBox74 } from "./Scenes74";
import { PNAME, PS, PSWORD, Sternum } from "./Sternum84";

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
    <div style={{ position: "absolute", left: 60, width: 960, top: 300, textAlign: "center", fontWeight: 800, fontSize: 100, lineHeight: 1, letterSpacing: -4, color: C.forest, whiteSpace: "nowrap" }}>YOUR BREASTBONE</div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 424, display: "flex", justifyContent: "center", alignItems: "center", gap: 20 }}>
      <div style={{ fontWeight: 800, fontSize: 134, lineHeight: 1, letterSpacing: -4, color: C.red, whiteSpace: "nowrap" }}>IS A SWORD</div>
      <div style={{ flex: "0 0 150px", width: 150, height: 150 }}><SwordIcon size={150} rot={35} /></div>
    </div>
    <PlateBox74 src={P112} aspect={A112} x={110} y={612} w={860} h={760} a={0} b={1} from={[0.47, 0.395, 0.86]} to={[0.47, 0.395, 0.86]} still credit="Gray's Anatomy, 1918 · PD"
      labels={[
        { x: 0.47, y: 0.2, text: "handle", t: 0, ox: 160, oy: -30 },
        { x: 0.47, y: 0.42, text: "blade", t: 0, ox: 170, oy: 10 },
        { x: 0.47, y: 0.61, text: "tip", t: 0, ox: 160, oy: 20 },
      ]} />
    <div style={{ position: "absolute", left: 60, width: 960, top: 1400, display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
      <div style={{ fontWeight: 800, fontSize: 62, color: C.forest, marginRight: 8 }}>Name its 3 parts?</div>
      {PS.map((k) => <Chip key={k} p={k} size={86} />)}
    </div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 1546, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <div style={{ width: 64, height: 64, borderRadius: 32, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center" }}><Mark size={46} reversed /></div>
      <div style={{ fontWeight: 800, fontSize: 40, color: C.forest }}>Book Plume · sternum mnemonic</div>
    </div>
  </AbsoluteFill>
);

/* Pinterest still 1000x1500 */
const Pin: React.FC<{ title: string; sub: string }> = ({ title, sub }) => (
  <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
    <Dots w={1000} h={1500} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 270, background: C.forest }} />
    <div style={{ position: "absolute", left: 60, top: 46, width: 880, color: C.paper, fontWeight: 800, fontSize: 60, lineHeight: 1.06, letterSpacing: -1 }}>{title}</div>
    <div style={{ position: "absolute", left: 20, top: 300, width: 470, height: 800, overflow: "hidden", borderRadius: 30, background: C.card, boxShadow: `0 0 0 4px ${C.line}` }}>
      <div style={{ position: "absolute", left: 235 - 430 * 0.9, top: 400 - 440 * 0.9 }}>
        <Sternum t={30} id="pin" w={860 * 0.9} lit={{ M: 0, B: 0, X: 0 }} sword={[0.55, 0.55, 0.55]} angle={1} mark={{ M: "H", B: "B", X: "T" }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 520, top: 320, width: 450, display: "flex", flexDirection: "column", gap: 34 }}>
      <div style={{ fontWeight: 800, fontSize: 30, color: C.matcha, lineHeight: 1.1 }}>HANDLE · BLADE · TIP</div>
      {PS.map((k) => (
        <div key={k} style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Chip p={k} size={74} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 34, color: C.forest, lineHeight: 1.05 }}>{PNAME[k]}</div>
            <div style={{ fontWeight: 700, fontSize: 21, color: C.matcha, marginTop: 4, width: 340 }}>{PSWORD[k]} · {NOTE[k]}</div>
          </div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 60, top: 1130, width: 900, fontSize: 31, fontWeight: 700, color: C.forest, lineHeight: 1.6 }}>
      <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px", fontWeight: 800 }}>sternal angle</span> manubrium meets body<br />
      <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px", fontWeight: 800 }}>rib</span> the 2nd rib joins here · T4/T5 level<br />
      <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px", fontWeight: 800 }}>trick</span> count ribs from the sternal angle
    </div>
    <div style={{ position: "absolute", left: 60, top: 1395, color: C.forest, fontWeight: 800, fontSize: 28, whiteSpace: "nowrap" }}>{sub}</div>
    <div style={{ position: "absolute", right: 50, top: 1380, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 34, padding: "8px 22px 12px", borderRadius: 16 }}>bookplume.com</div>
    <div style={{ position: "absolute", left: 60, bottom: 18, color: C.forest, opacity: 0.55, fontWeight: 700, fontSize: 18 }}>Diagram: Book Plume · based on Gray's Anatomy (1918) Figs. 112, 115, 117, public domain</div>
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
    <V7b />
    <V7c />
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

const Diag: React.FC<{ v: number }> = ({ v }) => (
  <AbsoluteFill style={{ background: C.paper }}>
    {v === 0 && <Sternum t={1} id="d" w={860} />}
    {v === 1 && <Sternum t={1} id="d" w={860} lit={{ M: 0, B: 0, X: 0 }} sword={[1, 1, 1]} clav={1} rib2={1} angle={1} count={9} />}
  </AbsoluteFill>
);
export const MyComposition = () => (
  <>
    <Composition id="Diag" component={Diag} durationInFrames={1} fps={30} width={860} height={920} defaultProps={{ v: 0 }} />
    <Composition id="Main" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: false }} />
    <Composition id="Mask" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: true }} />
    <Composition id="Cover" component={Cover} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "Sternum Parts Mnemonic: Handle, Blade, Tip", sub: "Anatomy flashcards · study tips" }} />
  </>
);
