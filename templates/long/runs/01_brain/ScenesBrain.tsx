import React from "react";
import { C, FONT, ramp, useT } from "./kit";
import { Facts, Stage, LogoMark } from "./Chrome16";
import { Plate } from "./Plates";
import { BrainMap, Sagittal, TopView, Folds, Eye, Sound, StudyCard, LOBE_COL } from "./IllusBrain";

const abs = (x: number, y: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: x, top: y, ...extra });
const pop = (t: number, t0: number, d = 0.3): React.CSSProperties => {
  const p = ramp(t, t0, t0 + d);
  return { opacity: p, transform: `scale(${0.6 + 0.4 * p + 0.08 * Math.sin(Math.min(1, p) * Math.PI)})` };
};
const Big: React.FC<{ size?: number; color?: string; children: React.ReactNode }> = ({ size = 100, color = C.forest, children }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1.02, letterSpacing: -2 }}>{children}</div>
);
const Mk: React.FC<{ p: number; children: React.ReactNode }> = ({ p, children }) => (
  <span style={{ background: `linear-gradient(${C.banana}, ${C.banana}) no-repeat 0 88% / ${p * 100}% 38%` }}>{children}</span>
);
/** cross-fading layer between a and b (inclusive fade 0.4 s) */
const Seg: React.FC<{ t: number; a: number; b: number; children: React.ReactNode }> = ({ t, a, b, children }) => {
  const o = ramp(t, a, a + 0.4) * (1 - ramp(t, b - 0.2, b + 0.2));
  if (o <= 0.001) return null;
  return <div style={{ position: "absolute", inset: 0, opacity: o, transform: `translateY(${(1 - ramp(t, a, a + 0.4)) * 20}px)` }}>{children}</div>;
};
const Note: React.FC<{ t: number; t0: number; old: string; x: number; y: number }> = ({ t, t0, old, x, y }) => (
  <div style={abs(x, y, { ...pop(t, t0), background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 20px 11px", fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.forest, whiteSpace: "nowrap", boxShadow: "0 8px 20px rgba(31,42,20,0.10)" })}>
    <span style={{ color: C.matcha }}>1918 atlas name:</span> {old}
  </div>
);
const Chip: React.FC<{ t: number; t0: number; bg?: string; color?: string; size?: number; children: React.ReactNode }> = ({ t, t0, bg = C.forest, color = C.paper, size = 34, children }) => (
  <div style={{ ...pop(t, t0), display: "inline-block", background: bg, color, fontFamily: FONT, fontWeight: 800, fontSize: size, padding: `${size * 0.3}px ${size * 0.62}px ${size * 0.38}px`, borderRadius: size * 0.6, whiteSpace: "nowrap" }}>{children}</div>
);

const LOBES = { src: "plates/lobes.png", aspect: 1758 / 1232 };
const SAGP = { src: "plates/sagittal.png", aspect: 2006 / 1635 };
const MESAL = { src: "plates/mesal.png", aspect: 2130 / 1521 };
const BASE = { src: "plates/base.png", aspect: 1893 / 1905 };
const CEREB = { src: "plates/cerebellum.png", aspect: 1894 / 1041 };

/* ================= INTRO 0.6 – 40.4 ================= */
export const SIntro: React.FC = () => {
  const t = useT();
  return (
    <Stage a={-1} b={40.4}>
      <Seg t={t} a={-1} b={29.0}>
        <Plate {...LOBES} x={0} y={20} w={1000} a={-1} b={29.0} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.35, 0.45, 0.42]} />
        <div style={abs(1060, 30, { width: 720, ...pop(t, 0.1) })}>
          <Big size={96}>
            Parts of the <Mk p={ramp(t, 0.6, 1.4)}>Brain</Mk>
          </Big>
          <Big size={64} color={C.matcha}>made easy</Big>
        </div>
        <Facts
          x={1060}
          y={330}
          w={720}
          items={[
            { t: 1.9, text: "runs everything you think, feel and do", big: "≈ 3 lb", bg: C.forest },
            { t: 12.1, text: "nursing · med school · A&P" },
            { t: 20.7, text: "4 main parts · 4 lobes · memory tricks", bg: C.matcha },
            { t: 25.5, text: "what each lobe actually does" },
          ]}
        />
      </Seg>
      <Seg t={t} a={29.0} b={40.6}>
        <div style={abs(0, 10)}>
          <Sagittal t={t} w={1000} lit={{ CR: 32.7, TH: 33.5, HY: 33.5, MB: 34.6, PO: 34.6, ME: 34.6, CB: 35.5 }} labels={[
            { r: "CR", text: "Cerebrum", t: 32.7, dx: -10, dy: -40 },
            { r: "TH", text: "Diencephalon", t: 33.5, dx: -260, dy: 60 },
            { r: "PO", text: "Brainstem", t: 34.6, dx: -240, dy: 120 },
            { r: "CB", text: "Cerebellum", t: 35.5, dx: 100, dy: 140 },
          ]} />
        </div>
        <div style={abs(1060, 40, { width: 720, ...pop(t, 29.1) })}>
          <Big size={72}>The big picture</Big>
        </div>
        <div style={abs(1060, 160, { width: 720, display: "flex", flexDirection: "column", gap: 16 })}>
          {[
            ["1", "Cerebrum", 32.7, LOBE_COL.F],
            ["2", "Diencephalon", 33.5, "#E9C46A"],
            ["3", "Brainstem", 34.6, "#B98FCC"],
            ["4", "Cerebellum", 35.5, "#E7A86A"],
          ].map(([n, s, tt, col]) => (
            <div key={s as string} style={{ ...pop(t, tt as number), display: "flex", alignItems: "center", gap: 20, background: C.card, border: `3px solid ${C.line}`, borderRadius: 24, padding: "12px 22px" }}>
              <div style={{ width: 62, height: 62, borderRadius: 31, background: col as string, border: `4px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.forest }}>{n}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.forest }}>{s}</div>
            </div>
          ))}
        </div>
        <div style={abs(1060, 590, pop(t, 37.2))}>
          <Chip t={t} t0={37.2} bg={C.banana} color={C.forest} size={40}>+ 5-question quiz at the end</Chip>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 1. CEREBRUM 40.9 – 110.1 ================= */
export const SCerebrum: React.FC = () => {
  const t = useT();
  return (
    <Stage a={43.2} b={109.9}>
      <Seg t={t} a={43.2} b={49.4}>
        <Plate {...SAGP} x={60} y={0} w={880} a={43.2} b={49.6} zoomFrom={[1.0, 0.5, 0.45]} zoomTo={[1.18, 0.42, 0.4]}
          labels={[
            { x: 0.3, y: 0.24, text: "Cerebrum", t: 43.4, side: "r", hot: true },
            { x: 0.72, y: 0.72, text: "Cerebellum", t: 47.6, side: "r" },
          ]}
        />
        <Facts items={[{ t: 43.4, text: "the cerebrum", bg: C.forest }, { t: 47.3, text: "the largest part of the brain, by far", big: "#1" }]} />
      </Seg>
      <Seg t={t} a={49.4} b={76.1}>
        <div style={abs(0, 0)}>
          <TopView t={t} w={1000} hemi={50.0} fissure={53.9} callosum={62.9} cross={71.5} />
        </div>
        <Facts
          items={[
            { t: 50.0, text: "2 cerebral hemispheres · left + right", bg: C.forest },
            { t: 55.6, text: "split by the longitudinal fissure" },
            { t: 62.9, text: "corpus callosum = the bridge between them", bg: C.matcha },
            { t: 69.9, text: "each hemisphere controls the OPPOSITE side of the body", bg: C.red },
          ]}
        />
      </Seg>
      <Seg t={t} a={76.1} b={97.4}>
        <div style={abs(0, 80)}>
          <Folds t={t} w={1000} gray={79.2} white={82.0} gyrus={89.5} sulcus={91.5} />
        </div>
        <div style={abs(40, 20, pop(t, 76.3))}>
          <Chip t={t} t0={76.3} bg={C.banana} color={C.forest} size={36}>The surface, up close</Chip>
        </div>
        <Facts
          items={[
            { t: 79.2, text: "cerebral cortex = gray matter (outer layer)", bg: C.forest },
            { t: 82.0, text: "white matter = wiring between regions" },
            { t: 88.6, text: "gyrus = ridge · sulcus = groove", bg: C.matcha },
            { t: 92.8, text: "folding packs more cortex into the skull" },
          ]}
        />
      </Seg>
      <Seg t={t} a={97.4} b={110.2}>
        <Plate {...LOBES} x={0} y={20} w={1000} a={97.4} b={110.2} zoomFrom={[1.05, 0.45, 0.4]} zoomTo={[1.3, 0.42, 0.42]}
          labels={[
            { x: 0.468, y: 0.2, text: "Central sulcus", t: 100.8, side: "r", hot: true },
            { x: 0.372, y: 0.55, text: "Lateral sulcus", t: 104.6, side: "l", hot: true },
          ]}
        />
        <Facts
          items={[
            { t: 97.6, text: "2 grooves divide the lobes", bg: C.forest },
            { t: 100.8, text: "central sulcus: top of the brain, down the side" },
            { t: 104.6, text: "lateral sulcus: deep crease along the side", bg: C.matcha },
          ]}
        />
        <Note t={t} t0={102.2} old="central fissure" x={1100} y={400} />
        <Note t={t} t0={106.4} old="Sylvian fissure" x={1100} y={475} />
      </Seg>
    </Stage>
  );
};

/* ================= 2. THE FOUR LOBES 110.1 – 191.9 ================= */
export const SLobes: React.FC = () => {
  const t = useT();
  const bones: [string, string, number, string][] = [
    ["Frontal", "frontal bone", 114.4, LOBE_COL.F],
    ["Parietal", "parietal bone", 115.0, LOBE_COL.P],
    ["Temporal", "temporal bone", 115.6, LOBE_COL.T],
    ["Occipital", "occipital bone", 116.2, LOBE_COL.O],
  ];
  return (
    <Stage a={112.4} b={191.7}>
      <Seg t={t} a={112.4} b={118.0}>
        <div style={abs(0, 30)}>
          <BrainMap t={t} w={1000} lit={{ F: 112.6, P: 112.8, T: 113.0, O: 113.2 }} lobeText={113.0} dim={{ CB: 112.4, BS: 112.4 }} />
        </div>
        <div style={abs(1060, 20, { width: 720, ...pop(t, 112.5) })}>
          <Big size={58}>4 lobes, named after the skull bones on top</Big>
        </div>
        <div style={abs(1060, 230, { display: "flex", flexDirection: "column", gap: 14 })}>
          {bones.map(([l, b, tt, col]) => (
            <div key={l} style={{ ...pop(t, tt), display: "flex", alignItems: "center", gap: 16, fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: col, border: `4px solid ${C.forest}` }} />
              {l} lobe <span style={{ color: C.matcha, fontSize: 32 }}>← {b}</span>
            </div>
          ))}
        </div>
      </Seg>
      {/* frontal */}
      <Seg t={t} a={118.0} b={147.4}>
        <div style={abs(0, 30)}>
          <BrainMap
            t={t}
            w={1000}
            lit={{ F: 119.9 }}
            hot={[{ r: "F", a: 120.0, b: 126.3 }]}
            strips={{ pre: 134.8 }}
            spots={[
              { id: "pf", x: 170, y: 300, t: 127.8, color: LOBE_COL.F, r: 50 },
              { id: "broca", x: 345, y: 405, t: 144.3, color: C.banana, r: 38 },
            ]}
            labels={[
              { x: 190, y: 200, text: "Prefrontal cortex", t: 127.9 },
              { x: 470, y: 30, text: "Precentral gyrus", t: 134.9, color: C.red },
              { x: 300, y: 500, text: "Broca's area", t: 144.4, color: C.banana },
            ]}
          />
        </div>
        <Facts
          items={[
            { t: 119.9, text: "FRONTAL LOBE · behind your forehead", bg: C.forest },
            { t: 121.0, text: "planning · decisions · personality · judgment · behavior" },
            { t: 127.8, text: "prefrontal cortex: planning + short-term memory", bg: "#3E6E8E" },
            { t: 136.8, text: "precentral gyrus = primary MOTOR cortex → moves your muscles", bg: C.red },
            { t: 144.3, text: "Broca's area (usually left): producing speech", bg: C.matcha },
          ]}
        />
      </Seg>
      {/* parietal */}
      <Seg t={t} a={147.4} b={164.6}>
        <div style={abs(0, 30)}>
          <BrainMap
            t={t}
            w={1000}
            lit={{ F: 147.4, P: 149.4 }}
            dim={{ F: 147.6 }}
            hot={[{ r: "P", a: 149.5, b: 156.0 }]}
            strips={{ pre: 147.4, post: 151.8 }}
            labels={[
              { x: 640, y: 40, text: "Postcentral gyrus", t: 151.9, color: "#3E7CB1" },
              { x: 400, y: 40, text: "Motor", t: 160.3, color: C.red },
              { x: 610, y: 120, text: "Sensation", t: 162.6, color: "#3E7CB1" },
            ]}
          />
        </div>
        <Facts
          items={[
            { t: 149.4, text: "PARIETAL LOBE · behind the central sulcus", bg: C.forest },
            { t: 153.7, text: "postcentral gyrus = primary SOMATOSENSORY cortex", bg: "#3E7CB1" },
            { t: 156.7, text: "touch · pain · temperature · body position" },
            { t: 160.2, text: "MOTOR in front · SENSATION behind", bg: C.red },
          ]}
        />
      </Seg>
      {/* temporal */}
      <Seg t={t} a={164.6} b={181.1}>
        <div style={abs(0, 30)}>
          <BrainMap
            t={t}
            w={1000}
            lit={{ T: 166.4 }}
            hot={[{ r: "T", a: 166.5, b: 172.0 }]}
            sulci={{ lateral: 165.0 }}
            spots={[
              { id: "aud", x: 470, y: 425, t: 170.4, color: "#E7A86A", r: 36 },
              { id: "wer", x: 640, y: 395, t: 178.2, color: C.banana, r: 38 },
            ]}
            labels={[
              { x: 420, y: 520, text: "Auditory cortex", t: 170.5 },
              { x: 700, y: 300, text: "Wernicke's area", t: 178.3, color: C.banana },
            ]}
          />
        </div>
        <div style={abs(820, 560, pop(t, 173.4))}>
          <Sound t={t} size={110} />
        </div>
        <Facts
          items={[
            { t: 166.4, text: "TEMPORAL LOBE · by your temples and ears", bg: C.forest },
            { t: 170.4, text: "primary AUDITORY cortex → sound", bg: "#B5793D" },
            { t: 174.2, text: "a big role in memory" },
            { t: 178.2, text: "Wernicke's area (usually left): understanding language", bg: C.matcha },
          ]}
        />
      </Seg>
      {/* occipital on the 1918 plate */}
      <Seg t={t} a={181.1} b={192.0}>
        <Plate {...LOBES} x={0} y={20} w={1000} a={181.1} b={192.0} zoomFrom={[1.1, 0.75, 0.55]} zoomTo={[1.7, 0.86, 0.6]}
          labels={[
            { x: 0.91, y: 0.43, text: "Occipital lobe", t: 182.9, side: "l", hot: true },
            { x: 0.93, y: 0.62, text: "Primary visual cortex", t: 185.2, side: "l" },
          ]}
        />
        <div style={abs(1080, 520, pop(t, 189.6))}>
          <Eye size={170} />
        </div>
        <Facts
          items={[
            { t: 183.0, text: "OCCIPITAL LOBE · at the very back", bg: C.forest },
            { t: 185.2, text: "primary VISUAL cortex", bg: LOBE_COL.O },
            { t: 187.2, text: "everything you see is processed back here" },
          ]}
        />
      </Seg>
    </Stage>
  );
};

/* ================= 3. DIENCEPHALON 191.9 – 237.2 ================= */
export const SDien: React.FC = () => {
  const t = useT();
  return (
    <Stage a={194.2} b={237.0}>
      <Seg t={t} a={194.2} b={216.0}>
        <Plate {...MESAL} x={0} y={10} w={1000} a={194.2} b={216.0} zoomFrom={[1.05, 0.45, 0.5]} zoomTo={[1.6, 0.45, 0.55]}
          labels={[
            { x: 0.45, y: 0.5, text: "Thalamus", t: 199.2, side: "r", hot: true },
            { x: 0.4, y: 0.6, text: "Hypothalamus", t: 200.3, side: "l" },
          ]}
        />
        <Facts
          items={[
            { t: 196.6, text: "DIENCEPHALON · tucked under the cerebrum", bg: C.forest },
            { t: 201.8, text: "thalamus = relay station · switchboard", bg: "#B5933A" },
            { t: 206.6, text: "touch · sight · sound · taste → thalamus → cortex" },
            { t: 213.7, text: "except SMELL — its own route", bg: C.red },
          ]}
        />
      </Seg>
      <Seg t={t} a={216.0} b={228.8}>
        <div style={abs(0, 10)}>
          <Sagittal t={t} w={1000} lit={{ TH: 216.0, HY: 217.7 }} dimAll={216.0} hot={[{ r: "HY", a: 217.8, b: 228.8 }]}
            labels={[
              { r: "TH", text: "Thalamus", t: 216.2, dx: 60, dy: -110 },
              { r: "HY", text: "Hypothalamus", t: 217.8, dx: -250, dy: 40, color: "#C2513A" },
            ]}
          />
        </div>
        <div style={abs(1060, 20, pop(t, 219.0))}>
          <Big size={70}>
            <span style={{ color: "#C2513A" }}>hypo</span> = below
          </Big>
        </div>
        <Facts
          y={140}
          items={[
            { t: 223.0, text: "small, but keeps your body in balance", bg: C.forest },
            { t: 225.5, text: "body temperature · hunger · thirst · sleep" },
          ]}
        />
      </Seg>
      <Seg t={t} a={228.8} b={237.4}>
        <Plate {...MESAL} x={0} y={10} w={1000} a={228.8} b={237.4} zoomFrom={[1.6, 0.36, 0.62]} zoomTo={[2.0, 0.36, 0.64]}
          labels={[
            { x: 0.4, y: 0.6, text: "Hypothalamus", t: 229.0, side: "r" },
            { x: 0.335, y: 0.69, text: "Pituitary gland", t: 232.7, side: "r", hot: true },
          ]}
        />
        <Facts
          items={[
            { t: 229.9, text: "steers the autonomic nervous system", bg: C.forest },
            { t: 232.7, text: "controls the pituitary gland — the master gland of hormones", bg: "#C2513A" },
          ]}
        />
        <Note t={t} t0={234.0} old="pituitary body" x={1100} y={480} />
      </Seg>
    </Stage>
  );
};

/* ================= 4. BRAINSTEM 237.2 – 288.7 ================= */
export const SStem: React.FC = () => {
  const t = useT();
  const stack: [string, number, string][] = [["Midbrain", 245.1, "#B98FCC"], ["Pons", 245.8, "#9D7CC0"], ["Medulla oblongata", 246.6, "#7F64A8"]];
  return (
    <Stage a={239.5} b={288.5}>
      <Seg t={t} a={239.5} b={254.2}>
        <div style={abs(-80, -90)}>
          <Sagittal t={t} w={1180} lit={{ MB: 245.1, PO: 245.8, ME: 246.6, SC: 240.9 }} dimAll={239.5} hot={[{ r: "MB", a: 248.2, b: 254.2 }]}
            labels={[
              { r: "MB", text: "Midbrain", t: 245.1, dx: -260, dy: -20 },
              { r: "PO", text: "Pons", t: 245.8, dx: -220, dy: 30 },
              { r: "ME", text: "Medulla", t: 246.6, dx: -230, dy: 40 },
              { r: "SC", text: "Spinal cord", t: 240.9, dx: 190, dy: 0 },
            ]}
          />
        </div>
        <Facts
          items={[
            { t: 239.8, text: "BRAINSTEM · brain ↔ spinal cord", bg: C.forest },
            { t: 242.3, text: "3 parts, top to bottom" },
          ]}
        />
        <div style={abs(1100, 280, { display: "flex", flexDirection: "column", gap: 12 })}>
          {stack.map(([s, tt, col], i) => (
            <div key={s} style={{ ...pop(t, tt), display: "flex", alignItems: "center", gap: 16, fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest }}>
              <div style={{ width: 54, height: 54, borderRadius: 14, background: col, color: C.paper, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>{i + 1}</div>
              {s}
            </div>
          ))}
        </div>
        <div style={abs(1100, 520, { display: "flex", alignItems: "center", gap: 20, ...pop(t, 249.2) })}>
          <Eye size={120} />
          <Sound t={t} size={100} />
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.forest, width: 330, lineHeight: 1.15 }}>midbrain: visual + auditory reflexes</div>
        </div>
      </Seg>
      <Seg t={t} a={254.2} b={275.0}>
        <Plate {...BASE} x={130} y={0} w={735} a={254.2} b={275.0} zoomFrom={[1.4, 0.45, 0.58]} zoomTo={[1.9, 0.45, 0.68]}
          labels={[
            { x: 0.44, y: 0.575, text: "Pons", t: 254.4, side: "r", hot: true },
            { x: 0.44, y: 0.715, text: "Medulla oblongata", t: 263.4, side: "r", hot: true },
          ]}
        />
        <Facts
          items={[
            { t: 254.4, text: "PONS · the bulge in the middle", bg: "#9D7CC0" },
            { t: 256.5, text: "pons = bridge → main link to the cerebellum" },
            { t: 261.3, text: "also helps adjust breathing" },
            { t: 263.4, text: "MEDULLA: heart rate · blood pressure · breathing", bg: "#7F64A8" },
          ]}
        />
        <Note t={t} t0={258.6} old="pons Varolii" x={1100} y={600} />
      </Seg>
      <Seg t={t} a={275.0} b={282.0}>
        <div style={abs(-80, -90)}>
          <Sagittal t={t} w={1180} lit={{ MB: 275.0, PO: 275.0, ME: 275.0 }} dimAll={275.0} reticular={276.5} />
        </div>
        <Facts items={[{ t: 275.2, text: "reticular formation: sleep + wakefulness", bg: C.forest }]} />
      </Seg>
      <Seg t={t} a={282.0} b={288.8}>
        <Plate {...BASE} x={130} y={0} w={735} a={282.0} b={288.8} zoomFrom={[1.15, 0.45, 0.5]} zoomTo={[1.35, 0.45, 0.55]}
          labels={[{ x: 0.375, y: 0.63, text: "Cranial nerves", t: 284.5, side: "r", hot: true }]}
        />
        <Facts items={[{ t: 284.5, text: "of the 12 pairs of cranial nerves arise from the brainstem", big: "10", bg: C.forest }]} />
      </Seg>
    </Stage>
  );
};

/* ================= 5. CEREBELLUM 288.7 – 323.6 ================= */
export const SCereb: React.FC = () => {
  const t = useT();
  return (
    <Stage a={291.0} b={323.4}>
      <Seg t={t} a={291.0} b={300.2}>
        <div style={abs(0, 30)}>
          <BrainMap t={t} w={1000} lit={{ CB: 291.8 }} dim={{ F: 291, P: 291, T: 291, O: 291, BS: 291 }} hot={[{ r: "CB", a: 292.0, b: 300.2 }]} labels={[{ x: 760, y: 680, text: "Cerebellum", t: 292.1, color: "#B5793D" }]} />
        </div>
        <Facts
          items={[
            { t: 293.8, text: "cerebellum = \"little brain\"", bg: C.forest },
            { t: 295.8, text: "of the brain's mass", big: "≈ 10%" },
            { t: 297.7, text: "…but holds most of the brain's neurons", bg: "#B5793D" },
          ]}
        />
      </Seg>
      <Seg t={t} a={300.2} b={314.6}>
        <Plate {...CEREB} x={0} y={80} w={1000} a={300.2} b={314.6} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.25, 0.5, 0.55]}
          labels={[
            { x: 0.49, y: 0.6, text: "Vermis", t: 301.0, side: "r" },
            { x: 0.16, y: 0.62, text: "Hemisphere", t: 301.6, side: "r" },
          ]}
          credit="Gray's Anatomy, 1918 · under surface of the cerebellum"
        />
        <Facts
          items={[
            { t: 300.8, text: "its job: COORDINATION", bg: C.forest },
            { t: 302.0, text: "compares the movement you planned with what your body actually does" },
            { t: 308.3, text: "→ sends corrections: smooth, accurate", bg: "#B5793D" },
            { t: 311.9, text: "balance + posture", bg: C.matcha },
          ]}
        />
      </Seg>
      <Seg t={t} a={314.6} b={323.6}>
        <div style={abs(-80, -90)}>
          <Sagittal t={t} w={1180} lit={{ CB: 314.6, MB: 314.6, PO: 314.6, ME: 314.6 }} dimAll={314.6} peduncles={[319.6, 320.9, 322.0]}
            labels={[
              { r: "MB", text: "→ midbrain", t: 319.6, dx: -260, dy: -30 },
              { r: "PO", text: "→ pons", t: 320.9, dx: -230, dy: 20 },
              { r: "ME", text: "→ medulla", t: 322.0, dx: -240, dy: 30 },
            ]}
          />
        </div>
        <Facts items={[{ t: 314.7, text: "3 pairs of cerebellar peduncles attach it to the brainstem", big: "3", bg: C.red }]} />
      </Seg>
    </Stage>
  );
};

/* ================= 6. HOW IT CONNECTS 323.6 – 367.7 ================= */
const P_UP = "M590 720 L590 650 L588 600 L584 520 L576 430 L548 350"; // spinal cord → thalamus
const P_CORTEX = "M548 350 C600 300 640 230 640 140"; // thalamus → parietal cortex
const P_MOTOR = "M470 120 C480 220 520 320 560 420 L584 520 L588 600 L590 720"; // motor cortex → down
export const SConnect: React.FC = () => {
  const t = useT();
  return (
    <Stage a={325.9} b={367.5}>
      <Seg t={t} a={325.9} b={339.2}>
        <div style={abs(-40, -40)}>
          <Sagittal t={t} w={1100} lit={{ SC: 329.2, ME: 330.8, PO: 331.4, MB: 332.0, TH: 333.0, CR: 335.2 }} dimAll={325.9}
            paths={[
              { d: P_UP, a: 329.2, b: 333.1, color: "#3E7CB1" },
              { d: P_CORTEX, a: 334.4, b: 336.0, color: "#3E7CB1" },
            ]}
            hot={[{ r: "TH", a: 333.0, b: 336.5 }]}
            labels={[
              { r: "TH", text: "Thalamus", t: 333.0, dx: -250, dy: -30 },
              { r: "CR", text: "Parietal cortex: \"HOT!\"", t: 336.0, dx: 380, dy: -110, color: C.red },
            ]}
          />
        </div>
        <div style={abs(1100, 20, pop(t, 327.8))}>
          <Chip t={t} t0={327.8} bg={C.red} size={44}>You touch something hot</Chip>
        </div>
        <Facts
          y={140}
          items={[
            { t: 329.2, text: "spinal cord → brainstem → thalamus", bg: "#3E7CB1" },
            { t: 334.0, text: "thalamus → parietal lobe: now you FEEL it" },
          ]}
        />
      </Seg>
      <Seg t={t} a={339.2} b={346.2}>
        <div style={abs(0, 0)}>
          <TopView t={t} w={1000} hemi={339.2} cross={340.2} crossOnly="R" />
        </div>
        <Facts items={[{ t: 339.6, text: "wiring crosses over: RIGHT hand → LEFT parietal lobe", bg: C.forest }]} />
      </Seg>
      <Seg t={t} a={346.2} b={367.7}>
        <div style={abs(-40, -40)}>
          <Sagittal t={t} w={1100} lit={{ CR: 346.3, CB: 354.5, ME: 358.9, PO: 363.2, MB: 363.2, TH: 363.2, HY: 363.2, SC: 363.2 }} dimAll={346.2}
            paths={[{ d: P_MOTOR, a: 349.0, b: 353.7, color: C.red }]}
            hot={[{ r: "CB", a: 354.6, b: 358.6 }, { r: "ME", a: 359.9, b: 363.0 }]}
            labels={[
              { r: "CR", text: "Motor cortex", t: 349.0, dx: -110, dy: -60, color: C.red },
              { r: "CB", text: "fine-tunes", t: 355.2, dx: 120, dy: 130, color: "#B5793D" },
              { r: "ME", text: "heart + breathing", t: 359.9, dx: 250, dy: 40, color: "#7F64A8" },
            ]}
          />
        </div>
        <Facts
          items={[
            { t: 346.3, text: "frontal lobe decides: move!", bg: C.forest },
            { t: 349.0, text: "motor cortex → brainstem → spinal cord", bg: C.red },
            { t: 354.5, text: "cerebellum keeps it smooth", bg: "#B5793D" },
            { t: 363.2, text: "every part has its own job — one team", bg: C.matcha },
          ]}
        />
      </Seg>
    </Stage>
  );
};

/* ================= 7. MEMORY TRICKS 367.7 – 416.2 ================= */
const TrickCard: React.FC<{ t: number; t0: number; n: number; title: string; children: React.ReactNode }> = ({ t, t0, n, title, children }) => (
  <div style={abs(0, 0, { width: 1800, height: 740, borderRadius: 44, background: C.forest, ...pop(t, t0, 0.35) })}>
    <div style={abs(60, 44, { fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: C.matchaLight })}>TRICK {n}</div>
    <div style={abs(60, 90, { fontFamily: FONT, fontWeight: 800, fontSize: 60, color: C.paper })}>{title}</div>
    {children}
  </div>
);
export const STricks: React.FC = () => {
  const t = useT();
  const mpm: [string, string, number, number][] = [["My", "Midbrain", 373.5, 374.7], ["Pet", "Pons", 373.7, 375.2], ["Mouse", "Medulla", 373.97, 375.67]];
  const rows: [string, string, string, number, number][] = [
    ["2", "I – II", "above the brainstem", 377.1, 380.3],
    ["2", "III – IV", "midbrain", 377.4, 383.4],
    ["4", "V – VIII", "pons", 377.66, 385.0],
    ["4", "IX – XII", "medulla", 378.27, 387.0],
  ];
  return (
    <Stage a={370.0} b={416.0}>
      <Seg t={t} a={370.0} b={376.5}>
        <TrickCard t={t} t0={370.1} n={1} title="Brainstem, top to bottom">
          <div style={abs(0, 260, { width: 1800, display: "flex", justifyContent: "center", gap: 90 })}>
            {mpm.map(([w, part, tw, tp]) => (
              <div key={w} style={{ textAlign: "center", fontFamily: FONT, fontWeight: 800 }}>
                <div style={{ ...pop(t, tw), fontSize: 120, color: C.paper, lineHeight: 1 }}>
                  <span style={{ color: C.banana, fontSize: 160 }}>{w[0]}</span>
                  {w.slice(1)}
                </div>
                <div style={{ ...pop(t, tp), marginTop: 30, fontSize: 52, color: C.forest, background: C.banana, borderRadius: 20, padding: "8px 26px 12px" }}>{part}</div>
              </div>
            ))}
          </div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={376.5} b={389.3}>
        <TrickCard t={t} t0={376.55} n={2} title="The 2 · 2 · 4 · 4 rule for cranial nerves">
          <div style={abs(160, 210, { display: "flex", flexDirection: "column", gap: 18 })}>
            {rows.map(([n, rom, where, tn, th]) => {
              const on = ramp(t, th, th + 0.3);
              return (
                <div key={rom} style={{ ...pop(t, tn), display: "flex", alignItems: "center", gap: 30, fontFamily: FONT, fontWeight: 800 }}>
                  <div style={{ width: 100, height: 100, borderRadius: 26, background: C.banana, color: C.forest, fontSize: 70, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</div>
                  <div style={{ width: 300, fontSize: 56, color: on > 0.5 ? C.banana : C.paper, opacity: 0.35 + 0.65 * on }}>{rom}</div>
                  <div style={{ fontSize: 48, color: C.paper, opacity: 0.35 + 0.65 * on, background: on > 0.5 ? C.matcha : "transparent", borderRadius: 18, padding: "6px 22px 10px" }}>{where}</div>
                </div>
              );
            })}
          </div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={389.3} b={404.1}>
        <div style={abs(0, 30)}>
          <BrainMap t={t} w={1000} lit={{ F: 391.1, T: 398.6 }} dim={{ P: 389.3, O: 389.3, CB: 389.3, BS: 389.3 }}
            spots={[{ id: "b", x: 345, y: 405, t: 391.2, color: C.banana, r: 40 }, { id: "w", x: 640, y: 395, t: 398.7, color: C.banana, r: 40 }]}
            labels={[{ x: 300, y: 505, text: "Broca", t: 391.2, color: C.banana }, { x: 700, y: 300, text: "Wernicke", t: 398.7, color: C.banana }]}
          />
        </div>
        <div style={abs(1060, 20, { width: 740 })}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: C.matcha, ...pop(t, 389.4) }}>TRICK 3 · LANGUAGE AREAS</div>
          <div style={{ marginTop: 20, background: C.forest, borderRadius: 30, padding: "24px 32px", fontFamily: FONT, fontWeight: 800, ...pop(t, 391.2) }}>
            <div style={{ fontSize: 60, color: C.paper }}>
              <span style={{ color: C.banana }}>BRO</span>ca = <span style={{ color: C.banana }}>BRO</span>ken
            </div>
            <div style={{ fontSize: 32, color: C.paper, opacity: 0.85, marginTop: 8 }}>slow, broken speech · understanding often OK</div>
          </div>
          <div style={{ marginTop: 22, background: C.card, border: `3px solid ${C.line}`, borderRadius: 30, padding: "24px 32px", fontFamily: FONT, fontWeight: 800, ...pop(t, 398.7) }}>
            <div style={{ fontSize: 60, color: C.forest }}>
              <span style={{ color: C.matcha }}>W</span>ernicke = <span style={{ color: C.matcha }}>W</span>ordy
            </div>
            <div style={{ fontSize: 32, color: C.forest, opacity: 0.85, marginTop: 8 }}>speech flows · but doesn't make sense</div>
          </div>
        </div>
      </Seg>
      <Seg t={t} a={404.1} b={410.0}>
        <div style={abs(0, 30)}>
          <BrainMap t={t} w={1000} lit={{ O: 404.4 }} hot={[{ r: "O", a: 406.2, b: 410.0 }]} dim={{ F: 404.1, P: 404.1, T: 404.1, CB: 404.1, BS: 404.1 }} />
        </div>
        <div style={abs(700, 210, pop(t, 406.2))}>
          <Eye size={200} />
        </div>
        <div style={abs(1060, 60, { width: 720 })}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: C.matcha, ...pop(t, 404.4) }}>TRICK 4</div>
          <div style={{ marginTop: 16, ...pop(t, 405.3) }}>
            <Big size={78}>
              "Eyes in the <Mk p={ramp(t, 406.6, 407.4)}>back</Mk> of your head"
            </Big>
          </div>
          <div style={{ marginTop: 26, ...pop(t, 407.8) }}>
            <Chip t={t} t0={407.8} bg={LOBE_COL.O} color={C.forest} size={44}>vision = occipital lobe</Chip>
          </div>
        </div>
      </Seg>
      <Seg t={t} a={410.0} b={416.2}>
        <div style={abs(160, 120)}>
          <StudyCard t={t} flip={412.6} front="Which brainstem part regulates heart rate + breathing?" back="Medulla oblongata" w={700} />
        </div>
        <div style={abs(1060, 140, { width: 720 })}>
          <Big size={64}>Write it. Flip it. Test yourself.</Big>
          <div style={{ marginTop: 30, ...pop(t, 413.2) }}>
            <Chip t={t} t0={413.2} bg={C.matcha} size={40}>active recall makes it stick</Chip>
          </div>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 8. QUIZ 416.2 – 477.6 ================= */
type Q = { n: number; ask: number; pause: number; ans: number; q: string; a: string; visual: (t: number, reveal: number) => React.ReactNode };
const QS: Q[] = [
  {
    n: 1, ask: 420.87, pause: 424.63, ans: 427.83, q: "Which lobe holds the primary visual cortex?", a: "Occipital lobe",
    visual: (t, r) => <div style={abs(0, 30)}><BrainMap t={t} w={1000} lit={r ? { O: 427.85 } : {}} hot={r ? [{ r: "O", a: 427.9, b: 430.4 }] : []} lobeText={r ? 428.0 : undefined} /></div>,
  },
  {
    n: 2, ask: 430.42, pause: 435.08, ans: 438.28, q: "Which groove separates the frontal lobe from the parietal lobe?", a: "Central sulcus",
    visual: (t, r) => <Plate {...LOBES} x={0} y={20} w={1000} a={430.2} b={439.95} zoomFrom={[1.05, 0.45, 0.4]} zoomTo={[1.25, 0.47, 0.3]} labels={r ? [{ x: 0.468, y: 0.2, text: "Central sulcus", t: 438.3, side: "r", hot: true }] : []} />,
  },
  {
    n: 3, ask: 439.97, pause: 444.56, ans: 447.76, q: "Which part of the brainstem regulates your heart rate and breathing?", a: "Medulla oblongata",
    visual: (t, r) => <div style={abs(-80, -90)}><Sagittal t={t} w={1180} lit={r ? { ME: 447.8 } : { MB: 440, PO: 440, ME: 440 }} dimAll={439.97} hot={r ? [{ r: "ME", a: 447.8, b: 449.8 }] : []} labels={r ? [{ r: "ME", text: "Medulla", t: 447.9, dx: -230, dy: 40, color: "#7F64A8" }] : []} /></div>,
  },
  {
    n: 4, ask: 449.77, pause: 455.94, ans: 459.14, q: "Which structure relays almost all sensory information to the cortex — except smell?", a: "Thalamus",
    visual: (t, r) => <Plate {...MESAL} x={0} y={10} w={1000} a={449.6} b={460.45} zoomFrom={[1.1, 0.45, 0.5]} zoomTo={[1.4, 0.45, 0.52]} labels={r ? [{ x: 0.45, y: 0.5, text: "Thalamus", t: 459.15, side: "r", hot: true }] : []} />,
  },
  {
    n: 5, ask: 460.43, pause: 468.2, ans: 471.4, q: "They understand you, but speak in slow, broken phrases. Which area?", a: "Broca's area",
    visual: (t, r) => <div style={abs(0, 30)}><BrainMap t={t} w={1000} lit={r ? { F: 471.4 } : {}} spots={r ? [{ id: "b", x: 345, y: 405, t: 471.45, color: C.banana, r: 42 }] : []} labels={r ? [{ x: 300, y: 505, text: "Broca's area", t: 471.5, color: C.banana }] : []} /></div>,
  },
];
export const SQuiz: React.FC = () => {
  const t = useT();
  return (
    <Stage a={418.5} b={477.4}>
      <Seg t={t} a={418.5} b={420.8}>
        <div style={abs(0, 0, { width: 1800, height: 740, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" })}>
          <div style={pop(t, 418.6)}><Big size={150}>QUIZ</Big></div>
          <div style={{ ...pop(t, 419.1), marginTop: 20 }}><Chip t={t} t0={419.1} bg={C.banana} color={C.forest} size={44}>5 questions · pause if you need more time</Chip></div>
        </div>
      </Seg>
      {QS.map((q, i) => {
        const end = i < QS.length - 1 ? QS[i + 1].ask - 0.2 : 473.95;
        const reveal = t >= q.ans ? 1 : 0;
        const cdT = t - q.pause;
        const n = cdT < 0 ? null : cdT < 1.07 ? 3 : cdT < 2.13 ? 2 : cdT < 3.2 ? 1 : null;
        const cdK = n ? ramp(t, q.pause + (3 - n) * 1.067, q.pause + (3 - n) * 1.067 + 0.18) : 0;
        return (
          <Seg key={q.n} t={t} a={q.ask - 0.2} b={end}>
            {q.visual(t, reveal)}
            {!reveal && (
              <div style={abs(380, 250, { ...pop(t, q.ask + 0.2), width: 240, height: 240, borderRadius: 120, background: C.banana, border: `6px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 170, color: C.forest })}>?</div>
            )}
            <div style={abs(1040, 0, { width: 760, height: 740, borderRadius: 44, background: C.forest, ...pop(t, q.ask - 0.15, 0.35) })}>
              <div style={abs(50, 46, { fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: C.banana })}>QUESTION {q.n} / 5</div>
              <div style={abs(50, 110, { width: 660, fontFamily: FONT, fontWeight: 800, fontSize: 56, lineHeight: 1.12, color: C.paper })}>{q.q}</div>
              {n && (
                <div style={abs(0, 470, { width: 760, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 190, lineHeight: 1, color: C.banana, transform: `scale(${1.35 - 0.35 * cdK})` })}>{n}</div>
              )}
              {reveal > 0 && (
                <div style={abs(50, 520, { ...pop(t, q.ans), width: 660, background: C.banana, borderRadius: 26, padding: "20px 30px 26px", boxSizing: "border-box", fontFamily: FONT, fontWeight: 800, fontSize: 60, color: C.forest, textAlign: "center" })}>✓ {q.a}</div>
              )}
            </div>
          </Seg>
        );
      })}
      <Seg t={t} a={473.6} b={477.6}>
        <div style={abs(0, 0, { width: 1800, height: 740, borderRadius: 44, background: C.card, border: `4px solid ${C.line}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" })}>
          <Big size={110}>Your score: <span style={{ color: C.matcha }}>? / 5</span></Big>
          <div style={{ marginTop: 30, ...pop(t, 474.8) }}><Chip t={t} t0={474.8} bg={C.forest} size={46}>tell me in the comments</Chip></div>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 9. RECAP + OUTRO 477.6 – END ================= */
export const SRecap: React.FC = () => {
  const t = useT();
  const items: [string, string, number, string][] = [
    ["Cerebrum", "2 hemispheres + corpus callosum", 480.9, LOBE_COL.F],
    ["4 lobes", "frontal · parietal · temporal · occipital", 484.9, LOBE_COL.T],
    ["Diencephalon", "thalamus relays · hypothalamus balances", 488.8, "#E9C46A"],
    ["Brainstem", "midbrain · pons · medulla — autopilot", 495.0, "#B98FCC"],
    ["Cerebellum", "smooth, coordinated movement", 500.1, "#E7A86A"],
  ];
  const outro = ramp(t, 503.0, 503.5);
  return (
    <Stage a={479.9} b={513.6}>
      <Seg t={t} a={479.9} b={503.1}>
        <div style={abs(0, 0, { width: 1800, height: 740, borderRadius: 44, background: C.forest })}>
          <div style={abs(70, 46, { fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 8, color: C.banana })}>RECAP</div>
          <div style={abs(70, 120, { display: "flex", flexDirection: "column", gap: 20 })}>
            {items.map(([h, s, tt, col]) => (
              <div key={h} style={{ ...pop(t, tt), display: "flex", alignItems: "center", gap: 26, fontFamily: FONT, fontWeight: 800 }}>
                <div style={{ width: 70, height: 70, borderRadius: 35, background: col, border: `4px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, color: C.forest }}>✓</div>
                <div style={{ width: 430, fontSize: 54, color: C.paper }}>{h}</div>
                <div style={{ fontSize: 38, color: C.matchaLight }}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      </Seg>
      {outro > 0 && (
        <div style={abs(0, 0, { width: 1800, height: 740, borderRadius: 44, background: C.forest, opacity: outro, display: "flex", alignItems: "center" })}>
          <div style={{ marginLeft: 120, width: 260, height: 260, borderRadius: 130, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
            <LogoMark size={200} />
          </div>
          <div style={{ marginLeft: 80, fontFamily: FONT, fontWeight: 800 }}>
            <div style={{ fontSize: 110, color: C.paper, lineHeight: 1 }}>Book Plume</div>
            <div style={{ fontSize: 50, color: C.banana, marginTop: 14, opacity: ramp(t, 504.0, 504.4) }}>anatomy you'll actually remember</div>
            <div style={{ display: "flex", gap: 24, marginTop: 40, alignItems: "center" }}>
              <div style={{ background: C.red, color: C.paper, borderRadius: 50, padding: "18px 54px 22px", fontSize: 54, letterSpacing: 3, transform: `scale(${1 + 0.05 * Math.max(0, Math.sin((t - 504) * 5))})`, opacity: ramp(t, 504.1, 504.4) }}>SUBSCRIBE</div>
            </div>
            <div style={{ marginTop: 40, background: C.paper, color: C.forest, borderRadius: 24, padding: "16px 30px 20px", fontSize: 40, opacity: ramp(t, 507.9, 508.3), width: "fit-content" }}>Which brain part should we break down next?</div>
          </div>
        </div>
      )}
    </Stage>
  );
};
