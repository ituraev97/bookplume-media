import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT } from "./kit";
import { Plate } from "./Plates";
import { Mark } from "./Chrome";
import { AxillaDiagram } from "./Axilla63";
import { ASP, BRS, LChip, PCOL } from "./Scenes63";

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
const Row: React.FC<{ b: (typeof BRS)[number]; note: string }> = ({ b, note }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 22, background: C.card, border: `4px solid ${C.line}`, borderRadius: 26, padding: "26px 28px" }}>
    <LChip b={b.b} size={84} />
    <div>
      <div style={{ fontWeight: 800, fontSize: 44, color: C.forest, lineHeight: 1.05 }}>{b.name}</div>
      <div style={{ fontWeight: 700, fontSize: 31, color: C.matcha, lineHeight: 1.25, marginTop: 6 }}>{note}</div>
    </div>
  </div>
);
const PartTag: React.FC<{ p: number; text: string }> = ({ p, text }) => (
  <div style={{ display: "inline-block", fontWeight: 800, fontSize: 38, color: C.forest, background: PCOL[p], border: `4px solid ${C.forest}`, borderRadius: 18, padding: "4px 22px 8px" }}>{text}</div>
);
const ALL = { ST: 0, TA: 0, LT: 0, SS: 0, ACH: 0, PCH: 0 };

/* 1. Cover */
const S1: React.FC = () => (
  <Frame n={1}>
    <div style={{ position: "absolute", left: 60, top: 64, width: 960 }}>
      <Kicker>ANATOMY · AXILLA</Kicker>
      <H size={84}>Can you name the <span style={{ color: C.red }}>6 branches</span> of the axillary artery?</H>
    </div>
    <Plate src="plates/axillary.png" aspect={ASP} x={110} y={390} w={860} a={-1} b={99} zoomFrom={[1, 0.5, 0.5]} zoomTo={[1, 0.5, 0.5]} />
    <div style={{ position: "absolute", right: 70, top: 1150, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 34, padding: "10px 24px 14px", borderRadius: 18, boxShadow: "0 6px 0 rgba(31,42,20,0.15)" }}>swipe for the mnemonic →</div>
  </Frame>
);

/* 2. Mnemonic */
const S2: React.FC = () => (
  <Frame n={2} dark>
    <div style={{ position: "absolute", left: 70, top: 1040, width: 940, fontWeight: 700, fontSize: 32, color: C.matchaLight, lineHeight: 1.3 }}>6 letters = 6 branches, in order from the 1st rib to teres major.</div>
    <div style={{ position: "absolute", left: 70, top: 70 }}>
      <Kicker dark>THE MNEMONIC</Kicker>
    </div>
    <div style={{ position: "absolute", left: 70, top: 160, display: "flex", flexDirection: "column", gap: 26 }}>
      {BRS.map((r) => (
        <div key={r.b} style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 380, display: "flex", alignItems: "baseline" }}>
            <span style={{ fontWeight: 800, fontSize: 92, lineHeight: 1.05, color: C.forest, background: ({ ST: "#E58B7F", TA: "#E8A44E", LT: "#7FA0CC", SS: "#B59AD8", ACH: "#9BBE5A", PCH: "#63B5A3" } as Record<string, string>)[r.b], borderRadius: 16, padding: "0 12px 4px", marginRight: 4 }}>{r.word[0]}</span>
            <span style={{ fontWeight: 800, fontSize: 84, lineHeight: 1.05, color: C.paper }}>{r.word.slice(1).replace(/[,.]/g, "")}</span>
          </div>
          <div style={{ fontWeight: 800, fontSize: 36, color: C.banana, lineHeight: 1.1, width: 520 }}>{r.name.toLowerCase()}</div>
        </div>
      ))}
    </div>
  </Frame>
);

/* 3. Three parts */
const S3: React.FC = () => (
  <Frame n={3}>
    <div style={{ position: "absolute", left: 60, top: 60, width: 960 }}>
      <Kicker>THE 1-2-3 RULE</Kicker>
      <H size={64}>Pectoralis minor splits it into 3 parts</H>
    </div>
    <div style={{ position: "absolute", left: 40, top: 290, width: 640, height: 640 }}>
      <AxillaDiagram t={10} w={640} ghost={1} lit={{ ...ALL, PM: 0, P1: 0, P2: 0, P3: 0 }} parts={0.8} id="c3" />
    </div>
    <div style={{ position: "absolute", left: 700, top: 330, display: "flex", flexDirection: "column", gap: 26 }}>
      <PartTag p={1} text="part 1 → 1" />
      <div style={{ fontWeight: 700, fontSize: 26, color: C.forest, marginTop: -16, width: 330 }}>1st rib → pec minor</div>
      <PartTag p={2} text="part 2 → 2" />
      <div style={{ fontWeight: 700, fontSize: 26, color: C.forest, marginTop: -16, width: 330 }}>behind pec minor</div>
      <PartTag p={3} text="part 3 → 3" />
      <div style={{ fontWeight: 700, fontSize: 26, color: C.forest, marginTop: -16, width: 330 }}>pec minor → lower border of teres major</div>
    </div>
    <div style={{ position: "absolute", left: 60, top: 980, width: 960, fontWeight: 800, fontSize: 36, color: C.forest, lineHeight: 1.25 }}>
      At the lower border of teres major it becomes the <span style={{ background: C.banana, borderRadius: 10, padding: "0 10px" }}>brachial artery</span>.
    </div>
    <div style={{ position: "absolute", right: 40, bottom: 110, color: C.forest, opacity: 0.5, fontWeight: 700, fontSize: 18 }}>Diagram: Book Plume</div>
  </Frame>
);

/* 4. Parts 1 + 2 */
const S4: React.FC = () => (
  <Frame n={4}>
    <div style={{ position: "absolute", left: 60, top: 60, width: 960 }}>
      <Kicker>PARTS 1 + 2</Kicker>
      <H size={70}>The first 3 branches</H>
    </div>
    <div style={{ position: "absolute", left: 60, top: 270, width: 960, display: "flex", flexDirection: "column", gap: 30 }}>
      <PartTag p={1} text="part 1 · 1 branch" />
      <Row b={BRS[0]} note="small, to the 1st–2nd intercostal spaces (1918 atlas: “highest thoracic”)" />
      <PartTag p={2} text="part 2 · 2 branches" />
      <Row b={BRS[1]} note="short trunk, then pectoral, deltoid, acromial + clavicular branches" />
      <Row b={BRS[2]} note="runs down along the lateral border of pectoralis minor" />
    </div>
  </Frame>
);

/* 5. Part 3 */
const S5: React.FC = () => (
  <Frame n={5}>
    <div style={{ position: "absolute", left: 60, top: 60, width: 960 }}>
      <Kicker>PART 3</Kicker>
      <H size={70}>The last 3 branches</H>
    </div>
    <div style={{ position: "absolute", left: 60, top: 270, width: 960, display: "flex", flexDirection: "column", gap: 30 }}>
      <PartTag p={3} text="part 3 · 3 branches" />
      <Row b={BRS[3]} note="the biggest branch of the axillary artery" />
      <Row b={BRS[4]} note="the smaller of the two, around the front of the humerus" />
      <Row b={BRS[5]} note="the larger one, around the back of the humerus" />
      <div style={{ marginTop: 18, fontWeight: 800, fontSize: 36, color: C.forest, lineHeight: 1.25 }}>
        Quick test: where does it become the brachial artery? <span style={{ color: C.matcha }}>Lower border of teres major.</span>
      </div>
    </div>
  </Frame>
);

/* 6. Save */
const S6: React.FC = () => (
  <Frame n={6} dark>
    <div style={{ position: "absolute", left: 70, top: 90, width: 940 }}>
      <svg width={120} height={152} viewBox="0 0 220 280">
        <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.paper} strokeWidth={8} />
      </svg>
      <H size={110} color={C.paper}>Save this</H>
      <div style={{ fontWeight: 800, fontSize: 46, color: C.banana, marginTop: 10 }}>for your next anatomy exam</div>
    </div>
    <div style={{ position: "absolute", left: 70, top: 560, display: "flex", gap: 14 }}>
      {BRS.map((r) => <LChip key={r.b} b={r.b} size={118} />)}
    </div>
    <div style={{ position: "absolute", left: 70, top: 712, fontWeight: 800, fontSize: 44, color: C.paper }}>Screw The Lawyer, Save A Patient</div>
    <div style={{ position: "absolute", left: 70, top: 800, width: 940, fontWeight: 700, fontSize: 32, color: C.matchaLight, lineHeight: 1.3 }}>Follow Book Plume for anatomy you'll actually remember. Study cards: bookplume.com</div>
    <div style={{ position: "absolute", left: 70, top: 980, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 44, padding: "12px 30px 16px", borderRadius: 20 }}>bookplume.com</div>
  </Frame>
);

export const CarouselSlide: React.FC<{ n: number }> = ({ n }) => [<S1 key={1} />, <S2 key={2} />, <S3 key={3} />, <S4 key={4} />, <S5 key={5} />, <S6 key={6} />][Math.max(0, Math.min(5, n - 1))];
