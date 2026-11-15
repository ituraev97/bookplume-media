import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT, ramp, useT } from "./kit";
import { END, Header, Subtitles, TT_CHAPTERS, TT_END } from "./Chrome98";
import { TT_WORDS } from "./words98";
import { Burst, Loud, PlateQ } from "./Scenes93";
import { V8, VComment } from "./Scenes97";
import { A395, A397, HOOKPIN, P395, P397, TM_MAIN, TM_TT, TT2, TT3, V1, V2, V3, V4, V4b, V5, V6, V7, hookStick } from "./Scenes98";
import { ACOL, ALET, AM, ANAME, Torso, Wall } from "./Abs98";

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
const Grid: React.FC = () => {
  const t = useT();
  return <Dots w={1080} h={1920} o={(t * 40) % 54} />;
};
const HookBurst: React.FC<{ R: number }> = ({ R }) => {
  const t = useT();
  const a = 1 - ramp(t, R + 0.1, R + 0.6);
  if (a <= 0) return null;
  return <div style={{ position: "absolute", inset: 0, opacity: a }}><Burst w={1080} h={1920} cy={0.55} rot={t * 6} /></div>;
};

/* main cut (Reels / Shorts / FB / Stories) */
export const Video: React.FC<{ mask?: boolean }> = ({ mask }) => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Grid />
    <HookBurst R={TM_MAIN.reveal} />
    <V1 tm={TM_MAIN} />
    <V2 s0={6.3} s1={9.1} out={7.24} e={8.08} i={8.33} tt={8.56} />
    <V3 s0={9.1} s1={12.85} e={9.16} i={10.31} tt={11.26} />
    <V4 s0={12.85} s1={16.4} two={12.9} ra={14.12} py={15.41} />
    <V4b s0={16.4} s1={18.85} six={16.48} ti={17.57} />
    <V5 s0={18.85} s1={24.0} q={19.71} cd={[[22.08, 3], [22.72, 2], [23.36, 1]]} />
    <V6 s0={24.0} s1={26.85} fib={25.22} />
    <V7 s0={26.85} s1={28.9} />
    <V8 s0={28.9} s1={END} />
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

/* TikTok cut 15–18 s: hook → reveal → deepest layer, straight across → 2 more layers on top → comment card. No brand, no store. */
export const TikTok: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Grid />
    <HookBurst R={TM_TT.reveal} />
    <V1 tm={TM_TT} />
    <TT2 s0={6.3} s1={9.9} deep={6.61} run={8.71} />
    <TT3 s0={9.9} s1={13.8} i={11.66} e={12.4} />
    <VComment s0={13.8} s1={TT_END} />
    <Header chapters={TT_CHAPTERS} end={TT_END} brand={false} />
    <Subtitles words={TT_WORDS} />
  </AbsoluteFill>
);

const COVC: [number, number, number] = [0.55, 0.66, 0.9];

/* Cover 1080x1920 BEAST style: all text in y 280–1640, x 60–1020; no store name (also used on TikTok) */
const Cover: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT }}>
    <Burst w={1080} h={1920} cy={0.5} rot={4} />
    <div style={{ position: "absolute", left: 60, width: 960, top: 300, display: "flex", justifyContent: "center" }}><Loud size={150}>NAME THIS</Loud></div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 470, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "#E5251A", border: "9px solid #111", borderRadius: 22, padding: "2px 34px 14px", transform: "rotate(-2deg)", boxShadow: "0 10px 0 #111" }}><Loud size={130}>MUSCLE?</Loud></div>
    </div>
    <PlateQ src={P397} aspect={A397} x={140} y={690} w={800} h={860} a={0} b={1} from={COVC} to={COVC} still credit="" tilt={-3} loud
      pin={{ ...HOOKPIN, t0: 0, t1: 99, r: 86 }} arrow stickers={[hookStick(99)]} />
    <div style={{ position: "absolute", left: 720, top: 1430, transform: "rotate(10deg)", background: "#E5251A", border: "8px solid #111", borderRadius: 24, padding: "6px 22px 12px", boxShadow: "0 8px 0 #111" }}><Loud size={78}>3 SEC</Loud></div>
  </AbsoluteFill>
);

/* Pinterest still 1000x1500 — loud quiz style */
const Pin: React.FC<{ title: string; sub: string }> = ({ title, sub }) => (
  <AbsoluteFill style={{ fontFamily: FONT }}>
    <Burst w={1000} h={1500} cy={0.5} rot={8} />
    <div style={{ position: "absolute", left: 40, width: 920, top: 50, textAlign: "center" }}><Loud size={92}>CAN YOU</Loud></div>
    <div style={{ position: "absolute", left: 40, width: 920, top: 160, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "#E5251A", border: "8px solid #111", borderRadius: 20, padding: "0 24px 10px", transform: "rotate(-2deg)", boxShadow: "0 8px 0 #111" }}><Loud size={88}>NAME THIS?</Loud></div>
    </div>
    <PlateQ src={P397} aspect={A397} x={120} y={330} w={760} h={780} a={0} b={1} from={COVC} to={COVC} still credit="" tilt={-2} loud
      pin={{ ...HOOKPIN, t0: 0, t1: 99, r: 76 }} arrow stickers={[hookStick(99)]} />
    <div style={{ position: "absolute", left: 50, width: 900, top: 1160, textAlign: "center", fontWeight: 800, fontSize: 46, color: "#111", lineHeight: 1.2 }}>{title}</div>
    <div style={{ position: "absolute", left: 50, width: 900, top: 1300, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "#111", color: "#FFE04A", fontWeight: 800, fontSize: 40, padding: "10px 30px 14px", borderRadius: 18 }}>Answer + flashcards → bookplume.com</div>
    </div>
    <div style={{ position: "absolute", left: 50, width: 900, top: 1410, textAlign: "center", color: "#111", opacity: 0.75, fontWeight: 700, fontSize: 22 }}>{sub}</div>
  </AbsoluteFill>
);

/* ---------- Instagram quiz carousel 1080x1350 ---------- */
const CW = 1080, CH = 1350;
const NUMP: [number, number, number][] = [[1, 318, 440], [2, 690, 460], [3, 690, 680], [4, 446, 316], [5, 474, 866]];
const NumDot: React.FC<{ n: number; x: number; y: number; r?: number }> = ({ n, x, y, r = 40 }) => (
  <g>
    <circle cx={x} cy={y} r={r + 10} fill="none" stroke="#fff" strokeWidth={8} />
    <circle cx={x} cy={y} r={r} fill="#E5251A" stroke="#111" strokeWidth={6} />
    <text x={x} y={y + r * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={r * 1.05} fill="#fff">{n}</text>
  </g>
);
const SL: { ms: AM[]; n: number[] }[] = [
  { ms: [], n: [] },
  { ms: ["EO"], n: [1] },
  { ms: ["IO"], n: [2] },
  { ms: ["TA"], n: [3] },
  { ms: ["RA", "PY"], n: [4, 5] },
];
const Carousel: React.FC<{ n: number }> = ({ n }) => {
  if (n === 0) {
    return (
      <AbsoluteFill style={{ fontFamily: FONT }}>
        <Burst w={CW} h={CH} cy={0.5} rot={6} />
        <div style={{ position: "absolute", left: 40, width: 1000, top: 40, textAlign: "center" }}><Loud size={96}>CAN YOU NAME</Loud></div>
        <div style={{ position: "absolute", left: 40, width: 1000, top: 152, display: "flex", justifyContent: "center" }}>
          <div style={{ background: "#E5251A", border: "8px solid #111", borderRadius: 20, padding: "0 26px 10px", transform: "rotate(-2deg)", boxShadow: "0 8px 0 #111" }}><Loud size={92}>ALL 5?</Loud></div>
        </div>
        <div style={{ position: "absolute", left: 130, top: 300, width: 820, height: 880, borderRadius: 22, background: C.card, overflow: "hidden", boxShadow: "0 0 0 10px #111, 0 0 0 18px #fff, 0 24px 50px rgba(0,0,0,0.45)" }}>
          <div style={{ position: "absolute", left: -70, top: -40, width: 960, height: 960 }}>
            <div style={{ position: "absolute", left: 0, top: 0 }}>
              <Torso t={30} w={960} id="c0" lit={{ EO: 0, IO: 0, TA: 0, RA: 0, PY: 0 }} stepR />
            </div>
            <svg width={960} height={960} viewBox="0 0 1000 1000" style={{ position: "absolute", left: 0, top: 0 }}>
              {NUMP.map(([k, x, y]) => <NumDot key={k} n={k} x={x} y={y} r={38} />)}
            </svg>
          </div>
        </div>
        <div style={{ position: "absolute", left: 60, width: 640, top: 1240, fontWeight: 800, fontSize: 34, color: "#111" }}>abdominal wall · anatomy quiz</div>
        <div style={{ position: "absolute", left: 720, top: 1215, transform: "rotate(-5deg)", background: C.banana, border: "6px solid #111", borderRadius: 20, padding: "8px 20px 12px", fontWeight: 800, fontSize: 38, color: "#111", boxShadow: "0 6px 0 #111" }}>swipe for answers →</div>
      </AbsoluteFill>
    );
  }
  if (n === 5) {
    const ROWS: [AM, string][] = [["EO", "outermost · ↘ down + in"], ["IO", "middle · ↗ up + in"], ["TA", "deepest · → across"], ["RA", "vertical · six-pack"], ["PY", "vertical · tiny, low"]];
    return (
      <AbsoluteFill style={{ fontFamily: FONT, background: C.forest }}>
        <div style={{ position: "absolute", left: 60, top: 50, fontWeight: 800, fontSize: 34, letterSpacing: 4, color: C.banana }}>ALL 5 · ABDOMINAL WALL MUSCLES</div>
        <div style={{ position: "absolute", left: 60, top: 104, fontWeight: 800, fontSize: 58, color: C.paper, lineHeight: 1.1 }}>3 flat <span style={{ color: "#F5B060" }}>E</span>-<span style={{ color: "#9FCB6A" }}>I</span>-<span style={{ color: "#F58A7A" }}>T</span> + 2 vertical</div>
        <div style={{ position: "absolute", left: 60, top: 250, display: "flex", flexDirection: "column", gap: 38 }}>
          {ROWS.map(([m, sub], i) => (
            <div key={m} style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ width: 64, height: 64, borderRadius: 32, background: "#E5251A", border: "5px solid #111", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 36 }}>{i + 1}</div>
              <div style={{ width: 70, height: 70, borderRadius: 35, background: ACOL[m], border: `4px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.paper, fontWeight: 800, fontSize: 40 }}>{ALET[m]}</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 46, color: C.paper, lineHeight: 1.05 }}>{ANAME[m]}</div>
                <div style={{ fontWeight: 700, fontSize: 30, color: "#B9D27A" }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 60, width: 960, top: 1010, fontWeight: 700, fontSize: 32, color: "#B9D27A", lineHeight: 1.3 }}>Hands in your front pockets = external oblique. Six-pack lines = tendinous intersections.</div>
        <div style={{ position: "absolute", left: 60, width: 960, top: 1170, display: "flex", justifyContent: "center" }}>
          <div style={{ background: C.banana, color: C.forest, borderRadius: 50, padding: "18px 50px 22px", fontWeight: 800, fontSize: 50 }}>Save this · bookplume.com</div>
        </div>
      </AbsoluteFill>
    );
  }
  const { ms, n: nums } = SL[n];
  const m0 = ms[0];
  const footer: Record<string, string> = { EO: "Fibers ↘ down + in — like hands in your front pockets", IO: "Fibers ↗ up + in · 1918 name “Obliquus internus”", TA: "Deepest flat layer · fibers → straight across", RA: "Six-pack lines = tendinous intersections (1918: “inscriptions”)" };
  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: C.paper }}>
      <Dots w={CW} h={CH} />
      <div style={{ position: "absolute", left: 60, top: 46, display: "flex", alignItems: "center", gap: 20 }}>
        {nums.map((k) => (
          <div key={k} style={{ width: 92, height: 92, borderRadius: 46, background: "#E5251A", border: "6px solid #111", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 52 }}>{k}</div>
        ))}
        <div style={{ fontWeight: 800, fontSize: 40, color: C.matcha, letterSpacing: 3 }}>ANSWER</div>
      </div>
      <div style={{ position: "absolute", left: 60, width: 960, top: 160 }}>
        {ms.map((m) => (
          <div key={m} style={{ fontWeight: 800, fontSize: ms.length > 1 ? 66 : 80, color: C.forest, lineHeight: 1.05, letterSpacing: -1, whiteSpace: "nowrap" }}>
            <span style={{ background: C.banana, borderRadius: 14, padding: "0 10px 4px" }}>{ANAME[m][0]}</span>{ANAME[m].slice(1)}
          </div>
        ))}
      </div>
      {m0 === "EO" && (
        <div style={{ position: "absolute", left: 60, top: 290, width: 960, height: 860, borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}`, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 20, top: -20 }}>
            <Torso t={30} w={920} id="c1" lit={{ EO: 0 }} hot={["EO"]} arrows={{ EO: 1 }} />
          </div>
          <div style={{ position: "absolute", right: 20, bottom: 14, fontWeight: 700, fontSize: 22, color: C.forest, opacity: 0.55 }}>diagram: Book Plume</div>
        </div>
      )}
      {m0 === "IO" && (
        <PlateQ src={P395} aspect={A395} x={60} y={290} w={960} h={860} a={0} b={1} from={[0.42, 0.52, 0.9]} to={[0.42, 0.52, 0.9]} still ls={40}
          labels={[{ x: 0.36, y: 0.66, text: "internal oblique", t: 0, hot: true, ox: 120, oy: 150 }]} />
      )}
      {m0 === "TA" && (
        <PlateQ src={P397} aspect={A397} x={60} y={290} w={960} h={860} a={0} b={1} from={[0.5, 0.6, 0.85]} to={[0.5, 0.6, 0.85]} still ls={40}
          labels={[{ x: 0.565, y: 0.68, text: "transversus abdominis", t: 0, hot: true, ox: -60, oy: 200 }]} />
      )}
      {m0 === "RA" && (
        <PlateQ src={P397} aspect={A397} x={60} y={330} w={960} h={820} a={0} b={1} from={[0.3, 0.74, 0.66]} to={[0.3, 0.74, 0.66]} still ls={40}
          labels={[{ x: 0.2, y: 0.66, text: "4 rectus abdominis", t: 0, hot: true, ox: 220, oy: -40 }, { x: 0.283, y: 0.875, text: "5 pyramidalis", t: 0, hot: true, ox: 170, oy: -30 }]} />
      )}
      <div style={{ position: "absolute", left: 60, width: 960, top: 1180, display: "flex", flexWrap: "wrap", gap: 14 }}>
        <div style={{ background: C.forest, color: C.paper, borderRadius: 18, padding: "10px 22px 14px", fontWeight: 800, fontSize: 32 }}>{footer[m0]}</div>
      </div>
      <div style={{ position: "absolute", right: 40, bottom: 26, fontWeight: 700, fontSize: 22, color: C.forest, opacity: 0.55 }}>{m0 === "EO" ? "Book Plume diagram" : "Gray's Anatomy (1918), public domain"}</div>
    </AbsoluteFill>
  );
};

const Diag: React.FC<{ mode: number }> = ({ mode }) => (
  <AbsoluteFill style={{ background: C.paper }}>
    {mode === 0 && <Torso t={30} id="dg" w={1000} lit={{ EO: 0, IO: 0, TA: 0, RA: 0, PY: 0 }} peelR={1} arrows={{ EO: 1, IO: 1 }} />}
    {mode === 1 && <Torso t={30} id="dg" w={1000} lit={{ EO: 0, IO: 0, TA: 0, RA: 0, PY: 0, TI: 0 }} stepR hot={["TI"]} />}
    {mode === 2 && <div style={{ position: "absolute", top: 200 }}><Wall t={30} w={1000} id="dw" lit={{ EO: 0, IO: 0, TA: 0, RA: 0 }} hot={["IO"]} inArrow={1} letters={1} /></div>}
  </AbsoluteFill>
);

export const MyComposition = () => (
  <>
    <Composition id="Diag" component={Diag} durationInFrames={1} fps={30} width={1000} height={1000} defaultProps={{ mode: 0 }} />
    <Composition id="Main" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: false }} />
    <Composition id="Mask" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: true }} />
    <Composition id="TikTok" component={TikTok} durationInFrames={Math.ceil(TT_END * 30)} fps={30} width={1080} height={1920} />
    <Composition id="Cover" component={Cover} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "Abdominal Muscles Quiz: Name This Muscle + the 4 Around It (E-I-T Trick)", sub: "Gray's Anatomy (1918), public domain · anatomy flashcards · study tips" }} />
    <Composition id="Car" component={Carousel} durationInFrames={1} fps={30} width={CW} height={CH} defaultProps={{ n: 0 }} />
  </>
);
