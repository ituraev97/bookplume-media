import React from "react";
import { OffthreadVideo, Sequence, staticFile } from "remotion";
import { C, Card, FONT, Mark, Pill, Scene, Stamp, Title, ramp, useT } from "./kit";
import { Heart } from "./Illus";
import { LongBone } from "./Illus3";
import { Atom, BrainSide, Bread, Cloud, DotPerson, Eye, Helix, Leaf, LifespanBars, MiniMan, Mirror, PctGrid, Post, RBC, Villi } from "./Illus8";

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
  [0, 2.4],
  [113.5, 130.3],
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

const Q: React.FC<{ t: number; text: [string, string]; at: number }> = ({ t, text, at }) => (
  <div style={{ background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 62, padding: "18px 40px", borderRadius: 30, border: `5px solid ${C.forest}`, boxShadow: `0 10px 0 ${C.forest}`, textAlign: "center", lineHeight: 1.05, transform: `rotate(${-2 + Math.sin(t * 3) * 0.8}deg)`, ...pop(t, at, 0.25) }}>
    {text[0]}
    <br />
    {text[1]}
  </div>
);

/* 0. Hook */
export const LiveHook: React.FC = () => {
  const t = useT();
  return (
    <LiveWrap a={0} b={2.4}>
      <Footage a={0} b={2.7} from={0} />
      <div style={abs(0, 1040, { width: 1080, display: "flex", justifyContent: "center" })}>
        <Q t={t} at={0} text={["SAME PERSON AS", "7 YEARS AGO?"]} />
      </div>
    </LiveWrap>
  );
};

/** cross-fade helper: visible between a and b inside a scene */
const win = (t: number, a: number, b: number) => ramp(t, a, a + 0.3) * (1 - ramp(t, b - 0.3, b));
const Layer: React.FC<{ o: number; children: React.ReactNode }> = ({ o, children }) => (o <= 0.001 ? null : <div style={{ position: "absolute", inset: 0, opacity: o }}>{children}</div>);
const Big: React.FC<{ size?: number; children: React.ReactNode; color?: string }> = ({ size = 150, children, color = C.forest }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1, letterSpacing: -2, textAlign: "center" }}>{children}</div>
);

/* 1. The 7-year myth */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={2.3} end={12.3}>
      <Layer o={1 - ramp(t, 6.7, 7.0)}>
        <div style={abs(10, 40, { opacity: ramp(t, 2.4, 2.8) })}>
          <DotPerson h={780} sweep={ramp(t, 4.4, 6.4) * 1.05} t={t} />
        </div>
        <div style={abs(470, 120, { display: "flex", flexDirection: "column", gap: 24 })}>
          <div style={pop(t, 3.6)}>
            <Pill size={48}>every 7 years</Pill>
          </div>
          <div style={pop(t, 5.6)}>
            <Pill size={48} bg={C.matcha}>
              every cell new?
            </Pill>
          </div>
        </div>
      </Layer>
      <Layer o={ramp(t, 6.8, 7.1)}>
        <div style={abs(30, 40, pop(t, 6.85))}>
          <Post w={800} t={t} />
        </div>
        <Stamp t0={9.35} text="WRONG" size={110} rot={-9} style={{ left: 250, top: 420 }} />
        <div style={center(700, { opacity: ramp(t, 10.15, 10.5) })}>
          <Title size={64}>
            the truth is even <Mark p={ramp(t, 11.1, 11.7)}>stranger</Mark>
          </Title>
        </div>
      </Layer>
    </Scene>
  );
};

/* 2. Fast lane */
const NUM = (v: number) => Math.round(v).toLocaleString("en-US");
export const V2: React.FC = () => {
  const t = useT();
  const cnt = ramp(t, 13.6, 16.0);
  return (
    <Scene start={12.3} end={28.9}>
      <Layer o={win(t, 12.3, 19.3)}>
        <svg width={860} height={940} style={{ position: "absolute" }}>
          {Array.from({ length: 40 }, (_, i) => {
            const ph = (t * 1.3 + i * 0.137) % 1;
            const x = 40 + ((i * 197) % 780);
            const y = 120 + ((i * 331) % 760);
            return t > 13.6 ? <circle key={i} cx={x} cy={y} r={6 + 18 * ph} fill={i % 3 ? C.matchaLight : C.banana} opacity={(1 - ph) * 0.6} /> : null;
          })}
        </svg>
        <div style={center(160, pop(t, 13.5))}>
          <Big size={108}>{NUM(330e9 * cnt)}</Big>
        </div>
        <div style={center(330, pop(t, 16.6))}>
          <Pill size={52}>cells replaced every day</Pill>
        </div>
        <div style={center(470, pop(t, 17.5))}>
          <Pill size={46} bg={C.matcha}>
            ≈ 4 million every second
          </Pill>
        </div>
      </Layer>
      <Layer o={win(t, 19.2, 22.3)}>
        <div style={center(20, pop(t, 19.25))}>
          <Title size={58}>Most of them:</Title>
        </div>
        <Card style={{ left: 20, top: 140, width: 400, height: 460, ...pop(t, 19.9) }}>
          <div style={abs(110, 70)}>
            <RBC size={180} />
          </div>
          <div style={abs(0, 340, { width: 400, textAlign: "center" })}>
            <Pill size={36}>blood cells</Pill>
          </div>
        </Card>
        <Card style={{ left: 440, top: 140, width: 400, height: 460, ...pop(t, 20.9) }}>
          <div style={abs(20, 60)}>
            <Villi w={360} t={t} />
          </div>
          <div style={abs(0, 340, { width: 400, textAlign: "center" })}>
            <Pill size={36} bg={C.matcha}>
              gut lining
            </Pill>
          </div>
        </Card>
      </Layer>
      <Layer o={win(t, 22.2, 25.2)}>
        <div style={abs(30, 60)}>
          <Villi w={800} t={t} />
        </div>
        <div style={center(600, pop(t, 23.5))}>
          <Pill size={50}>worn out in ~5 days</Pill>
        </div>
      </Layer>
      <Layer o={ramp(t, 25.1, 25.4)}>
        <svg width={860} height={420} style={{ position: "absolute", top: 60 }}>
          <path d="M0 210 C200 140 420 280 860 190" stroke="#F4C5AE" strokeWidth={180} fill="none" opacity={0.6} />
        </svg>
        {Array.from({ length: 7 }, (_, i) => {
          const ph = (t * 0.25 + i / 7) % 1;
          const x = -120 + ph * 1000;
          const y = 200 + Math.sin(ph * 6 + i) * 60;
          return (
            <div key={i} style={abs(x, y, { transform: `rotate(${ph * 300}deg)` })}>
              <RBC size={130} />
            </div>
          );
        })}
        <div style={center(560, pop(t, 26.6))}>
          <Pill size={50}>red blood cells: ~4 months</Pill>
        </div>
        <div style={center(680, pop(t, 27.75))}>
          <Pill size={50} bg={C.matcha}>
            ♻ then recycled
          </Pill>
        </div>
      </Layer>
    </Scene>
  );
};

/* 3. Slow lane */
export const V3: React.FC = () => {
  const t = useT();
  const items = [
    { label: "gut lining", val: "~5 days", frac: 0.18, p: ramp(t, 29.2, 29.8), color: "#E8A58E" },
    { label: "red blood cells", val: "~4 months", frac: 0.42, p: ramp(t, 29.5, 30.1), color: C.red },
    { label: "fat cells", val: "~12 years", frac: 0.74, p: ramp(t, 30.6, 31.4), color: C.banana },
    { label: "muscle cells", val: "~50 years", frac: 0.97, p: ramp(t, 33.1, 34.0), color: C.matcha },
  ];
  const spots = [
    [120, 180],
    [170, 260],
    [140, 360],
    [180, 430],
    [130, 120],
  ];
  return (
    <Scene start={28.9} end={63.6} push={0.04}>
      <Layer o={win(t, 28.9, 35.4)}>
        <div style={center(0, { opacity: ramp(t, 28.95, 29.3) })}>
          <Title size={60}>
            Other cells stay <Mark p={ramp(t, 29.8, 30.3)}>much longer</Mark>
          </Title>
        </div>
        <div style={abs(20, 160)}>
          <LifespanBars w={820} items={items} />
        </div>
        <div style={abs(20, 820, { fontFamily: FONT, fontWeight: 700, fontSize: 24, color: C.matcha, opacity: 0.8 })}>average lifespans · bars not to scale</div>
      </Layer>
      <Layer o={win(t, 35.3, 43.85)}>
        <div style={abs(40, 20, { opacity: ramp(t, 35.4, 35.8) })}>
          <div style={{ position: "relative" }}>
            <LongBone h={820} p={1} />
            <svg width={410} height={820} viewBox="0 0 300 600" style={{ position: "absolute", left: 0, top: 0 }}>
              {spots.map(([x, y], i) => {
                const ph = (t * 0.45 + i * 0.21) % 1;
                const hole = Math.sin(ph * Math.PI);
                return (
                  <g key={i}>
                    <circle cx={x} cy={y} r={20 * hole} fill={ph < 0.5 ? C.red : C.matcha} opacity={0.75} />
                    <circle cx={x} cy={y} r={20 * hole + 6} fill="none" stroke={C.forest} strokeWidth={2} opacity={hole} />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
        <div style={abs(470, 60, { display: "flex", flexDirection: "column", gap: 22 })}>
          <div style={pop(t, 35.6)}>
            <Pill size={40}>skeleton</Pill>
          </div>
          <div style={pop(t, 38.35)}>
            <Pill size={40} bg={C.red}>
              broken down
            </Pill>
          </div>
          <div style={pop(t, 39.15)}>
            <Pill size={40} bg={C.matcha}>
              rebuilt
            </Pill>
          </div>
        </div>
        <div style={abs(470, 470, pop(t, 42.6))}>
          <Big size={130}>~10</Big>
          <div style={{ textAlign: "center", marginTop: 10 }}>
            <Pill size={34}>years to replace most of it</Pill>
          </div>
        </div>
      </Layer>
      <Layer o={win(t, 43.75, 55.75)}>
        <div style={abs(0, 40, pop(t, 43.85))}>
          <Heart size={420} beat={Math.max(0, Math.sin(t * 7)) ** 4} />
        </div>
        <div style={abs(470, 40, pop(t, 46.5))}>
          <PctGrid size={360} n={Math.round(t < 52.4 ? 1 : 1 + 48 * ramp(t, 52.5, 54.6))} />
        </div>
        <div style={abs(30, 520, { display: "flex", flexDirection: "column", gap: 18 })}>
          <div style={slide(t, 46.6)}>
            <Pill size={40}>
              age 25: <span style={{ color: C.banana }}>~1%</span> renewed per year
            </Pill>
          </div>
          <div style={slide(t, 49.8)}>
            <Pill size={40} bg={C.matcha}>
              age 75: <span style={{ color: C.banana }}>&lt;0.5%</span> per year
            </Pill>
          </div>
          <div style={slide(t, 53.6)}>
            <Pill size={40} bg={C.red}>
              lifetime: fewer than half replaced
            </Pill>
          </div>
        </div>
      </Layer>
      <Layer o={ramp(t, 55.65, 55.95)}>
        <div style={abs(80, 40, pop(t, 55.75))}>
          <BrainSide w={700} hi={ramp(t, 59.8, 60.3)} t={t} />
        </div>
        <div style={abs(560, 40, pop(t, 60.1))}>
          <Pill size={38} bg={C.forest}>
            visual cortex
          </Pill>
        </div>
        <div style={center(640, pop(t, 56.9))}>
          <Pill size={46}>some neurons are never replaced</Pill>
        </div>
        <div style={center(770, pop(t, 61.5))}>
          <Pill size={46} bg={C.matcha}>
            as old as you are
          </Pill>
        </div>
      </Layer>
    </Scene>
  );
};

/* 4. The bomb clock */
export const V4: React.FC = () => {
  const t = useT();
  const atoms = ramp(t, 72.6, 74.8);
  return (
    <Scene start={63.6} end={91.9} push={0.04}>
      <Layer o={win(t, 63.6, 66.0)}>
        <div style={center(40, pop(t, 63.65))}>
          <Title size={70}>
            How do scientists know a cell's <Mark p={ramp(t, 64.9, 65.3)}>age</Mark>?
          </Title>
        </div>
        <div style={center(330, { transform: `rotate(${t * 40}deg)` })}>
          <RBC size={300} />
        </div>
      </Layer>
      <Layer o={win(t, 65.9, 68.3)}>
        <div style={{ position: "absolute", left: 0, top: 120, width: 860, height: 600, borderRadius: 40, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center", ...pop(t, 65.95, 0.35) }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 76, color: C.paper, textAlign: "center", lineHeight: 1.1, padding: 40 }}>
            But that's not even the <span style={{ color: C.banana, borderBottom: `6px solid ${C.banana}`, opacity: ramp(t, 66.6, 66.9) }}>strangest part…</span>
          </div>
        </div>
      </Layer>
      <Layer o={win(t, 68.2, 78.0)}>
        <div style={abs(220, 110)}>
          <Cloud w={440} p={ramp(t, 68.4, 70.2)} t={t} />
        </div>
        {Array.from({ length: 18 }, (_, i) => {
          const ph = (atoms + i * 0.07) % 1;
          const x = 330 + Math.sin(i * 2.1) * 300 * atoms;
          const y = 380 - ph * 260;
          return atoms > 0 ? (
            <div key={i} style={abs(x, y, { opacity: atoms * (1 - ramp(t, 75.3, 75.6) * 0.7) })}>
              <Atom size={34} label={i % 4 === 0} />
            </div>
          ) : null;
        })}
        <div style={abs(30, 0, { display: "flex", flexDirection: "column", gap: 14 })}>
          <div style={pop(t, 68.7)}>
            <Pill size={38} bg={C.red}>
              nuclear tests
            </Pill>
          </div>
          <div style={pop(t, 70.15)}>
            <Pill size={38}>1950s–60s</Pill>
          </div>
        </div>
        <div style={abs(600, 120, pop(t, 73.4))}>
          <Pill size={36} bg={C.matcha}>
            + extra carbon-14
          </Pill>
        </div>
        <div style={abs(40, 620, { width: 780, display: "flex", justifyContent: "space-between", alignItems: "center" })}>
          {[
            { el: <Leaf size={160} />, at: 75.55, l: "plants" },
            { el: <Bread size={160} />, at: 76.3, l: "food" },
            { el: <MiniMan size={160} />, at: 77.1, l: "us" },
          ].map((x, i) => (
            <React.Fragment key={x.l}>
              {i > 0 && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 70, color: C.matcha, opacity: ramp(t, x.at - 0.2, x.at) }}>→</div>}
              <div style={{ textAlign: "center", ...pop(t, x.at) }}>
                {x.el}
                <div>
                  <Pill size={30} bg={i % 2 ? C.matcha : C.forest}>
                    {x.l}
                  </Pill>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </Layer>
      <Layer o={win(t, 77.9, 87.0)}>
        <div style={center(20, pop(t, 78.0))}>
          <Pill size={44}>every new cell's DNA</Pill>
        </div>
        <div style={abs(30, 150)}>
          <Helix w={800} t={t} lock={ramp(t, 79.8, 80.8)} />
        </div>
        <div style={center(560, pop(t, 82.1))}>
          <div style={{ background: C.banana, border: `5px solid ${C.forest}`, borderRadius: 20, padding: "12px 30px", fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.forest, boxShadow: `0 8px 0 ${C.forest}` }}>⏱ a built-in timestamp</div>
        </div>
        <div style={abs(40, 720, { display: "flex", gap: 14 })}>
          <div style={pop(t, 83.9)}>
            <Pill size={38} bg={C.matcha}>
              researchers in Sweden
            </Pill>
          </div>
          <div style={pop(t, 85.6)}>
            <Pill size={38}>dated human cells</Pill>
          </div>
        </div>
      </Layer>
      <Layer o={ramp(t, 86.9, 87.2)}>
        <div style={center(20, pop(t, 87.0))}>
          <Title size={58}>average cell in an adult</Title>
        </div>
        <div style={center(170, pop(t, 89.9))}>
          <Big size={230}>
            <Mark p={ramp(t, 90.3, 91.0)}>7–10</Mark>
          </Big>
        </div>
        <div style={center(440, pop(t, 90.9))}>
          <Pill size={56}>years old</Pill>
        </div>
        <div style={abs(40, 600, { fontFamily: FONT, fontWeight: 700, fontSize: 26, color: C.matcha, opacity: ramp(t, 89.5, 89.8) })}>Karolinska Institutet estimate · Cell, 2005</div>
      </Layer>
    </Scene>
  );
};

/* 5. Many ages */
export const V5: React.FC = () => {
  const t = useT();
  const tags = [
    { l: "5 days", at: 109.3, x: 20, y: 120, bg: "#E8A58E" },
    { l: "4 months", at: 109.8, x: 600, y: 160, bg: C.red },
    { l: "12 years", at: 110.6, x: 10, y: 470, bg: C.matcha },
    { l: "your age", at: 111.6, x: 590, y: 520, bg: C.forest },
  ];
  return (
    <Scene start={91.9} end={113.5}>
      <Layer o={win(t, 91.9, 100.0)}>
        <div style={abs(60, 20, pop(t, 92.0))}>
          <Eye w={740} core={ramp(t, 95.3, 96.0)} t={t} />
        </div>
        <div style={abs(30, 560, { display: "flex", flexDirection: "column", gap: 16 })}>
          <div style={slide(t, 93.15)}>
            <Pill size={42}>older than your birthday</Pill>
          </div>
          <div style={slide(t, 97.0)}>
            <Pill size={42} bg={C.matcha}>
              lens proteins: made before birth
            </Pill>
          </div>
          <div style={slide(t, 98.55)}>
            <Pill size={42} bg={C.red}>
              never replaced
            </Pill>
          </div>
        </div>
      </Layer>
      <Layer o={win(t, 99.9, 108.95)}>
        <div style={center(0, pop(t, 100.0))}>
          <Title size={58}>Same person as 7 years ago?</Title>
        </div>
        <div style={abs(40, 160, { display: "flex", flexDirection: "column", gap: 22 })}>
          <div style={slide(t, 103.5)}>
            <Pill size={48} bg={C.red}>
              ✗ gut: no
            </Pill>
          </div>
          <div style={slide(t, 104.9)}>
            <Pill size={48} bg={C.matcha}>
              ✓ brain: mostly yes
            </Pill>
          </div>
        </div>
        <div style={abs(520, 140, { opacity: ramp(t, 106.7, 107.1) })}>
          <DotPerson h={600} sweep={0} t={t} mode="mixed" />
        </div>
        <div style={abs(40, 520, pop(t, 107.95))}>
          <Big size={110}>
            You're <Mark p={ramp(t, 108.1, 108.6)}>many</Mark>.
          </Big>
        </div>
      </Layer>
      <Layer o={ramp(t, 108.85, 109.15)}>
        <div style={center(40, pop(t, 108.9))}>
          <Mirror h={720} />
        </div>
        {tags.map((g) => (
          <div key={g.l} style={abs(g.x, g.y + Math.sin(t * 2 + g.x) * 10, pop(t, g.at))}>
            <Pill size={40} bg={g.bg}>
              {g.l}
            </Pill>
          </div>
        ))}
      </Layer>
    </Scene>
  );
};

/* 6. Product */
const CHIPS8 = [
  { t: 116.1, text: "QuickStudy Anatomy Flash Cards" },
  { t: 118.9, text: "300 cards" },
  { t: 120.05, text: "14 body systems" },
  { t: 121.5, text: "each system its own color" },
  { t: 122.85, text: "from blood to the brain" },
];
export const LiveProduct: React.FC = () => {
  const t = useT();
  const btn = ramp(t, 124.7, 125.0);
  const loopQ = ramp(t, 127.6, 127.9);
  return (
    <LiveWrap a={113.5} b={130.3}>
      <Footage a={113.5} b={117.1} from={3.0} />
      <Footage a={117.1} b={130.6} from={6.6} rate={0.64} />
      <div style={abs(70, 760, { width: 860, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 14, opacity: 1 - loopQ })}>
        {CHIPS8.map((c, i) => (
          <div key={c.text} style={slide(t, c.t - 0.1)}>
            <Pill bg={i % 2 ? C.matcha : C.forest} size={36}>
              <span style={{ color: C.banana, marginRight: 10 }}>✓</span>
              {c.text}
            </Pill>
          </div>
        ))}
      </div>
      <div style={abs(0, 860, { width: 1080, display: "flex", justifyContent: "center", opacity: loopQ })}>
        <Q t={t} at={127.6} text={["SAME PERSON AS", "7 YEARS AGO?"]} />
      </div>
      <div style={abs(0, 1250, { width: 1080, display: "flex", justifyContent: "center", opacity: btn, transform: `translateY(${(1 - btn) * 30}px) scale(${1 + 0.035 * Math.max(0, Math.sin((t - 125) * 5)) * (t > 125 ? 1 : 0)})` })}>
        <div style={{ background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 46, padding: "20px 56px", borderRadius: 60, border: `5px solid ${C.forest}`, boxShadow: `0 10px 0 ${C.forest}`, letterSpacing: 2 }}>
          TAP THE CART BELOW ↓
        </div>
      </div>
    </LiveWrap>
  );
};
