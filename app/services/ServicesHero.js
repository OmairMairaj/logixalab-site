"use client";

import { useRef } from "react";

import HeroEyebrow from "@/app/components/HeroEyebrow";
import ScrollCue from "@/app/components/ScrollCue";
import useHeroEntrance from "@/app/hooks/useHeroEntrance";

/**
 * Services hero — same pattern as the /work + /contact heroes: eyebrow, two-line
 * Michroma display (lime-gradient first line over white), paragraph + "scroll to
 * explore" row, bottom-anchored with a blur-rise stagger entrance.
 */
export default function ServicesHero() {
  const rootRef = useRef(null);
  useHeroEntrance(rootRef);

  return (
    <section
      ref={rootRef}
      className="relative z-10 flex min-h-[calc(90svh-var(--header-offset))] flex-col justify-end overflow-hidden px-(--gutter) pb-[clamp(4rem,12vh,8rem)] pt-(--header-offset) text-white"
      aria-labelledby="services-hero-heading"
    >
      <div className="relative z-10 w-full">
        <HeroEyebrow label="What we do" />

        <h1
          id="services-hero-heading"
          className="max-w-[18ch] font-heading text-[clamp(2.5rem,8vw,6.5rem)] font-normal leading-[0.98] tracking-[-0.03em]"
        >
          <span
            data-hero
            className="block pb-[0.08em] text-hero-gradient will-change-[opacity,transform,filter]"
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
            From enterprise platforms and production AI to mobile, design,
            cloud, and data — we build the systems modern businesses run on.
            Every one is engineered in-house, end to end, and designed to scale
            from day one.
          </p>

          <ScrollCue className="self-start md:self-auto" />
        </div>
      </div>
    </section>
  );
}
