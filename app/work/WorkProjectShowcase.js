"use client";

import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { useLayoutEffect, useRef } from "react";

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

  const projectCount = WORK_PROJECTS.length;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const slides = slideRefs.current;
    const lefts = leftRefs.current;
    const rights = rightRefs.current;
    const imgs = imageWrapRefs.current;

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
            return `+=${base + projectCount * 100}%`;
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
            const active = j === i;
            slides[j]?.setAttribute("aria-hidden", active ? "false" : "true");
          }
        }, null, t0);

        for (let j = 0; j < projectCount; j++) {
          if (j !== i) {
            tl.set(imgs[j], { y: 0, opacity: 1 }, t0);
            tl.set([lefts[j], rights[j]], { opacity: 1, clearProps: "transform" }, t0);
          }
        }

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

        tl.set([lefts[i], rights[i]], { opacity: 1, clearProps: "transform" }, t0);
        tl.set(imgs[i], { y: "22vh", opacity: 0.85, force3D: true }, t0);

        /* Same `t0`: image rise and side fade-out together */
        tl.to(imgs[i], { y: 0, opacity: 1, duration: BEAT.motion }, t0);
        tl.to(lefts[i], { opacity: 0, duration: BEAT.fadeOut, ease: "power2.inOut" }, t0);
        tl.to(rights[i], { opacity: 0, duration: BEAT.fadeOut, ease: "power2.inOut" }, t0);

        const revealT = t0 + BEAT.motion * BEAT.revealStartFrac;
        tl.fromTo(
          lefts[i],
          { opacity: 0 },
          {
            opacity: 1,
            duration: BEAT.reveal,
            ease: "power2.out",
            immediateRender: false,
          },
          revealT,
        );
        tl.fromTo(
          rights[i],
          { opacity: 0 },
          {
            opacity: 1,
            duration: BEAT.reveal,
            ease: "power2.out",
            immediateRender: false,
          },
          revealT,
        );
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
        {WORK_PROJECTS.map((project, i) => (
          <article
            key={project.id}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className={`absolute inset-0 flex items-center ${i === 0 ? "z-10 opacity-100" : "z-0 opacity-0"} max-md:relative max-md:inset-auto max-md:z-auto max-md:opacity-100`}
            aria-hidden={i === 0 ? false : true}
          >
            <div className="mx-auto w-full max-w-[min(100%,1440px)] px-5 py-12 md:px-10 md:py-20">
              <div className="grid w-full grid-cols-1 items-center gap-7 lg:grid-cols-12 lg:gap-8 xl:gap-10">
                <div
                  ref={(el) => {
                    leftRefs.current[i] = el;
                  }}
                  className="will-change-[opacity] lg:col-span-3 lg:pr-2 order-2 lg:order-1"
                >
                  <h2
                    id={`work-project-${project.id}`}
                    className="font-heading text-2xl font-normal tracking-tight text-white md:text-3xl"
                  >
                    {project.title}
                  </h2>
                  <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/82 md:mt-5 md:space-y-4 md:text-[0.9375rem]">
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
                    <div className="relative overflow-hidden rounded-xl border border-white/12 bg-black/30 shadow-[0_40px_100px_rgba(0,0,0,0.55)]">
                      <Image
                        src={project.image}
                        alt={project.imageAlt}
                        width={1200}
                        height={800}
                        className="h-auto w-full object-cover object-top"
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        priority={i === 0}
                      />
                    </div>
                  </div>
                </div>

                <div
                  ref={(el) => {
                    rightRefs.current[i] = el;
                  }}
                  className="will-change-[opacity] lg:col-span-3 lg:pl-2 order-3"
                >
                  <h3 className="text-[17px] font-medium text-(--hero-accent)">Tech Stack</h3>
                  <ul className="mt-4 list-inside list-disc space-y-2.5 text-sm text-white/85 md:text-[0.9375rem]">
                    {project.tech.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <h3 className="mt-6 text-[17px] font-medium text-(--hero-accent) md:mt-10">Timeline</h3>
                  <p className="mt-3 text-sm text-white/88 md:text-[0.9375rem]">{project.timeline}</p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
