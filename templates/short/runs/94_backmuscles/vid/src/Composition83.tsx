import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT, useT } from "./kit";
import { END, Header, Mark, Subtitles } from "./Chrome83";
import { A832, Chip, MN, P832, V1, V1b, V2, V3, V4, V5, V6, V7, V8, V9, V10 } from "./Scenes83";
import { PlateBox74 } from "./Scenes74";
import { Glute, NNAME, NS } from "./Glute83";
import { Carousel } from "./Carousel83";

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
    <div style={{ position: "absolute", left: 60, width: 960, top: 300, textAlign: "center", fontWeight: 800, fontSize: 118, lineHeight: 1, letterSpacing: -4, color: C.forest, whiteSpace: "nowrap" }}>SACRAL PLEXUS</div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 428, textAlign: "center", fontWeight: 800, fontSize: 158, lineHeight: 1, letterSpacing: -4, color: C.red, whiteSpace: "nowrap" }}>5 BRANCHES</div>
    <PlateBox74 src={P832} aspect={A832} x={110} y={612} w={860} h={760} a={0} b={1} from={[0.5, 0.31, 0.92]} to={[0.5, 0.31, 0.92]} still credit="Gray's Anatomy, 1918 · PD" />
    <div style={{ position: "absolute", left: 60, width: 960, top: 1400, display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
      <div style={{ fontWeight: 800, fontSize: 62, color: C.forest, marginRight: 8 }}>Name them?</div>
      {NS.map((k) => <Chip key={k} l={k} size={86} />)}
    </div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 1546, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <div style={{ width: 64, height: 64, borderRadius: 32, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center" }}><Mark size={46} reversed /></div>
      <div style={{ fontWeight: 800, fontSize: 40, color: C.forest }}>Book Plume · sacral plexus mnemonic</div>
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
      <div style={{ position: "absolute", left: 235 - 400 * 0.95, top: 400 - 460 * 0.95 }}>
        <Glute t={30} id="pin" w={860 * 0.95} lit={{ SG: 0, IG: 0, SC: 0, PF: 0, PU: 0 }} pir={1} mark={{ SG: "S", IG: "I", SC: "S", PF: "P", PU: "P" }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 520, top: 310, width: 450, display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ fontWeight: 800, fontSize: 28, color: C.matcha, lineHeight: 1.1 }}>SOME IRISH SAILOR PESTERS POLLY</div>
      {NS.map((k) => (
        <div key={k} style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Chip l={k} size={70} />
          <div>
            <div style={{ fontWeight: 800, fontSize: k === "PF" ? 26 : 31, color: C.forest, lineHeight: 1.05 }}>{NNAME[k]}</div>
            <div style={{ fontWeight: 700, fontSize: 20, color: C.matcha, marginTop: 3 }}>{MN[k].note}</div>
          </div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 60, top: 1130, width: 900, fontSize: 31, fontWeight: 700, color: C.forest, lineHeight: 1.6 }}>
      <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px", fontWeight: 800 }}>roots</span> L4–S4 · on the piriformis<br />
      <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px", fontWeight: 800 }}>rule</span> 1 above piriformis, 4 below<br />
      <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px", fontWeight: 800 }}>quiz</span> gluteus maximus? inferior gluteal
    </div>
    <div style={{ position: "absolute", left: 60, top: 1395, color: C.forest, fontWeight: 800, fontSize: 28, whiteSpace: "nowrap" }}>{sub}</div>
    <div style={{ position: "absolute", right: 50, top: 1380, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 34, padding: "8px 22px 12px", borderRadius: 16 }}>bookplume.com</div>
    <div style={{ position: "absolute", left: 60, bottom: 18, color: C.forest, opacity: 0.55, fontWeight: 700, fontSize: 18 }}>Diagram: Book Plume · based on Gray's Anatomy (1918) Figs. 829, 832, public domain</div>
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
    <V1b />
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
    <Glute t={30} id="dg" w={860} lit={{ SG: 0, IG: 0, SC: 0, PF: 0, PU: 0 }} pir={1} mark={{ SG: "S", IG: "I", SC: "S", PF: "P", PU: "P" }} />
  </AbsoluteFill>
);
export const MyComposition = () => (
  <>
    <Composition id="Diag" component={Diag} durationInFrames={1} fps={30} width={860} height={920} />
    <Composition id="Main" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: false }} />
    <Composition id="Mask" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: true }} />
    <Composition id="Cover" component={Cover} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "Sacral Plexus Mnemonic: Some Irish Sailor Pesters Polly", sub: "Anatomy flashcards · study tips" }} />
    <Composition id="Carousel" component={Carousel} durationInFrames={1} fps={30} width={1080} height={1350} defaultProps={{ n: 1 }} />
  </>
);
