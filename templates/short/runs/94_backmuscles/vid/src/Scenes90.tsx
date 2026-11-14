import React from "react";
import { C, FONT, Pill, Scene, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, pop } from "./Scenes67";
import { PlateBox74 } from "./Scenes74";
import { FANCHOR, FB, FCOL, FCOUNT, FLETTER, FNAME, FORDER, FSHORT, FWORD, Face } from "./Face90";

export const A190 = 1450 / 2089;
export const P190 = "plates/fig190_skull.png";
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* voice times (words.json) */
export const TW: Record<FB, number> = { V: 4.35, C: 4.78, N: 4.93, MX: 5.14, MD: 5.37, P: 5.53, Z: 5.78, L: 6.11 }; // mnemonic words
export const TN: Record<FB, number> = { V: 6.79, C: 7.14, N: 7.52, MX: 7.87, MD: 8.42, P: 8.86, Z: 9.7, L: 10.33 }; // bone names

export const FChip: React.FC<{ b: FB; size?: number; on?: number; hot?: boolean; q?: boolean }> = ({ b, size = 64, on = 1, hot, q }) => (
  <div style={{ width: size, height: size, flex: `0 0 ${size}px`, borderRadius: size * 0.28, background: on > 0.5 ? FCOL[b] : "rgba(31,42,20,0.08)", border: `4px solid ${on > 0.5 ? C.forest : "rgba(31,42,20,0.25)"}`, color: on > 0.5 ? C.forest : "rgba(31,42,20,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.6, transform: `scale(${hot ? 1.16 : 1})`, boxShadow: hot ? `0 0 0 6px ${C.banana}` : "none", lineHeight: 1 }}>
    {q ? "?" : FLETTER[b]}
  </div>
);

const Strip: React.FC<{ t: number; top?: number; times: Record<FB, number> }> = ({ t, top = 14, times }) => {
  let cur: FB | null = null;
  FORDER.forEach((b) => { if (t >= times[b] - 0.05) cur = b; });
  return (
    <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", gap: 10 }}>
      {FORDER.map((b) => {
        const p = ramp(t, times[b] - 0.05, times[b] + 0.15);
        return <div key={b} style={{ transform: `scale(${1 + 0.22 * p * (1 - ramp(t, times[b] + 0.15, times[b] + 0.45))})` }}><FChip b={b} size={70} on={p} hot={cur === b} /></div>;
      })}
    </div>
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
/* stage: s = px per viewBox unit, (cx, cy) = viewBox point at the stage centre */
const Stage: React.FC<{ t: number; k: Kf; id: string; h?: number; top?: number; children?: (P: (m: [number, number]) => [number, number]) => React.ReactNode } & Omit<React.ComponentProps<typeof Face>, "t" | "w" | "id">> = ({ t, k, id, children, h = 790, top = 110, ...rest }) => {
  const [, s, cx, cy] = k;
  const X0 = 430 - cx * s, Y0 = h / 2 - cy * s;
  const P = (m: [number, number]) => [X0 + m[0] * s, top + Y0 + m[1] * s] as [number, number];
  return (
    <>
      <div style={{ position: "absolute", left: 0, top, width: 860, height: h, overflow: "hidden", borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}` }}>
        <div style={{ position: "absolute", left: X0, top: Y0 }}>
          <Face t={t} w={1000 * s} id={id} {...rest} />
        </div>
      </div>
      {children && children(P)}
    </>
  );
};
const Call: React.FC<{ t: number; t0: number; a: [number, number]; to: [number, number]; text: string; bg?: string; fg?: string; size?: number; t1?: number }> = ({ t, t0, a, to, text, bg = C.forest, fg = C.paper, size = 36, t1 }) => {
  const p = ramp(t, t0, t0 + 0.25) * (t1 ? 1 - ramp(t, t1, t1 + 0.15) : 1);
  if (p <= 0) return null;
  const [ax, ay] = a, [tx, ty] = to;
  return (
    <>
      <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", opacity: p }}>
        <line x1={ax} y1={ay} x2={ax + (tx - ax) * p} y2={ay + (ty - ay) * p} stroke={C.paper} strokeWidth={11} strokeLinecap="round" />
        <line x1={ax} y1={ay} x2={ax + (tx - ax) * p} y2={ay + (ty - ay) * p} stroke={C.forest} strokeWidth={5} strokeLinecap="round" />
        <circle cx={ax} cy={ay} r={12} fill={C.banana} stroke={C.forest} strokeWidth={4} />
      </svg>
      <div style={{ position: "absolute", left: tx, top: ty, transform: `translate(-50%, -50%) scale(${0.8 + 0.2 * p})`, opacity: p }}>
        <Pill size={size} bg={bg} color={fg} style={{ whiteSpace: "pre", lineHeight: 1.1, textAlign: "center" }}>{text}</Pill>
      </div>
    </>
  );
};

/* 1. Hook: Gray's 1918 Fig. 190 visible from frame 0 + challenge */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={2.95} push={0.02}>
      <div style={center(4, pop(t, -0.4, 0.25))}>
        <Big size={118}>14 FACE BONES</Big>
      </div>
      <div style={center(130, pop(t, -0.3, 0.25))}>
        <Big size={112} color={C.red}>ONLY 1 MOVES?</Big>
      </div>
      <PlateBox74 src={P190} aspect={A190} x={70} y={262} w={720} h={606} a={-0.6} b={2.95} from={[0.5, 0.6, 1.0]} to={[0.5, 0.64, 0.86]}
        labels={[{ x: 0.5, y: 0.72, text: "facial bones", t: 1.0, hot: true, ox: -60, oy: -190 }]} />
      <div style={center(890, pop(t, 0.1, 0.25))}>
        <Pill size={33} bg={C.forest}>facial bones · mnemonic</Pill>
      </div>
    </Scene>
  );
};

/* 2. The mnemonic card: first letters highlighted, word by word */
export const V2: React.FC = () => {
  const t = useT();
  const rows: FB[][] = [["V", "C", "N"], ["MX", "MD", "P"], ["Z", "L"]];
  return (
    <Scene start={2.95} end={6.65} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, ...pop(t, 2.97, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 8, color: C.banana }}>FACIAL BONES MNEMONIC</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 100, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 44, color: "#B9D27A", ...pop(t, 3.3, 0.3) }}>8 names · 8 first letters</div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 200, display: "flex", flexDirection: "column", gap: 34 }}>
          {rows.map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "center", gap: 22 }}>
              {r.map((b) => {
                const p = ramp(t, TW[b] - 0.08, TW[b] + 0.18);
                const w = FWORD[b];
                return (
                  <div key={b} style={{ display: "flex", alignItems: "baseline", opacity: 0.15 + 0.85 * p, transform: `translateY(${(1 - p) * 18}px) scale(${0.9 + 0.1 * p})`, fontFamily: FONT, fontWeight: 800, fontSize: 86, lineHeight: 1.05, color: C.paper }}>
                    <span style={{ background: p > 0.5 ? FCOL[b] : "rgba(247,246,236,0.12)", color: C.forest, borderRadius: 16, padding: "0 12px 4px", marginRight: 2 }}>{w[0]}</span>
                    <span>{w.slice(1)}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 690, display: "flex", justifyContent: "center", gap: 10, opacity: ramp(t, 6.2, 6.4) }}>
          {FORDER.map((b) => <FChip key={b} b={b} size={66} />)}
        </div>
      </div>
    </Scene>
  );
};

/* 3. Each bone lights on our own diagram as it is named */
export const V3: React.FC = () => {
  const t = useT();
  let cur: FB = "V";
  FORDER.forEach((b) => { if (t >= TN[b] - 0.05) cur = b; });
  /* camera: start close on the nose (V, C, N), pull back for maxilla/mandible/palatine, sweep to cheek, orbit */
  const k = cam(t, [[6.65, 1.15, 500, 700], [7.6, 1.15, 500, 690], [8.0, 0.74, 500, 760], [9.5, 0.74, 500, 790], [9.8, 1.0, 380, 680], [10.3, 1.0, 390, 640], [11.0, 1.0, 400, 640]]);
  const lit: Partial<Record<FB, number>> = {};
  FORDER.forEach((b) => (lit[b] = TN[b] - 0.08));
  const pos: Record<FB, [number, number]> = { V: [250, 690], C: [640, 640], N: [640, 230], MX: [170, 560], MD: [640, 760], P: [210, 760], Z: [170, 320], L: [640, 300] };
  return (
    <Scene start={6.65} end={11.0} push={0.004}>
      <Stage t={t} k={k} id="v3" lit={lit} hot={[cur]} dim={1}>
        {(P) => (
          <>
            {FORDER.map((b, i) => {
              const nx = FORDER[i + 1];
              return <Call key={b} t={t} t0={TN[b]} t1={nx ? TN[nx] - 0.05 : undefined} a={P(FANCHOR[b])} to={pos[b]} text={FSHORT[b]} bg={FCOL[b]} fg={C.forest} size={b === "P" ? 30 : 38} />;
            })}
          </>
        )}
      </Stage>
      <Strip t={t} times={TN} />
    </Scene>
  );
};

/* 4. 8 names = 14 bones (6 pairs + 2 singles, singles hidden for the quiz) */
export const V4: React.FC = () => {
  const t = useT();
  const pairs = FORDER.filter((b) => FCOUNT[b] === 2);
  const singles = FORDER.filter((b) => FCOUNT[b] === 1);
  const n = Math.round(8 + 6 * ramp(t, 12.8, 13.6));
  return (
    <Scene start={11.0} end={14.05} push={0.006}>
      <div style={center(0, pop(t, 11.05, 0.25))}>
        <Big size={86}>8 NAMES = <span style={{ color: C.red }}>{t < 11.7 ? "?" : 14}</span> BONES</Big>
      </div>
      <div style={{ position: "absolute", left: 20, top: 120, width: 820, height: 640, borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}`, ...pop(t, 11.1, 0.3) }}>
        <div style={{ position: "absolute", left: 40, top: 30, fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.matcha, letterSpacing: 3, opacity: ramp(t, 12.7, 12.9) }}>6 COME IN PAIRS · ×2</div>
        {pairs.map((b, i) => {
          const p2 = ramp(t, 12.85 + i * 0.12, 13.1 + i * 0.12);
          return (
            <div key={b} style={{ position: "absolute", left: 36 + (i % 2) * 392, top: 90 + Math.floor(i / 2) * 120, display: "flex", alignItems: "center", gap: 12, ...pop(t, 11.2 + i * 0.08, 0.25), transformOrigin: "0 50%" }}>
              <FChip b={b} size={66} />
              <div style={{ whiteSpace: "pre", fontFamily: FONT, fontWeight: 800, fontSize: b === "C" ? 24 : 32, color: C.forest, width: 200, lineHeight: 1.05 }}>{b === "C" ? "Inferior nasal\nconcha" : FNAME[b]}</div>
              <div style={{ opacity: p2, transform: `scale(${0.6 + 0.4 * p2})` }}><Pill size={28} bg={C.banana} color={C.forest}>×2</Pill></div>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 40, top: 470, width: 740, height: 3, background: C.line }} />
        <div style={{ position: "absolute", left: 40, top: 500, display: "flex", alignItems: "center", gap: 20, opacity: ramp(t, 13.3, 13.5) }}>
          {singles.map((b) => <FChip key={b} b={b} size={84} q on={0} />)}
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest }}>+ 2 singles… which?</div>
        </div>
      </div>
      <div style={center(800, pop(t, 12.85, 0.25))}>
        <Pill size={44} bg={C.forest}>6 × 2 + 2 = <span style={{ color: C.banana }}>{n}</span></Pill>
      </div>
    </Scene>
  );
};

/* 5. Quick test with 3-2-1 */
export const V5: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[16.05, 3], [16.68, 2], [17.32, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < 17.95) { n = v; n0 = s; } });
  return (
    <Scene start={14.05} end={17.95}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 14.1, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 110, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 64, lineHeight: 1.1, color: C.paper, ...pop(t, 14.75) }}>
          Which <span style={{ color: C.banana }}>2</span> facial bones are <span style={{ color: C.banana }}>SINGLE?</span>
        </div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 330, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
          {FORDER.map((b, i) => (
            <div key={b} style={{ ...pop(t, 15.0 + i * 0.07, 0.25) }}><FChip b={b} size={78} /></div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 470, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: "#B9D27A", opacity: ramp(t, 15.5, 15.7) }}>pause · say them out loud</div>
        {n !== null && (
          <div key={n} style={{ position: "absolute", left: 310, top: 560, width: 200, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 220, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 6. Answer on the real thing: Gray's 1918 Fig. 190 — vomer in the nasal septum, then the mandible */
export const V6: React.FC = () => {
  const t = useT();
  return (
    <Scene start={17.95} end={20.95} push={0.006}>
      <div style={center(0, pop(t, 18.0, 0.25))}>
        <Pill size={44} bg={C.banana} color={C.forest}>✓ VOMER + MANDIBLE</Pill>
      </div>
      <PlateBox74 src={P190} aspect={A190} x={30} y={100} w={800} h={770} a={17.95} b={20.95} from={[0.49, 0.64, 0.5]} to={[0.5, 0.8, 0.82]} ls={34}
        labels={[
          { x: 0.493, y: 0.655, text: "vomer\n(nasal septum)", t: 18.1, hot: true, ox: 40, oy: -120 },
          { x: 0.5, y: 0.93, text: "mandible = jaw", t: 19.85, hot: true, ox: 130, oy: -120 },
        ]} />
      <div style={{ position: "absolute", left: 6, top: 880, opacity: ramp(t, 18.6, 18.85) }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 16px 10px", fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.forest, whiteSpace: "nowrap" }}>
          <span style={{ color: C.matcha }}>Gray's 1918 plate:</span> “Maxillæ”, “Nasals” = plurals (pairs!)
        </div>
      </div>
    </Scene>
  );
};

/* 7. The only skull bone that moves: jaw opens on our diagram */
export const V7: React.FC = () => {
  const t = useT();
  const o = 0.5 - 0.5 * Math.cos(Math.max(0, t - 21.1) * 5.2);
  const k = cam(t, [[20.95, 0.62, 500, 800], [22.0, 0.66, 500, 820], [23.05, 0.66, 500, 820]]);
  return (
    <Scene start={20.95} end={23.05} push={0.004}>
      <Stage t={t} k={k} id="v7" lit={{ MD: 20.9 }} hot={["MD"]} open={t > 21.1 ? o : 0} h={700} top={210}>
        {(P) => (
          <>
            <Call t={t} t0={21.4} a={P([212, 830])} to={[150, 420]} text={"jaw joint\n(TMJ)"} size={34} />
          </>
        )}
      </Stage>
      <div style={center(20, pop(t, 21.0, 0.25))}>
        <Big size={64}>THE ONLY SKULL BONE</Big>
      </div>
      <div style={center(100, pop(t, 22.3, 0.25))}>
        <Pill size={50} bg={C.red}>THAT MOVES</Pill>
      </div>
    </Scene>
  );
};

/* 8. Save + cheat sheet */
export const V8: React.FC = () => {
  const t = useT();
  const s0 = 23.05;
  const b = ramp(t, s0 + 0.05, s0 + 0.4);
  return (
    <Scene start={s0} end={25.4}>
      <div style={{ position: "absolute", left: 40, top: 0, ...pop(t, s0 + 0.05) }}>
        <svg width={110} height={140} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 170, top: 6, ...pop(t, s0 + 0.1) }}>
        <Big size={100}>SAVE THIS</Big>
      </div>
      <div style={{ position: "absolute", left: 172, top: 112, ...pop(t, s0 + 0.3) }}>
        <Big size={40} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ position: "absolute", left: 30, top: 190, width: 800, height: 720, borderRadius: 40, background: C.card, border: `3px solid ${C.line}`, boxShadow: "0 18px 40px rgba(31,42,20,0.12)", ...pop(t, s0 + 0.15, 0.3) }}>
        <div style={{ position: "absolute", left: 36, top: 24, fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.matcha, letterSpacing: 2, whiteSpace: "nowrap" }}>14 FACIAL BONES · VIRGIL CAN NOT MAKE…</div>
        {FORDER.map((l, i) => (
          <div key={l} style={{ position: "absolute", left: 36, top: 78 + i * 78, display: "flex", alignItems: "center", gap: 20, opacity: ramp(t, s0 + 0.25 + i * 0.06, s0 + 0.5 + i * 0.06) }}>
            <FChip b={l} size={62} />
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.forest, whiteSpace: "nowrap", width: 420 }}>{FNAME[l]}</div>
            <Pill size={28} bg={FCOUNT[l] === 2 ? C.banana : C.red} color={FCOUNT[l] === 2 ? C.forest : C.paper}>{FCOUNT[l] === 2 ? "pair ×2" : "single"}</Pill>
          </div>
        ))}
      </div>
    </Scene>
  );
};

/* 9. End card (≤ 1.5 s) */
export const V9: React.FC = () => {
  const t = useT();
  const s0 = 25.4;
  return (
    <Scene start={s0} end={26.8}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, s0 + 0.02, 0.3) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.banana, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, s0 + 0.15, s0 + 0.4) }}>
          anatomy you'll
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
