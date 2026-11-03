import React from "react";
import { C, FONT, ramp } from "./kit";

/* lit: id -> start time, or {a,b} window. A part glows while lit; when anything is lit the rest dims. */
export type Lit = Record<string, number | { a: number; b: number }>;
export const litK = (t: number, v: number | { a: number; b: number } | undefined) => {
  if (v === undefined) return 0;
  if (typeof v === "number") return ramp(t, v - 0.1, v + 0.3);
  return ramp(t, v.a - 0.1, v.a + 0.3) * (1 - ramp(t, v.b - 0.1, v.b + 0.3));
};
const anyLit = (t: number, lit: Lit) => Math.max(0, ...Object.values(lit).map((v) => litK(t, v)));
const mix = (a: string, b: string, k: number) => {
  const h = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const x = h(a), y = h(b);
  return "#" + x.map((v, i) => Math.round(v + (y[i] - v) * k).toString(16).padStart(2, "0")).join("");
};

/* ---------------- colours ---------------- */
export const EC = {
  sclera: "#FFFDF3", cornea: "#BFE3EE", choroid: "#9C4A3C", ciliary: "#D9735F", iris: "#6F8F3A", retina: "#E9A23B",
  lens: "#EAF6F8", aq: "#D6EEF4", vit: "#EEF4E6", nerve: "#F2D14E", macula: "#F2D14E", disc: "#FFF4C2", zon: "#8FA86A",
};

/* ---------------- geometry of the horizontal section (viewBox 900 x 700), front = LEFT ---------------- */
const CX = 470, CY = 350;
const pol = (r: number, deg: number): [number, number] => [CX + r * Math.cos((deg * Math.PI) / 180), CY - r * Math.sin((deg * Math.PI) / 180)];
const arc = (r: number, a0: number, a1: number) => {
  // from angle a0 to a1 going clockwise in screen through the BACK (angle 0)
  const [x0, y0] = pol(r, a0), [x1, y1] = pol(r, a1);
  const large = Math.abs(a0 - a1) > 180 ? 1 : 0;
  return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
};
const ring = (r0: number, r1: number, a0: number, a1: number) => {
  // band between radius r0 (outer) and r1 (inner) from a0 (top, e.g. 150) clockwise to a1 (bottom, e.g. -150)
  const [x0, y0] = pol(r0, a0), [x1, y1] = pol(r0, a1), [x2, y2] = pol(r1, a1), [x3, y3] = pol(r1, a0);
  const large = Math.abs(a0 - a1) > 180 ? 1 : 0;
  return `M${x0} ${y0} A${r0} ${r0} 0 ${large} 1 ${x1} ${y1} L${x2} ${y2} A${r1} ${r1} 0 ${large} 0 ${x3} ${y3} Z`;
};
const RS = 262, RC = 246, RR = 236, RI = 224; // sclera outer, choroid outer, retina outer, retina inner
const AL = 150; // sclera reaches ±150° (limbus)
const LIMB_T = pol(RS, AL), LIMB_B = pol(RS, -AL);
// cornea: arc through the limbus points bulging forward to x ~ 186
const CORR = 182, CORCX = LIMB_T[0] + Math.sqrt(CORR * CORR - (CY - LIMB_T[1]) ** 2) - 0; // centre right of limbus
const corneaFrontX = CORCX - CORR;
const LIMB_Ti = pol(RS - 14, AL - 1.5), LIMB_Bi = pol(RS - 14, -AL + 1.5);
const corneaBand = `M${LIMB_T[0]} ${LIMB_T[1]} A${CORR} ${CORR} 0 0 0 ${LIMB_B[0]} ${LIMB_B[1]} L${LIMB_Bi[0]} ${LIMB_Bi[1]} A${CORR - 13} ${CORR - 13} 0 0 1 ${LIMB_Ti[0]} ${LIMB_Ti[1]} Z`;
// lens
const LX = 318, LRX = 40, LRY = 98;
// iris: from ciliary root at x~268 toward axis, leaving the pupil (|y-CY| < 38)
const IRX = 262, PUP = 38;
const irisT = `M${IRX - 5} ${CY - 132} C ${IRX - 9} ${CY - 100}, ${IRX - 7} ${CY - 60}, ${IRX - 2} ${CY - PUP} L ${IRX + 8} ${CY - PUP} C ${IRX + 10} ${CY - 70}, ${IRX + 12} ${CY - 105}, ${IRX + 18} ${CY - 136} Z`;
const irisB = irisT.replace(/(-?\d+\.?\d*) (-?\d+\.?\d*)/g, (m, x, y) => `${x} ${(2 * CY - parseFloat(y)).toFixed(1)}`);
// ciliary body: wedge inside the sclera between ~132° and ~150°
const cil = (sgn: 1 | -1) => {
  const p = (r: number, d: number) => pol(r, sgn * d);
  const a = p(RS - 14, 149), b = p(RC, 132), c = p(RR - 28, 136), d = [IRX + 22, CY - sgn * 140] as [number, number];
  return `M${a[0]} ${a[1]} L${b[0]} ${b[1]} Q ${c[0]} ${c[1]} ${d[0]} ${d[1]} Z`;
};
// anterior chamber (between cornea and iris/lens front)
const antCh = `M${LIMB_Ti[0]} ${LIMB_Ti[1]} A${CORR - 13} ${CORR - 13} 0 0 0 ${LIMB_Bi[0]} ${LIMB_Bi[1]} L ${IRX - 5} ${CY + 132} C ${IRX - 9} ${CY + 100}, ${IRX - 7} ${CY + 60}, ${IRX - 2} ${CY + PUP} Q ${LX - LRX + 2} ${CY} ${IRX - 2} ${CY - PUP} C ${IRX - 7} ${CY - 60}, ${IRX - 9} ${CY - 100}, ${IRX - 5} ${CY - 132} Z`;
// posterior chamber (small: behind iris, in front of lens & zonules)
const postCh = (sgn: 1 | -1) => `M ${IRX + 8} ${CY - sgn * PUP} C ${IRX + 10} ${CY - sgn * 70}, ${IRX + 12} ${CY - sgn * 105}, ${IRX + 18} ${CY - sgn * 136} L ${IRX + 30} ${CY - sgn * 150} L ${LX + 4} ${CY - sgn * (LRY + 4)} Q ${LX - LRX - 4} ${CY - sgn * 60} ${IRX + 8} ${CY - sgn * PUP} Z`;
export const EYE_PT: Record<string, [number, number]> = {
  sclera: pol(RS - 6, 60), cornea: [corneaFrontX + 6, CY - 40], choroid: pol(RC - 4, 45), ciliary: [IRX + 20, CY - 155], iris: [IRX + 2, CY - 95],
  pupil: [IRX + 3, CY], retina: pol(RI + 5, 30), lens: [LX, CY + 40], zon: [LX - 4, CY - LRY - 22], ant: [corneaFrontX + 32, CY + 60],
  post: [IRX + 22, CY - 112], vit: [CX + 30, CY + 40], fovea: pol(RI, 0), disc: pol(RI, -17), nerve: [800, CY + 150], schlemm: [LIMB_T[0] + 2, LIMB_T[1] + 10],
  front: [corneaFrontX, CY],
};

export const EyeSection: React.FC<{ t: number; w: number; lit?: Lit; dim?: number; flow?: number; light?: number; layers?: number; tags?: boolean; accom?: number; cloud?: number }> = ({ t, w, lit = {}, dim = 0.55, flow = 0, light = 0, layers = 0, accom = 0, cloud = 0 }) => {
  const any = anyLit(t, lit) * dim;
  const F = (id: string, col: string) => {
    const k = litK(t, lit[id]);
    return { fill: mix(mix(col, "#FFFFFF", any * (1 - k) * 0.7), "#FFF2A0", k * 0.25), opacity: 1 - any * (1 - k) * 0.35 };
  };
  const Gl = (id: string) => {
    const k = litK(t, lit[id]);
    return k > 0 ? { stroke: C.banana, strokeWidth: 4 + 6 * k, strokeOpacity: k } : { stroke: C.forest, strokeWidth: 2.5 };
  };
  const h = (w * 700) / 900;
  const [dx, dy] = EYE_PT.disc;
  const [fx, fy] = EYE_PT.fovea;
  // flow path for aqueous humor: ciliary processes -> posterior chamber -> pupil -> anterior chamber -> angle (Schlemm)
  const flowPts: [number, number][] = [[IRX + 26, CY - 145], [IRX + 18, CY - 100], [IRX + 12, CY - 55], [IRX + 4, CY - 12], [IRX - 14, CY - 4], [corneaFrontX + 40, CY - 30], [corneaFrontX + 46, CY - 90], [LIMB_Ti[0] + 6, LIMB_Ti[1] + 14], [LIMB_T[0] + 2, LIMB_T[1] + 6]];
  const along = (u: number): [number, number] => {
    const L = flowPts.length - 1, f = Math.max(0, Math.min(0.9999, u)) * L, i = Math.floor(f), r = f - i;
    return [flowPts[i][0] + (flowPts[i + 1][0] - flowPts[i][0]) * r, flowPts[i][1] + (flowPts[i + 1][1] - flowPts[i][1]) * r];
  };
  return (
    <svg width={w} height={h} viewBox="0 0 900 700" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="vitG" cx="0.55" cy="0.45" r="0.6"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor={EC.vit} /></radialGradient>
        <radialGradient id="lensG" cx="0.4" cy="0.35" r="0.7"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#CFE6EC" /></radialGradient>
        <linearGradient id="nerveG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#F7E08A" /><stop offset="1" stopColor={EC.nerve} /></linearGradient>
      </defs>
      {/* optic nerve (leaves the back of the eye, slightly toward the nose) */}
      <g transform={`rotate(17 ${dx} ${dy})`}>
        <rect x={dx} y={dy - 36} width={250} height={72} rx={18} fill={EC.sclera} stroke={C.forest} strokeWidth={2.5} />
        <rect x={dx} y={dy - 26} width={246} height={52} rx={14} {...F("nerve", EC.nerve)} {...Gl("nerve")} />
        {[-12, 0, 12].map((o) => <line key={o} x1={dx + 40} y1={dy + o} x2={dx + 236} y2={dy + o} stroke={C.forest} strokeOpacity={0.25} strokeWidth={2} />)}
      </g>
      {/* vitreous body */}
      <circle cx={CX} cy={CY} r={RI} fill="url(#vitG)" opacity={F("vit", EC.vit).opacity} />
      {litK(t, lit.vit) > 0 && <circle cx={CX} cy={CY} r={RI - 6} fill="#FFF2A0" opacity={0.35 * litK(t, lit.vit)} />}
      {/* wall layers */}
      <path d={ring(RS, RC, AL, -AL)} {...F("sclera", EC.sclera)} {...Gl("sclera")} />
      <path d={ring(RC, RR, 132, -132)} {...F("choroid", EC.choroid)} {...Gl("choroid")} />
      <path d={ring(RR, RI, 130, -130)} {...F("retina", EC.retina)} {...Gl("retina")} />
      {/* layer ring highlight for the "three layers" moment */}
      {layers > 0 && (
        <g opacity={layers}>
          <path d={arc(RS + 12, 150, -150)} fill="none" stroke={C.forest} strokeWidth={5} strokeDasharray="2 14" strokeLinecap="round" />
        </g>
      )}
      {/* macula + fovea */}
      <ellipse cx={fx - 4} cy={fy} rx={12} ry={34} {...F("fovea", EC.macula)} stroke={C.forest} strokeWidth={2} />
      <path d={`M${fx - 12} ${fy - 9} Q ${fx + 3} ${fy} ${fx - 12} ${fy + 9}`} fill="none" stroke={C.forest} strokeWidth={3} />
      {litK(t, lit.fovea) > 0 && <circle cx={fx - 4} cy={fy} r={44} fill="none" stroke={C.banana} strokeWidth={8} opacity={litK(t, lit.fovea)} />}
      {/* optic disc */}
      <ellipse cx={dx - 2} cy={dy} rx={10} ry={26} transform={`rotate(17 ${dx} ${dy})`} {...F("disc", EC.disc)} {...Gl("disc")} />
      {/* ciliary bodies */}
      <path d={cil(1)} {...F("ciliary", EC.ciliary)} {...Gl("ciliary")} />
      <path d={cil(-1)} {...F("ciliary", EC.ciliary)} {...Gl("ciliary")} />
      {/* ciliary processes ridges */}
      {[0, 1, 2].map((i) => [1, -1].map((s) => <path key={`${i}${s}`} d={`M${IRX + 22 + i * 7} ${CY - s * (142 + i * 4)} l 8 ${-s * 10}`} stroke={C.forest} strokeWidth={2} />))}
      {/* chambers */}
      <path d={antCh} {...F("ant", EC.aq)} stroke="none" />
      <path d={postCh(1)} {...F("post", EC.aq)} stroke="none" />
      <path d={postCh(-1)} {...F("post", EC.aq)} stroke="none" />
      {litK(t, lit.ant) > 0 && <path d={antCh} fill="none" stroke={C.banana} strokeWidth={8} opacity={litK(t, lit.ant)} />}
      {litK(t, lit.post) > 0 && [1, -1].map((s) => <path key={s} d={postCh(s as 1 | -1)} fill="none" stroke={C.banana} strokeWidth={7} opacity={litK(t, lit.post)} />)}
      {/* zonular fibres */}
      {[1, -1].map((s) =>
        [0, 1, 2, 3, 4].map((i) => (
          <line key={`${s}${i}`} x1={LX - 22 + i * 11} y1={CY - s * (LRY - 6 + (i === 2 ? 4 : 0))} x2={IRX + 30 + i * 4} y2={CY - s * (150 - i)} stroke={litK(t, lit.zon) > 0 ? C.banana : EC.zon} strokeWidth={2.5 + 2 * litK(t, lit.zon)} opacity={1 - any * 0.5 * (1 - litK(t, lit.zon))} />
        ))
      )}
      {/* lens */}
      <ellipse cx={LX} cy={CY} rx={LRX + 12 * accom} ry={LRY - 6 * accom} fill="url(#lensG)" opacity={F("lens", EC.lens).opacity} {...Gl("lens")} />
      {cloud > 0 && <ellipse cx={LX} cy={CY} rx={LRX - 4} ry={LRY - 6} fill="#9AA38E" opacity={0.75 * cloud} />}
      {/* iris */}
      <path d={irisT} {...F("iris", EC.iris)} {...Gl("iris")} />
      <path d={irisB} {...F("iris", EC.iris)} {...Gl("iris")} />
      {litK(t, lit.pupil) > 0 && <ellipse cx={IRX + 3} cy={CY} rx={20} ry={PUP + 6} fill="none" stroke={C.red} strokeWidth={6} strokeDasharray="8 8" opacity={litK(t, lit.pupil)} />}
      {/* cornea */}
      <path d={corneaBand} {...F("cornea", EC.cornea)} {...Gl("cornea")} />
      {/* canal of Schlemm */}
      {[LIMB_T, LIMB_B].map(([x, y], i) => <circle key={i} cx={x + 4} cy={y + (i ? -10 : 10)} r={6} fill={litK(t, lit.schlemm) > 0 ? C.red : "#7FB6C7"} stroke={C.forest} strokeWidth={2} />)}
      {/* aqueous humor flow */}
      {flow > 0 &&
        Array.from({ length: 9 }).map((_, i) => {
          const u = ((t * 0.18 + i / 9) % 1);
          const [x, y] = along(u);
          const x2 = x, y2 = 2 * CY - y;
          return (
            <g key={i} opacity={flow * Math.sin(Math.PI * u)}>
              <circle cx={x} cy={y} r={7} fill="#3F9BB8" stroke={C.paper} strokeWidth={2} />
              <circle cx={x2} cy={y2} r={7} fill="#3F9BB8" stroke={C.paper} strokeWidth={2} />
            </g>
          );
        })}
      {/* light rays */}
      {light > 0 &&
        [-60, -30, 0, 30, 60].map((o, i) => {
          const k = ramp(light, 0, 1);
          const x0 = 0, x1 = corneaFrontX, x2 = LX, x3 = fx - 8;
          const y1 = CY + o, y2 = CY + o * 0.55, y3 = fy;
          const p = Math.min(1, k * 1.0);
          const seg = (a: [number, number], b: [number, number], u: number) => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
          const pts: [number, number][] = [[x0, y1], [x1, y1], [x2, y2], [x3, y3]];
          const L = 3 * p, n = Math.floor(L);
          const path = pts.slice(0, n + 1).map((q) => q.join(" "));
          if (n < 3) path.push(seg(pts[n], pts[n + 1], L - n).join(" "));
          return <polyline key={i} points={path.join(", ")} fill="none" stroke={C.banana} strokeWidth={5} strokeLinejoin="round" opacity={0.95 - Math.abs(o) / 200} />;
        })}
    </svg>
  );
};

/* ---------------- retina layers (viewBox 900 x 640). Light comes from the TOP (vitreous side). ---------------- */
export const RetinaCells: React.FC<{ t: number; w: number; lit?: Lit; dim?: number; light?: number; signal?: number }> = ({ t, w, lit = {}, dim = 0.55, light = 0, signal = 0 }) => {
  const any = anyLit(t, lit) * dim;
  const op = (id: string) => 1 - any * (1 - litK(t, lit[id])) * 0.6;
  const ring = (id: string) => litK(t, lit[id]);
  const h = (w * 640) / 900;
  const cols = [90, 190, 290, 390, 490, 590, 690, 790];
  return (
    <svg width={w} height={h} viewBox="0 0 900 640">
      {/* layer bands */}
      <rect x={20} y={540} width={860} height={80} rx={14} fill={EC.choroid} opacity={op("choroid")} />
      <text x={36} y={592} fontFamily={FONT} fontWeight={800} fontSize={26} fill={C.paper} opacity={op("choroid")}>choroid</text>
      <rect x={20} y={490} width={860} height={50} fill="#4A3A2E" opacity={op("pigment")} />
      <text x={36} y={524} fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.paper} opacity={op("pigment")}>pigmented layer</text>
      {ring("pigment") > 0 && <rect x={20} y={490} width={860} height={50} fill="none" stroke={C.banana} strokeWidth={7} opacity={ring("pigment")} />}
      {/* photoreceptors */}
      {cols.map((x, i) => {
        const cone = i % 3 === 1;
        const id = cone ? "cones" : "rods";
        const k = ring(id);
        return (
          <g key={x} opacity={op(id)}>
            {cone ? (
              <path d={`M${x - 16} 480 L${x - 16} 420 Q ${x} 380 ${x + 16} 420 L${x + 16} 480 Z`} fill={k > 0 ? C.banana : "#E9A23B"} stroke={C.forest} strokeWidth={3} />
            ) : (
              <rect x={x - 10} y={380} width={20} height={100} rx={9} fill={k > 0 ? C.banana : "#8FA86A"} stroke={C.forest} strokeWidth={3} />
            )}
            <circle cx={x} cy={360} r={13} fill={C.card} stroke={C.forest} strokeWidth={3} />
            <line x1={x} y1={347} x2={x} y2={320} stroke={C.forest} strokeWidth={3} />
            {k > 0 && <circle cx={x} cy={430} r={46} fill="none" stroke={C.banana} strokeWidth={6} opacity={k} />}
          </g>
        );
      })}
      {/* bipolar cells */}
      {[140, 340, 540, 740].map((x) => (
        <g key={x} opacity={op("bipolar")}>
          <line x1={x - 50} y1={320} x2={x} y2={268} stroke={C.forest} strokeWidth={3} />
          <line x1={x + 50} y1={320} x2={x} y2={268} stroke={C.forest} strokeWidth={3} />
          <ellipse cx={x} cy={250} rx={18} ry={24} fill={ring("bipolar") > 0 ? C.banana : "#BFD9E6"} stroke={C.forest} strokeWidth={3} />
          <line x1={x} y1={226} x2={x} y2={186} stroke={C.forest} strokeWidth={3} />
        </g>
      ))}
      {/* ganglion cells + axons */}
      {[240, 640].map((x) => (
        <g key={x} opacity={op("ganglion")}>
          <line x1={x - 100} y1={186} x2={x} y2={150} stroke={C.forest} strokeWidth={3} />
          <line x1={x + 100} y1={186} x2={x} y2={150} stroke={C.forest} strokeWidth={3} />
          <circle cx={x} cy={132} r={28} fill={ring("ganglion") > 0 ? C.banana : "#D9735F"} stroke={C.forest} strokeWidth={3} />
          <path d={`M${x + 20} 112 Q ${x + 80} 70 ${x + 220} 70`} fill="none" stroke={ring("axons") > 0 ? C.red : C.forest} strokeWidth={ring("axons") > 0 ? 7 : 4} />
        </g>
      ))}
      <text x={600} y={52} fontFamily={FONT} fontWeight={800} fontSize={26} fill={C.forest} opacity={op("axons")}>to the optic nerve →</text>
      {/* light arrows from the top */}
      {light > 0 && [120, 450, 780].map((x) => {
        const y = -10 + 470 * ramp(light, 0, 1);
        return (
          <g key={x}>
            <line x1={x} y1={-10} x2={x} y2={y} stroke={C.banana} strokeWidth={10} strokeLinecap="round" opacity={0.85} />
            <circle cx={x} cy={y} r={12} fill={C.banana} stroke={C.forest} strokeWidth={3} />
          </g>
        );
      })}
      {/* signal travelling back up */}
      {signal > 0 && [90, 590].map((x, i) => {
        const u = ramp(signal, 0, 1);
        const y = 420 - 300 * u;
        const xx = x + ((i ? 640 : 240) - x) * u;
        return <circle key={x} cx={xx} cy={y} r={14} fill={C.red} stroke={C.paper} strokeWidth={4} />;
      })}
    </svg>
  );
};

/* ---------------- right eye from the front, with the six extraocular muscles (viewBox 800 x 700) ----------------
   Seen facing the person: their nose is on the viewer's RIGHT for their right eye. */
export const MCOL: Record<string, string> = { lr: "#E9A23B", mr: "#8FA86A", sr: "#7FB6C7", ir: "#B79CE0", so: C.red, io: "#F0A868", lps: "#BFD9E6" };
const MDIR: Record<string, [number, number]> = { lr: [-1, 0], mr: [1, 0], sr: [0, -1], ir: [0, 1], so: [-0.75, 0.75], io: [-0.75, -0.75] };
export const EyeFront: React.FC<{ t: number; w: number; lit?: Lit; dim?: number; gaze?: [number, number]; arrows?: Lit; nerves?: number }> = ({ t, w, lit = {}, dim = 0.6, gaze = [0, 0], arrows = {}, nerves = 0 }) => {
  const any = anyLit(t, lit) * dim;
  const op = (id: string) => 1 - any * (1 - litK(t, lit[id])) * 0.65;
  const gl = (id: string) => litK(t, lit[id]);
  const h = (w * 700) / 800;
  const cx = 400, cy = 360, R = 170;
  const band = (id: string, d: string) => (
    <path d={d} fill={MCOL[id]} stroke={gl(id) > 0 ? C.banana : C.forest} strokeWidth={gl(id) > 0 ? 9 : 3} opacity={op(id)} />
  );
  const gx = cx + gaze[0] * 46, gy = cy + gaze[1] * 46;
  return (
    <svg width={w} height={h} viewBox="0 0 800 700" style={{ overflow: "visible" }}>
      {/* muscles (behind the globe) */}
      {band("sr", `M${cx - 60} ${cy - R + 30} L${cx - 70} ${cy - R - 130} L${cx + 70} ${cy - R - 130} L${cx + 60} ${cy - R + 30} Z`)}
      {band("ir", `M${cx - 60} ${cy + R - 30} L${cx - 70} ${cy + R + 130} L${cx + 70} ${cy + R + 130} L${cx + 60} ${cy + R - 30} Z`)}
      {band("lr", `M${cx - R + 30} ${cy - 60} L${cx - R - 150} ${cy - 70} L${cx - R - 150} ${cy + 70} L${cx - R + 30} ${cy + 60} Z`)}
      {band("mr", `M${cx + R - 30} ${cy - 60} L${cx + R + 150} ${cy - 70} L${cx + R + 150} ${cy + 70} L${cx + R - 30} ${cy + 60} Z`)}
      {/* superior oblique: from back of orbit up along medial wall, through trochlea, then back under SR */}
      {band("so", `M${cx + R + 140} ${cy - R - 120} L${cx + R + 60} ${cy - R - 60} Q ${cx + 30} ${cy - R - 10} ${cx - 40} ${cy - R + 50} L ${cx - 20} ${cy - R + 78} Q ${cx + 50} ${cy - R + 30} ${cx + R + 80} ${cy - R - 30} L${cx + R + 160} ${cy - R - 96} Z`)}
      <circle cx={cx + R + 70} cy={cy - R - 48} r={22} fill={C.card} stroke={C.forest} strokeWidth={4} opacity={op("so")} />
      <text x={cx + R + 100} y={cy - R - 70} fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.forest} opacity={op("so") * (gl("so") > 0 ? 1 : 0.7)}>trochlea</text>
      {/* inferior oblique: from orbital floor medially, under the eye to the lateral side */}
      {band("io", `M${cx + R + 90} ${cy + R + 70} Q ${cx} ${cy + R + 90} ${cx - R - 10} ${cy + 90} L ${cx - R + 20} ${cy + 50} Q ${cx + 10} ${cy + R + 36} ${cx + R + 70} ${cy + R + 30} Z`)}
      {/* globe */}
      <circle cx={cx} cy={cy} r={R} fill={EC.sclera} stroke={C.forest} strokeWidth={4} />
      <circle cx={gx} cy={gy} r={78} fill={EC.iris} stroke={C.forest} strokeWidth={3} />
      {Array.from({ length: 18 }).map((_, i) => {
        const a = (i / 18) * Math.PI * 2;
        return <line key={i} x1={gx + Math.cos(a) * 34} y1={gy + Math.sin(a) * 34} x2={gx + Math.cos(a) * 74} y2={gy + Math.sin(a) * 74} stroke={C.forest} strokeOpacity={0.3} strokeWidth={2} />;
      })}
      <circle cx={gx} cy={gy} r={32} fill={C.forest} />
      <circle cx={gx - 12} cy={gy - 12} r={9} fill={C.paper} />
      {/* action arrows */}
      {Object.keys(MDIR).map((id) => {
        const k = litK(t, arrows[id]);
        if (k <= 0) return null;
        const [ux, uy] = MDIR[id];
        const n = Math.hypot(ux, uy), ex = ux / n, ey = uy / n;
        const x0 = cx + ex * 40, y0 = cy + ey * 40, x1 = cx + ex * (40 + 200 * k), y1 = cy + ey * (40 + 200 * k);
        const ang = (Math.atan2(ey, ex) * 180) / Math.PI;
        return (
          <g key={id}>
            <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={C.forest} strokeWidth={16} strokeLinecap="round" />
            <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={MCOL[id]} strokeWidth={9} strokeLinecap="round" />
            <g transform={`translate(${x1} ${y1}) rotate(${ang})`}><path d="M-6 -26 L34 0 L-6 26 Z" fill={MCOL[id]} stroke={C.forest} strokeWidth={4} strokeLinejoin="round" /></g>
          </g>
        );
      })}
      {/* nose marker */}
      <g opacity={0.9}>
        <text x={cx + R + 200} y={cy + 12} fontFamily={FONT} fontWeight={800} fontSize={28} fill={C.matcha} textAnchor="middle">NOSE</text>
        <text x={cx + R + 200} y={cy + 44} fontFamily={FONT} fontWeight={800} fontSize={22} fill={C.matcha} textAnchor="middle">(medial)</text>
        <text x={cx - R - 200} y={cy + 12} fontFamily={FONT} fontWeight={800} fontSize={28} fill={C.matcha} textAnchor="middle">EAR</text>
        <text x={cx - R - 200} y={cy + 44} fontFamily={FONT} fontWeight={800} fontSize={22} fill={C.matcha} textAnchor="middle">(lateral)</text>
      </g>
    </svg>
  );
};
export const EF_PT: Record<string, [number, number]> = { sr: [400, 90], ir: [400, 640], lr: [120, 360], mr: [680, 360], so: [560, 110], io: [560, 600], trochlea: [640, 142] };

/* ---------------- face-on eye with lids, lacrimal gland and tear path (viewBox 900 x 520) ---------------- */
export const EyeLids: React.FC<{ t: number; w: number; lit?: Lit; tears?: number }> = ({ t, w, lit = {}, tears = 0 }) => {
  const h = (w * 520) / 900;
  const g = (id: string) => litK(t, lit[id]);
  // viewer sees the person's RIGHT eye: lateral = viewer's left, nose = viewer's right
  const path: [number, number][] = [[230, 120], [300, 210], [450, 300], [640, 300], [700, 290], [735, 330], [740, 470]];
  const along = (u: number): [number, number] => {
    const L = path.length - 1, f = Math.max(0, Math.min(0.9999, u)) * L, i = Math.floor(f), r = f - i;
    return [path[i][0] + (path[i + 1][0] - path[i][0]) * r, path[i][1] + (path[i + 1][1] - path[i][1]) * r];
  };
  return (
    <svg width={w} height={h} viewBox="0 0 900 520">
      {/* skin */}
      <path d="M60 280 Q 450 40 840 280 Q 450 500 60 280 Z" fill="#F3D9C0" stroke={C.forest} strokeWidth={3} />
      {/* eyeball visible part */}
      <path d="M150 280 Q 450 110 720 270 Q 450 430 150 280 Z" fill={g("conj") > 0 ? "#FFF6C8" : EC.sclera} stroke={g("conj") > 0 ? C.banana : C.forest} strokeWidth={g("conj") > 0 ? 9 : 4} />
      <circle cx={430} cy={276} r={92} fill={EC.iris} stroke={C.forest} strokeWidth={3} />
      <circle cx={430} cy={276} r={40} fill={C.forest} />
      <circle cx={414} cy={260} r={11} fill={C.paper} />
      {/* lids */}
      <path d="M150 280 Q 450 110 720 270" fill="none" stroke={C.forest} strokeWidth={8} strokeLinecap="round" />
      <path d="M150 280 Q 450 430 720 270" fill="none" stroke={C.forest} strokeWidth={6} strokeLinecap="round" />
      {/* medial corner + lacrimal sac/duct to nose */}
      <circle cx={726} cy={276} r={12} fill="#E8796B" stroke={C.forest} strokeWidth={3} />
      <path d="M738 300 L 742 480" stroke={g("duct") > 0 ? C.banana : "#7FB6C7"} strokeWidth={g("duct") > 0 ? 18 : 14} strokeLinecap="round" />
      <text x={760} y={470} fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.forest}>to the nose</text>
      {/* lacrimal gland: upper OUTER (lateral = viewer's left) */}
      <ellipse cx={240} cy={118} rx={70} ry={38} transform="rotate(-18 240 118)" fill={g("gland") > 0 ? C.banana : "#BFD9E6"} stroke={C.forest} strokeWidth={4} />
      {[0, 1, 2, 3].map((i) => <circle key={i} cx={200 + i * 26} cy={118 + (i % 2) * 8 - i * 6} r={9} fill="none" stroke={C.forest} strokeOpacity={0.4} strokeWidth={2} />)}
      {/* tear drops */}
      {tears > 0 &&
        Array.from({ length: 7 }).map((_, i) => {
          const u = (t * 0.22 + i / 7) % 1;
          const [x, y] = along(u);
          return <path key={i} d={`M${x} ${y - 14} Q ${x + 10} ${y} ${x} ${y + 8} Q ${x - 10} ${y} ${x} ${y - 14} Z`} fill="#3F9BB8" stroke={C.paper} strokeWidth={2} opacity={tears * Math.sin(Math.PI * u)} />;
        })}
    </svg>
  );
};
export const EL_PT: Record<string, [number, number]> = { gland: [240, 118], conj: [600, 250], duct: [742, 420], corner: [726, 276] };
