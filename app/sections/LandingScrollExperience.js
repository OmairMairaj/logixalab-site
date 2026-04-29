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
  const cardsStageRef = useRef(null);
  const cardsRailRef = useRef(null);

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
    const cardsStage = cardsStageRef.current;
    const cardsRail = cardsRailRef.current;
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
      !cardsStage ||
      !cardsRail
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
      const cardWraps = cardsRail.querySelectorAll("[data-carousel-wrap]");
      const cardEls = cardsRail.querySelectorAll("[data-carousel-card]");
      const leftCard = cardEls[0];
      const centerCard = cardEls[1];
      const rightCard = cardEls[2];
      const centerWrap = cardWraps[1];
      const leftWrap = cardWraps[0];
      const rightWrap = cardWraps[2];
      const cardTargetW = () =>
        Math.min(600, Math.max(280, window.innerWidth * 0.42));
      const cardWSnap = cardTargetW();

      if (centerCard && centerWrap) {
        /* Fixed column + scale inner card only — scaling the wrap reads as “from the left” in flex rows. */
        gsap.set(centerWrap, {
          width: cardTargetW(),
          opacity: 1,
          overflow: "visible",
          force3D: true,
        });
        gsap.set(centerCard, {
          scale: 0.2,
          opacity: 1,
          /* Bottom-aligned row: grow from center horizontally + base vertically (matches Figma stack). */
          transformOrigin: "50% 100%",
          force3D: true,
        });
      }
      /* Inactive slides: ~65% size, dimmed — sit under center (z) per Figma. */
      const sideScale = 0.66;
      const sideOpacity = 0.48;
      if (leftCard) {
        gsap.set(leftCard, {
          scale: sideScale,
          opacity: sideOpacity,
          transformOrigin: "50% 100%",
          force3D: true,
        });
      }
      if (rightCard) {
        gsap.set(rightCard, {
          scale: sideScale,
          opacity: sideOpacity,
          transformOrigin: "50% 100%",
          force3D: true,
        });
      }
      if (leftWrap) {
        gsap.set(leftWrap, {
          width: 0,
          opacity: 1,
          overflow: "visible",
          marginRight: 0,
        });
      }
      if (rightWrap) {
        gsap.set(rightWrap, {
          width: 0,
          opacity: 1,
          overflow: "visible",
          marginLeft: 0,
        });
      }
      /* Rail starts right so scrub moves left (incoming queue from right, past center toward left). */
      const railStartX = Math.min(cardWSnap * 0.5, window.innerWidth * 0.2);
      gsap.set(cardsRail, { x: railStartX, force3D: true });
      /* Hidden until the impact line finishes — otherwise this layer sits above Engineering/Intelligence. */
      gsap.set(cardsStage, { autoAlpha: 0, pointerEvents: "none" });

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
      const cardPause = 0.14;
      const cardScaleDur = 0.88;
      const cardScaleStart = impactRevealEnd + cardPause;
      const mergeStart = cardScaleStart + cardScaleDur;
      const mergeDur = 0.55;
      const carouselPause = 0.12;
      const carouselStart = mergeStart + mergeDur + carouselPause;
      const carouselDur = 1.15;
      const gapPx = 32;

      /* Scrub must interpolate two real lengths — not CSS clamp()/mixed keywords — or layout jumps. */
      void impactSplit.offsetHeight;
      const mergeSmallFs0 = window.getComputedStyle(impactSmall).fontSize;
      const mergeBigFs0 = window.getComputedStyle(impactBig).fontSize;
      const mergeBigMw0 = window.getComputedStyle(impactBig).maxWidth;
      const mergeBigMwFrom =
        !mergeBigMw0 || mergeBigMw0 === "none"
          ? `${Math.ceil(impactBig.getBoundingClientRect().width)}px`
          : mergeBigMw0;

      tl.to(
        cardsStage,
        {
          autoAlpha: 1,
          ease: "none",
          duration: 0.08,
        },
        cardScaleStart,
      );

      if (centerCard) {
        tl.to(
          centerCard,
          {
            scale: 1,
            transformOrigin: "50% 100%",
            ease: "none",
            duration: cardScaleDur,
          },
          cardScaleStart,
        );
      }

      tl.fromTo(
        impactSmall,
        { fontSize: mergeSmallFs0 },
        {
          fontSize: "0.8125rem",
          ease: "none",
          duration: mergeDur,
        },
        mergeStart,
      );

      tl.fromTo(
        impactBig,
        {
          fontSize: mergeBigFs0,
          maxWidth: mergeBigMwFrom,
        },
        {
          fontSize: "1.625rem",
          maxWidth: "420px",
          ease: "none",
          duration: mergeDur,
        },
        mergeStart,
      );

      if (leftWrap) {
        tl.to(
          leftWrap,
          {
            width: cardWSnap,
            marginRight: gapPx / 2,
            ease: "none",
            duration: carouselDur * 0.45,
          },
          carouselStart,
        );
      }
      if (rightWrap) {
        tl.to(
          rightWrap,
          {
            width: cardWSnap,
            marginLeft: gapPx / 2,
            ease: "none",
            duration: carouselDur * 0.45,
          },
          carouselStart,
        );
      }

      tl.fromTo(
        cardsRail,
        { x: railStartX },
        {
          x: -(cardWSnap + gapPx),
          ease: "none",
          duration: carouselDur,
        },
        carouselStart,
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

      <div ref={scrollRootRef} className="min-h-[920vh] w-full" aria-hidden />

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
              "Forward-thinking AI solutions company dedicated to transforming businesses through intelligent technology."
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

      {/* Figma hero: left column = stacked headings; right = carousel; row vertically centered */}
      <div
        className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center px-5 py-10 md:px-10 md:py-12"
        aria-hidden
      >
        <div
          ref={impactSplitRef}
          className="flex h-full w-full max-w-[min(100%,1800px)] flex-col items-stretch justify-center gap-10 md:flex-row md:items-center md:gap-8 lg:gap-14"
        >
          <div className="relative z-20 flex min-h-0 min-w-0 flex-1 flex-col items-start justify-center gap-2 md:max-w-[min(48vw,36rem)] lg:max-w-[min(42rem,44%)]">
            <p
              ref={impactSmallRef}
              className="relative max-w-[min(92vw,28rem)] font-sans text-[clamp(0.8125rem,1.35vw,1rem)] font-medium uppercase tracking-[0.12em] text-white/90"
            >
              AI Solutions Built for{" "}
            </p>
            <h2
              ref={impactBigRef}
              className="relative w-max max-w-full whitespace-nowrap text-left font-heading text-[clamp(1.75rem,min(8vw,7.5rem),6.75rem)] font-normal leading-[1.05] tracking-[-0.04em] text-white"
              style={{
                textShadow: "0 2px 48px rgba(0,0,0,0.45)",
              }}
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

          <div
            ref={cardsStageRef}
            className="relative z-0 flex min-h-[min(320px,42vh)] w-full min-w-0 flex-1 items-center justify-center overflow-visible md:min-h-0 md:justify-end opacity-0 invisible"
          >
            <div
              ref={cardsRailRef}
              className="flex w-max max-w-none items-end justify-end gap-0 will-change-transform"
            >
          {[
            { pos: "25% 50%" },
            { pos: "50% 40%" },
            { pos: "72% 55%" },
          ].map((crop, i) => (
            <div
              key={`carousel-${i}`}
              data-carousel-wrap=""
              className={`relative flex shrink-0 items-end justify-center overflow-visible ${i === 1 ? "z-30" : "z-10 -mx-1.5"}`}
            >
              <div
                data-carousel-card=""
                className="relative mx-auto w-full max-w-[min(100%,400px)] overflow-hidden rounded-lg border border-white/15 bg-neutral-900/40 shadow-[0_24px_80px_rgba(0,0,0,0.45)] aspect-3/5 max-h-[min(72vh,680px)] sm:max-w-[min(100%,460px)]"
              >
                <Image
                  src="/images/Background.png"
                  alt=""
                  fill
                  className="object-cover"
                  style={{ objectPosition: crop.pos }}
                  sizes="(max-width: 768px) 90vw, 600px"
                  priority={i === 1}
                />
              </div>
            </div>
          ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
