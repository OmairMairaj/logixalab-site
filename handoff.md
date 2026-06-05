# LogixaLab Website — Session Handoff / Context File

> Working context for continuing the homepage scroll-animation work in Cursor.
> Generated at the end of a Claude Code session. Treat code line numbers as
> approximate (files were edited repeatedly).

---

## 0. TL;DR — where we are right now

We are rebuilding the **LogixaLab marketing homepage** section-by-section to match a
Figma design, with **GSAP + ScrollTrigger** cinematic transitions between sections
(driven by Lenis smooth scroll). The most recent work has been **perfecting the
scroll "seams" between sections** so each one dissolves/reveals cleanly into the next
(no slide-up, no dead black holds), plus adding tasteful motion (a tools marquee, a
parallax entrance).

**The last completed change**: a **Capabilities-entrance parallax** — as the
Capabilities section scrolls into its pin, its decorative layers (binary pattern +
floating preview card) drift at a slower depth rate than the foreground heading/rows.
It compiles (HTTP 200) and is awaiting the user's visual confirmation.

---

## 1. The Vision / Objective

- A modern, techy, "AI-ish" agency homepage. Dark canvas, lime/chartreuse accent
  (`#ccff00` family), Michroma headings, Poppins body.
- Each section transition should feel **cinematic and deliberate**: the leaving
  section dissolves to black (or dissolves to reveal the next), and the next section
  reveals **in place** — never visibly "sliding up" into the viewport, never leaving a
  dead black/gray hold.
- Full responsiveness (desktop pinned/cinematic; mobile simpler one-shot reveals;
  reduced-motion static fallbacks).
- Best practices: alignment, spacing, color tokens, no layout shift, clean console.

### Homepage section order (`app/page.js`)
`HeroSection → IntroSection → CoreCapabilitiesSection → ToolsSection → ContactSection → Footer`
(wrapped in `<main className="overflow-x-clip">`)

---

## 2. Environment & Hard Rules

- **Framework**: Next.js (App Router) + **Turbopack**. ⚠️ `AGENTS.md`/`CLAUDE.md`
  warn: *"This is NOT the Next.js you know"* — APIs/conventions may differ from
  training data. **Read `node_modules/next/dist/docs/` before writing Next-specific
  code.** Heed deprecation notices.
- **OS**: Windows 11, **PowerShell** shell. Use PowerShell syntax (`$null`,
  `$env:VAR`, backtick line-continuation). PowerShell 5.1 quirk: use `"${m}: text"`
  not `"$m: text"` (colon after a bare `$var` breaks parsing).
- **Styling**: **Tailwind CSS v4** arbitrary syntax — `bg-(--section-canvas)`,
  `left-(--gutter)`, `text-[clamp(...)]`, `md:h-[400vh]`, `z-[12]`,
  `bg-linear-to-b` (note: `linear-to`, not `gradient-to`).
- **Animation**: GSAP 3.x + ScrollTrigger. Patterns we standardize on:
  - `gsap.matchMedia()` with three branches:
    `"(min-width: 768px) and (prefers-reduced-motion: no-preference)"` (desktop
    cinematic), `"(max-width: 767px)"` (mobile), `"(prefers-reduced-motion: reduce)"`
    (static).
  - Scrubbed timelines: `scrollTrigger: { trigger, start, end, scrub, invalidateOnRefresh: true }`.
  - `fromTo` for deterministic scrubbed reveals; `autoAlpha` (opacity+visibility);
    `force3D: true`; function-based values (`x: () => window.innerWidth * 1.2`) with
    `invalidateOnRefresh`.
  - Cleanup: `return () => mm.revert();` (matchMedia reverts child ScrollTriggers);
    cancel any `requestAnimationFrame` loops; `.kill()` standalone tweens/triggers.
- **Smooth scroll**: Lenis via `ScrollTrigger.scrollerProxy(window)` in
  `app/components/SmoothScroll.js` (runs in `useInsertionEffect`, `lerp: 0.09`,
  `autoRaf: false`, `gsap.ticker` drives `lenis.raf`, `lagSmoothing(0)`). Lenis is
  **disabled on `/contact`** (native scroll there). Prefer **CSS `position: sticky`**
  for pinning over GSAP `pin:` to avoid Lenis-proxy conflicts.
- **Git**: do NOT commit unless explicitly asked. No emojis in files unless requested.
  No proactive README/.md creation (this handoff was explicitly requested).
- **Verification limitation**: The Preview MCP / `preview_*` tools **cannot attach to
  the user's own `localhost:3000` dev server**. We verify compile + render via
  PowerShell `Invoke-WebRequest http://localhost:3000` and regex content markers; the
  **user verifies motion visually** in their browser.

### Design tokens (in `app/globals.css`)
```
--hero-canvas: #121212
--section-canvas: #0c0c0c
--hero-accent: #ccff00
--gutter: clamp(1rem, 5vw, 5rem)
--content-max: 1600px
--header-h: clamp(4rem, 5vw, 5rem)
--header-offset: calc(0.5rem + var(--header-h))
--viewport-below-header: calc(100dvh - var(--header-offset))
```
Fonts: `--font-michroma` (headings, `font-heading`), `--font-poppins` (body,
`font-sans`). Also defined: `cap-float` keyframes, `.header-cta`,
`.header-contact-btn` component styles.

Shared lime heading gradient (defined locally in both Capabilities and Tools):
```js
const HEADING_GRADIENT = "linear-gradient(105deg, #7DFF00 0%, #B2FF00 49%, #C8FF00 100%)";
// applied via: backgroundImage + WebkitBackgroundClip:"text" + backgroundClip:"text" + color:"transparent"
```
⚠️ `background-clip: text` only paints within the element box — text that overflows
the box renders transparent (caused a "Mastered" clip bug; fix = let the heading size
to content with `w-max` + `whitespace-nowrap`, not a fixed width).

---

## 3. The "Section Seam" Architecture (the core mental model)

Consecutive pinned sections hand off using a **z-layer + negative-margin reveal**
pattern (proven by the original Hero→Intro seam):

- The **leaving** section has a **higher z-index** and **fades its whole panel out**
  on exit (revealing what's behind it).
- The **entering** section sits **one z-layer below** with a **negative top margin
  (`-mt-[Nvh]`)** so it overlaps and is **pinned in its final position BEHIND** the
  leaving section *before* that section finishes leaving.
- Result: the leaving section dissolves to reveal the next one **already in place** —
  no slide-up, no dead hold.

**Critical geometry rule we derived (avoid the "slide-up"):**
A `sticky` panel only locks into its final centered position when its section's top
reaches the viewport top. If the overlap (`-mt`) is too shallow, that moment
coincides with the previous section *ending*, so the new section is still *rising*
during the previous section's fade → visible slide-up. **Fix = deepen the `-mt`
overlap** so the entering section pins *before* the leaving section starts its exit,
then **delay the entering section's reveal** until after the leaving section has fully
cleared. Keep the entering content seeded hidden (`autoAlpha: 0`) during the rise so
nothing is visible until it reveals in place.

Z-index map (desktop): Hero `z-20` → Intro `z-10` → Capabilities `z-20` → Tools `z-10`
→ Contact `z-10` (isolate). Each entering section is below its predecessor.

---

## 4. Per-section state (what each file does NOW)

### `app/sections/HeroSection.js`  (`z-20`, `md:h-[300vh]`, sticky inner hero panel)
- Hero with a **liquid-glass hover-reveal blob** (always-on metaball that tracks the
  cursor, refracts the backdrop via SVG `feTurbulence`/`feDisplacementMap`, reveals a
  robot image, masked by an animated SVG metaball). Driven by a `requestAnimationFrame`
  loop (`stepBlob`). Chromium-only refraction; Safari/FF get frosted fallback.
- **Exit (scrubbed, desktop)**: Phase 1 (0→0.33) heading flies left + copy flies
  right; Phase 2 (0.36→0.64) portrait + glass lens + robot reveal fade/blur out;
  Phase 3 (0.66→1.0) **whole hero panel fades to black** (`autoAlpha:0`) revealing
  Intro behind. (This is the "fade to black" the Intro reveal relies on.)
- Not structurally changed this session.

### `app/sections/IntroSection.js`  (`z-10`, `md:-mt-[200vh] md:h-[300vh]`)
**Last reworked this session.** Centered paragraph on `#0c0c0c` with a bottom lime
glow (`wide-blur.png`). Uses `gsap.matchMedia()` now (was a single `gsap.context`).
- **Desktop**: deep overlap pins Intro in its final spot ~hero progress 0.5 (before
  the hero's fade). Everything seeded hidden (`glow` + chars `autoAlpha:0`). **After
  the hero has fully faded to black**, two scrubbed triggers run:
  (1) **glow-up** — the lime glow powers up from the bottom (`autoAlpha 0→1`,
  `yPercent 30→0`, `scale 0.9→1`), then (2) **decode** — the existing per-letter
  blur-resolve. Trigger starts use scroller offsets `start: "top top-=100%"` (glow)
  and `"top top-=115%"` (decode) so they fire after the hero clears.
- **Mobile**: simple on-enter decode (`start "top top"`, `end "+=60%"`).
- **Reduced motion**: static, fully legible.
- ⚠️ The `start: "top top-=100%"` offsets are TUNING KNOBS — verify exact landing
  with `markers: true`; bigger negative % = waits longer in the black before revealing.

### `app/sections/CoreCapabilitiesSection.js`  (`z-20`, `bg-[#2F2F2F]`, `md:h-[400vh] pt-36`)
**Edited this session (exit retiming + fade-to-reveal + parallax).** Sticky pinned
panel; a scrubbed timeline cycles through 6 capabilities (`CYCLE_END = 0.6`, drives
`scrollIndex`), with hover override (`activeIndex = hoverIndex ?? scrollIndex`).
- **Exit** (`EXIT_AT = 0.78`, compact, late): rows fly out L/R, heading+button lift
  (`y:-90`), `[pattern, imageWrap]` fade (`autoAlpha`), then **the whole gray wrapper
  fades `autoAlpha:0`** (`EXIT_AT + 0.1`) to **reveal the Tools section pinned behind
  it** (gray dissolving to Tools' black = the seam).
- **Entrance parallax (the last change)** — a SEPARATE scrubbed trigger
  (`start: "top bottom"` → `end: "top top"`, `scrub: true`) drifts:
  - `patternRef` (binary.png, deep): `yPercent 22 → -12`
  - `cardParallaxRef` (floating card, mid): `yPercent 12 → -4`
  The foreground heading/rows scroll normally → the differential is the parallax.
  - **JSX change**: the floating preview card was wrapped — new **outer**
    `cardParallaxRef` div owns positioning + parallax transform; **inner**
    `imageWrapRef` keeps `aspect-[4/3] -translate-y-1/2 cap-float` (so the parallax
    `yPercent` never collides with the `cap-float`/translate transform). The exit
    timeline still fades `imageWrapRef` via `autoAlpha` (opacity only — no conflict).

### `app/sections/ToolsSection.js`  ("Tools We've Mastered" — created this session)
(`z-10`, `md:-mt-[200vh] md:h-[330vh]`) — sits between Capabilities and Contact.
- Layout: `#0c0c0c`, two `wide-blur.png` glows centered on the **exact top + bottom
  edges** of the panel (each wrapped so the edge-translate doesn't fight the GSAP
  scale/fade), left lime-gradient heading (`Tools / We've / Mastered`, `w-max
  whitespace-nowrap`) with a `// Tech Stack` eyebrow + lime dot, a vertical divider,
  and a single right-bleeding **marquee** of tool icons.
- **Marquee**: infinite `gsap.to(track, { xPercent:-50, repeat:-1, ease:"none" })`;
  the `TOOLS` array is rendered twice (and repeated to ≥12 chips, `MIN_CHIPS`) for a
  seamless loop. Marquee is **scroll-velocity reactive** (a `requestAnimationFrame`
  loop eases `marquee.timeScale()` toward a velocity target from
  `ScrollTrigger.getVelocity()`).
- **Spotlight colorize**: same rAF loop computes each chip's distance from the
  viewport/marquee center → drives `grayscale`/`brightness`/lime `drop-shadow`/`scale`
  (full color + glow at center, grayscale at edges). Default chip filter
  `grayscale(1) brightness(0.85)`.
- **Reveal choreography (deep overlap, no slide)**: Tools pins in final position
  while hidden behind Capabilities. **`REVEAL = 0.45`** — the section stays fully
  hidden through Capabilities' fly-out + gray dissolve, and **only after Capabilities
  has completely cleared** do the glows/heading/divider/chips stream in + the scan
  beam sweep (this satisfies the user's explicit requirement: "the tools section and
  its scan should only reveal and start after all the content of the capabilities
  section has properly flied out"). Hold (marquee + colorize), then exit (`0.86`+):
  heading/divider lift, marquee row blurs + slides off, glows fade.
- **`TOOLS` array** = the single edit point for icons. Currently the 7 PNGs the user
  added to `public/images/tools/`: `nextjs, chatgpt, claude, gemini, python, cursor,
  seedance`. (Mapped names: Next.js, ChatGPT, Claude, Gemini, Python, Cursor,
  Seedance.) ⚠️ **Claude cannot generate logo PNGs** — the user adds more icons + one
  array line each; the marquee auto-repeats to stay full.

### `app/sections/ContactSection.js`  (`#contact`, `z-10`, isolate)
Narrow glass contact form card over a grayscale bg image; not changed this session.
Full layout lives at `/contact` (`ContactPageClient`, native scroll).

---

## 5. Bugs we fixed this session (so they don't regress)

1. **Tools "still circular" blob** (earlier) → geometric distance-constraint metaball.
2. **Long gray hold + sudden snap to black** at Capabilities→Tools → moved the
   gray→black dissolve into Capabilities' **exit** (fade whole gray wrapper to reveal
   Tools' black behind), removed the abrupt morph inside Tools.
3. **Black header strip** above the Tools glow → made the Tools panel full-height
   (`md:sticky md:top-0 md:h-screen`, content `items-center`) so the top glow bleeds
   up **behind the floating header**.
4. **"Mastered" clipping** → `background-clip:text` only paints within the box; fixed
   with `w-max` + `whitespace-nowrap` (size-to-content) instead of a fixed width.
5. **Tools sliding up during Capabilities exit** → deepened overlap
   (`-mt-[100vh]`→`-mt-[200vh]`, `h-[230vh]`→`h-[330vh]`) so Tools pins in place
   *before* Capabilities exits; delayed the reveal (`REVEAL = 0.45`) to after
   Capabilities fully clears.
6. **Hero→Intro slide-up** → same deep-overlap + delayed-reveal fix applied to Intro,
   plus the chosen **glow-up → decode** reveal flavor.

---

## 6. Immediate Next Steps

1. **Visually verify the parallax** (last change) in the browser at
   `http://localhost:3000`: scroll Intro → Capabilities. As the gray section rises
   into its pin, the binary pattern + floating card should **lag behind** the
   heading/rows (layered depth), smooth, no jitter at the pin boundary. Confirm the
   capability cycle, hover, and exit-to-reveal-Tools all still work, and the card
   still `cap-float`s centered on `top-[65%]`.
   - **Tuning knobs**: parallax strength = the `yPercent` from/to values
     (`pattern 22 → -12`, `card 12 → -4`; wider spread = stronger). Window =
     `start "top bottom"` / `end "top top"`.
2. **Verify the Hero→Intro reveal** timing (previous change): hero fades to black →
   lime glow powers up from bottom → copy decodes, all **in place** (no slide). If the
   reveal lands too early/late relative to the black beat, adjust the
   `start: "top top-=100%"` / `"-=115%"` offsets in `IntroSection.js` (bigger negative
   % = waits longer). Use `markers: true` to dial it in.
3. **Add remaining tool icons**: drop PNGs (~500×500, transparent) into
   `public/images/tools/` and add a line each to the `TOOLS` array in
   `ToolsSection.js`.
4. **Continue** building remaining Figma sections of the homepage.

### Currently debugging / open
- **No active errors.** Everything compiles (HTTP 200). The only "open" items are the
  **visual confirmations** above (parallax feel + the two seam timings), which the
  user must check in-browser since the Preview MCP can't attach to their dev server.
- The cross-section seam choreography is **coupled to section heights** (Hero 300vh,
  Intro 300vh/-mt200, Capabilities 400vh, Tools 330vh/-mt200). If you change any
  section's height or `-mt`, re-check the seam progress math (mapping derived in
  §3) and the `REVEAL` / start-offset / `EXIT_AT` knobs.

---

## 7. How to verify a change (since Preview MCP can't attach to :3000)

```powershell
# Compile + render check (dev server already running on :3000):
try {
  $r = Invoke-WebRequest -UseBasicParsing http://localhost:3000 -TimeoutSec 30
  "STATUS: $($r.StatusCode)"
  foreach ($m in @("capabilities-heading","tools-heading","Tech Stack")) {
    if ($r.Content -match [regex]::Escape($m)) { "FOUND: ${m}" } else { "MISSING: ${m}" }
  }
} catch { "ERR: $($_.Exception.Message)" }
```
Then **the user confirms motion visually** in their browser. For GSAP timing,
temporarily set `markers: true` on a ScrollTrigger to see start/end positions.

---

## 8. Key files index

| File | Role |
|------|------|
| `app/page.js` | Section order |
| `app/globals.css` | Tokens, fonts, `cap-float`, button styles |
| `app/components/SmoothScroll.js` | Lenis + ScrollTrigger scrollerProxy |
| `app/sections/HeroSection.js` | Hero + liquid-glass blob + fade-to-black exit |
| `app/sections/IntroSection.js` | Decode copy, glow-up→decode reveal (deep overlap) |
| `app/sections/CoreCapabilitiesSection.js` | Pinned capability cycle, exit-to-reveal-Tools, **entrance parallax** |
| `app/sections/ToolsSection.js` | "Tools We've Mastered" marquee + velocity + colorize + delayed reveal |
| `app/sections/ContactSection.js` | In-page contact card |
| `public/images/tools/` | Tool icon PNGs (user-supplied) |
| `AGENTS.md` / `CLAUDE.md` | "Not the Next.js you know" — read node_modules docs |
