import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT, useT } from "./kit";
import { END, Header, Mark, Subtitles } from "./Chrome92";
import { A539, P539, LChip, SEQ, V1, V2, V3, V4, V5, V6, V7 } from "./Scenes92";
import { PlateBox74 } from "./Scenes74";
import { Iliac, IB } from "./Iliac92";

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

const ALLLIT: Partial<Record<IB | "AT" | "PT", number>> = { PT: 0, AT: 0, IL: 0, LS: 0, SG: 0, IG: 0, P: 0, IV: 0, M: 0, V: 0, O: 0, U: 0 };

/* Cover 1080x1920: all text in y 280–1640, x 60–1020 */
const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
    <Dots w={1080} h={1920} />
    <div style={{ position: "absolute", left: 60, width: 960, top: 300, textAlign: "center", fontWeight: 800, fontSize: 140, lineHeight: 1, letterSpacing: -4, color: C.forest, whiteSpace: "nowrap" }}>NAME EVERY</div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 455, textAlign: "center", fontWeight: 800, fontSize: 80, lineHeight: 1, letterSpacing: -3, color: C.red, whiteSpace: "nowrap" }}>INTERNAL ILIAC BRANCH</div>
    <PlateBox74 src={P539} aspect={A539} x={100} y={600} w={880} h={760} a={0} b={1} from={[0.66, 0.4, 0.56]} to={[0.66, 0.4, 0.56]} still credit="Gray's Anatomy, 1918 · PD"
      labels={[{ x: 0.6, y: 0.305, text: "internal iliac", t: 0, hot: true, ox: -50, oy: -120 }]} />
    <div style={{ position: "absolute", left: 60, width: 960, top: 1395, display: "flex", justifyContent: "center", gap: 10 }}>
      {SEQ.map((q, i) => <LChip key={i} l={q.l} size={88} col={q.post ? C.matcha : C.red} />)}
    </div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 1530, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <div style={{ width: 64, height: 64, borderRadius: 32, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center" }}><Mark size={46} reversed /></div>
      <div style={{ fontWeight: 800, fontSize: 40, color: C.forest }}>Book Plume · 1 sentence, 9 branches</div>
    </div>
  </AbsoluteFill>
);

/* Pinterest still 1000x1500 */
const Pin: React.FC<{ title: string; sub: string }> = ({ title, sub }) => {
  const rows: [string, string, boolean][] = [
    ["I", "Iliolumbar", true], ["L", "Lateral sacral", true], ["G", "Gluteal (sup. + inf.)", true], ["P", "internal Pudendal", false], ["I", "Inferior vesical", false],
    ["M", "Middle rectal", false], ["V", "Vaginal ♀ (+ uterine)", false], ["O", "Obturator", false], ["U", "Umbilical → sup. vesical", false],
  ];
  return (
    <AbsoluteFill style={{ background: C.paper, fontFamily: FONT }}>
      <Dots w={1000} h={1500} />
      <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 250, background: C.forest }} />
      <div style={{ position: "absolute", left: 60, top: 46, width: 880, color: C.paper, fontWeight: 800, fontSize: 58, lineHeight: 1.08, letterSpacing: -1 }}>{title}</div>
      <div style={{ position: "absolute", left: 30, top: 280, width: 520, height: 600, overflow: "hidden", borderRadius: 30, background: C.card, boxShadow: `0 0 0 4px ${C.line}` }}>
        <div style={{ position: "absolute", left: -30, top: -10 }}><Iliac t={30} w={600} id="pin" lit={ALLLIT} trunkLabels={1} /></div>
      </div>
      <div style={{ position: "absolute", left: 570, top: 280, width: 400, display: "flex", flexDirection: "column", gap: 9 }}>
        {rows.map(([l, n, p], i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <LChip l={l} size={54} col={p ? C.matcha : C.red} />
            <div style={{ fontWeight: 800, fontSize: 25, color: C.forest, whiteSpace: "nowrap" }}>{n}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 50, top: 930, width: 900, fontWeight: 800, fontSize: 42, color: C.forest, lineHeight: 1.25 }}>
        <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px" }}>I Love Going Places In My Very Own Underwear</span>
      </div>
      <div style={{ position: "absolute", left: 50, top: 1070, width: 900, fontWeight: 800, fontSize: 36, color: C.matcha, lineHeight: 1.3 }}>
        Posterior trunk = P.S. I Love You:<br /><span style={{ color: C.forest }}>Superior gluteal · Iliolumbar · Lateral sacral</span>
      </div>
      <div style={{ position: "absolute", left: 50, top: 1395, color: C.forest, fontWeight: 800, fontSize: 28, whiteSpace: "nowrap" }}>{sub}</div>
      <div style={{ position: "absolute", right: 50, top: 1380, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 34, padding: "8px 22px 12px", borderRadius: 16 }}>bookplume.com</div>
      <div style={{ position: "absolute", left: 50, bottom: 16, color: C.forest, opacity: 0.55, fontWeight: 700, fontSize: 18 }}>Diagram: Book Plume · branches per TeachMeAnatomy / Radiopaedia · study use only</div>
    </AbsoluteFill>
  );
};

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
    <Iliac t={30} id="dg" w={1000} lit={ALLLIT} hot={["SG", "IG"]} />
  </AbsoluteFill>
);

export const MyComposition = () => (
  <>
    <Composition id="Diag" component={Diag} durationInFrames={1} fps={30} width={1000} height={1000} />
    <Composition id="Main" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: false }} />
    <Composition id="Mask" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: true }} />
    <Composition id="Cover" component={Cover} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "Internal Iliac Artery Branches: 1 Mnemonic for All 9", sub: "Anatomy flashcards · study tips" }} />
  </>
);
