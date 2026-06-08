"use client";

import Image from "next/image";
import { observeInView } from "@/app/lib/inView";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

/* Single edit point for the icon set. Each tool ships TWO PNGs in
   public/images/tools/: a brand-color one (`color`) and a white silhouette
   (`white`, usually the `-white` suffix). The chip shows white by default and
   crossfades to color on hover (desktop) / in the center scan-zone (touch).
   Tailwind is the only odd pair: tailwind.png = color, tailwind-css.png = white. */
const TOOLS = [
  { name: "Anthropic", color: "/images/tools/anthropic.png", white: "/images/tools/anthropic-white.png" },
  { name: "OpenAI", color: "/images/tools/open-ai.png", white: "/images/tools/open-ai-white.png" },
  { name: "Gemini", color: "/images/tools/gemini.png", white: "/images/tools/gemini-white.png" },
  { name: "Hugging Face", color: "/images/tools/hugging-face.png", white: "/images/tools/hugging-face-white.png" },
  { name: "PyTorch", color: "/images/tools/pytorch.png", white: "/images/tools/pytorch-white.png" },
  { name: "Seedance", color: "/images/tools/seedance.png", white: "/images/tools/seedance-white.png" },
  { name: "Python", color: "/images/tools/python.png", white: "/images/tools/python-white.png" },
  { name: "React", color: "/images/tools/react.png", white: "/images/tools/react-white.png" },
  { name: "Next.js", color: "/images/tools/nextjs.png", white: "/images/tools/nextjs-white.png" },
  { name: "Node.js", color: "/images/tools/node.png", white: "/images/tools/node-white.png" },
  { name: "TypeScript", color: "/images/tools/typescript.png", white: "/images/tools/typescript-white.png" },
  { name: "Swift", color: "/images/tools/swift.png", white: "/images/tools/swift-white.png" },
  { name: "GraphQL", color: "/images/tools/graphql.png", white: "/images/tools/graphql-white.png" },
  { name: "Tailwind CSS", color: "/images/tools/tailwind.png", white: "/images/tools/tailwind-css.png" },
  { name: "GSAP", color: "/images/tools/gsap.png", white: "/images/tools/gsap-white.png" },
  { name: "AWS", color: "/images/tools/aws.png", white: "/images/tools/aws-white.png" },
  { name: "Azure", color: "/images/tools/azure.png", white: "/images/tools/azure-white.png" },
  { name: "Vercel", color: "/images/tools/vercel.png", white: "/images/tools/vercel-white.png" },
  { name: "Docker", color: "/images/tools/docker.png", white: "/images/tools/docker-white.png" },
  { name: "Kubernetes", color: "/images/tools/kubernetes.png", white: "/images/tools/kubernetes-white.png" },
  { name: "Terraform", color: "/images/tools/terraform.png", white: "/images/tools/terraform-white.png" },
  { name: "PostgreSQL", color: "/images/tools/postgresql.png", white: "/images/tools/postgresql-white.png" },
  { name: "Redis", color: "/images/tools/redis.png", white: "/images/tools/redis-white.png" },
  { name: "Cursor", color: "/images/tools/cursor.png", white: "/images/tools/cursor-white.png" },
  { name: "Figma", color: "/images/tools/figma.png", white: "/images/tools/figma-white.png" },
];

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
  const hoverPausedRef = useRef(false); // marquee pauses while a chip is hovered

  /* Branded name tooltip. It's a single position:fixed element rendered at the
     panel level (NOT inside the overflow-hidden marquee viewport, which would
     clip it) and parked under the hovered chip by an rAF that tracks the chip's
     live rect — so it stays glued while the marquee eases to its paused stop and
     never clips at the rail edges. */
  const tooltipRef = useRef(null);
  const tipChipRef = useRef(null);
  const tipRafRef = useRef(0);

  const positionTip = () => {
    const chip = tipChipRef.current;
    const tip = tooltipRef.current;
    if (chip && tip) {
      const r = chip.getBoundingClientRect();
      tip.style.left = `${r.left + r.width / 2}px`;
      tip.style.top = `${r.bottom + 10}px`;
    }
    tipRafRef.current = requestAnimationFrame(positionTip);
  };

  const showTip = (name, chip) => {
    // Hover-driven only — touch has no hover and reveals color via the center zone.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const tip = tooltipRef.current;
    if (!tip) return;
    tip.textContent = name;
    tipChipRef.current = chip;
    cancelAnimationFrame(tipRafRef.current);
    positionTip();
    tip.classList.add("is-visible");
  };

  const hideTip = () => {
    cancelAnimationFrame(tipRafRef.current);
    tipChipRef.current = null;
    tooltipRef.current?.classList.remove("is-visible");
  };

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

    /* Pause the marquee + every per-frame loop in this section whenever it's
       scrolled out of view. Each gated rAF registers a restart fn here and bails
       (its raf id → 0) when offscreen; becoming visible re-kicks them. */
    const visibleRef = { current: true };
    const restartFns = new Set();
    const onVisibility = (v) => {
      if (v === visibleRef.current) return;
      visibleRef.current = v;
      if (v) {
        marqueeRef.current?.play();
        restartFns.forEach((fn) => fn());
      } else {
        marqueeRef.current?.pause();
      }
    };
    const stopObserve = observeInView(wrapper, onVisibility);

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

        /* Hold (~0.65 → ~0.91): timeline idle — marquee runs in rAF. */

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

        /* Pause the marquee while the pointer is over the rail so a chip can be
           hovered (a moving target is impossible to land on) — color reveal on
           the chip itself is pure CSS :hover. We reuse the velocity easing by
           steering the timeScale target to 0 while paused. Only wire this for
           real hover pointers: a touch tablet (≥768px) fires mouseenter on tap
           but may never fire mouseleave, which would strand the marquee paused. */
        const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        const onEnter = () => {
          hoverPausedRef.current = true;
        };
        const onLeave = () => {
          hoverPausedRef.current = false;
        };
        if (canHover) {
          viewport?.addEventListener("mouseenter", onEnter);
          viewport?.addEventListener("mouseleave", onLeave);
        }

        /* rAF: ease the marquee timeScale toward its target — 0 while hovered,
           otherwise the scroll-velocity value that decays back to 1 when idle.
           Bails (and stops rescheduling) while the section is offscreen. */
        const tick = () => {
          if (!visibleRef.current) {
            rafRef.current = 0;
            return;
          }
          const mq = marqueeRef.current;
          if (mq) {
            const target = hoverPausedRef.current ? 0 : velTargetRef.current;
            const next = mq.timeScale() + (target - mq.timeScale()) * 0.08;
            mq.timeScale(next);
          }
          velTargetRef.current += (1 - velTargetRef.current) * 0.05;
          rafRef.current = requestAnimationFrame(tick);
        };
        const startTick = () => {
          if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
        };
        restartFns.add(startTick);
        startTick();

        return () => {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = 0;
          restartFns.delete(startTick);
          viewport?.removeEventListener("mouseenter", onEnter);
          viewport?.removeEventListener("mouseleave", onLeave);
          hoverPausedRef.current = false;
          marqueeRef.current?.timeScale(1);
        };
      },
    );

    /* ---------- Mobile: natural height, one-shot reveal ---------- */
    mm.add("(max-width: 767px)", () => {
      const heading = headingRef.current;

      const tl = gsap.timeline({
        scrollTrigger: { trigger: wrapper, start: "top 80%", once: true },
      });
      tl.from(heading, { autoAlpha: 0, y: 28, duration: 0.5, ease: "power2.out" }).from(
        chips,
        { autoAlpha: 0, y: 24, duration: 0.45, ease: "power2.out", stagger: 0.04 },
        "<0.05",
      );
    });

    /* ---------- Touch: center scan-zone colorizes chips as they pass ----------
       No hover on touch, so the brand color is revealed where the user is
       looking — the middle of the rail. Each chip's --tool-color is driven by
       its distance to the viewport center every frame (instant, no transition). */
    mm.add("(hover: none) and (prefers-reduced-motion: no-preference)", () => {
      const viewport = viewportRef.current;
      let raf = 0;
      const tints = new Array(chips.length);
      const run = () => {
        if (!visibleRef.current) {
          raf = 0;
          return;
        }
        if (viewport) {
          /* Batch: read ALL rects first, then write ALL styles — one forced
             layout per frame instead of one per chip (was the worst mobile
             scroll cost here). */
          const vp = viewport.getBoundingClientRect();
          const centerX = vp.left + vp.width / 2;
          const chipW = chips[0]?.getBoundingClientRect().width || 70;
          const reach = chipW * 1.3; // ~1 chip fully lit, neighbors fading
          for (let i = 0; i < chips.length; i += 1) {
            const r = chips[i].getBoundingClientRect();
            const d = Math.abs(r.left + r.width / 2 - centerX);
            tints[i] = gsap.utils.clamp(0, 1, 1 - d / reach);
          }
          for (let i = 0; i < chips.length; i += 1) {
            const t = tints[i];
            chips[i].style.setProperty("--tool-color", t.toFixed(3));
            chips[i].style.transform = t > 0.001 ? `scale(${1 + t * 0.1})` : "";
          }
        }
        raf = requestAnimationFrame(run);
      };
      const startRun = () => {
        if (!raf) raf = requestAnimationFrame(run);
      };
      restartFns.add(startRun);
      startRun();

      return () => {
        cancelAnimationFrame(raf);
        raf = 0;
        restartFns.delete(startRun);
        chips.forEach((chip) => {
          chip.style.removeProperty("--tool-color");
          chip.style.transform = "";
        });
      };
    });

    const refresh = () => ScrollTrigger.refresh();
    requestAnimationFrame(refresh);
    window.addEventListener("load", refresh);
    window.addEventListener("resize", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", refresh);
      stopObserve();
      cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(tipRafRef.current);
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
            <Image src="/images/wide-blur.webp" alt="" fill className="object-contain object-center" sizes="100vw" />
          </div>
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 hidden h-[55vh] translate-y-1/2 md:block"
          aria-hidden
        >
          <div ref={glowBottomRef} className="relative h-full w-full opacity-65">
            <Image src="/images/wide-blur.webp" alt="" fill className="object-contain object-center" sizes="100vw" />
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
        <div className="relative z-10 flex w-full flex-col gap-8 md:flex-row md:items-center md:gap-0">
          {/* Heading block */}
          <div ref={headingRef} className="shrink-0 will-change-[opacity,transform] md:mr-[clamp(1.75rem,3vw,3.25rem)]">
            <p className="mb-3 flex items-center gap-2 font-sans text-[0.68rem] font-medium uppercase tracking-[0.32em] text-white/40">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-(--hero-accent)" aria-hidden />
              Tech Stack
            </p>
            <h2
              id="tools-heading"
              className="w-max font-heading text-[clamp(2rem,4.4vw,4rem)] font-normal leading-[1.05] tracking-[-0.02em] whitespace-nowrap text-hero-gradient"
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
            {/* left edge fade — logos dissolve right at the divider so they read
                as tucking behind it (the viewport sits flush against the divider) */}
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[clamp(2rem,6vw,5rem)] bg-linear-to-r from-(--section-canvas) to-transparent"
              aria-hidden
            />

            {/* right edge fade */}
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[clamp(2rem,6vw,5rem)] bg-linear-to-l from-(--section-canvas) to-transparent"
              aria-hidden
            />

            <div
              ref={trackRef}
              className="flex w-max items-center gap-[clamp(1.25rem,2.4vw,2.75rem)] py-6"
            >
              {LOOP.map((tool, i) => (
                <div
                  key={`${tool.name}-${i}`}
                  ref={(el) => {
                    chipRefs.current[i] = el;
                  }}
                  data-tool={tool.name}
                  onMouseEnter={(e) => showTip(tool.name, e.currentTarget)}
                  onMouseLeave={hideTip}
                  className="tool-chip flex h-[clamp(5rem,7.5vw,7.5rem)] w-[clamp(5rem,7.5vw,7.5rem)] shrink-0 items-center justify-center rounded-full border border-white/10 bg-linear-to-b from-white/[0.07] to-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] will-change-[transform]"
                >
                  <span className="relative block h-[60%] w-[60%]">
                    <Image
                      src={tool.white}
                      alt=""
                      fill
                      sizes="80px"
                      className="tool-chip__img tool-chip__img--white object-contain"
                    />
                    <Image
                      src={tool.color}
                      alt={tool.name}
                      fill
                      sizes="80px"
                      className="tool-chip__img tool-chip__img--color object-contain"
                    />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Branded name tooltip — one fixed element parked under the hovered chip
            (rendered here, outside the overflow-hidden viewport, so it never
            clips). Position + content are set imperatively in showTip/positionTip. */}
        <div ref={tooltipRef} className="tool-tip" aria-hidden />
      </div>
    </section>
  );
}
