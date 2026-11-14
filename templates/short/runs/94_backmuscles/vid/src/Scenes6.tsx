import React from "react";
import { OffthreadVideo, Sequence, staticFile } from "remotion";
import { C, Card, FONT, Mark, Pill, Scene, Stamp, Title, ramp, useT } from "./kit";
import { Appendix, BodyOrgans, Gallbladder, Intestines, Kidney, MiniLung, NotebookPage, RefFlag, SkinBlock, Spleen, Textbook, TissueChip, WeightFigure } from "./Illus6";

const abs = (x: number, y: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: x, top: y, ...extra });
const center = (cy: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  position: "absolute",
  left: 0,
  width: 860,
  top: cy,
  display: "flex",
  justifyContent: "center",
  ...extra,
});
const pop = (t: number, t0: number, d = 0.3) => {
  const p = ramp(t, t0, t0 + d);
  return { opacity: p, transform: `scale(${0.6 + 0.4 * p + 0.08 * Math.sin(Math.min(1, p) * Math.PI)})` } as React.CSSProperties;
};
const slide = (t: number, t0: number) => {
  const p = ramp(t, t0, t0 + 0.3);
  return { opacity: p, transform: `translateX(${(1 - p) * -40}px)` } as React.CSSProperties;
};

export const LIVE: [number, number][] = [
  [0, 2.3],
  [62.3, 77.9],
];
export const liveAlpha = (t: number) => LIVE.reduce((m, [a, b]) => Math.max(m, ramp(t, a, a + 0.3) * (1 - ramp(t, b - 0.05, b + 0.25))), 0);

const Footage: React.FC<{ a: number; b: number; from: number; rate?: number }> = ({ a, b, from, rate = 1 }) => {
  const t = useT();
  const s = 1.04 + 0.06 * ramp(t, a, b);
  const dx = Math.sin(t * 0.9) * 10;
  return (
    <Sequence from={Math.round(a * 30)} durationInFrames={Math.round((b - a) * 30) + 1} layout="none">
      <OffthreadVideo
        src={staticFile("cards.mp4")}
        muted
        trimBefore={Math.round(from * 30)}
        playbackRate={rate}
        style={{ position: "absolute", width: 1080, height: 1920, objectFit: "cover", transform: `translateX(${dx}px) scale(${s})` }}
      />
    </Sequence>
  );
};

const LiveWrap: React.FC<{ a: number; b: number; children: React.ReactNode }> = ({ a, b, children }) => {
  const t = useT();
  if (t < a - 0.05 || t > b + 0.3) return null;
  const al = (a === 0 ? 1 : ramp(t, a, a + 0.3)) * (1 - ramp(t, b - 0.05, b + 0.25));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: al, overflow: "hidden" }}>
      {children}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 760, background: "linear-gradient(to bottom, rgba(31,42,20,0), rgba(31,42,20,0.55))" }} />
    </div>
  );
};

/* 0. Hook — real box in hand */
export const LiveHook: React.FC = () => {
  const t = useT();
  return (
    <LiveWrap a={0} b={2.3}>
      <Footage a={0} b={2.6} from={0} />
      <div style={abs(0, 1040, { width: 1080, display: "flex", justifyContent: "center", ...pop(t, 0.0, 0.25) })}>
        <div style={{ background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 64, padding: "18px 40px", borderRadius: 30, border: `5px solid ${C.forest}`, boxShadow: `0 10px 0 ${C.forest}`, textAlign: "center", lineHeight: 1.05, transform: `rotate(${-2 + Math.sin(t * 3) * 0.8}deg)` }}>
          HOW MANY ORGANS
          <br />
          DO YOU HAVE?
        </div>
      </div>
    </LiveWrap>
  );
};

/* 1. Guesses */
const Counter: React.FC<{ t: number; t0: number; t1: number; to: number }> = ({ t, t0, t1, to }) => <>{Math.round(to * ramp(t, t0, t1))}</>;
export const V1: React.FC = () => {
  const t = useT();
  const big = { fontFamily: FONT, fontWeight: 800, fontSize: 200, color: C.forest, lineHeight: 1, textAlign: "center" as const };
  return (
    <Scene start={2.0} end={7.55}>
      <Card style={{ left: 20, top: 40, width: 390, height: 400, ...pop(t, 2.2) }}>
        <div style={abs(0, 40, { width: 390, textAlign: "center" })}>
          <Pill size={30}>most people</Pill>
        </div>
        <div style={abs(0, 140, { width: 390, ...big })}>5</div>
      </Card>
      <Card style={{ left: 450, top: 40, width: 390, height: 400, ...pop(t, 3.45) }}>
        <div style={abs(0, 40, { width: 390, textAlign: "center" })}>
          <Pill size={30} bg={C.matcha}>
            the internet
          </Pill>
        </div>
        <div style={abs(0, 140, { width: 390, ...big })}>
          <Counter t={t} t0={3.6} t1={4.5} to={78} />
        </div>
      </Card>
      <div style={center(500, pop(t, 5.25))}>
        <div style={{ width: 230, height: 230, borderRadius: 115, background: C.forest, color: C.banana, fontFamily: FONT, fontWeight: 800, fontSize: 170, display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${Math.sin(t * 4) * 6}deg)` }}>
          ?
        </div>
      </div>
      <Stamp t0={6.2} text="NOBODY AGREES" size={70} rot={-7} style={{ left: 120, top: 790 }} />
    </Scene>
  );
};

/* 2. The vital five */
const VITAL = [
  { n: "Brain", t: 9.14 },
  { n: "Heart", t: 9.46 },
  { n: "Lungs", t: 9.9 },
  { n: "Liver", t: 10.39 },
  { n: "Kidneys", t: 10.65 },
];
export const V2: React.FC = () => {
  const t = useT();
  const p = VITAL.map((v) => ramp(t, v.t - 0.1, v.t + 0.3));
  const glow = VITAL.map((v, i) => ramp(t, v.t - 0.1, v.t + 0.2) * (1 - ramp(t, (VITAL[i + 1]?.t ?? 11.4) - 0.05, (VITAL[i + 1]?.t ?? 11.4) + 0.3)));
  return (
    <Scene start={7.55} end={15.3}>
      <div style={abs(0, 10, { opacity: ramp(t, 7.6, 8.0) })}>
        <BodyOrgans w={430} p={p.map((x) => x || 0.0001)} glow={glow} t={t} />
      </div>
      <div style={abs(450, 20, { width: 410, ...slide(t, 7.7) })}>
        <Title size={56} style={{ textAlign: "left" }}>
          The <Mark p={ramp(t, 8.0, 8.5)}>vital</Mark> five
        </Title>
      </div>
      <div style={abs(460, 180, { display: "flex", flexDirection: "column", gap: 18 })}>
        {VITAL.map((v, i) => (
          <div key={v.n} style={slide(t, v.t - 0.1)}>
            <Pill size={40} bg={i % 2 ? C.matcha : C.forest}>
              <span style={{ color: C.banana, marginRight: 12 }}>{i + 1}</span>
              {v.n}
            </Pill>
          </div>
        ))}
      </div>
      <Card style={{ left: 440, top: 640, width: 410, height: 250, ...pop(t, 11.5) }}>
        <div style={abs(30, 34, { width: 350, fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest, lineHeight: 1.1 })}>can't survive without them</div>
        <div style={abs(30, 150, { width: 350, ...slide(t, 13.2) })}>
          <Pill size={26} bg={C.red}>
            without serious medical help
          </Pill>
        </div>
      </Card>
    </Scene>
  );
};

/* 3. Skin */
export const V3: React.FC = () => {
  const t = useT();
  const sw = ramp(t, 18.95, 19.35);
  return (
    <Scene start={15.3} end={21.45}>
      <div style={center(0, { opacity: ramp(t, 15.35, 15.7) })}>
        <Title size={60}>The one people forget</Title>
      </div>
      <div style={abs(50, 140, { opacity: ramp(t, 16.7, 17.0) * (1 - sw), transform: `scale(${1 - 0.1 * sw})` })}>
        <SkinBlock w={760} p={ramp(t, 16.8, 17.8)} t={t} />
      </div>
      <div style={center(740, { opacity: ramp(t, 17.85, 18.2) * (1 - sw) })}>
        <Title size={64}>
          your <Mark p={ramp(t, 18.0, 18.6)}>largest organ</Mark>
        </Title>
      </div>
      <div style={abs(60, 130, { opacity: sw })}>
        <WeightFigure h={700} fill={0.15 * ramp(t, 19.4, 20.8)} />
      </div>
      <div style={abs(470, 260, { opacity: sw })}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 170, color: C.forest, lineHeight: 1 }}>
          ~{Math.round(15 * ramp(t, 19.4, 20.8))}%
        </div>
        <div style={{ marginTop: 20, ...slide(t, 20.2) }}>
          <Pill size={36}>of body weight</Pill>
        </div>
        <div style={{ marginTop: 18, ...slide(t, 20.5) }}>
          <Pill size={36} bg={C.matcha}>
            is skin
          </Pill>
        </div>
      </div>
    </Scene>
  );
};

/* 4. What counts? + no referee + quote */
export const V4: React.FC = () => {
  const t = useT();
  const a = 1 - ramp(t, 26.1, 26.4);
  const b = ramp(t, 26.2, 26.5) * (1 - ramp(t, 27.9, 28.2));
  const c = ramp(t, 28.0, 28.3);
  const plus = { fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.matcha };
  return (
    <Scene start={21.45} end={32.25}>
      <div style={{ opacity: a }}>
        <div style={center(0, { opacity: ramp(t, 21.5, 21.85) })}>
          <Title size={60}>
            What counts as an <Mark p={ramp(t, 22.4, 22.9)}>organ</Mark>?
          </Title>
        </div>
        <div style={abs(40, 200, { display: "flex", alignItems: "center", gap: 24 })}>
          <div style={pop(t, 23.13)}>
            <TissueChip kind="muscle" size={210} />
          </div>
          <div style={{ ...plus, opacity: ramp(t, 23.4, 23.6) }}>+</div>
          <div style={pop(t, 23.65)}>
            <TissueChip kind="epi" size={210} />
          </div>
          <div style={{ ...plus, opacity: ramp(t, 24.0, 24.2) }}>+</div>
          <div style={pop(t, 24.0)}>
            <TissueChip kind="conn" size={150} />
          </div>
        </div>
        <div style={center(450, pop(t, 23.7))}>
          <Pill size={36}>2+ kinds of tissue</Pill>
        </div>
        <div style={center(560, pop(t, 24.85))}>
          <Pill size={44} bg={C.matcha}>
            + a job of its own
          </Pill>
        </div>
        <div style={center(700, pop(t, 25.5))}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 90, color: C.forest }}>
            = <Mark p={ramp(t, 25.6, 26.0)}>ORGAN</Mark>
          </div>
        </div>
      </div>
      <div style={{ opacity: b }}>
        <div style={center(80)}>
          <RefFlag size={420} wave={Math.sin(t * 9)} />
        </div>
        <div style={center(560)}>
          <Title size={70}>
            no <Mark p={ramp(t, 26.7, 27.2)}>official</Mark> referee
          </Title>
        </div>
        <Stamp t0={27.3} text="NO RULEBOOK" size={64} rot={-8} style={{ left: 200, top: 720 }} />
      </div>
      <div style={{ opacity: c }}>
        <Card style={{ left: 30, top: 80, width: 800, height: 640, transform: `rotate(${-1 + Math.sin(t) * 0.5}deg)` }}>
          <div style={abs(40, 10, { fontFamily: "Georgia, serif", fontSize: 220, color: C.banana, lineHeight: 1 })}>“</div>
          <div style={abs(60, 170, { width: 680, fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.forest, lineHeight: 1.15 })}>
            Defining any part of the body as an organ is{" "}
            <span style={{ opacity: ramp(t, 29.9, 30.2) }}>
              <span style={{ background: `linear-gradient(${C.banana}, ${C.banana}) no-repeat 0 85% / ${ramp(t, 30.6, 31.5) * 100}% 40%`, WebkitBoxDecorationBreak: "clone" }}>pretty much in the mind of the definer.</span>
            </span>
          </div>
          <div style={abs(60, 540, { ...slide(t, 29.0) })}>
            <Pill size={26} bg={C.matcha}>
              Thomas Gest, anatomy professor · via Discover
            </Pill>
          </div>
        </Card>
      </div>
    </Scene>
  );
};

/* 5. 2017 mesentery + da Vinci */
export const V5: React.FC = () => {
  const t = useT();
  const x = ramp(t, 40.85, 41.25);
  return (
    <Scene start={32.25} end={45.1} push={0.06}>
      <div style={{ opacity: 1 - x }}>
        <div style={abs(30, 0, { display: "flex", gap: 16 })}>
          <div style={pop(t, 32.35)}>
            <Pill size={46}>2017</Pill>
          </div>
          <div style={pop(t, 34.05)}>
            <Pill size={46} bg={C.matcha}>
              Ireland
            </Pill>
          </div>
        </div>
        <div style={abs(40, 130, { opacity: ramp(t, 34.6, 35.0) })}>
          <Intestines w={780} mes={ramp(t, 35.3, 36.3)} one={ramp(t, 38.4, 38.8)} t={t} draw={ramp(t, 34.6, 35.6)} />
        </div>
        <div style={abs(400, 300, { opacity: ramp(t, 35.6, 35.9) * (1 - ramp(t, 38.2, 38.4)) })}>
          <Pill size={34} bg={C.forest}>
            the mesentery
          </Pill>
        </div>
        <Stamp t0={38.55} text="ONE ORGAN" size={72} rot={-8} style={{ left: 250, top: 300 }} />
        <div style={abs(40, 700, { display: "flex", alignItems: "center", gap: 20, ...slide(t, 39.4) })}>
          <Textbook size={200} check={ramp(t, 40.0, 40.4)} />
          <Pill size={40}>textbooks updated</Pill>
        </div>
      </div>
      <div style={{ opacity: x }}>
        <div style={abs(80, 20)}>
          <NotebookPage w={700} draw={ramp(t, 41.1, 44.0)} t={t} />
        </div>
        <div style={abs(40, 680, slide(t, 41.1))}>
          <Pill size={44}>Leonardo da Vinci</Pill>
        </div>
        <div style={abs(40, 790, slide(t, 43.6))}>
          <Pill size={40} bg={C.matcha}>
            drew it as one piece · centuries earlier
          </Pill>
        </div>
      </div>
    </Scene>
  );
};

/* 6. Twist: organs you can live without */
const SPARE = [
  { n: "appendix", t: 50.14, el: <Appendix size={170} /> },
  { n: "gallbladder", t: 51.08, el: <Gallbladder size={170} /> },
  { n: "spleen", t: 52.03, el: <Spleen size={170} /> },
  {
    n: "1 of 2 kidneys",
    t: 54.31,
    el: (
      <div style={{ display: "flex" }}>
        <Kidney size={110} />
        <Kidney size={110} ghost />
      </div>
    ),
  },
  {
    n: "1 of 2 lungs",
    t: 55.24,
    el: (
      <div style={{ display: "flex" }}>
        <MiniLung size={110} />
        <MiniLung size={110} ghost />
      </div>
    ),
  },
];
export const V6: React.FC = () => {
  const t = useT();
  const d = 1 - ramp(t, 47.4, 47.7);
  return (
    <Scene start={45.1} end={57.7}>
      <div style={{ opacity: d }}>
        <div style={{ position: "absolute", left: 0, top: 120, width: 860, height: 600, borderRadius: 40, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center", ...pop(t, 45.15, 0.35) }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 76, color: C.paper, textAlign: "center", lineHeight: 1.1, padding: 40 }}>
            But that's not even the{" "}
            <span style={{ color: C.banana, borderBottom: `6px solid ${C.banana}`, opacity: ramp(t, 45.9, 46.2) }}>strangest part…</span>
          </div>
        </div>
      </div>
      <div style={{ opacity: 1 - d }}>
        <div style={center(0, { opacity: ramp(t, 47.6, 47.95) })}>
          <Title size={58}>
            organs you can <Mark p={ramp(t, 48.8, 49.4)}>live without</Mark>
          </Title>
        </div>
        <div style={abs(0, 120, { width: 860, display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center" })}>
          {SPARE.map((s, i) => (
            <Card key={s.n} style={{ position: "relative", width: i < 3 ? 260 : 400, height: 300, ...pop(t, s.t - 0.1) }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: 30, display: "flex", justifyContent: "center", transform: `translateY(${Math.sin(t * 2 + i) * 5}px)` }}>{s.el}</div>
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 22, textAlign: "center" }}>
                <Pill size={26} bg={i % 2 ? C.matcha : C.forest}>
                  {s.n}
                </Pill>
              </div>
            </Card>
          ))}
        </div>
        <Stamp t0={56.8} text="BACKUP INCLUDED" size={64} rot={-6} style={{ left: 110, top: 790 }} />
      </div>
    </Scene>
  );
};

/* 7. 78? 79? → systems */
export const V7: React.FC = () => {
  const t = useT();
  const n = t < 59.0 ? 78 : 79;
  const flip = t < 59.0 ? ramp(t, 58.0, 58.25) : ramp(t, 59.0, 59.25);
  const sys = ramp(t, 61.6, 61.95);
  return (
    <Scene start={57.7} end={62.3}>
      <div style={{ opacity: 1 - sys }}>
        <div style={center(60)}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 300, color: C.forest, lineHeight: 1, transform: `rotateX(${(1 - flip) * 80}deg)`, opacity: flip }}>
            <Mark p={1}>{n}?</Mark>
          </div>
        </div>
        <div style={center(480, pop(t, 60.05))}>
          <Pill size={52}>depends who's counting</Pill>
        </div>
      </div>
      <div style={{ opacity: sys }}>
        <svg width={860} height={700} style={{ position: "absolute", top: 60 }}>
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2 + t * 0.4;
            const x = 430 + Math.cos(a) * 260;
            const y = 340 + Math.sin(a) * 240;
            return (
              <g key={i}>
                <line x1={430} y1={340} x2={x} y2={y} stroke={C.matcha} strokeWidth={6} />
                <circle cx={x} cy={y} r={42} fill={i % 2 ? C.banana : C.card} stroke={C.forest} strokeWidth={5} />
              </g>
            );
          })}
          <circle cx={430} cy={340} r={90} fill={C.forest} />
          <text x={430} y={354} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={38} fill={C.paper}>
            systems
          </text>
        </svg>
      </div>
    </Scene>
  );
};

/* 8. Product — real flash cards */
const CHIPS = [
  { t: 66.4, text: "QuickStudy Anatomy Flash Cards" },
  { t: 69.0, text: "300 cards" },
  { t: 70.25, text: "14 body systems" },
  { t: 71.75, text: "each system its own color" },
];
export const LiveProduct: React.FC = () => {
  const t = useT();
  const btn = ramp(t, 73.3, 73.6);
  const loopQ = ramp(t, 75.9, 76.2);
  return (
    <LiveWrap a={62.3} b={77.9}>
      <Footage a={62.3} b={65.9} from={3.0} />
      <Footage a={65.9} b={78.2} from={6.6} rate={0.7} />
      <div style={abs(70, 500, { ...slide(t, 62.5), opacity: ramp(t, 62.5, 62.8) * (1 - ramp(t, 65.7, 66.0)) })}>
        <Pill size={40}>
          organs <span style={{ color: C.banana }}>→</span> systems
        </Pill>
      </div>
      <div style={abs(70, 860, { width: 860, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 14, opacity: 1 - loopQ })}>
        {CHIPS.map((c, i) => (
          <div key={c.text} style={slide(t, c.t - 0.1)}>
            <Pill bg={i % 2 ? C.matcha : C.forest} size={i === 0 ? 38 : 36}>
              <span style={{ color: C.banana, marginRight: 10 }}>✓</span>
              {c.text}
            </Pill>
          </div>
        ))}
      </div>
      <div style={abs(0, 860, { width: 1080, display: "flex", justifyContent: "center", ...pop(t, 75.9) })}>
        <div style={{ background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 60, padding: "16px 38px", borderRadius: 30, border: `5px solid ${C.forest}`, boxShadow: `0 10px 0 ${C.forest}`, textAlign: "center", lineHeight: 1.05 }}>
          HOW MANY ORGANS
          <br />
          DO YOU HAVE?
        </div>
      </div>
      <div style={abs(0, 1250, { width: 1080, display: "flex", justifyContent: "center", opacity: btn, transform: `translateY(${(1 - btn) * 30}px) scale(${1 + 0.035 * Math.max(0, Math.sin((t - 73.6) * 5)) * (t > 73.6 ? 1 : 0)})` })}>
        <div style={{ background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 46, padding: "20px 56px", borderRadius: 60, border: `5px solid ${C.forest}`, boxShadow: `0 10px 0 ${C.forest}`, letterSpacing: 2 }}>
          TAP THE CART BELOW ↓
        </div>
      </div>
    </LiveWrap>
  );
};
