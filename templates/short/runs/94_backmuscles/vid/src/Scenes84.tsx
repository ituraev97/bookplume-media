import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, pop } from "./Scenes67";
import { PlateBox74 } from "./Scenes74";
import { ANCHOR, P, PCOL, PNAME, PS, PSWORD, Sternum } from "./Sternum84";

export const A112 = 1636 / 2100;
export const A115 = 2060 / 2501;
export const A117 = 1007 / 1602;
export const P112 = "plates/fig112_thorax.png";
export const P115 = "plates/fig115_sternum.png";
export const P117 = "plates/fig117_lateral.png";
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

export const LET: Record<P, string> = { M: "H", B: "B", X: "T" };
export const NOTE: Record<P, string> = {
  M: "Latin “handle” · clavicles + 1st ribs join",
  B: "1918 name gladiolus = “little sword”",
  X: "Greek xiphos = sword · the tip",
};

export const Chip: React.FC<{ p: P; size?: number; on?: number; hot?: boolean }> = ({ p, size = 64, on = 1, hot }) => (
  <div style={{ width: size, height: size, flex: `0 0 ${size}px`, borderRadius: size * 0.28, background: on > 0.5 ? PCOL[p] : "rgba(31,42,20,0.08)", border: `4px solid ${on > 0.5 ? C.forest : "rgba(31,42,20,0.25)"}`, color: on > 0.5 ? C.paper : "rgba(31,42,20,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.62, transform: `scale(${hot ? 1.16 : 1})`, boxShadow: hot ? `0 0 0 6px ${C.banana}` : "none" }}>
    {LET[p]}
  </div>
);

/* voice times (words.json) */
const PT: Record<P, number> = { M: 6.67, B: 10.87, X: 14.18 };
const Counter: React.FC<{ t: number; top?: number }> = ({ t, top = 10 }) => {
  const n = PS.filter((p) => t >= PT[p]).length;
  return (
    <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", alignItems: "center", gap: 22 }}>
      {PS.map((p) => {
        const k = ramp(t, PT[p], PT[p] + 0.2);
        const hot = t >= PT[p] && t < PT[p] + 1.2;
        return (
          <div key={p} style={{ display: "flex", alignItems: "center", gap: 8, transform: `scale(${1 + 0.2 * k * (1 - ramp(t, PT[p] + 0.2, PT[p] + 0.5))})` }}>
            <Chip p={p} size={60} on={k} hot={hot} />
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: k > 0.5 ? C.forest : "rgba(31,42,20,0.35)" }}>{PSWORD[p]}</div>
          </div>
        );
      })}
      <div style={{ marginLeft: 10, background: C.forest, color: C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 32, borderRadius: 20, padding: "4px 16px 8px", whiteSpace: "nowrap" }}>{n}/3</div>
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
const Stage: React.FC<{ t: number; k: Kf; id: string; h?: number; top?: number; credit?: string; children?: (P: (m: [number, number]) => [number, number]) => React.ReactNode } & Omit<React.ComponentProps<typeof Sternum>, "t" | "w" | "id">> = ({ t, k, id, children, h = 740, top = 100, credit = "sternum, front view · diagram: Book Plume", ...rest }) => {
  const [, s, cx, cy] = k;
  const X0 = 430 - cx * s, Y0 = h / 2 - cy * s;
  const Pm = (m: [number, number]) => [X0 + m[0] * s, top + Y0 + m[1] * s] as [number, number];
  return (
    <>
      <div style={{ position: "absolute", left: 0, top, width: 860, height: h, overflow: "hidden", borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}` }}>
        <div style={{ position: "absolute", left: X0, top: Y0 }}>
          <Sternum t={t} w={860 * s} id={id} {...rest} />
        </div>
        <div style={{ position: "absolute", right: 18, bottom: 12, fontFamily: FONT, fontWeight: 700, fontSize: 19, color: C.forest, opacity: 0.6, background: "rgba(255,254,246,0.85)", padding: "2px 10px", borderRadius: 8 }}>{credit}</div>
      </div>
      {children && children(Pm)}
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
const Note1918: React.FC<{ t: number; t0: number; lines: React.ReactNode; top: number; left: number; size?: number }> = ({ t, t0, lines, top, left, size = 25 }) => (
  <div style={{ position: "absolute", left, top, opacity: ramp(t, t0, t0 + 0.25), transform: `scale(${0.8 + 0.2 * ramp(t, t0, t0 + 0.25)})`, transformOrigin: "0 0" }}>
    <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 16px 10px", fontFamily: FONT, fontWeight: 800, fontSize: size, color: C.forest, lineHeight: 1.25, boxShadow: "0 6px 0 rgba(31,42,20,0.08)", whiteSpace: "nowrap" }}>
      <span style={{ color: C.matcha }}>1918 atlas name:</span>
      <br />
      {lines}
    </div>
  </div>
);
const Tip: React.FC<{ t: number; t0: number; top: number; children: React.ReactNode; bg?: string; fg?: string; size?: number; t1?: number }> = ({ t, t0, top, children, bg = C.banana, fg = C.forest, size = 34, t1 }) =>
  t >= t0 - 0.05 && (!t1 || t < t1 + 0.2) ? (
    <div style={{ ...center(top), ...pop(t, t0, 0.25), opacity: ramp(t, t0, t0 + 0.2) * (t1 ? 1 - ramp(t, t1, t1 + 0.2) : 1) }}>
      <Pill size={size} bg={bg} color={fg}>{children}</Pill>
    </div>
  ) : null;

/* little sword icon (own drawing) */
export const SwordIcon: React.FC<{ size: number; rot?: number }> = ({ size, rot = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" style={{ transform: `rotate(${rot}deg)` }}>
    <g stroke={C.forest} strokeWidth={5} strokeLinejoin="round">
      <circle cx={60} cy={12} r={7} fill={PCOL.M} />
      <rect x={54} y={18} width={12} height={20} rx={4} fill={PCOL.M} />
      <rect x={36} y={38} width={48} height={8} rx={4} fill={C.banana} />
      <path d="M 52 46 L 68 46 L 68 92 L 52 92 Z" fill={PCOL.B} />
      <path d="M 52 92 L 68 92 L 60 114 Z" fill={PCOL.X} />
    </g>
  </svg>
);

/* 1. Hook: Gray's 1918 Fig. 112 visible from frame 0 + challenge */
export const V1: React.FC = () => {
  const t = useT();
  const sw = ramp(t, 1.2, 1.4) * (1 - ramp(t, 1.4, 1.7));
  return (
    <Scene start={-0.6} end={3.5} push={0.02}>
      <div style={center(26, pop(t, -0.4, 0.25))}>
        <Big size={88}>YOUR BREASTBONE</Big>
      </div>
      <div style={center(128, pop(t, -0.3, 0.25))}>
        <div style={{ transform: `scale(${1 + 0.12 * sw})`, display: "flex", alignItems: "center", gap: 18 }}>
          <Big size={124} color={C.red}>IS A SWORD</Big>
          <SwordIcon size={118} rot={35} />
        </div>
      </div>
      <PlateBox74 src={P112} aspect={A112} x={30} y={280} w={800} h={572} a={-0.6} b={3.5} from={[0.47, 0.42, 0.98]} to={[0.47, 0.41, 0.86]}
        labels={[
          { x: 0.47, y: 0.2, text: "handle", t: 1.3, ox: 160, oy: 25 },
          { x: 0.47, y: 0.42, text: "blade", t: 1.5, ox: 160, oy: 10 },
          { x: 0.47, y: 0.62, text: "tip", t: 1.7, ox: 150, oy: -30 },
          { x: 0.47, y: 0.33, text: "sternum", t: 0.4, hot: true, ox: -170, oy: -10 },
        ]} />
      <div style={center(872, pop(t, 0.1, 0.25))}>
        <Pill size={36} bg={C.forest}>Name its 3 parts? · sternum mnemonic</Pill>
      </div>
      <Stamp t0={2.5} text="NAME ALL 3" size={40} rot={-8} color={C.red} style={{ left: 36, top: 316, whiteSpace: "nowrap" }} />
    </Scene>
  );
};

/* 2. Mnemonic card: handle · blade · tip */
export const V2: React.FC = () => {
  const t = useT();
  const WT: Record<P, number> = { M: 4.67, B: 5.05, X: 5.43 };
  return (
    <Scene start={3.5} end={5.95} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 820, height: 850, borderRadius: 48, background: C.forest, ...pop(t, 3.52, 0.22) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, letterSpacing: 8, color: C.banana }}>THE SWORD TRICK</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 100, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.paper, ...pop(t, 3.62) }}>
          sternum mnemonic · <span style={{ color: C.banana }}>3 parts</span>
        </div>
        <div style={{ position: "absolute", left: 40, width: 560, top: 214, display: "flex", flexDirection: "column", gap: 40 }}>
          {PS.map((p, i) => {
            const t0 = WT[p];
            const k = ramp(t, t0 - 0.08, t0 + 0.12);
            const sub = ramp(t, 5.55 + i * 0.08, 5.75 + i * 0.08);
            return (
              <div key={p} style={{ display: "flex", alignItems: "center", gap: 24, opacity: Math.max(0.15, k), transform: `translateX(${(1 - k) * -40}px)` }}>
                <Chip p={p} size={110} on={k} hot={t >= t0 && t < t0 + 0.3} />
                <div>
                  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 84, color: C.paper, lineHeight: 1 }}>
                    <span style={{ color: C.banana }}>{PSWORD[p][0]}</span>{PSWORD[p].slice(1)}
                  </div>
                  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#B9D27A", marginTop: 4, opacity: sub, whiteSpace: "nowrap" }}>= {PNAME[p]}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", right: 30, top: 190, width: 210, height: 620, ...pop(t, 3.7, 0.3) }}>
          <svg width={210} height={620} viewBox="0 0 210 620">
            <g stroke={C.paper} strokeWidth={6} strokeLinejoin="round">
              <circle cx={105} cy={34} r={22} fill={PCOL.M} opacity={ramp(t, 4.6, 4.8) * 0.8 + 0.2} />
              <rect x={88} y={56} width={34} height={86} rx={10} fill={PCOL.M} opacity={ramp(t, 4.6, 4.8) * 0.8 + 0.2} />
              <rect x={30} y={142} width={150} height={24} rx={12} fill={C.banana} opacity={ramp(t, 4.6, 4.8) * 0.8 + 0.2} />
              <path d="M 82 166 L 128 166 L 132 470 L 78 470 Z" fill={PCOL.B} opacity={ramp(t, 5.0, 5.2) * 0.8 + 0.2} />
              <path d="M 78 470 L 132 470 L 105 600 Z" fill={PCOL.X} opacity={ramp(t, 5.38, 5.58) * 0.8 + 0.2} />
            </g>
          </svg>
        </div>
      </div>
    </Scene>
  );
};

/* 3. H: manubrium = handle; collarbones join it */
export const V3: React.FC = () => {
  const t = useT();
  const k = cam(t, [[5.95, 0.9, 430, 430], [6.4, 1.35, 430, 230], [8.6, 1.35, 430, 220], [9.0, 1.05, 430, 250], [10.15, 1.05, 430, 260]]);
  return (
    <Scene start={5.95} end={10.15} push={0.004}>
      <Stage t={t} k={k} id="v3" lit={{ M: PT.M }} hot={t < 8.8 ? ["M"] : []} dim={0.35} sword={[ramp(t, 7.55, 7.9), 0, 0]} clav={ramp(t, 8.85, 9.1)}>
        {(Pm) => (
          <>
            <Call t={t} t0={6.75} t1={8.7} a={Pm(ANCHOR.M)} to={[230, 760]} text="manubrium" bg={PCOL.M} size={48} />
            <Call t={t} t0={8.9} a={Pm([640, 108])} to={[620, 690]} text="clavicle (collarbone)" bg={C.forest} size={36} />
            <Call t={t} t0={9.3} a={Pm([700, 216])} to={[250, 780]} text="1st rib" bg={C.forest} size={34} />
          </>
        )}
      </Stage>
      <Counter t={t} />
      <Tip t={t} t0={7.55} t1={8.8} top={876} size={34}>manubrium = Latin “handle”</Tip>
      <Tip t={t} t0={8.95} top={876} size={32} bg={C.forest} fg={C.paper}>clavicles join the manubrium</Tip>
    </Scene>
  );
};

/* 4. B: body = blade, Gray's 1918 Fig. 115 (“2nd piece or body”; old name gladiolus) */
export const V4: React.FC = () => {
  const t = useT();
  return (
    <Scene start={10.15} end={13.5} push={0.006}>
      <PlateBox74 src={P115} aspect={A115} x={30} y={100} w={800} h={740} a={10.15} b={13.5} from={[0.56, 0.34, 0.94]} to={[0.57, 0.34, 0.86]} ls={32}
        labels={[
          { x: 0.565, y: 0.13, text: "manubrium", t: 10.3, ox: -190, oy: -20 },
          { x: 0.56, y: 0.33, text: "body", t: 10.87, hot: true, ox: -200, oy: 40 },
          { x: 0.565, y: 0.59, text: "xiphoid", t: 11.3, ox: -180, oy: -30 },
        ]} />
      <Note1918 t={t} t0={11.9} left={480} top={600} lines={<>“2nd piece or body”<br />= gladiolus</>} />
      <Counter t={t} />
      <Tip t={t} t0={12.7} top={866} size={34}>gladiolus = “little sword” (Latin)</Tip>
    </Scene>
  );
};

/* 5. T: xiphoid process = tip, then the whole sword */
export const V5: React.FC = () => {
  const t = useT();
  const k = cam(t, [[13.5, 1.0, 430, 470], [13.9, 1.55, 430, 690], [15.6, 1.55, 430, 690], [16.0, 0.8, 430, 440], [16.85, 0.8, 430, 440]]);
  const all = ramp(t, 15.85, 16.15);
  return (
    <Scene start={13.5} end={16.85} push={0.004}>
      <Stage t={t} k={k} id="v5" lit={{ M: all > 0 ? 15.85 : undefined, B: all > 0 ? 15.95 : undefined, X: PT.X }} hot={all > 0.5 ? [] : ["X"]} dim={0.4 * (1 - all)} sword={[all, all, Math.max(all, ramp(t, 15.4, 15.7))]}>
        {(Pm) => (
          <>
            <Call t={t} t0={14.25} t1={15.75} a={Pm(ANCHOR.X)} to={[230, 260]} text="xiphoid process" bg={PCOL.X} size={44} />
          </>
        )}
      </Stage>
      <Counter t={t} />
      <Tip t={t} t0={15.4} t1={15.8} top={876} size={34}>xiphoid = Greek “sword-shaped”</Tip>
      <Tip t={t} t0={15.95} top={876} size={34} bg={C.forest} fg={C.paper}>handle + blade + tip = sternum</Tip>
    </Scene>
  );
};

/* 6. Quick test */
export const V6: React.FC = () => {
  const t = useT();
  const cd: [number, number][] = [[20.31, 3], [20.95, 2], [21.59, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < 22.2) { n = v; n0 = s; } });
  const OPT = ["1st rib", "2nd rib", "3rd rib", "7th rib"];
  return (
    <Scene start={16.85} end={22.2}>
      <div style={{ position: "absolute", left: 20, top: 40, width: 820, height: 850, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, 16.9, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 40, width: 740, top: 106, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 52, lineHeight: 1.12, color: C.paper, ...pop(t, 17.7) }}>
          Handle meets blade: <span style={{ color: C.banana }}>WHICH RIB JOINS?</span>
        </div>
        <div style={{ position: "absolute", left: 30, top: 270, width: 400, height: 540, borderRadius: 30, background: C.paper, overflow: "hidden", ...pop(t, 18.0, 0.3) }}>
          <div style={{ position: "absolute", left: 200 - 430 * 0.95, top: 250 - 330 * 0.95 }}>
            <Sternum t={t} w={860 * 0.95} id="v6" lit={{ M: 0, B: 0 }} q={ramp(t, 18.4, 18.7)} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 460, width: 340, top: 320, display: "flex", flexDirection: "column", gap: 26 }}>
          {OPT.map((o, i) => (
            <div key={o} style={{ ...pop(t, 19.1 + i * 0.12), display: "flex", alignItems: "center", gap: 14, transformOrigin: "0 50%" }}>
              <div style={{ width: 60, height: 60, flex: "0 0 60px", borderRadius: 16, background: C.matcha, color: C.paper, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, border: `4px solid ${C.paper}` }}>{"ABCD"[i]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.paper, whiteSpace: "nowrap" }}>{o}</div>
            </div>
          ))}
        </div>
        {n !== null && (
          <div key={n} style={{ position: "absolute", left: 540, top: 640, width: 200, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 170, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 7. Answer: 2nd rib at the sternal angle (own diagram) */
export const V7: React.FC = () => {
  const t = useT();
  const k = cam(t, [[22.2, 1.0, 430, 400], [22.6, 1.3, 470, 300], [23.95, 1.3, 470, 300]]);
  return (
    <Scene start={22.2} end={23.95} push={0.004}>
      <Stage t={t} k={k} id="v7" lit={{ M: 0, B: 0 }} dim={0.3} rib2={ramp(t, 22.45, 22.7)} angle={ramp(t, 23.3, 23.5)} top={110} h={740}>
        {(Pm) => (
          <>
            <Call t={t} t0={22.5} a={Pm([600, 306])} to={[620, 640]} text="2nd rib" bg={C.red} size={46} />
            <Call t={t} t0={23.35} a={Pm([380, 293])} to={[250, 160]} text="the ridge" bg={C.forest} size={38} />
          </>
        )}
      </Stage>
      <div style={center(18, pop(t, 22.25, 0.25))}>
        <Pill size={46} bg={C.red}>B ✓ THE 2nd RIB</Pill>
      </div>
    </Scene>
  );
};

/* 7b. Sternal angle on Gray's 1918 Fig. 117 (side view) */
export const V7b: React.FC = () => {
  const t = useT();
  return (
    <Scene start={23.95} end={25.1} push={0.006}>
      <PlateBox74 src={P117} aspect={A117} x={30} y={110} w={800} h={740} a={23.95} b={25.1} from={[0.5, 0.32, 1.0]} to={[0.48, 0.31, 0.94]} ls={32}
        labels={[{ x: 0.255, y: 0.295, text: "2nd rib\njoins here", t: 24.1, hot: true, ox: -20, oy: 150 }]} />
      <div style={center(18, pop(t, 23.98, 0.25))}>
        <Pill size={46} bg={C.forest}>STERNAL ANGLE</Pill>
      </div>
      <Tip t={t} t0={24.35} top={870} size={32}>side view: the sword “bends” here</Tip>
    </Scene>
  );
};

/* 7c. Count ribs from the angle */
export const V7c: React.FC = () => {
  const t = useT();
  const k = cam(t, [[25.1, 1.0, 470, 400], [26.45, 1.05, 480, 410]]);
  const cnt = 1 + 4 * ramp(t, 25.25, 26.15);
  return (
    <Scene start={25.1} end={26.45} push={0.004}>
      <Stage t={t} k={k} id="v7c" lit={{ M: 0, B: 0 }} dim={0.3} rib2={1} angle={1} count={cnt} top={110} h={740} />
      <div style={center(18, pop(t, 25.12, 0.25))}>
        <Pill size={42} bg={C.forest}>start counting ribs here ↓</Pill>
      </div>
      <Tip t={t} t0={25.4} top={870} size={32}>sternal angle = 2nd rib · T4/T5 level</Tip>
    </Scene>
  );
};

/* 8. Save + cheat sheet */
export const V8: React.FC = () => {
  const t = useT();
  const s0 = 26.45;
  const b = ramp(t, s0 + 0.05, s0 + 0.4);
  return (
    <Scene start={s0} end={28.65}>
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
      <div style={{ position: "absolute", left: 30, top: 196, width: 800, height: 630, borderRadius: 40, background: C.card, border: `3px solid ${C.line}`, boxShadow: "0 18px 40px rgba(31,42,20,0.12)", ...pop(t, s0 + 0.15, 0.3) }}>
        <div style={{ position: "absolute", left: 36, top: 26, fontFamily: FONT, fontWeight: 800, fontSize: 25, color: C.matcha, letterSpacing: 0.5, whiteSpace: "nowrap" }}>STERNUM = A SWORD · HANDLE, BLADE, TIP</div>
        {PS.map((p, i) => (
          <div key={p} style={{ position: "absolute", left: 36, top: 86 + i * 128, display: "flex", alignItems: "center", gap: 22, opacity: ramp(t, s0 + 0.3 + i * 0.08, s0 + 0.55 + i * 0.08) }}>
            <Chip p={p} size={84} />
            <div>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 42, color: C.forest, whiteSpace: "nowrap", lineHeight: 1.05 }}>{PSWORD[p]} = {PNAME[p]}</div>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 27, color: C.matcha, whiteSpace: "nowrap", marginTop: 4 }}>{NOTE[p]}</div>
            </div>
          </div>
        ))}
        <div style={{ position: "absolute", left: 36, top: 500, width: 730, fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.forest, lineHeight: 1.55, opacity: ramp(t, s0 + 0.7, s0 + 0.9) }}>
          <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px" }}>sternal angle</span> handle meets blade = 2nd rib
          <br />
          <span style={{ background: C.banana, borderRadius: 8, padding: "0 8px 2px" }}>level</span> T4/T5 disc · count ribs from here
        </div>
      </div>
    </Scene>
  );
};

/* 9. End card (≤ 1.5 s) */
export const V9: React.FC = () => {
  const t = useT();
  const s0 = 28.65;
  return (
    <Scene start={s0} end={29.85}>
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
