import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const C = {
  matcha: "#5C7A2F",
  matchaDark: "#46601F",
  matchaLight: "#8FA86A",
  banana: "#F2D14E",
  bananaDark: "#D9B52E",
  forest: "#1F2A14",
  paper: "#F7F6EC",
  card: "#FFFEF6",
  line: "#E4E2CF",
  red: "#C9483C",
  redDark: "#8F2A22",
  redLight: "#E8796B",
};

export const FONT = "'Plus Jakarta Sans', sans-serif";

export const useT = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps;
};

/** spring 0..1 starting at time t0 (seconds) */
export const useIn = (t0: number, damping = 14, durationInFrames?: number) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - Math.round(t0 * fps), fps, config: { damping, mass: 0.8 }, durationInFrames });
};

export const ramp = (t: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(t, [a, b], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.33, 0, 0.2, 1),
  });

/** Scene wrapper: fade/slide in, slow camera push, fade out */
export const Scene: React.FC<{ start: number; end: number; children: React.ReactNode; push?: number }> = ({
  start,
  end,
  children,
  push = 0.03,
}) => {
  const t = useT();
  if (t < start - 0.05 || t > end + 0.4) return null;
  const inP = ramp(t, start, start + 0.45);
  const outP = ramp(t, end - 0.05, end + 0.3);
  const scale = 1 + Math.max(push, 0.12) * ramp(t, start, end) - 0.04 * (1 - inP) + 0.03 * outP;
  const driftX = Math.sin(t * 1.1) * 16, driftR = Math.sin(t * 0.8) * 0.8;
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        top: 470,
        width: 860,
        height: 940,
        opacity: inP * (1 - outP),
        transform: `translate(${driftX}px, ${(1 - inP) * 40 - outP * 30}px) rotate(${driftR}deg) scale(${scale})`,
        transformOrigin: "50% 50%",
      }}
    >
      {children}
    </div>
  );
};

export const Pill: React.FC<{
  children: React.ReactNode;
  bg?: string;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, bg = C.forest, color = C.paper, size = 34, style }) => (
  <div
    style={{
      display: "inline-block",
      background: bg,
      color,
      fontFamily: FONT,
      fontWeight: 800,
      fontSize: size,
      padding: `${size * 0.32}px ${size * 0.7}px`,
      borderRadius: size,
      letterSpacing: 0.5,
      boxShadow: "0 6px 0 rgba(31,42,20,0.18)",
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Stamp: React.FC<{ t0: number; text: string; color?: string; size?: number; rot?: number; style?: React.CSSProperties }> = ({
  t0,
  text,
  color = C.red,
  size = 72,
  rot = -10,
  style,
}) => {
  const t = useT();
  if (t < t0) return null;
  const p = ramp(t, t0, t0 + 0.18);
  const s = 1.7 - 0.7 * p;
  return (
    <div
      style={{
        position: "absolute",
        transform: `rotate(${rot}deg) scale(${s})`,
        opacity: p,
        border: `${size * 0.09}px solid ${color}`,
        color,
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: size,
        padding: `${size * 0.12}px ${size * 0.35}px`,
        borderRadius: size * 0.18,
        letterSpacing: size * 0.06,
        background: "rgba(255,254,246,0.92)",
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/** Callout label with leader line, positioned in scene coords */
export const Callout: React.FC<{ t0: number; x: number; y: number; tx: number; ty: number; text: string; dark?: boolean }> = ({
  t0,
  x,
  y,
  tx,
  ty,
  text,
  dark = true,
}) => {
  const t = useT();
  const p = ramp(t, t0, t0 + 0.4);
  if (p <= 0) return null;
  const lx = x + (tx - x) * p;
  const ly = y + (ty - y) * p;
  return (
    <>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={860} height={940}>
        <line x1={x} y1={y} x2={lx} y2={ly} stroke={C.forest} strokeWidth={4} strokeLinecap="round" />
        <circle cx={x} cy={y} r={11} fill={C.banana} stroke={C.forest} strokeWidth={4} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: tx,
          top: ty,
          transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * p})`,
          opacity: p,
        }}
      >
        <Pill bg={dark ? C.forest : C.banana} color={dark ? C.paper : C.forest} size={32}>
          {text}
        </Pill>
      </div>
    </>
  );
};

export const Card: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode }> = ({ style, children }) => (
  <div
    style={{
      position: "absolute",
      background: C.card,
      borderRadius: 36,
      border: `3px solid ${C.line}`,
      boxShadow: "0 18px 40px rgba(31,42,20,0.12), 0 4px 0 rgba(31,42,20,0.06)",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Title: React.FC<{ children: React.ReactNode; size?: number; style?: React.CSSProperties; color?: string }> = ({
  children,
  size = 64,
  style,
  color = C.forest,
}) => (
  <div
    style={{
      fontFamily: FONT,
      fontWeight: 800,
      fontSize: size,
      color,
      lineHeight: 1.05,
      letterSpacing: -1,
      textAlign: "center",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Banana marker underline behind text — Banana only as fill */
export const Mark: React.FC<{ children: React.ReactNode; p?: number }> = ({ children, p = 1 }) => (
  <span style={{ position: "relative", display: "inline-block" }}>
    <span
      style={{
        position: "absolute",
        left: -8,
        right: -8,
        bottom: 4,
        height: "38%",
        background: C.banana,
        borderRadius: 8,
        transform: `scaleX(${p})`,
        transformOrigin: "left",
        zIndex: 0,
      }}
    />
    <span style={{ position: "relative" }}>{children}</span>
  </span>
);
