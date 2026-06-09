"use client";

import { useRef } from "react";

import HeroEyebrow from "@/app/components/HeroEyebrow";
import ScrollCue from "@/app/components/ScrollCue";
import useHeroEntrance from "@/app/hooks/useHeroEntrance";

/**
 * Portfolio hero — mirrors the /services + /contact heroes: an eyebrow, a
 * two-line Michroma display (lime-gradient first line over white), a paragraph
 * + "scroll to explore" row, bottom-anchored and revealed with a blur-rise
 * stagger ([useHeroEntrance] animates every [data-hero] child).
 */
export default function WorkHero() {
  const rootRef = useRef(null);
  useHeroEntrance(rootRef);

  return (
    <section
      ref={rootRef}
      className="relative z-10 flex min-h-[calc(90svh-var(--header-offset))] flex-col justify-start overflow-hidden px-(--gutter) pb-[clamp(3rem,8vh,6rem)] pt-(--hero-anchor-top) text-white"
      aria-labelledby="work-hero-heading"
    >
      <div className="relative z-10 w-full">
        <HeroEyebrow label="Selected Work" />

        <h1
          id="work-hero-heading"
          className="max-w-[18ch] font-heading text-[clamp(2.5rem,8vw,6.5rem)] font-normal leading-[0.98] tracking-[-0.03em]"
        >
          <span
            data-hero
            className="block pb-[0.08em] text-hero-gradient will-change-[opacity,transform,filter]"
          >
            Portfolio That
          </span>
          <span data-hero className="block text-white/92 will-change-[opacity,transform,filter]">
            Speaks Itself
          </span>
        </h1>

        <div className="mt-8 flex flex-col gap-8 md:mt-12 md:flex-row md:items-end md:justify-between md:gap-12">
          <p
            data-hero
            className="max-w-[52ch] text-[clamp(0.9rem,1.1vw,1.05rem)] leading-relaxed text-white/70 will-change-[opacity,transform,filter]"
          >
            Every project below is a system we designed, engineered, and shipped
            end to end — real products solving real problems. Scroll through to
            see how strategy, design, and intelligent technology come together
            in the work itself.
          </p>

          <ScrollCue className="self-start md:self-auto" />
        </div>
      </div>
    </section>
  );
}
