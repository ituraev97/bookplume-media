import React from "react";
import { Img, staticFile } from "remotion";
import { C, FONT, ramp, useT } from "./kit";
import { Facts, Stage, LogoMark } from "./Chrome16";
import { Plate } from "./Plates";
import { SpineSide, VertTop, DiscSide, DiscTop, RC, VERTS, VTP, DSP, win } from "./IllusSpine";
import { SEG } from "./cues";
import { CHAPTERS, END } from "./timeline";

/* ---------- timing helpers (all from the voice alignment) ---------- */
export const s_ = (i: number) => SEG[i].s;
export const e_ = (i: number) => SEG[i].e;
export const wf = (i: number, str: string, n = 0) => {
  let c = 0;
  for (let k = 0; k < SEG[i].t.length; k++) {
    if (SEG[i].t[k].startsWith(str)) {
      if (c === n) return SEG[i].w[k];
      c++;
    }
  }
  throw new Error(`cue not found: ${i} ${str}`);
};
const CHs = (n: number) => CHAPTERS[n].s;
export const ST = (n: number) => CHs(n) + 2.3;
export const BE = (n: number) => (n + 1 < CHAPTERS.length ? CHs(n + 1) - 0.1 : END);

/* ---------- small UI pieces ---------- */
export const abs = (x: number, y: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: x, top: y, ...extra });
export const pop = (t: number, t0: number, d = 0.3): React.CSSProperties => {
  const p = ramp(t, t0, t0 + d);
  return { opacity: p, transform: `scale(${0.6 + 0.4 * p + 0.08 * Math.sin(Math.min(1, p) * Math.PI)})` };
};
export const Big: React.FC<{ size?: number; color?: string; children: React.ReactNode; style?: React.CSSProperties }> = ({ size = 100, color = C.forest, children, style }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1.02, letterSpacing: -2, ...style }}>{children}</div>
);
export const Mk: React.FC<{ p: number; children: React.ReactNode }> = ({ p, children }) => (
  <span style={{ background: `linear-gradient(${C.banana}, ${C.banana}) no-repeat 0 88% / ${p * 100}% 38%` }}>{children}</span>
);
export const Seg: React.FC<{ t: number; a: number; b: number; children: React.ReactNode }> = ({ t, a, b, children }) => {
  const o = ramp(t, a, a + 0.4) * (1 - ramp(t, b - 0.2, b + 0.2));
  if (o <= 0.001) return null;
  return <div style={{ position: "absolute", inset: 0, opacity: o, transform: `translateY(${(1 - ramp(t, a, a + 0.4)) * 20}px)` }}>{children}</div>;
};
export const Note: React.FC<{ t: number; t0: number; old: string; x: number; y: number }> = ({ t, t0, old, x, y }) => (
  <div style={abs(x, y, { ...pop(t, t0), background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 20px 11px", fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.forest, whiteSpace: "nowrap", boxShadow: "0 8px 20px rgba(31,42,20,0.10)", transformOrigin: "0% 50%" })}>
    <span style={{ color: C.matcha }}>1918 atlas name:</span> {old}
  </div>
);
export const Chip: React.FC<{ t: number; t0: number; bg?: string; color?: string; size?: number; children: React.ReactNode }> = ({ t, t0, bg = C.forest, color = C.paper, size = 34, children }) => (
  <div style={{ ...pop(t, t0), display: "inline-block", background: bg, color, fontFamily: FONT, fontWeight: 800, fontSize: size, padding: `${size * 0.3}px ${size * 0.62}px ${size * 0.38}px`, borderRadius: size * 0.6, whiteSpace: "nowrap", transformOrigin: "0% 50%" }}>{children}</div>
);
export const ViewTag: React.FC<{ t: number; t0: number; x: number; y: number; text: string }> = ({ t, t0, x, y, text }) => (
  <div style={abs(x, y, { opacity: ramp(t, t0, t0 + 0.4), fontFamily: FONT, fontWeight: 800, fontSize: 22, letterSpacing: 3, color: C.matcha, background: "rgba(247,246,236,0.9)", padding: "4px 12px", borderRadius: 10, whiteSpace: "nowrap", zIndex: 5 })}>{text}</div>
);
/** HTML tag pinned to a point of an SVG diagram (viewBox width vbw) */
export const Tag: React.FC<{ t: number; t0: number; t1?: number; x: number; y: number; w: number; vbw?: number; pt: [number, number]; text: string; dx?: number; dy?: number; hot?: boolean; size?: number; col?: string }> = ({ t, t0, t1, x, y, w, vbw = 800, pt, text, dx = 0, dy = 0, hot, size = 30, col }) => {
  const k = w / vbw;
  const p = ramp(t, t0, t0 + 0.25) * (t1 === undefined ? 1 : 1 - ramp(t, t1, t1 + 0.25));
  if (p <= 0) return null;
  const px = x + pt[0] * k, py = y + pt[1] * k;
  return (
    <>
      {(dx !== 0 || dy !== 0) && (
        <svg style={abs(0, 0, { overflow: "visible", opacity: p })} width={1} height={1}>
          <line x1={px} y1={py} x2={px + dx} y2={py + dy} stroke={C.forest} strokeWidth={3} />
          <circle cx={px} cy={py} r={7} fill={hot ? C.red : C.forest} stroke={C.paper} strokeWidth={3} />
        </svg>
      )}
      <div style={abs(px + dx, py + dy, { transform: `translate(-50%, -50%) scale(${0.8 + 0.2 * p})`, opacity: p, background: col || (hot ? C.banana : C.forest), color: hot && !col ? C.forest : C.paper, fontFamily: FONT, fontWeight: 800, fontSize: size, padding: "5px 14px 8px", borderRadius: 14, whiteSpace: "nowrap", boxShadow: "0 6px 0 rgba(31,42,20,0.15)" })}>{text}</div>
    </>
  );
};
export const Zoom: React.FC<{ x: number; y: number; w: number; h: number; children: React.ReactNode }> = ({ x, y, w, h, children }) => (
  <div style={abs(x, y, { width: w, height: h, overflow: "hidden", borderRadius: 36, background: C.card, boxShadow: `0 0 0 4px ${C.line}, 0 18px 40px rgba(31,42,20,0.12)` })}>{children}</div>
);
const Arrow: React.FC<{ t: number; t0: number; x: number; y: number; dir: "l" | "r" | "u" | "d"; label?: string; col?: string; size?: number }> = ({ t, t0, x, y, dir, label, col = C.red, size = 110 }) => {
  const p = ramp(t, t0, t0 + 0.35);
  const off = (1 - p) * 40 + Math.sin(t * 6) * 6 * p;
  const rot = { r: 0, l: 180, d: 90, u: -90 }[dir];
  const tx = dir === "r" ? -off : dir === "l" ? off : 0, ty = dir === "d" ? -off : dir === "u" ? off : 0;
  return (
    <div style={abs(x, y, { opacity: p, transform: `translate(${tx}px, ${ty}px)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 })}>
      <svg width={size} height={size * 0.6} viewBox="0 0 100 60" style={{ transform: `rotate(${rot}deg)` }}>
        <path d="M4 22 L62 22 L62 6 L96 30 L62 54 L62 38 L4 38 Z" fill={col} stroke={C.forest} strokeWidth={3} strokeLinejoin="round" />
      </svg>
      {label && <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.forest, background: C.card, padding: "3px 12px 5px", borderRadius: 10, whiteSpace: "nowrap" }}>{label}</div>}
    </div>
  );
};
/** head icon nodding (yes) or shaking (no) */
const Head: React.FC<{ t: number; t0: number; mode: "yes" | "no"; size?: number }> = ({ t, t0, mode, size = 200 }) => {
  const p = ramp(t, t0, t0 + 0.3);
  const m = Math.sin((t - t0) * 7) * ramp(t, t0, t0 + 0.5);
  const dx = mode === "no" ? m * 22 : 0, dy = mode === "yes" ? m * 16 : 0;
  return (
    <div style={{ ...pop(t, t0), width: size, textAlign: "center", fontFamily: FONT, fontWeight: 800 }}>
      <svg width={size} height={size} viewBox="0 0 200 200">
        <rect x={86} y={130} width={28} height={60} rx={10} fill="#E8C9A0" stroke={C.forest} strokeWidth={4} />
        <g transform={`translate(${dx * 0.25} ${dy * 0.3})`}>
          <ellipse cx={100} cy={86} rx={58} ry={66} fill="#F2D7B0" stroke={C.forest} strokeWidth={5} />
          <circle cx={78 + dx} cy={80 + dy} r={7} fill={C.forest} />
          <circle cx={122 + dx} cy={80 + dy} r={7} fill={C.forest} />
          <path d={`M${82 + dx} ${110 + dy} Q${100 + dx} ${124 + dy} ${118 + dx} ${110 + dy}`} fill="none" stroke={C.forest} strokeWidth={5} strokeLinecap="round" />
        </g>
        {mode === "yes" ? (
          <g fill={C.red} opacity={p}><path d="M172 40 L186 62 L158 62 Z" /><path d="M172 130 L186 108 L158 108 Z" /><rect x={169} y={60} width={6} height={50} /></g>
        ) : (
          <g fill={C.red} opacity={p}><path d="M30 180 L52 166 L52 194 Z" /><path d="M170 180 L148 166 L148 194 Z" /><rect x={50} y={177} width={100} height={6} /></g>
        )}
      </svg>
      <div style={{ fontSize: 52, color: mode === "yes" ? C.matcha : C.red, marginTop: -6 }}>{mode === "yes" ? "YES" : "NO"}</div>
    </div>
  );
};

/* plates (Gray's Anatomy 1918, public domain) */
const P = (f: string, w: number, h: number) => ({ src: `plates/${f}.png`, aspect: w / h });
export const COL = P("column", 919, 3184);
export const THT = P("thor_top", 1528, 987);
export const CVT = P("cerv_top", 1852, 864);
export const ATL = P("atlas", 2060, 807);
export const AXT = P("axis_top", 1373, 1084);
export const AXS = P("axis_side", 1808, 932);
export const C7P = P("c7", 1151, 1185);
export const THS = P("thor_side", 1533, 1146);
export const LUS = P("lum_side", 1784, 887);
export const L5T = P("l5_top", 1282, 1293);
export const SAC = P("sacrum_lat", 1396, 2065);
export const LIG = P("lig_sag", 1706, 1203);

/** tall plate shown through a window, image scaled to width iw, focus y moving fy0 -> fy1 between a and b */
export const TallPlate: React.FC<{ t: number; x: number; y: number; w: number; h: number; iw: number; a: number; b: number; fy0: number; fy1: number; fx?: number; labels?: { x: number; y: number; text: string; t: number; side?: "l" | "r"; hot?: boolean; col?: string }[]; credit?: boolean }> = ({ t, x, y, w, h, iw, a, b, fy0, fy1, fx = 0.5, labels = [], credit = true }) => {
  const ih = iw / COL.aspect;
  const k = ramp(t, a, b);
  const fy = fy0 + (fy1 - fy0) * k;
  const ty = ih <= h ? (h - ih) / 2 : Math.max(h - ih, Math.min(0, h / 2 - fy * ih));
  const tx = iw <= w ? (w - iw) / 2 : Math.max(w - iw, Math.min(0, w / 2 - fx * iw));
  const i = ramp(t, a - 0.3, a + 0.3);
  return (
    <div style={abs(x, y, { width: w, height: h, borderRadius: 36, overflow: "hidden", background: C.paper, boxShadow: `0 0 0 4px ${C.line}, 0 18px 40px rgba(31,42,20,0.16)`, opacity: i })}>
      <div style={abs(tx, ty, { width: iw, height: ih })}>
        <Img src={staticFile(COL.src)} style={{ width: iw, height: ih, display: "block" }} />
        {labels.map((l, j) => {
          const p = ramp(t, l.t - 0.1, l.t + 0.25);
          if (p <= 0) return null;
          const left = l.side === "l";
          return (
            <div key={j} style={abs(l.x * iw, l.y * ih, { transform: `translate(${left ? "-100%" : "0"}, -50%) scale(${0.85 + 0.15 * p})`, transformOrigin: left ? "100% 50%" : "0% 50%", opacity: p, display: "flex", alignItems: "center", flexDirection: left ? "row-reverse" : "row", gap: 8 })}>
              <div style={{ width: 16, height: 16, borderRadius: 8, background: l.hot ? C.red : C.forest, boxShadow: `0 0 0 4px ${C.paper}` }} />
              <div style={{ background: l.col || (l.hot ? C.banana : C.forest), color: l.col || !l.hot ? (l.col ? C.forest : C.paper) : C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 30, padding: "5px 14px 7px", borderRadius: 12, whiteSpace: "nowrap" }}>{l.text}</div>
            </div>
          );
        })}
      </div>
      {credit && <div style={abs(10, h - 34, { fontFamily: FONT, fontWeight: 700, fontSize: 16, color: C.forest, opacity: 0.6, background: "rgba(247,246,236,0.85)", padding: "2px 8px", borderRadius: 8 })}>Gray's Anatomy, 1918 · public domain</div>}
    </div>
  );
};

/** window onto a big SpineSide drawing, centred on vertebra id */
const SpineZoom: React.FC<{ t: number; x: number; y: number; w: number; h: number; sw: number; at: string; dx?: number; dy?: number; children?: React.ReactNode } & Omit<React.ComponentProps<typeof SpineSide>, "t" | "w">> = ({ t, x, y, w, h, sw, at: id, dx = 0, dy = 0, children, ...rest }) => {
  const v = VERTS.find((q) => q.id === id)!;
  const k = sw / 520;
  const left = w / 2 - v.x * k + dx, top = h / 2 - v.y * k + dy;
  return (
    <Zoom x={x} y={y} w={w} h={h}>
      <div style={abs(left, top)}>
        <SpineSide t={t} w={sw} {...rest} />
      </div>
      {children}
    </Zoom>
  );
};
const vpt = (id: string, k: number, ox: number, oy: number, push = 0): [number, number] => {
  const v = VERTS.find((q) => q.id === id)!;
  return [ox + (v.x + push) * k, oy + v.y * k];
};

const TrickCard: React.FC<{ t: number; t0: number; n: number; title: string; children: React.ReactNode }> = ({ t, t0, n, title, children }) => (
  <div style={abs(0, 0, { width: 1800, height: 740, borderRadius: 44, background: C.forest, overflow: "hidden", ...pop(t, t0, 0.35) })}>
    <div style={abs(60, 40, { fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: C.matchaLight })}>TRICK {n}</div>
    <div style={abs(60, 80, { fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.paper })}>{title}</div>
    {children}
  </div>
);

/* ================= INTRO ================= */
export const SIntro: React.FC = () => {
  const t = useT();
  const m = s_(3);
  return (
    <Stage a={-1} b={BE(0)}>
      <Seg t={t} a={-1} b={m}>
        <TallPlate t={t} x={30} y={0} w={330} h={740} iw={330} a={0} b={m} fy0={0.15} fy1={0.85}
          labels={[{ x: 0.12, y: 0.12, text: "Cervical", t: wf(1, "head"), side: "r" }, { x: 0.2, y: 0.45, text: "Thoracic", t: wf(1, "ribs"), side: "r" }, { x: 0.12, y: 0.75, text: "Lumbar", t: wf(1, "spinal"), side: "r" }]} />
        <div style={abs(390, 0)}>
          <SpineSide t={t} w={330} draw={0.3} lit={{ C: wf(1, "head"), T: wf(1, "ribs"), L: wf(1, "spinal"), S: wf(1, "spinal") + 0.2, Co: wf(1, "spinal") + 0.4 }} showCord={ramp(t, wf(1, "cord"), wf(1, "cord") + 0.5)} />
        </div>
        <ViewTag t={t} t0={0.6} x={400} y={0} text="FROM THE SIDE · FRONT ←" />
        <div style={abs(800, 10, { width: 980, ...pop(t, 0.2) })}>
          <Big size={84}><Mk p={ramp(t, 0.6, 1.5)}>Vertebral Column</Mk></Big>
          <Big size={56} color={C.matcha} style={{ marginTop: 8 }}>anatomy made easy</Big>
        </div>
        <Facts x={800} y={240} w={960}
          items={[
            { t: s_(0), text: "your spine is NOT one bone", bg: C.forest },
            { t: wf(1, "stack"), text: "it’s a stack of small bones = VERTEBRAE", bg: C.matcha },
            { t: wf(1, "head"), text: "holds up your head · anchors your ribs · protects the spinal cord" },
            { t: s_(2), text: "on anatomy exams: everywhere", bg: C.red },
          ]} />
      </Seg>
      <Seg t={t} a={m} b={BE(0) + 0.1}>
        {(["C", "T", "L"] as const).map((v, i) => {
          const tt = wf(4, ["cervical", "thoracic", "lumbar"][i]);
          return (
            <div key={v} style={abs(-50 + i * 270, 150 + i * 30)}>
              <VertTop t={t} v={v} w={320 + i * 30} draw={m + 0.2 + i * 0.15} lit={{ all: { a: tt, b: tt + 1.2 } }} col={RC[v]} />
              <div style={{ ...pop(t, tt), textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.forest, marginTop: 6 }}>{["cervical", "thoracic", "lumbar"][i]}</div>
            </div>
          );
        })}
        <ViewTag t={t} t0={m + 0.3} x={20} y={60} text="VERTEBRAE FROM ABOVE · FRONT ↑" />
        <div style={abs(840, 0, { width: 940, ...pop(t, m + 0.1) })}>
          <Big size={56}>In about 10 minutes:</Big>
        </div>
        <div style={abs(840, 88, { width: 940, display: "flex", flexDirection: "column", gap: 12 })}>
          {[
            ["the 5 regions + how many bones", wf(3, "regions"), RC.C],
            ["the 4 natural curves", wf(4, "curves"), RC.T],
            ["the parts of a typical vertebra", wf(4, "parts"), RC.L],
            ["cervical vs thoracic vs lumbar", wf(4, "cervical"), RC.S],
            ["discs + ligaments", s_(5), "#BFD9E6"],
            ["memory tricks that stick", wf(5, "memory"), C.banana],
          ].map(([txt, tt, col]) => (
            <div key={txt as string} style={{ ...pop(t, tt as number), display: "flex", alignItems: "center", gap: 18, background: C.card, border: `3px solid ${C.line}`, borderRadius: 24, padding: "8px 22px", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.forest, transformOrigin: "0% 50%" }}>
              <div style={{ width: 42, height: 42, borderRadius: 21, background: col as string, border: `3px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>✓</div>
              {txt}
            </div>
          ))}
        </div>
        <div style={abs(840, 650)}>
          <Chip t={t} t0={wf(5, "five")} bg={C.banana} color={C.forest} size={40}>+ 5-question quiz at the end</Chip>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 1. REGIONS AND CURVES ================= */
export const SRegions: React.FC = () => {
  const t = useT();
  const a = ST(1), b = BE(1);
  const m = s_(14);
  const SW = 340;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={m}>
        <div style={abs(40, 0)}>
          <SpineSide t={t} w={SW} numbers={ramp(t, wf(8, "c"), wf(8, "c") + 0.5)} lit={{ C: wf(8, "seven"), T: wf(9, "twelve"), L: wf(10, "five"), S: wf(11, "sacral"), Co: wf(12, "coccygeal") }} dim={0.55} />
        </div>
        <TallPlate t={t} x={430} y={0} w={250} h={740} iw={213} a={a} b={m} fy0={0.5} fy1={0.5}
          labels={[
            { x: 0.4, y: 0.1, text: "7", t: wf(8, "seven"), side: "l", col: RC.C },
            { x: 0.5, y: 0.42, text: "12", t: wf(9, "twelve"), side: "l", col: RC.T },
            { x: 0.42, y: 0.75, text: "5", t: wf(10, "five"), side: "l", col: RC.L },
            { x: 0.52, y: 0.9, text: "S", t: wf(11, "sacral"), side: "l", col: RC.S },
            { x: 0.7, y: 0.975, text: "Co", t: wf(12, "coccygeal"), side: "l", col: RC.Co },
          ]} credit={false} />
        <div style={abs(720, 0, { width: 1060 })}>
          <div style={pop(t, wf(7, "thirty"))}><Big size={58}>33 vertebrae → 5 regions</Big></div>
          <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              ["C", "7 cervical", "neck · C1–C7", wf(8, "seven")],
              ["T", "12 thoracic", "chest · T1–T12 · each carries a pair of ribs", wf(9, "twelve")],
              ["L", "5 lumbar", "lower back · L1–L5", wf(10, "five")],
              ["S", "5 sacral", "fuse into 1 bone = the sacrum", wf(11, "sacral")],
              ["Co", "4 coccygeal", "fuse into the coccyx = tailbone", wf(12, "coccygeal")],
            ].map(([r, h, s, tt]) => (
              <div key={r as string} style={{ ...pop(t, tt as number), display: "flex", alignItems: "center", gap: 18, background: C.card, border: `3px solid ${C.line}`, borderRadius: 22, padding: "8px 20px", fontFamily: FONT, fontWeight: 800, transformOrigin: "0% 50%" }}>
                <div style={{ width: 22, height: 54, borderRadius: 8, background: RC[r as string], border: `3px solid ${C.forest}` }} />
                <div style={{ width: 270, fontSize: 40, color: C.forest }}>{h}</div>
                <div style={{ fontSize: 28, color: C.matcha }}>{s}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 22, ...pop(t, s_(13)), background: C.forest, borderRadius: 26, padding: "14px 26px 18px", fontFamily: FONT, fontWeight: 800, color: C.paper, fontSize: 40, width: "fit-content", transformOrigin: "0% 50%" }}>
            adult: <span style={{ color: C.banana }}>24</span> separate + sacrum + coccyx = <span style={{ color: C.banana, fontSize: 56 }}>26 bones</span>
          </div>
        </div>
      </Seg>
      <Seg t={t} a={m} b={b + 0.1}>
        <div style={abs(40, 0)}>
          <SpineSide t={t} w={SW} regions={0} curves={ramp(t, wf(14, "four"), wf(14, "four") + 0.5)} curveLit={{ T: wf(15, "thoracic"), S: wf(15, "sacral"), C: wf(16, "cervical"), L: wf(16, "lumbar") }} lit={{ T: { a: wf(15, "thoracic"), b: s_(16) }, S: { a: wf(15, "sacral"), b: s_(16) }, C: { a: wf(16, "cervical"), b: s_(18) }, L: { a: wf(16, "lumbar"), b: s_(18) } }} dim={0.8} />
        </div>
        <ViewTag t={t} t0={m + 0.2} x={40} y={0} text="FROM THE SIDE · FRONT ←" />
        <TallPlate t={t} x={480} y={0} w={250} h={740} iw={213} a={m} b={b} fy0={0.5} fy1={0.5} credit />
        <div style={abs(780, 0, { width: 1000, display: "flex", flexDirection: "column", gap: 24 })}>
          <div style={pop(t, wf(14, "four"))}><Big size={60}>4 curves, not a straight line</Big></div>
          <div style={{ ...pop(t, wf(15, "primary")), background: C.card, border: `4px solid ${C.red}`, borderRadius: 28, padding: "18px 28px", fontFamily: FONT, fontWeight: 800, transformOrigin: "0% 50%" }}>
            <div style={{ fontSize: 42, color: C.red }}>PRIMARY · bulge backward</div>
            <div style={{ fontSize: 32, color: C.forest, marginTop: 4 }}>thoracic + sacral · already there before birth</div>
          </div>
          <div style={{ ...pop(t, wf(16, "secondary")), background: C.card, border: "4px solid #3E7FA6", borderRadius: 28, padding: "18px 28px", fontFamily: FONT, fontWeight: 800, transformOrigin: "0% 50%" }}>
            <div style={{ fontSize: 42, color: "#3E7FA6" }}>SECONDARY · bulge forward</div>
            <div style={{ fontSize: 32, color: C.forest, marginTop: 4 }}>cervical + lumbar · develop after birth</div>
          </div>
          <div style={{ display: "flex", gap: 18 }}>
            <Chip t={t} t0={wf(17, "head")} bg={RC.C} color={C.forest} size={32}>cervical: baby holds up its head</Chip>
            <Chip t={t} t0={wf(17, "walk")} bg={RC.L} color={C.forest} size={32}>lumbar: stand + walk</Chip>
          </div>
          <div><Chip t={t} t0={wf(18, "spring")} bg={C.forest} size={38}>together: a spring that helps absorb shock</Chip></div>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 2. A TYPICAL VERTEBRA ================= */
export const STypical: React.FC = () => {
  const t = useT();
  const a = ST(2), b = BE(2);
  const VW = 820, vx = 40, vy = -20;
  const tag = (p: string, text: string, t0: number, dx = 0, dy = 0, hot = false) => <Tag t={t} t0={t0} x={vx} y={vy} w={VW} pt={VTP.T[p]} text={text} dx={dx} dy={dy} hot={hot} />;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(21)}>
        <Plate {...THT} x={40} y={40} w={900} a={a} b={s_(21)} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.35, 0.5, 0.3]}
          labels={[{ x: 0.5, y: 0.2, text: "Body", t: wf(20, "body"), side: "r", hot: true }]} />
        <ViewTag t={t} t0={a + 0.2} x={60} y={0} text="ONE VERTEBRA FROM ABOVE · FRONT ↑" />
        <Facts x={1000} y={20} w={780}
          items={[
            { t: s_(19), text: "zoom in: ONE vertebra (here a thoracic one)", bg: C.forest },
            { t: wf(20, "body"), text: "BODY = in front · a thick, round block of bone", bg: C.matcha },
            { t: wf(20, "weight"), text: "it carries the weight", big: "↓" },
          ]} />
      </Seg>
      <Seg t={t} a={s_(21)} b={s_(25)}>
        <div style={abs(vx, vy)}>
          <VertTop t={t} v="T" w={VW} dim={0.5} lit={{ body: { a: s_(21), b: wf(21, "arch") }, ped: { a: wf(21, "arch"), b: wf(22, "lamina") + 0.8 }, lam: wf(21, "arch") + 0.2, hole: wf(23, "foramen"), spin: { a: wf(21, "arch"), b: wf(22, "pedicle") } }} cord={ramp(t, wf(24, "spinal"), wf(24, "spinal") + 0.5)} />
        </div>
        {tag("body", "body", s_(21), 0, -30)}
        {tag("pedL", "pedicle", wf(22, "pedicle"), -150, -40, true)}
        {tag("lamL", "lamina", wf(22, "lamina"), -180, 40, true)}
        {tag("pedR", "pedicle", wf(22, "pedicle") + 0.15, 150, -40)}
        {tag("lamR", "lamina", wf(22, "lamina") + 0.15, 180, 40)}
        <Tag t={t} t0={wf(23, "foramen")} t1={wf(24, "spinal") - 0.2} x={vx} y={vy} w={VW} pt={[400, 330]} dy={-20} text="vertebral foramen" hot size={26} />
        <Tag t={t} t0={wf(24, "spinal")} x={vx} y={vy} w={VW} pt={[400, 378]} dx={0} dy={0} text="spinal cord" size={24} col={C.redDark} />
        <ViewTag t={t} t0={s_(21) + 0.2} x={60} y={0} text="FROM ABOVE · FRONT ↑" />
        <Facts x={1000} y={20} w={780}
          items={[
            { t: wf(21, "arch"), text: "behind the body: the VERTEBRAL ARCH", bg: C.forest },
            { t: wf(22, "pedicle"), text: "pedicle = connects the arch to the body" },
            { t: wf(22, "lamina"), text: "lamina = forms the back of the ring", bg: C.matcha },
            { t: wf(23, "foramen"), text: "body + arch surround the vertebral foramen" },
            { t: wf(24, "canal"), text: "all foramina stacked = VERTEBRAL CANAL → protects the spinal cord", bg: C.red },
          ]} />
      </Seg>
      <Seg t={t} a={s_(25)} b={s_(29)}>
        <Plate {...THT} x={30} y={60} w={940} a={s_(25)} b={s_(29)} zoomFrom={[1.0, 0.5, 0.55]} zoomTo={[1.1, 0.5, 0.6]}
          labels={[
            { x: 0.5, y: 0.9, text: "Spinous process", t: wf(26, "spinous"), side: "r", hot: true },
            { x: 0.13, y: 0.76, text: "Transverse process", t: wf(27, "transverse"), side: "r", hot: true },
            { x: 0.87, y: 0.78, text: "Transverse process", t: wf(27, "transverse") + 0.2, side: "l", hot: true },
            { x: 0.32, y: 0.58, text: "Sup. articular", t: wf(28, "superior"), side: "l" },
            { x: 0.66, y: 0.6, text: "Sup. articular", t: wf(28, "superior") + 0.15, side: "r" },
          ]} />
        <ViewTag t={t} t0={s_(25) + 0.2} x={50} y={20} text="GRAY’S PLATE · FROM ABOVE · FRONT ↑" />
        <Note t={t} t0={s_(25) + 1.2} old="costal fovea = costal facet" x={50} y={680} />
        <div style={abs(1020, 10, { width: 760 })}>
          <div style={pop(t, wf(25, "seven"))}><Big size={60}><span style={{ color: C.red }}>7</span> processes</Big></div>
          <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              ["1", "spinous", "points backward · the bumps down your back", wf(26, "spinous")],
              ["2", "transverse", "point out to the sides", wf(27, "transverse")],
              ["4", "articular", "2 superior + 2 inferior → small joints with the vertebrae above and below", wf(28, "articular")],
            ].map(([n, h, s, tt]) => (
              <div key={h as string} style={{ ...pop(t, tt as number), display: "flex", gap: 18, alignItems: "flex-start", fontFamily: FONT, fontWeight: 800, transformOrigin: "0% 50%" }}>
                <div style={{ minWidth: 76, height: 76, borderRadius: 38, background: C.red, color: C.paper, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 46 }}>{n}</div>
                <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 22, padding: "8px 22px 12px" }}>
                  <div style={{ fontSize: 42, color: C.forest }}>{h}</div>
                  <div style={{ fontSize: 26, color: C.matcha }}>{s}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 18 }}><Chip t={t} t0={wf(28, "below")} bg={C.forest} size={34}>1 + 2 + 4 = 7</Chip></div>
        </div>
      </Seg>
      <Seg t={t} a={s_(29)} b={b + 0.1}>
        <SpineZoom t={t} x={20} y={20} w={900} h={700} sw={1350} at="L3" dx={-120} dy={40} lit={{ L3: s_(29), L4: s_(29) }} dim={0.7} ivf={ramp(t, wf(29, "intervertebral"), wf(29, "intervertebral") + 0.8)} numbers={1} discs={1} />
        <ViewTag t={t} t0={s_(29) + 0.2} x={40} y={30} text="LUMBAR SPINE FROM THE SIDE · FRONT ←" />
        <Facts x={980} y={20} w={800}
          items={[
            { t: s_(29), text: "between 2 neighboring vertebrae: a side opening", bg: C.forest },
            { t: wf(29, "intervertebral"), text: "= the INTERVERTEBRAL FORAMEN", bg: C.matcha },
            { t: wf(29, "nerve"), text: "each spinal nerve exits here", big: "→", bg: C.red },
          ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 3. THE CERVICAL SPINE ================= */
export const SCervical: React.FC = () => {
  const t = useT();
  const a = ST(3), b = BE(3);
  const VW = 1000, vx = -20, vy = 40;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(32)}>
        <Plate {...CVT} x={0} y={130} w={1000} a={a} b={s_(32)} zoomFrom={[1.0, 0.5, 0.4]} zoomTo={[1.1, 0.5, 0.3]}
          labels={[
            { x: 0.46, y: 0.26, text: "small body", t: wf(30, "small", 1), side: "r" },
            { x: 0.31, y: 0.21, text: "", t: wf(31, "hole"), side: "l", hot: true },
            { x: 0.64, y: 0.2, text: "Transverse foramen ×2", t: wf(31, "foramen"), side: "r", hot: true },
          ]} />
        <ViewTag t={t} t0={a + 0.2} x={20} y={80} text="CERVICAL VERTEBRA FROM ABOVE · FRONT ↑" />
        <Facts x={1020} y={20} w={760}
          items={[
            { t: s_(30), text: "cervical = the SMALLEST vertebrae", big: "C1–C7", bg: C.forest },
            { t: wf(31, "feature"), text: "only they have: a hole in each transverse process", bg: C.matcha },
            { t: wf(31, "foramen"), text: "= TRANSVERSE FORAMEN", bg: C.red },
          ]} />
      </Seg>
      <Seg t={t} a={s_(32)} b={s_(33)}>
        <div style={abs(vx, vy)}>
          <VertTop t={t} v="C" w={VW} lit={{ tfor: s_(32) }} artery={ramp(t, wf(32, "vertebral"), wf(32, "vertebral") + 0.4)} dim={0.75} col={RC.C} />
        </div>
        <Tag t={t} t0={wf(32, "vertebral")} x={vx} y={vy} w={VW} pt={VTP.C.tforL} dx={-40} dy={-150} text="vertebral artery" hot />
        <Tag t={t} t0={wf(32, "vertebral") + 0.2} x={vx} y={vy} w={VW} pt={VTP.C.tforR} dx={40} dy={-150} text="vertebral artery" hot />
        <Facts x={1020} y={20} w={760}
          items={[
            { t: s_(32), text: "an important artery that supplies the brain…", bg: C.forest },
            { t: wf(32, "vertebral"), text: "the VERTEBRAL ARTERY travels up through these holes", bg: C.red },
          ]} />
      </Seg>
      <Seg t={t} a={s_(33)} b={s_(34)}>
        <Plate {...CVT} x={0} y={130} w={1000} a={s_(33)} b={s_(34)} zoomFrom={[1.1, 0.5, 0.6]} zoomTo={[1.5, 0.5, 0.8]}
          labels={[{ x: 0.47, y: 0.92, text: "bifid spinous process", t: wf(33, "splits"), side: "l", hot: true }]} />
        <Facts x={1020} y={20} w={760}
          items={[
            { t: s_(33), text: "most cervical spinous processes split in 2 at the tip", bg: C.forest },
            { t: wf(33, "bifid"), text: "= BIFID", big: "Y", bg: C.matcha },
          ]} />
      </Seg>
      <Seg t={t} a={s_(34)} b={s_(36)}>
        <Plate {...C7P} x={20} y={0} w={700} a={s_(34)} b={s_(36)} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.08, 0.5, 0.65]}
          labels={[{ x: 0.42, y: 0.78, text: "long spinous process", t: wf(34, "long"), side: "r", hot: true }]} />
        <SpineZoom t={t} x={760} y={20} w={300} h={700} sw={1000} at="C6" dy={40} lit={{ C7: wf(34, "bump") }} dim={0.6} numbers={1} />
        <Facts x={1100} y={20} w={680}
          items={[
            { t: s_(34), text: "C7 = the exception", bg: C.forest },
            { t: wf(34, "long"), text: "long spinous process · usually not split" },
            { t: wf(34, "bump"), text: "the bump at the base of your neck", bg: C.matcha },
            { t: wf(35, "prominens"), text: "= VERTEBRA PROMINENS", bg: C.red },
          ]} />
      </Seg>
      <Seg t={t} a={s_(36)} b={s_(40)}>
        <Plate {...ATL} x={20} y={150} w={1000} a={s_(36)} b={s_(40)} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.12, 0.47, 0.55]}
          labels={[
            { x: 0.47, y: 0.11, text: "Anterior arch", t: wf(38, "anterior"), side: "r", hot: true },
            { x: 0.44, y: 0.9, text: "Posterior arch", t: wf(38, "posterior"), side: "l", hot: true },
            { x: 0.3, y: 0.62, text: "Lateral mass", t: wf(38, "lateral"), side: "l" },
            { x: 0.63, y: 0.6, text: "Lateral mass", t: wf(38, "lateral") + 0.15, side: "r" },
          ]} />
        <ViewTag t={t} t0={s_(36) + 0.2} x={40} y={100} text="C1 · ATLAS FROM ABOVE · FRONT ↑" />
        <div style={abs(1060, 0, { width: 720, display: "flex", flexDirection: "column", gap: 18 })}>
          <div style={pop(t, wf(37, "atlas"))}><Big size={76}>C1 = <span style={{ color: C.red }}>ATLAS</span></Big></div>
          <div><Chip t={t} t0={wf(37, "holds")} bg={C.card} color={C.forest} size={32}>holds up the skull, like the giant held the sky</Chip></div>
          <div><Chip t={t} t0={wf(38, "body")} bg={C.red} size={36}>NO body · NO spinous process</Chip></div>
          <div><Chip t={t} t0={wf(38, "ring")} bg={C.forest} size={36}>just a ring</Chip></div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Head t={t} t0={wf(39, "nod")} mode="yes" size={170} />
            <div style={{ ...pop(t, wf(39, "occipital")), fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.forest, width: 440 }}>joins the occipital condyles of the skull → you nod “yes”</div>
          </div>
        </div>
      </Seg>
      <Seg t={t} a={s_(40)} b={b + 0.1}>
        <Plate {...AXS} x={20} y={90} w={860} a={s_(40)} b={s_(42)} zoomFrom={[1.0, 0.55, 0.45]} zoomTo={[1.12, 0.6, 0.35]}
          labels={[
            { x: 0.63, y: 0.12, text: "Dens", t: wf(41, "dens"), side: "l", hot: true },
            { x: 0.68, y: 0.74, text: "Body", t: s_(40) + 0.5, side: "r" },
          ]} />
        <Plate {...AXT} x={170} y={60} w={600} a={s_(42)} b={b} zoomFrom={[1.0, 0.4, 0.4]} zoomTo={[1.15, 0.38, 0.3]}
          labels={[{ x: 0.38, y: 0.1, text: "Dens", t: s_(42), side: "l", hot: true }]} />
        <div style={{ opacity: 1 - ramp(t, s_(42) - 0.3, s_(42)) }}><ViewTag t={t} t0={s_(40) + 0.2} x={40} y={40} text="C2 · AXIS FROM THE SIDE · FRONT →" /></div>
        <div style={{ opacity: ramp(t, s_(42), s_(42) + 0.3) }}><ViewTag t={t} t0={s_(42)} x={190} y={10} text="C2 · AXIS FROM ABOVE · FRONT ↑" /></div>
        <div style={abs(40, 560, { opacity: ramp(t, wf(41, "odontoid"), wf(41, "odontoid") + 0.3) * (1 - ramp(t, s_(42) - 0.2, s_(42))) })}>
          <Note t={t} t0={wf(41, "odontoid")} old="odontoid process = dens" x={0} y={0} />
        </div>
        <div style={abs(1000, 0, { width: 780, display: "flex", flexDirection: "column", gap: 18 })}>
          <div style={pop(t, wf(40, "axis"))}><Big size={76}>C2 = <span style={{ color: C.red }}>AXIS</span></Big></div>
          <div><Chip t={t} t0={wf(41, "tooth")} bg={C.forest} size={34}>a tooth-shaped peg pointing up</Chip></div>
          <div><Chip t={t} t0={wf(41, "dens")} bg={C.banana} color={C.forest} size={34}>dens · odontoid process</Chip></div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Head t={t} t0={wf(42, "shake")} mode="no" size={170} />
            <div style={{ ...pop(t, s_(42)), fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.forest, width: 460 }}>the atlas turns around the dens → you shake “no”</div>
          </div>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 4. THORACIC VERTEBRAE ================= */
export const SThoracic: React.FC = () => {
  const t = useT();
  const a = ST(4), b = BE(4);
  const VW = 820, vx = 40, vy = -20;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(45)}>
        <div style={abs(vx, vy)}>
          <VertTop t={t} v="T" w={VW} draw={a} lit={{ body: wf(44, "heart") }} dim={0.6} col={RC.T} />
        </div>
        <Tag t={t} t0={wf(44, "heart")} x={vx} y={vy} w={VW} pt={VTP.T.body} text="heart-shaped body ♥" hot />
        <ViewTag t={t} t0={a + 0.2} x={60} y={0} text="THORACIC VERTEBRA FROM ABOVE · FRONT ↑" />
        <Facts x={1000} y={20} w={780}
          items={[
            { t: s_(43), text: "12 thoracic vertebrae · T1–T12", big: "12", bg: C.forest },
            { t: wf(44, "bigger"), text: "bigger bodies than in the neck" },
            { t: wf(44, "heart"), text: "mid-thoracic bodies are HEART-shaped", bg: C.red },
          ]} />
      </Seg>
      <Seg t={t} a={s_(45)} b={s_(48)}>
        <Plate {...THS} x={20} y={20} w={900} a={s_(45)} b={s_(48)} zoomFrom={[1.0, 0.6, 0.35]} zoomTo={[1.12, 0.6, 0.35]}
          labels={[
            { x: 0.71, y: 0.17, text: "facet for rib head", t: wf(46, "body"), side: "l", hot: true },
            { x: 0.72, y: 0.46, text: "facet for rib head", t: wf(46, "body") + 0.2, side: "l", hot: true },
            { x: 0.37, y: 0.31, text: "facet for rib tubercle", t: wf(46, "transverse"), side: "r", hot: true },
            { x: 0.36, y: 0.8, text: "long spinous process", t: s_(48) - 0.2, side: "r" },
          ]} />
        <ViewTag t={t} t0={s_(45) + 0.2} x={40} y={0} text="THORACIC VERTEBRA FROM THE SIDE · FRONT →" />
        <Facts x={980} y={20} w={800}
          items={[
            { t: wf(45, "costal"), text: "COSTAL FACETS = small joint surfaces for the ribs", bg: C.forest },
            { t: wf(46, "body"), text: "facets on the body ↔ HEAD of a rib", bg: C.red },
            { t: wf(46, "transverse"), text: "facets on transverse processes ↔ TUBERCLE of a rib", bg: C.matcha },
            { t: s_(47), text: "no other vertebrae have rib facets", big: "only T" },
          ]} />
      </Seg>
      <Seg t={t} a={s_(48)} b={b + 0.1}>
        <SpineZoom t={t} x={20} y={20} w={900} h={700} sw={1500} at="T7" dx={-140} lit={{ T: s_(48) }} dim={0.7} numbers={1} />
        <ViewTag t={t} t0={s_(48) + 0.2} x={40} y={30} text="MID-THORACIC SPINE FROM THE SIDE · FRONT ←" />
        <Arrow t={t} t0={wf(48, "downward")} x={700} y={300} dir="d" col={C.banana} size={90} label="slope down" />
        <Facts x={980} y={20} w={800}
          items={[
            { t: s_(48), text: "thoracic spinous processes: LONG", bg: C.forest },
            { t: wf(48, "downward"), text: "slope steeply downward", bg: C.matcha },
            { t: wf(48, "tiles"), text: "overlap the vertebra below — like tiles on a roof", bg: C.red },
          ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 5. LUMBAR, SACRUM, COCCYX ================= */
export const SLumbar: React.FC = () => {
  const t = useT();
  const a = ST(5), b = BE(5);
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(51)}>
        <Plate {...L5T} x={60} y={0} w={720} a={a} b={s_(51)} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.2, 0.5, 0.7]}
          labels={[{ x: 0.42, y: 0.78, text: "kidney-shaped body", t: wf(50, "kidney"), side: "r", hot: true }]} />
        <ViewTag t={t} t0={a + 0.2} x={80} y={20} text="L5 FROM ABOVE · FRONT ↓" />
        <Facts x={900} y={20} w={880}
          items={[
            { t: s_(49), text: "5 lumbar = the LARGEST movable vertebrae", big: "5", bg: C.forest },
            { t: wf(49, "weight"), text: "they carry the most body weight", bg: C.matcha },
            { t: wf(50, "kidney"), text: "big, KIDNEY-shaped bodies", bg: C.red },
          ]} />
      </Seg>
      <Seg t={t} a={s_(51)} b={s_(53)}>
        <Plate {...LUS} x={20} y={60} w={920} a={s_(51)} b={s_(53)} zoomFrom={[1.0, 0.4, 0.5]} zoomTo={[1.15, 0.3, 0.6]}
          labels={[
            { x: 0.2, y: 0.66, text: "short, broad spinous process", t: wf(51, "short"), side: "r", hot: true },
            { x: 0.72, y: 0.55, text: "Body", t: s_(51) + 0.3, side: "l" },
          ]} />
        <ViewTag t={t} t0={s_(51) + 0.2} x={40} y={20} text="LUMBAR VERTEBRA FROM THE SIDE · FRONT →" />
        <div style={abs(1000, 20, { width: 780, display: "flex", flexDirection: "column", gap: 20 })}>
          <div><Chip t={t} t0={wf(51, "short")} bg={C.forest} size={40}>spinous: short · broad · almost horizontal</Chip></div>
          <div style={{ ...pop(t, s_(52)), background: C.card, border: `4px solid ${C.red}`, borderRadius: 28, padding: "18px 28px", fontFamily: FONT, fontWeight: 800, transformOrigin: "0% 50%" }}>
            <div style={{ fontSize: 40, color: C.red }}>✗ no transverse foramina</div>
            <div style={{ fontSize: 40, color: C.red, marginTop: 6, opacity: ramp(t, wf(52, "costal"), wf(52, "costal") + 0.3) }}>✗ no costal facets</div>
          </div>
          <div style={{ display: "flex", gap: 0, alignItems: "flex-end", marginLeft: -40 }}>
            {(["C", "T", "L"] as const).map((v, i) => (
              <div key={v} style={{ ...pop(t, s_(52) + 0.4 + i * 0.2), textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.forest }}>
                <VertTop t={t} v={v} w={240 + i * 30} col={RC[v]} lit={v === "L" ? { all: s_(52) + 1 } : {}} dim={v === "L" ? 1 : 0.5} />
                {["cervical", "thoracic", "lumbar"][i]}
              </div>
            ))}
          </div>
        </div>
      </Seg>
      <Seg t={t} a={s_(53)} b={b + 0.1}>
        <Plate {...SAC} x={40} y={0} w={500} a={s_(53)} b={b} zoomFrom={[1.0, 0.5, 0.45]} zoomTo={[1.08, 0.5, 0.6]}
          labels={[
            { x: 0.4, y: 0.42, text: "Sacrum", t: wf(53, "sacrum"), side: "r", hot: true },
            { x: 0.4, y: 0.93, text: "Coccyx", t: wf(56, "coccyx"), side: "r", hot: true },
          ]} />
        <ViewTag t={t} t0={s_(53) + 0.2} x={60} y={20} text="FROM THE SIDE · FRONT →" />
        <div style={abs(580, 0)}>
          <SpineSide t={t} w={300} lit={{ S: wf(53, "sacrum"), Co: wf(56, "coccyx"), L5: { a: wf(53, "l"), b: wf(53, "sacrum") + 1 } }} dim={0.45} />
        </div>
        <Facts x={940} y={20} w={840}
          items={[
            { t: wf(53, "sacrum"), text: "SACRUM = 5 fused vertebrae · an upside-down triangle", bg: C.forest },
            { t: wf(54, "hip"), text: "between the 2 hip bones → SACROILIAC joints" },
            { t: wf(55, "foramina"), text: "sacral foramina → the sacral nerves exit", bg: C.matcha },
            { t: wf(56, "coccyx"), text: "COCCYX = usually 4 small fused vertebrae · tailbone", bg: C.red },
          ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 6. DISCS AND LIGAMENTS ================= */
export const SDiscs: React.FC = () => {
  const t = useT();
  const a = ST(6), b = BE(6);
  const DW = 760, dx0 = 40, dy0 = 30;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(61)}>
        <div style={abs(dx0, dy0)}>
          <DiscSide t={t} w={DW} ligs={0.25} cord={0.5} dim={0.6} lit={{ anulus: { a: wf(58, "anulus"), b: wf(58, "nucleus") + 1.5 }, nucleus: wf(58, "nucleus"), body: { a: s_(57), b: wf(58, "anulus") } }} squash={Math.max(0, Math.sin((t - wf(59, "shock")) * 4)) * ramp(t, wf(59, "shock"), wf(59, "shock") + 0.3) * (1 - ramp(t, s_(60) - 0.3, s_(60)))} />
        </div>
        <Tag t={t} t0={s_(57) + 0.3} x={dx0} y={dy0} w={DW} vbw={900} pt={DSP.body1} text="vertebral body" size={26} />
        <Tag t={t} t0={wf(58, "anulus")} x={dx0} y={dy0} w={DW} vbw={900} pt={DSP.anulus} dx={-10} dy={-110} text="anulus fibrosus" hot />
        <Tag t={t} t0={wf(58, "nucleus")} x={dx0} y={dy0} w={DW} vbw={900} pt={DSP.nucleus} dy={120} text="nucleus pulposus" hot />
        <ViewTag t={t} t0={a + 0.2} x={40} y={0} text="SECTION FROM THE SIDE · FRONT ←" />
        <div style={abs(820, 360, { ...pop(t, wf(58, "tough")) })}>
          <DiscTop t={t} w={380} lit={{ anulus: { a: wf(58, "anulus"), b: wf(58, "nucleus") + 1.5 }, nucleus: wf(58, "nucleus") }} dim={0.7} />
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, letterSpacing: 2, color: C.matcha, textAlign: "center" }}>DISC FROM ABOVE</div>
        </div>
        <Facts x={1240} y={20} w={540}
          items={[
            { t: s_(57), text: "INTERVERTEBRAL DISCS sit between the bodies", bg: C.forest },
            { t: wf(58, "anulus"), text: "tough outer ring: anulus fibrosus" },
            { t: wf(58, "nucleus"), text: "soft gel center: nucleus pulposus", bg: C.matcha },
            { t: wf(59, "shock"), text: "shock absorbers · let the spine bend", bg: "#3E7FA6" },
            { t: wf(60, "twenty"), text: "thinnest in the neck, thickest low back · ~¼ of the column’s length", big: "25%", bg: C.red },
          ]} />
      </Seg>
      <Seg t={t} a={s_(61)} b={s_(64)}>
        <Plate {...LIG} x={20} y={20} w={960} a={s_(61)} b={s_(64)} zoomFrom={[1.0, 0.4, 0.5]} zoomTo={[1.12, 0.25, 0.5]}
          labels={[
            { x: 0.03, y: 0.55, text: "Anterior longitudinal lig.", t: wf(62, "anterior"), side: "r", hot: true },
            { x: 0.3, y: 0.62, text: "Posterior longitudinal lig.", t: wf(63, "posterior"), side: "r", hot: true },
            { x: 0.16, y: 0.4, text: "Disc", t: s_(61) + 0.4, side: "r" },
          ]} />
        <Note t={t} t0={s_(61) + 0.9} old="intervertebral fibrocartilage = disc" x={40} y={710} />
        <ViewTag t={t} t0={s_(61) + 0.2} x={40} y={-14} text="SECTION FROM THE SIDE · FRONT ←" />
        <Facts x={1020} y={20} w={760}
          items={[
            { t: s_(61), text: "LIGAMENTS hold the stack together", bg: C.forest },
            { t: wf(62, "anterior"), text: "ANTERIOR longitudinal: front of the bodies · resists bending too far backward", bg: C.red },
            { t: wf(63, "posterior"), text: "POSTERIOR longitudinal: back of the bodies, inside the canal, in front of the spinal cord", bg: C.matcha },
          ]} />
      </Seg>
      <Seg t={t} a={s_(64)} b={b + 0.1}>
        <Plate {...LIG} x={20} y={20} w={960} a={s_(64)} b={b} zoomFrom={[1.05, 0.6, 0.5]} zoomTo={[1.15, 0.65, 0.5]}
          labels={[
            { x: 0.46, y: 0.44, text: "Ligamentum flavum", t: wf(64, "flavum"), side: "l", hot: true },
            { x: 0.86, y: 0.62, text: "Supraspinous lig.", t: wf(65, "supraspinous"), side: "l", hot: true },
            { x: 0.72, y: 0.26, text: "Spinous process", t: wf(65, "spinous") , side: "l" },
          ]} />
        <div style={abs(1020, 400)}>
          <DiscSide t={t} w={420} ligs={1} cord={1} dim={0.45} lit={{ flavum: wf(64, "flavum"), supra: wf(65, "supraspinous"), ALL: { a: s_(64) - 0.5, b: s_(64) }, PLL: { a: s_(64) - 0.5, b: s_(64) } }} />
        </div>
        <Facts x={1020} y={20} w={760}
          items={[
            { t: wf(64, "flavum"), text: "LIGAMENTUM FLAVUM = “yellow ligament” · joins the laminae · elastic", bg: "#B08E2E" },
            { t: wf(65, "supraspinous"), text: "SUPRASPINOUS: along the tips of the spinous processes", bg: C.forest },
            { t: wf(65, "nuchal"), text: "in the neck → the NUCHAL ligament", bg: C.matcha },
          ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 7. MEMORY TRICKS ================= */
const FL: React.FC<{ w: string; on: number }> = ({ w, on }) => (
  <span><span style={{ color: on ? C.banana : C.paper, textShadow: on ? `0 0 18px ${C.bananaDark}` : "none" }}>{w[0]}</span>{w.slice(1)}</span>
);
export const STricks: React.FC = () => {
  const t = useT();
  const a = ST(7), b = BE(7);
  const meals: [string, string, string, string, number, number][] = [
    ["Breakfast", "7", "Cervical", "C", wf(67, "breakfast"), wf(68, "seven")],
    ["Lunch", "12", "Thoracic", "T", wf(67, "lunch"), wf(68, "twelve")],
    ["Dinner", "5", "Lumbar", "L", wf(67, "dinner"), wf(68, "five")],
  ];
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(69)}>
        <TrickCard t={t} t0={a} n={1} title="The numbers: meal times">
          <div style={abs(60, 190, { display: "flex", gap: 36 })}>
            {meals.map(([meal, n, reg, r, t1, t2]) => (
              <div key={meal} style={{ width: 360, height: 470, borderRadius: 36, background: "rgba(247,246,236,0.07)", border: `3px solid ${C.matcha}`, textAlign: "center", fontFamily: FONT, fontWeight: 800, paddingTop: 26, boxSizing: "border-box" }}>
                <div style={{ ...pop(t, t1), fontSize: 50, color: C.paper }}><FL w={meal} on={t >= t1 ? 1 : 0} /></div>
                <div style={{ ...pop(t, t1 + 0.15), fontSize: 30, color: C.matchaLight }}>at</div>
                <div style={{ ...pop(t, t1 + 0.25), fontSize: 170, lineHeight: 1, color: C.banana }}>{n}</div>
                <div style={{ ...pop(t, t2), marginTop: 20, display: "inline-block", background: RC[r], color: C.forest, fontSize: 40, padding: "8px 24px 12px", borderRadius: 20 }}>{n} {reg.toLowerCase()}</div>
              </div>
            ))}
          </div>
          <div style={abs(1250, 150, { width: 500, height: 560, borderRadius: 36, background: C.card, overflow: "hidden" })}>
            <div style={abs(130, 10)}>
              <SpineSide t={t} w={250} numbers={0} lit={{ C: wf(68, "seven"), T: wf(68, "twelve"), L: wf(68, "five") }} dim={0.5} />
            </div>
          </div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={s_(69)} b={s_(70)}>
        <TrickCard t={t} t0={s_(69)} n={2} title="Body shapes get bigger as you go down">
          <div style={abs(60, 200, { display: "flex", gap: 40, alignItems: "flex-end" })}>
            {([["C", "small", "neck", wf(69, "small")], ["T", "heart", "chest", wf(69, "heart")], ["L", "kidney", "lower back", wf(69, "kidney")]] as const).map(([v, s, w, tt], i) => (
              <div key={v} style={{ ...pop(t, tt as number), width: 520, textAlign: "center", fontFamily: FONT, fontWeight: 800 }}>
                <div style={{ display: "inline-block", background: C.card, borderRadius: 30, padding: 10 }}>
                  <VertTop t={t} v={v} w={300 + i * 60} col={RC[v]} lit={{ body: tt as number }} dim={0.55} />
                </div>
                <div style={{ fontSize: 54, color: C.banana, marginTop: 10 }}>{s}</div>
                <div style={{ fontSize: 30, color: C.matchaLight }}>{w}</div>
              </div>
            ))}
          </div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={s_(70)} b={s_(71)}>
        <TrickCard t={t} t0={s_(70)} n={3} title="Holes, facets, or neither?">
          <div style={abs(60, 190, { display: "flex", gap: 40 })}>
            {([["C", "Holes in transverse processes", "→ CERVICAL", wf(70, "holes", 1), { tfor: wf(70, "holes", 1) }], ["T", "Facets for ribs", "→ THORACIC", wf(70, "facets", 1), { cost: wf(70, "facets", 1) }], ["L", "Neither", "→ LUMBAR", wf(70, "neither"), { all: wf(70, "neither") }]] as const).map(([v, h, r, tt, lit]) => (
              <div key={v} style={{ ...pop(t, tt as number), width: 520, height: 500, borderRadius: 36, background: "rgba(247,246,236,0.07)", border: `3px solid ${C.matcha}`, textAlign: "center", fontFamily: FONT, fontWeight: 800, paddingTop: 24, boxSizing: "border-box" }}>
                <div style={{ display: "inline-block", background: C.card, borderRadius: 26, padding: 6 }}>
                  <VertTop t={t} v={v} w={330} lit={lit as any} dim={0.6} col={v === "L" ? RC.L : undefined} />
                </div>
                <div style={{ fontSize: 34, color: C.paper, marginTop: 12 }}>{h}</div>
                <div style={{ fontSize: 46, color: C.banana }}>{r}</div>
              </div>
            ))}
          </div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={s_(71)} b={s_(73)}>
        <TrickCard t={t} t0={s_(71)} n={4} title="Atlas says YES · Axis says NO">
          <div style={abs(60, 200, { width: 820, height: 500, borderRadius: 36, background: C.card, ...pop(t, wf(71, "atlas", 1)) })}>
            <Plate {...ATL} x={20} y={40} w={540} a={wf(71, "atlas", 1)} b={s_(73)} frame={false} credit="" />
            <div style={abs(560, 30)}><Head t={t} t0={wf(71, "yes")} mode="yes" size={220} /></div>
            <div style={abs(40, 300, { fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest, width: 760 })}><span style={{ color: C.red }}>A</span>tlas holds up the head, like the giant holding the sky</div>
          </div>
          <div style={abs(920, 200, { width: 820, height: 500, borderRadius: 36, background: C.card, ...pop(t, s_(72)) })}>
            <Plate {...AXT} x={120} y={10} w={330} a={s_(72)} b={s_(73)} frame={false} credit="" />
            <div style={abs(540, 30)}><Head t={t} t0={wf(72, "no")} mode="no" size={220} /></div>
            <div style={abs(40, 300, { fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest, width: 760 })}><span style={{ color: C.red }}>A</span>xis is what you turn around</div>
          </div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={s_(73)} b={b + 0.1}>
        <div style={abs(60, 60)}>
          <StudyCard t={t} flip={wf(73, "flip") - 0.1} w={860}
            front={
              <div style={{ position: "relative", width: 800, height: 500 }}>
                <div style={{ position: "absolute", left: 30, top: 6, fontSize: 40, color: C.matcha }}>Which region?</div>
                <div style={{ position: "absolute", left: 200, top: 70 }}>
                  <VertTop t={t} v="C" w={420} dim={1} />
                </div>
              </div>
            }
            back={"Cervical\nholes in the transverse processes"} />
        </div>
        <div style={abs(1020, 80, { width: 760 })}>
          <div style={pop(t, s_(73))}><Big size={70}>Test yourself</Big></div>
          <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 18 }}>
            <div><Chip t={t} t0={wf(73, "look")} bg={C.card} color={C.forest} size={40}>1 · look at the picture</Chip></div>
            <div><Chip t={t} t0={wf(73, "name")} bg={C.matcha} size={40}>2 · name the region</Chip></div>
            <div><Chip t={t} t0={wf(73, "flip")} bg={C.forest} size={40}>3 · flip the card to check</Chip></div>
          </div>
        </div>
      </Seg>
    </Stage>
  );
};
const StudyCard: React.FC<{ t: number; flip: number; front: React.ReactNode; back: string; w?: number }> = ({ t, flip, front, back, w = 560 }) => {
  const p = ramp(t, flip, flip + 0.6);
  const ang = p * 180;
  const showBack = ang > 90;
  return (
    <div style={{ width: w, height: w * 0.66, perspective: 1600 }}>
      <div style={{ width: "100%", height: "100%", transform: `rotateY(${ang}deg)`, transformStyle: "preserve-3d", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: showBack ? C.forest : C.card, border: `4px solid ${showBack ? C.forest : C.line}`, boxShadow: "0 20px 40px rgba(31,42,20,0.18)", transform: showBack ? "rotateY(180deg)" : "none", display: "flex", alignItems: "center", justifyContent: "center", padding: 30, boxSizing: "border-box", textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 52, color: showBack ? C.banana : C.forest, lineHeight: 1.15, whiteSpace: "pre-line", overflow: "hidden" }}>
          {showBack ? back : front}
        </div>
      </div>
    </div>
  );
};

/* ================= 8. QUIZ ================= */
type Q = { n: number; si: number; q: string; a: string; visual: (t: number, r: number, ans: number) => React.ReactNode };
const QS: Q[] = [
  {
    n: 1, si: 75, q: "How many vertebrae are in the cervical region?", a: "7 · C1–C7",
    visual: (t, r, ans) => (
      <div style={abs(380, 0)}><SpineSide t={t} w={340} numbers={r ? ramp(t, ans, ans + 0.4) : 0} lit={r ? { C: ans } : {}} dim={r ? 0.45 : 1} /></div>
    ),
  },
  {
    n: 2, si: 77, q: "Which vertebra has no body and no spinous process?", a: "The atlas (C1)",
    visual: (t, r, ans) => (
      <>
        <Plate {...ATL} x={0} y={180} w={980} a={s_(77) - 0.2} b={s_(79) - 0.2} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.08, 0.5, 0.5]} labels={r ? [{ x: 0.47, y: 0.9, text: "Atlas · C1", t: ans, side: "l", hot: true }] : []} />
        {!r && <div style={abs(380, 120, { fontFamily: FONT, fontWeight: 800, fontSize: 120, color: C.red })}>?</div>}
      </>
    ),
  },
  {
    n: 3, si: 79, q: "A vertebra has a hole in each transverse process. Which region?", a: "Cervical",
    visual: (t, r, ans) => (
      <div style={abs(160, 60)}><VertTop t={t} v="C" w={700} lit={{ tfor: s_(79) + 1.5 }} artery={r ? ramp(t, ans, ans + 0.4) : 0} col={r ? RC.C : undefined} dim={1} /></div>
    ),
  },
  {
    n: 4, si: 81, q: "Which part of the vertebral arch connects the arch to the body?", a: "The pedicle",
    visual: (t, r, ans) => (
      <>
        <div style={abs(180, 20)}><VertTop t={t} v="T" w={680} lit={r ? { ped: ans } : {}} dim={r ? 0.5 : 1} /></div>
        {r ? <Tag t={t} t0={ans} x={180} y={20} w={680} pt={VTP.T.pedL} dx={-160} dy={-30} text="pedicle" hot /> : null}
      </>
    ),
  },
  {
    n: 5, si: 83, q: "What is the soft, gel-like center of a disc called?", a: "Nucleus pulposus",
    visual: (t, r, ans) => (
      <div style={abs(120, 150)}><DiscTop t={t} w={760} lit={r ? { nucleus: ans } : {}} dim={r ? 0.6 : 1} /></div>
    ),
  },
];
export const SQuiz: React.FC = () => {
  const t = useT();
  const a = ST(8), b = BE(8);
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(75) - 0.2}>
        <div style={abs(0, 0, { width: 1800, height: 740, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" })}>
          <div style={pop(t, a)}><Big size={150}>QUIZ</Big></div>
          <div style={{ marginTop: 20 }}><Chip t={t} t0={wf(74, "pause")} bg={C.banana} color={C.forest} size={44}>5 questions · pause if you need more time</Chip></div>
        </div>
      </Seg>
      {QS.map((q, i) => {
        const ask = s_(q.si), pause = e_(q.si), ans = s_(q.si + 1);
        const end = i < QS.length - 1 ? s_(QS[i + 1].si) - 0.2 : s_(85) - 0.2;
        const reveal = t >= ans ? 1 : 0;
        const cdT = t - (pause + 0.2);
        const n = cdT < 0 ? null : cdT < 1.0 ? 3 : cdT < 2.0 ? 2 : cdT < 3.0 ? 1 : null;
        const cdK = n ? ramp(t, pause + 0.2 + (3 - n), pause + 0.2 + (3 - n) + 0.18) : 0;
        return (
          <Seg key={q.n} t={t} a={ask - 0.2} b={end}>
            {q.visual(t, reveal, ans)}
            <div style={abs(1040, 0, { width: 760, height: 740, borderRadius: 44, background: C.forest, ...pop(t, ask - 0.15, 0.35) })}>
              <div style={abs(50, 46, { fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: C.banana })}>QUESTION {q.n} / 5</div>
              <div style={abs(50, 110, { width: 660, fontFamily: FONT, fontWeight: 800, fontSize: 54, lineHeight: 1.12, color: C.paper })}>{q.q}</div>
              {n && <div style={abs(0, 470, { width: 760, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 190, lineHeight: 1, color: C.banana, transform: `scale(${1.35 - 0.35 * cdK})` })}>{n}</div>}
              {reveal > 0 && (
                <div style={abs(50, 520, { ...pop(t, ans), width: 660, background: C.banana, borderRadius: 26, padding: "20px 30px 26px", boxSizing: "border-box", fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.forest, textAlign: "center" })}>✓ {q.a}</div>
              )}
            </div>
          </Seg>
        );
      })}
      <Seg t={t} a={s_(85) - 0.2} b={b + 0.1}>
        <div style={abs(0, 0, { width: 1800, height: 740, borderRadius: 44, background: C.card, border: `4px solid ${C.line}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" })}>
          <Big size={110}>Your score: <span style={{ color: C.matcha }}>? / 5</span></Big>
          <div style={{ marginTop: 30 }}><Chip t={t} t0={wf(85, "tell")} bg={C.forest} size={46}>tell me in the comments</Chip></div>
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
    ["7 · 12 · 5", "cervical · thoracic · lumbar + sacrum + coccyx", Math.max(a, s_(87)), RC.C],
    ["4 curves", "primary: thoracic, sacral · secondary: cervical, lumbar", s_(88), RC.T],
    ["Vertebra", "body + arch (pedicles, laminae) + 7 processes", s_(89), RC.L],
    ["Regions", "C: transverse foramina · T: rib facets · L: kidney bodies", s_(90), RC.S],
    ["C1 / C2", "atlas nods YES · axis turns NO", s_(91), C.red],
    ["Disc", "tough anulus fibrosus + soft nucleus pulposus", s_(92), "#BFD9E6"],
  ];
  const ot = s_(93) - 0.2;
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
                <div style={{ width: 300, fontSize: 46, color: C.paper }}>{h}</div>
                <div style={{ fontSize: 36, color: C.matchaLight }}>{s}</div>
              </div>
            ))}
          </div>
          <div style={abs(1500, 40, { opacity: 0.9 })}>
            <SpineSide t={t} w={260} lit={{ C: s_(87), T: s_(87) + 0.2, L: s_(87) + 0.4, S: s_(87) + 0.6, Co: s_(87) + 0.8 }} curves={ramp(t, s_(88), s_(88) + 0.4)} curveLit={{ C: s_(88), T: s_(88), L: s_(88), S: s_(88) }} />
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
              <div style={{ background: C.red, color: C.paper, borderRadius: 50, padding: "18px 54px 22px", fontSize: 54, letterSpacing: 3, transform: `scale(${1 + 0.05 * Math.max(0, Math.sin((t - ot) * 5))})`, opacity: ramp(t, wf(93, "subscribe"), wf(93, "subscribe") + 0.3) }}>SUBSCRIBE</div>
            </div>
            <div style={{ marginTop: 40, background: C.paper, color: C.forest, borderRadius: 24, padding: "16px 30px 20px", fontSize: 40, opacity: ramp(t, s_(94), s_(94) + 0.4), width: "fit-content" }}>Which part of the body should we learn next?</div>
          </div>
        </div>
      )}
    </Stage>
  );
};
