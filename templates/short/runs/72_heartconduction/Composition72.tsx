import React from "react";
import { AbsoluteFill, Composition, Img, staticFile } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT, useT } from "./kit";
import { END, Header, Mark, Subtitles } from "./Chrome";
import { AHIS, ARA, SUMMARY, V1, V2, V3, V4, V5, V6, V7, V8, liveAlpha } from "./Scenes72";
import { STEP_COL as LV } from "./Cond72";

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

const PlateWindow: React.FC<{ src: string; aspect: number; x: number; y: number; w: number; h: number; fx0: number; fy0: number; fx1: number }> = ({ src, aspect, x, y, w, h, fx0, fy0, fx1 }) => {
  const iw = w / (fx1 - fx0);
  const ih = iw / aspect;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden", borderRadius: 40, background: C.paper, boxShadow: `0 0 0 5px ${C.line}, 0 20px 44px rgba(31,42,20,0.18)` }}>
      <div style={{ position: "absolute", left: -fx0 * iw, top: -fy0 * ih, width: iw, height: ih }}>
        <Img src={staticFile(src)} style={{ width: iw, height: ih, display: "block" }} />
      </div>
    </div>
  );
};

/* Cover 1080x1920: all text in y 280–1640, x 60–1020 */
const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
    <Dots w={1080} h={1920} />
    <div style={{ position: "absolute", left: 60, width: 960, top: 300, textAlign: "center", fontWeight: 800, fontSize: 90, lineHeight: 1, letterSpacing: -4, color: C.forest, whiteSpace: "nowrap" }}>YOUR HEART DOESN'T</div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 430, textAlign: "center", fontWeight: 800, fontSize: 106, lineHeight: 1, letterSpacing: -4, color: C.forest, whiteSpace: "nowrap" }}>NEED YOUR <span style={{ background: C.banana, borderRadius: 24, padding: "0 18px" }}>BRAIN</span></div>
    <PlateWindow src="plates/his.png" aspect={AHIS} x={150} y={590} w={780} h={770} fx0={0.0} fy0={0.12} fx1={1.0} />
    <div style={{ position: "absolute", left: 60, width: 960, top: 1400, display: "flex", justifyContent: "center" }}>
      <div style={{ background: C.forest, color: C.paper, fontWeight: 800, fontSize: 62, padding: "10px 40px 18px", borderRadius: 30, boxShadow: "0 8px 0 rgba(31,42,20,0.18)", whiteSpace: "nowrap" }}>
        its own <span style={{ color: C.banana }}>pacemaker</span>
      </div>
    </div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 1556, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <div style={{ width: 64, height: 64, borderRadius: 32, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center" }}><Mark size={46} reversed /></div>
      <div style={{ fontWeight: 800, fontSize: 40, color: C.forest }}>Book Plume · anatomy fact</div>
    </div>
  </AbsoluteFill>
);

/* Pinterest still 1000x1500 */
const Pin: React.FC<{ title: string; sub: string }> = ({ title, sub }) => (
  <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 300, background: C.forest }} />
    <div style={{ position: "absolute", left: 60, top: 46, width: 880, color: C.paper, fontWeight: 800, fontSize: 68, lineHeight: 1.04, letterSpacing: -1 }}>{title}</div>
    <PlateWindow src="plates/his.png" aspect={AHIS} x={40} y={335} w={450} h={385} fx0={0.05} fy0={0.33} fx1={0.95} />
    <PlateWindow src="plates/ra.png" aspect={ARA} x={510} y={335} w={450} h={385} fx0={0.0} fy0={0.0} fx1={0.62} />
    <div style={{ position: "absolute", left: 60, top: 750, width: 880, display: "flex", flexDirection: "column", gap: 16 }}>
      {SUMMARY.map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: LV[Math.min(i, 4)], border: `4px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 24, color: C.forest }}>{i + 1}</div>
          <div style={{ fontWeight: 800, fontSize: 40, color: C.forest }}>{s}</div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 60, top: 1250, width: 880, color: C.forest, fontWeight: 800, fontSize: 30, lineHeight: 1.2 }}>Spark → pause → spread: your heart starts every beat itself</div>
    <div style={{ position: "absolute", left: 60, top: 1352, color: C.forest, fontWeight: 800, fontSize: 28, whiteSpace: "nowrap" }}>{sub}</div>
    <div style={{ position: "absolute", right: 50, top: 1338, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 34, padding: "8px 22px 12px", borderRadius: 16 }}>bookplume.com</div>
    <div style={{ position: "absolute", left: 60, bottom: 22, color: C.forest, opacity: 0.55, fontWeight: 700, fontSize: 18 }}>Plates: Gray's Anatomy (1918), Figs. 501 & 493, public domain · diagrams: Book Plume</div>
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
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "Heart Conduction System: SA Node to Purkinje Fibers", sub: "Cardiac anatomy · nursing & A&P study" }} />
  </>
);
