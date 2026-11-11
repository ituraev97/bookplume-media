import React from "react";
import { C, FONT, ramp } from "./kit";

/* ============ colours ============ */
export const MC = {
  th: "#E8796B", thD: "#B9483C", // thenar
  add: "#E5A15B", addD: "#A9672A", // adductor pollicis
  hyp: "#86B8D8", hypD: "#3F7AA1", // hypothenar
  pb: "#C9B48F", pbD: "#8A7650",
  lum: "#F2D14E", lumD: "#B8961E",
  dor: "#B193D6", dorD: "#6F4FA0",
  pal: "#7CC9B1", palD: "#2F8A6E",
  skin: "#F5E6D3", skinD: "#E3CDB2",
  bone: "#EDE7D3", boneD: "#B9AE8C",
  ten: "#FBF7EA", tenD: "#C9BFA0",
  med: "#F2C200", uln: "#3F86D0",
};
export const NERVE_OF: Record<string, "med" | "uln"> = {
  apb: "med", fpb: "med", op: "med", l1: "med", l2: "med",
  addO: "uln", addT: "uln", adm: "uln", fdm: "uln", odm: "uln", pb: "uln", l3: "uln", l4: "uln",
};
const GROUP: Record<string, [string, string]> = {
  apb: [MC.th, MC.thD], fpb: [MC.th, MC.thD], op: [MC.th, MC.thD],
  addO: [MC.add, MC.addD], addT: [MC.add, MC.addD],
  adm: [MC.hyp, MC.hypD], fdm: [MC.hyp, MC.hypD], odm: [MC.hyp, MC.hypD],
  pb: [MC.pb, MC.pbD], l1: [MC.lum, MC.lumD], l2: [MC.lum, MC.lumD], l3: [MC.lum, MC.lumD], l4: [MC.lum, MC.lumD],
};

/* ============ PALM (left hand, palm view, fingers up, thumb on the right) viewBox 900 x 1000 ============ */
const FING: { id: string; x: number; y: number; w: number; L: number; a: number }[] = [
  { id: "little", x: 272, y: 506, w: 66, L: 230, a: -9 },
  { id: "ring", x: 362, y: 476, w: 74, L: 292, a: -3 },
  { id: "middle", x: 452, y: 464, w: 78, L: 318, a: 0 },
  { id: "index", x: 542, y: 478, w: 74, L: 285, a: 5 },
];
const PALM_D = "M 332 990 C 292 945 252 885 240 805 C 230 725 232 610 240 520 C 300 488 380 474 455 470 C 520 468 568 474 590 492 C 604 530 622 566 648 600 C 668 626 690 636 712 636 C 772 650 802 712 794 778 C 784 852 722 916 662 958 C 626 972 610 984 602 990 Z";
const THUMB_PIVOT: [number, number] = [712, 650];
const THUMB_D = "M 668 640 C 690 590 718 540 744 494 C 760 466 776 446 792 436 C 816 422 840 440 832 470 C 822 510 800 560 778 604 C 766 630 758 652 752 672 Z";

export const PALM_PT: Record<string, [number, number]> = {
  apb: [712, 740], fpb: [640, 790], op: [756, 760], addO: [560, 780], addT: [580, 625], adm: [252, 700], fdm: [304, 720], odm: [340, 640], pb: [284, 820],
  l1: [570, 580], l2: [482, 580], l3: [395, 590], l4: [308, 610], ret: [460, 880], pis: [296, 908], ham: [342, 862],
  thenar: [690, 780], hypo: [280, 720], middle: [455, 620], wrist: [460, 960], guyon: [318, 900], rec: [600, 815],
  medW: [462, 975], ulnW: [318, 975], tipThumb: [815, 440], tipLittle: [240, 290], mcp1: [712, 650],
};

const LETTER_PT: Record<string, [number, number]> = { apb: [800, 690], op: [770, 860], fpb: [640, 820], addT: [560, 640], odm: [370, 600], fdm: [312, 790], adm: [200, 660] };
const MUS: Record<string, string> = {
  odm: "M 354 872 C 344 780 334 668 318 566 L 342 558 C 360 664 372 780 378 868 Z",
  adm: "M 292 918 C 250 872 238 784 240 664 C 242 594 248 550 258 520 L 292 524 C 284 594 282 674 288 754 C 294 822 308 872 320 908 Z",
  fdm: "M 334 888 C 320 804 308 704 302 624 C 298 574 298 544 300 524 L 328 522 C 332 586 338 664 346 744 C 352 804 354 854 354 890 Z",
  pb: "M 242 800 C 272 792 308 802 336 818 L 334 846 C 306 832 270 826 246 834 Z",
  addT: "M 458 560 L 462 704 C 560 684 640 660 696 646 L 698 624 C 634 604 552 578 458 560 Z",
  addO: "M 462 846 C 544 794 624 714 690 654 L 706 672 C 646 744 564 814 482 868 Z",
  op: "M 628 922 C 690 868 742 790 758 706 L 786 714 C 778 796 728 876 668 936 Z",
  fpb: "M 572 904 C 612 844 664 764 704 654 L 732 658 C 706 764 664 854 616 916 Z",
  apb: "M 602 910 C 654 856 704 768 732 646 L 764 658 C 752 746 704 856 644 922 Z",
};
const FDP_W: Record<string, [number, number]> = { index: [482, 900], middle: [462, 900], ring: [442, 900], little: [422, 900] };
const LUMS: [string, string][] = [["l1", "index"], ["l2", "middle"], ["l3", "ring"], ["l4", "little"]];
const fingerBase = (id: string) => FING.find((f) => f.id === id)!;
const lumD = (fid: string) => {
  const f = fingerBase(fid), [wx, wy] = FDP_W[fid];
  const sx = wx + (f.x - wx) * 0.52, sy = wy + (f.y + 20 - wy) * 0.52;
  const ex = f.x + f.w * 0.42, ey = f.y + 22;
  return `M ${sx} ${sy} C ${sx + 18} ${sy - 60} ${ex + 6} ${ey + 90} ${ex} ${ey}`;
};

const Stripes: React.FC<{ id: string; col: string }> = ({ id, col }) => (
  <pattern id={id} width={10} height={10} patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
    <line x1={0} y1={0} x2={0} y2={10} stroke={col} strokeWidth={2.2} opacity={0.45} />
  </pattern>
);

export type PalmProps = {
  t: number;
  lit?: Record<string, number>; // id -> time it lights up
  dim?: number; // 0..1, grey out muscles that are not lit
  show?: string[]; // muscles to draw (default all)
  nerveMode?: Record<string, number>; // id -> time it takes its nerve colour
  stripe?: Record<string, number>; // id -> time a half-ulnar stripe appears (FPB deep head)
  oppose?: number; // 0..1 thumb to little finger
  tendons?: number; // 0..1 FDP tendons visible
  nerves?: { med?: number; rec?: number; uln?: number; sup?: number; deep?: number }; // draw progress 0..1
  ret?: number; // flexor retinaculum visibility 0..1
  letters?: { id: string; t0: number; ch: string }[];
  eminence?: { thenar?: number; hypo?: number; middle?: number };
  bones?: number;
};
const pathLen = 900;
export const Palm: React.FC<PalmProps> = ({ t, lit = {}, dim = 0, show, nerveMode, stripe = {}, oppose = 0, tendons = 0, nerves = {}, ret = 0.75, letters = [], eminence = {}, bones = 0.55 }) => {
  const vis = (id: string) => !show || show.includes(id);
  const op_ = oppose;
  const fingerRot = (id: string) => (id === "little" ? 16 * op_ : id === "ring" ? 6 * op_ : 0);
  const thumbRot = -88 * op_;
  const fill = (id: string) => {
    const [c, d] = GROUP[id];
    if (nerveMode && nerveMode[id] !== undefined) {
      const k = ramp(t, nerveMode[id], nerveMode[id] + 0.4);
      if (k > 0) return { c: k > 0.5 ? (NERVE_OF[id] === "med" ? MC.med : MC.uln) : c, d: k > 0.5 ? C.forest : d };
      return { c: "#D9D6C6", d: "#A8A48E" };
    }
    if (nerveMode) return { c: "#D9D6C6", d: "#A8A48E" };
    return { c, d };
  };
  const litK = (id: string) => (lit[id] === undefined ? 0 : ramp(t, lit[id], lit[id] + 0.35));
  const anyLit = Object.keys(lit).length > 0;
  const muscle = (id: string) => {
    if (!vis(id)) return null;
    const { c, d } = fill(id);
    const k = litK(id);
    const o = 1 - dim * (1 - k) * 0.68;
    const pulse = k > 0 ? 0.5 + 0.5 * Math.sin((t - lit[id]) * 5) : 0;
    const dd = id.startsWith("l") && id.length === 2 ? lumD(({ l1: "index", l2: "middle", l3: "ring", l4: "little" } as Record<string, string>)[id]) : MUS[id];
    const isLum = id.length === 2 && id[0] === "l";
    if (isLum) {
      return (
        <g key={id} opacity={o}>
          {k > 0 && <path d={dd} stroke={C.banana} strokeWidth={44} fill="none" strokeLinecap="round" opacity={0.45 + 0.25 * pulse} />}
          <path d={dd} stroke={d} strokeWidth={26} fill="none" strokeLinecap="round" />
          <path d={dd} stroke={c} strokeWidth={19} fill="none" strokeLinecap="round" />
          <path d={dd} stroke={d} strokeWidth={2} fill="none" strokeDasharray="3 7" opacity={0.6} />
        </g>
      );
    }
    const st = stripe[id] !== undefined ? ramp(t, stripe[id], stripe[id] + 0.4) : 0;
    return (
      <g key={id} opacity={o}>
        {k > 0 && <path d={dd} fill="none" stroke={C.banana} strokeWidth={22} strokeLinejoin="round" opacity={0.5 + 0.3 * pulse} />}
        <path d={dd} fill={c} stroke={d} strokeWidth={4} strokeLinejoin="round" />
        <path d={dd} fill={`url(#st-${id})`} />
        {st > 0 && <path d={dd} fill="url(#ulnStripe)" opacity={st} />}
      </g>
    );
  };
  const np = (p: number | undefined) => (p === undefined ? 0 : Math.max(0, Math.min(1, p)));
  const NP: React.FC<{ d: string; p: number; col: string; w?: number }> = ({ d, p, col, w = 12 }) =>
    p <= 0 ? null : (
      <g>
        <path d={d} stroke={C.forest} strokeWidth={w + 6} fill="none" strokeLinecap="round" strokeDasharray={pathLen} strokeDashoffset={pathLen * (1 - p)} />
        <path d={d} stroke={col} strokeWidth={w} fill="none" strokeLinecap="round" strokeDasharray={pathLen} strokeDashoffset={pathLen * (1 - p)} />
      </g>
    );
  const em = (p: number | undefined, cx: number, cy: number, rx: number, ry: number, rot: number, col: string) =>
    !p ? null : <ellipse cx={cx} cy={cy} rx={rx} ry={ry} transform={`rotate(${rot} ${cx} ${cy})`} fill={col} opacity={0.35 * p} stroke={col} strokeWidth={6} strokeDasharray="14 10" />;
  const fingerShape = (f: (typeof FING)[number], k: "out" | "in") => (
    <g key={f.id + k} transform={`rotate(${f.a + fingerRot(f.id)} ${f.x} ${f.y + 10})`}>
      <rect x={f.x - f.w / 2} y={f.y - f.L} width={f.w} height={f.L + 40} rx={f.w / 2} fill={k === "out" ? C.forest : MC.skin} stroke={k === "out" ? C.forest : "none"} strokeWidth={k === "out" ? 10 : 0} />
      {k === "in" && [0.36, 0.66].map((q) => <line key={q} x1={f.x - f.w * 0.3} x2={f.x + f.w * 0.3} y1={f.y - f.L * q} y2={f.y - f.L * q} stroke={MC.skinD} strokeWidth={4} strokeLinecap="round" />)}
    </g>
  );
  return (
    <svg viewBox="0 0 900 1000" width="100%" height="100%" style={{ overflow: "visible" }}>
      <defs>
        {Object.keys(MUS).concat(["l1", "l2", "l3", "l4"]).map((id) => <Stripes key={id} id={`st-${id}`} col={GROUP[id][1]} />)}
        <pattern id="ulnStripe" width={22} height={22} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect x={0} y={0} width={10} height={22} fill={MC.uln} />
        </pattern>
      </defs>
      {/* silhouette: outline pass then fill pass */}
      <g>
        {FING.map((f) => fingerShape(f, "out"))}
        <path d={PALM_D} fill={C.forest} stroke={C.forest} strokeWidth={10} />
        {op_ <= 0.01 && <g transform={`rotate(${thumbRot} ${THUMB_PIVOT[0]} ${THUMB_PIVOT[1]})`}><path d={THUMB_D} fill={C.forest} stroke={C.forest} strokeWidth={10} /></g>}
        {FING.map((f) => fingerShape(f, "in"))}
        <path d={PALM_D} fill={MC.skin} />
        {op_ <= 0.01 && <g transform={`rotate(${thumbRot} ${THUMB_PIVOT[0]} ${THUMB_PIVOT[1]})`}><path d={THUMB_D} fill={MC.skin} /><line x1={738} y1={530} x2={778} y2={552} stroke={MC.skinD} strokeWidth={4} strokeLinecap="round" /></g>}
      </g>
      {/* bones */}
      <g opacity={bones}>
        {[[540, 864, 542, 492], [454, 868, 452, 480], [368, 868, 362, 492], [296, 864, 276, 518]].map(([x1, y1, x2, y2], i) => (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={MC.boneD} strokeWidth={30} strokeLinecap="round" />
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={MC.bone} strokeWidth={22} strokeLinecap="round" />
          </g>
        ))}
        <path d="M 330 880 C 380 850 520 850 600 880 L 600 935 C 520 950 380 950 330 935 Z" fill={MC.bone} stroke={MC.boneD} strokeWidth={4} />
        <line x1={612} y1={884} x2={708} y2={660} stroke={MC.boneD} strokeWidth={30} strokeLinecap="round" />
        <line x1={612} y1={884} x2={708} y2={660} stroke={MC.bone} strokeWidth={22} strokeLinecap="round" />
      </g>
      <circle cx={300} cy={905} r={20} fill={MC.bone} stroke={MC.boneD} strokeWidth={4} opacity={bones > 0.3 ? 1 : bones * 3} />
      <path d="M 330 872 q 18 -16 10 -34" stroke={MC.boneD} strokeWidth={9} fill="none" strokeLinecap="round" opacity={bones > 0.3 ? 1 : bones * 3} />
      {/* eminences */}
      {em(eminence.thenar, 680, 790, 105, 165, -25, MC.th)}
      {em(eminence.hypo, 292, 720, 58, 185, 3, MC.hyp)}
      {em(eminence.middle, 455, 650, 100, 145, 0, MC.dor)}
      {/* FDP tendons */}
      {tendons > 0 && FING.map((f) => {
        const [wx, wy] = FDP_W[f.id];
        return (
          <g key={f.id} opacity={tendons}>
            <path d={`M ${wx} ${wy + 100} L ${wx} ${wy} C ${wx} ${wy - 160} ${f.x} ${f.y + 200} ${f.x} ${f.y + 10} L ${f.x} ${f.y - f.L * 0.85}`} stroke={MC.tenD} strokeWidth={22} fill="none" strokeLinecap="round" transform={`rotate(${f.a} ${f.x} ${f.y + 10})`} />
            <path d={`M ${wx} ${wy + 100} L ${wx} ${wy} C ${wx} ${wy - 160} ${f.x} ${f.y + 200} ${f.x} ${f.y + 10} L ${f.x} ${f.y - f.L * 0.85}`} stroke={MC.ten} strokeWidth={15} fill="none" strokeLinecap="round" transform={`rotate(${f.a} ${f.x} ${f.y + 10})`} />
          </g>
        );
      })}
      {/* muscles: deep first */}
      {["odm", "addO", "addT", "op", "fdm", "adm", "fpb", "apb", "pb"].map((id) => muscle(id))}
      {LUMS.map(([id]) => muscle(id))}
      {op_ > 0.01 && (
        <g transform={`rotate(${thumbRot} ${THUMB_PIVOT[0]} ${THUMB_PIVOT[1]})`}>
          <path d={THUMB_D} fill={C.forest} stroke={C.forest} strokeWidth={10} />
          <path d={THUMB_D} fill={MC.skin} />
          <line x1={738} y1={530} x2={778} y2={552} stroke={MC.skinD} strokeWidth={4} strokeLinecap="round" />
        </g>
      )}
      {/* retinaculum */}
      {ret > 0 && <path d="M 318 862 C 400 842 520 842 612 866 L 612 902 C 520 880 400 880 318 900 Z" fill={C.matchaLight} opacity={0.55 * ret} stroke={C.matchaDark} strokeWidth={3} />}
      {/* nerves */}
      <NP d="M 462 1010 L 462 900 C 462 860 470 840 480 820" p={np(nerves.med)} col={MC.med} />
      <NP d="M 482 846 C 520 856 560 848 592 826 C 618 808 640 792 672 776" p={np(nerves.rec)} col={MC.med} w={9} />
            <NP d="M 318 1010 L 318 900 C 320 880 326 868 334 858" p={np(nerves.uln)} col={MC.uln} />
      <NP d="M 334 858 C 326 800 316 700 306 580" p={np(nerves.sup)} col={MC.uln} w={8} />
      <NP d="M 334 858 C 360 812 410 784 500 770 C 580 756 640 720 690 672" p={np(nerves.deep)} col={MC.uln} w={9} />
      {/* letters */}
      {letters.map((l) => {
        const k = ramp(t, l.t0, l.t0 + 0.25);
        if (k <= 0) return null;
        const [x, y] = LETTER_PT[l.id] || PALM_PT[l.id];
        return (
          <g key={l.id + l.ch} transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * k})`} opacity={k}>
            <circle r={40} fill={C.forest} stroke={C.paper} strokeWidth={5} />
            <text y={17} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={48} fill={C.banana}>{l.ch}</text>
          </g>
        );
      })}
      {anyLit && null}
    </svg>
  );
};

/* ============ FINGER SPREAD (interossei) viewBox 900 x 900, left palm view, thumb right ============ */
const SF = [
  { id: "little", x: 250, L: 250, w: 62, k: -22 },
  { id: "ring", x: 348, L: 300, w: 68, k: -11 },
  { id: "middle", x: 450, L: 330, w: 72, k: 0 },
  { id: "index", x: 552, L: 300, w: 68, k: 13 },
];
const MCP_Y = 430, MCB_Y = 790;
const rotP = (px: number, py: number, cx: number, cy: number, deg: number): [number, number] => {
  const r = (deg * Math.PI) / 180;
  const dx = px - cx, dy = py - cy;
  return [cx + dx * Math.cos(r) - dy * Math.sin(r), cy + dx * Math.sin(r) + dy * Math.cos(r)];
};
export const Spread: React.FC<{ t: number; spread: number; dorsal?: number; palmar?: number; axis?: number; arrows?: "out" | "in" | null; mid?: number; labels?: number; hiD?: number[]; hiP?: number[]; hiT?: number }> = ({ t, spread, dorsal = 0, palmar = 0, axis = 0, arrows = null, mid = 0, labels = 1, hiD = [], hiP = [], hiT = 0 }) => {
  const ang = (f: (typeof SF)[number]) => (f.id === "middle" ? mid * 12 : f.k * spread);
  const fx = (id: string) => SF.find((f) => f.id === id)!;
  const ins = (id: string, side: number): [number, number] => {
    const f = fx(id);
    return rotP(f.x + side * f.w * 0.42, MCP_Y - 40, f.x, MCP_Y, ang(f));
  };
  // dorsal: between metacarpals → insertion
  const D: { n: number; a: number; b: number; to: [string, number] }[] = [
    { n: 1, a: 552, b: 690, to: ["index", 1] },
    { n: 2, a: 450, b: 552, to: ["middle", 1] },
    { n: 3, a: 348, b: 450, to: ["middle", -1] },
    { n: 4, a: 250, b: 348, to: ["ring", -1] },
  ];
  const P: { n: number; on: number; side: number; to: [string, number] }[] = [
    { n: 1, on: 552, side: -1, to: ["index", -1] },
    { n: 2, on: 348, side: 1, to: ["ring", 1] },
    { n: 3, on: 250, side: 1, to: ["little", 1] },
  ];
  const finger = (f: (typeof SF)[number], k: "out" | "in") => (
    <g key={f.id + k} transform={`rotate(${ang(f)} ${f.x} ${MCP_Y})`}>
      <rect x={f.x - f.w / 2} y={MCP_Y - f.L} width={f.w} height={f.L + 30} rx={f.w / 2} fill={k === "out" ? C.forest : MC.skin} stroke={C.forest} strokeWidth={k === "out" ? 10 : 0} />
      {k === "in" && (
        <>
          <line x1={f.x} y1={MCP_Y - 10} x2={f.x} y2={MCP_Y - f.L + 30} stroke={MC.boneD} strokeWidth={18} strokeLinecap="round" opacity={0.5} />
          <line x1={f.x} y1={MCP_Y - 10} x2={f.x} y2={MCP_Y - f.L + 30} stroke={MC.bone} strokeWidth={12} strokeLinecap="round" opacity={0.9} />
        </>
      )}
    </g>
  );
  const hiDk = (n: number) => (hiD.includes(n) ? 0.5 + 0.5 * Math.sin(t * 6) : 0);
  const hiPk = (n: number) => (hiP.includes(n) ? 0.5 + 0.5 * Math.sin(t * 6) : 0);
  return (
    <svg viewBox="0 0 900 900" width="100%" height="100%" style={{ overflow: "visible" }}>
      {/* palm block */}
      <path d={`M 205 ${MCP_Y} L 600 ${MCP_Y - 10} C 640 500 700 560 720 640 C 735 720 690 820 620 ${MCB_Y + 70} L 260 ${MCB_Y + 70} C 215 800 200 650 205 ${MCP_Y} Z`} fill={C.forest} stroke={C.forest} strokeWidth={10} />
      {SF.map((f) => finger(f, "out"))}
      <path d="M 640 560 C 690 520 740 480 790 420 C 810 396 846 410 836 444 C 820 500 780 600 740 690 Z" fill={C.forest} stroke={C.forest} strokeWidth={10} />
      <path d={`M 205 ${MCP_Y} L 600 ${MCP_Y - 10} C 640 500 700 560 720 640 C 735 720 690 820 620 ${MCB_Y + 70} L 260 ${MCB_Y + 70} C 215 800 200 650 205 ${MCP_Y} Z`} fill={MC.skin} />
      {SF.map((f) => finger(f, "in"))}
      <path d="M 640 560 C 690 520 740 480 790 420 C 810 396 846 410 836 444 C 820 500 780 600 740 690 Z" fill={MC.skin} />
      {/* metacarpals */}
      {SF.map((f) => (
        <g key={f.id}>
          <line x1={f.x + (f.x - 450) * 0.12} y1={MCB_Y} x2={f.x} y2={MCP_Y + 6} stroke={MC.boneD} strokeWidth={34} strokeLinecap="round" />
          <line x1={f.x + (f.x - 450) * 0.12} y1={MCB_Y} x2={f.x} y2={MCP_Y + 6} stroke={MC.bone} strokeWidth={26} strokeLinecap="round" />
        </g>
      ))}
      <line x1={640} y1={MCB_Y} x2={750} y2={560} stroke={MC.boneD} strokeWidth={34} strokeLinecap="round" />
      <line x1={640} y1={MCB_Y} x2={750} y2={560} stroke={MC.bone} strokeWidth={26} strokeLinecap="round" />
      {/* axis */}
      {axis > 0 && <line x1={450} y1={60} x2={450} y2={880} stroke={C.red} strokeWidth={6} strokeDasharray="18 14" opacity={axis} />}
      {/* dorsal interossei: two heads (feather) */}
      {dorsal > 0 && D.map((d) => {
        const [ix, iy] = ins(d.to[0], d.to[1]);
        const cx = (d.a + d.b) / 2;
        const top = MCP_Y + 60;
        const path = `M ${d.a + 14} ${MCB_Y - 40} C ${d.a + 18} ${top + 120} ${cx - 10} ${top} ${ix} ${iy} C ${cx + 10} ${top} ${d.b - 18} ${top + 120} ${d.b - 14} ${MCB_Y - 40} Z`;
        return (
          <g key={d.n} opacity={dorsal}>
            {hiDk(d.n) > 0 && <path d={path} fill="none" stroke={C.banana} strokeWidth={20} opacity={0.4 + 0.4 * hiDk(d.n)} />}
            <path d={path} fill={MC.dor} stroke={MC.dorD} strokeWidth={4} />
            <line x1={cx} y1={MCB_Y - 50} x2={(cx + ix) / 2} y2={(top + 40 + iy) / 2} stroke={MC.dorD} strokeWidth={3} />
            {labels > 0 && <text x={cx} y={MCB_Y - 90} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={C.forest}>D{d.n}</text>}
          </g>
        );
      })}
      {/* palmar interossei: one head */}
      {palmar > 0 && P.map((p) => {
        const [ix, iy] = ins(p.to[0], p.to[1]);
        const bx = p.on + p.side * 18;
        const path = `M ${bx - 12} ${MCB_Y - 60} C ${bx - 16} ${MCP_Y + 200} ${ix - 14} ${MCP_Y + 60} ${ix} ${iy} C ${ix + 14} ${MCP_Y + 60} ${bx + 18} ${MCP_Y + 200} ${bx + 14} ${MCB_Y - 60} Z`;
        return (
          <g key={p.n} opacity={palmar}>
            {hiPk(p.n) > 0 && <path d={path} fill="none" stroke={C.banana} strokeWidth={20} opacity={0.4 + 0.4 * hiPk(p.n)} />}
            <path d={path} fill={MC.pal} stroke={MC.palD} strokeWidth={4} />
            {labels > 0 && <text x={bx + p.side * 34} y={MCB_Y - 130} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={38} fill={C.forest}>P{p.n}</text>}
          </g>
        );
      })}
      {/* arrows at fingertips */}
      {arrows && SF.filter((f) => f.id !== "middle").map((f) => {
        const [tx, ty] = rotP(f.x, MCP_Y - f.L - 30, f.x, MCP_Y, ang(f));
        const dir = (f.id === "index" ? 1 : -1) * (arrows === "out" ? 1 : -1);
        const col = arrows === "out" ? MC.dorD : MC.palD;
        return (
          <g key={f.id} transform={`translate(${tx} ${ty}) scale(${dir} 1)`}>
            <path d="M -10 0 L 40 0 M 26 -14 L 42 0 L 26 14" stroke={col} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      })}
      {hiT > 0 && (
        <g opacity={hiT}>
          <circle cx={812} cy={440} r={66} fill="none" stroke={C.red} strokeWidth={8} strokeDasharray="16 10" />
          {(() => { const f = SF[0]; const [x, y] = rotP(f.x, MCP_Y - f.L + 20, f.x, MCP_Y, ang(f)); return <circle cx={x} cy={y} r={66} fill="none" stroke={C.red} strokeWidth={8} strokeDasharray="16 10" />; })()}
        </g>
      )}
    </svg>
  );
};

/* ============ FINGER SIDE VIEW (lumbrical) viewBox 1000 x 640; dorsum up, palm down ============ */
export const SideFinger: React.FC<{ t: number; k: number; lum?: number; fdp?: number; ext?: number; lit?: number; labels?: boolean }> = ({ t, k, lum = 1, fdp = 1, ext = 1, lit = 0 }) => {
  // k=0 relaxed curl, k=1 lumbrical (tray) position
  const mcp = 18 + (78 - 18) * k, pip = 62 * (1 - k), dip = 42 * (1 - k);
  const P0: [number, number] = [120, 250], P1: [number, number] = [430, 230]; // metacarpal base → head (MCP)
  const L1 = 210, L2 = 130, L3 = 96;
  const base = Math.atan2(P1[1] - P0[1], P1[0] - P0[0]);
  const r = (d: number) => (d * Math.PI) / 180;
  const a1 = base + r(mcp), a2 = a1 + r(pip), a3 = a2 + r(dip);
  const P2: [number, number] = [P1[0] + L1 * Math.cos(a1), P1[1] + L1 * Math.sin(a1)];
  const P3: [number, number] = [P2[0] + L2 * Math.cos(a2), P2[1] + L2 * Math.sin(a2)];
  const P4: [number, number] = [P3[0] + L3 * Math.cos(a3), P3[1] + L3 * Math.sin(a3)];
  const off = (p: [number, number], a: number, d: number): [number, number] => [p[0] - Math.sin(a) * d, p[1] + Math.cos(a) * d];
  // palm side = +normal (down), dorsal = -normal
  const bone = (A: [number, number], B: [number, number], w: number) => (
    <g>
      <line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} stroke={MC.boneD} strokeWidth={w + 8} strokeLinecap="round" />
      <line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} stroke={MC.bone} strokeWidth={w} strokeLinecap="round" />
    </g>
  );
  const skin = (A: [number, number], B: [number, number], w: number) => <line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} stroke={MC.skin} strokeWidth={w} strokeLinecap="round" />;
  const skinO = (A: [number, number], B: [number, number], w: number) => <line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} stroke={C.forest} strokeWidth={w + 10} strokeLinecap="round" />;
  const fd = [off(P0, base, 34), off(P1, base, 36), off(P2, a1, 30), off(P3, a2, 26), off(P4, a3, 18)];
  const ex = [off(P0, base, -34), off(P1, base, -38), off(P2, a1, -30), off(P3, a2, -26), off(P4, a3, -20)];
  const poly = (ps: [number, number][]) => "M " + ps.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L ");
  const hood = off([P1[0] + 0.45 * (P2[0] - P1[0]), P1[1] + 0.45 * (P2[1] - P1[1])], a1, -38);
  const lumStart: [number, number] = [fd[0][0] + 0.62 * (fd[1][0] - fd[0][0]), fd[0][1] + 0.62 * (fd[1][1] - fd[0][1])];
  const mid1 = off(P1, base, 30);
  const lumD = `M ${lumStart[0]} ${lumStart[1]} C ${mid1[0] - 10} ${mid1[1] + 10} ${mid1[0] + 30} ${mid1[1] + 4} ${hood[0]} ${hood[1]}`;
  const pl = 0.5 + 0.5 * Math.sin(t * 5);
  return (
    <svg viewBox="0 0 1000 800" width="100%" height="100%" style={{ overflow: "visible" }}>
      <g>
        {skinO([60, 250], P1, 120)}{skinO(P1, P2, 92)}{skinO(P2, P3, 82)}{skinO(P3, P4, 74)}
        {skin([60, 250], P1, 120)}{skin(P1, P2, 92)}{skin(P2, P3, 82)}{skin(P3, P4, 74)}
      </g>
      {bone(P0, P1, 30)}{bone(P1, P2, 26)}{bone(P2, P3, 22)}{bone(P3, P4, 18)}
      {[P1, P2, P3].map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={14} fill={C.paper} stroke={MC.boneD} strokeWidth={4} />)}
      <path d={poly(ex)} stroke={MC.tenD} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={ext} />
      <path d={poly(ex)} stroke={MC.ten} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={ext} />
      <path d={poly(fd)} stroke={MC.tenD} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={fdp} />
      <path d={poly(fd)} stroke="#F3EFD9" strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={fdp} />
      {lum > 0 && (
        <g opacity={lum}>
          {lit > 0 && <path d={lumD} stroke={C.banana} strokeWidth={46} fill="none" strokeLinecap="round" opacity={(0.35 + 0.3 * pl) * lit} />}
          <path d={lumD} stroke={MC.lumD} strokeWidth={28} fill="none" strokeLinecap="round" />
          <path d={lumD} stroke={MC.lum} strokeWidth={20} fill="none" strokeLinecap="round" />
          <circle cx={hood[0]} cy={hood[1]} r={11} fill={MC.lumD} />
        </g>
      )}
      <text x={60} y={780} fontFamily={FONT} fontWeight={800} fontSize={26} fill={C.matcha}>side view · back of the hand up, palm down</text>
      <circle cx={P1[0]} cy={P1[1]} r={30 + 6 * pl * k} fill="none" stroke={C.red} strokeWidth={5} opacity={k > 0.5 ? 1 : 0} />
    </svg>
  );
};
export const SF_PTS = (k: number) => {
  // helper to get joint screen points (viewBox units) for pins
  const mcp = 18 + (78 - 18) * k, pip = 62 * (1 - k);
  const P1: [number, number] = [430, 230];
  const base = Math.atan2(230 - 250, 430 - 120);
  const r = (d: number) => (d * Math.PI) / 180;
  const a1 = base + r(mcp), a2 = a1 + r(pip);
  const P2: [number, number] = [P1[0] + 210 * Math.cos(a1), P1[1] + 210 * Math.sin(a1)];
  const P3: [number, number] = [P2[0] + 130 * Math.cos(a2), P2[1] + 130 * Math.sin(a2)];
  return { mcp: P1, pip: P2, dip: P3 };
};

/* ============ LOAF icon ============ */
export const Loaf: React.FC<{ size?: number }> = ({ size = 300 }) => (
  <svg viewBox="0 0 300 200" width={size} height={size * 0.66}>
    <path d="M 30 185 L 30 95 C 30 50 70 34 102 46 C 128 22 172 22 198 46 C 230 34 270 50 270 95 L 270 185 Z" fill="#E1A85A" stroke={C.forest} strokeWidth={8} strokeLinejoin="round" />
    <path d="M 30 120 L 270 120 L 270 185 L 30 185 Z" fill="#C98B3E" stroke={C.forest} strokeWidth={8} strokeLinejoin="round" />
    {[85, 150, 215].map((x) => <path key={x} d={`M ${x - 22} 84 l 30 -26`} stroke="#9C6424" strokeWidth={8} fill="none" strokeLinecap="round" />)}
  </svg>
);
/* little earthworm icon */
export const Worm: React.FC<{ t: number; size?: number }> = ({ t, size = 260 }) => {
  const pts = Array.from({ length: 9 }, (_, i) => [20 + i * 30, 70 + Math.sin(t * 4 + i * 0.9) * 16]);
  const d = "M " + pts.map((p) => p.join(" ")).join(" L ");
  return (
    <svg viewBox="0 0 300 140" width={size} height={size * 0.47}>
      <path d={d} stroke={C.forest} strokeWidth={40} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke="#E79A8E" strokeWidth={30} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {pts.slice(1, 8).map((p, i) => <line key={i} x1={p[0]} y1={p[1] - 12} x2={p[0]} y2={p[1] + 12} stroke="#B8665B" strokeWidth={3} />)}
      <circle cx={pts[8][0] + 4} cy={pts[8][1] - 4} r={4} fill={C.forest} />
    </svg>
  );
};
