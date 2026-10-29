import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT } from "./kit";
import { Plate } from "./Plates";
import { Scapula } from "./Shoulder30";
import { Mark } from "./Chrome";

/** 5-slide Instagram / TikTok carousel, 1080x1350. Render each with --props='{"n":1..5}' */
const ASPECT = 1232 / 964;
const NAMES = [
  ["S", "upraspinatus", C.red],
  ["I", "nfraspinatus", C.matcha],
  ["T", "eres minor", C.red],
  ["S", "ubscapularis", C.matcha],
] as const;

const Frame: React.FC<{ n: number; children: React.ReactNode; dark?: boolean }> = ({ n, children, dark }) => (
  <AbsoluteFill style={{ background: dark ? C.forest : C.paper, fontFamily: FONT }}>
    <svg width={1080} height={1350} style={{ position: "absolute" }}>
      <defs>
        <pattern id="cg" width={54} height={54} patternUnits="userSpaceOnUse">
          <circle cx={27} cy={27} r={2.2} fill={dark ? C.matchaLight : C.matcha} opacity={dark ? 0.12 : 0.13} />
        </pattern>
      </defs>
      <rect width={1080} height={1350} fill="url(#cg)" />
    </svg>
    {children}
    {/* footer: brand + page dots */}
    <div style={{ position: "absolute", left: 60, bottom: 46, display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 58, height: 58, borderRadius: 29, background: dark ? C.matcha : C.forest, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Mark size={42} reversed />
      </div>
      <div style={{ fontWeight: 800, fontSize: 32, color: dark ? C.paper : C.forest }}>Book Plume</div>
    </div>
    <div style={{ position: "absolute", right: 60, bottom: 66, display: "flex", gap: 10 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} style={{ width: i === n ? 34 : 14, height: 14, borderRadius: 7, background: i === n ? C.banana : dark ? "rgba(247,246,236,0.3)" : C.line }} />
      ))}
    </div>
  </AbsoluteFill>
);

const Kicker: React.FC<{ children: React.ReactNode; dark?: boolean }> = ({ children, dark }) => (
  <div style={{ fontWeight: 800, fontSize: 30, letterSpacing: 6, color: dark ? C.matchaLight : C.matcha }}>{children}</div>
);

const Tag: React.FC<{ x: number; y: number; children: React.ReactNode; bg?: string; color?: string; size?: number }> = ({ x, y, children, bg = C.forest, color = C.paper, size = 34 }) => (
  <div style={{ position: "absolute", left: x, top: y, background: bg, color, fontWeight: 800, fontSize: size, padding: "8px 20px 11px", borderRadius: 16, whiteSpace: "nowrap", boxShadow: "0 6px 0 rgba(31,42,20,0.15)" }}>{children}</div>
);

/* 1. Cover */
const S1: React.FC = () => (
  <Frame n={1}>
    <div style={{ position: "absolute", left: 60, top: 70, width: 960 }}>
      <Kicker>ANATOMY · SHOULDER</Kicker>
      <div style={{ marginTop: 14, fontWeight: 800, fontSize: 84, lineHeight: 1.02, letterSpacing: -2, color: C.forest }}>
        Can you name the <span style={{ color: C.matcha }}>4 rotator cuff</span> muscles?
      </div>
    </div>
    <Plate src="plates/cuff.png" aspect={ASPECT} x={70} y={370} w={940} a={-1} b={99} zoomFrom={[1, 0.5, 0.5]} zoomTo={[1, 0.5, 0.5]} />
    <div style={{ position: "absolute", right: 60, top: 1150, background: C.banana, color: C.forest, fontWeight: 800, fontSize: 38, padding: "12px 28px 15px", borderRadius: 40 }}>one word → swipe</div>
  </Frame>
);

/* 2. The mnemonic */
const S2: React.FC = () => (
  <Frame n={2} dark>
    <div style={{ position: "absolute", left: 0, width: 1080, top: 90, textAlign: "center" }}>
      <Kicker dark>REMEMBER ONE WORD</Kicker>
    </div>
    <div style={{ position: "absolute", left: 0, width: 1080, top: 170, display: "flex", justifyContent: "center", gap: 22 }}>
      {"SITS".split("").map((l, i) => (
        <div key={i} style={{ width: 170, height: 210, borderRadius: 30, background: i % 2 ? C.matcha : C.banana, color: i % 2 ? C.paper : C.forest, fontWeight: 800, fontSize: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>{l}</div>
      ))}
    </div>
    <div style={{ position: "absolute", left: 140, top: 470, display: "flex", flexDirection: "column", gap: 26 }}>
      {NAMES.map(([l, r], i) => (
        <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
          <div style={{ width: 60, fontWeight: 800, fontSize: 40, color: C.matchaLight }}>{i + 1}</div>
          <div style={{ fontWeight: 800, fontSize: 70, color: C.paper, letterSpacing: -1 }}>
            <span style={{ color: C.banana, fontSize: 88 }}>{l}</span>
            {r}
          </div>
        </div>
      ))}
    </div>
  </Frame>
);

/* 3. Where they sit: our own diagram */
const S3: React.FC = () => (
  <Frame n={3}>
    <div style={{ position: "absolute", left: 60, top: 70, width: 960 }}>
      <Kicker>WHERE THEY SIT · LEFT SCAPULA FROM BEHIND</Kicker>
      <div style={{ marginTop: 10, fontWeight: 800, fontSize: 60, lineHeight: 1.05, letterSpacing: -1, color: C.forest }}>
        <span style={{ color: C.red }}>Supra</span> = above the spine.<br /><span style={{ color: C.matcha }}>Infra</span> = below it.
      </div>
    </div>
    <div style={{ position: "absolute", left: 150, top: 330 }}>
      <Scapula t={10} w={760} lit={{ sup: 0 }} showTmaj={false} />
    </div>
    <Tag x={560} y={372} bg={C.red}>Supraspinatus</Tag>
    <Tag x={640} y={600} bg={C.matcha}>Infraspinatus</Tag>
    <Tag x={110} y={760} bg={C.red}>Teres minor · outer edge</Tag>
    <Tag x={790} y={520} bg={C.banana} color={C.forest} size={28}>← spine</Tag>
    <div style={{ position: "absolute", left: 60, width: 960, top: 1090, background: C.card, border: `3px solid ${C.line}`, borderRadius: 22, padding: "16px 26px 20px", boxSizing: "border-box", fontWeight: 800, fontSize: 36, color: C.forest }}>
      <span style={{ color: C.matcha }}>4th S · Subscapularis</span> sits on the FRONT, facing the ribs
    </div>
  </Frame>
);

/* 4. Attachments + the trap */
const S4: React.FC = () => {
  const tile = (l: string, bg: string) => (
    <div style={{ width: 110, height: 128, borderRadius: 22, background: bg, color: bg === C.banana ? C.forest : C.paper, fontWeight: 800, fontSize: 82, display: "flex", alignItems: "center", justifyContent: "center" }}>{l}</div>
  );
  return (
    <Frame n={4}>
      <div style={{ position: "absolute", left: 60, top: 70 }}>
        <Kicker>WHERE THEY ATTACH · HUMERUS</Kicker>
      </div>
      <div style={{ position: "absolute", left: 60, top: 170, display: "flex", gap: 16, alignItems: "center" }}>
        {tile("S", C.red)}
        {tile("I", C.matcha)}
        {tile("T", C.red)}
        <div style={{ fontWeight: 800, fontSize: 64, color: C.forest, margin: "0 10px" }}>→</div>
        <div style={{ fontWeight: 800, fontSize: 58, color: C.forest, lineHeight: 1 }}>
          GREATER
          <div style={{ fontSize: 40, color: C.matcha }}>tubercle</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 60, top: 360, display: "flex", gap: 16, alignItems: "center" }}>
        {tile("S", C.banana)}
        <div style={{ fontWeight: 800, fontSize: 64, color: C.forest, margin: "0 10px" }}>→</div>
        <div style={{ fontWeight: 800, fontSize: 58, color: C.red, lineHeight: 1 }}>
          LESSER
          <div style={{ fontSize: 40, color: C.matcha }}>tubercle</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 60, top: 560, width: 960, height: 560, borderRadius: 36, background: C.card, border: `4px solid ${C.line}`, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 36, top: 30 }}>
          <div style={{ display: "inline-block", background: C.red, color: C.paper, fontWeight: 800, fontSize: 34, padding: "8px 22px 11px", borderRadius: 30 }}>EXAM TRAP</div>
          <div style={{ marginTop: 18, fontWeight: 800, fontSize: 54, lineHeight: 1.08, color: C.forest, width: 470 }}>
            Teres <span style={{ color: C.red }}>major</span> is NOT in the cuff
          </div>
          <div style={{ marginTop: 16, fontWeight: 700, fontSize: 30, color: C.matcha, width: 440, lineHeight: 1.25 }}>
            Teres <b>minor</b> is. Same name, different team.
          </div>
        </div>
        <div style={{ position: "absolute", left: 510, top: 40 }}>
          <Scapula t={10} w={420} lit={{ tmaj: 0 }} red={{ tmaj: true }} dim={0.5} />
        </div>
      </div>
    </Frame>
  );
};

/* 5. Quick test + answer + save */
const S5: React.FC = () => (
  <Frame n={5} dark>
    <div style={{ position: "absolute", left: 0, width: 1080, top: 90, textAlign: "center" }}>
      <div style={{ fontWeight: 800, fontSize: 40, letterSpacing: 8, color: C.banana }}>QUICK TEST</div>
      <div style={{ margin: "24px auto 0", width: 900, fontWeight: 800, fontSize: 70, lineHeight: 1.08, color: C.paper }}>
        Which one <span style={{ color: C.banana }}>starts lifting</span> your arm out to the side?
      </div>
    </div>
    <div style={{ position: "absolute", left: 90, width: 900, top: 430, borderRadius: 30, background: C.paper, padding: "28px 36px 32px", boxSizing: "border-box" }}>
      <div style={{ fontWeight: 800, fontSize: 30, letterSpacing: 4, color: C.matcha }}>ANSWER</div>
      <div style={{ fontWeight: 800, fontSize: 70, color: C.red, letterSpacing: -1 }}>Supraspinatus</div>
      <div style={{ fontWeight: 700, fontSize: 34, color: C.forest, lineHeight: 1.3, marginTop: 6 }}>
        It starts abduction (about the first 15°), then the <b>deltoid</b> takes over.
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, width: 1080, top: 860, display: "flex", justifyContent: "center", alignItems: "center", gap: 26 }}>
      <svg width={80} height={100} viewBox="0 0 220 280">
        <path d="M30 20 Q30 6 44 6 L176 6 Q190 6 190 20 L190 270 L110 210 L30 270 Z" fill={C.banana} stroke={C.paper} strokeWidth={10} />
      </svg>
      <div style={{ fontWeight: 800, fontSize: 62, color: C.paper }}>Save for your exam</div>
    </div>
    <div style={{ position: "absolute", left: 0, width: 1080, top: 1040, textAlign: "center", fontWeight: 700, fontSize: 24, color: C.matchaLight }}>
      Plate: Gray's Anatomy (1918), public domain · diagrams: Book Plume
    </div>
  </Frame>
);

export const CarouselSlide: React.FC<{ n: number }> = ({ n }) => (n === 1 ? <S1 /> : n === 2 ? <S2 /> : n === 3 ? <S3 /> : n === 4 ? <S4 /> : <S5 />);
