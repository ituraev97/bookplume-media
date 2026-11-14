import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT, ramp, useT } from "./kit";
import { END, Header, Subtitles, TT_CHAPTERS, TT_END } from "./Chrome94";
import { TT_WORDS } from "./words94";
import { Burst, LChip, Loud, PlateQ } from "./Scenes93";
import { A409, HOOKPIN, P409, PINS, TM_MAIN, TM_TT, V1, V2, V3, V3a, V4, V5, V6, V7, VComment, hookStick, st } from "./Scenes94";
import { Back, BCOL, BLETTER, BM, BNAME, BNERVE, BORDER } from "./Back94";

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
    <V2 tm={TM_MAIN} />
    <V3a tm={TM_MAIN} />
    <V3 tm={TM_MAIN} />
    <V4 s0={17.1} s1={22.55} q={17.5} cd={[[20.69, 3], [21.33, 2], [21.97, 1]]} />
    <V5 s0={22.55} s1={25.85} cn={23.64} rest={24.6} />
    <V6 s0={25.85} s1={27.95} />
    <V7 s0={27.95} s1={END} />
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

/* TikTok cut 15–18 s: hook → reveal → 2 on top / 3 underneath → comment card. No brand, no store. */
export const TikTok: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Grid />
    <HookBurst R={TM_TT.reveal} />
    <V1 tm={TM_TT} />
    <V2 tm={TM_TT} />
    <V3 tm={TM_TT} />
    <VComment s0={15.25} s1={TT_END} />
    <Header chapters={TT_CHAPTERS} end={TT_END} brand={false} />
    <Subtitles words={TT_WORDS} />
  </AbsoluteFill>
);

/* Cover 1080x1920 BEAST style: all text in y 280–1640, x 60–1020; no store name (also used on TikTok) */
const Cover: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT }}>
    <Burst w={1080} h={1920} cy={0.5} rot={4} />
    <div style={{ position: "absolute", left: 60, width: 960, top: 300, display: "flex", justifyContent: "center" }}><Loud size={150}>NAME THIS</Loud></div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 470, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "#E5251A", border: "9px solid #111", borderRadius: 22, padding: "2px 30px 14px", transform: "rotate(-2deg)", boxShadow: "0 10px 0 #111" }}><Loud size={140}>MUSCLE?</Loud></div>
    </div>
    <PlateQ src={P409} aspect={A409} x={110} y={700} w={860} h={820} a={0} b={1} from={[0.44, 0.59, 0.5]} to={[0.44, 0.59, 0.5]} still credit="" tilt={-3} loud
      pin={{ ...HOOKPIN, t0: 0, t1: 99, r: 80 }} stickers={hookStick(99)} arrow />
    <div style={{ position: "absolute", left: 760, top: 1420, transform: "rotate(10deg)", background: "#E5251A", border: "8px solid #111", borderRadius: 24, padding: "6px 22px 12px", boxShadow: "0 8px 0 #111" }}><Loud size={78}>3 SEC</Loud></div>
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
    <PlateQ src={P409} aspect={A409} x={90} y={330} w={820} h={760} a={0} b={1} from={[0.44, 0.59, 0.5]} to={[0.44, 0.59, 0.5]} still credit="" tilt={-2} loud
      pin={{ ...HOOKPIN, t0: 0, t1: 99, r: 72 }} stickers={hookStick(99)} arrow />
    <div style={{ position: "absolute", left: 50, width: 900, top: 1150, textAlign: "center", fontWeight: 800, fontSize: 46, color: "#111", lineHeight: 1.2 }}>{title}</div>
    <div style={{ position: "absolute", left: 50, width: 900, top: 1290, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "#111", color: "#FFE04A", fontWeight: 800, fontSize: 40, padding: "10px 30px 14px", borderRadius: 18 }}>Answer + flashcards → bookplume.com</div>
    </div>
    <div style={{ position: "absolute", left: 50, width: 900, top: 1405, textAlign: "center", color: "#111", opacity: 0.75, fontWeight: 700, fontSize: 22 }}>{sub}</div>
  </AbsoluteFill>
);

/* numbered pins over a PlateQ frame (same math as PlateQ, tilt 0) */
const NumPins: React.FC<{ x: number; y: number; w: number; h: number; c: [number, number, number]; pins: [number, number, number][]; r?: number }> = ({ x, y, w, h, c, pins, r = 40 }) => {
  const iw = w / c[2], ih = iw / A409;
  const L = w / 2 - c[0] * iw, T = h / 2 - c[1] * ih;
  return (
    <svg width={w} height={h} style={{ position: "absolute", left: x, top: y, overflow: "visible" }}>
      {pins.map(([n, fx, fy]) => {
        const px = L + fx * iw, py = T + fy * ih;
        return (
          <g key={n}>
            <circle cx={px} cy={py} r={r + 10} fill="none" stroke="#fff" strokeWidth={8} />
            <circle cx={px} cy={py} r={r} fill="#E5251A" stroke="#111" strokeWidth={6} />
            <text x={px} y={py + r * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={r * 1.05} fill="#fff">{n}</text>
          </g>
        );
      })}
    </svg>
  );
};

const CW = 1080, CH = 1350;
const SLIDE_BM: BM[][] = [[], ["TR"], ["LD"], ["LS"], ["RMI", "RMA"]];
const ALL_ST = [st("TRAP", 99, 84), st("LAT1", 99, 84), st("DORSI", 99, 84), st("LEV", 99, 70), st("RMIN", 99, 70), st("RMAJ1", 99, 70), st("RMAJ2", 99, 70)];
const NUM: [number, number, number][] = BORDER.map((b, i) => [i + 1, PINS[b].x, PINS[b].y]);
const VIEW: Record<number, [number, number, number]> = { 1: [0.38, 0.31, 0.55], 2: [0.37, 0.6, 0.55], 3: [0.66, 0.2, 0.36], 4: [0.65, 0.33, 0.42] };
const LBL: Record<BM, { x: number; y: number; ox: number; oy: number }> = {
  TR: { x: 0.39, y: 0.32, ox: 40, oy: 150 }, LD: { x: 0.37, y: 0.6, ox: 60, oy: 140 }, LS: { x: 0.685, y: 0.2, ox: -60, oy: 150 },
  RMI: { x: 0.66, y: 0.285, ox: -60, oy: -110 }, RMA: { x: 0.635, y: 0.375, ox: -60, oy: 120 },
};

const Carousel: React.FC<{ n: number }> = ({ n }) => {
  if (n === 0) {
    const c: [number, number, number] = [0.5, 0.4, 0.95];
    return (
      <AbsoluteFill style={{ fontFamily: FONT }}>
        <Burst w={CW} h={CH} cy={0.5} rot={6} />
        <div style={{ position: "absolute", left: 40, width: 1000, top: 40, textAlign: "center" }}><Loud size={96}>CAN YOU NAME</Loud></div>
        <div style={{ position: "absolute", left: 40, width: 1000, top: 152, display: "flex", justifyContent: "center" }}>
          <div style={{ background: "#E5251A", border: "8px solid #111", borderRadius: 20, padding: "0 26px 10px", transform: "rotate(-2deg)", boxShadow: "0 8px 0 #111" }}><Loud size={92}>ALL 5?</Loud></div>
        </div>
        <PlateQ src={P409} aspect={A409} x={110} y={300} w={860} h={900} a={0} b={1} from={c} to={c} still credit="" loud stickers={ALL_ST} />
        <NumPins x={110} y={300} w={860} h={900} c={c} pins={NUM} r={36} />
        <div style={{ position: "absolute", left: 60, width: 640, top: 1240, fontWeight: 800, fontSize: 36, color: "#111" }}>back muscles · anatomy quiz</div>
        <div style={{ position: "absolute", left: 730, top: 1215, transform: "rotate(-5deg)", background: C.banana, border: "6px solid #111", borderRadius: 20, padding: "8px 20px 12px", fontWeight: 800, fontSize: 38, color: "#111", boxShadow: "0 6px 0 #111" }}>swipe for answers →</div>
      </AbsoluteFill>
    );
  }
  if (n === 5) {
    return (
      <AbsoluteFill style={{ fontFamily: FONT, background: C.forest }}>
        <div style={{ position: "absolute", left: 60, top: 50, fontWeight: 800, fontSize: 34, letterSpacing: 4, color: C.banana }}>ALL 5 · SUPERFICIAL BACK MUSCLES</div>
        <div style={{ position: "absolute", left: 60, top: 104, fontWeight: 800, fontSize: 58, color: C.paper, lineHeight: 1.1 }}>2 on top <span style={{ color: "#F59A8A" }}>(T L)</span> + 3 under <span style={{ color: "#8CC0E6" }}>(L m M)</span></div>
        <div style={{ position: "absolute", left: 60, top: 270, display: "flex", flexDirection: "column", gap: 44 }}>
          {BORDER.map((b, i) => (
            <div key={b} style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ width: 64, height: 64, borderRadius: 32, background: "#E5251A", border: "5px solid #111", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 36 }}>{i + 1}</div>
              <LChip l={BLETTER[b]} size={70} col={BCOL(b)} />
              <div>
                <div style={{ fontWeight: 800, fontSize: 46, color: C.paper, lineHeight: 1.05 }}>{BNAME[b]}</div>
                <div style={{ fontWeight: 700, fontSize: 30, color: b === "TR" ? "#F59A8A" : "#B9D27A" }}>{BNERVE[b]}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 60, width: 960, top: 1030, fontWeight: 700, fontSize: 32, color: "#B9D27A", lineHeight: 1.3 }}>Trapezius is the odd one out: cranial nerve XI, not the brachial plexus.</div>
        <div style={{ position: "absolute", left: 60, width: 960, top: 1170, display: "flex", justifyContent: "center" }}>
          <div style={{ background: C.banana, color: C.forest, borderRadius: 50, padding: "18px 50px 22px", fontWeight: 800, fontSize: 50 }}>Save this · bookplume.com</div>
        </div>
      </AbsoluteFill>
    );
  }
  const bs = SLIDE_BM[n];
  const v = VIEW[n];
  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: C.paper }}>
      <Dots w={CW} h={CH} />
      <div style={{ position: "absolute", left: 60, top: 46, display: "flex", alignItems: "center", gap: 20 }}>
        {bs.map((b) => (
          <div key={b} style={{ width: 92, height: 92, borderRadius: 46, background: "#E5251A", border: "6px solid #111", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 52 }}>{BORDER.indexOf(b) + 1}</div>
        ))}
        <div style={{ fontWeight: 800, fontSize: 40, color: C.matcha, letterSpacing: 3 }}>ANSWER</div>
      </div>
      <div style={{ position: "absolute", left: 60, width: 960, top: 160 }}>
        {bs.map((b) => (
          <div key={b} style={{ fontWeight: 800, fontSize: bs.length > 1 ? 70 : 92, color: C.forest, lineHeight: 1.05, letterSpacing: -1 }}>
            <span style={{ background: C.banana, borderRadius: 14, padding: "0 10px 4px" }}>{BNAME[b][0]}</span>{BNAME[b].slice(1)}
          </div>
        ))}
      </div>
      <PlateQ src={P409} aspect={A409} x={60} y={bs.length > 1 ? 340 : 290} w={960} h={bs.length > 1 ? 800 : 850} a={0} b={1} from={v} to={v} still ls={40}
        labels={bs.map((b) => ({ ...LBL[b], text: BNAME[b].toLowerCase(), t: 0, hot: true }))} />
      <div style={{ position: "absolute", left: 60, width: 960, top: 1180, display: "flex", flexWrap: "wrap", gap: 14 }}>
        <div style={{ background: C.forest, color: C.paper, borderRadius: 18, padding: "10px 22px 14px", fontWeight: 800, fontSize: 34 }}>{bs.length > 1 ? "Both" : BNAME[bs[0]].split(" ")[0]} → {BNERVE[bs[0]]}</div>
      </div>
      <div style={{ position: "absolute", right: 40, bottom: 26, fontWeight: 700, fontSize: 22, color: C.forest, opacity: 0.55 }}>Gray's Anatomy (1918), public domain</div>
    </AbsoluteFill>
  );
};

const Diag: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Back t={30} id="dg" w={1000} lit={{ TR: 0, LD: 0, LS: 0, RMI: 0, RMA: 0 }} hot={["RMI"]} peel={1} />
  </AbsoluteFill>
);

export const MyComposition = () => (
  <>
    <Composition id="Diag" component={Diag} durationInFrames={1} fps={30} width={1000} height={1000} />
    <Composition id="Main" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: false }} />
    <Composition id="Mask" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: true }} />
    <Composition id="TikTok" component={TikTok} durationInFrames={Math.ceil(TT_END * 30)} fps={30} width={1080} height={1920} />
    <Composition id="Cover" component={Cover} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "Back Muscles Quiz: Name This Muscle + the 4 Next to It", sub: "Gray's Anatomy (1918), public domain · anatomy flashcards · study tips" }} />
    <Composition id="Car" component={Carousel} durationInFrames={1} fps={30} width={CW} height={CH} defaultProps={{ n: 0 }} />
  </>
);
