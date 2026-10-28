import React from "react";
import { OffthreadVideo, Sequence, staticFile } from "remotion";
import { C, Card, FONT, Mark, Pill, Scene, Stamp, Title, ramp, useT } from "./kit";
import { Kidney, MiniLung } from "./Illus6";
import { Heart } from "./Illus";
import { Brain } from "./Illus2";
import { Calendar, Crossed, LIVER_D, LiverCut, Person, Scalpel, VasePanel } from "./Illus7";

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
  [0, 2.0],
  [46.3, 60.3],
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
    <LiveWrap a={0} b={2.0}>
      <Footage a={0} b={2.3} from={0} />
      <div style={abs(0, 1040, { width: 1080, display: "flex", justifyContent: "center" })}>
        <Q t={t} at={0} text={["WHICH ORGAN", "CAN GROW BACK?"]} />
      </div>
    </LiveWrap>
  );
};

/* 1. None? One. The liver */
export const V1: React.FC = () => {
  const t = useT();
  const tiles = 1 - ramp(t, 3.0, 3.3);
  const lv = ramp(t, 4.25, 4.6);
  const icons = [<Heart size={150} />, <Brain size={160} />, <Kidney size={150} />, <MiniLung size={150} />];
  return (
    <Scene start={1.8} end={8.6}>
      <div style={abs(0, 60, { width: 860, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 30, opacity: tiles })}>
        {icons.map((el, i) => (
          <Card key={i} style={{ position: "relative", width: 360, height: 300, ...pop(t, 1.8 + i * 0.12) }}>
            <div style={{ position: "absolute", left: 95, top: 50 }}>
              <Crossed p={ramp(t, 2.35 + i * 0.12, 2.75 + i * 0.12)}>{el}</Crossed>
            </div>
          </Card>
        ))}
      </div>
      <div style={center(80, { opacity: ramp(t, 3.0, 3.3) * (1 - lv) })}>
        <div style={{ width: 300, height: 300, borderRadius: 150, background: C.forest, color: C.banana, fontFamily: FONT, fontWeight: 800, fontSize: 200, display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${Math.sin(t * 4) * 6}deg)` }}>?</div>
      </div>
      <div style={abs(30, 60, { opacity: lv, transform: `scale(${0.7 + 0.3 * lv})` })}>
        <LiverCut w={800} id="v1" glow={ramp(t, 4.4, 4.8)} t={t} />
      </div>
      <div style={center(660, pop(t, 5.6))}>
        <Pill size={46}>largest internal organ</Pill>
      </div>
      <div style={center(780, pop(t, 7.45))}>
        <Pill size={46} bg={C.matcha}>
          ≈ 3 lb
        </Pill>
      </div>
    </Scene>
  );
};

/* 2. Cut & regrow, then the donor trick */
export const V2: React.FC = () => {
  const t = useT();
  const A = 1 - ramp(t, 12.1, 12.4);
  const cut = ramp(t, 8.75, 9.6);
  const fly = ramp(t, 15.6, 16.9);
  const rg = ramp(t, 19.3, 20.6);
  const recSwap = ramp(t, 19.1, 19.4);
  return (
    <Scene start={8.6} end={24.4}>
      <div style={{ opacity: A }}>
        <div style={abs(30, 80)}>
          <LiverCut w={800} id="v2a" cut={cut * (1 - ramp(t, 9.6, 9.9))} away={ramp(t, 9.7, 10.4)} regrow={ramp(t, 10.7, 11.9)} t={t} />
        </div>
        <div style={abs(330 + 0, 80 + 40 + 440 * cut - 30, { opacity: ramp(t, 8.7, 8.9) * (1 - ramp(t, 9.6, 9.8)), transform: "rotate(90deg)", transformOrigin: "0 0" })}>
          <Scalpel size={240} />
        </div>
        <div style={center(700, pop(t, 9.4))}>
          <Pill size={44}>surgeons remove a big part</Pill>
        </div>
        <div style={center(810, pop(t, 11.1))}>
          <Pill size={44} bg={C.matcha}>
            what's left grows back
          </Pill>
        </div>
      </div>
      <div style={{ opacity: 1 - A }}>
        <div style={center(0, pop(t, 12.3))}>
          <Pill size={44}>living donor transplant</Pill>
        </div>
        <div style={abs(30, 170, slide(t, 14.5))}>
          <Person h={540} tone="#F2C9B0">
            <LiverCut w={190} id="don" away={ramp(t, 15.6, 16.2)} regrow={rg} t={t} />
          </Person>
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <Pill size={30}>donor</Pill>
          </div>
        </div>
        <div style={abs(530, 170, slide(t, 17.0))}>
          <Person h={540} tone="#E9D6A6">
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 0, top: 0, opacity: ramp(t, 16.8, 16.95) * (1 - recSwap) }}>
                <LiverCut w={190} id="rec1" pieceOnly t={t} />
              </div>
              <div style={{ position: "absolute", left: 0, top: 0, opacity: recSwap }}>
                <LiverCut w={190} id="rec2" away={1} regrow={rg} t={t} />
              </div>
            </div>
          </Person>
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <Pill size={30} bg={C.matcha}>
              recipient
            </Pill>
          </div>
        </div>
        {fly > 0 && fly < 1 && (
          <div style={abs(130 + 490 * fly, 370 - Math.sin(fly * Math.PI) * 220, { transform: `rotate(${fly * 360}deg)` })}>
            <LiverCut w={190} id="fly" pieceOnly t={t} />
          </div>
        )}
        <div style={abs(330, 300, pop(t, 18.3))}>
          <Calendar size={200} label="2–3 mo" flip={ramp(t, 18.3, 18.9)} />
        </div>
        <div style={abs(0, 800, { width: 860, display: "flex", justifyContent: "center", gap: 14 })}>
          <div style={pop(t, 21.5)}>
            <Pill size={34}>2 people</Pill>
          </div>
          <div style={pop(t, 22.3)}>
            <Pill size={34} bg={C.matcha}>
              2 livers
            </Pill>
          </div>
          <div style={pop(t, 23.4)}>
            <Pill size={34} bg={C.red}>
              from 1
            </Pill>
          </div>
        </div>
      </div>
    </Scene>
  );
};

/* 3. Size, not shape */
const NEW_D = "M60 190 C50 110 150 70 270 72 C400 74 520 110 540 170 C556 230 470 270 400 300 C330 330 280 370 230 360 C150 340 70 280 60 190 Z";
export const V3: React.FC = () => {
  const t = useT();
  return (
    <Scene start={24.4} end={28.45}>
      <div style={abs(0, 20, { display: "flex", gap: 20 })}>
        {[
          { lbl: "before", d: LIVER_D, t0: 24.45, dash: false },
          { lbl: "after", d: NEW_D, t0: 25.2, dash: false },
        ].map((x) => (
          <Card key={x.lbl} style={{ position: "relative", width: 420, height: 420, ...pop(t, x.t0) }}>
            <svg width={420} height={330} viewBox="0 0 600 450" style={{ position: "absolute", top: 30 }}>
              {x.lbl === "after" && <path d={LIVER_D} fill="none" stroke={C.forest} strokeWidth={5} strokeDasharray="14 10" opacity={0.35} />}
              <path d={x.d} fill="#9B3F2F" stroke="#4E1910" strokeWidth={6} transform={`translate(300 220) scale(${1 + Math.sin(t * 2) * 0.015}) translate(-300 -220)`} />
            </svg>
            <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, textAlign: "center" }}>
              <Pill size={28} bg={x.lbl === "after" ? C.matcha : C.forest}>
                {x.lbl}
              </Pill>
            </div>
          </Card>
        ))}
      </div>
      <div style={abs(40, 500, { display: "flex", flexDirection: "column", gap: 18 })}>
        <div style={slide(t, 25.6)}>
          <Pill size={46} bg={C.red}>
            ✗ same old shape
          </Pill>
        </div>
        <div style={slide(t, 26.95)}>
          <Pill size={46}>
            <span style={{ color: C.banana }}>✓</span> same size
          </Pill>
        </div>
        <div style={slide(t, 27.55)}>
          <Pill size={46} bg={C.matcha}>
            <span style={{ color: C.banana }}>✓</span> same job
          </Pill>
        </div>
      </div>
    </Scene>
  );
};

/* 4. Twist: Prometheus */
export const V4: React.FC = () => {
  const t = useT();
  const d = 1 - ramp(t, 30.55, 30.85);
  const eat = ramp(t, 37.0, 37.7);
  const night = ramp(t, 38.1, 38.9);
  return (
    <Scene start={28.45} end={40.15} push={0.05}>
      <div style={{ opacity: d }}>
        <div style={{ position: "absolute", left: 0, top: 120, width: 860, height: 600, borderRadius: 40, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center", ...pop(t, 28.5, 0.35) }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 76, color: C.paper, textAlign: "center", lineHeight: 1.1, padding: 40 }}>
            But that's not even the <span style={{ color: C.banana, borderBottom: `6px solid ${C.banana}`, opacity: ramp(t, 29.2, 29.5) }}>strangest part…</span>
          </div>
        </div>
      </div>
      <div style={{ opacity: 1 - d }}>
        <div style={abs(20, 75)}>
          <VasePanel w={820} t={t} eagle={ramp(t, 36.0, 37.4)} night={night} regrow={1 - 0.8 * eat * (1 - ramp(t, 39.0, 39.7))} draw={ramp(t, 30.8, 31.3)} />
        </div>
        <div style={abs(40, 0, { display: "flex", gap: 14 })}>
          <div style={pop(t, 31.0)}>
            <Pill size={36}>~3,000 years ago</Pill>
          </div>
          <div style={pop(t, 33.95)}>
            <Pill size={36} bg={C.matcha}>
              Prometheus
            </Pill>
          </div>
        </div>
        <div style={abs(40, 740, { display: "flex", gap: 14 })}>
          <div style={pop(t, 37.3)}>
            <Pill size={38} bg={C.red}>
              every day: eaten
            </Pill>
          </div>
          <div style={pop(t, 39.1)}>
            <Pill size={38}>
              every night: <span style={{ color: C.banana }}>regrown</span>
            </Pill>
          </div>
        </div>
      </div>
    </Scene>
  );
};

/* 5. Did they know? */
export const V5: React.FC = () => {
  const t = useT();
  const fin = ramp(t, 44.4, 44.7);
  return (
    <Scene start={40.15} end={46.3}>
      <div style={{ opacity: 1 - fin }}>
        <div style={center(0, { opacity: ramp(t, 40.2, 40.5) })}>
          <Title size={70}>
            Did the <Mark p={ramp(t, 40.4, 40.9)}>Greeks</Mark> know?
          </Title>
        </div>
        <Card style={{ left: 20, top: 180, width: 470, height: 200, ...pop(t, 41.4) }}>
          <div style={abs(30, 40, { fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.forest, lineHeight: 1.1, width: 410 })}>"Maybe they saw it."</div>
        </Card>
        <Card style={{ left: 370, top: 420, width: 470, height: 200, ...pop(t, 42.2) }}>
          <div style={abs(30, 40, { fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.forest, lineHeight: 1.1, width: 410 })}>"It's just a myth."</div>
        </Card>
        <div style={center(690, pop(t, 43.25))}>
          <Pill size={52} bg={C.matcha}>
            coincidence?
          </Pill>
        </div>
      </div>
      <div style={{ opacity: fin }}>
        <div style={abs(30, 80, { transform: `scale(${0.8 + 0.2 * fin})` })}>
          <LiverCut w={800} id="v5" glow={1} t={t} />
        </div>
        <Stamp t0={45.2} text="RIGHT ORGAN" size={80} rot={-8} style={{ left: 170, top: 620 }} />
      </div>
    </Scene>
  );
};

/* 6. Product */
const CHIPS7 = [
  { t: 47.4, text: "digestive system" },
  { t: 48.85, text: "1 of 14 body systems" },
  { t: 50.5, text: "QuickStudy Anatomy Flash Cards" },
  { t: 52.65, text: "300 cards" },
  { t: 53.85, text: "each system its own color" },
];
export const LiveProduct: React.FC = () => {
  const t = useT();
  const btn = ramp(t, 55.65, 55.95);
  const loopQ = ramp(t, 58.2, 58.5);
  return (
    <LiveWrap a={46.3} b={60.3}>
      <Footage a={46.3} b={49.9} from={3.0} />
      <Footage a={49.9} b={60.6} from={6.6} rate={0.8} />
      <div style={abs(70, 760, { width: 860, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 14, opacity: 1 - loopQ })}>
        {CHIPS7.map((c, i) => (
          <div key={c.text} style={slide(t, c.t - 0.1)}>
            <Pill bg={i % 2 ? C.matcha : C.forest} size={36}>
              <span style={{ color: C.banana, marginRight: 10 }}>✓</span>
              {c.text}
            </Pill>
          </div>
        ))}
      </div>
      <div style={abs(0, 860, { width: 1080, display: "flex", justifyContent: "center", opacity: loopQ })}>
        <Q t={t} at={58.2} text={["WHICH ORGAN", "CAN GROW BACK?"]} />
      </div>
      <div style={abs(0, 1250, { width: 1080, display: "flex", justifyContent: "center", opacity: btn, transform: `translateY(${(1 - btn) * 30}px) scale(${1 + 0.035 * Math.max(0, Math.sin((t - 55.95) * 5)) * (t > 55.95 ? 1 : 0)})` })}>
        <div style={{ background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 46, padding: "20px 56px", borderRadius: 60, border: `5px solid ${C.forest}`, boxShadow: `0 10px 0 ${C.forest}`, letterSpacing: 2 }}>
          TAP THE CART BELOW ↓
        </div>
      </div>
    </LiveWrap>
  );
};
