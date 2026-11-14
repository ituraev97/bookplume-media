import React from "react";
import { Img, staticFile } from "remotion";
import { C, Callout, Card, FONT, Mark, Pill, Scene, Stamp, Title, ramp, useT } from "./kit";
import {
  Beyond,
  Brick,
  Chart,
  Clipboard,
  DictBook,
  Dust,
  Heart,
  Liver,
  Lungs,
  Microscope,
  Monitor,
  Newspaper,
  Puzzle,
  Sand,
  Stethoscope,
  Stomach,
  Vessel,
  Volcano,
} from "./Illus";

const abs = (x: number, y: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  position: "absolute",
  left: x,
  top: y,
  ...extra,
});
const center = (cy: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  position: "absolute",
  left: 0,
  width: 860,
  top: cy,
  display: "flex",
  justifyContent: "center",
  ...extra,
});

const PARTS = [
  { k: "pneumono", t: 5.43 },
  { k: "ultra", t: 6.13 },
  { k: "microscopic", t: 6.46 },
  { k: "silico", t: 7.31 },
  { k: "volcano", t: 7.87 },
  { k: "coniosis", t: 8.48 },
];

/* ---------- 1. Monster word ---------- */
export const S1: React.FC = () => {
  const t = useT();
  const count = Math.round(ramp(t, 3.4, 4.7, 0, 45));
  const lines = [
    [0, 1],
    [2, 3],
    [4, 5],
  ];
  const rulerP = ramp(t, 5.4, 9.0);
  return (
    <Scene start={0} end={9.7}>
      <Card style={{ left: 30, top: 20, width: 800, height: 230 }}>
        <div style={abs(40, 34, { fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.matcha, letterSpacing: 4 })}>THE LONGEST WORD IN</div>
        <div style={abs(40, 72, { fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.forest })}>a major dictionary</div>
        <div
          style={abs(560, 30, {
            width: 200,
            height: 170,
            borderRadius: 28,
            background: C.forest,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${1 + 0.12 * Math.max(0, 1 - Math.abs(t - 4.7) * 4)})`,
          })}
        >
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 96, color: C.banana, lineHeight: 1 }}>{count}</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.paper, letterSpacing: 3 }}>LETTERS</div>
        </div>
        <div style={abs(40, 150, { fontFamily: FONT, fontWeight: 600, fontSize: 28, color: C.forest, opacity: 0.6 })}>noun · /ˌnjuː.mə.noʊ…/</div>
      </Card>
      <Card style={{ left: 30, top: 285, width: 800, height: 520 }}>
        <div style={abs(0, 36, { width: 800, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 })}>
          {lines.map((ln, li) => (
            <div key={li} style={{ display: "flex" }}>
              {ln.map((pi) => {
                const p = PARTS[pi];
                const a = ramp(t, p.t - 0.05, p.t + 0.25);
                const active = t >= p.t && (pi === 5 || t < PARTS[pi + 1].t);
                return (
                  <span
                    key={pi}
                    style={{
                      fontFamily: FONT,
                      fontWeight: 800,
                      fontSize: 84,
                      letterSpacing: -2,
                      color: pi % 2 ? C.matcha : C.forest,
                      opacity: 0.12 + 0.88 * a,
                      transform: `translateY(${(1 - a) * 20}px) scale(${active ? 1.06 : 1})`,
                      display: "inline-block",
                    }}
                  >
                    {p.k}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
        {/* ruler */}
        <svg style={abs(40, 420)} width={720} height={60}>
          <rect x={0} y={10} width={720} height={40} rx={8} fill={C.banana} stroke={C.forest} strokeWidth={3} />
          {Array.from({ length: 46 }, (_, i) => (
            <line key={i} x1={8 + i * 15.6} x2={8 + i * 15.6} y1={10} y2={i % 5 === 0 ? 34 : 24} stroke={C.forest} strokeWidth={i % 5 === 0 ? 3 : 2} />
          ))}
          <rect x={0} y={10} width={720 * rulerP} height={40} rx={8} fill={C.matcha} opacity={0.35} />
        </svg>
      </Card>
      <div style={center(845)}>
        <Pill bg={C.forest} size={36} style={{ opacity: ramp(t, 8.6, 9.0) }}>
          say it 5× fast
        </Pill>
      </div>
    </Scene>
  );
};

/* ---------- 2. Built like LEGO ---------- */
export const S2: React.FC = () => {
  const t = useT();
  const strike = ramp(t, 13.5, 14.0);
  const b = (t0: number) => ramp(t, t0, t0 + 0.35);
  return (
    <Scene start={9.7} end={16.55}>
      <div style={center(10)}>
        <Title size={92} style={{ opacity: ramp(t, 9.7, 10.1) }}>
          Impossible?
        </Title>
      </div>
      <Card style={{ left: 130, top: 150, width: 600, height: 170, display: "flex", alignItems: "center", justifyContent: "center", opacity: ramp(t, 12.5, 12.9) }}>
        <div style={{ position: "relative", fontFamily: FONT, fontWeight: 800, fontSize: 76, color: C.forest, opacity: 1 - 0.5 * strike }}>
          memorize
          <div style={{ position: "absolute", left: -10, top: "52%", height: 12, width: `${strike * 110}%`, background: C.red, borderRadius: 6 }} />
        </div>
      </Card>
      <div style={center(370)}>
        <Title size={72} style={{ opacity: ramp(t, 14.6, 14.9) }}>
          <Mark p={ramp(t, 14.8, 15.2)}>build</Mark> them
        </Title>
      </div>
      <div style={abs(130, 760 - 120 * 2 - (1 - b(14.75)) * 260, { opacity: b(14.75) })}>
        <Brick w={600} color={C.banana} dark={C.bananaDark} label="PREFIX" />
      </div>
      <div style={abs(130, 760 - 120 - (1 - b(15.1)) * 260, { opacity: b(15.1) })}>
        <Brick w={600} color={C.matchaLight} dark={C.matcha} label="ROOT" />
      </div>
      <div style={abs(130, 760 - (1 - b(15.5)) * 260, { opacity: b(15.5) })}>
        <Brick w={600} color={C.matcha} dark={C.matchaDark} label="SUFFIX" textColor={C.paper} />
      </div>
    </Scene>
  );
};

/* ---------- 3. Break it apart ---------- */
const BREAK = [
  { k: "pneumono", m: "lung", t: 17.92, mt: 18.83 },
  { k: "ultra", m: "beyond", t: 19.95, mt: 20.68 },
  { k: "microscopic", m: "too small to see", t: 21.66, mt: 22.8 },
  { k: "silico", m: "silica · sand", t: 24.23, mt: 25.13 },
  { k: "volcano", m: "volcano", t: 27.44, mt: 28.4 },
  { k: "conio", m: "dust (Greek)", t: 29.96, mt: 30.73 },
  { k: "osis", m: "condition / disease", t: 32.8, mt: 33.57 },
];

export const S3: React.FC = () => {
  const t = useT();
  let ai = -1;
  BREAK.forEach((b, i) => {
    if (t >= b.t - 0.1) ai = i;
  });
  const spread = ramp(t, 16.7, 17.4);
  const rows = [
    [0, 1, 2],
    [3, 4, 5, 6],
  ];
  const cur = ai >= 0 ? BREAK[ai] : null;
  const ill = (i: number) => {
    const local = t - BREAK[i].t;
    switch (i) {
      case 0:
        return <Lungs size={530} breathe={Math.sin(t * 3)} />;
      case 1:
        return <Beyond size={520} p={ramp(t, BREAK[1].t, BREAK[1].t + 1.0)} />;
      case 2:
        return <Microscope size={520} zoom={ramp(t, BREAK[2].t + 0.8, BREAK[2].t + 1.4)} />;
      case 3:
        return <Sand size={520} p={ramp(t, BREAK[3].t + 0.2, BREAK[3].t + 0.8)} />;
      case 4:
        return <Volcano size={540} t={local} erupt={ramp(t, BREAK[4].t, BREAK[4].t + 0.6)} />;
      case 5:
        return <Dust size={540} t={local} />;
      default:
        return <Chart size={500} />;
    }
  };
  return (
    <Scene start={16.55} end={35.7} push={0.02}>
      {/* chips */}
      {rows.map((row, ri) => (
        <div key={ri} style={center(ri * 92 + 4, { gap: 12 * (0.2 + 0.8 * spread) })}>
          {row.map((i) => {
            const b = BREAK[i];
            const done = ai > i;
            const active = ai === i;
            return (
              <div
                key={i}
                style={{
                  fontFamily: FONT,
                  fontWeight: 800,
                  fontSize: 40,
                  padding: "10px 22px 14px",
                  borderRadius: 18,
                  background: active ? C.banana : done ? C.matcha : C.card,
                  color: active ? C.forest : done ? C.paper : C.forest,
                  border: `3px solid ${active ? C.forest : done ? C.matchaDark : C.line}`,
                  boxShadow: `0 6px 0 ${active ? C.bananaDark : done ? C.matchaDark : C.line}`,
                  transform: `translateY(${active ? -6 : 0}px) scale(${active ? 1.06 : 1})`,
                }}
              >
                {b.k}
              </div>
            );
          })}
        </div>
      ))}
      <Card style={{ left: 30, top: 205, width: 800, height: 720, overflow: "hidden" }}>
        {ai < 0 && (
          <div style={abs(0, 300, { width: 800, opacity: ramp(t, 16.6, 17.0) })}>
            <Title size={70}>Let's break it apart.</Title>
          </div>
        )}
        {BREAK.map((b, i) => {
          if (i !== ai) return null;
          const p = ramp(t, b.t - 0.1, b.t + 0.35);
          const mp = ramp(t, b.mt - 0.1, b.mt + 0.3);
          return (
            <div key={i} style={{ position: "absolute", inset: 0, opacity: p }}>
              <div style={abs(0, 30, { width: 800, display: "flex", justifyContent: "center", alignItems: "center", gap: 20 })}>
                <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: b.k.length + b.m.length > 18 ? 50 : 64, color: C.forest }}>{b.k}</span>
                <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.matcha, opacity: mp }}>=</span>
                <span style={{ opacity: mp, transform: `scale(${0.8 + 0.2 * mp})`, display: "inline-block" }}>
                  <Pill bg={C.forest} size={b.k.length + b.m.length > 18 ? 34 : 44}>
                    {b.m}
                  </Pill>
                </span>
              </div>
              <div
                style={abs(0, 150, {
                  width: 800,
                  height: 540,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  transform: `scale(${0.85 + 0.15 * p + 0.04 * ramp(t, b.t, b.t + 2.5)})`,
                })}
              >
                {ill(i)}
              </div>
            </div>
          );
        })}
      </Card>
      {cur && <div />}
    </Scene>
  );
};

/* ---------- 4. Put it together ---------- */
export const S4: React.FC = () => {
  const t = useT();
  return (
    <Scene start={35.7} end={39.85}>
      <div style={center(10)}>
        <Title size={60} style={{ opacity: ramp(t, 35.75, 36.1) }}>
          Put it together:
        </Title>
      </div>
      <div style={center(110, { opacity: ramp(t, 36.7, 37.1) })}>
        <Title size={58} style={{ width: 760 }}>
          a <Mark p={ramp(t, 36.8, 37.3)}>lung disease</Mark> from tiny <Mark p={ramp(t, 38.4, 38.9)}>volcanic dust</Mark>
        </Title>
      </div>
      <div style={center(330)}>
        <Lungs size={580} breathe={Math.sin(t * 2.2)} dust={ramp(t, 37.6, 38.3)} t={t} />
      </div>
    </Scene>
  );
};

/* ---------- 5. Twist ---------- */
export const S5: React.FC = () => {
  const t = useT();
  const shake = t > 42.65 && t < 43.0 ? Math.sin(t * 90) * 8 : 0;
  return (
    <Scene start={39.85} end={45.2}>
      <div style={center(20)}>
        <Title size={62} style={{ opacity: ramp(t, 39.9, 40.3) }}>
          But that's not even
          <br />
          the <Mark p={ramp(t, 40.7, 41.2)}>strangest</Mark> part…
        </Title>
      </div>
      <Card style={{ left: 60, top: 260, width: 740, height: 430, transform: `translateX(${shake}px) rotate(${-2 * ramp(t, 42.65, 42.9)}deg)` }}>
        <div style={abs(0, 90, { width: 740, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 54, color: C.forest, lineHeight: 1.15 }) as React.CSSProperties}>
          pneumonoultra-
          <br />
          microscopicsilico-
          <br />
          volcanoconiosis
        </div>
        <div style={abs(0, 34, { width: 740, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 30, color: C.matcha, opacity: ramp(t, 42.65, 43.0) })}>this word was invented…</div>
        <Stamp t0={44.15} text="AS A JOKE" size={86} rot={-8} style={{ left: 170, top: 285 }} />
      </Card>
      <div style={center(740, { opacity: ramp(t, 42.65, 43.0) })}>
        <Pill bg={C.forest} size={40}>
          not by doctors
        </Pill>
      </div>
    </Scene>
  );
};

/* ---------- 6a. 1935 newspaper ---------- */
export const S6a: React.FC = () => {
  const t = useT();
  const np = ramp(t, 45.2, 45.8);
  return (
    <Scene start={45.2} end={51.55}>
      <div style={center(0)}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 130, color: C.forest, letterSpacing: -4, opacity: ramp(t, 45.3, 45.7) }}>
          19<span style={{ color: C.matcha }}>35</span>
        </div>
      </div>
      <div style={center(180, { transform: `rotate(${-3 + 3 * np}deg) translateY(${(1 - np) * 60}px)`, opacity: np })}>
        <Newspaper w={800} />
      </div>
      <div style={abs(30, 780, { display: "flex", alignItems: "center", gap: 18, opacity: ramp(t, 47.2, 47.6) })}>
        <Puzzle size={120} />
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest, lineHeight: 1.1 }}>
          National Puzzlers' League
          <div style={{ fontSize: 28, color: C.matcha, fontWeight: 700 }}>its president made it up</div>
        </div>
      </div>
    </Scene>
  );
};

/* ---------- 6b. It worked ---------- */
export const S6b: React.FC = () => {
  const t = useT();
  return (
    <Scene start={51.55} end={53.85}>
      <div style={center(20)}>
        <Title size={76} style={{ opacity: ramp(t, 51.6, 51.9) }}>
          And it <Mark p={ramp(t, 51.8, 52.2)}>worked.</Mark>
        </Title>
      </div>
      <div style={center(220)}>
        <DictBook size={720} />
      </div>
      <Stamp t0={52.5} text="IN THE DICTIONARY" size={58} color={C.matcha} rot={-8} style={{ left: 110, top: 470 }} />
    </Scene>
  );
};

/* ---------- 6c. Real doctors ---------- */
export const S6c: React.FC = () => {
  const t = useT();
  const bar1 = ramp(t, 54.0, 54.6);
  const bar2 = ramp(t, 55.5, 55.9);
  return (
    <Scene start={53.85} end={56.6}>
      <div style={center(10)}>
        <Title size={70} style={{ opacity: ramp(t, 53.9, 54.2) }}>
          Real doctors?
        </Title>
      </div>
      <div style={abs(10, 130)}>
        <Clipboard size={360} />
      </div>
      <div style={abs(50, 380, { width: 280, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.red, opacity: bar2 })}>silicosis</div>
      <div style={abs(410, 170, { width: 420 })}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.forest }}>the joke word</div>
        <div style={{ height: 56, marginTop: 10, width: 410 * bar1, background: C.forest, borderRadius: 14, color: C.banana, fontFamily: FONT, fontWeight: 800, fontSize: 34, display: "flex", alignItems: "center", paddingLeft: 18, boxSizing: "border-box", overflow: "hidden" }}>
          45 letters
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.forest, marginTop: 40, opacity: bar2 }}>what doctors say</div>
        <div style={{ height: 56, marginTop: 10, width: Math.max(4, 410 * (9 / 45) * bar2), background: C.matcha, borderRadius: 14, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 34, display: "flex", alignItems: "center", paddingLeft: 18, boxSizing: "border-box", whiteSpace: "nowrap" }}>
          9
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, color: C.matcha, marginTop: 8, opacity: bar2 }}>letters</div>
      </div>
      <div style={center(640, { opacity: ramp(t, 55.8, 56.1) })}>
        <Title size={54}>
          <Mark p={ramp(t, 55.9, 56.3)}>silic</Mark> + <Mark p={ramp(t, 56.0, 56.4)}>osis</Mark>
        </Title>
      </div>
      <div style={center(730, { opacity: ramp(t, 55.9, 56.2) })}>
        <Pill size={34}>silica + disease</Pill>
      </div>
    </Scene>
  );
};

/* ---------- 7. The trick is real ---------- */
export const S7: React.FC = () => {
  const t = useT();
  const fit = ramp(t, 59.8, 60.6);
  return (
    <Scene start={56.6} end={62.85}>
      <div style={center(10)}>
        <Title size={66} style={{ opacity: ramp(t, 56.7, 57.1) }}>
          But the trick is <Mark p={ramp(t, 58.5, 59.0)}>real.</Mark>
        </Title>
      </div>
      <div style={abs(130 - 60 * (1 - fit), 200)}>
        <Puzzle size={300} color={C.banana} />
      </div>
      <div style={abs(430 + 60 * (1 - fit), 200, { transform: "scaleX(-1)" })}>
        <Puzzle size={300} color={C.matchaLight} />
      </div>
      <div style={abs(0, 300, { width: 860, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest, opacity: fit })} />
      <div style={center(560, { opacity: ramp(t, 59.2, 59.6) })}>
        <Title size={54}>Know the pieces →</Title>
      </div>
      <div style={center(650, { opacity: ramp(t, 60.3, 60.7) })}>
        <Title size={54}>
          read <Mark p={ramp(t, 61.1, 61.6)}>new words</Mark>
        </Title>
      </div>
      <div style={center(780, { opacity: ramp(t, 61.5, 61.9) })}>
        <Pill bg={C.forest} size={36}>
          PREFIX + ROOT + SUFFIX
        </Pill>
      </div>
    </Scene>
  );
};

const Eq: React.FC<{ items: { k: string; m: string; t: number; mt: number }[]; t: number }> = ({ items, t }) => (
  <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 24 }}>
    {items.map((it, i) => {
      const p = ramp(t, it.t - 0.1, it.t + 0.25);
      const mp = ramp(t, it.mt - 0.1, it.mt + 0.25);
      return (
        <React.Fragment key={i}>
          {i > 0 && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 60, color: C.matcha, opacity: p, alignSelf: "flex-start", marginTop: 6 }}>+</div>}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 58, color: C.forest, background: C.banana, padding: "4px 24px 10px", borderRadius: 16, border: `3px solid ${C.forest}` }}>
              {it.k}
            </div>
            <div style={{ opacity: mp }}>
              <Pill size={32}>{it.m}</Pill>
            </div>
          </div>
        </React.Fragment>
      );
    })}
  </div>
);

const Result: React.FC<{ t0: number; word: string; meaning: string }> = ({ t0, word, meaning }) => {
  const t = useT();
  const p = ramp(t, t0 - 0.1, t0 + 0.3);
  return (
    <div style={{ opacity: p, transform: `scale(${0.85 + 0.15 * p})`, textAlign: "center" }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 70, color: C.forest, letterSpacing: -1 }}>
        <Mark p={p}>{word}</Mark>
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 34, color: C.matcha, marginTop: 6 }}>{meaning}</div>
    </div>
  );
};

/* ---------- 8. Heart ---------- */
export const S8: React.FC = () => {
  const t = useT();
  const big = ramp(t, 65.3, 65.9);
  const beat = Math.max(0, Math.sin(t * 7.5)) ** 4;
  return (
    <Scene start={62.85} end={68.55}>
      <Eq
        t={t}
        items={[
          { k: "cardio", m: "heart", t: 62.93, mt: 63.78 },
          { k: "megaly", m: "enlarged", t: 64.49, mt: 65.27 },
        ]}
      />
      <div style={center(220, { height: 520, alignItems: "center" })}>
        <div style={{ position: "relative", width: 520, height: 520, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {big > 0 && (
            <svg width={520} height={560} style={{ position: "absolute", left: 0, top: 0, zIndex: 2, overflow: "visible" }} viewBox="0 0 520 560">
              <circle cx={260} cy={275} r={150} fill="none" stroke={C.forest} strokeWidth={4} strokeDasharray="14 12" opacity={0.5 * big} />
              <text x={260} y={548} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={26} fill={C.forest} opacity={0.7 * big}>
                - - -  normal size
              </text>
            </svg>
          )}
          <div style={{ transform: `scale(${0.72 + 0.32 * big})` }}>
            <Heart size={440} beat={beat} />
          </div>
        </div>
      </div>
      <div style={center(760)}>
        <Result t0={66.26} word="cardiomegaly" meaning="an enlarged heart" />
      </div>
    </Scene>
  );
};

/* ---------- 9. Brady / Tachy ---------- */
export const S9: React.FC = () => {
  const t = useT();
  const m1 = ramp(t, 68.65, 69.0);
  const m2 = ramp(t, 70.25, 70.6);
  return (
    <Scene start={68.55} end={76.0} push={0.02}>
      <div style={abs(20, 0, { opacity: m1 })}>
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.forest, background: C.banana, padding: "2px 20px 8px", borderRadius: 14, border: `3px solid ${C.forest}` }}>brady</span>
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 48, color: C.matcha, margin: "0 16px" }}>=</span>
        <span style={{ opacity: ramp(t, 69.3, 69.6) }}>
          <Pill size={36}>slow</Pill>
        </span>
      </div>
      <div style={abs(20, 100, { opacity: m1, transform: `translateY(${(1 - m1) * 30}px)` })}>
        <Monitor w={820} bpm={48} t={t} label="HEART RATE" color={C.matchaLight} />
      </div>
      <div style={abs(20, 370, { opacity: ramp(t, 71.9, 72.3), fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.forest })}>
        → <Mark p={ramp(t, 72.0, 72.5)}>bradycardia</Mark>
      </div>
      <div style={abs(20, 460, { opacity: m2 })}>
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.forest, background: C.banana, padding: "2px 20px 8px", borderRadius: 14, border: `3px solid ${C.forest}` }}>tachy</span>
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 48, color: C.matcha, margin: "0 16px" }}>=</span>
        <span style={{ opacity: ramp(t, 70.85, 71.2) }}>
          <Pill size={36}>fast</Pill>
        </span>
      </div>
      <div style={abs(20, 560, { opacity: m2, transform: `translateY(${(1 - m2) * 30}px)` })}>
        <Monitor w={820} bpm={130} t={t} label="HEART RATE" color={C.banana} />
      </div>
      <div style={abs(20, 830, { opacity: ramp(t, 74.1, 74.5), fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.forest })}>
        → <Mark p={ramp(t, 74.2, 74.7)}>tachycardia</Mark>
      </div>
    </Scene>
  );
};

/* ---------- 10. Angioplasty ---------- */
export const S10: React.FC = () => {
  const t = useT();
  const balloon = ramp(t, 78.4, 79.4);
  const open = ramp(t, 78.8, 79.6);
  return (
    <Scene start={76.0} end={82.15}>
      <Eq
        t={t}
        items={[
          { k: "angio", m: "vessel", t: 76.09, mt: 76.86 },
          { k: "plasty", m: "repair", t: 77.62, mt: 78.37 },
        ]}
      />
      <div style={abs(10, 290, { opacity: ramp(t, 76.3, 76.8) })}>
        <Vessel w={840} balloon={ramp(t, 77.9, 78.4) > 0 ? Math.max(0.05, balloon * (1 - ramp(t, 80.4, 80.9)) ) : 0} open={open} />
      </div>
      <Callout t0={76.9} x={300} y={420} tx={190} ty={300} text="plaque" dark={false} />
      <div style={center(730)}>
        <Result t0={79.68} word="angioplasty" meaning="fixing a blood vessel" />
      </div>
    </Scene>
  );
};

/* ---------- 11. Hepatitis ---------- */
export const S11: React.FC = () => {
  const t = useT();
  return (
    <Scene start={82.15} end={88.3}>
      <Eq
        t={t}
        items={[
          { k: "hepat", m: "liver", t: 82.21, mt: 82.84 },
          { k: "itis", m: "inflammation", t: 83.64, mt: 84.24 },
        ]}
      />
      <div style={center(250)}>
        <Liver size={680} inflame={ramp(t, 84.2, 84.9) * (0.85 + 0.15 * Math.sin(t * 6))} />
      </div>
      <div style={center(770)}>
        <Result t0={86.02} word="hepatitis" meaning="inflammation of the liver" />
      </div>
      <Stamp t0={86.9} text="DECODED" color={C.matcha} size={54} rot={10} style={{ left: 520, top: 250 }} />
    </Scene>
  );
};

/* ---------- 12. Challenge ---------- */
export const S12: React.FC = () => {
  const t = useT();
  return (
    <Scene start={88.3} end={92.85}>
      <div style={center(20)}>
        <Title size={70} style={{ opacity: ramp(t, 88.4, 88.8) }}>
          Your turn:
        </Title>
      </div>
      <div style={center(110, { opacity: ramp(t, 89.9, 90.3) })}>
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 96, color: C.forest, letterSpacing: -2 }}>
          gastr<span style={{ color: C.matcha }}>itis</span>
        </span>
      </div>
      <div style={center(260)}>
        <Stomach size={470} q={ramp(t, 90.3, 90.7)} />
      </div>
      <div style={center(760, { opacity: ramp(t, 91.2, 91.6) })}>
        <svg width={86} height={80} viewBox="0 0 86 80" style={{ marginRight: 16 }}>
          <path d="M8 8 H78 Q82 8 82 12 V52 Q82 56 78 56 H34 L18 72 V56 H8 Q4 56 4 52 V12 Q4 8 8 8 Z" fill={C.banana} stroke={C.forest} strokeWidth={5} strokeLinejoin="round" />
          <circle cx={26} cy={32} r={5} fill={C.forest} />
          <circle cx={43} cy={32} r={5} fill={C.forest} />
          <circle cx={60} cy={32} r={5} fill={C.forest} />
        </svg>
        <Pill size={40}>answer in the comments</Pill>
      </div>
    </Scene>
  );
};

/* ---------- 13. Product ---------- */
export const S13: React.FC = () => {
  const t = useT();
  const box = ramp(t, 96.2, 96.9);
  const float = Math.sin(t * 1.6) * 8;
  const btn = ramp(t, 105.4, 105.8);
  const pulse = 1 + 0.04 * Math.max(0, Math.sin((t - 105.8) * 5)) * (t > 105.8 ? 1 : 0);
  const chips = [
    { t: 99.2, text: "1,000 medical words" },
    { t: 101.1, text: "prefixes · roots · suffixes" },
    { t: 103.4, text: "tabbed by topic" },
  ];
  const who = ramp(t, 92.9, 93.3) * (1 - ramp(t, 96.0, 96.4));
  return (
    <Scene start={92.85} end={107.6} push={0.02}>
      <div style={{ position: "absolute", inset: 0, opacity: who }}>
        <div style={center(160)}>
          <Stethoscope size={340} />
        </div>
        <div style={center(560, { gap: 16 })}>
          {[
            ["nursing", 93.6],
            ["medicine", 94.1],
            ["word lovers", 95.2],
          ].map(([w, t0]) => (
            <div key={w as string} style={{ opacity: ramp(t, (t0 as number) - 0.1, (t0 as number) + 0.2) }}>
              <Pill bg={C.matcha} size={38}>
                {w as string}
              </Pill>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: box }}>
        <div style={center(0)}>
          <Title size={48}>
            Medical Terminology <Mark p={ramp(t, 97.0, 97.6)}>Flash Cards</Mark>
          </Title>
        </div>
        <div style={abs(40, 100 + float + (1 - box) * 80, { width: 780, transform: `rotate(${-3 + 3 * box}deg)` })}>
          <Img src={staticFile("box.png")} style={{ width: 780, filter: "drop-shadow(0 26px 22px rgba(31,42,20,0.25))" }} />
        </div>
        <div style={center(545, { flexDirection: "column", alignItems: "center", gap: 14 })}>
          {chips.map((c) => {
            const p = ramp(t, c.t - 0.1, c.t + 0.25);
            return (
              <div key={c.text} style={{ opacity: p, transform: `translateX(${(1 - p) * -40}px)` }}>
                <Pill bg={C.forest} size={36}>
                  <span style={{ color: C.banana, marginRight: 12 }}>✓</span>
                  {c.text}
                </Pill>
              </div>
            );
          })}
        </div>
        <div style={center(810, { opacity: btn, transform: `translateY(${(1 - btn) * 30}px) scale(${pulse})` })}>
          <div
            style={{
              background: C.banana,
              color: C.forest,
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 46,
              padding: "20px 56px",
              borderRadius: 60,
              border: `5px solid ${C.forest}`,
              boxShadow: `0 10px 0 ${C.forest}`,
              letterSpacing: 2,
            }}
          >
            TAP THE LINK BELOW ↓
          </div>
        </div>
      </div>
    </Scene>
  );
};
