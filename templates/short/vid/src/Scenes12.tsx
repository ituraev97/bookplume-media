import React from "react";
import { C, FONT, Mark, Pill, Scene, Stamp, Title, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { BabyBrain, BrainLoop, Chalkboard, Chili, FastPlate, GulpAir, HicBurst, Metronome, OldMan, Soda, Stopwatch, Torso, VocalCords, Womb } from "./Illus12";

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

export const liveAlpha = (_t: number) => 0;
const Layer: React.FC<{ o: number; children: React.ReactNode }> = ({ o, children }) => (o <= 0.001 ? null : <div style={{ position: "absolute", inset: 0, opacity: o }}>{children}</div>);
const Big: React.FC<{ size?: number; children: React.ReactNode; color?: string }> = ({ size = 150, children, color = C.forest }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1, letterSpacing: -2, textAlign: "center" }}>{children}</div>
);
const punch = (t: number, t0: number) => 1 + 0.06 * Math.max(0, 1 - (t - t0) / 0.25) * (t >= t0 ? 1 : 0);
const shake = (t: number, t0: number, d = 0.4, a = 10) => (t >= t0 && t < t0 + d ? Math.sin(t * 90) * a * (1 - (t - t0) / d) : 0);

/* 1. The twitch: diaphragm, nerve, gulp, vocal cords, HIC */
export const V1: React.FC = () => {
  const t = useT();
  const breath = ramp(t, 4.6, 6.1) * (1 - ramp(t, 6.4, 7.4));
  const twitch = ramp(t, 9.25, 9.4) * (1 - ramp(t, 10.0, 10.3)) + ramp(t, 10.2, 10.3) * (1 - ramp(t, 10.5, 10.7));
  const cords = ramp(t, 11.3, 11.6);
  return (
    <Scene start={-0.6} end={15.0}>
      <Layer o={1 - cords}>
        <div style={center(40, { transform: `scale(${punch(t, 0)})`, opacity: 1 - ramp(t, 1.15, 1.45) })}>
          <Big size={110}>
            <Mark p={ramp(t, 0.15, 0.6)}>HICCUPS?</Mark>
          </Big>
        </div>
        <div style={abs(90, 140, { opacity: ramp(t, 1.2, 1.6), transform: `translateX(${shake(t, 9.3, 0.5, 14)}px) scale(${0.92 + 0.08 * ramp(t, 1.2, 2.0)})` })}>
          <Torso w={680} breath={breath} twitch={twitch} nerve={ramp(t, 7.6, 8.6)} air={ramp(t, 6.2, 6.5) * (1 - ramp(t, 7.2, 7.5)) + ramp(t, 10.15, 10.3)} t={t} />
        </div>
        <div style={abs(20, 160, pop(t, 1.5))}>
          <Pill size={30}>under your lungs</Pill>
        </div>
        <div style={abs(470, 660, pop(t, 3.7))}>
          <Pill size={36} bg={C.matcha}>
            diaphragm
          </Pill>
        </div>
        <div style={abs(0, 820, slide(t, 5.0))}>
          <Pill size={32} bg={C.forest}>
            ↓ pulls down = breathe in
          </Pill>
        </div>
        <div style={abs(500, 230, pop(t, 8.4))}>
          <Pill size={32} bg={C.bananaDark} color={C.forest}>
            irritated nerve ⚡
          </Pill>
        </div>
        <div style={abs(40, 560, pop(t, 9.35))}>
          <Pill size={40} bg={C.red}>
            TWITCH!
          </Pill>
        </div>
        <div style={abs(560, 120, { ...pop(t, 10.2), transform: `${pop(t, 10.2).transform} scale(${punch(t, 10.2)})` })}>
          <Pill size={44} bg={C.forest}>
            GULP
          </Pill>
        </div>
      </Layer>
      <Layer o={cords}>
        <div style={center(40, pop(t, 11.4))}>
          <Title size={60}>
            your <Mark p={ramp(t, 11.7, 12.2)}>vocal cords</Mark>
          </Title>
        </div>
        <div style={center(130, { transform: `translateX(${shake(t, 12.6, 0.4, 12)}px)` })}>
          <VocalCords size={540} close={ramp(t, 12.35, 12.6)} t={t} />
        </div>
        <div style={abs(30, 160, pop(t, 11.8))}>
          <Pill size={28} bg={C.matcha}>
            seen from above
          </Pill>
        </div>
        <div style={center(720, pop(t, 12.6))}>
          <Pill size={44} bg={C.red}>
            SLAM SHUT
          </Pill>
        </div>
        <div style={abs(500, 360, { opacity: ramp(t, 14.3, 14.45) })}>
          <HicBurst size={340} p={ramp(t, 14.3, 14.6)} t={t} />
        </div>
      </Layer>
    </Scene>
  );
};

/* 2. Triggers */
export const V2: React.FC = () => {
  const t = useT();
  const clock = ramp(t, 19.9, 20.2);
  const items: [React.ReactNode, string, number][] = [
    [<FastPlate size={230} t={t} />, "eating fast", 15.2],
    [<Soda size={230} t={t} />, "fizzy drinks", 16.2],
    [<Chili size={230} t={t} />, "spicy food", 17.1],
    [<GulpAir size={230} t={t} />, "swallowed air", 18.1],
  ];
  return (
    <Scene start={15.0} end={22.0}>
      <Layer o={1 - clock}>
        <div style={center(40, pop(t, 15.05))}>
          <Title size={62}>
            what <Mark p={ramp(t, 15.4, 15.9)}>sets it off</Mark>
          </Title>
        </div>
        <div style={abs(10, 120, { width: 840, display: "flex", flexWrap: "wrap", gap: 30, justifyContent: "center" })}>
          {items.map(([el, l, t0], i) => (
            <div key={l} style={{ width: 380, height: 360, textAlign: "center", ...pop(t, t0), transform: `${pop(t, t0).transform} translateY(${Math.sin(t * 2.4 + i) * 8}px)` }}>
              <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 32, padding: 30, boxShadow: "0 12px 28px rgba(31,42,20,0.12)" }}>
                {el}
                <div style={{ marginTop: 6 }}>
                  <Pill size={30} bg={i % 2 ? C.matcha : C.forest}>
                    {l}
                  </Pill>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Layer>
      <Layer o={clock}>
        <div style={center(40, pop(t, 20.0))}>
          <Title size={60}>
            most bouts: <Mark p={ramp(t, 20.6, 21.1)}>minutes</Mark>
          </Title>
        </div>
        <div style={center(140)}>
          <Stopwatch size={460} p={ramp(t, 20.1, 21.9) * 0.5} />
        </div>
        <div style={center(660, pop(t, 21.3))}>
          <Pill size={44} bg={C.matcha}>
            then they stop
          </Pill>
        </div>
      </Layer>
    </Scene>
  );
};

/* 3. 68 years */
export const V3: React.FC = () => {
  const t = useT();
  const count = ramp(t, 27.1, 28.6);
  const year = Math.round(1922 + 68 * ramp(t, 23.7, 25.0));
  const big = count >= 1 ? "400,000,000+" : Math.round(400000000 * count).toLocaleString("en-US");
  return (
    <Scene start={22.0} end={29.3}>
      <div style={center(40, pop(t, 22.1))}>
        <Title size={58}>
          one man: <Mark p={ramp(t, 23.0, 23.5)}>Charles Osborne</Mark>
        </Title>
      </div>
      <div style={abs(30, 110, { opacity: ramp(t, 22.2, 22.6) })}>
        <OldMan size={470} t={t} />
      </div>
      <div style={abs(520, 140, pop(t, 23.8))}>
        <div style={{ background: C.forest, color: C.paper, borderRadius: 28, padding: "20px 28px", fontFamily: FONT, fontWeight: 800, textAlign: "center", width: 280 }}>
          <div style={{ fontSize: 30, color: C.matchaLight }}>1922 →</div>
          <div style={{ fontSize: 86, lineHeight: 1 }}>{year}</div>
        </div>
      </div>
      <Stamp t0={24.8} text="68 YEARS" size={70} rot={-7} style={{ left: 500, top: 390 }} />
      <div style={abs(40, 600, { display: "flex", alignItems: "center", gap: 20, ...slide(t, 25.45) })}>
        <Metronome size={190} t={t} />
        <Pill size={40} bg={C.red}>
          20–40 per minute
        </Pill>
      </div>
      <div style={center(810, { ...pop(t, 27.1), transform: `${pop(t, 27.1).transform} scale(${punch(t, 28.6)})` })}>
        <div style={{ background: C.banana, border: `5px solid ${C.forest}`, borderRadius: 24, padding: "10px 26px", fontFamily: FONT, fontWeight: 800, fontSize: 60, whiteSpace: "nowrap", color: C.forest, boxShadow: `0 8px 0 ${C.forest}`, fontVariantNumeric: "tabular-nums" }}>
          {big} hics
        </div>
      </div>
    </Scene>
  );
};

/* 4. Twist: hiccups in the womb teach the brain */
export const V4: React.FC = () => {
  const t = useT();
  const d = 1 - ramp(t, 31.5, 31.8);
  const baby = ramp(t, 36.4, 36.7);
  const loop = ramp(t, 43.9, 44.2);
  const lesson = ramp(t, 48.0, 48.3);
  return (
    <Scene start={29.3} end={52.0} push={0.05}>
      <Layer o={d}>
        <div style={{ position: "absolute", left: 0, top: 120, width: 860, height: 600, borderRadius: 40, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center", ...pop(t, 29.35, 0.35) }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 76, color: C.paper, textAlign: "center", lineHeight: 1.1, padding: 40 }}>
            But that's not even the <span style={{ color: C.banana, borderBottom: `6px solid ${C.banana}`, opacity: ramp(t, 30.2, 30.5) }}>strangest part…</span>
          </div>
        </div>
      </Layer>
      <Layer o={ramp(t, 31.6, 31.9) * (1 - baby)}>
        <div style={center(40, pop(t, 31.7))}>
          <Title size={60}>
            before you were <Mark p={ramp(t, 32.9, 33.3)}>born</Mark>
          </Title>
        </div>
        <div style={center(110)}>
          <Womb size={560} t={t} hicAt={[33.7, 34.65, 35.6, 36.3]} />
        </div>
        <div style={abs(560, 600, pop(t, 34.6))}>
          <Pill size={34} bg={C.red}>
            in the womb
          </Pill>
        </div>
        <div style={center(700, { ...pop(t, 35.5), transform: `${pop(t, 35.5).transform} scale(${punch(t, 35.7)})` })}>
          <Pill size={48} bg={C.matcha}>
            from ~9 weeks
          </Pill>
        </div>
      </Layer>
      <Layer o={baby * (1 - loop)}>
        <div style={abs(0, 0, { display: "flex", gap: 14 })}>
          <div style={pop(t, 36.75)}>
            <Pill size={40}>2019</Pill>
          </div>
          <div style={pop(t, 38.4)}>
            <Pill size={40} bg={C.red}>
              University College London
            </Pill>
          </div>
        </div>
        <div style={abs(20, 130, { opacity: ramp(t, 36.6, 37.0) })}>
          <BabyBrain w={820} t={t} pulses={[41.3, 42.3, 43.3]} />
        </div>
        <div style={abs(30, 640, pop(t, 40.8))}>
          <Pill size={36} bg={C.forest}>
            newborn hiccup →
          </Pill>
        </div>
        <div style={abs(420, 640, pop(t, 42.25))}>
          <Pill size={36} bg={C.matcha}>
            big brainwaves
          </Pill>
        </div>
        <div style={abs(20, 760, slide(t, 39.4))}>
          <Pill size={28} bg={C.bananaDark} color={C.forest}>
            13 babies · 30–42 weeks
          </Pill>
        </div>
      </Layer>
      <Layer o={loop * (1 - lesson)}>
        <div style={center(40, pop(t, 44.0))}>
          <Title size={58}>
            the brain <Mark p={ramp(t, 46.0, 46.5)}>learns to sense</Mark>
          </Title>
        </div>
        <div style={center(110)}>
          <BrainLoop w={700} p={ramp(t, 44.3, 46.0)} t={t} />
        </div>
        <div style={center(400, pop(t, 45.0))}>
          <Pill size={34} bg={C.forest}>
            brain
          </Pill>
        </div>
        <div style={center(720, pop(t, 47.1))}>
          <Pill size={44} bg={C.matcha}>
            its own breathing muscles
          </Pill>
        </div>
      </Layer>
      <Layer o={lesson}>
        <div style={center(40, pop(t, 48.1))}>
          <Title size={58}>
            that <Mark p={ramp(t, 48.6, 49.1)}>annoying hic</Mark>…
          </Title>
        </div>
        <div style={center(140, { transform: `rotate(${-2 + 1.5 * Math.sin(t * 1.5)}deg)` })}>
          <Chalkboard w={700} p={ramp(t, 49.2, 51.0)} t={t} />
        </div>
        <Stamp t0={51.05} text="FIRST LESSON" size={72} rot={-8} style={{ left: 150, top: 640 }} />
      </Layer>
    </Scene>
  );
};

/* 5. End card */
export const V5: React.FC = () => {
  const t = useT();
  return (
    <Scene start={51.9} end={56.6}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, 51.95, 0.35) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.banana, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 52.8, 53.1) }}>
          follow for more body facts
          <br />
          you didn't know you needed
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 52) * 5))})`, opacity: ramp(t, 52.2, 52.5) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
