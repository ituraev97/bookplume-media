import React from "react";
import { C, FONT, ramp, useT } from "./kit";
import { Facts, Stage, LogoMark } from "./Chrome16";
import { Bottle, CellSheet, CheckRow, DayLine, DoorHandle, Hand, HeadProfile, House, Keyboard, NasalSection, PhoneIcon, PillCross, Sneeze, Soap, SymptomCurve, Thermo, Virus, VirusGrid } from "./IllusCold";

const abs = (x: number, y: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: "absolute", left: x, top: y, ...extra });
const pop = (t: number, t0: number, d = 0.3): React.CSSProperties => {
  const p = ramp(t, t0, t0 + d);
  return { opacity: p, transform: `scale(${0.6 + 0.4 * p + 0.08 * Math.sin(Math.min(1, p) * Math.PI)})` };
};
const Big: React.FC<{ size?: number; color?: string; children: React.ReactNode }> = ({ size = 100, color = C.forest, children }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1.02, letterSpacing: -2 }}>{children}</div>
);
const Mk: React.FC<{ p: number; children: React.ReactNode }> = ({ p, children }) => (
  <span style={{ background: `linear-gradient(${C.banana}, ${C.banana}) no-repeat 0 88% / ${p * 100}% 38%` }}>{children}</span>
);
const Layer: React.FC<{ o: number; children: React.ReactNode }> = ({ o, children }) => (o <= 0.001 ? null : <div style={{ position: "absolute", inset: 0, opacity: o }}>{children}</div>);

/* INTRO 0.6 – 29.4 */
export const SIntro: React.FC = () => {
  const t = useT();
  const title = 1 - ramp(t, 16.8, 17.3);
  return (
    <Stage a={-1} b={29.2}>
      <div style={abs(-40, 60)}>
        <HeadProfile w={1000} t={t} p={ramp(t, 1.0, 4.4)} red={ramp(t, 22.8, 24)} />
      </div>
      <Layer o={title}>
        <div style={abs(1000, 40, { width: 780, ...pop(t, 0) })}>
          <Big size={92}>
            What happens when you <Mk p={ramp(t, 0.5, 1.4)}>catch a cold</Mk>
          </Big>
        </div>
        <Facts
          x={1000}
          y={360}
          w={760}
          items={[
            { t: 4.7, text: "the most common infection in humans" },
            { t: 8.4, text: "colds a year for most adults", big: "2–3", bg: C.forest },
          ]}
        />
      </Layer>
      <Layer o={1 - title}>
        <div style={abs(1000, 60, { width: 780 })}>
          <Big size={64}>From the first moment</Big>
          <Big size={64} color={C.matcha}>
            to the last cough
          </Big>
        </div>
        <div style={abs(1000, 300, { width: 780, ...pop(t, 22.9) })}>
          <div style={{ background: C.forest, color: C.paper, borderRadius: 30, padding: "26px 32px", fontFamily: FONT, fontWeight: 800, fontSize: 44, lineHeight: 1.2 }}>
            Why the miserable part <span style={{ color: C.banana }}>isn't really the virus</span>
          </div>
        </div>
      </Layer>
    </Stage>
  );
};

/* 1. The culprit 29.4 – 59.3 */
export const SCulprit: React.FC = () => {
  const t = useT();
  const n = Math.round(200 * ramp(t, 32.0, 35.0));
  return (
    <Stage a={31.8} b={59.1}>
      <div style={abs(20, 40)}>
        <VirusGrid w={1000} n={n} t={t} hi={ramp(t, 41.0, 41.6)} />
      </div>
      <div style={abs(380, 560, pop(t, 35.5))}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Virus size={130} t={t} />
          <Big size={56}>rhinovirus</Big>
        </div>
      </div>
      <Facts
        items={[
          { t: 32.0, text: "different viruses can cause a cold", big: "200+", bg: C.forest },
          { t: 38.1, text: "\"rhino\" = Greek for nose" },
          { t: 41.0, text: "of all colds are rhinovirus", big: "up to 50%", bg: C.matcha },
          { t: 43.8, text: "coronaviruses cause some colds too" },
          { t: 48.2, text: "→ no single vaccine for the common cold", bg: C.red },
        ]}
      />
    </Stage>
  );
};

/* 2. Getting in 59.3 – 90.1 */
export const SGettingIn: React.FC = () => {
  const t = useT();
  const a = 1 - ramp(t, 71.2, 71.6);
  return (
    <Stage a={61.6} b={89.9}>
      <Layer o={a}>
        <div style={abs(0, 40)}>
          <Sneeze w={1000} t={t} p={ramp(t, 63.8, 65.5)} />
        </div>
        <Facts
          items={[
            { t: 61.6, text: "nose · eyes · mouth", bg: C.forest },
            { t: 64.5, text: "coughs and sneezes release droplets full of virus" },
            { t: 68.9, text: "you breathe them in" },
          ]}
        />
      </Layer>
      <Layer o={1 - a}>
        <div style={abs(40, 40, { display: "flex", gap: 40 })}>
          {[
            [<DoorHandle size={220} />, 76.7],
            [<PhoneIcon size={220} />, 77.5],
            [<Keyboard size={220} />, 78.2],
          ].map(([el, t0], i) => (
            <div key={i} style={{ background: "#FFFEF6", border: `3px solid ${C.line}`, borderRadius: 30, padding: 20, ...pop(t, t0 as number), transform: `${pop(t, t0 as number).transform} translateY(${Math.sin(t * 2 + i) * 6}px)` }}>
              {el}
            </div>
          ))}
        </div>
        <div style={abs(120, 360, { transform: `translate(${ramp(t, 79.0, 81.5) * 360}px, ${-ramp(t, 79.0, 81.5) * 80}px)`, opacity: ramp(t, 78.9, 79.2) })}>
          <Hand size={260} rot={-20} />
        </div>
        <div style={abs(620, 420, pop(t, 82.0))}>
          <Big size={52} color={C.red}>
            → face → nose
          </Big>
        </div>
        <div style={abs(100, 560, pop(t, 84.3))}>
          <Soap size={170} t={t} />
        </div>
        <Facts
          items={[
            { t: 73.0, text: "cold viruses survive on objects", big: "hours", bg: C.forest },
            { t: 79.0, text: "touch the surface, then your face" },
            { t: 84.3, text: "washing hands = #1 way to avoid a cold", bg: C.matcha },
          ]}
        />
      </Layer>
    </Stage>
  );
};

/* 3. Silent days 90.1 – 122.2 */
export const SSilent: React.FC = () => {
  const t = useT();
  const a = 1 - ramp(t, 100.9, 101.3);
  return (
    <Stage a={92.4} b={122.0}>
      <Layer o={a}>
        <div style={abs(40, 20)}>
          <CellSheet w={1000} t={t} infected={ramp(t, 93.0, 93.4)} alarm={0} spread={ramp(t, 96.8, 99.5)} />
        </div>
        <Facts
          items={[
            { t: 92.5, text: "the virus latches onto cells lining your nose" },
            { t: 96.4, text: "and turns them into factories that copy it", bg: C.red },
          ]}
        />
      </Layer>
      <Layer o={1 - a}>
        <div style={abs(20, 40)}>
          <DayLine
            w={1040}
            days={4}
            bands={[
              { a: 0.5, b: 3, color: C.forest, label: "incubation: 12 h – 3 days", k: ramp(t, 103.4, 104.6) },
              { a: 1, b: 3, color: C.red, label: "contagious before symptoms", k: ramp(t, 108.3, 109.5) },
            ]}
            marker={t > 116.7 ? 3 : undefined}
          />
        </div>
        <Facts
          items={[
            { t: 101.3, text: "the incubation period", bg: C.forest },
            { t: 108.3, text: "contagious before you feel anything", big: "1–2 days", bg: C.red },
            { t: 112.8, text: "the person who gave it to you may have felt fine" },
            { t: 116.7, text: "first sign for about half of people: a sore, tickly throat", bg: C.matcha },
          ]}
        />
      </Layer>
    </Stage>
  );
};

/* 4. Your nose fights back 122.2 – 183.2 */
export const SFight: React.FC = () => {
  const t = useT();
  const a = 1 - ramp(t, 156.5, 156.9);
  const twist = ramp(t, 156.7, 157.0) * (1 - ramp(t, 159.0, 159.3));
  const b = ramp(t, 159.1, 159.4);
  return (
    <Stage a={124.4} b={183.0}>
      <Layer o={a}>
        <div style={abs(30, 20)}>
          <CellSheet w={1000} t={t} infected={1} alarm={t < 148.5 ? ramp(t, 124.8, 133) : 0} spread={ramp(t, 148.8, 152)} />
        </div>
        <Facts
          items={[
            { t: 124.6, text: "infected cells sound an alarm: interferons", bg: C.forest },
            { t: 130.2, text: "neighbours lock their doors" },
            { t: 134.8, text: "Yale, 2026: lab-grown human nasal tissue", bg: C.matcha },
            { t: 142.2, text: "of nasal cells infected when the alarm works", big: "< 2%", bg: C.forest },
            { t: 148.5, text: "weak alarm → spread + aggressive inflammation", bg: C.red },
          ]}
        />
      </Layer>
      <Layer o={twist}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 44, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center", padding: 80, textAlign: "center" }}>
          <Big size={100} color={C.paper}>
            But that's not even the <span style={{ color: C.banana }}>strangest part…</span>
          </Big>
        </div>
      </Layer>
      <Layer o={b}>
        <div style={abs(20, 60)}>
          <NasalSection w={1020} t={t} swell={ramp(t, 168.0, 172.6)} mucus={ramp(t, 174.4, 176.5)} immune={ramp(t, 168.5, 169.5)} />
        </div>
        <Facts
          items={[
            { t: 159.2, text: "runny nose · stuffiness · sneezing · aches" },
            { t: 162.0, text: "mostly NOT damage from the virus", bg: C.red },
            { t: 165.6, text: "it's your immune system at work", bg: C.forest },
            { t: 168.0, text: "vessels widen → swelling blocks your nose" },
            { t: 174.4, text: "mucus traps and flushes the virus" },
            { t: 178.2, text: "the worst part = your body winning", bg: C.matcha },
          ]}
        />
      </Layer>
    </Stage>
  );
};

/* 5. Peak & recovery 183.2 – 213.4 */
export const SPeak: React.FC = () => {
  const t = useT();
  return (
    <Stage a={185.5} b={213.2}>
      <div style={abs(20, 40)}>
        <SymptomCurve w={1040} p={ramp(t, 185.6, 203)} phases={[ramp(t, 195.2, 195.6), ramp(t, 185.9, 186.3), ramp(t, 199.1, 199.5)]} cough={ramp(t, 207.9, 208.6)} />
      </div>
      <Facts
        items={[
          { t: 185.9, text: "peak: congestion, aches, headache, tiredness", big: "days 4–7", bg: C.red },
          { t: 190.0, text: "fever: rare in adults, more common in kids" },
          { t: 195.2, text: "most contagious: first 3 days", bg: C.forest },
          { t: 202.4, text: "most colds gone in 7–10 days", bg: C.matcha },
          { t: 207.9, text: "a cough can linger up to 2 months" },
        ]}
      />
    </Stage>
  );
};

/* 6. Winter 213.4 – 250.7 */
export const SWinter: React.FC = () => {
  const t = useT();
  const a = 1 - ramp(t, 223.0, 223.4);
  return (
    <Stage a={215.6} b={250.5}>
      <Layer o={a}>
        <div style={abs(160, 20)}>
          <House w={760} t={t} snow={ramp(t, 215.8, 216.6)} />
        </div>
        <Facts items={[{ t: 217.5, text: "more time indoors, close together, same air and surfaces", bg: C.forest }]} />
      </Layer>
      <Layer o={1 - a}>
        <div style={abs(120, 40, { display: "flex", gap: 160, alignItems: "flex-end" })}>
          <div style={{ textAlign: "center", ...pop(t, 225.2) }}>
            <Thermo h={460} level={0.85} color={C.red} label="" />
            <Big size={70}>37 °C</Big>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.matcha }}>core body</div>
          </div>
          <div style={{ textAlign: "center", ...pop(t, 229.4) }}>
            <Thermo h={460} level={0.55} color="#4F8FC8" label="" />
            <Big size={70}>33 °C</Big>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.matcha }}>inside your nose</div>
          </div>
        </div>
        <Facts
          items={[
            { t: 233.5, text: "Yale, 2015: mouse airway cells at both temperatures", bg: C.matcha },
            { t: 238.7, text: "cooler → weaker immune response to rhinovirus", bg: C.red },
            { t: 243.4, text: "cold air may give the virus a small head start" },
            { t: 247.1, text: "but you can catch a cold any time of year", bg: C.forest },
          ]}
        />
      </Layer>
    </Stage>
  );
};

/* 7. What helps 250.7 – 297.3 */
export const SHelps: React.FC = () => {
  const t = useT();
  const a = 1 - ramp(t, 277.4, 277.8);
  return (
    <Stage a={252.0} b={297.1}>
      <Layer o={a}>
        <div style={abs(60, 20, pop(t, 252.2))}>
          <PillCross size={300} cross={ramp(t, 252.4, 253.2)} />
        </div>
        <div style={abs(380, 90, pop(t, 252.6))}>
          <Big size={64}>antibiotics</Big>
          <Big size={64} color={C.red}>
            don't work
          </Big>
        </div>
        <div style={abs(60, 360, { display: "flex", flexDirection: "column", gap: 24 })}>
          <CheckRow text="rest" ok k={ramp(t, 263.5, 263.9)} />
          <CheckRow text="plenty of fluids" ok k={ramp(t, 264.6, 265.0)} />
          <CheckRow text="stay home the first few days" ok k={ramp(t, 266.0, 266.4)} />
        </div>
        <Facts
          items={[
            { t: 254.4, text: "they fight bacteria, colds are viruses", bg: C.forest },
            { t: 258.0, text: "no cure: support your body while it works" },
            { t: 269.5, text: "OTC meds ease symptoms: many aren't safe for young kids, check the label", bg: C.red },
          ]}
        />
      </Layer>
      <Layer o={1 - a}>
        <div style={abs(40, 20, { display: "flex", gap: 30 })}>
          {[
            ["VIT C", "#F2A94E", 277.8],
            ["ECHINACEA", "#B05677", 278.6],
            ["ZINC", "#8FA0B0", 279.6],
          ].map(([l, c, t0]) => (
            <div key={l as string} style={{ position: "relative", ...pop(t, t0 as number) }}>
              <Bottle size={200} label={l as string} color={c as string} />
              <svg width={200} height={260} viewBox="0 0 100 130" style={{ position: "absolute", left: 0, top: 0 }}>
                <path d="M10 20 L90 110" stroke={C.red} strokeWidth={7} strokeLinecap="round" opacity={ramp(t, 280.7, 281.2)} />
              </svg>
            </div>
          ))}
        </div>
        <div style={abs(40, 380, { display: "flex", flexDirection: "column", gap: 24 })}>
          <CheckRow text="wash your hands" ok k={ramp(t, 291.3, 291.7)} />
          <CheckRow text="don't touch your face" ok k={ramp(t, 292.6, 293.0)} />
          <CheckRow text="clean shared surfaces" ok k={ramp(t, 293.8, 294.2)} />
        </div>
        <Facts
          items={[
            { t: 280.7, text: "none shown to PREVENT colds", bg: C.red },
            { t: 283.0, text: "zinc may shorten a cold a little" },
            { t: 285.5, text: "zinc nasal sprays: linked to lasting loss of smell", bg: C.forest },
            { t: 289.0, text: "best protection is still the boring one", bg: C.matcha },
          ]}
        />
      </Layer>
    </Stage>
  );
};

/* 8. Doctor + outro 297.3 – end */
export const SDoctor: React.FC = () => {
  const t = useT();
  const a = 1 - ramp(t, 324.9, 325.3);
  const out = ramp(t, 336.6, 337.0);
  return (
    <Stage a={299.6} b={360}>
      <Layer o={a}>
        <div style={abs(40, 0)}>
          <Big size={60}>See a doctor if you have:</Big>
        </div>
        <div style={abs(40, 110, { display: "flex", flexDirection: "column", gap: 22 })}>
          <CheckRow text="high fever" ok={false} k={ramp(t, 300.5, 300.9)} />
          <CheckRow text="chest pain or ear pain" ok={false} k={ramp(t, 301.4, 301.8)} />
          <CheckRow text="trouble breathing" ok={false} k={ramp(t, 302.6, 303.0)} />
          <CheckRow text="symptoms > 10 days or getting worse" ok={false} k={ramp(t, 304.6, 305.0)} />
          <CheckRow text="any fever in a baby ≤ 2 months old" ok={false} k={ramp(t, 310.6, 311.0)} />
        </div>
        <Facts items={[{ t: 315.2, text: "possible complications: sinus or ear infections, bronchitis, pneumonia", bg: C.red }]} />
      </Layer>
      <Layer o={(1 - a) * (1 - out)}>
        <div style={abs(-40, 60)}>
          <HeadProfile w={1000} t={t} p={ramp(t, 329.6, 331.5)} />
        </div>
        <div style={abs(1000, 120, { width: 760 })}>
          <Big size={72}>
            the sniffles are just <Mk p={ramp(t, 334.2, 335.0)}>the sound of it working</Mk>
          </Big>
        </div>
      </Layer>
      <Layer o={out}>
        <div style={{ position: "absolute", left: 300, top: 40, width: 1200, height: 660, borderRadius: 44, background: C.forest, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26 }}>
          <div style={{ width: 170, height: 170, borderRadius: 85, background: C.matcha, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + 0.04 * Math.sin(t * 4)})` }}>
            <LogoMark size={130} />
          </div>
          <Big size={84} color={C.paper}>
            Book Plume
          </Big>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.banana }}>the human body, explained</div>
          <div style={{ display: "flex", gap: 24, marginTop: 10 }}>
            <div style={{ background: C.red, color: C.paper, borderRadius: 50, padding: "16px 46px", fontFamily: FONT, fontWeight: 800, fontSize: 42, transform: `scale(${1 + 0.04 * Math.max(0, Math.sin((t - 337) * 5))})` }}>SUBSCRIBE</div>
            <div style={{ background: C.banana, color: C.forest, borderRadius: 50, padding: "16px 46px", fontFamily: FONT, fontWeight: 800, fontSize: 42, opacity: ramp(t, 342.1, 342.4) }}>COMMENT: what's next?</div>
          </div>
        </div>
      </Layer>
    </Stage>
  );
};
