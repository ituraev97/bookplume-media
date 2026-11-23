# Thumbnail style — learned from YouTube Studio's own AI thumbnails (owner examples 2026-11-23)

Pipeline: the AI (FLUX.2 klein on the office PC, free) paints ONLY the picture ("plate", no text).
thumbkit.py lays out text, labels, stamps, highlights and real documents on top. Never let the AI draw text
or documents: it produces gibberish ("FEDERAL COURT OF ELHENTS") that looks like a forged record.

## Template "doc" — documentary split (REEL 41, NOT MEANT TO KNOW, LAST CONTACT, COLD WARRANT history/cases)
- Left ~45 %: near-black panel (#0B0B0B), 2–4 lines of huge condensed caps (Anton / Bebas), left-aligned,
  line 1 cream #EEE7D7, last line(s) accent: gold #D4A64A (history) or red #D62828 (mystery/crime).
  Short sentences with full stops read like a verdict: "4 CARRIERS. / SUNK IN 5 MIN."
- Small solid label under the text: cream box with black text ("UNSOLVED", "DECLASSIFIED") or red box with
  cream text ("JUNE 1942").
- Right ~55 %: cinematic plate — one clear subject (burning carrier, B-25 on a deck, CRT TV with a face, a
  redacted folder held by a gloved hand), dramatic side light, film grain, black-and-white or muted colour for
  history; the plate fades into the black panel with a soft horizontal gradient.
- Channel logo small, top-right. Bottom-right empty.

## Template "evidence" — object + document split (SWORN, COLD WARRANT, RELEASED IN FULL, KEPT ALIVE)
- Left half: the key object staged on a dark navy set under one spotlight (cash in a gift bag, a bag on a
  porch at night, a pill bottle, a boat) — painted by the AI.
- Right half: a REAL document crop (indictment, docket, report page) on white, vignette around it,
  2–3 key phrases highlighted yellow, a big red rubber stamp rotated −8° with the punchline ("$120,000 CASH",
  "4 YEARS", "48 MONTHS"). Thin white divider between halves.
- Top-left: red slanted tag with white italic caps ("SENTENCED", "GUILTY", "CHARGED").
- Bottom centre, across both halves: 2 lines of huge Anton with thick black stroke, line 1 white, line 2
  yellow #FFE600 or red #FF2A2A ("BRIBED THE JURY / CAUGHT ON CAMERA").
- Logo coin top-right (and nothing bottom-right).

## Template "versus" — two faces (HOTFIX drama)
- Two real people from real frames, each re-lit by the AI (edit mode, identity kept): left warm red rim
  light, right cold teal light, cinematic depth of field, tech/stream room behind; centred 2-line white Anton
  ("IT GOT PERSONAL"). Expression must be one the person really made in the source frame — the AI may
  re-light, sharpen and extend the background, not change the face or the expression.

## Template "ntsb" — full-bleed reconstruction + telemetry (aviation / accident channels: LAST CONTACT, KEPT ALIVE)
- `"layout":"full"`: one AI plate over the whole frame — clean 3D-render look (white untextured or real-livery aircraft,
  grey sim lighting) or a dramatic real-photo-style scene (storm clouds, runway at night, sea wall), subject large.
- Overlays: red slanted `tag` top-left ("NTSB REPORT", "NTSB DATA", "NTSB INVESTIGATION"); dark `hud` panel top-right in
  mono font with 1–3 real numbers from the report (ALT 35,000 FT / SPEED 113 KT / BRAKING: EMERGENCY — green = normal
  value, red = the problem); red `circle` on the failed part with a mono callout `label` ("SQUAT SWITCH DAMAGE");
  glowing red/green `path` lines for flight path or taxi routes (with `arrow`); mono `label` boxes over each aircraft
  ("CLEARED" green, "DID NOT STOP" red).
- Split variant: left plate, right solid red panel (`"right":{"color":"#B0101A"}`) with `bignum` "103 KTS" + white sub
  label "CRITICAL SPEED". "737 vs 767" split for two-aircraft collisions.
- Bottom: 2 lines, white + yellow #FFE600 (or red for the "why" line): "LAST 4 MINUTES / WHAT HAPPENED?",
  "REVERSERS STOWED / UNCOMMANDED THRUST". A question or the technical term the report blames.

## Template "fraud" — SWORN variants of "evidence"
- `"layout":"split"`, left = dark navy panel (`{"color":"#0E1A33"}`) with `bignum` ("$600M", "2,000", "24 BAGS $100M")
  + white pill sub-label in red ("FOREX FUND", "INVESTORS", "CONFESSED"), or a real portrait of the defendant, or an
  AI plate of the key object (cash bag, armored truck at a gas station, check stack, a handwritten note card);
  corner `ribbon` ("ARRESTED", "JUST IN", "FEDERAL PLEA") or red `tag` ("SENTENCED", "CHARGED", "CONVICTED").
- Right = the REAL document (complaint, plea agreement, DOJ press release) with spotlight vignette, yellow highlights,
  and a `stamp` — style "outline" (grungy red ink, rotated 15–25°: "CHARGED", "GUILTY", "GUILTY PLEA",
  "SECURITIES FRAUD") or "solid" (white box: "20 YEARS", "37 MONTHS").
- Optional `band` (dark bar) behind the bottom 2 lines: white + red/yellow ("BACKWARD HAT / FACING 20 YEARS").
- The YouTube AI examples show invented court text ("BOARD OF DENHEUS", "OFFICIALLY M. FEDERAL COURT"): we NEVER do that.

## Template "mugshot" — face + seized evidence (COLD WARRANT, fugitives/raids)
- `"layout":"split","blend":true,"split":0.42`: left = the person's REAL official photo (FBI/DOJ/agency release),
  re-lit by the AI in edit mode (police red/blue light bokeh behind, sharp, contrasty — same face, same expression);
  right = AI plate of the seized items (rifle on a tactical vest, cash, drugs on a table) dark and gritty; the halves
  melt into each other (no divider).
- Text right side, left-aligned, 2 huge lines white + yellow ("14-YEAR / MANHUNT"), `text_area` ≈ [560, 190, 680, 380],
  `"align":"left"`; red box top-right (`pill` with radius 0, white text: "SEIZED", "CAPTURED", "EXTRADITED").

## Template "solo" — one face/subject + words (all channels)
- Subject right, words left, colour wash, outline/glow (thumbkit classic) — use when the plate is a real frame.

## Rules for every template
- ≤ 4 words in the big text, all true and sourced; numbers beat adjectives.
- Real people: start from a real frame/photo (edit mode). Never invent a real person's face, injury,
  handcuffs, prison clothes or an action they did not do. Objects, places, reconstructions of events: the AI may
  paint them freely, but no fake logos/documents presented as evidence (brands visible on the real object are fine).
- Check at 320 px wide: words readable, subject clear.
