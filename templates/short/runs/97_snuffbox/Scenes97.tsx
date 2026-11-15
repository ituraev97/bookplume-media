import React from "react";
import { C, FONT, Pill, Scene, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, pop } from "./Scenes67";
import { Loud, PlateQ } from "./Scenes93";
import { GCOL, G, SANCH, SGROUP, SNAME, SORDER, SP, SSHORT, Snuff } from "./Snuff97";

export const P418 = "plates/snuff418.png";
export const A418 = 796 / 1271;
export const P220 = "plates/carpus220.png";
export const A220 = 1190 / 907;
export const P529 = "plates/radial529.png";
export const A529 = 1127 / 1113;
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* the hollow between the thumb tendons on Gray's Fig. 418 */
export const HOOKPIN = { x: 0.49, y: 0.392 };

export type Tm = { reveal: number; ticks: number[]; pow: number; hookEnd: number };
export const TM_MAIN: Tm = { reveal: 3.62, ticks: [1.95, 2.6, 3.2], pow: 4.35, hookEnd: 5.15 };
export const TM_TT: Tm = { reveal: 3.62, ticks: [1.95, 2.6, 3.2], pow: 4.32, hookEnd: 5.05 };

/* 3-2-1 ring */
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

/* 1. Quiz hook: Gray's 1918 Fig. 418, red pin on the hollow at the base of the thumb from frame 1, 3-2-1, reveal */
export const V1: React.FC<{ tm: Tm }> = ({ tm }) => {
  const t = useT();
  const R = tm.reveal;
  const rv = ramp(t, R, R + 0.25);
  return (
    <Scene start={-0.6} end={tm.hookEnd} push={0.02}>
      <div style={center(0, { opacity: 1 - rv })}>
        <Loud size={118}>NAME THIS</Loud>
      </div>
      <div style={center(124, { opacity: 1 - rv })}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ background: "#E5251A", border: "7px solid #111", borderRadius: 18, padding: "0 22px 6px", transform: "rotate(-2deg)" }}><Loud size={86}>HOLLOW</Loud></div>
          <Loud size={60}>IN 3 SEC</Loud>
        </div>
      </div>
      {rv > 0 && (
        <div style={center(16, pop(t, R, 0.3))}>
          <div style={{ textAlign: "center" }}>
            <Big size={64} color={C.forest}>✓ ANATOMICAL SNUFFBOX</Big>
            <div style={{ height: 22 }} />
            <div style={{ display: "flex", justifyContent: "center", ...pop(t, tm.pow, 0.3) }}>
              <Pill size={40} bg={C.red} color={C.paper}>lift your thumb → it pops up</Pill>
            </div>
          </div>
        </div>
      )}
      <PlateQ src={P418} aspect={A418} x={30} y={262} w={800} h={640} a={-0.6} b={tm.hookEnd} from={[0.47, 0.56, 1.0]} to={[0.46, 0.5, 0.9]}
        pin={{ ...HOOKPIN, t0: -1, t1: R + 0.2, r: 78 }}
        labels={[{ x: HOOKPIN.x, y: HOOKPIN.y + 0.01, text: "anatomical\nsnuffbox", t: R + 0.02, hot: true, ox: 30, oy: 190 }]} ls={40} />
      <div style={{ position: "absolute", left: 650, top: 610 }}>
        <Ring t={t} size={170} tm={tm} />
      </div>
      <div style={center(898, pop(t, 0.05, 0.25))}>
        {t < R ? <Pill size={34} bg={C.forest}>anatomy quiz · say it before the 1</Pill> : (
          <div style={{ ...pop(t, R + 0.6, 0.25) }}><Pill size={36} bg={C.banana} color={C.forest}>anatomical snuffbox · mnemonic</Pill></div>
        )}
      </div>
    </Scene>
  );
};

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

/* diagram box with a camera + name tags that pop on the parts */
type Tag = { m: SP; t: number; dx?: number; dy?: number };
const SnuffBox: React.FC<{ t: number; ks: Kf[]; top: number; h: number; id: string; tags?: Tag[]; children?: React.ReactNode } & Omit<React.ComponentProps<typeof Snuff>, "w" | "id" | "t">> = ({ t, ks, top, h, id, tags = [], children, ...rest }) => {
  const [, s, cx, cy] = cam(t, ks);
  const X0 = 430 - cx * s, Y0 = h / 2 - cy * s;
  return (
    <div style={{ position: "absolute", left: 0, top, width: 860, height: h, overflow: "hidden", borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}` }}>
      <div style={{ position: "absolute", left: X0, top: Y0 }}>
        <Snuff t={t} w={1000 * s} id={id} {...rest} />
      </div>
      {tags.map(({ m, t: t0, dx = 0, dy = 0 }) => {
        const p = ramp(t, t0 - 0.05, t0 + 0.2);
        if (p <= 0) return null;
        const [ax, ay] = SANCH[m];
        const x = X0 + ax * s + dx, y = Y0 + ay * s + dy;
        return (
          <div key={m} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${0.7 + 0.3 * p})`, opacity: p, background: GCOL[SGROUP[m]], color: C.paper, border: `4px solid ${C.paper}`, boxShadow: "0 6px 0 rgba(31,42,20,0.25)", borderRadius: 16, padding: "4px 14px 7px", fontFamily: FONT, fontWeight: 800, fontSize: 34, whiteSpace: "nowrap" }}>
            {SSHORT[m]}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 18, top: 16, fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.forest, background: "rgba(255,254,246,0.9)", borderRadius: 12, padding: "4px 12px" }}>left hand · back view</div>
      <div style={{ position: "absolute", right: 16, bottom: 12, fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.forest, opacity: 0.55, background: "rgba(255,254,246,0.85)", borderRadius: 8, padding: "0 8px" }}>diagram: Book Plume</div>
      {children}
    </div>
  );
};

const GPARTS: Record<G, SP[]> = { g2t: ["APL", "EPB"], g1t: ["EPL"], g2b: ["SCA", "TRA"], g1a: ["RA"] };
const GORDER: G[] = ["g2t", "g1t", "g2b", "g1a"];
const GWORD: Record<G, [string, string]> = { g2t: ["2", "tendons"], g1t: ["1", "tendon"], g2b: ["2", "bones"], g1a: ["1", "artery"] };

/* 2. The trick: 2 · 1 · 2 · 1 — digits on a card, groups light on our diagram */
export const VTrick: React.FC<{ s0: number; s1: number; tok: number[]; grp: number[]; ks?: Kf[] }> = ({ s0, s1, tok, grp, ks }) => {
  const t = useT();
  let cur = -1;
  grp.forEach((g, i) => { if (t >= g - 0.05) cur = i; });
  const lit: Partial<Record<SP, number>> = {};
  GORDER.forEach((g, i) => GPARTS[g].forEach((m) => (lit[m] = grp[i])));
  const hot: SP[] = cur >= 0 ? GPARTS[GORDER[cur]] : [];
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={{ position: "absolute", left: 20, top: 0, width: 820, height: 200, borderRadius: 36, background: C.forest, ...pop(t, s0 + 0.02, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 14, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: 4, color: C.banana }}>SNUFFBOX TRICK</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, display: "flex", justifyContent: "center", gap: 26 }}>
          {GORDER.map((g, i) => {
            const on = t >= tok[i] - 0.05;
            const hotG = cur === i;
            return (
              <div key={g} style={{ width: 170, display: "flex", flexDirection: "column", alignItems: "center", opacity: on ? 1 : 0.25, transform: `scale(${hotG ? 1.08 : 1})` }}>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 96, lineHeight: 1, color: on ? GCOL[g] : C.paper, WebkitTextStroke: on ? `3px ${C.paper}` : undefined, ...pop(t, tok[i], 0.22) } as React.CSSProperties}>{GWORD[g][0]}</div>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.paper, opacity: ramp(t, grp[i] - 0.05, grp[i] + 0.2), marginTop: 4 }}>{GWORD[g][1]}</div>
              </div>
            );
          })}
        </div>
      </div>
      <SnuffBox t={t} top={220} h={690} id="vt" ks={ks ?? [[s0, 0.74, 610, 560], [s1, 0.8, 620, 580]]} lit={lit} hot={hot} box={ramp(t, grp[0], grp[0] + 0.4) * 0.6}
        tags={SORDER.map((m) => ({ m, t: grp[GORDER.indexOf(SGROUP[m])] }))} />
    </Scene>
  );
};

/* 3. Gray's Fig. 418 with modern labels: 2 tendons on the thumb side */
export const V3: React.FC<{ s0: number; s1: number; two: number; apl: number; epb: number }> = ({ s0, s1, two, apl, epb }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.006}>
      <div style={center(14, pop(t, s0 + 0.05, 0.25))}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: GCOL.g2t, border: `4px solid ${C.forest}`, borderRadius: 26, padding: "8px 26px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 64, ...pop(t, two, 0.25) }}>2</span> TENDONS · thumb side
        </div>
      </div>
      <PlateQ src={P418} aspect={A418} x={30} y={130} w={800} h={700} a={s0} b={s1} from={[0.44, 0.45, 1.0]} to={[0.45, 0.4, 0.86]} ls={36}
        labels={[
          { x: 0.445, y: 0.33, text: "abductor\npollicis longus", t: apl, hot: t < epb, ox: -60, oy: 210 },
          { x: 0.472, y: 0.35, text: "extensor\npollicis brevis", t: epb, hot: t >= epb, ox: 40, oy: 330 },
        ]} />
      <div style={{ position: "absolute", left: 30, top: 848, opacity: ramp(t, s0 + 0.3, s0 + 0.55) }}>
        <Pill size={26} bg={C.forest}>Gray's Fig. 418 · left hand, back view</Pill>
      </div>
    </Scene>
  );
};

/* 3b. Our diagram: 1 tendon on the other side (EPL) → the hollow between them */
export const V3b: React.FC<{ s0: number; s1: number; one: number; epl: number }> = ({ s0, s1, one, epl }) => {
  const t = useT();
  const pre = s0 - 1;
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(14, pop(t, s0 + 0.05, 0.25))}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: GCOL.g1t, border: `4px solid ${C.forest}`, borderRadius: 26, padding: "8px 26px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 64, ...pop(t, one, 0.25) }}>1</span> TENDON · other side
        </div>
      </div>
      <SnuffBox t={t} top={128} h={752} id="v3b" ks={[[s0, 0.8, 610, 570], [epl, 0.84, 610, 580], [s1, 0.96, 620, 640]]}
        lit={{ APL: pre, EPB: pre, EPL: epl }} hot={t >= epl ? ["EPL"] : []} dim={0} box={ramp(t, epl + 0.6, epl + 1.0)}
        tags={[{ m: "APL", t: s0 + 0.1 }, { m: "EPB", t: s0 + 0.2 }, { m: "EPL", t: epl }]} />
      <div style={center(892, pop(t, epl + 0.1, 0.25))}>
        <Pill size={34} bg={C.forest}>extensor pollicis longus</Pill>
      </div>
      <div style={{ position: "absolute", left: 330, top: 560, opacity: ramp(t, epl + 0.7, epl + 1.0) }}>
        <Pill size={30} bg={C.banana} color={C.forest}>the hollow</Pill>
      </div>
    </Scene>
  );
};

/* 4. Gray's Fig. 220: the floor = scaphoid + trapezium (1918 names) */
export const V4: React.FC<{ s0: number; s1: number; two: number; sca: number; tra: number }> = ({ s0, s1, two, sca, tra }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.006}>
      <div style={center(14, pop(t, s0 + 0.05, 0.25))}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: GCOL.g2b, border: `4px solid ${C.forest}`, borderRadius: 26, padding: "8px 26px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 64, ...pop(t, two, 0.25) }}>2</span> BONES · the floor
        </div>
      </div>
      <PlateQ src={P220} aspect={A220} x={30} y={130} w={800} h={640} a={s0} b={s1} from={[0.34, 0.36, 0.8]} to={[0.3, 0.33, 0.66]} ls={38}
        labels={[
          { x: 0.36, y: 0.24, text: "scaphoid", t: sca, hot: t < tra, ox: 120, oy: 150 },
          { x: 0.14, y: 0.42, text: "trapezium", t: tra, hot: t >= tra, ox: 60, oy: 200 },
        ]} />
      <div style={{ position: "absolute", left: 30, top: 790, ...pop(t, sca + 0.35, 0.3) }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 16px 10px", fontFamily: FONT, fontWeight: 800, fontSize: 27, color: C.forest, whiteSpace: "nowrap", lineHeight: 1.3 }}>
          <span style={{ color: C.matcha }}>1918 atlas names:</span> “Navicular” = scaphoid
          <br />
          <span style={{ opacity: tra > 0 && t >= tra ? 1 : 0.25 }}>“Greater multangular” = trapezium</span>
        </div>
      </div>
    </Scene>
  );
};

/* 4b. Our diagram: 1 artery inside — name hidden for the quick test */
export const V4b: React.FC<{ s0: number; s1: number; ra: number }> = ({ s0, s1, ra }) => {
  const t = useT();
  const pre = s0 - 1;
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(14, pop(t, s0 + 0.05, 0.25))}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: GCOL.g1a, border: `4px solid ${C.forest}`, borderRadius: 26, padding: "8px 26px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 64, ...pop(t, ra, 0.25) }}>1</span> ARTERY · inside
        </div>
      </div>
      <SnuffBox t={t} top={128} h={752} id="v4b" ks={[[s0, 0.8, 620, 600], [s1, 0.9, 640, 640]]}
        lit={{ APL: pre, EPB: pre, EPL: pre, SCA: pre, TRA: pre, RA: ra }} hot={t >= ra ? ["RA"] : []} dim={0.6} raQ box={0.4} />
      <div style={center(892, pop(t, ra + 0.3, 0.25))}>
        <Pill size={34} bg={C.forest}>which artery? → quick test</Pill>
      </div>
    </Scene>
  );
};

/* 5. Quick test with 3-2-1 */
export const V5: React.FC<{ s0: number; s1: number; q: number; cd: [number, number][] }> = ({ s0, s1, q, cd }) => {
  const t = useT();
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < s1) { n = v; n0 = s; } });
  const OPTS = ["Ulnar artery", "Radial artery", "Brachial artery", "Anterior interosseous"];
  return (
    <Scene start={s0} end={s1}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, s0 + 0.05, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 42, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 30, width: 760, top: 100, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 58, lineHeight: 1.1, color: C.paper, ...pop(t, q) }}>
          Which artery crosses the <span style={{ color: C.banana }}>snuffbox floor</span>?
        </div>
        <div style={{ position: "absolute", left: 60, top: 310, width: 700, display: "flex", flexDirection: "column", gap: 18 }}>
          {OPTS.map((nm, i) => (
            <div key={nm} style={{ height: 80, borderRadius: 22, background: "rgba(247,246,236,0.08)", border: "3px solid rgba(247,246,236,0.18)", display: "flex", alignItems: "center", gap: 16, padding: "0 16px", boxSizing: "border-box", ...pop(t, q + 0.5 + i * 0.08, 0.25) }}>
              <div style={{ width: 54, height: 54, borderRadius: 27, background: "rgba(247,246,236,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.banana }}>{"ABCD"[i]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.paper, whiteSpace: "nowrap" }}>{nm}</div>
              <div style={{ marginLeft: "auto", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.banana }}>?</div>
            </div>
          ))}
        </div>
        {n !== null ? (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 718, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 130, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        ) : (
          <div style={{ position: "absolute", left: 0, width: 820, top: 760, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#B9D27A", opacity: ramp(t, q + 1.0, q + 1.2) }}>pause · say it out loud</div>
        )}
      </div>
    </Scene>
  );
};

/* 6. Answer: radial artery on Gray's Fig. 529 (printed "Radial") + pulse */
export const V6: React.FC<{ s0: number; s1: number; ra: number; pulse: number; head?: string }> = ({ s0, s1, ra, pulse, head = "✓ Radial artery" }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1} push={0.006}>
      <div style={center(14, pop(t, s0 + 0.05, 0.25))}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, background: GCOL.g1a, border: `4px solid ${C.forest}`, borderRadius: 26, padding: "10px 30px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.paper, whiteSpace: "nowrap" }}>{head}</div>
      </div>
      <PlateQ src={P529} aspect={A529} x={30} y={130} w={800} h={700} a={s0} b={s1} from={[0.47, 0.5, 0.72]} to={[0.48, 0.53, 0.6]} ls={38}
        pin={{ x: 0.475, y: 0.535, t0: pulse, t1: s1 + 1, r: 46 }}
        labels={[{ x: 0.462, y: 0.47, text: "radial artery", t: ra, hot: true, ox: -50, oy: 210 }]} />
      <div style={{ position: "absolute", left: 30, top: 848, opacity: ramp(t, s0 + 0.3, s0 + 0.55) }}>
        <Pill size={26} bg={C.forest}>Gray's Fig. 529 · 1918 label “Radial”</Pill>
      </div>
      <div style={{ position: "absolute", left: 470, top: 700, ...pop(t, pulse, 0.3) }}>
        <Pill size={38} bg={C.banana} color={C.forest}>feel its pulse here</Pill>
      </div>
    </Scene>
  );
};

/* 7. Save + cheat sheet */
export const V7: React.FC<{ s0: number; s1: number }> = ({ s0, s1 }) => {
  const t = useT();
  const bb = ramp(t, s0 + 0.05, s0 + 0.4);
  const ROWS: [G, string, string][] = [["g2t", "2 tendons · thumb side", "APL + EPB"], ["g1t", "1 tendon · other side", "EPL"], ["g2b", "2 bones · floor", "scaphoid + trapezium"], ["g1a", "1 artery · inside", "radial artery"]];
  return (
    <Scene start={s0} end={s1}>
      <div style={{ position: "absolute", left: 40, top: 0, ...pop(t, s0 + 0.05) }}>
        <svg width={110} height={140} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - bb) * -40})`} />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 170, top: 6, ...pop(t, s0 + 0.1) }}>
        <Big size={100}>SAVE THIS</Big>
      </div>
      <div style={{ position: "absolute", left: 172, top: 112, ...pop(t, s0 + 0.3) }}>
        <Big size={40} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ position: "absolute", left: 30, top: 190, width: 800, height: 720, borderRadius: 40, background: C.card, border: `3px solid ${C.line}`, boxShadow: "0 18px 40px rgba(31,42,20,0.12)", padding: "26px 34px", boxSizing: "border-box", ...pop(t, s0 + 0.15, 0.3) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.matcha, letterSpacing: 2 }}>ANATOMICAL SNUFFBOX · CHEAT SHEET</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 84, color: C.forest, marginTop: 4, whiteSpace: "nowrap", display: "flex", gap: 30, lineHeight: 1 }}>
          {GORDER.map((g) => <span key={g} style={{ color: GCOL[g] }}>{GWORD[g][0]}</span>)}
        </div>
        <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 26 }}>
          {ROWS.map(([g, a, b], i) => (
            <div key={g} style={{ display: "flex", alignItems: "center", gap: 18, opacity: ramp(t, s0 + 0.2 + i * 0.07, s0 + 0.4 + i * 0.07) }}>
              <div style={{ width: 22, height: 96, flex: "0 0 22px", borderRadius: 11, background: GCOL[g] }} />
              <div>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: GCOL[g], whiteSpace: "nowrap" }}>{a}</div>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 48, color: C.forest, whiteSpace: "nowrap", lineHeight: 1.1 }}>{b}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Scene>
  );
};

/* 8. End card (≤ 1.5 s) */
export const V8: React.FC<{ s0: number; s1: number }> = ({ s0, s1 }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, s0 + 0.02, 0.3) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.banana, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, s0 + 0.15, s0 + 0.4) }}>
          anatomy quizzes you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - s0) * 5))})`, opacity: ramp(t, s0 + 0.05, s0 + 0.25) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};

/* TikTok: lift your thumb → the hollow appears (thumb extends on our diagram) */
export const TTLift: React.FC<{ s0: number; s1: number; lift: number; up: number }> = ({ s0, s1, lift, up }) => {
  const t = useT();
  const k = ramp(t, lift, up + 0.2);
  const pre = s0 - 1;
  return (
    <Scene start={s0} end={s1} push={0.004}>
      <div style={center(14, pop(t, s0 + 0.05, 0.25))}>
        <div style={{ background: C.red, border: `4px solid ${C.forest}`, borderRadius: 26, padding: "8px 26px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 46, color: C.paper, whiteSpace: "nowrap" }}>LIFT YOUR THUMB →</div>
      </div>
      <SnuffBox t={t} top={128} h={752} id="ttl" ks={[[s0, 0.74, 600, 540], [s1, 0.82, 610, 580]]} ang={14 + 26 * k}
        lit={{ APL: pre, EPB: pre, EPL: pre }} hot={k > 0.5 ? ["EPL", "EPB", "APL"] : []} box={ramp(t, up - 0.1, up + 0.25)} />
      <div style={center(892, pop(t, up, 0.25))}>
        <Pill size={36} bg={C.banana} color={C.forest}>the hollow pops up between the tendons</Pill>
      </div>
    </Scene>
  );
};

/* TikTok end: comment card (no brand) */
export const VComment: React.FC<{ s0: number; s1: number }> = ({ s0, s1 }) => {
  const t = useT();
  return (
    <Scene start={s0} end={s1 + 0.6} push={0.01}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 800, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30, ...pop(t, s0 + 0.02, 0.3) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.banana, letterSpacing: 4 }}>DID YOU GET IT IN 3?</div>
        <div style={{ textAlign: "center" }}>
          <Loud size={104}>COMMENT</Loud>
          <div style={{ height: 14 }} />
          <Loud size={84} color="#FFE04A">WHAT YOU</Loud>
          <div style={{ height: 14 }} />
          <Loud size={84} color="#FFE04A">GUESSED</Loud>
        </div>
        <svg width={120} height={130} viewBox="0 0 120 130" style={{ transform: `translateY(${Math.abs(Math.sin((t - s0) * 6)) * 16}px)` }}>
          <path d="M 40 6 L 80 6 L 80 66 L 112 66 L 60 124 L 8 66 L 40 66 Z" fill="#E5251A" stroke="#111" strokeWidth={8} strokeLinejoin="round" />
        </svg>
      </div>
    </Scene>
  );
};
export { SNAME };
