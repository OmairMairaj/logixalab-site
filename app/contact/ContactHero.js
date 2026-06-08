"use client";

import { useRef } from "react";

import HeroEyebrow from "@/app/components/HeroEyebrow";
import useHeroEntrance from "@/app/hooks/useHeroEntrance";
import { SOCIAL_LINKS } from "@/app/lib/constants";

/**
 * Contact hero — same pattern as the /work + /services heroes (eyebrow, two-line
 * Michroma display, blur-rise stagger entrance), but the bottom row carries the
 * contact details (email / phone / follow) in place of a "scroll to explore" cue.
 */
export default function ContactHero() {
  const rootRef = useRef(null);
  useHeroEntrance(rootRef);

  return (
    <section
      ref={rootRef}
      className="relative z-10 flex min-h-[calc(90svh-var(--header-offset))] flex-col justify-end overflow-hidden px-(--gutter) pb-[clamp(4rem,12vh,8rem)] pt-(--header-offset) text-white"
      aria-labelledby="contact-hero-heading"
    >
      <div className="relative z-10 w-full">
        <HeroEyebrow label="Get in touch" />

        <h1
          id="contact-hero-heading"
          className="max-w-[18ch] font-heading text-[clamp(2.5rem,8vw,6.5rem)] font-normal leading-[0.98] tracking-[-0.03em]"
        >
          <span
            data-hero
            className="block pb-[0.08em] text-hero-gradient will-change-[opacity,transform,filter]"
          >
            Let&apos;s Talk
          </span>
          <span data-hero className="block text-white/92 will-change-[opacity,transform,filter]">
            Build What&apos;s Next
          </span>
        </h1>

        <div className="mt-8 flex flex-col gap-10 md:mt-12 md:flex-row md:items-end md:justify-between md:gap-12">
          <p
            data-hero
            className="max-w-[52ch] text-[clamp(0.9rem,1.1vw,1.05rem)] leading-relaxed text-white/70 will-change-[opacity,transform,filter]"
          >
            Tell us where you&apos;re headed and we&apos;ll help you engineer the
            way there. Whether it&apos;s an AI product, a custom platform, or a
            problem you haven&apos;t cracked yet — start the conversation and
            we&apos;ll take it from there.
          </p>

          <div className="flex shrink-0 flex-col gap-5 md:items-end md:text-right">
            <div data-hero className="flex flex-col gap-1 will-change-[opacity,transform,filter] md:items-end">
              <span className="font-sans text-[0.65rem] font-medium uppercase tracking-[0.28em] text-white/40">
                Email
              </span>
              <a
                href="mailto:info@logixalab.com"
                className="text-[clamp(0.9rem,1.1vw,1.05rem)] font-medium text-(--hero-accent) transition-opacity hover:opacity-85"
              >
                info@logixalab.com
              </a>
            </div>

            <div data-hero className="flex flex-col gap-1 will-change-[opacity,transform,filter] md:items-end">
              <span className="font-sans text-[0.65rem] font-medium uppercase tracking-[0.28em] text-white/40">
                Phone
              </span>
              <a
                href="tel:+925498465186"
                className="text-[clamp(0.9rem,1.1vw,1.05rem)] font-medium text-(--hero-accent) transition-opacity hover:opacity-85"
              >
                +92 549 846 5186
              </a>
            </div>

            <div data-hero className="flex flex-col gap-2 will-change-[opacity,transform,filter] md:items-end">
              <span className="font-sans text-[0.65rem] font-medium uppercase tracking-[0.28em] text-white/40">
                Follow
              </span>
              <ul className="flex flex-wrap gap-x-4 gap-y-1 md:justify-end">
                {SOCIAL_LINKS.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-sm text-white/80 transition-colors duration-200 hover:text-(--hero-accent)"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
