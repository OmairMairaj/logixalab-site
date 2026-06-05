"use client";

import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useId, useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const HEADING_GRADIENT =
  "linear-gradient(105deg, #7DFF00 0%, #B2FF00 49%, #C8FF00 100%)";

const STROKE_GRADIENT_STOPS = [
  { offset: "0%", color: "#7DFF00" },
  { offset: "49%", color: "#B2FF00" },
  { offset: "100%", color: "#C8FF00" },
];

/** Hollow outlined text with a lime linear-gradient stroke (Figma: 1px outside). */
function GradientStrokeText({ children, className = "", strokeWidth = 1, ...rest }) {
  const gradId = useId().replace(/:/g, "");
  return (
    <span className={`inline-block leading-[1.1] ${className}`} {...rest}>
      <svg
        className="block h-[1.1em] w-auto max-w-none overflow-visible"
        aria-hidden
      >
        <defs>
          <linearGradient id={`fw-stroke-${gradId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            {STROKE_GRADIENT_STOPS.map((s) => (
              <stop key={s.offset} offset={s.offset} stopColor={s.color} />
            ))}
          </linearGradient>
        </defs>
        <text
          fill="none"
          stroke={`url(#fw-stroke-${gradId})`}
          strokeWidth={strokeWidth}
          x="0"
          y="1em"
          fontSize="1em"
          fontFamily="var(--font-poppins), ui-sans-serif, system-ui, sans-serif"
          fontWeight="500"
          letterSpacing="0"
        >
          {children}
        </text>
      </svg>
    </span>
  );
}

const INTRO_COPY =
  "Every successful project follows a structured process designed to eliminate uncertainty, maintain transparency, and ensure scalable outcomes. From initial discovery to post-launch support, each phase is carefully planned to keep stakeholders aligned and progress measurable.";

const STEPS = [
  {
    n: "01",
    title: "Forensic Discovery",
    desc: "We begin by understanding your business objectives, user needs, technical requirements, and project constraints. This phase establishes a clear roadmap and removes ambiguity before development begins.",
    image: "/images/framework/step-01.png",
  },
  {
    n: "02",
    title: "Architectural Planning",
    desc: "Our team defines the system architecture, technology stack, timelines, and implementation strategy, ensuring every technical decision supports long-term scalability and performance.",
    image: "/images/framework/step-02.png",
  },
  {
    n: "03",
    title: "Prototype Engineering",
    desc: "Interactive prototypes and user journeys are created to validate ideas, gather feedback, and refine the experience before investing in full-scale development.",
    image: "/images/framework/step-03.png",
  },
  {
    n: "04",
    title: "Agile Sprint Development",
    desc: "The solution is built through iterative development cycles, delivering continuous progress, regular demonstrations, and complete visibility throughout the project.",
    image: "/images/framework/step-04.png",
  },
  {
    n: "05",
    title: "Stress Testing & QA",
    desc: "Every feature undergoes comprehensive testing across devices, browsers, and real-world scenarios to ensure reliability, security, and performance.",
    image: "/images/framework/step-05.png",
  },
  {
    n: "06",
    title: "Enterprise Deployment",
    desc: "We manage deployment, infrastructure configuration, security, monitoring, and go-live execution to ensure a seamless launch with minimal risk.",
    image: "/images/framework/step-06.png",
  },
  {
    n: "07",
    title: "Evolutionary Support",
    desc: "After launch, we continue to monitor, optimize, scale, and enhance your platform, ensuring it evolves alongside your business needs.",
    image: "/images/framework/step-07.png",
  },
];

function StepCard({ step, cardRef }) {
  return (
    <li
      ref={cardRef}
      className="flex w-[clamp(260px,24vw,360px)] shrink-0 snap-center flex-col"
    >
      <div className="relative h-[clamp(260px,45vh,400px)] w-full overflow-hidden rounded-sm bg-neutral-900">
        <Image
          src={step.image}
          alt=""
          fill
          className="object-cover object-center grayscale"
          sizes="(max-width: 768px) 80vw, 360px"
        />
        <span className="absolute bottom-3 left-3 font-sans text-[clamp(4.5rem,7vw,6rem)] font-medium leading-[1.1] tracking-normal">
          <GradientStrokeText strokeWidth={1}>{step.n}</GradientStrokeText>
        </span>
      </div>
      <h3 className="mt-4 text-[clamp(1.05rem,1.4vw,1.35rem)] font-medium leading-[1.5] tracking-normal" style={{
              backgroundImage: HEADING_GRADIENT,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}>
        <span className="sr-only font-heading">{step.title} </span>
          {step.title}
      </h3>
      <p className="mt-2 text-[clamp(0.72rem,0.85vw,0.875rem)] leading-[1.5] text-white/55">
        {step.desc}
      </p>
    </li>
  );
}

export default function DeliveryFrameworkSection() {
  const wrapperRef = useRef(null);
  const panelRef = useRef(null);
  const binaryRef = useRef(null);
  const headingRef = useRef(null);
  const paraRef = useRef(null);
  const railViewportRef = useRef(null);
  const railRef = useRef(null);
  const progressWrapRef = useRef(null);
  const progressFillRef = useRef(null);
  const cardRefs = useRef([]);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const panel = panelRef.current;
    const binary = binaryRef.current;
    const heading = headingRef.current;
    const para = paraRef.current;
    const railViewport = railViewportRef.current;
    const rail = railRef.current;
    const progressWrap = progressWrapRef.current;
    const progressFill = progressFillRef.current;
    const cards = cardRefs.current.filter(Boolean);

    if (!wrapper || !panel || !heading || !para || !rail || !railViewport || !progressFill)
      return undefined;

    const mm = gsap.matchMedia();

    /* Desktop: pinned scrub — seam in, header, cards, horizontal scrub, exit. */
    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        gsap.set(panel, { autoAlpha: 0 });
        gsap.set(binary, { autoAlpha: 0 });
        gsap.set(heading, { autoAlpha: 0, x: -60, filter: "blur(10px)" });
        gsap.set(para, { autoAlpha: 0, x: 40 });
        gsap.set([railViewport, progressWrap], { autoAlpha: 0, y: 40 });
        gsap.set(rail, { x: 0, force3D: true });
        gsap.set(progressFill, { scaleX: 0, transformOrigin: "left center" });

        const railMoveDistance = () => {
          const pad = 48;
          return Math.max(0, rail.scrollWidth - railViewport.clientWidth + pad);
        };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.35,
            invalidateOnRefresh: true,
          },
        });

        /* Phase 0 — gray surface + binary crossfade in after Tools reveal + hold
           (Delivery -mt is shallow so slide-over aligns with Tools exit). */
        const SEAM = 0.08;
        tl.to(
          [panel, binary],
          { autoAlpha: 1, ease: "power1.out", duration: 0.12 },
          SEAM,
        );

        /* Phase 1 — heading + intro paragraph. */
        tl.to(
          heading,
          {
            autoAlpha: 1,
            x: 0,
            filter: "blur(0px)",
            ease: "power2.out",
            duration: 0.14,
          },
          SEAM + 0.12,
        );
        tl.to(
          para,
          { autoAlpha: 1, x: 0, ease: "power2.out", duration: 0.14 },
          SEAM + 0.14,
        );

        /* Phase 2 — card rail + progress track reveal. */
        tl.to(
          [railViewport, progressWrap],
          { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.1 },
          SEAM + 0.24,
        );

        /* Phase 3 — horizontal scrub + progress fill. */
        const HORIZ_START = SEAM + 0.34;
        const HORIZ_DUR = 0.52;

        tl.fromTo(
          rail,
          { x: 0 },
          {
            x: () => -railMoveDistance(),
            ease: "none",
            duration: HORIZ_DUR,
            force3D: true,
          },
          HORIZ_START,
        );
        tl.fromTo(
          progressFill,
          { scaleX: 0 },
          { scaleX: 1, ease: "none", duration: HORIZ_DUR },
          HORIZ_START,
        );

        /* Phase 4 — content exits, then gray wrapper fades to reveal Global black
           behind (Hero→Intro / Capabilities→Tools pattern; Delivery z-30 on top). */
        const EXIT = 0.84;
        tl.to(
          [heading, para],
          {
            y: -80,
            autoAlpha: 0,
            ease: "power2.in",
            duration: 0.1,
            stagger: 0.03,
            force3D: true,
          },
          EXIT,
        );
        tl.to(
          [railViewport, progressWrap],
          {
            y: 30,
            autoAlpha: 0,
            ease: "power2.in",
            duration: 0.1,
            force3D: true,
          },
          EXIT + 0.02,
        );
        tl.to(
          [panel, binary],
          { autoAlpha: 0, ease: "power1.inOut", duration: 0.08 },
          EXIT + 0.08,
        );
        tl.to(
          wrapper,
          { autoAlpha: 0, ease: "power1.inOut", duration: 0.12 },
          EXIT + 0.1,
        );
      },
    );

    /* Mobile — one-shot entrance, native horizontal scroll. */
    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.set([panel, binary], { autoAlpha: 1 });
      gsap.set([heading, para, railViewport, progressWrap], { autoAlpha: 0, y: 24 });
      gsap.set(rail, { x: 0 });
      gsap.set(progressFill, { scaleX: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top 85%",
          once: true,
        },
      });
      tl.to(heading, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" })
        .to(para, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" }, "<0.08")
        .to(
          [railViewport, progressWrap],
          { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" },
          "<0.1",
        )
        .from(
          cards,
          { autoAlpha: 0, y: 20, duration: 0.4, ease: "power2.out", stagger: 0.06 },
          "<0.05",
        );
    });

    /* Reduced motion — static, legible. */
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set([panel, binary, heading, para, railViewport, progressWrap], {
        autoAlpha: 1,
        y: 0,
        x: 0,
        filter: "blur(0px)",
      });
      gsap.set(rail, { x: 0 });
      gsap.set(progressFill, { scaleX: 1 });
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
    <section
      ref={wrapperRef}
      className="relative z-30 bg-[#0C0C0C] md:-mt-[32vh] md:h-[520vh]"
      aria-labelledby="framework-heading"
    >
      <div
        ref={panelRef}
        className="relative flex min-h-screen flex-col overflow-hidden px-(--gutter) py-[clamp(3rem,8vh,5rem)] md:sticky md:top-(--header-offset) md:h-(--viewport-below-header) md:min-h-(--viewport-below-header) md:py-[clamp(1.25rem,3vh,2rem)]"
      >
        {/* Binary pattern — faint, behind header area (matches Figma) */}
        <div
          ref={binaryRef}
          className="pointer-events-none absolute inset-x-0 top-[-10%] z-0 mx-auto hidden h-[clamp(200px,60vh,480px)] w-[min(100vw,900px)] opacity-50 md:block"
          aria-hidden
        >
          <Image
            src="/images/binary.png"
            alt=""
            fill
            className="object-contain object-center"
            sizes="90vw"
          />
        </div>

        {/* Top row — heading + intro */}
        <div className="relative z-10 w-full shrink-0 top-4  gap-6 flex md:justify-between">
          <h2
            ref={headingRef}
            id="framework-heading"
            className="font-heading text-[clamp(2rem,4.5vw,4rem)] font-normal leading-[1.04] tracking-[-0.02em] will-change-[opacity,transform,filter]"
            style={{
              backgroundImage: HEADING_GRADIENT,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Our Delivery
            <br />
            Framework
          </h2>
          <p
            ref={paraRef}
            className="max-w-[52ch] text-[clamp(0.8rem,0.95vw,0.9375rem)] font-normal leading-[1.55] text-white/70 will-change-[opacity,transform]"
          >
            {INTRO_COPY}
          </p>
        </div>

        {/* Card rail viewport — horizontal scroll driven by GSAP on desktop */}
        <div
          ref={railViewportRef}
          className="relative z-10 mt-[clamp(4rem,6vh,3.5rem)] min-h-0 flex-1 overflow-hidden will-change-[opacity,transform] md:-mr-(--gutter) md:pr-0"
        >
          <ol
            ref={railRef}
            className="flex w-max list-none gap-[clamp(1rem,2vw,1.75rem)] p-0 md:gap-[clamp(1.25rem,2.2vw,2rem)] md:overflow-x-visible md:pl-0 md:pr-[max(2rem,8vw)] max-md:snap-x max-md:snap-mandatory max-md:overflow-x-auto max-md:pb-4 max-md:scrollbar-thin"
          >
            {STEPS.map((step, i) => (
              <StepCard
                key={step.n}
                step={step}
                cardRef={(el) => {
                  cardRefs.current[i] = el;
                }}
              />
            ))}
          </ol>
        </div>

        {/* Progress track — scroll-driven fill on desktop */}
        <div
          ref={progressWrapRef}
          className="relative z-10 mt-[clamp(1.25rem,3vh,2rem)] shrink-0 will-change-[opacity,transform]"
        >
          <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/15">
            <div
              ref={progressFillRef}
              className="h-full w-full origin-left bg-(--hero-accent) will-change-transform"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
