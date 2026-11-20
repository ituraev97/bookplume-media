import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import { C, FONT } from "./kit";
import { Burst, Loud, PlateQ, QS } from "./Scenes93";
import Q from "./sheetquiz.json";

const SRC = "sq/vert82.png";
const A = 1585 / 1006;
const STK: QS[] = (Q.labels as { box: number[] }[]).map((l) => ({ x0: l.box[0] - 0.004, y0: l.box[1] - 0.006, x1: l.box[2] + 0.004, y1: l.box[3] + 0.006, rot: 0, off: 99 }));
const PINS: [number, string, number, number][] = (Q.qs as any[]).map((q) => [q.n, q.name, q.pin[0], q.pin[1]]);
const FULL: [number, number, number] = [0.5, 0.5, 1.0];

/* numbered pins over a PlateQ view */
const Nums: React.FC<{ w: number; h: number; view: [number, number, number]; only?: number }> = ({ w, h, view, only }) => {
  const [cx, cy, zw] = view;
  const iw = w / zw, ih = iw / A, L = w / 2 - cx * iw, T = h / 2 - cy * ih;
  return (
    <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      {PINS.filter(([n]) => only === undefined || n === only).map(([n, , fx, fy]) => {
        const x = L + fx * iw, y = T + fy * ih;
        const [bx, by] = ({ 1: [-50, -26], 2: [-52, 12], 3: [54, 10], 4: [54, 34], 5: [54, -34] } as Record<number, [number, number]>)[n] ?? [44, -40];
        return (
          <g key={n}>
            <circle cx={x} cy={y} r={30} fill="none" stroke="#fff" strokeWidth={12} />
            <circle cx={x} cy={y} r={30} fill="none" stroke="#E5251A" strokeWidth={7} />
            <circle cx={x} cy={y} r={7} fill="#E5251A" />
            <circle cx={x + bx} cy={y + by} r={30} fill="#E5251A" stroke="#111" strokeWidth={5} />
            <text x={x + bx} y={y + by + 11} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={34} fill="#fff">{n}</text>
          </g>
        );
      })}
    </svg>
  );
};

const RedBox: React.FC<{ size: number; children: React.ReactNode; rot?: number }> = ({ size, children, rot = -2 }) => (
  <div style={{ background: "#E5251A", border: "9px solid #111", borderRadius: 22, padding: "2px 30px 14px", transform: `rotate(${rot}deg)`, boxShadow: "0 10px 0 #111" }}><Loud size={size}>{children}</Loud></div>
);

/* cover 1080x1920, text inside y 280–1640 */
const Cover: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT }}>
    <Burst w={1080} h={1920} cy={0.5} rot={4} />
    <div style={{ position: "absolute", left: 60, width: 960, top: 300, display: "flex", justifyContent: "center" }}><Loud size={150}>VERTEBRA</Loud></div>
    <div style={{ position: "absolute", left: 60, width: 960, top: 480, display: "flex", justifyContent: "center" }}><RedBox size={150}>QUIZ</RedBox></div>
    <PlateQ src={SRC} aspect={A} x={70} y={760} w={940} h={700} a={0} b={1} from={[0.55, 0.5, 0.85]} to={[0.55, 0.5, 0.85]} still credit="" tilt={-3} loud
      pin={{ x: 0.615, y: 0.48, t0: 0, t1: 99, r: 80 }} arrow stickers={STK} />
    <div style={{ position: "absolute", left: 650, top: 1440, transform: "rotate(9deg)", background: "#E5251A", border: "8px solid #111", borderRadius: 24, padding: "6px 24px 12px", boxShadow: "0 8px 0 #111" }}><Loud size={96}>5/5?</Loud></div>
  </AbsoluteFill>
);

/* Pinterest 1000x1500, no store */
const Pin: React.FC = () => (
  <AbsoluteFill style={{ fontFamily: FONT }}>
    <Burst w={1000} h={1500} cy={0.5} rot={8} />
    <div style={{ position: "absolute", left: 40, width: 920, top: 50, textAlign: "center" }}><Loud size={96}>CAN YOU NAME</Loud></div>
    <div style={{ position: "absolute", left: 40, width: 920, top: 170, display: "flex", justifyContent: "center" }}><RedBox size={92}>ALL 5?</RedBox></div>
    <div style={{ position: "absolute", left: 60, width: 880, top: 370, height: 640 }}>
      <PlateQ src={SRC} aspect={A} x={0} y={0} w={880} h={640} a={0} b={1} from={FULL} to={FULL} still credit="" tilt={-2} loud stickers={STK} />
      <Nums w={880} h={640} view={FULL} />
    </div>
    <div style={{ position: "absolute", left: 50, width: 900, top: 1100, textAlign: "center", fontWeight: 800, fontSize: 54, color: "#111", lineHeight: 1.15 }}>Vertebra anatomy quiz:<br />5 parts of one vertebra</div>
    <div style={{ position: "absolute", left: 50, width: 900, top: 1290, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "#111", color: "#FFE04A", fontWeight: 800, fontSize: 42, padding: "10px 30px 14px", borderRadius: 18 }}>Answers in the pin description</div>
    </div>
    <div style={{ position: "absolute", left: 50, width: 900, top: 1410, textAlign: "center", color: "#111", opacity: 0.75, fontWeight: 700, fontSize: 24 }}>Gray's Anatomy (1918), public domain</div>
  </AbsoluteFill>
);

/* Instagram quiz carousel 1080x1350 */
const CW = 1080, CH = 1350;
const VIEWS: Record<number, [number, number, number]> = { 1: [0.55, 0.3, 0.7], 2: [0.5, 0.72, 0.7], 3: [0.6, 0.45, 0.6], 4: [0.55, 0.6, 0.6] };
const TIPS: Record<number, string> = { 1: "Carries your body weight", 2: "The bumps you feel down your back", 3: "Joins the body to the vertebral arch", 4: "Back wall of the spinal canal" };
const Car: React.FC<{ n: number }> = ({ n }) => {
  if (n === 0) {
    return (
      <AbsoluteFill style={{ fontFamily: FONT }}>
        <Burst w={CW} h={CH} cy={0.5} rot={6} />
        <div style={{ position: "absolute", left: 40, width: 1000, top: 40, textAlign: "center" }}><Loud size={100}>CAN YOU NAME</Loud></div>
        <div style={{ position: "absolute", left: 40, width: 1000, top: 160, display: "flex", justifyContent: "center" }}><RedBox size={92}>ALL 5?</RedBox></div>
        <div style={{ position: "absolute", left: 60, top: 360, width: 960, height: 700 }}>
          <PlateQ src={SRC} aspect={A} x={0} y={0} w={960} h={700} a={0} b={1} from={FULL} to={FULL} still credit="" tilt={-1} loud stickers={STK} />
          <Nums w={960} h={700} view={FULL} />
        </div>
        <div style={{ position: "absolute", left: 60, width: 600, top: 1170, fontWeight: 800, fontSize: 36, color: "#111" }}>thoracic vertebra · from above</div>
        <div style={{ position: "absolute", left: 700, top: 1150, transform: "rotate(-5deg)", background: C.banana, border: "6px solid #111", borderRadius: 20, padding: "8px 20px 12px", fontWeight: 800, fontSize: 38, color: "#111", boxShadow: "0 6px 0 #111" }}>swipe for answers →</div>
      </AbsoluteFill>
    );
  }
  if (n === 5) {
    return (
      <AbsoluteFill style={{ fontFamily: FONT, background: C.forest }}>
        <div style={{ position: "absolute", left: 60, top: 60, fontWeight: 800, fontSize: 36, letterSpacing: 4, color: C.banana }}>ALL 5 ANSWERS</div>
        <div style={{ position: "absolute", left: 60, top: 120, fontWeight: 800, fontSize: 64, color: C.paper }}>How many did you get?</div>
        <div style={{ position: "absolute", left: 60, top: 280, display: "flex", flexDirection: "column", gap: 50 }}>
          {PINS.map(([i, nm]) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 26 }}>
              <div style={{ width: 80, height: 80, borderRadius: 40, background: "#E5251A", border: "5px solid #111", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 44 }}>{i}</div>
              <div style={{ fontWeight: 800, fontSize: 62, color: C.paper }}>{nm}</div>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 60, width: 960, top: 1120, fontWeight: 700, fontSize: 34, color: "#B9D27A", lineHeight: 1.3 }}>Comment your score 👇 · Gray's Anatomy (1918), Fig. 82</div>
      </AbsoluteFill>
    );
  }
  const [, nm, fx, fy] = PINS[n - 1];
  const v = VIEWS[n];
  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: C.paper }}>
      <div style={{ position: "absolute", left: 60, top: 46, display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 92, height: 92, borderRadius: 46, background: "#E5251A", border: "6px solid #111", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 52 }}>{n}</div>
        <div style={{ fontWeight: 800, fontSize: 40, color: C.matcha, letterSpacing: 3 }}>ANSWER</div>
      </div>
      <div style={{ position: "absolute", left: 60, width: 960, top: 160, fontWeight: 800, fontSize: nm.length > 14 ? 74 : 86, color: C.forest, lineHeight: 1.05, letterSpacing: -1, whiteSpace: "nowrap" }}>
        <span style={{ background: C.banana, borderRadius: 14, padding: "0 10px 4px" }}>{nm[0]}</span>{nm.slice(1)}
      </div>
      <PlateQ src={SRC} aspect={A} x={60} y={300} w={960} h={840} a={0} b={1} from={v} to={v} still stickers={STK} pin={{ x: fx, y: fy, t0: 0, t1: 99, r: 60 }} />
      <div style={{ position: "absolute", left: 60, width: 960, top: 1180, display: "flex" }}>
        <div style={{ background: C.forest, color: C.paper, borderRadius: 18, padding: "10px 22px 14px", fontWeight: 800, fontSize: 34 }}>{TIPS[n]}</div>
      </div>
    </AbsoluteFill>
  );
};

export const HeartX = () => (
  <>
    <Composition id="VCover" component={Cover} durationInFrames={1} fps={30} width={1080} height={1920} />
    <Composition id="VPin" component={Pin} durationInFrames={1} fps={30} width={1000} height={1500} />
    <Composition id="VCar" component={Car} durationInFrames={1} fps={30} width={CW} height={CH} defaultProps={{ n: 0 }} />
  </>
);
