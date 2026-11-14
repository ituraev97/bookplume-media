import React from "react";
import { OffthreadVideo, Sequence, staticFile } from "remotion";
import { C, Card, FONT, Mark, Pill, Scene, Stamp, Title, ramp, useT } from "./kit";
import { ArmAtlas, BLUE, BRIGHT, Bars, Brain, DARK, Drop, Journal, Pencil, SkinSection, Vial, Wrist } from "./Illus2";

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

/* 1. Wrist */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={0} end={8.9}>
      <div style={abs(0, 40)}>
        <Wrist w={800} mag={ramp(t, 4.2, 4.8)} t={t} />
      </div>
      <div style={abs(30, 40, { opacity: ramp(t, 2.3, 2.7) })}>
        <Pill bg={BLUE} size={40}>
          blue?
        </Pill>
      </div>
      <Stamp t0={7.75} text="ALWAYS RED" size={64} rot={-8} style={{ left: 380, top: 760 }} />
    </Scene>
  );
};

/* 2. The myth */
export const V2: React.FC = () => {
  const t = useT();
  const p1 = ramp(t, 12.6, 13.0);
  const p2 = ramp(t, 14.3, 14.8);
  return (
    <Scene start={8.9} end={16.35}>
      <div style={center(20)}>
        <Title size={76} style={{ opacity: ramp(t, 8.95, 9.3) * (1 - ramp(t, 10.5, 10.8)) }}>
          So what's going on?
        </Title>
      </div>
      <div style={center(20, { opacity: ramp(t, 10.6, 10.9) })}>
        <Pill bg={C.forest} size={50} style={{ letterSpacing: 6 }}>
          THE MYTH
        </Pill>
      </div>
      <Card style={{ left: 30, top: 170, width: 800, height: 600 }}>
        <div style={abs(0, 40, { width: 800, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 36, color: C.forest, opacity: ramp(t, 12.2, 12.6) })}>
          "Blood is blue until it touches oxygen"
        </div>
        <div style={abs(70, 170, { opacity: p1, transform: `scale(${0.7 + 0.3 * p1})` })}>
          <Drop color={BLUE} size={210} />
        </div>
        <div style={abs(330, 250, { opacity: p2, fontFamily: FONT, fontWeight: 800, fontSize: 64, color: C.matcha })}>+O₂ →</div>
        <div style={abs(540, 170, { opacity: p2, transform: `scale(${0.7 + 0.3 * p2})` })}>
          <Drop color={BRIGHT} size={210} />
        </div>
        <Stamp t0={15.75} text="FALSE" size={100} rot={-8} style={{ left: 240, top: 430 }} />
      </Card>
    </Scene>
  );
};

/* 3. Red all the way */
export const V3: React.FC = () => {
  const t = useT();
  const a = ramp(t, 16.4, 17.0);
  const b = ramp(t, 18.9, 19.4);
  return (
    <Scene start={16.35} end={23.7}>
      <div style={abs(80, 40, { opacity: a })}>
        <Vial color={BRIGHT} h={560} fill={a} />
      </div>
      <div style={abs(80, 620, { width: 236, textAlign: "center", opacity: ramp(t, 17.6, 18.0) })}>
        <Pill size={30}>oxygen-rich</Pill>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest, marginTop: 10 }}>bright red</div>
      </div>
      <div style={abs(545, 40, { opacity: b })}>
        <Vial color={DARK} h={560} fill={b} />
      </div>
      <div style={abs(545, 620, { width: 236, textAlign: "center", opacity: ramp(t, 20.6, 21.0) })}>
        <Pill size={30}>oxygen-poor</Pill>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest, marginTop: 10 }}>dark red</div>
      </div>
      <div style={center(800, { opacity: ramp(t, 21.85, 22.2) })}>
        <Title size={54}>
          <Mark p={ramp(t, 22.0, 22.6)}>red</Mark> the whole way around
        </Title>
      </div>
    </Scene>
  );
};

/* 4. Trick of light */
export const V4: React.FC = () => {
  const t = useT();
  const redLbl = ramp(t, 29.6, 30.0);
  const blueLbl = ramp(t, 33.7, 34.1);
  return (
    <Scene start={23.7} end={37.95} push={0.02}>
      <div style={center(0)}>
        <Title size={64} style={{ opacity: ramp(t, 23.75, 24.1) }}>
          A <Mark p={ramp(t, 24.5, 25.0)}>trick of light</Mark>
        </Title>
      </div>
      <div style={abs(20, 250)}>
        <SkinSection
          w={820}
          pW={ramp(t, 25.5, 25.9)}
          pS={ramp(t, 26.4, 27.0)}
          pR={ramp(t, 29.7, 31.6)}
          pA={ramp(t, 32.4, 33.2)}
          pB={ramp(t, 33.8, 36.3)}
        />
      </div>
      <div style={abs(240, 150, { opacity: redLbl })}>
        <Pill bg={BRIGHT} size={30}>
          red: dives deep
        </Pill>
      </div>
      <div style={abs(520, 150, { opacity: blueLbl })}>
        <Pill bg={BLUE} size={30}>
          blue: bounces back
        </Pill>
      </div>
      <div style={abs(470, 850, { opacity: ramp(t, 32.4, 32.8) })}>
        <Pill bg={C.forest} size={30}>
          blood soaks up red
        </Pill>
      </div>
    </Scene>
  );
};

/* 5. Less red -> brain says blue */
export const V5: React.FC = () => {
  const t = useT();
  const less = ramp(t, 40.6, 41.3);
  return (
    <Scene start={37.95} end={45.35}>
      <div style={center(0)}>
        <Title size={52} style={{ opacity: ramp(t, 38.0, 38.4) }}>
          Light coming back from the skin
        </Title>
      </div>
      <div style={abs(30, 110)}>
        <Bars red={0.85} blue={0.45} label="skin around it" swatch="#E7B597" />
      </div>
      <div style={abs(470, 110)}>
        <Bars red={0.85 - 0.5 * less} blue={0.43} label="right above a vein" swatch={less > 0.5 ? "#B8A3A3" : "#E7B597"} />
      </div>
      <div style={center(730, { alignItems: "center", gap: 24, opacity: ramp(t, 42.8, 43.2) })}>
        <Brain size={150} />
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.forest }}>→</div>
        <div style={{ opacity: ramp(t, 44.5, 44.9), transform: `scale(${0.7 + 0.3 * ramp(t, 44.5, 44.9)})` }}>
          <Pill bg={BLUE} size={52}>
            "blue"
          </Pill>
        </div>
      </div>
    </Scene>
  );
};

/* 6. The study */
const FACTORS = [
  { t: 50.27, k: "depth", icon: "↧" },
  { t: 51.56, k: "width", icon: "↔" },
  { t: 52.76, k: "oxygen", icon: "O₂" },
  { t: 55.11, k: "perception", icon: "◉" },
];
export const V6: React.FC = () => {
  const t = useT();
  const j = ramp(t, 45.4, 45.9);
  return (
    <Scene start={45.35} end={56.05}>
      <div style={center(10, { opacity: j, transform: `translateY(${(1 - j) * 40}px) rotate(${-2 + 2 * j}deg)` })}>
        <Journal w={800} />
      </div>
      <div style={center(450, { opacity: ramp(t, 48.3, 48.7) })}>
        <Title size={46}>The color you see depends on:</Title>
      </div>
      <div style={abs(30, 540, { width: 800, display: "flex", flexWrap: "wrap", gap: 20 })}>
        {FACTORS.map((f) => {
          const p = ramp(t, f.t - 0.1, f.t + 0.25);
          return (
            <div
              key={f.k}
              style={{
                width: 390,
                height: 150,
                borderRadius: 28,
                background: C.card,
                border: `3px solid ${C.line}`,
                boxShadow: "0 10px 24px rgba(31,42,20,0.10)",
                display: "flex",
                alignItems: "center",
                gap: 22,
                padding: "0 26px",
                boxSizing: "border-box",
                opacity: p,
                transform: `scale(${0.85 + 0.15 * p})`,
              }}
            >
              <div style={{ width: 90, height: 90, borderRadius: 45, background: C.banana, border: `4px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest }}>
                {f.icon}
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.forest }}>{f.k}</div>
            </div>
          );
        })}
      </div>
    </Scene>
  );
};

/* 7. Open any anatomy book */
export const V7: React.FC = () => {
  const t = useT();
  const intro = 1 - ramp(t, 58.2, 58.5);
  return (
    <Scene start={56.05} end={66.15}>
      <div style={center(330, { opacity: ramp(t, 56.1, 56.5) * intro })}>
        <Title size={70}>
          But that's not even
          <br />
          the <Mark p={ramp(t, 56.9, 57.4)}>strangest</Mark> part…
        </Title>
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: ramp(t, 58.35, 58.8) }}>
        <Card style={{ left: 30, top: 10, width: 800, height: 740 }}>
          <div style={abs(20, 20)}>
            <ArmAtlas w={520} pA={ramp(t, 60.0, 60.6)} pV={ramp(t, 61.2, 61.8)} pN={0} />
          </div>
          <div style={abs(500, 230, { display: "flex", flexDirection: "column", gap: 26 })}>
            <div style={{ opacity: ramp(t, 60.0, 60.3) }}>
              <Pill bg="#C9302C" size={36}>
                arteries
              </Pill>
            </div>
            <div style={{ opacity: ramp(t, 61.2, 61.5) }}>
              <Pill bg={BLUE} size={36}>
                veins
              </Pill>
            </div>
          </div>
        </Card>
        <Stamp t0={64.3} text="NOT REAL" size={84} rot={-10} style={{ left: 180, top: 330 }} />
        <div style={center(800, { opacity: ramp(t, 65.2, 65.5) })}>
          <Pill bg={C.forest} size={46}>
            it's a <span style={{ color: C.banana }}>code</span>
          </Pill>
        </div>
      </div>
    </Scene>
  );
};

/* 8. 1700s */
export const V8: React.FC = () => {
  const t = useT();
  const year = Math.round(ramp(t, 79.3, 80.5, 1736, 2026));
  return (
    <Scene start={66.15} end={81.15} push={0.02}>
      <div style={abs(30, 0, { width: 800, display: "flex", justifyContent: "space-between", alignItems: "center", opacity: ramp(t, 66.3, 66.7) })}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 88, color: C.forest, letterSpacing: -2 }}>
          17<span style={{ color: C.matcha }}>00s</span>
        </div>
        <Pill bg={C.matcha} size={30}>
          printed anatomy
        </Pill>
      </div>
      <div
        style={abs(30, 130, {
          width: 470,
          height: 640,
          background: "#F1E2BE",
          border: "5px solid #5A4325",
          borderRadius: 10,
          boxShadow: "0 18px 40px rgba(31,42,20,0.18)",
          transform: "rotate(-2deg)",
          display: "flex",
          justifyContent: "center",
          paddingTop: 20,
          boxSizing: "border-box",
        })}
      >
        <ArmAtlas w={420} pA={ramp(t, 68.8, 69.5)} pV={ramp(t, 70.2, 70.9)} pN={ramp(t, 76.4, 77.1)} sepia />
      </div>
      <div style={abs(530, 180, { display: "flex", flexDirection: "column", gap: 22 })}>
        {[
          { t: 68.85, c: "#C9302C", k: "artery" },
          { t: 70.3, c: BLUE, k: "vein" },
          { t: 76.45, c: "#E8B923", k: "nerve" },
        ].map((r) => (
          <div key={r.k} style={{ display: "flex", alignItems: "center", gap: 14, opacity: ramp(t, r.t, r.t + 0.3) }}>
            <div style={{ width: 54, height: 54, borderRadius: 12, background: r.c, border: `4px solid ${C.forest}` }} />
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.forest }}>{r.k}</div>
          </div>
        ))}
      </div>
      <div style={abs(530, 470, { width: 300, opacity: ramp(t, 73.5, 73.9), fontFamily: FONT, fontWeight: 700, fontSize: 32, color: C.matcha, lineHeight: 1.2 })}>
        so students could tell them apart at a glance
      </div>
      <div style={center(800, { opacity: ramp(t, 78.4, 78.8), alignItems: "center", gap: 20 })}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64, color: C.forest }}>{year}</div>
        <Pill bg={C.forest} size={34}>
          still the code
        </Pill>
      </div>
    </Scene>
  );
};

/* 9. Color it yourself */
export const V9: React.FC = () => {
  const t = useT();
  const fill = ramp(t, 82.0, 84.6);
  const px = 380 - 150 * Math.sin(t * 5) * 0.4;
  const py = 200 + fill * 360;
  return (
    <Scene start={81.15} end={84.95}>
      <div style={center(0)}>
        <Title size={60} style={{ opacity: ramp(t, 81.2, 81.6) }}>
          <Mark p={ramp(t, 83.3, 83.8)}>Color it</Mark> yourself
        </Title>
      </div>
      <div style={abs(180, 110)}>
        <ArmAtlas w={500} pA={fill} pV={Math.max(0, fill * 1.2 - 0.2)} pN={Math.max(0, fill * 1.4 - 0.4)} />
      </div>
      <div style={abs(px, py, { transform: "rotate(-35deg)", transformOrigin: "0 0" })}>
        <Pencil color={fill < 0.4 ? "#C9302C" : fill < 0.75 ? BLUE : "#E8B923"} w={360} />
      </div>
    </Scene>
  );
};

/* 10. Product */
const LIVE: [number, number][] = [
  [58.35, 62.55],
  [84.95, 98.4],
];
export const liveAlpha = (t: number) =>
  LIVE.reduce((m, [a, b]) => Math.max(m, ramp(t, a, a + 0.3) * (1 - ramp(t, b - 0.05, b + 0.25))), 0);

/** Real footage of the book in hand, full-bleed, with a slight push so it never sits still */
const LiveClip: React.FC<{ a: number; b: number; src: string; children?: React.ReactNode }> = ({ a, b, src, children }) => {
  const t = useT();
  const al = ramp(t, a, a + 0.3) * (1 - ramp(t, b - 0.05, b + 0.25));
  const s = 1.04 + 0.05 * ramp(t, a, b);
  return (
    <Sequence from={Math.round(a * 30)} durationInFrames={Math.round((b - a + 0.3) * 30)} layout="none">
      <div style={{ position: "absolute", inset: 0, opacity: al, overflow: "hidden" }}>
        <OffthreadVideo src={staticFile(src)} muted style={{ width: 1080, height: 1920, objectFit: "cover", transform: `scale(${s})` }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 760, background: "linear-gradient(to bottom, rgba(31,42,20,0), rgba(31,42,20,0.55))" }} />
        {children}
      </div>
    </Sequence>
  );
};

/* Live 1: the real cover — arteries red, veins blue */
export const LiveCover: React.FC = () => {
  const t = useT();
  return (
    <LiveClip a={58.35} b={62.55} src="clip_cover.mp4">
      <div style={abs(70, 1170, { display: "flex", flexDirection: "column", gap: 18 })}>
        <div style={{ opacity: ramp(t, 60.0, 60.3), transform: `translateX(${(1 - ramp(t, 60.0, 60.3)) * -40}px)` }}>
          <Pill bg="#C9302C" size={40}>arteries: red</Pill>
        </div>
        <div style={{ opacity: ramp(t, 61.2, 61.5), transform: `translateX(${(1 - ramp(t, 61.2, 61.5)) * -40}px)` }}>
          <Pill bg={BLUE} size={40}>veins: blue</Pill>
        </div>
      </div>
    </LiveClip>
  );
};

/* Live 2: product — flipping real pages */
export const V10: React.FC = () => {
  const t = useT();
  const btn = ramp(t, 96.8, 97.2);
  const chips = [
    { t: 86.95, text: "200+ drawings" },
    { t: 88.85, text: "skeleton · nerves · lungs" },
    { t: 91.2, text: "heart & vessels" },
    { t: 92.85, text: "color key" },
    { t: 94.7, text: "key concepts on every page" },
  ];
  return (
    <LiveClip a={84.95} b={98.4} src="clip_pages.mp4">
      <div style={abs(70, 900, { width: 860, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 14 })}>
        {chips.map((c, i) => {
          const p = ramp(t, c.t - 0.1, c.t + 0.25);
          return (
            <div key={c.text} style={{ opacity: p, transform: `translateX(${(1 - p) * -40}px)` }}>
              <Pill bg={i % 2 ? C.matcha : C.forest} size={34}>
                <span style={{ color: C.banana, marginRight: 10 }}>✓</span>
                {c.text}
              </Pill>
            </div>
          );
        })}
      </div>
      <div style={abs(0, 1290, { width: 1080, display: "flex", justifyContent: "center", opacity: btn, transform: `translateY(${(1 - btn) * 30}px) scale(${1 + 0.03 * Math.max(0, Math.sin((t - 97.2) * 5)) * (t > 97.2 ? 1 : 0)})` })}>
        <div style={{ background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 46, padding: "20px 56px", borderRadius: 60, border: `5px solid ${C.forest}`, boxShadow: `0 10px 0 ${C.forest}`, letterSpacing: 2 }}>
          TAP THE LINK BELOW ↓
        </div>
      </div>
    </LiveClip>
  );
};
