import React from "react";
import { C, FONT, Pill, Scene, Stamp, ramp, useT } from "./kit";
import { LogoMark } from "./Illus10";
import { Plate } from "./Plates";
import { ANCHOR, BONE_COL, BONE_NAME, Bone, FM, ORDER, SkullSide, SkullTop } from "./Skull57";

export const A188 = 1980 / 1826;
const pop = (t: number, t0: number, d = 0.3) => {
  const p = ramp(t, t0, t0 + d);
  return { opacity: p, transform: `scale(${0.6 + 0.4 * p + 0.08 * Math.sin(Math.min(1, p) * Math.PI)})` } as React.CSSProperties;
};
const center = (top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: 0, width: 860, top, display: "flex", justifyContent: "center", ...extra });
const Big: React.FC<{ size?: number; children: React.ReactNode; color?: string }> = ({ size = 110, children, color = C.forest }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1, letterSpacing: -2, textAlign: "center" }}>{children}</div>
);
export const liveAlpha = (_t: number) => 0;
const fg = (b: Bone) => (b === "P" ? C.forest : C.paper);
const Letter: React.FC<{ b: Bone; size?: number; on?: number; style?: React.CSSProperties }> = ({ b, size = 64, on = 1, style }) => (
  <div style={{ width: size * 1.2, height: size * 1.2, borderRadius: size * 0.3, background: on > 0.5 ? BONE_COL[b] : "rgba(31,42,20,0.08)", color: on > 0.5 ? fg(b) : "rgba(31,42,20,0.3)", border: `${Math.max(3, size * 0.06)}px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 800, fontSize: size, boxShadow: "0 6px 0 rgba(31,42,20,0.2)", ...style }}>{b}</div>
);

// skull placement inside the scene
const SX = 50, SY = 130, SW = 760;
const k = SW / 1000;
const Pin: React.FC<{ b: Bone; p: number; hot?: boolean }> = ({ b, p, hot }) => {
  if (p <= 0) return null;
  const [x, y] = ANCHOR[b];
  return (
    <div style={{ position: "absolute", left: SX + x * k, top: SY + y * k, width: 0, height: 0 }}>
      <div style={{ position: "absolute", left: -15, top: -15, width: 30, height: 30, borderRadius: 15, background: hot ? C.banana : C.paper, border: `5px solid ${C.forest}`, transform: `scale(${p})`, boxSizing: "border-box" }} />
    </div>
  );
};

/* 1. Hook: Gray's 1918 side view of the skull, push in on the cranium */
export const V1: React.FC = () => {
  const t = useT();
  return (
    <Scene start={-0.6} end={4.0} push={0.02}>
      <div style={center(10, { ...pop(t, 0, 0.25), whiteSpace: "nowrap" })}>
        <Big size={78}>NAME ALL 8</Big>
      </div>
      <div style={center(98, { ...pop(t, 0.9, 0.25), whiteSpace: "nowrap" })}>
        <Big size={84} color={C.red}>CRANIAL BONES?</Big>
      </div>
      <Plate src="plates/skull188.png" aspect={A188} x={60} y={210} w={740} a={-0.6} b={4.0} zoomFrom={[1, 0.5, 0.5]} zoomTo={[1.3, 0.6, 0.32]} />
      <Stamp t0={2.3} text="1 SENTENCE" size={56} rot={-8} color={C.forest} style={{ left: 250, top: 760 }} />
    </Scene>
  );
};

/* 2. The sentence */
const WORDS6: [Bone, string, number][] = [["O", "ld", 4.01], ["P", "eople", 4.21], ["F", "rom", 4.53], ["T", "exas", 4.72], ["E", "at", 5.13], ["S", "piders", 5.36]];
export const V2: React.FC = () => {
  const t = useT();
  return (
    <Scene start={4.0} end={8.2} push={0.015}>
      <div style={{ position: "absolute", left: 10, top: 10, width: 840, height: 910, borderRadius: 48, background: C.forest, ...pop(t, 3.98, 0.3) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 40, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 7, color: C.matchaLight }}>REMEMBER THIS SENTENCE</div>
        {WORDS6.map(([b, rest, t0], i) => {
          const p = ramp(t, t0 - 0.05, t0 + 0.2);
          const pulse = Math.sin(Math.PI * Math.min(1, Math.max(0, (t - (6.5 + i * 0.16)) / 0.3)));
          return (
            <div key={b} style={{ position: "absolute", left: 120, top: 112 + i * 112, height: 104, display: "flex", alignItems: "center", gap: 26, opacity: p, transform: `translateX(${(1 - p) * -50}px)` }}>
              <Letter b={b} size={72} style={{ transform: `scale(${1 + 0.14 * pulse})`, border: `5px solid ${C.paper}` }} />
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 84, color: C.paper, letterSpacing: -1 }}>
                <span style={{ color: C.banana }}>{b}</span>
                {rest}
              </div>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 0, width: 840, top: 800, display: "flex", justifyContent: "center", ...pop(t, 7.3) }}>
          <Pill size={40} bg={C.banana} color={C.forest}>1 letter = 1 bone</Pill>
        </div>
      </div>
    </Scene>
  );
};

/* 3. Bone by bone on our own skull diagram */
const STEPS: [Bone, number, string][] = [["O", 8.38, "back of the skull"], ["P", 10.13, "top + sides"], ["F", 12.01, "your forehead"], ["T", 13.38, "above your ears"], ["E", 15.29, "between the eye sockets"]];
export const V3: React.FC = () => {
  const t = useT();
  const lit: Partial<Record<Bone, number>> = {};
  const glow: Partial<Record<Bone, number>> = {};
  let cur = -1;
  STEPS.forEach(([b, t0], i) => {
    lit[b] = ramp(t, t0 - 0.05, t0 + 0.35);
    const g = (t - t0) / 0.8;
    if (g > 0 && g < 1) glow[b] = g;
    if (t >= t0 - 0.05) cur = i;
  });
  const z = ramp(t, 15.2, 15.85);
  const zs = 1 + 1.25 * z;
  const [ex, ey] = ANCHOR.E;
  const ox = SX + ex * k, oy = SY + ey * k;
  return (
    <Scene start={8.2} end={17.35} push={0.015}>
      <div style={{ position: "absolute", left: 0, top: 100 * z, width: 860, height: 800 - 100 * z, overflow: z > 0 ? "hidden" : "visible", borderRadius: 40 }}>
        <div style={{ position: "absolute", left: 0, top: -100 * z, width: 860, height: 800, transformOrigin: `${ox}px ${oy}px`, transform: `translate(${(430 - ox) * z}px, ${(470 - oy) * z}px) scale(${zs})` }}>
          <div style={{ position: "absolute", left: SX, top: SY }}>
            <SkullSide w={SW} lit={lit} glow={glow} dimOthers={0.0} />
          </div>
          {STEPS.map(([b, t0], i) => <Pin key={b} b={b} p={ramp(t, t0, t0 + 0.25) * (i === cur ? 1 : 0)} hot />)}
        </div>
      </div>
      {cur >= 0 && (() => {
        const [b, t0, desc] = STEPS[cur];
        const p = ramp(t, t0 - 0.05, t0 + 0.22);
        return (
          <>
            <div key={b} style={{ position: "absolute", left: 0, top: 16, display: "flex", gap: 20, alignItems: "center", opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
              <Letter b={b} size={64} />
              <Big size={76} color={C.forest}>{BONE_NAME[b].toUpperCase()}</Big>
            </div>
            <div style={{ position: "absolute", left: 0, width: 860, top: 806, display: "flex", justifyContent: "center", ...pop(t, t0 + 0.35) }}>
              <Pill size={40} bg={C.forest}>{desc}</Pill>
            </div>
          </>
        );
      })()}
      <div style={{ position: "absolute", right: 0, top: 10, display: "flex", gap: 8 }}>
        {ORDER.map((b) => {
          const st = STEPS.find((s) => s[0] === b);
          return <Letter key={b} b={b} size={30} on={st && t >= st[1] ? 1 : 0} />;
        })}
      </div>
    </Scene>
  );
};

/* 4. Sphenoid = the keystone */
export const V4: React.FC = () => {
  const t = useT();
  const L = ramp(t, 17.55, 17.9);
  const nb: [Bone, number][] = [["F", 19.14], ["P", 19.36], ["T", 19.58], ["O", 19.8], ["E", 20.02]];
  const lit: Partial<Record<Bone, number>> = { S: L };
  const glow: Partial<Record<Bone, number>> = {};
  nb.forEach(([b, t0]) => {
    lit[b] = 0.55 * ramp(t, t0, t0 + 0.2);
  });
  const g = ((t - 17.6) % 1.1) / 1.1;
  if (t > 17.6) glow.S = g;
  const [sx, sy] = ANCHOR.S;
  return (
    <Scene start={17.35} end={21.35} push={0.015}>
      <div style={{ position: "absolute", left: SX, top: SY }}>
        <SkullSide w={SW} lit={lit} glow={glow} dimOthers={0.5 * L} />
      </div>
      <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {nb.map(([b, t0]) => {
          const p = ramp(t, t0 - 0.1, t0 + 0.25);
          if (p <= 0) return null;
          const [x, y] = ANCHOR[b];
          const x0 = SX + sx * k, y0 = SY + sy * k, x1 = SX + x * k, y1 = SY + y * k;
          return (
            <g key={b}>
              <line x1={x0} y1={y0} x2={x0 + (x1 - x0) * p} y2={y0 + (y1 - y0) * p} stroke={C.forest} strokeWidth={7} strokeLinecap="round" />
              <line x1={x0} y1={y0} x2={x0 + (x1 - x0) * p} y2={y0 + (y1 - y0) * p} stroke={BONE_COL.S} strokeWidth={3} strokeLinecap="round" />
              {p >= 1 && <circle cx={x1} cy={y1} r={13} fill={BONE_COL[b]} stroke={C.forest} strokeWidth={4} />}
            </g>
          );
        })}
        {L > 0 && <circle cx={SX + sx * k} cy={SY + sy * k} r={18 * L} fill={C.banana} stroke={C.forest} strokeWidth={5} />}
      </svg>
      <div style={{ position: "absolute", left: 0, top: 16, display: "flex", gap: 20, alignItems: "center", ...pop(t, 17.55, 0.25) }}>
        <Letter b="S" size={64} />
        <Big size={76}>SPHENOID</Big>
      </div>
      <div style={{ position: "absolute", left: 0, width: 860, top: 806, display: "flex", justifyContent: "center", gap: 16 }}>
        <div style={pop(t, 18.46)}>
          <Pill size={40} bg={BONE_COL.S} color={C.forest}>
            <svg width={34} height={30} viewBox="0 0 34 30" style={{ marginRight: 12, verticalAlign: "-3px" }}>
              <path d="M3 3 L31 3 L24 27 L10 27 Z" fill={C.forest} />
            </svg>
            the KEYSTONE
          </Pill>
        </div>
        <div style={pop(t, 19.53)}>
          <Pill size={40} bg={C.forest}>joins almost all</Pill>
        </div>
      </div>
    </Scene>
  );
};

/* 5. Six names, two of them in pairs = 8 */
export const V5: React.FC = () => {
  const t = useT();
  const pP = ramp(t, 22.3, 22.7);
  const row = (top: number, t0: number, children: React.ReactNode) => (
    <div style={{ position: "absolute", left: 420, width: 440, top, display: "flex", alignItems: "center", gap: 16, ...pop(t, t0) }}>{children}</div>
  );
  return (
    <Scene start={21.35} end={25.4} push={0.015}>
      <div style={{ position: "absolute", left: 10, top: 70 }}>
        <SkullTop w={390} litP={pP} litF={0.15 * pP} litO={0.15 * pP} split={ramp(t, 22.7, 23.1)} />
      </div>
      <div style={{ position: "absolute", left: 60, top: 640, fontFamily: FONT, fontWeight: 800, fontSize: 28, color: C.forest, opacity: 0.65 * ramp(t, 22.6, 22.9) }}>view from above</div>
      <div style={{ position: "absolute", left: 110, top: 360, ...pop(t, 22.75) }}><Pill size={30} bg={C.forest}>L</Pill></div>
      <div style={{ position: "absolute", left: 270, top: 360, ...pop(t, 22.85) }}><Pill size={30} bg={C.forest}>R</Pill></div>
      {row(70, 21.58, <>
        <div style={{ display: "flex", gap: 6 }}>{ORDER.map((b) => <Letter key={b} b={b} size={30} />)}</div>
      </>)}
      {row(150, 21.75, <Big size={56}>6 names</Big>)}
      {row(270, 22.34, <><Letter b="P" size={54} /><div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.forest }}>Parietal <span style={{ color: C.red }}>×2</span></div></>)}
      {row(390, 23.0, <><Letter b="T" size={54} /><div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 52, color: C.forest }}>Temporal <span style={{ color: C.red }}>×2</span></div></>)}
      {row(510, 23.4, <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.forest, opacity: 0.7 }}>+ 4 single bones</div>)}
      <div style={{ position: "absolute", left: 0, width: 860, top: 760, display: "flex", justifyContent: "center", ...pop(t, 24.45) }}>
        <div style={{ background: C.banana, color: C.forest, borderRadius: 30, padding: "14px 44px 20px", fontFamily: FONT, fontWeight: 800, fontSize: 76, boxShadow: "0 8px 0 rgba(31,42,20,0.2)" }}>= 8 bones</div>
      </div>
    </Scene>
  );
};

/* 6. The 1918 atlas with modern labels */
export const V6: React.FC = () => {
  const t = useT();
  return (
    <Scene start={25.4} end={28.05} push={0.01}>
      <Plate src="plates/skull188.png" aspect={A188} x={20} y={40} w={820} a={25.4} b={28.05} zoomFrom={[1, 0.5, 0.5]} zoomTo={[1.05, 0.5, 0.45]}
        labels={[
          { x: 0.2, y: 0.27, text: "frontal", t: 25.6, ox: 40, oy: -125 },
          { x: 0.72, y: 0.27, text: "parietal", t: 25.85, ox: 30, oy: -110 },
          { x: 0.62, y: 0.47, text: "temporal", t: 26.1, ox: 60, oy: -40 },
          { x: 0.91, y: 0.66, text: "occipital", t: 26.35, ox: -30, oy: 150 },
          { x: 0.385, y: 0.45, text: "sphenoid", t: 26.6, hot: true, ox: 30, oy: 160 },
          { x: 0.222, y: 0.45, text: "ethmoid", t: 26.85, hot: true, ox: 60, oy: -150 },
        ]} />
      <div style={{ position: "absolute", left: 0, width: 860, top: 820, display: "flex", justifyContent: "center", ...pop(t, 27.1) }}>
        <div style={{ background: C.card, border: `3px solid ${C.line}`, borderRadius: 18, padding: "8px 22px 11px", fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.forest, whiteSpace: "nowrap" }}>
          <span style={{ color: C.matcha }}>1918 atlas name:</span> "Sphenoidal" = sphenoid
        </div>
      </div>
    </Scene>
  );
};

/* 7. Quick test */
export const V7: React.FC = () => {
  const t = useT();
  const c0 = 31.35;
  const n = t < c0 ? null : t < c0 + 0.5 ? 3 : t < c0 + 1.0 ? 2 : t < c0 + 1.5 ? 1 : null;
  return (
    <Scene start={28.05} end={32.9}>
      <div style={{ position: "absolute", left: 10, top: 20, width: 840, height: 880, borderRadius: 48, background: C.forest, ...pop(t, 28.1, 0.35) }}>
        <div style={{ position: "absolute", left: 0, width: 840, top: 56, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
        <div style={{ position: "absolute", left: 50, width: 740, top: 140, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 64, lineHeight: 1.12, color: C.paper, ...pop(t, 28.98) }}>
          Your <span style={{ color: C.banana }}>spinal cord</span> leaves the skull through which bone?
        </div>
        <div style={{ position: "absolute", left: 0, width: 840, top: 470, display: "flex", justifyContent: "center", gap: 14 }}>
          {ORDER.map((b, i) => (
            <div key={b} style={pop(t, 29.9 + i * 0.15)}><Letter b={b} size={62} style={{ border: `5px solid ${C.paper}` }} /></div>
          ))}
        </div>
        {n && (
          <div style={{ position: "absolute", left: 0, width: 840, top: 640, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 150, color: C.banana, lineHeight: 1, transform: `scale(${1.3 - 0.3 * ramp(t, Math.floor((t - c0) / 0.5) * 0.5 + c0, Math.floor((t - c0) / 0.5) * 0.5 + c0 + 0.15)})` }}>{n}</div>
        )}
      </div>
    </Scene>
  );
};

/* 8. Answer: occipital, foramen magnum */
export const V8: React.FC = () => {
  const t = useT();
  const L = ramp(t, 32.93, 33.25);
  const fm = ramp(t, 33.3, 34.5);
  const g = ((t - 33.0) % 1.2) / 1.2;
  return (
    <Scene start={32.9} end={36.3} push={0.012}>
      <div style={{ position: "absolute", left: SX + 20, top: SY - 30 }}>
        <SkullSide w={SW - 40} lit={{ O: L }} glow={t > 33 ? { O: g } : {}} dimOthers={0.55 * L} fm={fm} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, ...pop(t, 33.0) }}>
        <Pill size={56} bg={C.matcha}>OCCIPITAL ✓</Pill>
      </div>
      {(() => {
        const p = ramp(t, 34.95, 35.25);
        if (p <= 0) return null;
        const kk = (SW - 40) / 1000;
        const x = SX + 20 + FM[0] * kk, y = SY - 30 + FM[1] * kk;
        return (
          <>
            <svg width={860} height={940} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
              <line x1={x - 40} y1={y + 10} x2={x - 40 - 130 * p} y2={y + 110 * p} stroke={C.forest} strokeWidth={5} strokeLinecap="round" />
            </svg>
            <div style={{ position: "absolute", left: x - 190, top: y + 110, transform: `translate(-50%, 0) scale(${0.8 + 0.2 * p})`, opacity: p }}>
              <Pill size={38} bg={C.banana} color={C.forest}>foramen magnum</Pill>
            </div>
          </>
        );
      })()}
      <div style={{ position: "absolute", left: 0, width: 860, top: 846, display: "flex", justifyContent: "center", ...pop(t, 35.5) }}>
        <Pill size={36} bg={C.forest}>magnum = “big” · the big hole</Pill>
      </div>
    </Scene>
  );
};

/* 9. Save */
export const V9: React.FC = () => {
  const t = useT();
  const b = ramp(t, 36.35, 36.7);
  return (
    <Scene start={36.3} end={38.5}>
      <div style={center(30, pop(t, 36.35))}>
        <svg width={200} height={260} viewBox="0 0 220 280">
          <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.forest} strokeWidth={8} transform={`translate(0 ${(1 - b) * -40})`} />
        </svg>
      </div>
      <div style={center(330, pop(t, 36.4))}>
        <Big size={120}>SAVE THIS</Big>
      </div>
      <div style={center(480, pop(t, 37.37))}>
        <Big size={58} color={C.matcha}>for your next anatomy exam</Big>
      </div>
      <div style={{ ...center(620), gap: 12, ...pop(t, 37.84) }}>
        {ORDER.map((b2) => <Letter key={b2} b={b2} size={64} />)}
      </div>
      <div style={center(760, pop(t, 38.0))}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.forest }}>
          <span style={{ color: C.matcha }}>O</span>ld <span style={{ color: C.matcha }}>P</span>eople <span style={{ color: C.matcha }}>F</span>rom <span style={{ color: C.matcha }}>T</span>exas <span style={{ color: C.matcha }}>E</span>at <span style={{ color: C.matcha }}>S</span>piders
        </div>
      </div>
    </Scene>
  );
};

/* 10. End card */
export const V10: React.FC = () => {
  const t = useT();
  return (
    <Scene start={38.5} end={44.0}>
      <div style={{ position: "absolute", left: 30, top: 60, width: 800, height: 760, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, ...pop(t, 38.55, 0.35) }}>
        <div style={{ width: 180, height: 180, borderRadius: 90, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
          <LogoMark size={140} />
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80, color: C.paper }}>Book Plume</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.banana, textAlign: "center", lineHeight: 1.15, opacity: ramp(t, 39.6, 39.95) }}>
          anatomy you'll
          <br />
          actually remember
        </div>
        <div style={{ marginTop: 10, background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 50px", fontFamily: FONT, fontWeight: 800, fontSize: 46, letterSpacing: 2, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 38.5) * 5))})`, opacity: ramp(t, 38.7, 38.95) }}>
          + FOLLOW
        </div>
      </div>
    </Scene>
  );
};
