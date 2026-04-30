"use client";

import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const TEAM = [
  {
    name: "Kashif Javed",
    role: "CEO & Founder",
    image: "/team/kashif.png",
    description:
      "Kashif leads LOGIXA LAB with a focus on building scalable AI ecosystems.",
  },
  {
    name: "Mohib Hassan",
    role: "CTO & Co-Founder",
    image: "/team/mohib.png",
    description:
      "Mohib drives our engineering culture and architects mission-critical AI platforms.",
  },
  {
    name: "Omair Mairaj",
    role: "Lead Engineer",
    image: "/team/omair.png",
    description:
      "Omair ships product-grade AI features with a craft-first engineering mindset.",
  },
  {
    name: "Mujtaba",
    role: "Head of Design",
    image: "/team/mujtaba.png",
    description:
      "Mujtaba shapes the visual language and product experience across LOGIXA LAB.",
  },
  {
    name: "Aliza",
    role: "AI Specialist",
    image: "/team/aliza.png",
    description:
      "Aliza builds and trains the models that power our intelligent solutions.",
  },
  {
    name: "Raza",
    role: "Cloud Architect",
    image: "/team/raza.png",
    description:
      "Raza designs and operates the cloud infrastructure that scales with our clients.",
  },
];

/**
 * Team page scroll experience:
 *   Phase A — hero "The Minds / Behind Logixa Lab" + bottom-right paragraph holds
 *   Phase B — hero text exits left + paragraph fades
 *   Phase C — team card rail fades in
 *   Phase D — rail translates X (right → left horizontal scroll, scrub-driven)
 *   Phase E — outro: bg + rail fade so Contact section reveals cleanly
 */
export default function TeamScrollExperience() {
  const scrollRootRef = useRef(null);
  const heroBgLayerRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroSubtitleRef = useRef(null);
  const heroParaRef = useRef(null);
  const railContainerRef = useRef(null);
  const railRef = useRef(null);

  useLayoutEffect(() => {
    const scrollRoot = scrollRootRef.current;
    const heroBgLayer = heroBgLayerRef.current;
    const heroTitle = heroTitleRef.current;
    const heroSubtitle = heroSubtitleRef.current;
    const heroPara = heroParaRef.current;
    const railContainer = railContainerRef.current;
    const rail = railRef.current;

    if (
      !scrollRoot ||
      !heroBgLayer ||
      !heroTitle ||
      !heroSubtitle ||
      !heroPara ||
      !railContainer ||
      !rail
    )
      return;

    const ctx = gsap.context(() => {
      gsap.set(heroBgLayer, { opacity: 1 });
      gsap.set([heroTitle, heroSubtitle], { x: 0, opacity: 1, force3D: true });
      gsap.set(heroPara, { opacity: 1, y: 0, force3D: true });
      gsap.set(railContainer, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(rail, { x: 0, force3D: true });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollRoot,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.2,
          invalidateOnRefresh: true,
        },
      });

      /** Phase A — hero hold (no animation, lets user dwell on hero). */
      const phaseAStart = 0;
      const phaseADur = 0.45;

      /** Phase B — hero text/paragraph exit. */
      const phaseBStart = phaseAStart + phaseADur;
      const phaseBDur = 0.55;

      tl.to(
        [heroTitle, heroSubtitle],
        {
          x: () => -window.innerWidth * 0.35,
          opacity: 0,
          ease: "none",
          duration: phaseBDur,
        },
        phaseBStart,
      );

      tl.to(
        heroPara,
        {
          opacity: 0,
          y: 30,
          ease: "none",
          duration: phaseBDur * 0.7,
        },
        phaseBStart,
      );

      /** Phase C — team rail fades in. */
      const phaseCStart = phaseBStart + phaseBDur * 0.5;
      const phaseCDur = 0.32;

      tl.to(
        railContainer,
        {
          autoAlpha: 1,
          pointerEvents: "auto",
          ease: "none",
          duration: phaseCDur,
        },
        phaseCStart,
      );

      /** Phase D — horizontal scroll. Distance = rail width − viewport width. */
      const phaseDStart = phaseCStart + phaseCDur;
      const phaseDDur = 2.1;

      const railMoveDistance = () =>
        Math.max(rail.scrollWidth - window.innerWidth, 0);

      tl.fromTo(
        rail,
        { x: 0 },
        {
          x: () => -railMoveDistance(),
          ease: "none",
          duration: phaseDDur,
        },
        phaseDStart,
      );

      /** Phase E — outro: bg + rail fade so Contact section reveals cleanly. */
      const phaseEStart = phaseDStart + phaseDDur + 0.3;
      const phaseEDur = 0.55;

      tl.to(
        [heroBgLayer, railContainer],
        {
          autoAlpha: 0,
          ease: "none",
          duration: phaseEDur,
        },
        phaseEStart,
      );
    }, scrollRoot);

    const refresh = () => ScrollTrigger.refresh();
    requestAnimationFrame(refresh);
    window.addEventListener("load", refresh);
    window.addEventListener("resize", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", refresh);
      ctx.revert();
    };
  }, []);

  return (
    <div className="relative overflow-x-clip bg-(--hero-canvas) text-white">
      {/* Background layer — same binary backdrop + side glows as landing */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <div
          ref={heroBgLayerRef}
          className="absolute inset-0 will-change-opacity"
        >
          <Image
            src="/images/Background.png"
            alt=""
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute left-0 top-0 h-full w-[56vw] -translate-x-1/3">
            <Image
              src="/images/left.png"
              alt=""
              fill
              className="object-contain object-left"
              sizes="65vw"
            />
          </div>
          <div className="absolute right-0 top-0 z-10 h-[92vh] w-[66vw] translate-x-[30%] -translate-y-[24%]">
            <Image
              src="/images/right.png"
              alt=""
              fill
              className="object-contain object-top-right"
              sizes="66vw"
            />
          </div>
        </div>
      </div>

      {/* Scroll spacer — drives the timeline. */}
      <div ref={scrollRootRef} className="min-h-[520vh] w-full" aria-hidden />

      <h1 className="sr-only">The Minds Behind Logixa Lab — Our Team</h1>

      {/* Hero headings — fixed, top-left of viewport. */}
      <div className="pointer-events-none fixed inset-x-0 top-[28%] z-30 px-6 md:px-12 lg:px-16">
        <h2
          ref={heroTitleRef}
          className="font-heading max-w-[16ch] text-[clamp(3rem,9vw,7.5rem)] font-normal leading-[0.95] tracking-[-0.04em] text-white will-change-transform"
          style={{ textShadow: "0 2px 48px rgba(0,0,0,0.55)" }}
        >
          The Minds
        </h2>
        <h3
          ref={heroSubtitleRef}
          className="font-heading mt-2 max-w-[20ch] text-[clamp(1.25rem,4.2vw,3.25rem)] font-normal leading-[1.05] tracking-[-0.02em] text-white/85 will-change-transform"
        >
          Behind Logixa Lab
        </h3>
      </div>

      {/* Hero paragraph — fixed bottom-right. */}
      <p
        ref={heroParaRef}
        className="pointer-events-none fixed bottom-[12%] right-[6%] z-30 max-w-[300px] text-right text-sm leading-relaxed text-white/85 will-change-transform md:right-[8%]"
      >
        At LOGIXA LAB, we are a collective of engineers, designers, and AI
        specialists united by one mission &mdash; to build intelligent systems
        that shape the future of business.
      </p>

      {/* Team card rail — fixed, horizontal scroll right → left. */}
      <div
        ref={railContainerRef}
        className="pointer-events-none fixed inset-0 z-40 flex items-center will-change-[opacity,visibility]"
        aria-hidden
      >
        <div
          ref={railRef}
          className="flex items-center gap-5 will-change-transform md:gap-7"
          style={{ paddingLeft: "100vw", paddingRight: "30vw" }}
        >
          {TEAM.map((member) => (
            <article
              key={member.name}
              className="shrink-0 rounded-2xl border border-white/12 bg-black/25 p-2.5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm"
              style={{ width: "min(28vw, 320px)" }}
            >
              <div
                className="relative overflow-hidden rounded-xl bg-linear-to-b from-neutral-700/30 via-neutral-900/60 to-black/85"
                style={{ aspectRatio: "0.82 / 1" }}
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 70vw, 320px"
                  className="object-contain object-bottom"
                />
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-(--hero-accent) px-3 py-1 text-[11px] font-semibold tracking-wide text-(--hero-canvas) shadow-[0_8px_20px_rgba(0,0,0,0.35)]">
                  {member.role}
                </span>
              </div>

              <div className="mt-3 px-1.5 pb-1.5">
                <h4 className="font-heading text-base font-normal leading-tight text-white md:text-[17px]">
                  {member.name}
                </h4>
                <p className="mt-1.5 text-[12px] leading-relaxed text-white/65">
                  {member.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
