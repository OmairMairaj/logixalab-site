  "use client";

  import Image from "next/image";
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import { useLayoutEffect, useRef } from "react";

  gsap.registerPlugin(ScrollTrigger);

  const INTRO_COPY =
    "LogixaLab builds enterprise platforms, AI systems, cloud infrastructure, and digital experiences designed to perform under real-world pressure. From AI-powered automation to large-scale platform engineering, every solution is built in-house by one integrated team.";

  export default function IntroSection() {
    const sectionRef = useRef(null);
    const paragraphRef = useRef(null);
    const glowRef = useRef(null);

    useLayoutEffect(() => {
      const section = sectionRef.current;
      const paragraph = paragraphRef.current;
      const glow = glowRef.current;
      if (!section || !paragraph) return undefined;

      const chars = paragraph.querySelectorAll("[data-intro-char]");
      const words = paragraph.querySelectorAll("[data-intro-word]");
      if (!chars.length) return undefined;

      const mm = gsap.matchMedia();

      /* Desktop: the deep -mt overlap pins this section in its FINAL position
        while the hero (z-20, on top) is still on screen — so it can reveal in
        place with no slide-up. It stays fully hidden behind the hero while the
        hero flies its text out and fades the whole panel to black; only AFTER
        the hero has gone does the lime glow power up from the bottom and the
        copy decode out of it. */
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.set(glow, { autoAlpha: 0, yPercent: 30, scale: 0.9 });
          gsap.set(chars, { filter: "blur(10px)", autoAlpha: 0, yPercent: 18 });

          /* Glow-up — starts ~one viewport after the pin (i.e. once the hero has
            fully faded to black), powering up from the bottom of the screen. */
          const glowTl = gsap.to(glow, {
            autoAlpha: 1,
            yPercent: 0,
            scale: 1,
            ease: "power2.out",
            duration: 0.5,
            scrollTrigger: {
              trigger: section,
              start: "top top-=100%",
              end: "top top-=140%",
              scrub: 0.4,
              invalidateOnRefresh: true,
            },
          });

          /* Decode — each glyph resolves from dim + blurred to sharp white, just
            after the glow has come up, staggered across the remaining scroll. */
          const decodeTl = gsap.to(chars, {
            filter: "blur(0px)",
            autoAlpha: 1,
            yPercent: 0,
            ease: "power2.out",
            duration: 0.5,
            stagger: 0.012,
            force3D: true,
            scrollTrigger: {
              trigger: section,
              start: "top top-=115%",
              end: "top top-=175%",
              scrub: 0.4,
              invalidateOnRefresh: true,
            },
          });

          return () => {
            glowTl.scrollTrigger?.kill();
            glowTl.kill();
            decodeTl.scrollTrigger?.kill();
            decodeTl.kill();
          };
        },
      );

      /* Mobile: no hero overlap / pin (those classes are md: only) — a simple
        on-enter reveal as the section scrolls into view. Animates the ~40 WORD
        spans (not ~290 chars) with opacity/translate only — no per-character
        blur filter, which is the single heaviest scroll cost on low-end phones. */
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.set(glow, { autoAlpha: 1 });
        gsap.set(words, { autoAlpha: 0.12, yPercent: 18 });

        const tl = gsap.to(words, {
          autoAlpha: 1,
          yPercent: 0,
          ease: "power2.out",
          duration: 0.5,
          stagger: 0.03,
          force3D: true,
          /* Trigger on the PARAGRAPH (not the section) so the reveal tracks the
             text itself — the copy is centered in a ~100vh section, so a
             section-top trigger fired ~50vh too late (text already parked on
             screen). Now it decodes as the paragraph rises from the lower
             viewport up toward center. */
          scrollTrigger: {
            /* Hold the copy dim until the paragraph rises to ~60% of the
               viewport, then decode it over the next ~30vh — a deliberate beat
               before the reveal instead of firing the instant it peeks in. */
            trigger: paragraph,
            start: "top 60%",
            end: "top 30%",
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        });

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      /* Reduced motion: static, fully-legible copy. */
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(glow, { autoAlpha: 1 });
        gsap.set(chars, { filter: "blur(0px)", autoAlpha: 1, yPercent: 0 });
      });

      return () => mm.revert();
    }, []);

    return (
      <section
        ref={sectionRef}
        className="relative z-10 bg-black md:-mt-[200vh] md:h-[400vh]"
      >
        {/* Sticky inner panel — keeps the screen "stuck" on the #0c0c0c surface
          while the copy decodes (plus a buffer) before releasing. */}
        <div className="sticky top-0 flex min-h-screen items-center justify-center overflow-hidden px-(--gutter) md:h-screen">
          {/* Soft green glow particle anchored to the bottom-center, behind the copy. */}
          <div
            ref={glowRef}
            className="pointer-events-none absolute inset-x-0 bottom-0 z-0 mx-auto top-56 h-[100%] w-full will-change-[opacity,transform]"
            aria-hidden
          >
            <Image
              src="/images/wide-blur.webp"
              alt=""
              fill
              loading="lazy"
              className="object-contain object-bottom mt-20"
              sizes="100vw"
            />
          </div>

          {/* Mobile-only binary accents — faint texture pinned to the top-right
              and bottom-left corners (flush to the screen edges; `right-0`/`left-0`
              ignore the section gutter). Behind the copy (z-0) and clipped by the
              sticky panel's overflow-hidden. Desktop keeps the clean glow+decode. */}
          <div
            className="pointer-events-none absolute right-0 top-0 z-0 h-[24vh] w-[56vw] opacity-50 md:hidden"
            aria-hidden
          >
            <Image
              src="/images/binary.webp"
              alt=""
              fill
              loading="lazy"
              className="object-contain object-right-top"
              sizes="56vw"
            />
          </div>
          <div
            className="pointer-events-none absolute bottom-0 left-0 z-0 h-[24vh] w-[56vw] opacity-50 md:hidden"
            aria-hidden
          >
            <Image
              src="/images/binary.webp"
              alt=""
              fill
              loading="lazy"
              className="object-contain object-left-bottom"
              sizes="56vw"
            />
          </div>

          <p
            ref={paragraphRef}
            className="relative z-10 flex max-w-[min(90vw,1660px)] flex-wrap justify-center gap-x-[0.32em] font-heading gap-y-2 text-center text-[clamp(1.125rem,2.4vw,4rem)] font-normal leading-[1.2] tracking-[-0.01em] text-white"
          >
            {INTRO_COPY.split(/\s+/).map((word, wi) => (
              <span
                key={`intro-w-${wi}`}
                data-intro-word=""
                className="inline-block whitespace-nowrap"
              >
                {word.split("").map((char, ci) => (
                  <span
                    key={`intro-w-${wi}-c-${ci}`}
                    data-intro-char=""
                    className="inline-block"
                  >
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </p>
        </div>
      </section>
    );
  }
