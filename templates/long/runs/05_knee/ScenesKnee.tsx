import React from "react";
import { C, FONT, ramp, useT } from "./kit";
import { Facts, Stage, LogoMark } from "./Chrome16";
import { Plate } from "./Plates";
import { KneeFront, KneeSide, MenisciTop, StudyCard, FP, SP, MP } from "./IllusKnee";
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
  <div style={{ ...pop(t, t0), display: "inline-block", background: bg, color, fontFamily: FONT, fontWeight: 800, fontSize: size, padding: `${size * 0.3}px ${size * 0.62}px ${size * 0.38}px`, borderRadius: size * 0.6, whiteSpace: "nowrap", transformOrigin: "0% 50%" }}>{children}</div>
);
const ViewTag: React.FC<{ t: number; t0: number; x: number; y: number; text: string }> = ({ t, t0, x, y, text }) => (
  <div style={abs(x, y, { opacity: ramp(t, t0, t0 + 0.4), fontFamily: FONT, fontWeight: 800, fontSize: 22, letterSpacing: 3, color: C.matcha, background: "rgba(247,246,236,0.9)", padding: "4px 12px", borderRadius: 10, whiteSpace: "nowrap" })}>{text}</div>
);
/** HTML tag pinned to a point of an SVG diagram (viewBox width vbw) */
const Tag: React.FC<{ t: number; t0: number; t1?: number; x: number; y: number; w: number; vbw?: number; pt: [number, number]; text: string; dx?: number; dy?: number; hot?: boolean; size?: number }> = ({ t, t0, t1, x, y, w, vbw = 800, pt, text, dx = 0, dy = 0, hot, size = 30 }) => {
  const k = w / vbw;
  const p = ramp(t, t0, t0 + 0.25) * (t1 === undefined ? 1 : 1 - ramp(t, t1, t1 + 0.25));
  if (p <= 0) return null;
  return (
    <div style={abs(x + pt[0] * k + dx, y + pt[1] * k + dy, { transform: `translate(-50%, -50%) scale(${0.8 + 0.2 * p})`, opacity: p, background: hot ? C.banana : C.forest, color: hot ? C.forest : C.paper, fontFamily: FONT, fontWeight: 800, fontSize: size, padding: "5px 14px 8px", borderRadius: 14, whiteSpace: "nowrap", boxShadow: "0 6px 0 rgba(31,42,20,0.15)" })}>{text}</div>
  );
};
/** a clipped "zoom" window onto a diagram */
const Zoom: React.FC<{ x: number; y: number; w: number; h: number; children: React.ReactNode; border?: boolean }> = ({ x, y, w, h, children, border = true }) => (
  <div style={abs(x, y, { width: w, height: h, overflow: "hidden", borderRadius: 36, background: C.card, boxShadow: border ? `0 0 0 4px ${C.line}, 0 18px 40px rgba(31,42,20,0.12)` : "none" })}>{children}</div>
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

/* plates (Gray's Anatomy 1918, public domain) */
const ANT = { src: "plates/knee_ant.png", aspect: 773 / 1638 };
const INT = { src: "plates/knee_int.png", aspect: 875 / 1565 };
const POST = { src: "plates/knee_post.png", aspect: 1773 / 1560 };
const MEN = { src: "plates/menisci.png", aspect: 1228 / 1014 };
const SAG = { src: "plates/knee_sag.png", aspect: 1671 / 2128 };

const FW = 560; // KneeFront / KneeSide default width

/* ================= INTRO ================= */
export const SIntro: React.FC = () => {
  const t = useT();
  const m = s_(3);
  return (
    <Stage a={-1} b={BE(0)}>
      <Seg t={t} a={-1} b={m}>
        <Plate {...INT} x={40} y={0} w={412} a={-1} b={m + 0.2} zoomFrom={[1.0, 0.5, 0.45]} zoomTo={[1.35, 0.5, 0.48]}
          labels={[{ x: 0.3, y: 0.06, text: "Femur", t: 1.2, side: "r" }, { x: 0.62, y: 0.86, text: "Tibia", t: 1.8, side: "l" }]} />
        <Plate {...POST} x={480} y={330} w={460} a={s_(1)} b={m + 0.2} zoomFrom={[1.05, 0.5, 0.5]} zoomTo={[1.25, 0.5, 0.5]} credit="" />
        <div style={abs(980, 10, { width: 820, ...pop(t, 0.2) })}>
          <Big size={88}>
            <Mk p={ramp(t, 0.6, 1.4)}>Knee Joint</Mk> Anatomy
          </Big>
          <Big size={58} color={C.matcha} style={{ marginTop: 8 }}>made easy</Big>
        </div>
        <Facts x={980} y={250} w={800}
          items={[
            { t: s_(0), text: "every step · every stair · every time you sit down", bg: C.forest },
            { t: wf(1, "largest"), text: "the LARGEST joint in the human body", big: "#1", bg: C.matcha },
            { t: wf(1, "tested"), text: "one of the most tested joints on anatomy exams" },
          ]} />
      </Seg>
      <Seg t={t} a={m} b={BE(0) + 0.1}>
        <div style={abs(80, 40)}>
          <KneeFront t={t} w={560} draw={m - 0.2} lit={{ femur: { a: wf(3, "bones"), b: wf(3, "bones") + 1.6 }, tibia: { a: wf(3, "bones") + 0.2, b: wf(3, "bones") + 1.6 }, latMen: { a: wf(3, "menisci"), b: wf(3, "menisci") + 1.6 }, medMen: { a: wf(3, "menisci"), b: wf(3, "menisci") + 1.6 }, mcl: wf(3, "ligaments"), lcl: wf(3, "ligaments") + 0.15, acl: wf(3, "ligaments") + 0.3, pcl: wf(3, "ligaments") + 0.45 }} dim={0.55} />
        </div>
        <ViewTag t={t} t0={m + 0.3} x={60} y={0} text="RIGHT KNEE · FRONT VIEW" />
        <div style={abs(820, 0, { width: 960, ...pop(t, m + 0.1) })}>
          <Big size={58}>In about 10 minutes:</Big>
        </div>
        <div style={abs(820, 100, { width: 960, display: "flex", flexDirection: "column", gap: 13 })}>
          {[
            ["the 3 bones of the knee", wf(3, "bones"), "#EFE6CC"],
            ["its 3 joints in 1 capsule", wf(3, "joints"), C.red],
            ["the 2 menisci", wf(3, "menisci"), "#9CC6BE"],
            ["the 4 main ligaments", wf(3, "ligaments"), "#D9B48F"],
            ["bursae + how the knee locks", s_(4), "#A9CFE0"],
            ["memory tricks that stick", wf(4, "memory"), C.banana],
          ].map(([txt, tt, col]) => (
            <div key={txt as string} style={{ ...pop(t, tt as number), display: "flex", alignItems: "center", gap: 18, background: C.card, border: `3px solid ${C.line}`, borderRadius: 24, padding: "8px 22px", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.forest, transformOrigin: "0% 50%" }}>
              <div style={{ width: 42, height: 42, borderRadius: 21, background: col as string, border: `3px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>✓</div>
              {txt}
            </div>
          ))}
        </div>
        <div style={abs(820, 640)}>
          <Chip t={t} t0={wf(5, "five")} bg={C.banana} color={C.forest} size={40}>+ 5-question quiz at the end</Chip>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 1. THE BONES ================= */
export const SBones: React.FC = () => {
  const t = useT();
  const a = ST(1), b = BE(1);
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(12)}>
        <div style={abs(80, 30)}>
          <KneeFront t={t} w={FW} draw={a} lit={{ femur: wf(8, "femur"), latC: { a: wf(9, "lateral"), b: s_(10) }, medC: { a: wf(9, "medial"), b: s_(10) }, tibia: wf(10, "tibia") }} dim={0.7} ligs={0.15} men={0.2} />
        </div>
        <Tag t={t} t0={wf(8, "femur")} x={80} y={30} w={FW} pt={FP.femur} text="Femur · thigh bone" hot />
        <Tag t={t} t0={wf(9, "medial")} x={80} y={30} w={FW} pt={FP.medC} dx={70} dy={40} text="medial condyle" />
        <Tag t={t} t0={wf(9, "lateral")} x={80} y={30} w={FW} pt={FP.latC} dx={-70} dy={40} text="lateral condyle" />
        <Tag t={t} t0={wf(10, "tibia")} x={80} y={30} w={FW} pt={FP.tibia} text="Tibia · shin bone" hot />
        <Tag t={t} t0={wf(11, "plateau")} x={80} y={30} w={FW} pt={[400, 640]} dy={10} text="tibial plateau" size={26} />
        <ViewTag t={t} t0={a + 0.3} x={60} y={0} text="RIGHT KNEE · FRONT VIEW" />
        <div style={abs(80 + FW - 40, 220, { opacity: ramp(t, wf(9, "medial"), wf(9, "medial") + 0.4), fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.matcha })}>MEDIAL →</div>
        <div style={abs(0, 220, { opacity: ramp(t, wf(9, "lateral"), wf(9, "lateral") + 0.4), fontFamily: FONT, fontWeight: 800, fontSize: 24, color: C.matcha })}>← LATERAL</div>
        <Facts x={1000} y={20} w={780}
          items={[
            { t: s_(7), text: "3 bones meet at the knee", big: "3", bg: C.forest },
            { t: wf(8, "femur"), text: "femur = thigh bone" },
            { t: wf(9, "knobs"), text: "2 rounded knobs: medial + lateral condyle", bg: C.matcha },
            { t: wf(10, "tibia"), text: "tibia = shin bone · flat top = tibial plateau" },
          ]} />
      </Seg>
      <Seg t={t} a={s_(12)} b={s_(15)}>
        <Plate {...ANT} x={60} y={0} w={350} a={s_(12)} b={s_(15)} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.06, 0.5, 0.5]}
          labels={[{ x: 0.25, y: 0.46, text: "Patella", t: wf(12, "patella"), side: "r", hot: true }, { x: 0.1, y: 0.14, text: "Quadriceps", t: wf(13, "quadriceps"), side: "r" }]} />
        <div style={abs(440, 40)}>
          <KneeSide t={t} w={480} lit={{ patella: wf(12, "patella"), quad: wf(13, "quadriceps") }} dim={0.6} />
        </div>
        <Tag t={t} t0={wf(13, "tendon")} x={440} y={40} w={480} pt={SP.quad} text="tendon" size={26} />
        <ViewTag t={t} t0={s_(12) + 0.3} x={460} y={0} text="SIDE VIEW · FRONT →" />
        <Facts x={1000} y={20} w={780}
          items={[
            { t: wf(12, "patella"), text: "patella = the kneecap, in front", bg: C.forest },
            { t: wf(13, "sesamoid"), text: "sesamoid bone = it grows inside a tendon" },
            { t: wf(13, "quadriceps"), text: "inside the quadriceps tendon", bg: C.matcha },
            { t: wf(14, "largest"), text: "the largest sesamoid bone in the body", big: "#1", bg: C.forest },
          ]} />
      </Seg>
      <Seg t={t} a={s_(15)} b={b + 0.1}>
        <div style={abs(80, 30)}>
          <KneeFront t={t} w={FW} lit={{ fibula: wf(16, "fibula"), lcl: wf(17, "ligament") }} dim={0.45} men={0.4} />
        </div>
        <Tag t={t} t0={wf(16, "fibula")} x={80} y={30} w={FW} pt={FP.fibula} dx={90} text="Fibula" hot />
        <Tag t={t} t0={wf(17, "ligament")} x={80} y={30} w={FW} pt={FP.lcl} dx={-30} dy={-90} text="LCL" />
        {(() => {
          const p = ramp(t, wf(16, "not"), wf(16, "not") + 0.3);
          return (
            <svg width={200} height={200} viewBox="0 0 100 100" style={abs(80 + 155 * (FW / 800) - 100, 30 + 690 * (FW / 800) - 100, { opacity: p })}>
              <circle cx={50} cy={50} r={44} fill="none" stroke={C.red} strokeWidth={8} strokeDasharray={`${280 * p} 300`} />
              <line x1={20} y1={80} x2={80} y2={20} stroke={C.red} strokeWidth={8} strokeLinecap="round" opacity={ramp(t, wf(16, "not") + 0.3, wf(16, "not") + 0.5)} />
            </svg>
          );
        })()}
        <div style={abs(1000, 20, { width: 780, display: "flex", flexDirection: "column", gap: 22 })}>
          <div><Chip t={t} t0={s_(15)} bg={C.red} size={52}>EXAM TRAP</Chip></div>
          <div style={pop(t, wf(16, "fibula"))}><Big size={62}>The fibula is <span style={{ color: C.red }}>NOT</span> part of the knee joint</Big></div>
          <div><Chip t={t} t0={wf(17, "touch")} bg={C.card} color={C.forest} size={38}>it doesn’t touch the femur</Chip></div>
          <div><Chip t={t} t0={wf(17, "anchor")} bg={C.matcha} size={38}>but it anchors one ligament → LCL</Chip></div>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 2. THREE JOINTS IN ONE ================= */
export const SJoints: React.FC = () => {
  const t = useT();
  const a = ST(2), b = BE(2);
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(22)}>
        <div style={abs(80, 30)}>
          <KneeFront t={t} w={FW} comp={{ M: wf(20, "medial"), L: wf(21, "lateral") }} lit={{ medC: { a: wf(20, "medial"), b: wf(21, "lateral") }, latC: wf(21, "lateral") }} dim={0.8} ligs={0.15} men={0.6} />
        </div>
        <Tag t={t} t0={wf(20, "medial")} x={80} y={30} w={FW} pt={[560, 650]} dx={60} dy={70} text="medial tibiofemoral" hot size={26} />
        <Tag t={t} t0={wf(21, "lateral")} x={80} y={30} w={FW} pt={[240, 650]} dx={-60} dy={30} text="lateral tibiofemoral" hot size={26} />
        <ViewTag t={t} t0={a + 0.3} x={60} y={0} text="RIGHT KNEE · FRONT VIEW" />
        <div style={abs(900, 20, { width: 880 })}>
          <div style={pop(t, wf(19, "three"))}><Big size={74}>3 joints · 1 capsule</Big></div>
          <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              ["1", "medial tibiofemoral", wf(20, "medial")],
              ["2", "lateral tibiofemoral", wf(21, "lateral")],
              ["3", "patellofemoral", wf(21, "condyles") + 0.8],
            ].map(([n, txt, tt]) => (
              <div key={n as string} style={{ ...pop(t, tt as number), display: "flex", alignItems: "center", gap: 20, fontFamily: FONT, fontWeight: 800, transformOrigin: "0% 50%" }}>
                <div style={{ width: 74, height: 74, borderRadius: 37, background: C.red, color: C.paper, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>{n}</div>
                <div style={{ fontSize: 48, color: C.forest, background: C.card, border: `3px solid ${C.line}`, borderRadius: 22, padding: "8px 24px 12px" }}>{txt}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 26 }}><Chip t={t} t0={wf(20, "between")} bg={C.matcha} size={32}>tibio = tibia · femoral = femur</Chip></div>
        </div>
      </Seg>
      <Seg t={t} a={s_(22)} b={s_(25)}>
        <div style={abs(80, 30)}>
          <KneeSide t={t} w={FW} lit={{ pfj: wf(22, "patellofemoral"), patella: wf(22, "patella"), quad: wf(24, "quadriceps") }} dim={0.75} />
        </div>
        <Tag t={t} t0={wf(22, "patellofemoral")} x={80} y={30} w={FW} pt={SP.pfj} dx={-150} text="patellofemoral joint" hot size={26} />
        <Arrow t={t} t0={wf(22, "glides")} x={80 + 600 * (FW / 800)} y={30 + 300 * (FW / 800)} dir="d" col={C.banana} size={80} label="glides" />
        <ViewTag t={t} t0={s_(22) + 0.3} x={60} y={0} text="SIDE VIEW · FRONT →" />
        <Facts x={1000} y={20} w={780}
          items={[
            { t: wf(22, "patellofemoral"), text: "3 · patellofemoral: back of the patella glides in a groove on the femur", bg: C.forest },
            { t: s_(23), text: "the 2 tibiofemoral joints carry body weight" },
            { t: s_(24), text: "patellofemoral joint → better leverage for the quadriceps", bg: C.matcha },
          ]} />
      </Seg>
      <Seg t={t} a={s_(25)} b={b + 0.1}>
        <Plate {...SAG} x={60} y={0} w={570} a={s_(25)} b={b} zoomFrom={[1.0, 0.5, 0.55]} zoomTo={[1.2, 0.5, 0.6]}
          labels={[
            { x: 0.42, y: 0.55, text: "Femur", t: s_(25) + 0.3, side: "r" },
            { x: 0.4, y: 0.77, text: "Tibia", t: s_(25) + 0.6, side: "r" },
            { x: 0.69, y: 0.47, text: "Patella", t: s_(25) + 0.9, side: "l" },
            { x: 0.33, y: 0.67, text: "Joint cavity", t: wf(25, "synovial"), side: "r", hot: true },
          ]} />
        <Facts x={720} y={20} w={1060}
          items={[
            { t: wf(25, "synovial"), text: "a SYNOVIAL joint", bg: C.forest },
            { t: wf(25, "hyaline"), text: "smooth hyaline cartilage + synovial fluid" },
            { t: wf(26, "hinge"), text: "mainly a HINGE → flexion + extension", bg: C.matcha },
            { t: wf(27, "rotation"), text: "a little rotation — only when the knee is bent", bg: C.red },
          ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 3. THE MENISCI ================= */
export const SMenisci: React.FC = () => {
  const t = useT();
  const a = ST(3), b = BE(3);
  const ZW = 1000;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(31)}>
        <Zoom x={20} y={20} w={900} h={700}>
          <div style={abs(-50, -380)}>
            <KneeFront t={t} w={ZW} men={0} ligs={0} lit={{ latC: wf(29, "condyles"), medC: wf(29, "condyles"), tibia: wf(29, "plateau") }} />
          </div>
        </Zoom>
        {(() => {
          const p = ramp(t, wf(30, "round"), wf(30, "round") + 0.4);
          return <div style={abs(380, 300, { opacity: p, fontFamily: FONT, fontWeight: 800, fontSize: 120, color: C.red, transform: `scale(${0.6 + 0.4 * p})` })}>?</div>;
        })()}
        <div style={abs(980, 40, { width: 800, display: "flex", flexDirection: "column", gap: 24 })}>
          <div style={pop(t, s_(28))}><Big size={70}>The problem</Big></div>
          <div><Chip t={t} t0={wf(29, "round")} bg={C.forest} size={42}>femoral condyles = ROUND</Chip></div>
          <div><Chip t={t} t0={wf(29, "flat")} bg={C.matcha} size={42}>tibial plateau = FLAT</Chip></div>
          <div><Chip t={t} t0={wf(30, "great")} bg={C.red} size={42}>round on flat = poor fit</Chip></div>
        </div>
      </Seg>
      <Seg t={t} a={s_(31)} b={s_(35)}>
        <Zoom x={20} y={20} w={900} h={700}>
          <div style={abs(-50, -380)}>
            <KneeFront t={t} w={ZW} ligs={0} lit={{ latMen: wf(31, "menisci"), medMen: wf(31, "menisci") + 0.2 }} dim={0.75} />
          </div>
          {(() => {
            const k = ZW / 800;
            return (
              <>
                <Tag t={t} t0={wf(33, "thick")} x={-50} y={-380} w={ZW} pt={[150, 560]} dx={20} dy={-60} text="thick outer edge" size={26} />
                <Tag t={t} t0={wf(33, "thin")} x={-50} y={-380} w={ZW} pt={[320, 600]} dx={40} dy={60} text="thin inner edge" size={26} />
                <div style={abs(-50 + 600 * k, -380 + 640 * k, { opacity: ramp(t, wf(34, "shock"), wf(34, "shock") + 0.3) })}>
                  <Arrow t={t} t0={wf(34, "shock")} x={-55} y={-260} dir="d" col={C.banana} size={90} label="load" />
                </div>
              </>
            );
          })()}
        </Zoom>
        <ViewTag t={t} t0={s_(31) + 0.3} x={40} y={30} text="RIGHT KNEE · FRONT VIEW · ZOOMED IN" />
        <Facts x={980} y={20} w={800}
          items={[
            { t: wf(31, "menisci"), text: "the MENISCI = 2 pads on top of the tibia", bg: C.forest },
            { t: wf(32, "fibrocartilage"), text: "crescent-shaped fibrocartilage" },
            { t: wf(33, "wedge"), text: "thick outside, thin inside = a wedge", bg: C.matcha },
            { t: wf(34, "deepens"), text: "deepen the tibia + act as shock absorbers" },
          ]} />
      </Seg>
      <Seg t={t} a={s_(35)} b={s_(38)}>
        <Plate {...MEN} x={30} y={10} w={870} a={s_(35)} b={s_(38)} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.12, 0.45, 0.5]}
          labels={[
            { x: 0.07, y: 0.62, text: "Medial meniscus", t: wf(36, "medial"), side: "r", hot: true },
            { x: 0.88, y: 0.42, text: "Lateral meniscus", t: wf(37, "lateral"), side: "l", hot: true },
          ]} />
        <ViewTag t={t} t0={s_(35) + 0.3} x={50} y={-20} text="RIGHT TIBIA FROM ABOVE · FRONT ↑" />
        <div style={abs(980, 20, { width: 800, display: "flex", gap: 40 })}>
          {[["C", "medial", "a wide C · almost a half circle", wf(36, "c")], ["O", "lateral", "nearly a full circle · like an O", wf(37, "o")]].map(([L, n, d, tt]) => (
            <div key={L as string} style={{ ...pop(t, tt as number), width: 380, height: 600, borderRadius: 40, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800 }}>
              <div style={{ fontSize: 300, lineHeight: 1, color: C.banana }}>{L}</div>
              <div style={{ fontSize: 46, color: C.paper }}>{n}</div>
              <div style={{ fontSize: 28, color: C.matchaLight, textAlign: "center", padding: "10px 30px 0" }}>{d}</div>
            </div>
          ))}
        </div>
      </Seg>
      <Seg t={t} a={s_(38)} b={s_(42)}>
        <div style={abs(40, 60)}>
          <MenisciTop t={t} w={900} lit={{ medMen: wf(39, "medial"), mcl: wf(39, "collateral"), latMen: wf(41, "lateral"), lcl: wf(41, "collateral") }} dim={0.65} />
        </div>
        <Tag t={t} t0={wf(39, "collateral")} x={40} y={60} w={900} vbw={900} pt={MP.mcl} dy={-210} text="MCL · attached" hot size={28} />
        <Tag t={t} t0={wf(41, "collateral")} x={40} y={60} w={900} vbw={900} pt={MP.lcl} dy={-200} dx={-40} text="LCL · not attached" size={28} />
        <ViewTag t={t} t0={s_(38) + 0.3} x={50} y={0} text="RIGHT TIBIA FROM ABOVE · FRONT ↑" />
        <Facts x={1000} y={20} w={780}
          items={[
            { t: wf(39, "medial"), text: "MEDIAL meniscus: fixed to the capsule + the MCL", bg: C.forest },
            { t: s_(40), text: "→ can’t move away · injured far more often", bg: C.red },
            { t: wf(41, "lateral"), text: "LATERAL meniscus: no attachment to the LCL" },
            { t: wf(41, "mobile"), text: "→ more mobile", bg: C.matcha },
          ]} />
      </Seg>
      <Seg t={t} a={s_(42)} b={b + 0.1}>
        <div style={abs(40, 60)}>
          <MenisciTop t={t} w={900} zones={ramp(t, wf(42, "rim"), wf(42, "rim") + 0.6)} dim={0.8} cols={0.4} />
        </div>
        <Tag t={t} t0={wf(42, "rim")} x={40} y={60} w={900} vbw={900} pt={[200, 120]} dx={90} dy={-20} text="outer rim: good blood supply" hot size={26} />
        <Tag t={t} t0={wf(42, "inner")} x={40} y={60} w={900} vbw={900} pt={[330, 330]} dx={10} text="inner part: poor" size={26} />
        <Facts x={1000} y={20} w={780}
          items={[
            { t: s_(42), text: "only the OUTER RIM has a good blood supply", bg: C.red },
            { t: wf(42, "tears"), text: "tears in the inner part heal poorly" },
          ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 4. THE COLLATERAL LIGAMENTS ================= */
export const SCollat: React.FC = () => {
  const t = useT();
  const a = ST(4), b = BE(4);
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(47)}>
        <div style={abs(80, 30)}>
          <KneeFront t={t} w={FW} lit={{ mcl: wf(44, "medial"), medMen: wf(46, "meniscus") }} dim={0.55} />
        </div>
        <Tag t={t} t0={wf(44, "medial")} x={80} y={30} w={FW} pt={FP.mcl} dx={40} text="MCL" hot />
        <Tag t={t} t0={wf(45, "epicondyle")} x={80} y={30} w={FW} pt={[630, 400]} dx={60} dy={-30} text="medial epicondyle" size={24} />
        <Tag t={t} t0={wf(45, "surface")} x={80} y={30} w={FW} pt={[600, 790]} dx={50} dy={20} text="medial tibia" size={24} />
        <ViewTag t={t} t0={a + 0.3} x={60} y={0} text="RIGHT KNEE · FRONT VIEW" />
        <Facts x={1000} y={20} w={780}
          items={[
            { t: wf(44, "medial"), text: "MCL = medial (tibial) collateral ligament", bg: C.forest },
            { t: wf(45, "broad"), text: "a broad, flat band" },
            { t: wf(45, "epicondyle"), text: "medial epicondyle of femur → medial surface of tibia", bg: C.matcha },
            { t: s_(46), text: "firmly attached to the medial meniscus", bg: C.red },
          ]} />
      </Seg>
      <Seg t={t} a={s_(47)} b={s_(50)}>
        <Plate {...POST} x={20} y={0} w={840} a={s_(47)} b={s_(50)} zoomFrom={[1.0, 0.4, 0.55]} zoomTo={[1.3, 0.3, 0.6]}
          labels={[
            { x: 0.285, y: 0.6, text: "LCL", t: wf(47, "lateral"), side: "r", hot: true },
            { x: 0.3, y: 0.75, text: "Fibular head", t: wf(48, "fibula"), side: "r" },
            { x: 0.765, y: 0.56, text: "MCL", t: wf(47, "lateral") + 0.6, side: "l" },
          ]} />
        <ViewTag t={t} t0={s_(47) + 0.3} x={40} y={-20} text="LEFT KNEE FROM BEHIND · LATERAL ←" />
        <Facts x={900} y={20} w={880}
          items={[
            { t: wf(47, "lateral"), text: "LCL = lateral (fibular) collateral ligament", bg: C.forest },
            { t: wf(48, "rounded"), text: "a strong, rounded cord" },
            { t: wf(48, "epicondyle"), text: "lateral epicondyle of femur → head of the fibula", bg: C.matcha },
            { t: s_(49), text: "the ligament the fibula anchors" },
          ]} />
      </Seg>
      <Seg t={t} a={s_(50)} b={b + 0.1}>
        <div style={abs(160, 30)}>
          <KneeFront t={t} w={FW} lit={{ mcl: { a: s_(50), b: s_(53) }, lcl: { a: s_(50) + 0.3, b: s_(52) } }} dim={0.6} />
        </div>
        <div style={{ opacity: 1 - ramp(t, s_(53) - 0.3, s_(53)) }}><Arrow t={t} t0={wf(52, "push")} x={0} y={410} dir="r" label="push from outside" /></div>
        <Tag t={t} t0={wf(52, "open")} t1={s_(53) - 0.3} x={160} y={30} w={FW} pt={[700, 600]} dx={50} dy={-60} text="opens ↔" size={26} hot />
        <div style={abs(160 + FW - 10, 410)}><Arrow t={t} t0={wf(53, "push")} x={0} y={0} dir="l" label="push from inside" /></div>
        <Tag t={t} t0={wf(53, "outer")} x={160} y={30} w={FW} pt={[95, 600]} dx={-40} dy={-60} text="↔ opens" size={26} hot />
        <Facts x={1000} y={20} w={780}
          items={[
            { t: s_(50), text: "both OUTSIDE the joint capsule · tight when the knee is straight", bg: C.forest },
            { t: s_(51), text: "job: stop the knee bending sideways" },
            { t: wf(52, "valgus"), text: "MCL resists VALGUS stress (push from outside)", bg: C.red },
            { t: wf(53, "varus"), text: "LCL resists VARUS stress (push from inside)", bg: C.matcha },
          ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 5. THE CRUCIATE LIGAMENTS ================= */
export const SCruc: React.FC = () => {
  const t = useT();
  const a = ST(5), b = BE(5);
  const ZW = 1100;
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(56)}>
        <Zoom x={20} y={20} w={900} h={700}>
          <div style={abs(-100, -300)}>
            <KneeFront t={t} w={ZW} lit={{ acl: wf(55, "cross", 0) - 0.2, pcl: wf(55, "cross", 0) }} dim={0.55} />
          </div>
        </Zoom>
        {(() => {
          const p = ramp(t, wf(55, "x"), wf(55, "x") + 0.3);
          return <div style={abs(760, 60, { opacity: p, fontFamily: FONT, fontWeight: 800, fontSize: 200, color: C.red, transform: `scale(${0.5 + 0.5 * p}) rotate(${(1 - p) * -30}deg)` })}>X</div>;
        })()}
        <div style={abs(980, 40, { width: 800, display: "flex", flexDirection: "column", gap: 24 })}>
          <div style={pop(t, s_(54))}><Big size={70}>The cruciate ligaments</Big></div>
          <div><Chip t={t} t0={wf(55, "cross")} bg={C.forest} size={42}>cruciate = cross-shaped</Chip></div>
          <div><Chip t={t} t0={wf(55, "x")} bg={C.red} size={42}>they cross like an X</Chip></div>
          <div><Chip t={t} t0={wf(55, "middle")} bg={C.matcha} size={42}>deep in the middle of the knee</Chip></div>
        </div>
      </Seg>
      <Seg t={t} a={s_(56)} b={s_(58)}>
        <div style={abs(40, 60)}>
          <MenisciTop t={t} w={900} lit={{ acl: wf(57, "anterior"), pcl: wf(57, "posterior") }} dim={0.55} cols={0.3} />
        </div>
        <Tag t={t} t0={wf(57, "anterior")} x={40} y={60} w={900} vbw={900} pt={MP.acl} dy={-60} text="ACL starts in FRONT" hot size={28} />
        <Tag t={t} t0={wf(57, "posterior")} x={40} y={60} w={900} vbw={900} pt={MP.pcl} dy={70} text="PCL starts at the BACK" hot size={28} />
        <ViewTag t={t} t0={s_(56) + 0.3} x={50} y={0} text="RIGHT TIBIA FROM ABOVE · FRONT ↑" />
        <div style={abs(1000, 40, { width: 780, ...pop(t, s_(56)) })}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 5, color: C.matcha }}>THE SECRET TO THE NAMES</div>
          <Big size={64} style={{ marginTop: 16 }}>Anterior / posterior = where they attach on the <Mk p={ramp(t, wf(57, "tibia"), wf(57, "tibia") + 0.5)}>TIBIA</Mk></Big>
        </div>
      </Seg>
      <Seg t={t} a={s_(58)} b={s_(62)}>
        <Plate {...INT} x={10} y={0} w={410} a={s_(58)} b={s_(62)} zoomFrom={[1.1, 0.45, 0.45]} zoomTo={[1.45, 0.42, 0.42]}
          labels={[
            { x: 0.5, y: 0.455, text: "ACL", t: wf(58, "anterior"), side: "l", hot: true },
            { x: 0.3, y: 0.36, text: "Lateral condyle", t: wf(59, "lateral"), side: "r" },
          ]} />
        <div style={abs(440, 60)}>
          <KneeSide t={t} w={520} cruc={1} slide={14 * ramp(t, wf(60, "sliding"), wf(60, "sliding") + 0.6) * (1 - ramp(t, s_(61), s_(61) + 0.5))} lit={{ acl: wf(58, "anterior") }} dim={0.55} ext={0.35} />
        </div>
        <Tag t={t} t0={wf(58, "anterior")} x={440} y={60} w={520} pt={SP.acl} dx={70} dy={30} text="ACL" hot />
        <div style={abs(780, 520)}><Arrow t={t} t0={wf(60, "sliding")} x={0} y={0} dir="r" size={90} label="tibia forward" /></div>
        <ViewTag t={t} t0={s_(58) + 0.3} x={460} y={0} text="SIDE VIEW · FRONT →" />
        <Facts x={1000} y={20} w={780}
          items={[
            { t: wf(58, "anterior"), text: "ACL: front of the tibia (between the condyles)", bg: C.forest },
            { t: wf(59, "backward"), text: "→ up + back to the LATERAL femoral condyle" },
            { t: wf(60, "sliding"), text: "stops the tibia sliding FORWARD · resists hyperextension", bg: C.red },
            { t: s_(61), text: "the weaker cruciate", bg: C.matcha },
          ]} />
      </Seg>
      <Seg t={t} a={s_(62)} b={s_(66)}>
        <Plate {...POST} x={10} y={0} w={840} a={s_(62)} b={s_(66)} zoomFrom={[1.1, 0.5, 0.5]} zoomTo={[1.4, 0.56, 0.5]}
          labels={[
            { x: 0.55, y: 0.56, text: "PCL", t: wf(62, "posterior"), side: "r", hot: true },
            { x: 0.7, y: 0.38, text: "Medial condyle", t: wf(63, "medial"), side: "l" },
          ]} />
        <Note t={t} t0={wf(63, "medial") + 1.0} old="ligament of Wrisberg (= posterior meniscofemoral ligament)" x={20} y={-38} />
        <ViewTag t={t} t0={s_(62) + 0.3} x={30} y={690} text="LEFT KNEE FROM BEHIND" />
        <Facts x={900} y={20} w={880}
          items={[
            { t: wf(62, "posterior"), text: "PCL: back of the tibia", bg: C.forest },
            { t: wf(63, "forward"), text: "→ up + forward to the MEDIAL femoral condyle" },
            { t: wf(64, "backward"), text: "stops the tibia sliding BACKWARD", bg: C.red },
            { t: wf(64, "downhill"), text: "supports the bent, loaded knee (walking downhill)" },
            { t: s_(65), text: "the STRONGER cruciate", bg: C.matcha },
          ]} />
      </Seg>
      <Seg t={t} a={s_(66)} b={b + 0.1}>
        <Zoom x={20} y={20} w={900} h={700}>
          <div style={abs(-100, -300)}>
            <KneeFront t={t} w={1100} capsule={ramp(t, wf(67, "capsule"), wf(67, "capsule") + 0.5)} lit={{ acl: s_(66), pcl: s_(66) }} dim={0.5} />
          </div>
          <Tag t={t} t0={wf(67, "capsule")} x={-100} y={-300} w={1100} pt={[400, 400]} dy={-30} text="joint capsule" size={28} />
          <Tag t={t} t0={wf(67, "synovial")} x={-100} y={-300} w={1100} pt={[240, 520]} text="synovial cavity" size={26} hot />
        </Zoom>
        <div style={abs(980, 40, { width: 800, display: "flex", flexDirection: "column", gap: 24 })}>
          <div><Chip t={t} t0={s_(66)} bg={C.red} size={40}>EXAM FAVORITE</Chip></div>
          <div style={pop(t, wf(67, "inside"))}><Big size={54}>inside the capsule…</Big></div>
          <div style={pop(t, wf(67, "outside"))}><Big size={54}>…but outside the synovial cavity</Big></div>
          <div><Chip t={t} t0={wf(68, "intracapsular")} bg={C.forest} size={44}>intracapsular</Chip></div>
          <div><Chip t={t} t0={wf(68, "extrasynovial")} bg={C.matcha} size={44}>extrasynovial</Chip></div>
        </div>
      </Seg>
    </Stage>
  );
};

/* ================= 6. BURSAE AND MOVEMENT ================= */
export const SBursae: React.FC = () => {
  const t = useT();
  const a = ST(6), b = BE(6);
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(70)}>
        <div style={abs(80, 30)}>
          <KneeSide t={t} w={FW} lit={{ quad: wf(69, "quadriceps"), patella: wf(69, "patella") }} dim={0.6} />
        </div>
        <Tag t={t} t0={wf(69, "quadriceps")} x={80} y={30} w={FW} pt={SP.quad} dx={-60} text="quadriceps tendon" hot size={26} />
        <Tag t={t} t0={wf(69, "patella")} x={80} y={30} w={FW} pt={SP.patella} dx={90} text="patella" size={26} />
        <ViewTag t={t} t0={a + 0.3} x={60} y={0} text="SIDE VIEW · FRONT →" />
        <Facts x={1000} y={20} w={780} items={[{ t: wf(69, "quadriceps"), text: "the quadriceps tendon wraps around the patella", bg: C.forest }]} />
      </Seg>
      <Seg t={t} a={s_(70)} b={s_(72)}>
        <Plate {...ANT} x={40} y={0} w={350} a={s_(70)} b={s_(72)} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.05, 0.5, 0.55]}
          labels={[{ x: 0.12, y: 0.7, text: "Patellar lig.", t: wf(70, "patellar"), side: "r", hot: true }, { x: 0.25, y: 0.46, text: "Patella", t: s_(70), side: "r" }]} />
        <Note t={t} t0={wf(70, "patellar") + 1.2} old="ligamentum patellae" x={420} y={640} />
        <div style={abs(440, 20)}>
          <KneeSide t={t} w={480} lit={{ patlig: wf(70, "patellar"), quad: wf(71, "extensor"), patella: wf(71, "extensor") }} dim={0.55} />
        </div>
        <Tag t={t} t0={wf(70, "tuberosity")} x={440} y={20} w={480} pt={SP.tub} dx={30} dy={40} text="tibial tuberosity" size={24} />
        <Facts x={1000} y={20} w={780}
          items={[
            { t: wf(70, "patellar"), text: "below the patella: the PATELLAR LIGAMENT", bg: C.forest },
            { t: wf(70, "tuberosity"), text: "→ attaches to the tibial tuberosity" },
            { t: wf(71, "extensor"), text: "tendon + patella + ligament = the EXTENSOR MECHANISM", bg: C.matcha },
            { t: wf(71, "straightens"), text: "it straightens your knee" },
          ]} />
      </Seg>
      <Seg t={t} a={s_(72)} b={s_(78)}>
        <div style={abs(40, 30)}>
          <KneeSide t={t} w={FW} burs={ramp(t, wf(72, "sacs"), wf(72, "sacs") + 0.6)} lit={{ supra: wf(74, "suprapatellar"), pre: wf(75, "prepatellar"), infs: wf(76, "infrapatellar"), infd: wf(76, "infrapatellar") + 0.25, semi: wf(77, "semimembranosus") }} dim={0.7} />
        </div>
        <Tag t={t} t0={wf(74, "suprapatellar")} x={40} y={30} w={FW} pt={SP.supra} dx={-130} text="suprapatellar" hot size={26} />
        <Tag t={t} t0={wf(75, "prepatellar")} x={40} y={30} w={FW} pt={SP.pre} dx={100} text="prepatellar" hot size={26} />
        <Tag t={t} t0={wf(76, "deep")} x={40} y={30} w={FW} pt={SP.infd} dx={-90} dy={30} text="deep infrapatellar" size={22} />
        <Tag t={t} t0={wf(76, "superficial")} x={40} y={30} w={FW} pt={SP.infs} dx={110} dy={10} text="superficial infrapatellar" size={22} />
        <Tag t={t} t0={wf(77, "semimembranosus")} x={40} y={30} w={FW} pt={SP.semi} dx={20} dy={-70} text="semimembranosus" hot size={26} />
        <ViewTag t={t} t0={s_(72) + 0.3} x={40} y={0} text="SIDE VIEW · FRONT →" />
        {t < s_(74) ? (
          <Facts x={1000} y={20} w={780}
            items={[
              { t: wf(72, "bursae"), text: "BURSAE = small fluid-filled sacs", bg: C.forest },
              { t: wf(72, "friction"), text: "they reduce friction" },
              { t: s_(73), text: "more than 10 around the knee — learn these 4", big: "4", bg: C.matcha },
            ]} />
        ) : (
          <>
            <Plate {...SAG} x={1180} y={0} w={560} a={s_(74)} b={s_(78)} zoomFrom={[1.0, 0.5, 0.5]} zoomTo={[1.0, 0.5, 0.5]}
              labels={[
                { x: 0.635, y: 0.29, text: "Suprapatellar", t: wf(74, "suprapatellar") + 0.2, side: "l", hot: true },
                { x: 0.63, y: 0.78, text: "Deep infrapatellar", t: wf(76, "deep"), side: "l" },
              ]} />
            <div style={abs(660, 40, { display: "flex", flexDirection: "column", gap: 18, width: 500 })}>
              <div><Chip t={t} t0={wf(74, "suprapatellar")} bg={C.forest} size={30}>1 · above the patella</Chip></div>
              <div><Chip t={t} t0={wf(74, "joint")} bg={C.card} color={C.forest} size={26}>usually connects with the joint</Chip></div>
              <div><Chip t={t} t0={wf(75, "prepatellar")} bg={C.forest} size={30}>2 · in front, under the skin</Chip></div>
              <div><Chip t={t} t0={wf(76, "infrapatellar")} bg={C.forest} size={30}>3 · below: deep + superficial</Chip></div>
              <div><Chip t={t} t0={wf(77, "semimembranosus")} bg={C.forest} size={30}>4 · behind the knee</Chip></div>
            </div>
            <Note t={t} t0={wf(75, "prepatellar")} old="bursa under quadriceps femoris" x={20} y={688} />
          </>
        )}
      </Seg>
      <Seg t={t} a={s_(78)} b={s_(80)}>
        <div style={abs(120, 30)}>
          <KneeSide t={t} w={FW} flex={40 * ramp(t, wf(79, "flex") - 0.6, wf(79, "flex") + 0.6) * (1 - ramp(t, e_(79), e_(79) + 0.5))} lit={{ quad: { a: wf(79, "quadriceps"), b: wf(79, "hamstrings") } }} dim={0.8} ext={1} />
        </div>
        <ViewTag t={t} t0={s_(78) + 0.3} x={60} y={0} text="SIDE VIEW · FRONT →" />
        <div style={abs(1000, 40, { width: 780, display: "flex", flexDirection: "column", gap: 26 })}>
          <div style={pop(t, s_(78))}><Big size={74}>Movement</Big></div>
          <div><Chip t={t} t0={wf(79, "quadriceps")} bg={C.red} size={44}>quadriceps → EXTENDS</Chip></div>
          <div><Chip t={t} t0={wf(79, "hamstrings")} bg={C.matcha} size={44}>hamstrings → FLEX</Chip></div>
        </div>
      </Seg>
      <Seg t={t} a={s_(80)} b={s_(82)}>
        <div style={abs(30, 70)}>
          <MenisciTop t={t} w={880} fem={ramp(t, s_(80), s_(80) + 0.5)} rot={-9 * ramp(t, wf(80, "rotates"), wf(80, "rotates") + 1.2)} dim={0.7} cols={0.3} />
        </div>
        <ViewTag t={t} t0={s_(80) + 0.3} x={40} y={0} text="TIBIA FROM ABOVE · DASHED = FEMORAL CONDYLES" />
        {(() => {
          const p = ramp(t, wf(81, "locks"), wf(81, "locks") + 0.3);
          return (
            <div style={abs(380, 250, { opacity: p, transform: `scale(${0.6 + 0.4 * p})`, background: C.forest, color: C.banana, fontFamily: FONT, fontWeight: 800, fontSize: 56, padding: "14px 30px 18px", borderRadius: 24, display: "flex", alignItems: "center", gap: 16 })}>
              <svg width={52} height={60} viewBox="0 0 52 60"><path d="M12 26 V16 a14 14 0 0 1 28 0 V26" fill="none" stroke={C.banana} strokeWidth={7} /><rect x={4} y={26} width={44} height={32} rx={8} fill={C.banana} /></svg>
              LOCKED
            </div>
          );
        })()}
        <Facts x={1000} y={20} w={780}
          items={[
            { t: wf(80, "straightens"), text: "knee fully straight while you stand…", bg: C.forest },
            { t: wf(80, "rotates"), text: "→ the femur rotates slightly MEDIALLY on the tibia" },
            { t: wf(81, "locks"), text: "this LOCKS the knee", bg: C.red },
            { t: wf(81, "little"), text: "stand with very little muscle effort" },
          ]} />
      </Seg>
      <Seg t={t} a={s_(82)} b={s_(83)}>
        <div style={abs(80, 30)}>
          <KneeSide t={t} w={FW} pop={ramp(t, wf(82, "muscle"), wf(82, "muscle") + 0.4)} lit={{ pop: wf(82, "popliteus") }} dim={0.6} ext={0.5} />
        </div>
        <Tag t={t} t0={wf(82, "popliteus")} x={80} y={30} w={FW} pt={SP.pop} dx={-100} text="popliteus" hot />
        <ViewTag t={t} t0={s_(82) + 0.3} x={60} y={0} text="SIDE VIEW · FRONT →" />
        <Facts x={1000} y={20} w={780}
          items={[
            { t: wf(82, "small"), text: "a small muscle behind the knee", bg: C.forest },
            { t: wf(82, "popliteus"), text: "the POPLITEUS", bg: C.red },
            { t: wf(82, "laterally"), text: "rotates the femur laterally → UNLOCKS the knee", bg: C.matcha },
          ]} />
      </Seg>
      <Seg t={t} a={s_(83)} b={b + 0.1}>
        <div style={abs(120, 30)}>
          <KneeFront t={t} w={FW} ring={ramp(t, wf(83, "ring"), wf(83, "ring") + 1.4)} dim={0.6} />
        </div>
        <Tag t={t} t0={wf(83, "genicular")} x={120} y={30} w={FW} pt={[400, 370]} dy={-40} dx={-150} text="genicular arteries" hot />
        <Facts x={1000} y={20} w={780}
          items={[
            { t: wf(83, "ring"), text: "a RING of genicular arteries around the knee", bg: C.red },
            { t: wf(83, "popliteal"), text: "mostly branches of the popliteal artery (behind the knee, dashed)" },
          ]} />
      </Seg>
    </Stage>
  );
};

/* ================= 7. MEMORY TRICKS ================= */
const TrickCard: React.FC<{ t: number; t0: number; n: number; title: string; children: React.ReactNode }> = ({ t, t0, n, title, children }) => (
  <div style={abs(0, 0, { width: 1800, height: 740, borderRadius: 44, background: C.forest, overflow: "hidden", ...pop(t, t0, 0.35) })}>
    <div style={abs(60, 40, { fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: C.matchaLight })}>TRICK {n}</div>
    <div style={abs(60, 80, { fontFamily: FONT, fontWeight: 800, fontSize: 56, color: C.paper })}>{title}</div>
    {children}
  </div>
);
export const STricks: React.FC = () => {
  const t = useT();
  const a = ST(7), b = BE(7);
  const W85 = SEG[85].w, n85 = SEG[85].t.length;
  const lampT = [W85[n85 - 4], W85[n85 - 3], W85[n85 - 2], W85[n85 - 1]];
  const pairs: [string, string, string, number][] = [
    ["L", "ateral", "condyle", wf(86, "lateral")],
    ["A", "nterior", "cruciate", wf(86, "anterior")],
    ["M", "edial", "condyle", wf(86, "medial")],
    ["P", "osterior", "cruciate", wf(86, "posterior")],
  ];
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(88)}>
        <TrickCard t={t} t0={a} n={1} title="The cruciates: think of a LAMP">
          <div style={abs(60, 190, { display: "flex", gap: 26 })}>
            {pairs.map(([L, rest, sub, tt], i) => (
              <div key={L} style={{ width: 250, textAlign: "center", fontFamily: FONT, fontWeight: 800 }}>
                <div style={{ ...pop(t, lampT[i]), fontSize: 190, lineHeight: 1, color: C.banana }}>{L}</div>
                <div style={{ ...pop(t, tt), fontSize: 40, color: C.paper, marginTop: 10 }}><span style={{ color: C.banana }}>{L}</span>{rest}</div>
                <div style={{ ...pop(t, tt + 0.2), fontSize: 30, color: C.matchaLight }}>{sub}</div>
              </div>
            ))}
          </div>
          <div style={abs(60, 560, { display: "flex", gap: 24 })}>
            <Chip t={t} t0={s_(87)} bg={C.banana} color={C.forest} size={36}>ACL → lateral femoral condyle</Chip>
            <Chip t={t} t0={wf(87, "attaches", 1) - 0.4} bg={C.paper} color={C.forest} size={36}>PCL → medial one</Chip>
          </div>
          <div style={abs(1150, 120, { width: 600, height: 600, overflow: "hidden", borderRadius: 36, background: C.card })}>
            <div style={abs(-225, -382)}>
              <KneeFront t={t} w={1050} lit={{ acl: { a: wf(86, "anterior"), b: wf(86, "medial") }, latC: { a: wf(86, "lateral"), b: wf(86, "medial") }, medC: wf(86, "medial"), pcl: wf(86, "posterior") }} dim={0.55} />
            </div>
          </div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={s_(88)} b={s_(91)}>
        <TrickCard t={t} t0={s_(88)} n={2} title="The name tells you the tibia">
          <div style={abs(60, 210, { width: 1000, display: "flex", flexDirection: "column", gap: 40 })}>
            {[
              ["ANTERIOR cruciate", "starts at the anterior tibia", "stops the tibia going anterior →", s_(89), wf(89, "stops")],
              ["POSTERIOR cruciate", "starts at the posterior tibia", "← stops it going posterior", s_(90), wf(90, "stops")],
            ].map(([h, s1, s2, t1, t2]) => (
              <div key={h as string} style={{ fontFamily: FONT, fontWeight: 800 }}>
                <div style={{ ...pop(t, t1 as number), fontSize: 64, color: C.banana, transformOrigin: "0% 50%" }}>{h}</div>
                <div style={{ ...pop(t, (t1 as number) + 0.6), fontSize: 38, color: C.paper, transformOrigin: "0% 50%" }}>{s1}</div>
                <div style={{ ...pop(t, t2 as number), fontSize: 38, color: C.matchaLight, transformOrigin: "0% 50%" }}>{s2}</div>
              </div>
            ))}
          </div>
          <div style={abs(1150, 120, { width: 600, height: 600, borderRadius: 36, background: C.card, overflow: "hidden" })}>
            <div style={abs(-139, -375)}>
              <KneeSide t={t} w={900} cruc={1} ext={0.3} dim={0.6}
                slide={22 * ramp(t, wf(89, "stops"), wf(89, "stops") + 0.5) * (1 - ramp(t, s_(90), s_(90) + 0.4)) - 22 * ramp(t, wf(90, "stops"), wf(90, "stops") + 0.5)}
                lit={{ acl: { a: s_(89), b: s_(90) }, pcl: s_(90) }} />
            </div>
          </div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={s_(91)} b={s_(94)}>
        <TrickCard t={t} t0={s_(91)} n={3} title="The menisci: M for medial, M for married">
          <div style={abs(60, 200, { width: 820, display: "flex", flexDirection: "column", gap: 26 })}>
            <div style={pop(t, wf(91, "married"))}><Big size={64} color={C.paper}><span style={{ color: C.banana }}>M</span>edial = <span style={{ color: C.banana }}>M</span>arried</Big></div>
            <div><Chip t={t} t0={wf(92, "married")} bg={C.banana} color={C.forest} size={38}>married to the MCL</Chip></div>
            <div><Chip t={t} t0={wf(92, "tied")} bg={C.red} size={38}>tied down → hurt more often</Chip></div>
            <div><Chip t={t} t0={wf(93, "single")} bg={C.paper} color={C.forest} size={38}>lateral = single, free to move</Chip></div>
          </div>
          <div style={abs(940, 160, { width: 820, height: 560, borderRadius: 36, background: C.card, overflow: "hidden" })}>
            <div style={abs(20, 0)}>
              <MenisciTop t={t} w={780} lit={{ medMen: wf(91, "medial"), mcl: wf(92, "married"), latMen: wf(93, "lateral") }} dim={0.6} cruc={0.4} />
            </div>
            {(() => {
              const p = ramp(t, wf(92, "married"), wf(92, "married") + 0.4);
              return (
                <svg width={120} height={120} viewBox="0 0 100 100" style={abs(30, 330, { opacity: p, transform: `scale(${0.5 + 0.5 * p})` })}>
                  <circle cx={50} cy={58} r={30} fill="none" stroke={C.bananaDark} strokeWidth={10} />
                  <path d="M38 22 L50 8 L62 22 L50 34 Z" fill="#BFE3EC" stroke={C.forest} strokeWidth={3} />
                </svg>
              );
            })()}
          </div>
        </TrickCard>
      </Seg>
      <Seg t={t} a={s_(94)} b={b + 0.1}>
        <div style={abs(60, 90)}>
          <StudyCard t={t} flip={wf(94, "flip") - 0.1} w={860}
            front={
              <div style={{ position: "relative", width: 800, height: 500 }}>
                <div style={{ position: "absolute", left: 30, top: 10, fontSize: 40, color: C.matcha }}>Name the structure</div>
                <div style={{ position: "absolute", left: 150, top: 80 }}>
                  <MenisciTop t={t} w={540} lit={{ medMen: s_(94) }} dim={0.55} cruc={0.4} cols={0.4} />
                </div>
              </div>
            }
            back={"Medial meniscus\nC-shaped · attached to the MCL"} />
        </div>
        <div style={abs(1020, 80, { width: 760 })}>
          <div style={pop(t, s_(94))}><Big size={70}>Make it stick</Big></div>
          <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 18 }}>
            <div><Chip t={t} t0={wf(94, "look")} bg={C.card} color={C.forest} size={40}>1 · look at the picture</Chip></div>
            <div><Chip t={t} t0={wf(94, "name")} bg={C.matcha} size={40}>2 · name the structure</Chip></div>
            <div><Chip t={t} t0={wf(94, "flip")} bg={C.forest} size={40}>3 · flip the card</Chip></div>
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
    n: 1, si: 96, q: "Which bone sits next to the knee, but is NOT part of the knee joint?", a: "The fibula",
    visual: (t, r, ans) => (
      <>
        <div style={abs(200, 30)}><KneeFront t={t} w={FW} lit={r ? { fibula: ans } : {}} dim={r ? 0.45 : 1} men={0.5} ligs={0.4} /></div>
        {r ? <Tag t={t} t0={ans} x={200} y={30} w={FW} pt={FP.fibula} text="Fibula" hot /> : null}
      </>
    ),
  },
  {
    n: 2, si: 98, q: "Which meniscus is firmly attached to the MCL?", a: "The medial meniscus",
    visual: (t, r, ans) => (
      <>
        <div style={abs(40, 90)}><MenisciTop t={t} w={900} lit={r ? { medMen: ans, mcl: ans + 0.3 } : {}} dim={r ? 0.55 : 1} /></div>
        {r ? <Tag t={t} t0={ans} x={40} y={90} w={900} vbw={900} pt={[300, 120]} text="Medial meniscus" hot /> : null}
      </>
    ),
  },
  {
    n: 3, si: 100, q: "Which ligament stops the tibia from sliding forward under the femur?", a: "ACL",
    visual: (t, r, ans) => (
      <>
        <div style={abs(220, 30)}><KneeSide t={t} w={FW} cruc={1} ext={0.35} slide={r ? 16 * ramp(t, ans, ans + 0.6) : 0} lit={r ? { acl: ans } : {}} dim={r ? 0.55 : 1} /></div>
        {r ? <Tag t={t} t0={ans} x={220} y={30} w={FW} pt={SP.acl} dx={90} dy={20} text="ACL" hot /> : null}
      </>
    ),
  },
  {
    n: 4, si: 102, q: "Which muscle unlocks the fully straightened knee?", a: "Popliteus",
    visual: (t, r, ans) => (
      <>
        <div style={abs(220, 30)}><KneeSide t={t} w={FW} pop={r ? ramp(t, ans, ans + 0.3) : 0} lit={r ? { pop: ans } : {}} dim={r ? 0.55 : 1} /></div>
        {r ? <Tag t={t} t0={ans} x={220} y={30} w={FW} pt={SP.pop} dx={-110} text="Popliteus" hot /> : null}
      </>
    ),
  },
  {
    n: 5, si: 104, q: "What is the largest sesamoid bone in the body?", a: "The patella",
    visual: (t, r, ans) => (
      <>
        <Plate {...ANT} x={330} y={0} w={350} a={s_(104) - 0.2} b={s_(106) - 0.2} zoomFrom={[1.0, 0.4, 0.45]} zoomTo={[1.1, 0.35, 0.45]}
          labels={r ? [{ x: 0.25, y: 0.46, text: "Patella", t: ans, side: "r", hot: true }] : []} />
      </>
    ),
  },
];
export const SQuiz: React.FC = () => {
  const t = useT();
  const a = ST(8), b = BE(8);
  return (
    <Stage a={a} b={b}>
      <Seg t={t} a={a} b={s_(96) - 0.2}>
        <div style={abs(0, 0, { width: 1800, height: 740, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" })}>
          <div style={pop(t, a)}><Big size={150}>QUIZ</Big></div>
          <div style={{ marginTop: 20 }}><Chip t={t} t0={wf(95, "pause")} bg={C.banana} color={C.forest} size={44}>5 questions · pause if you need more time</Chip></div>
        </div>
      </Seg>
      {QS.map((q, i) => {
        const ask = s_(q.si), pause = e_(q.si), ans = s_(q.si + 1);
        const end = i < QS.length - 1 ? s_(QS[i + 1].si) - 0.2 : s_(106) - 0.2;
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
      <Seg t={t} a={s_(106) - 0.2} b={b + 0.1}>
        <div style={abs(0, 0, { width: 1800, height: 740, borderRadius: 44, background: C.card, border: `4px solid ${C.line}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" })}>
          <Big size={110}>Your score: <span style={{ color: C.matcha }}>? / 5</span></Big>
          <div style={{ marginTop: 30 }}><Chip t={t} t0={wf(106, "tell")} bg={C.forest} size={46}>tell me in the comments</Chip></div>
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
    ["3 bones", "femur · tibia · patella (NOT the fibula)", Math.max(a, s_(108)), "#EFE6CC"],
    ["3 joints", "2 tibiofemoral + 1 patellofemoral · 1 capsule", s_(109), C.matchaLight],
    ["2 menisci", "medial = C, tied down · lateral = O, mobile", s_(110), "#9CC6BE"],
    ["Ligaments", "collaterals: sideways · cruciates: forward / back", s_(111), "#D9B48F"],
    ["Popliteus", "unlocks the straight knee", s_(112), C.red],
    ["LAMP", "Lateral → Anterior · Medial → Posterior", s_(113), C.banana],
  ];
  const ot = s_(114) - 0.2;
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
                <div style={{ width: 340, fontSize: 48, color: C.paper }}>{h}</div>
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
              <div style={{ background: C.red, color: C.paper, borderRadius: 50, padding: "18px 54px 22px", fontSize: 54, letterSpacing: 3, transform: `scale(${1 + 0.05 * Math.max(0, Math.sin((t - ot) * 5))})`, opacity: ramp(t, wf(114, "subscribe"), wf(114, "subscribe") + 0.3) }}>SUBSCRIBE</div>
            </div>
            <div style={{ marginTop: 40, background: C.paper, color: C.forest, borderRadius: 24, padding: "16px 30px 20px", fontSize: 40, opacity: ramp(t, s_(115), s_(115) + 0.4), width: "fit-content" }}>Which joint should we cover next?</div>
          </div>
        </div>
      )}
    </Stage>
  );
};
