import React from "react";
import { C, FONT, ramp } from "./kit";

/* Book Plume's own diagram of the superior mesenteric artery (SMA), anterior view like Gray's Fig. 534:
   patient's RIGHT = viewer's LEFT (ascending colon, cecum, appendix), patient's LEFT = viewer's RIGHT (jejunum + ileum loops). viewBox 1000 x 1000. */
export type SB = "IPD" | "JI" | "MC" | "RC" | "IC";
export const SORDER: SB[] = ["IPD", "JI", "MC", "RC", "IC"];
export const SLETTER: Record<SB, string> = { IPD: "I", JI: "J", MC: "M", RC: "R", IC: "I" };
export const SNAME: Record<SB, string> = {
  IPD: "Inferior pancreaticoduodenal", JI: "Jejunal + ileal", MC: "Middle colic", RC: "Right colic", IC: "Ileocolic",
};
export const SCOL = (b: SB) => (b === "JI" ? C.matcha : b === "IPD" ? "#B07A1E" : C.red);

type Vs = { k: SB | "SMA"; d: string; w: number; sub?: boolean };
const SMA_D = "M 520 300 C 538 380 546 470 538 560 C 530 650 486 740 420 820";
const VESSELS: Vs[] = [
  { k: "IPD", d: "M 528 372 C 500 362 470 368 444 392 C 428 408 420 428 418 446", w: 9 },
  { k: "IPD", d: "M 470 370 C 452 352 436 340 414 332", w: 5, sub: true },
  { k: "MC", d: "M 536 420 C 512 380 488 320 470 262 C 462 236 456 214 452 196", w: 13 },
  { k: "MC", d: "M 468 252 C 420 226 360 208 300 200", w: 7, sub: true },
  { k: "MC", d: "M 462 222 C 520 196 600 186 680 186", w: 7, sub: true },
  { k: "RC", d: "M 542 520 C 460 520 380 506 300 478 C 262 464 232 452 208 444", w: 12 },
  { k: "RC", d: "M 236 452 C 230 404 228 352 232 300", w: 6, sub: true },
  { k: "RC", d: "M 232 456 C 222 500 218 548 218 600", w: 6, sub: true },
  { k: "IC", d: "M 528 640 C 440 670 340 720 250 770 C 222 786 200 800 184 812", w: 13 },
  { k: "IC", d: "M 240 776 C 228 730 220 680 218 636", w: 6, sub: true },
  { k: "IC", d: "M 214 798 C 214 850 214 900 220 948", w: 5, sub: true },
  { k: "JI", d: "M 542 470 C 610 462 690 466 780 486", w: 10 },
  { k: "JI", d: "M 544 530 C 620 540 700 566 800 610", w: 10 },
  { k: "JI", d: "M 538 590 C 600 620 670 668 760 732", w: 10 },
  { k: "JI", d: "M 520 660 C 570 710 620 770 664 846", w: 10 },
  { k: "JI", d: "M 490 712 C 520 772 544 836 560 912", w: 9 },
  { k: "JI", d: "M 720 476 C 744 516 760 556 770 596 M 740 590 C 720 640 712 680 712 720", w: 5, sub: true },
  { k: "JI", d: "M 630 546 C 650 600 660 650 650 700 M 640 690 C 610 740 600 790 610 840", w: 5, sub: true },
];
const BADGE: Record<SB, [number, number]> = { IPD: [372, 446], JI: [856, 560], MC: [520, 168], RC: [168, 392], IC: [140, 742] };

const grow = (t: number, t0?: number) => (t0 === undefined ? 0 : ramp(t, t0, t0 + 0.5));

const Loop: React.FC<{ d: string; ghost?: boolean; id: string }> = ({ d, ghost, id }) => (
  <>
    <path d={d} fill="none" stroke={C.forest} strokeWidth={50} strokeLinecap="round" strokeLinejoin="round" opacity={ghost ? 0.12 : 0.55} />
    <path d={d} fill="none" stroke={ghost ? "#F2F0E2" : `url(#${id}gut)`} strokeWidth={42} strokeLinecap="round" strokeLinejoin="round" />
    <path d={d} fill="none" stroke="#FFF7EC" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" opacity={ghost ? 0.3 : 0.55} transform="translate(-6 -8)" />
  </>
);

export const Sma: React.FC<{ t: number; w: number; id: string; lit: Partial<Record<SB | "SMA", number>>; hot?: SB[]; ghost?: boolean; badges?: boolean; sides?: number }> = ({ t, w, id, lit, hot = [], ghost, badges = true, sides = 1 }) => {
  const colon = ghost ? "#EFEDE0" : "#E9CBA6";
  return (
    <svg width={w} height={w} viewBox="0 0 1000 1000" style={{ display: "block" }}>
      <defs>
        <linearGradient id={`${id}gut`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F4D7C6" />
          <stop offset="1" stopColor="#E3B39E" />
        </linearGradient>
        <linearGradient id={`${id}pan`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F6E3A8" />
          <stop offset="1" stopColor="#E2C27A" />
        </linearGradient>
        <pattern id={`${id}hs`} width={26} height={26} patternUnits="userSpaceOnUse">
          <path d="M 0 13 Q 6 6 13 13 T 26 13" fill="none" stroke={C.forest} strokeWidth={1.6} opacity={0.22} />
        </pattern>
      </defs>
      {/* colon frame: ascending (viewer's left), transverse (top), descending (viewer's right, ghosted = not SMA territory past the splenic flexure) */}
      <path d="M 170 860 L 170 250 C 170 190 210 160 270 160 L 760 160 C 830 160 860 190 860 250 L 860 860" fill="none" stroke={C.forest} strokeWidth={118} strokeLinejoin="round" opacity={ghost ? 0.1 : 0.6} />
      <path d="M 170 860 L 170 250 C 170 190 210 160 270 160 L 760 160 C 830 160 860 190 860 250 L 860 860" fill="none" stroke={colon} strokeWidth={106} strokeLinejoin="round" />
      <path d="M 170 860 L 170 250 C 170 190 210 160 270 160 L 760 160 C 830 160 860 190 860 250 L 860 860" fill="none" stroke={`url(#${id}hs)`} strokeWidth={106} strokeLinejoin="round" />
      {/* haustra notches */}
      {[300, 390, 480, 570, 660, 750].map((y) => <path key={`a${y}`} d={`M 118 ${y} Q 170 ${y + 22} 222 ${y}`} fill="none" stroke={C.forest} strokeWidth={3} opacity={ghost ? 0.08 : 0.35} />)}
      {[330, 430, 530, 630, 730].map((x) => <path key={`t${x}`} d={`M ${x} 108 Q ${x + 22} 160 ${x} 212`} fill="none" stroke={C.forest} strokeWidth={3} opacity={ghost ? 0.08 : 0.35} />)}
      {[300, 390, 480, 570, 660, 750].map((y) => <path key={`d${y}`} d={`M 808 ${y} Q 860 ${y + 22} 912 ${y}`} fill="none" stroke={C.forest} strokeWidth={3} opacity={ghost ? 0.06 : 0.25} />)}
      {/* descending colon fade (IMA territory) */}
      <rect x={796} y={300} width={130} height={600} fill={C.paper} opacity={0.45} />
      {/* cecum + appendix */}
      <ellipse cx={180} cy={872} rx={70} ry={58} fill={colon} stroke={C.forest} strokeWidth={5} opacity={1} />
      <path d="M 200 920 C 210 950 236 968 262 958" fill="none" stroke={C.forest} strokeWidth={22} strokeLinecap="round" />
      <path d="M 200 920 C 210 950 236 968 262 958" fill="none" stroke={colon} strokeWidth={14} strokeLinecap="round" />
      {/* small intestine loops (jejunum + ileum) on the viewer's right, terminal ileum into the cecum */}
      <Loop id={id} ghost={ghost} d="M 610 440 C 700 420 760 450 740 500 C 720 550 620 520 600 580 C 580 640 700 640 740 610 C 780 580 790 660 740 690 C 690 720 620 680 600 730 C 580 780 680 800 700 760" />
      <Loop id={id} ghost={ghost} d="M 700 760 C 720 820 660 860 610 840 C 560 820 540 880 480 880 C 400 880 340 860 280 870 C 250 875 236 872 226 868" />
      {/* duodenum C-loop + pancreas */}
      <path d="M 470 300 C 400 300 380 340 380 400 C 380 460 420 490 480 490 L 610 486" fill="none" stroke={C.forest} strokeWidth={50} strokeLinecap="round" opacity={ghost ? 0.12 : 0.55} />
      <path d="M 470 300 C 400 300 380 340 380 400 C 380 460 420 490 480 490 L 610 486" fill="none" stroke={ghost ? "#F2F0E2" : "#EBC9A8"} strokeWidth={42} strokeLinecap="round" />
      {/* aorta behind (ghosted) */}
      <path d="M 520 40 L 520 960" stroke={C.forest} strokeWidth={50} strokeLinecap="round" opacity={0.12} />
      {/* SMA trunk */}
      <path d={SMA_D} fill="none" stroke={C.forest} strokeWidth={36} strokeLinecap="round" />
      <path d={SMA_D} fill="none" stroke={ghost ? "#F3F1E2" : C.red} strokeWidth={26} strokeLinecap="round" />
      <path d={SMA_D} fill="none" stroke="#F6C1B8" strokeWidth={6} strokeLinecap="round" opacity={ghost ? 0 : 0.8} transform="translate(-6 -2)" />
      <path d="M 430 330 C 470 300 560 300 640 300 C 700 300 760 292 790 300 C 800 320 780 344 740 346 C 660 352 560 352 500 360 C 470 400 470 430 440 440 C 416 420 412 360 430 330 Z" fill={ghost ? "#F3F1E3" : `url(#${id}pan)`} stroke={C.forest} strokeWidth={4} opacity={ghost ? 0.8 : 1} />
      {Array.from({ length: 9 }).map((_, i) => <circle key={i} cx={500 + i * 32} cy={322 + (i % 2) * 6} r={9} fill="none" stroke={C.forest} strokeWidth={2} opacity={ghost ? 0.08 : 0.28} />)}
      {/* branch network: faint base + lit overlay */}
      {VESSELS.map((v, i) => (
        <path key={`b${i}`} d={v.d} fill="none" stroke={ghost ? "rgba(31,42,20,0.2)" : "#B4655A"} strokeWidth={v.w * 0.6} strokeLinecap="round" opacity={ghost ? 1 : 0.45} />
      ))}
      {VESSELS.map((v, i) => {
        const g = grow(t, lit[v.k]);
        if (!hot.includes(v.k as SB) || g <= 0) return null;
        return <path key={`h${i}`} d={v.d} fill="none" stroke={C.banana} strokeWidth={v.w + (v.sub ? 16 : 26)} strokeLinecap="round" pathLength={1} strokeDasharray={`${g} 1`} />;
      })}
      {VESSELS.map((v, i) => {
        const g = grow(t, lit[v.k]);
        if (g <= 0) return null;
        return (
          <g key={`l${i}`}>
            <path d={v.d} fill="none" stroke={C.forest} strokeWidth={v.w + 7} strokeLinecap="round" pathLength={1} strokeDasharray={`${g} 1`} />
            <path d={v.d} fill="none" stroke={C.red} strokeWidth={v.w} strokeLinecap="round" pathLength={1} strokeDasharray={`${g} 1`} />
            <path d={v.d} fill="none" stroke="#F6C1B8" strokeWidth={Math.max(2, v.w * 0.22)} strokeLinecap="round" pathLength={1} strokeDasharray={`${g} 1`} transform="translate(-2 -3)" opacity={0.8} />
          </g>
        );
      })}
      {/* structure names */}
      {!ghost && (
        <g fontFamily={FONT} fontWeight={700} fontStyle="italic" fill={C.forest} opacity={0.62} fontSize={25}>
          <text x={170} y={600} textAnchor="middle" transform="rotate(-90 170 600)">ascending colon</text>
          <text x={600} y={120} textAnchor="middle" fontSize={24}>transverse colon</text>
          <text x={862} y={760} textAnchor="middle" transform="rotate(90 862 760)" opacity={0.7}>descending colon</text>
          <text x={110} y={968} textAnchor="middle">cecum</text>
          <text x={300} y={990} textAnchor="middle" fontSize={22}>appendix</text>
          <text x={650} y={290} textAnchor="middle" fontSize={22}>pancreas</text>
          <text x={350} y={520} textAnchor="middle" fontSize={22}>duodenum</text>
          <text x={520} y={60} textAnchor="middle" fontSize={22}>aorta (behind)</text>
          <text x={700} y={900} textAnchor="middle">jejunum + ileum</text>
        </g>
      )}
      {sides > 0 && !ghost && (
        <g fontFamily={FONT} fontWeight={800} opacity={sides}>
          <rect x={258} y={232} width={190} height={44} rx={12} fill={C.forest} />
          <text x={353} y={263} textAnchor="middle" fontSize={23} fill={C.paper}>patient's RIGHT</text>
          <rect x={590} y={384} width={176} height={44} rx={12} fill={C.forest} />
          <text x={678} y={415} textAnchor="middle" fontSize={23} fill={C.paper}>patient's LEFT</text>
        </g>
      )}
      {badges &&
        SORDER.map((b) => {
          const g = ramp(t, (lit[b] ?? 99) + 0.2, (lit[b] ?? 99) + 0.45);
          if (g <= 0) return null;
          const [x, y] = BADGE[b];
          const h = hot.includes(b);
          return (
            <g key={b} transform={`translate(${x} ${y}) scale(${(0.6 + 0.4 * g) * (h ? 1.15 : 1)})`} opacity={g}>
              {h && <circle r={46} fill={C.banana} />}
              <circle r={36} fill={SCOL(b)} stroke={C.forest} strokeWidth={5} />
              <text y={15} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={42} fill={C.paper}>{SLETTER[b]}</text>
            </g>
          );
        })}
    </svg>
  );
};
