# LogixaLab Site — Claude Code Brief

@AGENTS.md

## What this repo is
- **Project**: LogixaLab marketing website (company website).
- **Stack**: Next.js App Router (Next **16.x**), React, Tailwind, GSAP + ScrollTrigger, Lenis.
- **Goal**: A polished, high-end landing page with scroll-driven “story” animation and a contact section.

## How to run locally
- **Install**: `npm install`
- **Dev**: `npm run dev` then open `http://localhost:3000`

Notes:
- We use Turbopack in dev. `next.config.mjs` pins `turbopack.root` to avoid “wrong workspace root” warnings when multiple lockfiles exist.

## Key files / where things live
- **Home page**: `app/page.js`
- **Landing animation (hero / scroll story)**: `app/sections/LandingScrollExperience.js`
- **Contact section (form)**: `app/sections/ContactSection.js`
- **Global layout**: `app/layout.js`
- **Smooth scrolling integration**: `app/components/SmoothScroll.js`
- **Global styles**: `app/globals.css`

## What we’re trying to achieve (high-level UX)
The home page has multiple scroll-driven “phases”:
- **Phase 1**: Big “Engineering” and “Intelligence” words animate off-screen.
- **Phase 2**: Lime paragraph (“We’re not a one-trick agency…”) reveals with blur→sharp per character.
- **Phase 3 (Impact beat)**:
  - “AI Solutions Built for / Real‑World Impact” should **enter from outside the viewport on the right** as a unit.
  - “Real‑World Impact” uses a **blur→sharp per character** reveal (ScrollTrigger-scrubbed).
  - A **center portrait/card** scales up during this beat.
  - The **moment the portrait finishes its final scale** should coincide with the headline finishing its move/shrink to the **top-left** (timing sync).
- **Phase 3f (Carousel)**: A horizontal rail of cards becomes visible and scrolls horizontally; center card is emphasized (larger / dashed border).

## Known pitfalls (important)
- **Hydration warnings**: Some browser extensions inject attributes into inputs (e.g. `fdprocessedid`) causing mismatches. We intentionally use `suppressHydrationWarning` on the contact form controls to avoid noisy warnings.
- **“Glitch” on refresh**: When SSR/first paint shows elements in default CSS positions before GSAP `useLayoutEffect` runs, you get a visible flash. Prefer making initial CSS match GSAP’s initial `set()` values, or keep elements hidden (`invisible`/`autoAlpha: 0`) until the first GSAP tick applies correct transforms.
- **Transform conflicts**: Don’t mix Tailwind translate utilities with GSAP-driven transforms on the same element unless you’re very deliberate—double transforms cause jumps.

## Working style / expectations for changes
- Prefer **small, targeted edits** and keep the scroll story visually stable (avoid introducing new flashes on refresh).
- When changing the animation, ensure:
  - **First paint** doesn’t show stacked layers.
  - **Headline + portrait** timing matches the design intent.
  - **Carousel** layout matches the intended center-focus composition.

