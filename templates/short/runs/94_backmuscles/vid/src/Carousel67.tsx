import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT } from "./kit";
import { Mark } from "./Chrome";
import { SubDiagram, PCOL, ANCHOR } from "./Sub67";
import { A513, BRS, Bk, LBL, LChip, PlateBox } from "./Scenes67";

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
const Row: React.FC<{ b: Bk; title: string; note: string }> = ({ b, title, note }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 22, background: C.card, border: `4px solid ${C.line}`, borderRadius: 26, padding: "24px 28px" }}>
    <LChip b={b} size={84} />
    <div>
      <div style={{ fontWeight: 800, fontSize: 44, color: C.forest, lineHeight: 1.05 }}>{title}</div>
      <div style={{ fontWeight: 700, fontSize: 30, color: C.matcha, lineHeight: 1.25, marginTop: 6 }}>{note}</div>
    </div>
  </div>
);
const PartTag: React.FC<{ p: number; text: string }> = ({ p, text }) => (
  <div style={{ display: "inline-block", fontWeight: 800, fontSize: 36, color: C.forest, background: PCOL[p], border: `4px solid ${C.forest}`, borderRadius: 18, padding: "4px 22px 8px" }}>{text}</div>
);
const ALL = { V: 0, I: 0, T: 0, C: 0, D: 0 };

/* 1. Cover */
const S1: React.FC = () => (
  <Frame n={1}>
    <div style={{ position: "absolute", left: 60, top: 64, width: 960 }}>
      <Kicker>ANATOMY · ROOT OF THE NECK</Kicker>
      <H size={84}>Can you name the <span style={{ color: C.red }}>5 branches</span> of the subclavian artery?</H>
    </div>
    <PlateBox src="plates/sub513.png" aspect={A513} x={60} y={430} w={960} h={700} a={0} b={1} from={[0.44, 0.74, 0.62]} to={[0.44, 0.74, 0.62]} still
      labels={[{ x: 0.415, y: 0.877, text: "subclavian artery", t: 0, hot: true, ox: 120, oy: -40 }]} />
    <div style={{ position: "absolute", right: 60, top: 1160, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 38, padding: "10px 26px 14px", borderRadius: 20 }}>1 mnemonic → swipe</div>
  </Frame>
);

/* 2. The mnemonic */
const S2: React.FC = () => (
  <Frame n={2} dark>
    <div style={{ position: "absolute", left: 60, top: 70, width: 960 }}>
      <Kicker dark>THE MNEMONIC</Kicker>
      <div style={{ marginTop: 30, display: "flex", alignItems: "baseline", gap: 6 }}>
        {(["V", "I", "T"] as Bk[]).map((c) => <span key={c} style={{ fontWeight: 800, fontSize: 116, lineHeight: 1, color: C.forest, background: ({ V: "#7FA0CC", I: "#E58B7F", T: "#E8A44E" } as Record<string, string>)[c], borderRadius: 22, padding: "0 12px 10px" }}>{c}</span>)}
        <span style={{ fontWeight: 800, fontSize: 100, color: C.paper }}>amin</span>
        <span style={{ fontWeight: 800, fontSize: 116, color: C.forest, background: "#B59AD8", borderRadius: 22, padding: "0 20px 8px", marginLeft: 20 }}>C</span>
        <span style={{ fontWeight: 800, fontSize: 70, color: C.paper, margin: "0 10px" }}>&amp;</span>
        <span style={{ fontWeight: 800, fontSize: 116, color: C.forest, background: "#63B5A3", borderRadius: 22, padding: "0 20px 8px" }}>D</span>
      </div>
      <div style={{ marginTop: 50, display: "flex", flexDirection: "column", gap: 22 }}>
        {BRS.map((r) => (
          <div key={r.b} style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <LChip b={r.b} size={78} />
            <div style={{ fontWeight: 800, fontSize: 52, color: C.paper }}>{r.name}</div>
          </div>
        ))}
      </div>
    </div>
  </Frame>
);

/* 3. Map: our diagram with all 5 labelled */
const S3: React.FC = () => {
  const s = 1.0, X0 = 110, Y0 = 250, D0 = -40;
  return (
    <Frame n={3}>
      <div style={{ position: "absolute", left: 60, top: 64, width: 960 }}>
        <Kicker>THE MAP · RIGHT SIDE, FRONT VIEW</Kicker>
        <H size={64}>One artery, 5 branches</H>
      </div>
      <div style={{ position: "absolute", left: X0, top: Y0, width: 860, height: 960, overflow: "hidden", borderRadius: 40, boxShadow: `0 0 0 4px ${C.line}`, background: C.paper }}>
        <div style={{ position: "absolute", left: D0, top: 20 }}><SubDiagram t={20} w={860 * s} ghost={1} lit={{ ...ALL, AS: 0 }} id="c3" /></div>
        {(["V", "I", "T", "C", "D"] as Bk[]).map((b) => {
          const a = ANCHOR[b], L = LBL[b];
          const x0 = D0 + a[0] * s, y0 = 20 + a[1] * s, x1 = D0 + L.to[0] * s, y1 = 20 + L.to[1] * s;
          return (
            <React.Fragment key={b}>
              <svg width={860} height={900} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
                <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={C.paper} strokeWidth={10} strokeLinecap="round" />
                <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={C.forest} strokeWidth={5} strokeLinecap="round" />
              </svg>
              <div style={{ position: "absolute", left: x1, top: y1, transform: `translate(${L.side === "l" ? "-100%" : "0"}, -50%)`, display: "flex", alignItems: "center", gap: 10, background: C.forest, color: C.paper, borderRadius: 16, padding: "6px 16px 9px 8px", fontWeight: 800, fontSize: 32, whiteSpace: "nowrap" }}>
                <LChip b={b} size={42} />
                {L.text}
              </div>
            </React.Fragment>
          );
        })}
        <div style={{ position: "absolute", left: 470, top: 70, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 26, padding: "4px 12px 6px", borderRadius: 10, whiteSpace: "nowrap" }}>anterior scalene</div>
        <div style={{ position: "absolute", left: 24, top: 600, color: C.forest, fontWeight: 800, fontSize: 24, background: "rgba(247,246,236,0.9)", borderRadius: 8, padding: "2px 8px" }}>← becomes axillary at the 1st rib</div>
      </div>
    </Frame>
  );
};

/* 4. Part 1 */
const S4: React.FC = () => (
  <Frame n={4}>
    <div style={{ position: "absolute", left: 60, top: 64, width: 960 }}>
      <PartTag p={1} text="PART 1 · before anterior scalene" />
      <H size={66}>3 branches: V, I, T</H>
      <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 22 }}>
        <Row b="V" title="Vertebral artery" note="climbs through the transverse foramina (C6 → C1) to the brain" />
        <Row b="I" title="Internal thoracic artery" note="runs down behind the front chest wall · 1918 name: internal mammary" />
        <Row b="T" title="Thyrocervical trunk" note="inferior thyroid · transverse cervical · suprascapular · 1918: thyroid axis" />
      </div>
    </div>
  </Frame>
);

/* 5. Parts 2 and 3 */
const S5: React.FC = () => (
  <Frame n={5}>
    <div style={{ position: "absolute", left: 60, top: 64, width: 960 }}>
      <PartTag p={2} text="PART 2 · behind anterior scalene" />
      <div style={{ marginTop: 22 }}>
        <Row b="C" title="Costocervical trunk" note="deep cervical + supreme (highest) intercostal" />
      </div>
      <div style={{ marginTop: 44 }}>
        <PartTag p={3} text="PART 3 · after anterior scalene" />
      </div>
      <div style={{ marginTop: 22 }}>
        <Row b="D" title="Dorsal scapular artery" note="usually here; sometimes from the transverse cervical" />
      </div>
      <div style={{ marginTop: 44, background: C.forest, color: C.paper, borderRadius: 26, padding: "26px 30px", fontWeight: 800, fontSize: 40, lineHeight: 1.25 }}>
        Count: <span style={{ color: C.banana }}>3 · 1 · 1</span>
        <br />
        <span style={{ fontSize: 32, color: C.matchaLight }}>At the lateral border of the 1st rib it becomes the axillary artery.</span>
      </div>
    </div>
  </Frame>
);

/* 6. Save */
const S6: React.FC = () => (
  <Frame n={6} dark>
    <div style={{ position: "absolute", left: 60, top: 90, width: 960 }}>
      <Kicker dark>QUICK TEST</Kicker>
      <H size={60} color={C.paper}>Which branch climbs through your neck vertebrae to the brain?</H>
      <div style={{ marginTop: 26, display: "inline-block", background: C.matcha, color: C.paper, fontWeight: 800, fontSize: 46, padding: "10px 26px 14px", borderRadius: 20 }}>✓ the vertebral artery</div>
      <div style={{ marginTop: 90, display: "flex", alignItems: "center", gap: 30 }}>
        <svg width={120} height={152} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.paper} strokeWidth={8} />
        </svg>
        <div>
          <div style={{ fontWeight: 800, fontSize: 100, color: C.paper, lineHeight: 1 }}>SAVE THIS</div>
          <div style={{ fontWeight: 800, fontSize: 40, color: C.banana, marginTop: 10 }}>for your next anatomy exam</div>
        </div>
      </div>
      <div style={{ marginTop: 70, fontWeight: 800, fontSize: 40, color: C.paper, lineHeight: 1.3 }}>
        Study the whole body with our anatomy flash cards
        <br />
        <span style={{ display: "inline-block", marginTop: 16, background: C.banana, color: C.forest, padding: "8px 24px 12px", borderRadius: 18 }}>bookplume.com</span>
      </div>
    </div>
  </Frame>
);

export const CarouselSlide: React.FC<{ n: number }> = ({ n }) => {
  const S = [S1, S2, S3, S4, S5, S6][n - 1];
  return <S />;
};
