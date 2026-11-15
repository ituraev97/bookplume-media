import React from "react";
import { C, FONT, ramp, useT, Callout } from "./kit";
import { Facts, Stage, LogoMark } from "./Chrome16";
import { Plate } from "./Plates";
import { BP, Brainstem, EsoTube, JawGlands, K, SwallowDiagram, VocalFolds, clamp, lerp } from "./IllusSwallow";

const abs = (x: number, y: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: x, top: y, ...extra });
const pop = (t: number, t0: number, d = 0.3): React.CSSProperties => {
  const p = ramp(t, t0, t0 + d);
  return { opacity: p, transform: `scale(${0.6 + 0.4 * p + 0.08 * Math.sin(Math.min(1, p) * Math.PI)})` };
};
const Big: React.FC<{ size?: number; color?: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ size = 100, color = C.forest, children, style }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1.02, letterSpacing: -2, ...style }}>{children}</div>
);
const Mk: React.FC<{ p: number; children: React.ReactNode }> = ({ p, children }) => (
  <span style={{ background: `linear-gradient(${C.banana}, ${C.banana}) no-repeat 0 88% / ${p * 100}% 38%` }}>{children}</span>
);
const Layer: React.FC<{ o: number; children: React.ReactNode }> = ({ o, children }) => (o <= 0.001 ? null : <div style={{ position: "absolute", inset: 0, opacity: o }}>{children}</div>);
/** visible window helper: 1 inside [a,b] with short fades */
const win = (t: number, a: number, b: number) => ramp(t, a - 0.2, a + 0.2) * (1 - ramp(t, b - 0.2, b + 0.2));

const DW = 660; // diagram width on stage
const dk = DW / 800;
/** callout in diagram coordinates (viewBox 800x900) */
const DC: React.FC<{ t0: number; x: number; y: number; tx: number; ty: number; text: string; dark?: boolean }> = ({ t0, x, y, tx, ty, text, dark }) => (
  <Callout t0={t0} x={x * dk} y={y * dk} tx={tx * dk} ty={ty * dk} text={text} dark={dark} />
);

/** zoomed window onto the SwallowDiagram: vb box [x0,y0,x1] (height follows H) */
type DP = React.ComponentProps<typeof SwallowDiagram>;
const ZoomD: React.FC<{ x: number; y: number; W: number; H: number; box: [number, number, number]; p: DP; children?: React.ReactNode }> = ({ x, y, W, H, box, p, children }) => {
  const sc = W / (box[2] - box[0]);
  return (
    <div style={abs(x, y, { width: W, height: H, borderRadius: 36, overflow: "hidden", background: C.card, boxShadow: `0 0 0 4px ${C.line}, 0 18px 40px rgba(31,42,20,0.14)` })}>
      <div style={{ position: "absolute", left: -box[0] * sc, top: -box[1] * sc }}>
        <SwallowDiagram {...p} w={800 * sc} />
      </div>
      {children}
    </div>
  );
};
/** callout positioned in diagram coords inside a ZoomD */
const ZC: React.FC<{ box: [number, number, number]; W: number; t0: number; x: number; y: number; tx: number; ty: number; text: string; dark?: boolean }> = ({ box, W, t0, x, y, tx, ty, text, dark }) => {
  const sc = W / (box[2] - box[0]);
  return <Callout t0={t0} x={(x - box[0]) * sc} y={(y - box[1]) * sc} tx={tx} ty={ty} text={text} dark={dark} />;
};

const Note1918: React.FC<{ t0: number; name: string; x: number; y: number }> = ({ t0, name, x, y }) => {
  const t = useT();
  return (
    <div style={abs(x, y, { ...pop(t, t0), background: C.card, border: `3px dashed ${C.matcha}`, borderRadius: 20, padding: "10px 20px", fontFamily: FONT, fontWeight: 700, fontSize: 26, color: C.forest })}>
      1918 atlas name: <b>{name}</b>
    </div>
  );
};

/* Phase bar: oral | pharyngeal | esophageal; active = index lit */
export const PhaseBar: React.FC<{ active: number; x?: number; y?: number; w?: number; tags?: number; t0?: number; fs?: number }> = ({ active, x = 0, y = 0, w = 1000, tags = 1, t0 = -10, fs = 36 }) => {
  const t = useT();
  const P = [
    { n: "ORAL", sub: "voluntary · as long as you like", f: 1, col: C.matcha },
    { n: "PHARYNGEAL", sub: "reflex · ≈ 1 second", f: 1, col: C.red },
    { n: "ESOPHAGEAL", sub: "peristalsis · 4–8 s solids", f: 1.15, col: "#4F74B8" },
  ];
  const tot = P.reduce((a, p) => a + p.f, 0);
  return (
    <div style={abs(x, y, { width: w, display: "flex", gap: 14, fontFamily: FONT })}>
      {P.map((p, i) => {
        const on = i === active || active === 9;
        const a = ramp(t, t0 + i * 0.35, t0 + i * 0.35 + 0.3);
        return (
          <div key={i} style={{ flex: p.f / tot, opacity: a, transform: `translateY(${(1 - a) * 20}px) scale(${on && active !== 9 ? 1.04 : 1})` }}>
            <div style={{ background: on ? p.col : C.line, color: on ? C.paper : C.forest, borderRadius: 22, padding: "16px 12px", fontWeight: 800, fontSize: fs, textAlign: "center", whiteSpace: "nowrap", boxShadow: on ? "0 10px 0 rgba(31,42,20,0.18)" : "none" }}>
              {i + 1}. {p.n}
            </div>
            {tags > 0 && <div style={{ marginTop: 10, textAlign: "center", fontWeight: 700, fontSize: fs * 0.72, color: C.forest, opacity: on ? 1 : 0.55 }}>{p.sub}</div>}
          </div>
        );
      })}
    </div>
  );
};

/* the 4 things of the pharyngeal phase */
const FOUR = ["Nose closed", "Breathing paused", "Vocal folds shut", "Larynx up · epiglottis down"];
const Checklist: React.FC<{ times: number[]; x?: number; y?: number; w?: number; show?: number; cur?: number }> = ({ times, x = 1100, y = 20, w = 680, show = 0 }) => {
  const t = useT();
  return (
    <div style={abs(x, y, { width: w, fontFamily: FONT, display: "flex", flexDirection: "column", gap: 16 })}>
      {FOUR.map((s, i) => {
        const on = t >= times[i];
        const p = ramp(t, times[i], times[i] + 0.3);
        const vis = Math.max(ramp(t, show + i * 0.25, show + i * 0.25 + 0.3), 0);
        return (
          <div key={i} style={{ opacity: vis, display: "flex", alignItems: "center", gap: 20, background: on ? C.forest : C.card, color: on ? C.paper : C.forest, border: on ? "none" : `3px solid ${C.line}`, borderRadius: 26, padding: "18px 24px", fontWeight: 800, fontSize: 36, transform: `translateX(${(1 - vis) * 50}px)` }}>
            <div style={{ width: 56, height: 56, borderRadius: 28, background: on ? C.banana : C.line, color: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, transform: `scale(${1 + 0.25 * Math.sin(p * Math.PI)})` }}>
              {on ? "✓" : i + 1}
            </div>
            {s}
          </div>
        );
      })}
    </div>
  );
};

/* ================= INTRO 0.6 – 31.9 ================= */
export const SIntro: React.FC = () => {
  const t = useT();
  const a = 1 - ramp(t, 9.3, 9.7);
  const b2 = ramp(t, 9.3, 9.7) * (1 - ramp(t, 21.9, 22.3));
  const c = ramp(t, 21.9, 22.3);
  const jump = Math.max(0, Math.sin(clamp((t - 3.2) / 1.0) * Math.PI)) + Math.max(0, Math.sin(clamp((t - 6.6) / 1.0) * Math.PI));
  return (
    <Stage a={-1} b={31.7}>
      <Layer o={a}>
        <div style={abs(40, 0)}>
          <SwallowDiagram w={DW} t={t} b={-1} finger={ramp(t, 0.5, 1.4)} lift={jump} epi={jump} palate={jump} hl={t > 5.3 ? "larynx" : ""} />
        </div>
        <div style={abs(820, 30, { width: 960, ...pop(t, 0) })}>
          <Big size={96}>
            What happens when you <Mk p={ramp(t, 0.4, 1.3)}>swallow</Mk>
          </Big>
          <Big size={52} color={C.matcha} style={{ marginTop: 16 }}>
            second by second
          </Big>
        </div>
        <Facts
          x={820}
          y={330}
          w={820}
          items={[
            { t: 0.7, text: "Put 2 fingers on your Adam's apple. Swallow.", bg: C.forest },
            { t: 3.7, text: "Did it jump up?", big: "↑" },
            { t: 5.3, text: "that jump keeps food out of your lungs", bg: C.red },
          ]}
        />
      </Layer>
      <Layer o={b2}>
        <Plate src="plates/sagittal.png" aspect={0.7004} x={40} y={0} w={518} a={9.5} b={22.1} zoomFrom={[1.3, 0.45, 0.45]} zoomTo={[1.55, 0.42, 0.52]}
          labels={[{ x: 0.37, y: 0.47, text: "pharynx", t: 14.7, side: "l", hot: true }]} />
        <div style={abs(620, 20)}>
          <svg width={460} height={700} viewBox="0 0 460 700">
            <path d="M30 120 C200 120 260 200 250 330" stroke={K.air} strokeWidth={18} fill="none" strokeLinecap="round" strokeDasharray={`${900 * ramp(t, 12.0, 13.5)} 900`} />
            <path d="M30 330 C160 320 220 300 250 330" stroke={K.bolus} strokeWidth={18} fill="none" strokeLinecap="round" strokeDasharray={`${900 * ramp(t, 12.6, 14.0)} 900`} />
            <path d="M250 330 L250 620" stroke={C.forest} strokeWidth={26} strokeLinecap="round" opacity={ramp(t, 13.6, 14.2)} />
            <text x={40} y={100} fontFamily={FONT} fontWeight={800} fontSize={40} fill={K.air} opacity={ramp(t, 12.0, 12.4)}>AIR</text>
            <text x={40} y={380} fontFamily={FONT} fontWeight={800} fontSize={40} fill={K.bolusD} opacity={ramp(t, 12.6, 13)}>FOOD</text>
            <text x={280} y={500} fontFamily={FONT} fontWeight={800} fontSize={34} fill={C.forest} opacity={ramp(t, 14.4, 14.8)}>same tube</text>
          </svg>
        </div>
        <div style={abs(1120, 40, { width: 660 })}>
          <Big size={58}>Air and food share <Mk p={ramp(t, 12.2, 13.2)}>one tube</Mk></Big>
        </div>
        <div style={abs(1120, 300, { width: 660, ...pop(t, 17.0) })}>
          <div style={{ background: C.red, color: C.paper, borderRadius: 30, padding: "24px 30px", fontFamily: FONT, fontWeight: 800, fontSize: 40, lineHeight: 1.2 }}>
            <div style={{ fontSize: 110, lineHeight: 1, color: C.banana }}>≈ 1 s</div>
            to close the wrong doors and open the right one
          </div>
        </div>
      </Layer>
      <Layer o={c}>
        <div style={abs(40, 0)}>
          <SwallowDiagram w={DW} t={t} b={lerp(0, 0.98, ramp(t, 22.6, 30.5))} palate={win(t, 24.6, 27.0)} epi={win(t, 24.6, 27.0)} lift={win(t, 24.6, 27.0)} folds={win(t, 24.6, 27.0)} ues={win(t, 25.8, 27.6)} wave={win(t, 23.0, 25.5)} />
        </div>
        <div style={abs(780, 30, { width: 1000 })}>
          <Big size={70}>One bite: <span style={{ color: C.matcha }}>teeth → stomach</span></Big>
        </div>
        <PhaseBar active={t < 24.6 ? 0 : t < 27.6 ? 1 : 2} x={780} y={190} w={1000} t0={22.6} fs={28} />
        <div style={abs(780, 430, { width: 1000, display: "flex", gap: 30, alignItems: "center", ...pop(t, 26.8) })}>
          <div style={{ width: 110, height: 110, flex: "none", borderRadius: 55, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LogoMark size={82} />
          </div>
          <Big size={52}>Every muscle and nerve today = <Mk p={ramp(t, 28.4, 29.6)}>exam material</Mk></Big>
        </div>
      </Layer>
    </Stage>
  );
};

/* ================= 1. CHEWING 31.97 – 86.5 ================= */
export const SChew: React.FC = () => {
  const t = useT();
  const a = 1 - ramp(t, 74.3, 74.7);
  const show: Record<string, number> = {
    masseter: ramp(t, 36.6, 36.9) * (1 - ramp(t, 53.4, 53.8)),
    temporalis: ramp(t, 37.7, 38.0) * (1 - ramp(t, 53.4, 53.8)),
    medial: ramp(t, 38.6, 38.9) * (1 - ramp(t, 53.4, 53.8)),
    lateral: ramp(t, 40.6, 40.9) * (1 - ramp(t, 53.4, 53.8)),
    parotid: ramp(t, 57.2, 57.5),
    submandibular: ramp(t, 58.1, 58.4),
    sublingual: ramp(t, 59.3, 59.6),
    saliva: ramp(t, 60.4, 61),
  };
  const jw = 860, jk = jw / 900;
  return (
    <Stage a={34.3} b={86.3}>
      <Layer o={a}>
        <div style={abs(40, 20)}>
          <JawGlands w={jw} t={t} show={show} chew={ramp(t, 34.3, 35) * (1 - ramp(t, 52.5, 53.5)) + ramp(t, 74, 74.3)} />
          {t < 53.6 && (
            <>
              <Callout t0={36.6} x={440 * jk} y={470 * jk} tx={700 * jk} ty={690 * jk} text="masseter" />
              <Callout t0={37.7} x={420 * jk} y={150 * jk} tx={720 * jk} ty={60 * jk} text="temporalis" />
              <Callout t0={38.6} x={440 * jk} y={500 * jk} tx={170 * jk} ty={620 * jk} text="medial pterygoid (deep)" />
              <Callout t0={40.6} x={410 * jk} y={326 * jk} tx={130 * jk} ty={210 * jk} text="lateral pterygoid (deep)" dark={false} />
            </>
          )}
          {t >= 53.6 && (
            <>
              <Callout t0={57.2} x={330 * jk} y={400 * jk} tx={150 * jk} ty={560 * jk} text="parotid" dark={false} />
              <Callout t0={58.1} x={500 * jk} y={620 * jk} tx={720 * jk} ty={690 * jk} text="submandibular" dark={false} />
              <Callout t0={59.3} x={600 * jk} y={540 * jk} tx={790 * jk} ty={470 * jk} text="sublingual" dark={false} />
            </>
          )}
        </div>
        {t < 53.6 ? (
          <Facts
            x={1040}
            w={740}
            items={[
              { t: 35.4, text: "close the jaw: masseter · temporalis · medial pterygoid", bg: C.forest },
              { t: 40.2, text: "open + side to side: lateral pterygoid" },
              { t: 44.2, text: "the 4 muscles of mastication", big: "4" },
              { t: 49.5, text: "all 4 → CN V3, mandibular branch of the trigeminal", bg: C.red },
            ]}
          />
        ) : (
          <Facts
            x={1040}
            w={740}
            items={[
              { t: 53.7, text: "pairs of salivary glands", big: "3", bg: C.forest },
              { t: 60.2, text: "saliva a day", big: "1–1.5 L" },
              { t: 66.1, text: "mostly water (98–99.5%)" },
              { t: 69.0, text: "salivary amylase starts breaking down starch", bg: C.matcha },
            ]}
          />
        )}
      </Layer>
      <Layer o={1 - a}>
        <ZoomD x={20} y={0} W={800} H={740} box={[360, 220, 760]} p={{ t, b: 0, form: ramp(t, 76.5, 81.0), hl: t > 78 && t < 81.3 ? "tongue" : t > 81.3 ? "oral" : "" }}>
          <ZC box={[360, 220, 760]} W={800} t0={81.6} x={585} y={372} tx={560} ty={90} text="bolus" dark={false} />
        </ZoomD>
        <div style={abs(870, 40, { width: 900 })}>
          <Big size={54}>Lips + cheeks keep food between the teeth.</Big>
          <Big size={54} color={C.matcha} style={{ marginTop: 14 }}>The tongue gathers it into one soft, rounded mass…</Big>
        </div>
        <div style={abs(950, 380, { ...pop(t, 83.6) })}>
          <div style={{ background: C.banana, border: `6px solid ${C.forest}`, borderRadius: 34, padding: "18px 44px", fontFamily: FONT, fontWeight: 800, fontSize: 150, color: C.forest, transform: "rotate(-4deg)", boxShadow: "0 14px 0 rgba(31,42,20,0.2)" }}>
            BOLUS
          </div>
          <div style={{ marginTop: 26, fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.red }}>★ exam word</div>
        </div>
      </Layer>
    </Stage>
  );
};

/* ================= 2. THE PUSH 86.54 – 130.1 ================= */
export const SPush: React.FC = () => {
  const t = useT();
  const a = 1 - ramp(t, 107.1, 107.5);
  const wave = ramp(t, 101.5, 105.5);
  const b = lerp(0, BP.backMouth, ramp(t, 102.3, 106.6));
  return (
    <Stage a={89.0} b={129.9}>
      <Layer o={a}>
        <PhaseBar active={0} x={60} y={0} w={1680} t0={89.0} />
        <ZoomD x={60} y={170} W={760} H={570} box={[300, 230, 740]} p={{ t, b, wave, hl: t > 97.5 && t < 101.4 ? "oral" : t >= 101.4 ? "tongue" : "" }}>
          <ZC box={[300, 230, 740]} W={760} t0={96.6} x={560} y={331} tx={560} ty={60} text="hard palate" />
          <ZC box={[300, 230, 740]} W={760} t0={101.6} x={520} y={420} tx={560} ty={500} text="tongue" dark={false} />
        </ZoomD>
        <Facts
          x={880}
          y={200}
          w={900}
          items={[
            { t: 92.7, text: "you can hold food in your mouth as long as you like", bg: C.forest },
            { t: 95.6, text: "lips seal · tongue tip presses up on the hard palate" },
            { t: 101.5, text: "tongue rolls back like a wave → bolus to the back of the mouth", bg: C.matcha },
          ]}
        />
      </Layer>
      <Layer o={1 - a}>
        <Plate src="plates/tongue.png" aspect={1.0199} x={30} y={10} w={730} a={107.3} b={129.9} zoomFrom={[1.02, 0.5, 0.5]} zoomTo={[1.12, 0.45, 0.55]}
          labels={[
            { x: 0.2, y: 0.62, text: "genioglossus", t: 110.0, side: "r", hot: true },
            { x: 0.42, y: 0.58, text: "hyoglossus", t: 112.4, side: "r", hot: true },
            { x: 0.4, y: 0.42, text: "styloglossus", t: 114.3, side: "r", hot: true },
          ]} />
        <Facts
          x={1000}
          y={10}
          w={780}
          items={[
            { t: 107.4, text: "4 extrinsic tongue muscles steer it", big: "4", bg: C.forest },
            { t: 110.0, text: "genioglossus → pulls forward" },
            { t: 112.4, text: "hyoglossus → pulls down" },
            { t: 114.3, text: "styloglossus → up + back" },
            { t: 116.0, text: "those 3 → CN XII hypoglossal", bg: C.matcha },
            { t: 120.5, text: "palatoglossus → CN X vagus · the odd one out", bg: C.red },
            { t: 126.0, text: "★ classic exam question", bg: C.banana },
          ]}
        />
      </Layer>
    </Stage>
  );
};

/* ================= 3. POINT OF NO RETURN 130.09 – 167.1 ================= */
export const SNoReturn: React.FC = () => {
  const t = useT();
  const a = 1 - ramp(t, 138.3, 138.7);
  const c = ramp(t, 151.9, 152.3);
  return (
    <Stage a={132.6} b={166.9}>
      <Layer o={a}>
        <ZoomD x={20} y={0} W={760} H={740} box={[270, 250, 650]} p={{ t, b: lerp(BP.backMouth, BP.arch, ramp(t, 132.6, 135.0)), wave: 1, hl: t > 133.6 ? "arch" : "" }}>
          <ZC box={[270, 250, 650]} W={760} t0={134.0} x={396} y={428} tx={500} ty={640} text="palatoglossal arch" dark={false} />
        </ZoomD>
        <div style={abs(820, 60, { width: 960 })}>
          <Big size={64}>The bolus reaches the <Mk p={ramp(t, 134.0, 135.0)}>palatoglossal arch</Mk></Big>
        </div>
        <div style={abs(820, 330, { ...pop(t, 135.8) })}>
          <div style={{ background: C.red, color: C.paper, borderRadius: 30, padding: "26px 36px", fontFamily: FONT, fontWeight: 800, fontSize: 58 }}>⚡ the moment everything changes</div>
        </div>
      </Layer>
      <Layer o={(1 - a) * (1 - c)}>
        <div style={abs(30, 0)}>
          <Brainstem w={900} t={t} p={ramp(t, 139.0, 143.0)} center={ramp(t, 147.3, 148.0)} />
          <Callout t0={140.5} x={300} y={586} tx={170} ty={470} text="IX glossopharyngeal" dark={false} />
          <Callout t0={142.6} x={400} y={594} tx={720} ty={690} text="X vagus" />
          <Callout t0={145.7} x={445} y={436} tx={720} ty={60} text="nucleus of the solitary tract" />
          <Callout t0={148.3} x={520} y={560} tx={790} ty={580} text="swallowing center · medulla" dark={false} />
        </div>
        <Facts
          x={1060}
          y={30}
          w={720}
          items={[
            { t: 138.5, text: "sensory nerves fire in the back of the mouth + throat", bg: C.forest },
            { t: 144.5, text: "signal → brainstem (nucleus of the solitary tract)" },
            { t: 148.5, text: "the medulla's swallowing center takes over", bg: C.matcha },
          ]}
        />
      </Layer>
      <Layer o={c}>
        <PhaseBar active={1} x={60} y={0} w={1680} t0={157.8} />
        <div style={abs(60, 190, { ...pop(t, 152.2) })}>
          <Big size={110}>REFLEX</Big>
        </div>
        <div style={abs(60, 330, { ...pop(t, 154.3) })}>
          <div style={{ background: C.red, color: C.paper, borderRadius: 26, padding: "16px 30px", fontFamily: FONT, fontWeight: 800, fontSize: 50 }}>all or none · can't stop halfway</div>
        </div>
        <div style={abs(60, 470, { ...pop(t, 159.6) })}>
          <Big size={150} color={C.red}>≈ 1 s</Big>
        </div>
        <Layer o={1 - ramp(t, 161.6, 162.0)}>
          <ZoomD x={1000} y={170} W={760} H={560} box={[270, 220, 650]} p={{ t, b: BP.arch, wave: 1, hl: "pharynx" }}>
            <div style={abs(440, 400, { ...pop(t, 154.3), background: C.red, color: C.paper, borderRadius: 999, width: 120, height: 120, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 64 })}>⚡</div>
          </ZoomD>
        </Layer>
        <Checklist times={[999, 999, 999, 999]} x={1000} y={200} w={760} show={162.0} />
      </Layer>
    </Stage>
  );
};

/* ================= 4. SEALING THE AIRWAY 167.08 – 232.3 ================= */
export const SSeal: React.FC = () => {
  const t = useT();
  const CHK = [169.6, 181.6, 189.0, 199.0];
  const pal = ramp(t, 172.0, 175.5);
  const air = 1 - ramp(t, 182.0, 183.0);
  // sub-scenes
  const sA = win(t, 169.5, 188.85); // diagram: palate + apnea
  const sB = win(t, 188.85, 198.8); // vocal folds
  const sC = win(t, 198.8, 211.75); // hyoid plate
  const sD = win(t, 211.75, 223.7); // laryngeal inlet plate
  const sE = ramp(t, 223.5, 223.9); // all four
  return (
    <Stage a={169.5} b={232.1}>
      <Layer o={sA}>
        <ZoomD x={20} y={0} W={960} H={740} box={[262, 206, 720]} p={{ t, b: BP.arch, wave: 1, palate: pal, air, hl: t < 181.4 ? "palate" : "" }}>
          <ZC box={[262, 206, 720]} W={960} t0={170.0} x={392} y={350} tx={600} ty={660} text="soft palate + uvula" dark={false} />
          <ZC box={[262, 206, 720]} W={960} t0={170.8} x={318} y={260} tx={330} ty={60} text="nasopharynx" />
          {t > 183 && (
            <div style={abs(560, 70, { ...pop(t, 183.2) })}>
              <div style={{ background: K.air, color: "#FFFFFF", borderRadius: 24, padding: "14px 26px", fontFamily: FONT, fontWeight: 800, fontSize: 40 }}>breathing paused</div>
            </div>
          )}
        </ZoomD>
        <Checklist times={CHK} x={1020} y={0} w={740} show={169.0} />
        <div style={abs(1040, 460, { width: 740 })}>
          {t < 181.4 ? (
            <div style={{ ...pop(t, 172.0), background: C.card, border: `3px solid ${C.line}`, borderRadius: 26, padding: "18px 24px", fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.forest, lineHeight: 1.25 }}>
              levator + tensor veli palatini lift it → nasopharynx sealed
            </div>
          ) : (
            <div style={{ ...pop(t, 183.2), background: C.forest, borderRadius: 26, padding: "18px 24px", fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.paper, lineHeight: 1.2 }}>
              <span style={{ color: C.banana, fontSize: 60 }}>0.5–1.5 s</span>
              <br />
              swallowing apnea
            </div>
          )}
        </div>
      </Layer>
      <Layer o={sB}>
        <div style={abs(80, 10)}>
          <VocalFolds w={700} t={t} c={ramp(t, 191.5, 194.5)} />
          <Callout t0={190.9} x={270} y={420} tx={110} ty={250} text="vocal fold" />
          <Callout t0={192.5} x={230} y={560} tx={120} ty={680} text="arytenoid cartilage" dark={false} />
        </div>
        <div style={abs(1040, 640, { ...pop(t, 196.3) })}>
          <div style={{ background: C.forest, color: C.paper, borderRadius: 20, padding: "8px 20px", fontFamily: FONT, fontWeight: 800, fontSize: 30 }}>glottis shut = deepest door of the airway</div>
        </div>
        <Checklist times={CHK} x={1040} y={0} w={740} show={0} />
        <div style={abs(1040, 460, { width: 740, ...pop(t, 191.0), background: C.card, border: `3px solid ${C.line}`, borderRadius: 26, padding: "18px 24px", fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.forest, lineHeight: 1.25 })}>
          lateral cricoarytenoid + arytenoid muscles pull the folds together · recurrent laryngeal nerve (X)
        </div>
      </Layer>
      <Layer o={sC}>
        <Plate src="plates/hyoid.png" aspect={1.4883} x={20} y={30} w={840} a={198.9} b={211.7} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.03, 0.5, 0.5]}
          labels={[{ x: 0.42, y: 0.66, text: "hyoid bone · front view", t: 200.6, side: "r", hot: true }]} />
        <ZoomD x={900} y={0} W={420} H={440} box={[350, 470, 560]} p={{ t, b: BP.oro, wave: 1, palate: 1, folds: 1, lift: ramp(t, 200.5, 202.2), epi: 0, hl: "hyoid" }}>
          <div style={abs(300, 30, { ...pop(t, 200.6) })}>
            <Big size={110} color={C.red}>↑</Big>
          </div>
        </ZoomD>
        <div style={abs(1350, 0, { width: 430 })}>
          <Big size={44} style={{ ...pop(t, 200.6) }}>hyoid + larynx pulled up and forward</Big>
          <div style={{ ...pop(t, 209.4), marginTop: 26, background: C.banana, border: `4px solid ${C.forest}`, borderRadius: 22, padding: "12px 18px", fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.forest }}>= the jump under your fingers (thyroid cartilage)</div>
        </div>
        <div style={abs(900, 480, { width: 880, ...pop(t, 203.6), background: C.forest, borderRadius: 26, padding: "18px 26px", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.paper, lineHeight: 1.3 })}>
          suprahyoid muscles: <span style={{ color: C.banana }}>mylohyoid</span> (V3) · <span style={{ color: C.banana }}>geniohyoid</span> · <span style={{ color: C.banana }}>digastric</span> (V3 + VII)
        </div>
        <div style={abs(20, 620, { ...pop(t, 205.6), background: C.card, border: `3px dashed ${C.matcha}`, borderRadius: 20, padding: "10px 20px", fontFamily: FONT, fontWeight: 700, fontSize: 25, color: C.forest })}>
          1918 atlas labels in Latin: mylohyoideus, geniohyoideus, digastricus
        </div>
      </Layer>
      <Layer o={sD}>
        <Plate src="plates/laryngeal_inlet.png" aspect={1.1997} x={20} y={0} w={860} a={211.8} b={223.6} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.12, 0.5, 0.62]}
          labels={[
            { x: 0.513, y: 0.53, text: "epiglottis", t: 212.6, side: "r", hot: true },
            { x: 0.495, y: 0.67, text: "entrance to the larynx", t: 216.0, side: "r" },
            { x: 0.37, y: 0.81, text: "piriform recess", t: 220.6, side: "l", hot: true },
          ]} />
        <Note1918 t0={221.4} name="pyriform sinus" x={30} y={600} />
        <ZoomD x={910} y={0} W={420} H={440} box={[280, 470, 520]} p={{ t, b: lerp(BP.oro, BP.laryngo, ramp(t, 214, 220)), wave: 1, palate: 1, lift: 1, folds: 1, epi: ramp(t, 212.6, 215.0), hl: "epi" }} />
        <Facts
          x={910}
          y={470}
          w={870}
          items={[
            { t: 213.0, text: "epiglottis tips back + down like a lid", bg: C.forest },
            { t: 218.8, text: "food slides around it, through the 2 piriform recesses" },
          ]}
        />
        <div style={abs(1360, 0, { width: 420, ...pop(t, 212.8) })}>
          <Big size={44}>lid over the airway</Big>
        </div>
      </Layer>
      <Layer o={sE}>
        <div style={abs(40, 0)}>
          <SwallowDiagram w={DW} t={t} b={BP.laryngo} wave={1} palate={1} lift={1} folds={1} epi={1} air={0} hl={t > 228.3 ? "esoph" : ""} />
        </div>
        <Checklist times={CHK} x={1040} y={0} w={740} show={0} />
        <div style={abs(1040, 470, { ...pop(t, 228.3) })}>
          <div style={{ background: C.matcha, color: C.paper, borderRadius: 28, padding: "20px 30px", fontFamily: FONT, fontWeight: 800, fontSize: 44 }}>only open road → esophagus</div>
        </div>
      </Layer>
    </Stage>
  );
};

/* ================= 5. THROUGH THE GATE 232.32 – 288.6 ================= */
export const SGate: React.FC = () => {
  const t = useT();
  const a = 1 - ramp(t, 256.0, 256.4);
  const lift = 1 - ramp(t, 282.0, 283.5);
  const ues = ramp(t, 273.0, 274.5) * 0.35 + ramp(t, 275.6, 276.8) * 0.35 + ramp(t, 278.0, 279.5) * 0.3;
  const uesClose = 1 - ramp(t, 281.4, 282.2);
  const b = t < 280.3 ? lerp(BP.laryngo, BP.ues - 0.04, ramp(t, 258, 262)) : lerp(BP.ues - 0.04, BP.below + 0.08, ramp(t, 280.3, 281.6));
  return (
    <Stage a={234.8} b={288.4}>
      <Layer o={a}>
        <Plate src="plates/pharynx_muscles.png" aspect={0.659} x={60} y={0} w={488} a={234.8} b={256.2} zoomFrom={[1.0, 0.4, 0.5]} zoomTo={[1.12, 0.35, 0.6]}
          labels={[
            { x: 0.33, y: 0.5, text: "superior", t: 236.4, side: "r", hot: true },
            { x: 0.2, y: 0.66, text: "middle", t: 237.7, side: "r", hot: true },
            { x: 0.18, y: 0.88, text: "inferior", t: 238.9, side: "r", hot: true },
            { x: 0.23, y: 0.37, text: "stylopharyngeus", t: 251.0, side: "r" },
          ]} />
        <div style={abs(600, 60)}>
          <svg width={180} height={640} viewBox="0 0 180 640">
            {[0, 1, 2].map((i) => {
              const on = ramp(t, 236.4 + i * 1.2, 236.8 + i * 1.2);
              const w2 = (t * 1.6 + i * 0.33) % 1;
              return <rect key={i} x={50} y={30 + i * 200} width={80} height={170} rx={30} fill={K.muscle} opacity={0.25 + 0.75 * on * (0.6 + 0.4 * Math.sin(w2 * Math.PI * 2))} stroke={C.forest} strokeWidth={4} />;
            })}
            <path d="M90 20 L90 620" stroke={C.forest} strokeWidth={6} strokeDasharray="10 12" />
            <path d="M70 590 L90 625 L110 590" stroke={C.forest} strokeWidth={6} fill="none" />
            <circle cx={90} cy={30 + 580 * ((t * 0.5) % 1)} r={26} fill={K.bolus} stroke={C.forest} strokeWidth={4} opacity={ramp(t, 239.5, 240)} />
          </svg>
        </div>
        <Facts
          x={860}
          y={10}
          w={920}
          items={[
            { t: 235.2, text: "3 constrictors: superior · middle · inferior, squeeze top → bottom", bg: C.forest },
            { t: 242.2, text: "speed through the pharynx", big: "20–40 cm/s" },
            { t: 247.1, text: "most pharyngeal muscles → CN X vagus", bg: C.matcha },
            { t: 250.8, text: "exception: stylopharyngeus → CN IX glossopharyngeal", bg: C.red },
          ]}
        />
      </Layer>
      <Layer o={1 - a}>
        <ZoomD x={20} y={0} W={900} H={740} box={[210, 450, 610]} p={{ t, b, wave: 1, palate: lift, lift, folds: lift, epi: lift, air: ramp(t, 283.0, 284.0), ues: ues * uesClose, hl: t > 256.3 && t < 270 ? "ues" : "" }}>
          <ZC box={[210, 450, 610]} W={900} t0={256.5} x={364} y={696} tx={620} ty={700} text="upper esophageal sphincter" dark={false} />
          <ZC box={[210, 450, 610]} W={900} t0={258.0} x={330} y={540} tx={150} ty={60} text="pharynx" />
          <ZC box={[210, 450, 610]} W={900} t0={258.6} x={330} y={765} tx={160} ty={690} text="esophagus" />
          <ZC box={[210, 450, 610]} W={900} t0={259.2} x={401} y={610} tx={720} ty={200} text="larynx → trachea" />
        </ZoomD>
        {t < 271.3 ? (
          <Facts
            x={980}
            y={20}
            w={800}
            items={[
              { t: 256.3, text: "the gate: upper esophageal sphincter", bg: C.forest },
              { t: 260.0, text: "main muscle: cricopharyngeus (lowest part of the inferior constrictor)" },
              { t: 265.4, text: "at rest: squeezed shut → no air into the esophagus", bg: C.red },
            ]}
          />
        ) : (
          <Facts
            x={980}
            y={20}
            w={800}
            items={[
              { t: 271.4, text: "3 things open it", big: "3", bg: C.forest },
              { t: 273.0, text: "① larynx + hyoid pull it up and forward" },
              { t: 275.6, text: "② cricopharyngeus relaxes" },
              { t: 278.0, text: "③ the bolus pushes it open", bg: C.matcha },
            ]}
          />
        )}
        <div style={abs(980, 600, { ...pop(t, 284.0) })}>
          <div style={{ background: K.air, color: "#FFFFFF", borderRadius: 26, padding: "14px 30px", fontFamily: FONT, fontWeight: 800, fontSize: 40 }}>gate shut · you breathe again ✓</div>
        </div>
        <div style={abs(1560, 470, { ...pop(t, 285.9) })}>
          <div style={{ background: C.red, color: C.banana, borderRadius: 26, padding: "8px 26px", fontFamily: FONT, fontWeight: 800, fontSize: 64, transform: "rotate(-6deg)" }}>≈ 1 s</div>
        </div>
      </Layer>
    </Stage>
  );
};

/* ================= 6. DOWN THE ESOPHAGUS 288.58 – 349.0 ================= */
export const SEsophagus: React.FC = () => {
  const t = useT();
  const a = 1 - ramp(t, 302.3, 302.7);
  const th: [number, number, number] = [ramp(t, 304.7, 305.1), ramp(t, 306.9, 307.3), ramp(t, 308.4, 308.8)];
  const wave = ramp(t, 310.8, 311.6);
  const bx = t < 310.8 ? 0.08 : lerp(0.08, 0.93, ramp(t, 312.0, 332.0));
  const les = ramp(t, 337.4, 338.4) * (1 - ramp(t, 341.6, 342.6));
  const inSt = ramp(t, 338.0, 341.0);
  return (
    <Stage a={291.0} b={348.8}>
      <Layer o={a}>
        <Plate src="plates/esophagus.png" aspect={0.9045} x={40} y={0} w={680} a={291.0} b={302.5} zoomFrom={[1.25, 0.53, 0.3]} zoomTo={[1.25, 0.53, 0.75]}
          labels={[
            { x: 0.53, y: 0.36, text: "esophagus", t: 291.3, side: "r", hot: true },
          ]} />
        <Facts
          x={800}
          y={10}
          w={980}
          items={[
            { t: 291.0, text: "a muscular tube", big: "25 cm · 10 in", bg: C.forest },
            { t: 295.4, text: "behind the trachea, down through the chest" },
            { t: 299.0, text: "through the diaphragm at the esophageal hiatus", bg: C.matcha },
          ]}
        />
      </Layer>
      <Layer o={1 - a}>
        <div style={abs(40, -30)}>
          <EsoTube w={1720} t={t} bx={t > 302.5 ? bx : -1} thirds={th} wave={wave * (1 - inSt)} les={les} inStomach={inSt} labels={1} />
        </div>
        <div style={abs(60, 560, { width: 1700, display: "flex", gap: 24 })}>
          {[
            { t0: 311.0, txt: "PERISTALSIS", bg: C.forest },
            { t0: 316.0, txt: "circular: squeeze behind", bg: C.red },
            { t0: 318.6, txt: "longitudinal: shorten ahead", bg: C.matchaDark },
            { t0: 321.8, txt: "3–4 cm/s", bg: "#4F74B8" },
          ].map((x, i) => (
            <div key={i} style={{ ...pop(t, x.t0), background: x.bg, color: C.paper, borderRadius: 24, padding: "14px 26px", fontFamily: FONT, fontWeight: 800, fontSize: 38, whiteSpace: "nowrap" }}>{x.txt}</div>
          ))}
        </div>
        <div style={abs(60, 660, { width: 1700, display: "flex", gap: 24 })}>
          {[
            { t0: 325.4, txt: "solid bite: 4–8 s" },
            { t0: 329.5, txt: "liquids + very soft food: ~1 s" },
            { t0: 336.9, txt: "LES closes → keeps stomach acid down" },
          ].map((x, i) => (
            <div key={i} style={{ ...pop(t, x.t0), background: C.card, border: `3px solid ${C.line}`, color: C.forest, borderRadius: 24, padding: "12px 24px", fontFamily: FONT, fontWeight: 800, fontSize: 34, whiteSpace: "nowrap" }}>{x.txt}</div>
          ))}
        </div>
      </Layer>
    </Stage>
  );
};

/* ================= 7. EXAM CHEAT SHEET 348.98 – 400.8 ================= */
const NERVES = [
  { cn: "V", name: "trigeminal", job: "chewing + mylohyoid", t: 360.3 },
  { cn: "VII", name: "facial", job: "lips + part of digastric", t: 363.7 },
  { cn: "IX", name: "glossopharyngeal", job: "sensation + stylopharyngeus", t: 367.2 },
  { cn: "X", name: "vagus", job: "palate, pharynx, larynx", t: 371.5 },
  { cn: "XII", name: "hypoglossal", job: "tongue", t: 374.9 },
];
export const SCheat: React.FC = () => {
  const t = useT();
  const a = 1 - ramp(t, 357.5, 357.9);
  const b = ramp(t, 357.5, 357.9) * (1 - ramp(t, 387.8, 388.2));
  const c = ramp(t, 387.8, 388.2);
  return (
    <Stage a={351.4} b={400.6}>
      <Layer o={a}>
        <div style={abs(60, 40)}>
          <Big size={80}>3 phases</Big>
        </div>
        <PhaseBar active={t > 355.3 ? 0 : 9} x={60} y={200} w={1680} t0={351.4} />
        <div style={abs(60, 420, { ...pop(t, 355.4) })}>
          <div style={{ background: C.banana, border: `5px solid ${C.forest}`, borderRadius: 26, padding: "16px 30px", fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.forest }}>only the ORAL phase is voluntary</div>
        </div>
      </Layer>
      <Layer o={b}>
        <div style={abs(60, 10)}>
          <Big size={64}>5 cranial nerves do most of the work</Big>
        </div>
        <div style={abs(60, 130, { width: 1680, display: "flex", flexDirection: "column", gap: 14 })}>
          {NERVES.map((n, i) => {
            const p = ramp(t, n.t - 0.1, n.t + 0.25);
            const on = t >= n.t && (i === NERVES.length - 1 || t < NERVES[i + 1].t);
            return (
              <div key={i} style={{ opacity: p, transform: `translateX(${(1 - p) * 60}px)`, display: "flex", alignItems: "center", gap: 28, background: on ? C.forest : C.card, border: `3px solid ${on ? C.forest : C.line}`, borderRadius: 26, padding: "12px 26px", fontFamily: FONT, fontWeight: 800 }}>
                <div style={{ width: 130, fontSize: 64, color: on ? C.banana : C.red }}>{n.cn}</div>
                <div style={{ width: 520, fontSize: 48, color: on ? C.paper : C.forest }}>{n.name}</div>
                <div style={{ fontSize: 40, color: on ? C.paper : C.matchaDark }}>{n.job}</div>
              </div>
            );
          })}
        </div>
        {t > 377.2 && (
          <div style={abs(0, 0, { width: 1800, height: 740, background: "rgba(247,246,236,0.94)", borderRadius: 40, opacity: ramp(t, 377.2, 377.6) })}>
            <div style={abs(60, 40)}>
              <Big size={72}>2 odd ones out</Big>
            </div>
            {[
              { t0: 379.8, a: "palatoglossus", b: "only tongue muscle on X (vagus)" },
              { t0: 382.8, a: "stylopharyngeus", b: "only pharyngeal muscle on IX" },
            ].map((x, i) => (
              <div key={i} style={abs(60 + i * 860, 200, { width: 800, ...pop(t, x.t0), background: C.red, color: C.paper, borderRadius: 34, padding: "34px 36px", fontFamily: FONT, fontWeight: 800 })}>
                <div style={{ fontSize: 66, color: C.banana }}>{x.a}</div>
                <div style={{ fontSize: 44, marginTop: 14 }}>{x.b}</div>
              </div>
            ))}
          </div>
        )}
      </Layer>
      <Layer o={c}>
        <div style={abs(40, 0)}>
          <SwallowDiagram w={DW} t={t} b={-1} cross={ramp(t, 388.3, 389.3)} />
        </div>
        <div style={abs(820, 40, { width: 960 })}>
          <Big size={62}>Riskiest moment: the <Mk p={ramp(t, 389.3, 390.5)}>pharyngeal phase</Mk></Big>
          <Big size={44} color={C.matcha} style={{ marginTop: 18 }}>food and air cross paths</Big>
        </div>
        <div style={abs(820, 400, { ...pop(t, 393.7), width: 940, background: C.forest, color: C.paper, borderRadius: 30, padding: "24px 32px", fontFamily: FONT, fontWeight: 800, fontSize: 40, lineHeight: 1.25 })}>
          airway not closed in time → food or liquid enters the airway =
          <span style={{ color: C.banana, fontSize: 64, display: "block", marginTop: 8 }}>ASPIRATION</span>
        </div>
      </Layer>
    </Stage>
  );
};

/* ================= 8. QUICK QUIZ + OUTRO 400.78 – END ================= */
const QS = [
  { q: "Which flap tips down over the entrance to the larynx?", o: ["uvula", "epiglottis", "soft palate", "vocal fold"], a: 1, ask: 404.83, cd: 408.6, rev: 411.84, end: 413.3 },
  { q: "Which phase of swallowing is the only voluntary one?", o: ["oral", "pharyngeal", "esophageal"], a: 0, ask: 413.48, cd: 417.66, rev: 420.87, end: 422.4 },
  { q: "Which pharyngeal muscle is supplied by the glossopharyngeal nerve?", o: ["superior constrictor", "palatoglossus", "stylopharyngeus", "cricopharyngeus"], a: 2, ask: 422.51, cd: 427.55, rev: 430.82, end: 432.5 },
];
export const SQuiz: React.FC = () => {
  const t = useT();
  const outro = ramp(t, 432.5, 432.9);
  return (
    <Stage a={403.2} b={449.5}>
      <Layer o={1 - ramp(t, 404.6, 404.9)}>
        <div style={abs(0, 200, { width: 1800, textAlign: "center", ...pop(t, 403.3) })}>
          <Big size={130}>3 questions</Big>
          <Big size={56} color={C.matcha}>answer before the timer runs out</Big>
        </div>
      </Layer>
      {QS.map((Q, qi) => {
        const o = win(t, Q.ask, Q.end);
        if (o <= 0) return null;
        const rev = t >= Q.rev;
        const left = clamp((Q.rev - t) / (Q.rev - Q.cd));
        const secs = Math.ceil((Q.rev - t));
        return (
          <Layer key={qi} o={o}>
            <div style={abs(60, 10, { fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: C.red })}>QUESTION {qi + 1} / 3</div>
            <div style={abs(60, 70, { width: 1400 })}>
              <Big size={76}>{Q.q}</Big>
            </div>
            <div style={abs(60, 300, { width: 1400, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 })}>
              {Q.o.map((op, i) => {
                const good = rev && i === Q.a;
                const bad = rev && i !== Q.a;
                return (
                  <div key={i} style={{ ...pop(t, Q.ask + 1.0 + i * 0.25), background: good ? C.matcha : C.card, color: good ? C.paper : C.forest, border: `4px solid ${good ? C.matchaDark : C.line}`, opacity: bad ? 0.4 : pop(t, Q.ask + 1.0 + i * 0.25).opacity, borderRadius: 30, padding: "40px 36px", fontFamily: FONT, fontWeight: 800, fontSize: 60 }}>
                    {String.fromCharCode(65 + i)}. {op} {good ? "✓" : ""}
                  </div>
                );
              })}
            </div>
            <div style={abs(1500, 300)}>
              <svg width={280} height={280} viewBox="0 0 260 260" style={{ overflow: "visible" }}>
                <circle cx={130} cy={130} r={110} fill={rev ? C.matcha : C.card} stroke={C.line} strokeWidth={18} />
                {!rev && t >= Q.cd && <circle cx={130} cy={130} r={110} fill="none" stroke={C.red} strokeWidth={18} strokeDasharray={`${2 * Math.PI * 110 * left} 999`} transform="rotate(-90 130 130)" strokeLinecap="round" />}
                <text x={130} y={rev ? 160 : 166} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={rev ? 110 : 120} fill={rev ? C.paper : C.forest}>
                  {rev ? "✓" : t >= Q.cd ? Math.max(1, Math.min(3, secs)) : "?"}
                </text>
              </svg>
            </div>
          </Layer>
        );
      })}
      <Layer o={outro}>
        <div style={abs(40, 20, { width: 960 })}>
          <Big size={78}>How many did you get?</Big>
          <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              ["3/3", "exam ready", C.matcha],
              ["2/3", "almost there", C.forest],
              ["0–1", "rewatch the cheat sheet", C.red],
            ].map(([s, l, col], i) => (
              <div key={i} style={{ ...pop(t, 433.0 + i * 0.35), display: "flex", alignItems: "center", gap: 22, fontFamily: FONT, fontWeight: 800 }}>
                <div style={{ width: 170, background: col as string, color: C.paper, borderRadius: 22, padding: "14px 0", textAlign: "center", fontSize: 58 }}>{s}</div>
                <div style={{ fontSize: 54, color: C.forest }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ ...pop(t, 434.6), marginTop: 30, background: C.banana, border: `4px solid ${C.forest}`, borderRadius: 26, padding: "16px 26px", fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.forest, width: "fit-content" }}>💬 comment your score</div>
        </div>
        <div style={abs(1020, 30, { width: 760, ...pop(t, 436.0), background: C.forest, borderRadius: 36, padding: "32px 36px", fontFamily: FONT, fontWeight: 800, color: C.paper })}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 84, height: 84, borderRadius: 42, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LogoMark size={64} />
            </div>
            <div style={{ fontSize: 44 }}>Book Plume</div>
          </div>
          <div style={{ fontSize: 54, marginTop: 22, lineHeight: 1.12 }}>Anatomy flash cards for review on the go</div>
          <div style={{ fontSize: 34, marginTop: 16, color: C.banana }}>↓ link in the description</div>
        </div>
        <div style={abs(1020, 520, { ...pop(t, 441.9) })}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ background: C.red, color: "#FFFFFF", borderRadius: 18, padding: "18px 40px", fontFamily: FONT, fontWeight: 800, fontSize: 52, transform: `scale(${1 + 0.05 * Math.sin(t * 5)})` }}>SUBSCRIBE</div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.forest, width: 360 }}>which moment should we slow down next?</div>
          </div>
        </div>
      </Layer>
    </Stage>
  );
};
