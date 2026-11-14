import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, pop } from "./Scenes67";
import { PlateBox74 } from "./Scenes74";
import { ANCHOR, ICOL, IM, LCOL, LETTERS, M, MNAME, Section, Tongue } from "./Tongue80";

export const A1019 = 1420 / 1494;
export const PLATE = "plates/fig1019_tongue.png";
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* voice times (words.json) */
export const NT: Record<M, number> = { G: 5.68, H: 8.08, S: 10.36, P: 13.38 };
export const IT: Record<IM, number> = { SL: 16.05, IL: 16.45, TV: 16.9, VE: 17.3 };
export const INAME: Record<IM, string> = { SL: "superior longitudinal", IL: "inferior longitudinal", TV: "transverse", VE: "vertical" };
export const MN: Record<M, { word: string; from: string; does: string }> = {
  G: { word: "Go", from: "chin", does: "sticks it out" },
  H: { word: "Have", from: "hyoid", does: "pulls it down" },
  S: { word: "Some", from: "styloid", does: "up + back" },
  P: { word: "Pizza", from: "soft palate", does: "lifts the back" },
};

export const GChip: React.FC<{ l: M; size?: number; on?: number; hot?: boolean }> = ({ l, size = 64, on = 1, hot }) => (
  <div style={{ width: size, height: size, flex: `0 0 ${size}px`, borderRadius: size * 0.28, background: on > 0.5 ? LCOL[l] : "rgba(31,42,20,0.08)", border: `4px solid ${on > 0.5 ? C.forest : "rgba(31,42,20,0.25)"}`, color: on > 0.5 ? C.forest : "rgba(31,42,20,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.62, transform: `scale(${hot ? 1.16 : 1})`, boxShadow: hot ? `0 0 0 6px ${C.banana}` : "none" }}>
    {l}
  </div>
);

/* running strip: G H S P + n/8 muscles */
const Counter: React.FC<{ t: number; top?: number }> = ({ t, top = 10 }) => {
  const n = [...Object.values(NT), ...Object.values(IT)].filter((x) => t >= x).length;
  return (
    <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", alignItems: "center", gap: 12 }}>
      {LETTERS.map((l) => {
        const p = ramp(t, NT[l], NT[l] + 0.2);
        const hot = t >= NT[l] && t < NT[l] + 1.4;
        return <div key={l} style={{ transform: `scale(${1 + 0.25 * p * (1 - ramp(t, NT[l] + 0.2, NT[l] + 0.5))})` }}><GChip l={l} size={66} on={p} hot={hot} /></div>;
      })}
      <div style={{ marginLeft: 12, background: C.forest, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 36, borderRadius: 20, padding: "4px 18px 8px", textAlign: "center", whiteSpace: "nowrap" }}>{n}/8 muscles</div>
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
const Stage: React.FC<{ t: number; k: Kf; id: string; h?: number; top?: number; children?: (P: (m: [number, number]) => [number, number]) => React.ReactNode } & Omit<React.ComponentProps<typeof Tongue>, "t" | "w" | "id">> = ({ t, k, id, children, h = 800, top = 100, ...rest }) => {
  const [, s, cx, cy] = k;
  const u = (860 / 900) * s;
  const X0 = 430 - cx * u, Y0 = h / 2 - cy * u;
  const P = (m: [number, number]) => [X0 + m[0] * u, top + Y0 + m[1] * u] as [number, number];
  return (
    <>
      <div style={{ position: "absolute", left: 0, top, width: 860, height: h, overflow: "hidden", borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}` }}>
        <div style={{ position: "absolute", left: X0, top: Y0 }}>
          <Tongue t={t} w={860 * s} id={id} {...rest} />
        </div>
      </div>
      {children && children(P)}
    </>
  );
};
const Call: React.FC<{ t: number; t0: number; a: [number, number]; to: [number, number]; text: string; bg?: string; fg?: string; size?: number; t1?: number }> = ({ t, t0, a, to, text, bg = C.forest, fg = C.paper, size = 36, t1 }) => {
  const p = ramp(t, t0, t0 + 0.3) * (t1 ? 1 - ramp(t, t1, t1 + 0.2) : 1);
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
        <Pill size={size} bg={bg} color={fg}>{text}</Pill>
      </div>
    </>
  );
};
const Note1918: React.FC<{ t: number; t0: number; text: string; top?: number; left?: number; size?: number }> = ({ t, t0, text, top = 856, left = 30, size = 25 }) => (
  <div style={{ position: "absolute", left, top, opacity: ramp(t, t0, t0 + 0.25), transform: `scale(${0.8 + 0.2 * ramp(t, t0, t0 + 0.25)})`, transformOrigin: "0 0" }}>
    <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 16px 10px", fontFamily: FONT, fontWeight: 800, fontSize: size, color: C.forest, lineHeight: 1.2, boxShadow: "0 6px 0 rgba(31,42,20,0.08)", whiteSpace: "nowrap" }}>
      <span style={{ color: C.matcha }}>1918 atlas name:</span> {text}
    </div>
  </div>
);
const Tip: React.FC<{ t: number; t0: number; top: number; children: React.ReactNode; bg?: string; fg?: string; size?: number; t1?: number }> = ({ t, t0, top, children, bg = C.banana, fg = C.forest, size = 34, t1 }) =>
  t >= t0 - 0.05 && (!t1 || t < t1 + 0.2) ? (
    <div style={{ ...center(top), ...pop(t, t0, 0.25), opacity: ramp(t, t0, t0 + 0.2) * (t1 ? 1 - ramp(t, t1, t1 + 0.2) : 1) }}>
      <Pill size={size} bg={bg} color={fg}>{children}</Pill>
    </div>
  ) : null;

/* 1. Hook: Gray's 1918 Fig. 1019 visible from frame 0 + challenge */
export const V1: React.FC = () => {
  const t = useT();
  const eight = ramp(t, 1.36, 1.5) * (1 - ramp(t, 1.5, 1.75));
  return (
    <Scene start={-0.6} end={2.6} push={0.02}>
      <div style={center(4, pop(t, -0.4, 0.25))}>
        <Big size={86}>YOUR TONGUE IS</Big>
      </div>
      <div style={{ ...center(98, pop(t, -0.3, 0.25)) }}>
        <div style={{ transform: `scale(${1 + 0.12 * eight})` }}>
          <Big size={124} color={C.red}>8 MUSCLES</Big>
        </div>
      </div>
      <PlateBox74 src={PLATE} aspect={A1019} x={30} y={248} w={800} h={598} a={-0.6} b={2.6} from={[0.5, 0.5, 1.0]} to={[0.46, 0.52, 0.86]}
        labels={[{ x: 0.36, y: 0.37, text: "not 1 muscle!", t: 1.0, hot: true, ox: 60, oy: -110 }]} />
      <div style={center(870, pop(t, 0.1, 0.25))}>
        <Pill size={36} bg={C.forest}>Name them? · tongue muscles mnemonic</Pill>
      </div>
      <Stamp t0={1.85} text="NAME THEM" size={40} rot={-8} color={C.red} style={{ left: 36, top: 300, whiteSpace: "nowrap" }} />
    </Scene>
  );
};

/* pizza slice icon (own drawing) */
const Pizza: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M 10 18 Q 50 2 90 18 L 52 94 Z" fill="#F2D14E" stroke={C.forest} strokeWidth={5} strokeLinejoin="round" />
    <path d="M 10 18 Q 50 2 90 18 L 86 26 Q 50 12 14 26 Z" fill="#D9A05B" stroke={C.forest} strokeWidth={4} />
    {[[40, 36], [62, 40], [50, 60], [36, 52]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={7} fill={C.red} stroke={C.forest} strokeWidth={3} />)}
  </svg>
);

/* 2. Mnemonic card: Go Have Some Pizza */
export const V2: React.FC = () => {
  const t = useT();
  const WT: Record<M, number> = { G: 4.41, H: 4.54, S: 4.73, P: 4.93 };
  const pre: Record<M, string> = { G: "Genio", H: "Hyo", S: "Stylo", P: "Palato" };
  return (
    <Scene start={2.6} end={5.6} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 820, height: 840, borderRadius: 48, background: C.forest, ...pop(t, 2.62, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 50, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 8, color: C.banana }}>THE MNEMONIC</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 106, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.paper, ...pop(t, 2.9) }}>
          <span style={{ color: C.banana }}>4 extrinsic</span> = they MOVE it
        </div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 214, display: "flex", flexDirection: "column", gap: 22 }}>
          {LETTERS.map((l) => {
            const t0 = WT[l];
            const p = ramp(t, t0 - 0.08, t0 + 0.14);
            const sub = ramp(t, 5.0 + LETTERS.indexOf(l) * 0.08, 5.2 + LETTERS.indexOf(l) * 0.08);
            return (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 26, opacity: Math.max(0.15, p), transform: `translateX(${(1 - p) * -40}px)` }}>
                <GChip l={l} size={104} on={p} hot={t >= t0 && t < t0 + 0.4} />
                <div>
                  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 72, color: C.paper, lineHeight: 1 }}>
                    <span style={{ color: LCOL[l] }}>{MN[l].word[0]}</span>{MN[l].word.slice(1)}
                  </div>
                  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: "#B9D27A", marginTop: 4, opacity: sub }}>
                    {pre[l]}<span style={{ color: C.banana }}>glossus</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", right: 46, top: 280, ...pop(t, 4.93, 0.3), transformOrigin: "50% 50%" }}>
          <div style={{ transform: `rotate(${12 + 6 * Math.sin(t * 5)}deg)` }}><Pizza size={210} /></div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 752, display: "flex", justifyContent: "center", ...pop(t, 5.15, 0.25) }}>
          <div style={{ background: C.banana, borderRadius: 22, padding: "8px 26px 12px", fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.forest }}>glossus = tongue (Greek)</div>
        </div>
      </div>
    </Scene>
  );
};

/* 3. G: genioglossus — from the chin, sticks it out */
export const V3: React.FC = () => {
  const t = useT();
  const k = cam(t, [[5.6, 0.92, 450, 520], [6.0, 1.12, 360, 560], [8.0, 1.1, 340, 540]]);
  return (
    <Scene start={5.6} end={8.0} push={0.004}>
      <Stage t={t} k={k} id="v3" lit={{ G: NT.G }} hot={["G"]} dim={1} origins={{ CHIN: 6.6 }} arrows={{ G: 7.2 }}>
        {(P) => <Call t={t} t0={5.75} a={P(ANCHOR.G)} to={[560, 730]} text="genioglossus" bg={LCOL.G} fg={C.forest} size={46} />}
      </Stage>
      <Counter t={t} />
      <Tip t={t} t0={6.7} top={866} size={30} bg={C.forest} fg={C.paper}>genio = chin · the biggest, fan-shaped</Tip>
    </Scene>
  );
};

/* 4. H + S on Gray's 1918 Fig. 1019 with MODERN labels */
export const V4: React.FC = () => {
  const t = useT();
  return (
    <Scene start={8.0} end={13.3} push={0.006}>
      <PlateBox74 src={PLATE} aspect={A1019} x={30} y={100} w={800} h={740} a={8.0} b={13.3} from={[0.45, 0.6, 0.8]} to={[0.6, 0.45, 0.74]} ls={34}
        labels={[
          { x: 0.5, y: 0.6, text: "hyoglossus", t: 8.15, hot: true, ox: 120, oy: -150 },
          { x: 0.43, y: 0.79, text: "hyoid bone", t: 8.95, ox: -60, oy: 90 },
          { x: 0.6, y: 0.395, text: "styloglossus", t: 10.4, hot: true, ox: -120, oy: 140 },
          { x: 0.805, y: 0.24, text: "styloid process", t: 11.45, ox: -130, oy: -20 },
        ]} />
      <Counter t={t} />
      <Tip t={t} t0={9.44} t1={10.25} top={866} size={34} bg={LCOL.H}>⬇ pulls the tongue DOWN</Tip>
      <Tip t={t} t0={12.19} top={866} size={34} bg={LCOL.S}>⬈ pulls it UP + BACK</Tip>
    </Scene>
  );
};

/* 5. P: palatoglossus + all four together */
export const V5: React.FC = () => {
  const t = useT();
  const k = cam(t, [[13.3, 1.0, 450, 500], [13.7, 1.2, 520, 440], [15.65, 1.18, 510, 450]]);
  return (
    <Scene start={13.3} end={15.65} push={0.004}>
      <Stage t={t} k={k} id="v5" lit={{ G: 0, H: 0, S: 0, P: NT.P }} hot={["P"]} origins={{ PALATE: 14.35 }} arrows={{ P: 14.8 }}>
        {(P) => <Call t={t} t0={13.45} a={P(ANCHOR.P)} to={[620, 720]} text="palatoglossus" bg={LCOL.P} fg={C.forest} size={46} />}
      </Stage>
      <Counter t={t} />
      <Note1918 t={t} t0={13.9} text="“glossopalatinus” = palatoglossus" top={866} left={40} size={27} />
    </Scene>
  );
};

/* 6. 4 intrinsic muscles inside: change the shape */
export const V6: React.FC = () => {
  const t = useT();
  const sq = t > 17.45 ? Math.sin((t - 17.45) * 9) * ramp(t, 17.45, 17.7) : 0;
  const order: IM[] = ["SL", "IL", "TV", "VE"];
  return (
    <Scene start={15.65} end={18.35} push={0.004}>
      <div style={{ position: "absolute", left: 0, top: 100, width: 860, height: 800, borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}`, overflow: "hidden", ...pop(t, 15.68, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 860, top: 24, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 50, color: C.forest }}>
          + <span style={{ background: C.banana, borderRadius: 12, padding: "0 12px 4px" }}>4 intrinsic</span> = SHAPE
        </div>
        <div style={{ position: "absolute", left: 0, width: 860, top: 92, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 28, color: C.matcha }}>tongue cut across (coronal section)</div>
        <div style={{ position: "absolute", left: 140, top: 112 }}>
          <Section t={t} w={580} id="v6" lit={IT} hot={order.filter((k) => t >= IT[k] && t < IT[k] + 0.45)} squeeze={sq} />
        </div>
        <div style={{ position: "absolute", left: 30, width: 800, top: 590, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {order.map((k) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 12, ...pop(t, IT[k], 0.25), transformOrigin: "0 50%" }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: ICOL[k], border: `4px solid ${C.forest}`, flex: "0 0 34px" }} />
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 33, color: C.forest, whiteSpace: "nowrap" }}>{INAME[k]}</div>
            </div>
          ))}
        </div>
      </div>
      <Counter t={t} />
      <Tip t={t} t0={17.45} top={866} size={30} bg={C.forest} fg={C.paper}>no bone attachment · they change its shape</Tip>
    </Scene>
  );
};

/* 7. Quick test */
export const V7: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[21.4, 3], [22.04, 2], [22.68, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < 23.3) { n = v; n0 = s; } });
  return (
    <Scene start={18.35} end={23.3}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 820, height: 850, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 18.4, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 106, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 54, lineHeight: 1.12, color: C.paper, ...pop(t, 19.15) }}>
          Which one <span style={{ color: "#F09A8C" }}>SKIPS</span> the hypoglossal nerve (CN XII)?
        </div>
        <div style={{ position: "absolute", left: 30, top: 330, width: 380, height: 480, borderRadius: 30, background: C.paper, overflow: "hidden", ...pop(t, 19.6, 0.3) }}>
          <div style={{ position: "absolute", left: 190 - 420 * 0.62 * (860 / 900), top: 240 - 520 * 0.62 * (860 / 900) }}>
            <Tongue t={t} w={860 * 0.62} id="v7" lit={{ G: 0, H: 0, S: 0, P: 0 }} mark={{ G: "A", H: "B", S: "C", P: "D" }} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 436, width: 370, top: 340, display: "flex", flexDirection: "column", gap: 20 }}>
          {LETTERS.map((l, i) => (
            <div key={l} style={{ ...pop(t, 19.9 + i * 0.14), display: "flex", alignItems: "center", gap: 12, transformOrigin: "0 50%" }}>
              <div style={{ width: 56, height: 56, flex: "0 0 56px", borderRadius: 16, background: LCOL[l], color: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 32, border: `4px solid ${C.paper}` }}>{"ABCD"[i]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.paper, whiteSpace: "nowrap" }}>{MNAME[l]}</div>
            </div>
          ))}
        </div>
        {n !== null && (
          <div key={n} style={{ position: "absolute", left: 520, top: 630, width: 200, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 170, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 8. Answer: palatoglossus = vagus nerve */
export const V8: React.FC = () => {
  const t = useT();
  const k: Kf = [0, 1.0, 470, 520];
  return (
    <Scene start={23.3} end={25.6} push={0.006}>
      <Stage t={t} k={k} id="v8" lit={{ G: 0, H: 0, S: 0, P: 0 }} hot={["P"]} nerve={ramp(t, 24.6, 24.9)} />
      <div style={center(24, pop(t, 23.36, 0.25))}>
        <Pill size={44} bg={C.red}>D ✓ PALATOGLOSSUS · vagus (CN X)</Pill>
      </div>
      <Tip t={t} t0={25.0} top={866} size={30} bg={C.forest} fg={C.paper}>the other 7 = hypoglossal (CN XII)</Tip>
    </Scene>
  );
};

/* 9. Save + cheat sheet */
export const V9: React.FC = () => {
  const t = useT();
  const s0 = 25.6;
  const b = ramp(t, s0 + 0.05, s0 + 0.4);
  return (
    <Scene start={s0} end={27.9}>
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
      <div style={{ position: "absolute", left: 30, top: 196, width: 800, height: 700, borderRadius: 40, background: C.card, border: `3px solid ${C.line}`, boxShadow: "0 18px 40px rgba(31,42,20,0.12)", ...pop(t, s0 + 0.15, 0.3) }}>
        <div style={{ position: "absolute", left: 36, top: 24, fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.matcha, letterSpacing: 2 }}>TONGUE = 8 MUSCLES · GO HAVE SOME PIZZA</div>
        {LETTERS.map((l, i) => (
          <div key={l} style={{ position: "absolute", left: 36, top: 82 + i * 112, display: "flex", alignItems: "center", gap: 22, opacity: ramp(t, s0 + 0.3 + i * 0.08, s0 + 0.55 + i * 0.08) }}>
            <GChip l={l} size={80} />
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.forest, whiteSpace: "nowrap", lineHeight: 1.05 }}>{MNAME[l]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 28, color: C.matcha, whiteSpace: "nowrap", marginTop: 4 }}>from the {MN[l].from} → {MN[l].does}</div>
            </div>
          </div>
        ))}
        <div style={{ position: "absolute", left: 36, top: 540, width: 730, fontFamily: FONT, fontWeight: 800, fontSize: 27, color: C.forest, lineHeight: 1.5, opacity: ramp(t, s0 + 0.7, s0 + 0.9) }}>
          <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px" }}>+4 intrinsic</span> 2 longitudinal, transverse, vertical
          <br />
          <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px" }}>nerve</span> all CN XII except palatoglossus (CN X)
        </div>
      </div>
    </Scene>
  );
};

/* 10. End card (≤ 1.5 s) */
export const V10: React.FC = () => {
  const t = useT();
  const s0 = 27.9;
  return (
    <Scene start={s0} end={29.2}>
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
