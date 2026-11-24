import React from "react";
import { C, FONT, ramp } from "./kit";

/* Own schematic: section through one typical intercostal space (side view, outside of the chest on the LEFT, inside on the RIGHT).
   Rib above (top), rib below (bottom), 3 muscle layers (external | internal | innermost) between them,
   the neurovascular bundle tucked under the lower edge of the rib above (costal groove): VEIN top, ARTERY middle, NERVE bottom.
   Box 860 x 728. Schematic only - diagram: Book Plume. */
export type VId = "V" | "A" | "N";
export const VCOL: Record<VId, string> = { V: "#2F6B8F", A: "#C9483C", N: "#C99A12" };
export const VNAME: Record<VId, string> = { V: "VEIN", A: "ARTERY", N: "NERVE" };
export const VY: Record<VId, number> = { V: 204, A: 268, N: 332 };
const BX = 400; // bundle x
const IDS: VId[] = ["V", "A", "N"];
const BONE = "#EFE3C6";

export const Space: React.FC<{
  t: number;
  lit: Record<VId, number>; // time each tube lights
  groove: number; // time the costal groove callout shows
  hold: number; // everything on (save frame)
  focus?: VId; // dim the others, emphasise one
}> = ({ t, lit, groove, hold, focus }) => {
  const holdP = ramp(t, hold, hold + 0.35);
  let cur: VId | null = null;
  IDS.forEach((k) => {
    if (t >= lit[k] - 0.05 && t < groove - 0.2) cur = k;
  });
  const gP = Math.max(ramp(t, groove, groove + 0.25), holdP);
  return (
    <svg width={860} height={728} viewBox="0 0 860 728" style={{ position: "absolute", left: 0, top: 0 }}>
      {/* muscle layers */}
      {[
        { x: 110, f: "#E9BFAF", n: "external" },
        { x: 250, f: "#DDA48F", n: "internal" },
        { x: 390, f: "#F0D6CA", n: "innermost" },
      ].map((m) => (
        <g key={m.n}>
          <rect x={m.x} y={188} width={140} height={354} fill={m.f} stroke={C.forest} strokeWidth={4} />
          <text x={m.x + 70} y={522} fontFamily={FONT} fontWeight={800} fontSize={22} fill={C.forest} opacity={0.75} textAnchor="middle">{m.n}</text>
        </g>
      ))}
      {/* rib above, with the costal groove notch on its lower edge */}
      <path d="M150,60 H490 Q530,60 530,100 V148 Q530,188 490,188 H438 A38,34 0 0 0 362,188 H150 Q110,188 110,148 V100 Q110,60 150,60 Z" fill={BONE} stroke={C.forest} strokeWidth={6} />
      {gP > 0.01 && <path d="M362,188 A38,34 0 0 1 438,188" fill="none" stroke={C.banana} strokeWidth={9} opacity={gP} />}
      <text x={290} y={136} fontFamily={FONT} fontWeight={800} fontSize={34} fill={C.forest} textAnchor="middle">RIB ABOVE</text>
      {/* rib below */}
      <rect x={110} y={542} width={420} height={128} rx={40} fill={BONE} stroke={C.forest} strokeWidth={6} />
      <text x={320} y={618} fontFamily={FONT} fontWeight={800} fontSize={34} fill={C.forest} textAnchor="middle">RIB BELOW</text>
      {/* orientation */}
      <text x={110} y={36} fontFamily={FONT} fontWeight={800} fontSize={22} fill={C.forest} opacity={0.6}>← outside</text>
      <text x={530} y={36} fontFamily={FONT} fontWeight={800} fontSize={22} fill={C.forest} opacity={0.6} textAnchor="end">inside →</text>
      {/* the bundle */}
      {IDS.map((k) => {
        const on = Math.max(ramp(t, lit[k] - 0.05, lit[k] + 0.2), holdP);
        const hot = cur === k || (focus === k && t > hold - 9);
        const dim = focus && focus !== k ? 0.3 : 1;
        const y = VY[k];
        const col = on > 0.5 ? VCOL[k] : "#D9CFB8";
        const wd = 232;
        return (
          <g key={k} opacity={dim}>
            {hot && <circle cx={BX} cy={y} r={42} fill={C.banana} opacity={0.9} />}
            <circle cx={BX} cy={y} r={k === "N" ? 22 : 25} fill={col} stroke={C.forest} strokeWidth={5} />
            {k === "N" && on > 0.5 && <circle cx={BX} cy={y} r={9} fill="#F6E7A6" stroke={C.forest} strokeWidth={3} />}
            {on > 0.4 && (
              <g opacity={on}>
                <line x1={BX + 46} y1={y} x2={575} y2={y} stroke={C.forest} strokeWidth={4} />
                <g transform={`translate(575 ${y}) scale(${hot ? 1.1 : 1})`} style={{ transformOrigin: "0 0" }}>
                  <rect x={0} y={-25} width={wd} height={50} rx={16} fill={col} stroke={C.forest} strokeWidth={5} />
                  <text x={22} y={11} fontFamily={FONT} fontWeight={800} fontSize={32} fill="#fff">{k}</text>
                  <text x={64} y={10} fontFamily={FONT} fontWeight={800} fontSize={27} fill="#fff">{VNAME[k]}</text>
                </g>
              </g>
            )}
          </g>
        );
      })}
      {/* costal groove callout */}
      {gP > 0.01 && (
        <g opacity={gP}>
          <line x1={578} y1={112} x2={410} y2={168} stroke={C.forest} strokeWidth={4} />
          <circle cx={410} cy={168} r={9} fill={C.banana} stroke={C.forest} strokeWidth={4} />
          <g transform={`translate(575 112)`}>
            <rect x={0} y={-25} width={232} height={50} rx={16} fill={C.forest} stroke={C.forest} strokeWidth={5} />
            <text x={116} y={10} fontFamily={FONT} fontWeight={800} fontSize={27} fill={C.banana} textAnchor="middle">costal groove</text>
          </g>
        </g>
      )}
      {/* muscle-layer note (save frame) */}
      {holdP > 0.01 && (
        <g opacity={holdP}>
          <line x1={578} y1={430} x2={392} y2={400} stroke={C.forest} strokeWidth={4} />
          <circle cx={392} cy={400} r={8} fill={C.banana} stroke={C.forest} strokeWidth={4} />
          <rect x={575} y={394} width={280} height={84} rx={16} fill="#FFFDF5" stroke={C.forest} strokeWidth={4} />
          <text x={715} y={428} fontFamily={FONT} fontWeight={800} fontSize={23} fill={C.forest} textAnchor="middle">between the internal</text>
          <text x={715} y={458} fontFamily={FONT} fontWeight={800} fontSize={23} fill={C.forest} textAnchor="middle">and innermost layers</text>
        </g>
      )}
      <text x={100} y={706} fontFamily={FONT} fontWeight={700} fontSize={20} fill={C.forest} opacity={0.55}>typical intercostal space</text>
    </svg>
  );
};
