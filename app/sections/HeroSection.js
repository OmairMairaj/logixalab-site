"use client";

import Image from "next/image";
import Link from "next/link";

import { RandomLetterSwapPingPong } from "@/app/components/random-letter-swap";
import { observeInView } from "@/app/lib/inView";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

/* Mobile "auto" spotlight path — normalized points across the model's
   face/torso (x,y in [0,1] of the portrait box). Looped slowly; each segment
   runs SPOT_SEG_DUR seconds (5 segments ≈ 14s round trip). */
const SPOT_PATH = [
  { nx: 0.5, ny: 0.3 },
  { nx: 0.66, ny: 0.45 },
  { nx: 0.54, ny: 0.62 },
  { nx: 0.36, ny: 0.54 },
  { nx: 0.46, ny: 0.38 },
  { nx: 0.5, ny: 0.3 },
];
const SPOT_SEG_DUR = 2.8;

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

  /* Mobile "auto" mode — a composite-only spotlight: a soft-edged circular
     window (spotRef) glides along a fixed path while the robot inside it
     (spotRobotRef) counter-translates to stay registered to the portrait.
     boxRef caches the portrait box + radius so onUpdate never reads layout. */
  const spotRef = useRef(null);
  const spotRobotRef = useRef(null);
  const boxRef = useRef({ ox: 0, oy: 0, w: 1, h: 1, R: 70 });
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

  /* Apply the spotlight transforms for a normalized path point (nx,ny) ∈ [0,1]
     within the portrait box. Composite-only: two translate3d writes, no layout
     reads. The window centers on (cx,cy); the robot counter-translates so its
     pixels stay locked to the portrait regardless of where the window is. */
  const applySpot = useCallback((nx, ny) => {
    const spot = spotRef.current;
    const robot = spotRobotRef.current;
    if (!spot || !robot) return;
    const { ox, oy, w, h, R } = boxRef.current;
    const cx = ox + nx * w;
    const cy = oy + ny * h;
    spot.style.transform = `translate3d(${(cx - R).toFixed(1)}px, ${(cy - R).toFixed(1)}px, 0)`;
    robot.style.transform = `translate3d(${(ox - cx + R).toFixed(1)}px, ${(oy - cy + R).toFixed(1)}px, 0)`;
  }, []);

  /* Size + register the mobile spotlight to the portrait box (mount + resize).
     Mirrors placeRobot's box math; radius is smaller than the desktop blob and
     scales gently with viewport width. */
  const placeSpot = useCallback(() => {
    const hero = heroRef.current;
    const portrait = portraitRef.current;
    const spot = spotRef.current;
    const robot = spotRobotRef.current;
    if (!hero || !portrait || !spot || !robot) return;
    const hr = hero.getBoundingClientRect();
    const pr = portrait.getBoundingClientRect();
    const R = Math.max(56, Math.min(window.innerWidth * 0.18, 96));
    boxRef.current = {
      ox: pr.left - hr.left,
      oy: pr.top - hr.top,
      w: Math.max(1, pr.width),
      h: Math.max(1, pr.height),
      R,
    };
    spot.style.width = `${(R * 2).toFixed(1)}px`;
    spot.style.height = `${(R * 2).toFixed(1)}px`;
    robot.style.width = `${boxRef.current.w.toFixed(1)}px`;
    robot.style.height = `${boxRef.current.h.toFixed(1)}px`;
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
    /* Resolve the reveal mode:
         full = desktop cursor blob (fine pointer + wide + motion ok)
         auto = mobile predefined spotlight (touch / coarse / narrow)
         lite = reduced-motion → static portrait, nothing animates. */
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const wide = window.innerWidth >= 768;
    const mode = reduceMotionRef.current ? "lite" : fine && wide ? "full" : "auto";
    hero.dataset.mode = mode;

    let stopObserve = () => {};
    let spotTl = null;
    const spotPt = { nx: SPOT_PATH[0].nx, ny: SPOT_PATH[0].ny };
    const startLoop = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(stepBlob);
    };
    const stopLoop = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      }
    };

    if (mode === "full") {
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
    } else if (mode === "auto") {
      /* Mobile: register the spotlight to the portrait, then glide it along the
         predefined path with a slow infinite loop — paused while offscreen. The
         tween mutates a plain {nx,ny}; onUpdate does the two composite writes. */
      placeSpot();
      applySpot(spotPt.nx, spotPt.ny);
      spotTl = gsap.timeline({
        repeat: -1,
        paused: true,
        defaults: { ease: "sine.inOut" },
      });
      for (let i = 1; i < SPOT_PATH.length; i += 1) {
        spotTl.to(spotPt, {
          nx: SPOT_PATH[i].nx,
          ny: SPOT_PATH[i].ny,
          duration: SPOT_SEG_DUR,
          onUpdate: () => applySpot(spotPt.nx, spotPt.ny),
        });
      }
      stopObserve = observeInView(hero, (visible) =>
        visible ? spotTl.play() : spotTl.pause(),
      );
    }
    /* mode === "lite": nothing animates; the static portrait shows. */

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
      if (mode === "full") placeRobot();
      else if (mode === "auto") {
        placeSpot();
        applySpot(spotPt.nx, spotPt.ny);
      }
    };
    requestAnimationFrame(refresh);
    window.addEventListener("load", refresh);
    window.addEventListener("resize", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", refresh);
      stopObserve();
      stopLoop();
      spotTl?.kill();
      delete hero.dataset.mode;
      mm.revert();
    };
  }, [placeRobot, placeSpot, applySpot, stepBlob]);

  return (
    <section
      ref={wrapperRef}
      className="relative z-20 h-[100svh] w-full md:h-[300vh]"
    >
      <div
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        className="sticky top-0 h-[100svh] w-full overflow-hidden bg-(--hero-canvas) md:h-screen"
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
          className="pointer-events-none absolute left-(--gutter) right-(--gutter) top-[11%] z-20 w-auto will-change-[opacity,transform] md:right-auto md:top-[18%] md:w-[min(82vw,400px)]"
        >
          <h2
            className="font-heading text-[clamp(1.25rem,6.7vw,2.25rem)] font-normal leading-[1.1] tracking-[-0.02em] text-white md:text-[clamp(2rem,6.2vw,5.5rem)] md:leading-[1.05]"
            style={{ textShadow: "0 2px 40px rgba(0,0,0,0.5)" }}
          >
            Trusted Engineering.
            <br />
            Creative Precision.
          </h2>
        </div>

        {/* Center portrait — female (the robot is revealed at hero level below).
            Mobile: ~58vh tall, centered just below the heading (the box is wider
            than the phone and clipped by the hero's overflow-hidden). Desktop
            (md:): original box — full hero height, width clamp, anchored 53%. */}
        <div
          ref={portraitRef}
          className="pointer-events-none absolute inset-x-0 top-[20%] bottom-0 z-10 will-change-[opacity,transform] md:inset-x-auto md:left-[53%] md:top-0 md:w-[clamp(260px,80vw,800px)] md:-translate-x-1/2"
        >
          <Image
            src="/images/hero-female.webp"
            alt="LogixaLab — Trusted Engineering"
            fill
            className="object-cover object-[58%_top] md:object-contain md:object-bottom"
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 800px"
          />
        </div>

        {/* Mobile-only spotlight (data-mode="auto"): a soft-edged circular window
            that glides along a fixed path, with the robot inside counter-translated
            so its pixels stay locked to the portrait — a composite-only see-through
            reveal (no backdrop-filter, no SVG filters). Hidden on desktop/lite. */}
        <div
          ref={spotRef}
          className="hero-spot pointer-events-none absolute left-0 top-0 z-[12] overflow-hidden rounded-full"
          aria-hidden
          style={{
            WebkitMaskImage:
              "radial-gradient(circle, #000 30%, rgba(0,0,0,0.5) 62%, transparent 100%)",
            maskImage:
              "radial-gradient(circle, #000 30%, rgba(0,0,0,0.5) 62%, transparent 100%)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {/* Must mirror the mobile female's fit/position (object-cover object-[58%_top])
              so the revealed robot pixels register exactly with the portrait. */}
          <img
            ref={spotRobotRef}
            src="/images/hero-robot.webp"
            alt=""
            className="hero-spot__robot absolute left-0 top-0 max-w-none object-cover object-[58%_top]"
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
          className="absolute bottom-[6%] left-(--gutter) right-(--gutter) z-20 text-left will-change-[opacity,transform] md:bottom-auto md:left-auto md:top-[50%] md:w-[min(30vw,400px)]"
        >
          {/* Mobile: two columns side-by-side; desktop: stacked single column. */}
          <div className="grid grid-cols-2 gap-x-5 md:block">
            <p className="font-sans text-[0.78rem] font-normal leading-[1.5] tracking-[0] text-white/90 md:text-[clamp(0.875rem,1.2vw,1rem)] md:leading-[1.45]">
              LogixaLab builds enterprise platforms, AI systems, cloud
              infrastructure, and digital experiences designed to perform under
              real-world pressure.
            </p>
            <p className="font-sans text-[0.78rem] font-normal leading-[1.5] tracking-[0] text-white/90 md:mt-[1.35em] md:text-[clamp(0.875rem,1.2vw,1rem)] md:leading-[1.45]">
              From AI-powered automation to large-scale platform engineering, every
              solution is built in-house by one integrated team.
            </p>
          </div>
          <Link
            href="/contact"
            className="mt-5 inline-flex w-fit items-center gap-2.5 text-[0.82rem] font-semibold text-white transition-opacity hover:opacity-80 md:mt-[1.6em] md:text-[clamp(0.875rem,1.2vw,1rem)]"
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
