import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT } from "./kit";
import { Mark } from "./Chrome75";
import { PlateBox74 } from "./Scenes74";
import { A422, GROUPS, NChip, PLATE } from "./Scenes75";
import { GCOL, K, Tunnel } from "./Tunnel75";

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
const Row: React.FC<{ i: number; note: string }> = ({ i, note }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 22, background: C.card, border: `4px solid ${C.line}`, borderRadius: 26, padding: "18px 26px" }}>
    <NChip n={GROUPS[i].n} g={GROUPS[i].g} size={80} />
    <div>
      <div style={{ fontWeight: 800, fontSize: 42, color: C.forest, lineHeight: 1.05 }}>{GROUPS[i].name}</div>
      <div style={{ fontWeight: 700, fontSize: 29, color: C.matcha, lineHeight: 1.25, marginTop: 6 }}>{note}</div>
    </div>
  </div>
);
const lit = (ks: K[]) => Object.fromEntries(ks.map((k) => [k, 0])) as Partial<Record<K, number>>;
const DiagBox: React.FC<{ top: number; ks: K[]; hot?: K[]; ulnar?: number; ret?: number; floor?: number; names?: boolean; h?: number }> = ({ top, ks, hot = [], ulnar = 0, ret = 0, floor = 0, names, h = 560 }) => (
  <div style={{ position: "absolute", left: 60, top, width: 960, height: h, borderRadius: 30, overflow: "hidden", boxShadow: `0 0 0 4px ${C.line}`, background: C.paper }}>
    <div style={{ position: "absolute", left: (960 - 1000) / 2, top: (h - 711) / 2 }}>
      <Tunnel t={30} w={1000} id={`c${top}${ks.length}`} lit={lit(ks)} hot={hot} nums ulnar={ulnar} ret={ret} floor={floor} boneNames={names ? 1 : 0} />
    </div>
  </div>
);
const ALLK: K[] = ["S2", "S3", "S4", "S5", "P2", "P3", "P4", "P5", "FPL", "MED"];

/* 1. Cover */
const S1: React.FC = () => (
  <Frame n={1}>
    <div style={{ position: "absolute", left: 60, top: 64, width: 960 }}>
      <Kicker>ANATOMY · WRIST</Kicker>
      <H size={88}>What passes through the <span style={{ color: C.red }}>carpal tunnel</span>?</H>
    </div>
    <PlateBox74 src={PLATE} aspect={A422} x={60} y={380} w={960} h={760} a={0} b={1} from={[0.48, 0.47, 0.62]} to={[0.48, 0.47, 0.62]} still ls={44}
      labels={[{ x: 0.5, y: 0.47, text: "10 things", t: 0, hot: true, ox: 170, oy: -170 }]} />
    <div style={{ position: "absolute", right: 60, top: 1160, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 38, padding: "10px 26px 14px", borderRadius: 20 }}>4 numbers → swipe</div>
  </Frame>
);

/* 2. The mnemonic */
const S2: React.FC = () => (
  <Frame n={2} dark>
    <div style={{ position: "absolute", left: 60, top: 70, width: 960 }}>
      <Kicker dark>THE MNEMONIC</Kicker>
      <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 18 }}>
        {GROUPS.map((g, i) => (
          <React.Fragment key={i}>
            <NChip n={g.n} g={g.g} size={190} />
            {i < 3 && <span style={{ fontWeight: 800, fontSize: 70, color: C.paper }}>·</span>}
          </React.Fragment>
        ))}
      </div>
      <div style={{ marginTop: 80, display: "flex", flexDirection: "column", gap: 44 }}>
        {GROUPS.map((g, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <NChip n={g.n} g={g.g} size={92} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 52, color: C.paper, lineHeight: 1.05 }}>{g.name}</div>
              <div style={{ fontWeight: 700, fontSize: 32, color: C.banana, marginTop: 4 }}>{g.short}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 80, fontWeight: 800, fontSize: 72, color: C.banana }}>4 + 4 + 1 + 1 = 10</div>
    </div>
  </Frame>
);

/* 3. The 8 finger tendons */
const S3: React.FC = () => (
  <Frame n={3}>
    <div style={{ position: "absolute", left: 60, top: 64, width: 960 }}>
      <Kicker>4 + 4 FINGER TENDONS</Kicker>
      <H>Superficialis on top, profundus underneath</H>
    </div>
    <DiagBox top={300} ks={["S2", "S3", "S4", "S5", "P2", "P3", "P4", "P5"]} h={520} />
    <div style={{ position: "absolute", left: 60, top: 850, width: 960, display: "flex", flexDirection: "column", gap: 16 }}>
      <Row i={0} note="4 tendons · superficial row" />
      <Row i={1} note="4 tendons · deep row (profundus = deep)" />
    </div>
  </Frame>
);

/* 4. The thumb tendon + the nerve */
const S4: React.FC = () => (
  <Frame n={4}>
    <div style={{ position: "absolute", left: 60, top: 64, width: 960 }}>
      <Kicker>1 + 1 · THUMB SIDE</Kicker>
      <H>1 thumb tendon + the only nerve</H>
    </div>
    <DiagBox top={300} ks={ALLK} hot={["FPL", "MED"]} h={520} />
    <div style={{ position: "absolute", left: 60, top: 850, width: 960, display: "flex", flexDirection: "column", gap: 16 }}>
      <Row i={2} note="pollicis = of the thumb" />
      <Row i={3} note="just under the roof, thumb side" />
    </div>
  </Frame>
);

/* 5. Roof, floor, and what is NOT inside */
const S5: React.FC = () => (
  <Frame n={5}>
    <div style={{ position: "absolute", left: 60, top: 64, width: 960 }}>
      <Kicker>THE WALLS + THE TRAP</Kicker>
      <H size={70}>Roof, floor and what's <span style={{ color: C.red }}>outside</span></H>
    </div>
    <DiagBox top={300} ks={ALLK} ulnar={1} ret={0.8} floor={0.8} names h={520} />
    <div style={{ position: "absolute", left: 60, top: 850, width: 960, display: "flex", flexDirection: "column", gap: 14 }}>
      {[
        ["roof", "flexor retinaculum (aka transverse carpal ligament)"],
        ["floor", "carpal bones: trapezium, trapezoid, capitate, hamate"],
        ["NOT inside", "ulnar nerve + artery → Guyon's canal"],
        ["NOT inside", "flexor carpi radialis · palmaris longus"],
      ].map(([a, b], i) => (
        <div key={i} style={{ fontSize: 31, fontWeight: 700, color: C.forest, lineHeight: 1.25 }}>
          <span style={{ background: i > 1 ? C.red : C.banana, color: i > 1 ? C.paper : C.forest, borderRadius: 10, padding: "0 10px 3px", fontWeight: 800 }}>{a}</span> {b}
        </div>
      ))}
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
    <div style={{ position: "absolute", left: 60, top: 520, width: 960, display: "flex", alignItems: "center", gap: 18 }}>
      {GROUPS.map((g, i) => (
        <React.Fragment key={i}>
          <NChip n={g.n} g={g.g} size={130} />
          {i < 3 && <span style={{ fontWeight: 800, fontSize: 60, color: C.paper }}>·</span>}
        </React.Fragment>
      ))}
    </div>
    <div style={{ position: "absolute", left: 60, top: 700, width: 960, fontWeight: 800, fontSize: 44, color: C.paper, lineHeight: 1.3 }}>
      FDS · FDP · FPL · <span style={{ color: GCOL.M }}>median nerve</span>
    </div>
    <div style={{ position: "absolute", left: 60, top: 860, width: 960, fontWeight: 700, fontSize: 36, color: C.paper, lineHeight: 1.35, opacity: 0.9 }}>
      Study with anatomy flashcards from Book Plume
    </div>
    <div style={{ position: "absolute", left: 60, top: 990, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 52, padding: "14px 34px 20px", borderRadius: 24 }}>bookplume.com</div>
    <div style={{ position: "absolute", left: 60, top: 1140, fontWeight: 700, fontSize: 22, color: C.paper, opacity: 0.6 }}>Plate: Gray's Anatomy (1918), Fig. 422, public domain · diagrams: Book Plume</div>
  </Frame>
);

export const CarouselSlide: React.FC<{ n: number }> = ({ n }) => {
  const S = [S1, S2, S3, S4, S5, S6][n - 1] ?? S1;
  return <S />;
};
