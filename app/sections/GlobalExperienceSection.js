"use client";

import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

const HEADING_GRADIENT =
  "linear-gradient(105deg, #7DFF00 0%, #B2FF00 49%, #C8FF00 100%)";

const INTRO_COPY =
  "We have delivered enterprise platforms, AI solutions, and digital products for clients across the United States, Canada, Australia, Germany, the UAE, Saudi Arabia, the Netherlands, and Pakistan—bringing global expertise and proven execution to every project.";

/** Map asset: 1244×698 (≈16:9). x/y are % of the (aspect-locked) image box, so they
 *  map 1:1 to image features at every screen size. */
const MAP_ASPECT = 1244 / 698;

/** Marker positions for the perspective globe in world-map.png.
 *  x/y are % of the aspect-locked image box, so they stay aligned at every size. */
const LOCATIONS = [
  { name: "Canada", x: 26.6, y: 28.0 },
  { name: "United States", x: 28.5, y: 42.4 },
  { name: "UAE", x: 60.9, y: 33.7 },
  { name: "Pakistan", x: 66.7, y: 31.5 },
  { name: "Australia", x: 84.8, y: 46.9 },
];

function MapMarker({ location, markerRef, peek = false }) {
  return (
    <button
      ref={markerRef}
      type="button"
      aria-label={location.name}
      className="group absolute z-10 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-(--hero-accent) focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      style={{ left: `${location.x}%`, top: `${location.y}%` }}
    >
      {/* Lime pulse ring */}
      <span
        className="globe-ping pointer-events-none absolute inset-0 rounded-full border border-(--hero-accent)/70"
        aria-hidden
      />
      {/* White outer ring + center dot */}
      <span
        className={`relative flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-white/10 shadow-[0_0_12px_rgba(255,255,255,0.35)] transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110 ${
          peek ? "scale-110" : ""
        }`}
        aria-hidden
      >
        <span className="h-2 w-2 rounded-full bg-white" />
      </span>
      {/* Country tooltip — shows on hover/focus, and auto-peeks when markers reveal */}
      <span
        role="tooltip"
        className={`pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#121212] shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-0.5 group-focus-visible:opacity-100 group-focus-visible:-translate-y-0.5 ${
          peek ? "opacity-100 -translate-y-0.5" : "opacity-0"
        }`}
      >
        {location.name}
        <span
          className="absolute left-1/2 top-full -translate-x-1/2 border-x-[6px] border-t-[6px] border-x-transparent border-t-white"
          aria-hidden
        />
      </span>
    </button>
  );
}

export default function GlobalExperienceSection() {
  const wrapperRef = useRef(null);
  const panelRef = useRef(null);
  const headingRef = useRef(null);
  const paraRef = useRef(null);
  const mapRef = useRef(null);
  const markerRefs = useRef([]);

  /* Tooltips auto-"peek" for a couple seconds when the markers reveal. */
  const [peekTips, setPeekTips] = useState(false);
  const peekTimerRef = useRef(0);
  const peekedRef = useRef(false);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const panel = panelRef.current;
    const heading = headingRef.current;
    const para = paraRef.current;
    const map = mapRef.current;
    const markers = markerRefs.current.filter(Boolean);

    if (!wrapper || !panel || !heading || !para || !map) return undefined;

    /* Show every tooltip briefly, then hide. Re-armable across re-reveals. */
    const triggerPeek = () => {
      setPeekTips(true);
      if (peekTimerRef.current) clearTimeout(peekTimerRef.current);
      peekTimerRef.current = window.setTimeout(() => setPeekTips(false), 2600);
    };

    const mm = gsap.matchMedia();

    /* Desktop: pinned hold — seam in, header, map + markers, dwell, exit. */
    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        /* Black panel stays visible behind Delivery (z-20); content reveals after
           Delivery's gray wrapper has faded away (mirrors Tools REVEAL pattern). */
        gsap.set(panel, { autoAlpha: 1 });
        gsap.set(heading, { autoAlpha: 0, x: -60, filter: "blur(10px)" });
        gsap.set(para, { autoAlpha: 0, x: 40 });
        gsap.set(map, { autoAlpha: 0, scale: 0.96 });
        gsap.set(markers, { autoAlpha: 0, scale: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.35,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              /* Once the markers have popped in (and before they exit), peek the
                 tooltips. Re-arm when scrolled back above the reveal point. */
              if (self.progress > 0.56 && self.progress < 0.84) {
                if (!peekedRef.current) {
                  peekedRef.current = true;
                  triggerPeek();
                }
              } else if (self.progress < 0.4) {
                peekedRef.current = false;
              }
            },
          },
        });

        const REVEAL = 0.42;

        /* Phase 1 — heading + intro paragraph (after Delivery fade). */
        tl.to(
          heading,
          {
            autoAlpha: 1,
            x: 0,
            filter: "blur(0px)",
            ease: "power2.out",
            duration: 0.12,
          },
          REVEAL,
        );
        tl.to(
          para,
          { autoAlpha: 1, x: 0, ease: "power2.out", duration: 0.12 },
          REVEAL + 0.02,
        );

        /* Phase 2 — map + markers pop in. */
        tl.to(
          map,
          { autoAlpha: 1, scale: 1, ease: "power2.out", duration: 0.14 },
          REVEAL + 0.08,
        );
        tl.to(
          markers,
          {
            autoAlpha: 1,
            scale: 1,
            ease: "back.out(2)",
            duration: 0.12,
            stagger: 0.04,
            force3D: true,
          },
          REVEAL + 0.1,
        );

        /* Hold REVEAL+0.22 → 0.85 — timeline idle; markers interactive via CSS. */

        /* Phase 4 — exit into Contact. */
        const EXIT = 0.85;
        tl.to(
          [heading, para],
          {
            y: -80,
            autoAlpha: 0,
            ease: "power2.in",
            duration: 0.12,
            stagger: 0.03,
            force3D: true,
          },
          EXIT,
        );
        tl.to(
          map,
          {
            autoAlpha: 0,
            scale: 1.03,
            ease: "power2.in",
            duration: 0.12,
            force3D: true,
          },
          EXIT,
        );
        tl.to(
          markers,
          {
            autoAlpha: 0,
            scale: 0.8,
            ease: "power2.in",
            duration: 0.1,
            stagger: 0.02,
          },
          EXIT,
        );
        tl.to(
          panel,
          { autoAlpha: 0, ease: "power1.inOut", duration: 0.1 },
          EXIT + 0.06,
        );
      },
    );

    /* Mobile — one-shot entrance, native interaction on markers. */
    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.set(panel, { autoAlpha: 1 });
      gsap.set([heading, para, map], { autoAlpha: 0, y: 24 });
      gsap.set(markers, { autoAlpha: 0, scale: 0.6 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top 85%",
          once: true,
        },
      });
      tl.to(heading, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" })
        .to(para, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" }, "<0.08")
        .to(map, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, "<0.1")
        .to(
          markers,
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.4,
            ease: "back.out(2)",
            stagger: 0.05,
            onComplete: triggerPeek,
          },
          "<0.05",
        );
    });

    /* Reduced motion — static, legible. */
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set([panel, heading, para, map, ...markers], {
        autoAlpha: 1,
        x: 0,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      });
    });

    const refresh = () => ScrollTrigger.refresh();
    requestAnimationFrame(refresh);
    window.addEventListener("load", refresh);
    window.addEventListener("resize", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", refresh);
      if (peekTimerRef.current) clearTimeout(peekTimerRef.current);
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={wrapperRef}
      className="relative z-20 bg-black md:-mt-[250vh] md:h-[460vh]"
      aria-labelledby="global-experience-heading"
    >
      <div
        ref={panelRef}
        className="relative flex min-h-screen flex-col overflow-hidden bg-black py-[clamp(3rem,8vh,5rem)] md:sticky md:top-(--header-offset) md:h-(--viewport-below-header) md:min-h-(--viewport-below-header) md:py-[clamp(1.25rem,3vh,2rem)]"
      >
        {/* Top row — heading + intro (gutter padding only here) */}
        <div className="relative z-20 flex w-full shrink-0 flex-col mt-8 gap-6 px-(--gutter) md:flex-row md:items-start md:justify-between md:gap-[clamp(2rem,4vw,4rem)]">
          <h2
            ref={headingRef}
            id="global-experience-heading"
            className="font-heading text-[clamp(2rem,4.5vw,4rem)] font-normal leading-[1.04] tracking-[-0.02em] will-change-[opacity,transform,filter]"
            style={{
              backgroundImage: HEADING_GRADIENT,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Global
            <br />
            Experience
          </h2>
          <p
            ref={paraRef}
            className="max-w-[52ch] text-[clamp(0.8rem,0.95vw,0.9375rem)] font-normal leading-[1.55] text-white/70 will-change-[opacity,transform]"
          >
            {INTRO_COPY}
          </p>
        </div>

        {/* World map + markers — full viewport width, full image visible (1244×698) */}
        <div
          ref={mapRef}
          className="relative z-10 flex min-h-0 w-screen mt-24 top-24 max-w-[100vw] flex-1 flex-col justify-end will-change-[opacity,transform]"
        >
          <div
            className="relative mx-auto"
            style={{
              aspectRatio: MAP_ASPECT,
              // Always the image's exact aspect ratio, never wider than the column
              // nor taller than the available height — so object-cover never
              // letterboxes and the % markers stay locked to the image at every size.
              width: "min(100%, calc((var(--viewport-below-header) - 1rem) * 1244 / 698))",
            }}
          >
            <Image
              src="/images/world-map.png"
              alt=""
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority={false}
            />
            {/* Light top fade so heading stays readable over the image's upper black band */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[22%] bg-linear-to-b from-black/90 via-black/40 to-transparent"
              aria-hidden
            />
            {LOCATIONS.map((loc, i) => (
              <MapMarker
                key={loc.name}
                location={loc}
                peek={peekTips}
                markerRef={(el) => {
                  markerRefs.current[i] = el;
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
