import React from "react";
import { C, FONT, Pill, Scene, ramp, useT } from "./kit";
import { Big, pop } from "./Scenes67";
import { Loud, PlateQ, QS } from "./Scenes93";
import { Chip } from "./Portal99";
import { Floor, FANCH, FCOL, FK, FNAME } from "./Floor107";

export const P404 = "plates/pelvis404.png";
export const A404 = 1933 / 1695;
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* hook target on Gray's Fig. 404 (left levator ani from within): red pin on the levator ani fibres, "?" over its printed name */
export const HOOKPIN = { x: 0.53, y: 0.78 };
export const hookStick = (off: number): QS[] => [
  { x0: 0.418, y0: 0.624, x1: 0.566, y1: 0.664, rot: 7, off },
  { x0: 0.574, y0: 0.652, x1: 0.634, y1: 0.7, rot: 22, off },
];
export const ALLSTICK: QS[] = [...hookStick(99), { x0: 0.214, y0: 0.482, x1: 0.372, y1: 0.522, rot: -4, off: 99 }];

export type Tm = { reveal: number; ticks: number[]; draws: number; hookEnd: number };
export const TM_MAIN: Tm = { reveal: 3.56, ticks: [1.9, 2.45, 3.0], draws: 4.62, hookEnd: 6.55 };
export const TM_TT: Tm = TM_MAIN;

const Ring: React.FC<{ t: number; size: number; tm: Tm }> = ({ t, size, tm }) => {
  const { reveal: REVEAL, ticks: TICKS } = tm;
  if (t > REVEAL + 0.25) return null;
  const k = ramp(t, TICKS[0] - 0.6, REVEAL);
  let n = 3;
  TICKS.forEach((s, i) => { if (t >= s) n = 3 - i; });
  const cur = TICKS[3 - n] ?? 0;
  const bump = ramp(t, cur, cur + 0.15);
  const out = ramp(t, REVEAL - 0.05, REVEAL + 0.2);
  const r = size / 2 - 12;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ width: size, height: size, position: "relative", opacity: 1 - out, transform: `scale(${(1 + 0.12 * (1 - bump)) * (1 - 0.3 * out)})` }}>
      <svg width={size} height={size} style={{ position: "absolute" }}>
        <circle cx={size / 2} cy={size / 2} r={r + 6} fill={C.forest} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(247,246,236,0.18)" strokeWidth={14} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.banana} strokeWidth={14} strokeLinecap="round" strokeDasharray={`${circ * (1 - k)} ${circ}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.5, color: C.paper, lineHeight: 1 }}>{n}</div>
    </div>
  );
};

/* 1. Quiz hook: Gray's Fig. 404, red pin on the levator ani from frame 1, "?" over its printed name, 3-2-1, reveal */
export const V1: React.FC<{ tm: Tm }> = ({ tm }) => {
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
          <div style={{ background: "#E5251A", border: "7px solid #111", borderRadius: 18, padding: "0 22px 6px", transform: "rotate(-2deg)" }}><Loud size={84}>MUSCLE</Loud></div>
          <Loud size={60}>IN 3 SEC</Loud>
        </div>
      </div>
      {rv > 0 && (
        <div style={center(10, pop(t, R, 0.3))}>
          <div style={{ textAlign: "center" }}>
            <Big size={92} color={C.forest}>✓ LEVATOR ANI</Big>
            <div style={{ height: 14 }} />
            <div style={{ display: "flex", justifyContent: "center", ...pop(t, tm.draws, 0.3) }}>
              <Pill size={40} bg={C.red} color={C.paper}>the main pelvic floor muscle</Pill>
            </div>
          </div>
        </div>
      )}
      <PlateQ src={P404} aspect={A404} x={30} y={262} w={800} h={640} a={-0.6} b={tm.hookEnd} from={[0.5, 0.6, 0.84]} to={[0.5, 0.64, 0.74]}
        pin={{ ...HOOKPIN, t0: -1, t1: R + 0.2, r: 70 }} stickers={hookStick(R)}
        labels={[
          { x: 0.53, y: 0.78, text: "levator ani", t: R + 0.02, hot: true, ox: 120, oy: 110 },
          { x: 0.19, y: 0.66, text: "coccyx", t: tm.draws + 0.15, ox: 70, oy: 150 },
          { x: 0.8, y: 0.75, text: "pubis", t: tm.draws + 0.3, ox: -40, oy: -150 },
        ]} ls={42} />
      <div style={{ position: "absolute", left: 40, top: 700 }}>
        <Ring t={t} size={170} tm={tm} />
      </div>
      <div style={center(898, pop(t, 0.05, 0.25))}>
        {t < R ? <Pill size={34} bg={C.forest}>anatomy quiz · + 3 more after it</Pill> : (
          <div style={{ ...pop(t, R + 0.4, 0.25) }}><Pill size={36} bg={C.banana} color={C.forest}>pelvic floor · mnemonic</Pill></div>
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
export const FBox: React.FC<{ t: number; ks: Kf[]; top: number; h: number; id: string; tags?: Tag[]; note?: string; x?: number; bw?: number } & Omit<React.ComponentProps<typeof Floor>, "w" | "id" | "t">> = ({ t, ks, top, h, id, tags = [], note = "pelvic floor from above · Book Plume diagram", x = 0, bw = 860, ...rest }) => {
  const [, s, cx, cy] = cam(t, ks);
  const X0 = bw / 2 - cx * s, Y0 = h / 2 - cy * s;
  return (
    <div style={{ position: "absolute", left: x, top, width: bw, height: h, overflow: "hidden", borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}` }}>
      <div style={{ position: "absolute", left: X0, top: Y0 }}>
        <Floor t={t} w={800 * s} id={id} {...rest} />
      </div>
      {tags.map(({ a, t: t0, dx, dy, size, t1, col, text }) => {
        const p = ramp(t, t0 - 0.05, t0 + 0.2) * (t1 === undefined ? 1 : 1 - ramp(t, t1, t1 + 0.2));
        if (p <= 0) return null;
        const [ax, ay] = FANCH[a];
        const px = X0 + ax * s, py = Y0 + ay * s;
        return (
          <React.Fragment key={a + text}>
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: p }} width={1} height={1}>
              <line x1={px} y1={py} x2={px + dx} y2={py + dy} stroke={C.paper} strokeWidth={9} strokeLinecap="round" />
              <line x1={px} y1={py} x2={px + dx} y2={py + dy} stroke={C.forest} strokeWidth={4.5} strokeLinecap="round" />
              <circle cx={px} cy={py} r={9} fill={col} stroke={C.forest} strokeWidth={3.5} />
            </svg>
            <Chip x={px + dx} y={py + dy} p={p} col={col} size={size}>{text}</Chip>
          </React.Fragment>
        );
      })}
      {note && <div style={{ position: "absolute", left: 18, top: 16, fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.forest, background: "rgba(255,254,246,0.9)", borderRadius: 12, padding: "4px 12px" }}>{note}</div>}
    </div>
  );
};
const tg = (k: FK | "BONE" | "DARK", a: string, t: number, dx: number, dy: number, size = 34, t1?: number, text?: string): Tag => ({
  a, t, dx, dy, col: k === "BONE" ? "#8A7B5C" : k === "DARK" ? C.forest : FCOL[k], text: text ?? FNAME[k as FK], size, t1,
});

/* name banner: FROM part in banana, TO part in the muscle colour */
const Banner: React.FC<{ k: FK; from: string; to: string; t: number; tTo: number }> = ({ k, from, to, t, tTo }) => (
  <div style={{ display: "flex", alignItems: "center", background: FCOL[k], border: `4px solid ${C.forest}`, borderRadius: 26, padding: "6px 26px 12px", fontFamily: FONT, fontWeight: 800, color: C.paper, whiteSpace: "nowrap", fontSize: 58 }}>
    <span style={{ background: C.banana, color: C.forest, borderRadius: 12, padding: "0 10px 2px" }}>{from}</span>
    <span style={{ margin: "0 6px" }}>·</span>
    <span style={{ transform: `scale(${1 + 0.08 * (ramp(t, tTo, tTo + 0.12) - ramp(t, tTo + 0.12, tTo + 0.3))})`, display: "inline-block" }}>{to}</span>
  </div>
);

/* 2. Mnemonic card: levator ani = 3 in 1, the names are the map (FROM → TO) */
export const V2: React.FC<{ s0: number; s1: number; title: number; r1: number; r2: number; r3: number; map: number; plus: number }> = ({ s0, s1, title, r1, r2, r3, map, plus }) => {
  const t = useT();
  const ROWS: [FK, string, string, string, number][] = [
    ["PR", "PUBO", "RECTALIS", "pubis → around the rectum", r1],
    ["PC", "PUBO", "COCCYGEUS", "pubis → coccyx", r2],
    ["IC", "ILIO", "COCCYGEUS", "side wall → coccyx", r3],
  ];
  return (
    <Scene start={s0} end={s1} push={0.006}>
      <div style={{ position: "absolute", left: 20, top: 20, width: 820, height: 860, borderRadius: 48, background: C.forest, ...pop(t, s0 + 0.02, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 40, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, letterSpacing: 6, color: "#B9D27A", ...pop(t, title, 0.25) }}>LEVATOR ANI = 3 IN 1</div>
        <div style={{ position: "absolute", left: 40, top: 120, width: 740, display: "flex", flexDirection: "column", gap: 24 }}>
          {ROWS.map(([k, a, b, sub, t0]) => (
            <div key={k} style={{ ...pop(t, t0, 0.3) }}>
              <div style={{ display: "flex", alignItems: "center", gap: 0, fontFamily: FONT, fontWeight: 800, fontSize: 64, lineHeight: 1.05, whiteSpace: "nowrap" }}>
                <span style={{ background: C.banana, color: C.forest, borderRadius: 14, padding: "0 12px 4px" }}>{a}</span>
                <span style={{ background: FCOL[k], color: C.paper, borderRadius: 14, padding: "0 12px 4px", marginLeft: 8, border: `3px solid ${C.paper}` }}>{b}</span>
              </div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.paper, marginTop: 8, opacity: ramp(t, map, map + 0.3) }}>
                <span style={{ color: C.banana }}>FROM</span> {sub.split(" → ")[0]} <span style={{ color: C.banana }}>→ TO</span> {sub.split(" → ")[1]}
              </div>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 690, display: "flex", justifyContent: "center", gap: 18, ...pop(t, plus, 0.25) }}>
          <div style={{ background: FCOL.CO, color: C.paper, border: `4px solid ${C.paper}`, borderRadius: 40, padding: "12px 30px 16px", fontFamily: FONT, fontWeight: 800, fontSize: 42 }}>+ COCCYGEUS</div>
          <div style={{ background: C.banana, color: C.forest, borderRadius: 40, padding: "12px 30px 16px", fontFamily: FONT, fontWeight: 800, fontSize: 42 }}>names = map</div>
        </div>
      </div>
    </Scene>
  );
};

/* 3. Puborectalis: from the pubis, a sling around the rectum */
export const V3: React.FC<{ s0: number; s1: number; pub: number; sling: number; rect: number }> = ({ s0, s1, pub, sling, rect }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, pop(t, s0 + 0.03, 0.25))}><Banner k="PR" from="PUBO" to="RECTALIS" t={t} tTo={rect} /></div>
      <FBox t={t} top={124} h={756} id="v3" ks={[[s0, 0.95, 400, 420], [sling, 1.08, 400, 450], [s1, 1.18, 400, 500]]}
        lit={{ PR: s0 + 0.05, PC: s0 - 1, IC: s0 - 1, CO: s0 - 1 }} hot={["PR"]} dimRest={0.6}
        tags={[
          tg("BONE", "PUB", pub, 160, 40, 32, undefined, "pubis"),
          tg("PR", "PRB", sling + 0.05, 150, 90, 36, undefined, "U-shaped sling"),
          tg("DARK", "REC", rect + 0.05, -190, -40, 32, undefined, "rectum"),
        ]} />
      <div style={center(892, {})}>
        {t < sling ? <div style={pop(t, s0 + 0.4, 0.25)}><Pill size={36} bg={FCOL.PR} color={C.paper}>innermost part · starts at the pubis</Pill></div>
          : <div style={pop(t, sling, 0.25)}><Pill size={38} bg={C.banana} color={C.forest}>loops BEHIND the rectum</Pill></div>}
      </div>
    </Scene>
  );
};

/* 4. Pubococcygeus: pubis → coccyx */
export const V4: React.FC<{ s0: number; s1: number; pub: number; coc: number }> = ({ s0, s1, pub, coc }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, pop(t, s0 + 0.03, 0.25))}><Banner k="PC" from="PUBO" to="COCCYGEUS" t={t} tTo={coc} /></div>
      <FBox t={t} top={124} h={756} id="v4" ks={[[s0, 1.0, 400, 390], [pub + 0.25, 1.0, 400, 410], [coc, 1.0, 400, 560], [s1, 1.0, 400, 580]]}
        lit={{ PR: s0 - 1, PC: s0 + 0.05, IC: s0 - 1, CO: s0 - 1 }} hot={["PC"]} dimRest={0.6}
        tags={[
          tg("PC", "PC", s0 + 0.25, -150, 40, 36),
          tg("BONE", "PUB", pub, 170, 40, 32, coc - 0.25, "pubis"),
          tg("BONE", "COC", coc, 170, -20, 32, undefined, "coccyx"),
        ]} />
      <div style={center(892, {})}>
        {t < coc ? <div style={pop(t, s0 + 0.4, 0.25)}><Pill size={36} bg={FCOL.PC} color={C.paper}>the bulk of levator ani</Pill></div>
          : <div style={pop(t, coc, 0.25)}><Pill size={38} bg={C.banana} color={C.forest}>front → back: pubis to coccyx</Pill></div>}
      </div>
    </Scene>
  );
};

/* 5. Iliococcygeus: side wall (tendinous arch + ischial spine) → coccyx */
export const V5: React.FC<{ s0: number; s1: number; side: number; coc: number }> = ({ s0, s1, side, coc }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, pop(t, s0 + 0.03, 0.25))}><Banner k="IC" from="ILIO" to="COCCYGEUS" t={t} tTo={coc} /></div>
      <FBox t={t} top={124} h={756} id="v5" ks={[[s0, 1.0, 330, 420], [coc - 0.1, 1.0, 310, 470], [s1, 1.0, 340, 570]]}
        lit={{ PR: s0 - 1, PC: s0 - 1, IC: s0 + 0.05, CO: s0 - 1 }} hot={t >= side - 0.05 && t < coc ? ["IC", "TA"] : ["IC"]} dimRest={0.6} arch={ramp(t, side - 0.1, side + 0.5)}
        tags={[
          tg("IC", "IC", s0 + 0.25, 210, -150, 36),
          tg("TA", "TA", side + 0.1, 150, -90, 30, undefined, "side wall: tendinous arch"),
          tg("BONE", "COC", coc, 170, -20, 32, undefined, "coccyx"),
        ]} />
      <div style={center(892, {})}>
        {t < coc ? <div style={pop(t, s0 + 0.4, 0.25)}><Pill size={36} bg={FCOL.IC} color={C.paper}>the outer, thinner part</Pill></div>
          : <div style={pop(t, coc, 0.25)}><Pill size={38} bg={C.banana} color={C.forest}>side wall → coccyx</Pill></div>}
      </div>
    </Scene>
  );
};

/* 6. Coccygeus on Gray's Fig. 404 — modern labels + 1918 spelling note */
export const V6: React.FC<{ s0: number; s1: number; co: number; spine: number }> = ({ s0, s1, co, spine }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, pop(t, s0 + 0.03, 0.25))}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: FCOL.CO, border: `4px solid ${C.forest}`, borderRadius: 26, padding: "6px 26px 12px", fontFamily: FONT, fontWeight: 800, color: C.paper, fontSize: 58, whiteSpace: "nowrap" }}>
          <span style={{ color: C.banana }}>+1</span> COCCYGEUS
        </div>
      </div>
      <PlateQ src={P404} aspect={A404} x={30} y={124} w={800} h={756} a={s0} b={s1} from={[0.36, 0.56, 0.7]} to={[0.33, 0.56, 0.6]} ls={36}
        labels={[
          { x: 0.31, y: 0.56, text: "coccygeus", t: co + 0.05, hot: true, ox: 60, oy: 210 },
          { x: 0.19, y: 0.66, text: "coccyx", t: co + 0.4, ox: 40, oy: 170 },
          { x: 0.36, y: 0.37, text: "piriformis", t: spine - 0.3, ox: 120, oy: -110 },
        ]} />
      <div style={{ position: "absolute", left: 60, top: 150, background: "rgba(255,254,246,0.95)", border: `3px solid ${C.forest}`, borderRadius: 16, padding: "6px 14px 8px", fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.forest, ...pop(t, spine - 0.2, 0.25) }}>
        1918 atlas name: <span style={{ color: "#B5481E" }}>Pyriformis</span>
      </div>
      <div style={center(892, {})}>
        {t < spine ? <div style={pop(t, co + 0.3, 0.25)}><Pill size={36} bg={FCOL.CO} color={C.paper}>at the back, behind levator ani</Pill></div>
          : <div style={pop(t, spine, 0.25)}><Pill size={38} bg={C.banana} color={C.forest}>ischial spine → coccyx + sacrum</Pill></div>}
      </div>
    </Scene>
  );
};

/* 6b. One-picture map: all 4 (held ≥ 1.5 s) */
export const V6b: React.FC<{ s0: number; s1: number }> = ({ s0, s1 }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, pop(t, s0 + 0.03, 0.25))}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, background: C.forest, borderRadius: 26, padding: "8px 26px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.paper, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 62, color: C.banana }}>4</span> MUSCLES · <span style={{ fontSize: 62, color: C.banana }}>1</span> FLOOR
        </div>
      </div>
      <FBox t={t} top={124} h={756} id="v6b" note="" ks={[[s0, 0.84, 400, 470], [s1, 0.83, 400, 470]]}
        lit={{ PR: s0 - 1, PC: s0 - 1, IC: s0 - 1, CO: s0 - 1 }}
        tags={[
          tg("PR", "PRR", s0 + 0.05, 150, -210, 30),
          tg("PC", "PC", s0 + 0.12, -150, -150, 30),
          tg("IC", "ICR", s0 + 0.19, 40, 190, 30),
          tg("CO", "CO", s0 + 0.26, -130, 40, 30),
        ]} />
      <div style={center(892, pop(t, s0 + 0.35, 0.25))}>
        <Pill size={36} bg={C.banana} color={C.forest}>📸 screenshot this map</Pill>
      </div>
    </Scene>
  );
};

/* 7. Quick test with 3-2-1 */
export const V7: React.FC<{ s0: number; s1: number; q: number; cd: [number, number][] }> = ({ s0, s1, q, cd }) => {
  const t = useT();
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < s1) { n = v; n0 = s; } });
  const OPTS: [FK, string][] = [["PR", "Puborectalis"], ["PC", "Pubococcygeus"], ["IC", "Iliococcygeus"], ["CO", "Coccygeus"]];
  return (
    <Scene start={s0} end={s1}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, s0 + 0.05, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 40, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 30, width: 760, top: 98, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 58, lineHeight: 1.1, color: C.paper, ...pop(t, q) }}>
          Which one makes the <span style={{ color: C.banana }}>sling</span>?
        </div>
        <div style={{ position: "absolute", left: 60, top: 260, width: 700, display: "flex", flexDirection: "column", gap: 16 }}>
          {OPTS.map(([k, nm], i) => (
            <div key={nm} style={{ height: 86, borderRadius: 24, background: "rgba(247,246,236,0.08)", border: "3px solid rgba(247,246,236,0.18)", display: "flex", alignItems: "center", gap: 18, padding: "0 18px", boxSizing: "border-box", ...pop(t, q + 0.5 + i * 0.08, 0.25) }}>
              <div style={{ width: 56, height: 56, borderRadius: 28, background: "rgba(247,246,236,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.banana }}>{"ABCD"[i]}</div>
              <div style={{ width: 20, height: 56, borderRadius: 10, background: FCOL[k] }} />
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper, whiteSpace: "nowrap" }}>{nm}</div>
              <div style={{ marginLeft: "auto", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.banana }}>?</div>
            </div>
          ))}
        </div>
        {n !== null ? (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 676, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 150, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        ) : (
          <div style={{ position: "absolute", left: 0, width: 820, top: 740, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#B9D27A", opacity: ramp(t, q + 1.0, q + 1.2) }}>pause · say it out loud</div>
        )}
      </div>
    </Scene>
  );
};

/* 8. Answer: puborectalis sling on our map */
export const V8: React.FC<{ s0: number; s1: number; a: number }> = ({ s0, s1, a }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, pop(t, s0 + 0.05, 0.25))}>
        <div style={{ background: "#E5251A", border: `4px solid ${C.forest}`, borderRadius: 26, padding: "10px 30px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.paper, whiteSpace: "nowrap" }}>✓ A · Puborectalis</div>
      </div>
      <FBox t={t} top={124} h={756} id="v8" ks={[[s0, 1.0, 400, 470], [s1, 1.12, 400, 500]]}
        lit={{ PR: s0 - 1, PC: s0 - 1, IC: s0 - 1, CO: s0 - 1 }} hot={["PR"]} dimRest={0.5}
        tags={[tg("PR", "PRB", a + 0.2, 160, 80, 32, undefined, "the U-sling behind the rectum")]} />
      <div style={center(892, pop(t, a + 0.5, 0.25))}>
        <Pill size={34} bg={C.banana} color={C.forest}>keeps the anorectal angle → continence</Pill>
      </div>
    </Scene>
  );
};

/* 9. end card: save (≤ 1.5 s) */
export const V9: React.FC<{ s0: number; s1: number }> = ({ s0, s1 }) => {
  const t = useT();
  const ROWS: [FK, string, string][] = [["PR", "Puborectalis", "pubis → sling behind rectum"], ["PC", "Pubococcygeus", "pubis → coccyx"], ["IC", "Iliococcygeus", "side wall → coccyx"], ["CO", "Coccygeus", "ischial spine → coccyx"]];
  return (
    <Scene start={s0} end={s1}>
      <div style={{ position: "absolute", left: 30, top: 20, width: 800, height: 860, borderRadius: 44, background: C.forest, ...pop(t, s0 + 0.02, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 800, top: 40, textAlign: "center" }}><Loud size={84}>SAVE THIS</Loud></div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 142, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: "#B9D27A" }}>pelvic floor = levator ani (3) + coccygeus</div>
        <div style={{ position: "absolute", left: 40, top: 210, width: 720, display: "flex", flexDirection: "column", gap: 16 }}>
          {ROWS.map(([k, nm, b], i) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 18, background: "rgba(247,246,236,0.08)", borderRadius: 24, padding: 12, ...pop(t, s0 + 0.08 + i * 0.06, 0.22) }}>
              <div style={{ width: 300, height: 76, borderRadius: 20, background: FCOL[k], display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.paper, whiteSpace: "nowrap" }}>{nm}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 29, color: C.paper, lineHeight: 1.2 }}>{b}</div>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, width: 800, top: 700, display: "flex", justifyContent: "center", ...pop(t, s0 + 0.3, 0.25) }}>
          <div style={{ background: C.banana, color: C.forest, borderRadius: 50, padding: "14px 44px", fontFamily: FONT, fontWeight: 800, fontSize: 42 }}>🔖 SAVE THIS · + FOLLOW</div>
        </div>
      </div>
    </Scene>
  );
};

/* TikTok: one map — the 3 parts light up as named, then coccygeus */
export const TTDiag: React.FC<{ s0: number; s1: number; pr: number; pc: number; ic: number; co: number }> = ({ s0, s1, pr, pc, ic, co }) => {
  const t = useT();
  const hot: FK[] = t >= co - 0.05 ? (t >= co + 0.9 ? [] : ["CO"]) : t >= ic - 0.05 ? ["IC"] : t >= pc - 0.05 ? ["PC"] : t >= pr - 0.05 ? ["PR"] : [];
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(10, pop(t, s0 + 0.03, 0.25))}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, background: C.forest, borderRadius: 26, padding: "8px 26px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.paper, whiteSpace: "nowrap" }}>
          PELVIC FLOOR = <span style={{ color: C.banana }}>3 + 1</span>
        </div>
      </div>
      <FBox note="" t={t} top={124} h={756} id="tt" ks={[[s0, 0.84, 400, 470], [pr + 0.1, 0.95, 400, 440], [ic + 0.1, 0.92, 370, 480], [co + 0.1, 0.84, 400, 480], [s1, 0.84, 400, 480]]}
        lit={{ PR: pr, PC: pc, IC: ic, CO: co }} hot={hot} dimRest={0.5}
        tags={[
          tg("PR", "PRR", pr, 140, -200, 32),
          tg("PC", "PC", pc + 0.05, -150, -150, 32),
          tg("IC", "ICR", ic + 0.05, 40, 190, 32),
          tg("CO", "CO", co + 0.05, -130, 40, 32),
        ]} />
      <div style={center(892, {})}>
        {t < co ? <div style={pop(t, s0 + 0.3, 0.25)}><Pill size={36} bg={C.banana} color={C.forest}>the names = FROM → TO</Pill></div>
          : <div style={pop(t, co, 0.25)}><Pill size={36} bg={FCOL.CO} color={C.paper}>+ coccygeus at the back</Pill></div>}
      </div>
    </Scene>
  );
};
