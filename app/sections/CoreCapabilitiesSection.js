"use client";

import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

const CAPABILITIES = [
  {
    title: "Enterprise Platform Engineering",
    desc: "Custom enterprise platforms, ERP systems, CRMs, customer portals, and scalable SaaS applications engineered for long-term growth.",
    image: "/images/capabilities/cap-enterprise.png",
  },
  {
    title: "AI & Automation Engineering",
    desc: "LLM integrations, conversational AI, AI-powered workflows, RAG systems, and intelligent automation pipelines built for production environments.",
    image: "/images/capabilities/cap-ai-automation.png",
  },
  {
    title: "Mobile App Development",
    desc: "Cross-platform and native mobile applications for iOS and Android with seamless backend integration and scalable architecture.",
    image: "/images/capabilities/cap-mobile.png",
  },
  {
    title: "UI/UX & Creative Engineering",
    desc: "Conversion-focused interfaces, interactive prototypes, motion design, branding systems, and immersive digital experiences.",
    image: "/images/capabilities/cap-uiux.png",
  },
  {
    title: "Cloud Infrastructure & Reliability",
    desc: "AWS, Azure, Kubernetes, CI/CD pipelines, deployment automation, and scalable infrastructure built for enterprise-grade performance.",
    image: "/images/capabilities/cap-cloud.png",
  },
  {
    title: "Data Science & Business Intelligence",
    desc: "Predictive analytics, machine learning systems, live operational dashboards, and data-driven business intelligence solutions.",
    image: "/images/capabilities/cap-data-science.png",
  },
];

const HEADING_GRADIENT =
  "linear-gradient(105deg, #7DFF00 0%, #B2FF00 49%, #C8FF00 100%)";

export default function CoreCapabilitiesSection() {
  const wrapperRef = useRef(null);
  const panelRef = useRef(null);
  const headingRef = useRef(null);
  const buttonRef = useRef(null);
  const patternRef = useRef(null);
  const imageWrapRef = useRef(null);
  const cardParallaxRef = useRef(null);
  const rowRefs = useRef([]);

  const [scrollIndex, setScrollIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState(null);
  const activeIndex = hoverIndex ?? scrollIndex;

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const panel = panelRef.current;
    const heading = headingRef.current;
    const button = buttonRef.current;
    const pattern = patternRef.current;
    const imageWrap = imageWrapRef.current;
    const rows = rowRefs.current.filter(Boolean);
    if (!wrapper || !panel || !heading || !button || rows.length === 0) return undefined;

    const N = CAPABILITIES.length;
    const CYCLE_START = 0.24;
    const CYCLE_END = 0.72;

    const mm = gsap.matchMedia();

    /* Desktop: sticky pin while a scrubbed timeline cycles the active capability,
       then flies the rows out and lifts the heading/button away on exit. */
    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        /* Entrance parallax — while the section rises from the viewport bottom
           into its pin, the deep binary pattern and the floating card drift at a
           slower depth rate than the normally-scrolling heading/rows. Separate
           scroll range from the main timeline (which starts at "top top"), so the
           yPercent here never collides with the exit's autoAlpha fade. */
        const card = cardParallaxRef.current;
        if (pattern || card) {
          const parallax = gsap.timeline({
            scrollTrigger: {
              trigger: wrapper,
              start: "top bottom",
              end: "top top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
          if (pattern) {
            parallax.fromTo(pattern, { yPercent: 22 }, { yPercent: -12, ease: "none" }, 0);
          }
          if (card) {
            parallax.fromTo(card, { yPercent: 12 }, { yPercent: -4, ease: "none" }, 0);
          }
        }

        /* Phase 0 — gray panel crossfades in over pinned Intro (seam matches Delivery). */
        gsap.set(panel, { autoAlpha: 0 });
        gsap.set(heading, { autoAlpha: 0, x: -50, filter: "blur(10px)" });
        gsap.set(button, { autoAlpha: 0, y: 20 });
        gsap.set(rows, { autoAlpha: 0, y: 24 });
        gsap.set([pattern, imageWrap].filter(Boolean), { autoAlpha: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.4,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (self.progress < CYCLE_START) return;
              const cp = Math.min(
                1,
                (self.progress - CYCLE_START) / (CYCLE_END - CYCLE_START),
              );
              const idx = Math.min(N - 1, Math.floor(cp * N));
              setScrollIndex((prev) => (prev !== idx ? idx : prev));
            },
          },
        });

        tl.to(panel, { autoAlpha: 1, ease: "power1.out", duration: 0.12 }, 0);
        tl.to(
          heading,
          {
            autoAlpha: 1,
            x: 0,
            filter: "blur(0px)",
            ease: "power2.out",
            duration: 0.14,
          },
          0.12,
        );
        tl.to(button, { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.12 }, 0.14);
        tl.to(
          rows,
          { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.14, stagger: 0.02 },
          0.16,
        );
        tl.to(
          [pattern, imageWrap].filter(Boolean),
          { autoAlpha: 1, ease: "power2.out", duration: 0.12 },
          0.18,
        );

        /* Exit (compact, at the very end of travel): the content stays on screen
           until close to the seam, then rows fly out alternately L/R, heading +
           button lift away, pattern + image fade — so the section never sits
           empty-and-black before Tools below pins. */
        const EXIT_AT = 0.78;

        rows.forEach((row, i) => {
          tl.to(
            row,
            {
              x: i % 2 === 0 ? () => window.innerWidth * 0.7 : () => -window.innerWidth * 0.7,
              autoAlpha: 0,
              ease: "power2.in",
              duration: 0.16,
              force3D: true,
            },
            EXIT_AT + i * 0.018,
          );
        });

        tl.to(
          [heading, button],
          {
            y: -90,
            autoAlpha: 0,
            ease: "power2.in",
            duration: 0.18,
            stagger: 0.04,
            force3D: true,
          },
          EXIT_AT + 0.04,
        );

        tl.to(
          [pattern, imageWrap],
          {
            autoAlpha: 0,
            ease: "none",
            duration: 0.2,
          },
          EXIT_AT,
        );

        /* Once the content has flown out, fade the whole gray section away to
           reveal the Tools section pinned behind it (Tools sits one z-layer
           below with -mt-[100vh], same reveal pattern as Hero→Intro). The gray
           dissolving to Tools' black is the seam — no empty hold, and Tools'
           scan/chips are already streaming in underneath as it clears. */
        tl.to(
          wrapper,
          { autoAlpha: 0, ease: "power1.inOut", duration: 0.12 },
          EXIT_AT + 0.1,
        );
      },
    );

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
      className="relative z-20 bg-[#0C0C0C] md:-mt-[100vh] md:h-[400vh]"
      aria-labelledby="capabilities-heading"
    >
      <div
        ref={panelRef}
        className="relative overflow-hidden px-(--gutter) py-[clamp(3rem,8vh,5rem)] md:sticky md:top-(--header-offset) md:flex md:h-(--viewport-below-header) md:min-h-(--viewport-below-header) md:items-center md:py-[clamp(1.25rem,3vh,2rem)]"
      >
        {/* Binary pattern — bottom-left corner, behind content */}
        <div
          ref={patternRef}
          className="pointer-events-none absolute -bottom-[1%] left-0 z-0 hidden h-[clamp(360px,76vh,920px)] w-[clamp(520px,68vw,1080px)] opacity-50 md:block"
          aria-hidden
        >
          <Image
            src="/images/binary.png"
            alt=""
            fill
            className="object-contain object-left-bottom"
            sizes="68vw"
          />
        </div>

        {/* Floating per-capability preview — absolute glass card, cross-fades with the active row.
            Outer wrapper owns positioning + the entrance parallax transform; inner keeps the
            centering + cap-float so they don't collide. */}
        <div
          ref={cardParallaxRef}
          className="pointer-events-none absolute left-(--gutter) left-1/9 top-[65%] z-10 hidden w-[min(46vw,560px)] md:block"
          aria-hidden
        >
        <div
          ref={imageWrapRef}
          className="aspect-[4/3] -translate-y-1/2 cap-float"
        >
          <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] shadow-[0_20px_60px_rgba(0,0,0,0.45),0_0_50px_rgba(204,255,0,0.15)] backdrop-blur-xl">
            <div className="relative h-full w-full overflow-hidden rounded-xl">
              {CAPABILITIES.map((cap, i) => (
                <Image
                  key={cap.image}
                  src={cap.image}
                  alt=""
                  fill
                  sizes="28vw"
                  className="object-cover transition-all duration-500 ease-out"
                  style={{
                    opacity: activeIndex === i ? 1 : 0,
                    transform: activeIndex === i ? "scale(1)" : "scale(0.94)",
                    filter: activeIndex === i ? "blur(0px)" : "blur(8px)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        </div>

        <div className="relative z-10 grid w-full grid-cols-1 gap-[clamp(2rem,5vh,3rem)] md:h-full md:max-h-full md:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] md:items-stretch md:gap-[clamp(2rem,4vw,3.5rem)]">
          {/* LEFT — heading + button (anchored top); preview image floats absolutely above */}
          <div className="relative flex min-h-0 flex-col justify-start md:pt-[clamp(0.5rem,4vh,2.5rem)]">
            <h2
              ref={headingRef}
              id="capabilities-heading"
              className="font-heading text-[clamp(2.25rem,4.8vw,4.25rem)] font-normal leading-[1.04] tracking-[-0.02em] will-change-[opacity,transform]"
              style={{
                backgroundImage: HEADING_GRADIENT,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Our Core
              <br />
              Capabilities
            </h2>

            <div ref={buttonRef} className="mt-[clamp(1rem,2vw,1.75rem)] will-change-[opacity,transform]">
              <Link href="/contact" className="header-cta">
                <span>Let&apos;s Talk</span>
                <Image
                  src="/images/logo-black.png"
                  alt=""
                  width={22}
                  height={22}
                  className="h-[1.2em] w-auto object-contain"
                  aria-hidden
                />
              </Link>
            </div>
          </div>

          {/* RIGHT — capability rows */}
          <ul className="m-0 flex min-h-0 list-none mt-12 flex-col justify-between gap-y-2 p-0 md:max-h-[min(72vh,calc(var(--viewport-below-header)-2rem))] md:gap-y-0">
            {CAPABILITIES.map((cap, i) => {
              const active = activeIndex === i;
              return (
                <li
                  key={cap.title}
                  ref={(el) => {
                    rowRefs.current[i] = el;
                  }}
                  className="will-change-[opacity,transform]"
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  <div
                    className={`group relative grid grid-cols-1 gap-1 border-t px-[clamp(0.75rem,1.4vw,1.5rem)] py-[clamp(0.65rem,1.35vh,1.15rem)] transition-colors duration-300 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-[clamp(0.75rem,2vw,2rem)] ${
                      active
                        ? "border-white/25 bg-white/[0.05]"
                        : "border-white/10 bg-transparent"
                    }`}
                  >
                    {/* Active accent bar */}
                    <span
                      className="absolute left-0 top-0 h-full w-[2px] origin-top bg-(--hero-accent) transition-transform duration-300"
                      style={{ transform: active ? "scaleY(1)" : "scaleY(0)" }}
                      aria-hidden
                    />
                    <h3
                      className={`text-[clamp(0.95rem,1.35vw,1.35rem)] font-semibold leading-[1.15] tracking-[-0.01em] transition-colors duration-300 ${
                        active ? "text-white" : "text-white/85"
                      }`}
                    >
                      {cap.title}
                    </h3>
                    <p
                      className={`max-w-[42ch] text-[clamp(0.72rem,0.82vw,0.875rem)] font-normal leading-[1.45] transition-colors duration-300 ${
                        active ? "text-white/75" : "text-white/40"
                      }`}
                    >
                      {cap.desc}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
