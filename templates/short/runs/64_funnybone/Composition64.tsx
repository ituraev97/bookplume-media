import React from "react";
import { AbsoluteFill, Composition, Img, staticFile } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT, useT } from "./kit";
import { END, Header, Mark, Subtitles } from "./Chrome";
import { AARM, AHAND, ARM_COVERS, HAND_COVERS, SUMMARY, V1, V2, V3, V4, V5, V6, V7, V8, liveAlpha } from "./Scenes64";
import { ElbowDiagram } from "./Elbow64";

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
  const iw = 520 / 0.9, ih = iw / AARM;
  const cx = 90 + (0.72 - 0.05) * iw, cy = 620 + (0.445 - 0.36) * ih;
  return (
    <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
      <Dots w={1080} h={1920} />
      <div style={{ position: "absolute", left: 60, width: 960, top: 300, textAlign: "center", fontWeight: 800, fontSize: 98, lineHeight: 1, letterSpacing: -3, color: C.forest, whiteSpace: "nowrap" }}>YOUR FUNNY BONE</div>
      <div style={{ position: "absolute", left: 60, width: 960, top: 415, textAlign: "center", fontWeight: 800, fontSize: 146, lineHeight: 1, letterSpacing: -4, color: C.red, whiteSpace: "nowrap" }}>ISN'T A BONE</div>
      <PlateWindow src="plates/arm812.png" aspect={AARM} x={90} y={620} w={520} h={900} fx0={0.05} fy0={0.36} fx1={0.95} covers={ARM_COVERS} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <circle cx={cx} cy={cy} r={40} fill="none" stroke={C.red} strokeWidth={8} />
        <circle cx={cx} cy={cy} r={15} fill={C.red} stroke={C.paper} strokeWidth={5} />
        <line x1={cx + 40} y1={cy} x2={640} y2={cy} stroke={C.forest} strokeWidth={6} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", left: 640, top: 700, width: 380, height: 520, overflow: "hidden", borderRadius: 36, background: C.card, boxShadow: `0 0 0 5px ${C.line}` }}>
        <div style={{ position: "absolute", left: -60, top: -170 }}>
          <ElbowDiagram t={0} w={480} id="cov" nerve={0.8} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 640, top: 1250, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 56, padding: "10px 24px 16px", borderRadius: 26, boxShadow: "0 8px 0 rgba(31,42,20,0.18)", whiteSpace: "nowrap" }}>ULNAR NERVE</div>
      <div style={{ position: "absolute", left: 640, top: 1370, width: 380, color: C.forest, fontWeight: 800, fontSize: 38, lineHeight: 1.1 }}>anatomy fact + quick test</div>
      <div style={{ position: "absolute", left: 60, width: 960, top: 1556, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <div style={{ width: 64, height: 64, borderRadius: 32, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center" }}><Mark size={46} reversed /></div>
        <div style={{ fontWeight: 800, fontSize: 40, color: C.forest }}>Book Plume</div>
      </div>
    </AbsoluteFill>
  );
};

/* Pinterest still 1000x1500 */
const Pin: React.FC<{ title: string; sub: string }> = ({ title, sub }) => (
  <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 300, background: C.forest }} />
    <div style={{ position: "absolute", left: 60, top: 46, width: 880, color: C.paper, fontWeight: 800, fontSize: 70, lineHeight: 1.04, letterSpacing: -1 }}>{title}</div>
    <PlateWindow src="plates/hand812.png" aspect={AHAND} x={40} y={340} w={440} h={590} fx0={0.04} fy0={0.0} fx1={1.0} covers={HAND_COVERS} />
    <div style={{ position: "absolute", left: 520, top: 340, width: 440, height: 440, borderRadius: 36, overflow: "hidden", background: C.card, boxShadow: `0 0 0 4px ${C.line}` }}>
      <div style={{ position: "absolute", left: -20, top: -150 }}>
        <ElbowDiagram t={0} w={460} id="pin" nerve={0.8} epi={0.6} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 520, top: 800, width: 440, color: C.forest, fontWeight: 800, fontSize: 30, lineHeight: 1.15 }}>
      Right elbow from behind: the ulnar nerve runs in the groove behind the medial epicondyle
    </div>
    <div style={{ position: "absolute", left: 60, top: 965, width: 880, display: "flex", flexDirection: "column", gap: 12 }}>
      {SUMMARY.map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: i === 0 ? C.banana : C.matcha, border: `4px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 22, color: C.forest }}>{i + 1}</div>
          <div style={{ fontWeight: 800, fontSize: 36, color: C.forest }}>{s}</div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 60, top: 1330, color: C.forest, fontWeight: 800, fontSize: 28, whiteSpace: "nowrap" }}>{sub}</div>
    <div style={{ position: "absolute", right: 50, top: 1318, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 34, padding: "8px 22px 12px", borderRadius: 16 }}>bookplume.com</div>
    <div style={{ position: "absolute", left: 60, bottom: 22, color: C.forest, opacity: 0.55, fontWeight: 700, fontSize: 18 }}>Plate: Gray's Anatomy (1918), public domain · diagram: Book Plume</div>
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
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "Your Funny Bone Isn't a Bone: It's the Ulnar Nerve", sub: "Anatomy flashcards · study tips" }} />
  </>
);
