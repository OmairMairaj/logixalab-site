"use client";

import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

import Footer from "@/app/components/Footer";
import ContactFormCard from "@/app/sections/ContactFormCard";

gsap.registerPlugin(ScrollTrigger);

/**
 * In-page contact card (`#contact`).
 *
 * Default (reused on /services, /team, …): a simple normal-flow section — the
 * page renders its own <Footer/> below it.
 *
 * `endZone` (homepage only): a pinned stage that reveals the card in place behind
 * Global's fade-to-black (site seam pattern), then slides the footer UP from the
 * bottom over the pinned card. In this mode it renders <Footer/> itself, so the
 * page must NOT render a separate one.
 */
export default function ContactSection({ endZone = false }) {
  const wrapperRef = useRef(null);
  const bgRef = useRef(null);
  const cardGlassRef = useRef(null);
  const cardRef = useRef(null);
  const footerRef = useRef(null);

  useLayoutEffect(() => {
    /* Only the homepage end-zone runs the pinned seam + footer-slide. The plain
       reusable card stays static (no ScrollTrigger), so it works on any page. */
    if (!endZone) return undefined;

    const wrapper = wrapperRef.current;
    const bg = bgRef.current;
    const cardGlass = cardGlassRef.current;
    const card = cardRef.current;
    const footer = footerRef.current;
    if (!wrapper || !cardGlass || !card) return undefined;

    const fields = card.querySelectorAll("[data-cf]");
    const mm = gsap.matchMedia();

    /* Desktop: pinned stage. Reveal the card after Global fades to black, hold,
       then slide the footer up over it (card stays visible until covered). */
    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        gsap.set(bg, { autoAlpha: 0 });
        gsap.set(cardGlass, { autoAlpha: 0 });
        gsap.set(card, { autoAlpha: 0 });
        gsap.set(fields, { autoAlpha: 0, y: 16 });
        gsap.set(footer, { yPercent: 100 });

        const REVEAL = 0.28;
        /* FOOTER_AT sits well after the fields finish (~0.50) so the completed
           form rests on screen for a beat before the footer slides up over it. */
        const FOOTER_AT = 0.84;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        });

        /* Reveal in place (after Global's panel has faded to black). The glass
           shell only ever uses opacity (never transform) so backdrop-filter stays
           active; inner content + fields animate separately. */
        tl.to(bg, { autoAlpha: 1, ease: "power1.out", duration: 0.12 }, REVEAL);
        tl.to(
          cardGlass,
          { autoAlpha: 1, ease: "power2.out", duration: 0.16 },
          REVEAL + 0.02,
        );
        tl.to(
          card,
          { autoAlpha: 1, ease: "power2.out", duration: 0.12 },
          REVEAL + 0.04,
        );
        tl.to(
          fields,
          { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.16, stagger: 0.02 },
          REVEAL + 0.06,
        );

        /* Footer slides up over the pinned card — content + glass stay visible
           until the opaque footer (z-40) physically covers them. No opacity fade
           on card/content (that was emptying the box before the footer arrived). */
        tl.fromTo(
          footer,
          { yPercent: 100 },
          { yPercent: 0, ease: "none", duration: 0.32 },
          FOOTER_AT,
        );
      },
    );

    /* Mobile: normal stacked section — card fades in on enter, footer flows below. */
    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.set(bg, { autoAlpha: 1 });
      gsap.set(cardGlass, { autoAlpha: 1 });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: wrapper, start: "top 80%", once: true },
      });
      tl.from(card, { autoAlpha: 0, duration: 0.5, ease: "power2.out" }).from(
        fields,
        { autoAlpha: 0, y: 16, duration: 0.4, ease: "power2.out", stagger: 0.05 },
        "<0.1",
      );
    });

    /* Reduced motion: everything static + legible; footer in place. */
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set([bg, cardGlass, card], { autoAlpha: 1, y: 0 });
      gsap.set(fields, { autoAlpha: 1, y: 0 });
      if (footer) gsap.set(footer, { yPercent: 0 });
    });

    const refresh = () => ScrollTrigger.refresh();
    requestAnimationFrame(refresh);
    window.addEventListener("load", refresh);
    window.addEventListener("resize", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", refresh);
      mm.revert();
    };
  }, [endZone]);

  /* Grayscale VR-figure background + dark overlay (shared by both layouts). */
  const bgLayer = (
    <div ref={bgRef} className="pointer-events-none absolute inset-0 z-0 will-change-[opacity]">
      <Image
        src="/images/default-contact-section-bg.webp"
        alt=""
        fill
        className="object-cover object-center md:object-right grayscale contrast-[0.92] brightness-[0.3] sm:brightness-[0.3]"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 bg-linear-to-b from-neutral-950/80 via-neutral-900/64 to-neutral-950/86"
        aria-hidden
      />
    </div>
  );

  /* Glass shell + content split: backdrop-filter lives on a layer that never
     receives transform and stays at full opacity during the footer slide-over. */
  const cardBox = (
    <div className="relative w-full">
      <div
        ref={cardGlassRef}
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl border border-white/12 bg-white/[0.08] shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl backdrop-saturate-150 will-change-[opacity]"
        aria-hidden
      />
      <div
        ref={cardRef}
        className="relative z-10 px-6 py-7 sm:px-8 sm:py-9"
      >
        <ContactFormCard />
      </div>
    </div>
  );

  /* Homepage end-zone: pinned stage + footer slide-over. */
  if (endZone) {
    return (
      <section
        id="contact"
        ref={wrapperRef}
        className="relative z-10 scroll-mt-20 bg-black md:-mt-[150vh] md:h-[380vh]"
      >
        <div className="relative overflow-hidden md:sticky md:top-0 md:flex md:h-screen md:items-center md:justify-center">
          {/* On mobile this `relative` box bounds the bg image to the card
              region only (the footer below is a sibling and is opaque, so it
              never needed the image behind it). That lets the landscape image
              fit its HEIGHT to the visible contact area and center horizontally
              — instead of being scaled to cover the full card+footer stack,
              which pushed the subject down behind the footer. `md:contents`
              dissolves this box on desktop, so the bg returns to covering the
              full pinned screen and the footer slides over it exactly as before. */}
          <div className="relative md:contents">
            {bgLayer}

            <div className="relative z-[1] mx-auto w-full max-w-[clamp(20rem,34vw,30rem)] px-4 py-16 sm:px-6 md:p-0">
              {cardBox}
            </div>
          </div>

          {/* Footer — slides up over the pinned card on desktop; normal block on mobile */}
          <div
            ref={footerRef}
            className="w-full md:absolute md:inset-x-0 md:bottom-0 md:z-40 md:h-[70vh]"
          >
            <Footer />
          </div>
        </div>
      </section>
    );
  }

  /* Default: simple reusable contact section (page renders its own <Footer/>). */
  return (
    <section
      id="contact"
      ref={wrapperRef}
      className="relative z-10 scroll-mt-20 overflow-x-hidden px-4 py-12 sm:px-6 md:py-16"
    >
      {bgLayer}
      <div className="relative z-[1] mx-auto w-full max-w-[clamp(20rem,34vw,30rem)]">
        {cardBox}
      </div>
    </section>
  );
}
