import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT } from "./kit";
import { Mark } from "./Chrome87";
import { PlateBox74 } from "./Scenes74";
import { A551, Chip, NAME, PLATE, TO } from "./Scenes87";
import { K, KCOL, KDARK, KORDER, KWORD, Knee, SectKnee } from "./Knee87";

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
const Row: React.FC<{ l: K; note: string; name?: string }> = ({ l, note, name }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 22, background: C.card, border: `4px solid ${C.line}`, borderRadius: 26, padding: "14px 26px" }}>
    <Chip k={l} size={76} />
    <div>
      <div style={{ fontWeight: 800, fontSize: 36, color: C.forest, lineHeight: 1.05 }}>{name ?? NAME[l]}</div>
      <div style={{ fontWeight: 700, fontSize: 27, color: C.matcha, lineHeight: 1.25, marginTop: 5 }}>{note}</div>
    </div>
  </div>
);
const DiagBox: React.FC<{ top: number; h?: number; lit: string[]; hot?: string[]; cam: [number, number, number]; id: string; tag?: boolean; diamond?: number; ssv?: number }> = ({ top, h = 520, lit, hot = [], cam, id, tag, diamond = 1, ssv = 0 }) => {
  const [s, cx, cy] = cam;
  return (
    <div style={{ position: "absolute", left: 60, top, width: 960, height: h, borderRadius: 30, overflow: "hidden", boxShadow: `0 0 0 4px ${C.line}`, background: C.card }}>
      <div style={{ position: "absolute", left: 480 - cx * s, top: h / 2 - cy * s }}>
        <Knee t={30} w={900 * s} id={id} lit={Object.fromEntries(lit.map((k) => [k, 0]))} hot={hot} dimRest={hot.length ? 0.6 : 0} diamond={diamond} ssv={ssv} tag={tag ? { S: "S", A: "A", V: "V", N: "N", B: "B" } : undefined} />
      </div>
      <div style={{ position: "absolute", right: 16, bottom: 10, fontWeight: 700, fontSize: 18, color: C.forest, opacity: 0.6 }}>right knee from behind · diagram: Book Plume</div>
    </div>
  );
};

/* 1. Cover */
const S1: React.FC = () => (
  <Frame n={1}>
    <div style={{ position: "absolute", left: 60, top: 64, width: 960 }}>
      <Kicker>ANATOMY · POPLITEAL FOSSA</Kicker>
      <H size={74}>Name all <span style={{ color: C.red }}>5</span> in the back of your knee</H>
    </div>
    <PlateBox74 src={PLATE} aspect={A551} x={60} y={380} w={960} h={760} a={0} b={1} from={[0.5, 0.16, 0.95]} to={[0.5, 0.16, 0.95]} still ls={42}
      labels={[{ x: 0.5, y: 0.15, text: "popliteal fossa", t: 0, hot: true, ox: -60, oy: -150 }]} />
    <div style={{ position: "absolute", right: 60, top: 1160, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 38, padding: "10px 26px 14px", borderRadius: 20 }}>1 sentence → swipe</div>
  </Frame>
);

/* 2. The mnemonic */
const S2: React.FC = () => (
  <Frame n={2} dark>
    <div style={{ position: "absolute", left: 60, top: 70, width: 960 }}>
      <Kicker dark>THE MNEMONIC · MEDIAL → LATERAL</Kicker>
      <div style={{ marginTop: 26, fontWeight: 800, fontSize: 64, color: C.banana, lineHeight: 1.1 }}>Serve And Volley Next Ball</div>
      <div style={{ marginTop: 50, display: "flex", flexDirection: "column", gap: 30 }}>
        {KORDER.map((l) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <Chip k={l} size={96} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 30, color: "#B9D27A" }}>{KWORD[l]}</div>
              <div style={{ fontWeight: 800, fontSize: l === "S" ? 40 : 50, color: C.paper, lineHeight: 1.05 }}>{NAME[l]}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 56, display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ fontWeight: 800, fontSize: 38, color: C.paper }}><span style={{ background: C.banana, color: C.forest, borderRadius: 10, padding: "0 12px 4px" }}>upper</span> S inside, B outside</div>
        <div style={{ fontWeight: 800, fontSize: 38, color: C.paper }}><span style={{ background: C.banana, color: C.forest, borderRadius: 10, padding: "0 12px 4px" }}>lower</span> 2 heads of gastrocnemius</div>
        <div style={{ fontWeight: 800, fontSize: 38, color: C.paper }}><span style={{ background: C.banana, color: C.forest, borderRadius: 10, padding: "0 12px 4px" }}>depth</span> skin → bone: nerve, vein, artery</div>
      </div>
    </div>
  </Frame>
);

/* 3. The borders: a diamond */
const S3: React.FC = () => (
  <Frame n={3}>
    <div style={{ position: "absolute", left: 60, top: 64, width: 960 }}>
      <Kicker>THE BORDERS</Kicker>
      <H size={70}>4 borders make a diamond</H>
    </div>
    <DiagBox id="c3" top={250} h={640} lit={["S", "B", "G"]} hot={["S", "B", "G"]} cam={[0.82, 455, 470]} />
    <div style={{ position: "absolute", left: 60, top: 920, width: 960, display: "flex", flexDirection: "column", gap: 16 }}>
      <Row l="S" name="Semimembranosus + semitendinosus" note="↖ upper medial border" />
      <Row l="B" note="↗ upper lateral border · below: 2 heads of gastrocnemius" />
    </div>
  </Frame>
);

/* 4. Contents */
const S4: React.FC = () => (
  <Frame n={4}>
    <div style={{ position: "absolute", left: 60, top: 64, width: 960 }}>
      <Kicker>WHAT'S INSIDE</Kicker>
      <H size={66}>Artery, vein, nerve in the middle</H>
    </div>
    <DiagBox id="c4" top={300} h={560} lit={["A", "V", "N", "CF", "SSV"]} hot={["A", "V", "N"]} cam={[1.15, 470, 420]} ssv={1} tag />
    <div style={{ position: "absolute", left: 60, top: 890, width: 960, display: "flex", flexDirection: "column", gap: 14 }}>
      <Row l="A" note="the femoral artery, renamed behind the knee" />
      <Row l="N" note="+ common fibular nerve along the biceps" />
    </div>
  </Frame>
);

/* 5. Depth: skin → bone */
const S5: React.FC = () => (
  <Frame n={5}>
    <div style={{ position: "absolute", left: 60, top: 64, width: 960 }}>
      <Kicker>EXAM FAVORITE</Kicker>
      <H size={66}>Which one lies deepest, on the bone?</H>
    </div>
    <div style={{ position: "absolute", left: 60, top: 300, width: 960, height: 600, borderRadius: 30, overflow: "hidden", boxShadow: `0 0 0 4px ${C.line}`, background: C.card }}>
      <div style={{ position: "absolute", left: 480 - 470 * 0.95, top: 300 - 470 * 0.95 }}>
        <SectKnee t={30} w={900 * 0.95} id="c5" lit={{ A: 0, V: 0, N: 0 }} hot={["A"]} arrow={1} />
      </div>
      <div style={{ position: "absolute", right: 16, bottom: 10, fontWeight: 700, fontSize: 18, color: C.forest, opacity: 0.6 }}>slice above the knee, bone on top · diagram: Book Plume</div>
    </div>
    <div style={{ position: "absolute", left: 60, top: 930, width: 960, display: "flex", flexDirection: "column", gap: 16 }}>
      <Row l="A" note="DEEPEST · skin → bone: nerve, vein, artery" />
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
      {KORDER.map((l) => <Chip key={l} k={l} size={150} />)}
    </div>
    <div style={{ position: "absolute", left: 60, top: 710, width: 960, fontWeight: 800, fontSize: 38, color: C.paper, lineHeight: 1.3 }}>
      Semimembranosus/semitendinosus · Artery · Vein · Nerve (tibial) · Biceps femoris
    </div>
    <div style={{ position: "absolute", left: 60, top: 880, width: 960, fontWeight: 700, fontSize: 34, color: C.paper, lineHeight: 1.35, opacity: 0.9 }}>
      Study with anatomy flashcards from Book Plume
    </div>
    <div style={{ position: "absolute", left: 60, top: 990, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 52, padding: "14px 34px 20px", borderRadius: 24 }}>bookplume.com</div>
    <div style={{ position: "absolute", left: 60, top: 1140, fontWeight: 700, fontSize: 22, color: C.paper, opacity: 0.6 }}>Plate: Gray's Anatomy (1918), Fig. 551, public domain · diagrams: Book Plume</div>
  </Frame>
);

export const Carousel: React.FC<{ n: number }> = ({ n }) => {
  const S = [S1, S2, S3, S4, S5, S6][n - 1] ?? S1;
  return <S />;
};
export const _unused = [KCOL, KDARK, TO];
