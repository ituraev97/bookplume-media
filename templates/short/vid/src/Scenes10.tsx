import React from "react";
import { C, Card, FONT, Mark, Pill, Scene, Stamp, Title, ramp, useT } from "./kit";
import { Astronaut, Bed, DoorFrame, Earth, Figure, FormDoc, GravityArrows, LogoMark, Phone, RideSign, Sky, SpineStack } from "./Illus10";

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

/* 1. Hook: morning vs night, then the door frame */
export const V1: React.FC = () => {
  const t = useT();
  const a = 1 - ramp(t, 3.0, 3.3);
  return (
    <Scene start={-0.6} end={9.0}>
      <Layer o={a}>
        <div style={center(0)}>
          <Big size={84}>
            <Mark p={ramp(t, 0.3, 0.8)}>MORNING</Mark> vs NIGHT
          </Big>
        </div>
        <div style={abs(80, 150, { transform: `scale(${punch(t, 0)})` })}>
          <Sky size={110} t={t} />
        </div>
        <div style={abs(670, 150)}>
          <Sky size={110} t={t} night />
        </div>
        <div style={abs(60, 270)}>
          <Figure h={600} t={t} />
        </div>
        <div style={abs(530, 270, { opacity: ramp(t, 0.9, 1.3) })}>
          <Figure h={600} t={t} squash={ramp(t, 1.3, 2.2)} shirt={C.red} />
        </div>
        <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0 }}>
          <line x1={20} y1={272} x2={840} y2={272} stroke={C.bananaDark} strokeWidth={5} strokeDasharray="14 10" />
          <line x1={20} y1={272 + 24 * ramp(t, 1.3, 2.2)} x2={840} y2={272 + 24 * ramp(t, 1.3, 2.2)} stroke={C.red} strokeWidth={5} strokeDasharray="14 10" opacity={ramp(t, 1.3, 1.6)} />
        </svg>
        <div style={center(900, pop(t, 2.2))}>
          <Pill size={44} bg={C.red}>
            No, really.
          </Pill>
        </div>
      </Layer>
      <Layer o={ramp(t, 3.1, 3.4)}>
        <div style={abs(40, 20)}>
          <DoorFrame w={420} m1={ramp(t, 4.0, 4.5)} m2={ramp(t, 5.4, 5.9)} />
        </div>
        <div style={abs(500, 150, { display: "flex", flexDirection: "column", gap: 22 })}>
          <div style={slide(t, 4.0)}>
            <Pill size={38} bg={C.bananaDark} color={C.forest}>
              ☀ morning
            </Pill>
          </div>
          <div style={slide(t, 5.4)}>
            <Pill size={38} bg={C.red}>
              ☾ before bed
            </Pill>
          </div>
        </div>
        <div style={abs(480, 430, { ...pop(t, 6.9), transform: `${pop(t, 6.9).transform} scale(${punch(t, 6.9)})` })}>
          <div style={{ whiteSpace: "nowrap" }}>
            <Big size={150} color={C.red}>
              −1 cm
            </Big>
          </div>
        </div>
        <div style={abs(520, 650, pop(t, 7.8))}>
          <Pill size={40}>sometimes more</Pill>
        </div>
      </Layer>
    </Scene>
  );
};

/* 2. The squeeze */
export const V2: React.FC = () => {
  const t = useT();
  const sq = ramp(t, 18.3, 20.4);
  const sum = ramp(t, 24.0, 24.4);
  return (
    <Scene start={9.0} end={25.9}>
      <div style={abs(170, 80 + 30 * sq)}>
        <GravityArrows w={520} p={ramp(t, 14.4, 14.8) * (1 - ramp(t, 24.0, 24.3))} t={t} />
      </div>
      <div style={abs(170, 200, { transform: `scale(${1 + 0.25 * ramp(t, 21.0, 21.4) * (1 - ramp(t, 22.6, 22.9))})`, transformOrigin: "50% 40%" })}>
        <SpineStack w={520} squash={sq} drops={ramp(t, 18.3, 18.8) * (1 - ramp(t, 23.5, 24.0))} t={t} build={ramp(t, 9.9, 11.4)} />
      </div>
      <div style={abs(20, 220, pop(t, 10.6))}>
        <Pill size={34}>bones</Pill>
      </div>
      <div style={abs(20, 330, { ...pop(t, 12.0) })}>
        <Pill size={34} bg="#4F8FC8">
          cushions = discs
        </Pill>
      </div>
      <div style={abs(620, 230, { display: "flex", flexDirection: "column", gap: 16 })}>
        {[
          ["standing", 16.2],
          ["sitting", 16.88],
          ["walking", 17.47],
        ].map(([l, t0], i) => (
          <div key={l as string} style={slide(t, t0 as number)}>
            <Pill size={32} bg={i % 2 ? C.matcha : C.forest}>
              {l as string}
            </Pill>
          </div>
        ))}
      </div>
      <div style={abs(560, 470, pop(t, 18.9))}>
        <Pill size={32} bg="#4F8FC8">
          water squeezes out
        </Pill>
      </div>
      <div style={abs(610, 560, { ...pop(t, 22.8), transform: `${pop(t, 22.8).transform} scale(${punch(t, 22.8)})` })}>
        <Big size={150}>×23</Big>
      </div>
      <div style={abs(530, 740, { opacity: sum })}>
        <Pill size={44} bg={C.red}>
          = you shrink
        </Pill>
      </div>
      <Stamp t0={25.05} text="SHRINK" size={90} rot={-8} style={{ left: 200, top: 420 }} />
    </Scene>
  );
};

/* 3. Night refill */
export const V3: React.FC = () => {
  const t = useT();
  const fill = ramp(t, 29.3, 31.3);
  const day = ramp(t, 31.6, 32.0);
  return (
    <Scene start={25.9} end={33.8}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 860, height: 520, borderRadius: 36, background: day > 0 ? `rgba(242,209,78,${0.25 * day})` : "rgba(43,58,85,0.10)" }} />
      <div style={abs(660, 20)}>
        <div style={{ opacity: 1 - day }}>
          <Sky size={130} t={t} night />
        </div>
        <div style={{ position: "absolute", left: 0, top: 0, opacity: day }}>
          <Sky size={130} t={t} />
        </div>
      </div>
      <div style={abs(20, 160, pop(t, 25.95))}>
        <Bed w={780} t={t} />
      </div>
      <div style={abs(40, 560, slide(t, 27.2))}>
        <Pill size={36}>gravity stops pressing</Pill>
      </div>
      <div style={abs(40, 660, slide(t, 29.3))}>
        <Pill size={36} bg="#4F8FC8">
          discs soak water back up
        </Pill>
      </div>
      <div style={abs(620, 500, { transform: "scale(0.42)", transformOrigin: "0 0", opacity: ramp(t, 28.0, 28.4) })}>
        <SpineStack w={520} squash={1 - fill} drops={ramp(t, 29.3, 29.6) * (1 - ramp(t, 31.4, 31.8))} t={t} inward glow={0} />
      </div>
      <div style={abs(40, 780, pop(t, 32.4))}>
        <Pill size={44} bg={C.matcha}>
          ✓ back to full height
        </Pill>
      </div>
    </Scene>
  );
};

/* 4. Twist: space */
export const V4: React.FC = () => {
  const t = useT();
  const d = 1 - ramp(t, 35.8, 36.1);
  const home = ramp(t, 44.9, 45.3);
  return (
    <Scene start={33.8} end={48.6} push={0.05}>
      <Layer o={d}>
        <div style={{ position: "absolute", left: 0, top: 120, width: 860, height: 600, borderRadius: 40, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center", ...pop(t, 33.85, 0.35) }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 76, color: C.paper, textAlign: "center", lineHeight: 1.1, padding: 40 }}>
            But that's not even the <span style={{ color: C.banana, borderBottom: `6px solid ${C.banana}`, opacity: ramp(t, 34.6, 34.9) }}>strangest part…</span>
          </div>
        </div>
      </Layer>
      <Layer o={ramp(t, 35.9, 36.2) * (1 - home)}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 860, height: 940, borderRadius: 40, background: "#14203A", overflow: "hidden" }}>
          <svg width={860} height={940} style={{ position: "absolute" }}>
            {Array.from({ length: 60 }, (_, i) => (
              <circle key={i} cx={(i * 137) % 860} cy={(i * 251) % 700} r={1.5 + (i % 3)} fill="#FFFFFF" opacity={0.4 + 0.5 * Math.abs(Math.sin(t * 2 + i))} />
            ))}
          </svg>
          <div style={abs(-70, 640)}>
            <Earth w={1000} t={t} />
          </div>
          <div style={abs(230, 90 + Math.sin(t * 1.3) * 18)}>
            <Astronaut size={380} t={t} stretch={ramp(t, 37.9, 40.0)} />
          </div>
          <div style={abs(30, 40, pop(t, 38.9))}>
            <Big size={150} color={C.banana}>
              +3%
            </Big>
          </div>
          <div style={abs(600, 60, pop(t, 41.3))}>
            <Pill size={44} bg={C.banana} color={C.forest}>
              ≈ 5 cm
            </Pill>
          </div>
          <div style={abs(30, 560, pop(t, 43.35))}>
            <Pill size={38} bg={C.paper} color={C.forest}>
              NASA plans for it
            </Pill>
          </div>
        </div>
      </Layer>
      <Layer o={home}>
        <div style={center(20, pop(t, 45.0))}>
          <Title size={62}>
            back on <Mark p={ramp(t, 45.3, 45.8)}>Earth</Mark>
          </Title>
        </div>
        <div style={abs(300, 140)}>
          <Figure h={620} t={t} squash={ramp(t, 47.2, 48.0)} shirt="#F4F4F0" />
        </div>
        <div style={center(800, pop(t, 46.2))}>
          <Pill size={44}>a few months → shrink right back</Pill>
        </div>
      </Layer>
    </Scene>
  );
};

/* 5. Pro tip + follow */
export const V5: React.FC = () => {
  const t = useT();
  const end = ramp(t, 54.6, 54.9);
  return (
    <Scene start={48.6} end={59.6}>
      <Layer o={1 - end}>
        <div style={center(0, pop(t, 48.7))}>
          <Title size={58}>need to be measured?</Title>
        </div>
        <div style={abs(10, 130, { display: "flex", gap: 20, alignItems: "flex-end" })}>
          {[
            [<FormDoc size={220} />, "a form", 50.3],
            [<RideSign size={200} />, "a ride", 51.15],
            [<Phone size={200} t={t} />, "a dating profile", 51.95],
          ].map(([el, l, t0], i) => (
            <Card key={l as string} style={{ position: "relative", width: 270, height: 470, ...pop(t, t0 as number) }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: 30, display: "flex", justifyContent: "center", transform: `translateY(${Math.sin(t * 2 + i) * 6}px)` }}>{el}</div>
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 20, textAlign: "center" }}>
                <Pill size={26} bg={i % 2 ? C.matcha : C.forest}>
                  {l as string}
                </Pill>
              </div>
            </Card>
          ))}
        </div>
        <div style={abs(0, 660, { width: 860, display: "flex", justifyContent: "center", alignItems: "center", gap: 20, ...pop(t, 53.1) })}>
          <Sky size={120} t={t} />
          <div style={{ background: C.banana, border: `5px solid ${C.forest}`, borderRadius: 24, padding: "14px 30px", fontFamily: FONT, fontWeight: 800, fontSize: 44, whiteSpace: "nowrap", color: C.forest, boxShadow: `0 8px 0 ${C.forest}` }}>MEASURE IN THE MORNING</div>
        </div>
      </Layer>
      <Layer o={end}>
        <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, 54.65, 0.35) }}>
          <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
            <LogoMark size={140} />
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.banana, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 55.6, 55.9) }}>
            follow for more body facts
            <br />
            you didn't know you needed
          </div>
          <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 55) * 5))})`, opacity: ramp(t, 54.9, 55.2) }}>
            + FOLLOW
          </div>
        </div>
      </Layer>
    </Scene>
  );
};
