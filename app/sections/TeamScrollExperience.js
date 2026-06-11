"use client";

import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

import Footer from "@/app/components/Footer";
import ScrollCue from "@/app/components/ScrollCue";
import { TEAM, TEAM_PARA } from "@/app/team/teamData";

gsap.registerPlugin(ScrollTrigger);

/** One member card — voxel avatar in a rounded panel with a lime role pill,
 *  lime name + muted description beneath (matches the Figma). */
function TeamCard({ member, style, fillHeight = false }) {
  return (
    <article
      data-team-card
      className={`shrink-0 will-change-[opacity,transform]${
        fillHeight ? " flex flex-col" : ""
      }`}
      style={style}
    >
      <div
        className={`relative overflow-hidden rounded-lg border border-white/10 bg-linear-to-b from-white/[0.07] via-white/[0.02] to-black/50 shadow-[0_24px_70px_rgba(0,0,0,0.45)]${
          fillHeight ? " min-h-0 flex-1" : ""
        }`}
        style={fillHeight ? undefined : { aspectRatio: "0.62 / 1" }}
      >
        <Image
          src={member.image}
          alt={member.name}
          fill
          sizes="(max-width: 768px) 70vw, 280px"
          className="object-contain object-bottom"
        />
        <span className="absolute bottom-3 left-3 whitespace-nowrap rounded-full bg-(--hero-accent) px-3 py-1 text-[11px] font-semibold tracking-wide text-(--hero-canvas) shadow-[0_8px_20px_rgba(0,0,0,0.35)]">
          {member.role}
        </span>
      </div>

      <h3 className="font-heading mt-4 text-[clamp(1rem,1.4vw,1.25rem)] font-normal leading-tight text-(--hero-accent)">
        {member.name}
      </h3>
      {/* Desktop rail only: reserve a fixed 3-line height (and clamp to it) so
          every card's text block is the same size. There the image area is
          flex-1, so equal text blocks → equal image heights → the role pills,
          names and descriptions all align across cards (top AND bottom), instead
          of the flex-1 image drifting per description length. The mobile static
          fallback uses a fixed-aspect image (already aligned) and scrolls
          horizontally, so it keeps full, untruncated copy — no clamp/min-h. */}
      <p
        className={`mt-2 max-w-[90%] text-[12.5px] leading-relaxed text-white/55${
          fillHeight ? " line-clamp-3 min-h-[4.875em]" : ""
        }`}
      >
        {member.description}
      </p>
    </article>
  );
}

/* DOCK_SCALE = docked size ÷ big size. The headline is laid out at its BIG size
   and scaled DOWN to dock (downscaling a rasterised layer stays crisp). */
const DOCK_SCALE = 1 / 1.9;

/* Avatar source PNGs are 308×508 (portrait, w/h ≈ 0.606). The card width is
   derived from the image area's height × this ratio (see setRailMetrics) so the
   `object-contain` portrait fills the card edge-to-edge — no empty band above it
   (object-bottom) and no letterboxing at the sides. */
const AVATAR_RATIO = 308 / 508;

/* Desktop cards are sized by HEIGHT, not width, so the avatar image fills the
   remaining height via flex-1 (see TeamCard `fillHeight`) and longer descriptions
   shrink the image rather than pushing a card taller than its band. Both the
   height AND the width are driven by JS-measured vars (`--team-card-h` /
   `--team-card-w`), plus the rail's top (`--team-rail-top`) — the effect measures
   the ACTUAL docked-headline bottom (font-scaling and the "Behind Logixa Lab"
   line-wrap at narrow widths both change that height, so a fixed CSS calc can't
   get it right) and the actual image-area height (to fill it with the avatar at
   AVATAR_RATIO). The fallbacks here are only the pre-hydration first paint, while
   the rail is still hidden. Paired with `items-end` on the rail so cards anchor to
   the bottom of the band. */
const CARD_STYLE = {
  width: "var(--team-card-w, clamp(170px, 18vw, 360px))",
  height: "var(--team-card-h, calc(84vh - 252px))",
};

/**
 * Team page scroll experience (desktop, scrub-driven):
 *   Phase A — big "The Minds / Behind Logixa Lab" holds, centered-left & large,
 *             with the intro paragraph (bottom-left) + scroll cue (bottom-right).
 *   Phase B — headline shrinks + docks to the top-left; eyebrow, paragraph and
 *             scroll cue fade out as it goes.
 *   Phase C — the team card rail reveals in the lower band.
 *   Phase D — the rail scrubs horizontally (left → right reading) to walk the team.
 *   Phase E — the footer rises over the pinned frame to close the page.
 *
 * Mobile + reduced-motion fall back to a static, natively-scrollable layout.
 */
export default function TeamScrollExperience() {
  const scrollRootRef = useRef(null);
  const heroBlockRef = useRef(null);
  const paraRef = useRef(null);
  const scrollCueRef = useRef(null);
  const railContainerRef = useRef(null);
  const railRef = useRef(null);
  const footerRef = useRef(null);

  useLayoutEffect(() => {
    const scrollRoot = scrollRootRef.current;
    const heroBlock = heroBlockRef.current;
    const para = paraRef.current;
    const scrollCue = scrollCueRef.current;
    const railContainer = railContainerRef.current;
    const rail = railRef.current;
    const footer = footerRef.current;

    if (!scrollRoot || !heroBlock || !para || !railContainer || !rail) return;

    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        /* Hero starts off-screen to the right so the whole strip streams in
           horizontally (no vertical fade) in one continuous leftward scrub. */
        const railStartX = () => window.innerWidth * 0.62;
        const railEndX = () =>
          -Math.max(rail.scrollWidth - window.innerWidth, 0);

        /* Big hero: the headline is laid out at its BIG size in CSS and scaled
           DOWN to dock. Downscaling a rasterized layer stays crisp (you discard
           pixels), so the big hero — the first thing seen — is pixel-sharp;
           upscaling (the old approach) blurred it. (DOCK_SCALE is module-level.) */
        const eyebrow = heroBlock.querySelector("[data-team-eyebrow]");
        const headingLines = heroBlock.querySelectorAll("[data-team-line]");
        const heroFurniture = [eyebrow, ...headingLines, para, scrollCue];

        /* Opening offset = +5vh on top of the heroBlock's CSS `top`
           (header-offset + 10vh) → the big headline's eyebrow opens at
           header-offset + 15vh, i.e. the SAME shared anchor (--hero-anchor-top:
           header-offset + 15svh) as the /services /work /contact heroes, so the
           team's first frame lines up with them. It then docks UP to y:0 (the CSS
           `top`, near the header) as it shrinks. Keep in sync with
           --hero-anchor-top if that token is retuned. */
        gsap.set(heroBlock, {
          transformOrigin: "left top",
          scale: 1,
          y: () => window.innerHeight * 0.05,
          force3D: true,
        });
        gsap.set(railContainer, { autoAlpha: 0, pointerEvents: "none" });
        gsap.set(rail, { x: railStartX, force3D: true });

        /* Opening-frame entrance — eyebrow + headline + intro paragraph + scroll
           cue blur-rise in, mirroring the /work, /services, /contact heroes so
           the team's first frame reads as rich as theirs. Runs once on mount and
           is independent of the scrub (which only docks heroBlock + moves the
           rail), so the protected dock + card-slide animation is untouched. */
        gsap.set(heroFurniture, { autoAlpha: 0, y: 28, filter: "blur(8px)" });
        gsap.to(heroFurniture, {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          ease: "power3.out",
          duration: 0.8,
          stagger: 0.12,
          delay: 0.1,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scrollRoot,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        });

        /* Phase A — hold the big headline (0 → 0.12). */

        /* Phase B — shrink + dock the headline to the top-left (GPU scale). */
        const dockStart = 0.12;
        const dockDur = 0.28;
        tl.to(
          heroBlock,
          { scale: DOCK_SCALE, y: 0, ease: "power3.inOut", duration: dockDur },
          dockStart,
        );

        /* Eyebrow + intro paragraph + scroll cue belong to the big opening frame
           only — they all clear as the headline begins to dock (Phase B), leaving
           just the docked small headline while the team rail streams in. (Mirrors
           the /services + /work heroes, where the body text + cue are part of the
           hero and scroll away with it.) */
        tl.to(
          eyebrow,
          { autoAlpha: 0, ease: "power2.in", duration: dockDur * 0.45 },
          dockStart,
        );
        tl.to(
          para,
          { autoAlpha: 0, ease: "power2.in", duration: dockDur * 0.45 },
          dockStart,
        );
        tl.to(
          scrollCue,
          { autoAlpha: 0, ease: "none", duration: 0.08 },
          dockStart,
        );

        /* Phase C — the rail becomes visible just before it starts streaming in. */
        const railStart = dockStart + dockDur * 0.7;
        tl.to(
          railContainer,
          {
            autoAlpha: 1,
            pointerEvents: "auto",
            ease: "none",
            duration: 0.08,
          },
          railStart,
        );

        /* Phase D — one continuous horizontal scrub: cards stream in from the
           right and walk leftward through the whole team (no vertical motion). */
        const moveStart = railStart + 0.04;
        const moveDur = 1.7;
        tl.fromTo(
          rail,
          { x: railStartX },
          { x: railEndX, ease: "none", duration: moveDur },
          moveStart,
        );

        /* Phase E — the footer rises over the pinned team frame (replaces the old
           outro fade). The team content stays visible; the footer slides up from
           below and covers it to close the page. */
        if (footer) {
          const footerStart = moveStart + moveDur + 0.18;
          gsap.set(footer, { yPercent: 100, autoAlpha: 1 });
          tl.fromTo(
            footer,
            { yPercent: 100 },
            { yPercent: 0, ease: "none", duration: 0.6 },
            footerStart,
          );
        }
      },
    );

    /* Measure the ACTUAL docked-headline bottom and drive the card rail from it.
       The big headline is laid out at full size on mount, so its height is
       measurable now; font-scaling AND the "Behind Logixa Lab" line-wrap at narrow
       widths both change that height, which no fixed CSS calc could track. The rail
       top is set a small (3vh) margin below the docked bottom, and each card fills
       from there down to ~6vh above the viewport bottom — so the headline↔cards gap
       stays a constant ~3vh at every width and height, with cards as large as the
       remaining space allows. The card WIDTH is then derived from the image area's
       height × AVATAR_RATIO so the portrait fills the card with no empty band above
       it (clamped so it stays readable on short screens / sane on tall ones).
       Re-runs on every ScrollTrigger refresh (load/resize). */
    const desktopMQ = window.matchMedia(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
    );
    const root = document.documentElement;
    const setRailMetrics = () => {
      const lines = heroBlock.querySelectorAll("[data-team-line]");
      const last = lines[lines.length - 1];
      if (!desktopMQ.matches || !last) {
        root.style.removeProperty("--team-rail-top");
        root.style.removeProperty("--team-card-h");
        root.style.removeProperty("--team-card-w");
        return;
      }
      const topPx = parseFloat(getComputedStyle(heroBlock).top) || 0;
      const dockedBottom =
        topPx + (last.offsetTop + last.offsetHeight) * DOCK_SCALE;
      const railTop = Math.round(dockedBottom + window.innerHeight * 0.03);
      const cardH = Math.max(
        120,
        Math.round(window.innerHeight * 0.94 - railTop),
      );
      root.style.setProperty("--team-rail-top", railTop + "px");
      root.style.setProperty("--team-card-h", cardH + "px");

      /* Width = image-area height × the avatar's native ratio, so the portrait
         fills the card edge-to-edge (no top gap, no side letterboxing). The image
         area = cardH − the name/description block below it; measure that block from
         a live card so font-clamp + wrap changes are accounted for (fall back to a
         ~90px estimate before any card is laid out). Clamp keeps cards readable on
         short viewports and from ballooning on very tall ones. */
      const sampleCard = rail.querySelector("[data-team-card]");
      const imgWrap = sampleCard && sampleCard.querySelector(":scope > div");
      const textBlock = imgWrap
        ? Math.max(0, sampleCard.offsetHeight - imgWrap.offsetHeight)
        : 90;
      const cardW = Math.round((cardH - textBlock) * AVATAR_RATIO);
      root.style.setProperty(
        "--team-card-w",
        Math.max(170, Math.min(cardW, 360)) + "px",
      );
    };

    const refresh = () => {
      setRailMetrics();
      ScrollTrigger.refresh();
    };
    requestAnimationFrame(refresh);
    window.addEventListener("load", refresh);
    window.addEventListener("resize", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", refresh);
      root.style.removeProperty("--team-rail-top");
      root.style.removeProperty("--team-card-h");
      mm.revert();
    };
  }, []);

  return (
    <section className="relative text-white">
      <h1 className="sr-only">The Minds Behind Logixa Lab — Our Team</h1>

      {/* ───────────────────── Desktop scrub experience ───────────────────── */}
      <div className="hidden motion-safe:md:block">
        {/* Headline — anchored top-left, laid out at its BIG size (sharp) then
            scaled DOWN to dock. Sizes = docked clamp × 1.9 (DOCK_SCALE inverse).
            Every entrance target below carries opacity-0 so the SSR first paint
            (before useLayoutEffect runs) doesn't flash the hero fully visible at
            y:0 before GSAP hides it, drops it 15vh, and plays the blur-rise in.
            GSAP's autoAlpha owns them after (0 → 1 in the entrance tween). */}
        <div
          ref={heroBlockRef}
          className="pointer-events-none fixed px-(--gutter) top-[calc(var(--header-offset)+10vh)] z-30 will-change-transform w-full"
        >
          <p
            data-team-eyebrow
            className="mb-5 flex items-center gap-2 font-sans text-[0.7rem] font-medium uppercase tracking-[0.34em] text-white/45 opacity-0 will-change-[opacity,transform,filter]"
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full bg-(--hero-accent)"
              aria-hidden
            />
            Our Team
          </p>
          <h2
            data-team-line
            className="font-heading text-[clamp(3.61rem,8.36vw,6.46rem)] font-normal leading-[0.98] tracking-[-0.03em] antialiased text-hero-gradient opacity-0 will-change-[opacity,transform,filter]"
          >
            The Minds
          </h2>
          <p
            data-team-line
            className="font-heading mt-1 text-[clamp(3.61rem,8.36vw,6.46rem)] font-normal leading-[1.02] tracking-[-0.02em] text-white/92 antialiased opacity-0 will-change-[opacity,transform,filter]"
          >
            Behind Logixa Lab
          </p>

          {/* Body + scroll-cue row — SAME flow logic as the /services hero (see
              ServicesHero.js): a row sitting a constant margin (mt-8 / md:mt-12)
              below the headline, md:items-end md:justify-between (body left, cue
              right, shared baseline). Keeping it in NORMAL FLOW means the gap to
              the headline is identical at every viewport. The old approach pinned
              the paragraph to the viewport bottom (`fixed bottom-[31vh]`) while
              the headline was pinned to the top, so on shorter screens the two
              drifted into each other. The row lives INSIDE heroBlock so it tracks
              the headline and fades out with it as it docks (Phase B). Refs kept:
              paraRef + a custom inline cue carrying scrollCueRef (the shared
              <ScrollCue/> can't take a ref). opacity-0 so the SSR first paint
              doesn't flash it before GSAP's autoAlpha owns it. */}
          <div className="mt-8 flex flex-col gap-8 md:mt-12 md:flex-row md:items-end md:justify-between md:gap-12">
            <p
              ref={paraRef}
              className="max-w-[52ch] text-left text-[clamp(0.9rem,1.1vw,1.05rem)] leading-relaxed text-white/70 opacity-0 will-change-[opacity,transform,filter]"
              dangerouslySetInnerHTML={{ __html: TEAM_PARA.replace("—", "&mdash;") }}
            />

            <p
              ref={scrollCueRef}
              className="flex items-center gap-2 self-start font-sans text-[0.7rem] font-medium uppercase tracking-[0.28em] text-white/40 opacity-0 will-change-[opacity,transform,filter] md:self-auto"
            >
              Scroll to explore
              <span
                className="inline-block h-4 w-px animate-pulse bg-(--hero-accent)/70"
                aria-hidden
              />
            </p>
          </div>
        </div>

        {/* Team rail — lower band, horizontal scrub. `top` is `--team-rail-top`
            (measured in the effect to sit just below the docked headline so the
            cards never overlap it; falls back to 30% pre-hydration). Pre-hidden
            with opacity-0 so the first server-rendered paint (before useLayoutEffect
            runs) doesn't flash the full row of cards at x:0; GSAP then owns it via
            autoAlpha (set to 0 here, revealed in Phase C as the rail streams in). */}
        <div
          ref={railContainerRef}
          className="pointer-events-none fixed inset-x-0 bottom-[6vh] z-20 flex items-end opacity-0 will-change-[opacity,visibility]"
          style={{ top: "var(--team-rail-top, 30%)" }}
          aria-hidden
        >
          <div
            ref={railRef}
            className="flex items-start gap-6 will-change-transform lg:gap-6"
            style={{
              paddingLeft: "var(--gutter)",
              paddingRight: "max(14vw, 6rem)",
            }}
          >
            {TEAM.map((member) => (
              <TeamCard
                key={member.name}
                member={member}
                style={CARD_STYLE}
                fillHeight
              />
            ))}
          </div>
        </div>

        {/* Scroll spacer — drives the scrubbed timeline. */}
        <div ref={scrollRootRef} className="min-h-[540vh] w-full" aria-hidden />

        {/* Footer — rises over the pinned team frame at the end of the scrub
            (Phase E). Starts off-screen below (gsap.set in the timeline). */}
        <div
          ref={footerRef}
          /* Pre-hidden with opacity so the first server-rendered paint doesn't
             flash the fixed footer at the viewport bottom before useLayoutEffect
             runs. GSAP then owns the transform (yPercent slide) and restores
             opacity via autoAlpha:1 — done with opacity, NOT a CSS transform,
             because GSAP folds any pre-existing transform into its own and the
             two would compose (doubling the translate / breaking the rise). */
          className="fixed inset-x-0 bottom-0 z-40 h-[70vh] opacity-0 will-change-transform"
        >
          <Footer />
        </div>
      </div>

      {/* ──────────── Static fallback (mobile + reduced-motion) ──────────── */}
      <div className="relative block overflow-hidden px-(--gutter) pb-24 pt-(--hero-anchor-top) motion-safe:md:hidden">
        <div className="relative z-10">
          <p className="mb-5 flex items-center gap-2 font-sans text-[0.7rem] font-medium uppercase tracking-[0.34em] text-white/45">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full bg-(--hero-accent)"
              aria-hidden
            />
            Our Team
          </p>
          {/* Same size/leading as the /services /work /contact hero h1 so the
              heading — and the body below it — line up vertically across pages. */}
          <h2 className="font-heading text-[clamp(2.5rem,8vw,6.5rem)] font-normal leading-[0.98] tracking-[-0.03em]">
            <span className="block text-hero-gradient">The Minds</span>
            <span className="block text-white/92">Behind Logixa Lab</span>
          </h2>
          <p
            className="mt-8 max-w-[52ch] text-[clamp(0.9rem,1.1vw,1.05rem)] leading-relaxed text-white/70"
            dangerouslySetInnerHTML={{
              __html: TEAM_PARA.replace("—", "&mdash;"),
            }}
          />

          {/* Native horizontal swipe rail. `scroll-px-(--gutter)` keeps the
              snap target inset by the gutter — without it, snap-mandatory scrolls
              the padding-left away and the first card lands flush to the edge. */}
          <div className="mt-10 -mx-(--gutter) flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-(--gutter) px-(--gutter) pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TEAM.map((member) => (
              <div key={member.name} className="snap-start">
                <TeamCard
                  member={member}
                  style={{ width: "clamp(220px, 72vw, 280px)" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer — normal flow on mobile + reduced-motion (the fixed sliding
          footer above only runs in the desktop scrub). */}
      <div className="block motion-safe:md:hidden">
        <Footer />
      </div>
    </section>
  );
}
