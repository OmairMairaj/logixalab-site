"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

import Footer from "@/app/components/Footer";

gsap.registerPlugin(ScrollTrigger);

/**
 * Footer rises over a pinned stage — generalizes the homepage end-zone
 * (`ContactSection endZone`) minus the seam, for the dedicated /contact page.
 *
 * `children` = the stage content kept pinned behind the footer (the contact form
 * card). The stage reveals as it pins — the glass shell (`[data-fr-glass]`),
 * content (`[data-fr-content]`) and fields (`[data-cf]`) fade/stagger in — which
 * is the hero→form transition; then <Footer/> slides up over it.
 *
 * Must be the LAST thing on the page so the footer finishes fully-risen at max
 * scroll and stays there.
 *
 * Mobile (simplified) + reduced-motion: no pin/scrub — stage + footer flow
 * normally; the form reveals on enter and the footer fades up below it.
 */
export default function FooterReveal({ children, stageClassName = "" }) {
  const wrapperRef = useRef(null);
  const stageRef = useRef(null);
  const footerRef = useRef(null);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const stage = stageRef.current;
    const footer = footerRef.current;
    if (!wrapper || !stage || !footer) return undefined;

    const glass = stage.querySelector("[data-fr-glass]");
    const content = stage.querySelector("[data-fr-content]");
    const fields = stage.querySelectorAll("[data-cf]");
    const mm = gsap.matchMedia();

    /* Desktop: pinned stage. Reveal the card in place (glass uses opacity only so
       backdrop-filter stays live), then slide the footer up over it. */
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      if (glass) gsap.set(glass, { autoAlpha: 0 });
      if (content) gsap.set(content, { autoAlpha: 0 });
      gsap.set(fields, { autoAlpha: 0, y: 16 });
      gsap.set(footer, { yPercent: 100 });

      /* Three scroll phases (only the RATIOS of these times matter — scrub
         normalizes the timeline to its total duration of FOOTER_AT + 0.7 = 1.8):
           1. Reveal  — form fades/staggers in right as the stage pins
                        (time 0.05–0.415  ≈ scroll 3%–23%). REVEAL is small so
                        there's no blank pinned stage at the start.
           2. Hold    — the gap from the form finishing to FOOTER_AT
                        (time 0.415–1.1   ≈ scroll 23%–61%): form sits fully
                        visible while the user keeps scrolling.
           3. Rise    — footer slides up over the held form
                        (time 1.1–1.8     ≈ scroll 61%–100%). The 0.7 duration
                        keeps the rise pace the same as before (~38% of scroll);
                        it just starts later, after the hold. */
      const REVEAL = 0.05;
      const FOOTER_AT = 1.1;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      });

      if (glass) {
        tl.to(glass, { autoAlpha: 1, ease: "power2.out", duration: 0.16 }, REVEAL);
      }
      if (content) {
        tl.to(content, { autoAlpha: 1, ease: "power2.out", duration: 0.12 }, REVEAL + 0.04);
      }
      tl.to(
        fields,
        { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.18, stagger: 0.025 },
        REVEAL + 0.06,
      );
      tl.fromTo(
        footer,
        { yPercent: 100 },
        { yPercent: 0, ease: "none", duration: 0.7 },
        FOOTER_AT,
      );
    });

    /* Mobile: normal flow — card reveals on enter, footer fades up below it. */
    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      if (glass) gsap.set(glass, { autoAlpha: 1 });
      if (content) gsap.set(content, { autoAlpha: 1 });
      gsap.from(fields, {
        autoAlpha: 0,
        y: 16,
        duration: 0.4,
        ease: "power2.out",
        stagger: 0.05,
        scrollTrigger: { trigger: stage, start: "top 80%", once: true },
      });
      gsap.from(footer, {
        autoAlpha: 0,
        y: 40,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: { trigger: footer, start: "top 92%", once: true },
      });
    });

    /* Reduced motion: everything visible, footer in place. */
    mm.add("(prefers-reduced-motion: reduce)", () => {
      if (glass) gsap.set(glass, { autoAlpha: 1 });
      if (content) gsap.set(content, { autoAlpha: 1 });
      gsap.set(fields, { autoAlpha: 1, y: 0 });
      gsap.set(footer, { yPercent: 0, autoAlpha: 1 });
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
  }, []);

  return (
    <section ref={wrapperRef} className="relative z-10 motion-safe:md:h-[200vh]">
      <div className="relative overflow-hidden motion-safe:md:sticky motion-safe:md:top-0 motion-safe:md:flex motion-safe:md:h-screen motion-safe:md:items-center motion-safe:md:justify-center">
        <div
          ref={stageRef}
          /* Gutter padding is for mobile edge-safety only; at md+ the max-w stage
             is centered with mx-auto, so drop the horizontal gutter (md:px-0) —
             otherwise it eats ~2×gutter out of the form, making it noticeably
             thinner than the homepage card (which uses md:p-0 for the same reason). */
          className={`relative z-[1] mx-auto w-full px-(--gutter) py-16 motion-safe:md:py-0 md:px-0 ${stageClassName}`}
        >
          {children}
        </div>

        {/* Footer — slides up over the pinned stage on desktop; normal block on
            mobile + reduced-motion. */}
        <div
          ref={footerRef}
          className="w-full will-change-transform motion-safe:md:absolute motion-safe:md:inset-x-0 motion-safe:md:bottom-0 motion-safe:md:z-40 motion-safe:md:h-[70vh]"
        >
          <Footer />
        </div>
      </div>
    </section>
  );
}
