import React from "react";
import { C, FONT, Pill, Scene, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Big, pop } from "./Scenes67";

const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });

/* Papers Don't Contribute To A Good Specialist Level — Radiopaedia: P D C T A G S L */
export type Id = "PP" | "DD" | "CA" | "TA" | "AD" | "GB" | "SY" | "LY";
export const IDS: Id[] = ["PP", "DD", "CA", "TA", "AD", "GB", "SY", "LY"];
export const LET: Record<Id, string> = { PP: "P", DD: "D", CA: "C", TA: "T", AD: "A", GB: "G", SY: "S", LY: "L" };
export const TF: Record<Id, number> = { PP: 5.55, DD: 7.92, CA: 10.04, TA: 11.56, AD: 14.0, GB: 15.9, SY: 18.6, LY: 20.04 };
const MT: Record<Id, number> = { PP: 2.69, DD: 3.1, CA: 3.31, TA: 3.89, AD: 4.09, GB: 4.13, SY: 4.36, LY: 4.94 };
export const COL: Record<Id, string> = { PP: "#2F6B8F", DD: "#8A6D12", CA: "#C9483C", TA: "#D9772B", AD: "#B03A78", GB: "#7B4A9A", SY: "#5C7A2F", LY: "#1F7A6D" };
export const NAME: Record<Id, string> = {
  PP: "Pampiniform plexus",
  DD: "Ductus deferens",
  CA: "Cremasteric artery",
  TA: "Testicular artery",
  AD: "Artery of the ductus deferens",
  GB: "Genital branch (genitofemoral n.)",
  SY: "Sympathetic fibers",
  LY: "Lymphatic vessels",
};
export const SUB: Record<Id, string> = {
  PP: "the veins · drain the testis",
  DD: "carries sperm",
  CA: "supplies the cremaster",
  TA: "from the abdominal aorta",
  AD: "small artery beside the ductus",
  GB: "supplies the cremaster muscle",
  SY: "autonomic nerve fibers",
  LY: "drain to para-aortic nodes",
};
/* schematic cross-section: centre x, y, radius (viewBox 760 x 700) */
const POS: Record<Id, [number, number, number]> = {
  PP: [380, 182, 66],
  DD: [380, 388, 78],
  CA: [535, 290, 30],
  TA: [225, 300, 34],
  AD: [300, 520, 24],
  GB: [495, 518, 26],
  SY: [206, 418, 22],
  LY: [552, 412, 26],
};
const SC: Partial<Record<Id, number>> = { PP: 1.25, SY: 1.3, LY: 1.3 };
const T_HOLD = 21.1;
const T_ANS = 25.55;
const T_SAVE = 27.07;
export const T_END = 29.57;
export const END_CLEAN = 31.02;
export const END_TRIAL = 32.77;

export const Chip: React.FC<{ id: Id; size?: number; on?: number; hot?: boolean; round?: boolean }> = ({ id, size = 70, on = 1, hot, round }) => (
  <div style={{ width: size, height: size, flex: `0 0 ${size}px`, borderRadius: round ? size / 2 : size * 0.28, background: on > 0.5 ? COL[id] : "rgba(31,42,20,0.08)", border: `4px solid ${on > 0.5 ? C.forest : "rgba(31,42,20,0.25)"}`, color: on > 0.5 ? C.paper : "rgba(31,42,20,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size * 0.6, transform: `scale(${hot ? 1.14 : 1})`, boxShadow: hot ? `0 0 0 6px ${C.banana}` : "none", boxSizing: "border-box", lineHeight: 1 }}>
    {LET[id]}
  </div>
);

const cur = (t: number): Id | null => {
  let c: Id | null = null;
  IDS.forEach((id) => { if (t >= TF[id] - 0.05) c = id; });
  return c;
};

/* Book Plume's own schematic of a spermatic cord cross-section. Not to scale. */
const Struct: React.FC<{ id: Id; lit: boolean; dim: boolean }> = ({ id, lit, dim }) => {
  const [x, y, r] = POS[id];
  const col = COL[id];
  const o = dim ? 0.35 : 1;
  const stroke = C.forest;
  const k = SC[id] ?? 1;
  const inner = (() => { switch (id) {
    case "PP": {
      const dots: [number, number, number][] = [[-38, -22, 20], [0, -34, 21], [38, -22, 20], [-52, 14, 19], [-14, 0, 22], [24, 6, 21], [56, 16, 18], [-30, 40, 18], [14, 42, 18]];
      return (
        <g opacity={o}>
          {dots.map(([dx, dy, rr], i) => <circle key={i} cx={x + dx} cy={y + dy} r={rr} fill={col} stroke={stroke} strokeWidth={4} />)}
          {dots.map(([dx, dy, rr], i) => <circle key={`h${i}`} cx={x + dx} cy={y + dy} r={rr * 0.45} fill="#EAF2F8" opacity={0.85} />)}
        </g>
      );
    }
    case "DD":
      return (
        <g opacity={o}>
          <circle cx={x} cy={y} r={r} fill={col} stroke={stroke} strokeWidth={5} />
          <circle cx={x} cy={y} r={r * 0.62} fill="#F3E6B8" stroke={stroke} strokeWidth={3} />
          <circle cx={x} cy={y} r={r * 0.2} fill={C.forest} />
        </g>
      );
    case "SY":
      return (
        <g opacity={o}>
          <circle cx={x} cy={y} r={r} fill={col} stroke={stroke} strokeWidth={4} />
          <circle cx={x - 26} cy={y + 24} r={10} fill={col} stroke={stroke} strokeWidth={3} />
          <circle cx={x + 22} cy={y + 34} r={9} fill={col} stroke={stroke} strokeWidth={3} />
        </g>
      );
    case "LY":
      return (
        <g opacity={o}>
          <circle cx={x} cy={y} r={r} fill="#CDEBE4" stroke={col} strokeWidth={7} strokeDasharray="3 8" strokeLinecap="round" />
          <circle cx={x} cy={y} r={r * 0.36} fill={col} />
          <circle cx={x + 30} cy={y + 30} r={11} fill="#CDEBE4" stroke={col} strokeWidth={5} strokeDasharray="2 6" strokeLinecap="round" />
        </g>
      );
    default:
      return (
        <g opacity={o}>
          <circle cx={x} cy={y} r={r} fill={col} stroke={stroke} strokeWidth={4} />
          <circle cx={x} cy={y} r={r * 0.42} fill="#F7F6EC" opacity={0.9} />
        </g>
      );
  } })();
  return k === 1 ? inner : <g transform={`translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})`}>{inner}</g>;
};

export const Diagram: React.FC<{ w: number; h: number; id: Id | null; p?: number; all?: boolean; plain?: boolean; focus?: Id | null }> = ({ w, h, id, p = 1, all, plain, focus }) => {
  const t = useT();
  const lit = (k: Id) => (all ? true : id === k);
  const dimOthers = !all && !!id;
  return (
    <div style={{ position: "absolute", width: w, height: h, left: 0, top: 0 }}>
      <svg width={w} height={h} viewBox="0 0 760 700">
        <rect x={0} y={0} width={760} height={700} rx={44} fill={C.card} stroke={C.line} strokeWidth={6} />
        {/* coverings (decorative layers) */}
        <circle cx={380} cy={350} r={318} fill="#EFE3C4" stroke={C.forest} strokeWidth={6} />
        <circle cx={380} cy={350} r={292} fill="#F6EBD0" stroke="#B9A67A" strokeWidth={4} strokeDasharray="14 10" />
        <circle cx={380} cy={350} r={266} fill="#FBF4DF" stroke="#B9A67A" strokeWidth={4} />
        {IDS.map((k) => <Struct key={k} id={k} lit={lit(k)} dim={dimOthers && id !== k && !plain} />)}
        {(all ? IDS : id ? [id] : []).map((k) => {
          const [x, y, r] = POS[k];
          const rr = (k === "PP" ? 128 : k === "SY" || k === "LY" ? r + 46 : r + 28) * (1.25 - 0.25 * p);
          const cy = k === "PP" ? y + 14 : k === "SY" ? y + 16 : k === "LY" ? y + 18 : y;
          const cx = k === "SY" ? x - 4 : k === "LY" ? x + 10 : x;
          return <ellipse key={k} cx={cx} cy={cy} rx={rr} ry={rr} fill="none" stroke={COL[k]} strokeWidth={9} opacity={all ? 0.9 : p} style={{ filter: "none" }} />;
        })}
        {(all ? IDS : id ? [id] : []).map((k) => {
          const [x, y, r] = POS[k];
          const bx = k === "PP" ? x - 130 : x < 380 ? x - r - 46 : x + r + 46;
          const by = k === "PP" ? y - 70 : y - r - 34;
          return (
            <g key={`b${k}`} opacity={all ? 0.95 : p}>
              <circle cx={Math.max(40, Math.min(720, bx))} cy={Math.max(40, by)} r={26} fill={COL[k]} stroke={C.forest} strokeWidth={4} />
              <text x={Math.max(40, Math.min(720, bx))} y={Math.max(40, by) + 14} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={38} fill={C.paper}>{LET[k]}</text>
            </g>
          );
        })}
        <text x={380} y={684} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={22} fill={C.matcha} opacity={0.9}>cross-section · schematic, not to scale</text>
      </svg>
      {focus ? null : null}
      {t < 0 ? null : null}
    </div>
  );
};

/* 1. Hook */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={2.62} push={0}>
      <div style={center(8, pop(t, -0.4, 0.25))}>
        <Big size={118}>NAME ALL 8</Big>
      </div>
      <div style={center(128, pop(t, -0.3, 0.25))}>
        <Big size={52} color={C.red}>SPERMATIC CORD CONTENTS</Big>
      </div>
      <div style={{ position: "absolute", left: 80, top: 206, width: 700, height: 645 }}>
        <Diagram w={700} h={645} id={null} plain />
      </div>
      <div style={center(876, pop(t, 0.05, 0.25))}>
        <Pill size={34} bg={C.forest}>spermatic cord · mnemonic</Pill>
      </div>
    </Scene>
  );
};

/* 2. Mnemonic card */
export const V2: React.FC = () => {
  const t = useT();
  const word = (w: string, i: number, tm: number) => {
    const p = ramp(t, tm - 0.08, tm + 0.12);
    return (
      <span key={i} style={{ opacity: 0.15 + 0.85 * p, transform: `translateY(${(1 - p) * 20}px)`, display: "inline-block" }}>
        <span style={{ color: C.banana }}>{w[0]}</span>{w.slice(1)}
      </span>
    );
  };
  const line = (ws: [string, number][], top: number) => (
    <div style={{ position: "absolute", left: 0, width: 820, top, display: "flex", justifyContent: "center", gap: 24, fontFamily: FONT, fontWeight: 800, fontSize: 70, color: C.paper, whiteSpace: "nowrap" }}>
      {ws.map(([w, tm], i) => word(w, i, tm))}
    </div>
  );
  return (
    <Scene start={2.62} end={5.45} push={0.01}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, ...pop(t, 2.66, 0.25) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 46, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 32, letterSpacing: 3, color: C.banana }}>SPERMATIC CORD · 8 CONTENTS</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 98, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: "#B9D27A", opacity: ramp(t, 2.7, 2.9) }}>one letter per structure</div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 170, display: "flex", justifyContent: "center", gap: 10 }}>
          {IDS.map((id) => {
            const p = ramp(t, MT[id] - 0.08, MT[id] + 0.12);
            return (
              <div key={id} style={{ opacity: 0.2 + 0.8 * p, transform: `translateY(${(1 - p) * 24}px)` }}>
                <div style={{ width: 86, height: 120, borderRadius: 20, background: p > 0.5 ? COL[id] : "rgba(247,246,236,0.14)", border: `5px solid ${C.paper}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: 70, color: C.paper, lineHeight: 1, paddingBottom: 6, boxSizing: "border-box" }}>{LET[id]}</div>
              </div>
            );
          })}
        </div>
        {line([["Papers", 2.69], ["Don't", 3.1]], 340)}
        {line([["Contribute", 3.31], ["To", 3.89], ["A", 4.09]], 450)}
        {line([["Good", 4.13], ["Specialist", 4.36], ["Level", 4.94]], 560)}
        <div style={{ position: "absolute", left: 0, width: 820, top: 700, display: "flex", justifyContent: "center", opacity: ramp(t, 5.0, 5.2) }}>
          <div style={{ background: C.banana, color: C.forest, borderRadius: 24, padding: "8px 28px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 40, whiteSpace: "nowrap" }}>P-D-C-T-A-G-S-L · 8 contents</div>
        </div>
      </div>
    </Scene>
  );
};

/* 3. Diagram + letter strip + banner */
export const V3: React.FC = () => {
  const t = useT();
  const id = cur(t);
  const p = id ? ramp(t, TF[id] - 0.05, TF[id] + 0.18) : 0;
  const DW = 740, DH = Math.round((740 * 700) / 760);
  return (
    <Scene start={5.45} end={T_HOLD} push={0.004}>
      <div style={{ position: "absolute", left: 60, top: 0, width: DW, height: DH }}>
        <Diagram w={DW} h={DH} id={id} p={p} />
      </div>
      <div style={{ position: "absolute", left: 8, top: DH + 14, width: 844, display: "flex", justifyContent: "space-between" }}>
        {IDS.map((k) => {
          const seen = t >= TF[k] - 0.05;
          return <Chip key={k} id={k} size={88} on={seen ? 1 : 0} hot={id === k} />;
        })}
      </div>
      {id && (
        <div style={{ position: "absolute", left: 0, width: 860, top: DH + 112, height: 80, borderRadius: 26, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.paper, lineHeight: 1.05, whiteSpace: "nowrap" }}><span style={{ color: C.banana }}>{LET[id]}</span> · {NAME[id]}</div>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, color: "#B9D27A", marginTop: 2, whiteSpace: "nowrap" }}>{SUB[id]}</div>
        </div>
      )}
    </Scene>
  );
};

/* 4. Quick test */
export const V4: React.FC = () => {
  const t = useT();
  const s0 = T_HOLD;
  const cd: [number, number][] = [[23.72, 3], [24.35, 2], [24.99, 1]];
  let n: number | null = null, n0 = 0;
  cd.forEach(([s, v]) => { if (t >= s - 0.05 && t < T_ANS) { n = v; n0 = s; } });
  return (
    <Scene start={s0} end={T_ANS}>
      <div style={{ position: "absolute", left: 20, top: 30, width: 820, height: 860, borderRadius: 48, background: C.forest, overflow: "hidden", ...pop(t, s0 + 0.02, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 42, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 30, width: 760, top: 120, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 60, lineHeight: 1.12, color: C.paper, ...pop(t, s0 + 0.12) }}>
          Which one is the <span style={{ color: C.banana }}>VENOUS</span> plexus?
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 340, display: "flex", justifyContent: "center", gap: 10, alignItems: "center", ...pop(t, s0 + 1.2, 0.25) }}>
          {IDS.map((id) => <Chip key={id} id={id} size={82} />)}
        </div>
        {n !== null ? (
          <div key={n} style={{ position: "absolute", left: 0, width: 820, top: 520, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 210, color: C.banana, lineHeight: 1, transform: `scale(${1.35 - 0.35 * ramp(t, n0 - 0.05, n0 + 0.12)})` }}>{n}</div>
        ) : (
          <div style={{ position: "absolute", left: 0, width: 820, top: 600, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: "#B9D27A", opacity: ramp(t, 23.2, 23.4) }}>pause · say it out loud</div>
        )}
      </div>
    </Scene>
  );
};

/* 5. Answer */
export const V5: React.FC = () => {
  const t = useT();
  return (
    <Scene start={T_ANS} end={T_SAVE} push={0.006}>
      <div style={center(34, pop(t, T_ANS + 0.02, 0.25))}>
        <Pill size={46} bg={C.banana} color={C.forest}>✓ ANSWER</Pill>
      </div>
      <div style={{ position: "absolute", left: 20, top: 150, width: 820, height: 700, borderRadius: 48, background: C.forest, ...pop(t, T_ANS + 0.05, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 820, top: 50, display: "flex", justifyContent: "center", gap: 10, alignItems: "center" }}>
          {IDS.map((id) => (
            <div key={id} style={{ opacity: id === "PP" ? 1 : 0.35 }}><Chip id={id} size={82} on={1} hot={id === "PP"} /></div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 230, display: "flex", justifyContent: "center", opacity: ramp(t, T_ANS + 0.15, T_ANS + 0.4) }}>
          <div style={{ background: C.red, color: C.paper, borderRadius: 20, padding: "8px 24px 14px", fontFamily: FONT, fontWeight: 800, fontSize: 56, textAlign: "center", lineHeight: 1.05 }}>PAMPINIFORM PLEXUS</div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 820, top: 400, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#B9D27A", opacity: ramp(t, T_ANS + 0.6, T_ANS + 0.85), lineHeight: 1.2 }}>the veins of the cord<br />the other seven are not veins</div>
      </div>
    </Scene>
  );
};

/* 6. Save frame */
export const V6: React.FC = () => {
  const t = useT();
  const s0 = T_SAVE;
  const b = ramp(t, s0 + 0.05, s0 + 0.4);
  const row = (id: Id, base: number) => (
    <div key={id} style={{ display: "flex", alignItems: "center", gap: 14, height: 78, borderBottom: `2px solid ${C.line}`, opacity: ramp(t, s0 + 0.2 + base * 0.04, s0 + 0.4 + base * 0.04) }}>
      <Chip id={id} size={52} round />
      <div style={{ whiteSpace: "nowrap" }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 29, color: C.forest, lineHeight: 1.05 }}>{NAME[id]}</div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 21, color: C.matcha, marginTop: 2 }}>{SUB[id]}</div>
      </div>
    </div>
  );
  return (
    <Scene start={s0} end={T_END}>
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
      <div style={{ position: "absolute", left: 30, top: 178, width: 800, height: 750, borderRadius: 40, background: C.card, border: `3px solid ${C.line}`, boxShadow: "0 18px 40px rgba(31,42,20,0.12)", padding: "10px 28px", boxSizing: "border-box", ...pop(t, s0 + 0.15, 0.3) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 27, color: C.forest, whiteSpace: "nowrap", marginBottom: 0 }}>Papers Don't Contribute To A Good Specialist Level</div>
        {IDS.map((id, i) => row(id, i))}
      </div>
    </Scene>
  );
};

/* 7. Clean end card — no store, no product */
export const V7: React.FC = () => {
  const t = useT();
  const s0 = T_END;
  return (
    <Scene start={s0} end={END_CLEAN}>
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

/* 7t. Trial end card: free PDF, no store, no Study Duo */
export const V7T: React.FC = () => {
  const t = useT();
  const s0 = T_END;
  return (
    <Scene start={s0} end={END_TRIAL}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, ...pop(t, s0 + 0.02, 0.3) }}>
        <svg width={150} height={190} viewBox="0 0 150 190" style={{ transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <path d="M14 8 H100 L138 46 V176 Q138 184 130 184 H20 Q12 184 12 176 V16 Q12 8 20 8 Z" fill={C.paper} stroke={C.banana} strokeWidth={8} strokeLinejoin="round" />
          <path d="M100 8 V46 H138" fill={C.banana} stroke={C.banana} strokeWidth={8} strokeLinejoin="round" />
          <text x={75} y={128} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={44} fill={C.forest}>PDF</text>
        </svg>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 70, color: C.paper, textAlign: "center", lineHeight: 1.08, opacity: ramp(t, s0 + 0.08, s0 + 0.3) }}>
          Comment <span style={{ background: C.banana, color: C.forest, borderRadius: 16, padding: "0 16px 4px" }}>PDF</span>
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.banana, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, s0 + 0.25, s0 + 0.5) }}>
          I'll DM it to you free
        </div>
        <div style={{ marginTop: 8, background: C.matcha, color: C.paper, borderRadius: 50, padding: "14px 40px", fontFamily: FONT, fontWeight: 800, fontSize: 34, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, s0 + 0.5, s0 + 0.75) }}>
          Follow for a new mnemonic every day
        </div>
      </div>
    </Scene>
  );
};

/* PDF sticker: 1.8 s, near the bottom of the lesson area, below the label band (frame coordinates) */
export const PdfSticker: React.FC<{ t0: number; text: string }> = ({ t0, text }) => {
  const t = useT();
  const a = ramp(t, t0, t0 + 0.2) * (1 - ramp(t, t0 + 1.6, t0 + 1.8));
  if (a <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 70, width: 860, top: 1460, display: "flex", justifyContent: "center", opacity: a, transform: `translateY(${(1 - ramp(t, t0, t0 + 0.2)) * 20}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, background: C.banana, border: `5px solid ${C.forest}`, borderRadius: 40, padding: "9px 28px 11px 20px", boxShadow: "0 8px 0 rgba(31,42,20,0.22)", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.forest, whiteSpace: "nowrap" }}>
        <svg width={38} height={46} viewBox="0 0 150 190"><path d="M14 8 H100 L138 46 V176 Q138 184 130 184 H20 Q12 184 12 176 V16 Q12 8 20 8 Z" fill={C.paper} stroke={C.forest} strokeWidth={12} strokeLinejoin="round" /><path d="M100 8 V46 H138" fill={C.forest} /></svg>
        {text}
      </div>
    </div>
  );
};
