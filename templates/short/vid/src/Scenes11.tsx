import React from "react";
import { C, FONT, Mark, Pill, Scene, Stamp, Title, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Arm, Cat, Clapper, Ghost, Mic, Mouse, Note, SkinFollicle, Snowflake, Toggle } from "./Illus11";

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


/* 1. The bump */
export const V1: React.FC = () => {
  const t = useT();
  const pull = ramp(t, 8.9, 9.7);
  return (
    <Scene start={-0.6} end={13.4}>
      <div style={center(0, { transform: `scale(${punch(t, 0)})` })}>
        <Big size={96}>
          <Mark p={ramp(t, 0.2, 0.7)}>GOOSEBUMPS?</Mark>
        </Big>
      </div>
      <div style={abs(30, 150, { opacity: ramp(t, 1.3, 1.8), transform: `scale(${0.9 + 0.1 * ramp(t, 1.3, 2.0)})` })}>
        <SkinFollicle w={800} pull={pull} t={t} />
      </div>
      <div style={abs(40, 160, pop(t, 1.6))}>
        <Pill size={32}>1 hair</Pill>
      </div>
      <div style={abs(540, 470, pop(t, 3.6))}>
        <Pill size={32} bg={C.red}>
          1 tiny muscle
        </Pill>
      </div>
      <div style={abs(500, 560, pop(t, 4.4))}>
        <Pill size={30} bg={C.forest}>
          arrector pili
        </Pill>
      </div>
      <div style={abs(30, 720, { display: "flex", gap: 30, alignItems: "center" })}>
        <div style={pop(t, 6.0)}>
          <Snowflake size={130} t={t} />
        </div>
        <div style={pop(t, 6.85)}>
          <Ghost size={130} t={t} />
        </div>
        <div style={pop(t, 8.0)}>
          <Pill size={36} bg={C.red}>
            nerves: PULL!
          </Pill>
        </div>
      </div>
      <div style={abs(300, 850, { ...pop(t, 12.3), transform: `${pop(t, 12.3).transform} scale(${punch(t, 12.3)})` })}>
        <Pill size={44} bg={C.matcha}>
          = goosebump
        </Pill>
      </div>
    </Scene>
  );
};

/* 2. Fur logic */
export const V2: React.FC = () => {
  const t = useT();
  const human = ramp(t, 20.1, 20.4);
  return (
    <Scene start={13.4} end={25.9}>
      <Layer o={1 - human}>
        <div style={center(0, pop(t, 13.5))}>
          <Title size={62}>
            for a furry animal: <Mark p={ramp(t, 14.6, 15.1)}>genius</Mark>
          </Title>
        </div>
        <div style={abs(130, 170)}>
          <Cat size={620} puff={ramp(t, 15.4, 16.2) * 0.6 + 0.4 * ramp(t, 18.5, 18.9)} t={t} />
        </div>
        <div style={abs(40, 700, slide(t, 16.0))}>
          <Pill size={36} bg="#E8903A">
            traps warm air
          </Pill>
        </div>
        <div style={abs(480, 700, slide(t, 19.2))}>
          <Pill size={36}>looks BIGGER</Pill>
        </div>
      </Layer>
      <Layer o={human}>
        <div style={center(0, pop(t, 20.3))}>
          <Title size={62}>
            you? <Mark p={ramp(t, 21.0, 21.5)}>not much fur</Mark>
          </Title>
        </div>
        <div style={abs(70, 200)}>
          <Arm w={720} up={ramp(t, 21.5, 22.3)} />
        </div>
        <div style={center(560, pop(t, 22.8))}>
          <Pill size={42} bg={C.red}>
            does almost nothing
          </Pill>
        </div>
        <Stamp t0={24.3} text="LEFTOVER" size={86} rot={-8} style={{ left: 220, top: 680 }} />
      </Layer>
    </Scene>
  );
};

/* 3. Chills */
export const V3: React.FC = () => {
  const t = useT();
  return (
    <Scene start={25.9} end={32.2}>
      <div style={center(0, pop(t, 26.0))}>
        <Title size={60}>
          and yet: <Mark p={ramp(t, 26.6, 27.1)}>chills</Mark>
        </Title>
      </div>
      <div style={abs(0, 150, { width: 860, display: "flex", justifyContent: "space-around" })}>
        {[
          [<Note size={170} />, "music", 27.3],
          [<Clapper size={170} t={t} />, "a movie scene", 28.1],
          [<Mic size={170} />, "a speech", 29.0],
        ].map(([el, l, t0], i) => (
          <div key={l as string} style={{ textAlign: "center", ...pop(t, t0 as number), transform: `${pop(t, t0 as number).transform} translateY(${Math.sin(t * 2.5 + i) * 8}px)` }}>
            {el}
            <div>
              <Pill size={28} bg={i % 2 ? C.matcha : C.forest}>
                {l as string}
              </Pill>
            </div>
          </div>
        ))}
      </div>
      <div style={abs(80, 470, { opacity: ramp(t, 29.6, 30.0) })}>
        <Arm w={700} up={ramp(t, 29.8, 30.6)} />
      </div>
      <div style={abs(40, 780, { display: "flex", gap: 16 })}>
        <div style={pop(t, 30.2)}>
          <Pill size={38}>same nerves</Pill>
        </div>
        <div style={pop(t, 31.05)}>
          <Pill size={38} bg={C.red}>
            same muscles
          </Pill>
        </div>
      </div>
    </Scene>
  );
};

/* 4. Twist: hair switch */
export const V4: React.FC = () => {
  const t = useT();
  const d = 1 - ramp(t, 34.3, 34.6);
  const mouse = ramp(t, 40.8, 41.1);
  const sw = ramp(t, 43.9, 44.2);
  return (
    <Scene start={32.2} end={47.7} push={0.05}>
      <Layer o={d}>
        <div style={{ position: "absolute", left: 0, top: 120, width: 860, height: 600, borderRadius: 40, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center", ...pop(t, 32.25, 0.35) }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 76, color: C.paper, textAlign: "center", lineHeight: 1.1, padding: 40 }}>
            But that's not even the <span style={{ color: C.banana, borderBottom: `6px solid ${C.banana}`, opacity: ramp(t, 33.0, 33.3) }}>strangest part…</span>
          </div>
        </div>
      </Layer>
      <Layer o={ramp(t, 34.4, 34.7) * (1 - mouse)}>
        <div style={abs(20, 0, { display: "flex", gap: 14 })}>
          <div style={pop(t, 34.6)}>
            <Pill size={40}>2020</Pill>
          </div>
          <div style={pop(t, 35.7)}>
            <Pill size={40} bg={C.red}>
              Harvard
            </Pill>
          </div>
          <div style={pop(t, 36.2)}>
            <Pill size={32} bg={C.matcha}>
              journal Cell
            </Pill>
          </div>
        </div>
        <div style={abs(30, 120)}>
          <SkinFollicle w={800} pull={0.6} nerve={ramp(t, 37.0, 38.0)} stem={ramp(t, 38.9, 39.6)} t={t} />
        </div>
        <div style={abs(560, 560, pop(t, 37.4))}>
          <Pill size={32} bg={C.bananaDark} color={C.forest}>
            the nerve
          </Pill>
        </div>
        <div style={abs(40, 640, pop(t, 39.5))}>
          <Pill size={36} bg={C.forest}>
            → stem cells that grow hair
          </Pill>
        </div>
      </Layer>
      <Layer o={mouse * (1 - sw)}>
        <div style={center(0, pop(t, 40.9))}>
          <Title size={60}>
            in <Mark p={ramp(t, 41.1, 41.6)}>mice</Mark>:
          </Title>
        </div>
        <div style={abs(150, 150)}>
          <Mouse size={560} hair={ramp(t, 42.6, 43.6)} t={t} />
        </div>
        <div style={center(600, pop(t, 42.8))}>
          <Pill size={44} bg={C.matcha}>
            hair growth wakes up
          </Pill>
        </div>
      </Layer>
      <Layer o={sw}>
        <div style={center(40, pop(t, 44.0))}>
          <Title size={64}>
            just a <span style={{ textDecoration: ramp(t, 45.6, 45.8) > 0.5 ? "line-through" : "none", textDecorationColor: C.red, textDecorationThickness: 8 }}>fossil</span>?
          </Title>
        </div>
        <div style={center(220, { transform: `scale(${1 + 0.05 * Math.max(0, 1 - (t - 46.8) / 0.3) * (t > 46.8 ? 1 : 0)})` })}>
          <Toggle size={420} on={ramp(t, 46.6, 46.95)} />
        </div>
        <div style={center(520, pop(t, 46.7))}>
          <div style={{ background: C.banana, border: `5px solid ${C.forest}`, borderRadius: 24, padding: "14px 30px", fontFamily: FONT, fontWeight: 800, fontSize: 52, whiteSpace: "nowrap", color: C.forest, boxShadow: `0 8px 0 ${C.forest}` }}>a HAIR-GROWTH SWITCH</div>
        </div>
      </Layer>
    </Scene>
  );
};

/* 5. End card */
export const V5: React.FC = () => {
  const t = useT();
  return (
    <Scene start={47.6} end={52.6}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, 47.65, 0.35) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.banana, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 48.6, 48.9) }}>
          follow for more body facts
          <br />
          you didn't know you needed
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 48) * 5))})`, opacity: ramp(t, 47.9, 48.2) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
