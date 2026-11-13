import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT, useT } from "./kit";
import { END, Header, Mark, Subtitles } from "./Chrome90";
import { A190, P190, FChip, V1, V2, V3, V4, V5, V6, V7, V8, V9 } from "./Scenes90";
import { PlateBox74 } from "./Scenes74";
import { Face, FORDER, FNAME, FCOUNT } from "./Face90";

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
    <div style={{ position: "absolute", left: 60, width: 960, top: 296, textAlign: "center", fontWeight: 800, fontSize: 126, lineHeight: 1, letterSpacing: -4, color: C.forest, whiteSpace: "nowrap" }}>14 FACE BONES</div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 436, textAlign: "center", fontWeight: 800, fontSize: 132, lineHeight: 1, letterSpacing: -4, color: C.red, whiteSpace: "nowrap" }}>ONLY 1 MOVES</div>
    <PlateBox74 src={P190} aspect={A190} x={150} y={606} w={780} h={790} a={0} b={1} from={[0.5, 0.62, 0.92]} to={[0.5, 0.62, 0.92]} still credit="Gray's Anatomy, 1918 · PD" />
    <div style={{ position: "absolute", left: 60, width: 960, top: 1418, display: "flex", justifyContent: "center", alignItems: "center", gap: 10 }}>
      {FORDER.map((k) => <FChip key={k} b={k} size={82} />)}
    </div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 1546, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <div style={{ width: 64, height: 64, borderRadius: 32, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center" }}><Mark size={46} reversed /></div>
      <div style={{ fontWeight: 800, fontSize: 40, color: C.forest }}>Book Plume · facial bones mnemonic</div>
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
      <div style={{ position: "absolute", left: 215 - 500 * 0.6, top: 400 - 700 * 0.6 }}>
        <Face t={30} id="pin" w={1000 * 0.6} lit={{ V: 0, C: 0, N: 0, MX: 0, MD: 0, P: 0, Z: 0, L: 0 }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 475, top: 306, width: 510, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ fontWeight: 800, fontSize: 28, color: C.matcha, lineHeight: 1.1 }}>Virgil Can Not Make My Pet Zebra Laugh</div>
      {FORDER.map((k) => (
        <div key={k} style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <FChip b={k} size={60} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 29, color: C.forest, lineHeight: 1.05 }}>{FNAME[k]}</div>
            <div style={{ fontWeight: 700, fontSize: 19, color: C.matcha, marginTop: 3 }}>{FCOUNT[k] === 2 ? "pair ×2" : "single"}</div>
          </div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 60, top: 1130, width: 900, fontSize: 31, fontWeight: 700, color: C.forest, lineHeight: 1.6 }}>
      <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px", fontWeight: 800 }}>count</span> 8 names = 14 bones (6 pairs + 2 singles)<br />
      <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px", fontWeight: 800 }}>singles</span> vomer (nasal septum) + mandible<br />
      <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px", fontWeight: 800 }}>quiz</span> mandible = the only skull bone that moves
    </div>
    <div style={{ position: "absolute", left: 60, top: 1395, color: C.forest, fontWeight: 800, fontSize: 28, whiteSpace: "nowrap" }}>{sub}</div>
    <div style={{ position: "absolute", right: 50, top: 1380, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 34, padding: "8px 22px 12px", borderRadius: 16 }}>bookplume.com</div>
    <div style={{ position: "absolute", left: 60, bottom: 18, color: C.forest, opacity: 0.55, fontWeight: 700, fontSize: 18 }}>Diagram: Book Plume · based on Gray's Anatomy (1918) Fig. 190, public domain</div>
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

const Diag: React.FC<{ v: number }> = ({ v }) => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Face t={30} id="dg" w={800} lit={v === 0 ? { V: 0, C: 0, N: 0, MX: 0, MD: 0, P: 0, Z: 0, L: 0 } : {}} ghost={v === 1} open={v === 1 ? 1 : 0} />
  </AbsoluteFill>
);

export const MyComposition = () => (
  <>
    <Composition id="Diag" component={Diag} durationInFrames={1} fps={30} width={800} height={1000} defaultProps={{ v: 0 }} />
    <Composition id="Main" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: false }} />
    <Composition id="Mask" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: true }} />
    <Composition id="Cover" component={Cover} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "14 Facial Bones Mnemonic: Virgil Can Not Make My Pet Zebra Laugh", sub: "Anatomy flashcards · study tips" }} />
  </>
);
