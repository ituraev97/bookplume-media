import React from "react";
import { C, FONT, ramp } from "./kit";

/**
 * Our own schematic of the front of the abdomen with the 9 regions (tic-tac-toe grid).
 * Patient's RIGHT is on the viewer's LEFT (anatomical position). viewBox 800 x 940.
 * Vertical lines = right + left midclavicular lines; horizontal = subcostal + transtubercular planes.
 */
export type R = "RH" | "EP" | "LH" | "RL" | "UM" | "LL" | "RI" | "HG" | "LI";
export const ROWS: R[][] = [
  ["RH", "EP", "LH"],
  ["RL", "UM", "LL"],
  ["RI", "HG", "LI"],
];
export const ORDER: R[] = ROWS.flat();
export const LET: Record<R, string> = { RH: "H", EP: "E", LH: "H", RL: "L", UM: "U", LL: "L", RI: "I", HG: "H", LI: "I" };
export const NAME: Record<R, string> = {
  RH: "hypochondriac",
  EP: "epigastric",
  LH: "hypochondriac",
  RL: "lumbar",
  UM: "umbilical",
  LL: "lumbar",
  RI: "iliac",
  HG: "hypogastric",
  LI: "iliac",
};
export const FULL: Record<R, string> = {
  RH: "right hypochondriac",
  EP: "epigastric",
  LH: "left hypochondriac",
  RL: "right lumbar",
  UM: "umbilical",
  LL: "left lumbar",
  RI: "right iliac",
  HG: "hypogastric",
  LI: "left iliac",
};
export const ROWCOL = ["#9DC266", C.banana, "#EDA27A"];
export const ROWDARK = ["#5C7A2F", "#B8921A", "#C9483C"];
export const rowOf = (r: R) => ROWS.findIndex((row) => row.includes(r));
export const XS = [70, 290, 510, 730];
export const YS = [60, 330, 590, 900];
export const cellOf = (r: R) => {
  const ri = rowOf(r), ci = ROWS[ri].indexOf(r);
  return { x0: XS[ci], x1: XS[ci + 1], y0: YS[ri], y1: YS[ri + 1], cx: (XS[ci] + XS[ci + 1]) / 2, cy: (YS[ri] + YS[ri + 1]) / 2 };
};

const BODY = "M 96 20 C 84 170, 128 360, 104 470 C 88 560, 66 620, 86 700 C 128 800, 250 880, 400 912 C 550 880, 672 800, 714 700 C 734 620, 712 560, 696 470 C 672 360, 716 170, 704 20 Z";

/* ribs (patient's right side; mirrored for the left). Each: bony rib + costal cartilage to the sternum / costal margin */
const RIBS: { bone: string; cart: string }[] = [
  { bone: "M 100 40 C 170 60, 260 80, 330 78", cart: "M 330 78 C 355 76, 372 70, 386 62" },
  { bone: "M 98 92 C 170 120, 250 140, 318 140", cart: "M 318 140 C 345 138, 368 126, 386 112" },
  { bone: "M 100 150 C 160 190, 225 215, 290 222", cart: "M 290 222 C 330 222, 362 196, 384 168" },
  { bone: "M 104 214 C 150 262, 200 290, 250 300", cart: "M 250 300 C 300 300, 344 252, 376 196" },
  { bone: "M 108 276 C 140 320, 172 346, 206 356", cart: "M 206 356 C 260 356, 316 296, 360 222" },
];
const mirror = (d: string) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_m, x, y) => `${800 - Number(x)} ${y}`);

export const Abdomen: React.FC<{
  t: number;
  w?: number;
  id: string;
  lit?: Partial<Record<R, number>>; // time each region lights up
  hot?: R | null;
  letters?: number; // show big letters 0..1
  names?: number; // show names 0..1
  full?: boolean; // full names (right/left)
  organs?: number; // organ opacity
  cart?: number; // costal cartilage glow 0..1
  ribs?: number; // rib glow 0..1
  liver?: number; // liver glow 0..1
  grid?: number; // grid draw progress 0..1
  sides?: number; // R / L markers
}> = ({ t, w = 800, id, lit = {}, hot = null, letters = 1, names = 1, full = false, organs = 0.85, cart = 0, ribs = 0, liver = 0, grid = 1, sides = 1 }) => {
  const h = (w * 940) / 800;
  const mid = 400;
  return (
    <svg width={w} height={h} viewBox="0 0 800 940" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <clipPath id={`body${id}`}>
          <path d={BODY} />
        </clipPath>
        <linearGradient id={`skin${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#EBDDC2" />
          <stop offset="0.5" stopColor="#F6EEDC" />
          <stop offset="1" stopColor="#EBDDC2" />
        </linearGradient>
        <pattern id={`hatch${id}`} width={10} height={10} patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
          <line x1={0} y1={0} x2={0} y2={10} stroke="#7E2E22" strokeWidth={2} opacity={0.25} />
        </pattern>
        <filter id={`glow${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={6} />
        </filter>
      </defs>
      {/* body */}
      <path d={BODY} fill={`url(#skin${id})`} stroke={C.forest} strokeWidth={6} />
      <g clipPath={`url(#body${id})`}>
        {/* region fills (under organs, translucent) */}
        {ORDER.map((r) => {
          const ts = lit[r];
          const p = ts === undefined ? 0 : ramp(t, ts - 0.05, ts + 0.2);
          if (p <= 0) return null;
          const c = cellOf(r);
          return <rect key={r} x={c.x0} y={c.y0} width={c.x1 - c.x0} height={c.y1 - c.y0} fill={ROWCOL[rowOf(r)]} opacity={0.55 * p} />;
        })}
        <g opacity={organs}>
          {/* small intestine loops */}
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={i} d={`M ${245 + i * 4} ${470 + i * 52} C ${300} ${430 + i * 52}, ${360} ${520 + i * 52}, ${410} ${470 + i * 52} S ${520} ${430 + i * 52}, ${560 - i * 6} ${480 + i * 52}`} fill="none" stroke="#D99484" strokeWidth={22} strokeLinecap="round" opacity={0.8} />
          ))}
          {[0, 1, 2, 3, 4].map((i) => (
            <path key={`h${i}`} d={`M ${245 + i * 4} ${470 + i * 52} C ${300} ${430 + i * 52}, ${360} ${520 + i * 52}, ${410} ${470 + i * 52} S ${520} ${430 + i * 52}, ${560 - i * 6} ${480 + i * 52}`} fill="none" stroke="#F2C4B8" strokeWidth={6} strokeLinecap="round" opacity={0.8} />
          ))}
          {/* bladder */}
          <ellipse cx={400} cy={820} rx={78} ry={56} fill="#E9D99A" stroke="#9C8740" strokeWidth={4} />
          {/* large intestine: ascending, transverse, descending, sigmoid + cecum/appendix */}
          <path d="M 168 690 L 160 470 C 158 410, 190 390, 240 405 C 330 450, 480 455, 580 395 C 630 370, 660 390, 660 440 L 664 640 C 666 720, 610 740, 540 760 C 500 772, 470 790, 452 818" fill="none" stroke="#B88A4E" strokeWidth={44} strokeLinejoin="round" strokeLinecap="round" />
          <path d="M 168 690 L 160 470 C 158 410, 190 390, 240 405 C 330 450, 480 455, 580 395 C 630 370, 660 390, 660 440 L 664 640 C 666 720, 610 740, 540 760 C 500 772, 470 790, 452 818" fill="none" stroke="#DDB77E" strokeWidth={26} strokeDasharray="16 10" strokeLinejoin="round" strokeLinecap="round" />
          <ellipse cx={170} cy={694} rx={34} ry={30} fill="#C79A5C" stroke="#8A6330" strokeWidth={4} />
          <path d="M 182 722 C 188 752, 208 770, 226 774" fill="none" stroke="#8A6330" strokeWidth={10} strokeLinecap="round" />
          {/* spleen */}
          <ellipse cx={686} cy={250} rx={34} ry={62} transform="rotate(20 686 250)" fill="#9A6084" stroke="#5E2E4C" strokeWidth={4} />
          {/* stomach */}
          <path d="M 500 168 C 560 140, 660 160, 668 250 C 676 340, 600 390, 520 384 C 470 380, 440 360, 432 336 C 470 344, 540 330, 560 286 C 576 246, 540 212, 500 196 Z" fill="#E3A08B" stroke="#9E4F3C" strokeWidth={5} />
          {/* liver */}
          <g>
            <path d="M 104 150 C 180 100, 400 112, 568 176 C 530 232, 440 282, 350 318 C 270 350, 190 376, 128 372 C 100 320, 96 220, 104 150 Z" fill="#B85A43" stroke="#6E2A1E" strokeWidth={5} />
            <path d="M 104 150 C 180 100, 400 112, 568 176 C 530 232, 440 282, 350 318 C 270 350, 190 376, 128 372 C 100 320, 96 220, 104 150 Z" fill={`url(#hatch${id})`} />
            <path d="M 104 150 C 180 100, 400 112, 568 176 C 530 232, 440 282, 350 318 C 270 350, 190 376, 128 372 C 100 320, 96 220, 104 150 Z" fill="none" stroke={C.banana} strokeWidth={14} opacity={liver} filter={`url(#glow${id})`} />
            <path d="M 104 150 C 180 100, 400 112, 568 176 C 530 232, 440 282, 350 318 C 270 350, 190 376, 128 372 C 100 320, 96 220, 104 150 Z" fill="none" stroke={C.banana} strokeWidth={6} opacity={liver} />
            {/* falciform line */}
            <path d="M 372 130 C 360 200, 340 260, 330 322" fill="none" stroke="#6E2A1E" strokeWidth={3} opacity={0.6} />
            {/* gallbladder */}
            <ellipse cx={262} cy={352} rx={22} ry={34} transform="rotate(-20 262 352)" fill="#6E9A45" stroke="#3C5A22" strokeWidth={4} />
          </g>
        </g>
        {/* ribs + costal cartilages, both sides */}
        <g>
          {RIBS.map((rb, i) => (
            <g key={i}>
              {[rb, { bone: mirror(rb.bone), cart: mirror(rb.cart) }].map((q, j) => (
                <g key={j}>
                  <path d={q.bone} fill="none" stroke={C.forest} strokeWidth={16} strokeLinecap="round" opacity={0.1 + 0.25 * ribs} />
                  <path d={q.bone} fill="none" stroke="#FBF6E6" strokeWidth={10} strokeLinecap="round" opacity={0.45 + 0.4 * ribs} />
                  <path d={q.bone} fill="none" stroke={C.banana} strokeWidth={14} strokeLinecap="round" opacity={ribs} />
                  <path d={q.cart} fill="none" stroke="#7FB3C8" strokeWidth={10 + 4 * cart} strokeLinecap="round" opacity={0.4 + 0.6 * cart} />
                  <path d={q.cart} fill="none" stroke="#7FB3C8" strokeWidth={26} strokeLinecap="round" opacity={0.55 * cart} filter={`url(#glow${id})`} />
                </g>
              ))}
            </g>
          ))}
          {/* sternum + xiphoid */}
          <path d="M 384 10 L 416 10 L 414 170 L 400 196 L 386 170 Z" fill="#FBF6E6" stroke={C.forest} strokeWidth={4} opacity={0.9} />
        </g>
        {/* iliac crests + pubis (faint) */}
        <path d="M 92 640 C 120 560, 200 560, 236 640" fill="none" stroke="#FBF6E6" strokeWidth={16} strokeLinecap="round" opacity={0.9} />
        <path d="M 708 640 C 680 560, 600 560, 564 640" fill="none" stroke="#FBF6E6" strokeWidth={16} strokeLinecap="round" opacity={0.9} />
        <path d="M 92 640 C 120 560, 200 560, 236 640" fill="none" stroke={C.forest} strokeWidth={4} strokeLinecap="round" opacity={0.45} />
        <path d="M 708 640 C 680 560, 600 560, 564 640" fill="none" stroke={C.forest} strokeWidth={4} strokeLinecap="round" opacity={0.45} />
        {/* umbilicus */}
        <ellipse cx={mid} cy={470} rx={12} ry={16} fill="#D8C49C" stroke={C.forest} strokeWidth={4} />
        {/* the grid */}
        {[XS[1], XS[2]].map((x, i) => {
          const p = ramp(grid, i * 0.25, 0.25 + i * 0.25);
          return <line key={`v${i}`} x1={x} y1={0} x2={x} y2={940 * p} stroke={C.forest} strokeWidth={6} strokeDasharray="22 12" />;
        })}
        {[YS[1], YS[2]].map((y, i) => {
          const p = ramp(grid, 0.5 + i * 0.25, 0.75 + i * 0.25);
          return <line key={`h${i}`} x1={0} y1={y} x2={800 * p} y2={y} stroke={C.forest} strokeWidth={6} strokeDasharray="22 12" />;
        })}
        {/* hot outline */}
        {hot && (() => {
          const c = cellOf(hot);
          return <rect x={c.x0 + 6} y={c.y0 + 6} width={c.x1 - c.x0 - 12} height={c.y1 - c.y0 - 12} rx={14} fill="none" stroke={C.forest} strokeWidth={10} />;
        })()}
      </g>
      {/* labels */}
      {ORDER.map((r) => {
        const ts = lit[r];
        const p = ts === undefined ? 0 : ramp(t, ts - 0.05, ts + 0.22);
        if (p <= 0) return null;
        const c = cellOf(r);
        const ri = rowOf(r);
        const isHot = hot === r;
        const ly = ri === 0 ? c.cy + 30 : ri === 1 ? c.cy + 20 : c.cy - 40;
        const sc = (0.7 + 0.3 * p) * (isHot ? 1.08 : 1);
        return (
          <g key={r} transform={`translate(${c.cx} ${ly}) scale(${sc})`} opacity={p}>
            {letters > 0 && (
              <g opacity={letters}>
                <rect x={-40} y={-108} width={80} height={80} rx={22} fill={ROWCOL[ri]} stroke={C.forest} strokeWidth={5} />
                <text x={0} y={-50} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={58} fill={C.forest}>{LET[r]}</text>
              </g>
            )}
            {names > 0 && (
              <g opacity={names}>
                {full && (r !== "EP" && r !== "UM" && r !== "HG") && (
                  <text x={0} y={-2} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={22} fill={ROWDARK[ri]} letterSpacing={2} stroke={C.paper} strokeWidth={6} paintOrder="stroke">{r[0] === "R" ? "RIGHT" : "LEFT"}</text>
                )}
                <rect x={-(NAME[r].length * 8.4 + 18)} y={4} width={NAME[r].length * 16.8 + 36} height={44} rx={12} fill={isHot ? C.banana : C.forest} />
                <text x={0} y={36} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={28} fill={isHot ? C.forest : C.paper}>{NAME[r]}</text>
              </g>
            )}
          </g>
        );
      })}
      {/* patient's right / left markers */}
      {sides > 0 && (
        <g opacity={sides}>
          <g transform="translate(46 880)">
            <circle r={34} fill={C.forest} />
            <text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={C.paper}>R</text>
          </g>
          <g transform="translate(754 880)">
            <circle r={34} fill={C.forest} />
            <text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={C.paper}>L</text>
          </g>
        </g>
      )}
    </svg>
  );
};
