import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { FONT } from "./kit";
import { BP, SwallowDiagram } from "./IllusSwallow";

export type ThumbProps = { v: "A" | "B" | "C" };

const stroke = (w: number) => ({ WebkitTextStroke: `${w}px #000`, paintOrder: "stroke fill" as const, textShadow: "8px 8px 0 #000" });

const CFG = {
  A: { words: ["WHEN YOU", "SWALLOW"], sub: "SECOND BY SECOND", hl: 1, sticker: "1 SEC", focal: "plate" },
  B: { words: ["WRONG", "PIPE?"], sub: "WHY FOOD DOESN'T GO", hl: 1, sticker: "1 SEC", focal: "plate" },
  C: { words: ["WHEN YOU", "SWALLOW"], sub: "SECOND BY SECOND", hl: 1, sticker: "1 SEC", focal: "diagram" },
} as const;

export const SwallowThumb: React.FC<ThumbProps> = ({ v }) => {
  const c = CFG[v];
  const big = c.words[0].length <= 6;
  const BW = 600, BH = 610, BX = 40, BY = 56;
  // plate focus: epiglottis / laryngopharynx crossroads on Gray's Fig. 994
  const aspect = 0.7004;
  const z = 1.55;
  const iw = BW * z, ih = iw / aspect;
  const px = 0.445, py = 0.615;
  const cl = (val: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, val));
  const left = cl(BW / 2 - 0.5 * iw + 10, BW - iw, 0), top = cl(BH / 2 - 0.55 * ih, BH - ih, 0);
  let cx = left + px * iw, cy = top + py * ih;
  // diagram focus (viewBox coords of SwallowDiagram)
  const dScale = 1.12, dW = 800 * dScale;
  const dfx = 440, dfy = 470;
  const dLeft = BW / 2 - dfx * dScale + 40, dTop = BH / 2 - dfy * dScale + 30;
  if (c.focal === "diagram") {
    cx = dLeft + 410 * dScale;
    cy = dTop + 528 * dScale;
  }
  const bg = "radial-gradient(circle at 30% 50%, #FFF36B 0%, #FFD21F 38%, #FF8A00 100%)";
  return (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: FONT, background: bg }}>
      <div style={{ position: "absolute", left: -400, top: -660, width: 2000, height: 2000, background: "repeating-conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,0.32) 0deg 7deg, rgba(255,255,255,0) 7deg 18deg)", transform: "translate(-160px, 0)" }} />
      <div style={{ position: "absolute", left: BX, top: BY, width: BW, height: BH, transform: "rotate(-3deg)", borderRadius: 34, overflow: "hidden", background: "#FFF8E6", boxShadow: "0 0 0 10px #000, 0 0 0 20px #fff, 0 0 0 26px #000, 18px 22px 0 26px rgba(0,0,0,0.35)" }}>
        {c.focal === "plate" ? (
          <Img src={staticFile("plates/sagittal.png")} style={{ position: "absolute", left, top, width: iw, height: ih, filter: "contrast(1.38) saturate(1.9) brightness(1.04)" }} />
        ) : (
          <div style={{ position: "absolute", left: dLeft, top: dTop }}>
            <SwallowDiagram w={dW} t={0.4} b={BP.laryngo + 0.02} wave={1} palate={1} epi={1} lift={1} folds={1} />
          </div>
        )}
        <div style={{ position: "absolute", left: cx - 90, top: cy - 90, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,214,10,0.8) 0%, rgba(255,170,0,0.5) 60%, rgba(255,170,0,0) 72%)", mixBlendMode: "multiply" }} />
        <div style={{ position: "absolute", left: cx - 120, top: cy - 120, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,40,40,0) 52%, rgba(255,40,40,0.45) 64%, rgba(255,40,40,0) 76%)" }} />
        <div style={{ position: "absolute", left: cx - 96, top: cy - 96, width: 192, height: 192, borderRadius: "50%", border: "16px solid #FF1E1E", boxShadow: "0 0 0 6px #fff, inset 0 0 0 6px #fff, 0 0 30px 10px rgba(255,30,30,0.6)" }} />
      </div>
      <svg width={1280} height={720} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {(() => {
          const tx = BX + cx + 104, ty = BY + cy + 30;
          const sx = Math.min(780, tx + 240), sy = Math.min(690, ty + 150);
          const ang = Math.atan2(ty - sy, tx - sx);
          const hx = tx - Math.cos(ang) * 6, hy = ty - Math.sin(ang) * 6;
          const head = (d: number, a: number) => `${hx + Math.cos(ang + a) * d},${hy + Math.sin(ang + a) * d}`;
          const path = `M${sx},${sy} Q${(sx + tx) / 2 + 60},${(sy + ty) / 2 + 40} ${hx - Math.cos(ang) * 40},${hy - Math.sin(ang) * 40}`;
          return (
            <g>
              <path d={path} stroke="#000" strokeWidth={42} fill="none" strokeLinecap="round" />
              <path d={path} stroke="#FF1E1E" strokeWidth={26} fill="none" strokeLinecap="round" />
              <polygon points={`${hx},${hy} ${head(86, Math.PI - 0.5)} ${head(86, Math.PI + 0.5)}`} fill="#FF1E1E" stroke="#000" strokeWidth={8} strokeLinejoin="round" />
            </g>
          );
        })()}
      </svg>
      <div style={{ position: "absolute", left: 690, top: 40, width: 570, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6, transform: "rotate(-2deg)" }}>
        <div style={{ background: "#000", color: "#FFD21F", fontWeight: 800, fontSize: 36, letterSpacing: 2, padding: "6px 18px 10px", borderRadius: 12, marginBottom: 10 }}>{c.sub}</div>
        {c.words.map((w, j) =>
          j === c.hl ? (
            <div key={j} style={{ background: "#FF1E1E", border: "8px solid #000", borderRadius: 18, padding: "0 20px 10px", boxShadow: "8px 8px 0 #000", color: "#fff", fontWeight: 800, fontSize: 104, lineHeight: 1.0, letterSpacing: -3, whiteSpace: "nowrap", ...stroke(10) }}>{w}</div>
          ) : (
            <div key={j} style={{ color: "#fff", fontWeight: 800, fontSize: 100, lineHeight: 0.98, letterSpacing: -4, whiteSpace: "nowrap", ...stroke(16) }}>{w}</div>
          ),
        )}
      </div>
      <div style={{ position: "absolute", right: 40, bottom: 34, transform: "rotate(-8deg)", background: "#FF1E1E", color: "#fff", fontWeight: 800, fontSize: 84, padding: "2px 28px 10px", borderRadius: 22, border: "8px solid #000", boxShadow: "8px 8px 0 #000", ...stroke(8) }}>{c.sticker}</div>
    </AbsoluteFill>
  );
};
