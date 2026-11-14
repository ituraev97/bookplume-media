import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT } from "./kit";
import { Mark } from "./Chrome83";
import { PlateBox74 } from "./Scenes74";
import { A829, A832, Chip, MN, P829, P832 } from "./Scenes83";
import { Glute, N, NNAME, NS } from "./Glute83";

/** 6-slide Instagram carousel, 1080x1350. Render each with --props='{"n":1..6}' */
const NSL = 6;
const Frame: React.FC<{ n: number; children: React.ReactNode; dark?: boolean }> = ({ n, children, dark }) => (
  <AbsoluteFill style={{ background: dark ? C.forest : C.paper, fontFamily: FONT }}>
    <svg width={1080} height={1350} style={{ position: "absolute" }}>
      <defs>
        <pattern id="cg" width={54} height={54} patternUnits="userSpaceOnUse">
          <circle cx={27} cy={27} r={2.2} fill={dark ? C.matchaLight : C.matcha} opacity={dark ? 0.12 : 0.13} />
        </pattern>
      </defs>
      <rect width={1080} height={1350} fill="url(#cg)" />
    </svg>
    {children}
    <div style={{ position: "absolute", left: 60, bottom: 40, display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 58, height: 58, borderRadius: 29, background: dark ? C.matcha : C.forest, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Mark size={42} reversed />
      </div>
      <div style={{ fontWeight: 800, fontSize: 32, color: dark ? C.paper : C.forest }}>Book Plume</div>
    </div>
    <div style={{ position: "absolute", right: 60, bottom: 62, display: "flex", gap: 10 }}>
      {Array.from({ length: NSL }, (_, i) => i + 1).map((i) => (
        <div key={i} style={{ width: i === n ? 34 : 14, height: 14, borderRadius: 7, background: i === n ? C.banana : dark ? "rgba(247,246,236,0.3)" : C.line }} />
      ))}
    </div>
  </AbsoluteFill>
);
const Kicker: React.FC<{ children: React.ReactNode; dark?: boolean }> = ({ children, dark }) => (
  <div style={{ fontWeight: 800, fontSize: 30, letterSpacing: 6, color: dark ? C.matchaLight : C.matcha }}>{children}</div>
);
const H: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({ children, size = 76, color = C.forest }) => (
  <div style={{ marginTop: 12, fontWeight: 800, fontSize: size, lineHeight: 1.04, letterSpacing: -1.5, color }}>{children}</div>
);
const Row: React.FC<{ l: N; note: string; name?: string }> = ({ l, note, name }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 22, background: C.card, border: `4px solid ${C.line}`, borderRadius: 26, padding: "14px 26px" }}>
    <Chip l={l} size={76} />
    <div>
      <div style={{ fontWeight: 800, fontSize: 38, color: C.forest, lineHeight: 1.05 }}>{name ?? NNAME[l]}</div>
      <div style={{ fontWeight: 700, fontSize: 27, color: C.matcha, lineHeight: 1.25, marginTop: 5 }}>{note}</div>
    </div>
  </div>
);
const DiagBox: React.FC<{ top: number; h?: number; lit: N[]; hot?: N[]; cam: [number, number, number]; id: string; pir?: number; max?: number; maxLit?: number; med?: number; divide?: number; mark?: boolean }> = ({ top, h = 520, lit, hot = [], cam, id, pir = 1, max = 0, maxLit = 0, med = 0, divide = 0, mark }) => {
  const [s, cx, cy] = cam;
  return (
    <div style={{ position: "absolute", left: 60, top, width: 960, height: h, borderRadius: 30, overflow: "hidden", boxShadow: `0 0 0 4px ${C.line}`, background: C.card }}>
      <div style={{ position: "absolute", left: 480 - cx * s, top: h / 2 - cy * s }}>
        <Glute t={30} w={860 * s} id={id} lit={Object.fromEntries(lit.map((k) => [k, 0]))} hot={hot} dim={hot.length ? 0.55 : 0} pir={pir} max={max} maxLit={maxLit} med={med} divide={divide}
          mark={mark ? { SG: "S", IG: "I", SC: "S", PF: "P", PU: "P" } : undefined} />
      </div>
      <div style={{ position: "absolute", right: 16, bottom: 10, fontWeight: 700, fontSize: 18, color: C.forest, opacity: 0.6 }}>right buttock, back view · diagram: Book Plume</div>
    </div>
  );
};

/* 1. Cover */
const S1: React.FC = () => (
  <Frame n={1}>
    <div style={{ position: "absolute", left: 60, top: 64, width: 960 }}>
      <Kicker>ANATOMY · SACRAL PLEXUS</Kicker>
      <H size={74}>Name the <span style={{ color: C.red }}>5 big branches</span> of the sacral plexus</H>
    </div>
    <PlateBox74 src={P832} aspect={A832} x={60} y={380} w={960} h={760} a={0} b={1} from={[0.5, 0.33, 0.95]} to={[0.5, 0.33, 0.95]} still ls={42}
      labels={[{ x: 0.5, y: 0.42, text: "5 nerves", t: 0, hot: true, ox: 150, oy: 60 }]} />
    <div style={{ position: "absolute", right: 60, top: 1160, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 38, padding: "10px 26px 14px", borderRadius: 20 }}>1 sentence → swipe</div>
  </Frame>
);

/* 2. The mnemonic */
const S2: React.FC = () => (
  <Frame n={2} dark>
    <div style={{ position: "absolute", left: 60, top: 70, width: 960 }}>
      <Kicker dark>THE MNEMONIC</Kicker>
      <div style={{ marginTop: 26, fontWeight: 800, fontSize: 64, color: C.banana, lineHeight: 1.1 }}>Some Irish Sailor Pesters Polly</div>
      <div style={{ marginTop: 50, display: "flex", flexDirection: "column", gap: 34 }}>
        {NS.map((l) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <Chip l={l} size={96} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 30, color: "#B9D27A" }}>{MN[l].word}</div>
              <div style={{ fontWeight: 800, fontSize: 50, color: C.paper, lineHeight: 1.05 }}>{NNAME[l]}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 60, display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ fontWeight: 800, fontSize: 38, color: C.paper }}><span style={{ background: C.banana, color: C.forest, borderRadius: 10, padding: "0 12px 4px" }}>roots</span> L4–S4, on the piriformis</div>
        <div style={{ fontWeight: 800, fontSize: 38, color: C.paper }}><span style={{ background: C.banana, color: C.forest, borderRadius: 10, padding: "0 12px 4px" }}>exit</span> greater sciatic foramen</div>
        <div style={{ fontWeight: 800, fontSize: 38, color: C.paper }}><span style={{ background: C.banana, color: C.forest, borderRadius: 10, padding: "0 12px 4px" }}>rule</span> 1 above piriformis, 4 below</div>
      </div>
    </div>
  </Frame>
);

/* 3. Above vs below piriformis */
const S3: React.FC = () => (
  <Frame n={3}>
    <div style={{ position: "absolute", left: 60, top: 64, width: 960 }}>
      <Kicker>THE LANDMARK · PIRIFORMIS</Kicker>
      <H size={70}>1 nerve above, 4 below</H>
    </div>
    <DiagBox id="c3" top={250} h={640} lit={["SG", "IG", "SC", "PF", "PU"]} cam={[1.0, 430, 440]} divide={1} mark />
    <div style={{ position: "absolute", left: 60, top: 920, width: 960, display: "flex", flexDirection: "column", gap: 16 }}>
      <Row l="SG" note="↑ ABOVE piriformis" />
      <div style={{ fontWeight: 800, fontSize: 36, color: C.forest, lineHeight: 1.3 }}>
        <span style={{ background: C.banana, borderRadius: 10, padding: "0 10px 3px" }}>↓ BELOW</span> inferior gluteal · sciatic · posterior femoral cutaneous · pudendal
      </div>
    </div>
  </Frame>
);

/* 4. Sciatic + pudendal on Gray's 1918 */
const S4: React.FC = () => (
  <Frame n={4}>
    <div style={{ position: "absolute", left: 60, top: 64, width: 960 }}>
      <Kicker>GRAY'S ANATOMY, 1918</Kicker>
      <H size={66}>Sciatic = the biggest nerve in your body</H>
    </div>
    <PlateBox74 src={P832} aspect={A832} x={60} y={300} w={960} h={600} a={0} b={1} from={[0.45, 0.38, 0.95]} to={[0.45, 0.38, 0.95]} still ls={34}
      labels={[
        { x: 0.5, y: 0.47, text: "sciatic", t: 0, hot: true, ox: 170, oy: 40 },
        { x: 0.28, y: 0.33, text: "pudendal", t: 0, ox: -60, oy: -100 },
      ]} />
    <div style={{ position: "absolute", left: 60, top: 930, width: 960, display: "flex", flexDirection: "column", gap: 16 }}>
      <Row l="SC" note="L4–S3 · back of thigh, leg + foot" />
      <Row l="PU" note="out, around the ischial spine, back in → perineum" />
    </div>
  </Frame>
);

/* 5. Quiz answer: who powers which glute */
const S5: React.FC = () => (
  <Frame n={5}>
    <div style={{ position: "absolute", left: 60, top: 64, width: 960 }}>
      <Kicker>EXAM FAVORITE</Kicker>
      <H size={66}>Which nerve powers gluteus maximus?</H>
    </div>
    <DiagBox id="c5" top={300} h={560} lit={["IG"]} hot={["IG"]} cam={[0.92, 450, 420]} pir={0.4} max={1} maxLit={1} />
    <div style={{ position: "absolute", left: 60, top: 890, width: 960, display: "flex", flexDirection: "column", gap: 16 }}>
      <Row l="IG" note="→ gluteus MAXIMUS (the big one)" />
      <Row l="SG" note="→ gluteus MEDIUS + MINIMUS (+ TFL)" />
    </div>
  </Frame>
);

/* 6. Save + follow */
const S6: React.FC = () => (
  <Frame n={6} dark>
    <div style={{ position: "absolute", left: 60, top: 90, width: 960 }}>
      <Kicker dark>CHEAT SHEET</Kicker>
      <H size={96} color={C.paper}>Save this for your next anatomy exam</H>
    </div>
    <div style={{ position: "absolute", left: 60, top: 520, width: 960, display: "flex", alignItems: "center", gap: 22 }}>
      {NS.map((l) => <Chip key={l} l={l} size={150} />)}
    </div>
    <div style={{ position: "absolute", left: 60, top: 710, width: 960, fontWeight: 800, fontSize: 38, color: C.paper, lineHeight: 1.3 }}>
      Superior gluteal · Inferior gluteal · Sciatic · Posterior femoral cutaneous · Pudendal
    </div>
    <div style={{ position: "absolute", left: 60, top: 880, width: 960, fontWeight: 700, fontSize: 34, color: C.paper, lineHeight: 1.35, opacity: 0.9 }}>
      Study with anatomy flashcards from Book Plume
    </div>
    <div style={{ position: "absolute", left: 60, top: 990, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 52, padding: "14px 34px 20px", borderRadius: 24 }}>bookplume.com</div>
    <div style={{ position: "absolute", left: 60, top: 1140, fontWeight: 700, fontSize: 22, color: C.paper, opacity: 0.6 }}>Plates: Gray's Anatomy (1918), Figs. 829, 832, public domain · diagrams: Book Plume</div>
  </Frame>
);

export const Carousel: React.FC<{ n: number }> = ({ n }) => {
  const S = [S1, S2, S3, S4, S5, S6][n - 1] ?? S1;
  return <S />;
};
export const _unused = [A829, P829];
