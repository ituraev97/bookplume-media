import React from "react";
import { Img, staticFile } from "remotion";
import { C, FONT, Pill, Scene, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, pop } from "./Scenes67";

export const P513 = "plates/ica513.png";
export const A513 = 1803 / 2515;
export const P519 = "plates/circle519.png";
export const A519 = 940 / 1486;
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* A VIP'S COMMA (Kenhub + Radiopaedia): 10 branches of the internal carotid artery */
export type Id = "AC" | "V" | "I" | "P" | "S" | "C" | "O" | "MH" | "MC" | "AA";
export const IDS: Id[] = ["AC", "V", "I", "P", "S", "C", "O", "MH", "MC", "AA"];
export const LET: Record<Id, string> = { AC: "A", V: "V", I: "I", P: "P", S: "S", C: "C", O: "O", MH: "M", MC: "M", AA: "A" };
/* voice times (words.json): the letter */
export const TF: Record<Id, number> = { AC: 5.92, V: 7.25, I: 8.41, P: 9.92, S: 11.66, C: 13.42, O: 14.88, MH: 15.87, MC: 17.71, AA: 18.97 };
export const TM: Record<Id, number> = { AC: 6.04, V: 7.39, I: 8.55, P: 10.2, S: 11.81, C: 13.56, O: 15.1, MH: 16.0, MC: 17.97, AA: 19.16 };
/* mnemonic card letter reveals */
const MT: number[] = [4.46, 4.58, 4.84, 4.96, 5.12, 5.24, 5.32, 5.4, 5.48, 5.56];
export const COL: Record<Id, string> = { AC: "#C9483C", V: "#2F6B8F", I: "#7B4A9A", P: "#D9772B", S: "#5C7A2F", C: "#B5476B", O: "#2A8C82", MH: "#8A5A2B", MC: "#3558A8", AA: "#B8860B" };
export const NAME: Record<Id, string[]> = {
  AC: ["Anterior", "choroidal"],
  V: ["Vidian artery"],
  I: ["Inferolateral", "trunk"],
  P: ["Posterior", "communicating"],
  S: ["Superior", "hypophyseal"],
  C: ["Caroticotympanic"],
  O: ["Ophthalmic"],
  MH: ["Meningohypophyseal", "trunk"],
  MC: ["Middle cerebral"],
  AA: ["Anterior cerebral"],
};
export const SEG: Record<Id, string> = {
  AC: "C7 · communicating segment",
  V: "C2 · petrous segment",
  I: "C4 · cavernous segment",
  P: "C7 · communicating segment",
  S: "C6 · ophthalmic segment",
  C: "C2 · petrous segment",
  O: "C6 · ophthalmic segment",
  MH: "C4 · cavernous segment",
  MC: "terminal branch · C7",
  AA: "terminal branch · C7",
};
export const SHORT: Record<Id, string> = {
  AC: "Anterior choroidal", V: "Vidian artery", I: "Inferolateral trunk", P: "Posterior communicating", S: "Superior hypophyseal",
  C: "Caroticotympanic", O: "Ophthalmic", MH: "Meningohypophyseal trunk", MC: "Middle cerebral", AA: "Anterior cerebral",
};
export const SEGS: Record<Id, string> = { AC: "C7", V: "C2", I: "C4", P: "C7", S: "C6", C: "C2", O: "C6", MH: "C4", MC: "C7 end", AA: "C7 end" };
const T_HOLD = 20.4;

export const Chip: React.FC<{ id: Id; size?: number; on?: number; hot?: boolean; round?: boolean }> = ({ id, size = 70, on = 1, hot, round }) => (
  <div style={{ width: size, height: size, flex: `0 0 ${size}px`, borderRadius: round ? size / 2 : size * 0.28, background: on > 0.5 ? COL[id] : "rgba(31,42,20,0.08)", border: `4px solid ${on > 0.5 ? C.forest : "rgba(31,42,20,0.25)"}`, color: on > 0.5 ? C.paper : "rgba(31,42,20,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.6, transform: `scale(${hot ? 1.16 : 1})`, boxShadow: hot ? `0 0 0 6px ${C.banana}` : "none", boxSizing: "border-box", lineHeight: 1 }}>
    {LET[id]}
  </div>
);

const cur = (t: number): Id | null => {
  let c: Id | null = null;
  IDS.forEach((id) => { if (t >= TF[id] - 0.05) c = id; });
  return c;
};

const Strip: React.FC<{ t: number; top?: number }> = ({ t, top = 0 }) => {
  const L = cur(t);
  return (
    <div style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
      {IDS.map((id) => {
        const p = ramp(t, TF[id] - 0.05, TF[id] + 0.12);
        const hot = L === id;
        return (
          <div key={id} style={{ transform: `scale(${1 + 0.2 * p * (1 - ramp(t, TF[id] + 0.12, TF[id] + 0.4))})` }}>
            <Chip id={id} size={74} on={p} hot={hot} />
          </div>
        );
      })}
    </div>
  );
};

/* ---------- own schematic (lateral view, not to scale) ---------- */
type Pt = [number, number];
const WAY: Pt[] = [[130, 650], [130, 540], [150, 468], [225, 432], [310, 424], [345, 392], [372, 340], [430, 300], [505, 310], [552, 282], [556, 222], [528, 176], [478, 148]];
const catmull = (pts: Pt[]): string => {
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${p2[0]} ${p2[1]}`;
  }
  return d;
};
const MAIN = catmull(WAY);
const ACA = catmull([[478, 148], [520, 108], [590, 76], [660, 62]]);
const MCA = catmull([[478, 148], [420, 114], [350, 92], [270, 96]]);
/* branch stubs: from a point on the artery to the end dot (draw order = reveal) */
const STUB: Partial<Record<Id, { a: Pt; b: Pt; lab: Pt; anchor: "start" | "end" }>> = {
  AC: { a: [500, 160], b: [420, 168], lab: [410, 168], anchor: "end" },
  V: { a: [322, 426], b: [336, 500], lab: [344, 520], anchor: "start" },
  I: { a: [472, 310], b: [484, 384], lab: [494, 404], anchor: "start" },
  P: { a: [536, 200], b: [424, 240], lab: [414, 246], anchor: "end" },
  S: { a: [554, 262], b: [640, 300], lab: [652, 318], anchor: "start" },
  C: { a: [188, 442], b: [158, 388], lab: [148, 366], anchor: "end" },
  O: { a: [553, 232], b: [664, 206], lab: [676, 206], anchor: "start" },
  MH: { a: [408, 312], b: [346, 282], lab: [336, 268], anchor: "end" },
};
const SEGTAG: { n: string; p: Pt }[] = [
  { n: "C1", p: [80, 570] }, { n: "C2", p: [230, 484] }, { n: "C3", p: [290, 372] }, { n: "C4", p: [404, 386] },
  { n: "C5", p: [612, 360] }, { n: "C6", p: [496, 262] }, { n: "C7", p: [584, 150] },
];

const Diagram: React.FC<{ t: number; at: { x: number; y: number; w: number; h: number } }> = ({ t, at }) => {
  const id = cur(t);
  const pEnd = ramp(t, T_HOLD - 0.4, T_HOLD);
  void pEnd;
  return (
    <>
      <div style={{ position: "absolute", left: at.x, top: at.y, width: at.w, height: at.h, overflow: "hidden", borderRadius: 40, background: C.card, boxShadow: `0 0 0 5px ${C.line}, 0 20px 44px rgba(31,42,20,0.18)` }}>
        <svg width={at.w} height={at.h} viewBox="0 0 860 640" style={{ position: "absolute", left: 0, top: 0 }}>
          <g transform="translate(60 0)">
          <path d={MAIN} fill="none" stroke={C.forest} strokeWidth={32} strokeLinecap="round" strokeLinejoin="round" opacity={0.95} />
          <path d={MAIN} fill="none" stroke="#C94A3E" strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
          <path d={ACA} fill="none" stroke={C.forest} strokeWidth={22} strokeLinecap="round" />
          <path d={ACA} fill="none" stroke="#C94A3E" strokeWidth={13} strokeLinecap="round" />
          <path d={MCA} fill="none" stroke={C.forest} strokeWidth={22} strokeLinecap="round" />
          <path d={MCA} fill="none" stroke="#C94A3E" strokeWidth={13} strokeLinecap="round" />
          <text x={684} y={70} fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.matcha}>ACA</text>
          <text x={190} y={104} fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.matcha}>MCA</text>
          {SEGTAG.map((s) => (
            <g key={s.n}>
              <circle cx={s.p[0]} cy={s.p[1]} r={25} fill={C.paper} stroke={C.matcha} strokeWidth={4} />
              <text x={s.p[0]} y={s.p[1] + 9} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.forest}>{s.n}</text>
            </g>
          ))}
          {IDS.map((k) => {
            const s = STUB[k];
            if (!s) return null;
            const p = ramp(t, TF[k] - 0.05, TF[k] + 0.2);
            if (p <= 0) return null;
            const hot = id === k;
            const ex = s.a[0] + (s.b[0] - s.a[0]) * p, ey = s.a[1] + (s.b[1] - s.a[1]) * p;
            return (
              <g key={k} opacity={hot ? 1 : 0.9}>
                {hot && <circle cx={s.b[0]} cy={s.b[1]} r={34} fill="none" stroke={C.banana} strokeWidth={8} opacity={p} />}
                <line x1={s.a[0]} y1={s.a[1]} x2={ex} y2={ey} stroke={C.forest} strokeWidth={18} strokeLinecap="round" />
                <line x1={s.a[0]} y1={s.a[1]} x2={ex} y2={ey} stroke={COL[k]} strokeWidth={10} strokeLinecap="round" />
                <circle cx={ex} cy={ey} r={hot ? 17 : 14} fill={COL[k]} stroke={C.forest} strokeWidth={4} />
                <g transform={`translate(${s.lab[0]} ${s.lab[1]})`} opacity={p}>
                  <rect x={s.anchor === "start" ? 0 : -48} y={-22} width={48} height={44} rx={13} fill={COL[k]} stroke={C.forest} strokeWidth={4} />
                  <text x={s.anchor === "start" ? 24 : -24} y={13} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={32} fill={C.paper}>{LET[k]}</text>
                </g>
              </g>
            );
          })}
          </g>
        </svg>
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: at.y + at.h + 10, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.forest, opacity: 0.65 }}>Book Plume schematic · lateral view · not to scale</div>
    </>
  );
};

/* ---------- Gray 1918 Fig. 519 for the two terminal branches ---------- */
type Box = [number, number, number, number];
const PLATE519: { hl: Partial<Record<Id, Box[]>>; ring: Partial<Record<Id, Box>> } = {
  hl: { AA: [[0.775, 0.071, 0.27, 0.034]] },
  ring: { MC: [0.83, 0.172, 0.13, 0.06], AA: [0.585, 0.118, 0.105, 0.042] },
};
const Plate519: React.FC<{ t: number; at: { x: number; y: number; w: number; h: number } }> = ({ t, at }) => {
  const id = cur(t);
  const iw = at.w, ih = iw / A519;
  const T = -6;
  const p = id ? ramp(t, TF[id] - 0.05, TF[id] + 0.18) : 0;
  const hl = id ? PLATE519.hl[id] || [] : [];
  const r = id ? PLATE519.ring[id] : undefined;
  return (
    <>
      <div style={{ position: "absolute", left: at.x, top: at.y, width: at.w, height: at.h, overflow: "hidden", borderRadius: 40, background: C.paper, boxShadow: `0 0 0 5px ${C.line}, 0 20px 44px rgba(31,42,20,0.18)` }}>
        <Img src={staticFile(P519)} style={{ position: "absolute", left: 0, top: T, width: iw, height: ih }} />
        {id && hl.map((b, i) => (
          <div key={i} style={{ position: "absolute", left: (b[0] - b[2] / 2) * iw - 8, top: T + (b[1] - b[3] / 2) * ih - 6, width: b[2] * iw + 16, height: b[3] * ih + 12, border: `8px solid ${COL[id]}`, borderRadius: 16, background: "rgba(255,214,10,0.28)", boxShadow: `0 0 0 4px ${C.paper}`, opacity: p, transform: `scale(${0.9 + 0.1 * p})` }} />
        ))}
        {id && r && (
          <div style={{ position: "absolute", left: (r[0] - r[2]) * iw, top: T + (r[1] - r[3]) * ih, width: r[2] * 2 * iw, height: r[3] * 2 * ih, border: `9px solid ${COL[id]}`, borderRadius: "50%", boxShadow: `0 0 0 4px ${C.paper}, inset 0 0 0 4px ${C.paper}`, opacity: p, transform: `scale(${1.25 - 0.25 * p})` }} />
        )}
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: at.y + at.h + 10, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.forest, opacity: 0.65 }}>Gray's Anatomy (1918), Fig. 519 · public domain</div>
    </>
  );
};

const NameCard: React.FC<{ t: number; top: number }> = ({ t, top }) => {
  const id = cur(t);
  if (!id) return null;
  const p = ramp(t, TF[id] - 0.02, TF[id] + 0.2);
  return (
    <div key={id} style={{ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, background: C.forest, borderRadius: 30, padding: "12px 28px 14px 14px", transform: `scale(${0.85 + 0.15 * p})`, opacity: p, boxShadow: "0 10px 0 rgba(31,42,20,0.15)" }}>
        <Chip id={id} size={84} round />
        <div style={{ opacity: ramp(t, TM[id] - 0.1, TM[id] + 0.1, 0.3, 1) }}>
          {NAME[id].map((nm, i) => (
            <div key={i} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.paper, lineHeight: 1.08, whiteSpace: "nowrap" }}>
              {i === 0 ? <span style={{ background: C.banana, color: C.forest, borderRadius: 8, padding: "0 5px 2px" }}>{nm[0]}</span> : null}
              {i === 0 ? nm.slice(1) : nm}
            </div>
          ))}
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, color: "#B9D27A", marginTop: 2, whiteSpace: "nowrap" }}>{SEG[id]}</div>
        </div>
      </div>
    </div>
  );
};

/* 1. Hook: Gray's 1918 Fig. 513 visible from frame 0 + challenge */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={3.55} push={0}>
      <div style={center(18, pop(t, -0.4, 0.25))}>
        <Big size={124}>NAME ALL 10</Big>
      </div>
      <div style={center(146, pop(t, -0.3, 0.25))}>
        <Big size={50} color={C.red}>CAROTID ARTERY BRANCHES</Big>
      </div>
      <Plate513 />
      <div style={{ position: "absolute", left: 0, width: 860, top: 802, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 20, color: C.forest, opacity: 0.65 }}>Gray's Anatomy (1918), Fig. 513 · public domain</div>
      <div style={center(850, pop(t, 0.05, 0.25))}>
        <Pill size={34} bg={C.forest}>internal carotid · mnemonic</Pill>
      </div>
    </Scene>
  );
};
export const Plate513: React.FC<{ x?: number; y?: number; w?: number; h?: number; still?: boolean }> = ({ x = 50, y = 250, w = 760, h = 540 }) => {
  const iw = w, ih = iw / A513;
  const top = h / 2 - 0.4 * ih;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden", borderRadius: 40, background: C.paper, boxShadow: `0 0 0 5px ${C.line}, 0 20px 44px rgba(31,42,20,0.18)` }}>
      <Img src={staticFile(P513)} style={{ position: "absolute", left: 0, top, width: iw, height: ih }} />
    </div>
  );
};

/* 2. The mnemonic card: A VIP's COMMA */
export const V2: React.FC = () => {
  const t = useT();
  const tagP = ramp(t, 4.46, 4.7);
  const tag2 = ramp(t, 5.22, 5.45);
  return (
    <Scene start={3.55} end={5.9} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, ...pop(t, 3.58, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 32, letterSpacing: 5, color: C.banana }}>INTERNAL CAROTID ARTERY</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 98, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#B9D27A", opacity: ramp(t, 3.7, 3.9) }}>just remember</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 190, display: "flex", justifyContent: "center", gap: 5 }}>
          {IDS.map((id, i) => {
            const p = ramp(t, MT[i] - 0.08, MT[i] + 0.12);
            return (
              <div key={id} style={{ opacity: 0.2 + 0.8 * p, transform: `translateY(${(1 - p) * 24}px)` }}>
                <div style={{ width: 74, height: 140, borderRadius: 20, background: p > 0.5 ? COL[id] : "rgba(247,246,236,0.14)", border: `5px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper, lineHeight: 1, paddingBottom: 6, boxSizing: "border-box" }}>{LET[id]}</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 400, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 92, color: C.paper, opacity: tagP, whiteSpace: "nowrap" }}><span style={{ color: C.banana }}>A VIP</span>'s</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 530, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 110, color: C.banana, opacity: tag2, whiteSpace: "nowrap" }}>COMMA</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 700, display: "flex", justifyContent: "center", opacity: ramp(t, 5.5, 5.75) }}>
          <div style={{ background: C.banana, color: C.forest, borderRadius: 24, padding: "8px 28px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 44, whiteSpace: "nowrap" }}>10 branches · 8 + 2 terminal</div>
        </div>
      </div>
    </Scene>
  );
};

/* 3. Diagram (A V I P S C O M) then Gray plate (M A): label + structure per letter + name card */
export const V3: React.FC = () => {
  const t = useT();
  const id = cur(t);
  const plate = id === "MC" || id === "AA";
  const at = { x: 0, y: 122, w: 860, h: 630 };
  return (
    <Scene start={5.9} end={T_HOLD} push={0.004}>
      <Strip t={t} top={26} />
      {plate ? <Plate519 t={t} at={at} /> : <Diagram t={t} at={at} />}
      <NameCard t={t} top={810} />
    </Scene>
  );
};

/* 4. Quick test with 3-2-1 */
export const V4: React.FC = () => {
  const t = useT();
  const s0 = T_HOLD;
  const cd: [number, number][] = [[23.72, 3], [24.36, 2], [25.0, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < 25.55) { n = v; n0 = s; } });
  return (
    <Scene start={s0} end={25.55}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, s0 + 0.02, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 42, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 30, width: 760, top: 110, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 54, lineHeight: 1.12, color: C.paper, ...pop(t, s0 + 0.3) }}>
          Which <span style={{ color: C.banana }}>TWO</span> branches are the <span style={{ color: C.banana }}>END</span> of the artery?
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 380, display: "flex", justifyContent: "center", gap: 6, alignItems: "center", ...pop(t, s0 + 1.6, 0.25) }}>
          {IDS.map((id) => <Chip key={id} id={id} size={72} />)}
        </div>
        {n !== null ? (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 560, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 190, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        ) : (
          <div style={{ position: "absolute", left: 0, width: 820, top: 640, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, color: "#B9D27A", opacity: ramp(t, 23.45, 23.65) }}>pause · say it out loud</div>
        )}
      </div>
    </Scene>
  );
};

/* 5. Answer */
export const V5: React.FC = () => {
  const t = useT();
  return (
    <Scene start={25.55} end={27.6} push={0.006}>
      <div style={center(34, pop(t, 25.57, 0.25))}>
        <Pill size={46} bg={C.banana} color={C.forest}>✓ THE LAST TWO LETTERS</Pill>
      </div>
      <div style={{ position: "absolute", left: 20, top: 150, width: 820, height: 640, borderRadius: 48, background: C.forest, ...pop(t, 25.6, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 60, display: "flex", justifyContent: "center", gap: 6, alignItems: "center" }}>
          {IDS.map((id) => (
            <div key={id} style={{ opacity: id === "MC" || id === "AA" ? 1 : 0.35 }}><Chip id={id} size={72} on={1} hot={id === "MC" || id === "AA"} /></div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 230, display: "flex", justifyContent: "center", opacity: ramp(t, 25.7, 25.95) }}>
          <div style={{ background: C.red, color: C.paper, borderRadius: 20, padding: "8px 24px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 58, textAlign: "center", lineHeight: 1.05 }}>MIDDLE + ANTERIOR<br />CEREBRAL</div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 470, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 38, color: "#B9D27A", opacity: ramp(t, 26.3, 26.55), lineHeight: 1.2 }}>the terminal branches<br />of the internal carotid</div>
      </div>
    </Scene>
  );
};

/* 6. Save frame: the complete list */
export const V6: React.FC = () => {
  const t = useT();
  const s0 = 27.6;
  const b = ramp(t, s0 + 0.05, s0 + 0.4);
  const row = (id: Id, base: number) => (
    <div key={id} style={{ display: "flex", alignItems: "center", gap: 12, height: 52, borderBottom: `2px solid ${C.line}`, opacity: ramp(t, s0 + 0.2 + base * 0.03, s0 + 0.4 + base * 0.03) }}>
      <Chip id={id} size={40} round />
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.forest, whiteSpace: "nowrap" }}>{SHORT[id]}</div>
      <div style={{ marginLeft: "auto", fontFamily: FONT, fontWeight: 800, fontSize: 22, color: C.matcha, whiteSpace: "nowrap" }}>{SEGS[id]}</div>
    </div>
  );
  return (
    <Scene start={s0} end={30.0}>
      <div style={{ position: "absolute", left: 40, top: 14, ...pop(t, s0 + 0.05) }}>
        <svg width={100} height={126} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 160, top: 18, ...pop(t, s0 + 0.1) }}>
        <Big size={96}>SAVE THIS</Big>
      </div>
      <div style={{ position: "absolute", left: 162, top: 120, ...pop(t, s0 + 0.3) }}>
        <Big size={38} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ position: "absolute", left: 30, top: 180, width: 800, height: 740, borderRadius: 40, background: C.card, border: `3px solid ${C.line}`, boxShadow: "0 18px 40px rgba(31,42,20,0.12)", padding: "12px 28px", boxSizing: "border-box", ...pop(t, s0 + 0.15, 0.3) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.forest, whiteSpace: "nowrap", marginBottom: 2 }}>A VIP's COMMA = 10 branches</div>
        {IDS.map((id, i) => row(id, i))}
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, color: C.matcha, marginTop: 10, lineHeight: 1.22, opacity: ramp(t, s0 + 0.6, s0 + 0.8) }}>C1, C3, C5: usually no named branches. Kenhub names the C4 pair meningeal + inferior hypophyseal (same trunk).</div>
      </div>
    </Scene>
  );
};

/* 7. End card (≤ 1.5 s) — no store, no product */
export const V7: React.FC = () => {
  const t = useT();
  const s0 = 30.0;
  return (
    <Scene start={s0} end={31.3}>
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
