import React from "react";
import { C, FONT, Mark, Pill, Scene, Stamp, Title, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Bathtub, Brain, Calendar, Camera, Channels, Fingerprint, Fingertip, Flask, Hand, IdCard, Magnifier, MarbleRace, PadSide, SkinSection, SoakTest, Tire, VesselMap } from "./Illus13";

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
const slide = (t: number, t0: number, dir = -1) => {
  const p = ramp(t, t0, t0 + 0.3);
  return { opacity: p, transform: `translateX(${(1 - p) * 40 * dir}px)` } as React.CSSProperties;
};
const bob = (t: number, k = 0, a = 8) => `translateY(${Math.sin(t * 2.2 + k) * a}px)`;

export const liveAlpha = (_t: number) => 0;
const Layer: React.FC<{ o: number; children: React.ReactNode }> = ({ o, children }) => (o <= 0.001 ? null : <div style={{ position: "absolute", inset: 0, opacity: o, transform: "translateY(48px)" }}>{children}</div>);
const Big: React.FC<{ size?: number; children: React.ReactNode; color?: string }> = ({ size = 150, children, color = C.forest }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1, letterSpacing: -2, textAlign: "center" }}>{children}</div>
);
const punch = (t: number, t0: number) => 1 + 0.06 * Math.max(0, 1 - (t - t0) / 0.25) * (t >= t0 ? 1 : 0);
const shake = (t: number, t0: number, d = 0.4, a = 10) => (t >= t0 && t < t0 + d ? Math.sin(t * 90) * a * (1 - (t - t0) / d) : 0);
const win = (t: number, a: number, b: number, f = 0.3) => ramp(t, a, a + f) * (1 - ramp(t, b, b + f));

/* 1. The prune: myth, nerves, pores, vessels, pucker */
export const V1: React.FC = () => {
  const t = useT();
  const A = 1 - ramp(t, 1.65, 1.95);
  const B = win(t, 1.7, 4.3);
  const Cc = win(t, 4.3, 11.45);
  const D = ramp(t, 11.45, 11.75);
  return (
    <Scene start={-0.6} end={15.35}>
      <Layer o={A}>
        <div style={center(190, { transform: `${bob(t, 0, 6)} rotate(${Math.sin(t * 1.4) * 2}deg)` })}>
          <Hand w={500} wrinkle={1} wet={1} t={t} id="h1" />
        </div>
        <div style={center(10, { transform: `scale(${punch(t, 0)})` })}>
          <Big size={104}>
            <Mark p={ramp(t, 0.1, 0.5)}>PRUNEY</Mark> FINGERS?
          </Big>
        </div>
        <Stamp t0={0.95} text="NOT WATERLOGGED" size={64} rot={-8} style={{ left: 90, top: 690 }} />
      </Layer>
      <Layer o={B}>
        <div style={center(0, pop(t, 1.8))}>
          <Brain size={290} t={t} pulse={ramp(t, 2.0, 2.4)} />
        </div>
        <div style={abs(40, 40, pop(t, 2.3))}>
          <Pill size={32} bg={C.matcha}>
            nervous system
          </Pill>
        </div>
        <div style={center(250, { opacity: ramp(t, 1.9, 2.2), transform: bob(t, 1, 5) })}>
          <Hand w={420} wrinkle={ramp(t, 2.9, 3.8)} nerve={ramp(t, 2.1, 3.0)} t={t} id="h2" />
        </div>
        <Stamp t0={3.5} text="ON PURPOSE" size={70} rot={7} style={{ left: 420, top: 700 }} />
      </Layer>
      <Layer o={Cc}>
        <div style={center(10)}>
          <div style={{ position: "relative", width: 860, height: 90 }}>
            <div style={{ position: "absolute", inset: 0, opacity: 1 - ramp(t, 7.45, 7.7) }}>
              <Title size={58}>
                after a <Mark p={ramp(t, 4.9, 5.4)}>long soak</Mark>
              </Title>
            </div>
            <div style={{ position: "absolute", inset: 0, opacity: ramp(t, 7.55, 7.8) }}>
              <Title size={58}>
                nerves tell vessels to <Mark p={ramp(t, 10.7, 11.1)}>squeeze</Mark>
              </Title>
            </div>
          </div>
        </div>
        <div style={abs(20, 130, { opacity: ramp(t, 4.4, 4.8) })}>
          <SkinSection w={820} water={ramp(t, 5.5, 6.0)} nerve={ramp(t, 7.7, 8.5)} squeeze={ramp(t, 10.7, 11.3)} t={t} />
        </div>
        <div style={abs(30, 140, pop(t, 5.6))}>
          <Pill size={30} bg="#5E9F92">
            water
          </Pill>
        </div>
        <div style={abs(470, 330, pop(t, 6.7))}>
          <Pill size={30} bg={C.forest}>
            sweat pores
          </Pill>
        </div>
        <div style={abs(20, 560, pop(t, 7.9))}>
          <Pill size={32} bg={C.bananaDark} color={C.forest}>
            nerve signal ⚡
          </Pill>
        </div>
        <div style={abs(540, 560, pop(t, 9.3))}>
          <Pill size={32} bg={C.red}>
            blood vessels
          </Pill>
        </div>
        <div style={center(730, { ...pop(t, 10.75), transform: `${pop(t, 10.75).transform} translateX(${shake(t, 10.8, 0.4, 12)}px)` })}>
          <Pill size={52} bg={C.forest}>
            SQUEEZE
          </Pill>
        </div>
      </Layer>
      <Layer o={D}>
        <div style={center(10)}>
          <div style={{ position: "relative", width: 860, height: 90 }}>
            <div style={{ position: "absolute", inset: 0, opacity: 1 - ramp(t, 12.9, 13.15) }}>
              <Title size={60}>
                the pad <Mark p={ramp(t, 12.4, 12.9)}>shrinks</Mark>
              </Title>
            </div>
            <div style={{ position: "absolute", inset: 0, opacity: ramp(t, 13.0, 13.25) }}>
              <Title size={60}>
                the skin <Mark p={ramp(t, 14.0, 14.5)}>puckers</Mark>
              </Title>
            </div>
          </div>
        </div>
        <div style={abs(50, 120, { opacity: ramp(t, 11.5, 11.9) })}>
          <PadSide w={760} shrink={ramp(t, 12.2, 13.2)} t={t} />
        </div>
        <div style={abs(40, 560, { ...pop(t, 13.3), transform: `${pop(t, 13.3).transform} rotate(${-4 + Math.sin(t * 1.6) * 2}deg)` })}>
          <Fingertip size={250} wrinkle={ramp(t, 13.9, 14.8)} t={t} id="ft1" seed={5} />
        </div>
        <div style={abs(360, 600, slide(t, 12.45, 1))}>
          <Pill size={34} bg={C.matcha}>
            less volume underneath
          </Pill>
        </div>
        <div style={abs(420, 720, { ...pop(t, 14.66), transform: `${pop(t, 14.66).transform} scale(${punch(t, 14.7)})` })}>
          <Pill size={56} bg={C.forest}>
            RIDGES!
          </Pill>
        </div>
      </Layer>
    </Scene>
  );
};

/* 2. The proof: damaged nerve, soak test */
export const V2: React.FC = () => {
  const t = useT();
  const A = 1 - ramp(t, 16.35, 16.6);
  const B = win(t, 16.4, 20.2);
  const Cc = ramp(t, 20.2, 20.5);
  return (
    <Scene start={15.35} end={24.0}>
      <Layer o={A}>
        <div style={center(120, pop(t, 15.45))}>
          <Big size={110}>
            HERE'S THE
            <br />
            <Mark p={ramp(t, 15.8, 16.2)}>PROOF</Mark>
          </Big>
        </div>
        <div style={center(420, { transform: `rotate(${Math.sin(t * 3) * 10}deg) translateX(${Math.sin(t * 2) * 30}px)`, opacity: ramp(t, 15.5, 15.8) })}>
          <Magnifier size={320} />
        </div>
      </Layer>
      <Layer o={B}>
        <div style={center(0, pop(t, 16.5))}>
          <Title size={56}>
            what <Mark p={ramp(t, 16.9, 17.4)}>doctors noticed</Mark>
          </Title>
        </div>
        <div style={abs(40, 100, pop(t, 16.8))}>
          <Pill size={30} bg={C.matcha}>
            healthy nerve
          </Pill>
        </div>
        <div style={abs(480, 100, pop(t, 18.0))}>
          <Pill size={30} bg={C.red}>
            damaged nerve
          </Pill>
        </div>
        <div style={abs(0, 170, { opacity: ramp(t, 16.6, 16.9), transform: bob(t, 0, 5) })}>
          <Hand w={400} wrinkle={ramp(t, 18.6, 19.4)} nerve={ramp(t, 16.8, 17.6)} t={t} id="h3" />
        </div>
        <div style={abs(440, 170, { opacity: ramp(t, 17.8, 18.1), transform: bob(t, 2, 5) })}>
          <Hand w={400} wrinkle={0} nerve={ramp(t, 18.0, 18.8)} broken t={t} id="h4" />
        </div>
        <div style={abs(110, 740, pop(t, 19.0))}>
          <Pill size={34} bg={C.forest}>
            wrinkles ✓
          </Pill>
        </div>
        <Stamp t0={19.4} text="NO WRINKLES" size={58} rot={-6} style={{ left: 450, top: 730 }} />
      </Layer>
      <Layer o={Cc}>
        <div style={center(0, pop(t, 20.35))}>
          <Title size={58}>
            the <Mark p={ramp(t, 21.5, 22.0)}>soak test</Mark>
          </Title>
        </div>
        <div style={abs(30, 130, { opacity: ramp(t, 20.3, 20.6) })}>
          <SoakTest w={800} dip={ramp(t, 20.6, 21.7)} check={ramp(t, 22.2, 23.4)} t={t} />
        </div>
        <div style={abs(60, 780, slide(t, 20.6))}>
          <Pill size={34} bg={C.matcha}>
            still used to check nerves
          </Pill>
        </div>
      </Layer>
    </Scene>
  );
};

/* 3. Why bother: marbles + tire treads */
export const V3: React.FC = () => {
  const t = useT();
  const A = 1 - ramp(t, 25.55, 25.8);
  const B = win(t, 25.6, 31.25);
  const Cc = ramp(t, 31.25, 31.55);
  return (
    <Scene start={24.0} end={35.6}>
      <Layer o={A}>
        <div style={center(60, { ...pop(t, 24.05), transform: `${pop(t, 24.05).transform} scale(${punch(t, 25.05)})` })}>
          <Big size={124}>
            WHY
            <br />
            <Mark p={ramp(t, 24.6, 25.1)}>BOTHER?</Mark>
          </Big>
        </div>
        {[
          [90, 380, 0],
          [640, 330, 1],
          [700, 640, 2],
          [60, 700, 3],
        ].map(([x, y, k]) => (
          <div key={k} style={abs(x, y, { ...pop(t, 24.3 + k * 0.15), transform: `${pop(t, 24.3 + k * 0.15).transform} ${bob(t, k, 14)} rotate(${(k % 2 ? 1 : -1) * 12}deg)` })}>
            <Big size={120} color={k % 2 ? C.matcha : C.forest}>
              ?
            </Big>
          </div>
        ))}
        <div style={center(370, { opacity: ramp(t, 24.2, 24.5), transform: `rotate(${Math.sin(t * 2) * 6}deg)` })}>
          <Fingertip size={260} wrinkle={1} t={t} id="ft2" seed={8} />
        </div>
      </Layer>
      <Layer o={B}>
        <div style={abs(0, 0, { display: "flex", gap: 14 })}>
          <div style={pop(t, 25.8)}>
            <Pill size={36} bg={C.forest}>
              Newcastle University
            </Pill>
          </div>
          <div style={pop(t, 26.6)}>
            <Pill size={36} bg={C.matcha}>
              2013
            </Pill>
          </div>
        </div>
        <div style={abs(690, -30, { ...pop(t, 26.3), transform: `${pop(t, 26.3).transform} rotate(${Math.sin(t * 2) * 6}deg)` })}>
          <Flask size={160} t={t} />
        </div>
        <div style={abs(20, 110, { opacity: ramp(t, 27.6, 27.9) })}>
          <Title size={44} style={{ textAlign: "left" }}>
            moving <Mark p={ramp(t, 29.4, 29.8)}>wet marbles</Mark>
          </Title>
        </div>
        <div style={abs(20, 190, { opacity: ramp(t, 27.7, 28.0) })}>
          <MarbleRace w={820} p={ramp(t, 28.0, 30.0)} t={t} />
        </div>
        <Stamp t0={30.02} text="12% FASTER" size={76} rot={-6} style={{ left: 190, top: 760 }} />
      </Layer>
      <Layer o={Cc}>
        <div style={center(0, pop(t, 31.35))}>
          <Title size={58}>
            like <Mark p={ramp(t, 32.4, 32.9)}>tire treads</Mark>
          </Title>
        </div>
        <div style={abs(0, 150, { ...pop(t, 31.6), transform: `${pop(t, 31.6).transform}` })}>
          <Tire size={400} t={t} />
        </div>
        <div style={abs(395, 300, pop(t, 32.6))}>
          <Big size={90} color={C.matcha}>
            =
          </Big>
        </div>
        <div style={abs(480, 110, { ...pop(t, 32.3), position: "absolute" })}>
          <div style={{ position: "relative", width: 340, height: 425 }}>
            <Fingertip size={340} wrinkle={1} t={t} id="ft3" seed={11} />
            {t > 33.3 && <Channels size={340} t={t} />}
          </div>
        </div>
        <div style={abs(80, 620, slide(t, 33.35))}>
          <Pill size={36} bg="#5E9F92">
            water channels away
          </Pill>
        </div>
        <Stamp t0={34.85} text="GRIP" size={96} rot={-8} style={{ left: 300, top: 740 }} />
      </Layer>
    </Scene>
  );
};

/* 4. Twist: same pattern every time */
export const V4: React.FC = () => {
  const t = useT();
  const card = 1 - ramp(t, 37.75, 38.0);
  const B = win(t, 37.85, 44.0);
  const Cc = win(t, 44.0, 46.55);
  const D = win(t, 46.55, 48.25);
  const E = win(t, 48.25, 51.35);
  const F = win(t, 51.35, 55.6);
  const G = ramp(t, 55.6, 55.9);
  return (
    <Scene start={35.6} end={60.05} push={0.05}>
      <Layer o={card}>
        <div style={{ position: "absolute", left: 0, top: 140, width: 860, height: 600, borderRadius: 40, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center", ...pop(t, 35.65, 0.35) }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 76, color: C.paper, textAlign: "center", lineHeight: 1.1, padding: 40 }}>
            But that's not even the <span style={{ color: C.banana, borderBottom: `6px solid ${C.banana}`, opacity: ramp(t, 36.45, 36.75) }}>strangest part…</span>
          </div>
        </div>
      </Layer>
      <Layer o={B}>
        <div style={abs(0, 0, { display: "flex", gap: 14 })}>
          <div style={pop(t, 38.07)}>
            <Pill size={40}>2025</Pill>
          </div>
          <div style={pop(t, 39.4)}>
            <Pill size={40} bg={C.matcha}>
              Binghamton University
            </Pill>
          </div>
        </div>
        <div style={abs(40, 150, { opacity: ramp(t, 38.0, 38.4), transform: `rotate(${-3 + Math.sin(t * 1.3) * 2}deg)` })}>
          <Fingertip size={380} wrinkle={ramp(t, 41.0, 41.9)} t={t} id="ft4" seed={21} />
        </div>
        <div style={abs(500, 180, { opacity: 1 - ramp(t, 42.35, 42.6), ...(t < 42.35 ? pop(t, 39.2) : {}) })}>
          <Camera size={300} flash={t > 41.9 ? Math.max(0, 1 - (t - 41.9) / 0.4) : 0} />
        </div>
        <div style={abs(530, 140, pop(t, 42.45))}>
          <Calendar size={260} flip={ramp(t, 43.2, 43.6)} />
        </div>
        <div style={abs(470, 470, pop(t, 41.05))}>
          <Pill size={32} bg="#5E9F92">
            soaked · 30 min
          </Pill>
        </div>
        <div style={abs(500, 580, pop(t, 43.45))}>
          <Pill size={40} bg={C.forest}>
            + 24 hours
          </Pill>
        </div>
        {t > 41.9 && t < 42.3 && <div style={{ position: "absolute", inset: -200, background: "#fff", opacity: 0.7 * (1 - (t - 41.9) / 0.4) }} />}
      </Layer>
      <Layer o={Cc}>
        <div style={center(0, pop(t, 44.1))}>
          <Title size={58}>
            the <Mark p={ramp(t, 45.7, 46.1)}>exact same</Mark> pattern
          </Title>
        </div>
        <div style={abs(10, 130, { ...pop(t, 44.15), transform: `${pop(t, 44.15).transform} rotate(-3deg)` })}>
          <Fingertip size={360} wrinkle={1} t={t} id="ft5" seed={21} />
        </div>
        <div style={abs(470, 130, { ...pop(t, 44.5), transform: `${pop(t, 44.5).transform} rotate(3deg)` })}>
          <Fingertip size={360} wrinkle={1} t={t} id="ft6" seed={21} />
        </div>
        <div style={abs(110, 110, pop(t, 44.3))}>
          <Pill size={30}>DAY 1</Pill>
        </div>
        <div style={abs(570, 110, pop(t, 44.6))}>
          <Pill size={30} bg={C.matcha}>
            DAY 2
          </Pill>
        </div>
        <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0 }}>
          {[250, 330, 410, 490].map((y, i) => (
            <line key={y} x1={330} y1={y} x2={530} y2={y} stroke={C.forest} strokeWidth={5} strokeDasharray="12 10" strokeLinecap="round" opacity={ramp(t, 45.0 + i * 0.15, 45.3 + i * 0.15)} />
          ))}
        </svg>
        <Stamp t0={45.73} text="SAME PATTERN" size={66} rot={-6} style={{ left: 170, top: 720 }} />
      </Layer>
      <Layer o={D}>
        <div style={center(0, pop(t, 46.65))}>
          <Title size={58}>
            vessels <Mark p={ramp(t, 47.4, 47.8)}>barely move</Mark>
          </Title>
        </div>
        <div style={center(110, { transform: `scale(${1 + 0.03 * Math.sin(t * 2)})` })}>
          <VesselMap size={440} p={ramp(t, 46.7, 47.5)} t={t} />
        </div>
      </Layer>
      <Layer o={E}>
        <div style={center(0, pop(t, 48.35))}>
          <Title size={58}>
            a <Mark p={ramp(t, 50.3, 50.8)}>second fingerprint</Mark>
          </Title>
        </div>
        <div style={abs(20, 150, { ...pop(t, 48.4), transform: `${pop(t, 48.4).transform} rotate(-4deg)` })}>
          <Fingertip size={340} wrinkle={1} t={t} id="ft7" seed={21} />
        </div>
        <div style={abs(385, 330, pop(t, 49.5))}>
          <Big size={90} color={C.matcha}>
            ≈
          </Big>
        </div>
        <div style={abs(490, 160, { ...pop(t, 50.2), transform: `${pop(t, 50.2).transform} rotate(4deg)` })}>
          <Fingerprint size={330} scan={ramp(t, 50.4, 51.3)} t={t} />
        </div>
        <div style={abs(80, 740, slide(t, 48.6))}>
          <Pill size={34} bg={C.forest}>
            your own prune pattern
          </Pill>
        </div>
      </Layer>
      <Layer o={F}>
        <div style={center(0, pop(t, 51.5))}>
          <Title size={56}>
            could one day help <Mark p={ramp(t, 53.5, 54.0)}>identify</Mark>
          </Title>
        </div>
        <div style={center(150, { ...pop(t, 51.7), transform: `${pop(t, 51.7).transform} rotate(${Math.sin(t * 1.4) * 2}deg)` })}>
          <IdCard w={700} match={ramp(t, 54.0, 54.4)} t={t} />
        </div>
        <div style={abs(500, 520, { opacity: ramp(t, 52.4, 52.7), transform: `translate(${Math.sin(t * 2.5) * 50}px, ${Math.cos(t * 2) * 20}px)` })}>
          <Magnifier size={240} />
        </div>
        <div style={abs(40, 640, slide(t, 52.8))}>
          <Pill size={34} bg={C.matcha}>
            people found in water
          </Pill>
        </div>
        <div style={abs(40, 750, pop(t, 53.8))}>
          <Pill size={30} bg={C.forest}>
            forensics
          </Pill>
        </div>
      </Layer>
      <Layer o={G}>
        <div style={center(0, pop(t, 55.75))}>
          <Title size={58}>
            next time in the <Mark p={ramp(t, 56.7, 57.1)}>bath</Mark>…
          </Title>
        </div>
        <div style={abs(20, 130, { opacity: ramp(t, 55.7, 56.0) })}>
          <Bathtub w={820} grab={ramp(t, 57.3, 58.9)} t={t} />
        </div>
        <Stamp t0={58.96} text="READY TO GRAB" size={66} rot={-6} style={{ left: 150, top: 780 }} />
      </Layer>
    </Scene>
  );
};

/* 5. End card */
export const V5: React.FC = () => {
  const t = useT();
  return (
    <Scene start={59.95} end={64.9}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, 60.0, 0.35) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.banana, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 61.2, 61.5) }}>
          follow for more body facts
          <br />
          you didn't know you needed
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 60) * 5))})`, opacity: ramp(t, 60.3, 60.6) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
