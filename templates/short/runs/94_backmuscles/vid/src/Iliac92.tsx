import React from "react";
import { C, FONT, ramp } from "./kit";

/* Book Plume's own diagram of the RIGHT internal iliac artery, medial view of the hemipelvis
   (front / pubis + bladder on the viewer's left, back / sacrum on the right, like Gray's Fig. 539). viewBox 1000 x 1000. */
export type IB = "IL" | "LS" | "SG" | "IG" | "P" | "IV" | "M" | "V" | "O" | "U";
export const ILETTER: Record<IB, string> = { IL: "I", LS: "L", SG: "G", IG: "G", P: "P", IV: "I", M: "M", V: "V", O: "O", U: "U" };
export const INAME: Record<IB, string> = {
  IL: "Iliolumbar", LS: "Lateral sacral", SG: "Superior gluteal", IG: "Inferior gluteal", P: "Internal pudendal",
  IV: "Inferior vesical", M: "Middle rectal", V: "Vaginal", O: "Obturator", U: "Umbilical",
};
export const POST: IB[] = ["IL", "LS", "SG"];
export const ICOL = (b: IB) => (POST.includes(b) ? C.matcha : C.red);

type Vs = { k: IB | "AT" | "PT"; d: string; w: number; sub?: boolean };
const VESSELS: Vs[] = [
  { k: "PT", d: "M 530 350 C 590 358 640 378 690 410", w: 24 },
  { k: "AT", d: "M 530 350 C 540 450 548 580 560 720", w: 25 },
  { k: "IL", d: "M 566 354 C 604 300 664 238 760 180", w: 13 },
  { k: "IL", d: "M 700 220 C 720 250 735 280 742 310", w: 6, sub: true },
  { k: "LS", d: "M 640 381 C 700 372 760 368 800 380 C 826 388 840 400 852 414", w: 11 },
  { k: "LS", d: "M 790 377 C 815 352 840 320 866 302", w: 5, sub: true },
  { k: "LS", d: "M 832 396 C 846 430 858 470 866 500", w: 5, sub: true },
  { k: "SG", d: "M 690 410 C 735 440 768 478 792 522", w: 19 },
  { k: "U", d: "M 534 382 C 462 366 362 360 262 346 C 212 338 172 320 140 290", w: 13 },
  { k: "U", d: "M 330 356 C 336 440 330 540 318 630", w: 7, sub: true },
  { k: "O", d: "M 538 452 C 450 482 340 540 240 600", w: 11 },
  { k: "IV", d: "M 543 522 C 480 560 420 620 382 680", w: 10 },
  { k: "V", d: "M 548 582 C 500 642 462 712 432 790", w: 9 },
  { k: "IG", d: "M 551 622 C 620 592 700 590 790 616", w: 16 },
  { k: "M", d: "M 557 690 C 620 700 680 720 742 752", w: 9 },
  { k: "P", d: "M 560 720 C 600 790 640 852 690 922", w: 15 },
];
export const IEND: Record<IB, [number, number]> = {
  IL: [760, 180], LS: [852, 414], SG: [792, 522], IG: [790, 616], P: [690, 922], IV: [382, 680], M: [742, 752], V: [432, 790], O: [240, 600], U: [140, 290],
};
/* badge positions (a little beyond the vessel end) */
const BADGE: Record<IB, [number, number]> = {
  IL: [800, 150], LS: [906, 398], SG: [858, 508], IG: [866, 652], P: [720, 960], IV: [404, 716], M: [790, 770], V: [420, 840], O: [196, 628], U: [104, 258],
};

const grow = (t: number, t0?: number) => (t0 === undefined ? 0 : ramp(t, t0, t0 + 0.45));

export const Iliac: React.FC<{ t: number; w: number; id: string; lit: Partial<Record<IB | "AT" | "PT", number>>; hot?: IB[]; ghost?: boolean; badges?: boolean; trunkLabels?: number }> = ({ t, w, id, lit, hot = [], ghost, badges = true, trunkLabels = 1 }) => {
  const bone = ghost ? "#EDEBDD" : "#EFE7CF";
  return (
    <svg width={w} height={w} viewBox="0 0 1000 1000" style={{ display: "block" }}>
      <defs>
        <radialGradient id={`${id}bl`} cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor={ghost ? "#FBFAF0" : "#F6E2D2"} />
          <stop offset="1" stopColor={ghost ? "#E9E7D6" : "#D9B49C"} />
        </radialGradient>
        <linearGradient id={`${id}re`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={ghost ? "#EFEDE0" : "#D9A78F"} />
          <stop offset="0.5" stopColor={ghost ? "#F8F7EE" : "#EFC6AF"} />
          <stop offset="1" stopColor={ghost ? "#E6E4D3" : "#C98E77"} />
        </linearGradient>
        <pattern id={`${id}sp`} width={22} height={22} patternUnits="userSpaceOnUse">
          <circle cx={6} cy={7} r={2.4} fill={C.forest} opacity={0.28} />
          <circle cx={16} cy={15} r={1.7} fill={C.forest} opacity={0.22} />
        </pattern>
        <linearGradient id={`${id}ei`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8EA2BC" />
          <stop offset="1" stopColor="#6F84A0" />
        </linearGradient>
      </defs>
      {/* pelvic wall muscle (soft hatch) */}
      <path d="M 120 200 C 300 230 520 260 700 360 C 820 430 880 560 880 700 C 880 820 820 920 740 990 L 120 990 Z" fill={ghost ? "#F4F2E6" : "#EADFD0"} opacity={0.55} />
      {Array.from({ length: 22 }).map((_, i) => (
        <path key={i} d={`M ${160 + i * 34} 990 C ${200 + i * 30} 760 ${300 + i * 24} 520 ${430 + i * 20} 260`} fill="none" stroke={C.forest} strokeWidth={1.4} opacity={ghost ? 0.06 : 0.1} />
      ))}
      {/* sacrum + coccyx */}
      <path d="M 860 60 C 930 200 950 360 930 520 C 912 660 860 780 790 860 L 760 840 C 820 760 860 650 872 520 C 886 380 860 220 800 80 Z" fill={bone} stroke={C.forest} strokeWidth={5} />
      <path d="M 860 60 C 930 200 950 360 930 520 C 912 660 860 780 790 860 L 760 840 C 820 760 860 650 872 520 C 886 380 860 220 800 80 Z" fill={`url(#${id}sp)`} opacity={ghost ? 0.4 : 1} />
      {[200, 300, 400, 500, 600].map((y, i) => (
        <ellipse key={y} cx={884 - i * 2 + (y > 450 ? -10 : 0)} cy={y} rx={13} ry={9} fill={ghost ? "#E4E2CF" : "#6E5A45"} stroke={C.forest} strokeWidth={3} />
      ))}
      {/* greater sciatic foramen */}
      <ellipse cx={800} cy={570} rx={52} ry={104} fill={ghost ? "#E8E6D6" : "#5B4B3C"} opacity={ghost ? 0.7 : 0.85} stroke={C.forest} strokeWidth={4} />
      {/* pubis (cut surface) */}
      <ellipse cx={170} cy={770} rx={64} ry={128} transform="rotate(-14 170 770)" fill={bone} stroke={C.forest} strokeWidth={5} />
      <ellipse cx={170} cy={770} rx={64} ry={128} transform="rotate(-14 170 770)" fill={`url(#${id}sp)`} opacity={ghost ? 0.4 : 1} />
      {/* bladder */}
      <path d="M 220 690 C 230 620 300 600 360 615 C 430 632 470 690 460 770 C 450 850 380 890 310 880 C 240 870 205 800 220 690 Z" fill={`url(#${id}bl)`} stroke={C.forest} strokeWidth={5} />
      {/* rectum */}
      <path d="M 840 600 C 820 700 790 800 760 990 L 650 990 C 690 820 730 700 760 590 Z" fill={`url(#${id}re)`} stroke={C.forest} strokeWidth={5} />
      {Array.from({ length: 7 }).map((_, i) => (
        <path key={i} d={`M ${770 - i * 14} ${640 + i * 50} C ${790 - i * 14} ${650 + i * 50} ${805 - i * 14} ${650 + i * 50} ${818 - i * 13} ${640 + i * 50}`} fill="none" stroke={C.forest} strokeWidth={2} opacity={0.25} />
      ))}
      {/* external iliac vein (behind the artery) */}
      <path d="M 486 262 C 410 352 300 446 170 548" fill="none" stroke={C.forest} strokeWidth={36} strokeLinecap="round" opacity={ghost ? 0.1 : 0.8} />
      <path d="M 486 262 C 410 352 300 446 170 548" fill="none" stroke={ghost ? "#EEF0EC" : `url(#${id}ei)`} strokeWidth={27} strokeLinecap="round" opacity={ghost ? 0.6 : 1} />
      {/* ureter crossing into the pelvis to the bladder */}
      <path d="M 520 120 C 540 240 520 330 470 430 C 430 510 400 570 380 640" fill="none" stroke={C.forest} strokeWidth={12} strokeLinecap="round" opacity={ghost ? 0.1 : 0.7} />
      <path d="M 520 120 C 540 240 520 330 470 430 C 430 510 400 570 380 640" fill="none" stroke={ghost ? "#F4F2E6" : "#F3E7C2"} strokeWidth={6} strokeLinecap="round" />
      {/* external iliac (not part of the list) */}
      <path d="M 452 240 C 380 330 280 420 150 520" fill="none" stroke={C.forest} strokeWidth={34} strokeLinecap="round" opacity={ghost ? 0.12 : 0.85} />
      <path d="M 452 240 C 380 330 280 420 150 520" fill="none" stroke={ghost ? "#F3F1E2" : "#D99A8E"} strokeWidth={25} strokeLinecap="round" />
      {/* common iliac + internal iliac trunk */}
      <path d="M 410 0 C 424 90 440 170 452 240 C 470 290 500 322 530 350" fill="none" stroke={C.forest} strokeWidth={44} strokeLinecap="round" />
      <path d="M 410 0 C 424 90 440 170 452 240 C 470 290 500 322 530 350" fill="none" stroke={ghost ? "#F3F1E2" : C.red} strokeWidth={34} strokeLinecap="round" />
      <path d="M 404 0 C 418 90 434 170 446 240" fill="none" stroke="#F6C1B8" strokeWidth={7} strokeLinecap="round" opacity={ghost ? 0 : 0.8} />
      {/* branch network: faint base + lit overlay */}
      {VESSELS.map((v, i) => (
        <path key={`b${i}`} d={v.d} fill="none" stroke={ghost ? "rgba(31,42,20,0.2)" : "#B4655A"} strokeWidth={v.w * 0.6} strokeLinecap="round" opacity={ghost ? 1 : 0.5} />
      ))}
      {VESSELS.map((v, i) => {
        const g = grow(t, lit[v.k]);
        if (!hot.includes(v.k as IB) || g <= 0 || v.sub) return null;
        return <path key={`h${i}`} d={v.d} fill="none" stroke={C.banana} strokeWidth={v.w + 26} strokeLinecap="round" pathLength={1} strokeDasharray={`${g} 1`} />;
      })}
      {VESSELS.map((v, i) => {
        const g = grow(t, lit[v.k]);
        if (g <= 0) return null;
        const col = v.k === "PT" || v.k === "AT" ? C.red : POST.includes(v.k as IB) ? "#C9483C" : C.red;
        return (
          <g key={`l${i}`}>
            <path d={v.d} fill="none" stroke={C.forest} strokeWidth={v.w + 7} strokeLinecap="round" pathLength={1} strokeDasharray={`${g} 1`} />
            <path d={v.d} fill="none" stroke={col} strokeWidth={v.w} strokeLinecap="round" pathLength={1} strokeDasharray={`${g} 1`} />
            <path d={v.d} fill="none" stroke="#F6C1B8" strokeWidth={Math.max(2, v.w * 0.22)} strokeLinecap="round" pathLength={1} strokeDasharray={`${g} 1`} transform="translate(-2 -3)" opacity={0.8} />
          </g>
        );
      })}
      {/* structure names (Book Plume labels) */}
      {!ghost && (
        <g fontFamily={FONT} fontWeight={700} fontStyle="italic" fill={C.forest} opacity={0.62} fontSize={26}>
          <text x={340} y={820} textAnchor="middle">bladder</text>
          <text x={742} y={872} textAnchor="middle" transform="rotate(-78 742 872)">rectum</text>
          <text x={918} y={250} textAnchor="middle" transform="rotate(80 918 250)">sacrum</text>
          <text x={170} y={850} textAnchor="middle" transform="rotate(-76 170 850)">pubis</text>
          <text x={236} y={540} textAnchor="middle" transform="rotate(-40 236 540)">external iliac a. + v.</text>
          <text x={392} y={76} textAnchor="end">common iliac</text>
          <text x={552} y={176} textAnchor="start" fontSize={22}>ureter</text>
        </g>
      )}
      {/* trunk labels */}
      {trunkLabels > 0 && !ghost && (
        <g fontFamily={FONT} fontWeight={800}>
          <g opacity={grow(t, lit.PT) * trunkLabels}>
            <rect x={566} y={252} width={270} height={48} rx={14} fill={C.matcha} />
            <text x={701} y={286} textAnchor="middle" fontSize={27} fill={C.paper}>POSTERIOR TRUNK</text>
          </g>
          <g opacity={grow(t, lit.AT) * trunkLabels}>
            <rect x={384} y={450} width={128} height={78} rx={14} fill={C.red} />
            <text x={448} y={483} textAnchor="middle" fontSize={25} fill={C.paper}>ANTERIOR</text>
            <text x={448} y={514} textAnchor="middle" fontSize={25} fill={C.paper}>TRUNK</text>
          </g>
        </g>
      )}
      {/* badges */}
      {badges &&
        (Object.keys(BADGE) as IB[]).map((b) => {
          const g = ramp(t, (lit[b] ?? 99) + 0.2, (lit[b] ?? 99) + 0.45);
          if (g <= 0) return null;
          const [x, y] = BADGE[b];
          const h = hot.includes(b);
          return (
            <g key={b} transform={`translate(${x} ${y}) scale(${(0.6 + 0.4 * g) * (h ? 1.15 : 1)})`} opacity={g}>
              {h && <circle r={44} fill={C.banana} />}
              <circle r={34} fill={ICOL(b)} stroke={C.forest} strokeWidth={5} />
              <text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={C.paper}>{ILETTER[b]}</text>
            </g>
          );
        })}
    </svg>
  );
};
