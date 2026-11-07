import React from "react";
import { AbsoluteFill, Composition, Img, staticFile } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT, useT } from "./kit";
import { END, Header, Mark, Subtitles } from "./Chrome";
import { ASKT, AHIP, SUMMARY, V1, V2, V3, V4, V5, V6, V7, V8, V9, liveAlpha } from "./Scenes68";
import { HipBone } from "./Bones68";

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

/** Cropped view of a plate inside a fixed box: image region starting at (fx0, fy0), fx1 = right edge fraction */
const PlateWindow: React.FC<{ src: string; aspect: number; x: number; y: number; w: number; h: number; fx0: number; fy0: number; fx1: number; covers?: { x: number; y: number; w: number; h: number }[] }> = ({ src, aspect, x, y, w, h, fx0, fy0, fx1, covers = [] }) => {
  const iw = w / (fx1 - fx0);
  const ih = iw / aspect;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden", borderRadius: 40, background: C.paper, boxShadow: `0 0 0 5px ${C.line}, 0 20px 44px rgba(31,42,20,0.18)` }}>
      <div style={{ position: "absolute", left: -fx0 * iw, top: -fy0 * ih, width: iw, height: ih }}>
        <Img src={staticFile(src)} style={{ width: iw, height: ih, display: "block" }} />
        {covers.map((c, j) => <div key={j} style={{ position: "absolute", left: c.x * iw, top: c.y * ih, width: c.w * iw, height: c.h * ih, background: C.paper }} />)}
      </div>
    </div>
  );
};

/* Cover 1080x1920: all text in y 280–1640, x 60–1020 */
const Cover: React.FC = () => {
  const fx0 = 0.04, fx1 = 0.96, fy0 = 0.05, W = 800;
  const iw = W / (fx1 - fx0), ih = iw / ASKT;
  const ax = 140 + (0.5 - fx0) * iw, ay = 640 + (0.22 - fy0) * ih;
  return (
    <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
      <Dots w={1080} h={1920} />
      <div style={{ position: "absolute", left: 60, width: 960, top: 300, textAlign: "center", fontWeight: 800, fontSize: 98, lineHeight: 1, letterSpacing: -4, color: C.forest, whiteSpace: "nowrap" }}>BABIES: <span style={{ color: C.red }}>300</span> BONES</div>
      <div style={{ position: "absolute", left: 60, width: 960, top: 440, textAlign: "center", fontWeight: 800, fontSize: 116, lineHeight: 1, letterSpacing: -4, color: C.forest, whiteSpace: "nowrap" }}>YOU: <span style={{ background: C.banana, borderRadius: 22, padding: "0 18px" }}>206</span></div>
      <PlateWindow src="plates/skull_top.png" aspect={ASKT} x={140} y={640} w={W} h={720} fx0={fx0} fy0={fy0} fx1={fx1} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <ellipse cx={ax} cy={ay} rx={95} ry={110} fill="none" stroke={C.red} strokeWidth={11} />
      </svg>
      <div style={{ position: "absolute", left: 60, width: 960, top: 1385, display: "flex", justifyContent: "center" }}>
        <div style={{ background: C.forest, color: C.paper, fontWeight: 800, fontSize: 64, padding: "10px 36px 18px", borderRadius: 30, boxShadow: "0 8px 0 rgba(31,42,20,0.18)", whiteSpace: "nowrap" }}>where do they go?</div>
      </div>
      <div style={{ position: "absolute", left: 60, width: 960, top: 1556, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <div style={{ width: 64, height: 64, borderRadius: 32, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center" }}><Mark size={46} reversed /></div>
        <div style={{ fontWeight: 800, fontSize: 40, color: C.forest }}>Book Plume · anatomy fact</div>
      </div>
    </AbsoluteFill>
  );
};

/* Pinterest still 1000x1500 */
const Pin: React.FC<{ title: string; sub: string }> = ({ title, sub }) => (
  <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 300, background: C.forest }} />
    <div style={{ position: "absolute", left: 60, top: 46, width: 880, color: C.paper, fontWeight: 800, fontSize: 68, lineHeight: 1.04, letterSpacing: -1 }}>{title}</div>
    <PlateWindow src="plates/skull_top.png" aspect={ASKT} x={40} y={335} w={300} h={370} fx0={0} fy0={0} fx1={1} />
    <PlateWindow src="plates/hip_ossif.png" aspect={AHIP} x={355} y={335} w={300} h={370} fx0={0} fy0={0} fx1={1} />
    <div style={{ position: "absolute", left: 670, top: 335, width: 290, height: 370, borderRadius: 36, background: C.card, boxShadow: `0 0 0 4px ${C.line}`, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 25, top: 20 }}>
        <HipBone w={240} id="pin" t={0} il={1} is={1} pu={1} ac={1} />
      </div>
      <div style={{ position: "absolute", left: 0, width: 290, top: 300, textAlign: "center", fontWeight: 800, fontSize: 24, color: C.forest, lineHeight: 1.15 }}>ilium · <span style={{ color: C.red }}>ischium</span> · pubis<br /><span style={{ color: C.matcha }}>meet at the acetabulum</span></div>
    </div>
    <div style={{ position: "absolute", left: 60, top: 750, width: 880, display: "flex", flexDirection: "column", gap: 16 }}>
      {SUMMARY.map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: i === 0 ? C.banana : C.matcha, border: `4px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 24, color: C.forest }}>{i + 1}</div>
          <div style={{ fontWeight: 800, fontSize: 38, color: C.forest }}>{s}</div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 60, top: 1250, width: 880, color: C.forest, fontWeight: 800, fontSize: 28, lineHeight: 1.2 }}>Trick: you SIT on your ISCHIUM (ischial tuberosity = sit bones)</div>
    <div style={{ position: "absolute", left: 60, top: 1350, color: C.forest, fontWeight: 800, fontSize: 28, whiteSpace: "nowrap" }}>{sub}</div>
    <div style={{ position: "absolute", right: 50, top: 1338, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 34, padding: "8px 22px 12px", borderRadius: 16 }}>bookplume.com</div>
    <div style={{ position: "absolute", left: 60, bottom: 22, color: C.forest, opacity: 0.55, fontWeight: 700, fontSize: 18 }}>Plates: Gray's Anatomy (1918), Figs. 197 & 237, public domain · diagram: Book Plume</div>
  </AbsoluteFill>
);

const Grid: React.FC = () => {
  const t = useT();
  return <Dots w={1080} h={1920} o={(t * 40) % 54} />;
};
const HeaderBack: React.FC = () => {
  const a = liveAlpha(useT());
  if (a <= 0) return null;
  return <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 462, background: C.paper, opacity: a }} />;
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
    <HeaderBack />
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
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "Babies ~300 Bones, Adults 206: Where Do They Go?", sub: "Anatomy flashcards · study tips" }} />
  </>
);
