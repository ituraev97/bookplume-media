import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT } from "./kit";
import { Mark } from "./Chrome79";
import { PlateBox74 } from "./Scenes74";
import { A809, A810, MN, PLATE, PLATE2, SChip } from "./Scenes79";
import { Cord, L4, LETTERS, M, N } from "./Cord79";

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
const Row: React.FC<{ l: L4; note: string; name?: string }> = ({ l, note, name }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 22, background: C.card, border: `4px solid ${C.line}`, borderRadius: 26, padding: "16px 26px" }}>
    <SChip l={l} size={80} />
    <div>
      <div style={{ fontWeight: 800, fontSize: 40, color: C.forest, lineHeight: 1.05 }}>{name ?? MN[l].name}</div>
      <div style={{ fontWeight: 700, fontSize: 28, color: C.matcha, lineHeight: 1.25, marginTop: 6 }}>{note}</div>
    </div>
  </div>
);
/* diagram box: camera [scale, cx, cy] in viewBox units */
const DiagBox: React.FC<{ top: number; h?: number; ns: N[]; ms: M[]; hot?: N[]; hotM?: M[]; cam: [number, number, number]; id: string }> = ({ top, h = 520, ns, ms, hot = [], hotM = [], cam, id }) => {
  const [s, cx, cy] = cam;
  const u = (960 / 900) * s;
  return (
    <div style={{ position: "absolute", left: 60, top, width: 960, height: h, borderRadius: 30, overflow: "hidden", boxShadow: `0 0 0 4px ${C.line}`, background: C.paper }}>
      <div style={{ position: "absolute", left: 480 - cx * u, top: h / 2 - cy * u }}>
        <Cord t={30} w={960 * s} id={id} lit={Object.fromEntries(ns.map((k) => [k, 0]))} mus={Object.fromEntries(ms.map((k) => [k, 0]))} hot={hot} hotM={hotM} dimRest={0.6} />
      </div>
    </div>
  );
};

/* 1. Cover */
const S1: React.FC = () => (
  <Frame n={1}>
    <div style={{ position: "absolute", left: 60, top: 64, width: 960 }}>
      <Kicker>ANATOMY · BRACHIAL PLEXUS</Kicker>
      <H size={86}>Name the 5 branches of the <span style={{ color: C.red }}>posterior cord</span></H>
    </div>
    <PlateBox74 src={PLATE} aspect={A809} x={60} y={380} w={960} h={760} a={0} b={1} from={[0.5, 0.48, 0.66]} to={[0.5, 0.48, 0.66]} still ls={44}
      labels={[{ x: 0.535, y: 0.315, text: "5 nerves", t: 0, hot: true, ox: 140, oy: -150 }]} />
    <div style={{ position: "absolute", right: 60, top: 1160, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 38, padding: "10px 26px 14px", borderRadius: 20 }}>1 word → swipe</div>
  </Frame>
);

/* 2. The mnemonic */
const S2: React.FC = () => (
  <Frame n={2} dark>
    <div style={{ position: "absolute", left: 60, top: 70, width: 960 }}>
      <Kicker dark>THE MNEMONIC</Kicker>
      <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 26 }}>
        {LETTERS.map((l) => <SChip key={l} l={l} size={200} />)}
      </div>
      <div style={{ marginTop: 70, display: "flex", flexDirection: "column", gap: 40 }}>
        {LETTERS.map((l) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <SChip l={l} size={92} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 48, color: C.paper, lineHeight: 1.05 }}>{MN[l].name}</div>
              <div style={{ fontWeight: 700, fontSize: 32, color: C.banana, marginTop: 4 }}>→ {MN[l].to}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 64, fontWeight: 800, fontSize: 64, color: C.banana }}>4 letters = 5 nerves</div>
    </div>
  </Frame>
);

/* 3. S: upper + lower subscapular */
const S3: React.FC = () => (
  <Frame n={3}>
    <div style={{ position: "absolute", left: 60, top: 64, width: 960 }}>
      <Kicker>S = 2 NERVES</Kicker>
      <H>Upper + lower subscapular</H>
    </div>
    <DiagBox id="c3" top={270} h={560} ns={["US", "LS"]} ms={["SS", "TM"]} hot={["US", "LS"]} cam={[1.1, 540, 520]} />
    <div style={{ position: "absolute", left: 60, top: 860, width: 960, display: "flex", flexDirection: "column", gap: 16 }}>
      <Row l="S" name="Upper subscapular" note="→ upper part of subscapularis" />
      <Row l="S" name="Lower subscapular" note="→ lower subscapularis + teres major" />
    </div>
  </Frame>
);

/* 4. T: thoracodorsal on Gray's Fig. 809 */
const S4: React.FC = () => (
  <Frame n={4}>
    <div style={{ position: "absolute", left: 60, top: 64, width: 960 }}>
      <Kicker>T = THORACODORSAL</Kicker>
      <H size={64}>Nerve to latissimus dorsi</H>
    </div>
    <PlateBox74 src={PLATE} aspect={A809} x={60} y={270} w={960} h={600} a={0} b={1} from={[0.47, 0.62, 0.56]} to={[0.47, 0.62, 0.56]} still ls={38}
      labels={[{ x: 0.483, y: 0.58, text: "thoracodorsal nerve", t: 0, hot: true, ox: -40, oy: -170 }]} />
    <div style={{ position: "absolute", left: 60, top: 900, width: 960, display: "flex", flexDirection: "column", gap: 16 }}>
      <Row l="T" note="→ latissimus dorsi (big back muscle)" />
      <div style={{ fontSize: 30, fontWeight: 700, color: C.forest }}>
        <span style={{ background: C.banana, borderRadius: 10, padding: "0 10px 3px", fontWeight: 800 }}>1918 atlas name</span> “long subscapular nerve”
      </div>
    </div>
  </Frame>
);

/* 5. A + R */
const S5: React.FC = () => (
  <Frame n={5}>
    <div style={{ position: "absolute", left: 60, top: 64, width: 960 }}>
      <Kicker>A + R · THE 2 BIG ONES</Kicker>
      <H size={70}>Axillary + radial</H>
    </div>
    <PlateBox74 src={PLATE2} aspect={A810} x={60} y={240} w={960} h={560} a={0} b={1} from={[0.56, 0.42, 0.72]} to={[0.56, 0.42, 0.72]} still ls={36}
      labels={[{ x: 0.53, y: 0.43, text: "axillary nerve", t: 0, hot: true, ox: -60, oy: 180 }]} />
    <div style={{ position: "absolute", left: 60, top: 830, width: 960, display: "flex", flexDirection: "column", gap: 16 }}>
      <Row l="A" note="around the surgical neck → deltoid + teres minor" />
      <Row l="R" note="biggest branch → triceps, back of arm + forearm" />
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
      {LETTERS.map((l) => <SChip key={l} l={l} size={140} />)}
    </div>
    <div style={{ position: "absolute", left: 60, top: 700, width: 960, fontWeight: 800, fontSize: 40, color: C.paper, lineHeight: 1.3 }}>
      Subscapular ×2 · Thoracodorsal · Axillary · Radial
    </div>
    <div style={{ position: "absolute", left: 60, top: 860, width: 960, fontWeight: 700, fontSize: 36, color: C.paper, lineHeight: 1.35, opacity: 0.9 }}>
      Study with anatomy flashcards from Book Plume
    </div>
    <div style={{ position: "absolute", left: 60, top: 990, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 52, padding: "14px 34px 20px", borderRadius: 24 }}>bookplume.com</div>
    <div style={{ position: "absolute", left: 60, top: 1140, fontWeight: 700, fontSize: 22, color: C.paper, opacity: 0.6 }}>Plates: Gray's Anatomy (1918), Figs. 809, 810, public domain · diagrams: Book Plume</div>
  </Frame>
);

export const CarouselSlide: React.FC<{ n: number }> = ({ n }) => {
  const S = [S1, S2, S3, S4, S5, S6][n - 1] ?? S1;
  return <S />;
};
