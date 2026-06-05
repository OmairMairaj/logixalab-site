"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

const HEADING_GRADIENT =
  "linear-gradient(105deg, #7DFF00 0%, #B2FF00 49%, #C8FF00 100%)";

export default function ServicesHero() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const items = root.querySelectorAll("[data-hero]");
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(items, { autoAlpha: 0, y: 28, filter: "blur(8px)" });
      gsap.to(items, {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        ease: "power3.out",
        duration: 0.8,
        stagger: 0.12,
        delay: 0.1,
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(items, { autoAlpha: 1, y: 0, filter: "blur(0px)" });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative z-10 flex min-h-[calc(90svh-var(--header-offset))] flex-col justify-end overflow-hidden px-(--gutter) pb-[clamp(4rem,12vh,8rem)] pt-(--header-offset) text-white"
      aria-labelledby="services-hero-heading"
    >
      <div className="relative z-10 w-full">
        <p
          data-hero
          className="mb-5 flex items-center gap-2 font-sans text-[0.7rem] font-medium uppercase tracking-[0.34em] text-white/45 will-change-[opacity,transform,filter]"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-(--hero-accent)" aria-hidden />
          What we do
        </p>

        <h1
          id="services-hero-heading"
          className="max-w-[18ch] font-heading text-[clamp(2.5rem,8vw,6.5rem)] font-normal leading-[0.98] tracking-[-0.03em]"
        >
          <span
            data-hero
            className="block pb-[0.08em] will-change-[opacity,transform,filter]"
            style={{
              backgroundImage: HEADING_GRADIENT,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            AI Solutions
          </span>
          <span data-hero className="block text-white/92 will-change-[opacity,transform,filter]">
            Designed to Scale
          </span>
        </h1>

        <div className="mt-8 flex flex-col gap-8 md:mt-12 md:flex-row md:items-end md:justify-between md:gap-12">
          <p
            data-hero
            className="max-w-[52ch] text-[clamp(0.9rem,1.1vw,1.05rem)] leading-relaxed text-white/70 will-change-[opacity,transform,filter]"
          >
            At LogixaLab we&apos;re a collective of engineers, designers, and AI
            specialists building intelligent systems that shape how modern
            businesses operate — every solution engineered in-house, end to end.
          </p>

          <p
            data-hero
            className="flex items-center gap-2 self-start font-sans text-[0.7rem] font-medium uppercase tracking-[0.28em] text-white/40 will-change-[opacity,transform,filter] md:self-auto"
          >
            Scroll to explore
            <span className="inline-block h-4 w-px animate-pulse bg-(--hero-accent)/70" aria-hidden />
          </p>
        </div>
      </div>
    </section>
  );
}
