import React from "react";
import { C, FONT, ramp, useT } from "./kit";
import { Facts, Stage, LogoMark } from "./Chrome16";
import { Plate } from "./Plates";
import { Plexus, CordsXS, BodyRoute, HandIcon, StudyCard, PC } from "./IllusPlexus";
import { SEG } from "./cues";
import { CHAPTERS, END } from "./timeline";

/* ---------- timing helpers (all from the voice alignment) ---------- */
const s_ = (i: number) => SEG[i].s;
const e_ = (i: number) => SEG[i].e;
const wf = (i: number, str: string, n = 0) => {
  let c = 0;
  for (let k = 0; k < SEG[i].t.length; k++) {
    if (SEG[i].t[k].startsWith(str)) {
      if (c === n) return SEG[i].w[k];
      c++;
    }
  }
  throw new Error(`cue not found: ${i} ${str}`);
};
const CH = (n: number) => CHAPTERS[n].s;
const ST = (n: number) => CH(n) + 2.3; // stage start after the automatic chapter card
const BE = (n: number) => (n + 1 < CHAPTERS.length ? CH(n + 1) - 0.1 : END);

/* ---------- small UI pieces ---------- */
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
const PartTag: React.FC<{ t: number; t0: number; n: number; name: string }> = ({ t, t0, n, name }) => (
  <div style={abs(0, -6, pop(t, t0))}>
    <Chip t={t} t0={t0} bg={C.banana} color={C.forest} size={34}>PART {n} · {name}</Chip>
  </div>
);

/* plates (Gray's Anatomy 1918, public domain) */
const PLAN = { src: "plates/plan.png", aspect: 2040 / 1701 };
const NECK = { src: "plates/neck.png", aspect: 1848 / 1517 };
const AXIL = { src: "plates/axilla.png", aspect: 1893 / 1644 };
const ARMUP = { src: "plates/armup.png", aspect: 1510 / 1813 };
const FORE = { src: "plates/forearm.png", aspect: 1194 / 1901 };
const SHOUL = { src: "plates/shoulder.png", aspect: 1150 / 902 };
const BACKARM = { src: "plates/backarm.png", aspect: 856 / 1344 };

const ALL = ["R5", "R6", "R7", "R8", "R1", "TS", "TM", "TI", "DSA", "DMA", "DIA", "DSP", "DMP", "DIP", "CL", "CM", "CP", "BMC", "BML", "BMM", "BMD", "BU", "BAX", "BRA"];
const at = (ids: string[], t0: number, step = 0) => Object.fromEntries(ids.map((id, i) => [id, t0 + i * step]));
const ROOTS = ["R5", "R6", "R7", "R8", "R1"], TRUNKS = ["TS", "TM", "TI"], ANT = ["DSA", "DMA", "DIA"], POST = ["DSP", "DMP", "DIP"], CORDS = ["CL", "CM", "CP"];
const BRS = ["BMC", "BML", "BMM", "BMD", "BU", "BAX", "BRA"];
const COLS_ALL = (t0: number) => ({ roots: t0, trunks: t0, divisions: t0, cords: t0, branches: t0 });
const BR_LABELS = (t0: number, step = 0) => [
  { x: 822, y: 80, text: "Musculocutaneous", t: t0, size: 27 },
  { x: 822, y: 255, text: "Median", t: t0 + step, size: 27 },
  { x: 822, y: 355, text: "Ulnar", t: t0 + step * 2, size: 27 },
  { x: 822, y: 470, text: "Axillary", t: t0 + step * 3, size: 27 },
  { x: 822, y: 610, text: "Radial", t: t0 + step * 4, size: 27 },
];
const PX = 20, PY = 40; // where the diagram sits in the stage

/* ================= INTRO ================= */
export const SIntro: React.FC = () => {
  const t = useT();
  const b3 = s_(3);
  return (
    <Stage a={-1} b={BE(0)}>
      <Seg t={t} a={-1} b={b3}>
        <Plate {...NECK} x={0} y={0} w={900} a={-1} b={b3 + 0.2} zoomFrom={[1.0, 0.5, 0.45]} zoomTo={[1.45, 0.55, 0.45]}
          labels={[{ x: 0.56, y: 0.44, text: "Brachial plexus", t: wf(1, "brachial"), side: "r", hot: true }]} />
        <div style={abs(1000, 20, { width: 780, ...pop(t, 0.2) })}>
          <Big size={100}>
            <Mk p={ramp(t, wf(1, "brachial"), wf(1, "plexus") + 0.6)}>Brachial Plexus</Mk>
          </Big>
          <Big size={66} color={C.matcha}>made easy</Big>
        </div>
        <Facts x={1000} y={300} w={780}
          items={[
            { t: wf(0, "lift"), text: "lift a cup · type · wave hello", bg: C.forest },
            { t: wf(0, "signal"), text: "every signal to your arm runs through ONE nerve network" },
            { t: wf(2, "spaghetti"), text: "the famous 'plate of spaghetti' of anatomy exams 🍝".replace(" 🍝", ""), bg: C.matcha },
          ]} />
      </Seg>
      <Seg t={t} a={b3} b={BE(0) + 0.1}>
        <div style={abs(PX, PY)}>
          <Plexus t={t} w={1000} lit={at(ALL, wf(4, "pattern"), 0.06)} cols={COLS_ALL(wf(4, "pattern"))} flow={wf(4, "logical")} rootLbl={wf(4, "pattern")} labels={BR_LABELS(wf(5, "nerves"), 0.12)} />
        </div>
        <div style={abs(1150, 10, { width: 640, ...pop(t, b3 + 0.1) })}>
          <Big size={58}>It has a pattern. Learn the pattern.</Big>
        </div>
        <div style={abs(1150, 190, { width: 640, display: "flex", flexDirection: "column", gap: 16 })}>
          {[
            ["5 parts, in order", wf(5, "five")],
            ["the 5 big nerves it ends in", wf(5, "five", 1)],
            ["what each nerve does", wf(5, "what")],
            ["memory tricks that stick", wf(5, "memory")],
          ].map(([txt, tt]) => (
            <div key={txt as string} style={{ ...pop(t, tt as number), display: "flex", alignItems: "center", gap: 18, background: C.card, border: `3px solid ${C.line}`, borderRadius: 24, padding: "12px 22px", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest }}>
              <div style={{ width: 46, height: 46, borderRadius: 23, background: C.matcha, color: C.paper, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>✓</div>
              {txt}
            </div>
          ))}
        </div>
        <div style={abs(1150, 620)}>
          <Chip t={t} t0={wf(6, "five")} bg={C.banana} color={C.forest} size={40}>+ 5-question quiz at the end</Chip>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 1. THE BIG PICTURE ================= */
export const SBig: React.FC = () => {
  const t = useT();
  const a = ST(1), b = BE(1);
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(11)}>
        <div style={abs(PX, PY)}>
          <Plexus t={t} w={1000} lit={at(ALL, a - 1)} flow={a} hot={[{ ids: ["DSA", "DMA", "DIA", "DSP", "DMP", "DIP"], a: wf(8, "split"), b: s_(9) }]} />
        </div>
        <div style={abs(1150, 20, { width: 640 })}>
          <div style={pop(t, s_(8))}>
            <Big size={74}>plexus = <Mk p={ramp(t, wf(8, "network"), wf(8, "network") + 0.6)}>network</Mk></Big>
          </div>
          <div style={{ marginTop: 14, ...pop(t, wf(8, "split")) }}>
            <Chip t={t} t0={wf(8, "split")} bg={C.matcha} size={36}>split · mix · rejoin</Chip>
          </div>
          <div style={{ marginTop: 50, ...pop(t, s_(9)) }}>
            <Big size={74}>brachial = <Mk p={ramp(t, wf(9, "arm"), wf(9, "arm") + 0.6)}>of the arm</Mk></Big>
          </div>
          <div style={{ marginTop: 40, ...pop(t, s_(10)), background: C.forest, borderRadius: 28, padding: "20px 28px", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper, lineHeight: 1.2 }}>
            the nerve network that supplies the <span style={{ color: C.banana }}>upper limb</span>
          </div>
        </div>
      </Seg>
      <Seg t={t} a={s_(11)} b={s_(15)}>
        <div style={abs(10, -70)}>
          <BodyRoute t={t} w={930} spine={s_(11)} neck={wf(13, "neck")} clav={wf(13, "behind")} axilla={wf(13, "armpit")} arm={s_(14)} fingers={wf(14, "fingertips")} />
        </div>
        <Facts x={1130} y={20} w={660}
          items={[
            { t: wf(11, "ventral"), text: "built from the ventral rami (front branches) of 5 spinal nerves", bg: C.forest },
            { t: s_(12), text: "C5 · C6 · C7 · C8 · T1", big: "5" },
            { t: s_(13), text: "neck → behind the clavicle → axilla", bg: C.matcha },
            { t: s_(14), text: "branches run down to the fingertips" },
          ]} />
      </Seg>
      <Seg t={t} a={s_(15)} b={b + 0.1}>
        <div style={abs(PX, PY)}>
          <Plexus t={t} w={1000} lit={at(ALL, s_(15) - 0.5)} cols={{ roots: wf(16, "roots"), trunks: wf(16, "trunks"), divisions: wf(16, "divisions"), cords: wf(16, "cords"), branches: wf(16, "branches") }}
            colHot={[
              { c: "roots", a: wf(16, "roots"), b: wf(16, "trunks") + 0.1 },
              { c: "trunks", a: wf(16, "trunks"), b: wf(16, "divisions") + 0.1 },
              { c: "divisions", a: wf(16, "divisions"), b: wf(16, "cords") + 0.1 },
              { c: "cords", a: wf(16, "cords"), b: wf(16, "branches") + 0.1 },
              { c: "branches", a: wf(16, "branches"), b: s_(17) },
              { c: "roots", a: wf(18, "streams"), b: wf(18, "split") },
              { c: "divisions", a: wf(18, "split"), b: wf(18, "regroup") },
              { c: "cords", a: wf(18, "regroup"), b: wf(18, "fan") },
              { c: "branches", a: wf(18, "fan"), b: s_(19) + 0.5 },
            ]}
            flow={s_(17)} rootLbl={s_(15)} />
        </div>
        <div style={abs(1150, 20, { width: 640 })}>
          <div style={pop(t, s_(15))}><Big size={64}>5 parts, always in the same order</Big></div>
          <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 10 }}>
            {[["Roots", "roots"], ["Trunks", "trunks"], ["Divisions", "divisions"], ["Cords", "cords"], ["Branches", "branches"]].map(([n, k], i) => (
              <div key={n} style={{ ...pop(t, wf(16, k)), display: "flex", alignItems: "center", gap: 18, fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.forest }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: [PC.root, PC.trunk, C.matchaLight, PC.ant, PC.post][i], border: `4px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>{i + 1}</div>
                {n}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 26 }}>
            <Chip t={t} t0={s_(17)} bg={C.matcha} size={34}>like a river system, running backwards</Chip>
          </div>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 2. ROOTS AND TRUNKS ================= */
export const SRootsTrunks: React.FC = () => {
  const t = useT();
  const a = ST(2), b = BE(2);
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(23)}>
        <PartTag t={t} t0={a} n={1} name="ROOTS" />
        <div style={abs(PX, PY + 20)}>
          <Plexus t={t} w={1000} lit={at(ROOTS, wf(21, "five"), 0.25)} dim={a} cols={{ roots: a }} colHot={[{ c: "roots", a: a + 0.2, b: s_(23) }]} rootLbl={wf(21, "five")} hot={[{ ids: ROOTS, a: s_(22), b: s_(23) }]} />
        </div>
        <Facts x={1130} y={20} w={660}
          items={[
            { t: s_(21), text: "roots = ventral rami of C5 → T1", bg: C.forest },
            { t: wf(21, "leave"), text: "right where they leave the spine" },
            { t: s_(22), text: "roots", big: "5", bg: C.matcha },
          ]} />
      </Seg>
      <Seg t={t} a={s_(23)} b={s_(25)}>
        <Plate {...NECK} x={0} y={0} w={900} a={s_(23) - 0.1} b={s_(25) + 0.2} zoomFrom={[1.1, 0.58, 0.3]} zoomTo={[1.5, 0.58, 0.32]}
          labels={[
            { x: 0.665, y: 0.27, text: "Anterior scalene", t: wf(23, "anterior"), side: "r" },
            { x: 0.565, y: 0.18, text: "Middle scalene", t: wf(23, "middle"), side: "l" },
            { x: 0.57, y: 0.40, text: "Brachial plexus", t: s_(24), side: "l", hot: true },
          ]} />
        <Facts x={1000} y={20} w={780}
          items={[
            { t: s_(23), text: "the roots pass BETWEEN two neck muscles", bg: C.forest },
            { t: wf(23, "anterior"), text: "anterior scalene  +  middle scalene" },
            { t: s_(24), text: "classic landmark: where the plexus first appears", bg: C.matcha },
          ]} />
        <Note t={t} t0={wf(23, "middle") + 0.6} old="Scalenus medius / anterior" x={1000} y={560} />
      </Seg>
      <Seg t={t} a={s_(25)} b={s_(28) + 0.3}>
        <Plate {...PLAN} x={0} y={0} w={880} a={s_(25) - 0.1} b={s_(28) + 0.5} zoomFrom={[1.05, 0.65, 0.3]} zoomTo={[1.45, 0.68, 0.3]}
          labels={[
            { x: 0.668, y: 0.098, text: "Dorsal scapular n.", t: wf(26, "dorsal"), side: "l", hot: true },
            { x: 0.72, y: 0.42, text: "Long thoracic n.", t: wf(27, "long"), side: "l", hot: true },
          ]} />
        <Facts x={1000} y={20} w={780}
          items={[
            { t: s_(25), text: "small nerves straight from the roots", bg: C.forest },
            { t: wf(26, "dorsal"), text: "dorsal scapular n. · C5 → rhomboids" },
            { t: wf(27, "long"), text: "long thoracic n. · C5, C6, C7 → serratus anterior", bg: C.matcha },
          ]} />
        <Note t={t} t0={wf(26, "rhomboid")} old={"“To Rhomboidei”"} x={1000} y={560} />
      </Seg>
      <Seg t={t} a={s_(28) + 0.3} b={s_(36)}>
        <PartTag t={t} t0={s_(29)} n={2} name="TRUNKS" />
        <div style={abs(PX, PY + 20)}>
          <Plexus t={t} w={1000} lit={{ ...at(ROOTS, s_(28)), TS: wf(31, "superior"), TM: wf(32, "middle"), TI: wf(33, "inferior") }} dim={s_(28) + 0.3} cols={{ roots: s_(28), trunks: s_(30) }}
            colHot={[{ c: "trunks", a: s_(30), b: s_(31) }]}
            hot={[
              { ids: ["R5", "R6", "TS"], a: s_(31), b: s_(32) },
              { ids: ["R7", "TM"], a: s_(32), b: s_(33) },
              { ids: ["R8", "R1", "TI"], a: s_(33), b: s_(34) },
              { ids: ["TS", "TM", "TI"], a: s_(34), b: s_(36) },
            ]}
            rootLbl={s_(28)}
            labels={[
              { x: 305, y: 128, text: "Superior", t: wf(31, "superior"), anchor: "middle", size: 24 },
              { x: 305, y: 273, text: "Middle", t: wf(32, "middle"), anchor: "middle", size: 24 },
              { x: 305, y: 418, text: "Inferior", t: wf(33, "inferior"), anchor: "middle", size: 24 },
            ]} />
        </div>
        <Facts x={1130} y={20} w={660}
          items={[
            { t: s_(30), text: "5 roots join → 3 trunks", bg: C.forest },
            { t: s_(31), text: "C5 + C6 = superior (upper) trunk" },
            { t: s_(32), text: "C7 alone = middle trunk", bg: C.matcha },
            { t: s_(33), text: "C8 + T1 = inferior (lower) trunk" },
          ]} />
        {t > s_(34) - 0.2 && (
          <div style={abs(1150, 20, { width: 640, height: 700, borderRadius: 40, background: C.forest, ...pop(t, s_(34)), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" })}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: C.matchaLight }}>THE PATTERN</div>
            <div style={{ display: "flex", gap: 40, marginTop: 20 }}>
              {[["2", wf(34, "two"), "on top"], ["1", wf(34, "one"), "middle"], ["2", wf(34, "two", 1), "bottom"]].map(([n, tt, l], i) => (
                <div key={i} style={{ textAlign: "center", ...pop(t, tt as number) }}>
                  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 200, lineHeight: 1, color: C.banana }}>{n}</div>
                  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.paper, opacity: ramp(t, s_(35), s_(35) + 0.4) }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Seg>
      <Seg t={t} a={s_(36)} b={b + 0.1}>
        <Seg t={t} a={s_(36)} b={s_(37) + 0.3}>
          <Plate {...NECK} x={0} y={0} w={900} a={s_(36) - 0.1} b={s_(37) + 0.5} zoomFrom={[1.15, 0.5, 0.45]} zoomTo={[1.4, 0.52, 0.45]}
            labels={[{ x: 0.57, y: 0.40, text: "Trunks", t: s_(36) + 0.3, side: "l", hot: true }]} />
        </Seg>
        <Seg t={t} a={s_(37)} b={b + 0.1}>
          <Plate {...SHOUL} x={0} y={0} w={900} a={s_(37) - 0.1} b={b + 0.3} zoomFrom={[1.0, 0.4, 0.3]} zoomTo={[1.3, 0.35, 0.3]}
            labels={[
              { x: 0.33, y: 0.12, text: "Suprascapular n.", t: wf(37, "suprascapular"), side: "r", hot: true },
              { x: 0.235, y: 0.19, text: "Supraspinatus", t: wf(37, "supraspinatus"), side: "l" },
              { x: 0.27, y: 0.45, text: "Infraspinatus", t: wf(37, "infraspinatus"), side: "r" },
            ]} />
        </Seg>
        <Facts x={1000} y={20} w={780}
          items={[
            { t: s_(36), text: "the trunks cross the posterior triangle of the neck", bg: C.forest },
            { t: wf(37, "suprascapular"), text: "superior trunk → suprascapular nerve" },
            { t: wf(37, "supraspinatus"), text: "→ supraspinatus + infraspinatus (back of the shoulder blade)", bg: C.matcha },
          ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 3. THE DIVISIONS ================= */
export const SDivisions: React.FC = () => {
  const t = useT();
  const a = ST(3), b = BE(3);
  const base = { ...at(ROOTS, a - 1), ...at(TRUNKS, a - 1) };
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(43)}>
        <PartTag t={t} t0={a} n={3} name="DIVISIONS" />
        <div style={abs(PX, PY + 20)}>
          <Plexus t={t} w={1000} lit={{ ...base, ...at(ANT, wf(40, "anterior"), 0.15), ...at(POST, wf(41, "posterior"), 0.15) }} dim={a} cols={{ roots: a, trunks: a, divisions: s_(39) }}
            colHot={[{ c: "divisions", a: s_(39), b: s_(43) }]}
            hot={[{ ids: ANT, a: wf(40, "anterior"), b: s_(41) }, { ids: POST, a: wf(41, "posterior"), b: s_(42) }, { ids: [...ANT, ...POST], a: s_(42), b: s_(43) }]}
            rootLbl={a}
            labels={[
              { x: 445, y: 205, text: "anterior", t: wf(40, "anterior"), anchor: "middle", size: 22, color: "#3E77AA" },
              { x: 445, y: 505, text: "posterior", t: wf(41, "posterior"), anchor: "middle", size: 22, color: "#B5652B" },
            ]} />
        </div>
        <Facts x={1130} y={20} w={660}
          items={[
            { t: s_(39), text: "passing beneath the clavicle, each trunk splits in 2", bg: C.forest },
            { t: wf(40, "anterior"), text: "anterior division → front of the limb", bg: "#3E77AA" },
            { t: wf(41, "posterior"), text: "posterior division → back of the limb", bg: "#B5652B" },
            { t: s_(42), text: "3 trunks × 2", big: "= 6", bg: C.matcha },
          ]} />
      </Seg>
      <Seg t={t} a={s_(43)} b={s_(45)}>
        <Plate {...ARMUP} x={120} y={0} w={616} a={s_(43) - 0.1} b={s_(45) + 0.2} zoomFrom={[1.0, 0.55, 0.4]} zoomTo={[1.25, 0.55, 0.42]}
          labels={[
            { x: 0.5, y: 0.36, text: "Biceps brachii", t: wf(44, "flexor"), side: "r" },
            { x: 0.53, y: 0.55, text: "Brachialis", t: wf(44, "bend"), side: "r" },
          ]} />
        <div style={abs(1000, 20, { width: 780 })}>
          <div style={pop(t, s_(43))}><Big size={64}>Why it matters</Big></div>
          <div style={{ marginTop: 30, ...pop(t, s_(44)), background: "#3E77AA", borderRadius: 30, padding: "24px 32px", fontFamily: FONT, fontWeight: 800 }}>
            <div style={{ fontSize: 30, letterSpacing: 4, color: C.banana }}>FRONT OF THE ARM</div>
            <div style={{ fontSize: 58, color: C.paper }}>flexors = <Mk p={ramp(t, wf(44, "bend"), wf(44, "bend") + 0.5)}><span style={{ color: C.forest }}>bend</span></Mk></div>
          </div>
        </div>
      </Seg>
      <Seg t={t} a={s_(45)} b={s_(46)}>
        <Plate {...BACKARM} x={180} y={0} w={471} a={s_(45) - 0.1} b={s_(46) + 0.2} zoomFrom={[1.0, 0.5, 0.3]} zoomTo={[1.25, 0.5, 0.3]}
          labels={[{ x: 0.55, y: 0.27, text: "Triceps", t: wf(45, "extensor"), side: "r" }]} />
        <div style={abs(1000, 20, { width: 780 })}>
          <Big size={64}>Why it matters</Big>
          <div style={{ marginTop: 30, background: "#3E77AA", borderRadius: 30, padding: "24px 32px", fontFamily: FONT, fontWeight: 800, opacity: 0.45 }}>
            <div style={{ fontSize: 30, letterSpacing: 4, color: C.banana }}>FRONT OF THE ARM</div>
            <div style={{ fontSize: 58, color: C.paper }}>flexors = bend</div>
          </div>
          <div style={{ marginTop: 24, ...pop(t, s_(45)), background: "#B5652B", borderRadius: 30, padding: "24px 32px", fontFamily: FONT, fontWeight: 800 }}>
            <div style={{ fontSize: 30, letterSpacing: 4, color: C.banana }}>BACK OF THE ARM</div>
            <div style={{ fontSize: 58, color: C.paper }}>extensors = <Mk p={ramp(t, wf(45, "straighten"), wf(45, "straighten") + 0.5)}><span style={{ color: C.forest }}>straighten</span></Mk></div>
          </div>
        </div>
      </Seg>
      <Seg t={t} a={s_(46)} b={b + 0.1}>
        <div style={abs(PX, PY)}>
          <Plexus t={t} w={1000} lit={{ ...base, ...at([...ANT, ...POST], a - 1) }} cols={{ roots: a, trunks: a, divisions: a }} rootLbl={a} flow={s_(46)}
            hot={[{ ids: ANT, a: wf(46, "front"), b: wf(46, "back") }, { ids: POST, a: wf(46, "back"), b: s_(47) }]}
            labels={[
              { x: 445, y: 205, text: "FRONT TEAM", t: wf(46, "front"), anchor: "middle", size: 22, color: "#3E77AA" },
              { x: 445, y: 505, text: "BACK TEAM", t: wf(46, "back"), anchor: "middle", size: 22, color: "#B5652B" },
            ]} />
        </div>
        <Facts x={1130} y={20} w={660}
          items={[
            { t: s_(46), text: "the plexus sorts its fibers:", bg: C.forest },
            { t: wf(46, "front"), text: "front team → flexors", bg: "#3E77AA" },
            { t: wf(46, "back"), text: "back team → extensors", bg: "#B5652B" },
            { t: s_(47), text: "this explains the next step…" },
          ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 4. THE CORDS ================= */
export const SCords: React.FC = () => {
  const t = useT();
  const a = ST(4), b = BE(4);
  const base = { ...at(ROOTS, a - 1), ...at(TRUNKS, a - 1), ...at([...ANT, ...POST], a - 1) };
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(50)}>
        <PartTag t={t} t0={a} n={4} name="CORDS" />
        <div style={abs(PX, PY + 20)}>
          <Plexus t={t} w={1000} lit={{ ...base, ...at(CORDS, wf(49, "three"), 0.2) }} dim={a} cols={{ roots: a, trunks: a, divisions: a, cords: wf(49, "regroup") }} colHot={[{ c: "cords", a: wf(49, "regroup"), b: s_(50) + 0.3 }]}
            hot={[{ ids: CORDS, a: wf(49, "three"), b: s_(50) + 0.3 }]} rootLbl={a} />
        </div>
        <Facts x={1130} y={20} w={660}
          items={[
            { t: wf(49, "axilla"), text: "in the axilla (armpit)", bg: C.forest },
            { t: wf(49, "regroup"), text: "6 divisions regroup into", big: "3 cords", bg: C.matcha },
          ]} />
      </Seg>
      <Seg t={t} a={s_(50)} b={s_(52)}>
        <Plate {...AXIL} x={0} y={0} w={860} a={s_(50) - 0.1} b={s_(52) + 0.2} zoomFrom={[1.05, 0.5, 0.35]} zoomTo={[1.45, 0.5, 0.33]}
          labels={[{ x: 0.5, y: 0.335, text: "Axillary artery", t: wf(51, "axillary"), side: "r", hot: true }]} />
        <Facts x={1000} y={20} w={780}
          items={[
            { t: s_(50), text: "a clever naming system", bg: C.forest },
            { t: wf(51, "named"), text: "cords are named by where they sit around the AXILLARY ARTERY", bg: C.red },
            { t: wf(51, "main"), text: "= the main artery of the armpit" },
          ]} />
      </Seg>
      <Seg t={t} a={s_(52)} b={s_(58)}>
        <div style={abs(80, 10)}>
          <CordsXS t={t} w={800} art={s_(52) - 0.2} lat={wf(52, "lateral")} med={wf(54, "medial")} post={wf(56, "posterior")}
            hot={t < s_(54) ? "Lateral" : t < s_(56) ? "Medial" : "Posterior"} hotA={t < s_(54) ? wf(52, "lateral") : t < s_(56) ? wf(54, "medial") : wf(56, "posterior")} />
        </div>
        <Facts x={1000} y={20} w={780}
          items={[
            { t: wf(52, "lateral"), text: "LATERAL cord · outer side", bg: "#3E77AA" },
            { t: s_(53), text: "anterior divisions of superior + middle trunks → C5, C6, C7" },
            { t: wf(54, "medial"), text: "MEDIAL cord · inner side · anterior division of inferior trunk → C8, T1", bg: "#3E77AA" },
            { t: wf(56, "posterior"), text: "POSTERIOR cord · behind · all 3 posterior divisions → C5 – T1", bg: "#B5652B" },
          ]} />
      </Seg>
      <Seg t={t} a={s_(58)} b={b + 0.1}>
        <div style={abs(PX, PY)}>
          <Plexus t={t} w={1000} lit={{ ...base, ...at(CORDS, a - 1) }} cols={{ roots: a, trunks: a, divisions: a, cords: a }} rootLbl={a} artery={s_(58)}
            hot={[{ ids: ["DSA", "DMA", "DIA", "CL", "CM"], a: s_(59), b: s_(60) }, { ids: ["DSP", "DMP", "DIP", "CP"], a: s_(60), b: b }]}
            labels={[
              { x: 580, y: 118, text: "Lateral cord", t: s_(58), anchor: "middle", size: 22 },
              { x: 580, y: 300, text: "Medial cord", t: s_(58) + 0.15, anchor: "middle", size: 22 },
              { x: 580, y: 590, text: "Posterior cord", t: s_(58) + 0.3, anchor: "middle", size: 22 },
              { x: 700, y: 210, text: "axillary a.", t: s_(58) + 0.4, anchor: "middle", size: 20, color: C.red },
            ]} />
        </div>
        <Facts x={1130} y={20} w={660}
          items={[
            { t: s_(58), text: "notice the pattern", bg: C.forest },
            { t: s_(59), text: "lateral + medial cords = FRONT team", bg: "#3E77AA" },
            { t: s_(60), text: "posterior cord = the whole BACK team", bg: "#B5652B" },
          ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 5. THE FIVE TERMINAL BRANCHES ================= */
export const SBranches: React.FC = () => {
  const t = useT();
  const a = ST(5), b = BE(5);
  const base = at(ALL.filter((x) => !BRS.includes(x)), a - 1);
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(63)}>
        <PartTag t={t} t0={a} n={5} name="BRANCHES" />
        <div style={abs(PX, PY + 20)}>
          <Plexus t={t} w={1000} lit={{ ...base, ...at(BRS, wf(62, "five"), 0.1) }} cols={{ ...COLS_ALL(a), branches: wf(62, "terminal") }} colHot={[{ c: "branches", a: wf(62, "terminal"), b: s_(63) }]}
            hot={[{ ids: BRS, a: wf(62, "five"), b: s_(63) }]} rootLbl={a} labels={BR_LABELS(wf(62, "terminal"), 0.15)} />
        </div>
        <Facts x={1130} y={20} w={660}
          items={[
            { t: s_(62), text: "3 cords end in", big: "5 terminal nerves", bg: C.forest },
            { t: wf(62, "absolutely"), text: "the ones you absolutely need to know", bg: C.matcha },
          ]} />
      </Seg>
      {/* 1 musculocutaneous */}
      <Seg t={t} a={s_(63)} b={s_(66)}>
        <Plate {...ARMUP} x={100} y={0} w={616} a={s_(63) - 0.1} b={s_(66) + 0.2} zoomFrom={[1.1, 0.5, 0.3]} zoomTo={[1.35, 0.5, 0.38]}
          labels={[
            { x: 0.43, y: 0.27, text: "Coracobrachialis", t: wf(64, "coracobrachialis"), side: "l" },
            { x: 0.5, y: 0.36, text: "Biceps brachii", t: wf(64, "biceps"), side: "r", hot: true },
            { x: 0.53, y: 0.55, text: "Brachialis", t: wf(64, "brachialis"), side: "r" },
          ]} />
        <BranchHead t={t} t0={s_(63)} n={1} name="Musculocutaneous" from="lateral cord · C5–C7" />
        <Facts x={1000} y={230} w={780}
          items={[
            { t: s_(64), text: "front of the arm: biceps brachii · brachialis · coracobrachialis", bg: "#3E77AA" },
            { t: s_(65), text: "→ flexes the elbow", big: "💪".replace("💪", "BEND"), bg: C.matcha },
          ]} />
      </Seg>
      {/* 2 axillary */}
      <Seg t={t} a={s_(66)} b={s_(69)}>
        <Plate {...SHOUL} x={0} y={0} w={900} a={s_(66) - 0.1} b={s_(69) + 0.2} zoomFrom={[1.05, 0.55, 0.45]} zoomTo={[1.45, 0.55, 0.45]}
          labels={[
            { x: 0.535, y: 0.52, text: "Axillary n.", t: wf(66, "axillary"), side: "r", hot: true },
            { x: 0.66, y: 0.33, text: "Deltoid", t: wf(67, "deltoid"), side: "r" },
            { x: 0.44, y: 0.51, text: "Teres minor", t: wf(67, "teres"), side: "l" },
          ]} />
        <BranchHead t={t} t0={s_(66)} n={2} name="Axillary" from="posterior cord · C5, C6" />
        <Facts x={1000} y={230} w={780}
          items={[
            { t: s_(67), text: "wraps around the back of the humerus → deltoid + teres minor", bg: "#B5652B" },
            { t: s_(68), text: "deltoid = main muscle that lifts the arm out to the side", bg: C.matcha },
          ]} />
        <Note t={t} t0={wf(67, "deltoid") + 0.5} old="Deltoideus" x={1000} y={620} />
      </Seg>
      {/* 3 radial */}
      <Seg t={t} a={s_(69)} b={s_(72)}>
        <Plate {...BACKARM} x={200} y={0} w={471} a={s_(69) - 0.1} b={s_(72) + 0.2} zoomFrom={[1.05, 0.5, 0.35]} zoomTo={[1.3, 0.52, 0.4]}
          labels={[
            { x: 0.55, y: 0.40, text: "Radial n.", t: wf(69, "radial"), side: "r", hot: true },
            { x: 0.56, y: 0.26, text: "Triceps", t: wf(70, "triceps"), side: "r" },
          ]} />
        <BranchHead t={t} t0={s_(69)} n={3} name="Radial" from="posterior cord · biggest branch" />
        <Facts x={1000} y={230} w={780}
          items={[
            { t: s_(70), text: "triceps + forearm extensors", bg: "#B5652B" },
            { t: s_(71), text: "straightens the elbow, wrist and fingers", big: "STRAIGHTEN", bg: C.matcha },
          ]} />
      </Seg>
      {/* 4 median */}
      <Seg t={t} a={s_(72)} b={s_(74)}>
        <div style={abs(PX, PY)}>
          <Plexus t={t} w={1000} lit={at(ALL, a - 1)} dim={s_(72)} focus cols={COLS_ALL(a)} rootLbl={a}
            hot={[{ ids: ["BMD"], a: s_(72), b: s_(74) + 0.3 }, { ids: ["CL", "BML"], a: wf(73, "lateral"), b: s_(74) + 0.3 }, { ids: ["CM", "BMM"], a: wf(73, "medial"), b: s_(74) + 0.3 }]}
            labels={[{ x: 822, y: 255, text: "Median", t: s_(72), size: 27, color: C.banana }, { x: 690, y: 175, text: "lateral root", t: wf(73, "lateral"), anchor: "end", size: 20 }, { x: 690, y: 330, text: "medial root", t: wf(73, "medial"), anchor: "end", size: 20 }]} />
        </div>
        <BranchHead t={t} t0={s_(72)} n={4} name="Median" from="lateral + medial cords" x={1130} w={660} />
        <Facts x={1130} y={230} w={660}
          items={[
            { t: wf(73, "two"), text: "special: formed by TWO roots", bg: "#3E77AA" },
            { t: wf(73, "lateral"), text: "one from the lateral cord + one from the medial cord" },
          ]} />
      </Seg>
      <Seg t={t} a={s_(74)} b={s_(76)}>
        <Plate {...FORE} x={0} y={0} w={460} a={s_(74) - 0.1} b={s_(76) + 0.2} zoomFrom={[1.0, 0.5, 0.4]} zoomTo={[1.15, 0.55, 0.55]}
          labels={[{ x: 0.42, y: 0.42, text: "Median n.", t: s_(74) + 0.2, side: "r", hot: true }]} />
        <div style={abs(500, 110)}>
          <HandIcon t={t} w={420} thenar={wf(74, "thenar")} />
        </div>
        <Facts x={1130} y={20} w={660}
          items={[
            { t: s_(74), text: "most forearm flexors", bg: "#3E77AA" },
            { t: wf(74, "thenar"), text: "thenar muscles at the base of the thumb" },
            { t: s_(75), text: "thumb → fingertips (opposition)", bg: C.matcha },
          ]} />
      </Seg>
      {/* 5 ulnar */}
      <Seg t={t} a={s_(76)} b={s_(78)}>
        <div style={abs(PX, PY)}>
          <Plexus t={t} w={1000} lit={at(ALL, a - 1)} dim={s_(76)} focus cols={COLS_ALL(a)} rootLbl={a}
            hot={[{ ids: ["R8", "R1", "TI", "DIA", "CM", "BU"], a: s_(76), b: s_(78) + 0.3 }]}
            labels={[{ x: 822, y: 355, text: "Ulnar", t: s_(76), size: 27, color: C.banana }]} />
        </div>
        <BranchHead t={t} t0={s_(76)} n={5} name="Ulnar" from="medial cord · C8, T1" x={1130} w={660} />
        <Facts x={1130} y={230} w={660}
          items={[
            { t: wf(76, "continuation"), text: "continuation of the medial cord", bg: "#3E77AA" },
            { t: s_(77), text: "most of the small muscles inside the hand → spread + close the fingers", bg: C.matcha },
          ]} />
      </Seg>
      <Seg t={t} a={s_(78)} b={b + 0.1}>
        <Plate {...ARMUP} x={60} y={0} w={616} a={s_(78) - 0.1} b={b + 0.3} zoomFrom={[1.1, 0.4, 0.6]} zoomTo={[1.5, 0.38, 0.7]}
          labels={[{ x: 0.39, y: 0.62, text: "Ulnar n.", t: s_(78) + 0.2, side: "l", hot: true }]} />
        <div style={abs(720, 140)}>
          <HandIcon t={t} w={360} ulnar={wf(79, "ring")} zap={wf(79, "zing")} />
        </div>
        <div style={abs(1130, 40, { width: 660 })}>
          <div style={pop(t, wf(79, "funny"))}><Big size={70}>"Funny bone"?</Big></div>
          <div style={{ marginTop: 24, ...pop(t, wf(79, "ring")) }}>
            <Chip t={t} t0={wf(79, "ring")} bg={C.banana} color={C.forest} size={38}>zing → ring + little fingers</Chip>
          </div>
          <div style={{ marginTop: 24, ...pop(t, wf(79, "ulnar")), background: C.forest, borderRadius: 28, padding: "20px 28px", fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.paper }}>
            it's the <span style={{ color: C.banana }}>ulnar nerve</span> — not a bone at all
          </div>
        </div>
      </Seg>
    </Stage>
  );
};
const BranchHead: React.FC<{ t: number; t0: number; n: number; name: string; from: string; x?: number; w?: number }> = ({ t, t0, n, name, from, x = 1000, w = 780 }) => (
  <div style={abs(x, 20, { width: w, ...pop(t, t0) })}>
    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, letterSpacing: 6, color: C.matcha }}>BRANCH {n} / 5</div>
    <Big size={n === 1 ? 70 : 84}>{name}</Big>
    <div style={{ marginTop: 8 }}>
      <Chip t={t} t0={t0 + 0.3} bg={C.forest} size={30}>from: {from}</Chip>
    </div>
  </div>
);

/* ================= 6. HOW IT ALL CONNECTS ================= */
const Steps: React.FC<{ t: number; title: string; color: string; steps: [string, number][] }> = ({ t, title, color, steps }) => (
  <div style={abs(1150, 20, { width: 640 })}>
    <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 5, color: C.matcha }}>TRACE IT</div>
    <Big size={70}>{title}</Big>
    <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
      {steps.map(([s, tt], i) => {
        const on = ramp(t, tt, tt + 0.3);
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, opacity: 0.25 + 0.75 * on, transform: `translateX(${(1 - on) * 30}px)` }}>
            <div style={{ width: 52, height: 52, borderRadius: 26, background: on > 0.5 ? color : C.line, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.forest }}>{s}</div>
          </div>
        );
      })}
    </div>
  </div>
);
export const SConnect: React.FC = () => {
  const t = useT();
  const a = ST(6), b = BE(6);
  const u = [s_(82), s_(83), s_(84), s_(85), s_(86)];
  const r = [s_(88), s_(89), wf(89, "posterior"), s_(90), s_(91)];
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(87)}>
        <div style={abs(PX, PY)}>
          <Plexus t={t} w={1000} lit={at(ALL, a - 1)} dim={s_(82)} focus cols={COLS_ALL(a)} rootLbl={a} flow={s_(86)}
            hot={[
              { ids: ["R8", "R1"], a: u[0], b: s_(87) + 0.3 },
              { ids: ["TI"], a: u[1], b: s_(87) + 0.3 },
              { ids: ["DIA"], a: u[2], b: s_(87) + 0.3 },
              { ids: ["CM"], a: u[3], b: s_(87) + 0.3 },
              { ids: ["BU"], a: u[4], b: s_(87) + 0.3 },
            ]}
            labels={[{ x: 822, y: 355, text: "Ulnar", t: u[4], size: 27, color: C.banana }]} />
        </div>
        <Steps t={t} title="Ulnar nerve" color="#3E77AA" steps={[["C8 + T1 roots", u[0]], ["inferior trunk", u[1]], ["anterior division", u[2]], ["medial cord", u[3]], ["ulnar nerve → hand", u[4]]]} />
      </Seg>
      <Seg t={t} a={s_(87)} b={s_(92)}>
        <div style={abs(PX, PY)}>
          <Plexus t={t} w={1000} lit={at(ALL, a - 1)} dim={s_(88)} focus cols={COLS_ALL(a)} rootLbl={a} flow={s_(91)}
            hot={[
              { ids: ROOTS, a: r[0], b: s_(92) + 0.3 },
              { ids: TRUNKS, a: r[1], b: s_(92) + 0.3 },
              { ids: POST, a: r[2], b: s_(92) + 0.3 },
              { ids: ["CP"], a: r[3], b: s_(92) + 0.3 },
              { ids: ["BRA"], a: r[4], b: s_(92) + 0.3 },
            ]}
            labels={[{ x: 822, y: 610, text: "Radial", t: r[4], size: 27, color: C.banana }]} />
        </div>
        <Steps t={t} title="Radial nerve" color="#B5652B" steps={[["all 5 roots C5 – T1", r[0]], ["all 3 trunks", r[1]], ["3 posterior divisions", r[2]], ["posterior cord", r[3]], ["radial nerve → back of arm", r[4]]]} />
      </Seg>
      <Seg t={t} a={s_(92)} b={b + 0.1}>
        <div style={abs(PX, PY)}>
          <Plexus t={t} w={1000} lit={at(ALL, a - 1)} cols={COLS_ALL(a)} rootLbl={a} flow={s_(92)}
            hot={[{ ids: ["DSA", "DMA", "DIA", "CL", "CM", "BMC", "BML", "BMM", "BMD", "BU"], a: s_(93), b: s_(94) }, { ids: ["DSP", "DMP", "DIP", "CP", "BAX", "BRA"], a: s_(94), b: s_(95) }]}
            labels={BR_LABELS(s_(92), 0.05)} />
        </div>
        <div style={abs(1150, 20, { width: 640 })}>
          <div style={pop(t, s_(92))}><Big size={70}>One rule</Big></div>
          <div style={{ marginTop: 24, ...pop(t, s_(93)), background: "#3E77AA", borderRadius: 28, padding: "20px 28px", fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.paper }}>front divisions → front cords → <span style={{ color: C.banana }}>bending</span> muscles</div>
          <div style={{ marginTop: 18, ...pop(t, s_(94)), background: "#B5652B", borderRadius: 28, padding: "20px 28px", fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.paper }}>back divisions → back cord → <span style={{ color: C.banana }}>straightening</span> muscles</div>
          <div style={{ marginTop: 24 }}><Chip t={t} t0={s_(95)} bg={C.forest} size={34}>rebuild it on a blank page ✎</Chip></div>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 7. MEMORY TRICKS ================= */
const TrickCard: React.FC<{ t: number; t0: number; n: number; title: string; children: React.ReactNode }> = ({ t, t0, n, title, children }) => (
  <div style={abs(0, 0, { width: 1800, height: 740, borderRadius: 44, background: C.forest, ...pop(t, t0, 0.35) })}>
    <div style={abs(60, 44, { fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: C.matchaLight })}>TRICK {n}</div>
    <div style={abs(60, 90, { fontFamily: FONT, fontWeight: 800, fontSize: 60, color: C.paper })}>{title}</div>
    {children}
  </div>
);
export const STricks: React.FC = () => {
  const t = useT();
  const a = ST(7), b = BE(7);
  const rt: [string, string][] = [["Really", "Roots"], ["Tired?", "Trunks"], ["Drink", "Divisions"], ["Cold", "Cords"], ["Brew.", "Branches"]];
  const cnt: [string, string][] = [["5", "roots"], ["3", "trunks"], ["6", "divisions"], ["3", "cords"], ["5", "branches"]];
  const star: [string, string, string][] = [["S", "ubscapular nerves", "subscapular"], ["T", "horacodorsal", "thoracodorsal"], ["A", "xillary", "axillary"], ["R", "adial", "radial"]];
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(100)}>
        <TrickCard t={t} t0={a} n={1} title="The 5 parts, in order">
          <div style={abs(0, 250, { width: 1800, display: "flex", justifyContent: "center", gap: 34 })}>
            {rt.map(([w, part], i) => (
              <div key={w} style={{ textAlign: "center", fontFamily: FONT, fontWeight: 800 }}>
                <div style={{ ...pop(t, SEG[98].w[i]), fontSize: 88, color: C.paper, lineHeight: 1 }}>
                  <span style={{ color: C.banana, fontSize: 128 }}>{w[0]}</span>
                  {w.slice(1)}
                </div>
                <div style={{ ...pop(t, SEG[99].w[i]), marginTop: 34, fontSize: 46, color: C.forest, background: C.banana, borderRadius: 20, padding: "8px 24px 12px" }}>{part}</div>
              </div>
            ))}
          </div>
          <div style={abs(0, 620, { width: 1800, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.matchaLight, opacity: ramp(t, s_(99) + 1.5, s_(99) + 2) })}>Roots · Trunks · Divisions · Cords · Branches</div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={s_(100)} b={s_(103)}>
        <TrickCard t={t} t0={s_(100)} n={2} title="The counts">
          <div style={abs(0, 220, { width: 1800, display: "flex", justifyContent: "center", gap: 70 })}>
            {cnt.map(([n, l], i) => (
              <div key={i} style={{ textAlign: "center", fontFamily: FONT, fontWeight: 800 }}>
                <div style={{ ...pop(t, SEG[101].w[i]), fontSize: 220, lineHeight: 1, color: C.banana }}>{n}</div>
                <div style={{ ...pop(t, wf(102, l.slice(0, 5))), marginTop: 10, fontSize: 44, color: C.paper }}>{l}</div>
              </div>
            ))}
          </div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={s_(103)} b={s_(106)}>
        <div style={abs(PX, PY)}>
          <Plexus t={t} w={1000} lit={at(ALL, a - 1)} dim={wf(104, "musculocutaneous")} focus cols={COLS_ALL(a)}
            hot={[
              { ids: ["BMC"], a: wf(104, "musculocutaneous"), b: s_(106) },
              { ids: ["CL"], a: wf(104, "lateral"), b: s_(106) },
              { ids: ["BML", "BMD", "BMM"], a: wf(104, "median"), b: s_(106) },
              { ids: ["CM"], a: wf(104, "medial"), b: s_(106) },
              { ids: ["BU"], a: wf(104, "ulnar"), b: s_(106) },
            ]}
            labels={[
              { x: 822, y: 80, text: "Musculocutaneous", t: wf(104, "musculocutaneous"), size: 27 },
              { x: 580, y: 118, text: "Lateral cord", t: wf(104, "lateral"), anchor: "middle", size: 22 },
              { x: 822, y: 255, text: "Median", t: wf(104, "median"), size: 27 },
              { x: 580, y: 300, text: "Medial cord", t: wf(104, "medial"), anchor: "middle", size: 22 },
              { x: 822, y: 355, text: "Ulnar", t: wf(104, "ulnar"), size: 27 },
            ]} />
        </div>
        <div style={abs(1150, 20, { width: 640 })}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: C.matcha, ...pop(t, s_(103)) }}>TRICK 3</div>
          <div style={{ ...pop(t, wf(104, "letter")), fontFamily: FONT, fontWeight: 800, fontSize: 300, lineHeight: 1, color: C.banana, WebkitTextStroke: `8px ${C.forest}` }}>M</div>
          <div style={{ marginTop: 10, ...pop(t, s_(105)), background: C.forest, borderRadius: 28, padding: "20px 28px", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper }}>find the <span style={{ color: C.banana }}>M</span> first — the rest falls into place</div>
        </div>
      </Seg>
      <Seg t={t} a={s_(106)} b={s_(109)}>
        <Plate {...AXIL} x={0} y={0} w={860} a={s_(106) - 0.1} b={s_(109) + 0.2} zoomFrom={[1.05, 0.45, 0.6]} zoomTo={[1.35, 0.45, 0.68]}
          labels={[
            { x: 0.405, y: 0.68, text: "Thoracodorsal n.", t: wf(108, "thoracodorsal"), side: "l", hot: true },
            { x: 0.47, y: 0.86, text: "Subscapular nn.", t: wf(108, "subscapular"), side: "l" },
          ]} />
        <div style={abs(940, 0, { width: 860, height: 740, borderRadius: 44, background: C.forest, ...pop(t, s_(106)) })}>
          <div style={abs(50, 40, { fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: C.matchaLight })}>TRICK 4 · POSTERIOR CORD</div>
          <div style={abs(50, 95, { display: "flex", flexDirection: "column", gap: 0 })}>
            {star.map(([L, rest, k]) => (
              <div key={L} style={{ display: "flex", alignItems: "baseline", fontFamily: FONT, fontWeight: 800 }}>
                <span style={{ ...pop(t, SEG[107].w[SEG[107].t.length - 1] + "STAR".indexOf(L) * 0.15), fontSize: 104, lineHeight: 1.1, color: C.banana, width: 100, display: "inline-block" }}>{L}</span>
                <span style={{ fontSize: 56, color: C.paper, opacity: ramp(t, wf(108, k), wf(108, k) + 0.3) }}>{rest}</span>
              </div>
            ))}
          </div>
        </div>
        <Note t={t} t0={wf(108, "thoracodorsal") + 0.5} old="long subscapular nerve" x={990} y={660} />
      </Seg>
      <Seg t={t} a={s_(109)} b={b + 0.1}>
        <div style={abs(120, 100)}>
          <StudyCard t={t} flip={wf(110, "roots")} front="Axillary nerve" back="Posterior cord · C5, C6 → deltoid + teres minor" w={760} />
        </div>
        <div style={abs(1000, 80, { width: 780 })}>
          <div style={pop(t, s_(109))}><Big size={64}>Make it stick</Big></div>
          <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={pop(t, wf(110, "draw"))}><Chip t={t} t0={wf(110, "draw")} bg={C.matcha} size={40}>draw it from memory · 1× a day</Chip></div>
            <div style={pop(t, wf(110, "test"))}><Chip t={t} t0={wf(110, "test")} bg={C.forest} size={40}>flashcards: nerve ↔ roots + muscles</Chip></div>
          </div>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 8. QUIZ ================= */
type Q = { n: number; si: number; q: string; a: string; visual: (t: number, r: number, ans: number, ask: number) => React.ReactNode };
const QS: Q[] = [
  {
    n: 1, si: 113, q: "Which spinal nerves form the brachial plexus?", a: "C5 → T1 (5 roots)",
    visual: (t, r, ans) => <div style={abs(PX, PY)}><Plexus t={t} w={1000} lit={r ? at(ROOTS, ans) : {}} cols={{ roots: 0 }} rootLbl={r ? ans : undefined} hot={r ? [{ ids: ROOTS, a: ans, b: ans + 4 }] : []} /></div>,
  },
  {
    n: 2, si: 115, q: "Which trunk is formed by C7 alone?", a: "Middle trunk",
    visual: (t, r, ans) => <div style={abs(PX, PY)}><Plexus t={t} w={1000} lit={{ ...at(ROOTS, 0), ...at(TRUNKS, 0) }} cols={{ roots: 0, trunks: 0 }} rootLbl={0} hot={r ? [{ ids: ["R7", "TM"], a: ans, b: ans + 4 }] : []} labels={r ? [{ x: 305, y: 273, text: "Middle trunk", t: ans, anchor: "middle", size: 24, color: C.banana }] : []} /></div>,
  },
  {
    n: 3, si: 117, q: "The cords are named for their position around which structure?", a: "Axillary artery",
    visual: (t, r, ans, ask) => <div style={abs(120, 10)}><CordsXS t={t} w={800} art={r ? ans : 9999} lat={ask} med={ask} post={ask} /></div>,
  },
  {
    n: 4, si: 119, q: "Which nerve supplies the deltoid?", a: "Axillary nerve",
    visual: (t, r, ans, ask) => <Plate {...SHOUL} x={0} y={0} w={900} a={ask - 0.2} b={ans + 3} zoomFrom={[1.1, 0.55, 0.42]} zoomTo={[1.35, 0.55, 0.45]} labels={r ? [{ x: 0.535, y: 0.52, text: "Axillary n.", t: ans, side: "r", hot: true }, { x: 0.66, y: 0.33, text: "Deltoid", t: ans + 0.2, side: "r" }] : [{ x: 0.66, y: 0.33, text: "Deltoid", t: ask, side: "r" }]} />,
  },
  {
    n: 5, si: 121, q: "The radial nerve comes from which cord?", a: "Posterior cord",
    visual: (t, r, ans) => <div style={abs(PX, PY)}><Plexus t={t} w={1000} lit={at(ALL, 0)} cols={COLS_ALL(0)} rootLbl={0} hot={r ? [{ ids: ["CP", "BRA"], a: ans, b: ans + 4 }] : [{ ids: ["BRA"], a: 0, b: 9999 }]} labels={r ? [{ x: 822, y: 610, text: "Radial", t: 0, size: 27 }, { x: 580, y: 590, text: "Posterior cord", t: ans, anchor: "middle", size: 22, color: C.banana }] : [{ x: 822, y: 610, text: "Radial", t: 0, size: 27 }]} /></div>,
  },
];
export const SQuiz: React.FC = () => {
  const t = useT();
  const a = ST(8), b = BE(8);
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(113) - 0.2}>
        <div style={abs(0, 0, { width: 1800, height: 740, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" })}>
          <div style={pop(t, a)}><Big size={150}>QUIZ</Big></div>
          <div style={{ ...pop(t, s_(112)), marginTop: 20 }}><Chip t={t} t0={s_(112)} bg={C.banana} color={C.forest} size={44}>5 questions · pause if you need more time</Chip></div>
        </div>
      </Seg>
      {QS.map((q, i) => {
        const ask = s_(q.si), pause = e_(q.si), ans = s_(q.si + 1);
        const end = i < QS.length - 1 ? s_(QS[i + 1].si) - 0.2 : s_(123) - 0.2;
        const reveal = t >= ans ? 1 : 0;
        const cdT = t - (pause + 0.2);
        const n = cdT < 0 ? null : cdT < 1.0 ? 3 : cdT < 2.0 ? 2 : cdT < 3.0 ? 1 : null;
        const cdK = n ? ramp(t, pause + 0.2 + (3 - n), pause + 0.2 + (3 - n) + 0.18) : 0;
        return (
          <Seg key={q.n} t={t} a={ask - 0.2} b={end}>
            {q.visual(t, reveal, ans, ask)}
            {!reveal && (
              <div style={abs(390, 250, { ...pop(t, ask + 0.2), width: 220, height: 220, borderRadius: 110, background: C.banana, border: `6px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 160, color: C.forest })}>?</div>
            )}
            <div style={abs(1040, 0, { width: 760, height: 740, borderRadius: 44, background: C.forest, ...pop(t, ask - 0.15, 0.35) })}>
              <div style={abs(50, 46, { fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: C.banana })}>QUESTION {q.n} / 5</div>
              <div style={abs(50, 110, { width: 660, fontFamily: FONT, fontWeight: 800, fontSize: 56, lineHeight: 1.12, color: C.paper })}>{q.q}</div>
              {n && <div style={abs(0, 470, { width: 760, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 190, lineHeight: 1, color: C.banana, transform: `scale(${1.35 - 0.35 * cdK})` })}>{n}</div>}
              {reveal > 0 && (
                <div style={abs(50, 520, { ...pop(t, ans), width: 660, background: C.banana, borderRadius: 26, padding: "20px 30px 26px", boxSizing: "border-box", fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.forest, textAlign: "center" })}>✓ {q.a}</div>
              )}
            </div>
          </Seg>
        );
      })}
      <Seg t={t} a={s_(123) - 0.2} b={b + 0.1}>
        <div style={abs(0, 0, { width: 1800, height: 740, borderRadius: 44, background: C.card, border: `4px solid ${C.line}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" })}>
          <Big size={110}>Your score: <span style={{ color: C.matcha }}>? / 5</span></Big>
          <div style={{ marginTop: 30, ...pop(t, wf(123, "tell")) }}><Chip t={t} t0={wf(123, "tell")} bg={C.forest} size={46}>tell me in the comments</Chip></div>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 9. RECAP + OUTRO ================= */
export const SRecap: React.FC = () => {
  const t = useT();
  const a = ST(9);
  const items: [string, string, number, string][] = [
    ["C5 → T1", "the nerve network of the upper limb", s_(125), PC.root],
    ["Route", "neck → behind the clavicle → axilla", s_(126), PC.trunk],
    ["R · T · D · C · B", "Really Tired? Drink Cold Brew.", s_(127), C.banana],
    ["5 · 3 · 6 · 3 · 5", "roots · trunks · divisions · cords · branches", s_(128), C.matchaLight],
    ["Cords", "named around the axillary artery", s_(129), PC.ant],
    ["5 nerves", "musculocutaneous bends · axillary lifts · radial straightens · median: thumb · ulnar: hand", s_(130), PC.post],
  ];
  const ot = s_(131) - 0.2;
  const outro = ramp(t, ot, ot + 0.5);
  return (
    <Stage a={a} b={END - 0.3}>
      {outro < 1 && (
        <div style={abs(0, 0, { width: 1800, height: 740, borderRadius: 44, background: C.forest })}>
          <div style={abs(70, 40, { fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 8, color: C.banana })}>RECAP</div>
          <div style={abs(70, 105, { display: "flex", flexDirection: "column", gap: 16 })}>
            {items.map(([h, s, tt, col]) => (
              <div key={h} style={{ ...pop(t, tt), display: "flex", alignItems: "center", gap: 24, fontFamily: FONT, fontWeight: 800 }}>
                <div style={{ width: 64, height: 64, borderRadius: 32, background: col, border: `4px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, color: C.forest }}>✓</div>
                <div style={{ width: 430, fontSize: 48, color: C.paper }}>{h}</div>
                <div style={{ fontSize: s.length > 60 ? 28 : 34, color: C.matchaLight, maxWidth: 1180 }}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {outro > 0 && (
        <div style={abs(0, 0, { width: 1800, height: 740, borderRadius: 44, background: C.forest, opacity: outro, display: "flex", alignItems: "center" })}>
          <div style={{ marginLeft: 120, width: 260, height: 260, borderRadius: 130, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
            <LogoMark size={200} />
          </div>
          <div style={{ marginLeft: 80, fontFamily: FONT, fontWeight: 800 }}>
            <div style={{ fontSize: 110, color: C.paper, lineHeight: 1 }}>Book Plume</div>
            <div style={{ fontSize: 50, color: C.banana, marginTop: 14, opacity: ramp(t, ot + 0.8, ot + 1.2) }}>anatomy you'll actually remember</div>
            <div style={{ display: "flex", gap: 24, marginTop: 40, alignItems: "center" }}>
              <div style={{ background: C.red, color: C.paper, borderRadius: 50, padding: "18px 54px 22px", fontSize: 54, letterSpacing: 3, transform: `scale(${1 + 0.05 * Math.max(0, Math.sin((t - ot) * 5))})`, opacity: ramp(t, wf(131, "subscribe"), wf(131, "subscribe") + 0.3) }}>SUBSCRIBE</div>
            </div>
            <div style={{ marginTop: 40, background: C.paper, color: C.forest, borderRadius: 24, padding: "16px 30px 20px", fontSize: 40, opacity: ramp(t, s_(132), s_(132) + 0.4), width: "fit-content" }}>Which nerve should we cover next?</div>
          </div>
        </div>
      )}
    </Stage>
  );
};
