import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT, useT } from "./kit";
import { END, Header, Mark, Subtitles } from "./Chrome73";
import { A1223, RChip, V1, V2, V3, V4, V5, V6, V6b, V7, V8 } from "./Scenes73";
import { PlateBox } from "./Scenes67";
import { Abdomen, R, ROWDARK, ROWS } from "./Abd73";

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
const ALL: Partial<Record<R, number>> = { RH: 0, EP: 0, LH: 0, RL: 0, UM: 0, LL: 0, RI: 0, HG: 0, LI: 0 };

/* Cover 1080x1920: all text in y 280–1640, x 60–1020 */
const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
    <Dots w={1080} h={1920} />
    <div style={{ position: "absolute", left: 60, width: 960, top: 300, textAlign: "center", fontWeight: 800, fontSize: 150, lineHeight: 1, letterSpacing: -4, color: C.forest, whiteSpace: "nowrap" }}>NAME ALL 9</div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 462, textAlign: "center", fontWeight: 800, fontSize: 84, lineHeight: 1, letterSpacing: -3, color: C.red, whiteSpace: "nowrap" }}>ABDOMINAL REGIONS</div>
    <PlateBox src="plates/abd1223.png" aspect={A1223} x={160} y={600} w={760} h={800} a={0} b={1} from={[0.54, 0.5, 1.0]} to={[0.54, 0.5, 1.0]} still credit="Gray's Anatomy, 1918 · public domain" />
    {/* question marks in the 9 cells */}
    {[0.16, 0.54, 0.88].map((fx, ci) => [0.3, 0.52, 0.76].map((fy, ri) => {
      const iw = 760, ih = iw / A1223, L = 380 - 0.54 * iw, T = 400 - 0.5 * ih;
      return <div key={`${ci}${ri}`} style={{ position: "absolute", left: 160 + L + fx * iw - 34, top: 600 + T + fy * ih - 34, width: 68, height: 68, borderRadius: 20, background: C.banana, border: `5px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 46, color: C.forest }}>?</div>;
    }))}
    <div style={{ position: "absolute", left: 60, width: 960, top: 1440, display: "flex", justifyContent: "center", gap: 12 }}>
      <div style={{ background: C.forest, color: C.paper, fontWeight: 800, fontSize: 52, borderRadius: 30, padding: "14px 36px 18px" }}>tic-tac-toe trick</div>
    </div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 1560, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <div style={{ width: 64, height: 64, borderRadius: 32, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center" }}><Mark size={46} reversed /></div>
      <div style={{ fontWeight: 800, fontSize: 40, color: C.forest }}>Book Plume · anatomy mnemonic</div>
    </div>
  </AbsoluteFill>
);

/* Pinterest still 1000x1500 */
const Pin: React.FC<{ title: string; sub: string }> = ({ title, sub }) => (
  <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 270, background: C.forest }} />
    <div style={{ position: "absolute", left: 60, top: 46, width: 880, color: C.paper, fontWeight: 800, fontSize: 66, lineHeight: 1.04, letterSpacing: -1 }}>{title}</div>
    <div style={{ position: "absolute", left: 20, top: 295 }}>
      <Abdomen t={10} id="pin" w={560} lit={ALL} letters={0} full organs={0.75} />
    </div>
    <PlateBox src="plates/abd1223.png" aspect={A1223} x={600} y={300} w={370} h={560} a={0} b={1} from={[0.5, 0.48, 1.0]} to={[0.5, 0.48, 1.0]} still credit="Gray's 1918 · PD" />
    <div style={{ position: "absolute", left: 600, top: 880, width: 370 }}>
      <div style={{ fontWeight: 800, fontSize: 30, color: C.forest, marginBottom: 10 }}>Each row = palindrome</div>
      {ROWS.map((row, ri) => (
        <div key={ri} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center" }}>
          {row.map((r) => <RChip key={r} r={r} size={58} />)}
          <div style={{ fontWeight: 800, fontSize: 24, color: ROWDARK[ri], marginLeft: 6 }}>{["top", "middle", "bottom"][ri]}</div>
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 50, top: 990, width: 520, display: "flex", flexDirection: "column", gap: 14 }}>
      {[
        ["R", "= the patient's right (your left)"],
        ["hypo·chondriac", "= below the rib cartilage"],
        ["liver", "= mostly right hypochondriac"],
        ["appendix", "= right iliac region"],
      ].map(([a, b]) => (
        <div key={a} style={{ fontSize: 29, fontWeight: 700, color: C.forest, lineHeight: 1.2 }}>
          <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px", fontWeight: 800 }}>{a}</span> {b}
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 60, top: 1380, color: C.forest, fontWeight: 800, fontSize: 28, whiteSpace: "nowrap" }}>{sub}</div>
    <div style={{ position: "absolute", right: 50, top: 1366, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 34, padding: "8px 22px 12px", borderRadius: 16 }}>bookplume.com</div>
    <div style={{ position: "absolute", left: 60, bottom: 22, color: C.forest, opacity: 0.55, fontWeight: 700, fontSize: 18 }}>Plate: Gray's Anatomy (1918), Fig. 1223, public domain · diagram: Book Plume · R = patient's right</div>
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
    <V6b />
    <V7 />
    <V8 />
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
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "9 Abdominal Regions: the Tic-Tac-Toe Trick", sub: "Anatomy flashcards · study tips" }} />
  </>
);
