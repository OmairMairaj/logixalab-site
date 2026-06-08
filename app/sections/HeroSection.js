"use client";

import Image from "next/image";
import Link from "next/link";

import { RandomLetterSwapPingPong } from "@/app/components/random-letter-swap";
import { observeInView } from "@/app/lib/inView";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const wrapperRef = useRef(null);
  const heroRef = useRef(null);
  const bgRef = useRef(null);
  const headingRef = useRef(null);
  const portraitRef = useRef(null);
  const copyRef = useRef(null);

  /* Always-on liquid-glass blob that roams the WHOLE hero (not just the portrait).
     A CHAIN of lobes merged by a goo SVG filter forms a teardrop that trails the
     cursor and relaxes to a round blob when idle. The same metaball shape is used
     three ways: (1) a CSS mask on a backdrop-filtered div → a refractive glass
     lens that warps the hero content behind it; (2) an SVG mask revealing the
     hidden robot wherever the blob overlaps the female portrait; (3) a faint lime
     tint + scan shimmer for the glassy sheen. */
  const NODE_COUNT = 7;
  const BASE_R = 138; // head-lobe radius; tail lobes taper down geometrically
  const GAP_FACTOR = 0.94; // max link gap as a fraction of the lead lobe's radius
  const HEAD_EASE = 0.3; // how snappily the head lobe chases the cursor

  const revealRef = useRef(null); // hero-level SVG (mask defs + robot + sheen)
  const glassRef = useRef(null); // backdrop-filtered liquid-glass lens div
  const robotRef = useRef(null); // <image> robot, sized/placed over the portrait
  const nodeRefs = useRef([]); // <circle> elements for the chain
  const nodesRef = useRef([]); // { x, y } positions
  const pointerRef = useRef({
    tx: 0,
    ty: 0,
    x: 0,
    y: 0,
    px: 0, // previous head x/y (for velocity)
    py: 0,
    vx: 0, // smoothed velocity
    vy: 0,
    init: false,
  });
  const rafRef = useRef(0);
  const reduceMotionRef = useRef(false);

  const stepBlob = useCallback((now) => {
    const p = pointerRef.current;
    const nodes = nodesRef.current;
    const els = nodeRefs.current;
    if (!nodes.length || !els.length) {
      rafRef.current = requestAnimationFrame(stepBlob);
      return;
    }

    const reduce = reduceMotionRef.current;
    const t = now / 1000;
    const SPEED_MAX = reduce ? 18 : 40;
    const breathe = reduce ? 2 : 6;
    const gapFactor = reduce ? GAP_FACTOR * 0.6 : GAP_FACTOR;

    /* Head: snappy lerp toward the cursor so the tip clearly leads the motion. */
    p.x += (p.tx - p.x) * HEAD_EASE;
    p.y += (p.ty - p.y) * HEAD_EASE;

    /* Smoothed velocity → normalized speed s in [0,1]. */
    const rawVx = p.x - p.px;
    const rawVy = p.y - p.py;
    p.px = p.x;
    p.py = p.y;
    p.vx += (rawVx - p.vx) * 0.25;
    p.vy += (rawVy - p.vy) * 0.25;
    const speed = Math.min(SPEED_MAX, Math.hypot(p.vx, p.vy));
    const s = speed / SPEED_MAX;

    /* Per-lobe radius: geometric taper — fat head, sharp tail tip (teardrop). */
    const radius = (i) => BASE_R * Math.pow(0.74, i);

    /* Head snaps to the pointer; each tail node eases toward the node ahead, then
       is clamped so its gap never exceeds GAP_FACTOR × the lead lobe's radius.
       Idle → the ease pulls the gap to ~0 (lobes stack into a round blob); moving
       → the head outruns the chain, every gap saturates at its clamp, so the chain
       extends to its full length BEHIND the cursor = a teardrop. Clamp < radius at
       each link guarantees the lobes always overlap (one continuous shape). */
    nodes[0].x = p.x;
    nodes[0].y = p.y;
    for (let i = 1; i < nodes.length; i += 1) {
      const lead = nodes[i - 1];
      const node = nodes[i];
      node.x += (lead.x - node.x) * 0.45;
      node.y += (lead.y - node.y) * 0.45;
      const dx = node.x - lead.x;
      const dy = node.y - lead.y;
      const dist = Math.hypot(dx, dy) || 0.0001;
      const maxGap = gapFactor * radius(i - 1) * (1 + 0.25 * s);
      if (dist > maxGap) {
        node.x = lead.x + (dx / dist) * maxGap;
        node.y = lead.y + (dy / dist) * maxGap;
      }
    }

    /* Paint: tapered radii + per-node idle wobble; head swells a hair with speed. */
    for (let i = 0; i < nodes.length; i += 1) {
      const el = els[i];
      if (!el) continue;
      let r = radius(i) + Math.sin(t * 1.3 + i) * breathe;
      if (i === 0) r *= 1 + s * 0.2;
      el.setAttribute("cx", nodes[i].x.toFixed(1));
      el.setAttribute("cy", nodes[i].y.toFixed(1));
      el.setAttribute("r", Math.max(6, r).toFixed(1));
    }

    rafRef.current = requestAnimationFrame(stepBlob);
  }, []);

  /* Pointer tracked across the whole hero (coords relative to the hero box). */
  const handleHeroMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const p = pointerRef.current;
    p.tx = e.clientX - rect.left;
    p.ty = e.clientY - rect.top;
    if (!p.init) {
      p.x = p.px = p.tx;
      p.y = p.py = p.ty;
      p.init = true;
    }
  }, []);

  /* Size + position the masked robot <image> to exactly overlap the female
     portrait, so the robot only shows where the blob crosses the portrait. */
  const placeRobot = useCallback(() => {
    const hero = heroRef.current;
    const portrait = portraitRef.current;
    const robot = robotRef.current;
    if (!hero || !portrait || !robot) return;
    const hr = hero.getBoundingClientRect();
    const pr = portrait.getBoundingClientRect();
    robot.setAttribute("x", (pr.left - hr.left).toFixed(1));
    robot.setAttribute("y", (pr.top - hr.top).toFixed(1));
    robot.setAttribute("width", Math.max(1, pr.width).toFixed(1));
    robot.setAttribute("height", Math.max(1, pr.height).toFixed(1));
  }, []);

  useLayoutEffect(() => {
    reduceMotionRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const wrapper = wrapperRef.current;
    const hero = heroRef.current;
    const heading = headingRef.current;
    const portrait = portraitRef.current;
    const copy = copyRef.current;
    const bg = bgRef.current;
    if (!wrapper || !hero || !heading || !portrait || !copy || !bg)
      return undefined;

    /* The liquid-glass blob is a fine-pointer DESKTOP effect: it's driven by the
       cursor (touch can't move it) and continuously recomposites a backdrop-filter
       + two SVG turbulence/displacement filters every frame. Running it on phones
       costs heavy GPU for zero interaction, so gate it to capable devices and,
       even there, pause it whenever the hero is scrolled out of view. */
    const canRunBlob =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      window.innerWidth >= 768 &&
      !reduceMotionRef.current;

    let stopObserve = () => {};
    const startLoop = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(stepBlob);
    };
    const stopLoop = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };

    if (canRunBlob) {
      /* Seed the blob over the portrait so the lens is in place before the
         pointer ever moves, then run it only while the hero is on screen. */
      const hr = hero.getBoundingClientRect();
      const pr = portrait.getBoundingClientRect();
      const cx = pr.left - hr.left + pr.width / 2;
      const cy = pr.top - hr.top + pr.height * 0.45;
      const p = pointerRef.current;
      p.tx = p.x = p.px = cx;
      p.ty = p.y = p.py = cy;
      p.vx = p.vy = 0;
      p.init = true;
      nodesRef.current = Array.from({ length: NODE_COUNT }, () => ({ x: cx, y: cy }));
      placeRobot();
      stopObserve = observeInView(hero, (visible) =>
        visible ? startLoop() : stopLoop(),
      );
    } else {
      /* Lite path (mobile / touch / reduced-motion): skip the rAF entirely and
         flag the hero so CSS hides the glass lens + reveal SVG — just the static
         portrait shows, at a fraction of the cost. */
      hero.dataset.lite = "1";
    }

    const mm = gsap.matchMedia();

    /* Desktop: sticky hero stays put while a scrubbed timeline flies each
       element out in its own direction as the wrapper scrolls past. */
    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3,
            invalidateOnRefresh: true,
          },
        });

        /* Phase 1 (0 → 0.33) — left heading + right copy fly off-screen first. */
        tl.to(
          heading,
          {
            x: () => -window.innerWidth * 1.2,
            autoAlpha: 0,
            ease: "power2.in",
            duration: 0.33,
            force3D: true,
          },
          0,
        )
          .to(
            copy,
            {
              x: () => window.innerWidth * 1.2,
              autoAlpha: 0,
              ease: "power2.in",
              duration: 0.33,
              force3D: true,
            },
            0.03,
          )
          /* Phase 2 (0.36 → 0.64) — once the text is gone, the center portrait
             fades and blurs out, taking the liquid-glass lens + robot reveal with
             it so the blob doesn't linger after the female is gone. */
          .to(
            portrait,
            {
              autoAlpha: 0,
              scale: 1.06,
              filter: "blur(14px)",
              ease: "power1.inOut",
              duration: 0.28,
              force3D: true,
            },
            0.36,
          )
          .to(
            [glassRef.current, revealRef.current].filter(Boolean),
            {
              autoAlpha: 0,
              ease: "power1.inOut",
              duration: 0.28,
              force3D: true,
            },
            0.36,
          )
          /* Phase 3 (0.66 → 1.0) — the whole hero panel fades out, revealing the
             Intro section layered behind it as it scrolls up. */
          .to(
            hero,
            {
              autoAlpha: 0,
              ease: "none",
              duration: 0.34,
            },
            0.66,
          );
      },
    );

    /* Mobile: no sticky travel — a one-shot entrance as the hero loads in. */
    mm.add(
      "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
      () => {
        gsap.from([heading, portrait, copy], {
          autoAlpha: 0,
          y: 28,
          ease: "power2.out",
          duration: 0.7,
          stagger: 0.12,
          force3D: true,
        });
      },
    );

    const refresh = () => {
      ScrollTrigger.refresh();
      if (canRunBlob) placeRobot();
    };
    requestAnimationFrame(refresh);
    window.addEventListener("load", refresh);
    window.addEventListener("resize", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", refresh);
      stopObserve();
      stopLoop();
      delete hero.dataset.lite;
      mm.revert();
    };
  }, [placeRobot, stepBlob]);

  return (
    <section
      ref={wrapperRef}
      className="relative z-20 h-screen w-full md:h-[300vh]"
    >
      <div
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        className="sticky top-0 h-screen w-full overflow-hidden bg-(--hero-canvas)"
      >
        {/* Background — green burst + side glows (scoped to the hero) */}
        <div ref={bgRef} className="pointer-events-none absolute inset-0 z-0" aria-hidden>
          <Image
            src="/images/background.webp"
            alt=""
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div className="absolute left-0 top-0 h-full w-[56vw] -translate-x-1/3">
            <Image
              src="/images/left.webp"
              alt=""
              fill
              className="object-contain object-left"
              sizes="65vw"
            />
          </div>
          <div className="absolute right-0 top-0 z-10 h-[92vh] w-[66vw] translate-x-[30%] -translate-y-[24%]">
            <Image
              src="/images/right.webp"
              alt=""
              fill
              className="object-contain object-top-right"
              sizes="66vw"
            />
          </div>
        </div>

        <h1 className="sr-only">
          Logixa Lab — Trusted Engineering. Creative Precision. AI Solutions Built
          for Real-World Impact.
        </h1>

        {/* Heading — left */}
        <div
          ref={headingRef}
          className="pointer-events-none absolute left-(--gutter) top-[12%] z-20 w-[min(82vw,400px)] will-change-[opacity,transform] md:top-[18%]"
        >
          <h2
            className="font-heading text-[clamp(2rem,6.2vw,5.5rem)] font-normal leading-[1.05] tracking-[-0.02em] text-white"
            style={{ textShadow: "0 2px 40px rgba(0,0,0,0.5)" }}
          >
            Trusted Engineering.
            <br />
            Creative Precision.
          </h2>
        </div>

        {/* Center portrait — female (the robot is revealed at hero level below) */}
        <div
          ref={portraitRef}
          className="pointer-events-none absolute inset-x-0 bottom-0 top-[26%] z-10 mx-auto will-change-[opacity,transform] md:left-[53%] md:right-auto md:inset-y-0 md:-translate-x-1/2"
          style={{ width: "clamp(260px, 80vw, 800px)" }}
        >
          <Image
            src="/images/hero-female.webp"
            alt="LogixaLab — Trusted Engineering"
            fill
            className="object-contain object-bottom"
            priority
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 60vw, 800px"
          />
        </div>

        {/* Liquid-glass lens — a backdrop-filtered div clipped to the metaball
            mask, so it refracts/warps the hero content behind it within the blob.
            (Refraction needs Chromium's backdrop-filter url(); other browsers fall
            back to a frosted blur.) */}
        <div
          ref={glassRef}
          className="hero-glass pointer-events-none absolute inset-0 z-[12]"
          aria-hidden
          style={{
            backdropFilter:
              "url(#heroGlassDistort) blur(1.5px) brightness(1.06) saturate(1.25)",
            WebkitBackdropFilter: "blur(2px) brightness(1.06) saturate(1.25)",
            mask: "url(#heroBlobMask)",
            WebkitMask: "url(#heroBlobMask)",
          }}
        />

        {/* Hero-level reveal SVG — owns the metaball mask + glass filters, the
            robot revealed over the portrait, and the lime tint / scan shimmer. */}
        <svg
          ref={revealRef}
          className="hero-reveal pointer-events-none absolute inset-0 z-[13] h-full w-full"
          aria-hidden
        >
          <defs>
            <filter
              id="heroBlobGoo"
              x="-40%"
              y="-40%"
              width="180%"
              height="180%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
                result="goo"
              />
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.009 0.02"
                numOctaves="2"
                seed="7"
                result="noise"
              />
              <feDisplacementMap
                in="goo"
                in2="noise"
                scale="55"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>

            {/* Refraction filter for the glass lens (SourceGraphic = backdrop). */}
            <filter
              id="heroGlassDistort"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.008 0.013"
                numOctaves="2"
                seed="11"
                result="warp"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="warp"
                scale="34"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>

            <mask id="heroBlobMask" maskUnits="userSpaceOnUse">
              <g filter="url(#heroBlobGoo)" fill="#fff">
                {Array.from({ length: NODE_COUNT }).map((_, i) => (
                  <circle
                    key={i}
                    ref={(el) => {
                      nodeRefs.current[i] = el;
                    }}
                    cx="-400"
                    cy="-400"
                    r="80"
                  />
                ))}
              </g>
            </mask>

            <pattern
              id="heroScanlines"
              width="6"
              height="6"
              patternUnits="userSpaceOnUse"
            >
              <rect width="6" height="6" fill="transparent" />
              <rect width="6" height="1.4" y="0" fill="#fff" opacity="0.06" />
            </pattern>
            <linearGradient id="heroScanBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0.5" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Robot — only visible where the blob overlaps the female portrait. */}
          <image
            ref={robotRef}
            href="/images/hero-robot.webp"
            x="0"
            y="0"
            width="100"
            height="100"
            preserveAspectRatio="xMidYMax meet"
            mask="url(#heroBlobMask)"
          />

          {/* Glassy sheen — faint lime tint + animated scan shimmer in the blob. */}
          <g mask="url(#heroBlobMask)">
            <rect width="100%" height="100%" fill="#ccff00" opacity="0.05" />
            <g style={{ mixBlendMode: "screen" }}>
              <rect width="100%" height="100%" fill="url(#heroScanlines)" />
              <rect width="100%" height="60" fill="url(#heroScanBar)" opacity="0.5">
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="0 -120"
                  to="0 1400"
                  dur="3.4s"
                  repeatCount="indefinite"
                />
              </rect>
            </g>
          </g>
        </svg>

        {/* Right copy + CTA link */}
        <aside
          ref={copyRef}
          className="absolute bottom-[7%] left-(--gutter) right-(--gutter) z-20 text-left will-change-[opacity,transform] md:bottom-auto md:left-auto md:top-[50%] md:w-[min(30vw,400px)]"
        >
          <p className="font-sans text-[clamp(0.875rem,1.2vw,1rem)] font-normal leading-[1.45] tracking-[0] text-white/90">
            LogixaLab builds enterprise platforms, AI systems, cloud
            infrastructure, and digital experiences designed to perform under
            real-world pressure.
          </p>
          <p className="mt-[1.35em] font-sans text-[clamp(0.875rem,1.2vw,1rem)] font-normal leading-[1.45] tracking-[0] text-white/90">
            From AI-powered automation to large-scale platform engineering, every
            solution is built in-house by one integrated team.
          </p>
          <Link
            href="/contact"
            className="mt-[1.6em] inline-flex w-fit items-center gap-2.5 text-[clamp(0.875rem,1.2vw,1rem)] font-semibold text-white transition-opacity hover:opacity-80"
          >
            <Image
              src="/images/logo-white.png"
              alt=""
              width={28}
              height={28}
              className="h-[clamp(1.4rem,1.7vw,1.6rem)] w-[clamp(1.4rem,1.7vw,1.6rem)] shrink-0 object-contain"
            />
            <RandomLetterSwapPingPong
              label="Start a New Project"
              className="text-inherit"
              staggerDuration={0.025}
            />
          </Link>
        </aside>
      </div>
    </section>
  );
}
