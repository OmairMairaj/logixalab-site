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

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const paragraph = paragraphRef.current;
    if (!section || !paragraph) return undefined;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const chars = paragraph.querySelectorAll("[data-intro-char]");
    if (reduce || !chars.length) return undefined;

    /* Decode / blur-resolve: each glyph resolves from dim + blurred to sharp
       white, staggered with scroll position. */
    const ctx = gsap.context(() => {
      gsap.set(chars, { filter: "blur(10px)", autoAlpha: 0.12, yPercent: 18 });
      gsap.to(chars, {
        filter: "blur(0px)",
        autoAlpha: 1,
        yPercent: 0,
        ease: "power2.out",
        duration: 0.5,
        stagger: 0.012,
        force3D: true,
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=60%",
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 bg-(--section-canvas) md:-mt-[100vh] md:h-[200vh]"
    >
      {/* Sticky inner panel — keeps the screen "stuck" on the #0c0c0c surface
         while the copy decodes (plus a buffer) before releasing. */}
      <div className="sticky top-0 flex min-h-screen items-center justify-center overflow-hidden px-(--gutter) md:h-[20vh]">
        {/* Soft green glow particle anchored to the bottom-center, behind the copy. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 mx-auto h-[100%] w-full"
          aria-hidden
        >
          <Image
            src="/images/wide-blur.png"
            alt=""
            fill
            className="object-contain object-bottom mt-20"
            sizes="100vw"
          />
        </div>

        <p
          ref={paragraphRef}
          className="relative z-10 flex max-w-[min(80vw,1500px)] flex-wrap justify-center gap-x-[0.32em] gap-y-2 text-center font-sans text-[clamp(1.125rem,2.4vw,4rem)] font-normal leading-[1.55] tracking-[-0.01em] text-white"
        >
          {INTRO_COPY.split(/\s+/).map((word, wi) => (
            <span
              key={`intro-w-${wi}`}
              className="inline-block whitespace-nowrap"
            >
              {word.split("").map((char, ci) => (
                <span
                  key={`intro-w-${wi}-c-${ci}`}
                  data-intro-char=""
                  className="inline-block will-change-[filter,opacity,transform]"
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
