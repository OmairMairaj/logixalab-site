"use client";

import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const HEADING_GRADIENT =
  "linear-gradient(105deg, #7DFF00 0%, #B2FF00 49%, #C8FF00 100%)";

/* Single edit point for the icon set. Drop matching PNGs (≈500×500, transparent
   background) into public/images/tools/ and add/rename entries here. */
const TOOLS = [
  { name: "Next.js", src: "/images/tools/nextjs.png" },
  { name: "ChatGPT", src: "/images/tools/chatgpt.png" },
  { name: "Claude", src: "/images/tools/claude.png" },
  { name: "Gemini", src: "/images/tools/gemini.png" },
  { name: "Python", src: "/images/tools/python.png" },
  { name: "Cursor", src: "/images/tools/cursor.png" },
  { name: "Seedance", src: "/images/tools/seedance.png" },
];

const DEFAULT_CHIP_FILTER = "grayscale(1) brightness(0.85)";

/* Repeat the set until it comfortably overflows a viewport, then the rendered
   list duplicates it once more so the -50% loop stays seamless with no gap. */
const MIN_CHIPS = 12;
let base = TOOLS;
while (base.length > 0 && base.length < MIN_CHIPS) base = base.concat(TOOLS);
const LOOP = base.concat(base);

export default function ToolsSection() {
  const wrapperRef = useRef(null);
  const panelRef = useRef(null);
  const headingRef = useRef(null);
  const dividerRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const glowTopRef = useRef(null);
  const glowBottomRef = useRef(null);
  const scanBeamRef = useRef(null);
  const chipRefs = useRef([]);

  const marqueeRef = useRef(null);
  const rafRef = useRef(0);
  const velTargetRef = useRef(1); // target marquee timeScale, eased back to 1 when idle
  const scanActiveRef = useRef(false);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    const chips = chipRefs.current.filter(Boolean);
    if (!wrapper || !track || chips.length === 0) return undefined;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Continuous marquee (all viewports). LOOP renders the set twice, so a -50%
       shift lands the second copy exactly where the first started = seamless. */
    marqueeRef.current = gsap.to(track, {
      xPercent: -50,
      repeat: -1,
      ease: "none",
      duration: reduce ? 70 : 36,
    });

    const mm = gsap.matchMedia();

    /* ---------- Desktop: pinned cinematic (entry → hold → exit) ---------- */
    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        const heading = headingRef.current;
        const divider = dividerRef.current;
        const viewport = viewportRef.current;
        const beam = scanBeamRef.current;
        const glows = [glowTopRef.current, glowBottomRef.current].filter(Boolean);

        /* Seed the entry "from" state so there's no flash. The section is black
           from the start — Capabilities dissolves its own gray to #0c0c0c on
           exit, so the seam is already seamless and the reveal is front-loaded
           (heading + chips arrive almost immediately). */
        gsap.set(heading, { autoAlpha: 0, x: -50, filter: "blur(10px)" });
        gsap.set(divider, { scaleY: 0, transformOrigin: "top center" });
        gsap.set(viewport, { autoAlpha: 0 });
        gsap.set(chips, { autoAlpha: 0, xPercent: 55 });
        gsap.set(glows, { autoAlpha: 0, scale: 0.9 });
        gsap.set(beam, { autoAlpha: 0, x: -240 });

        /* One pinned timeline. The section is pulled up under Capabilities
           (-mt-[100vh]) so its rise happens *behind* that section's exit — both
           black — leaving no empty pre-pin hold. The reveal then plays AT pin
           (panel stationary, top:0): scan bar sweeps left→right, then heading,
           divider and chips stream in. Hold, then exit. */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const v = self.getVelocity();
              velTargetRef.current = gsap.utils.clamp(-4, 6, 1 + v / 1400);
              scanActiveRef.current = self.progress > 0.63 && self.progress < 0.91;
            },
          },
        });

        /* The deep -mt overlap pins this section in its FINAL position while
           Capabilities (on top, z-20) is still exiting — so it can reveal
           in place with no slide-up. It stays fully hidden behind Capabilities
           through that section's fly-out + gray dissolve (~progress 0 → 0.44
           here), and only AFTER Capabilities has completely cleared does the
           scan beam sweep and stream the structure (heading, divider, chips,
           glows) into the already-positioned panel. */
        const REVEAL = 0.45;

        tl.to(glows, { autoAlpha: 1, scale: 1, ease: "power2.out", duration: 0.16 }, REVEAL);
        tl.to(viewport, { autoAlpha: 1, ease: "power1.out", duration: 0.14 }, REVEAL);
        tl.fromTo(
          beam,
          { x: () => -240, autoAlpha: 0.7 },
          {
            x: () => (panelRef.current?.offsetWidth ?? window.innerWidth) + 240,
            autoAlpha: 0.7,
            ease: "none",
            duration: 0.2,
          },
          REVEAL,
        );
        tl.to(
          heading,
          { autoAlpha: 1, x: 0, filter: "blur(0px)", ease: "power2.out", duration: 0.16 },
          REVEAL + 0.02,
        );
        tl.to(divider, { scaleY: 1, ease: "power2.out", duration: 0.16 }, REVEAL + 0.04);
        tl.to(
          chips,
          { autoAlpha: 1, xPercent: 0, ease: "power2.out", duration: 0.18, stagger: 0.015 },
          REVEAL + 0.05,
        );
        tl.to(beam, { autoAlpha: 0, duration: 0.05 }, REVEAL + 0.2);

        /* Hold (~0.65 → ~0.91): timeline idle — marquee + scan-zone run in rAF. */

        /* Exit (~0.94 → 1.0): fly out before Delivery rises in (Delivery -mt
           is tuned so its slide-over starts ~progress 0.9 on this wrapper). */
        const EXIT = 0.94;
        tl.to(
          [heading, divider],
          {
            y: -90,
            autoAlpha: 0,
            ease: "power2.in",
            duration: 0.2,
            stagger: 0.05,
            force3D: true,
          },
          EXIT,
        );
        tl.to(
          viewport,
          {
            autoAlpha: 0,
            x: () => window.innerWidth * 0.4,
            filter: "blur(12px)",
            ease: "power2.in",
            duration: 0.2,
            force3D: true,
          },
          EXIT,
        );
        tl.to(glows, { autoAlpha: 0, ease: "none", duration: 0.2 }, EXIT);

        /* rAF: ease the marquee timeScale toward the velocity target (back to 1
           when idle) and run the center scan-zone colorize. */
        const tick = () => {
          const mq = marqueeRef.current;
          if (mq) {
            const next = mq.timeScale() + (velTargetRef.current - mq.timeScale()) * 0.07;
            mq.timeScale(next);
          }
          velTargetRef.current += (1 - velTargetRef.current) * 0.05;

          if (scanActiveRef.current && viewport) {
            const vp = viewport.getBoundingClientRect();
            const centerX = vp.left + vp.width / 2;
            const reach = vp.width * 0.26;
            for (let i = 0; i < chips.length; i += 1) {
              const chip = chips[i];
              const r = chip.getBoundingClientRect();
              const d = Math.abs(r.left + r.width / 2 - centerX);
              const t = gsap.utils.clamp(0, 1, 1 - d / reach);
              chip.style.filter = `grayscale(${1 - t}) brightness(${0.85 + t * 0.45}) drop-shadow(0 0 ${t * 16}px rgba(204,255,0,${t * 0.5}))`;
              chip.style.transform = `scale(${1 + t * 0.12})`;
            }
          }
          rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);

        return () => {
          cancelAnimationFrame(rafRef.current);
          chips.forEach((chip) => {
            chip.style.filter = DEFAULT_CHIP_FILTER;
            chip.style.transform = "";
          });
        };
      },
    );

    /* ---------- Mobile: natural height, one-shot reveal, slow loop ---------- */
    mm.add("(max-width: 767px)", () => {
      const heading = headingRef.current;
      chips.forEach((chip) => {
        chip.style.filter = "none"; // no scan-zone on mobile → full colour
      });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: wrapper, start: "top 80%", once: true },
      });
      tl.from(heading, { autoAlpha: 0, y: 28, duration: 0.5, ease: "power2.out" }).from(
        chips,
        { autoAlpha: 0, y: 24, duration: 0.45, ease: "power2.out", stagger: 0.04 },
        "<0.05",
      );
    });

    /* ---------- Reduced motion: static + slow loop ---------- */
    mm.add("(prefers-reduced-motion: reduce)", () => {
      chips.forEach((chip) => {
        chip.style.filter = "none";
      });
    });

    const refresh = () => ScrollTrigger.refresh();
    requestAnimationFrame(refresh);
    window.addEventListener("load", refresh);
    window.addEventListener("resize", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", refresh);
      cancelAnimationFrame(rafRef.current);
      marqueeRef.current?.kill();
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={wrapperRef}
      className="relative z-10 bg-black md:-mt-[200vh] md:h-[420vh]"
      aria-labelledby="tools-heading"
    >
      <div
        ref={panelRef}
        className="relative overflow-hidden px-(--gutter) py-[clamp(3rem,9vh,5.5rem)] md:sticky md:top-0 md:flex md:h-screen md:items-center md:py-0"
      >
        {/* wide-blur glows — centred on the exact top + bottom edges of the panel */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-0 hidden h-[55vh] -translate-y-1/2 md:block"
          aria-hidden
        >
          <div ref={glowTopRef} className="relative h-full w-full opacity-65">
            <Image src="/images/wide-blur.png" alt="" fill className="object-contain object-center" sizes="100vw" />
          </div>
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 hidden h-[55vh] translate-y-1/2 md:block"
          aria-hidden
        >
          <div ref={glowBottomRef} className="relative h-full w-full opacity-65">
            <Image src="/images/wide-blur.png" alt="" fill className="object-contain object-center" sizes="100vw" />
          </div>
        </div>

        {/* Lime scan beam — sweeps across once on entry */}
        <div
          ref={scanBeamRef}
          className="pointer-events-none absolute inset-y-0 left-0 z-20 hidden w-[140px] md:block"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(204,255,0,0.35) 50%, transparent 100%)",
            filter: "blur(6px)",
          }}
          aria-hidden
        />

        {/* Content row: heading | divider | marquee */}
        <div className="relative z-10 flex w-full flex-col gap-8 md:flex-row md:items-center md:gap-[clamp(1.75rem,3vw,3.25rem)]">
          {/* Heading block */}
          <div ref={headingRef} className="shrink-0 will-change-[opacity,transform]">
            <p className="mb-3 flex items-center gap-2 font-sans text-[0.68rem] font-medium uppercase tracking-[0.32em] text-white/40">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-(--hero-accent)" aria-hidden />
              Tech Stack
            </p>
            <h2
              id="tools-heading"
              className="w-max font-heading text-[clamp(2rem,4.4vw,4rem)] font-normal leading-[1.05] tracking-[-0.02em] whitespace-nowrap"
              style={{
                backgroundImage: HEADING_GRADIENT,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Tools
              <br />
              We&apos;ve
              <br />
              Mastered
            </h2>
          </div>

          {/* Vertical divider */}
          <span
            ref={dividerRef}
            className="hidden w-px shrink-0 self-stretch bg-linear-to-b from-(--hero-accent)/70 via-white/20 to-transparent will-change-transform md:block"
            aria-hidden
          />

          {/* Marquee viewport — bleeds to the right edge */}
          <div
            ref={viewportRef}
            className="relative -mr-(--gutter) min-w-0 flex-1 overflow-hidden will-change-[opacity,transform]"
          >
            {/* faint centre scan-zone marker */}
            <div
              className="pointer-events-none absolute inset-y-0 left-1/2 z-0 hidden w-[150px] -translate-x-1/2 md:block"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(204,255,0,0.07) 45%, rgba(204,255,0,0.07) 55%, transparent)",
              }}
              aria-hidden
            />

            {/* right edge fade */}
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[clamp(2rem,6vw,5rem)] bg-linear-to-l from-(--section-canvas) to-transparent"
              aria-hidden
            />

            <div
              ref={trackRef}
              className="flex w-max items-center gap-[clamp(1.1rem,2.2vw,2.25rem)] py-6"
            >
              {LOOP.map((tool, i) => (
                <div
                  key={`${tool.name}-${i}`}
                  ref={(el) => {
                    chipRefs.current[i] = el;
                  }}
                  data-tool={tool.name}
                  title={tool.name}
                  className="flex h-[clamp(4.25rem,6.5vw,5.75rem)] w-[clamp(4.25rem,6.5vw,5.75rem)] shrink-0 items-center justify-center rounded-full border border-white/10 bg-linear-to-b from-white/[0.07] to-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm will-change-[filter,transform]"
                  style={{ filter: DEFAULT_CHIP_FILTER }}
                >
                  <Image
                    src={tool.src}
                    alt={tool.name}
                    width={64}
                    height={64}
                    className="h-[52%] w-[52%] object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
