import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import { C, FONT, ramp, useT } from "./kit";
import { END, Header, Subtitles, TT_CHAPTERS, TT_END } from "./Chrome102";
import { TT_WORDS } from "./words102";
import { Burst, Loud, PlateQ } from "./Scenes93";
import { VComment } from "./Scenes97";
import { A574, HOOKPIN, P574, TM_MAIN, TM_TT, TTDiag, V1, V2, V3, V4, V5, V6, V7, V8, hookStick } from "./Scenes102";
import { VCOL, VK, VNAME, Veins } from "./Veins102";
import { Mark } from "./Chrome102";

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
    <V2 s0={6.45} s1={8.6} four={6.72} bridge={7.14} big={7.69} />
    <V3 s0={8.6} s1={13.5} ce={8.69} thumb={9.66} head={11.16} climb={12.14} />
    <V4 s0={13.5} s1={16.6} ba={13.57} pinky={14.35} b={15.36} />
    <V5 s0={16.6} s1={19.75} ma={16.66} all={18.1} />
    <V6 s0={19.75} s1={24.95} q={19.85} cd={[[23.13, 3], [23.77, 2], [24.41, 1]]} />
    <V7 s0={24.95} s1={27.7} ce={25.11} groove={25.66} />
    <V8 s0={27.7} s1={END} />
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

/* TikTok cut 15–18 s: hook → reveal → bridge → cephalic thumb / basilic pinky (B = baby finger) → comment card. No brand, no store. */
export const TikTok: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Grid />
    <HookBurst R={TM_TT.reveal} />
    <V1 tm={TM_TT} />
    <TTDiag s0={6.45} s1={13.2} bridge={6.64} big={7.23} ce={8.68} climb={9.1} ba={10.4} b={11.86} />
    <VComment s0={13.2} s1={TT_END} />
    <Header chapters={TT_CHAPTERS} end={TT_END} brand={false} />
    <Subtitles words={TT_WORDS} />
  </AbsoluteFill>
);

const COVC: [number, number, number] = [0.52, 0.505, 0.5];

/* Cover 1080x1920 BEAST style: all text in y 280–1640, x 60–1020; no store name (also used on TikTok) */
const Cover: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT }}>
    <Burst w={1080} h={1920} cy={0.5} rot={4} />
    <div style={{ position: "absolute", left: 60, width: 960, top: 300, display: "flex", justifyContent: "center" }}><Loud size={150}>NAME THIS</Loud></div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 470, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "#E5251A", border: "9px solid #111", borderRadius: 22, padding: "2px 34px 14px", transform: "rotate(-2deg)", boxShadow: "0 10px 0 #111" }}><Loud size={130}>VEIN?</Loud></div>
    </div>
    <PlateQ src={P574} aspect={A574} x={140} y={690} w={800} h={860} a={0} b={1} from={COVC} to={COVC} still credit="" tilt={-3} loud
      pin={{ ...HOOKPIN, t0: 0, t1: 99, r: 95 }} arrow stickers={hookStick(99)} />
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
    <PlateQ src={P574} aspect={A574} x={120} y={330} w={760} h={780} a={0} b={1} from={COVC} to={COVC} still credit="" tilt={-2} loud
      pin={{ ...HOOKPIN, t0: 0, t1: 99, r: 90 }} arrow stickers={hookStick(99)} />
    <div style={{ position: "absolute", left: 50, width: 900, top: 1160, textAlign: "center", fontWeight: 800, fontSize: 46, color: "#111", lineHeight: 1.2 }}>{title}</div>
    <div style={{ position: "absolute", left: 50, width: 900, top: 1300, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "#111", color: "#FFE04A", fontWeight: 800, fontSize: 40, padding: "10px 30px 14px", borderRadius: 18 }}>Answer + flashcards → bookplume.com</div>
    </div>
    <div style={{ position: "absolute", left: 50, width: 900, top: 1410, textAlign: "center", color: "#111", opacity: 0.75, fontWeight: 700, fontSize: 22 }}>{sub}</div>
  </AbsoluteFill>
);

/* ---------- Instagram QUIZ carousel 1080x1350, 6 slides (n = 0..5) ---------- */
const CW = 1080, CH = 1350;
/* numbered pins on Gray's Fig. 574: 1 median cubital, 2 cephalic, 3 basilic, 4 median antebrachial */
const CPIN: [number, VK, number, number][] = [[1, "MC", 0.505, 0.504], [2, "CE", 0.43, 0.44], [3, "BA", 0.68, 0.585], [4, "MA", 0.528, 0.655]];
/* "?" stickers over every printed vein name in the crop */
const CSTK = [
  { x0: 0.755, y0: 0.436, x1: 0.97, y1: 0.46, off: 99 },
  { x0: 0.755, y0: 0.484, x1: 0.997, y1: 0.524, off: 99 },
  { x0: 0.755, y0: 0.564, x1: 0.97, y1: 0.589, off: 99 },
  { x0: 0.755, y0: 0.641, x1: 0.99, y1: 0.679, off: 99 },
  { x0: 0.055, y0: 0.561, x1: 0.255, y1: 0.592, off: 99 },
  { x0: 0.02, y0: 0.643, x1: 0.255, y1: 0.664, off: 99 },
];
const CVIEW: [number, number, number] = [0.53, 0.545, 0.74];
const NumDots: React.FC<{ w: number; h: number; only?: number }> = ({ w, h, only }) => {
  const [cx, cy, zw] = CVIEW;
  const iw = w / zw, ih = iw / A574, L = w / 2 - cx * iw, T = h / 2 - cy * ih;
  return (
    <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {CPIN.filter(([n]) => only === undefined || n === only).map(([n, , fx, fy]) => {
        const x = L + fx * iw, y = T + fy * ih;
        return (
          <g key={n}>
            <circle cx={x} cy={y} r={44} fill="none" stroke="#fff" strokeWidth={14} />
            <circle cx={x} cy={y} r={44} fill="none" stroke="#E5251A" strokeWidth={8} />
            <circle cx={x + 52} cy={y - 52} r={34} fill="#E5251A" stroke="#111" strokeWidth={6} />
            <text x={x + 52} y={y - 40} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={38} fill="#fff">{n}</text>
          </g>
        );
      })}
    </svg>
  );
};
const CarPlate: React.FC<{ x: number; y: number; w: number; h: number; only?: number; loud?: boolean; labels?: { x: number; y: number; text: string; t: number; hot?: boolean; ox: number; oy: number }[] }> = ({ x, y, w, h, only, loud, labels }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
    <PlateQ src={P574} aspect={A574} x={0} y={0} w={w} h={h} a={0} b={1} from={CVIEW} to={CVIEW} still credit={loud ? "" : "Gray's Anatomy, 1918 · public domain"} loud={loud} stickers={CSTK} labels={labels} ls={40} />
    {!labels && <NumDots w={w} h={h} only={only} />}
  </div>
);
const Carousel: React.FC<{ n: number }> = ({ n }) => {
  if (n === 0) {
    return (
      <AbsoluteFill style={{ fontFamily: FONT }}>
        <Burst w={CW} h={CH} cy={0.5} rot={6} />
        <div style={{ position: "absolute", left: 40, width: 1000, top: 40, textAlign: "center" }}><Loud size={96}>CAN YOU NAME</Loud></div>
        <div style={{ position: "absolute", left: 40, width: 1000, top: 152, display: "flex", justifyContent: "center" }}>
          <div style={{ background: "#E5251A", border: "8px solid #111", borderRadius: 20, padding: "0 26px 10px", transform: "rotate(-2deg)", boxShadow: "0 8px 0 #111" }}><Loud size={92}>ALL 4 VEINS?</Loud></div>
        </div>
        <CarPlate x={130} y={300} w={820} h={880} loud />
        <div style={{ position: "absolute", left: 60, width: 640, top: 1240, fontWeight: 800, fontSize: 34, color: "#111" }}>superficial arm veins · quiz</div>
        <div style={{ position: "absolute", left: 720, top: 1215, transform: "rotate(-5deg)", background: C.banana, border: "6px solid #111", borderRadius: 20, padding: "8px 20px 12px", fontWeight: 800, fontSize: 38, color: "#111", boxShadow: "0 6px 0 #111" }}>swipe for answers →</div>
      </AbsoluteFill>
    );
  }
  if (n === 5) {
    const ROWS: [VK, string][] = [["MC", "bridge across the elbow · common blood-draw site"], ["CE", "thumb side → deltopectoral groove"], ["BA", "pinky side · B = baby finger"], ["MA", "up the middle of the forearm"]];
    return (
      <AbsoluteFill style={{ fontFamily: FONT, background: C.forest }}>
        <div style={{ position: "absolute", left: 60, top: 50, fontWeight: 800, fontSize: 34, letterSpacing: 4, color: C.banana }}>ALL 4 · SUPERFICIAL ARM VEINS</div>
        <div style={{ position: "absolute", left: 60, top: 104, fontWeight: 800, fontSize: 46, color: C.paper, lineHeight: 1.1, whiteSpace: "nowrap" }}><span style={{ color: "#F5B060" }}>Cephalic</span> = thumb · <span style={{ color: "#8FA8E8" }}>B</span>asilic = <span style={{ color: "#8FA8E8" }}>B</span>aby finger</div>
        <div style={{ position: "absolute", left: 60, top: 290, display: "flex", flexDirection: "column", gap: 62 }}>
          {ROWS.map(([k, sub], i) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <div style={{ width: 70, height: 70, borderRadius: 35, background: "#E5251A", border: "5px solid #111", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 40 }}>{i + 1}</div>
              <div style={{ width: 24, height: 70, borderRadius: 12, background: VCOL[k], border: `4px solid ${C.paper}` }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: 50, color: C.paper, lineHeight: 1.05 }}>{VNAME[k]}</div>
                <div style={{ fontWeight: 700, fontSize: 30, color: "#B9D27A" }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 60, width: 960, top: 1000, fontWeight: 700, fontSize: 30, color: "#B9D27A", lineHeight: 1.3 }}>Cephalic = “head” (Greek). 1918 atlas: “vena mediana cubiti” = median cubital; “median antibrachial” = median antebrachial.</div>
        <div style={{ position: "absolute", left: 60, width: 960, top: 1170, display: "flex", justifyContent: "center" }}>
          <div style={{ background: C.banana, color: C.forest, borderRadius: 50, padding: "18px 50px 22px", fontWeight: 800, fontSize: 50 }}>Save this · bookplume.com</div>
        </div>
      </AbsoluteFill>
    );
  }
  const k = CPIN[n - 1][1];
  const footer: Record<VK, string> = {
    MC: "The bridge across the elbow crease: a common blood-draw site",
    CE: "Thumb side → up to the shoulder · cephalic = “head”",
    BA: "Pinky side · B = Basilic = Baby finger · dives deep mid-arm",
    MA: "Up the middle of the forearm · 1918: “median antibrachial”",
  };
  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: C.paper }}>
      <Dots w={CW} h={CH} />
      <div style={{ position: "absolute", left: 60, top: 46, display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 92, height: 92, borderRadius: 46, background: "#E5251A", border: "6px solid #111", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 52 }}>{n}</div>
        <div style={{ fontWeight: 800, fontSize: 40, color: C.matcha, letterSpacing: 3 }}>ANSWER</div>
      </div>
      <div style={{ position: "absolute", left: 60, width: 960, top: 160, fontWeight: 800, fontSize: k === "MA" ? 70 : 80, color: C.forest, lineHeight: 1.05, letterSpacing: -1, whiteSpace: "nowrap" }}>
        <span style={{ background: C.banana, borderRadius: 14, padding: "0 10px 4px" }}>{VNAME[k][0].toUpperCase()}</span>{VNAME[k].slice(1)} vein
      </div>
      {(k === "MC" || k === "BA") && (
        <CarPlate x={60} y={290} w={960} h={860} labels={k === "MC"
          ? [{ x: 0.505, y: 0.504, text: "median cubital", t: 0, hot: true, ox: 60, oy: 170 }, { x: 0.43, y: 0.44, text: "cephalic", t: 0, ox: -30, oy: 190 }, { x: 0.622, y: 0.452, text: "basilic", t: 0, ox: 150, oy: -40 }]
          : [{ x: 0.68, y: 0.585, text: "basilic", t: 0, hot: true, ox: -60, oy: 150 }, { x: 0.622, y: 0.452, text: "basilic", t: 0, hot: true, ox: -220, oy: 60 }]} />
      )}
      {(k === "CE" || k === "MA") && (
        <div style={{ position: "absolute", left: 60, top: 290, width: 960, height: 860, borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}`, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 480 - 345 * 0.74, top: 430 - (k === "CE" ? 560 : 900) * 0.74 }}>
            <Veins t={30} w={700 * 0.74} id={`c${n}`} lit={{ MC: 0, CE: 0, BA: 0, MA: 0 }} hot={[k]} dimRest={0.6} climb={k === "CE" ? 1 : 0} sides={1} />
          </div>
          <div style={{ position: "absolute", right: 20, bottom: 14, fontWeight: 700, fontSize: 22, color: C.forest, opacity: 0.55 }}>right arm, palm forward · diagram: Book Plume</div>
        </div>
      )}
      <div style={{ position: "absolute", left: 60, width: 960, top: 1180, display: "flex" }}>
        <div style={{ background: C.forest, color: C.paper, borderRadius: 18, padding: "10px 22px 14px", fontWeight: 800, fontSize: 32 }}>{footer[k]}</div>
      </div>
    </AbsoluteFill>
  );
};

const Diag: React.FC<{ mode: number }> = ({ mode }) => (
  <AbsoluteFill style={{ background: C.paper }}>
    <Veins t={30} id="dg" w={700} lit={{ MC: 0, CE: 0, BA: 0, MA: 0 }} hot={mode === 1 ? ["MC"] : []} sides={1} climb={1} dive={1} dimRest={0.5} />
  </AbsoluteFill>
);

export const MyComposition = () => (
  <>
    <Composition id="Diag" component={Diag} durationInFrames={1} fps={30} width={700} height={1500} defaultProps={{ mode: 0 }} />
    <Composition id="Main" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: false }} />
    <Composition id="Mask" component={Video} durationInFrames={Math.ceil(END * 30)} fps={30} width={1080} height={1920} defaultProps={{ mask: true }} />
    <Composition id="TikTok" component={TikTok} durationInFrames={Math.ceil(TT_END * 30)} fps={30} width={1080} height={1920} />
    <Composition id="Cover" component={Cover} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="Pin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} defaultProps={{ title: "Arm Veins Quiz: Name This Vein + the 3 Other Superficial Veins", sub: "Gray's Anatomy (1918), public domain · anatomy flashcards · study tips" }} />
    <Composition id="Car" component={Carousel} durationInFrames={1} fps={30} width={CW} height={CH} defaultProps={{ n: 0 }} />
  </>
);
