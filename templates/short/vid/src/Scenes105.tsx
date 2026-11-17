import React from "react";
import { C, FONT, Pill, Scene, ramp, useT } from "./kit";
import { Big, pop } from "./Scenes67";
import { Loud, PlateQ, QS } from "./Scenes93";
import { Chip } from "./Portal99";
import { Ring } from "./Scenes104";
import { GANCH, GCOL, GK, Glute, NCOL } from "./Glute105";

export const P434 = "plates/glute434.png";
export const A434 = 1012 / 1349;
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* Gray's Fig. 434 (right gluteal region from behind; maximus + medius cut and turned back). Target = gluteus minimus.
   "?" sticker over its printed name "GLUTÆUS MINIMUS" (flips off at the reveal). */
export const MINPIN = { x: 0.675, y: 0.435 };
export const minStick = (off: number): QS[] => [{ x0: 0.585, y0: 0.288, x1: 0.925, y1: 0.344, rot: -17, off }];

export type Tm = { reveal: number; ticks: number[]; hookEnd: number; deep: number };
export const TM_MAIN: Tm = { reveal: 3.83, ticks: [2.1, 2.7, 3.3], hookEnd: 5.8, deep: 4.71 };
export const TM_TT: Tm = { reveal: 3.83, ticks: [2.1, 2.7, 3.3], hookEnd: 5.8, deep: 4.71 };

const Note: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 16px 10px", fontFamily: FONT, fontWeight: 800, fontSize: 27, color: C.forest, whiteSpace: "nowrap", boxShadow: "0 6px 0 rgba(31,42,20,0.12)", ...style }}>{children}</div>
);

/* 1. Quiz hook: Fig. 434 visible from frame 1, red pin on the gluteus minimus, "?" over its printed name, 3-2-1, reveal */
export const G1: React.FC<{ tm: Tm; more?: boolean }> = ({ tm, more = true }) => {
  const t = useT();
  const R = tm.reveal;
  const rv = ramp(t, R, R + 0.25);
  return (
    <Scene start={-0.6} end={tm.hookEnd} push={0.02}>
      <div style={center(0, { opacity: 1 - rv })}>
        <Loud size={112}>NAME THIS</Loud>
      </div>
      <div style={center(118, { opacity: 1 - rv })}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ background: "#E5251A", border: "7px solid #111", borderRadius: 18, padding: "0 22px 6px", transform: "rotate(-2deg)" }}><Loud size={84}>GLUTE MUSCLE</Loud></div>
          <Loud size={60}>3 SEC</Loud>
        </div>
      </div>
      {rv > 0 && (
        <div style={center(10, pop(t, R, 0.3))}>
          <div style={{ textAlign: "center" }}>
            <Big size={84} color={C.forest}>✓ GLUTEUS MINIMUS</Big>
            <div style={{ height: 18 }} />
            <div style={{ display: "flex", justifyContent: "center", ...pop(t, tm.deep, 0.3) }}>
              <Pill size={40} bg={GCOL.MIN} color={C.paper}>the deepest glute</Pill>
            </div>
          </div>
        </div>
      )}
      <PlateQ src={P434} aspect={A434} x={30} y={262} w={800} h={630} a={-0.6} b={tm.hookEnd} from={[0.62, 0.4, 0.78]} to={[0.6, 0.37, 0.9]}
        pin={{ ...MINPIN, t0: -1, t1: R + 0.2, r: 82 }} stickers={minStick(R)}
        labels={[
          { x: MINPIN.x, y: MINPIN.y, text: "gluteus minimus", t: R + 0.02, hot: true, ox: -40, oy: 190 },
          { x: 0.3, y: 0.42, text: "maximus (cut)", t: tm.deep + 0.3, ox: -20, oy: -150 },
          { x: 0.66, y: 0.14, text: "medius (cut)", t: tm.deep + 0.45, ox: -60, oy: 70 },
        ]} ls={38} />
      <div style={{ position: "absolute", left: 30, top: 700 }}>
        <Ring t={t} size={170} reveal={R} ticks={tm.ticks} />
      </div>
      <div style={{ position: "absolute", left: 470, top: 290, ...pop(t, R + 0.7, 0.3) }}>
        <Note><span style={{ color: C.matcha }}>1918 atlas:</span> “Glutæus minimus”</Note>
      </div>
      <div style={center(898, pop(t, 0.05, 0.25))}>
        {t < R ? <Pill size={34} bg={C.forest}>{more ? "anatomy quiz · + 3 more after it" : "anatomy quiz · hip"}</Pill> : (
          <div style={{ ...pop(t, R + 0.4, 0.25) }}><Pill size={36} bg={C.banana} color={C.forest}>gluteal muscles · mnemonic</Pill></div>
        )}
      </div>
    </Scene>
  );
};

/* ---- our diagram in a box with a camera and chips ---- */
type Kf = [number, number, number, number];
const cam = (t: number, ks: Kf[]) => {
  if (t <= ks[0][0]) return ks[0];
  for (let i = 0; i < ks.length - 1; i++) {
    const a = ks[i], b = ks[i + 1];
    if (t <= b[0]) {
      const k = ramp(t, a[0], b[0]);
      const e = k * k * (3 - 2 * k);
      return [t, a[1] + (b[1] - a[1]) * e, a[2] + (b[2] - a[2]) * e, a[3] + (b[3] - a[3]) * e] as Kf;
    }
  }
  return ks[ks.length - 1];
};
export type Tag = { a: string; t: number; dx: number; dy: number; col: string; text: string; size?: number; t1?: number };
export const GBox: React.FC<{ t: number; ks: Kf[]; top: number; h: number; id: string; tags?: Tag[]; note?: string } & Omit<React.ComponentProps<typeof Glute>, "w" | "id" | "t">> = ({ t, ks, top, h, id, tags = [], note = "right hip from behind · Book Plume diagram", ...rest }) => {
  const [, s, cx, cy] = cam(t, ks);
  const X0 = 430 - cx * s, Y0 = h / 2 - cy * s;
  return (
    <div style={{ position: "absolute", left: 0, top, width: 860, height: h, overflow: "hidden", borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}` }}>
      <div style={{ position: "absolute", left: X0, top: Y0 }}>
        <Glute t={t} w={700 * s} id={id} {...rest} />
      </div>
      {tags.map(({ a, t: t0, dx, dy, size, t1, col, text }) => {
        const p = ramp(t, t0 - 0.05, t0 + 0.2) * (t1 === undefined ? 1 : 1 - ramp(t, t1, t1 + 0.2));
        if (p <= 0) return null;
        const [ax, ay] = GANCH[a];
        const x = X0 + ax * s, y = Y0 + ay * s;
        return (
          <React.Fragment key={a + text}>
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: p }} width={1} height={1}>
              <line x1={x} y1={y} x2={x + dx} y2={y + dy} stroke={C.paper} strokeWidth={9} strokeLinecap="round" />
              <line x1={x} y1={y} x2={x + dx} y2={y + dy} stroke={C.forest} strokeWidth={4.5} strokeLinecap="round" />
              <circle cx={x} cy={y} r={9} fill={col} stroke={C.forest} strokeWidth={3.5} />
            </svg>
            <Chip x={x + dx} y={y + dy} p={p} col={col} size={size}>{text}</Chip>
          </React.Fragment>
        );
      })}
      {note && <div style={{ position: "absolute", left: 18, top: 16, fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.forest, background: "rgba(255,254,246,0.9)", borderRadius: 12, padding: "4px 12px" }}>{note}</div>}
    </div>
  );
};
const tg = (k: GK, a: string, t: number, dx: number, dy: number, text: string, size = 36, t1?: number): Tag => ({ a, t, dx, dy, col: GCOL[k], text, size, t1 });

/* the 3-layer stack card: big → middle → small */
const Stack: React.FC<{ t: number; on: [number, number, number]; cur: number }> = ({ t, on, cur }) => {
  const L: [GK, string, string, number][] = [["MAX", "MAXIMUS", "top · big", 330], ["MED", "MEDIUS", "middle", 270], ["MIN", "MINIMUS", "deep · small", 210]];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      {L.map(([k, nm, sub, wd], i) => {
        const p = ramp(t, on[i] - 0.05, on[i] + 0.2);
        const hot = cur === i;
        return (
          <div key={k} style={{ width: wd * 1.6, height: 50, borderRadius: 16, background: p > 0.5 ? GCOL[k] : "rgba(247,246,236,0.15)", border: `4px solid ${hot ? C.banana : C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontFamily: FONT, fontWeight: 800, color: C.paper, opacity: 0.35 + 0.65 * p, transform: `scale(${1 + (hot ? 0.06 : 0) + 0.08 * Math.sin(Math.PI * p)})`, whiteSpace: "nowrap" }}>
            <span style={{ fontSize: 32 }}>{nm}</span><span style={{ fontSize: 22, opacity: 0.85 }}>{sub}</span>
          </div>
        );
      })}
    </div>
  );
};

/* 2. 3 layers: maximus (top, biggest) → medius (middle) → minimus (underneath); outer layers peel away */
export const G2: React.FC<{ s0: number; s1: number; three: number; max: number; big: number; med: number; min: number; bms?: [number, number, number] }> = ({ s0, s1, three, max, big, med, min, bms }) => {
  const t = useT();
  const cur = t >= min - 0.05 ? 2 : t >= med - 0.05 ? 1 : t >= max - 0.05 ? 0 : -1;
  const hot: GK[] = cur === 2 ? ["MIN"] : cur === 1 ? ["MED"] : cur === 0 ? ["MAX"] : [];
  const maxA = 1 - 0.82 * ramp(t, med - 0.1, med + 0.4);
  const medA = 1 - 0.82 * ramp(t, min - 0.1, min + 0.4);
  const allBack = bms ? ramp(t, bms[0] - 0.1, bms[0] + 0.3) : 0;
  return (
    <Scene start={s0} end={s1} push={0.005}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 860, height: 220, borderRadius: 40, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, s0 + 0.03, 0.3) }}>
        <div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 800, color: C.banana, lineHeight: 1 }}>
          <div style={{ fontSize: 96, ...pop(t, three, 0.25) }}>3</div>
          <div style={{ fontSize: 30, letterSpacing: 3, color: C.paper }}>LAYERS</div>
        </div>
        <Stack t={t} on={[max, med, min]} cur={bms ? -1 : cur} />
      </div>
      <GBox t={t} top={240} h={640} id="g2"
        ks={[[s0, 0.78, 380, 430], [max + 0.3, 0.8, 380, 450], [med + 0.3, 0.86, 410, 300], [min + 0.3, 0.92, 450, 340], [s1, 0.84, 400, 400]]}
        lit={{ MAX: max, MED: med, MIN: min }} hot={bms && t >= bms[0] - 0.05 ? [] : hot} dimRest={0.3}
        maxA={Math.max(maxA, 0.18 + 0.82 * allBack)} medA={Math.max(medA, 0.18 + 0.82 * allBack)}
        tags={[
          tg("MAX", "MAX", big, 110, -40, "biggest glute", 36, med - 0.1),
          tg("MED", "MED", med + 0.15, 140, -40, "medius · middle", 34, min - 0.1),
          tg("MIN", "MIN", min + 0.15, -40, 150, "minimus · deepest", 34, bms ? bms[0] - 0.1 : undefined),
        ]} />
      <div style={center(892, {})}>
        {bms ? (
          <div style={{ display: "flex", gap: 14, ...pop(t, bms[0], 0.25) }}>
            {(["MAX", "MED", "MIN"] as GK[]).map((k, i) => (
              <div key={k} style={pop(t, bms[i], 0.25)}><Pill size={40} bg={GCOL[k]} color={C.paper}>{["BIG", "MIDDLE", "SMALL"][i]}</Pill></div>
            ))}
          </div>
        ) : (
          <div style={pop(t, min + 0.5, 0.25)}><Pill size={36} bg={C.banana} color={C.forest}>maximus · medius · minimus = big · middle · small</Pill></div>
        )}
      </div>
    </Scene>
  );
};

/* 3. + tensor fasciae latae up front → the complete map, all labelled */
export const G3: React.FC<{ s0: number; s1: number; tfl: number; front: number }> = ({ s0, s1, tfl, front }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, pop(t, s0 + 0.03, 0.25))}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, background: GCOL.TFL, border: `4px solid ${C.forest}`, borderRadius: 26, padding: "6px 26px 12px", fontFamily: FONT, fontWeight: 800, color: C.paper, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 46 }}>+ TENSOR FASCIAE LATAE</span>
        </div>
      </div>
      <GBox t={t} top={124} h={756} id="g3" note=""
        ks={[[s0, 0.84, 400, 400], [tfl + 0.3, 0.95, 470, 420], [front + 0.2, 0.9, 440, 430], [s1, 0.86, 400, 440]]}
        lit={{ MAX: s0 - 1, MED: s0 - 1, MIN: s0 - 1, TFL: tfl }} hot={t < front + 0.6 ? ["TFL"] : []} dimRest={0.3} maxA={0.55} medA={0.75}
        tags={[
          tg("TFL", "TFL", tfl + 0.1, -170, -40, "TFL", 40), { a: "ITB", t: front, dx: -180, dy: -10, col: "#8C7A4A", text: "IT band", size: 32 },
          tg("MAX", "MAXt", front + 0.3, -150, 150, "maximus", 32), tg("MED", "MED", front + 0.4, -140, -10, "medius", 32), tg("MIN", "MINt", front + 0.5, -40, -120, "minimus", 30),
        ]} />
      <div style={center(892, {})}>
        <div style={pop(t, front, 0.25)}><Pill size={36} bg={GCOL.TFL} color={C.paper}>front edge of the hip · pulls on the IT band</Pill></div>
      </div>
    </Scene>
  );
};

/* 4. Nerve trick: maximus ← inferior gluteal (below piriformis); the other 3 ← superior gluteal (above piriformis). Full map held. */
export const G4: React.FC<{ s0: number; s1: number; maxw: number; inf: number; other: number; sup: number }> = ({ s0, s1, maxw, inf, other, sup }) => {
  const t = useT();
  const stage = t >= other - 0.05 ? 2 : t >= maxw - 0.05 ? 1 : 0;
  const hot: GK[] = stage === 2 ? ["MED", "MIN", "TFL"] : stage === 1 ? ["MAX"] : [];
  const maxA = stage === 2 ? 1 - 0.6 * ramp(t, other - 0.1, other + 0.3) : 1;
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 860, height: 112, borderRadius: 30, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center", gap: 20, ...pop(t, s0 + 0.03, 0.25) }}>
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.banana }}>NERVE TRICK</span>
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.paper }}>1 + 3</span>
      </div>
      <GBox t={t} top={130} h={620} id="g4" note=""
        ks={[[s0, 0.8, 390, 440], [inf + 0.3, 0.86, 370, 470], [other + 0.3, 0.8, 410, 400], [s1, 0.78, 400, 420]]}
        lit={{ MAX: s0 - 1, MED: s0 - 1, MIN: s0 - 1, TFL: s0 - 1 }} hot={hot} dimRest={0.45} maxA={maxA} medA={stage === 2 ? 0.8 : 1}
        piri={ramp(t, inf - 0.2, inf + 0.3)} nerves={{ inf: ramp(t, inf - 0.1, inf + 0.8), sup: ramp(t, sup - 0.2, sup + 0.7) }}
        tags={[
          { a: "IGN", t: inf + 0.2, dx: -150, dy: 140, col: NCOL.INF, text: "inferior gluteal n.", size: 32 },
          { a: "PIRI", t: inf + 0.5, dx: -175, dy: 5, col: "#6B5A4A", text: "piriformis", size: 28 },
          { a: "SGN", t: sup + 0.2, dx: -190, dy: -120, col: NCOL.SUP, text: "superior gluteal n.", size: 32 },
          tg("MAX", "MAX", maxw + 0.1, 170, 150, "maximus", 32, other),
          tg("TFL", "TFL", other + 0.15, -10, 190, "TFL", 30), tg("MED", "MEDt", other + 0.05, 60, -70, "medius", 30), tg("MIN", "MINt", other + 0.1, 30, 120, "minimus", 30),
        ]} />
      <div style={{ position: "absolute", left: 0, top: 766, width: 860, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ ...pop(t, inf, 0.25), opacity: t >= inf - 0.05 ? 1 : 0 }}>
          <Pill size={34} bg={NCOL.INF} color={C.paper}>INFERIOR (below piriformis) → maximus</Pill>
        </div>
        <div style={{ ...pop(t, sup, 0.25), opacity: t >= sup - 0.05 ? 1 : 0 }}>
          <Pill size={34} bg={NCOL.SUP} color={C.forest}>SUPERIOR (above) → medius · minimus · TFL</Pill>
        </div>
      </div>
    </Scene>
  );
};

/* 5. Quick test with 3-2-1 */
export const G5: React.FC<{ s0: number; s1: number; q: number; cd: [number, number][] }> = ({ s0, s1, q, cd }) => {
  const t = useT();
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < s1) { n = v; n0 = s; } });
  const OPTS: [string, string][] = [["Gluteus maximus", GCOL.MAX], ["Gluteus medius", GCOL.MED], ["Tensor fasciae latae", GCOL.TFL]];
  return (
    <Scene start={s0} end={s1}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, s0 + 0.05, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 42, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 30, width: 760, top: 100, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 56, lineHeight: 1.12, color: C.paper, ...pop(t, q) }}>
          Which one keeps your <span style={{ color: C.banana }}>hips level</span> on one leg?
        </div>
        <div style={{ position: "absolute", left: 60, top: 300, width: 700, display: "flex", flexDirection: "column", gap: 22 }}>
          {OPTS.map(([nm, col], i) => (
            <div key={nm} style={{ height: 104, borderRadius: 26, background: "rgba(247,246,236,0.08)", border: "3px solid rgba(247,246,236,0.2)", display: "flex", alignItems: "center", gap: 20, padding: "0 22px", boxSizing: "border-box", ...pop(t, q + 0.6 + i * 0.35, 0.25) }}>
              <div style={{ width: 68, height: 68, borderRadius: 34, background: col, border: `4px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.paper }}>{"ABC"[i]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper, whiteSpace: "nowrap" }}>{nm}</div>
              <div style={{ marginLeft: "auto", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.banana }}>?</div>
            </div>
          ))}
        </div>
        {n !== null ? (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 660, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 160, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        ) : (
          <div style={{ position: "absolute", left: 0, width: 820, top: 720, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#B9D27A", opacity: ramp(t, q + 1.8, q + 2.0) }}>pause · say it out loud</div>
        )}
      </div>
    </Scene>
  );
};

/* 6. Answer: gluteus medius on Gray's Fig. 434 (+ minimus helps) */
export const G6: React.FC<{ s0: number; s1: number; ans: number }> = ({ s0, s1, ans }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, pop(t, s0 + 0.05, 0.25))}>
        <div style={{ background: "#E5251A", border: `4px solid ${C.forest}`, borderRadius: 26, padding: "10px 30px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 54, color: C.paper, whiteSpace: "nowrap" }}>✓ B · Gluteus medius</div>
      </div>
      <PlateQ src={P434} aspect={A434} x={30} y={124} w={800} h={700} a={s0} b={s1} from={[0.62, 0.35, 0.95]} to={[0.62, 0.37, 1.02]} ls={34}
        labels={[
          { x: 0.68, y: 0.105, text: "gluteus medius", t: ans, hot: true, ox: -140, oy: 80 },
          { x: 0.9, y: 0.64, text: "medius → trochanter", t: ans + 0.25, hot: true, ox: -90, oy: -60 },
          { x: 0.675, y: 0.435, text: "minimus helps", t: ans + 0.5, ox: -40, oy: -120 },
        ]} />
      <div style={center(840, pop(t, ans + 0.4, 0.25))}>
        <Pill size={34} bg={GCOL.MED} color={C.paper}>stand on one leg → it stops the other hip dropping</Pill>
      </div>
    </Scene>
  );
};

/* 7. end card ≤ 1.5 s: full quiz + save */
export const G7: React.FC<{ s0: number; s1: number }> = ({ s0, s1 }) => {
  const t = useT();
  const ROWS: [GK, string, string][] = [["MAX", "maximus", "top · biggest · inferior gluteal n."], ["MED", "medius", "middle · hips level · superior"], ["MIN", "minimus", "deepest · superior"], ["TFL", "TFL", "front · IT band · superior"]];
  return (
    <Scene start={s0} end={s1}>
      <div style={{ position: "absolute", left: 30, top: 20, width: 800, height: 860, borderRadius: 44, background: C.forest, ...pop(t, s0 + 0.02, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 800, top: 40, textAlign: "center" }}><Loud size={74}>FULL QUIZ</Loud></div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 136, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.banana }}>on our channel · 27 leg muscles</div>
        <div style={{ position: "absolute", left: 40, top: 214, width: 720, display: "flex", flexDirection: "column", gap: 16 }}>
          {ROWS.map(([k, nm, b], i) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 18, background: "rgba(247,246,236,0.08)", borderRadius: 24, padding: 12, ...pop(t, s0 + 0.08 + i * 0.06, 0.22) }}>
              <div style={{ width: 210, height: 76, borderRadius: 20, background: GCOL[k], display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.paper, whiteSpace: "nowrap" }}>{nm}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.paper, lineHeight: 1.2 }}>{b}</div>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 690, display: "flex", justifyContent: "center", ...pop(t, s0 + 0.3, 0.25) }}>
          <div style={{ background: C.banana, color: C.forest, borderRadius: 50, padding: "14px 44px", fontFamily: FONT, fontWeight: 800, fontSize: 42 }}>🔖 SAVE THIS · + FOLLOW</div>
        </div>
      </div>
    </Scene>
  );
};

/* TikTok: medius + minimus keep your hips level when you walk */
export const GLevel: React.FC<{ s0: number; s1: number; mm: number; lvl: number; walk: number }> = ({ s0, s1, mm, lvl, walk }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, pop(t, s0 + 0.03, 0.25))}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: C.forest, borderRadius: 26, padding: "8px 26px 12px", fontFamily: FONT, fontWeight: 800, color: C.paper, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 46, color: "#F4BE72" }}>MEDIUS</span><span style={{ fontSize: 40 }}>+</span><span style={{ fontSize: 46, color: "#9CC0F0" }}>MINIMUS</span>
        </div>
      </div>
      <GBox t={t} top={124} h={756} id="gl" note=""
        ks={[[s0, 0.8, 420, 380], [s1, 0.92, 450, 330]]}
        lit={{ MAX: s0 - 1, MED: s0 - 1, MIN: s0 - 1, TFL: s0 - 1 }} hot={["MED", "MIN"]} dimRest={0.5} maxA={0.25} medA={0.8}
        tags={[tg("MED", "MED", mm + 0.1, 120, -30, "medius", 36), tg("MIN", "MINt", mm + 0.4, 20, 150, "minimus", 34)]} />
      <div style={center(892, {})}>
        {t < walk - 0.05 ? <div style={pop(t, lvl, 0.25)}><Pill size={38} bg={C.banana} color={C.forest}>⚖️ keep your hips level</Pill></div>
          : <div style={pop(t, walk, 0.25)}><Pill size={38} bg={GCOL.MED} color={C.paper}>every step = 1 leg holding you up</Pill></div>}
      </div>
    </Scene>
  );
};
