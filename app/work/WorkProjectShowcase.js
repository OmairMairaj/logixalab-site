"use client";

import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { useLayoutEffect, useRef } from "react";

import Footer from "@/app/components/Footer";
import { WORK_PROJECTS } from "@/app/work/workProjectsData";

gsap.registerPlugin(ScrollTrigger);

/**
 * One shared motion window: mockup rise + side fade-out start together at `t0`;
 * fade-in (reveal) is timed inside the same window so scroll feels like one gesture.
 */
const BEAT = {
  /** Length of the main beat (image lands at end of this). */
  motion: 1.18,
  /** Side fade-out runs in parallel with the start of the image rise. */
  fadeOut: 0.34,
  /** Reveal begins as a fraction of `motion` after `t0` (while image still moving). */
  revealStartFrac: 0.42,
  reveal: 0.56,
  hold: 0.42,
};

const SEGMENT =
  Math.max(BEAT.motion, BEAT.motion * BEAT.revealStartFrac + BEAT.reveal) + BEAT.hold;

/**
 * Single pinned viewport: one case study at a time. Center + columns animate on the same beat.
 */
export default function WorkProjectShowcase() {
  const sectionRef = useRef(null);
  const slideRefs = useRef([]);
  const leftRefs = useRef([]);
  const rightRefs = useRef([]);
  const imageWrapRefs = useRef([]);
  const footerRef = useRef(null);

  const projectCount = WORK_PROJECTS.length;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const slides = slideRefs.current;
    const lefts = leftRefs.current;
    const rights = rightRefs.current;
    const imgs = imageWrapRefs.current;
    const footer = footerRef.current;

    for (let i = 0; i < projectCount; i++) {
      if (!slides[i] || !lefts[i] || !rights[i] || !imgs[i]) return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const smallScreen = window.matchMedia("(max-width: 767px)").matches;

    const ctx = gsap.context(() => {
      if (reduceMotion || smallScreen) {
        for (let i = 0; i < projectCount; i++) {
          gsap.set(slides[i], {
            autoAlpha: 1,
            clearProps: "position,inset,zIndex,pointerEvents",
          });
          slides[i]?.setAttribute("aria-hidden", "false");
          gsap.set(imgs[i], { y: 0, opacity: 1 });
          gsap.set([lefts[i], rights[i]], { opacity: 1 });
        }
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "none", overwrite: "auto" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => {
            const base = typeof window !== "undefined" && window.innerWidth < 768 ? 120 : 160;
            /* +120% gives the footer room to rise over the last pinned project. */
            return `+=${base + projectCount * 100 + 120}%`;
          },
          pin: true,
          scrub: 1.05,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      for (let i = 0; i < projectCount; i++) {
        const t0 = i * SEGMENT;

        tl.call(() => {
          for (let j = 0; j < projectCount; j++) {
            slides[j]?.setAttribute("aria-hidden", j === i ? "false" : "true");
          }
        }, null, t0);

        /* Hard-switch which slide is active; the incoming one sits on top. */
        for (let j = 0; j < projectCount; j++) {
          const active = j === i;
          tl.set(
            slides[j],
            {
              autoAlpha: active ? 1 : 0,
              zIndex: active ? 2 : 0,
              pointerEvents: active ? "auto" : "none",
            },
            t0,
          );
        }

        if (i === 0) {
          /* First project starts fully visible so the pinned frame matches the
             pre-pin frame — no fade-out/in blink as the section engages. It
             simply holds, then the next project rises over it. */
          tl.set(imgs[i], { y: 0, opacity: 1, force3D: true }, t0);
          tl.set([lefts[i], rights[i]], { opacity: 1 }, t0);
        } else {
          /* Entrance: the mockup rises in while the side columns fade in just
             behind it — one clean gesture, never disappear-then-reappear. */
          tl.set(imgs[i], { y: "22vh", opacity: 0, force3D: true }, t0);
          tl.set([lefts[i], rights[i]], { opacity: 0 }, t0);
          tl.to(imgs[i], { y: 0, opacity: 1, duration: BEAT.motion }, t0);

          const revealT = t0 + BEAT.motion * BEAT.revealStartFrac;
          tl.to(
            [lefts[i], rights[i]],
            { opacity: 1, duration: BEAT.reveal, ease: "power2.out" },
            revealT,
          );
        }
      }

      /* Footer rises over the last pinned project: the section stays pinned for
         one extra beat while <Footer/> slides up from below to close the page. */
      if (footer) {
        tl.set(footer, { yPercent: 100 }, 0);
        tl.to(footer, { yPercent: 0, duration: 1.3, ease: "none" }, projectCount * SEGMENT);
      }
    }, section);

    return () => ctx.revert();
  }, [projectCount]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 overflow-x-clip text-white"
      aria-label="Selected work"
    >
      <div className="relative isolate min-h-dvh w-full max-md:min-h-0 max-md:space-y-14 max-md:py-12">
        {/* Binary texture — left strip + lower-left, behind every slide. */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
          {/* <div className="absolute right-[-100px] top-[200px] h-[50vh] w-[40vw] -translate-y-1/2 opacity-[0.9]">
            <Image
              src="/images/binary.webp"
              alt=""
              fill
              className="object-contain object-left"
              sizes="30vw"
            />
          </div> */}
          <div className="absolute bottom-[60px] left-[60px] h-[50vh] w-[46vw] opacity-[0.9]">
            <Image
              src="/images/binary.webp"
              alt=""
              fill
              className="object-contain object-left-bottom"
              sizes="26vw"
            />
          </div>
        </div>

        {WORK_PROJECTS.map((project, i) => (
          <article
            key={project.id}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className={`absolute inset-0 flex items-center ${i === 0 ? "z-10 opacity-100" : "z-0 opacity-0"} max-md:relative max-md:inset-auto max-md:z-auto max-md:opacity-100`}
            aria-hidden={i === 0 ? false : true}
          >
            <div className="relative z-10 w-full px-(--gutter) py-12 md:py-20">
              <div className="grid w-full grid-cols-1 items-center gap-7 lg:grid-cols-12 lg:gap-8 xl:gap-10">
                <div
                  ref={(el) => {
                    leftRefs.current[i] = el;
                  }}
                  className="will-change-[opacity] lg:col-span-3 lg:pr-2 order-2 lg:order-1"
                >
                  <h2
                    id={`work-project-${project.id}`}
                    className="font-heading text-[clamp(1.5rem,2.6vw,2.25rem)] font-normal tracking-tight text-(--hero-accent)"
                  >
                    {project.title}
                  </h2>
                  <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/70 md:mt-5 md:space-y-4 md:text-[0.9375rem]">
                    {project.paragraphs.map((p, pi) => (
                      <p key={`${project.id}-p-${pi}`}>{p}</p>
                    ))}
                  </div>
                  <Link
                    href={project.visitHref}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-(--hero-accent) transition-opacity hover:opacity-85 md:mt-8"
                  >
                    {project.visitLabel}
                    <ArrowUpRight className="size-4 shrink-0" aria-hidden />
                  </Link>
                </div>

                <div className="relative lg:col-span-6 order-1 lg:order-2">
                  <div
                    ref={(el) => {
                      imageWrapRefs.current[i] = el;
                    }}
                    className="will-change-transform relative mx-auto w-full max-w-[min(100%,720px)] backface-hidden"
                  >
                    {/* Full-page screenshot inside a fixed "browser window".
                        On hover the background scrolls top → bottom, revealing
                        the whole page. Percentage background-position lands the
                        scroll exactly bottom-aligned no matter how tall the
                        capture is, so every project image works unmeasured. */}
                    <div className="group/shot relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-white/10 bg-black/30 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                      <div
                        role="img"
                        aria-label={project.imageAlt}
                        className="absolute inset-0 bg-top bg-no-repeat [background-size:100%_auto] transition-[background-position] duration-[5000ms] ease-linear motion-safe:group-hover/shot:bg-bottom"
                        style={{ backgroundImage: `url(${project.image})` }}
                      />
                      {/* Hover affordance — fades out once you're scrolling. */}
                      <span className="pointer-events-none absolute bottom-2.5 right-2.5 rounded-full bg-black/55 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-white/70 backdrop-blur-sm transition-opacity duration-300 group-hover/shot:opacity-0 max-md:hidden">
                        Hover to explore
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  ref={(el) => {
                    rightRefs.current[i] = el;
                  }}
                  className="will-change-[opacity] lg:col-span-3 lg:pl-2 order-3"
                >
                  <h3 className="font-heading text-[clamp(0.95rem,1.1vw,1.0625rem)] font-normal text-(--hero-accent)">Tech Stack</h3>
                  <ul className="mt-4 list-inside list-disc space-y-2.5 text-sm text-white/80 md:text-[0.9375rem]">
                    {project.tech.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <h3 className="mt-6 font-heading text-[clamp(0.95rem,1.1vw,1.0625rem)] font-normal text-(--hero-accent) md:mt-10">Timeline</h3>
                  <p className="mt-3 text-sm text-white/85 md:text-[0.9375rem]">{project.timeline}</p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Footer — desktop: a clip layer over the pinned section; the inner panel
          slides up from below (driven by the timeline). Mobile + reduced-motion:
          plain block that flows below the stacked projects. */}
      <div className="motion-safe:md:pointer-events-none motion-safe:md:absolute motion-safe:md:inset-0 motion-safe:md:z-40 motion-safe:md:overflow-hidden">
        <div
          ref={footerRef}
          className="w-full will-change-transform motion-safe:md:pointer-events-auto motion-safe:md:absolute motion-safe:md:inset-x-0 motion-safe:md:bottom-0 motion-safe:md:h-[70vh]"
        >
          <Footer />
        </div>
      </div>
    </section>
  );
}
