import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT } from "./kit";
import { Mark } from "./Chrome71";
import { PlateBox } from "./Scenes67";
import { A427, MChip } from "./Scenes71";
import { GCOL, GDARK, M, NAME, Palm } from "./Palm71";

/** 6-slide Instagram carousel, 1080x1350. Render each with --props='{"n":1..6}' */
const NS = 6;
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
      {Array.from({ length: NS }, (_, i) => i + 1).map((i) => (
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
const Row: React.FC<{ m: M; note: string }> = ({ m, note }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 22, background: C.card, border: `4px solid ${C.line}`, borderRadius: 26, padding: "20px 26px" }}>
    <MChip m={m} size={80} />
    <div>
      <div style={{ fontWeight: 800, fontSize: 44, color: C.forest, lineHeight: 1.05 }}>{NAME[m]}</div>
      <div style={{ fontWeight: 700, fontSize: 29, color: C.matcha, lineHeight: 1.25, marginTop: 6 }}>{note}</div>
    </div>
  </div>
);
const ALL = { APB: 0, OP: 0, FPB: 0, ADP: 0, ODM: 0, FDM: 0, ADM: 0 };
const Tag: React.FC<{ g: "th" | "ad" | "hy"; text: string }> = ({ g, text }) => (
  <div style={{ display: "inline-block", fontWeight: 800, fontSize: 34, color: C.forest, background: GCOL[g], border: `4px solid ${C.forest}`, borderRadius: 18, padding: "4px 22px 8px" }}>{text}</div>
);

/* 1. Cover */
const S1: React.FC = () => (
  <Frame n={1}>
    <div style={{ position: "absolute", left: 60, top: 64, width: 960 }}>
      <Kicker>ANATOMY · HAND</Kicker>
      <H size={84}>Can you name all <span style={{ color: C.red }}>7 palm muscles</span>?</H>
    </div>
    <PlateBox src="plates/hand427.png" aspect={A427} x={60} y={350} w={960} h={780} a={0} b={1} from={[0.56, 0.37, 0.86]} to={[0.56, 0.37, 0.86]} still
      labels={[
        { x: 0.76, y: 0.33, text: "thenar", t: 0, hot: true, ox: 40, oy: -110 },
        { x: 0.33, y: 0.37, text: "hypothenar", t: 0, hot: true, ox: 30, oy: -150 },
      ]} />
    <div style={{ position: "absolute", right: 60, top: 1160, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 38, padding: "10px 26px 14px", borderRadius: 20 }}>1 mnemonic → swipe</div>
  </Frame>
);

/* 2. The mnemonic */
const S2: React.FC = () => (
  <Frame n={2} dark>
    <div style={{ position: "absolute", left: 60, top: 70, width: 960 }}>
      <Kicker dark>THE MNEMONIC · THUMB → PINKY</Kicker>
      <div style={{ marginTop: 40, display: "flex", alignItems: "flex-end", gap: 14 }}>
        {[["A", "th"], ["OF", "th"], ["A", "ad"], ["OF", "hy"], ["A", "hy"]].map(([w, g], i) => (
          <span key={i} style={{ fontWeight: 800, fontSize: w.length > 1 ? 112 : 140, lineHeight: 1, color: C.forest, background: GCOL[g as "th"], borderRadius: 24, padding: "4px 18px 14px" }}>{w}</span>
        ))}
      </div>
      <div style={{ marginTop: 60, display: "flex", flexDirection: "column", gap: 20 }}>
        {(["APB", "OP", "FPB", "ADP", "ODM", "FDM", "ADM"] as M[]).map((m) => (
          <div key={m} style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <MChip m={m} size={66} />
            <div style={{ fontWeight: 800, fontSize: 46, color: C.paper }}>{NAME[m]}</div>
          </div>
        ))}
      </div>
    </div>
  </Frame>
);

/* 3. Thenar */
const S3: React.FC = () => (
  <Frame n={3}>
    <div style={{ position: "absolute", left: 60, top: 64, width: 960 }}>
      <Kicker>THUMB SIDE</Kicker>
      <H>Thenar = 3 muscles</H>
      <div style={{ marginTop: 16 }}><Tag g="th" text="median nerve · recurrent branch" /></div>
      <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 20 }}>
        <Row m="APB" note="moves the thumb away from the palm" />
        <Row m="OP" note="deep · turns the thumb to meet the fingers" />
        <Row m="FPB" note="bends the thumb · deep head often ulnar" />
      </div>
    </div>
    <div style={{ position: "absolute", left: 60, top: 800, width: 960, height: 420, borderRadius: 30, overflow: "hidden", boxShadow: `0 0 0 4px ${C.line}`, background: C.paper }}>
      <div style={{ position: "absolute", left: -29, top: -697 }}><Palm t={20} w={1100} id="c3" lit={{ APB: 0, OP: 0, FPB: 0 }} letters={1} /></div>
    </div>
  </Frame>
);

/* 4. Adductor + hypothenar */
const S4: React.FC = () => (
  <Frame n={4}>
    <div style={{ position: "absolute", left: 60, top: 64, width: 960 }}>
      <Kicker>MIDDLE + PINKY SIDE</Kicker>
      <H>Adductor + hypothenar 3</H>
      <div style={{ marginTop: 16 }}><Tag g="hy" text="ulnar nerve · deep branch" /></div>
      <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 16 }}>
        <Row m="ADP" note="fan-shaped · pulls the thumb in" />
        <Row m="ODM" note="deep · cups the little finger forward" />
        <Row m="FDM" note="bends the little finger" />
        <Row m="ADM" note="spreads the little finger" />
      </div>
    </div>
  </Frame>
);

/* 5. Plate with modern names */
const S5: React.FC = () => (
  <Frame n={5}>
    <div style={{ position: "absolute", left: 60, top: 64, width: 960 }}>
      <Kicker>ON THE REAL ATLAS · GRAY'S 1918</Kicker>
      <H size={64}>Find them on the plate</H>
    </div>
    <PlateBox src="plates/hand427.png" aspect={A427} x={60} y={250} w={960} h={890} a={0} b={1} from={[0.56, 0.38, 0.8]} to={[0.56, 0.38, 0.8]} still
      labels={[
        { x: 0.725, y: 0.305, text: "abductor pollicis brevis", t: 0, ox: -60, oy: -170 },
        { x: 0.7, y: 0.385, text: "flexor pollicis brevis", t: 0, ox: -40, oy: 130 },
        { x: 0.725, y: 0.468, text: "adductor pollicis", t: 0, ox: -40, oy: 200 },
        { x: 0.29, y: 0.4, text: "abductor digiti minimi", t: 0, hot: true, ox: 30, oy: -240 },
        { x: 0.375, y: 0.43, text: "flexor digiti minimi", t: 0, ox: 60, oy: -150 },
      ]} />
    <div style={{ position: "absolute", left: 60, top: 1160, background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 18px 10px", fontWeight: 800, fontSize: 28, color: C.forest }}>
      <span style={{ color: C.matcha }}>1918 atlas name:</span> “digiti quinti” = digiti minimi
    </div>
  </Frame>
);

/* 6. Save + CTA */
const S6: React.FC = () => (
  <Frame n={6} dark>
    <div style={{ position: "absolute", left: 60, top: 90, width: 960 }}>
      <Kicker dark>QUICK RECAP</Kicker>
      <H color={C.paper} size={88}>A · OF · A · OF · A</H>
      <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 22 }}>
        {[["th", "Thenar 3 → median nerve"], ["ad", "Adductor pollicis → ulnar"], ["hy", "Hypothenar 3 → ulnar"]].map(([g, txt]) => (
          <div key={g} style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: GCOL[g as "th"] }} />
            <div style={{ fontWeight: 800, fontSize: 50, color: C.paper }}>{txt}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 90, fontWeight: 800, fontSize: 76, color: C.banana, lineHeight: 1.05 }}>Save this for your next anatomy exam</div>
      <div style={{ marginTop: 40, display: "inline-block", background: C.banana, color: C.forest, fontWeight: 800, fontSize: 44, padding: "12px 30px 16px", borderRadius: 22 }}>anatomy flash cards → bookplume.com</div>
    </div>
    <div style={{ position: "absolute", left: 60, bottom: 120, color: C.paper, opacity: 0.55, fontWeight: 700, fontSize: 22 }}>Plate: Gray's Anatomy (1918), Fig. 427, public domain · diagrams: Book Plume</div>
  </Frame>
);

export const CarouselSlide: React.FC<{ n: number }> = ({ n }) => {
  const S = [S1, S2, S3, S4, S5, S6][n - 1];
  return <S />;
};
// keep GDARK referenced for consistent palette imports
export const _g = GDARK;
