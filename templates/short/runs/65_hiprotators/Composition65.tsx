import React from "react";
import { AbsoluteFill, Composition, Img, staticFile } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT, useT } from "./kit";
import { END, Header, Mark, Subtitles } from "./Chrome";
import { V1, V2, V3, V4, V5, V6, V7, V8, V9, liveAlpha, ASP, MS, LChip } from "./Scenes65";
import { HipDiagram, M } from "./Hip65";
import { DiaTest } from "./DiaTest";

const ALL: Partial<Record<M, number>> = { P: 0, GS: 0, OI: 0, GI: 0, OE: 0, QF: 0 };

/* Gray's plate window (no frame zoom), fx/fy = focus fraction */
const PlateWindow: React.FC<{ x: number; y: number; w: number; h: number; s: number; fx: number; fy: number }> = ({ x, y, w, h, s, fx, fy }) => {
  const iw = w * s, ih = iw / ASP;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden", borderRadius: 36, boxShadow: `0 0 0 5px ${C.line}, 0 18px 40px rgba(31,42,20,0.16)`, background: C.paper }}>
      <Img src={staticFile("plates/gluteal434.png")} style={{ position: "absolute", width: iw, height: ih, left: w / 2 - fx * iw, top: h / 2 - fy * ih }} />
      <div style={{ position: "absolute", right: 12, bottom: 8, fontFamily: FONT, fontWeight: 700, fontSize: 18, color: C.forest, opacity: 0.6, background: "rgba(247,246,236,0.85)", padding: "2px 10px", borderRadius: 8 }}>Gray's Anatomy, 1918 · public domain</div>
    </div>
  );
};
const Dots: React.FC<{ w: number; h: number }> = ({ w, h }) => (
  <svg width={w} height={h} style={{ position: "absolute" }}>
    <defs>
      <pattern id="cg" width={54} height={54} patternUnits="userSpaceOnUse">
        <circle cx={27} cy={27} r={2.2} fill={C.matcha} opacity={0.13} />
      </pattern>
    </defs>
    <rect width={w} height={h} fill="url(#cg)" />
  </svg>
);
const MnemRow: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ display: "flex", alignItems: "center", gap: size * 0.08 }}>
    {[["P"], ["G", "O"], ["G", "O"], ["Q"]].map((g, i) => (
      <React.Fragment key={i}>
        {i > 0 && <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: size * 0.7, color: C.forest, opacity: 0.4 }}>-</span>}
        <div style={{ display: "flex", gap: size * 0.05 }}>
          {g.map((ch, j) => {
            const m = (["P", "GS", "OI", "GI", "OE", "QF"] as M[])[[0, 1, 3, 5][i] + j];
            return <LChip key={j} m={m} size={size} />;
          })}
        </div>
      </React.Fragment>
    ))}
  </div>
);

/* Cover 1080x1920: all text in y 280–1640, x 60–1020 */
const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
    <Dots w={1080} h={1920} />
    <div style={{ position: "absolute", left: 60, width: 960, top: 300, textAlign: "center", fontWeight: 800, fontSize: 150, lineHeight: 1, letterSpacing: -4, color: C.forest, whiteSpace: "nowrap" }}>NAME ALL 6</div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 455, textAlign: "center", fontWeight: 800, fontSize: 94, lineHeight: 1, letterSpacing: -3, color: C.red, whiteSpace: "nowrap" }}>DEEP HIP ROTATORS</div>
    <PlateWindow x={70} y={610} w={500} h={760} s={1.75} fx={0.6} fy={0.58} />
    <div style={{ position: "absolute", left: 600, top: 610, width: 420, height: 520, overflow: "hidden", borderRadius: 36, background: C.card, boxShadow: `0 0 0 5px ${C.line}` }}>
      <div style={{ position: "absolute", left: -250, top: -260 }}>
        <HipDiagram t={10} w={760} lit={ALL} id="cov" />
      </div>
    </div>
    <div style={{ position: "absolute", left: 600, top: 1160, width: 420, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ fontWeight: 800, fontSize: 38, color: C.forest, lineHeight: 1.1 }}>1 word mnemonic:</div>
      <MnemRow size={56} />
      <div style={{ fontWeight: 800, fontSize: 32, color: C.matcha, lineHeight: 1.1, marginTop: 6 }}>+ quick test</div>
    </div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 1440, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <div style={{ width: 64, height: 64, borderRadius: 32, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center" }}><Mark size={46} reversed /></div>
      <div style={{ fontWeight: 800, fontSize: 40, color: C.forest }}>Book Plume</div>
    </div>
  </AbsoluteFill>
);

/* Pinterest still 1000x1500 */
const Pin: React.FC<{ title: string; sub: string }> = ({ title, sub }) => (
  <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 300, background: C.forest }} />
    <div style={{ position: "absolute", left: 60, top: 46, width: 880, color: C.paper, fontWeight: 800, fontSize: 70, lineHeight: 1.04, letterSpacing: -1 }}>{title}</div>
    <PlateWindow x={40} y={340} w={440} h={600} s={1.6} fx={0.6} fy={0.56} />
    <div style={{ position: "absolute", left: 520, top: 340, width: 440, height: 600, borderRadius: 36, overflow: "hidden", background: C.card, boxShadow: `0 0 0 4px ${C.line}` }}>
      <div style={{ position: "absolute", left: -250, top: -170 }}>
        <HipDiagram t={10} w={780} lit={ALL} nerve={0} id="pin" />
      </div>
      <div style={{ position: "absolute", left: 14, bottom: 12, fontWeight: 800, fontSize: 22, color: C.forest, background: C.banana, borderRadius: 10, padding: "2px 10px 4px" }}>sciatic nerve below piriformis</div>
    </div>
    <div style={{ position: "absolute", left: 60, top: 975, width: 880, display: "flex", flexDirection: "column", gap: 10 }}>
      {MS.map((r) => (
        <div key={r.m} style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <LChip m={r.m} size={44} />
          <div style={{ fontWeight: 800, fontSize: 34, color: C.forest, whiteSpace: "nowrap" }}>{r.name} <span style={{ color: C.matcha, fontSize: 26 }}>· {r.note}</span></div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 60, top: 1352, color: C.forest, fontWeight: 800, fontSize: 30, whiteSpace: "nowrap" }}>{sub}</div>
    <div style={{ position: "absolute", right: 50, top: 1340, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 34, padding: "8px 22px 12px", borderRadius: 16 }}>bookplume.com</div>
    <div style={{ position: "absolute", right: 40, bottom: 10, color: C.forest, opacity: 0.5, fontWeight: 700, fontSize: 18 }}>Plate: Gray's Anatomy (1918), public domain · Diagram: Book Plume</div>
  </AbsoluteFill>
);

const Grid: React.FC = () => {
  const t = useT();
  const o = (t * 40) % 54;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute" }}>
      <defs>
        <pattern id="grid" width={54} height={54} patternUnits="userSpaceOnUse" patternTransform={`translate(${o} ${o * 0.5})`}>
          <circle cx={27} cy={27} r={2.2} fill={C.matcha} opacity={0.13} />
        </pattern>
      </defs>
      <rect width={1080} height={1920} fill="url(#grid)" />
    </svg>
  );
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
    <Composition id="DiaTest" component={DiaTest} durationInFrames={1} fps={30} width={1080} height={1100} />
    <Composition id="Cover" component={Cover} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "Deep Hip Rotators Mnemonic: P-GO-GO-Q (6 Muscles)", sub: "Anatomy flashcards · study tips" }} />
  </>
);
