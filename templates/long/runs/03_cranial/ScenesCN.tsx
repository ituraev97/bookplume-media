import React from "react";
import { C, FONT, ramp, useT } from "./kit";
import { Facts, Stage, LogoMark } from "./Chrome16";
import { Plate } from "./Plates";
import { BrainMap, EyeMovers, Face, Tongue, InnerEar, VagusBody, Shrug, StudyCard, NERVES, TC, TYPE_NAME } from "./IllusCN";
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
/** "CN VII · Facial" header with a type pill */
const NHead: React.FC<{ t: number; t0: number; n: number; typeAt?: number; x: number; y?: number; w?: number }> = ({ t, t0, n, typeAt, x, y = 0, w = 720 }) => {
  const N = NERVES[n - 1];
  return (
    <div style={abs(x, y, { width: w, display: "flex", alignItems: "center", gap: 20, ...pop(t, t0) })}>
      <div style={{ minWidth: 104, height: 104, padding: "0 14px", boxSizing: "border-box", borderRadius: 52, background: C.forest, color: C.banana, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: N.r.length > 3 ? 40 : 52 }}>{N.r}</div>
      <div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: 5, color: C.matcha }}>CRANIAL NERVE {N.n}</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: N.name.length > 12 ? 52 : 64, color: C.forest, lineHeight: 1.05, letterSpacing: -1 }}>{N.name}</div>
      </div>
      {typeAt !== undefined && (
        <div style={{ marginLeft: "auto", ...pop(t, typeAt) }}>
          <div style={{ background: TC[N.type], border: `4px solid ${C.forest}`, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 30, padding: "8px 20px 11px", borderRadius: 20, whiteSpace: "nowrap" }}>{TYPE_NAME[N.type].toUpperCase()}</div>
        </div>
      )}
    </div>
  );
};

/* plates (Gray's Anatomy 1918, public domain) */
const BASE = { src: "plates/base.png", aspect: 1893 / 1881 };
const NOSE = { src: "plates/nose.png", aspect: 947 / 940 };
const OPTIC = { src: "plates/optic.png", aspect: 834 / 960 };
const ORBIT = { src: "plates/orbit.png", aspect: 1510 / 960 };
const ORBITN = { src: "plates/orbitn.png", aspect: 1026 / 1709 };
const TRI = { src: "plates/trifacial.png", aspect: 1916 / 1632 };
const VAGUS = { src: "plates/vagus.png", aspect: 1195 / 2784 };
const HYPO = { src: "plates/hypo.png", aspect: 1646 / 1824 };
const FACEP = { src: "plates/face.png", aspect: 1781 / 2073 };
const NECK = { src: "plates/neck.png", aspect: 2047 / 1464 };

const ALL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const at = (ids: number[], t0: number, step = 0) => Object.fromEntries(ids.map((id, i) => [id, t0 + i * step]));

/* ================= INTRO ================= */
export const SIntro: React.FC = () => {
  const t = useT();
  const b3 = s_(3);
  return (
    <Stage a={-1} b={BE(0)}>
      <Seg t={t} a={-1} b={b3}>
        <Plate {...BASE} x={0} y={0} w={735} a={-1} b={b3 + 0.2} zoomFrom={[1.0, 0.5, 0.45]} zoomTo={[1.5, 0.42, 0.55]}
          labels={[{ x: 0.31, y: 0.62, text: "Cranial nerves", t: wf(1, "cranial"), side: "r", hot: true }]} />
        <div style={abs(820, 10, { width: 960, ...pop(t, 0.2) })}>
          <Big size={104}>
            The <Mk p={ramp(t, wf(2, "twelve"), wf(2, "twelve") + 0.6)}>12 Cranial Nerves</Mk>
          </Big>
          <Big size={64} color={C.matcha}>made easy</Big>
        </div>
        <Facts x={820} y={240} w={900}
          items={[
            { t: wf(0, "smell"), text: "smell · read · smile · swallow · shrug", bg: C.forest },
            { t: s_(1), text: "every one of those needs a cranial nerve" },
            { t: wf(2, "twelve"), text: "pairs — and exams ask about every one", big: "12", bg: C.matcha },
          ]} />
      </Seg>
      <Seg t={t} a={b3} b={BE(0) + 0.1}>
        <div style={abs(-20, 10)}>
          <BrainMap t={t} w={900} lit={at(ALL, wf(3, "simple") - 0.6, 0.12)} names={at(ALL, wf(4, "twelve"), 0.1)} types={wf(4, "sensory")} />
        </div>
        <div style={abs(1080, 0, { width: 700, ...pop(t, b3 + 0.1) })}>
          <Big size={60}>They follow a simple logic.</Big>
        </div>
        <div style={abs(1080, 170, { width: 700, display: "flex", flexDirection: "column", gap: 16 })}>
          {[
            ["all 12, in order", wf(4, "twelve")],
            ["what each one does", wf(4, "what")],
            ["sensory, motor or both", wf(4, "sensory")],
            ["memory tricks that stick", wf(4, "memory")],
          ].map(([txt, tt]) => (
            <div key={txt as string} style={{ ...pop(t, tt as number), display: "flex", alignItems: "center", gap: 18, background: C.card, border: `3px solid ${C.line}`, borderRadius: 24, padding: "12px 22px", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest }}>
              <div style={{ width: 46, height: 46, borderRadius: 23, background: C.matcha, color: C.paper, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>✓</div>
              {txt}
            </div>
          ))}
        </div>
        <div style={abs(1080, 610)}>
          <Chip t={t} t0={wf(5, "five")} bg={C.banana} color={C.forest} size={40}>+ 5-question quiz at the end</Chip>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 1. THE BIG PICTURE ================= */
const TypeCard: React.FC<{ t: number; t0: number; type: "S" | "M" | "B"; title: string; sub: string; arrow: string }> = ({ t, t0, type, title, sub, arrow }) => (
  <div style={{ ...pop(t, t0), display: "flex", alignItems: "center", gap: 22, background: C.card, border: `4px solid ${C.forest}`, borderRadius: 28, padding: "16px 24px" }}>
    <div style={{ width: 92, height: 92, borderRadius: 46, background: TC[type], border: `4px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.forest }}>{arrow}</div>
    <div style={{ fontFamily: FONT, fontWeight: 800 }}>
      <div style={{ fontSize: 50, color: C.forest, lineHeight: 1 }}>{title}</div>
      <div style={{ fontSize: 30, color: C.matcha, marginTop: 6 }}>{sub}</div>
    </div>
  </div>
);
export const SBig: React.FC = () => {
  const t = useT();
  const a = ST(1), b = BE(1);
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(10)}>
        <Plate {...BASE} x={0} y={0} w={735} a={a - 0.1} b={s_(10) + 0.2} zoomFrom={[1.15, 0.45, 0.6]} zoomTo={[1.7, 0.42, 0.62]}
          labels={[
            { x: 0.43, y: 0.665, text: "Brainstem", t: wf(8, "different"), side: "r", hot: true },
            { x: 0.31, y: 0.62, text: "Cranial nerves", t: wf(9, "attach"), side: "r" },
          ]} />
        <Facts x={820} y={20} w={940}
          items={[
            { t: wf(7, "spinal"), text: "most nerves → the spinal cord" },
            { t: wf(8, "different"), text: "cranial nerves → straight to the BRAIN", bg: C.forest },
            { t: wf(9, "skull"), text: "they leave through openings in the base of the skull", bg: C.matcha },
          ]} />
      </Seg>
      <Seg t={t} a={s_(10)} b={s_(15)}>
        <div style={abs(-20, 10)}>
          <BrainMap t={t} w={900} lit={at(ALL, s_(10) - 0.2, 0.1)} names={at(ALL, wf(11, "name"), 0.08)}
            regions={{ fore: wf(13, "forebrain"), mid: wf(14, "midbrain"), pons: wf(14, "pons"), med: wf(14, "medulla") }}
            hot={[{ n: [1, 2], a: s_(13), b: s_(14) }, { n: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12], a: s_(14), b: s_(15) - 0.2 }]} dim={s_(13)} />
        </div>
        <div style={abs(1080, 0, { width: 700 })}>
          <div style={pop(t, s_(10))}><Big size={120}><Mk p={ramp(t, wf(10, "twelve"), wf(10, "twelve") + 0.5)}>12 pairs</Mk></Big></div>
          <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}>
            <Chip t={t} t0={wf(10, "left")} bg={C.matcha} size={36}>one left + one right</Chip>
            <Chip t={t} t0={wf(11, "roman")} bg={C.forest} size={36}>Roman numerals I → XII</Chip>
            <Chip t={t} t0={wf(12, "front")} bg={C.banana} color={C.forest} size={36}>numbered front → back</Chip>
            <Chip t={t} t0={s_(13)} bg={C.card} color={C.forest} size={36}>I · II → forebrain</Chip>
            <Chip t={t} t0={s_(14)} bg={C.card} color={C.forest} size={36}>III → XII → brainstem</Chip>
          </div>
        </div>
      </Seg>
      <Seg t={t} a={s_(15)} b={b + 0.1}>
        <div style={abs(-20, 10)}>
          <BrainMap t={t} w={900} lit={at(ALL, s_(15) - 1)} names={at(ALL, s_(15) - 1)} types={wf(18, "both")} />
        </div>
        <div style={abs(1060, 0, { width: 720 })}>
          <div style={pop(t, s_(15))}><Big size={60}>3 types of nerve</Big></div>
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 20 }}>
            <TypeCard t={t} t0={wf(16, "sensory")} type="S" title="Sensory" sub="information IN · smell, sight, sound" arrow="→" />
            <TypeCard t={t} t0={wf(17, "motor")} type="M" title="Motor" sub="commands OUT to muscles" arrow="←" />
            <TypeCard t={t} t0={wf(18, "both")} type="B" title="Both" sub="in AND out" arrow="⇄" />
          </div>
          <div style={{ marginTop: 26 }}>
            <Chip t={t} t0={s_(19)} bg={C.forest} size={36}>let's meet them, one by one →</Chip>
          </div>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 2. SMELL AND SIGHT ================= */
export const SSenses: React.FC = () => {
  const t = useT();
  const a = ST(2), b = BE(2);
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(24)}>
        <Plate {...NOSE} x={0} y={0} w={740} a={a - 0.1} b={s_(24) + 0.2} zoomFrom={[1.0, 0.5, 0.45]} zoomTo={[1.3, 0.45, 0.35]}
          labels={[
            { x: 0.55, y: 0.45, text: "Olfactory nerve fibers", t: wf(21, "fibers"), side: "l", hot: true },
            { x: 0.66, y: 0.235, text: "Cribriform plate", t: wf(22, "cribriform"), side: "l" },
            { x: 0.3, y: 0.21, text: "Olfactory bulb", t: wf(22, "bulb"), side: "r" },
          ]} />
        <NHead t={t} t0={a} n={1} typeAt={s_(23)} x={800} y={0} w={980} />
        <Facts x={800} y={150} w={960}
          items={[
            { t: wf(20, "smell"), text: "the nerve of SMELL", bg: C.forest },
            { t: s_(21), text: "fibers start in the roof of the nose" },
            { t: wf(22, "cribriform"), text: "up through the cribriform plate (ethmoid bone)", bg: C.matcha },
            { t: wf(22, "bulb"), text: "→ olfactory bulb, under the brain" },
          ]} />
      </Seg>
      <Seg t={t} a={s_(24)} b={s_(29)}>
        <Plate {...OPTIC} x={40} y={0} w={640} a={s_(24) - 0.1} b={s_(29) + 0.2} zoomFrom={[1.0, 0.6, 0.35]} zoomTo={[1.25, 0.5, 0.6]}
          labels={[
            { x: 0.77, y: 0.39, text: "Optic nerve", t: wf(24, "optic"), side: "l", hot: true },
            { x: 0.5, y: 0.615, text: "Optic chiasm", t: wf(27, "chiasm"), side: "r" },
            { x: 0.3, y: 0.77, text: "Optic tract", t: wf(27, "cross"), side: "r" },
          ]} />
        <Note t={t} t0={wf(27, "chiasm") + 0.6} old="chiasma" x={800} y={670} />
        <NHead t={t} t0={s_(24)} n={2} typeAt={s_(28)} x={800} y={0} w={980} />
        <Facts x={800} y={150} w={960}
          items={[
            { t: wf(24, "vision"), text: "the nerve of VISION", bg: C.forest },
            { t: wf(25, "retina"), text: "carries signals from the retina" },
            { t: wf(26, "canal"), text: "leaves the orbit through the optic canal", bg: C.matcha },
            { t: wf(27, "cross"), text: "some fibers cross at the optic chiasm" },
          ]} />
      </Seg>
      <Seg t={t} a={s_(29)} b={b + 0.1}>
        <div style={abs(0, 0, { width: 1800, height: 740, display: "flex", alignItems: "center", justifyContent: "center", gap: 70 })}>
          {[
            [1, "Smell", wf(29, "smell")],
            [2, "Sight", wf(29, "sight")],
          ].map(([n, w, tt]) => (
            <div key={n as number} style={{ ...pop(t, tt as number), width: 640, height: 500, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800 }}>
              <div style={{ fontSize: 160, color: C.banana, lineHeight: 1 }}>{NERVES[(n as number) - 1].r}</div>
              <div style={{ fontSize: 80, color: C.paper, marginTop: 10 }}>{w}</div>
              <div style={{ marginTop: 26, background: TC.S, color: C.forest, border: `4px solid ${C.paper}`, borderRadius: 20, padding: "8px 24px 12px", fontSize: 36 }}>SENSORY</div>
            </div>
          ))}
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 3. THE EYE MOVERS ================= */
const ALLM = { sr: 0, ir: 0, mr: 0, io: 0, lps: 0, so: 0, lr: 0 };
export const SEyes: React.FC = () => {
  const t = useT();
  const a = ST(3), b = BE(3);
  const four = wf(33, "four");
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(32)}>
        <Plate {...ORBIT} x={0} y={30} w={1040} a={a - 0.1} b={s_(32) + 0.2} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.15, 0.5, 0.45]}
          labels={[
            { x: 0.43, y: 0.37, text: "Superior rectus", t: wf(31, "six"), side: "r" },
            { x: 0.62, y: 0.5, text: "Lateral rectus", t: wf(31, "six") + 0.25, side: "r" },
            { x: 0.43, y: 0.62, text: "Inferior rectus", t: wf(31, "six") + 0.5, side: "r" },
            { x: 0.5, y: 0.275, text: "Superior oblique", t: wf(31, "six") + 0.75, side: "r", hot: true },
          ]} />
        <Note t={t} t0={wf(31, "move")} old="rectus lateralis" x={20} y={680} />
        <div style={abs(1100, 20, { width: 680 })}>
          <div style={pop(t, a)}><Big size={84}>3 nerves</Big></div>
          <div style={pop(t, wf(30, "move"))}><Big size={60} color={C.matcha}>move your eyes</Big></div>
          <div style={{ marginTop: 40, ...pop(t, s_(31)) }}>
            <Big size={150}><Mk p={ramp(t, wf(31, "six"), wf(31, "six") + 0.5)}>6</Mk></Big>
            <Big size={50}>muscles move each eye</Big>
          </div>
        </div>
      </Seg>
      <Seg t={t} a={s_(32)} b={s_(35)}>
        <div style={abs(60, 20)}>
          <EyeMovers t={t} w={700} show={{ sr: four, ir: four + 0.2, mr: four + 0.4, io: four + 0.6, lps: wf(33, "eyelid"), pupil: wf(34, "constricts") }} groups={{ iii: wf(32, "oculomotor") }}
            hot={[{ ids: ["lps"], a: wf(33, "eyelid"), b: s_(34) }]} />
        </div>
        <NHead t={t} t0={s_(32)} n={3} typeAt={wf(32, "work")} x={860} y={0} w={920} />
        <Facts x={860} y={150} w={900}
          items={[
            { t: four, text: "4 of the 6: superior, inferior + medial rectus, inferior oblique", bg: C.forest },
            { t: wf(33, "eyelid"), text: "lifts the upper eyelid" },
            { t: wf(34, "pupil"), text: "constricts the pupil", bg: C.matcha },
            { t: wf(34, "focus"), text: "helps the lens focus up close" },
          ]} />
      </Seg>
      <Seg t={t} a={s_(35)} b={s_(38)}>
        <Plate {...ORBITN} x={0} y={0} w={444} a={s_(35) - 0.1} b={s_(38) + 0.2} zoomFrom={[1.05, 0.4, 0.4]} zoomTo={[1.2, 0.35, 0.35]}
          labels={[{ x: 0.24, y: 0.36, text: "Sup. oblique", t: wf(35, "superior"), side: "r", hot: true }]} />
        <div style={abs(470, 40)}>
          <EyeMovers t={t} w={560} show={{ ...ALLM, so: 0 }} groups={{ iv: wf(35, "trochlear") }} hot={[{ ids: ["so"], a: wf(35, "superior"), b: s_(38) }]} />
        </div>
        <NHead t={t} t0={s_(35)} n={4} typeAt={wf(35, "trochlear") + 0.6} x={1080} y={0} w={700} />
        <Facts x={1080} y={150} w={700}
          items={[
            { t: wf(35, "one"), text: "just 1 muscle: superior oblique", bg: C.forest },
            { t: wf(36, "pulley"), text: "trochlea = Latin for 'pulley'", bg: C.matcha },
            { t: wf(36, "loop"), text: "the tendon loops through it" },
            { t: wf(37, "back"), text: "the only nerve leaving the BACK of the brainstem" },
          ]} />
        <Note t={t} t0={wf(35, "superior") + 0.5} old="obliquus superior" x={20} y={680} />
      </Seg>
      <Seg t={t} a={s_(38)} b={s_(40)}>
        <div style={abs(60, 20)}>
          <EyeMovers t={t} w={700} show={{ ...ALLM, lr: 0 }} groups={{ iii: s_(38) - 1, iv: s_(38) - 1, vi: wf(38, "abducens") }}
            hot={[{ ids: ["lr"], a: wf(38, "lateral"), b: s_(40) }]} look={[{ a: wf(39, "outward"), dx: -1, dy: 0 }]} />
        </div>
        <NHead t={t} t0={s_(38)} n={6} typeAt={wf(38, "abducens") + 0.6} x={860} y={0} w={920} />
        <Facts x={860} y={150} w={900}
          items={[
            { t: wf(38, "one"), text: "just 1 muscle: lateral rectus", bg: C.forest },
            { t: wf(39, "abducts"), text: "abducts the eye = turns it OUTWARD", bg: C.matcha },
            { t: wf(39, "name"), text: "abducens ← abduct" },
          ]} />
      </Seg>
      <Seg t={t} a={s_(40)} b={b + 0.1}>
        <div style={abs(60, 20)}>
          <EyeMovers t={t} w={700} show={ALLM} groups={{ iii: 0, iv: 0, vi: 0 }} />
        </div>
        <div style={abs(860, 10, { width: 920, display: "flex", flexDirection: "column", gap: 18 })}>
          <div style={pop(t, s_(40))}><Big size={64}>All three: <span style={{ color: "#C9772F" }}>MOTOR</span></Big></div>
          {[
            ["III", "oculomotor → the other 4 + eyelid + pupil", "#8FA86A"],
            ["IV", "trochlear → superior oblique", TC.M],
            ["VI", "abducens → lateral rectus", TC.S],
          ].map(([r, s, col], i) => (
            <div key={r} style={{ ...pop(t, s_(40) + 0.3 + i * 0.25), display: "flex", alignItems: "center", gap: 20, background: C.card, border: `3px solid ${C.line}`, borderRadius: 24, padding: "12px 22px", fontFamily: FONT, fontWeight: 800 }}>
              <div style={{ width: 84, height: 60, borderRadius: 18, background: col, border: `4px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: C.forest }}>{r}</div>
              <div style={{ fontSize: 36, color: C.forest }}>{s}</div>
            </div>
          ))}
          <div style={{ marginTop: 10 }}>
            <Chip t={t} t0={s_(41)} bg={C.banana} color={C.forest} size={40}>skipped V? It gets its own chapter →</Chip>
          </div>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 4. TRIGEMINAL AND FACIAL ================= */
export const SFace: React.FC = () => {
  const t = useT();
  const a = ST(4), b = BE(4);
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(48)}>
        <div style={abs(80, 0)}>
          <Face t={t} w={620} v1={s_(45)} v2={s_(46)} v3={s_(47)} zoneLabels={s_(45)}
            hot={[{ id: "v1", a: s_(45), b: s_(46) }, { id: "v2", a: s_(46), b: s_(47) }, { id: "v3", a: s_(47), b: s_(48) }]} />
        </div>
        <NHead t={t} t0={a} n={5} x={820} y={0} w={960} />
        <div style={abs(820, 150, { width: 960 })}>
          <div style={pop(t, wf(44, "three"))}><Big size={70}>splits into <Mk p={ramp(t, wf(44, "three", 1), wf(44, "three", 1) + 0.5)}>3 divisions</Mk></Big></div>
          <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              ["V1", "Ophthalmic", "forehead + eye", s_(45), "#6FA3D2"],
              ["V2", "Maxillary", "cheek + upper jaw", s_(46), "#E7C35A"],
              ["V3", "Mandibular", "lower jaw", s_(47), "#E39A5B"],
            ].map(([v, n, s, tt, col]) => (
              <div key={v as string} style={{ ...pop(t, tt as number), display: "flex", alignItems: "center", gap: 22, background: C.card, border: `3px solid ${C.line}`, borderRadius: 26, padding: "14px 24px", fontFamily: FONT, fontWeight: 800 }}>
                <div style={{ width: 96, height: 70, borderRadius: 20, background: col as string, border: `4px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, color: C.forest }}>{v}</div>
                <div style={{ fontSize: 46, color: C.forest, width: 330 }}>{n}</div>
                <div style={{ fontSize: 34, color: C.matcha }}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      </Seg>
      <Seg t={t} a={s_(48)} b={s_(51)}>
        <Plate {...TRI} x={0} y={0} w={868} a={s_(48) - 0.1} b={s_(51) + 0.2} zoomFrom={[1.0, 0.45, 0.5]} zoomTo={[1.3, 0.42, 0.6]}
          labels={[
            { x: 0.405, y: 0.47, text: "V3 · mandibular", t: wf(49, "mandibular"), side: "r", hot: true },
            { x: 0.33, y: 0.74, text: "Masseter", t: wf(49, "chewing"), side: "l" },
            { x: 0.56, y: 0.17, text: "Temporalis", t: wf(49, "chewing") + 0.3, side: "r" },
          ]} />
        <Note t={t} t0={s_(48) + 0.6} old="trifacial nerve" x={20} y={680} />
        <Facts x={930} y={20} w={850}
          items={[
            { t: s_(48), text: "feeling from most of your face", bg: C.forest },
            { t: wf(49, "motor"), text: "V3 also carries MOTOR fibers", bg: C.matcha },
            { t: wf(49, "chewing"), text: "→ the chewing muscles (masseter, temporalis…)" },
            { t: wf(50, "both"), text: "trigeminal = BOTH sensory + motor", bg: TC.B },
          ]} />
      </Seg>
      <Seg t={t} a={s_(51)} b={s_(56)}>
        <Plate {...FACEP} x={0} y={0} w={636} a={s_(51) - 0.1} b={s_(56) + 0.2} zoomFrom={[1.1, 0.4, 0.45]} zoomTo={[1.4, 0.38, 0.42]}
          labels={[{ x: 0.3, y: 0.405, text: "Facial nerve", t: wf(51, "facial"), side: "r", hot: true }]} />
        <Seg t={t} a={s_(51)} b={s_(53)}>
          <div style={abs(660, 40)}>
            <Face t={t} w={440} fan={wf(52, "muscles")} smile={wf(52, "smile")} frown={wf(52, "frown")} brow={wf(52, "eyebrow")} />
          </div>
        </Seg>
        <Seg t={t} a={s_(53)} b={s_(54)}>
          <div style={abs(700, 40)}>
            <Tongue t={t} w={420} front={wf(53, "taste")} />
          </div>
        </Seg>
        <Seg t={t} a={s_(54)} b={s_(56)}>
          <div style={abs(660, 40)}>
            <Face t={t} w={440} fan={s_(54) - 1} tear={wf(54, "tears")} />
          </div>
        </Seg>
        <NHead t={t} t0={s_(51)} n={7} x={1150} y={0} w={640} />
        <Facts x={1150} y={150} w={640}
          items={[
            { t: wf(52, "expression"), text: "muscles of facial expression", bg: C.forest },
            { t: wf(53, "taste"), text: "taste: front 2/3 of the tongue", bg: TC.S },
            { t: wf(54, "tears"), text: "tears + saliva" },
            { t: wf(55, "stylomastoid"), text: "exits: stylomastoid foramen, below the ear", bg: C.matcha },
          ]} />
      </Seg>
      <Seg t={t} a={s_(56)} b={b + 0.1}>
        <div style={abs(0, 0, { width: 1800, textAlign: "center", ...pop(t, s_(56)) })}>
          <Big size={64}>The classic exam trap</Big>
        </div>
        {[
          { x: 60, tt: wf(57, "feeling"), head: "FEELING your face", nerve: "V · trigeminal", col: TC.B, el: <Face t={t} w={380} v1={wf(57, "feeling")} v2={wf(57, "feeling") + 0.15} v3={wf(57, "feeling") + 0.3} /> },
          { x: 920, tt: wf(57, "moving"), head: "MOVING your face", nerve: "VII · facial", col: TC.B, el: <Face t={t} w={380} fan={wf(57, "moving")} smile={wf(57, "moving") + 0.4} /> },
        ].map((c) => (
          <div key={c.head} style={abs(c.x, 100, { width: 820, height: 630, borderRadius: 40, background: C.card, border: `4px solid ${C.forest}`, ...pop(t, c.tt) })}>
            <div style={abs(20, 40)}>{c.el}</div>
            <div style={abs(420, 120, { width: 380, fontFamily: FONT, fontWeight: 800 })}>
              <div style={{ fontSize: 46, color: C.forest, lineHeight: 1.1 }}>{c.head}</div>
              <div style={{ marginTop: 30, fontSize: 30, color: C.matcha }}>=</div>
              <div style={{ marginTop: 10, display: "inline-block", background: C.banana, color: C.forest, borderRadius: 18, padding: "10px 22px 14px", fontSize: 44 }}>{c.nerve}</div>
            </div>
          </div>
        ))}
      </Seg>
    </Stage>
  );
};

/* ================= 5. NERVES EIGHT TO TWELVE ================= */
export const SLower: React.FC = () => {
  const t = useT();
  const a = ST(5), b = BE(5);
  const scmT = wf(77, "sternocleidomastoid");
  return (
    <Stage a={a} b={b}>
      {/* VIII */}
      <Seg t={t} a={a} b={s_(63)}>
        <div style={abs(10, 60)}>
          <InnerEar t={t} w={800} nerve={a} coch={wf(60, "cochlear")} vest={wf(61, "vestibular")} />
        </div>
        <NHead t={t} t0={a} n={8} typeAt={s_(62)} x={880} y={0} w={900} />
        <Facts x={880} y={150} w={900}
          items={[
            { t: s_(59), text: "the name = its 2 jobs", bg: C.forest },
            { t: wf(60, "cochlear"), text: "cochlear part → HEARING", bg: TC.S },
            { t: wf(61, "vestibular"), text: "vestibular part → BALANCE", bg: TC.B },
            { t: wf(61, "inner"), text: "both from the inner ear" },
          ]} />
        <Note t={t} t0={s_(58) + 1.2} old="acoustic nerve" x={20} y={670} />
      </Seg>
      {/* IX */}
      <Seg t={t} a={s_(63)} b={s_(69)}>
        <div style={abs(40, 10)}>
          <Tongue t={t} w={500} back={wf(65, "back")} />
        </div>
        <NHead t={t} t0={s_(63)} n={9} typeAt={wf(68, "both")} x={640} y={0} w={1140} />
        <div style={abs(640, 140, { display: "flex", gap: 18, alignItems: "center" })}>
          <Chip t={t} t0={wf(64, "glosso")} bg={C.banana} color={C.forest} size={42}>glosso = tongue</Chip>
          <Chip t={t} t0={wf(64, "pharyngeal")} bg={C.banana} color={C.forest} size={42}>pharyngeal = throat</Chip>
        </div>
        <Facts x={640} y={250} w={1100}
          items={[
            { t: wf(65, "taste"), text: "taste + sensation: back 1/3 of the tongue", bg: C.forest },
            { t: wf(66, "stylopharyngeus"), text: "1 throat muscle: stylopharyngeus → swallowing", bg: C.matcha },
            { t: wf(67, "parotid"), text: "signals to the parotid gland (largest salivary gland)" },
          ]} />
      </Seg>
      {/* X */}
      <Seg t={t} a={s_(69)} b={s_(75)}>
        <Plate {...VAGUS} x={0} y={0} w={318} a={s_(69) - 0.1} b={s_(75) + 0.2} zoomFrom={[1.25, 0.5, 0.15]} zoomTo={[1.25, 0.5, 0.85]} credit="Gray's 1918 · PD" />
        <div style={abs(340, -10)}>
          <VagusBody t={t} w={450} start={s_(69)} neck={wf(71, "neck")} chest={wf(71, "chest")} abd={wf(71, "abdomen")} throat={wf(72, "throat")} heart={wf(73, "heart")} lungs={wf(73, "lungs")} gut={wf(73, "gut")} />
        </div>
        <NHead t={t} t0={s_(69)} n={10} typeAt={wf(74, "both")} x={850} y={0} w={930} />
        <Facts x={850} y={150} w={930}
          items={[
            { t: wf(70, "wandering"), text: "vagus = Latin for 'wandering'", bg: C.forest },
            { t: wf(71, "neck"), text: "skull → neck → chest → abdomen" },
            { t: wf(72, "throat"), text: "muscles of the throat + voice box", bg: C.matcha },
            { t: wf(73, "parasympathetic"), text: "parasympathetic: heart · lungs · gut — slows the heart rate", bg: TC.B },
          ]} />
      </Seg>
      {/* XI */}
      <Seg t={t} a={s_(75)} b={s_(78)}>
        <Seg t={t} a={s_(75)} b={scmT}>
          <Plate {...NECK} x={0} y={0} w={1000} a={s_(75) - 0.1} b={scmT + 0.2} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.15, 0.6, 0.55]}
            labels={[{ x: 0.66, y: 0.6, text: "Sternocleidomastoid", t: wf(76, "skull"), side: "r", hot: true }, { x: 0.78, y: 0.82, text: "Trapezius", t: wf(76, "leave"), side: "r" }]} />
          <Note t={t} t0={wf(76, "skull") + 0.6} old="sterno-cleido-mastoideus" x={20} y={670} />
        </Seg>
        <Seg t={t} a={scmT} b={s_(78)}>
          <div style={abs(80, 40)}>
            <Shrug t={t} w={760} scm={scmT} trap={wf(77, "trapezius")} turn={wf(77, "turns")} shrug={wf(77, "shrugs")} />
          </div>
        </Seg>
        <NHead t={t} t0={s_(75)} n={11} typeAt={s_(78) - 1.2} x={1060} y={0} w={720} />
        <Facts x={1060} y={150} w={720}
          items={[
            { t: wf(76, "upper"), text: "fibers start in the upper spinal cord", bg: C.forest },
            { t: wf(76, "climb"), text: "climb into the skull, leave next to IX + X" },
            { t: wf(77, "turns"), text: "sternocleidomastoid → turns the head", bg: C.matcha },
            { t: wf(77, "shrugs"), text: "trapezius → shrugs the shoulders", bg: TC.M },
          ]} />
      </Seg>
      {/* XII */}
      <Seg t={t} a={s_(78)} b={b + 0.1}>
        <Plate {...HYPO} x={0} y={0} w={668} a={s_(78) - 0.1} b={b + 0.3} zoomFrom={[1.05, 0.5, 0.45]} zoomTo={[1.3, 0.55, 0.5]}
          labels={[{ x: 0.585, y: 0.525, text: "Hypoglossal n.", t: wf(78, "hypoglossal"), side: "r", hot: true }]} />
        <div style={abs(690, 30)}>
          <Tongue t={t} w={420} motor={wf(80, "moves")} />
        </div>
        <NHead t={t} t0={s_(78)} n={12} typeAt={s_(81)} x={1150} y={0} w={640} />
        <Facts x={1150} y={150} w={630}
          items={[
            { t: wf(79, "hypo"), text: "hypo = under · glossal = tongue", bg: C.forest },
            { t: wf(80, "moves"), text: "moves the tongue muscles", bg: C.matcha },
            { t: wf(80, "speak"), text: "speak · chew · swallow" },
            { t: s_(81), text: "XI + XII = MOTOR", bg: TC.M },
          ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 6. ONE BITE, TEN NERVES ================= */
export const SBite: React.FC = () => {
  const t = useT();
  const a = ST(6), b = BE(6);
  const steps: [string, string, number, number[]][] = [
    ["smell the food", "I", s_(83), [1]],
    ["see it on the fork", "II", s_(84), [2]],
    ["eyes follow the fork", "III · IV · VI", s_(85), [3, 4, 6]],
    ["chew + feel it", "V", s_(86), [5]],
    ["taste: front · back", "VII · IX", s_(87), [7, 9]],
    ["tongue pushes back", "XII", s_(88), [12]],
    ["swallow", "IX · X", s_(89), [9, 10]],
  ];
  const hot = steps.map(([, , tt, n], i) => ({ n, a: tt, b: i < steps.length - 1 ? steps[i + 1][2] : s_(90) }));
  hot.push({ n: [1, 2, 3, 4, 5, 6, 7, 9, 10, 12], a: s_(90), b: s_(91) });
  hot.push({ n: [8, 11], a: s_(91), b: b + 1 });
  return (
    <Stage a={a} b={b}>
      <div style={abs(-20, 10)}>
        <BrainMap t={t} w={900} lit={at(ALL, a - 1)} names={at(ALL, a - 1)} types={a - 1} hot={hot} dim={s_(83)} />
      </div>
      <div style={abs(1040, 0, { width: 740 })}>
        <div style={pop(t, a)}><Big size={58}>One bite of food</Big></div>
        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 10 }}>
          {steps.map(([txt, r, tt], i) => {
            const on = t >= tt && t < (i < steps.length - 1 ? steps[i + 1][2] : s_(90));
            return (
              <div key={txt} style={{ ...pop(t, tt), display: "flex", alignItems: "center", gap: 18, background: on ? C.banana : C.card, border: `3px solid ${on ? C.forest : C.line}`, borderRadius: 20, padding: "8px 18px", fontFamily: FONT, fontWeight: 800 }}>
                <div style={{ width: 40, height: 40, borderRadius: 20, background: C.forest, color: C.paper, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{i + 1}</div>
                <div style={{ fontSize: 32, color: C.forest, flex: 1 }}>{txt}</div>
                <div style={{ fontSize: 32, color: C.matcha }}>{r}</div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 18, display: "flex", gap: 14 }}>
          <Chip t={t} t0={s_(90)} bg={C.forest} size={34}>10 of 12 pairs</Chip>
          <Chip t={t} t0={s_(91)} bg={C.card} color={C.forest} size={34}>resting: VIII · XI</Chip>
        </div>
      </div>
    </Stage>
  );
};

/* ================= 7. MEMORY TRICKS ================= */
const TrickCard: React.FC<{ t: number; t0: number; n: number; title: string; children: React.ReactNode }> = ({ t, t0, n, title, children }) => (
  <div style={abs(0, 0, { width: 1800, height: 740, borderRadius: 44, background: C.forest, ...pop(t, t0, 0.35) })}>
    <div style={abs(60, 40, { fontFamily: FONT, fontWeight: 800, fontSize: 32, letterSpacing: 6, color: C.matchaLight })}>TRICK {n}</div>
    <div style={abs(60, 82, { fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.paper })}>{title}</div>
    {children}
  </div>
);
export const STricks: React.FC = () => {
  const t = useT();
  const a = ST(7), b = BE(7);
  const names = ["Ooh,", "Ooh,", "Ooh,", "To", "Touch", "And", "Feel", "Very", "Good", "Velvet.", "Such", "Heaven!"];
  const types = ["Some", "Say", "Marry", "Money,", "But", "My", "Brother", "Says", "Big", "Brains", "Matter", "More."];
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(96)}>
        <TrickCard t={t} t0={a} n={1} title="The 12 names, in order">
          {[0, 1].map((row) => (
            <div key={row} style={abs(40, 190 + row * 270, { width: 1720, display: "flex", justifyContent: "space-between" })}>
              {names.slice(row * 6, row * 6 + 6).map((w, j) => {
                const i = row * 6 + j;
                return (
                  <div key={i} style={{ width: 280, textAlign: "center", fontFamily: FONT, fontWeight: 800 }}>
                    <div style={{ ...pop(t, SEG[94].w[i]), fontSize: 64, color: C.paper, lineHeight: 1 }}>
                      <span style={{ color: C.banana, fontSize: 96 }}>{w[0]}</span>
                      {w.slice(1)}
                    </div>
                    <div style={{ ...pop(t, SEG[95].w[i]), marginTop: 22, display: "inline-block", fontSize: NERVES[i].name.length > 12 ? 25 : 31, color: C.forest, background: C.banana, borderRadius: 16, padding: "6px 14px 9px" }}>
                      {NERVES[i].r} · {NERVES[i].name}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </TrickCard>
      </Seg>
      <Seg t={t} a={s_(96)} b={s_(99)}>
        <TrickCard t={t} t0={s_(96)} n={2} title="Sensory, Motor or Both?">
          {[0, 1].map((row) => (
            <div key={row} style={abs(40, 180 + row * 230, { width: 1720, display: "flex", justifyContent: "space-between" })}>
              {types.slice(row * 6, row * 6 + 6).map((w, j) => {
                const i = row * 6 + j;
                const ty = NERVES[i].type;
                return (
                  <div key={i} style={{ width: 280, textAlign: "center", fontFamily: FONT, fontWeight: 800 }}>
                    <div style={{ ...pop(t, SEG[97].w[i]), fontSize: 60, color: C.paper, lineHeight: 1 }}>
                      <span style={{ color: TC[ty], fontSize: 92 }}>{w[0]}</span>
                      {w.slice(1)}
                    </div>
                    <div style={{ ...pop(t, SEG[97].w[i] + 0.1), marginTop: 16, display: "inline-block", fontSize: 32, color: C.forest, background: TC[ty], borderRadius: 14, padding: "4px 16px 7px" }}>{NERVES[i].r}</div>
                  </div>
                );
              })}
            </div>
          ))}
          <div style={abs(0, 640, { width: 1800, display: "flex", justifyContent: "center", gap: 30 })}>
            {(["S", "M", "B"] as const).map((ty) => (
              <div key={ty} style={{ ...pop(t, wf(98, ty === "S" ? "sensory" : ty === "M" ? "motor" : "both")), background: TC[ty], color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 38, padding: "8px 26px 12px", borderRadius: 20 }}>
                {ty} = {TYPE_NAME[ty].toLowerCase()}
              </div>
            ))}
          </div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={s_(99)} b={s_(102)}>
        <div style={abs(60, 20)}>
          <EyeMovers t={t} w={700} show={ALLM} groups={{ iii: wf(101, "other"), iv: wf(101, "superior"), vi: wf(101, "lateral") }}
            hot={[{ ids: ["lr"], a: wf(101, "lateral"), b: wf(101, "superior") }, { ids: ["so"], a: wf(101, "superior"), b: wf(101, "other") }, { ids: ["sr", "ir", "mr", "io"], a: wf(101, "other"), b: s_(102) }]} />
        </div>
        <div style={abs(880, 0, { width: 900, height: 740, borderRadius: 44, background: C.forest, ...pop(t, s_(99)) })}>
          <div style={abs(50, 40, { fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: C.matchaLight })}>TRICK 3 · EYE MUSCLES</div>
          <div style={abs(50, 120, { display: "flex", flexDirection: "column", gap: 10 })}>
            {[
              ["LR", "6", "lateral rectus", SEG[100].w[2], TC.S],
              ["SO", "4", "superior oblique", SEG[100].w[5], TC.M],
              ["R", "3", "all the rest", SEG[100].w[8], "#8FA86A"],
            ].map(([l, n, s, tt, col]) => (
              <div key={l as string} style={{ ...pop(t, tt as number), display: "flex", alignItems: "baseline", gap: 10, fontFamily: FONT, fontWeight: 800 }}>
                <span style={{ fontSize: 150, lineHeight: 1.05, color: col as string }}>{l}</span>
                <span style={{ fontSize: 150, lineHeight: 1.05, color: C.banana }}>{n}</span>
                <span style={{ fontSize: 34, color: C.paper, marginLeft: 20 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </Seg>
      <Seg t={t} a={s_(102)} b={b + 0.1}>
        <div style={abs(80, 120)}>
          <StudyCard t={t} flip={wf(103, "number")} front={"Cranial nerve VII"} back={"Facial nerve\nexpression · taste (front 2/3) · tears + saliva"} w={820} />
        </div>
        <div style={abs(1000, 80, { width: 780 })}>
          <div style={pop(t, s_(102))}><Big size={64}>Make it stick</Big></div>
          <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 18 }}>
            <div><Chip t={t} t0={wf(103, "say")} bg={C.matcha} size={38}>say all 12 out loud · every morning</Chip></div>
            <div><Chip t={t} t0={wf(103, "week")} bg={C.card} color={C.forest} size={38}>for one week</Chip></div>
            <div><Chip t={t} t0={wf(103, "flashcards")} bg={C.forest} size={38}>flashcards: nerve ↔ number + job</Chip></div>
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
    n: 1, si: 106, q: "Which 3 cranial nerves are purely sensory?", a: "I · II · VIII",
    visual: (t, r, ans) => <div style={abs(-20, 10)}><BrainMap t={t} w={900} lit={at(ALL, 0)} hot={r ? [{ n: [1, 2, 8], a: ans, b: ans + 6 }] : []} names={r ? { 1: ans, 2: ans, 8: ans } : {}} dim={r ? ans : undefined} /></div>,
  },
  {
    n: 2, si: 108, q: "Which nerve turns your eye outward?", a: "Abducens (VI)",
    visual: (t, r, ans) => <div style={abs(80, 20)}><EyeMovers t={t} w={700} show={ALLM} groups={r ? { vi: ans } : {}} hot={r ? [{ ids: ["lr"], a: ans, b: ans + 6 }] : []} look={r ? [{ a: ans, dx: -1, dy: 0 }] : []} /></div>,
  },
  {
    n: 3, si: 110, q: "Which nerve lets you smile?", a: "Facial (VII)",
    visual: (t, r, ans) => <div style={abs(160, 10)}><Face t={t} w={620} fan={r ? ans : undefined} smile={r ? ans + 0.4 : undefined} /></div>,
  },
  {
    n: 4, si: 112, q: "How many divisions does the trigeminal nerve have?", a: "3 · V1 V2 V3",
    visual: (t, r, ans) => <div style={abs(160, 10)}><Face t={t} w={620} v1={r ? ans : undefined} v2={r ? ans + 0.25 : undefined} v3={r ? ans + 0.5 : undefined} zoneLabels={r ? ans : undefined} /></div>,
  },
  {
    n: 5, si: 114, q: "Which nerve helps you shrug your shoulders?", a: "Accessory (XI)",
    visual: (t, r, ans) => <div style={abs(120, 30)}><Shrug t={t} w={760} trap={r ? ans : undefined} shrug={r ? ans + 0.3 : undefined} /></div>,
  },
];
export const SQuiz: React.FC = () => {
  const t = useT();
  const a = ST(8), b = BE(8);
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(106) - 0.2}>
        <div style={abs(0, 0, { width: 1800, height: 740, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" })}>
          <div style={pop(t, a)}><Big size={150}>QUIZ</Big></div>
          <div style={{ ...pop(t, s_(105)), marginTop: 20 }}><Chip t={t} t0={s_(105)} bg={C.banana} color={C.forest} size={44}>5 questions · pause if you need more time</Chip></div>
        </div>
      </Seg>
      {QS.map((q, i) => {
        const ask = s_(q.si), pause = e_(q.si), ans = s_(q.si + 1);
        const end = i < QS.length - 1 ? s_(QS[i + 1].si) - 0.2 : s_(116) - 0.2;
        const reveal = t >= ans ? 1 : 0;
        const cdT = t - (pause + 0.2);
        const n = cdT < 0 ? null : cdT < 1.0 ? 3 : cdT < 2.0 ? 2 : cdT < 3.0 ? 1 : null;
        const cdK = n ? ramp(t, pause + 0.2 + (3 - n), pause + 0.2 + (3 - n) + 0.18) : 0;
        return (
          <Seg key={q.n} t={t} a={ask - 0.2} b={end}>
            {q.visual(t, reveal, ans, ask)}
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
      <Seg t={t} a={s_(116) - 0.2} b={b + 0.1}>
        <div style={abs(0, 0, { width: 1800, height: 740, borderRadius: 44, background: C.card, border: `4px solid ${C.line}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" })}>
          <Big size={110}>Your score: <span style={{ color: C.matcha }}>? / 5</span></Big>
          <div style={{ marginTop: 30, ...pop(t, wf(116, "tell")) }}><Chip t={t} t0={wf(116, "tell")} bg={C.forest} size={46}>tell me in the comments</Chip></div>
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
    ["12 pairs", "numbered front → back", s_(118), C.matchaLight],
    ["I · II", "smell · sight", s_(119), TC.S],
    ["III · IV · VI", "move the eyes", wf(119, "three"), TC.M],
    ["V · VII", "V feels the face + chews · VII moves the face + taste", s_(120), TC.B],
    ["VIII · IX · X", "hearing + balance · throat · the wandering vagus", s_(121), TC.B],
    ["XI · XII", "shrug the shoulders · move the tongue", s_(122), TC.M],
    ["Names", "Ooh Ooh Ooh To Touch And Feel Very Good Velvet. Such Heaven!", s_(123), C.banana],
    ["Types", "Some Say Marry Money But My Brother Says Big Brains Matter More", s_(124), C.banana],
  ];
  const ot = s_(125) - 0.2;
  const outro = ramp(t, ot, ot + 0.5);
  return (
    <Stage a={a} b={END - 0.3}>
      {outro < 1 && (
        <div style={abs(0, 0, { width: 1800, height: 740, borderRadius: 44, background: C.forest })}>
          <div style={abs(70, 34, { fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 8, color: C.banana })}>RECAP</div>
          <div style={abs(70, 92, { display: "flex", flexDirection: "column", gap: 12 })}>
            {items.map(([h, s, tt, col]) => (
              <div key={h} style={{ ...pop(t, tt), display: "flex", alignItems: "center", gap: 24, fontFamily: FONT, fontWeight: 800 }}>
                <div style={{ width: 56, height: 56, borderRadius: 28, background: col, border: `4px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, color: C.forest }}>✓</div>
                <div style={{ width: 360, fontSize: 44, color: C.paper }}>{h}</div>
                <div style={{ fontSize: s.length > 50 ? 30 : 34, color: C.matchaLight, maxWidth: 1260 }}>{s}</div>
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
              <div style={{ background: C.red, color: C.paper, borderRadius: 50, padding: "18px 54px 22px", fontSize: 54, letterSpacing: 3, transform: `scale(${1 + 0.05 * Math.max(0, Math.sin((t - ot) * 5))})`, opacity: ramp(t, wf(125, "subscribe"), wf(125, "subscribe") + 0.3) }}>SUBSCRIBE</div>
            </div>
            <div style={{ marginTop: 40, background: C.paper, color: C.forest, borderRadius: 24, padding: "16px 30px 20px", fontSize: 40, opacity: ramp(t, s_(126), s_(126) + 0.4), width: "fit-content" }}>Which topic should we cover next?</div>
          </div>
        </div>
      )}
    </Stage>
  );
};
