import React from "react";
import { Img, OffthreadVideo, staticFile, Sequence, useVideoConfig } from "remotion";
import { C, FONT, ramp, useT } from "./kit";

/**
 * Public-domain anatomy plate (from tools/gray1918.py, saved in public/plates/) with a slow camera move,
 * MODERN labels on top and paper "covers" that hide outdated 1918 labels.
 * Coordinates x/y/w/h are FRACTIONS of the image (0..1), so they stay right when the plate is scaled.
 */
export type PlateLabel = { x: number; y: number; text: string; t: number; side?: "l" | "r"; hot?: boolean; ox?: number; oy?: number };
export type PlateCover = { x: number; y: number; w: number; h: number };

export const Plate: React.FC<{
  src: string; // file in public/, e.g. "plates/hand.png"
  aspect: number; // image width / height
  x: number; y: number; w: number; // box on screen (px); height follows aspect
  a: number; b: number; // visible between a and b seconds
  zoomFrom?: [number, number, number]; // [scale, focusX, focusY] at a
  zoomTo?: [number, number, number]; // [scale, focusX, focusY] at b
  labels?: PlateLabel[];
  covers?: PlateCover[];
  credit?: string;
  frame?: boolean;
}> = ({ src, aspect, x, y, w, a, b, zoomFrom = [1, 0.5, 0.5], zoomTo = [1.12, 0.5, 0.5], labels = [], covers = [], credit = "Gray's Anatomy, 1918 · public domain", frame = true }) => {
  const t = useT();
  if (t < a - 0.2 || t > b + 0.5) return null;
  const h = w / aspect;
  const i = ramp(t, a, a + 0.5), o = ramp(t, b - 0.1, b + 0.35);
  const k = ramp(t, a, b);
  const s = zoomFrom[0] + (zoomTo[0] - zoomFrom[0]) * k;
  const fx = zoomFrom[1] + (zoomTo[1] - zoomFrom[1]) * k;
  const fy = zoomFrom[2] + (zoomTo[2] - zoomFrom[2]) * k;
  // translate so the focus point stays centred while zoomed
  // shift so the focus point moves to the centre, clamped so no empty edge is ever exposed
  const cl = (v: number, m: number) => Math.max(-m, Math.min(m, v));
  const tx = cl(-(fx - 0.5) * w * s, (s - 1) * w / 2);
  const ty = cl(-(fy - 0.5) * h * s, (s - 1) * h / 2);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: i * (1 - o), transform: `translateY(${(1 - i) * 40}px)` }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: frame ? 36 : 0, overflow: "hidden", background: C.paper, boxShadow: frame ? `0 0 0 4px ${C.line}, 0 18px 40px rgba(31,42,20,0.16)` : "none" }}>
        <div style={{ position: "absolute", width: w, height: h, transform: `translate(${tx}px, ${ty}px) scale(${s})`, transformOrigin: "50% 50%" }}>
          <Img src={staticFile(src)} style={{ width: w, height: h, display: "block" }} />
          {covers.map((c, j) => (
            <div key={j} style={{ position: "absolute", left: c.x * w, top: c.y * h, width: c.w * w, height: c.h * h, background: C.paper, borderRadius: 10, boxShadow: `0 0 10px 6px ${C.paper}` }} />
          ))}
          {labels.map((l, j) => {
            const p = ramp(t, l.t - 0.1, l.t + 0.25);
            if (p <= 0) return null;
            const left = l.side === "l";
            if (l.ox !== undefined) {
              const ox = l.ox, oy = l.oy ?? 0;
              return (
                <div key={j} style={{ position: "absolute", left: l.x * w, top: l.y * h, width: 0, height: 0, transform: `scale(${1 / s})`, transformOrigin: "0 0", opacity: p }}>
                  <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
                    <line x1={0} y1={0} x2={ox * p} y2={oy * p} stroke={C.forest} strokeWidth={4} strokeLinecap="round" />
                    <circle cx={0} cy={0} r={10} fill={l.hot ? C.red : C.banana} stroke={C.forest} strokeWidth={4} />
                  </svg>
                  <div style={{ position: "absolute", left: ox, top: oy, transform: `translate(${ox < 0 ? "-100%" : "0"}, -50%) scale(${0.85 + 0.15 * p})`, transformOrigin: ox < 0 ? "100% 50%" : "0% 50%", background: l.hot ? C.banana : C.forest, color: l.hot ? C.forest : C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 32, padding: "5px 15px 8px", borderRadius: 14, whiteSpace: "nowrap", boxShadow: "0 5px 0 rgba(31,42,20,0.18)" }}>{l.text}</div>
                </div>
              );
            }
            return (
              <div key={j} style={{ position: "absolute", left: l.x * w, top: l.y * h, transform: `translate(${left ? "-100%" : "0"}, -50%) scale(${(0.85 + 0.15 * p) / s})`, transformOrigin: left ? "100% 50%" : "0% 50%", opacity: p, display: "flex", alignItems: "center", flexDirection: left ? "row-reverse" : "row", gap: 8 }}>
                <div style={{ width: 18, height: 18, borderRadius: 9, background: l.hot ? C.red : C.forest, boxShadow: `0 0 0 4px ${C.paper}` }} />
                <div style={{ background: l.hot ? C.banana : C.forest, color: l.hot ? C.forest : C.paper, fontFamily: FONT, fontWeight: 800, fontSize: 34, padding: "6px 16px 8px", borderRadius: 14, whiteSpace: "nowrap" }}>{l.text}</div>
              </div>
            );
          })}
        </div>
      </div>
      {credit && (
        <div style={{ position: "absolute", right: 14, bottom: 10, fontFamily: FONT, fontWeight: 700, fontSize: 18, color: C.forest, opacity: 0.55, background: "rgba(247,246,236,0.85)", padding: "2px 10px", borderRadius: 8 }}>{credit}</div>
      )}
    </div>
  );
};

/**
 * OUR OWN product footage (public/footage/*.mp4, filmed by Book Plume). Never use anything else as product footage.
 * Muted: the mix carries the sound. startFrom is in seconds inside the clip.
 */
export const ProductClip: React.FC<{ src: string; a: number; b: number; x?: number; y?: number; w?: number; h?: number; startFrom?: number; tag?: string }> = ({ src, a, b, x = 0, y = 0, w = 1080, h = 1920, startFrom = 0, tag }) => {
  const { fps } = useVideoConfig();
  const t = useT();
  const i = ramp(t, a, a + 0.25), o = ramp(t, b - 0.15, b + 0.1);
  return (
    <Sequence from={Math.round(a * fps)} durationInFrames={Math.round((b - a + 0.2) * fps)} layout="none">
      <div style={{ position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden", borderRadius: w < 1080 ? 36 : 0, opacity: i * (1 - o) }}>
        <OffthreadVideo src={staticFile(src)} muted startFrom={Math.round(startFrom * fps)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {tag && <div style={{ position: "absolute", left: 40, bottom: 520, background: C.banana, color: C.forest, fontFamily: FONT, fontWeight: 800, fontSize: 44, padding: "12px 26px 16px", borderRadius: 20 }}>{tag}</div>}
      </div>
    </Sequence>
  );
};

/** 1000x1500 static Pinterest pin: plate + big keyword title + site */
export const PinStill: React.FC<{ src: string; aspect: number; title: string; sub: string; cover?: PlateCover[] }> = ({ src, aspect, title, sub, cover = [] }) => {
  const ih = Math.min(860 / aspect, 860);
  const w = ih * aspect;
  return (
    <div style={{ position: "absolute", inset: 0, background: C.paper, fontFamily: FONT }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1000, height: 330, background: C.forest }} />
      <div style={{ position: "absolute", left: 60, top: 50, width: 880, color: C.paper, fontWeight: 800, fontSize: 76, lineHeight: 1.05, letterSpacing: -1 }}>{title}</div>
      <div style={{ position: "absolute", left: (1000 - w) / 2, top: 370, width: w, height: ih, borderRadius: 28, overflow: "hidden", boxShadow: `0 0 0 4px ${C.line}` }}>
        <Img src={staticFile(src)} style={{ width: w, height: ih, objectFit: "cover" }} />
        {cover.map((c, j) => <div key={j} style={{ position: "absolute", left: c.x * w, top: c.y * ih, width: c.w * w, height: c.h * ih, background: C.paper }} />)}
      </div>
      <div style={{ position: "absolute", left: 60, top: 1262, width: 880, color: C.forest, fontWeight: 800, fontSize: 36, lineHeight: 1.15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sub}</div>
      <div style={{ position: "absolute", left: 60, top: 1330, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 36, padding: "10px 24px 14px", borderRadius: 16 }}>bookplume.com</div>
      <div style={{ position: "absolute", right: 40, bottom: 26, color: C.forest, opacity: 0.5, fontWeight: 700, fontSize: 18 }}>Illustration: Gray's Anatomy (1918), public domain</div>
    </div>
  );
};
