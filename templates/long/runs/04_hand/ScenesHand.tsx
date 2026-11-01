import React from "react";
import { C, FONT, ramp, useT } from "./kit";
import { Facts, Stage, LogoMark } from "./Chrome16";
import { Plate } from "./Plates";
import { HandSkel, LongBone, Tunnel, StudyCard, GC, bonePath, Defs } from "./IllusHand";
import { Wrist, BoneTag } from "./WristH";
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
const ST = (n: number) => CH(n) + 2.3;
const BE = (n: number) => (n + 1 < CHAPTERS.length ? CH(n + 1) - 0.1 : END);

/* ---------- small UI pieces ---------- */
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
const Seg: React.FC<{ t: number; a: number; b: number; children: React.ReactNode }> = ({ t, a, b, children }) => {
  const o = ramp(t, a, a + 0.4) * (1 - ramp(t, b - 0.2, b + 0.2));
  if (o <= 0.001) return null;
  return <div style={{ position: "absolute", inset: 0, opacity: o, transform: `translateY(${(1 - ramp(t, a, a + 0.4)) * 20}px)` }}>{children}</div>;
};
const Note: React.FC<{ t: number; t0: number; old: string; x: number; y: number }> = ({ t, t0, old, x, y }) => (
  <div style={abs(x, y, { ...pop(t, t0), background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 20px 11px", fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.forest, whiteSpace: "nowrap", boxShadow: "0 8px 20px rgba(31,42,20,0.10)", transformOrigin: "0% 50%" })}>
    <span style={{ color: C.matcha }}>1918 atlas name:</span> {old}
  </div>
);
const Chip: React.FC<{ t: number; t0: number; bg?: string; color?: string; size?: number; children: React.ReactNode }> = ({ t, t0, bg = C.forest, color = C.paper, size = 34, children }) => (
  <div style={{ ...pop(t, t0), display: "inline-block", background: bg, color, fontFamily: FONT, fontWeight: 800, fontSize: size, padding: `${size * 0.3}px ${size * 0.62}px ${size * 0.38}px`, borderRadius: size * 0.6, whiteSpace: "nowrap" }}>{children}</div>
);
const ViewTag: React.FC<{ t: number; t0: number; x: number; y: number; text: string }> = ({ t, t0, x, y, text }) => (
  <div style={abs(x, y, { opacity: ramp(t, t0, t0 + 0.4), fontFamily: FONT, fontWeight: 800, fontSize: 22, letterSpacing: 3, color: C.matcha, background: "rgba(247,246,236,0.9)", padding: "4px 12px", borderRadius: 10 })}>{text}</div>
);
/** HTML tag pinned to a HandSkel bone */
const HTag: React.FC<{ t: number; t0: number; t1?: number; x: number; y: number; w: number; pt: [number, number]; text: string; dx?: number; dy?: number; hot?: boolean }> = ({ t, t0, t1, x, y, w, pt, text, dx = 0, dy = 0, hot }) => {
  const k = w / 800;
  const p = ramp(t, t0, t0 + 0.25) * (t1 === undefined ? 1 : 1 - ramp(t, t1, t1 + 0.25));
  if (p <= 0) return null;
  return (
    <div style={abs(x + (pt[0] + dx) * k, y + (pt[1] + dy) * k, { transform: `translate(-50%, -50%) scale(${0.8 + 0.2 * p})`, opacity: p, background: hot ? C.banana : C.forest, color: hot ? C.forest : C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 30, padding: "5px 14px 8px", borderRadius: 14, whiteSpace: "nowrap", boxShadow: "0 6px 0 rgba(31,42,20,0.15)" })}>{text}</div>
  );
};

/* plates (Gray's Anatomy 1918, public domain) */
const HAND = { src: "plates/hand.png", aspect: 2208 / 2876 };
const CARPUS = { src: "plates/carpus.png", aspect: 1075 / 695 };
const PALM = { src: "plates/palmcarpus.png", aspect: 824 / 656 };
const WSEC = { src: "plates/wristsec.png", aspect: 1751 / 1272 };
const OSSIF = { src: "plates/ossif.png", aspect: 744 / 444 };
const HAND_COVERS = [{ x: 0, y: 0, w: 0.012, h: 1 }, { x: 0, y: 0.462, w: 0.05, h: 0.06 }];
const CARPUS_COVERS = [{ x: 0.955, y: 0.76, w: 0.05, h: 0.16 }];
const PALM_COVERS = [{ x: 0, y: 0.5, w: 0.03, h: 0.5 }];

const at = (ids: string[], t0: number, step = 0) => Object.fromEntries(ids.map((id, i) => [id, t0 + i * step]));
const winAll = (ids: string[], a: number, b?: number) => Object.fromEntries(ids.map((id) => [id, { a, b }]));

/* ================= INTRO ================= */
export const SIntro: React.FC = () => {
  const t = useT();
  const b3 = s_(3);
  return (
    <Stage a={-1} b={BE(0)}>
      <Seg t={t} a={-1} b={b3}>
        <Plate {...HAND} x={40} y={0} w={568} a={-1} b={b3 + 0.2} covers={HAND_COVERS} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.45, 0.45, 0.25]}
          labels={[{ x: 0.5, y: 0.12, text: "Wrist", t: wf(1, "wrist"), side: "r", hot: true }, { x: 0.47, y: 0.62, text: "Hand", t: wf(1, "hand"), side: "r" }]} />
        <div style={abs(700, 10, { width: 1080, ...pop(t, 0.2) })}>
          <Big size={84}>
            Bones of the <Mk p={ramp(t, wf(1, "bones"), wf(1, "bones") + 0.6)}>Hand &amp; Wrist</Mk>
          </Big>
          <Big size={60} color={C.matcha} style={{ marginTop: 8 }}>made easy</Big>
        </div>
        <Facts x={700} y={230} w={960}
          items={[
            { t: s_(0), text: "make a fist · spread · thumb to little finger", bg: C.forest },
            { t: s_(1), text: "every move uses the bones of the hand + wrist" },
            { t: wf(2, "twenty"), text: "bones in EACH hand — exams ask about them all", big: "27", bg: C.matcha },
          ]} />
      </Seg>
      <Seg t={t} a={b3} b={BE(0) + 0.1}>
        <div style={abs(120, -5)}>
          <HandSkel t={t} w={600} groups={{ carpal: wf(3, "three"), meta: wf(3, "three") + 0.35, phal: wf(3, "three") + 0.7 }} />
        </div>
        <ViewTag t={t} t0={b3 + 0.3} x={60} y={700} text="LEFT HAND · BACK VIEW" />
        <div style={abs(860, 0, { width: 900, ...pop(t, b3 + 0.1) })}>
          <Big size={58}>27 bones. Just 3 groups.</Big>
        </div>
        <div style={abs(860, 110, { width: 900, display: "flex", flexDirection: "column", gap: 14 })}>
          {[
            ["all 8 carpal bones, in order", wf(4, "eight"), GC.carpal],
            ["the 5 metacarpals", wf(4, "metacarpals"), GC.meta],
            ["the 14 phalanges", wf(4, "phalanges"), GC.phal],
            ["the joints between them", wf(4, "joints"), C.matchaLight],
            ["memory tricks that stick", s_(5), C.banana],
          ].map(([txt, tt, col]) => (
            <div key={txt as string} style={{ ...pop(t, tt as number), display: "flex", alignItems: "center", gap: 18, background: C.card, border: `3px solid ${C.line}`, borderRadius: 24, padding: "10px 22px", fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.forest }}>
              <div style={{ width: 44, height: 44, borderRadius: 22, background: col as string, border: `3px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>✓</div>
              {txt}
            </div>
          ))}
        </div>
        <div style={abs(860, 640)}>
          <Chip t={t} t0={wf(6, "five")} bg={C.banana} color={C.forest} size={40}>+ 5-question quiz at the end</Chip>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 1. THE BIG PICTURE ================= */
const NumTile: React.FC<{ t: number; t0: number; n: string; label: string; sub: string; col: string }> = ({ t, t0, n, label, sub, col }) => (
  <div style={{ ...pop(t, t0), width: 250, height: 290, borderRadius: 32, background: C.card, border: `4px solid ${C.forest}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, boxShadow: "0 12px 30px rgba(31,42,20,0.10)" }}>
    <div style={{ width: 150, height: 150, borderRadius: 75, background: col, border: `4px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 96, color: C.forest, lineHeight: 1 }}>{n}</div>
    <div style={{ fontSize: 36, color: C.forest, marginTop: 12 }}>{label}</div>
    <div style={{ fontSize: 24, color: C.matcha }}>{sub}</div>
  </div>
);
export const SBig: React.FC = () => {
  const t = useT();
  const a = ST(1), b = BE(1);
  const m = s_(14);
  const W = 590;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={m}>
        <div style={abs(40, -5)}>
          <HandSkel t={t} w={W} draw={a} groups={{ carpal: wf(9, "carpals"), meta: wf(10, "metacarpals"), phal: wf(11, "phalanges") }} />
        </div>
        <HTag t={t} t0={wf(9, "carpals")} x={40} y={-5} w={W} pt={[640, 800]} text="carpals · wrist" />
        <HTag t={t} t0={wf(10, "metacarpals")} x={40} y={-5} w={W} pt={[660, 560]} text="metacarpals · palm" />
        <HTag t={t} t0={wf(11, "phalanges")} x={40} y={-5} w={W} pt={[700, 260]} text="phalanges · fingers" />
        <div style={abs(820, 20, { display: "flex", gap: 22, alignItems: "center" })}>
          <NumTile t={t} t0={wf(9, "eight")} n="8" label="carpals" sub="the wrist" col={GC.carpal} />
          <div style={{ ...pop(t, wf(10, "five")), fontFamily: FONT, fontWeight: 800, fontSize: 70, color: C.forest }}>+</div>
          <NumTile t={t} t0={wf(10, "five")} n="5" label="metacarpals" sub="the palm" col={GC.meta} />
          <div style={{ ...pop(t, wf(11, "fourteen")), fontFamily: FONT, fontWeight: 800, fontSize: 70, color: C.forest }}>+</div>
          <NumTile t={t} t0={wf(11, "fourteen")} n="14" label="phalanges" sub="the fingers" col={GC.phal} />
        </div>
        <div style={abs(820, 360, { ...pop(t, wf(12, "makes")), background: C.forest, borderRadius: 32, padding: "14px 40px 20px", fontFamily: FONT, fontWeight: 800, fontSize: 110, color: C.banana, transformOrigin: "0% 50%" })}>
          = 27 <span style={{ fontSize: 50, color: C.paper }}>bones per hand</span>
        </div>
        <div style={abs(820, 560, { width: 940 })}>
          <Chip t={t} t0={s_(13)} bg={C.card} color={C.forest} size={36}>many small bones → many small joints</Chip>
          <div style={{ height: 14 }} />
          <Chip t={t} t0={wf(13, "flexible")} bg={C.matcha} size={36}>→ a very flexible hand</Chip>
        </div>
      </Seg>
      <Seg t={t} a={m} b={b + 0.1}>
        <div style={abs(160, -5)}>
          <HandSkel t={t} w={W} />
        </div>
        {/* radius / ulna glow tags */}
        <HTag t={t} t0={wf(15, "radius")} x={160} y={-5} w={W} pt={[340, 930]} text="radius · thumb side" hot />
        <HTag t={t} t0={wf(15, "ulna")} x={160} y={-5} w={W} pt={[560, 850]} dx={60} text="ulna · little finger side" />
        {/* lateral / medial arrows */}
        {(() => {
          const p1 = ramp(t, wf(17, "lateral"), wf(17, "lateral") + 0.35), p2 = ramp(t, wf(17, "medial"), wf(17, "medial") + 0.35);
          return (
            <>
              <div style={abs(-10, 360, { opacity: p1, transform: `translateX(${(1 - p1) * 30}px)`, fontFamily: FONT, fontWeight: 800, textAlign: "center" })}>
                <div style={{ fontSize: 70, color: C.red, lineHeight: 1 }}>←</div>
                <div style={{ fontSize: 34, color: C.forest, background: C.banana, padding: "4px 14px 7px", borderRadius: 12 }}>LATERAL</div>
                <div style={{ fontSize: 22, color: C.matcha, marginTop: 6 }}>thumb side</div>
              </div>
              <div style={abs(700, 360, { opacity: p2, transform: `translateX(${(1 - p2) * -30}px)`, fontFamily: FONT, fontWeight: 800, textAlign: "center" })}>
                <div style={{ fontSize: 70, color: C.red, lineHeight: 1 }}>→</div>
                <div style={{ fontSize: 34, color: C.paper, background: C.forest, padding: "4px 14px 7px", borderRadius: 12 }}>MEDIAL</div>
                <div style={{ fontSize: 22, color: C.matcha, marginTop: 6 }}>little finger side</div>
              </div>
            </>
          );
        })()}
        <ViewTag t={t} t0={m + 0.3} x={20} y={0} text="LEFT HAND · BACK VIEW" />
        <Facts x={1000} y={10} w={780}
          items={[
            { t: s_(14), text: "2 forearm bones above the wrist" },
            { t: s_(16), text: "anatomical position: palm facing forward", bg: C.forest },
            { t: s_(17), text: "thumb side = LATERAL · little finger side = MEDIAL" },
            { t: s_(18), text: "every row: lateral → medial, start at the thumb", bg: C.matcha },
          ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 2. THE PROXIMAL ROW ================= */
export const SProx: React.FC = () => {
  const t = useT();
  const a = ST(2), b = BE(2);
  const WW = 800;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(21)}>
        <div style={abs(60, 20)}>
          <Wrist t={t} w={WW} rowHi={{ p: wf(20, "proximal"), d: wf(19, "two") }} />
        </div>
        <ViewTag t={t} t0={a + 0.3} x={60} y={700} text="LEFT WRIST · BACK VIEW" />
        <div style={abs(980, 30, { width: 800, display: "flex", flexDirection: "column", gap: 22 })}>
          <div style={pop(t, a + 0.1)}><Big size={74}>8 carpal bones</Big></div>
          <div><Chip t={t} t0={wf(19, "two")} bg={C.matcha} size={46}>2 rows × 4</Chip></div>
          <div><Chip t={t} t0={wf(20, "proximal")} bg={C.red} size={46}>proximal row = near the forearm</Chip></div>
        </div>
      </Seg>
      {/* scaphoid on the 1918 plate */}
      <Seg t={t} a={s_(21)} b={s_(25)}>
        <Plate {...CARPUS} x={0} y={30} w={1000} a={s_(21)} b={s_(25)} covers={CARPUS_COVERS} zoomFrom={[1.0, 0.45, 0.4]} zoomTo={[1.35, 0.38, 0.35]}
          labels={[{ x: 0.42, y: 0.38, text: "Scaphoid", t: wf(21, "scaphoid"), side: "r", hot: true }]} />
        <Note t={t} t0={wf(21, "scaphoid") + 1.2} old="navicular (= scaphoid)" x={20} y={690} />
        <Facts x={1050} y={20} w={730}
          items={[
            { t: wf(22, "boat"), text: "scaphoid = “boat-shaped”", bg: C.forest },
            { t: wf(22, "largest"), text: "largest bone of the proximal row" },
            { t: wf(23, "fractured"), text: "the most commonly fractured carpal bone", bg: C.red },
            { t: s_(24), text: "blood enters from the far end → a break heals slowly" },
          ]} />
      </Seg>
      {/* lunate, triquetrum on our diagram */}
      <Seg t={t} a={s_(25)} b={s_(28)}>
        <div style={abs(60, 20)}>
          <Wrist t={t} w={WW} lit={{ S: s_(25) - 0.3, L: wf(25, "lunate"), Tq: wf(27, "triquetrum") }} dim={0} />
          <BoneTag t={t} t0={s_(25) - 0.2} id="S" w={WW} side="down" ox={-40} />
          <BoneTag t={t} t0={wf(25, "lunate")} id="L" w={WW} side="down" ox={50} />
          <BoneTag t={t} t0={wf(27, "triquetrum")} id="Tq" w={WW} side="up" ox={40} />
        </div>
        <Facts x={1000} y={20} w={780}
          items={[
            { t: wf(25, "lunate"), text: "lunate = crescent moon shape", bg: C.forest },
            { t: s_(26), text: "scaphoid + lunate meet the radius (wrist joint)" },
            { t: wf(27, "triquetrum"), text: "triquetrum = pyramid, 3 corners", bg: C.matcha },
          ]} />
      </Seg>
      {/* pisiform on the palm-side plate */}
      <Seg t={t} a={s_(28)} b={s_(31)}>
        <Plate {...PALM} x={40} y={20} w={860} a={s_(28)} b={s_(31)} covers={PALM_COVERS} zoomFrom={[1.0, 0.4, 0.45]} zoomTo={[1.3, 0.25, 0.55]}
          labels={[
            { x: 0.3, y: 0.37, text: "Triquetrum", t: wf(28, "triquetrum"), side: "r" },
            { x: 0.17, y: 0.71, text: "Pisiform", t: wf(28, "pisiform"), side: "r", hot: true },
          ]} />
        <ViewTag t={t} t0={s_(28) + 0.3} x={60} y={640} text="PALM VIEW · THUMB ON THE RIGHT" />
        <Note t={t} t0={wf(28, "triquetrum") + 1.0} old="triangular (= triquetrum)" x={40} y={-30} />
        <Facts x={960} y={20} w={820}
          items={[
            { t: wf(28, "pisiform"), text: "pisiform = “pea-shaped”, on the front of the triquetrum", bg: C.forest },
            { t: wf(29, "sesamoid"), text: "a sesamoid bone — it forms inside a tendon" },
            { t: wf(29, "flexor"), text: "tendon of flexor carpi ulnaris", bg: C.matcha },
            { t: s_(30), text: "feel it: the bump at the base of your palm, little finger side" },
          ]} />
      </Seg>
      {/* old names */}
      <Seg t={t} a={s_(31)} b={b + 0.1}>
        <Plate {...CARPUS} x={0} y={30} w={1000} a={s_(31)} b={b} covers={CARPUS_COVERS} zoomFrom={[1.05, 0.55, 0.35]} zoomTo={[1.15, 0.55, 0.35]}
          labels={[
            { x: 0.42, y: 0.38, text: "Scaphoid", t: s_(31), side: "r", hot: true },
            { x: 0.6, y: 0.33, text: "Lunate", t: s_(31) + 0.25, side: "r" },
            { x: 0.73, y: 0.52, text: "Triquetrum", t: wf(31, "triangular") - 0.3, side: "l", hot: true },
            { x: 0.88, y: 0.42, text: "Pisiform", t: s_(31) + 0.5, side: "l" },
          ]} />
        <div style={abs(1050, 40, { width: 730, display: "flex", flexDirection: "column", gap: 22 })}>
          <div style={pop(t, s_(31))}><Big size={56}>Old names you’ll still meet</Big></div>
          {[
            ["navicular", "scaphoid", wf(31, "navicular")],
            ["triangular", "triquetrum", wf(31, "triangular")],
          ].map(([o, n, tt]) => (
            <div key={o as string} style={{ ...pop(t, tt as number), display: "flex", alignItems: "center", gap: 18, fontFamily: FONT, fontWeight: 800 }}>
              <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 20, padding: "12px 22px", fontSize: 40, color: C.matcha, textDecoration: "line-through" }}>{o}</div>
              <div style={{ fontSize: 54, color: C.forest }}>→</div>
              <div style={{ background: C.forest, borderRadius: 20, padding: "12px 22px", fontSize: 44, color: C.banana }}>{n}</div>
            </div>
          ))}
          <div style={{ ...pop(t, wf(31, "surprised")), fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.matcha }}>Gray’s Anatomy, 1918 · public domain</div>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 3. THE DISTAL ROW ================= */
export const SDist: React.FC = () => {
  const t = useT();
  const a = ST(3), b = BE(3);
  const WW = 800;
  const sw0 = wf(35, "swing") - 0.3;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(34)}>
        <div style={abs(60, 20)}>
          <Wrist t={t} w={WW} rowHi={{ d: a + 0.2 }} thumbGlow={s_(33)} lit={{ S: a - 5, L: a - 5, Tq: a - 5, P: a - 5 }} />
        </div>
        <div style={abs(980, 30, { width: 800, display: "flex", flexDirection: "column", gap: 22 })}>
          <div style={pop(t, a + 0.1)}><Big size={74}>The distal row</Big></div>
          <div><Chip t={t} t0={a + 0.5} bg={C.matcha} size={42}>4 bones that meet the metacarpals</Chip></div>
          <div><Chip t={t} t0={s_(33)} bg={C.banana} color={C.forest} size={42}>start at the thumb →</Chip></div>
        </div>
      </Seg>
      {/* trapezium + thumb swing */}
      <Seg t={t} a={s_(34)} b={s_(36)}>
        <div style={abs(160, -5)}>
          <HandSkel t={t} w={590} lit={{ Tm: wf(34, "trapezium"), mc1: wf(35, "first") }} swing={[sw0, sw0 + 1.3, s_(36) - 1.5]} dim={0.6} />
        </div>
        <HTag t={t} t0={wf(34, "trapezium")} x={160} y={-5} w={590} pt={[230, 770]} dx={-110} dy={40} text="Trapezium" hot />
        <Facts x={1000} y={20} w={780}
          items={[
            { t: wf(34, "trapezium"), text: "trapezium = right at the base of the thumb", bg: C.forest },
            { t: wf(35, "saddle"), text: "saddle-shaped surface for metacarpal 1" },
            { t: wf(35, "swing"), text: "→ your thumb can swing across the palm", bg: C.matcha },
          ]} />
      </Seg>
      {/* trapezoid + capitate on the plate */}
      <Seg t={t} a={s_(36)} b={s_(39)}>
        <Plate {...CARPUS} x={0} y={30} w={1000} a={s_(36)} b={s_(39)} covers={CARPUS_COVERS} zoomFrom={[1.25, 0.25, 0.62]} zoomTo={[1.3, 0.5, 0.6]}
          labels={[
            { x: 0.3, y: 0.62, text: "Trapezoid", t: wf(36, "trapezoid"), side: "r", hot: true },
            { x: 0.52, y: 0.72, text: "Capitate", t: wf(37, "capitate"), side: "r", hot: true },
          ]} />
        <Note t={t} t0={wf(36, "trapezoid") + 1.0} old="lesser multangular (= trapezoid)" x={20} y={690} />
        <Facts x={1050} y={20} w={730}
          items={[
            { t: wf(36, "trapezoid"), text: "trapezoid = the SMALLEST carpal bone", bg: C.forest },
            { t: wf(37, "capitate"), text: "capitate = the LARGEST carpal bone", bg: C.matcha },
            { t: s_(38), text: "capitate means “head” — a rounded top" },
          ]} />
      </Seg>
      {/* ossification */}
      <Seg t={t} a={s_(39)} b={s_(40)}>
        <Plate {...OSSIF} x={0} y={60} w={1000} a={s_(39)} b={s_(40)} zoomFrom={[1.05, 0.45, 0.55]} zoomTo={[1.25, 0.3, 0.45]}
          labels={[
            { x: 0.47, y: 0.73, text: "1st year", t: wf(39, "capitate"), side: "r", hot: true },
            { x: 0.3, y: 0.76, text: "1st year", t: wf(39, "hamate"), side: "r", hot: true },
            { x: 0.19, y: 0.44, text: "~12 years", t: wf(39, "pisiform"), side: "r" },
          ]} />
        <Note t={t} t0={s_(39) + 1.5} old="triangular, multangular" x={20} y={-20} />
        <Facts x={1050} y={20} w={730}
          items={[
            { t: s_(39), text: "in children, carpals turn to bone one by one", bg: C.forest },
            { t: wf(39, "capitate"), text: "first: capitate + hamate (year 1)", bg: C.matcha },
            { t: wf(39, "pisiform"), text: "last: pisiform (around age 12)" },
          ]} />
      </Seg>
      {/* hamate + hook */}
      <Seg t={t} a={s_(40)} b={s_(42)}>
        <div style={abs(60, 20)}>
          <Wrist t={t} w={WW} lit={{ H: wf(40, "hamate") }} hookGlow={wf(41, "hook", 1)} />
          <BoneTag t={t} t0={wf(40, "hamate")} id="H" w={WW} side="up" />
        </div>
        <Facts x={1000} y={20} w={780}
          items={[
            { t: wf(40, "hamate"), text: "hamate = little finger side of the distal row", bg: C.forest },
            { t: wf(41, "hooked"), text: "hamate means “hooked”" },
            { t: wf(41, "hook", 1), text: "the hook of the hamate points toward the palm", bg: C.red },
          ]} />
      </Seg>
      {/* carpal tunnel */}
      <Seg t={t} a={s_(42)} b={b + 0.1}>
        <div style={abs(20, 80)}>
          <Tunnel t={t} w={900} arch={s_(42) + 0.3} ret={wf(43, "retinaculum") - 0.2} tendons={wf(45, "nine")} nerve={wf(45, "median")} />
        </div>
        <ViewTag t={t} t0={s_(42) + 0.3} x={40} y={20} text="CROSS-SECTION THROUGH THE WRIST" />
        <Facts x={1000} y={20} w={780}
          items={[
            { t: wf(42, "arch"), text: "the carpal bones form an arch", bg: C.forest },
            { t: wf(43, "retinaculum"), text: "flexor retinaculum spans across it" },
            { t: wf(44, "carpal"), text: "the space underneath = the CARPAL TUNNEL", bg: C.matcha },
            { t: wf(45, "nine"), text: "9 flexor tendons + the median nerve pass through" },
          ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 4. THE METACARPALS ================= */
export const SMeta: React.FC = () => {
  const t = useT();
  const a = ST(4), b = BE(4);
  const W = 590;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(49)}>
        <div style={abs(160, -5)}>
          <HandSkel t={t} w={W} groups={{ meta: a }} nums={wf(47, "one")} lit={{ mc1: { a: wf(48, "one"), b: wf(48, "five") - 0.1 }, mc5: wf(48, "five") }} />
        </div>
        <HTag t={t} t0={wf(48, "thumb")} x={160} y={-5} w={W} pt={[110, 580]} text="thumb" hot />
        <HTag t={t} t0={wf(48, "little")} x={160} y={-5} w={W} pt={[640, 470]} text="little finger" />
        <Facts x={1000} y={20} w={780}
          items={[
            { t: a, text: "5 metacarpals = the bones of the palm", bg: C.forest },
            { t: wf(47, "one"), text: "numbered 1 → 5, starting at the thumb", bg: C.matcha },
            { t: wf(48, "one"), text: "metacarpal 1 = thumb · 5 = little finger" },
          ]} />
      </Seg>
      <Seg t={t} a={s_(49)} b={s_(51)}>
        <div style={abs(0, 20, { width: 1800, textAlign: "center", ...pop(t, s_(49)) })}>
          <Big size={72}>Every metacarpal has <span style={{ color: C.matcha }}>3 parts</span></Big>
        </div>
        <div style={abs(380, 170)}>
          <LongBone t={t} w={1040} base={wf(50, "base")} shaft={wf(50, "shaft")} head={wf(50, "head")} />
        </div>
      </Seg>
      <Seg t={t} a={s_(51)} b={s_(54)}>
        <Plate {...HAND} x={120} y={0} w={568} a={s_(51)} b={s_(54)} covers={HAND_COVERS} zoomFrom={[1.3, 0.5, 0.4]} zoomTo={[1.5, 0.5, 0.42]}
          labels={[
            { x: 0.6, y: 0.485, text: "metacarpal heads", t: wf(52, "heads"), side: "l", hot: true },
            { x: 0.4, y: 0.3, text: "dorsal interossei", t: wf(53, "interossei"), side: "r" },
          ]} />
        <Note t={t} t0={s_(51) + 1.0} old="body (= shaft)" x={120} y={-30} />
        <Facts x={1000} y={20} w={780}
          items={[
            { t: s_(51), text: "make a fist — look at your knuckles", bg: C.forest },
            { t: wf(52, "heads"), text: "knuckles = the heads of the metacarpals", bg: C.matcha },
            { t: wf(53, "interossei"), text: "interossei between the shafts spread + close the fingers" },
          ]} />
      </Seg>
      <Seg t={t} a={s_(54)} b={b + 0.1}>
        <div style={abs(160, -5)}>
          <HandSkel t={t} w={W} groups={{ meta: s_(54) - 3 }} nums={s_(54) - 3}
            lit={{ mc1: { a: s_(54), b: s_(55) - 0.2 }, mc2: { a: wf(55, "two"), b: s_(56) - 0.2 }, mc3: { a: wf(55, "three"), b: s_(56) - 0.2 }, mc4: wf(56, "four"), mc5: wf(56, "five") }}
            swing={[wf(54, "own") - 0.2, wf(54, "own") + 1.0, s_(55) - 1.2]} />
        </div>
        <Facts x={1000} y={20} w={780}
          items={[
            { t: s_(54), text: "MC 1: shorter, stands apart → the thumb moves on its own", bg: C.forest },
            { t: s_(55), text: "MC 2 + 3: held firmly in place" },
            { t: s_(56), text: "MC 4 + 5: move a little → helps your grip", bg: C.matcha },
          ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 5. THE PHALANGES ================= */
const MIDP = ["p2m", "p3m", "p4m", "p5m"], DIST = ["p1d", "p2d", "p3d", "p4d", "p5d"];
export const SPhal: React.FC = () => {
  const t = useT();
  const a = ST(5), b = BE(5);
  const W = 590;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(59)}>
        <div style={abs(160, -5)}>
          <HandSkel t={t} w={W} groups={{ phal: a }} />
        </div>
        <div style={abs(1000, 60, { width: 780, display: "flex", flexDirection: "column", gap: 30 })}>
          <div style={pop(t, wf(58, "phalanx"))}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 5, color: C.matcha }}>ONE BONE</div>
            <Big size={110}>phalanx</Big>
          </div>
          <div style={pop(t, wf(58, "phalanges"))}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 5, color: C.matcha }}>MORE THAN ONE</div>
            <Big size={110} color={C.red}>phalanges</Big>
          </div>
        </div>
      </Seg>
      <Seg t={t} a={s_(59)} b={s_(61)}>
        <div style={abs(160, -5)}>
          <HandSkel t={t} w={W} groups={{ phal: s_(59) - 3 }} lit={{ ...winAll(["p2p", "p3p", "p4p", "p5p"], wf(60, "proximal"), wf(60, "middle") - 0.1), ...winAll(MIDP, wf(60, "middle"), wf(60, "distal") - 0.1), ...winAll(["p2d", "p3d", "p4d", "p5d"], wf(60, "distal")) }} dim={0.4} />
        </div>
        <Facts x={1000} y={20} w={780}
          items={[
            { t: s_(59), text: "fingers 2 – 5: three phalanges each", bg: C.forest },
            { t: wf(60, "proximal"), text: "1 · proximal phalanx" },
            { t: wf(60, "middle"), text: "2 · middle phalanx", bg: C.matcha },
            { t: wf(60, "distal"), text: "3 · distal phalanx (fingertip)" },
          ]} />
      </Seg>
      <Seg t={t} a={s_(61)} b={s_(63)}>
        <div style={abs(160, -5)}>
          <HandSkel t={t} w={W} groups={{ phal: s_(61) - 3 }} lit={{ p1p: wf(62, "proximal"), p1d: wf(62, "distal") }} dim={0.65} />
        </div>
        <HTag t={t} t0={wf(62, "proximal")} x={160} y={-5} w={W} pt={[90, 520]} dx={-40} text="proximal" hot />
        <HTag t={t} t0={wf(62, "distal")} x={160} y={-5} w={W} pt={[40, 420]} dx={-20} dy={-50} text="distal" hot />
        <div style={abs(1000, 60, { width: 780 })}>
          <div style={pop(t, s_(61))}><Big size={84}>The thumb is different</Big></div>
          <div style={{ marginTop: 40 }}><Chip t={t} t0={wf(62, "two")} bg={C.red} size={56}>only 2 phalanges</Chip></div>
          <div style={{ marginTop: 24 }}><Chip t={t} t0={wf(62, "proximal")} bg={C.card} color={C.forest} size={44}>proximal + distal · no middle</Chip></div>
        </div>
      </Seg>
      <Seg t={t} a={s_(63)} b={s_(65)}>
        <Plate {...HAND} x={60} y={0} w={568} a={s_(63)} b={s_(65)} covers={HAND_COVERS} zoomFrom={[1.35, 0.47, 0.7]} zoomTo={[1.5, 0.47, 0.76]}
          labels={[
            { x: 0.5, y: 0.62, text: "proximal", t: s_(63) + 0.6, side: "r" },
            { x: 0.5, y: 0.845, text: "middle", t: s_(63) + 1.2, side: "r" },
            { x: 0.445, y: 0.725, text: "head", t: wf(64, "head"), side: "l", hot: true },
            { x: 0.445, y: 0.82, text: "shaft", t: wf(64, "shaft"), side: "l", hot: true },
            { x: 0.445, y: 0.772, text: "base", t: wf(64, "base"), side: "l", hot: true },
          ]} />
        <Note t={t} t0={s_(64) + 1.6} old="1st, 2nd, 3rd row · body" x={60} y={-30} />
        <div style={abs(760, 40, { width: 1020, display: "flex", alignItems: "center", gap: 16, fontFamily: FONT, fontWeight: 800 })}>
          {[["4", "fingers", wf(63, "four"), C.card], ["×", "", wf(63, "times"), "none"], ["3", "each", wf(63, "three"), C.card], ["+", "", wf(63, "plus"), "none"], ["2", "thumb", wf(63, "two"), C.card], ["=", "", wf(63, "makes"), "none"], ["14", "phalanges", wf(63, "fourteen"), GC.phal]].map(([n, l, tt, bg], i) => (
            <div key={i} style={{ ...pop(t, tt as number), textAlign: "center" }}>
              <div style={{ minWidth: bg === "none" ? 40 : 120, height: 120, borderRadius: 26, background: bg === "none" ? "transparent" : (bg as string), border: bg === "none" ? "none" : `4px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 76, color: C.forest, padding: "0 10px" }}>{n}</div>
              <div style={{ fontSize: 24, color: C.matcha, marginTop: 6, height: 30 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={abs(760, 260, { width: 1000 })}>
          <Chip t={t} t0={s_(64)} bg={C.forest} size={40}>every phalanx: base · shaft · head</Chip>
        </div>
      </Seg>
      <Seg t={t} a={s_(65)} b={b + 0.1}>
        <div style={abs(160, -5)}>
          <HandSkel t={t} w={W} lit={at(DIST, wf(65, "distal"), 0.08)} dim={0.6} />
        </div>
        <Facts x={1000} y={20} w={780}
          items={[
            { t: wf(65, "distal"), text: "distal phalanges = the smallest", bg: C.forest },
            { t: wf(65, "flat"), text: "their flat tips support the soft pads of your fingertips" },
          ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 6. THE JOINTS ================= */
const FingerBend: React.FC<{ t: number; t0: number; w?: number }> = ({ t, t0, w = 820 }) => {
  const f = t < t0 ? 0 : 0.5 - 0.5 * Math.cos((t - t0) * 2.2);
  const L = [220, 150, 100, 76], WD = [62, 54, 46, 40], kinds = ["mc", "p", "m", "d"];
  const ang = [0, 38 * f, 70 * f, 45 * f];
  let x = 40, y = 110, a = 0;
  const parts: React.ReactNode[] = [];
  const joints: [number, number][] = [];
  L.forEach((len, i) => {
    a += ang[i];
    const r = (a * Math.PI) / 180;
    parts.push(
      <g key={i} transform={`translate(${x} ${y}) rotate(${a})`} filter="url(#hsSh)">
        <path d={bonePath(len, WD[i], kinds[i])} fill="url(#hsShaft)" stroke={C.forest} strokeWidth={4} strokeLinejoin="round" />
        {kinds[i] !== "d" && <ellipse cx={len - WD[i] * 0.15} cy={0} rx={WD[i] * 0.5} ry={WD[i] * 0.56} fill="url(#hsBone)" stroke={C.forest} strokeWidth={4} />}
        <path d={bonePath(len, WD[i], kinds[i])} fill={i === 0 ? GC.meta : GC.phal} opacity={0.65} />
      </g>
    );
    x += Math.cos(r) * (len + 8);
    y += Math.sin(r) * (len + 8);
    if (i < 3) joints.push([x - Math.cos(r) * 4, y - Math.sin(r) * 4]);
  });
  const names = ["MCP", "PIP", "DIP"];
  return (
    <svg width={w} height={w * 0.614} viewBox="0 0 700 430" style={{ overflow: "visible" }}>
      <Defs />
      {parts}
      {joints.map(([jx, jy], i) => (
        <g key={i}>
          <circle cx={jx} cy={jy} r={40} fill={C.red} opacity={0.3} filter="url(#hsGlow)" />
          <circle cx={jx} cy={jy} r={28} fill="none" stroke={C.red} strokeWidth={7} />
          <text x={jx} y={jy - 46} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={C.forest}>{names[i]}</text>
        </g>
      ))}
    </svg>
  );
};
const Formula: React.FC<{ t: number; t0: number; a: string; b: string; r: string; ab?: string }> = ({ t, t0, a, b, r }) => (
  <div style={{ ...pop(t, t0), background: C.card, border: `3px solid ${C.line}`, borderRadius: 26, padding: "14px 24px", fontFamily: FONT, fontWeight: 800, boxShadow: "0 12px 30px rgba(31,42,20,0.10)", transformOrigin: "0% 50%" }}>
    <div style={{ fontSize: 30, color: C.matcha }}>{a} <span style={{ color: C.forest }}>+</span> {b}</div>
    <div style={{ fontSize: 46, color: C.forest, lineHeight: 1.1 }}>= {r}</div>
  </div>
);
export const SJoints: React.FC = () => {
  const t = useT();
  const a = ST(6), b = BE(6);
  const W = 590;
  const j0 = wf(67, "named");
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(68)}>
        <div style={abs(160, -5)}>
          <HandSkel t={t} w={W} joints={{ rc: j0, mid: j0 + 0.25, cmc: j0 + 0.5, mcp: j0 + 0.75, pip: j0 + 1.0, dip: j0 + 1.25, ip: j0 + 1.0 }} />
        </div>
        <div style={abs(980, 40, { width: 800 })}>
          <div style={pop(t, a + 0.1)}><Big size={70}>Joint name =</Big></div>
          <div style={{ ...pop(t, j0), marginTop: 12 }}><Big size={70} color={C.matcha}>the 2 bones it joins</Big></div>
          <div style={{ marginTop: 50 }}><Chip t={t} t0={wf(67, "know")} bg={C.banana} color={C.forest} size={42}>know the bones → know the joints</Chip></div>
        </div>
      </Seg>
      <Seg t={t} a={s_(68)} b={s_(70)}>
        <Plate {...WSEC} x={0} y={20} w={960} a={s_(68)} b={s_(70)} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.0, 0.5, 0.5]}
          labels={[
            { x: 0.42, y: 0.415, text: "Radiocarpal joint", t: wf(68, "radiocarpal"), side: "r", hot: true },
            { x: 0.44, y: 0.555, text: "Midcarpal joint", t: wf(69, "midcarpal"), side: "r", hot: true },
          ]} />
        <Note t={t} t0={wf(68, "radiocarpal") + 1.5} old="navicular, greater / lesser multangular" x={0} y={-30} />
        <div style={abs(1010, 20, { width: 770, display: "flex", flexDirection: "column", gap: 20 })}>
          <Formula t={t} t0={wf(68, "radiocarpal")} a="radius" b="carpals" r="RADIOCARPAL (wrist)" />
          <Formula t={t} t0={wf(69, "midcarpal")} a="proximal row" b="distal row" r="MIDCARPAL" />
        </div>
      </Seg>
      <Seg t={t} a={s_(70)} b={s_(73)}>
        <div style={abs(160, -5)}>
          <HandSkel t={t} w={W} joints={{ cmc: wf(70, "carpometacarpal") }} lit={{ Tm: s_(71), mc1: s_(71) + 0.3 }} swing={[wf(72, "reach") - 0.2, wf(72, "reach") + 1.2]} />
        </div>
        <div style={abs(1000, 20, { width: 780, display: "flex", flexDirection: "column", gap: 20 })}>
          <Formula t={t} t0={wf(70, "carpometacarpal")} a="carpals" b="metacarpals" r="CARPOMETACARPAL · CMC" />
          <div style={{ ...pop(t, s_(71)), background: C.forest, borderRadius: 26, padding: "16px 24px", fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.paper, transformOrigin: "0% 50%" }}>
            thumb CMC = trapezium + MC 1 → <span style={{ color: C.banana }}>a saddle joint</span>
          </div>
          <div><Chip t={t} t0={wf(72, "reach")} bg={C.matcha} size={36}>→ the thumb reaches across to the fingertips</Chip></div>
        </div>
      </Seg>
      <Seg t={t} a={s_(73)} b={s_(77)}>
        <div style={abs(160, -5)}>
          <HandSkel t={t} w={W} joints={{ mcp: wf(73, "metacarpophalangeal"), pip: wf(75, "proximal"), dip: wf(75, "distal"), ip: s_(76) }} />
        </div>
        <div style={abs(1000, 10, { width: 780, display: "flex", flexDirection: "column", gap: 16 })}>
          <Formula t={t} t0={wf(73, "metacarpophalangeal")} a="metacarpals" b="phalanges" r="MCP · your knuckles" />
          <Formula t={t} t0={s_(74)} a="phalanx" b="phalanx" r="INTERPHALANGEAL" />
          <div style={{ display: "flex", gap: 14 }}>
            <Chip t={t} t0={wf(75, "proximal")} bg={C.forest} size={38}>PIP</Chip>
            <Chip t={t} t0={wf(75, "distal")} bg={C.forest} size={38}>DIP</Chip>
            <Chip t={t} t0={s_(76)} bg={C.red} size={38}>thumb: 1 IP</Chip>
          </div>
        </div>
      </Seg>
      <Seg t={t} a={s_(77)} b={b + 0.1}>
        <div style={abs(60, 60)}>
          <FingerBend t={t} t0={wf(77, "bend") - 0.3} w={860} />
        </div>
        <div style={abs(1040, 60, { width: 740 })}>
          <div style={pop(t, s_(77))}><Big size={86}>Hinge joints</Big></div>
          <div style={{ marginTop: 30, display: "flex", gap: 16 }}>
            <Chip t={t} t0={wf(77, "bend")} bg={C.matcha} size={44}>bend</Chip>
            <Chip t={t} t0={wf(77, "straighten")} bg={C.forest} size={44}>straighten</Chip>
          </div>
          <div style={{ marginTop: 26 }}><Chip t={t} t0={wf(77, "only")} bg={C.card} color={C.forest} size={36}>that’s all they do</Chip></div>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 7. MEMORY TRICKS ================= */
const TrickCard: React.FC<{ t: number; t0: number; n: number; title: string; children: React.ReactNode }> = ({ t, t0, n, title, children }) => (
  <div style={abs(0, 0, { width: 1800, height: 740, borderRadius: 44, background: C.forest, ...pop(t, t0, 0.35) })}>
    <div style={abs(60, 40, { fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: C.matchaLight })}>TRICK {n}</div>
    <div style={abs(60, 80, { fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.paper })}>{title}</div>
    {children}
  </div>
);
const BNAMES = ["Scaphoid", "Lunate", "Triquetrum", "Pisiform", "Trapezium", "Trapezoid", "Capitate", "Hamate"];
export const STricks: React.FC = () => {
  const t = useT();
  const a = ST(7), b = BE(7);
  const words = ["Sally", "Left", "The", "Party", "To", "Take", "Cathy", "Home"];
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(84)}>
        <TrickCard t={t} t0={a} n={1} title="All 8 carpal bones, in order">
          {[0, 1].map((row) => {
            const rt = row === 0 ? wf(83, "first") : wf(83, "last");
            return (
              <div key={row} style={abs(row === 0 ? 40 : 920, 180, { width: 840 })}>
                <div style={{ ...pop(t, rt), display: "inline-block", marginLeft: 20, background: row === 0 ? C.red : C.matcha, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 30, padding: "6px 20px 9px", borderRadius: 16, letterSpacing: 3 }}>{row === 0 ? "PROXIMAL ROW" : "DISTAL ROW"} · thumb side first</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 26 }}>
                  {words.slice(row * 4, row * 4 + 4).map((w, j) => {
                    const i = row * 4 + j;
                    return (
                      <div key={i} style={{ width: 205, textAlign: "center", fontFamily: FONT, fontWeight: 800 }}>
                        <div style={{ ...pop(t, SEG[80].w[i]), fontSize: 54, color: C.paper, lineHeight: 1 }}>
                          <span style={{ color: C.banana, fontSize: 108 }}>{w[0]}</span>
                          {w.slice(1)}
                        </div>
                        <div style={{ ...pop(t, SEG[82].w[i]), marginTop: 30, display: "inline-block", fontSize: BNAMES[i].length > 9 ? 27 : 31, color: C.forest, background: C.banana, borderRadius: 16, padding: "8px 14px 11px" }}>
                          {BNAMES[i]}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <div style={abs(0, 600, { width: 1800, textAlign: "center", ...pop(t, s_(81)) })}>
            <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.matchaLight }}>first letter of each word = first letter of a bone</span>
          </div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={s_(84)} b={s_(87)}>
        <div style={abs(40, 20)}>
          <Wrist t={t} w={800} lit={{ Tm: wf(85, "trapezium"), Td: wf(86, "trapezoid") }} thumbGlow={wf(85, "thumb")} />
          <BoneTag t={t} t0={wf(85, "trapezium")} id="Tm" w={800} side="up" />
          <BoneTag t={t} t0={wf(86, "trapezoid")} id="Td" w={800} side="down" ox={10} />
        </div>
        <div style={abs(940, 20, { width: 840, height: 700, borderRadius: 44, background: C.forest, ...pop(t, s_(84)) })}>
          <div style={abs(50, 36, { fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: C.matchaLight })}>TRICK 2 · THE CLASSIC MIX-UP</div>
          <div style={abs(50, 120, { ...pop(t, wf(85, "trapezium")), fontFamily: FONT, fontWeight: 800, color: C.paper, transformOrigin: "0% 50%" })}>
            <div style={{ fontSize: 96, lineHeight: 1 }}>trapezi<span style={{ color: C.banana, borderBottom: `8px solid ${C.banana}` }}>UM</span></div>
            <div style={{ fontSize: 44, color: C.matchaLight, marginTop: 16 }}>like th<span style={{ color: C.banana }}>UM</span>b → sits by the thumb</div>
          </div>
          <div style={abs(50, 400, { ...pop(t, wf(86, "trapezoid")), fontFamily: FONT, fontWeight: 800, color: C.paper, transformOrigin: "0% 50%" })}>
            <div style={{ fontSize: 96, lineHeight: 1 }}>trapez<span style={{ color: GC.phal, borderBottom: `8px solid ${GC.phal}` }}>OID</span></div>
            <div style={{ fontSize: 44, color: C.matchaLight, marginTop: 16 }}><span style={{ color: GC.phal }}>I</span>nside, next to it</div>
          </div>
        </div>
      </Seg>
      <Seg t={t} a={s_(87)} b={s_(89)}>
        <TrickCard t={t} t0={s_(87)} n={3} title="The count">
          <div style={abs(80, 210, { width: 1640, display: "flex", justifyContent: "space-between", alignItems: "flex-end" })}>
            {[["8", "carpals", GC.carpal, SEG[87].w[6], SEG[88].w[0]], ["5", "metacarpals", GC.meta, SEG[87].w[7], SEG[88].w[2]], ["14", "phalanges", GC.phal, SEG[87].w[8], SEG[88].w[4]]].map(([n, l, col, t1, t2]) => (
              <div key={n as string} style={{ textAlign: "center", fontFamily: FONT, fontWeight: 800 }}>
                <div style={{ ...pop(t, t1 as number), fontSize: 260, lineHeight: 1, color: col as string }}>{n}</div>
                <div style={{ ...pop(t, t2 as number), fontSize: 44, color: C.paper }}>{l}</div>
              </div>
            ))}
            <div style={{ ...pop(t, wf(88, "twenty")), textAlign: "center", fontFamily: FONT, fontWeight: 800, background: C.banana, borderRadius: 40, padding: "20px 40px" }}>
              <div style={{ fontSize: 200, lineHeight: 1, color: C.forest }}>27</div>
              <div style={{ fontSize: 40, color: C.forest }}>bones</div>
            </div>
          </div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={s_(89)} b={b + 0.1}>
        <div style={abs(60, 90)}>
          <StudyCard t={t} flip={wf(89, "flip") - 0.1} w={860}
            front={
              <div style={{ position: "relative", width: 800, height: 500 }}>
                <div style={{ position: "absolute", left: 30, top: 20, fontSize: 40, color: C.matcha }}>Which bone?</div>
                <div style={{ position: "absolute", left: 200, top: 70 }}>
                  <Wrist t={t} w={480} lit={{ Tm: s_(89) }} showLetters={false} />
                </div>
              </div>
            }
            back={"Trapezium\nbase of the thumb · saddle joint with MC 1"} />
        </div>
        <div style={abs(1020, 80, { width: 760 })}>
          <div style={pop(t, s_(89))}><Big size={70}>Make it stick</Big></div>
          <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 18 }}>
            <div><Chip t={t} t0={wf(89, "look")} bg={C.card} color={C.forest} size={40}>1 · look at the bone</Chip></div>
            <div><Chip t={t} t0={wf(89, "say")} bg={C.matcha} size={40}>2 · say its name</Chip></div>
            <div><Chip t={t} t0={wf(89, "flip")} bg={C.forest} size={40}>3 · flip the card</Chip></div>
          </div>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 8. QUIZ ================= */
type Q = { n: number; si: number; q: string; a: string; visual: (t: number, r: number, ans: number) => React.ReactNode };
const QS: Q[] = [
  {
    n: 1, si: 91, q: "Which carpal bone is the most commonly fractured?", a: "Scaphoid",
    visual: (t, r, ans) => (
      <div style={abs(80, 40)}>
        <Wrist t={t} w={820} lit={r ? { S: ans } : {}} rowHi={r ? { p: ans + 0.8, d: ans + 0.8 } : {}} />
        {r ? <BoneTag t={t} t0={ans} id="S" w={820} side="down" /> : null}
      </div>
    ),
  },
  {
    n: 2, si: 93, q: "Which carpal bone sits at the base of the thumb?", a: "Trapezium",
    visual: (t, r, ans) => <div style={abs(200, -5)}><HandSkel t={t} w={590} lit={r ? { Tm: ans, mc1: ans + 0.2 } : {}} dim={0.5} /></div>,
  },
  {
    n: 3, si: 95, q: "How many phalanges does the thumb have?", a: "2",
    visual: (t, r, ans) => <div style={abs(200, -5)}><HandSkel t={t} w={590} lit={r ? { p1p: ans, p1d: ans + 0.4 } : {}} dim={0.6} /></div>,
  },
  {
    n: 4, si: 97, q: "Which carpal bone has a hook?", a: "Hamate",
    visual: (t, r, ans) => (
      <div style={abs(80, 40)}>
        <Wrist t={t} w={820} lit={r ? { H: ans } : {}} hookGlow={r ? ans + 0.5 : undefined} />
        {r ? <BoneTag t={t} t0={ans} id="H" w={820} side="up" /> : null}
      </div>
    ),
  },
  {
    n: 5, si: 99, q: "How many bones are there in one hand?", a: "27 (8 + 5 + 14)",
    visual: (t, r, ans) => <div style={abs(200, -5)}><HandSkel t={t} w={590} groups={r ? { carpal: wf(100, "eight"), meta: wf(100, "five"), phal: wf(100, "fourteen") } : {}} /></div>,
  },
];
export const SQuiz: React.FC = () => {
  const t = useT();
  const a = ST(8), b = BE(8);
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(91) - 0.2}>
        <div style={abs(0, 0, { width: 1800, height: 740, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" })}>
          <div style={pop(t, a)}><Big size={150}>QUIZ</Big></div>
          <div style={{ marginTop: 20 }}><Chip t={t} t0={wf(90, "pause")} bg={C.banana} color={C.forest} size={44}>5 questions · pause if you need more time</Chip></div>
        </div>
      </Seg>
      {QS.map((q, i) => {
        const ask = s_(q.si), pause = e_(q.si), ans = s_(q.si + 1);
        const end = i < QS.length - 1 ? s_(QS[i + 1].si) - 0.2 : s_(101) - 0.2;
        const reveal = t >= ans ? 1 : 0;
        const cdT = t - (pause + 0.2);
        const n = cdT < 0 ? null : cdT < 1.0 ? 3 : cdT < 2.0 ? 2 : cdT < 3.0 ? 1 : null;
        const cdK = n ? ramp(t, pause + 0.2 + (3 - n), pause + 0.2 + (3 - n) + 0.18) : 0;
        return (
          <Seg key={q.n} t={t} a={ask - 0.2} b={end}>
            {q.visual(t, reveal, ans)}
            <div style={abs(1040, 0, { width: 760, height: 740, borderRadius: 44, background: C.forest, ...pop(t, ask - 0.15, 0.35) })}>
              <div style={abs(50, 46, { fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: C.banana })}>QUESTION {q.n} / 5</div>
              <div style={abs(50, 110, { width: 660, fontFamily: FONT, fontWeight: 800, fontSize: 58, lineHeight: 1.12, color: C.paper })}>{q.q}</div>
              {n && <div style={abs(0, 470, { width: 760, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 190, lineHeight: 1, color: C.banana, transform: `scale(${1.35 - 0.35 * cdK})` })}>{n}</div>}
              {reveal > 0 && (
                <div style={abs(50, 520, { ...pop(t, ans), width: 660, background: C.banana, borderRadius: 26, padding: "20px 30px 26px", boxSizing: "border-box", fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.forest, textAlign: "center" })}>✓ {q.a}</div>
              )}
            </div>
          </Seg>
        );
      })}
      <Seg t={t} a={s_(101) - 0.2} b={b + 0.1}>
        <div style={abs(0, 0, { width: 1800, height: 740, borderRadius: 44, background: C.card, border: `4px solid ${C.line}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" })}>
          <Big size={110}>Your score: <span style={{ color: C.matcha }}>? / 5</span></Big>
          <div style={{ marginTop: 30 }}><Chip t={t} t0={wf(101, "tell")} bg={C.forest} size={46}>tell me in the comments</Chip></div>
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
    ["27 bones", "in 3 groups", Math.max(a, s_(103)), C.matchaLight],
    ["8 carpals", "S L T P · T T C H — two rows of four", s_(104), GC.carpal],
    ["5 metacarpals", "numbered from the thumb · base, shaft, head", s_(105), GC.meta],
    ["14 phalanges", "3 per finger · 2 for the thumb", s_(106), GC.phal],
    ["Joints", "radiocarpal · midcarpal · CMC · MCP · PIP / DIP", s_(107), C.matchaLight],
    ["Mnemonic", "Sally Left The Party To Take Cathy Home", s_(108), C.banana],
  ];
  const ot = s_(109) - 0.2;
  const outro = ramp(t, ot, ot + 0.5);
  return (
    <Stage a={a} b={END - 0.3}>
      {outro < 1 && (
        <div style={abs(0, 0, { width: 1800, height: 740, borderRadius: 44, background: C.forest })}>
          <div style={abs(70, 40, { fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 8, color: C.banana })}>RECAP</div>
          <div style={abs(70, 110, { display: "flex", flexDirection: "column", gap: 22 })}>
            {items.map(([h, s, tt, col]) => (
              <div key={h} style={{ ...pop(t, tt), display: "flex", alignItems: "center", gap: 24, fontFamily: FONT, fontWeight: 800, transformOrigin: "0% 50%" }}>
                <div style={{ width: 60, height: 60, borderRadius: 30, background: col, border: `4px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: C.forest }}>✓</div>
                <div style={{ width: 380, fontSize: 48, color: C.paper }}>{h}</div>
                <div style={{ fontSize: 38, color: C.matchaLight }}>{s}</div>
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
              <div style={{ background: C.red, color: C.paper, borderRadius: 50, padding: "18px 54px 22px", fontSize: 54, letterSpacing: 3, transform: `scale(${1 + 0.05 * Math.max(0, Math.sin((t - ot) * 5))})`, opacity: ramp(t, wf(109, "subscribe"), wf(109, "subscribe") + 0.3) }}>SUBSCRIBE</div>
            </div>
            <div style={{ marginTop: 40, background: C.paper, color: C.forest, borderRadius: 24, padding: "16px 30px 20px", fontSize: 40, opacity: ramp(t, s_(110), s_(110) + 0.4), width: "fit-content" }}>Which topic should we cover next?</div>
          </div>
        </div>
      )}
    </Stage>
  );
};
