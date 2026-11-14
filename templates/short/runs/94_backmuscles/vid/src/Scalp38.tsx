import React from "react";
import { C, FONT, ramp } from "./kit";

/**
 * Our own schematic cross-section of the scalp over the skull (Book Plume illustration).
 * Viewer's left = FRONT (frontal belly), right = BACK (occipital belly). viewBox 860 x 640.
 * Layers top -> bottom: S skin, C dense connective tissue, A epicranial aponeurosis, L loose areolar tissue, P pericranium, then bone.
 */
export type LayerId = "S" | "C" | "A" | "L" | "P" | "B";

const X0 = 130, X1 = 860, XC = 495, K = 0.00017;
const B = (base: number, x: number, wob = 3) => base + K * (x - XC) ** 2 + wob * Math.sin(x / 41 + base * 0.07);
const N = 48;
const xs = Array.from({ length: N + 1 }, (_, i) => X0 + ((X1 - X0) * i) / N);
const line = (base: number, wob = 3, dx = 0) => xs.map((x, i) => `${i ? "L" : "M"}${(x + dx).toFixed(1)} ${B(base, x, wob).toFixed(1)}`).join(" ");
const band = (top: number, bot: number, wt = 3, wb = 3, dx = 0) =>
  line(top, wt, dx) + " " + [...xs].reverse().map((x) => `L${(x + dx).toFixed(1)} ${B(bot, x, wb).toFixed(1)}`).join(" ") + " Z";

// boundaries (base y at the centre)
const Y = { S: 90, C: 168, A: 258, L: 303, P: 370, O: 392, D: 420, I: 482, E: 508 };
const MID: Record<Exclude<LayerId, "B">, number> = { S: (Y.S + Y.C) / 2, C: (Y.C + Y.A) / 2, A: (Y.A + Y.L) / 2, L: (Y.L + Y.P) / 2, P: (Y.P + Y.O) / 2 };
const BADGE_Y: Record<Exclude<LayerId, "B">, number> = { S: 70, C: 165, A: 260, L: 355, P: 450 };

// deterministic pseudo-random
const rnd = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

export const Scalp: React.FC<{
  t: number;
  w?: number;
  lit?: Partial<Record<LayerId, number>>; // time each layer lights
  focus?: LayerId[]; // layers glowing now
  dimFrom?: number;
  letters?: Partial<Record<"S" | "C" | "A" | "L" | "P", number>>; // badge on-times
  slide?: [number, number]; // top three layers slide back and forth between these times
  unit?: number; // bracket "1 unit" around S+C+A
  bellies?: number; // muscle bellies light
  grow?: number; // layers build in, from the bone up
}> = ({ t, w = 860, lit = {}, focus = [], dimFrom, letters = {}, slide, unit, bellies, grow }) => {
  const s = w / 860;
  const dimP = dimFrom === undefined ? 0 : ramp(t, dimFrom, dimFrom + 0.4);
  const on = (id: LayerId) => (lit[id] === undefined ? 0 : ramp(t, lit[id]! - 0.05, lit[id]! + 0.3));
  const op = (id: LayerId) => 1 - 0.62 * dimP * (1 - on(id));
  const glow = (id: LayerId) => (focus.includes(id) ? on(id) * (0.7 + 0.3 * Math.sin(t * 7)) : 0);
  // build-in from the bone up
  const order: LayerId[] = ["B", "P", "L", "A", "C", "S"];
  const gP = (id: LayerId) => (grow === undefined ? 1 : ramp(t, grow + order.indexOf(id) * 0.08, grow + order.indexOf(id) * 0.08 + 0.3));
  const gT = (id: LayerId) => `translate(0 ${(1 - gP(id)) * -60})`;
  // slide of the top three layers
  let dx = 0;
  if (slide) {
    const k = ramp(t, slide[0], slide[0] + 0.3) * (1 - ramp(t, slide[1] - 0.3, slide[1]));
    dx = k * 46 * Math.sin((t - slide[0]) * 3.4);
  }
  const bel = bellies === undefined ? 0 : ramp(t, bellies, bellies + 0.35);

  const Glow: React.FC<{ d: string; id: LayerId }> = ({ d, id }) => {
    const g = glow(id);
    if (g <= 0) return null;
    return <path d={d} fill="none" stroke={C.banana} strokeWidth={16} strokeLinejoin="round" opacity={g} />;
  };

  // hairs (follow the slide)
  const hairs = Array.from({ length: 34 }, (_, i) => {
    const x = X0 + 18 + i * 21 + rnd(i) * 8;
    const y = B(Y.S, x) + 2;
    const lean = 18 + rnd(i + 9) * 22;
    const h = 56 + rnd(i + 3) * 30;
    return { x, y, lean, h, i };
  });
  // follicles dip from skin into the connective tissue layer
  const foll = hairs.filter((_, i) => i % 2 === 0).map((hh) => ({ x: hh.x - 6, y0: B(Y.S, hh.x) + 6, y1: B(Y.C, hh.x) + 26 + rnd(hh.i) * 12 }));
  // vessels in layer C
  const vessels = [190, 330, 470, 610, 760].map((x, i) => ({ x, y: B(Y.C, x) + 52 + (i % 2) * 8 }));
  // septa in C
  const septa = Array.from({ length: 16 }, (_, i) => X0 + 30 + i * 46 + rnd(i + 40) * 14);
  // diploe holes
  const holes = Array.from({ length: 70 }, (_, i) => {
    const x = X0 + 10 + rnd(i + 70) * (X1 - X0 - 20);
    const y = B(Y.D, x) + 10 + rnd(i + 170) * (Y.I - Y.D - 20);
    return { x, y, r: 4 + rnd(i + 270) * 7 };
  });
  // loose areolar fibres: from the moving aponeurosis (top) to the fixed pericranium (bottom)
  const fib = Array.from({ length: 30 }, (_, i) => X0 + 12 + i * 25 + rnd(i + 500) * 8);

  const bx = 62; // badge column
  return (
    <svg width={860 * s} height={640 * s} viewBox="0 0 860 640" style={{ overflow: "visible" }}>
      <defs>
        <clipPath id="slab">
          <rect x={X0} y={0} width={X1 - X0} height={640} />
        </clipPath>
        <linearGradient id="skinG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E9AE8E" />
          <stop offset="0.18" stopColor="#F4C8AA" />
          <stop offset="1" stopColor="#F7D5BC" />
        </linearGradient>
        <linearGradient id="aG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.5" stopColor="#E9EEF0" />
          <stop offset="1" stopColor="#CDD6DA" />
        </linearGradient>
        <linearGradient id="boneG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F3EBD3" />
          <stop offset="1" stopColor="#E3D5B2" />
        </linearGradient>
        <linearGradient id="musG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#B4483E" />
          <stop offset="1" stopColor="#D8796C" />
        </linearGradient>
      </defs>

      <g clipPath="url(#slab)">
        {/* ---------- BONE (fixed) ---------- */}
        <g opacity={op("B") * gP("B")} transform={gT("B")}>
          <path d={band(Y.O, Y.E, 3, 3)} fill="url(#boneG)" stroke={C.forest} strokeWidth={4} />
          <path d={band(Y.D, Y.I, 3, 3)} fill="#E6D3A8" />
          {holes.map((h, i) => (
            <ellipse key={i} cx={h.x} cy={h.y} rx={h.r * 1.3} ry={h.r} fill="#C9AE7C" stroke="#A88B57" strokeWidth={1.5} opacity={0.85} />
          ))}
          <path d={line(Y.D, 3)} fill="none" stroke="#B89B68" strokeWidth={2.5} />
          <path d={line(Y.I, 3)} fill="none" stroke="#B89B68" strokeWidth={2.5} />
        </g>
        <Glow d={band(Y.O, Y.E)} id="B" />

        {/* ---------- P: pericranium (fixed, tight on bone) ---------- */}
        <g opacity={op("P") * gP("P")} transform={gT("P")}>
          <path d={band(Y.P, Y.O, 3, 3)} fill="#B59A74" stroke={C.forest} strokeWidth={3} />
          {xs.filter((_, i) => i % 2 === 0).map((x, i) => (
            <line key={i} x1={x} y1={B(Y.P, x) + 6} x2={x + 16} y2={B(Y.P, x) + 6} stroke="#8E7350" strokeWidth={2} opacity={0.8} />
          ))}
        </g>
        <Glow d={band(Y.P, Y.O)} id="P" />

        {/* ---------- L: loose areolar tissue (stretches as the top slides) ---------- */}
        <g opacity={op("L") * gP("L")} transform={gT("L")}>
          <path d={band(Y.L, Y.P, 3, 3)} fill="#FCF8EE" stroke={C.forest} strokeWidth={0} />
          {fib.map((x, i) => {
            const yt = B(Y.L, x) + 2, yb = B(Y.P, x) - 2;
            const mid = (yt + yb) / 2;
            const wv = (rnd(i + 600) - 0.5) * 18;
            return <path key={i} d={`M${x + dx} ${yt} C${x + dx * 0.7 + wv} ${mid - 10} ${x + dx * 0.3 - wv} ${mid + 10} ${x} ${yb}`} fill="none" stroke="#CDBB98" strokeWidth={2.4} />;
          })}
          {fib.filter((_, i) => i % 3 === 1).map((x, i) => (
            <circle key={i} cx={x + 10 + dx * 0.5} cy={(B(Y.L, x) + B(Y.P, x)) / 2 + (rnd(i + 700) - 0.5) * 20} r={4} fill="#E8DCC0" />
          ))}
        </g>
        <Glow d={band(Y.L, Y.P)} id="L" />

        {/* ---------- the top three: S + C + A (slide together) ---------- */}
        <g transform={`translate(${dx} 0)`}>
          {/* A: aponeurosis, muscle bellies at the ends */}
          <g opacity={op("A") * gP("A")} transform={gT("A")}>
            <path d={band(Y.A, Y.L, 3, 3)} fill="url(#aG)" stroke={C.forest} strokeWidth={4} />
            {xs.filter((_, i) => i % 1 === 0).map((x, i) => (
              <line key={i} x1={x} y1={B(Y.A, x) + 12} x2={x + 13} y2={B(Y.A, x) + 12} stroke="#AEBCC2" strokeWidth={2} />
            ))}
            {xs.filter((_, i) => i % 2 === 1).map((x, i) => (
              <line key={i} x1={x + 4} y1={B(Y.A, x) + 26} x2={x + 16} y2={B(Y.A, x) + 26} stroke="#AEBCC2" strokeWidth={2} />
            ))}
            {/* frontal belly (front, left) and occipital belly (back, right) */}
            {[
              [X0 - 20, 245],
              [X1 - 225, X1 + 20],
            ].map(([a, b], j) => {
              const ps = xs.filter((x) => x >= a && x <= b);
              const d = band(Y.A - 4, Y.L + 4, 3, 3).split(" Z")[0];
              const clipId = `bel${j}`;
              return (
                <g key={j}>
                  <clipPath id={clipId}>
                    <rect x={a} y={0} width={b - a} height={640} />
                  </clipPath>
                  <g clipPath={`url(#${clipId})`}>
                    <path d={d + " Z"} fill="url(#musG)" stroke={C.forest} strokeWidth={4} />
                    {ps.map((x, i) => (
                      <line key={i} x1={x} y1={B(Y.A, x) + 6} x2={x + (j ? -18 : 18)} y2={B(Y.L, x) - 4} stroke="#8F2A22" strokeWidth={2.4} opacity={0.6} />
                    ))}
                    {bel > 0 && <path d={d + " Z"} fill={C.banana} opacity={0.35 * bel * (0.7 + 0.3 * Math.sin(t * 7))} />}
                  </g>
                  {/* tapered tendon join */}
                  <path d={`M${j ? a : b} ${B(Y.A, j ? a : b) + 2} L${j ? a : b} ${B(Y.L, j ? a : b) - 2}`} stroke={C.forest} strokeWidth={3} strokeDasharray="5 5" opacity={0.5} />
                </g>
              );
            })}
          </g>
          <Glow d={band(Y.A, Y.L)} id="A" />

          {/* C: dense connective tissue with vessels and nerves */}
          <g opacity={op("C") * gP("C")} transform={gT("C")}>
            <path d={band(Y.C, Y.A, 3, 3)} fill="#F8E4BE" stroke={C.forest} strokeWidth={0} />
            {/* fat lobules between fibrous septa */}
            {Array.from({ length: 40 }, (_, i) => {
              const x = X0 + 8 + rnd(i + 900) * (X1 - X0 - 16);
              const y = B(Y.C, x) + 12 + rnd(i + 950) * 64;
              return <ellipse key={i} cx={x} cy={y} rx={13} ry={10} fill="#FCEFD3" stroke="#E5C88F" strokeWidth={1.6} />;
            })}
            {septa.map((x, i) => (
              <path key={i} d={`M${x} ${B(Y.C, x)} C${x + 8} ${B(Y.C, x) + 30} ${x - 8} ${B(Y.C, x) + 60} ${x + 3} ${B(Y.A, x)}`} fill="none" stroke="#C9A36A" strokeWidth={3} />
            ))}
            {/* follicles */}
            {foll.map((f, i) => (
              <g key={i}>
                <path d={`M${f.x} ${f.y0} L${f.x - 4} ${f.y1 - 8}`} stroke="#B9775A" strokeWidth={5} strokeLinecap="round" />
                <ellipse cx={f.x - 4} cy={f.y1} rx={8} ry={10} fill="#C98466" stroke="#8C4F37" strokeWidth={2} />
              </g>
            ))}
            {/* vessel + nerve bundles */}
            {vessels.map((v, i) => (
              <g key={i}>
                <circle cx={v.x} cy={v.y} r={15} fill={C.red} stroke={C.redDark} strokeWidth={3} />
                <circle cx={v.x} cy={v.y} r={6} fill="#F1A397" />
                <ellipse cx={v.x + 30} cy={v.y + 4} rx={17} ry={13} fill="#4F72A8" stroke="#2D4C7C" strokeWidth={3} />
                <ellipse cx={v.x + 30} cy={v.y + 4} rx={8} ry={5} fill="#9FB6DA" />
                <circle cx={v.x + 12} cy={v.y + 24} r={8} fill="#F2D14E" stroke="#B39220" strokeWidth={2.5} />
              </g>
            ))}
          </g>
          <Glow d={band(Y.C, Y.A)} id="C" />

          {/* S: skin with hair */}
          <g opacity={op("S") * gP("S")} transform={gT("S")}>
            <path d={band(Y.S, Y.C, 3, 3)} fill="url(#skinG)" stroke={C.forest} strokeWidth={4} />
            <path d={line(Y.S + 14, 3)} fill="none" stroke="#D88E6C" strokeWidth={3} opacity={0.7} />
            {hairs.map((h) => (
              <path key={h.i} d={`M${h.x} ${h.y} C${h.x + h.lean * 0.3} ${h.y - h.h * 0.5} ${h.x + h.lean * 0.7} ${h.y - h.h * 0.8} ${h.x + h.lean} ${h.y - h.h}`} fill="none" stroke="#3B2A1E" strokeWidth={4} strokeLinecap="round" />
            ))}
            {hairs.filter((_, i) => i % 2 === 0).map((h) => (
              <path key={h.i} d={`M${h.x - 6} ${B(Y.S, h.x) + 6} L${h.x - 2} ${B(Y.S, h.x) + 40}`} stroke="#B9775A" strokeWidth={4} strokeLinecap="round" opacity={0.8} />
            ))}
          </g>
          <Glow d={band(Y.S, Y.C)} id="S" />
        </g>
      </g>
      {/* cut face of the slab at the front */}
      <line x1={X0} y1={B(Y.S, X0) - 2} x2={X0} y2={B(Y.E, X0) + 2} stroke={C.forest} strokeWidth={5} strokeLinecap="round" opacity={gP("B")} />

      {/* bracket: top three = one unit */}
      {unit !== undefined && (() => {
        const p = ramp(t, unit, unit + 0.4);
        const xb = X1 - 8;
        const y0 = B(Y.S, xb) - 4, y1 = B(Y.L, xb) + 2;
        return (
          <g opacity={p} transform={`translate(${(1 - p) * 30} 0)`}>
            <path d={`M${xb - 22} ${y0} Q${xb} ${y0} ${xb} ${y0 + 20} L${xb} ${(y0 + y1) / 2 - 14} L${xb + 16} ${(y0 + y1) / 2} L${xb} ${(y0 + y1) / 2 + 14} L${xb} ${y1 - 20} Q${xb} ${y1} ${xb - 22} ${y1}`} fill="none" stroke={C.forest} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      })()}

      {/* letter badges with leaders */}
      {(["S", "C", "A", "L", "P"] as const).map((l) => {
        const tt = letters[l];
        const p = tt === undefined ? 0 : ramp(t, tt, tt + 0.3);
        const pulse = p > 0 && p < 1 ? Math.sin(p * Math.PI) : 0;
        const ly = MID[l] + K * (X0 + 10 - XC) ** 2;
        const hot = focus.includes(l) && p > 0.5;
        return (
          <g key={l} opacity={(0.3 + 0.7 * p) * (grow === undefined ? 1 : ramp(t, grow + 0.4, grow + 0.7))}>
            <path d={`M${bx + 34} ${BADGE_Y[l]} C${bx + 56} ${BADGE_Y[l]} ${X0 - 22} ${ly} ${X0 + 14} ${ly}`} fill="none" stroke={C.forest} strokeWidth={4} strokeLinecap="round" />
            <circle cx={X0 + 14} cy={ly} r={7} fill={p > 0.5 ? C.banana : C.paper} stroke={C.forest} strokeWidth={3.5} />
            <g transform={`translate(${bx} ${BADGE_Y[l]}) scale(${1 + 0.22 * pulse})`}>
              <circle r={38} fill={hot ? C.banana : p > 0.5 ? C.forest : C.paper} stroke={C.forest} strokeWidth={5} />
              <text y={17} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={50} fill={hot ? C.forest : p > 0.5 ? C.paper : C.forest}>{l}</text>
            </g>
          </g>
        );
      })}

      {/* front / back tags */}
      <g opacity={grow === undefined ? 1 : ramp(t, grow + 0.4, grow + 0.7)} fontFamily={FONT} fontWeight={800} fontSize={24} fill={C.matchaDark} letterSpacing={3}>
        <text x={X0 + 6} y={B(Y.E, X0) + 40}>FRONT</text>
        <text x={X1 - 6} y={B(Y.E, X1 - 6) + 40} textAnchor="end">BACK</text>
        <text x={XC} y={B(Y.E, XC) + 40} textAnchor="middle" fill={C.forest} opacity={0.6}>SKULL BONE</text>
      </g>
    </svg>
  );
};
