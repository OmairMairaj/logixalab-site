"use client";

import Image from "next/image";
import Link from "next/link";

import { RandomLetterSwapPingPong } from "@/components/ui/random-letter-swap";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Staggered hero type: Engineering ~75% from top left; Intelligence lower right (76% / 80% md).
 * Logo / story rails / impact (Figma 26-frame trail): text left; portrait cards; center = large + z-top;
 * sides ~66% scale + dimmed + z-behind; bottom-aligned row; horizontal rail (start right → scrub left);
 * left+right slots open together; merge shrinks headline type.
 */
export default function LandingScrollExperience() {
  const scrollRootRef = useRef(null);
  const engineeringRef = useRef(null);
  const intelligenceRef = useRef(null);
  const heroBgLayerRef = useRef(null);
  const leftGlowRef = useRef(null);
  const leftGlowUnderRightRef = useRef(null);
  const leftRailRef = useRef(null);
  const nextRailRef = useRef(null);
  const impactSmallRef = useRef(null);
  const impactBigRef = useRef(null);
  const impactSplitRef = useRef(null);
  const headingsBlockRef = useRef(null);
  const centerImageRef = useRef(null);
  const rightCopyRef = useRef(null);
  const carouselStageRef = useRef(null);
  const carouselRailRef = useRef(null);
  const industryStageRef = useRef(null);
  const industryHeadingRef = useRef(null);
  const industryStatRef = useRef(null);
  const industryCardsRef = useRef(null);

  useLayoutEffect(() => {
    const scrollRoot = scrollRootRef.current;
    const eng = engineeringRef.current;
    const intel = intelligenceRef.current;
    const heroBgLayer = heroBgLayerRef.current;
    const leftGlow = leftGlowRef.current;
    const leftGlowUnderRight = leftGlowUnderRightRef.current;
    const leftRail = leftRailRef.current;
    const nextRail = nextRailRef.current;
    const impactSmall = impactSmallRef.current;
    const impactBig = impactBigRef.current;
    const impactSplit = impactSplitRef.current;
    const headingsBlock = headingsBlockRef.current;
    const centerImage = centerImageRef.current;
    const rightCopy = rightCopyRef.current;
    const carouselStage = carouselStageRef.current;
    const carouselRail = carouselRailRef.current;
    const industryStage = industryStageRef.current;
    const industryHeading = industryHeadingRef.current;
    const industryStat = industryStatRef.current;
    const industryCards = industryCardsRef.current;
    if (
      !scrollRoot ||
      !eng ||
      !intel ||
      !heroBgLayer ||
      !leftGlow ||
      !leftGlowUnderRight ||
      !leftRail ||
      !nextRail ||
      !impactSmall ||
      !impactBig ||
      !impactSplit ||
      !headingsBlock ||
      !centerImage ||
      !rightCopy ||
      !carouselStage ||
      !carouselRail ||
      !industryStage ||
      !industryHeading ||
      !industryStat ||
      !industryCards
    )
      return;

    const ctx = gsap.context(() => {
      gsap.set(heroBgLayer, { opacity: 1 });
      gsap.set(leftGlowUnderRight, { opacity: 0 });
      gsap.set(leftRail, { x: 0, opacity: 1 });
      /* Final layout position from the start; hidden until story beat (no slide-in). */
      gsap.set(nextRail, {
        x: 0,
        opacity: 0,
        pointerEvents: "none",
      });
      gsap.set(impactSmall, {
        x: "-110vw",
        opacity: 1,
        force3D: true,
      });
      const impactBigSlideX = Math.min(window.innerWidth * 0.42, 520);
      /* Left column: big line starts translated right, then meets the small caps (Figma stack). */
      gsap.set(impactBig, {
        x: impactBigSlideX,
        opacity: 1,
        textAlign: "left",
        force3D: true,
      });
      /* Headings block: starts centered (translate -50%/-50%), transformOrigin top-left so later scale shrinks into corner. */
      gsap.set(headingsBlock, {
        left: "50%",
        top: "50%",
        xPercent: -50,
        yPercent: -50,
        scale: 1,
        transformOrigin: "0% 0%",
        force3D: true,
      });
      /* Center image: positioned at viewport center, hidden via scale 0 until phase 3c. */
      gsap.set(centerImage, {
        left: "50%",
        top: "50%",
        xPercent: -50,
        yPercent: -50,
        scale: 0,
        transformOrigin: "50% 50%",
        force3D: true,
      });
      /* Right paragraph: hidden until phase 3e. */
      gsap.set(rightCopy, {
        opacity: 0,
        x: 30,
        force3D: true,
      });
      /* Carousel stage: hidden + rail offset right until phase 3f. */
      gsap.set(carouselStage, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(carouselRail, { x: 0, force3D: true });

      /* Industry stage (Phase 4): heading off-left, stat hidden, cards below viewport. */
      gsap.set(industryStage, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(industryHeading, { x: -window.innerWidth * 0.6, force3D: true });
      gsap.set(industryStat, { opacity: 0, x: 40, force3D: true });
      const industryCardEls = industryCards.querySelectorAll("[data-industry-card]");
      industryCardEls.forEach((card, i) => {
        gsap.set(card, {
          y: window.innerHeight * (1.05 + i * 0.15),
          rotate: i % 2 === 0 ? -3 : 3,
          opacity: 0,
          force3D: true,
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollRoot,
          start: "top top",
          end: "bottom bottom",
          /* ~0.9s scrub lag fights Lenis and reads as “glitchy”; keep a short smoothing window. */
          scrub: 0.2,
          invalidateOnRefresh: true,
        },
      });

      // Move fully off-screen: fixed −55vw was often < full word width (leftover “g” at edge).
      const exitXEng = () =>
        -((eng.offsetWidth || window.innerWidth) + window.innerWidth * 0.15);
      const exitXIntel = () =>
        (intel.offsetWidth || window.innerWidth) + window.innerWidth * 0.15;

      const phaseDur = 1;
      /** Extra timeline after the big logo reaches y/scale end — keeps it parked before swap. */
      const settleHold = 0.22;
      const convertAt = phaseDur + settleHold;
      const convertDur = 0.32;
      tl.to(eng, {
        x: exitXEng,
        ease: "none",
        force3D: true,
        duration: phaseDur,
      })
        .to(
          intel,
          {
            x: exitXIntel,
            ease: "none",
            force3D: true,
            duration: phaseDur,
          },
          0,
        );

      /** Story phase: dot grid stays on; intro rail exits; next rail appears in place (full blur), then characters clear on scroll. */
      const storyPhaseStart = convertAt + convertDur;
      const storyDotsFade = 0.34;
      const storyRailExit = 0.42;
      /** When the lime block is visible: settled in layout, 100% blurred — no horizontal slide. */
      const paragraphInPlaceAt = storyPhaseStart + storyDotsFade + 0.04;
      /** Scroll segment after “full blur in position” before characters begin to sharpen. */
      const blurHoldBeforeChars = 0.24;
      const charRevealStart = paragraphInPlaceAt + blurHoldBeforeChars;

      const revealChars = nextRail.querySelectorAll("[data-reveal-char]");
      if (revealChars.length) {
        gsap.set(revealChars, {
          filter: "blur(20px)",
          opacity: 0.35,
          force3D: true,
        });
      }

      const charStagger = 0.006;
      const charTweenDur = 0.16;

      tl.to(
          leftGlow,
          {
            opacity: 0,
            ease: "none",
            duration: storyRailExit,
          },
          storyPhaseStart + 0.02,
        )
        .to(
          leftGlowUnderRight,
          {
            opacity: 0.42,
            ease: "none",
            duration: storyRailExit,
          },
          storyPhaseStart + 0.02,
        )
        .to(
          leftRail,
          {
            x: "-120vw",
            opacity: 0,
            ease: "none",
            duration: storyRailExit,
          },
          storyPhaseStart + 0.05,
        )
        .set(
          nextRail,
          {
            opacity: 1,
            pointerEvents: "auto",
          },
          paragraphInPlaceAt,
        );

      if (revealChars.length) {
        tl.to(
          revealChars,
          {
            filter: "blur(0px)",
            opacity: 1,
            ease: "none",
            duration: charTweenDur,
            stagger: {
              each: charStagger,
              ease: "none",
            },
          },
          charRevealStart,
        );
      }

      const charCount = revealChars.length;
      const charRevealEnd =
        charCount > 0
          ? charRevealStart +
            (charCount - 1) * charStagger +
            charTweenDur
          : charRevealStart;
      const pauseAfterReveal = 0.12;
      const exitNextDur = 0.44;
      const exitNextStart = charRevealEnd + pauseAfterReveal;
      const impactSlideDur = 0.48;
      const impactStart = exitNextStart + exitNextDur;
      const impactRevealStart = impactStart + impactSlideDur;

      const impactChars = impactBig.querySelectorAll("[data-impact-char]");
      const impactCharStagger = 0.018;
      const impactCharTweenDur = 0.14;
      const impactCharCount = impactChars.length;
      const impactRevealSpan =
        impactCharCount > 0
          ? (impactCharCount - 1) * impactCharStagger + impactCharTweenDur
          : 0.35;

      if (impactChars.length) {
        gsap.set(impactChars, {
          filter: "blur(18px)",
          opacity: 0.35,
          force3D: true,
        });
      }

      tl.to(
        nextRail,
        {
          x: "-130vw",
          opacity: 0,
          ease: "none",
          duration: exitNextDur,
        },
        exitNextStart,
      )
        .to(
          impactSmall,
          {
            x: 0,
            ease: "none",
            duration: impactSlideDur,
          },
          impactStart,
        )
        .to(
          impactBig,
          {
            x: 0,
            ease: "none",
            duration: impactSlideDur,
          },
          impactStart,
        );

      if (impactChars.length) {
        tl.to(
          impactChars,
          {
            filter: "blur(0px)",
            opacity: 1,
            ease: "none",
            duration: impactCharTweenDur,
            stagger: {
              each: impactCharStagger,
              ease: "none",
            },
          },
          impactRevealStart,
        );
      }

      const impactRevealEnd = impactRevealStart + impactRevealSpan;
      /** Phase 3c — image scales up at center of "Real-World Impact". */
      const phaseCStart = impactRevealEnd + 0.12;
      const phaseCDur = 0.55;
      /** Phase 3d — headings shrink + move to top-left. Image grows + sits as feature. */
      const phaseDStart = phaseCStart + 0.32;
      const phaseDDur = 0.7;
      /** Phase 3e — right paragraph fades in. */
      const phaseEStart = phaseDStart + 0.28;
      const phaseEDur = 0.42;
      /** Phase 3f — carousel rail scrolls horizontally. */
      const phaseFStart = phaseEStart + 0.26;
      const phaseFDur = 1.4;

      tl.to(
        centerImage,
        {
          scale: 1,
          ease: "none",
          duration: phaseCDur,
        },
        phaseCStart,
      );

      tl.to(
        headingsBlock,
        {
          left: "5%",
          top: "14%",
          xPercent: 0,
          yPercent: 0,
          scale: 0.42,
          ease: "none",
          duration: phaseDDur,
        },
        phaseDStart,
      );

      tl.to(
        centerImage,
        {
          scale: 1.45,
          ease: "none",
          duration: phaseDDur,
        },
        phaseDStart,
      );

      tl.to(
        rightCopy,
        {
          opacity: 1,
          x: 0,
          ease: "none",
          duration: phaseEDur,
        },
        phaseEStart,
      );

      tl.to(
        carouselStage,
        {
          autoAlpha: 1,
          ease: "none",
          duration: 0.18,
        },
        phaseFStart - 0.08,
      );

      /* Carousel rail slides left, exposing more cards. Distance ≈ rail width minus 1 card. */
      const railMoveDistance = () =>
        Math.min(window.innerWidth * 1.4, 1280);

      tl.fromTo(
        carouselRail,
        { x: 0 },
        {
          x: () => -railMoveDistance(),
          ease: "none",
          duration: phaseFDur,
        },
        phaseFStart,
      );

      /* Center image fades out as carousel takes over the visual focus. */
      tl.to(
        centerImage,
        {
          autoAlpha: 0,
          ease: "none",
          duration: 0.4,
        },
        phaseFStart,
      );

      /** ───────── PHASE 4 — “AI for Every Industry” ───────── */
      const phaseFEnd = phaseFStart + phaseFDur;
      /** Phase 4a — old impact stage exits, industry stage takes over. */
      const phaseGStart = phaseFEnd + 0.25;
      const phaseGDur = 0.5;
      /** Phase 4b — heading slides in from left. */
      const phaseHStart = phaseGStart + 0.25;
      const phaseHDur = 0.5;
      /** Phase 4c — stat copy fades in (bottom-right). */
      const phaseIStart = phaseHStart + 0.32;
      const phaseIDur = 0.4;
      /** Phase 4d — cards rise from bottom (staggered, scroll-driven). */
      const phaseJStart = phaseIStart + phaseIDur + 0.15;
      const phaseJDur = 1.6;

      /* Old impact stage fades out + industry stage fades in. */
      tl.to(
        impactSplit,
        { autoAlpha: 0, ease: "none", duration: phaseGDur },
        phaseGStart,
      );
      tl.to(
        industryStage,
        {
          autoAlpha: 1,
          pointerEvents: "auto",
          ease: "none",
          duration: phaseGDur,
        },
        phaseGStart,
      );

      /* Heading slides in from off-left. */
      tl.to(
        industryHeading,
        { x: 0, ease: "none", duration: phaseHDur },
        phaseHStart,
      );

      /* Stat fades in. */
      tl.to(
        industryStat,
        { opacity: 1, x: 0, ease: "none", duration: phaseIDur },
        phaseIStart,
      );

      /* Cards rise from bottom one by one — scroll drives the stagger. */
      industryCardEls.forEach((card, i) => {
        const cardBaseY = -window.innerHeight * (0.04 + i * 0.02);
        tl.to(
          card,
          {
            y: cardBaseY,
            rotate: i % 2 === 0 ? -2 : 2,
            opacity: 1,
            ease: "none",
            duration: phaseJDur,
          },
          phaseJStart + i * 0.18,
        );
      });

      /** Phase 4 outro — hero bg + industry stage fade out so Contact section reveals cleanly. */
      const phaseJEnd = phaseJStart + phaseJDur;
      const phaseOutroStart = phaseJEnd + 0.3;
      const phaseOutroDur = 0.55;

      tl.to(
        [heroBgLayer, industryStage],
        {
          autoAlpha: 0,
          ease: "none",
          duration: phaseOutroDur,
        },
        phaseOutroStart,
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

  const displayStyle = {
    fontSize: "var(--hero-display)",
    textShadow: "0 2px 40px rgba(0,0,0,0.5)",
  };

  return (
    <div className="relative overflow-x-clip bg-(--hero-canvas) text-white">
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <div ref={heroBgLayerRef} className="absolute inset-0 will-change-opacity">
          <Image
            src="/images/Background.png"
            alt=""
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div
            ref={leftGlowRef}
            className="absolute left-0 top-0 h-full w-[56vw] -translate-x-1/3"
          >
            <Image
              src="/images/left.png"
              alt=""
              fill
              className="object-contain object-left"
              sizes="65vw"
            />
          </div>
          <div
            ref={leftGlowUnderRightRef}
            className="absolute bottom-0 right-0 z-0 h-[88vh] w-[62vw] translate-x-[28%] translate-y-[22%] opacity-0"
          >
            <Image
              src="/images/left.png"
              alt=""
              fill
              className="object-contain object-bottom-right"
              sizes="62vw"
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

      <div ref={scrollRootRef} className="min-h-[1240vh] w-full" aria-hidden />

      <h1 className="sr-only">
        Logixa Lab — Engineering and Intelligence. AI Solutions Built for
        Real-World Impact.
      </h1>

      {/* z: Engineering 10 — logo 20 — Intelligence 30 */}
      <div
        ref={engineeringRef}
        className="pointer-events-none fixed left-0 top-[65%] z-10 min-w-0 max-w-[min(96vw,58%)] -translate-y-1/2 overflow-x-clip px-2 will-change-transform md:max-w-[70%] md:px-4 lg:px-6"
        style={{ fontSize: "var(--hero-display)" }}
      >
        <span
          className="font-heading inline-block max-w-7xl wrap-break-word font-normal leading-[1.05] tracking-[-0.04em] text-white"
          style={displayStyle}
        >
          Engineering
        </span>
      </div>

      <div
        ref={intelligenceRef}
        className="pointer-events-none fixed right-0 top-[76%] z-30 flex min-w-0 max-w-[min(96vw,58%)] -translate-y-1/2 justify-end overflow-x-clip px-2 will-change-transform md:top-[80%] md:max-w-[70%] md:px-4 lg:px-6"
        style={{ fontSize: "var(--hero-display)" }}
      >
        <span
          className="font-heading inline-block max-w-full wrap-break-word text-right font-normal leading-[1.05] tracking-[-0.04em] text-white"
          style={displayStyle}
        >
          Intelligence
        </span>
      </div>

      <aside
        ref={leftRailRef}
        className="pointer-events-auto fixed right-4 top-24 z-45 w-[calc(100%-2rem)] max-w-[360px] text-left will-change-transform md:right-12 md:top-28"
      >
        <div
          className="leading-snug md:text-base"
          style={{
            width: "100%",
            fontSize: "var(--hero-body-size)",
          }}
        >
          <p className="font-semibold text-white/92">
            We Build the Software
            <br />
            That Runs Your Business
          </p>
          <p className="mt-3 text-white/78">
            From AI-powered automation to full-stack custom development -
            Logixalab turns complex problems into clean, scalable digital
            products.
          </p>
        </div>
        <Link
          href="#contact"
          className="mt-3 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-(--hero-accent) transition-opacity hover:opacity-85 md:mt-4"
        >
          <Image
            src="/images/Icon Gradient.png"
            alt=""
            width={30}
            height={30}
            className="h-[25px] w-[25px] shrink-0 object-contain"
          />
          <RandomLetterSwapPingPong
            label="Start a New Project"
            className="text-inherit"
            staggerDuration={0.025}
          />
        </Link>
      </aside>

      <aside
        ref={nextRailRef}
        className="fixed inset-x-0 top-1/2 z-45 flex -translate-y-1/2 justify-start px-5 md:px-10"
      >
        <div className="w-full max-w-[min(92vw,56rem)]">
          <p className="font-heading flex flex-wrap justify-start gap-x-[0.35em] gap-y-2 text-left text-balance text-[clamp(1.35rem,4.2vw,3rem)] font-semibold leading-[1.12] tracking-[-0.02em] text-(--hero-accent)">
            {(
              "We're not a one-trick agency. Logixalab covers the full spectrum - from designing your brand to deploying your cloud infrastructure. Whatever your business needs to grow, we build it."
            )
              .split(/\s+/)
              .map((word, wi) => (
                <span key={`nr-w-${wi}`} className="inline-flex">
                  {Array.from(word).map((char, ci) => (
                    <span
                      key={`nr-c-${wi}-${ci}`}
                      data-reveal-char=""
                      className="inline-block will-change-[filter,opacity]"
                    >
                      {char}
                    </span>
                  ))}
                </span>
              ))}
          </p>
        </div>
      </aside>

      {/* Impact stage — single fixed-canvas frame with absolute layers. */}
      <div
        ref={impactSplitRef}
        className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
        aria-hidden
      >
        {/* Headings block — animates from viewport center → top-left. */}
        <div
          ref={headingsBlockRef}
          className="absolute will-change-transform"
        >
          <p
            ref={impactSmallRef}
            className="font-sans text-[clamp(0.8125rem,1.35vw,1rem)] font-medium uppercase tracking-[0.12em] text-white/90"
          >
            AI Solutions Built for
          </p>
          <h2
            ref={impactBigRef}
            className="mt-1 whitespace-nowrap text-left font-heading text-[clamp(1.75rem,min(8vw,7.5rem),6.75rem)] font-normal leading-[1.05] tracking-[-0.04em] text-white"
            style={{ textShadow: "0 2px 48px rgba(0,0,0,0.45)" }}
          >
            {"Real-World Impact".split("").map((char, i) => (
              <span
                key={`im-${i}`}
                data-impact-char=""
                className="inline-block will-change-[filter,opacity]"
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h2>
        </div>

        {/* Center image — placeholder (scales from 0 → 1.45). */}
        <div
          ref={centerImageRef}
          className="absolute will-change-transform"
          style={{ width: "min(28vw,360px)", aspectRatio: "3/4" }}
        >
          <div className="h-full w-full rounded-md border border-dashed border-white/35 bg-linear-to-br from-neutral-600/55 via-neutral-800/70 to-black/85 shadow-[0_24px_80px_rgba(0,0,0,0.55)]" />
        </div>

        {/* Right paragraph — fades in after headings shrink. */}
        <div
          ref={rightCopyRef}
          className="absolute right-[5%] top-[42%] w-[min(280px,30vw)] will-change-transform md:right-[6%]"
        >
          <p className="text-[14px] leading-relaxed text-white/85">
            We&apos;ve seen what happens when businesses choose the wrong tech
            partner. We built Logixalab to be the opposite of that.
          </p>
        </div>

        {/* Carousel rail — horizontal scroll across 5 placeholder cards. */}
        <div
          ref={carouselStageRef}
          className="absolute inset-x-0 bottom-[6%] flex items-end justify-center will-change-transform md:bottom-[8%]"
        >
          <div
            ref={carouselRailRef}
            className="flex items-end gap-6 will-change-transform"
            style={{ paddingLeft: "30vw", paddingRight: "30vw" }}
          >
            {[
              "from-blue-900/40 to-neutral-900/80",
              "from-emerald-900/40 to-neutral-900/80",
              "from-purple-900/40 to-neutral-900/80",
              "from-amber-900/40 to-neutral-900/80",
              "from-rose-900/40 to-neutral-900/80",
            ].map((tint, i) => (
              <div
                key={`carousel-card-${i}`}
                className="shrink-0 will-change-transform"
                style={{ width: "min(28vw,340px)", aspectRatio: "3/4" }}
              >
                <div
                  className={`h-full w-full rounded-md border border-dashed border-white/30 bg-linear-to-br ${tint} shadow-[0_24px_80px_rgba(0,0,0,0.5)]`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PHASE 4 — “AI for Every Industry” stage. */}
      <div
        ref={industryStageRef}
        className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
        aria-hidden
      >
        {/* Heading — top-left */}
        <h2
          ref={industryHeadingRef}
          className="absolute left-[5%] top-[18%] font-heading text-[clamp(2rem,7vw,5rem)] font-normal leading-[1.05] tracking-[-0.04em] text-white will-change-transform md:left-[6%] md:top-[20%]"
          style={{ textShadow: "0 2px 48px rgba(0,0,0,0.45)" }}
        >
          AI for Every
          <br />
          Industry
        </h2>

        {/* Stat copy — bottom-right */}
        <p
          ref={industryStatRef}
          className="absolute bottom-[12%] right-[5%] w-[min(280px,32vw)] text-[14px] leading-relaxed text-white/85 will-change-transform md:right-[6%]"
        >
          <span className="font-semibold tracking-wide text-white">
            LOGIXA LAB
          </span>{" "}
          helped us automate 60% of our operations and improve decision accuracy
          by 40%.
        </p>

        {/* Card cluster — placeholders rise from bottom */}
        <div ref={industryCardsRef} className="absolute inset-0">
          {[
            {
              left: "12%",
              top: "26%",
              w: "min(22vw,260px)",
              tint: "from-sky-700/40 via-neutral-800/70 to-black/85",
            },
            {
              right: "22%",
              top: "32%",
              w: "min(22vw,260px)",
              tint: "from-amber-700/35 via-neutral-800/70 to-black/85",
            },
            {
              left: "38%",
              top: "20%",
              w: "min(20vw,240px)",
              tint: "from-emerald-700/35 via-neutral-800/70 to-black/85",
            },
            {
              right: "8%",
              top: "16%",
              w: "min(20vw,240px)",
              tint: "from-rose-700/35 via-neutral-800/70 to-black/85",
            },
          ].map((card, i) => (
            <div
              key={`industry-card-${i}`}
              data-industry-card
              className="absolute will-change-transform"
              style={{
                left: card.left,
                right: card.right,
                top: card.top,
                width: card.w,
                aspectRatio: "3/4",
              }}
            >
              <div
                className={`h-full w-full rounded-md border border-dashed border-white/30 bg-linear-to-br ${card.tint} shadow-[0_24px_80px_rgba(0,0,0,0.55)]`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
